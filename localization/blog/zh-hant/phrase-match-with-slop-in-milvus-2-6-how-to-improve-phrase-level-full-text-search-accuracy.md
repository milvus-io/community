---
id: >-
  phrase-match-with-slop-in-milvus-2-6-how-to-improve-phrase-level-full-text-search-accuracy.md
title: Milvus 2.6 中的詞組配對(Phrase Match with Slop)：如何提高詞組層級的全文檢索準確度
author: Alex Zhang
date: 2025-12-29T00:00:00.000Z
cover: assets.zilliz.com/Phrase_Match_Cover_93a84b0587.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 2.6, Phrase Match, full-text search, keyword matching, vector search'
meta_title: |
  Phrase Match with Slop: Better Full-Text Search Accuracy in Milvus
desc: 瞭解 Milvus 2.6 中的短語匹配功能如何支援短語層級的全文搜尋，使實際生產中的關鍵字篩選更具容忍度。
origin: >-
  https://milvus.io/blog/phrase-match-with-slop-in-milvus-2-6-how-to-improve-phrase-level-full-text-search-accuracy.md
---
<p>隨著非結構化資料持續爆炸性成長，以及 AI 模型不斷變得更聰明，向量搜尋已成為許多 AI 系統 - RAG pipelines、AI 搜尋、代理、推薦引擎等的預設檢索層。它之所以有效，是因為它能捕捉意義：不僅是使用者輸入的字詞，還有字詞背後的意圖。</p>
<p>然而，一旦這些應用程式進入生產階段，團隊往往會發現語意理解只是擷取問題的其中一面。許多工作負載還依賴於嚴格的文字規則，例如匹配精確的術語、保留字序或識別具有技術、法律或操作意義的詞組。</p>
<p><a href="https://milvus.io/docs/release_notes.md#v267">Milvus 2.6</a>透過直接在向量資料庫中引入原生全文搜尋，消除了這種分割。有了內建於核心引擎的標記與位置索引，Milvus 可以解釋查詢的語意，同時強制執行精確的關鍵字與短語層級限制。其結果是一個統一的檢索管道，在這個管道中，意義與結構會互相強化，而不是活在獨立的系統中。</p>
<p><a href="https://milvus.io/docs/phrase-match.md">詞組匹配（Phrase Match</a>）是這種全文檢索功能的關鍵部分。它可辨識按順序一起出現的詞彙序列，這對於檢測日誌模式、錯誤簽署、產品名稱，以及任何由文字順序定義意義的文字都非常重要。在這篇文章中，我們將解釋<a href="https://milvus.io/docs/phrase-match.md">Phrase</a> <a href="https://milvus.io/">Match</a> 如何在<a href="https://milvus.io/">Milvus</a> 中運作，<code translate="no">slop</code> 如何增加真實世界文字所需的靈活性，以及為什麼這些功能讓向量-全文混合搜尋不僅成為可能，而且在單一資料庫中非常實用。</p>
<h2 id="What-is-Phrase-Match" class="common-anchor-header">什麼是短語匹配？<button data-href="#What-is-Phrase-Match" class="anchor-icon" translate="no">
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
    </button></h2><p>短語匹配 (Phrase Match) 是 Milvus 中的一種全文查詢類型，它著重於<em>結構，具體</em>來說，就是一連串的單字是否以相同的順序出現在文件中。當不允許任何彈性時，查詢會嚴格執行：詞彙必須依序出現在彼此旁邊。因此，像<strong>「機器人機器學習」</strong>這樣的查詢只有在這三個字以連續短語的形式出現時才會匹配。</p>
