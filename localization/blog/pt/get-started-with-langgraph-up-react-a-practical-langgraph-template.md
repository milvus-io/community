---
id: get-started-with-langgraph-up-react-a-practical-langgraph-template.md
title: 'Introdução ao langgraph-up-react: Um modelo prático de LangGraph'
author: Min Yin
date: 2025-09-11T00:00:00.000Z
desc: >-
  introdução do langgraph-up-react, um modelo LangGraph + ReAct pronto a usar
  para agentes ReAct.
cover: assets.zilliz.com/Chat_GPT_Image_Sep_12_2025_12_09_04_PM_804305620a.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LangGraph, ReAct'
meta_keywords: 'Milvus, AI Agents, LangGraph, ReAct, langchain'
meta_title: |
  Getting Started with langgraph-up-react: A LangGraph Template
origin: >-
  https://milvus.io/blog/get-started-with-langgraph-up-react-a-practical-langgraph-template.md
---
<p>Os agentes de IA estão a tornar-se um padrão central na IA aplicada. Cada vez mais projectos estão a ultrapassar os avisos únicos e a ligar modelos a ciclos de tomada de decisões. Isso é empolgante, mas também significa gerenciar o estado, coordenar ferramentas, lidar com ramificações e adicionar transferências humanas - coisas que não são imediatamente óbvias.</p>
<p><a href="https://github.com/langchain-ai/langgraph"><strong>O LangGraph</strong></a> é uma boa escolha para esta camada. É uma estrutura de IA que fornece loops, condicionais, persistência, controlos humanos no loop e streaming - estrutura suficiente para transformar uma ideia numa verdadeira aplicação multi-agente. No entanto, o LangGraph tem uma curva de aprendizagem acentuada. A sua documentação é rápida, as abstracções demoram algum tempo a habituar-se e passar de uma simples demonstração para algo que parece um produto pode ser frustrante.</p>
<p>Recentemente, comecei a usar <a href="https://github.com/webup/langgraph-up-react"><strong>o langgraph-up-react - um</strong></a>modelo LangGraph + ReAct pronto a usar para agentes ReAct. Ele reduz a configuração, vem com padrões sãos e permite que você se concentre no comportamento em vez de no boilerplate. Neste post, mostrarei como começar a usar o LangGraph usando este modelo.</p>
<h2 id="Understanding-ReAct-Agents" class="common-anchor-header">Entendendo os agentes ReAct<button data-href="#Understanding-ReAct-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de mergulhar no modelo em si, vale a pena olhar para o tipo de agente que estaremos construindo. Um dos padrões mais comuns hoje em dia é a estrutura <strong>ReAct (Reason + Act)</strong>, introduzida pela primeira vez no documento de 2022 do Google <em>"</em><a href="https://arxiv.org/abs/2210.03629"><em>ReAct: Synergizing Reasoning and Acting in Language Models</em></a><em>"</em><a href="https://arxiv.org/abs/2210.03629"><em>.</em></a></p>
<p>A ideia é simples: em vez de tratar o raciocínio e a ação como separados, o ReAct combina-os num ciclo de feedback que se assemelha muito à resolução de problemas humanos. O agente <strong>raciocina</strong> sobre o problema, <strong>actua</strong> chamando uma ferramenta ou API, e depois <strong>observa</strong> o resultado antes de decidir o que fazer a seguir. Este ciclo simples - raciocinar → agir → observar - permite que os agentes se adaptem dinamicamente em vez de seguirem um guião fixo.</p>
<p>Eis como as peças se encaixam:</p>
<ul>
<li><p><strong>Razão</strong>: O modelo divide os problemas em etapas, planeia estratégias e pode até corrigir erros a meio do caminho.</p></li>
<li><p><strong>Agir</strong>: Com base no raciocínio, o agente chama ferramentas - seja um motor de busca, uma calculadora ou a sua própria API personalizada.</p></li>
<li><p><strong>Observar</strong>: O agente olha para a saída da ferramenta, filtra os resultados e alimenta a sua próxima ronda de raciocínio.</p></li>
</ul>
<p>Este ciclo tornou-se rapidamente a espinha dorsal dos agentes de IA modernos. Você verá traços dele em plug-ins do ChatGPT, pipelines RAG, assistentes inteligentes e até mesmo na robótica. No nosso caso, é a base sobre a qual o modelo <code translate="no">langgraph-up-react</code> se constrói.</p>
<h2 id="Understanding-LangGraph" class="common-anchor-header">Entendendo o LangGraph<button data-href="#Understanding-LangGraph" class="anchor-icon" translate="no">
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
    </button></h2><p>Agora que vimos o padrão ReAct, a próxima pergunta é: como é que se implementa algo assim na prática? Fora da caixa, a maioria dos modelos de linguagem não lida muito bem com o raciocínio em várias etapas. Cada chamada é sem estado: o modelo gera uma resposta e esquece tudo assim que termina. Isto torna difícil transportar resultados intermédios para a frente ou ajustar passos posteriores com base nos anteriores.</p>
