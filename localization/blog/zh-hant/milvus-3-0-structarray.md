---
id: milvus-3-0-structarray.md
title: 一個實體、多個向量：使用 Milvus 3.0 StructArray 進行實體與元素層級搜尋
author: Chenjie Tang
date: 2026-8-19
cover: assets.zilliz.com/milvus_3_0_entity_and_element_level_search_28bba6d843.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus 3.0, StructArray, multi-vector search, EmbeddingList search,
  element-level search
meta_title: |
  Milvus 3.0 StructArray: Multi-Vector Search Within One Entity
desc: 一個實體可以包含多個對齊的向量和中繼資料欄位，而 Milvus 可以搜尋整個實體或單一元素，無需將資料扁平化為單獨的列。
origin: 'https://milvus.io/blog/milvus-3-0-structarray.md'
---
<p>大多數向量資料庫的 schema 都始於一個簡單的假設：一個實體對應一個嵌入向量。一個產品有一個向量，一份文件也有一個向量。使用者查詢會被嵌入，並透過近似最近鄰居（ANN）搜尋與這些向量進行比對。這個模型適用於第一代向量搜尋使用案例，包括 RAG、語意搜尋和推薦系統。</p>
<p><strong>然而，真實世界的 AI 資料很少符合這個假設。</strong>一段影片包含多個片段、鏡頭或關鍵幀，每個都有各自的嵌入向量、時間範圍、字幕、場景標籤和信心分數。一個產品可能有多張圖片和多個觀看角度。一份長文件包含多個段落或章節，其局部意義比整個文件的單一嵌入向量更為重要。流行的晚期互動（late-interaction）模型在更細的粒度上暴露出相同的限制：ColBERT 為每個 token 產生一個向量，而 ColPali 為每個視覺區塊（patch）產生一個向量。</p>
<p>在上述每種情況下，父實體仍然是應用程式儲存、顯示、保護和回傳的單位。然而，相關性、過濾和結果解釋往往取決於該實體內部的元素。</p>
<p><strong>新的 StructArray 功能為 Milvus 提供了符合此形態的原生資料模型：一個實體包含一個有序的 schema 定義 Struct 元素陣列，每個元素可以攜帶純量 metadata、向量嵌入，或同時攜帶兩者。</strong>Milvus 可以過濾屬於同一個元素的欄位、在實體層級比對兩個嵌入向量清單，或搜尋個別元素並回傳相符的偏移量（offset）。</p>
<p>本文以影片搜尋範例說明資料模型，然後依序探討 schema 設計、過濾、向量搜尋粒度、EmbeddingList 索引策略、混合結果的彙整（collapse），以及使此功能得以執行的實體佈局。</p>
<h2 id="Why-one-vector-and-one-flat-row-model-are-no-longer-enough" class="common-anchor-header">為什麼單一向量與單一扁平列模型已不再足夠<button data-href="#Why-one-vector-and-one-flat-row-model-are-no-longer-enough" class="anchor-icon" translate="no">
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
    </button></h2><p>假設使用者正在影片目錄中搜尋「一個在廚房切菜的人」。相關的訊號可能位於一個八秒的片段中，而不是整部影片的嵌入向量裡。<strong>將每個片段、物體和動作壓縮成單一向量也許能保留大致主題，但可能沖淡局部細節。</strong></p>
<p>相同的落差也出現在其他工作負載中：</p>
<ul>
<li>產品的相關性可能來自多張圖片或多個角度中的其中一個。</li>
<li>文件可能因為某個段落而非整體主題而相符。</li>
<li>代理（agent）記憶可能包含多個觀察結果，但只有其中一個對目前任務重要。</li>
<li>ColBERT 或 ColPali 記錄包含可變長度的 token 或 patch 向量清單，而非單一稠密向量。</li>
</ul>
<p>另一種做法是將每個片段、圖片或段落拆分為獨立的資料庫列。這樣可以啟用局部搜尋，但也會將每個片段與其父實體分離。父實體的 metadata 可能在多列中重複，而實體層級的檢索則需要在片段搜尋之後進行分組、去重和重新排序。</p>
<p>僅靠巢狀儲存並不能解決查詢問題。JSON 可以儲存物件，但它無法為 Milvus 提供預先定義的子欄位 schema 來進行向量和純量索引。平行陣列可以儲存字幕、場景標籤和信心值，但應用程式必須自行維護偏移量對齊。除非這種關聯關係是資料模型的一部分，否則資料庫無法安全地推斷 <code translate="no">scene_type[3]</code> 和 <code translate="no">label_confidence[3]</code> 描述的是同一個片段。</p>
<p>StructArray 直接編碼了這種關聯關係。它將局部元素保留在父實體內部，同時將其對齊的子欄位暴露給 schema 驗證、索引、過濾和向量搜尋。</p>
<h2 id="What-is-StructArray-and-its-data-model" class="common-anchor-header">什麼是 StructArray 及其資料模型？<button data-href="#What-is-StructArray-and-its-data-model" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArray（也稱為結構體陣列，array of structs）在每個實體中儲存一組有序的 Struct 元素。StructArray 欄位是一個 <code translate="no">Array</code>，其所有元素都遵循一個預先定義的 <code translate="no">Struct</code> schema。以影片集合為例，邏輯形狀可能如下所示：</p>
<pre><code translate="no">Plaintext
clips: ARRAY&lt;STRUCT&lt;
    clip_embedding_list: FLOAT_VECTOR,
    clip_embedding: FLOAT_VECTOR,
    start_sec: DOUBLE,
    end_sec: DOUBLE,
    caption: VARCHAR,
    scene_type: VARCHAR,
    label_confidence: FLOAT
