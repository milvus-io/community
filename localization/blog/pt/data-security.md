---
id: data-security.md
title: Como é que a base de dados Milvus Vetor garante a segurança dos dados?
author: Angela Ni
date: 2022-09-05T00:00:00.000Z
desc: >-
  Saiba mais sobre a autenticação do utilizador e a encriptação em trânsito no
  Milvus.
cover: assets.zilliz.com/Security_192e35a790.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/data-security.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Security_192e35a790.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Imagem da capa</span> </span></p>
<p>Tendo em conta a segurança dos seus dados, a autenticação do utilizador e a ligação TLS (Transport Layer Security) estão agora oficialmente disponíveis no Milvus 2.1. Sem a autenticação do utilizador, qualquer pessoa pode aceder a todos os dados da sua base de dados vetorial com o SDK. No entanto, a partir do Milvus 2.1, apenas as pessoas com um nome de utilizador e uma palavra-passe válidos podem aceder à base de dados vetorial do Milvus. Além disso, no Milvus 2.1, a segurança dos dados é ainda mais protegida pelo TLS, que garante comunicações seguras numa rede informática.</p>
<p>Este artigo pretende analisar a forma como a base de dados vetorial Milvus garante a segurança dos dados com a autenticação do utilizador e a ligação TLS e explicar como pode utilizar estas duas funcionalidades enquanto utilizador que pretende garantir a segurança dos dados ao utilizar a base de dados vetorial.</p>
<p><strong>Saltar para:</strong></p>
<ul>
<li><a href="#What-is-database-security-and-why-is-it-important">O que é a segurança da base de dados e porque é que é importante?</a></li>
<li><a href="#How-does-the-Milvus-vector-database-ensure-data-security">Como é que a base de dados vetorial Milvus garante a segurança dos dados?</a><ul>
<li><a href="#User-authentication">Autenticação do utilizador</a></li>
<li><a href="#TLS-connection">Ligação TLS</a></li>
</ul></li>
</ul>
<h2 id="What-is-database-security-and-why-is-it-important" class="common-anchor-header">O que é a segurança da base de dados e porque é que é importante?<button data-href="#What-is-database-security-and-why-is-it-important" class="anchor-icon" translate="no">
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
    </button></h2><p>A segurança da base de dados refere-se às medidas adoptadas para garantir que todos os dados da base de dados estão seguros e são mantidos confidenciais. Os recentes casos de violação e fuga de dados no <a href="https://firewalltimes.com/recent-data-breaches/">Twitter, Marriott, Texas Department of Insurance, etc.</a> tornam-nos ainda mais atentos à questão da segurança dos dados. Todos estes casos recordam-nos constantemente que as empresas e os negócios podem sofrer graves perdas se os dados não estiverem bem protegidos e se as bases de dados que utilizam não forem seguras.</p>
<h2 id="How-does-the-Milvus-vector-database-ensure-data-security" class="common-anchor-header">Como é que a base de dados vetorial Milvus garante a segurança dos dados?<button data-href="#How-does-the-Milvus-vector-database-ensure-data-security" class="anchor-icon" translate="no">
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
    </button></h2><p>Na atual versão 2.1, a base de dados vetorial Milvus tenta garantir a segurança da base de dados através da autenticação e da encriptação. Mais especificamente, ao nível do acesso, o Milvus suporta a autenticação básica do utilizador para controlar quem pode aceder à base de dados. Entretanto, ao nível da base de dados, o Milvus adopta o protocolo de encriptação TLS (Transport Layer Security) para proteger a comunicação de dados.</p>
