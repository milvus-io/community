---
id: >-
  gemini-3-pro-milvus-building-a-more-robust-rag-with-advanced-reasoning-and-multimodal-power.md
title: Gemini 3 Pro + Milvus：以先進的推理能力和多模態功能打造更強大的 RAG
author: Lumina Wang
date: 2025-11-20T00:00:00.000Z
cover: assets.zilliz.com/gemini3pro_cover_2f88fb0fe6.png
tag: Tutorial
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Gemini 3 Pro, vibe coding, Milvus, RAG'
meta_title: |
  Gemini 3 Pro + Milvus: Robust RAG With Advanced Reasoning and Multimodal Power
desc: 了解 Gemini 3 Pro 中的核心更新，查看其在主要基準上的表現，並按照指南使用 Milvus 建立高效能 RAG 流水線。
origin: >-
  https://milvus.io/blog/gemini-3-pro-milvus-building-a-more-robust-rag-with-advanced-reasoning-and-multimodal-power.md
---
<p>Google 的 Gemini 3 Pro 發表了罕見的版本，真正改變了開發人員的期望 - 不只是炒作，而是實質擴展了自然語言介面的功能。它將「描述您想要的應用程式」轉化為可執行的工作流程：動態工具路由、多步驟規劃、API 協調，以及互動式 UX 產生，全都無縫地拼接在一起。這是最接近讓 vibe coding 感覺生產可行的模式。</p>
<p>而數字也證明了這一說法。Gemini 3 Pro 在幾乎所有主要基準上都有傑出的表現：</p>
<ul>
<li><p><strong>人類最後一次考試：</strong>37.5% 不使用工具，45.8% 使用工具 - 最接近的競爭對手為 26.5%。</p></li>
<li><p><strong>MathArena Apex：</strong>23.4%，而大多數機型都無法突破 2%。</p></li>
<li><p><strong>ScreenSpot-Pro:</strong>72.7% 的準確度，幾乎是次佳的 36.2% 的兩倍。</p></li>
<li><p><strong>Vending-Bench 2：</strong>平均淨值為<strong>$5,478.16</strong>，比第二名高出約<strong>1.4 倍</strong>。</p></li>
</ul>
<p>查看下表，瞭解更多基準結果。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gemini_3_table_final_HLE_Tools_on_1s_X_Rb4o_f50f42dd67.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>深度推理、強大的工具運用能力，以及多模式流暢性的結合，讓 Gemini 3 Pro 成為檢索增強世代 (RAG) 的天作之合。再搭配專為十億規模語意搜尋所打造的高效能開放原始碼向量資料庫<a href="https://milvus.io/"><strong>Milvus</strong></a>，您就能得到一個能依據回應、簡單擴充、即使在繁重工作負載下仍能保持生產可靠性的檢索層。</p>
<p>在這篇文章中，我們將介紹 Gemini 3 Pro 的新功能、提升 RAG 工作流程的原因，以及如何使用 Milvus 作為您的檢索骨幹，建立乾淨、有效率的 RAG 管線。</p>
<h2 id="Major-Upgrades-in-Gemini-3-Pro" class="common-anchor-header">Gemini 3 Pro 的主要升級<button data-href="#Major-Upgrades-in-Gemini-3-Pro" class="anchor-icon" translate="no">
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
    </button></h2><p>Gemini 3 Pro 引入了一系列重大升級，重塑了模型推理、創建、執行任務以及與用戶互動的方式。這些改進分為四大能力領域：</p>
