---
id: >-
  2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md
title: 如何使用字串資料強化您的相似性搜尋應用程式
author: Xi Ge
date: 2022-08-08T00:00:00.000Z
desc: 使用字串資料簡化建立您自己的相似性搜尋應用程式的程序。
cover: assets.zilliz.com/string_6129ce83e6.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/string_6129ce83e6.png" alt="Cover" class="doc-image" id="cover" />
   </span> <span class="img-wrapper"> <span>封面</span> </span></p>
<p>Milvus 2.1 帶來了<a href="https://milvus.io/blog/2022-08-05-whats-new-in-milvus-2-1.md">一些重要的更新</a>，讓使用 Milvus 更加容易。其中之一是支援字串資料類型。目前 Milvus<a href="https://milvus.io/docs/v2.1.x/schema.md#Supported-data-type">支援的資料類型</a>包括字串、向量、布林值、整數、浮點數等等。</p>
<p>本文將介紹字串資料類型的支援。閱讀並學習您可以用它做什麼以及如何使用它。</p>
<p><strong>跳至：</strong></p>
<ul>
<li><a href="#What-can-you-do-with-string-data">您可以使用字串資料做什麼？</a></li>
<li><a href="#How-to-manage-string-data-in-Milvus-21">如何在 Milvus 2.1 中管理字串資料？</a><ul>
<li><a href="#Create-a-collection">建立集合</a></li>
<li><a href="#Insert-data">插入和刪除資料</a></li>
<li><a href="#Build-an-index">建立索引</a></li>
<li><a href="#Hybrid-search">混合搜尋</a></li>
<li><a href="#String-expressions">字串表達式</a></li>
</ul></li>
</ul>
<custom-h1>您可以對字串資料做什麼？</custom-h1><p>支援字串資料類型是使用者最期待的功能之一。它既簡化了使用 Milvus 向量資料庫建立應用程式的過程，又加快了相似性搜索和向量查詢的速度，無論您正在開發什麼應用程式，都能在很大程度上提高效率，降低維護成本。</p>
<p>具體而言，Milvus 2.1 支援 VARCHAR 資料類型，可儲存不同長度的字串。有了 VARCHAR 資料類型的支援，您可以</p>
<ol>
<li>直接管理字串資料，無需外部關聯資料庫的協助。</li>
</ol>
<p>VARCHAR 資料類型的支援，讓您在插入資料到 Milvus 時，可以省略將字串轉換成其他資料類型的步驟。假設您正在為自己的線上書店開發一個書籍搜尋系統。您正在創建一個書籍資料集，並希望用書名來識別書籍。在以前的版本中，Milvus 不支援字串資料類型，在插入資料到 MIilvus 之前，您可能需要先將字串（書籍名稱）轉換成書籍 ID，並借助 MySQL 等關係型資料庫。現在，由於支援字串資料類型，您可以簡單地建立一個字串欄位，直接輸入書籍名稱而非其 ID 號碼。</p>
<p>搜尋和查詢過程也同樣方便。假設有一位客戶最喜歡的書是《<em>Hello Milvus</em>》。您想在系統中搜尋類似的書籍，並推薦給客戶。在 Milvus 以前的版本中，系統只會回傳給您書籍的 ID，您需要多走一步，在關聯資料庫中檢查相應的書籍資訊。但在 Milvus 2.1 中，您可以直接獲取書籍名稱，因為您已經創建了一個包含書籍名稱的字串欄位。</p>
<p>一言以蔽之，字串資料類型的支援，讓您省去了求助其他工具來管理字串資料的功夫，大大簡化了開發流程。</p>
<ol start="2">
<li>透過屬性篩選加快<a href="https://milvus.io/docs/v2.1.x/hybridsearch.md">混合搜尋與</a> <a href="https://milvus.io/docs/v2.1.x/query.md">向量查詢</a>的速度。</li>
</ol>
<p>和其他標量資料類型一樣，VARCHAR 也可以在混合搜尋和向量查詢中透過布林表達式進行屬性篩選。特別值得一提的是，Milvus 2.1 增加了運算符<code translate="no">like</code> ，使您能夠執行前綴匹配。您也可以使用運算符<code translate="no">==</code> 執行精確匹配。</p>
<p>此外，Milvus 2.1 還支援基於 MARISA-trie 的反向索引，以加速混合搜尋與查詢。繼續閱讀，找出您可能想知道的所有字串表達式，以便使用字串資料執行屬性篩選。</p>
<custom-h1>如何在 Milvus 2.1 中管理字串資料？</custom-h1><p>現在我們知道字串資料類型非常有用，但我們在建立自己的應用程式時，到底什麼時候需要使用這種資料類型呢？在下文中，您將看到一些可能涉及到字串資料的場景的程式碼範例，這將讓您更了解如何在 Milvus 2.1 中管理 VARCHAR 資料。</p>
<h2 id="Create-a-collection" class="common-anchor-header">建立一個集合<button data-href="#Create-a-collection" class="anchor-icon" translate="no">
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
    </button></h2><p>讓我們依照之前的範例。您仍在進行書籍推薦系統的工作，並想要建立一個書籍集合，其中有一個叫做<code translate="no">book_name</code> 的主索引欄位，您會在其中插入字串資料。在這種情況下，您可以在設定欄位模式時將資料類型設定為<code translate="no">DataType.VARCHAR</code>，如下例所示。</p>
