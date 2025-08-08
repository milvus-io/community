---
id: gpt-5-review-accuracy-up-prices-down-code-strong-but-bad-for-creativity.md
title: GPT-5 評論：精確度提升、價格下調、程式碼強大 - 但對創意不利
author: Lumina Wang
date: 2025-08-08T00:00:00.000Z
cover: assets.zilliz.com/gpt_5_review_7df71f395a.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, OpenAI, gpt-5'
meta_keywords: 'Milvus, gpt-5, openai, chatgpt'
meta_title: |
  GPT-5 Review: Accuracy Up, Prices Down, Code Strong, Bad Creativity
desc: 對開發人員來說，尤其是那些建立代理和 RAG 管道的人，這個版本可能是迄今為止最有用的升級。
origin: >-
  https://milvus.io/blog/gpt-5-review-accuracy-up-prices-down-code-strong-but-bad-for-creativity.md
---
<p><strong>經過幾個月的揣測，OpenAI 終於發佈了</strong> <a href="https://openai.com/gpt-5/"><strong>GPT-5</strong></a><strong>。</strong>這個模型並不如 GPT-4 般有創意，但對於開發人員，尤其是那些建立代理和 RAG 管道的人來說，這個版本可能是迄今為止最有用的升級。</p>
<p><strong>對於建置者而言，TL;DR：</strong>GPT-5 統一了架構、增強了多模式 I/O、減少了事實上的錯誤率、將上下文擴展至 400k tokens，並讓大規模使用變得更經濟實惠。然而，創造力與文學風格卻明顯退步。</p>
<h2 id="What’s-New-Under-the-Hood" class="common-anchor-header">引擎蓋下的新功能？<button data-href="#What’s-New-Under-the-Hood" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p><strong>統一核心</strong>- 將 GPT 數位系列與 o 系列推理模型合併，在單一架構中提供長鏈推理加上多模態。</p></li>
<li><p><strong>全頻譜多模式</strong>- 輸入/輸出文字、影像、音訊和視訊，全部都在同一個模型中。</p></li>
<li><p><strong>大幅提升精確度</strong>：</p>
<ul>
<li><p><code translate="no">gpt-5-main</code>:與 GPT-4o 相比，事實錯誤減少 44%。</p></li>
<li><p><code translate="no">gpt-5-thinking</code>：與 GPT-4o 相比，事實錯誤減少 78%。</p></li>
</ul></li>
<li><p><strong>領域技能提升</strong>- 在代碼產生、數學推理、健康諮詢和結構化寫作方面更強；幻覺顯著減少。</p></li>
</ul>
<p>除了 GPT-5，OpenAI 還發布了<strong>另外三個變體</strong>，每個<strong>變體</strong>都針對不同的需求進行了優化：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt_5_family_99a9bee18a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<table>
<thead>
<tr><th><strong>模型</strong></th><th><strong>說明</strong></th><th><strong>輸入 / $ 每 100 萬字元</strong></th><th><strong>輸出 / $ 每 1M 代幣</strong></th><th><strong>知識更新</strong></th></tr>
</thead>
<tbody>
<tr><td>gpt-5</td><td>主要模型，長鏈推理 + 全多模態</td><td>$1.25</td><td>$10.00</td><td>2024-10-01</td></tr>
<tr><td>gpt-5 聊天</td><td>等同於 gpt-5，用於 ChatGPT 會話</td><td>-</td><td>-</td><td>2024-10-01</td></tr>
<tr><td>gpt-5-mini</td><td>便宜 60%，保留 ~90% 的程式效能</td><td>$0.25</td><td>$2.00</td><td>2024-05-31</td></tr>
<tr><td>gpt-5-nano</td><td>邊緣/離線、32K 上下文、延遲 &lt;40ms</td><td>$0.05</td><td>$0.40</td><td>2024-05-31</td></tr>
</tbody>
</table>
<p>GPT-5 打破了 25 個基準類別的記錄 - 從程式碼修補、多模態推理到醫療任務 - 精確度持續提升。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_1_8ebf1bed4b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_2_c43781126f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-Developers-Should-Care--Especially-for-RAG--Agents" class="common-anchor-header">開發人員應該關心的原因 - 尤其是 RAG 與代理商<button data-href="#Why-Developers-Should-Care--Especially-for-RAG--Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>我們的實際測試顯示，這個版本對於 Retrieval-Augmented Generation 和代理程式驅動的工作流程來說，是一場靜悄悄的革命。</p>
<ol>
<li><p><strong>降價</strong>讓實驗變得可行 - API<strong><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>輸入</mi></mrow></semantics></math></span></span></strong>成本<strong><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo>：</mo></mrow><annotation encoding="application/x-tex">每百</annotation><mrow><mn>萬個代幣 1.</mn><mo>25</mo><mn>∗∗</mn><mo separator="true">;</mo><mi>輸出成本</mi><mo>：</mo><mo>∗</mo></mrow></semantics></math></span></span></strong>∗<strong><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">每百萬個代幣</annotation></semantics></math></span></span></strong> 1<strong><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">.25**;輸出成本：**</annotation></semantics></math></span></span></strong><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span> 1<strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.</span><span class="mord mathnormal">25permilliontokens</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∗</span></span></span></span></strong><span class="mspace" style="margin-right:0.2222em;"></span> <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8095em;vertical-align:-0.1944em;"></span> ∗</span></span></span></strong> <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mpunct">;</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">outputcost</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span></span></strong>:<strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.4653em;"></span> ∗∗</span></span></span></strong> <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">10</span></span></span></span></strong>。</p></li>
<li><p><strong>400k 上下文視窗</strong>(相較於 o3/4o 的 128<strong>k</strong>)，可讓您在複雜的多步驟代理工作流程中維持狀態，而無需切換上下文。</p></li>
<li><p><strong>更少的幻覺和更好的工具使用</strong>- 支援多步驟鏈狀工具呼叫、處理複雜的非標準任務，並提高執行可靠性。</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt_tool_call_e6a86fc59c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Not-Without-Flaws" class="common-anchor-header">並非沒有缺點<button data-href="#Not-Without-Flaws" class="anchor-icon" translate="no">
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
    </button></h2><p>儘管有技術上的進步，GPT-5 仍顯示出明顯的限制。</p>
