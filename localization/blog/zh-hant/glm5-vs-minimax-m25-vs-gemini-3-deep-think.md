---
id: glm5-vs-minimax-m25-vs-gemini-3-deep-think.md
title: GLM-5 vs. MiniMax M2.5 vs. Gemini 3 深入思考：哪個模型適合您的 AI 代理堆疊？
author: 'Lumina Wang, Julie Xie'
date: 2026-02-14T00:00:00.000Z
cover: assets.zilliz.com/gemini_vs_minimax_vs_glm5_cover_1bc6d20c39.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Gemini, GLM, Minimax, ChatGPT'
meta_keywords: 'Gemini 3, GLM5, Minimax m2.5, ChatGPT'
meta_title: |
  GLM-5 vs MiniMax M2.5 vs Gemini 3 Deep Think Compared
desc: >-
  GLM-5、MiniMax M2.5 和 Gemini 3 Deep Think 在編碼、推理和 AI 代理方面的實作比較。包括使用 Milvus 的
  RAG 教學。
origin: 'https://milvus.io/blog/glm5-vs-minimax-m25-vs-gemini-3-deep-think.md'
---
<p>在短短兩天多的時間內，三個主要機型接連推出：GLM-5、MiniMax M2.5 和 Gemini 3 Deep Think。三者的頭條功能相同：<strong>編碼、深度推理和代理工作流程。</strong>三者都宣稱擁有最先進的成果。如果您仔細閱讀規格表，幾乎可以玩一個配對遊戲，找出三者相同的重點。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/comparsion_minimax_vs_glm5_vs_gemini3_d05715d4c2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>更可怕的是什麼？您的老闆很可能已經看過這些公告，並迫不及待地要您在本週結束前使用這三種機型建立九個內部應用程式。</p>
<p>那麼，這些模式的差異到底在哪裡？您應該如何選擇？以及（一如既往的）如何將它們與<a href="https://milvus.io/">Milvus</a>連接起來，以運行內部知識庫？收藏此頁。這裡有您需要的一切。</p>
<h2 id="GLM-5-MiniMax-M25-and-Gemini-3-Deep-Think-at-a-Glance" class="common-anchor-header">GLM-5、MiniMax M2.5 和 Gemini 3 深度思考一覽<button data-href="#GLM-5-MiniMax-M25-and-Gemini-3-Deep-Think-at-a-Glance" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="GLM-5-leads-in-complex-system-engineering-and-long-horizon-agent-tasks" class="common-anchor-header">GLM-5 在複雜系統工程和長距離代理任務方面領先群倫</h3><p>2 月 12 日，Zhipu 正式推出 GLM-5，該機型在複雜系統工程和長距離代理工作流程中表現出色。</p>
<p>該模型擁有 355B-744B 參數 (40B active)，在 28.5T 記憶體上進行訓練。它將稀疏注意力機制與稱為 Slime 的異步強化學習框架整合在一起，使其能夠在不降低品質的情況下處理超長的情境，同時降低部署成本。</p>
<p>GLM-5 在關鍵基準上領先其他開放原始碼產品，在 SWE-bench Verified (77.8) 和 Terminal Bench 2.0 (56.2) 兩項基準上分別排名第一，領先 MiniMax 2.5 和 Gemini 3 Deep Think。儘管如此，其頭條評分仍落後於 Claude Opus 4.5 和 GPT-5.2 等頂級封閉式機種。在 Vending Bench 2（一項商業模擬評估）中，GLM-5 的模擬年利潤為 4,432 美元，與封閉式系統大致相同。</p>
<p>GLM-5 也對其系統工程和長距離代理能力進行了重大升級。它現在可以將文字或原始資料直接轉換成 .docx、.pdf 和 .xlsx 檔案，並產生特定的交付物，例如產品需求文件、教案、考試、試算表、財務報告、流程圖和選單。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_1_aa8211e962.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_2_151ec06a6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Gemini-3-Deep-Think-sets-a-new-bar-for-scientific-reasoning" class="common-anchor-header">雙子星 3 深度思考」為科學推理設定新標準</h3><p>2026 年 2 月 13 日凌晨，Google 正式發佈 Gemini 3 Deep Think，這是一項重大升級，我（暫時）稱之為地球上最強的研究與推理模型。畢竟，Gemini 是唯一通過洗車測試的模型：「<em>我想洗車，洗車場就在 50 公尺外。我是應該發動我的車開到那裡，還是直接走過去呢</em>？"</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/car_wash_test_gemini_859ee40db8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/car_wash_test_gpt_0ec0dffd4b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>它的核心優勢在於頂級的推理和競賽表現：它在 Codeforces 上的 Elo 值高達 3455，相當於全球第八名的競賽程序員。它在 2025 年國際物理、化學和數學奧林匹克競賽的書面部分達到金牌標準。成本效益是另一項突破。ARC-AGI-1 每項任務僅需 7.17 美元，與 14 個月前 OpenAI 的 o3-preview 相比，降低了 280 倍到 420 倍。在應用方面，Deep Think 最大的成果在於科學研究。專家們已經開始將它用於專業數學論文的同行評審，以及優化複雜的晶體生長製備工作流程。</p>
<h3 id="MiniMax-M25-competes-on-cost-and-speed-for-production-workloads" class="common-anchor-header">MiniMax M2.5 以成本和速度競爭生產工作負載</h3><p>同一天，MiniMax 發佈了 M2.5，將其定位為生產用案例的成本和效率冠軍。</p>
<p>作為業界迭代速度最快的機型系列之一，M2.5 在編碼、工具呼叫、搜尋和辦公生產力方面創造了新的 SOTA 成績。成本是其最大賣點：快速版本的運行速度約為 100 TPS，輸入價格為<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0.30</mn><mi>permilliontokens</mi></mrow><annotation encoding="application/x-tex">，輸出價格為</annotation></semantics></math></span></span>0.<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">30 permilliontokens</span></span></span><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">；輸出價格為</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span></span></span></span>0<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.30 permilliontokens</span></span></span><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">，輸出</annotation></semantics></math></span></span>價格<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">為 2</span></span></span></span>.40<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">permilliontokens</span></span></span></span>。50 TPS 版本可將輸出成本再降低一半。速度比之前的 M2.1 提升 37%，平均 22.8 分鐘即可完成 SWE-bench 驗證任務，與 Claude Opus 4.6 大致相若。在能力方面，M2.5 支援 Go、Rust 和 Kotlin 等十多種語言的全堆疊開發，涵蓋了從零到一的系統設計到完整程式碼檢閱的所有功能。在辦公室工作流程方面，其 Office Skills 功能可與 Word、PPT 和 Excel 進行深度整合。當與金融和法律的領域知識結合時，它可以產生可直接使用的研究報告和財務模型。</p>
<p>這就是高階概述。接下來，讓我們來看看它們在實作測試中的實際表現。</p>
<h2 id="Hands-On-Comparisons" class="common-anchor-header">實際操作比較<button data-href="#Hands-On-Comparisons" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="3D-scene-rendering-Gemini-3-Deep-Think-produces-the-most-realistic-results" class="common-anchor-header">3D 場景渲染：Gemini 3 Deep Think 產生最逼真的結果</h3><p>我們將用戶已經在 Gemini 3 Deep Think 上測試過的提示，透過 GLM-5 和 MiniMax M2.5 進行直接比較。提示：在單一 HTML 檔案中建立完整的 Three.js 場景，渲染出與博物館中古典油畫無異的全 3D 室內景觀。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/emily_instgram_0af85c65fb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>雙子星 3 深度思考</p>
<iframe width="352" height="625" src="https://www.youtube.com/embed/Lhg-XsIM_CQ" title="gemini3 deep think test: 3D redering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>GLM-5</p>
<iframe width="707" height="561" src="https://www.youtube.com/embed/tTuW7qQBO1Y" title="GLM 5 test: 3D scene rendering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>MiniMax M2.5</p>
<iframe width="594" height="561" src="https://www.youtube.com/embed/KJMhnXqa4Uc" title="minimax m2.5 test: 3D scene rendering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p><strong>Gemini 3 Deep Think</strong>提供了最強大的結果。它精確地詮釋了提示，並產生了高品質的 3D 場景。照明效果最為突出：陰影的方向和落差看起來很自然，清楚地表達出自然光從窗戶射入的空間關係。精細的細節也令人印象深刻，包括蠟燭半融化的紋理和紅色蠟封的材質。整體的視覺保真度很高。</p>
<p><strong>GLM-5</strong>製作了詳細的物件建模和紋理工作，但其照明系統有明顯的問題。桌子的陰影呈現為堅硬的純黑色區塊，沒有柔和的轉換。蠟封似乎懸浮在桌面表面，無法正確處理物件與桌面之間的接觸關係。這些假象顯示在全局照明和空間推理方面還有改進的空間。</p>
<p><strong>MiniMax M2.5</strong>無法有效解析複雜的場景描述。其輸出只是無序的粒子運動，顯示在處理具有精確視覺需求的多層語意指令時，在理解與產生兩方面都有顯著的限制。</p>
<h3 id="SVG-generation-all-three-models-handle-it-differently" class="common-anchor-header">SVG 生成：三種模型的處理方式都不同</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/simon_twitter_screenshot_fef1c01cbf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>提示：</strong>生成一個加州棕鵜鶘騎自行車的 SVG。自行車必須有輻條和形狀正確的車架。鵜鶘必須有它特有的大袋子，而且應該清楚顯示羽毛。鵜鶘必須清楚地踩著腳踏車。圖片應顯示出加州褐鵜鶘的完整繁殖羽色。</p>
<p><strong>雙子星 3 深度思考</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/gemini_3_generated_image_182aaefe26.png" alt="Gemini 3 Deep Think" class="doc-image" id="gemini-3-deep-think" />
   </span> <span class="img-wrapper"> <span>雙子星 3 深度思考</span> </span></p>
