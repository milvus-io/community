---
id: deep-dive-6-oss-qa.md
title: 開放原始碼軟體 (OSS) 品質保證 - Milvus 個案研究
author: Wenxing Zhu
date: 2022-04-25T00:00:00.000Z
desc: 品質保證是一個判斷產品或服務是否符合特定要求的過程。
cover: assets.zilliz.com/Deep_Dive_6_c2cd44801d.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-6-oss-qa.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_6_c2cd44801d.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>封面圖片</span> </span></p>
<blockquote>
<p>本文作者：<a href="https://github.com/zhuwenxing">朱文星</a>，轉載：<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>。</p>
</blockquote>
<p>品質保證 (QA) 是判斷產品或服務是否符合特定要求的系統過程。QA 系統是研發流程中不可或缺的一環，因為顧名思義，它能確保產品的品質。</p>
<p>本篇文章將介紹在開發 Milvus 向量資料庫時所採用的 QA 架構，目的是為貢獻的開發人員和使用者提供參與過程的指引。它也將涵蓋 Milvus 中的主要測試模組，以及可以用來提高 QA 測試效率的方法和工具。</p>
<p><strong>跳至：</strong></p>
<ul>
<li><a href="#A-general-introduction-to-the-Milvus-QA-system">Milvus QA 系統的一般介紹</a></li>
<li><a href="#Test-modules-in-Milvus">Milvus 的測試模組</a></li>
<li><a href="#Tools-and-methods-for-better-QA-efficiency">提高 QA 效率的工具和方法</a></li>
</ul>
<h2 id="A-general-introduction-to-the-Milvus-QA-system" class="common-anchor-header">Milvus QA 系統的一般介紹<button data-href="#A-general-introduction-to-the-Milvus-QA-system" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">系統架構</a>是進行 QA 測試的關鍵。QA工程師越熟悉系統，就越有可能提出合理有效的測試計劃。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_feaccc489d.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Milvus 架構</span> </span></p>
<p>Milvus 2.0 採用<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-cloud-native-first-approach">雲原生、分散式、分層的架構</a>，SDK 是 Milvus<a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">資料</a>流動的<a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">主要入口</a>。Milvus 用戶使用 SDK 的頻率非常高，因此非常需要 SDK 端的功能測試。此外，SDK 的功能測試也有助於偵測 Milvus 系統可能存在的內部問題。除了功能測試之外，向量資料庫也會進行其他類型的測試，包括單元測試、部署測試、可靠性測試、穩定性測試和效能測試。</p>
<p>雲端原生與分散式架構為 QA 測試帶來便利與挑戰。不同於在本機部署與執行的系統，在 Kubernetes 集群上部署與執行的 Milvus 實例，可確保軟體測試與軟體開發在相同的環境下進行。然而，其缺點是分散式架構的複雜性帶來更多不確定因素，使得系統的 QA 測試變得更加困難和吃力。舉例來說，Milvus 2.0 使用不同元件的微服務，這導致<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-bare-bones-skeleton-of-the-Milvus-architecture">服務與節點</a>的數量增加，也增加了系統出錯的可能性。因此，需要更精密、更全面的 QA 計劃，以提高測試效率。</p>
<h3 id="QA-testings-and-issue-management" class="common-anchor-header">QA 測試和問題管理</h3><p>Milvus 的 QA 包括進行測試和管理軟體開發過程中出現的問題。</p>
<h4 id="QA-testings" class="common-anchor-header">QA 測試</h4><p>Milvus 根據 Milvus 功能和用戶需求，按優先順序進行不同類型的 QA 測試，如下圖所示。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_14_2aff081d41.png" alt="QA testing priority" class="doc-image" id="qa-testing-priority" />
   </span> <span class="img-wrapper"> <span>QA 測試優先順序</span> </span></p>
