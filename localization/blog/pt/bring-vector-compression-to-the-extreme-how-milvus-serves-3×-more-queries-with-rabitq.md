---
id: >-
  bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md
title: >-
  Leve a compressão vetorial ao extremo: como a Milvus atende a 3× mais
  consultas com o RaBitQ
author: 'Alexandr Guzhva, Li Liu, Jiang Chen'
date: 2025-05-13T00:00:00.000Z
desc: >-
  Descubra como a Milvus utiliza o RaBitQ para melhorar a eficiência da pesquisa
  de vectores, reduzindo os custos de memória e mantendo a precisão. Aprenda a
  otimizar as suas soluções de IA hoje mesmo!
cover: >-
  assets.zilliz.com/Bring_Vector_Compression_to_the_Extreme_How_Milvus_Serves_3_More_Queries_with_Ra_Bit_Q_12f5b4d932.jpg
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Vector Quantization, binary quantization, RaBitQ, vector compression, Milvus
  vector database
meta_title: >
  Bring Vector Compression to the Extreme: How Milvus Serves 3× More Queries
  with RaBitQ
origin: >-
  https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md
---
<p><a href="https://milvus.io/docs/overview.md">O Milvus</a> é uma base de dados vetorial de código aberto e altamente escalável que potencia a pesquisa semântica à escala de mil milhões de vectores. À medida que os utilizadores implementam chatbots RAG, serviço de apoio ao cliente com IA e pesquisa visual a esta escala, surge um desafio comum: <strong>os custos de infraestrutura.</strong> Por outro lado, o crescimento exponencial dos negócios é empolgante; as contas de nuvem em alta não são. A pesquisa rápida de vectores normalmente requer o armazenamento de vectores na memória, o que é dispendioso. Naturalmente, pode perguntar-se: <em>podemos comprimir os vectores para poupar espaço sem sacrificar a qualidade da pesquisa?</em></p>
<p>A resposta é <strong>SIM</strong> e, neste blogue, vamos mostrar-lhe como a implementação de uma nova técnica chamada <a href="https://dl.acm.org/doi/pdf/10.1145/3654970"><strong>RaBitQ</strong></a> permite à Milvus servir 3× mais tráfego com um custo de memória mais baixo, mantendo uma precisão comparável. Também partilharemos as lições práticas aprendidas com a integração do RaBitQ no Milvus de código aberto e no serviço Milvus totalmente gerido na <a href="https://zilliz.com/cloud">Zilliz Cloud</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Bring_Vector_Compression_to_the_Extreme_How_Milvus_Serves_3_More_Queries_with_Ra_Bit_Q_12f5b4d932.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Understanding-Vector-Search-and-Compression" class="common-anchor-header">Entendendo a pesquisa vetorial e a compactação<button data-href="#Understanding-Vector-Search-and-Compression" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de mergulhar no RaBitQ, vamos entender o desafio.</p>
<p>Os algoritmos de pesquisa<a href="https://zilliz.com/glossary/anns"><strong>ANN (Approximate Nearest Neighbor)</strong></a> são o coração de um banco de dados de vetores, encontrando os principais vetores mais próximos de uma determinada consulta. Um vetor é uma coordenada num espaço de elevada dimensão, muitas vezes composto por centenas de números de vírgula flutuante. À medida que os dados vectoriais aumentam, aumentam também as exigências de armazenamento e de computação. Por exemplo, a execução do <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a> (um algoritmo de pesquisa ANN) com mil milhões de vectores de 768 dimensões em FP32 requer mais de 3 TB de memória!</p>
<p>Tal como o MP3 comprime o áudio descartando frequências imperceptíveis ao ouvido humano, os dados vectoriais podem ser comprimidos com um impacto mínimo na precisão da pesquisa. A investigação mostra que o FP32 de precisão total é muitas vezes desnecessário para as ANN.<a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization"> A Quantização Escalar</a> (SQ), uma técnica de compressão popular, mapeia os valores de vírgula flutuante em compartimentos discretos e armazena apenas os índices dos compartimentos utilizando números inteiros de poucos bits. Os métodos de quantização reduzem significativamente a utilização de memória ao representar a mesma informação com menos bits. A investigação neste domínio procura obter o máximo de poupança com a menor perda de precisão.</p>
<p>A técnica de compressão mais extrema - Quantização escalar de 1 bit, também conhecida como <a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization">Quantização binária - representa</a>cada ponto flutuante com um único bit. Em comparação com a FP32 (codificação de 32 bits), isto reduz a utilização de memória em 32×. Uma vez que a memória é frequentemente o principal estrangulamento na pesquisa vetorial, esta compressão pode aumentar significativamente o desempenho. <strong>O desafio, no entanto, reside na preservação da precisão da pesquisa.</strong> Normalmente, o SQ de 1 bit reduz a recuperação para menos de 70%, tornando-o praticamente inutilizável.</p>
<p>É aqui que <strong>o RaBitQ</strong> se destaca - uma excelente técnica de compressão que alcança a quantização de 1 bit enquanto preserva a alta recuperação. O Milvus suporta agora o RaBitQ a partir da versão 2.6, permitindo que a base de dados de vectores sirva 3× o QPS, mantendo um nível comparável de precisão.</p>
<h2 id="A-Brief-Intro-to-RaBitQ" class="common-anchor-header">Uma breve introdução ao RaBitQ<button data-href="#A-Brief-Intro-to-RaBitQ" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://dl.acm.org/doi/pdf/10.1145/3654970">O RaBitQ</a> é um método de quantização binária inteligentemente projetado que aproveita a propriedade de geometria do espaço de alta dimensão para obter uma compactação vetorial eficiente e precisa.</p>
<p>À primeira vista, reduzir cada dimensão de um vetor a um único bit pode parecer demasiado agressivo, mas no espaço de alta dimensão, as nossas intuições muitas vezes falham. Como Jianyang Gao, um autor do RaBitQ,<a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg"> ilustrou</a>, os vectores de alta dimensão exibem a propriedade de que as coordenadas individuais tendem a estar fortemente concentradas em torno de zero, resultado de um fenómeno contra-intuitivo explicado em<a href="https://en.wikipedia.org/wiki/Concentration_of_measure"> Concentração de medida</a>. Isto torna possível descartar grande parte da precisão original, preservando a estrutura relativa necessária para uma pesquisa precisa do vizinho mais próximo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_counterintuitive_value_distribution_in_high_dimensional_geometry_fad6143bfd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura: A distribuição de valores contra-intuitiva na geometria de alta dimensão. <em>Considere-se o valor da primeira dimensão para um vetor unitário aleatório uniformemente amostrado a partir da esfera unitária; os valores estão uniformemente distribuídos no espaço 3D. No entanto, para um espaço de elevada dimensão (por exemplo, 1000D), os valores concentram-se à volta de zero, uma propriedade pouco intuitiva da geometria de elevada dimensão. (Fonte da imagem: <a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg">Quantização no espaço de alta dimensão contra-intuitivo</a>)</em></p>
<p>Inspirado por esta propriedade do espaço de alta dimensão, <strong>o RaBitQ concentra-se na codificação de informação angular em vez de coordenadas espaciais exactas</strong>. Para tal, normaliza cada vetor de dados relativamente a um ponto de referência, como o centroide do conjunto de dados. Cada vetor é então mapeado para o vértice mais próximo no hipercubo, permitindo a representação com apenas 1 bit por dimensão. Esta abordagem estende-se naturalmente a <code translate="no">IVF_RABITQ</code>, onde a normalização é efectuada em relação ao centróide do agrupamento mais próximo, melhorando a precisão da codificação local.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Compressing_a_vector_by_finding_its_closest_approximation_on_the_hypercube_so_that_each_dimension_can_be_represented_with_just_1_bit_cd0d50bb30.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: Compressão de um vetor encontrando a sua aproximação mais próxima no hipercubo, de modo a que cada dimensão possa ser representada com apenas 1 bit. (Fonte da imagem:</em> <a href="https://dev.to/gaoj0017/quantization-in-the-counterintuitive-high-dimensional-space-4feg"><em>Quantização no espaço de alta dimensão contra-intuitivo</em></a><em>)</em></p>
<p>Para garantir que a pesquisa permaneça confiável mesmo com essas representações compactadas, o RaBitQ introduz um <strong>estimador teoricamente fundamentado e imparcial</strong> para a distância entre um vetor de consulta e vetores de documentos com quantização binária. Isso ajuda a minimizar o erro de reconstrução e a manter uma alta recuperação.</p>
<p>O RaBitQ também é altamente compatível com outras técnicas de otimização, como o<a href="https://www.vldb.org/pvldb/vol9/p288-andre.pdf"> FastScan</a> e<a href="https://github.com/facebookresearch/faiss/wiki/Pre--and-post-processing"> o pré-processamento de rotação aleatória</a>. Além disso, o RaBitQ é <strong>leve para treinar e rápido para executar</strong>. O treinamento envolve simplesmente determinar o sinal de cada componente do vetor, e a pesquisa é acelerada por meio de operações bit a bit rápidas suportadas pelas CPUs modernas. Juntas, essas otimizações permitem que o RaBitQ forneça pesquisa de alta velocidade com perda mínima de precisão.</p>
<h2 id="Engineering-RaBitQ-in-Milvus-From-Academic-Research-to-Production" class="common-anchor-header">Engenharia do RaBitQ em Milvus: da investigação académica à produção<button data-href="#Engineering-RaBitQ-in-Milvus-From-Academic-Research-to-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Embora o RaBitQ seja conceitualmente simples e acompanhado por uma<a href="https://github.com/gaoj0017/RaBitQ"> implementação de referência</a>, adaptá-lo em um banco de dados vetorial distribuído e de nível de produção como o Milvus apresentou vários desafios de engenharia. Implementámos o RaBitQ no Knowhere, o principal motor de pesquisa vetorial do Milvus, e também contribuímos com uma versão optimizada para a biblioteca de pesquisa ANN de código aberto<a href="https://github.com/facebookresearch/faiss"> FAISS</a>.</p>
<p>Vamos ver como demos vida a este algoritmo no Milvus.</p>
<h3 id="Implementation-Tradeoffs" class="common-anchor-header">Compensações de implementação</h3><p>Uma importante decisão de design envolveu a manipulação de dados auxiliares por vetor. O RaBitQ requer dois valores de vírgula flutuante por vetor, pré-computados durante o tempo de indexação, e um terceiro valor que pode ser computado em tempo real ou pré-computado. No Knowhere, pré-computámos este valor no momento da indexação e armazenámo-lo para melhorar a eficiência durante a pesquisa. Em contrapartida, a implementação FAISS conserva a memória calculando-o no momento da consulta, adoptando um compromisso diferente entre a utilização da memória e a velocidade da consulta.</p>
<h3 id="Hardware-Acceleration" class="common-anchor-header">Aceleração de hardware</h3><p>As CPUs modernas oferecem instruções especializadas que podem acelerar significativamente as operações binárias. Nós adaptamos o kernel de computação de distância para tirar vantagem das instruções modernas da CPU. Como o RaBitQ depende de operações de popcount, criamos um caminho especializado no Knowhere que usa as instruções <code translate="no">VPOPCNTDQ</code> para AVX512 quando disponíveis. Em hardware compatível (por exemplo, Intel IceLake ou AMD Zen 4), isso pode acelerar os cálculos de distância binária por vários fatores em comparação com as implementações padrão.</p>
<h3 id="Query-Optimization" class="common-anchor-header">Otimização de consultas</h3><p>Tanto o Knowhere (motor de pesquisa do Milvus) como a nossa versão optimizada do FAISS suportam quantização escalar (SQ1-SQ8) em vectores de consulta. Isto proporciona uma flexibilidade adicional: mesmo com a quantização de consultas de 4 bits, a recuperação permanece elevada, enquanto as exigências computacionais diminuem significativamente, o que é particularmente útil quando as consultas têm de ser processadas com um elevado rendimento.</p>
<p>Demos um passo em frente na otimização do nosso motor proprietário Cardinal, que alimenta o Milvus totalmente gerido no Zilliz Cloud. Para além das capacidades do Milvus de código aberto, introduzimos melhorias avançadas, incluindo a integração com um índice vetorial baseado em gráficos, camadas adicionais de otimização e suporte para instruções Arm SVE.</p>
<h2 id="The-Performance-Gain-3×-More-QPS-with-Comparable-Accuracy" class="common-anchor-header">O ganho de desempenho: 3× mais QPS com precisão comparável<button data-href="#The-Performance-Gain-3×-More-QPS-with-Comparable-Accuracy" class="anchor-icon" translate="no">
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
    </button></h2><p>A partir da versão 2.6, Milvus introduz o novo tipo de índice <code translate="no">IVF_RABITQ</code>. Este novo índice combina RaBitQ com IVF clustering, transformação de rotação aleatória e refinamento opcional para fornecer um equilíbrio ótimo de desempenho, eficiência de memória e precisão.</p>
