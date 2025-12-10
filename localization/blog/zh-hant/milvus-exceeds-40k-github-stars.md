---
id: milvus-exceeds-40k-github-stars.md
title: 7 年、2 次重大重建、40K+ GitHub Stars：Milvus 成為領先開源向量資料庫的崛起之路
author: Fendy Feng
date: 2025-12-02T00:00:00.000Z
cover: assets.zilliz.com/star_history_3dfceda40f.png
tag: announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database'
meta_title: >
  7 Years, 2 Major Rebuilds, 40K+ GitHub Stars: The Rise of Milvus as the
  Leading Open-Source Vector Database
desc: 慶祝 Milvus 成為全球領先的開放原始碼向量資料庫的七年旅程
origin: 'https://milvus.io/blog/milvus-exceeds-40k-github-stars.md'
---
<p>2025 年 6 月，Milvus 在 GitHub 上的星級達到 35,000 個。短短幾個月後，我們現在已經<a href="https://github.com/milvus-io/milvus">突破 40,000 顆星</a>，這不僅是動力的<a href="https://github.com/milvus-io/milvus">證明</a>，也是全球社群不斷推動向量與多模式搜尋未來的<a href="https://github.com/milvus-io/milvus">證明</a>。</p>
<p>我們非常感激。對於每一位在 Milvus 上加星、分叉、提出問題、爭論 API、分享基準或建立令人難以置信的東西的人：<strong>感謝您們，是您們讓這個專案能如此快速地發展</strong>。每顆星星代表的不只是按下一個按鈕 - 它反映出有人選擇 Milvus 來推動他們的工作，有人相信我們正在建立的東西，有人分享我們對開放、無障礙、高效能 AI 基礎架構的願景。</p>
<p>因此，在慶祝的同時，我們也展望未來--您所要求的功能、AI 現在所需的架構，以及多模態、語義理解成為每個應用程式預設功能的世界。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/star_history_3dfceda40f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Journey-From-Zero-to-40000+-Stars" class="common-anchor-header">旅程：從零到 40,000+ 顆星<button data-href="#The-Journey-From-Zero-to-40000+-Stars" class="anchor-icon" translate="no">
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
    </button></h2><p>當我們在 2017 年開始建立 Milvus 時，<em>向量資料庫</em>這個名詞甚至還不存在。我們當時只是一個由工程師組成的小團隊，深信 AI 應用程式很快就會需要一種新的資料基礎架構--不是針對行與列而建，而是針對高維、非結構化、多模態資料而建。傳統資料庫並不是為這個世界所建立的，我們知道必須有人重新想像儲存與擷取的樣貌。</p>