<p>在 Milvus 中，QA 測試按以下優先順序進行：</p>
<ol>
<li><strong>功能</strong>：驗證功能和特性是否與最初設計的一樣。</li>
<li><strong>部署</strong>：檢查使用者是否可以使用不同的方法（Docker Compose、Helm、APT 或 YUM 等）部署、重新安裝和升級 Mivus 單機版和 Milvus 集群。</li>
<li><strong>效能</strong>：  測試 Milvus 的資料插入、索引、向量搜尋與查詢效能。</li>
<li><strong>穩定性</strong>：檢查 Milvus 是否能在正常工作負荷下穩定地運作 5-10 天。</li>
<li><strong>可靠性</strong>：測試在某些系統錯誤發生時，Milvus 是否仍能部分運作。</li>
<li><strong>配置</strong>：驗證 Milvus 在特定配置下是否如預期般運作。</li>
<li><strong>相容性</strong>：測試 Milvus 是否與不同類型的硬體或軟體相容。</li>
</ol>
<h4 id="Issue-management" class="common-anchor-header">問題管理</h4><p>在軟體開發過程中，可能會出現許多問題。模板化問題的作者可以是 QA 工程師本身，也可以是來自開源社群的 Milvus 使用者。QA 團隊負責找出問題。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Issue_management_workflow_12c726efa1.png" alt="Issue management workflow" class="doc-image" id="issue-management-workflow" />
   </span> <span class="img-wrapper"> <span>問題管理工作流程</span> </span></p>
<p>當一個<a href="https://github.com/milvus-io/milvus/issues">問題</a>被建立，它會先經過分流。在分流過程中，新的問題會經過審查，以確保提供足夠的問題細節。如果問題得到確認，就會被開發人員接受，並嘗試修正問題。開發完成後，問題作者需要確認問題是否已修復。如果是，問題最終會被關閉。</p>
<h3 id="When-is-QA-needed" class="common-anchor-header">何時需要 QA？</h3><p>一個常見的誤解是 QA 與開發是彼此獨立的。但事實上，為了確保系統的品質，開發人員和 QA 工程師都需要付出努力。因此，QA 需要參與整個生命週期。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/QA_lifecycle_375f4fd8a8.png" alt="QA lifecycle" class="doc-image" id="qa-lifecycle" />
   </span> <span class="img-wrapper"> <span>QA 生命週期</span> </span></p>
<p>如上圖所示，一個完整的軟體研發生命週期包含三個階段。</p>
<p>在初始階段，開發人員會發佈設計文件，而 QA 工程師則會提出測試計畫、定義發行標準並指派 QA 任務。開發人員和 QA 工程師需要同時熟悉設計文件和測試計畫，以便兩個團隊對發行目標（功能、效能、穩定性、錯誤收斂等方面）有共同的理解。</p>
<p>在研發期間，開發與 QA 測試會經常互動，以開發及驗證功能與特性，並修復開放原始碼<a href="https://slack.milvus.io/">社群</a>所報告的錯誤與問題。</p>
<p>在最後的階段，如果符合發行標準，新版 Milvus 的 Docker 映像檔將會被釋出。正式發佈時，需要一份專注於新功能和已修正錯誤的發佈說明，以及一個發佈標籤。之後 QA 團隊也會發佈此版本的測試報告。</p>
<h2 id="Test-modules-in-Milvus" class="common-anchor-header">Milvus 的測試模組<button data-href="#Test-modules-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 中有幾個測試模組，本節將詳細解釋每個模組。</p>
<h3 id="Unit-test" class="common-anchor-header">單元測試</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Unit_test_7d3d422345.png" alt="Unit test" class="doc-image" id="unit-test" />
   </span> <span class="img-wrapper"> <span>單元測試</span> </span></p>
<p>單元測試可以幫助在早期階段找出軟體的錯誤，並提供程式碼重組時的驗證標準。根據 Milvus 的 pull request (PR) 接受標準，程式碼單元測試的<a href="https://app.codecov.io/gh/milvus-io/milvus/">覆蓋率</a>應達到 80%。</p>
<h3 id="Function-test" class="common-anchor-header">功能測試</h3><p>Milvus 的功能測試主要是圍繞<a href="https://github.com/milvus-io/pymilvus">PyMilvus</a>和 SDK 來組織的。功能測試的主要目的是驗證介面是否能如設計般運作。函式測試有兩個面向</p>
<ul>
<li>當傳入正確的參數時，測試 SDK 是否能傳回預期的結果。</li>
<li>測試 SDK 是否能處理錯誤，並在傳送錯誤參數時回傳合理的錯誤訊息。</li>
</ul>
<p>下圖描述了目前的函式測試框架，它是基於主流的<a href="https://pytest.org/">pytest</a>框架。這個框架為 PyMilvus 增加了一個 wrapper，並透過自動化的測試介面來增強測試的能力。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Function_test_41f837d3e7.png" alt="Function test" class="doc-image" id="function-test" />
   </span> <span class="img-wrapper"> <span>函式測試</span> </span></p>
