---
id: >-
  milvus-rbac-explained-secure-your-vector-database-with-role-based-access-control.md
title: >-
  Explicação do Milvus RBAC: Proteja a sua base de dados Vetorial com o Controlo
  de Acesso Baseado em Funções
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
desc: >-
  Saiba porque é que o RBAC é importante, como funciona o RBAC no Milvus, como
  configurar o controlo de acesso e como permite o acesso com o mínimo de
  privilégios, uma separação clara de funções e operações de produção seguras.
origin: >-
  https://milvus.io/blog/milvus-rbac-explained-secure-your-vector-database-with-role-based-access-control.md
---
<p>Quando se constrói um sistema de base de dados, os engenheiros passam a maior parte do tempo no desempenho: tipos de índices, recuperação, latência, taxa de transferência e escalonamento. Mas quando um sistema vai além do laptop de um único desenvolvedor, outra questão torna-se igualmente crítica: <strong>quem pode fazer o quê dentro do seu cluster Milvus</strong>? Por outras palavras - controlo de acesso.</p>
<p>Em toda a indústria, muitos incidentes operacionais resultam de simples erros de permissão. Um script é executado no ambiente errado. Uma conta de serviço tem um acesso mais alargado do que o pretendido. Uma credencial de administrador partilhada acaba na CI. Esses problemas geralmente surgem como questões muito práticas:</p>
<ul>
<li><p>Os programadores têm permissão para eliminar colecções de produção?</p></li>
<li><p>Porque é que uma conta de teste pode ler os dados do vetor de produção?</p></li>
<li><p>Porque é que vários serviços estão a iniciar sessão com a mesma função de administrador?</p></li>
<li><p>Os trabalhos de análise podem ter acesso apenas de leitura com zero privilégios de escrita?</p></li>
</ul>
<p><a href="https://milvus.io/">O Milvus</a> resolve estes desafios com o <a href="https://milvus.io/docs/rbac.md">controlo de acesso baseado em funções (RBAC)</a>. Em vez de dar a cada utilizador direitos de superadministrador ou tentar impor restrições no código da aplicação, o RBAC permite-lhe definir permissões precisas na camada da base de dados. Cada utilizador ou serviço obtém exatamente as capacidades de que necessita - nada mais.</p>
<p>Este post explica como o RBAC funciona no Milvus, como configurá-lo e como aplicá-lo com segurança em ambientes de produção.</p>
<h2 id="Why-Access-Control-Matters-When-Using-Milvus" class="common-anchor-header">Porque é que o controlo de acesso é importante quando se usa Milvus<button data-href="#Why-Access-Control-Matters-When-Using-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando as equipas são pequenas e as suas aplicações de IA servem apenas um número limitado de utilizadores, a infraestrutura é normalmente simples. Alguns engenheiros gerem o sistema; o Milvus é utilizado apenas para desenvolvimento ou testes; e os fluxos de trabalho operacionais são simples. Nesta fase inicial, o controlo de acesso raramente parece urgente - porque a superfície de risco é pequena e quaisquer erros podem ser facilmente revertidos.</p>
<p>À medida que o Milvus entra em produção e o número de utilizadores, serviços e operadores aumenta, o modelo de utilização muda rapidamente. Cenários comuns incluem:</p>
<ul>
<li><p>Múltiplos sistemas empresariais que partilham a mesma instância do Milvus</p></li>
<li><p>Múltiplas equipas a aceder às mesmas colecções de vectores</p></li>
<li><p>Dados de teste, preparação e produção coexistindo num único cluster</p></li>
<li><p>Diferentes funções que necessitam de diferentes níveis de acesso, desde consultas apenas de leitura a gravações e controlo operacional</p></li>
</ul>
<p>Sem limites de acesso bem definidos, essas configurações criam riscos previsíveis:</p>
<ul>
<li><p>Os fluxos de trabalho de teste podem eliminar acidentalmente colecções de produção</p></li>
<li><p>Os programadores podem modificar involuntariamente os índices utilizados pelos serviços em funcionamento</p></li>
<li><p>A utilização generalizada da conta <code translate="no">root</code> torna as acções impossíveis de rastrear ou auditar</p></li>
<li><p>Uma aplicação comprometida pode obter acesso ilimitado a todos os dados do vetor</p></li>
</ul>
<p>À medida que a utilização aumenta, confiar em convenções informais ou em contas de administrador partilhadas deixa de ser sustentável. Um modelo de acesso consistente e aplicável torna-se essencial - e é exatamente isso que o RBAC Milvus proporciona.</p>
<h2 id="What-is-RBAC-in-Milvus" class="common-anchor-header">O que é o RBAC em Milvus<button data-href="#What-is-RBAC-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/rbac.md">O RBAC (Role-Based Access Control)</a> é um modelo de permissão que controla o acesso com base em <strong>funções</strong> e não em utilizadores individuais. Em Milvus, o RBAC permite-lhe definir exatamente quais as operações que um utilizador ou serviço está autorizado a realizar - e em que recursos específicos. Ele fornece uma maneira estruturada e escalável de gerenciar a segurança à medida que seu sistema cresce de um único desenvolvedor para um ambiente de produção completo.</p>
<p>O Milvus RBAC é construído em torno dos seguintes componentes principais:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/users_roles_privileges_030620f913.png" alt="Users Roles Privileges" class="doc-image" id="users-roles-privileges" />
   </span> <span class="img-wrapper"> <span>Utilizadores Funções Privilégios</span> </span></p>
