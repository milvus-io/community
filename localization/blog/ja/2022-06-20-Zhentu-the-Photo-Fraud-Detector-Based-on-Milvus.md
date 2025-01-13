---
id: 2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md
title: Zhentu-milvusをベースにした写真詐欺検出器
author: 'Yan Shi, Minwei Tang'
date: 2022-06-20T00:00:00.000Z
desc: Milvusをベクター検索エンジンとするZhentuの検出システムはどのように構築されているのか？
cover: assets.zilliz.com/zhentu_0ae11c98ee.png
tag: Scenarios
tags: Use Cases of Milvus
canonicalUrl: >-
  https://milvus.io/blog/2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/zhentu_0ae11c98ee.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>カバー画像</span> </span></p>
<blockquote>
<p>この記事は、BestPayのシニア・アルゴリズム・エンジニアであるYan ShiとMinwei Tangが執筆し、<a href="https://www.linkedin.cn/incareer/in/rosie-zhang-694528149">Rosie Zhangが</a>翻訳したものです。</p>
</blockquote>
<p>近年、電子商取引やオンライン取引が世界中で一般的になるにつれ、電子商取引詐欺も盛んになった。オンラインビジネスのプラットフォームで本人確認をパスするために、本物の写真ではなくコンピューターで生成した写真を使用することで、詐欺師は大量の偽アカウントを作成し、企業の特別オファー（会員プレゼント、クーポン、トークンなど）を利用して現金化し、消費者と企業の双方に取り返しのつかない損失をもたらしている。</p>
<p>大量のデータを前に、従来のリスク管理手法はもはや有効ではありません。この問題を解決するために、<a href="https://www.bestpay.com.cn">BestPayは</a>ディープラーニング（DL）とデジタル画像処理（DIP）技術に基づいて、写真詐欺検出器、すなわちZhentu（中国語で画像を検出するという意味）を作成した。Zhentuは画像認識を含む様々なシナリオに適用可能で、その重要な分岐点の1つが偽の営業許可証の識別である。ユーザーが提出した営業許可証の写真が、プラットフォームのフォト・ライブラリに既に存在する別の写真と酷似している場合、ユーザーがどこかで写真を盗んだか、不正な目的で免許証を偽造した可能性が高い。</p>
<p><a href="https://en.wikipedia.org/wiki/Peak_signal-to-noise_ratio">PSNRや</a>ORBなど、画像の類似性を測定するための従来のアルゴリズムは、速度が遅く不正確で、オフラインのタスクにしか適用できない。一方、ディープラーニングは、大規模な画像データをリアルタイムで処理することができ、類似画像をマッチングする究極の手法です。BestPayの研究開発チームと<a href="https://milvus.io/">Milvusコミュニティの</a>共同努力により、写真詐欺検出システムがZhentuの一部として開発された。大量の画像データをディープラーニングモデルによって特徴ベクトルに変換し、ベクトル検索エンジンである<a href="https://milvus.io/">Milvusに</a>挿入することで機能する。Milvusを用いることで、検知システムは何兆ものベクトルをインデックス化し、何千万もの画像の中から類似した写真を効率的に検索することができる。</p>
<p><strong>戻る</strong></p>
<ul>
<li><a href="#an-overview-of-zhentu">Zhentuの概要</a></li>
<li><a href="#system-structure">システム構成</a></li>
<li><a href="#deployment"><strong>展開</strong></a></li>
<li><a href="#real-world-performance"><strong>実際のパフォーマンス</strong></a></li>
<li><a href="#reference"><strong>参考資料</strong></a></li>
<li><a href="#about-bestpay"><strong>BestPayについて</strong></a></li>
</ul>
<h2 id="An-overview-of-Zhentu" class="common-anchor-header">Zhentuの概要<button data-href="#An-overview-of-Zhentu" class="anchor-icon" translate="no">
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
    </button></h2><p>Zhentuは、機械学習(ML)とニューラルネットワーク画像認識技術を深く統合した、BestPayが独自に設計したマルチメディアビジュアルリスクコントロール製品です。その内蔵アルゴリズムは、ユーザー認証中に詐欺師を正確に識別し、ミリ秒レベルで応答することができます。業界をリードする技術と革新的なソリューションにより、Zhentuは5つの特許と2つのソフトウェア著作権を取得している。現在、多くの銀行や金融機関で使用されており、潜在的なリスクを事前に特定するのに役立っている。</p>
<h2 id="System-structure" class="common-anchor-header">システム構造<button data-href="#System-structure" class="anchor-icon" translate="no">
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
    </button></h2><p>BestPayは現在1,000万枚以上のビジネスライセンス写真を保有しており、ビジネスの成長とともに実際のボリュームは現在も指数関数的に増加している。このような大規模なデータベースから類似写真を迅速に検索するために、BestPayは特徴ベクトルの類似度計算エンジンとしてMilvusを採用しました。写真不正検出システムの一般的な構造を下図に示す。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Structure_of_the_photo_fraud_detection_system_cf5d20d431.png" alt="img" class="doc-image" id="img" />
   </span> <span class="img-wrapper"> <span>img</span> </span></p>
