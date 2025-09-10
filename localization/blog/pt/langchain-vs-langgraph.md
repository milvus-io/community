---
id: langchain-vs-langgraph.md
title: >-
  LangChain vs LangGraph: Guia do programador para escolher as suas estruturas
  de IA
author: Min Yin
date: 2025-09-09T00:00:00.000Z
desc: >-
  Compare LangChain e LangGraph para aplicativos LLM. Veja como eles diferem em
  arquitetura, gerenciamento de estado e casos de uso - além de quando usar cada
  um.
cover: assets.zilliz.com/Chat_GPT_Image_Sep_9_2025_09_42_12_PM_1_49154d15cc.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, langchain, langgraph'
meta_keywords: 'Milvus, vector database, langchain, langgraph, langchain vs langgraph'
meta_title: |
  LangChain vs LangGraph: A Developer's Guide to Choosing Your AI Frameworks
origin: 'https://milvus.io/blog/langchain-vs-langgraph.md'
---
<p>Ao construir com modelos de linguagem de grande dimensão (LLMs), a estrutura que escolher tem um enorme impacto na sua experiência de desenvolvimento. Uma boa estrutura agiliza os fluxos de trabalho, reduz os clichés e facilita a passagem do protótipo para a produção. Uma má adaptação pode fazer o oposto, aumentando o atrito e a dívida técnica.</p>
<p>Duas das opções mais populares atualmente são a <a href="https://python.langchain.com/docs/introduction/"><strong>LangChain</strong></a> e <a href="https://langchain-ai.github.io/langgraph/"><strong>a LangGraph</strong></a> - ambas de código aberto e criadas pela equipa da LangChain. O LangChain centra-se na orquestração de componentes e na automatização do fluxo de trabalho, o que o torna adequado para casos de utilização comuns, como a geração aumentada por recuperação<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>). O LangGraph é construído sobre o LangChain com uma arquitetura baseada em grafos, que é mais adequada para aplicações com estado, tomadas de decisão complexas e coordenação multi-agente.</p>
<p>Neste guia, compararemos os dois frameworks lado a lado: como funcionam, seus pontos fortes e os tipos de projetos para os quais são mais adequados. No final, terá uma noção mais clara de qual delas faz mais sentido para as suas necessidades.</p>
<h2 id="LangChain-Your-Component-Library-and-LCEL-Orchestration-Powerhouse" class="common-anchor-header">LangChain: A sua biblioteca de componentes e a potência de orquestração LCEL<button data-href="#LangChain-Your-Component-Library-and-LCEL-Orchestration-Powerhouse" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/langchain-ai/langchain"><strong>LangChain</strong></a> é uma estrutura de código aberto projetada para tornar a construção de aplicativos LLM mais gerenciável. Pode pensar nele como o middleware que fica entre o seu modelo (digamos, o <a href="https://milvus.io/blog/gpt-5-review-accuracy-up-prices-down-code-strong-but-bad-for-creativity.md">GPT-5</a> do OpenAI ou o <a href="https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md">Claude</a> do Anthropic) e a sua aplicação real. A sua principal função é ajudá-lo a <em>encadear</em> todas as partes móveis: avisos, APIs externas, <a href="https://zilliz.com/learn/what-is-vector-database">bases de dados vectoriais</a> e lógica empresarial personalizada.</p>
<p>Tomemos o RAG como exemplo. Em vez de ligar tudo a partir do zero, o LangChain fornece-lhe abstracções prontas a usar para ligar um LLM a um armazenamento de vectores (como <a href="https://milvus.io/">o Milvus</a> ou <a href="https://zilliz.com/cloud">o Zilliz Cloud</a>), executar pesquisa semântica e alimentar os resultados no seu prompt. Para além disso, oferece utilitários para modelos de prompt, agentes que podem chamar ferramentas e camadas de orquestração que mantêm fluxos de trabalho complexos.</p>
<p><strong>O que faz a LangChain se destacar?</strong></p>
<ul>
<li><p><strong>Biblioteca de componentes rica</strong> - Carregadores de documentos, divisores de texto, conectores de armazenamento de vectores, interfaces de modelos e muito mais.</p></li>
<li><p><strong>Orquestração LCEL (LangChain Expression Language)</strong> - Uma forma declarativa de misturar e combinar componentes com menos clichés.</p></li>
<li><p><strong>Fácil integração</strong> - Funciona sem problemas com APIs, bancos de dados e ferramentas de terceiros.</p></li>
<li><p><strong>Ecossistema maduro</strong> - Documentação sólida, exemplos e uma comunidade ativa.</p></li>
</ul>
<h2 id="LangGraph-Your-Go-To-for-Stateful-Agent-Systems" class="common-anchor-header">LangGraph: Sua solução ideal para sistemas de agentes com estado<button data-href="#LangGraph-Your-Go-To-for-Stateful-Agent-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/langchain-ai/langgraph">O LangGraph</a> é uma extensão especializada do LangChain que se concentra em aplicações com estado. Em vez de escrever fluxos de trabalho como um script linear, define-os como um gráfico de nós e arestas - essencialmente uma máquina de estados. Cada nó representa uma ação (como chamar um LLM, consultar uma base de dados ou verificar uma condição), enquanto as arestas definem como o fluxo se move dependendo dos resultados. Esta estrutura facilita a manipulação de loops, ramificações e novas tentativas sem que o seu código se transforme num emaranhado de instruções if/else.</p>
<p>Esta abordagem é especialmente útil para casos de utilização avançados, como copilotos e <a href="https://zilliz.com/blog/what-exactly-are-ai-agents-why-openai-and-langchain-are-fighting-over-their-definition">agentes autónomos</a>. Esses sistemas geralmente precisam manter o controle da memória, lidar com resultados inesperados ou tomar decisões dinamicamente. Ao modelar a lógica explicitamente como um gráfico, o LangGraph torna estes comportamentos mais transparentes e fáceis de manter.</p>
<p><strong>As principais caraterísticas do LangGraph incluem:</strong></p>
<ul>
<li><p><strong>Arquitetura baseada em grafos</strong> - Suporte nativo para loops, backtracking e fluxos de controlo complexos.</p></li>
<li><p><strong>Gerenciamento de estado</strong> - O estado centralizado garante que o contexto seja preservado entre as etapas.</p></li>
<li><p><strong>Suporte a vários</strong> agentes - Criado para cenários em que vários agentes colaboram ou coordenam.</p></li>
<li><p><strong>Ferramentas de depuração</strong> - Visualização e depuração via LangSmith Studio para rastrear a execução do grafo.</p></li>
</ul>
<h2 id="LangChain-vs-LangGraph-Technical-Deep-Dive" class="common-anchor-header">LangChain vs LangGraph: Mergulho técnico profundo<button data-href="#LangChain-vs-LangGraph-Technical-Deep-Dive" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Architecture" class="common-anchor-header">Arquitetura</h3><p>O LangChain usa <strong>LCEL (LangChain Expression Language)</strong> para conectar componentes em um pipeline linear. É declarativa, legível e óptima para fluxos de trabalho simples como o RAG.</p>
<pre><code translate="no"><span class="hljs-comment"># LangChain LCEL orchestration example</span>
<span class="hljs-keyword">from</span> langchain.prompts <span class="hljs-keyword">import</span> ChatPromptTemplate
<span class="hljs-keyword">from</span> langchain.chat_models <span class="hljs-keyword">import</span> ChatOpenAI

