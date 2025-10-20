---
id: >-
  vllm-semantic-router-milvus-how-semantic-routing-and-caching-scale-ai-systems-the-smart-way.md
title: >-
  Roteador semântico vLLM + Milvus: como o roteamento semântico e o
  armazenamento em cache criam sistemas de IA escalonáveis de maneira
  inteligente
author: Min Yin
date: 2025-10-17T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Oct_19_2025_04_30_18_PM_af7fda1170.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, semantic routing, cache layer, vector database, vllm semantic router'
meta_title: Scale Your AI Apps the Smart Way with vLLM Semantic Router and Milvus
desc: >-
  Saiba como o vLLM, o Milvus e o roteamento semântico otimizam a inferência de
  modelos grandes, reduzem os custos de computação e aumentam o desempenho da IA
  em implantações dimensionáveis.
origin: >-
  https://milvus.io/blog/vllm-semantic-router-milvus-how-semantic-routing-and-caching-scale-ai-systems-the-smart-way.md
---
<p>A maioria das aplicações de IA depende de um único modelo para cada pedido. Mas essa abordagem rapidamente se depara com limites. Os modelos grandes são poderosos mas dispendiosos, mesmo quando são utilizados para consultas simples. Os modelos mais pequenos são mais baratos e mais rápidos, mas não conseguem lidar com raciocínios complexos. Quando o tráfego aumenta - digamos que a sua aplicação de IA se torna subitamente viral com dez milhões de utilizadores de um dia para o outro - a ineficiência desta configuração de um modelo para todos torna-se dolorosamente evidente. A latência aumenta, as contas de GPU explodem e o modelo que funcionava bem ontem começa a ficar sem ar.</p>
<p>E meu amigo, <em>você</em>, o engenheiro por detrás desta aplicação, tem de o resolver - rapidamente.</p>
<p>Imagine implementar vários modelos de diferentes tamanhos e fazer com que o seu sistema selecione automaticamente o melhor para cada pedido. Os pedidos simples vão para modelos mais pequenos; as consultas complexas vão para modelos maiores. Essa é a idéia por trás do <a href="https://github.com/vllm-project/semantic-router"><strong>Roteador Semântico vLLM - um</strong></a>mecanismo de roteamento que direciona as solicitações com base no significado, não nos pontos de extremidade. Ele analisa o conteúdo semântico, a complexidade e a intenção de cada entrada para selecionar o modelo de linguagem mais adequado, garantindo que cada consulta seja tratada pelo modelo mais bem equipado para ela.</p>
<p>Para tornar este processo ainda mais eficiente, o Semantic Router associa-se ao <a href="https://milvus.io/"><strong>Milvus</strong></a>, uma base de dados vetorial de código aberto que funciona como uma <strong>camada de cache semântica</strong>. Antes de recomputar uma resposta, verifica se uma consulta semanticamente semelhante já foi processada e recupera instantaneamente o resultado em cache, caso o encontre. O resultado: respostas mais rápidas, custos mais baixos e um sistema de recuperação que é escalado de forma inteligente em vez de ser desperdiçado.</p>
<p>Neste post, vamos nos aprofundar em como o <strong>Roteador Semântico vLLM</strong> funciona, como <strong>o Milvus</strong> alimenta sua camada de cache e como essa arquitetura pode ser aplicada em aplicativos de IA do mundo real.</p>
<h2 id="What-is-a-Semantic-Router" class="common-anchor-header">O que é um roteador semântico?<button data-href="#What-is-a-Semantic-Router" class="anchor-icon" translate="no">
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
    </button></h2><p>Em sua essência, um <strong>Roteador Semântico</strong> é um sistema que decide <em>qual modelo</em> deve tratar uma determinada solicitação com base em seu significado, complexidade e intenção. Em vez de encaminhar tudo para um modelo, ele distribui solicitações de forma inteligente entre vários modelos para equilibrar precisão, latência e custo.</p>
