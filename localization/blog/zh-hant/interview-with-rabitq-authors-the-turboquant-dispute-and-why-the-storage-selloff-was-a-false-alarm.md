---
id: >-
  interview-with-rabitq-authors-the-turboquant-dispute-and-why-the-storage-selloff-was-a-false-alarm.md
title: 專訪 RaBitQ 作者：TurboQuant 爭議與為何儲存設備大跌是個假警報
author: 'Cheng Long, Jianyang Gao, Li Liu'
date: 2026-4-17
cover: assets.zilliz.com/0415_updated_rabitq_interviewdocx_md_1_d5709718fc.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'RaBitQ, TurboQuant, vector quantization, Milvus, IVF_RABITQ'
meta_title: |
  RaBitQ Authors on the TurboQuant Vector Quantization Dispute
desc: RaBitQ 的作者回應 Google 的 TurboQuant 論文：基準失衡、錯誤歸因理論，以及為什麼儲存設備大跌是虛驚一場。
origin: >-
  https://milvus.io/blog/interview-with-rabitq-authors-the-turboquant-dispute-and-why-the-storage-selloff-was-a-false-alarm.md
---
<p>Google 的<a href="https://research.google/blog/turboquant-redefining-ai-efficiency-with-extreme-compression/">TurboQuant</a>論文宣稱對向量表示法有<strong>6 倍的壓縮、8 倍的速度提升以及近乎零的精確度損失</strong>。在這篇論文發表之後，記憶體和儲存設備股票大幅下跌，各大科技媒體也迅速將其變成頭條新聞。</p>
<p>市場的反應只是個開始。研究人員很快就開始詢問這篇論文的聲稱是否言過其實，以及它是否公平對待先前的工作，尤其是<a href="https://dl.acm.org/doi/10.1145/3654970">RaBitQ</a>。這場爭論讓<strong>向量量化</strong>再次成為焦點，部分原因是相同的基本概念現在在人工智能堆疊的兩個關鍵部分都很重要：<a href="https://zilliz.com/learn/vector-similarity-search">向量搜尋系統</a>和大型模型的 KV 快取壓縮。</p>
<p>為了瞭解技術爭論及其對生產系統的意義，我們訪問了新加坡<strong>南洋</strong>理工大學副教授兼 VectorDB@NTU 主管<strong>Cheng Long</strong>、RaBitQ 的第一作者<strong>Jianyang Gao</strong>，以及 Zilliz 工程總監<strong>Li Liu</strong>。對話內容涵蓋向量量化本身、圍繞 TurboQuant 所提出的問題，以及為什麼這對<a href="https://milvus.io/">Milvus</a>（最受<a href="https://milvus.io/">歡</a>迎的開放源<a href="https://zilliz.com/learn/what-is-vector-database">向量資料庫</a>）等系統和大規模向量檢索很重要。</p>
<p><strong><em>相關閱讀：</em></strong> <em>如果您想要了解工程方面而非採訪內容，請參閱我們的配套文章：</em> <a href="https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md"><em>向量量化如何影響 AI 基礎架構成本</em></a><em>。</em></p>
<h2 id="Why-did-vector-quantization-suddenly-become-such-a-big-topic" class="common-anchor-header">為什麼向量量化突然變成這麼大的話題？<button data-href="#Why-did-vector-quantization-suddenly-become-such-a-big-topic" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz：在我們進入爭議之前，您能不能先解釋一下什麼是向量量化，以及為什麼向量量化在 AI 中變得如此重要？</strong></p>
<p><strong>程龍：</strong>向量量化是一種<strong>資料壓縮</strong>與<strong>近似表示的</strong>技術。它最初來自於訊號處理，用於影像和音訊壓縮。在現代人工智能系統中，它的角色已經改變，因為向量已經成為計算的基本單位之一。</p>
<p>今天，它的重要性在兩個地方最為明顯。</p>
<p>其一是<strong>對擁有數十億甚至數百億向量的集合進行即時搜尋</strong>。在語意檢索系統中，核心任務是在高維向量上進行相似性搜尋。但是原始向量很大，浮點運算的成本很高。因此在規模上很難提供毫秒級的延遲。向量量化可將向量壓縮為低位元表示，並加速距離計算。這就是為什麼它對<a href="https://milvus.io/docs/single-vector-search.md">單向量搜尋</a>、<a href="https://milvus.io/docs/multi-vector-search.md">多向量搜尋和</a> <a href="https://milvus.io/docs/index-explained.md">Milvus 搜尋架構</a>中的索引設計等實際工作負載很重要。</p>
<p>另一個是針對大型模型的<strong>KV 快取壓縮</strong>。KV 快取可以減少產生過程中的冗餘計算，但記憶體成本會隨著上下文變長而快速增加。因此，問題就變成如何壓縮這些向量，而又不會對輸出品質造成太大的傷害。這也是向量量化的核心問題。</p>
<p><strong>Zilliz：如果向量量化的應用越來越廣泛，而且 TurboQuant 的結果也成立的話，這是否意味著儲存需求會大幅下降？</strong></p>
<p><strong>高健陽：</strong>在相同的模型和相同的工作負載下，壓縮可以降低儲存需求。但這並不能證明人們所得出的廣泛結論是正確的。</p>
<p>TurboQuant 所說的<strong>6 倍壓縮</strong>和<strong>8 倍速度提升</strong>，是以基本的<strong>16 位元/32 位元基線</strong>做比較。這與與同類型的其他方法比較並不相同。因此，真正的效果仍需要更仔細地評估。</p>
<p><strong>Zilliz：那麼從這個角度來看，如果市場的反應真的是關於技術本身的話，那它是否應該更早發生，在類似想法已經出現的時候？</strong></p>
<p><strong>程龍：</strong>從技術角度來看，你可以說類似的理論領域之前已經出現了。但市場與研究並非同步發展。學術成果、工程採用和金融詮釋之間通常會有一個滯後期。</p>
<p>而且在更長的時間內，效果甚至可能不是線性的。壓縮可以讓大型模型在較小的裝置上執行成為可能，這可以創造新的需求，而不只是減少需求。技術與市場之間的關係比直線推斷更為複雜。</p>
<h2 id="How-did-RaBitQ-emerge-and-what-did-it-contribute" class="common-anchor-header">RaBitQ 是如何出現的，又有什麼貢獻？<button data-href="#How-did-RaBitQ-emerge-and-what-did-it-contribute" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz：您最初是如何萌生 RaBitQ 這個想法的？</strong></p>
<p><strong>高健陽：</strong>我們是從向量資料庫的缺口開始的。傳統的方法，例如<a href="https://milvus.io/docs/ivf-pq.md">乘積量化（Product Quantization</a>），在經驗上運作良好，但在理論上卻沒有什麼保證。</p>
<p>當時，我正在 NTU 新加坡分校學習高維概率，這讓我開始思考，我們是否可以建立一個不僅實用，而且有明確理論保證的方法。這就是 RaBitQ 的起點。</p>
<p><strong>Zilliz：您認為 RaBitQ 的核心創意是什麼？</strong></p>
<p><strong>高健陽：</strong>它的關鍵想法是使用隨機旋轉，也就是 Johnson-Lindenstrauss 變換，讓向量坐標的分佈更均勻，更可預測。</p>
<p>一旦你有了這個方法，你就可以在上面推導出一個最佳量化估計器。然後，我們給出了一個嚴格的證明，證明它達到了理論上的下限。</p>
<p>早期的工作也曾嘗試引入隨機旋轉。但從我們的角度來看，由於演算法設計上的實際問題，那些方法並沒有達到我們想要的效果。</p>
<p><strong>Zilliz: 從工程的角度來看，RaBitQ 最讓您印象深刻的是什麼？</strong></p>
<p><strong>劉力：</strong>我們曾經使用過許多量化演算法，從<a href="https://milvus.io/docs/ivf-sq8.md">標量量化方法</a>到 PQ 及其他變體。RaBitQ 的突出之處在於它改變了人們處理問題的方式。</p>
<p>在此之前，這個領域的很多東西仍然是相當經驗化的。您可以說某種方法似乎行得通，但卻很難解釋清楚原因。RaBitQ 用一種更加數學化的方式來處理問題。從某種意義上說，這種方法感覺優雅而簡單。這種思考方式影響了很多後來的工作。</p>
<p><strong>Zilliz：簡單來說，它能節省多少記憶和成本？</strong></p>
<p><strong>劉力：</strong>在同樣的回復層面上，從 4 位元壓縮轉換到 2 位元壓縮，可以減少一半的記憶體使用。</p>
<p>這不僅僅是壓縮的問題。它的效能與早期的方法相比毫不遜色，這在團隊同時重視記憶體效率和檢索品質的生產環境中非常重要。這就是為什麼它對需要平衡<a href="https://milvus.io/docs/dense-vector.md">密集向量儲存</a>、吞吐量和回溯的系統很重要。</p>
<p><strong>Zilliz：除了 Milvus 之外，您認為 RaBitQ 目前的應用範圍在哪裡？</strong></p>
<p><strong>程龍：</strong>首先，我要感謝 Milvus 團隊，因為他們是最早採用 RaBitQ 的團隊之一。一路上我們也進行了很多討論和一些合作研究。</p>
<p>RaBitQ 也被其他一些系統所採用，包括 Meta 的 FAISS、VSAG、VectorChord、Volcengine OpenSearch、CockroachDB、ElasticSearch、Lucene 和 turbopuffer。在 Milvus 方面最突出的是，該團隊在<a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a> 中將<a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQ</a>列為真正的索引選項，同時還進行了更廣泛的工作，包括<a href="https://milvus.io/docs/manage-collections.md">集合管理</a>、<a href="https://milvus.io/docs/ivf-flat.md">基於 IVF 的索引</a>和<a href="https://milvus.io/docs/hnsw.md">基於 HNSW 的索引</a>。</p>
<h2 id="How-should-we-evaluate-TurboQuant" class="common-anchor-header">我們應該如何評估 TurboQuant？<button data-href="#How-should-we-evaluate-TurboQuant" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz：在您的公開回覆中，您說 TurboQuant 有一些嚴重的問題。在您看來，主要是哪些問題？</strong></p>
<p><strong>高健陽：</strong>我們認為主要有三個問題。</p>
<p>一是論文描述先前工作和討論重疊的方式。TurboQuant 論文錯誤地描述了 RaBitQ 的方法，忽略了最相似的部分，例如 Johnson-Lindenstrauss Transformation。另一個是論文描述理論結果的方式。它將 RaBitQ 描述為次優，卻沒有提供任何解釋或證據，但事實上 RaBitQ 是最佳的。第三是實驗比較的公平性。他們用單核 CPU 來評估 RaBitQ，而用 A100 GPU 來評估 TurboQuant。</p>
<p><strong>Zilliz：先談基準問題。為什麼您認為比較不公平？</strong></p>
<p><strong>高健陽：</strong>只有當設定具有可比性時，基準聲稱才有意義。如果一個系統是在非常不同的硬體或軟體環境下進行測試，那麼結果反映的可能是設定而非演算法本身。</p>
<p>在我們看來，處理器選擇、實作語言和最佳化程度的差異可能會造成很大的差異。這就是為什麼基準方法需要非常小心詮釋的原因，尤其是建立生產性檢索系統的團隊。</p>
<p><strong>程龍：</strong>這篇論文還提出了其他一些不成立的說法。</p>
<p>例如，論文說<strong>RaBitQ 不能被向量化</strong>。但在 2024 年的論文發表時，RaBitQ 已經開放了基於 SIMD 的向量化計算程式碼。所以從我們的角度來看，那種說法與事實不符。</p>
<p>另外值得一提的是，我們去年開始與 NVIDIA 合作，並完成了 RaBitQ 的 GPU 實作。相關程式碼正在審核中，以納入 NVIDIA 的 cuVS 程式庫。</p>
<p><strong>Zilliz：Milvus 在 2025 年下半年評估過 TurboQuant，但沒有採用。您的團隊在測試中看到了什麼？</strong></p>
<p><strong>劉力：</strong>它確實包含一個有用的想法。在我們看來，它對量化網格的分配方式做了一個小小的優化。但該方法中最重要的一步 - 使用隨機旋轉進行量化 - 是由 RaBitQ 首次提出的。</p>
<p>而說到無偏估算，RaBitQ 的方法更乾淨，理論推導也更有力。</p>
<p>雖然如此，因為這是 Google 的成果，所以我們在 2025 年進行了測試。在我們的實驗室中，在標準化的 CPU 環境下，TurboQuant 在我們評估的大多數情況下，都沒有優於我們內部的 RaBitQ 版本。因此，當市場反應如此強烈時，我們真的感到非常驚訝。</p>
<p><strong>Zilliz：對於沒有仔細閱讀這兩篇論文的讀者，您能用簡單的語言說明 RaBitQ 和 TurboQuant 重疊的地方嗎？</strong></p>
<p><strong>劉力：</strong>從高層次來看，兩種方法都從<strong>隨機旋轉</strong>開始。在數學上，這表示向量要乘以隨機正交矩陣。你可以把它想像成在高維空間中改變你的觀察角度。它不會改變資料點的相對位置，但卻能讓資訊更平均地分布在不同的維度上。</p>
<p>之後就是<strong>量化</strong>。您將連續的實值空間分割成<strong>2^k 個網格</strong>，其中<strong>k</strong>是量化位元的數目，然後將每個向量元素映射到鄰近的網格點。TurboQuant 在這裡做了一個小小的調整，根據資料的分佈來分配網格，而不是平均分配。</p>
<p>最後一個步驟是<strong>誤差估算</strong>，這也是 RaBitQ 的主要貢獻所在。傳統的方法是直接從量化值計算，這使得誤差更難控制。RaBitQ 能更精確地估計量化誤差，這也是其數學最佳化的來源。TurboQuant 的解決方案比較複雜，而且在我們的設定中，折衷看起來沒有那麼吸引人。</p>
<h2 id="Why-is-attribution-so-hard-to-resolve-in-practice" class="common-anchor-header">為什麼在實踐中很難解決歸屬問題？<button data-href="#Why-is-attribution-so-hard-to-resolve-in-practice" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz：</strong>在您發表了您的公開聲明之後，Google 和 ICLR 是如何回應的？</p>
<p><strong>程龍：</strong>ICLR 沒有採取行動。我們在去年九月的審查期間發電子郵件給他們，但沒有收到回覆。我們在今年三月再次寫信，並被告知要在 OpenReview 上發表評論，但除此之外就沒有任何行動了。</p>
<p>至於 Google，其中一位合著者在幾天前回覆了我們。回覆中說他們會修改 arXiv 的版本，以糾正其對 RaBitQ 最佳性的不準確描述。</p>
<p><strong>Zilliz:</strong>早前的討論是圍繞學術不端行為。現在聽起來也像是一個不平衡的問題，以及誰能塑造故事的問題。為什麼為自己的工作辯護如此困難？</p>
<p><strong>程龍：</strong>一個問題是規模。現在的人工智慧會議規模非常大，單單一個週期就可以帶來數萬篇論文。主辦單位根本沒有能力處理所有這類的爭議。</p>
<p>另一個問題是不平衡。大公司有更強大的公眾聲音。獨立研究人員或較小的團隊就沒有這樣的溝通能力。</p>
<p><strong>高健陽：</strong>對個人而言，成本極高。最近幾周，我和龍教授幾乎無法正常工作。</p>
<p>這個過程本身也令人沮喪。我們與作者聯繫時被堅決拒絕，會議主辦單位也沒有給我們任何回復。實際上，很多研究人員看到這樣的情況，都會決定放棄。但很多原創性的貢獻也是這樣從大眾的敘述中消失的。</p>
<p><strong>Zilliz:</strong>聽起來，這好像不是你們團隊第一次遇到這種問題。</p>
<p><strong>程龍：</strong>不，不是。</p>
<p>我們以前也見過這樣的情況，有些公司採用 RaBitQ，做一些工程上的修改，給它一個新名字，然後只把它描述成受 RaBitQ 啟發的東西。</p>
<p>這就是為什麼我很欣賞一些業界團隊處理這個問題的方式，包括 Milvus。當他們使用 RaBitQ 時，他們會客觀地描述它。當他們在原始版本之外加入優化功能時，他們會清楚地解釋那是他們自己的工程貢獻。這樣既對原始工作給予了適當的肯定，同時也展現了公司的技術實力。</p>
<p><strong>Zilliz：</strong>大公司在學術工作的基礎上，通常會提供任何財務分享或利益分配嗎？</p>
<p><strong>高健陽：</strong>在大多數情況下，不會。</p>
<p>儘管如此，大公司仍有強烈的誘因，將技術進步說成是他們自己創造的，而不是從別人那裡採納的。每個人都希望客戶和投資人看到最先進的作品是自己團隊的創新成果。</p>
<h2 id="What-comes-next-for-vector-quantization" class="common-anchor-header">向量量化的下一步是什麼？<button data-href="#What-comes-next-for-vector-quantization" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz：</strong>您現在的研究方向是什麼？</p>
<p><strong>程龍：</strong>我們很大一部分的工作仍將集中在向量檢索上。</p>
<p>其中一個方向是將 RaBitQ 與不同的向量檢索索引結合，例如 IVF 和 HNSW，這樣系統就能以更低的延遲、更高的並發性和更低的成本支援更大型的資料。我也在關注 KV 快取壓縮。</p>
<p><strong>高健陽</strong>大型模型中的 KV 快取和向量檢索在數學上和系統層級上有許多相同的特性，因為兩者都是處理高維向量。</p>
<p>展望未來，我想更多思考如何應用數學工具，包括高維概率的想法，來加速推論和訓練。</p>
<p><strong>Zilliz：</strong>向量量化作為一個領域的天花板在哪裡？還有多少提升的空間？</p>
<p><strong>程龍：</strong>從理論的角度來看，天花板大致上就在眼前。RaBitQ 已經是近似最佳了。</p>
<p>但在工程方面仍有很大的空間。您仍需處理硬體特性、資料分佈、延遲限制，以及許多其他實際因素。這正是為什麼生產系統仍需要在<a href="https://milvus.io/docs/architecture_overview.md">分散式向量資料庫架構</a>、<a href="https://milvus.io/docs/sparse_vector.md">稀疏向量支援</a>、<a href="https://milvus.io/docs/reranking.md">重排管道</a>以及<a href="https://milvus.io/docs/metric.md">Milvus 距離度量</a>中的度量選擇等領域進行仔細的工作。</p>
<h2 id="Keep-Reading" class="common-anchor-header">繼續閱讀<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
    </button></h2><p>如果您想深入探究 RaBitQ 的工程方面以及它如何融入 Milvus，這些是最相關的資源：</p>
