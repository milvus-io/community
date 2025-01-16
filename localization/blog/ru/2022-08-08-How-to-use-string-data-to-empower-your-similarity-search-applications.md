---
id: >-
  2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md
title: >-
  Как использовать строковые данные для расширения возможностей приложений
  поиска по сходству
author: Xi Ge
date: 2022-08-08T00:00:00.000Z
desc: >-
  Используйте строковые данные, чтобы упростить процесс создания собственных
  приложений для поиска сходства.
cover: assets.zilliz.com/string_6129ce83e6.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/string_6129ce83e6.png" alt="Cover" class="doc-image" id="cover" />
   </span> <span class="img-wrapper"> <span>Обложка</span> </span></p>
<p>Milvus 2.1 поставляется с <a href="https://milvus.io/blog/2022-08-05-whats-new-in-milvus-2-1.md">некоторыми значительными обновлениями</a>, которые значительно упрощают работу с Milvus. Одно из них - поддержка строкового типа данных. В настоящее время Milvus <a href="https://milvus.io/docs/v2.1.x/schema.md#Supported-data-type">поддерживает такие типы данных</a>, как строки, векторы, булевы числа, целые числа, числа с плавающей точкой и многое другое.</p>
<p>В этой статье представлено введение в поддержку строкового типа данных. Прочитайте и узнайте, что вы можете с ним делать и как его использовать.</p>
<p><strong>Перейти к:</strong></p>
<ul>
<li><a href="#What-can-you-do-with-string-data">Что можно делать со строковыми данными?</a></li>
<li><a href="#How-to-manage-string-data-in-Milvus-21">Как управлять строковыми данными в Milvus 2.1?</a><ul>
<li><a href="#Create-a-collection">Создание коллекции</a></li>
<li><a href="#Insert-data">Вставлять и удалять данные</a></li>
<li><a href="#Build-an-index">Построение индекса</a></li>
<li><a href="#Hybrid-search">Гибридный поиск</a></li>
<li><a href="#String-expressions">Строковые выражения</a></li>
</ul></li>
</ul>
<custom-h1>Что можно делать со строковыми данными?</custom-h1><p>Поддержка строкового типа данных была одной из наиболее ожидаемых пользователями функций. Она как упрощает процесс создания приложения с векторной базой данных Milvus, так и ускоряет скорость поиска по сходству и векторных запросов, в значительной степени повышая эффективность и снижая затраты на обслуживание любого приложения, над которым вы работаете.</p>
<p>В частности, Milvus 2.1 поддерживает тип данных VARCHAR, в котором хранятся символьные строки различной длины. Благодаря поддержке типа данных VARCHAR вы можете:</p>
<ol>
<li>Непосредственно управлять строковыми данными, не прибегая к помощи внешней реляционной базы данных.</li>
</ol>
<p>Поддержка типа данных VARCHAR позволяет пропустить этап преобразования строк в другие типы данных при вставке данных в Milvus. Допустим, вы работаете над системой поиска книг для собственного книжного интернет-магазина. Вы создаете набор данных книг и хотите идентифицировать книги по их названиям. Если в предыдущих версиях Milvus не поддерживал строковый тип данных, то перед вставкой данных в MIilvus вам может понадобиться сначала преобразовать строки (названия книг) в идентификаторы книг с помощью реляционной базы данных, например MySQL. Сейчас, поскольку поддерживается строковый тип данных, вы можете просто создать строковое поле и напрямую вводить названия книг вместо их идентификационных номеров.</p>
<p>Удобство также распространяется на процесс поиска и запроса. Представьте, что есть клиент, чьей любимой книгой является <em>Hello Milvus</em>. Вы хотите найти в системе похожие книги и порекомендовать их клиенту. В предыдущих версиях Milvus система вернет вам только идентификаторы книг, и вам придется сделать дополнительный шаг, чтобы проверить соответствующую информацию о книге в реляционной базе данных. Но в Milvus 2.1 вы можете напрямую получить названия книг, поскольку вы уже создали строковое поле с названиями книг.</p>
<p>Одним словом, поддержка строкового типа данных избавляет вас от необходимости обращаться к другим инструментам для работы со строковыми данными, что значительно упрощает процесс разработки.</p>
<ol start="2">
<li>Ускорение скорости <a href="https://milvus.io/docs/v2.1.x/hybridsearch.md">гибридного поиска</a> и <a href="https://milvus.io/docs/v2.1.x/query.md">векторных запросов</a> за счет фильтрации атрибутов.</li>
</ol>
<p>Как и другие скалярные типы данных, VARCHAR можно использовать для фильтрации атрибутов в гибридном поиске и векторных запросах с помощью булевых выражений. Особенно стоит отметить, что в Milvus 2.1 добавлен оператор <code translate="no">like</code>, который позволяет выполнять префиксное соответствие. Также с помощью оператора <code translate="no">==</code> можно выполнять точное сопоставление.</p>
<p>Кроме того, для ускорения гибридного поиска и запросов поддерживается инвертированный индекс на основе MARISA-trie. Продолжайте читать и узнайте обо всех строковых выражениях, которые вам понадобятся для выполнения фильтрации атрибутов в строковых данных.</p>
<custom-h1>Как управлять строковыми данными в Milvus 2.1?</custom-h1><p>Теперь мы знаем, что строковый тип данных чрезвычайно полезен, но когда именно нам нужно использовать этот тип данных при создании собственных приложений? Ниже вы увидите несколько примеров кода сценариев, в которых могут использоваться строковые данные, что позволит вам лучше понять, как управлять данными VARCHAR в Milvus 2.1.</p>
<h2 id="Create-a-collection" class="common-anchor-header">Создание коллекции<button data-href="#Create-a-collection" class="anchor-icon" translate="no">
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
    </button></h2><p>Давайте продолжим предыдущий пример. Вы все еще работаете над системой рекомендаций книг и хотите создать коллекцию книг с полем первичного ключа <code translate="no">book_name</code>, в которое вы будете вставлять строковые данные. В этом случае при задании схемы поля можно установить тип данных <code translate="no">DataType.VARCHAR</code>, как показано в примере ниже.</p>
