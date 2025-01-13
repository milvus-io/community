---
id: building-video-search-system-with-milvus.md
title: システム概要
author: milvus
date: 2020-08-29T00:18:19.703Z
desc: Milvusで画像から動画を探す
cover: assets.zilliz.com/header_3a822736b3.gif
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/building-video-search-system-with-milvus'
---
<custom-h1>動画検索システム構築の4ステップ</custom-h1><p>その名が示すように、画像による動画検索は、入力画像に類似したフレームを含む動画をリポジトリから検索するプロセスである。重要なステップの一つは、動画を埋め込み画像にすること、つまり、キーとなるフレームを抽出し、その特徴をベクトルに変換することである。さて、好奇心旺盛な読者の中には、画像から動画を検索するのと、画像から画像を検索するのと、何が違うのかと思うかもしれない。実は、動画からキーフレームを探すことは、画像から画像を探すことと同じなのです。</p>
<p>興味のある方は、以前の記事<a href="https://medium.com/unstructured-data-service/milvus-application-1-building-a-reverse-image-search-system-based-on-milvus-and-vgg-aed4788dd1ea">Milvus x VGG: コンテンツベースの画像検索システムの構築</a>を参照していただきたい。</p>
<h2 id="System-overview" class="common-anchor-header">システム概要<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>以下の図は、このような動画検索システムの典型的なワークフローを示している。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_video_search_system_workflow_c68d658b93.png" alt="1-video-search-system-workflow.png" class="doc-image" id="1-video-search-system-workflow.png" />
   </span> <span class="img-wrapper"> <span>1-動画検索システムのワークフロー.png</span> </span></p>
<p>動画を取り込む際には、OpenCVライブラリを用いて各動画をフレーム単位に切り出し、画像特徴抽出モデルVGGを用いてキーフレームのベクトルを抽出し、抽出したベクトル（エンベッディング）をmilvusに挿入する。元の動画の保存にはMinioを、動画とベクトルの相関関係の保存にはRedisを使用しています。</p>
<p>動画を検索する際には、同じVGGモデルを使って入力画像を特徴ベクトルに変換し、Milvusに挿入して最も類似度の高いベクトルを見つける。そして、Redisの相関関係に従って、Minioのインターフェイス上で対応する動画を検索する。</p>
<h2 id="Data-preparation" class="common-anchor-header">データの準備<button data-href="#Data-preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>この記事では、動画を検索するエンド・ツー・エンドのソリューションを構築するためのサンプル・データセットとして、Tumblrの約10万個のGIFファイルを使用する。独自の動画リポジトリを使用することもできる。</p>
<h2 id="Deployment" class="common-anchor-header">配置<button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>この記事で紹介する動画検索システムを構築するためのコードは、GitHubにある。</p>
<h3 id="Step-1-Build-Docker-images" class="common-anchor-header">ステップ1：Dockerイメージをビルドする。</h3><p>動画検索システムには、Milvus v0.7.1ドッカー、Redisドッカー、Minioドッカー、フロントエンド・インターフェース・ドッカー、バックエンドAPIドッカーが必要です。フロントエンドのインターフェース docker とバックエンドの API docker は自分で構築する必要がありますが、他の 3 つの docker は Docker Hub から直接引っ張ってくることができます。</p>
<pre><code translate="no"># Get the video search code
$ git clone -b 0.10.0 https://github.com/JackLCL/search-video-demo.git

# Build front-end interface docker and api docker images
$ cd search-video-demo &amp; make all
</code></pre>
<h2 id="Step-2-Configure-the-environment" class="common-anchor-header">ステップ2：環境を設定する。<button data-href="#Step-2-Configure-the-environment" class="anchor-icon" translate="no">
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
    </button></h2><p>ここでは、docker-compose.ymlを使用して、上記の5つのコンテナを管理します。docker-compose.ymlの設定は以下の表を参照：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_configure_docker_compose_yml_a33329e5e9.png" alt="2-configure-docker-compose-yml.png" class="doc-image" id="2-configure-docker-compose-yml.png" />
   </span> <span class="img-wrapper"> <span>2-configure-docker-compose-yml.png</span> </span></p>
<p>上表のIPアドレス192.168.1.38は、本記事で特に動画検索システムを構築するためのサーバーアドレスです。あなたのサーバーアドレスに更新する必要があります。</p>
<p>Milvus、Redis、Minio用のストレージ・ディレクトリを手動で作成し、docker-compose.ymlに対応するパスを追加する必要があります。この例では、以下のディレクトリを作成しました：</p>
<pre><code translate="no">/mnt/redis/data /mnt/minio/data /mnt/milvus/db
</code></pre>
<p>docker-compose.ymlでは、以下のようにMilvus、Redis、Minioを設定できる：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_configure_milvus_redis_minio_docker_compose_yml_4a8104d53e.png" alt="3-configure-milvus-redis-minio-docker-compose-yml.png" class="doc-image" id="3-configure-milvus-redis-minio-docker-compose-yml.png" />
   </span> <span class="img-wrapper"> <span>3-configure-milvus-redis-minio-docker-compose-yml.png</span> </span>。</p>
