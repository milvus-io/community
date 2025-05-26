---
id: understand-hierarchical-navigable-small-worlds-hnsw-for-vector-search.md
title: >-
  Compreender os pequenos mundos navegáveis hierárquicos (HNSW) para a pesquisa
  de vectores
author: Stefan Webb
date: 2025-05-21T00:00:00.000Z
desc: >-
  O HNSW (Hierarchical Navigable Small World) é um algoritmo eficiente para a
  pesquisa aproximada do vizinho mais próximo utilizando uma estrutura de grafo
  em camadas.
cover: assets.zilliz.com/Chat_GPT_Image_May_26_2025_11_56_17_AM_1a84d31090.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, HNSW, Hierarchical Navigable Small Worlds, RAG, vector search'
meta_title: |
  Understand HNSW for Vector Search
origin: >-
  https://milvus.io/blog/understand-hierarchical-navigable-small-worlds-hnsw-for-vector-search.md
---
<p>A principal operação das <a href="https://milvus.io/blog/what-is-a-vector-database.md">bases de dados vectoriais</a> é a <em>pesquisa de semelhanças</em>, que consiste em encontrar os vizinhos mais próximos de um vetor de consulta na base de dados, por exemplo, através da distância euclidiana. Um método ingénuo calcularia a distância do vetor de consulta a todos os vectores armazenados na base de dados e seleccionaria o top-K mais próximo. No entanto, isso claramente não escala à medida que o tamanho da base de dados aumenta. Na prática, uma pesquisa por semelhança ingénua só é prática para bases de dados com menos de 1 milhão de vectores. Como podemos escalar a nossa pesquisa para dezenas e centenas de milhões, ou mesmo para milhares de milhões de vectores?</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Descending_a_hierarchy_of_vector_search_indices_cf9fb8060a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: Descida de uma hierarquia de índices de pesquisa vetorial</em></p>
<p>Foram desenvolvidos muitos algoritmos e estruturas de dados para escalar a pesquisa por semelhança em espaços vectoriais de elevada dimensão para uma complexidade de tempo sub-linear. Neste artigo, explicaremos e implementaremos um método popular e eficaz chamado Hierarchical Navigable Small Worlds (HNSW), que é frequentemente a escolha padrão para conjuntos de dados vetoriais de tamanho médio. Pertence à família de métodos de pesquisa que constroem um grafo sobre os vectores, em que os vértices indicam os vectores e as arestas indicam a semelhança entre eles. A pesquisa é efectuada navegando no grafo, no caso mais simples, percorrendo avidamente o vizinho do nó atual que está mais próximo da consulta e repetindo até atingir um mínimo local.</p>
<p>Explicaremos mais detalhadamente como o grafo de pesquisa é construído, como o grafo permite a pesquisa e, no final, faremos uma ligação a uma implementação do HNSW, feita por mim, em Python simples.</p>
<h2 id="Navigable-Small-Worlds" class="common-anchor-header">Pequenos mundos navegáveis<button data-href="#Navigable-Small-Worlds" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/Figure_NSW_graph_created_from_100_randomly_located_2_D_points_3ffccbd6a7.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: Grafo NSW criado a partir de 100 pontos 2D localizados aleatoriamente.</em></p>
<p>Como mencionado, o HNSW constrói um grafo de pesquisa offline antes de podermos efetuar uma consulta. O algoritmo baseia-se num trabalho anterior, um método chamado Navigable Small Worlds (NSW). Vamos explicar primeiro o NSW e depois será trivial passar para o NSW <em>hierárquico</em>. A ilustração acima é de um gráfico de pesquisa construído para NSW sobre vectores bidimensionais. Em todos os exemplos abaixo, restringimo-nos a vectores bidimensionais para podermos visualizá-los.</p>
<h2 id="Constructing-the-Graph" class="common-anchor-header">Construir o gráfico<button data-href="#Constructing-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>Um NSW é um grafo em que os vértices representam vectores e as arestas são construídas heuristicamente a partir da semelhança entre vectores, de modo a que a maioria dos vectores seja alcançável a partir de qualquer lugar através de um pequeno número de saltos. Esta é a chamada propriedade de "mundo pequeno" que permite uma navegação rápida. Veja a figura acima.</p>
<p>O grafo é inicializado como vazio. Iteramos pelos vectores, adicionando cada um deles ao grafo. Para cada vetor, a partir de um nó de entrada aleatório, procuramos avidamente os nós R mais próximos alcançáveis a partir do ponto de entrada <em>no grafo até agora construído</em>. Estes R nós são então ligados a um novo nó que representa o vetor que está a ser inserido, opcionalmente podando quaisquer nós vizinhos que tenham agora mais de R vizinhos. A repetição deste processo para todos os vectores resultará no grafo NSW. Veja a ilustração acima, que visualiza o algoritmo, e consulte os recursos no final do artigo para obter uma análise teórica das propriedades de um grafo construído dessa forma.</p>
<h2 id="Searching-the-Graph" class="common-anchor-header">Pesquisando o grafo<button data-href="#Searching-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>Já vimos o algoritmo de busca a partir de seu uso na construção de grafos. Neste caso, no entanto, o nó de consulta é fornecido pelo utilizador, em vez de ser um nó de inserção no grafo. A partir de um nó de entrada aleatório, navegamos avidamente para o seu vizinho mais próximo da consulta, mantendo um conjunto dinâmico dos vectores mais próximos encontrados até ao momento. Ver a ilustração acima. Note-se que podemos aumentar a precisão da pesquisa iniciando pesquisas a partir de vários pontos de entrada aleatórios e agregando os resultados, juntamente com a consideração de vários vizinhos em cada passo. No entanto, essas melhorias vêm com o custo de uma maior latência.</p>
<custom-h1>Adicionando hierarquia</custom-h1><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/adding_hierarchy_0101234812.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Até agora, descrevemos o algoritmo NSW e a estrutura de dados que podem ajudar-nos a aumentar a escala da pesquisa no espaço de alta dimensão. No entanto, o método sofre de graves deficiências, incluindo falhas em dimensões baixas, convergência lenta da pesquisa e uma tendência para ficar preso em mínimos locais.</p>
<p>Os autores do HNSW corrigem estas deficiências com três modificações ao NSW:</p>
<ul>
<li><p>Seleção explícita dos nós de entrada durante a construção e a pesquisa;</p></li>
<li><p>Separação das arestas por diferentes escalas; e,</p></li>
<li><p>Utilização de uma heurística avançada para selecionar os vizinhos.</p></li>
</ul>
<p>Os dois primeiros são realizados com uma idéia simples: construir <em>uma hierarquia de grafos de busca</em>. Em vez de um único grafo, como no NSW, o HNSW constrói uma hierarquia de grafos. Cada grafo, ou camada, é pesquisado individualmente da mesma forma que o NSW. A camada superior, que é pesquisada primeiro, contém muito poucos nós, e as camadas mais profundas incluem progressivamente mais e mais nós, com a camada inferior a incluir todos os nós. Isto significa que as camadas superiores contêm saltos mais longos no espaço vetorial, o que permite uma espécie de pesquisa de curso a fino. Veja acima uma ilustração.</p>
<h2 id="Constructing-the-Graph" class="common-anchor-header">Construindo o gráfico<button data-href="#Constructing-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>O algoritmo de construção funciona da seguinte forma: fixamos um número de camadas, <em>L</em>, antecipadamente. O valor l=1 corresponderá à camada mais grosseira, onde a pesquisa começa, e l=L corresponderá à camada mais densa, onde a pesquisa termina. Iteramos através de cada vetor a ser inserido e recolhemos uma amostra de uma camada de inserção seguindo uma <a href="https://en.wikipedia.org/wiki/Geometric_distribution">distribuição geométrica</a> truncada (rejeitando <em>l &gt; L</em> ou definindo <em>l' =</em> min_(l, L)_). Digamos que fazemos uma amostragem de <em>1 &lt; l &lt; L</em> para o vetor atual. Efectuamos uma pesquisa gulosa na camada superior, L, até atingirmos o seu mínimo local. Em seguida, seguimos uma aresta do mínimo local na camada _L_th para o vetor correspondente na camada _(L-1)_th e o usamos como ponto de entrada para pesquisar avidamente a camada _(L-1)_th.</p>
<p>Este processo repete-se até chegarmos à camada _l_th. Começamos então a criar nós para o vetor a inserir, ligando-o aos seus vizinhos mais próximos encontrados por pesquisa gulosa na _l_ª camada até agora construída, navegando para a _(l-1)_ª camada e repetindo até termos inserido o vetor na _1ª camada. Uma animação acima torna isto claro</p>
<p>Podemos ver que este método de construção de grafos hierárquicos utiliza uma seleção inteligente e explícita do nó de inserção para cada vetor. Pesquisamos as camadas acima da camada de inserção construída até agora, pesquisando de forma eficiente a partir de distâncias de curso a fino. De forma semelhante, o método separa as ligações por escalas diferentes em cada camada: a camada superior permite saltos de longa escala no espaço de pesquisa, com a escala a diminuir até à camada inferior. Ambas as modificações ajudam a evitar ficar preso em mínimos sub-ótimos e aceleram a convergência da pesquisa ao custo de memória adicional.</p>
<h2 id="Searching-the-Graph" class="common-anchor-header">Pesquisando o gráfico<button data-href="#Searching-the-Graph" class="anchor-icon" translate="no">
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
    </button></h2><p>O procedimento de busca funciona de forma semelhante à etapa de construção do grafo interno. Começando pela camada superior, navegamos avidamente até o nó ou nós mais próximos da consulta. Em seguida, seguimos esse(s) nó(s) até a próxima camada e repetimos o processo. Nossa resposta é obtida pela lista de <em>R</em> vizinhos mais próximos na camada inferior, conforme ilustrado pela animação acima.</p>
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
    </button></h2><p>Bases de dados vectoriais como o Milvus fornecem implementações altamente optimizadas e afinadas do HNSW, e é frequentemente o melhor índice de pesquisa predefinido para conjuntos de dados que cabem na memória.</p>