<p>在發佈會上，OpenAI 的主題演講中有一張幻燈片奇異地計算出<em>52.8 &gt; 69.1 = 30.8</em>，而在我們自己的測試中，該模型自信地重複了教科書上對飛機升空的錯誤解釋「伯努利效應」，提醒我們<strong>它仍然是一個模式學習者，而非真正的領域專家。</strong></p>
<p><strong>在 STEM 表現更銳利的同時，創造力的深度卻在下滑。</strong>許多長期使用者注意到文學風格的衰退：詩歌感覺較平淡、哲學對話較不細緻、長篇敘述較機械化。這樣的取捨是很明顯的 - 在技術領域上有更高的事實正確性和更強的推理能力，但卻犧牲了藝術性、探索性的語調，而這種語調曾經讓 GPT 幾近人性化。</p>
<p>有鑑於此，讓我們來看看 GPT-5 在實際測試中的表現如何。</p>
<h2 id="Coding-Tests" class="common-anchor-header">編碼測試<button data-href="#Coding-Tests" class="anchor-icon" translate="no">
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
    </button></h2><p>我從一個簡單的任務開始：寫一個 HTML 腳本，讓使用者可以上傳一張圖片，然後用滑鼠移動它。GPT-5 暫停了大約 9 秒鐘，然後產生了可以很好處理互動的工作程式碼。我覺得這是個好的開始。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt52_7b04c9b41b.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>第二個任務更困難：在旋轉的六角形中實作多邊球碰撞偵測，並可調整旋轉速度、彈性和球數。GPT-5 在大約 13 秒內產生了第一個版本。程式碼包含了所有預期的功能，但是有 bug 而且無法執行。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_6_3e6a34572a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>之後我使用編輯器的<strong>修正</strong>錯誤選項，GPT-5 修正了錯誤，因此六角形得以呈現。然而，小球從未出現 - 產卵邏輯遺失或不正確，這表示儘管設定完整，程式的核心功能卻不存在。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt51_6489df9914.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>總而言之，</strong>GPT-5 可以產生乾淨、結構良好的互動程式碼，並從簡單的執行時錯誤中復原。但在複雜的情況下，它仍有遺漏重要邏輯的風險，因此在部署之前，人為的審查和反覆是必要的。</p>
