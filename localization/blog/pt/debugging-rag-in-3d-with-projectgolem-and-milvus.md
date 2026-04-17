---
id: debugging-rag-in-3d-with-projectgolem-and-milvus.md
title: >-
  E se você pudesse ver por que o RAG falha? Depuração do RAG em 3D com
  Project_Golem e Milvus
author: Min Yin
date: 2026-02-18T00:00:00.000Z
cover: assets.zilliz.com/Debugging_RAG_in_3_D_f1b45f9a99_5f98979c06.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, RAG'
meta_keywords: 'Project_Golem, milvus, RAG'
meta_title: |
  Debugging RAG in 3D with Project_Golem and Milvus
desc: >-
  Saiba como o Project_Golem e o Milvus tornam os sistemas RAG observáveis
  através da visualização do espaço vetorial, da depuração de erros de
  recuperação e do escalonamento da pesquisa vetorial em tempo real.
origin: 'https://milvus.io/blog/debugging-rag-in-3d-with-projectgolem-and-milvus.md'
---
<p>Quando a recuperação RAG corre mal, normalmente sabe-se que está avariada - os documentos relevantes não aparecem ou aparecem os irrelevantes. Mas descobrir porquê é uma história diferente. Tudo o que tem de fazer é trabalhar com pontuações de semelhança e uma lista simples de resultados. Não há forma de ver como os documentos estão realmente posicionados no espaço vetorial, como os pedaços se relacionam entre si ou onde a sua consulta foi parar relativamente ao conteúdo que deveria ter correspondido. Na prática, isto significa que a depuração do RAG é sobretudo uma tentativa e erro: ajustar a estratégia de fragmentação, trocar o modelo de incorporação, ajustar o top-k e esperar que os resultados melhorem.</p>
<p><a href="https://github.com/CyberMagician/Project_Golem">O Project_Golem</a> é uma ferramenta de código aberto que torna o espaço vetorial visível. Utiliza o UMAP para projetar embeddings de alta dimensão em 3D e o Three.js para os renderizar interactivamente no browser. Em vez de adivinhar porque é que a recuperação falhou, pode ver como os pedaços se agrupam semanticamente, onde é que a sua consulta chega e que documentos foram recuperados - tudo numa única interface visual.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_1_01de566e04.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Isto é fantástico. No entanto, o Project_Golem original foi concebido para pequenas demonstrações, não para sistemas do mundo real. Baseia-se em ficheiros planos, pesquisa de força bruta e reconstruções de conjuntos de dados completos - o que significa que falha rapidamente à medida que os seus dados crescem para além de alguns milhares de documentos.</p>
<p>Para colmatar essa lacuna, integrámos o Project_Golem com o <a href="https://milvus.io/docs/release_notes.md#v268">Milvus</a> (especificamente a versão 2.6.8) como a sua espinha dorsal vetorial. O Milvus é uma base de dados vetorial de alto desempenho de código aberto que lida com a ingestão em tempo real, indexação escalável e recuperação ao nível dos milissegundos, enquanto o Project_Golem se concentra naquilo que faz melhor: tornar visível o comportamento da recuperação vetorial. Juntos, eles transformam a visualização 3D de uma demonstração de brinquedo em uma ferramenta prática de depuração para sistemas RAG de produção.</p>
<p>Neste post, vamos apresentar o Project_Golem e mostrar como o integramos ao Milvus para tornar o comportamento de pesquisa vetorial observável, escalável e pronto para produção.</p>
<h2 id="What-Is-ProjectGolem" class="common-anchor-header">O que é o Project_Golem?<button data-href="#What-Is-ProjectGolem" class="anchor-icon" translate="no">
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
    </button></h2><p>A depuração RAG é difícil por uma razão simples: os espaços vetoriais são altamente dimensionais e os humanos não conseguem vê-los.</p>
