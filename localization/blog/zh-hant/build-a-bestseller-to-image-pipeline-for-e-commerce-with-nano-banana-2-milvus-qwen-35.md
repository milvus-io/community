---
id: >-
  build-a-bestseller-to-image-pipeline-for-e-commerce-with-nano-banana-2-milvus-qwen-35.md
title: 使用 Nano Banana 2 + Milvus + Qwen 3.5 建立電子商務的暢銷書到圖片管道
author: Lumina Wang
date: 2026-3-3
cover: assets.zilliz.com/blog-images/20260303-100432.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: >-
  Nano Banana 2, Milvus, e-commerce AI image generation, AI product photography,
  vector search
meta_keywords: >-
  Nano Banana 2, Milvus, e-commerce AI image generation, AI product photography,
  vector search
meta_title: |
  Nano Banana 2 + Milvus: E-Commerce AI Image Generation Tutorial
desc: 逐步教學：使用 Nano Banana 2、Milvus 混合搜尋和 Qwen 3.5，以 1/3 的成本從平面圖生成電子商務產品照片。
origin: >-
  https://milvus.io/blog/build-a-bestseller-to-image-pipeline-for-e-commerce-with-nano-banana-2-milvus-qwen-35.md
---
<p>如果您為電子商務賣家建立 AI 工具，您可能已經聽過上千次這樣的要求："我有一個新產品。給我一張宣傳圖片，讓它看起來像暢銷書中的圖片。不需要攝影師，不需要攝影棚，而且要便宜"。</p>
<p>這就是問題所在。賣家有平面照片和已經有轉換率的暢銷書目錄。他們希望用 AI 橋樑這兩者，既快速又有規模。</p>
<p>當 Google 在 2026 年 2 月 26 日發佈 Nano Banana 2 (Gemini 3.1 Flash Image) 時，我們在同一天進行了測試，並將其整合到我們現有的以 Milvus 為基礎的檢索管道中。結果是：影像產生的總成本降至之前的大約三分之一，而吞吐量則增加了一倍。每張圖片的降價（比 Nano Banana Pro 便宜約 50%）是部分原因，但更大的節省來自於完全消除了返工週期。</p>
<p>這篇文章涵蓋了 Nano Banana 2 在電子商務方面的優點、不足之處，以及完整流程的實作教學：<strong>Milvus</strong>混合式搜尋可找出視覺上相似的暢銷品，<strong>Qwen</strong>3.5 用於風格分析，而<strong>Nano Banana 2</strong>則用於最終生成。</p>
<h2 id="What’s-New-with-Nano-Banana-2" class="common-anchor-header">Nano Banana 2 有什麼新功能？<button data-href="#What’s-New-with-Nano-Banana-2" class="anchor-icon" translate="no">
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
    </button></h2><p>Nano Banana 2 (Gemini 3.1 Flash Image) 於 2026 年 2 月 26 日推出。它將 Nano Banana Pro 的大部分功能帶入 Flash 架構，意即以更低的價格提供更快的生成速度。以下是主要的升級：</p>
<ul>
<li><strong>以 Flash 速度達到專業級品質。</strong>Nano Banana 2 提供之前 Pro 獨有的世界級知識、推理和視覺保真度，但具有 Flash 的延遲和吞吐量。</li>
<li><strong>512px 至 4K 輸出。</strong>四個解析度層級 (512px、1K、2K、4K)，提供原生支援。512px 解析度是 Nano Banana 2 獨有的全新解析度。</li>
<li><strong>14 種長寬比。</strong>在現有的基礎上新增 4:1、1:4、8:1 和 1:8（1:1、2:3、3:2、3:4、4:3、4:5、5:4、9:16、16:9、21:9）。</li>
<li><strong>最多 14 個參考影像。</strong>在單一工作流程中，最多可維持 5 個角色的相似度，以及最多 14 個物件的真實度。</li>
<li><strong>改進的文字渲染。</strong>可產生多國語言清晰、準確的影像內文字，並支援在單次產生中進行翻譯和本地化。</li>
<li><strong>圖像搜尋基礎。</strong>從即時網路資料和 Google 搜尋擷取影像，以產生更精確的真實世界主題描述。</li>
<li><strong>每張圖片便宜 ~50%。</strong>解析度為 1K：<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0.</mn></mrow><annotation encoding="application/x-tex">067versusPro′s0.067 對比 Pro 的</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7519em;"></span></span></span></span>0.<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mord mathnormal">067versusPro</span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">′</span></span></span><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>s0</mn></mrow></semantics></math></span></span>.134。</li>
</ul>
<p><strong>Nano Banano 2 的趣味使用案例：根據簡單的 Google 地圖截圖產生位置感知全景圖</strong></p>
<p>給出 Google Maps 螢幕截圖和樣式提示，模型會辨識地理環境，並產生保留正確空間關係的全景圖。這對於製作針對地區的廣告創意（巴黎咖啡館背景、東京街景）非常有用，而無需採購圖庫照片。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>如需完整功能集，請參閱<a href="https://blog.google/innovation-and-ai/technology/ai/nano-banana-2/">Google 的公告部落</a>格和開<a href="https://ai.google.dev/gemini-api/docs/image-generation">發人員文件</a>。</p>
<h2 id="What-Does-This-Nano-Banana-Update-Mean-For-E-Commerce" class="common-anchor-header">Nano Banana 更新對電子商務意味著什麼？<button data-href="#What-Does-This-Nano-Banana-Update-Mean-For-E-Commerce" class="anchor-icon" translate="no">
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
    </button></h2><p>電子商務是圖像最密集的產業之一。產品清單、市場廣告、社群創意、橫幅廣告、本地化店面：每個通路都需要源源不絕的視覺資產，而每個資產都有自己的規格。</p>
