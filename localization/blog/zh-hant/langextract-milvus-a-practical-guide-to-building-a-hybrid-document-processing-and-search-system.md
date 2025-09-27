---
id: >-
  langextract-milvus-a-practical-guide-to-building-a-hybrid-document-processing-and-search-system.md
title: LangExtract + Milvus：建立混合文件處理與搜尋系統的實用指南
author: 'Cheney Zhang, Lumina Wang'
date: 2025-08-28T00:00:00.000Z
desc: 學習如何結合 LangExtract 與 Milvus 進行混合程式碼搜尋 - 在單一智慧型管道中實現精確過濾與語意檢索。
cover: assets.zilliz.com/Langextract_1c4d9835a4.png
tag: Tutorials
recommend: false
tags: 'Milvus, vector database, vector search'
meta_keywords: 'LangExtract, Milvus, hybrid search, code search, semantic retrieval'
meta_title: |
  Hybrid Document Retrieval System with LangExtract + Milvus
origin: >-
  https://milvus.io/blog/langextract-milvus-a-practical-guide-to-building-a-hybrid-document-processing-and-search-system.md
---
<p>在<a href="https://milvus.io/blog/why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md">之前的</a>一篇<a href="https://milvus.io/blog/why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md">部落</a>格中，我們比較了許多編碼代理中兩種流行的程式碼搜尋方法：</p>
<ul>
<li><p><strong>向量搜尋驅動的 RAG (語意檢索)</strong>- 由 Cursor 等工具使用</p></li>
<li><p>使用<code translate="no">grep</code> <strong> （字串匹配）</strong><strong>的關鍵字搜尋</strong>- Claude Code 和 Gemini 使用。</p></li>
</ul>
<p>這篇文章引發了許多回饋。有些開發人員為 RAG 辯護，指出<code translate="no">grep</code> 常常包含不相關的匹配項目，並使上下文變得臃腫。其他人則為關鍵字搜尋辯護，認為精確度就是一切，而 embeddings 仍然太模糊，不可信。</p>
<p>雙方說的都有道理。現實是，沒有完美、一刀切的解決方案。</p>
<ul>
<li><p>只依賴嵌入式，您會錯過嚴格的規則或精確匹配。</p></li>
<li><p>僅依賴關鍵字，則會失去對程式碼（或文字）實際意義的語意理解。</p></li>
</ul>
<p>本教學示範了<strong>將兩種方法巧妙結合的</strong>方法。我們將告訴您如何使用<a href="https://github.com/google/langextract">LangExtract（一</a>個使用 LLM 將雜亂的文字轉換為具有精確來源歸屬的結構化資料的 Python 函式庫）與<a href="https://milvus.io/">Milvus</a>（一個開放源代碼的高效能向量資料庫），來建立一個更智慧、更高品質的文件處理與檢索系統。</p>
<h3 id="Key-Technologies-We’ll-Use" class="common-anchor-header">我們將使用的關鍵技術</h3><p>在我們開始建立這個文件處理和檢索系統之前，讓我們先來看看本教學中將會使用到的關鍵技術。</p>
<h3 id="What-is-LangExtract" class="common-anchor-header">什麼是 LangExtract？</h3><p><a href="https://github.com/langextract/langextract">LangExtract</a>是一個新的 Python 函式庫，由 Google 開放原始碼，利用 LLM 將雜亂、非結構化的文字轉換成結構化的資料，並註明資料來源。它已經很受歡迎 (13K+ GitHub stars) 了，因為它讓資訊擷取等工作變得非常簡單。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_c04bdf275b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
主要功能包括</p>
<ul>
<li><p>結構化萃取：定義模式並擷取名稱、日期、地點、費用及其他相關資訊。</p></li>
<li><p>來源可追蹤性：每個抽取的欄位都會連結回原始文字，降低產生幻覺的可能性。</p></li>
<li><p>適用於長篇文件：使用分塊 + 多執行緒處理數百萬字元。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_6a4b42a265.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>LangExtract 在法律、醫療保健和鑑識等精確度極為重要的領域特別有用。舉例來說，LangExtract 不需要使用 RAG 擷取大量的文字，它只需要擷取您關心的日期、條款或病患人口統計資料，同時仍能保留語意上下文。</p>
<h3 id="What’s-Milvus" class="common-anchor-header">Milvus 是什麼？</h3><p><a href="https://milvus.io/">Milvus</a>是一個開放原始碼的向量資料庫，在 Github 上有超過 36K+stars 的記錄，並已被超過 10K 家跨產業的企業採用。Milvus 廣泛應用於 RAG 系統、AI Agents、推薦引擎、異常偵測和語意搜尋，使其成為 AI 驅動應用程式的核心建置區塊。</p>
<h2 id="Building-a-High-Quality-Document-Processing-System-with-LangExtract-+-Milvus" class="common-anchor-header">使用 LangExtract + Milvus 建立高品質文件處理系統<button data-href="#Building-a-High-Quality-Document-Processing-System-with-LangExtract-+-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>本指南將教您如何結合<a href="https://github.com/google/langextract">LangExtract</a>與<a href="https://milvus.io/"> Milvus</a>來建立智慧型文件處理與檢索系統。</p>
<ul>
<li><p>LangExtract 會產生乾淨、結構化的元資料，然後利用 Milvus 將其有效地儲存與檢索，讓我們可以兩全其美：精準過濾加上語意檢索。</p></li>
<li><p>Milvus 將作為檢索的骨幹，同時儲存嵌入（用於語義檢索）和 LangExtract 所萃取的結構化 metadata，讓我們可以大規模地執行精確且智慧型的混合查詢。</p></li>
</ul>
<h3 id="Prerequisites" class="common-anchor-header">先決條件</h3><p>在開始使用之前，請確認您已安裝下列依賴項目：</p>
<pre><code translate="no">! pip install --upgrade pymilvus langextract google-genai requests tqdm pandas
<button class="copy-code-btn"></button></code></pre>
<p>本範例使用 Gemini 作為 LLM。您需要將<a href="https://aistudio.google.com/app/apikey"> API key</a>設定為環境變數：</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;GEMINI_API_KEY&quot;</span>] = <span class="hljs-string">&quot;AIza*****************&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Setting-Up-the-LangExtract-+-Milvus-Pipeline" class="common-anchor-header"><strong>設定 LangExtract + Milvus 管道</strong></h3><p>讓我們先定義我們的管道，使用 LangExtract 來進行結構化資訊萃取，並使用 Milvus 作為向量儲存。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> langextract <span class="hljs-keyword">as</span> lx
<span class="hljs-keyword">import</span> textwrap
<span class="hljs-keyword">from</span> google <span class="hljs-keyword">import</span> genai
<span class="hljs-keyword">from</span> google.<span class="hljs-property">genai</span>.<span class="hljs-property">types</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">EmbedContentConfig</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>, <span class="hljs-title class_">DataType</span>
<span class="hljs-keyword">import</span> uuid
<button class="copy-code-btn"></button></code></pre>
<h3 id="Configuration-and-Setup" class="common-anchor-header"><strong>配置與設定</strong></h3><p>現在我們來設定整合的全局參數。我們使用 Gemini 的嵌入模型來為我們的文件產生向量表示。</p>
<pre><code translate="no">genai_client = genai.Client()
COLLECTION_NAME = <span class="hljs-string">&quot;document_extractions&quot;</span>
EMBEDDING_MODEL = <span class="hljs-string">&quot;gemini-embedding-001&quot;</span>
EMBEDDING_DIM = <span class="hljs-number">3072</span>  <span class="hljs-comment"># Default dimension for gemini-embedding-001</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Initializing-the-Milvus-Client" class="common-anchor-header"><strong>初始化 Milvus 客戶端</strong></h3><p>讓我們初始化 Milvus 客戶端。為了簡單起見，我們將使用本機資料庫檔案，雖然這種方法很容易擴展到完整的 Milvus 伺服器部署。</p>
<pre><code translate="no">client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>關於<code translate="no">MilvusClient</code> 參數：</strong></p>
<p>將<code translate="no">uri</code> 設定為本機檔案 (如<code translate="no">./milvus.db</code>)是最方便的方法，因為它會自動使用<a href="https://milvus.io/docs/milvus_lite.md"> Milvus Lite</a>將所有資料儲存在這個檔案中。</p>
<p>對於大規模的資料，您可以在<a href="https://milvus.io/docs/quickstart.md"> Docker 或 Kubernetes</a> 上設定效能更高的 Milvus 伺服器。在此設定中，請改用伺服器 uri (如[<code translate="no">http://localhost:19530](http://localhost:19530)</code>)。</p>
<p>如果您偏好<a href="https://zilliz.com/cloud"> Zilliz Cloud</a>(Milvus 的完全管理<a href="https://docs.zilliz.com/docs/on-zilliz-cloud-console#free-cluster-details"> 雲端</a>服務)，請調整<code translate="no">uri</code> 和<code translate="no">token</code> ，以符合您的<a href="https://docs.zilliz.com/docs/on-zilliz-cloud-console#free-cluster-details"> 公共端點和</a>Zilliz Cloud 的<a href="https://docs.zilliz.com/docs/on-zilliz-cloud-console#free-cluster-details"> API 金鑰</a>。</p>
<h3 id="Preparing-Sample-Data" class="common-anchor-header"><strong>準備樣本資料</strong></h3><p>在這個示範中，我們會使用電影描述作為樣本文件。這將展示 LangExtract 如何從非結構化的文字中抽取結構化的資訊，例如類型、角色和主題。</p>
<pre><code translate="no">sample_documents = [
    <span class="hljs-string">&quot;John McClane fights terrorists in a Los Angeles skyscraper during Christmas Eve. The action-packed thriller features intense gunfights and explosive scenes.&quot;</span>,
    <span class="hljs-string">&quot;A young wizard named Harry Potter discovers his magical abilities at Hogwarts School. The fantasy adventure includes magical creatures and epic battles.&quot;</span>,
    <span class="hljs-string">&quot;Tony Stark builds an advanced suit of armor to become Iron Man. The superhero movie showcases cutting-edge technology and spectacular action sequences.&quot;</span>,
    <span class="hljs-string">&quot;A group of friends get lost in a haunted forest where supernatural creatures lurk. The horror film creates a terrifying atmosphere with jump scares.&quot;</span>,
    <span class="hljs-string">&quot;Two detectives investigate a series of mysterious murders in New York City. The crime thriller features suspenseful plot twists and dramatic confrontations.&quot;</span>,
    <span class="hljs-string">&quot;A brilliant scientist creates artificial intelligence that becomes self-aware. The sci-fi thriller explores the dangers of advanced technology and human survival.&quot;</span>,
    <span class="hljs-string">&quot;A romantic comedy about two friends who fall in love during a cross-country road trip. The drama explores personal growth and relationship dynamics.&quot;</span>,
    <span class="hljs-string">&quot;An evil sorcerer threatens to destroy the magical kingdom. A brave hero must gather allies and master ancient magic to save the fantasy world.&quot;</span>,
    <span class="hljs-string">&quot;Space marines battle alien invaders on a distant planet. The action sci-fi movie features futuristic weapons and intense combat in space.&quot;</span>,
    <span class="hljs-string">&quot;A detective investigates supernatural crimes in Victorian London. The horror thriller combines period drama with paranormal investigation themes.&quot;</span>,
]

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=== LangExtract + Milvus Integration Demo ===&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Preparing to process <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sample_documents)}</span> documents&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Setting-Up-the-Milvus-Collection" class="common-anchor-header"><strong>設定 Milvus 套件</strong></h3><p>在儲存抽取出來的資料之前，我們需要建立一個有適當模式的 Milvus 套件。這個集合將儲存原始文件文字、向量嵌入和萃取的元資料欄位。</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n1. Setting up Milvus collection...&quot;</span>)

