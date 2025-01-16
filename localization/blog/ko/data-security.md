---
id: data-security.md
title: 밀버스 벡터 데이터베이스는 어떻게 데이터 보안을 보장하나요?
author: Angela Ni
date: 2022-09-05T00:00:00.000Z
desc: Milvus의 전송 중 사용자 인증 및 암호화에 대해 알아보세요.
cover: assets.zilliz.com/Security_192e35a790.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/data-security.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Security_192e35a790.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>표지 이미지</span> </span></p>
<p>데이터 보안을 충분히 고려하여 사용자 인증 및 TLS(전송 계층 보안) 연결이 이제 Milvus 2.1에서 공식적으로 제공됩니다. 사용자 인증 없이도 누구나 SDK를 통해 벡터 데이터베이스의 모든 데이터에 액세스할 수 있습니다. 하지만 Milvus 2.1부터는 유효한 사용자 이름과 비밀번호를 가진 사용자만 Milvus 벡터 데이터베이스에 액세스할 수 있습니다. 또한 Milvus 2.1에서는 컴퓨터 네트워크에서 안전한 통신을 보장하는 TLS를 통해 데이터 보안이 더욱 강화되었습니다.</p>
<p>이 글에서는 벡터 데이터베이스 Milvus가 사용자 인증과 TLS 연결을 통해 데이터 보안을 보장하는 방법을 분석하고, 벡터 데이터베이스를 사용할 때 데이터 보안을 보장하려는 사용자로서 이 두 가지 기능을 어떻게 활용할 수 있는지 설명하고자 합니다.</p>
<p><strong>건너뛰기:</strong></p>
<ul>
<li><a href="#What-is-database-security-and-why-is-it-important">데이터베이스 보안이란 무엇이며 왜 중요한가요?</a></li>
<li><a href="#How-does-the-Milvus-vector-database-ensure-data-security">Milvus 벡터 데이터베이스는 어떻게 데이터 보안을 보장하나요?</a><ul>
<li><a href="#User-authentication">사용자 인증</a></li>
<li><a href="#TLS-connection">TLS 연결</a></li>
</ul></li>
</ul>
<h2 id="What-is-database-security-and-why-is-it-important" class="common-anchor-header">데이터베이스 보안이란 무엇이며 왜 중요한가요?<button data-href="#What-is-database-security-and-why-is-it-important" class="anchor-icon" translate="no">
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
    </button></h2><p>데이터베이스 보안이란 데이터베이스의 모든 데이터를 안전하게 보호하고 기밀로 유지하기 위해 취하는 조치를 말합니다. 최근 <a href="https://firewalltimes.com/recent-data-breaches/">트위터, 메리어트, 텍사스 보험국 등에서</a> 발생한 데이터 침해 및 데이터 유출 사건으로 인해 데이터 보안 문제에 대한 경각심이 더욱 커지고 있습니다. 이러한 모든 사례는 데이터를 제대로 보호하지 않고 사용하는 데이터베이스가 안전하지 않으면 기업과 비즈니스가 심각한 손실을 입을 수 있다는 사실을 끊임없이 상기시켜 줍니다.</p>
<h2 id="How-does-the-Milvus-vector-database-ensure-data-security" class="common-anchor-header">Milvus 벡터 데이터베이스는 어떻게 데이터 보안을 보장하나요?<button data-href="#How-does-the-Milvus-vector-database-ensure-data-security" class="anchor-icon" translate="no">
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
    </button></h2><p>현재 2.1 릴리스에서 Milvus 벡터 데이터베이스는 인증 및 암호화를 통해 데이터베이스 보안을 보장하려고 시도합니다. 보다 구체적으로, 액세스 수준에서 Milvus는 데이터베이스에 액세스할 수 있는 사용자를 제어하기 위해 기본 사용자 인증을 지원합니다. 한편, 데이터베이스 수준에서 Milvus는 데이터 통신을 보호하기 위해 TLS(전송 계층 보안) 암호화 프로토콜을 채택하고 있습니다.</p>
