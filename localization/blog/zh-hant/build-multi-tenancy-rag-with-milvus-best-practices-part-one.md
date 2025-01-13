---
id: build-multi-tenancy-rag-with-milvus-best-practices-part-one.md
title: 使用 Milvus 設計多租戶 RAG：可擴展企業知識庫的最佳實務
author: Robert Guo
date: 2024-12-04T00:00:00.000Z
cover: assets.zilliz.com/Designing_Multi_Tenancy_RAG_with_Milvus_40b3737145.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/build-multi-tenancy-rag-with-milvus-best-practices-part-one
---
<h2 id="Introduction" class="common-anchor-header">簡介<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>過去幾年來，<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG（Retrieval-Augmented Generation）</a>已經成為大型企業增強其<a href="https://zilliz.com/glossary/large-language-models-(llms)">LLM 驅動</a>應用程式（特別是擁有不同使用者的應用程式）的可信賴解決方案。隨著這些應用程式的成長，實施多租用架構變得非常重要。<strong>多租用</strong>可為不同的使用者群組提供安全、隔離的資料存取，確保使用者的信任、符合法規標準，並提高作業效率。</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvus</a>是專為處理高維<a href="https://zilliz.com/glossary/vector-embeddings">向量資料</a>而建立的開放原始碼<a href="https://zilliz.com/glossary/vector-embeddings">向量資料</a> <a href="https://zilliz.com/learn/what-is-vector-database">庫</a>。它是 RAG 不可或缺的基礎架構元件，可從外部來源儲存與擷取 LLM 的情境資訊。Milvus 為各種需求提供<a href="https://milvus.io/docs/multi_tenancy.md">彈性的多租用策略</a>，包括<strong>資料庫層級、集合層級和分割層級的多租用</strong>。</p>
<p>在這篇文章中，我們將介紹</p>
<ul>
<li><p>什麼是多租戶及其重要性</p></li>
<li><p>Milvus 的多租戶策略</p></li>
<li><p>範例：RAG Powered 企業知識庫的多重租用策略</p></li>
</ul>
<h2 id="What-is-Multi-Tenancy-and-Why-It-Matters" class="common-anchor-header">什麼是多租戶及其重要性<button data-href="#What-is-Multi-Tenancy-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/multi_tenancy.md"><strong>多租戶</strong></a>是一種架構，其中多個客戶或團隊（稱為「<strong>租戶</strong>」）共用一個應用程式或系統的單一實例。每個租戶的資料和配置在邏輯上是隔離的，以確保隱私性和安全性，同時所有租戶共享相同的底層基礎架構。</p>
<p>想像一個 SaaS 平台，為多家公司提供以知識為基礎的解決方案。每家公司都是一個租戶。</p>
<ul>
<li><p>租戶 A 是一家醫療保健機構，儲存面向病患的常見問題與合規文件。</p></li>
<li><p>租戶 B 是一家科技公司，管理內部 IT 疑難排解工作流程。</p></li>
<li><p>租戶 C 是一家零售企業，提供產品退貨的客戶服務常見問題。</p></li>
</ul>
<p>每個租戶都在完全隔離的環境中運作，確保租戶 A 的資料不會洩漏到租戶 B 的系統中，反之亦然。此外，資源分配、查詢效能和擴充決策都是針對特定租戶的，因此無論某一租戶的工作負載是否激增，都能確保高效能。</p>
<p>多租戶也適用於服務同一組織內不同團隊的系統。想像一下，一家大公司使用 RAG 驅動的知識庫來服務其內部部門，例如人力資源部、法務部和行銷部。在此設定中，每個<strong>部門</strong>都<strong>是一個租戶</strong>，擁有獨立的資料和資源。</p>
<p>多租戶提供了顯著的好處，包括<strong>成本效益、可擴充性和穩健的資料安全性</strong>。透過共用單一基礎架構，服務供應商可降低間接成本，並確保更有效的資源消耗。與單一租戶模式相比，此方法還能毫不費力地擴充 - 加入新租戶所需的資源遠少於為每個租戶建立獨立實體所需的資源。重要的是，多租用可確保每個租戶的資料嚴格隔離，並透過存取控制和加密保護敏感資訊免於未經授權的存取，從而維持穩健的資料安全性。此外，更新、修補程式和新功能可以同時部署到所有租戶，簡化系統維護並減輕管理員的負擔，同時確保安全性和合規性標準得到一致維護。</p>
<h2 id="Multi-Tenancy-Strategies-in-Milvus" class="common-anchor-header">Milvus 的多租戶策略<button data-href="#Multi-Tenancy-Strategies-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>要瞭解 Milvus 如何支援多租戶，首先必須瞭解它如何組織使用者資料。</p>
<h3 id="How-Milvus-Organizes-User-Data" class="common-anchor-header">Milvus 如何組織用戶資料</h3><p>Milvus 的資料結構分為三層，由寬到細：<a href="https://milvus.io/docs/manage_databases.md"><strong>資料庫</strong></a>、<a href="https://milvus.io/docs/manage_databases.md"><strong>資料</strong></a> <a href="https://milvus.io/docs/manage-collections.md"><strong>集</strong></a>和<a href="https://milvus.io/docs/manage-partitions.md"><strong>磁碟分割/磁碟分割鑰匙</strong></a>。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_How_Milvus_organizes_user_data_4521c4b8f9.png" alt="Figure- How Milvus organizes user data .png" class="doc-image" id="figure--how-milvus-organizes-user-data-.png" />
   </span> <span class="img-wrapper"> <span>圖- Milvus 如何組織使用者資料 .png</span> </span></p>
