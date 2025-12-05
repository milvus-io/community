---
id: >-
  unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md
title: 開啟真正的實體層級擷取：Milvus 中新的結構陣列與 MAX_SIM 功能
author: 'Jeremy Zhu, Min Tian'
date: 2025-12-05T00:00:00.000Z
cover: assets.zilliz.com/array_of_struct_cover_457c5a104b.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Array of Structs, MAX_SIM, vector database, multi-vector retrieval'
meta_title: |
  Array of Structs in Milvus: Entity-Level Multi-Vector Retrieval
desc: 了解 Milvus 中的 Array of Structs 和 MAX_SIM 如何實現多向量資料的真正實體層級搜尋，消除重複計算並提高檢索準確性。
origin: >-
  https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md
---
<p>如果您在向量資料庫之上建立了人工智慧應用程式，您可能會遇到相同的痛點：資料庫擷取的是個別區塊的嵌入，但您的應用程式關心的<strong>是<em>實體</em>。</strong>這種錯配讓整個擷取工作流程變得複雜。</p>
<p>您可能已經看到這種情況一再發生：</p>
<ul>
<li><p><strong>RAG 知識庫：</strong>文章被分成段落嵌入，因此搜尋引擎會返回分散的片段，而不是完整的文件。</p></li>
<li><p><strong>電子商務推薦：</strong>一個產品有多個圖片嵌入，而您的系統返回的是同一個項目的五個角度，而不是五個獨特的產品。</p></li>
<li><p><strong>視訊平台：</strong>影片被分割成片段嵌入，但搜尋結果顯示的是同一影片的片段，而不是單一的整合項目。</p></li>
<li><p><strong>ColBERT / ColPali 式檢索：</strong>文件會擴展成數百個標記或片段層級的嵌入，而您的結果則是仍需合併的小片段。</p></li>
</ul>
<p>所有這些問題都源自於<em>相同的架構差異</em>：大多數向量資料庫將每個內嵌視為獨立的一行，而實際應用程式則是在更高層級的實體上運作 - 文件、產品、視訊、項目、場景。因此，工程團隊不得不使用重複資料刪除、群組、分類和重排邏輯來手動重建實體。這種方法雖然有效，但卻脆弱、緩慢，而且會為應用程式層增添原本就不該存在的邏輯。</p>
<p><a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6.4 藉由</a>一項新功能縮小了這個差距：具有<strong>MAX_SIM</strong>公制類型的<a href="https://milvus.io/docs/array-of-structs.md"><strong>結構陣列</strong></a>。兩者結合起來，可讓單一實體的所有嵌入都儲存在單一記錄中，並使 Milvus 能夠整體地評分和回傳實體。不再有重複的結果集。不再有複雜的後期處理，例如重排和合併。</p>
<p>在這篇文章中，我們將介紹 Array of Structs 和 MAX_SIM 如何運作，並透過兩個實例進行示範：維基百科文件檢索和 ColPali 圖像文件搜尋。</p>
<h2 id="What-is-an-Array-of-Structs" class="common-anchor-header">什麼是結構陣列？<button data-href="#What-is-an-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><p>在 Milvus 中，<strong>Structs 陣列</strong>欄位允許單一記錄包含 Struct 元素的<em>有序清單</em>，每個元素都遵循相同的預定義模式。一個 Struct 可以容納多個向量、標量欄位、字串或任何其他支援的類型。換句話說，它可以讓您將所有屬於一個實體的片段 - 段落內嵌、影像檢視、標記向量、元資料 - 直接捆綁在同一行內。</p>
<p>以下是一個包含 Array of Structs 欄位的集合實體範例。</p>
<pre><code translate="no">{
    <span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">0</span>,
    <span class="hljs-string">&#x27;title&#x27;</span>: <span class="hljs-string">&#x27;Walden&#x27;</span>,
    <span class="hljs-string">&#x27;title_vector&#x27;</span>: [<span class="hljs-number">0.1</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.3</span>, <span class="hljs-number">0.4</span>, <span class="hljs-number">0.5</span>],
    <span class="hljs-string">&#x27;author&#x27;</span>: <span class="hljs-string">&#x27;Henry David Thoreau&#x27;</span>,
    <span class="hljs-string">&#x27;year_of_publication&#x27;</span>: <span class="hljs-number">1845</span>,
    <span class="hljs-comment">// highlight-start</span>
    <span class="hljs-string">&#x27;chunks&#x27;</span>: [
        {
            <span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;When I wrote the following pages, or rather the bulk of them...&#x27;</span>,
            <span class="hljs-string">&#x27;text_vector&#x27;</span>: [<span class="hljs-number">0.3</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.3</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.5</span>],
            <span class="hljs-string">&#x27;chapter&#x27;</span>: <span class="hljs-string">&#x27;Economy&#x27;</span>,
        },
        {
            <span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;I would fain say something, not so much concerning the Chinese and...&#x27;</span>,
            <span class="hljs-string">&#x27;text_vector&#x27;</span>: [<span class="hljs-number">0.7</span>, <span class="hljs-number">0.4</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.7</span>, <span class="hljs-number">0.8</span>],
            <span class="hljs-string">&#x27;chapter&#x27;</span>: <span class="hljs-string">&#x27;Economy&#x27;</span>
        }
    ]
    <span class="hljs-comment">// hightlight-end</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>在上面的範例中，<code translate="no">chunks</code> 欄位是一個 Array of Structs 欄位，而每個 Struct 元素都包含自己的欄位，即<code translate="no">text</code>,<code translate="no">text_vector</code>, 和<code translate="no">chapter</code> 。</p>
