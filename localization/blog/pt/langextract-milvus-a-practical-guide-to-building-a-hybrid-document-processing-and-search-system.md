---
id: >-
  langextract-milvus-a-practical-guide-to-building-a-hybrid-document-processing-and-search-system.md
title: >-
  LangExtract + Milvus: um guia prático para criar um sistema híbrido de
  processamento e pesquisa de documentos
author: 'Cheney Zhang, Lumina Wang'
date: 2025-08-28T00:00:00.000Z
desc: >-
  Saiba como combinar o LangExtract e o Milvus para uma pesquisa de código
  híbrida - obtendo uma filtragem precisa com recuperação semântica num pipeline
  inteligente.
cover: assets.zilliz.com/Langextract_1c4d9835a4.png
tag: Tutorials
recommend: false
tags: 'Milvus, vector database, vector search'
meta_keywords: 'LangExtract, Milvus, hybrid search, code search, semantic retrieval'
meta_title: |
  Hybrid Document Retrieval System with LangExtract + Milvus
origin: >-
  https://milvus.io/blog/langextract-milvus-a-practical-guide-to-building-a-hybrid-document-processing-and-search-system.md
---
<p>Num <a href="https://milvus.io/blog/why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md">blogue anterior</a>, comparámos duas abordagens populares à pesquisa de código em muitos agentes de codificação:</p>
<ul>
<li><p><strong>RAG (recuperação semântica) alimentada por pesquisa vetorial</strong> - utilizada por ferramentas como o Cursor</p></li>
<li><p><strong>Pesquisa de palavras-chave com</strong> <code translate="no">grep</code> <strong>(correspondência de cadeia literal)</strong> - usada pelo Claude Code e Gemini</p></li>
</ul>
<p>Esta publicação suscitou muitos comentários. Alguns programadores defenderam o RAG, referindo que o <code translate="no">grep</code> inclui frequentemente correspondências irrelevantes e incha o contexto. Outros defenderam a pesquisa por palavra-chave, dizendo que a precisão é tudo e que os embeddings ainda são demasiado confusos para se poder confiar.</p>
<p>Ambos os lados têm razão. A realidade é que não existe uma solução perfeita e única para todos os casos.</p>
<ul>
<li><p>Se confiar apenas nas incorporações, não conseguirá encontrar regras rigorosas ou correspondências exactas.</p></li>
<li><p>Confie apenas em palavras-chave e perderá a compreensão semântica do que o código (ou texto) realmente significa.</p></li>
</ul>
<p>Este tutorial demonstra um método para <strong>combinar ambas as abordagens de forma inteligente</strong>. Mostraremos como usar o <a href="https://github.com/google/langextract">LangExtract - uma</a>biblioteca Python que usa LLMs para transformar texto confuso em dados estruturados com atribuição precisa da fonte - juntamente com o <a href="https://milvus.io/">Milvus</a>, um banco de dados vetorial de alto desempenho de código aberto, para criar um sistema de processamento e recuperação de documentos mais inteligente e de alta qualidade.</p>
<h3 id="Key-Technologies-We’ll-Use" class="common-anchor-header">Tecnologias chave que iremos utilizar</h3><p>Antes de começarmos a construir este sistema de processamento e recuperação de documentos, vamos dar uma vista de olhos às principais tecnologias que iremos utilizar neste tutorial.</p>
<h3 id="What-is-LangExtract" class="common-anchor-header">O que é o LangExtract?</h3><p><a href="https://github.com/langextract/langextract">LangExtract</a> é uma nova biblioteca Python, de código aberto pelo Google, que utiliza LLMs para transformar texto confuso e não estruturado em dados estruturados com atribuição de fonte. Já é popular (13K+ estrelas no GitHub) porque torna tarefas como a extração de informação muito simples.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_c04bdf275b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
As principais caraterísticas incluem:</p>
<ul>
<li><p>Extração estruturada: Defina um esquema e extraia nomes, datas, locais, encargos e outras informações relevantes.</p></li>
<li><p>Rastreabilidade da fonte: Cada campo extraído é ligado ao texto original, reduzindo a probabilidade de alucinações.</p></li>
<li><p>Escala para documentos longos: Lida com milhões de caracteres com chunking + multi-threading.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_6a4b42a265.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O LangExtract é especialmente útil em domínios como o direito, os cuidados de saúde e a ciência forense, onde a precisão é crucial. Por exemplo, em vez de recuperar um bloco gigante de texto com o RAG, o LangExtract pode extrair apenas as datas, as cláusulas ou os dados demográficos dos pacientes que lhe interessam, preservando ao mesmo tempo o contexto semântico.</p>
<h3 id="What’s-Milvus" class="common-anchor-header">O que é o Milvus?</h3><p><a href="https://milvus.io/">O Milvus</a> é uma base de dados vetorial de código aberto com mais de 36 mil estrelas no Github e foi adoptada por mais de 10 mil empresas de vários sectores. O Milvus é amplamente utilizado em sistemas RAG, agentes de IA, motores de recomendação, deteção de anomalias e pesquisa semântica, o que o torna um elemento essencial para aplicações baseadas em IA.</p>
<h2 id="Building-a-High-Quality-Document-Processing-System-with-LangExtract-+-Milvus" class="common-anchor-header">Criar um sistema de processamento de documentos de alta qualidade com LangExtract + Milvus<button data-href="#Building-a-High-Quality-Document-Processing-System-with-LangExtract-+-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Este guia orienta-o no processo de combinação <a href="https://github.com/google/langextract">do LangExtract</a> e do<a href="https://milvus.io/"> Milvus</a> para criar um sistema inteligente de processamento e recuperação de documentos.</p>
<ul>
<li><p>O LangExtract gera metadados limpos e estruturados e depois armazena-os e pesquisa-os eficientemente com o Milvus, dando-nos o melhor de dois mundos: filtragem precisa e recuperação semântica.</p></li>
<li><p>O Milvus actuará como a espinha dorsal da recuperação, armazenando tanto os embeddings (para pesquisa semântica) como os metadados estruturados extraídos pelo LangExtract, permitindo-nos executar consultas híbridas precisas e inteligentes em escala.</p></li>
</ul>
<h3 id="Prerequisites" class="common-anchor-header">Pré-requisitos</h3><p>Antes de começar, certifique-se de que tem as seguintes dependências instaladas:</p>
<pre><code translate="no">! pip install --upgrade pymilvus langextract google-genai requests tqdm pandas
<button class="copy-code-btn"></button></code></pre>
<p>Usaremos o Gemini como LLM para este exemplo. Você precisará configurar sua<a href="https://aistudio.google.com/app/apikey"> chave de API</a> como uma variável de ambiente:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;GEMINI_API_KEY&quot;</span>] = <span class="hljs-string">&quot;AIza*****************&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Setting-Up-the-LangExtract-+-Milvus-Pipeline" class="common-anchor-header"><strong>Configurando o pipeline LangExtract + Milvus</strong></h3><p>Vamos começar definindo nosso pipeline que usa o LangExtract para extração de informações estruturadas e o Milvus como nosso armazenamento de vetores.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> langextract <span class="hljs-keyword">as</span> lx
<span class="hljs-keyword">import</span> textwrap
<span class="hljs-keyword">from</span> google <span class="hljs-keyword">import</span> genai
<span class="hljs-keyword">from</span> google.<span class="hljs-property">genai</span>.<span class="hljs-property">types</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">EmbedContentConfig</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>, <span class="hljs-title class_">DataType</span>
<span class="hljs-keyword">import</span> uuid
<button class="copy-code-btn"></button></code></pre>
<h3 id="Configuration-and-Setup" class="common-anchor-header"><strong>Configuração e instalação</strong></h3><p>Agora vamos configurar os parâmetros globais para nossa integração. Estamos a utilizar o modelo de incorporação do Gemini para gerar representações vectoriais para os nossos documentos.</p>
<pre><code translate="no">genai_client = genai.Client()
COLLECTION_NAME = <span class="hljs-string">&quot;document_extractions&quot;</span>
EMBEDDING_MODEL = <span class="hljs-string">&quot;gemini-embedding-001&quot;</span>
EMBEDDING_DIM = <span class="hljs-number">3072</span>  <span class="hljs-comment"># Default dimension for gemini-embedding-001</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Initializing-the-Milvus-Client" class="common-anchor-header"><strong>Inicializando o cliente Milvus</strong></h3><p>Vamos inicializar nosso cliente Milvus. Para simplificar, usaremos um arquivo de banco de dados local, embora essa abordagem seja facilmente escalável para implantações completas do servidor Milvus.</p>
<pre><code translate="no">client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Sobre os parâmetros <code translate="no">MilvusClient</code>:</strong></p>
<p>Definir o <code translate="no">uri</code> como um ficheiro local (como <code translate="no">./milvus.db</code>) é o método mais conveniente, uma vez que utiliza automaticamente<a href="https://milvus.io/docs/milvus_lite.md"> o Milvus Lite</a> para armazenar todos os dados neste ficheiro.</p>
<p>Para dados em grande escala, você pode configurar um servidor Milvus de maior desempenho no<a href="https://milvus.io/docs/quickstart.md"> Docker ou Kubernetes</a>. Nesta configuração, use o uri do servidor (como[ <code translate="no">http://localhost:19530](http://localhost:19530)</code>) em vez disso.</p>
<p>Se preferir<a href="https://zilliz.com/cloud"> o Zilliz Cloud</a> (o serviço de nuvem totalmente gerido para o Milvus), ajuste o <code translate="no">uri</code> e <code translate="no">token</code> para corresponder ao seu<a href="https://docs.zilliz.com/docs/on-zilliz-cloud-console#free-cluster-details"> Ponto Final Público e chave API</a> do Zilliz Cloud.</p>
<h3 id="Preparing-Sample-Data" class="common-anchor-header"><strong>Preparação de dados de amostra</strong></h3><p>Para esta demonstração, usaremos descrições de filmes como nossos documentos de amostra. Isto mostra como o LangExtract pode extrair informações estruturadas como géneros, personagens e temas de texto não estruturado.</p>
<pre><code translate="no">sample_documents = [
    <span class="hljs-string">&quot;John McClane fights terrorists in a Los Angeles skyscraper during Christmas Eve. The action-packed thriller features intense gunfights and explosive scenes.&quot;</span>,
    <span class="hljs-string">&quot;A young wizard named Harry Potter discovers his magical abilities at Hogwarts School. The fantasy adventure includes magical creatures and epic battles.&quot;</span>,
    <span class="hljs-string">&quot;Tony Stark builds an advanced suit of armor to become Iron Man. The superhero movie showcases cutting-edge technology and spectacular action sequences.&quot;</span>,
    <span class="hljs-string">&quot;A group of friends get lost in a haunted forest where supernatural creatures lurk. The horror film creates a terrifying atmosphere with jump scares.&quot;</span>,
    <span class="hljs-string">&quot;Two detectives investigate a series of mysterious murders in New York City. The crime thriller features suspenseful plot twists and dramatic confrontations.&quot;</span>,
    <span class="hljs-string">&quot;A brilliant scientist creates artificial intelligence that becomes self-aware. The sci-fi thriller explores the dangers of advanced technology and human survival.&quot;</span>,
    <span class="hljs-string">&quot;A romantic comedy about two friends who fall in love during a cross-country road trip. The drama explores personal growth and relationship dynamics.&quot;</span>,
    <span class="hljs-string">&quot;An evil sorcerer threatens to destroy the magical kingdom. A brave hero must gather allies and master ancient magic to save the fantasy world.&quot;</span>,
    <span class="hljs-string">&quot;Space marines battle alien invaders on a distant planet. The action sci-fi movie features futuristic weapons and intense combat in space.&quot;</span>,
    <span class="hljs-string">&quot;A detective investigates supernatural crimes in Victorian London. The horror thriller combines period drama with paranormal investigation themes.&quot;</span>,
]

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=== LangExtract + Milvus Integration Demo ===&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Preparing to process <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sample_documents)}</span> documents&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Setting-Up-the-Milvus-Collection" class="common-anchor-header"><strong>Configurando a coleção Milvus</strong></h3><p>Antes de podermos armazenar nossos dados extraídos, precisamos criar uma coleção Milvus com o esquema apropriado. Esta coleção irá armazenar o texto do documento original, as incorporações vectoriais e os campos de metadados extraídos.</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n1. Setting up Milvus collection...&quot;</span>)