<p>問題在於真實的文字很少有如此整齊的表現。自然語言會帶來雜訊：額外的形容詞會溜進來、日誌會重新排列欄位、產品名稱會增加修飾詞，而且人類作者在撰寫時並沒有考慮到查詢引擎。嚴格的詞組匹配很容易就會破壞--插入一個字、重寫一個詞或調換一個詞都可能造成遺漏。而在許多人工智能系統中，尤其是面對生產的系統，遺漏相關的日誌行或規則觸發短語是不可接受的。</p>
<p>Milvus 2.6 藉由一個簡單的機制來解決這個問題：<strong>滯後</strong>。Slop 定義了<em>查詢</em>字<em>詞之間允許的迴旋空間</em>。Slop 讓您決定是否可以容忍多出一個字，或是兩個字，甚至是輕微的重新排序是否仍算匹配，而不是將一個短語視為脆而不靈活的。這讓詞組搜尋從二進制的通過與否測試，轉變成可控制、可調整的檢索工具。</p>
<p>要瞭解這一點的重要性，試想一下搜尋日誌中所有熟悉的網路錯誤<strong>「連線被對等重設」</strong>的變體<strong>。</strong>實際上，您的記錄可能會如下所示：</p>
<pre><code translate="no">connection reset <span class="hljs-keyword">by</span> peer
connection fast reset <span class="hljs-keyword">by</span> peer
connection was suddenly reset <span class="hljs-keyword">by</span> the peer
peer reset connection <span class="hljs-keyword">by</span> ...
peer unexpected connection reset happened
<button class="copy-code-btn"></button></code></pre>
<p>驟眼看來，所有這些都代表相同的基本事件。但一般的擷取方法卻很吃力：</p>
<h3 id="BM25-struggles-with-structure" class="common-anchor-header">BM25 在結構上有困難。</h3><p>它將查詢視為一袋關鍵字，而忽略它們出現的順序。只要「連結」和「對等」在某處出現，BM25 就可能將文件排在很高的位置 - 即使這個詞組是相反的或與您實際要搜尋的概念無關。</p>
<h3 id="Vector-search-struggles-with-constraints" class="common-anchor-header">矢量搜尋在限制條件下掙扎。</h3><p>嵌入式最擅長捕捉意義和語義關係，但卻無法強制執行「這些字詞必須以這樣的順序出現」這樣的規則。您可能會擷取語意相關的訊息，但仍會遺漏調試或合規所需的確切結構模式。</p>
<p>詞組匹配填補了這兩種方法之間的缺口。透過使用<strong>slop</strong>，您可以精確指定可接受的變化程度：</p>
<ul>
<li><p><code translate="no">slop = 0</code> - 完全匹配（所有詞彙必須依序連續出現。）</p></li>
<li><p><code translate="no">slop = 1</code> - 允許多一個字（以單一插入詞涵蓋常見的自然語言變化。）</p></li>
<li><p><code translate="no">slop = 2</code> - 允許插入多個字（處理更具描述性或冗長的措辭。）</p></li>
<li><p><code translate="no">slop = 3</code> - 允許重新排序（支援排序顛倒或松散的詞組，這通常是真實文字中最難處理的情況。）</p></li>
</ul>
<p>與其寄望於評分演算法「準確無誤」，您可以明確地宣告您的應用程式所需的結構容限。</p>
<h2 id="How-Phrase-Match-Works-in-Milvus" class="common-anchor-header">短語匹配如何在 Milvus 中運作<button data-href="#How-Phrase-Match-Works-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 中的短語匹配由<a href="https://github.com/quickwit-oss/tantivy">Tantivy</a>搜尋引擎函式庫提供，在具有位置資訊的倒置索引之上實作。它不只是檢查詞彙是否出現在文件中，還會驗證它們是否以正確的順序出現，而且出現的距離在可控制的範圍內。</p>
<p>下圖說明了這個過程：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/phrase_match_workflow_a4f3badb66.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>1.文件標記化（含位置）</strong></p>
<p>當文件插入 Milvus 時，文本欄位會被<a href="https://milvus.io/docs/analyzer-overview.md">分析器</a>處理，<a href="https://milvus.io/docs/analyzer-overview.md">分析器</a>會將文本分割成標記（單詞或術語），並記錄每個標記在文件中的位置。例如，<code translate="no">doc_1</code> 被標記為：<code translate="no">machine (pos=0), learning (pos=1), boosts (pos=2), efficiency (pos=3)</code>.</p>
<p><strong>2.建立反向索引</strong></p>
<p>接下來，Milvus 會建立反向索引。倒置索引不是將文件映射到其內容，而是將每個符記映射到其出現的文件，以及該符記在每個文件中的所有記錄位置。</p>
<p><strong>3.短語匹配</strong></p>
<p>當執行短語查詢時，Milvus 首先使用倒置索引來識別包含所有查詢符記的文件。然後，它會比較標記的位置來驗證每個候選詞，以確保詞彙以正確的順序出現，並且在允許的<code translate="no">slop</code> 距離之內。只有滿足這兩個條件的文件才會被傳回作為匹配。</p>
<p>下圖總結了短語匹配的端對端工作方式。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/workflow2_63c168b107.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-to-Enable-Phrase-Match-in-Milvus" class="common-anchor-header">如何在 Milvus 中啟用短語匹配<button data-href="#How-to-Enable-Phrase-Match-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>短語匹配在類型為 <strong><code translate="no">VARCHAR</code></strong>，Milvus 中的字串類型。要使用它，您必須配置您的收集模式，以便 Milvus 執行文字分析並儲存欄位的位置資訊。要做到這一點，需要啟用兩個參數：<code translate="no">enable_analyzer</code> 和<code translate="no">enable_match</code> 。</p>
<h3 id="Set-enableanalyzer-and-enablematch" class="common-anchor-header">設定 enable_analyzer 和 enable_match</h3><p>要為特定的 VARCHAR 欄位開啟短語匹配，在定義欄位模式時，將這兩個參數都設定為<code translate="no">True</code> 。它們一起告訴 Milvus</p>
<ul>
<li><p><strong>將</strong>文字<strong>標記化</strong>(透過<code translate="no">enable_analyzer</code>)，並且</p></li>
<li><p><strong>建立具有位置偏移的反向索引</strong>(透過<code translate="no">enable_match</code>)。</p></li>
</ul>
<p>短語匹配依賴於這兩個步驟：分析器將文字分解為標記，而匹配索引則儲存這些標記出現的位置，從而實現高效的短語和基於斜坡的查詢。</p>
<p>以下是在<code translate="no">text</code> 欄位上啟用短語匹配的模式配置範例：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

