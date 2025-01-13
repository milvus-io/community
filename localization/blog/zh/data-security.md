---
id: data-security.md
title: Milvus 向量数据库如何确保数据安全？
author: Angela Ni
date: 2022-09-05T00:00:00.000Z
desc: 了解 Milvus 中的用户身份验证和传输加密。
cover: assets.zilliz.com/Security_192e35a790.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/data-security.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Security_192e35a790.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>封面图片</span> </span></p>
<p>为充分考虑您的数据安全，用户认证和传输层安全（TLS）连接现已在 Milvus 2.1 中正式提供。如果没有用户身份验证，任何人都可以通过 SDK 访问向量数据库中的所有数据。不过，从 Milvus 2.1 开始，只有拥有有效用户名和密码的人才能访问 Milvus 向量数据库。此外，Milvus 2.1 还通过 TLS 进一步保护数据安全，确保计算机网络中的通信安全。</p>
<p>本文旨在分析 Milvus 向量数据库如何通过用户身份验证和 TLS 连接来确保数据安全，并说明作为用户在使用向量数据库时如何利用这两项功能来确保数据安全。</p>
<p><strong>跳转到</strong></p>
<ul>
<li><a href="#What-is-database-security-and-why-is-it-important">什么是数据库安全，为什么它很重要？</a></li>
<li><a href="#How-does-the-Milvus-vector-database-ensure-data-security">Milvus 向量数据库如何确保数据安全？</a><ul>
<li><a href="#User-authentication">用户身份验证</a></li>
<li><a href="#TLS-connection">TLS 连接</a></li>
</ul></li>
</ul>
<h2 id="What-is-database-security-and-why-is-it-important" class="common-anchor-header">什么是数据库安全？<button data-href="#What-is-database-security-and-why-is-it-important" class="anchor-icon" translate="no">
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
    </button></h2><p>数据库安全是指为确保数据库中所有数据的安全和保密而采取的措施。最近<a href="https://firewalltimes.com/recent-data-breaches/">Twitter、万豪酒店和德克萨斯州保险部等</a>发生的数据泄露事件让我们对数据安全问题更加警惕。所有这些案例不断提醒我们，如果数据没有得到很好的保护，如果使用的数据库不安全，公司和企业就会遭受严重损失。</p>
<h2 id="How-does-the-Milvus-vector-database-ensure-data-security" class="common-anchor-header">Milvus 向量数据库如何确保数据安全？<button data-href="#How-does-the-Milvus-vector-database-ensure-data-security" class="anchor-icon" translate="no">
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
    </button></h2><p>在当前发布的 2.1 版中，Milvus 向量数据库试图通过身份验证和加密来确保数据库安全。更具体地说，在访问层面，Milvus 支持基本的用户身份验证，以控制谁可以访问数据库。同时，在数据库层面，Milvus 采用传输层安全（TLS）加密协议来保护数据通信。</p>
<h3 id="User-authentication" class="common-anchor-header">用户身份验证</h3><p>出于数据安全的考虑，Milvus 的基本用户认证功能支持使用用户名和密码访问向量数据库。这意味着客户只有在提供经过验证的用户名和密码后才能访问 Milvus 实例。</p>
<h4 id="The-authentication-workflow-in-the-Milvus-vector-database" class="common-anchor-header">Milvus 向量数据库的验证工作流程</h4><p>所有 gRPC 请求都由 Milvus 代理处理，因此身份验证由代理完成。使用凭据登录以连接 Milvus 实例的工作流程如下。</p>
<ol>
<li>为每个 Milvus 实例创建凭据，加密后的密码存储在 etcd 中。Milvus 使用<a href="https://golang.org/x/crypto/bcrypt">bcrypt</a>进行加密，因为它实现了 Provos 和 Mazières 的<a href="http://www.usenix.org/event/usenix99/provos/provos.pdf">自适应散列算法</a>。</li>
<li>在客户端，SDK 会在连接 Milvus 服务时发送密码文本。base64 密文（<username>:<password> ）以密钥<code translate="no">authorization</code> 附加到元数据中。</li>
<li>Milvus 代理拦截请求并验证凭据。</li>
<li>凭证缓存在代理服务器本地。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_021e90e3c8.jpeg" alt="authetication_workflow" class="doc-image" id="authetication_workflow" />
   </span> <span class="img-wrapper"> <span>自动验证工作流程</span> </span></p>
<p>更新证书时，Milvus 的系统工作流程如下</p>
<ol>
<li>当调用插入、查询、删除 API 时，根协调员负责凭证。</li>
<li>当你因为忘记密码等原因更新证书时，新密码会被持久化到 etcd 中。然后，代理本地缓存中的所有旧凭证都会失效。</li>
<li>身份验证拦截器会首先从本地缓存中查找记录。如果缓存中的凭据不正确，就会触发 RPC 调用，从根协调器中获取最新记录。本地缓存中的凭据也会相应更新。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/update_5af81a4173.jpeg" alt="credential_update_workflow" class="doc-image" id="credential_update_workflow" />
   </span> <span class="img-wrapper"> <span>凭证更新工作流程</span> </span></p>
