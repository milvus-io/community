---
id: build-production-chatbot-with-kimi-k2-and-milvus.md
title: Criar um chatbot de nível de produção com o Kimi K2 e o Milvus
author: Lumina Wang
date: 2025-06-25T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Jul_26_2025_06_40_46_PM_a262e721ae.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'vector database, mcp, AI Agents, LLM, Kimi'
meta_keywords: 'Kimi K2, Milvus, AI agents, semantic search, tool calling'
meta_title: |
  Build a Production-Grade Chatbot with Kimi K2 and Milvus
desc: >-
  Explore como o Kimi K2 e o Milvus criam um agente de IA de produção para
  processamento automático de ficheiros, pesquisa semântica e P&amp;R
  inteligentes em tarefas do mundo real.
origin: 'https://milvus.io/blog/build-production-chatbot-with-kimi-k2-and-milvus.md'
---
<p><a href="https://moonshotai.github.io/Kimi-K2/">O Kimi K2</a> tem estado a fazer ondas ultimamente - e por boas razões. Os co-fundadores da Hugging Face e outros líderes da indústria elogiaram-no como um modelo de código aberto que tem um desempenho equivalente ao dos principais modelos fechados, como o GPT-4 e o Claude, em muitas áreas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/huggingface_leader_twitter_b96c9d3f21.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Duas vantagens revolucionárias diferenciam o Kimi K2:</strong></p>
<ul>
<li><p><strong>Desempenho de última geração</strong>: O K2 obtém os melhores resultados nos principais benchmarks, como o AIME2025, e supera consistentemente modelos como o Grok-4 na maioria das dimensões.</p></li>
<li><p><strong>Capacidades de agente robustas</strong>: O K2 não se limita a chamar ferramentas - ele sabe quando usá-las, como alternar entre elas no meio da tarefa e quando parar de usá-las. Isso abre sérios casos de uso no mundo real.</p></li>
</ul>
<p>Os testes com utilizadores mostram que as capacidades de codificação do Kimi K2 já são comparáveis às do Claude 4 - a cerca de 20% do custo. Mais importante ainda, suporta <strong>o planeamento autónomo de tarefas e a utilização de ferramentas</strong>. O utilizador define as ferramentas disponíveis e o K2 trata de quando e como as utilizar, sem necessidade de afinação ou camada de orquestração.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Kimi_k2_performance_550ffd5c61.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ele também suporta APIs compatíveis com OpenAI e Anthropic, permitindo que qualquer coisa construída para esses ecossistemas - como o Claude Code - seja integrada diretamente ao Kimi K2. É claro que o Moonshot AI tem como alvo cargas de trabalho de agentes.</p>
<p>Neste tutorial, mostrarei como construir um <strong>chatbot de nível de produção usando o Kimi K2 e o Milvus.</strong> O chatbot será capaz de carregar arquivos, executar perguntas e respostas inteligentes e gerenciar dados por meio de pesquisa vetorial, eliminando a necessidade de fragmentação manual, incorporação de scripts ou ajuste fino.</p>
<h2 id="What-We’ll-Build" class="common-anchor-header">O que vamos construir<button data-href="#What-We’ll-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>Estamos a construir um chatbot inteligente, combinando as capacidades de raciocínio do Kimi K2 com o desempenho da base de dados vetorial do Milvus. O sistema lida com três fluxos de trabalho principais de que os engenheiros realmente precisam:</p>
<ol>
<li><p><strong>Processamento automático de ficheiros e divisão em</strong> partes - Carregue documentos em vários formatos e deixe o sistema dividi-los de forma inteligente em partes pesquisáveis</p></li>
<li><p><strong>Pesquisa semântica</strong> - Encontre informações relevantes utilizando consultas em linguagem natural e não correspondência de palavras-chave</p></li>
<li><p><strong>Tomada de decisões inteligente</strong> - O assistente compreende o contexto e escolhe automaticamente as ferramentas corretas para cada tarefa</p></li>
</ol>
<p>Todo o sistema é construído em torno de apenas duas classes principais, tornando-o fácil de compreender, modificar e alargar:</p>
<ul>
<li><p><strong>Classe VectorDatabase</strong>: Este é o seu cavalo de batalha de processamento de dados. Trata de tudo o que está relacionado com a base de dados vetorial Milvus - desde a ligação e criação de colecções até à divisão de ficheiros em pedaços e execução de pesquisas de semelhança.</p></li>
<li><p><strong>Classe SmartAssistant</strong>: Pense nisto como o cérebro do sistema. Compreende o que os utilizadores pretendem e determina quais as ferramentas a utilizar para realizar a tarefa.</p></li>
</ul>
<p>Eis como funciona na prática: os utilizadores conversam com o SmartAssistant utilizando linguagem natural. O assistente utiliza as capacidades de raciocínio do Kimi K2 para decompor os pedidos e, em seguida, orquestra 7 funções de ferramentas especializadas para interagir com a base de dados de vectores Milvus. É como ter um coordenador inteligente que sabe exatamente quais as operações da base de dados a executar com base no que está a ser pedido.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/chatbot_architecture_ea73cac6ca.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Prerequisites-and-Setup" class="common-anchor-header">Pré-requisitos e configuração<button data-href="#Prerequisites-and-Setup" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de mergulhar no código, certifique-se de ter o seguinte pronto:</p>
<p><strong>Requisitos do sistema:</strong></p>
<ul>
<li><p>Python 3.8 ou superior</p></li>
<li><p>Servidor Milvus (usaremos a instância local na porta 19530)</p></li>
<li><p>Pelo menos 4 GB de RAM para processar documentos</p></li>
</ul>
<p><strong>Chaves de API necessárias:</strong></p>
<ul>
<li><p>Chave da API Kimi da <a href="https://platform.moonshot.cn/">Moonshot AI</a></p></li>
<li><p>Chave da API OpenAI para embeddings de texto (usaremos o modelo text-embedding-3-small)</p></li>
</ul>
<p><strong>Instalação rápida:</strong></p>
<pre><code translate="no">pip install pymilvus openai numpy
<button class="copy-code-btn"></button></code></pre>
<p><strong>Iniciar o Milvus localmente:</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Using Docker (recommended)</span>
docker run -d --name milvus -p <span class="hljs-number">19530</span>:<span class="hljs-number">19530</span> milvusdb/milvus:latest

<span class="hljs-comment"># Or download and run the standalone version from milvus.io</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Import-Libraries-and-Basic-Configuration" class="common-anchor-header">Importar bibliotecas e configuração básica<button data-href="#Import-Libraries-and-Basic-Configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>Aqui, pymilvus é a biblioteca para as operações da base de dados vetorial do Milvus, e openai é usada para chamar as APIs do Kimi e do OpenAI (o benefício da compatibilidade da API do Kimi K2 com o OpenAI e o Anthropic é evidente aqui).</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">import</span> time
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> re
<button class="copy-code-btn"></button></code></pre>
<h2 id="Data-Processing-VectorDatabase-Class" class="common-anchor-header">Processamento de dados: Classe VectorDatabase<button data-href="#Data-Processing-VectorDatabase-Class" class="anchor-icon" translate="no">
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
    </button></h2><p>Este é o núcleo de processamento de dados de todo o sistema, responsável por todas as interações com a base de dados vetorial. Pode ser dividida em dois módulos principais: <strong>Operações da base de dados vetorial Milvus e sistema de processamento de ficheiros.</strong></p>
