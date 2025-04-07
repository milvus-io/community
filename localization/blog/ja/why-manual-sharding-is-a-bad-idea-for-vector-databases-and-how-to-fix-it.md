---
id: why-manual-sharding-is-a-bad-idea-for-vector-databases-and-how-to-fix-it.md
title: ベクター・データベースで手動シャーディングが良くない理由と修正方法
author: James Luan
date: 2025-03-18T00:00:00.000Z
desc: >-
  手作業によるベクターデータベースのシャーディングがなぜボトルネックを生むのか、Milvusの自動スケーリングがいかにエンジニアリングのオーバーヘッドを排除し、シームレスな成長を実現するかをご覧ください。
cover: >-
  assets.zilliz.com/Why_Manual_Sharding_is_a_Bad_Idea_for_Vector_Database_And_How_to_Fix_It_1_968a5be504.png
tag: Engineering
tags: 'Milvus, Vector Database, Milvus, AI Infrastructure, Automated Sharding'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/why-manual-sharding-is-a-bad-idea-for-vector-databases-and-how-to-fix-it.md
---
<p><em>「私たちは当初、Milvusではなくpgvectorでセマンティック検索を構築しました。すべてのリレーショナルデータがすでにPostgreSQLにあったから</em>です」とエンタープライズAI SaaSスタートアップのCTO、アレックスは振り返る。<em>「しかし、プロダクト・マーケット・フィットを達成するやいなや、私たちの成長はエンジニアリング面で深刻なハードルにぶつかりました。pgvectorはスケーラビリティのために設計されていないことがすぐに明らかになりました。スキーマの更新を複数のシャードで展開するといった単純なタスクが、退屈でミスの発生しやすいプロセスに変わり、エンジニアリングの労力を何日も費やすことになったのです。ベクターの埋め込み数が1億に達したとき、クエリのレイテンシは1秒以上に跳ね上がりました。Milvusに移行してからは、手作業でのシャーディングは石器時代に足を踏み入れたような気分でした。シャード・サーバーを壊れやすい人工物のように扱うのは楽しいことではありません。どの企業もそれに耐える必要はありません。"</em></p>
<h2 id="A-Common-Challenge-for-AI-Companies" class="common-anchor-header">AI企業共通の課題<button data-href="#A-Common-Challenge-for-AI-Companies" class="anchor-icon" translate="no">
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
    </button></h2><p>アレックスの経験はpgvectorユーザーだけのものではない。pgvector、Qdrant、Weaviateなど、手動シャーディングに依存するベクターデータベースを使用していても、スケーリングの課題は変わりません。管理可能なソリューションとしてスタートしても、データ量が増えるにつれて、すぐに技術的な負債に変わります。</p>
<p>今日の新興企業にとって、<strong>スケーラビリティはオプションではなく、ミッションクリティカルだ</strong>。これは、大規模言語モデル（LLM）やベクトル・データベースを利用したAI製品に特に当てはまり、初期採用から指数関数的成長への飛躍は一夜にして起こりうる。プロダクト・マーケット・フィットの達成は、多くの場合、ユーザー数の急増、圧倒的なデータ流入、クエリ要求の急増を引き起こします。しかし、データベース・インフラがそれについていけなければ、クエリの速度低下や運用の非効率性によって勢いが止まり、ビジネスの成功が妨げられる可能性がある。</p>
<p>短期的な技術的決断が長期的なボトルネックにつながる可能性もあり、エンジニアリングチームはイノベーションに集中する代わりに、緊急のパフォーマンス問題、データベースクラッシュ、システム障害に常に対処することを余儀なくされる。最悪のシナリオは？コストと時間のかかるデータベースの再構築が必要になる。</p>
<h2 id="Isn’t-Sharding-a-Natural-Solution-to-Scalability" class="common-anchor-header">シャーディングはスケーラビリティに対する自然な解決策ではないのか？<button data-href="#Isn’t-Sharding-a-Natural-Solution-to-Scalability" class="anchor-icon" translate="no">
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
    </button></h2><p>スケーラビリティには複数の方法がある。最も単純なアプローチである<strong>スケーリング・アップでは</strong>、データ量の増加に対応するためにCPU、メモリ、ストレージを追加することで、1台のマシンのリソースを強化する。シンプルではあるが、この方法には明確な限界がある。例えばKubernetes環境では、大規模なポッドは非効率的であり、単一のノードに依存することで障害のリスクが高まり、重大なダウンタイムにつながる可能性がある。</p>
