---
id: building-a-milvus-cluster-based-on-juicefs.md
title: JuiceFSとは？
author: Changjian Gao and Jingjing Jia
date: 2021-06-15T07:21:07.938Z
desc: クラウドネイティブ環境向けに設計された共有ファイルシステムJuiceFSをベースにしたMilvusクラスタの構築方法をご紹介します。
cover: assets.zilliz.com/Juice_FS_blog_cover_851cc9e726.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/building-a-milvus-cluster-based-on-juicefs'
---
<custom-h1>JuiceFSをベースとしたMilvusクラスタの構築</custom-h1><p>オープンソースコミュニティ間のコラボレーションは魔法のようなものだ。情熱的で、知的で、創造的なボランティアは、オープンソースのソリューションを革新的なものに保つだけでなく、さまざまなツールを興味深く有用な方法で一つにまとめる作業も行っています。世界で最も人気のあるベクターデータベースである<a href="https://milvus.io/">Milvusと</a>、クラウドネイティブ環境向けに設計された共有ファイルシステムである<a href="https://github.com/juicedata/juicefs">JuiceFSは</a>、それぞれのオープンソースコミュニティによってこの精神で結ばれた。この記事では、JuiceFSとは何か、JuiceFS共有ファイルストレージをベースにMilvusクラスタを構築する方法、そしてこのソリューションを使用してユーザーが期待できるパフォーマンスについて説明します。</p>
<h2 id="What-is-JuiceFS" class="common-anchor-header"><strong>JuiceFSとは？</strong><button data-href="#What-is-JuiceFS" class="anchor-icon" translate="no">
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
    </button></h2><p>JuiceFSは高性能なオープンソースの分散POSIXファイルシステムで、RedisとS3の上に構築することができます。クラウドネイティブ環境向けに設計されており、あらゆる種類のデータの管理、分析、アーカイブ、バックアップをサポートします。JuiceFSは、ビッグデータの課題解決、人工知能（AI）アプリケーションの構築、ログ収集などによく使われている。また、複数のクライアント間でのデータ共有にも対応しており、milvusの共有ストレージとして直接使用することもできる。</p>
<p>データとそれに対応するメタデータがそれぞれオブジェクトストレージと<a href="https://redis.io/">Redisに</a>永続化された後、JuiceFSはステートレスミドルウェアとして機能する。データ共有は、標準的なファイルシステムインタフェースを通じて、異なるアプリケーション同士がシームレスにドッキングできるようにすることで実現される。JuiceFSは、メタデータの保存にオープンソースのインメモリデータストアであるRedisを利用している。Redisが使用される理由は、アトミティシティが保証され、高性能なメタデータ操作が提供されるからです。すべてのデータは、JuiceFSクライアントを通じてオブジェクトストレージに格納されます。アーキテクチャ図は以下の通りです：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/juicefs_architecture_2023b37a4e.png" alt="juicefs-architecture.png" class="doc-image" id="juicefs-architecture.png" />
   </span> <span class="img-wrapper"> <span>juicefs-architecture.png</span> </span></p>
<h2 id="Build-a-Milvus-cluster-based-on-JuiceFS" class="common-anchor-header"><strong>JuiceFSをベースにしたMilvusクラスタの構築</strong><button data-href="#Build-a-Milvus-cluster-based-on-JuiceFS" class="anchor-icon" translate="no">
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
    </button></h2><p>JuiceFSを使用して構築されたMilvusクラスタ（以下のアーキテクチャ図を参照）は、クラスタシャーディングミドルウェアであるMishardsを使用してアップストリームリクエストを分割し、リクエストをサブモジュールにカスケードダウンすることで動作します。データを挿入するとき、MishardsはMilvusの書き込みノードに上流のリクエストを割り当て、書き込みノードは新しく挿入されたデータをJuiceFSに格納する。データを読み込む場合、MishardsはJuiceFSからMilvus readノードを通じてデータをメモリにロードして処理し、上流のサブサービスから結果を収集して返します。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_cluster_built_with_juicefs_3a43cd262c.png" alt="milvus-cluster-built-with-juicefs.png" class="doc-image" id="milvus-cluster-built-with-juicefs.png" />
   </span> <span class="img-wrapper"> <span>milvus-cluster-built-with-juicefs.png</span> </span></p>
