---
id: will-gemini-embedding-2-kill-multi-vector-search-in-vector-databases.md
title: >-
  A incorporação Gemini 2 vai acabar com a pesquisa multi-vetorial em bases de
  dados vectoriais?
author: Jack Li
date: 2026-3-13
cover: assets.zilliz.com/blog_Gemini_Embedding2_4_62bc980b71.png
tag: Engineering
recommend: false
publishToMedium: true
tags: >-
  multi-vector search, gemini embedding 2, multimodal embeddings,  milvus,
  vector database
meta_keywords: >-
  multi-vector search, gemini embedding 2, multimodal embeddings,  milvus,
  vector database
meta_title: |
  Will Gemini Embedding 2 kill Multi-Vector Search in Vector Databases?
desc: >-
  O Gemini Embedding 2 da Google mapeia texto, imagens, vídeo e áudio num único
  vetor. Isso tornará a pesquisa multi-vetorial obsoleta? Não, e aqui está o
  porquê.
origin: >-
  https://milvus.io/blog/will-gemini-embedding-2-kill-multi-vector-search-in-vector-databases.md
---
<p>A Google lançou <a href="https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-embedding-2/">o Gemini Embedding 2</a> - o primeiro modelo de incorporação multimodal que mapeia texto, imagens, vídeo, áudio e documentos num único espaço vetorial.</p>
<p>Pode incorporar um clip de vídeo, uma fotografia de um produto e um parágrafo de texto com uma chamada à API, e todos eles irão parar à mesma vizinhança semântica.</p>
<p>Antes de modelos como este, era necessário executar cada modalidade através do seu próprio modelo especializado e, em seguida, armazenar cada saída numa coluna vetorial separada. As colunas multi-vectoriais em bases de dados vectoriais como o <a href="https://milvus.io/docs/multi-vector-search.md">Milvus</a> foram criadas precisamente para estes cenários.</p>
<p>Com o Gemini Embedding 2 a mapear várias modalidades ao mesmo tempo, surge uma questão: em que medida pode o Gemini Embedding 2 substituir as colunas multi-vectoriais e em que aspectos fica aquém das expectativas? Este post mostra onde cada abordagem se encaixa e como elas funcionam juntas.</p>
<h2 id="What’s-Different-About-Gemini-Embedding-2-When-Compared-to-CLIPCLAP" class="common-anchor-header">O que há de diferente no Gemini Embedding 2 em relação ao CLIP/CLAP<button data-href="#What’s-Different-About-Gemini-Embedding-2-When-Compared-to-CLIPCLAP" class="anchor-icon" translate="no">
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
    </button></h2><p>Os modelos de incorporação convertem dados não estruturados em vectores densos, de modo a que os itens semanticamente semelhantes se agrupem no espaço vetorial. O que diferencia o Gemini Embedding 2 é que ele faz isso nativamente em todas as modalidades, sem modelos separados e sem pipelines de costura.</p>
