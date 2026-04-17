---
id: fix-rag-retrieval-errors-crag-langgraph-milvus.md
title: 'Corrigir erros de recuperação de RAG com CRAG, LangGraph e Milvus'
author: Min Yin
date: 2026-3-23
cover: assets.zilliz.com/cover_CRAG_a05dddbaa2_aafaad6bc0.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'CRAG, RAG retrieval, LangGraph, Milvus, hybrid retrieval'
meta_title: |
  Fix RAG Retrieval Errors with CRAG, LangGraph, and Milvus
desc: >-
  Elevada semelhança mas respostas erradas? Saiba como o CRAG adiciona avaliação
  e correção aos pipelines RAG. Construa um sistema pronto para produção com
  LangGraph + Milvus.
origin: 'https://milvus.io/blog/fix-rag-retrieval-errors-crag-langgraph-milvus.md'
---
<p>À medida que as aplicações LLM entram em produção, as equipas precisam cada vez mais que os seus modelos respondam a perguntas baseadas em dados privados ou informações em tempo real. A <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">geração aumentada por</a> recuperação (RAG) - em que o modelo obtém informações de uma base de conhecimentos externa no momento da consulta - é a abordagem padrão. Reduz as alucinações e mantém as respostas actualizadas.</p>
<p>Mas aqui está um problema que surge rapidamente na prática: <strong>um documento pode ter uma pontuação elevada em termos de semelhança e, ainda assim, estar completamente errado para a pergunta.</strong> Os pipelines RAG tradicionais equiparam a similaridade à relevância. Na produção, esse pressuposto é quebrado. Um resultado com a melhor classificação pode estar desatualizado, estar apenas tangencialmente relacionado ou não conter o detalhe exato de que o utilizador necessita.</p>
<p>O CRAG (Corrective Retrieval-Augmented Generation) resolve este problema adicionando avaliação e correção entre a recuperação e a geração. Em vez de confiar cegamente nas pontuações de semelhança, o sistema verifica se o conteúdo recuperado responde efetivamente à pergunta - e corrige a situação quando não responde.</p>
<p>Este artigo apresenta a construção de um sistema CRAG pronto para produção usando LangChain, LangGraph e <a href="https://milvus.io/intro">Milvus</a>.</p>
<h2 id="Three-Retrieval-Problems-Traditional-RAG-Doesnt-Solve" class="common-anchor-header">Três problemas de recuperação que o RAG tradicional não resolve<button data-href="#Three-Retrieval-Problems-Traditional-RAG-Doesnt-Solve" class="anchor-icon" translate="no">
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
    </button></h2><p>A maioria das falhas de RAG em produção tem origem num de três problemas:</p>
<p><strong>Incompatibilidade de recuperação.</strong> O documento é topicamente semelhante, mas não responde à pergunta. Pergunte como configurar um certificado HTTPS no Nginx, e o sistema pode retornar um guia de configuração do Apache, um passo a passo de 2019 ou uma explicação geral sobre como o TLS funciona. Semanticamente próximo, praticamente inútil.</p>
<p><strong>Conteúdo obsoleto.</strong> <a href="https://zilliz.com/learn/vector-similarity-search">A pesquisa vetorial</a> não tem qualquer conceito de atualidade. Consulte "Python async best practices" e você obterá uma mistura de padrões de 2018 e padrões de 2024, classificados puramente pela distância de incorporação. O sistema não consegue distinguir o que o utilizador realmente precisa.</p>
<p><strong>Contaminação da memória.</strong> Este problema agrava-se com o tempo e é frequentemente o mais difícil de resolver. Digamos que o sistema recupera uma referência de API desactualizada e gera código incorreto. Essa saída incorrecta é armazenada na memória. Na próxima consulta semelhante, o sistema recupera-o novamente - reforçando o erro. As informações obsoletas e recentes misturam-se gradualmente e a fiabilidade do sistema diminui a cada ciclo.</p>
<p>Estes não são casos isolados. Aparecem regularmente quando um sistema RAG lida com tráfego real. É por isso que as verificações da qualidade da recuperação são um requisito e não um "bom ter".</p>
<h2 id="What-Is-CRAG-Evaluate-First-Then-Generate" class="common-anchor-header">O que é o CRAG? Avaliar primeiro, depois gerar<button data-href="#What-Is-CRAG-Evaluate-First-Then-Generate" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>O Corrective Retrieval-Augmented Generation (CRAG)</strong> é um método que adiciona uma etapa de avaliação e correção entre a recuperação e a geração numa cadeia de RAG. Foi introduzido no documento <a href="https://openreview.net/forum?id=JnWJbrnaUE"><em>Corrective Retrieval Augmented Generation</em></a> (Yan et al., 2024). Ao contrário do RAG tradicional, que toma uma decisão binária - utilizar o documento ou rejeitá-lo - o RAG avalia a relevância de cada resultado recuperado e encaminha-o através de uma de três vias de correção antes de chegar ao modelo linguístico.</p>
<p>O RAG tradicional tem dificuldades quando os resultados da recuperação se situam numa zona cinzenta: parcialmente relevantes, algo datados ou com falta de uma peça-chave. Uma simples porta de sim/não ou descarta informações parciais úteis ou deixa passar conteúdo ruidoso. O CRAG reformula o pipeline de <strong>recuperar → gerar</strong> para <strong>recuperar → avaliar → corrigir → gerar</strong>, dando ao sistema a oportunidade de corrigir a qualidade da recuperação antes de começar a geração.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/fix_rag_retrieval_errors_crag_langgraph_milvus_1_11a820f454.png" alt="CRAG four-step workflow: Retrieval → Evaluation → Correction → Generation, showing how documents are scored and routed" class="doc-image" id="crag-four-step-workflow:-retrieval-→-evaluation-→-correction-→-generation,-showing-how-documents-are-scored-and-routed" />
   <span>Fluxo de trabalho em quatro etapas do CRAG: Recuperação → Avaliação → Correção → Geração, mostrando como os documentos são classificados e encaminhados</span> </span></p>
