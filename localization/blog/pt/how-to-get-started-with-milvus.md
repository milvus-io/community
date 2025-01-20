---
id: how-to-get-started-with-milvus.md
title: Como começar a utilizar o Milvus
author: Ruben Winastwan
date: 2025-01-17T00:00:00.000Z
cover: >-
  assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: false
canonicalUrl: 'https://milvus.io/blog/how-to-get-started-with-milvus.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png" alt="How to get started with Milvus" class="doc-image" id="how-to-get-started-with-milvus" />
   </span> <span class="img-wrapper"> <span>Como começar a utilizar o Milvus</span> </span></p>
<p><strong><em>Última atualização em janeiro de 2025</em></strong></p>
<p>Os avanços nos Modelos de Linguagem de Grande Porte<a href="https://zilliz.com/glossary/large-language-models-(llms)">(LLMs</a>) e o crescente volume de dados necessitam de uma infraestrutura flexível e escalável para armazenar grandes quantidades de informação, como uma base de dados. No entanto, <a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">as bases de dados tradicionais</a> são concebidas para armazenar dados tabulares e estruturados, ao passo que a informação normalmente útil para tirar partido do poder dos LLM sofisticados e dos algoritmos de recuperação de informação é <a href="https://zilliz.com/learn/introduction-to-unstructured-data">não estruturada</a>, como texto, imagens, vídeos ou áudio.</p>
<p><a href="https://zilliz.com/learn/what-is-vector-database">As bases de dados vectoriais</a> são sistemas de bases de dados especificamente concebidos para dados não estruturados. Não só podemos armazenar grandes quantidades de dados não estruturados com bases de dados vectoriais, como também podemos efetuar <a href="https://zilliz.com/learn/vector-similarity-search">pesquisas vectoriais</a> com elas. As bases de dados vectoriais têm métodos de indexação avançados, como o Inverted File Index (IVFFlat) ou o Hierarchical Navigable Small World<a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">(HNSW</a>), para realizar pesquisas vectoriais e processos de recuperação de informação rápidos e eficientes.</p>
<p><strong>O Milvus</strong> é uma base de dados vetorial de código aberto que podemos utilizar para tirar partido de todas as funcionalidades benéficas que uma base de dados vetorial pode oferecer. Eis o que vamos abordar nesta publicação:</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#What-is-Milvus">Uma visão geral do Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Milvus-Deployment-Options">Opções de implementação do Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Getting-Started-with-Milvus-Lite">Introdução ao Milvus Lite</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Getting-Started-with-Milvus-Standalone">Introdução ao Milvus Standalone</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Fully-Managed-Milvus">Milvus totalmente gerido </a></p></li>
</ul>
<h2 id="What-is-Milvus" class="common-anchor-header">O que é o Milvus?<button data-href="#What-is-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/overview.md"><strong>O Milvus</strong> é </a>uma base de dados vetorial de código aberto que nos permite armazenar grandes quantidades de dados não estruturados e efetuar pesquisas vectoriais rápidas e eficientes. O Milvus é muito útil para muitas aplicações populares de GenAI, tais como sistemas de recomendação, chatbots personalizados, deteção de anomalias, pesquisa de imagens, processamento de linguagem natural e geração aumentada de recuperação<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>).</p>
<p>Existem várias vantagens que pode obter ao utilizar o Milvus como base de dados vetorial:</p>
<ul>
<li><p>Milvus oferece várias opções de implantação que pode escolher em função do seu caso de utilização e da dimensão das aplicações que pretende criar.</p></li>
<li><p>O Milvus suporta uma gama diversificada de métodos de indexação para atender a várias necessidades de dados e desempenho, incluindo opções na memória como FLAT, IVFFlat, HNSW e <a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">SCANN</a>, variantes quantizadas para eficiência de memória, o <a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN</a> no disco para grandes conjuntos de dados e índices otimizados para GPU, como GPU_CAGRA, GPU_IVF_FLAT e GPU_IVF_PQ para pesquisas aceleradas e eficientes em termos de memória.</p></li>
<li><p>O Milvus também oferece pesquisa híbrida, onde podemos usar uma combinação de embeddings densos, embeddings esparsos e filtragem de metadados durante as operações de pesquisa vetorial, levando a resultados de recuperação mais precisos. Além disso, <a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">o Milvus 2.5</a> suporta agora uma pesquisa híbrida de <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">texto integral</a> e pesquisa vetorial, tornando a sua pesquisa ainda mais precisa.</p></li>
<li><p>O Milvus pode ser totalmente utilizado na nuvem através do <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, onde é possível otimizar os custos operacionais e a velocidade da pesquisa vetorial graças a quatro funcionalidades avançadas: clusters lógicos, desagregação de dados históricos e de streaming, armazenamento em camadas, escalonamento automático e separação multi-tenancy hot-cold.</p></li>
</ul>
<p>Ao utilizar o Milvus como base de dados vetorial, pode escolher três opções de implementação diferentes, cada uma com os seus pontos fortes e vantagens. Falaremos sobre cada uma delas na próxima secção.</p>
<h2 id="Milvus-Deployment-Options" class="common-anchor-header">Opções de implementação do Milvus<button data-href="#Milvus-Deployment-Options" class="anchor-icon" translate="no">
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
    </button></h2><p>Podemos escolher entre quatro opções de implementação para começar a utilizar o Milvus: <strong>Milvus Lite, Milvus Standalone, Milvus Distributed e Zilliz Cloud (Milvus gerido).</strong> Cada opção de implementação foi concebida para se adaptar a vários cenários do nosso caso de utilização, tais como a dimensão dos nossos dados, o objetivo da nossa aplicação e a escala da nossa aplicação.</p>
