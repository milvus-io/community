---
id: benchmarks-lie-vector-dbs-deserve-a-real-test.md
title: Os parâmetros de referência mentem - as BD vectoriais merecem um teste real
author: Min Tian
date: 2025-05-14T00:00:00.000Z
desc: >-
  Descubra a lacuna de desempenho em bancos de dados vetoriais com o VDBBench. A
  nossa ferramenta testa em cenários de produção reais, garantindo que as suas
  aplicações de IA funcionam sem problemas e sem tempo de inatividade
  inesperado.
cover: >-
  assets.zilliz.com/Benchmarks_Lie_Vector_D_Bs_Deserve_a_Real_Test_9280c66efc.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Vector database, vectordbbench, vector database benchmark, vector search
  performance
meta_title: |
  Benchmarks Lie — Vector DBs Deserve a Real Test
origin: 'https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md'
---
<h2 id="The-Vector-Database-You-Chose-Based-on-Benchmarks-Might-Fail-in-Production" class="common-anchor-header">A base de dados de vectores que escolheu com base em parâmetros de referência pode falhar na produção<button data-href="#The-Vector-Database-You-Chose-Based-on-Benchmarks-Might-Fail-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Ao selecionar uma <a href="https://milvus.io/blog/what-is-a-vector-database.md">base de dados de vectores</a> para a sua aplicação de IA, os benchmarks convencionais são como testar um carro desportivo numa pista vazia, apenas para descobrir que bloqueia no trânsito da hora de ponta. A verdade incómoda? A maioria dos benchmarks apenas avalia o desempenho em condições artificiais que nunca existem em ambientes de produção.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Benchmarks_Lie_Vector_D_Bs_Deserve_a_Real_Test_9280c66efc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A maioria dos benchmarks testa bases de dados vectoriais <strong>depois de</strong> todos os dados terem sido ingeridos e o índice estar totalmente construído. Mas na produção, os dados nunca param de fluir. Não é possível pausar o sistema por horas apenas para reconstruir um índice.</p>
<p>Vimos a desconexão em primeira mão. Por exemplo, o Elasticsearch pode se gabar de ter velocidades de consulta de milissegundos, mas, nos bastidores, vimos ele levar <strong>mais de 20 horas</strong> apenas para otimizar seu índice. Esse é um tempo de inatividade que nenhum sistema de produção pode pagar, especialmente em cargas de trabalho de IA que exigem atualizações contínuas e respostas instantâneas.</p>
<p>Na Milvus, depois de executar inúmeras avaliações de Prova de Conceito (PoC) com clientes corporativos, descobrimos um padrão preocupante: <strong>bancos de dados vetoriais que se destacam em ambientes de laboratório controlados frequentemente têm dificuldades sob cargas de produção reais.</strong> Essa lacuna crítica não frustra apenas os engenheiros de infraestrutura - ela pode inviabilizar iniciativas inteiras de IA criadas com base nessas promessas enganosas de desempenho.</p>
<p>É por isso que criamos <a href="https://github.com/zilliztech/VectorDBBench">o VDBBench</a>: um benchmark de código aberto projetado desde o início para simular a realidade da produção. Ao contrário dos testes sintéticos que selecionam cenários, o VDBBench faz com que os bancos de dados passem por ingestão contínua, condições de filtragem rigorosas e diversos cenários, exatamente como suas cargas de trabalho de produção reais. Nossa missão é simples: fornecer aos engenheiros uma ferramenta que mostre como os bancos de dados vetoriais realmente funcionam em condições reais, para que você possa tomar decisões de infraestrutura com base em números confiáveis.</p>
<h2 id="The-Gap-between-Benchmarks-and-Reality" class="common-anchor-header">A lacuna entre benchmarks e realidade<button data-href="#The-Gap-between-Benchmarks-and-Reality" class="anchor-icon" translate="no">
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
    </button></h2><p>As abordagens tradicionais de benchmarking sofrem de três falhas críticas que tornam seus resultados praticamente sem sentido para a tomada de decisões de produção:</p>