<h3 id="Multimodal-Understanding-and-Reasoning" class="common-anchor-header">多模式理解與推理</h3><p>Gemini 3 Pro 在重要的多模態基準上創下新記錄，包括視覺推理的 ARC-AGI-2、跨模態理解的 MMMU-Pro，以及視訊理解和知識獲取的 Video-MMMU。該模型還引入了深度思考 (Deep Think)，這是一種擴展推理模式，能夠進行結構化、多步驟邏輯處理。這可大幅提高處理複雜問題的準確度，而傳統的思考鏈模型往往會在這些問題上失敗。</p>
<h3 id="Code-Generation" class="common-anchor-header">代碼產生</h3><p>該模型將代碼生成提升到了一個新的層次。Gemini 3 Pro 可以生成互動 SVG、完整的 Web 應用程式、3D 場景，甚至是功能性遊戲 - 包括類似 Minecraft 的環境和基於瀏覽器的桌球 - 所有這些都只需要單一的自然語言提示。前端開發的好處尤其多：模型可以高保真地重新製作現有的 UI 設計，或是直接將螢幕截圖轉換成可供生產的程式碼，讓 UI 的迭代工作大幅提昇速度。</p>
<h3 id="AI-Agents-and-Tool-Use" class="common-anchor-header">AI 代理與工具使用</h3><p>在使用者允許的情況下，Gemini 3 Pro 可以從使用者的 Google 裝置存取資料，以執行長距離、多步驟的工作，例如規劃行程或預約租車。這種代理能力反映在其在<strong>Vending-Bench 2</strong> 上的強勁表現，<strong>Vending-Bench 2</strong> 是專為長距離工具使用壓力測試而設計的基準。此模型也支援專業級的代理工作流程，包括執行終端指令，以及透過定義良好的 API 與外部工具互動。</p>
<h3 id="Generative-UI" class="common-anchor-header">創造性的使用者介面</h3><p>Gemini 3 Pro 擺脫了傳統的一問一答模式，引入了<strong>生成式使用者介面 (Generative UI</strong>)，模型可以動態建立整個互動體驗。Gemini 3 Pro 不會回傳靜態文字，而是可以直接回應使用者的指示，產生完全客製化的介面，例如豐富、可調整的旅遊計畫。這讓 LLM 從被動的回應者轉變為主動的介面產生者。</p>
<h2 id="Putting-Gemini-3-Pro-to-the-Test" class="common-anchor-header">測試 Gemini 3 Pro<button data-href="#Putting-Gemini-3-Pro-to-the-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>除了基準測試結果之外，我們還進行了一系列實作測試，以瞭解 Gemini 3 Pro 在實際工作流程中的表現。測試結果突顯了其多模式推理、產生能力和長遠規劃如何為開發人員轉化為實際價值。</p>
<h3 id="Multimodal-understanding" class="common-anchor-header">多模式理解</h3><p>Gemini 3 Pro 在文字、圖像、視訊和程式碼方面的多樣性令人印象深刻。在測試中，我們直接從 YouTube 上傳了一段 Zilliz 視訊。模型處理整個片段 - 包括旁白、轉場和螢幕文字 - 大約只花了<strong>40 秒</strong>，對於長格式的多模式內容來說，這是異乎尋常的快速。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ytb1_39f31b728a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ytb2_bb4688e829.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Google 的內部評估也顯示出類似的表現：Gemini 3 Pro 能處理多國語言的手寫食譜，轉錄並翻譯每一份食譜，並將它們編輯成可分享的家庭食譜集。</p>
<iframe class="video-player" src="https://www.youtube.com/embed/nfX__7p8J8E" title="Gemini 3 Pro: recipe" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h3 id="Zero-Shot-Tasks" class="common-anchor-header">零拍攝任務</h3><p>Gemini 3 Pro 可以生成完全互動的 Web UI，而無需事先提供範例或支架。當被要求製作一個精緻、復古、前衛的<strong>3D 太空船網頁遊戲</strong>時，模型產生了一個完整的互動式場景：霓虹紫色的網格、賽博朋克風格的船艦、發光的粒子效果，以及流暢的攝影機控制 - 所有這些都在單次零拍攝的回應中完成。</p>
<iframe class="video-player" src="https://www.youtube.com/embed/JxX_TAyy0Kg" title="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h3 id="Complex-Task-Planning" class="common-anchor-header">複雜的任務規劃</h3><p>與許多同級產品相比，該模型還展現了更強大的長遠任務規劃能力。在我們的收件匣整理測試中，Gemini 3 Pro 的表現很像 AI 行政助理：將雜亂的電子郵件歸類為專案桶、草擬可執行的建議 (回覆、跟進、歸檔)，並提出乾淨、有條理的摘要。有了模型的計畫，只要按一下確認，就能清除整個收件匣。</p>
<iframe class="video-player" src="https://www.youtube.com/embed/O5CUkblZm0Y" title="Gemini 3 Pro: inbox-organization" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="How-to-Build-a-RAG-System-with-Gemini-3-Pro-and-Milvus" class="common-anchor-header">如何使用 Gemini 3 Pro 和 Milvus 建立 RAG 系統<button data-href="#How-to-Build-a-RAG-System-with-Gemini-3-Pro-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Gemini 3 Pro 的升級推理、多模態理解以及強大的工具使用能力，使其成為高效能 RAG 系統的絕佳基礎。</p>
<p>搭配<a href="https://milvus.io/"><strong>Milvus</strong></a>（專為大規模語義搜尋而建的高效能開放原始碼向量資料庫）使用時，您將獲得明確的職責分工：Gemini 3 Pro 負責<strong>詮釋、推理和產生</strong>，而 Milvus 則提供<strong>快速、可擴充的檢索層</strong>，讓回應以您的企業資料為基礎。這種搭配非常適合生產級應用程式，例如內部知識庫、文件助理、客戶支援協同駕駛員，以及特定領域的專家系統。</p>
<h3 id="Prerequisites" class="common-anchor-header">先決條件</h3><p>在建立您的 RAG 管道之前，請確認已安裝這些核心 Python 函式庫或升級至最新版本：</p>
<ul>
<li><p><strong>pymilvus</strong>- 官方 Milvus Python SDK</p></li>
<li><p><strong>google-generativeai</strong>- Gemini 3 Pro 客戶端函式庫</p></li>
<li><p><strong>requests</strong>- 在需要時處理 HTTP 呼叫</p></li>
<li><p><strong>tqdm</strong>- 用於資料集擷取時的進度列</p></li>
</ul>
<pre><code translate="no">! pip install --upgrade pymilvus google-generativeai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p>接下來，登入<a href="https://aistudio.google.com/api-keys"><strong>Google AI Studio</strong></a>取得您的 API 金鑰。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;GEMINI_API_KEY&quot;</span>] = <span class="hljs-string">&quot;**********&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-the-Dataset" class="common-anchor-header">準備資料集</h3><p>在本教程中，我們將使用 Milvus 2.4.x 文件中的常見問題（FAQ）部分作為 RAG 系統的私有知識庫。</p>
<p>下載文件存檔，並解壓縮到一個名為<code translate="no">milvus_docs</code> 的資料夾。</p>
<pre><code translate="no">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>從路徑<code translate="no">milvus_docs/en/faq</code> 載入所有 Markdown 檔案。對於每個文件，我們根據<code translate="no">#</code> 標題進行簡單的分割，以粗略區分每個 Markdown 檔案內的主要部分。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="LLM-and-Embedding-Model-Setup" class="common-anchor-header">LLM 與嵌入模型設定</h3><p>在本教程中，我們將以<code translate="no">gemini-3-pro-preview</code> 作為 LLM，以<code translate="no">text-embedding-004</code> 作為嵌入模型。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> google.generativeai <span class="hljs-keyword">as</span> genai
genai.configure(api_key=os.environ[<span class="hljs-string">&quot;GEMINI_API_KEY&quot;</span>])
gemini_model = genai.GenerativeModel(<span class="hljs-string">&quot;gemini-3-pro-preview&quot;</span>)
response = gemini_model.generate_content(<span class="hljs-string">&quot;who are you&quot;</span>)
<span class="hljs-built_in">print</span>(response.text)
<button class="copy-code-btn"></button></code></pre>
<p>模型回應：我是 Gemini，由 Google 建立的大型語言模型。</p>
<p>您可以透過產生測試 embedding 並列印其維度以及前幾個值來進行快速檢查：</p>
<pre><code translate="no">test_embeddings = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=[<span class="hljs-string">&quot;This is a test1&quot;</span>, <span class="hljs-string">&quot;This is a test2&quot;</span>]
)[<span class="hljs-string">&quot;embedding&quot;</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embeddings[<span class="hljs-number">0</span>])
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embeddings[<span class="hljs-number">0</span>][:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>測試向量輸出：</p>
<p>768</p>
<p>[0.013588584, -0.004361838, -0.08481652, -0.039724775, 0.04723794, -0.0051557426, 0.026071774, 0.045514572, -0.016867816, 0.039378334]</p>
<h3 id="Loading-Data-into-Milvus" class="common-anchor-header">將資料載入 Milvus</h3><p><strong>建立資料集</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>當建立<code translate="no">MilvusClient</code> 時，您可以根據您的規模和環境，選擇三種配置選項：</p>
<ul>
<li><p><strong>本地模式 (Milvus Lite)：</strong>將 URI 設定為本機檔案路徑 (例如：<code translate="no">./milvus.db</code>)。這是最容易上手的方式 -<a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>會自動將所有資料儲存在該檔案中。</p></li>
<li><p><strong>自我託管的 Milvus (Docker 或 Kubernetes)：</strong>對於較大的資料集或生產工作負載，請在 Docker 或 Kubernetes 上執行 Milvus。將 URI 設定為您的 Milvus 伺服器端點，例如<code translate="no">http://localhost:19530</code> 。</p></li>
<li><p><strong>Zilliz Cloud (完全管理的 Milvus 服務)：</strong>如果您偏好受管理的解決方案，請使用 Zilliz Cloud。將 URI 設定為您的公共端點，並提供您的 API 金鑰作為驗證標記。</p></li>
</ul>
<p>在建立新的集合之前，請先檢查它是否已經存在。如果已經存在，請將其刪除並重 新建立，以確保設定乾淨。</p>
<pre><code translate="no">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>使用指定的參數建立新的集合。</p>
<p>如果沒有提供模式，Milvus 會自動產生一個預設的 ID 欄位作為主索引鍵，以及一個向量欄位用來儲存 embeddings。它還會提供一個保留的 JSON 動態欄位，用來擷取模式中未定義的任何其他欄位。</p>
<pre><code translate="no">milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>插入資料</strong></p>
<p>迭代每個文字項目，產生其嵌入向量，並將資料插入 Milvus。 在這個範例中，我們包含一個名為<code translate="no">text</code> 的額外欄位。由於它沒有在模式中預先定義，Milvus 會自動使用動態 JSON 欄位來儲存它 - 不需要額外的設定。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm
data = []
doc_embeddings = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=text_lines
)[<span class="hljs-string">&quot;embedding&quot;</span>]
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>樣本輸出：</p>
<pre><code translate="no">Creating embeddings: 100%|█████████████████████████| 72/72 [00:00&lt;00:00, 431414.13it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-the-RAG-Workflow" class="common-anchor-header">建立 RAG 工作流程</h3><p><strong>擷取相關資料</strong></p>
<p>為了測試檢索，我們提出一個關於 Milvus 的常見問題。</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>在資料集中搜尋該查詢，並傳回前 3 個最相關的結果。</p>
<pre><code translate="no">question_embedding = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=question
)[<span class="hljs-string">&quot;embedding&quot;</span>]
search_res = milvus_client.search(
    collection_name=collection_name,
    data=[question_embedding],
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<span class="hljs-keyword">import</span> json
retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<p>結果會依相似度從最接近到最不相似的順序傳回。</p>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](
https://min.io/
), [AWS S3](
https://aws.amazon.com/s3/?nc1=h_ls
), [Google Cloud Storage](
https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes
) (GCS), [Azure Blob Storage](
https://azure.microsoft.com/en-us/products/storage/blobs
), [Alibaba Cloud OSS](
https://www.alibabacloud.com/product/object-storage-service
), and [Tencent Cloud Object Storage](
https://www.tencentcloud.com/products/cos
) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        0.8048489093780518
    ],
    [
        <span class="hljs-string">&quot;Does the query perform in memory? What are incremental data and historical data?\n\nYes. When a query request comes, Milvus searches both incremental data and historical data by loading them into memory. Incremental data are in the growing segments, which are buffered in memory before they reach the threshold to be persisted in storage engine, while historical data are from the sealed segments that are stored in the object storage. Incremental data and historical data together constitute the whole dataset to search.\n\n###&quot;</span>,
        0.757495105266571
    ],
    [
        <span class="hljs-string">&quot;What is the maximum dataset size Milvus can handle?\n\n  \nTheoretically, the maximum dataset size Milvus can handle is determined by the hardware it is run on, specifically system memory and storage:\n\n- Milvus loads all specified collections and partitions into memory before running queries. Therefore, memory size determines the maximum amount of data Milvus can query.\n- When new entities and and collection-related schema (currently only MinIO is supported for data persistence) are added to Milvus, system storage determines the maximum allowable size of inserted data.\n\n###&quot;</span>,
        0.7453694343566895
    ]
]
<button class="copy-code-btn"></button></code></pre>
<p><strong>使用 LLM 產生 RAG 回應</strong></p>
<p>擷取文件後，將文件轉換成字串格式</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>為 LLM 提供系統提示和使用者提示，兩者都是由從 Milvus 擷取的文件所構成。</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
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
<p>使用<code translate="no">gemini-3-pro-preview</code> 模型以及這些提示來產生最終的回應。</p>
<pre><code translate="no">gemini_model = genai.GenerativeModel(
    <span class="hljs-string">&quot;gemini-3-pro-preview&quot;</span>, system_instruction=SYSTEM_PROMPT
)
response = gemini_model.generate_content(USER_PROMPT)
<span class="hljs-built_in">print</span>(response.text)
<button class="copy-code-btn"></button></code></pre>
<p>從輸出中，您可以看到 Gemini 3 Pro 根據檢索到的資訊產生了一個清晰、結構良好的答案。</p>
<pre><code translate="no">Based <span class="hljs-keyword">on</span> the provided documents, Milvus stores data <span class="hljs-keyword">in</span> the following ways:
*   **Inserted Data:** Vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> an incremental log. Milvus supports multiple <span class="hljs-built_in">object</span> storage backends <span class="hljs-keyword">for</span> <span class="hljs-keyword">this</span> purpose, including:
    *   MinIO
    *   AWS S3
    *   <span class="hljs-function">Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>)
    *   Azure Blob Storage
    *   Alibaba Cloud OSS
    *   Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>)