<span class="hljs-comment"># Drop existing collection if it exists</span>
<span class="hljs-keyword">if</span> client.has_collection(collection_name=COLLECTION_NAME):
    client.drop_collection(collection_name=COLLECTION_NAME)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dropped existing collection: <span class="hljs-subst">{COLLECTION_NAME}</span>&quot;</span>)

<span class="hljs-comment"># Create collection schema</span>
schema = client.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">True</span>,
    description=<span class="hljs-string">&quot;Document extraction results and vector storage&quot;</span>,
)

<span class="hljs-comment"># Add fields - simplified to 3 main metadata fields</span>
schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>, is_primary=<span class="hljs-literal">True</span>
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;document_text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">10000</span>
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=EMBEDDING_DIM
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(collection_name=COLLECTION_NAME, schema=schema)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created successfully&quot;</span>)

<span class="hljs-comment"># Create vector index</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
)
client.create_index(collection_name=COLLECTION_NAME, index_params=index_params)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Vector index created successfully&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Defining-the-Extraction-Schema" class="common-anchor-header"><strong>定義抽取模式</strong></h3><p>LangExtract 使用提示和範例來引導 LLM 擷取結構化的資訊。讓我們定義電影描述的萃取模式，明確指定要萃取哪些資訊，以及如何將資訊分類。</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n2. Extracting tags from documents...&quot;</span>)