<p>這種方法解決了向量資料庫中一個存在已久的建模問題。傳統上，每個嵌入或屬性都必須成為自己的一行，這就迫使<strong>多向量實體 (文件、產品、影片)</strong>被分割成數十條、數百條，甚至數千條記錄。有了 Array of Structs，Milvus 讓您可以在單一欄位中儲存整個多向量實體，使其自然地適用於段落列表、符號嵌入、剪輯序列、多視圖或任何一個邏輯項目由許多向量組成的情況。</p>
<h2 id="How-Does-an-Array-of-Structs-Work-with-MAXSIM" class="common-anchor-header">結構體陣列如何使用 MAX_SIM？<button data-href="#How-Does-an-Array-of-Structs-Work-with-MAXSIM" class="anchor-icon" translate="no">
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
    </button></h2><p>在這個新的結構陣列結構之上是<strong>MAX_SIM</strong>，這是一個新的評分策略，讓語意檢索具有實體感知能力。當查詢來到時，Milvus 會將其與每個結構陣列中的<em>每個</em>向量進行比較，並將<strong>最大相似度作</strong>為該實體的最終得分。然後根據單一的分數對實體進行排序和傳回。這避免了傳統向量資料庫擷取零散片段的問題，並將群組、刪除和重新排序的負擔推到應用程式層。有了 MAX_SIM，實體層級的擷取變得內建、一致且有效率。</p>
