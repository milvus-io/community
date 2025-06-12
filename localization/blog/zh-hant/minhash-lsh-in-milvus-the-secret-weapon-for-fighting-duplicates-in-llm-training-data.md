---
id: >-
  minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md
title: Milvus 中的 MinHash LSH：對抗 LLM 訓練資料中重複資料的秘密武器
author: 'Li Liu, Yaya Cheng'
date: 2025-05-16T00:00:00.000Z
desc: >-
  Milvus 2.6 中的 MinHash LSH 為重複大量 LLM 訓練資料集提供了有效的解決方案，與傳統方法相比，處理速度快 2 倍，成本節省 3-5
  倍。
cover: assets.zilliz.com/Chat_GPT_Image_May_16_2025_09_46_39_PM_1f3290ce5e.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'MinHash LSH, Locality Sensitive Hashing, Milvus, LLM training data'
meta_title: >
  MinHash LSH in Milvus: The Secret Weapon for Fighting Duplicates in LLM
  Training Data
origin: >-
  https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md
---
<p>大型語言模型 (LLM) 具備編寫程式碼、創建內容和解決複雜問題的能力，改變了人工智能的面貌。然而，這些強大的模型需要大量高品質的資料來進行訓練。</p>
<p>挑戰在於原始訓練資料通常包含大量冗餘。這就像是在教導小孩時，不斷重複相同的課程，卻跳過其他重要的課題。一家大型人工智能公司正是為了這個問題與我們接洽 - 他們正在建立一個雄心勃勃的新語言模型，但卻苦於無法重複數百億的文件。傳統的比對方法無法擴充至如此大的數量，而專門的重複資料刪除工具需要大量的計算資源，因此在經濟上並不可行。</p>
<p>為了解決這個問題，我們在 Milvus 2.6 中推出 MinHash LSH (Locality Sensitive Hashing) 索引。本文將探討 MinHash LSH 如何有效率地解決 LLM 訓練的重複資料刪除問題。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Chat_GPT_Image_May_16_2025_09_46_39_PM_1f3290ce5e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Data-Deduplication-Why-It-Matters-for-LLM-Training" class="common-anchor-header">重複資料刪除：為什麼它對 LLM 訓練很重要<button data-href="#Data-Deduplication-Why-It-Matters-for-LLM-Training" class="anchor-icon" translate="no">
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
    </button></h2><p>高品質、多樣化的資料是訓練強大 LLM 的必要條件。當重複的內容出現在訓練資料中時，會產生幾個重大的問題：</p>