<h3 id="Step-1-Launch-MySQL-service" class="common-anchor-header"><strong>ステップ1: MySQLサービスの起動</strong></h3><p>クラスタ内の<strong>任意の</strong>ノードでMySQLサービスを起動します。詳細については、<a href="https://milvus.io/docs/v1.1.0/data_manage.md">MySQLでメタデータを管理するを</a>参照してください。</p>
<h3 id="Step-2-Create-a-JuiceFS-file-system" class="common-anchor-header"><strong>ステップ2: JuiceFSファイルシステムの作成</strong></h3><p>デモンストレーションのため、コンパイル済みのバイナリJuiceFSプログラムを使用します。お使いのシステムに適した<a href="https://github.com/juicedata/juicefs/releases">インストールパッケージを</a>ダウンロードし、JuiceFS<a href="https://github.com/juicedata/juicefs-quickstart">クイックスタートガイドに従って</a>詳しいインストール手順を確認してください。JuiceFSファイルシステムを作成するには、まずメタデータストレージ用にRedisデータベースをセットアップします。パブリッククラウドの展開では、アプリケーションと同じクラウド上でRedisサービスをホストすることをお勧めします。さらに、JuiceFS用のオブジェクトストレージをセットアップします。この例ではAzure Blob Storageを使用していますが、JuiceFSはほぼすべてのオブジェクトサービスをサポートしています。シナリオの要求に最も適したオブジェクト・ストレージ・サービスを選択してください。</p>
<p>Redisサービスとオブジェクトストレージを設定したら、新しいファイルシステムをフォーマットし、JuiceFSをローカルディレクトリにマウントします：</p>
<pre><code translate="no">1 $  <span class="hljs-built_in">export</span> AZURE_STORAGE_CONNECTION_STRING=<span class="hljs-string">&quot;DefaultEndpointsProtocol=https;AccountName=XXX;AccountKey=XXX;EndpointSuffix=core.windows.net&quot;</span>
2 $ ./juicefs format \
3     --storage wasb \
4     --bucket https://&lt;container&gt; \
5     ... \
6     localhost <span class="hljs-built_in">test</span> <span class="hljs-comment">#format</span>
7 $ ./juicefs mount -d localhost ~/jfs  <span class="hljs-comment">#mount</span>
8
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p>Redisサーバーがローカルで実行されていない場合は、localhostを次のアドレスに置き換えてください：<code translate="no">redis://&lt;user:password&gt;@host:6379/1</code> 。</p>
</blockquote>
<p>インストールに成功すると、JuiceFSは共有ストレージページ<strong>/root/jfsを</strong>返します。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/installation_success_9d05279ecd.png" alt="installation-success.png" class="doc-image" id="installation-success.png" />
   </span> <span class="img-wrapper"> <span>インストール成功.png</span> </span></p>
<h3 id="Step-3-Start-Milvus" class="common-anchor-header"><strong>ステップ3: Milvusの起動</strong></h3><p>クラスタ内のすべてのノードにMilvusをインストールし、各Milvusノードに読み取り権限または書き込み権限を設定する必要があります。Milvusノードは1台のみ書き込みノードに設定でき、残りは読み込みノードに設定する必要があります。まず、Milvusシステム設定ファイル<strong>server_config.yaml</strong> のセクション<code translate="no">cluster</code> と<code translate="no">general</code> のパラメータを設定します：</p>
<p><strong>セクション</strong> <code translate="no">cluster</code></p>
<table>
<thead>
<tr><th style="text-align:left"><strong>パラメータ</strong></th><th style="text-align:left"><strong>説明</strong></th><th style="text-align:left"><strong>設定</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:left"><code translate="no">enable</code></td><td style="text-align:left">クラスタモードを有効にするかどうか</td><td style="text-align:left"><code translate="no">true</code></td></tr>
<tr><td style="text-align:left"><code translate="no">role</code></td><td style="text-align:left">Milvusデプロイメントロール</td><td style="text-align:left"><code translate="no">rw</code>/<code translate="no">ro</code></td></tr>
</tbody>
</table>
<p><strong>セクション</strong> <code translate="no">general</code></p>
<pre><code translate="no"><span class="hljs-comment"># meta_uri is the URI for metadata storage, using MySQL (for Milvus Cluster). Format: mysql://&lt;username:password&gt;@host:port/database</span>
general:
  timezone: UTC+8
  meta_uri: mysql://root:milvusroot@host:3306/milvus