<h3 id="User-authentication" class="common-anchor-header">Autenticação do utilizador</h3><p>A funcionalidade de autenticação básica do utilizador no Milvus permite aceder à base de dados de vectores utilizando um nome de utilizador e uma palavra-passe para garantir a segurança dos dados. Isto significa que os clientes só podem aceder à instância do Milvus se fornecerem um nome de utilizador e uma palavra-passe autenticados.</p>
<h4 id="The-authentication-workflow-in-the-Milvus-vector-database" class="common-anchor-header">O fluxo de trabalho de autenticação na base de dados vetorial Milvus</h4><p>Todos os pedidos gRPC são tratados pelo proxy Milvus, pelo que a autenticação é efectuada pelo proxy. O fluxo de trabalho para iniciar a sessão com as credenciais de ligação à instância Milvus é o seguinte</p>
<ol>
<li>Criar credenciais para cada instância do Milvus e as palavras-passe encriptadas são armazenadas no etcd. O Milvus utiliza <a href="https://golang.org/x/crypto/bcrypt">o bcrypt</a> para a encriptação, uma vez que implementa o <a href="http://www.usenix.org/event/usenix99/provos/provos.pdf">algoritmo de hashing adaptativo</a> de Provos e Mazières.</li>
<li>No lado do cliente, o SDK envia texto cifrado quando se liga ao serviço Milvus. O texto cifrado em base64 (<username>:<password>) é anexado aos metadados com a chave <code translate="no">authorization</code>.</li>
<li>O proxy Milvus intercepta o pedido e verifica as credenciais.</li>
<li>As credenciais são armazenadas em cache localmente no proxy.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_021e90e3c8.jpeg" alt="authetication_workflow" class="doc-image" id="authetication_workflow" />
   </span> <span class="img-wrapper"> <span>fluxo de trabalho de autenticação</span> </span></p>
<p>Quando as credenciais são actualizadas, o fluxo de trabalho do sistema Milvus é o seguinte</p>
<ol>
<li>O coordenador de raiz é responsável pelas credenciais quando são chamadas as API de inserção, consulta e eliminação.</li>
<li>Quando se actualizam as credenciais por esquecimento da palavra-passe, por exemplo, a nova palavra-passe é guardada no etcd. Em seguida, todas as credenciais antigas no cache local do proxy são invalidadas.</li>
<li>O intercetor de autenticação procura primeiro os registos da cache local. Se as credenciais na cache não estiverem corretas, será acionada a chamada RPC para ir buscar o registo mais atualizado à coordenada raiz. E as credenciais na cache local são actualizadas em conformidade.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/update_5af81a4173.jpeg" alt="credential_update_workflow" class="doc-image" id="credential_update_workflow" />
   </span> <span class="img-wrapper"> <span>credential_update_workflow</span> </span></p>
