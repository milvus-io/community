---
id: >-
  stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md
title: 停止建立 Vanilla RAG：使用 DeepSearcher 接納代理式 RAG
author: Cheney Zhang
date: 2025-03-23T00:00:00.000Z
cover: >-
  assets.zilliz.com/Stop_Using_Outdated_RAG_Deep_Searcher_s_Agentic_RAG_Approach_Changes_Everything_b2eaa644cf.png
tag: Engineering
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md
---
<h2 id="The-Shift-to-AI-Powered-Search-with-LLMs-and-Deep-Research" class="common-anchor-header">法學碩士和深度研究向人工智能驅動搜索的轉變<button data-href="#The-Shift-to-AI-Powered-Search-with-LLMs-and-Deep-Research" class="anchor-icon" translate="no">
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
    </button></h2><p>數十年來，搜尋技術的演進可謂突飛猛進，從 2000 年代前以關鍵字為基礎的檢索，到 2010 年代的個人化搜尋體驗。我們見證了人工智能驅動的解決方案的出現，能夠處理需要深入、專業分析的複雜查詢。</p>
<p>OpenAI 的深度研究 (Deep Research) 就是這個轉變的範例，它利用推理能力來綜合大量資訊，並產生多步驟的研究報告。例如，當被問到「特斯拉的合理市值是多少？時，Deep Research 可以全面分析企業財務、業務成長軌跡和市值預估。</p>
<p>Deep Research 以 RAG（Retrieval-Augmented Generation）框架的進階形式為核心。傳統的 RAG 透過擷取和整合相關的外部資訊來強化語言模型輸出。OpenAI 的方法則是透過執行迭代式擷取與推理週期，進一步加強這一功能。Deep Research 並非單一的擷取步驟，而是動態產生多個查詢、評估中間結果，並改善其搜尋策略，展現先進或代理式 RAG 技術如何提供高品質的企業級內容，讓人感覺更像是專業研究，而非簡單的問題解答。</p>
<h2 id="DeepSearcher-A-Local-Deep-Research-Bringing-Agentic-RAG-to-Everyone" class="common-anchor-header">DeepSearcher：本地深度研究將代理 RAG 帶給每個人<button data-href="#DeepSearcher-A-Local-Deep-Research-Bringing-Agentic-RAG-to-Everyone" class="anchor-icon" translate="no">
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
    </button></h2><p>受到這些進步的啟發，全球的開發人員都在創造他們自己的實作。Zilliz 工程師建立了<a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>專案，並將其開放源碼，可視為本地的開放源碼深度研究。這個專案在不到一個月的時間內就獲得了超過 4,900 個 GitHub stars。</p>
<p>DeepSearcher 結合了先進推理模型、複雜搜尋功能和整合式研究助理的力量，重新定義了 AI 驅動的企業搜尋。DeepSearcher 透過<a href="https://milvus.io/docs/overview.md">Milvus</a>(高效能的開放原始碼向量資料庫) 整合本機資料，提供更快速、更相關的搜尋結果，同時允許使用者輕鬆交換核心模型，以獲得客製化的體驗。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_1_Deep_Searcher_s_star_history_9c1a064ed8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖 1：</em> <em>DeepSearcher 的明星歷史 (</em><a href="https://www.star-history.com/#zilliztech/deep-searcher&amp;Date"><em>來源</em></a><em>)</em></p>
<p>在這篇文章中，我們將探討從傳統 RAG 到 Agentic RAG 的演進過程，探討這些方法在技術層面的具體不同之處。然後，我們將討論 DeepSearcher 的實作，說明它如何利用智慧型代理功能來實現動態、多輪推理，以及為什麼這對建立企業級搜尋解決方案的開發人員很重要。</p>
<h2 id="From-Traditional-RAG-to-Agentic-RAG-The-Power-of-Iterative-Reasoning" class="common-anchor-header">從傳統 RAG 到 Agentic RAG：迭代推理的力量<button data-href="#From-Traditional-RAG-to-Agentic-RAG-The-Power-of-Iterative-Reasoning" class="anchor-icon" translate="no">
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
    </button></h2><p>Agentic RAG 透過整合智慧型代理功能，增強了傳統 RAG 架構。DeepSearcher 就是代理式 RAG 架構的最佳範例。透過動態規劃、多步驟推理和自主決策，它建立了一個閉環流程，可檢索、處理、驗證和優化資料，以解決複雜的問題。</p>