<p>請注意，在建立 VARCHAR 欄位時，必須透過參數<code translate="no">max_length</code> 指定最大字元長度，其值範圍為 1 到 65,535。  在本例中，我們設定最大長度為 200。</p>
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
<h2 id="Insert-data" class="common-anchor-header">插入資料<button data-href="#Insert-data" class="anchor-icon" translate="no">
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
    </button></h2><p>現在集合已建立，我們可以插入資料。在下面的範例中，我們插入 2,000 行隨機產生的字串資料。</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">import</span> random
data = [
  [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
  [<span class="hljs-string">&quot;book_&quot;</span> + <span class="hljs-built_in">str</span>(i) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
  [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">10000</span>, <span class="hljs-number">12000</span>)],
  [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Delete-data" class="common-anchor-header">刪除資料<button data-href="#Delete-data" class="anchor-icon" translate="no">
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
    </button></h2><p>假設有兩本書，名為<code translate="no">book_0</code> 和<code translate="no">book_1</code> ，在您的商店中已不再有售，因此您想從資料庫中刪除相關資訊。在這種情況下，您可以使用術語表達式<code translate="no">in</code> 來過濾要刪除的實體，如下例所示。</p>
<p>請記住，Milvus 只支援刪除具有明確指定主索引鍵的實體，因此在執行以下程式碼之前，請確定您已經設定<code translate="no">book_name</code> 欄位為主索引鍵欄位。</p>
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
    </button></h2><p>Milvus 2.1 支援建立標量索引，這將大大加快過濾字串欄位的速度。與建立向量索引不同，你不需要在建立標量索引前準備參數。Milvus 暫時只支援字典樹 (MARISA-trie) 索引，因此 VARCHAR 類型欄位的索引類型預設為 MARISA-trie。</p>
<p>您可以在建立索引時指定索引名稱。如果未指定，則<code translate="no">index_name</code> 的預設值為<code translate="no">&quot;_default_idx_&quot;</code> 。在下面的範例中，我們將索引命名為<code translate="no">scalar_index</code> 。</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collection</span>
collection = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&quot;book&quot;</span>)   
collection.<span class="hljs-title function_">create_index</span>(
  field_name=<span class="hljs-string">&quot;book_name&quot;</span>, 
  index_name=<span class="hljs-string">&quot;scalar_index&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Hybrid-search" class="common-anchor-header">混合搜尋<button data-href="#Hybrid-search" class="anchor-icon" translate="no">
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
    </button></h2><p>透過指定布林表達式，您可以在向量相似性搜尋過程中篩選字串欄位。</p>
<p>例如，如果您正在搜尋引言與 Hello Milvus 最相似的書籍，但只想取得名稱以 'book_2' 開頭的書籍，您可以使用運算符<code translate="no">like</code>來執行前綴匹配，並取得目標書籍，如下例所示。</p>
<pre><code translate="no" class="language-Python">search_param = {
  <span class="hljs-string">&quot;data&quot;</span>: [[<span class="hljs-number">0.1</span>, <span class="hljs-number">0.2</span>]],
  <span class="hljs-string">&quot;anns_field&quot;</span>: <span class="hljs-string">&quot;book_intro&quot;</span>,
  <span class="hljs-string">&quot;param&quot;</span>: {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
  <span class="hljs-string">&quot;limit&quot;</span>: <span class="hljs-number">2</span>,
  <span class="hljs-string">&quot;expr&quot;</span>: <span class="hljs-string">&quot;book_name like \&quot;Hello%\&quot;&quot;</span>,
}
res = collection.<span class="hljs-title function_">search</span>(**search_param)
<button class="copy-code-btn"></button></code></pre>
<h2 id="String-expressions" class="common-anchor-header">字串表達式<button data-href="#String-expressions" class="anchor-icon" translate="no">
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
    </button></h2><p>除了新加入的運算符號<code translate="no">like</code> 之外，Milvus 先前版本已經支援的其他運算符號，也可以用來篩選字串欄位。以下是一些常用<a href="https://milvus.io/docs/v2.1.x/boolean.md">字串表達式</a>的範例，其中<code translate="no">A</code> 代表 VARCHAR 類型的欄位。請記住，以下所有字串表達式都可以使用邏輯運算符號（如 AND、OR 和 NOT）進行邏輯組合。</p>
<h3 id="Set-operations" class="common-anchor-header">集合操作</h3><p>您可以使用<code translate="no">in</code> 和<code translate="no">not in</code> 來實現集合操作，例如<code translate="no">A in [&quot;str1&quot;, &quot;str2&quot;]</code> 。</p>
<h3 id="Compare-two-string-fields" class="common-anchor-header">比較兩個字串欄位</h3><p>您可以使用關係運算符來比較兩個字串欄位的值。這類關係運算符包括<code translate="no">==</code>,<code translate="no">!=</code>,<code translate="no">&gt;</code>,<code translate="no">&gt;=</code>,<code translate="no">&lt;</code>,<code translate="no">&lt;=</code> 。如需詳細資訊，請參閱<a href="https://milvus.io/docs/v2.1.x/boolean.md#Relational-operators">關聯運算符</a>。</p>
<p>請注意，字串欄位只能與其他字串欄位比較，而不能與其他資料類型的欄位比較。例如，VARCHAR 類型的欄位不能與 Boolean 或 integer 類型的欄位比較。</p>
<h3 id="Compare-a-field-with-a-constant-value" class="common-anchor-header">比較欄位與常數值</h3><p>您可以使用<code translate="no">==</code> 或<code translate="no">!=</code> 來驗證欄位的值是否等於常數值。</p>
<h3 id="Filter-fields-with-a-single-range" class="common-anchor-header">使用單一範圍篩選欄位</h3><p>您可以使用<code translate="no">&gt;</code>,<code translate="no">&gt;=</code>,<code translate="no">&lt;</code>,<code translate="no">&lt;=</code> 過濾單一範圍的字串欄位，例如<code translate="no">A &gt; &quot;str1&quot;</code> 。</p>
<h3 id="Prefix-matching" class="common-anchor-header">前綴匹配</h3><p>如前所述，Milvus 2.1 增加了運算符<code translate="no">like</code> 用於前綴匹配，如<code translate="no">A like &quot;prefix%&quot;</code> 。</p>
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
    </button></h2><p>隨著 Milvus 2.1 的正式發行，我們準備了一系列介紹新功能的部落格。閱讀此系列部落格的更多內容：</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">如何使用字串資料來強化您的相似性搜尋應用程式</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">使用 Embedded Milvus 即時以 Python 安裝及執行 Milvus</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">使用內建記憶體複本提高向量資料庫的讀取吞吐量</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">瞭解 Milvus 向量資料庫的一致性等級</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">瞭解 Milvus Vector 資料庫的一致性層級（第二部分）</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Milvus Vector 資料庫如何確保資料安全？</a></li>
</ul>
