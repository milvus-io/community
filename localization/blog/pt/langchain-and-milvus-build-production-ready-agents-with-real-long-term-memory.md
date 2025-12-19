---
id: >-
  langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md
title: >-
  LangChain 1.0 e Milvus: Como construir agentes prontos para produção com
  memória de longo prazo real
author: Min Yin
date: 2025-12-19T00:00:00.000Z
cover: assets.zilliz.com/langchain1_0_cover_8c4bc608af.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, LangChain 1.0, AI Agent, vector database, LangGraph'
meta_title: >
  LangChain 1.0 and Milvus: Build Production-Ready AI Agents with Long-Term
  Memory
desc: >-
  Descubra como o LangChain 1.0 simplifica a arquitetura do agente e como o
  Milvus adiciona memória de longo prazo para aplicações de IA escaláveis e
  prontas para produção.
origin: >-
  https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md
---
<p>A LangChain é uma estrutura popular de código aberto para o desenvolvimento de aplicações baseadas em grandes modelos de linguagem (LLM). Fornece um conjunto de ferramentas modulares para a construção de agentes de raciocínio e de utilização de ferramentas, ligando modelos a dados externos e gerindo fluxos de interação.</p>
<p>Com o lançamento do <strong>LangChain 1.0</strong>, a estrutura dá um passo em direção a uma arquitetura mais favorável à produção. A nova versão substitui a anterior conceção baseada em cadeias por um ciclo ReAct normalizado (Raciocínio → Chamada de ferramenta → Observar → Decidir) e introduz Middleware para gerir a execução, o controlo e a segurança.</p>
<p>No entanto, o raciocínio por si só não é suficiente. Os agentes também precisam da capacidade de armazenar, recuperar e reutilizar informações. É aí que <a href="https://milvus.io/"><strong>o Milvus</strong></a>, uma base de dados vetorial de código aberto, pode desempenhar um papel essencial. O Milvus fornece uma camada de memória escalável e de alto desempenho que permite aos agentes armazenar, pesquisar e recuperar informações de forma eficiente através da semelhança semântica.</p>
<p>Neste post, vamos explorar como o LangChain 1.0 actualiza a arquitetura dos agentes e como a integração do Milvus ajuda os agentes a ir além do raciocínio - permitindo uma memória persistente e inteligente para casos de utilização no mundo real.</p>
<h2 id="Why-the-Chain-based-Design-Falls-Short" class="common-anchor-header">Porque é que o design baseado em cadeias é insuficiente<button data-href="#Why-the-Chain-based-Design-Falls-Short" class="anchor-icon" translate="no">
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
    </button></h2><p>Nos seus primórdios (versão 0.x), a arquitetura da LangChain centrava-se em cadeias. Cada Chain definia uma sequência fixa e vinha com modelos pré-construídos que tornavam a orquestração do LLM simples e rápida. Este design era ótimo para construir protótipos rapidamente. Mas à medida que o ecossistema LLM evoluiu e os casos de uso do mundo real se tornaram mais complexos, as rachaduras nessa arquitetura começaram a aparecer.</p>
