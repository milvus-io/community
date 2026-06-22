---
id: >-
  introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
title: >
  Apresentamos o AISAQ no Milvus: a pesquisa de vetores à escala de mil milhões
  ficou agora 3 200 vezes mais económica em termos de memória
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
  permitindo uma pesquisa escalável de milhares de milhões de vetores sem
  sobrecarga de DRAM.
origin: >-
  https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md
---
<p>As bases de dados vetoriais tornaram-se uma infraestrutura essencial para sistemas de IA de missão crítica, e os seus volumes de dados estão a crescer exponencialmente — atingindo frequentemente milhares de milhões de vetores. A essa escala, tudo se torna mais difícil: manter uma baixa latência, preservar a precisão, garantir a fiabilidade e operar em réplicas e regiões. Mas há um desafio que tende a surgir logo no início e a dominar as decisões arquitetónicas:<strong>o CUSTO.</strong></p>
<p>Para proporcionar uma pesquisa rápida, a maioria das bases de dados vetoriais mantém as principais estruturas de indexação na DRAM (Memória Dinâmica de Acesso Aleatório), o nível de memória mais rápido e mais caro. Este design é eficaz em termos de desempenho, mas apresenta fraca escalabilidade. A utilização da DRAM escala com o tamanho dos dados, em vez de com o tráfego de consultas, e mesmo com compressão ou descarregamento parcial para SSD, grandes partes do índice têm de permanecer na memória. À medida que os conjuntos de dados crescem, os custos de memória tornam-se rapidamente um fator limitante.</p>
<p>O Milvus já suporta <strong>o DISKANN</strong>, uma abordagem de ANN (Rede Neural Artificial) baseada em disco que reduz a pressão sobre a memória, transferindo grande parte do índice para o SSD. No entanto, o DISKANN ainda depende da DRAM para as representações comprimidas utilizadas durante a pesquisa. <a href="https://milvus.io/docs/release_notes.md#v264">O Milvus 2.6</a> vai mais além com <a href="https://milvus.io/docs/aisaq.md">o AISAQ</a>, um índice vetorial baseado em disco inspirado no <a href="https://milvus.io/docs/diskann.md">DISKANN</a>. Desenvolvida pela KIOXIA, a arquitetura do AiSAQ foi concebida com uma «Arquitetura de Pegada Zero de DRAM», que armazena todos os dados essenciais à pesquisa no disco e otimiza a colocação dos dados para minimizar as operações de E/S. Numa carga de trabalho de mil milhões de vetores, isto reduz a utilização de memória de <strong>32 GB para cerca de 10 MB</strong>— uma <strong>redução de 3 200 vezes</strong>—, mantendo ao mesmo tempo um desempenho prático.</p>
<p>Nas secções que se seguem, explicamos como funciona a pesquisa vetorial baseada em grafos, de onde provêm os custos de memória e como o AiSAQ redimensiona a curva de custos para a pesquisa vetorial à escala de mil milhões.</p>
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
    </button></h2><p><strong>A pesquisa de vetores</strong> é o processo de encontrar pontos de dados cujas representações numéricas sejam as mais próximas de uma consulta num espaço de alta dimensão. «Mais próximo» significa simplesmente a menor distância de acordo com uma função de distância, como a distância cosseno ou a distância L2. Em pequena escala, isto é simples: calcula-se a distância entre a consulta e cada vetor e, em seguida, devolvem-se os mais próximos. Em grande escala, por exemplo, na ordem dos mil milhões, esta abordagem torna-se rapidamente demasiado lenta para ser prática.</p>