<p>早期的工作遠非那麼光彩奪目。建立企業等級的基礎架構是緩慢而艱鉅的工作，我們花了好幾個星期來分析程式碼路徑、重寫元件，並在凌晨兩點質疑設計的選擇。但我們堅持一個簡單的使命：<strong>讓建立 AI 應用程式的每個開發人員都能使用向量搜尋、擴充性和可靠性</strong>。這項任務帶領著我們經歷了最初的突破和不可避免的挫折。</p>
<p>一路走來，幾個轉捩點改變了一切：</p>
<ul>
<li><p><strong>2019 年：</strong>我們將 Milvus 0.10 開源。這意味著我們暴露了所有粗糙的邊緣 - hacks、TODOs、我們還不引以為傲的部分。但是社群出現了。開發人員提出了我們從未發現的問題，建議了我們從未想像過的功能，並挑戰了一些假設，最終使 Milvus 更為強大。</p></li>
<li><p><strong>2020-2021:</strong>我們加入了<a href="https://lfaidata.foundation/projects/milvus/">LF AI &amp; Data 基金會</a>，推出了 Milvus 1.0，從 LF AI &amp; Data 畢業，並贏得了<a href="https://big-ann-benchmarks.com/neurips21.html">BigANN</a>十億規模向量搜尋挑戰--這是我們的架構能夠處理實際規模的早期證明。</p></li>
<li><p><strong>2022：</strong>企業使用者需要 Kubernetes 原生擴充、彈性，以及真正的儲存與運算分離。我們面臨一個艱難的抉擇：修補舊系統或重建一切。我們選擇了更艱難的道路。<strong>Milvus 2.0 是一次從頭到尾的重塑</strong>，引入了完全解耦的雲原生架構，將 Milvus 轉變為關鍵任務 AI 工作負載的生產級平台。</p></li>
<li><p><strong>2024-2025:</strong> <a href="https://zilliz.com/">Zilliz</a>（Milvus 背後的團隊）<a href="https://zilliz.com/resources/analyst-report/zilliz-forrester-wave-vector-database-report">被 Forrester</a> 評為<a href="https://zilliz.com/resources/analyst-report/zilliz-forrester-wave-vector-database-report">領導者</a>，飆破 30,000 顆星星，目前已超過 40,000 顆。它成為多模式搜尋、RAG 系統、代理工作流程，以及跨產業 (教育、金融、創意製作、科學研究等) 十億規模檢索的骨幹。</p></li>
</ul>
<p>這個里程碑不是靠炒作贏來的，而是因為開發人員選擇 Milvus 作為真正的生產工作負載，並推動我們改善每一步。</p>
<h2 id="2025-Two-Major-Releases-Massive-Performance-Gains" class="common-anchor-header">2025:兩個主要版本，大幅提升效能<button data-href="#2025-Two-Major-Releases-Massive-Performance-Gains" class="anchor-icon" translate="no">
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
    </button></h2><p>2025 年是 Milvus 踏入新領域的一年。雖然向量搜尋在語意理解方面表現優異，但生產中的現實情況很簡單：<strong>開發人員仍然需要精確的關鍵字匹配</strong>，如產品 ID、序號、精確的短語、法律術語等。如果沒有原生的全文搜尋功能，團隊就必須維護 Elasticsearch/OpenSearch 叢集，或是將他們自己的客製解決方案黏合在一起，這會加倍增加作業開銷與分散性。</p>
<p><a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md"><strong>Milvus 2.5</strong></a> <strong>改變了這種情況</strong>。Milvus 2.5 引入了<strong>真正原生的混合搜尋</strong>，將全文檢索與向量搜尋結合為單一引擎。開發人員第一次可以同時執行詞彙查詢、語義查詢和元資料篩選器，而無需處理額外的系統或同步管道。我們也升級了元資料篩選、表達式解析和執行效率，讓混合查詢在真實的生產負載下感覺自然且快速。</p>
<p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Milvus 2.6</strong></a> <strong>進一步推進這股動力</strong>，針對我們最常聽到用戶在規模運行時所面對的兩項挑戰：<strong><em>成本</em>與<em>效能</em>。</strong>此版本提供了深入的架構改進 - 更可預測的查詢路徑、更快的索引、大幅降低的記憶體使用率，以及更有效率的儲存。許多團隊報告說，在不變更任何應用程式程式碼的情況下，立即獲得了進步。</p>
<p>以下是 Milvus 2.6 的幾個重點：</p>
<ul>
<li><p><a href="https://milvus.io/docs/tiered-storage-overview.md"><strong>分層儲存</strong></a>，讓團隊能更智慧地平衡成本與效能，減少高達 50% 的儲存成本。</p></li>
<li><p>透過<a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">RaBitQ 1 位元量化</a>，<strong>大幅節省記憶體</strong>- 在提供更快速查詢的同時，記憶體使用量最多可減少 72%。</p></li>
<li><p><a href="https://milvus.io/docs/full-text-search.md"><strong>重新設計的全文本引擎</strong></a>，其 BM25 實作速度大幅提升 - 在我們的基準測試中，比 Elasticsearch 快達 4 倍。</p></li>
<li><p>針對<a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">JSON 結構元資料</a>的<strong>新路徑索引</strong>，讓複雜文件的篩選速度提升 100 倍。</p></li>
<li><p><a href="https://milvus.io/docs/aisaq.md"><strong>AiSAQ</strong>：</a>十億級壓縮，可減少 3200 倍的儲存空間，並提供強大的召回能力。</p></li>
<li><p><strong>使用 R-Tree 的</strong><strong>語意 +</strong> <a href="https://milvus.io/docs/geometry-operators.md"><strong>地理空間搜尋</strong></a> <strong>：</strong>結合<em>事物的位置</em>與<em>意義</em>，提供更相關的結果</p></li>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA"><strong>CAGRA+ Vamana</strong></a><strong>：</strong>以混合 CAGRA 模式降低部署成本，該模式在 GPU 上建立，但在 CPU 上進行查詢</p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md"><strong>資料輸入、資料輸出</strong></a><strong>」工作流程</strong>可簡化嵌入式的<strong>擷取</strong>與檢索，尤其適用於多模式管道。</p></li>
<li><p>在單一叢集中<strong>支援高達 100K 的集合</strong>- 邁向真正規模化多租戶的重要一步。</p></li>
</ul>
<p>如需深入瞭解 Milvus 2.6，請查看<a href="https://milvus.io/docs/release_notes.md">完整的發佈說明</a>。</p>
<h2 id="Beyond-Milvus-Open-Source-Tools-for-AI-Developers" class="common-anchor-header">超越 Milvus：AI 開發人員的開放原始碼工具<button data-href="#Beyond-Milvus-Open-Source-Tools-for-AI-Developers" class="anchor-icon" translate="no">
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
    </button></h2><p>在 2025 年，我們不只改善 Milvus，還建立了強化整個 AI 開發者生態系統的工具。我們的目標不是追逐趨勢，而是提供建置者我們一直希望存在的開放、強大、透明的工具。</p>
