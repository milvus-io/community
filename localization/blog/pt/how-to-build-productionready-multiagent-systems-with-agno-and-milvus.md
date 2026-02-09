---
id: how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md
title: Como criar sistemas multiagentes prontos para produção com Agno e Milvus
author: Min Yin
date: 2026-02-10T00:00:00.000Z
cover: assets.zilliz.com/cover_b5fc8a3c48.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  production-ready multi-agent systems, Agno framework, Milvus vector database,
  AgentOS deployment, LLM agent architecture
meta_title: |
  How to Build Production-Ready Multi-Agent Systems with Agno and Milvus
desc: >-
  Saiba como criar, implantar e dimensionar sistemas multiagentes prontos para
  produção usando Agno, AgentOS e Milvus para cargas de trabalho do mundo real.
origin: >-
  https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md
---
<p>Se você está criando agentes de IA, provavelmente já bateu nesta parede: sua demonstração funciona muito bem, mas colocá-la em produção é uma história totalmente diferente.</p>
<p>Cobrimos o gerenciamento de memória do agente e o reranking em publicações anteriores. Agora vamos enfrentar o maior desafio: criar agentes que realmente se sustentem na produção.</p>
<p>A realidade é a seguinte: os ambientes de produção são confusos. Um único agente raramente dá conta do recado, e é por isso que os sistemas multiagentes estão por toda parte. Mas os frameworks disponíveis hoje tendem a cair em dois campos: os leves que demonstram bem, mas quebram sob carga real, ou os poderosos que levam uma eternidade para aprender e construir.</p>
<p>Eu tenho experimentado o <a href="https://github.com/agno-agi/agno">Agno</a> recentemente, e ele parece atingir um meio termo razoável - focado na prontidão de produção sem complexidade excessiva. O projeto ganhou mais de 37.000 estrelas no GitHub em poucos meses, o que sugere que outros desenvolvedores também o consideram útil.</p>
<p>Neste post, eu vou compartilhar o que eu aprendi enquanto construía um sistema multi-agente usando Agno com <a href="https://milvus.io/">Milvus</a> como camada de memória. Veremos como o Agno se compara a alternativas como o LangGraph e uma implementação completa que pode experimentar.</p>
<h2 id="What-Is-Agno" class="common-anchor-header">O que é o Agno?<button data-href="#What-Is-Agno" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/agno-agi/agno">Agno</a> é uma estrutura multi-agente construída especificamente para uso em produção. Ele tem duas camadas distintas:</p>
<ul>
<li><p><strong>Camada de estrutura Agno</strong>: Onde se define a lógica do agente</p></li>
<li><p><strong>Camada de tempo de execução do AgentOS</strong>: Transforma essa lógica em serviços HTTP que você pode realmente implantar</p></li>
</ul>
<p>Pense da seguinte maneira: a camada de estrutura define <em>o que</em> os agentes devem fazer, enquanto o AgentOS lida com a <em>forma como</em> esse trabalho é executado e servido.</p>
<h3 id="The-Framework-Layer" class="common-anchor-header">A camada de estrutura</h3><p>É com ela que você trabalha diretamente. Ela introduz três conceitos principais:</p>
<ul>
<li><p><strong>Agente</strong>: lida com um tipo específico de tarefa</p></li>
<li><p><strong>Equipa</strong>: Coordena vários agentes para resolver problemas complexos</p></li>
<li><p><strong>Fluxo de trabalho</strong>: Define a ordem e a estrutura de execução</p></li>
</ul>
<p>Uma coisa que apreciei: não é necessário aprender uma nova DSL ou desenhar fluxogramas. O comportamento do agente é definido usando chamadas de função Python padrão. A estrutura lida com a invocação LLM, execução de ferramentas e gerenciamento de memória.</p>
<h3 id="The-AgentOS-Runtime-Layer" class="common-anchor-header">A camada de tempo de execução do AgentOS</h3><p>O AgentOS foi projetado para grandes volumes de solicitação por meio da execução assíncrona, e sua arquitetura sem estado torna o escalonamento simples.</p>
<p>Os principais recursos incluem:</p>
<ul>
<li><p>Integração FastAPI incorporada para expor agentes como pontos de extremidade HTTP</p></li>
<li><p>Gerenciamento de sessão e respostas de streaming</p></li>
<li><p>Monitorização de pontos finais</p></li>
<li><p>Suporte a escalonamento horizontal</p></li>
</ul>
<p>Na prática, o AgentOS lida com a maior parte do trabalho de infraestrutura, o que permite que você se concentre na lógica do agente em si.</p>
<p>Uma visão de alto nível da arquitetura do Agno é mostrada abaixo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_dfbf444ee6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Agno-vs-LangGraph" class="common-anchor-header">Agno vs. LangGraph<button data-href="#Agno-vs-LangGraph" class="anchor-icon" translate="no">
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
    </button></h2><p>Para entender onde o Agno se encaixa, vamos compará-lo com o LangGraph - um dos frameworks multiagentes mais usados.</p>
