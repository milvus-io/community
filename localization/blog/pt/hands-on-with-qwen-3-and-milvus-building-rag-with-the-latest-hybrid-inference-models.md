---
id: >-
  hands-on-with-qwen-3-and-milvus-building-rag-with-the-latest-hybrid-inference-models.md
title: >-
  Utilização prática do Qwen 3 e do Milvus: criar RAG com os modelos de
  inferência híbridos mais recentes
author: Lumina Wang
date: 2025-04-30T00:00:00.000Z
desc: >-
  Partilhe as principais capacidades dos modelos Qwen 3 e guie-o através de um
  processo de emparelhamento do Qwen 3 com o Milvus para construir um sistema
  local de geração aumentada de recuperação (RAG) consciente dos custos.
cover: assets.zilliz.com/build_RAG_with_qwen_3_and_milvus_64b9f2ad4d.jpeg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, Qwen 3, MOE, dense models'
meta_title: >
  Hands-on with Qwen 3 and Milvus: Building RAG with the Latest Hybrid Inference
  Models
origin: >-
  https://milvus.io/blog/hands-on-with-qwen-3-and-milvus-building-rag-with-the-latest-hybrid-inference-models.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_RAG_with_qwen_3_and_milvus_64b9f2ad4d.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Como programador que procura constantemente ferramentas práticas de IA, não pude ignorar o burburinho em torno do mais recente lançamento da Alibaba Cloud: a família de modelos<a href="https://qwenlm.github.io/blog/qwen3/"> Qwen 3</a>, uma linha robusta de oito modelos de inferência híbrida concebidos para redefinir o equilíbrio entre inteligência e eficiência. Em apenas 12 horas, o projeto ganhou <strong>mais de 17.000 estrelas no GitHub</strong> e atingiu um pico de <strong>23.000 downloads</strong> por hora no Hugging Face.</p>
<p>Então, o que é que está diferente desta vez? Em suma, os modelos Qwen 3 combinam raciocínio (respostas lentas e ponderadas) e não raciocínio (respostas rápidas e eficientes) numa única arquitetura, incluem diversas opções de modelos, formação e desempenho melhorados e oferecem mais funcionalidades prontas para a empresa.</p>
<p>Neste post, vou resumir as principais capacidades dos modelos Qwen 3 a que deve prestar atenção e guiá-lo através de um processo de emparelhamento do Qwen 3 com o Milvus para construir um sistema local de geração aumentada de recuperação (RAG) consciente dos custos - completo com código prático e dicas para otimizar o desempenho versus latência.</p>
<p>Vamos mergulhar.</p>
<h2 id="Whats-Exciting-About-Qwen-3" class="common-anchor-header">O que há de excitante no Qwen 3?<button data-href="#Whats-Exciting-About-Qwen-3" class="anchor-icon" translate="no">
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
    </button></h2><p>Depois de testar e investigar o Qwen 3, fica claro que não se trata apenas de números maiores numa folha de especificações. É sobre como as escolhas de design do modelo realmente ajudam os desenvolvedores a criar melhores aplicativos GenAI - mais rápido, mais inteligente e com mais controle. Aqui está o que se destaca.</p>
