---
id: anthropic-managed-agents-memory-milvus.md
title: >-
  Como adicionar memória de longo prazo aos agentes gerenciados do Anthropic com
  Milvus
author: Min Yin
date: 2026-4-21
cover: assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_1_d3e5055603.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  anthropic managed agents, long-term memory, agent memory, milvus, vector
  database
meta_title: |
  Add Long-Term Memory to Anthropic's Managed Agents with Milvus
desc: >-
  Os Managed Agents do Anthropic tornaram os agentes fiáveis, mas todas as
  sessões começam em branco. Veja como emparelhar o Milvus para recuperação
  semântica dentro de uma sessão e memória compartilhada entre agentes.
origin: 'https://milvus.io/blog/anthropic-managed-agents-memory-milvus.md'
---
<p>Os <a href="https://www.anthropic.com/engineering/managed-agents">Managed Agents</a> da Anthropic tornam a infraestrutura de agentes resiliente. Uma tarefa de 200 passos agora sobrevive a uma falha no harness, a um timeout de sandbox ou a uma mudança de infraestrutura no meio do voo sem intervenção humana, e o Anthropic relata que o tempo p50 até o primeiro token caiu cerca de 60% e o p95 caiu mais de 90% após o desacoplamento.</p>
<p>O que a fiabilidade não resolve é a memória. Uma migração de código de 200 passos que atinge um novo conflito de dependência no passo 201 não pode olhar eficientemente para trás e ver como lidou com o último. Um agente que executa análises de vulnerabilidades para um cliente não faz ideia de que outro agente já resolveu o mesmo caso há uma hora. Cada sessão começa numa página em branco e os cérebros paralelos não têm acesso ao que os outros já resolveram.</p>
<p>A solução é emparelhar a <a href="https://milvus.io/">base de dados vetorial do Milvus</a> com os Managed Agents do Anthropic: recuperação semântica dentro de uma sessão e uma <a href="https://milvus.io/docs/milvus_for_agents.md">camada de memória vetorial</a> partilhada entre sessões. O contrato de sessão permanece inalterado, o arnês recebe uma nova camada e as tarefas de agente de longo prazo recebem capacidades qualitativamente diferentes.</p>
<h2 id="What-Managed-Agents-Solved-and-What-They-Didnt" class="common-anchor-header">O que os agentes gerenciados resolveram (e o que não resolveram)<button data-href="#What-Managed-Agents-Solved-and-What-They-Didnt" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Os agentes gerenciados resolveram o problema da confiabilidade ao separar o agente em três módulos independentes. O que não resolveram foi a memória, quer como recordação semântica numa única sessão, quer como experiência partilhada em sessões paralelas.</strong> Aqui está o que foi desacoplado e onde a lacuna de memória se encontra dentro desse design desacoplado.</p>
<table>
<thead>
<tr><th>Módulo</th><th>O que ele faz</th></tr>
</thead>
<tbody>
<tr><td><strong>Sessão</strong></td><td>Um registo de eventos apenas anexado de tudo o que aconteceu. Armazenado fora do harness.</td></tr>
<tr><td><strong>Arnês</strong></td><td>O ciclo que chama o Claude e encaminha as chamadas de ferramentas do Claude para a infraestrutura relevante.</td></tr>
<tr><td><strong>Caixa de areia</strong></td><td>O ambiente de execução isolado onde o Claude executa código e edita ficheiros.</td></tr>
</tbody>
</table>
<p>A reformulação que faz esse design funcionar é declarada explicitamente no post do Anthropic:</p>
<p><em>"A sessão não é a janela de contexto do Claude."</em></p>
<p>A janela de contexto é efémera: limitada em tokens, reconstruída por cada chamada de modelo e descartada quando a chamada regressa. A sessão é durável, armazenada fora do arnês, e representa o sistema de registo para toda a tarefa.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_3_edae1b022d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Quando um arnês falha, a plataforma inicia um novo com <code translate="no">wake(sessionId)</code>. O novo arnês lê o registo de eventos através de <code translate="no">getSession(id)</code> e a tarefa é retomada a partir do último passo gravado, sem lógica de recuperação personalizada para escrever e sem ter de operar uma babysitting ao nível da sessão.</p>
<p>O que o post sobre agentes gerenciados não aborda, e não pretende abordar, é o que o agente faz quando precisa se lembrar de alguma coisa. Duas lacunas aparecem no momento em que você empurra cargas de trabalho reais através da arquitetura. Uma vive dentro de uma única sessão; a outra vive entre sessões.</p>
<h2 id="Problem-1-Why-Linear-Session-Logs-Fail-Past-a-Few-Hundred-Steps" class="common-anchor-header">Problema 1: Por que os logs de sessão linear falham após algumas centenas de etapas<button data-href="#Problem-1-Why-Linear-Session-Logs-Fail-Past-a-Few-Hundred-Steps" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Os logs de sessão linear falham após algumas centenas de etapas porque as leituras sequenciais e a pesquisa semântica são cargas de trabalho fundamentalmente diferentes, e a</strong> <strong>API</strong> <code translate="no">**getEvents()**</code> <strong>atende apenas à primeira.</strong> O fatiamento por posição ou a busca por um carimbo de data/hora é suficiente para responder "onde esta sessão parou". Não é suficiente para responder à pergunta que um agente precisará previsivelmente em qualquer tarefa longa: já vimos este tipo de problema antes e o que fizemos para o resolver?</p>
<p>Considere uma migração de código na etapa 200 que atinge um novo conflito de dependência. O movimento natural é olhar para trás. O agente deparou-se com algo semelhante anteriormente nesta mesma tarefa? Que abordagem foi tentada? Ela se manteve ou regrediu para outra coisa a jusante?</p>
<p>Com <code translate="no">getEvents()</code> há duas maneiras de responder a isso, e ambas são ruins:</p>
<table>
<thead>
<tr><th>Opção</th><th>Problema</th></tr>
</thead>
<tbody>
<tr><td>Analisar cada evento sequencialmente</td><td>Lento a 200 passos. Insustentável a 2.000.</td></tr>
<tr><td>Colocar uma grande fatia do fluxo na janela de contexto</td><td>Dispendioso em tokens, pouco fiável em escala e afasta a memória de trabalho real do agente para a etapa atual.</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_4_2ac29b32af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A sessão é boa para recuperação e auditoria, mas não foi construída com um índice que suporta "já vi isto antes". As tarefas de longo prazo são onde essa pergunta deixa de ser opcional.</p>
<h2 id="Solution-1-How-to-Add-Semantic-Memory-to-a-Managed-Agents-Session" class="common-anchor-header">Solução 1: Como adicionar memória semântica à sessão de um agente gerido<button data-href="#Solution-1-How-to-Add-Semantic-Memory-to-a-Managed-Agents-Session" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Adicione uma coleção Milvus ao lado do registo de sessão e escreva duas vezes a partir de</strong> <code translate="no">**emitEvent**</code>. O contrato de sessão permanece intacto e o harness ganha uma consulta semântica sobre o seu próprio passado.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_5_404a1048aa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O projeto do Anthropic deixa espaço para exatamente isso. O post deles afirma que "qualquer evento buscado também pode ser transformado no harness antes de ser passado para a janela de contexto do Claude. Essas transformações podem ser qualquer coisa que o chicote codifique, incluindo organização de contexto... e engenharia de contexto". A engenharia de contexto reside no arnês; a sessão só tem de garantir a durabilidade e a possibilidade de consulta.</p>
<p>O padrão: sempre que <code translate="no">emitEvent</code> dispara, o arnês também calcula uma <a href="https://zilliz.com/learn/everything-you-need-to-know-about-vector-embeddings">incorporação vetorial</a> para eventos que valem a pena indexar e insere-os numa coleção Milvus.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># Only index high-signal events. Tool retries and intermediate states are noise.</span>
INDEXABLE_EVENT_TYPES = {<span class="hljs-string">&quot;decision&quot;</span>, <span class="hljs-string">&quot;strategy&quot;</span>, <span class="hljs-string">&quot;resolution&quot;</span>, <span class="hljs-string">&quot;error_handling&quot;</span>}

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">emit_event</span>(<span class="hljs-params">session_id: <span class="hljs-built_in">str</span>, event: <span class="hljs-built_in">dict</span></span>):
    <span class="hljs-comment"># Original path: append to the session event stream.</span>
    <span class="hljs-keyword">await</span> session_store.append(session_id, event)

    <span class="hljs-comment"># Extended path: embed the event content and insert into Milvus.</span>
    <span class="hljs-keyword">if</span> event[<span class="hljs-string">&quot;type&quot;</span>] <span class="hljs-keyword">in</span> INDEXABLE_EVENT_TYPES:
        embedding = <span class="hljs-keyword">await</span> embed(event[<span class="hljs-string">&quot;content&quot;</span>])
        milvus_client.insert(
            collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>,
            data=[{
                <span class="hljs-string">&quot;vector&quot;</span>:     embedding,
                <span class="hljs-string">&quot;session_id&quot;</span>: session_id,
                <span class="hljs-string">&quot;step&quot;</span>:       event[<span class="hljs-string">&quot;step&quot;</span>],
                <span class="hljs-string">&quot;event_type&quot;</span>: event[<span class="hljs-string">&quot;type&quot;</span>],
                <span class="hljs-string">&quot;content&quot;</span>:    event[<span class="hljs-string">&quot;content&quot;</span>],
            }]
        )
