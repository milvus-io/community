---
id: Operationalize-AI-at-Scale-with-Software-MLOps-and-Milvus.md
title: 利用軟體 2.0、MLOps 和 Milvus 實現 AI 的規模化運作
author: milvus
date: 2021-03-31T09:51:38.653Z
desc: 當我們過渡到軟體 2.0 時，MLOps 正在取代 DevOps。瞭解什麼是模型作業，以及開放原始碼向量資料庫 Milvus 如何支援它。
cover: assets.zilliz.com/milvus_5b2cdec665.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Operationalize-AI-at-Scale-with-Software-MLOps-and-Milvus
---
<custom-h1>利用軟體 2.0、MLOps 和 Milvus 實現 AI 的規模化運作</custom-h1><p>建立機器學習 (ML) 應用程式是一個複雜且反覆的過程。隨著越來越多的公司意識到非結構化資料尚未開發的潛力，對<a href="https://milvus.io/blog/Thanks-to-Milvus-Anyone-Can-Build-a-Vector-Database-for-1-Billion-Images.md">人工智能驅動的資料處理和分析的</a>需求將持續增加。如果沒有有效的機器學習作業或 MLOps，大多數的 ML 應用程式投資都會枯萎。研究發現，企業計劃部署的 AI 應用實際上<a href="https://www.forbes.com/sites/cognitiveworld/2020/03/31/modelops-is-the-key-to-enterprise-ai/?sh=44c0f5066f5a">只有 5%</a>達成部署。許多組織都會產生「模型債務」（model debt），即市場條件的變化，以及無法適應這些變化，導致模型上未實現的投資一直揮之不去，無法更新（或更糟的是，根本就沒有部署）。</p>
<p>本文將解釋 MLOps，一種管理 AI 模型生命週期的系統方法，以及如何使用開放原始碼向量資料管理平台<a href="https://milvus.io/">Milvus</a>來規模化運用 AI。</p>
<p><br/></p>
<h3 id="What-is-MLOps" class="common-anchor-header">什麼是 MLOps？</h3><p>機器學習營運 (MLOps)，也稱為模型營運 (ModelOps) 或 AI 模型營運化，是大規模建置、維護和部署 AI 應用程式的必要條件。由於企業需要將其開發的 AI 模型應用到數百種不同的情境中，因此在整個組織中運作使用中的模型以及開發中的模型，是非常重要的任務。MLOps 包括在機器學習模型的整個生命週期中對其進行監控，並管理從基礎資料到依賴於特定模型的生產系統的有效性等一切事宜。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/01_362a07d156.jpg" alt="01.jpg" class="doc-image" id="01.jpg" />
   </span> <span class="img-wrapper"> <span>01.jpg</span> </span></p>