<p><a href="https://www.langchain.com/langgraph"><strong>O LangGraph</strong></a> usa uma máquina de estados baseada em gráficos. O fluxo de trabalho completo do agente é modelado como um gráfico: as etapas são nós, os caminhos de execução são arestas. Isto funciona bem quando o seu processo é fixo e estritamente ordenado. Mas para cenários abertos ou de conversação, pode parecer restritivo. À medida que as interações se tornam mais dinâmicas, manter um gráfico limpo torna-se mais difícil.</p>
<p><strong>O Agno</strong> adota uma abordagem diferente. Em vez de ser uma camada de orquestração pura, é um sistema de ponta a ponta. Defina o comportamento do agente, e o AgentOS o expõe automaticamente como um serviço HTTP pronto para produção, com monitoramento, escalabilidade e suporte a conversas de várias voltas incorporado. Sem gateway de API separado, sem gerenciamento de sessão personalizado, sem ferramentas operacionais extras.</p>
<p>Aqui está uma comparação rápida:</p>
<table>
<thead>
<tr><th>Dimensão</th><th>LangGraph</th><th>Agno</th></tr>
</thead>
<tbody>
<tr><td>Modelo de orquestração</td><td>Definição explícita do gráfico usando nós e arestas</td><td>Fluxos de trabalho declarativos definidos em Python</td></tr>
<tr><td>Gestão de estados</td><td>Classes de estado personalizadas definidas e geridas pelos programadores</td><td>Sistema de memória incorporado</td></tr>
<tr><td>Depuração e observabilidade</td><td>LangSmith (pago)</td><td>AgentOS UI (código aberto)</td></tr>
<tr><td>Modelo de tempo de execução</td><td>Integrado num tempo de execução existente</td><td>Serviço autónomo baseado na FastAPI</td></tr>
<tr><td>Complexidade da implementação</td><td>Requer configuração adicional através do LangServe</td><td>Funciona de imediato</td></tr>
</tbody>
</table>
<p>O LangGraph dá-lhe mais flexibilidade e controlo mais preciso. O Agno optimiza o tempo de produção mais rápido. A escolha certa depende do estágio do seu projeto, da infraestrutura existente e do nível de personalização que você precisa. Se não tiver a certeza, executar uma pequena prova de conceito com ambos é provavelmente a forma mais fiável de decidir.</p>
<h2 id="Choosing-Milvus-for-the-Agent-Memory-Layer" class="common-anchor-header">Escolhendo Milvus para a camada de memória do agente<button data-href="#Choosing-Milvus-for-the-Agent-Memory-Layer" class="anchor-icon" translate="no">
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
    </button></h2><p>Depois de escolher uma estrutura, a próxima decisão é como armazenar a memória e o conhecimento. Para isso, usamos o Milvus. <a href="https://milvus.io/">O Milvus</a> é o banco de dados vetorial de código aberto mais popular criado para cargas de trabalho de IA, com mais de <a href="https://github.com/milvus-io/milvus">42.000</a> estrelas <a href="https://github.com/milvus-io/milvus">no GitHub</a>.</p>