<ul>
<li><p><strong>浪費資源：</strong>重複資料會增加訓練時間、成本和能源消耗。</p></li>
<li><p><strong>效能降低：</strong>模型可能會過度適應重複的內容，限制其歸納新資訊的能力。</p></li>
<li><p><strong>記憶效應：</strong>重複的內容會增加模型記憶和逐字複製特定文字的機會。這也可能導致隱私洩漏或著作權問題。</p></li>
<li><p><strong>誤導評估：</strong>訓練集和測試集之間的重複內容可能會意外地誇大效能指標。</p></li>
</ul>
<p>尋找和移除重複資料的方法主要有三種：</p>
<ul>
<li><p><strong>精確匹配：</strong>透過雜湊識別完全相同的重複資料。</p></li>
<li><p><strong>近似匹配：</strong>使用 MinHash LSH 和 Jaccard 相似度等演算法找出接近重複的內容。</p></li>
<li><p><strong>語義配對：</strong>使用向量嵌入識別具有相似涵義的內容。</p></li>
</ul>
<p>由於預先訓練的語料庫已達 terabytes 甚至 petabytes，傳統的精確匹配方法 (例如成對比較) 在計算上並不可行。透過使用嵌入模型來產生向量，語意重複刪除會增加顯著的開銷。我們需要更創新的近似方法，就像<strong>MinHash LSH，</strong>既能平衡召回率與精確度，又能控制成本，讓大規模的重複資料刪除成為可能。</p>
<h2 id="MinHash-LSH-Efficiently-Detecting-Near-Duplicates-in-Massive-Datasets" class="common-anchor-header">MinHash LSH：有效偵測大量資料集中的近似重複資料<button data-href="#MinHash-LSH-Efficiently-Detecting-Near-Duplicates-in-Massive-Datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>要在龐大的訓練資料中找出近乎重複的資料，我們需要一個既有效率又精確的近似比對演算法。MinHash LSH (Locality Sensitive Hashing) 是達成這個目標的絕佳工具。讓我們一步一步來分解這個看似複雜的名詞。</p>
<h3 id="Step-1-Representing-Documents-with-MinHash" class="common-anchor-header">步驟 1：使用 MinHash 表示文件</h3><p>首先，我們需要測量文件相似性的方法。標準的方法是使用 Jaccard 相似度：</p>
<p><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mi></mi></mrow></semantics></math></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span>J<span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mo stretchy="false">(</mo><mi>A</mi><mo separator="true">,</mo><mi>B</mi><mo stretchy="false">)</mo><mfrac><mrow><mi mathvariant="normal">=∣A∩B∣∣A∪B∣J</mi></mrow></mfrac></mrow><annotation encoding="application/x-tex">(A,B) = \frac{||A\cap B|}{|A \cup B|}</annotation></semantics></math></span></span></span><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="katex-display"><span class="katex">J<span class="katex-html" aria-hidden="true"><span class="base"><span class="mopen">(</span><span class="mord mathnormal">A</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span></span></span>B<span class="katex-html" aria-hidden="true"><span class="base"><span class="mclose">)</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span>=</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="katex-display"><span class="katex"></span></span><span class="strut" style="height:2.363em;vertical-align:-0.936em;"></span> <span class="katex-display"><span class="katex"></span></span><span class="mopen nulldelimiter"></span> <span class="katex-display"><span class="katex"></span></span><span class="pstrut" style="height:3em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-2.314em;"><span class="mord"><span class="mord mathnormal">∣A</span></span></span></span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-2.314em;"><span class="mord"><span class="mord mathnormal" style="margin-right:0.05017em;">∪8</span></span></span></span></span></span></span></span></span></span>B∣</span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span class="katex-display"><span class="katex"></span></span><span class="pstrut" style="height:3em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-3.677em;"><span class="mord"><span class="mord mathnormal">∣A</span></span></span></span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-3.677em;"><span class="mord"><span class="mbin">∩</span><span class="mspace" style="margin-right:0.2222em;"></span></span></span></span><span class="vlist-s">B∣</span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.936em;"><span></span></span></span><span class="mclose nulldelimiter"></span></p>
<p>此公式測量文件 A 與文件 B 之間的重疊程度 - 具體來說，是共用元素與總獨特元素的比率。值越高，表示文件越相似。</p>
<p>然而，為數十億個文件對直接計算這個值會耗費大量資源，而且需要數年時間。MinHash 可以建立精簡的「指紋」（簽名），保留相似性關係，同時使比較速度更快。</p>
<ol>
<li><strong>串聯：</strong>將每個文件分割成重疊的文字或字元序列 (k-shingles)。例如，句子「我愛向量搜尋」，以 k=3 (按字) 產生：{「我愛向量」、「愛向量搜尋」}。</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/shingling_858ad58efa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li><strong>MinHashing:</strong>將多個雜湊函數套用在每組字元上，並記錄每個函數的最小雜湊值。這會產生每個文件的簽章向量。</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minhash_041003210a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>在計算相似性時，哈希值在兩個文件的 MinHash 簽署中相同位置對齊的機率值（相當於這些簽署的 Jaccard 距離），提供了它們原始瓦片集 Jaccard 相似性的近似值。這讓我們可以有效地估計文件相似性，而不需要直接比較較大的原始文字；相反地，我們可以分析它們精簡的 MinHash 簽署。</p>
<p>MinHash 原則是使用散列值最小的字來代表整個文件，藉由加入額外的散列函數來提高精確度。輕微的字詞變更很可能會被忽略，因為它們通常不會影響最小切細值。相反地，較大的變更則會改變切細值，而且較容易被偵測到。這種方法可以看成是各種字詞雜湊值的 Min-pooling。除了 MinHash 之外，也有其他方法可以用來產生文件簽章，例如 SimHash，但在此不做討論。</p>
<h3 id="Step-2-Identifying-Similar-Documents-via-LSH" class="common-anchor-header">步驟 2：透過 LSH 識別相似文件</h3><p>即使使用精簡的 MinHash 簽署，比較數百萬或數十億個文件中的每一對，仍會造成高昂的計算費用。這就是<strong>Locality Sensitive Hashing (LSH)</strong>的用武之地。</p>
<p>LSH 的關鍵概念是使用<strong>故意造成碰撞的</strong>散列函數<strong>- 相似的</strong>項目更有可能散列到相同的資料桶，而不相似的則不會。這與旨在避免碰撞的傳統散列正好相反。</p>
<p>對於 MinHash，流行的 LSH 策略是<strong>Banding 技術</strong>：</p>
<ol>
<li><p><strong>分段</strong>：將每個 MinHash 簽章 (長度為<em>N</em> 的向量) 分割為<em>b</em>band，每個 band 有<em>r</em>dims<em>(N = b × r</em>)。</p></li>
<li><p><strong>散列頻段：</strong>使用標準散列函數將每個 band (<em>r</em>個值的子向量) 散列到一個 bucket 中。</p></li>
<li><p><strong>候選對：</strong>如果兩個文件在<strong>任何</strong>頻段中共用一個資料桶，它們就會被標記為潛在的匹配項目。</p></li>
</ol>
<p>透過調整頻帶數 (b) 和每個頻帶的維度數 ®，您可以控制召回率、精確度和搜尋效率之間的權衡。</p>
<p>關鍵的想法是：高度相似的文件在其 MinHash 簽署中會有許多匹配的雜湊值。當這些簽章被分割成頻帶時，即使有一個頻帶具有所有的匹配值，也足以將兩個文件放入同一個資料桶中。文件越相似，至少有一個區段出現這種情況的機率就越高，這使得 LSH 可以有效率地浮現候選配對（而無需鉅細無遺地比較所有簽章）。</p>
<p>簡而言之，<strong>MinHash + LSH</strong>可實現可擴充的近似重複資料刪除：MinHash 將文件壓縮成精簡的簽名，而 LSH 則透過群組可能的匹配項目，有效地縮窄搜尋空間。這就像是在人群中找出雙胞胎一樣：首先，快速拍攝每個人的特徵快照 (MinHash)，將相似的人歸類 (LSH)，然後仔細檢查較小的群組，找出真正的重複。</p>
<h2 id="Integrating-MinHash-LSH-in-Milvus-26" class="common-anchor-header">在 Milvus 2.6 中整合 MinHash LSH<button data-href="#Integrating-MinHash-LSH-in-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>MinHash LSH 整合到 Milvus 2.6 是基於現實世界的需求。如前所述，Milvus 的用戶 (領先的 LLM 公司之一) 向我們提出一項挑戰：為 LLM 預先訓練有效率地重複大量文字資料。</p>
<p>傳統的重複資料刪除管道通常依賴與儲存和檢索系統脫離的外部工具，需要在元件之間進行成本高昂的資料傳輸。這種零散的工作流程增加了作業開銷，也無法充分利用分散式運算資源。</p>
<p>意識到 Milvus 在處理高通量向量資料方面的優勢，一個自然而然的想法出現了：<strong><em>如果 MinHash LSH 原生內建至 Milvus，讓近似重複資料刪除成為一級資料庫功能，會如何？</em></strong></p>
<p>此方法可在 Milvus 內實現從重複資料刪除到語意檢索的完整工作流程，簡化 MLOps，同時充分利用其可擴充性和統一 API。我們與合作夥伴一起針對 Milvus 的雲原生架構優化 MinHash LSH，為大規模重複資料刪除提供快速且可擴充的解決方案。</p>
<h3 id="Core-capabilities-in-Milvus-26-include" class="common-anchor-header">Milvus 2.6 的核心功能包括</h3><ul>
<li><p><strong>原生 MinHash LSH 索引：</strong>為 LSH 執行標準 banding 技術，並支援可選的 Jaccard 重新排序，以提高召回率。提供以記憶體和 mmap 為基礎的實作，以便在不同的工作負載中靈活運用。</p></li>
<li><p><strong>無縫 API 整合：</strong>使用者可以使用 Milvus 的標準 SDK 和宣告式 API 定義 MinHash 向量字段、建立<code translate="no">MINHASH_LSH</code> 索引、插入簽章資料，以及執行近似相似性搜尋。</p></li>
<li><p><strong>分散式且可擴充：</strong>建立在 Milvus 的雲原生架構上，該功能支援大型資料集和高吞吐量處理的水平擴充。</p></li>
</ul>
<p>這種整合帶來了令人印象深刻的結果。透過在完全管理的 Milvus<a href="https://zilliz.com/cloud">(Zilliz Cloud</a>) 上執行 MinHash LSH，我們協助該使用者有效率地重複<strong>100 億份文件</strong>。與他們之前基於 MapReduce 的方法相比，新解決方案的<strong>處理速度提高了一倍以上</strong>，<strong>並節省了 3-5 倍的成本</strong>，這都要歸功於 Milvus 優化的索引和查詢執行。</p>
<h2 id="Hands-On-Deduplicating-LLM-Datasets-Using-Milvus" class="common-anchor-header">上手操作：使用 Milvus 刪除 LLM 資料集<button data-href="#Hands-On-Deduplicating-LLM-Datasets-Using-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>讓我們捲起袖子，在 Milvus 2.6 中使用 MinHash LSH 來執行近似規模的重複資料刪除。</p>
<h3 id="Prerequisite-Generating-MinHash-Signatures" class="common-anchor-header">先決條件：產生 MinHash 簽署</h3><p>Milvus 會處理<strong>預先產生的</strong>MinHash 簽名的索引和搜尋。您需要在預處理過程中使用<code translate="no">datasketch</code> 之類的工具或自訂實作來產生這些簽章。典型的步驟如下</p>
<ol>
<li><p>讀取原始文件</p></li>
<li><p>將每個文件切分 (標記化或分塊)</p></li>
<li><p>套用多個散列函數以產生 MinHash 簽章 (例如，大小為 128 的 uint64 陣列)</p></li>
</ol>
<pre><code translate="no"><span class="hljs-keyword">from</span> datasketch <span class="hljs-keyword">import</span> MinHash