<span class="hljs-comment"># Drop existing collection if it exists</span>
<span class="hljs-keyword">if</span> client.has_collection(collection_name=COLLECTION_NAME):
    client.drop_collection(collection_name=COLLECTION_NAME)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dropped existing collection: <span class="hljs-subst">{COLLECTION_NAME}</span>&quot;</span>)

<span class="hljs-comment"># Create collection schema</span>
schema = client.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">True</span>,
    description=<span class="hljs-string">&quot;Document extraction results and vector storage&quot;</span>,
)

<span class="hljs-comment"># Add fields - simplified to 3 main metadata fields</span>
schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>, is_primary=<span class="hljs-literal">True</span>
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;document_text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">10000</span>
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=EMBEDDING_DIM
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(collection_name=COLLECTION_NAME, schema=schema)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created successfully&quot;</span>)

<span class="hljs-comment"># Create vector index</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
)
client.create_index(collection_name=COLLECTION_NAME, index_params=index_params)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Vector index created successfully&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Defining-the-Extraction-Schema" class="common-anchor-header"><strong>Definir o esquema de extração</strong></h3><p>O LangExtract utiliza avisos e exemplos para guiar o LLM na extração de informação estruturada. Vamos definir o nosso esquema de extração para descrições de filmes, especificando exatamente que informação extrair e como categorizá-la.</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n2. Extracting tags from documents...&quot;</span>)