<p>Os resultados recuperados são classificados numa de três categorias:</p>
<ul>
<li><strong>Correto:</strong> responde diretamente à consulta; utilizável após um ligeiro refinamento</li>
<li><strong>Ambíguo:</strong> parcialmente relevante; necessita de informação suplementar</li>
<li><strong>Incorreto:</strong> irrelevante; descartar e recorrer a fontes alternativas</li>
</ul>
<table>
<thead>
<tr><th>Decisão</th><th>Confiança</th><th>Ação</th></tr>
</thead>
<tbody>
<tr><td>Correta</td><td>&gt; 0.9</td><td>Aperfeiçoar o conteúdo do documento</td></tr>
<tr><td>Ambíguo</td><td>0.5-0.9</td><td>Refinar o documento + complementar com pesquisa na Web</td></tr>
<tr><td>Incorreto</td><td>&lt; 0.5</td><td>Rejeitar os resultados da pesquisa; recorrer inteiramente à pesquisa na Web</td></tr>
</tbody>
</table>
<h3 id="Content-Refinement" class="common-anchor-header">Refinamento do conteúdo</h3><p>O CRAG também aborda um problema mais subtil com o RAG padrão: a maioria dos sistemas alimenta o modelo com o documento recuperado na íntegra. Isto desperdiça tokens e dilui o sinal - o modelo tem de percorrer parágrafos irrelevantes para encontrar a única frase que realmente interessa. O CRAG refina primeiro o conteúdo recuperado, extraindo partes relevantes e retirando o resto.</p>
<p>O documento original utiliza tiras de conhecimento e regras heurísticas para este efeito. Na prática, a correspondência de palavras-chave funciona para muitos casos de utilização, e os sistemas de produção podem acrescentar a sumarização baseada em LLM ou a extração estruturada para uma maior qualidade.</p>
<p>O processo de refinamento tem três partes:</p>
<ul>
<li><strong>Decomposição do documento:</strong> extrair passagens-chave de um documento mais longo</li>
<li><strong>Reescrita de consultas:</strong> transformar consultas vagas ou ambíguas em consultas mais direcionadas</li>
<li><strong>Seleção de conhecimentos:</strong> deduplicar, classificar e reter apenas o conteúdo mais útil</li>
</ul>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/fix_rag_retrieval_errors_crag_langgraph_milvus_2_9ec4b6aa81.png" alt="The three-step document refinement process: Document Decomposition (2000 → 500 tokens), Query Rewriting (improved search precision), and Knowledge Selection (filter, rank, and trim)" class="doc-image" id="the-three-step-document-refinement-process:-document-decomposition-(2000-→-500-tokens),-query-rewriting-(improved-search-precision),-and-knowledge-selection-(filter,-rank,-and-trim)" />
   <span>O processo de refinamento de documentos em três etapas: Decomposição de documentos (2000 → 500 tokens), Reescrita de consultas (precisão de pesquisa melhorada) e Seleção de conhecimentos (filtrar, classificar e aparar)</span> </span></p>