&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>在此：</p>
<ul>
<li><code translate="no">clips</code> 是父級 StructArray 欄位。</li>
<li><code translate="no">clip_embedding_list</code>、<code translate="no">clip_embedding</code>、<code translate="no">start_sec</code> 及其他屬性是子欄位。</li>
<li><code translate="no">clips[0]</code> 是第一個片段。</li>
<li>位於偏移量 <code translate="no">0</code> 的每個子欄位都屬於同一個片段。</li>
<li>位於偏移量 <code translate="no">3</code> 的每個子欄位都屬於另一個片段。</li>
</ul>
<p>這兩個向量子欄位服務於不同的搜尋模式。<code translate="no">clips[clip_embedding_list]</code> 使用 <code translate="no">MAX_SIM*</code> 度量進行索引，用於實體層級的 EmbeddingList 搜尋，而 <code translate="no">clips[clip_embedding]</code> 則使用一般向量度量進行索引，用於元素層級的搜尋。由於一個向量欄位或向量子欄位只能接受一個索引，因此如果需要兩種模式的集合，必須分別定義和索引兩個子欄位。</p>
<p>此模型支援三種不同的查詢語意。</p>
<h3 id="1-EmbeddingList-search-returns-parent-entities" class="common-anchor-header">1. EmbeddingList 搜尋回傳父實體</h3><p><code translate="no">clips[clip_embedding_list]</code> 中的向量構成該影片的嵌入向量清單。查詢也是一個 <code translate="no">EmbeddingList</code>。Milvus 使用 <code translate="no">MAX_SIM*</code> 度量將查詢清單與每個儲存的清單進行比對，並回傳實體層級的結果。</p>
<pre><code translate="no">Plaintext
clips[clip_embedding_list] = [
    embedding_0,
    embedding_1,
    embedding_2,
    ...
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-The-MATCH-family-filters-parent-entities" class="common-anchor-header">2. <code translate="no">MATCH_*</code> 系列函式過濾父實體</h3><p><code translate="no">MATCH_ANY</code>、<code translate="no">MATCH_ALL</code>、<code translate="no">MATCH_LEAST</code>、<code translate="no">MATCH_MOST</code> 和 <code translate="no">MATCH_EXACT</code> 會針對 Struct 元素評估謂詞（predicate），計算有多少元素滿足該謂詞，並決定父實體是否通過過濾。</p>
<p>例如：</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">MATCH_ANY</span><span class="hljs-params">(clips, $[scene_type] == <span class="hljs-string">&quot;kitchen&quot;</span> &amp;&amp; $[label_confidence] &gt; <span class="hljs-number">0.8</span>)</span>
<button class="copy-code-btn"></button></code></pre>
<p>兩個純量條件必須在同一個片段偏移量上同時成立。Milvus 不會將某個片段的廚房標籤與另一個片段的高信心值組合在一起。</p>
<h3 id="3-Element-level-search-returns-the-matching-element-offset" class="common-anchor-header">3. 元素層級搜尋回傳相符的元素偏移量</h3><p>一般查詢向量可以獨立搜尋 <code translate="no">clips[clip_embedding]</code> 中的每個向量。每個命中結果都會識別父實體以及相符 Struct 元素的零起始偏移量。<code translate="no">element_filter</code> 可以限制哪些元素參與該向量搜尋。</p>
<p>這些操作共享一個前提：Milvus 知道哪些向量和純量值屬於同一個元素，以及哪些元素屬於同一個實體。</p>
<p>StructArray 不是通用的任意巢狀系統。其目前的模型是由支援的純量和向量子欄位組成的一個 <code translate="no">Struct</code> 元素 <code translate="no">Array</code>。這樣的邊界使得子欄位索引和元素感知的執行成為可行。</p>
<h2 id="Build-the-schema-indexes-and-insert-path" class="common-anchor-header">建立 schema、索引與插入路徑<button data-href="#Build-the-schema-indexes-and-insert-path" class="anchor-icon" translate="no">
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
    </button></h2><p>以下簡化的 PyMilvus 範例建立一個影片集合，包含一個頂層向量和一個用於片段的 StructArray。它使用分開的片段向量子欄位，使同一個集合可以示範兩種搜尋模式。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> DataType, MilvusClient

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

schema = client.create_schema(auto_id=<span class="hljs-literal">False</span>, enable_dynamic_field=<span class="hljs-literal">False</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;title&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;video_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)

<span class="hljs-comment"># Define the Struct schema explicitly.</span>
clip_schema = client.create_struct_field_schema()
clip_schema.add_field(<span class="hljs-string">&quot;clip_embedding_list&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)
clip_schema.add_field(<span class="hljs-string">&quot;clip_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)
clip_schema.add_field(<span class="hljs-string">&quot;start_sec&quot;</span>, DataType.DOUBLE)
clip_schema.add_field(<span class="hljs-string">&quot;end_sec&quot;</span>, DataType.DOUBLE)
clip_schema.add_field(<span class="hljs-string">&quot;caption&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">2048</span>)
clip_schema.add_field(<span class="hljs-string">&quot;scene_type&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">128</span>)
clip_schema.add_field(<span class="hljs-string">&quot;label_confidence&quot;</span>, DataType.FLOAT)

schema.add_field(
    <span class="hljs-string">&quot;clips&quot;</span>,
    datatype=DataType.ARRAY,
    element_type=DataType.STRUCT,
    struct_schema=clip_schema,
    max_capacity=<span class="hljs-number">1024</span>,
)

client.create_collection(<span class="hljs-string">&quot;videos&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p>向量子欄位在搜尋前必須先建立索引。由於度量系列決定了搜尋模式，每個向量子欄位都會獲得自己的索引：</p>
<pre><code translate="no" class="language-python">index_params = client.prepare_index_params()

<span class="hljs-meta"># EmbeddingList search.</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;clips[clip_embedding_list]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
    index_name=<span class="hljs-string">&quot;clips_clip_embedding_list_maxsim_idx&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>},
)

<span class="hljs-meta"># Element-level search.</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    index_name=<span class="hljs-string">&quot;clips_clip_embedding_cosine_idx&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>},
)

client.create_index(<span class="hljs-string">&quot;videos&quot;</span>, index_params=index_params)
<button class="copy-code-btn"></button></code></pre>
<p>純量索引是可選的，但經常出現在大規模過濾中的子欄位應使用相容的純量索引。例如，<code translate="no">clips[scene_type]</code> 可以使用反向索引（inverted index），而 <code translate="no">clips[label_confidence]</code> 等數字子欄位可以使用適合數字過濾的索引。</p>
<p>以自然的實體形狀插入資料：一個影片列包含一個片段物件陣列。為了讓範例更簡潔，它將同一個片段向量寫入兩個向量子欄位。</p>
<pre><code translate="no" class="language-python">rows = [
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;cooking tutorial&quot;</span>,
        <span class="hljs-string">&quot;video_embedding&quot;</span>: video_vec,
        <span class="hljs-string">&quot;clips&quot;</span>: [
            {
                <span class="hljs-string">&quot;clip_embedding_list&quot;</span>: clip_vec_1,
                <span class="hljs-string">&quot;clip_embedding&quot;</span>: clip_vec_1,
                <span class="hljs-string">&quot;start_sec&quot;</span>: <span class="hljs-number">0.0</span>,
                <span class="hljs-string">&quot;end_sec&quot;</span>: <span class="hljs-number">8.0</span>,
                <span class="hljs-string">&quot;caption&quot;</span>: <span class="hljs-string">&quot;A person washes vegetables.&quot;</span>,
                <span class="hljs-string">&quot;scene_type&quot;</span>: <span class="hljs-string">&quot;kitchen&quot;</span>,
                <span class="hljs-string">&quot;label_confidence&quot;</span>: <span class="hljs-number">0.92</span>,
            },
            {
                <span class="hljs-string">&quot;clip_embedding_list&quot;</span>: clip_vec_2,
                <span class="hljs-string">&quot;clip_embedding&quot;</span>: clip_vec_2,
                <span class="hljs-string">&quot;start_sec&quot;</span>: <span class="hljs-number">8.0</span>,
                <span class="hljs-string">&quot;end_sec&quot;</span>: <span class="hljs-number">16.0</span>,
                <span class="hljs-string">&quot;caption&quot;</span>: <span class="hljs-string">&quot;A person cuts carrots on a board.&quot;</span>,
                <span class="hljs-string">&quot;scene_type&quot;</span>: <span class="hljs-string">&quot;kitchen&quot;</span>,
                <span class="hljs-string">&quot;label_confidence&quot;</span>: <span class="hljs-number">0.96</span>,
            },
        ],
    }
]