<h2 id="Step-3-Start-the-system" class="common-anchor-header">ステップ3：システムを起動する。<button data-href="#Step-3-Start-the-system" class="anchor-icon" translate="no">
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
    </button></h2><p>変更したdocker-compose.ymlを使用して、動画検索システムで使用する5つのdockerコンテナを起動する：</p>
<pre><code translate="no">$ docker-compose up -d
</code></pre>
<p>その後、docker-compose psを実行して、5つのdockerコンテナが正しく起動したかどうかを確認できる。次のスクリーンショットは、正常に起動した後の典型的なインターフェイスを示しています。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_sucessful_setup_f2b3006487.png" alt="4-sucessful-setup.png" class="doc-image" id="4-sucessful-setup.png" />
   </span> <span class="img-wrapper"> <span>4-sucessful-setup.png</span> </span></p>
<p>これで、データベースには動画がないものの、動画検索システムの構築に成功したことになる。</p>
<h2 id="Step-4-Import-videos" class="common-anchor-header">ステップ 4: 動画のインポート<button data-href="#Step-4-Import-videos" class="anchor-icon" translate="no">
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
    </button></h2><p>システムリポジトリのdeployディレクトリに、動画をインポートするスクリプトimport_data.pyがあります。スクリプトを実行するには、動画ファイルへのパスとインポート間隔を更新するだけです。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_update_path_video_5065928961.png" alt="5-update-path-video.png" class="doc-image" id="5-update-path-video.png" />
   </span> <span class="img-wrapper"> <span>5-update-path-video.png</span> </span></p>
<p>data_path：インポートする動画のパス。</p>
<p>time.sleep(0.5)：システムが動画をインポートする間隔。動画検索システムを構築するために使用しているサーバーのCPUコアは96である。そのため、間隔は0.5秒に設定することを推奨する。サーバーのCPUコアが少ない場合は、間隔を大きく設定してください。そうしないと、インポート処理でCPUに負担がかかり、ゾンビプロセスが生成されます。</p>
<p>import_data.pyを実行して動画をインポートします。</p>
<pre><code translate="no">$ cd deploy
$ python3 import_data.py
</code></pre>
<p>動画のインポートが完了したら、動画検索システムの準備は完了です！</p>
<h2 id="Interface-display" class="common-anchor-header">インターフェイスの表示<button data-href="#Interface-display" class="anchor-icon" translate="no">
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
    </button></h2><p>ブラウザを開き、192.168.1.38:8001と入力すると、以下のように動画検索システムのインターフェイスが表示されます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_video_search_interface_4c26d93e02.png" alt="6-video-search-interface.png" class="doc-image" id="6-video-search-interface.png" />
   </span> <span class="img-wrapper"> <span>6-ビデオ検索インターフェース.png</span> </span></p>
<p>右上の歯車スイッチを切り替えると、リポジトリ内のすべての動画が表示されます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_view_all_videos_repository_26ff37cad5.png" alt="7-view-all-videos-repository.png" class="doc-image" id="7-view-all-videos-repository.png" />
   </span> <span class="img-wrapper"> <span>7-すべての動画を見る-リポジトリ.png</span> </span></p>
<p>左上のアップロードボックスをクリックし、対象画像を入力します。下図のように、最も類似したフレームを含む動画が表示されます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_enjoy_recommender_system_cats_bda1bf9db3.png" alt="8-enjoy-recommender-system-cats.png" class="doc-image" id="8-enjoy-recommender-system-cats.png" />
   </span> <span class="img-wrapper"> <span>8-enjoy-recommender-system-cats.png</span> </span></p>
<p>次に、動画検索システムを楽しんでみましょう！</p>
<h2 id="Build-your-own" class="common-anchor-header">自分で作る<button data-href="#Build-your-own" class="anchor-icon" translate="no">
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
    </button></h2><p>この記事では、Milvusを使って、画像から動画を検索するシステムを構築しました。これは、非構造化データ処理におけるMilvusの応用例を示すものである。</p>
<p>Milvusは複数のディープラーニングフレームワークと互換性があり、数十億規模のベクトルに対してmilvusを使えばミリ秒での検索が可能だ。Milvusは、https://github.com/milvus-io/milvus、より多くのAIシナリオに自由に活用できる。</p>
<p><a href="https://twitter.com/milvusio/">Twitterを</a>フォローするか、<a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">Slackに</a>参加してください！👇🏻</p>