<h4 id="How-to-manage-user-authentication-in-the-Milvus-vector-database" class="common-anchor-header">如何在 Milvus 向量数据库中管理用户身份验证</h4><p>要启用身份验证，首先需要在<code translate="no">milvus.yaml</code> 文件中配置 Milvus 时将<code translate="no">common.security.authorizationEnabled</code> 设置为<code translate="no">true</code> 。</p>
<p>启用后，将为 Milvus 实例创建一个根用户。这个根用户可以使用<code translate="no">Milvus</code> 的初始密码连接到 Milvus 向量数据库。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections
connections.<span class="hljs-title function_">connect</span>(
    alias=<span class="hljs-string">&#x27;default&#x27;</span>,
    host=<span class="hljs-string">&#x27;localhost&#x27;</span>,
    port=<span class="hljs-string">&#x27;19530&#x27;</span>,
    user=<span class="hljs-string">&#x27;root_user&#x27;</span>,
    password=<span class="hljs-string">&#x27;Milvus&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>我们强烈建议在首次启动 Milvus 时更改根用户的密码。</p>
<p>然后，root 用户可以进一步创建更多新用户，通过运行以下命令创建新用户来进行身份验证访问。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> utility
utility.<span class="hljs-title function_">create_credential</span>(<span class="hljs-string">&#x27;user&#x27;</span>, <span class="hljs-string">&#x27;password&#x27;</span>, <span class="hljs-keyword">using</span>=<span class="hljs-string">&#x27;default&#x27;</span>) 
<button class="copy-code-btn"></button></code></pre>
<p>创建新用户时要注意两点：</p>
<ol>
<li><p>新用户名长度不能超过 32 个字符，必须以字母开头。用户名中只能包含下划线、字母或数字。例如，不接受 "2abc!"这样的用户名。</p></li>
<li><p>至于密码，长度应为 6-256 个字符。</p></li>
</ol>
<p>设置好新凭证后，新用户就可以用用户名和密码连接到 Milvus 实例。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections
connections.<span class="hljs-title function_">connect</span>(
    alias=<span class="hljs-string">&#x27;default&#x27;</span>,
    host=<span class="hljs-string">&#x27;localhost&#x27;</span>,
    port=<span class="hljs-string">&#x27;19530&#x27;</span>,
    user=<span class="hljs-string">&#x27;user&#x27;</span>,
    password=<span class="hljs-string">&#x27;password&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>与所有身份验证过程一样，您不必担心忘记密码。可以使用以下命令重置现有用户的密码。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> utility
utility.<span class="hljs-title function_">reset_password</span>(<span class="hljs-string">&#x27;user&#x27;</span>, <span class="hljs-string">&#x27;new_password&#x27;</span>, <span class="hljs-keyword">using</span>=<span class="hljs-string">&#x27;default&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>阅读<a href="https://milvus.io/docs/v2.1.x/authenticate.md">Milvus 文档</a>，了解有关用户身份验证的更多信息。</p>
<h3 id="TLS-connection" class="common-anchor-header">TLS 连接</h3><p>传输层安全（TLS）是一种身份验证协议，为计算机网络提供通信安全。TLS 使用证书在两个或多个通信方之间提供身份验证服务。</p>
<h4 id="How-to-enable-TLS-in-the-Milvus-vector-database" class="common-anchor-header">如何在 Milvus 向量数据库中启用 TLS</h4><p>要在 Milvus 中启用 TLS，首先需要运行以下命令来准备两个用于生成证书的文件：一个名为<code translate="no">openssl.cnf</code> 的默认 OpenSSL 配置文件和一个用于生成相关证书的名为<code translate="no">gen.sh</code> 的文件。</p>
<pre><code translate="no"><span class="hljs-built_in">mkdir</span> cert &amp;&amp; <span class="hljs-built_in">cd</span> cert
<span class="hljs-built_in">touch</span> openssl.cnf gen.sh
<button class="copy-code-btn"></button></code></pre>
<p>然后，只需将我们提供的配置复制并粘贴到<a href="https://milvus.io/docs/v2.1.x/tls.md#Create-files">这</a>两个文件中即可。或者，你也可以根据我们的配置进行修改，以更好地适应你的应用。</p>
<p>两个文件准备就绪后，就可以运行<code translate="no">gen.sh</code> 文件来创建九个证书文件了。同样，你也可以根据自己的需要修改九个证书文件中的配置。</p>
<pre><code translate="no"><span class="hljs-built_in">chmod</span> +x gen.sh
./gen.sh
<button class="copy-code-btn"></button></code></pre>
<p>在使用 TLS 连接 Milvus 服务之前，还有最后一步。您必须将<code translate="no">tlsEnabled</code> 设置为<code translate="no">true</code> ，并在<code translate="no">config/milvus.yaml</code> 中为服务器配置<code translate="no">server.pem</code> 、<code translate="no">server.key</code> 和<code translate="no">ca.pem</code> 的文件路径。下面的代码是一个示例。</p>
<pre><code translate="no">tls:
  serverPemPath: configs/cert/server.pem
  serverKeyPath: configs/cert/server.key
  caPemPath: configs/cert/ca.pem

common:
  security:
    tlsEnabled: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p>然后，只要在使用 Milvus 连接 SDK 时为客户端指定<code translate="no">client.pem</code>,<code translate="no">client.key</code>, 和<code translate="no">ca.pem</code> 的文件路径，就可以使用 TLS 连接 Milvus 服务了。下面的代码也是一个示例。</p>
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
<h2 id="Whats-next" class="common-anchor-header">下一步计划<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>随着 Milvus 2.1 的正式发布，我们准备了一系列介绍新功能的博客。请阅读本系列博客中的更多内容：</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">如何使用字符串数据增强相似性搜索应用程序的功能</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">使用 Embedded Milvus 即时安装并用 Python 运行 Milvus</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">利用内存复制提高向量数据库的读取吞吐量</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">了解 Milvus 向量数据库中的一致性水平</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">了解 Milvus 向量数据库的一致性水平（第二部分）</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Milvus 向量数据库如何确保数据安全？</a></li>
</ul>