<span class="hljs-comment"># Define extraction prompt - for movie descriptions, specify attribute value ranges</span>
prompt = textwrap.dedent(
    <span class="hljs-string">&quot;&quot;</span><span class="hljs-string">&quot;\
    Extract movie genre, main characters, and key themes from movie descriptions.
    Use exact text for extractions. Do not paraphrase or overlap entities.
    
    For each extraction, provide attributes with values from these predefined sets:
    
    Genre attributes:
    - primary_genre: [&quot;</span>action<span class="hljs-string">&quot;, &quot;</span>comedy<span class="hljs-string">&quot;, &quot;</span>drama<span class="hljs-string">&quot;, &quot;</span>horror<span class="hljs-string">&quot;, &quot;</span>sci-fi<span class="hljs-string">&quot;, &quot;</span>fantasy<span class="hljs-string">&quot;, &quot;</span>thriller<span class="hljs-string">&quot;, &quot;</span>crime<span class="hljs-string">&quot;, &quot;</span>superhero<span class="hljs-string">&quot;]
    - secondary_genre: [&quot;</span>action<span class="hljs-string">&quot;, &quot;</span>comedy<span class="hljs-string">&quot;, &quot;</span>drama<span class="hljs-string">&quot;, &quot;</span>horror<span class="hljs-string">&quot;, &quot;</span>sci-fi<span class="hljs-string">&quot;, &quot;</span>fantasy<span class="hljs-string">&quot;, &quot;</span>thriller<span class="hljs-string">&quot;, &quot;</span>crime<span class="hljs-string">&quot;, &quot;</span>superhero<span class="hljs-string">&quot;]
    
    Character attributes:
    - role: [&quot;</span>protagonist<span class="hljs-string">&quot;, &quot;</span>antagonist<span class="hljs-string">&quot;, &quot;</span>supporting<span class="hljs-string">&quot;]
    - type: [&quot;</span>hero<span class="hljs-string">&quot;, &quot;</span>villain<span class="hljs-string">&quot;, &quot;</span>detective<span class="hljs-string">&quot;, &quot;</span>military<span class="hljs-string">&quot;, &quot;</span>wizard<span class="hljs-string">&quot;, &quot;</span>scientist<span class="hljs-string">&quot;, &quot;</span>friends<span class="hljs-string">&quot;, &quot;</span>investigator<span class="hljs-string">&quot;]
    
    Theme attributes:
    - theme_type: [&quot;</span>conflict<span class="hljs-string">&quot;, &quot;</span>investigation<span class="hljs-string">&quot;, &quot;</span>personal_growth<span class="hljs-string">&quot;, &quot;</span>technology<span class="hljs-string">&quot;, &quot;</span>magic<span class="hljs-string">&quot;, &quot;</span>survival<span class="hljs-string">&quot;, &quot;</span>romance<span class="hljs-string">&quot;]
    - setting: [&quot;</span>urban<span class="hljs-string">&quot;, &quot;</span>space<span class="hljs-string">&quot;, &quot;</span>fantasy_world<span class="hljs-string">&quot;, &quot;</span>school<span class="hljs-string">&quot;, &quot;</span>forest<span class="hljs-string">&quot;, &quot;</span>victorian<span class="hljs-string">&quot;, &quot;</span>america<span class="hljs-string">&quot;, &quot;</span>future<span class="hljs-string">&quot;]
    
    Focus on identifying key elements that would be useful for movie search and filtering.&quot;</span><span class="hljs-string">&quot;&quot;</span>
)