<h4 id="How-to-manage-user-authentication-in-the-Milvus-vector-database" class="common-anchor-header">Como gerir a autenticação do utilizador na base de dados vetorial Milvus</h4><p>Para ativar a autenticação, é necessário definir primeiro <code translate="no">common.security.authorizationEnabled</code> para <code translate="no">true</code> ao configurar o Milvus no ficheiro <code translate="no">milvus.yaml</code>.</p>
<p>Uma vez activada, será criado um utilizador raiz para a instância do Milvus. Este utilizador raiz pode utilizar a palavra-passe inicial de <code translate="no">Milvus</code> para se ligar à base de dados de vectores do Milvus.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections
connections.<span class="hljs-title function_">connect</span>(
    alias=<span class="hljs-string">&#x27;default&#x27;</span>,
    host=<span class="hljs-string">&#x27;localhost&#x27;</span>,
    port=<span class="hljs-string">&#x27;19530&#x27;</span>,
    user=<span class="hljs-string">&#x27;root_user&#x27;</span>,
    password=<span class="hljs-string">&#x27;Milvus&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Recomendamos vivamente que altere a palavra-passe do utilizador raiz quando iniciar o Milvus pela primeira vez.</p>
<p>Em seguida, o utilizador root pode criar mais utilizadores novos para acesso autenticado, executando o seguinte comando para criar novos utilizadores.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> utility
utility.<span class="hljs-title function_">create_credential</span>(<span class="hljs-string">&#x27;user&#x27;</span>, <span class="hljs-string">&#x27;password&#x27;</span>, <span class="hljs-keyword">using</span>=<span class="hljs-string">&#x27;default&#x27;</span>) 
<button class="copy-code-btn"></button></code></pre>
<p>Há duas coisas a ter em conta quando se criam novos utilizadores:</p>
<ol>
<li><p>Quanto ao novo nome de utilizador, não pode exceder 32 caracteres de comprimento e deve começar com uma letra. Só são permitidos sublinhados, letras ou números no nome de utilizador. Por exemplo, um nome de utilizador "2abc!" não é aceite.</p></li>
<li><p>Quanto à palavra-passe, o seu comprimento deve ser de 6-256 caracteres.</p></li>
</ol>
<p>Uma vez configurada a nova credencial, o novo utilizador pode ligar-se à instância Milvus com o nome de utilizador e a palavra-passe.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections
connections.<span class="hljs-title function_">connect</span>(
    alias=<span class="hljs-string">&#x27;default&#x27;</span>,
    host=<span class="hljs-string">&#x27;localhost&#x27;</span>,
    port=<span class="hljs-string">&#x27;19530&#x27;</span>,
    user=<span class="hljs-string">&#x27;user&#x27;</span>,
    password=<span class="hljs-string">&#x27;password&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Como em todos os processos de autenticação, não tem de se preocupar se se esquecer da palavra-passe. A palavra-passe de um utilizador existente pode ser redefinida com o seguinte comando.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> utility
utility.<span class="hljs-title function_">reset_password</span>(<span class="hljs-string">&#x27;user&#x27;</span>, <span class="hljs-string">&#x27;new_password&#x27;</span>, <span class="hljs-keyword">using</span>=<span class="hljs-string">&#x27;default&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Leia a <a href="https://milvus.io/docs/v2.1.x/authenticate.md">documentação do Milvus</a> para saber mais sobre a autenticação do utilizador.</p>
<h3 id="TLS-connection" class="common-anchor-header">Ligação TLS</h3><p>A segurança da camada de transporte (TLS) é um tipo de protocolo de autenticação para fornecer segurança de comunicações numa rede de computadores. O TLS usa certificados para fornecer serviços de autenticação entre duas ou mais partes em comunicação.</p>
<h4 id="How-to-enable-TLS-in-the-Milvus-vector-database" class="common-anchor-header">Como ativar o TLS na base de dados vetorial Milvus</h4><p>Para ativar o TLS no Milvus, é necessário executar primeiro o seguinte comando para preparar dois ficheiros para gerar o certificado: um ficheiro de configuração OpenSSL predefinido com o nome <code translate="no">openssl.cnf</code> e um ficheiro com o nome <code translate="no">gen.sh</code> utilizado para gerar certificados relevantes.</p>
<pre><code translate="no"><span class="hljs-built_in">mkdir</span> cert &amp;&amp; <span class="hljs-built_in">cd</span> cert
<span class="hljs-built_in">touch</span> openssl.cnf gen.sh
<button class="copy-code-btn"></button></code></pre>
<p>Em seguida, pode simplesmente copiar e colar a configuração que fornecemos <a href="https://milvus.io/docs/v2.1.x/tls.md#Create-files">aqui</a> para os dois ficheiros. Ou pode também fazer modificações com base na nossa configuração para melhor se adequar à sua aplicação.</p>
<p>Quando os dois ficheiros estiverem prontos, pode executar o ficheiro <code translate="no">gen.sh</code> para criar nove ficheiros de certificados. Da mesma forma, também pode modificar as configurações nos nove ficheiros de certificado para se adequarem às suas necessidades.</p>
<pre><code translate="no"><span class="hljs-built_in">chmod</span> +x gen.sh
./gen.sh
<button class="copy-code-btn"></button></code></pre>
<p>Há um passo final antes de se poder ligar ao serviço Milvus com TLS. Tem de definir <code translate="no">tlsEnabled</code> para <code translate="no">true</code> e configurar os caminhos de ficheiro de <code translate="no">server.pem</code>, <code translate="no">server.key</code> e <code translate="no">ca.pem</code> para o servidor em <code translate="no">config/milvus.yaml</code>. O código abaixo é um exemplo.</p>
<pre><code translate="no">tls:
  serverPemPath: configs/cert/server.pem
  serverKeyPath: configs/cert/server.key
  caPemPath: configs/cert/ca.pem

common:
  security:
    tlsEnabled: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p>Em seguida, está tudo pronto e pode ligar-se ao serviço Milvus com TLS, desde que especifique os caminhos de ficheiro <code translate="no">client.pem</code>, <code translate="no">client.key</code> e <code translate="no">ca.pem</code> para o cliente quando utilizar o SDK de ligação Milvus. O código abaixo também é um exemplo.</p>
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
<h2 id="Whats-next" class="common-anchor-header">O que vem a seguir<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Com o lançamento oficial do Milvus 2.1, preparámos uma série de blogues que apresentam as novas funcionalidades. Leia mais nesta série de blogues:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Como utilizar dados de cadeias de caracteres para potenciar as suas aplicações de pesquisa por semelhança</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Usando o Embedded Milvus para instalar e executar instantaneamente o Milvus com Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Aumente a taxa de transferência de leitura do seu banco de dados vetorial com réplicas na memória</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Entendendo o nível de consistência no banco de dados vetorial do Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Entendendo o nível de consistência no banco de dados vetorial do Milvus (Parte II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Como o banco de dados vetorial Milvus garante a segurança dos dados?</a></li>
</ul>
