---
id: milvus-access-control-rbac-guide.md
title: 'Guia de Controlo de Acesso Milvus: Como configurar o RBAC para produção'
author: Jack Li and Juan Xu
date: 2026-3-26
cover: assets.zilliz.com/cover_access_control_2_3e211dd48b.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus access control, Milvus RBAC, vector database security, Milvus privilege
  groups, Milvus production setup
meta_title: |
  Milvus Access Control: Configure RBAC for Production
desc: >-
  Guia passo-a-passo para configurar o Milvus RBAC na produção - utilizadores,
  funções, grupos de privilégios, acesso ao nível da coleção e um exemplo de
  sistema RAG completo.
origin: 'https://milvus.io/blog/milvus-access-control-rbac-guide.md'
---
<p>Eis uma história que é mais comum do que deveria ser: um engenheiro de controlo de qualidade executa um script de limpeza no que pensa ser o ambiente de teste. Exceto que a cadeia de ligação aponta para a produção. Poucos segundos depois, as colecções de vectores principais desapareceram - dados de caraterísticas perdidos, <a href="https://zilliz.com/glossary/similarity-search">pesquisa de semelhanças com</a> resultados vazios, degradação dos serviços em geral. O postmortem encontra a mesma causa raiz de sempre: todos estavam a ligar-se como <code translate="no">root</code>, não havia limites de acesso e nada impedia que uma conta de teste deixasse cair dados de produção.</p>
<p>Isto não é um caso isolado. As equipas que constroem em <a href="https://milvus.io/">Milvus</a> - e <a href="https://zilliz.com/learn/what-is-a-vector-database">as bases de dados vectoriais</a> em geral - tendem a concentrar-se no <a href="https://zilliz.com/learn/vector-index">desempenho do índice</a>, na taxa de transferência e na escala de dados, tratando o controlo de acesso como algo a tratar mais tarde. Mas "mais tarde" geralmente chega na forma de um incidente. À medida que o Milvus passa de protótipo a espinha dorsal dos <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">pipelines RAG</a> de produção, dos motores de recomendação e da <a href="https://zilliz.com/learn/what-is-vector-search">pesquisa vetorial</a> em tempo real, a questão torna-se inevitável: quem pode aceder ao seu cluster Milvus e o que é que pode fazer exatamente?</p>
<p>O Milvus inclui um sistema RBAC incorporado para responder a essa pergunta. Este guia cobre o que é o RBAC, como o Milvus o implementa e como conceber um modelo de controlo de acesso que mantenha a produção segura - completo com exemplos de código e um passo-a-passo completo do sistema RAG.</p>
<h2 id="What-Is-RBAC-Role-Based-Access-Control" class="common-anchor-header">O que é o RBAC (Controlo de Acesso Baseado em Funções)?<button data-href="#What-Is-RBAC-Role-Based-Access-Control" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>O Controlo de Acesso Baseado em Funções (RBAC)</strong> é um modelo de segurança em que as permissões não são atribuídas diretamente a utilizadores individuais. Em vez disso, as permissões são agrupadas em funções e aos utilizadores são atribuídas uma ou mais funções. O acesso efetivo de um utilizador é a união de todas as permissões das suas funções atribuídas. O RBAC é o modelo de controlo de acesso padrão nos sistemas de bases de dados de produção - PostgreSQL, MySQL, MongoDB e a maioria dos serviços em nuvem utilizam-no.</p>
<p>O RBAC resolve um problema de escala fundamental: quando se tem dezenas de utilizadores e serviços, a gestão de permissões por utilizador torna-se impossível de manter. Com o RBAC, define-se uma função uma vez (por exemplo, "apenas leitura na coleção X"), atribui-se a dez serviços e actualiza-se num único local quando os requisitos mudam.</p>
<h2 id="How-Does-Milvus-Implement-RBAC" class="common-anchor-header">Como é que o Milvus implementa o RBAC?<button data-href="#How-Does-Milvus-Implement-RBAC" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus RBAC baseia-se em quatro conceitos:</p>
<table>
<thead>
<tr><th>Conceito</th><th>O que é</th><th>Exemplo</th></tr>
</thead>
<tbody>
<tr><td><strong>Recurso</strong></td><td>O que está a ser acedido</td><td>Uma <a href="https://milvus.io/docs/architecture_overview.md">instância Milvus</a>, uma <a href="https://milvus.io/docs/manage-databases.md">base de dados</a> ou uma coleção específica</td></tr>
<tr><td><strong>Privilégio / Grupo de privilégios</strong></td><td>A ação que está a ser executada</td><td><code translate="no">Search</code>, <code translate="no">Insert</code>, <code translate="no">DropCollection</code>, ou um grupo como <code translate="no">COLL_RO</code> (coleção só de leitura)</td></tr>
<tr><td><strong>Função</strong></td><td>Um conjunto nomeado de privilégios com escopo para recursos</td><td><code translate="no">role_read_only</code>Utilizador: pode pesquisar e consultar todas as colecções na base de dados <code translate="no">default</code> </td></tr>
<tr><td><strong>Utilizador</strong></td><td>Uma conta Milvus (humana ou de serviço)</td><td><code translate="no">rag_writer</code>Conta de serviço utilizada pelo pipeline de ingestão</td></tr>
</tbody>
</table>
<p>O acesso nunca é atribuído diretamente aos utilizadores. Os utilizadores obtêm papéis, os papéis contêm privilégios e os privilégios são atribuídos a recursos. Este é o mesmo <a href="https://zilliz.com/blog/milvus-2-5-rbac-enhancements">modelo RBAC</a> utilizado na maioria dos sistemas de bases de dados de produção. Se dez utilizadores partilham o mesmo papel, actualiza-se o papel uma vez e a alteração aplica-se a todos eles.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_access_control_rbac_guide_1_c872ea8932.png" alt="Milvus RBAC model showing how Users are assigned to Roles, and Roles contain Privileges and Privilege Groups that apply to Resources" class="doc-image" id="milvus-rbac-model-showing-how-users-are-assigned-to-roles,-and-roles-contain-privileges-and-privilege-groups-that-apply-to-resources" />
   </span> <span class="img-wrapper"> <span>O modelo RBAC do Milvus mostra como os utilizadores são atribuídos a funções, e as funções contêm privilégios e grupos de privilégios que se aplicam aos recursos</span> </span></p>