<h3 id="DeepSearcher-Research-Without-Cloud-Lock-In" class="common-anchor-header">DeepSearcher：無雲端鎖定的研究</h3><p>OpenAI 的 Deep Researcher 證明了深度推理代理的能力。但它是封閉的、昂貴的，而且鎖在雲端 API 之後。<a href="https://github.com/zilliztech/deep-searcher"><strong>DeepSearcher</strong></a> <strong>就是我們的答案。</strong>它是一個本地、開放源碼的深度研究引擎，專為想要進行結構化調查而又不犧牲控制或隱私的人所設計。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepsearcher_5cf6a4f0dc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DeepSearcher 完全在您的機器上執行，收集各個來源的資訊、綜合洞察力，並提供引文、推理步驟和可追蹤性 - 這些都是真正研究的必要功能，而不僅僅是表面層級的摘要。沒有黑盒。沒有廠商鎖定。只有開發人員和研究人員可以信任的透明、可重複的分析。</p>
<h3 id="Claude-Context-Coding-Assistants-That-Actually-Understand-Your-Code" class="common-anchor-header">Claude Context：真正瞭解您程式碼的編碼助手</h3><p>大多數 AI 編碼工具的行為仍像花俏的 grep 管道 - 快速、膚淺、燒代幣，而且對真正的專案結構視若無睹。<a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a>改變了這一切。Claude Context 是一個 MCP 外掛程式，它終於讓編碼助理擁有了他們一直缺少的東西：對您的程式碼庫有真正的語意理解。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_7f608a153d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Claude Context 在您的專案中建立向量驅動的語意索引，讓編碼助手找到正確的模組、追蹤檔案間的關係、了解架構層級的意圖，並根據相關性而非猜測回答問題。它可以減少代碼浪費、提高精確度，而且最重要的是，讓編碼助手的行為彷彿真正瞭解您的軟體，而不是裝作瞭解。</p>
<p>這兩種工具都是完全開放原始碼的。因為 AI 基礎架構應該是屬於每個人的，也因為 AI 的未來不應該被鎖在專屬的牆後。</p>
<h2 id="Trusted-by-10000+-Teams-in-Production" class="common-anchor-header">受到 10,000+ 個生產團隊的信賴<button data-href="#Trusted-by-10000+-Teams-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>今天，超過 10,000 個企業團隊在生產中運行 Milvus，從快速成長的新創公司到全球最知名的科技公司和財富 500 強企業。NVIDIA、Salesforce、eBay、Airbnb、IBM、AT&amp;T、LINE、Shopee、Roblox、Bosch，以及微軟內部的團隊都仰賴 Milvus 為人工智慧系統提供動力，讓系統每分每秒都能運作。他們的工作負載涵蓋搜尋、推薦、代理管道、多模態檢索，以及將向量基礎架構推至極限的其他應用程式。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/logos_eb0d3ad4af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>但最重要的不僅僅是<em>誰在</em>使用 Milvus，而是<em>他們在用</em> Milvus<em>建構什麼</em>。在各行各業中，Milvus 是塑造企業營運、創新和競爭方式的系統：</p>
<ul>
<li><p>透過即時存取數十億個嵌入式資料，改善客戶支援、銷售工作流程和內部決策的<strong>AI 協同駕駛員和企業助理</strong>。</p></li>
<li><p><strong>電子商務、媒體和廣告的語義和視覺搜尋</strong>，推動更高的轉換率、更好的發現和更快的創意製作。</p></li>
<li><p><strong>法律、財務和科學智慧平台</strong>，將精確度、可審計性和合規性轉化為實際的營運收益。</p></li>
<li><p>金融科技與銀行業的<strong>詐欺偵測與風險引擎</strong>，仰賴快速的語意比對來即時預防損失。</p></li>
<li><p><strong>大規模的 RAG 與代理系統</strong>，可讓團隊深入瞭解情境、領域感知的 AI 行為。</p></li>
<li><p>將文字、程式碼、影像和元資料統一為連貫語意結構的<strong>企業知識層</strong>。</p></li>
</ul>
<p>這些都不是實驗室的基準，而是世界上要求最高的生產部署。Milvus 經常提供以下服務</p>
<ul>
<li><p>在數十億個向量中達到 50 毫秒以下的檢索速度</p></li>
<li><p>在單一系統中管理數十億個文件和事件</p></li>
<li><p>工作流程速度比其他解決方案快 5-10 倍</p></li>
<li><p>支援數十萬個集合的多租戶架構</p></li>
</ul>
<p>團隊選擇 Milvus 的原因很簡單：<strong>它能在重要的地方提供速度、可靠性、成本效益，以及擴充至數十億的能力，而不需要每隔幾個月就拆散他們的架構。</strong>這些團隊對我們的信任，也是我們持續強化 Milvus 以迎接未來十年人工智能發展的原因。</p>
<p><a href="https://zilliz.com/share-your-story">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/share_your_story_3c44c533ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
<h2 id="When-You-Need-Milvus-Without-the-Ops-Zilliz-Cloud" class="common-anchor-header">當您需要 Milvus 而無需運作時: Zilliz Cloud<button data-href="#When-You-Need-Milvus-Without-the-Ops-Zilliz-Cloud" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 是免費、強大且經過實戰測試的。但它同時也是一個分散式系統，而分散式系統的良好運行是一項真正的工程工作。索引調整、記憶體管理、群集穩定性、縮放、可觀測性......這些任務都需要時間和專業知識，而許多團隊根本沒有空閒時間。開發人員想要的是 Milvus 的強大功能，只是不需要管理其規模所不可避免的作業負擔。</p>
<p>這個現實讓我們得出一個簡單的結論：如果 Milvus 要成為 AI 應用程式的核心基礎架構，我們就必須讓它操作起來毫不費力。這就是我們建立<a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a> 的原因，這是由開放原始碼專案背後的同一團隊所建立與維護的完全管理式 Milvus 服務。</p>
<p>Zilliz Cloud 為開發人員提供了他們已經熟悉並信任的 Milvus，但卻不需要佈建叢集、撲救效能問題、規劃升級或擔心儲存與運算調整。由於它包含了在自我管理環境中無法執行的最佳化功能，因此速度更快、更可靠。<a href="https://zilliz.com/blog/cardinal-most-performant-vector-search-engine">Cardinal</a> 是我們的商用級自我最佳化向量引擎，其效能是<strong>開放原始碼 Milvus</strong> 的 10 倍。</p>
<p><strong>Zilliz Cloud 的與眾不同之處</strong></p>
<ul>
<li><strong>自動最佳化效能：</strong>AutoIndex 可自動調整 HNSW、IVF 和 DiskANN，提供 96%+ 的召回率，且不需任何手動設定。</li>
</ul>
<ul>
<li><p><strong>彈性與成本效益：</strong>隨用隨付的定價方式、無伺服器自動擴充，以及智慧型資源管理，與自行管理的部署相比，通常可降低 50% 以上的成本。</p></li>
<li><p><strong>企業級可靠性：</strong>99.95% 正常運行時間 SLA、多重 AZ 備援、符合 SOC 2 Type II、ISO 27001 及 GDPR 規範。完全支援 RBAC、BYOC、稽核記錄及加密。</p></li>
<li><p><strong>雲端相容部署：</strong>可在 AWS、Azure、GCP、阿里巴巴雲或騰雲上執行 - 無供應商鎖定，各處效能一致。</p></li>
<li><p><strong>自然語言查詢：</strong>內建 MCP 伺服器支援，可讓您以會話方式查詢資料，而非手動製作 API 呼叫。</p></li>
<li><p><strong>輕鬆遷移</strong>：使用內建的遷移工具，從 Milvus、Pinecone、Qdrant、Weaviate、Elasticsearch 或 PostgreSQL 遷移 - 無需重寫模式或停機。</p></li>
<li><p><strong>100% 相容於開放原始碼 Milvus。</strong>無專屬分叉。沒有鎖定。只有 Milvus，更輕鬆。</p></li>
</ul>
<p><strong>Milvus 將永遠保持開放原始碼及免費使用。</strong>但是，在企業規模上可靠地執行和運作 Milvus 需要大量的專業知識和資源。<strong>Zilliz Cloud 是我們對此缺口的解決方案</strong>。Zilliz Cloud 部署在 29 個地區和五個主要雲端，可提供企業級的效能、安全性和成本效益，同時讓您與已熟悉的 Milvus 保持完全一致。</p>
<p><a href="https://cloud.zilliz.com/signup"><strong>開始免費試用 → Zilliz Cloud</strong></a></p>
<h2 id="Whats-Next-Milvus-Lake" class="common-anchor-header">下一步是什麼？Milvus Lake<button data-href="#Whats-Next-Milvus-Lake" class="anchor-icon" translate="no">
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
    </button></h2><p>身為向量資料庫的導入團隊，我們對企業資料如何改變有著前瞻性的觀察。從前整齊地排列在 TB 級結構化表格中的資料，正快速地轉換成 PB 級，甚至很快就會轉換成 TB 級的多模態物件。文字、影像、音訊、視訊、時序串流、多感測器日誌......這些都是現代人工智能系統所依賴的資料集。</p>