text = <span class="hljs-string">&quot;example text for minhash signature&quot;</span>
tokens = text.lower().split()  <span class="hljs-comment"># Step 1 &amp; 2: preprocess + tokenize/shingle</span>
mh = MinHash(num_perm=<span class="hljs-number">128</span>)     <span class="hljs-comment"># Step 3: initialize MinHash</span>
<span class="hljs-keyword">for</span> token <span class="hljs-keyword">in</span> tokens:
    mh.update(token.encode(<span class="hljs-string">&#x27;utf-8&#x27;</span>))  <span class="hljs-comment"># Add shingles to MinHash</span>
signature = mh.hashvalues  <span class="hljs-comment"># This is your MinHash signature (128-dimensional)</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-1-Create-a-Schema-in-Milvus" class="common-anchor-header">步驟 1：在 Milvus 中建立模式</h3><p>我們需要建立一個 Milvus 集合來儲存 MinHash 簽章及其對應的文件 ID。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> DataType
MILVUS_URI = <span class="hljs-string">&quot;localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;llm_data_dedup_minhash&quot;</span>
MINHASH_DIM = <span class="hljs-number">128</span>
MINHASH_BIT_WIDTH = <span class="hljs-number">64</span> <span class="hljs-comment"># Assuming 64-bit hash values</span>

<span class="hljs-comment"># Load data from NPY file</span>
base = np.load(<span class="hljs-string">&#x27;minhash_vectors.npy&#x27;</span>)
ids = [<span class="hljs-built_in">str</span>(i) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(base.shape[<span class="hljs-number">0</span>])]  <span class="hljs-comment"># Generate string IDs</span>

client = MilvusClient(uri=MILVUS_URI)
<span class="hljs-comment"># Check and drop existing collection if needed</span>
<span class="hljs-keyword">if</span> collection_name <span class="hljs-keyword">in</span> client.list_collections():
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection <span class="hljs-subst">{collection_name}</span> exists, dropping it...&quot;</span>)
    client.drop_collection(collection_name)
<span class="hljs-comment"># Create collection schema</span>
schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)

schema.add_field(field_name=<span class="hljs-string">&quot;input_id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;minhash&quot;</span>, datatype=DataType.BINARY_VECTOR, dim=MINHASH_DIM * MINHASH_BIT_WIDTH)
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">200</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-the-MINHASHLSH-Index-and-Collection" class="common-anchor-header"><strong>步驟 2：建立 MINHASH_LSH 索引和集合</strong></h3><p>這是核心步驟。我們需要指定 JACCARD 為度量類型，並設定 LSH 相關的參數。</p>
<pre><code translate="no">INDEX_FIELD_NAME = <span class="hljs-string">&quot;minhash_signature&quot;</span>
<span class="hljs-comment"># Metric type, should be JACCARD for MinHash LSH</span>
METRIC_TYPE = <span class="hljs-string">&quot;MHJACCARD&quot;</span>
INDEX_TYPE = <span class="hljs-string">&quot;MINHASH_LSH&quot;</span>
MINHASH_DIM = <span class="hljs-number">128</span>
MINHASH_BIT_WIDTH = <span class="hljs-number">64</span> <span class="hljs-comment"># Assuming 64-bit hash values</span>

index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name=INDEX_FIELD_NAME,
    index_type=INDEX_TYPE,
    metric_type=METRIC_TYPE,
    params={
        <span class="hljs-comment"># LSH-specific parameters might be configured here, e.g.:</span>
        <span class="hljs-comment"># &quot;band&quot;: 32, # Hypothetical parameter: number of bands</span>
        <span class="hljs-comment"># &quot;element_bit_width&quot;: 64 # Bit width of minhash values</span>
    }
)
<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=collection_name,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>關於參數調整的說明：MinHash LSH 的有效性在很大程度上取決於參數的選擇。例如，在 MinHash 簽章產生過程中使用的散列函數 (即<code translate="no">MINHASH_DIM</code>) 會影響簽章的精確度和大小。在 LSH 階段，頻帶數 (<code translate="no">num_bands</code>) 和每頻帶的行數共同決定相似性臨界值的敏感度範圍，以及回復率和精確度之間的平衡。使用者需要根據其資料集特性和重複資料刪除需求進行實驗和微調。這通常是一個反覆的過程。</p>
<h3 id="Step-3-Insert-MinHash-Signatures" class="common-anchor-header"><strong>步驟 3：插入 MinHash 簽署</strong></h3><p>假設您有一批文件及其對應的 MinHash 簽署。</p>
<pre><code translate="no"><span class="hljs-comment"># Insert data in batches</span>
batch_size = <span class="hljs-number">2000</span>
total_records = base.shape[<span class="hljs-number">0</span>]
num_batches = (total_records + batch_size - <span class="hljs-number">1</span>) // batch_size

