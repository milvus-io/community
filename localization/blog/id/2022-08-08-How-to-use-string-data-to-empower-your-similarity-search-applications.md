---
id: >-
  2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md
title: How to Use String Data to Empower Your Similarity Search Applications
author: Xi Ge
date: 2022-08-08T00:00:00.000Z
desc: >-
  Use string data to streamline the process of building your own similarity
  search applications.
cover: assets.zilliz.com/string_6129ce83e6.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/string_6129ce83e6.png" alt="Cover" class="doc-image" id="cover" />
    <span>Cover</span>
  </span>
</p>
<p>Milvus 2.1 comes with <a href="https://milvus.io/blog/2022-08-05-whats-new-in-milvus-2-1.md">some significant updates</a> which make working with Milvus a lot easier. One of them is the support of string data type. Right now Milvus <a href="https://milvus.io/docs/v2.1.x/schema.md#Supported-data-type">supports data types</a> including strings, vectors, Boolean, integers, floating-point numbers, and more.</p>
<p>This article presents an introduction to the support of string data type. Read and learn what you can do with it and how to use it.</p>
<p><strong>Jump to:</strong></p>
<ul>
<li><a href="#What-can-you-do-with-string-data">What can you do with string data?</a></li>
<li><a href="#How-to-manage-string-data-in-Milvus-21">How to manage string data in Milvus 2.1?</a>
<ul>
<li><a href="#Create-a-collection">Create a collection</a></li>
<li><a href="#Insert-data">Insert and delete data</a></li>
<li><a href="#Build-an-index">Build an index</a></li>
<li><a href="#Hybrid-search">Hybrid search</a></li>
<li><a href="#String-expressions">String expressions</a></li>
</ul></li>
</ul>
<custom-h1>What can you do with string data?</custom-h1><p>The support of string data type has been one of the functions most expected by users. It both streamlines the process of building an application with the Milvus vector database and accelerates the speed of similarity search and vector query, largely increasing the efficiency and reducing the maintenance cost of whatever application you are working on.</p>
<p>Specifically, Milvus 2.1 supports VARCHAR data type, which stores character strings of varying length. With the support of VARCHAR data type, you can:</p>
<ol>
<li>Directly manage string data without the help of an external relational database.</li>
</ol>
<p>The support of VARCHAR data type enables you to skip the step of converting strings into other data types when inserting data into Milvus. Let’s say you’re working on a book search system for your own online bookstore. You are creating a book dataset and want to identify the books with their names. While in previous versions where Milvus does not support the string data type, before inserting data into MIilvus, you may need to first transform the strings (the names of the books) into book IDs with the help of a relational database like MySQL. Right now, as string data type is supported, you can simply create a string field and directly enter the book names instead of their ID numbers.</p>
<p>The convenience also goes to the search and query process. Imagine there is a client whose favourite book is <em>Hello Milvus</em>. You want to search in the system for similar books and recommend them to the client. In previous versions of Milvus, the system will only return you book IDs and you need to take an extra step to check the corresponding book information in a relational database. But in Milvus 2.1, you can directly get the book names as you have already created a string field with book names in it.</p>
<p>In a word, the support of string data type saves you the effort to turn to other tools to manage string data, which greatly simplifies the development process.</p>
<ol start="2">
<li>Accelerate the speed of <a href="https://milvus.io/docs/v2.1.x/hybridsearch.md">hybrid search</a> and <a href="https://milvus.io/docs/v2.1.x/query.md">vector query</a> through attribute filtering.</li>
</ol>
<p>Like other scalar data types, VARCHAR can be used for attribute filtering in hybrid search and vector query through Boolean expression. It is particularly worth mentioning that Milvus 2.1 adds the operator <code translate="no">like</code>, which enables you to perform prefix matching. Also, you can perform exact matching using the operator <code translate="no">==</code>.</p>
<p>Besides, a MARISA-trie based inverted index is supported to accelerate hybrid search and query. Continue to read and find out all the string expressions you may want to know to perform attribute filtering with string data.</p>
<custom-h1>How to manage string data in Milvus 2.1?</custom-h1><p>Now we know the string data type is extremely useful, but when exactly do we need to use this data type in building our own applications? In the following, you will see some code examples of scenarios that may involve string data, which will give you a better understanding of how to manage VARCHAR data in Milvus 2.1.</p>
<h2 id="Create-a-collection" class="common-anchor-header">Create a collection<button data-href="#Create-a-collection" class="anchor-icon" translate="no">
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
    </button></h2><p>Let’s follow the previous example. You are still working on the book recommender system and want to create a book collection with a primary key field called <code translate="no">book_name</code>, into which you will insert string data. In this case, you can set the data type as <code translate="no">DataType.VARCHAR</code>when setting the field schema, as shown in the example below.</p>
<p>Note that when creating a VARCHAR field, it is necessary to specify the maximum character length via the parameter <code translate="no">max_length</code> whose value can range from 1 to 65,535.  In this example, we set the maximum length as 200.</p>
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
<h2 id="Insert-data" class="common-anchor-header">Insert data<button data-href="#Insert-data" class="anchor-icon" translate="no">
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
    </button></h2><p>Now that the collection is created, we can insert data into it. In the following example, we insert 2,000 rows of randomly generated string data.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">import</span> random