<p>Em termos de arquitetura, assenta em três camadas principais: <strong>Roteamento Semântico</strong>, <strong>Mistura de Modelos (MoM)</strong> e uma <strong>Camada de Cache</strong>.</p>
<h3 id="Semantic-Routing-Layer" class="common-anchor-header">Camada de roteamento semântico</h3><p>A <strong>camada de roteamento semântico</strong> é o cérebro do sistema. Analisa cada entrada - o que está a ser pedido, a sua complexidade e o tipo de raciocínio necessário - para selecionar o modelo mais adequado para a tarefa. Por exemplo, uma simples pesquisa de factos pode ir para um modelo leve, enquanto uma consulta de raciocínio em várias etapas é encaminhada para um modelo maior. Este encaminhamento dinâmico mantém o sistema responsivo mesmo quando o tráfego e a diversidade de consultas aumentam.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/modern_approach_714403b61c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Mixture-of-Models-MoM-Layer" class="common-anchor-header">A camada de Mistura de Modelos (MoM)</h3><p>A segunda camada, a <strong>Mistura de Modelos (MoM)</strong>, integra vários modelos de diferentes tamanhos e capacidades num sistema unificado. É inspirada na arquitetura <a href="https://zilliz.com/learn/what-is-mixture-of-experts"><strong>Mixture of Experts</strong></a> <strong>(MoE)</strong>, mas em vez de escolher "especialistas" dentro de um único modelo de grandes dimensões, opera em vários modelos independentes. Esta conceção reduz a latência, diminui os custos e evita que se fique preso a um único fornecedor de modelos.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/MOM_0a3eb61985.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Cache-Layer-Where-Milvus-Makes-the-Difference" class="common-anchor-header">A camada de cache: Onde o Milvus faz a diferença</h3><p>Finalmente, a <strong>camada de cache - alimentada</strong>pelo <a href="https://milvus.io/">Milvus Vetor Database - actua</a>como a memória do sistema. Antes de executar uma nova consulta, verifica se um pedido semanticamente semelhante já foi processado anteriormente. Em caso afirmativo, recupera o resultado em cache instantaneamente, economizando tempo de computação e melhorando o rendimento.</p>
<p>Os sistemas de cache tradicionais baseiam-se em armazenamentos de valores chave na memória, fazendo corresponder os pedidos a cadeias de caracteres ou modelos exactos. Isso funciona bem quando as consultas são repetitivas e previsíveis. Mas os utilizadores reais raramente escrevem a mesma coisa duas vezes. Assim que a frase muda - mesmo que ligeiramente - a cache não a reconhece como a mesma intenção. Com o tempo, a taxa de acerto da cache diminui e os ganhos de desempenho desaparecem à medida que a linguagem se desvia naturalmente.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/semantic_caching_for_vllm_routing_df889058c9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Para corrigir isso, precisamos de um cache que entenda <em>o significado</em>, não apenas as palavras correspondentes. É aí que entra a <strong>recuperação semântica</strong>. Em vez de comparar strings, compara embeddings - representações vectoriais de alta dimensão que captam a semelhança semântica. O desafio, no entanto, é a escala. Executar uma pesquisa de força bruta em milhões ou milhares de milhões de vectores numa única máquina (com uma complexidade de tempo O(N-d)) é computacionalmente proibitivo. Os custos de memória explodem, a escalabilidade horizontal entra em colapso e o sistema tem dificuldade em lidar com picos de tráfego repentinos ou consultas de cauda longa.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_routing_system_5837b93074.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Como uma base de dados vetorial distribuída criada especificamente para a pesquisa semântica em grande escala, <strong>o Milvus</strong> oferece a escalabilidade horizontal e a tolerância a falhas de que esta camada de cache necessita. Ele armazena embeddings de forma eficiente em todos os nós e realiza buscas ANN ( <a href="https://zilliz.com/blog/ANN-machine-learning">Approximate Nearest Neighbor</a>) com latência mínima, mesmo em grande escala. Com os limites de similaridade e as estratégias de fallback corretas, o Milvus garante um desempenho estável e previsível - transformando a camada de cache em uma memória semântica resiliente para todo o seu sistema de roteamento.</p>
<h2 id="How-Developers-Are-Using-Semantic-Router-+-Milvus-in-Production" class="common-anchor-header">Como os desenvolvedores estão usando o Semantic Router + Milvus na produção<button data-href="#How-Developers-Are-Using-Semantic-Router-+-Milvus-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>A combinação do <strong>vLLM Semantic Router</strong> e do <strong>Milvus</strong> brilha em ambientes de produção do mundo real, onde velocidade, custo e reutilização são importantes.</p>
<p>Três cenários comuns se destacam:</p>
<h3 id="1-Customer-Service-QA" class="common-anchor-header">1. Perguntas e respostas do atendimento ao cliente</h3><p>Os bots voltados para o cliente lidam com grandes volumes de consultas repetitivas todos os dias - redefinições de senha, atualizações de conta, status de entrega. Este domínio é sensível ao custo e à latência, o que o torna ideal para o encaminhamento semântico. O encaminhador envia perguntas de rotina para modelos mais pequenos e rápidos e encaminha as complexas ou ambíguas para modelos maiores para um raciocínio mais profundo. Entretanto, o Milvus guarda em cache os pares de perguntas e respostas anteriores, pelo que, quando surgem perguntas semelhantes, o sistema pode reutilizar instantaneamente as respostas anteriores em vez de as gerar novamente.</p>
<h3 id="2-Code-Assistance" class="common-anchor-header">2. Assistência ao código</h3><p>Em ferramentas de desenvolvimento ou assistentes de IDE, muitas consultas se sobrepõem - ajuda de sintaxe, pesquisas de API, pequenas dicas de depuração. Ao analisar a estrutura semântica de cada pedido, o router seleciona dinamicamente um tamanho de modelo adequado: leve para tarefas simples, mais capaz para raciocínio em várias etapas. O Milvus aumenta ainda mais a capacidade de resposta ao armazenar em cache problemas de codificação semelhantes e as suas soluções, transformando as interações anteriores do utilizador numa base de conhecimentos reutilizável.</p>
<h3 id="3-Enterprise-Knowledge-Base" class="common-anchor-header">3. Base de conhecimentos para empresas</h3><p>As consultas empresariais tendem a repetir-se ao longo do tempo - pesquisas de políticas, referências de conformidade, perguntas frequentes sobre produtos. Com o Milvus como camada de cache semântica, as perguntas frequentes e as suas respostas podem ser armazenadas e recuperadas de forma eficiente. Isso minimiza a computação redundante e mantém as respostas consistentes entre departamentos e regiões.</p>
<p>Por baixo do capô, o pipeline do <strong>Semantic Router + Milvus</strong> é implementado em <strong>Go</strong> e <strong>Rust</strong> para alto desempenho e baixa latência. Integrado na camada de gateway, ele monitora continuamente as principais métricas - como taxas de acerto, latência de roteamento e desempenho do modelo - para ajustar as estratégias de roteamento em tempo real.</p>
<h2 id="How-to-Quickly-Test-the-Semantic-Caching-in-the-Semantic-Router" class="common-anchor-header">Como testar rapidamente o cache semântico no roteador semântico<button data-href="#How-to-Quickly-Test-the-Semantic-Caching-in-the-Semantic-Router" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de implantar o cache semântico em escala, é útil validar como ele se comporta em uma configuração controlada. Nesta seção, faremos um teste local rápido que mostra como o Semantic Router usa <strong>o Milvus</strong> como seu cache semântico. Você verá como consultas semelhantes atingem o cache instantaneamente, enquanto consultas novas ou distintas acionam a geração de modelos - comprovando a lógica de cache em ação.</p>
<h3 id="Prerequisites" class="common-anchor-header">Pré-requisitos</h3><ul>
<li>Ambiente de contêiner: Docker + Docker Compose</li>
<li>Banco de dados vetorial: Serviço Milvus</li>
<li>LLM + Incorporação: Projeto descarregado localmente</li>
</ul>
<h3 id="1Deploy-the-Milvus-Vector-Database" class="common-anchor-header">1) Implementar a base de dados vetorial Milvus</h3><p>Descarregar os ficheiros de implementação</p>
<pre><code translate="no">wget https://github.com/Milvus-io/Milvus/releases/download/v2.5.12/Milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>Iniciar o serviço Milvus.</p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Start_the_Milvus_service_211f8b11f1.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Clone-the-project" class="common-anchor-header">2. Clonar o projeto</h3><pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/vllm-project/semantic-router.git
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Download-local-models" class="common-anchor-header">3. Descarregar os modelos locais</h3><pre><code translate="no"><span class="hljs-built_in">cd</span> semantic-router
make download-models
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Download_local_models_6243011fa5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="4-Configuration-Modifications" class="common-anchor-header">4. Modificações de configuração</h3><p>Nota: Modificar o tipo de semantic_cache para milvus</p>
<pre><code translate="no">vim config.yaml
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">semantic_cache:
  enabled: true
  backend_type: <span class="hljs-string">&quot;milvus&quot;</span>  <span class="hljs-comment"># Options: &quot;memory&quot; or &quot;milvus&quot;</span>
  backend_config_path: <span class="hljs-string">&quot;config/cache/milvus.yaml&quot;</span>
  similarity_threshold: <span class="hljs-number">0.8</span>
  max_entries: <span class="hljs-number">1000</span>  <span class="hljs-comment"># Only applies to memory backend</span>
  ttl_seconds: <span class="hljs-number">3600</span>
  eviction_policy: <span class="hljs-string">&quot;fifo&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Modificar a configuração do Mmilvus Nota: Preencher o serviço Milvusmilvus que acabou de ser implementado</p>
