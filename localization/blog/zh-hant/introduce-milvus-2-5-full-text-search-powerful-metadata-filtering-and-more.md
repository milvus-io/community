---
id: introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md
title: 介紹 Milvus 2.5：全文檢索、更強大的元資料篩選功能以及可用性改進！
author: 'Ken Zhang, Stefan Webb, Jiang Chen'
date: 2024-12-17T00:00:00.000Z
cover: assets.zilliz.com/Introducing_Milvus_2_5_e4968e1cdb.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md
---
<h2 id="Overview" class="common-anchor-header">概述<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>我們很高興推出 Milvus 的最新版本 2.5，它引入了一個強大的新功能：<a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">全文搜索</a>，也稱為詞彙或關鍵字搜索。如果您是第一次使用搜尋功能，全文搜尋功能可讓您透過搜尋文件中的特定單字或詞組找到文件，與您在 Google 搜尋文件的方式類似。這補充了我們現有的語意搜尋功能，它能了解您搜尋背後的意義，而不只是匹配準確的字詞。</p>
<p>我們使用業界標準的 BM25 公制來表示文件相似性，而且我們的實作是以稀疏向量為基礎，讓儲存和檢索更有效率。對於那些不熟悉這個名詞的人來說，稀疏向量是一種表示大多數值為零的文字的方法，這使得它們在儲存和處理上非常有效率--想像一下一個巨大的試算表，其中只有幾個單元格包含數字，其餘的都是空的。這種方式非常符合 Milvus 的產品哲學，即向量是核心搜尋實體。</p>
<p>我們的實作還有一個值得注意的地方，那就是能夠<em>直接插入</em>和查詢文字，而不是讓使用者先手動把文字轉換成稀疏向量。這讓 Milvus 朝著完全處理非結構化資料的方向更進了一步。</p>
<p>但這只是個開始。隨著 2.5 版本的推出，我們更新了<a href="https://milvus.io/docs/roadmap.md">Milvus 產品路線圖</a>。在 Milvus 未來的產品迭代中，我們將著重在四個關鍵方向上發展 Milvus 的功能：</p>
<ul>
<li>簡化非結構化資料處理；</li>
<li>更好的搜尋品質和效率</li>
<li>更輕鬆的資料管理；</li>
<li>透過演算法和設計的進步降低成本</li>
</ul>
<p>我們的目標是在 AI 時代，建立既能有效儲存又能有效擷取資訊的資料基礎架構。</p>
<h2 id="Full-text-Search-via-Sparse-BM25" class="common-anchor-header">透過 Sparse-BM 進行全文檢索25<button data-href="#Full-text-Search-via-Sparse-BM25" class="anchor-icon" translate="no">
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
    </button></h2><p>雖然語意搜尋通常具有較佳的情境感知與意圖理解能力，但當使用者需要搜尋特定的專有名詞、序號或完全匹配的詞組時，使用關鍵字匹配的全文檢索通常可以產生更精確的結果。</p>