<p>Esboçámos uma visão geral de alto nível de como e porquê o HNSW funciona, preferindo visualizações e intuição em vez de teoria e matemática. Consequentemente, omitimos uma descrição exacta dos algoritmos de construção e pesquisa<a href="https://arxiv.org/abs/1603.09320">[Malkov and Yashushin, 2016</a>; Alg 1-3], a análise da complexidade da pesquisa e da construção<a href="https://arxiv.org/abs/1603.09320">[Malkov and Yashushin, 2016</a>; §4.2], e detalhes menos essenciais como uma heurística para escolher mais eficazmente os nós vizinhos durante a construção<a href="https://arxiv.org/abs/1603.09320">[Malkov and Yashushin, 2016</a>; Alg 5]. Além disso, omitimos a discussão dos hiperparâmetros do algoritmo, o seu significado e a forma como afectam o compromisso latência/velocidade/memória<a href="https://arxiv.org/abs/1603.09320">[Malkov and Yashushin, 2016</a>; §4.1]. A compreensão deste facto é importante para utilizar o HNSW na prática.</p>
<p>Os recursos abaixo contêm leituras adicionais sobre estes tópicos e uma implementação pedagógica completa em Python (escrita por mim) para NSW e HNSW, incluindo código para produzir as animações neste artigo.</p>
<custom-h1>Recursos</custom-h1><ul>
<li><p>GitHub: "<a href="https://github.com/stefanwebb/hnsw-illustrated">HNSW-Illustrated: Uma pequena implementação do Hierarchical Navigable Small Worlds (HNSW), um algoritmo de pesquisa vetorial, para fins de aprendizagem</a>"</p></li>
<li><p><a href="https://milvus.io/docs/hnsw.md#HNSW">HNSW | Documentação do Milvus</a></p></li>
<li><p><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">Compreender os Mundos Pequenos Navegáveis Hierárquicos (HNSW) - Zilliz Learn</a></p></li>
<li><p>Documento HNSW: "<a href="https://arxiv.org/abs/1603.09320">Pesquisa eficiente e robusta do vizinho mais próximo aproximado utilizando grafos Hierarchical Navigable Small Worlds</a>"</p></li>
<li><p>Artigo NSW: "<a href="https://publications.hse.ru/pubs/share/folder/x5p6h7thif/128296059.pdf">Algoritmo do vizinho mais próximo aproximado baseado em grafos de mundos pequenos navegáveis</a>"</p></li>
</ul>
