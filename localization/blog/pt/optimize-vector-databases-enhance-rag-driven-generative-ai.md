---
id: optimize-vector-databases-enhance-rag-driven-generative-ai.md
title: >-
  Otimizar bases de dados de vectores, melhorar a IA generativa orientada por
  RAG
author: 'Cathy Zhang, Dr. Malini Bhandaru'
date: 2024-05-13T00:00:00.000Z
desc: >-
  Neste artigo, ficará a saber mais sobre as bases de dados vectoriais e as suas
  estruturas de avaliação comparativa, conjuntos de dados para abordar
  diferentes aspectos e as ferramentas utilizadas para a análise de desempenho -
  tudo o que precisa para começar a otimizar as bases de dados vectoriais.
cover: >-
  assets.zilliz.com/Optimize_Vector_Databases_Enhance_RAG_Driven_Generative_AI_6e3b370f25.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, RAG, Generative AI
recommend: true
canonicalUrl: >-
  https://medium.com/intel-tech/optimize-vector-databases-enhance-rag-driven-generative-ai-90c10416cb9c
---
<p><em>Este post foi originalmente publicado no <a href="https://medium.com/intel-tech/optimize-vector-databases-enhance-rag-driven-generative-ai-90c10416cb9c">canal Medium da Intel</a> e é republicado aqui com permissão.</em></p>
<p><br></p>
<p>Dois métodos para otimizar a sua base de dados de vectores quando utiliza o RAG</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*FRWBVwOHPYFDIVTp_ylZNQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Foto de <a href="https://unsplash.com/@ilyapavlov?utm_content=creditCopyText&amp;utm_medium=referral&amp;utm_source=unsplash">Ilya Pavlov</a> no <a href="https://unsplash.com/photos/monitor-showing-java-programming-OqtafYT5kTw?utm_content=creditCopyText&amp;utm_medium=referral&amp;utm_source=unsplash">Unsplash</a></p>
<p>Por Cathy Zhang e Dr. Malini Bhandaru Colaboradores: Lin Yang e Changyan Liu</p>
<p>Os modelos de IA generativa (GenAI), que estão a ser adoptados de forma exponencial no nosso quotidiano, estão a ser melhorados através da <a href="https://www.techtarget.com/searchenterpriseai/definition/retrieval-augmented-generation">geração aumentada por recuperação (RAG)</a>, uma técnica utilizada para aumentar a precisão e a fiabilidade das respostas, obtendo factos de fontes externas. A RAG ajuda um <a href="https://www.techtarget.com/whatis/definition/large-language-model-LLM">modelo</a> regular <a href="https://www.techtarget.com/whatis/definition/large-language-model-LLM">de grande linguagem (LLM)</a> a compreender o contexto e a reduzir <a href="https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)">as alucinações</a>, tirando partido de uma base de dados gigante de dados não estruturados armazenados como vectores - uma apresentação matemática que ajuda a captar o contexto e as relações entre os dados.</p>
<p>As RAG ajudam a obter mais informações contextuais e, assim, a gerar melhores respostas, mas as bases de dados vectoriais em que se baseiam estão a tornar-se cada vez maiores para fornecerem um conteúdo rico a que recorrer. Tal como os LLM de triliões de parâmetros estão no horizonte, as bases de dados vectoriais de milhares de milhões de vectores não estão muito longe. Como engenheiros de otimização, estávamos curiosos para ver se podíamos tornar as bases de dados vectoriais mais eficientes, carregar dados mais rapidamente e criar índices mais rapidamente para garantir a velocidade de recuperação, mesmo quando são adicionados novos dados. Ao fazê-lo, não só se reduziria o tempo de espera do utilizador, como também se tornariam as soluções de IA baseadas em RAG um pouco mais sustentáveis.</p>
<p>Neste artigo, ficará a saber mais sobre as bases de dados vectoriais e as suas estruturas de avaliação comparativa, conjuntos de dados para abordar diferentes aspectos e as ferramentas utilizadas para a análise de desempenho - tudo o que precisa para começar a otimizar as bases de dados vectoriais. Também partilharemos os nossos resultados de otimização em duas soluções populares de bases de dados vectoriais para o inspirar no seu percurso de otimização do desempenho e do impacto na sustentabilidade.</p>
<h2 id="Understanding-Vector-Databases" class="common-anchor-header">Compreender as bases de dados vectoriais<button data-href="#Understanding-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Ao contrário das bases de dados relacionais ou não relacionais tradicionais, em que os dados são armazenados de forma estruturada, uma base de dados vetorial contém uma representação matemática de itens de dados individuais, denominada vetor, construída através de uma função de incorporação ou transformação. O vetor representa normalmente caraterísticas ou significados semânticos e pode ser curto ou longo. As bases de dados vectoriais efectuam a recuperação de vectores através da pesquisa de semelhanças utilizando uma métrica de distância (em que mais próximo significa que os resultados são mais semelhantes), como <a href="https://www.pinecone.io/learn/vector-similarity/">a semelhança euclidiana, o produto escalar ou o cosseno</a>.</p>
<p>Para acelerar o processo de recuperação, os dados vectoriais são organizados utilizando um mecanismo de indexação. Exemplos destes métodos de organização incluem estruturas planas, <a href="https://arxiv.org/abs/2002.09094">ficheiro invertido (IVF),</a> <a href="https://arxiv.org/abs/1603.09320">Hierarchical Navigable Small Worlds (HNSW)</a> e <a href="https://en.wikipedia.org/wiki/Locality-sensitive_hashing">locality-sensitive hashing (LSH)</a>, entre outros. Cada um destes métodos contribui para a eficiência e eficácia da recuperação de vectores semelhantes quando necessário.</p>
<p>Vejamos como utilizar uma base de dados de vectores num sistema GenAI. A Figura 1 ilustra o carregamento de dados numa base de dados vetorial e a sua utilização no contexto de uma aplicação GenAI. Quando o utilizador introduz a sua mensagem, esta é submetida a um processo de transformação idêntico ao utilizado para gerar vectores na base de dados. Este comando vetorial transformado é depois utilizado para recuperar vectores semelhantes da base de dados vetorial. Estes itens recuperados funcionam essencialmente como memória de conversação, fornecendo um historial contextual para as mensagens, à semelhança do funcionamento dos LLM. Esta caraterística revela-se particularmente vantajosa no processamento de linguagem natural, visão por computador, sistemas de recomendação e outros domínios que requerem compreensão semântica e correspondência de dados. O seu pedido inicial é subsequentemente "fundido" com os elementos recuperados, fornecendo contexto e ajudando o LLM a formular respostas com base no contexto fornecido, em vez de se basear apenas nos seus dados de treino originais.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*zQj_YJdWc2xKB6Vv89lzDQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura 1. Arquitetura de uma aplicação RAG.</p>
<p>Os vectores são armazenados e indexados para uma recuperação rápida. As bases de dados vectoriais existem em dois tipos principais: as bases de dados tradicionais que foram alargadas para armazenar vectores e as bases de dados vectoriais criadas para o efeito. Alguns exemplos de bancos de dados tradicionais que oferecem suporte a vetores são <a href="https://redis.io/">Redis</a>, <a href="https://github.com/pgvector/pgvector">pgvector</a>, <a href="https://www.elastic.co/elasticsearch">Elasticsearch</a> e <a href="https://opensearch.org/">OpenSearch</a>. Exemplos de bases de dados vectoriais criadas propositadamente incluem as soluções proprietárias <a href="https://zilliz.com/">Zilliz</a> e <a href="https://www.pinecone.io/">Pinecone</a>, e os projectos de código aberto <a href="https://milvus.io/">Milvus</a>, <a href="https://weaviate.io/">Weaviate</a>, <a href="https://qdrant.tech/">Qdrant</a>, <a href="https://github.com/facebookresearch/faiss">Faiss</a> e <a href="https://www.trychroma.com/">Chroma</a>. Pode saber mais sobre bases de dados vectoriais no GitHub através do <a href="https://github.com/langchain-ai/langchain/tree/master/libs/langchain/langchain/vectorstores">LangChain </a>e do <a href="https://github.com/openai/openai-cookbook/tree/main/examples/vector_databases">OpenAI Cookbook</a>.</p>
<p>Vamos dar uma olhada mais de perto em um de cada categoria, Milvus e Redis.</p>
<h2 id="Improving-Performance" class="common-anchor-header">Melhorando o desempenho<button data-href="#Improving-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de mergulhar nas otimizações, vamos rever como os bancos de dados vetoriais são avaliados, alguns frameworks de avaliação e ferramentas de análise de desempenho disponíveis.</p>
<h3 id="Performance-Metrics" class="common-anchor-header">Métricas de desempenho</h3><p>Vejamos as principais métricas que podem ajudar a medir o desempenho do banco de dados vetorial.</p>
<ul>
<li><strong>A latência de carga</strong> mede o tempo necessário para carregar dados na memória do banco de dados vetorial e criar um índice. Um índice é uma estrutura de dados usada para organizar e recuperar com eficiência dados vetoriais com base em sua similaridade ou distância. Os tipos de <a href="https://milvus.io/docs/index.md#In-memory-Index">índices na memória</a> incluem o <a href="https://thedataquarry.com/posts/vector-db-3/#flat-indexes">índice plano</a>, <a href="https://supabase.com/docs/guides/ai/vector-indexes/ivf-indexes">IVF_FLAT</a>, <a href="https://towardsdatascience.com/ivfpq-hnsw-for-billion-scale-similarity-search-89ff2f89d90e">IVF_PQ, HNSW</a>, <a href="https://github.com/google-research/google-research/tree/master/scann">scalable nearest neighbors (ScaNN)</a>e <a href="https://milvus.io/docs/disk_index.md">DiskANN</a>.</li>
<li><strong>A recuperação</strong> é a proporção de correspondências verdadeiras, ou itens relevantes, encontrados nos <a href="https://redis.io/docs/data-types/probabilistic/top-k/">K principais</a> resultados recuperados pelo algoritmo de pesquisa. Valores de recuperação mais elevados indicam uma melhor recuperação de itens relevantes.</li>
<li><strong>Consultas por segundo (QPS)</strong> é a taxa a que a base de dados vetorial pode processar as consultas recebidas. Valores mais elevados de QPS implicam uma melhor capacidade de processamento de consultas e um melhor rendimento do sistema.</li>
</ul>
<h3 id="Benchmarking-Frameworks" class="common-anchor-header">Quadros de avaliação comparativa</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:920/1*mssEjZAuXg6nf-pad67rHA.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura 2. O quadro de avaliação comparativa da base de dados vetorial.</p>
<p>A avaliação comparativa de uma base de dados vetorial requer um servidor de base de dados vetorial e clientes. Nos nossos testes de desempenho, utilizámos duas ferramentas populares de código aberto.</p>
<ul>
<li><a href="https://github.com/zilliztech/VectorDBBench/tree/main"><strong>VectorDBBench</strong></a><strong>:</strong> Desenvolvido e de código aberto por Zilliz, o VectorDBBench ajuda a testar diferentes bases de dados vectoriais com diferentes tipos de índices e fornece uma interface Web conveniente.</li>
<li><a href="https://github.com/qdrant/vector-db-benchmark/tree/master"><strong>vetor-db-benchmark</strong></a><strong>:</strong> Desenvolvido e de código aberto por Qdrant, o vetor-db-benchmark ajuda a testar várias bases de dados vectoriais típicas para o tipo de índice <a href="https://www.datastax.com/guides/hierarchical-navigable-small-worlds">HNSW</a>. Ele executa testes por meio da linha de comando e fornece um <a href="https://docs.docker.com/compose/">Docker Compose</a> __file para simplificar a inicialização dos componentes do servidor.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*NpHHEFV0TxRMse83hK6H1A.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura 3. Um exemplo de comando vetor-db-benchmark usado para executar o teste de benchmark.</p>
<p>Mas a estrutura de benchmark é apenas parte da equação. Precisamos de dados que exercitem diferentes aspectos da própria solução de banco de dados vetorial, como sua capacidade de lidar com grandes volumes de dados, vários tamanhos de vetor e velocidade de recuperação.</p>
<h3 id="Open-Datasets-to-Exercise-Vector-Databases" class="common-anchor-header">Conjuntos de dados abertos para testar bases de dados vectoriais</h3><p>Grandes conjuntos de dados são bons candidatos para testar a latência de carga e a alocação de recursos. Alguns conjuntos de dados têm dados de elevada dimensão e são bons para testar a velocidade da similaridade de computação.</p>
<p>Os conjuntos de dados variam de uma dimensão de 25 a uma dimensão de 2048. O conjunto de dados <a href="https://laion.ai/">LAION</a>, uma coleção de imagens aberta, tem sido utilizado para treinar modelos neurais profundos visuais e linguísticos muito grandes, como os modelos generativos de difusão estável. O conjunto de dados do OpenAI de 5M vectores, cada um com uma dimensão de 1536, foi criado pelo VectorDBBench executando o OpenAI em <a href="https://huggingface.co/datasets/allenai/c4">dados brutos</a>. Dado que cada elemento do vetor é do tipo FLOAT, para guardar apenas os vectores, são necessários cerca de 29 GB (5M * 1536 * 4) de memória, mais uma quantidade semelhante para guardar índices e outros metadados, num total de 58 GB de memória para testes. Ao usar a ferramenta vetor-db-benchmark, garanta um armazenamento em disco adequado para salvar os resultados.</p>
<p>Para testar a latência de carga, precisávamos de uma grande coleção de vectores, que <a href="https://docs.hippo.transwarp.io/docs/performance-dataset">o deep-image-96-angular</a> oferece. Para testar o desempenho da geração de índices e do cálculo da similaridade, os vectores de elevada dimensão proporcionam mais stress. Para tal, escolhemos o conjunto de dados 500K de 1536 vectores de dimensão.</p>
<h3 id="Performance-Tools" class="common-anchor-header">Ferramentas de desempenho</h3><p>Abordámos formas de sobrecarregar o sistema para identificar métricas de interesse, mas vamos examinar o que está a acontecer a um nível mais baixo: qual o nível de ocupação da unidade de computação, consumo de memória, esperas em bloqueios, etc.? Estes fornecem pistas sobre o comportamento da base de dados, particularmente úteis na identificação de áreas problemáticas.</p>
<p>O utilitário <a href="https://www.redhat.com/sysadmin/interpret-top-output">top do</a> Linux fornece informações sobre o desempenho do sistema. No entanto, a ferramenta <a href="https://perf.wiki.kernel.org/index.php/Main_Page">perf</a> no Linux fornece um conjunto mais profundo de informações. Para saber mais, recomendamos também a leitura dos <a href="https://www.brendangregg.com/perf.html">exemplos do Linux perf</a> e do <a href="https://www.intel.com/content/www/us/en/docs/vtune-profiler/cookbook/2023-0/top-down-microarchitecture-analysis-method.html">método de análise de microarquitetura top-down da Intel</a>. Ainda outra ferramenta é o <a href="https://www.intel.com/content/www/us/en/developer/tools/oneapi/vtune-profiler.html">Intel® vTune™ Profiler</a>, que é útil ao otimizar não apenas o aplicativo, mas também o desempenho e a configuração do sistema para uma variedade de cargas de trabalho que abrangem HPC, nuvem, IoT, mídia, armazenamento e muito mais.</p>
<h2 id="Milvus-Vector-Database-Optimizations" class="common-anchor-header">Otimizações do banco de dados do Milvus Vetor<button data-href="#Milvus-Vector-Database-Optimizations" class="anchor-icon" translate="no">
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
    </button></h2><p>Vamos analisar alguns exemplos de como tentamos melhorar o desempenho do banco de dados vetorial Milvus.</p>