<p>Quando um pedido chega ao Milvus, passa por três verificações:</p>
<ol>
<li><strong>Autenticação</strong> - este é um utilizador válido com as credenciais corretas?</li>
<li>Verificação<strong>da função</strong> - este utilizador tem pelo menos uma função atribuída?</li>
<li>Verificação<strong>de privilégios</strong> - alguma das funções do utilizador concede a ação solicitada no recurso solicitado?</li>
</ol>
<p>Se alguma das verificações falhar, o pedido é rejeitado.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/milvus_access_control_rbac_guide_2_2275b37ea6.png" alt="Milvus authentication and authorization flow: Client Request goes through Authentication, Role Check, and Privilege Check — rejected at any failed step, executed only if all pass" class="doc-image" id="milvus-authentication-and-authorization-flow:-client-request-goes-through-authentication,-role-check,-and-privilege-check-—-rejected-at-any-failed-step,-executed-only-if-all-pass" />
   <span>Fluxo de autenticação e autorização do Milvus: O pedido do cliente passa pela autenticação, verificação de função e verificação de privilégios - rejeitado em qualquer passo que falhe, executado apenas se todos forem aprovados</span> </span></p>
<h2 id="How-to-Enable-Authentication-in-Milvus" class="common-anchor-header">Como habilitar a autenticação no Milvus<button data-href="#How-to-Enable-Authentication-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Por defeito, o Milvus funciona com a autenticação desactivada - todas as ligações têm acesso total. O primeiro passo é ativá-la.</p>
<h3 id="Docker-Compose" class="common-anchor-header">Docker Compose</h3><p>Edite <code translate="no">milvus.yaml</code> e defina <code translate="no">authorizationEnabled</code> como <code translate="no">true</code>:</p>
<pre><code translate="no"><span class="hljs-attr">common</span>:
  <span class="hljs-attr">security</span>:
    <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Helm-Charts" class="common-anchor-header">Gráficos do Helm</h3><p>Editar <code translate="no">values.yaml</code> e adicionar a definição em <code translate="no">extraConfigFiles</code>:</p>
