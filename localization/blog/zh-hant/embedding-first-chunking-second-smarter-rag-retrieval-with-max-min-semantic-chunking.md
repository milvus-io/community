---
id: >-
  embedding-first-chunking-second-smarter-rag-retrieval-with-max-min-semantic-chunking.md
title: 先嵌入，後分塊：使用最大最小語意分塊進行更聰明的 RAG 檢索
author: Rachel Liu
date: 2025-12-24T00:00:00.000Z
cover: assets.zilliz.com/maxmin_cover_8be0b87409.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Max–Min Semantic Chunking, Milvus, RAG, chunking strategies'
meta_title: |
  Max–Min Semantic Chunking: Top Chunking Strategy to Improve RAG Performance
desc: >-
  瞭解 Max-Min Semantic Chunking 如何使用嵌入為先的方法來提升 RAG
  準確度，以建立更聰明的分塊、改善上下文品質，並提供更好的檢索效能。
origin: >-
  https://milvus.io/blog/embedding-first-chunking-second-smarter-rag-retrieval-with-max-min-semantic-chunking.md
---
<p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval Augmented Generation (RAG)</a>已經成為提供 AI 應用程式上下文和記憶的預設方法 - AI 代理、客戶支援助理、知識庫和搜尋系統都仰賴它。</p>
<p>在幾乎所有的 RAG 輸送管道中，標準流程都是一樣的：取用文件、將文件分割成小塊，然後將這些小塊嵌入<a href="https://milvus.io/">Milvus</a> 等向量資料庫中進行相似性檢索。由於<strong>分塊</strong>是在事前進行的，因此這些分塊的品質會直接影響系統擷取資訊的效能以及最終答案的精確度。</p>
<p>問題在於傳統的分塊策略通常是在沒有任何語意理解的情況下分割文字。固定長度的分塊是根據標記數量來進行切割，而遞迴分塊則使用表面層級的結構，但兩者都仍然忽略了文字的實際意義。因此，相關的想法往往會被分開，不相關的句子會被組合在一起，而重要的上下文則會被分割得支離破碎。</p>
<p>在這篇部落格中，我想分享一種不同的分塊策略：<a href="https://link.springer.com/article/10.1007/s10791-025-09638-7"><strong>最大最小語意分塊</strong></a>。它不是先切分塊，而是先嵌入文字，並使用語義相似性來決定邊界應該在哪裡形成。透過先嵌入再切割的方式，管道可以追蹤意義的自然轉換，而不是依賴任意的長度限制。</p>
<h2 id="How-a-Typical-RAG-Pipeline-Works" class="common-anchor-header">典型的 RAG 管道如何運作<button data-href="#How-a-Typical-RAG-Pipeline-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>不論是何種框架，大多數 RAG 管道都遵循相同的四階段組裝線。您可能自己也寫過某些版本：</p>
<h3 id="1-Data-Cleaning-and-Chunking" class="common-anchor-header">1.資料清理與分塊</h3><p>流水線會先清理原始文件：移除頁眉、頁腳、導覽文字，以及任何非實際內容的東西。清除雜訊之後，文字會被分割成較小的片段。大多數團隊使用固定大小的區塊 - 通常是 300-800 個記號 - 因為這樣可以保持嵌入模型的可管理性。缺點是分割是基於長度而非意義，因此邊界可以是任意的。</p>
<h3 id="2-Embedding-and-Storage" class="common-anchor-header">2.嵌入與儲存</h3><p>然後使用嵌入模型（如 OpenAI 的 <a href="https://zilliz.com/ai-models/text-embedding-3-small"><code translate="no">text-embedding-3-small</code></a>或 BAAI 的編碼器。產生的向量會儲存在向量資料庫中，例如<a href="https://milvus.io/">Milvus</a>或<a href="https://zilliz.com/cloud">Zilliz Cloud</a>。資料庫會處理索引和相似性搜尋，因此您可以快速地將新的查詢與所有儲存的資料塊進行比較。</p>
<h3 id="3-Querying" class="common-anchor-header">3.查詢</h3><p>當使用者提出問題時，例如<em>「RAG 如何減少幻覺？</em>- 系統會嵌入查詢並將其發送至資料庫。資料庫會回傳向量與查詢最接近的前 K 個資料塊。這些就是模型回答問題所依賴的文字片段。</p>
<h3 id="4-Answer-Generation" class="common-anchor-header">4.答案產生</h3><p>擷取到的資料塊與使用者的查詢捆綁在一起，並輸入 LLM。模型會使用所提供的上下文作為基礎來產生答案。</p>
<p><strong>分塊是整個流程的起點，但它的影響卻非常大</strong>。如果分塊與文字的自然含義一致，檢索就會感到精確和一致。如果分塊被切到尷尬的地方，即使有強大的嵌入和快速的向量資料庫，系統也很難找到正確的資訊。</p>
<h3 id="The-Challenges-of-Getting-Chunking-Right" class="common-anchor-header">正確處理分塊的挑戰</h3><p>目前大多數的 RAG 系統都使用兩種基本的分塊方法之一，這兩種方法都有其限制。</p>
<p><strong>1.固定大小的分塊</strong></p>
<p>這是最簡單的方法：以固定的符記或字元數分割文字。此方法快速且可預測，但完全不考慮文法、主題或轉場。句子可能會被切成兩半。有時甚至是單字。您從這些分塊中得到的嵌入往往是嘈雜的，因為邊界無法反映文字實際的結構。</p>
<p><strong>2.遞歸字元分割</strong></p>
<p>這種方法比較聰明。它會根據段落、換行符或句子等提示，分層分割文字。如果某部分太長，它會遞歸地將其進一步分割。輸出一般較為連貫，但仍不一致。有些文件缺乏明確的結構或部分長度不均勻，這會損害檢索的準確性。而且在某些情況下，這種方法產生的片段仍會超出模型的上下文視窗。</p>
<p>這兩種方法都面臨同樣的取捨問題：精確度與上下文。較小的資料塊可以提高檢索精確度，但卻會失去周遭的上下文；較大的資料塊則可以保留其意義，但卻有可能增加不相關的雜訊。在 RAG 系統設計中，如何取得適當的平衡是分塊技術的基礎，也是令人沮喪的地方。</p>
<h2 id="Max–Min-Semantic-Chunking-Embed-First-Chunk-Later" class="common-anchor-header">最大最小語意分塊：先嵌入，後分塊<button data-href="#Max–Min-Semantic-Chunking-Embed-First-Chunk-Later" class="anchor-icon" translate="no">
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
    </button></h2><p>2025 年，S.R. Bhat 等人發表了<a href="https://arxiv.org/abs/2505.21700"><em>Rethinking Chunk Size for Long-Document Retrieval：多資料集分析</em></a>》。他們的主要發現之一是 RAG 並沒有單一<strong>「最佳」的</strong>分塊大小。小塊（64-128 個字元）傾向於對事實或查詢式問題更有效，而大塊（512-1024 個字元）則有助於敘事或高層次推理任務。換句話說，固定大小的分塊總是一種折衷。</p>