<h3 id="The-Evaluator" class="common-anchor-header">O avaliador</h3><p>O avaliador é o núcleo do CRAG. Não se destina a um raciocínio profundo - é uma porta de triagem rápida. Dada uma consulta e um conjunto de documentos recuperados, decide se o conteúdo é suficientemente bom para ser utilizado.</p>
<p>O documento original opta por um modelo T5-Large ajustado em vez de um LLM de uso geral. O raciocínio: a velocidade e a precisão são mais importantes do que a flexibilidade para esta tarefa específica.</p>
<table>
<thead>
<tr><th>Atributo</th><th>T5-Large ajustado</th><th>GPT-4</th></tr>
</thead>
<tbody>
<tr><td>Latência</td><td>10-20 ms</td><td>200 ms+</td></tr>
<tr><td>Exatidão</td><td>92% (experiências em papel)</td><td>TBD</td></tr>
<tr><td>Adequação à tarefa</td><td>Elevada - afinação fina para uma única tarefa, maior precisão</td><td>Média - objetivo geral, mais flexível mas menos especializado</td></tr>
</tbody>
</table>
<h3 id="Web-Search-Fallback" class="common-anchor-header">Apoio à pesquisa na Web</h3><p>Quando a recuperação interna é assinalada como incorrecta ou ambígua, o CRAG pode desencadear uma pesquisa na Web para obter informações mais recentes ou suplementares. Isto actua como uma rede de segurança para consultas sensíveis ao tempo e tópicos em que a base de conhecimentos interna tem lacunas.</p>
<h2 id="Why-Milvus-Is-a-Good-Fit-for-CRAG-in-Production" class="common-anchor-header">Porque é que o Milvus é uma boa opção para o CRAG na produção<button data-href="#Why-Milvus-Is-a-Good-Fit-for-CRAG-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>A eficácia do CRAG depende do que lhe está subjacente. A <a href="https://zilliz.com/learn/what-is-vector-database">base de dados vetorial</a> tem de fazer mais do que a pesquisa básica de semelhanças - tem de suportar o isolamento multi-tenant, a recuperação híbrida e a flexibilidade de esquema que um sistema CRAG de produção exige.</p>
<p>Depois de avaliar várias opções, escolhemos <a href="https://zilliz.com/what-is-milvus">o Milvus</a> por três motivos.</p>
<h3 id="Multi-Tenant-Isolation" class="common-anchor-header">Isolamento de vários inquilinos</h3><p>Nos sistemas baseados em agentes, cada utilizador ou sessão necessita do seu próprio espaço de memória. A abordagem ingénua - uma coleção por inquilino - torna-se rapidamente uma dor de cabeça operacional, especialmente em escala.</p>
<p>Milvus lida com isso com <a href="https://milvus.io/docs/use-partition-key.md">Partition Key</a>. Defina <code translate="no">is_partition_key=True</code> no campo <code translate="no">agent_id</code>, e o Milvus encaminha automaticamente as consultas para a partição correta. Sem dispersão de colecções, sem código de encaminhamento manual.</p>
<p>Nos nossos benchmarks com 10 milhões de vectores em 100 inquilinos, o Milvus com Compactação de Clustering forneceu <strong>QPS 3-5x superior</strong> em comparação com a linha de base não optimizada.</p>
<h3 id="Hybrid-Retrieval" class="common-anchor-header">Recuperação híbrida</h3><p>A pesquisa pura de vectores é insuficiente para SKUs de conteúdo-produto de correspondência exacta, como <code translate="no">SKU-2024-X5</code>, cadeias de versões ou terminologia específica.</p>
<p>O Milvus 2.5 suporta a <a href="https://milvus.io/docs/multi-vector-search.md">recuperação híbrida</a> nativamente: vetores densos para similaridade semântica, vetores esparsos para correspondência de palavras-chave no estilo BM25 e filtragem de metadados escalares - tudo em uma única consulta. Os resultados são fundidos usando o Reciprocal Rank Fusion (RRF), para que não seja necessário criar e fundir pipelines de recuperação separados.</p>
<p>Em um conjunto de dados de 1 milhão de vetores, a latência de recuperação do Milvus Sparse-BM25 foi de <strong>6 ms</strong>, com impacto insignificante no desempenho do CRAG de ponta a ponta.</p>
<h3 id="Flexible-Schema-for-Evolving-Memory" class="common-anchor-header">Esquema flexível para memória em evolução</h3><p>À medida que os pipelines CRAG amadurecem, o modelo de dados evolui com eles. Precisávamos adicionar campos como <code translate="no">confidence</code>, <code translate="no">verified</code>, e <code translate="no">source</code> enquanto iterávamos na lógica de avaliação. Na maioria das bases de dados, isso significa scripts de migração e tempo de inatividade.</p>
<p>O Milvus suporta campos JSON dinâmicos, pelo que os metadados podem ser alargados em tempo real sem interrupções de serviço.</p>
<p>Aqui está um esquema típico:</p>
<pre><code translate="no" class="language-python">fields = [
    FieldSchema(name=<span class="hljs-string">&quot;agent_id&quot;</span>, dtype=DataType.VARCHAR, is_partition_key=<span class="hljs-literal">True</span>),  <span class="hljs-comment"># multi-tenancy</span>
    FieldSchema(name=<span class="hljs-string">&quot;dense_embedding&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>),   <span class="hljs-comment"># semantic retrieval</span>
    FieldSchema(name=<span class="hljs-string">&quot;sparse_embedding&quot;</span>, dtype=DataType.SPARSE_FLOAT_VECTOR),<span class="hljs-comment"># BM25</span>
    FieldSchema(name=<span class="hljs-string">&quot;metadata&quot;</span>, dtype=DataType.JSON),<span class="hljs-comment"># dynamic schema</span>
]