prompt = ChatPromptTemplate.from_template(<span class="hljs-string">&quot;Please answer the following question: {question}&quot;</span>)
model = ChatOpenAI()

<span class="hljs-comment"># LCEL chain orchestration</span>
chain = prompt | model

<span class="hljs-comment"># Run the chain</span>
result = chain.invoke({<span class="hljs-string">&quot;question&quot;</span>: <span class="hljs-string">&quot;What is artificial intelligence?&quot;</span>})
<button class="copy-code-btn"></button></code></pre>
<p>O LangGraph tem uma abordagem diferente: os fluxos de trabalho são expressos como um <strong>gráfico de nós e arestas</strong>. Cada nó define uma ação e o motor gráfico gere o estado, a ramificação e as novas tentativas.</p>
<pre><code translate="no"><span class="hljs-comment"># LangGraph graph structure definition</span>
<span class="hljs-keyword">from</span> langgraph.graph <span class="hljs-keyword">import</span> StateGraph
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> TypedDict

<span class="hljs-keyword">class</span> <span class="hljs-title class_">State</span>(<span class="hljs-title class_ inherited__">TypedDict</span>):
    messages: <span class="hljs-built_in">list</span>
    current_step: <span class="hljs-built_in">str</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">node_a</span>(<span class="hljs-params">state: State</span>) -&gt; State:
    <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;messages&quot;</span>: state[<span class="hljs-string">&quot;messages&quot;</span>] + [<span class="hljs-string">&quot;Processing A&quot;</span>], <span class="hljs-string">&quot;current_step&quot;</span>: <span class="hljs-string">&quot;A&quot;</span>}