<p>電子商務中 AI 影像產生的核心需求可歸結為以下幾點：</p>
<ul>
<li><strong>保持低成本</strong>- 每張圖片的成本必須符合目錄規模。</li>
<li><strong>與暢銷商品的外觀相匹配</strong>- 新的圖片應該與已經有轉換率的商品的視覺風格一致。</li>
<li><strong>避免侵權</strong>- 不複製競爭對手的創意或重複使用受保護的資產。</li>
</ul>
<p>除此之外，跨境賣家還需要</p>
<ul>
<li><strong>多平台格式支援</strong>- 市集、廣告和店面有不同的長寬比和規格。</li>
<li><strong>多國</strong>語言<strong>文字渲染</strong>- 跨多國語言的簡潔、精準影像內文字。</li>
</ul>
<p>Nano Banana 2 幾乎可以滿足所有需求。以下各節將解釋各項升級的實際意義：直接解決電子商務的痛點、不足之處，以及對實際成本的影響。</p>
<h3 id="Cut-Output-Generation-Costs-by-Up-to-60" class="common-anchor-header">減少高達 60% 的輸出生成成本</h3><p>在 1K 解析度下，Nano Banana 2<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">每張圖片的</annotation></semantics></math></span></span>價格為<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0.</mn></mrow><annotation encoding="application/x-tex">067</annotation><mrow><mn>perimageversusPro</mn><mi>′</mi><mn>s0</mn></mrow></semantics></math></span></span>.<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">067</span></span></span></span>，<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">而 Pro 的</annotation></semantics></math></span></span>價格為<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.9463em;vertical-align:-0.1944em;"></span><span class="mord">0.</span><span class="mord"><span class="mord mathnormal">067perimageversusPro</span></span></span></span></span><span class="pstrut" style="height:2.7em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.7519em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">′</span></span></span></span></span></span></span></span></span><span class="mord mathnormal">s0</span></span></span></span>.134，直接降低了 50%。但每張圖片的價格只是故事的一半。以前扼殺使用者預算的是返工。每個市場都有自己的圖像規格 (Amazon 為 1:1，Shopify 店面為 3:4，橫幅廣告為超寬)，而製作每個變體都意味著要經過獨立的世代，並有自己的失敗模式。</p>
<p>Nano Banana 2 將這些額外的生成過程整合為一。</p>
<ul>
<li><p><strong>四種原生解析度層級。</strong></p></li>
<li><p>512px ($0.045)</p></li>
<li><p>1K ($0.067)</p></li>
<li><p>2K ($0.101)</p></li>
<li><p>4K ($0.151).</p></li>
</ul>
<p>512px 解析度層級是 Nano Banana 2 獨特的新功能。使用者現在可以產生低成本的 512px 草圖進行迭代，然後以 2K 或 4K 輸出最終資產，而無需獨立的升頻步驟。</p>
<ul>
<li><p>共<strong>支援 14 種長寬比</strong>。以下是一些範例：</p></li>
<li><p>4:1</p></li>
<li><p>1:4</p></li>
<li><p>8:1</p></li>
<li><p>1:8</p></li>
</ul>
<p>這些新的超寬和超高比例加入了現有的比例。一代會話可產生多種格式，例如<strong>亞馬遜主圖像</strong>(1:1)、<strong>店頭英雄</strong>(3:4) 和<strong>橫幅廣告</strong>(超寬或其他比例。)</p>
<p>這 4 種比例無需裁切、無需襯墊、無需重新提示。其餘 10 種寬高比都包含在全套中，讓處理過程在不同平台上更具彈性。</p>
<p>光是每張影像節省 ~50% 的費用，就只需要花一半的錢。消除跨解析度和寬高比的重複工作，讓總成本降低至之前的大約三分之一。</p>
<h3 id="Support-Up-to-14-Reference-Images-with-Bestseller-Style" class="common-anchor-header">支援多達 14 張具有暢銷風格的參考影像</h3><p>在 Nano Banana 2 的所有更新中，多重參考混合對我們的 Milvus 管道影響最大。Nano Banana 2 在單一要求中最多可接受 14 個參考圖像，並維持：</p>
<ul>
<li>最多<strong>5 個</strong>字元的字形相似度</li>
<li>最多<strong>14 個</strong>物件的物件保真度</li>
</ul>
<p>在實際應用中，我們從 Milvus 擷取多個暢銷圖像，將它們傳入作為參考，而產生的圖像就會繼承它們的場景構成、光線、擺姿勢和道具位置。我們不需要任何提示工程，就能以手工重建這些模式。</p>
<p>以前的模型只支援一到兩個參考，這迫使使用者只能挑選單一的暢銷書來模仿。有了 14 個參考檔，我們就可以混合多個暢銷排行榜的特徵，讓模型合成一個複合風格。這就是以下教學中以檢索為基礎的管道得以實現的能力。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image15.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Produce-Premium-Commercial-Ready-Visuals-Without-Traditional-Production-Cost-or-Logistics" class="common-anchor-header">無需傳統製作成本或物流，即可製作優質、適合商業用途的影像</h3><p>若要產生一致、可靠的影像，請避免將所有需求都傾倒在單一提示中。更可靠的方法是分階段進行：先生成背景，然後分別生成模型，最後將它們合成在一起。</p>
<p>我們在所有三種 Nano Banana 機型上，以相同的提示來測試背景的產生：4:1 超寬的雨天上海天際線，透過窗戶可以看到東方明珠塔。這個提示在一次過測試中強調了構圖、建築細節和逼真度。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="Original-Nano-Banana-vs-Nano-Banana-Pro-vs-Nano-Banana-2" class="common-anchor-header">原始 Nano Banana vs. Nano Banana Pro vs. Nano Banana 2</h4><ul>
<li><strong>原始 Nano Banana。</strong>自然的雨水紋理，水滴分佈可信，但建築細節過度平滑。東方明珠塔幾乎無法辨認，解析度也無法達到製作要求。</li>
<li><strong>Nano Banana Pro。</strong>電影氣氛：溫暖的室內燈光與冰冷的雨水相映成趣，令人信服。然而，它完全省略了窗框，使影像的深度感變得扁平。可作為輔助影像，而非主角。</li>
<li><strong>Nano Banana 2。</strong>渲染了整個場景。前景的窗框創造了深度。東方明珠塔細節清晰。黃浦江上出現了船舶。分層照明區分了室內的溫暖與室外的陰霾。雨水和水漬的紋理接近攝影效果，4:1 的超寬比例保持了正確的透視，只有左側窗邊有輕微的失真。</li>
</ul>
<p>對於產品攝影中的大多數背景生成工作，我們發現 Nano Banana 2 的輸出無需後期處理即可使用。</p>
<h3 id="Render-In-Image-Text-Cleanly-Across-Languages" class="common-anchor-header">跨語言清晰渲染圖中文字</h3><p>價格標籤、宣傳橫幅和多國語言文案是電子商務圖片中無法避免的，而它們一直是 AI 生成的突破點。Nano Banana 2 能更有效地處理這些問題，一次生成即可支援多種語言的圖像內文字渲染，並可進行翻譯和本地化。</p>
<p><strong>標準文字渲染。</strong>在我們的測試中，我們嘗試的所有電子商務格式的文字輸出都沒有錯誤：價格標籤、簡短的行銷標語和雙語產品描述。</p>
<p><strong>手寫延續。</strong>由於電子商務通常需要價格標籤和個人化卡片等手寫元素，因此我們測試了模型是否能匹配現有的手寫風格並加以延伸 - 特別是匹配手寫待辦事項清單，並以相同風格新增 5 個項目。三種機型的結果：</p>
<ul>
<li><strong>原始 Nano Banana。</strong>重複序列號，誤解結構。</li>
<li><strong>Nano Banana Pro。</strong>排版正確，但字型風格重現不佳。</li>
<li><strong>Nano Banana 2。</strong>零錯誤。筆劃粗細和字形風格非常吻合，與原始碼無異。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image12.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>不過，</strong>Google 自己的說明文件指出，Nano Banana 2「在準確拼寫和圖像細節方面仍有問題」。我們的測試結果在所有格式中都很乾淨，但任何製作工作流程都應該在發佈前包含文字驗證步驟。</p>
<h2 id="Step-by-Step-Tutorial-Build-a-Bestseller-to-Image-Pipeline-with-Milvus-Qwen-35-and-Nano-Banana-2" class="common-anchor-header">逐步教學：使用 Milvus、Qwen 3.5 和 Nano Banana 2 建立暢銷書到圖片的流程<button data-href="#Step-by-Step-Tutorial-Build-a-Bestseller-to-Image-Pipeline-with-Milvus-Qwen-35-and-Nano-Banana-2" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Before-we-begin-Architecture-and-Model-Setup" class="common-anchor-header">開始之前架構與模型設定</h3><p>為了避免單一提示產生的隨機性，我們將過程分為三個可控制的階段：利用<strong>Milvus</strong>混合搜尋擷取已經運作的內容，利用<strong>Qwen 3.5</strong> 分析其運作的原因，再利用<strong>Nano Banana 2</strong> 將這些限制條件納入產生最終圖片。</p>
<p>如果您之前未曾使用過這些工具，請快速了解每種工具的入門知識：</p>
<ul>
<li><strong><a href="https://milvus.io/">Milvus</a></strong><a href="https://milvus.io/">：</a>最廣泛採用的開源向量資料庫。將產品目錄儲存為向量，並執行混合搜尋 (密集 + 稀疏 + 標量篩選) 以找出與新產品最相似的暢銷圖片。</li>
<li><strong>Qwen 3.5</strong>：流行的多模態 LLM。利用擷取的暢銷圖片，將圖片背後的視覺模式 (場景佈局、光線、姿勢、情緒) 擷取為結構化的風格提示。</li>
<li><strong>Nano Banana 2</strong>：來自 Google 的影像產生模型 (Gemini 3.1 Flash Image)。接受三個輸入：新產品平面佈局、暢銷書參考和 Qwen 3.5 的風格提示。輸出最終的宣傳照片。</li>
</ul>
<p>此架構背後的邏輯始於一個觀察：任何電子商務目錄中最有價值的視覺資產就是已經轉換過的暢銷圖庫。這些照片中的姿勢、構圖和燈光都是透過實際的廣告支出精煉出來的。直接擷取這些圖案要比透過提示撰寫來逆向工程快上一個數量級，而這個擷取步驟正是向量資料庫所要處理的。</p>
<p>以下是完整的流程。我們透過 OpenRouter API 來呼叫每個模型，因此不需要本機 GPU，也不需要下載模型權重。</p>
<pre><code translate="no">New product flat-lay
│
│── Embed → Llama Nemotron Embed VL 1B v2
│
│── Search → Milvus hybrid search
│   ├── Dense <span class="hljs-title function_">vectors</span> <span class="hljs-params">(visual similarity)</span>
│   ├── Sparse <span class="hljs-title function_">vectors</span> <span class="hljs-params">(keyword matching)</span>
│   └── Scalar <span class="hljs-title function_">filters</span> <span class="hljs-params">(category + sales volume)</span>
│
│── Analyze → Qwen <span class="hljs-number">3.5</span> extracts style from retrieved bestsellers
│   └── scene, lighting, pose, mood → style prompt
│
└── Generate → Nano Banana <span class="hljs-number">2</span>
    ├── Inputs: <span class="hljs-keyword">new</span> <span class="hljs-title class_">product</span> + bestseller reference + style prompt
    └── Output: promotional photo