<p>大型語言模型 (LLM) 推理能力的顯著進步，特別是其分解複雜問題和在多步驟中維持連貫思考鏈的能力提升，推動了 Agentic RAG 的日益普及。</p>
<table>
<thead>
<tr><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>比較維度</strong></td><td><strong>傳統 RAG</strong></td><td><strong>代理 RAG</strong></td></tr>
<tr><td>核心方法</td><td>被動與反應式</td><td>主動、代理驅動</td></tr>
<tr><td>流程</td><td>單步檢索和生成（一次性流程）</td><td>動態、多步驟檢索和生成（迭代精煉）</td></tr>
<tr><td>檢索策略</td><td>固定關鍵字搜尋，取決於初始查詢</td><td>適應性檢索 (例如，關鍵字精煉、資料來源切換)</td></tr>
<tr><td>複雜查詢處理</td><td>直接產生；容易因資料衝突而出錯</td><td>任務分解 → 目標檢索 → 答案合成</td></tr>
<tr><td>互動能力</td><td>完全依賴使用者輸入；無自主性</td><td>主動參與 (例如，澄清含糊之處、要求詳細資訊)</td></tr>
<tr><td>錯誤更正與回饋</td><td>無法自我修正；受限於初始結果</td><td>迭代驗證 → 自觸發重新擷取以確保準確性</td></tr>
<tr><td>理想的使用個案</td><td>簡單問答、事實查詢</td><td>複雜推理、多階段解決問題、開放式任務</td></tr>
<tr><td>範例</td><td>使用者詢問"什麼是量子運算？→ 系統回傳教科書上的定義</td><td>使用者問"量子運算如何優化物流？→ 系統檢索量子原理和物流演算法，然後歸納可操作的見解</td></tr>
</tbody>
</table>
<p>傳統的 RAG 依賴單一、以查詢為基礎的檢索，Agentic RAG 則不同，它將查詢分解為多個子問題，並反覆精煉其搜尋，直到達到滿意的答案為止。這種演進提供了三個主要優點：</p>
<ul>
<li><p><strong>主動解決問題：</strong>系統從被動反應轉變為主動解決問題。</p></li>
<li><p><strong>動態、多輪檢索：</strong>系統不再執行一次性的搜尋，而是持續調整其查詢，並根據持續的回饋進行自我修正。</p></li>
<li><p><strong>更廣泛的適用性：</strong>它超越了基本的事實檢查，可處理複雜的推理任務，並產生全面的報告。</p></li>
</ul>
<p>利用這些功能，Agentic RAG 應用程式（如 DeepSearcher）的運作方式與人類專家非常類似，不僅能提供最終答案，還能完整、透明地分解推理過程和執行細節。</p>
<p>長期而言，Agentic RAG 將會超越基線 RAG 系統。傳統的方法往往難以解決使用者查詢的底層邏輯問題，這需要反覆的推理、反省與持續的最佳化。</p>
<h2 id="What-Does-an-Agentic-RAG-Architecture-Look-Like-DeepSearcher-as-an-Example" class="common-anchor-header">Agentic RAG 架構是什麼樣的？以 DeepSearcher 為例<button data-href="#What-Does-an-Agentic-RAG-Architecture-Look-Like-DeepSearcher-as-an-Example" class="anchor-icon" translate="no">
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
    </button></h2><p>既然我們已經瞭解了代理 RAG 系統的威力，那麼它們的架構是什麼樣的呢？讓我們以 DeepSearcher 為例。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_2_Two_Modules_Within_Deep_Searcher_baf5ca5952.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖 2：DeepSearcher 內的兩個模組</em></p>