<h2 id="Reasoning-Test" class="common-anchor-header">推理測試<button data-href="#Reasoning-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>我提出了一個涉及商品顏色、價格和位置線索的多步邏輯謎題--大多數人需要花幾分鐘才能解決。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/reasoning_test_7ea15ed25b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>問題：</strong> <em>藍色物品是什麼，它的價格是多少？</em></p>
<p>GPT-5 在短短 9 秒內就提供了正確的答案，並提供了清晰且邏輯合理的解釋。這項測試強化了模型在結構化推理和快速演繹方面的優勢。</p>
<h2 id="Writing-Test" class="common-anchor-header">寫作測試<button data-href="#Writing-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>我經常向 ChatGPT 求助部落格、社群媒體文章和其他書面內容，因此文字產生是我最關心的能力之一。在這次測試中，我要求 GPT-5 以一篇關於 Milvus 2.6 多語種分析器的部落格為基礎，建立一篇 LinkedIn 帖子。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Writing_Test_4fe5fef775.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>輸出的內容組織得很好，也點出了原始部落格的所有重點，但感覺太正式、太可預測，更像是企業的新聞稿，而不是要在社群飼料上引起興趣的東西。它缺乏溫暖、節奏和個性，而這些都讓一篇文章感覺人性化和吸引人。</p>
<p>好的一面是，隨附的插圖非常出色：清晰、符合品牌，與 Zilliz 的科技風格完美結合。從視覺上來看，這是非常正確的，只是文字需要更多的創意能量來配合。</p>
<h2 id="Longer-Context-Window--Death-of-RAG-and-VectorDB" class="common-anchor-header">更長的上下文視窗 = RAG 和 VectorDB 之死？<button data-href="#Longer-Context-Window--Death-of-RAG-and-VectorDB" class="anchor-icon" translate="no">
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
    </button></h2><p>去年，當<a href="https://zilliz.com/blog/will-retrieval-augmented-generation-RAG-be-killed-by-long-context-LLMs">Google 推出<strong>Gemini 1.5 Pro</strong></a>超長的 10M-token 上下文視窗時，我們曾討論過這個話題。當時，有些人很快就預測 RAG 的末日，甚至是資料庫的末日。快進到今天：RAG 不僅還活著，而且正蓬勃發展。在實務上，它與<a href="https://milvus.io/"><strong>Milvus</strong></a>和<a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a> 等向量資料庫一起，變得<em>更有</em>能力和生產力。</p>
<p>現在，隨著 GPT-5 的上下文長度擴充，以及更先進的工具呼叫功能，問題又冒了出來：<em>我們是否仍然需要向量資料庫來進行上下文擷取，甚至是專用的代理/RAG 管線？</em></p>
<p><strong>簡短的答案是：絕對需要。我們仍然需要它們。</strong></p>
<p>較長的上下文很有用，但不能取代結構化檢索。多代理系統仍將成為長期架構趨勢，而且這些系統通常需要幾乎無限制的上下文。此外，在安全管理隱私、非結構化資料時，向量資料庫永遠是最後的把關者。</p>
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
    </button></h2><p>在觀看了 OpenAI 的發佈會，並親自上手測試之後，我覺得 GPT-5 並不像是一個戲劇性的躍進，而更像是過去優勢的精煉融合，再加上一些適當的升級。這並非一件壞事，而是大型模型開始遇到架構和資料品質限制的跡象。</p>
<p>俗語有云：<em>嚴厲的批評來自過高的期望</em>。圍繞 GPT-5 的任何失望大多來自 OpenAI 為自己設定的極高標準。事實上，更高的準確度、更低的價格以及整合的多模態支援仍然是很有價值的優點。對於建立代理與 RAG 管道的開發人員而言，這可能是目前最有用的升級。</p>
<p>有些朋友開玩笑說要為 GPT-4o 做「線上紀念」，聲稱他們以前聊天夥伴的個性已經一去不返了。我並不介意這種改變，GPT-5 也許不那麼熱情健談，但它直接、不拖泥帶水的風格讓人感覺耳目一新。</p>
<p><strong>您呢？</strong>與我們分享您的想法-加入我們的<a href="https://discord.com/invite/8uyFbECzPX">Discord</a>，或加入<a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a>和<a href="https://x.com/milvusio">X</a> 上的對話。</p>
