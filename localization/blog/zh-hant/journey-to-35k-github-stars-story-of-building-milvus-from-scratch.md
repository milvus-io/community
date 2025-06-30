---
id: journey-to-35k-github-stars-story-of-building-milvus-from-scratch.md
title: 我們邁向 35K+ GitHub Stars 的旅程：從零開始建立 Milvus 的真實故事
author: Zilliz
date: 2025-06-27T00:00:00.000Z
cover: assets.zilliz.com/Github_star_30_K_2_f329467096.png
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, vector database, vector search, AI search, Zilliz Cloud'
meta_title: |
  Our Journey to 35K+ GitHub Stars: Building Milvus from Scratch
desc: 與我們一起慶祝向量資料庫 Milvus 在 GitHub 上獲得 35.5K 顆星。探索我們的故事，以及我們如何讓開發人員更輕鬆地使用 AI 解決方案。
origin: >-
  https://milvus.io/blog/journey-to-35k-github-stars-story-of-building-milvus-from-scratch.md
---
<p>過去幾年來，我們一直專注於一件事：為 AI 時代建立企業就緒的向量資料庫。最難的部分並不是建立資料庫，而是建立<em>一個</em>可擴充、易於使用，並能解決生產中實際問題的資料庫。</p>
<p>今年六月，我們達到了一個新的里程碑：Milvus<a href="https://github.com/milvus-io/milvus">在 GitHub 上</a>獲得了<a href="https://github.com/milvus-io/milvus">35,000 顆星星</a>（在撰寫本文時，Milvus 已擁有 35.5K+ 顆星星）。我們不會假裝這只是另一個數字，它對我們意義重大。</p>
<p>每顆星星都代表一位開發人員花了時間觀看我們所建立的東西，發現它有用到可以加入書籤，並且在許多情況下，決定使用它。有些人更進一步：提出問題、貢獻程式碼、在論壇回答問題，以及在其他開發人員遇到困難時提供協助。</p>
<p>我們希望花一些時間來分享我們的故事--真實的故事，包括所有亂七八糟的部分。</p>
<h2 id="We-Started-Building-Milvus-Because-Nothing-Else-Worked" class="common-anchor-header">我們開始建立 Milvus，因為其他方法都行不通<button data-href="#We-Started-Building-Milvus-Because-Nothing-Else-Worked" class="anchor-icon" translate="no">
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
    </button></h2><p>回到 2017 年，我們從一個簡單的問題開始：隨著人工智能應用程式開始湧現，非結構化資料呈爆炸性成長，您該如何有效率地儲存和搜尋能夠強化語意理解的向量嵌入？</p>
<p>傳統資料庫並非為此而建。它們是針對行與列進行最佳化，而不是高維向量。現有的技術和工具對於我們的需求來說，不是無法實現，就是緩慢得令人痛苦。</p>
<p>我們嘗試了所有可用的方法。使用 Elasticsearch 自行組合解決方案。在 MySQL 之上建立自訂索引。甚至還試用了 FAISS，但它被設計為研究圖書館，而非生產資料庫基礎架構。沒有任何東西能提供我們所想的企業 AI 工作負載完整解決方案。</p>
<p><strong>因此，我們開始建立自己的解決方案。</strong>這並不是因為我們認為這會很容易 - 資料庫是出了名的難以維持正確，而是因為我們可以看到 AI 的發展方向，並知道它需要專門為此而建的基礎架構。</p>
<p>到了 2018 年，我們開始深入開發後來的<a href="https://milvus.io/">Milvus</a>。當時甚至還沒有「<strong>向量資料庫</strong>」這個名詞。我們基本上是在創造一個新類型的基礎架構軟體，這讓人既興奮又害怕。</p>
<h2 id="Open-Sourcing-Milvus-Building-in-Public" class="common-anchor-header">開放源碼 Milvus：公開建置<button data-href="#Open-Sourcing-Milvus-Building-in-Public" class="anchor-icon" translate="no">
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
    </button></h2><p>2019 年 11 月，我們決定將 Milvus 0.10 版開源。</p>
