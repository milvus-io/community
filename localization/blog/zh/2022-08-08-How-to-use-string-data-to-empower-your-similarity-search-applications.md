---
id: >-
  2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md
title: 如何使用字符串数据增强相似性搜索应用程序的功能
author: Xi Ge
date: 2022-08-08T00:00:00.000Z
desc: 使用字符串数据简化构建自己的相似性搜索应用程序的过程。
cover: assets.zilliz.com/string_6129ce83e6.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/string_6129ce83e6.png" alt="Cover" class="doc-image" id="cover" />
   </span> <span class="img-wrapper"> <span>封面</span> </span></p>
<p>Milvus 2.1 有了<a href="https://milvus.io/blog/2022-08-05-whats-new-in-milvus-2-1.md">一些重大更新</a>，使使用 Milvus 变得更加容易。其中之一就是支持字符串数据类型。目前，Milvus<a href="https://milvus.io/docs/v2.1.x/schema.md#Supported-data-type">支持的数据类型</a>包括字符串、向量、布尔、整数、浮点数等。</p>
<p>本文将介绍对字符串数据类型的支持。请阅读并学习它的功能和使用方法。</p>
<p><strong>跳转到</strong></p>
<ul>
<li><a href="#What-can-you-do-with-string-data">你能用字符串数据做什么？</a></li>
<li><a href="#How-to-manage-string-data-in-Milvus-21">如何在 Milvus 2.1 中管理字符串数据？</a><ul>
<li><a href="#Create-a-collection">创建 Collections</a></li>
<li><a href="#Insert-data">插入和删除数据</a></li>
<li><a href="#Build-an-index">建立索引</a></li>
<li><a href="#Hybrid-search">混合搜索</a></li>
<li><a href="#String-expressions">字符串表达式</a></li>
</ul></li>
</ul>
<custom-h1>你能用字符串数据做什么？</custom-h1><p>支持字符串数据类型是用户最期待的功能之一。它既简化了使用 Milvus 向量数据库构建应用程序的过程，又加快了相似性搜索和向量查询的速度，无论您正在开发什么应用程序，都能在很大程度上提高效率，降低维护成本。</p>
<p>具体来说，Milvus 2.1 支持 VARCHAR 数据类型，它可以存储不同长度的字符串。支持 VARCHAR 数据类型后，您可以</p>
<ol>
<li>直接管理字符串数据，而无需借助外部关系数据库。</li>
</ol>
<p>支持 VARCHAR 数据类型后，在向 Milvus 插入数据时，就可以跳过将字符串转换为其他数据类型的步骤。假设您正在为自己的网上书店开发一个图书搜索系统。您正在创建一个图书数据集，并希望用名称来识别图书。在以前的版本中，Milvus 不支持字符串数据类型，因此在将数据插入 Milvus 之前，您可能需要先借助 MySQL 等关系数据库将字符串（书籍名称）转换为书籍 ID。现在，由于支持字符串数据类型，您只需创建一个字符串字段，然后直接输入图书名称而不是其 ID 编号即可。</p>
<p>搜索和查询过程也同样方便。想象一下，有一个客户最喜欢的书是《<em>Hello Milvus</em>》。您想在系统中搜索类似书籍并推荐给客户。在 Milvus 以前的版本中，系统只会返回图书 ID，您需要多走一步，在关系数据库中查询相应的图书信息。但在 Milvus 2.1 中，您可以直接获取图书名称，因为您已经创建了一个包含图书名称的字符串字段。</p>
<p>总之，对字符串数据类型的支持省去了您求助于其他工具管理字符串数据的精力，大大简化了开发过程。</p>
<ol start="2">
<li>通过属性过滤加快<a href="https://milvus.io/docs/v2.1.x/hybridsearch.md">混合搜索</a>和<a href="https://milvus.io/docs/v2.1.x/query.md">向量查询</a>的速度。</li>
</ol>
<p>与其他标量数据类型一样，VARCHAR 也可以在混合搜索和向量查询中通过布尔表达式进行属性过滤。特别值得一提的是，Milvus 2.1 增加了操作符<code translate="no">like</code> ，可以执行前缀匹配。此外，还可以使用操作符<code translate="no">==</code> 进行精确匹配。</p>
<p>此外，Milvus 2.1 还支持基于 MARISA-trie 的倒排索引，以加速混合搜索和查询。请继续阅读，了解使用字符串数据执行属性筛选时可能需要了解的所有字符串表达式。</p>
<custom-h1>如何在 Milvus 2.1 中管理字符串数据？</custom-h1><p>现在我们知道字符串数据类型非常有用，但在构建自己的应用程序时，我们究竟什么时候需要使用这种数据类型呢？在下文中，您将看到一些可能涉及字符串数据的场景代码示例，这将让您更好地理解如何在 Milvus 2.1 中管理 VARCHAR 数据。</p>
<h2 id="Create-a-collection" class="common-anchor-header">创建 Collections<button data-href="#Create-a-collection" class="anchor-icon" translate="no">
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
    </button></h2><p>让我们继续前面的示例。您仍在开发图书推荐系统，并希望创建一个图书 Collections，其中有一个名为<code translate="no">book_name</code> 的主键字段，您将在该字段中插入字符串数据。在这种情况下，您可以在设置字段 Schema 时将数据类型设置为<code translate="no">DataType.VARCHAR</code>，如下例所示。</p>
