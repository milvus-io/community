---
id: 2022-08-05-whats-new-in-milvus-2-1.md
title: Milvus 2.1の新機能 - シンプルさとスピードを目指して
author: Xiaofan Luan
date: 2022-08-05T00:00:00.000Z
desc: オープンソースのベクターデータベースであるMilvusに、ユーザーが長い間待ち望んでいたパフォーマンスとユーザビリティの改善が施された。
cover: assets.zilliz.com/What_s_New_in_2_1_2_a0660df2a5.png
tag: News
canonicalUrl: 'https://milvus.io/blog/2022-08-05-whats-new-in-milvus-2-1.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_1_2_a0660df2a5.png" alt="What's new in Milvus 2.1 - Towards simplicity and speed" class="doc-image" id="what's-new-in-milvus-2.1---towards-simplicity-and-speed" />
   </span> <span class="img-wrapper"> <span>Milvus 2.1の新機能 - シンプルさとスピードを目指して</span> </span></p>
<p>Milvus 2.1の<a href="https://milvus.io/docs/v2.1.x/release_notes.md">リリースは</a>、Milvusコミュニティの貢献者全員による6ヶ月間の努力の末に実現しました。この人気のあるベクターデータベースのメジャーイテレーションは、<strong>パフォーマンスと</strong> <strong>ユーザビリティという</strong>2つの最も重要なキーワードに重点を置いています。文字列、Kafkaメッセージキュー、組み込みMilvusのサポートに加え、パフォーマンス、スケーラビリティ、セキュリティ、観測可能性において多くの改良を加えました。Milvus 2.1は、アルゴリズムエンジニアのラップトップからプロダクションレベルのベクトル類似検索サービスまでの「ラストワンマイル」の架け橋となるエキサイティングなアップデートです。</p>
<custom-h1>パフォーマンス - 3.2倍以上の向上</custom-h1><h2 id="5ms-level-latency" class="common-anchor-header">5msレベルの待ち時間<button data-href="#5ms-level-latency" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusはすでに近似最近傍（ANN）検索をサポートしており、従来のKNN手法から大きく飛躍している。しかしながら、スループットと待ち時間の問題は、億単位のベクトルデータ検索シナリオに対処する必要のあるユーザーにとって依然として課題となっています。</p>
<p>Milvus2.1では、検索リンクのメッセージキューに依存しない新しいルーティングプロトコルが追加され、小規模データセットの検索待ち時間が大幅に短縮された。我々のテスト結果によれば、Milvusのレイテンシは5msまで低減され、類似検索や推薦などの重要なオンラインリンクの要件を満たしている。</p>
<h2 id="Concurrency-control" class="common-anchor-header">同時実行制御<button data-href="#Concurrency-control" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1では、新しいコスト評価モデルと同時実行スケジューラを導入することで、同時実行モデルを微調整している。これにより、CPUやキャッシュのリソースを競合する多数の同時リクエストが発生したり、十分なリクエストがないためにCPUが十分に使用されなかったりすることがなくなります。また、Milvus 2.1の新しいインテリジェントなスケジューラレイヤーは、一貫したリクエストパラメータを持つsmall-nqクエリをマージし、small-nqかつ高いクエリ並行性を持つシナリオにおいて、3.2倍という驚異的なパフォーマンス向上を実現する。</p>
<h2 id="In-memory-replicas" class="common-anchor-header">インメモリーレプリカ<button data-href="#In-memory-replicas" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1では、小規模データセットのスケーラビリティと可用性を向上させるインメモリレプリカが導入されました。従来のデータベースのリードオンリーレプリカと同様に、インメモリレプリカはリードQPSが高い場合にマシンを追加することで水平方向に拡張することができる。小規模データセットのベクトル検索では、推薦システムはしばしば1台のマシンの性能限界を超えるQPSを提供する必要がある。このようなシナリオでは、複数のレプリカをメモリにロードすることで、システムのスループットを大幅に向上させることができる。将来的には、インメモリ・レプリカに基づくヘッジド・リード・メカニズムも導入する予定です。これは、システムが障害から回復する必要がある場合に備えて、他の機能的なコピーを迅速に要求するもので、メモリの冗長性をフルに活用してシステム全体の可用性を向上させます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_1_Figure_1_excalidraw_1f7fe3c998.png" alt="In-memory replicas allow query services to be based on separate
copies of the same data." class="doc-image" id="in-memory-replicas-allow-query-services-to-be-based-on-separate-copies-of-the-same-data." />
   </span> <span class="img-wrapper"> <span>インメモリーレプリカは、同じデータの別々のコピーに基づくクエリーサービスを可能にする</span>。 </span></p>
<h2 id="Faster-data-loading" class="common-anchor-header">データロードの高速化<button data-href="#Faster-data-loading" class="anchor-icon" translate="no">
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
    </button></h2><p>最後の性能向上は、データロードからもたらされる。Milvus 2.1では、Zstandard (zstd)を用いて<a href="https://milvus.io/docs/v2.1.x/glossary.md#Log-snapshot">バイナリログを</a>圧縮するようになり、オブジェクトストアとメッセージストアのデータサイズが大幅に削減され、データロード時のネットワークオーバーヘッドも削減されました。さらに、ゴルーチンプールが導入され、Milvusはメモリフットプリントを制御しながらセグメントを同時にロードし、障害からの回復とデータのロードに必要な時間を最小化できるようになりました。</p>