<p><em>圖Milvus 如何組織使用者資料</em></p>
<ul>
<li><p><strong>資料庫</strong>：這是一個邏輯容器，類似於傳統關係系統中的資料庫。</p></li>
<li><p><strong>集合</strong>：類似於資料庫中的表格，集合將資料組織成可管理的群組。</p></li>
<li><p><strong>分割/分割鍵</strong>：在一個資料集中，資料可以透過<strong>分區（Partition</strong>）進一步分割。使用<strong>分區鍵將</strong>具有相同鍵的資料分組在一起。例如，如果使用<strong>使用者 ID</strong>作為<strong>分區鑰</strong>，特定使用者的所有資料都會儲存在相同的邏輯區段中。這可讓您直接擷取與個別使用者相關的資料。</p></li>
</ul>
<p>從<strong>資料庫到</strong> <strong>集合</strong>再到<strong>分割區金鑰</strong>，資料組織的粒度會逐漸變得更細。</p>
<p>為了確保更強的資料安全性和適當的存取控制，Milvus 也提供強大的<a href="https://zilliz.com/blog/enabling-fine-grained-access-control-with-milvus-row-level-rbac"><strong>角色存取控制 (RBAC)</strong></a>，允許管理員為每個使用者定義特定的權限。只有授權使用者才能存取特定資料。</p>
<p>Milvus 支援<a href="https://milvus.io/docs/multi_tenancy.md">多種策略</a>來實現多租用，根據應用程式的需求提供彈性：<strong>資料庫層級、集合層級和分割層級的多租用</strong>。</p>
<h3 id="Database-Level-Multi-Tenancy" class="common-anchor-header">資料庫層級多租戶</h3><p>使用資料庫層級多租戶方法，每個租戶在同一個 Milvus 集群中分配自己的資料庫。此策略可提供強大的資料隔離，並確保最佳的搜尋效能。但是，如果某些租戶仍然處於非活動狀態，則可能導致資源利用效率低下。</p>
<h3 id="Collection-Level-Multi-Tenancy" class="common-anchor-header">集合層級多租戶</h3><p>在此，在集合層級多重租用中，我們可以用兩種方式為租戶組織資料。</p>
<ul>
<li><p><strong>所有租戶共用一個集合</strong>：所有租戶共用一個集合，並使用租戶特定欄位進行篩選。雖然實作簡單，但隨著租戶數量增加，此方法可能會遇到效能瓶頸。</p></li>
<li><p><strong>每個租戶一個集合</strong>：每個租戶可以擁有專用的集合，提高隔離性和效能，但需要更多的資源。如果租戶數量超過 Milvus 的收集容量，此設定可能會面臨擴充限制。</p></li>
</ul>
<h3 id="Partition-Level-Multi-Tenancy" class="common-anchor-header">分區層級多租戶</h3><p>分區層級多重租用著重於在單一集合中組織租戶。在此，我們也有兩種方式來組織租戶資料。</p>
<ul>
<li><p><strong>每個租戶一個分區</strong>：租戶共用一個集合，但他們的資料儲存在不同的分區中。我們可以透過為每個租戶指派專屬的分割區來隔離資料，平衡隔離與搜尋效能。然而，此方法受限於 Milvus 的最大分割區限制。</p></li>
<li><p><strong>基於分區鑰匙的多租戶</strong>：這是一種更具擴充性的選項，單一集合使用分割區金鑰來區分租戶。此方法可簡化資源管理並支援更高的擴充性，但不支援大量資料插入。</p></li>
</ul>
<p>下表總結了關鍵多租戶方法之間的主要差異。</p>
<table>
<thead>
<tr><th><strong>粒度</strong></th><th><strong>資料庫層級</strong></th><th><strong>集合層級</strong></th><th><strong>分割鍵層級</strong></th></tr>
</thead>
<tbody>
<tr><td>支援的最大租戶數</td><td>~1,000</td><td>~10,000</td><td>~10,000,000</td></tr>
<tr><td>資料組織彈性</td><td>高：使用者可使用自訂模式定義多重集合。</td><td>中等：使用者只能使用一個具有自訂模式的集合。</td><td>低：所有使用者共用一個集合，需要一致的模式。</td></tr>
<tr><td>每位使用者的成本</td><td>高</td><td>中</td><td>低</td></tr>
<tr><td>實體資源隔離</td><td>是</td><td>有</td><td>無</td></tr>
<tr><td>RBAC</td><td>是</td><td>是</td><td>無</td></tr>
<tr><td>搜尋效能</td><td>強</td><td>中等</td><td>強</td></tr>
</tbody>
</table>
<h2 id="Example-Multi-Tenancy-Strategy-for-a-RAG-Powered-Enterprise-Knowledge-Base" class="common-anchor-header">範例：RAG Powered 企業知識庫的多租戶策略<button data-href="#Example-Multi-Tenancy-Strategy-for-a-RAG-Powered-Enterprise-Knowledge-Base" class="anchor-icon" translate="no">
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
    </button></h2><p>當設計 RAG 系統的多租戶策略時，必須使您的方法與您的企業和租戶的具體需求相一致。Milvus 提供多種多租戶策略，選擇合適的策略取決於租戶的數量、需求以及所需的資料隔離程度。以下以 RAG 驅動的企業知識庫為例，說明如何做出這些決策的實用指南。</p>