<h3 id="Using-IVFRABITQ-in-Your-Application" class="common-anchor-header">Usando IVF_RABITQ na sua aplicação</h3><p>Veja como implementar <code translate="no">IVF_RABITQ</code> na sua aplicação Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name=<span class="hljs-string">&quot;your_vector_field_name&quot;</span>, <span class="hljs-comment"># Name of the vector field to be indexed</span>
    index_type=<span class="hljs-string">&quot;IVF_RABITQ&quot;</span>, <span class="hljs-comment"># Will be introduced in Milvus 2.6</span>
    index_name=<span class="hljs-string">&quot;vector_index&quot;</span>, <span class="hljs-comment"># Name of the index to create</span>
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-comment"># IVF_RABITQ supports IP and COSINE</span>
    params={
        <span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">1024</span>, <span class="hljs-comment"># IVF param, specifies the number of clusters</span>
    } <span class="hljs-comment"># Index building params</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmarking-Numbers-Tell-the-Story" class="common-anchor-header">Benchmarking: Os números contam a história</h3><p>Avaliamos diferentes configurações usando<a href="https://github.com/zilliztech/vectordbbench"> o vdb-bench</a>, uma ferramenta de benchmarking de código aberto para avaliar bancos de dados vetoriais. Tanto o ambiente de teste como o de controlo utilizam o Milvus Standalone implementado em instâncias AWS EC2 <code translate="no">m6id.2xlarge</code>. Essas máquinas possuem 8 vCPUs, 32 GB de RAM e uma CPU Intel Xeon 8375C baseada na arquitetura Ice Lake, que suporta o conjunto de instruções VPOPCNTDQ AVX-512.</p>
