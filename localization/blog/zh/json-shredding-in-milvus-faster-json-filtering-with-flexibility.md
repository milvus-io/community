---
id: json-shredding-in-milvus-faster-json-filtering-with-flexibility.md
title: Milvus 中的 JSON 粉碎功能：以 88.9 倍的速度灵活过滤 JSON
author: Jack Zhang
date: 2025-12-04T00:00:00.000Z
cover: assets.zilliz.com/Milvus_Week_JSON_Shredding_cover_829a12b086.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, JSON Shredding, JSON performance, columnar storage'
meta_title: |
  Milvus JSON Shredding: Faster JSON Filtering With Flexibility
desc: 了解 Milvus JSON Shredding 如何使用优化的列式存储将 JSON 查询速度提高 89 倍，同时保留完整 Schema 的灵活性。
origin: >-
  https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md
---
<p>现代人工智能系统正在产生比以往更多的半结构化 JSON 数据。客户和产品信息被压缩成一个 JSON 对象，微服务在每次请求时都会发出 JSON 日志，物联网设备以轻量级 JSON 有效载荷的形式流式传输传感器读数，如今的人工智能应用也越来越多地采用 JSON 作为结构化输出的标准。结果，大量类似 JSON 的数据涌入向量数据库。</p>
<p>传统上，处理 JSON 文档有两种方法：</p>
<ul>
<li><p><strong>将 JSON 的每个字段预先定义为固定的 Schema 并建立索引：</strong>这种方法可以提供稳定的查询性能，但比较死板。一旦数据格式发生变化，每个新字段或修改字段都会引发新一轮痛苦的数据定义语言（DDL）更新和 Schema 迁移。</p></li>
<li><p><strong>将整个 JSON 对象存储为单列（Milvus 中的 JSON 类型和动态 Schema 都使用这种方法）：</strong>该选项具有出色的灵活性，但代价是查询性能下降。每次请求都需要进行运行时 JSON 解析，通常还需要进行全表扫描，从而导致延迟随着数据集的增长而激增。</p></li>
</ul>
<p>这曾经是灵活性和性能的两难选择。</p>
<p>有了<a href="https://milvus.io/">Milvus</a> 新推出的 JSON 切碎功能，这种情况就不会再发生了。</p>
<p>随着<a href="https://milvus.io/docs/json-shredding.md">JSON Shredding</a> 功能的推出，Milvus 实现了无 Schema 灵活性和列式存储的性能，最终使大规模半结构化数据变得既灵活又便于查询。</p>
<h2 id="How-JSON-Shredding-Works" class="common-anchor-header">JSON 破碎处理的工作原理<button data-href="#How-JSON-Shredding-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>JSON 切碎通过将基于行的 JSON 文档转换为高度优化的列式存储，加快了 JSON 查询的速度。Milvus 为数据建模保留了 JSON 的灵活性，同时自动优化列式存储--显著提高数据访问和查询性能。</p>
<p>为了有效处理稀疏或罕见的 JSON 字段，Milvus 还为共享键提供了反转索引。所有这些对用户来说都是透明的：你可以像往常一样插入 JSON 文档，让 Milvus 在内部管理最佳存储和索引策略。</p>
<p>当 Milvus 接收到具有不同形状和结构的原始 JSON 记录时，它会分析每个 JSON 关键字的出现率和类型稳定性（其数据类型在不同文档中是否一致）。根据分析结果，每个关键字被分为以下三类：</p>
<ul>
<li><p><strong>类型键：</strong>出现在大多数文档中且始终具有相同数据类型的键（例如，所有整数或所有字符串）。</p></li>
<li><p><strong>动态键</strong>：经常出现但具有混合数据类型（如有时是字符串，有时是整数）的键。</p></li>
<li><p><strong>共享键：</strong>不经常出现、稀疏或嵌套的键，低于可配置的频率阈值。</p></li>
</ul>
<p>Milvus 对每个类别都有不同的处理方式，以最大限度地提高效率：</p>
<ul>
<li><p><strong>类型键</strong>存储在专用的强类型列中。</p></li>
<li><p><strong>动态键则</strong>根据运行时观察到的实际值类型放置在动态列中。</p></li>
<li><p>类型化列和动态列都以 Arrow/Parquet 列格式存储，以实现快速扫描和高度优化的查询执行。</p></li>
<li><p><strong>共享键</strong>被合并到一个紧凑的二进制-JSON 列中，并附带一个共享键反转索引。该索引通过提前剪切不相关的行，并将搜索范围限制在仅包含所查询键的文档上，从而加快了低频字段的查询速度。</p></li>
</ul>
<p>这种自适应列式存储和倒排索引的组合构成了 Milvus JSON 切碎机制的核心，既能实现灵活性，又能实现高性能。</p>
<p>整体工作流程如下图所示：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/json_shredding_79a62a9661.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>既然我们已经介绍了 JSON 破碎机制的基本工作原理，下面就让我们来详细了解使这种方法既灵活又高性能的关键功能。</p>
<h3 id="Shredding-and-Columnarization" class="common-anchor-header">切碎和列化</h3><p>当编写新的 JSON 文档时，Milvus 会将其分解并重组为优化的列式存储：</p>
<ul>
<li><p>类型键和动态键会被自动识别并存储在专用列中。</p></li>
<li><p>如果 JSON 包含嵌套对象，Milvus 会自动生成基于路径的列名。例如，<code translate="no">user</code> 对象中的<code translate="no">name</code> 字段可以用列名<code translate="no">/user/name</code> 来存储。</p></li>
<li><p>共享键一起存储在一个紧凑的二进制 JSON 列中。由于这些键出现的频率不高，Milvus 会为它们建立一个倒排索引，从而实现快速过滤，让系统能快速找到包含指定键的行。</p></li>
</ul>
<h3 id="Intelligent-Column-Management" class="common-anchor-header">智能列管理</h3><p>除了将 JSON 粉碎成列外，Milvus 还通过动态列管理增加了一层智能，确保 JSON 粉碎在数据演变时保持灵活性。</p>
<ul>
<li><p><strong>根据需要创建列：</strong>当传入的 JSON 文档中出现新的键时，Milvus 会自动将具有相同键的值分组到专用列中。这就保留了列式存储的性能优势，而无需用户预先设计 Schema。Milvus 还能推断新字段的数据类型（如 INTEGER、DOUBLE、VARCHAR），并为其选择高效的列格式。</p></li>
<li><p><strong>每个键都会自动处理：</strong>Milvus 会分析和处理 JSON 文档中的每个键。这确保了广泛的查询覆盖范围，而不会强迫用户预先定义字段或建立索引。</p></li>
</ul>
<h3 id="Query-Optimization" class="common-anchor-header">查询优化</h3><p>一旦数据被重组到正确的列中，Milvus 就会为每个查询选择最有效的执行路径：</p>
<ul>
<li><p><strong>对键入键和动态键进行直接列扫描：</strong>如果查询的目标字段已被拆分为自己的列，Milvus 可以直接扫描该列。这就减少了需要处理的数据总量，并利用 SIMD 加速列计算实现更快的执行速度。</p></li>
<li><p><strong>共享键的索引查找：</strong>如果查询涉及的字段没有提升到自己的列中，通常是一个罕见的键，Milvus 会根据共享键列对查询进行评估。在这一列上建立的反转索引允许 Milvus 快速识别哪些行包含指定的键，并跳过其余行，从而显著提高低频字段的性能。</p></li>
<li><p><strong>自动元数据管理：</strong>Milvus 可持续维护全局元数据和字典，因此即使传入的 JSON 文档结构随时间演变，查询也能保持准确和高效。</p></li>
</ul>
<h2 id="Performance-benchmarks" class="common-anchor-header">性能基准<button data-href="#Performance-benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>我们设计了一个基准来比较将整个 JSON 文档存储为单个原始字段与使用新发布的 JSON 粉碎功能的查询性能。</p>
<h3 id="Test-environment-and-methodology" class="common-anchor-header">测试环境和方法</h3><ul>
<li><p>硬件：1 核/8GB 集群</p></li>
<li><p>数据集来自<a href="https://github.com/ClickHouse/JSONBench.git">JSONBench</a>的 100 万个文档</p></li>
<li><p>测试方法测量不同查询模式下的 QPS 和延迟</p></li>
</ul>
<h3 id="Results-typed-keys" class="common-anchor-header">结果：键入键</h3><p>该测试测量的是查询大多数文档中存在的键时的性能。</p>
<table>
<thead>
<tr><th>查询表达式</th><th>QPS （不粉碎）</th><th>QPS （有粉碎）</th><th>性能提升</th></tr>
</thead>
<tbody>
<tr><td>json['time_us'] &gt; 0</td><td>8.69</td><td>287.5</td><td><strong>33x</strong></td></tr>
<tr><td>json['kind'] == 'commit</td><td>8.42</td><td>126.1</td><td><strong>14.9x</strong></td></tr>
</tbody>
</table>
<h3 id="Results-shared-keys" class="common-anchor-header">结果：共享键</h3><p>本次测试的重点是查询属于 "共享 "类别的稀疏嵌套键。</p>
<table>
<thead>
<tr><th>查询表达式</th><th>QPS （不粉碎）</th><th>QPS （已粉碎）</th><th>性能提升</th></tr>
</thead>
<tbody>
<tr><td>json['identity']['seq'] &gt; 0</td><td>4.33</td><td>385</td><td><strong>88.9x</strong></td></tr>
<tr><td>json['identity']['did'] == 'xxxxx'</td><td>7.6</td><td>352</td><td><strong>46.3x</strong></td></tr>
</tbody>
</table>
<p>共享密钥查询显示了最显著的改进（快达 89 倍），而键入密钥查询则持续提高了 15-30 倍。总体而言，每种查询类型都能从 JSON Shredding 中获益，性能提升非常明显。</p>
<h2 id="Try-It-Now" class="common-anchor-header">立即试用<button data-href="#Try-It-Now" class="anchor-icon" translate="no">
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
    </button></h2><p>无论您是在处理 API 日志、物联网传感器数据，还是在处理快速发展的应用有效载荷，JSON Shredding 都能为您提供罕见的灵活性和高性能。</p>
<p>该功能现已推出，欢迎立即试用。您还可以查看<a href="https://milvus.io/docs/json-shredding.md">此文档</a>了解更多详情。</p>
<p>对最新版 Milvus 的任何功能有疑问或想深入了解？加入我们的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 频道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提交问题。您还可以通过<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 预约 20 分钟的一对一课程，获得见解、指导和问题解答。</p>
<p>如果您还想了解更多信息，请继续关注 Milvus Week 系列的深入探讨。</p>