<p><a href="https://github.com/langchain-ai/langgraph"><strong>O LangGraph</strong></a> preenche esta lacuna. Em vez de tratar cada pedido como um caso isolado, dá-lhe uma forma de dividir tarefas complexas em passos, recordar o que aconteceu em cada ponto e decidir o que fazer a seguir com base no estado atual. Por outras palavras, transforma o processo de raciocínio de um agente em algo estruturado e repetível, em vez de uma cadeia de avisos ad-hoc.</p>
<p>Pode pensar-se nisto como um <strong>fluxograma para o raciocínio da IA</strong>:</p>
<ul>
<li><p><strong>Analisar</strong> a consulta do utilizador</p></li>
<li><p><strong>Selecionar</strong> a ferramenta certa para a tarefa</p></li>
<li><p><strong>Executar</strong> a tarefa chamando a ferramenta</p></li>
<li><p><strong>Processar</strong> os resultados</p></li>
<li><p><strong>Verificar</strong> se a tarefa está concluída; caso contrário, voltar atrás e continuar o raciocínio</p></li>
<li><p><strong>Emitir</strong> a resposta final</p></li>
</ul>
<p>Ao longo do processo, o LangGraph trata do <strong>armazenamento de memória</strong> para que os resultados de passos anteriores não se percam e integra-se numa <strong>biblioteca de ferramentas externa</strong> (APIs, bases de dados, pesquisa, calculadoras, sistemas de ficheiros, etc.).</p>
<p>É por isso que se chama <em>LangGraph</em>: <strong>Lang (Language) + Graph - uma</strong>estrutura para organizar a forma como os modelos de linguagem pensam e actuam ao longo do tempo.</p>
<h2 id="Understanding-langgraph-up-react" class="common-anchor-header">Entendendo o langgraph-up-react<button data-href="#Understanding-langgraph-up-react" class="anchor-icon" translate="no">
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
    </button></h2><p>O LangGraph é poderoso, mas tem um custo adicional. A configuração da gestão de estados, a conceção de nós e arestas, o tratamento de erros e a ligação de modelos e ferramentas demoram tempo. A depuração de fluxos de várias etapas também pode ser dolorosa - quando algo quebra, o problema pode estar em qualquer nó ou transição. À medida que os projectos crescem, mesmo as pequenas alterações podem repercutir-se na base de código e tornar tudo mais lento.</p>
<p>É aqui que um modelo maduro faz uma enorme diferença. Em vez de começar do zero, um modelo fornece uma estrutura comprovada, ferramentas pré-construídas e scripts que simplesmente funcionam. Você pula o boilerplate e se concentra diretamente na lógica do agente.</p>
<p><a href="https://github.com/webup/langgraph-up-react"><strong>O langgraph-up-react</strong></a> é um desses modelos. Ele foi projetado para ajudá-lo a criar um agente LangGraph ReAct rapidamente, com:</p>
<ul>
<li><p>🔧 <strong>Ecossistema de ferramentas embutido</strong>: adaptadores e utilitários prontos para usar fora da caixa</p></li>
<li><p><strong>Início rápido</strong>: configuração simples e um agente funcional em minutos</p></li>
<li><p>Testes <strong>incluídos</strong>: testes unitários e testes de integração para garantir a confiança à medida que se estende</p></li>
<li><p><strong>Configuração pronta para produção</strong>: padrões de arquitetura e scripts que poupam tempo na implementação</p></li>
</ul>
<p>Resumindo, ele cuida da parte burocrática para que você possa se concentrar na criação de agentes que realmente resolvam seus problemas de negócios.</p>
<h2 id="Getting-Started-with-the-langgraph-up-react-Template" class="common-anchor-header">Primeiros passos com o modelo langgraph-up-react<button data-href="#Getting-Started-with-the-langgraph-up-react-Template" class="anchor-icon" translate="no">
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
    </button></h2><p>Colocar o modelo em execução é simples. Aqui está o processo de configuração passo a passo:</p>