<span class="hljs-comment"># Define extraction prompt - for movie descriptions, specify attribute value ranges</span>
prompt = textwrap.dedent(
    <span class="hljs-string">&quot;&quot;</span><span class="hljs-string">&quot;\
    Extract movie genre, main characters, and key themes from movie descriptions.
    Use exact text for extractions. Do not paraphrase or overlap entities.
    
    For each extraction, provide attributes with values from these predefined sets:
    
    Genre attributes:
    - primary_genre: [&quot;</span>action<span class="hljs-string">&quot;, &quot;</span>comedy<span class="hljs-string">&quot;, &quot;</span>drama<span class="hljs-string">&quot;, &quot;</span>horror<span class="hljs-string">&quot;, &quot;</span>sci-fi<span class="hljs-string">&quot;, &quot;</span>fantasy<span class="hljs-string">&quot;, &quot;</span>thriller<span class="hljs-string">&quot;, &quot;</span>crime<span class="hljs-string">&quot;, &quot;</span>superhero<span class="hljs-string">&quot;]
    - secondary_genre: [&quot;</span>action<span class="hljs-string">&quot;, &quot;</span>comedy<span class="hljs-string">&quot;, &quot;</span>drama<span class="hljs-string">&quot;, &quot;</span>horror<span class="hljs-string">&quot;, &quot;</span>sci-fi<span class="hljs-string">&quot;, &quot;</span>fantasy<span class="hljs-string">&quot;, &quot;</span>thriller<span class="hljs-string">&quot;, &quot;</span>crime<span class="hljs-string">&quot;, &quot;</span>superhero<span class="hljs-string">&quot;]
    
    Character attributes:
    - role: [&quot;</span>protagonist<span class="hljs-string">&quot;, &quot;</span>antagonist<span class="hljs-string">&quot;, &quot;</span>supporting<span class="hljs-string">&quot;]
    - type: [&quot;</span>hero<span class="hljs-string">&quot;, &quot;</span>villain<span class="hljs-string">&quot;, &quot;</span>detective<span class="hljs-string">&quot;, &quot;</span>military<span class="hljs-string">&quot;, &quot;</span>wizard<span class="hljs-string">&quot;, &quot;</span>scientist<span class="hljs-string">&quot;, &quot;</span>friends<span class="hljs-string">&quot;, &quot;</span>investigator<span class="hljs-string">&quot;]
    
    Theme attributes:
    - theme_type: [&quot;</span>conflict<span class="hljs-string">&quot;, &quot;</span>investigation<span class="hljs-string">&quot;, &quot;</span>personal_growth<span class="hljs-string">&quot;, &quot;</span>technology<span class="hljs-string">&quot;, &quot;</span>magic<span class="hljs-string">&quot;, &quot;</span>survival<span class="hljs-string">&quot;, &quot;</span>romance<span class="hljs-string">&quot;]
    - setting: [&quot;</span>urban<span class="hljs-string">&quot;, &quot;</span>space<span class="hljs-string">&quot;, &quot;</span>fantasy_world<span class="hljs-string">&quot;, &quot;</span>school<span class="hljs-string">&quot;, &quot;</span>forest<span class="hljs-string">&quot;, &quot;</span>victorian<span class="hljs-string">&quot;, &quot;</span>america<span class="hljs-string">&quot;, &quot;</span>future<span class="hljs-string">&quot;]
    
    Focus on identifying key elements that would be useful for movie search and filtering.&quot;</span><span class="hljs-string">&quot;&quot;</span>
)