<button class="copy-code-btn"></button></code></pre>
<h3 id="Providing-Examples-to-Improve-Extraction-Quality" class="common-anchor-header"><strong>提供範例以改善抽取品質</strong></h3><p>為了改善萃取品質與一致性，我們將為 LangExtract 提供精心製作的範例。這些範例展示了預期的格式，並幫助模型了解我們特定的抽取需求。</p>
<pre><code translate="no"><span class="hljs-comment"># Provide examples to guide the model - n-shot examples for movie descriptions</span>
<span class="hljs-comment"># Unify attribute keys to ensure consistency in extraction results</span>
examples = [
    lx.data.ExampleData(
        text=<span class="hljs-string">&quot;A space marine battles alien creatures on a distant planet. The sci-fi action movie features futuristic weapons and intense combat scenes.&quot;</span>,
        extractions=[
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;genre&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;sci-fi action&quot;</span>,
                attributes={<span class="hljs-string">&quot;primary_genre&quot;</span>: <span class="hljs-string">&quot;sci-fi&quot;</span>, <span class="hljs-string">&quot;secondary_genre&quot;</span>: <span class="hljs-string">&quot;action&quot;</span>},
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;character&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;space marine&quot;</span>,
                attributes={<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;protagonist&quot;</span>, <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;military&quot;</span>},
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;theme&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;battles alien creatures&quot;</span>,
                attributes={<span class="hljs-string">&quot;theme_type&quot;</span>: <span class="hljs-string">&quot;conflict&quot;</span>, <span class="hljs-string">&quot;setting&quot;</span>: <span class="hljs-string">&quot;space&quot;</span>},
            ),
        ],
    ),
    lx.data.ExampleData(
        text=<span class="hljs-string">&quot;A detective investigates supernatural murders in Victorian London. The horror thriller film combines period drama with paranormal elements.&quot;</span>,
        extractions=[
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;genre&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;horror thriller&quot;</span>,
                attributes={<span class="hljs-string">&quot;primary_genre&quot;</span>: <span class="hljs-string">&quot;horror&quot;</span>, <span class="hljs-string">&quot;secondary_genre&quot;</span>: <span class="hljs-string">&quot;thriller&quot;</span>},
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;character&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;detective&quot;</span>,
                attributes={<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;protagonist&quot;</span>, <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;detective&quot;</span>},
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;theme&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;supernatural murders&quot;</span>,
                attributes={<span class="hljs-string">&quot;theme_type&quot;</span>: <span class="hljs-string">&quot;investigation&quot;</span>, <span class="hljs-string">&quot;setting&quot;</span>: <span class="hljs-string">&quot;victorian&quot;</span>},
            ),
        ],
    ),
    lx.data.ExampleData(
        text=<span class="hljs-string">&quot;Two friends embark on a road trip adventure across America. The comedy drama explores friendship and self-discovery through humorous situations.&quot;</span>,
        extractions=[
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;genre&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;comedy drama&quot;</span>,
                attributes={<span class="hljs-string">&quot;primary_genre&quot;</span>: <span class="hljs-string">&quot;comedy&quot;</span>, <span class="hljs-string">&quot;secondary_genre&quot;</span>: <span class="hljs-string">&quot;drama&quot;</span>},
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;character&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;two friends&quot;</span>,
                attributes={<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;protagonist&quot;</span>, <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;friends&quot;</span>},
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;theme&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;friendship and self-discovery&quot;</span>,
                attributes={<span class="hljs-string">&quot;theme_type&quot;</span>: <span class="hljs-string">&quot;personal_growth&quot;</span>, <span class="hljs-string">&quot;setting&quot;</span>: <span class="hljs-string">&quot;america&quot;</span>},
            ),
        ],
    ),
]