client.<span class="hljs-title function_">insert</span>(<span class="hljs-string">&quot;videos&quot;</span>, rows)
client.<span class="hljs-title function_">flush</span>(<span class="hljs-string">&quot;videos&quot;</span>)
client.<span class="hljs-title function_">load_collection</span>(<span class="hljs-string">&quot;videos&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>在 API 邊界，<code translate="no">clips</code> 仍然是一個結構化物件陣列。在 Milvus 內部，每個子欄位都遵循其自身索引、過濾和輸出行為所需的型別路徑。這種區別在插入時是透明的，但對後續一切操作都至關重要。</p>
<h2 id="Same-element-filtering-is-the-difference-between-structure-and-parallel-arrays" class="common-anchor-header">同元素過濾是結構與平行陣列之間的差異<button data-href="#Same-element-filtering-is-the-difference-between-structure-and-parallel-arrays" class="anchor-icon" translate="no">
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
    </button></h2><p>過濾的主要好處不是巢狀欄位的更簡短語法，而是在純量子欄位之間進行正確的關聯。</p>
<p>假設應用程式需要找出包含一個廚房片段且標籤信心值高於 <code translate="no">0.8</code> 的影片。僅包含某個廚房片段和某個高信心值片段是不夠的；必須是同一個片段同時滿足兩個條件。</p>
<p>StructArray 的 <code translate="no">MATCH_*</code> 系列函式直接表達了這一點：</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">MATCH_ANY</span><span class="hljs-params">(clips, $[scene_type] == <span class="hljs-string">&quot;kitchen&quot;</span> &amp;&amp; $[label_confidence] &gt; <span class="hljs-number">0.8</span>)</span>
MATCH_ALL(clips, $[label_confidence] &gt; <span class="hljs-number">0.5</span>)
MATCH_LEAST(clips, $[scene_type] == <span class="hljs-string">&quot;sports&quot;</span>, threshold=<span class="hljs-number">3</span>)
MATCH_MOST(clips, $[label_confidence] &lt; <span class="hljs-number">0.2</span>, threshold=<span class="hljs-number">1</span>)
MATCH_EXACT(clips, $[scene_type] == <span class="hljs-string">&quot;intro&quot;</span>, threshold=<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus 在每個元素偏移量上評估謂詞，然後套用運算子（operator）的量詞（quantifier）來決定父實體是否通過：</p>
<ul>
<li><code translate="no">MATCH_ANY</code>：至少一個元素相符。</li>
<li><code translate="no">MATCH_ALL</code>：每個元素都相符。</li>
<li><code translate="no">MATCH_LEAST</code>：至少 <code translate="no">threshold</code> 個元素相符。</li>
<li><code translate="no">MATCH_MOST</code>：最多 <code translate="no">threshold</code> 個元素相符。</li>
<li><code translate="no">MATCH_EXACT</code>：恰好 <code translate="no">threshold</code> 個元素相符。</li>
</ul>
<p>如果相同的資料儲存在兩個獨立的陣列中，下列表達式將無法保留這種關聯：</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">array_contains</span><span class="hljs-params">(clips[scene_type], <span class="hljs-string">&quot;kitchen&quot;</span>)</span>
AND
<span class="hljs-title function_">array_contains</span><span class="hljs-params">(clips[label_confidence], <span class="hljs-number">0.9</span>)</span>
<button class="copy-code-btn"></button></code></pre>
<p>這兩個值可能出現在不同的偏移量上。對於不相關的屬性這可能是有效的，但當兩個條件描述的是同一個片段、產品圖片或文件段落時，這就是錯誤的。</p>
<p>StructArray 使元素身分成為資料庫謂詞的一部分，而不是應用程式必須強制執行的慣例。</p>
<h2 id="Two-vector-search-granularities-two-result-identities" class="common-anchor-header">兩種向量搜尋粒度，兩種結果識別<button data-href="#Two-vector-search-granularities-two-result-identities" class="anchor-icon" translate="no">
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
    </button></h2><p>一旦一個實體儲存了多個向量，檢索就必須在 ANN 搜尋開始之前解決一個建模問題：</p>
<p><strong>這些向量應該作為父實體的單一表示一起計分，還是每個元素向量應該獨立競爭？</strong></p>
<p>StructArray 支援兩種模型，但它們使用不同的查詢形狀、度量系列、向量子欄位和結果識別。</p>
<h3 id="EmbeddingList-search-a-list-of-query-vectors-finds-an-entity" class="common-anchor-header">EmbeddingList 搜尋：查詢向量清單找到一個實體</h3><p>一個 <code translate="no">EmbeddingList</code> 查詢包含多個向量。一個查詢影片可能被分成多個片段；一個產品查詢可能包含多張參考圖片；一個 ColBERT 查詢包含每個查詢 token 一個向量。</p>
<p>對於每個實體，Milvus 將查詢清單與實體儲存的嵌入向量清單進行比對。在 MaxSim 風格的計分下，每個查詢向量在實體清單中選擇其最佳匹配，Milvus 將這些最佳匹配分數聚合為一個實體分數。最終的命中結果代表父實體，而不是某個特定的 Struct 元素。</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus.client.embedding_list import EmbeddingList

query = EmbeddingList()
query.<span class="hljs-keyword">add</span>(query_clip_vec_1)
query.<span class="hljs-keyword">add</span>(query_clip_vec_2)

client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding_list]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>},
    limit=<span class="hljs-number">10</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>這個搜尋回答的是：<strong>哪一部影片是這組查詢片段的整體最佳匹配？</strong></p>