<p><a href="https://github.com/CyberMagician/Project_Golem">O Project_Golem</a> é uma ferramenta baseada no browser que lhe permite ver o espaço vetorial em que o seu sistema RAG opera. Pega nos embeddings de alta dimensão que conduzem à recuperação - normalmente 768 ou 1536 dimensões - e projecta-os numa cena 3D interactiva que pode explorar diretamente.</p>
<p>Eis como funciona nos bastidores:</p>
<ul>
<li>Redução da dimensionalidade com UMAP. O Project_Golem utiliza UMAP para comprimir vectores de alta dimensão para três dimensões, preservando as suas distâncias relativas. Os pedaços que são semanticamente semelhantes no espaço original ficam próximos uns dos outros na projeção 3D; os pedaços não relacionados acabam afastados.</li>
<li>Renderização 3D com Three.js. Cada fragmento de documento aparece como um nó em uma cena 3D renderizada no navegador. Pode rodar, fazer zoom e explorar o espaço para ver como os seus documentos se agrupam - quais os tópicos que se agrupam mais, quais os que se sobrepõem e onde estão os limites.</li>
<li>Realce em tempo de consulta. Quando executa uma consulta, a recuperação continua a ocorrer no espaço original de alta dimensão utilizando a semelhança de cosseno. Mas assim que os resultados chegam, os pedaços recuperados iluminam-se na vista 3D. Pode ver imediatamente onde a sua consulta foi parar em relação aos resultados - e, igualmente importante, em relação aos documentos que não foram recuperados.</li>
</ul>
<p>É isto que torna o Project_Golem útil para a depuração. Em vez de olhar para uma lista classificada de resultados e adivinhar porque é que um documento relevante não foi encontrado, pode ver se está num grupo distante (um problema de incorporação), sobreposto com conteúdo irrelevante (um problema de fragmentação) ou mesmo fora do limite de recuperação (um problema de configuração). A vista 3D transforma pontuações de semelhança abstractas em relações espaciais sobre as quais se pode raciocinar.</p>
<h2 id="Why-ProjectGolem-Isnt-Production-Ready" class="common-anchor-header">Porque é que o Project_Golem não está pronto para a produção<button data-href="#Why-ProjectGolem-Isnt-Production-Ready" class="anchor-icon" translate="no">
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
    </button></h2><p>O Project_Golem foi concebido como um protótipo de visualização, e funciona bem para isso. Mas a sua arquitetura faz suposições que se quebram rapidamente em escala - de formas que importam se quiser usá-lo para depuração RAG no mundo real.</p>
<h3 id="Every-Update-Requires-a-Full-Rebuild" class="common-anchor-header">Cada atualização requer uma recompilação completa</h3><p>Esta é a limitação mais fundamental. No projeto original, a adição de novos documentos aciona uma reconstrução completa do pipeline: os embeddings são gerados novamente e gravados em arquivos .npy, o UMAP é executado novamente em todo o conjunto de dados e as coordenadas 3D são reexportadas como JSON.</p>
<p>Mesmo com 100.000 documentos, uma execução do UMAP de núcleo único leva de 5 a 10 minutos. Na escala de milhões de documentos, torna-se totalmente impraticável. Não é possível usar isto para qualquer conjunto de dados que mude continuamente - feeds de notícias, documentação, conversas de utilizadores - porque cada atualização significa esperar por um ciclo completo de reprocessamento.</p>
<h3 id="Brute-Force-Search-Doesnt-Scale" class="common-anchor-header">A pesquisa à força bruta não tem escala</h3><p>O lado da recuperação tem o seu próprio limite. A implementação original usa NumPy para pesquisa de força bruta de similaridade de cosseno - complexidade de tempo linear, sem indexação. Em um conjunto de dados de milhões de documentos, uma única consulta pode levar mais de um segundo. Isto é inutilizável para qualquer sistema interativo ou online.</p>
<p>A pressão da memória agrava o problema. Cada vetor float32 de 768 dimensões ocupa cerca de 3 KB, pelo que um conjunto de dados de um milhão de vectores requer mais de 3 GB de memória - tudo carregado numa matriz NumPy plana sem estrutura de índice para tornar a pesquisa eficiente.</p>
<h3 id="No-Metadata-Filtering-No-Multi-Tenancy" class="common-anchor-header">Sem filtragem de metadados, sem aluguer múltiplo</h3><p>Num sistema RAG real, a semelhança de vectores raramente é o único critério de recuperação. É quase sempre necessário filtrar por metadados, como o tipo de documento, carimbos de data/hora, permissões de utilizador ou limites ao nível da aplicação. Um sistema RAG de apoio ao cliente, por exemplo, precisa de limitar a recuperação aos documentos de um inquilino específico - e não procurar nos dados de todos.</p>
<p>O Project_Golem não suporta nada disto. Não existem índices ANN (como HNSW ou IVF), nem filtragem escalar, nem isolamento de inquilinos, nem pesquisa híbrida. Trata-se de uma camada de visualização sem um motor de recuperação de produção por baixo.</p>
<h2 id="How-Milvus-Powers-ProjectGolem’s-Retrieval-Layer" class="common-anchor-header">Como o Milvus alimenta a camada de recuperação do Project_Golem<button data-href="#How-Milvus-Powers-ProjectGolem’s-Retrieval-Layer" class="anchor-icon" translate="no">
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
    </button></h2><p>A secção anterior identificou três lacunas: reconstruções completas em cada atualização, pesquisa de força bruta e nenhuma recuperação com reconhecimento de metadados. Todas as três resultam da mesma causa principal - o Project_Golem não tem uma camada de base de dados. A recuperação, o armazenamento e a visualização estão interligados num único pipeline, pelo que a alteração de qualquer parte obriga a uma reconstrução de tudo.</p>