<h3 id="1-Outdated-Data" class="common-anchor-header">1. Dados desactualizados</h3><p>Muitos benchmarks ainda se baseiam em conjuntos de dados desatualizados, como SIFT ou<a href="https://zilliz.com/glossary/glove"> GloVe</a>, que têm pouca semelhança com as atuais incorporações vetoriais complexas e de alta dimensão geradas por modelos de IA. Considere o seguinte: O SIFT contém vectores de 128 dimensões, enquanto os populares embeddings dos modelos de embedding da OpenAI variam entre 768 e 3072 dimensões.</p>
<h3 id="2-Vanity-Metrics" class="common-anchor-header">2. Métricas de vaidade</h3><p>Muitos benchmarks se concentram apenas na latência média ou no pico de QPS, o que cria uma imagem distorcida. Estas métricas idealizadas não conseguem capturar os outliers e as inconsistências que os utilizadores reais experimentam em ambientes de produção. Por exemplo, de que serve um número impressionante de QPS se este requer recursos computacionais ilimitados que levariam a sua organização à falência?</p>
<h3 id="3-Oversimplified-Scenarios" class="common-anchor-header">3. Cenários demasiado simplificados</h3><p>A maioria dos benchmarks testa apenas cargas de trabalho básicas e estáticas - essencialmente o "Hello World" da pesquisa vetorial. Por exemplo, emitem pedidos de pesquisa apenas depois de todo o conjunto de dados ter sido ingerido e indexado, ignorando a realidade dinâmica em que os utilizadores pesquisam enquanto chegam novos dados. Esta conceção simplista ignora os padrões complexos que definem os sistemas de produção reais, tais como consultas simultâneas, pesquisas filtradas e ingestão contínua de dados.</p>
<p>Reconhecendo essas falhas, percebemos que a indústria precisava de uma <strong>mudança radical na filosofia de benchmarking - uma</strong>baseada em como os sistemas de IA realmente se comportam na natureza. É por isso que criamos <a href="https://github.com/zilliztech/VectorDBBench">o VDBBench</a>.</p>
<h2 id="From-Lab-to-Production-How-VDBBench-Bridges-the-Gap" class="common-anchor-header">Do laboratório à produção: Como o VDBBench preenche a lacuna<button data-href="#From-Lab-to-Production-How-VDBBench-Bridges-the-Gap" class="anchor-icon" translate="no">
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
    </button></h2><p>O VDBBench não se limita a iterar filosofias de benchmarking desatualizadas - ele reconstrói o conceito a partir dos primeiros princípios com uma crença orientadora: <strong>um benchmark só é valioso se prever o comportamento real da produção</strong>.</p>