<h3 id="Reducing-Memory-Movement-Overhead-in-Datanode-Buffer-Write" class="common-anchor-header">Reduzindo a sobrecarga de movimentação de memória na gravação do buffer de nó de dados</h3><p>Os proxies do caminho de escrita do Milvus escrevem dados num broker de registo através de <em>MsgStream</em>. Os nós de dados então consomem os dados, convertendo-os e armazenando-os em segmentos. Os segmentos irão fundir os dados recém-inseridos. A lógica de mesclagem aloca um novo buffer para manter/mover os dados antigos e os novos dados a serem inseridos e, em seguida, retorna o novo buffer como dados antigos para a próxima mesclagem de dados. Isso faz com que os dados antigos fiquem sucessivamente maiores, o que, por sua vez, torna a movimentação de dados mais lenta. Os perfis de desempenho mostraram uma sobrecarga elevada para esta lógica.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*Az4dMVBcGmdeyKNrwpR19g.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura 4. Mesclar e mover dados no banco de dados vetorial gera uma sobrecarga de alto desempenho.</p>
<p>Alterámos a lógica do <em>buffer de fusão</em> para anexar diretamente os novos dados a inserir nos dados antigos, evitando a atribuição de um novo buffer e a movimentação dos grandes dados antigos. Os perfis de desempenho confirmam que não há sobrecarga para esta lógica. As métricas de microcódigo <em>metric_CPU operating frequency</em> e <em>metric_CPU utilization</em> indicam uma melhoria que é consistente com o facto de o sistema já não ter de esperar pelo longo movimento da memória. A latência de carga melhorou em mais de 60 por cento. A melhoria é capturada no <a href="https://github.com/milvus-io/milvus/pull/26839">GitHub</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*MmaUtBTdqmMvC5MlQ8V0wQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura 5. Com menos cópias, vemos uma melhoria de desempenho de mais de 50 por cento na latência de carga.</p>
<h3 id="Inverted-Index-Building-with-Reduced-Memory-Allocation-Overhead" class="common-anchor-header">Construção de índice invertido com sobrecarga de alocação de memória reduzida</h3><p>O motor de busca Milvus, <a href="https://milvus.io/docs/knowhere.md">Knowhere</a>, utiliza o <a href="https://www.vlfeat.org/api/kmeans-fundamentals.html#kmeans-elkan">algoritmo Elkan k-means</a> para treinar dados de cluster para criar <a href="https://milvus.io/docs/v1.1.1/index.md">índices de ficheiros invertidos (IVF)</a>. Cada rodada de treinamento de dados define uma contagem de iteração. Quanto maior for a contagem, melhores serão os resultados do treino. No entanto, isso também implica que o algoritmo Elkan será chamado com mais frequência.</p>
<p>O algoritmo Elkan trata da atribuição e desalocação de memória de cada vez que é executado. Especificamente, ele aloca memória para armazenar metade do tamanho dos dados da matriz simétrica, excluindo os elementos diagonais. No Knowhere, a dimensão da matriz simétrica usada pelo algoritmo Elkan é definida como 1024, resultando em um tamanho de memória de aproximadamente 2 MB. Isto significa que, para cada ronda de treino, o Elkan aloca e desaloca repetidamente 2 MB de memória.</p>
<p>Os dados de perfil de desempenho indicaram uma atividade frequente de atribuição de memória de grande dimensão. De facto, desencadeou a alocação <a href="https://www.oreilly.com/library/view/linux-device-drivers/9781785280009/4759692f-43fb-4066-86b2-76a90f0707a2.xhtml">da área de memória virtual (VMA</a>), a alocação da página física, a configuração do mapa de páginas e a atualização das estatísticas do cgroup de memória no kernel. Este padrão de grande atividade de alocação/desalocação de memória pode, em algumas situações, também agravar a fragmentação da memória. Trata-se de um imposto significativo.</p>
<p>A estrutura <em>IndexFlatElkan</em> foi especificamente concebida e construída para suportar o algoritmo Elkan. Cada processo de treinamento de dados terá uma instância <em>IndexFlatElkan</em> inicializada. Para atenuar o impacto no desempenho resultante da frequente atribuição e desalocação de memória no algoritmo Elkan, refactorámos a lógica do código, deslocando a gestão da memória para fora da função do algoritmo Elkan, para o processo de construção do <em>IndexFlatElkan</em>. Isso permite que a alocação de memória ocorra apenas uma vez durante a fase de inicialização, enquanto atende a todas as chamadas de função do algoritmo Elkan subseqüentes do processo de treinamento de dados atual e ajuda a melhorar a latência de carga em cerca de 3%. Encontre o <a href="https://github.com/zilliztech/knowhere/pull/280">patch do Knowhere aqui</a>.</p>
<h2 id="Redis-Vector-Search-Acceleration-through-Software-Prefetch" class="common-anchor-header">Aceleração da pesquisa vetorial do Redis por meio da pré-busca de software<button data-href="#Redis-Vector-Search-Acceleration-through-Software-Prefetch" class="anchor-icon" translate="no">
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
    </button></h2><p>O Redis, um popular armazenamento tradicional de dados de valor-chave na memória, começou recentemente a oferecer suporte à pesquisa vetorial. Para ir além de um típico armazenamento de valores-chave, ele oferece módulos de extensibilidade; o módulo <a href="https://github.com/RediSearch/RediSearch">RediSearch</a> facilita o armazenamento e a pesquisa de vetores diretamente no Redis.</p>