<p>A solução não é otimizar esse pipeline. É dividi-lo em partes.</p>
<p>Ao integrar o Milvus 2.6.8 como a espinha dorsal do vetor, a recuperação torna-se uma camada dedicada, de nível de produção, que funciona independentemente da visualização. O Milvus trata do armazenamento vetorial, da indexação e da pesquisa. O Project_Golem concentra-se puramente na renderização - consumindo IDs de documentos do Milvus e destacando-os na vista 3D.</p>
<p>Esta separação produz dois fluxos limpos e independentes:</p>
<p>Fluxo de recuperação (online, ao nível dos milissegundos)</p>
<ul>
<li>A sua consulta é convertida num vetor utilizando os embeddings OpenAI.</li>
<li>O vetor de consulta é enviado para uma coleção Milvus.</li>
<li>O Milvus AUTOINDEX seleciona e optimiza o índice apropriado.</li>
<li>Uma pesquisa de similaridade de cosseno em tempo real retorna os IDs de documentos relevantes.</li>
</ul>
<p>Fluxo de visualização (offline, escala de demonstração)</p>
<ul>
<li>O UMAP gera coordenadas 3D durante a ingestão de dados (n_neighbors=30, min_dist=0.1).</li>
<li>As coordenadas são armazenadas em golem_cortex.json.</li>
<li>O frontend destaca os nós 3D correspondentes utilizando os IDs de documentos devolvidos pelo Milvus.</li>
</ul>
<p>O ponto crítico: a recuperação já não espera pela visualização. É possível ingerir novos documentos e pesquisá-los imediatamente - a visualização em 3D é actualizada de acordo com o seu próprio calendário.</p>
<h3 id="What-Streaming-Nodes-Change" class="common-anchor-header">O que os nós de streaming mudam</h3><p>Esta ingestão em tempo real é alimentada por uma nova capacidade no Milvus 2.6.8: <a href="https://milvus.io/docs/configure_streamingnode.md#streamingNode-related-Configurations">Streaming Nodes</a>. Nas versões anteriores, a ingestão em tempo real exigia uma fila de mensagens externa como Kafka ou Pulsar. Os Streaming Nodes transferem essa coordenação para o próprio Milvus - novos vectores são ingeridos continuamente, os índices são actualizados de forma incremental e os documentos recém-adicionados tornam-se imediatamente pesquisáveis, sem reconstrução completa e sem dependências externas.</p>
<p>Para o Project_Golem, é isto que torna a arquitetura prática. Pode continuar a adicionar documentos ao seu sistema RAG - novos artigos, documentos actualizados, conteúdo gerado pelo utilizador - e a recuperação mantém-se actualizada sem desencadear o dispendioso ciclo UMAP → JSON → recarregar.</p>
<h3 id="Extending-Visualization-to-Million-Scale-Future-Path" class="common-anchor-header">Extensão da visualização para a escala de milhões (caminho futuro)</h3><p>Com esta configuração apoiada pelo Milvus, o Project_Golem suporta atualmente demonstrações interactivas de cerca de 10.000 documentos. A recuperação é muito maior do que isso - Milvus lida com milhões - mas o pipeline de visualização ainda depende de execuções UMAP em lote. Para colmatar essa lacuna, a arquitetura pode ser alargada com um pipeline de visualização incremental:</p>
<ul>
<li><p>Accionadores de atualização: O sistema fica à escuta de eventos de inserção na coleção Milvus. Quando os documentos recentemente adicionados atingem um limite definido (por exemplo, 1000 itens), é desencadeada uma atualização incremental.</p></li>
<li><p>Projeção incremental: Em vez de voltar a executar o UMAP em todo o conjunto de dados, os novos vectores são projectados no espaço 3D existente utilizando o método transform() do UMAP. Isto preserva a estrutura global enquanto reduz drasticamente o custo de computação.</p></li>
<li><p>Sincronização de front-end: Os fragmentos de coordenadas actualizados são transmitidos para o frontend via WebSocket, permitindo que novos nós apareçam dinamicamente sem recarregar toda a cena.</p></li>
</ul>
<p>Para além da escalabilidade, o Milvus 2.6.8 permite a pesquisa híbrida, combinando a semelhança vetorial com a pesquisa de texto completo e a filtragem escalar. Isto abre a porta a interações 3D mais ricas - tais como realce de palavras-chave, filtragem de categorias e cortes baseados no tempo - dando aos programadores formas mais poderosas de explorar, depurar e raciocinar sobre o comportamento RAG.</p>
<h2 id="How-to-Deploy-and-Explore-ProjectGolem-with-Milvus" class="common-anchor-header">Como implantar e explorar o Project_Golem com o Milvus<button data-href="#How-to-Deploy-and-Explore-ProjectGolem-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>O Project_Golem atualizado agora é de código aberto no <a href="https://github.com/yinmin2020/Project_Golem_Milvus">GitHub</a>. Usando a documentação oficial do Milvus como nosso conjunto de dados, percorremos todo o processo de visualização da recuperação de RAG em 3D. A configuração usa Docker e Python e é fácil de seguir, mesmo se você estiver começando do zero.</p>
<h3 id="Prerequisites" class="common-anchor-header">Pré-requisitos</h3><ul>
<li>Docker ≥ 20.10</li>
<li>Docker Compose ≥ 2.0</li>
<li>Python ≥ 3.11</li>
<li>Uma chave da API da OpenAI</li>
<li>Um conjunto de dados (documentação do Milvus em formato Markdown)</li>
</ul>
<h3 id="1-Deploy-Milvus" class="common-anchor-header">1. Implementar o Milvus</h3><pre><code translate="no">Download docker-compose.yml
wget https://github.com/milvus-io/milvus/releases/download/v2.6.8/milvus-standalone-docker-compose.yml -O docker-compose.yml
Start Milvus（verify port mapping：19530:19530）
docker-compose up -d
Verify that the services are running
docker ps | grep milvus
You should see three containers：milvus-standalone, milvus-etcd, milvus-minio
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Core-Implementation" class="common-anchor-header">2. Implementação principal</h3><p>Integração do Milvus (ingest.py)</p>
<p>Nota: A implementação suporta até oito categorias de documentos. Se o número de categorias exceder este limite, as cores são reutilizadas de forma round-robin.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> pymilvus.milvus_client.index <span class="hljs-keyword">import</span> IndexParams
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> langchain_text_splitters <span class="hljs-keyword">import</span> RecursiveCharacterTextSplitter
<span class="hljs-keyword">import</span> umap
<span class="hljs-keyword">from</span> sklearn.neighbors <span class="hljs-keyword">import</span> NearestNeighbors
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> glob
--- CONFIG ---
MILVUS_URI = <span class="hljs-string">&quot;http://localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;golem_memories&quot;</span>
JSON_OUTPUT_PATH = <span class="hljs-string">&quot;./golem_cortex.json&quot;</span>
Data directory (users place .md files <span class="hljs-keyword">in</span> this folder)
DATA_DIR = <span class="hljs-string">&quot;./data&quot;</span>
OpenAI Embedding Config
OPENAI_API_KEY = os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)
OPENAI_BASE_URL = <span class="hljs-string">&quot;https://api.openai.com/v1&quot;</span>  <span class="hljs-comment">#</span>
OPENAI_EMBEDDING_MODEL = <span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
<span class="hljs-number">1536</span> dimensions
EMBEDDING_DIM = <span class="hljs-number">1536</span>
Color mapping: colors are assigned automatically <span class="hljs-keyword">and</span> reused <span class="hljs-keyword">in</span> a <span class="hljs-built_in">round</span>-robin manner
COLORS = [
[<span class="hljs-number">0.29</span>, <span class="hljs-number">0.87</span>, <span class="hljs-number">0.50</span>],
Green
[<span class="hljs-number">0.22</span>, <span class="hljs-number">0.74</span>, <span class="hljs-number">0.97</span>],
Blue
[<span class="hljs-number">0.60</span>, <span class="hljs-number">0.20</span>, <span class="hljs-number">0.80</span>],
Purple
[<span class="hljs-number">0.94</span>, <span class="hljs-number">0.94</span>, <span class="hljs-number">0.20</span>],
Gold
[<span class="hljs-number">0.98</span>, <span class="hljs-number">0.55</span>, <span class="hljs-number">0.00</span>],
Orange
[<span class="hljs-number">0.90</span>, <span class="hljs-number">0.30</span>, <span class="hljs-number">0.40</span>],
Red
[<span class="hljs-number">0.40</span>, <span class="hljs-number">0.90</span>, <span class="hljs-number">0.90</span>],
Cyan
[<span class="hljs-number">0.95</span>, <span class="hljs-number">0.50</span>, <span class="hljs-number">0.90</span>],
Magenta
]
<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_embeddings</span>(<span class="hljs-params">texts</span>):
<span class="hljs-string">&quot;&quot;&quot;Batch embedding using OpenAI API&quot;&quot;&quot;</span>
client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)
embeddings = []
batch_size = <span class="hljs-number">100</span>
OpenAI allows multiple texts per request
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(texts), batch_size):
batch = texts[i:i + batch_size]
response = client.embeddings.create(
model=OPENAI_EMBEDDING_MODEL,
<span class="hljs-built_in">input</span>=batch
)
embeddings.extend([item.embedding <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> response.data])
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Embedded <span class="hljs-subst">{<span class="hljs-built_in">min</span>(i + batch_size, <span class="hljs-built_in">len</span>(texts))}</span>/<span class="hljs-subst">{<span class="hljs-built_in">len</span>(texts)}</span>...&quot;</span>)
<span class="hljs-keyword">return</span> np.array(embeddings)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_markdown_files</span>(<span class="hljs-params">data_dir</span>):
<span class="hljs-string">&quot;&quot;&quot;Load all markdown files from the data directory&quot;&quot;&quot;</span>
md_files = glob.glob(os.path.join(data_dir, <span class="hljs-string">&quot;**/*.md&quot;</span>), recursive=<span class="hljs-literal">True</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> md_files:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ ERROR: No .md files found in &#x27;<span class="hljs-subst">{data_dir}</span>&#x27;&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   👉 Create a &#x27;<span class="hljs-subst">{data_dir}</span>&#x27; folder and put your markdown files there.&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   👉 Example: <span class="hljs-subst">{data_dir}</span>/doc1.md, <span class="hljs-subst">{data_dir}</span>/docs/doc2.md&quot;</span>)
<span class="hljs-keyword">return</span> <span class="hljs-literal">None</span>
docs = []
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n📚 FOUND <span class="hljs-subst">{<span class="hljs-built_in">len</span>(md_files)}</span> MARKDOWN FILES:&quot;</span>)
<span class="hljs-keyword">for</span> i, file_path <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(md_files):
filename = os.path.basename(file_path)
Categories are derived <span class="hljs-keyword">from</span> the file’s path relative to data_dir
rel_path = os.path.relpath(file_path, data_dir)
category = os.path.dirname(rel_path) <span class="hljs-keyword">if</span> os.path.dirname(rel_path) <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;default&quot;</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&#x27;r&#x27;</span>, encoding=<span class="hljs-string">&#x27;utf-8&#x27;</span>) <span class="hljs-keyword">as</span> f:
content = f.read()
docs.append({
<span class="hljs-string">&quot;title&quot;</span>: filename,
<span class="hljs-string">&quot;text&quot;</span>: content,
<span class="hljs-string">&quot;cat&quot;</span>: category,
<span class="hljs-string">&quot;path&quot;</span>: file_path
})
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>. [<span class="hljs-subst">{category}</span>] <span class="hljs-subst">{filename}</span>&quot;</span>)
<span class="hljs-keyword">return</span> docs
<span class="hljs-keyword">def</span> <span class="hljs-title function_">ingest_dense</span>():
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;🧠 PROJECT GOLEM - NEURAL MEMORY BUILDER&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;=&quot;</span> * <span class="hljs-number">50</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> OPENAI_API_KEY:
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ❌ ERROR: OPENAI_API_KEY environment variable not set!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Run: export OPENAI_API_KEY=&#x27;your-key-here&#x27;&quot;</span>)
<span class="hljs-keyword">return</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Using OpenAI Embedding: <span class="hljs-subst">{OPENAI_EMBEDDING_MODEL}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Embedding Dimension: <span class="hljs-subst">{EMBEDDING_DIM}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Data Directory: <span class="hljs-subst">{DATA_DIR}</span>&quot;</span>)
<span class="hljs-number">1.</span> Load local markdown files
docs = load_markdown_files(DATA_DIR)
<span class="hljs-keyword">if</span> docs <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
<span class="hljs-keyword">return</span>
<span class="hljs-number">2.</span> Split documents into chunks
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n📦 PROCESSING DOCUMENTS...&quot;</span>)
splitter = RecursiveCharacterTextSplitter(chunk_size=<span class="hljs-number">800</span>, chunk_overlap=<span class="hljs-number">50</span>)
chunks = []
raw_texts = []
colors = []
chunk_titles = []
categories = []
<span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs:
doc_chunks = splitter.create_documents([doc[<span class="hljs-string">&#x27;text&#x27;</span>]])
cat_index = <span class="hljs-built_in">hash</span>(doc[<span class="hljs-string">&#x27;cat&#x27;</span>]) % <span class="hljs-built_in">len</span>(COLORS)
<span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(doc_chunks):
chunks.append({
<span class="hljs-string">&quot;text&quot;</span>: chunk.page_content,
<span class="hljs-string">&quot;title&quot;</span>: doc[<span class="hljs-string">&#x27;title&#x27;</span>],
<span class="hljs-string">&quot;cat&quot;</span>: doc[<span class="hljs-string">&#x27;cat&#x27;</span>]
})
raw_texts.append(chunk.page_content)
colors.append(COLORS[cat_index])
chunk_titles.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{doc[<span class="hljs-string">&#x27;title&#x27;</span>]}</span> (chunk <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>)&quot;</span>)
categories.append(doc[<span class="hljs-string">&#x27;cat&#x27;</span>])
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Created <span class="hljs-subst">{<span class="hljs-built_in">len</span>(chunks)}</span> text chunks from <span class="hljs-subst">{<span class="hljs-built_in">len</span>(docs)}</span> documents&quot;</span>)
<span class="hljs-number">3.</span> Generate embeddings
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n🔮 GENERATING EMBEDDINGS...&quot;</span>)
vectors = get_embeddings(raw_texts)
<span class="hljs-number">4.</span> 3D Projection (UMAP)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n🎨 CALCULATING 3D MANIFOLD...&quot;</span>)
reducer = umap.UMAP(n_components=<span class="hljs-number">3</span>, n_neighbors=<span class="hljs-number">30</span>, min_dist=<span class="hljs-number">0.1</span>, metric=<span class="hljs-string">&#x27;cosine&#x27;</span>)
embeddings_3d = reducer.fit_transform(vectors)
<span class="hljs-number">5.</span> Wiring (KNN)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ↳ Wiring Synapses (finding connections)...&quot;</span>)
nbrs = NearestNeighbors(n_neighbors=<span class="hljs-number">8</span>, metric=<span class="hljs-string">&#x27;cosine&#x27;</span>).fit(vectors)
distances, indices = nbrs.kneighbors(vectors)
<span class="hljs-number">6.</span> Prepare output data
cortex_data = []
milvus_data = []
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(chunks)):
cortex_data.append({
<span class="hljs-string">&quot;id&quot;</span>: i,
<span class="hljs-string">&quot;title&quot;</span>: chunk_titles[i],
<span class="hljs-string">&quot;cat&quot;</span>: categories[i],
<span class="hljs-string">&quot;pos&quot;</span>: embeddings_3d[i].tolist(),
<span class="hljs-string">&quot;col&quot;</span>: colors[i],
<span class="hljs-string">&quot;nbs&quot;</span>: indices[i][<span class="hljs-number">1</span>:].tolist()
})
milvus_data.append({
<span class="hljs-string">&quot;id&quot;</span>: i,
<span class="hljs-string">&quot;text&quot;</span>: chunks[i][<span class="hljs-string">&#x27;text&#x27;</span>],
<span class="hljs-string">&quot;title&quot;</span>: chunk_titles[i],
<span class="hljs-string">&quot;category&quot;</span>: categories[i],
<span class="hljs-string">&quot;vector&quot;</span>: vectors[i].tolist()
})
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(JSON_OUTPUT_PATH, <span class="hljs-string">&#x27;w&#x27;</span>) <span class="hljs-keyword">as</span> f:
json.dump(cortex_data, f)
<span class="hljs-number">7.</span> Store vectors <span class="hljs-keyword">in</span> Milvus
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n💾 STORING IN MILVUS...&quot;</span>)
client = MilvusClient(uri=MILVUS_URI)
Drop existing collection <span class="hljs-keyword">if</span> it exists
<span class="hljs-keyword">if</span> client.has_collection(COLLECTION_NAME):
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Dropping existing collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;...&quot;</span>)
client.drop_collection(COLLECTION_NAME)
Create new collection
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Creating collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; (dim=<span class="hljs-subst">{EMBEDDING_DIM}</span>)...&quot;</span>)
client.create_collection(
collection_name=COLLECTION_NAME,
dimension=EMBEDDING_DIM
)
Insert data
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Inserting <span class="hljs-subst">{<span class="hljs-built_in">len</span>(milvus_data)}</span> vectors...&quot;</span>)
client.insert(
collection_name=COLLECTION_NAME,
data=milvus_data
)
Create index <span class="hljs-keyword">for</span> faster search
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ↳ Creating index...&quot;</span>)
index_params = IndexParams()
index_params.add_index(
field_name=<span class="hljs-string">&quot;vector&quot;</span>,
index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)
client.create_index(
collection_name=COLLECTION_NAME,
index_params=index_params
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n✅ CORTEX GENERATED SUCCESSFULLY!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   📊 <span class="hljs-subst">{<span class="hljs-built_in">len</span>(chunks)}</span> memory nodes stored in Milvus&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   📁 Cortex data saved to: <span class="hljs-subst">{JSON_OUTPUT_PATH}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   🚀 Run &#x27;python GolemServer.py&#x27; to start the server&quot;</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
ingest_dense()
<button class="copy-code-btn"></button></code></pre>
<p>Visualização do frontend (GolemServer.py)</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> flask <span class="hljs-keyword">import</span> Flask, request, jsonify, send_from_directory
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> sys
--- CONFIG ---
Explicitly <span class="hljs-built_in">set</span> the folder to where this script <span class="hljs-keyword">is</span> located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OpenAI Embedding Config
OPENAI_API_KEY = os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)
OPENAI_BASE_URL = <span class="hljs-string">&quot;https://api.openai.com/v1&quot;</span>
OPENAI_EMBEDDING_MODEL = <span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
Milvus Config
MILVUS_URI = <span class="hljs-string">&quot;http://localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;golem_memories&quot;</span>
These <span class="hljs-keyword">match</span> the files generated by ingest.py
JSON_FILE = <span class="hljs-string">&quot;golem_cortex.json&quot;</span>
UPDATED: Matches your new repo filename
HTML_FILE = <span class="hljs-string">&quot;index.html&quot;</span>
app = Flask(__name__, static_folder=BASE_DIR)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n🧠 PROJECT GOLEM SERVER&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   📂 Serving from: <span class="hljs-subst">{BASE_DIR}</span>&quot;</span>)
--- DIAGNOSTICS ---
Check <span class="hljs-keyword">if</span> files exist before starting
missing_files = []
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> os.path.exists(os.path.join(BASE_DIR, JSON_FILE)):
missing_files.append(JSON_FILE)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> os.path.exists(os.path.join(BASE_DIR, HTML_FILE)):
missing_files.append(HTML_FILE)
<span class="hljs-keyword">if</span> missing_files:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ CRITICAL ERROR: Missing files in this folder:&quot;</span>)
<span class="hljs-keyword">for</span> f <span class="hljs-keyword">in</span> missing_files:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;      - <span class="hljs-subst">{f}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Did you run &#x27;python ingest.py&#x27; successfully?&quot;</span>)
sys.exit(<span class="hljs-number">1</span>)
<span class="hljs-keyword">else</span>:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ✅ Files Verified: Cortex Map found.&quot;</span>)
Check API Key
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> OPENAI_API_KEY:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ CRITICAL ERROR: OPENAI_API_KEY environment variable not set!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Run: export OPENAI_API_KEY=&#x27;your-key-here&#x27;&quot;</span>)
sys.exit(<span class="hljs-number">1</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Using OpenAI Embedding: <span class="hljs-subst">{OPENAI_EMBEDDING_MODEL}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ↳ Connecting to Milvus...&quot;</span>)
milvus_client = MilvusClient(uri=MILVUS_URI)
Verify collection exists
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> milvus_client.has_collection(COLLECTION_NAME):
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ CRITICAL ERROR: Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; not found in Milvus.&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Did you run &#x27;python ingest.py&#x27; successfully?&quot;</span>)
sys.exit(<span class="hljs-number">1</span>)
Initialize OpenAI client
openai_client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)
--- ROUTES ---
<span class="hljs-meta">@app.route(<span class="hljs-params"><span class="hljs-string">&#x27;/&#x27;</span></span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">root</span>():
Force serve the specific HTML file
<span class="hljs-keyword">return</span> send_from_directory(BASE_DIR, HTML_FILE)
<span class="hljs-meta">@app.route(<span class="hljs-params"><span class="hljs-string">&#x27;/&#x27;</span></span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">serve_static</span>(<span class="hljs-params">filename</span>):
<span class="hljs-keyword">return</span> send_from_directory(BASE_DIR, filename)
<span class="hljs-meta">@app.route(<span class="hljs-params"><span class="hljs-string">&#x27;/query&#x27;</span>, methods=[<span class="hljs-string">&#x27;POST&#x27;</span>]</span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">query_brain</span>():
data = request.json
text = data.get(<span class="hljs-string">&#x27;query&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> text: <span class="hljs-keyword">return</span> jsonify({<span class="hljs-string">&quot;indices&quot;</span>: []})
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;🔎 Query: <span class="hljs-subst">{text}</span>&quot;</span>)
Get query embedding <span class="hljs-keyword">from</span> OpenAI
response = openai_client.embeddings.create(
model=OPENAI_EMBEDDING_MODEL,
<span class="hljs-built_in">input</span>=text
)
query_vec = response.data[<span class="hljs-number">0</span>].embedding
Search <span class="hljs-keyword">in</span> Milvus
results = milvus_client.search(
collection_name=COLLECTION_NAME,
data=[query_vec],
limit=<span class="hljs-number">50</span>,
output_fields=[<span class="hljs-string">&quot;id&quot;</span>]
)
Extract indices <span class="hljs-keyword">and</span> scores
indices = [r[<span class="hljs-string">&#x27;id&#x27;</span>] <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]
scores = [r[<span class="hljs-string">&#x27;distance&#x27;</span>] <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]
<span class="hljs-keyword">return</span> jsonify({
<span class="hljs-string">&quot;indices&quot;</span>: indices,
<span class="hljs-string">&quot;scores&quot;</span>: scores
})
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&#x27;__main__&#x27;</span>:
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ✅ SYSTEM ONLINE: http://localhost:8000&quot;</span>)
app.run(port=<span class="hljs-number">8000</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Descarregue o conjunto de dados e coloque-o no diretório especificado</p>
<pre><code translate="no">https://github.com/milvus-io/milvus-docs/tree/v2.6.x/site/en
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_4_3d17b01fec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Start-the-project" class="common-anchor-header">3. Iniciar o projeto</h3><p>Converter texto em espaço 3D</p>
<pre><code translate="no">python ingest.py
<button class="copy-code-btn"></button></code></pre>
<p>[image]</p>
<p>Iniciar o serviço de front-end</p>
<pre><code translate="no">python GolemServer.py
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Visualization-and-Interaction" class="common-anchor-header">4. Visualização e interação</h3><p>Depois de o frontend receber os resultados da recuperação, o brilho do nó é escalado com base nas pontuações de semelhança de cosseno, enquanto as cores originais do nó são preservadas para manter grupos de categorias claras. São desenhadas linhas semi-transparentes do ponto de consulta para cada nó correspondente, e a câmara faz uma panorâmica e um zoom suaves para focar o cluster ativado.</p>
<h4 id="Example-1-In-Domain-Match" class="common-anchor-header">Exemplo 1: Correspondência no domínio</h4><p>Consulta: "Quais os tipos de índice suportados pelo Milvus?"</p>
<p>Comportamento de visualização:</p>
<ul>
<li><p>No espaço 3D, aproximadamente 15 nós dentro do cluster vermelho rotulado INDEXES mostram um aumento notável no brilho (cerca de 2-3×).</p></li>
<li><p>Os nós correspondentes incluem pedaços de documentos como index_types.md, hnsw_index.md e ivf_index.md.</p></li>
<li><p>São apresentadas linhas semi-transparentes do vetor de consulta para cada nó correspondente, e a câmara foca suavemente o cluster vermelho.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_2_c2522b6a67.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="Example-2-Out-of-Domain-Query-Rejection" class="common-anchor-header">Exemplo 2: Rejeição de consulta fora do domínio</h4><p>Consulta: "Quanto custa a refeição económica do KFC?"</p>
<p>Comportamento de visualização:</p>
<ul>
<li><p>Todos os nós mantêm as suas cores originais, com apenas ligeiras alterações de tamanho (menos de 1,1×).</p></li>
<li><p>Os nós correspondentes estão espalhados por vários grupos com cores diferentes, não mostrando uma concentração semântica clara.</p></li>
<li><p>A câmara não desencadeia uma ação de focagem, uma vez que o limiar de semelhança (0,5) não é atingido.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_3_39b9383771.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>O Project_Golem emparelhado com o Milvus não substituirá o seu pipeline de avaliação RAG existente - mas acrescenta algo que falta totalmente à maioria dos pipelines: a capacidade de ver o que está a acontecer dentro do espaço vetorial.</p>
<p>Com esta configuração, é possível distinguir entre uma falha de recuperação causada por uma má incorporação, uma causada por uma má fragmentação e uma causada por um limiar ligeiramente demasiado apertado. Esse tipo de diagnóstico costumava exigir adivinhação e iteração. Agora é possível vê-lo.</p>
<p>A integração atual suporta a depuração interactiva à escala de demonstração (~10.000 documentos), com a base de dados de vectores Milvus a tratar da recuperação de nível de produção nos bastidores. O caminho para a visualização à escala de um milhão está traçado, mas ainda não foi construído - o que faz com que esta seja uma boa altura para participar.</p>
<p>Consulte o <a href="https://github.com/CyberMagician/Project_Golem">Project_Golem</a> no GitHub, experimente-o com o seu próprio conjunto de dados e veja como é o seu espaço vetorial.</p>
<p>Se tiver dúvidas ou quiser partilhar o que encontrar, junte-se ao nosso <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canal Slack</a> ou marque uma sessão <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> para obter orientação prática sobre a sua configuração.</p>