*   **Metadata:** Metadata generated within Milvus modules <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> **etcd**.
*   **Memory Buffering:** Incremental <span class="hljs-title">data</span> (<span class="hljs-params">growing segments</span>) are buffered <span class="hljs-keyword">in</span> memory before being persisted, <span class="hljs-keyword">while</span> historical <span class="hljs-title">data</span> (<span class="hljs-params"><span class="hljs-keyword">sealed</span> segments</span>) resides <span class="hljs-keyword">in</span> <span class="hljs-built_in">object</span> storage but <span class="hljs-keyword">is</span> loaded <span class="hljs-keyword">into</span> memory <span class="hljs-keyword">for</span> querying.
</span><button class="copy-code-btn"></button></code></pre>
<p><strong>注意</strong>：Gemini 3 Pro 目前不提供給免費階層使用者。<a href="https://ai.google.dev/gemini-api/docs/rate-limits#tier-1">點選此處</a>瞭解更多詳細資訊。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Gemini_3_Pro1_095925d461.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Gemini_3_Pro2_71ae286cf9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>您可以改用<a href="https://openrouter.ai/google/gemini-3-pro-preview/api">OpenRouter</a>來存取：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
client = OpenAI(
  base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
  api_key=<span class="hljs-string">&quot;&lt;OPENROUTER_API_KEY&gt;&quot;</span>,
)
response2 = client.chat.completions.create(
  model=<span class="hljs-string">&quot;google/gemini-3-pro-preview&quot;</span>,
  messages=[
        {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>,
            <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT
        },
        {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, 
            <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT
        }
    ],
  extra_body={<span class="hljs-string">&quot;reasoning&quot;</span>: {<span class="hljs-string">&quot;enabled&quot;</span>: <span class="hljs-literal">True</span>}}
)
response_message = response2.choices[<span class="hljs-number">0</span>].message
<span class="hljs-built_in">print</span>(response_message.content)
<button class="copy-code-btn"></button></code></pre>
<h2 id="One-More-Thing-Vibe-Coding-with-Google-Antigravity" class="common-anchor-header">還有一件事：使用 Google Antigravity 進行 Vibe 編碼<button data-href="#One-More-Thing-Vibe-Coding-with-Google-Antigravity" class="anchor-icon" translate="no">
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
    </button></h2><p>除了 Gemini 3 Pro 之外，Google 還推出了<a href="https://antigravity.google/"><strong>Google Antigravity</strong></a>，這是一個可自主與編輯器、終端和瀏覽器互動的視頻編碼平台。與早期處理一次性指令的 AI 輔助工具不同，Antigravity 是在以任務為導向的層級上運作 - 開發人員可以指定他們想要建立<em>什麼</em>，而系統可以管理<em>如何</em>建立，並協調端對端的完整工作流程。</p>