<span class="hljs-keyword">for</span> batch_idx <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(num_batches):
    start = batch_idx * batch_size
    end = <span class="hljs-built_in">min</span>((batch_idx + <span class="hljs-number">1</span>) * batch_size, total_records)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserting batch <span class="hljs-subst">{batch_idx + <span class="hljs-number">1</span>}</span>/<span class="hljs-subst">{num_batches}</span> (records <span class="hljs-subst">{start}</span>-<span class="hljs-subst">{end}</span>)&quot;</span>)
    
    <span class="hljs-comment"># Prepare batch data</span>
    batch_data = [{
        <span class="hljs-string">&quot;input_id&quot;</span>: i,
        <span class="hljs-string">&quot;minhash&quot;</span>: base[i].tobytes(),
        <span class="hljs-string">&quot;id&quot;</span>: ids[i]
    } <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(start, end)]
    
    <span class="hljs-comment"># Insert batch</span>
    client.insert(collection_name, batch_data)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Data insertion complete&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Search-for-Near-Duplicates" class="common-anchor-header">步驟 5：搜尋近乎重複的文件</h3><p>使用文件的 MinHash 簽署在文件集中搜尋相似的文件。</p>
<pre><code translate="no"><span class="hljs-comment"># Perform search</span>
search_vectors = [vec.tobytes() <span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> base[:<span class="hljs-number">10</span>]]
results = client.search(
    collection_name, 
    data=search_vectors, 
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: METRIC_TYPE, <span class="hljs-string">&quot;params&quot;</span>: search_params_lsh},
    limit=<span class="hljs-number">1</span>, 
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>])

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results:&quot;</span>)
<span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Query <span class="hljs-subst">{i}</span>:&quot;</span>)
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> result:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  - ID: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, Distance: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Post-Processing-and-Clustering" class="common-anchor-header">步驟 6：後期處理與聚類</h3><p>傳回的結果是<strong>候選的近似重複</strong>。若要形成完整的重複資料群組，您可以在候選對上套用群組技術，例如<strong>Union-Find</strong>。每個產生的群組代表一組重複；保留一個有代表性的文件，並歸檔或移除其餘的文件。</p>
<h2 id="Conclusion" class="common-anchor-header"><strong>結論</strong><button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 中的 MinHash LSH 是 AI 資料處理的一大躍進。一開始是用於 LLM 資料重複刪除的解決方案，現在則為更廣泛的使用個案打開了大門 - 網頁內容清理、目錄管理、剽竊偵測等。</p>
<h2 id="Getting-Started-with-Milvus-26" class="common-anchor-header">開始使用 Milvus 2.6<button data-href="#Getting-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 現已上市。除了 MinHash LSH 之外，它還引進了數十項新功能和效能最佳化，例如分層儲存、RabbitQ 量化方法，以及增強的全文檢索和多租戶功能，直接解決當今向量檢索最迫切的挑戰：在有效擴充的同時控制成本。</p>
<p>準備好探索 Milvus 所提供的一切了嗎？請深入閱讀我們的<a href="https://milvus.io/docs/release_notes.md"> 發行說明</a>、瀏覽<a href="https://milvus.io/docs"> 完整的說明文件</a>，或查看我們的<a href="https://milvus.io/blog"> 功能部落格</a>。</p>
<p>如果您有任何問題或有類似的使用案例，請隨時透過<a href="https://discord.com/invite/8uyFbECzPX">Discord 社群</a>聯絡我們，或在<a href="https://github.com/milvus-io/milvus"> GitHub</a>上提出問題 - 我們隨時準備幫助您充分利用 Milvus 2.6。</p>
