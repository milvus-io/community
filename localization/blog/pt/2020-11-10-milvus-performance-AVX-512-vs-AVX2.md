---
id: milvus-performance-AVX-512-vs-AVX2.md
title: O que são Extensões Vectoriais Avançadas?
author: milvus
date: 2020-11-10T22:15:39.156Z
desc: >-
  Descubra o desempenho do Milvus no AVX-512 vs. AVX2 utilizando uma variedade
  de índices vectoriais diferentes.
cover: assets.zilliz.com/header_milvus_performance_avx_512_vs_avx2_2c9f14ef96.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/milvus-performance-AVX-512-vs-AVX2'
---
<custom-h1>Desempenho do Milvus em AVX-512 vs. AVX2</custom-h1><p>Máquinas conscientes e inteligentes que querem dominar o mundo são uma constante na ficção científica, mas na realidade os computadores modernos são muito obedientes. Sem que lhes seja dito, raramente sabem o que fazer com eles próprios. Os computadores executam tarefas com base em instruções, ou ordens, enviadas de um programa para um processador. No seu nível mais baixo, cada instrução é uma sequência de uns e zeros que descreve uma operação a executar por um computador. Tipicamente, nas linguagens de montagem dos computadores, cada instrução em linguagem de máquina corresponde a uma instrução do processador. A unidade central de processamento (CPU) baseia-se em instruções para efetuar cálculos e sistemas de controlo. Além disso, o desempenho da CPU é frequentemente medido em termos de capacidade de execução de instruções (por exemplo, tempo de execução).</p>
<h2 id="What-are-Advanced-Vector-Extensions" class="common-anchor-header">O que são Extensões Vectoriais Avançadas?<button data-href="#What-are-Advanced-Vector-Extensions" class="anchor-icon" translate="no">
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
    </button></h2><p>As Extensões Vectoriais Avançadas (AVX) são um conjunto de instruções para microprocessadores que se baseiam na família x86 de arquitecturas de conjuntos de instruções. Proposto pela primeira vez pela Intel em março de 2008, o AVX obteve um amplo apoio três anos mais tarde com o lançamento da Sandy Bridge - uma microarquitectura utilizada na segunda geração de processadores Intel Core (por exemplo, Core i7, i5, i3) - e da microarquitectura concorrente da AMD também lançada em 2011, a Bulldozer.</p>