<p>Para evitar comparações exaustivas, os sistemas modernos de pesquisa aproximada do vizinho mais próximo (ANNS) baseiam-se em <strong>índices baseados em grafos</strong>. Em vez de comparar uma consulta com cada vetor, o índice organiza os vetores num <strong>grafo</strong>. Cada nó representa um vetor e as arestas ligam os vetores que estão numericamente próximos. Esta estrutura permite ao sistema restringir drasticamente o espaço de pesquisa.</p>
<p>O grafo é construído antecipadamente, com base exclusivamente nas relações entre os vetores. Não depende das consultas. Quando chega uma consulta, a tarefa do sistema é <strong>navegar pelo grafo de forma eficiente</strong> e identificar os vetores com a menor distância em relação à consulta — sem analisar todo o conjunto de dados.</p>
<p>A pesquisa começa a partir de um <strong>ponto de entrada</strong> predefinido no grafo. Este ponto de partida pode estar longe da consulta, mas o algoritmo melhora a sua posição passo a passo, avançando em direção aos vetores que parecem estar mais próximos da consulta. Durante este processo, a pesquisa mantém duas estruturas de dados internas que funcionam em conjunto: uma <strong>lista de candidatos</strong> e uma <strong>lista de resultados</strong>.</p>
<p>E os dois passos mais importantes durante este processo são a expansão da lista de candidatos e a atualização da lista de resultados.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/whiteboard_exported_image_84f8324275.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Expanding-the-Candidate-List" class="common-anchor-header">Expandir a Lista de Candidatos</h3><p><strong>A lista de candidatos</strong> representa para onde a pesquisa pode avançar a seguir. Trata-se de um conjunto priorizado de nós do grafo que parecem promissores com base na sua distância em relação à consulta.</p>
<p>Em cada iteração, o algoritmo:</p>
<ul>
<li><p><strong>Seleciona o candidato mais próximo descoberto até ao momento.</strong> A partir da lista de candidatos, escolhe o vetor com a menor distância em relação à consulta.</p></li>
<li><p><strong>Recupera os vizinhos desse vetor a partir do grafo.</strong> Estes vizinhos são vetores que foram identificados durante a construção do índice como estando próximos do vetor atual.</p></li>
<li><p><strong>Avalia os vizinhos ainda não visitados e adiciona-os à lista de candidatos.</strong> Para cada vizinho que ainda não tenha sido explorado, o algoritmo calcula a sua distância em relação à consulta. Os vizinhos visitados anteriormente são ignorados, enquanto os novos vizinhos são inseridos na lista de candidatos se parecerem promissores.</p></li>
</ul>
<p>Ao expandir repetidamente a lista de candidatos, a pesquisa explora regiões cada vez mais relevantes do grafo. Isto permite que o algoritmo avance de forma constante em direção a melhores respostas, examinando apenas uma pequena fração de todos os vetores.</p>
<h3 id="Updating-the-Result-List" class="common-anchor-header">Atualização da lista de resultados</h3><p>Ao mesmo tempo, o algoritmo mantém uma <strong>lista de resultados</strong>, que regista os melhores candidatos encontrados até ao momento para o resultado final. À medida que a pesquisa avança, o algoritmo:</p>
<ul>
<li><p><strong>Acompanha os vetores mais próximos encontrados durante a percussão.</strong> Estes incluem vetores selecionados para expansão, bem como outros avaliados ao longo do percurso.</p></li>
<li><p><strong>Armazena as suas distâncias em relação à consulta.</strong> Isto permite classificar os candidatos e manter os atuais K vizinhos mais próximos.</p></li>
</ul>
<p>Com o tempo, à medida que mais candidatos são avaliados e se encontram menos melhorias, a lista de resultados estabiliza-se. Quando for improvável que uma exploração mais aprofundada do grafo produza vetores mais próximos, a pesquisa termina e devolve a lista de resultados como resposta final.</p>
<p>Em termos simples, a <strong>lista de candidatos controla a exploração</strong>, enquanto a <strong>lista de resultados capta as melhores respostas descobertas até ao momento</strong>.</p>
<h2 id="The-Trade-Off-in-Graph-Based-Vector-Search" class="common-anchor-header">O compromisso na pesquisa de vetores baseada em grafos<button data-href="#The-Trade-Off-in-Graph-Based-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>É esta abordagem baseada em grafos que torna a pesquisa de vetores em grande escala prática, em primeiro lugar. Ao navegar pelo grafo em vez de analisar cada vetor, o sistema consegue encontrar resultados de alta qualidade, abordando apenas uma pequena fração do conjunto de dados.</p>
<p>No entanto, esta eficiência tem o seu preço. A pesquisa baseada em grafos expõe um compromisso fundamental entre <strong>precisão e custo.</strong></p>
<ul>
<li><p>Explorar mais vizinhos melhora a precisão, cobrindo uma porção maior do grafo e reduzindo a probabilidade de deixar escapar os verdadeiros vizinhos mais próximos.</p></li>
<li><p>Ao mesmo tempo, cada expansão adicional implica mais trabalho: mais cálculos de distância, mais acessos à estrutura do grafo e mais leituras de dados vetoriais. À medida que a pesquisa se aprofunda ou se alarga, estes custos acumulam-se. Dependendo da forma como o índice foi concebido, manifestam-se como um maior consumo de CPU, um aumento da pressão sobre a memória ou E/S de disco adicional.</p></li>
</ul>
<p>Equilibrar estas forças opostas — elevada taxa de recuperação versus utilização eficiente de recursos — é fundamental para a conceção da pesquisa baseada em grafos.</p>
<p>Tanto <a href="https://milvus.io/blog/diskann-explained.md"><strong>o DISKANN</strong></a> como <strong>o AISAQ</strong> assentam nesta mesma tensão, mas fazem escolhas arquitetónicas diferentes sobre como e onde estes custos são suportados.</p>
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
<p>O DISKANN é a solução de ANN baseada em disco mais influente até à data e serve como referência oficial para a competição NeurIPS Big ANN, um benchmark global para a pesquisa vetorial na escala de milhares de milhões. A sua importância reside não apenas no desempenho, mas no que provou: <strong>a pesquisa ANN baseada em grafos não precisa de residir inteiramente na memória para ser rápida</strong>.</p>
<p>Ao combinar armazenamento baseado em SSD com estruturas em memória cuidadosamente selecionadas, o DISKANN demonstrou que a pesquisa vetorial em grande escala pode alcançar elevada precisão e baixa latência em hardware comum — sem exigir grandes quantidades de DRAM. Consegue-o repensando <em>quais as partes da pesquisa que têm de ser rápidas</em> e <em>quais as que podem tolerar um acesso mais lento</em>.</p>
<p><strong>A um nível geral, o DISKANN mantém os dados acedidos com maior frequência na memória, enquanto transfere as estruturas maiores e menos acedidas para o disco.</strong> Este equilíbrio é alcançado através de várias escolhas-chave de conceção.</p>
<h3 id="1-Using-PQ-Distances-to-Expand-the-Candidate-List" class="common-anchor-header">1. Utilização de distâncias PQ para expandir a lista de candidatos</h3><p>A expansão da lista de candidatos é a operação mais frequente na pesquisa baseada em grafos. Cada expansão requer a estimativa da distância entre o vetor de consulta e os vizinhos de um nó candidato. Realizar estes cálculos utilizando vetores completos e de alta dimensão exigiria leituras aleatórias frequentes a partir do disco — uma operação dispendiosa tanto do ponto de vista computacional como em termos de E/S.</p>
<p>O DISKANN evita este custo comprimindo os vetores em <strong>códigos de Quantização de Produto (PQ)</strong> e mantendo-os na memória. Os códigos PQ são muito mais pequenos do que os vetores completos, mas preservam informação suficiente para estimar a distância de forma aproximada.</p>
<p>Durante a expansão dos candidatos, o DISKANN calcula as distâncias utilizando estes códigos PQ na memória, em vez de ler vetores completos a partir do SSD. Isto reduz drasticamente a E/S do disco durante a percussão do grafo, permitindo que a pesquisa expanda os candidatos de forma rápida e eficiente, mantendo ao mesmo tempo a maior parte do tráfego do SSD fora do caminho crítico.</p>
<h3 id="2-Co-Locating-Full-Vectors-and-Neighbor-Lists-on-Disk" class="common-anchor-header">2. Colocação conjunta de vetores completos e listas de vizinhos no disco</h3><p>Nem todos os dados podem ser comprimidos ou acedidos de forma aproximada. Depois de identificados candidatos promissores, a pesquisa continua a necessitar de acesso a dois tipos de dados para obter resultados precisos:</p>
<ul>
<li><p><strong>Listas de vizinhos</strong>, para continuar a percussão do grafo</p></li>
<li><p><strong>Vetores completos (não comprimidos)</strong>, para a reclassificação final</p></li>
</ul>
<p>Estas estruturas são acedidas com menos frequência do que os códigos PQ, pelo que o DISKANN as armazena no SSD. Para minimizar a sobrecarga do disco, o DISKANN coloca a lista de vizinhos de cada nó e o seu vetor completo na mesma região física do disco. Isto garante que uma única leitura do SSD possa recuperar ambos.</p>
<p>Ao agrupar dados relacionados, o DISKANN reduz o número de acessos aleatórios ao disco necessários durante a pesquisa. Esta otimização melhora a eficiência tanto da expansão como da reclassificação, especialmente em grande escala.</p>
<h3 id="3-Parallel-Node-Expansion-for-Better-SSD-Utilization" class="common-anchor-header">3. Expansão paralela de nós para uma melhor utilização do SSD</h3><p>A pesquisa ANN baseada em grafos é um processo iterativo. Se cada iteração expandir apenas um nó candidato, o sistema emite apenas uma única leitura do disco de cada vez, deixando a maior parte da largura de banda paralela do SSD por utilizar. Para evitar esta ineficiência, o DISKANN expande vários candidatos em cada iteração e envia pedidos de leitura paralelos para o SSD. Esta abordagem aproveita muito melhor a largura de banda disponível e reduz o número total de iterações necessárias.</p>
<p>O parâmetro <strong>`beam_width_ratio`</strong> controla quantos candidatos são expandidos em paralelo: <strong>Largura do feixe = número de núcleos da CPU × `beam_width_ratio`.</strong> Uma relação mais elevada alarga a pesquisa — potencialmente melhorando a precisão — mas também aumenta a computação e a E/S do disco.</p>
<p>Para compensar isto, o DISKANN introduz um mecanismo de armazenamento em cache de dados em espera ( <code translate="no">search_cache_budget_gb_ratio</code> ) que reserva memória para armazenar em cache dados acedidos com frequência, reduzindo as leituras repetidas no SSD. Em conjunto, estes mecanismos ajudam o DISKANN a equilibrar a precisão, a latência e a eficiência de E/S.</p>
<h3 id="Why-This-Matters--and-Where-the-Limits-Appear" class="common-anchor-header">Por que é que isto é importante — e onde surgem os limites</h3><p>O design do DISKANN representa um grande passo em frente para a pesquisa vetorial baseada em disco. Ao manter os códigos PQ na memória e transferir estruturas maiores para o SSD, reduz significativamente a pegada de memória em comparação com os índices de grafos totalmente na memória.</p>
<p>Ao mesmo tempo, esta arquitetura continua a depender de <strong>DRAM sempre ativa</strong> para dados críticos para a pesquisa. Os códigos PQ, as caches e as estruturas de controlo têm de permanecer residentes na memória para manter a eficiência da traversal. À medida que os conjuntos de dados crescem para milhares de milhões de vetores e as implementações adicionam réplicas ou regiões, esse requisito de memória pode ainda tornar-se um fator limitante.</p>
<p>É esta lacuna que <strong>o AISAQ</strong> foi concebido para colmatar.</p>
<h2 id="How-AISAQ-Works-and-Why-It-Matters" class="common-anchor-header">Como funciona o AISAQ e por que é importante<button data-href="#How-AISAQ-Works-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p>O AISAQ baseia-se diretamente nas ideias centrais por trás do DISKANN, mas introduz uma mudança fundamental: elimina <strong>a necessidade de manter os dados PQ na DRAM</strong>. Em vez de tratar os vetores comprimidos como estruturas críticas para a pesquisa e sempre na memória, o AISAQ transfere-os para o SSD e redesenha a forma como os dados do grafo são dispostos no disco para preservar a eficiência da traversal.</p>
<p>Para que isto funcione, o AISAQ reorganiza o armazenamento dos nós de forma a que os dados necessários durante a pesquisa no grafo — vetores completos, listas de vizinhos e informações PQ — sejam dispostos no disco em padrões otimizados para a localidade de acesso. O objetivo não é apenas transferir mais dados para o disco, que é mais económico, mas fazê-lo <strong>sem comprometer o processo de pesquisa descrito anteriormente</strong>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AISAQ_244e661794.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Para responder aos diferentes requisitos das aplicações, o AISAQ disponibiliza dois modos de armazenamento baseados em disco: Desempenho e Escala. De uma perspetiva técnica, estes modos diferem principalmente na forma como os dados comprimidos por PQ são armazenados e acedidos durante a pesquisa. Do ponto de vista da aplicação, estes modos respondem a dois tipos distintos de requisitos: requisitos de baixa latência, típicos da pesquisa semântica online e dos sistemas de recomendação, e requisitos de escala ultra-elevada, típicos do RAG.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/aisaq_vs_diskann_35ebee3c64.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AISAQ-performance-Optimized-for-Speed" class="common-anchor-header">AISAQ-performance: Otimizado para a velocidade</h3><p>O AISAQ-performance mantém todos os dados no disco, ao mesmo tempo que mantém uma baixa sobrecarga de E/S através da colocalização de dados.</p>
<p>Neste modo:</p>
<ul>
<li><p>O vetor completo de cada nó, a lista de arestas e os códigos PQ dos seus vizinhos são armazenados em conjunto no disco.</p></li>
<li><p>A visita a um nó continua a requerer apenas uma <strong>única leitura do SSD</strong>, uma vez que todos os dados necessários para a expansão e avaliação de candidatos estão colocados no mesmo local.</p></li>
</ul>
<p>Do ponto de vista do algoritmo de pesquisa, isto reflete de perto o padrão de acesso do DISKANN. A expansão de candidatos continua a ser eficiente e o desempenho em tempo de execução é comparável, apesar de todos os dados críticos para a pesquisa se encontrarem agora no disco.</p>
<p>A contrapartida é a sobrecarga de armazenamento. Como os dados PQ de um vizinho podem aparecer em páginas de disco de vários nós, este layout introduz redundância e aumenta significativamente o tamanho global do índice.</p>
<p>Por conseguinte, o modo AISAQ-Performance dá prioridade a uma baixa latência de E/S em detrimento da eficiência do disco. Do ponto de vista da aplicação, o modo AISAQ-Performance pode proporcionar uma latência na ordem dos 10 mSeg, tal como exigido pela pesquisa semântica online.</p>
<h3 id="AISAQ-scale-Optimized-for-Storage-Efficiency" class="common-anchor-header">AISAQ-Scale: Otimizado para eficiência de armazenamento</h3><p>O AISAQ-Scale adota a abordagem oposta. Foi concebido para <strong>minimizar a utilização do disco</strong>, mantendo, ao mesmo tempo, todos os dados num SSD.</p>
<p>Neste modo:</p>
<ul>
<li><p>Os dados PQ são armazenados no disco separadamente, sem redundância.</p></li>
<li><p>Isto elimina a redundância e reduz drasticamente o tamanho do índice.</p></li>
</ul>
<p>A desvantagem é que o acesso aos códigos PQ de um nó e dos seus vizinhos pode exigir <strong>várias leituras do SSD</strong>, aumentando as operações de E/S durante a expansão dos candidatos. Se não for otimizado, isto tornaria a pesquisa significativamente mais lenta.</p>
<p>Para controlar esta sobrecarga, o modo AISAQ-Scale introduz duas otimizações adicionais:</p>
<ul>
<li><p><strong>Reorganização dos dados PQ</strong>, que ordena os vetores PQ por prioridade de acesso para melhorar a localidade e reduzir as leituras aleatórias.</p></li>
<li><p>Um <strong>cache PQ na DRAM</strong> (<code translate="no">pq_read_page_cache_size</code>), que armazena dados PQ acedidos com frequência e evita leituras repetidas no disco para entradas mais utilizadas.</p></li>
</ul>
<p>Com estas otimizações, o modo AISAQ-Scale alcança uma eficiência de armazenamento muito superior à do AISAQ-Performance, mantendo simultaneamente um desempenho prático de pesquisa. Esse desempenho continua a ser inferior ao do DISKANN, mas não há sobrecarga de armazenamento (o tamanho do índice é semelhante ao do DISKANN) e a pegada de memória é drasticamente menor. Do ponto de vista da aplicação, o AiSAQ fornece os meios para satisfazer os requisitos do RAG em escala ultra-elevada.</p>
<h3 id="Key-Advantages-of-AISAQ" class="common-anchor-header">Principais vantagens do AISAQ</h3><p>Ao transferir todos os dados críticos para a pesquisa para o disco e redesenhar a forma como esses dados são acedidos, o AISAQ altera fundamentalmente o perfil de custo e escalabilidade da pesquisa vetorial baseada em grafos. O seu design oferece três vantagens significativas.</p>
<p><strong>1. Utilização de DRAM até 3 200 vezes menor</strong></p>
<p>A Quantização de Produto (Product Quantization) reduz significativamente o tamanho dos vetores de alta dimensão, mas, na escala dos milhares de milhões, o consumo de memória continua a ser substancial. Mesmo após a compressão, os códigos PQ têm de ser mantidos na memória durante a pesquisa em designs convencionais.</p>
<p>Por exemplo, no <strong>SIFT1B</strong>, um benchmark com mil milhões de vetores de 128 dimensões, só os códigos PQ requerem cerca de <strong>30–120 GB de DRAM</strong>, dependendo da configuração. Armazenar os vetores completos e não comprimidos exigiria <strong> cerca de 480 GB</strong> adicionais. Embora a PQ reduza o consumo de memória em 4 a 16 vezes, o consumo restante continua a ser suficientemente grande para dominar os custos de infraestrutura.</p>
<p>O AISAQ elimina completamente este requisito. Ao armazenar os códigos PQ em SSD em vez de DRAM, a memória deixa de ser consumida por dados de índice persistentes. A DRAM é utilizada apenas para estruturas leves e transitórias, tais como listas de candidatos e metadados de controlo. Na prática, isto reduz o consumo de memória de dezenas de gigabytes para <strong>cerca de 10 MB</strong>. Numa configuração representativa à escala de mil milhões, a DRAM passa de <strong>32 GB para 10 MB</strong>, o que representa <strong>uma redução de 3 200 vezes</strong>.</p>
<p>Dado que o armazenamento em SSD custa aproximadamente <strong>1/30 do preço por unidade de capacidade</strong> em comparação com a DRAM, esta mudança tem um impacto direto e dramático no custo total do sistema.</p>
<p><strong>2. Sem sobrecarga adicional de E/S</strong></p>
<p>Mudar os códigos PQ da memória para o disco aumentaria normalmente o número de operações de E/S durante a pesquisa. O AISAQ evita isso através do controlo cuidadoso <strong>do layout dos dados e dos padrões de acesso</strong>. Em vez de dispersar dados relacionados pelo disco, o AISAQ agrupa os códigos PQ, os vetores completos e as listas de vizinhos para que possam ser recuperados em conjunto. Isto garante que a expansão dos candidatos não introduza leituras aleatórias adicionais.</p>
<p>Para dar aos utilizadores controlo sobre o compromisso entre o tamanho do índice e a eficiência de E/S, o AISAQ introduz o parâmetro « <code translate="no">inline_pq</code> », que determina a quantidade de dados PQ armazenados em linha com cada nó:</p>
<ul>
<li><p><strong>Valor mais baixo de `inline_pq`:</strong> tamanho de índice menor, mas pode exigir E/S adicional</p></li>
<li><p><strong>Valor mais elevado de `inline_pq`:</strong> tamanho de índice maior, mas preserva o acesso com uma única leitura</p></li>
</ul>
<p>Quando configurado com <strong>`inline_pq = max_degree</strong>`, o AISAQ lê o vetor completo de um nó, a lista de vizinhos e todos os códigos PQ numa única operação de disco, correspondendo ao padrão de E/S do DISKANN, mantendo todos os dados num SSD.</p>
<p><strong>3. O acesso sequencial ao PQ melhora a eficiência computacional</strong></p>
<p>No DISKANN, expandir um nó candidato requer R acessos aleatórios à memória para obter os códigos PQ dos seus R vizinhos. O AISAQ elimina essa aleatoriedade ao recuperar todos os códigos PQ numa única operação de E/S e armazená-los sequencialmente no disco.</p>
<p>O layout sequencial proporciona duas vantagens importantes:</p>
<ul>
<li><p><strong>As leituras sequenciais no SSD são muito mais rápidas</strong> do que as leituras aleatórias dispersas.</p></li>
<li><p><strong>Os dados contíguos são mais favoráveis ao cache</strong>, permitindo que as CPUs calculem as distâncias PQ de forma mais eficiente.</p></li>
</ul>
<p>Isto melhora tanto a velocidade como a previsibilidade dos cálculos de distância PQ e ajuda a compensar o custo de desempenho associado ao armazenamento de códigos PQ num SSD em vez de na DRAM.</p>
<h2 id="AISAQ-vs-DISKANN-Performance-Evaluation" class="common-anchor-header">AISAQ vs. DISKANN: Avaliação de Desempenho<button data-href="#AISAQ-vs-DISKANN-Performance-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>Depois de compreender como o AISAQ difere arquitetonicamente do DISKANN, a próxima questão é simples: <strong>como é que estas escolhas de design afetam o desempenho e a utilização de recursos na prática?</strong> Esta avaliação compara o AISAQ e o DISKANN em três dimensões que mais importam numa escala de mil milhões: <strong>desempenho de pesquisa, consumo de memória e utilização de disco</strong>.</p>
<p>Em particular, analisamos como o AISAQ se comporta à medida que a quantidade de dados PQ incorporados (<code translate="no">INLINE_PQ</code>) varia. Este parâmetro controla diretamente o equilíbrio entre o tamanho do índice, a E/S do disco e a eficiência em tempo de execução. Também avaliamos ambas as abordagens em <strong>cargas de trabalho vetoriais de baixa e alta dimensão, uma vez que a dimensionalidade influencia fortemente o custo do cálculo da distância e</strong> os requisitos de armazenamento.</p>
<h3 id="Setup" class="common-anchor-header">Configuração</h3><p>Todas as experiências foram realizadas num sistema de nó único para isolar o comportamento do índice e evitar interferências decorrentes de efeitos da rede ou de sistemas distribuídos.</p>
<p><strong>Configuração de hardware:</strong></p>
<ul>
<li><p>CPU: AMD EPYC 9454P a 2,70 GHz</p></li>
<li><p>Memória: Velocidade: 3200 MT/s, Tipo: DDR4, Capacidade: 384 GB</p></li>
<li><p>Disco: SSD<sup>NVMe™</sup> KIOXIA CM7 de 7,68 TB</p></li>
</ul>
<p><h6><em>AMD EPYC é uma marca registada da Advanced Micro Devices, Inc.</em></h6>
<h6><em>NVMe é uma marca registada ou não registada da NVM Express, Inc. nos Estados Unidos e noutros países.</em></h6></p>
<p><strong>Parâmetros de criação do índice</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;max_degree&quot;</span>: <span class="hljs-number">48</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">100</span>,
  <span class="hljs-string">&quot;inline_pq&quot;</span>: <span class="hljs-number">0</span>/<span class="hljs-number">20</span>/<span class="hljs-number">38</span>/<span class="hljs-number">48</span>,  <span class="hljs-comment">// KIOXIA AiSAQ only</span>
  <span class="hljs-string">&quot;pq_code_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.125</span>/<span class="hljs-number">0.04167</span>, <span class="hljs-comment">//SIFT 128: 0.125 /Cohere 768: 0.04167</span>
  <span class="hljs-string">&quot;search_cache_budget_gb_ratio&quot;</span>: <span class="hljs-number">0.0</span>,
  <span class="hljs-string">&quot;build_dram_budget_gb&quot;</span>: <span class="hljs-number">32.0</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Parâmetros de consulta</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;k&quot;</span>: <span class="hljs-number">10</span>,
  <span class="hljs-string">&quot;search_list_size&quot;</span>: <span class="hljs-number">13</span>/<span class="hljs-number">15</span>/<span class="hljs-number">16</span>/<span class="hljs-number">18</span>, // SIFT/Cohere:<span class="hljs-number">13</span>/<span class="hljs-number">16</span> <span class="hljs-keyword">for</span> DiskANN <span class="hljs-keyword">and</span> KIOXIA AiSAQ <span class="hljs-keyword">with</span> inline_pq=<span class="hljs-number">48</span>; <span class="hljs-number">15</span>/<span class="hljs-number">18</span> <span class="hljs-keyword">for</span> AiSAQ <span class="hljs-keyword">with</span> inline_pq&lt;<span class="hljs-number">48</span>
  <span class="hljs-string">&quot;beamwidth&quot;</span>: <span class="hljs-number">4</span>
  <span class="hljs-string">&quot;vectors_beamwidth&quot;</span>: <span class="hljs-number">2</span> // only <span class="hljs-keyword">for</span> AiSAQ <span class="hljs-keyword">with</span> inline_pq&lt;<span class="hljs-number">48</span>
  <span class="hljs-string">&quot;num_search_threads&quot;</span>: <span class="hljs-number">12</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Benchmark-Method" class="common-anchor-header">Método de benchmark</h3><p>Tanto o DISKANN como o AISAQ foram testados utilizando <a href="https://milvus.io/docs/knowhere.md">o Knowhere</a>, o motor de pesquisa vetorial de código aberto utilizado no Milvus. Foram utilizados dois conjuntos de dados nesta avaliação:</p>