<p>A filosofia de conceção aqui é a separação de preocupações - esta classe concentra-se apenas nas operações de dados, deixando a inteligência para a classe SmartAssistant. Isto torna o código mais fácil de manter e de testar.</p>
<h3 id="Milvus-Vector-Database-Operations" class="common-anchor-header">Operações da Base de Dados Vetorial Milvus</h3><h4 id="Initialization-Method" class="common-anchor-header"><strong>Método de inicialização</strong></h4><p>Cria um cliente OpenAI para vectorização de texto, utilizando o modelo text-embedding-3-small com a dimensão do vetor definida para 1536.</p>
<p>Também inicializa o cliente Milvus como None, criando a conexão quando necessário.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, openai_api_key: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;🔧 Initializing vector database components...&quot;</span>)
    
    <span class="hljs-comment"># OpenAI client for generating text vectors</span>
    <span class="hljs-variable language_">self</span>.openai_client = OpenAI(api_key=openai_api_key)
    <span class="hljs-variable language_">self</span>.vector_dimension = <span class="hljs-number">1536</span>  <span class="hljs-comment"># Vector dimension for OpenAI text-embedding-3-small</span>
    
    <span class="hljs-comment"># Milvus client</span>
    <span class="hljs-variable language_">self</span>.milvus_client = <span class="hljs-literal">None</span>
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;✅ Vector database component initialization complete&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Text-Vectorization" class="common-anchor-header"><strong>Vectorização de texto</strong></h4><p>Chama a API de incorporação do OpenAI para vetorizar o texto, retornando uma matriz vetorial de 1536 dimensões.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">generate_vector</span>(<span class="hljs-params">self, text: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-type">List</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Convert text to vector&quot;&quot;&quot;</span>
    response = <span class="hljs-variable language_">self</span>.openai_client.embeddings.create(
        <span class="hljs-built_in">input</span>=[text],
        model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
    )
    <span class="hljs-keyword">return</span> response.data[<span class="hljs-number">0</span>].embedding
<button class="copy-code-btn"></button></code></pre>
<h4 id="Database-Connection" class="common-anchor-header"><strong>Ligação à base de dados</strong></h4><p>Cria uma ligação MilvusClient à base de dados local na porta 19530 e devolve um formato de dicionário de resultados unificado.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">connect_database</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;Connect to Milvus vector database&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-variable language_">self</span>.milvus_client = MilvusClient(
            uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>
        )
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">True</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;Successfully connected to Milvus vector database&quot;</span>}
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Connection failed: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h4 id="Create-Collection" class="common-anchor-header"><strong>Criar coleção</strong></h4><ul>
<li><p><strong>Verificação de Duplicatas</strong>: Evita a criação de colecções com o mesmo nome</p></li>
<li><p><strong>Definir estrutura</strong>: Três campos: id (chave primária), texto (texto), vetor (vetor)</p></li>
<li><p><strong>Criar índice</strong>: Utiliza o algoritmo <code translate="no">IVF_FLAT</code> e a semelhança de cosseno para melhorar a eficiência da pesquisa</p></li>
<li><p><strong>Identificação automática</strong>: O sistema gera automaticamente identificadores únicos</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">create_collection</span>(<span class="hljs-params">self, collection_name: <span class="hljs-built_in">str</span>, description: <span class="hljs-built_in">str</span> = <span class="hljs-string">&quot;&quot;</span></span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;Create document collection&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># Check if database is connected</span>
        <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>.milvus_client <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
            <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;Please connect to database first&quot;</span>}
        
        <span class="hljs-comment"># Check if collection already exists</span>
        <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>.milvus_client.has_collection(collection_name):
            <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Collection <span class="hljs-subst">{collection_name}</span> already exists&quot;</span>}
        
        <span class="hljs-comment"># Define collection structure</span>
        schema = <span class="hljs-variable language_">self</span>.milvus_client.create_schema(
            auto_id=<span class="hljs-literal">True</span>,
            enable_dynamic_field=<span class="hljs-literal">False</span>,
            description=description
        )
        
        <span class="hljs-comment"># Add fields</span>
        schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
        schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>)
        schema.add_field(field_name=<span class="hljs-string">&quot;vector&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-variable language_">self</span>.vector_dimension)
        
        <span class="hljs-comment"># Create index parameters</span>
        index_params = <span class="hljs-variable language_">self</span>.milvus_client.prepare_index_params()
        index_params.add_index(
            field_name=<span class="hljs-string">&quot;vector&quot;</span>,
            index_type=<span class="hljs-string">&quot;IVF_FLAT&quot;</span>,
            metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
            params={<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">128</span>}
        )
        
        <span class="hljs-comment"># Create collection</span>
        <span class="hljs-variable language_">self</span>.milvus_client.create_collection(
            collection_name=collection_name,
            schema=schema,
            index_params=index_params
        )
        
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">True</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Successfully created collection <span class="hljs-subst">{collection_name}</span>&quot;</span>}
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Failed to create collection: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h4 id="Add-Documents-to-Collection" class="common-anchor-header"><strong>Adicionar documentos à coleção</strong></h4><p>Gera representações vectoriais para todos os documentos, reúne-os no formato de dicionário exigido pelo Milvus e, em seguida, executa a inserção de dados em lote, retornando finalmente a contagem de inserção e informações de estado.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">add_documents</span>(<span class="hljs-params">self, collection_name: <span class="hljs-built_in">str</span>, documents: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]</span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;Add documents to collection&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># Check if database is connected</span>
        <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>.milvus_client <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
            <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;Please connect to database first&quot;</span>}
        
        <span class="hljs-comment"># Generate vectors for each document</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;📝 Generating vectors for <span class="hljs-subst">{<span class="hljs-built_in">len</span>(documents)}</span> documents...&quot;</span>)
        vectors = []
        <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> documents:
            vector = <span class="hljs-variable language_">self</span>.generate_vector(doc)
            vectors.append(vector)
        
        <span class="hljs-comment"># Prepare insertion data</span>
        data = []
        <span class="hljs-keyword">for</span> i, (doc, vector) <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(<span class="hljs-built_in">zip</span>(documents, vectors)):
            data.append({
                <span class="hljs-string">&quot;text&quot;</span>: doc,
                <span class="hljs-string">&quot;vector&quot;</span>: vector
            })
        
        <span class="hljs-comment"># Insert data</span>
        result = <span class="hljs-variable language_">self</span>.milvus_client.insert(
            collection_name=collection_name,
            data=data
        )
        
        <span class="hljs-keyword">return</span> {
            <span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">True</span>,
            <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Successfully added <span class="hljs-subst">{<span class="hljs-built_in">len</span>(documents)}</span> documents to collection <span class="hljs-subst">{collection_name}</span>&quot;</span>,
            <span class="hljs-string">&quot;inserted_count&quot;</span>: <span class="hljs-built_in">len</span>(result[<span class="hljs-string">&quot;insert_count&quot;</span>]) <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;insert_count&quot;</span> <span class="hljs-keyword">in</span> result <span class="hljs-keyword">else</span> <span class="hljs-built_in">len</span>(documents)
        }
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Failed to add documents: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h4 id="Search-Similar-Documents" class="common-anchor-header"><strong>Pesquisar documentos semelhantes</strong></h4><p>Converte as perguntas do utilizador em vectores de 1536 dimensões, utiliza o cosseno para calcular a semelhança semântica e devolve os documentos mais relevantes por ordem decrescente de semelhança.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">search_documents</span>(<span class="hljs-params">self, collection_name: <span class="hljs-built_in">str</span>, query: <span class="hljs-built_in">str</span>, limit: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;Search similar documents&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># Check if database is connected</span>
        <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>.milvus_client <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
            <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;Please connect to database first&quot;</span>}
        
        <span class="hljs-comment"># Convert query text to vector</span>
        query_vector = <span class="hljs-variable language_">self</span>.generate_vector(query)
        
        <span class="hljs-comment"># Search parameters</span>
        search_params = {
            <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
            <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}
        }
        
        <span class="hljs-comment"># Execute search</span>
        results = <span class="hljs-variable language_">self</span>.milvus_client.search(
            collection_name=collection_name,
            data=[query_vector],
            anns_field=<span class="hljs-string">&quot;vector&quot;</span>,
            search_params=search_params,
            limit=limit,
            output_fields=[<span class="hljs-string">&quot;text&quot;</span>]
        )
        
        <span class="hljs-comment"># Organize search results</span>
        found_docs = []
        <span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:  <span class="hljs-comment"># Take results from first query</span>
            found_docs.append({
                <span class="hljs-string">&quot;text&quot;</span>: result[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>],
                <span class="hljs-string">&quot;similarity&quot;</span>: <span class="hljs-string">f&quot;<span class="hljs-subst">{(<span class="hljs-number">1</span> - result[<span class="hljs-string">&#x27;distance&#x27;</span>]) * <span class="hljs-number">100</span>:<span class="hljs-number">.1</span>f}</span>%&quot;</span>
            })
        
        <span class="hljs-keyword">return</span> {
            <span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">True</span>,
            <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(found_docs)}</span> relevant documents&quot;</span>,
            <span class="hljs-string">&quot;query&quot;</span>: query,
            <span class="hljs-string">&quot;results&quot;</span>: found_docs
        }
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Search failed: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h4 id="Query-Collections" class="common-anchor-header"><strong>Consultar colecções</strong></h4><p>Obtém o nome da coleção, a contagem de documentos e informações de descrição.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">list_all_collections</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;Query all collections in database&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># Check if database is connected</span>
        <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>.milvus_client <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
            <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;Please connect to database first&quot;</span>}
        
        <span class="hljs-comment"># Get all collection names</span>
        collections = <span class="hljs-variable language_">self</span>.milvus_client.list_collections()
        
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> collections:
            <span class="hljs-keyword">return</span> {
                <span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">True</span>,
                <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;No collections in database&quot;</span>,
                <span class="hljs-string">&quot;collections&quot;</span>: []
            }
        
        <span class="hljs-comment"># Get detailed information for each collection</span>
        collection_details = []
        <span class="hljs-keyword">for</span> collection_name <span class="hljs-keyword">in</span> collections:
            <span class="hljs-keyword">try</span>:
                <span class="hljs-comment"># Get collection statistics</span>
                stats = <span class="hljs-variable language_">self</span>.milvus_client.get_collection_stats(collection_name)
                doc_count = stats.get(<span class="hljs-string">&quot;row_count&quot;</span>, <span class="hljs-number">0</span>)
                
                <span class="hljs-comment"># Get collection description</span>
                desc_result = <span class="hljs-variable language_">self</span>.milvus_client.describe_collection(collection_name)
                description = desc_result.get(<span class="hljs-string">&quot;description&quot;</span>, <span class="hljs-string">&quot;No description&quot;</span>)
                
                collection_details.append({
                    <span class="hljs-string">&quot;name&quot;</span>: collection_name,
                    <span class="hljs-string">&quot;document_count&quot;</span>: doc_count,
                    <span class="hljs-string">&quot;description&quot;</span>: description
                })
            <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
                collection_details.append({
                    <span class="hljs-string">&quot;name&quot;</span>: collection_name,
                    <span class="hljs-string">&quot;document_count&quot;</span>: <span class="hljs-string">&quot;Failed to retrieve&quot;</span>,
                    <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">f&quot;Error: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>
                })
        
        <span class="hljs-keyword">return</span> {
            <span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">True</span>,
            <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Database contains <span class="hljs-subst">{<span class="hljs-built_in">len</span>(collections)}</span> collections total&quot;</span>,
            <span class="hljs-string">&quot;total_collections&quot;</span>: <span class="hljs-built_in">len</span>(collections),
            <span class="hljs-string">&quot;collections&quot;</span>: collection_details
        }
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Failed to query collections: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h3 id="32-File-Processing-System" class="common-anchor-header"><strong>3.2 Sistema de processamento de ficheiros</strong></h3><h4 id="Intelligent-Text-Chunking" class="common-anchor-header"><strong>Fragmentação inteligente de texto</strong></h4><p><strong>Estratégia de fragmentação:</strong></p>
<ul>
<li><p><strong>Prioridade ao parágrafo</strong>: Primeiro dividido por quebras de linha duplas para manter a integridade do parágrafo</p></li>
<li><p><strong>Processamento de parágrafos longos</strong>: Separação de parágrafos demasiado longos por pontos finais, pontos de interrogação, pontos de exclamação</p></li>
<li><p><strong>Controlo do tamanho</strong>: Assegurar que cada fração não excede os limites, com um tamanho máximo de 500 caracteres e uma sobreposição de 50 caracteres para evitar a perda de informações importantes nos limites da fração</p></li>
<li><p><strong>Preservação semântica</strong>: Evitar quebrar frases no meio</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">split_text_into_chunks</span>(<span class="hljs-params">self, text: <span class="hljs-built_in">str</span>, chunk_size: <span class="hljs-built_in">int</span> = <span class="hljs-number">500</span>, overlap: <span class="hljs-built_in">int</span> = <span class="hljs-number">50</span></span>) -&gt; <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Split long text into chunks&quot;&quot;&quot;</span>
    <span class="hljs-comment"># Clean text</span>
    text = text.strip()
    
    <span class="hljs-comment"># Split by paragraphs</span>
    paragraphs = [p.strip() <span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> text.split(<span class="hljs-string">&#x27;\n\n&#x27;</span>) <span class="hljs-keyword">if</span> p.strip()]
    
    chunks = []
    current_chunk = <span class="hljs-string">&quot;&quot;</span>
    
    <span class="hljs-keyword">for</span> paragraph <span class="hljs-keyword">in</span> paragraphs:
        <span class="hljs-comment"># If current paragraph is too long, needs further splitting</span>
        <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(paragraph) &gt; chunk_size:
            <span class="hljs-comment"># Save current chunk first</span>
            <span class="hljs-keyword">if</span> current_chunk:
                chunks.append(current_chunk.strip())
                current_chunk = <span class="hljs-string">&quot;&quot;</span>
            
            <span class="hljs-comment"># Split long paragraph by sentences</span>
            sentences = re.split(<span class="hljs-string">r&#x27;[。！？.!?]&#x27;</span>, paragraph)
            temp_chunk = <span class="hljs-string">&quot;&quot;</span>
            
            <span class="hljs-keyword">for</span> sentence <span class="hljs-keyword">in</span> sentences:
                sentence = sentence.strip()
                <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> sentence:
                    <span class="hljs-keyword">continue</span>
                
                <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(temp_chunk + sentence) &lt;= chunk_size:
                    temp_chunk += sentence + <span class="hljs-string">&quot;。&quot;</span>
                <span class="hljs-keyword">else</span>:
                    <span class="hljs-keyword">if</span> temp_chunk:
                        chunks.append(temp_chunk.strip())
                    temp_chunk = sentence + <span class="hljs-string">&quot;。&quot;</span>
            
            <span class="hljs-keyword">if</span> temp_chunk:
                chunks.append(temp_chunk.strip())
        
        <span class="hljs-comment"># If adding this paragraph won&#x27;t exceed limit</span>
        <span class="hljs-keyword">elif</span> <span class="hljs-built_in">len</span>(current_chunk + paragraph) &lt;= chunk_size:
            current_chunk += paragraph + <span class="hljs-string">&quot;\n\n&quot;</span>
        
        <span class="hljs-comment"># If it would exceed limit, save current chunk first, then start new one</span>
        <span class="hljs-keyword">else</span>:
            <span class="hljs-keyword">if</span> current_chunk:
                chunks.append(current_chunk.strip())
            current_chunk = paragraph + <span class="hljs-string">&quot;\n\n&quot;</span>
    
    <span class="hljs-comment"># Save last chunk</span>
    <span class="hljs-keyword">if</span> current_chunk:
        chunks.append(current_chunk.strip())
    
    <span class="hljs-comment"># Add overlapping content to improve context coherence</span>
    <span class="hljs-keyword">if</span> overlap &gt; <span class="hljs-number">0</span> <span class="hljs-keyword">and</span> <span class="hljs-built_in">len</span>(chunks) &gt; <span class="hljs-number">1</span>:
        overlapped_chunks = []
        <span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(chunks):
            <span class="hljs-keyword">if</span> i == <span class="hljs-number">0</span>:
                overlapped_chunks.append(chunk)
            <span class="hljs-keyword">else</span>:
                <span class="hljs-comment"># Take part of previous chunk as overlap</span>
                prev_chunk = chunks[i-<span class="hljs-number">1</span>]
                overlap_text = prev_chunk[-overlap:] <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(prev_chunk) &gt; overlap <span class="hljs-keyword">else</span> prev_chunk
                overlapped_chunk = overlap_text + <span class="hljs-string">&quot;\n&quot;</span> + chunk
                overlapped_chunks.append(overlapped_chunk)
        chunks = overlapped_chunks
    
    <span class="hljs-keyword">return</span> chunks
<button class="copy-code-btn"></button></code></pre>
<h4 id="File-Reading-and-Chunking" class="common-anchor-header"><strong>Leitura e fragmentação de ficheiros</strong></h4><p>Suporta uploads de ficheiros do utilizador (txt, md, py e outros formatos), tenta automaticamente diferentes formatos de codificação e fornece feedback de erro detalhado.</p>
<p><strong>Melhoria dos metadados</strong>: source_file regista a fonte do documento, chunk_index regista o índice de sequência dos pedaços, total_chunks regista o número total de pedaços, facilitando o controlo da integridade.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">read_and_chunk_file</span>(<span class="hljs-params">self, file_path: <span class="hljs-built_in">str</span>, chunk_size: <span class="hljs-built_in">int</span> = <span class="hljs-number">500</span>, overlap: <span class="hljs-built_in">int</span> = <span class="hljs-number">50</span></span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;Read local file and chunk into pieces&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># Check if file exists</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> os.path.exists(file_path):
            <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;File does not exist: <span class="hljs-subst">{file_path}</span>&quot;</span>}
        
        <span class="hljs-comment"># Get file information</span>
        file_size = os.path.getsize(file_path)
        file_name = os.path.basename(file_path)
        
        <span class="hljs-comment"># Choose reading method based on file extension</span>
        file_ext = os.path.splitext(file_path)[<span class="hljs-number">1</span>].lower()
        
        <span class="hljs-keyword">if</span> file_ext <span class="hljs-keyword">in</span> [<span class="hljs-string">&#x27;.txt&#x27;</span>, <span class="hljs-string">&#x27;.md&#x27;</span>, <span class="hljs-string">&#x27;.py&#x27;</span>, <span class="hljs-string">&#x27;.js&#x27;</span>, <span class="hljs-string">&#x27;.html&#x27;</span>, <span class="hljs-string">&#x27;.css&#x27;</span>, <span class="hljs-string">&#x27;.json&#x27;</span>]:
            <span class="hljs-comment"># Text file, try multiple encodings</span>
            encodings = [<span class="hljs-string">&#x27;utf-8&#x27;</span>, <span class="hljs-string">&#x27;gbk&#x27;</span>, <span class="hljs-string">&#x27;gb2312&#x27;</span>, <span class="hljs-string">&#x27;latin-1&#x27;</span>]
            content = <span class="hljs-literal">None</span>
            used_encoding = <span class="hljs-literal">None</span>
            
            <span class="hljs-keyword">for</span> encoding <span class="hljs-keyword">in</span> encodings:
                <span class="hljs-keyword">try</span>:
                    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&#x27;r&#x27;</span>, encoding=encoding) <span class="hljs-keyword">as</span> f:
                        content = f.read()
                    used_encoding = encoding
                    <span class="hljs-keyword">break</span>
                <span class="hljs-keyword">except</span> UnicodeDecodeError:
                    <span class="hljs-keyword">continue</span>
            
            <span class="hljs-keyword">if</span> content <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
                <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;Cannot read file, encoding format not supported&quot;</span>}
            
            <span class="hljs-comment"># Split text</span>
            chunks = <span class="hljs-variable language_">self</span>.split_text_into_chunks(content, chunk_size, overlap)
            
            <span class="hljs-comment"># Add metadata to each chunk</span>
            chunk_data = []
            <span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(chunks):
                chunk_data.append({
                    <span class="hljs-string">&quot;text&quot;</span>: chunk,
                    <span class="hljs-string">&quot;source_file&quot;</span>: file_name,
                    <span class="hljs-string">&quot;chunk_index&quot;</span>: i,
                    <span class="hljs-string">&quot;total_chunks&quot;</span>: <span class="hljs-built_in">len</span>(chunks)
                })
            
            <span class="hljs-keyword">return</span> {
                <span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">True</span>,
                <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Successfully read and chunked file <span class="hljs-subst">{file_name}</span>&quot;</span>,
                <span class="hljs-string">&quot;total_chunks&quot;</span>: <span class="hljs-built_in">len</span>(chunks),
                <span class="hljs-string">&quot;chunks&quot;</span>: chunk_data
            }
        
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Failed to read file: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h4 id="Upload-File-to-Collection" class="common-anchor-header"><strong>Carregar ficheiro para a coleção</strong></h4><p>Chama <code translate="no">read_and_chunk_file</code> para dividir os ficheiros carregados pelo utilizador e gera vectores para armazenar na coleção especificada.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">upload_file_to_collection</span>(<span class="hljs-params">self, file_path: <span class="hljs-built_in">str</span>, collection_name: <span class="hljs-built_in">str</span>, chunk_size: <span class="hljs-built_in">int</span> = <span class="hljs-number">500</span>, overlap: <span class="hljs-built_in">int</span> = <span class="hljs-number">50</span></span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;Upload file to specified collection&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># Check if database is connected</span>
        <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>.milvus_client <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
            <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">&quot;Please connect to database first&quot;</span>}
        
        <span class="hljs-comment"># First read and chunk file</span>
        result = <span class="hljs-variable language_">self</span>.read_and_chunk_file(file_path, chunk_size, overlap)
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> result[<span class="hljs-string">&quot;success&quot;</span>]:
            <span class="hljs-keyword">return</span> result
        
        chunk_data = result[<span class="hljs-string">&quot;chunks&quot;</span>]
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;📝 Generating vectors for <span class="hljs-subst">{<span class="hljs-built_in">len</span>(chunk_data)}</span> text chunks...&quot;</span>)
        
        <span class="hljs-comment"># Generate vectors for each chunk</span>
        vectors = []
        texts = []
        <span class="hljs-keyword">for</span> chunk_info <span class="hljs-keyword">in</span> chunk_data:
            vector = <span class="hljs-variable language_">self</span>.generate_vector(chunk_info[<span class="hljs-string">&quot;text&quot;</span>])
            vectors.append(vector)
            
            <span class="hljs-comment"># Create text with metadata</span>
            enriched_text = <span class="hljs-string">f&quot;[File: <span class="hljs-subst">{chunk_info[<span class="hljs-string">&#x27;source_file&#x27;</span>]}</span> | Chunk: <span class="hljs-subst">{chunk_info[<span class="hljs-string">&#x27;chunk_index&#x27;</span>]+<span class="hljs-number">1</span>}</span>/<span class="hljs-subst">{chunk_info[<span class="hljs-string">&#x27;total_chunks&#x27;</span>]}</span>]\n<span class="hljs-subst">{chunk_info[<span class="hljs-string">&#x27;text&#x27;</span>]}</span>&quot;</span>
            texts.append(enriched_text)
        
        <span class="hljs-comment"># Prepare insertion data</span>
        data = []
        <span class="hljs-keyword">for</span> i, (text, vector) <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(<span class="hljs-built_in">zip</span>(texts, vectors)):
            data.append({
                <span class="hljs-string">&quot;text&quot;</span>: text,
                <span class="hljs-string">&quot;vector&quot;</span>: vector
            })
        
        <span class="hljs-comment"># Insert data into collection</span>
        insert_result = <span class="hljs-variable language_">self</span>.milvus_client.insert(
            collection_name=collection_name,
            data=data
        )
        
        <span class="hljs-keyword">return</span> {
            <span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">True</span>,
            <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Successfully uploaded file <span class="hljs-subst">{result[<span class="hljs-string">&#x27;file_name&#x27;</span>]}</span> to collection <span class="hljs-subst">{collection_name}</span>&quot;</span>,
            <span class="hljs-string">&quot;file_name&quot;</span>: result[<span class="hljs-string">&quot;file_name&quot;</span>],
            <span class="hljs-string">&quot;file_size&quot;</span>: result[<span class="hljs-string">&quot;file_size&quot;</span>],
            <span class="hljs-string">&quot;total_chunks&quot;</span>: result[<span class="hljs-string">&quot;total_chunks&quot;</span>],
            <span class="hljs-string">&quot;average_chunk_size&quot;</span>: result[<span class="hljs-string">&quot;average_chunk_size&quot;</span>],
            <span class="hljs-string">&quot;inserted_count&quot;</span>: <span class="hljs-built_in">len</span>(data),
            <span class="hljs-string">&quot;collection_name&quot;</span>: collection_name
        }
        
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Failed to upload file: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h2 id="Intelligent-Decision-Making-SmartAssistant-Class" class="common-anchor-header">Tomada de decisões inteligente: Classe SmartAssistant<button data-href="#Intelligent-Decision-Making-SmartAssistant-Class" class="anchor-icon" translate="no">
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
    </button></h2><p>Este é o cérebro do sistema, também chamado de centro de decisão inteligente. É aqui que as capacidades de raciocínio autónomo do Kimi K2 realmente brilham - não se limita a executar fluxos de trabalho predefinidos, mas compreende realmente a intenção do utilizador e toma decisões inteligentes sobre quais as ferramentas a utilizar e quando.</p>
<p>A filosofia de design aqui é criar uma interface de linguagem natural que pareça estar a falar com um assistente experiente, e não a operar uma base de dados através de comandos de voz.</p>
<h3 id="Initialization-and-Tool-Definition" class="common-anchor-header"><strong>Inicialização e definição de ferramentas</strong></h3><p>A estrutura de definição da ferramenta segue o formato de chamada de função do OpenAI, que o Kimi K2 suporta nativamente. Isso torna a integração perfeita e permite a orquestração de ferramentas complexas sem lógica de análise personalizada.</p>
<p>Ferramentas básicas (4):</p>
<p><code translate="no">connect_database</code> - Gestão de ligações à base de dados<code translate="no">create_collection</code> - Criação de colecções<code translate="no">add_documents</code> - Adição de documentos em lote<code translate="no">list_all_collections</code> - Gestão de colecções</p>
<p>Ferramentas de pesquisa (1):</p>
<p><code translate="no">search_documents</code> - Pesquisa na coleção especificada</p>
<p>Ferramentas de ficheiros (2):</p>
<p><code translate="no">read_and_chunk_file</code> - Pré-visualização e fragmentação de ficheiros<code translate="no">upload_file_to_collection</code> - Processamento de carregamento de ficheiros</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, kimi_api_key: <span class="hljs-built_in">str</span>, openai_api_key: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Initialize intelligent assistant&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;🚀 Starting intelligent assistant...&quot;</span>)
    
    <span class="hljs-comment"># Kimi client</span>
    <span class="hljs-variable language_">self</span>.kimi_client = OpenAI(
        api_key=kimi_api_key,
        base_url=<span class="hljs-string">&quot;https://api.moonshot.cn/v1&quot;</span>
    )
    
    <span class="hljs-comment"># Vector database</span>
    <span class="hljs-variable language_">self</span>.vector_db = VectorDatabase(openai_api_key)
    
    <span class="hljs-comment"># Define available tools</span>
    <span class="hljs-variable language_">self</span>.available_tools = [
        {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;function&quot;</span>,
            <span class="hljs-string">&quot;function&quot;</span>: {
                <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;connect_database&quot;</span>,
                <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Connect to vector database&quot;</span>,
                <span class="hljs-string">&quot;parameters&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;object&quot;</span>, <span class="hljs-string">&quot;properties&quot;</span>: {}, <span class="hljs-string">&quot;required&quot;</span>: []}
            }
        },
        {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;function&quot;</span>,
            <span class="hljs-string">&quot;function&quot;</span>: {
                <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;create_collection&quot;</span>,
                <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Create new document collection&quot;</span>,
                <span class="hljs-string">&quot;parameters&quot;</span>: {
                    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;object&quot;</span>,
                    <span class="hljs-string">&quot;properties&quot;</span>: {
                        <span class="hljs-string">&quot;collection_name&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Collection name&quot;</span>},
                        <span class="hljs-string">&quot;description&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Collection description&quot;</span>}
                    },
                    <span class="hljs-string">&quot;required&quot;</span>: [<span class="hljs-string">&quot;collection_name&quot;</span>]
                }
            }
        },
        {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;function&quot;</span>,
            <span class="hljs-string">&quot;function&quot;</span>: {
                <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;add_documents&quot;</span>,
                <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Add documents to collection&quot;</span>,
                <span class="hljs-string">&quot;parameters&quot;</span>: {
                    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;object&quot;</span>,
                    <span class="hljs-string">&quot;properties&quot;</span>: {
                        <span class="hljs-string">&quot;collection_name&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Collection name&quot;</span>},
                        <span class="hljs-string">&quot;documents&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;array&quot;</span>, <span class="hljs-string">&quot;items&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>}, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Document list&quot;</span>}
                    },
                    <span class="hljs-string">&quot;required&quot;</span>: [<span class="hljs-string">&quot;collection_name&quot;</span>, <span class="hljs-string">&quot;documents&quot;</span>]
                }
            }
        },
        {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;function&quot;</span>,
            <span class="hljs-string">&quot;function&quot;</span>: {
                <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;search_documents&quot;</span>,
                <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Search similar documents&quot;</span>,
                <span class="hljs-string">&quot;parameters&quot;</span>: {
                    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;object&quot;</span>,
                    <span class="hljs-string">&quot;properties&quot;</span>: {
                        <span class="hljs-string">&quot;collection_name&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Collection name&quot;</span>},
                        <span class="hljs-string">&quot;query&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Search content&quot;</span>},
                        <span class="hljs-string">&quot;limit&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;integer&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Number of results&quot;</span>, <span class="hljs-string">&quot;default&quot;</span>: <span class="hljs-number">5</span>}
                    },
                    <span class="hljs-string">&quot;required&quot;</span>: [<span class="hljs-string">&quot;collection_name&quot;</span>, <span class="hljs-string">&quot;query&quot;</span>]
                }
            }
        },
        {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;function&quot;</span>,
            <span class="hljs-string">&quot;function&quot;</span>: {
                <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;list_all_collections&quot;</span>,
                <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Query information about all collections in database&quot;</span>,
                <span class="hljs-string">&quot;parameters&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;object&quot;</span>, <span class="hljs-string">&quot;properties&quot;</span>: {}, <span class="hljs-string">&quot;required&quot;</span>: []}
            }
        },
        {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;function&quot;</span>,
            <span class="hljs-string">&quot;function&quot;</span>: {
                <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;read_and_chunk_file&quot;</span>,
                <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Read local file and chunk into text blocks&quot;</span>,
                <span class="hljs-string">&quot;parameters&quot;</span>: {
                    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;object&quot;</span>,
                    <span class="hljs-string">&quot;properties&quot;</span>: {
                        <span class="hljs-string">&quot;file_path&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;File path&quot;</span>},
                        <span class="hljs-string">&quot;chunk_size&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;integer&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Size of each text chunk&quot;</span>, <span class="hljs-string">&quot;default&quot;</span>: <span class="hljs-number">500</span>},
                        <span class="hljs-string">&quot;overlap&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;integer&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Overlapping characters between text chunks&quot;</span>, <span class="hljs-string">&quot;default&quot;</span>: <span class="hljs-number">50</span>}
                    },
                    <span class="hljs-string">&quot;required&quot;</span>: [<span class="hljs-string">&quot;file_path&quot;</span>]
                }
            }
        },
        {
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;function&quot;</span>,
            <span class="hljs-string">&quot;function&quot;</span>: {
                <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;upload_file_to_collection&quot;</span>,
                <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Upload local file to specified collection, automatically chunk and vectorize&quot;</span>,
                <span class="hljs-string">&quot;parameters&quot;</span>: {
                    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;object&quot;</span>,
                    <span class="hljs-string">&quot;properties&quot;</span>: {
                        <span class="hljs-string">&quot;file_path&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;File path&quot;</span>},
                        <span class="hljs-string">&quot;collection_name&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;string&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Target collection name&quot;</span>},
                        <span class="hljs-string">&quot;chunk_size&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;integer&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Size of each text chunk&quot;</span>, <span class="hljs-string">&quot;default&quot;</span>: <span class="hljs-number">500</span>},
                        <span class="hljs-string">&quot;overlap&quot;</span>: {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;integer&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Overlapping characters between text chunks&quot;</span>, <span class="hljs-string">&quot;default&quot;</span>: <span class="hljs-number">50</span>}
                    },
                    <span class="hljs-string">&quot;required&quot;</span>: [<span class="hljs-string">&quot;file_path&quot;</span>, <span class="hljs-string">&quot;collection_name&quot;</span>]
                }
            }
        }
    ]
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;✅ Intelligent assistant startup complete&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="42-Tool-Mapping-and-Execution" class="common-anchor-header"><strong>4.2 Mapeamento e execução de ferramentas</strong></h3><p>Todas as ferramentas são executadas uniformemente através de _execute_tool.</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">_execute_tool</span>(<span class="hljs-params">self, tool_name: <span class="hljs-built_in">str</span>, args: <span class="hljs-built_in">dict</span></span>) -&gt; <span class="hljs-built_in">dict</span>:
    <span class="hljs-string">&quot;&quot;&quot;Execute specific tool&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> tool_name == <span class="hljs-string">&quot;connect_database&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.vector_db.connect_database()
    <span class="hljs-keyword">elif</span> tool_name == <span class="hljs-string">&quot;create_collection&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.vector_db.create_collection(**args)
    <span class="hljs-keyword">elif</span> tool_name == <span class="hljs-string">&quot;add_documents&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.vector_db.add_documents(**args)
    <span class="hljs-keyword">elif</span> tool_name == <span class="hljs-string">&quot;search_documents&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.vector_db.search_documents(**args)
    <span class="hljs-keyword">elif</span> tool_name == <span class="hljs-string">&quot;list_all_collections&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.vector_db.list_all_collections()
    <span class="hljs-keyword">elif</span> tool_name == <span class="hljs-string">&quot;read_and_chunk_file&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.vector_db.read_and_chunk_file(**args)
    <span class="hljs-keyword">elif</span> tool_name == <span class="hljs-string">&quot;upload_file_to_collection&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.vector_db.upload_file_to_collection(**args)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-keyword">return</span> {<span class="hljs-string">&quot;success&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-string">&quot;message&quot;</span>: <span class="hljs-string">f&quot;Unknown tool: <span class="hljs-subst">{tool_name}</span>&quot;</span>}
