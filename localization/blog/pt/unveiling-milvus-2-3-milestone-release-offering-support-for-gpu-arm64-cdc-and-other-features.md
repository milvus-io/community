---
id: >-
  unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md
title: >-
  Revelando o Milvus 2.3: uma versão histórica que oferece suporte para GPU,
  Arm64, CDC e muitos outros recursos altamente esperados
author: 'Owen Jiao, Fendy Feng'
date: 2023-08-28T00:00:00.000Z
desc: >-
  O Milvus 2.3 é uma versão histórica com vários recursos altamente esperados,
  incluindo suporte para GPU, Arm64, upsert, captura de dados de alteração,
  índice ScaNN e pesquisa de intervalo. Também introduz um melhor desempenho de
  consulta, balanceamento de carga e agendamento mais robustos, e melhor
  observabilidade e operabilidade.
cover: assets.zilliz.com/Milvus_2_3_Milvus_io_2e3b0eb55c.jpeg
tag: News
tags: >-
  Vector Database, AI, Artificial Intelligence, Machine Learning, Milvus, LLM,
  Large Language Models, Embeddings, Vector search, Vector similarity search
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_2_3_Milvus_io_2e3b0eb55c.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Notícias empolgantes! Depois de oito meses de esforços concertados, temos o prazer de anunciar o lançamento do Milvus 2.3, uma versão histórica que traz inúmeras funcionalidades altamente antecipadas, incluindo suporte para GPU, Arm64, upsert, captura de dados de alteração, índice ScaNN e tecnologia MMap. O Milvus 2.3 também apresenta melhor desempenho de consulta, balanceamento de carga e agendamento mais robustos, além de melhor observabilidade e operabilidade.</p>
<p>Junte-se a mim para analisar estas novas funcionalidades e melhorias e saiba como pode beneficiar desta versão.</p>
<h2 id="Support-for-GPU-index-that-leads-to-3-10-times-faster-in-QPS" class="common-anchor-header">Suporte para índice GPU que leva a 3-10 vezes mais rápido em QPS<button data-href="#Support-for-GPU-index-that-leads-to-3-10-times-faster-in-QPS" class="anchor-icon" translate="no">
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
    </button></h2><p>O índice GPU é uma funcionalidade muito aguardada pela comunidade Milvus. Graças a uma grande colaboração com os engenheiros da Nvidia, o Milvus 2.3 suportou a indexação GPU com o robusto algoritmo RAFT adicionado ao Knowhere, o motor de indexação do Milvus. Com o suporte a GPU, o Milvus 2.3 é mais de três vezes mais rápido em QPS do que as versões anteriores que usam o índice HNSW da CPU e quase dez vezes mais rápido para conjuntos de dados específicos que exigem computação pesada.</p>
<h2 id="Arm64-support-to-accommodate-growing-user-demand" class="common-anchor-header">Suporte Arm64 para acomodar a crescente procura dos utilizadores<button data-href="#Arm64-support-to-accommodate-growing-user-demand" class="anchor-icon" translate="no">
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
    </button></h2><p>As CPUs Arm estão a tornar-se cada vez mais populares entre os fornecedores e os programadores de nuvens. Para atender a essa demanda crescente, o Milvus agora fornece imagens Docker para a arquitetura ARM64. Com este novo suporte de CPU, os utilizadores de MacOS podem construir as suas aplicações com o Milvus de forma mais simples.</p>