<span class="hljs-comment"># hybrid retrieval + metadata filtering</span>
results = collection.hybrid_search(
    reqs=[
        AnnSearchRequest(data=[dense_vec], anns_field=<span class="hljs-string">&quot;dense_embedding&quot;</span>, limit=<span class="hljs-number">20</span>),
        AnnSearchRequest(data=[sparse_vec], anns_field=<span class="hljs-string">&quot;sparse_embedding&quot;</span>, limit=<span class="hljs-number">20</span>)
    ],
    rerank=RRFRanker(),
    output_fields=[<span class="hljs-string">&quot;metadata&quot;</span>],
    expr=<span class="hljs-string">&#x27;metadata[&quot;confidence&quot;] &gt; 0.9&#x27;</span>,<span class="hljs-comment"># CRAG confidence filtering</span>
    limit=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>O Milvus também simplifica o escalonamento da implantação. Ele oferece <a href="https://milvus.io/docs/install-overview.md">os modos Lite, Standalone e Distributed</a> que são compatíveis com o código - a mudança do desenvolvimento local para um cluster de produção requer apenas a alteração da cadeia de conexão.</p>
<h2 id="Hands-On-Build-a-CRAG-System-with-LangGraph-Middleware-and-Milvus" class="common-anchor-header">Prático: Construir um sistema CRAG com LangGraph Middleware e Milvus<button data-href="#Hands-On-Build-a-CRAG-System-with-LangGraph-Middleware-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Why-the-Middleware-Approach" class="common-anchor-header">Por que a abordagem de middleware?</h3><p>Uma maneira comum de construir CRAG com LangGraph é conectar um gráfico de estado com nós e arestas controlando cada etapa. Isso funciona, mas o gráfico fica emaranhado à medida que a complexidade aumenta, e a depuração torna-se uma dor de cabeça.</p>
<p>Decidimos usar o <strong>padrão Middleware</strong> no LangGraph 1.0. Este intercepta os pedidos antes da chamada do modelo, pelo que a recuperação, avaliação e correção são tratadas num único local coeso. Em comparação com a abordagem de gráfico de estado:</p>
<ul>
<li><strong>Menos código:</strong> a lógica é centralizada, não espalhada pelos nós do gráfico</li>
<li><strong>Mais fácil de seguir:</strong> o fluxo de controlo é lido linearmente</li>
<li><strong>Mais fácil de depurar:</strong> as falhas apontam para um único local, não para uma travessia do grafo</li>
</ul>
<h3 id="Core-Workflow" class="common-anchor-header">Fluxo de trabalho principal</h3><p>O pipeline é executado em quatro etapas:</p>
<ol>
<li><strong>Recuperação:</strong> buscar os 3 principais documentos relevantes do Milvus, com escopo para o locatário atual</li>
<li><strong>Avaliação:</strong> avaliar a qualidade do documento com um modelo ligeiro</li>
<li><strong>Correção:</strong> refinar, complementar com pesquisa na Web ou recuar totalmente com base no veredito</li>
<li><strong>Injeção:</strong> passar o contexto finalizado para o modelo através de um prompt de sistema dinâmico</li>
</ol>
<h3 id="Environment-Setup-and-Data-Preparation" class="common-anchor-header">Configuração do ambiente e preparação de dados</h3><p><strong>Variáveis de ambiente</strong></p>
<pre><code translate="no" class="language-bash"><span class="hljs-keyword">export</span> <span class="hljs-variable constant_">OPENAI_API_KEY</span>=<span class="hljs-string">&quot;your-api-key&quot;</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">TAVILY_API_KEY</span>=<span class="hljs-string">&quot;your-tavily-key&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Criar a coleção Milvus</strong></p>
<p>Antes de executar o código, crie uma coleção no Milvus com um esquema que corresponda à lógica de recuperação.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># filename: crag_agent.py</span>

<span class="hljs-comment"># ============ Import dependencies ============</span>
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">Literal</span>, <span class="hljs-type">List</span>
<span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> AgentMiddleware, before_model, dynamic_prompt
<span class="hljs-keyword">from</span> langchain.chat_models <span class="hljs-keyword">import</span> init_chat_model
<span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain_openai <span class="hljs-keyword">import</span> OpenAIEmbeddings
<span class="hljs-keyword">from</span> langchain_core.documents <span class="hljs-keyword">import</span> Document
<span class="hljs-keyword">from</span> langchain_core.messages <span class="hljs-keyword">import</span> SystemMessage, HumanMessage
<span class="hljs-keyword">from</span> langchain_community.tools.tavily_search <span class="hljs-keyword">import</span> TavilySearchResults


<span class="hljs-comment"># ============ CRAG Middleware (minimal-change version) ============</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">CRAGMiddleware</span>(<span class="hljs-title class_ inherited__">AgentMiddleware</span>):
    <span class="hljs-string">&quot;&quot;&quot;CRAG evaluation and correction middleware (uses official decorator-based hooks to avoid permanently polluting the message stack)&quot;&quot;&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, vector_store: Milvus, agent_id: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-built_in">super</span>().__init__()
        <span class="hljs-variable language_">self</span>.vector_store = vector_store
        <span class="hljs-variable language_">self</span>.agent_id = agent_id  <span class="hljs-comment"># multi-tenant isolation</span>
        <span class="hljs-comment"># Lightweight evaluator: used for relevance judgment (can be replaced with the structured version introduced later)</span>
        <span class="hljs-variable language_">self</span>.evaluator = init_chat_model(<span class="hljs-string">&quot;openai:gpt-4o-mini&quot;</span>, temperature=<span class="hljs-number">0</span>)
        <span class="hljs-comment"># Web search fallback</span>
        <span class="hljs-variable language_">self</span>.web_search = TavilySearchResults(max_results=<span class="hljs-number">3</span>)

<span class="hljs-meta">    @before_model</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">run_crag</span>(<span class="hljs-params">self, state</span>):
        <span class="hljs-string">&quot;&quot;&quot;Run retrieval -&gt; evaluation -&gt; correction before model invocation and prepare the final context&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Get the last user message</span>
        last_msg = state[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>]
        query = <span class="hljs-built_in">getattr</span>(last_msg, <span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>) <span class="hljs-keyword">if</span> <span class="hljs-built_in">hasattr</span>(last_msg, <span class="hljs-string">&quot;content&quot;</span>) <span class="hljs-keyword">else</span> last_msg.get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)

        <span class="hljs-comment"># 1. Retrieval: get documents from Milvus (PartitionKey + confidence filtering)</span>
        docs = <span class="hljs-variable language_">self</span>._retrieve_from_milvus(query)

        <span class="hljs-comment"># 2. Evaluation: three-way decision</span>
        verdict = <span class="hljs-variable language_">self</span>._evaluate_relevance(query, docs)

        <span class="hljs-comment"># 3. Correction: choose the handling strategy based on the verdict</span>
        <span class="hljs-keyword">if</span> verdict == <span class="hljs-string">&quot;incorrect&quot;</span>:
            <span class="hljs-comment"># Retrieval failed, rely entirely on Web search</span>
            web_results = <span class="hljs-variable language_">self</span>._web_search_fallback(query)
            final_context = <span class="hljs-variable language_">self</span>._format_web_results(web_results)
        <span class="hljs-keyword">elif</span> verdict == <span class="hljs-string">&quot;ambiguous&quot;</span>:
            <span class="hljs-comment"># Retrieval is ambiguous, refine documents + supplement with Web search</span>
            refined_docs = <span class="hljs-variable language_">self</span>._refine_documents(docs, query)
            web_results = <span class="hljs-variable language_">self</span>._web_search_fallback(query)
            final_context = <span class="hljs-variable language_">self</span>._merge_context(refined_docs, web_results)
        <span class="hljs-keyword">else</span>:
            <span class="hljs-comment"># Retrieval quality is good, only refine the documents</span>
            refined_docs = <span class="hljs-variable language_">self</span>._refine_documents(docs, query)
            final_context = <span class="hljs-variable language_">self</span>._format_internal_docs(refined_docs)

        <span class="hljs-comment"># 4. Put the context into a temporary key, used only for dynamic prompt assembly in the current model call</span>
        state[<span class="hljs-string">&quot;_crag_context&quot;</span>] = final_context
        <span class="hljs-keyword">return</span> state