<pre><code translate="no">vim milvus.yaml
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Milvus connection settings</span>
connection:
  <span class="hljs-comment"># Milvus server host (change for production deployment)</span>
  host: <span class="hljs-string">&quot;192.168.7.xxx&quot;</span>  <span class="hljs-comment"># For production: use your Milvus cluster endpoint</span>
  <span class="hljs-comment"># Milvus server port</span>
  port: <span class="hljs-number">19530</span>  <span class="hljs-comment"># Standard Milvus port</span>
  <span class="hljs-comment"># Database name (optional, defaults to &quot;default&quot;)</span>
  database: <span class="hljs-string">&quot;default&quot;</span>
  <span class="hljs-comment"># Connection timeout in seconds</span>
  timeout: <span class="hljs-number">30</span>
  <span class="hljs-comment"># Authentication (enable for production)</span>
  auth:
    enabled: false  <span class="hljs-comment"># Set to true for production</span>
    username: <span class="hljs-string">&quot;&quot;</span>    <span class="hljs-comment"># Your Milvus username</span>
    password: <span class="hljs-string">&quot;&quot;</span>    <span class="hljs-comment"># Your Milvus password</span>
  <span class="hljs-comment"># TLS/SSL configuration (recommended for production)</span>
  tls:
    enabled: false      <span class="hljs-comment"># Set to true for secure connections</span>
    cert_file: <span class="hljs-string">&quot;&quot;</span>       <span class="hljs-comment"># Path to client certificate</span>
    key_file: <span class="hljs-string">&quot;&quot;</span>        <span class="hljs-comment"># Path to client private key</span>
    ca_file: <span class="hljs-string">&quot;&quot;</span>         <span class="hljs-comment"># Path to CA certificate</span>