<p>手順は4つのステップに分けられる：</p>
<ol>
<li><p>画像の前処理。ノイズ除去、ノイズ除去、コントラスト強調などの前処理により、オリジナル情報の完全性と画像信号からの無駄な情報の除去の両方を保証する。</p></li>
<li><p>特徴ベクトルの抽出。特別に訓練されたディープラーニングモデルを使用して、画像の特徴ベクトルを抽出する。さらなる類似性検索のために画像をベクトルに変換することは、日常的な操作である。</p></li>
<li><p>正規化。抽出された特徴ベクトルを正規化することで、その後の処理効率を向上させることができる。</p></li>
<li><p>milvusによるベクトル検索。正規化された特徴ベクトルをMilvusデータベースに挿入し、ベクトルの類似検索を行います。</p></li>
</ol>
<h2 id="Deployment" class="common-anchor-header"><strong>展開</strong><button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>Zhentuの写真詐欺検出システムの導入方法を簡単に説明します。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ea45a5ab53.png" alt="Milvus system architecture" class="doc-image" id="milvus-system-architecture" />
   </span> <span class="img-wrapper"> <span>Milvusシステムアーキテクチャ</span> </span></p>
<p>クラウドサービスの高可用性とリアルタイム同期を確保するため、<a href="https://milvus.io/docs/v2.0.x/install_cluster-helm.md">Kubernetes上にMilvusクラスタを</a>デプロイした。一般的な手順は以下の通りです：</p>
<ol>
<li><p>利用可能なリソースを表示する。<code translate="no">kubectl describe nodes</code> コマンドを実行し、Kubernetesクラスタが作成したケースに割り当て可能なリソースを確認する。</p></li>
<li><p>リソースを割り当てる。コマンド<code translate="no">kubect`` -- apply xxx.yaml</code> 、Helmを使用してMilvusクラスタコンポーネントにメモリとCPUリソースを割り当てます。</p></li>
<li><p>新しい設定を適用します。コマンド<code translate="no">helm upgrade my-release milvus/milvus --reuse-values -fresources.yaml</code> を実行します。</p></li>
<li><p>新しい設定をMilvusクラスタに適用します。このように配置されたクラスタは、さまざまなビジネスニーズに応じてシステム容量を調整できるだけでなく、大量のベクトルデータ検索に対する高性能要件をよりよく満たすことができます。</p></li>
</ol>
<p>以下の2つの例に示すように、<a href="https://milvus.io/docs/v2.0.x/configure-docker.md">Milvusを設定する</a>ことで、異なるビジネスシナリオの異なるタイプのデータに対して検索パフォーマンスを最適化することができる。</p>
<p><a href="https://milvus.io/docs/v2.0.x/build_index.md">ベクトルインデックスの構築では</a>、システムの実際のシナリオに応じて以下のようにパラメータを設定する：</p>
<pre><code translate="no" class="language-Python">index = {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_PQ&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">2048</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<p><a href="https://milvus.io/docs/v2.0.x/index.md#IVF_PQ">IVF_PQは</a>ベクトルの積を量子化する前にIVFインデックスのクラスタリングを行う。IVF_PQはIVFインデックスのクラスタリングを行ってからベクトルの積を量子化するものであり、高速なディスククエリと非常に少ないメモリ消費量が特徴である。</p>
<p>さらに、最適な探索パラメータを以下のように設定する：</p>
<pre><code translate="no" class="language-Python">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">32</span>}}
<button class="copy-code-btn"></button></code></pre>
<p>ベクトルはmilvusに入力される前に既に正規化されているので、2つのベクトル間の距離を計算するために内積（IP）が選択される。実験によると、ユークリッド距離(L2)を使用するよりもIPを使用した方が、想起率が約15%向上することが証明されている。</p>
<p>以上の例から、Milvusのパラメータは様々なビジネスシナリオや性能要件に応じてテスト・設定できることがわかる。</p>
<p>また、Milvusは様々なインデックスライブラリを統合しているだけでなく、様々なインデックスタイプや類似度の計算方法をサポートしています。Milvusはまた、複数の言語による公式SDKと、挿入、クエリなどのための豊富なAPIを提供しており、フロントエンドのビジネスグループはSDKを使用してリスクコントロールセンターを呼び出すことができます。</p>
<h2 id="Real-world-performance" class="common-anchor-header"><strong>実世界でのパフォーマンス</strong><button data-href="#Real-world-performance" class="anchor-icon" translate="no">
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
    </button></h2><p>これまでのところ、写真詐欺検知システムは順調に稼働しており、企業が潜在的な詐欺師を特定するのに役立っている。2021年には、年間を通じて2万件以上の偽造免許証を検出した。クエリ速度に関しては、数千万のベクトルの中から1つのベクトルをクエリするのにかかる時間は1秒未満で、バッチクエリの平均時間は0.08秒未満である。Milvusの高性能検索は、精度と同時実行性の両方に対する企業のニーズを満たしている。</p>
<h2 id="Reference" class="common-anchor-header"><strong>参考文献</strong><button data-href="#Reference" class="anchor-icon" translate="no">
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
    </button></h2><p>Aglave P, Kolkure V S. Oriented Fast and Rotated Brief Algorithmを用いた高性能特徴抽出法の実装[J].Int.J. Res. Eng.Technol, 2015, 4: 394-397.</p>
<h2 id="About-BestPay" class="common-anchor-header"><strong>BestPayについて</strong><button data-href="#About-BestPay" class="anchor-icon" translate="no">
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
    </button></h2><p>China Telecom BestPay Co., Ltd.はチャイナテレコムの完全子会社。決済事業と金融事業を展開している。BestPayは、ビッグデータ、人工知能、クラウドコンピューティングなどの最先端技術を活用し、ビジネス革新に力を与え、インテリジェントな製品、リスクコントロールソリューション、その他のサービスを提供することに尽力している。2016年1月までに、BestPayというアプリは2億人以上のユーザーを集め、アリペイ、WeChat Paymentに次ぐ中国第3位の決済プラットフォーム事業者となった。</p>
