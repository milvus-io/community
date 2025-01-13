---
id: Milvus-Data-Migration-Tool.md
title: 介紹 Milvus 資料遷移工具
author: Zilliz
date: 2021-03-15T10:19:51.125Z
desc: 了解如何使用 Milvus 資料遷移工具，大幅提升資料管理效率並降低 DevOps 成本。
cover: assets.zilliz.com/Generic_Tool_Announcement_97eb04a898.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/Milvus-Data-Migration-Tool'
---
<custom-h1>介紹 Milvus 資料遷移工具</custom-h1><p><em><strong>重要提示</strong>：Mivus 資料遷移工具已被淘汰。從其他資料庫遷移資料到 Milvus，我們建議您使用更先進的「Milvus-遷移工具」。</em></p>
<p>Milvus-migration 工具目前支援：</p>
<ul>
<li>Elasticsearch 到 Milvus 2.x</li>
<li>Faiss 到 Milvus 2.x</li>
<li>Milvus 1.x 至 Milvus 2.x</li>
<li>Milvus 2.3.x 至 Milvus 2.3.x 或更高版本</li>
</ul>
<p>我們將支援從更多向量資料來源的遷移，例如 Pinecone、Chroma 和 Qdrant。敬請期待。</p>
<p><strong>如需更多資訊，請參閱<a href="https://milvus.io/docs/migrate_overview.md">Milvus-migration 文件</a>或其<a href="https://github.com/zilliztech/milvus-migration">GitHub 套件庫</a>。</strong></p>
<p>---------------------------------<strong>Mivus 資料遷移工具已被廢棄</strong>----------------------</p>
<h3 id="Overview" class="common-anchor-header">概述</h3><p><a href="https://github.com/milvus-io/milvus-tools">MilvusDM</a>(Milvus Data Migration) 是一個開放原始碼工具，專門設計用於使用 Milvus 匯入和匯出資料檔案。MilvusDM 可以透過以下方式大幅提升資料管理效率並降低 DevOps 成本：</p>
<ul>
<li><p><a href="#faiss-to-milvus">Faiss 至 Milvus</a>：從 Faiss 匯入未壓縮的資料至 Milvus。</p></li>
<li><p><a href="#hdf5-to-milvus">HDF5 to Milvus</a>：將 HDF5 檔案匯入 Milvus。</p></li>
<li><p><a href="#milvus-to-milvus">Milvus 到 Milvus</a>：從源 Milvus 遷移資料到不同的目標 Milvus。</p></li>
<li><p><a href="#milvus-to-hdf5">Milvus to HDF5</a>: 將 Milvus 中的資料儲存為 HDF5 檔案。</p></li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvusdm_blog_1_199cbdebe7.png" alt="milvusdm blog 1.png" class="doc-image" id="milvusdm-blog-1.png" />
   </span> <span class="img-wrapper"> <span>MilvusDM 博客 1.png</span> </span></p>