<ul>
<li><p><strong>Recurso</strong>: A entidade que está a ser acedida. No Milvus, os recursos incluem a <strong>instância</strong>, a <strong>base de dados</strong> e a <strong>coleção</strong>.</p></li>
<li><p><strong>Privilégio</strong>: Uma operação específica permitida em um recurso - por exemplo, criar uma coleção, inserir dados ou excluir entidades.</p></li>
<li><p><strong>Grupo de privilégios</strong>: Um conjunto predefinido de privilégios relacionados, como "somente leitura" ou "gravação".</p></li>
<li><p><strong>Função</strong>: Uma combinação de privilégios e os recursos aos quais eles se aplicam. Uma função determina <em>quais as</em> operações que podem ser efectuadas e <em>onde</em>.</p></li>
<li><p><strong>Utilizador</strong>: uma identidade no Milvus. Cada utilizador tem um ID único e é-lhe atribuída uma ou mais funções.</p></li>
</ul>
<p>Estes componentes formam uma hierarquia clara:</p>
<ol>
<li><p><strong>Aos utilizadores são atribuídas funções</strong></p></li>
<li><p><strong>As funções definem os privilégios</strong></p></li>
<li><p><strong>Os privilégios aplicam-se a recursos específicos</strong></p></li>
</ol>
<p>Um princípio de conceção chave no Milvus é que <strong>as permissões nunca são atribuídas diretamente aos utilizadores</strong>. Todo o acesso passa por funções. Esta indirecção simplifica a administração, reduz os erros de configuração e torna as alterações de permissões previsíveis.</p>
<p>Este modelo é escalável em implementações reais. Quando vários utilizadores partilham uma função, a atualização dos privilégios da função actualiza instantaneamente as permissões para todos eles - sem modificar cada utilizador individualmente. É um ponto único de controlo alinhado com a forma como as infra-estruturas modernas gerem o acesso.</p>
<h2 id="How-RBAC-Works-in-Milvus" class="common-anchor-header">Como funciona o RBAC no Milvus<button data-href="#How-RBAC-Works-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando um cliente envia um pedido ao Milvus, o sistema avalia-o através de uma série de passos de autorização. Cada etapa deve ser aprovada antes que a operação seja autorizada a prosseguir:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_rbac_works_afe48bc717.png" alt="How RBAC Works in Milvus" class="doc-image" id="how-rbac-works-in-milvus" />
   </span> <span class="img-wrapper"> <span>Como funciona o RBAC em Milvus</span> </span></p>
