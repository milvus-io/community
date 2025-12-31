---
id: >-
  milvus-rbac-explained-secure-your-vector-database-with-role-based-access-control.md
title: Milvus RBAC 解說：以角色為基礎的存取控制保護您的向量資料庫
author: Juan Xu
date: 2025-12-31T00:00:00.000Z
cover: assets.zilliz.com/RBAC_in_Milvus_Cover_1fe181b31d.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, RBAC, access control, vector database security'
meta_title: |
  Milvus RBAC Guide: How to Control Access to Your Vector Database
desc: 瞭解 RBAC 為何重要、Milvus 中的 RBAC 如何運作、如何設定存取控制，以及如何實現最少權限存取、明確的角色分工和安全的生產作業。
origin: >-
  https://milvus.io/blog/milvus-rbac-explained-secure-your-vector-database-with-role-based-access-control.md
---
<p>在建立資料庫系統時，工程師會把大部分時間花在效能上：索引類型、召回、延遲、吞吐量和擴充。但是，一旦系統超越了單一開發人員的筆記型電腦，另一個問題就變得同樣重要：<strong>誰可以在您的 Milvus 集群中做什麼</strong>？換句話說，就是存取控制。</p>
<p>在整個產業中，許多作業事故都源自於簡單的權限錯誤。腳本在錯誤的環境中執行。服務帳戶擁有比預期更廣泛的存取權限。共用的管理員憑證最終出現在 CI 中。這些問題通常以非常實際的問題浮現：</p>
<ul>
<li><p>是否允許開發人員刪除生產集合？</p></li>
<li><p>為什麼測試帳戶可以讀取生產向量資料？</p></li>
<li><p>為什麼多個服務使用相同的管理員角色登入？</p></li>
<li><p>分析工作是否可以擁有唯讀存取權限，而寫入權限為零？</p></li>
</ul>
<p><a href="https://milvus.io/">Milvus</a> <a href="https://milvus.io/docs/rbac.md">以基於角色的存取控制 (RBAC)</a> 來解決這些挑戰。RBAC 讓您可以在資料庫層定義精確的權限，而不是賦予每個使用者超級管理員的權限或試圖在應用程式碼中強制執行限制。每個使用者或服務都能獲得所需的功能，僅此而已。</p>
<p>這篇文章將解釋 RBAC 在 Milvus 中的工作原理、如何配置它，以及如何在生產環境中安全地應用它。</p>
<h2 id="Why-Access-Control-Matters-When-Using-Milvus" class="common-anchor-header">為什麼使用 Milvus 時存取控制很重要？<button data-href="#Why-Access-Control-Matters-When-Using-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>當團隊規模較小，而且他們的 AI 應用程式只服務有限數量的使用者時，基礎架構通常很簡單。由幾位工程師管理系統；Milvus 僅用於開發或測試；操作工作流程簡單直接。在這個早期階段，存取控制很少會讓人感到緊迫，因為風險面很小，而且任何錯誤都很容易逆轉。</p>
<p>隨著 Milvus 進入生產階段，使用者、服務和操作員的數量不斷增加，使用模式也迅速改變。常見的情況包括</p>
<ul>
<li><p>多個業務系統共享同一個 Milvus 實例</p></li>
<li><p>多個團隊存取相同的向量集合</p></li>
<li><p>測試、暫存與生產資料共存於單一叢集</p></li>
<li><p>不同角色需要不同層級的存取權限，從唯讀查詢到寫入與作業控制。</p></li>
</ul>
<p>如果沒有明確界定的存取邊界，這些設定就會產生可預見的風險：</p>
<ul>
<li><p>測試工作流程可能會意外刪除生產資料集</p></li>
<li><p>開發人員可能會無意中修改即時服務所使用的索引</p></li>
<li><p><code translate="no">root</code> 帳戶的廣泛使用，使得無法追蹤或稽核動作</p></li>
<li><p>受到攻擊的應用程式可能會不受限制地存取所有向量資料</p></li>
</ul>
<p>隨著使用量的增加，依賴非正式的慣例或共用的管理帳戶已無法持續下去。一個一致的、可強制執行的存取模型變得非常重要，而這正是 Milvus RBAC 所提供的。</p>
<h2 id="What-is-RBAC-in-Milvus" class="common-anchor-header">什麼是 Milvus 的 RBAC<button data-href="#What-is-RBAC-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/rbac.md">RBAC (基於角色的存取控制)</a>是一種權限模型，根據<strong>角色</strong>而非個別使用者來控制存取。在 Milvus 中，RBAC 可讓您精確定義允許使用者或服務執行哪些作業，以及哪些特定資源。當您的系統從單一開發者成長為完整的生產環境時，它提供了一種結構化、可擴展的安全管理方式。</p>
<p>Milvus RBAC 圍繞以下核心元件建立：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/users_roles_privileges_030620f913.png" alt="Users Roles Privileges" class="doc-image" id="users-roles-privileges" />
   </span> <span class="img-wrapper"> <span>使用者 角色 特權</span> </span></p>