<pre><code translate="no"><span class="hljs-attr">extraConfigFiles</span>:
  user.<span class="hljs-property">yaml</span>: |+
    <span class="hljs-attr">common</span>:
      <span class="hljs-attr">security</span>:
        <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p>Para implantações <a href="https://milvus.io/docs/install_cluster-milvusoperator.md">do Milvus Operator</a> no <a href="https://milvus.io/docs/prerequisite-helm.md">Kubernetes</a>, a mesma configuração vai para a seção <code translate="no">spec.config</code> do Milvus CR.</p>
<p>Depois que a autenticação é ativada e o Milvus é reiniciado, todas as conexões devem fornecer credenciais. O Milvus cria um usuário padrão <code translate="no">root</code> com a senha <code translate="no">Milvus</code> - altere isso imediatamente.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Connect with the default root account</span>
client = MilvusClient(
    uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>
)

<span class="hljs-comment"># Change the password</span>
client.update_password(
    user_name=<span class="hljs-string">&quot;root&quot;</span>,
    old_password=<span class="hljs-string">&quot;Milvus&quot;</span>,
    new_password=<span class="hljs-string">&quot;xgOoLudt3Kc#Pq68&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Configure-Users-Roles-and-Privileges" class="common-anchor-header">Como configurar utilizadores, funções e privilégios<button data-href="#How-to-Configure-Users-Roles-and-Privileges" class="anchor-icon" translate="no">
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
    </button></h2><p>Com a autenticação activada, eis o fluxo de trabalho de configuração típico.</p>
<h3 id="Step-1-Create-Users" class="common-anchor-header">Etapa 1: criar usuários</h3><p>Não deixe que os serviços ou membros da equipa utilizem <code translate="no">root</code>. Crie contas dedicadas para cada utilizador ou serviço.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, password=<span class="hljs-string">&quot;P@ssw0rd&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-Roles" class="common-anchor-header">Passo 2: Criar funções</h3><p>O Milvus tem uma função incorporada <code translate="no">admin</code>, mas na prática vai querer funções personalizadas que correspondam aos seus padrões de acesso reais.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Create-Privilege-Groups" class="common-anchor-header">Passo 3: Criar grupos de privilégios</h3><p>Um grupo de privilégios agrupa vários privilégios sob um nome, facilitando a gestão do acesso em escala. Milvus fornece 9 grupos de privilégios embutidos:</p>
<table>
<thead>
<tr><th>Grupo incorporado</th><th>Escopo</th><th>O que ele permite</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">COLL_RO</code></td><td>Coleção</td><td>Operações só de leitura (consulta, pesquisa, etc.)</td></tr>
<tr><td><code translate="no">COLL_RW</code></td><td>Coleção</td><td>Operações de leitura e escrita</td></tr>
<tr><td><code translate="no">COLL_Admin</code></td><td>Coleção</td><td>Gestão completa da coleção</td></tr>
<tr><td><code translate="no">DB_RO</code></td><td>Base de dados</td><td>Operações de base de dados só de leitura</td></tr>
<tr><td><code translate="no">DB_RW</code></td><td>Base de dados</td><td>Operações de leitura e escrita na base de dados</td></tr>
<tr><td><code translate="no">DB_Admin</code></td><td>Base de dados</td><td>Gestão completa da base de dados</td></tr>
<tr><td><code translate="no">Cluster_RO</code></td><td>Cluster</td><td>Operações de cluster só de leitura</td></tr>
<tr><td><code translate="no">Cluster_RW</code></td><td>Cluster</td><td>Operações de cluster de leitura e escrita</td></tr>
<tr><td><code translate="no">Cluster_Admin</code></td><td>Cluster</td><td>Gerenciamento completo do cluster</td></tr>
</tbody>
</table>
<p>Também pode criar grupos de privilégios personalizados quando os grupos incorporados não se adequarem:</p>
<pre><code translate="no"><span class="hljs-comment"># Create a privilege group</span>
client.create_privilege_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>)

