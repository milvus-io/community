---
id: Milvus-Data-Migration-Tool.md
title: Milvusデータ移行ツールのご紹介
author: Zilliz
date: 2021-03-15T10:19:51.125Z
desc: データ管理の大幅な効率化とDevOpsコストの削減を実現するMilvusデータ移行ツールの活用方法をご紹介します。
cover: assets.zilliz.com/Generic_Tool_Announcement_97eb04a898.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/Milvus-Data-Migration-Tool'
---
<custom-h1>Milvusデータ移行ツールのご紹介</custom-h1><p><em><strong>重要</strong>：Mivusデータ移行ツールは廃止されました。他のデータベースからMilvusへのデータ移行には、より高度なMilvus-migration Toolを使用することをお勧めします。</em></p>
<p>Milvusマイグレーションツールは現在以下の機能をサポートしています：</p>
<ul>
<li>Elasticsearch to Milvus 2.x</li>
<li>Faiss to Milvus 2.x</li>
<li>Milvus 1.xからMilvus 2.xへ</li>
<li>Milvus 2.3.xからMilvus 2.3.x以上への移行</li>
</ul>
<p>今後、Pinecone、Chroma、Qdrantなど、より多くのベクターデータソースからの移行をサポートする予定です。ご期待ください。</p>
<p><strong>詳細は<a href="https://milvus.io/docs/migrate_overview.md">Milvus-migration ドキュメント</a>または<a href="https://github.com/zilliztech/milvus-migration">GitHub リポジトリを</a>参照してください。</strong></p>
<p>---------------------------------<strong>Mivus データ移行ツールは廃止されました</strong>。</p>
<h3 id="Overview" class="common-anchor-header">概要</h3><p><a href="https://github.com/milvus-io/milvus-tools">MilvusDM</a>(Milvus Data Migration) は、Milvus によるデータファイルのインポートおよびエクスポートのために特別に設計されたオープンソースツールです。MilvusDMを利用することで、以下のようなデータ管理効率の大幅な向上とDevOpsコストの削減が可能となります：</p>
<ul>
<li><p><a href="#faiss-to-milvus">FaissからMilvusへ</a>: 解凍されたデータをFaissからMilvusへインポートします。</p></li>
<li><p><a href="#hdf5-to-milvus">HDF5からMilvusへ</a>: HDF5ファイルをMilvusにインポートします。</p></li>
<li><p><a href="#milvus-to-milvus">MilvusからMilvusへ</a>: データをソースMilvusから異なるターゲットMilvusへ移行する。</p></li>
<li><p><a href="#milvus-to-hdf5">MilvusからHDF5へ</a>: MilvusのデータをHDF5ファイルとして保存します。</p></li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvusdm_blog_1_199cbdebe7.png" alt="milvusdm blog 1.png" class="doc-image" id="milvusdm-blog-1.png" />
   </span> <span class="img-wrapper"> <span>milvusdm ブログ 1.png</span> </span></p>