<button class="copy-code-btn"></button></code></pre>
<p>Quando o agente chega ao passo 200 e precisa de recordar decisões anteriores, a consulta é uma <a href="https://zilliz.com/glossary/vector-similarity-search">pesquisa vetorial</a> com o âmbito dessa sessão:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">recall_similar</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, session_id: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>):
    query_vector = <span class="hljs-keyword">await</span> embed(query)
    results = milvus_client.search(
        collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>,
        data=[query_vector],
        <span class="hljs-built_in">filter</span>=<span class="hljs-string">f&#x27;session_id == &quot;<span class="hljs-subst">{session_id}</span>&quot;&#x27;</span>,
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;step&quot;</span>, <span class="hljs-string">&quot;event_type&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>]
    )
    <span class="hljs-keyword">return</span> results[<span class="hljs-number">0</span>]  <span class="hljs-comment"># top_k most relevant past events</span>
<button class="copy-code-btn"></button></code></pre>
<p>Três pormenores de produção são importantes antes de este processo ser iniciado:</p>
<ul>
<li><strong>Escolher o que indexar.</strong> Nem todos os eventos merecem uma incorporação. Os estados intermédios das chamadas de ferramentas, os registos de repetição e os eventos de estado repetitivos poluem a qualidade da recuperação mais rapidamente do que a melhoram. A política do <code translate="no">INDEXABLE_EVENT_TYPES</code> é dependente da tarefa, não global.</li>
<li><strong>Defina o limite de consistência.</strong> Se o arnês falhar entre a anexação da sessão e a inserção do Milvus, uma camada está brevemente à frente da outra. A janela é pequena mas real. Escolha um caminho de reconciliação (tentar novamente ao reiniciar, escrever no registo ou uma eventual reconciliação) em vez de esperar.</li>
<li><strong>Controlar o gasto de incorporação.</strong> Uma sessão de 200 passos que chama uma API de incorporação externa de forma síncrona em cada passo produz uma fatura que ninguém planeou. Coloque as incorporações em fila e envie-as de forma assíncrona em lotes.</li>
</ul>
<p>Com estes elementos, a recuperação demora milissegundos para a pesquisa de vectores e menos de 100 ms para a chamada de incorporação. Os cinco eventos passados mais relevantes aparecem no contexto antes que o agente perceba o atrito. A sessão mantém o seu trabalho original como registo duradouro; o arnês ganha a capacidade de consultar o seu próprio passado semanticamente em vez de sequencialmente. Essa é uma mudança modesta na superfície da API e uma mudança estrutural no que o agente pode fazer em tarefas de longo prazo.</p>
<h2 id="Problem-2-Why-Parallel-Claude-Agents-Cant-Share-Experience" class="common-anchor-header">Problema 2: Por que agentes Claude paralelos não podem compartilhar experiências<button data-href="#Problem-2-Why-Parallel-Claude-Agents-Cant-Share-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Os agentes paralelos do Claude não podem compartilhar experiências porque as sessões dos agentes gerenciados são isoladas por design. O mesmo isolamento que torna o escalonamento horizontal limpo também impede que cada cérebro aprenda com todos os outros cérebros.</strong></p>
<p>Em um arnês desacoplado, os cérebros não têm estado e são independentes. Esse isolamento desbloqueia os ganhos de latência dos relatórios Anthropic e também mantém todas as sessões em execução no escuro sobre todas as outras sessões.</p>
<p>O agente A passa 40 minutos a diagnosticar um vetor de injeção de SQL complicado para um cliente. Uma hora depois, o Agente B pega no mesmo caso para um cliente diferente e passa os seus próprios 40 minutos a percorrer os mesmos becos sem saída, a executar as mesmas chamadas de ferramentas e a chegar à mesma resposta.</p>
<p>Para um único utilizador que executa um agente ocasional, isto é computação desperdiçada. Para uma plataforma que executa dezenas de <a href="https://zilliz.com/glossary/ai-agents">agentes de IA</a> simultâneos na revisão de código, análises de vulnerabilidades e geração de documentação para diferentes clientes todos os dias, o custo aumenta estruturalmente.</p>
<p>Se a experiência que cada sessão produz se evapora no momento em que a sessão termina, a inteligência é descartável. Uma plataforma construída dessa forma escala linearmente, mas não melhora em nada com o tempo, como fazem os engenheiros humanos.</p>
<h2 id="Solution-2-How-to-Build-a-Shared-Agent-Memory-Pool-with-Milvus" class="common-anchor-header">Solução 2: Como criar um pool de memória de agente partilhado com o Milvus<button data-href="#Solution-2-How-to-Build-a-Shared-Agent-Memory-Pool-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Construir uma coleção de vectores que cada harness lê no arranque e grava no encerramento, particionada por inquilino, para que a experiência se acumule nas sessões sem vazar entre clientes.</strong></p>
<p>Quando uma sessão termina, as principais decisões, os problemas encontrados e as abordagens que funcionaram são transferidos para a coleção Milvus partilhada. Quando um novo cérebro é inicializado, o arnês executa uma consulta semântica como parte da configuração e injeta na janela de contexto as experiências passadas mais importantes. O primeiro passo do novo agente herda as lições de todos os agentes anteriores.</p>
<p>Duas decisões de engenharia levam isto do protótipo à produção.</p>
<h3 id="Isolating-Tenants-with-the-Milvus-Partition-Key" class="common-anchor-header">Isolamento de inquilinos com a chave de partição Milvus</h3><p><strong>Partição por</strong> <code translate="no">**tenant_id**</code>,<strong> e as experiências do agente do Cliente A não vivem fisicamente na mesma partição que as do Cliente B. Trata-se de um isolamento na camada de dados e não de uma convenção de consulta.</strong></p>
<p>O trabalho do cérebro A na base de código da empresa A nunca deve ser recuperado pelos agentes da empresa B. A <a href="https://milvus.io/docs/use-partition-key.md">chave de partição</a> do Milvus trata disso numa única coleção, sem uma segunda coleção por inquilino e sem lógica de fragmentação no código da aplicação.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Declare partition key at schema creation.</span>
schema.add_field(
    field_name=<span class="hljs-string">&quot;tenant_id&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">64</span>,
    is_partition_key=<span class="hljs-literal">True</span>   <span class="hljs-comment"># Automatic per-tenant partitioning.</span>
)