<p><strong>GLM-5</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/GLM_5_generated_image_e84302d987.png" alt="GLM-5" class="doc-image" id="glm-5" />
   </span> <span class="img-wrapper"> <span>GLM-5</span> </span></p>
<p><strong>MiniMax M2.5</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/minimax_m2_5_generated_image_06d50f8fa7.png" alt="MiniMax M2.5" class="doc-image" id="minimax-m2.5" />
   </span> <span class="img-wrapper"> <span>MiniMax M2.5</span> </span></p>
<p><strong>Gemini 3 Deep Think</strong>製作了最完整的 SVG。鵜鶘的騎乘姿勢非常準確：它的重心自然地落在座椅上，雙腳放在踏板上，呈現動態的騎乘姿勢。羽毛紋理細緻且有層次感。唯一的弱點是鵜鶘招牌式的喉袋畫得太大，稍微偏離了整體比例。</p>
<p><strong>GLM-5</strong>有明顯的姿勢問題。雙腳正確地放在踏板上，但整體坐姿偏離了自然的騎乘姿勢，而且身體與座椅的關係看起來也不對稱。儘管如此，它的細部做工還是很扎實：喉袋的比例很好，羽毛紋理的品質也值得尊敬。</p>
<p><strong>MiniMax M2.5</strong>採用簡約風格，完全跳過背景元素。鵜鶘在腳踏車上的位置大致正確，但細部處理卻有不足。手把的形狀不對，羽毛的紋理幾乎不存在，頸部太粗，圖像中還有一些不該有的白色橢圓形雜質。</p>
<h2 id="How-to-Choose-Between-GLM-5-MiniMax-M25-and-Gemin-3-Deep-Think" class="common-anchor-header">如何在 GLM-5、MiniMax M2.5 和 Gemin 3 Deep Think 之間做出選擇<button data-href="#How-to-Choose-Between-GLM-5-MiniMax-M25-and-Gemin-3-Deep-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>在我們所有的測試中，MiniMax M2.5 產生輸出的速度最慢，需要最長的思考和推理時間。GLM-5 表現穩定，速度與 Gemini 3 Deep Think 大致相同。</p>
<p>以下是我們整理的快速選擇指南：</p>
<table>
<thead>
<tr><th>核心使用個案</th><th>推薦模型</th><th>主要優勢</th></tr>
</thead>
<tbody>
<tr><td>科學研究、進階推理 (物理、化學、數學、複雜演算法設計)</td><td>雙子星 3 深度思考</td><td>學術競賽的金牌表現。頂級科學資料驗證。Codeforces 上世界級的競爭程式設計。經過驗證的研究應用，包括識別專業論文的邏輯瑕疵。(目前僅限於 Google AI Ultra 訂閱者與特定企業使用者；每項任務成本相對較高)。</td></tr>
<tr><td>開放原始碼部署、企業內部網客製化、全堆疊開發、辦公室技能整合</td><td>智璞 GLM-5</td><td>排名第一的開源模式。強大的系統層級工程能力。支援本地部署，成本可控。</td></tr>
<tr><td>成本敏感型工作負載、多語言程式設計、跨平台開發 (Web/Android/iOS/Windows)、辦公室相容性</td><td>MiniMax M2.5</td><td>在 100 TPS 時：<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">每百萬</annotation><mrow><mn>輸</mn><mi>入</mi><mn>代碼 0.30</mn></mrow><annotation encoding="application/x-tex">，</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord"></span></span></span><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">每百</annotation><mrow><mn>萬輸入</mn></mrow></semantics></math></span></span>代碼 0.<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">30</span><span class="mpunct">，</span></span></span></span>每百萬輸出代碼 2.40。SOTA 橫跨辦公室、編碼和工具呼叫基準。在 Multi-SWE-Bench 中排名第一。通用性強。Droid/OpenCode 的通過率超過 Claude Opus 4.6。</td></tr>
</tbody>
</table>
<h2 id="RAG-Tutorial-Wire-Up-GLM-5-with-Milvus-for-a-Knowledge-Base" class="common-anchor-header">RAG 教學：將 GLM-5 與 Milvus 連線以建立知識庫<button data-href="#RAG-Tutorial-Wire-Up-GLM-5-with-Milvus-for-a-Knowledge-Base" class="anchor-icon" translate="no">
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
    </button></h2><p>GLM-5 與 MiniMax M2.5 都可透過<a href="https://openrouter.ai/">OpenRouter</a> 取得。註冊並建立<code translate="no">OPENROUTER_API_KEY</code> 即可開始使用。</p>
