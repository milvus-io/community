---
id: paper-reading-hm-ann-when-anns-meets-heterogeneous-memory.md
title: Leitura do documento｜HM-ANN Quando a ANNS encontra a memória heterogénea
author: Jigao Luo
date: 2021-08-26T07:18:47.925Z
desc: >-
  HM-ANN Pesquisa eficiente do vizinho mais próximo de um bilião de pontos em
  memória heterogénea
cover: assets.zilliz.com/blog_cover_4a9807b9e0.png
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/paper-reading-hm-ann-when-anns-meets-heterogeneous-memory
---
<custom-h1>Leitura de artigos ｜ HM-ANN: quando ANNS encontra memória heterogénea</custom-h1><p><a href="https://proceedings.neurips.cc/paper/2020/file/788d986905533aba051261497ecffcbb-Paper.pdf">HM-ANN: Efficient Billion-Point Nearest Neighbor Search on Heterogenous Memory</a> é um artigo de pesquisa que foi aceito na Conferência 2020 sobre Sistemas de Processamento de Informações Neurais<a href="https://nips.cc/Conferences/2020">(NeurIPS 2020</a>). Neste artigo, é proposto um novo algoritmo para pesquisa de similaridade baseada em grafos, chamado HM-ANN. Este algoritmo considera tanto a heterogeneidade da memória como a heterogeneidade dos dados numa configuração de hardware moderna. O HM-ANN permite a pesquisa de semelhanças à escala de milhares de milhões numa única máquina sem tecnologias de compressão. A memória heterogénea (HM) representa a combinação de uma memória dinâmica de acesso aleatório (DRAM) rápida mas pequena e de uma memória persistente (PMem) lenta mas grande. O HM-ANN atinge uma baixa latência de pesquisa e uma elevada precisão de pesquisa, especialmente quando o conjunto de dados não cabe na DRAM. O algoritmo tem uma vantagem distinta sobre as soluções de pesquisa de vizinho mais próximo aproximado (ANN) mais avançadas.</p>
<custom-h1>Motivação</custom-h1><p>Desde a sua criação, os algoritmos de pesquisa ANN têm colocado um compromisso fundamental entre a exatidão e a latência da consulta devido à capacidade limitada da DRAM. Para armazenar índices na DRAM para um acesso rápido à consulta, é necessário limitar o número de pontos de dados ou armazenar vectores comprimidos, o que prejudica a precisão da pesquisa. Os índices baseados em grafos (por exemplo, Hierarchical Navigable Small World, HNSW) têm um desempenho superior em termos de tempo de execução e precisão das consultas. No entanto, esses índices também podem consumir DRAM no nível de 1 TB ao operar em conjuntos de dados em escala de bilhões.</p>
<p>Existem outras soluções alternativas para evitar que a DRAM armazene conjuntos de dados à escala de mil milhões em formato bruto. Quando um conjunto de dados é demasiado grande para caber na memória de uma única máquina, são utilizadas abordagens comprimidas, como a quantização do produto dos pontos do conjunto de dados. Mas a recuperação desses índices com o conjunto de dados comprimido é normalmente baixa devido à perda de precisão durante a quantização. Subramanya et al. [1] exploram a utilização de uma unidade de estado sólido (SSD) para obter uma pesquisa ANN à escala de mil milhões utilizando uma única máquina com uma abordagem denominada Disk-ANN, em que o conjunto de dados em bruto é armazenado em SSD e a representação comprimida em DRAM.</p>
<custom-h1>Introdução à memória heterogénea</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_32_d26cfa9480.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>A memória heterogénea (HM) representa a combinação de DRAM rápida mas pequena e PMem lenta mas grande. A DRAM é um hardware normal que pode ser encontrado em todos os servidores modernos e o seu acesso é relativamente rápido. As novas tecnologias PMem, como os Módulos de Memória Persistente Intel® Optane™ DC, preenchem a lacuna entre o flash baseado em NAND (SSD) e a DRAM, eliminando o gargalo de E/S. A PMem é durável, tal como a SSD, e diretamente endereçável pela CPU, tal como a memória. Renen et al. [2] descobriram que a largura de banda de leitura da PMem é 2,6 vezes inferior e a largura de banda de escrita 7,5 vezes inferior à da DRAM no ambiente experimental configurado.</p>
<custom-h1>Conceção da HM-ANN</custom-h1><p>O HM-ANN é um algoritmo de pesquisa ANN preciso e rápido, à escala de mil milhões, que funciona numa única máquina sem compressão. A conceção do HM-ANN generaliza a ideia do HNSW, cuja estrutura hierárquica se adapta naturalmente ao HM. O HNSW consiste em várias camadas - apenas a camada 0 contém todo o conjunto de dados, e cada camada restante contém um subconjunto de elementos da camada diretamente abaixo dela.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_25a1836e8b.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<ul>
<li>Os elementos nas camadas superiores, que incluem apenas subconjuntos do conjunto de dados, consomem uma pequena parte de todo o armazenamento. Esta observação torna-os candidatos decentes para serem colocados na DRAM. Desta forma, espera-se que a maioria das pesquisas no HM-ANN ocorra nas camadas superiores, o que maximiza a utilização da caraterística de acesso rápido da DRAM. No entanto, nos casos de HNSW, a maioria das pesquisas ocorre na camada inferior.</li>
<li>Uma vez que o acesso à camada 0 é mais lento, é preferível que apenas uma pequena parte seja acedida por cada consulta e que a frequência de acesso seja reduzida.</li>
</ul>
<h2 id="Graph-Construction-Algorithm" class="common-anchor-header">Algoritmo de construção de gráficos<button data-href="#Graph-Construction-Algorithm" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_dd9627c753.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p>A ideia chave da construção do HM-ANN é criar camadas superiores de alta qualidade, de forma a proporcionar uma melhor navegação para a pesquisa na camada 0. Assim, a maior parte do acesso à memória acontece na DRAM, e o acesso na PMem é reduzido. Para que isto seja possível, o algoritmo de construção da HM-ANN tem uma fase de inserção descendente e uma fase de promoção ascendente.</p>
<p>A fase de inserção descendente constrói um grafo de mundo pequeno navegável à medida que a camada mais baixa é colocada no PMem.</p>
<p>A fase de promoção de baixo para cima promove pontos de articulação da camada inferior para formar camadas superiores que são colocadas na DRAM sem perder muita precisão. Se uma projeção de alta qualidade de elementos da camada 0 for criada na camada 1, a pesquisa na camada 0 encontra os vizinhos mais próximos exactos da consulta com apenas alguns saltos.</p>
<ul>
<li>Em vez de utilizar a seleção aleatória do HNSW para promoção, o HM-ANN utiliza uma estratégia de promoção de grau elevado para promover elementos com o grau mais elevado na camada 0 para a camada 1. Para camadas superiores, o HM-ANN promove nós de grau elevado para a camada superior com base numa taxa de promoção.</li>
<li>A HM-ANN promove mais nós da camada 0 para a camada 1 e define um maior número máximo de vizinhos para cada elemento na camada 1. O número de nós nas camadas superiores é decidido pelo espaço disponível na DRAM. Como a camada 0 não é armazenada na DRAM, tornar cada camada armazenada na DRAM mais densa aumenta a qualidade da pesquisa.</li>
</ul>
<h2 id="Graph-Seach-Algorithm" class="common-anchor-header">Algoritmo de pesquisa de grafos<button data-href="#Graph-Seach-Algorithm" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_a5a7f29c93.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p>O algoritmo de pesquisa consiste em duas fases: pesquisa rápida na memória e pesquisa paralela na camada 0 com pré-busca.</p>
<h3 id="Fast-memory-search" class="common-anchor-header">Pesquisa rápida na memória</h3><p>Tal como no HNSW, a pesquisa na DRAM começa no ponto de entrada na camada superior e, em seguida, efectua a pesquisa 1-greedy do topo para a camada 2. Para reduzir o espaço de pesquisa na camada 0, a HM-ANN efectua a pesquisa na camada 1 com um orçamento de pesquisa com <code translate="no">efSearchL1</code>, o que limita o tamanho da lista de candidatos na camada 1. Esses candidatos da lista são utilizados como pontos de entrada múltiplos para a pesquisa na camada 0, a fim de melhorar a qualidade da pesquisa na camada 0. Enquanto a HNSW utiliza apenas um ponto de entrada, o intervalo entre as camadas 0 e 1 é tratado de forma mais especial na HM-ANN do que os intervalos entre quaisquer outras duas camadas.</p>
<h3 id="Parallel-layer-0-search-with-prefetching" class="common-anchor-header">Pesquisa paralela na camada 0 com pré-busca</h3><p>Na camada inferior, a HM-ANN divide uniformemente os candidatos supramencionados da pesquisa na camada 1 e considera-os como pontos de entrada para efetuar uma pesquisa 1-greedy paralela multi-início com threads. Os melhores candidatos de cada pesquisa são reunidos para encontrar os melhores candidatos. Como se sabe, descer da camada 1 para a camada 0 é exatamente ir para o PMem. A pesquisa paralela esconde a latência do PMem e utiliza da melhor forma a largura de banda da memória, para melhorar a qualidade da pesquisa sem aumentar o tempo de pesquisa.</p>
<p>A HM-ANN implementa uma memória intermédia gerida por software na DRAM para ir buscar dados à PMem antes do acesso à memória. Durante a pesquisa no nível 1, a HM-ANN copia de forma assíncrona os elementos vizinhos dos candidatos em <code translate="no">efSearchL1</code> e as ligações dos elementos vizinhos no nível 1 da PMem para a memória intermédia. Quando a pesquisa na camada 0 ocorre, uma parte dos dados a serem acessados já está pré-programada na DRAM, o que oculta a latência para acessar a PMem e leva a um tempo de consulta mais curto. Corresponde ao objetivo de conceção da HM-ANN, em que a maioria dos acessos à memória ocorre na DRAM e os acessos à memória no PMem são reduzidos.</p>
<custom-h1>Avaliação</custom-h1><p>Neste artigo, é efectuada uma avaliação exaustiva. Todas as experiências são efectuadas numa máquina com Intel Xeon Gold 6252 CPU@2.3GHz. Ela usa DDR4 (96 GB) como memória rápida e Optane DC PMM (1,5 TB) como memória lenta. São avaliados cinco conjuntos de dados: BIGANN, DEEP1B, SIFT1M, DEEP1M e GIST1M. Para testes à escala de milhares de milhões, são incluídos os seguintes esquemas: métodos baseados na quantização à escala de milhares de milhões (IMI+OPQ e L&amp;C), os métodos não baseados na compressão (HNSW e NSG).</p>
<h2 id="Billion-scale-algorithm-comparison" class="common-anchor-header">Comparação de algoritmos à escala de mil milhões<button data-href="#Billion-scale-algorithm-comparison" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_4297db66a9.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<p>Na tabela 1, são comparados o tempo de construção e o armazenamento de diferentes índices baseados em gráficos. O HNSW é o que demora menos tempo a construir e o HM-ANN precisa de mais 8% de tempo do que o HNSW. Em termos de utilização do armazenamento total, os índices HM-ANN são 5-13% maiores do que o HSNW, porque promove mais nós da camada 0 para a camada 1.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_f363e64d3f.png" alt="6.png" class="doc-image" id="6.png" />
   </span> <span class="img-wrapper"> <span>6.png</span> </span></p>