<p>Para a pesquisa de similaridade de vectores, o Redis suporta dois algoritmos, nomeadamente força bruta e HNSW. O algoritmo HNSW é especificamente criado para localizar eficientemente os vizinhos mais próximos aproximados em espaços de alta dimensão. Utiliza uma fila de prioridades denominada <em>candidate_set</em> para gerir todos os candidatos a vectores para cálculo da distância.</p>
<p>Cada candidato a vetor inclui metadados substanciais para além dos dados do vetor. Como resultado, ao carregar um candidato da memória, ele pode causar falhas no cache de dados, o que gera atrasos no processamento. Nossa otimização introduz a pré-busca de software para carregar proativamente o próximo candidato enquanto processa o atual. Esse aprimoramento resultou em uma melhoria de 2 a 3% na taxa de transferência para pesquisas de similaridade de vetores em uma configuração Redis de instância única. O patch está em processo de upstreaming.</p>
<h2 id="GCC-Default-Behavior-Change-to-Prevent-Mixed-Assembly-Code-Penalties" class="common-anchor-header">Mudança de comportamento padrão do GCC para evitar penalidades de código de montagem misto<button data-href="#GCC-Default-Behavior-Change-to-Prevent-Mixed-Assembly-Code-Penalties" class="anchor-icon" translate="no">
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
    </button></h2><p>Para obter o máximo desempenho, as secções de código utilizadas frequentemente são escritas à mão em assembly. No entanto, quando diferentes segmentos de código são escritos por pessoas diferentes ou em momentos diferentes, as instruções usadas podem vir de conjuntos de instruções de assembly incompatíveis, como <a href="https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html">Intel® Advanced Vetor Extensions 512 (Intel® AVX-512)</a> e <a href="https://en.wikipedia.org/wiki/Streaming_SIMD_Extensions">Streaming SIMD Extensions (SSE)</a>. Se não for compilado adequadamente, o código misto resulta em uma penalidade de desempenho. <a href="https://www.intel.com/content/dam/develop/external/us/en/documents/11mc12-avoiding-2bavx-sse-2btransition-2bpenalties-2brh-2bfinal-809104.pdf">Saiba mais sobre a mistura de instruções Intel AVX e SSE aqui</a>.</p>