<span class="hljs-comment"># Every query filters by tenant. Isolation is automatic.</span>
results = milvus_client.search(
    collection_name=<span class="hljs-string">&quot;shared_agent_memory&quot;</span>,
    data=[query_vector],
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">f&#x27;tenant_id == &quot;<span class="hljs-subst">{current_tenant}</span>&quot;&#x27;</span>,
    limit=<span class="hljs-number">5</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;step&quot;</span>, <span class="hljs-string">&quot;session_id&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>As experiências dos agentes do cliente A nunca aparecem nas consultas do cliente B, não porque o filtro de consulta esteja escrito corretamente (embora tenha de estar), mas porque os dados não se encontram fisicamente na mesma partição que os do cliente B. Uma coleção para operar, isolamento lógico aplicado na camada de consulta, isolamento físico aplicado na camada de partição.</p>
<p>Veja os <a href="https://milvus.io/docs/multi_tenancy.md">documentos de estratégias de multilocação</a> para saber quando a chave de partição se encaixa versus quando coleções ou bancos de dados separados se encaixam, e o <a href="https://milvus.io/blog/build-multi-tenancy-rag-with-milvus-best-practices-part-one.md">guia de padrões RAG de multilocação</a> para notas de implantação de produção.</p>
<h3 id="Why-Agent-Memory-Quality-Needs-Ongoing-Work" class="common-anchor-header">Por que a qualidade da memória do agente precisa de trabalho contínuo</h3><p><strong>A qualidade da memória é corroída com o tempo: soluções alternativas falhas que tiveram sucesso uma vez são reproduzidas e reforçadas, e entradas obsoletas ligadas a dependências obsoletas continuam enganando os agentes que as herdam. As defesas são programas operacionais, não caraterísticas da base de dados.</strong></p>
<p>Um agente se depara com uma solução alternativa defeituosa que foi bem-sucedida uma vez. Ela é escrita no pool compartilhado. O agente seguinte recupera-o, repete-o e reforça o mau padrão com um segundo registo de utilização "bem sucedida".</p>
<p>As entradas obsoletas seguem uma versão mais lenta do mesmo caminho. Uma correção fixada a uma versão de dependência que foi descontinuada há seis meses continua a ser recuperada e continua a induzir em erro os agentes que a herdam. Quanto mais antigo e mais usado o pool, mais isso se acumula.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/anthropic_managed_agents_memory_milvus_md_6_24f71b1c21.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Três programas operacionais defendem contra isso:</p>
<ul>
<li><strong>Pontuação de confiança.</strong> Monitoriza a frequência com que uma memória foi aplicada com êxito em sessões a jusante. Decaimento de entradas que falham na repetição. Promover entradas que tenham sucesso repetidamente.</li>
<li><strong>Ponderação de tempo.</strong> Prefere experiências recentes. Retirar entradas que ultrapassam um limite conhecido de obsolescência, muitas vezes vinculado a grandes saltos de versão de dependência.</li>
<li><strong>Controlos humanos.</strong> As entradas com alta frequência de recuperação são de alta alavancagem. Quando uma delas está errada, está errada muitas vezes, e é aí que a revisão humana dá o retorno mais rápido.</li>
</ul>
<p>Milvus sozinho não resolve isso, nem Mem0, Zep ou qualquer outro produto de memória. A aplicação de um pool com muitos inquilinos e zero fugas entre inquilinos é algo que se projecta uma vez. Manter esse pool preciso, atualizado e útil é um trabalho operacional contínuo que nenhum banco de dados vem pré-configurado.</p>
<h2 id="Takeaways-What-Milvus-Adds-to-Anthropics-Managed-Agents" class="common-anchor-header">Conclusões: O que o Milvus acrescenta aos Managed Agents da Anthropic<button data-href="#Takeaways-What-Milvus-Adds-to-Anthropics-Managed-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>O Milvus transforma os Managed Agents de uma plataforma confiável, mas esquecível, em uma plataforma que compõe a experiência ao longo do tempo, adicionando recuperação semântica dentro de uma sessão e memória compartilhada entre agentes.</strong></p>
<p>Os Managed Agents responderam à questão da fiabilidade de forma clara: tanto o cérebro como as mãos são gado e qualquer um deles pode morrer sem levar a tarefa consigo. Esse é o problema da infraestrutura, e o Anthropic resolveu-o bem.</p>
<p>O que ficou em aberto foi o crescimento. Os engenheiros humanos vão-se compondo com o tempo; anos de trabalho transformam-se em reconhecimento de padrões e não raciocinam a partir dos primeiros princípios em todas as tarefas. Os agentes geridos de hoje não o fazem, porque cada sessão começa numa página em branco.</p>
<p>Ligar a sessão ao Milvus para uma recuperação semântica dentro de uma tarefa e reunir a experiência de todos os cérebros numa coleção de vectores partilhada é o que dá aos agentes um passado que podem realmente utilizar. A ligação ao Milvus é a parte da infraestrutura; a poda de memórias erradas, a eliminação de memórias obsoletas e a imposição de limites aos inquilinos é a parte operacional. Uma vez que ambos estejam implementados, a forma da memória deixa de ser um passivo e começa a ser um capital composto.</p>
<h2 id="Get-Started" class="common-anchor-header">Começar<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><strong>Experimente localmente:</strong> crie uma instância incorporada do Milvus com o <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>. Sem Docker, sem cluster, apenas <code translate="no">pip install pymilvus</code>. As cargas de trabalho de produção passam para o <a href="https://milvus.io/docs/install_standalone-docker.md">Milvus Standalone ou Distributed</a> quando precisar delas.</li>
<li><strong>Leia a justificativa do projeto:</strong> O <a href="https://www.anthropic.com/engineering/managed-agents">post de engenharia</a> do Anthropic's <a href="https://www.anthropic.com/engineering/managed-agents">Managed Agents</a> analisa a sessão, o harness e o desacoplamento de sandbox em profundidade.</li>
<li><strong>Tem perguntas?</strong> Junte-se à comunidade <a href="https://discord.com/invite/8uyFbECzPX">do Milvus Discord</a> para discussões sobre o design da memória do agente ou reserve uma sessão <a href="https://milvus.io/office-hours">do Milvus Office Hours</a> para analisar a sua carga de trabalho.</li>
<li><strong>Prefere ser gerido?</strong> <a href="https://cloud.zilliz.com/signup">Registe-se no Zilliz Cloud</a> (ou inicie <a href="https://cloud.zilliz.com/login">sessão</a>) para obter um Milvus alojado com chaves de partição, escalabilidade e multi-tenancy incorporados. As novas contas recebem créditos gratuitos num e-mail de trabalho.</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Perguntas frequentes<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>P: Qual é a diferença entre uma sessão e uma janela de contexto nos agentes geridos do Anthropic?</strong></p>
<p>A janela de contexto é o conjunto efémero de tokens que uma única chamada Claude vê. Ela é limitada e é redefinida por invocação de modelo. A sessão é o registo de eventos durável, apenas anexado, de tudo o que aconteceu em toda a tarefa, armazenado fora do sistema. Quando um equipamento falha, <code translate="no">wake(sessionId)</code> gera um novo equipamento que lê o registo da sessão e retoma. A sessão é o sistema de registo; a janela de contexto é a memória de trabalho. A sessão não é a janela de contexto.</p>
<p><strong>P: Como faço para persistir a memória do agente em sessões do Claude?</strong></p>
<p>A sessão em si já é persistente; é isso que o <code translate="no">getSession(id)</code> recupera. O que normalmente falta é a memória de longo prazo consultável. O padrão é incorporar eventos de alto sinal (decisões, resoluções, estratégias) em um banco de dados vetorial como o Milvus durante <code translate="no">emitEvent</code>, e depois consultar por similaridade semântica no momento da recuperação. Isto dá-lhe tanto o registo de sessão duradouro que o Anthropic fornece como uma camada de recuperação semântica para olhar para trás através de centenas de passos.</p>
<p><strong>P: Vários agentes Claude podem compartilhar memória?</strong></p>
<p>Não de imediato. Cada sessão de agentes gerenciados é isolada por design, o que permite que eles sejam escalonados horizontalmente. Para compartilhar a memória entre agentes, adicione uma coleção de vetores compartilhados (por exemplo, no Milvus) que cada harness lê na inicialização e grava no desligamento. Use o recurso de chave de partição do Milvus para isolar locatários para que as memórias do agente do Cliente A nunca vazem para as sessões do Cliente B.</p>
<p><strong>P: Qual é o melhor banco de dados vetorial para memória de agente de IA?</strong></p>
<p>A resposta honesta depende da escala e da forma de implantação. Para protótipos e pequenas cargas de trabalho, uma opção incorporada local como o Milvus Lite é executada no processo sem infraestrutura. Para agentes de produção em muitos inquilinos, você quer um banco de dados com multi-tenancy maduro (chaves de partição, pesquisa filtrada), pesquisa híbrida (vetor + escalar + palavra-chave) e latência de milissegundos em milhões de vetores. O Milvus foi criado especificamente para cargas de trabalho vetoriais nessa escala, e é por isso que ele aparece em sistemas de memória de agente de produção criados em LangChain, Google ADK, Deep Agents e OpenAgents.</p>