<p>MilvusDMは<a href="https://github.com/milvus-io/milvus-tools">Githubで</a>ホストされており、コマンドライン<code translate="no">pip3 install pymilvusdm</code> を実行することで簡単にインストールできます。MilvusDMでは、特定のコレクションやパーティション内のデータを移行することができます。以下では、各データ移行タイプの使い方を説明します。</p>
<p><br/></p>
<h3 id="Faiss-to-Milvus" class="common-anchor-header">FaissからMilvusへの移行</h3><h4 id="Steps" class="common-anchor-header">手順</h4><p>1.<strong>F2M.yamlを</strong>ダウンロードする：</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/F2</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.以下のパラメータを設定する：</p>
<ul>
<li><p><code translate="no">data_path</code>:Faissのデータパス（ベクターとそれに対応するID）。</p></li>
<li><p><code translate="no">dest_host</code>:Milvusサーバーのアドレス。</p></li>
<li><p><code translate="no">dest_port</code>:Milvusサーバーのポート。</p></li>
<li><p><code translate="no">mode</code>:Milvusにデータをインポートするには以下のモードがあります：</p>
<ul>
<li><p>スキップ: コレクションまたはパーティションがすでに存在する場合、データを無視します。</p></li>
<li><p>追加：コレクションまたはパーティションがすでに存在する場合、データを追加します。</p></li>
<li><p>上書き：コレクションまたはパーティションが既に存在する場合、挿入前にデータを削除する。</p></li>
</ul></li>
<li><p><code translate="no">dest_collection_name</code>:データインポートの受信コレクションの名前。</p></li>
<li><p><code translate="no">dest_partition_name</code>:データのインポートを受け取るパーティション名。</p></li>
<li><p><code translate="no">collection_parameter</code>:ベクトル次元、インデックスファイルサイズ、距離メトリックなどのコレクション固有の情報。</p></li>
</ul>
<pre><code translate="no">F2M:
  milvus_version: <span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
  data_path: <span class="hljs-string">&#x27;/home/data/faiss.index&#x27;</span>
  dest_host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
  dest_port: <span class="hljs-number">19530</span>
  mode: <span class="hljs-string">&#x27;append&#x27;</span>        <span class="hljs-comment"># &#x27;skip/append/overwrite&#x27;</span>
  dest_collection_name: <span class="hljs-string">&#x27;test&#x27;</span>
  dest_partition_name: <span class="hljs-string">&#x27;&#x27;</span>
  collection_parameter:
    dimension: <span class="hljs-number">256</span>
    index_file_size: <span class="hljs-number">1024</span>
    metric_type: <span class="hljs-string">&#x27;L2&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3.<strong>F2M.yamlを</strong>実行する<strong>：</strong></p>
<pre><code translate="no">$ milvusdm --yaml F2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">サンプルコード</h4><p>1.Faissファイルを読み込み、ベクトルと対応するIDを取得する。</p>
<pre><code translate="no">ids, vectors = faiss_data.read_faiss_data()
<button class="copy-code-btn"></button></code></pre>
<p>2.取得したデータをMilvusに挿入する：</p>
<pre><code translate="no">insert_milvus.insert_data(vectors, <span class="hljs-variable language_">self</span>.dest_collection_name, <span class="hljs-variable language_">self</span>.collection_parameter, <span class="hljs-variable language_">self</span>.mode, ids, <span class="hljs-variable language_">self</span>.dest_partition_name)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="HDF5-to-Milvus" class="common-anchor-header">HDF5からmilvusへの変換</h3><h4 id="Steps" class="common-anchor-header">手順</h4><p>1.<strong>H2M.yamlを</strong>ダウンロードする。</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/H2M.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.以下のパラメータを設定する：</p>
<ul>
<li><p><code translate="no">data_path</code>:HDF5ファイルのパス</p></li>
<li><p><code translate="no">data_dir</code>:HDF5ファイルを格納するディレクトリ。</p></li>
<li><p><code translate="no">dest_host</code>:Milvusサーバーのアドレス.</p></li>
<li><p><code translate="no">dest_port</code>:Milvusサーバーのポート.</p></li>
<li><p><code translate="no">mode</code>:Milvusにデータをインポートするには以下のモードがあります：</p>
<ul>
<li><p>スキップ: コレクションまたはパーティションがすでに存在する場合、データを無視します。</p></li>
<li><p>追加：コレクションまたはパーティションがすでに存在する場合、データを追加します。</p></li>
<li><p>上書き：コレクションまたはパーティションが既に存在する場合、挿入前にデータを削除する。</p></li>
</ul></li>
<li><p><code translate="no">dest_collection_name</code>:データインポートの受信コレクションの名前。</p></li>
<li><p><code translate="no">dest_partition_name</code>:データのインポートを受け取るパーティション名。</p></li>
<li><p><code translate="no">collection_parameter</code>:ベクトル次元、インデックスファイルサイズ、距離メトリックなどのコレクション固有の情報。</p></li>
</ul>
<blockquote>
<p><code translate="no">data_path</code> または<code translate="no">data_dir</code> のどちらかを設定する。両方を設定<strong>しないで</strong>ください。複数のファイルパスを指定する場合は<code translate="no">data_path</code> を、データファイルを格納するディレクトリを指定する場合は<code translate="no">data_dir</code> を使用する。</p>
</blockquote>
<pre><code translate="no">H2M:
  milvus-version: 1.0.0
  data_path:
    - /Users/zilliz/float_1.h5
    - /Users/zilliz/float_2.h5
  data_dir:
  dest_host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
  dest_port: 19530
  mode: <span class="hljs-string">&#x27;overwrite&#x27;</span>        <span class="hljs-comment"># &#x27;skip/append/overwrite&#x27;</span>
  dest_collection_name: <span class="hljs-string">&#x27;test_float&#x27;</span>
  dest_partition_name: <span class="hljs-string">&#x27;partition_1&#x27;</span>
  collection_parameter:
    dimension: 128
    index_file_size: 1024
    metric_type: <span class="hljs-string">&#x27;L2&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3.<strong>H2M.yamlを</strong>実行する<strong>：</strong></p>
