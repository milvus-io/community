---
id: how-milvus-26-upgrades-multilingual-full-text-search-at-scale.md
title: Milvus 2.6 如何在規模上升級多語言全文搜尋
author: Zayne Yue
date: 2025-07-30T00:00:00.000Z
desc: Milvus 2.6 引進了全面改良的文字分析管道，並支援多國語言的全文檢索。
cover: >-
  assets.zilliz.com/How_Milvus_2_6_Upgrades_Multilingual_Full_Text_Search_at_Scale_final_cover_7656abfbd6.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, multilingual search, hybrid search, vector search, full text search'
meta_title: |
  How Milvus How Milvus 2.6 Upgrades Multilingual Full-Text Search at Scale
origin: >-
  https://milvus.io/blog/how-milvus-26-upgrades-multilingual-full-text-search-at-scale.md
---
<h2 id="Introduction" class="common-anchor-header">簡介<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>現代的 AI 應用程式越來越複雜。您不可能只用一種搜尋方法就能解決問題。</p>
<p>以推薦系統為例，它們需要<strong>向量搜尋來</strong>理解文字和圖像的意義，需要<strong>元資料篩選來</strong>依價格、類別或地點縮窄搜尋結果，還需要<strong>關鍵字搜尋來</strong>直接查詢，例如「Nike Air Max」。每種方法都能解決問題的不同部分，而真實世界的系統需要所有這些方法一起運作。</p>
<p>搜尋的未來不是在向量和關鍵字之間做選擇。而是將向量、關鍵字、篩選以及其他搜尋類型結合在一起。這就是我們一年前開始在 Milvus 2.5 中建立<a href="https://milvus.io/docs/hybrid_search_with_milvus.md">混合搜尋的</a>原因。</p>
<h2 id="But-Full-Text-Search-Works-Differently" class="common-anchor-header">但全文搜索的工作方式有所不同<button data-href="#But-Full-Text-Search-Works-Differently" class="anchor-icon" translate="no">
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
    </button></h2><p>將全文檢索帶入向量原生系統並不容易。全文搜尋有其本身的挑戰。</p>
