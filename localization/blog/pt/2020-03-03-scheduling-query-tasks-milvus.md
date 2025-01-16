---
id: scheduling-query-tasks-milvus.md
title: Antecedentes
author: milvus
date: 2020-03-03T22:38:17.829Z
desc: O trabalho por detrás da cena
cover: assets.zilliz.com/eric_rothermel_Fo_KO_4_Dp_Xam_Q_unsplash_469fe12aeb.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/scheduling-query-tasks-milvus'
---
<custom-h1>Como é que o Milvus agenda as tarefas de consulta</custom-h1><p>este artigo, discutiremos como o Milvus agenda as tarefas de consulta. Também falaremos sobre problemas, soluções e orientações futuras para a implementação do agendamento do Milvus.</p>
<h2 id="Background" class="common-anchor-header">Antecedentes<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>Sabemos, a partir de Managing Data in Massive-Scale Vetor Search Engine, que a pesquisa por semelhança de vectores é implementada pela distância entre dois vectores num espaço de elevada dimensão. O objetivo da pesquisa vetorial é encontrar K vectores que estejam mais próximos do vetor alvo.</p>
<p>Há muitas formas de medir a distância vetorial, como a distância euclidiana:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_euclidean_distance_156037c939.png" alt="1-euclidean-distance.png" class="doc-image" id="1-euclidean-distance.png" />
   </span> <span class="img-wrapper"> <span>1-euclidean-distance.png</span> </span></p>
<p>onde x e y são dois vectores. n é a dimensão dos vectores.</p>
<p>Para encontrar os K vectores mais próximos num conjunto de dados, é necessário calcular a distância euclidiana entre o vetor alvo e todos os vectores do conjunto de dados a pesquisar. Em seguida, os vectores são ordenados por distância para obter os K vectores mais próximos. O trabalho computacional é diretamente proporcional à dimensão do conjunto de dados. Quanto maior for o conjunto de dados, mais trabalho computacional é necessário para uma consulta. Uma GPU, especializada no processamento de grafos, tem muitos núcleos para fornecer a potência de computação necessária. Assim, o suporte multi-GPU também é tido em consideração durante a implementação do Milvus.</p>
<h2 id="Basic-concepts" class="common-anchor-header">Conceitos básicos<button data-href="#Basic-concepts" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Data-blockTableFile" class="common-anchor-header">Bloco de dados（TableFile）</h3><p>Para melhorar o suporte à pesquisa de dados em grande escala, optimizámos o armazenamento de dados do Milvus. O Milvus divide os dados de uma tabela por tamanho em vários blocos de dados. Durante a pesquisa vetorial, o Milvus pesquisa vectores em cada bloco de dados e junta os resultados. Uma operação de pesquisa vetorial consiste em N operações de pesquisa vetorial independentes (N é o número de blocos de dados) e N-1 operações de fusão de resultados.</p>
<h3 id="Task-queueTaskTable" class="common-anchor-header">Fila de tarefas（TaskTable）</h3><p>Cada recurso tem uma matriz de tarefas, que regista as tarefas pertencentes ao recurso. Cada tarefa tem diferentes estados, incluindo Início, Carregamento, Carregado, Executando e Executado. O Carregador e o Executor num dispositivo informático partilham a mesma fila de tarefas.</p>
<h3 id="Query-scheduling" class="common-anchor-header">Programação de consultas</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_query_scheduling_5798178be2.png" alt="2-query-scheduling.png" class="doc-image" id="2-query-scheduling.png" />
   </span> <span class="img-wrapper"> <span>2-query-scheduling.png</span> </span></p>
<ol>
<li>Quando o servidor Milvus inicia, o Milvus lança o GpuResource correspondente através dos parâmetros <code translate="no">gpu_resource_config</code> no ficheiro de configuração <code translate="no">server_config.yaml</code>. DiskResource e CpuResource ainda não podem ser editados em <code translate="no">server_config.yaml</code>. GpuResource é a combinação de <code translate="no">search_resources</code> e <code translate="no">build_index_resources</code> e referido como <code translate="no">{gpu0, gpu1}</code> no exemplo a seguir:</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_sample_code_ffee1c290f.png" alt="3-sample-code.png" class="doc-image" id="3-sample-code.png" />
   </span> <span class="img-wrapper"> <span>3-sample-code.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_example_0eeb85da71.png" alt="3-example.png" class="doc-image" id="3-example.png" />
   </span> <span class="img-wrapper"> <span>3-exemplo.png</span> </span></p>
