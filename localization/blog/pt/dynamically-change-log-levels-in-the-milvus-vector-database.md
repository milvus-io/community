---
id: dynamically-change-log-levels-in-the-milvus-vector-database.md
title: Dynamically Change Log Levels in the Milvus Vector Database
author: Enwei Jiao
date: 2022-09-21T00:00:00.000Z
desc: Learn how to adjust log level in Milvus without restarting the service.
cover: >-
  assets.zilliz.com/Dynamically_Change_Log_Levels_in_the_Milvus_Vector_Database_58e31c66cc.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/dynamically-change-log-levels-in-the-milvus-vector-database.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Dynamically_Change_Log_Levels_in_the_Milvus_Vector_Database_58e31c66cc.png" alt="Cover image" class="doc-image" id="cover-image" />
    <span>Cover image</span>
  </span>
</p>
<blockquote>
<p>This article is written by <a href="https://github.com/jiaoew1991">Enwei Jiao</a> and translated by <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>To prevent an over-output of logs from affecting disk and system performance, Milvus by default outputs logs at the <code translate="no">info</code> level while running. However, sometimes logs at the <code translate="no">info</code> level are not sufficient enough to help us efficiently identify bugs and issues. What’s worse, in some cases, changing the log level and restarting the service might lead to the failure of reproducing the issues, making troubleshooting all the more difficult. Consequently, the support for changing log levels dynamically in the Milvus vector database is urgently needed.</p>
<p>This article aims to introduce the mechanism behind that enables changing log levels dynamically and provide instructions on how to do so in the Milvus vector database.</p>
<p><strong>Jump to:</strong></p>
<ul>
<li><a href="#Mechanism">Mechanism</a></li>
<li><a href="#How-to-dynamically-change-log-levels">How to dynamically change log levels</a></li>
</ul>
<h2 id="Mechanism" class="common-anchor-header">Mechanism<button data-href="#Mechanism" class="anchor-icon" translate="no">
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
    </button></h2><p>The Milvus vector database adopts the <a href="https://github.com/uber-go/zap">zap</a> logger open sourced by Uber. As one the most powerful log components in the Go language ecosystem, zap incorporates an <a href="https://github.com/uber-go/zap/blob/master/http_handler.go">http_handler.go</a> module so that you can view the current log level and dynamically change the log level via an HTTP interface.</p>
<p>Milvus listens the HTTP service provided by the <code translate="no">9091</code> port. Therefore, you can access the <code translate="no">9091</code> port to take advantage such features as performance debugging, metrics, health checks. Similarly, the <code translate="no">9091</code> port is reused to enable dynamic log level modification and a <code translate="no">/log/level</code> path is also added to the port. See the<a href="https://github.com/milvus-io/milvus/pull/18430"> log interface PR</a> for more information.</p>
<h2 id="How-to-dynamically-change-log-levels" class="common-anchor-header">How to dynamically change log levels<button data-href="#How-to-dynamically-change-log-levels" class="anchor-icon" translate="no">
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
    </button></h2><p>This section provides instructions on how to dynamically change log levels without the need the restarting the running Milvus service.</p>
<h3 id="Prerequisite" class="common-anchor-header">Prerequisite</h3><p>Ensure that you can access the <code translate="no">9091</code> port of Milvus components.</p>
<h3 id="Change-the-log-level" class="common-anchor-header">Change the log level</h3><p>Suppose the IP address of the Milvus proxy is <code translate="no">192.168.48.12</code>.</p>
<p>You can first run <code translate="no">$ curl -X GET 192.168.48.12:9091/log/level</code> to check the current log level of the proxy.</p>
<p>Then you can make adjustments by specifying the log level. Log level options include:</p>
<ul>
<li><p><code translate="no">debug</code></p></li>
<li><p><code translate="no">info</code></p></li>
<li><p><code translate="no">warn</code></p></li>
<li><p><code translate="no">error</code></p></li>
<li><p><code translate="no">dpanic</code></p></li>
<li><p><code translate="no">panic</code></p></li>
<li><p><code translate="no">fatal</code></p></li>
</ul>
<p>The following example code changes the log level from the default log level from <code translate="no">info</code> to <code translate="no">error</code>.</p>
<pre><code translate="no" class="language-Python">$ curl -X PUT 192.168.48.12:9091/log/level -d level=error
<button class="copy-code-btn"></button></code></pre>