<p>Até agora, os embeddings multimodais implicavam modelos de codificação dupla treinados com aprendizagem contrastiva: <a href="https://openai.com/index/clip/">CLIP</a> para texto-imagem, <a href="https://arxiv.org/abs/2211.06687">CLAP</a> para texto-áudio, cada um tratando exatamente duas modalidades. Se necessitasse das três, executava vários modelos e coordenava os seus espaços de incorporação.</p>
<p>Por exemplo, indexar um podcast com a arte da capa significava executar o CLIP para a imagem, o CLAP para o áudio e um codificador de texto para a transcrição - três modelos, três espaços vectoriais e lógica de fusão personalizada para tornar as suas pontuações comparáveis no momento da consulta.</p>
<p>Em contrapartida, de acordo com o <a href="https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-embedding-2/">anúncio oficial da Google</a>, eis o que o Gemini Embedding 2 suporta:</p>
<ul>
<li><strong>Texto</strong> até 8.192 tokens por pedido</li>
<li><strong>Imagens</strong> até 6 por pedido (PNG, JPEG)</li>
<li><strong>Vídeo</strong> até 120 segundos (MP4, MOV)</li>
<li><strong>Áudio</strong> até 80 segundos, incorporado nativamente sem transcrição ASR</li>
<li>Entrada de<strong>documentos</strong> em PDF, até 6 páginas</li>
</ul>
<p>Imagem<strong>de entrada mista</strong> + texto juntos numa única chamada de incorporação</p>
<h3 id="Gemini-Embedding-2-vs-CLIPCLAP-One-Model-vs-Many-for-Multimodal-Embeddings" class="common-anchor-header">Gemini Embedding 2 vs. CLIP/CLAP Um modelo vs. muitos para embeddings multimodais</h3><table>
<thead>
<tr><th></th><th><strong>Codificador duplo (CLIP, CLAP)</strong></th><th><strong>Incorporação Gemini 2</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Modalidades por modelo</strong></td><td>2 (por exemplo, imagem + texto)</td><td>5 (texto, imagem, vídeo, áudio, PDF)</td></tr>
<tr><td><strong>Adicionar uma nova modalidade</strong></td><td>Introduz outro modelo e alinha os espaços manualmente</td><td>Já está incluído - uma chamada à API</td></tr>
<tr><td><strong>Entrada intermodal</strong></td><td>Codificadores separados, chamadas separadas</td><td>Entrada intercalada (por exemplo, imagem + texto num só pedido)</td></tr>
<tr><td><strong>Arquitetura</strong></td><td>Visão separada e codificadores de texto alinhados através de perda contrastiva</td><td>Modelo único que herda a compreensão multimodal do Gemini</td></tr>
</tbody>
</table>
<h2 id="Gemini-Embedding-2’s-Advantage-Pipeline-Simplification" class="common-anchor-header">Vantagem do Gemini Embedding 2: Simplificação do pipeline<button data-href="#Gemini-Embedding-2’s-Advantage-Pipeline-Simplification" class="anchor-icon" translate="no">
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
    </button></h2><p>Tomemos um cenário comum: construir um motor de busca semântico sobre uma biblioteca de vídeos curtos. Cada clipe tem quadros visuais, áudio falado e texto de legenda - todos descrevendo o mesmo conteúdo.</p>