<pre><code translate="no">$ milvusdm --yaml H2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">サンプルコード</h4><p>1.HDF5ファイルを読み込み、ベクトルとそれに対応するIDを取得する：</p>
<pre><code translate="no">vectors, ids = <span class="hljs-variable language_">self</span>.file.read_hdf5_data()
<button class="copy-code-btn"></button></code></pre>
<p>2.取得したデータをMilvusに挿入する：</p>
<pre><code translate="no">ids = insert_milvus.insert_data(vectors, <span class="hljs-variable language_">self</span>.c_name, <span class="hljs-variable language_">self</span>.c_param, <span class="hljs-variable language_">self</span>.mode, ids,<span class="hljs-variable language_">self</span>.p_name)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-to-Milvus" class="common-anchor-header">MilvusからMilvusへの変換</h3><h4 id="Steps" class="common-anchor-header">手順</h4><p>1.<strong>M2M.yamlを</strong>ダウンロードする。</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/M2M.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.以下のパラメータを設定する：</p>
<ul>
<li><p><code translate="no">source_milvus_path</code>:Milvusワークパスのソース。</p></li>
<li><p><code translate="no">mysql_parameter</code>:MilvusのMySQLの設定。MySQLを使用しない場合は、mysql_parameterを''に設定する。</p></li>
<li><p><code translate="no">source_collection</code>:ソースMilvusにおけるコレクションとそのパーティションの名前。</p></li>
<li><p><code translate="no">dest_host</code>:Milvusサーバのアドレス.</p></li>
<li><p><code translate="no">dest_port</code>:Milvusサーバーのポート。</p></li>
<li><p><code translate="no">mode</code>:Milvusにデータをインポートするには以下のモードがあります：</p>
<ul>
<li><p>スキップ: コレクションまたはパーティションがすでに存在する場合、データを無視します。</p></li>
<li><p>追加：コレクションまたはパーティションがすでに存在する場合、データを追加します。</p></li>
<li><p>上書き：コレクションまたはパーティションが既に存在する場合、挿入前にデータを削除する。コレクションまたはパーティションが既に存在する場合、挿入前にデータを削除する。</p></li>
</ul></li>
</ul>
<pre><code translate="no">M2M:
  milvus_version: 1.0.0
  source_milvus_path: <span class="hljs-string">&#x27;/home/user/milvus&#x27;</span>
  mysql_parameter:
    host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
    user: <span class="hljs-string">&#x27;root&#x27;</span>
    port: 3306
    password: <span class="hljs-string">&#x27;123456&#x27;</span>
    database: <span class="hljs-string">&#x27;milvus&#x27;</span>
  source_collection:
    <span class="hljs-built_in">test</span>:
      - <span class="hljs-string">&#x27;partition_1&#x27;</span>
      - <span class="hljs-string">&#x27;partition_2&#x27;</span>
  dest_host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
  dest_port: 19530
  mode: <span class="hljs-string">&#x27;skip&#x27;</span> <span class="hljs-comment"># &#x27;skip/append/overwrite&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3.<strong>M2M.yamlを</strong>実行する<strong>。</strong></p>