<p>它適用於影片對影片檢索、多圖片產品搜尋、ColBERT 和 ColPali 風格的檢索，以及其他查詢和儲存實體都由多個向量表示的情況。</p>
<h3 id="Element-level-search-one-query-vector-finds-a-clip-inside-an-entity" class="common-anchor-header">元素層級搜尋：一個查詢向量找到實體內的片段</h3><p>元素層級搜尋使用一般的查詢向量。<code translate="no">clips[clip_embedding]</code> 中的每個向量都作為獨立候選者參與 ANN 搜尋。每個命中結果都會識別父實體和相符元素的偏移量。</p>
<pre><code translate="no" class="language-python">client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    <span class="hljs-built_in">limit</span>=10,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;clips&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>若要只搜尋選定的片段，可附加一個 <code translate="no">element_filter</code>，其純量條件套用於同一個片段：</p>
<pre><code translate="no" class="language-python">client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;element_filter(clips, $[scene_type] == &quot;kitchen&quot; &amp;&amp; $[label_confidence] &gt; 0.8)&#x27;</span>,
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;clips&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>過濾器不會先選出一個廚房片段，然後再搜尋另一個不同的高信心值片段。兩個謂詞和向量候選者都指向同一個 Struct 元素。</p>
<p>未分組的回應可能如下所示：</p>
<pre><code translate="no">Plaintext
<span class="hljs-built_in">id</span> = <span class="hljs-number">1</span>, offset = <span class="hljs-number">1</span>, distance = <span class="hljs-number">0.91</span>
<span class="hljs-built_in">id</span> = <span class="hljs-number">8</span>, offset = <span class="hljs-number">4</span>, distance = <span class="hljs-number">0.88</span>
<span class="hljs-built_in">id</span> = <span class="hljs-number">1</span>, offset = <span class="hljs-number">3</span>, distance = <span class="hljs-number">0.84</span>
<button class="copy-code-btn"></button></code></pre>
<p>同一個實體可能出現多次，因為多個片段都可能相符。這在應用程式需要顯示的不僅是哪部影片或文件相關，還需要顯示哪個片段或段落產生了匹配時非常有用。</p>
<table>
<thead>
<tr><th>面向</th><th>EmbeddingList 搜尋</th><th>元素層級搜尋</th></tr>
</thead>
<tbody>
<tr><td>查詢輸入</td><td><code translate="no">EmbeddingList</code> 中的一個或多個查詢向量</td><td>一個一般查詢向量</td></tr>
<tr><td>範例目標</td><td><code translate="no">clips[clip_embedding_list]</code></td><td><code translate="no">clips[clip_embedding]</code></td></tr>
<tr><td>度量系列</td><td><code translate="no">MAX_SIM*</code></td><td>一般度量，如 <code translate="no">COSINE</code>、<code translate="no">IP</code> 或 <code translate="no">L2</code></td></tr>
<tr><td>ANN 候選單位</td><td>父實體的嵌入向量清單</td><td>每個 Struct 元素向量</td></tr>
<tr><td>結果識別</td><td>父實體</td><td>父實體加上元素偏移量</td></tr>
<tr><td>典型使用案例</td><td>將多向量查詢與多向量實體進行比對</td><td>找出最相關的片段、圖片、段落、區塊或事實</td></tr>
</tbody>
</table>
<p>若要在此單一集合中支援兩種模式，請分別定義和索引不同的向量子欄位。查詢形狀、度量系列和目標索引必須一致。</p>
<h2 id="EmbeddingList-indexing-is-a-quality-cost-decision" class="common-anchor-header">EmbeddingList 索引是一項品質與成本的抉擇<button data-href="#EmbeddingList-indexing-is-a-quality-cost-decision" class="anchor-icon" translate="no">
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
    </button></h2><p>每個實體只有一個嵌入向量時，ANN 索引可以找到靠近查詢向量的實體。EmbeddingList 搜尋成本更高，因為相關性取決於兩個向量清單之間的成對互動。</p>