<button class="copy-code-btn"></button></code></pre>
<h3 id="Providing-Examples-to-Improve-Extraction-Quality" class="common-anchor-header"><strong>Fornecer exemplos para melhorar a qualidade da extração</strong></h3><p>Para melhorar a qualidade e consistência da extração, vamos fornecer ao LangExtract exemplos cuidadosamente elaborados. Estes exemplos demonstram o formato esperado e ajudam o modelo a compreender os nossos requisitos de extração específicos.</p>
<pre><code translate="no"><span class="hljs-comment"># Provide examples to guide the model - n-shot examples for movie descriptions</span>
<span class="hljs-comment"># Unify attribute keys to ensure consistency in extraction results</span>
examples = [
    lx.data.ExampleData(
        text=<span class="hljs-string">&quot;A space marine battles alien creatures on a distant planet. The sci-fi action movie features futuristic weapons and intense combat scenes.&quot;</span>,
        extractions=[
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;genre&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;sci-fi action&quot;</span>,
                attributes={<span class="hljs-string">&quot;primary_genre&quot;</span>: <span class="hljs-string">&quot;sci-fi&quot;</span>, <span class="hljs-string">&quot;secondary_genre&quot;</span>: <span class="hljs-string">&quot;action&quot;</span>},
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;character&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;space marine&quot;</span>,
                attributes={<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;protagonist&quot;</span>, <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;military&quot;</span>},
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;theme&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;battles alien creatures&quot;</span>,
                attributes={<span class="hljs-string">&quot;theme_type&quot;</span>: <span class="hljs-string">&quot;conflict&quot;</span>, <span class="hljs-string">&quot;setting&quot;</span>: <span class="hljs-string">&quot;space&quot;</span>},
            ),
        ],
    ),
    lx.data.ExampleData(
        text=<span class="hljs-string">&quot;A detective investigates supernatural murders in Victorian London. The horror thriller film combines period drama with paranormal elements.&quot;</span>,
        extractions=[
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;genre&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;horror thriller&quot;</span>,
                attributes={<span class="hljs-string">&quot;primary_genre&quot;</span>: <span class="hljs-string">&quot;horror&quot;</span>, <span class="hljs-string">&quot;secondary_genre&quot;</span>: <span class="hljs-string">&quot;thriller&quot;</span>},
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;character&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;detective&quot;</span>,
                attributes={<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;protagonist&quot;</span>, <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;detective&quot;</span>},
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;theme&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;supernatural murders&quot;</span>,
                attributes={<span class="hljs-string">&quot;theme_type&quot;</span>: <span class="hljs-string">&quot;investigation&quot;</span>, <span class="hljs-string">&quot;setting&quot;</span>: <span class="hljs-string">&quot;victorian&quot;</span>},
            ),
        ],
    ),
    lx.data.ExampleData(
        text=<span class="hljs-string">&quot;Two friends embark on a road trip adventure across America. The comedy drama explores friendship and self-discovery through humorous situations.&quot;</span>,
        extractions=[
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;genre&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;comedy drama&quot;</span>,
                attributes={<span class="hljs-string">&quot;primary_genre&quot;</span>: <span class="hljs-string">&quot;comedy&quot;</span>, <span class="hljs-string">&quot;secondary_genre&quot;</span>: <span class="hljs-string">&quot;drama&quot;</span>},
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;character&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;two friends&quot;</span>,
                attributes={<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;protagonist&quot;</span>, <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;friends&quot;</span>},
            ),
            lx.data.Extraction(
                extraction_class=<span class="hljs-string">&quot;theme&quot;</span>,
                extraction_text=<span class="hljs-string">&quot;friendship and self-discovery&quot;</span>,
                attributes={<span class="hljs-string">&quot;theme_type&quot;</span>: <span class="hljs-string">&quot;personal_growth&quot;</span>, <span class="hljs-string">&quot;setting&quot;</span>: <span class="hljs-string">&quot;america&quot;</span>},
            ),
        ],
    ),
]