<p><strong>A Agno tem suporte nativo ao Milvus.</strong> O módulo <code translate="no">agno.vectordb.milvus</code> envolve recursos de produção como gerenciamento de conexão, novas tentativas automáticas, gravações em lote e geração de incorporação. Não precisa de construir pools de ligação ou lidar com falhas de rede - algumas linhas de Python dão-lhe uma camada de memória vetorial funcional.</p>
<p><strong>O Milvus se adapta às suas necessidades.</strong> Ele suporta três <a href="https://milvus.io/docs/install-overview.md">modos de implantação:</a></p>
<ul>
<li><p><strong>Milvus Lite</strong>: Leve, baseado em arquivos - ótimo para desenvolvimento e testes locais</p></li>
<li><p><strong>Autónomo</strong>: Implantação de servidor único para cargas de trabalho de produção</p></li>
<li><p><strong>Distribuído</strong>: Cluster completo para cenários de alta escala</p></li>
</ul>
<p>É possível começar com o Milvus Lite para validar a memória do agente localmente e, em seguida, passar para autônomo ou distribuído à medida que o tráfego cresce - sem alterar o código do aplicativo. Essa flexibilidade é especialmente útil quando você está iterando rapidamente nos estágios iniciais, mas precisa de um caminho claro para escalar mais tarde.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_1_1en_e0294d0ffa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Step-by-Step-Building-a-Production-Ready-Agno-Agent-with-Milvus" class="common-anchor-header">Passo a passo: Criando um agente Agno pronto para produção com Milvus<button data-href="#Step-by-Step-Building-a-Production-Ready-Agno-Agent-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Vamos criar um agente pronto para produção do zero.</p>
<p>Começaremos com um exemplo simples de agente único para mostrar o fluxo de trabalho completo. Em seguida, vamos expandi-lo para um sistema multiagente. O AgentOS empacotará tudo automaticamente como um serviço HTTP chamável.</p>
<h3 id="1-Deploying-Milvus-Standalone-with-Docker" class="common-anchor-header">1. Implantação do Milvus Standalone com o Docker</h3><p><strong>(1) Baixe os arquivos de implantação</strong></p>
<pre><code translate="no">**wget** **
&lt;https://github.com/Milvus-io/Milvus/releases/download/v2.****5****.****12****/Milvus-standalone-docker-compose.yml&gt; -O docker-compose.yml**
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Iniciar o serviço Milvus</strong></p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_80575354d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Core-Implementation" class="common-anchor-header">2. Implementação do núcleo</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">from</span> pathlib <span class="hljs-keyword">import</span> Path
<span class="hljs-keyword">from</span> agno.os <span class="hljs-keyword">import</span> AgentOS
<span class="hljs-keyword">from</span> agno.agent <span class="hljs-keyword">import</span> Agent
<span class="hljs-keyword">from</span> agno.models.openai <span class="hljs-keyword">import</span> OpenAIChat
<span class="hljs-keyword">from</span> agno.knowledge.knowledge <span class="hljs-keyword">import</span> Knowledge
<span class="hljs-keyword">from</span> agno.vectordb.milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> agno.knowledge.embedder.openai <span class="hljs-keyword">import</span> OpenAIEmbedder
<span class="hljs-keyword">from</span> agno.db.sqlite <span class="hljs-keyword">import</span> SqliteDb
os.environ\[<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>\] = <span class="hljs-string">&quot;you-key-here&quot;</span>
data_dir = Path(<span class="hljs-string">&quot;./data&quot;</span>)
data_dir.mkdir(exist_ok=<span class="hljs-literal">True</span>)
knowledge_base = Knowledge(
    contents_db=SqliteDb(
        db_file=<span class="hljs-built_in">str</span>(data_dir / <span class="hljs-string">&quot;knowledge_contents.db&quot;</span>),
        knowledge_table=<span class="hljs-string">&quot;knowledge_contents&quot;</span>,
    ),
    vector_db=Milvus(
        collection=<span class="hljs-string">&quot;agno_knowledge&quot;</span>,
        uri=<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>,
        embedder=OpenAIEmbedder(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>),
    ),
)
*<span class="hljs-comment"># Create Agent*</span>
agent = Agent(
    name=<span class="hljs-string">&quot;Knowledge Assistant&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    instructions=\[
        <span class="hljs-string">&quot;You are a knowledge base assistant that helps users query and manage knowledge base content.&quot;</span>,
        <span class="hljs-string">&quot;Answer questions in English.&quot;</span>,
        <span class="hljs-string">&quot;Always search the knowledge base before answering questions.&quot;</span>,
        <span class="hljs-string">&quot;If the knowledge base is empty, kindly prompt the user to upload documents.&quot;</span>
    \],
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    db=SqliteDb(
        db_file=<span class="hljs-built_in">str</span>(data_dir / <span class="hljs-string">&quot;agent.db&quot;</span>),
        session_table=<span class="hljs-string">&quot;agent_sessions&quot;</span>,
    ),
    add_history_to_context=<span class="hljs-literal">True</span>,
    markdown=<span class="hljs-literal">True</span>,
)
agent_os = AgentOS(agents=\[agent\])
app = agent_os.get_app()
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n🚀 Starting service...&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📍 http://localhost:7777&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;💡 Please upload documents to the knowledge base in the UI\n&quot;</span>)
    agent_os.serve(app=<span class="hljs-string">&quot;knowledge_agent:app&quot;</span>, port=<span class="hljs-number">7777</span>, reload=<span class="hljs-literal">False</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>(1) Executando o agente</strong></p>
<pre><code translate="no">**python** **knowledge_agent.py**
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_df885706cf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Connecting-to-the-AgentOS-Console" class="common-anchor-header">3. Ligar à consola do AgentOS</h3><p>https://os.agno.com/</p>
<p><strong>(1) Criar uma conta e iniciar sessão</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_db0af51e58.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(2) Ligar o agente ao AgentOS</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_0a8c6f9436.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(3) Configurar a porta exposta e o nome do agente</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_3844011799.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(4) Adicionar documentos e indexá-los no Milvus</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_776ea7ca11.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_90b97c4660.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_a98262d8c5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_58b7d77eea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(5) Testar o agente de ponta a ponta</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_6e61038ba5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nesta configuração, o Milvus trata da recuperação semântica de alto desempenho. Quando o assistente da base de conhecimentos recebe uma pergunta técnica, invoca a ferramenta <code translate="no">search_knowledge</code> para incorporar a consulta, recupera os fragmentos de documentos mais relevantes do Milvus e utiliza esses resultados como base para a sua resposta.</p>
<p>O Milvus oferece três opções de implementação, permitindo-lhe escolher uma arquitetura que se adeqúe aos seus requisitos operacionais, mantendo as APIs ao nível da aplicação consistentes em todos os modos de implementação.</p>
<p>A demonstração acima mostra o fluxo principal de recuperação e geração. No entanto, para passar esta conceção para um ambiente de produção, é necessário discutir mais pormenorizadamente vários aspectos da arquitetura.</p>
<h2 id="How-Retrieval-Results-Are-Shared-Across-Agents" class="common-anchor-header">Como os resultados da recuperação são compartilhados entre os agentes<button data-href="#How-Retrieval-Results-Are-Shared-Across-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>O modo Team do Agno tem uma opção <code translate="no">share_member_interactions=True</code> que permite que os agentes posteriores herdem o histórico completo de interação dos agentes anteriores. Na prática, isso significa que quando o primeiro agente recupera informações do Milvus, os agentes subsequentes podem reutilizar esses resultados em vez de executar a mesma pesquisa novamente.</p>
<ul>
<li><p><strong>A vantagem:</strong> Os custos de recuperação são amortizados por toda a equipa. Uma pesquisa vetorial suporta vários agentes, reduzindo as consultas redundantes.</p></li>
<li><p><strong>O lado negativo:</strong> A qualidade da recuperação é ampliada. Se a pesquisa inicial retornar resultados incompletos ou imprecisos, esse erro se propaga para todos os agentes que dependem dela.</p></li>
</ul>
<p>É por isso que a precisão da recuperação é ainda mais importante em sistemas multiagentes. Uma recuperação incorrecta não prejudica apenas a resposta de um agente, mas afecta toda a equipa.</p>
<p>Aqui está um exemplo de configuração de equipa:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> agno.team <span class="hljs-keyword">import</span> Team
analyst = Agent(
    name=<span class="hljs-string">&quot;Data Analyst&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    instructions=\[<span class="hljs-string">&quot;Analyze data and extract key metrics&quot;</span>\]
)
writer = Agent(
    name=<span class="hljs-string">&quot;Report Writer&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    instructions=\[<span class="hljs-string">&quot;Write reports based on the analysis results&quot;</span>\]
)
team = Team(
    agents=\[analyst, writer\],
    share_member_interactions=<span class="hljs-literal">True</span>,  *<span class="hljs-comment"># Share knowledge retrieval results*</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Why-Agno-and-Milvus-Are-Layered-Separately" class="common-anchor-header">Porque é que o Agno e o Milvus são colocados em camadas separadas<button data-href="#Why-Agno-and-Milvus-Are-Layered-Separately" class="anchor-icon" translate="no">
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
    </button></h2><p>Nesta arquitetura, <strong>o Agno</strong> situa-se na camada de conversação e orquestração. É responsável pela gestão do fluxo de diálogo, pela coordenação dos agentes e pela manutenção do estado da conversação, com o histórico da sessão guardado numa base de dados relacional. O conhecimento real do domínio do sistema - tal como a documentação do produto e os relatórios técnicos - é tratado separadamente e armazenado como vetor de incorporação em <strong>Milvus</strong>. Esta divisão clara mantém a lógica de conversação e o armazenamento de conhecimento totalmente desacoplados.</p>
<p>Porque é que isto é importante em termos operacionais:</p>
<ul>
<li><p><strong>Escalonamento independente</strong>: À medida que a demanda do Agno cresce, adicione mais instâncias do Agno. À medida que o volume de consultas aumenta, expanda o Milvus adicionando nós de consulta. Cada camada é dimensionada de forma isolada.</p></li>
<li><p><strong>Necessidades de hardware diferentes</strong>: O Agno é limitado pela CPU e pela memória (inferência LLM, execução do fluxo de trabalho). O Milvus é otimizado para recuperação vetorial de alto rendimento (E/S de disco, às vezes aceleração de GPU). Separá-los evita a contenção de recursos.</p></li>
<li><p><strong>Otimização de custos</strong>: É possível ajustar e alocar recursos para cada camada de forma independente.</p></li>
</ul>
<p>Essa abordagem em camadas oferece uma arquitetura mais eficiente, resiliente e pronta para produção.</p>
<h2 id="What-to-Monitor-When-Using-Agno-with-Milvus" class="common-anchor-header">O que monitorar ao usar o Agno com o Milvus<button data-href="#What-to-Monitor-When-Using-Agno-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>O Agno possui recursos de avaliação integrados, mas a adição do Milvus amplia o que deve ser observado. Com base na nossa experiência, concentre-se em três áreas:</p>
<ul>
<li><p><strong>Qualidade da recuperação</strong>: Os documentos devolvidos pelo Milvus são realmente relevantes para a consulta ou apenas superficialmente semelhantes ao nível do vetor?</p></li>
<li><p><strong>Fidelidade da resposta</strong>: A resposta final é fundamentada no conteúdo recuperado ou o LLM está a gerar afirmações sem fundamento?</p></li>
<li><p><strong>Repartição da latência de ponta a ponta</strong>: Não se limite a registar o tempo total de resposta. Divida-o por fase - geração de embedding, pesquisa de vectores, montagem de contexto, inferência LLM - para que possa identificar onde ocorrem os abrandamentos.</p></li>
</ul>
<p><strong>Um exemplo prático:</strong> Quando a sua coleção Milvus cresce de 1 milhão para 10 milhões de vectores, pode notar que a latência de recuperação aumenta. Isso geralmente é um sinal para ajustar os parâmetros do índice (como <code translate="no">nlist</code> e <code translate="no">nprobe</code>) ou considerar a mudança de uma implantação autônoma para uma distribuída.</p>
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
    </button></h2><p>A criação de sistemas de agentes prontos para a produção exige mais do que a ligação de chamadas LLM e demonstrações de recuperação. São necessários limites arquitectónicos claros, uma infraestrutura que seja dimensionada de forma independente e observabilidade para detetar problemas atempadamente.</p>
<p>Neste post, mostrei como o Agno e o Milvus podem trabalhar juntos: Agno para orquestração multiagente, Milvus para memória escalável e recuperação semântica. Ao manter essas camadas separadas, é possível passar do protótipo para a produção sem reescrever a lógica central - e escalar cada componente conforme necessário.</p>
<p>Se estiver a experimentar configurações semelhantes, gostaria de saber o que está a funcionar para si.</p>
<p><strong>Perguntas sobre o Milvus?</strong> Junte-se ao nosso <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canal Slack</a> ou marque uma sessão de 20 minutos <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">do Milvus Office Hours</a>.</p>