<p>考慮到需要一個共用的測試方法，而且有些函數需要重複使用，因此採用了上述的測試框架，而不是直接使用 PyMilvus 介面。框架中也包含了一個 "check "模組，為預期值與實際值的驗證帶來便利。</p>
<p><code translate="no">tests/python_client/testcases</code> 目錄中包含了多達 2,700 個函式測試案例，幾乎涵蓋了所有 PyMilvus 介面。這些函式測試嚴格監督每個 PR 的品質。</p>
<h3 id="Deployment-test" class="common-anchor-header">部署測試</h3><p>Milvus 有兩種模式：<a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">單機</a>和<a href="https://milvus.io/docs/v2.0.x/install_cluster-docker.md">集群</a>。而部署 Milvus 主要有兩種方式：使用 Docker Compose 或 Helm。而在部署 Milvus 之後，使用者也可以重新啟動或升級 Milvus 服務。部署測試主要分為兩大類：重啟測試和升級測試。</p>
<p>重新啟動測試是指測試資料持久性的過程，即重新啟動後，資料是否仍然可用。升級測試是指測試資料相容性的過程，以防止不相容格式的資料插入 Milvus 的情況。如下圖所示，這兩種類型的部署測試共享相同的工作流程。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deployment_test_342ab3b3f5.png" alt="Deployment test" class="doc-image" id="deployment-test" />
   </span> <span class="img-wrapper"> <span>部署測試</span> </span></p>
<p>在重新啟動測試中，兩個部署使用相同的 docker 映像檔。但是在升級測試中，第一個部署使用的是先前版本的 docker image，而第二個部署使用的是較後版本的 docker image。測試結果和資料會儲存在<code translate="no">Volumes</code> 檔案或<a href="https://kubernetes.io/docs/concepts/storage/persistent-volumes/">持久卷索賠</a>(PVC)。</p>
<p>執行第一個測試時，會建立多個集合，並對每個集合進行不同的操作。執行第二個測試時，主要是驗證已建立的集合是否仍可用於 CRUD 作業，以及是否可進一步建立新的集合。</p>
<h3 id="Reliability-test" class="common-anchor-header">可靠性測試</h3><p>對雲端原生分散式系統的可靠性進行測試時，通常會採用混沌工程方法，其目的是將錯誤和系統故障扼殺在萌芽狀態。換句話說，在混沌工程測試中，我們會故意製造系統故障，以便在壓力測試中找出問題，並在系統故障真正開始造成危害之前加以修復。在Milvus的混沌測試中，我們選擇<a href="https://chaos-mesh.org/">Chaos Mesh</a>作為製造混沌的工具。有幾種類型的故障需要建立：</p>
<ul>
<li><strong>Pod kill</strong>：模擬節點宕機的情境。</li>
<li><strong>Pod 故障</strong>：測試如果其中一個工作節點 Pod 失效，整個系統是否仍能繼續運作。</li>
<li><strong>記憶體壓力</strong>：模擬工作節點大量消耗記憶體和 CPU 資源的情況。</li>
<li><strong>網路分割</strong>：由於 Milvus<a href="https://milvus.io/docs/v2.0.x/four_layers.md">將儲存與運算分開</a>，因此系統非常依賴各元件之間的通訊。需要模擬不同 pod 之間的通訊被分割的情況，以測試 Milvus 不同元件之間的相互依賴性。</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Reliability_test_a7331b91f4.png" alt="Reliability test" class="doc-image" id="reliability-test" />
   </span> <span class="img-wrapper"> <span>可靠性測試</span> </span></p>