<span class="hljs-comment"># Extract from each document</span>
extraction_results = []
<span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> sample_documents:
    result = lx.extract(
        text_or_documents=doc,
        prompt_description=prompt,
        examples=examples,
        model_id=<span class="hljs-string">&quot;gemini-2.0-flash&quot;</span>,
    )
    extraction_results.append(result)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully extracted from document: <span class="hljs-subst">{doc[:<span class="hljs-number">50</span>]}</span>...&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Completed tag extraction, processed <span class="hljs-subst">{<span class="hljs-built_in">len</span>(extraction_results)}</span> documents&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-title class_">Successfully</span> extracted <span class="hljs-keyword">from</span> <span class="hljs-attr">document</span>: <span class="hljs-title class_">John</span> <span class="hljs-title class_">McClane</span> fights terrorists <span class="hljs-keyword">in</span> a <span class="hljs-title class_">Los</span> <span class="hljs-title class_">Angeles</span>...
...
<span class="hljs-title class_">Completed</span> tag extraction, processed <span class="hljs-number">10</span> documents
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_7f539fec12.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Processing-and-Vectorizing-Results" class="common-anchor-header"><strong>處理與向量化結果</strong></h3><p>現在我們需要處理萃取結果，並為每個文件產生向量嵌入。我們也會將擷取的屬性扁平化為獨立的欄位，以便在 Milvus 中輕鬆搜尋。</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n3. Processing extraction results and generating vectors...&quot;</span>)

processed_data = []

<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> extraction_results:
    <span class="hljs-comment"># Generate vectors for documents</span>
    embedding_response = genai_client.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=[result.text],
        config=EmbedContentConfig(
            task_type=<span class="hljs-string">&quot;RETRIEVAL_DOCUMENT&quot;</span>,
            output_dimensionality=EMBEDDING_DIM,
        ),
    )
    embedding = embedding_response.embeddings[<span class="hljs-number">0</span>].values
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully generated vector: <span class="hljs-subst">{result.text[:<span class="hljs-number">30</span>]}</span>...&quot;</span>)

    <span class="hljs-comment"># Initialize data structure, flatten attributes into separate fields</span>
    data_entry = {
        <span class="hljs-string">&quot;id&quot;</span>: result.document_id <span class="hljs-keyword">or</span> <span class="hljs-built_in">str</span>(uuid.uuid4()),
        <span class="hljs-string">&quot;document_text&quot;</span>: result.text,
        <span class="hljs-string">&quot;embedding&quot;</span>: embedding,
        <span class="hljs-comment"># Initialize all possible fields with default values</span>
        <span class="hljs-string">&quot;genre&quot;</span>: <span class="hljs-string">&quot;unknown&quot;</span>,
        <span class="hljs-string">&quot;primary_genre&quot;</span>: <span class="hljs-string">&quot;unknown&quot;</span>,
        <span class="hljs-string">&quot;secondary_genre&quot;</span>: <span class="hljs-string">&quot;unknown&quot;</span>,
        <span class="hljs-string">&quot;character_role&quot;</span>: <span class="hljs-string">&quot;unknown&quot;</span>,
        <span class="hljs-string">&quot;character_type&quot;</span>: <span class="hljs-string">&quot;unknown&quot;</span>,
        <span class="hljs-string">&quot;theme_type&quot;</span>: <span class="hljs-string">&quot;unknown&quot;</span>,
        <span class="hljs-string">&quot;theme_setting&quot;</span>: <span class="hljs-string">&quot;unknown&quot;</span>,
    }

    <span class="hljs-comment"># Process extraction results, flatten attributes</span>
    <span class="hljs-keyword">for</span> extraction <span class="hljs-keyword">in</span> result.extractions:
        <span class="hljs-keyword">if</span> extraction.extraction_class == <span class="hljs-string">&quot;genre&quot;</span>:
            <span class="hljs-comment"># Flatten genre attributes</span>
            data_entry[<span class="hljs-string">&quot;genre&quot;</span>] = extraction.extraction_text
            attrs = extraction.attributes <span class="hljs-keyword">or</span> {}
            data_entry[<span class="hljs-string">&quot;primary_genre&quot;</span>] = attrs.get(<span class="hljs-string">&quot;primary_genre&quot;</span>, <span class="hljs-string">&quot;unknown&quot;</span>)
            data_entry[<span class="hljs-string">&quot;secondary_genre&quot;</span>] = attrs.get(<span class="hljs-string">&quot;secondary_genre&quot;</span>, <span class="hljs-string">&quot;unknown&quot;</span>)

        <span class="hljs-keyword">elif</span> extraction.extraction_class == <span class="hljs-string">&quot;character&quot;</span>:
            <span class="hljs-comment"># Flatten character attributes (take first main character&#x27;s attributes)</span>
            attrs = extraction.attributes <span class="hljs-keyword">or</span> {}
            <span class="hljs-keyword">if</span> (
                data_entry[<span class="hljs-string">&quot;character_role&quot;</span>] == <span class="hljs-string">&quot;unknown&quot;</span>
            ):  <span class="hljs-comment"># Only take first character&#x27;s attributes</span>
                data_entry[<span class="hljs-string">&quot;character_role&quot;</span>] = attrs.get(<span class="hljs-string">&quot;role&quot;</span>, <span class="hljs-string">&quot;unknown&quot;</span>)
                data_entry[<span class="hljs-string">&quot;character_type&quot;</span>] = attrs.get(<span class="hljs-string">&quot;type&quot;</span>, <span class="hljs-string">&quot;unknown&quot;</span>)

        <span class="hljs-keyword">elif</span> extraction.extraction_class == <span class="hljs-string">&quot;theme&quot;</span>:
            <span class="hljs-comment"># Flatten theme attributes (take first main theme&#x27;s attributes)</span>
            attrs = extraction.attributes <span class="hljs-keyword">or</span> {}
            <span class="hljs-keyword">if</span> (
                data_entry[<span class="hljs-string">&quot;theme_type&quot;</span>] == <span class="hljs-string">&quot;unknown&quot;</span>
            ):  <span class="hljs-comment"># Only take first theme&#x27;s attributes</span>
                data_entry[<span class="hljs-string">&quot;theme_type&quot;</span>] = attrs.get(<span class="hljs-string">&quot;theme_type&quot;</span>, <span class="hljs-string">&quot;unknown&quot;</span>)
                data_entry[<span class="hljs-string">&quot;theme_setting&quot;</span>] = attrs.get(<span class="hljs-string">&quot;setting&quot;</span>, <span class="hljs-string">&quot;unknown&quot;</span>)

    processed_data.append(data_entry)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Completed data processing, ready to insert <span class="hljs-subst">{<span class="hljs-built_in">len</span>(processed_data)}</span> records&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">3. Processing extraction results and generating vectors...