<h3 id="User-authentication" class="common-anchor-header">사용자 인증</h3><p>Milvus의 기본 사용자 인증 기능은 데이터 보안을 위해 사용자 이름과 비밀번호를 사용하여 벡터 데이터베이스에 액세스하는 것을 지원합니다. 즉, 클라이언트는 인증된 사용자 이름과 비밀번호를 제공해야만 Milvus 인스턴스에 액세스할 수 있습니다.</p>
<h4 id="The-authentication-workflow-in-the-Milvus-vector-database" class="common-anchor-header">Milvus 벡터 데이터베이스의 인증 워크플로</h4><p>모든 gRPC 요청은 Milvus 프록시에 의해 처리되므로 인증은 프록시에 의해 완료됩니다. Milvus 인스턴스에 연결하기 위해 자격 증명으로 로그인하는 워크플로우는 다음과 같습니다.</p>
<ol>
<li>각 Milvus 인스턴스에 대한 자격 증명을 생성하고 암호화된 비밀번호를 etcd에 저장합니다. Milvus는 프로보스와 마지에르의 <a href="http://www.usenix.org/event/usenix99/provos/provos.pdf">적응형 해싱 알고리즘을</a> 구현하기 때문에 암호화에 <a href="https://golang.org/x/crypto/bcrypt">bcrypt를</a> 사용합니다.</li>
<li>클라이언트 측에서 SDK는 Milvus 서비스에 연결할 때 암호 텍스트를 전송합니다. base64 암호 텍스트(<username>:<password>)는 <code translate="no">authorization</code> 키로 메타데이터에 첨부됩니다.</li>
<li>Milvus 프록시는 요청을 가로채서 자격 증명을 확인합니다.</li>
<li>자격 증명은 프록시에 로컬로 캐시됩니다.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_021e90e3c8.jpeg" alt="authetication_workflow" class="doc-image" id="authetication_workflow" />
   </span> <span class="img-wrapper"> <span>인증_워크플로</span> </span></p>
<p>자격 증명이 업데이트되면 Milvus의 시스템 워크플로는 다음과 같습니다.</p>
<ol>
<li>삽입, 조회, 삭제 API가 호출될 때 루트 코드는 자격 증명을 담당합니다.</li>
<li>예를 들어 비밀번호를 잊어버려서 자격 증명을 업데이트하면 새 비밀번호가 etcd에 유지됩니다. 그러면 프록시의 로컬 캐시에 있는 모든 이전 자격 증명이 무효화됩니다.</li>
<li>인증 인터셉터는 로컬 캐시에서 레코드를 먼저 찾습니다. 캐시에 있는 자격 증명이 올바르지 않으면 루트 코드로부터 가장 최근에 업데이트된 레코드를 가져오기 위한 RPC 호출이 트리거됩니다. 그리고 로컬 캐시의 자격 증명이 그에 따라 업데이트됩니다.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/update_5af81a4173.jpeg" alt="credential_update_workflow" class="doc-image" id="credential_update_workflow" />
   </span> <span class="img-wrapper"> <span>자격증명_업데이트_워크플로</span> </span></p>