<span class="hljs-meta">    @dynamic_prompt</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">attach_context</span>(<span class="hljs-params">self, state, prompt_messages: <span class="hljs-type">List</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Inject the CRAG-generated context as a SystemMessage before the prompt for the current model call&quot;&quot;&quot;</span>
        final_context = state.get(<span class="hljs-string">&quot;_crag_context&quot;</span>)
        <span class="hljs-keyword">if</span> final_context:
            sys_msg = SystemMessage(
                content=<span class="hljs-string">f&quot;Here is some relevant background information. Please answer the user&#x27;s question based on this information:\n\n<span class="hljs-subst">{final_context}</span>&quot;</span>
            )
            <span class="hljs-comment"># Applies only to the current call and is not permanently written into state[&quot;messages&quot;]</span>
            prompt_messages = [sys_msg] + prompt_messages
        <span class="hljs-keyword">return</span> prompt_messages

    <span class="hljs-comment"># ======== Internal methods: retrieval / evaluation / refinement / formatting ========</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_retrieve_from_milvus</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Retrieve documents from Milvus (Partition Key + confidence filtering)&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            <span class="hljs-comment"># Note: different adapter versions may place filter parameters differently; here expr is passed through search_kwargs</span>
            docs = <span class="hljs-variable language_">self</span>.vector_store.similarity_search(
                query,
                k=<span class="hljs-number">3</span>,
                search_kwargs={<span class="hljs-string">&quot;expr&quot;</span>: <span class="hljs-string">f&#x27;agent_id == &quot;<span class="hljs-subst">{self.agent_id}</span>&quot;&#x27;</span>}
            )
            <span class="hljs-comment"># Confidence filtering (to avoid low-quality memory contamination)</span>
            filtered_docs = [
                doc <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs
                <span class="hljs-keyword">if</span> (doc.metadata <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;confidence&quot;</span>, <span class="hljs-number">0.0</span>) &gt; <span class="hljs-number">0.7</span>
            ]
            <span class="hljs-keyword">return</span> filtered_docs <span class="hljs-keyword">or</span> docs  <span class="hljs-comment"># If there are no high-confidence results, fall back to the original results for evaluator judgment</span>
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Retrieval failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> []

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_evaluate_relevance</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]:
        <span class="hljs-string">&quot;&quot;&quot;Evaluate document relevance (three-way decision), simplified version: the LLM returns the verdict directly&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;incorrect&quot;</span>

        <span class="hljs-comment"># Evaluate only the Top-3 documents, taking the first 500 characters of each</span>
        doc_content = <span class="hljs-string">&quot;\n\n&quot;</span>.join([
            <span class="hljs-string">f&quot;[Document <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>] <span class="hljs-subst">{(doc.page_content <span class="hljs-keyword">or</span> <span class="hljs-string">&#x27;&#x27;</span>)[:<span class="hljs-number">500</span>]}</span>...&quot;</span>
            <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs[:<span class="hljs-number">3</span>])
        ])

        prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an expert in document relevance evaluation. Assess whether the following documents can answer the query.

Query: <span class="hljs-subst">{query}</span>

Document content:
<span class="hljs-subst">{doc_content}</span>

Evaluation criteria:
- relevant: the document directly contains the answer and is highly relevant
- ambiguous: the document is partially relevant and needs external knowledge
- incorrect: the document is irrelevant and cannot answer the query

Return only one word: relevant or ambiguous or incorrect
&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            result = <span class="hljs-variable language_">self</span>.evaluator.invoke(prompt)
            verdict = (<span class="hljs-built_in">getattr</span>(result, <span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>) <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;&quot;</span>).strip().lower()
            <span class="hljs-keyword">if</span> verdict <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> {<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>}:
                verdict = <span class="hljs-string">&quot;ambiguous&quot;</span>
            <span class="hljs-keyword">return</span> verdict
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Evaluation failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;ambiguous&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_refine_documents</span>(<span class="hljs-params">self, docs: <span class="hljs-built_in">list</span>, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Refine documents (simplified strips: sentence filtering based on keywords)&quot;&quot;&quot;</span>
        refined = []
        <span class="hljs-comment"># Simple Chinese-period replacement + rough English sentence splitting</span>
        keywords = [kw.strip() <span class="hljs-keyword">for</span> kw <span class="hljs-keyword">in</span> query.split() <span class="hljs-keyword">if</span> kw.strip()]

        <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs:
            text = doc.page_content <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;&quot;</span>
            sentences = (
                text.replace(<span class="hljs-string">&quot;。&quot;</span>, <span class="hljs-string">&quot;。\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;. &quot;</span>, <span class="hljs-string">&quot;.\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;! &quot;</span>, <span class="hljs-string">&quot;!\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;? &quot;</span>, <span class="hljs-string">&quot;?\n&quot;</span>)
                    .split(<span class="hljs-string">&quot;\n&quot;</span>)
            )
            sentences = [s.strip() <span class="hljs-keyword">for</span> s <span class="hljs-keyword">in</span> sentences <span class="hljs-keyword">if</span> s.strip()]

            <span class="hljs-comment"># Match any keyword</span>
            relevant_sentences = [
                s <span class="hljs-keyword">for</span> s <span class="hljs-keyword">in</span> sentences
                <span class="hljs-keyword">if</span> <span class="hljs-built_in">any</span>(keyword <span class="hljs-keyword">in</span> s <span class="hljs-keyword">for</span> keyword <span class="hljs-keyword">in</span> keywords)
            ]

            <span class="hljs-keyword">if</span> relevant_sentences:
                refined_text = <span class="hljs-string">&quot;。&quot;</span>.join(relevant_sentences[:<span class="hljs-number">3</span>])
                refined.append(Document(page_content=refined_text, metadata=doc.metadata <span class="hljs-keyword">or</span> {}))

        <span class="hljs-keyword">return</span> refined <span class="hljs-keyword">if</span> refined <span class="hljs-keyword">else</span> docs  <span class="hljs-comment"># If nothing is extracted, fall back to the original documents</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_web_search_fallback</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Web search fallback&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.web_search.invoke(query) <span class="hljs-keyword">or</span> []
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Web search failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> []

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_merge_context</span>(<span class="hljs-params">self, internal_docs: <span class="hljs-built_in">list</span>, web_results: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Merge internal memory and external knowledge into the final context&quot;&quot;&quot;</span>
        parts = []
        <span class="hljs-keyword">if</span> internal_docs:
            parts.append(<span class="hljs-string">&quot;[Internal Memory]&quot;</span>)
            <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(internal_docs, <span class="hljs-number">1</span>):
                parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{doc.page_content}</span>&quot;</span>)
        <span class="hljs-keyword">if</span> web_results:
            parts.append(<span class="hljs-string">&quot;[External Knowledge]&quot;</span>)
            <span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(web_results, <span class="hljs-number">1</span>):
                content = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
                url = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;url&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
                parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{content}</span>\n   Source: <span class="hljs-subst">{url}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts) <span class="hljs-keyword">if</span> parts <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_format_internal_docs</span>(<span class="hljs-params">self, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Format internal documents&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>
        parts = [<span class="hljs-string">&quot;[Internal Memory]&quot;</span>]
        <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs, <span class="hljs-number">1</span>):
            parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{doc.page_content}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts)

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_format_web_results</span>(<span class="hljs-params">self, results: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Format Web search results&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> results:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>
        parts = [<span class="hljs-string">&quot;[External Knowledge]&quot;</span>]
        <span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results, <span class="hljs-number">1</span>):
            content = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
            url = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;url&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
            parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{content}</span>\n   Source: <span class="hljs-subst">{url}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts)