<button class="copy-code-btn"></button></code></pre>
<p>我們倚賴 Milvus 的三種功能來讓擷取階段運作：</p>
<ol>
<li><strong>密集 + 稀疏混合搜尋。</strong>我們以平行查詢的方式執行圖像嵌入與文字 TF-IDF 向量，然後以 RRF (Reciprocal Rank Fusion) 重新排序合併這兩個結果集。</li>
<li><strong>標量欄位篩選。</strong>在向量比較之前，我們會先篩選類別和 sales_count 等元資料欄位，因此結果只包含相關且表現優異的產品。</li>
<li><strong>多欄位模式。</strong>我們將密集向量、稀疏向量和標量元資料儲存在單一的 Milvus 資料集中，讓整個檢索邏輯維持在單一查詢中，而不是分散在多個系統中。</li>
</ol>
<h3 id="Data-Preparation" class="common-anchor-header">資料準備</h3><p><strong>歷史產品目錄</strong></p>
<p>我們從兩個資產開始：現有產品照片的 images/ 資料夾，以及包含其元資料的 products.csv 檔案。</p>
<pre><code translate="no">images/
├── SKU001.jpg
├── SKU002.jpg
├── ...
└── SKU040.jpg

products.csv fields:
product_id, image_path, category, color, style, season, sales_count, description, price
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>新產品資料</strong></p>
<p>對於我們想要產生促銷圖片的產品，我們準備一個平行結構：new_products/ 資料夾以及 new_products.csv。</p>
<pre><code translate="no">new_products/
├── NEW001.jpg    <span class="hljs-comment"># Blue knit cardigan + grey tulle skirt set</span>
├── NEW002.jpg    <span class="hljs-comment"># Light green floral ruffle maxi dress</span>
├── NEW003.jpg    <span class="hljs-comment"># Camel turtleneck knit dress</span>
└── NEW004.jpg    <span class="hljs-comment"># Dark grey ethnic-style cowl neck top dress</span>

new_products.csv fields:
new_id, image_path, category, style, season, prompt_hint
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image11.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">步驟 1：安裝相依性</h3><pre><code translate="no">!pip install pymilvus openai requests pillow scikit-learn tqdm
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Import-Modules-and-Configurations" class="common-anchor-header">步驟 2：匯入模組與組態</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os, io, base64, csv, time
<span class="hljs-keyword">import</span> requests <span class="hljs-keyword">as</span> req
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> <span class="hljs-variable constant_">PIL</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">Image</span>
<span class="hljs-keyword">from</span> tqdm.<span class="hljs-property">notebook</span> <span class="hljs-keyword">import</span> tqdm
<span class="hljs-keyword">from</span> sklearn.<span class="hljs-property">feature_extraction</span>.<span class="hljs-property">text</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">TfidfVectorizer</span>
<span class="hljs-keyword">from</span> <span class="hljs-title class_">IPython</span>.<span class="hljs-property">display</span> <span class="hljs-keyword">import</span> display

<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>, <span class="hljs-title class_">DataType</span>, <span class="hljs-title class_">AnnSearchRequest</span>, <span class="hljs-title class_">RRFRanker</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>設定所有模型和路徑：</strong></p>
<pre><code translate="no"><span class="hljs-comment"># -- Config --</span>
OPENROUTER_API_KEY = os.environ.get(
    <span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>,
    <span class="hljs-string">&quot;&lt;YOUR_OPENROUTER_API_KEY&gt;&quot;</span>,
)

<span class="hljs-comment"># Models (all via OpenRouter, no local download needed)</span>
EMBED_MODEL = <span class="hljs-string">&quot;nvidia/llama-nemotron-embed-vl-1b-v2&quot;</span>  <span class="hljs-comment"># free, image+text → 2048d</span>
EMBED_DIM = <span class="hljs-number">2048</span>
LLM_MODEL = <span class="hljs-string">&quot;qwen/qwen3.5-397b-a17b&quot;</span>                 <span class="hljs-comment"># style analysis</span>
IMAGE_GEN_MODEL = <span class="hljs-string">&quot;google/gemini-3.1-flash-image-preview&quot;</span>  <span class="hljs-comment"># Nano Banana 2</span>