<ul>
<li><p><strong>SIFT128D (1 milhão de vetores):</strong> um benchmark bem conhecido de 128 dimensões, frequentemente utilizado para a pesquisa de descritores de imagens. <em>(Tamanho do conjunto de dados bruto ≈ 488 MB)</em></p></li>
<li><p><strong>Cohere768D (1 milhão de vetores):</strong> um conjunto de incorporações de 768 dimensões típico da pesquisa semântica baseada em transformadores. <em>(Tamanho do conjunto de dados bruto ≈ 2930 MB)</em></p></li>
</ul>
<p>Estes conjuntos de dados refletem dois cenários distintos do mundo real: características de visão compactas e representações semânticas de grande dimensão.</p>
<h3 id="Results" class="common-anchor-header">Resultados</h3><p><strong>Sift128D1M (vetor completo ~488 MB)</strong></p>
<p><span class="img-wrapper">
  
   <img translate="no" src="/blogs/assets/sift.png" alt="SIFT recall vs latency chart" class="doc-image" id="sift-recall-vs-latency-chart" /> 
   <span>Gráfico de recall do SIFT vs. latência</span>
  
 </span></p>
<p><strong>Cohere768D1M (vetor completo ~2930 MB)</strong></p>
<p><span class="img-wrapper">
  
   <img translate="no" src="/blogs/assets/cohere.png" alt="Choere recall vs latency chart" class="doc-image" id="choere-recall-vs-latency-chart" /> 
   <span>Gráfico de recall vs. latência do Cohere</span>
  
 </span></p>