<p>Usamos o teste de desempenho de pesquisa do vdb-bench, com um conjunto de dados de 1 milhão de vetores, cada um com 768 dimensões. Como o tamanho padrão do segmento no Milvus é de 1 GB, e o conjunto de dados bruto (768 dimensões × 1 milhão de vetores × 4 bytes por float) totaliza cerca de 3 GB, a avaliação comparativa envolveu vários segmentos por banco de dados.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Example_test_configuration_in_vdb_bench_000142f634.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura: Exemplo de configuração de teste no vdb-bench.</p>
<p>Seguem-se alguns pormenores de baixo nível sobre os botões de configuração do IVF, RaBitQ e processo de refinamento:</p>
<ul>
<li><p><code translate="no">nlist</code> e <code translate="no">nprobe</code> são parâmetros padrão para todos os métodos baseados em <code translate="no">IVF</code></p></li>
<li><p><code translate="no">nlist</code> é um número inteiro não negativo que especifica o número total de compartimentos de FIV para o conjunto de dados.</p></li>
<li><p><code translate="no">nprobe</code> é um número inteiro não negativo que especifica o número de compartimentos FIV que são visitados para um único vetor de dados durante o processo de pesquisa. É um parâmetro relacionado com a pesquisa.</p></li>
<li><p><code translate="no">rbq_bits_query</code> especifica o nível de quantização de um vetor de consulta. Use os valores 1... 8 para os <code translate="no">SQ1</code>...<code translate="no">SQ8</code> níveis de quantização. Utilize o valor 0 para desativar a quantização. É um parâmetro relacionado com a pesquisa.</p></li>
<li><p><code translate="no">refine</code>Os parâmetros <code translate="no">refine_type</code> e <code translate="no">refine_k</code> são parâmetros padrão para o processo de refinamento</p></li>
<li><p><code translate="no">refine</code> é um booleano que ativa a estratégia de refinamento.</p></li>
<li><p><code translate="no">refine_k</code> é um valor fp não negativo. O processo de refinamento utiliza um método de quantização de maior qualidade para selecionar o número necessário de vizinhos mais próximos a partir de um conjunto <code translate="no">refine_k</code> vezes maior de candidatos, escolhidos utilizando <code translate="no">IVFRaBitQ</code>. Trata-se de um parâmetro relacionado com a pesquisa.</p></li>
<li><p><code translate="no">refine_type</code> é uma cadeia de caracteres que especifica o tipo de quantização para um índice de refinação. As opções disponíveis são <code translate="no">SQ6</code>, <code translate="no">SQ8</code>, <code translate="no">FP16</code>, <code translate="no">BF16</code> e <code translate="no">FP32</code> / <code translate="no">FLAT</code>.</p></li>
</ul>
<p>Os resultados revelam informações importantes:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Cost_and_performance_comparison_of_baseline_IVF_FLAT_IVF_SQ_8_and_IVF_RABITQ_with_different_refinement_strategies_9f69fa449f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura: Comparação do custo e do desempenho da linha de base (IVF_FLAT), IVF_SQ8 e IVF_RABITQ com diferentes estratégias de refinamento</p>
<p>Em comparação com o índice de base <code translate="no">IVF_FLAT</code>, que atinge 236 QPS com 95,2% de recuperação, o <code translate="no">IVF_RABITQ</code> atinge um rendimento significativamente mais elevado - 648 QPS com consultas FP32 e 898 QPS quando emparelhado com consultas SQ8-quantizadas. Esses números demonstram a vantagem de desempenho do RaBitQ, especialmente quando o refinamento é aplicado.</p>
<p>No entanto, este desempenho é acompanhado de uma compensação notável na recuperação. Quando o <code translate="no">IVF_RABITQ</code> é usado sem refinamento, a recuperação fica em torno de 76%, o que pode ser insuficiente para aplicativos que exigem alta precisão. Dito isto, alcançar este nível de recuperação utilizando a compressão vetorial de 1 bit é ainda assim impressionante.</p>
<p>O refinamento é essencial para recuperar a precisão. Quando configurado com a consulta SQ8 e o refinamento SQ8, o <code translate="no">IVF_RABITQ</code> oferece excelente desempenho e recuperação. Mantém uma elevada recuperação de 94,7%, quase igual à do IVF_FLAT, ao mesmo tempo que atinge 864 QPS, mais de 3× superior ao IVF_FLAT. Mesmo em comparação com outro índice de quantização popular <code translate="no">IVF_SQ8</code>, <code translate="no">IVF_RABITQ</code> com o refinamento SQ8 atinge mais de metade do rendimento com uma recuperação semelhante, apenas com um custo marginal mais elevado. Isto torna-o uma excelente opção para cenários que exigem tanto velocidade como precisão.</p>
<p>Resumindo, o <code translate="no">IVF_RABITQ</code> é excelente para maximizar a taxa de transferência com uma recuperação aceitável e torna-se ainda mais poderoso quando associado ao refinamento para reduzir a diferença de qualidade, utilizando apenas uma fração do espaço de memória em comparação com o <code translate="no">IVF_FLAT</code>.</p>
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
    </button></h2><p>O RaBitQ marca um avanço significativo na tecnologia de quantização de vectores. Combinando quantização binária com estratégias de codificação inteligentes, consegue o que parecia impossível: compressão extrema com perda mínima de precisão.</p>