<ol start="2">
<li>O Milvus recebe um pedido. Os metadados da tabela são armazenados numa base de dados externa, que é o SQLite ou MySQl para um único anfitrião e o MySQL para um anfitrião distribuído. Depois de receber um pedido de pesquisa, o Milvus valida se a tabela existe e se a dimensão é consistente. De seguida, o Milvus lê a lista TableFile da tabela.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_milvus_reads_tablefile_list_1e9d851543.png" alt="4-milvus-reads-tablefile-list.png" class="doc-image" id="4-milvus-reads-tablefile-list.png" />
   </span> <span class="img-wrapper"> <span>4-milvus-reads-tablefile-list.png</span> </span></p>
<ol start="3">
<li>O Milvus cria uma SearchTask. Como o cálculo de cada TableFile é realizado de forma independente, o Milvus cria uma SearchTask para cada TableFile. Como unidade básica do agendamento de tarefas, uma SearchTask contém os vectores alvo, os parâmetros de pesquisa e os nomes dos ficheiros TableFile.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_table_file_list_task_creator_36262593e4.png" alt="5-table-file-list-task-creator.png" class="doc-image" id="5-table-file-list-task-creator.png" />
   </span> <span class="img-wrapper"> <span>5-table-file-list-task-creator.png</span> </span></p>
<ol start="4">
<li>Milvus escolhe um dispositivo de computação. O dispositivo em que uma SearchTask efectua o cálculo depende do tempo de <strong>conclusão estimado</strong> para cada dispositivo. O tempo estimado de <strong>conclusão</strong> especifica o intervalo estimado entre a hora atual e a hora estimada para a conclusão do cálculo.</li>
</ol>
<p>Por exemplo, quando um bloco de dados de uma SearchTask é carregado na memória da CPU, a próxima SearchTask está aguardando na fila de tarefas de computação da CPU e a fila de tarefas de computação da GPU está ociosa. O <strong>tempo de conclusão estimado</strong> para a CPU é igual à soma do custo de tempo estimado da SearchTask anterior e da SearchTask atual. O tempo de <strong>conclusão</strong> estimado para uma GPU é igual à soma do tempo para os blocos de dados serem carregados na GPU e o custo de tempo estimado da SearchTask atual. O tempo de <strong>conclusão estimado</strong> para uma SearchTask num recurso é igual ao tempo médio de execução de todas as SearchTasks no recurso. O Milvus escolhe então um dispositivo com o menor <strong>tempo de conclusão estimado</strong> e atribui a SearchTask ao dispositivo.</p>
<p>Aqui, assumimos que o <strong>tempo de conclusão estimado</strong> para a GPU1 é mais curto.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_GPU_1_shorter_estimated_completion_time_42c7639b87.png" alt="6-GPU1-shorter-estimated-completion-time.png" class="doc-image" id="6-gpu1-shorter-estimated-completion-time.png" />
   </span> <span class="img-wrapper"> <span>6-GPU1-tempo-de-conclusão-mais-curto-estimado.png</span> </span></p>
<ol start="5">
<li><p>Milvus adiciona SearchTask à fila de tarefas de DiskResource.</p></li>
<li><p>Milvus move SearchTask para a fila de tarefas de CpuResource. A thread de carregamento no CpuResource carrega cada tarefa da fila de tarefas sequencialmente. O CpuResource lê os blocos de dados correspondentes na memória da CPU.</p></li>
<li><p>Milvus move SearchTask para GpuResource. O thread de carregamento no GpuResource copia os dados da memória da CPU para a memória da GPU. GpuResource lê os blocos de dados correspondentes na memória da GPU.</p></li>
<li><p>O Milvus executa a SearchTask no GpuResource. Como o resultado de uma SearchTask é relativamente pequeno, o resultado é devolvido diretamente à memória da CPU.</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_scheduler_53f1fbbaba.png" alt="7-scheduler.png" class="doc-image" id="7-scheduler.png" />
   </span> <span class="img-wrapper"> <span>7-scheduler.png</span> </span></p>
<ol start="9">
<li>Milvus junta o resultado da SearchTask com o resultado total da pesquisa.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_milvus_merges_searchtast_result_9f3446e65a.png" alt="8-milvus-merges-searchtast-result.png" class="doc-image" id="8-milvus-merges-searchtast-result.png" />
   </span> <span class="img-wrapper"> <span>8-milvus-merge-searchtast-result.png</span> </span></p>
<p>Depois de todas as SearchTasks estarem completas, o Milvus devolve o resultado completo da pesquisa ao cliente.</p>
<h2 id="Index-building" class="common-anchor-header">Construção de índices<button data-href="#Index-building" class="anchor-icon" translate="no">
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
    </button></h2><p>A construção do índice é basicamente o mesmo que o processo de pesquisa, sem o processo de fusão. Não falaremos sobre isso em pormenor.</p>