schema = MilvusClient.create_schema(enable_dynamic_field=<span class="hljs-literal">False</span>)
schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=DataType.INT64,
    is_primary=<span class="hljs-literal">True</span>,
    auto_id=<span class="hljs-literal">True</span>
)
schema.add_field(
    field_name=<span class="hljs-string">&#x27;text&#x27;</span>,                 <span class="hljs-comment"># Name of the field</span>
    datatype=DataType.VARCHAR,         <span class="hljs-comment"># Field data type set as VARCHAR (string)</span>
    max_length=<span class="hljs-number">1000</span>,                   <span class="hljs-comment"># Maximum length of the string</span>
    enable_analyzer=<span class="hljs-literal">True</span>,              <span class="hljs-comment"># Enables text analysis (tokenization)</span>
    enable_match=<span class="hljs-literal">True</span>                  <span class="hljs-comment"># Enables inverted indexing for phrase matching</span>
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;embeddings&quot;</span>,
    datatype=DataType.FLOAT_VECTOR,
    dim=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Search-with-Phrase-Match-How-Slop-Affects-the-Candidate-Set" class="common-anchor-header">使用短語匹配進行搜尋：濫用如何影響候選集<button data-href="#Search-with-Phrase-Match-How-Slop-Affects-the-Candidate-Set" class="anchor-icon" translate="no">
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
    </button></h2><p>一旦您在集合模式中啟用了 VARCHAR 欄位的匹配，您就可以使用<code translate="no">PHRASE_MATCH</code> 表達式執行短語匹配。</p>
<p>注意：<code translate="no">PHRASE_MATCH</code> 表達式不區分大小寫。您可以使用<code translate="no">PHRASE_MATCH</code> 或<code translate="no">phrase_match</code> 。</p>
<p>在搜尋作業中，詞組匹配通常應用在向量相似性排序之前。它首先根據明確的文字限制過濾文件，縮小候選集的範圍。然後使用向量內嵌對剩餘的文件重新排序。</p>
<p>下面的範例顯示了不同的<code translate="no">slop</code> 值如何影響這個過程。透過調整<code translate="no">slop</code> 參數，您可以直接控制哪些文件通過詞組篩選並進入向量排序階段。</p>
<p>假設您有一個名為<code translate="no">tech_articles</code> 的集合，其中包含以下五個實體：</p>
<table>
<thead>
<tr><th><strong>doc_id</strong></th><th><strong>文字</strong></th></tr>
</thead>
<tbody>
<tr><td>1</td><td>機器學習提升大規模資料分析的效率</td></tr>
<tr><td>2</td><td>學習以機器為基礎的方法對於現代人工智能的進步至關重要</td></tr>
<tr><td>3</td><td>深度學習機器架構可優化計算負載</td></tr>
<tr><td>4</td><td>機器迅速提升持續學習的模型效能</td></tr>
<tr><td>5</td><td>學習先進的機器演算法擴展 AI 能力</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=1</code></strong></p>
<p>在此，我們允許的斜率為 1。篩選條件適用於包含短語「學習機器」的文件，略有彈性。</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;learning machine&quot; with slop=1</span>
filter_slop1 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;learning machine&#x27;, 1)&quot;</span>

result_slop1 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,
    data=[query_vector],
    <span class="hljs-built_in">filter</span>=filter_slop1,
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>匹配結果：</p>
<table>
<thead>
<tr><th>doc_id</th><th>文字</th></tr>
</thead>
<tbody>
<tr><td>2</td><td>學習機器化對於現代人工智能的進步至關重要</td></tr>
<tr><td>3</td><td>深度學習機器架構可優化計算負載</td></tr>
<tr><td>5</td><td>學習先進的機器演算法可擴展 AI 能力</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=2</code></strong></p>
<p>此範例允許 2 的斜率，意即「機器」和「學習」兩詞之間最多允許有兩個額外的代名詞（或反向詞）。</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;machine learning&quot; with slop=2</span>
filter_slop2 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;machine learning&#x27;, 2)&quot;</span>

result_slop2 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,             <span class="hljs-comment"># Vector field name</span>
    data=[query_vector],                 <span class="hljs-comment"># Query vector</span>
    <span class="hljs-built_in">filter</span>=filter_slop2,                 <span class="hljs-comment"># Filter expression</span>
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,                            <span class="hljs-comment"># Maximum results to return</span>
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>匹配結果：</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>doc_id</strong></th><th style="text-align:center"><strong>文字</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">1</td><td style="text-align:center">機器學習提升大規模資料分析的效率</td></tr>
<tr><td style="text-align:center">3</td><td style="text-align:center">深度學習機器架構可優化計算負載</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=3</code></strong></p>
<p>在這個範例中，3 的斜率提供了更大的彈性。篩選程式搜尋「機器學習」，字詞之間最多允許三個符號位置。</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;machine learning&quot; with slop=3</span>
filter_slop3 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;machine learning&#x27;, 3)&quot;</span>

result_slop2 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,             <span class="hljs-comment"># Vector field name</span>
    data=[query_vector],                 <span class="hljs-comment"># Query vector</span>
    <span class="hljs-built_in">filter</span>=filter_slop3,                 <span class="hljs-comment"># Filter expression</span>
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,                            <span class="hljs-comment"># Maximum results to return</span>
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>匹配結果：</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>doc_id</strong></th><th style="text-align:center"><strong>文字</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">1</td><td style="text-align:center">機器學習提升大規模資料分析的效率</td></tr>
<tr><td style="text-align:center">2</td><td style="text-align:center">學習以機器為基礎的方法對於現代人工智能的進步至關重要</td></tr>
<tr><td style="text-align:center">3</td><td style="text-align:center">深度學習機器架構可優化計算負載</td></tr>
<tr><td style="text-align:center">5</td><td style="text-align:center">學習先進的機器演算法可擴展 AI 能力</td></tr>
</tbody>
</table>
<h2 id="Quick-Tips-What-You-Need-to-Know-Before-Enabling-Phrase-Match-in-Milvus" class="common-anchor-header">快速提示：在 Milvus 中啟用短語匹配之前您需要瞭解的事項<button data-href="#Quick-Tips-What-You-Need-to-Know-Before-Enabling-Phrase-Match-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>短語匹配提供短語層級篩選支援，但啟用短語匹配所涉及的不只是查詢時的設定。在生產設定中應用之前，了解相關的注意事項是很有幫助的。</p>
<ul>
<li><p>在欄位上啟用片語匹配會建立反向索引，這會增加儲存使用量。確切的成本取決於文字長度、唯一標記數量和分析器設定等因素。當處理大型文字欄位或高心數資料時，應事先考慮此開銷。</p></li>
<li><p>分析器配置是另一個關鍵的設計選擇。一旦在收集模式中定義了分析器，就無法變更。之後，若要切換到不同的分析器，就必須刪除現有的集合，然後以新的模式重新建立。因此，分析器的選擇應該被視為長期的決定，而不是實驗。</p></li>
<li><p>短語匹配行為與文字的標記化方式緊密相連。在將分析器套用到整個集合之前，建議使用<code translate="no">run_analyzer</code> 方法來檢查標記化輸出，並確認它符合您的期望。此步驟有助於避免微妙的不匹配和稍後意外的查詢結果。如需詳細資訊，請參閱<a href="https://milvus.io/docs/analyzer-overview.md#share-DYZvdQ2vUowWEwx1MEHcdjNNnqT">Analyzer Overview</a>。</p></li>
</ul>
<h2 id="Conclusion" class="common-anchor-header">總結<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>短語匹配 (Phrase Match) 是一種核心的全文搜尋類型，除了簡單的關鍵字匹配之外，還能使用短語層級和位置限制。藉由代號順序和接近性，它提供了一種可預測且精確的方式，可根據詞彙在文字中的實際出現方式來過濾文件。</p>
<p>在現代檢索系統中，詞組匹配通常應用在向量式排序之前。它首先將候選集限制為明確滿足所需短語或結構的文件。然後再使用向量搜尋，依據語意相關性對這些結果進行排序。這種模式在日誌分析、技術文件搜尋和 RAG 管道等情境中特別有效，在這些情境中，必須先強制執行文字限制，然後才考慮語意相似性。</p>
<p>隨著 Milvus 2.6 引入<code translate="no">slop</code> 參數，短語匹配對自然語言變化的容忍度變得更高，同時保留了其作為全文過濾機制的角色。這使得短語層級的限制更容易應用於生產檢索工作流程中。</p>
<p>使用<a href="https://github.com/openvino-book/Milvus-Phrase-Match-Demo">示範腳本</a>試試看，並探索<a href="https://milvus.io/docs/release_notes.md#v267">Milvus 2.6</a>，看看短語感知檢索如何融入您的堆疊。</p>
<p>對最新 Milvus 的任何功能有問題或想要深入瞭解？加入我們的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 頻道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提出問題。您也可以透過<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 預約 20 分鐘的一對一課程，以獲得深入的瞭解、指導和問題解答。</p>