<h3 id="1-Hybrid-Thinking-Modes-Smart-When-You-Need-Them-Speed-When-You-Don’t" class="common-anchor-header">1. Modos de pensamento híbridos: Inteligente quando é necessário, rápido quando não é necessário</h3><p>Uma das caraterísticas mais inovadoras do Qwen 3 é sua <strong>arquitetura de inferência híbrida</strong>. Ela oferece um controle refinado sobre a quantidade de "pensamento" que o modelo faz em cada tarefa. Afinal, nem todas as tarefas precisam de raciocínio complicado.</p>
<ul>
<li><p>Para problemas complexos que requerem uma análise profunda, pode utilizar todo o poder de raciocínio, mesmo que seja mais lento.</p></li>
<li><p>Para consultas simples do dia a dia, pode mudar para um modo mais rápido e leve.</p></li>
<li><p>Pode até definir um <strong>"orçamento de raciocínio</strong> " - limitando a quantidade de computação ou tokens que uma sessão consome.</p></li>
</ul>
<p>Esta não é apenas uma funcionalidade de laboratório. Aborda diretamente o compromisso diário dos programadores: fornecer respostas de alta qualidade sem aumentar os custos de infraestrutura ou a latência do utilizador.</p>
<h3 id="2-A-Versatile-Lineup-MoE-and-Dense-Models-for-Different-Needs" class="common-anchor-header">2. Uma linha versátil: Modelos MoE e Densos para Diferentes Necessidades</h3><p>O Qwen 3 oferece uma ampla gama de modelos projetados para atender a diferentes necessidades operacionais:</p>
<ul>
<li><p><strong>Dois modelos MoE (Mixture of Experts)</strong>:</p>
<ul>
<li><p><strong>Qwen3-235B-A22B</strong>: 235 bilhões de parâmetros totais, 22 bilhões ativos por consulta</p></li>
<li><p><strong>Qwen3-30B-A3B</strong>: 30 mil milhões no total, 3 mil milhões activos</p></li>
</ul></li>
<li><p><strong>Seis modelos densos</strong>: variando de um ágil 0.6B a um robusto 32B de parâmetros</p></li>
</ul>
<p><em>Breve enquadramento técnico: Os modelos densos (como o GPT-3 ou o BERT) activam sempre todos os parâmetros, o que os torna mais pesados, mas por vezes mais previsíveis.</em> <a href="https://zilliz.com/learn/what-is-mixture-of-experts"><em>Os modelos MoE</em></a> <em>activam apenas uma fração da rede de cada vez, o que os torna muito mais eficientes à escala.</em></p>
<p>Na prática, essa linha versátil de modelos significa que você pode:</p>
<ul>
<li><p>Usar modelos densos para cargas de trabalho apertadas e previsíveis (como dispositivos incorporados)</p></li>
<li><p>Utilizar modelos MoE quando necessita de capacidades pesadas sem aumentar a sua fatura na nuvem</p></li>
</ul>
<p>Com esta gama, pode personalizar a sua implementação - desde configurações leves e prontas para o edge até implementações poderosas à escala da nuvem - sem ficar preso a um único tipo de modelo.</p>
<h3 id="3-Focused-on-Efficiency-and-Real-World-Deployment" class="common-anchor-header">3. Focado na eficiência e na implantação no mundo real</h3><p>Em vez de se concentrar apenas no tamanho do modelo de escala, o Qwen 3 se concentra na eficiência do treinamento e na praticidade da implantação:</p>
<ul>
<li><p><strong>Treinado em 36 trilhões de tokens</strong> - o dobro do que o Qwen 2.5 usou</p></li>
<li><p><strong>Expandido para 235B parâmetros</strong> - mas gerido de forma inteligente através de técnicas MoE, equilibrando a capacidade com as exigências de recursos.</p></li>
<li><p><strong>Optimizado para implementação</strong> - a quantização dinâmica (de FP4 para INT8) permite-lhe executar até o maior modelo Qwen 3 numa infraestrutura modesta - por exemplo, implementação em quatro GPUs H20.</p></li>
</ul>
<p>O objetivo aqui é claro: proporcionar um desempenho superior sem exigir um investimento desproporcionado em infra-estruturas.</p>
<h3 id="4-Built-for-Real-Integration-MCP-Support-and-Multilingual-Capabilities" class="common-anchor-header">4. Construído para integração real: Suporte MCP e Capacidades Multilingues</h3><p>O Qwen 3 foi projetado tendo em mente a integração, não apenas o desempenho isolado do modelo:</p>
<ul>
<li><p><strong>A compatibilidade com MCP (Model Context Protocol)</strong> permite uma integração perfeita com bancos de dados externos, APIs e ferramentas, reduzindo a sobrecarga de engenharia para aplicações complexas.</p></li>
<li><p><strong>O Qwen-Agent</strong> melhora a chamada de ferramentas e a orquestração do fluxo de trabalho, apoiando a construção de sistemas de IA mais dinâmicos e acionáveis.</p></li>
<li><p>O<strong>suporte multilíngue em 119 idiomas e dialetos</strong> torna o Qwen 3 uma forte escolha para aplicativos que visam mercados globais e multilíngues.</p></li>
</ul>
<p>Esses recursos coletivamente tornam mais fácil para os desenvolvedores construir sistemas de nível de produção sem a necessidade de engenharia personalizada extensa em torno do modelo.</p>
<h2 id="Qwen-3-Now-Supported-in-DeepSearcher" class="common-anchor-header">Qwen 3 agora é suportado no DeepSearcher<button data-href="#Qwen-3-Now-Supported-in-DeepSearcher" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a> é um projeto de código aberto para recuperação profunda e geração de relatórios, projetado como uma alternativa local ao Deep Research da OpenAI. Ele ajuda os desenvolvedores a criar sistemas que apresentam informações de alta qualidade e conscientes do contexto de fontes de dados privadas ou específicas do domínio.</p>
<p>O DeepSearcher agora suporta a arquitetura de inferência híbrida do Qwen 3, permitindo que os desenvolvedores alternem o raciocínio dinamicamente - aplicando inferência mais profunda apenas quando agrega valor e ignorando-a quando a velocidade é mais importante.</p>
<p>Por baixo do capô, o DeepSearcher integra-se com o<a href="https://milvus.io"> Milvus</a>, um banco de dados vetorial de alto desempenho desenvolvido por engenheiros da Zilliz, para fornecer pesquisa semântica rápida e precisa sobre dados locais. Combinado com a flexibilidade do modelo, ele oferece aos desenvolvedores maior controle sobre o comportamento do sistema, o custo e a experiência do usuário.</p>
<h2 id="Hands-on-Tutorial-Building-a-RAG-System-with-Qwen-3-and-Milvus" class="common-anchor-header">Tutorial prático: Construindo um sistema RAG com Qwen 3 e Milvus<button data-href="#Hands-on-Tutorial-Building-a-RAG-System-with-Qwen-3-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Vamos colocar estes modelos Qwen 3 para trabalhar construindo um sistema RAG usando o banco de dados vetorial Milvus.</p>
<h3 id="Set-up-the-environment" class="common-anchor-header">Configure o ambiente.</h3><pre><code translate="no"><span class="hljs-comment"># Install required packages</span>
pip install --upgrade pymilvus openai requests tqdm
<span class="hljs-comment"># Set up API key</span>
<span class="hljs-keyword">import</span> os
os.environ[<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>] = <span class="hljs-string">&quot;YOUR_DASHSCOPE_API_KEY&quot;</span> <span class="hljs-comment"># Get this from Alibaba Cloud DashScope</span>
<button class="copy-code-btn"></button></code></pre>
<p>Nota: É necessário obter a chave API da Alibaba Cloud.</p>
<h3 id="Data-Preparation" class="common-anchor-header">Preparação de dados</h3><p>Usaremos as páginas de documentação do Milvus como nossa principal base de conhecimento.</p>
<pre><code translate="no"><span class="hljs-comment"># Download and extract Milvus documentation</span>
!wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
!unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs

<span class="hljs-comment"># Load and parse the markdown files</span>
<span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
        text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Setting-Up-Models" class="common-anchor-header">Configuração de modelos</h3><p>Usaremos a API compatível com OpenAI do DashScope para acessar o Qwen 3:</p>
<pre><code translate="no"><span class="hljs-comment"># Set up OpenAI client to access Qwen 3</span>
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

openai_client = OpenAI(
    base_url=<span class="hljs-string">&quot;https://dashscope.aliyuncs.com/compatible-mode/v1&quot;</span>,
    api_key=os.getenv(<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>)
)

<span class="hljs-comment"># Set up embedding model</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model
embedding_model = milvus_model.DefaultEmbeddingFunction()
<button class="copy-code-btn"></button></code></pre>
<p>Vamos gerar uma incorporação de teste e imprimir suas dimensões e os primeiros elementos:</p>
<pre><code translate="no">test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embedding[:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>Saída:</p>
<pre><code translate="no">768
[-0.04836066 0.07163023 -0.01130064 -0.03789345 -0.03320649 -0.01318448
 -0.03041712 -0.02269499 -0.02317863 -0.00426028]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Creating-a-Milvus-Collection" class="common-anchor-header">Criando uma coleção Milvus</h3><p>Vamos configurar a nossa base de dados vetorial Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Initialize Milvus client (using local storage for simplicity)</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>

<span class="hljs-comment"># Create a fresh collection</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)

<span class="hljs-comment"># Create a new collection</span>
test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>, <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Sobre as configurações dos parâmetros do MilvusClient:</p>
<ul>
<li><p>Definir o URI para um ficheiro local (por exemplo, <code translate="no">./milvus.db</code>) é o método mais conveniente, uma vez que utiliza automaticamente o Milvus Lite para armazenar todos os dados nesse ficheiro.</p></li>
<li><p>Para dados em grande escala, pode configurar um servidor Milvus mais poderoso no Docker ou Kubernetes. Nesse caso, use o URI do servidor (por exemplo, <code translate="no">http://localhost:19530</code>) como seu URI.</p></li>
<li><p>Se pretender utilizar <a href="https://zilliz.com/cloud">o Zilliz Cloud </a>(o serviço gerido do Milvus), ajuste o URI e o token, que correspondem ao Ponto de extremidade público e à chave da API no Zilliz Cloud.</p></li>
</ul>
<h3 id="Adding-Documents-to-the-Collection" class="common-anchor-header">Adicionar documentos à coleção</h3><p>Agora vamos criar embeddings para os nossos pedaços de texto e adicioná-los ao Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

data = []
doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>Output:</p>
<pre><code translate="no">Creating embeddings: 100%|██████████████████████████████████████████████████| 72/72 [00:00&lt;00:00, 381300.36it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-the-RAG-Query-System" class="common-anchor-header">Construir o sistema de consulta RAG</h3><p>Agora a parte emocionante - vamos configurar o nosso sistema RAG para responder a perguntas.</p>
<p>Vamos especificar uma pergunta comum sobre o Milvus:</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Procurar esta pergunta na coleção e obter os 3 principais resultados semanticamente correspondentes:</p>
<pre><code translate="no">search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries([question]), <span class="hljs-comment"># Convert the question to an embedding vector</span>
    limit=<span class="hljs-number">3</span>, <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}}, <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>], <span class="hljs-comment"># Return the text field</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Vamos ver os resultados da pesquisa para esta consulta:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json
retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<p>Output:</p>
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
<h3 id="Using-the-LLM-to-Build-a-RAG-Response" class="common-anchor-header">Utilizar o LLM para construir uma resposta RAG</h3><p>Converta os documentos recuperados para o formato de cadeia de caracteres:</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>Fornecer prompt do sistema e prompt do utilizador para o modelo de linguagem grande:</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
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
<button class="copy-code-btn"></button></code></pre>
<p>Usar o modelo Qwen mais recente para gerar uma resposta com base no prompt:</p>
<pre><code translate="no">completion = openai_client.chat.completions.create(
    <span class="hljs-comment"># Model list: https://help.aliyun.com/zh/model-studio/getting-started/models</span>
    model=<span class="hljs-string">&quot;qwen-plus-2025-04-28&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
    <span class="hljs-comment"># Control thinking process with enable_thinking parameter (default True for open-source, False for commercial)</span>
    extra_body={<span class="hljs-string">&quot;enable_thinking&quot;</span>: <span class="hljs-literal">False</span>},
)

<span class="hljs-built_in">print</span>(completion.choices[<span class="hljs-number">0</span>].message.content)

<button class="copy-code-btn"></button></code></pre>
<p>Saída:</p>
<pre><code translate="no">In Milvus, data <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> two main categories: **inserted data** <span class="hljs-keyword">and</span> **metadata**.