<p>向量搜尋能捕捉文字的<em>語意</em>- 將文字轉換成高維向量 - 而全文搜尋則取決於對<strong>語言結構的</strong>瞭解：字詞是如何形成、從哪裡開始、在哪裡結束，以及它們之間的關係。例如，當使用者以英文搜尋「跑步鞋」時，文字會經過幾個處理步驟：</p>
<p><em>分割空白 → 小寫 → 移除停止字 → 將「running」轉為「run」。</em></p>
<p>為了正確處理這個問題，我們需要一個強大的<strong>語言分析器--</strong>可以處理分割、詞幹、過濾等問題。</p>
<p>當我們在 Milvus 2.5 中推出<a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">BM25 全文搜尋時</a>，我們包含了一個可自訂的分析器，而且它在設計上的功能運作良好。您可以使用標記化器、標記過濾器和字元過濾器來定義管道，以便為索引和搜尋準備文字。</p>
<p>對英文來說，這個設定相對簡單。但當您要處理多國語言時，事情就變得複雜了。</p>
<h2 id="The-Challenge-of-Multilingual-Full-Text-Search" class="common-anchor-header">多語言全文檢索的挑戰<button data-href="#The-Challenge-of-Multilingual-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>多語言全文搜尋帶來了一系列的挑戰：</p>
<ul>
<li><p><strong>複雜的語言需要特別處理</strong>：中文、日文和韓文等語言的字與字之間不使用空格。它們需要先進的標記器來將字符分割成有意義的字詞。這些工具對於單一語言可能運作良好，但很少能同時支援多種複雜語言。</p></li>
<li><p><strong>即使是相似的語言也會有衝突</strong>：英文和法文可能都會使用空白來分隔字詞，但一旦您套用特定語言的處理方式，例如詞幹化或詞彙化，一種語言的規則可能會干擾另一種語言的規則。對英文來說，提高準確度的方法可能會扭曲法文查詢，反之亦然。</p></li>
</ul>
<p>簡而言之，<strong>不同的語言需要不同的分析器</strong>。嘗試使用英文分析器處理中文文字會導致失敗 - 因為沒有空格可以分割，而且英文的字根規則可能會損壞中文字元。</p>
<p>底線是什麼？依賴單一的標記器和分析器來處理多語言資料集，幾乎不可能確保所有語言都能進行一致且高品質的標記化。這會直接導致搜尋效能下降。</p>
<p>當團隊開始在 Milvus 2.5 中採用全文搜尋時，我們開始聽到相同的回應：</p>
<p><em>"這對於我們的英文搜尋非常完美，但我們的多語言客戶支援票單怎麼辦？「我們喜歡同時擁有向量和 BM25 搜尋功能，但我們的資料集包含中文、日文和英文內容」。「我們能在所有語言中獲得相同的搜尋精確度嗎？」</em></p>
<p>這些問題證實了我們在實踐中已經看到的：全文搜尋與向量搜尋有根本性的不同。語義相似性在不同語言間都能運作良好，但精確的文字搜尋需要深入瞭解每種語言的結構。</p>
<p>這就是<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a>引進全面徹底改良的文字分析管道，並支援多國語言的原因。這個新系統可自動為每種語言套用正確的分析器，在多語言資料集上進行精確且可擴充的全文檢索，無須手動設定或降低品質。</p>
<h2 id="How-Milvus-26-Enables-Robust-Multilingual-Full-Text-Search" class="common-anchor-header">Milvus 2.6 如何實現強大的多語言全文搜索<button data-href="#How-Milvus-26-Enables-Robust-Multilingual-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>經過廣泛的研究與開發，我們建立了一整套功能，以解決不同的多語言情況。每種方法都以各自的方式解決語言依賴問題。</p>
<h3 id="1-Multi-Language-Analyzer-Precision-Through-Control" class="common-anchor-header">1.多語言分析器：透過控制達到精確度</h3><p><a href="https://milvus.io/docs/multi-language-analyzers.md#Multi-language-Analyzers"><strong>Multi-Language Analyzer</strong></a>允許您在同一個資料集中為不同語言定義不同的文字處理規則，而不是強迫所有語言都使用相同的分析管道。</p>
<p><strong>其運作方式如下：</strong>您可設定特定語言的分析器，並在插入時為每份文件加上語言標籤。在執行 BM25 搜尋時，您可以指定使用哪一種語言分析器來處理查詢。這可確保您的索引內容和搜尋查詢都是以各自語言的最佳規則來處理。</p>
<p><strong>最適合</strong>您知道內容的語言，並希望獲得最高搜尋精確度的應用程式。例如：跨國知識庫、本地化產品目錄或特定區域的內容管理系統。</p>
<p><strong>需求：</strong>您需要為每個文件提供語言元資料。目前僅適用於 BM25 搜尋作業。</p>
<h3 id="2-Language-Identifier-Tokenizer-Automatic-Language-Detection" class="common-anchor-header">2.語言識別碼標記器：自動語言偵測</h3><p>我們知道手動標記每篇內容並不總是實際可行。<a href="https://milvus.io/docs/multi-language-analyzers.md#Overview"><strong>Language Identifier Tokenizer</strong></a>將自動語言偵測直接帶入文字分析管道。</p>
<p><strong>工作原理如下：</strong>此智慧型標記器可分析輸入的文字，使用精密的偵測演算法偵測其語言，並自動套用適當的特定語言處理規則。您可以使用多個分析器定義來設定它 - 每種您想要支援的語言都有一個分析器，另外還有一個預設的備用分析器。</p>
<p>我們支援兩種偵測引擎：<code translate="no">whatlang</code> ，處理速度更快；<code translate="no">lingua</code> ，精確度更高。系統支援 71-75 種語言，視您選擇的偵測器而定。在索引和搜尋過程中，tokenizer 會根據偵測到的語言自動選擇正確的分析器，並在偵測結果不確定時回復到您的預設設定。</p>
<p><strong>非常適合：</strong>具有不可預測語言混合的動態環境、使用者自製內容平台，或無法進行手動語言標籤的應用程式。</p>
<p><strong>取捨：</strong>自動偵測會增加處理延遲，在處理非常短的文字或混合語言內容時可能會有困難。但對於大多數實際應用而言，便利性遠遠超過這些限制。</p>
<h3 id="3-ICU-Tokenizer-Universal-Foundation" class="common-anchor-header">3.ICU Tokenizer：通用基礎</h3><p>如果您覺得前兩個選項太過誇張，我們為您準備了更簡單的選項。我們新整合了<a href="https://milvus.io/docs/icu-tokenizer.md#ICU"> ICU (International Components for Unicode) 令牌器到</a>Milvus 2.6。ICU 已經存在很久了 - 它是一套成熟、廣泛使用的函式庫，可處理大量語言和腳本的文字處理。最酷的是它可以同時處理各種複雜和簡單的語言。</p>
<p>老實說，ICU tokenizer 是很棒的預設選擇。它使用 Unicode 標準規則來分割字詞，因此對於數十種沒有自己專用 tokenizer 的語言來說都很可靠。如果您只需要功能強大且通用的工具，並能在多種語言中運作良好，ICU 就能滿足您的需求。</p>
<p><strong>限制：</strong>ICU 仍在單一分析器中運作，因此您的所有語言最終都會共用相同的過濾器。想要做特定語言的東西，例如幹部化或語法化？您會遇到我們之前談過的相同衝突。</p>
<p><strong>它的真正優點</strong>我們將 ICU 設定為多語言或語言識別器設定中的預設分析器。它基本上是您處理未明確設定語言的智慧型安全網。</p>
<h2 id="See-It-in-Action-Hands-On-Demo" class="common-anchor-header">觀看實際應用：實際操作示範<button data-href="#See-It-in-Action-Hands-On-Demo" class="anchor-icon" translate="no">
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
    </button></h2><p>理論說得夠多了，讓我們深入一些程式碼！以下是如何在<strong>pymilvus</strong>中使用新的多語言功能來建立一個多語言搜尋集合。</p>