<h3 id="Understanding-Tenant-Structure-Before-Choosing-a-Multi-Tenancy-Strategy" class="common-anchor-header">選擇多租戶策略前瞭解租戶結構</h3><p>由 RAG 驅動的企業知識庫通常為少量租戶提供服務。這些租戶通常是獨立的業務單位，如 IT、銷售、法律和行銷，每個單位都需要不同的知識庫服務。舉例來說，人力資源部門負責管理入職指南和福利政策等敏感的員工資訊，這些資訊應該是機密的，只有人力資源人員才能存取。</p>
<p>在這種情況下，每個業務單位都應視為獨立的租戶，而<strong>資料庫層級的多租戶策略</strong>通常是最適合的。透過為每個租戶指派專用資料庫，組織可以實現強大的邏輯隔離，簡化管理並提高安全性。此設定為租戶提供了極大的靈活性 - 他們可以在資料集中定義自訂資料模型、建立所需數量的資料集、獨立管理其資料集的存取控制。</p>
<h3 id="Enhancing-Security-with-Physical-Resource-Isolation" class="common-anchor-header">透過實體資源隔離強化安全性</h3><p>在資料安全性受到高度重視的情況下，資料庫層級的邏輯隔離可能並不足夠。例如，某些業務單位可能會處理關鍵或高度敏感的資料，因此需要更強大的保證以防止其他租戶的干擾。在這種情況下，我們可以在資料庫層級的多租戶結構之上實施<a href="https://milvus.io/docs/resource_group.md">實體隔離方法</a>。</p>
<p>Milvus 讓我們可以將資料庫和集合等邏輯元件映射到實體資源。此方法可確保其他租戶的活動不會影響關鍵作業。讓我們探討一下這種方法在實際中是如何運作的。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_How_Milvus_manages_physical_resources_6269b908d7.png" alt="Figure- How Milvus manages physical resources.png" class="doc-image" id="figure--how-milvus-manages-physical-resources.png" />
   </span> <span class="img-wrapper"> <span>圖- Milvus 如何管理實體資源.png</span> </span></p>
