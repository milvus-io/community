---
id: >-
  introducing-the-milvus-sizing-tool-calculating-and-optimizing-your-milvus-deployment-resources.md
title: Milvusサイジングツールのご紹介：Milvus導入リソースの計算と最適化
author: 'Ken Zhang, Fendy Feng'
date: 2025-04-11T00:00:00.000Z
desc: >-
  使いやすいサイジングツールを使って、Milvusのパフォーマンスを最大化しましょう！リソースを最適に利用し、コストを削減するための導入設定方法をご覧ください。
cover: assets.zilliz.com/Introducing_Milvus_Sizing_Tool_c0c98343a2.png
tag: Tutorials
recommend: false
canonicalUrl: 'https://zilliz.com/blog/demystify-milvus-sizing-tool'
---
<h2 id="Introduction" class="common-anchor-header">はじめに<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusの導入に最適な構成を選択することは、パフォーマンスの最適化、リソースの効率的な利用、コスト管理のために非常に重要です。プロトタイプの構築であれ、本番導入の計画であれ、Milvusインスタンスのサイジングを適切に行うことが、ベクターデータベースをスムーズに稼働させるか、パフォーマンスや不要なコストに悩まされるかの分かれ目になります。</p>
<p>このプロセスを簡素化するため、<a href="https://milvus.io/tools/sizing">Milvusサイジングツールを</a>刷新しました。このツールは、特定の要件に基づいて推奨リソースの見積もりを生成する、使いやすい計算ツールです。このガイドでは、Milvus Sizing Toolの使い方と、Milvusのパフォーマンスに影響を与える要因について詳しく説明します。</p>
<h2 id="How-to-Use-the-Milvus-Sizing-Tool" class="common-anchor-header">Milvusサイジングツールの使い方<button data-href="#How-to-Use-the-Milvus-Sizing-Tool" class="anchor-icon" translate="no">
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
    </button></h2><p>このサイジングツールの使い方はとても簡単です。以下の手順に従ってください。</p>
<ol>
<li><p><a href="https://milvus.io/tools/sizing/"> Milvusサイジングツールの</a>ページにアクセスします。</p></li>
<li><p>主要なパラメータを入力します：</p>
<ul>
<li><p>ベクトル数とベクトルあたりの寸法</p></li>
<li><p>インデックスタイプ</p></li>
<li><p>スカラーフィールドのデータサイズ</p></li>
<li><p>セグメントサイズ</p></li>
<li><p>ご希望の展開モード</p></li>
</ul></li>
<li><p>生成された推奨リソースを確認する</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_sizing_tool_3ca881b3d5.jpeg" alt="milvus sizing tool" class="doc-image" id="milvus-sizing-tool" />
   </span> <span class="img-wrapper"> <span>milvusサイジングツール</span> </span></p>
<p>これらのパラメータがMilvusデプロイメントにどのような影響を与えるかを見てみましょう。</p>
<h2 id="Index-Selection-Balancing-Storage-Cost-Accuracy-and-Speed" class="common-anchor-header">インデックスの選択ストレージ、コスト、精度、スピードのバランス<button data-href="#Index-Selection-Balancing-Storage-Cost-Accuracy-and-Speed" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusは<a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a>、FLAT、IVF_FLAT、IVF_SQ8、<a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">ScaNN</a>、<a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANNなど</a>様々なインデックスアルゴリズムを提供しており、それぞれメモリ使用量、必要ディスク容量、クエリ速度、検索精度において明確なトレードオフがあります。</p>
<p>ここでは、最も一般的なオプションについて知っておく必要があることを説明します：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/index_dde661d579.jpeg" alt="index" class="doc-image" id="index" />
   </span> <span class="img-wrapper"> <span>インデックス</span> </span></p>
