---
id: >-
  unlocking-8×-milvus-performance-with-cloudian-hyperstore-and-nvidia-rdma-for-s3-storage.md
title: Cloudian HyperStoreとNVIDIA RDMA for S3ストレージで8倍のMilvusパフォーマンスを引き出す
author: Jon Toor
date: 2025-11-17T00:00:00.000Z
cover: assets.zilliz.com/cloudian_b7531febff.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Cloudian, NVIDIA, RDMA for S3-compatible storage, Milvus'
meta_title: 8× Milvus Boost with Cloudian HyperStore and NVIDIA RDMA
desc: CloudianとNVIDIAがS3互換ストレージにRDMAを導入、AIワークロードを低レイテンシで高速化し、milvusで8倍の性能向上を実現。
origin: >-
  https://cloudian.com/blog/cloudian-deploys-new-nvidia-rdma-for-s3-compatible-storage-a-game-changer-for-ai-storage-performance/
---
<p><em>この投稿は<a href="https://cloudian.com/blog/cloudian-deploys-new-nvidia-rdma-for-s3-compatible-storage-a-game-changer-for-ai-storage-performance/">Cloudianに</a>掲載されたもので、許可を得てここに再掲載しています。</em></p>
<p>CloudianはNVIDIAと協力し、S3 API実装における13年以上の経験を活かして、HyperStore®ソリューションにS3互換ストレージのRDMAサポートを追加した。並列処理アーキテクチャを持つS3-APIベースのプラットフォームとして、Cloudianはこの技術の開発に貢献し、それを活用する上でユニークな存在です。このコラボレーションは、Cloudianのオブジェクトストレージプロトコルに関する深い専門知識と、NVIDIAのコンピュートおよびネットワークアクセラレーションにおけるリーダーシップを活用し、ハイパフォーマンスコンピューティングとエンタープライズ規模のストレージをシームレスに統合するソリューションを実現します。</p>
<p>NVIDIAは、RDMA for S3互換ストレージ（Remote Direct Memory Access）技術の一般提供を開始することを発表し、AIインフラストラクチャの進化における重要なマイルストーンとなりました。この画期的なテクノロジーは、S3互換オブジェクトストレージをクラウドコンピューティングの基盤としてきたスケーラビリティとシンプルさを維持しながら、これまでにないパフォーマンスの向上を実現し、組織が最新のAIワークロードの膨大なデータ要件を処理する方法を変革することを約束します。</p>
<h2 id="What-is-RDMA-for-S3-compatible-storage" class="common-anchor-header">S3互換ストレージのRDMAとは？<button data-href="#What-is-RDMA-for-S3-compatible-storage" class="anchor-icon" translate="no">
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
    </button></h2><p>今回の発表は、ストレージシステムがAIアクセラレータと通信する方法の根本的な進歩を意味します。このテクノロジーは、従来のCPUを介したデータ経路を完全にバイパスして、S3 API互換オブジェクト・ストレージとGPUメモリー間の直接的なデータ転送を可能にします。すべてのデータ転送をCPUとシステム・メモリ経由で行い、ボトルネックとレイテンシを発生させる従来のストレージ・アーキテクチャとは異なり、S3互換ストレージ向けのRDMAは、ストレージからGPUへの直接的なハイウェイを確立します。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RDMA_for_S3_compatible_storage_18fdd69d02.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>この技術の核心は、レイテンシを削減し、CPUの処理要求を劇的に削減し、消費電力を大幅に削減する直接的な経路により、中間ステップを排除することです。その結果、要求の厳しいAIアプリケーションで最新のGPUが必要とする速度でデータを提供できるストレージシステムが実現します。</p>
