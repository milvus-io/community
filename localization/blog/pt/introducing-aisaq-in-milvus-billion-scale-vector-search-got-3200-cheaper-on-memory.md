---
id: >-
  introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
title: >-
  Apresentamos o AISAQ em Milvus: a pesquisa de vectores à escala de milhares de
  milhões acaba de ficar 3.200 vezes mais barata em termos de memória
author: Martin Li
date: 2025-12-10T00:00:00.000Z
cover: assets.zilliz.com/AISAQ_Cover_66b628b762.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus2.6, AISAQ, DISKANN, vector search'
meta_title: |
  AISAQ in Milvus Cuts Memory 3,200× for Billion-Scale Search
desc: >-
  Descubra como o Milvus reduz os custos de memória em 3200× com o AISAQ,
  permitindo uma pesquisa escalável de milhares de milhões de vectores sem
  sobrecarga de DRAM.
origin: >-
  https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
---
<p>As bases de dados vectoriais tornaram-se a infraestrutura central dos sistemas de IA de missão crítica, e os seus volumes de dados estão a crescer exponencialmente - muitas vezes atingindo milhares de milhões de vectores. Nessa escala, tudo se torna mais difícil: manter a baixa latência, preservar a precisão, garantir a fiabilidade e operar entre réplicas e regiões. Mas há um desafio que tende a surgir cedo e a dominar as decisões de arquitetura: o custo<strong>.</strong></p>
<p>Para proporcionar uma pesquisa rápida, a maioria das bases de dados vectoriais mantém as principais estruturas de indexação em DRAM (Dynamic Random Access Memory), o nível de memória mais rápido e mais caro. Este design é eficaz em termos de desempenho, mas é pouco escalável. O uso de DRAM escala com o tamanho dos dados e não com o tráfego de consulta, e mesmo com compressão ou descarregamento parcial de SSD, grandes porções do índice devem permanecer na memória. À medida que os conjuntos de dados crescem, os custos de memória rapidamente se tornam um fator limitante.</p>
<p>O Milvus já oferece suporte ao <strong>DISKANN</strong>, uma abordagem ANN baseada em disco que reduz a pressão da memória ao mover grande parte do índice para o SSD. No entanto, DISKANN ainda depende de DRAM para representações comprimidas usadas durante a pesquisa. <a href="https://milvus.io/docs/release_notes.md#v264">O Milvus 2.6</a> leva isso adiante com o <a href="https://milvus.io/docs/aisaq.md">AISAQ</a>, um índice vetorial baseado em disco inspirado no <a href="https://milvus.io/docs/diskann.md">DISKANN</a>. Desenvolvido pela KIOXIA, a arquitetura do AiSAQ foi concebida com uma "Arquitetura Zero-DRAM-Footprint", que armazena todos os dados críticos de pesquisa no disco e optimiza a colocação de dados para minimizar as operações de E/S. Numa carga de trabalho de mil milhões de vectores, isto reduz a utilização de memória de <strong>32 GB para cerca de 10 MB - uma</strong> <strong>redução de 3.200 vezes -</strong>mantendo o desempenho prático.</p>
<p>Nas secções que se seguem, explicamos como funciona a pesquisa vetorial baseada em grafos, de onde vêm os custos de memória e como o AISAQ reformula a curva de custos da pesquisa vetorial à escala de mil milhões.</p>
<h2 id="How-Conventional-Graph-Based-Vector-Search-Works" class="common-anchor-header">Como funciona a pesquisa vetorial convencional baseada em grafos<button data-href="#How-Conventional-Graph-Based-Vector-Search-Works" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>A pesquisa vetorial</strong> é o processo de encontrar pontos de dados cujas representações numéricas estão mais próximas de uma consulta em um espaço de alta dimensão. "Mais próximo" significa simplesmente a menor distância de acordo com uma função de distância, como a distância cosseno ou a distância L2. Em pequena escala, isto é simples: calcular a distância entre a consulta e cada vetor e, em seguida, devolver os mais próximos. No entanto, a uma grande escala, digamos à escala de mil milhões, esta abordagem torna-se rapidamente demasiado lenta para ser prática.</p>
<p>Para evitar comparações exaustivas, os sistemas modernos de pesquisa do vizinho mais próximo aproximado (ANNS) baseiam-se em <strong>índices baseados em grafos</strong>. Em vez de comparar uma consulta com cada vetor, o índice organiza os vectores num <strong>grafo</strong>. Cada nó representa um vetor e as arestas ligam vectores que estão numericamente próximos. Esta estrutura permite que o sistema reduza drasticamente o espaço de pesquisa.</p>
<p>O gráfico é construído antecipadamente, com base apenas nas relações entre os vectores. Não depende de consultas. Quando chega uma consulta, a tarefa do sistema é <strong>navegar no gráfico de forma eficiente</strong> e identificar os vectores com a distância mais pequena à consulta - sem analisar todo o conjunto de dados.</p>
<p>A pesquisa começa a partir de um <strong>ponto de entrada</strong> predefinido no gráfico. Este ponto de partida pode estar longe da consulta, mas o algoritmo melhora a sua posição passo a passo, movendo-se para vectores que parecem mais próximos da consulta. Durante esse processo, a pesquisa mantém duas estruturas de dados internas que funcionam em conjunto: uma <strong>lista de candidatos</strong> e uma <strong>lista de resultados</strong>.</p>
<p>E as duas etapas mais importantes durante esse processo são a expansão da lista de candidatos e a atualização da lista de resultados.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/whiteboard_exported_image_84f8324275.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Expanding-the-Candidate-List" class="common-anchor-header">Expansão da lista de candidatos</h3><p>A <strong>lista de candidatos</strong> representa onde a pesquisa pode ir em seguida. É um conjunto priorizado de nós do gráfico que parecem promissores com base em sua distância para a consulta.</p>
<p>A cada iteração, o algoritmo</p>
<ul>
<li><p><strong>Seleciona o candidato mais próximo descoberto até o momento.</strong> Da lista de candidatos, ele escolhe o vetor com a menor distância para a consulta.</p></li>
<li><p><strong>Recupera os vizinhos desse vetor a partir do gráfico.</strong> Estes vizinhos são vectores que foram identificados durante a construção do índice como estando próximos do vetor atual.</p></li>
<li><p><strong>Avalia os vizinhos não visitados e adiciona-os à lista de candidatos.</strong> Para cada vizinho que ainda não tenha sido explorado, o algoritmo calcula a sua distância à consulta. Os vizinhos visitados anteriormente são ignorados, enquanto os novos vizinhos são inseridos na lista de candidatos se parecerem promissores.</p></li>
</ul>
<p>Ao expandir repetidamente a lista de candidatos, a pesquisa explora regiões cada vez mais relevantes do gráfico. Isso permite que o algoritmo se mova constantemente em direção a melhores respostas enquanto examina apenas uma pequena fração de todos os vetores.</p>
<h3 id="Updating-the-Result-List" class="common-anchor-header">Atualização da lista de resultados</h3><p>Ao mesmo tempo, o algoritmo mantém uma <strong>lista de resultados</strong>, que regista os melhores candidatos encontrados até ao momento para a saída final. À medida que a pesquisa progride, ele:</p>
<ul>
<li><p><strong>Rastreia os vetores mais próximos encontrados durante a travessia.</strong> Estes incluem os vectores selecionados para expansão, bem como outros avaliados ao longo do caminho.</p></li>
<li><p><strong>Armazena as suas distâncias em relação à consulta.</strong> Isso permite classificar os candidatos e manter os top-K vizinhos mais próximos atuais.</p></li>
</ul>
<p>Com o tempo, à medida que mais candidatos são avaliados e menos melhorias são encontradas, a lista de resultados se estabiliza. Quando é improvável que uma maior exploração do grafo produza vectores mais próximos, a pesquisa termina e devolve a lista de resultados como a resposta final.</p>
<p>Em termos simples, a <strong>lista de candidatos controla a exploração</strong>, enquanto a <strong>lista de resultados captura as melhores respostas descobertas até o momento</strong>.</p>
<h2 id="The-Trade-Off-in-Graph-Based-Vector-Search" class="common-anchor-header">O trade-off na pesquisa vetorial baseada em grafos<button data-href="#The-Trade-Off-in-Graph-Based-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Esta abordagem baseada em grafos é o que torna a pesquisa vetorial em grande escala prática em primeiro lugar. Ao navegar no grafo em vez de analisar cada vetor, o sistema pode encontrar resultados de alta qualidade tocando apenas numa pequena fração do conjunto de dados.</p>
<p>No entanto, esta eficiência não é gratuita. A pesquisa baseada em grafos expõe um compromisso fundamental entre <strong>precisão e custo.</strong></p>
<ul>
<li><p>Explorar mais vizinhos melhora a precisão, cobrindo uma parte maior do gráfico e reduzindo a hipótese de faltarem os verdadeiros vizinhos mais próximos.</p></li>
<li><p>Ao mesmo tempo, cada expansão adicional adiciona trabalho: mais cálculos de distância, mais acessos à estrutura do grafo e mais leituras de dados vetoriais. À medida que a pesquisa explora mais profundamente ou mais amplamente, esses custos se acumulam. Dependendo de como o índice é projetado, eles aparecem como maior uso da CPU, maior pressão na memória ou E/S adicional em disco.</p></li>
</ul>
<p>Equilibrar essas forças opostas - alta recuperação versus uso eficiente de recursos - é fundamental para o projeto de pesquisa baseada em grafos.</p>
<p>Tanto <a href="https://milvus.io/blog/diskann-explained.md"><strong>o DISKANN</strong></a> quanto <strong>o AISAQ</strong> foram criados com base nessa mesma tensão, mas fazem escolhas arquitetônicas diferentes sobre como e onde esses custos são pagos.</p>
<h2 id="How-DISKANN-Optimizes-Disk-Based-Vector-Search" class="common-anchor-header">Como o DISKANN otimiza a pesquisa vetorial baseada em disco<button data-href="#How-DISKANN-Optimizes-Disk-Based-Vector-Search" class="anchor-icon" translate="no">
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
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/DISKANN_9c9c6a734f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>O DISKANN é a solução ANN baseada em disco mais influente até à data e serve como linha de base oficial para a competição NeurIPS Big ANN, uma referência global para pesquisa vetorial à escala de mil milhões. A sua importância não reside apenas no desempenho, mas no que provou: <strong>a pesquisa ANN baseada em grafos não tem de viver inteiramente na memória para ser rápida</strong>.</p>
<p>Ao combinar o armazenamento baseado em SSD com estruturas na memória cuidadosamente escolhidas, o DISKANN demonstrou que a pesquisa vetorial em grande escala pode atingir uma precisão elevada e uma baixa latência em hardware de base - sem necessitar de grandes volumes de DRAM. Ele faz isso repensando <em>quais partes da pesquisa devem ser rápidas</em> e <em>quais partes podem tolerar um acesso mais lento</em>.</p>
<p><strong>Em alto nível, o DISKANN mantém os dados acessados com mais freqüência na memória, enquanto move estruturas maiores e acessadas com menos freqüência para o disco.</strong> Este equilíbrio é conseguido através de várias escolhas de design importantes.</p>
<h3 id="1-Using-PQ-Distances-to-Expand-the-Candidate-List" class="common-anchor-header">1. Usando distâncias PQ para expandir a lista de candidatos</h3><p>A expansão da lista de candidatos é a operação mais frequente na pesquisa baseada em grafos. Cada expansão requer a estimativa da distância entre o vetor de consulta e os vizinhos de um nó candidato. A realização destes cálculos utilizando vectores completos e de elevada dimensão exigiria leituras aleatórias frequentes do disco - uma operação dispendiosa, tanto em termos computacionais como de E/S.</p>
<p>O DISKANN evita este custo comprimindo os vectores em <strong>códigos de Quantização do Produto (PQ)</strong> e mantendo-os na memória. Os códigos PQ são muito mais pequenos do que os vectores completos, mas ainda preservam informação suficiente para estimar aproximadamente a distância.</p>
<p>Durante a expansão de candidatos, o DISKANN calcula as distâncias utilizando estes códigos PQ na memória em vez de ler vectores completos do SSD. Isso reduz drasticamente a E/S do disco durante a travessia do grafo, permitindo que a pesquisa expanda candidatos de forma rápida e eficiente, mantendo a maior parte do tráfego do SSD fora do caminho crítico.</p>
<h3 id="2-Co-Locating-Full-Vectors-and-Neighbor-Lists-on-Disk" class="common-anchor-header">2. Co-localização de vetores completos e listas de vizinhos no disco</h3><p>Nem todos os dados podem ser compactados ou acessados aproximadamente. Uma vez identificados os candidatos promissores, a pesquisa ainda precisa de acesso a dois tipos de dados para obter resultados precisos:</p>
<ul>
<li><p><strong>Listas de vizinhos</strong>, para continuar a travessia do gráfico</p></li>
<li><p><strong>Vectores completos (não comprimidos)</strong>, para o reranking final</p></li>
</ul>
<p>Estas estruturas são acedidas com menos frequência do que os códigos PQ, pelo que o DISKANN as armazena em SSD. Para minimizar a sobrecarga do disco, o DISKANN coloca a lista de vizinhos de cada nó e o seu vetor completo na mesma região física do disco. Isso garante que uma única leitura de SSD possa recuperar ambos.</p>
<p>Ao co-localizar dados relacionados, o DISKANN reduz o número de acessos aleatórios ao disco necessários durante a pesquisa. Esta otimização melhora a eficiência da expansão e da nova classificação, especialmente em grande escala.</p>
<h3 id="3-Parallel-Node-Expansion-for-Better-SSD-Utilization" class="common-anchor-header">3. Expansão de nós paralelos para melhor utilização de SSD</h3><p>A pesquisa ANN baseada em gráficos é um processo iterativo. Se cada iteração expande apenas um nó candidato, o sistema emite apenas uma única leitura de disco por vez, deixando a maior parte da largura de banda paralela do SSD sem uso. Para evitar essa ineficiência, o DISKANN expande vários candidatos em cada iteração e envia solicitações de leitura paralela para o SSD. Essa abordagem utiliza muito melhor a largura de banda disponível e reduz o número total de iterações necessárias.</p>
<p>O parâmetro <strong>beam_width_ratio</strong> controla quantos candidatos são expandidos em paralelo: <strong>Largura do feixe = número de núcleos da CPU × razão_de_largura_do_feixe.</strong> Um rácio mais elevado alarga a pesquisa - melhorando potencialmente a precisão - mas também aumenta a computação e a E/S do disco.</p>
<p>Para compensar esta situação, o DISKANN introduz um <code translate="no">search_cache_budget_gb_ratio</code> que reserva memória para armazenar em cache os dados acedidos frequentemente, reduzindo as leituras repetidas do SSD. Em conjunto, estes mecanismos ajudam o DISKANN a equilibrar a precisão, a latência e a eficiência de E/S.</p>
<h3 id="Why-This-Matters--and-Where-the-Limits-Appear" class="common-anchor-header">Porque é que isto é importante - e onde surgem os limites</h3><p>O design do DISKANN é um grande passo em frente para a pesquisa vetorial baseada em disco. Ao manter os códigos PQ na memória e empurrar estruturas maiores para SSD, ele reduz significativamente o espaço ocupado na memória em comparação com índices de gráficos totalmente na memória.</p>
<p>Ao mesmo tempo, essa arquitetura ainda depende da <strong>DRAM sempre ativa</strong> para dados críticos de pesquisa. Os códigos PQ, caches e estruturas de controlo devem permanecer residentes na memória para manter a eficiência da travessia. À medida que os conjuntos de dados aumentam para milhares de milhões de vectores e as implementações adicionam réplicas ou regiões, esse requisito de memória pode continuar a ser um fator limitativo.</p>
<p>Essa é a lacuna que <strong>o AISAQ</strong> foi projetado para resolver.</p>
<h2 id="How-AISAQ-Works-and-Why-It-Matters" class="common-anchor-header">Como o AISAQ funciona e por que é importante<button data-href="#How-AISAQ-Works-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p>O AISAQ se baseia diretamente nas idéias centrais do DISKANN, mas introduz uma mudança crítica: ele elimina <strong>a necessidade de manter os dados de PQ na DRAM</strong>. Em vez de tratar os vectores comprimidos como estruturas críticas para a pesquisa e sempre na memória, o AISAQ move-os para SSD e redesenha a forma como os dados do grafo são dispostos no disco para preservar uma travessia eficiente.</p>
<p>Para que isso funcione, o AISAQ reorganiza o armazenamento de nós para que os dados necessários durante a pesquisa de grafos - vetores completos, listas de vizinhos e informações de PQ - sejam organizados no disco em padrões otimizados para a localidade de acesso. O objetivo não é apenas enviar mais dados para o disco mais econômico, mas fazer isso <strong>sem interromper o processo de busca descrito anteriormente</strong>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AISAQ_244e661794.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Para atender a diferentes requisitos de aplicativos, o AISAQ fornece dois modos de armazenamento baseados em disco: Desempenho e Escala. De uma perspetiva técnica, estes modos diferem principalmente na forma como os dados comprimidos PQ são armazenados e acedidos durante a pesquisa. Do ponto de vista da aplicação, estes modos respondem a dois tipos distintos de requisitos: requisitos de baixa latência, típicos da pesquisa semântica em linha e dos sistemas de recomendação, e requisitos de escala ultra-alta, típicos do RAG.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/aisaq_vs_diskann_35ebee3c64.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AISAQ-performance-Optimized-for-Speed" class="common-anchor-header">Desempenho do AISAQ: Optimizado para velocidade</h3><p>O AISAQ-performance mantém todos os dados no disco enquanto mantém uma baixa sobrecarga de E/S através da colocação de dados.</p>
<p>Neste modo:</p>
<ul>
<li><p>O vetor completo de cada nó, a lista de arestas e os códigos PQ dos seus vizinhos são armazenados em conjunto no disco.</p></li>
<li><p>A visita a um nó continua a exigir apenas uma <strong>única leitura de SSD</strong>, porque todos os dados necessários para a expansão e avaliação dos candidatos estão colocados.</p></li>
</ul>
<p>Do ponto de vista do algoritmo de pesquisa, isto reflecte de perto o padrão de acesso do DISKANN. A expansão de candidatos continua a ser eficiente e o desempenho em tempo de execução é comparável, apesar de todos os dados críticos para a pesquisa residirem agora no disco.</p>
<p>A contrapartida é a sobrecarga de armazenamento. Como os dados PQ de um vizinho podem aparecer em páginas de disco de vários nós, esse layout introduz redundância e aumenta significativamente o tamanho geral do índice.</p>
<p>Por conseguinte, o modo AISAQ-Performance dá prioridade à baixa latência de E/S em detrimento da eficiência do disco. Do ponto de vista da aplicação, o modo AiSAQ-Performance pode fornecer uma latência na ordem dos 10 mSec, conforme necessário para a pesquisa semântica em linha.</p>
<h3 id="AISAQ-scale-Optimized-for-Storage-Efficiency" class="common-anchor-header">Escala AISAQ: Optimizado para eficiência de armazenamento</h3><p>O AISAQ-Scale adopta a abordagem oposta. Foi concebido para <strong>minimizar a utilização do disco</strong>, mantendo todos os dados no SSD.</p>
<p>Neste modo:</p>
<ul>
<li><p>Os dados PQ são armazenados no disco separadamente, sem redundância.</p></li>
<li><p>Isto elimina a redundância e reduz drasticamente o tamanho do índice.</p></li>
</ul>
<p>A desvantagem é que o acesso aos códigos PQ de um nó e dos seus vizinhos pode exigir <strong>várias leituras em SSD</strong>, aumentando as operações de E/S durante a expansão dos candidatos. Se não for optimizado, isto tornaria a pesquisa significativamente mais lenta.</p>
<p>Para controlar esta sobrecarga, o modo AISAQ-Scale introduz duas optimizações adicionais:</p>
<ul>
<li><p><strong>Reorganização de dados PQ</strong>, que ordena os vectores PQ por prioridade de acesso para melhorar a localidade e reduzir as leituras aleatórias.</p></li>
<li><p>Uma <strong>cache PQ na DRAM</strong> (<code translate="no">pq_read_page_cache_size</code>), que armazena dados PQ frequentemente acedidos e evita leituras repetidas no disco para entradas quentes.</p></li>
</ul>
<p>Com estas optimizações, o modo AISAQ-Scale consegue uma eficiência de armazenamento muito melhor do que o AISAQ-Performance, mantendo o desempenho prático da pesquisa. Esse desempenho continua a ser inferior ao do DISKANN, mas não há sobrecarga de armazenamento (o tamanho do índice é semelhante ao do DISKANN) e a pegada de memória é muito menor. Do ponto de vista da aplicação, o AiSAQ fornece os meios para cumprir os requisitos RAG em escala ultraelevada.</p>
<h3 id="Key-Advantages-of-AISAQ" class="common-anchor-header">Principais vantagens do AISAQ</h3><p>Ao mover todos os dados críticos de pesquisa para o disco e ao redesenhar a forma como esses dados são acedidos, o AISAQ altera fundamentalmente o perfil de custo e escalabilidade da pesquisa vetorial baseada em grafos. O seu design oferece três vantagens significativas.</p>
<p><strong>1. Uso de DRAM até 3.200 vezes menor</strong></p>
<p>A Quantização de Produtos reduz significativamente o tamanho de vectores de elevada dimensão, mas à escala de mil milhões, o espaço de memória continua a ser substancial. Mesmo após a compressão, os códigos PQ têm de ser mantidos na memória durante a pesquisa em concepções convencionais.</p>
<p>Por exemplo, no <strong>SIFT1B</strong>, um parâmetro de referência com mil milhões de vectores de 128 dimensões, os códigos PQ requerem, por si só, cerca de <strong>30-120 GB de DRAM</strong>, dependendo da configuração. Armazenar os vectores completos e não comprimidos exigiria <strong> cerca de 480 GB</strong> adicionais. Embora o PQ reduza a utilização de memória em 4-16×, a pegada restante continua a ser suficientemente grande para dominar o custo da infraestrutura.</p>
<p>O AISAQ elimina totalmente este requisito. Ao armazenar códigos PQ em SSD em vez de DRAM, a memória deixa de ser consumida por dados de índice persistentes. A DRAM é utilizada apenas para estruturas leves e transitórias, como listas de candidatos e metadados de controlo. Na prática, isso reduz o uso de memória de dezenas de gigabytes para <strong>cerca de 10 MB</strong>. Numa configuração representativa à escala de mil milhões, a DRAM cai de <strong>32 GB para 10 MB</strong>, uma <strong>redução de 3200 vezes</strong>.</p>
<p>Dado que o armazenamento SSD custa cerca de <strong>1/30 do preço por unidade de capacidade</strong> em comparação com a DRAM, esta mudança tem um impacto direto e dramático no custo total do sistema.</p>
<p><strong>2. Sem sobrecarga adicional de E/S</strong></p>
<p>Mover os códigos PQ da memória para o disco normalmente aumentaria o número de operações de E/S durante a pesquisa. O AISAQ evita isso controlando cuidadosamente a <strong>disposição dos dados e os padrões de acesso</strong>. Em vez de espalhar os dados relacionados pelo disco, o AISAQ coloca os códigos PQ, os vectores completos e as listas de vizinhos de forma a poderem ser recuperados em conjunto. Isto garante que a expansão de candidatos não introduz leituras aleatórias adicionais.</p>
<p>Para dar aos utilizadores controlo sobre o compromisso entre o tamanho do índice e a eficiência de E/S, o AISAQ introduz o parâmetro <code translate="no">inline_pq</code>, que determina a quantidade de dados PQ armazenados em linha com cada nó:</p>
<ul>
<li><p><strong>Menor inline_pq:</strong> menor tamanho do índice, mas pode exigir E/S extra</p></li>
<li><p><strong>Inline_pq mais alto:</strong> tamanho de índice maior, mas preserva o acesso de leitura única</p></li>
</ul>
<p>Quando configurado com <strong>inline_pq = max_degree</strong>, o AISAQ lê o vetor completo de um nó, a lista de vizinhos e todos os códigos PQ numa única operação de disco, correspondendo ao padrão de E/S do DISKANN e mantendo todos os dados no SSD.</p>
<p><strong>3. O acesso sequencial a PQ melhora a eficiência da computação</strong></p>
<p>Na DISKANN, a expansão de um nó candidato requer R acessos aleatórios à memória para obter os códigos PQ dos seus R vizinhos. O AISAQ elimina esta aleatoriedade recuperando todos os códigos PQ numa única E/S e armazenando-os sequencialmente no disco.</p>
<p>A disposição sequencial oferece duas vantagens importantes:</p>
<ul>
<li><p><strong>As leituras sequenciais em SSD são muito mais rápidas</strong> do que as leituras aleatórias dispersas.</p></li>
<li><p><strong>Os dados contíguos são mais fáceis de armazenar em cache</strong>, permitindo que as CPUs calculem as distâncias PQ com mais eficiência.</p></li>
</ul>
<p>Isso melhora a velocidade e a previsibilidade dos cálculos de distância PQ e ajuda a compensar o custo de desempenho do armazenamento de códigos PQ em SSD em vez de DRAM.</p>
<h2 id="AISAQ-vs-DISKANN-Performance-Evaluation" class="common-anchor-header">AISAQ vs. DISKANN: Avaliação do desempenho<button data-href="#AISAQ-vs-DISKANN-Performance-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>Depois de compreender como o AISAQ difere arquitetonicamente do DISKANN, a próxima questão é simples: <strong>como é que estas escolhas de design afectam o desempenho e a utilização de recursos na prática?</strong> Esta avaliação compara o AISAQ e o DISKANN em três dimensões que são mais importantes numa escala de mil milhões: <strong>desempenho de pesquisa, consumo de memória e utilização de disco</strong>.</p>
<p>Em particular, examinamos como o AISAQ se comporta à medida que a quantidade de dados PQ embutidos (<code translate="no">INLINE_PQ</code>) muda. Este parâmetro controla diretamente o compromisso entre o tamanho do índice, a E/S do disco e a eficiência do tempo de execução. Também avaliamos ambas as abordagens em <strong>cargas de trabalho vectoriais de baixa e alta dimensão, uma vez que a dimensionalidade influencia fortemente o custo do cálculo da distância e</strong> os requisitos de armazenamento.</p>
<h3 id="Setup" class="common-anchor-header">Configuração</h3><p>Todas as experiências foram realizadas num sistema de nó único para isolar o comportamento do índice e evitar a interferência de efeitos de rede ou de sistema distribuído.</p>
<p><strong>Configuração de hardware:</strong></p>
<ul>
<li><p>CPU: CPU Intel® Xeon® Platinum 8375C @ 2,90GHz</p></li>
<li><p>Memória: Velocidade: 3200 MT/s, Tipo: DDR4, Tamanho: 32 GB</p></li>
<li><p>Disco: SSD NVMe de 500 GB</p></li>
</ul>
<p><strong>Parâmetros de criação de índice</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;max_degree&quot;</span>: <span class="hljs-number">48</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;inline_pq&quot;</span>: <span class="hljs-number">0</span>/<span class="hljs-number">12</span>/<span class="hljs-number">24</span>/<span class="hljs-number">48</span>,  <span class="hljs-comment">// AiSAQ only</span>
  <span class="hljs-string">&quot;pq_code_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.125</span>,
  <span class="hljs-string">&quot;search_cache_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.0</span>,
  <span class="hljs-string">&quot;build_dram_budget_gb&quot;</span>: <span class="hljs-number">32.0</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Parâmetros de consulta</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;k&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;beamwidth&quot;</span>: <span class="hljs-number">8</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmark-Method" class="common-anchor-header">Método de referência</h3><p>Tanto o DISKANN quanto o AISAQ foram testados usando <a href="https://milvus.io/docs/knowhere.md">o Knowhere</a>, o mecanismo de pesquisa vetorial de código aberto usado no Milvus. Dois conjuntos de dados foram usados nesta avaliação:</p>