<span class="hljs-comment"># Collection settings</span>
collection:
  <span class="hljs-comment"># Name of the collection to store cache entries</span>
  name: <span class="hljs-string">&quot;semantic_cache&quot;</span>
  <span class="hljs-comment"># Description of the collection</span>
  description: <span class="hljs-string">&quot;Semantic cache for LLM request-response pairs&quot;</span>
  <span class="hljs-comment"># Vector field configuration</span>
  vector_field:
    <span class="hljs-comment"># Name of the vector field</span>
    name: <span class="hljs-string">&quot;embedding&quot;</span>
    <span class="hljs-comment"># Dimension of the embeddings (auto-detected from model at runtime)</span>
    dimension: <span class="hljs-number">384</span>  <span class="hljs-comment"># This value is ignored - dimension is auto-detected from the embedding model</span>
    <span class="hljs-comment"># Metric type for similarity calculation</span>
    metric_type: <span class="hljs-string">&quot;IP&quot;</span>  <span class="hljs-comment"># Inner Product (cosine similarity for normalized vectors)</span>
  <span class="hljs-comment"># Index configuration for the vector field</span>
  index:
    <span class="hljs-comment"># Index type (HNSW is recommended for most use cases)</span>
    <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;HNSW&quot;</span>
    <span class="hljs-comment"># Index parameters</span>
    params:
      M: <span class="hljs-number">16</span>              <span class="hljs-comment"># Number of bi-directional links for each node</span>
      efConstruction: <span class="hljs-number">64</span>  <span class="hljs-comment"># Search scope during index construction</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Start-the-project" class="common-anchor-header">5. Iniciar o projeto</h3><p>Nota: Recomenda-se modificar algumas dependências do Dockerfile para fontes domésticas</p>