<p>O AVX introduziu um novo esquema de codificação, novas funcionalidades e novas instruções. O AVX2 expande a maioria das operações com números inteiros para 256 bits e introduz operações de multiplicação-acumulação fundidas (FMA). O AVX-512 expande o AVX para operações de 512 bits utilizando uma nova codificação de prefixo de extensão vetorial melhorada (EVEX).</p>
<p><a href="https://milvus.io/docs">Milvus</a> é uma base de dados vetorial de código aberto concebida para pesquisa de semelhanças e aplicações de inteligência artificial (IA). A plataforma suporta o conjunto de instruções AVX-512, o que significa que pode ser usada com todas as CPUs que incluem as instruções AVX-512. O Milvus tem amplas aplicações que abrangem sistemas de recomendação, visão computacional, processamento de linguagem natural (PNL) e muito mais. Este artigo apresenta resultados de desempenho e análise de uma base de dados vetorial Milvus em AVX-512 e AVX2.</p>
<h2 id="Milvus-performance-on-AVX-512-vs-AVX2" class="common-anchor-header">Desempenho do Milvus em AVX-512 vs. AVX2<button data-href="#Milvus-performance-on-AVX-512-vs-AVX2" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="System-configuration" class="common-anchor-header">Configuração do sistema</h3><ul>
<li>CPU: CPU Intel® Platinum 8163 a 2,50 GHz24 núcleos 48 threads</li>
<li>Número de CPU: 2</li>
<li>Placa gráfica, GeForce RTX 2080Ti 11GB 4 placas</li>
<li>Memória: 768 GB</li>
<li>Disco: SSD de 2TB</li>
</ul>
<h3 id="Milvus-parameters" class="common-anchor-header">Parâmetros do Milvus</h3><ul>
<li>cahce.cahe_size: 25, O tamanho da memória da CPU utilizada para armazenar dados em cache para uma consulta mais rápida.</li>
<li>nlist: 4096</li>
<li>nprobe: 128</li>
</ul>
<p>Nota: <code translate="no">nlist</code> é o parâmetro de indexação a criar a partir do cliente; <code translate="no">nprobe</code> o parâmetro de pesquisa. Tanto o IVF_FLAT como o IVF_SQ8 utilizam um algoritmo de agrupamento para particionar um grande número de vectores em intervalos, sendo <code translate="no">nlist</code> o número total de intervalos a particionar durante o agrupamento. O primeiro passo de uma consulta consiste em encontrar o número de intervalos mais próximos do vetor alvo e o segundo passo consiste em encontrar os vectores top-k nesses intervalos, comparando a distância dos vectores. <code translate="no">nprobe</code> refere-se ao número de intervalos no primeiro passo.</p>
<h3 id="Dataset-SIFT10M-dataset" class="common-anchor-header">Conjunto de dados: Conjunto de dados SIFT10M</h3><p>Estes testes utilizam o <a href="https://archive.ics.uci.edu/ml/datasets/SIFT10M">conjunto de dados SIFT10M</a>, que contém um milhão de vectores de 128 dimensões e é frequentemente utilizado para analisar o desempenho dos métodos de pesquisa do vizinho mais próximo correspondentes. O tempo de pesquisa top-1 para nq = [1, 10, 100, 500, 1000] será comparado entre os dois conjuntos de instruções.</p>
<h3 id="Results-by-vector-index-type" class="common-anchor-header">Resultados por tipo de índice vetorial</h3><p><a href="https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing">Os índices vectoriais</a> são estruturas de dados eficientes em termos de tempo e espaço, construídas no campo vetorial de uma coleção utilizando vários modelos matemáticos. A indexação vetorial permite pesquisar eficientemente grandes conjuntos de dados quando se tenta identificar vectores semelhantes a um vetor de entrada. Devido à natureza demorada da recuperação exacta, a maioria dos tipos de índices <a href="https://milvus.io/docs/v2.0.x/index.md#CPU">suportados pelo Milvus</a> utiliza a pesquisa aproximada do vizinho mais próximo (ANN).</p>
<p>Para estes testes, foram utilizados três índices com o AVX-512 e o AVX2: IVF_FLAT, IVF_SQ8 e HNSW.</p>
<h3 id="IVFFLAT" class="common-anchor-header">IVF_FLAT</h3><p>O ficheiro invertido (IVF_FLAT) é um tipo de índice baseado na quantização. É o índice IVF mais básico e os dados codificados armazenados em cada unidade são consistentes com os dados originais. O índice divide os dados vectoriais num número de unidades de cluster (nlist) e, em seguida, compara as distâncias entre o vetor de entrada alvo e o centro de cada cluster. Dependendo do número de clusters que o sistema está definido para consultar (nprobe), os resultados da pesquisa de semelhança são devolvidos com base em comparações entre a entrada de destino e os vectores apenas no(s) cluster(s) mais semelhante(s) - reduzindo drasticamente o tempo de consulta. Ao ajustar nprobe, é possível encontrar um equilíbrio ideal entre precisão e velocidade para um determinado cenário.</p>
<p><strong>Resultados de desempenho</strong> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IVF_FLAT_3688377fc8.png" alt="IVF_FLAT.png" class="doc-image" id="ivf_flat.png" /><span>IVF_FLAT.png</span> </span></p>
<h3 id="IVFSQ8" class="common-anchor-header">IVF_SQ8</h3><p>O IVF_FLAT não executa nenhuma compactação, de modo que os arquivos de índice que ele produz têm aproximadamente o mesmo tamanho que os dados vetoriais originais, brutos e não indexados. Quando os recursos de memória do disco, da CPU ou da GPU são limitados, o IVF_SQ8 é uma opção melhor do que o IVF_FLAT. Esse tipo de índice pode converter cada dimensão do vetor original de um número de ponto flutuante de quatro bytes para um inteiro sem sinal de um byte executando a quantização escalar. Isso reduz o consumo de memória do disco, da CPU e da GPU em 70-75%.</p>
<p><strong>Resultados de desempenho</strong> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IVF_SQ_8_bed28307f7.png" alt="IVF_SQ8.png" class="doc-image" id="ivf_sq8.png" /><span>IVF_SQ8.png</span> </span></p>
<h3 id="HNSW" class="common-anchor-header">HNSW</h3><p>O Hierarchical Small World Graph (HNSW) é um algoritmo de indexação baseado em gráficos. As consultas começam na camada mais alta, encontrando o nó mais próximo do objetivo, descendo depois para a camada seguinte para outra ronda de pesquisa. Após várias iterações, pode aproximar-se rapidamente da posição de destino.</p>
<p><strong>Resultados de desempenho</strong> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/HNSW_52aba39214.png" alt="HNSW.png" class="doc-image" id="hnsw.png" /><span>HNSW.png</span> </span></p>
<h2 id="Comparing-vector-indexes" class="common-anchor-header">Comparação de índices vectoriais<button data-href="#Comparing-vector-indexes" class="anchor-icon" translate="no">
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
    </button></h2><p>A recuperação de vectores é consistentemente mais rápida no conjunto de instruções AVX-512 do que no AVX2. Isto deve-se ao facto de o AVX-512 suportar computação de 512 bits, em comparação com a computação de apenas 256 bits no AVX2. Teoricamente, o AVX-512 deveria ser duas vezes mais rápido do que o AVX2. No entanto, o Milvus executa outras tarefas morosas para além dos cálculos de semelhança de vectores. É pouco provável que o tempo total de recuperação do AVX-512 seja duas vezes mais curto do que o do AVX2 em cenários do mundo real. <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/comparison_a64b92f1dd.png" alt="comparison.png" class="doc-image" id="comparison.png" /><span>comparison.png</span> </span></p>