<p>這就自然而然地提出了一個問題：與其選擇一種長度並寄望於最好的結果，我們是否可以根據意義而不是大小來進行分塊？<a href="https://link.springer.com/article/10.1007/s10791-025-09638-7"><strong>最大最小語意分塊（Max-Min Semantic Chunking</strong></a>）正是我發現的一種嘗試這樣做的方法。</p>
<p>這個想法很簡單：<strong>先嵌入，後分塊</strong>。這種演算法不是先分割文字，然後再嵌入掉出來的任何片段，而是先嵌入<em>所有的句子</em>。然後它會使用這些句子嵌入之間的語意關係來決定邊界的位置。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/embed_first_chunk_second_94f69c664c.png" alt="Diagram showing embed-first chunk-second workflow in Max-Min Semantic Chunking" class="doc-image" id="diagram-showing-embed-first-chunk-second-workflow-in-max-min-semantic-chunking" />
   </span> <span class="img-wrapper"> <span>Max-Min Semantic Chunking（最大最小语义分块）中的 「先嵌入，后分块」（embed-first chunk-second）工作流程示意图</span> </span></p>
<p>在概念上，這種方法將分块視為嵌入空間中的受限聚類問題。您按順序瀏覽文件，每次瀏覽一個句子。對於每個句子，演算法都會比較其嵌入與目前分塊中的嵌入。如果新的句子在語義上足夠接近，它就會加入該語塊。如果相差太遠，演算法就會開始一個新的片段。關鍵的限制是語塊必須遵循原始句子的順序 - 不能重新排序，也不能進行全局聚類。</p>
<p>其結果是一套可變長度的語意區塊，反映出文件意義的實際變化，而不是字元計數器碰巧打到零的地方。</p>
<h2 id="How-the-Max–Min-Semantic-Chunking-Strategy-Works" class="common-anchor-header">Max-Min 語意分塊策略如何運作<button data-href="#How-the-Max–Min-Semantic-Chunking-Strategy-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Max-Min Semantic Chunking（最大最小语义分块）通过比较句子在高维向量空间中的相互关系来确定分块边界。它不依賴於固定的長度，而是觀察語義在整個文件中如何轉換。這個過程可以分成六個步驟：</p>
<h3 id="1-Embed-all-sentences-and-start-a-chunk" class="common-anchor-header">1.嵌入所有句子並開始一個大塊</h3><p>嵌入模型會將文件中的每個句子轉換成向量嵌入。它會依序處理句子。如果前<em>n-k 個</em>句子組成目前的 chunk C，則需要評估下列句子 (sₙ₋ₖ₊₁) ：它應該加入 C，還是開始一個新的 chunk？</p>
<h3 id="2-Measure-how-consistent-the-current-chunk-is" class="common-anchor-header">2.測量目前時段的一致性</h3><p>在片段 C 中，計算所有句子嵌入之間最小的成對余弦相似度。此值反映了語料塊內的句子之間的關係有多密切。最小相似度越低，表示句子之間的關係越少，這表示可能需要分割該語塊。</p>
<h3 id="3-Compare-the-new-sentence-to-the-chunk" class="common-anchor-header">3.將新句子與句群進行比較</h3><p>接下來，計算新句子與 C 中已有句子之間的最大余弦相似度。</p>
<h3 id="4-Decide-whether-to-extend-the-chunk-or-start-a-new-one" class="common-anchor-header">4.決定是擴展語料塊還是開始一個新的語料塊</h3><p>這是核心規則：</p>
<ul>
<li><p>如果<strong>新句子</strong>與語料塊<strong>C</strong> <strong>的最大相似</strong> <strong>度大於或等於</strong>語料塊<strong>C 內的最小相似度</strong>，→新句子適合並留在語料塊中。</p></li>
<li><p>否則，→ 開始一個新的語塊。</p></li>
</ul>
<p>這可確保每個語元保持其內部語義的一致性。</p>
<h3 id="5-Adjust-thresholds-as-the-document-changes" class="common-anchor-header">5.隨著文件變化調整臨界值</h3><p>為了優化分塊品質，可以動態調整分塊大小和相似性閾值等參數。這可讓演算法適應不同的文件結構和語意密度。</p>
<h3 id="6-Handle-the-first-few-sentences" class="common-anchor-header">6.處理前幾個句子</h3><p>當一個 chunk 只包含一個句子時，演算法會使用固定的相似性臨界值來處理第一次比較。如果句子 1 和句子 2 之間的相似度高於該臨界值，它們就會形成一個語塊。如果不高，則立即分割。</p>
<h2 id="Strengths-and-Limitations-of-Max–Min-Semantic-Chunking" class="common-anchor-header">最大最小語意分塊的優勢和限制<button data-href="#Strengths-and-Limitations-of-Max–Min-Semantic-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><p>Max-Min Semantic Chunking（最大最小語意分塊）透過使用意義來取代長度，改善了 RAG 系統分割文字的方式，但它並非萬靈丹。下面我們將實際地看看它的優點和不足之處。</p>
<h3 id="What-It-Does-Well" class="common-anchor-header">它的優點</h3><p>Max-Min Semantic Chunking 在三個重要方面改進了傳統的分塊技術：</p>
<h4 id="1-Dynamic-meaning-driven-chunk-boundaries" class="common-anchor-header"><strong>1.動態、意義驅動的分塊邊界</strong></h4><p>與固定大小或基於結構的方法不同，這種方法依靠語義相似性來引導分塊。它會比較目前分塊內的最小相似度（它的內聚程度）和新句子與該分塊之間的最大相似度（它的匹配程度）。如果後者較高，則該句子會加入該語塊；否則，就會開始一個新語塊。</p>
<h4 id="2-Simple-practical-parameter-tuning" class="common-anchor-header"><strong>2.簡單實用的參數調整</strong></h4><p>該演算法僅取決於三個核心超參數：</p>
<ul>
<li><p><strong>最大分塊大小</strong>、</p></li>
<li><p>前兩個句子之間的<strong>最小相似度</strong>，以及</p></li>
<li><p>新增句子的<strong>相似度臨界值</strong>。</p></li>
</ul>
<p>這些參數會隨著上下文自動調整，較大的語塊需要較嚴格的相似性臨界值來維持一致性。</p>
<h4 id="3-Low-processing-overhead" class="common-anchor-header"><strong>3.低處理開銷</strong></h4><p>由於 RAG 管道已經計算了句子嵌入，因此 Max-Min Semantic Chunking 不會增加繁重的計算。它所需要的只是在掃描句子時進行一組余弦相似性檢查。這使得它比許多需要額外模型或多階段聚類的語意分塊技術更便宜。</p>
<h3 id="What-It-Still-Can’t-Solve" class="common-anchor-header">仍無法解決的問題</h3><p>Max-Min Semantic Chunking（最大最小語意分塊）改善了分塊邊界，但並沒有消除文件分割的所有挑戰。由於該演算法是依序處理句子，而且僅在局部進行聚類，因此仍可能遺漏較長或較複雜文件中的長距離關係。</p>
<p>一個常見的問題是<strong>上下文分割</strong>。當重要的資訊分散在文件的不同部分時，演算法可能會將這些片段分為不同的區塊。這樣，每個片段就只能承載部分意義。</p>
<p>例如，在 Milvus 2.4.13 發行紀錄中，如下圖所示，一個區塊可能包含版本識別碼，而另一個區塊則包含功能清單。像<em>「Milvus 2.4.13 中引入了哪些新功能？」</em>這樣的查詢就取決於兩者。如果這些細節被分割在不同的區塊中，嵌入模型可能無法將它們連接起來，導致擷取能力減弱。</p>
<ul>
<li>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/v2413_a98e1b1f99.png" alt="Example showing context fragmentation in Milvus 2.4.13 Release Notes with version identifier and feature list in separate chunks" class="doc-image" id="example-showing-context-fragmentation-in-milvus-2.4.13-release-notes-with-version-identifier-and-feature-list-in-separate-chunks" />
   </span> <span class="img-wrapper"> <span>顯示 Milvus 2.4.13 發行紀錄中上下文分割的範例，版本識別符和功能清單分開在不同的區塊中</span> </span></li>
