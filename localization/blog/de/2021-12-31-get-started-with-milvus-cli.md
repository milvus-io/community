---
id: 2021-12-31-get-started-with-milvus-cli.md
title: Get started with Milvus_CLI
author: Zhuanghong Chen and Zhen Chen
date: 2021-12-31T00:00:00.000Z
desc: This article introduces Milvus_CLI and helps you complete common tasks.
cover: assets.zilliz.com/CLI_9a10de4fcc.png
tag: Engineering
recommend: true
canonicalUrl: 'https://zilliz.com/blog/get-started-with-milvus-cli'
---
<p>In the age of information explosion, we are producing voice, images, videos, and other unstructured data all the time. How do we efficiently analyze this massive amount of data? The emergence of neural networks enables unstructured data to be embedded as vectors, and the Milvus database is a basic data service software, which helps complete the storage, search, and analysis of vector data.</p>
<p>But how can we use the Milvus vector database quickly?</p>
<p>Some users have complained that APIs are hard to memorize and hope there could be simple command lines to operate the Milvus database.</p>
<p>We’re thrilled to introduce Milvus_CLI, a command-line tool dedicated to the Milvus vector database.</p>
<p>Milvus_CLI is a convenient database CLI for Milvus, supporting database connection, data import, data export, and vector calculation using interactive commands in shells. The latest version of Milvus_CLI has the following features.</p>
<ul>
<li><p>All platforms supported, including Windows, Mac, and Linux</p></li>
<li><p>Online and offline installation with pip supported</p></li>
<li><p>Portable, can be used anywhere</p></li>
<li><p>Built on the Milvus SDK for Python</p></li>
<li><p>Help docs included</p></li>
<li><p>Auto-complete supported</p></li>
</ul>
<h2 id="Installation" class="common-anchor-header">Installation<button data-href="#Installation" class="anchor-icon" translate="no">
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
    </button></h2><p>You can install Milvus_CLI either online or offline.</p>
<h3 id="Install-MilvusCLI-online" class="common-anchor-header">Install Milvus_CLI online</h3><p>Run the following command to install Milvus_CLI online with pip. Python 3.8 or later is required.</p>
<pre><code translate="no">pip install milvus-cli
<button class="copy-code-btn"></button></code></pre>
<h3 id="Install-MilvusCLI-offline" class="common-anchor-header">Install Milvus_CLI offline</h3><p>To install Milvus_CLI offline, <a href="https://github.com/milvus-io/milvus_cli/releases">download</a> the latest tarball from the release page first.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_af0e832119.png" alt="1.png" class="doc-image" id="1.png" />
    <span>1.png</span>
  </span>
</p>
<p>After the tarball is downloaded, run the following command to install Milvus_CLI.</p>
<pre><code translate="no">pip install milvus_cli-&lt;version&gt;.tar.gz
<button class="copy-code-btn"></button></code></pre>
<p>After Milvus_CLI is installed, run <code translate="no">milvus_cli</code>. The <code translate="no">milvus_cli &gt;</code> prompt that appears indicates that the command line is ready.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_b50f5d2a5a.png" alt="2.png" class="doc-image" id="2.png" />
    <span>2.png</span>
  </span>
</p>
<p>If you’re using a Mac with the M1 chip or a PC without a Python environment, you can choose to use a portable application instead. To accomplish this, <a href="https://github.com/milvus-io/milvus_cli/releases">download</a> a file on the release page corresponding to your OS, run <code translate="no">chmod +x</code> on the file to make it executable, and run <code translate="no">./</code> on the file to run it.</p>
<h4 id="Example" class="common-anchor-header"><strong>Example</strong></h4><p>The following example makes <code translate="no">milvus_cli-v0.1.8-fix2-macOS</code> executable and runs it.</p>
<pre><code translate="no"><span class="hljs-built_in">sudo</span> <span class="hljs-built_in">chmod</span> +x milvus_cli-v0.1.8-fix2-macOS
./milvus_cli-v0.1.8-fix2-macOS
<button class="copy-code-btn"></button></code></pre>
<h2 id="Usage" class="common-anchor-header">Usage<button data-href="#Usage" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Connect-to-Milvus" class="common-anchor-header">Connect to Milvus</h3><p>Before connecting to Milvus, ensure that Milvus is installed on your server. See <a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">Install Milvus Standalone</a> or <a href="https://milvus.io/docs/v2.0.x/install_cluster-docker.md">Install Milvus Cluster</a> for more information.</p>
<p>If Milvus is installed on your localhost with the default port, run <code translate="no">connect</code>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_f950d3739a.png" alt="3.png" class="doc-image" id="3.png" />
    <span>3.png</span>
  </span>