<button class="copy-code-btn"></button></code></pre>
<p>インストール中、設定されたJuiceFS共有ストレージ・パスは<strong>/root/jfs/milvus/dbに</strong>設定されます。</p>
<pre><code translate="no">1 <span class="hljs-built_in">sudo</span> docker run -d --name milvus_gpu_1.0.0 --gpus all \
2 -p 19530:19530 \
3 -p 19121:19121 \
4 -v /root/jfs/milvus/db:/var/lib/milvus/db \  <span class="hljs-comment">#/root/jfs/milvus/db is the shared storage path</span>
5 -v /home/<span class="hljs-variable">$USER</span>/milvus/conf:/var/lib/milvus/conf \
6 -v /home/<span class="hljs-variable">$USER</span>/milvus/logs:/var/lib/milvus/logs \
7 -v /home/<span class="hljs-variable">$USER</span>/milvus/wal:/var/lib/milvus/wal \
8 milvusdb/milvus:1.0.0-gpu-d030521-1ea92e
9
<button class="copy-code-btn"></button></code></pre>
<p>インストールが完了したら、Milvusを起動し、正しく起動されていることを確認します。 最後に、クラスタ内の<strong>いずれかの</strong>ノードでMishardsサービスを起動します。以下の画像はMishardsが正常に起動したことを示しています。詳細については、GitHub<a href="https://github.com/milvus-io/bootcamp/tree/new-bootcamp/deployments/juicefs">チュートリアルを</a>参照してください。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/mishards_launch_success_921695d3a8.png" alt="mishards-launch-success.png" class="doc-image" id="mishards-launch-success.png" />
   </span> <span class="img-wrapper"> <span>mishards-launch-success.png</span> </span></p>
<h2 id="Performance-benchmarks" class="common-anchor-header"><strong>パフォーマンス・ベンチマーク</strong><button data-href="#Performance-benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>共有ストレージ・ソリューションは通常、ネットワーク・アタッチド・ストレージ（NAS）システムによって実装されます。一般的に使用されるNASシステムのタイプには、ネットワーク・ファイル・システム（NFS）やサーバー・メッセージ・ブロック（SMB）などがある。パブリッククラウドプラットフォームは通常、Amazon Elastic File System（EFS）など、これらのプロトコルと互換性のあるマネージドストレージサービスを提供しています。</p>
<p>従来のNASシステムとは異なり、JuiceFSはFUSE（Filesystem in Userspace）に基づいて実装されており、すべてのデータの読み書きがアプリケーション側で直接行われるため、アクセスの待ち時間がさらに短縮されます。また、データ圧縮やキャッシングなど、他のNASシステムにはないJuiceFS独自の機能もあります。</p>
<p>ベンチマークテストにより、JuiceFSがEFSよりも大きな利点を提供していることが明らかになりました。メタデータベンチマーク（図1）では、JuiceFSの1秒あたりのI/Oオペレーション（IOPS）はEFSの最大10倍です。さらに、I/Oスループットベンチマーク（図2）では、シングルジョブとマルチジョブの両方のシナリオで、JuiceFSがEFSを上回っています。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/performance_benchmark_1_b7fcbb4439.png" alt="performance-benchmark-1.png" class="doc-image" id="performance-benchmark-1.png" />
   </span> <span class="img-wrapper"> <span>パフォーマンスベンチマーク-1.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/performance_benchmark_2_e311098123.png" alt="performance-benchmark-2.png" class="doc-image" id="performance-benchmark-2.png" />
   </span> <span class="img-wrapper"> <span>パフォーマンスベンチマーク-2.png</span> </span></p>
<p>さらに、ベンチマークテストでは、JuiceFSベースのMilvusクラスタにおける最初のクエリ検索時間（新しく挿入されたデータをディスクからメモリにロードする時間）は平均でわずか0.032秒であり、データがディスクからメモリにほぼ瞬時にロードされることを示しています。このテストでは、100万行の128次元ベクトルデータを100kバッチで1～8秒間隔で挿入し、最初のクエリ検索時間を測定しています。</p>
<p>JuiceFSは安定した信頼性の高い共有ファイルストレージシステムであり、JuiceFS上に構築されたMilvusクラスタは、高いパフォーマンスと柔軟なストレージ容量の両方を提供します。</p>
<h2 id="Learn-more-about-Milvus" class="common-anchor-header"><strong>Milvusの詳細はこちら</strong><button data-href="#Learn-more-about-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusは、膨大な数の人工知能やベクトル類似性検索アプリケーションを強化できる強力なツールです。プロジェクトの詳細については、以下のリソースをご覧ください：</p>
<ul>
<li><a href="https://zilliz.com/blog">ブログを</a>読む</li>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slackで</a>オープンソースコミュニティと交流する。</li>
<li><a href="https://github.com/milvus-io/milvus/">GitHubで</a>世界で最も人気のあるベクトル・データベースを利用したり、貢献する。</li>
<li>新しい<a href="https://github.com/milvus-io/bootcamp">ブートキャンプで</a>AIアプリケーションを素早くテストし、デプロイする。</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/writer_bio_changjian_gao_68018f7716.png" alt="writer bio-changjian gao.png" class="doc-image" id="writer-bio-changjian-gao.png" />
   </span> <span class="img-wrapper"> <span>writer bio-changjian gao.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/writer_bio_jingjing_jia_a85d1c2e3b.png" alt="writer bio-jingjing jia.png" class="doc-image" id="writer-bio-jingjing-jia.png" /><span>writer bio-jingjing jia.png</span> </span></p>
