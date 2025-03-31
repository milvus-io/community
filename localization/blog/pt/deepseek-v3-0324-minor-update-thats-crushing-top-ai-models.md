---
id: deepseek-v3-0324-minor-update-thats-crushing-top-ai-models.md
title: >-
  DeepSeek V3-0324: A "pequena atualização" que está a esmagar os principais
  modelos de IA
author: Lumina Wang
date: 2025-03-25T00:00:00.000Z
desc: >-
  O DeepSeek v3-0324 é treinado com parâmetros maiores, tem uma janela de
  contexto mais longa e recursos aprimorados de Raciocínio, Codificação e
  Matemática.
cover: >-
  assets.zilliz.com/Deep_Seek_V3_0324_The_Minor_Update_That_s_Crushing_Top_AI_Models_391585994c.png
tag: Engineering
tags: 'DeepSeek V3-0324, DeepSeek V3, Milvus, RAG'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/deepseek-v3-0324-minor-update-thats-crushing-top-ai-models.md
---
<p>O DeepSeek lançou discretamente uma bomba ontem à noite. Sua última versão,<a href="https://huggingface.co/deepseek-ai/DeepSeek-V3-0324"> DeepSeek v3-0324</a>, foi minimizada no anúncio oficial como apenas uma <strong>"pequena atualização"</strong> sem alterações na API. Mas os nossos testes extensivos na <a href="https://zilliz.com/">Zilliz</a> revelaram algo mais significativo: esta atualização representa um salto quântico no desempenho, particularmente no raciocínio lógico, programação e resolução de problemas matemáticos.</p>
<p>O que estamos vendo não é apenas uma melhoria incremental - é uma mudança fundamental que posiciona o DeepSeek v3-0324 entre a camada de elite dos modelos de linguagem. E ele é de código aberto.</p>
<p><strong>Esta versão merece sua atenção imediata para desenvolvedores e empresas que criam aplicativos alimentados por IA.</strong></p>
<h2 id="Whats-New-in-DeepSeek-v3-0324-and-How-Good-Is-It-Really" class="common-anchor-header">O que há de novo no DeepSeek v3-0324 e quão bom ele é realmente?<button data-href="#Whats-New-in-DeepSeek-v3-0324-and-How-Good-Is-It-Really" class="anchor-icon" translate="no">
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
    </button></h2><p>O DeepSeek v3-0324 apresenta três grandes melhorias em relação ao seu antecessor, <a href="https://zilliz.com/blog/why-deepseek-v3-is-taking-the-ai-world-by-storm">o DeepSeek v3</a>:</p>
<ul>
<li><p><strong>Modelo maior, mais potência:</strong> A contagem de parâmetros aumentou de 671 bilhões para 685 bilhões, permitindo que o modelo lide com raciocínios mais complexos e gere respostas com mais nuances.</p></li>
<li><p><strong>Uma janela de contexto enorme:</strong> Com um comprimento de contexto de token de 128K atualizado, o DeepSeek v3-0324 pode reter e processar significativamente mais informações em uma única consulta, tornando-o ideal para conversas longas, análise de documentos e aplicativos de IA baseados em recuperação.</p></li>
<li><p><strong>Raciocínio, codificação e matemática aprimorados:</strong> Esta atualização traz um aumento notável nas capacidades lógicas, de programação e matemáticas, tornando-o um forte concorrente para a codificação assistida por IA, investigação científica e resolução de problemas de nível empresarial.</p></li>
</ul>
<p>Mas os números brutos não contam a história toda. O que é realmente impressionante é como o DeepSeek conseguiu melhorar simultaneamente a capacidade de raciocínio e a eficiência de geração - algo que normalmente envolve compensações de engenharia.</p>
<h3 id="The-Secret-Sauce-Architectural-Innovation" class="common-anchor-header">O molho secreto: Inovação na arquitetura</h3><p>Por baixo do capô, o DeepSeek v3-0324 mantém sua arquitetura <a href="https://arxiv.org/abs/2502.07864">MLA (Multi-head Latent Attention) </a>- um mecanismo eficiente que comprime caches KV (Key-Value) usando vetores latentes para reduzir o uso de memória e a sobrecarga computacional durante a inferência. Além disso, substitui as tradicionais <a href="https://zilliz.com/glossary/feedforward-neural-networks-(fnn)">redes feed-forward (FFN)</a> por camadas de mistura de especialistas<a href="https://zilliz.com/learn/what-is-mixture-of-experts">(MoE</a>), optimizando a eficiência da computação ao ativar dinamicamente os especialistas com melhor desempenho para cada token.</p>
<p>No entanto, a atualização mais interessante é a <strong>previsão multi-token (MTP),</strong> que permite que cada token preveja vários tokens futuros simultaneamente. Isto ultrapassa um estrangulamento significativo nos modelos autoregressivos tradicionais, melhorando a precisão e a velocidade de inferência.</p>
<p>Em conjunto, estas inovações criam um modelo que não se limita a ser bem dimensionado - é dimensionado de forma inteligente, colocando as capacidades de IA de nível profissional ao alcance de mais equipas de desenvolvimento.</p>
<h2 id="Build-a-RAG-System-with-Milvus-and-DeepSeek-v3-0324-in-5-Minutes" class="common-anchor-header">Crie um sistema RAG com Milvus e DeepSeek v3-0324 em 5 minutos<button data-href="#Build-a-RAG-System-with-Milvus-and-DeepSeek-v3-0324-in-5-Minutes" class="anchor-icon" translate="no">
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
    </button></h2><p>Os poderosos recursos de raciocínio do DeepSeek v3-0324 o tornam um candidato ideal para sistemas Retrieval-Augmented Generation (RAG). Neste tutorial, mostraremos como criar um pipeline RAG completo usando o DeepSeek v3-0324 e o banco de dados de vetores <a href="https://zilliz.com/what-is-milvus">Milvus</a> em apenas cinco minutos. Você aprenderá como recuperar e sintetizar o conhecimento de forma eficiente com uma configuração mínima.</p>