<p>Projetamos o VDBBench para replicar fielmente as condições do mundo real em três dimensões críticas: autenticidade dos dados, padrões de carga de trabalho e medição de desempenho.</p>
<h3 id="Modernizing-the-Dataset" class="common-anchor-header">Modernizando o conjunto de dados</h3><p>Nós reformulamos completamente os conjuntos de dados usados para o benchmarking do vectorDB. Em vez de conjuntos de teste herdados como SIFT e GloVe, o VDBBench usa vetores gerados a partir de modelos de incorporação de última geração que alimentam os aplicativos de IA atuais.</p>
<p>Para garantir a relevância, especialmente para casos de utilização como o Retrieval-Augmented Generation (RAG), selecionámos corpora que reflectem cenários reais de empresas e domínios específicos. Estes vão desde bases de conhecimento de uso geral a aplicações verticais como a resposta a perguntas biomédicas e a pesquisa na Web em grande escala.</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Corpus</strong></td><td><strong>Modelo de incorporação</strong></td><td><strong>Dimensões</strong></td><td><strong>Tamanho</strong></td></tr>
<tr><td>Wikipédia</td><td>Cohere V2</td><td>768</td><td>1M / 10M</td></tr>
<tr><td>BioASQ</td><td>Cobre V3</td><td>1024</td><td>1M / 10M</td></tr>
<tr><td>C4</td><td>OpenAI</td><td>1536</td><td>500K / 5M</td></tr>
<tr><td>MSMarco V2</td><td>udever-bloom-1b1</td><td>1536</td><td>1M / 10M / 138M</td></tr>
</tbody>
</table>
<p>Tabela: Conjuntos de dados usados no VDBBench</p>
<p>O VDBBench também oferece suporte a conjuntos de dados personalizados, permitindo que você faça benchmark com seus próprios dados gerados a partir de seus modelos de incorporação específicos para suas cargas de trabalho específicas. Afinal de contas, nenhum conjunto de dados conta uma história melhor do que seus próprios dados de produção.</p>
<h3 id="Production-Focused-Metric-Design" class="common-anchor-header">Design de métricas com foco na produção</h3><p><strong>O VDBBench prioriza métricas que refletem o desempenho no mundo real, não apenas resultados de laboratório.</strong> Redesenhamos o benchmarking em torno do que realmente importa em ambientes de produção: confiabilidade sob carga, latência de cauda, taxa de transferência sustentada e precisão.</p>
<ul>
<li><p><strong>Latência P95/P99 para medir a experiência real do utilizador</strong>: A latência média/mediana mascara os outliers que frustram os utilizadores reais. É por isso que o VDBBench se concentra na latência de cauda, como P95/P99, revelando o desempenho que 95% ou 99% das suas consultas realmente alcançarão.</p></li>
<li><p><strong>Taxa de transferência sustentável sob carga:</strong> Um sistema que funciona bem por 5 segundos não é suficiente para a produção. O VDBBench aumenta gradualmente a concorrência para encontrar o máximo de consultas sustentáveis por segundo do seu banco de dados (<code translate="no">max_qps</code>) - não o número de pico em condições curtas e ideais. Isso mostra o quão bem seu sistema se mantém ao longo do tempo.</p></li>
<li><p><strong>Recall equilibrado com desempenho:</strong> Velocidade sem precisão não tem sentido. Cada número de desempenho no VDBBench é emparelhado com o recall, para que você saiba exatamente quanta relevância você está trocando por throughput. Isso permite comparações justas entre sistemas com trocas internas muito diferentes.</p></li>
</ul>
<h3 id="Test-Methodology-That-Reflects-Reality" class="common-anchor-header">Metodologia de teste que reflete a realidade</h3><p>Uma inovação chave no projeto do VDBBench é a <strong>separação de testes seriais e simultâneos</strong>, o que ajuda a capturar como os sistemas se comportam sob diferentes tipos de carga. Por exemplo, as métricas de latência são divididas da seguinte forma:</p>
<ul>
<li><p><code translate="no">serial_latency_p99</code> mede o desempenho do sistema sob carga mínima, onde apenas uma solicitação é processada por vez. Isto representa o <em>melhor cenário</em> para a latência.</p></li>
<li><p><code translate="no">conc_latency_p99</code> captura o comportamento do sistema em <em>condições realistas de alta simultaneidade</em>, em que vários pedidos chegam simultaneamente.</p></li>
</ul>
<h3 id="Two-Benchmark-Phases" class="common-anchor-header">Duas fases de benchmark</h3><p>O VDBBench separa os testes em duas fases cruciais:</p>
<ol>
<li><strong>Teste serial</strong></li>
</ol>
<p>Esta é uma execução de processo único de 1.000 consultas. Esta fase estabelece uma linha de base para o desempenho e a precisão ideais, relatando <code translate="no">serial_latency_p99</code> e recall.</p>
<ol start="2">
<li><strong>Teste de simultaneidade</strong></li>
</ol>
<p>Esta fase simula um ambiente de produção sob carga sustentada.</p>
<ul>
<li><p><strong>Simulação realista do cliente</strong>: Cada processo de teste opera de forma independente com sua própria conexão e conjunto de consultas. Isso evita a interferência de estado compartilhado (por exemplo, cache) que poderia distorcer os resultados.</p></li>
<li><p><strong>Início sincronizado</strong>: Todos os processos começam simultaneamente, garantindo que o QPS medido reflita com precisão o nível de simultaneidade reivindicado.</p></li>
</ul>
<p>Esses métodos cuidadosamente estruturados garantem que os valores <code translate="no">max_qps</code> e <code translate="no">conc_latency_p99</code> relatados pelo VDBBench sejam <strong>precisos e relevantes para a produção</strong>, fornecendo informações significativas para o planejamento da capacidade de produção e o design do sistema.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Latency_of_Milvus_16c64g_standalone_at_Varying_Concurrency_Levels_Cohere_1_M_Test_7f2294e87a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: QPS e latência do Milvus-16c64g-standalone em diferentes níveis de simultaneidade (teste Cohere 1M). Nesse teste, o Milvus é inicialmente subutilizado - até o</em> <strong><em>nível de simultaneidade 20</em></strong><em>, o aumento da simultaneidade melhora a utilização do sistema e resulta em QPS mais alto. Para além da</em> <strong><em>concorrência 20</em></strong><em>, o sistema atinge a carga total: aumentos adicionais na concorrência já não melhoram a taxa de transferência e a latência aumenta devido a atrasos nas filas.</em></p>
<h2 id="Beyond-Searching-Static-Data-The-Real-Production-Scenarios" class="common-anchor-header">Para além da pesquisa de dados estáticos: Os cenários reais de produção<button data-href="#Beyond-Searching-Static-Data-The-Real-Production-Scenarios" class="anchor-icon" translate="no">
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
    </button></h2><p>Até onde sabemos, o VDBBench é a única ferramenta de benchmark que testa bancos de dados vetoriais em todo o espetro de cenários críticos de produção, incluindo casos de coleta estática, filtragem e streaming.</p>