<p>DeepSearcher 的架構由兩個主要模組組成：</p>
<h3 id="1-Data-Ingestion-Module" class="common-anchor-header">1.資料輸入模組</h3><p>這個模組透過 Milvus 向量資料庫連結各種第三方專屬資料來源。它對於依賴專屬資料集的企業環境尤其有價值。該模組可處理</p>
<ul>
<li><p>文件解析與分塊</p></li>
<li><p>嵌入生成</p></li>
<li><p>向量儲存與索引</p></li>
<li><p>有效檢索的元資料管理</p></li>
</ul>
<h3 id="2-Online-Reasoning-and-Query-Module" class="common-anchor-header">2.線上推理與查詢模組</h3><p>此元件在 RAG 架構中實作多樣化的代理策略，以提供精確、有洞察力的回應。它以動態迭代循環的方式運作 - 每次資料擷取之後，系統都會反省累積的資訊是否足以回答原始查詢。如果不是，就會觸發另一次迭代；如果是，就會產生最終報告。</p>
<p>這種「跟進」和「反思」的持續循環代表了對其他基本 RAG 方法的根本性改進。傳統的 RAG 只執行一次檢索和生成流程，而 DeepSearcher 的迭代方法反映了人類研究人員的工作方式 - 提出初始問題、評估收到的資訊、找出差距並尋找新的探究方向。</p>
<h2 id="How-Effective-is-DeepSearcher-and-What-Use-Cases-is-It-Best-Suited-For" class="common-anchor-header">DeepSearcher 的效能如何？<button data-href="#How-Effective-is-DeepSearcher-and-What-Use-Cases-is-It-Best-Suited-For" class="anchor-icon" translate="no">
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
    </button></h2><p>安裝和設定完成後，DeepSearcher 會透過 Milvus 向量資料庫為您的本機檔案建立索引。當您提交查詢時，它會對這些索引內容執行全面深入的搜尋。對開發人員而言，其主要優勢在於系統會記錄其搜尋與推理過程的每一步驟，讓人一目了然系統如何得出結論 - 這對於調試與優化 RAG 系統而言是非常重要的功能。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_3_Accelerated_Playback_of_Deep_Searcher_Iteration_0c36baea2f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖 3：DeepSearcher 迭代的加速播放</em></p>
