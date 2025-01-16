---
id: data-security.md
title: Milvus Vector 資料庫如何確保資料安全？
author: Angela Ni
date: 2022-09-05T00:00:00.000Z
desc: 在 Milvus 中學習使用者驗證和傳輸中加密。
cover: assets.zilliz.com/Security_192e35a790.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/data-security.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Security_192e35a790.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>封面圖片</span> </span></p>
<p>為了充分考慮您的資料安全，Milvus 2.1 正式提供使用者驗證和傳輸層安全 (TLS) 連線。如果沒有使用者認證，任何人都可以使用 SDK 存取向量資料庫中的所有資料。但是，從 Milvus 2.1 開始，只有那些擁有有效用戶名和密碼的用戶才能訪問 Milvus 向量資料庫。此外，在 Milvus 2.1 中，資料安全性進一步受到 TLS 的保護，可確保電腦網路中的安全通訊。</p>
<p>本文旨在分析 Milvus 向量數據庫如何通過用戶認證和 TLS 連接來確保數據安全，並解釋作為一個希望確保數據安全的用戶，如何在使用向量數據庫時利用這兩個功能。</p>
<p><strong>跳至：</strong></p>
<ul>
<li><a href="#What-is-database-security-and-why-is-it-important">什麼是數據庫安全，為什麼它很重要？</a></li>
<li><a href="#How-does-the-Milvus-vector-database-ensure-data-security">Milvus 矢量資料庫如何確保資料安全？</a><ul>
<li><a href="#User-authentication">用戶認證</a></li>
<li><a href="#TLS-connection">TLS 連接</a></li>
</ul></li>
</ul>
<h2 id="What-is-database-security-and-why-is-it-important" class="common-anchor-header">什麼是資料庫安全，為什麼它很重要？<button data-href="#What-is-database-security-and-why-is-it-important" class="anchor-icon" translate="no">
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
    </button></h2><p>資料庫安全是指為確保資料庫中所有資料的安全和保密而採取的措施。最近發生在<a href="https://firewalltimes.com/recent-data-breaches/">Twitter、Marriott 和 Texas Department of Insurance 等</a>公司的資料外洩事件，讓我們對資料安全問題更加警覺。所有這些案例不斷提醒我們，如果數據沒有得到很好的保護，公司和企業使用的數據庫不安全，就可能遭受嚴重的損失。</p>
<h2 id="How-does-the-Milvus-vector-database-ensure-data-security" class="common-anchor-header">Milvus 矢量資料庫如何確保資料安全？<button data-href="#How-does-the-Milvus-vector-database-ensure-data-security" class="anchor-icon" translate="no">
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
    </button></h2><p>在目前的 2.1 版本中，Milvus 向量資料庫嘗試通過認證和加密來確保資料庫的安全性。具體來說，在存取層級上，Milvus 支援基本使用者驗證，以控制誰可以存取資料庫。同時，在資料庫層面上，Milvus 採用了傳輸層安全 (TLS) 加密協定來保護資料通訊。</p>
<h3 id="User-authentication" class="common-anchor-header">用戶認證</h3><p>為了資料安全，Milvus 的基本使用者認證功能支援使用使用者名稱和密碼存取向量資料庫。這意味著用戶端只有在提供經過認證的用戶名和密碼後才能訪問 Milvus 實例。</p>
<h4 id="The-authentication-workflow-in-the-Milvus-vector-database" class="common-anchor-header">Milvus 向量資料庫的驗證工作流程</h4><p>所有 gRPC 請求都由 Milvus 代理處理，因此驗證由代理完成。使用憑證登入以連線至 Milvus 實例的工作流程如下。</p>
<ol>
<li>為每個 Milvus 實例建立憑證，加密密碼儲存在 etcd 中。Milvus 使用<a href="https://golang.org/x/crypto/bcrypt">bcrypt</a>進行加密，因為它實作了 Provos 和 Mazières 的<a href="http://www.usenix.org/event/usenix99/provos/provos.pdf">自適應雜湊演算法</a>。</li>
<li>在客戶端，SDK 會在連線到 Milvus 服務時傳送密碼文字。base64 密文 (<username>:<password>) 以密碼<code translate="no">authorization</code> 附加到元資料。</li>
<li>Milvus 代理會攔截請求並驗證憑證。</li>
<li>憑證會緩存在本機的代理中。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_021e90e3c8.jpeg" alt="authetication_workflow" class="doc-image" id="authetication_workflow" />
   </span> <span class="img-wrapper"> <span>認證工作流程</span> </span></p>