<p><strong>Antes do Gemini Embedding 2</strong>, eram necessários três modelos de incorporação separados (imagem, áudio, texto), três colunas de vectores e um pipeline de recuperação que faz a recuperação multidirecional, a fusão de resultados e a deduplicação. São muitas peças móveis para construir e manter.</p>
<p><strong>Agora</strong>, pode alimentar os fotogramas, o áudio e as legendas do vídeo numa única chamada à API e obter um vetor unificado que capta toda a imagem semântica.</p>
<p>Naturalmente, é tentador concluir que as colunas multi-vectoriais estão mortas. Mas essa conclusão confunde "representação unificada multimodal" com "recuperação vetorial multidimensional". Resolvem problemas diferentes, e é importante compreender a diferença para escolher a abordagem correta.</p>
<h2 id="What-is-Multi-Vector-Search-in-Milvus" class="common-anchor-header">O que é a pesquisa multi-vetorial em Milvus?<button data-href="#What-is-Multi-Vector-Search-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Em <a href="http://milvus.io">Milvus</a>, a pesquisa multi-vetorial significa pesquisar o mesmo item através de vários campos vectoriais de uma só vez e depois combinar esses resultados com o reranking.</p>
<p>A ideia central: um único objeto tem muitas vezes mais do que um tipo de significado. Um produto tem um título <em>e</em> uma descrição. Uma publicação nas redes sociais tem uma legenda <em>e</em> uma imagem. Cada ângulo diz-nos algo diferente, pelo que cada um deles tem o seu próprio campo vetorial.</p>
<p>O Milvus pesquisa cada campo vetorial de forma independente e, em seguida, funde os conjuntos de candidatos utilizando um reranker. Na API, cada pedido é mapeado para um campo e uma configuração de pesquisa diferentes, e hybrid_search() devolve o resultado combinado.</p>
<p>Dois padrões comuns dependem disso:</p>
<ul>
<li><strong>Pesquisa de vetor esparso + denso.</strong> Você tem um catálogo de produtos em que os usuários digitam consultas como "Nike Air Max vermelho tamanho 10". Os vectores densos captam a intenção semântica ("ténis de corrida, vermelho, Nike"), mas não o tamanho exato. Os vectores esparsos através do <a href="https://milvus.io/docs/full-text-search.md">BM25</a> ou de modelos como o <a href="https://milvus.io/docs/full_text_search_with_milvus.md">BGE-M3</a> conseguem a correspondência de palavras-chave. É necessário que ambos sejam executados em paralelo e, em seguida, reavaliados - porque nenhum deles, por si só, apresenta bons resultados para consultas que misturam linguagem natural com identificadores específicos, como SKUs, nomes de ficheiros ou códigos de erro.</li>
<li><strong>Pesquisa Vetorial Multimodal.</strong> Um utilizador carrega uma fotografia de um vestido e escreve "algo parecido com isto mas em azul". O utilizador pesquisa simultaneamente na coluna de incorporação de imagem a semelhança visual e na coluna de incorporação de texto a restrição de cor. Cada coluna tem o seu próprio índice e modelo - <a href="https://openai.com/index/clip/">CLIP</a> para a imagem, um codificador de texto para a descrição - e os resultados são combinados.</li>
</ul>
<p><a href="https://milvus.io/">Milvus</a> executa ambos os padrões como <a href="https://milvus.io/docs/multi-vector-search.md">pesquisas ANN</a> paralelas com reranking nativo via RRFRanker. A definição de esquemas, a configuração de múltiplos índices e o BM25 incorporado são tratados num único sistema.</p>
<p>Por exemplo, considere um catálogo de produtos em que cada item inclui uma descrição de texto e uma imagem. É possível executar três pesquisas em paralelo com esses dados:</p>
<ul>
<li><strong>Pesquisa de texto semântico.</strong> Consultar a descrição do texto com vectores densos gerados por modelos como o <a href="https://zilliz.com/learn/explore-colbert-token-level-embedding-and-ranking-model-for-similarity-search?_gl=1*d243m9*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#A-Quick-Recap-of-BERT">BERT</a>, <a href="https://zilliz.com/learn/NLP-essentials-understanding-transformers-in-AI?_gl=1*d243m9*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.">Transformers</a> ou a API de incorporação <a href="https://zilliz.com/learn/guide-to-using-openai-text-embedding-models">OpenAI</a>.</li>
<li><strong>Pesquisa de texto completo.</strong> Consulta da descrição do texto com vectores esparsos utilizando <a href="https://zilliz.com/learn/mastering-bm25-a-deep-dive-into-the-algorithm-and-application-in-milvus">BM25</a> ou modelos de incorporação esparsos como <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings?_gl=1*1cde1oq*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#BGE-M3">BGE-M3</a> ou <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings?_gl=1*ov2die*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#SPLADE">SPLADE</a>.</li>
<li><strong>Pesquisa de imagens intermodais.</strong> Consulta de imagens de produtos utilizando uma consulta de texto, com vectores densos de um modelo como o <a href="https://zilliz.com/learn/exploring-openai-clip-the-future-of-multimodal-ai-learning">CLIP</a>.</li>
</ul>
<h2 id="With-Gemini-Embedding-2-Will-Multi-Vector-Search-Still-Matter" class="common-anchor-header">Com o Gemini Embedding 2, a pesquisa multi-vetorial continuará a ser importante?<button data-href="#With-Gemini-Embedding-2-Will-Multi-Vector-Search-Still-Matter" class="anchor-icon" translate="no">
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
    </button></h2><p>O Gemini Embedding 2 lida com mais modalidades em uma chamada, o que simplifica consideravelmente os pipelines. Mas um embedding multimodal unificado não é a mesma coisa que a recuperação multi-vetorial. Por outras palavras, sim, a pesquisa multi-vetorial continuará a ser importante.</p>