</ul>
<p>這種分割也會影響 LLM 的產生階段。如果版本參考在一個 chunk 中，而功能描述在另一個 chunk 中，模型就會接收到不完整的上下文，無法清楚推理兩者之間的關係。</p>
<p>為了減輕這些情況，系統通常會使用滑動視窗、重疊分區邊界或多通道掃描等技術。這些方法可重新引入部分遺失的上下文、減少破碎化，並協助擷取步驟保留相關資訊。</p>
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
    </button></h2><p>最大最小語意分塊（Max-Min Semantic Chunking）並不是解決所有 RAG 問題的靈丹妙藥，但它確實給了我們一種更理智的方式來思考分塊邊界。它並不是讓標記限制來決定在哪個地方會被切分，而是使用嵌入（embeddings）來偵測意義實際上在哪個地方發生了轉變。對於許多真實世界的文件 -API、規格、日誌、發行記錄、疑難排解指南 - 單是這一點就能顯著提升檢索品質。</p>
<p>我喜歡這種方法的地方在於它可以自然地融入現有的 RAG 管道。如果您已經嵌入句子或段落，額外的成本基本上就是幾個余弦相似性檢查。您不需要額外的模型、複雜的聚類或重量級的預處理。當這種方法奏效時，它所產生的資料塊會讓「人」感覺更強，更接近我們在閱讀時將資訊分類的方式。</p>
<p>但這種方法仍有盲點。它只能看到局部的意義，而且無法重新連接故意分散的資訊。重疊視窗、多路掃描以及其他保留上下文的技巧仍然是必要的，尤其是對於參考文獻和說明彼此相距甚遠的文件。</p>
<p>不過，Max-Min Semantic Chunking 仍然讓我們朝正確的方向前進：擺脫任意的文字切片，邁向真正尊重語意的檢索管道。如果您正在探索讓 RAG 更為可靠的方法，它是值得一試的。</p>
<p>有問題或想深入瞭解如何改善 RAG 效能？加入我們的<a href="https://discord.com/invite/8uyFbECzPX">Discord</a>，與每天都在建立和調整真實檢索系統的工程師們交流。</p>