<h3 id="Milvus-Lite" class="common-anchor-header">Milvus Lite</h3><p><a href="https://milvus.io/docs/quickstart.md"><strong>O Milvus Lite</strong></a> é uma versão leve do Milvus e a maneira mais fácil de começarmos. Na próxima secção, veremos como podemos executar o Milvus Lite em ação, e tudo o que precisamos de fazer para começar é instalar a biblioteca Pymilvus com pip. Depois disso, podemos executar a maioria das funcionalidades principais do Milvus como um banco de dados vetorial.</p>
<p>O Milvus Lite é perfeito para prototipagem rápida ou fins de aprendizagem e pode ser executado num notebook Jupyter sem qualquer configuração complicada. Em termos de armazenamento de vectores, o Milvus Lite é adequado para armazenar cerca de um milhão de embeddings vectoriais. Devido à sua leveza e capacidade de armazenamento, o Milvus Lite é uma opção de implementação perfeita para trabalhar com dispositivos de ponta, como o motor de pesquisa de documentos privados, deteção de objectos no dispositivo, etc.</p>
<h3 id="Milvus-Standalone" class="common-anchor-header">Milvus Standalone</h3><p>O Milvus Standalone é uma implementação de servidor de máquina única embalada numa imagem Docker. Por conseguinte, tudo o que precisamos de fazer para começar é instalar o Milvus no Docker e, em seguida, iniciar o contentor Docker. Também veremos a implementação detalhada do Milvus Standalone na próxima secção.</p>
<p>O Milvus Standalone é ideal para a construção e produção de aplicações de pequena e média escala, pois é capaz de armazenar até 10M de embeddings vetoriais. Além disso, o Milvus Standalone oferece alta disponibilidade através de um modo de backup primário, tornando-o altamente fiável para utilização em aplicações prontas para produção.</p>
<p>Também podemos utilizar o Milvus Standalone, por exemplo, depois de realizar uma prototipagem rápida e aprender as funcionalidades do Milvus com o Milvus Lite, uma vez que tanto o Milvus Standalone como o Milvus Lite partilham a mesma API do lado do cliente.</p>
<h3 id="Milvus-Distributed" class="common-anchor-header">Milvus Distribuído</h3><p>O Milvus Distributed é uma opção de implementação que utiliza uma arquitetura baseada na nuvem, onde a ingestão e a recuperação de dados são tratadas separadamente, permitindo uma aplicação altamente escalável e eficiente.</p>
<p>Para executar o Milvus Distributed, normalmente é necessário utilizar um cluster Kubernetes para permitir que o contentor seja executado em várias máquinas e ambientes. A aplicação de um cluster Kubernetes garante a escalabilidade e a flexibilidade do Milvus Distributed na personalização dos recursos alocados, dependendo da procura e da carga de trabalho. Isto também significa que, se uma parte falhar, outras podem assumir o controlo, garantindo que todo o sistema permanece ininterrupto.</p>
<p>O Milvus Distributed é capaz de lidar com até dezenas de milhares de milhões de embeddings vectoriais e foi especialmente concebido para casos de utilização em que os dados são demasiado grandes para serem armazenados numa única máquina de servidor. Por conseguinte, esta opção de implementação é perfeita para clientes empresariais que servem uma grande base de utilizadores.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Vector_embedding_storage_capability_of_different_Milvus_deployment_options_e3959ccfcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: Capacidade de armazenamento de incorporação de vectores das diferentes opções de implementação do Milvus.</em></p>
<p>Neste artigo, vamos mostrar-lhe como começar a utilizar o Milvus Lite e o Milvus Standalone, uma vez que pode começar rapidamente com ambos os métodos sem uma configuração complicada. O Milvus Distributed, no entanto, é mais complicado de configurar. Uma vez configurado o Milvus Distributed, o código e o processo lógico para criar colecções, ingerir dados, efetuar pesquisas vectoriais, etc. são semelhantes aos do Milvus Lite e do Milvus Standalone, uma vez que partilham a mesma API do lado do cliente.</p>
<p>Para além das três opções de implementação acima mencionadas, pode também experimentar o Milvus gerido na <a href="https://zilliz.com/cloud">Zilliz Cloud</a> para uma experiência sem complicações. Também falaremos sobre o Zilliz Cloud mais adiante neste artigo.</p>
<h2 id="Getting-Started-with-Milvus-Lite" class="common-anchor-header">Começar a utilizar o Milvus Lite<button data-href="#Getting-Started-with-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus Lite pode ser implementado diretamente com Python importando uma biblioteca chamada Pymilvus usando pip. Antes de instalar o Pymilvus, certifique-se de que seu ambiente atende aos seguintes requisitos:</p>
<ul>
<li><p>Ubuntu &gt;= 20.04 (x86_64 e arm64)</p></li>
<li><p>MacOS &gt;= 11.0 (Apple Silicon M1/M2 e x86_64)</p></li>
<li><p>Python 3.7 ou posterior</p></li>
</ul>
<p>Uma vez cumpridos estes requisitos, pode instalar o Milvus Lite e as dependências necessárias para demonstração utilizando o seguinte comando:</p>
<pre><code translate="no">!pip install -U pymilvus
!pip install <span class="hljs-string">&quot;pymilvus[model]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p><code translate="no">!pip install -U pymilvus</code>: Este comando instala ou actualiza a biblioteca <code translate="no">pymilvus</code>, o SDK Python do Milvus. O Milvus Lite é empacotado com o PyMilvus, então esta única linha de código é tudo que você precisa para instalar o Milvus Lite.</p></li>
<li><p><code translate="no">!pip install &quot;pymilvus[model]&quot;</code>: Este comando adiciona funcionalidades avançadas e ferramentas extra pré-integradas com o Milvus, incluindo modelos de aprendizagem automática como o Hugging Face Transformers, modelos de incorporação de IA Jina e modelos de reranking.</p></li>
</ul>
<p>Aqui estão os passos que vamos seguir com o Milvus Lite:</p>
<ol>
<li><p>Transformar os dados de texto na sua representação de incorporação utilizando um modelo de incorporação.</p></li>
<li><p>Criar um esquema na nossa base de dados Milvus para armazenar os nossos dados de texto e as suas representações de incorporação.</p></li>
<li><p>Armazenar e indexar os nossos dados no nosso esquema.</p></li>
<li><p>Efetuar uma pesquisa vetorial simples nos dados armazenados.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Workflow_of_vector_search_operation_3e38ccc1f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: Fluxo de trabalho da operação de pesquisa vetorial.</em></p>
<p>Para transformar os dados de texto em representações vectoriais, vamos utilizar um <a href="https://zilliz.com/ai-models">modelo</a> de representação de SentenceTransformers chamado 'all-MiniLM-L6-v2'. Este modelo de incorporação transforma o nosso texto numa incorporação vetorial de 384 dimensões. Vamos carregar o modelo, transformar os nossos dados de texto e juntar tudo.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model