<ul>
<li><p><strong>資源</strong>：被存取的實體。在 Milvus 中，資源包括<strong>實例</strong>、資<strong>料庫</strong>和<strong>集合</strong>。</p></li>
<li><p><strong>權限</strong>：資源上允許的特定操作 - 例如，建立資料集、插入資料或刪除實體。</p></li>
<li><p><strong>特權群組</strong>：一組預先定義的相關權限，例如「唯讀」或「寫入」。</p></li>
<li><p><strong>角色</strong>：特權及其適用資源的組合。角色決定<em>哪些</em>操作可以執行，以及<em>在何處</em>執行。</p></li>
<li><p><strong>使用者</strong>：Milvus 中的一個身份。每個使用者都有一個唯一的 ID，並被指派一個或多個角色。</p></li>
</ul>
<p>這些元件形成一個明確的層級結構：</p>
<ol>
<li><p><strong>使用者被指派角色</strong></p></li>
<li><p><strong>角色定義權限</strong></p></li>
<li><p><strong>權限適用於特定資源</strong></p></li>
</ol>
<p>Milvus 的一個關鍵設計原則是，<strong>權限從不直接分配給用戶</strong>。所有的存取都是透過角色進行。這種間接方式簡化了管理，減少了設定錯誤，並使權限變更具有可預測性。</p>
<p>在實際部署中，此模型可順利擴充。當多個使用者共用一個角色時，更新角色的權限會立即更新所有使用者的權限，而無需個別修改每個使用者。這是符合現代基礎架構管理存取方式的單點控制。</p>
<h2 id="How-RBAC-Works-in-Milvus" class="common-anchor-header">RBAC 如何在 Milvus 中運作<button data-href="#How-RBAC-Works-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>當用戶端向 Milvus 發送請求時，系統會通過一系列授權步驟進行評估。每個步驟都必須通過，才允許繼續操作：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_rbac_works_afe48bc717.png" alt="How RBAC Works in Milvus" class="doc-image" id="how-rbac-works-in-milvus" />
   </span> <span class="img-wrapper"> <span>RBAC 如何在 Milvus 工作</span> </span></p>
<ol>
<li><p><strong>驗證請求：</strong>Milvus 首先驗證使用者身份。如果驗證失敗，請求會以驗證錯誤被拒絕。</p></li>
<li><p><strong>檢查角色分配：</strong>驗證之後，Milvus 檢查使用者是否至少有一個角色分配。如果找不到角色，請求會以權限被拒絕的錯誤被拒絕。</p></li>
<li><p><strong>驗證所需權限：</strong>Milvus 會評估使用者的角色是否賦予目標資源所需的權限。如果權限檢查失敗，請求會以權限被拒絕的錯誤被拒絕。</p></li>
<li><p><strong>執行操作：</strong>如果所有檢查都通過，Milvus 執行請求的操作並傳回結果。</p></li>
</ol>
<h2 id="How-to-Configure-Access-Control-via-RBAC-in-Milvus" class="common-anchor-header">如何在 Milvus 中通過 RBAC 配置存取控制<button data-href="#How-to-Configure-Access-Control-via-RBAC-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Prerequisites" class="common-anchor-header">1.先決條件</h3><p>在評估和執行 RBAC 規則之前，必須啟用使用者驗證，以便 Milvus 的每個請求都能與特定使用者身分相關聯。</p>
<p>以下是兩種標準的部署方法。</p>
<ul>
<li><strong>使用 Docker Compose 部署</strong></li>
</ul>
<p>如果使用 Docker Compose 部署 Milvus，請編輯<code translate="no">milvus.yaml</code> 配置檔案，並透過設定<code translate="no">common.security.authorizationEnabled</code> 至<code translate="no">true</code> 來啟用授權：</p>
<pre><code translate="no"><span class="hljs-attr">common</span>:
  <span class="hljs-attr">security</span>:
    <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>使用 Helm Charts 部署</strong></li>
</ul>
<p>如果 Milvus 是使用 Helm Charts 部署的，請編輯<code translate="no">values.yaml</code> 檔案，並在<code translate="no">extraConfigFiles.user.yaml</code> 下新增下列設定： 1：</p>
<pre><code translate="no"><span class="hljs-attr">extraConfigFiles</span>:
  user.<span class="hljs-property">yaml</span>: |+
    <span class="hljs-attr">common</span>:
      <span class="hljs-attr">security</span>:
        <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Initialization" class="common-anchor-header">2.初始化</h3><p>預設情況下，Milvus 會在系統啟動時建立一個內建的<code translate="no">root</code> 使用者。這個使用者的預設密碼是<code translate="no">Milvus</code> 。</p>