<ol>
<li><p><strong>Autenticar o pedido:</strong> Milvus verifica primeiro a identidade do utilizador. Se a autenticação falhar, o pedido é rejeitado com um erro de autenticação.</p></li>
<li><p><strong>Verificar a atribuição de funções:</strong> Após a autenticação, o Milvus verifica se o utilizador tem pelo menos uma função atribuída. Se não for encontrada nenhuma função, o pedido é rejeitado com um erro de permissão negada.</p></li>
<li><p><strong>Verificar os privilégios necessários:</strong> O Milvus avalia se a função do utilizador concede o privilégio necessário no recurso alvo. Se a verificação de privilégios falhar, o pedido é rejeitado com um erro de permissão negada.</p></li>
<li><p><strong>Executar a operação:</strong> Se todas as verificações forem aprovadas, o Milvus executa a operação solicitada e devolve o resultado.</p></li>
</ol>
<h2 id="How-to-Configure-Access-Control-via-RBAC-in-Milvus" class="common-anchor-header">Como configurar o controlo de acesso via RBAC no Milvus<button data-href="#How-to-Configure-Access-Control-via-RBAC-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Prerequisites" class="common-anchor-header">1. Pré-requisitos</h3><p>Antes que as regras do RBAC possam ser avaliadas e aplicadas, a autenticação do usuário deve ser ativada para que cada solicitação ao Milvus possa ser associada a uma identidade de usuário específica.</p>
<p>Aqui estão dois métodos de implantação padrão.</p>
<ul>
<li><strong>Implantação com o Docker Compose</strong></li>
</ul>
<p>Se o Milvus for implantado usando o Docker Compose, edite o arquivo de configuração <code translate="no">milvus.yaml</code> e habilite a autorização definindo <code translate="no">common.security.authorizationEnabled</code> para <code translate="no">true</code>:</p>
<pre><code translate="no"><span class="hljs-attr">common</span>:
  <span class="hljs-attr">security</span>:
    <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Implantação com Helm Charts</strong></li>
</ul>
<p>Se o Milvus for implementado com Helm Charts, edite o ficheiro <code translate="no">values.yaml</code> e adicione a seguinte configuração em <code translate="no">extraConfigFiles.user.yaml</code>:</p>
<pre><code translate="no"><span class="hljs-attr">extraConfigFiles</span>:
  user.<span class="hljs-property">yaml</span>: |+
    <span class="hljs-attr">common</span>:
      <span class="hljs-attr">security</span>:
        <span class="hljs-attr">authorizationEnabled</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Initialization" class="common-anchor-header">2. Inicialização</h3><p>Por defeito, o Milvus cria um utilizador <code translate="no">root</code> integrado quando o sistema é iniciado. A palavra-passe predefinida para este utilizador é <code translate="no">Milvus</code>.</p>