docs = [
    <span class="hljs-string">&quot;Artificial intelligence was founded as an academic discipline in 1956.&quot;</span>,
    <span class="hljs-string">&quot;Alan Turing was the first person to conduct substantial research in AI.&quot;</span>,
    <span class="hljs-string">&quot;Born in Maida Vale, London, Turing was raised in southern England.&quot;</span>,
]

sentence_transformer_ef = model.dense.SentenceTransformerEmbeddingFunction(
    model_name=<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>, 
    device=<span class="hljs-string">&#x27;cpu&#x27;</span> 
)

vectors  = sentence_transformer_ef.encode_documents(docs)
data = [ {<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: vectors[i], <span class="hljs-string">&quot;text&quot;</span>: docs[i]} <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(vectors)) ]
<button class="copy-code-btn"></button></code></pre>
<p>De seguida, vamos criar um esquema para armazenar todos os dados acima no Milvus. Como pode ver acima, os nossos dados consistem em três campos: ID, vetor e texto. Por isso, vamos criar um esquema com estes três campos.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, db, connections

schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">True</span>,
)

<span class="hljs-comment"># Add fields to schema</span>
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;vector&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">384</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Com o Milvus Lite, podemos facilmente criar uma coleção numa determinada base de dados com base no esquema definido acima, bem como inserir e indexar os dados na coleção em apenas algumas linhas de código.</p>
<pre><code translate="no">client = MilvusClient(<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)