<p>MilvusDM 寄存在<a href="https://github.com/milvus-io/milvus-tools">Github</a>上，執行命令列<code translate="no">pip3 install pymilvusdm</code> 即可輕鬆安裝。MilvusDM 允許您遷移特定集合或分割區中的資料。在下面的章節中，我們將解釋如何使用每種資料遷移類型。</p>
<p><br/></p>
<h3 id="Faiss-to-Milvus" class="common-anchor-header">Faiss 到 Milvus</h3><h4 id="Steps" class="common-anchor-header">步驟</h4><p>1.下載<strong>F2M.yaml</strong>：</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/F2</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.設定下列參數</p>
<ul>
<li><p><code translate="no">data_path</code>:Faiss 中的資料路徑 (向量及其對應的 ID)。</p></li>
<li><p><code translate="no">dest_host</code>:Milvus 伺服器位址。</p></li>
<li><p><code translate="no">dest_port</code>:Milvus 伺服器連接埠。</p></li>
<li><p><code translate="no">mode</code>:可使用下列模式將資料匯入 Milvus：</p>
<ul>
<li><p>跳過：如果資料集或分割區已存在，則忽略資料。</p></li>
<li><p>追加：如果資料集或分割區已存在，則附加資料。</p></li>
<li><p>覆寫：如果資料集或分割區已存在，則在插入前刪除資料。</p></li>
</ul></li>
<li><p><code translate="no">dest_collection_name</code>:接收匯入資料的集合名稱。</p></li>
<li><p><code translate="no">dest_partition_name</code>:資料匯入的接收分割區名稱。</p></li>
<li><p><code translate="no">collection_parameter</code>:特定於集合的資訊，例如向量尺寸、索引檔案大小和距離公制。</p></li>
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
<p>3.執行<strong>F2M.yaml：</strong></p>
<pre><code translate="no">$ milvusdm --yaml F2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">範例程式碼</h4><p>1.讀取 Faiss 檔案以擷取向量及其對應的 ID。</p>
<pre><code translate="no">ids, vectors = faiss_data.read_faiss_data()
<button class="copy-code-btn"></button></code></pre>
<p>2.將擷取的資料插入 Milvus：</p>
<pre><code translate="no">insert_milvus.insert_data(vectors, <span class="hljs-variable language_">self</span>.dest_collection_name, <span class="hljs-variable language_">self</span>.collection_parameter, <span class="hljs-variable language_">self</span>.mode, ids, <span class="hljs-variable language_">self</span>.dest_partition_name)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="HDF5-to-Milvus" class="common-anchor-header">HDF5 到 Milvus</h3><h4 id="Steps" class="common-anchor-header">步驟</h4><p>1.下載<strong>H2M.yaml</strong>。</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/H2M.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.設定下列參數</p>
<ul>
<li><p><code translate="no">data_path</code>:HDF5 檔案的路徑。</p></li>
<li><p><code translate="no">data_dir</code>:存放 HDF5 檔案的目錄。</p></li>
<li><p><code translate="no">dest_host</code>:Milvus 伺服器位址。</p></li>
<li><p><code translate="no">dest_port</code>:Milvus 伺服器連接埠。</p></li>
<li><p><code translate="no">mode</code>:可使用下列模式將資料匯入 Milvus：</p>
<ul>
<li><p>跳過：如果資料集或分割區已存在，則忽略資料。</p></li>
<li><p>追加：如果資料集或分割區已存在，則附加資料。</p></li>
<li><p>覆寫：如果資料集或分割區已存在，則在插入前刪除資料。</p></li>
</ul></li>
<li><p><code translate="no">dest_collection_name</code>:接收匯入資料的集合名稱。</p></li>
<li><p><code translate="no">dest_partition_name</code>:資料匯入的接收分割區名稱。</p></li>
<li><p><code translate="no">collection_parameter</code>:特定於集合的資訊，例如向量尺寸、索引檔案大小和距離公制。</p></li>
</ul>
<blockquote>
<p>設定<code translate="no">data_path</code> 或<code translate="no">data_dir</code> 。請<strong>勿</strong>同時設定。使用<code translate="no">data_path</code> 指定多個檔案路徑，或使用<code translate="no">data_dir</code> 指定存放資料檔案的目錄。</p>
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
<p>3.執行<strong>H2M.yaml：</strong></p>
<pre><code translate="no">$ milvusdm --yaml H2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">範例程式碼</h4><p>1.讀取 HDF5 檔案以擷取向量及其對應的 ID：</p>
<pre><code translate="no">vectors, ids = <span class="hljs-variable language_">self</span>.file.read_hdf5_data()
<button class="copy-code-btn"></button></code></pre>
<p>2.將擷取的資料插入 Milvus：</p>
<pre><code translate="no">ids = insert_milvus.insert_data(vectors, <span class="hljs-variable language_">self</span>.c_name, <span class="hljs-variable language_">self</span>.c_param, <span class="hljs-variable language_">self</span>.mode, ids,<span class="hljs-variable language_">self</span>.p_name)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-to-Milvus" class="common-anchor-header">Milvus 到 Milvus</h3><h4 id="Steps" class="common-anchor-header">步驟</h4><p>1.下載<strong>M2M.yaml</strong>。</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/M2M.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.設定下列參數</p>
<ul>
<li><p><code translate="no">source_milvus_path</code>:源 Milvus 工作路徑。</p></li>
<li><p><code translate="no">mysql_parameter</code>:Source Milvus MySQL 設定。如果不使用 MySQL，請將 mysql_parameter 設為 ''.</p></li>
<li><p><code translate="no">source_collection</code>:源 Milvus 中集合及其分區的名稱。</p></li>
<li><p><code translate="no">dest_host</code>:Milvus 伺服器位址。</p></li>
<li><p><code translate="no">dest_port</code>:Milvus 伺服器連接埠。</p></li>
<li><p><code translate="no">mode</code>:可使用下列模式將資料匯入 Milvus：</p>
<ul>
<li><p>跳過：如果資料集或分割區已存在，則忽略資料。</p></li>
<li><p>追加：如果資料集或分割區已存在，則附加資料。</p></li>
<li><p>覆寫：如果資料集或磁碟分割已經存在，請在插入前刪除資料。</p></li>
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
<p>3.執行<strong>M2M.yaml。</strong></p>
<pre><code translate="no">$ milvusdm --yaml M2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">範例程式碼</h4><p>1.根據指定的 collection 或 partition 的 metadata，讀取本機磁碟上<strong>milvus/db</strong>下的檔案，從原始 Milvus 擷取向量及其對應的 ID。</p>
<pre><code translate="no">collection_parameter, _ = milvus_meta.get_collection_info(collection_name)
r_vectors, r_ids, r_rows = milvusdb.read_milvus_file(<span class="hljs-variable language_">self</span>.milvus_meta, collection_name, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p>2.將擷取的資料插入目標 Milvus。</p>
<pre><code translate="no">milvus_insert.insert_data(r_vectors, collection_name, collection_parameter, <span class="hljs-variable language_">self</span>.mode, r_ids, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-to-HDF5" class="common-anchor-header">將 Milvus 轉換成 HDF5</h3><h4 id="Steps" class="common-anchor-header">步驟</h4><p>1.下載<strong>M2H.yaml</strong>：</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/M2H.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.設定下列參數</p>
<ul>
<li><p><code translate="no">source_milvus_path</code>:源 Milvus 工作路徑。</p></li>
<li><p><code translate="no">mysql_parameter</code>:Source Milvus MySQL 設定。如果不使用 MySQL，請將 mysql_parameter 設為 ''.</p></li>
<li><p><code translate="no">source_collection</code>:源 Milvus 中集合及其分區的名稱。</p></li>
<li><p><code translate="no">data_dir</code>:保存 HDF5 檔案的目錄。</p></li>
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
<p>3.執行<strong>M2H.yaml</strong>：</p>
<pre><code translate="no">$ milvusdm --yaml M2H.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">範例程式碼</h4><p>1.根據指定的集合或分割區的 metadata，讀取本機磁碟上<strong>milvus/db</strong>下的檔案，以擷取向量及其對應的 ID。</p>
<pre><code translate="no">collection_parameter, version = milvus_meta.get_collection_info(collection_name)
r_vectors, r_ids, r_rows = milvusdb.read_milvus_file(<span class="hljs-variable language_">self</span>.milvus_meta, collection_name, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p>2.將擷取的資料儲存為 HDF5 檔案。</p>
<pre><code translate="no">data_save.save_yaml(collection_name, partition_tag, collection_parameter, version, save_hdf5_name)
<button class="copy-code-btn"></button></code></pre>
<h3 id="MilvusDM-File-Structure" class="common-anchor-header">MilvusDM 檔案結構</h3><p>下面的流程圖顯示 MilvusDM 如何根據接收到的 YAML 檔案執行不同的任務：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvusdm_blog_2_7824b16e5e.png" alt="milvusdm blog 2.png" class="doc-image" id="milvusdm-blog-2.png" />
   </span> <span class="img-wrapper"> <span>milvusdm blog 2.png</span> </span></p>
<p>MilvusDM 檔案結構：</p>
<ul>
<li><p>pymilvusdm</p>
<ul>
<li><p>核心</p>
<ul>
<li><p><strong>milvus_client.py</strong>：在 Milvus 中執行用戶端操作。</p></li>
<li><p><strong>read_data.py</strong>：讀取本機磁碟機上的 HDF5 資料檔案。(在此加入您的程式碼，以支援讀取其他格式的資料檔案)。</p></li>
<li><p><strong>read_faiss_data.py</strong>：讀取 Faiss 中的資料檔案。</p></li>
<li><p><strong>read_milvus_data.py</strong>：讀取 Milvus 的資料檔案。</p></li>
<li><p><strong>read_milvus_meta.py：</strong>讀取 Milvus 的 metadata。</p></li>
<li><p><strong>data_too_milvus.py</strong>：根據 YAML 檔案中的參數建立集合或分割，並將向量和對應的向量 ID 匯入 Milvus。</p></li>
<li><p><strong>save_data.py</strong>：將資料儲存為 HDF5 檔案。</p></li>
<li><p><strong>write_logs.py：</strong>在執行時寫入日誌。</p></li>
</ul></li>
<li><p><strong>faiss_to_milvus.py</strong>：將資料從 Faiss 匯入 Milvus。</p></li>
<li><p><strong>hdf5_to_milvus.py</strong>：將 HDF5 檔案中的資料匯入 Milvus。</p></li>
<li><p><strong>milvus_to_milvus.py</strong>：將資料從源 Milvus 遷移到目標 Milvus。</p></li>
<li><p><strong>milvus_to_hdf5.py</strong>：匯出 Milvus 中的資料，並將其儲存為 HDF5 檔案。</p></li>
<li><p><strong>main.py</strong>：根據接收到的 YAML 檔執行相應任務。</p></li>
<li><p><strong>setting.py</strong>：與執行 MilvusDM 程式碼相關的設定。</p></li>
</ul></li>
<li><p><strong>setup.py：</strong>建立<strong>pymilvusdm</strong>檔案套件，並將其上傳至 PyPI (Python Package Index)。</p></li>
</ul>
<p><br/></p>
<h3 id="Recap" class="common-anchor-header">重溫</h3><p>MilvusDM 主要處理將資料遷入或遷出 Milvus，包括將 Faiss 遷入 Milvus、將 HDF5 遷入 Milvus、將 Milvus 遷入 Milvus，以及將 Milvus 遷入 HDF5。</p>
<p>計畫在即將發佈的版本中提供下列功能：</p>
<ul>
<li><p>從 Faiss 匯入二進位資料至 Milvus。</p></li>
<li><p>在來源 Milvus 和目標 Milvus 之間進行資料遷移的 Blocklist 和 allowlist。</p></li>
<li><p>從源 Milvus 的多個資料庫或分區合併和匯入資料到目標 Milvus 的新資料庫。</p></li>
<li><p>備份和復原 Milvus 資料。</p></li>
</ul>
<p>MilvusDM 專案在<a href="https://github.com/milvus-io/milvus-tools">Github</a> 上開放原始碼。歡迎任何及所有對專案的貢獻。給它顆星🌟，並隨意提出<a href="https://github.com/milvus-io/milvus-tools/issues">問題</a>或提交您自己的程式碼！</p>
