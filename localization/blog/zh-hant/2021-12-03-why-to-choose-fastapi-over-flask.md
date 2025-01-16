---
id: 2021-12-03-why-to-choose-fastapi-over-flask.md
title: 為何選擇 FastAPI 而非 Flask？
author: Yunmei
date: 2021-12-03T00:00:00.000Z
desc: 根據您的應用程式情境選擇適當的框架
cover: assets.zilliz.com/1_d5de035def.png
tag: Engineering
isPublish: false
---
<p>為了幫助您快速上手使用開源向量資料庫 Milvus，我們在 GitHub 上發佈了另一個附屬的開源專案<a href="https://github.com/milvus-io/bootcamp">Milvus Bootcamp</a>。Milvus Bootcamp 不僅提供基準測試所需的腳本與資料，還包含使用 Milvus 來建立一些 MVP（最小可行產品）的專案，例如反向圖片搜尋系統、視訊分析系統、QA 聊天機或推薦系統。您可以在 Milvus Bootcamp 中學習如何在充滿非結構化資料的世界中應用向量相似性搜尋，並獲得一些實作經驗。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_5b60157b4d.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>我們為 Milvus Bootcamp 中的專案提供前端與後端服務。不過，我們最近決定將採用的網頁框架從 Flask 改為 FastAPI。</p>
<p>本文旨在說明我們為何選擇 FastAPI 而非 Flask，以解釋我們改變 Milvus Bootcamp 所採用的網頁框架背後的動機。</p>
<h2 id="Web-frameworks-for-Python" class="common-anchor-header">Python 的 Web 框架<button data-href="#Web-frameworks-for-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>Web 框架指的是套件或模組的集合。它是一套用於網頁開發的軟體架構，讓您可以撰寫網頁應用程式或服務，並省去處理協定、套接字或流程/線程管理等低階細節的麻煩。使用網頁架構可以大幅減少開發網頁應用程式的工作量，因為您只需將程式碼「插入」到架構中，在處理資料快取、資料庫存取和資料安全性驗證時，不需要額外的注意。如需更多關於什麼是 Python 的網頁框架的資訊，請參閱<a href="https://wiki.python.org/moin/WebFrameworks">網頁框架</a>。</p>
<p>Python Web 框架有多種類型。主流的有 Django、Flask、Tornado 和 FastAPI。</p>
<h3 id="Flask" class="common-anchor-header">Flask</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_1abd170939.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p><a href="https://flask.palletsprojects.com/en/2.0.x/">Flask</a>是專為 Python 設計的輕量級微型框架，其核心簡單易用，可讓您開發自己的網頁應用程式。此外，Flask 核心也是可擴充的。因此，Flask 支援按需擴充不同的功能，以滿足您在開發 Web 應用程式時的個人化需求。也就是說，透過 Flask 的各種外掛程式庫，您可以開發出功能強大的網站。</p>
<p>Flask 具有以下特點：</p>
<ol>
<li>Flask 是一個微型框架，不依賴其他特定工具或第三方程式庫的元件來提供共用功能。Flask 沒有資料庫抽象層，也不需要表單驗證。然而，Flask 具有高度的可擴充性並支援以類似 Flask 本身的實作方式來增加應用程式功能。相關的擴充功能包括物件關聯映射器、表單驗證、上傳處理、開放驗證技術，以及一些專為網頁框架設計的常用工具。</li>
<li>Flask 是基於<a href="https://wsgi.readthedocs.io/">WSGI</a>（Web 伺服器閘道介面）的 Web 應用程式框架。WSGI 是一個簡單的介面，用來連接網頁伺服器與網頁應用程式或為 Python 語言定義的框架。</li>
<li>Flask 包含兩個核心函式庫<a href="https://www.palletsprojects.com/p/werkzeug">Werkzeug</a>和<a href="https://www.palletsprojects.com/p/jinja">Jinja2</a>。Werkzeug 是一個 WSGI 工具包，實作了 request、response 物件和實用函式，讓您可以在其上建立網頁框架。Jinja2 是適用於 Python 的流行全功能模板引擎。它完全支援 Unicode，具有可選但被廣泛採用的整合式沙箱執行環境。</li>
</ol>
<h3 id="FastAPI" class="common-anchor-header">FastAPI</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_05cb0dac4e.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p><a href="https://fastapi.tiangolo.com/">FastAPI</a>是一個現代的 Python 網路應用程式框架，具有與 Go 和 NodeJS 同等級的高效能。FastAPI 的核心是基於<a href="https://www.starlette.io/">Starlette</a>和<a href="https://pydantic-docs.helpmanual.io/">Pydantic</a>。Starlette 是一個輕量級的<a href="https://asgi.readthedocs.io/">ASGI</a>(Asynchronous Server Gateway Interface) 框架工具包，用來建立高效能的<a href="https://docs.python.org/3/library/asyncio.html">Asyncio</a>服務。Pydantic 是基於 Python 類型提示定義資料驗證、序列化與文件的函式庫。</p>
<p>FastAPI 具有以下特點：</p>
<ol>
<li>FastAPI 是基於 ASGI 的網路應用程式框架，ASGI 是連接網路通訊協定服務與 Python 應用程式的異步閘道通訊協定介面。FastAPI 可以處理各種常見的通訊協定類型，包括 HTTP、HTTP2 和 WebSocket。</li>
<li>FastAPI 以 Pydantic 為基礎，提供檢查介面資料類型的功能。您不需要額外驗證您的介面參數，也不需要寫額外的程式碼來驗證參數是否為空或資料類型是否正確。使用 FastAPI 可以有效避免代碼中的人為錯誤，提高開發效率。</li>
<li>FastAPI 支援兩種格式的文件 -<a href="https://swagger.io/specification/">OpenAPI</a>(前身為 Swagger) 和<a href="https://www.redoc.com/">Redoc</a>。因此，作為使用者，您不需要花額外的時間來撰寫額外的介面文件。FastAPI 提供的 OpenAPI 文件如下截圖所示。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_d91d34cb0f.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<h3 id="Flask-Vs-FastAPI" class="common-anchor-header">Flask 與 FastAPI</h3><p>下表展示了 Flask 與 FastAPI 在幾個方面的差異。</p>
<table>
<thead>
<tr><th></th><th><strong>FastAPI</strong></th><th><strong>Flask</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>介面閘道</strong></td><td>ASGI</td><td>WSGI</td></tr>
<tr><td><strong>異步框架</strong></td><td>✅</td><td>❌</td></tr>
<tr><td><strong>效能</strong></td><td>較快</td><td>較慢</td></tr>
<tr><td><strong>互動文件</strong></td><td>OpenAPI、Redoc</td><td>無</td></tr>
<tr><td><strong>資料驗證</strong></td><td>✅</td><td>❌</td></tr>
<tr><td><strong>開發成本</strong></td><td>較低</td><td>較高</td></tr>
<tr><td><strong>易用性</strong></td><td>較低</td><td>較高</td></tr>
<tr><td><strong>彈性</strong></td><td>彈性較低</td><td>彈性較高</td></tr>
<tr><td><strong>社區</strong></td><td>較小</td><td>更活躍</td></tr>
</tbody>
</table>
<h2 id="Why-FastAPI" class="common-anchor-header">為什麼選擇 FastAPI？<button data-href="#Why-FastAPI" class="anchor-icon" translate="no">
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
    </button></h2><p>在決定為 Milvus Bootcamp 中的專案選擇哪個 Python Web 應用程式框架之前，我們研究了幾個主流框架，包括 Django、Flask、FastAPI、Tornado 等等。由於 Milvus Bootcamp 中的專案是作為您的參考，我們的優先考量是採用最輕量、最靈活的外部框架。根據這個原則，我們將選擇範圍縮小到 Flask 和 FastAPI。</p>
