---
id: embedded-milvus.md
title: Using Embedded Milvus to Instantly Install and Run Milvus with Python
author: Alex Gao
date: 2022-08-15T00:00:00.000Z
desc: A Python user-friendly Milvus version that makes installation more flexible.
cover: assets.zilliz.com/embeddded_milvus_1_8132468cac.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/embedded-milvus.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/embeddded_milvus_1_8132468cac.png" alt="Cover" class="doc-image" id="cover" />
    <span>Cover</span>
  </span>
</p>
<blockquote>
<p>This article is co-authored by <a href="https://github.com/soothing-rain/">Alex Gao</a> and <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Milvus is an open-source vector database for AI applications. It provides a variety of installation methods including building from source code, and installing Milvus with Docker Compose/Helm/APT/YUM/Ansible. Users can choose one of the installation methods depending on their operating systems and preferences. However, there are many data scientists and AI engineers in the Milvus community who work with Python and yearn for a much simpler installation method than the currently available ones.</p>
<p>Therefore, we released embedded Milvus, a Python user-friendly version, along with Milvus 2.1 to empower more Python developers in our community. This article introduces what embedded Milvus is and provides instructions on how to install and use it.</p>
<p><strong>Jump to:</strong></p>
<ul>
<li><a href="#An-overview-of-embedded-Milvus">An overview of embedded Milvus</a>
<ul>
<li><a href="#When-to-use-embedded-Milvus">When to use embedded Milvus?</a></li>
<li><a href="#A-comparison-of-different-modes-of-Milvus">A comparison of different modes of Milvus</a></li>
</ul></li>
<li><a href="#How-to-install-embedded-Milvus">How to install embedded Milvus</a></li>
<li><a href="#Start-and-stop-embedded-Milvus">Start and stop embedded Milvus</a></li>
</ul>
<h2 id="An-overview-of-embedded-Milvus" class="common-anchor-header">An overview of embedded Milvus<button data-href="#An-overview-of-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/milvus-io/embd-milvus">Embedded Milvus</a> enables you to quickly install and use Milvus with Python. It can quickly bring up a Milvus instance and allows you to start and stop the Milvus service whenever you wish to. All data and logs are persisted even if you stop embedded Milvus.</p>
<p>Embedded Milvus itself does not have any internal dependencies and do not require pre-installing and running any third-party dependencies like etcd, MinIO, Pulsar, etc.</p>
<p>Everything you do with embedded Milvus, and every piece of code you write for it can be safely migrated to other Milvus modes - standalone, cluster, cloud version, etc. This reflects one of the most distinctive features of embedded Milvus - <strong>“Write once, run anywhere”</strong>.</p>
<h3 id="When-to-use-embedded-Milvus" class="common-anchor-header">When to use embedded Milvus?</h3><p>Embedded Milvus and <a href="https://milvus.io/docs/v2.1.x/install-pymilvus.md">PyMilvus</a> are constructed for different purposes. You may consider choosing embedded Milvus in the following scenarios:</p>
<ul>
<li><p>You want to use Milvus without installing Milvus in any of the ways provided <a href="https://milvus.io/docs/v2.1.x/install_standalone-docker.md">here</a>.</p></li>
<li><p>You want to use Milvus without keeping a long-running Milvus process in your machine.</p></li>
<li><p>You want to quickly use Milvus without starting a separate Milvus process and other required components like etcd, MinIO, Pulsar, etc.</p></li>
</ul>
<p>It is suggested that you should <strong>NOT</strong> use embedded Milvus:</p>
<ul>
<li><p>In a production environment. (<em>To use Milvus for production, consider Milvus cluster or <a href="https://zilliz.com/cloud">Zilliz cloud</a>, a fully managed Milvus service.</em>)</p></li>
<li><p>If you have a high demand for performance. (<em>Comparatively speaking, embedded Milvus might not provide the best performance.</em>)</p></li>
</ul>
<h3 id="A-comparison-of-different-modes-of-Milvus" class="common-anchor-header">A comparison of different modes of Milvus</h3><p>The table below compares several modes of Milvus: standalone, cluster, embedded Milvus, and the Zilliz Cloud, a fully managed Milvus service.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/comparison_ebcd7c5b07.jpeg" alt="comparison" class="doc-image" id="comparison" />
    <span>comparison</span>
  </span>