<p>O Gemini Embedding 2 mapeia texto, imagens, vídeo, áudio e documentos num espaço vetorial partilhado. A Google <a href="https://developers.googleblog.com/en/gemini-embedding-model-now-available/">posiciona-o</a> para a pesquisa semântica multimodal, a recuperação de documentos e a recomendação - cenários em que todas as modalidades descrevem o mesmo conteúdo e a elevada sobreposição entre modalidades torna viável um único vetor.</p>
<p>A pesquisa multi-vetorial<a href="https://milvus.io/docs/multi-vector-search.md">Milvus</a> resolve um problema diferente. É uma forma de pesquisar o mesmo objeto através de <strong>vários campos vectoriais -</strong>por exemplo, um título e uma descrição, ou um texto e uma imagem - e depois combinar esses sinais durante a recuperação. Por outras palavras, trata-se de preservar e consultar <strong>várias perspectivas semânticas</strong> do mesmo item, e não apenas de comprimir tudo numa única representação.</p>
<p>Mas os dados do mundo real raramente se encaixam numa única incorporação. Os sistemas biométricos, a recuperação de ferramentas agênticas e o comércio eletrónico de intenções mistas dependem todos de vectores que vivem em espaços semânticos completamente diferentes. É exatamente aí que uma incorporação unificada deixa de funcionar.</p>
<h3 id="Why-One-Embedding-Isnt-Enough-Multi-Vector-Retrieval-in-Practice" class="common-anchor-header">Porque é que uma incorporação não é suficiente: Recuperação multi-vetorial na prática</h3><p>O Gemini Embedding 2 trata do caso em que todas as modalidades descrevem a mesma coisa. A pesquisa multi-vetorial trata de tudo o resto - e "tudo o resto" abrange a maioria dos sistemas de recuperação de produção.</p>
<p><strong>Biometria.</strong> Um único utilizador tem vectores de rosto, impressão vocal, impressão digital e íris. Estes descrevem caraterísticas biológicas completamente independentes com sobreposição semântica zero. Não é possível colapsá-los num único vetor - cada um precisa da sua própria coluna, índice e métrica de semelhança.</p>
<p><strong>Ferramentas agênticas.</strong> Um assistente de codificação como o OpenClaw armazena vectores semânticos densos para o histórico de conversação ("aquele problema de implementação da semana passada") juntamente com vectores BM25 esparsos para correspondência exacta em nomes de ficheiros, comandos CLI e parâmetros de configuração. Diferentes objectivos de recuperação, diferentes tipos de vectores, caminhos de pesquisa independentes e, em seguida, reavaliados.</p>
<p><strong>Comércio eletrónico com intenções mistas.</strong> O vídeo promocional de um produto e as imagens detalhadas funcionam bem como uma incorporação Gemini unificada. Mas quando um utilizador pretende "vestidos parecidos com este" <em>e</em> "mesmo tecido, tamanho M", é necessária uma coluna de semelhança visual e uma coluna de atributos estruturados com índices separados e uma camada de recuperação híbrida.</p>
<h2 id="When-to-Use-Gemini-Embedding-2-vs-Multi-vector-Columns" class="common-anchor-header">Quando usar a incorporação Gemini 2 vs. colunas de vários vetores<button data-href="#When-to-Use-Gemini-Embedding-2-vs-Multi-vector-Columns" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th><strong>Cenário</strong></th><th><strong>O que usar</strong></th><th><strong>Porquê?</strong></th></tr>
</thead>
<tbody>
<tr><td>Todas as modalidades descrevem o mesmo conteúdo (fotogramas de vídeo + áudio + legendas)</td><td>Vetor unificado Gemini Embedding 2</td><td>A elevada sobreposição semântica significa que um vetor capta a imagem completa - não é necessária fusão</td></tr>
<tr><td>É necessária a precisão das palavras-chave e a recuperação semântica (BM25 + densa)</td><td>Colunas multi-vectoriais com hybrid_search()</td><td>Os vectores esparsos e densos servem objectivos de recuperação diferentes que não podem ser colapsados numa única incorporação</td></tr>
<tr><td>A pesquisa intermodal é o principal caso de utilização (consulta de texto → resultados de imagem)</td><td>Vetor unificado Gemini Embedding 2</td><td>Um único espaço partilhado torna nativa a semelhança intermodal</td></tr>
<tr><td>Os vectores vivem em espaços semânticos fundamentalmente diferentes (biometria, atributos estruturados)</td><td>Colunas multi-vectoriais com índices por campo</td><td>Métricas de similaridade e tipos de índices independentes por campo vetorial</td></tr>
<tr><td>Pretende simplicidade de pipeline <em>e</em> recuperação com granularidade fina</td><td>Ambos - vetor Gemini unificado + colunas adicionais esparsas ou de atributos na mesma coleção</td><td>O Gemini trata da coluna multimodal; o Milvus trata da camada de recuperação híbrida à sua volta</td></tr>
</tbody>
</table>
<p>Estas duas abordagens não são mutuamente exclusivas. É possível usar o Gemini Embedding 2 para a coluna multimodal unificada e ainda armazenar vetores adicionais esparsos ou específicos de atributos em colunas separadas dentro da mesma coleção <a href="https://milvus.io/">do Milvus</a>.</p>
<h2 id="Quick-Start-Set-Up-Gemini-Embedding-2-+-Milvus" class="common-anchor-header">Início rápido: Configurar o Gemini Embedding 2 + Milvus<button data-href="#Quick-Start-Set-Up-Gemini-Embedding-2-+-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Aqui está uma demonstração funcional. É necessário ter uma <a href="https://milvus.io/docs/install-overview.md">instância do Milvus ou do Zilliz Cloud</a> em execução e uma GOOGLE_API_KEY.</p>
<h3 id="Setup" class="common-anchor-header">Configuração</h3><pre><code translate="no">pip install google-genai pymilvus
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">GOOGLE_API_KEY</span>=<span class="hljs-string">&quot;your-api-key&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Full-Example" class="common-anchor-header">Exemplo completo</h3><pre><code translate="no"><span class="hljs-string">&quot;&quot;&quot;
Prerequisites:
    pip install google-genai pymilvus