<ul>
<li><a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQ 文件</a>- 配置細節和調整指南。</li>
<li><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md">RaBitQ 整合深入探討</a>- Milvus 如何將 RaBitQ 轉變為生產索引。</li>
<li><a href="https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md">向量量化如何影響 AI 基礎架構成本</a>- 我們對 TurboQuant-RaBitQ 討論的廣泛分析。</li>
<li><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6 發佈文章</a>- IVF_RABITQ 成為真正的 Milvus 索引選項。</li>
<li><a href="https://milvus.io/docs/index-explained.md">Milvus 索引解釋</a>- IVF_RABITQ 如何與其他索引選擇配合。</li>
<li><a href="https://milvus.io/docs/ivf-flat.md">IVF_FLAT 索引</a>和<a href="https://milvus.io/docs/hnsw.md">HNSW 索引</a>- 如果您要比較索引的取捨，這是很有用的基準。</li>
<li><a href="https://milvus.io/docs/schema.md">Milvus 中的模式設計</a>與<a href="https://milvus.io/docs/filtered-search.md">篩選搜尋</a>- 如果您要在實際應用程式中評估 RaBitQ，而非單獨評估，這將非常有用。</li>
<li><a href="https://milvus.io/docs/quickstart.md">Milvus 快速入門</a>和<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG 系統設計</a>- 如果您想在檢索管道中試用，這將會很有幫助。</li>
</ul>
<p>加入<a href="https://slack.milvus.io/">Milvus Slack 社群</a>或<a href="https://milvus.io/office-hours">預約 Milvus Office Hours</a>，如果您想討論您的工作量。</p>
<p>如果您想跳過基礎架構設定，您可以<a href="https://cloud.zilliz.com/signup">註冊 Zilliz Cloud</a>(完全管理 Milvus) 。</p>