<h3 id="Static-Collection" class="common-anchor-header">Coleta estática</h3><p>Ao contrário de outros benchmarks que se apressam em testar, o VDBBench primeiro garante que cada banco de dados tenha otimizado totalmente seus índices - um pré-requisito crítico de produção que muitos benchmarks frequentemente negligenciam. Isso lhe dá uma visão completa:</p>
<ul>
<li><p>Tempo de ingestão de dados</p></li>
<li><p>Tempo de indexação (o tempo usado para construir um índice otimizado, que afeta drasticamente o desempenho da pesquisa)</p></li>
<li><p>Desempenho da pesquisa em índices totalmente optimizados em condições de série e simultâneas</p></li>
</ul>
<h3 id="Filtering" class="common-anchor-header">Filtragem</h3><p>A pesquisa vetorial em produção raramente acontece de forma isolada. As aplicações reais combinam a semelhança de vectores com a filtragem de metadados ("encontrar sapatos parecidos com esta fotografia mas que custem menos de 100 dólares"). Esta pesquisa vetorial filtrada cria desafios únicos:</p>
<ul>
<li><p><strong>Complexidade do filtro</strong>: Mais colunas escalares e condições lógicas aumentam as exigências computacionais</p></li>
<li><p><strong>Seletividade do filtro</strong>: <a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Nossa experiência de produção</a> revela que este é o assassino oculto do desempenho - as velocidades de consulta podem flutuar por ordens de magnitude, dependendo de como os filtros são seletivos</p></li>
</ul>
<p>O VDBBench avalia sistematicamente o desempenho do filtro em diferentes níveis de seletividade (de 50% a 99,9%), fornecendo um perfil abrangente de como os bancos de dados lidam com esse padrão crítico de produção.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Recall_of_Milvus_and_Open_Search_Across_Different_Filter_Selectivity_Levels_Cohere_1_M_Test_4b5df2244d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: QPS e Recall de Milvus e OpenSearch em diferentes níveis de seletividade de filtro (teste Cohere 1M). O eixo X representa a percentagem de dados filtrados. Como se pode ver, o Milvus mantém uma recuperação consistentemente elevada em todos os níveis de seletividade do filtro, enquanto o OpenSearch apresenta um desempenho instável, com uma recuperação que flutua significativamente em diferentes condições de filtragem.</em></p>
<h3 id="Streaming" class="common-anchor-header">Fluxo contínuo</h3><p>Os sistemas de produção raramente se dão ao luxo de ter dados estáticos. Novas informações fluem continuamente enquanto as pesquisas são executadas - um cenário onde muitos bancos de dados impressionantes entram em colapso.</p>
<p>O caso de teste de streaming exclusivo do VDBBench examina o desempenho da pesquisa durante a inserção, medindo:</p>
<ol>
<li><p><strong>Impacto do aumento do volume de dados</strong>: Como o desempenho da pesquisa é dimensionado com o aumento do tamanho dos dados.</p></li>
<li><p><strong>Impacto da carga de gravação</strong>: como as gravações simultâneas afetam a latência e a taxa de transferência da pesquisa, já que a gravação também consome recursos de CPU ou memória no sistema.</p></li>
</ol>
<p>Os cenários de streaming representam um teste de stress abrangente para qualquer base de dados vetorial. Mas construir um benchmark <em>justo</em> para isso não é trivial. Não é suficiente descrever como um sistema se comporta - precisamos de um modelo de avaliação consistente que permita <strong>comparações</strong> entre diferentes bases de dados.</p>
<p>Com base em nossa experiência em ajudar empresas com implantações no mundo real, criamos uma abordagem estruturada e repetível. Com o VDBBench:</p>
<ul>
<li><p>Você <strong>define uma taxa de inserção fixa</strong> que espelha sua carga de trabalho de produção alvo.</p></li>
<li><p>Em seguida, o VDBBench aplica <strong>uma pressão de carga idêntica</strong> em todos os sistemas, garantindo que os resultados de desempenho sejam diretamente comparáveis.</p></li>
</ul>
<p>Por exemplo, com um conjunto de dados Cohere 10M e uma meta de ingestão de 500 linhas/segundo:</p>
<ul>
<li><p>O VDBBench ativa 5 processos produtores paralelos, cada um inserindo 100 linhas por segundo.</p></li>
<li><p>Após cada 10% dos dados serem ingeridos, o VDBBench aciona uma rodada de testes de pesquisa em condições seriais e simultâneas.</p></li>
<li><p>Métricas como latência, QPS e recall são registradas após cada estágio.</p></li>
</ul>
<p>Essa metodologia controlada revela como o desempenho de cada sistema evolui ao longo do tempo e sob estresse operacional real - dando a você a perceção necessária para tomar decisões de infraestrutura em escala.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/igure_QPS_and_Recall_of_Pinecone_vs_Elasticsearch_in_the_Cohere_10_M_Streaming_Test_500_rows_s_Ingestion_Rate_548fc02f24.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: QPS e recuperação do Pinecone em comparação com o Elasticsearch no teste de streaming Cohere 10M (taxa de ingestão de 500 linhas/s). O Pinecone manteve QPS e recuperação mais altos, mostrando uma melhoria significativa de QPS após a inserção de 100% dos dados.</em></p>
<p>Mas este não é o fim da história. O VDBBench vai ainda mais longe ao oferecer suporte a uma etapa de otimização opcional, permitindo que os usuários comparem o desempenho da pesquisa de streaming antes e depois da otimização do índice. Ele também rastreia e relata o tempo real gasto em cada etapa, oferecendo informações mais detalhadas sobre a eficiência e o comportamento do sistema em condições semelhantes às de produção.</p>
<p><span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Recall_of_Pinecone_vs_Elasticsearch_in_the_Cohere_10_M_Streaming_Test_After_Optimization_500_rows_s_Ingestion_Rate_d249d290bb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: QPS e recuperação do Pinecone em comparação com o Elasticsearch no teste de streaming de 10M do Cohere após a otimização (taxa de ingestão de 500 linhas/s)</em></p>
<p>Conforme mostrado no diagrama, o ElasticSearch superou o Pinecone em QPS após a otimização do índice. Um milagre? Não é bem assim. O gráfico à direita conta a história completa: quando o eixo x reflete o tempo decorrido real, fica claro que o ElasticSearch levou muito mais tempo para atingir esse desempenho. E, na produção, esse atraso é importante. Essa comparação revela uma troca importante: taxa de transferência de pico vs. tempo de atendimento.</p>
<h2 id="Choose-Your-Vector-Database-with-Confidence" class="common-anchor-header">Escolha seu banco de dados vetorial com confiança<button data-href="#Choose-Your-Vector-Database-with-Confidence" class="anchor-icon" translate="no">
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
    </button></h2><p>A diferença entre os resultados de benchmark e o desempenho no mundo real não deve ser um jogo de adivinhação. O VDBBench fornece uma maneira de avaliar bancos de dados vetoriais em condições realistas, semelhantes às de produção, incluindo ingestão contínua de dados, filtragem de metadados e cargas de trabalho de streaming.</p>
<p>Se você está planejando implantar um banco de dados vetorial na produção, vale a pena entender como ele funciona além dos testes de laboratório idealizados. O VDBBench é de código aberto, transparente e foi projetado para oferecer suporte a comparações significativas e homogêneas.</p>
<p>Experimente o VDBBench com suas próprias cargas de trabalho hoje mesmo e veja como os diferentes sistemas se comportam na prática: <a href="https://github.com/zilliztech/VectorDBBench">https://github.com/zilliztech/VectorDBBench.</a></p>
<p>Tem dúvidas ou deseja compartilhar seus resultados? Participe da conversa no<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a> ou conecte-se com nossa comunidade no <a href="https://discord.com/invite/FG6hMJStWu">Discord</a>. Gostaríamos muito de ouvir suas opiniões.</p>