<ul>
<li><p><strong>SIFT128D (1M de vectores):</strong> um conhecido parâmetro de referência de 128 dimensões normalmente utilizado para a pesquisa de descritores de imagem. <em>(Tamanho do conjunto de dados em bruto ≈ 488 MB)</em></p></li>
<li><p><strong>Cohere768D (1M vectores):</strong> um conjunto de incorporação de 768 dimensões típico da pesquisa semântica baseada em transformadores. <em>(Tamanho do conjunto de dados em bruto ≈ 2930 MB)</em></p></li>
</ul>
<p>Estes conjuntos de dados reflectem dois cenários distintos do mundo real: caraterísticas de visão compactas e grandes incorporações semânticas.</p>
<h3 id="Results" class="common-anchor-header">Resultados</h3><p><strong>Sift128D1M (Vetor completo ~488MB)</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/aisaq_53da7b566a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Cohere768D1M (Vetor completo ~2930MB)</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Cohere768_D1_M_8dfa3dffb7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Analysis" class="common-anchor-header">Análise</h3><p><strong>Conjunto de dados SIFT128D</strong></p>
<p>No conjunto de dados SIFT128D, o AISAQ pode igualar o desempenho do DISKANN quando todos os dados PQ são alinhados de modo a que os dados necessários de cada nó caibam inteiramente numa única página SSD de 4 KB (INLINE_PQ = 48). Com esta configuração, todas as informações necessárias durante a pesquisa são colocalizadas:</p>
<ul>
<li><p>Vetor completo: 512B</p></li>
<li><p>Lista de vizinhos: 48 × 4 + 4 = 196B</p></li>
<li><p>Códigos PQ dos vizinhos: 48 × (512B × 0,125) ≈ 3072B</p></li>
<li><p>Total: 3780B</p></li>
</ul>
<p>Como todo o nó cabe numa página, só é necessária uma E/S por acesso e o AISAQ evita leituras aleatórias de dados PQ externos.</p>
<p>No entanto, quando apenas uma parte dos dados PQ é inlined, os restantes códigos PQ têm de ser obtidos a partir de outro local no disco. Isso introduz operações de E/S aleatórias adicionais, que aumentam drasticamente a demanda de IOPS e levam a quedas significativas no desempenho.</p>
<p><strong>Conjunto de dados Cohere768D</strong></p>
<p>No conjunto de dados Cohere768D, o AISAQ tem um desempenho pior do que o DISKANN. A razão é que um vetor de 768 dimensões simplesmente não cabe numa página SSD de 4 KB:</p>
<ul>
<li><p>Vetor completo: 3072B</p></li>
<li><p>Lista de vizinhos: 48 × 4 + 4 = 196B</p></li>
<li><p>Códigos PQ dos vizinhos: 48 × (3072B × 0,125) ≈ 18432B</p></li>
<li><p>Total: 21.700 B (≈ 6 páginas)</p></li>
</ul>
<p>Neste caso, mesmo que todos os códigos PQ sejam inlined, cada nó abrange várias páginas. Embora o número de operações de E/S se mantenha consistente, cada E/S tem de transferir muito mais dados, consumindo a largura de banda do SSD muito mais rapidamente. Quando a largura de banda se torna o fator limitante, o AISAQ não consegue acompanhar o ritmo do DISKANN - especialmente em cargas de trabalho de alta dimensão, em que as pegadas de dados por nó crescem rapidamente.</p>
<p><strong>Observação:</strong></p>
<p>O layout de armazenamento do AISAQ normalmente aumenta o tamanho do índice no disco em <strong>4× a 6×</strong>. Trata-se de um compromisso deliberado: vectores completos, listas de vizinhos e códigos PQ são colocados no disco para permitir um acesso eficiente de página única durante a pesquisa. Embora isso aumente o uso de SSD, a capacidade do disco é significativamente mais barata do que a DRAM e é mais fácil de escalar em grandes volumes de dados.</p>
<p>Na prática, os utilizadores podem ajustar este compromisso ajustando as taxas de compressão <code translate="no">INLINE_PQ</code> e PQ. Esses parâmetros possibilitam equilibrar o desempenho da pesquisa, o espaço ocupado em disco e o custo geral do sistema com base nos requisitos da carga de trabalho, em vez de serem restringidos por limites fixos de memória.</p>
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
    </button></h2><p>A economia do hardware moderno está a mudar. Os preços da DRAM continuam altos, enquanto o desempenho da SSD avançou rapidamente - as unidades CIe 5.0 agora oferecem largura de banda superior a <strong>14 GB/s</strong>. Como resultado, as arquiteturas que transferem dados críticos de pesquisa da cara DRAM para um armazenamento SSD muito mais acessível estão se tornando cada vez mais atraentes. Com a capacidade da SSD custando <strong>menos de 30 vezes mais por gigabyte do que</strong> a DRAM, essas diferenças não são mais marginais - elas influenciam significativamente o design do sistema.</p>