<pre><code translate="no">$ milvusdm --yaml M2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">サンプルコード</h4><p>1.指定されたコレクションまたはパーティションのメタデータに従って、ローカルドライブの<strong>milvus/db</strong>以下のファイルを読み込み、ソースMilvusからベクターとそれに対応するIDを取得する。</p>
<pre><code translate="no">collection_parameter, _ = milvus_meta.get_collection_info(collection_name)
r_vectors, r_ids, r_rows = milvusdb.read_milvus_file(<span class="hljs-variable language_">self</span>.milvus_meta, collection_name, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p>2.取得したデータをターゲットのMilvusに挿入する。</p>
<pre><code translate="no">milvus_insert.insert_data(r_vectors, collection_name, collection_parameter, <span class="hljs-variable language_">self</span>.mode, r_ids, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-to-HDF5" class="common-anchor-header">MilvusからHDF5への変換</h3><h4 id="Steps" class="common-anchor-header">手順</h4><p>1.<strong>M2H.yamlを</strong>ダウンロードする：</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/M2H.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.以下のパラメータを設定する：</p>
<ul>
<li><p><code translate="no">source_milvus_path</code>:Milvusワークパスのソース。</p></li>
<li><p><code translate="no">mysql_parameter</code>:MilvusのMySQLの設定。MySQLを使用しない場合は、mysql_parameterを''に設定する。</p></li>
<li><p><code translate="no">source_collection</code>:ソースMilvusにおけるコレクションとそのパーティションの名前。</p></li>
<li><p><code translate="no">data_dir</code>:保存したHDF5ファイルを格納するディレクトリ。</p></li>
</ul>
<pre><code translate="no">M2H:
  milvus_version: <span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
  source_milvus_path: <span class="hljs-string">&#x27;/home/user/milvus&#x27;</span>
  mysql_parameter:
    host: <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
    user: <span class="hljs-string">&#x27;root&#x27;</span>
    port: <span class="hljs-number">3306</span>
    password: <span class="hljs-string">&#x27;123456&#x27;</span>
    database: <span class="hljs-string">&#x27;milvus&#x27;</span>
  source_collection: # specify the <span class="hljs-string">&#x27;partition_1&#x27;</span> and <span class="hljs-string">&#x27;partition_2&#x27;</span> partitions of the <span class="hljs-string">&#x27;test&#x27;</span> collection.
    test:
      - <span class="hljs-string">&#x27;partition_1&#x27;</span>
      - <span class="hljs-string">&#x27;partition_2&#x27;</span>
  data_dir: <span class="hljs-string">&#x27;/home/user/data&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3.<strong>M2H.yamlを</strong>実行する：</p>
<pre><code translate="no">$ milvusdm --yaml M2H.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">サンプルコード</h4><p>1.指定されたコレクションまたはパーティションのメタデータに従って、ローカルドライブ上の<strong>milvus/db</strong>以下のファイルを読み込み、ベクターとそれに対応するIDを取得する。</p>
<pre><code translate="no">collection_parameter, version = milvus_meta.get_collection_info(collection_name)
r_vectors, r_ids, r_rows = milvusdb.read_milvus_file(<span class="hljs-variable language_">self</span>.milvus_meta, collection_name, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p>2.取得したデータをHDF5ファイルとして保存する。</p>
<pre><code translate="no">data_save.save_yaml(collection_name, partition_tag, collection_parameter, version, save_hdf5_name)
<button class="copy-code-btn"></button></code></pre>
<h3 id="MilvusDM-File-Structure" class="common-anchor-header">MilvusDMのファイル構成</h3><p>以下のフローチャートは、MilvusDMが受信したYAMLファイルに従ってどのように異なるタスクを実行するかを示しています：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvusdm_blog_2_7824b16e5e.png" alt="milvusdm blog 2.png" class="doc-image" id="milvusdm-blog-2.png" />
   </span> <span class="img-wrapper"> <span>milvusdm ブログ 2.png</span> </span></p>
<p>MilvusDMのファイル構造</p>
<ul>
<li><p>pymilvusdm</p>
<ul>
<li><p>コア</p>
<ul>
<li><p><strong>milvus_client.py</strong>：milvusのクライアント操作を行います。</p></li>
<li><p><strong>read_data.py</strong>：ローカルドライブ上のHDF5データファイルを読み込みます。(他の形式のデータファイルの読み込みをサポートするにはここにコードを追加してください)</p></li>
<li><p><strong>read_faiss_data.py</strong>：Faissのデータファイルを読み込みます。</p></li>
<li><p><strong>read_milvus_data.py</strong>：Milvusのデータファイルを読み込みます。</p></li>
<li><p><strong>read_milvus_meta.py</strong>：Milvusのメタデータを読み込みます。</p></li>
<li><p><strong>data_to_milvus.py</strong>：YAMLファイルのパラメータに基づいてコレクションまたはパーティションを作成し、ベクターと対応するベクターIDをMilvusにインポートします。</p></li>
<li><p><strong>save_data.py</strong>：データをHDF5ファイルとして保存します。</p></li>
<li><p><strong>write_logs.py</strong>：実行時にログを書き込みます。</p></li>
</ul></li>
<li><p><strong>faiss_to_milvus.py</strong>：Faissからmilvusにデータをインポートします。</p></li>
<li><p><strong>hdf5_to_milvus.py</strong>：HDF5ファイルのデータをmilvusにインポートします。</p></li>
<li><p><strong>milvus_to_milvus.py</strong>：ソースMilvusからターゲットMilvusへデータを移行します。</p></li>
<li><p><strong>milvus_to_hdf5.py</strong>：Milvusのデータをエクスポートし、HDF5ファイルとして保存します。</p></li>
<li><p><strong>main.py</strong>：受け取ったYAMLファイルに従って対応するタスクを実行します。</p></li>
<li><p><strong>setting.py</strong>：MilvusDMコードの実行に関する設定を行います。</p></li>
</ul></li>
<li><p><strong>setup.py</strong>：<strong>pymilvusdm</strong>ファイルのパッケージを作成し、PyPI (Python Package Index)にアップロードします。</p></li>
</ul>
<p><br/></p>
<h3 id="Recap" class="common-anchor-header">まとめ</h3><p>MilvusDMは主にMilvusからMilvus、HDF5からMilvus、MilvusからMilvus、MilvusからHDF5へのデータ移行を行う。</p>
<p>今後のリリースでは以下の機能が予定されています：</p>
<ul>
<li><p>FaissからMilvusへのバイナリデータのインポート。</p></li>
<li><p>MilvusからMilvusへのバイナリデータのインポート。</p></li>
<li><p>ソースMilvusの複数のコレクションまたはパーティションからターゲットMilvusの新しいコレクションへのデータのマージとインポート。</p></li>
<li><p>Milvusデータのバックアップとリカバリ。</p></li>
</ul>
<p>MilvusDMプロジェクトは<a href="https://github.com/milvus-io/milvus-tools">Github</a>上でオープンソース化されています。プロジェクトへの貢献は大歓迎です。スターを付けてください🌟。そして、<a href="https://github.com/milvus-io/milvus-tools/issues">issueを</a>提出したり、あなた自身のコードを投稿してください！</p>