index_params = client.prepare_index_params()

<span class="hljs-comment">#  Add indexes</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>, 
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-comment"># Insert data into collection</span>
res = client.insert(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=data
)
<button class="copy-code-btn"></button></code></pre>
<p>No código acima, criamos uma coleção chamada &quot;demo_collection&quot; dentro de uma base de dados Milvus chamada &quot;milvus_demo&quot;. Em seguida, indexamos todos os nossos dados na "demo_collection" que acabámos de criar.</p>
<p>Agora que temos os nossos dados dentro da base de dados, podemos efetuar uma pesquisa vetorial sobre eles para qualquer consulta. Digamos que temos uma pergunta:<em>&quot;Quem é Alan Turing?</em>&quot;. Podemos obter a resposta mais adequada para a consulta implementando os seguintes passos:</p>
<ol>
<li><p>Transformar a nossa consulta num vetor de incorporação utilizando o mesmo modelo de incorporação que utilizámos para transformar os nossos dados na base de dados em incorporação.</p></li>
<li><p>Calcular a semelhança entre a incorporação da nossa consulta e a incorporação de cada entrada na base de dados, utilizando métricas como a semelhança cosseno ou a distância euclidiana.</p></li>
<li><p>Obter a entrada mais semelhante como a resposta adequada à nossa consulta.</p></li>
</ol>
<p>Abaixo está a implementação dos passos acima com o Milvus:</p>
<pre><code translate="no">query = [<span class="hljs-string">&quot;Who is Alan Turing&quot;</span>]
query_embedding = sentence_transformer_ef.encode_queries(query)

<span class="hljs-comment"># Load collection</span>
client.load_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>
)