<span class="hljs-comment"># Extract from each document</span>
extraction_results = []
<span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> sample_documents:
    result = lx.extract(
        text_or_documents=doc,
        prompt_description=prompt,
        examples=examples,
        model_id=<span class="hljs-string">&quot;gemini-2.0-flash&quot;</span>,
    )
    extraction_results.append(result)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully extracted from document: <span class="hljs-subst">{doc[:<span class="hljs-number">50</span>]}</span>...&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Completed tag extraction, processed <span class="hljs-subst">{<span class="hljs-built_in">len</span>(extraction_results)}</span> documents&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-title class_">Successfully</span> extracted <span class="hljs-keyword">from</span> <span class="hljs-attr">document</span>: <span class="hljs-title class_">John</span> <span class="hljs-title class_">McClane</span> fights terrorists <span class="hljs-keyword">in</span> a <span class="hljs-title class_">Los</span> <span class="hljs-title class_">Angeles</span>...
...
<span class="hljs-title class_">Completed</span> tag extraction, processed <span class="hljs-number">10</span> documents
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_7f539fec12.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Processing-and-Vectorizing-Results" class="common-anchor-header"><strong>Processamento e vectorização de resultados</strong></h3><p>Agora precisamos de processar os nossos resultados de extração e gerar embeddings vectoriais para cada documento. Também vamos achatar os atributos extraídos em campos separados para os tornar facilmente pesquisáveis no Milvus.</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n3. Processing extraction results and generating vectors...&quot;</span>)

processed_data = []

<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> extraction_results:
    <span class="hljs-comment"># Generate vectors for documents</span>
    embedding_response = genai_client.models.embed_content(
        model=EMBEDDING_MODEL,
        contents=[result.text],
        config=EmbedContentConfig(
            task_type=<span class="hljs-string">&quot;RETRIEVAL_DOCUMENT&quot;</span>,
            output_dimensionality=EMBEDDING_DIM,
        ),
    )
    embedding = embedding_response.embeddings[<span class="hljs-number">0</span>].values
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully generated vector: <span class="hljs-subst">{result.text[:<span class="hljs-number">30</span>]}</span>...&quot;</span>)

    <span class="hljs-comment"># Initialize data structure, flatten attributes into separate fields</span>
    data_entry = {
        <span class="hljs-string">&quot;id&quot;</span>: result.document_id <span class="hljs-keyword">or</span> <span class="hljs-built_in">str</span>(uuid.uuid4()),
        <span class="hljs-string">&quot;document_text&quot;</span>: result.text,
        <span class="hljs-string">&quot;embedding&quot;</span>: embedding,
        <span class="hljs-comment"># Initialize all possible fields with default values</span>
        <span class="hljs-string">&quot;genre&quot;</span>: <span class="hljs-string">&quot;unknown&quot;</span>,
        <span class="hljs-string">&quot;primary_genre&quot;</span>: <span class="hljs-string">&quot;unknown&quot;</span>,
        <span class="hljs-string">&quot;secondary_genre&quot;</span>: <span class="hljs-string">&quot;unknown&quot;</span>,
        <span class="hljs-string">&quot;character_role&quot;</span>: <span class="hljs-string">&quot;unknown&quot;</span>,
        <span class="hljs-string">&quot;character_type&quot;</span>: <span class="hljs-string">&quot;unknown&quot;</span>,
        <span class="hljs-string">&quot;theme_type&quot;</span>: <span class="hljs-string">&quot;unknown&quot;</span>,
        <span class="hljs-string">&quot;theme_setting&quot;</span>: <span class="hljs-string">&quot;unknown&quot;</span>,
    }

    <span class="hljs-comment"># Process extraction results, flatten attributes</span>
    <span class="hljs-keyword">for</span> extraction <span class="hljs-keyword">in</span> result.extractions:
        <span class="hljs-keyword">if</span> extraction.extraction_class == <span class="hljs-string">&quot;genre&quot;</span>:
            <span class="hljs-comment"># Flatten genre attributes</span>
            data_entry[<span class="hljs-string">&quot;genre&quot;</span>] = extraction.extraction_text
            attrs = extraction.attributes <span class="hljs-keyword">or</span> {}
            data_entry[<span class="hljs-string">&quot;primary_genre&quot;</span>] = attrs.get(<span class="hljs-string">&quot;primary_genre&quot;</span>, <span class="hljs-string">&quot;unknown&quot;</span>)
            data_entry[<span class="hljs-string">&quot;secondary_genre&quot;</span>] = attrs.get(<span class="hljs-string">&quot;secondary_genre&quot;</span>, <span class="hljs-string">&quot;unknown&quot;</span>)

        <span class="hljs-keyword">elif</span> extraction.extraction_class == <span class="hljs-string">&quot;character&quot;</span>:
            <span class="hljs-comment"># Flatten character attributes (take first main character&#x27;s attributes)</span>
            attrs = extraction.attributes <span class="hljs-keyword">or</span> {}
            <span class="hljs-keyword">if</span> (
                data_entry[<span class="hljs-string">&quot;character_role&quot;</span>] == <span class="hljs-string">&quot;unknown&quot;</span>
            ):  <span class="hljs-comment"># Only take first character&#x27;s attributes</span>
                data_entry[<span class="hljs-string">&quot;character_role&quot;</span>] = attrs.get(<span class="hljs-string">&quot;role&quot;</span>, <span class="hljs-string">&quot;unknown&quot;</span>)
                data_entry[<span class="hljs-string">&quot;character_type&quot;</span>] = attrs.get(<span class="hljs-string">&quot;type&quot;</span>, <span class="hljs-string">&quot;unknown&quot;</span>)

        <span class="hljs-keyword">elif</span> extraction.extraction_class == <span class="hljs-string">&quot;theme&quot;</span>:
            <span class="hljs-comment"># Flatten theme attributes (take first main theme&#x27;s attributes)</span>
            attrs = extraction.attributes <span class="hljs-keyword">or</span> {}
            <span class="hljs-keyword">if</span> (
                data_entry[<span class="hljs-string">&quot;theme_type&quot;</span>] == <span class="hljs-string">&quot;unknown&quot;</span>
            ):  <span class="hljs-comment"># Only take first theme&#x27;s attributes</span>
                data_entry[<span class="hljs-string">&quot;theme_type&quot;</span>] = attrs.get(<span class="hljs-string">&quot;theme_type&quot;</span>, <span class="hljs-string">&quot;unknown&quot;</span>)
                data_entry[<span class="hljs-string">&quot;theme_setting&quot;</span>] = attrs.get(<span class="hljs-string">&quot;setting&quot;</span>, <span class="hljs-string">&quot;unknown&quot;</span>)

    processed_data.append(data_entry)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Completed data processing, ready to insert <span class="hljs-subst">{<span class="hljs-built_in">len</span>(processed_data)}</span> records&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">3. Processing extraction results and generating vectors...