<span class="hljs-comment"># ============ Initialize the Milvus vector database ============</span>
vector_store = Milvus(
    embedding_function=OpenAIEmbeddings(),
    connection_args={<span class="hljs-string">&quot;host&quot;</span>: <span class="hljs-string">&quot;localhost&quot;</span>, <span class="hljs-string">&quot;port&quot;</span>: <span class="hljs-string">&quot;19530&quot;</span>},
    collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>
)

<span class="hljs-comment"># ============ Create Agent ============</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[TavilySearchResults(max_results=<span class="hljs-number">3</span>)],  <span class="hljs-comment"># Web search tool</span>
    middleware=[
        CRAGMiddleware(
            vector_store=vector_store,
            agent_id=<span class="hljs-string">&quot;user_123_session_456&quot;</span>  <span class="hljs-comment"># multi-tenant isolation: each Agent instance uses its own ID</span>
        )
    ]
)

<span class="hljs-comment"># ============ Example run ============</span>
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-comment"># Example query: use HumanMessage to ensure compatibility</span>
    response = agent.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [
            HumanMessage(content=<span class="hljs-string">&quot;What were the operating expenses in Nike&#x27;s latest quarterly earnings report?&quot;</span>)
        ]
    })
    <span class="hljs-built_in">print</span>(response[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>].content)
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p><strong>Nota sobre a versão:</strong> este código utiliza as funcionalidades mais recentes do Middleware em LangGraph e LangChain. Essas APIs podem mudar à medida que os frameworks evoluem - verifique a <a href="https://langchain-ai.github.io/langgraph/">documentação do LangGraph</a> para obter o uso mais atual.</p>
</blockquote>
<h3 id="Key-Modules" class="common-anchor-header">Módulos principais</h3><p><strong>1. Projeto do avaliador de nível de produção</strong></p>
<p>O método <code translate="no">_evaluate_relevance()</code> no código acima é intencionalmente simplificado para testes rápidos. Para a produção, vai querer um resultado estruturado com pontuação de confiança e explicabilidade:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pydantic <span class="hljs-keyword">import</span> BaseModel
<span class="hljs-keyword">from</span> langchain.prompts <span class="hljs-keyword">import</span> PromptTemplate

<span class="hljs-keyword">class</span> <span class="hljs-title class_">RelevanceVerdict</span>(<span class="hljs-title class_ inherited__">BaseModel</span>):
    <span class="hljs-string">&quot;&quot;&quot;Structured output for the evaluation result&quot;&quot;&quot;</span>
    verdict: <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]
    confidence: <span class="hljs-built_in">float</span>  <span class="hljs-comment"># confidence score (used for memory quality monitoring)</span>
    reasoning: <span class="hljs-built_in">str</span>     <span class="hljs-comment"># reason for the judgment (used for debugging and review)</span>