<span class="hljs-keyword">def</span> <span class="hljs-title function_">node_b</span>(<span class="hljs-params">state: State</span>) -&gt; State:
    <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;messages&quot;</span>: state[<span class="hljs-string">&quot;messages&quot;</span>] + [<span class="hljs-string">&quot;Processing B&quot;</span>], <span class="hljs-string">&quot;current_step&quot;</span>: <span class="hljs-string">&quot;B&quot;</span>}

graph = StateGraph(State)
graph.add_node(<span class="hljs-string">&quot;node_a&quot;</span>, node_a)
graph.add_node(<span class="hljs-string">&quot;node_b&quot;</span>, node_b)
graph.add_edge(<span class="hljs-string">&quot;node_a&quot;</span>, <span class="hljs-string">&quot;node_b&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Enquanto o LCEL oferece um pipeline linear limpo, o LangGraph suporta nativamente loops, ramificações e fluxos condicionais. Isso o torna mais adequado para <strong>sistemas do tipo agente</strong> ou interações de várias etapas que não seguem uma linha reta.</p>
<h3 id="State-Management" class="common-anchor-header">Gerenciamento de estado</h3><ul>
<li><p><strong>LangChain</strong>: Usa componentes de memória para passar o contexto. Funciona bem para conversas simples de várias voltas ou fluxos de trabalho lineares.</p></li>
<li><p><strong>LangGraph</strong>: Usa um sistema de estado centralizado que suporta rollbacks, backtracking e histórico detalhado. Essencial para aplicações de longa duração e com estado, onde a continuidade do contexto é importante.</p></li>
</ul>
<h3 id="Execution-Models" class="common-anchor-header">Modelos de execução</h3><table>
<thead>
<tr><th><strong>Recurso</strong></th><th><strong>LangChain</strong></th><th><strong>LangGraph</strong></th></tr>
</thead>
<tbody>
<tr><td>Modo de execução</td><td>Orquestração linear</td><td>Execução com estado (gráfico)</td></tr>
<tr><td>Suporte de loop</td><td>Suporte limitado</td><td>Suporte nativo</td></tr>
<tr><td>Ramificação condicional</td><td>Implementado via RunnableMap</td><td>Suporte nativo</td></tr>
<tr><td>Tratamento de exceções</td><td>Implementado através de RunnableBranch</td><td>Suporte incorporado</td></tr>
<tr><td>Processamento de erros</td><td>Transmissão em cadeia</td><td>Processamento em nível de nó</td></tr>
</tbody>
</table>
<h2 id="Real-World-Use-Cases-When-to-Use-Each" class="common-anchor-header">Casos de uso no mundo real: Quando usar cada um<button data-href="#Real-World-Use-Cases-When-to-Use-Each" class="anchor-icon" translate="no">
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
    </button></h2><p>As frameworks não são apenas uma questão de arquitetura - elas brilham em situações diferentes. Portanto, a verdadeira questão é: quando é que se deve usar a LangChain e quando é que a LangGraph faz mais sentido? Vejamos alguns cenários práticos.</p>
<h3 id="When-LangChain-Is-Your-Best-Choice" class="common-anchor-header">Quando a LangChain é a melhor escolha</h3><h4 id="1-Straightforward-Task-Processing" class="common-anchor-header">1. Processamento de tarefas simples</h4><p>A LangChain é uma ótima opção quando você precisa transformar entrada em saída sem rastreamento de estado pesado ou lógica de ramificação. Por exemplo, uma extensão de navegador que traduz o texto selecionado:</p>
<pre><code translate="no"><span class="hljs-comment"># Implementing simple text translation using LCEL</span>
<span class="hljs-keyword">from</span> langchain.prompts <span class="hljs-keyword">import</span> ChatPromptTemplate
<span class="hljs-keyword">from</span> langchain.chat_models <span class="hljs-keyword">import</span> ChatOpenAI

prompt = ChatPromptTemplate.from_template(<span class="hljs-string">&quot;Translate the following text to English: {text}&quot;</span>)
model = ChatOpenAI()
chain = prompt | model

result = chain.invoke({<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Hello, World!&quot;</span>})
<button class="copy-code-btn"></button></code></pre>
<p>Nesse caso, não há necessidade de memória, novas tentativas ou raciocínio em várias etapas - apenas uma transformação eficiente de entrada para saída. A LangChain mantém o código limpo e focado.</p>
<h4 id="2-Foundation-Components" class="common-anchor-header">2. Componentes de base</h4><p>A LangChain fornece componentes básicos ricos que podem servir como blocos de construção para a construção de sistemas mais complexos. Mesmo quando as equipas constroem com o LangGraph, dependem frequentemente dos componentes maduros do LangChain. A estrutura oferece:</p>
<ul>
<li><p><strong>Conectores de armazenamento vetorial</strong> - Interfaces unificadas para bases de dados como Milvus e Zilliz Cloud.</p></li>
<li><p><strong>Carregadores e divisores de documentos</strong> - Para PDFs, páginas da Web e outros conteúdos.</p></li>
<li><p><strong>Interfaces de modelo</strong> - Wrappers padronizados para LLMs populares.</p></li>
</ul>
<p>Isso torna o LangChain não apenas uma ferramenta de fluxo de trabalho, mas também uma biblioteca de componentes confiável para sistemas maiores.</p>
<h3 id="When-LangGraph-Is-the-Clear-Winner" class="common-anchor-header">Quando a LangGraph é a clara vencedora</h3><h4 id="1-Sophisticated-Agent-Development" class="common-anchor-header">1. Desenvolvimento sofisticado de agentes</h4><p>O LangGraph é excelente quando se está a construir sistemas de agentes avançados que precisam de fazer loops, ramificações e adaptações. Aqui está um padrão de agente simplificado:</p>
<pre><code translate="no"><span class="hljs-comment"># Simplified Agent system example</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">agent</span>(<span class="hljs-params">state</span>):
    messages = state[<span class="hljs-string">&quot;messages&quot;</span>]
    <span class="hljs-comment"># Agent thinks and decides next action</span>
    action = decide_action(messages)
    <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;action&quot;</span>: action, <span class="hljs-string">&quot;messages&quot;</span>: messages}