<h2 id="Upsert-support-for-better-user-experience" class="common-anchor-header">Suporte Upsert para uma melhor experiência do utilizador<button data-href="#Upsert-support-for-better-user-experience" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus 2.3 introduz uma melhoria notável ao suportar a operação upsert. Esta nova funcionalidade permite aos utilizadores atualizar ou inserir dados sem problemas e permite-lhes realizar ambas as operações num único pedido através da interface Upsert. Esta funcionalidade simplifica a gestão de dados e traz eficiência para a mesa.</p>
<p><strong>Nota</strong>:</p>
<ul>
<li>A funcionalidade de upsert não se aplica a IDs de incremento automático.</li>
<li>Upsert é implementado como uma combinação de <code translate="no">delete</code> e <code translate="no">insert</code>, o que pode resultar em alguma perda de desempenho. Recomendamos a utilização de <code translate="no">insert</code> se utilizar o Milvus em cenários de escrita intensa.</li>
</ul>
<h2 id="Range-search-for-more-accurate-results" class="common-anchor-header">Pesquisa por intervalo para resultados mais precisos<button data-href="#Range-search-for-more-accurate-results" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus 2.3 permite aos utilizadores especificar a distância entre o vetor de entrada e os vectores armazenados no Milvus durante uma consulta. Milvus então retorna todos os resultados correspondentes dentro do intervalo definido. Abaixo está um exemplo de especificação da distância de pesquisa usando o recurso de pesquisa de intervalo.</p>
<pre><code translate="no"><span class="hljs-comment">// add radius and range_filter to params in search_params</span>
search_params = {<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>, <span class="hljs-string">&quot;radius&quot;</span>: <span class="hljs-number">10</span>, <span class="hljs-string">&quot;range_filter&quot;</span> : <span class="hljs-number">20</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>}
res = collection.<span class="hljs-title function_">search</span>(
vectors, <span class="hljs-string">&quot;float_vector&quot;</span>, search_params, topK,
<span class="hljs-string">&quot;int64 &gt; 100&quot;</span>, output_fields=[<span class="hljs-string">&quot;int64&quot;</span>, <span class="hljs-string">&quot;float&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>Neste exemplo, o utilizador requer que o Milvus devolva vectores a uma distância de 10 a 20 unidades do vetor de entrada.</p>
<p><strong>Nota</strong>: As diferentes métricas de distância variam na forma como calculam as distâncias, resultando em intervalos de valores e estratégias de ordenação distintos. Por conseguinte, é essencial compreender as suas caraterísticas antes de utilizar a funcionalidade de pesquisa de intervalos.</p>
<h2 id="ScaNN-index-for-faster-query-speed" class="common-anchor-header">Índice ScaNN para maior velocidade de consulta<button data-href="#ScaNN-index-for-faster-query-speed" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus 2.3 agora suporta o índice ScaNN, um índice de <a href="https://zilliz.com/glossary/anns">vizinho mais próximo aproximado (ANN) de</a> código aberto desenvolvido pelo Google. O índice ScaNN demonstrou um desempenho superior em vários benchmarks, superando o HNSW em cerca de 20% e sendo aproximadamente sete vezes mais rápido que o IVFFlat. Com o suporte para o índice ScaNN, o Milvus atinge uma velocidade de consulta muito mais rápida em comparação com versões anteriores.</p>
<h2 id="Growing-index-for-stable-and-better-query-performance" class="common-anchor-header">Índice crescente para um desempenho de consulta estável e melhor<button data-href="#Growing-index-for-stable-and-better-query-performance" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus inclui duas categorias de dados: dados indexados e dados em fluxo contínuo. O Milvus pode usar índices para pesquisar rapidamente dados indexados, mas só pode pesquisar brutalmente dados de streaming linha a linha, o que pode afetar o desempenho. O Milvus 2.3 introduz o Growing Index, que cria automaticamente índices em tempo real para dados de fluxo contínuo para melhorar o desempenho da consulta.</p>
<h2 id="Iterator-for-data-retrieval-in-batches" class="common-anchor-header">Iterador para recuperação de dados em lotes<button data-href="#Iterator-for-data-retrieval-in-batches" class="anchor-icon" translate="no">
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
    </button></h2><p>No Milvus 2.3, a Pymilvus introduziu uma interface iteradora que permite aos utilizadores recuperar mais de 16.384 entidades numa pesquisa ou numa pesquisa de intervalo. Esta funcionalidade é útil quando os utilizadores necessitam de exportar dezenas de milhares ou mesmo mais vectores em lotes.</p>
<h2 id="Support-for-MMap-for-increased-capacity" class="common-anchor-header">Suporte para MMap para aumentar a capacidade<button data-href="#Support-for-MMap-for-increased-capacity" class="anchor-icon" translate="no">
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
    </button></h2><p>MMap é uma chamada do sistema UNIX usada para mapear arquivos e outros objetos na memória. O Milvus 2.3 suporta MMap, que permite aos utilizadores carregar dados em discos locais e mapeá-los para a memória, aumentando assim a capacidade de uma única máquina.</p>
<p>Os resultados dos nossos testes indicam que, utilizando a tecnologia MMap, o Milvus pode duplicar a sua capacidade de dados, limitando a degradação do desempenho a 20%. Esta abordagem reduz significativamente os custos globais, tornando-a particularmente vantajosa para os utilizadores com um orçamento apertado que não se importam de comprometer o desempenho.</p>
<h2 id="CDC-support-for-higher-system-availability" class="common-anchor-header">Suporte CDC para uma maior disponibilidade do sistema<button data-href="#CDC-support-for-higher-system-availability" class="anchor-icon" translate="no">
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
    </button></h2><p>O Change Data Capture (CDC) é uma funcionalidade comummente utilizada nos sistemas de bases de dados que captura e replica as alterações de dados para um destino designado. Com a funcionalidade CDC, o Milvus 2.3 permite aos utilizadores sincronizar dados entre centros de dados, fazer cópias de segurança de dados incrementais e migrar dados sem problemas, tornando o sistema mais disponível.</p>
<p>Além dos recursos acima, o Milvus 2.3 introduz uma interface de contagem para calcular com precisão o número de linhas de dados armazenados em uma coleção em tempo real, suporta a métrica Cosine para medir a distância do vetor e mais operações em matrizes JSON. Para mais funcionalidades e informações detalhadas, consulte <a href="https://milvus.io/docs/release_notes.md">as notas de lançamento do Milvus 2.3</a>.</p>
<h2 id="Enhancements-and-bug-fixes" class="common-anchor-header">Melhorias e correcções de erros<button data-href="#Enhancements-and-bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>Para além das novas funcionalidades, o Milvus 2.3 inclui muitos melhoramentos e correcções de erros das versões anteriores.</p>
<h3 id="Improved-performance-for-data-filtering" class="common-anchor-header">Melhoria do desempenho da filtragem de dados</h3><p>O Milvus executa a filtragem escalar antes da pesquisa vetorial em consultas de dados híbridas escalares e vectoriais para obter resultados mais precisos. No entanto, o desempenho da indexação pode diminuir se o utilizador tiver filtrado demasiados dados após a filtragem escalar. No Milvus 2.3, optimizámos a estratégia de filtragem do HNSW para resolver este problema, resultando num melhor desempenho das consultas.</p>
<h3 id="Increased-multi-core-CPU-usage" class="common-anchor-header">Aumento do uso de CPU multi-core</h3><p>A busca aproximada mais próxima (ANN) é uma tarefa computacionalmente intensiva que requer recursos massivos de CPU. Em versões anteriores, o Milvus só podia utilizar cerca de 70% dos recursos disponíveis da CPU multi-core. No entanto, com a última versão, o Milvus superou essa limitação e pode utilizar todos os recursos disponíveis da CPU multi-core, resultando em melhor desempenho da consulta e redução do desperdício de recursos.</p>
<h3 id="Refactored-QueryNode" class="common-anchor-header">QueryNode refatorado</h3><p>O QueryNode é um componente crucial no Milvus que é responsável pela pesquisa vetorial. No entanto, em versões anteriores, o QueryNode tinha estados complexos, filas de mensagens duplicadas, uma estrutura de código desorganizada e mensagens de erro não intuitivas.</p>
<p>No Milvus 2.3, actualizámos o QueryNode introduzindo uma estrutura de código sem estado e removendo a fila de mensagens para apagar dados. Estas actualizações resultam num menor desperdício de recursos e numa pesquisa vetorial mais rápida e estável.</p>
<h3 id="Enhanced-message-queues-based-on-NATS" class="common-anchor-header">Filas de mensagens melhoradas baseadas em NATS</h3><p>Construímos o Milvus numa arquitetura baseada em registos e, em versões anteriores, utilizámos o Pulsar e o Kafka como os principais corretores de registos. No entanto, essa combinação enfrentou três desafios principais:</p>
<ul>
<li>Era instável em situações de múltiplos tópicos.</li>
<li>Consumia recursos quando estava ocioso e tinha dificuldades para deduplicar mensagens.</li>
<li>O Pulsar e o Kafka estão intimamente ligados ao ecossistema Java, pelo que a sua comunidade raramente mantém e actualiza os seus SDKs Go.</li>
</ul>
<p>Para resolver estes problemas, combinámos o NATS e o Bookeeper como o nosso novo corretor de registos para o Milvus, que se adapta melhor às necessidades dos utilizadores.</p>
<h3 id="Optimized-load-balancer" class="common-anchor-header">Balanceador de carga otimizado</h3><p>O Milvus 2.3 adoptou um algoritmo de balanceamento de carga mais flexível baseado nas cargas reais do sistema. Este algoritmo optimizado permite aos utilizadores detetar rapidamente falhas de nós e cargas desequilibradas e ajustar os agendamentos em conformidade. De acordo com os resultados dos nossos testes, o Milvus 2.3 consegue detetar falhas, cargas desequilibradas, estados anormais dos nós e outros eventos em segundos e fazer ajustes prontamente.</p>
<p>Para mais informações sobre o Milvus 2.3, consulte <a href="https://milvus.io/docs/release_notes.md">as notas de lançamento do Milvus 2.3</a>.</p>
<h2 id="Tool-upgrades" class="common-anchor-header">Actualizações de ferramentas<button data-href="#Tool-upgrades" class="anchor-icon" translate="no">
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
    </button></h2><p>Também actualizámos o Birdwatcher e o Attu, duas ferramentas valiosas para operar e manter o Milvus, juntamente com o Milvus 2.3.</p>
<h3 id="Birdwatcher-update" class="common-anchor-header">Atualização do Birdwatcher</h3><p>Actualizámos <a href="https://github.com/milvus-io/birdwatcher">o Birdwatcher</a>, a ferramenta de depuração do Milvus, introduzindo inúmeras funcionalidades e melhorias, incluindo:</p>
<ul>
<li>API RESTful para uma integração perfeita com outros sistemas de diagnóstico.</li>
<li>Suporte ao comando PProf para facilitar a integração com a ferramenta Go pprof.</li>
<li>Recursos de análise de uso de armazenamento.</li>
<li>Funcionalidade de análise de registo eficiente.</li>
<li>Suporte para visualização e modificação de configurações no etcd.</li>
</ul>
<h3 id="Attu-update" class="common-anchor-header">Atualização do Attu</h3><p>Lançámos uma interface totalmente nova para o <a href="https://zilliz.com/attu">Attu</a>, uma ferramenta de administração de bases de dados vectoriais tudo-em-um. A nova interface tem um design mais simples e é mais fácil de compreender.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Attu_s_new_interface_e24dd0d670.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Para mais pormenores, consulte <a href="https://milvus.io/docs/release_notes.md">as notas de lançamento do Milvus 2.3</a>.</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">Vamos manter-nos em contacto!<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Se tiver perguntas ou comentários sobre o Milvus, não hesite em contactar-nos através do <a href="https://twitter.com/milvusio">Twitter</a> ou do <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. Também pode juntar-se ao nosso <a href="https://milvus.io/slack/">canal Slack</a> para conversar diretamente com os nossos engenheiros e a comunidade ou visitar o nosso <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">horário de expediente às terças-feiras</a>!</p>