<p>Scaling Upがもはや実行不可能な場合、企業は当然<strong>Scaling Outに</strong>目を向け、複数のサーバーにデータを分散させる。一見すると、<strong>シャーディングは</strong>単純なソリューションに見えます。データベースをより小さな独立したデータベースに分割することで、容量を増やし、書き込み可能なプライマリノードを複数用意することができます。</p>
<p>しかし、概念的には簡単でも、実際にはシャーディングはすぐに複雑な課題となります。ほとんどのアプリケーションは、最初は単一の統一されたデータベースで動作するように設計されています。ベクターデータベースが複数のシャードに分割された瞬間、データと相互作用するアプリケーションのすべての部分を修正するか、完全に書き直す必要があり、重大な開発オーバーヘッドが発生します。効果的なシャーディング戦略を設計することは、データが正しいシャードに誘導されるようにルーティング・ロジックを実装することと同様に、極めて重要になります。複数のシャードにまたがるアトミック・トランザクションを管理するには、クロスシャード操作を避けるためにアプリケーションを再構築する必要があります。さらに、特定のシャードが利用できなくなった場合の混乱を防ぐため、障害シナリオを優雅に処理する必要があります。</p>
<h2 id="Why-Manual-Sharding-Becomes-a-Burden" class="common-anchor-header">手動シャーディングが負担になる理由<button data-href="#Why-Manual-Sharding-Becomes-a-Burden" class="anchor-icon" translate="no">
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
    </button></h2><p><em>「当初、pgvector データベースに手動シャーディングを実装するには、2 人のエンジニアが約半年かかると見積もっていました</em> <em>。スキーマの変更、データのリバランシング、スケーリングの決定には、必ず彼らの専門知識が必要でした。私たちは、データベースを稼動させ続けるために、実質的に常設の &quot;シャーディング・チーム &quot;にコミットしていたのです」。</em></p>