data = [
  [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
  [<span class="hljs-string">&quot;book_&quot;</span> + <span class="hljs-built_in">str</span>(i) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
  [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">10000</span>, <span class="hljs-number">12000</span>)],
  [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Delete-data" class="common-anchor-header">Delete data<button data-href="#Delete-data" class="anchor-icon" translate="no">
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
    </button></h2><p>Suppose two books, named <code translate="no">book_0</code> and <code translate="no">book_1</code>, are no longer available in your store, so you want to delete the relevant information from your database. In this case, you can use the term expression <code translate="no">in</code> to filter the entities to delete, as shown in the example below.</p>
<p>Remember that Milvus only supports deleting entities with clearly specified primary keys, so before running the following code, make sure that you have set the <code translate="no">book_name</code> field as the primary key field.</p>
<pre><code translate="no" class="language-Python">expr = <span class="hljs-string">&quot;book_name in [\&quot;book_0\&quot;, \&quot;book_1\&quot;]&quot;</span> 
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collection</span>
collection = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&quot;book&quot;</span>)     
collection.<span class="hljs-title function_">delete</span>(expr)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Build-an-Index" class="common-anchor-header">Build an Index<button data-href="#Build-an-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 supports building scalar indexes, which will greatly accelerate the filtering of string fields. Unlike building a vector index, you don’t have to prepare parameters before building a scalar index. Milvus temporarily only supports the dictionary tree (MARISA-trie) index, so the index type of VARCHAR type field is MARISA-trie by default.</p>
<p>You can specify the index name when building it. If not specified, the default value of <code translate="no">index_name</code> is <code translate="no">&quot;_default_idx_&quot;</code>. In the example below, we named the index <code translate="no">scalar_index</code>.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collection</span>
collection = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&quot;book&quot;</span>)   
collection.<span class="hljs-title function_">create_index</span>(
  field_name=<span class="hljs-string">&quot;book_name&quot;</span>, 
  index_name=<span class="hljs-string">&quot;scalar_index&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Hybrid-search" class="common-anchor-header">Hybrid search<button data-href="#Hybrid-search" class="anchor-icon" translate="no">
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
    </button></h2><p>By specifying boolean expressions, you can filter the string fields during a vector similarity search.</p>
<p>For example, if you are searching for books whose intro are most similar to Hello Milvus but only want to get the books whose names start with 'book_2’, you can use the operator <code translate="no">like</code>to perform a prefix match and get the targeted books, as shown in the example below.</p>
<pre><code translate="no" class="language-Python">search_param = {
  <span class="hljs-string">&quot;data&quot;</span>: [[<span class="hljs-number">0.1</span>, <span class="hljs-number">0.2</span>]],
  <span class="hljs-string">&quot;anns_field&quot;</span>: <span class="hljs-string">&quot;book_intro&quot;</span>,
  <span class="hljs-string">&quot;param&quot;</span>: {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
  <span class="hljs-string">&quot;limit&quot;</span>: <span class="hljs-number">2</span>,
  <span class="hljs-string">&quot;expr&quot;</span>: <span class="hljs-string">&quot;book_name like \&quot;Hello%\&quot;&quot;</span>,
}
res = collection.<span class="hljs-title function_">search</span>(**search_param)
<button class="copy-code-btn"></button></code></pre>
<h2 id="String-expressions" class="common-anchor-header">String expressions<button data-href="#String-expressions" class="anchor-icon" translate="no">
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
    </button></h2><p>Apart from the newly added operator <code translate="no">like</code>, other operators, which are already supported in previous versions of Milvus, can also be used for string field filtering. Below are some examples of commonly used <a href="https://milvus.io/docs/v2.1.x/boolean.md">string expressions</a>, where <code translate="no">A</code> represents a field of type VARCHAR. Remember that all the string expressions below can be logically combined using logical operators, such as AND, OR, and NOT.</p>
<h3 id="Set-operations" class="common-anchor-header">Set operations</h3><p>You can use <code translate="no">in</code> and <code translate="no">not in</code> to realize set operations, such as <code translate="no">A in [&quot;str1&quot;, &quot;str2&quot;]</code>.</p>
<h3 id="Compare-two-string-fields" class="common-anchor-header">Compare two string fields</h3><p>You can use relational operators to compare the values of two string fields. Such relational operators include <code translate="no">==</code>, <code translate="no">!=</code>, <code translate="no">&gt;</code>, <code translate="no">&gt;=</code>, <code translate="no">&lt;</code>, <code translate="no">&lt;=</code>. For more information, see <a href="https://milvus.io/docs/v2.1.x/boolean.md#Relational-operators">Relational operators</a>.</p>
<p>Note that string fields can only be compared with other string fields instead of fields of other data types. For example, a field of type VARCHAR cannot be compared with a field of type Boolean or of type integer.</p>
<h3 id="Compare-a-field-with-a-constant-value" class="common-anchor-header">Compare a field with a constant value</h3><p>You can use <code translate="no">==</code> or <code translate="no">!=</code> to verify if the value of a field is equal to a constant value.</p>
<h3 id="Filter-fields-with-a-single-range" class="common-anchor-header">Filter fields with a single range</h3><p>You can use <code translate="no">&gt;</code>, <code translate="no">&gt;=</code>, <code translate="no">&lt;</code>, <code translate="no">&lt;=</code> to filter string fields with a single range, such as <code translate="no">A &gt; &quot;str1&quot;</code>.</p>
<h3 id="Prefix-matching" class="common-anchor-header">Prefix matching</h3><p>As mentioned earlier, Milvus 2.1 adds the operator <code translate="no">like</code> for prefix matching, such as <code translate="no">A like &quot;prefix%&quot;</code>.</p>
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