<p>A partir da versão 2.6, Milvus introduzirá IVF_RABITQ, integrando esta poderosa técnica de compressão com estratégias de agrupamento e refinamento IVF para trazer a quantização binária para a produção. Esta combinação cria um equilíbrio prático entre precisão, velocidade e eficiência de memória que pode transformar as suas cargas de trabalho de pesquisa vetorial.</p>
<p>Estamos empenhados em trazer mais inovações como esta tanto para o Milvus de código aberto como para o seu serviço totalmente gerido no Zilliz Cloud, tornando a pesquisa vetorial mais eficiente e acessível a todos.</p>
<h2 id="Getting-Started-with-Milvus-26" class="common-anchor-header">Começar a usar o Milvus 2.6<button data-href="#Getting-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>O Milvus 2.6 já está disponível. Para além do RabitQ, introduz dezenas de novas funcionalidades e optimizações de desempenho, como o armazenamento em camadas, o Meanhash LSH, a pesquisa de texto completo melhorada e a multitenancy, abordando diretamente os desafios mais prementes da pesquisa vetorial atual: escalar de forma eficiente e manter os custos sob controlo.</p>
<p>Pronto para explorar tudo o que o Milvus 2.6 oferece? Mergulhe nas nossas<a href="https://milvus.io/docs/release_notes.md"> notas de versão</a>, navegue na<a href="https://milvus.io/docs"> documentação completa</a> ou consulte os nossos<a href="https://milvus.io/blog"> blogues de funcionalidades</a>.</p>
<p>Se tiver alguma dúvida ou um caso de utilização semelhante, não hesite em contactar-nos através da nossa <a href="https://discord.com/invite/8uyFbECzPX">comunidade Discord</a> ou registar um problema no<a href="https://github.com/milvus-io/milvus"> GitHub</a> - estamos aqui para o ajudar a tirar o máximo partido do Milvus 2.6.</p>