<p>矢量資料庫是專為非結構化及多模態資料所建立的，但它們並不總是最經濟或架構上最合理的選擇 - 尤其是當絕大多數的資料都是冷冰冰的時候。大型模型的訓練語料庫、自動駕駛感知日誌和機器人資料集通常不需要毫秒級的延遲或高並發。透過即時向量資料庫執行如此大量的資料，對於不需要這種效能層級的管道來說，會變得昂貴、作業繁重、過於複雜。</p>
<p>這個現實促使我們提出下一個重要計畫：<strong>Milvus Lake - 一個</strong>專為 AI 規模資料所設計的語意驅動、索引先行的多模態湖泊。Milvus Lake 統一各種模式的語意訊號，包括向量、元資料、標籤、LLM 產生的描述，以及結構化欄位，並將這些訊號組織成以實際業務實體為中心的<strong>Semantic Wide Tables</strong>。以前以原始、分散檔案形式存在於物件儲存、湖泊倉庫和模型管道中的資料，現在則變成了統一、可查詢的語義層。龐大的多模式企業體會變成可管理、可檢索、可重複使用的資產，並在整個企業中具有一致的意義。</p>
<p>Milvus Lake 是建構在簡潔的<strong>清單 + 資料 + 索引</strong>架構上，將索引視為基礎，而非事後考慮。這樣就能發揮「先擷取、後處理」的工作流程，並針對萬億規模的冷資料進行最佳化，提供可預測的延遲、大幅降低的儲存成本，以及更高的作業穩定性。分層儲存方法 - 用於熱路徑的 NVMe/SSD，以及用於深層歸檔的物件儲存，搭配高效壓縮和懶人索引，可保留語意的真實性，同時牢牢控制基礎架構的開銷。</p>
<p>Milvus Lake 還能無縫插入現代資料生態系統，與 Paimon、Iceberg、Hudi、Spark、Ray 及其他大型資料引擎和格式整合。團隊可以在一個地方執行批次處理、近即時管道、語義檢索、特徵工程和訓練資料準備，而無需重新平台現有的工作流程。無論您是要建立基礎模型庫、管理自動駕駛模擬資料庫、訓練機器人代理，或是為大型檢索系統提供動力，Milvus Lake 都能為 AI 時代提供可擴充、具成本效益的語意湖泊。</p>
<p><strong>Milvus Lake 正在積極開發中。</strong>對早期存取有興趣或想瞭解更多？<a href="https://zilliz.com/contact"> </a></p>
<p><a href="https://zilliz.com/contact-sales"><strong>請聯絡我們 →。</strong></a></p>
<h2 id="Built-by-the-Community-For-the-Community" class="common-anchor-header">由社群打造，為社群服務<button data-href="#Built-by-the-Community-For-the-Community" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 的特別之處不僅在於技術，更在於技術背後的人才。我們的貢獻者群橫跨全球，匯集了來自高效能運算、分散式系統和 AI 基礎架構的專家。來自 ARM、NVIDIA、AMD、Intel、Meta、IBM、Salesforce、阿里巴巴、微軟等公司的工程師和研究人員貢獻了他們的專業知識，讓 Milvus 成為今天的樣貌。</p>
<p>每一個pull request、每一個bug報告、每一個在論壇上回答的問題、每一個創建的教學--這些貢獻讓Milvus對每個人來說都更好。</p>
<p>這個里程碑是屬於大家的：</p>
<ul>
<li><p><strong>我們的貢獻者</strong>：感謝您的程式碼、想法和時間。你們讓 Milvus 每一天都變得更好。</p></li>
<li><p><strong>致我們的使用者</strong>：感謝您信任 Milvus 的生產工作負載，並分享您的經驗，包括好的和具挑戰性的。您的回饋推動著我們的發展藍圖。</p></li>
<li><p><strong>致我們的社群支持者</strong>：感謝您回答問題、撰寫教程、創建內容，並幫助新手入門。是您們讓我們的社群變得熱情和包容。</p></li>
<li><p><strong>致我們的合作夥伴和整合商</strong>：感謝您們與我們合作，讓 Milvus 成為 AI 開發生態系統中的一級公民。</p></li>
<li><p><strong>致 Zilliz 團隊</strong>：感謝您們對開源專案與使用者成功的堅定承諾。</p></li>
</ul>
<p>Milvus 之所以能夠成長，是因為成千上萬的人決定一起建立一些東西--開放、慷慨，並且相信基礎 AI 基礎架構應該是每個人都可以使用的。</p>
<h2 id="Join-Us-on-This-Journey" class="common-anchor-header">加入我們的旅程<button data-href="#Join-Us-on-This-Journey" class="anchor-icon" translate="no">
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
    </button></h2><p>無論您是要建立您的第一個向量搜尋應用程式，或是要擴充至數十億個向量，我們都非常歡迎您成為 Milvus 社群的一員。</p>
<p><strong>開始</strong></p>
<ul>
<li><p><strong>在 GitHub 上加入我們</strong>：<a href="https://github.com/milvus-io/milvus"> github.com/milvus-io/milvus</a></p></li>
<li><p>☁️<strong>免費試用 Zilliz Cloud</strong>：<a href="https://zilliz.com/"> zilliz.com/cloud</a></p></li>
<li><p><strong>💬加入我們的</strong> <a href="https://discord.com/invite/8uyFbECzPX"><strong>Discord</strong></a>，與全球開發人員聯繫</p></li>
<li><p>📚<strong>探索我們的文件</strong>：<a href="https://milvus.io/docs">Milvus 文件</a></p></li>
<li><p>💬<strong>預約</strong> <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>20 分鐘的一對一會議</strong></a>，以獲得洞察力、指導和問題解答。</p></li>
</ul>
<p>前路令人振奮。隨著 AI 重塑產業並開啟新的可能性，向量資料庫將成為這場轉型的核心。我們正在共同建立現代 AI 應用程式所依賴的語意基礎，而我們才剛剛起步。</p>
<p>為了下一個 40,000 顆星星，也為了<strong>共同</strong>打造 AI 基礎架構的未來，乾杯。🎉</p>