<p>對每個實體中的每個向量計算精確 MaxSim 會產生最乾淨的參考排名，但完整掃描通常對線上檢索來說成本過高。因此，Milvus 使用兩階段模型：</p>
<ol>
<li>一個近似策略檢索候選父實體。</li>
<li>當啟用 <code translate="no">emb_list_rerank</code> 時，Milvus 在這些候選者上重新計算 MaxSim 以產生最終排名。</li>
</ol>
<p>檢索更多第一階段候選者通常會提高真正頂級結果進入重新排名器的機會，但也會增加延遲和計算量。這三種策略的主要差異在於它們如何產生該候選集合。</p>
<table>
<thead>
<tr><th>策略</th><th>第一階段候選表示</th><th>適合的起點</th><th>主要取捨</th></tr>
</thead>
<tbody>
<tr><td>TokenANN</td><td>索引每個嵌入清單中的每個向量。查詢向量獨立執行 ANN；在 MaxSim 重新排名之前，匹配結果會聚合回父實體。</td><td>品質是優先考量、清單短或中等長度，且個別向量具有區辨力時。</td><td>索引大小和第一階段搜尋工作量會隨著清單長度和查詢向量數量而成長。</td></tr>
<tr><td>MUVERA</td><td>透過隨機投影將每個嵌入清單編碼為一個固定維度向量，然後執行一般 ANN。</td><td>TokenANN 過於沉重，且偏好無需訓練管線的壓縮方式時。</td><td>編碼會遺失資訊；更強的投影設定會增加編碼維度和 ANN 成本。</td></tr>
<tr><td>LEMUR</td><td>訓練一個模型，將嵌入清單映射為固定維度的父實體向量。</td><td>嵌入向量區辨力較低、清單較大，或工作負載屬於視覺或多模態時。</td><td>需要訓練，且可能對語料庫分佈和文件長度偏差敏感。</td></tr>
</tbody>
</table>
<p>沒有一種策略對所有工作負載都是最佳選擇。從目標資料和查詢分佈開始：</p>
<ul>
<li>在資料集規模允許的情況下，使用 TokenANN 作為品質優先的基準。</li>
<li>當 TokenANN 的索引或候選檢索隨著清單長度增長而變得太昂貴，且你想避免訓練管線時，嘗試 MUVERA。</li>
<li>當嵌入空間嘈雜或區辨力較弱，或工作負載屬於視覺或多模態時，評估 LEMUR。</li>
<li>在測量延遲和索引大小的同時，也測量召回率（recall）或 nDCG。對短文本有效的策略，在長尾文件長度或數千個視覺區塊下可能會有不同表現。</li>
</ul>
<p>StructArray 解決一個問題：如何在單一實體內部表示對齊的、可過濾的、攜帶向量的元素。EmbeddingList 策略解決另一個問題：如何在特定模型和語料庫下以可接受的成本近似 MaxSim。</p>
<h2 id="Hybrid-search-makes-result-identity-explicit" class="common-anchor-header">混合搜尋使結果識別明確化<button data-href="#Hybrid-search-makes-result-identity-explicit" class="anchor-icon" translate="no">
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
    </button></h2><p>生產環境的檢索很少只遵循單一向量路徑。一個影片請求可能結合頂層影片嵌入、一個或多個片段層級嵌入、字幕或逐字稿訊號，以及一個重新排名器。</p>
