---
id: how-to-build-productionready-ai-agents-with-deep-agents-and-milvus.md
title: Como criar agentes de IA prontos para produção com Deep Agents e Milvus
author: Min Yin
date: 2026-03-02T00:00:00.000Z
cover: assets.zilliz.com/cover_deepagents_b45edd5f94.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Deep Agents, AI agents, Milvus vector database, LangChain agents, persistent
  agent memory
meta_title: |
  How to Build Production-Ready AI Agents with Deep Agents
desc: >-
  Saiba como criar agentes de IA escalonáveis usando Deep Agents e Milvus para
  tarefas de longa execução, custos de token mais baixos e memória persistente.
origin: >-
  https://milvus.io/blog/how-to-build-productionready-ai-agents-with-deep-agents-and-milvus.md
---
<p>Cada vez mais equipas estão a criar agentes de IA e as tarefas que lhes atribuem estão a tornar-se mais complexas. Muitos fluxos de trabalho do mundo real envolvem trabalhos de longa duração com vários passos e muitas chamadas de ferramentas. À medida que estas tarefas aumentam, surgem rapidamente dois problemas: custos de token mais elevados e os limites da janela de contexto do modelo. Os agentes também precisam frequentemente de se lembrar de informações entre sessões, tais como resultados de pesquisas anteriores, preferências do utilizador ou conversas anteriores.</p>
<p>Estruturas como <a href="https://docs.langchain.com/oss/python/deepagents/overview"><strong>Deep Agents</strong></a>, lançadas pela LangChain, ajudam a organizar esses fluxos de trabalho. Fornece uma forma estruturada de executar agentes, com suporte para planeamento de tarefas, acesso a ficheiros e delegação de sub-agentes. Isso facilita a criação de agentes que podem lidar com tarefas longas e de várias etapas de forma mais confiável.</p>
<p>Mas os fluxos de trabalho por si só não são suficientes. Os agentes também precisam de <strong>memória de longo prazo</strong> para que possam recuperar informações úteis de sessões anteriores. É aqui que entra o <a href="https://milvus.io/"><strong>Milvus</strong></a>, uma base de dados vetorial de código aberto. Ao armazenar incorporações de conversas, documentos e resultados de ferramentas, o Milvus permite que os agentes pesquisem e recuperem conhecimentos anteriores.</p>
<p>Neste artigo, explicaremos como o Deep Agents funciona e mostraremos como combiná-lo com o Milvus para criar agentes de IA com fluxos de trabalho estruturados e memória de longo prazo.</p>
<h2 id="What-Is-Deep-Agents" class="common-anchor-header">O que é o Deep Agents?<button data-href="#What-Is-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>O Deep Agents</strong> é uma estrutura de agente de código aberto criada pela equipa LangChain. Ele foi projetado para ajudar os agentes a lidar com tarefas de longa duração e de várias etapas de forma mais confiável. Ele se concentra em três capacidades principais:</p>
<p><strong>1. Planejamento de tarefas</strong></p>
<p>O Deep Agents inclui ferramentas integradas como <code translate="no">write_todos</code> e <code translate="no">read_todos</code>. O agente divide uma tarefa complexa em uma lista de tarefas clara e, em seguida, trabalha em cada item passo a passo, marcando as tarefas como concluídas.</p>
<p><strong>2. Acesso ao sistema de ficheiros</strong></p>
<p>Fornece ferramentas como <code translate="no">ls</code>, <code translate="no">read_file</code>, e <code translate="no">write_file</code>, para que o agente possa ver, ler e escrever ficheiros. Se uma ferramenta produzir uma saída grande, o resultado é automaticamente guardado num ficheiro em vez de permanecer na janela de contexto do modelo. Isto ajuda a evitar que a janela de contexto fique cheia.</p>
<p><strong>3. Delegação de subagentes</strong></p>
<p>Utilizando uma ferramenta <code translate="no">task</code>, o agente principal pode delegar subtarefas a sub-agentes especializados. Cada subagente tem a sua própria janela de contexto e ferramentas, o que ajuda a manter o trabalho organizado.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_59401bc198.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Tecnicamente, um agente criado com <code translate="no">create_deep_agent</code> é um <strong>LangGraph StateGraph</strong> compilado. (LangGraph é a biblioteca de fluxo de trabalho desenvolvida pela equipa LangChain, e StateGraph é a sua estrutura de estado principal). Por isso, os Deep Agents podem usar diretamente os recursos do LangGraph, como saída de streaming, checkpointing e interação humana no loop.</p>
<p><strong>Então, o que torna os Deep Agents úteis na prática?</strong></p>
<p>Tarefas de agente de longa duração geralmente enfrentam problemas como limites de contexto, altos custos de token e execução não confiável. O Deep Agents ajuda a resolver esses problemas, tornando os fluxos de trabalho dos agentes mais estruturados e fáceis de gerenciar. Ao reduzir o crescimento desnecessário do contexto, ele diminui o uso de tokens e mantém as tarefas de longa duração mais econômicas.</p>
<p>Ele também facilita a organização de tarefas complexas e de várias etapas. As subtarefas podem ser executadas de forma independente, sem interferir umas com as outras, o que melhora a fiabilidade. Ao mesmo tempo, o sistema é flexível, permitindo que os desenvolvedores o personalizem e estendam à medida que seus agentes crescem de simples experimentos para aplicativos de produção.</p>
<h2 id="Customization-in-Deep-Agents" class="common-anchor-header">Personalização em Deep Agents<button data-href="#Customization-in-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Um framework geral não pode cobrir todas as necessidades de uma indústria ou negócio. O Deep Agents foi projetado para ser flexível, para que os desenvolvedores possam ajustá-lo para se adequar aos seus próprios casos de uso.</p>
<p>Com a personalização, é possível:</p>
<ul>
<li><p>Conectar suas próprias ferramentas internas e APIs</p></li>
<li><p>Definir fluxos de trabalho específicos do domínio</p></li>
<li><p>Garantir que o agente siga as regras de negócios</p></li>
<li><p>Suportar a partilha de memória e conhecimento entre sessões</p></li>
</ul>
<p>Aqui estão as principais maneiras de personalizar o Deep Agents:</p>
<h3 id="System-Prompt-Customization" class="common-anchor-header">Personalização do prompt do sistema</h3><p>É possível adicionar seu próprio prompt do sistema além das instruções padrão fornecidas pelo middleware. Isso é útil para definir regras de domínio e fluxos de trabalho.</p>
<p>Um bom prompt personalizado pode incluir:</p>
<ul>
<li><strong>Regras de fluxo de trabalho de domínio</strong></li>
</ul>
<p>Exemplo: "Para tarefas de análise de dados, execute sempre a análise exploratória antes de criar um modelo."</p>
<ul>
<li><strong>Exemplos específicos</strong></li>
</ul>
<p>Exemplo: "Combinar pedidos de pesquisa bibliográfica semelhantes num único item de trabalho."</p>
<ul>
<li><strong>Regras de paragem</strong></li>
</ul>
<p>Exemplo: "Parar se forem utilizadas mais de 100 chamadas de ferramentas."</p>
<ul>
<li><strong>Orientação para a coordenação de ferramentas</strong></li>
</ul>
<p>Exemplo: "Use <code translate="no">grep</code> para encontrar locais de código e, em seguida, use <code translate="no">read_file</code> para ver detalhes."</p>
<p>Evite repetir instruções que o middleware já trata e evite adicionar regras que entrem em conflito com o comportamento padrão.</p>
<h3 id="Tools" class="common-anchor-header">Ferramentas</h3><p>Pode adicionar as suas próprias ferramentas ao conjunto de ferramentas incorporado. As ferramentas são definidas como funções Python normais, e suas documentações descrevem o que elas fazem.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">def</span> <span class="hljs-title function_">internet_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Run a web search&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> tavily_client.search(query)
agent = create_deep_agent(tools=[internet_search])
<button class="copy-code-btn"></button></code></pre>
<p>O Deep Agents também suporta ferramentas que seguem o padrão Model Context Protocol (MCP) através de <code translate="no">langchain-mcp-adapters</code>.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_mcp_adapters.client <span class="hljs-keyword">import</span> MultiServerMCPClient
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    mcp_client = MultiServerMCPClient(...)
    mcp_tools = <span class="hljs-keyword">await</span> mcp_client.get_tools()
    agent = create_deep_agent(tools=mcp_tools)
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">for</span> chunk <span class="hljs-keyword">in</span> agent.astream({<span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;...&quot;</span>}]}):
        chunk[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>].pretty_print()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Middleware" class="common-anchor-header">Middleware</h3><p>É possível escrever middleware personalizado para:</p>