<p>舉個例子來說明這一點：</p>
<ul>
<li>當您問到：「尋找關於可再生能源解決方案的文件 」時，語義檢索會更勝一籌。</li>
<li>當您需要：「尋找提及<em>Tesla Model 3 2024</em> 的文件 」時，全文檢索則更勝一籌。</li>
</ul>
<p>在我們之前的版本（Milvus 2.4）中，使用者必須先在自己的機器上使用單獨的工具（PyMilvus 的 BM25EmbeddingFunction 模組）對文字進行預處理，然後才可以進行搜尋。這種方法有幾個限制：它無法很好地處理不斷增長的資料集、需要額外的設定步驟，而且讓整個過程變得比必要的還要複雜。對於技術人員來說，主要的限制是它只能在單台機器上運作；用於 BM25 評分的詞彙和其他語料統計資料無法隨著語料的變化而更新；在客戶端將文字轉換為向量，直接使用文字會比較不直覺。</p>
<p>Milvus 2.5 簡化了一切。現在您可以直接處理您的文字：</p>
<ul>
<li>儲存原始的文字文件</li>
<li>使用自然語言查詢進行搜尋</li>
<li>以可閱讀的形式獲取結果</li>
</ul>
<p>在幕後，Milvus 會自動處理所有複雜的向量轉換，讓您更容易處理文字資料。這就是我們所謂的 「文件進，文件出 」的方法-您處理可讀的文字，我們處理其餘的部分。</p>
<h3 id="Techical-Implementation" class="common-anchor-header">技術實作</h3><p>對於那些對技術細節感興趣的人，Milvus 2.5 透過其內建的 Sparse-BM25 實作，增加了全文本搜尋功能，包括</p>
<ul>
<li><strong>以 tantivy 為基礎的 Tokenizer</strong>：Milvus 現在整合了蓬勃發展的 tantivy 生態系統</li>
<li><strong>擷取原始文件的能力</strong>：支援直接擷取與查詢文字資料</li>
<li><strong>BM25 相關性評分</strong>：內部化 BM25 評分，根據稀疏向量實作</li>
</ul>
<p>我們選擇與完善的 tantivy 生態系統合作，並在 tantivy 上建立 Milvus 文字標記器。未來，Milvus 將支援更多的標記化器，並公開標記化過程，以幫助使用者更了解檢索品質。我們也將探討基於深度學習的 tokenizer 和 stemmer 策略，以進一步優化全文檢索的效能。以下是使用和設定 tokenizer 的範例程式碼：</p>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Tokenizer configuration</span>
schema.add_field(
    field_name=<span class="hljs-string">&#x27;text&#x27;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">65535</span>,
    enable_analyzer=<span class="hljs-literal">True</span>, <span class="hljs-comment"># Enable tokenizer on this column</span>
    analyzer_params={<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>},  <span class="hljs-comment"># Configure tokenizer parameters, here we choose the english template, fine-grained configuration is also supported</span>
    enable_match=<span class="hljs-literal">True</span>, <span class="hljs-comment"># Build an inverted index for Text_Match</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>在 collection schema 中設定 tokenizer 之後，使用者可以透過 add_function 方法將文字註冊到 bm25 函式中。這將會在 Milvus 伺服器內部執行。所有後續的資料流程，例如新增、刪除、修改和查詢，都可以透過對原始文字串的操作來完成，而非向量表示。請參閱以下程式碼範例，瞭解如何使用新的 API 擷取文字並進行全文檢索：</p>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Define the mapping relationship between raw text data and vectors on the schema</span>
bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25_emb&quot;</span>,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>], <span class="hljs-comment"># Input text field</span>
    output_field_names=[<span class="hljs-string">&quot;sparse&quot;</span>], <span class="hljs-comment"># Internal mapping sparse vector field</span>
    function_type=FunctionType.BM25, <span class="hljs-comment"># Model for processing mapping relationship</span>
)

schema.add_function(bm25_function)
...
<span class="hljs-comment"># Support for raw text in/out</span>
MilvusClient.insert(<span class="hljs-string">&#x27;demo&#x27;</span>, [
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Artificial intelligence was founded as an academic discipline in 1956.&#x27;</span>},
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;</span>},
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Born in Maida Vale, London, Turing was raised in southern England.&#x27;</span>},
])