<p>Na Figura 1, é analisado o desempenho de consulta de diferentes índices. As Figuras 1 (a) e (b) mostram que o HM-ANN alcança uma taxa de recuperação superior a 95% em 1 ms. As Figuras 1 © e (d) mostram que a HM-ANN obtém uma recuperação do top-100 &gt; 90% em 4 ms. O HM-ANN apresenta o melhor desempenho latência-vs-recordação do que todas as outras abordagens.</p>
<h2 id="Million-scale-algorithm-comparison" class="common-anchor-header">Comparação de algoritmos à escala do milhão<button data-href="#Million-scale-algorithm-comparison" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_a5c23de240.png" alt="7.png" class="doc-image" id="7.png" />
   </span> <span class="img-wrapper"> <span>7.png</span> </span></p>
<p>Na Figura 2, o desempenho de consulta de diferentes índices é analisado numa configuração DRAM pura. O HNSW, o NSG e o HM-ANN são avaliados com os três conjuntos de dados à escala de um milhão que se ajustam à DRAM. O HM-ANN continua a obter um melhor desempenho de consulta do que o HNSW. A razão é que o número total de cálculos de distância do HM-ANN é inferior (em média 850/consulta) ao do HNSW (em média 900/consulta) para atingir o objetivo de 99% de recuperação.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_33_f99d31f322.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<h2 id="Effectiveness-of-high-degree-promotion" class="common-anchor-header">Eficácia da promoção de grau elevado<button data-href="#Effectiveness-of-high-degree-promotion" class="anchor-icon" translate="no">
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
    </button></h2><p>Na Figura 3, as estratégias de promoção aleatória e de promoção de alto grau são comparadas na mesma configuração. A promoção de alto grau supera o desempenho da linha de base. A promoção de alto grau tem um desempenho 1,8x, 4,3x e 3,9x mais rápido do que a promoção aleatória para atingir os objectivos de recuperação de 95%, 99% e 99,5%, respetivamente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_34_3af47e0842.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<h2 id="Performance-benefit-of-memory-management-techniques" class="common-anchor-header">Benefício de desempenho das técnicas de gestão de memória<button data-href="#Performance-benefit-of-memory-management-techniques" class="anchor-icon" translate="no">
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
    </button></h2><p>A Figura 5 contém uma série de passos entre o HNSW e o HM-ANN para mostrar como cada otimização do HM-ANN contribui para as suas melhorias. BP significa Bottom-up Promotion (promoção ascendente) durante a construção do índice. PL0 representa a pesquisa paralela da camada 0, enquanto DP representa a pré-busca de dados da PMem para a DRAM. Passo a passo, o desempenho de pesquisa do HM-ANN é melhorado.</p>