<p>傳統的 AI 編碼工作流程通常會產生孤立的片段，開發人員仍需檢閱、整合、除錯並手動執行。Antigravity 改變了這種動態。您只需描述任務，例如<em>「建立一個簡單的寵物互動遊戲</em>」，系統就會分解請求、產生程式碼、執行終端指令、開啟瀏覽器測試結果，並反覆執行，直到成功為止。它將人工智能從一個被動的自動完成引擎提升為一個主動的工程夥伴 - 它可以學習您的喜好，並隨著時間的推移適應您的個人開發風格。</p>
<p>展望未來，代理程式直接與資料庫協調的想法並不遙遠。透過 MCP 的工具呼叫，人工智能最終可以從 Milvus 資料庫讀取資料、組合知識庫，甚至自主維護自己的檢索管道。從許多方面來看，這種轉變甚至比模型升級本身更為重要：一旦人工智慧能夠接受產品層級的描述，並將其轉換成一連串的可執行任務，人類的努力自然會轉移到定義目標、限制條件，以及「正確性」的樣子 - 真正驅動產品開發的更高層級思維。</p>
<h2 id="Ready-to-Build" class="common-anchor-header">準備好建立了嗎？<button data-href="#Ready-to-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>如果您已準備好嘗試使用，請依照我們的逐步教學，立即使用<strong>Gemini 3 Pro + Milvus</strong>建立 RAG 系統。</p>
<p>有任何問題或想要深入瞭解任何功能？加入我們的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 頻道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提交問題。您也可以透過<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 預約 20 分鐘的一對一課程，以獲得深入瞭解、指導和問題解答。</p>