<p>このテクノロジーは、ユビキタスS3 APIとの互換性を維持しながら、この高性能データパスを追加している。コマンドは標準的なS3-APIベースのストレージ・プロトコルを介して発行されますが、実際のデータ転送はRDMAを介してGPUメモリに直接行われるため、CPUを完全にバイパスし、TCPプロトコル処理のオーバーヘッドを排除します。</p>
<h2 id="Breakthrough-Performance-Results" class="common-anchor-header">画期的なパフォーマンス結果<button data-href="#Breakthrough-Performance-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>S3互換ストレージのRDMAによる性能向上は、まさに革命的です。実際のテストでは、AIワークロードを制約するストレージI/Oのボトルネックを解消する能力が実証されています。</p>
<h3 id="Dramatic-Speed-Improvements" class="common-anchor-header">劇的なスピードの向上</h3><ul>
<li><p><strong>ノードあたり35GB/秒のスループット</strong>（リード）を計測、クラスタ間で線形スケーラビリティを実現</p></li>
<li><p>Cloudianの並列処理アーキテクチャにより<strong>TBs/sまで拡張可能</strong></p></li>
<li><p>従来のTCPベースのオブジェクトストレージと比較して<strong>3～5倍のスループット向上</strong></p></li>
</ul>
<h3 id="Resource-Efficiency-Gains" class="common-anchor-header">リソース効率の向上：</h3><ul>
<li><p>GPUへの直接的なデータ経路の確立による<strong>CPU使用率の90%削減</strong></p></li>
<li><p>ボトルネックの解消による<strong>GPU利用率の向上</strong></p></li>
<li><p>処理オーバーヘッドの削減による消費電力の劇的な削減</p></li>
<li><p>AIストレージのコスト削減</p></li>
</ul>
<h3 id="8X-Performance-Boost-on-Milvus-by-Zilliz-Vector-DB" class="common-anchor-header">Milvusで8倍の性能向上 by ベクトルDB</h3><p>これらの性能向上は、特にベクトルデータベース操作において顕著であり、<a href="https://developer.nvidia.com/cuvs">NVIDIA cuVSと</a> <a href="https://www.nvidia.com/en-us/data-center/l40s/">NVIDIA L40S GPUを</a>使用したCloudianとZillizのコラボレーションにより、CPUベースのシステムとTCPベースのデータ転送と比較した場合、<strong>Milvus操作において8倍の性能向上が</strong>実証された。これは、ストレージが制約であることから、ストレージがAIアプリケーションの潜在能力を最大限に発揮できるようにすることへの根本的な転換を意味します。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_indexing_time_354bdd4b46.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-S3-API-based-Object-Storage-for-AI-Workloads" class="common-anchor-header">S3 APIベースのオブジェクトストレージがAIワークロードに適している理由<button data-href="#Why-S3-API-based-Object-Storage-for-AI-Workloads" class="anchor-icon" translate="no">
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
    </button></h2><p>RDMA技術とオブジェクト・ストレージ・アーキテクチャの融合は、AIインフラストラクチャの理想的な基盤を構築し、従来のストレージアプローチに制約を与えていた複数の課題に対処する。</p>
<p><strong>AIのデータ爆発に対応するエクサバイトのスケーラビリティ：</strong>AIのワークロード、特に合成データやマルチモーダルデータを含むワークロードは、ストレージ要件を100ペタバイト台、あるいはそれ以上に押し上げている。オブジェクト・ストレージのフラットなアドレス空間は、ペタバイトからエクサバイトまでシームレスに拡張でき、ファイルベースのシステムを制約する階層的な制限なしに、AIトレーニング・データセットの急激な増加に対応します。</p>
<p><strong>完全なAIワークフローのための統合プラットフォーム：</strong>最新のAI操作は、データの取り込み、クレンジング、トレーニング、チェックポイント、推論に及びます。S3互換のオブジェクトストレージは、一貫したAPIアクセスを通じてこの全領域をサポートし、複数のストレージ階層を管理する複雑さとコストを排除します。トレーニングデータ、モデル、チェックポイントファイル、推論データセットはすべて、単一の高性能データレイクに置くことができます。</p>
<p><strong>AI操作のための豊富なメタデータ：</strong>検索や列挙のような重要なAI操作は、基本的にメタデータ駆動型です。オブジェクト・ストレージの豊富でカスタマイズ可能なメタデータ機能により、効率的なデータのタグ付け、検索、管理が可能になり、複雑なAIモデルのトレーニングや推論ワークフローにおけるデータの整理と検索に不可欠です。</p>
<p><strong>経済的および運用上の利点：</strong>S3互換のオブジェクトストレージは、業界標準のハードウェアと、容量とパフォーマンスの独立したスケーリングを活用することで、ファイルストレージと比較して総所有コストを最大80%削減します。AIデータセットが企業規模に達すると、この経済効率は極めて重要になります。</p>
<p><strong>企業のセキュリティとガバナンス：</strong>カーネルレベルの変更を必要とするGPUDirect実装とは異なり、S3互換ストレージのRDMAはベンダー固有のカーネル変更を必要とせず、システムセキュリティと規制コンプライアンスを維持します。このアプローチは、データのセキュリティと規制遵守が最重要である医療や金融のような分野で特に価値があります。</p>
<h2 id="The-Road-Ahead" class="common-anchor-header">前途<button data-href="#The-Road-Ahead" class="anchor-icon" translate="no">
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
    </button></h2><p>NVIDIAのS3互換ストレージ向けRDMAの一般提供開始の発表は、技術的なマイルストーン以上のものであり、AIインフラストラクチャ・アーキテクチャの成熟を示すものです。オブジェクト・ストレージの無限のスケーラビリティとGPUダイレクト・アクセスの画期的なパフォーマンスを組み合わせることで、企業はついに、野心に合わせて拡張できるAIインフラを構築できるようになった。</p>