<p>Milvus 2.1の完全なベンチマーク結果は、近日中に弊社ウェブサイトで公開される予定です。ご期待ください。</p>
<h2 id="String-and-scalar-index-support" class="common-anchor-header">文字列およびスカラーインデックスのサポート<button data-href="#String-and-scalar-index-support" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1では、スカラーデータ型として可変長文字列(VARCHAR)をサポートしました。VARCHARは出力として返される主キーとして使用することができ、属性フィルタとしても機能します。<a href="https://milvus.io/docs/v2.1.x/hybridsearch.md">属性フィルタは</a>Milvusユーザが最も必要とする機能の一つです。<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo>200</mo><mn>-200</mn></mrow></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">〜</span><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord"></span><span class="mord">200</span><span class="mord">-300の</span></span></span></span>価格帯で、ユーザーに最も近い商品を見つけたい」、「キーワード &quot;ベクトルデータベース &quot;を持ち、クラウドネイティブのトピックに関連する記事を見つけたい」と思うことが多いのであれば、Milvus 2.1を気に入ることでしょう。</p>
<p>Milvus2.1では、データ構造として<a href="https://www.cs.le.ac.uk/people/ond1/XMLcomp/confersWEA06_LOUDS.pdf">簡潔な</a><a href="https://github.com/s-yata/marisa-trie">MARISA-Triesに</a>基づくフィルタリング速度を向上させるスカラー転置インデックスもサポートしている。全てのデータを非常に少ないフットプリントでメモリにロードできるようになり、文字列の比較、フィルタリング、接頭辞マッチングがより迅速に行えるようになった。我々のテスト結果によれば、MARISA-trieのメモリ要件は、全てのデータをメモリにロードしクエリー機能を提供するPython辞書の10%に過ぎない。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_new_in_Milvus_Figure_2_excalidraw_a1149aca96.png" alt="Milvus 2.1 combines MARISA-Trie with inverted index to significantly improve filtering speed." class="doc-image" id="milvus-2.1-combines-marisa-trie-with-inverted-index-to-significantly-improve-filtering-speed." />
   </span> <span class="img-wrapper"> <span>Milvus2.1はMARISA-Trieと転置インデックスを組み合わせ、フィルタリング速度を大幅に向上させる。</span> </span></p>
<p>今後、Milvusはスカラークエリ関連の開発に引き続き注力し、より多くのスカラインデックスタイプとクエリ演算子をサポートし、ディスクベースのスカラークエリ機能を提供する予定である。</p>
<custom-h1>ユーザビリティの向上</custom-h1><h2 id="Kafka-support" class="common-anchor-header">Kafka サポート<button data-href="#Kafka-support" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus2.1では、Milvusの抽象化およびカプセル化設計とConfluentが提供するGo Kafka SDKにより、ユーザの設定に応じて<a href="https://pulsar.apache.org">Pulsar</a>または<a href="https://kafka.apache.org">Kafkaを</a> <a href="https://milvus.io/docs/v2.1.x/deploy_pulsar.md">メッセージ</a>・ストレージとして使用するオプションを提供します。</p>
<h2 id="Production-ready-Java-SDK" class="common-anchor-header">プロダクション対応のJava SDK<button data-href="#Production-ready-Java-SDK" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1では、<a href="https://github.com/milvus-io/milvus-sdk-java">Java SDKが</a>正式にリリースされました。Java SDKはPython SDKと全く同じ機能を持ち、並行処理性能はさらに向上しています。次のステップでは、コミュニティの貢献者がJava SDKのドキュメントとユースケースを徐々に改善し、GoとRESTful SDKもプロダクションレディの段階へと押し上げる手助けをします。</p>
<h2 id="Observability-and-maintainability" class="common-anchor-header">観測可能性と保守性<button data-href="#Observability-and-maintainability" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1では、ベクトル挿入数、検索レイテンシ/スループット、ノードメモリオーバーヘッド、CPUオーバーヘッドなどの重要な監視<a href="https://milvus.io/docs/v2.1.x/metrics_dashboard.md">メトリクスが</a>追加されました。さらに、新バージョンでは、ログレベルを調整し、無駄なログ出力を削減することで、ログ保持を大幅に最適化しています。</p>
<h2 id="Embedded-Milvus" class="common-anchor-header">組み込みMilvus<button data-href="#Embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusは大規模な大規模ベクトルデータ検索サービスの展開を大幅に簡素化したが、小規模なアルゴリズムを検証したい科学者にとっては、DockerやK8sはまだ不必要に複雑すぎる。<a href="https://github.com/milvus-io/embd-milvus">組み込みMilvusの</a>導入により、PyrocksbやPysqliteと同様に、pipを使ってMilvusをインストールできるようになった。組み込みMilvusは、クラスタ版とスタンドアロン版のすべての機能をサポートしており、コードを一行も変更することなく、ラップトップから分散本番環境に簡単に切り替えることができる。アルゴリズムエンジニアは、Milvusを使ってプロトタイプを構築する際に、より良い経験をすることができます。</p>
<custom-h1>すぐに使えるベクトル検索を今すぐ試す</custom-h1><p>さらに、Milvus 2.1では、安定性とスケーラビリティが大幅に改善されました。</p>
<h2 id="Whats-next" class="common-anchor-header">今後の予定<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li>Milvus 2.1の変更点については<a href="https://milvus.io/docs/v2.1.x/release_notes.md">リリースノートを</a>ご覧ください。</li>
<li>Milvus 2.1を<a href="https://milvus.io/docs/v2.1.x/install_standalone-docker.md">インストール</a>し、新機能をお試しください。</li>
<li><a href="https://slack.milvus.io/">Slackコミュニティに</a>参加し、世界中のMilvusユーザーと新機能について議論しましょう。</li>
<li><a href="https://twitter.com/milvusio">Twitterや</a><a href="https://www.linkedin.com/company/the-milvus-project">LinkedInで</a>フォローして、特定の新機能に関するブログが公開されたら、最新情報を入手してください。</li>
</ul>
<blockquote>
<p>編集：<a href="https://github.com/songxianj">Songxian Jiang</a></p>
</blockquote>