<span class="hljs-keyword">def</span> <span class="hljs-title function_">tool_executor</span>(<span class="hljs-params">state</span>):
    <span class="hljs-comment"># Execute tool calls</span>
    action = state[<span class="hljs-string">&quot;action&quot;</span>]
    result = execute_tool(action)
    <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;result&quot;</span>: result, <span class="hljs-string">&quot;messages&quot;</span>: state[<span class="hljs-string">&quot;messages&quot;</span>] + [result]}

<span class="hljs-comment"># Build Agent graph</span>
graph = StateGraph()
graph.add_node(<span class="hljs-string">&quot;agent&quot;</span>, agent)
graph.add_node(<span class="hljs-string">&quot;tool_executor&quot;</span>, tool_executor)
graph.add_edge(<span class="hljs-string">&quot;agent&quot;</span>, <span class="hljs-string">&quot;tool_executor&quot;</span>)
graph.add_edge(<span class="hljs-string">&quot;tool_executor&quot;</span>, <span class="hljs-string">&quot;agent&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Exemplo:</strong> Os recursos avançados do GitHub Copilot X demonstram perfeitamente a arquitetura de agente do LangGraph em ação. O sistema entende a intenção do desenvolvedor, divide tarefas de programação complexas em etapas gerenciáveis, executa várias operações em sequência, aprende com os resultados intermediários e adapta sua abordagem com base no que descobre ao longo do caminho.</p>
<h4 id="2-Advanced-Multi-Turn-Conversation-Systems" class="common-anchor-header">2. Sistemas avançados de conversação multi-voltas</h4><p>As capacidades de gestão de estados do LangGraph tornam-no muito adequado para a construção de sistemas complexos de conversação multi-voltas:</p>
<ul>
<li><p><strong>Sistemas de atendimento ao cliente</strong>: Capaz de rastrear o histórico da conversa, entender o contexto e fornecer respostas coerentes</p></li>
<li><p><strong>Sistemas de tutoria educacional</strong>: Ajustar estratégias de ensino com base no histórico de respostas dos alunos</p></li>
<li><p><strong>Sistemas de simulação de entrevistas</strong>: Ajustar as perguntas da entrevista com base nas respostas dos candidatos</p></li>
</ul>
<p><strong>Exemplo:</strong> O sistema de tutoria de IA do Duolingo demonstra isto na perfeição. O sistema analisa continuamente os padrões de resposta de cada aluno, identifica lacunas de conhecimento específicas, acompanha o progresso da aprendizagem em várias sessões e proporciona experiências de aprendizagem de línguas personalizadas que se adaptam aos estilos de aprendizagem individuais, às preferências de ritmo e às áreas de dificuldade.</p>
<h4 id="3-Multi-Agent-Collaboration-Ecosystems" class="common-anchor-header">3. Ecossistemas de colaboração multi-agente</h4><p>O LangGraph suporta nativamente ecossistemas onde vários agentes se coordenam. Os exemplos incluem:</p>
<ul>
<li><p><strong>Simulação de colaboração em equipa</strong>: Múltiplos papéis que completam tarefas complexas de forma colaborativa</p></li>
<li><p><strong>Sistemas de debate</strong>: Múltiplos papéis com diferentes pontos de vista envolvidos num debate</p></li>
<li><p><strong>Plataformas de colaboração criativa</strong>: Agentes inteligentes de diferentes domínios profissionais criam em conjunto</p></li>
</ul>
<p>Esta abordagem tem-se revelado promissora em domínios de investigação como a descoberta de medicamentos, em que os agentes modelam diferentes áreas de especialização e combinam os resultados em novas perspectivas.</p>
<h3 id="Making-the-Right-Choice-A-Decision-Framework" class="common-anchor-header">Fazer a escolha certa: Um quadro de decisão</h3><table>
<thead>
<tr><th><strong>Caraterísticas do projeto</strong></th><th><strong>Quadro recomendado</strong></th><th><strong>Porquê</strong></th></tr>
</thead>
<tbody>
<tr><td>Tarefas simples e pontuais</td><td>Cadeia Lang</td><td>A orquestração do LCEL é simples e intuitiva</td></tr>
<tr><td>Tradução/Otimização de texto</td><td>Cadeia Lang</td><td>Não há necessidade de gerenciamento de estado complexo</td></tr>
<tr><td>Sistemas de agentes</td><td>LangGraph</td><td>Poderosa gestão de estados e fluxo de controlo</td></tr>
<tr><td>Sistemas de conversação multi-voltas</td><td>LangGraph</td><td>Acompanhamento do estado e gestão do contexto</td></tr>
<tr><td>Colaboração multiagente</td><td>LangGraph</td><td>Suporte nativo para interação multi-nó</td></tr>
<tr><td>Sistemas que requerem o uso de ferramentas</td><td>LangGraph</td><td>Controlo flexível do fluxo de invocação de ferramentas</td></tr>
</tbody>
</table>
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
    </button></h2><p>Na maioria dos casos, o LangChain e o LangGraph são complementares, não concorrentes. O LangChain dá-lhe uma base sólida de componentes e orquestração LCEL - excelente para protótipos rápidos, tarefas sem estado ou projectos que apenas precisam de fluxos de entrada e saída limpos. O LangGraph entra em ação quando sua aplicação ultrapassa esse modelo linear e requer estado, ramificação ou vários agentes trabalhando juntos.</p>
<ul>
<li><p><strong>Escolha o LangChain</strong> se o seu foco está em tarefas simples, como tradução de texto, processamento de documentos ou transformação de dados, em que cada solicitação é independente.</p></li>
<li><p><strong>Escolha LangGraph</strong> se estiver a construir conversas com várias voltas, sistemas de agentes ou ecossistemas de agentes colaborativos onde o contexto e a tomada de decisões são importantes.</p></li>
<li><p><strong>Misture ambos</strong> para obter os melhores resultados. Muitos sistemas de produção começam com os componentes do LangChain (carregadores de documentos, conectores de armazenamento de vetores, interfaces de modelos) e, em seguida, adicionam o LangGraph para gerenciar a lógica com estado e orientada por gráficos.</p></li>
</ul>
<p>Em última análise, trata-se menos de perseguir tendências e mais de alinhar a estrutura com as necessidades genuínas do seu projeto. Ambos os ecossistemas estão a evoluir rapidamente, impulsionados por comunidades activas e documentação robusta. Ao compreender onde cada um se encaixa, estará melhor equipado para conceber aplicações que escalam - quer esteja a construir o seu primeiro pipeline RAG com Milvus ou a orquestrar um complexo sistema multi-agente.</p>
