---
id: Milvus-Data-Migration-Tool.md
title: Milvus 数据迁移工具介绍
author: Zilliz
date: 2021-03-15T10:19:51.125Z
desc: 了解如何使用 Milvus 数据迁移工具大大提高数据管理效率，降低 DevOps 成本。
cover: assets.zilliz.com/Generic_Tool_Announcement_97eb04a898.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/Milvus-Data-Migration-Tool'
---
<custom-h1>Milvus 数据迁移工具介绍</custom-h1><p><em><strong>重要提示</strong>：Mivus 数据迁移工具已被弃用。对于从其他数据库到 Milvus 的数据迁移，我们建议您使用更先进的向量传输服务（VTS）。</em></p>
<p><strong>更多信息，请参阅<a href="https://zilliz.com/vector-transport-service">向量传输服务登陆页面</a>或其<a href="https://github.com/zilliztech/vts">GitHub 存储库</a>。</strong></p>
<p>VTS 目前支持从以下数据库迁移数据</p>
<ul>
<li>Pinecone</li>
<li>Qdrant</li>
<li>Elasticsearch</li>
<li>PostgreSQL</li>
<li>腾讯云 VectorDB</li>
<li>OpenSearch</li>
<li>Faiss</li>
<li>Milvus 1.x 至 Milvus 2.x</li>
<li>Milvus 2.3.x 至 Milvus 2.3.x 或更高版本</li>
</ul>
<p>---------------------------------<strong>Mivus 数据迁移工具已被弃用</strong>----------------------</p>
<h3 id="Overview" class="common-anchor-header">概述</h3><p><a href="https://github.com/milvus-io/milvus-tools">MilvusDM</a>（Milvus 数据迁移）是一个开源工具，专门用于用 Milvus 导入和导出数据文件。MilvusDM 可通过以下方式大大提高数据管理效率并降低 DevOps 成本：</p>
<ul>
<li><p>从<a href="#faiss-to-milvus">Faiss 到 Milvus</a>：将未压缩的数据从 Faiss 导入 Milvus。</p></li>
<li><p><a href="#hdf5-to-milvus">HDF5 到 Milvus</a>：将 HDF5 文件导入 Milvus。</p></li>
<li><p><a href="#milvus-to-milvus">Milvus 到 Milvus</a>：从源 Milvus 迁移数据到不同的目标 Milvus。</p></li>
<li><p><a href="#milvus-to-hdf5">Milvus 至 HDF5</a>：将 Milvus 中的数据保存为 HDF5 文件。</p></li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvusdm_blog_1_199cbdebe7.png" alt="milvusdm blog 1.png" class="doc-image" id="milvusdm-blog-1.png" />
   </span> <span class="img-wrapper"> <span>MilvusDM 博客 1.png</span> </span></p>