<span class="hljs-comment"># Note: the CRAG paper uses a fine-tuned T5-Large evaluator (10-20 ms latency)</span>
<span class="hljs-comment"># Here, gpt-4o-mini is used as the engineering implementation option (easier to deploy, but with slightly higher latency)</span>
grader_llm = ChatOpenAI(model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>, temperature=<span class="hljs-number">0</span>)

grader_prompt = PromptTemplate(
    template=<span class="hljs-string">&quot;&quot;&quot;You are an expert in document relevance evaluation. Assess whether the following documents can answer the query.

Query: {query}

Document content:
{document}

Evaluation criteria:
- relevant: the document directly contains the answer, confidence &gt; 0.9
- ambiguous: the document is partially relevant, confidence 0.5-0.9
- incorrect: the document is irrelevant, confidence &lt; 0.5

Return in JSON format: {{&quot;verdict&quot;: &quot;...&quot;, &quot;confidence&quot;: 0.xx, &quot;reasoning&quot;: &quot;...&quot;}}
&quot;&quot;&quot;</span>,
    input_variables=[<span class="hljs-string">&quot;query&quot;</span>, <span class="hljs-string">&quot;document&quot;</span>]
)

grader_chain = grader_prompt | grader_llm.with_structured_output(RelevanceVerdict)

<span class="hljs-comment"># Replace the _evaluate_relevance() method in CRAGMiddleware</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">_evaluate_relevance</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Evaluate document relevance (returns structured result)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;incorrect&quot;</span>

    <span class="hljs-comment"># Evaluate only the Top-3 documents, taking the first 500 characters of each</span>
    doc_content = <span class="hljs-string">&quot;\n\n&quot;</span>.join([
        <span class="hljs-string">f&quot;[Document <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>] <span class="hljs-subst">{doc.page_content[:<span class="hljs-number">500</span>]}</span>...&quot;</span>
        <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs[:<span class="hljs-number">3</span>])
    ])

    result = grader_chain.invoke({
        <span class="hljs-string">&quot;query&quot;</span>: query,
        <span class="hljs-string">&quot;document&quot;</span>: doc_content
    })

    <span class="hljs-comment"># Store the confidence score in logs or a monitoring system</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG Evaluation] verdict=<span class="hljs-subst">{result.verdict}</span>, confidence=<span class="hljs-subst">{result.confidence:<span class="hljs-number">.2</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG Reasoning] <span class="hljs-subst">{result.reasoning}</span>&quot;</span>)

    <span class="hljs-comment"># Optional: store the evaluation result in Milvus for memory quality analysis</span>
    <span class="hljs-variable language_">self</span>._store_evaluation_metrics(query, result)

    <span class="hljs-keyword">return</span> result.verdict

<span class="hljs-keyword">def</span> <span class="hljs-title function_">_store_evaluation_metrics</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, verdict_result: RelevanceVerdict</span>):
    <span class="hljs-string">&quot;&quot;&quot;Store evaluation metrics in Milvus (for memory quality monitoring)&quot;&quot;&quot;</span>
    <span class="hljs-comment"># Example: store the evaluation result in a separate Collection for analysis</span>
    <span class="hljs-comment"># In actual use, you need to create the evaluation_metrics Collection</span>
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>2. Refinamento do conhecimento e recurso</strong></p>
<p>Três mecanismos trabalham em conjunto para manter a alta qualidade do contexto do modelo:</p>
<ul>
<li><strong>O refinamento do conhecimento</strong> extrai as frases mais relevantes para a consulta e elimina o ruído.</li>
<li><strong>A pesquisa de recurso</strong> é acionada quando a recuperação local é insuficiente, recorrendo a conhecimentos externos através do Tavily.</li>
<li><strong>A fusão de contexto</strong> combina a memória interna com resultados externos num único bloco de contexto desduplicado antes de chegar ao modelo.</li>
</ul>
<h2 id="Tips-for-Running-CRAG-in-Production" class="common-anchor-header">Dicas para executar o CRAG na produção<button data-href="#Tips-for-Running-CRAG-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Três áreas são mais importantes quando se vai para além da prototipagem.</p>
<h3 id="1-Cost-Pick-the-Right-Evaluator" class="common-anchor-header">1. Custo: Escolha o avaliador certo</h3><p>O avaliador é executado em cada consulta, o que o torna a maior alavanca para a latência e o custo.</p>
<ul>
<li><strong>Cargas de trabalho de alta simultaneidade:</strong> Um modelo leve e bem ajustado como o T5-Large mantém a latência em 10-20 ms e os custos previsíveis.</li>
<li><strong>Baixo tráfego ou prototipagem:</strong> Um modelo hospedado como o <code translate="no">gpt-4o-mini</code> é mais rápido de configurar e precisa de menos trabalho operacional, mas a latência e os custos por chamada são mais altos.</li>
</ul>
<h3 id="2-Observability-Instrument-from-Day-One" class="common-anchor-header">2. Observabilidade: Instrumento desde o primeiro dia</h3><p>Os problemas de produção mais difíceis são os que não se conseguem ver até que a qualidade da resposta já se tenha degradado.</p>
<ul>
<li><strong>Monitorização da infraestrutura:</strong> O Milvus integra-se com o <a href="https://milvus.io/docs/monitor_overview.md">Prometheus</a>. Comece com três métricas: <code translate="no">milvus_query_latency_seconds</code>, <code translate="no">milvus_search_qps</code>, e <code translate="no">milvus_insert_throughput</code>.</li>
<li><strong>Monitorização de aplicações:</strong> Acompanhe a distribuição do veredito CRAG, a taxa de acionamento da pesquisa na Web e a distribuição da pontuação de confiança. Sem estes sinais, não é possível saber se uma queda de qualidade é causada por uma má recuperação ou por um erro de avaliação.</li>
</ul>
<h3 id="3-Long-Term-Maintenance-Prevent-Memory-Contamination" class="common-anchor-header">3. Manutenção a longo prazo: Evitar a contaminação da memória</h3><p>Quanto mais tempo um agente é executado, mais dados obsoletos e de baixa qualidade se acumulam na memória. Estabeleça barreiras de proteção desde o início:</p>
<ul>
<li><strong>Pré-filtragem:</strong> Apenas as memórias de superfície com <code translate="no">confidence &gt; 0.7</code> para que o conteúdo de baixa qualidade seja bloqueado antes de chegar ao avaliador.</li>
<li><strong>Decaimento do tempo:</strong> Reduzir gradualmente o peso das memórias mais antigas. Trinta dias é um padrão inicial razoável, ajustável por caso de uso.</li>
<li><strong>Limpeza programada:</strong> Execute um trabalho semanal para limpar memórias antigas, de baixa confiança e não verificadas. Isso evita o ciclo de feedback em que dados obsoletos são recuperados, usados e armazenados novamente.</li>
</ul>
<h2 id="Wrapping-Up--and-a-Few-Common-Questions" class="common-anchor-header">Conclusão - e algumas perguntas comuns<button data-href="#Wrapping-Up--and-a-Few-Common-Questions" class="anchor-icon" translate="no">
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
    </button></h2><p>O CRAG aborda um dos problemas mais persistentes no RAG de produção: resultados de recuperação que parecem relevantes mas não o são. Ao inserir uma etapa de avaliação e correção entre a recuperação e a geração, filtra os maus resultados, preenche as lacunas com a pesquisa externa e dá ao modelo um contexto mais limpo para trabalhar.</p>