<p>為了瞭解 MAX_SIM 如何實際運作，讓我們來看一個具體的範例。</p>
<p><strong>注意：</strong>本範例中的所有向量都是由相同的嵌入模型產生，相似度是以 [0,1] 範圍內的余弦相似度來衡量。</p>
<p>假設使用者搜尋<strong>「機器學習初級課程」。</strong></p>
<p>該查詢被標記化成三個<strong>標記</strong>：</p>
<ul>
<li><p><em>機器學習</em></p></li>
<li><p><em>初學者</em></p></li>
<li><p><em>課程</em></p></li>
</ul>
<p>然後，每個標記都會被用來處理文件的相同嵌入模型<strong>轉換成</strong>嵌入<strong>向量</strong>。</p>
<p>現在，想像向量資料庫包含兩個文件：</p>
<ul>
<li><p><strong>doc_1:</strong> <em>使用 Python 的深度神經網路入門指南</em></p></li>
<li><p><strong>doc_2:</strong> <em>An Advanced Guide to LLM Paper Reading</em></p></li>
</ul>
<p>兩個文件都已經內嵌成向量，並儲存在一個 Structs 陣列裡面。</p>
<h3 id="Step-1-Compute-MAXSIM-for-doc1" class="common-anchor-header"><strong>步驟 1: 計算 doc_1 的 MAX_SIM</strong></h3><p>對於每個查詢向量，Milvus 計算它與 doc_1 中每個向量的余弦相似度：</p>
<table>
<thead>
<tr><th></th><th>簡介</th><th>導覽</th><th>深度神經網路</th><th>蟒コ遲</th></tr>
</thead>
<tbody>
<tr><td>機器學習</td><td>0.0</td><td>0.0</td><td><strong>0.9</strong></td><td>0.3</td></tr>
<tr><td>初學者</td><td><strong>0.8</strong></td><td>0.1</td><td>0.0</td><td>0.3</td></tr>
<tr><td>課程</td><td>0.3</td><td><strong>0.7</strong></td><td>0.1</td><td>0.1</td></tr>
</tbody>
</table>
<p>對於每個查詢向量，MAX_SIM 會從其行中選取相似度<strong>最高的</strong>一個：</p>
<ul>
<li><p>機器學習 → 深度神經網路 (0.9)</p></li>
<li><p>初學者 → 引言 (0.8)</p></li>
<li><p>課程 → 指南 (0.7)</p></li>
</ul>
<p>將最佳匹配總和，doc_1 的<strong>MAX_SIM 得數為 2.4</strong>。</p>
<h3 id="Step-2-Compute-MAXSIM-for-doc2" class="common-anchor-header">步驟 2: 計算 doc_2 的 MAX_SIM 分數</h3><p>現在我們重複 doc_2 的過程：</p>
<table>
<thead>
<tr><th></th><th>進階</th><th>引導</th><th>LLM</th><th>論文</th><th>閱讀</th></tr>
</thead>
<tbody>
<tr><td>機器學習</td><td>0.1</td><td>0.2</td><td><strong>0.9</strong></td><td>0.3</td><td>0.1</td></tr>
<tr><td>初學者</td><td>0.4</td><td><strong>0.6</strong></td><td>0.0</td><td>0.2</td><td>0.5</td></tr>
<tr><td>課程</td><td>0.5</td><td><strong>0.8</strong></td><td>0.1</td><td>0.4</td><td>0.7</td></tr>
</tbody>
</table>
<p>doc_2 的最佳匹配是：</p>
<ul>
<li><p>"machine learning" → "LLM" (0.9)</p></li>
<li><p>"beginner" → "guide" (0.6)</p></li>
<li><p>"course" → "guide" (0.8)</p></li>
</ul>
<p>相加得出 doc_2 的<strong>MAX_SIM 得數為 2.3</strong>。</p>
<h3 id="Step-3-Compare-the-Scores" class="common-anchor-header">步驟 3: 比較分數</h3><p>由於<strong>2.4 &gt; 2.3</strong>，<strong>doc_1 的排名比 doc_2 高</strong>，這是直覺的道理，因為 doc_1 比較接近機器學習入門指南。</p>
<p>從這個例子，我們可以突顯 MAX_SIM 的三個核心特徵：</p>
<ul>
<li><p><strong>語義第一，而非基於關鍵字：</strong>MAX_SIM 比較的是嵌入，而不是文字。即使<em>「機器學習」</em>與<em>「深度神經網路」</em>的重疊字彙為零，它們的語意相似度仍高達 0.9。這使得 MAX_SIM 對於同義詞、意譯、概念重疊以及現代嵌入式豐富的工作負載都很穩健。</p></li>
<li><p><strong>對長度和順序不敏感：</strong>MAX_SIM 不要求查詢和文檔有相同數量的向量 (例如，doc_1 有 4 個向量，而 doc_2 有 5 個，兩者都可以正常運作)。它也忽略向量的順序 - 「初學者」 出現在查詢的較前位置，而 「介紹」 出現在文件的較後位置，對得分沒有影響。</p></li>
<li><p><strong>每個查詢向量都很重要：</strong>MAX_SIM 取每個查詢向量的最佳匹配值，並將這些最佳分數相加。這可以防止未匹配的向量歪曲結果，並確保每個重要的查詢符記都會對最終得分有所貢獻。例如，doc_2 中 "beginner" 的低品質匹配直接降低了它的總分。</p></li>
</ul>
<h2 id="Why-MAXSIM-+-Array-of-Structs-Matter-in-Vector-Database" class="common-anchor-header">為什麼在向量資料庫中 MAX_SIM + 結構陣列很重要？<button data-href="#Why-MAXSIM-+-Array-of-Structs-Matter-in-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a>是一個開放原始碼、高效能的向量資料庫，它現在完全支援 MAX_SIM 與 Array of Structs，實現向量原生、實體層級的多向量檢索：</p>
<ul>
<li><p><strong>原生儲存多向量實體：</strong>Array of Structs 可讓您在單一欄位儲存相關向量群組，而無須將其分割成獨立的行或輔助表。</p></li>
<li><p><strong>高效的最佳匹配計算：</strong>結合向量索引 (例如 IVF 與 HNSW)，MAX_SIM 可在不掃描每個向量的情況下計算最佳匹配，即使是大型文件也能保持高效能。</p></li>
<li><p><strong>專為語意繁重的工作負載而設計：</strong>此方法適用於長文檢索、多面向語意比對、文件摘要對齊、多關鍵字查詢，以及其他需要彈性、細粒度語意推理的人工智慧情境。</p></li>
</ul>
<h2 id="When-to-Use-an-Array-of-Structs" class="common-anchor-header">何時使用結構陣列<button data-href="#When-to-Use-an-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><p>當您檢視<strong>Array of Structs 的</strong>功能時，它的價值就一目了然了。這項功能的核心在於提供三種基本能力：</p>
<ul>
<li><p><strong>它可以將異質資料（向量</strong>、標量、字串、元資料）<strong>捆綁</strong>成單一結構物件。</p></li>
<li><p><strong>它將儲存與現實世界的實體對齊</strong>，因此資料庫的每一行都能清楚地對應到文章、產品或視訊等實際項目。</p></li>
<li><p><strong>當與 MAX_SIM 等聚合功能結合時</strong>，它可以直接從資料庫中進行真正的實體層級多向量檢索，而不需要在應用程式層中進行重複資料刪除、分組或重新排序。</p></li>
</ul>
<p>由於這些特性，<em>當單一邏輯實體由多向量來表示</em>時，Array of Structs 就是一個天然的選擇。常見的例子包括分割成段落的文章、分解成標記嵌入的文件，或是由多張圖片代表的產品。如果您的搜尋結果出現重複點擊、分散的片段，或是同一個實體多次出現在頂端結果中，Array of Structs 可在儲存和檢索層解決這些問題，而不是在應用程式碼中進行事後修補。</p>
<p>對於依賴<strong>多向量擷取的</strong>現代 AI 系統來說，這種模式尤其強大。 舉例來說，ColBERT 將單一文件表示為一個<strong>矢量</strong>：</p>
<ul>
<li><p><a href="https://zilliz.com/learn/explore-colbert-token-level-embedding-and-ranking-model-for-similarity-search"><strong>ColBERT</strong></a>將單一文件表示為 100-500 個標記嵌入，用於跨領域（如法律文本和學術研究）的精細語義匹配。</p></li>
<li><p><a href="https://zilliz.com/blog/colpali-enhanced-doc-retrieval-with-vision-language-models-and-colbert-strategy"><strong>ColPali</strong>可將 </a>每個 PDF 頁面<a href="https://zilliz.com/blog/colpali-enhanced-doc-retrieval-with-vision-language-models-and-colbert-strategy">轉換成 </a>256-1024 個影像修補碼，以進行財務報表、合約、發票和其他掃描文件的跨模式檢索。</p></li>
</ul>
<p>Structs 陣列可讓 Milvus 將所有這些向量儲存在單一實體之下，並有效且原生地計算集合相似度 (例如 MAX_SIM)。為了更清楚說明這一點，這裡有兩個具體的範例。</p>
<h3 id="Example-1-E-commerce-Product-Search" class="common-anchor-header">範例 1：電子商務產品搜尋</h3><p>以前，具有多張圖片的產品會儲存在平面模式中，每行只有一張圖片。一個產品有正面、側面和角度拍攝，會產生三行。搜尋結果通常會傳回同一產品的多張圖像，需要手動重複刪除和重新排序。</p>
<p>有了 Structs 陣列，每個產品都變成<strong>一列</strong>。所有的圖片嵌入和元資料 (角度、is_primary 等) 都以結構陣列的形式存在於<code translate="no">images</code> 欄位中。Milvus 瞭解它們屬於同一個產品，並返回產品整體，而非其個別圖片。</p>
<h3 id="Example-2-Knowledge-Base-or-Wikipedia-Search" class="common-anchor-header">範例 2：知識庫或維基百科搜尋</h3><p>以前，一篇 Wikipedia 文章會分成<em>N 個</em>段落行。搜尋結果會傳回分散的段落，迫使系統將它們分組，並猜測它們屬於哪篇文章。</p>
<p>有了 Structs 陣列，整篇文章就變成了<strong>一行</strong>。所有段落及其嵌入都會歸類到段落欄位，資料庫會傳回完整的文章，而不是零碎的片段。</p>
<h2 id="Hands-on-Tutorials-Document-Level-Retrieval-with-the-Array-of-Structs" class="common-anchor-header">實作教學：使用結構陣列進行文件層級檢索<button data-href="#Hands-on-Tutorials-Document-Level-Retrieval-with-the-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Wikipedia-Document-Retrieval" class="common-anchor-header">1.維基百科文件擷取</h3><p>在本教程中，我們將介紹如何使用<strong>結構陣列將</strong>段落級資料轉換為完整的文檔記錄-允許 Milvus 執行<strong>真正的文檔級檢索</strong>，而不是返回孤立的片段。</p>
<p>許多知識庫管道會將 Wikipedia 文章儲存為段落區塊。這對於嵌入和索引來說非常有效，但卻會破壞擷取：使用者查詢通常會傳回分散的段落，迫使您手動將文章分類並重組。有了 Structs 陣列和 MAX_SIM，我們就可以重新設計儲存模式，讓<strong>每篇文章成為一列</strong>，Milvus 就可以原生排序並傳回整份文件。</p>
<p>在接下來的步驟中，我們將展示如何</p>
<ol>
<li><p>載入並預先處理維基百科的段落資料</p></li>
<li><p>將屬於同一篇文章的所有段落綑綁成結構陣列</p></li>
<li><p>將這些結構化文件插入 Milvus</p></li>
<li><p>執行 MAX_SIM 查詢以擷取完整的文章--乾淨、無需重整或重新排序</p></li>
</ol>
<p>本教學結束時，您將擁有一個工作管道，Milvus 可以直接處理實體層級的擷取，完全符合使用者的期望。</p>
<p><strong>資料模型：</strong></p>
<pre><code translate="no">{
    <span class="hljs-string">&quot;wiki_id&quot;</span>: <span class="hljs-built_in">int</span>,                  <span class="hljs-comment"># WIKI ID(primary key） </span>
    <span class="hljs-string">&quot;paragraphs&quot;</span>: ARRAY&lt;STRUCT&lt;      <span class="hljs-comment"># Array of paragraph structs</span>
        text:VARCHAR                 <span class="hljs-comment"># Paragraph text</span>
        emb: FLOAT_VECTOR(<span class="hljs-number">768</span>)       <span class="hljs-comment"># Embedding for each paragraph</span>
    &gt;&gt;
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>步驟 1：組合和轉換資料</strong></p>
<p>在這個示範中，我們使用<a href="https://huggingface.co/datasets/Cohere/wikipedia-22-12-simple-embeddings">Simple Wikipedia Embeddings</a>資料集。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> pandas <span class="hljs-keyword">as</span> pd
<span class="hljs-keyword">import</span> pyarrow <span class="hljs-keyword">as</span> pa

<span class="hljs-comment"># Load the dataset and group by wiki_id</span>
df = pd.read_parquet(<span class="hljs-string">&quot;train-*.parquet&quot;</span>)
grouped = df.groupby(<span class="hljs-string">&#x27;wiki_id&#x27;</span>)

<span class="hljs-comment"># Build the paragraph array for each article</span>
wiki_data = []
<span class="hljs-keyword">for</span> wiki_id, group <span class="hljs-keyword">in</span> grouped:
    wiki_data.append({
        <span class="hljs-string">&#x27;wiki_id&#x27;</span>: wiki_id,
        <span class="hljs-string">&#x27;paragraphs&#x27;</span>: [{<span class="hljs-string">&#x27;text&#x27;</span>: row[<span class="hljs-string">&#x27;text&#x27;</span>], <span class="hljs-string">&#x27;emb&#x27;</span>: row[<span class="hljs-string">&#x27;emb&#x27;</span>]}
                       <span class="hljs-keyword">for</span> _, row <span class="hljs-keyword">in</span> group.iterrows()]
    })
<button class="copy-code-btn"></button></code></pre>
<p><strong>步驟 2：建立 Milvus 資料集</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
schema = client.create_schema()
schema.add_field(<span class="hljs-string">&quot;wiki_id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)

<span class="hljs-comment"># Define the Struct schema</span>
struct_schema = client.create_struct_field_schema()
struct_schema.add_field(<span class="hljs-string">&quot;text&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>)
struct_schema.add_field(<span class="hljs-string">&quot;emb&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)

schema.add_field(<span class="hljs-string">&quot;paragraphs&quot;</span>, DataType.ARRAY,
                 element_type=DataType.STRUCT,
                 struct_schema=struct_schema, max_capacity=<span class="hljs-number">200</span>)

client.create_collection(<span class="hljs-string">&quot;wiki_docs&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p><strong>步驟 3：插入資料並建立索引</strong></p>
<pre><code translate="no"><span class="hljs-meta"># Batch insert documents</span>
client.insert(<span class="hljs-string">&quot;wiki_docs&quot;</span>, wiki_data)

<span class="hljs-meta"># Create an HNSW index</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;paragraphs[emb]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
)
client.create_index(<span class="hljs-string">&quot;wiki_docs&quot;</span>, index_params)
client.load_collection(<span class="hljs-string">&quot;wiki_docs&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>步驟 4：搜尋文件</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Search query</span>
<span class="hljs-keyword">import</span> cohere
<span class="hljs-keyword">from</span> pymilvus.client.embedding_list <span class="hljs-keyword">import</span> EmbeddingList

<span class="hljs-comment"># The dataset uses Cohere&#x27;s multilingual-22-12 embedding model, so we must embed the query using the same model.</span>
co = cohere.Client(<span class="hljs-string">f&quot;&lt;&lt;COHERE_API_KEY&gt;&gt;&quot;</span>)
query = <span class="hljs-string">&#x27;Who founded Youtube&#x27;</span>
response = co.embed(texts=[query], model=<span class="hljs-string">&#x27;multilingual-22-12&#x27;</span>)
query_embedding = response.embeddings
query_emb_list = EmbeddingList()

<span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> query_embedding[<span class="hljs-number">0</span>]:
    query_emb_list.add(vec)

results = client.search(
    collection_name=<span class="hljs-string">&quot;wiki_docs&quot;</span>,
    data=[query_emb_list],
    anns_field=<span class="hljs-string">&quot;paragraphs[emb]&quot;</span>,
    search_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
        <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">200</span>, <span class="hljs-string">&quot;retrieval_ann_ratio&quot;</span>: <span class="hljs-number">3</span>}
    },
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;wiki_id&quot;</span>]
)

<span class="hljs-comment"># Results: directly return 10 full articles!</span>
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Article <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;wiki_id&#x27;</span>]}</span>: Score <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>比較輸出：傳統檢索 vs. 結構陣列</strong></p>
<p>當我們檢視資料庫實際回傳的內容時，結構陣列的影響就很明顯了：</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>維度</strong></th><th style="text-align:center"><strong>傳統方法</strong></th><th style="text-align:center"><strong>結構陣列</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>資料庫輸出</strong></td><td style="text-align:center"><strong>回傳前 100 個段落</strong>(冗餘度高)</td><td style="text-align:center"><em>回傳前 10 個完整的文件</em>- 乾淨且精確</td></tr>
<tr><td style="text-align:center"><strong>應用程式邏輯</strong></td><td style="text-align:center">需要<strong>分組、重複資料刪除和重新排序</strong>（複雜）</td><td style="text-align:center">不需要後處理 - 實體層級的結果直接來自 Milvus</td></tr>
</tbody>
</table>
<p>在維基百科的範例中，我們只展示了最簡單的情況：將段落向量結合為統一的文件表示。但 Array of Structs 的真正優勢在於它可以通用於<strong>任何</strong>多向量資料模型 - 無論是傳統的檢索管道或是現代的人工智能架構。</p>
<p><strong>傳統多向量檢索情境</strong></p>
<p>許多成熟的搜尋和推薦系統自然會在具有多個相關向量的實體上運作。Array of Structs 可輕鬆對應這些使用個案：</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>情境</strong></th><th style="text-align:center"><strong>資料模型</strong></th><th style="text-align:center"><strong>每個實體的向量</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">🛍️<strong>電子商務產品</strong></td><td style="text-align:center">一個產品 → 多個影像</td><td style="text-align:center">5-20</td></tr>
<tr><td style="text-align:center">🎬<strong>影片搜尋</strong></td><td style="text-align:center">一個視訊 → 多個片段</td><td style="text-align:center">20-100</td></tr>
<tr><td style="text-align:center">📖<strong>紙張檢索</strong></td><td style="text-align:center">一份論文 → 多個部分</td><td style="text-align:center">5-15</td></tr>
</tbody>
</table>
<p><strong>AI 模型工作量（關鍵多向量使用個案）</strong></p>
<p>在現代的 AI 模型中，Structs 的 Array 變得更加重要，這些模型會刻意為每個實體產生大量向量集，以進行細粒度的語意推理。</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>模型</strong></th><th style="text-align:center"><strong>資料模型</strong></th><th style="text-align:center"><strong>每個實體的向量</strong></th><th style="text-align:center"><strong>應用程式</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>ColBERT</strong></td><td style="text-align:center">一個文件 → 許多標記嵌入</td><td style="text-align:center">100-500</td><td style="text-align:center">法律文本、學術論文、細粒度文件檢索</td></tr>
<tr><td style="text-align:center"><strong>詞庫</strong></td><td style="text-align:center">一個 PDF 頁面 → 許多修補嵌入</td><td style="text-align:center">256-1024</td><td style="text-align:center">財務報告、合約、發票、多模式文件搜尋</td></tr>
</tbody>
</table>
<p>這些模式<em>需要</em>多向量的儲存模式。在使用 Array of Structs 之前，開發人員必須跨行分割向量，並將結果手動拼接回來。有了 Milvus，這些實體現在可以原生儲存與擷取，並由 MAX_SIM 自動處理文件層級的評分。</p>
<h3 id="2-ColPali-Image-Based-Document-Search" class="common-anchor-header">2.ColPali 影像式文件搜尋</h3><p><a href="https://zilliz.com/blog/colpali-enhanced-doc-retrieval-with-vision-language-models-and-colbert-strategy"><strong>ColPali</strong></a>是一個強大的跨模式 PDF 檢索模型。它不依賴文字，而是將每個 PDF 頁面視為一張圖片來處理，並將其切分成多達 1024 個可視化斑塊，每個斑塊產生一個嵌入。在傳統的資料庫模式下，這需要將單一頁面儲存為數百或數千個獨立的行，使得資料庫無法理解這些行屬於同一頁面。因此，實體層級的搜尋變得支離破碎且不切實際。</p>
<p>Array of Structs 將所有的 patch embeddings 儲存在<em>單一欄位中</em>，讓 Milvus 可以將頁面視為一個有凝聚力的多向量實體，乾淨地解決了這個問題。</p>
<p>傳統的 PDF 搜尋通常依賴<strong>OCR</strong>，將頁面影像轉換成文字。這種方式適用於純文字，但會遺失圖表、表格、排版和其他視覺提示。ColPali 可直接處理頁面影像，保留所有視覺和文字資訊，從而避免此限制。取捨是規模：現在每一頁面都包含數百個向量，這就需要一個資料庫能夠將許多嵌入聚合為一個實體 - 這正是 Array of Structs + MAX_SIM 所能提供的。</p>
<p>最常見的使用案例是<strong>Vision RAG</strong>，其中每個 PDF 頁面成為一個多向量實體。典型的情境包括</p>
<ul>
<li><p><strong>財務報告：</strong>在數以千計的 PDF 中搜尋包含特定圖表的頁面。</p></li>
<li><p><strong>合約：</strong>從掃描或拍照的法律文件中檢索條款。</p></li>
<li><p><strong>發票：</strong>依廠商、金額或版面尋找發票。</p></li>
<li><p><strong>簡報：</strong>尋找包含特定圖形或圖表的投影片。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Col_Pali_1daaab3c1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>資料模型：</strong></p>
<pre><code translate="no">{
    <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-built_in">int</span>,                     <span class="hljs-comment"># Page ID (primary key) </span>
    <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-built_in">int</span>,                 <span class="hljs-comment"># Page number within the document </span>
    <span class="hljs-string">&quot;doc_name&quot;</span>: VARCHAR,                <span class="hljs-comment"># Document name</span>
    <span class="hljs-string">&quot;patches&quot;</span>: ARRAY&lt;STRUCT&lt;            <span class="hljs-comment"># Array of patch objects</span>
        patch_embedding: FLOAT_VECTOR(<span class="hljs-number">128</span>)  <span class="hljs-comment"># Embedding for each patch</span>
    &gt;&gt;
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>步驟 1：準備資料</strong>有關 ColPali 如何將圖像或文字轉換為多向量表示法的詳細資訊，您可以參考說明文件。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> torch
<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image

<span class="hljs-keyword">from</span> colpali_engine.models <span class="hljs-keyword">import</span> ColPali, ColPaliProcessor

model_name = <span class="hljs-string">&quot;vidore/colpali-v1.3&quot;</span>

model = ColPali.from_pretrained(
    model_name,
    torch_dtype=torch.bfloat16,
    device_map=<span class="hljs-string">&quot;cuda:0&quot;</span>,  <span class="hljs-comment"># or &quot;mps&quot; if on Apple Silicon</span>
).<span class="hljs-built_in">eval</span>()

processor = ColPaliProcessor.from_pretrained(model_name)
<span class="hljs-comment"># Example: 2 documents, 5 pages each, total 10 images</span>
images = [
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image1.png&quot;</span>), 
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image2.png&quot;</span>), 
    ....
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image10.png&quot;</span>)
]
<span class="hljs-comment"># Convert each image into multiple patch embeddings</span>
batch_images = processor.process_images(images).to(model.device)
<span class="hljs-keyword">with</span> torch.no_grad():
    image_embeddings = model(**batch_images)