<button class="copy-code-btn"></button></code></pre>
<h3 id="43-Core-Conversation-Engine" class="common-anchor-header"><strong>4.3 Mecanismo de conversação principal</strong></h3><p>É aqui que a magia acontece. O método chama o modelo mais recente do Kimi:<a href="https://moonshotai.github.io/Kimi-K2/"> kimi-k2-0711-preview</a> para analisar a intenção do utilizador, selecionar automaticamente as ferramentas necessárias e executá-las, depois devolver os resultados ao Kimi, gerando finalmente as respostas finais com base nos resultados das ferramentas.</p>
<p>O que torna isto particularmente poderoso é o ciclo de conversação - o Kimi K2 pode encadear várias chamadas de ferramentas, aprender com os resultados intermédios e adaptar a sua estratégia com base no que descobre. Isso permite fluxos de trabalho complexos que exigiriam várias etapas manuais em sistemas tradicionais.</p>
<p><strong>Configuração de parâmetros:</strong></p>
<ul>
<li><p><code translate="no">temperature=0.3</code>: Temperatura mais baixa garante uma chamada estável da ferramenta</p></li>
<li><p><code translate="no">tool_choice=&quot;auto&quot;</code>: Permite que o Kimi decida autonomamente se quer usar ferramentas</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">execute_command</span>(<span class="hljs-params">self, user_command: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Execute user command&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n📝 User command: <span class="hljs-subst">{user_command}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    
    <span class="hljs-comment"># Prepare conversation messages</span>
    messages = [
        {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>,
            <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;&quot;&quot;You are an intelligent assistant that can help users manage vector databases and answer questions.

Intelligent Decision Principles:
1. Prioritize answer speed and quality, choose optimal response methods
2. For general knowledge questions, directly use your knowledge for quick responses
3. Only use database search in the following situations:
   - User explicitly requests searching database content
   - Questions involve user-uploaded specific documents or professional materials
   - Need to find specific, specialized information
4. You can handle file uploads, database management and other tasks
5. Always aim to provide the fastest, most accurate answers

Important Reminders:
- Before executing any database operations, please first call connect_database to connect to the database
- If encountering API limit errors, the system will automatically retry, please be patient

Remember: Don&#x27;t use tools just to use tools, but solve user problems in the optimal way.&quot;&quot;&quot;</span>
        },
        {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
            <span class="hljs-string">&quot;content&quot;</span>: user_command
        }
    ]
    
    <span class="hljs-comment"># Start conversation and tool calling loop</span>
    <span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
        <span class="hljs-keyword">try</span>:
            <span class="hljs-comment"># Call Kimi model - Add retry mechanism to handle API limits</span>
            max_retries = <span class="hljs-number">5</span>
            retry_delay = <span class="hljs-number">20</span>  <span class="hljs-comment"># seconds</span>
            
            <span class="hljs-keyword">for</span> attempt <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(max_retries):
                <span class="hljs-keyword">try</span>:
                    response = <span class="hljs-variable language_">self</span>.kimi_client.chat.completions.create(
                        model=<span class="hljs-string">&quot;kimi-k2-0711-preview&quot;</span>, <span class="hljs-comment">#moonshot-v1-8k</span>
                        messages=messages,
                        temperature=<span class="hljs-number">0.3</span>,
                        tools=<span class="hljs-variable language_">self</span>.available_tools,
                        tool_choice=<span class="hljs-string">&quot;auto&quot;</span>
                    )
                    <span class="hljs-keyword">break</span>  <span class="hljs-comment"># Success, break out of retry loop</span>
                <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
                    <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;rate_limit&quot;</span> <span class="hljs-keyword">in</span> <span class="hljs-built_in">str</span>(e).lower() <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;429&quot;</span> <span class="hljs-keyword">in</span> <span class="hljs-built_in">str</span>(e) <span class="hljs-keyword">and</span> attempt &lt; max_retries - <span class="hljs-number">1</span>:
                        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;⏳ Kimi API limit, waiting <span class="hljs-subst">{retry_delay}</span> seconds before retry... (attempt <span class="hljs-subst">{attempt + <span class="hljs-number">1</span>}</span>/<span class="hljs-subst">{max_retries}</span>)&quot;</span>)
                        time.sleep(retry_delay)
                        retry_delay *= <span class="hljs-number">1.5</span>  <span class="hljs-comment"># Moderately increase delay</span>
                        <span class="hljs-keyword">continue</span>
                    <span class="hljs-keyword">else</span>:
                        <span class="hljs-keyword">raise</span> e
            <span class="hljs-keyword">else</span>:
                <span class="hljs-keyword">raise</span> Exception(<span class="hljs-string">&quot;Failed to call Kimi API: exceeded maximum retry attempts&quot;</span>)
            
            choice = response.choices[<span class="hljs-number">0</span>]
            
            <span class="hljs-comment"># If need to call tools</span>
            <span class="hljs-keyword">if</span> choice.finish_reason == <span class="hljs-string">&quot;tool_calls&quot;</span>:
                messages.append(choice.message)
                
                <span class="hljs-comment"># Execute each tool call</span>
                <span class="hljs-keyword">for</span> tool_call <span class="hljs-keyword">in</span> choice.message.tool_calls:
                    tool_name = tool_call.function.name
                    tool_args = json.loads(tool_call.function.arguments)
                    
                    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;🔧 Calling tool: <span class="hljs-subst">{tool_name}</span>&quot;</span>)
                    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;📋 Parameters: <span class="hljs-subst">{tool_args}</span>&quot;</span>)
                    
                    <span class="hljs-comment"># Execute tool</span>
                    result = <span class="hljs-variable language_">self</span>._execute_tool(tool_name, tool_args)
                    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✅ Result: <span class="hljs-subst">{result}</span>&quot;</span>)
                    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;-&quot;</span> * <span class="hljs-number">40</span>)
                    
                    <span class="hljs-comment"># Add tool result to conversation</span>
                    messages.append({
                        <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;tool&quot;</span>,
                        <span class="hljs-string">&quot;tool_call_id&quot;</span>: tool_call.<span class="hljs-built_in">id</span>,
                        <span class="hljs-string">&quot;name&quot;</span>: tool_name,
                        <span class="hljs-string">&quot;content&quot;</span>: json.dumps(result)
                    })
            
            <span class="hljs-comment"># If task completed</span>
            <span class="hljs-keyword">else</span>:
                final_response = choice.message.content
                <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;🎯 Task completed: <span class="hljs-subst">{final_response}</span>&quot;</span>)
                <span class="hljs-keyword">return</span> final_response
        
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            error_msg = <span class="hljs-string">f&quot;Execution error: <span class="hljs-subst">{<span class="hljs-built_in">str</span>(e)}</span>&quot;</span>
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;❌ <span class="hljs-subst">{error_msg}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> error_msg
<button class="copy-code-btn"></button></code></pre>
<h2 id="Main-Program-and-Usage-Demonstration" class="common-anchor-header">Programa principal e demonstração de utilização<button data-href="#Main-Program-and-Usage-Demonstration" class="anchor-icon" translate="no">
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
    </button></h2><p>Este programa principal configura o ambiente interativo. Para uso em produção, é necessário substituir as chaves de API codificadas por variáveis de ambiente e adicionar registo e monitorização adequados.</p>