<h3 id="Setting-Up-Your-Environment" class="common-anchor-header">Configurando seu ambiente</h3><p>Primeiro, vamos instalar as dependências necessárias:</p>
<pre><code translate="no">! pip install --upgrade pymilvus[model] openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p><strong>Nota:</strong> se estiver a utilizar o Google Colab, terá de reiniciar o tempo de execução depois de instalar estes pacotes. Clique no menu "Runtime" (Tempo de execução) na parte superior da tela e selecione "Restart session" (Reiniciar sessão) no menu suspenso.</p>
<p>Como o DeepSeek fornece uma API compatível com OpenAI, você precisará de uma chave de API. Você pode obter uma inscrevendo-se na<a href="https://platform.deepseek.com/api_keys"> plataforma DeepSeek</a>:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os

os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>] = <span class="hljs-string">&quot;***********&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-Your-Data" class="common-anchor-header">Preparando seus dados</h3><p>Para este tutorial, usaremos as páginas de FAQ da <a href="https://github.com/milvus-io/milvus-docs/releases/download/v2.4.6-preview/milvus_docs_2.4.x_en.zip">Documentação do Milvus 2.4.x</a> como nossa fonte de conhecimento:</p>
<pre><code translate="no">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>Agora, vamos carregar e preparar o conteúdo da FAQ a partir dos arquivos markdown:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

<span class="hljs-comment"># Load all markdown files from the FAQ directory</span>
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
        <span class="hljs-comment"># Split on headings to separate content sections</span>
        text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Setting-Up-the-Language-and-Embedding-Models" class="common-anchor-header">Configurando a linguagem e incorporando modelos</h3><p>Usaremos o <a href="https://openrouter.ai/">OpenRouter</a> para acessar o DeepSeek v3-0324. O OpenRouter fornece uma API unificada para vários modelos de IA, como o DeepSeek e o Claude. Ao criar uma chave de API gratuita do DeepSeek V3 no OpenRouter, você pode facilmente experimentar o DeepSeek V3 0324.</p>
<p>https://assets.zilliz.com/Setting_Up_the_Language_and_Embedding_Models_8b00595a6b.png</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>