<h4 id="How-to-manage-user-authentication-in-the-Milvus-vector-database" class="common-anchor-header">Milvus 벡터 데이터베이스에서 사용자 인증을 관리하는 방법</h4><p>인증을 활성화하려면 먼저 <code translate="no">milvus.yaml</code> 파일에서 Milvus를 구성할 때 <code translate="no">common.security.authorizationEnabled</code> 을 <code translate="no">true</code> 으로 설정해야 합니다.</p>
<p>인증이 활성화되면 Milvus 인스턴스에 대한 루트 사용자가 생성됩니다. 이 루트 사용자는 <code translate="no">Milvus</code> 의 초기 비밀번호를 사용하여 Milvus 벡터 데이터베이스에 연결할 수 있습니다.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections
connections.<span class="hljs-title function_">connect</span>(
    alias=<span class="hljs-string">&#x27;default&#x27;</span>,
    host=<span class="hljs-string">&#x27;localhost&#x27;</span>,
    port=<span class="hljs-string">&#x27;19530&#x27;</span>,
    user=<span class="hljs-string">&#x27;root_user&#x27;</span>,
    password=<span class="hljs-string">&#x27;Milvus&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus를 처음 시작할 때 루트 사용자의 비밀번호를 변경하는 것이 좋습니다.</p>
<p>그런 다음 루트 사용자는 다음 명령을 실행하여 새 사용자를 생성하여 인증된 액세스를 위해 더 많은 새 사용자를 추가로 만들 수 있습니다.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> utility
utility.<span class="hljs-title function_">create_credential</span>(<span class="hljs-string">&#x27;user&#x27;</span>, <span class="hljs-string">&#x27;password&#x27;</span>, <span class="hljs-keyword">using</span>=<span class="hljs-string">&#x27;default&#x27;</span>) 
<button class="copy-code-btn"></button></code></pre>
<p>새 사용자를 만들 때 기억해야 할 두 가지 사항이 있습니다:</p>
<ol>
<li><p>새 사용자 아이디의 길이는 32자를 초과할 수 없으며 반드시 문자로 시작해야 합니다. 사용자 아이디에는 밑줄, 문자 또는 숫자만 사용할 수 있습니다. 예를 들어 "2abc!"라는 사용자 아이디는 허용되지 않습니다.</p></li>
<li><p>비밀번호의 길이는 6~256자이어야 합니다.</p></li>
</ol>
<p>새 자격 증명이 설정되면 새 사용자는 사용자 아이디와 비밀번호를 사용하여 Milvus 인스턴스에 연결할 수 있습니다.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections
connections.<span class="hljs-title function_">connect</span>(
    alias=<span class="hljs-string">&#x27;default&#x27;</span>,
    host=<span class="hljs-string">&#x27;localhost&#x27;</span>,
    port=<span class="hljs-string">&#x27;19530&#x27;</span>,
    user=<span class="hljs-string">&#x27;user&#x27;</span>,
    password=<span class="hljs-string">&#x27;password&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>모든 인증 프로세스와 마찬가지로 비밀번호를 잊어버려도 걱정할 필요가 없습니다. 기존 사용자의 비밀번호는 다음 명령어로 재설정할 수 있습니다.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> utility
utility.<span class="hljs-title function_">reset_password</span>(<span class="hljs-string">&#x27;user&#x27;</span>, <span class="hljs-string">&#x27;new_password&#x27;</span>, <span class="hljs-keyword">using</span>=<span class="hljs-string">&#x27;default&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>사용자 인증에 대해 자세히 알아보려면 <a href="https://milvus.io/docs/v2.1.x/authenticate.md">Milvus 문서를</a> 참조하세요.</p>
<h3 id="TLS-connection" class="common-anchor-header">TLS 연결</h3><p>TLS(전송 계층 보안)는 컴퓨터 네트워크에서 통신 보안을 제공하기 위한 인증 프로토콜의 일종입니다. TLS는 인증서를 사용하여 둘 이상의 통신 당사자 간에 인증 서비스를 제공합니다.</p>
<h4 id="How-to-enable-TLS-in-the-Milvus-vector-database" class="common-anchor-header">Milvus 벡터 데이터베이스에서 TLS를 사용 설정하는 방법</h4><p>Milvus에서 TLS를 사용하려면 먼저 다음 명령을 실행하여 인증서를 생성하기 위한 두 개의 파일, 즉 <code translate="no">openssl.cnf</code> 이라는 이름의 기본 OpenSSL 구성 파일과 <code translate="no">gen.sh</code> 이라는 이름의 파일을 퍼레이트해야 합니다.</p>
<pre><code translate="no"><span class="hljs-built_in">mkdir</span> cert &amp;&amp; <span class="hljs-built_in">cd</span> cert
<span class="hljs-built_in">touch</span> openssl.cnf gen.sh
<button class="copy-code-btn"></button></code></pre>
<p>그런 다음 <a href="https://milvus.io/docs/v2.1.x/tls.md#Create-files">여기에서</a> 제공하는 구성을 복사하여 두 파일에 붙여넣기만 하면 됩니다. 또는 저희의 구성을 기반으로 귀하의 애플리케이션에 더 적합하도록 수정할 수도 있습니다.</p>
<p>두 파일이 준비되면 <code translate="no">gen.sh</code> 파일을 실행하여 9개의 인증서 파일을 만들 수 있습니다. 마찬가지로 9개의 인증서 파일의 구성을 필요에 맞게 수정할 수도 있습니다.</p>
<pre><code translate="no"><span class="hljs-built_in">chmod</span> +x gen.sh
./gen.sh
<button class="copy-code-btn"></button></code></pre>
<p>TLS를 사용하여 Milvus 서비스에 연결하기 전에 마지막 단계가 하나 있습니다. <code translate="no">tlsEnabled</code> 을 <code translate="no">true</code> 으로 설정하고 <code translate="no">config/milvus.yaml</code> 에서 서버의 파일 경로를 <code translate="no">server.pem</code>, <code translate="no">server.key</code>, <code translate="no">ca.pem</code> 로 구성해야 합니다. 아래 코드는 예시입니다.</p>
<pre><code translate="no">tls:
  serverPemPath: configs/cert/server.pem
  serverKeyPath: configs/cert/server.key
  caPemPath: configs/cert/ca.pem

common:
  security:
    tlsEnabled: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p>그러면 모든 설정이 완료되며 Milvus 연결 SDK를 사용할 때 클라이언트에 <code translate="no">client.pem</code>, <code translate="no">client.key</code>, <code translate="no">ca.pem</code> 의 파일 경로를 지정하기만 하면 TLS로 Milvus 서비스에 연결할 수 있습니다. 아래 코드도 예시입니다.</p>
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
<h2 id="Whats-next" class="common-anchor-header">향후 계획<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1의 공식 출시와 함께 새로운 기능을 소개하는 블로그 시리즈를 준비했습니다. 이 블로그 시리즈에서 자세히 읽어보세요:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">문자열 데이터를 사용해 유사도 검색 애플리케이션을 강화하는 방법</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">임베디드 Milvus를 사용하여 Python으로 Milvus 즉시 설치 및 실행하기</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">인메모리 복제본으로 벡터 데이터베이스 읽기 처리량 늘리기</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Milvus 벡터 데이터베이스의 일관성 수준 이해하기</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Milvus 벡터 데이터베이스의 일관성 수준 이해하기(2부)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Milvus Vector 데이터베이스는 어떻게 데이터 보안을 보장하나요?</a></li>
</ul>