<span class="hljs-comment"># Vector search</span>
res = client.search(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=query_embedding,
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<span class="hljs-built_in">print</span>(res)
<span class="hljs-string">&quot;&quot;&quot;
Output:
data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.7199002504348755, &#x27;entity&#x27;: {&#x27;text&#x27;: &#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;}}]&quot;] 
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>E é isso! Também pode saber mais sobre outras funcionalidades que o Milvus oferece, como a gestão de bases de dados, a inserção e eliminação de colecções, a escolha do método de indexação correto e a realização de pesquisas vectoriais mais avançadas com filtragem de metadados e pesquisa híbrida na <a href="https://milvus.io/docs/">documentação do Milvus</a>.</p>
<h2 id="Getting-Started-with-Milvus-Standalone" class="common-anchor-header">Introdução ao Milvus Standalone<button data-href="#Getting-Started-with-Milvus-Standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Standalone é uma opção de implantação em que tudo é embalado em um contêiner Docker. Portanto, precisamos instalar o Milvus no Docker e, em seguida, iniciar o contêiner do Docker para começar a usar o Milvus Standalone.</p>
<p>Antes de instalar o Milvus Standalone, certifique-se de que tanto o seu hardware como o seu software cumprem os requisitos descritos <a href="https://milvus.io/docs/prerequisite-docker.md">nesta página</a>. Além disso, certifique-se de que instalou o Docker. Para instalar o Docker, consulte <a href="https://docs.docker.com/get-started/get-docker/">esta página</a>.</p>
<p>Assim que o nosso sistema cumprir os requisitos e tivermos instalado o Docker, podemos prosseguir com a instalação do Milvus no Docker utilizando o seguinte comando:</p>
<pre><code translate="no"><span class="hljs-comment"># Download the installation script</span>
$ curl -sfL &lt;https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh&gt; -o standalone_embed.sh

<span class="hljs-comment"># Start the Docker container</span>
$ bash standalone_embed.sh start
<button class="copy-code-btn"></button></code></pre>
<p>No código acima, também iniciamos o contentor Docker e, uma vez iniciado, obterá um resultado semelhante ao que se segue:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Message_after_successful_starting_of_the_Docker_container_5c60fa15dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: Mensagem após o arranque bem sucedido do contentor Docker.</em></p>
<p>Depois de executar o script de instalação "standalone_embed.sh" acima, um contentor Docker chamado "milvus" é iniciado na porta 19530. Portanto, podemos criar um novo banco de dados, bem como acessar todas as coisas relacionadas ao banco de dados Milvus, apontando para essa porta ao criar conexões.</p>
<p>Digamos que queremos criar uma base de dados chamada "milvus_demo", semelhante ao que fizemos no Milvus Lite acima. Podemos fazê-lo da seguinte forma:</p>
<pre><code translate="no">conn = connections.<span class="hljs-title function_">connect</span>(host=<span class="hljs-string">&quot;127.0.0.1&quot;</span>, port=<span class="hljs-number">19530</span>)
database = db.<span class="hljs-title function_">create_database</span>(<span class="hljs-string">&quot;milvus_demo&quot;</span>)

client = <span class="hljs-title class_">MilvusClient</span>(
    uri=<span class="hljs-string">&quot;&lt;http://localhost:19530&gt;&quot;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>,
    db_name=<span class="hljs-string">&quot;milvus_demo&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Em seguida, pode verificar se a base de dados recém-criada chamada "milvus_demo" existe realmente na sua instância Milvus, acedendo ao <a href="https://milvus.io/docs/milvus-webui.md">Milvus Web UI</a>. Como o nome sugere, o Milvus Web UI é uma interface gráfica de utilizador fornecida pelo Milvus para observar as estatísticas e métricas dos componentes, verificar a lista e os detalhes das bases de dados, colecções e configurações. Pode aceder ao Milvus Web UI depois de ter iniciado o contentor Docker acima em http://127.0.0.1:9091/webui/.</p>
<p>Se aceder à ligação acima, verá uma página de destino como esta:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Landing_page_UI_187a40e935.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>No separador "Collections" (Colecções), verá que a nossa base de dados "milvus_demo" foi criada com êxito. Como pode ver, também pode verificar outras coisas, como a lista de colecções, as configurações, as consultas que efectuou, etc., com esta interface Web.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Web_Ui_2_666eae57b1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Agora podemos executar tudo exatamente como vimos na secção Milvus Lite acima. Vamos criar uma coleção chamada "demo_collection" dentro da base de dados "milvus_demo" que consiste em três campos, os mesmos que tínhamos na secção Milvus Lite anteriormente. Depois, vamos inserir os nossos dados na coleção.</p>
<pre><code translate="no">index_params = client.prepare_index_params()

<span class="hljs-comment">#  Add indexes</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>, 
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-comment"># Insert data into collection</span>
res = client.insert(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=data
)
<button class="copy-code-btn"></button></code></pre>
<p>O código para executar uma operação de pesquisa vetorial também é o mesmo do Milvus Lite, como você pode ver no código abaixo:</p>
<pre><code translate="no">query = [<span class="hljs-string">&quot;Who is Alan Turing&quot;</span>]
query_embedding = sentence_transformer_ef.encode_queries(query)

<span class="hljs-comment"># Load collection</span>
client.load_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>
)

<span class="hljs-comment"># Vector search</span>
res = client.search(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=query_embedding,
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<span class="hljs-built_in">print</span>(res)
<span class="hljs-string">&quot;&quot;&quot;
Output:
data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.7199004292488098, &#x27;entity&#x27;: {&#x27;text&#x27;: &#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;}}]&quot;] 
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Além de usar o Docker, também é possível usar o Milvus Standalone com o <a href="https://milvus.io/docs/install_standalone-docker-compose.md">Docker Compose</a> (para Linux) e <a href="https://milvus.io/docs/install_standalone-windows.md">o Docker Desktop</a> (para Windows).</p>
<p>Quando já não estivermos a utilizar a nossa instância Milvus, podemos parar o Milvus Standalone com o seguinte comando:</p>
<pre><code translate="no">$ bash standalone_embed.sh stop
<button class="copy-code-btn"></button></code></pre>
<h2 id="Fully-Managed-Milvus" class="common-anchor-header">Fully Managed Milvus (Milvus totalmente gerenciado)<button data-href="#Fully-Managed-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Uma forma alternativa de começar a usar o Milvus é através de uma infraestrutura nativa baseada na nuvem no <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, onde pode obter uma experiência sem complicações e 10x mais rápida.</p>
<p>O Zilliz Cloud oferece clusters dedicados com ambientes e recursos dedicados para suportar a sua aplicação de IA. Uma vez que se trata de uma base de dados baseada na nuvem construída em Milvus, não precisamos de configurar e gerir a infraestrutura local. O Zilliz Cloud também oferece funcionalidades mais avançadas, como a separação entre armazenamento vetorial e computação, cópia de segurança de dados para sistemas populares de armazenamento de objectos, como o S3, e armazenamento em cache de dados para acelerar as operações de pesquisa e recuperação de vectores.</p>
<p>No entanto, um aspeto a ter em conta quando se consideram os serviços baseados na nuvem é o custo operacional. Na maioria dos casos, ainda precisamos pagar mesmo quando o cluster está ocioso, sem nenhuma atividade de ingestão de dados ou pesquisa vetorial. Se quiser otimizar ainda mais o custo operacional e o desempenho da sua aplicação, o Zilliz Cloud Serverless seria uma excelente opção.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Key_benefits_of_using_Zilliz_Cloud_Serverless_20f68e0fff.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: Principais benefícios da utilização do Zilliz Cloud Serverless.</em></p>
<p>O Zilliz Cloud Serverless está disponível nos principais provedores de nuvem, como AWS, Azure e GCP. Oferece funcionalidades como preços pay-as-you-go, o que significa que só paga quando utiliza o cluster.</p>
<p>O Zilliz Cloud Serverless também implementa tecnologias avançadas, como clusters lógicos, escalonamento automático, armazenamento em camadas, desagregação de dados históricos e de streaming e separação de dados hot-cold. Estas funcionalidades permitem que o Zilliz Cloud Serverless consiga uma poupança de custos até 50 vezes superior e operações de pesquisa vetorial aproximadamente 10 vezes mais rápidas em comparação com o Milvus na memória.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Illustration_of_tiered_storage_and_hot_cold_data_separation_c634dfd211.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: Ilustração do armazenamento em camadas e da separação de dados quente-frio.</em></p>
<p>Se quiser começar a utilizar o Zilliz Cloud Serverless, consulte <a href="https://zilliz.com/serverless">esta página</a> para obter mais informações.</p>
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
    </button></h2><p>O Milvus destaca-se como uma base de dados vetorial versátil e poderosa, concebida para responder aos desafios da gestão de dados não estruturados e da realização de operações de pesquisa vetorial rápidas e eficientes em aplicações modernas de IA. Com opções de implantação como Milvus Lite para prototipagem rápida, Milvus Standalone para aplicações de pequena a média escala e Milvus Distributed para escalabilidade de nível empresarial, oferece flexibilidade para corresponder ao tamanho e complexidade de qualquer projeto.</p>
<p>Além disso, o Zilliz Cloud Serverless estende as capacidades do Milvus para a nuvem e fornece um modelo económico de pagamento conforme o uso que elimina a necessidade de infraestrutura local. Com recursos avançados, como armazenamento em camadas e escalonamento automático, o Zilliz Cloud Serverless garante operações de pesquisa vetorial mais rápidas, otimizando os custos.</p>