Set environment variable:
    export GOOGLE_API_KEY=&quot;your-api-key&quot;
&quot;&quot;&quot;</span>

<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> struct
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> google <span class="hljs-keyword">import</span> genai
<span class="hljs-keyword">from</span> google.genai <span class="hljs-keyword">import</span> types
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

<span class="hljs-comment"># ── Config ───────────────────────────────────────────────────────────────</span>
COLLECTION_NAME = <span class="hljs-string">&quot;gemini_multimodal_demo&quot;</span>
MILVUS_URI = <span class="hljs-string">&quot;http://localhost:19530&quot;</span>  <span class="hljs-comment"># Change to your Milvus address</span>
DIM = <span class="hljs-number">3072</span>  <span class="hljs-comment"># gemini-embedding-2-preview output dimension</span>
GEMINI_MODEL = <span class="hljs-string">&quot;gemini-embedding-2-preview&quot;</span>

<span class="hljs-comment"># ── Initialize clients ──────────────────────────────────────────────────</span>
gemini_client = genai.Client()  <span class="hljs-comment"># Uses GOOGLE_API_KEY env var</span>
milvus_client = MilvusClient(MILVUS_URI)

<span class="hljs-comment"># ── Helper: generate embedding ──────────────────────────────────────────</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_texts</span>(<span class="hljs-params">texts: <span class="hljs-built_in">list</span>[<span class="hljs-built_in">str</span>], task_type: <span class="hljs-built_in">str</span> = <span class="hljs-string">&quot;SEMANTIC_SIMILARITY&quot;</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]]:
    <span class="hljs-string">&quot;&quot;&quot;Embed a list of text strings.&quot;&quot;&quot;</span>
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=texts,
        config=types.EmbedContentConfig(task_type=task_type),
    )
    <span class="hljs-keyword">return</span> [e.values <span class="hljs-keyword">for</span> e <span class="hljs-keyword">in</span> result.embeddings]

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_image</span>(<span class="hljs-params">image_path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Embed an image file.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(image_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> f:
        image_bytes = f.read()
    mime = <span class="hljs-string">&quot;image/png&quot;</span> <span class="hljs-keyword">if</span> image_path.endswith(<span class="hljs-string">&quot;.png&quot;</span>) <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;image/jpeg&quot;</span>
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=types.Part.from_bytes(data=image_bytes, mime_type=mime),
    )
    <span class="hljs-keyword">return</span> result.embeddings[<span class="hljs-number">0</span>].values

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_audio</span>(<span class="hljs-params">audio_path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Embed an audio file.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(audio_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> f:
        audio_bytes = f.read()
    mime_map = {<span class="hljs-string">&quot;.mp3&quot;</span>: <span class="hljs-string">&quot;audio/mpeg&quot;</span>, <span class="hljs-string">&quot;.wav&quot;</span>: <span class="hljs-string">&quot;audio/wav&quot;</span>, <span class="hljs-string">&quot;.flac&quot;</span>: <span class="hljs-string">&quot;audio/flac&quot;</span>}
    ext = os.path.splitext(audio_path)[<span class="hljs-number">1</span>].lower()
    mime = mime_map.get(ext, <span class="hljs-string">&quot;audio/mpeg&quot;</span>)
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=types.Part.from_bytes(data=audio_bytes, mime_type=mime),
    )
    <span class="hljs-keyword">return</span> result.embeddings[<span class="hljs-number">0</span>].values

<span class="hljs-comment"># ── 1. Create Milvus collection ─────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=== Creating collection ===&quot;</span>)
<span class="hljs-keyword">if</span> milvus_client.has_collection(COLLECTION_NAME):
    milvus_client.drop_collection(COLLECTION_NAME)

schema = milvus_client.create_schema()
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;content&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>)   <span class="hljs-comment"># description of the content</span>
schema.add_field(<span class="hljs-string">&quot;modality&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">20</span>)    <span class="hljs-comment"># &quot;text&quot;, &quot;image&quot;, &quot;audio&quot;</span>
schema.add_field(<span class="hljs-string">&quot;vector&quot;</span>, DataType.FLOAT_VECTOR, dim=DIM)

index_params = milvus_client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
)

milvus_client.create_collection(
    COLLECTION_NAME,
    schema=schema,
    index_params=index_params,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created (dim=<span class="hljs-subst">{DIM}</span>, metric=COSINE)&quot;</span>)

<span class="hljs-comment"># ── 2. Insert text embeddings ───────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Inserting text embeddings ===&quot;</span>)
documents = [
    <span class="hljs-string">&quot;Artificial intelligence was founded as an academic discipline in 1956.&quot;</span>,
    <span class="hljs-string">&quot;The Mona Lisa is a half-length portrait painting by Leonardo da Vinci.&quot;</span>,
    <span class="hljs-string">&quot;Beethoven&#x27;s Symphony No. 9 premiered in Vienna on May 7, 1824.&quot;</span>,
    <span class="hljs-string">&quot;The Great Wall of China stretches over 13,000 miles across northern China.&quot;</span>,
    <span class="hljs-string">&quot;Jazz music originated in the African-American communities of New Orleans.&quot;</span>,
    <span class="hljs-string">&quot;The Hubble Space Telescope was launched into orbit on April 24, 1990.&quot;</span>,
    <span class="hljs-string">&quot;Vincent van Gogh painted The Starry Night while in an asylum in Saint-Rémy.&quot;</span>,
    <span class="hljs-string">&quot;Machine learning is a subset of AI focused on learning from data.&quot;</span>,
]

text_vectors = embed_texts(documents)
text_rows = [
    {<span class="hljs-string">&quot;content&quot;</span>: doc, <span class="hljs-string">&quot;modality&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>: vec}
    <span class="hljs-keyword">for</span> doc, vec <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(documents, text_vectors)
]
milvus_client.insert(COLLECTION_NAME, text_rows)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{<span class="hljs-built_in">len</span>(text_rows)}</span> text documents&quot;</span>)

