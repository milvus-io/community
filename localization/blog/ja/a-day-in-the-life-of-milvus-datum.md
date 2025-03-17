---
id: a-day-in-the-life-of-milvus-datum.md
title: milvusの一日
author: 'Stefan Webb, Anthony Tu'
date: 2025-03-17T00:00:00.000Z
desc: では、Milvusことデーブの1日を散策してみよう。
cover: assets.zilliz.com/a_day_in_the_life_of_a_milvus_datum_ca279f7f59.png
tag: Engineering
tags: 'Deep Research, open source AI, Milvus, LangChain, DeepSeek R1'
recommend: true
canonicalUrl: 'https://milvus.io/blog/a-day-in-the-life-of-milvus-datum.md'
---
<p>Milvusのような、何十億ものベクターに対応し、ウェブスケールのトラフィックを処理する高性能な<a href="https://zilliz.com/learn/what-is-vector-database">ベクターデータベースを</a>構築することは、簡単なことではありません。分散システムを注意深く、インテリジェントに設計する必要があります。必然的に、このようなシステムの内部では、パフォーマンスとシンプルさの間でトレードオフが生じます。</p>
<p>我々はこのトレードオフのバランスをうまく取ろうとしてきたが、内部のいくつかの側面は不透明なままであった。本記事では、Milvusがノード間でどのようにデータ挿入、インデックス作成、サービングを分解しているのかについて、謎を払拭することを目的とする。これらのプロセスを高いレベルで理解することは、クエリのパフォーマンス、システムの安定性、デバッグ関連の問題を効果的に最適化するために不可欠です。</p>
<p>それでは、MilvusのデータムであるDaveの一日を散策してみましょう。Daveを<a href="https://milvus.io/docs/install-overview.md#Milvus-Distributed">Milvus分散配置の</a>コレクションに挿入したとします（下図参照）。Daveは直接コレクションに挿入されます。しかし、その裏では、独立したサブシステム間で多くのステップが発生しています。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/a_day_in_the_life_of_a_milvus_datum_ca279f7f59.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Proxy-Nodes-and-the-Message-Queue" class="common-anchor-header">プロキシノードとメッセージキュー<button data-href="#Proxy-Nodes-and-the-Message-Queue" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Proxy_Nodes_and_the_Message_Queue_03a0fde0c5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>最初に、例えばPyMilvusライブラリを介してMilvusClientオブジェクトを呼び出し、<code translate="no">_insert()</code>_リクエストを<em>プロキシノードに</em>送信します。プロキシノードはユーザとデータベースシステムの間のゲートウェイであり、受信トラフィックの負荷分散や、ユーザに返す前に複数の出力を照合するような処理を実行します。</p>
<p>ハッシュ関数がアイテムのプライマリ・キーに適用され、どの<em>チャネルに</em>送信すべきかが決定されます。PulsarまたはKafkaトピックを使って実装されるチャネルは、ストリーミング・データを保持し、チャネルのサブスクライバに送ることができる。</p>
<h2 id="Data-Nodes-Segments-and-Chunks" class="common-anchor-header">データ・ノード、セグメント、チャンク<button data-href="#Data-Nodes-Segments-and-Chunks" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Data_Nodes_Segments_and_Chunks_ae122dd1ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>データが適切なチャネルに送信されると、チャネルはそれを<em>データ・ノード</em>内の対応するセグメントに送信する。データノードは<em>グロースイングセグメントと</em>呼ばれるデータバッファの保存と管理を担当する。成長セグメントは1つのシャードにつき1つある。</p>
<p>データがセグメントに挿入されると、セグメントは最大サイズに向かって成長し、デフォルトでは122MBになる。この間、セグメントの小さな部分（デフォルトでは16MB、<em>チャンクと</em>呼ばれる）は、例えばAWSのS3やMinIOのような互換性のあるストレージを使用して、永続ストレージにプッシュされる。各チャンクはオブジェクトストレージ上の物理ファイルであり、フィールドごとに個別のファイルが存在する。上の図はオブジェクトストレージ上のファイル階層を示している。</p>
<p>まとめると、コレクションのデータはデータノードに分割され、その中でバッファリングのためにセグメントに分割され、さらに永続ストレージのためにフィールドごとのチャンクに分割されます。上の2つの図がこれをより明確にしている。このように受信データを分割することで、クラスタのネットワーク帯域幅、計算、ストレージの並列性を完全に利用することができる。</p>
<h2 id="Sealing-Merging-and-Compacting-Segments" class="common-anchor-header">セグメントのシーリング、マージ、コンパクト化<button data-href="#Sealing-Merging-and-Compacting-Segments" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Sealing_Merging_and_Compacting_Segments_d5a6a37261.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>ここまで、友好的なデータムであるDaveが、<code translate="no">_insert()</code>_クエリから永続的なストレージに移動するまでのストーリーを語ってきた。もちろん、Daveの物語はこれで終わりではありません。検索とインデックス作成のプロセスをより効率的にするために、さらなるステップがある。セグメントのサイズと数を管理することで、システムはクラスタの並列性をフルに活用する。</p>
<p>セグメントがデータノード上の最大サイズ（デフォルトでは122MB）に達すると、そのセグメントは<em>封印さ</em>れるという。これが意味するのは、データノード上のバッファがクリアされ、新しいセグメントへの移行が可能になり、永続ストレージ内の対応するチャンクがクローズドセグメントに属するものとしてマークされるということである。</p>
<p>データノードは、1セグメントあたりの最大サイズが1GB（デフォルト）に達するまで、定期的に封印された小さなセグメントを探し、それらを大きなセグメントにマージする。Milvusでアイテムが削除されると、削除フラグが付けられる。セグメント内の削除されたアイテムの数が所定のしきい値（デフォルトでは20%）を超えると、セグメントのサイズが<em>縮小</em>されます。</p>
<p>セグメントのインデックス化と検索</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Indexing_and_Searching_through_Segments_478c0067be.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Indexing_and_Searching_through_Segments_1_0c31b5a340.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>インデックスノードという</em>追加のノードがあり、このノードが密封されたセグメントのインデックスを作成します。セグメントが封印されると、データノードはインデックスを作成するためにインデックスノードにリクエストを送る。その後、インデックスノードは、完成したインデックスをオブジェクトストレージに送信します。各シールされたセグメントには、それぞれ別のファイルに格納されたインデックスがあります。このファイルは、バケットにアクセスして手動で調べることができます。ファイル階層については、上の図を参照してください。</p>
<p>データノードだけでなく、クエリノードも対応するシャードのメッセージキュートピックにサブスクライブします。成長中のセグメントはクエリノードに複製され、ノードは必要に応じてコレクションに属する密封されたセグメントをメモリにロードします。データが送られてくると、それぞれの成長中のセグメントに対してインデックスを作成し、データストアから密封されたセグメントに対して最終的なインデックスをロードします。</p>
<p>ここで、Daveを含む<em>search()</em>リクエストでMilvusClientオブジェクトを呼び出したとする。プロキシノードを経由してすべてのクエリノードにルーティングされた後、各クエリノードはベクトル類似性検索（またはクエリ、範囲検索、グルーピング検索などの検索メソッド）を実行し、セグメントを一つずつ繰り返し検索します。結果はMapReduceのような方法でノード間で照合され、ユーザーに送り返される。Daveはやっとあなたと再会できたと喜んでいる。</p>
<h2 id="Discussion" class="common-anchor-header">ディスカッション<button data-href="#Discussion" class="anchor-icon" translate="no">
      <svg translate="no"
        aria-hidden="true"
        focusable="false"
        height="20"
        version="1.1"
        viewBox="0 0 16 16"
        width="16"
      >
        <path
          fill="#0092E4"
          fill-rule="evenodd"
          d="M4 9h1v1H4c-1.5 0-3-1.69-3-3.5S2.55 3 4 3h4c1.45 0 3 1.69 3 3.5 0 1.41-.91 2.72-2 3.25V8.59c.58-.45 1-1.27 1-2.09C10 5.22 8.98 4 8 4H4c-.98 0-2 1.22-2 2.5S3 9 4 9zm9-3h-1v1h1c1 0 2 1.22 2 2.5S13.98 12 13 12H9c-.98 0-2-1.22-2-2.5 0-.83.42-1.64 1-2.09V6.25c-1.09.53-2 1.84-2 3.25C6 11.31 7.55 13 9 13h4c1.45 0 3-1.69 3-3.5S14.5 6 13 6z"
        ></path>
      </svg>
    </button></h2><p>ここまで、<code translate="no">_insert()</code>_と<code translate="no">_search()</code>_の操作について、データムであるDaveの一日を取り上げてきた。<code translate="no">_delete()</code>_や<code translate="no">_upsert()</code>_のような他のオペレーションも同様である。必然的に、我々は議論を単純化し、より細かい詳細を省略しなければならなかった。しかし、全体としては、Milvusが分散システムにおいてノード間の並列性を堅牢かつ効率的にするためにどのように設計されているか、また、最適化やデバッグにどのように利用できるかについて、十分なイメージを持つことができたはずです。</p>
<p><em>この記事から得られる重要なポイントMilvusは、ノードの種類に関係なく分離して設計されています。各ノードタイプは相互に排他的な特定の機能を持ち、ストレージとコンピュートも分離されている。</em>その結果、ユースケースやトラフィックパターンに応じてパラメータを調整することで、各コンポーネントを独立して拡張することができる。例えば、データノードやインデックスノードを拡張することなく、トラフィックの増加に対応するためにクエリノードの数を拡張することができる。このような柔軟性により、Milvusのユーザーには、数十億のベクトルを処理し、100ミリ秒以下のクエリレイテンシでウェブスケールのトラフィックに対応しているユーザーもいます。</p>
<p>また、Milvusのフルマネージドサービスである<a href="https://zilliz.com/cloud">Zilliz Cloudを</a>利用することで、分散クラスタをデプロイすることなく、Milvusの分散設計のメリットを享受することができます。<a href="https://cloud.zilliz.com/signup">今すぐZilliz Cloudの無料版にサインアップし、Daveを実行に移しましょう！</a></p>