<p>圖Milvus 如何管理實體資源</p>
<p>如上圖所示，Milvus 有三層資源管理：<strong>查詢節點</strong>、<strong>資源群組</strong>和<strong>資</strong> <strong>料庫</strong>。</p>
<ul>
<li><p><strong>查詢節點</strong>：處理查詢任務的元件。它在實體機器或容器 (例如 Kubernetes 中的 pod) 上執行。</p></li>
<li><p><strong>資源群組</strong>：查詢節點的集合，作為邏輯元件（資料庫和集合）與實體資源之間的橋樑。您可以將一個或多個資料庫或資料集分配到單一資源群組。</p></li>
</ul>
<p>在上圖所示的範例中，有三個邏輯<strong>資料庫</strong>：X、Y 和 Z。</p>
<ul>
<li><p><strong>資料庫 X</strong>：包含<strong>資料集 A</strong>。</p></li>
<li><p><strong>資料庫 Y</strong>：包含<strong>資料集 B</strong>和<strong>C</strong>。</p></li>
<li><p><strong>資料庫 Z</strong>：包含<strong>資料集 D</strong>和<strong>E</strong>。</p></li>
</ul>
<p>假設資料庫<strong>X</strong>包含關鍵知識庫，我們不希望受到資料庫<strong>Y</strong>或<strong>資料庫 Z</strong> 負載的影響：</p>
<ul>
<li><p><strong>資料庫 X</strong>被分配給自己的<strong>資源群組</strong>，以保證其關鍵知識庫不受其他資料庫工作負載的影響。</p></li>
<li><p><strong>資料集 E</strong>也分配給其父資料庫<strong>(Z</strong>) 內的獨立<strong>資源群組</strong>。這在集合層級上為共用資料庫內的特定關鍵資料提供隔離。</p></li>
</ul>
<p>同時，<strong>資料庫 Y</strong>和<strong>Z</strong>中的其餘資料集則共用<strong>資源群組 2</strong> 的實體資源。</p>
<p>透過將邏輯元件仔細對應到實體資源，組織可以根據其特定的業務需求，建立彈性、可擴充且安全的多租戶架構。</p>
<h3 id="Designing-End-User-Level-Access" class="common-anchor-header">設計終端使用者層級存取</h3><p>既然我們已經瞭解了為企業 RAG 選擇多租用策略的最佳實務，讓我們來探討一下如何在這些系統中設計使用者層級的存取。</p>
<p>在這些系統中，終端使用者通常透過 LLM 以唯讀模式與知識庫互動。然而，企業仍需要追蹤這些由使用者產生的問答資料，並將其與特定使用者連結，以達到各種目的，例如改善知識庫的準確性或提供個人化服務。</p>
<p>以醫院的智慧型諮詢服務台為例。病人可能會問這樣的問題：「今天有沒有可以預約的專家？」或 「我即將進行的手術需要做什麼特定的準備嗎？」雖然這些問題不會直接影響知識庫，但對醫院而言，追蹤這類互動以改善服務是非常重要的。這些問答對通常會儲存在一個獨立的資料庫（不一定是向量資料庫）中，專門用來記錄互動。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_The_multi_tenancy_architecture_for_an_enterprise_RAG_knowledge_base_7c9ad8d4d1.png" alt="Figure- The multi-tenancy architecture for an enterprise RAG knowledge base .png" class="doc-image" id="figure--the-multi-tenancy-architecture-for-an-enterprise-rag-knowledge-base-.png" />
   </span> <span class="img-wrapper"> <span>圖- 企業 RAG 知識庫的多租戶架構 .png</span> </span></p>