<p>我們將從定義一些可重複使用的分析器配置開始，然後通過<strong>兩個完整的範例</strong>進行實作：</p>
<ul>
<li><p>使用<strong>多語言分析器</strong></p></li>
<li><p>使用<strong>語言識別符標記器</strong></p></li>
</ul>
<p>如需完整的示範程式碼，請參閱<a href="https://github.com/milvus-io/pymilvus/tree/master/examples/full_text_search">此 GitHub 頁面</a>。</p>
<h3 id="Step-1-Set-up-the-Milvus-Client" class="common-anchor-header">步驟 1：設定 Milvus Client</h3><p><em>首先，我們連線到 Milvus，設定一個集合名稱，並清理任何現有的集合，從新開始。</em></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType

<span class="hljs-comment"># 1. Setup Milvus Client</span>
client = MilvusClient(<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
COLLECTION_NAME = <span class="hljs-string">&quot;multilingual_test&quot;</span>
<span class="hljs-keyword">if</span> client.has_collection(collection_name=COLLECTION_NAME):
    client.drop_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Define-Analyzers-for-Multiple-Languages" class="common-anchor-header">步驟 2：定義多種語言的分析器</h3><p>接下來，我們定義<code translate="no">analyzers</code> 字典與特定語言的配置。這些配置將用於稍後展示的兩種多語言搜尋方法。</p>
<pre><code translate="no"><span class="hljs-comment"># 2. Define analyzers for multiple languages</span>
<span class="hljs-comment"># These individual analyzer definitions will be reused by both methods.</span>
analyzers = {
    <span class="hljs-string">&quot;Japanese&quot;</span>: { 
        <span class="hljs-comment"># Use lindera with japanese dict &#x27;ipadic&#x27; </span>
        <span class="hljs-comment"># and remove punctuation beacuse lindera tokenizer will remain punctuation</span>
        <span class="hljs-string">&quot;tokenizer&quot;</span>:{
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;lindera&quot;</span>,
            <span class="hljs-string">&quot;dict_kind&quot;</span>: <span class="hljs-string">&quot;ipadic&quot;</span>
        },
        <span class="hljs-string">&quot;filter&quot;</span>: [<span class="hljs-string">&quot;removepunct&quot;</span>]
    },
    <span class="hljs-string">&quot;English&quot;</span>: {
        <span class="hljs-comment"># Use build-in english analyzer</span>
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>,
    },
    <span class="hljs-string">&quot;default&quot;</span>: {
        <span class="hljs-comment"># use icu tokenizer as a fallback.</span>
        <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;icu&quot;</span>,
    }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Option-A-Using-The-Multi-Language-Analyzer" class="common-anchor-header">選項 A：使用多語言分析器</h3><p>當您<strong>事先知道每個文件的語言時</strong>，這種方法是最好的。您可以在資料插入時，透過專用的<code translate="no">language</code> 欄位傳遞該資訊。</p>
<h4 id="Create-a-Collection-with-Multi-Language-Analyzer" class="common-anchor-header">使用多語言分析器建立集合</h4><p>我們將建立一個集合，其中<code translate="no">&quot;text&quot;</code> 欄位會根據<code translate="no">language</code> 欄位值使用不同的分析器。</p>
<pre><code translate="no"><span class="hljs-comment"># --- Option A: Using Multi-Language Analyzer ---</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Demonstrating Multi-Language Analyzer ---&quot;</span>)

<span class="hljs-comment"># 3A. reate a collection with the Multi Analyzer</span>

mutil_analyzer_params = {
    <span class="hljs-string">&quot;by_field&quot;</span>: <span class="hljs-string">&quot;language&quot;</span>,
    <span class="hljs-string">&quot;analyzers&quot;</span>: analyzers,
}

schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">True</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)<span class="hljs-comment"># Apply our multi-language analyzer to the &#x27;title&#x27; field</span>
schema.add_field(field_name=<span class="hljs-string">&quot;language&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">255</span>, nullable = <span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">25565</span>, enable_analyzer=<span class="hljs-literal">True</span>, multi_analyzer_params = mutil_analyzer_params)
schema.add_field(field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR) <span class="hljs-comment"># Bm25 Sparse Vector</span>

<span class="hljs-comment"># add bm25 function</span>
text_bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;text_sparse&quot;</span>],
)
schema.add_function(text_bm25_function)