Successfully generated vector: John McClane fights terrorists...
...
Completed data processing, ready to insert 10 records

<button class="copy-code-btn"></button></code></pre>
<h3 id="Inserting-Data-into-Milvus" class="common-anchor-header"><strong>Inserção de dados no Milvus</strong></h3><p>Com os nossos dados processados prontos, vamos inseri-los na nossa coleção Milvus. Isto permite-nos efetuar pesquisas semânticas e filtragem precisa de metadados.</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n4. Inserting data into Milvus...&quot;</span>)

<span class="hljs-keyword">if</span> processed_data:
    res = client.insert(collection_name=COLLECTION_NAME, data=processed_data)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully inserted <span class="hljs-subst">{<span class="hljs-built_in">len</span>(processed_data)}</span> documents into Milvus&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Insert result: <span class="hljs-subst">{res}</span>&quot;</span>)
<span class="hljs-keyword">else</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;No data to insert&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-number">4.</span> Inserting data <span class="hljs-keyword">into</span> Milvus...
Successfully inserted <span class="hljs-number">10</span> documents <span class="hljs-keyword">into</span> Milvus
Insert result: {<span class="hljs-string">&#x27;insert_count&#x27;</span>: <span class="hljs-number">10</span>, <span class="hljs-string">&#x27;ids&#x27;</span>: [<span class="hljs-string">&#x27;doc_f8797155&#x27;</span>, <span class="hljs-string">&#x27;doc_78c7e586&#x27;</span>, <span class="hljs-string">&#x27;doc_fa3a3ab5&#x27;</span>, <span class="hljs-string">&#x27;doc_64981815&#x27;</span>, <span class="hljs-string">&#x27;doc_3ab18cb2&#x27;</span>, <span class="hljs-string">&#x27;doc_1ea42b18&#x27;</span>, <span class="hljs-string">&#x27;doc_f0779243&#x27;</span>, <span class="hljs-string">&#x27;doc_386590b7&#x27;</span>, <span class="hljs-string">&#x27;doc_3b3ae1ab&#x27;</span>, <span class="hljs-string">&#x27;doc_851089d6&#x27;</span>]}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Demonstrating-Metadata-Filtering" class="common-anchor-header"><strong>Demonstração da filtragem de metadados</strong></h3><p>Uma das principais vantagens da combinação do LangExtract com o Milvus é a capacidade de efetuar uma filtragem precisa com base nos metadados extraídos. Vamos ver isto em ação com algumas pesquisas de expressão de filtro.</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Filter Expression Search Examples ===&quot;</span>)

<span class="hljs-comment"># Load collection into memory for querying</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Loading collection into memory...&quot;</span>)
client.load_collection(collection_name=COLLECTION_NAME)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Collection loaded successfully&quot;</span>)