<span class="hljs-comment"># Milvus</span>
MILVUS_URI = <span class="hljs-string">&quot;./milvus_fashion.db&quot;</span>
COLLECTION = <span class="hljs-string">&quot;fashion_products&quot;</span>
TOP_K = <span class="hljs-number">3</span>

<span class="hljs-comment"># Paths</span>
IMAGE_DIR = <span class="hljs-string">&quot;./images&quot;</span>
NEW_PRODUCT_DIR = <span class="hljs-string">&quot;./new_products&quot;</span>
PRODUCT_CSV = <span class="hljs-string">&quot;./products.csv&quot;</span>
NEW_PRODUCT_CSV = <span class="hljs-string">&quot;./new_products.csv&quot;</span>

<span class="hljs-comment"># OpenRouter client (shared for LLM + image gen)</span>
llm = OpenAI(api_key=OPENROUTER_API_KEY, base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Config loaded. All models via OpenRouter API.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>公用程式函式</strong></p>
<p>這些輔助函式會處理影像編碼、API 呼叫和回應解析：</p>
<ul>
<li>image_too_uri()：將 PIL 影像轉換成 base64 資料 URI，以便 API 傳輸。</li>
<li>get_image_embeddings()：透過 OpenRouter Embedding API 將影像批次編碼為 2048 維向量。</li>
<li>get_text_embedding()：將文字編碼到相同的 2048 維向量空間。</li>
<li>sparse_too_dict()：將 scipy sparse 矩陣的行轉換成 Milvus 期望的 sparse 向量的 {index: value} 格式。</li>
<li>extract_images()：從 Nano Banana 2 API 回應中萃取產生的影像。</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># -- Utility functions --</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">image_to_uri</span>(<span class="hljs-params">img, max_size=<span class="hljs-number">1024</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert PIL Image to base64 data URI.&quot;&quot;&quot;</span>
    img = img.copy()
    w, h = img.size
    <span class="hljs-keyword">if</span> <span class="hljs-built_in">max</span>(w, h) &gt; max_size:
        r = max_size / <span class="hljs-built_in">max</span>(w, h)
        img = img.resize((<span class="hljs-built_in">int</span>(w * r), <span class="hljs-built_in">int</span>(h * r)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, <span class="hljs-built_in">format</span>=<span class="hljs-string">&quot;JPEG&quot;</span>, quality=<span class="hljs-number">85</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;data:image/jpeg;base64,<span class="hljs-subst">{base64.b64encode(buf.getvalue()).decode()}</span>&quot;</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_image_embeddings</span>(<span class="hljs-params">images, batch_size=<span class="hljs-number">5</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode images via OpenRouter embedding API.&quot;&quot;&quot;</span>
    all_embs = []
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> tqdm(<span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(images), batch_size), desc=<span class="hljs-string">&quot;Encoding images&quot;</span>):
        batch = images[i : i + batch_size]
        inputs = [
            {<span class="hljs-string">&quot;content&quot;</span>: [{<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(img, max_size=<span class="hljs-number">512</span>)}}]}
            <span class="hljs-keyword">for</span> img <span class="hljs-keyword">in</span> batch
        ]
        resp = req.post(
            <span class="hljs-string">&quot;https://openrouter.ai/api/v1/embeddings&quot;</span>,
            headers={<span class="hljs-string">&quot;Authorization&quot;</span>: <span class="hljs-string">f&quot;Bearer <span class="hljs-subst">{OPENROUTER_API_KEY}</span>&quot;</span>},
            json={<span class="hljs-string">&quot;model&quot;</span>: EMBED_MODEL, <span class="hljs-string">&quot;input&quot;</span>: inputs},
            timeout=<span class="hljs-number">120</span>,
        )
        data = resp.json()
        <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;data&quot;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> data:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;API error: <span class="hljs-subst">{data}</span>&quot;</span>)
            <span class="hljs-keyword">continue</span>
        <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> <span class="hljs-built_in">sorted</span>(data[<span class="hljs-string">&quot;data&quot;</span>], key=<span class="hljs-keyword">lambda</span> x: x[<span class="hljs-string">&quot;index&quot;</span>]):
            all_embs.append(item[<span class="hljs-string">&quot;embedding&quot;</span>])
        time.sleep(<span class="hljs-number">0.5</span>)  <span class="hljs-comment"># rate limit friendly</span>
    <span class="hljs-keyword">return</span> np.array(all_embs, dtype=np.float32)

<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_text_embedding</span>(<span class="hljs-params">text</span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode text via OpenRouter embedding API.&quot;&quot;&quot;</span>
    resp = req.post(
        <span class="hljs-string">&quot;https://openrouter.ai/api/v1/embeddings&quot;</span>,
        headers={<span class="hljs-string">&quot;Authorization&quot;</span>: <span class="hljs-string">f&quot;Bearer <span class="hljs-subst">{OPENROUTER_API_KEY}</span>&quot;</span>},
        json={<span class="hljs-string">&quot;model&quot;</span>: EMBED_MODEL, <span class="hljs-string">&quot;input&quot;</span>: text},
        timeout=<span class="hljs-number">60</span>,
    )
    <span class="hljs-keyword">return</span> np.array(resp.json()[<span class="hljs-string">&quot;data&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;embedding&quot;</span>], dtype=np.float32)

<span class="hljs-keyword">def</span> <span class="hljs-title function_">sparse_to_dict</span>(<span class="hljs-params">sparse_row</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert scipy sparse row to Milvus sparse vector format {index: value}.&quot;&quot;&quot;</span>
    coo = sparse_row.tocoo()
    <span class="hljs-keyword">return</span> {<span class="hljs-built_in">int</span>(i): <span class="hljs-built_in">float</span>(v) <span class="hljs-keyword">for</span> i, v <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(coo.col, coo.data)}

<span class="hljs-keyword">def</span> <span class="hljs-title function_">extract_images</span>(<span class="hljs-params">response</span>):
    <span class="hljs-string">&quot;&quot;&quot;Extract generated images from OpenRouter response.&quot;&quot;&quot;</span>
    images = []
    raw = response.model_dump()
    msg = raw[<span class="hljs-string">&quot;choices&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;message&quot;</span>]
    <span class="hljs-comment"># Method 1: images field (OpenRouter extension)</span>
    <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;images&quot;</span> <span class="hljs-keyword">in</span> msg <span class="hljs-keyword">and</span> msg[<span class="hljs-string">&quot;images&quot;</span>]:
        <span class="hljs-keyword">for</span> img_data <span class="hljs-keyword">in</span> msg[<span class="hljs-string">&quot;images&quot;</span>]:
            url = img_data[<span class="hljs-string">&quot;image_url&quot;</span>][<span class="hljs-string">&quot;url&quot;</span>]
            b64 = url.split(<span class="hljs-string">&quot;,&quot;</span>, <span class="hljs-number">1</span>)[<span class="hljs-number">1</span>]
            images.append(Image.<span class="hljs-built_in">open</span>(io.BytesIO(base64.b64decode(b64))))
    <span class="hljs-comment"># Method 2: inline base64 in content parts</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> images <span class="hljs-keyword">and</span> <span class="hljs-built_in">isinstance</span>(msg.get(<span class="hljs-string">&quot;content&quot;</span>), <span class="hljs-built_in">list</span>):
        <span class="hljs-keyword">for</span> part <span class="hljs-keyword">in</span> msg[<span class="hljs-string">&quot;content&quot;</span>]:
            <span class="hljs-keyword">if</span> <span class="hljs-built_in">isinstance</span>(part, <span class="hljs-built_in">dict</span>) <span class="hljs-keyword">and</span> part.get(<span class="hljs-string">&quot;type&quot;</span>) == <span class="hljs-string">&quot;image_url&quot;</span>:
                url = part[<span class="hljs-string">&quot;image_url&quot;</span>][<span class="hljs-string">&quot;url&quot;</span>]
                <span class="hljs-keyword">if</span> url.startswith(<span class="hljs-string">&quot;data:image&quot;</span>):
                    b64 = url.split(<span class="hljs-string">&quot;,&quot;</span>, <span class="hljs-number">1</span>)[<span class="hljs-number">1</span>]
                    images.append(Image.<span class="hljs-built_in">open</span>(io.BytesIO(base64.b64decode(b64))))
    <span class="hljs-keyword">return</span> images

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Utility functions ready.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Load-the-Product-Catalog" class="common-anchor-header">步驟 3：載入產品目錄</h3><p>讀取 products.csv 並載入相對應的產品圖片：</p>
<pre><code translate="no"><span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(PRODUCT_CSV, newline=<span class="hljs-string">&quot;&quot;</span>, encoding=<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">as</span> f:
    products = <span class="hljs-built_in">list</span>(csv.DictReader(f))

product_images = []
<span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> products:
    img = Image.<span class="hljs-built_in">open</span>(os.path.join(IMAGE_DIR, p[<span class="hljs-string">&quot;image_path&quot;</span>])).convert(<span class="hljs-string">&quot;RGB&quot;</span>)
    product_images.append(img)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Loaded <span class="hljs-subst">{<span class="hljs-built_in">len</span>(products)}</span> products.&quot;</span>)
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">3</span>):
    p = products[i]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{p[<span class="hljs-string">&#x27;product_id&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;color&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> | sales: <span class="hljs-subst">{p[<span class="hljs-string">&#x27;sales_count&#x27;</span>]}</span>&quot;</span>)
    display(product_images[i].resize((<span class="hljs-number">180</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">180</span> * product_images[i].height / product_images[i].width))))
<button class="copy-code-btn"></button></code></pre>
<p>樣本輸出：<br>

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image13.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Generate-Embeddings" class="common-anchor-header">步驟 4：產生嵌入</h3><p>混合搜尋需要為每個產品提供兩種向量。</p>
<p><strong>4.1 密集向量：影像嵌入</strong></p>
<p>nvidia/llama-nemotron-embed-vl-1b-v2 模型會將每個產品的影像編碼成 2048 維的密集向量。由於此模型在共用向量空間中同時支援影像與文字輸入，因此相同的嵌入可以用於影像到影像以及文字到影像的檢索。</p>
<pre><code translate="no"><span class="hljs-comment"># Dense embeddings: image → 2048-dim vector via OpenRouter API</span>
dense_vectors = get_image_embeddings(product_images, batch_size=<span class="hljs-number">5</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dense vectors: <span class="hljs-subst">{dense_vectors.shape}</span>  (products x <span class="hljs-subst">{EMBED_DIM}</span>d)&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>輸出：</p>
<pre><code translate="no">Dense vectors: (40, 2048)  (products x 2048d)
<button class="copy-code-btn"></button></code></pre>
<p><strong>4.2 個稀疏向量：TF-IDF 文字內嵌</strong></p>
<p>產品文字說明使用 scikit-learn 的 TF-IDF 向量器編碼為稀疏向量。這些矢量可以捕捉到密集矢量可能遺漏的關鍵字層級匹配。</p>
<pre><code translate="no"><span class="hljs-comment"># Sparse embeddings: TF-IDF on product descriptions</span>
descriptions = [p[<span class="hljs-string">&quot;description&quot;</span>] <span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> products]
tfidf = TfidfVectorizer(stop_words=<span class="hljs-string">&quot;english&quot;</span>, max_features=<span class="hljs-number">500</span>)
tfidf_matrix = tfidf.fit_transform(descriptions)

sparse_vectors = [sparse_to_dict(tfidf_matrix[i]) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(products))]
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sparse vectors: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sparse_vectors)}</span> products, vocab size: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(tfidf.vocabulary_)}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sample sparse vector (SKU001): <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sparse_vectors[<span class="hljs-number">0</span>])}</span> non-zero terms&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>輸出：</p>
<pre><code translate="no">Sparse vectors: <span class="hljs-number">40</span> products, vocab size: <span class="hljs-number">179</span>
Sample sparse <span class="hljs-title function_">vector</span> <span class="hljs-params">(SKU001)</span>: <span class="hljs-number">11</span> non-zero terms
<button class="copy-code-btn"></button></code></pre>
<p><strong>為何同時使用兩種向量類型？</strong>密集向量和稀疏向量相輔相成。密集向量捕捉視覺相似性：色調、服裝輪廓、整體風格。稀疏向量則可捕捉關鍵字語意：如「floral」、「midi」或「chiffon」等表示產品屬性的詞彙。結合這兩種方法所產生的檢索品質，遠比單獨使用其中一種方法為佳。</p>
<h3 id="Step-5-Create-a-Milvus-Collection-with-Hybrid-Schema" class="common-anchor-header">步驟 5：使用混合模式建立 Milvus 套件</h3><p>此步驟會建立一個單一的 Milvus 套件，將密集向量、稀疏向量和標量元資料欄位儲存在一起。這個統一的模式可以在單一查詢中進行混合搜尋。</p>
<table>
<thead>
<tr><th><strong>欄位</strong></th><th><strong>類型</strong></th><th><strong>目的</strong></th></tr>
</thead>
<tbody>
<tr><td>密集向量</td><td>FLOAT_VECTOR (2048d)</td><td>影像嵌入、COSINE 相似度</td></tr>
<tr><td>稀疏向量</td><td>sparse_float_vector</td><td>TF-IDF 稀疏向量、內積</td></tr>
<tr><td>類別</td><td>VARCHAR</td><td>用於篩選的類別標籤</td></tr>
<tr><td>銷售額</td><td>INT64</td><td>過濾的歷史銷售量</td></tr>
<tr><td>顏色、款式、季節</td><td>VARCHAR</td><td>附加的元資料標籤</td></tr>
<tr><td>價格</td><td>浮動</td><td>產品價格</td></tr>
</tbody>
</table>
<pre><code translate="no">milvus_client = MilvusClient(uri=MILVUS_URI)

<span class="hljs-keyword">if</span> milvus_client.has_collection(COLLECTION):
    milvus_client.drop_collection(COLLECTION)

schema = milvus_client.create_schema(auto_id=<span class="hljs-literal">True</span>, enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;product_id&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">20</span>)
schema.add_field(<span class="hljs-string">&quot;category&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;color&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;style&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;season&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;sales_count&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;description&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">500</span>)
schema.add_field(<span class="hljs-string">&quot;price&quot;</span>, DataType.FLOAT)
schema.add_field(<span class="hljs-string">&quot;dense_vector&quot;</span>, DataType.FLOAT_VECTOR, dim=EMBED_DIM)
schema.add_field(<span class="hljs-string">&quot;sparse_vector&quot;</span>, DataType.SPARSE_FLOAT_VECTOR)

index_params = milvus_client.prepare_index_params()
index_params.add_index(field_name=<span class="hljs-string">&quot;dense_vector&quot;</span>, index_type=<span class="hljs-string">&quot;FLAT&quot;</span>, metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>)
index_params.add_index(field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>, index_type=<span class="hljs-string">&quot;SPARSE_INVERTED_INDEX&quot;</span>, metric_type=<span class="hljs-string">&quot;IP&quot;</span>)

milvus_client.create_collection(COLLECTION, schema=schema, index_params=index_params)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Milvus collection &#x27;<span class="hljs-subst">{COLLECTION}</span>&#x27; created with hybrid schema.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>插入產品資料：</p>
<pre><code translate="no"><span class="hljs-comment"># Insert all products</span>
rows = []
<span class="hljs-keyword">for</span> i, p <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(products):
    rows.append({
        <span class="hljs-string">&quot;product_id&quot;</span>: p[<span class="hljs-string">&quot;product_id&quot;</span>],
        <span class="hljs-string">&quot;category&quot;</span>: p[<span class="hljs-string">&quot;category&quot;</span>],
        <span class="hljs-string">&quot;color&quot;</span>: p[<span class="hljs-string">&quot;color&quot;</span>],
        <span class="hljs-string">&quot;style&quot;</span>: p[<span class="hljs-string">&quot;style&quot;</span>],
        <span class="hljs-string">&quot;season&quot;</span>: p[<span class="hljs-string">&quot;season&quot;</span>],
        <span class="hljs-string">&quot;sales_count&quot;</span>: <span class="hljs-built_in">int</span>(p[<span class="hljs-string">&quot;sales_count&quot;</span>]),
        <span class="hljs-string">&quot;description&quot;</span>: p[<span class="hljs-string">&quot;description&quot;</span>],
        <span class="hljs-string">&quot;price&quot;</span>: <span class="hljs-built_in">float</span>(p[<span class="hljs-string">&quot;price&quot;</span>]),
        <span class="hljs-string">&quot;dense_vector&quot;</span>: dense_vectors[i].tolist(),
        <span class="hljs-string">&quot;sparse_vector&quot;</span>: sparse_vectors[i],
    })

milvus_client.insert(COLLECTION, rows)
stats = milvus_client.get_collection_stats(COLLECTION)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{stats[<span class="hljs-string">&#x27;row_count&#x27;</span>]}</span> products into Milvus.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>輸出：</p>
<pre><code translate="no">Inserted <span class="hljs-number">40</span> products <span class="hljs-keyword">into</span> Milvus.
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Hybrid-Search-to-Find-Similar-Bestsellers" class="common-anchor-header">步驟 6：混合搜尋，找出相似的暢銷產品</h3><p>這是核心的檢索步驟。對於每個新產品，管道會同時執行三個作業：</p>
<ol>
<li><strong>密集搜尋</strong>：尋找具有視覺相似圖像嵌入的產品。</li>
<li><strong>稀疏搜尋</strong>：透過 TF-IDF 找出具有匹配文字關鍵字的產品。</li>
<li><strong>Scalar 過濾</strong>：將結果限制為相同類別，且 sales_count &gt; 1500 的產品。</li>
<li><strong>RRF 重排</strong>：使用 Reciprocal Rank Fusion 合併密集與稀疏的結果清單。</li>
</ol>
<p>載入新產品：</p>
<pre><code translate="no"><span class="hljs-comment"># Load new products</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(NEW_PRODUCT_CSV, newline=<span class="hljs-string">&quot;&quot;</span>, encoding=<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">as</span> f:
    new_products = <span class="hljs-built_in">list</span>(csv.DictReader(f))

<span class="hljs-comment"># Pick the first new product for demo</span>
new_prod = new_products[<span class="hljs-number">0</span>]
new_img = Image.<span class="hljs-built_in">open</span>(os.path.join(NEW_PRODUCT_DIR, new_prod[<span class="hljs-string">&quot;image_path&quot;</span>])).convert(<span class="hljs-string">&quot;RGB&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;New product: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Category: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | Style: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> | Season: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;season&#x27;</span>]}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Prompt hint: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>&quot;</span>)
display(new_img.resize((<span class="hljs-number">300</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">300</span> * new_img.height / new_img.width))))
<button class="copy-code-btn"></button></code></pre>
<p>輸出：  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>編碼新產品：</p>
<pre><code translate="no"><span class="hljs-comment"># Encode new product</span>
<span class="hljs-comment"># Dense: image embedding via API</span>
query_dense = get_image_embeddings([new_img], batch_size=<span class="hljs-number">1</span>)[<span class="hljs-number">0</span>]

<span class="hljs-comment"># Sparse: TF-IDF from text query</span>
query_text = <span class="hljs-string">f&quot;<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;season&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>&quot;</span>
query_sparse = sparse_to_dict(tfidf.transform([query_text])[<span class="hljs-number">0</span>])

<span class="hljs-comment"># Scalar filter</span>
filter_expr = <span class="hljs-string">f&#x27;category == &quot;<span class="hljs-subst">{new_prod[<span class="hljs-string">&quot;category&quot;</span>]}</span>&quot; and sales_count &gt; 1500&#x27;</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dense query: <span class="hljs-subst">{query_dense.shape}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sparse query: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(query_sparse)}</span> non-zero terms&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Filter: <span class="hljs-subst">{filter_expr}</span>&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<p>輸出：</p>
<pre><code translate="no"><span class="hljs-title class_">Dense</span> <span class="hljs-attr">query</span>: (<span class="hljs-number">2048</span>,)
<span class="hljs-title class_">Sparse</span> <span class="hljs-attr">query</span>: <span class="hljs-number">6</span> non-zero terms
<span class="hljs-title class_">Filter</span>: category == <span class="hljs-string">&quot;midi_dress&quot;</span> and sales_count &gt; <span class="hljs-number">1500</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>執行混合搜尋</strong></p>
<p>這裡的關鍵 API 呼叫：</p>
<ul>
<li>AnnSearchRequest 會為密集與稀疏向量欄位建立獨立的搜尋請求。</li>
<li>expr=filter_expr 在每個搜尋請求中應用標量篩選。</li>
<li>RRFRanker(k=60) 使用 Reciprocal Rank Fusion 演算法融合兩個排序結果清單。</li>
<li>hybrid_search 會執行兩個請求，並傳回合併的重新排序結果。</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Hybrid search: dense + sparse + scalar filter + RRF reranking</span>
dense_req = AnnSearchRequest(
    data=[query_dense.tolist()],
    anns_field=<span class="hljs-string">&quot;dense_vector&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    limit=<span class="hljs-number">20</span>,
    expr=filter_expr,
)
sparse_req = AnnSearchRequest(
    data=[query_sparse],
    anns_field=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>},
    limit=<span class="hljs-number">20</span>,
    expr=filter_expr,
)

results = milvus_client.hybrid_search(
    collection_name=COLLECTION,
    reqs=[dense_req, sparse_req],
    ranker=RRFRanker(k=<span class="hljs-number">60</span>),
    limit=TOP_K,
    output_fields=[<span class="hljs-string">&quot;product_id&quot;</span>, <span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;color&quot;</span>, <span class="hljs-string">&quot;style&quot;</span>, <span class="hljs-string">&quot;season&quot;</span>,
                   <span class="hljs-string">&quot;sales_count&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
)

<span class="hljs-comment"># Display retrieved bestsellers</span>
retrieved_products = []
retrieved_images = []
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Top-<span class="hljs-subst">{TOP_K}</span> similar bestsellers:\n&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    pid = entity[<span class="hljs-string">&quot;product_id&quot;</span>]
    img = Image.<span class="hljs-built_in">open</span>(os.path.join(IMAGE_DIR, <span class="hljs-string">f&quot;<span class="hljs-subst">{pid}</span>.jpg&quot;</span>)).convert(<span class="hljs-string">&quot;RGB&quot;</span>)
    retrieved_products.append(entity)
    retrieved_images.append(img)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{pid}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;color&#x27;</span>]}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> &quot;</span>
          <span class="hljs-string">f&quot;| sales: <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;sales_count&#x27;</span>]}</span> | $<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;price&#x27;</span>]:<span class="hljs-number">.1</span>f}</span> | score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;description&#x27;</span>]}</span>&quot;</span>)
    display(img.resize((<span class="hljs-number">250</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">250</span> * img.height / img.width))))
    <span class="hljs-built_in">print</span>()
<button class="copy-code-btn"></button></code></pre>
<p>輸出：最相似的前三名暢銷書，依融合得分排序。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-7-Analyze-Bestseller-Style-with-Qwen-35" class="common-anchor-header">步驟 7：使用 Qwen 3.5 分析暢銷書風格</h3><p>我們將擷取到的暢銷書圖片輸入 Qwen 3.5，要求它擷取它們共同的視覺 DNA：場景構圖、燈光設定、模特姿勢和整體情緒。從分析中，我們會得到一個單一代的提示，準備交給 Nano Banana 2。</p>
<pre><code translate="no">content = [
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(img)}}
    <span class="hljs-keyword">for</span> img in retrieved_images
]
content.<span class="hljs-built_in">append</span>({
    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>,
    <span class="hljs-string">&quot;text&quot;</span>: (
        <span class="hljs-string">&quot;These are our top-selling fashion product photos.\n\n&quot;</span>
        <span class="hljs-string">&quot;Analyze their common visual style in these dimensions:\n&quot;</span>
        <span class="hljs-string">&quot;1. Scene / background setting\n&quot;</span>
        <span class="hljs-string">&quot;2. Lighting and color tone\n&quot;</span>
        <span class="hljs-string">&quot;3. Model pose and framing\n&quot;</span>
        <span class="hljs-string">&quot;4. Overall mood and aesthetic\n\n&quot;</span>
        <span class="hljs-string">&quot;Then, based on this analysis, write ONE concise image generation prompt &quot;</span>
        <span class="hljs-string">&quot;(under 100 words) that captures this style. The prompt should describe &quot;</span>
        <span class="hljs-string">&quot;a scene for a model wearing a new clothing item. &quot;</span>
        <span class="hljs-string">&quot;Output ONLY the prompt, nothing else.&quot;</span>
    ),
})

response = llm.chat.completions.create(
    model=LLM_MODEL,
    messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: content}],
    max_tokens=<span class="hljs-number">512</span>,
    temperature=<span class="hljs-number">0.7</span>,
)
style_prompt = response.choices[<span class="hljs-number">0</span>].message.content.strip()
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Style prompt from Qwen3.5:\n&quot;</span>)
<span class="hljs-built_in">print</span>(style_prompt)
<button class="copy-code-btn"></button></code></pre>
<p>樣本輸出：</p>
<pre><code translate="no">Style prompt from Qwen3.5:

Professional full-body fashion photograph of a model wearing a stylish new dress.
Bright, soft high-key lighting that illuminates the subject evenly. Clean,
uncluttered background, either stark white or a softly blurred bright outdoor
setting. The model stands in a relaxed, natural pose to showcase the garment&#x27;s
silhouette and drape. Sharp focus, vibrant colors, fresh and elegant commercial aesthetic.
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-8-Generate-the-Promotional-Image-with-Nano-Banana-2" class="common-anchor-header">步驟 8：使用 Nano Banana 2 產生宣傳圖片</h3><p>我們將三個輸入傳入 Nano Banana 2：新產品的平面照片、排名最高的暢銷圖片，以及我們在上一步中萃取的風格提示。模型會將這些資料合成為一張宣傳照片，將新成衣與經過驗證的視覺風格搭配在一起。</p>
<pre><code translate="no">gen_prompt = (
    <span class="hljs-string">f&quot;I have a new clothing product (Image 1: flat-lay photo) and a reference &quot;</span>
    <span class="hljs-string">f&quot;promotional photo from our bestselling catalog (Image 2).\n\n&quot;</span>
    <span class="hljs-string">f&quot;Generate a professional e-commerce promotional photograph of a female model &quot;</span>
    <span class="hljs-string">f&quot;wearing the clothing from Image 1.\n\n&quot;</span>
    <span class="hljs-string">f&quot;Style guidance: <span class="hljs-subst">{style_prompt}</span>\n\n&quot;</span>
    <span class="hljs-string">f&quot;Scene hint: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>\n\n&quot;</span>
    <span class="hljs-string">f&quot;Requirements:\n&quot;</span>
    <span class="hljs-string">f&quot;- Full body shot, photorealistic, high quality\n&quot;</span>
    <span class="hljs-string">f&quot;- The clothing should match Image 1 exactly\n&quot;</span>
    <span class="hljs-string">f&quot;- The photo style and mood should match Image 2&quot;</span>
)

gen_content = [
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(new_img)}},
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(retrieved_images[<span class="hljs-number">0</span>])}},
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: gen_prompt},
]

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Generating promotional photo with Nano Banana 2...&quot;</span>)
gen_response = llm.chat.completions.create(
    model=IMAGE_GEN_MODEL,
    messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: gen_content}],
    extra_body={
        <span class="hljs-string">&quot;modalities&quot;</span>: [<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;image&quot;</span>],
        <span class="hljs-string">&quot;image_config&quot;</span>: {<span class="hljs-string">&quot;aspect_ratio&quot;</span>: <span class="hljs-string">&quot;3:4&quot;</span>, <span class="hljs-string">&quot;image_size&quot;</span>: <span class="hljs-string">&quot;2K&quot;</span>},
    },
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Done!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Nano Banana 2 API 呼叫的關鍵參數：</p>
<ul>
<li>模式：[「文字」、「圖片」]：宣告回應應包含圖片。</li>
<li>image_config.aspect_ratio：控制輸出寬高比（3:4 適用於人像/時尚照片）。</li>
<li>image_config.image_size: 設定解析度。Nano Banana 2 支援 512px 至 4K。</li>
</ul>
<p>擷取產生的影像：</p>
<pre><code translate="no">generated_images = extract_images(gen_response)

text_content = gen_response.choices[<span class="hljs-number">0</span>].message.content
<span class="hljs-keyword">if</span> text_content:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Model response: <span class="hljs-subst">{text_content[:<span class="hljs-number">300</span>]}</span>\n&quot;</span>)

<span class="hljs-keyword">if</span> generated_images:
    <span class="hljs-keyword">for</span> i, img <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(generated_images):
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;--- Generated promo photo <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span> ---&quot;</span>)
        display(img)
        img.save(<span class="hljs-string">f&quot;promo_<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>_<span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>.png&quot;</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Saved: promo_<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>_<span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>.png&quot;</span>)