<p>上圖展示了 Milvus 的可靠度測試架構，可以自動化混沌測試。可靠性測試的工作流程如下：</p>
<ol>
<li>透過讀取部署配置來初始化 Milvus 叢集。</li>
<li>當叢集準備就緒時，執行<code translate="no">test_e2e.py</code> 測試 Milvus 功能是否可用。</li>
<li>執行<code translate="no">hello_milvus.py</code> 測試資料的持久性。建立一個名為「hello_milvus」的集合，用於資料插入、刷新、索引建立、向量搜尋和查詢。此集合在測試期間不會被釋放或丟棄。</li>
<li>建立監控物件，啟動六個執行建立、插入、刷新、索引、搜尋和查詢作業的線程。</li>
</ol>
<pre><code translate="no">checkers = {
    Op.create: CreateChecker(),
    Op.insert: InsertFlushChecker(),
    Op.flush: InsertFlushChecker(flush=<span class="hljs-literal">True</span>),
    Op.index: IndexChecker(),
    Op.search: SearchChecker(),
    Op.query: QueryChecker()
}
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>作出第一個斷言 - 所有作業都如預期般成功。</li>
<li>使用 Chaos Mesh 解析定義故障的 yaml 檔案，為 Milvus 引進系統故障。例如，故障可以是每 5 秒殺掉查詢節點一次。</li>
<li>在引入系統失效時，進行第二個斷言 - 判斷在系統失效時，Milvus 的操作回傳結果是否符合預期。</li>
<li>透過 Chaos Mesh 消除故障。</li>
<li>當 Milvus 服務恢復後 (表示所有 Pod 都準備好了)，提出第三個斷言 - 所有作業都如預期般成功。</li>
<li>執行<code translate="no">test_e2e.py</code> 測試 Milvus 功能是否可用。混亂期間的某些作業可能會因為第三個斷言而受阻。即使在混亂消除後，某些作業仍可能繼續受阻，妨礙第三個斷言如預期般成功。這個步驟的目的是促進第三個斷言，並作為檢查 Milvus 服務是否已恢復的標準。</li>
<li>執行<code translate="no">hello_milvus.py</code> ，載入建立的集合，並對集合執行 CRUP 作業。然後，檢查系統故障前存在的資料在故障復原後是否仍然可用。</li>
<li>收集日誌。</li>
</ol>
<h3 id="Stability-and-performance-test" class="common-anchor-header">穩定性和效能測試</h3><p>下圖描述穩定性和效能測試的目的、測試情境和指標。</p>
<table>
<thead>
<tr><th></th><th>穩定性測試</th><th>效能測試</th></tr>
</thead>
<tbody>
<tr><td>目的</td><td>- 確保 Milvus 在正常工作負載下，能在固定時間內順利運作。 <br>- 確保 Milvus 服務啟動時，資源消耗穩定。</td><td>- 測試 Milvus 所有介面的效能。 <br>- 在性能測試的幫助下找到最佳配置。  <br>- 作為未來版本的基準。 <br>- 找到妨礙更好性能的瓶頸。</td></tr>
<tr><td>使用情境</td><td>- 離線讀取密集型場景：資料插入後幾乎不會更新，處理各類請求的百分比為：搜尋請求佔 90%、插入請求佔 5%、其他佔 5%。 <br>- 線上寫入密集型情境：資料同時插入與搜尋，每種請求的處理百分比為：插入請求 50% 、搜尋請求 40% 、其他 10% 。</td><td>- 資料插入 <br>- 索引建立 <br>- 向量搜尋</td></tr>
<tr><td>指標</td><td>- 記憶體使用量 <br>- CPU 消耗 <br>- IO 延遲 <br>- Milvus pod 的狀態 <br>- Milvus 服務的回應時間 <br>等等</td><td>- 資料插入時的資料吞吐量 <br>- 建立索引所需的時間 <br>- 向量搜尋期間的回應時間 <br>- 每秒查詢次數 (QPS) <br>- 每秒的請求  <br>- 召回率 <br>等等。</td></tr>
</tbody>
</table>
<p>穩定性測試和效能測試都共用一套工作流程：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Stability_and_performance_test_6ed8532697.png" alt="Stability and performance test" class="doc-image" id="stability-and-performance-test" />
   </span> <span class="img-wrapper"> <span>穩定性與效能測試</span> </span></p>
<ol>
<li>解析和更新配置，並定義指標。<code translate="no">server-configmap</code> 對應 Milvus 單機或群集的配置，而<code translate="no">client-configmap</code> 對應測試案例的配置。</li>
<li>配置伺服器和用戶端。</li>
<li>資料準備</li>
<li>請求伺服器與用戶端之間的互動。</li>
<li>報告與顯示指標。</li>
</ol>
<h2 id="Tools-and-methods-for-better-QA-efficiency" class="common-anchor-header">提高 QA 效率的工具與方法<button data-href="#Tools-and-methods-for-better-QA-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>從模組測試的部分，我們可以看到大部分測試的程序其實都差不多，主要涉及修改 Milvus 伺服器和用戶端的配置，以及傳送 API 參數。當有多種配置時，不同配置的組合越多樣化，這些實驗和測試所能涵蓋的測試情境就越多。因此，在提升測試效率的過程中，程式碼和程序的重複使用就更加重要。</p>
<h3 id="SDK-test-framework" class="common-anchor-header">SDK 測試架構</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/SDK_test_framework_8219e28f4c.png" alt="SDK test framework" class="doc-image" id="sdk-test-framework" />
   </span> <span class="img-wrapper"> <span>SDK 測試架構</span> </span></p>