<h2 id="Performance-optimization" class="common-anchor-header">Otimização do desempenho<button data-href="#Performance-optimization" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Cache" class="common-anchor-header">Cache</h3><p>Como mencionado anteriormente, os blocos de dados têm de ser carregados para os dispositivos de armazenamento correspondentes, como a memória da CPU ou a memória da GPU, antes do cálculo. Para evitar o carregamento repetitivo de dados, o Milvus introduz a cache LRU (Least Recently Used). Quando a cache está cheia, os novos blocos de dados afastam os blocos de dados antigos. É possível personalizar o tamanho da cache através do ficheiro de configuração com base no tamanho atual da memória. Recomenda-se a utilização de uma cache grande para armazenar dados de pesquisa, de modo a poupar tempo de carregamento de dados e melhorar o desempenho da pesquisa.</p>
<h3 id="Data-loading-and-computation-overlap" class="common-anchor-header">Sobreposição de carregamento de dados e computação</h3><p>A cache não pode satisfazer as nossas necessidades de melhor desempenho de pesquisa. Os dados têm de ser recarregados quando a memória é insuficiente ou o tamanho do conjunto de dados é demasiado grande. Precisamos de diminuir o efeito do carregamento de dados no desempenho da pesquisa. O carregamento de dados, quer seja do disco para a memória da CPU ou da memória da CPU para a memória da GPU, pertence às operações de IO e quase não necessita de qualquer trabalho computacional dos processadores. Assim, consideramos a possibilidade de efetuar o carregamento de dados e a computação em paralelo para uma melhor utilização dos recursos.</p>
<p>Dividimos a computação num bloco de dados em 3 fases (carregamento do disco para a memória da CPU, computação da CPU, fusão de resultados) ou 4 fases (carregamento do disco para a memória da CPU, carregamento da memória da CPU para a memória da GPU, computação da GPU e recuperação de resultados, e fusão de resultados). Tomando como exemplo a computação em 3 fases, podemos lançar 3 threads responsáveis pelas 3 fases para funcionar como pipelining de instruções. Como os conjuntos de resultados são, na sua maioria, pequenos, a fusão de resultados não demora muito tempo. Em alguns casos, a sobreposição do carregamento de dados e do cálculo pode reduzir o tempo de pesquisa em 1/2.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_sequential_overlapping_load_milvus_1af809b29e.png" alt="9-sequential-overlapping-load-milvus.png" class="doc-image" id="9-sequential-overlapping-load-milvus.png" />
   </span> <span class="img-wrapper"> <span>9-sequential-overlapping-load-milvus.png</span> </span></p>
<h2 id="Problems-and-solutions" class="common-anchor-header">Problemas e soluções<button data-href="#Problems-and-solutions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Different-transmission-speeds" class="common-anchor-header">Diferentes velocidades de transmissão</h3><p>Anteriormente, o Milvus utilizava a estratégia Round Robin para o agendamento de tarefas multi-GPU. Esta estratégia funcionou perfeitamente no nosso servidor de 4-GPU e o desempenho da pesquisa foi 4 vezes melhor. No entanto, para nossos hosts de 2 GPUs, o desempenho não foi 2 vezes melhor. Fizemos algumas experiências e descobrimos que a velocidade de cópia de dados para uma GPU era de 11 GB/s. No entanto, para outra GPU, era de 3 GB/s. Depois de consultarmos a documentação da placa principal, confirmámos que a placa principal estava ligada a uma GPU através de PCIe x16 e a outra GPU através de PCIe x4. Ou seja, essas GPUs têm velocidades de cópia diferentes. Mais tarde, adicionámos o tempo de cópia para medir o dispositivo ideal para cada SearchTask.</p>
<h2 id="Future-work" class="common-anchor-header">Trabalho futuro<button data-href="#Future-work" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Hardware-environment-with-increased-complexity" class="common-anchor-header">Ambiente de hardware com maior complexidade</h3><p>Em condições reais, o ambiente de hardware pode ser mais complicado. Para ambientes de hardware com várias CPUs, memória com arquitetura NUMA, NVLink e NVSwitch, a comunicação entre CPUs/GPUs traz muitas oportunidades de otimização.</p>
<p>Otimização de consultas</p>
<p>Durante a experimentação, descobrimos algumas oportunidades de melhoria de desempenho. Por exemplo, quando o servidor recebe várias consultas para a mesma tabela, as consultas podem ser mescladas sob algumas condições. Ao utilizar a localidade dos dados, podemos melhorar o desempenho. Estas optimizações serão implementadas no nosso desenvolvimento futuro. Agora já sabemos como as consultas são agendadas e executadas para o cenário de um único anfitrião e várias GPUs. Continuaremos a introduzir mais mecanismos internos para o Milvus nos próximos artigos.</p>