<p>AIのワークロードが複雑化し、規模が拡大し続ける中、S3互換ストレージのRDMAは、企業がデータ主権と運用の簡素化を維持しながらAIへの投資を最大化できるストレージ基盤を提供します。このテクノロジーは、ストレージをボトルネックからイネーブラーに変え、AIアプリケーションがエンタープライズ規模で潜在能力を最大限に発揮できるようにします。</p>
<p>AIインフラのロードマップを計画している組織にとって、S3互換ストレージ向けRDMAの一般提供は、ストレージ性能が最新のAIワークロードの要求に真に合致する新時代の幕開けを意味する。</p>
<h2 id="Industry-Perspectives" class="common-anchor-header">業界の展望<button data-href="#Industry-Perspectives" class="anchor-icon" translate="no">
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
    </button></h2><p>AIが医療提供の中心的存在になるにつれ、私たちはインフラの性能と効率を高めることを絶えず追求しています。NVIDIAとCloudianの新しいRDMA for S3互換ストレージは、S3-APIベースのストレージデバイスとSSDベースのNASストレージ間でデータを移動するコストを削減しながら、大規模なデータセットを迅速に処理することが患者ケアに直接影響する、当社の医療画像分析と診断AIアプリケーションにとって非常に重要です。  -<em>Dr. Swapnil Rane MD, DNB, PDCC (Nephropath), Mres (TCM), Fellowship in Oncopath, FRCPath Professor (F) of Pathology, PI, AI/Computational Pathology And Imaging Lab OIC- Department of Digital and Computational Oncology, Tata Memorial Centre.</em></p>
<p>「NVIDIAのS3互換RDMAの発表は、当社のCloudianベースのAIインフラ戦略の価値を裏付けるものです。私たちは、移行をシンプルにし、アプリケーション開発コストを低く抑えるS3 API互換性を維持しながら、組織が大規模で高性能AIを実行することを可能にします。"<em>- ヨッタ・データ・サービス共同創業者、マネージング・ディレクター兼最高経営責任者（CEO）、スニル・グプタ氏</em></p>
<p>「ソブリンAIを提供するためにオンプレミスの機能を拡張するにあたり、NVIDIAのRDMA for S3互換ストレージテクノロジーとCloudianのハイパフォーマンスオブジェクトストレージは、データレジデンシーを損なうことなく、カーネルレベルの修正を必要とすることなく、必要なパフォーマンスを提供してくれます。Cloudian HyperStoreプラットフォームによって、機密性の高いAIデータを完全に管理下に置きながら、エクサバイトまで拡張することができます。<em>- カカオ、EVP兼クラウド責任者、ローガン・リー氏</em></p>
<p>「NVIDIAがS3互換ストレージGAのRDMAリリースを発表したことに興奮しています。当社のMilvus by Zillizユーザーは、完全なデータ主権を維持しながら、要求の厳しいAIワークロードでクラウドスケールのパフォーマンスを達成することができます。"<em>- Zilliz創業者兼CEO、チャールズ・シー氏</em></p>