<p>為了加速測試流程，我們可以在原本的測試框架中加入<code translate="no">API_request</code> wrapper，並將其設定為類似 API gateway 的東西。這個 API 閘道將負責收集所有的 API 請求，然後將它們傳給 Milvus 來共同接收回應。這些回應之後會傳回給客戶端。這樣的設計讓擷取某些日誌資訊（如參數和回傳結果）變得更容易。此外，SDK 測試框架中的檢查器元件可以驗證和檢查 Milvus 的結果。而且所有的檢查方法都可以在這個檢查器元件中定義。</p>
<p>有了 SDK 測試框架，一些關鍵的初始化過程可以包裝成單一的函式。如此一來，就可以省去一大段繁瑣的程式碼。</p>
<p>值得注意的是，每個測試案例都與其獨特的集合相關，以確保資料隔離。</p>
<p>在執行測試案例時，可利用<code translate="no">pytest-xdist</code> 這個 pytest 擴充，並行執行所有單獨的測試案例，大幅提升效率。</p>
<h3 id="GitHub-action" class="common-anchor-header">GitHub 動作</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Git_Hub_action_c3c1bed591.png" alt="GitHub action" class="doc-image" id="github-action" />
   </span> <span class="img-wrapper"> <span>GitHub 動作</span> </span></p>
<p><a href="https://docs.github.com/en/actions">GitHub Action</a>也被採用來提升 QA 效率，其特點如下：</p>
<ul>
<li>它是與 GitHub 深度整合的原生 CI/CD 工具。</li>
<li>自帶統一配置的機器環境，並預裝常見的軟體開發工具，包括 Docker、Docker Compose 等。</li>
<li>它支援多種作業系統和版本，包括 Ubuntu、MacOs、Windows-server 等。</li>
<li>它有一個市場，提供豐富的擴充功能和開箱即用的功能。</li>
<li>它的矩陣支援並發工作，並重複使用相同的測試流程以提高效率。</li>
</ul>
<p>除了上述特點，採用 GitHub action 的另一個原因是部署測試和可靠性測試需要獨立隔離的環境。而 GitHub Action 非常適合小規模資料集的日常檢測檢查。</p>
<h3 id="Tools-for-benchmark-tests" class="common-anchor-header">基準測試的工具</h3><p>為了讓 QA 測試更有效率，我們會使用許多工具。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_13_fbc71dfe4f.png" alt="QA tools" class="doc-image" id="qa-tools" />
   </span> <span class="img-wrapper"> <span>QA 工具</span> </span></p>
<ul>
<li><a href="https://argoproj.github.io/">Argo</a>：一套適用於 Kubernetes 的開源工具，可執行工作流程，並透過排程任務管理集群。它也能讓多個任務並行執行。</li>
<li><a href="https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/">Kubernetes dashboard</a>：基於 Web 的 Kubernetes 使用者介面，可視化<code translate="no">server-configmap</code> 和<code translate="no">client-configmap</code> 。</li>
<li><a href="https://en.wikipedia.org/wiki/Network-attached_storage">NAS</a>：網路連接儲存（NAS）是檔案層級的電腦資料儲存伺服器，用於保存常見的 ANN 基準資料集。</li>
<li><a href="https://www.influxdata.com/">InfluxDB</a>和<a href="https://www.mongodb.com/">MongoDB</a>：用於儲存基準測試結果的資料庫。</li>
<li><a href="https://grafana.com/">Grafana</a>：一種開放原始碼的分析與監控解決方案，用於監控伺服器資源指標與用戶端效能指標。</li>
<li><a href="https://redash.io/">Redash</a>：一項可協助您將資料視覺化並為基準測試建立圖表的服務。</li>
</ul>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">關於深入探討系列<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>隨著 Milvus 2.0<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">正式宣佈全面上市</a>，我們精心策劃了這個 Milvus Deep Dive 系列部落格，提供對 Milvus 架構和原始碼的深入詮釋。本系列部落格涵蓋的主題包括</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus 架構概述</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API 與 Python SDK</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">資料處理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">資料管理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">即時查詢</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">標量執行引擎</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">QA 系統</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">向量執行引擎</a></li>
</ul>