<span class="hljs-comment"># Search for thriller movies</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n1. Searching for thriller movies:&quot;</span>)
results = client.query(
    collection_name=COLLECTION_NAME,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;secondary_genre == &quot;thriller&quot;&#x27;</span>,
    output_fields=[<span class="hljs-string">&quot;document_text&quot;</span>, <span class="hljs-string">&quot;genre&quot;</span>, <span class="hljs-string">&quot;primary_genre&quot;</span>, <span class="hljs-string">&quot;secondary_genre&quot;</span>],
    limit=<span class="hljs-number">5</span>,
)

<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;- <span class="hljs-subst">{result[<span class="hljs-string">&#x27;document_text&#x27;</span>][:<span class="hljs-number">100</span>]}</span>...&quot;</span>)
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;  Genre: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;genre&#x27;</span>]}</span> (<span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;primary_genre&#x27;</span>)}</span>-<span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;secondary_genre&#x27;</span>)}</span>)&quot;</span>
    )

<span class="hljs-comment"># Search for movies with military characters</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n2. Searching for movies with military characters:&quot;</span>)
results = client.query(
    collection_name=COLLECTION_NAME,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;character_type == &quot;military&quot;&#x27;</span>,
    output_fields=[<span class="hljs-string">&quot;document_text&quot;</span>, <span class="hljs-string">&quot;genre&quot;</span>, <span class="hljs-string">&quot;character_role&quot;</span>, <span class="hljs-string">&quot;character_type&quot;</span>],
    limit=<span class="hljs-number">5</span>,
)

<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;- <span class="hljs-subst">{result[<span class="hljs-string">&#x27;document_text&#x27;</span>][:<span class="hljs-number">100</span>]}</span>...&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Genre: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;genre&#x27;</span>]}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;  Character: <span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;character_role&#x27;</span>)}</span> (<span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;character_type&#x27;</span>)}</span>)&quot;</span>
    )
=== Filter Expression Search Examples ===
Loading collection into memory...
Collection loaded successfully

<span class="hljs-number">1.</span> Searching <span class="hljs-keyword">for</span> thriller movies:
- A brilliant scientist creates artificial intelligence that becomes <span class="hljs-variable language_">self</span>-aware. The sci-fi thriller e...
  Genre: sci-fi thriller (sci-fi-thriller)
- Two detectives investigate a series of mysterious murders <span class="hljs-keyword">in</span> New York City. The crime thriller featu...
  Genre: crime thriller (crime-thriller)
- A detective investigates supernatural crimes <span class="hljs-keyword">in</span> Victorian London. The horror thriller combines perio...
  Genre: horror thriller (horror-thriller)
- John McClane fights terrorists <span class="hljs-keyword">in</span> a Los Angeles skyscraper during Christmas Eve. The action-packed t...
  Genre: action-packed thriller (action-thriller)

<span class="hljs-number">2.</span> Searching <span class="hljs-keyword">for</span> movies <span class="hljs-keyword">with</span> military characters:
- Space marines battle alien invaders on a distant planet. The action sci-fi movie features futuristic...
  Genre: action sci-fi
  Character: protagonist (military)
<button class="copy-code-btn"></button></code></pre>
<p>Perfeito! Os resultados da nossa pesquisa correspondem exatamente às condições de filtragem "thriller" e "caracteres militares".</p>
<h3 id="Combining-Semantic-Search-with-Metadata-Filtering" class="common-anchor-header"><strong>Combinar a pesquisa semântica com a filtragem de metadados</strong></h3><p>É aqui que brilha o verdadeiro poder desta integração: combinar a pesquisa vetorial semântica com a filtragem precisa de metadados. Isto permite-nos encontrar conteúdos semanticamente semelhantes e aplicar restrições específicas com base nos nossos atributos extraídos.</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Semantic Search Examples ===&quot;</span>)

<span class="hljs-comment"># 1. Search for action-related content + only thriller genre</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n1. Searching for action-related content + only thriller genre:&quot;</span>)
query_text = <span class="hljs-string">&quot;action fight combat battle explosion&quot;</span>

query_embedding_response = genai_client.models.embed_content(
    model=EMBEDDING_MODEL,
    contents=[query_text],
    config=EmbedContentConfig(
        task_type=<span class="hljs-string">&quot;RETRIEVAL_QUERY&quot;</span>,
        output_dimensionality=EMBEDDING_DIM,
    ),
)
query_embedding = query_embedding_response.embeddings[<span class="hljs-number">0</span>].values

results = client.search(
    collection_name=COLLECTION_NAME,
    data=[query_embedding],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    limit=<span class="hljs-number">3</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;secondary_genre == &quot;thriller&quot;&#x27;</span>,
    output_fields=[<span class="hljs-string">&quot;document_text&quot;</span>, <span class="hljs-string">&quot;genre&quot;</span>, <span class="hljs-string">&quot;primary_genre&quot;</span>, <span class="hljs-string">&quot;secondary_genre&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
)

<span class="hljs-keyword">if</span> results:
    <span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;- Similarity: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Text: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;document_text&#x27;</span>][:<span class="hljs-number">100</span>]}</span>...&quot;</span>)
        <span class="hljs-built_in">print</span>(
            <span class="hljs-string">f&quot;  Genre: <span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;genre&#x27;</span>)}</span> (<span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;primary_genre&#x27;</span>)}</span>-<span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;secondary_genre&#x27;</span>)}</span>)&quot;</span>
        )

<span class="hljs-comment"># 2. Search for magic-related content + fantasy genre + conflict theme</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n2. Searching for magic-related content + fantasy genre + conflict theme:&quot;</span>)
query_text = <span class="hljs-string">&quot;magic wizard spell fantasy magical&quot;</span>

query_embedding_response = genai_client.models.embed_content(
    model=EMBEDDING_MODEL,
    contents=[query_text],
    config=EmbedContentConfig(
        task_type=<span class="hljs-string">&quot;RETRIEVAL_QUERY&quot;</span>,
        output_dimensionality=EMBEDDING_DIM,
    ),
)
query_embedding = query_embedding_response.embeddings[<span class="hljs-number">0</span>].values

results = client.search(
    collection_name=COLLECTION_NAME,
    data=[query_embedding],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    limit=<span class="hljs-number">3</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;primary_genre == &quot;fantasy&quot; and theme_type == &quot;conflict&quot;&#x27;</span>,
    output_fields=[
        <span class="hljs-string">&quot;document_text&quot;</span>,
        <span class="hljs-string">&quot;genre&quot;</span>,
        <span class="hljs-string">&quot;primary_genre&quot;</span>,
        <span class="hljs-string">&quot;theme_type&quot;</span>,
        <span class="hljs-string">&quot;theme_setting&quot;</span>,
    ],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
)

<span class="hljs-keyword">if</span> results:
    <span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;- Similarity: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Text: <span class="hljs-subst">{result[<span class="hljs-string">&#x27;document_text&#x27;</span>][:<span class="hljs-number">100</span>]}</span>...&quot;</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Genre: <span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;genre&#x27;</span>)}</span> (<span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;primary_genre&#x27;</span>)}</span>)&quot;</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  Theme: <span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;theme_type&#x27;</span>)}</span> (<span class="hljs-subst">{result.get(<span class="hljs-string">&#x27;theme_setting&#x27;</span>)}</span>)&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Demo Complete ===&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">=== Semantic Search Examples ===

<span class="hljs-number">1.</span> Searching <span class="hljs-keyword">for</span> action-related content + only thriller genre:
- Similarity: <span class="hljs-number">0.6947</span>
  Text: John McClane fights terrorists in a Los Angeles skyscraper during Christmas Eve. The action-packed t...
  Genre: action-packed <span class="hljs-title function_">thriller</span> <span class="hljs-params">(action-thriller)</span>
- Similarity: <span class="hljs-number">0.6128</span>
  Text: Two detectives investigate a series of mysterious murders in New York City. The crime thriller featu...
  Genre: crime <span class="hljs-title function_">thriller</span> <span class="hljs-params">(crime-thriller)</span>
- Similarity: <span class="hljs-number">0.5889</span>
  Text: A brilliant scientist creates artificial intelligence that becomes self-aware. The sci-fi thriller e...
  Genre: sci-fi <span class="hljs-title function_">thriller</span> <span class="hljs-params">(sci-fi-thriller)</span>

<span class="hljs-number">2.</span> Searching <span class="hljs-keyword">for</span> magic-related content + fantasy genre + conflict theme:
- Similarity: <span class="hljs-number">0.6986</span>
  Text: An evil sorcerer threatens to destroy the magical kingdom. A brave hero must gather allies and maste...
  Genre: fantasy (fantasy)
  Theme: conflict (fantasy_world)

=== Demo Complete ===
<button class="copy-code-btn"></button></code></pre>
<p>Como pode ver, os resultados da nossa pesquisa semântica utilizando o Milvus satisfazem as condições do filtro de género e apresentam uma elevada relevância para o conteúdo do texto da nossa consulta.</p>
<h2 id="What-Youve-Built-and-What-It-Means" class="common-anchor-header">O que construiu e o que significa<button data-href="#What-Youve-Built-and-What-It-Means" class="anchor-icon" translate="no">
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
    </button></h2><p>Agora tem um sistema de processamento de documentos híbrido que combina extração estruturada com pesquisa semântica - não é necessário escolher entre precisão e flexibilidade. Esta abordagem maximiza o valor dos dados não estruturados, ao mesmo tempo que garante fiabilidade, tornando-o ideal para cenários de alto risco nos domínios financeiro, da saúde e jurídico.</p>
<p>Os mesmos princípios podem ser aplicados em todos os sectores: combine a análise de imagens estruturadas com a pesquisa semântica para obter melhores recomendações de comércio eletrónico ou aplique-a ao conteúdo de vídeo para uma melhor exploração de dados de condução autónoma.</p>
<p>Para implementações em grande escala que gerem conjuntos de dados multimodais maciços, o nosso futuro <strong>lago de dados vectoriais</strong> oferecerá um armazenamento a frio muito mais económico, suporte de tabelas amplas e processamento ETL simplificado - a evolução natural para sistemas de pesquisa híbrida em escala de produção. Fique ligado.</p>
<p>Tem dúvidas ou deseja compartilhar seus resultados? Participe da conversa no<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a> ou conecte-se com nossa comunidade no <a href="https://discord.com/invite/FG6hMJStWu">Discord</a>.</p>