<p>Obtenha <code translate="no">KIMI_API_KEY</code> e <code translate="no">OPENAI_API_KEY</code> do site oficial para começar a usar.</p>
<pre><code translate="no">python
<span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    <span class="hljs-string">&quot;&quot;&quot;Main program&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;🌟 Kimi K2 Intelligent Vector Database Assistant&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    
    <span class="hljs-comment"># API key configuration</span>
    KIMI_API_KEY = <span class="hljs-string">&quot;sk-xxxxxxxxxxxxxxxx&quot;</span>
    OPENAI_API_KEY = <span class="hljs-string">&quot;sk-proj-xxxxxxxxxxxxxxxx&quot;</span>
    
    <span class="hljs-comment"># Create intelligent assistant</span>
    assistant = SmartAssistant(KIMI_API_KEY, OPENAI_API_KEY)
    
    <span class="hljs-comment"># Interactive mode</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n🎮 Interactive mode (enter &#x27;quit&#x27; to exit)&quot;</span>)
    <span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
        <span class="hljs-keyword">try</span>:
            user_input = <span class="hljs-built_in">input</span>(<span class="hljs-string">&quot;\nPlease enter command: &quot;</span>).strip()
            <span class="hljs-keyword">if</span> user_input.lower() <span class="hljs-keyword">in</span> [<span class="hljs-string">&#x27;quit&#x27;</span>, <span class="hljs-string">&#x27;exit&#x27;</span>]:
                <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;👋 Goodbye!&quot;</span>)
                <span class="hljs-keyword">break</span>
            
            <span class="hljs-keyword">if</span> user_input:
                assistant.execute_command(user_input)
                <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
        
        <span class="hljs-keyword">except</span> KeyboardInterrupt:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n👋 Goodbye!&quot;</span>)
            <span class="hljs-keyword">break</span>