<p>Pode determinar facilmente se está a utilizar código assembly de modo misto e se não compilou o código com <em>VZEROUPPER</em>, incorrendo na penalização do desempenho. Isso pode ser observado através de um comando perf <em>como sudo perf stat -e 'assists.sse_avx_mix/event/event=0xc1,umask=0x10/' &lt;workload&gt;.</em> Se o seu sistema operacional não tiver suporte para o evento, use <em>cpu/event=0xc1,umask=0x10,name=assists_sse_avx_mix/</em>.</p>
<p>O compilador Clang, por padrão, insere <em>VZEROUPPER</em>, evitando qualquer penalidade de modo misto. Mas o compilador GCC só inseriu <em>o VZEROUPPER</em> quando os sinalizadores do compilador -O2 ou -O3 foram especificados. Contactámos a equipa do GCC e explicámos o problema, e agora, por predefinição, eles tratam corretamente o código de montagem de modo misto.</p>
<h2 id="Start-Optimizing-Your-Vector-Databases" class="common-anchor-header">Comece a otimizar as suas bases de dados vectoriais<button data-href="#Start-Optimizing-Your-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>As bases de dados de vectores estão a desempenhar um papel integral na GenAI e estão a crescer cada vez mais para gerar respostas de maior qualidade. No que diz respeito à otimização, as aplicações de IA não são diferentes de outras aplicações de software, na medida em que revelam os seus segredos quando se utilizam ferramentas de análise de desempenho padrão, juntamente com estruturas de benchmark e entradas de stress.</p>
<p>Utilizando estas ferramentas, descobrimos armadilhas de desempenho relacionadas com a atribuição desnecessária de memória, a não pré-busca de instruções e a utilização de opções incorrectas do compilador. Com base em nossas descobertas, fizemos melhorias no Milvus, Knowhere, Redis e no compilador GCC para ajudar a tornar a IA um pouco mais eficiente e sustentável. Os bancos de dados vetoriais são uma classe importante de aplicativos que merecem seus esforços de otimização. Esperamos que este artigo o ajude a começar.</p>