<p>シャーディング・ベクター・データベースに関する実際の課題には、以下のようなものがある：</p>
<ol>
<li><p><strong>データ分散の不均衡（ホットスポット）</strong>：データ分散の不均衡（ホットスポット）：マルチテナントのユースケースでは、テナントごとに数百から数十億のベクターがデータ分散されることがあります。この不均衡により、特定のシャードが過負荷になる一方で、他のシャードがアイドル状態になるホットスポットが発生します。</p></li>
<li><p><strong>再シャーディングの頭痛の種</strong>適切な数のシャードを選択することはほぼ不可能です。数が少なすぎると、頻繁に再シャーディングを行うことになり、コストがかかる。多すぎると不必要なメタデータのオーバーヘッドが発生し、複雑さが増してパフォーマンスが低下する。</p></li>
<li><p><strong>スキーマ変更の複雑さ</strong>：多くのベクターデータベースは、複数の基礎データベースを管理することでシャーディングを実装しています。そのため、シャード間でのスキーマ変更の同期が面倒でエラーが発生しやすくなり、開発サイクルが遅くなります。</p></li>
<li><p><strong>リソースの浪費</strong>：ストレージ-コンピュート結合データベースでは、将来の成長を予測しながら、すべてのノードにリソースを綿密に割り当てる必要があります。通常、リソースの使用率が60～70%に達すると、再シャーディングの計画を開始する必要があります。</p></li>
</ol>
<p>簡単に言えば、<strong>シャードを手作業で管理することはビジネスに悪影響を及ぼします</strong>。エンジニアリングチームを常にシャード管理に拘束するのではなく、運用の負担なく自動的にスケールするように設計されたベクターデータベースへの投資をご検討ください。</p>
<h2 id="How-Milvus-Solves-the-Scalability-Problem" class="common-anchor-header">Milvusがスケーラビリティ問題を解決する方法<button data-href="#How-Milvus-Solves-the-Scalability-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>新興企業から企業まで、多くの開発者が手作業によるデータベースシャード化に伴う多大なオーバーヘッドを認識しています。Milvusは根本的に異なるアプローチをとり、複雑さを伴うことなく、数百万から数十億のベクターへのシームレスなスケーリングを可能にします。</p>
<h3 id="Automated-Scaling-Without-the-Tech-Debt" class="common-anchor-header">技術的負債なしにスケーリングを自動化</h3><p>Milvusは、Kubernetesと、シームレスな拡張をサポートするために分離されたストレージ-コンピュートアーキテクチャを活用しています。この設計は以下を可能にします：</p>
<ul>
<li><p>需要の変化に対応した迅速なスケーリング</p></li>
<li><p>利用可能なすべてのノードで自動ロードバランシング</p></li>
<li><p>独立したリソース割り当てにより、コンピュート、メモリー、ストレージを個別に調整可能</p></li>
<li><p>急成長時でも一貫した高いパフォーマンス</p></li>
</ul>
<h3 id="Distributed-Architecture-Designed-from-the-Ground-Up" class="common-anchor-header">ゼロから設計された分散アーキテクチャ</h3><p>Milvusは、2つの重要な革新技術によってスケーリング機能を実現しています：</p>
<p><strong>セグメントベースのアーキテクチャ</strong>Milvusの中核は、データをデータ管理の最小単位である「セグメント」に整理することです：</p>
<ul>
<li><p>Growing SegmentはStreamNodes上に配置され、リアルタイムクエリのためにデータの鮮度を最適化します。</p></li>
<li><p>密閉されたセグメントはクエリノードで管理され、強力なインデックスを利用して検索を高速化します。</p></li>
<li><p>これらのセグメントはノードに均等に分散され、並列処理を最適化します。</p></li>
</ul>
<p><strong>2層ルーティング</strong>：各シャードが1台のマシンに存在する従来のデータベースとは異なり、Milvusは1つのシャードのデータを複数のノードに動的に分散します：</p>
<ul>
<li><p>各シャードには10億以上のデータを格納可能</p></li>
<li><p>各シャード内のセグメントは自動的にマシン間でバランスされます。</p></li>
<li><p>コレクションの拡張は、シャードの数を増やすのと同じくらい簡単です。</p></li>
<li><p>次期Milvus 3.0ではダイナミックシャード分割が導入され、この最小限の手動ステップさえも不要になります。</p></li>
</ul>
<h3 id="Query-Processing-at-Scale" class="common-anchor-header">スケールでのクエリ処理</h3><p>クエリを実行する際、Milvusは効率的なプロセスに従います：</p>
<ol>
<li><p>Proxyがリクエストされたコレクションに関連するシャードを特定します。</p></li>
<li><p>ProxyはStreamNodesとQueryNodesの両方からデータを収集します。</p></li>
<li><p>StreamNodesはリアルタイムのデータを処理し、QueryNodesは過去のデータを同時に処理する。</p></li>
<li><p>結果は集約され、ユーザーに返される</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Query_Processing_at_Scale_5792dc9e37.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="A-Different-Engineering-Experience" class="common-anchor-header">異なるエンジニアリング体験<button data-href="#A-Different-Engineering-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p><em>「スケーラビリティがデータベース自体に組み込まれていれば、頭痛の種はすべて解消されます</em>。<em>「私のエンジニアは、データベースのシャードのお守りをする代わりに、顧客が喜ぶ機能の構築に戻ることができるのです」。</em></p>
<p>手作業によるシャーディングのエンジニアリング負担、スケール時のパフォーマンスボトルネック、あるいはデータベース移行の困難な見通しと格闘しているのであれば、アプローチを再考する時です。Milvusのアーキテクチャの詳細については、<a href="https://milvus.io/docs/overview.md#What-Makes-Milvus-so-Scalable">ドキュメントページを</a>ご覧ください。また、<a href="https://zilliz.com/cloud">zilliz.com/cloudでは</a>、フルマネージドMilvusを使用して楽なスケーラビリティを直接体験することができます。</p>
<p>適切なベクターデータベースの基盤があれば、イノベーションに限界はありません。</p>