<p>请注意，在创建 VARCHAR 字段时，必须通过参数<code translate="no">max_length</code> 指定最大字符长度，其值范围为 1 至 65,535 之间。  在本例中，我们将最大长度设置为 200。</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> CollectionSchema, FieldSchema, DataType
book_id = FieldSchema(
  name=<span class="hljs-string">&quot;book_id&quot;</span>, 
  dtype=DataType.INT64, 
)
book_name = FieldSchema( 
  name=<span class="hljs-string">&quot;book_name&quot;</span>, 
  dtype=DataType.VARCHAR, 
  max_length=<span class="hljs-number">200</span>, 
  is_primary=<span class="hljs-literal">True</span>, 
)
word_count = FieldSchema(
  name=<span class="hljs-string">&quot;word_count&quot;</span>, 
  dtype=DataType.INT64,  
)
book_intro = FieldSchema(
  name=<span class="hljs-string">&quot;book_intro&quot;</span>, 
  dtype=DataType.FLOAT_VECTOR, 
  dim=<span class="hljs-number">2</span>
)
schema = CollectionSchema(
  fields=[book_id, word_count, book_intro], 
  description=<span class="hljs-string">&quot;Test book search&quot;</span>
)
collection_name = <span class="hljs-string">&quot;book&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Insert-data" class="common-anchor-header">插入数据<button data-href="#Insert-data" class="anchor-icon" translate="no">
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
    </button></h2><p>现在，Collection 已创建，我们可以向其中插入数据。在下面的示例中，我们插入了 2,000 行随机生成的字符串数据。</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">import</span> random
