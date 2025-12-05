---
id: data-in-and-data-out-in-milvus-2-6.md
title: >-
  Apresentando a função de incorporação: Como o Milvus 2.6 agiliza a
  vectorização e a pesquisa semântica
author: Xuqi Yang
date: 2025-12-03T00:00:00.000Z
cover: assets.zilliz.com/data_in_data_out_cover_0783504ea4.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database, embedding, vector search'
meta_title: >
  Introducing the Embedding Function: How Milvus 2.6 Streamlines Vectorization
  and Semantic Search
desc: >-
  Descubra como Milvus 2.6 simplifica o processo de incorporação e a pesquisa
  vetorial com Data-in, Data-out. Lida automaticamente com a incorporação e a
  reclassificação - sem necessidade de pré-processamento externo.
origin: 'https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md'
---
<p>Se alguma vez criou uma aplicação de pesquisa vetorial, já conhece demasiado bem o fluxo de trabalho. Antes de os dados poderem ser armazenados, têm de ser transformados em vectores utilizando um modelo de incorporação, limpos e formatados e, por fim, ingeridos na base de dados de vectores. Cada consulta também passa pelo mesmo processo: incorporar a entrada, executar uma pesquisa de semelhança e, em seguida, mapear os IDs resultantes para os documentos ou registos originais. Funciona - mas cria um emaranhado distribuído de scripts de pré-processamento, pipelines de incorporação e código cola que tem de manter.</p>
<p><a href="https://milvus.io/">Milvus</a>, um banco de dados vetorial de código aberto de alto desempenho, agora dá um grande passo para simplificar tudo isso. <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">O Milvus 2.6</a> apresenta o <strong>recurso Data-in, Data-out (também conhecido como</strong> <a href="https://milvus.io/docs/embedding-function-overview.md#Embedding-Function-Overview"><strong>Função de Incorporação</strong></a><strong>)</strong>, um recurso de incorporação integrado que se conecta diretamente aos principais provedores de modelos, como OpenAI, AWS Bedrock, Google Vertex AI e Hugging Face. Em vez de gerir a sua própria infraestrutura de incorporação, o Milvus pode agora chamar estes modelos por si. Também é possível inserir e consultar usando texto bruto - e em breve outros tipos de dados - enquanto o Milvus lida automaticamente com a vetorização no momento da gravação e da consulta.</p>
<p>No restante deste post, veremos mais de perto como o Data-in, Data-out funciona nos bastidores, como configurar provedores e funções de incorporação e como você pode usá-lo para simplificar seus fluxos de trabalho de pesquisa vetorial de ponta a ponta.</p>
<h2 id="What-is-Data-in-Data-out" class="common-anchor-header">O que é Data-in, Data-out?<button data-href="#What-is-Data-in-Data-out" class="anchor-icon" translate="no">
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
    </button></h2><p>Data-in, Data-out no Milvus 2.6 é construído sobre o novo módulo Function - uma estrutura que permite ao Milvus lidar com a transformação de dados e geração de embedding internamente, sem quaisquer serviços externos de pré-processamento. (Pode seguir a proposta de design na <a href="https://github.com/milvus-io/milvus/issues/35856">issue #35856 do GitHub</a>.) Com este módulo, o Milvus pode receber dados de entrada em bruto, chamar diretamente um fornecedor de embedding e escrever automaticamente os vectores resultantes na sua coleção.</p>
<p>Em um alto nível, o módulo <strong>Function</strong> transforma a geração de embedding em uma capacidade de banco de dados nativa. Em vez de executar pipelines de embedding separados, trabalhadores em segundo plano ou serviços de reranker, o Milvus agora envia solicitações ao seu provedor configurado, recupera embeddings e os armazena junto com seus dados - tudo dentro do caminho de ingestão. Isso elimina a sobrecarga operacional de gerenciar sua própria infraestrutura de incorporação.</p>
<p>Data-in, Data-out introduz três grandes melhorias no fluxo de trabalho do Milvus:</p>
<ul>
<li><p><strong>Inserir dados brutos diretamente</strong> - Pode agora inserir texto não processado, imagens ou outros tipos de dados diretamente no Milvus. Não é necessário convertê-los previamente em vectores.</p></li>
<li><p><strong>Configurar uma função de incorporação</strong> - Uma vez configurado um modelo de incorporação no Milvus, este gere automaticamente todo o processo de incorporação. Milvus integra-se perfeitamente com uma série de fornecedores de modelos, incluindo OpenAI, AWS Bedrock, Google Vertex AI, Cohere e Hugging Face.</p></li>
<li><p><strong>Consulta com entradas brutas</strong> - Agora é possível efetuar uma pesquisa semântica utilizando texto bruto ou outras consultas baseadas em conteúdos. O Milvus utiliza o mesmo modelo configurado para gerar incorporação em tempo real, efetuar pesquisas por semelhança e apresentar resultados relevantes.</p></li>
</ul>
<p>Resumindo, o Milvus agora incorpora automaticamente - e opcionalmente reordena - os seus dados. A vectorização torna-se uma função incorporada na base de dados, eliminando a necessidade de serviços de incorporação externos ou de lógica de pré-processamento personalizada.</p>
<h2 id="How-Data-in-Data-out-Works" class="common-anchor-header">Como funciona o Data-in, Data-out<button data-href="#How-Data-in-Data-out-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>O diagrama abaixo ilustra como o Data-in, Data-out funciona dentro do Milvus.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/diagram_data_in_data_out_4c9e06c884.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O fluxo de trabalho Data-in, Data-out pode ser dividido em seis passos principais:</p>
<ol>
<li><p><strong>Dados de entrada</strong> - O utilizador insere dados em bruto - como texto, imagens ou outros tipos de conteúdo - diretamente no Milvus sem realizar qualquer pré-processamento externo.</p></li>
<li><p><strong>Gerar embeddings</strong> - O módulo Function invoca automaticamente o modelo de embeddings configurado através da sua API de terceiros, convertendo a entrada bruta em embeddings vectoriais em tempo real.</p></li>
<li><p><strong>Armazenar Embeddings</strong> - Milvus escreve os embeddings gerados no campo vetorial designado dentro da sua coleção, onde ficam disponíveis para operações de pesquisa de similaridade.</p></li>
<li><p><strong>Submeter uma consulta</strong> - O utilizador emite uma consulta de texto em bruto ou baseada no conteúdo para o Milvus, tal como na fase de entrada.</p></li>
<li><p><strong>Pesquisa semântica</strong> - Milvus incorpora a consulta usando o mesmo modelo configurado, executa uma pesquisa de similaridade sobre os vectores armazenados e determina as correspondências semânticas mais próximas.</p></li>
<li><p><strong>Devolver resultados</strong> - Milvus devolve os top-k resultados mais semelhantes - mapeados de volta aos seus dados originais - diretamente à aplicação.</p></li>
</ol>
<h2 id="How-to-Configure-Data-in-Data-out" class="common-anchor-header">Como configurar o Data-in, Data-out<button data-href="#How-to-Configure-Data-in-Data-out" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">Pré-requisitos</h3><ul>
<li><p>Instale a versão mais recente do <strong>Milvus 2.6</strong>.</p></li>
<li><p>Prepare sua chave de API de incorporação de um provedor compatível (por exemplo, OpenAI, AWS Bedrock ou Cohere). Neste exemplo, usaremos <strong>o Cohere</strong> como o provedor de incorporação.</p></li>
</ul>
<h3 id="Modify-the-milvusyaml-Configuration" class="common-anchor-header">Modificar a configuração de <code translate="no">milvus.yaml</code> </h3><p>Se você estiver executando o Milvus com o <strong>Docker Compose</strong>, precisará modificar o arquivo <code translate="no">milvus.yaml</code> para habilitar o módulo Function. Você pode consultar a documentação oficial para obter orientação: <a href="https://milvus.io/docs/configure-docker.md?tab=component#Download-a-configuration-file">Configurar o Milvus com o Docker Compose</a> (Instruções para outros métodos de implantação também podem ser encontradas aqui).</p>
<p>No ficheiro de configuração, localize as secções <code translate="no">credential</code> e <code translate="no">function</code>.</p>
<p>Em seguida, actualize os campos <code translate="no">apikey1.apikey</code> e <code translate="no">providers.cohere</code>.</p>
<pre><code translate="no">...
credential:
  aksk1:
    access_key_id:  <span class="hljs-comment"># Your access_key_id</span>
    secret_access_key:  <span class="hljs-comment"># Your secret_access_key</span>
  apikey1:
    apikey: <span class="hljs-string">&quot;***********************&quot;</span> <span class="hljs-comment"># Edit this section</span>
  gcp1:
    credential_json:  <span class="hljs-comment"># base64 based gcp credential data</span>
<span class="hljs-comment"># Any configuration related to functions</span>
function:
  textEmbedding:
    providers:
                        ...
      cohere: <span class="hljs-comment"># Edit the section below</span>
        credential:  apikey1 <span class="hljs-comment"># The name in the crendential configuration item</span>
        enable: true <span class="hljs-comment"># Whether to enable cohere model service</span>
        url:  <span class="hljs-string">&quot;https://api.cohere.com/v2/embed&quot;</span> <span class="hljs-comment"># Your cohere embedding url, Default is the official embedding url</span>
      ...
...
<button class="copy-code-btn"></button></code></pre>
<p>Depois de fazer essas alterações, reinicie o Milvus para aplicar a configuração atualizada.</p>
<h2 id="How-to-Use-the-Data-in-Data-out-Feature" class="common-anchor-header">Como usar o recurso de entrada e saída de dados<button data-href="#How-to-Use-the-Data-in-Data-out-Feature" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Define-the-Schema-for-the-Collection" class="common-anchor-header">1. Definir o esquema para a coleção</h3><p>Para ativar a funcionalidade de incorporação, <strong>o esquema da coleção</strong> deve incluir pelo menos três campos:</p>
<ul>
<li><p><strong>Campo de chave primária (</strong><code translate="no">id</code> ) - Identifica de forma única cada entidade na coleção.</p></li>
<li><p><strong>Campo escalar (</strong><code translate="no">document</code> ) - Armazena os dados brutos originais.</p></li>
<li><p><strong>Campo vetorial (</strong><code translate="no">dense</code> ) - Armazena as incorporações vectoriais geradas.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType
<span class="hljs-comment"># Initialize Milvus client</span>
client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
)
<span class="hljs-comment"># Create a new schema for the collection</span>
schema = client.create_schema()
<span class="hljs-comment"># Add primary field &quot;id&quot;</span>
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">False</span>)
<span class="hljs-comment"># Add scalar field &quot;document&quot; for storing textual data</span>
schema.add_field(<span class="hljs-string">&quot;document&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">9000</span>)
<span class="hljs-comment"># Add vector field &quot;dense&quot; for storing embeddings.</span>
<span class="hljs-comment"># IMPORTANT: Set `dim` to match the exact output dimension of the embedding model.</span>
<span class="hljs-comment"># For instance, OpenAI&#x27;s text-embedding-3-small model outputs 1536-dimensional vectors.</span>
<span class="hljs-comment"># For dense vector, data type can be FLOAT_VECTOR or INT8_VECTOR</span>
schema.add_field(<span class="hljs-string">&quot;dense&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>) <span class="hljs-comment"># Set dim according to the embedding model you use.</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Define-the-Embedding-Function" class="common-anchor-header">2. Definir a função de incorporação</h3><p>Em seguida, defina a <strong>função de incorporação</strong> no esquema.</p>
<ul>
<li><p><code translate="no">name</code> - Um identificador único para a função.</p></li>
<li><p><code translate="no">function_type</code> - Definir como <code translate="no">FunctionType.TEXTEMBEDDING</code> para as incorporações de texto. O Milvus também suporta outros tipos de funções, como <code translate="no">FunctionType.BM25</code> e <code translate="no">FunctionType.RERANK</code>. Para mais pormenores, consulte <a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">a Pesquisa de texto integral</a> e a <a href="https://milvus.io/docs/decay-ranker-overview.md#Decay-Ranker-Overview">Descrição geral do Decay Ranker</a>.</p></li>
<li><p><code translate="no">input_field_names</code> - Define o campo de entrada para dados em bruto (<code translate="no">document</code>).</p></li>
<li><p><code translate="no">output_field_names</code> - Define o campo de saída onde os vectores de incorporação serão armazenados (<code translate="no">dense</code>).</p></li>
<li><p><code translate="no">params</code> - Contém parâmetros de configuração para a função de incorporação. Os valores para <code translate="no">provider</code> e <code translate="no">model_name</code> têm de corresponder às entradas correspondentes no seu ficheiro de configuração <code translate="no">milvus.yaml</code>.</p></li>
</ul>
<p><strong>Nota:</strong> Cada função deve ter um único <code translate="no">name</code> e <code translate="no">output_field_names</code> para distinguir diferentes lógicas de transformação e evitar conflitos.</p>
<pre><code translate="no"><span class="hljs-comment"># Define embedding function (example: OpenAI provider)</span>
text_embedding_function = Function(
    name=<span class="hljs-string">&quot;cohere_embedding&quot;</span>,                  <span class="hljs-comment"># Unique identifier for this embedding function</span>
    function_type=FunctionType.TEXTEMBEDDING, <span class="hljs-comment"># Type of embedding function</span>
    input_field_names=[<span class="hljs-string">&quot;document&quot;</span>],           <span class="hljs-comment"># Scalar field to embed</span>
    output_field_names=[<span class="hljs-string">&quot;dense&quot;</span>],             <span class="hljs-comment"># Vector field to store embeddings</span>
    params={                                  <span class="hljs-comment"># Provider-specific configuration (highest priority)</span>
        <span class="hljs-string">&quot;provider&quot;</span>: <span class="hljs-string">&quot;cohere&quot;</span>,                 <span class="hljs-comment"># Embedding model provider</span>
        <span class="hljs-string">&quot;model_name&quot;</span>: <span class="hljs-string">&quot;embed-v4.0&quot;</span>,     <span class="hljs-comment"># Embedding model</span>
        <span class="hljs-comment"># &quot;credential&quot;: &quot;apikey1&quot;,            # Optional: Credential label</span>
        <span class="hljs-comment"># Optional parameters:</span>
        <span class="hljs-comment"># &quot;dim&quot;: &quot;1536&quot;,       # Optionally shorten the vector dimension</span>
        <span class="hljs-comment"># &quot;user&quot;: &quot;user123&quot;    # Optional: identifier for API tracking</span>
    }
)
<span class="hljs-comment"># Add the embedding function to your schema</span>
schema.add_function(text_embedding_function)
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Configure-the-Index" class="common-anchor-header">3. Configurar o índice</h3><p>Quando os campos e as funções estiverem definidos, crie um índice para a coleção. Para simplificar, utilizamos aqui o tipo AUTOINDEX como exemplo.</p>
<pre><code translate="no"><span class="hljs-comment"># Prepare index parameters</span>
index_params = client.prepare_index_params()
<span class="hljs-comment"># Add AUTOINDEX to automatically select optimal indexing method</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;dense&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span> 
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Create-the-Collection" class="common-anchor-header">4. Criar a coleção</h3><p>Utilize o esquema e o índice definidos para criar uma nova coleção. Neste exemplo, vamos criar uma coleção chamada Demo.</p>
<pre><code translate="no"><span class="hljs-comment"># Create collection named &quot;demo&quot;</span>
client.create_collection(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>, 
    schema=schema, 
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Insert-Data" class="common-anchor-header">5. Inserir dados</h3><p>Agora pode inserir dados brutos diretamente no Milvus - não há necessidade de gerar embeddings manualmente.</p>
<pre><code translate="no"><span class="hljs-comment"># Insert sample documents</span>
client.insert(<span class="hljs-string">&#x27;demo&#x27;</span>, [
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">1</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Milvus simplifies semantic search through embeddings.&#x27;</span>},
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">2</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Vector embeddings convert text into searchable numeric data.&#x27;</span>},
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">3</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Semantic search helps users find relevant information quickly.&#x27;</span>},
])
<button class="copy-code-btn"></button></code></pre>
<h3 id="6-Perform-Vector-Search" class="common-anchor-header">6. Fazer pesquisa de vectores</h3><p>Depois de inserir os dados, pode fazer pesquisas diretamente usando consultas de texto em bruto. O Milvus converte automaticamente a sua consulta num embedding, efectua uma pesquisa de similaridade com os vectores armazenados, e devolve as melhores correspondências.</p>
<pre><code translate="no"><span class="hljs-comment"># Perform semantic search</span>
results = client.search(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>, 
    data=[<span class="hljs-string">&#x27;How does Milvus handle semantic search?&#x27;</span>], <span class="hljs-comment"># Use text query rather than query vector</span>
    anns_field=<span class="hljs-string">&#x27;dense&#x27;</span>,   <span class="hljs-comment"># Use the vector field that stores embeddings</span>
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&#x27;document&#x27;</span>],
)
<span class="hljs-built_in">print</span>(results)
<span class="hljs-comment"># Example output:</span>
<span class="hljs-comment"># data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.8821347951889038, &#x27;entity&#x27;: {&#x27;document&#x27;: &#x27;Milvus simplifies semantic search through embeddings.&#x27;}}]&quot;]</span>
<button class="copy-code-btn"></button></code></pre>
<p>Para obter mais detalhes sobre a pesquisa de vetores, consulte: <a href="https://milvus.io/docs/single-vector-search.md">Pesquisa Vetorial Básica </a>e <a href="https://milvus.io/docs/get-and-scalar-query.md">API de Consulta</a>.</p>
<h2 id="Get-Started-with-Milvus-26" class="common-anchor-header">Começar a usar o Milvus 2.6<button data-href="#Get-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Com Data-in, Data-out, Milvus 2.6 leva a simplicidade da pesquisa vetorial para o próximo nível. Ao integrar as funções de embedding e reranking diretamente no Milvus, deixa de ser necessário gerir o pré-processamento externo ou manter serviços de embedding separados.</p>
<p>Pronto para experimentar? Instale <a href="https://milvus.io/docs">o Milvus</a> 2.6 hoje e experimente o poder do Data-in, Data-out por si mesmo.</p>
<p>Tem dúvidas ou quer aprofundar alguma funcionalidade? Junte-se ao nosso<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou registe problemas no<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Também pode reservar uma sessão individual de 20 minutos para obter informações, orientação e respostas às suas perguntas através do<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Saiba mais sobre os recursos do Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Apresentando o Milvus 2.6: Pesquisa Vetorial Acessível em Escala de Bilhões</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">JSON Shredding em Milvus: Filtragem JSON 88,9x mais rápida com flexibilidade</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Desbloqueando a verdadeira recuperação em nível de entidade: Novas capacidades de Array-of-Structs e MAX_SIM em Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH em Milvus: A arma secreta para combater duplicatas em dados de treinamento LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Leve a compressão vetorial ao extremo: como o Milvus atende a 3× mais consultas com o RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Os benchmarks mentem - os bancos de dados vetoriais merecem um teste real </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Substituímos o Kafka/Pulsar por um pica-pau para o Milvus </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Pesquisa vetorial no mundo real: como filtrar com eficiência sem prejudicar a recuperação </a></p></li>
</ul>