<p>一旦元素層級候選者進入該管線，引擎就必須決定什麼識別最終候選者。</p>
<table>
<thead>
<tr><th>混合請求組成</th><th>最終候選範圍</th><th>結果識別</th></tr>
</thead>
<tbody>
<tr><td>所有子搜尋都是元素層級，且目標是同一 StructArray 下的向量子欄位</td><td>元素層級</td><td>主鍵加上 StructArray 欄位加上元素偏移量</td></tr>
<tr><td>包含頂層向量欄位</td><td>實體層級</td><td>主鍵</td></tr>
<tr><td>包含 EmbeddingList 請求</td><td>實體層級</td><td>主鍵</td></tr>
<tr><td>元素層級請求目標為不同的 StructArray 欄位</td><td>實體層級</td><td>主鍵</td></tr>
</tbody>
</table>
<p>第一種配置保留了元素識別，因為在給定的父 StructArray 下，偏移量 <code translate="no">3</code> 對每個子搜尋都指向同一個 Struct 元素。這適合在融合多個元素層級訊號後，想要回傳最相關片段或段落的應用程式。</p>
<p>其他配置混合了候選粒度或元素命名空間。因此，元素命中結果必須在最終重新排序之前被彙整為實體層級分數。Milvus 支援多種彙整策略：</p>
<table>
<thead>
<tr><th>彙整策略</th><th>從回傳的元素命中結果得出實體分數</th><th>重要條件</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">max</code></td><td>最佳元素分數</td><td>適用於支援的一般向量度量</td></tr>
<tr><td><code translate="no">sum</code></td><td>所有回傳元素分數的總和</td><td>請與正相關度量（如 <code translate="no">IP</code> 或 <code translate="no">COSINE</code>）搭配使用</td></tr>
<tr><td><code translate="no">avg</code></td><td>回傳元素分數的平均值</td><td>適用於支援的一般向量度量</td></tr>
<tr><td><code translate="no">topk_sum</code></td><td>最佳 <code translate="no">K</code> 個回傳元素分數的總和</td><td>需要正數 <code translate="no">topk</code>；請與 <code translate="no">IP</code> 或 <code translate="no">COSINE</code> 搭配使用</td></tr>
<tr><td><code translate="no">topk_avg</code></td><td>最佳 <code translate="no">K</code> 個回傳元素分數的平均值</td><td>需要正數 <code translate="no">topk</code></td></tr>
</tbody>
</table>
<p>彙整僅作用於該 ANN 子搜尋回傳的元素命中結果；它不會在檢索後掃描實體中的每個元素。因此，請求的 <code translate="no">limit</code> 控制哪些元素命中結果可用於彙整函式。</p>
<p>這個選擇塑造的是檢索語意，而不僅僅是輸出格式。如果應用程式呈現的是片段或段落，那麼在融合過程中保留偏移量是自然的。如果它呈現的是影片、產品或文件，那麼實體層級彙整是自然的。當訊號在不同粒度下運作時，系統需要一個明確的元素到實體計分規則。</p>
<p>StructArray 將這個識別與彙整問題從臨時的後處理移入搜尋執行模型。</p>
<h2 id="How-Milvus-executes-StructArray-without-treating-it-as-a-blob" class="common-anchor-header">Milvus 如何在執行 StructArray 時不將其視為不透明物件<button data-href="#How-Milvus-executes-StructArray-without-treating-it-as-a-blob" class="anchor-icon" translate="no">
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
    </button></h2><p>使用者看到的模型是 <code translate="no">ARRAY&lt;STRUCT&gt;</code>。然而，將整個值儲存為一個不透明的 blob，會使子欄位索引、過濾和選擇性輸出變得不夠高效。</p>