<p>您可以在上一節看到這兩個網頁框架的比較。以下將詳細解釋我們為 Milvus Bootcamp 的專案選擇 FastAPI 而非 Flask 的動機。有以下幾個原因</p>
<h3 id="1-Performance" class="common-anchor-header">1.效能</h3><p>Milvus Bootcamp 中的大部分專案都是圍繞反向圖片搜尋系統、QA 聊天機、文字搜尋引擎所建立的，這些專案都對即時資料處理有很高的要求。因此，我們需要一個性能優異的框架，這也正是FastAPI的一大亮點。因此，從系統效能的角度來看，我們決定選擇FastAPI。</p>
<h3 id="2-Efficiency" class="common-anchor-header">2.效率</h3><p>在使用 Flask 的時候，需要在每一個介面上寫入資料類型驗證的程式碼，讓系統可以判斷輸入的資料是否為空。然而，FastAPI 通過支援自動資料類型驗證，有助於避免系統開發過程中的人為編碼錯誤，可以大大提升開發效率。Bootcamp 的定位是一種訓練資源。這意味著我們使用的程式碼和元件必須是直覺式且高效率的。在這一點上，我們選擇了 FastAPI 來提高系統效率和增強用戶體驗。</p>
<h3 id="3-Asynchronous-framework" class="common-anchor-header">3.異步架構</h3><p>FastAPI 本身就是一個異步框架。最初，我們發佈了四個<a href="https://zilliz.com/milvus-demos?isZilliz=true">demo</a>，分別是反向圖片搜尋、視頻分析、QA 聊天機、分子相似性搜尋。在這些示範中，您可以上傳資料集，並會立即提示「已收到請求」。當資料上傳到演示系統後，您會收到另一個提示「資料上傳成功」。這是一個異步過程，需要一個支援此功能的框架。FastAPI 本身就是一個異步框架。為了統一所有 Milvus 資源，我們決定在 Milvus Bootcamp 和 Milvus demo 採用單一套開發工具和軟體。因此，我們將框架從 Flask 改為 FastAPI。</p>
<h3 id="4-Automatic-interactive-documents" class="common-anchor-header">4.自動互動文件</h3><p>以傳統的方式來說，當您寫完伺服器端的程式碼時，您需要額外寫一個文件來建立一個介面，然後再使用像<a href="https://www.postman.com/">Postman</a>之類的工具來進行 API 測試和除錯。那麼，如果您只想快速上手 Milvus Bootcamp 中專案的網頁伺服器端開發部分，而不需要寫額外的程式碼來建立介面，該怎麼辦？FastAPI 就是解決方案。透過提供 OpenAPI 文件，FastAPI 可以讓您省去測試或除錯 API，以及與前端團隊合作開發使用者介面的麻煩。有了 FastAPI，您仍可快速試用已建立的應用程式，並可使用自動但直覺的介面，而無需額外的編碼工作。</p>
<h3 id="5-User-friendliness" class="common-anchor-header">5.易於使用</h3><p>FastAPI 更容易使用和開發，因此您可以更專注於專案本身的具體執行。不需要花太多時間在開發網頁框架上，您可以更專注於了解 Milvus Bootcamp 中的專案。</p>
<h2 id="Recap" class="common-anchor-header">重溫<button data-href="#Recap" class="anchor-icon" translate="no">
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
    </button></h2><p>Flask 和 FlastAPI 各有利弊。FlastAPI 作為一個新興的 Web 應用程式框架，其核心是建構在成熟的工具包和函式庫 Starlette 和 Pydantic 上。FastAPI 是一個具有高效能的異步框架。它的靈巧性、可擴展性、對自動資料類型驗證的支援，以及許多其他強大的功能，促使我們採用 FastAPI 作為 Milvus Bootcamp 專案的框架。</p>