<p>No entanto, para que o CRAG funcione de forma fiável na produção, é necessário mais do que uma boa lógica de recuperação. Requer uma base de dados vetorial que lide com o isolamento multi-tenant, a pesquisa híbrida e os esquemas em evolução - que é onde <a href="https://milvus.io/intro">o Milvus</a> se enquadra. Do lado da aplicação, escolher o avaliador certo, instrumentar a observabilidade cedo e gerir ativamente a qualidade da memória é o que separa uma demonstração de um sistema em que se pode confiar.</p>
<p>Se estiver a construir sistemas RAG ou de agentes e a deparar-se com problemas de qualidade de recuperação, gostaríamos de ajudar:</p>
<ul>
<li>Junte-se à <a href="https://slack.milvus.io/">comunidade Milvus Slack</a> para fazer perguntas, partilhar a sua arquitetura e aprender com outros programadores que trabalham em problemas semelhantes.</li>
<li><a href="https://milvus.io/office-hours">Reserve uma sessão gratuita de 20 minutos do Milvus Office Hours</a> para analisar o seu caso de utilização com a equipa - quer se trate do design CRAG, da recuperação híbrida ou do escalonamento multi-tenant.</li>
<li>Se preferir ignorar a configuração da infraestrutura e passar diretamente à construção, <a href="https://cloud.zilliz.com/signup">a Zilliz Cloud</a> (Milvus gerida) oferece um nível gratuito para começar.</li>
</ul>
<hr>
<p>Algumas perguntas que surgem frequentemente quando as equipas começam a implementar o CRAG:</p>
<p><strong>Qual é a diferença entre o CRAG e a simples adição de um reranker ao RAG?</strong></p>
<p>Um reranker reordena os resultados por relevância, mas ainda assume que os documentos recuperados são utilizáveis. O CRAG vai mais longe - avalia se o conteúdo recuperado responde efetivamente à consulta e toma medidas corretivas quando tal não acontece: refina as correspondências parciais, complementa com pesquisa na Web ou elimina completamente os resultados. Trata-se de um ciclo de controlo de qualidade, não apenas de uma melhor classificação.</p>
<p><strong>Porque é que uma pontuação de similaridade elevada por vezes devolve o documento errado?</strong></p>
<p>A similaridade de incorporação mede a proximidade semântica no espaço vetorial, mas isso não é o mesmo que responder à pergunta. Um documento sobre a configuração de HTTPS no Apache é semanticamente próximo de uma pergunta sobre HTTPS no Nginx - mas não ajuda. O CRAG detecta isso avaliando a relevância para a consulta real, não apenas a distância vetorial.</p>
<p><strong>O que devo procurar numa base de dados vetorial para o CRAG?</strong></p>
<p>Três coisas são mais importantes: recuperação híbrida (para que possa combinar a pesquisa semântica com a correspondência de palavras-chave para termos exactos), isolamento multi-tenant (para que cada utilizador ou sessão de agente tenha o seu próprio espaço de memória) e um esquema flexível (para que possa adicionar campos como <code translate="no">confidence</code> ou <code translate="no">verified</code> sem tempo de inatividade à medida que o seu pipeline evolui).</p>
<p><strong>O que acontece quando nenhum dos documentos recuperados é relevante?</strong></p>
<p>O CRAG não desiste simplesmente. Quando a confiança desce abaixo de 0,5, regressa à pesquisa na Web. Quando os resultados são ambíguos (0,5-0,9), funde documentos internos refinados com resultados de pesquisa externos. O modelo obtém sempre algum contexto para trabalhar, mesmo quando a base de conhecimentos tem lacunas.</p>