<p>Gartner<a href="https://www.gartner.com/en/information-technology/glossary/modelops">將</a>ModelOps<a href="https://www.gartner.com/en/information-technology/glossary/modelops">定義為</a>廣泛操作化人工智慧與決策模型的治理與生命週期管理。MLOps 的核心功能可細分如下：</p>
<ul>
<li><p><strong>持續整合/持續交付 (CI/CD)：</strong>CI/CD 是一套借用自開發人員作業 (DevOps) 的最佳實務，是一種更頻繁、更可靠地遞送程式碼變更的方法。<a href="https://www.gartner.com/en/information-technology/glossary/continuous-integration-ci">持續整合</a>提倡小批量實施程式碼變更，同時以嚴格的版本控制進行監控。<a href="https://www.gartner.com/smarterwithgartner/5-steps-to-master-continuous-delivery/">持續交付</a>可將應用程式自動交付至各種環境（例如測試和開發環境）。</p></li>
<li><p><strong>模型開發環境 (MDE)：</strong>MDE 是建立、審查、記錄和檢視模型的複雜流程，有助於確保模型的迭代建立、開發過程中的記錄、可信賴性和可重複性。有效的 MDE 可確保以受控的方式探索、研究和實驗模型。</p></li>
<li><p><strong>冠軍-挑戰者測試：</strong>與行銷人員所使用的 A/B 測試方法類似，<a href="https://medium.com/decision-automation/what-is-champion-challenger-and-how-does-it-enable-choosing-the-right-decision-f57b8b653149">冠軍選手測試</a>涉及嘗試不同的解決方案，以協助決策過程，進而承諾採用單一方法。此技術包括即時監控和測量效能，以找出哪個偏差最有效。</p></li>
<li><p><strong>模型版本化：</strong>與任何複雜的系統一樣，機器學習模型是由許多不同的人分步開發的，因此會產生與資料和 ML 模型版本相關的資料管理問題。模型版本管理有助於管理和治理 ML 開發的迭代過程，在此過程中，資料、模型和程式碼可能會以不同的速度演進。</p></li>
<li><p><strong>模型儲存與回溯：</strong>部署模型時，必須儲存其對應的映像檔。回滾和恢復能力可讓 MLOps 團隊在需要時恢復到先前的模型版本。</p></li>
</ul>
<p>在生產應用程式中僅使用一個模型會帶來許多困難的挑戰。MLOps 是一種結構化、可重複的方法，依靠工具、技術和最佳實務來克服機器學習模型生命週期中出現的技術或業務問題。成功的 MLOps 可維持負責建立、部署、監控、重新訓練和管理 AI 模型及其在生產系統中的使用的團隊的效率。</p>
<p><br/></p>
<h3 id="Why-is-MLOps-necessary" class="common-anchor-header">為什麼需要 MLOps？</h3><p>正如上述 ML 模型生命週期所描述的，建立機器學習模型是一個迭代的過程，涉及到納入新資料、重新訓練模型，以及處理一般模型隨時間衰減的問題。這些都是傳統開發人員作業或 DevOps 無法處理或提供解決方案的問題。MLOps 已經成為管理 AI 模型投資並確保模型生命週期富有成效的必要方式。由於機器學習模型將被各種不同的生產系統所利用，因此 MLOps 成為確保在不同環境和不同情境中滿足需求不可或缺的一環。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/02_403e7f2fe2.jpg" alt="02.jpg" class="doc-image" id="02.jpg" />
   </span> <span class="img-wrapper"> <span>02.jpg</span> </span></p>
<p><br/></p>
<p>上面的簡單插圖描述了在雲端環境中部署的機器學習模型，該模型會輸入到應用程式中。在這個基本情境中，可能會出現許多問題，而 MLOps 可協助克服這些問題。由於生產應用程式依賴特定的雲端環境，因此會有延遲的需求，而開發 ML 模型的資料科學家卻無法存取。將模型生命週期實作化，將可讓對模型有深入認識的資料科學家或工程師找出並排除特定生產環境中出現的問題。</p>
<p>機器學習模型不僅是在與其所使用的生產應用程式不同的環境中進行訓練，而且還經常依賴與生產應用程式中所使用的資料不同的歷史資料集。有了 MLOps，整個資料科學團隊，從開發模型的人員到在應用程式層級工作的人員，都有分享和請求資訊與協助的方法。由於資料和市場的變化速度極快，因此必須儘可能減少所有關鍵利害關係人和貢獻者之間的磨擦，因為這些利害關係人和貢獻者都將依賴於特定的機器學習模型。</p>
<h3 id="Supporting-the-transition-to-Software-20" class="common-anchor-header">支援軟體 2.0 的過渡</h3><p><a href="https://karpathy.medium.com/software-2-0-a64152b37c35">軟體 2.0 的</a>概念是，隨著人工智慧在撰寫為軟體應用程式提供動力的人工智慧模型時扮演越來越重要的角色，軟體開發也將經歷模式轉換。在軟體 1.0 下，開發工作包括程式設計師使用特定的程式語言 (例如 Python、C++) 撰寫明確的指令。軟體 2.0 則抽象得多。雖然人類提供輸入資料並設定參數，但由於其複雜性，人類很難理解神經網路，典型的神經網路包含數百萬個影響結果的權值（有時甚至數十億或數萬億）。</p>
<p>DevOps 是圍繞軟體 1.0 所建立，依賴程式設計師使用各種語言所發出的特定指令，但從未考慮過為各種不同應用程式提供動力的機器學習模型的生命週期。MLOps 針對管理軟體開發的流程必須與開發中的軟體一同改變的需求而設計。當軟體 2.0 成為以電腦為基礎解決問題的新標準時，擁有正確的工具和流程來管理模型生命週期，將會決定新技術投資的成敗。Milvus 是一個開放原始碼的向量相似性搜尋引擎，其建立是為了支援軟體 2.0 的過渡，並使用 MLOps 管理模型生命週期。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/03_c63c501995.jpg" alt="03.jpg" class="doc-image" id="03.jpg" />
   </span> <span class="img-wrapper"> <span>03.jpg</span> </span></p>