<span class="hljs-comment"># Add privileges to the group</span>
client.add_privileges_to_group(
    group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>,
    privileges=[<span class="hljs-string">&#x27;Query&#x27;</span>, <span class="hljs-string">&#x27;Search&#x27;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Grant-Privileges-to-a-Role" class="common-anchor-header">Etapa 4: conceder privilégios a uma função</h3><p>Conceda privilégios individuais ou grupos de privilégios a uma função, com escopo para recursos específicos. Os parâmetros <code translate="no">collection_name</code> e <code translate="no">db_name</code> controlam o âmbito - utilize <code translate="no">*</code> para todos.</p>
<pre><code translate="no"><span class="hljs-comment"># Grant a single privilege</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;Search&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># Grant a privilege group</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;privilege_group_1&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># Grant a cluster-level privilege (* means all resources)</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;ClusterReadOnly&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;*&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Assign-Roles-to-Users" class="common-anchor-header">Passo 5: Atribuir funções aos utilizadores</h3><p>Um utilizador pode ter várias funções. As suas permissões efectivas são a união de todas as funções atribuídas.</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_role</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Audit-and-Revoke-Access" class="common-anchor-header">Como auditar e revogar o acesso<button data-href="#How-to-Audit-and-Revoke-Access" class="anchor-icon" translate="no">
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
    </button></h2><p>Saber que tipo de acesso existe é tão importante como concedê-lo. As permissões obsoletas - de antigos membros da equipa, serviços retirados ou sessões de depuração pontuais - acumulam-se silenciosamente e alargam a superfície de ataque.</p>
<h3 id="Check-Current-Permissions" class="common-anchor-header">Verificar as permissões actuais</h3><p>Ver as funções atribuídas a um utilizador:</p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Ver os privilégios concedidos a uma função:</p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Revoke-Privileges-from-a-Role" class="common-anchor-header">Revogar privilégios de uma função</h3><pre><code translate="no"><span class="hljs-comment"># Remove a single privilege</span>
client.revoke_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;Search&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># Remove a privilege group</span>
client.revoke_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_a&quot;</span>,
    privilege=<span class="hljs-string">&quot;privilege_group_1&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;collection_01&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Unassign-a-Role-from-a-User" class="common-anchor-header">Anular a atribuição de uma função a um utilizador</h3><pre><code translate="no">client.<span class="hljs-title function_">revoke_role</span>(
    user_name=<span class="hljs-string">&#x27;user_1&#x27;</span>,
    role_name=<span class="hljs-string">&#x27;role_a&#x27;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Delete-Users-or-Roles" class="common-anchor-header">Eliminar utilizadores ou funções</h3><p>Remova todas as atribuições de funções antes de eliminar um utilizador e revogue todos os privilégios antes de eliminar uma função:</p>
<pre><code translate="no">client.<span class="hljs-title function_">drop_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
client.<span class="hljs-title function_">drop_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Example-How-to-Design-RBAC-for-a-Production-RAG-System" class="common-anchor-header">Exemplo: Como conceber RBAC para um sistema RAG de produção<button data-href="#Example-How-to-Design-RBAC-for-a-Production-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Os conceitos abstractos tornam-se mais fáceis de entender com um exemplo concreto. Considere um sistema <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> construído em Milvus com três serviços distintos:</p>
<table>
<thead>
<tr><th>Serviço</th><th>Responsabilidade</th><th>Acesso necessário</th></tr>
</thead>
<tbody>
<tr><td><strong>Administrador da plataforma</strong></td><td>Gere o cluster Milvus - cria colecções, monitoriza a saúde, trata das actualizações</td><td>Administrador completo do cluster</td></tr>
<tr><td><strong>Serviço de ingestão</strong></td><td>Gera <a href="https://zilliz.com/glossary/vector-embeddings">embeddings vectoriais</a> a partir de documentos e escreve-os em colecções</td><td>Leitura + escrita nas colecções</td></tr>
<tr><td><strong>Serviço de pesquisa</strong></td><td>Trata as consultas <a href="https://zilliz.com/learn/what-is-vector-search">de pesquisa vetorial</a> dos utilizadores finais</td><td>Só de leitura nas colecções</td></tr>
</tbody>
</table>
<p>Aqui está uma configuração completa usando <a href="https://milvus.io/docs/install-pymilvus.md">PyMilvus</a>:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(
    uri=<span class="hljs-string">&#x27;http://localhost:19530&#x27;</span>,
    token=<span class="hljs-string">&quot;root:xxx&quot;</span>  <span class="hljs-comment"># Replace with your updated root password</span>
)

<span class="hljs-comment"># 1. Create users</span>
client.create_user(user_name=<span class="hljs-string">&quot;rag_admin&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
client.create_user(user_name=<span class="hljs-string">&quot;rag_reader&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)
client.create_user(user_name=<span class="hljs-string">&quot;rag_writer&quot;</span>, password=<span class="hljs-string">&quot;xxx&quot;</span>)

<span class="hljs-comment"># 2. Create roles</span>
client.create_role(role_name=<span class="hljs-string">&quot;role_admin&quot;</span>)
client.create_role(role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>)
client.create_role(role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>)

<span class="hljs-comment"># 3. Grant access to roles</span>

<span class="hljs-comment"># Admin role: cluster-level admin access</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_admin&quot;</span>,
    privilege=<span class="hljs-string">&quot;Cluster_Admin&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;*&#x27;</span>,
)

<span class="hljs-comment"># Read-only role: collection-level read-only access</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>,
    privilege=<span class="hljs-string">&quot;COLL_RO&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># Read-write role: collection-level read and write access</span>
client.grant_privilege_v2(
    role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>,
    privilege=<span class="hljs-string">&quot;COLL_RW&quot;</span>,
    collection_name=<span class="hljs-string">&#x27;*&#x27;</span>,
    db_name=<span class="hljs-string">&#x27;default&#x27;</span>,
)

<span class="hljs-comment"># 4. Assign roles to users</span>
client.grant_role(user_name=<span class="hljs-string">&quot;rag_admin&quot;</span>, role_name=<span class="hljs-string">&quot;role_admin&quot;</span>)
client.grant_role(user_name=<span class="hljs-string">&quot;rag_reader&quot;</span>, role_name=<span class="hljs-string">&quot;role_read_only&quot;</span>)
client.grant_role(user_name=<span class="hljs-string">&quot;rag_writer&quot;</span>, role_name=<span class="hljs-string">&quot;role_read_write&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Cada serviço obtém exatamente o acesso de que necessita. O serviço de pesquisa não pode apagar dados acidentalmente. O serviço de ingestão não pode modificar as configurações do cluster. E se as credenciais do serviço de pesquisa vazarem, o invasor poderá ler <a href="https://zilliz.com/glossary/vector-embeddings">os vetores de incorporação</a>, mas não poderá escrever, excluir ou passar para administrador.</p>
<p>Para as equipas que gerem o acesso em várias implementações Milvus, <a href="https://cloud.zilliz.com/signup">o Zilliz Cloud</a> (Milvus gerido) fornece RBAC integrado com uma consola Web para gerir utilizadores, funções e permissões - sem necessidade de scripts. Útil quando se prefere gerir o acesso através de uma interface de utilizador em vez de manter scripts de configuração em todos os ambientes.</p>
<h2 id="Access-Control-Best-Practices-for-Production" class="common-anchor-header">Melhores práticas de controlo de acesso para produção<button data-href="#Access-Control-Best-Practices-for-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>As etapas de configuração acima são a mecânica. Aqui estão os princípios de design que mantêm o controlo de acesso eficaz ao longo do tempo.</p>
<h3 id="Lock-Down-the-Root-Account" class="common-anchor-header">Bloquear a conta raiz</h3><p>Altere a senha padrão <code translate="no">root</code> antes de qualquer outra coisa. Na produção, a conta raiz deve ser usada apenas para operações de emergência e armazenada em um gerenciador de segredos - não codificada em configurações de aplicativos ou compartilhada pelo Slack.</p>
<h3 id="Separate-Environments-Completely" class="common-anchor-header">Separe completamente os ambientes</h3><p>Use diferentes <a href="https://milvus.io/docs/architecture_overview.md">instâncias Milvus</a> para desenvolvimento, preparação e produção. A separação de ambientes apenas por RBAC é frágil - uma string de conexão mal configurada e um serviço de desenvolvimento está escrevendo em dados de produção. A separação física (clusters diferentes, credenciais diferentes) elimina completamente esta classe de incidentes.</p>
<h3 id="Apply-Least-Privilege" class="common-anchor-header">Aplique o privilégio mínimo</h3><p>Dê a cada utilizador e serviço o acesso mínimo necessário para fazer o seu trabalho. Comece com um acesso restrito e alargue-o apenas quando houver uma necessidade específica e documentada. Em ambientes de desenvolvimento, pode ser mais relaxado, mas o acesso à produção deve ser rigoroso e revisto regularmente.</p>
<h3 id="Clean-Up-Stale-Access" class="common-anchor-header">Limpar o acesso obsoleto</h3><p>Quando alguém deixa a equipa ou um serviço é desativado, revogue as suas funções e elimine as suas contas imediatamente. As contas não utilizadas com permissões activas são o vetor mais comum de acesso não autorizado - são credenciais válidas que ninguém está a monitorizar.</p>
<h3 id="Scope-Privileges-to-Specific-Collections" class="common-anchor-header">Atribuir privilégios a colecções específicas</h3><p>Evite conceder <code translate="no">collection_name='*'</code> a menos que a função necessite realmente de acesso a todas as colecções. Em configurações de vários inquilinos ou sistemas com vários pipelines de dados, defina o escopo de cada função apenas para as <a href="https://milvus.io/docs/manage-collections.md">coleções</a> em que ela opera. Isto limita o raio de ação se as credenciais forem comprometidas.</p>
<hr>
<p>Se estiver a implementar <a href="https://milvus.io/">o Milvus</a> em produção e a trabalhar no controlo de acesso, segurança ou design multi-tenant, gostaríamos de ajudar:</p>
<ul>
<li>Junte-se à <a href="https://slack.milvus.io/">comunidade Milvus Slack</a> para discutir práticas reais de implantação com outros engenheiros que executam Milvus em escala.</li>
<li><a href="https://milvus.io/office-hours">Reserve uma sessão gratuita de 20 minutos do Milvus Office Hours</a> para percorrer o seu design RBAC - quer se trate de estrutura de funções, escopo de nível de coleção ou segurança multi-ambiente.</li>
<li>Se preferir ignorar a configuração da infraestrutura e gerir o controlo de acesso através de uma interface de utilizador, <a href="https://cloud.zilliz.com/signup">o Zilliz Cloud</a> (Milvus gerido) inclui RBAC incorporado com uma consola Web - além de <a href="https://zilliz.com/cloud-security">encriptação</a>, isolamento de rede e conformidade SOC 2 imediata.</li>
</ul>
<hr>
<p>Algumas questões que surgem quando as equipas começam a configurar o controlo de acesso no Milvus:</p>
<p><strong>P: Posso restringir o acesso de um utilizador apenas a colecções específicas e não a todas?</strong></p>
<p>Sim. Quando chama <a href="https://milvus.io/docs/grant_privilege.md"><code translate="no">grant_privilege_v2</code></a>defina <code translate="no">collection_name</code> para a coleção específica em vez de <code translate="no">*</code>. A função do utilizador só terá acesso a essa coleção. Pode conceder privilégios à mesma função em várias colecções chamando a função uma vez por coleção.</p>
<p><strong>P: Qual é a diferença entre um privilégio e um grupo de privilégios no Milvus?</strong></p>
<p>Um privilégio é uma ação única como <code translate="no">Search</code>, <code translate="no">Insert</code>, ou <code translate="no">DropCollection</code>. Um <a href="https://milvus.io/docs/privilege_group.md">grupo de privilégios</a> agrupa vários privilégios sob um nome - por exemplo, <code translate="no">COLL_RO</code> inclui todas as operações de coleção só de leitura. Conceder um grupo de privilégios é funcionalmente o mesmo que conceder cada um dos seus privilégios constituintes individualmente, mas é mais fácil de gerir.</p>
<p><strong>P: A ativação da autenticação afecta o desempenho das consultas Milvus?</strong></p>
<p>A sobrecarga é insignificante. O Milvus valida as credenciais e verifica as permissões de função em cada pedido, mas trata-se de uma pesquisa na memória - acrescenta microssegundos, não milissegundos. Não há impacto mensurável na latência <a href="https://milvus.io/docs/single-vector-search.md">de pesquisa</a> ou <a href="https://milvus.io/docs/insert-update-delete.md">inserção</a>.</p>
<p><strong>P: Posso usar o Milvus RBAC numa configuração multi-tenant?</strong></p>
<p>Sim. Crie funções separadas por inquilino, defina o âmbito dos privilégios de cada função para as colecções desse inquilino e atribua a função correspondente à conta de serviço de cada inquilino. Isto dá-lhe um isolamento ao nível da coleção sem necessitar de instâncias Milvus separadas. Para multi-tenancy em larga escala, veja o <a href="https://milvus.io/docs/multi_tenancy.md">guia multi-tenancy do Milvus</a>.</p>