<p><em>圖企業 RAG 知識庫的多租戶架構</em></p>
<p>上圖顯示企業 RAG 系統的多租戶架構。</p>
<ul>
<li><p><strong>系統</strong>管理<strong>員</strong>負責監督 RAG 系統、管理資源分配、分配資料庫、將資料庫對應到資源群組，並確保可擴展性。他們處理實體基礎架構，如圖所示，每個資源群組 (例如資源群組 1、2 及 3) 對應至實體伺服器 (查詢節點)。</p></li>
<li><p><strong>租戶（資料庫擁有者和開發者）</strong>管理知識庫，根據使用者產生的問答資料迭代知識庫，如圖所示。不同的資料庫（資料庫 X、Y、Z）包含不同知識庫內容的集合（集合 A、B 等）。</p></li>
<li><p><strong>終端使用者</strong>透過 LLM 以唯讀方式與系統互動。當他們查詢系統時，他們的問題會被記錄在獨立的 Q&amp;A 記錄表（一個獨立的資料庫）中，不斷將有價值的資料回饋到系統中。</p></li>
</ul>
<p>此設計可確保從使用者互動到系統管理的每個流程層都能順暢運作，協助組織建立強大且持續改善的知識庫。</p>
<h2 id="Summary" class="common-anchor-header">總結<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>在這篇博客中，我們探討了<a href="https://milvus.io/docs/multi_tenancy.md"><strong>多租戶</strong></a>框架如何在 RAG 驅動的知識庫的可擴展性、安全性和性能方面發揮關鍵作用。透過隔離不同租戶的資料和資源，企業可以確保隱私性、法規遵循，以及在共用基礎架構中的最佳化資源分配。<a href="https://milvus.io/docs/overview.md">Milvus</a> 具備彈性的多租戶策略，可讓企業根據其特定需求，選擇適當的資料隔離層級 (從資料庫層級到分割區層級)。選擇正確的多租戶方法可確保企業即使在處理不同的資料和工作負載時，也能為租戶提供量身打造的服務。</p>
<p>透過遵循這裡列出的最佳實務，企業可以有效地設計和管理多租戶 RAG 系統，不僅提供優異的使用者體驗，還能隨著業務需求的成長，毫不費力地進行擴充。Milvus 的架構可確保企業維持高層級的隔離、安全性與效能，使其成為建置企業級 RAG 動力知識庫的重要元件。</p>
<h2 id="Stay-Tuned-for-More-Insights-into-Multi-Tenancy-RAG" class="common-anchor-header">請繼續關注關於多租戶 RAG 的更多深入資訊<button data-href="#Stay-Tuned-for-More-Insights-into-Multi-Tenancy-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>在這篇部落格中，我們討論了 Milvus 的多租戶策略是如何設計來管理租戶，而非這些租戶中的終端使用者。終端使用者的互動通常發生在應用程式層，而向量資料庫本身卻不知道這些使用者的存在。</p>
<p>您可能會想知道<em>如果我想根據每個終端使用者的查詢歷史提供更精確的答案，Milvus 不需要為每個使用者維護個人化的問答情境嗎？</em></p>
<p>這是個很好的問題，答案真的取決於使用個案。舉例來說，在隨選諮詢服務中，查詢是隨機的，主要重點在於知識庫的品質，而非追蹤使用者的歷史情境。</p>
<p>然而，在其他情況下，RAG 系統必須具備情境感知功能。當需要這樣做時，Milvus 需要與應用程式層合作，以維持每個使用者情境的個人化記憶。這種設計對於擁有大量終端使用者的應用程式尤其重要，我們將在下一篇文章中詳細探討。敬請期待更多深入的探討！</p>