<p>MilvusDM 托管在<a href="https://github.com/milvus-io/milvus-tools">Github</a>上，可以通过运行命令行<code translate="no">pip3 install pymilvusdm</code> 轻松安装。MilvusDM 允许你迁移特定 Collections 或分区中的数据。在下面的章节中，我们将介绍如何使用每种数据迁移类型。</p>
<p><br/></p>
<h3 id="Faiss-to-Milvus" class="common-anchor-header">从 Faiss 迁移到 Milvus</h3><h4 id="Steps" class="common-anchor-header">步骤</h4><p>1.下载<strong>F2M.yaml</strong>：</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/F2</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.设置以下参数</p>
<ul>
<li><p><code translate="no">data_path</code>:Faiss 中的数据路径（向量及其相应 ID）。</p></li>
<li><p><code translate="no">dest_host</code>:Milvus 服务器地址。</p></li>
<li><p><code translate="no">dest_port</code>:Milvus 服务器端口。</p></li>
<li><p><code translate="no">mode</code>:可使用以下模式将数据导入 Milvus：</p>
<ul>
<li><p>跳过：如果 Collections 或分区已经存在，则忽略数据。</p></li>
<li><p>追加：如果 Collection 或分区已经存在，则添加数据。</p></li>
<li><p>覆盖：如果 Collection 或分区已经存在，则在插入前删除数据。</p></li>
</ul></li>
<li><p><code translate="no">dest_collection_name</code>:用于导入数据的接收 Collections 名称。</p></li>
<li><p><code translate="no">dest_partition_name</code>:接收数据导入的分区名称。</p></li>
<li><p><code translate="no">collection_parameter</code>:特定于 Collections 的信息，如向量维度、索引文件大小和距离度量。</p></li>
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
<p>3.运行<strong>F2M.yaml：</strong></p>
<pre><code translate="no">$ milvusdm --yaml F2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">示例代码</h4><p>1.读取 Faiss 文件以检索向量及其相应的 ID。</p>
<pre><code translate="no">ids, vectors = faiss_data.read_faiss_data()
<button class="copy-code-btn"></button></code></pre>
<p>2.将检索到的数据插入 Milvus：</p>
<pre><code translate="no">insert_milvus.insert_data(vectors, <span class="hljs-variable language_">self</span>.dest_collection_name, <span class="hljs-variable language_">self</span>.collection_parameter, <span class="hljs-variable language_">self</span>.mode, ids, <span class="hljs-variable language_">self</span>.dest_partition_name)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="HDF5-to-Milvus" class="common-anchor-header">从 HDF5 到 Milvus</h3><h4 id="Steps" class="common-anchor-header">步骤</h4><p>1.下载<strong>H2M.yaml</strong>。</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/H2M.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.设置以下参数</p>
<ul>
<li><p><code translate="no">data_path</code>:HDF5 文件路径</p></li>
<li><p><code translate="no">data_dir</code>:保存 HDF5 文件的目录。</p></li>
<li><p><code translate="no">dest_host</code>:Milvus 服务器地址。</p></li>
<li><p><code translate="no">dest_port</code>:Milvus 服务器端口。</p></li>
<li><p><code translate="no">mode</code>:可使用以下模式将数据导入 Milvus：</p>
<ul>
<li><p>跳过：如果 Collections 或分区已经存在，则忽略数据。</p></li>
<li><p>追加：如果 Collection 或分区已经存在，则添加数据。</p></li>
<li><p>覆盖：如果 Collection 或分区已经存在，则在插入前删除数据。</p></li>
</ul></li>
<li><p><code translate="no">dest_collection_name</code>:用于导入数据的接收 Collections 名称。</p></li>
<li><p><code translate="no">dest_partition_name</code>:接收数据导入的分区名称。</p></li>
<li><p><code translate="no">collection_parameter</code>:特定于 Collections 的信息，如向量维度、索引文件大小和距离度量。</p></li>
</ul>
<blockquote>
<p>设置<code translate="no">data_path</code> 或<code translate="no">data_dir</code> 。<strong>请勿</strong>同时设置。使用<code translate="no">data_path</code> 指定多个文件路径，或使用<code translate="no">data_dir</code> 指定存放数据文件的目录。</p>
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
<p>3.运行<strong>H2M.yaml：</strong></p>
<pre><code translate="no">$ milvusdm --yaml H2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">示例代码</h4><p>1.读取 HDF5 文件以检索向量及其对应的 ID：</p>
<pre><code translate="no">vectors, ids = <span class="hljs-variable language_">self</span>.file.read_hdf5_data()
<button class="copy-code-btn"></button></code></pre>
<p>2.将检索到的数据插入 Milvus：</p>
<pre><code translate="no">ids = insert_milvus.insert_data(vectors, <span class="hljs-variable language_">self</span>.c_name, <span class="hljs-variable language_">self</span>.c_param, <span class="hljs-variable language_">self</span>.mode, ids,<span class="hljs-variable language_">self</span>.p_name)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-to-Milvus" class="common-anchor-header">Milvus 到 Milvus</h3><h4 id="Steps" class="common-anchor-header">步骤</h4><p>1.下载<strong>M2M.yaml</strong>。</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/M2M.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.设置以下参数</p>
<ul>
<li><p><code translate="no">source_milvus_path</code>:源 Milvus 工作路径。</p></li>
<li><p><code translate="no">mysql_parameter</code>:源 Milvus MySQL 设置。如果不使用 MySQL，请将 mysql_parameter 设置为""。</p></li>
<li><p><code translate="no">source_collection</code>:源 Milvus 中的 Collections 及其分区名称。</p></li>
<li><p><code translate="no">dest_host</code>:Milvus 服务器地址。</p></li>
<li><p><code translate="no">dest_port</code>:Milvus 服务器端口。</p></li>
<li><p><code translate="no">mode</code>:可使用以下模式将数据导入 Milvus：</p>
<ul>
<li><p>跳过：如果 Collections 或分区已经存在，则忽略数据。</p></li>
<li><p>追加：如果 Collection 或分区已经存在，则添加数据。</p></li>
<li><p>覆盖：如果 Collection 或分区已经存在，则在插入数据前删除数据。如果 Collection 或分区已经存在，则在插入数据前删除数据。</p></li>
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
<p>3.运行<strong>M2M.yaml。</strong></p>
<pre><code translate="no">$ milvusdm --yaml M2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">示例代码</h4><p>1.根据指定的 Collections 或分区的元数据，读取本地硬盘上<strong>milvus/db</strong>下的文件，从源 Milvus 获取向量及其对应的 ID。</p>
<pre><code translate="no">collection_parameter, _ = milvus_meta.get_collection_info(collection_name)
r_vectors, r_ids, r_rows = milvusdb.read_milvus_file(<span class="hljs-variable language_">self</span>.milvus_meta, collection_name, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p>2.将检索到的数据插入目标 Milvus。</p>
<pre><code translate="no">milvus_insert.insert_data(r_vectors, collection_name, collection_parameter, <span class="hljs-variable language_">self</span>.mode, r_ids, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-to-HDF5" class="common-anchor-header">将 Milvus 转换为 HDF5</h3><h4 id="Steps" class="common-anchor-header">步骤</h4><p>1.下载<strong>M2H.yaml</strong>：</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/M2H.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.设置以下参数</p>
<ul>
<li><p><code translate="no">source_milvus_path</code>:源 Milvus 工作路径。</p></li>
<li><p><code translate="no">mysql_parameter</code>:源 Milvus MySQL 设置。如果不使用 MySQL，请将 mysql_parameter 设置为""。</p></li>
<li><p><code translate="no">source_collection</code>:源 Milvus 中的 Collections 及其分区名称。</p></li>
<li><p><code translate="no">data_dir</code>:保存 HDF5 文件的目录。</p></li>
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
<p>3.运行<strong>M2H.yaml</strong>：</p>
<pre><code translate="no">$ milvusdm --yaml M2H.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">示例代码</h4><p>1.根据指定的 Collections 或分区的元数据，读取本地硬盘上<strong>milvus/db</strong>下的文件，检索向量及其相应的 ID。</p>
<pre><code translate="no">collection_parameter, version = milvus_meta.get_collection_info(collection_name)
r_vectors, r_ids, r_rows = milvusdb.read_milvus_file(<span class="hljs-variable language_">self</span>.milvus_meta, collection_name, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p>2.将检索到的数据保存为 HDF5 文件。</p>
<pre><code translate="no">data_save.save_yaml(collection_name, partition_tag, collection_parameter, version, save_hdf5_name)
<button class="copy-code-btn"></button></code></pre>
<h3 id="MilvusDM-File-Structure" class="common-anchor-header">MilvusDM 文件结构</h3><p>下面的流程图显示了 MilvusDM 如何根据接收到的 YAML 文件执行不同的任务：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvusdm_blog_2_7824b16e5e.png" alt="milvusdm blog 2.png" class="doc-image" id="milvusdm-blog-2.png" />
   </span> <span class="img-wrapper"> <span>MilvusDM 博客 2.png</span> </span></p>
<p>MilvusDM 文件结构：</p>
<ul>
<li><p>pymilvusdm</p>
<ul>
<li><p>核心</p>
<ul>
<li><p><strong>milvus_client.py</strong>：在 Milvus 中执行客户端操作。</p></li>
<li><p><strong>read_data.py：</strong>读取本地硬盘上的 HDF5 数据文件。(在此添加你的代码，以支持读取其他格式的数据文件）。</p></li>
<li><p><strong>read_faiss_data.py</strong>：读取 Faiss 中的数据文件。</p></li>
<li><p><strong>read_milvus_data.py</strong>：读取 Milvus 格式的数据文件。</p></li>
<li><p><strong>read_milvus_meta.py：</strong>读取 Milvus 中的元数据。</p></li>
<li><p><strong>data_too_milvus.py</strong>：根据 YAML 文件中的参数创建 Collections 或分区，并将向量和相应的向量 ID 导入 Milvus。</p></li>
<li><p><strong>save_data.py</strong>：将<strong>数据保存</strong>为 HDF5<strong>格式</strong>：将数据保存为 HDF5 文件。</p></li>
<li><p><strong>write_logs.py：</strong>在运行时写入日志。</p></li>
</ul></li>
<li><p><strong>faiss_to_milvus.py</strong>：将数据从 Faiss 导入 Milvus。</p></li>
<li><p><strong>hdf5_to_milvus.py</strong>：将 HDF5 文件中的数据导入 Milvus。</p></li>
<li><p><strong>milvus_to_milvus.py</strong>：将源 Milvus 中的数据迁移到目标 Milvus 中。</p></li>
<li><p><strong>milvus_to_hdf5.py</strong>：导出 Milvus 中的数据并将其保存为 HDF5 文件。</p></li>
<li><p><strong>main.py</strong>：根据接收到的 YAML 文件执行相应任务。</p></li>
<li><p><strong>setting.py</strong>：与运行 MilvusDM 代码相关的配置。</p></li>
</ul></li>
<li><p><strong>setup.py：</strong>创建<strong>pymilvusdm</strong>文件包并将其上传到 PyPI（Python 软件包索引）。</p></li>
</ul>
<p><br/></p>
<h3 id="Recap" class="common-anchor-header">回顾</h3><p>MilvusDM 主要处理数据在 Milvus 中的迁移，包括从 Faiss 迁移到 Milvus、从 HDF5 迁移到 Milvus、从 Milvus 迁移到 Milvus 以及从 Milvus 迁移到 HDF5。</p>
<p>即将发布的版本计划提供以下功能：</p>
<ul>
<li><p>将二进制数据从 Faiss 导入 Milvus。</p></li>
<li><p>在源 Milvus 和目标 Milvus 之间迁移数据的 Blocklist 和 allowlist。</p></li>
<li><p>将源 Milvus 中多个 Collections 或分区的数据合并并导入目标 Milvus 中的新 Collections。</p></li>
<li><p>备份和恢复 Milvus 数据。</p></li>
</ul>
<p>MilvusDM 项目在<a href="https://github.com/milvus-io/milvus-tools">Github</a> 上开源。欢迎为该项目做出任何贡献。给它一颗星🌟，并随时提交<a href="https://github.com/milvus-io/milvus-tools/issues">问题</a>或自己的代码！</p>