<p>本教學使用 Zhipu 的 GLM-5 作為 LLM 的範例。若要改用 MiniMax，只需將模型名稱換成<code translate="no">minimax/minimax-m2.5</code> 。</p>
<h3 id="Dependencies-and-environment-setup" class="common-anchor-header">相依性與環境設定</h3><p>安裝或升級 pymilvus、openai、requests 和 tqdm 至最新版本：</p>
<pre><code translate="no">pip install --upgrade pymilvus openai requests tqdm 
<button class="copy-code-btn"></button></code></pre>
<p>本教學使用 GLM-5 作為 LLM，並以 OpenAI 的 text-embedding-3-small 作為嵌入模型。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>] = <span class="hljs-string">&quot;**********&quot;</span> 
<button class="copy-code-btn"></button></code></pre>
<h3 id="Data-preparation" class="common-anchor-header">資料準備</h3><p>我們將使用 Milvus 2.4.x 文件中的 FAQ 頁面作為我們的私人知識庫。</p>
<p>下載 zip 檔案並將文件解壓縮到<code translate="no">milvus_docs</code> 資料夾：</p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>從<code translate="no">milvus_docs/en/faq</code> 載入所有 Markdown 檔案。我們在<code translate="no">&quot;# &quot;</code> 上分割每個檔案，大致將內容以主要部分區分：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="LLM-and-embedding-model-setup" class="common-anchor-header">LLM 與嵌入模型設定</h3><p>我們會使用 GLM-5 作為 LLM，並使用 text-embedding-3-small 作為嵌入模型：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>
glm_client = <span class="hljs-title class_">OpenAI</span>(
    api_key=os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>],
    base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>產生測試的 embedding，並列印其尺寸和前幾個元素：</p>