<p>更新憑證時，Milvus 的系統工作流程如下</p>
<ol>
<li>當插入、查詢、刪除 API 被呼叫時，由 Root coord 負責憑證。</li>
<li>當您因為忘記密碼而更新憑證時，新密碼會持久化在 etcd 中。然後，代理本機快取記憶體中的所有舊憑證都會失效。</li>
<li>認證攔截器會先從本機快取中尋找記錄。如果快取記憶體中的憑證不正確，就會觸發 RPC 呼叫，從根坐標取得最新記錄。本地快取記憶體中的憑證也會相應更新。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/update_5af81a4173.jpeg" alt="credential_update_workflow" class="doc-image" id="credential_update_workflow" />
   </span> <span class="img-wrapper"> <span>憑證更新工作流程</span> </span></p>
<h4 id="How-to-manage-user-authentication-in-the-Milvus-vector-database" class="common-anchor-header">如何在 Milvus 向量資料庫中管理使用者驗證</h4><p>要啟用認證，首先需要在<code translate="no">milvus.yaml</code> 檔案中設定 Milvus 時，將<code translate="no">common.security.authorizationEnabled</code> 設定為<code translate="no">true</code> 。</p>
<p>啟用後，Milvus 會建立一個根使用者。這個 root 使用者可以使用<code translate="no">Milvus</code> 的初始密碼連線到 Milvus 向量資料庫。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections
connections.<span class="hljs-title function_">connect</span>(
    alias=<span class="hljs-string">&#x27;default&#x27;</span>,
    host=<span class="hljs-string">&#x27;localhost&#x27;</span>,
    port=<span class="hljs-string">&#x27;19530&#x27;</span>,
    user=<span class="hljs-string">&#x27;root_user&#x27;</span>,
    password=<span class="hljs-string">&#x27;Milvus&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>我們強烈建議在第一次啟動 Milvus 時更改 root 用戶的密碼。</p>
<p>然後，root 用戶可以進一步創建更多的新用戶，通過運行下面的命令創建新用戶來驗證訪問。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> utility
utility.<span class="hljs-title function_">create_credential</span>(<span class="hljs-string">&#x27;user&#x27;</span>, <span class="hljs-string">&#x27;password&#x27;</span>, <span class="hljs-keyword">using</span>=<span class="hljs-string">&#x27;default&#x27;</span>) 
<button class="copy-code-btn"></button></code></pre>
<p>在創建新用戶時，有兩點需要注意：</p>
<ol>
<li><p>至於新使用者名稱，其長度不能超過 32 個字元，並且必須以字母開頭。使用者名稱中只允許包含底線、字母或數字。例如，不接受 "2abc!"的使用者名稱。</p></li>
<li><p>至於密碼，其長度應為 6-256 個字元。</p></li>
</ol>
<p>一旦新憑證設定完成，新使用者就可以使用該使用者名稱和密碼連線到 Milvus 實例。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections
connections.<span class="hljs-title function_">connect</span>(
    alias=<span class="hljs-string">&#x27;default&#x27;</span>,
    host=<span class="hljs-string">&#x27;localhost&#x27;</span>,
    port=<span class="hljs-string">&#x27;19530&#x27;</span>,
    user=<span class="hljs-string">&#x27;user&#x27;</span>,
    password=<span class="hljs-string">&#x27;password&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>與所有認證程序一樣，您不必擔心忘記密碼。現有使用者的密碼可以用以下指令重設。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> utility
utility.<span class="hljs-title function_">reset_password</span>(<span class="hljs-string">&#x27;user&#x27;</span>, <span class="hljs-string">&#x27;new_password&#x27;</span>, <span class="hljs-keyword">using</span>=<span class="hljs-string">&#x27;default&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>閱讀<a href="https://milvus.io/docs/v2.1.x/authenticate.md">Milvus 文件</a>了解更多關於使用者認證的資訊。</p>
<h3 id="TLS-connection" class="common-anchor-header">TLS 連線</h3><p>傳輸層安全（TLS）是一種認證協定，在電腦網路中提供通訊安全。TLS 使用憑證在兩個或多個通訊方之間提供認證服務。</p>
<h4 id="How-to-enable-TLS-in-the-Milvus-vector-database" class="common-anchor-header">如何在 Milvus 向量資料庫中啟用 TLS</h4><p>要在 Milvus 中啟用 TLS，您需要先執行以下指令，準備兩個用於產生證書的檔案：一個名為<code translate="no">openssl.cnf</code> 的預設 OpenSSL 配置檔案，以及一個名為<code translate="no">gen.sh</code> 用於產生相關證書的檔案。</p>
<pre><code translate="no"><span class="hljs-built_in">mkdir</span> cert &amp;&amp; <span class="hljs-built_in">cd</span> cert
<span class="hljs-built_in">touch</span> openssl.cnf gen.sh
<button class="copy-code-btn"></button></code></pre>
<p>然後您可以簡單地複製並貼上我們<a href="https://milvus.io/docs/v2.1.x/tls.md#Create-files">在此</a>提供的設定到這兩個檔案。或者您也可以根據我們的配置進行修改，以更適合您的應用程式。</p>
<p>當這兩個檔案準備好後，您就可以執行<code translate="no">gen.sh</code> 檔案來建立九個證書檔案。同樣地，您也可以根據自己的需要修改九個證書檔案中的配置。</p>
<pre><code translate="no"><span class="hljs-built_in">chmod</span> +x gen.sh
./gen.sh
<button class="copy-code-btn"></button></code></pre>
<p>在使用 TLS 連線到 Milvus 服務之前，還有最後一個步驟。您必須將<code translate="no">tlsEnabled</code> 設定為<code translate="no">true</code> ，並在<code translate="no">config/milvus.yaml</code> 中為伺服器設定<code translate="no">server.pem</code> 、<code translate="no">server.key</code> 和<code translate="no">ca.pem</code> 的檔案路徑。下面的程式碼是一個範例。</p>
<pre><code translate="no">tls:
  serverPemPath: configs/cert/server.pem
  serverKeyPath: configs/cert/server.key
  caPemPath: configs/cert/ca.pem

common:
  security:
    tlsEnabled: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p>然後您就可以使用 TLS 連線到 Milvus 服務了，只要您在使用 Milvus 連線 SDK 時為客戶端指定<code translate="no">client.pem</code>,<code translate="no">client.key</code>, 和<code translate="no">ca.pem</code> 的檔案路徑。下面的程式碼也是一個範例。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections

_HOST = <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
_PORT = <span class="hljs-string">&#x27;19530&#x27;</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nCreate connection...&quot;</span>)
connections.connect(host=_HOST, port=_PORT, secure=<span class="hljs-literal">True</span>, client_pem_path=<span class="hljs-string">&quot;cert/client.pem&quot;</span>,
                        client_key_path=<span class="hljs-string">&quot;cert/client.key&quot;</span>,
                        ca_pem_path=<span class="hljs-string">&quot;cert/ca.pem&quot;</span>, server_name=<span class="hljs-string">&quot;localhost&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nList connections:&quot;</span>)
<span class="hljs-built_in">print</span>(connections.list_connections())
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-next" class="common-anchor-header">下一步<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>隨著 Milvus 2.1 正式發行，我們準備了一系列介紹新功能的部落格。閱讀此系列部落格的更多內容：</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">如何使用字串資料來強化您的相似性搜尋應用程式</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">使用 Embedded Milvus 即時以 Python 安裝及執行 Milvus</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">使用內建記憶體複本提高向量資料庫的讀取吞吐量</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">瞭解 Milvus 向量資料庫的一致性等級</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">瞭解 Milvus Vector 資料庫的一致性層級（第二部分）</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Milvus Vector 資料庫如何確保資料安全？</a></li>
</ul>