<p>Обратите внимание, что при создании поля VARCHAR необходимо указать максимальную длину символов с помощью параметра <code translate="no">max_length</code>, значение которого может варьироваться от 1 до 65 535.  В данном примере мы задали максимальную длину 200.</p>
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
<h2 id="Insert-data" class="common-anchor-header">Вставка данных<button data-href="#Insert-data" class="anchor-icon" translate="no">
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
    </button></h2><p>Теперь, когда коллекция создана, мы можем вставить в нее данные. В следующем примере мы вставляем 2 000 строк случайно сгенерированных строковых данных.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">import</span> random
data = [
  [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
  [<span class="hljs-string">&quot;book_&quot;</span> + <span class="hljs-built_in">str</span>(i) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
  [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">10000</span>, <span class="hljs-number">12000</span>)],
  [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Delete-data" class="common-anchor-header">Удалить данные<button data-href="#Delete-data" class="anchor-icon" translate="no">
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
    </button></h2><p>Предположим, что две книги с названиями <code translate="no">book_0</code> и <code translate="no">book_1</code> больше не продаются в вашем магазине, и вы хотите удалить соответствующую информацию из базы данных. В этом случае вы можете использовать термин-выражение <code translate="no">in</code> для фильтрации сущностей для удаления, как показано в примере ниже.</p>
<p>Помните, что Milvus поддерживает удаление сущностей только с четко указанными первичными ключами, поэтому перед выполнением следующего кода убедитесь, что вы установили поле <code translate="no">book_name</code> в качестве поля первичного ключа.</p>
<pre><code translate="no" class="language-Python">expr = <span class="hljs-string">&quot;book_name in [\&quot;book_0\&quot;, \&quot;book_1\&quot;]&quot;</span> 
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collection</span>
collection = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&quot;book&quot;</span>)     
collection.<span class="hljs-title function_">delete</span>(expr)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Build-an-Index" class="common-anchor-header">Построение индекса<button data-href="#Build-an-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 поддерживает построение скалярных индексов, что значительно ускоряет фильтрацию строковых полей. В отличие от построения векторного индекса, перед построением скалярного индекса не нужно подготавливать параметры. Временно Milvus поддерживает только индекс дерева словарей (MARISA-trie), поэтому тип индекса поля типа VARCHAR по умолчанию будет MARISA-trie.</p>
<p>Вы можете указать имя индекса при его построении. Если оно не указано, то по умолчанию используется значение <code translate="no">index_name</code> - <code translate="no">&quot;_default_idx_&quot;</code>. В приведенном ниже примере мы назвали индекс <code translate="no">scalar_index</code>.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collection</span>
collection = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&quot;book&quot;</span>)   
collection.<span class="hljs-title function_">create_index</span>(
  field_name=<span class="hljs-string">&quot;book_name&quot;</span>, 
  index_name=<span class="hljs-string">&quot;scalar_index&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Hybrid-search" class="common-anchor-header">Гибридный поиск<button data-href="#Hybrid-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Задавая булевы выражения, можно фильтровать строковые поля во время поиска векторного сходства.</p>
<p>Например, если вы ищете книги, вступление которых наиболее похоже на Hello Milvus, но хотите получить только те книги, названия которых начинаются с 'book_2', вы можете использовать оператор <code translate="no">like</code>, чтобы выполнить префиксное совпадение и получить целевые книги, как показано в примере ниже.</p>
<pre><code translate="no" class="language-Python">search_param = {
  <span class="hljs-string">&quot;data&quot;</span>: [[<span class="hljs-number">0.1</span>, <span class="hljs-number">0.2</span>]],
  <span class="hljs-string">&quot;anns_field&quot;</span>: <span class="hljs-string">&quot;book_intro&quot;</span>,
  <span class="hljs-string">&quot;param&quot;</span>: {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
  <span class="hljs-string">&quot;limit&quot;</span>: <span class="hljs-number">2</span>,
  <span class="hljs-string">&quot;expr&quot;</span>: <span class="hljs-string">&quot;book_name like \&quot;Hello%\&quot;&quot;</span>,
}
res = collection.<span class="hljs-title function_">search</span>(**search_param)
<button class="copy-code-btn"></button></code></pre>
<h2 id="String-expressions" class="common-anchor-header">Строковые выражения<button data-href="#String-expressions" class="anchor-icon" translate="no">
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
    </button></h2><p>Помимо недавно добавленного оператора <code translate="no">like</code>, для фильтрации строковых полей можно использовать и другие операторы, которые уже поддерживались в предыдущих версиях Milvus. Ниже приведены примеры часто используемых <a href="https://milvus.io/docs/v2.1.x/boolean.md">строковых выражений</a>, где <code translate="no">A</code> представляет поле типа VARCHAR. Помните, что все приведенные ниже строковые выражения могут быть логически объединены с помощью логических операторов, таких как AND, OR и NOT.</p>
<h3 id="Set-operations" class="common-anchor-header">Операции над множествами</h3><p>Вы можете использовать <code translate="no">in</code> и <code translate="no">not in</code> для реализации операций над множествами, например <code translate="no">A in [&quot;str1&quot;, &quot;str2&quot;]</code>.</p>
<h3 id="Compare-two-string-fields" class="common-anchor-header">Сравнение двух строковых полей</h3><p>Вы можете использовать реляционные операторы для сравнения значений двух строковых полей. К таким реляционным операторам относятся <code translate="no">==</code>, <code translate="no">!=</code>, <code translate="no">&gt;</code>, <code translate="no">&gt;=</code>, <code translate="no">&lt;</code>, <code translate="no">&lt;=</code>. Дополнительные сведения см. в разделе <a href="https://milvus.io/docs/v2.1.x/boolean.md#Relational-operators">Реляционные операторы</a>.</p>
<p>Обратите внимание, что строковые поля можно сравнивать только с другими строковыми полями, а не с полями других типов данных. Например, поле типа VARCHAR нельзя сравнивать с полем типа Boolean или типа integer.</p>
<h3 id="Compare-a-field-with-a-constant-value" class="common-anchor-header">Сравнение поля с постоянным значением</h3><p>Вы можете использовать <code translate="no">==</code> или <code translate="no">!=</code>, чтобы проверить, равно ли значение поля постоянному значению.</p>
<h3 id="Filter-fields-with-a-single-range" class="common-anchor-header">Фильтр полей с одним диапазоном</h3><p>Вы можете использовать <code translate="no">&gt;</code>, <code translate="no">&gt;=</code>, <code translate="no">&lt;</code>, <code translate="no">&lt;=</code> для фильтрации строковых полей с одним диапазоном, например <code translate="no">A &gt; &quot;str1&quot;</code>.</p>
<h3 id="Prefix-matching" class="common-anchor-header">Сопоставление префиксов</h3><p>Как упоминалось ранее, в Milvus 2.1 добавлен оператор <code translate="no">like</code> для сопоставления префиксов, например <code translate="no">A like &quot;prefix%&quot;</code>.</p>
<h2 id="Whats-next" class="common-anchor-header">Что дальше<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>После официального выхода Milvus 2.1 мы подготовили серию блогов, в которых рассказываем о новых возможностях. Читайте подробнее в этой серии блогов:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Как использовать строковые данные для расширения возможностей приложений поиска по сходству</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Использование Embedded Milvus для мгновенной установки и запуска Milvus с Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Увеличение пропускной способности базы данных Vector с помощью реплик в памяти</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Понимание уровня согласованности в векторной базе данных Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Понимание уровня согласованности в векторной базе данных Milvus (часть II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Как база данных Milvus Vector обеспечивает безопасность данных?</a></li>
</ul>