<p>開放原始碼意味著向全世界揭露你所有的缺陷。每一個 hack、每一個 TODO 註解、每一個你不完全確定的設計決定。但我們相信，如果向量資料庫要成為 AI 的重要基礎架構，就必須開放給所有人使用。</p>
<p>反應非常熱烈。開發人員不僅使用 Milvus，還對它進行了改進。他們發現了我們遺漏的錯誤，提出了我們沒有考慮到的功能，並提出了讓我們更努力思考設計選擇的問題。</p>
<p>2020 年，我們加入了<a href="https://lfaidata.foundation/">LF AI 與資料基金會</a>。這不僅是為了提高公信力，也讓我們學會如何維護一個永續的開放原始碼專案。如何處理治理、向後相容性，以及建立可持續數年而非數月的軟體。</p>
<p>到 2021 年，我們發表了 Milvus 1.0，<a href="https://lfaidata.foundation/projects/milvus/">並從 LF AI &amp; Data Foundation 畢業</a>。同年，我們贏得<a href="https://big-ann-benchmarks.com/neurips21.html">BigANN 全球挑戰賽</a>的十億規模向量搜尋。這場勝利感覺很好，但更重要的是，它驗證了我們解決真正問題的方式是正確的。</p>
<h2 id="The-Hardest-Decision-Starting-Over" class="common-anchor-header">最難的決定：重新開始<button data-href="#The-Hardest-Decision-Starting-Over" class="anchor-icon" translate="no">
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
    </button></h2><p>事情變得複雜了。到了 2021 年，Milvus 1.0 在許多使用個案中都運作良好，但企業客戶仍不斷要求相同的事項：更好的雲原生架構、更簡易的水平擴充、更簡單的操作。</p>
<p>我們有一個選擇：修修補補繼續前進，或是從頭重建。我們選擇重建。</p>
<p>Milvus 2.0 基本上是完全重寫。我們引進了具有動態擴充能力的完全解耦儲存-運算架構。我們花了兩年的時間，老實說，這是我們公司歷史上壓力最大的時期之一。我們拋棄了成千上萬人都在使用的工作系統，去建立一些未經驗證的東西。</p>
<p><strong>但是，當我們在 2022 年推出 Milvus 2.0 時，它將 Milvus 從一個強大的向量資料庫，轉變為可擴充至企業工作負載的生產就緒基礎架構。</strong>同年，我們也完成了<a href="https://zilliz.com/news/vector-database-company-zilliz-series-b-extension">B+ 輪融資 - 不是</a>為了燒錢，而是為了加倍提升產品品質和對全球客戶的支援。我們知道這條路需要時間，但每一步都必須建立在穩固的基礎上。</p>
<h2 id="When-Everything-Accelerated-with-AI" class="common-anchor-header">當一切都因人工智慧而加速時<button data-href="#When-Everything-Accelerated-with-AI" class="anchor-icon" translate="no">
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
    </button></h2><p>2023 年是<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>（<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval</a>-augmented Generation）之年。突然之間，語意搜尋從一種有趣的 AI 技術，變成聊天機器人、文件問答系統和 AI 代理的必要基礎架構。</p>
<p>GitHub 上 Milvus 的星級飆升。支援請求成倍增加。從未聽過向量資料庫的開發人員突然問起關於索引策略和查詢最佳化的複雜問題。</p>
<p>這樣的成長令人興奮，但也讓人應接不暇。我們意識到，我們需要擴展的不只是我們的技術，還有我們整個社群支援的方法。我們聘請了更多的開發人員支持者，完全重寫了我們的說明文件，並開始為剛開始使用向量資料庫的開發人員製作教育內容。</p>
<p>我們也推出了<a href="https://zilliz.com/cloud">Zilliz Cloud -</a>Milvus 的完整管理版本。有些人問我們為什麼要將我們的開放原始碼專案「商業化」。誠實的答案是，維護企業級的基礎架構既昂貴又複雜。Zilliz Cloud 讓我們能夠維持並加速 Milvus 的開發，同時保持核心專案完全開放原始碼。</p>
<p>接下來就是 2024 年。<a href="https://zilliz.com/blog/zilliz-named-a-leader-in-the-forrester-wave-vector-database-report"><strong>Forrester 評選我們為</strong></a> <strong>向量資料庫類別的</strong> <a href="https://zilliz.com/blog/zilliz-named-a-leader-in-the-forrester-wave-vector-database-report"><strong>領導者</strong></a> <strong>。</strong>Milvus 在 GitHub 上突破了 30,000 顆星星。<strong>我們意識到：我們鋪設了七年的道路終於成為了高速公路。</strong>隨著越來越多企業採用向量資料庫作為關鍵基礎架構，我們的業務成長也迅速加速，證明我們所建立的基礎無論在技術上或商業上都可以擴充。</p>
<h2 id="The-Team-Behind-Milvus-Zilliz" class="common-anchor-header">Milvus 背後的團隊：Zilliz<button data-href="#The-Team-Behind-Milvus-Zilliz" class="anchor-icon" translate="no">
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
    </button></h2><p>有趣的是：許多人都知道 Milvus，卻不知道 Zilliz。事實上，我們對此並不介意。<a href="https://zilliz.com/"><strong>Zilliz</strong></a> <strong>是 Milvus 背後的團隊 - 我們建立它、維護它、支援它。</strong></p>