<custom-h1>Conclusão</custom-h1><p>Um novo algoritmo de indexação e pesquisa baseado em grafos, denominado HM-ANN, mapeia a conceção hierárquica das ANNs baseadas em grafos com a heterogeneidade da memória em HM. As avaliações mostram que o HM-ANN pertence aos novos índices mais avançados em conjuntos de dados de mil milhões de pontos.</p>
<p>Notamos uma tendência no meio académico, bem como na indústria, em que a construção de índices em dispositivos de armazenamento persistente está em foco. Para aliviar a pressão da DRAM, o Disk-ANN [1] é um índice construído em SSD, cuja taxa de transferência é significativamente inferior à do PMem. No entanto, a construção do HM-ANN ainda demora alguns dias, não se registando grandes diferenças em relação ao Disk-ANN. Acreditamos que é possível otimizar o tempo de construção do HM-ANN, quando utilizamos as caraterísticas do PMem com mais cuidado, por exemplo, estar ciente da granularidade do PMem (256 Bytes) e usar instruções de streaming para contornar cachelines. Também acreditamos que mais abordagens com dispositivos de armazenamento duráveis serão propostas no futuro.</p>
<custom-h1>Referências</custom-h1><p>[1]: Suhas Jayaram Subramanya e Devvrit e Rohan Kadekodi e Ravishankar Krishaswamy e Ravishankar Krishaswamy: DiskANN: pesquisa rápida e precisa do vizinho mais próximo de bilhões de pontos em um único nó, NIPS, 2019</p>
<p><a href="https://www.microsoft.com/en-us/research/publication/diskann-fast-accurate-billion-point-nearest-neighbor-search-on-a-single-node/">DiskANN: pesquisa de vizinhos mais próximos de mil milhões de pontos com precisão rápida num único nó - Microsoft Research</a></p>
<p><a href="https://papers.nips.cc/paper/2019/hash/09853c7fb1d3f8ee67a61b6bf4a7f8e6-Abstract.html">DiskANN: Pesquisa rápida e precisa de vizinhos mais próximos de bilhões de pontos em um único nó</a></p>
<p>[2]: Alexander van Renen e Lukas Vogel e Viktor Leis e Thomas Neumann e Alfons Kemper: Primitivas de E/S de memória persistente, CoRR &amp; DaMoN, 2019</p>
<p><a href="https://dl.acm.org/doi/abs/10.1145/3329785.3329930">https://dl.acm.org/doi/abs/10.1145/3329785.3329930</a></p>
<p><a href="https://arxiv.org/abs/1904.01614">Primitivas de E/S de memória persistente</a></p>