<h3 id="Analysis" class="common-anchor-header">Análise</h3><p><strong>Conjunto de dados SIFT128D</strong></p>
<p>No conjunto de dados SIFT128D, o AISAQ consegue igualar o desempenho do DISKANN quando todos os dados PQ são integrados de forma a que os dados necessários a cada nó caibam inteiramente numa única página de 4 KB do SSD (INLINE_PQ = 48). Nesta configuração, toda a informação necessária durante a pesquisa está localizada no mesmo local:</p>
<ul>
<li><p>Vetor completo: 512 B</p></li>
<li><p>Lista de vizinhos: 48 × 4 + 4 = 196 B</p></li>
<li><p>Códigos PQ dos vizinhos: 48 × (512 B × 0,125) ≈ 3072 B</p></li>
<li><p>Total: 3780B</p></li>
</ul>
<p>Como o nó inteiro cabe numa única página, é necessária apenas uma operação de E/S por acesso, e o AISAQ evita leituras aleatórias de dados PQ externos.</p>
<p>No entanto, quando apenas parte dos dados PQ é incorporada, os códigos PQ restantes têm de ser obtidos noutro local do disco (o parâmetro inline_pq foi definido para otimizar a utilização das páginas do SSD; por exemplo, inline_pq = 20 permite que dois nós caibam numa única página de 4 KB). Isto introduz operações de E/S aleatórias adicionais, o que aumenta drasticamente a procura de IOPS e leva a uma queda no desempenho.</p>
<p><strong>Conjunto de dados Cohere768D</strong></p>
<p>No conjunto de dados Cohere768D, o AISAQ apresenta um desempenho cerca de 8% inferior ao do DISKANN. A razão é que um vetor de 768 dimensões simplesmente não cabe numa única página de 4 KB do SSD:</p>
<ul>
<li><p>Vetor completo: 3072B</p></li>
<li><p>Lista de vizinhos: 48 × 4 + 4 = 196 B</p></li>
<li><p>Códigos PQ dos vizinhos: 48 × (3072B × 0,04167) ≈ 6 144B</p></li>
<li><p>Total: 9 412 B (≈ 3 páginas)</p></li>
</ul>
<p>Neste caso, mesmo que todos os códigos PQ sejam incorporados, cada nó abrange várias páginas. Embora o número de operações de E/S se mantenha consistente, cada E/S tem de transferir muito mais dados, consumindo a largura de banda do SSD muito mais rapidamente. Quando a largura de banda se torna o fator limitante, o AISAQ não consegue acompanhar o DISKANN — especialmente em cargas de trabalho de alta dimensão, onde a pegada de dados por nó cresce rapidamente.</p>
<p><strong>Nota:</strong></p>
<p>O layout de armazenamento do AISAQ aumenta normalmente o tamanho do índice no disco em <strong>3 a 5 vezes</strong>. Trata-se de um compromisso deliberado: vetores completos, listas de vizinhos e códigos PQ são colocados no mesmo local no disco para permitir um acesso eficiente a uma única página durante a pesquisa. Embora isto aumente a utilização do SSD, a capacidade do disco é significativamente mais económica do que a DRAM e escala mais facilmente com grandes volumes de dados.</p>
<p>Na prática, os utilizadores podem ajustar esta escolha, alterando as taxas de compressão d <code translate="no">INLINE_PQ</code> e e PQ. Estes parâmetros permitem equilibrar o desempenho da pesquisa, a ocupação de espaço no disco e o custo global do sistema com base nos requisitos da carga de trabalho, em vez de ficarem limitados por restrições fixas de memória.</p>
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
    </button></h2><p>A economia do hardware moderno está a mudar. Os preços da DRAM continuam elevados, enquanto o desempenho dos SSD avançou rapidamente — as unidades PCIe 5.0 oferecem agora uma largura de banda superior <strong>a 14 GB/s</strong>. Como resultado, as arquiteturas que transferem dados críticos para a pesquisa da dispendiosa DRAM para o armazenamento em SSD, muito mais acessível, estão a tornar-se cada vez mais atraentes. Com a capacidade dos SSD a custar <strong>menos de 30 vezes mais por gigabyte do que</strong> a DRAM, estas diferenças já não são marginais — influenciam significativamente a conceção do sistema.</p>