<ol>
<li>Instalar as dependências do ambiente</li>
</ol>
<pre><code translate="no">curl -<span class="hljs-title class_">LsSf</span> <span class="hljs-attr">https</span>:<span class="hljs-comment">//astral.sh/uv/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Clonar o projeto</li>
</ol>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/webup/langgraph-up-react.git
<span class="hljs-built_in">cd</span> langgraph-up-react
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>Instalar dependências</li>
</ol>
<pre><code translate="no">uv <span class="hljs-built_in">sync</span> --dev
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>Configurar o ambiente</li>
</ol>
<p>Copie a configuração de exemplo e adicione suas chaves:</p>
<pre><code translate="no"><span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p>Edite .env e defina pelo menos um provedor de modelo mais sua chave da API Tavily:</p>
<pre><code translate="no">TAVILY_API_KEY=your-tavily-api-key      <span class="hljs-comment"># Required for web search  </span>
DASHSCOPE_API_KEY=your-dashscope-api-key  <span class="hljs-comment"># Qwen (default recommended)  </span>
OPENAI_API_KEY=your-openai-api-key        <span class="hljs-comment"># OpenAI or compatible platforms  </span>
<span class="hljs-comment"># OPENAI_API_BASE=https://your-api-endpoint  # If using OpenAI-compatible API  </span>
REGION=us                <span class="hljs-comment"># Optional: region flag  </span>
ENABLE_DEEPWIKI=true      <span class="hljs-comment"># Optional: enable document tools  </span>
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>Iniciar o projeto</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># Start development server (without UI)</span>
make dev

<span class="hljs-comment"># Start development server with LangGraph Studio UI</span>
make dev_ui
<button class="copy-code-btn"></button></code></pre>
<p>Seu servidor de desenvolvimento estará agora pronto para testes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/template_set_up_a42d1819ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="What-Can-You-Build-with-langgraph-up-react" class="common-anchor-header">O que você pode construir com o langgraph-up-react?<button data-href="#What-Can-You-Build-with-langgraph-up-react" class="anchor-icon" translate="no">
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
    </button></h2><p>Então, o que você pode realmente fazer uma vez que o modelo está instalado e funcionando? Aqui estão dois exemplos concretos que mostram como pode ser aplicado em projectos reais.</p>
<h3 id="Enterprise-Knowledge-Base-QA-Agentic-RAG" class="common-anchor-header">Perguntas e respostas da base de conhecimentos da empresa (Agentic RAG)</h3><p>Um caso de utilização comum é um assistente interno de perguntas e respostas para o conhecimento da empresa. Pense em manuais de produtos, documentos técnicos, FAQs - informações úteis mas dispersas. Com <code translate="no">langgraph-up-react</code>, pode criar um agente que indexa estes documentos numa base de dados vetorial <a href="https://milvus.io/"><strong>Milvus</strong></a>, recupera as passagens mais relevantes e gera respostas precisas baseadas no contexto.</p>
<p>Para a implementação, o Milvus oferece opções flexíveis: <strong>Lite</strong> para prototipagem rápida, <strong>Standalone</strong> para cargas de trabalho de produção de tamanho médio e <strong>Distributed</strong> para sistemas de escala empresarial. Também será necessário ajustar os parâmetros do índice (por exemplo, HNSW) para equilibrar a velocidade e a precisão, e configurar a monitorização da latência e da recuperação para garantir que o sistema se mantém fiável sob carga.</p>
<h3 id="Multi-Agent-Collaboration" class="common-anchor-header">Colaboração de vários agentes</h3><p>Outro caso de utilização poderoso é a colaboração entre vários agentes. Em vez de um agente tentar fazer tudo, define-se vários agentes especializados que trabalham em conjunto. Num fluxo de trabalho de desenvolvimento de software, por exemplo, um Agente Gestor de Produto decompõe os requisitos, um Agente Arquiteto elabora o design, um Agente Programador escreve código e um Agente de Teste valida os resultados.</p>
<p>Essa orquestração destaca os pontos fortes do LangGraph - gerenciamento de estado, ramificação e coordenação entre agentes. Cobriremos essa configuração em mais detalhes em um artigo posterior, mas o ponto principal é que <code translate="no">langgraph-up-react</code> torna prático tentar esses padrões sem gastar semanas em andaimes.</p>
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
    </button></h2><p>Construir agentes confiáveis não se trata apenas de prompts inteligentes - trata-se de estruturar o raciocínio, gerenciar o estado e conectar tudo em um sistema que você pode realmente manter. O LangGraph fornece a estrutura para fazer isso, e o <code translate="no">langgraph-up-react</code> diminui a barreira ao lidar com o boilerplate para que você possa se concentrar no comportamento do agente.</p>
<p>Com este modelo, pode criar projectos como sistemas de Q&amp;A de bases de conhecimento ou fluxos de trabalho multi-agente sem se perder na configuração. É um ponto de partida que poupa tempo, evita armadilhas comuns e torna as experiências com o LangGraph muito mais fáceis.</p>
<p>No próximo post, vou aprofundar um tutorial prático - mostrando passo a passo como estender o modelo e construir um agente funcional para um caso de uso real usando LangGraph, <code translate="no">langgraph-up-react</code> e o banco de dados vetorial Milvus. Fique ligado.</p>