<pre><code translate="no">EMBEDDING_MODEL = <span class="hljs-string">&quot;openai/text-embedding-3-small&quot;</span>  <span class="hljs-comment"># OpenRouter embedding model</span>
resp = glm_client.embeddings.create(
    model=EMBEDDING_MODEL,
    <span class="hljs-built_in">input</span>=[<span class="hljs-string">&quot;This is a test1&quot;</span>, <span class="hljs-string">&quot;This is a test2&quot;</span>],
)
test_embeddings = [d.embedding <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> resp.data]
embedding_dim = <span class="hljs-built_in">len</span>(test_embeddings[<span class="hljs-number">0</span>])
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embeddings[<span class="hljs-number">0</span>][:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>輸出：</p>
<pre><code translate="no"><span class="hljs-number">1536</span>
[<span class="hljs-meta">0.010637564584612846, -0.017222722992300987, 0.05409347265958786, -0.04377825930714607, -0.017545074224472046, -0.04196695610880852, -0.0011963422875851393, 0.03837504982948303, 0.0008855042979121208, 0.015181170776486397</span>]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Load-data-into-Milvus" class="common-anchor-header">將資料載入 Milvus</h3><p><strong>建立一個集合：</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>關於 MilvusClient 配置的說明：</p>
<ul>
<li><p>將 URI 設定為本機檔案 (例如<code translate="no">./milvus.db</code>) 是最簡單的選項。它會自動使用 Milvus Lite 來儲存該檔案中的所有資料。</p></li>
<li><p>對於大型資料，您可以在 Docker 或 Kubernetes 上部署效能更高的 Milvus 伺服器。在這種情況下，請使用伺服器 URI (例如：<code translate="no">http://localhost:19530</code>)。</p></li>
<li><p>若要使用 Zilliz Cloud（Milvus 的完全管理雲端版本），請從 Zilliz Cloud 主控台將 URI 和 token 設定為 Public Endpoint 和 API key。</p></li>
</ul>
<p>檢查資料集是否已存在，若已存在，請將其刪除：</p>
<pre><code translate="no">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>使用指定的參數建立新的集合。如果您沒有提供欄位定義，Milvus 會自動建立預設的<code translate="no">id</code> 欄位作為主索引鍵，並為向量資料建立<code translate="no">vector</code> 欄位。保留的 JSON 欄位儲存模式中未定義的任何欄位和值：</p>
<pre><code translate="no">milvus_client.<span class="hljs-title function_">create_collection</span>(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Insert-data" class="common-anchor-header">插入資料</h3><p>遍歷文字行，產生嵌入，並將資料插入 Milvus。這裡的<code translate="no">text</code> 欄位並沒有在模式中定義。它是由 Milvus 的保留 JSON 欄位支援自動新增的動態欄位：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm
data = []
resp = glm_client.embeddings.create(model=EMBEDDING_MODEL, <span class="hljs-built_in">input</span>=text_lines)
doc_embeddings = [d.embedding <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> resp.data]
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>輸出：</p>
<pre><code translate="no">Creating embeddings: 100%|██████████████████████████| 72/72 [00:00&lt;00:00, 125203.10it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, ..., 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Build-the-RAG-pipeline" class="common-anchor-header">建立 RAG 管道</h3><p><strong>擷取相關文件：</strong></p>
<p>讓我們提出一個關於 Milvus 的常見問題：</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>在資料集中搜尋前 3 個最相關的結果：</p>
<pre><code translate="no">resp = glm_client.embeddings.create(model=EMBEDDING_MODEL, <span class="hljs-built_in">input</span>=[question])
question_embedding = resp.data[<span class="hljs-number">0</span>].embedding
search_res = milvus_client.search(
    collection_name=collection_name,
    data=[question_embedding],
    limit=<span class="hljs-number">3</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>結果依距離排序，最近的在前：</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))

[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including MinIO, AWS S3, Google Cloud Storage (GCS), Azure Blob Storage, Alibaba Cloud OSS, and Tencent Cloud Object Storage (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.7826977372169495</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6772387027740479</span>
    ],
    [
        <span class="hljs-string">&quot;How much does Milvus cost?\n\nMilvus is a 100% free open-source project.\n\nPlease adhere to Apache License 2.0 when using Milvus for production or distribution purposes.\n\nZilliz, the company behind Milvus, also offers a fully managed cloud version of the platform for those that don&#x27;t want to build and maintain their own distributed instance. Zilliz Cloud automatically maintains data reliability and allows users to pay only for what they use.\n\n###&quot;</span>,
        <span class="hljs-number">0.6467022895812988</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<p><strong>使用 LLM 產生回應：</strong></p>
<p>將擷取的文件結合為上下文字串：</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>設定系統和使用者提示。從 Milvus 擷取的文件建立使用者提示：</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You can find answers to the questions in the contextual passage snippets provided.
&quot;&quot;&quot;</span>
USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.
&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;
&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>呼叫 GLM-5 產生最終答案：</p>
<pre><code translate="no">response = glm_client.chat.completions.create(
    model=<span class="hljs-string">&quot;z-ai/glm-5&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<p>GLM-5 會傳回一個結構良好的答案：</p>
<pre><code translate="no">Based <span class="hljs-keyword">on</span> the provided context, Milvus stores data <span class="hljs-keyword">in</span> two main ways, depending <span class="hljs-keyword">on</span> the data type:

<span class="hljs-number">1.</span> Inserted Data
   - What it includes: vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema.
   - How it <span class="hljs-keyword">is</span> stored: <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> an incremental log.
   - Storage Backends: Milvus supports multiple <span class="hljs-built_in">object</span> storage backends, including MinIO, AWS S3, <span class="hljs-function">Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>), Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>).
   - Vector Specifics: vector data can be stored <span class="hljs-keyword">as</span> Binary <span class="hljs-title">vectors</span> (<span class="hljs-params">sequences of <span class="hljs-number">0</span>s <span class="hljs-keyword">and</span> <span class="hljs-number">1</span>s</span>), Float32 <span class="hljs-title">vectors</span> (<span class="hljs-params"><span class="hljs-literal">default</span> storage</span>), <span class="hljs-keyword">or</span> Float16 <span class="hljs-keyword">and</span> BFloat16 <span class="hljs-title">vectors</span> (<span class="hljs-params">offering reduced precision <span class="hljs-keyword">and</span> memory usage</span>).

2. Metadata
   - What it includes: data generated within Milvus modules.
   - How it <span class="hljs-keyword">is</span> stored: <span class="hljs-keyword">in</span> etcd.
</span><button class="copy-code-btn"></button></code></pre>
<h2 id="Conclusion-Pick-the-Model-Then-Build-the-Pipeline" class="common-anchor-header">結論：選擇模型，然後建構管道<button data-href="#Conclusion-Pick-the-Model-Then-Build-the-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>這三種模型都很強，但它們的強項不同。當推理深度比成本更重要時，Gemini 3 Deep Think 是最佳選擇。對於需要本地部署和系統層級工程的團隊而言，GLM-5 是最佳的開放原始碼選擇。MiniMax M2.5 在您需要優化生產工作負載的吞吐量和預算時，是合理的選擇。</p>
<p>您選擇的機型只是等式的一半。要將任何一種模式轉換成有用的應用程式，您需要一個可隨資料擴充的檢索層。這正是 Milvus 的用武之地。上述 RAG 教學適用於任何與 OpenAI 相容的模型，因此在 GLM-5、MiniMax M2.5 或任何未來版本之間切換，只需變更一行即可。</p>
<p>如果您正在設計本機或 on-prem AI 代理，並想要更詳細地討論儲存架構、會話設計或安全回滾，歡迎加入我們的<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack 頻道</a>。您也可以透過<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>預約 20 分鐘的一對一個案，以獲得個人化的指導。</p>
<p>如果您想要更深入地瞭解建立 AI 代理，這裡有更多資源可以幫助您入門。</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md">如何使用 Agno 和 Milvus 建立生產就緒的多代理系統</a></p></li>
<li><p><a href="https://zilliz.com/learn">為您的 RAG 管道選擇正確的嵌入模型</a></p></li>
<li><p><a href="https://zilliz.com/learn">如何使用 Milvus 建立 AI Agent</a></p></li>
<li><p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">什麼是 OpenClaw？開放原始碼 AI Agent 完整指南</a></p></li>
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">OpenClaw 教學：連接至 Slack 以取得本地 AI 助理</a></p></li>
<li><p><a href="https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md">使用 LangGraph 與 Milvus 建立 Clawdbot 式 AI 代理程式</a></p></li>
</ul>