<p>HNSW（階層型ナビゲーシブル・スモールワールド）</p>
<ul>
<li><p><strong>アーキテクチャ</strong>：スキップリストと階層構造のNSW（Navigable Small Worlds）グラフを組み合わせたもの。</p></li>
<li><p><strong>パフォーマンス</strong>非常に高速なクエリーと優れた再現率</p></li>
<li><p><strong>リソースの使用</strong>ベクトルあたり最も多くのメモリを必要とする（コストが最も高い）</p></li>
<li><p>最適な<strong>用途</strong>スピードと精度が重要で、メモリ制約があまり気にならないアプリケーション</p></li>
<li><p><strong>テクニカル・ノート</strong>: 検索は、ノードの数が最も少ない最上位レイヤーから開始し、密度が高くなるレイヤーを下方向にトラバースします。</p></li>
</ul>
<p>フラット</p>
<ul>
<li><p><strong>アーキテクチャ</strong>近似のない単純な網羅的探索</p></li>
<li><p><strong>パフォーマンス</strong>: 回収率は100%だが、クエリー時間は非常に遅い ( データサイズ<code translate="no">n</code> の場合<code translate="no">O(n)</code> )</p></li>
<li><p><strong>リソース使用量</strong>：インデックスサイズは生のベクトルデータサイズに等しい</p></li>
<li><p>最適<strong>な用途</strong>小規模なデータセット、または完全な想起を必要とするアプリケーション</p></li>
<li><p><strong>テクニカルノート</strong>: クエリベクターとデータベース内の全てのベクター間の完全な距離計算を行う。</p></li>
</ul>
<p>IVF_FLAT</p>
<ul>
<li><p><strong>アーキテクチャ</strong>ベクトル空間をクラスタに分割し、より効率的な検索を実現</p></li>
<li><p><strong>パフォーマンス</strong>中程度の検索速度で中程度の高い再現率（HNSWより遅いがFLATより速い）</p></li>
<li><p><strong>リソース使用量</strong>：必要メモリはFLATより少ないが、HNSWより多い</p></li>
<li><p><strong>最適な用途</strong>より良いパフォーマンスと引き換えにリコールが必要な、バランスの取れたアプリケーション。</p></li>
<li><p><strong>テクニカルノート</strong>: 検索中、<code translate="no">nlist</code> のクラスタのみが調査されるため、計算量が大幅に削減される。</p></li>
</ul>
<p>IVF_SQ8</p>
<ul>
<li><p><strong>アーキテクチャ</strong>IVF_FLATにスカラー量子化を適用し、ベクトルデータを圧縮。</p></li>
<li><p><strong>パフォーマンス</strong>中程度のリコール、中程度の高速クエリ</p></li>
<li><p><strong>リソースの使用</strong>IVF_FLATと比較して、ディスク、コンピュート、メモリの消費量を70～75%削減</p></li>
<li><p>最適<strong>な用途</strong>精度が若干低下する可能性がある、リソースに制約のある環境</p></li>
<li><p><strong>テクニカルノート</strong>：32ビット浮動小数点値を8ビット整数値に圧縮します。</p></li>
</ul>
<h3 id="Advanced-Index-Options-ScaNN-DiskANN-CAGRA-and-more" class="common-anchor-header">高度なインデックスオプションScaNN、DiskANN、CAGRAなど</h3><p>特殊な要件をお持ちの開発者のために、Milvusは以下のオプションも提供しています：</p>
<ul>
<li><p><a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google"><strong>ScaNN</strong></a>: HNSWよりCPU上で20%高速で、同程度の想起率</p></li>
<li><p><a href="https://milvus.io/docs/disk_index.md"><strong>DiskANN</strong></a>: ディスクとメモリのハイブリッドインデックスで、多数のベクターを高い想起率でサポートする必要があり、若干長いレイテンシ（～100ms）を許容できる場合に最適です。インデックスの一部のみをメモリ上に保持し、残りはディスク上に残すことで、メモリ使用量とパフォーマンスのバランスをとっている。</p></li>
<li><p><strong>GPUベースのインデックス</strong></p>
<ul>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">GPU_CAGRA</a>：これはGPUインデックスの中で最も高速だが、HBMメモリーではなくGDDRメモリーを搭載した推論カードを必要とする。</p></li>
<li><p>gpu_brute_force：GPUに実装された網羅的探索</p></li>
<li><p>GPU_IVF_FLAT：IVF_FLATのGPUアクセラレーション版</p></li>
<li><p>GPU_IVF_PQ:<a href="https://zilliz.com/learn/harnessing-product-quantization-for-memory-efficiency-in-vector-databases">積量子化を</a>用いたIVFのGPU高速化バージョン</p></li>
</ul></li>
<li><p><strong>HNSW-PQ/SQ/PRQ</strong>：</p>
<ul>
<li><p><strong>HNSW_SQ</strong>：超高速クエリ、限られたメモリリソース。</p></li>
<li><p><strong>HNSW_PQ</strong>: 中速のクエリ。メモリリソースは非常に限定的。</p></li>
<li><p><strong>HNSW_PRQ</strong>: 中速クエリ、非常に限られたメモリリソース。</p></li>
<li><p><strong>AUTOINDEX</strong>: オープンソースMilvusではHNSWがデフォルト（マネージドMilvusである<a href="https://zilliz.com/cloud">Zilliz Cloudでは</a>より高性能な独自インデックスを使用）。</p></li>
</ul></li>
<li><p><strong>バイナリ、スパース、その他の特殊インデックス</strong>：特定のデータタイプやユースケース向け。詳細については<a href="https://milvus.io/docs/index.md">、このインデックスのドキュメントページを</a>参照してください。</p></li>
</ul>
<h2 id="Segment-Size-and-Deployment-Configuration" class="common-anchor-header">セグメントサイズと展開構成<button data-href="#Segment-Size-and-Deployment-Configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>セグメントはMilvusの内部データ組織の基本的な構成要素です。分散検索と配置全体の負荷分散を可能にするデータチャンクとして機能します。このMilvusサイジングツールには3つのセグメントサイズオプション(512 MB、1024 MB、2048 MB)があり、デフォルトは1024 MBです。</p>
<p>パフォーマンスを最適化するには、セグメントを理解することが重要です。一般的なガイドラインとして</p>
<ul>
<li><p>512 MBセグメント：4-8 GBのメモリを持つクエリノードに最適です。</p></li>
<li><p>1 GBセグメント：8～16GBのメモリを搭載したクエリーノードに最適</p></li>
<li><p>2 GBセグメント：16 GB 以上のメモリを搭載したクエリノードに推奨</p></li>
</ul>
<p>開発者の洞察より少なく、より大きなセグメントは、通常、より高速な検索パフォーマンスを提供します。大規模なデプロイメントでは、多くの場合、2 GB セグメントがメモリ効率とクエリ速度の最適なバランスを提供します。</p>
<h2 id="Message-Queue-System-Selection" class="common-anchor-header">メッセージ・キュー・システムの選択<button data-href="#Message-Queue-System-Selection" class="anchor-icon" translate="no">
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
    </button></h2><p>メッセージング・システムとしてPulsarとKafkaのどちらかを選択する場合：</p>