<p>請注意，如果您想在生產中建立向量相似性搜尋系統，請根據您的應用程式情境選擇適當的框架。</p>
<h2 id="About-the-author" class="common-anchor-header">關於作者<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>李雲梅，Zilliz 數據工程師，畢業於華中科技大學計算機科學專業。自加入 Zilliz 以來，她一直致力於探索開源專案 Milvus 的解決方案，並幫助使用者將 Milvus 應用於實際情境中。她的主要研究方向是 NLP 和推薦系統，她希望在這兩個領域進一步深化。她喜歡獨處和閱讀。</p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">尋找更多資源？<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
<li><p>開始使用 Milvus 建立 AI 系統，並透過閱讀我們的教學獲得更多實作經驗！</p>
<ul>
<li><a href="https://milvus.io/blog/2021-10-10-milvus-helps-analys-vedios.md">它是什麼？她是誰？Milvus 幫助智慧分析影片</a></li>
<li><a href="https://milvus.io/blog/2021-09-26-onnx.md">使用 ONNX 和 Milvus 結合人工智能模型進行圖像搜索</a></li>
<li><a href="https://milvus.io/blog/dna-sequence-classification-based-on-milvus.md">基於 Milvus 的 DNA 序列分類</a></li>
<li><a href="https://milvus.io/blog/audio-retrieval-based-on-milvus.md">基於 Milvus 的音頻檢索</a></li>
<li><a href="https://milvus.io/blog/building-video-search-system-with-milvus.md">建立視訊搜尋系統的 4 個步驟</a></li>
<li><a href="https://milvus.io/blog/building-intelligent-chatbot-with-nlp-and-milvus.md">使用 NLP 和 Milvus 建立智慧 QA 系統</a></li>
<li><a href="https://milvus.io/blog/molecular-structure-similarity-with-milvus.md">加速新藥發現</a></li>
</ul></li>
<li><p>參與我們的開放源碼社群：</p>
<ul>
<li>在<a href="https://bit.ly/307b7jC">GitHub</a> 上尋找或貢獻 Milvus。</li>
<li>透過<a href="https://bit.ly/3qiyTEk">論壇</a>與社群互動。</li>
<li>在<a href="https://bit.ly/3ob7kd8">Twitter</a> 上與我們聯繫。</li>
</ul></li>
</ul>
