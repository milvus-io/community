---
id: vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md
title: >-
  Anunciando o VDBBench 1.0: Benchmarking de banco de dados vetorial de código
  aberto com suas cargas de trabalho de produção do mundo real
author: Tian Min
date: 2025-07-04T00:00:00.000Z
desc: >-
  Descubra o VDBBench 1.0, uma ferramenta de código aberto para a avaliação
  comparativa de bases de dados vectoriais com dados do mundo real, ingestão de
  fluxo contínuo e cargas de trabalho simultâneas.
cover: assets.zilliz.com/milvus_vdb_e0e8146c90.jpeg
tag: Announcements
recommend: false
publishToMedium: true
tags: 'vector database, Milvus, vectordb benchmarking, vector search'
meta_keywords: 'VDBBench, vector database, Milvus, Zilliz Cloud, benchmarking'
meta_title: |
  VDBBench 1.0: Real-World Benchmarking for Vector Databases
origin: >-
  https://zilliz.com/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads
---
<p>A maioria dos benchmarks de banco de dados vetoriais testa com dados estáticos e índices pré-construídos. Mas os sistemas de produção não funcionam dessa forma - os dados fluem continuamente enquanto os utilizadores executam consultas, os filtros fragmentam os índices e as caraterísticas de desempenho mudam drasticamente sob cargas de leitura/escrita simultâneas.</p>
<p>Hoje estamos lançando <a href="https://github.com/zilliztech/VectorDBBench/releases/tag/v1.0.0"><strong>o VDBBench 1.0</strong></a>, um benchmark de código aberto projetado desde o início para testar bancos de dados vetoriais em condições realistas de produção: ingestão de dados de streaming, filtragem de metadados com seletividade variável e cargas de trabalho simultâneas que revelam gargalos reais do sistema.</p>
<p><a href="https://github.com/zilliztech/VectorDBBench/releases/tag/v1.0.0"><strong>Baixar VDBBench 1.0 →</strong></a> |<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> <strong>Ver Tabela de Líderes →</strong></a></p>
<h2 id="Why-Current-Benchmarks-Are-Misleading" class="common-anchor-header">Por que os benchmarks atuais são enganosos<button data-href="#Why-Current-Benchmarks-Are-Misleading" class="anchor-icon" translate="no">
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
    </button></h2><p>Sejamos honestos - há um fenómeno estranho na nossa indústria. Todos falam sobre "não jogar benchmarks", mas muitos participam exatamente desse comportamento. Desde que o mercado de bancos de dados vetoriais explodiu em 2023, temos visto vários exemplos de sistemas que "fazem benchmarks lindos", mas "falham miseravelmente" na produção, desperdiçando tempo de engenharia e prejudicando a credibilidade do projeto.</p>
<p>Nós testemunhamos essa desconexão em primeira mão. Por exemplo, o Elasticsearch apresenta velocidades de consulta de milissegundos, mas, nos bastidores, pode levar mais de 20 horas apenas para otimizar seu índice. Que sistema de produção pode tolerar esse tempo de inatividade?</p>
<p>O problema decorre de três falhas fundamentais:</p>
<ul>
<li><p><strong>Conjuntos de dados desatualizados:</strong> Muitos benchmarks ainda dependem de conjuntos de dados antigos, como o SIFT (128 dimensões), enquanto os embeddings modernos variam de 768 a 3.072 dimensões. As caraterísticas de desempenho dos sistemas que funcionam com vectores de 128D vs. 1024D+ são fundamentalmente diferentes - os padrões de acesso à memória, a eficiência dos índices e a complexidade computacional mudam drasticamente.</p></li>
<li><p><strong>Métricas de vaidade:</strong> As referências centram-se na latência média ou no pico de QPS, criando uma imagem distorcida. Um sistema com uma latência média de 10 ms mas uma latência P99 de 2 segundos cria uma experiência de utilizador terrível. O pico de rendimento medido em 30 segundos não diz nada sobre o desempenho sustentado.</p></li>
<li><p><strong>Cenários excessivamente simplificados:</strong> A maioria dos benchmarks testa fluxos de trabalho básicos de "gravação de dados, criação de índice, consulta" - essencialmente testes no nível "Hello World". A produção real envolve a ingestão contínua de dados enquanto atende a consultas, filtragem complexa de metadados que fragmenta índices e operações simultâneas de leitura/gravação competindo por recursos.</p></li>
</ul>
<h2 id="What’s-New-in-VDBBench-10" class="common-anchor-header">O que há de novo no VDBBench 1.0?<button data-href="#What’s-New-in-VDBBench-10" class="anchor-icon" translate="no">
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
    </button></h2><p>O VDBBench não se limita a repetir filosofias de benchmarking ultrapassadas - ele reconstrói o conceito a partir dos primeiros princípios com uma crença orientadora: um benchmark só é valioso se ele prevê o comportamento real da produção.</p>