<span class="hljs-comment"># ── 3. (Optional) Insert image embeddings ───────────────────────────────</span>
<span class="hljs-comment"># Uncomment and provide real image paths to test multimodal search</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># image_files = [</span>
<span class="hljs-comment">#     (&quot;photo of the Mona Lisa painting&quot;, &quot;mona_lisa.jpg&quot;),</span>
<span class="hljs-comment">#     (&quot;satellite photo of the Great Wall of China&quot;, &quot;great_wall.png&quot;),</span>
<span class="hljs-comment"># ]</span>
<span class="hljs-comment"># for desc, path in image_files:</span>
<span class="hljs-comment">#     if os.path.exists(path):</span>
<span class="hljs-comment">#         vec = embed_image(path)</span>
<span class="hljs-comment">#         milvus_client.insert(COLLECTION_NAME, [</span>
<span class="hljs-comment">#             {&quot;content&quot;: desc, &quot;modality&quot;: &quot;image&quot;, &quot;vector&quot;: vec}</span>
<span class="hljs-comment">#         ])</span>
<span class="hljs-comment">#         print(f&quot;Inserted image: {desc}&quot;)</span>

<span class="hljs-comment"># ── 4. (Optional) Insert audio embeddings ───────────────────────────────</span>
<span class="hljs-comment"># Uncomment and provide real audio paths to test multimodal search</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># audio_files = [</span>
<span class="hljs-comment">#     (&quot;Beethoven Symphony No.9 excerpt&quot;, &quot;beethoven_9.mp3&quot;),</span>
<span class="hljs-comment">#     (&quot;jazz piano improvisation&quot;, &quot;jazz_piano.mp3&quot;),</span>
<span class="hljs-comment"># ]</span>
<span class="hljs-comment"># for desc, path in audio_files:</span>
<span class="hljs-comment">#     if os.path.exists(path):</span>
<span class="hljs-comment">#         vec = embed_audio(path)</span>
<span class="hljs-comment">#         milvus_client.insert(COLLECTION_NAME, [</span>
<span class="hljs-comment">#             {&quot;content&quot;: desc, &quot;modality&quot;: &quot;audio&quot;, &quot;vector&quot;: vec}</span>
<span class="hljs-comment">#         ])</span>
<span class="hljs-comment">#         print(f&quot;Inserted audio: {desc}&quot;)</span>