data = [
  [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
  [<span class="hljs-string">&quot;book_&quot;</span> + <span class="hljs-built_in">str</span>(i) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
  [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">10000</span>, <span class="hljs-number">12000</span>)],
  [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Delete-data" class="common-anchor-header">删除数据<button data-href="#Delete-data" class="anchor-icon" translate="no">
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
    </button></h2><p>假设有两本名为<code translate="no">book_0</code> 和<code translate="no">book_1</code> 的书在商店中已停售，因此您想从数据库中删除相关信息。在这种情况下，您可以使用术语表达式<code translate="no">in</code> 过滤要删除的实体，如下例所示。</p>
<p>请记住，Milvus 只支持删除具有明确指定主键的实体，因此在运行以下代码之前，请确保已将<code translate="no">book_name</code> 字段设置为主键字段。</p>
<pre><code translate="no" class="language-Python">expr = <span class="hljs-string">&quot;book_name in [\&quot;book_0\&quot;, \&quot;book_1\&quot;]&quot;</span> 
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collection</span>
collection = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&quot;book&quot;</span>)     
collection.<span class="hljs-title function_">delete</span>(expr)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Build-an-Index" class="common-anchor-header">建立索引<button data-href="#Build-an-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 支持建立标量索引，这将大大加快过滤字符串字段的速度。与建立向量索引不同，在建立标量索引之前，你不必准备参数。Milvus 暂时只支持字典树（MARISA-trie）索引，因此 VARCHAR 类型字段的索引类型默认为 MARISA-trie。</p>
<p>在建立索引时，可以指定索引名称。如果未指定，<code translate="no">index_name</code> 的默认值为<code translate="no">&quot;_default_idx_&quot;</code> 。在下面的示例中，我们将索引命名为<code translate="no">scalar_index</code> 。</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collection</span>
collection = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&quot;book&quot;</span>)   
collection.<span class="hljs-title function_">create_index</span>(
  field_name=<span class="hljs-string">&quot;book_name&quot;</span>, 
  index_name=<span class="hljs-string">&quot;scalar_index&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Hybrid-search" class="common-anchor-header">混合搜索<button data-href="#Hybrid-search" class="anchor-icon" translate="no">
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
    </button></h2><p>通过指定布尔表达式，可以在向量相似性搜索过程中过滤字符串字段。</p>
<p>例如，如果要搜索简介与《Hello Milvus》最相似的图书，但只想得到名称以 "book_2 "开头的图书，可以使用操作符<code translate="no">like</code>进行前缀匹配，得到目标图书，如下例所示。</p>
<pre><code translate="no" class="language-Python">search_param = {
  <span class="hljs-string">&quot;data&quot;</span>: [[<span class="hljs-number">0.1</span>, <span class="hljs-number">0.2</span>]],
  <span class="hljs-string">&quot;anns_field&quot;</span>: <span class="hljs-string">&quot;book_intro&quot;</span>,
  <span class="hljs-string">&quot;param&quot;</span>: {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
  <span class="hljs-string">&quot;limit&quot;</span>: <span class="hljs-number">2</span>,
  <span class="hljs-string">&quot;expr&quot;</span>: <span class="hljs-string">&quot;book_name like \&quot;Hello%\&quot;&quot;</span>,
}
res = collection.<span class="hljs-title function_">search</span>(**search_param)
<button class="copy-code-btn"></button></code></pre>
<h2 id="String-expressions" class="common-anchor-header">字符串表达式<button data-href="#String-expressions" class="anchor-icon" translate="no">
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
    </button></h2><p>除了新添加的操作符<code translate="no">like</code> 之外，Milvus 先前版本已经支持的其他操作符也可用于字符串字段过滤。下面是一些常用<a href="https://milvus.io/docs/v2.1.x/boolean.md">字符串表达式</a>的示例，其中<code translate="no">A</code> 表示 VARCHAR 类型的字段。请记住，下面的所有字符串表达式都可以使用 AND、OR 和 NOT 等逻辑操作符进行逻辑组合。</p>
<h3 id="Set-operations" class="common-anchor-header">集合操作符</h3><p>可以使用<code translate="no">in</code> 和<code translate="no">not in</code> 实现集合操作，如<code translate="no">A in [&quot;str1&quot;, &quot;str2&quot;]</code> 。</p>
<h3 id="Compare-two-string-fields" class="common-anchor-header">比较两个字符串字段</h3><p>您可以使用关系操作符来比较两个字符串字段的值。此类关系操作符包括<code translate="no">==</code>,<code translate="no">!=</code>,<code translate="no">&gt;</code>,<code translate="no">&gt;=</code>,<code translate="no">&lt;</code>,<code translate="no">&lt;=</code> 。更多信息，请参阅<a href="https://milvus.io/docs/v2.1.x/boolean.md#Relational-operators">关系操作符</a>。</p>
<p>请注意，字符串字段只能与其他字符串字段比较，而不能与其他数据类型的字段比较。例如，VARCHAR 类型的字段不能与布尔或整数类型的字段比较。</p>
<h3 id="Compare-a-field-with-a-constant-value" class="common-anchor-header">将字段与常量值进行比较</h3><p>您可以使用<code translate="no">==</code> 或<code translate="no">!=</code> 验证字段的值是否等于常量值。</p>
<h3 id="Filter-fields-with-a-single-range" class="common-anchor-header">用单一范围过滤字段</h3><p>可以使用<code translate="no">&gt;</code>,<code translate="no">&gt;=</code>,<code translate="no">&lt;</code>,<code translate="no">&lt;=</code> 过滤具有单一范围的字符串字段，如<code translate="no">A &gt; &quot;str1&quot;</code> 。</p>
<h3 id="Prefix-matching" class="common-anchor-header">前缀匹配</h3><p>如前所述，Milvus 2.1 增加了用于前缀匹配的操作符<code translate="no">like</code> ，如<code translate="no">A like &quot;prefix%&quot;</code> 。</p>
<h2 id="Whats-next" class="common-anchor-header">下一步<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>随着 Milvus 2.1 的正式发布，我们准备了一系列介绍新功能的博客。请阅读本系列博客中的更多内容：</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">如何使用字符串数据增强相似性搜索应用程序的功能</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">使用 Embedded Milvus 即时安装并用 Python 运行 Milvus</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">利用内存复制提高向量数据库的读取吞吐量</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">了解 Milvus 向量数据库的一致性水平</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">了解 Milvus 向量数据库的一致性水平（第二部分）</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Milvus 向量数据库如何确保数据安全？</a></li>
</ul>