<p>作為初始安全步驟，使用<code translate="no">root</code> 用戶連接 Milvus，並立即更改預設密碼。強烈建議使用複雜的密碼，以防止未經授權的存取。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-comment"># Connect to Milvus using the default root user</span>
client = MilvusClient(
    uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>, 
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>
)
<span class="hljs-comment"># Update the root password</span>
client.update_password(
    user_name=<span class="hljs-string">&quot;root&quot;</span>,
    old_password=<span class="hljs-string">&quot;Milvus&quot;</span>, 
    new_password=<span class="hljs-string">&quot;xgOoLudt3Kc#Pq68&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Core-Operations" class="common-anchor-header">3.核心操作</h3><p><strong>建立使用者</strong></p>
<p>對於日常使用，建議創建專用用戶，而不是使用<code translate="no">root</code> 帳戶。</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, password=<span class="hljs-string">&quot;P@ssw0rd&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>建立角色</strong></p>
<p>Milvus 提供內建的<code translate="no">admin</code> 角色，具有完整的管理權限。然而，對於大多數生產方案，建議建立自訂角色，以達到更精細的存取控制。</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>建立特權群組</strong></p>
<p>權限群組是多個權限的集合。為了簡化權限管理，可以將相關的權限分組並一起授予。</p>
<p>Milvus 包括以下內建的特權群組：</p>
<ul>
<li><p><code translate="no">COLL_RO</code>,<code translate="no">COLL_RW</code> 、<code translate="no">COLL_ADMIN</code></p></li>
<li><p><code translate="no">DB_RO</code>,<code translate="no">DB_RW</code> 、<code translate="no">DB_ADMIN</code></p></li>
<li><p><code translate="no">Cluster_RO</code>,<code translate="no">Cluster_RW</code> 、<code translate="no">Cluster_ADMIN</code></p></li>
</ul>
<p>使用這些內建的權限群組可大幅降低權限設計的複雜性，並改善不同角色間的一致性。</p>
<p>您可以直接使用內建的權限群組，或依需要建立自訂的權限群組。</p>
<pre><code translate="no"><span class="hljs-comment"># Create a privilege group</span>
client.create_privilege_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>）
<span class="hljs-comment"># Add privileges to the privilege group</span>
client.add_privileges_to_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>, privileges=[<span class="hljs-string">&#x27;Query&#x27;</span>, <span class="hljs-string">&#x27;Search&#x27;</span>])
<button class="copy-code-btn"></button></code></pre>
<p><strong>授予角色權限或權限群組</strong></p>
<p>建立角色後，就可以將權限或權限群組授予角色。這些特權的目標資源可以在不同層級指定，包括實例、資料庫或個別集合。</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;Search&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
client.<span class="hljs-title function_">grant_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;privilege_group_1&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
client.<span class="hljs-title function_">grant_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;ClusterReadOnly&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;*&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>授予使用者角色</strong></p>
<p>一旦將角色指派給使用者，使用者就可以存取資源，並執行這些角色所定義的操作。根據所需的存取範圍，單一使用者可被授予一個或多個角色。</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_role</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Inspect-and-Revoke-Access" class="common-anchor-header">4.檢查和撤銷存取權限</h3><p><strong>檢查指定給使用者的角色</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>檢查指定給角色的權限</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>從角色撤銷權限</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">revoke_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;Search&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
client.<span class="hljs-title function_">revoke_privilege_v2</span>(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;privilege_group_1&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>從使用者撤銷角色</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">revoke_role</span>(
    user_name=<span class="hljs-string">&#x27;user_1&#x27;</span>,
    role_name=<span class="hljs-string">&#x27;role_a&#x27;</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>刪除使用者和角色</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">drop_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
client.<span class="hljs-title function_">drop_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Example-Access-Control-Design-for-a-Milvus-Powered-RAG-System" class="common-anchor-header">範例：Milvus驅動的RAG系統的存取控制設計<button data-href="#Example-Access-Control-Design-for-a-Milvus-Powered-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>考慮一個建立在 Milvus 上的 Retrieval-Augmented Generation (RAG) 系統。</p>
<p>在這個系統中，不同的元件和使用者有清楚區分的責任，而且每個元件和使用者都需要不同等級的存取權限。</p>
<table>
<thead>
<tr><th>角色</th><th>責任</th><th>所需存取權限</th></tr>
</thead>
<tbody>
<tr><td>平台管理員</td><td>系統作業與組態</td><td>實體層級管理</td></tr>
<tr><td>向量擷取服務</td><td>向量資料擷取與更新</td><td>讀寫存取</td></tr>
<tr><td>搜尋服務</td><td>向量搜尋與檢索</td><td>唯讀存取</td></tr>
</tbody>
</table>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
client = MilvusClient(
    uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>,
    token=<span class="hljs-string">&quot;root:xxx&quot;</span>  <span class="hljs-comment"># Replace with the updated root password</span>
)
<span class="hljs-comment"># 1. Create a user (use a strong password)</span>
client.create_user(user_name=<span class="hljs-string">&quot;rag_admin&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
client.create_user(user_name=<span class="hljs-string">&quot;rag_reader&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
client.create_user(user_name=<span class="hljs-string">&quot;rag_writer&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
<span class="hljs-comment"># 2. Create roles</span>
client.create_role(role_name=<span class="hljs-string">&quot;role_admin&quot;</span>)
client.create_role(role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>)
client.create_role(role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>)
<span class="hljs-comment"># 3. Grant privileges to the role</span>
<span class="hljs-comment">## Using built-in Milvus privilege groups</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_admin&quot;</span>,
    privilege=<span class="hljs-string">&quot;Cluster_Admin&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;*&#x27;</span>,
)
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>,
    privilege=<span class="hljs-string">&quot;COLL_RO&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>,
    privilege=<span class="hljs-string">&quot;COLL_RW&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
<span class="hljs-comment"># 4. Assign the role to the user</span>
client.grant_role(user_name=<span class="hljs-string">&quot;rag_admin&quot;</span>, role_name=<span class="hljs-string">&quot;role_admin&quot;</span>)
client.grant_role(user_name=<span class="hljs-string">&quot;rag_reader&quot;</span>, role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>)
client.grant_role(user_name=<span class="hljs-string">&quot;rag_writer&quot;</span>, role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Quick-Tips-How-to-Operate-Access-Control-Safely-in-Production" class="common-anchor-header">快速提示：如何在生產中安全操作存取控制<button data-href="#Quick-Tips-How-to-Operate-Access-Control-Safely-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>為了確保存取控制在長期運作的生產系統中維持有效且易於管理，請遵循下列實用指引。</p>
<p><strong>1.變更預設</strong> <code translate="no">root</code> <strong>密碼，並限制</strong> <code translate="no">root</code> <strong>帳戶</strong> <strong>的使用</strong></p>
<p>初始化後立即更新預設的<code translate="no">root</code> 密碼，並限制其僅用於管理任務。避免在日常操作中使用或共享 root 帳戶。相反，為日常存取建立專用使用者和角色，以降低風險並加強問責性。</p>
<p><strong>2.在不同環境中實體隔離 Milvus 實例</strong></p>
<p>為開發、暫存和生產部署獨立的 Milvus 實例。與邏輯存取控制相比，物理隔離提供更強的安全邊界，並顯著降低跨環境錯誤的風險。</p>
<p><strong>3.遵循最小權限原則</strong></p>
<p>只授予每個角色所需的權限：</p>
<ul>
<li><p><strong>開發環境：</strong>權限可以較為寬鬆，以支援迭代和測試</p></li>
<li><p><strong>生產環境：</strong>權限應嚴格限制在必要的範圍內</p></li>
<li><p><strong>定期審核：</strong>定期檢閱現有權限，以確保這些權限仍為必要。</p></li>
</ul>
<p><strong>4.當不再需要權限時，主動取消權限</strong></p>
<p>存取控制不是一次性的設定，它需要持續的維護。當使用者、服務或職責變更時，請立即撤銷角色和權限。這可防止未使用的權限隨著時間累積，成為隱藏的安全風險。</p>
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
    </button></h2><p>在 Milvus 中配置存取控制本身並不複雜，但對於在生產中安全可靠地操作系統卻非常重要。使用精心設計的 RBAC 模型，您可以</p>
<ul>
<li><p>防止意外或破壞性操作，從而<strong>降低風險</strong></p></li>
<li><p>透過強制執行最少權限存取向量資料來<strong>提高安全性</strong></p></li>
<li><p>透過明確的職責分工<strong>來標準化作業</strong></p></li>
<li><p><strong>有信心地進行擴充</strong>，為多租戶和<strong>大規模</strong>部署奠定基礎</p></li>
</ul>
<p>存取控制並非可選功能或一次性任務。它是長期安全運作 Milvus 的基礎部分。</p>
<p>👉開始使用<a href="https://milvus.io/docs/rbac.md">RBAC</a>為您的 Milvus 部署建立穩固的安全基線。</p>
<p>對最新 Milvus 的任何功能有問題或想要深入瞭解？加入我們的<a href="https://discord.com/invite/8uyFbECzPX"> Discord 頻道</a>或在<a href="https://github.com/milvus-io/milvus"> GitHub</a> 上提出問題。您也可以透過<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> 預約 20 分鐘的一對一會議，以獲得深入瞭解、指導和問題解答。</p>