<span class="hljs-comment"># ── 5. Search ────────────────────────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Searching ===&quot;</span>)

queries = [
    <span class="hljs-string">&quot;history of artificial intelligence&quot;</span>,
    <span class="hljs-string">&quot;famous Renaissance paintings&quot;</span>,
    <span class="hljs-string">&quot;classical music concerts&quot;</span>,
]

query_vectors = embed_texts(queries, task_type=<span class="hljs-string">&quot;SEMANTIC_SIMILARITY&quot;</span>)

<span class="hljs-keyword">for</span> query_text, query_vec <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(queries, query_vectors):
    results = milvus_client.search(
        COLLECTION_NAME,
        data=[query_vec],
        limit=<span class="hljs-number">3</span>,
        output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;modality&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    )
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nQuery: &#x27;<span class="hljs-subst">{query_text}</span>&#x27;&quot;</span>)
    <span class="hljs-keyword">for</span> hits <span class="hljs-keyword">in</span> results:
        <span class="hljs-keyword">for</span> rank, hit <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(hits, <span class="hljs-number">1</span>):
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  [<span class="hljs-subst">{rank}</span>] (score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, modality=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;modality&#x27;</span>]}</span>) &quot;</span>
                  <span class="hljs-string">f&quot;<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">80</span>]}</span>&quot;</span>)

<span class="hljs-comment"># ── 6. Cross-modal search example (image query -&gt; text results) ─────────</span>
<span class="hljs-comment"># Uncomment to search text collection using an image as query</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># print(&quot;\n=== Cross-modal search: image -&gt; text ===&quot;)</span>
<span class="hljs-comment"># query_image_vec = embed_image(&quot;query_image.jpg&quot;)</span>
<span class="hljs-comment"># results = milvus_client.search(</span>
<span class="hljs-comment">#     COLLECTION_NAME,</span>
<span class="hljs-comment">#     data=[query_image_vec],</span>
<span class="hljs-comment">#     limit=3,</span>
<span class="hljs-comment">#     output_fields=[&quot;content&quot;, &quot;modality&quot;],</span>
<span class="hljs-comment">#     search_params={&quot;metric_type&quot;: &quot;COSINE&quot;},</span>
<span class="hljs-comment"># )</span>
<span class="hljs-comment"># for hits in results:</span>
<span class="hljs-comment">#     for rank, hit in enumerate(hits, 1):</span>
<span class="hljs-comment">#         print(f&quot;  [{rank}] (score={hit[&#x27;distance&#x27;]:.4f}) {hit[&#x27;entity&#x27;][&#x27;content&#x27;][:80]}&quot;)</span>

<span class="hljs-comment"># ── Cleanup ──────────────────────────────────────────────────────────────</span>
<span class="hljs-comment"># milvus_client.drop_collection(COLLECTION_NAME)</span>
<span class="hljs-comment"># print(f&quot;\nCollection &#x27;{COLLECTION_NAME}&#x27; dropped&quot;)</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nDone!&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<p>Para embeddings de imagem e áudio, use embed_image() e embed_audio() da mesma forma - os vetores caem na mesma coleção e no mesmo espaço vetorial, permitindo uma verdadeira busca cross-modal.</p>
<h2 id="Gemini-Embedding-2-Will-be-Available-in-MilvusZilliz-Cloud-Soon" class="common-anchor-header">Gemini Embedding 2 estará disponível em breve no Milvus/Zilliz Cloud<button data-href="#Gemini-Embedding-2-Will-be-Available-in-MilvusZilliz-Cloud-Soon" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">O Milvus</a> está a enviar uma integração profunda com o Gemini Embedding 2 através da sua funcionalidade <a href="https://milvus.io/docs/embeddings.md">Embedding Function</a>. Uma vez disponível, não será necessário chamar manualmente as APIs de incorporação. O Milvus invocará automaticamente o modelo (suportando OpenAI, AWS Bedrock, Google Vertex AI, entre outros) para vetorizar dados em bruto na inserção e consultas na pesquisa.</p>
<p>Isso significa que você obtém incorporação multimodal unificada do Gemini onde ele se encaixa e o kit de ferramentas multivetoriais completo do Milvus - pesquisa híbrida esparso-densa, esquemas de vários índices, reranking - onde você precisa de controle refinado.</p>
<p>Quer experimentar? Comece com o <a href="https://milvus.io/docs/quickstart.md">quickstart do Milvus</a> e execute a demonstração acima, ou confira o <a href="https://milvus.io/docs/hybrid_search_with_milvus.md">guia de busca híbrida</a> para a configuração completa de multi-vetor com BGE-M3. Traga suas perguntas para o <a href="https://milvus.io/discord">Discord</a> ou para o <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour">Milvus Office Hours</a>.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Continue lendo<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Apresentando a Função Embedding: Como o Milvus 2.6 agiliza a vectorização e a pesquisa semântica - Milvus Blog</a></li>
<li><a href="https://milvus.io/docs/multi-vector-search.md">Pesquisa híbrida multi-vetorial</a></li>
<li><a href="https://milvus.io/docs/embeddings.md">Documentos sobre a função de incorporação do Milvus</a></li>
</ul>