deepseek_client = <span class="hljs-title class_">OpenAI</span>(
   api_key=<span class="hljs-string">&quot;&lt;OPENROUTER_API_KEY&gt;&quot;</span>,
   base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Para a incorporação de texto, usaremos o <a href="https://milvus.io/docs/embeddings.md">modelo de incorporação incorporado</a> do Milvus, que é leve e eficaz:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model

<span class="hljs-comment"># Initialize the embedding model</span>
embedding_model = milvus_model.DefaultEmbeddingFunction()

<span class="hljs-comment"># Test the embedding model</span>
test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Embedding dimension: <span class="hljs-subst">{embedding_dim}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;First 10 values: <span class="hljs-subst">{test_embedding[:<span class="hljs-number">10</span>]}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Creating-a-Milvus-Collection" class="common-anchor-header">Criando uma coleção Milvus</h3><p>Agora vamos configurar a nossa base de dados de vectores utilizando o Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Initialize Milvus client (using Milvus Lite for simplicity)</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>

<span class="hljs-comment"># Remove existing collection if it exists</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)

<span class="hljs-comment"># Create a new collection</span>
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># See https://milvus.io/docs/consistency.md for details</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Dica profissional</strong>: Para diferentes cenários de implementação, pode ajustar a configuração do Milvus:</p>
<ul>
<li><p>Para desenvolvimento local: Use <code translate="no">uri=&quot;./milvus.db&quot;</code> com <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a></p></li>
<li><p>Para conjuntos de dados maiores: Configure um servidor Milvus via <a href="https://milvus.io/docs/quickstart.md">Docker/Kubernetes</a> e use <code translate="no">uri=&quot;http://localhost:19530&quot;</code></p></li>
<li><p>Para produção: Use<a href="https://zilliz.com/cloud"> o Zilliz Cloud</a> com o seu ponto de extremidade de nuvem e chave de API.</p></li>
</ul>
<h3 id="Loading-Data-into-Milvus" class="common-anchor-header">Carregando dados no Milvus</h3><p>Vamos converter nossos dados de texto em embeddings e armazená-los no Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

<span class="hljs-comment"># Create embeddings for all text chunks</span>
data = []
doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-comment"># Create records with IDs, vectors, and text</span>
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

<span class="hljs-comment"># Insert data into Milvus</span>
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">Creating embeddings:   0%|          | 0/72 [00:00&lt;?, ?it/s]huggingface/tokenizers: The current process just got forked, after parallelism has already been used. Disabling parallelism to avoid deadlocks...
To <span class="hljs-built_in">disable</span> this warning, you can either:
    - Avoid using `tokenizers` before the fork <span class="hljs-keyword">if</span> possible
    - Explicitly <span class="hljs-built_in">set</span> the environment variable TOKENIZERS_PARALLELISM=(<span class="hljs-literal">true</span> | <span class="hljs-literal">false</span>)
Creating embeddings: 100%|██████████| 72/72 [00:00&lt;00:00, 246522.36it/s]





{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-the-RAG-Pipeline" class="common-anchor-header">Construir o Pipeline RAG</h3><h4 id="Step-1-Retrieve-Relevant-Information" class="common-anchor-header">Passo 1: Recuperar informações relevantes</h4><p>Vamos testar o nosso sistema RAG com uma pergunta comum:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>

<span class="hljs-comment"># Search for relevant information</span>
search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries([question]),  <span class="hljs-comment"># Convert question to embedding</span>
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)

<span class="hljs-comment"># Examine search results</span>
<span class="hljs-keyword">import</span> json
retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572665572166443</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312146186828613</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115777492523193</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-2-Generate-a-Response-with-DeepSeek" class="common-anchor-header">Etapa 2: Gerar uma resposta com o DeepSeek</h4><p>Agora vamos usar o DeepSeek para gerar uma resposta com base nas informações recuperadas:</p>
<pre><code translate="no"><span class="hljs-comment"># Combine retrieved text chunks</span>
context = <span class="hljs-string">&quot;\n&quot;</span>.join(
    [line_with_distance[<span class="hljs-number">0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)

<span class="hljs-comment"># Define prompts for the language model</span>
SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
&quot;&quot;&quot;</span>

USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.

&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;

&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>

<span class="hljs-comment"># Generate response with DeepSeek</span>
response = deepseek_client.chat.completions.create(
    model=<span class="hljs-string">&quot;deepseek-chat&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)

<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">In Milvus, data <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> two main categories: inserted data <span class="hljs-keyword">and</span> metadata.

<span class="hljs-number">1.</span> **Inserted Data**: This includes vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema. The inserted data <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> incremental logs. Milvus supports various <span class="hljs-built_in">object</span> storage backends <span class="hljs-keyword">for</span> <span class="hljs-keyword">this</span> purpose, such <span class="hljs-keyword">as</span> MinIO, AWS S3, <span class="hljs-function">Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>), Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>).

2. **Metadata**: Metadata <span class="hljs-keyword">is</span> generated within Milvus <span class="hljs-keyword">and</span> <span class="hljs-keyword">is</span> specific to each Milvus module. This metadata <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> etcd, a distributed key-<span class="hljs-keyword">value</span> store.

Additionally, <span class="hljs-keyword">when</span> data <span class="hljs-keyword">is</span> inserted, it <span class="hljs-keyword">is</span> first loaded <span class="hljs-keyword">into</span> a message queue, <span class="hljs-keyword">and</span> Milvus returns success at <span class="hljs-keyword">this</span> stage. The data <span class="hljs-keyword">is</span> then written to persistent storage <span class="hljs-keyword">as</span> incremental logs <span class="hljs-keyword">by</span> the data node. If the `<span class="hljs-title">flush</span>()` function <span class="hljs-keyword">is</span> called, the data node <span class="hljs-keyword">is</span> forced to write all data <span class="hljs-keyword">in</span> the message queue to persistent storage immediately.
</span><button class="copy-code-btn"></button></code></pre>
<p>E aí está! Você construiu com sucesso um pipeline RAG completo com o DeepSeek v3-0324 e o Milvus. Esse sistema agora pode responder a perguntas com base na documentação do Milvus com alta precisão e consciência contextual.</p>
<h2 id="Comparing-DeepSeek-V3-0324-Original-vs-RAG-Enhanced-Version" class="common-anchor-header">Comparando o DeepSeek-V3-0324: Versão original vs. versão aprimorada por RAG<button data-href="#Comparing-DeepSeek-V3-0324-Original-vs-RAG-Enhanced-Version" class="anchor-icon" translate="no">
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
    </button></h2><p>A teoria é uma coisa, mas o desempenho no mundo real é o que importa. Testamos o DeepSeek v3-0324 padrão (com o "Deep Thinking" desativado) e nossa versão aprimorada pelo RAG com o mesmo prompt: <em>Escreva código HTML para criar um site sofisticado sobre Milvus.</em></p>
<h3 id="Website-Built-with-The-Standard-Models-Output-Code" class="common-anchor-header">Website construído com o código de saída do modelo padrão</h3><p>Aqui está o aspeto do sítio Web:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Website_Built_with_The_Standard_Model_s_Output_Code_695902b18a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Apesar de visualmente apelativo, o conteúdo baseia-se muito em descrições genéricas e não inclui muitas das principais caraterísticas técnicas do Milvus.</p>
<h3 id="Website-Built-with-Code-Generated-by-the-RAG-Enhanced-Version" class="common-anchor-header">Sítio Web construído com o código gerado pela versão melhorada do RAG</h3><p>Quando integrámos o Milvus como base de conhecimento, os resultados foram dramaticamente diferentes:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Website_2_01341c647c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O último site não tem apenas melhor aparência - ele demonstra uma compreensão genuína da arquitetura, casos de uso e vantagens técnicas do Milvus.</p>
<h2 id="Can-DeepSeek-v3-0324-Replace-Dedicated-Reasoning-Models" class="common-anchor-header">O DeepSeek v3-0324 pode substituir modelos de raciocínio dedicados?<button data-href="#Can-DeepSeek-v3-0324-Replace-Dedicated-Reasoning-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>Nossa descoberta mais surpreendente veio ao comparar o DeepSeek v3-0324 com modelos de raciocínio especializados como o Claude 3.7 Sonnet e o GPT-4 Turbo em tarefas de raciocínio matemático, lógico e de código.</p>
<p>Embora os modelos de raciocínio dedicados sejam excelentes na solução de problemas em várias etapas, eles geralmente fazem isso à custa da eficiência. Nossos benchmarks mostraram que os modelos de raciocínio pesado frequentemente analisam demais prompts simples, gerando 2-3x mais tokens do que o necessário e aumentando significativamente a latência e os custos da API.</p>
<p>O DeepSeek v3-0324 adota uma abordagem diferente. Ele demonstra uma consistência lógica comparável, mas com uma concisão notavelmente maior - muitas vezes produzindo soluções corretas com 40-60% menos tokens. Essa eficiência não vem às custas da precisão; em nossos testes de geração de código, as soluções do DeepSeek corresponderam ou excederam a funcionalidade das soluções dos concorrentes focados em raciocínio.</p>
<p>Para os desenvolvedores que equilibram o desempenho com restrições de orçamento, essa vantagem de eficiência se traduz diretamente em custos de API mais baixos e tempos de resposta mais rápidos - fatores cruciais para aplicativos de produção em que a experiência do usuário depende da velocidade percebida.</p>
<h2 id="The-Future-of-AI-Models-Blurring-the-Reasoning-Divide" class="common-anchor-header">O futuro dos modelos de IA: Desfocando a divisão de raciocínio<button data-href="#The-Future-of-AI-Models-Blurring-the-Reasoning-Divide" class="anchor-icon" translate="no">
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
    </button></h2><p>O desempenho do DeepSeek v3-0324 desafia uma suposição central no setor de IA: que o raciocínio e a eficiência representam uma troca inevitável. Isso sugere que podemos estar nos aproximando de um ponto de inflexão em que a distinção entre modelos de raciocínio e não raciocínio começa a se confundir.</p>
<p>Os principais fornecedores de IA podem acabar por eliminar totalmente esta distinção, desenvolvendo modelos que ajustam dinamicamente a sua profundidade de raciocínio com base na complexidade da tarefa. Este tipo de raciocínio adaptativo optimizaria tanto a eficiência computacional como a qualidade da resposta, revolucionando potencialmente a forma como construímos e implementamos aplicações de IA.</p>
<p>Para os programadores que criam sistemas RAG, esta evolução promete soluções mais rentáveis que proporcionam a profundidade de raciocínio dos modelos de topo sem a sua sobrecarga computacional - expandindo o que é possível com a IA de código aberto.</p>