Successfully generated vector: John McClane fights terrorists...
...
Completed data processing, ready to insert 10 records

<button class="copy-code-btn"></button></code></pre>
<h3 id="Inserting-Data-into-Milvus" class="common-anchor-header"><strong>將資料插入 Milvus</strong></h3><p>處理好資料後，讓我們將它插入 Milvus 資料庫。這可讓我們執行語意搜尋和精確的元資料篩選。</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n4. Inserting data into Milvus...&quot;</span>)

<span class="hljs-keyword">if</span> processed_data:
    res = client.insert(collection_name=COLLECTION_NAME, data=processed_data)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully inserted <span class="hljs-subst">{<span class="hljs-built_in">len</span>(processed_data)}</span> documents into Milvus&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Insert result: <span class="hljs-subst">{res}</span>&quot;</span>)
<span class="hljs-keyword">else</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;No data to insert&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-number">4.</span> Inserting data <span class="hljs-keyword">into</span> Milvus...
Successfully inserted <span class="hljs-number">10</span> documents <span class="hljs-keyword">into</span> Milvus
Insert result: {<span class="hljs-string">&#x27;insert_count&#x27;</span>: <span class="hljs-number">10</span>, <span class="hljs-string">&#x27;ids&#x27;</span>: [<span class="hljs-string">&#x27;doc_f8797155&#x27;</span>, <span class="hljs-string">&#x27;doc_78c7e586&#x27;</span>, <span class="hljs-string">&#x27;doc_fa3a3ab5&#x27;</span>, <span class="hljs-string">&#x27;doc_64981815&#x27;</span>, <span class="hljs-string">&#x27;doc_3ab18cb2&#x27;</span>, <span class="hljs-string">&#x27;doc_1ea42b18&#x27;</span>, <span class="hljs-string">&#x27;doc_f0779243&#x27;</span>, <span class="hljs-string">&#x27;doc_386590b7&#x27;</span>, <span class="hljs-string">&#x27;doc_3b3ae1ab&#x27;</span>, <span class="hljs-string">&#x27;doc_851089d6&#x27;</span>]}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Demonstrating-Metadata-Filtering" class="common-anchor-header"><strong>示範元資料篩選</strong></h3><p>結合 LangExtract 與 Milvus 的主要優勢之一，就是能夠根據萃取的元資料執行精確的篩選。讓我們用一些篩選表達式搜尋來看看這個功能。</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Filter Expression Search Examples ===&quot;</span>)

<span class="hljs-comment"># Load collection into memory for querying</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Loading collection into memory...&quot;</span>)
client.load_collection(collection_name=COLLECTION_NAME)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Collection loaded successfully&quot;</span>)