index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>, <span class="hljs-comment"># Use auto index for BM25</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>,
)

client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema,
    index_params=index_params
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created successfully.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-Multilingual-Data-and-Load-Collection" class="common-anchor-header">插入多語言資料並載入集合</h4><p>現在插入英文和日文的文件。<code translate="no">language</code> 欄位會告訴 Milvus 使用哪個分析器。</p>
<pre><code translate="no"><span class="hljs-comment"># 4A. Insert data for Multi-Language Analyzer and load collection# Insert English and Japanese movie titles, explicitly setting the &#x27;language&#x27; field</span>
client.insert(
    collection_name=COLLECTION_NAME,
    data=[
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;The Lord of the Rings&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Spirited Away&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;千と千尋の神隠し&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># This is &quot;Spirited Away&quot; in Japanese</span>
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;君の名は。&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># This is &quot;Your Name.&quot; in Japanese</span>
    ]
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted multilingual data into &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;.&quot;</span>)

<span class="hljs-comment"># Load the collection into memory before searching</span>
client.load_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Run-Full-Text-Search" class="common-anchor-header">執行全文檢索</h4><p>要搜尋，根據查詢的語言指定使用哪個分析器。</p>
<pre><code translate="no"><span class="hljs-comment"># 5A. Perform a full-text search with Multi-Language Analyzer# When searching, explicitly specify the analyzer to use for the query string.</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Search results for Multi-Language Analyzer ---&quot;</span>)
results_multi_jp = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;神隠し&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>, <span class="hljs-string">&quot;analyzer_name&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># Specify Japanese analyzer for query</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;神隠し&#x27; (Multi-Language Analyzer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_multi_jp[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

results_multi_en = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;Rings&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>, <span class="hljs-string">&quot;analyzer_name&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>}, <span class="hljs-comment"># Specify English analyzer for query</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;Rings&#x27; (Multi-Language Analyzer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_multi_en[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

client.drop_collection(collection_name=COLLECTION_NAME)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; dropped.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Results" class="common-anchor-header">結果：</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_results_561f628de3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Option-B-Using-the-Language-Identifier-Tokenizer" class="common-anchor-header">選項 B：使用語言識別符標記器</h3><p>此方法不需要您手動處理語言。<strong>語言識別</strong>碼<strong>標記器</strong>會自動偵測每個文件的語言，並套用正確的分析器 - 無需指定<code translate="no">language</code> 欄位。</p>
<h4 id="Create-a-Collection-with-Language-Identifier-Tokenizer" class="common-anchor-header">使用語言識別符標記器建立集合</h4><p>在此，我們建立一個集合，其中<code translate="no">&quot;text&quot;</code> 欄位使用自動語言偵測來選擇正確的分析器。</p>
<pre><code translate="no"><span class="hljs-comment"># --- Option B: Using Language Identifier Tokenizer ---</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Demonstrating Language Identifier Tokenizer ---&quot;</span>)