- **Inserted Data**: <span class="hljs-function">This includes vector <span class="hljs-title">data</span> (<span class="hljs-params">like Binary, Float32, Float16, <span class="hljs-keyword">and</span> BFloat16 types</span>), scalar data, <span class="hljs-keyword">and</span> collection-specific schema. These are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> **incremental logs**. Milvus supports various <span class="hljs-built_in">object</span> storage backends <span class="hljs-keyword">for</span> <span class="hljs-keyword">this</span> purpose, including:

  - [MinIO](<span class="hljs-params">https://min.io/</span>)
  - [AWS S3](<span class="hljs-params">https://aws.amazon.com/s3/?nc1=h_ls</span>)
  - [Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>)](<span class="hljs-params">https://cloud.google.com/storage?hl=en#<span class="hljs-built_in">object</span>-storage-<span class="hljs-keyword">for</span>-companies-of-all-sizes</span>)
  - [Azure Blob Storage](<span class="hljs-params">https://azure.microsoft.com/en-us/products/storage/blobs</span>)
  - [Alibaba Cloud OSS](<span class="hljs-params">https://www.alibabacloud.com/product/<span class="hljs-built_in">object</span>-storage-service</span>)
  - [Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>)](<span class="hljs-params">https://www.tencentcloud.com/products/cos</span>)

- **Metadata**: Metadata generated within Milvus <span class="hljs-keyword">is</span> stored separately. Each Milvus module maintains its own metadata, which <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> [etcd](<span class="hljs-params">https://etcd.io/</span>), a distributed key-<span class="hljs-keyword">value</span> store.
When data <span class="hljs-keyword">is</span> inserted <span class="hljs-keyword">into</span> Milvus, it <span class="hljs-keyword">is</span> first loaded <span class="hljs-keyword">into</span> a message queue. It <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> immediately written to disk. A `<span class="hljs-title">flush</span>()` operation ensures that all data <span class="hljs-keyword">in</span> the queue <span class="hljs-keyword">is</span> written to persistent storage immediately.
</span><button class="copy-code-btn"></button></code></pre>
<h2 id="Comparing-Reasoning-vs-Non-Reasoning-Modes-A-Practical-Test" class="common-anchor-header">Comparação entre os modos de raciocínio e não raciocínio: Um teste prático<button data-href="#Comparing-Reasoning-vs-Non-Reasoning-Modes-A-Practical-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>Executei um teste comparando os dois modos de inferência em um problema de matemática:</p>
<p><strong>Problema:</strong> A pessoa A e a pessoa B começam a correr a partir do mesmo local. A sai primeiro e corre durante 2 horas a 5km/h. B segue-a a 15km/h. Quanto tempo demorará B a alcançá-lo?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/math_problem_0123815455.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> time
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI

os.environ[<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>] = <span class="hljs-string">&quot;sk-****************&quot;</span>
client = OpenAI(
   api_key=os.getenv(<span class="hljs-string">&quot;DASHSCOPE_API_KEY&quot;</span>),
   base_url=<span class="hljs-string">&quot;https://dashscope.aliyuncs.com/compatible-mode/v1&quot;</span>,
)
<span class="hljs-comment">############################################</span>
<span class="hljs-comment"># Think</span>
<span class="hljs-comment"># Record the start time</span>
start_time = time.time()
stream = client.chat.completions.create(
   <span class="hljs-comment"># model lists：https://help.aliyun.com/zh/model-studio/getting-started/models</span>
   model=<span class="hljs-string">&quot;qwen3-235b-a22b&quot;</span>,
   <span class="hljs-comment"># model=&quot;qwen-plus-2025-04-28&quot;,</span>
   messages=[
       {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;You are a helpful assistant.&quot;</span>},
       {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;A and B depart from the same location. A leaves 2 hours earlier at 5 km/h. B follows at 15 km/h. When will B catch up?&quot;</span>},
   ],
   <span class="hljs-comment"># You can control the thinking mode through the enable_thinking parameter</span>
   extra_body={<span class="hljs-string">&quot;enable_thinking&quot;</span>: <span class="hljs-literal">True</span>},
   stream=<span class="hljs-literal">True</span>,
)
answer_content = <span class="hljs-string">&quot;&quot;</span>
<span class="hljs-keyword">for</span> chunk <span class="hljs-keyword">in</span> stream:
   delta = chunk.choices[<span class="hljs-number">0</span>].delta
   <span class="hljs-keyword">if</span> delta.content <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> <span class="hljs-literal">None</span>:
       answer_content += delta.content
      
<span class="hljs-built_in">print</span>(answer_content)

<span class="hljs-comment"># Record the end time and calculate the total runtime</span>
end_time = time.time()
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n\nTotal runtime：<span class="hljs-subst">{end_time - start_time:<span class="hljs-number">.2</span>f}</span>seconds&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Com o modo de raciocínio ativado:</strong></p>
<ul>
<li><p>Tempo de processamento: ~74,83 segundos</p></li>
<li><p>Análise profunda, análise de problemas, vários caminhos de solução</p></li>
<li><p>Saída de markdown de alta qualidade com fórmulas</p></li>
</ul>
<p>(A imagem abaixo é uma captura de ecrã da visualização da resposta markdown do modelo, para conveniência do leitor)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/screenshot_with_reasoning_1_d231b6ad54.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/screenshot_with_reasoning_2_394d3bff9f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Modo sem raciocínio:</strong></p>
<p>No código, só precisa de definir <code translate="no">&quot;enable_thinking&quot;: False</code></p>
<p>Resultados do modo sem raciocínio neste problema:</p>
<ul>
<li>Tempo de processamento: ~74,83 segundos</li>
<li>Análise profunda, análise de problemas, vários caminhos de solução</li>
<li>Saída de markdown de alta qualidade com fórmulas</li>
</ul>
<p>(A imagem abaixo é uma captura de ecrã da visualização da resposta markdown do modelo, para conveniência do leitor)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/screenshot_without_reasoning_e1f6b82e56.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>O Qwen 3 introduz uma arquitetura de modelo flexível que se alinha bem com as necessidades do mundo real do desenvolvimento GenAI. Com uma gama de tamanhos de modelos (incluindo variantes densas e MoE), modos de inferência híbridos, integração MCP e suporte multilingue, dá aos programadores mais opções para ajustar o desempenho, a latência e o custo, dependendo do caso de utilização.</p>
<p>Em vez de enfatizar apenas a escala, o Qwen 3 foca na adaptabilidade. Isso o torna uma escolha prática para a construção de pipelines RAG, <a href="https://zilliz.com/blog/what-exactly-are-ai-agents-why-openai-and-langchain-are-fighting-over-their-definition">agentes de IA</a> e aplicativos de produção que exigem recursos de raciocínio e operação econômica.</p>
<p>Quando emparelhado com infra-estruturas como<a href="https://milvus.io"> Milvus</a> - uma base de dados vetorial de código aberto de alto desempenho - as capacidades do Qwen 3 tornam-se ainda mais úteis, permitindo uma pesquisa rápida e semântica e uma integração suave com sistemas de dados locais. Em conjunto, oferecem uma base sólida para aplicações GenAI inteligentes e reactivas em escala.</p>