MilvusClient.search(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>,
    data=[<span class="hljs-string">&#x27;Who started AI research?&#x27;</span>],
    anns_field=<span class="hljs-string">&#x27;sparse&#x27;</span>,
    limit=<span class="hljs-number">3</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>我們採用了 BM25 相關性評分的實作，將查詢和文件表示為稀疏向量，稱為<strong>Sparse-BM25</strong>。這釋放了許多基於稀疏向量的優化功能，例如：</p>
<p>Milvus 透過其尖端的<strong>Sparse-BM25 實作實現</strong>混合搜尋功能，將全文搜尋整合至向量資料庫架構中。Sparse-BM25 將詞彙頻率表示為稀疏向量，而非傳統的倒轉索引，因此可實現先進的最佳化，例如<strong>圖索引</strong>、<strong>乘積量化 (PQ)</strong> 以及<strong>標量量化 (SQ</strong> <strong>)</strong>。這些最佳化功能可將記憶體使用量降至最低，並加速搜尋效能。與倒轉索引方法類似，Milvus 支援將原始文字作為輸入，並在內部產生稀疏向量。這使得它能夠與任何 tokenizer 搭配使用，並掌握動態變化的語料庫中顯示的任何字詞。</p>
<p>此外，基於啟發式的剪枝技術會捨棄低價值的稀疏向量，進一步提升效率而不影響精確度。不同於以往使用稀疏向量的方法，它可以適應不斷成長的語料庫，而非 BM25 評分的準確度。</p>
<ol>
<li>在稀疏向量上建立圖索引，在長文字的查詢上，其表現優於倒置索引，因為倒置索引需要更多步驟來完成查詢中字元的匹配；</li>
<li>利用近似技術加快搜尋速度，但對檢索品質影響不大，例如向量量化和啟發式剪枝；</li>
<li>統一執行語意搜尋與全文搜尋的介面與資料模型，進而提升使用者體驗。</li>
</ol>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Creating an index on the sparse column</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,  <span class="hljs-comment"># Default WAND index</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span> <span class="hljs-comment"># Configure relevance scoring through metric_type</span>
)

<span class="hljs-comment"># Configurable parameters at search time to speed up search</span>
search_params = {
    <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;drop_ratio_search&#x27;</span>: <span class="hljs-number">0.6</span>}, <span class="hljs-comment"># WAND search parameter configuration can speed up search</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>總而言之，Milvus 2.5 藉由導入全文檢索功能，將其搜尋能力擴展至語意搜尋之外，讓使用者更容易建立高品質的 AI 應用程式。這些只是 Sparse-BM25 搜尋空間的初步措施，我們預期未來還會有更多的優化措施可供嘗試。</p>
<h2 id="Text-Matching-Search-Filters" class="common-anchor-header">文字匹配搜尋篩選<button data-href="#Text-Matching-Search-Filters" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.5 發佈的第二個文字搜尋功能是<strong>文字匹配</strong>，它允許使用者過濾搜尋到包含特定文字字串的項目。這項功能也是建立在標記化的基礎上，並透過<code translate="no">enable_match=True</code> 啟用。</p>
<p>值得注意的是，使用 Text Match 時，查詢文字的處理是基於標記化後的 OR 邏輯。例如，在下面的範例中，結果會傳回所有包含「向量」或「資料庫」的文件（使用「文字」欄位）。</p>
<pre><code translate="no" class="language-Python"><span class="hljs-built_in">filter</span> = <span class="hljs-string">&quot;TEXT_MATCH(text, &#x27;vector database&#x27;)&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>如果您的情況需要同時匹配 'vector「 和 」database'，那麼您需要寫兩個獨立的 Text Matches，然後用 AND 疊加，才能達到目標。</p>
<pre><code translate="no" class="language-Python"><span class="hljs-built_in">filter</span> = <span class="hljs-string">&quot;TEXT_MATCH(text, &#x27;vector&#x27;) and TEXT_MATCH(text, &#x27;database&#x27;)&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Significant-Enhancement-in-Scalar-Filtering-Performance" class="common-anchor-header">大幅提升標量篩選效能<button data-href="#Significant-Enhancement-in-Scalar-Filtering-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>我們之所以強調標量篩選效能，是因為我們發現向量檢索與元資料篩選的結合，可以在各種情況下大幅提升查詢效能與精確度。這些情境範圍從圖像搜尋應用，如自動駕駛的角落識別，到企業知識庫中複雜的 RAG 情境。因此，非常適合企業用戶在大規模資料應用場景中實現。</p>
<p>在實際應用中，過濾資料的數量、資料的組織方式、搜尋方式等許多因素都會影響效能。為了解決這個問題，Milvus 2.5 引入了三種新的索引類型-BitMap 索引、陣列反轉索引，以及標記化 Varchar 文字欄位後的反轉索引。這些新索引可以顯著改善實際使用案例中的效能。</p>
<p>具體來說</p>
<ol>
<li><strong>BitMap 索引</strong>可用於加速標記篩選 (常用的運算符包括 in、array_contains 等)，適用於欄位類別資料較少 (資料卡片性) 的情境。其原理是判斷某一行資料的某一列上是否有某個值，1 代表有，0 代表沒有，然後維護一個 BitMap 列表。下圖是我們根據客戶的業務情境進行的效能測試比較。在這個情境中，資料量為 5 億筆，資料類別為 20，不同的值有不同的分佈比例 (1%、5%、10%、50%)，不同篩選量下的效能也各不相同。在 50% 過濾的情況下，我們可以透過 BitMap Index 達到 6.8 倍的效能提升。值得注意的是，隨著 cardinality 的增加，相較於 BitMap Index，Inverted Index 將會展現更均衡的效能。</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/QPS_comparison_f3f580d697.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li><strong>Text Match</strong>是以文字欄位標記化之後的 Inverted Index 為基礎。其效能遠超過我們在 2.4 中提供的 Wildcard Match (即 like + %) 功能。根據我們的內部測試結果，Text Match 的優勢非常明顯，尤其是在並發查詢的情境下，其 QPS 最高可達到 400 倍的提升。</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_size_and_concurrency_e19dc44c59.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在 JSON 資料處理方面，我們計劃在 2.5.x 的後續版本中，針對使用者指定的關鍵字建立反向索引，並為所有關鍵字記錄預設位置資訊，以加快解析速度。我們預期這兩方面都能大幅提升 JSON 和動態字段的查詢效能。我們計劃在未來的發佈筆記和技術部落格中展示更多資訊，敬請期待！</p>
<h2 id="New-Management-Interface" class="common-anchor-header">新的管理介面<button data-href="#New-Management-Interface" class="anchor-icon" translate="no">
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
    </button></h2><p>管理資料庫不需要電腦科學學位，但我們知道資料庫管理員需要強大的工具。這就是我們推出<strong>叢集管理 WebUI</strong> 的原因，這是一個全新的網頁介面，可透過您叢集的位址 9091/webui 連接埠存取。此可觀察性工具提供</p>
<ul>
<li>即時監控儀表板，顯示整個叢集的指標</li>
<li>每個節點的詳細記憶體和效能分析</li>
<li>區段資訊和慢速查詢追蹤</li>
<li>系統健康指標和節點狀態</li>
<li>針對複雜系統問題的易用故障排除工具</li>
</ul>
<p>雖然此介面仍在測試階段，但我們正根據資料庫管理員的使用者回饋積極開發。未來的更新將包括 AI 輔助診斷、更多互動式管理功能，以及增強的群集可觀察能力。</p>
<h2 id="Documentation-and-Developer-Experience" class="common-anchor-header">文件與開發人員體驗<button data-href="#Documentation-and-Developer-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p>我們已徹底改版我們的<strong>文件</strong>和<strong>SDK/API</strong>體驗，讓 Milvus 更容易上手，同時為有經驗的使用者維持深度。改進包括</p>
<ul>
<li>重新建構的文件系統，從基本概念到進階概念的進程更清晰</li>
<li>互動式教學與真實範例，展示實用的執行方式</li>
<li>包含實用程式碼範例的全面 API 參考資料</li>
<li>更友善的 SDK 設計，簡化常見操作</li>
<li>圖文並茂的指南，讓複雜的概念更容易理解</li>
<li>由人工智能驅動的文件助理 (ASK AI) 可提供快速解答</li>
</ul>
<p>更新後的 SDK/API 著重於透過更直覺的介面和更完善的文件整合來改善開發人員的經驗。我們相信您在使用 2.5.x 系列時會注意到這些改進。</p>
<p>然而，我們知道文件和 SDK 開發是一個持續的過程。我們將根據社區回饋持續優化內容結構和 SDK 設計。加入我們的 Discord 頻道，分享您的建議，幫助我們進一步改善。</p>
<h2 id="Summary" class="common-anchor-header"><strong>總結</strong><button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.5 包含 13 項新功能和數項系統層級的最佳化，不僅由 Zilliz 貢獻，也由開放原始碼社群貢獻。在這篇文章中，我們僅介紹了其中的幾項，並鼓勵您訪問我們的<a href="https://milvus.io/docs/release_notes.md">發行說明</a>和<a href="https://milvus.io/docs">官方文件</a>以獲得更多資訊！</p>
