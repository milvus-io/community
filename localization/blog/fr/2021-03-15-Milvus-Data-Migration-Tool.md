---
id: Milvus-Data-Migration-Tool.md
title: Introducing Milvus Data Migration Tool
author: Zilliz
date: 2021-03-15T10:19:51.125Z
desc: >-
  Learn how to use Milvus data migration tool to greatly improve efficiency of
  data management and reduce DevOps costs.
cover: assets.zilliz.com/Generic_Tool_Announcement_97eb04a898.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/Milvus-Data-Migration-Tool'
---
<custom-h1>Introducing Milvus Data Migration Tool</custom-h1><p><em><strong>Important Note</strong>: The Mivus Data Migration Tool has been deprecated. For data migration from other databases to Milvus, we recommend that you use the more advanced Milvus-migration Tool.</em></p>
<p>The Milvus-migration tool currently supprots:</p>
<ul>
<li>Elasticsearch to Milvus 2.x</li>
<li>Faiss to Milvus 2.x</li>
<li>Milvus 1.x to Milvus 2.x</li>
<li>Milvus 2.3.x to Milvus 2.3.x or above</li>
</ul>
<p>We will support migration from more vector data sources such as Pinecone, Chroma, and Qdrant. Stay tuned.</p>
<p><strong>For more information, see the <a href="https://milvus.io/docs/migrate_overview.md">Milvus-migration documentation</a> or its <a href="https://github.com/zilliztech/milvus-migration">GitHub repository</a>.</strong></p>
<p>--------------------------------- <strong>Mivus Data Migration Tool has been deprecated</strong> ----------------------</p>
<h3 id="Overview" class="common-anchor-header">Overview</h3><p><a href="https://github.com/milvus-io/milvus-tools">MilvusDM</a> (Milvus Data Migration) is an open-source tool designed specifically for importing and exporting data files with Milvus. MilvusDM can greatly improve data mangement efficiency and reduce DevOps costs in the following ways:</p>
<ul>
<li><p><a href="#faiss-to-milvus">Faiss to Milvus</a>: Import unzipped data from Faiss to Milvus.</p></li>
<li><p><a href="#hdf5-to-milvus">HDF5 to Milvus</a>: Import HDF5 files to Milvus.</p></li>
<li><p><a href="#milvus-to-milvus">Milvus to Milvus</a>: Migrate data from a source Milvus to a different target Milvus.</p></li>
<li><p><a href="#milvus-to-hdf5">Milvus to HDF5</a>: Save data in Milvus as HDF5 files.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvusdm_blog_1_199cbdebe7.png" alt="milvusdm blog 1.png" class="doc-image" id="milvusdm-blog-1.png" />
    <span>milvusdm blog 1.png</span>
  </span>