<p>Milvus 採用「邏輯父欄位、實體子欄位」的設計。</p>
<p>在 schema 層，<code translate="no">clips</code> 是邏輯父欄位。它定義了 Struct schema、最大容量和可空性等屬性。其子欄位被正規化為 <code translate="no">clips[clip_embedding_list]</code>、<code translate="no">clips[clip_embedding]</code>、<code translate="no">clips[scene_type]</code> 和 <code translate="no">clips[label_confidence]</code> 等路徑。</p>
<p>純量子欄位遵循每個實體的純量陣列儲存路徑，而向量子欄位遵循向量陣列路徑。每個子欄位因此可以使用適合其型別的資料路徑：metadata 使用純量過濾和純量索引，嵌入向量則使用向量索引和 ANN 搜尋。</p>
<p>在攝入時，Proxy 將巢狀的 Struct 清單展開為型別化的子欄位。在執行期間，Milvus 維護每個實體元素與其父實體之間的關係。概念上，這種關係如下所示：</p>
<pre><code translate="no">Plaintext
entity 0 -&gt; elements [0, 1, 2]
entity 1 -&gt; elements [3]
entity 2 -&gt; elements []
entity 3 -&gt; elements [4, 5, 6, 7]
<button class="copy-code-btn"></button></code></pre>
<p>當元素層級搜尋回傳實體元素 ID 時，Milvus 會將其映射回父實體和元素偏移量。當 <code translate="no">element_filter</code> 產生元素層級的 bitmap 時，引擎會將其與父實體可見性、刪除和其他過濾器對齊。</p>
<p>回傳結果時，Milvus 使用邏輯 schema 和共享偏移量來重建應用程式插入的 StructArray 形狀。系統可以在型別化的子欄位上執行，而使用者繼續讀寫自然的巢狀物件。這種實體佈局使 StructArray 不僅僅是型別化的 JSON：巢狀關係參與了索引和執行模型。</p>
<h2 id="Where-StructArray-fits-and-where-it-does-not" class="common-anchor-header">StructArray 適用之處與不適用之處<button data-href="#Where-StructArray-fits-and-where-it-does-not" class="anchor-icon" translate="no">
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
    </button></h2><p>當以下所有條件都成立時，StructArray 是極佳的選擇：</p>