<ul>
<li><p>Adicionar ou modificar ferramentas</p></li>
<li><p>Ajustar prompts</p></li>
<li><p>Entrar em diferentes estágios da execução do agente</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_core.tools <span class="hljs-keyword">import</span> tool
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> deepagents.middleware <span class="hljs-keyword">import</span> AgentMiddleware
<span class="hljs-meta">@tool</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_weather</span>(<span class="hljs-params">city: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Get the weather in a city.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;The weather in <span class="hljs-subst">{city}</span> is sunny.&quot;</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">WeatherMiddleware</span>(<span class="hljs-title class_ inherited__">AgentMiddleware</span>):
    tools = [get_weather]
agent = create_deep_agent(middleware=[WeatherMiddleware()])
<button class="copy-code-btn"></button></code></pre>
<p>O Deep Agents também inclui middleware incorporado para planejamento, gerenciamento de subagentes e controle de execução.</p>
<table>
<thead>
<tr><th>Middleware</th><th>Função</th></tr>
</thead>
<tbody>
<tr><td>TodoListMiddleware</td><td>Fornece ferramentas write_todos e read_todos para gerenciar listas de tarefas</td></tr>
<tr><td>FilesystemMiddleware</td><td>Fornece ferramentas de operação de ficheiros e guarda automaticamente resultados de ferramentas de grande dimensão</td></tr>
<tr><td>SubAgentMiddleware</td><td>Fornece a ferramenta de tarefas para delegar trabalho a sub-agentes</td></tr>
<tr><td>SummarizationMiddleware</td><td>Resume automaticamente quando o contexto excede 170k tokens</td></tr>
<tr><td>AnthropicPromptCachingMiddleware</td><td>Ativa o armazenamento em cache de mensagens para modelos Anthropic</td></tr>
<tr><td>PatchToolCallsMiddleware</td><td>Corrige chamadas de ferramenta incompletas causadas por interrupções</td></tr>
<tr><td>HumanInTheLoopMiddleware</td><td>Configura ferramentas que requerem aprovação humana</td></tr>
</tbody>
</table>
<h3 id="Sub-agents" class="common-anchor-header">Sub-agentes</h3><p>O agente principal pode delegar subtarefas a sub-agentes utilizando a ferramenta <code translate="no">task</code>. Cada sub-agente é executado na sua própria janela de contexto e tem as suas próprias ferramentas e prompt do sistema.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
research_subagent = {
    <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;research-agent&quot;</span>,
    <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Used to research in-depth questions&quot;</span>,
    <span class="hljs-string">&quot;prompt&quot;</span>: <span class="hljs-string">&quot;You are an expert researcher&quot;</span>,
    <span class="hljs-string">&quot;tools&quot;</span>: [internet_search],
    <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,  <span class="hljs-comment"># Optional, defaults to main agent model</span>
}
agent = create_deep_agent(subagents=[research_subagent])
<button class="copy-code-btn"></button></code></pre>
<p>Para casos de utilização avançada, pode até passar um fluxo de trabalho LangGraph pré-construído como um sub-agente.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> <span class="hljs-title class_">CompiledSubAgent</span>, create_deep_agent
custom_graph = <span class="hljs-title function_">create_agent</span>(model=..., tools=..., prompt=...)
agent = <span class="hljs-title function_">create_deep_agent</span>(
    subagents=[<span class="hljs-title class_">CompiledSubAgent</span>(
        name=<span class="hljs-string">&quot;data-analyzer&quot;</span>,
        description=<span class="hljs-string">&quot;Specialized agent for data analysis&quot;</span>,
        runnable=custom_graph
    )]
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="interrupton-Human-Approval-Control" class="common-anchor-header"><code translate="no">interrupt_on</code> (Controlo de aprovação humana)</h3><p>É possível especificar determinadas ferramentas que requerem aprovação humana utilizando o parâmetro <code translate="no">interrupt_on</code>. Quando o agente chama uma dessas ferramentas, a execução é interrompida até que uma pessoa a revise e aprove.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_core.tools <span class="hljs-keyword">import</span> tool
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> MemorySaver
<span class="hljs-meta">@tool</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">delete_file</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Delete a file from the filesystem.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;Deleted <span class="hljs-subst">{path}</span>&quot;</span>
agent = create_deep_agent(
    tools=[delete_file],
    interrupt_on={
        <span class="hljs-string">&quot;delete_file&quot;</span>: {
            <span class="hljs-string">&quot;allowed_decisions&quot;</span>: [<span class="hljs-string">&quot;approve&quot;</span>, <span class="hljs-string">&quot;edit&quot;</span>, <span class="hljs-string">&quot;reject&quot;</span>]
        }
    },
    checkpointer=MemorySaver()
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Backend-Customization-Storage" class="common-anchor-header">Personalização de back-end (armazenamento)</h3><p>É possível escolher diferentes backends de armazenamento para controlar a forma como os ficheiros são tratados. As opções atuais incluem:</p>
<ul>
<li><p><strong>StateBackend</strong> (armazenamento temporário)</p></li>
<li><p><strong>FilesystemBackend</strong> (armazenamento em disco local)</p></li>
</ul>
<pre><code translate="no"><span class="hljs-title class_">StoreBackend</span>(persistent storage)、<span class="hljs-title class_">CompositeBackend</span>(hybrid routing)。
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> deepagents.<span class="hljs-property">backends</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">FilesystemBackend</span>
agent = <span class="hljs-title function_">create_deep_agent</span>(
    backend=<span class="hljs-title class_">FilesystemBackend</span>(root_dir=<span class="hljs-string">&quot;/path/to/project&quot;</span>)
)
<button class="copy-code-btn"></button></code></pre>
<p>Ao alterar o backend, é possível ajustar o comportamento do armazenamento de arquivos sem alterar o design geral do sistema.</p>
<h2 id="Why-Use-Deep-Agents-with-Milvus-for-AI-Agents" class="common-anchor-header">Por que usar Deep Agents com Milvus para agentes de IA?<button data-href="#Why-Use-Deep-Agents-with-Milvus-for-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Em aplicações reais, os agentes geralmente precisam de memória que dure entre sessões. Por exemplo, eles podem precisar lembrar as preferências do usuário, desenvolver conhecimento de domínio ao longo do tempo, registrar feedback para ajustar o comportamento ou acompanhar tarefas de pesquisa de longo prazo.</p>
<p>Por padrão, o Deep Agents usa <code translate="no">StateBackend</code>, que armazena dados apenas durante uma única sessão. Quando a sessão termina, tudo é apagado. Isso significa que ele não pode suportar memória de longo prazo e entre sessões.</p>
<p>Para permitir a memória persistente, utilizamos <a href="https://milvus.io/"><strong>o Milvus</strong></a> como base de dados vetorial em conjunto com <code translate="no">StoreBackend</code>. Funciona da seguinte forma: o conteúdo de conversas importantes e os resultados das ferramentas são convertidos em embeddings (vectores numéricos que representam o significado) e armazenados no Milvus. Quando se inicia uma nova tarefa, o agente efectua uma pesquisa semântica para recuperar memórias passadas relacionadas. Isto permite ao agente "recordar" informações relevantes de sessões anteriores.</p>
<p>O Milvus é adequado para este caso de utilização devido à sua arquitetura de separação entre computação e armazenamento. Suporta:</p>
<ul>
<li><p>Escalonamento horizontal para dezenas de milhares de milhões de vectores</p></li>
<li><p>Consultas de alta simultaneidade</p></li>
<li><p>Actualizações de dados em tempo real</p></li>
<li><p>Implantação pronta para produção para sistemas de grande escala</p></li>
</ul>
<p>Tecnicamente, o Deep Agents usa <code translate="no">CompositeBackend</code> para rotear caminhos diferentes para back-ends de armazenamento diferentes:</p>
<table>
<thead>
<tr><th>Caminho</th><th>Backend</th><th>Finalidade</th></tr>
</thead>
<tbody>
<tr><td>/espaço de trabalho/, /temp/</td><td>EstadoBackend</td><td>Dados temporários, apagados após a sessão</td></tr>
<tr><td>/memories/, /knowledge/</td><td>StoreBackend + Milvus</td><td>Dados persistentes, pesquisáveis em todas as sessões</td></tr>
</tbody>
</table>
<p>Com esta configuração, os programadores só precisam de guardar dados de longo prazo em caminhos como <code translate="no">/memories/</code>. O sistema gere automaticamente a memória entre sessões. Os passos de configuração detalhados são fornecidos na secção seguinte.</p>
<h2 id="Hands-on-Build-an-AI-Agent-with-Long-Term-Memory-Using-Milvus-and-Deep-Agents" class="common-anchor-header">Prática: Criar um agente de IA com memória de longo prazo usando Milvus e Deep Agents<button data-href="#Hands-on-Build-an-AI-Agent-with-Long-Term-Memory-Using-Milvus-and-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Este exemplo mostra como fornecer memória persistente a um agente baseado em DeepAgents usando Milvus.</p>
<h3 id="Step-1-Install-dependencies" class="common-anchor-header">Etapa 1: Instalar dependências</h3><pre><code translate="no">pip install deepagents tavily-python langchain-milvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Set-up-the-memory-backend" class="common-anchor-header">Etapa 2: Configurar o back-end de memória</h3><pre><code translate="no"><span class="hljs-keyword">from</span> deepagents.backends <span class="hljs-keyword">import</span> CompositeBackend, StateBackend, StoreBackend
<span class="hljs-keyword">from</span> langchain_milvus.storage <span class="hljs-keyword">import</span> MilvusStore
<span class="hljs-comment"># from langgraph.store.memory import InMemoryStore # for testing only</span>
<span class="hljs-comment"># Configure Milvus storage</span>
milvus_store = MilvusStore(
    collection_name=<span class="hljs-string">&quot;agent_memories&quot;</span>,
    embedding_service=... <span class="hljs-comment"># embedding is required here, or use MilvusStore default configuration</span>
)
backend = CompositeBackend(
    default=StateBackend(),
    routes={<span class="hljs-string">&quot;/memories/&quot;</span>: StoreBackend(store=InMemoryStore())} 
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Create-the-agent" class="common-anchor-header">Etapa 3: Criar o agente</h3><pre><code translate="no"><span class="hljs-keyword">from</span> tavily <span class="hljs-keyword">import</span> TavilyClient
<span class="hljs-keyword">import</span> os
tavily_client = TavilyClient(api_key=os.environ[<span class="hljs-string">&quot;TAVILY_API_KEY&quot;</span>])
<span class="hljs-keyword">def</span> <span class="hljs-title function_">internet_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, max_results: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Perform an internet search&quot;&quot;&quot;</span>
    results = tavily_client.search(query, max_results=max_results)
    <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n&quot;</span>.join([<span class="hljs-string">f&quot;<span class="hljs-subst">{r[<span class="hljs-string">&#x27;title&#x27;</span>]}</span>: <span class="hljs-subst">{r[<span class="hljs-string">&#x27;content&#x27;</span>]}</span>&quot;</span> <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-string">&quot;results&quot;</span>]])
agent = create_deep_agent(
    tools=[internet_search],
    system_prompt=<span class="hljs-string">&quot;You are a research expert. Write important findings to the /memories/ directory for cross-session reuse.&quot;</span>,
    backend=backend
)
<span class="hljs-comment"># Run the agent</span>
result = agent.invoke({
    <span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Research the technical features of the Milvus vector database&quot;</span>}]
})
<button class="copy-code-btn"></button></code></pre>
<p><strong>Pontos-chave</strong></p>
<ul>
<li><strong>Caminho persistente</strong></li>
</ul>
<p>Todos os ficheiros guardados em <code translate="no">/memories/</code> serão armazenados permanentemente e podem ser acedidos em diferentes sessões.</p>
<ul>
<li><strong>Configuração de produção</strong></li>
</ul>
<p>O exemplo usa <code translate="no">InMemoryStore()</code> para testes. Na produção, substitua-o por um adaptador Milvus para permitir a pesquisa semântica escalável.</p>
<ul>
<li><strong>Memória automática</strong></li>
</ul>
<p>O agente guarda automaticamente os resultados da investigação e os resultados importantes na pasta <code translate="no">/memories/</code>. Em tarefas posteriores, ele pode pesquisar e recuperar informações passadas relevantes.</p>
<h2 id="Built-in-Tools-Overview" class="common-anchor-header">Visão geral das ferramentas incorporadas<button data-href="#Built-in-Tools-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>O Deep Agents inclui várias ferramentas integradas, fornecidas por meio de middleware. Elas se dividem em três grupos principais:</p>
<h3 id="Task-Management-TodoListMiddleware" class="common-anchor-header">Gerenciamento de tarefas (<code translate="no">TodoListMiddleware</code>)</h3><ul>
<li><code translate="no">write_todos</code></li>
</ul>
<p>Cria uma lista de tarefas estruturada. Cada tarefa pode incluir uma descrição, prioridade e dependências.</p>
<ul>
<li><code translate="no">read_todos</code></li>
</ul>
<p>Mostra a lista de tarefas atual, incluindo tarefas concluídas e pendentes.</p>
<h3 id="File-System-Tools-FilesystemMiddleware" class="common-anchor-header">Ferramentas do sistema de ficheiros (<code translate="no">FilesystemMiddleware</code>)</h3><ul>
<li><code translate="no">ls</code></li>
</ul>
<p>Lista os arquivos em um diretório. Deve usar um caminho absoluto (começando com <code translate="no">/</code>).</p>
<ul>
<li><code translate="no">read_file</code></li>
</ul>
<p>Lê o conteúdo do ficheiro. Suporta <code translate="no">offset</code> e <code translate="no">limit</code> para ficheiros grandes.</p>
<ul>
<li><code translate="no">write_file</code></li>
</ul>
<p>Cria ou sobrescreve um arquivo.</p>
<ul>
<li><code translate="no">edit_file</code></li>
</ul>
<p>Substitui texto específico dentro de um arquivo.</p>
<ul>
<li><code translate="no">glob</code></li>
</ul>
<p>Encontra ficheiros utilizando padrões, tais como <code translate="no">**/*.py</code> para procurar todos os ficheiros Python.</p>
<ul>
<li><code translate="no">grep</code></li>
</ul>
<p>Procura por texto dentro de ficheiros.</p>
<ul>
<li><code translate="no">execute</code></li>
</ul>
<p>Executa comandos shell num ambiente sandbox. Requer que o backend suporte <code translate="no">SandboxBackendProtocol</code>.</p>
<h3 id="Sub-agent-Delegation-SubAgentMiddleware" class="common-anchor-header">Delegação de subagente (<code translate="no">SubAgentMiddleware</code>)</h3><ul>
<li><code translate="no">task</code></li>
</ul>
<p>Envia uma subtarefa para um sub-agente específico. O utilizador fornece o nome do sub-agente e a descrição da tarefa.</p>
<h3 id="How-Tool-Outputs-Are-Handled" class="common-anchor-header">Como são tratadas as saídas das ferramentas</h3><p>Se uma ferramenta gerar um resultado grande, o Deep Agents o salvará automaticamente em um arquivo.</p>
<p>Por exemplo, se <code translate="no">internet_search</code> retornar 100KB de conteúdo, o sistema o salvará em algo como <code translate="no">/tool_results/internet_search_1.txt</code>. O agente mantém apenas o caminho do arquivo em seu contexto. Isso reduz o uso de Token e mantém a janela de contexto pequena.</p>
<h2 id="DeepAgents-vs-Agent-Builder-When-Should-You-Use-Each" class="common-anchor-header">DeepAgents vs. Agent Builder: Quando você deve usar cada um?<button data-href="#DeepAgents-vs-Agent-Builder-When-Should-You-Use-Each" class="anchor-icon" translate="no">
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
    </button></h2><p><em>Como este artigo se concentra no DeepAgents, também é útil entender como ele se compara ao</em> <a href="https://www.langchain.com/langsmith/agent-builder"><em>Agent Builder</em></a><em>, outra opção de criação de agentes no ecossistema LangChain.</em></p>
<p>A LangChain oferece várias maneiras de criar agentes de IA, e a melhor escolha geralmente depende de quanto controle você deseja sobre o sistema.</p>
<p><strong>O DeepAgents</strong> foi concebido para a construção de agentes autónomos que lidam com tarefas de longa duração e de várias etapas. Ele dá aos desenvolvedores controle total sobre como o agente planeja tarefas, usa ferramentas e gerencia a memória. Por ser construído sobre LangGraph, é possível personalizar componentes, integrar ferramentas Python e modificar o backend de armazenamento. Isso torna o DeepAgents uma boa opção para fluxos de trabalho complexos e sistemas de produção em que a confiabilidade e a flexibilidade são importantes.</p>
<p><strong>O Agent Builder</strong>, por outro lado, concentra-se na facilidade de uso. Ele oculta a maioria dos detalhes técnicos, para que seja possível descrever um agente, adicionar ferramentas e executá-lo rapidamente. A memória, a utilização de ferramentas e as etapas de aprovação humana são tratadas automaticamente. Isso torna o Agent Builder útil para protótipos rápidos, ferramentas internas ou experimentos iniciais.</p>
<p><strong>O Agent Builder e o DeepAgents não são sistemas separados - eles fazem parte da mesma pilha.</strong> O Agent Builder é construído sobre o DeepAgents. Muitas equipas começam com o Agent Builder para testar ideias e depois mudam para o DeepAgents quando precisam de mais controlo. Os fluxos de trabalho criados com o DeepAgents também podem ser transformados em modelos do Agent Builder para que outros possam reutilizá-los facilmente.</p>
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
    </button></h2><p>O Deep Agents torna fluxos de trabalho de agentes complexos mais fáceis de gerenciar usando três ideias principais: planejamento de tarefas, armazenamento de arquivos e delegação de subagentes. Esses mecanismos transformam processos confusos e de várias etapas em fluxos de trabalho estruturados. Quando combinado com o Milvus para pesquisa vetorial, o agente também pode manter a memória de longo prazo entre sessões.</p>
<p>Para os programadores, isto significa custos de Token mais baixos e um sistema mais fiável que pode passar de uma simples demonstração para um ambiente de produção.</p>
<p>Se estiver a criar agentes de IA que necessitem de fluxos de trabalho estruturados e de memória real de longo prazo, gostaríamos de falar consigo.</p>
<p>Tem dúvidas sobre Deep Agents ou sobre o uso do Milvus como backend de memória persistente? Junte-se ao nosso <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canal Slack</a> ou reserve uma sessão de 20 minutos <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">do Milvus Office Hours</a> para discutir seu caso de uso.</p>