<span class="hljs-keyword">else</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;No image generated. Raw response:&quot;</span>)
    <span class="hljs-built_in">print</span>(gen_response.model_dump())
<button class="copy-code-btn"></button></code></pre>
<p>輸出：  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-9-Side-by-Side-Comparison" class="common-anchor-header">步驟 9：並排比較</h3><p>輸出的圖像大致上符合要求：光線柔和均勻，模特的姿勢看起來很自然，氣氛也符合暢銷書的參考內容。</p>
<p>不足之處在於服裝的融合。羊毛衫看起來是貼在模特身上，而不是穿在身上，領口的白色標籤也滲出來。單次製作在這種細緻的服裝與身體結合上很吃力，因此我們在摘要中提到了解決方法。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image10.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-10-Batch-Generation-for-All-New-Products" class="common-anchor-header">步驟 10：批次產生所有新產品</h3><p>我們將整個管道包裝成一個函式，並在其餘的新產品中執行。為了簡潔起見，這裡省略了批次代碼；如果您需要完整的實作，請聯絡我們。</p>
<p>在批次結果中，有兩件事相當突出。我們從<strong>Qwen 3.5</strong>獲得的樣式提示會針對每個產品進行有意義的調整：夏日連衣裙和冬季針織衫會根據季節、使用情況和配件獲得真正不同的場景描述。<strong>Nano Banana 2</strong> 所提供的圖片，在光線、質感和構圖上，都能媲美真正的攝影棚攝影。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>在這篇文章中，我們涵蓋了 Nano Banana 2 為電子商務圖像製作帶來了什麼，將它與原始的 Nano Banana 和 Pro 在實際生產任務中進行了比較，並介紹了如何使用 Milvus、Qwen 3.5 和 Nano Banana 2 建立暢銷書到圖像的管道。</p>
<p>此管道有四個實際優點：</p>
<ul>
<li><strong>可控制的成本、可預測的預算。</strong>嵌入模型 (Llama Nemotron Embed VL 1B v2) 在 OpenRouter 上是免費的。Nano Banana 2 的每張圖片運行成本大約是 Pro 的一半，而原生多格式輸出則省去了曾經使有效帳單增加兩倍或三倍的返工週期。對於每季管理數以千計 SKU 的電子商務團隊而言，這種可預測性意味著影像製作會隨著目錄的增加而增加，而不會超出預算。</li>
<li><strong>端對端自動化，加快上市時間。</strong>從平面產品照片到成品促銷圖片的流程無需人工干预。新產品從倉庫照片到可上市的上市圖片，只需數分鐘而非數天，這在目錄營業額最高的旺季最為重要。</li>
<li><strong>不需要本機 GPU，降低進入門檻。</strong>每個模型都透過 OpenRouter API 執行。一個沒有 ML 基礎架構，也沒有專屬工程人員的團隊，只需要一台筆記型電腦就能執行此管道。無需配置、無需維護、無需前期硬體投資。</li>
<li><strong>更高的擷取精準度，更強的品牌一致性。</strong>Milvus 在單一查詢中結合了密集篩選、稀疏篩選和標量篩選，在產品匹配上持續優於單向量方法。在實際應用中，這意味著所產生的影像能更可靠地繼承您品牌既有的視覺語言：您現有暢銷產品已經證明轉換的燈光、構圖和造型。輸出的圖片看起來就像屬於您的商店，而不是一般的 AI 圖庫。</li>
</ul>
<p>也有一些限制值得事先說明：</p>
<ul>
<li><strong>服裝與身體的混合。</strong>單次生成可能會讓衣服看起來是合成的，而不是穿著的。小配件等細節有時會模糊。解決方法：分階段生成（先背景，然後是模特兒的姿勢，再合成）。這種多段式方法可縮窄每個步驟的範圍，並大幅改善混合品質。</li>
<li><strong>邊緣情況下的細節保真度。</strong>配件、圖案和文字較多的佈局可能會失去銳利度。解決方法：在生成提示中加入明確的限制（「服裝自然貼合身體、無外露標籤、無額外元素、產品細節銳利」）。如果在特定產品上品質仍有不足，請切換到 Nano Banana Pro 來進行最終製作。</li>
</ul>
<p><a href="https://milvus.io/">Milvus</a>是開放原始碼的向量資料庫，為混合搜尋步驟提供動力。如果您想探究或嘗試換入自己的產品照片，<a href="https://milvus.io/docs"></a><a href="https://milvus.io/docs">快速入門</a>只需約十分鐘。我們在<a href="https://discord.gg/milvus"></a><a href="https://discord.gg/milvus">Discord</a>和 Slack 上有一個相當活躍的社群，我們很樂意看到大家用這個建立什麼。如果您在不同的垂直產品或更大的目錄中執行 Nano Banana 2，請分享結果！我們很樂意聆聽。</p>
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
    </button></h2><ul>
<li><a href="https://milvus.io/blog/nano-banana-milvus-turning-hype-into-enterprise-ready-multimodal-rag.md">Nano Banana + Milvus: 將炒作變成企業就緒的多模式 RAG</a></li>
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw 是什麼？開放原始碼 AI 代理完整指南</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">OpenClaw 教學：連線至 Slack 以取得本地 AI 助理</a></li>
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">我們擷取 OpenClaw 的記憶體系統並將其開源 (memsearch)</a></li>
<li><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Claude 程式碼的持久記憶體：memsearch ccplugin</a></li>
</ul>