<p>我們最關心的是那些不華麗的東西，這些東西讓酷炫的示範與生產就緒的基礎架構之間有了區別：效能最佳化、安全修補程式、對初學者有實際幫助的文件，以及對 GitHub 問題的周到回應。</p>
<p>我們在美國、歐洲和亞洲建立了全天候的全球支援團隊，因為開發人員需要的是他們時區的幫助，而不是我們時區的幫助。我們有被稱為「<a href="https://docs.google.com/forms/d/e/1FAIpQLSfkVTYObayOaND8M1ci9eF_YWvoKDb-xQjLJYZ-LhbCdLAt2Q/viewform">Milvus 大使</a>」的社群貢獻者，他們會組織活動、回答論壇問題，並經常比我們更好地解釋概念。</p>
<p>我們也歡迎與 AWS、GCP 及其他雲端供應商整合 - 即使他們提供自己的 Milvus 管理版本。更多部署選項對使用者來說是好事。儘管我們注意到，當團隊遇到複雜的技術挑戰時，他們通常會直接與我們聯繫，因為我們對系統有最深入的瞭解。</p>
<p>許多人認為開放原始碼只是一個「工具箱」，但它其實是一個「進化過程」- 由無數熱愛並相信開放原始碼的人所共同努力的成果。只有真正瞭解架構的人，才能提供錯誤修正、效能瓶頸分析、資料系統整合及架構調整背後的 「原因」。</p>
<p><strong>因此，如果您正在使用開放原始碼的 Milvus，或正在考慮將向量資料庫作為您 AI 系統的核心元件，我們鼓勵您直接與我們聯繫，以獲得最專業、最及時的支援。</strong></p>
<h2 id="Real-Impact-in-Production-The-Trust-from-Users" class="common-anchor-header">生產中的真正影響：來自使用者的信任<button data-href="#Real-Impact-in-Production-The-Trust-from-Users" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 的用例已超越我們最初的想像。我們正在為全球各行各業中一些要求最嚴格的企業提供人工智能基礎設施。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/zilliz_customers_66d3adfe97.png" alt="zilliz customers.png" class="doc-image" id="zilliz-customers.png" />
   </span> <span class="img-wrapper"> <span>zilliz 客戶.png</span> </span></p>