</p>
<h2 id="How-to-install-embedded-Milvus" class="common-anchor-header">How to install embedded Milvus?<button data-href="#How-to-install-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Before installing embedded Milvus, you need to first ensure that you have installed Python 3.6 or later. Embedded Milvus supports the following operating systems:</p>
<ul>
<li><p>Ubuntu 18.04</p></li>
<li><p>Mac x86_64 &gt;= 10.4</p></li>
<li><p>Mac M1 &gt;= 11.0</p></li>
</ul>
<p>If the requirements are met, you can run <code translate="no">$ python3 -m pip install milvus</code> to install embedded Milvus. You can also add the version in the command to install a specific version of embedded Milvus. For instance, if you want to install the 2.1.0 version, run <code translate="no">$ python3 -m pip install milvus==2.1.0</code>. And later when new version of embedded Milvus is released, you can also run <code translate="no">$ python3 -m pip install --upgrade milvus</code> to upgrade embedded Milvus to the latest version.</p>
<p>If you are an old user of Milvus who has already installed PyMilvus before and wants to install embedded Milvus, you can run <code translate="no">$ python3 -m pip install --no-deps milvus</code>.</p>
<p>After running the installation command, you need to create a data folder for embedded Milvus under <code translate="no">/var/bin/e-milvus</code> by running the following command:</p>
<pre><code translate="no"><span class="hljs-built_in">sudo</span> <span class="hljs-built_in">mkdir</span> -p /var/bin/e-milvus
<span class="hljs-built_in">sudo</span> <span class="hljs-built_in">chmod</span> -R 777 /var/bin/e-milvus
<button class="copy-code-btn"></button></code></pre>
<h2 id="Start-and-stop-embedded-Milvus" class="common-anchor-header">Start and stop embedded Milvus<button data-href="#Start-and-stop-embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>When the installation is successful, you can start the service.</p>
<p>If you are running embedded Milvus for the first time you need to import Milvus and set up embedded Milvus first.</p>
<pre><code translate="no">$ python3
Python 3.9.10 (main, Jan 15 2022, 11:40:53)
[Clang 13.0.0 (clang-1300.0.29.3)] on darwin
Type <span class="hljs-string">&quot;help&quot;</span>, <span class="hljs-string">&quot;copyright&quot;</span>, <span class="hljs-string">&quot;credits&quot;</span> or <span class="hljs-string">&quot;license&quot;</span> <span class="hljs-keyword">for</span> more information.
&gt;&gt;&gt; import milvus
&gt;&gt;&gt; milvus.before()
please <span class="hljs-keyword">do</span> the following <span class="hljs-keyword">if</span> you have not already <span class="hljs-keyword">done</span> so:
1. install required dependencies: bash /var/bin/e-milvus/lib/install_deps.sh
2. <span class="hljs-built_in">export</span> LD_PRELOAD=/SOME_PATH/embd-milvus.so
3. <span class="hljs-built_in">export</span> LD_LIBRARY_PATH=<span class="hljs-variable">$LD_LIBRARY_PATH</span>:/usr/lib:/usr/local/lib:/var/bin/e-milvus/lib/
&gt;&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>If you have successfully started embedded Milvus before and comes back to restart it, you can directly run <code translate="no">milvus.start()</code> after importing Milvus.</p>
<pre><code translate="no">$ python3
Python <span class="hljs-number">3.9</span><span class="hljs-number">.10</span> (main, Jan <span class="hljs-number">15</span> <span class="hljs-number">2022</span>, <span class="hljs-number">11</span>:<span class="hljs-number">40</span>:<span class="hljs-number">53</span>)
[Clang <span class="hljs-number">13.0</span><span class="hljs-number">.0</span> (clang-<span class="hljs-number">1300.0</span><span class="hljs-number">.29</span><span class="hljs-number">.3</span>)] on darwinType <span class="hljs-string">&quot;help&quot;</span>, <span class="hljs-string">&quot;copyright&quot;</span>, <span class="hljs-string">&quot;credits&quot;</span> <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;license&quot;</span> <span class="hljs-keyword">for</span> more information.
<span class="hljs-meta">&gt;&gt;&gt; </span><span class="hljs-keyword">import</span> milvus
<span class="hljs-meta">&gt;&gt;&gt; </span>milvus.start()
&gt;&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>You will see the following output if you have successfully started the embedded Milvus service.</p>
<pre><code translate="no">---<span class="hljs-title class_">Milvus</span> <span class="hljs-title class_">Proxy</span> successfully initialized and ready to serve!---
<button class="copy-code-btn"></button></code></pre>
<p>After the service starts, you can start another terminal window and run the example code of &quot;<a href="https://github.com/milvus-io/embd-milvus/blob/main/milvus/examples/hello_milvus.py">Hello Milvus</a>&quot; to play around with embedded Milvus!</p>
<pre><code translate="no"><span class="hljs-comment"># Download hello_milvus script</span>
$ wget https://raw.githubusercontent.com/milvus-io/pymilvus/v2.1.0/examples/hello_milvus.py
<span class="hljs-comment"># Run Hello Milvus </span>
$ python3 hello_milvus.py
<button class="copy-code-btn"></button></code></pre>
<p>When you are done with using embedded Milvus, we recommend stopping it gracefully and clean up the environment variables by run the following command or press Ctrl-D.</p>
<pre><code translate="no">&gt;&gt;&gt; milvus.stop()
<span class="hljs-keyword">if</span> you need to clean up the environment variables, run:
<span class="hljs-built_in">export</span> LD_PRELOAD=
<span class="hljs-built_in">export</span> LD_LIBRARY_PATH=
&gt;&gt;&gt;
&gt;&gt;&gt; <span class="hljs-built_in">exit</span>()
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-next" class="common-anchor-header">What’s next<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>With the official release of Milvus 2.1, we have prepared a series of blogs introducing the new features. Read more in this blog series:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">How to Use String Data to Empower Your Similarity Search Applications</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Using Embedded Milvus to Instantly Install and Run Milvus with Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Increase Your Vector Database Read Throughput with In-Memory Replicas</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Understanding Consistency Level in the Milvus Vector Database</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Understanding Consistency Level in the Milvus Vector Database (Part II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">How Does the Milvus Vector Database Ensure Data Security?</a></li>
</ul>