<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    main()
<button class="copy-code-btn"></button></code></pre>
<h2 id="Usage-Examples" class="common-anchor-header">Exemplos de utilização<button data-href="#Usage-Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>Estes exemplos demonstram as capacidades do sistema em cenários realistas que os engenheiros encontrariam em ambientes de produção.</p>
<h3 id="Upload-file-example" class="common-anchor-header">Exemplo de carregamento de ficheiro</h3><p>Este exemplo mostra como o sistema lida com um fluxo de trabalho complexo de forma autónoma. Repare como o Kimi K2 decompõe o pedido do utilizador e executa os passos necessários na ordem correta.</p>
<pre><code translate="no">User Input: Upload ./The Adventures of Sherlock Holmes.txt to the database
<button class="copy-code-btn"></button></code></pre>
<p>O que é notável aqui é que, a partir da cadeia de chamadas da ferramenta, pode ver que o Kimi K2 analisa o comando e sabe primeiro ligar à base de dados (função connect_database) e depois carregar o ficheiro para a coleção (função upload_file_to_collection).</p>
<p>Quando encontra um erro, o Kimi K2 também sabe corrigi-lo prontamente com base na mensagem de erro, sabendo que deve primeiro criar a coleção (create_collection) e depois carregar o ficheiro para a coleção (upload_file_to_collection). Esta recuperação autónoma de erros é uma vantagem fundamental em relação às abordagens tradicionais com script.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/usage_example_1_a4c0b2a006.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O sistema trata automaticamente:</p>
<ol>
<li><p>Ligação à base de dados</p></li>
<li><p>Criação de colecções (se necessário)</p></li>
<li><p>Leitura e fragmentação de ficheiros</p></li>
<li><p>Geração de vectores</p></li>
<li><p>Inserção de dados</p></li>
<li><p>Relatórios de estado</p></li>
</ol>
<h3 id="Question-answer-example" class="common-anchor-header">Exemplo de pergunta-resposta</h3><p>Esta secção demonstra a inteligência do sistema para decidir quando utilizar ferramentas e quando confiar no conhecimento existente.</p>
<pre><code translate="no">User Input: List five advantages of the Milvus vector database
<button class="copy-code-btn"></button></code></pre>
<p>A partir da imagem, podemos ver que o Kimi K2 respondeu diretamente à pergunta do utilizador sem chamar qualquer função. Isto demonstra a eficiência do sistema - não efectua operações desnecessárias na base de dados para perguntas a que pode responder a partir dos seus dados de treino.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/usage_example_2_c912f3273b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-title class_">How</span> many stories are included <span class="hljs-keyword">in</span> the book <span class="hljs-string">&quot;Sherlock Holmes&quot;</span> that I uploaded? <span class="hljs-title class_">Summarize</span> each story <span class="hljs-keyword">in</span> one sentence.
<button class="copy-code-btn"></button></code></pre>
<p>Para esta consulta, o Kimi identifica corretamente que precisa de pesquisar o conteúdo do documento carregado. O sistema:</p>
<ol>
<li><p>Reconhece que isso requer informações específicas do documento</p></li>
<li><p>Chama a função search_documents</p></li>
<li><p>Analisa o conteúdo recuperado</p></li>
<li><p>Fornece uma resposta abrangente com base no conteúdo atual carregado</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/usage_example_3_7517b69889.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/usage_example_4_96ea51a798.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Database-Management-Example" class="common-anchor-header">Exemplo de gestão de bases de dados</h3><p>As tarefas administrativas são tratadas com a mesma facilidade que as consultas de conteúdo.</p>
<pre><code translate="no"><span class="hljs-built_in">list</span> <span class="hljs-built_in">all</span> the collections
<button class="copy-code-btn"></button></code></pre>
<p>O Kimi K2 utiliza as ferramentas adequadas para responder corretamente a esta pergunta, demonstrando que compreende tanto as operações administrativas como as de conteúdo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/usage_example_5_457a4d5db0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O sistema fornece informações completas, incluindo:</p>
<ul>
<li><p>Nomes de colecções</p></li>
<li><p>Contagens de documentos</p></li>
<li><p>Descrições</p></li>
<li><p>Estatísticas gerais da base de dados</p></li>
</ul>
<h2 id="The-Dawn-of-Production-AI-Agents" class="common-anchor-header">O início dos agentes de IA de produção<button data-href="#The-Dawn-of-Production-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Ao ligar <strong>o Kimi K2</strong> ao <strong>Milvus</strong>, fomos além dos chatbots tradicionais ou da pesquisa semântica básica. O que construímos foi um verdadeiro agente de produção - um agente capaz de interpretar instruções complexas, dividi-las em fluxos de trabalho baseados em ferramentas e executar tarefas completas, como o tratamento de ficheiros, a pesquisa semântica e as perguntas e respostas inteligentes, com o mínimo de despesas gerais.</p>
<p>Esta arquitetura reflecte uma mudança mais ampla no desenvolvimento da IA, passando de modelos isolados para sistemas compósitos, onde o raciocínio, a memória e a ação funcionam em conjunto. Os LLMs, como o Kimi K2, proporcionam um raciocínio flexível, enquanto as bases de dados vectoriais, como o Milvus, oferecem uma memória estruturada a longo prazo; e a chamada de ferramentas permite a execução no mundo real.</p>
<p>Para os programadores, a questão já não é <em>se</em> estes componentes podem trabalhar em conjunto, mas sim <em>até que ponto</em> podem generalizar-se entre domínios, escalar com dados e responder às necessidades cada vez mais complexas dos utilizadores.</p>
<p><strong><em>Olhando para o futuro, um padrão está a tornar-se claro: LLM (raciocínio) + Vetor DB (conhecimento) + Ferramentas (ação) = Agentes de IA reais.</em></strong></p>
<p>Este sistema que construímos é apenas um exemplo, mas os princípios aplicam-se de forma geral. À medida que os LLMs continuam a melhorar e os ecossistemas de ferramentas amadurecem, o Milvus está posicionado para continuar a ser uma parte essencial da pilha de IA de produção - alimentando sistemas inteligentes que podem raciocinar sobre os dados, e não apenas recuperá-los.</p>