<p>A recuperação é significativamente mais rápida no índice HNSW do que nos outros dois índices, enquanto a recuperação IVF_SQ8 é ligeiramente mais rápida do que IVF_FLAT em ambos os conjuntos de instruções. Isto deve-se provavelmente ao facto de o IVF_SQ8 necessitar apenas de 25% da memória necessária para o IVF_FLAT. O IVF_SQ8 carrega 1 byte por cada dimensão do vetor, enquanto o IVF_FLAT carrega 4 bytes por dimensão do vetor. O tempo necessário para o cálculo é muito provavelmente limitado pela largura de banda da memória. Como resultado, o IVF_SQ8 não só ocupa menos espaço, como também requer menos tempo para recuperar os vectores.</p>
<h2 id="Milvus-is-a-versatile-high-performance-vector-database" class="common-anchor-header">O Milvus é uma base de dados vetorial versátil e de elevado desempenho<button data-href="#Milvus-is-a-versatile-high-performance-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Os testes apresentados neste artigo demonstram que o Milvus oferece excelente desempenho nos conjuntos de instruções AVX-512 e AVX2 usando diferentes índices. Independentemente do tipo de índice, o Milvus tem melhor desempenho no AVX-512.</p>
<p>O Milvus é compatível com uma variedade de plataformas de aprendizagem profunda e é utilizado em diversas aplicações de IA. <a href="https://zilliz.com/news/lfaidata-launches-milvus-2.0-an-advanced-cloud-native-vector-database-built-for-ai">O Milvus 2.0</a>, uma versão reimaginada do banco de dados vetorial mais popular do mundo, foi lançado sob uma licença de código aberto em julho de 2021. Para mais informações sobre o projeto, consulte os seguintes recursos:</p>
<ul>
<li>Encontre ou contribua para o Milvus no <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Interagir com a comunidade através do <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Conecte-se conosco no <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