<pre><code translate="no">docker compose --profile testing up --build
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Start_the_project_4e7c2a8332.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="6-Test-Requests" class="common-anchor-header">6. Pedidos de teste</h3><p>Observação: Duas solicitações no total (sem cache e com cache atingido) Primeira solicitação:</p>
<pre><code translate="no"><span class="hljs-built_in">echo</span> <span class="hljs-string">&quot;=== 第一次请求（无缓存状态） ===&quot;</span> &amp;&amp; \
<span class="hljs-keyword">time</span> curl -X POST http://localhost:8801/v1/chat/completions \
  -H <span class="hljs-string">&quot;Content-Type: application/json&quot;</span> \
  -H <span class="hljs-string">&quot;Authorization: Bearer test-token&quot;</span> \
  -d <span class="hljs-string">&#x27;{
    &quot;model&quot;: &quot;auto&quot;,
    &quot;messages&quot;: [
      {&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;You are a helpful assistant.&quot;},
      {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;What are the main renewable energy sources?&quot;}
    ],
    &quot;temperature&quot;: 0.7
  }&#x27;</span> | jq .
<button class="copy-code-btn"></button></code></pre>
<p>Saída:</p>
<pre><code translate="no"><span class="hljs-built_in">real</span>    <span class="hljs-number">0</span>m16<span class="hljs-number">.546</span>s
user    <span class="hljs-number">0</span>m0<span class="hljs-number">.116</span>s
sys     <span class="hljs-number">0</span>m0<span class="hljs-number">.033</span>s
<button class="copy-code-btn"></button></code></pre>
<p>Segunda solicitação:</p>
<pre><code translate="no"><span class="hljs-built_in">echo</span> <span class="hljs-string">&quot;=== 第二次请求（缓存状态） ===&quot;</span> &amp;&amp; \
<span class="hljs-keyword">time</span> curl -X POST http://localhost:8801/v1/chat/completions \
  -H <span class="hljs-string">&quot;Content-Type: application/json&quot;</span> \
  -H <span class="hljs-string">&quot;Authorization: Bearer test-token&quot;</span> \
  -d <span class="hljs-string">&#x27;{
    &quot;model&quot;: &quot;auto&quot;,
    &quot;messages&quot;: [
      {&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;You are a helpful assistant.&quot;},
      {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;What are the main renewable energy sources?&quot;}
    ],
    &quot;temperature&quot;: 0.7
  }&#x27;</span> | jq .
<button class="copy-code-btn"></button></code></pre>
<p>Saída:</p>
<pre><code translate="no"><span class="hljs-built_in">real</span>    <span class="hljs-number">0</span>m2<span class="hljs-number">.393</span>s
user    <span class="hljs-number">0</span>m0<span class="hljs-number">.116</span>s
sys     <span class="hljs-number">0</span>m0<span class="hljs-number">.021</span>s
<button class="copy-code-btn"></button></code></pre>
<p>Este teste demonstra o cache semântico do Semantic Router em ação. Ao utilizar o Milvus como base de dados de vectores, faz corresponder eficazmente consultas semanticamente semelhantes, melhorando os tempos de resposta quando os utilizadores fazem as mesmas perguntas ou perguntas semelhantes.</p>
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
    </button></h2><p>À medida que as cargas de trabalho de IA crescem e a otimização de custos se torna essencial, a combinação do roteador semântico vLLM e do <a href="https://milvus.io/">Milvus</a> fornece uma maneira prática de escalar de forma inteligente. Ao encaminhar cada consulta para o modelo certo e armazenar em cache resultados semanticamente semelhantes com um banco de dados vetorial distribuído, essa configuração reduz a sobrecarga de computação, mantendo as respostas rápidas e consistentes em todos os casos de uso.</p>
<p>Em suma, obtém-se um escalonamento mais inteligente - menos força bruta, mais inteligência.</p>
<p>Se quiser explorar isto mais a fundo, junte-se à conversa no nosso <a href="https://discord.com/invite/8uyFbECzPX">Milvus Disc</a> ord ou abra um problema no<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Também pode reservar uma<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> sessão de</a> 20 minutos<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> do Milvus Office Hours</a> para obter orientação individual, insights e mergulhos técnicos profundos da equipa por trás do Milvus.</p>
