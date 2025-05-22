---
id: diskann-explained.md
title: Explicação da DiskANN
author: Stefan Webb
date: 2025-05-20T00:00:00.000Z
desc: >-
  Saiba como a DiskANN oferece pesquisas vetoriais em escala de bilhões usando
  SSDs, equilibrando baixo uso de memória, alta precisão e desempenho
  dimensionável.
cover: assets.zilliz.com/Disk_ANN_Explained_35db4b3ef1.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: >-
  Milvus, DiskANN, vector similarity search, indexing, Vamana algorithm, disk
  vector search
meta_title: DiskANN Explained
origin: 'https://milvus.io/blog/diskann-explained.md'
---
<h2 id="What-is-DiskANN" class="common-anchor-header">O que é DiskANN?<button data-href="#What-is-DiskANN" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/microsoft/DiskANN">O DiskANN</a> representa uma abordagem de mudança de paradigma para a <a href="https://zilliz.com/learn/vector-similarity-search">pesquisa de similaridade de vectores</a>. Antes disso, a maioria dos tipos de índices vetoriais, como o HNSW, dependia muito da RAM para obter baixa latência e alta recuperação. Embora eficaz para conjuntos de dados de tamanho moderado, essa abordagem torna-se proibitivamente cara e menos escalável à medida que os volumes de dados aumentam. O DiskANN oferece uma alternativa económica ao utilizar SSDs para armazenar o índice, reduzindo significativamente os requisitos de memória.</p>
<p>O DiskANN emprega uma estrutura de gráfico plano otimizada para acesso ao disco, permitindo que ele manipule conjuntos de dados em escala de bilhões com uma fração do espaço de memória exigido pelos métodos na memória. Por exemplo, o DiskANN pode indexar até mil milhões de vectores, obtendo uma precisão de pesquisa de 95% com latências de 5 ms, enquanto os algoritmos baseados em RAM atingem um pico de 100-200 milhões de pontos para um desempenho semelhante.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vector_indexing_and_search_workflow_with_Disk_ANN_41cdf33652.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 1: Indexação de vectores e fluxo de trabalho de pesquisa com DiskANN</em></p>
<p>Embora o DiskANN possa introduzir uma latência ligeiramente superior em comparação com as abordagens baseadas em RAM, a compensação é muitas vezes aceitável, dada a poupança substancial de custos e as vantagens de escalabilidade. A DiskANN é particularmente adequada para aplicações que requerem pesquisa vetorial em grande escala em hardware de base.</p>
<p>Este artigo explicará os métodos inteligentes que o DiskANN tem para aproveitar a SSD além da RAM e reduzir as leituras dispendiosas da SSD.</p>
<h2 id="How-Does-DiskANN-Work" class="common-anchor-header">Como funciona o DiskANN?<button data-href="#How-Does-DiskANN-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>O DiskANN é um método de pesquisa vetorial baseado em gráficos na mesma família de métodos do HNSW. Primeiro, construímos um grafo de pesquisa em que os nós correspondem a vectores (ou grupos de vectores) e as arestas indicam que um par de vectores está "relativamente próximo" num determinado sentido. Uma pesquisa típica escolhe aleatoriamente um "nó de entrada" e navega para o seu vizinho mais próximo da consulta, repetindo de forma gulosa até atingir um mínimo local.</p>
<p>As estruturas de indexação baseadas em grafos diferem principalmente na forma como constroem o grafo de pesquisa e efectuam a pesquisa. E nesta seção, faremos um mergulho técnico profundo nas inovações da DiskANN para essas etapas e como elas permitem um desempenho de baixa latência e baixa memória. (Veja a figura acima para um resumo).</p>
<h3 id="An-Overview" class="common-anchor-header">Uma visão geral</h3><p>Assumimos que o utilizador gerou um conjunto de vectores de incorporação de documentos. O primeiro passo é agrupar as incorporações. Um gráfico de pesquisa para cada agrupamento é construído separadamente utilizando o algoritmo Vamana (explicado na secção seguinte) e os resultados são fundidos num único gráfico. <em>A estratégia de dividir e conquistar para criar o gráfico de pesquisa final reduz significativamente a utilização de memória sem afetar demasiado a latência da pesquisa ou a recuperação.</em></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_Disk_ANN_stores_vector_index_across_RAM_and_SSD_d6564b087f.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 2: Como o DiskANN armazena o índice de vetores na RAM e no SSD</em></p>
<p>Depois de produzir o gráfico de pesquisa global, este é armazenado no SSD juntamente com as incorporações vectoriais de precisão total. Um grande desafio é terminar a pesquisa dentro de um número limitado de leituras no SSD, uma vez que o acesso ao SSD é caro em relação ao acesso à RAM. Assim, são utilizados alguns truques inteligentes para restringir o número de leituras:</p>
<p>Primeiro, o algoritmo Vamana incentiva caminhos mais curtos entre nós próximos enquanto limita o número máximo de vizinhos de um nó. Segundo, uma estrutura de dados de tamanho fixo é usada para armazenar o embedding de cada nó e seus vizinhos (veja a figura acima). Isso significa que podemos endereçar os metadados de um nó simplesmente multiplicando o tamanho da estrutura de dados pelo índice do nó e usando isso como um deslocamento enquanto buscamos simultaneamente a incorporação do nó. Em terceiro lugar, devido à forma como o SSD funciona, podemos ir buscar vários nós por pedido de leitura - no nosso caso, os nós vizinhos - reduzindo ainda mais o número de pedidos de leitura.</p>
<p>Separadamente, comprimimos os embeddings utilizando a quantização do produto e armazenamo-los na RAM. Ao fazê-lo, podemos encaixar conjuntos de dados vectoriais à escala de milhares de milhões numa memória que é viável numa única máquina para calcular rapidamente <em>semelhanças vectoriais aproximadas</em> sem leituras de disco. Isso fornece orientação para reduzir o número de nós vizinhos a serem acessados em seguida no SSD. No entanto, é importante salientar que as decisões de pesquisa são tomadas utilizando as <em>semelhanças exactas dos vectores</em>, com as incorporações completas recuperadas do SSD, o que garante uma maior recuperação. Para enfatizar, há uma fase inicial de pesquisa usando embeddings quantizados na memória, e uma pesquisa subsequente num subconjunto mais pequeno lido a partir do SSD.</p>
<p>Nesta descrição, passámos ao lado de dois passos importantes, embora envolvidos: como construir o grafo e como pesquisar o grafo - os dois passos indicados pelas caixas vermelhas acima. Vamos examinar cada um deles.</p>
<h3 id="Vamana-Graph-Construction" class="common-anchor-header">"Construção do gráfico "Vamana</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vamana_Graph_Construction_ecb4dab839.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: "Construção do gráfico "Vamana</em></p>
<p>Os autores do DiskANN desenvolvem um novo método para construir o grafo de pesquisa, a que chamam algoritmo Vamana. Este algoritmo inicializa o grafo de pesquisa adicionando aleatoriamente O(N) arestas. Isto resultará num grafo que está "bem ligado", embora sem quaisquer garantias de convergência da pesquisa gulosa. Em seguida, poda e volta a ligar as arestas de forma inteligente para garantir que existem ligações de longo alcance suficientes (ver figura acima). Vamos desenvolver:</p>
<h4 id="Initialization" class="common-anchor-header">Inicialização</h4><p>O grafo de pesquisa é inicializado com um grafo direcionado aleatório em que cada nó tem R out-neighbors. Também calculamos o medóide do grafo, ou seja, o ponto que tem a distância média mínima para todos os outros pontos. Pode pensar nisto como análogo a um centroide que é um membro do conjunto de nós.</p>
<h4 id="Search-for-Candidates" class="common-anchor-header">Busca de candidatos</h4><p>Após a inicialização, iteramos sobre os nós, adicionando e removendo arestas em cada passo. Primeiro, executamos um algoritmo de pesquisa no nó selecionado, p, para gerar uma lista de candidatos. O algoritmo de pesquisa começa no medoid e navega avidamente para cada vez mais perto do nó selecionado, adicionando os out-neighbors do nó mais próximo encontrado até agora em cada passo. A lista de L nós encontrados mais próximos de p é devolvida. (Se não está familiarizado com o conceito, o medóide de um grafo é o ponto que tem a distância média mínima a todos os outros pontos e actua como um análogo de um centróide para grafos).</p>
<h4 id="Pruning-and-Adding-Edges" class="common-anchor-header">Podando e adicionando arestas</h4><p>Os candidatos a vizinhos do nó são ordenados por distância e, para cada candidato, o algoritmo verifica se está "demasiado perto" de um vizinho já escolhido. Em caso afirmativo, ele é podado. Isto promove a diversidade angular entre vizinhos, o que, empiricamente, conduz a melhores propriedades de navegação. Na prática, isto significa que uma pesquisa a partir de um nó aleatório pode chegar mais rapidamente a qualquer nó alvo, explorando um conjunto esparso de ligações locais e de longo alcance.</p>
<p>Após a poda de arestas, são adicionadas arestas ao longo do caminho de pesquisa gulosa para p. São efectuadas duas passagens de poda, variando o limite de distância para a poda, de modo a que as arestas de longo alcance sejam adicionadas na segunda passagem.</p>
<h2 id="What’s-Next" class="common-anchor-header">O que vem a seguir?<button data-href="#What’s-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>O trabalho subsequente foi desenvolvido com base no DiskANN para obter melhorias adicionais. Um exemplo digno de nota, conhecido como <a href="https://arxiv.org/abs/2105.09613">FreshDiskANN</a>, modifica o método para permitir a fácil atualização do índice após a construção. Este índice de pesquisa, que proporciona um excelente compromisso entre critérios de desempenho, está disponível na base de dados de vectores <a href="https://milvus.io/docs/overview.md">Milvus</a> como o tipo de índice <code translate="no">DISKANN</code>.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Prepare index parameters</span>
index_params = client.prepare_index_params()

<span class="hljs-comment"># Add DiskANN index</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;DISKANN&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection with index</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;diskann_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>Pode ainda ajustar os parâmetros do DiskANN, como <code translate="no">MaxDegree</code> e <code translate="no">BeamWidthRatio</code>: consulte <a href="https://milvus.io/docs/disk_index.md#On-disk-Index">a página de documentação</a> para obter mais informações.</p>
<h2 id="Resources" class="common-anchor-header">Recursos<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/docs/disk_index.md#On-disk-Index">Documentação do Milvus sobre a utilização do DiskANN</a></p></li>
<li><p><a href="https://suhasjs.github.io/files/diskann_neurips19.pdf">"DiskANN: pesquisa rápida e precisa de vizinhos mais próximos de bilhões de pontos em um único nó"</a></p></li>
<li><p><a href="https://arxiv.org/abs/2105.09613">"FreshDiskANN: um índice ANN baseado em gráfico rápido e preciso para pesquisa de similaridade em fluxo contínuo"</a></p></li>
</ul>