<p><strong>1. Falta de flexibilidade</strong></p>
<p>As primeiras versões do LangChain forneciam pipelines modulares como o SimpleSequentialChain ou o LLMChain, cada um seguindo um fluxo fixo e linear - criação do prompt → chamada de modelo → processamento de saída. Esta conceção funcionou bem para tarefas simples e previsíveis e facilitou a criação rápida de protótipos.</p>
<p>No entanto, à medida que as aplicações se tornaram mais dinâmicas, estes modelos rígidos começaram a parecer restritivos. Quando a lógica de negócio já não se encaixa perfeitamente numa sequência predefinida, restam-lhe duas opções insatisfatórias: forçar a sua lógica a estar em conformidade com a estrutura ou contorná-la completamente, chamando diretamente a API do LLM.</p>
<p><strong>2. Falta de controlo de nível de produção</strong></p>
<p>O que funcionava bem em demos muitas vezes quebrava em produção. As cadeias não incluíam as salvaguardas necessárias para aplicações de grande escala, persistentes ou sensíveis. Problemas comuns incluem:</p>
<ul>
<li><p><strong>Estouro de contexto:</strong> Conversas longas podiam exceder os limites de token, causando falhas ou truncamento silencioso.</p></li>
<li><p><strong>Fugas de dados sensíveis:</strong> Informações de identificação pessoal (como e-mails ou IDs) podem ser enviadas inadvertidamente para modelos de terceiros.</p></li>
<li><p><strong>Operações não supervisionadas:</strong> Os agentes podem apagar dados ou enviar correio eletrónico sem aprovação humana.</p></li>
</ul>
<p><strong>3. Falta de compatibilidade entre modelos</strong></p>
<p>Cada provedor de LLM - OpenAI, Anthropic e muitos modelos chineses - implementa seus próprios protocolos para raciocínio e chamada de ferramentas. Sempre que se trocava de fornecedor, era necessário reescrever a camada de integração: modelos de pedidos, adaptadores e analisadores de resposta. Este trabalho repetitivo atrasou o desenvolvimento e tornou a experimentação dolorosa.</p>
<h2 id="LangChain-10-All-in-ReAct-Agent" class="common-anchor-header">LangChain 1.0: Agente ReAct completo<button data-href="#LangChain-10-All-in-ReAct-Agent" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando a equipa da LangChain analisou centenas de implementações de agentes em produção, uma ideia sobressaiu: quase todos os agentes bem sucedidos convergiram naturalmente para o <strong>padrão ReAct ("Reasoning + Acting")</strong>.</p>
<p>Quer se trate de um sistema multi-agente ou de um único agente que executa um raciocínio profundo, surge o mesmo ciclo de controlo: alternar entre breves passos de raciocínio com chamadas de ferramentas específicas e, em seguida, alimentar as observações resultantes em decisões subsequentes até que o agente possa dar uma resposta final.</p>
<p>Para se basear nesta estrutura comprovada, a LangChain 1.0 coloca o ciclo ReAct no centro da sua arquitetura, tornando-o na estrutura predefinida para a construção de agentes fiáveis, interpretáveis e prontos a produzir.</p>
<p>Para suportar tudo, desde agentes simples a orquestrações complexas, o LangChain 1.0 adopta um design em camadas que combina a facilidade de utilização com um controlo preciso:</p>
<ul>
<li><p><strong>Cenários padrão:</strong> Comece com a função create_agent() - um loop ReAct limpo e padronizado que lida com raciocínio e chamadas de ferramentas prontas para uso.</p></li>
<li><p><strong>Cenários alargados:</strong> Adicione Middleware para obter um controlo refinado. O middleware permite inspecionar ou modificar o que acontece dentro do agente - por exemplo, adicionar deteção de PII, pontos de verificação de aprovação humana, novas tentativas automáticas ou ganchos de monitoramento.</p></li>
<li><p><strong>Cenários complexos:</strong> Para fluxos de trabalho com estado ou orquestração de vários agentes, utilize o LangGraph, um motor de execução baseado em gráficos que proporciona um controlo preciso do fluxo lógico, das dependências e dos estados de execução.</p></li>
</ul>
<p>Agora vamos detalhar os três componentes principais que tornam o desenvolvimento de agentes mais simples, mais seguro e mais consistente em todos os modelos.</p>
<h3 id="1-The-createagent-A-Simpler-Way-to-Build-Agents" class="common-anchor-header">1. O create_agent(): Uma maneira mais simples de criar agentes</h3><p>Um avanço importante no LangChain 1.0 é como ele reduz a complexidade da construção de agentes a uma única função - create_agent(). Não é mais necessário lidar manualmente com gerenciamento de estado, tratamento de erros ou saídas de streaming. Esses recursos de nível de produção agora são gerenciados automaticamente pelo tempo de execução do LangGraph.</p>
<p>Com apenas três parâmetros, você pode lançar um agente totalmente funcional:</p>
<ul>
<li><p><strong>modelo</strong> - um identificador de modelo (string) ou um objeto de modelo instanciado.</p></li>
<li><p><strong>tools</strong> - uma lista de funções que dão ao agente as suas capacidades.</p></li>
<li><p><strong>system_prompt</strong> - a instrução que define a função, o tom e o comportamento do agente.</p></li>
</ul>
<p>Por baixo do capô, create_agent() é executado no ciclo padrão do agente - chamando um modelo, deixando-o escolher ferramentas para executar, e completando quando não forem necessárias mais ferramentas:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/langchain_chain_1_1192c31ce3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Também herda as capacidades incorporadas do LangGraph para persistência de estado, recuperação de interrupções e streaming. As tarefas que antes exigiam centenas de linhas de código de orquestração são agora tratadas através de uma única API declarativa.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.<span class="hljs-property">agents</span> <span class="hljs-keyword">import</span> create_agent
agent = <span class="hljs-title function_">create_agent</span>(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[get_weather, query_database],
    system_prompt=<span class="hljs-string">&quot;You are a customer service assistant who helps users check the weather and order information.&quot;</span>
)
result = agent.<span class="hljs-title function_">invoke</span>({
    <span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;What’s the weather like in Shanghai today?&quot;</span>}]
})
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-The-Middleware-A-Composable-Layer-for-Production-Ready-Control" class="common-anchor-header">2. O Middleware: Uma camada compósita para controlo pronto a produzir</h3><p>O middleware é a ponte fundamental que leva a LangChain do protótipo à produção. Expõe ganchos em pontos estratégicos do ciclo de execução do agente, permitindo-lhe adicionar lógica personalizada sem reescrever o processo ReAct principal.</p>
<p>O ciclo principal de um agente segue um processo de decisão em três etapas - Modelo → Ferramenta → Terminação:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/langchain_1_0_chain_902054bde2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O LangChain 1.0 fornece alguns <a href="https://docs.langchain.com/oss/python/langchain/middleware#built-in-middleware">middlewares pré-construídos</a> para padrões comuns. Eis quatro exemplos.</p>
<ul>
<li><strong>Deteção de PII: Qualquer aplicação que lide com dados sensíveis do utilizador</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> PIIMiddleware


agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[],  <span class="hljs-comment"># Add tools as needed</span>
    middleware=[
        <span class="hljs-comment"># Redact emails in user input</span>
        PIIMiddleware(<span class="hljs-string">&quot;email&quot;</span>, strategy=<span class="hljs-string">&quot;redact&quot;</span>, apply_to_input=<span class="hljs-literal">True</span>),
        <span class="hljs-comment"># Mask credit cards (show last 4 digits)</span>
        PIIMiddleware(<span class="hljs-string">&quot;credit_card&quot;</span>, strategy=<span class="hljs-string">&quot;mask&quot;</span>, apply_to_input=<span class="hljs-literal">True</span>),
        <span class="hljs-comment"># Custom PII type with regex</span>
        PIIMiddleware(
            <span class="hljs-string">&quot;api_key&quot;</span>,
            detector=<span class="hljs-string">r&quot;sk-[a-zA-Z0-9]{32}&quot;</span>,
            strategy=<span class="hljs-string">&quot;block&quot;</span>,  <span class="hljs-comment"># Raise error if detected</span>
        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Sumarização: Resume automaticamente o histórico de conversas quando se aproxima do limite de tokens.</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> SummarizationMiddleware


agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[weather_tool, calculator_tool],
    middleware=[
        SummarizationMiddleware(
            model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>,  <span class="hljs-comment">#Summarize using a cheaper model  </span>
            max_tokens_before_summary=<span class="hljs-number">4000</span>,  <span class="hljs-comment"># Trigger summarization at 4000 tokens</span>
            messages_to_keep=<span class="hljs-number">20</span>,  <span class="hljs-comment"># Keep last 20 messages after summary</span>
        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Repetição de ferramenta: Tentativa automática de chamadas de ferramentas com falha com backoff exponencial configurável.</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> ToolRetryMiddleware
agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[search_tool, database_tool],
    middleware=[
        ToolRetryMiddleware(
            max_retries=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Retry up to 3 times</span>
            backoff_factor=<span class="hljs-number">2.0</span>,  <span class="hljs-comment"># Exponential backoff multiplier</span>
            initial_delay=<span class="hljs-number">1.0</span>,  <span class="hljs-comment"># Start with 1 second delay</span>
            max_delay=<span class="hljs-number">60.0</span>,  <span class="hljs-comment"># Cap delays at 60 seconds</span>
            jitter=<span class="hljs-literal">True</span>,  <span class="hljs-comment"># Add random jitter to avoid thundering herd (±25%)</span>

        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Middleware personalizado</strong></li>
</ul>
<p>Além das opções oficiais e pré-construídas de middleware, também é possível criar middleware personalizado usando o modo baseado em decorador ou classe.</p>
<p>Por exemplo, o snippet abaixo mostra como registrar chamadas de modelo antes da execução:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> before_model
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> AgentState
<span class="hljs-keyword">from</span> langgraph.runtime <span class="hljs-keyword">import</span> Runtime
<span class="hljs-meta">@before_model</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">log_before_model</span>(<span class="hljs-params">state: AgentState, runtime: Runtime</span>) -&gt; <span class="hljs-built_in">dict</span> | <span class="hljs-literal">None</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;About to call model with <span class="hljs-subst">{<span class="hljs-built_in">len</span>(state[<span class="hljs-string">&#x27;messages&#x27;</span>])}</span> messages&quot;</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-literal">None</span>  <span class="hljs-comment"># Returning None means the normal flow continues</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[...],
    middleware=[log_before_model],
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Structured-Output-A-Standardized-Way-to-Handle-Data" class="common-anchor-header">3. Saída estruturada: Uma forma padronizada de lidar com dados</h3><p>No desenvolvimento tradicional de agentes, a saída estruturada sempre foi difícil de gerenciar. Cada provedor de modelo lida com isso de forma diferente - por exemplo, o OpenAI oferece uma API de saída estruturada nativa, enquanto outros apenas suportam respostas estruturadas indiretamente por meio de chamadas de ferramentas. Isso geralmente significava escrever adaptadores personalizados para cada provedor, adicionando trabalho extra e tornando a manutenção mais dolorosa do que deveria ser.</p>
<p>No LangChain 1.0, a saída estruturada é tratada diretamente através do parâmetro response_format em create_agent().  Só precisa de definir o seu esquema de dados uma vez. O LangChain escolhe automaticamente a melhor estratégia de aplicação com base no modelo que você está usando - não é necessária nenhuma configuração extra ou código específico do fornecedor.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> pydantic <span class="hljs-keyword">import</span> BaseModel, Field
<span class="hljs-keyword">class</span> <span class="hljs-title class_">WeatherReport</span>(<span class="hljs-title class_ inherited__">BaseModel</span>):
    location: <span class="hljs-built_in">str</span> = Field(description=<span class="hljs-string">&quot;City name&quot;</span>)
    temperature: <span class="hljs-built_in">float</span> = Field(description=<span class="hljs-string">&quot;Temperature (°C)&quot;</span>)
    condition: <span class="hljs-built_in">str</span> = Field(description=<span class="hljs-string">&quot;Weather condition&quot;</span>)
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[get_weather],
    response_format=WeatherReport  <span class="hljs-comment"># Use the Pydantic model as the response schema</span>
)
result = agent.invoke({<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;What’s the weather like in Shanghai today??&quot;</span>})
weather_data = result[<span class="hljs-string">&#x27;structured_response&#x27;</span>]  <span class="hljs-comment"># Retrieve the structured response</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{weather_data.location}</span>: <span class="hljs-subst">{weather_data.temperature}</span>°C, <span class="hljs-subst">{weather_data.condition}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>O LangChain suporta duas estratégias para saída estruturada:</p>
<p><strong>1. Estratégia do provedor:</strong> Alguns provedores de modelos suportam nativamente a saída estruturada por meio de suas APIs (por exemplo, OpenAI e Grok). Quando esse suporte está disponível, a LangChain usa diretamente a imposição de esquema embutida do provedor. Esta abordagem oferece o mais alto nível de fiabilidade e consistência, uma vez que o próprio modelo garante o formato de saída.</p>
<p><strong>2. Estratégia de chamada da ferramenta:</strong> Para modelos que não suportam saída estruturada nativa, o LangChain usa chamadas de ferramentas para obter o mesmo resultado.</p>
<p>Não precisa de se preocupar com a estratégia que está a ser utilizada - a estrutura detecta as capacidades do modelo e adapta-se automaticamente. Essa abstração permite alternar livremente entre diferentes provedores de modelos sem alterar sua lógica de negócios.</p>
<h2 id="How-Milvus-Enhances-Agent-Memory" class="common-anchor-header">Como o Milvus melhora a memória do agente<button data-href="#How-Milvus-Enhances-Agent-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>Para agentes de nível de produção, o verdadeiro gargalo de desempenho muitas vezes não é o mecanismo de raciocínio - é o sistema de memória. No LangChain 1.0, as bases de dados vectoriais actuam como a memória externa de um agente, proporcionando uma recordação a longo prazo através da recuperação semântica.</p>
<p><a href="https://milvus.io/">A Milvus</a> é uma das bases de dados vectoriais de código aberto mais maduras atualmente disponíveis, criada especificamente para pesquisa vetorial em larga escala em aplicações de IA. Integra-se nativamente com o LangChain, para que não tenha de lidar manualmente com a vectorização, a gestão de índices ou a pesquisa de semelhanças. O pacote langchain_milvus envolve o Milvus como uma interface VectorStore padrão, permitindo conectá-lo aos seus agentes com apenas algumas linhas de código.</p>
<p>Ao fazer isso, o Milvus aborda três desafios-chave na construção de sistemas de memória de agentes escaláveis e confiáveis:</p>
<h4 id="1-Fast-Retrieval-from-Massive-Knowledge-Bases" class="common-anchor-header"><strong>1. Recuperação rápida de bases de conhecimento massivas</strong></h4><p>Quando um agente precisa de processar milhares de documentos, conversas passadas ou manuais de produtos, a simples pesquisa por palavras-chave não é suficiente. O Milvus utiliza a pesquisa por semelhança de vectores para encontrar informações semanticamente relevantes em milissegundos - mesmo que a consulta utilize uma redação diferente. Isto permite que o seu agente recupere conhecimentos com base no significado e não apenas em correspondências de texto exactas.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain_openai <span class="hljs-keyword">import</span> OpenAIEmbeddings
<span class="hljs-comment"># Initialize the vector database as a knowledge base</span>
vectorstore = Milvus(
    embedding=OpenAIEmbeddings(),  
    collection_name=<span class="hljs-string">&quot;company_knowledge&quot;</span>,
    connection_args={<span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;http://localhost:19530&quot;</span>}  <span class="hljs-comment">#</span>
)
<span class="hljs-comment"># Convert the retriever into a Tool for the Agent</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[vectorstore.as_retriever().as_tool(
        name=<span class="hljs-string">&quot;knowledge_search&quot;</span>,
        description=<span class="hljs-string">&quot;Search the company knowledge base to answer professional questions&quot;</span>
    )],
    system_prompt=<span class="hljs-string">&quot;You can retrieve information from the knowledge base to answer questions.&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="2-Persistent-Long-Term-Memory" class="common-anchor-header"><strong>2. Memória de longo prazo persistente</strong></h4><p>O SummarizationMiddleware da LangChain pode condensar o histórico de conversas quando este se torna demasiado longo, mas o que acontece a todos os detalhes que são resumidos? O Milvus guarda-os. Cada conversa, chamada de ferramenta e passo de raciocínio pode ser vectorizado e armazenado para referência a longo prazo. Quando necessário, o agente pode recuperar rapidamente memórias relevantes através da pesquisa semântica, permitindo uma verdadeira continuidade entre sessões.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> SummarizationMiddleware
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> InMemorySaver
<span class="hljs-comment"># Long-term memory storage(Milvus)</span>
long_term_memory = Milvus.from_documents(
    documents=[],  <span class="hljs-comment"># Initially empty; dynamically updated at runtime</span>
    embedding=OpenAIEmbeddings(),
    connection_args={<span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;./agent_memory.db&quot;</span>}
)
<span class="hljs-comment"># Short-term memory management(LangGraph Checkpointer + Summarization)</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[long_term_memory.as_retriever().as_tool(
        name=<span class="hljs-string">&quot;recall_memory&quot;</span>,
        description=<span class="hljs-string">&quot;Retrieve the agent’s historical memories and past experiences&quot;</span>
    )],
    checkpointer=InMemorySaver(),  <span class="hljs-comment"># Short-term memory</span>
    middleware=[
        SummarizationMiddleware(
            model=<span class="hljs-string">&quot;openai:gpt-4o-mini&quot;</span>,
            max_tokens_before_summary=<span class="hljs-number">4000</span>  <span class="hljs-comment"># When the threshold is exceeded, summarize and store it in Milvus</span>
        )
    ]
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="3-Unified-Management-of-Multimodal-Content" class="common-anchor-header"><strong>3. Gestão unificada de conteúdo multimodal</strong></h4><p>Os agentes modernos lidam com mais do que texto - eles interagem com imagens, áudio e vídeo. O Milvus suporta o armazenamento multi-vetorial e o esquema dinâmico, o que lhe permite gerir os embeddings de várias modalidades num único sistema. Isto proporciona uma base de memória unificada para agentes multimodais, permitindo a recuperação consistente de diferentes tipos de dados.</p>
<pre><code translate="no"><span class="hljs-comment"># Filter retrievals by source (e.g., search only medical reports)</span>
vectorstore.similarity_search(
    query=<span class="hljs-string">&quot;What is the patient&#x27;s blood pressure reading?&quot;</span>,
    k=<span class="hljs-number">3</span>,
    expr=<span class="hljs-string">&quot;source == &#x27;medical_reports&#x27; AND modality == &#x27;text&#x27;&quot;</span>  <span class="hljs-comment"># Milvus scalar filtering</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="LangChain-vs-LangGraph-How-to-Choose-the-One-That-Fits-for-Your-Agents" class="common-anchor-header">LangChain vs. LangGraph: Como escolher o que melhor se adapta aos seus agentes<button data-href="#LangChain-vs-LangGraph-How-to-Choose-the-One-That-Fits-for-Your-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>A atualização para o LangChain 1.0 é uma etapa essencial para a criação de agentes de nível de produção, mas isso não significa que seja sempre a única ou a melhor opção para todos os casos de uso. A escolha do framework correto determina a rapidez com que você pode combinar esses recursos em um sistema funcional e de fácil manutenção.</p>
<p>Na verdade, o LangChain 1.0 e o LangGraph 1.0 podem ser vistos como parte da mesma pilha em camadas, projetados para trabalhar juntos em vez de substituir um ao outro: O LangChain ajuda-o a construir agentes padrão rapidamente, enquanto o LangGraph lhe dá um controlo refinado para fluxos de trabalho complexos. Por outras palavras, o LangChain ajuda-o a avançar rapidamente, enquanto o LangGraph o ajuda a aprofundar.</p>
<p>Abaixo está uma rápida comparação de como eles diferem em termos de posicionamento técnico:</p>
<table>
<thead>
<tr><th><strong>Dimensão</strong></th><th><strong>LangChain 1.0</strong></th><th><strong>LangChain 1.0</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Nível de abstração</strong></td><td>Abstração de alto nível, concebida para cenários de agentes padrão</td><td>Estrutura de orquestração de baixo nível, concebida para fluxos de trabalho complexos</td></tr>
<tr><td><strong>Capacidade principal</strong></td><td>Ciclo ReAct padrão (Motivo → Chamada de ferramenta → Observação → Resposta)</td><td>Máquinas de estado personalizadas e lógica de ramificação complexa (StateGraph + Conditional Routing)</td></tr>
<tr><td><strong>Mecanismo de extensão</strong></td><td>Middleware para capacidades de nível de produção</td><td>Gestão manual de nós, arestas e transições de estado</td></tr>
<tr><td><strong>Implementação subjacente</strong></td><td>Gestão manual de nós, arestas e transições de estado</td><td>Tempo de execução nativo com persistência e recuperação incorporadas</td></tr>
<tr><td><strong>Casos de uso típicos</strong></td><td>80% dos cenários de agentes padrão</td><td>Colaboração entre vários agentes e orquestração de fluxos de trabalho de longa duração</td></tr>
<tr><td><strong>Curva de aprendizado</strong></td><td>Construir um agente em cerca de 10 linhas de código</td><td>Requer conhecimento de gráficos de estado e orquestração de nós</td></tr>
</tbody>
</table>
<p>Se você é novo na construção de agentes ou deseja colocar um projeto em funcionamento rapidamente, comece com o LangChain. Se já sabe que o seu caso de utilização requer orquestração complexa, colaboração multi-agente ou fluxos de trabalho de longa duração, vá diretamente para o LangGraph.</p>
<p>Ambas as estruturas podem coexistir no mesmo projeto - pode começar de forma simples com o LangChain e utilizar o LangGraph quando o seu sistema precisar de mais controlo e flexibilidade. A chave é escolher a ferramenta certa para cada parte do seu fluxo de trabalho.</p>
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
    </button></h2><p>Há três anos, a LangChain começou como um wrapper leve para chamar LLMs. Atualmente, transformou-se numa estrutura completa, de nível de produção.</p>
<p>No núcleo, as camadas de middleware fornecem segurança, conformidade e observabilidade. O LangGraph acrescenta execução persistente, fluxo de controlo e gestão de estado. E na camada de memória, <a href="https://milvus.io/">o Milvus</a> preenche uma lacuna crítica - fornecendo memória de longo prazo escalável e confiável que permite aos agentes recuperar o contexto, raciocinar sobre o histórico e melhorar com o tempo.</p>
<p>Juntos, LangChain, LangGraph e Milvus formam uma cadeia de ferramentas prática para a era moderna dos agentes - unindo prototipagem rápida com implantação em escala empresarial, sem sacrificar a confiabilidade ou o desempenho.</p>
<p>Pronto para dar ao seu agente uma memória fiável e de longo prazo? Explore <a href="https://milvus.io">o Milvus</a> e veja como ele fornece memória inteligente e de longo prazo para agentes LangChain em produção.</p>
<p>Tem dúvidas ou quer um mergulho profundo em qualquer recurso? Junte-se ao nosso <a href="https://discord.com/invite/8uyFbECzPX">canal Discord</a> ou registre problemas no <a href="https://github.com/milvus-io/milvus">GitHub</a>. Também pode reservar uma sessão individual de 20 minutos para obter informações, orientação e respostas às suas perguntas através do <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>.</p>