<span class="hljs-comment"># Search for thriller movies</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n1. Searching for thriller movies:&quot;</span>)
results = client.query(
    collection_name=COLLECTION_NAME,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;secondary_genre == &quot;thriller&quot;&#x27;</span>,
    output_fields=[<span class="hljs-string">&quot;document_text&quot;</span>, <span class="hljs-string">&quot;genre&quot;</span>, <span class="hljs-string">&quot;primary_genre&quot;</span>, <span class="hljs-string">&quot;secondary_genre&quot;</span>],
    limit=<span class="hljs-number">5</span>,
)

<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;- <span class="hljs-subst">{result[<span class="hljs-string">&#x27;document_text&#x27;</span>][:<span class="hljs-number">100</span>]}</span>...&quot;</span>)
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;  Genre: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;genre&#x27;</span>]}</span> (<span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;primary_genre&#x27;</span>)}</span>-<span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;secondary_genre&#x27;</span>)}</span>)&quot;</span>
    )

<span class="hljs-comment"># Search for movies with military characters</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n2. Searching for movies with military characters:&quot;</span>)
results = client.query(
    collection_name=COLLECTION_NAME,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;character_type == &quot;military&quot;&#x27;</span>,
    output_fields=[<span class="hljs-string">&quot;document_text&quot;</span>, <span class="hljs-string">&quot;genre&quot;</span>, <span class="hljs-string">&quot;character_role&quot;</span>, <span class="hljs-string">&quot;character_type&quot;</span>],
    limit=<span class="hljs-number">5</span>,
)

<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;- <span class="hljs-subst">{result[<span class="hljs-string">&#x27;document_text&#x27;</span>][:<span class="hljs-number">100</span>]}</span>...&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Genre: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;genre&#x27;</span>]}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;  Character: <span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;character_role&#x27;</span>)}</span> (<span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;character_type&#x27;</span>)}</span>)&quot;</span>
    )
=== Filter Expression Search Examples ===
Loading collection into memory...
Collection loaded successfully

<span class="hljs-number">1.</span> Searching <span class="hljs-keyword">for</span> thriller movies:
- A brilliant scientist creates artificial intelligence that becomes <span class="hljs-variable language_">self</span>-aware. The sci-fi thriller e...
  Genre: sci-fi thriller (sci-fi-thriller)
- Two detectives investigate a series of mysterious murders <span class="hljs-keyword">in</span> New York City. The crime thriller featu...
  Genre: crime thriller (crime-thriller)
- A detective investigates supernatural crimes <span class="hljs-keyword">in</span> Victorian London. The horror thriller combines perio...
  Genre: horror thriller (horror-thriller)
- John McClane fights terrorists <span class="hljs-keyword">in</span> a Los Angeles skyscraper during Christmas Eve. The action-packed t...
  Genre: action-packed thriller (action-thriller)

<span class="hljs-number">2.</span> Searching <span class="hljs-keyword">for</span> movies <span class="hljs-keyword">with</span> military characters:
- Space marines battle alien invaders on a distant planet. The action sci-fi movie features futuristic...
  Genre: action sci-fi
  Character: protagonist (military)
<button class="copy-code-btn"></button></code></pre>
<p>完美！我們的搜尋結果準確地符合「驚悚片」和「軍事人物」的篩選條件。</p>
<h3 id="Combining-Semantic-Search-with-Metadata-Filtering" class="common-anchor-header"><strong>結合語意搜尋與元資料篩選</strong></h3><p>這就是這個整合的真正威力所在：結合語義向量搜尋與精確的元資料篩選。這可讓我們找到語義上相似的內容，同時根據我們擷取的屬性套用特定的限制條件。</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Semantic Search Examples ===&quot;</span>)

<span class="hljs-comment"># 1. Search for action-related content + only thriller genre</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n1. Searching for action-related content + only thriller genre:&quot;</span>)
query_text = <span class="hljs-string">&quot;action fight combat battle explosion&quot;</span>

query_embedding_response = genai_client.models.embed_content(
    model=EMBEDDING_MODEL,
    contents=[query_text],
    config=EmbedContentConfig(
        task_type=<span class="hljs-string">&quot;RETRIEVAL_QUERY&quot;</span>,
        output_dimensionality=EMBEDDING_DIM,
    ),
)
query_embedding = query_embedding_response.embeddings[<span class="hljs-number">0</span>].values

results = client.search(
    collection_name=COLLECTION_NAME,
    data=[query_embedding],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    limit=<span class="hljs-number">3</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;secondary_genre == &quot;thriller&quot;&#x27;</span>,
    output_fields=[<span class="hljs-string">&quot;document_text&quot;</span>, <span class="hljs-string">&quot;genre&quot;</span>, <span class="hljs-string">&quot;primary_genre&quot;</span>, <span class="hljs-string">&quot;secondary_genre&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
)

<span class="hljs-keyword">if</span> results:
    <span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;- Similarity: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Text: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;document_text&#x27;</span>][:<span class="hljs-number">100</span>]}</span>...&quot;</span>)
        <span class="hljs-built_in">print</span>(
            <span class="hljs-string">f&quot;  Genre: <span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;genre&#x27;</span>)}</span> (<span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;primary_genre&#x27;</span>)}</span>-<span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;secondary_genre&#x27;</span>)}</span>)&quot;</span>
        )

<span class="hljs-comment"># 2. Search for magic-related content + fantasy genre + conflict theme</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n2. Searching for magic-related content + fantasy genre + conflict theme:&quot;</span>)
query_text = <span class="hljs-string">&quot;magic wizard spell fantasy magical&quot;</span>

query_embedding_response = genai_client.models.embed_content(
    model=EMBEDDING_MODEL,
    contents=[query_text],
    config=EmbedContentConfig(
        task_type=<span class="hljs-string">&quot;RETRIEVAL_QUERY&quot;</span>,
        output_dimensionality=EMBEDDING_DIM,
    ),
)
query_embedding = query_embedding_response.embeddings[<span class="hljs-number">0</span>].values

results = client.search(
    collection_name=COLLECTION_NAME,
    data=[query_embedding],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    limit=<span class="hljs-number">3</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;primary_genre == &quot;fantasy&quot; and theme_type == &quot;conflict&quot;&#x27;</span>,
    output_fields=[
        <span class="hljs-string">&quot;document_text&quot;</span>,
        <span class="hljs-string">&quot;genre&quot;</span>,
        <span class="hljs-string">&quot;primary_genre&quot;</span>,
        <span class="hljs-string">&quot;theme_type&quot;</span>,
        <span class="hljs-string">&quot;theme_setting&quot;</span>,
    ],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
)

<span class="hljs-keyword">if</span> results:
    <span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;- Similarity: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Text: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;document_text&#x27;</span>][:<span class="hljs-number">100</span>]}</span>...&quot;</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Genre: <span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;genre&#x27;</span>)}</span> (<span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;primary_genre&#x27;</span>)}</span>)&quot;</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Theme: <span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;theme_type&#x27;</span>)}</span> (<span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;theme_setting&#x27;</span>)}</span>)&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Demo Complete ===&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">=== Semantic Search Examples ===

<span class="hljs-number">1.</span> Searching <span class="hljs-keyword">for</span> action-related content + only thriller genre:
- Similarity: <span class="hljs-number">0.6947</span>
  Text: John McClane fights terrorists in a Los Angeles skyscraper during Christmas Eve. The action-packed t...
  Genre: action-packed <span class="hljs-title function_">thriller</span> <span class="hljs-params">(action-thriller)</span>
- Similarity: <span class="hljs-number">0.6128</span>
  Text: Two detectives investigate a series of mysterious murders in New York City. The crime thriller featu...
  Genre: crime <span class="hljs-title function_">thriller</span> <span class="hljs-params">(crime-thriller)</span>
- Similarity: <span class="hljs-number">0.5889</span>
  Text: A brilliant scientist creates artificial intelligence that becomes self-aware. The sci-fi thriller e...
  Genre: sci-fi <span class="hljs-title function_">thriller</span> <span class="hljs-params">(sci-fi-thriller)</span>

<span class="hljs-number">2.</span> Searching <span class="hljs-keyword">for</span> magic-related content + fantasy genre + conflict theme:
- Similarity: <span class="hljs-number">0.6986</span>
  Text: An evil sorcerer threatens to destroy the magical kingdom. A brave hero must gather allies and maste...
  Genre: fantasy (fantasy)
  Theme: conflict (fantasy_world)

=== Demo Complete ===
<button class="copy-code-btn"></button></code></pre>
<p>如您所見，我們使用 Milvus 的語意搜尋結果既符合類型篩選條件，也顯示出與我們的查詢文字內容高度相關。</p>
<h2 id="What-Youve-Built-and-What-It-Means" class="common-anchor-header">您所建立的系統及其意義<button data-href="#What-Youve-Built-and-What-It-Means" class="anchor-icon" translate="no">
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
    </button></h2><p>您現在擁有了結合結構化萃取與語意搜尋的混合式文件處理系統 - 不再需要在精確度與彈性之間做出選擇。此方法可在確保可靠性的同時，最大化非結構化資料的價值，因此非常適合金融、醫療保健和法律領域中的高風險情境。</p>
<p>同樣的原則也適用於各行各業：結合結構化影像分析與語意搜尋以獲得更佳的電子商務推薦，或應用於視訊內容以強化自動駕駛資料挖掘。</p>
<p>對於管理大量多模式資料集的大規模部署，我們即將推出的<strong>向量資料湖將</strong>提供更具成本效益的冷儲存、寬表支援和簡化的 ETL 處理 - 這是生產規模混合搜尋系統的自然演進。敬請期待。</p>
<p>有問題或想分享您的成果？加入<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a>上的對話，或在<a href="https://discord.com/invite/FG6hMJStWu">Discord</a> 上與我們的社群連線。</p>