<ul>
<li>應用程式有一個有意義的父實體，例如影片、產品、文件、視覺頁面或記憶記錄。</li>
<li>每個父實體包含一組有序、可變長度的局部元素。</li>
<li>這些元素需要各自的純量 metadata、向量或兩者。</li>
<li>搜尋或過濾必須保留同一個元素偏移量上子欄位之間的關聯。</li>
<li>應用程式需要實體層級的多向量檢索、元素層級命中結果，或兩者。</li>
</ul>
<p>StructArray 並非自動對每個集合都更好。一份短文件或簡單查詢可能只需單一稠密嵌入就足夠。多向量索引會增加儲存和搜尋成本，因此額外的表示必須透過提升檢索品質或更有用的結果粒度來證明其價值。</p>
<p>目前的 schema 和執行邊界也很重要：</p>
<ul>
<li><code translate="no">Struct</code> 僅作為 <code translate="no">Array</code> 的元素型別支援，不支援作為頂層集合欄位。</li>
<li>一個 StructArray 中的所有元素共享一個預先定義的 schema。</li>
<li><code translate="no">max_capacity</code> 是必填的，並限制每個實體的元素數量。</li>
<li>StructArray 內部不支援巢狀的 <code translate="no">Struct</code>、<code translate="no">Array</code>、<code translate="no">ArrayOfStruct</code> 和 <code translate="no">JSON</code> 子欄位。</li>
<li>一個向量子欄位只能接受一個索引。當同時需要 EmbeddingList 和元素層級搜尋時，請使用分開的向量子欄位。</li>
<li>向量子欄位在搜尋前必須先建立索引。大量用於過濾的純量子欄位應適當建立索引。</li>
<li>子欄位 schema 在 StructArray 欄位建立後即固定，因此在生產環境上線前應先規劃元素屬性。</li>
</ul>
<p>這些限制使模型比文件資料庫的任意巢狀更為狹窄，但它們也給了 Milvus 足夠的結構來推理元素身分、索引每個子欄位，並以兩種搜尋粒度執行。</p>
<h2 id="StructArray-keeps-local-evidence-first-class-without-losing-the-entity" class="common-anchor-header">StructArray 將局部證據視為一等公民，同時不失去實體<button data-href="#StructArray-keeps-local-evidence-first-class-without-losing-the-entity" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArray 為 Milvus 提供了一個扁平 schema 難以表示的檢索物件：一個帶有一組有序結構化元素的父實體。這些元素之間的關聯參與過濾、索引和搜尋，而不僅僅存在於儲存中。</p>
<p>每個元素保留自己的 metadata 和嵌入向量。這些元素可以滿足同元素純量謂詞、一起參與實體層級的 EmbeddingList 搜尋，或在元素層級搜尋中獨立競爭。同時，它們仍然依附於父實體，父實體的 metadata、權限和應用程式身分為它們提供了上下文。</p>
<p>對於影片片段、產品圖片、文件段落、視覺區塊和記憶片段，局部證據可以被搜尋和過濾，而不會失去其所屬的實體。其餘的設計選擇是明確的：選擇搜尋粒度、為每個向量子欄位指定匹配的度量和索引，並決定混合結果應該保留元素偏移量還是彙整回實體。</p>
<h2 id="Try-StructArray-in-Milvus-30" class="common-anchor-header">在 Milvus 3.0 中試用 StructArray<button data-href="#Try-StructArray-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArray 已於 Milvus 3.0 中提供。從 <a href="https://milvus.io/docs/array-of-structs.md">StructArray 概覽</a>開始。如果你正在評估實體層級的多向量檢索，請閱讀 <a href="https://milvus.io/docs/choose-an-embeddinglist-search-strategy.md">EmbeddingList 策略指南</a>。關於結果粒度和彙整行為，請參閱<a href="https://milvus.io/docs/hybrid-search-with-structarray.md">使用 StructArray 進行混合搜尋</a>。</p>
<p>關於更廣泛的版本資訊，請參閱 <a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">Milvus 3.0 發布部落格</a>、<a href="https://milvus.io/docs/release_notes.md">版本說明</a>和 <a href="https://github.com/milvus-io/milvus">milvus-io/milvus 儲存庫</a>。</p>
<p><a href="https://zilliz.com/">Zilliz Cloud</a> 也支援受管部署的 StructArray 和 EmbeddingList 搜尋。請參閱 <a href="https://docs.zilliz.com/docs/use-array-of-structs">Zilliz Cloud StructArray 指南</a>以了解服務特定的限制。在 Zilliz Cloud 中，StructArray 的純量運算子目前僅記錄為支援 On-Demand 叢集。</p>
<p>若要與團隊討論 schema 或檢索設計，請加入 <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord 社群</a>或預約 <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting">Milvus Office Hours</a> 時段。</p>
