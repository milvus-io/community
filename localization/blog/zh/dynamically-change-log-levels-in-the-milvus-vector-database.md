---
id: dynamically-change-log-levels-in-the-milvus-vector-database.md
title: 动态更改 Milvus 向量数据库中的日志级别
author: Enwei Jiao
date: 2022-09-21T00:00:00.000Z
desc: 了解如何在不重启服务的情况下调整 Milvus 的日志级别。
cover: >-
  assets.zilliz.com/Dynamically_Change_Log_Levels_in_the_Milvus_Vector_Database_58e31c66cc.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/dynamically-change-log-levels-in-the-milvus-vector-database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Dynamically_Change_Log_Levels_in_the_Milvus_Vector_Database_58e31c66cc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>封面图片</span> </span></p>
<blockquote>
<p>本文由<a href="https://github.com/jiaoew1991">焦恩伟</a>撰写，<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">倪安琪</a>翻译。</p>
</blockquote>
<p>为了防止日志输出过多影响磁盘和系统性能，Milvus 在运行时默认输出<code translate="no">info</code> 级别的日志。然而，有时<code translate="no">info</code> 级别的日志并不足以帮助我们有效地识别错误和问题。更糟糕的是，在某些情况下，更改日志级别并重新启动服务可能会导致问题无法重现，使故障排除变得更加困难。因此，迫切需要在 Milvus 向量数据库中支持动态更改日志级别。</p>
<p>本文旨在介绍实现动态更改日志级别的机制，并提供如何在 Milvus 向量数据库中进行更改的说明。</p>
<p><strong>跳转到</strong></p>
<ul>
<li><a href="#Mechanism">机制</a></li>
<li><a href="#How-to-dynamically-change-log-levels">如何动态更改日志级别</a></li>
</ul>
<h2 id="Mechanism" class="common-anchor-header">机制<button data-href="#Mechanism" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 向量数据库采用了由 Uber 开源的<a href="https://github.com/uber-go/zap">zap</a>日志记录器。作为 Go 语言生态系统中功能最强大的日志组件之一，zap 集成了<a href="https://github.com/uber-go/zap/blob/master/http_handler.go">http_handler.go</a>模块，因此您可以通过 HTTP 接口查看当前日志级别并动态更改日志级别。</p>
<p>Milvus 监听<code translate="no">9091</code> 端口提供的 HTTP 服务。因此，你可以访问<code translate="no">9091</code> 端口，利用性能调试、度量、健康检查等功能。同样，<code translate="no">9091</code> 端口也可重复使用，以实现动态日志级别修改，并在端口中添加<code translate="no">/log/level</code> 路径。更多信息，请参阅<a href="https://github.com/milvus-io/milvus/pull/18430"> 日志接口 PR</a>。</p>
<h2 id="How-to-dynamically-change-log-levels" class="common-anchor-header">如何动态更改日志级别<button data-href="#How-to-dynamically-change-log-levels" class="anchor-icon" translate="no">
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
    </button></h2><p>本节介绍如何动态更改日志级别，而无需重启正在运行的 Milvus 服务。</p>
<h3 id="Prerequisite" class="common-anchor-header">前提条件</h3><p>确保可以访问 Milvus 组件的<code translate="no">9091</code> 端口。</p>
<h3 id="Change-the-log-level" class="common-anchor-header">更改日志级别</h3><p>假设 Milvus 代理的 IP 地址是<code translate="no">192.168.48.12</code> 。</p>
<p>可以先运行<code translate="no">$ curl -X GET 192.168.48.12:9091/log/level</code> 检查代理当前的日志级别。</p>
<p>然后通过指定日志级别进行调整。日志级别选项包括</p>
<ul>
<li><p><code translate="no">debug</code></p></li>
<li><p><code translate="no">info</code></p></li>
<li><p><code translate="no">warn</code></p></li>
<li><p><code translate="no">error</code></p></li>
<li><p><code translate="no">dpanic</code></p></li>
<li><p><code translate="no">panic</code></p></li>
<li><p><code translate="no">fatal</code></p></li>
</ul>
<p>以下示例代码将日志级别从默认日志级别<code translate="no">info</code> 更改为<code translate="no">error</code> 。</p>
<pre><code translate="no" class="language-Python">$ curl -X PUT 192.168.48.12:9091/log/level -d level=error
<button class="copy-code-btn"></button></code></pre>