<p>Projetamos o VDBBench para replicar fielmente as condições do mundo real em três dimensões críticas: <strong>autenticidade dos dados, padrões de carga de trabalho e metodologias de medição de desempenho.</strong></p>
<p>Vamos dar uma olhada mais de perto em quais novos recursos são trazidos para a mesa.</p>
<h3 id="🚀-Redesigned-Dashboard-with-Production-Relevant-Visualizations" class="common-anchor-header"><strong>Painel redesenhado com visualizações relevantes para a produção</strong></h3><p>A maioria dos benchmarks concentra-se apenas na saída de dados brutos, mas o que importa é como os engenheiros interpretam e agem com base nesses resultados. Redesenhamos a interface do usuário para priorizar a clareza e a interatividade, permitindo que você identifique lacunas de desempenho entre os sistemas e tome decisões rápidas sobre a infraestrutura.</p>
<p>O novo painel visualiza não apenas os números de desempenho, mas as relações entre eles: como o QPS se degrada sob diferentes níveis de seletividade de filtro, como a recuperação flutua durante a ingestão de streaming e como as distribuições de latência revelam as caraterísticas de estabilidade do sistema.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_1_df593dea0b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Testámos novamente as principais plataformas de bases de dados vectoriais, incluindo <strong>Milvus, Zilliz Cloud, Elastic Cloud, Qdrant Cloud, Pinecone e OpenSearch</strong> com as suas configurações mais recentes e definições recomendadas, garantindo que todos os dados de benchmark reflectem as capacidades actuais. Todos os resultados dos testes estão disponíveis no<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> VDBBench Leaderboard</a>.</p>
<h3 id="🏷️-Tag-Filtering-The-Hidden-Performance-Killer" class="common-anchor-header">🏷️ Filtragem de tags: O assassino oculto do desempenho</h3><p>As consultas no mundo real raramente acontecem de forma isolada. Os aplicativos combinam similaridade vetorial com filtragem de metadados ("encontre sapatos parecidos com esta foto, mas que custem menos de US$ 100"). Essa pesquisa vetorial filtrada cria desafios únicos que a maioria dos benchmarks ignora completamente.</p>
<p>As pesquisas filtradas introduzem complexidade em duas áreas críticas:</p>
<ul>
<li><p><strong>Complexidade do filtro</strong>: Mais campos escalares e condições lógicas complexas aumentam a demanda computacional e podem causar recuperação insuficiente e fragmentação do índice gráfico.</p></li>
<li><p><strong>Seletividade do filtro</strong>: Este é o "assassino oculto do desempenho" que verificámos repetidamente na produção. Quando as condições de filtragem se tornam altamente seletivas (filtrando mais de 99% dos dados), as velocidades de consulta podem flutuar em ordens de magnitude e a recuperação pode se tornar instável à medida que as estruturas de índice lutam com conjuntos de resultados esparsos.</p></li>
</ul>
<p>O VDBBench testa sistematicamente vários níveis de seletividade de filtragem (de 50% a 99,9%), fornecendo um perfil de desempenho abrangente sob esse padrão de produção crítico. Os resultados muitas vezes revelam grandes dificuldades de desempenho que nunca apareceriam em benchmarks tradicionais.</p>
<p><strong>Exemplo</strong>: Nos testes do Cohere 1M, o Milvus manteve uma recuperação consistentemente elevada em todos os níveis de seletividade de filtragem, ao passo que o OpenSearch apresentou um desempenho instável, com uma recuperação que flutuou significativamente sob diferentes condições de filtragem - caindo abaixo de 0,8 recuperação em muitos casos, o que é inaceitável para a maioria dos ambientes de produção.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_2_0ef89463e5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: QPS e recuperação do Milvus e do OpenSearch em diferentes níveis de seletividade de filtro (teste Cohere 1M).</em></p>
<h3 id="🌊-Streaming-ReadWrite-Beyond-Static-Index-Testing" class="common-anchor-header">Leitura/gravação em fluxo contínuo: Além do teste de índice estático</h3><p>Os sistemas de produção raramente se dão ao luxo de ter dados estáticos. Novas informações fluem continuamente enquanto as pesquisas são executadas - um cenário em que muitos bancos de dados impressionantes entram em colapso sob a pressão dupla de manter o desempenho da pesquisa enquanto lidam com gravações contínuas.</p>
<p>Os cenários de streaming do VDBBench simulam operações paralelas reais, ajudando os desenvolvedores a entender a estabilidade do sistema em ambientes de alta concorrência, particularmente como a gravação de dados afeta o desempenho da consulta e como o desempenho evolui à medida que o volume de dados aumenta.</p>
<p>Para garantir comparações justas entre sistemas diferentes, o VDBBench usa uma abordagem estruturada:</p>
<ul>
<li><p>Configurar taxas de gravação controladas que espelham as cargas de trabalho de produção alvo (por exemplo, 500 linhas/seg distribuídas em 5 processos paralelos)</p></li>
<li><p>Acionar operações de pesquisa após cada 10% de ingestão de dados, alternando entre os modos serial e simultâneo</p></li>
<li><p>Registar métricas abrangentes: distribuições de latência (incluindo P99), QPS sustentado e precisão de recuperação</p></li>
<li><p>Acompanhar a evolução do desempenho ao longo do tempo à medida que o volume de dados e o stress do sistema aumentam</p></li>
</ul>
<p>Este teste de carga controlado e incremental revela até que ponto os sistemas mantêm a estabilidade e a precisão sob ingestão contínua - algo que os benchmarks tradicionais raramente captam.</p>
<p><strong>Exemplo</strong>: Nos testes de streaming do Cohere 10M, o Pinecone manteve QPS e recall mais altos durante todo o ciclo de gravação em comparação com o Elasticsearch. Notavelmente, o desempenho do Pinecone melhorou significativamente após a conclusão da ingestão, demonstrando forte estabilidade sob carga sustentada, enquanto o Elasticsearch apresentou comportamento mais errático durante as fases de ingestão ativa.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb3_9d2a5298b0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura: QPS e recuperação de Pinecone vs. Elasticsearch no teste de streaming Cohere 10M (taxa de ingestão de 500 linhas/s).</p>
<p>O VDBBench vai ainda mais longe ao oferecer suporte a uma etapa de otimização opcional, permitindo que os usuários comparem o desempenho da pesquisa de streaming antes e depois da otimização do índice. Ele também rastreia e informa o tempo real gasto em cada etapa, oferecendo percepções mais profundas sobre a eficiência e o comportamento do sistema em condições semelhantes às de produção.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb4_0caee3b201.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: QPS e recuperação do Pinecone em comparação com o Elasticsearch no teste de streaming de 10M do Cohere após a otimização (taxa de ingestão de 500 linhas/s)</em></p>
<p>Conforme mostrado em nossos testes, o Elasticsearch superou o Pinecone em QPS após a otimização do índice. Mas quando o eixo x reflete o tempo decorrido real, fica claro que o Elasticsearch levou muito mais tempo para atingir esse desempenho. Na produção, esse atraso é importante. Essa comparação revela uma troca importante: throughput de pico vs. tempo de atendimento.</p>
<h3 id="🔬-Modern-Datasets-That-Reflect-Current-AI-Workloads" class="common-anchor-header">Conjuntos de dados modernos que refletem as cargas de trabalho de IA atuais</h3><p>Nós reformulamos completamente os conjuntos de dados usados para benchmarking de banco de dados vetorial. Em vez de conjuntos de testes herdados, como SIFT e GloVe, o VDBBench usa vetores gerados a partir de modelos de incorporação de última geração, como OpenAI e Cohere, que alimentam os aplicativos de IA atuais.</p>
<p>Para garantir a relevância, especialmente para casos de utilização como o Retrieval-Augmented Generation (RAG), selecionámos corpora que reflectem cenários reais de empresas e domínios específicos:</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Corpus</strong></td><td><strong>Modelo de incorporação</strong></td><td><strong>Dimensões</strong></td><td><strong>Tamanho</strong></td><td><strong>Caso de utilização</strong></td></tr>
<tr><td>Wikipédia</td><td>Cohere V2</td><td>768</td><td>1M / 10M</td><td>Base de conhecimentos gerais</td></tr>
<tr><td>BioASQ</td><td>Coher V3</td><td>1024</td><td>1M / 10M</td><td>Domínio específico (biomédico)</td></tr>
<tr><td>C4</td><td>OpenAI</td><td>1536</td><td>500K / 5M</td><td>Processamento de texto à escala da Web</td></tr>
<tr><td>MSMarco V2</td><td>udever-bloom-1b1</td><td>1536</td><td>1M / 10M / 138M</td><td>Pesquisa em grande escala</td></tr>
</tbody>
</table>
<p>Esses conjuntos de dados simulam melhor os dados vetoriais de alto volume e alta dimensão atuais, permitindo testes realistas de eficiência de armazenamento, desempenho de consulta e precisão de recuperação em condições que correspondem às cargas de trabalho modernas de IA.</p>
<h3 id="⚙️-Custom-Dataset-Support-for-Industry-Specific-Testing" class="common-anchor-header">⚙️ Suporte a conjuntos de dados personalizados para testes específicos do setor</h3><p>Cada negócio é único. O setor financeiro pode precisar de testes focados em embeddings de transações, enquanto as plataformas sociais se preocupam mais com os vetores de comportamento do usuário. O VDBBench permite que você faça benchmark com seus próprios dados gerados a partir de seus modelos de incorporação específicos para suas cargas de trabalho específicas.</p>
<p>É possível personalizar:</p>
<ul>
<li><p>Dimensões do vetor e tipos de dados</p></li>
<li><p>Esquema de metadados e padrões de filtragem</p></li>
<li><p>Volume de dados e padrões de ingestão</p></li>
<li><p>Distribuições de consultas que correspondem ao seu tráfego de produção</p></li>
</ul>
<p>Afinal de contas, nenhum conjunto de dados conta uma história melhor do que seus próprios dados de produção.</p>
<h2 id="How-VDBBench-Measures-What-Actually-Matters-in-Production" class="common-anchor-header">Como o VDBBench mede o que realmente importa na produção<button data-href="#How-VDBBench-Measures-What-Actually-Matters-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Production-Focused-Metric-Design" class="common-anchor-header">Design de métricas focado na produção</h3><p>O VDBBench prioriza métricas que refletem o desempenho no mundo real, não apenas resultados de laboratório. Nós redesenhamos o benchmarking em torno do que realmente importa em ambientes de produção: <strong>confiabilidade sob carga, caraterísticas de latência de cauda, taxa de transferência sustentada e preservação da precisão.</strong></p>
<ul>
<li><p><strong>Latência P95/P99 para uma experiência real do utilizador</strong>: A latência média/mediana mascara os outliers que frustram os usuários reais e podem indicar a instabilidade subjacente do sistema. O VDBBench se concentra na latência de cauda como P95/P99, revelando o desempenho que 95% ou 99% de suas consultas realmente alcançarão. Isso é crucial para o planejamento de SLA e para entender a pior experiência do usuário.</p></li>
<li><p><strong>Taxa de transferência sustentável sob carga</strong>: Um sistema que funciona bem por 5 segundos não é suficiente para a produção. O VDBBench aumenta gradualmente a concorrência para encontrar o máximo de consultas sustentáveis por segundo do seu banco de dados (<code translate="no">max_qps</code>) - não o número de pico sob condições curtas e ideais. Esta metodologia revela o quão bem o seu sistema se mantém ao longo do tempo e ajuda no planeamento realista da capacidade.</p></li>
<li><p><strong>Recuperação equilibrada com desempenho</strong>: Velocidade sem precisão não tem sentido. Cada número de desempenho no VDBBench é emparelhado com medições de recall, para que você saiba exatamente quanta relevância você está trocando por taxa de transferência. Isso permite comparações justas entre sistemas com trocas internas muito diferentes.</p></li>
</ul>
<h3 id="Test-Methodology-That-Reflects-Reality" class="common-anchor-header">Metodologia de teste que reflete a realidade</h3><p>Uma inovação chave no projeto do VDBBench é a separação de testes seriais e simultâneos, que ajuda a capturar como os sistemas se comportam sob diferentes tipos de carga e revela caraterísticas de desempenho que importam para diferentes casos de uso.</p>
<p><strong>Separação da medição de latência:</strong></p>
<ul>
<li><p><code translate="no">serial_latency_p99</code> mede o desempenho do sistema sob carga mínima, em que apenas um pedido é processado de cada vez. Isto representa o melhor cenário possível para a latência e ajuda a identificar as capacidades de base do sistema.</p></li>
<li><p><code translate="no">conc_latency_p99</code> captura o comportamento do sistema em condições realistas de alta simultaneidade, em que vários pedidos chegam simultaneamente e competem pelos recursos do sistema.</p></li>
</ul>
<p><strong>Estrutura de benchmark em duas fases</strong>:</p>
<ol>
<li><p><strong>Teste em série</strong>: Execução de um único processo de 1.000 consultas que estabelece o desempenho e a precisão da linha de base, relatando <code translate="no">serial_latency_p99</code> e recall. Esta fase ajuda a identificar o limite teórico de desempenho.</p></li>
<li><p><strong>Teste de simultaneidade</strong>: Simula o ambiente de produção sob carga sustentada com várias inovações importantes:</p>
<ul>
<li><p><strong>Simulação realista do cliente</strong>: Cada processo de teste funciona de forma independente com a sua própria ligação e conjunto de consultas, evitando interferências de estado partilhado que poderiam distorcer os resultados</p></li>
<li><p><strong>Início sincronizado</strong>: Todos os processos iniciam simultaneamente, garantindo que o QPS medido reflita com precisão os níveis de simultaneidade reivindicados</p></li>
<li><p><strong>Conjuntos de consultas independentes</strong>: Evita taxas de acerto de cache irrealistas que não refletem a diversidade de consultas de produção</p></li>
</ul></li>
</ol>
<p>Esses métodos cuidadosamente estruturados garantem que os valores <code translate="no">max_qps</code> e <code translate="no">conc_latency_p99</code> relatados pelo VDBBench sejam precisos e relevantes para a produção, fornecendo informações significativas para o planejamento da capacidade de produção e o design do sistema.</p>
<h2 id="Getting-Started-with-VDBBench-10" class="common-anchor-header">Primeiros passos com o VDBBench 1.0<button data-href="#Getting-Started-with-VDBBench-10" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>O VDBBench 1.0</strong> representa uma mudança fundamental em direção ao benchmarking relevante para a produção. Ao abranger a gravação contínua de dados, a filtragem de metadados com seletividade variável e as cargas de streaming sob padrões de acesso simultâneos, ele fornece a aproximação mais próxima dos ambientes de produção reais disponíveis atualmente.</p>
<p>A diferença entre os resultados de benchmark e o desempenho no mundo real não deve ser um jogo de adivinhação. Se estiver a planear implementar uma base de dados vetorial na produção, vale a pena compreender o seu desempenho para além dos testes de laboratório idealizados. O VDBBench é de código aberto, transparente e foi projetado para oferecer suporte a comparações significativas e de igual para igual.</p>
<p>Não se deixe influenciar por números impressionantes que não se traduzem em valor de produção. <strong>Use o VDBBench 1.0 para testar cenários importantes para sua empresa, com seus dados, em condições que reflitam sua carga de trabalho real.</strong> A era dos benchmarks enganosos na avaliação de bancos de dados vetoriais está acabando - é hora de tomar decisões baseadas em dados relevantes para a produção.</p>
<p><strong>Experimente o VDBBench com suas próprias cargas de trabalho:</strong><a href="https://github.com/zilliztech/VectorDBBench"> https://github.com/zilliztech/VectorDBBench</a></p>
<p><strong>Veja os resultados dos testes dos principais bancos de dados vetoriais:</strong><a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> Tabela de classificação do VDBBench</a></p>
<p>Tem dúvidas ou deseja compartilhar seus resultados? Participe da conversa no<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a> ou conecte-se com nossa comunidade no<a href="https://discord.com/invite/FG6hMJStWu"> Discord</a>.</p>