</p>
<p>MilvusDM is hosted on <a href="https://github.com/milvus-io/milvus-tools">Github</a> and can be easily installed by running the command line <code translate="no">pip3 install pymilvusdm</code>. MilvusDM allows you to migrate data in a specific collection or partition. In the following sections, we will explain how to use each data migration type.</p>
<p><br/></p>
<h3 id="Faiss-to-Milvus" class="common-anchor-header">Faiss to Milvus</h3><h4 id="Steps" class="common-anchor-header">Steps</h4><p>1.Download <strong>F2M.yaml</strong>:</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/F2</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.Set the following parameters:</p>
<ul>
<li><p><code translate="no">data_path</code>: Data path (vectors and their corresponding IDs) in Faiss.</p></li>
<li><p><code translate="no">dest_host</code>: Milvus server address.</p></li>
<li><p><code translate="no">dest_port</code>: Milvus server port.</p></li>
<li><p><code translate="no">mode</code>: Data can be imported to Milvus using the following modes:</p>
<ul>
<li><p>Skip: Ignore data if the collection or partition already exists.</p></li>
<li><p>Append: Append data if the collection or partition already exists.</p></li>
<li><p>Overwrite: Delete data before insertion if the collection or partition already exists.</p></li>
</ul></li>
<li><p><code translate="no">dest_collection_name</code>: Name of receiving collection for data import.</p></li>
<li><p><code translate="no">dest_partition_name</code>: Name of receiving partition for data import.</p></li>
<li><p><code translate="no">collection_parameter</code>: Collection-specific information such as vector dimension, index file size, and distance metric.</p></li>
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
<p>3.Run <strong>F2M.yaml:</strong></p>
<pre><code translate="no">$ milvusdm --yaml F2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">Sample Code</h4><p>1.Read Faiss files to retrieve vectors and their corresponding IDs.</p>
<pre><code translate="no">ids, vectors = faiss_data.read_faiss_data()
<button class="copy-code-btn"></button></code></pre>
<p>2.Insert the retrieved data into Milvus:</p>
<pre><code translate="no">insert_milvus.insert_data(vectors, <span class="hljs-variable language_">self</span>.dest_collection_name, <span class="hljs-variable language_">self</span>.collection_parameter, <span class="hljs-variable language_">self</span>.mode, ids, <span class="hljs-variable language_">self</span>.dest_partition_name)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="HDF5-to-Milvus" class="common-anchor-header">HDF5 to Milvus</h3><h4 id="Steps" class="common-anchor-header">Steps</h4><p>1.Download <strong>H2M.yaml</strong>.</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/H2M.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.Set the following parameters:</p>
<ul>
<li><p><code translate="no">data_path</code>: Path to the HDF5 files.</p></li>
<li><p><code translate="no">data_dir</code>: Directory holding the HDF5 files.</p></li>
<li><p><code translate="no">dest_host</code>: Milvus server address.</p></li>
<li><p><code translate="no">dest_port</code>: Milvus server port.</p></li>
<li><p><code translate="no">mode</code>: Data can be imported to Milvus using the following modes:</p>
<ul>
<li><p>Skip: Ignore data if the collection or partition already exists.</p></li>
<li><p>Append: Append data if the collection or partition already exists.</p></li>
<li><p>Overwrite: Delete data before insertion if the collection or partition already exists.</p></li>
</ul></li>
<li><p><code translate="no">dest_collection_name</code>: Name of receiving collection for data import.</p></li>
<li><p><code translate="no">dest_partition_name</code>: Name of receiving partition for data import.</p></li>
<li><p><code translate="no">collection_parameter</code>: Collection-specific information such as vector dimension, index file size, and distance metric.</p></li>
</ul>
<blockquote>
<p>Set either <code translate="no">data_path</code> or <code translate="no">data_dir</code>. Do <strong>not</strong> set both. Use <code translate="no">data_path</code> to specify multiple file paths, or <code translate="no">data_dir</code> to specify the directory holding your data file.</p>
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
<p>3.Run <strong>H2M.yaml:</strong></p>
<pre><code translate="no">$ milvusdm --yaml H2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">Sample Code</h4><p>1.Read the HDF5 files to retrieve vectors and their corresponding IDs:</p>
<pre><code translate="no">vectors, ids = <span class="hljs-variable language_">self</span>.file.read_hdf5_data()
<button class="copy-code-btn"></button></code></pre>
<p>2.Insert the retrieved data into Milvus:</p>
<pre><code translate="no">ids = insert_milvus.insert_data(vectors, <span class="hljs-variable language_">self</span>.c_name, <span class="hljs-variable language_">self</span>.c_param, <span class="hljs-variable language_">self</span>.mode, ids,<span class="hljs-variable language_">self</span>.p_name)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-to-Milvus" class="common-anchor-header">Milvus to Milvus</h3><h4 id="Steps" class="common-anchor-header">Steps</h4><p>1.Download <strong>M2M.yaml</strong>.</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/M2M.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.Set the following parameters:</p>
<ul>
<li><p><code translate="no">source_milvus_path</code>: Source Milvus work path.</p></li>
<li><p><code translate="no">mysql_parameter</code>: Source Milvus MySQL settings. If MySQL is not used, set mysql_parameter as '’.</p></li>
<li><p><code translate="no">source_collection</code>: Names of the collection and its partitions in the source Milvus.</p></li>
<li><p><code translate="no">dest_host</code>: Milvus server address.</p></li>
<li><p><code translate="no">dest_port</code>: Milvus server port.</p></li>
<li><p><code translate="no">mode</code>: Data can be imported to Milvus using the following modes:</p>
<ul>
<li><p>Skip: Ignore data if the collection or partition already exists.</p></li>
<li><p>Append: Append data if the collection or partition already exists.</p></li>
<li><p>Overwrite: If the collection or partition already exists, delete the data before inserting it.Delete data before insertion if the collection or partition already exists.</p></li>
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
<p>3.Run <strong>M2M.yaml.</strong></p>
<pre><code translate="no">$ milvusdm --yaml M2M.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">Sample Code</h4><p>1.According to a specified collection or partition’s metadata, read the files under <strong>milvus/db</strong> on your local drive to retrieve vectors and their corresponding IDs from the source Milvus.</p>
<pre><code translate="no">collection_parameter, _ = milvus_meta.get_collection_info(collection_name)
r_vectors, r_ids, r_rows = milvusdb.read_milvus_file(<span class="hljs-variable language_">self</span>.milvus_meta, collection_name, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p>2.Insert the retrieved data into the target Milvus.</p>
<pre><code translate="no">milvus_insert.insert_data(r_vectors, collection_name, collection_parameter, <span class="hljs-variable language_">self</span>.mode, r_ids, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p><br/></p>
<h3 id="Milvus-to-HDF5" class="common-anchor-header">Milvus to HDF5</h3><h4 id="Steps" class="common-anchor-header">Steps</h4><p>1.Download <strong>M2H.yaml</strong>:</p>
<pre><code translate="no">$ wget <span class="hljs-attr">https</span>:<span class="hljs-comment">//raw.githubusercontent.com/milvus-io/milvus-tools/main/yamls/M2H.yaml</span>
<button class="copy-code-btn"></button></code></pre>
<p>2.Set the following parameters:</p>
<ul>
<li><p><code translate="no">source_milvus_path</code>: Source Milvus work path.</p></li>
<li><p><code translate="no">mysql_parameter</code>: Source Milvus MySQL settings. If MySQL is not used, set mysql_parameter as '’.</p></li>
<li><p><code translate="no">source_collection</code>: Names of the collection and its partitions in the source Milvus.</p></li>
<li><p><code translate="no">data_dir</code>: Directory for holding the saved HDF5 files.</p></li>
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
<p>3.Run <strong>M2H.yaml</strong>:</p>
<pre><code translate="no">$ milvusdm --yaml M2H.yaml
<button class="copy-code-btn"></button></code></pre>
<h4 id="Sample-Code" class="common-anchor-header">Sample Code</h4><p>1.According to a specified collection or partition’s metadata, read the files under <strong>milvus/db</strong> on your local drive to retrieve vectors and their corresponding IDs.</p>
<pre><code translate="no">collection_parameter, version = milvus_meta.get_collection_info(collection_name)
r_vectors, r_ids, r_rows = milvusdb.read_milvus_file(<span class="hljs-variable language_">self</span>.milvus_meta, collection_name, partition_tag)
<button class="copy-code-btn"></button></code></pre>
<p>2.Save the retrieved data as HDF5 files.</p>
<pre><code translate="no">data_save.save_yaml(collection_name, partition_tag, collection_parameter, version, save_hdf5_name)
<button class="copy-code-btn"></button></code></pre>
<h3 id="MilvusDM-File-Structure" class="common-anchor-header">MilvusDM File Structure</h3><p>The flow chart below shows how MilvusDM performs different tasks according to the YAML file it receives:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvusdm_blog_2_7824b16e5e.png" alt="milvusdm blog 2.png" class="doc-image" id="milvusdm-blog-2.png" />
    <span>milvusdm blog 2.png</span>
  </span>
</p>
<p>MilvusDM file structure:</p>
<ul>
<li><p>pymilvusdm</p>
<ul>
<li><p>core</p>
<ul>
<li><p><strong>milvus_client.py</strong>: Performs client operations in Milvus.</p></li>
<li><p><strong>read_data.py</strong>: Reads the HDF5 data files on your local drive. (Add your code here to support reading data files in other formats.)</p></li>
<li><p><strong>read_faiss_data.py</strong>: Reads the data files in Faiss.</p></li>
<li><p><strong>read_milvus_data.py</strong>: Reads the data files in Milvus.</p></li>
<li><p><strong>read_milvus_meta.py</strong>: Reads the metadata in Milvus.</p></li>
<li><p><strong>data_to_milvus.py</strong>: Creates collections or partitions based on parameters in YAML files and imports the vectors and the corresponding vector IDs into Milvus.</p></li>
<li><p><strong>save_data.py</strong>: Saves the data as HDF5 files.</p></li>
<li><p><strong>write_logs.py</strong>: Writes logs during runtime.</p></li>
</ul></li>
<li><p><strong>faiss_to_milvus.py</strong>: Imports data from Faiss into Milvus.</p></li>
<li><p><strong>hdf5_to_milvus.py</strong>: Imports data in HDF5 files into Milvus.</p></li>
<li><p><strong>milvus_to_milvus.py</strong>: Migrates data from a source Milvus to the target Milvus.</p></li>
<li><p><strong>milvus_to_hdf5.p</strong>y: Exports data in Milvus and saves them as HDF5 files.</p></li>
<li><p><strong>main.py</strong>: Performs corresponding tasks according to the received YAML file.</p></li>
<li><p><strong>setting.py</strong>: Configurations relating to running the MilvusDM code.</p></li>
</ul></li>
<li><p><strong>setup.py</strong>: Creates <strong>pymilvusdm</strong> file packages and uploads them to PyPI (Python Package Index).</p></li>
</ul>
<p><br/></p>
<h3 id="Recap" class="common-anchor-header">Recap</h3><p>MilvusDM primarily handles migrating data in and out of Milvus, which includes Faiss to Milvus, HDF5 to Milvus, Milvus to Milvus, and Milvus to HDF5.</p>
<p>The following features are planned for upcoming releases:</p>
<ul>
<li><p>Import binary data from Faiss to Milvus.</p></li>
<li><p>Blocklist and allowlist for data migration between source Milvus and target Milvus.</p></li>
<li><p>Merge and import data from multiple colletions or partitions in source Milvus into a new collection in target Milvus.</p></li>
<li><p>Backup and recovery of the Milvus data.</p></li>
</ul>
<p>The MilvusDM project is open sourced on <a href="https://github.com/milvus-io/milvus-tools">Github</a>. Any and all contributions to the project are welcome. Give it a star 🌟, and feel free to file an <a href="https://github.com/milvus-io/milvus-tools/issues">issue</a> or submit your own code!</p>