</p>
<p>Otherwise, run the following command with the IP address of your Milvus server. The following example uses <code translate="no">172.16.20.3</code> as the IP address and <code translate="no">19530</code> as the port number.</p>
<pre><code translate="no">connect -h 172.16.20.3
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_9ff2db9855.png" alt="4.png" class="doc-image" id="4.png" />
    <span>4.png</span>
  </span>
</p>
<h3 id="Create-a-collection" class="common-anchor-header">Create a collection</h3><p>This section introduces how to create a collection.</p>
<p>A collection consists of entities and is similar to a table in RDBMS. See <a href="https://milvus.io/docs/v2.0.x/glossary.md">Glossary</a> for more information.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_95a88c1cbf.png" alt="5.png" class="doc-image" id="5.png" />
    <span>5.png</span>
  </span>
</p>
<h4 id="Example" class="common-anchor-header">Example</h4><p>The following example creates a collection named <code translate="no">car</code>. The <code translate="no">car</code> collection has four fields which are <code translate="no">id</code>, <code translate="no">vector</code>, <code translate="no">color</code>, and <code translate="no">brand</code>. The primary key field is <code translate="no">id</code>. See <a href="https://milvus.io/docs/v2.0.x/cli_commands.md#create-collection">create collection</a> for more information.</p>
<pre><code translate="no">create collection -c car -f <span class="hljs-built_in">id</span>:INT64:primary_field -f vector:FLOAT_VECTOR:<span class="hljs-number">128</span> -f color:INT64:color -f brand:INT64:brand -p <span class="hljs-built_in">id</span> -a -d <span class="hljs-string">&#x27;car_collection&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="List-collections" class="common-anchor-header">List collections</h3><p>Run the following command to list all collections in this Milvus instance.</p>
<pre><code translate="no">list collections
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_1331f4c8bc.png" alt="6.png" class="doc-image" id="6.png" />
    <span>6.png</span>
  </span>
</p>
<p>Run the following command to check the details of the <code translate="no">car</code> collection.</p>
<pre><code translate="no">describe collection -c car 
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_1d70beee54.png" alt="7.png" class="doc-image" id="7.png" />
    <span>7.png</span>
  </span>
</p>
<h3 id="Calculate-the-distance-between-two-vectors" class="common-anchor-header">Calculate the distance between two vectors</h3><p>Run the following command to import data into the <code translate="no">car</code> collection.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> -c car <span class="hljs-string">&#x27;https://raw.githubusercontent.com/zilliztech/milvus_cli/main/examples/import_csv/vectors.csv&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_7609a4359a.png" alt="8.png" class="doc-image" id="8.png" />
    <span>8.png</span>
  </span>
</p>
<p>Run <code translate="no">query</code> and enter <code translate="no">car</code> as the collection name and <code translate="no">id&gt;0</code> as the query expression when prompted. The IDs of the entities that meet the criteria are returned as shown in the following figure.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/9_f0755589f6.png" alt="9.png" class="doc-image" id="9.png" />
    <span>9.png</span>
  </span>
</p>
<p>Run <code translate="no">calc</code> and enter appropriate values when prompted to calculate the distances between vector arrays.</p>
<h3 id="Delete-a-collection" class="common-anchor-header">Delete a collection</h3><p>Run the following command to delete the <code translate="no">car</code> collection.</p>
<pre><code translate="no"><span class="hljs-keyword">delete</span> collection -c car
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/10_16b2b01935.png" alt="10.png" class="doc-image" id="10.png" />
    <span>10.png</span>
  </span>
</p>
<h2 id="More" class="common-anchor-header">More<button data-href="#More" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus_CLI is not limited to the preceding functions. Run <code translate="no">help</code> to view all commands that Milvus_CLI includes and the respective descriptions. Run <code translate="no">&lt;command&gt; --help</code> to view the details of a specified command.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_5f31ccb1e8.png" alt="11.png" class="doc-image" id="11.png" />
    <span>11.png</span>
  </span>
</p>
<p><strong>See also:</strong></p>
<p><a href="https://milvus.io/docs/v2.0.x/cli_commands.md">Milvus_CLI Command Reference</a> under Milvus Docs</p>
<p>We hope Milvus_CLI could help you easily use the Milvus vector database. We will keep optimizing Milvus_CLI and your contributions are welcome.</p>
<p>If you have any questions, feel free to <a href="https://github.com/zilliztech/milvus_cli/issues">file an issue</a> on GitHub.</p>