<button class="copy-code-btn"></button></code></pre>
<p><strong>步驟 2：建立 Milvus Collection</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
schema = client.create_schema()
schema.add_field(<span class="hljs-string">&quot;page_id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;page_number&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;doc_name&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">500</span>)

<span class="hljs-comment"># Struct Array for patches</span>
struct_schema = client.create_struct_field_schema()
struct_schema.add_field(<span class="hljs-string">&quot;patch_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">128</span>)

schema.add_field(<span class="hljs-string">&quot;patches&quot;</span>, DataType.ARRAY,
                 element_type=DataType.STRUCT,
                 struct_schema=struct_schema, max_capacity=<span class="hljs-number">2048</span>)

client.create_collection(<span class="hljs-string">&quot;doc_pages&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p><strong>步驟 3: 插入資料並建立索引</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Prepare data for insertion</span>
page_data=[
    {
        <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;doc_name&quot;</span>: <span class="hljs-string">&quot;Q1_Financial_Report.pdf&quot;</span>,
        <span class="hljs-string">&quot;patches&quot;</span>: [
            {<span class="hljs-string">&quot;patch_embedding&quot;</span>: emb} <span class="hljs-keyword">for</span> emb <span class="hljs-keyword">in</span> image_embeddings[<span class="hljs-number">0</span>]
        ],
    },
    ...,
    {
        <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-number">9</span>,
        <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-number">4</span>,
        <span class="hljs-string">&quot;doc_name&quot;</span>: <span class="hljs-string">&quot;Product_Manual.pdf&quot;</span>,
        <span class="hljs-string">&quot;patches&quot;</span>: [
            {<span class="hljs-string">&quot;patch_embedding&quot;</span>: emb} <span class="hljs-keyword">for</span> emb <span class="hljs-keyword">in</span> image_embeddings[<span class="hljs-number">9</span>]
        ],
    },
]

client.insert(<span class="hljs-string">&quot;doc_pages&quot;</span>, page_data)

<span class="hljs-comment"># Create index</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;patches[patch_embedding]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_IP&quot;</span>,
    params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">32</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
)
client.create_index(<span class="hljs-string">&quot;doc_pages&quot;</span>, index_params)
client.load_collection(<span class="hljs-string">&quot;doc_pages&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>步驟 4：跨模式搜尋：文字查詢 → 影像結果</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Run the search</span>
<span class="hljs-keyword">from</span> pymilvus.client.embedding_list <span class="hljs-keyword">import</span> EmbeddingList

queries = [
    <span class="hljs-string">&quot;quarterly revenue growth chart&quot;</span>    
]
<span class="hljs-comment"># Convert the text query into a multi-vector representation</span>
batch_queries = processor.process_queries(queries).to(model.device)
<span class="hljs-keyword">with</span> torch.no_grad():
    query_embeddings = model(**batch_queries)

query_emb_list = EmbeddingList()
<span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> query_embeddings[<span class="hljs-number">0</span>]:
    query_emb_list.add(vec)
results = client.search(
    collection_name=<span class="hljs-string">&quot;doc_pages&quot;</span>,
    data=[query_emb_list],
    anns_field=<span class="hljs-string">&quot;patches[patch_embedding]&quot;</span>,
    search_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_IP&quot;</span>,
        <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">100</span>, <span class="hljs-string">&quot;retrieval_ann_ratio&quot;</span>: <span class="hljs-number">3</span>}
    },
    limit=<span class="hljs-number">3</span>,
    output_fields=[<span class="hljs-string">&quot;page_id&quot;</span>, <span class="hljs-string">&quot;doc_name&quot;</span>, <span class="hljs-string">&quot;page_number&quot;</span>]
)


<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Query: &#x27;<span class="hljs-subst">{queries[<span class="hljs-number">0</span>]}</span>&#x27;&quot;</span>)
<span class="hljs-keyword">for</span> i, hit <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results, <span class="hljs-number">1</span>):
    entity = hit[<span class="hljs-string">&#x27;entity&#x27;</span>]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;doc_name&#x27;</span>]}</span> - Page <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;page_number&#x27;</span>]}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   Score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>\n&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>樣本輸出：</strong></p>
<pre><code translate="no"><span class="hljs-title class_">Query</span>: <span class="hljs-string">&#x27;quarterly revenue growth chart&#x27;</span>
<span class="hljs-number">1.</span> Q1_Financial_Report.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">2</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.9123</span>

<span class="hljs-number">2.</span> Q1_Financial_Report.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">1</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.7654</span>

<span class="hljs-number">3.</span> <span class="hljs-title class_">Product</span>_Manual.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">1</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.5231</span>
<button class="copy-code-btn"></button></code></pre>
<p>在這裡，結果直接回傳完整的 PDF 頁面。我們不需要擔心底層的 1024 補丁嵌入，Milvus 會自動處理所有的聚合。</p>
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
    </button></h2><p>大多數向量資料庫將每個片段儲存為獨立的記錄，這表示應用程式在需要完整的文件、產品或頁面時，必須重新組合這些片段。Structs 陣列改變了這種情況。透過將標量、向量、文字和其他欄位結合為單一結構化物件，它允許一條資料庫行代表一個完整的端對端實體。</p>
<p>結果是簡單但強大的：過去需要在應用程式層中進行複雜的群組、遞減和重新排序的工作，現在都變成原生資料庫的功能。這正是向量資料庫的未來發展方向 - 更豐富的結構、更聰明的擷取和更簡單的管道。</p>
<p>如需更多關於 Array of Structs 和 MAX_SIM 的資訊，請參閱下列說明文件：</p>
<ul>
<li><a href="https://milvus.io/docs/array-of-structs.md">結構陣列 | Milvus 文件</a></li>
</ul>
<p>對最新 Milvus 的任何功能有問題或想要深入瞭解？加入我們的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 頻道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提交問題。您也可以透過<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 預約 20 分鐘的一對一課程，以獲得深入的了解、指導和問題解答。</p>