<p>O AISAQ reflete esta mudança. Ao eliminar a necessidade de grandes alocações de memória sempre ativas, permite que os sistemas de pesquisa vetorial sejam dimensionados com base no tamanho dos dados e nos requisitos da carga de trabalho, em vez de nos limites da DRAM. Esta abordagem alinha-se com uma tendência mais ampla para arquiteturas «all-in-storage», nas quais os SSDs rápidos desempenham um papel central não só na persistência, mas também na computação ativa e na pesquisa. Ao oferecer dois modos de funcionamento — Desempenho e Escalabilidade —, o AiSAQ satisfaz os requisitos tanto da pesquisa semântica (que exige a menor latência) como do RAG (que exige uma escalabilidade muito elevada, mas uma latência moderada).</p>
<p>É improvável que esta mudança se limite às bases de dados vetoriais. Padrões de conceção semelhantes já estão a surgir no processamento de grafos, na análise de séries temporais e até em partes dos sistemas relacionais tradicionais, à medida que os programadores repensam pressupostos de longa data sobre onde os dados devem residir para alcançar um desempenho aceitável. À medida que a economia do hardware continua a evoluir, as arquiteturas dos sistemas seguirão o mesmo caminho.</p>
<p>Para mais detalhes sobre os projetos aqui discutidos, consulte a documentação:</p>
<ul>
<li><p><a href="https://milvus.io/docs/aisaq.md">AISAQ | Documentação do Milvus</a></p></li>
<li><p><a href="https://milvus.io/docs/diskann.md">DISKANN | Documentação do Milvus</a></p></li>
</ul>
<p>Tem dúvidas ou quer aprofundar-se em qualquer funcionalidade da versão mais recente do Milvus? Junte-se<a href="https://discord.com/invite/8uyFbECzPX"> ao</a> nosso<a href="https://discord.com/invite/8uyFbECzPX"> canal no Discord</a> ou registe problemas no<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Também pode marcar uma sessão individual de 20 minutos para obter informações, orientação e respostas às suas perguntas através<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> do Milvus Office Hours</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Saiba mais sobre as funcionalidades do Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Apresentamos o Milvus 2.6: Pesquisa vetorial acessível à escala de milhares de milhões</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Apresentamos a função de incorporação: como o Milvus 2.6 simplifica a vetorização e a pesquisa semântica</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">JSON Shredding no Milvus: filtragem de JSON 88,9 vezes mais rápida com flexibilidade</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Desbloqueando a verdadeira recuperação ao nível da entidade: novas capacidades «Array-of-Structs» e «MAX_SIM» no Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH no Milvus: a arma secreta para combater duplicados nos dados de treino de LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Levar a compressão vetorial ao extremo: como o Milvus atende a 3 vezes mais consultas com o RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Os benchmarks mentem — as bases de dados de vetores merecem um teste a sério </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Substituímos o Kafka/Pulsar por um Woodpecker no Milvus </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Pesquisa vetorial no mundo real: como filtrar de forma eficiente sem comprometer a taxa de recuperação</a></p></li>
</ul>