<ul>
<li><p><strong>Pulsar</strong>：トピックごとのオーバーヘッドが低く、スケーラビリティに優れているため、新規プロジェクトに推奨</p></li>
<li><p><strong>Kafka</strong>：Kafkaの専門知識やインフラを既にお持ちの場合は、そちらをお勧めします。</p></li>
</ul>
<h2 id="Enterprise-Optimizations-in-Zilliz-Cloud" class="common-anchor-header">Zilliz Cloudにおけるエンタープライズ最適化<button data-href="#Enterprise-Optimizations-in-Zilliz-Cloud" class="anchor-icon" translate="no">
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
    </button></h2><p>パフォーマンス要件が厳しいプロダクションデプロイメントのために、Zilliz Cloud（クラウド上のMilvusのフルマネージド・エンタープライズ版）は、インデックス作成と量子化においてさらなる最適化を提供します：</p>
<ul>
<li><p><strong>メモリ不足（OOM）防止：</strong>メモリ不足によるクラッシュを防ぐための高度なメモリ管理</p></li>
<li><p><strong>コンパクションの最適化</strong>：検索パフォーマンスとリソース利用率の向上</p></li>
<li><p><strong>階層化ストレージ</strong>：ホットデータとコールドデータを適切なコンピュートユニットで効率的に管理</p>
<ul>
<li><p>頻繁にアクセスされるデータ用の標準コンピュート・ユニット（CU</p></li>
<li><p>アクセス頻度の低いデータをコスト効率よく保存する階層型ストレージCU</p></li>
</ul></li>
</ul>
<p>詳細なエンタープライズサイジングオプションについては、<a href="https://docs.zilliz.com/docs/select-zilliz-cloud-service-plans"> Zilliz Cloudサービスプランのドキュメントを</a>ご覧ください。</p>
<h2 id="Advanced-Configuration-Tips-for-Developers" class="common-anchor-header">開発者のための高度な構成のヒント<button data-href="#Advanced-Configuration-Tips-for-Developers" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li><p><strong>複数のインデックスタイプ</strong>：サイジングツールは単一のインデックスに焦点を当てます。様々なコレクションに異なるインデックスアルゴリズムを必要とする複雑なアプリケーションの場合は、カスタム構成で別々のコレクションを作成してください。</p></li>
<li><p><strong>メモリの割り当て</strong>：展開を計画する際には、ベクターデータとインデックスの両方のメモリ要件を考慮してください。HNSWは通常、生のベクトルデータの2～3倍のメモリを必要とします。</p></li>
<li><p><strong>パフォーマンステスト</strong>：構成を確定する前に、代表的なデータセットで特定のクエリーパターンをベンチマークしてください。</p></li>
<li><p><strong>スケールの考慮</strong>：将来の成長を考慮する。後で再構成するよりも、少し多めのリソースで始める方が簡単です。</p></li>
</ol>
<h2 id="Conclusion" class="common-anchor-header">結論<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/tools/sizing/"> Milvus Sizing Toolは</a>リソースプランニングの優れた出発点を提供しますが、アプリケーションにはそれぞれ固有の要件があることを忘れないでください。最適なパフォーマンスを得るためには、特定のワークロード特性、クエリパターン、およびスケーリングニーズに基づいて構成を微調整する必要があります。</p>
<p>私たちは、ユーザーからのフィードバックに基づいて、ツールやドキュメントを継続的に改善しています。Milvus導入のサイジングに関するご質問やサポートが必要な場合は、<a href="https://github.com/milvus-io/milvus/discussions"> GitHub</a>または<a href="https://discord.com/invite/8uyFbECzPX"> Discordの</a>コミュニティにご連絡ください。</p>
<h2 id="References" class="common-anchor-header">参考文献<button data-href="#References" class="anchor-icon" translate="no">
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
<li><p><a href="https://thesequence.substack.com/p/guest-post-choosing-the-right-vector">プロジェクトに適したベクターインデックスの選択</a></p></li>
<li><p><a href="https://milvus.io/docs/index.md?tab=floating">インメモリインデックス｜Milvusドキュメント</a></p></li>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">Unveil Milvus CAGRA: GPUインデックスによるベクトル検索の高度化</a></p></li>
<li><p><a href="https://zilliz.com/pricing#estimate_your_cost">Zillizクラウド価格計算機</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md">Milvusの始め方 </a></p></li>
<li><p><a href="https://docs.zilliz.com/docs/resource-planning">Zilliz Cloudリソースプランニング｜クラウド｜Zilliz Cloud Developer Hub</a></p></li>
</ul>