<p><a href="https://zilliz.com/customers/bosch"><strong>博世</strong></a>，全球汽車技術的領導者和自動駕駛的先驅，使用 Milvus 徹底改變了他們的數據分析，實現了數據收集成本降低 80% 和每年節省 140 萬美元，同時在毫秒鐘內搜索數十億個駕駛場景以尋找關鍵邊緣案例。</p>
<p><a href="https://zilliz.com/customers/read-ai"><strong>Read AI</strong></a> 是成長最快的生產力 AI 公司之一，每月服務數百萬的活躍用戶，他們使用 Milvus 在數十億筆記錄中實現了低於 20-50 毫秒的檢索延遲，並在代理搜索中實現了 5 倍的速度提升。他們的 CTO 表示：「Milvus 可作為中央儲存庫，為我們在數十億筆記錄中進行資訊檢索提供動力。</p>
<p><a href="https://zilliz.com/customers/global-fintech-leader"><strong>一家全球金融科技領導廠商</strong></a>，是全球最大的數位支付平台之一，處理 200 多個國家和 25 種以上貨幣的數百億筆交易，選擇 Milvus 的批次擷取速度比競爭對手快 5-10 倍，可在 1 小時內完成其他廠商需要 8 小時以上的工作。</p>
<p><a href="https://zilliz.com/customers/filevine"><strong>Filevine</strong></a> 是受全美數千家律師事務所信賴的領先法律工作平台，管理數百萬份法律文件中的 30 億個向量，為律師節省 60-80% 的文件分析時間，實現法律案件管理的「真正資料意識」。</p>
<p>我們也支援<strong>NVIDIA、OpenAI、Microsoft、Salesforce、Walmart</strong>等幾乎所有產業。超過 10,000 家組織已將 Milvus 或 Zilliz Cloud 列為向量資料庫的首選。</p>
<p>這些不僅僅是技術上的成功案例，更是向量資料庫如何悄然成為關鍵基礎架構的範例，為人們每天使用的 AI 應用程式提供動力。</p>
<h2 id="Why-We-Built-Zilliz-Cloud-Enterprise-Grade-Vector-Database-as-a-Service" class="common-anchor-header">我們為何建立 Zilliz Cloud？企業級向量資料庫即服務<button data-href="#Why-We-Built-Zilliz-Cloud-Enterprise-Grade-Vector-Database-as-a-Service" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 是開放原始碼且免費使用。但是，在企業規模下運行 Milvus 需要深厚的專業知識和大量資源。索引選擇、記憶體管理、擴充策略、安全性配置，這些都不是小事。許多團隊想要擁有 Milvus 的強大功能，但又不希望操作複雜，而且還需要企業支援、SLA 保證等。</p>
<p>這就是我們建立<a href="https://zilliz.com/cloud">Zilliz Cloud</a>的原因<a href="https://zilliz.com/cloud">- 一個</a>部署在全球 25 個地區和 5 種主要雲端 (包括 AWS、GCP 和 Azure) 的完全受管版本 Milvus，專為要求效能、安全性和可靠性的企業級 AI 工作負載而設計。</p>
<p>以下是 Zilliz Cloud 的與眾不同之處：</p>
<ul>
<li><p><strong>大規模與高效能：</strong>我們專屬的 AI 驅動 AutoIndex 引擎可提供比開源 Milvus 快 3-5 倍的查詢速度，且不需要調整索引。雲端原生架構可支援數十億向量和數萬個並發查詢，同時維持亞秒級的回應時間。</p></li>
<li><p><a href="https://zilliz.com/trust-center"><strong>內建安全性與合規性</strong></a><strong>：</strong>靜態和傳輸中加密、細緻的 RBAC、全面的稽核記錄、SAML/OAuth2.0 整合以及<a href="https://zilliz.com/bring-your-own-cloud">BYOC</a>(自備雲端) 部署。我們符合 GDPR、HIPAA 及其他企業實際需要的全球標準。</p></li>
<li><p><strong>優化成本效益：</strong>分層冷/熱資料儲存、可回應實際工作負載的彈性擴充，以及隨用隨付的價格，與自行管理的部署相比，總擁有成本可降低 50%，甚至更多。</p></li>
<li><p><strong>真正的雲端相容性，無廠商鎖定：</strong>在 AWS、Azure、GCP、阿里巴巴雲或騰訊雲上部署，無廠商鎖定。無論您在何處運行，我們都能確保全球一致性和可擴展性。</p></li>
</ul>
<p>這些功能聽起來可能並不華麗，但它們解決了企業團隊在大規模建置 AI 應用程式時所面臨的實際日常問題。最重要的是：Milvus 底下仍然是 Milvus，因此沒有專利鎖定或相容性問題。</p>
<h2 id="Whats-Next-Vector-Data-Lake" class="common-anchor-header">下一步是什麼？向量資料湖<button data-href="#Whats-Next-Vector-Data-Lake" class="anchor-icon" translate="no">
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
    </button></h2><p>我們創造了「<a href="https://zilliz.com/learn/what-is-vector-database">向量資料庫</a>」一詞，也是第一個建立<a href="https://zilliz.com/learn/what-is-vector-database">向量資料庫</a>的公司，但我們不會就此止步。我們現在正在建立下一個進化：<strong>向量資料湖。</strong></p>