<p>Como passo inicial de segurança, utilize o utilizador <code translate="no">root</code> para se ligar ao Milvus e altere imediatamente a palavra-passe predefinida. Recomenda-se vivamente a utilização de uma palavra-passe complexa para evitar o acesso não autorizado.</p>
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
<h3 id="3-Core-Operations" class="common-anchor-header">3. Operações principais</h3><p><strong>Criar utilizadores</strong></p>
<p>Para uma utilização diária, recomenda-se a criação de utilizadores dedicados em vez de utilizar a conta <code translate="no">root</code>.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, password=<span class="hljs-string">&quot;P@ssw0rd&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Criar funções</strong></p>
<p>O Milvus fornece uma função incorporada <code translate="no">admin</code> com todos os privilégios administrativos. No entanto, para a maior parte dos cenários de produção, recomenda-se a criação de funções personalizadas para obter um controlo de acesso mais rigoroso.</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Criar grupos de privilégios</strong></p>
<p>Um grupo de privilégios é uma coleção de vários privilégios. Para simplificar a gestão de permissões, os privilégios relacionados podem ser agrupados e concedidos em conjunto.</p>
<p>O Milvus inclui os seguintes grupos de privilégios incorporados:</p>
<ul>
<li><p><code translate="no">COLL_RO</code>, <code translate="no">COLL_RW</code>, <code translate="no">COLL_ADMIN</code></p></li>
<li><p><code translate="no">DB_RO</code>, <code translate="no">DB_RW</code>, <code translate="no">DB_ADMIN</code></p></li>
<li><p><code translate="no">Cluster_RO</code>, <code translate="no">Cluster_RW</code>, <code translate="no">Cluster_ADMIN</code></p></li>
</ul>
<p>A utilização destes grupos de privilégios integrados pode reduzir significativamente a complexidade da conceção de permissões e melhorar a consistência entre funções.</p>
<p>Pode utilizar diretamente os grupos de privilégios incorporados ou criar grupos de privilégios personalizados, conforme necessário.</p>
<pre><code translate="no"><span class="hljs-comment"># Create a privilege group</span>
client.create_privilege_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>）
<span class="hljs-comment"># Add privileges to the privilege group</span>
client.add_privileges_to_group(group_name=<span class="hljs-string">&#x27;privilege_group_1&#x27;</span>, privileges=[<span class="hljs-string">&#x27;Query&#x27;</span>, <span class="hljs-string">&#x27;Search&#x27;</span>])
<button class="copy-code-btn"></button></code></pre>
<p><strong>Conceder privilégios ou grupos de privilégios a funções</strong></p>
<p>Depois que uma função é criada, os privilégios ou grupos de privilégios podem ser concedidos à função. Os recursos de destino para esses privilégios podem ser especificados em diferentes níveis, incluindo a instância, o banco de dados ou as Coleções individuais.</p>
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
<p><strong>Conceder funções aos utilizadores</strong></p>
<p>Assim que as funções são atribuídas a um utilizador, este pode aceder a recursos e executar as operações definidas por essas funções. A um único utilizador podem ser atribuídas uma ou várias funções, dependendo do âmbito de acesso necessário.</p>
<pre><code translate="no">client.<span class="hljs-title function_">grant_role</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>, role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Inspect-and-Revoke-Access" class="common-anchor-header">4. Inspecionar e revogar o acesso</h3><p><strong>Inspecionar funções atribuídas a um utilizador</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Inspecionar os privilégios atribuídos a uma função</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">describe_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Revogar privilégios de uma função</strong></p>
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
<p><strong>Revogar funções de um utilizador</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">revoke_role</span>(
    user_name=<span class="hljs-string">&#x27;user_1&#x27;</span>,
    role_name=<span class="hljs-string">&#x27;role_a&#x27;</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Eliminar utilizadores e funções</strong></p>
<pre><code translate="no">client.<span class="hljs-title function_">drop_user</span>(user_name=<span class="hljs-string">&quot;user_1&quot;</span>)
client.<span class="hljs-title function_">drop_role</span>(role_name=<span class="hljs-string">&quot;role_a&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Example-Access-Control-Design-for-a-Milvus-Powered-RAG-System" class="common-anchor-header">Exemplo: Conceção do controlo de acesso para um sistema RAG alimentado por Milvus<button data-href="#Example-Access-Control-Design-for-a-Milvus-Powered-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Considere um sistema RAG (Retrieval-Augmented Generation) construído sobre o Milvus.</p>
<p>Neste sistema, diferentes componentes e utilizadores têm responsabilidades claramente separadas, e cada um requer um nível de acesso diferente.</p>
<table>
<thead>
<tr><th>Agente</th><th>Responsabilidade</th><th>Acesso necessário</th></tr>
</thead>
<tbody>
<tr><td>Administrador da plataforma</td><td>Operações e configuração do sistema</td><td>Administração ao nível da instância</td></tr>
<tr><td>Serviço de ingestão de vectores</td><td>Ingestão e atualização de dados vectoriais</td><td>Acesso de leitura e escrita</td></tr>
<tr><td>Serviço de pesquisa</td><td>Pesquisa e recuperação de vectores</td><td>Acesso apenas de leitura</td></tr>
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
<h2 id="Quick-Tips-How-to-Operate-Access-Control-Safely-in-Production" class="common-anchor-header">Dicas rápidas: Como operar o controlo de acesso de forma segura na produção<button data-href="#Quick-Tips-How-to-Operate-Access-Control-Safely-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Para garantir que o controlo de acesso se mantém eficaz e gerível em sistemas de produção de longa duração, siga estas orientações práticas.</p>
<p><strong>1. Altere a</strong> <strong>palavra-passe</strong><strong>predefinida</strong> <code translate="no">root</code> <strong>e limite a utilização da</strong> <strong>conta</strong> <code translate="no">root</code> </p>
<p>Actualize a palavra-passe predefinida <code translate="no">root</code> imediatamente após a inicialização e restrinja a sua utilização apenas a tarefas administrativas. Evite usar ou compartilhar a conta root para operações de rotina. Em vez disso, crie utilizadores e funções dedicados para o acesso diário para reduzir o risco e melhorar a responsabilidade.</p>
<p><strong>2. Isolar fisicamente as instâncias do Milvus entre ambientes</strong></p>
<p>Implemente instâncias separadas do Milvus para desenvolvimento, preparação e produção. O isolamento físico proporciona um limite de segurança mais forte do que o controlo de acesso lógico por si só e reduz significativamente o risco de erros entre ambientes.</p>
<p><strong>3. Siga o princípio do menor privilégio</strong></p>
<p>Conceda apenas as permissões necessárias para cada função:</p>
<ul>
<li><p><strong>Ambientes de desenvolvimento:</strong> as permissões podem ser mais permissivas para apoiar a iteração e os testes</p></li>
<li><p><strong>Ambientes de produção:</strong> as permissões devem ser estritamente limitadas ao que é necessário</p></li>
<li><p><strong>Auditorias regulares:</strong> rever periodicamente as permissões existentes para garantir que ainda são necessárias</p></li>
</ul>
<p><strong>4. Revogar ativamente as permissões quando já não são necessárias</strong></p>
<p>O controlo de acesso não é uma configuração única - requer uma manutenção contínua. Revogue funções e privilégios prontamente quando os utilizadores, serviços ou responsabilidades mudam. Isto evita que as permissões não utilizadas se acumulem ao longo do tempo e se tornem riscos de segurança ocultos.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusão<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>A configuração do controlo de acesso no Milvus não é intrinsecamente complexa, mas é essencial para operar o sistema de forma segura e fiável em produção. Com um modelo RBAC bem concebido, é possível:</p>
<ul>
<li><p><strong>Reduzir o risco</strong> ao evitar operações acidentais ou destrutivas</p></li>
<li><p><strong>Melhorar a segurança</strong>, impondo o acesso de menor privilégio aos dados do vetor</p></li>
<li><p><strong>Padronizar as operações</strong> através de uma separação clara de responsabilidades</p></li>
<li><p><strong>Escalar com confiança</strong>, estabelecendo as bases para implantações multilocatário e em grande escala</p></li>
</ul>
<p>O controlo de acesso não é uma funcionalidade opcional ou uma tarefa pontual. É uma parte fundamental do funcionamento seguro do Milvus a longo prazo.</p>
<p>Comece a criar uma base de segurança sólida com o <a href="https://milvus.io/docs/rbac.md">RBAC</a> para a sua implementação do Milvus.</p>
<p>Tem perguntas ou quer um mergulho profundo em qualquer caraterística do último Milvus? Junte-se ao nosso<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou arquive problemas no<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Também pode reservar uma sessão individual de 20 minutos para obter informações, orientações e respostas às suas perguntas através do<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