<span class="hljs-comment"># 3A. create a collection with language identifier</span>
analyzer_params_langid = {
    <span class="hljs-string">&quot;tokenizer&quot;</span>: {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;language_identifier&quot;</span>,
        <span class="hljs-string">&quot;analyzers&quot;</span>: analyzers <span class="hljs-comment"># Referencing the analyzers defined in Step 2</span>
    },
}

schema_langid = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">True</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)
schema_langid.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-comment"># The &#x27;language&#x27; field is not strictly needed by the analyzer itself here, as detection is automatic.# However, you might keep it for metadata purposes.</span>
schema_langid.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">25565</span>, enable_analyzer=<span class="hljs-literal">True</span>, analyzer_params = analyzer_params_langid)
schema_langid.add_field(field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR) <span class="hljs-comment"># BM25 Sparse Vector# add bm25 function</span>
text_bm25_function_langid = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;text_sparse&quot;</span>],
)
schema_langid.add_function(text_bm25_function_langid)

index_params_langid = client.prepare_index_params()
index_params_langid.add_index(
    field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>, <span class="hljs-comment"># Use auto index for BM25</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>,
)

client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema_langid,
    index_params=index_params_langid
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created successfully with Language Identifier Tokenizer.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-Data-and-Load-Collection" class="common-anchor-header">插入資料並載入集合</h4><p>插入不同語言的文字-不需要標籤。Milvus 會自動偵測並應用正確的分析器。</p>
<pre><code translate="no"><span class="hljs-comment"># 4B. Insert Data for Language Identifier Tokenizer and Load Collection</span>
<span class="hljs-comment"># Insert English and Japanese movie titles. The language_identifier will detect the language.</span>
client.insert(
    collection_name=COLLECTION_NAME,
    data=[
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;The Lord of the Rings&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Spirited Away&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;千と千尋の神隠し&quot;</span>}, 
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;君の名は。&quot;</span>},
    ]
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted multilingual data into &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;.&quot;</span>)

<span class="hljs-comment"># Load the collection into memory before searching</span>
client.load_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Run-Full-Text-Search" class="common-anchor-header">執行全文檢索</h4><p>最棒的部分來了：搜尋時<strong>不需要指定分析器</strong>。tokenizer 會自動偵測查詢語言，並應用正確的邏輯。</p>
<pre><code translate="no"><span class="hljs-comment"># 5B. Perform a full-text search with Language Identifier Tokenizer# No need to specify analyzer_name in search_params; it&#x27;s detected automatically for the query.</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Search results for Language Identifier Tokenizer ---&quot;</span>)
results_langid_jp = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;神隠し&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>}, <span class="hljs-comment"># Analyzer automatically determined by language_identifier</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;神隠し&#x27; (Language Identifier Tokenizer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_langid_jp[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

results_langid_en = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;the Rings&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>}, <span class="hljs-comment"># Analyzer automatically determined by language_identifier</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;the Rings&#x27; (Language Identifier Tokenizer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_langid_en[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

client.drop_collection(collection_name=COLLECTION_NAME)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; dropped.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Results" class="common-anchor-header">結果</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_results_486712c3f6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Conclusion" class="common-anchor-header">結論<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 在使<strong>混合搜尋</strong>功能更強大和更容易使用方面向前邁進了一大步，它結合了向量搜尋與關鍵字搜尋，現在可跨越多種語言。透過增強的多語言支援，無論<em>使用者</em>使用何種語言，您建立的應用程式都能了解<em>使用者的意思</em>和<em>他們所說的話</em>。</p>
<p>但這只是更新的一部分。Milvus 2.6 還帶來了其他幾項功能，讓搜尋更快、更聰明、更容易操作：</p>
<ul>
<li><p><strong>更好的查詢匹配</strong>- 使用<code translate="no">phrase_match</code> 和<code translate="no">multi_match</code> 進行更精確的搜尋</p></li>
<li><p><strong>更快的 JSON 篩選</strong>- 感謝新的 JSON 欄位專用索引</p></li>
<li><p><strong>以標量為基礎的排序</strong>-<strong>依</strong>任何數值欄位來排序結果</p></li>
<li><p><strong>進階重新排序</strong>- 使用模型或自訂評分邏輯重新排序結果</p></li>
</ul>
<p>想要了解 Milvus 2.6 的完整細節嗎？請查看我們的最新文章：<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>介紹 Milvus 2.6：十億規模的經濟實惠向量搜尋</strong></a><strong>。</strong></p>
<p>有任何問題或想要深入了解任何功能？加入我們的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 頻道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提出問題。</p>