<p><strong>我們要解決的問題是：並非每次向量搜尋都需要毫秒級的延遲。</strong>許多企業擁有偶爾進行查詢的大量資料集，包括歷史文件分析、批次相似性計算以及長期趨勢分析。對於這些使用個案，傳統的即時向量資料庫既過時又昂貴。</p>
<p>Vector Data Lake 採用儲存與運算分離的架構，專門針對大規模、非經常存取的向量進行最佳化，同時成本遠低於即時系統。</p>
<p><strong>核心功能包括</strong></p>
<ul>
<li><p><strong>統一資料堆疊：</strong>以一致的格式和高效的儲存方式無縫連接線上和離線資料層，因此您可以在熱層和冷層之間移動資料，而無需重新格式化或複雜的遷移。</p></li>
<li><p><strong>相容的運算生態系統：</strong>可與 Spark 和 Ray 等框架原生運作，支援從向量搜尋到傳統 ETL 和分析的所有功能。這表示您現有的資料團隊可以使用他們熟悉的工具來處理向量資料。</p></li>
<li><p><strong>成本最佳化架構：</strong>熱資料保留在 SSD 或 NVMe 上，以便快速存取；冷資料則自動移至 S3 等物件儲存。智慧索引與儲存策略可在您需要時保持快速 I/O，同時使儲存成本可預測且經濟實惠。</p></li>
</ul>
<p>這並非要取代向量資料庫，而是要為企業的每個工作負載提供正確的工具。即時搜尋適用於面向使用者的應用程式，經濟實惠的向量資料湖適用於分析和歷史處理。</p>
<p>我們仍然相信摩爾定律 (Moore's Law) 和傑文斯悖論 (Jevons Paradox) 背後的邏輯：隨著運算單位成本的下降，採用的規模也會擴大。這也適用於向量基礎架構。</p>
<p>透過日復一日地改善索引、儲存結構、快取和部署模型，我們希望讓每個人都能更容易使用且負擔得起 AI 基礎架構，並協助將非結構化資料帶入 AI 原生的未來。</p>
<h2 id="A-Big-Thanks-to-You-All" class="common-anchor-header">衷心感謝各位！<button data-href="#A-Big-Thanks-to-You-All" class="anchor-icon" translate="no">
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
    </button></h2><p>這 35K+ 顆星星代表了我們真正引以為傲的東西：一個開發人員認為 Milvus 有用到足以推薦和貢獻的社群。</p>
<p>但我們還沒完成。Milvus 還需要修正錯誤、改善效能，以及開發社群一直要求的功能。我們的路線圖是公開的，我們真心希望您能提供意見，讓我們決定優先順序。</p>
<p>數字本身並不重要，重要的是這些星星所代表的信任。相信我們會繼續在開放的環境中建設，繼續聆聽回饋，繼續讓 Milvus 變得更好。</p>
<ul>
<li><p><strong>對於我們的貢獻者：</strong>您們的 PR、錯誤回報和文件改進讓 Milvus 每天都更好。非常感謝您們。</p></li>
<li><p><strong>致我們的使用者：</strong>感謝您們信任我們，讓我們可以處理您們的生產工作負荷，以及讓我們保持誠實的回饋。</p></li>
<li><p><strong>致我們的社群：</strong>感謝您們回答問題、組織活動，以及幫助新手入門。</p></li>
</ul>
<p>如果您是向量資料庫的新手，我們很樂意幫助您入門。如果您已經在使用 Milvus 或 Zilliz Cloud，我們很樂意<a href="https://zilliz.com/share-your-story">聽取您的經驗</a>。如果您只是對我們的建置感到好奇，我們的社群頻道隨時開放。</p>
<p>讓我們一起持續建立讓 AI 應用成為可能的基礎架構。</p>
<hr>
<p>在這裡找到我們：<a href="https://github.com/milvus-io/milvus">Milvus on GitHub |</a><a href="https://zilliz.com/"> Zilliz Cloud</a>|<a href="https://discuss.milvus.io/"> Discord</a>|<a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a>|<a href="https://x.com/zilliz_universe">X</a>|<a href="https://www.youtube.com/@MilvusVectorDatabase/featured">YouTube</a></p>
<p><a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1751017913702.1751029841530.667&amp;__hssc=175614333.3.1751029841530&amp;__hsfp=3554976067">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/office_hour_4fb9130a9b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