<p>O AISAQ reflete essa mudança. Ao eliminar a necessidade de grandes alocações de memória sempre ativa, ele permite que os sistemas de pesquisa vetorial sejam dimensionados com base no tamanho dos dados e nos requisitos de carga de trabalho, e não nos limites de DRAM. Essa abordagem está alinhada com uma tendência mais ampla de arquiteturas "all-in-storage", em que SSDs rápidas desempenham um papel central não apenas na persistência, mas na computação e pesquisa ativas. Ao oferecer dois modos de operação - Desempenho e Escala - o AiSAQ atende aos requisitos da pesquisa semântica (que exige a menor latência) e do RAG (que exige escala muito alta, mas latência moderada).</p>
<p>É pouco provável que esta mudança se limite às bases de dados vectoriais. Já estão a surgir padrões de conceção semelhantes no processamento de grafos, na análise de séries temporais e até mesmo em partes dos sistemas relacionais tradicionais, à medida que os programadores repensam os pressupostos de longa data sobre o local onde os dados devem residir para obter um desempenho aceitável. À medida que a economia do hardware continua a evoluir, as arquitecturas de sistemas seguir-se-ão.</p>
<p>Para obter mais detalhes sobre os projetos discutidos aqui, consulte a documentação:</p>
<ul>
<li><p><a href="https://milvus.io/docs/aisaq.md">AISAQ | Documentação Milvus</a></p></li>
<li><p><a href="https://milvus.io/docs/diskann.md">DISKANN | Documentação da Milvus</a></p></li>
</ul>
<p>Tem dúvidas ou deseja aprofundar qualquer caraterística do Milvus mais recente? Junte-se ao nosso<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> ou registe problemas no<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Também pode reservar uma sessão individual de 20 minutos para obter informações, orientação e respostas às suas perguntas através do<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Saiba mais sobre os recursos do Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Apresentando Milvus 2.6: Pesquisa Vetorial Acessível em Escala de Bilhões</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Apresentando a função Embedding: Como o Milvus 2.6 agiliza a vetorização e a busca semântica</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">JSON Shredding em Milvus: Filtragem JSON 88,9x mais rápida com flexibilidade</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Desbloqueando a verdadeira recuperação em nível de entidade: Novas capacidades de Array-of-Structs e MAX_SIM em Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH em Milvus: A arma secreta para combater duplicatas em dados de treinamento LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Leve a compressão vetorial ao extremo: como o Milvus atende a 3× mais consultas com o RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Os benchmarks mentem - os bancos de dados vetoriais merecem um teste real </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Substituímos o Kafka/Pulsar por um pica-pau para o Milvus </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Pesquisa vetorial no mundo real: como filtrar com eficiência sem prejudicar a recuperação</a></p></li>
</ul>