<p><br/></p>
<h3 id="Operationalizing-AI-at-scale-with-Milvus" class="common-anchor-header">利用 Milvus 實現 AI 的規模化運作</h3><p>Milvus 是一個向量資料管理平台，專門用於儲存、查詢、更新和維護數兆規模的大量向量資料集。該平台支援向量相似性搜尋，並可與廣泛採用的索引函式庫整合，包括 Faiss、NMSLIB 和 Annoy。透過 Milvus 搭配將非結構化資料轉換為向量的人工智能模型，可以創造出橫跨新藥開發、生物特徵分析、推薦系統等許多領域的應用。</p>
<p><a href="https://blog.milvus.io/vector-similarity-search-hides-in-plain-view-654f8152f8ab">向量類似性搜尋是</a>非結構性資料數據處理和分析的最佳解決方案，向量資料正迅速成為核心資料類型。像 Milvus 這種全面的資料管理系統能以多種方式促進人工智慧的操作化，包括</p>
<ul>
<li><p>提供模型訓練環境，確保在同一地點完成更多方面的開發，促進跨團隊合作、模型治理等。</p></li>
<li><p>提供一套完整的 API，支援 Python、Java 和 Go 等熱門框架，讓您輕鬆整合一套共通的 ML 模型。</p></li>
<li><p>與在瀏覽器中執行的 Jupyter 記事本環境 Google Colaboratory 相容，簡化從原始碼編譯 Milvus 和執行基本 Python 作業的流程。</p></li>
<li><p>自動化機器學習 (AutoML) 功能使將機器學習應用於現實世界問題的相關任務自動化成為可能。AutoML 不僅能提高效率，還能讓非專業人士也能利用機器學習模型和技術。</p></li>
</ul>
<p>無論您目前正在建置的機器學習應用程式，或是未來的應用程式計畫，Milvus 都是以軟體 2.0 和 MLOps 為考量而打造的彈性資料管理平台。若要進一步瞭解 Milvus 或作出貢獻，請在<a href="https://github.com/milvus-io">Github</a> 上找到該專案。若要參與社群活動或提出問題，請加入我們的<a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>頻道。渴望獲得更多內容？查看以下資源：</p>
<ul>
<li><a href="https://milvus.io/blog/Milvus-Is-an-Open-Source-Scalable-Vector-Database.md">Milvus 是一個開放源碼的可擴充向量資料庫</a></li>
<li><a href="https://milvus.io/blog/Milvus-Was-Built-for-Massive-Scale-Think-Trillion-Vector-Similarity-Search.md">Milvus 是專為大規模 (萬億個) 矢量相似性搜尋而建立的</a></li>
<li><a href="https://milvus.io/blog/Set-Up-Milvus-in-Google-Colaboratory-for-Easy-ML-Application-Building.md">在 Google Colaboratory 設定 Milvus，輕鬆建立 ML 應用程式</a></li>
</ul>