<p>這種方法比傳統的 RAG 消耗更多的計算資源，但卻能為複雜的查詢提供更好的結果。讓我們來討論 DeepSearcher 最適合的兩個特定用例。</p>
<h3 id="1-Overview-Type-Queries" class="common-anchor-header">1.概述型查詢</h3><p>概述型查詢 (例如：產生報告、草擬文件或總結趨勢)，可提供簡短的主題，但需要詳盡、詳細的輸出。</p>
<p>例如，當查詢「The Simpsons 隨著時間的推移發生了什麼變化」時，DeepSearcher 會首先產生一組子查詢：</p>
<pre><code translate="no">_Break down the original query <span class="hljs-keyword">into</span> <span class="hljs-keyword">new</span> sub queries: [_

_<span class="hljs-string">&#x27;How has the cultural impact and societal relevance of The Simpsons evolved from its debut to the present?&#x27;</span>,_

_<span class="hljs-string">&#x27;What changes in character development, humor, and storytelling styles have occurred across different seasons of The Simpsons?&#x27;</span>,_

_<span class="hljs-string">&#x27;How has the animation style and production technology of The Simpsons changed over time?&#x27;</span>,_

_<span class="hljs-string">&#x27;How have audience demographics, reception, and ratings of The Simpsons shifted throughout its run?&#x27;</span>]_
<button class="copy-code-btn"></button></code></pre>
<p>它會擷取相關資訊，然後根據回饋進行迭代，以精簡其搜尋，產生下一個子查詢：</p>
<pre><code translate="no">_New search queries <span class="hljs-keyword">for</span> <span class="hljs-built_in">next</span> iteration: [_

_<span class="hljs-string">&quot;How have changes in The Simpsons&#x27; voice cast and production team influenced the show&#x27;s evolution over different seasons?&quot;</span>,_

_<span class="hljs-string">&quot;What role has The Simpsons&#x27; satire and social commentary played in its adaptation to contemporary issues across decades?&quot;</span>,_

_<span class="hljs-string">&#x27;How has The Simpsons addressed and incorporated shifts in media consumption, such as streaming services, into its distribution and content strategies?&#x27;</span>]_
<button class="copy-code-btn"></button></code></pre>
<p>每次迭代都建立在前一次迭代的基礎上，最終形成一份涵蓋主題多個層面的綜合報告，其結構包括以下部分：</p>
<pre><code translate="no">**<span class="hljs-title class_">Report</span>: <span class="hljs-title class_">The</span> <span class="hljs-title class_">Evolution</span> <span class="hljs-keyword">of</span> _The <span class="hljs-title class_">Simpsons</span>_ (<span class="hljs-number">1989</span>–<span class="hljs-title class_">Present</span>)**
**<span class="hljs-number">1.</span> <span class="hljs-title class_">Cultural</span> <span class="hljs-title class_">Impact</span> and <span class="hljs-title class_">Societal</span> <span class="hljs-title class_">Relevance</span>** 
_The <span class="hljs-title class_">Simpsons</span>_ debuted <span class="hljs-keyword">as</span> a subversive critique <span class="hljs-keyword">of</span> <span class="hljs-title class_">American</span> middle-<span class="hljs-keyword">class</span> <span class="hljs-title class_">life</span>, gaining notoriety <span class="hljs-keyword">for</span> its bold satire <span class="hljs-keyword">in</span> the 1990s. <span class="hljs-title class_">Initially</span> a countercultural phenomenon, it challenged norms <span class="hljs-keyword">with</span> episodes tackling religion, politics, and consumerism. <span class="hljs-title class_">Over</span> time, its cultural dominance waned <span class="hljs-keyword">as</span> competitors like _South <span class="hljs-title class_">Park</span>_ and _Family <span class="hljs-title class_">Guy</span>_ pushed boundaries further. <span class="hljs-title class_">By</span> the 2010s, the show transitioned <span class="hljs-keyword">from</span> trendsetter to nostalgic institution, balancing legacy appeal <span class="hljs-keyword">with</span> attempts to address modern issues like climate change and <span class="hljs-variable constant_">LGBTQ</span>+ rights, albeit <span class="hljs-keyword">with</span> less societal resonance.
**<span class="hljs-number">2.</span> <span class="hljs-title class_">Character</span> <span class="hljs-title class_">Development</span> and <span class="hljs-title class_">Storytelling</span> <span class="hljs-title class_">Shifts</span>** 
<span class="hljs-title class_">Early</span> seasons featured nuanced character <span class="hljs-title function_">arcs</span> (e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Lisa</span>’s activism, <span class="hljs-title class_">Marge</span>’s resilience), but later seasons saw <span class="hljs-string">&quot;Flanderization&quot;</span> (exaggerating traits, e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Homer</span>’s stupidity, <span class="hljs-title class_">Ned</span> <span class="hljs-title class_">Flanders</span>’ piety). <span class="hljs-title class_">Humor</span> evolved <span class="hljs-keyword">from</span> witty, character-driven satire to reliance on pop culture references and meta-humor. <span class="hljs-title class_">Serialized</span> storytelling <span class="hljs-keyword">in</span> early episodes gave way to episodic, gag-focused plots, often sacrificing emotional depth <span class="hljs-keyword">for</span> absurdity.
[...]
**<span class="hljs-number">12.</span> <span class="hljs-title class_">Merchandising</span> and <span class="hljs-title class_">Global</span> <span class="hljs-title class_">Reach</span>** 
<span class="hljs-title class_">The</span> 1990s merchandise <span class="hljs-title function_">boom</span> (action figures, _Simpsons_-themed cereals) faded, but the franchise persists via <span class="hljs-title function_">collaborations</span> (e.<span class="hljs-property">g</span>., _Fortnite_ skins, <span class="hljs-title class_">Lego</span> sets). <span class="hljs-title class_">International</span> adaptations include localized dubbing and culturally tailored <span class="hljs-title function_">episodes</span> (e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Japanese</span> _Itchy &amp; <span class="hljs-title class_">Scratchy</span>_ variants).
**<span class="hljs-title class_">Conclusion</span>** 
_The <span class="hljs-title class_">Simpsons</span>_ evolved <span class="hljs-keyword">from</span> a radical satire to a television institution, navigating shifts <span class="hljs-keyword">in</span> technology, politics, and audience expectations. <span class="hljs-title class_">While</span> its golden-age brilliance remains unmatched, its adaptability—through streaming, updated humor, and <span class="hljs-variable language_">global</span> outreach—secures its place <span class="hljs-keyword">as</span> a cultural touchstone. <span class="hljs-title class_">The</span> show’s longevity reflects both nostalgia and a pragmatic embrace <span class="hljs-keyword">of</span> change, even <span class="hljs-keyword">as</span> it grapples <span class="hljs-keyword">with</span> the challenges <span class="hljs-keyword">of</span> relevance <span class="hljs-keyword">in</span> a fragmented media landscape.
<button class="copy-code-btn"></button></code></pre>
<p><em>(為了簡潔起見，只顯示過程和最終報告的摘錄）</em></p>
<p>最終報告提供詳盡的分析，並有適當的引文和結構化的組織。</p>
<h3 id="2-Complex-Reasoning-Queries" class="common-anchor-header">2.複雜的推理查詢</h3><p>複雜的查詢涉及多層邏輯和相互關聯的實體。</p>
<p>請考慮下列查詢「哪一部電影的導演年紀較大，是《上帝給女人的禮物》還是《Aldri annet enn bråk》？」</p>
<p>雖然這對人類來說看似簡單，但簡單的 RAG 系統卻很難處理，因為答案並沒有直接儲存在知識庫中。DeepSearcher 透過將查詢分解為更小的子問題來解決這個難題：</p>
<pre><code translate="no">[<span class="hljs-string">&quot;Who is the director of God&#x27;S Gift To Women?&quot;</span>, <span class="hljs-string">&#x27;Who is the director of Aldri annet enn bråk?&#x27;</span>, <span class="hljs-string">&#x27;What are the ages of the respective directors?&#x27;</span>, <span class="hljs-string">&#x27;Which director is older?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>它首先檢索兩部電影的導演資訊、</p>
<pre><code translate="no">The director of <span class="hljs-string">&quot;God&#x27;s Gift To Women&quot;</span> <span class="hljs-keyword">is</span> Michael Curtiz, the director of <span class="hljs-string">&quot;Aldri annet enn bråk&quot;</span> <span class="hljs-keyword">is</span> Edith Carlmar
<button class="copy-code-btn"></button></code></pre>
<p>然後產生子查詢：</p>
<pre><code translate="no">[<span class="hljs-string">&quot;Find the birthdate of Michael Curtiz, the director of God&#x27;s Gift To Women&quot;</span>, <span class="hljs-string">&#x27;Find the birthdate of Edith Carlmar, the director of Aldri annet enn bråk&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>然後擷取他們的出生日期，最後加以比較以決定正確的答案：</p>
<pre><code translate="no">The director of <span class="hljs-string">&quot;God&#x27;s Gift To Women&quot;</span> <span class="hljs-keyword">is</span> Michael Curtiz, who was born <span class="hljs-keyword">on</span> December <span class="hljs-number">24</span>, <span class="hljs-number">1886</span> <span class="hljs-keyword">and</span> passed away <span class="hljs-keyword">on</span> April <span class="hljs-number">11</span>, <span class="hljs-number">1962.</span> He was a Hungarian-born American film director known <span class="hljs-keyword">for</span> his prolific career <span class="hljs-keyword">in</span> Hollywood.
On the other hand, the director of <span class="hljs-string">&quot;Aldri annet enn bråk&quot;</span> <span class="hljs-keyword">is</span> Edith Carlmar, who was born <span class="hljs-keyword">on</span> November <span class="hljs-number">15</span>, <span class="hljs-number">1911</span> <span class="hljs-keyword">and</span> passed away <span class="hljs-keyword">on</span> May <span class="hljs-number">17</span>, <span class="hljs-number">2003.</span>
Therefore, Michael Curtiz <span class="hljs-keyword">is</span> older than Edith Carlmar.
<button class="copy-code-btn"></button></code></pre>
<p>相比之下，傳統的 RAG 系統可能會因為單次擷取的資訊有限而遺漏關鍵細節，從而可能導致產生<a href="https://zilliz.com/blog/decoding-llm-hallucinations-deep-dive-into-llm-errors">幻覺</a>或不準確的答案：</p>
<pre><code translate="no"><span class="hljs-number">1.</span> **Aldri annet enn bråk** (<span class="hljs-number">1954</span>) <span class="hljs-keyword">is</span> directed <span class="hljs-keyword">by</span> **Edith Carlmar**, who was born <span class="hljs-keyword">on</span> November <span class="hljs-number">15</span>, <span class="hljs-number">1911.</span>
<span class="hljs-number">2.</span> The related chunks did <span class="hljs-keyword">not</span> provide specific details about the director of <span class="hljs-string">&quot;God&#x27;s Gift to Women.&quot;</span> However, <span class="hljs-keyword">if</span> we look at external sources <span class="hljs-keyword">for</span> <span class="hljs-string">&quot;God&#x27;s Gift to Women,&quot;</span> the film was directed <span class="hljs-keyword">by</span> **L. M. (Lyman) Steinberg**, who was born <span class="hljs-keyword">on</span> December <span class="hljs-number">19</span>, <span class="hljs-number">1905.</span>
By comparing their birth dates:
- Edith Carlmar: November <span class="hljs-number">15</span>, <span class="hljs-number">1911</span>
- L. M. Steinberg: December <span class="hljs-number">19</span>, <span class="hljs-number">1905</span>
**Conclusion**: L. M. Steinberg, the director of <span class="hljs-string">&quot;God&#x27;s Gift to Women,&quot;</span> <span class="hljs-keyword">is</span> older than Edith Carlmar, the director of <span class="hljs-string">&quot;Aldri annet enn bråk.&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>DeepSearcher 透過在匯入的本地資料上執行深入、反覆的搜尋而脫穎而出。它會記錄推理過程中的每個步驟，並最終提供全面統一的報告。這使得它對於總覽型查詢 (例如產生詳細報告或總結趨勢) 以及複雜的推理查詢 (需要將問題分解成較小的子問題，並透過多重回饋迴圈彙總資料) 特別有效。</p>
<p>在下一節中，我們將比較 DeepSearcher 與其他 RAG 系統，探索其迭代方式和靈活的模型整合如何與傳統方法相匹配。</p>
<h2 id="Quantitative-Comparison-DeepSearcher-vs-Traditional-RAG" class="common-anchor-header">定量比較：DeepSearcher 與傳統 RAG 的比較<button data-href="#Quantitative-Comparison-DeepSearcher-vs-Traditional-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>在 DeepSearcher GitHub 倉庫中，我們提供了用於定量測試的代碼。在此分析中，我們使用了廣受歡迎的 2WikiMultiHopQA 資料集。(註：為了管理 API 令牌消耗，我們只評估了前 50 個項目，但整體趨勢仍然明確)。</p>
<h3 id="Recall-Rate-Comparison" class="common-anchor-header">召回率比較</h3><p>如圖 4 所示，召回率隨著最大迭代次數的增加而顯著改善：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_4_Max_Iterations_vs_Recall_18a8d6e9bf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖 4：最大迭代次數 vs. 召回率</em></p>
<p>在某一點之後，邊際改善會逐漸減弱，因此，我們通常會將預設值設定為 3 次反覆，但也可以依據特定需求調整。</p>
<h3 id="Token-Consumption-Analysis" class="common-anchor-header">代幣消耗分析</h3><p>我們也測量了 50 個查詢在不同迭代次數下的代幣總使用量：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_5_Max_Iterations_vs_Token_Usage_6d1d44b114.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖 5：最大迭代次數 vs. 代幣使用量</em></p>
<p>結果顯示，代幣消耗隨著迭代次數的增加而呈線性增加。例如，迭代 4 次時，DeepSearcher 會消耗約 0.3M 的代幣。以 OpenAI 的 gpt-4o-mini 定價<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0.</mn><mi>60/1Moutputtokens</mi></mrow></semantics></math></span></span>來粗略估算<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo separator="true">，</mo><mi>平均成本</mi><mi>約</mi><mi>為 0</mi></mrow><annotation encoding="application/x-tex">.</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">60/1Moutputtokens</span></span></span><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">，這等於平均成本約為</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span></span></span></span>0<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.60/1</span><span class="mord mathnormal">Moutputtokens</span><span class="mpunct">，</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal"></span><span class="mord mathnormal">這等於</span></span></span></span>每次查詢的<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">平均成本約為</annotation></semantics></math></span></span>0.0036 美元 (或 50 次查詢<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">約</span></span></span></span>0.18 美元)。</p>
<p>對於資源密集度較高的推論模型，由於每個令牌的定價較高，且令牌輸出量較大，因此成本會高出數倍。</p>
<h3 id="Model-Performance-Comparison" class="common-anchor-header">模型性能比較</h3><p>DeepSearcher 的一個顯著優勢是其在不同模型之間切換的靈活性。我們測試了各種推論模型和非推論模型（如 gpt-4o-mini）。總體而言，推論模型 (尤其是 Claude 3.7 Sonnet) 的表現趨於最佳，雖然差異並不顯著。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_6_Average_Recall_by_Model_153c93f616.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖 6：各模型的平均召回率</em></p>
<p>值得注意的是，一些較小的非推理模型有時候無法完成完整的代理查詢流程，因為它們遵循指令的能力有限--這是許多開發人員在使用類似系統時面臨的共同挑戰。</p>
<h2 id="DeepSearcher-Agentic-RAG-vs-Graph-RAG" class="common-anchor-header">DeepSearcher (Agentic RAG) vs. Graph RAG<button data-href="#DeepSearcher-Agentic-RAG-vs-Graph-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/blog/graphrag-explained-enhance-rag-with-knowledge-graphs">Graph RAG</a>也能夠處理複雜的查詢，尤其是多跳查詢。那麼，DeepSearcher (Agentic RAG) 與 Graph RAG 有何不同？</p>
<p>Graph RAG 旨在根據明確的關係連結來查詢文件，因此在多跳查詢方面特別強大。例如，在處理長篇小說時，Graph RAG 可以精確地抽取出人物之間錯綜複雜的關係。但是，這種方法需要在資料匯入時使用大量的標記來繪出這些關係，而且其查詢模式傾向於僵化，通常只對單一關係查詢有效。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_7_Graph_RAG_vs_Deep_Searcher_a5c7130374.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>圖 7：Graph RAG vs. DeepSearcher</em></p>
<p>相比之下，Agentic RAG（以 DeepSearcher 為例）採取了根本不同的方法。它最大限度地減少了資料匯入過程中的代幣消耗，而是在查詢處理過程中投入計算資源。這種設計選擇產生了重要的技術折衷：</p>
<ol>
<li><p>降低前期成本：DeepSearcher 對文件的預處理需求較少，因此初始設定速度更快、成本更低。</p></li>
<li><p>動態查詢處理：系統可根據中間發現隨時調整檢索策略</p></li>
<li><p>每次查詢成本較高：每次查詢所需的運算量比 Graph RAG 更多，但卻能提供更靈活的結果</p></li>
</ol>
<p>對開發人員而言，在設計具有不同使用模式的系統時，這種區別至關重要。對於具有可預測查詢模式和高查詢量的應用程式而言，Graph RAG 可能更有效率，而 DeepSearcher 的方法則在需要彈性和處理不可預測的複雜查詢的場合中表現優異。</p>
<p>展望未來，隨著 LLM 成本的下降和推理效能的持續提升，像 DeepSearcher 這樣的 Agentic RAG 系統可能會更加普及。計算成本上的劣勢將會減弱，而靈活性上的優勢則依然存在。</p>
<h2 id="DeepSearcher-vs-Deep-Research" class="common-anchor-header">DeepSearcher vs. Deep Research<button data-href="#DeepSearcher-vs-Deep-Research" class="anchor-icon" translate="no">
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
    </button></h2><p>與 OpenAI 的 Deep Research 不同，DeepSearcher 是專為私人資料的深度擷取與分析量身打造。透過利用向量資料庫，DeepSearcher 可以擷取不同的資料來源、整合各種資料類型，並將它們統一儲存在以向量為基礎的知識儲存庫中。其強大的語義搜尋能力使其能夠高效地搜尋大量離線資料。</p>
<p>此外，DeepSearcher 完全開放原始碼。雖然 Deep Research 在內容生成品質上仍處於領先地位，但它需要支付月費，而且是以封閉源碼的方式運作，這意味著它的內部流程對使用者是隱藏的。相比之下，DeepSearcher 提供了完全的透明度 - 用戶可以檢查程式碼、自訂程式碼以滿足自己的需求，甚至將程式碼部署到自己的生產環境中。</p>
<h2 id="Technical-Insights" class="common-anchor-header">技術洞察<button data-href="#Technical-Insights" class="anchor-icon" translate="no">
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
    </button></h2><p>在 DeepSearcher 的開發和後續迭代過程中，我們收集了幾個重要的技術洞察：</p>
<h3 id="Inference-Models-Effective-but-Not-Infallible" class="common-anchor-header">推理模型：有效但並非無懈可擊</h3><p>我們的實驗顯示，雖然推論模型作為代理表現良好，但有時會過度分析直接的指令，導致消耗過多的代幣和較慢的回應時間。這個觀察與 OpenAI 等主要 AI 供應商的做法一致，他們不再區分推論與非推論模型。相反地，模型服務應該根據節省代幣的特定需求，自動判斷推論的必要性。</p>
<h3 id="The-Imminent-Rise-of-Agentic-RAG" class="common-anchor-header">代理式 RAG 即將崛起</h3><p>從需求的角度來看，深層內容的產生是必要的；從技術的角度來看，提升 RAG 的效能也是至關重要的。長期而言，成本是 Agentic RAG 廣泛採用的主要障礙。然而，隨著 DeepSeek-R1 等高性價比、高品質 LLM 的出現，以及摩爾定律推動的成本下降，推理服務的相關支出有望降低。</p>
<h3 id="The-Hidden-Scaling-Limit-of-Agentic-RAG" class="common-anchor-header">代理 RAG 隱藏的擴充極限</h3><p>我們研究的一個重要發現，是關於效能與計算資源之間的關係。起初，我們假設只要增加迭代次數和代幣分配，就能成正比地改善複雜查詢的結果。</p>
<p>我們的實驗揭示了一個更微妙的現實：雖然效能確實會隨著迭代次數的增加而提升，但我們觀察到明顯的回報遞減。具體來說：</p>
<ul>
<li><p>1 到 3 次迭代的效能大幅提升</p></li>
<li><p>迭代 3 到 5 次的改善幅度不大</p></li>
<li><p>迭代 5 次以上，儘管代幣消耗量大幅增加，增益卻微乎其微</p></li>
</ul>
<p>這個發現對開發人員有重要的影響：單純地在 RAG 系統上投入更多的計算資源並不是最有效率的方法。擷取策略、分解邏輯和合成程序的品質往往比原始迭代次數更重要。這表明開發人員應該專注於優化這些元件，而不是僅僅增加代幣預算。</p>
<h3 id="The-Evolution-Beyond-Traditional-RAG" class="common-anchor-header">超越傳統 RAG 的演進</h3><p>傳統的 RAG 以其低成本、單一擷取的方式提供了寶貴的效率，使其適用於直接的問題解答情境。然而，當處理具有複雜隱含邏輯的查詢時，它的限制就顯而易見了。</p>
<p>考慮一下類似「如何在一年內賺一億」的使用者查詢。傳統的 RAG 系統可能會擷取有關高薪職業或投資策略的內容，但卻很難做到以下幾點：</p>
<ol>
<li><p>識別查詢中不切實際的期望</p></li>
<li><p>將問題分解為可行的子目標</p></li>
<li><p>綜合來自多個領域（商業、金融、創業）的資訊</p></li>
<li><p>提出具有實際時間線的結構化、多路徑方法</p></li>
</ol>
<p>這正是 DeepSearcher 等 Agentic RAG 系統展現其優勢之處。透過分解複雜的查詢並應用多步驟推理，它們可以提供細微、全面的回應，更好地滿足使用者的基本資訊需求。隨著這些系統變得更有效率，我們預期它們會在企業應用程式中加速採用。</p>
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
    </button></h2><p>DeepSearcher 代表了 RAG 系統設計的重大演進，為開發人員提供了一個強大的框架，以建立更複雜的搜尋與研究功能。其主要技術優勢包括</p>
<ol>
<li><p>迭代推理：能夠將複雜的查詢分解為邏輯子步驟，並逐步建立全面的答案</p></li>
<li><p>靈活的架構：支援交換底層模型和自訂推理過程，以符合特定應用程式的需求</p></li>
<li><p>向量資料庫整合：與 Milvus 的無縫連接，可從私人資料來源有效儲存與擷取向量內嵌資料</p></li>
<li><p>透明執行：每個推理步驟的詳細記錄，讓開發人員可以除錯和優化系統行為</p></li>
</ol>
<p>我們的效能測試證實，相較於傳統的 RAG 方法，DeepSearcher 能夠為複雜的查詢提供更優異的結果，但在計算效率上有明顯的折衷。最佳配置（通常約為 3 次迭代）可在準確性與資源消耗之間取得平衡。</p>
<p>隨著 LLM 成本的不斷降低和推理能力的不斷提高，DeepSearcher 中實現的 Agentic RAG 方法在生產應用中將變得越來越實用。對於開發企業搜尋、研究助理或知識管理系統的開發人員而言，DeepSearcher 提供了一個強大的開放原始碼基礎，可以根據特定領域的需求進行客製化。</p>
<p>我們歡迎開發人員社群的貢獻，並邀請您查看我們的<a href="https://github.com/zilliztech/deep-searcher">GitHub 資源庫</a>，探索 RAG 實作的新範例。</p>
