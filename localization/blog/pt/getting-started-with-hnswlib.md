---
id: getting-started-with-hnswlib.md
title: Introdução ao HNSWlib
author: Haziqa Sajid
date: 2024-11-25T00:00:00.000Z
desc: >-
  A HNSWlib, uma biblioteca que implementa o HNSW, é altamente eficiente e
  escalável, com bom desempenho mesmo com milhões de pontos. Saiba como
  implementá-la em minutos.
metaTitle: Getting Started with HNSWlib
cover: assets.zilliz.com/Getting_Started_with_HNS_Wlib_30922def3e.png
tag: Engineering
tags: >-
  HNSWlib, HNSW Hierarchical Navigable Small Worlds, Vector Search, Approximate
  Nearest Neighbor (ANN) search, ANNS
recommend: true
canonicalUrl: 'https://milvus.io/blog/getting-started-with-hnswlib.md'
---
<p><a href="https://zilliz.com/glossary/semantic-search">A pesquisa semântica</a> permite que as máquinas compreendam a linguagem e produzam melhores resultados de pesquisa, o que é essencial na IA e na análise de dados. Uma vez que a linguagem é representada como <a href="https://zilliz.com/learn/everything-you-should-know-about-vector-embeddings">embeddings</a>, a pesquisa pode ser efectuada utilizando métodos exactos ou aproximados. A pesquisa do vizinho mais próximo aproximado<a href="https://zilliz.com/glossary/anns">(ANN</a>) é um método utilizado para encontrar rapidamente pontos num conjunto de dados que estão mais próximos de um determinado ponto de consulta, ao contrário da <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">pesquisa exacta do vizinho mais próximo</a>, que pode ser computacionalmente dispendiosa para dados de elevada dimensão. A ANN permite uma recuperação mais rápida, fornecendo resultados que são aproximadamente próximos dos vizinhos mais próximos.</p>
<p>Um dos algoritmos para a pesquisa ANN (Approximate Nearest Neighbor) é o <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a> (Hierarchical Navigable Small Worlds), implementado na <a href="https://zilliz.com/learn/learn-hnswlib-graph-based-library-for-fast-anns">HNSWlib</a>, que será o foco da discussão de hoje. Neste blogue, iremos:</p>
<ul>
<li><p>Entender o algoritmo HNSW.</p></li>
<li><p>Explorar o HNSWlib e seus principais recursos.</p></li>
<li><p>Configurar o HNSWlib, abrangendo a construção do índice e a implementação da pesquisa.</p></li>
<li><p>Compará-lo com o Milvus.</p></li>
</ul>
<h2 id="Understanding-HNSW" class="common-anchor-header">Entendendo o HNSW<button data-href="#Understanding-HNSW" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hierarchical Navigable Small Worlds (</strong><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW"><strong>HNSW</strong></a><strong>)</strong> é uma estrutura de dados baseada em gráficos que permite pesquisas de similaridade eficientes, particularmente em espaços de alta dimensão, construindo um gráfico de várias camadas de redes "small world". Introduzido em <a href="https://arxiv.org/abs/1603.09320">2016</a>, o HNSW aborda os problemas de escalabilidade associados aos métodos de pesquisa tradicionais, como as pesquisas de força bruta e baseadas em árvores. É ideal para aplicações que envolvem grandes conjuntos de dados, como sistemas de recomendação, reconhecimento de imagem e <a href="https://zilliz.com/vector-database-use-cases/llm-retrieval-augmented-generation">geração aumentada de recuperação (RAG)</a>.</p>
<h3 id="Why-HNSW-Matters" class="common-anchor-header">Porque é que o HNSW é importante</h3><p>O HNSW melhora significativamente o desempenho da pesquisa do vizinho mais próximo em espaços de alta dimensão. A combinação da estrutura hierárquica com a navegabilidade de mundo pequeno evita a ineficiência computacional dos métodos mais antigos, permitindo um bom desempenho mesmo com conjuntos de dados maciços e complexos. Para compreender melhor, vamos ver como funciona atualmente.</p>
<h3 id="How-HNSW-Works" class="common-anchor-header">Como funciona o HNSW</h3><ol>
<li><p><strong>Camadas hierárquicas:</strong> O HNSW organiza os dados numa hierarquia de camadas, em que cada camada contém nós ligados por arestas. As camadas superiores são mais esparsas, permitindo "saltos" amplos no gráfico, tal como fazer zoom num mapa para ver apenas as principais auto-estradas entre cidades. As camadas inferiores aumentam em densidade, fornecendo detalhes mais finos e mais ligações entre vizinhos mais próximos.</p></li>
<li><p><strong>Conceito de pequenos mundos navegáveis:</strong> Cada camada no HNSW baseia-se no conceito de uma rede de "mundo pequeno", onde os nós (pontos de dados) estão apenas a alguns "saltos" de distância uns dos outros. O algoritmo de pesquisa começa na camada mais alta e mais esparsa e trabalha para baixo, movendo-se para camadas progressivamente mais densas para refinar a pesquisa. Esta abordagem é como passar de uma visão global para detalhes ao nível da vizinhança, estreitando gradualmente a área de pesquisa.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Fig_1_An_Example_of_a_Navigable_Small_World_Graph_afa737ee9f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://daniel-at-world.blogspot.com/2019/04/navigable-small-world-graphs-for.html">Fig 1</a>: Um exemplo de um gráfico de mundo pequeno navegável</p>
<ol start="3">
<li><strong>Estrutura do tipo Skip List:</strong> O aspeto hierárquico do HNSW assemelha-se a uma skip list, uma estrutura de dados probabilística em que as camadas superiores têm menos nós, permitindo pesquisas iniciais mais rápidas.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Fig_2_An_Example_of_Skip_List_Structure_f41b07234d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://www.cs.cmu.edu/~ckingsf/bioinfo-lectures/skiplists.pdf">Fig 2</a>: Um exemplo de estrutura de lista de saltos</p>
<p>Para procurar 96 na lista de saltos dada, começamos no nível superior, à esquerda, no nó de cabeçalho. Movendo-nos para a direita, encontramos 31, menos de 96, pelo que continuamos para o nó seguinte. Agora, precisamos de descer um nível, onde vemos novamente 31; como continua a ser inferior a 96, descemos mais um nível. Encontrando 31 mais uma vez, movemo-nos para a direita e chegamos a 96, o nosso valor alvo. Assim, localizamos 96 sem precisar de descer aos níveis mais baixos da lista de saltos.</p>
<ol start="4">
<li><p><strong>Eficiência da Pesquisa:</strong> O algoritmo HNSW parte de um nó de entrada na camada mais alta, progredindo para vizinhos mais próximos a cada passo. Desce através das camadas, utilizando cada uma delas para uma exploração de grão grosso a fino, até atingir a camada mais baixa, onde provavelmente se encontram os nós mais semelhantes. Esta navegação em camadas reduz o número de nós e arestas que precisam de ser explorados, tornando a pesquisa rápida e precisa.</p></li>
<li><p><strong>Inserção e manutenção</strong>: Ao adicionar um novo nó, o algoritmo determina a sua camada de entrada com base na probabilidade e liga-o a nós próximos utilizando uma heurística de seleção de vizinhos. A heurística tem como objetivo otimizar a conetividade, criando ligações que melhoram a navegabilidade, ao mesmo tempo que equilibram a densidade do grafo. Esta abordagem mantém a estrutura robusta e adaptável a novos pontos de dados.</p></li>
</ol>
<p>Embora tenhamos uma compreensão básica do algoritmo HNSW, implementá-lo a partir do zero pode ser complicado. Felizmente, a comunidade desenvolveu bibliotecas como a <a href="https://github.com/nmslib/hnswlib">HNSWlib</a> para simplificar o uso, tornando-o acessível sem que seja necessário coçar a cabeça. Então, vamos dar uma olhada mais de perto no HNSWlib.</p>
<h2 id="Overview-of-HNSWlib" class="common-anchor-header">Visão geral do HNSWlib<button data-href="#Overview-of-HNSWlib" class="anchor-icon" translate="no">
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
    </button></h2><p>HNSWlib, uma biblioteca popular que implementa HNSW, é altamente eficiente e escalável, com bom desempenho mesmo com milhões de pontos. Atinge uma complexidade de tempo sublinear, permitindo saltos rápidos entre camadas de gráficos e optimizando a pesquisa de dados densos e de elevada dimensão. Aqui estão as principais caraterísticas do HNSWlib:</p>
<ul>
<li><p><strong>Estrutura baseada em gráficos:</strong> Um gráfico de várias camadas representa os pontos de dados, permitindo pesquisas rápidas e mais próximas.</p></li>
<li><p><strong>Eficiência em alta dimensão:</strong> Otimizado para dados de alta dimensão, fornecendo pesquisas aproximadas rápidas e precisas.</p></li>
<li><p><strong>Tempo de pesquisa sublinear:</strong> Alcança complexidade sublinear ao pular camadas, melhorando significativamente a velocidade.</p></li>
<li><p><strong>Atualizações dinâmicas:</strong> Suporta a inserção e exclusão de nós em tempo real sem exigir uma reconstrução completa do gráfico.</p></li>
<li><p><strong>Eficiência de memória:</strong> Uso eficiente da memória, adequado para grandes conjuntos de dados.</p></li>
<li><p><strong>Escalabilidade:</strong> Escala bem até milhões de pontos de dados, tornando-o ideal para aplicações de média escala, como sistemas de recomendação.</p></li>
</ul>
<p><strong>Nota:</strong> O HNSWlib é excelente para criar protótipos simples para aplicações de pesquisa vetorial. No entanto, devido a limitações de escalabilidade, pode haver melhores escolhas, como <a href="https://zilliz.com/blog/what-is-a-real-vector-database">bases de dados vectoriais criadas especificamente</a> para cenários mais complexos que envolvam centenas de milhões ou mesmo milhares de milhões de pontos de dados. Vamos ver isso em ação.</p>
<h2 id="Getting-Started-with-HNSWlib-A-Step-by-Step-Guide" class="common-anchor-header">Primeiros passos com a HNSWlib: Um guia passo-a-passo<button data-href="#Getting-Started-with-HNSWlib-A-Step-by-Step-Guide" class="anchor-icon" translate="no">
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
    </button></h2><p>Esta seção demonstrará o uso da HNSWlib como uma <a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">biblioteca de pesquisa vetorial</a>, criando um índice HNSW, inserindo dados e realizando pesquisas. Vamos começar com a instalação:</p>
<h3 id="Setup-and-Imports" class="common-anchor-header">Configuração e importações</h3><p>Para começar a usar a HNSWlib em Python, primeiro instale-a usando pip:</p>
<pre><code translate="no">pip install hnswlib
<button class="copy-code-btn"></button></code></pre>
<p>Em seguida, importe as bibliotecas necessárias:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> hnswlib 
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-Data" class="common-anchor-header">Preparando os dados</h3><p>Neste exemplo, usaremos <code translate="no">NumPy</code>para gerar um conjunto de dados aleatório com 10.000 elementos, cada um com uma dimensão de 256.</p>
<pre><code translate="no">dim = <span class="hljs-number">256</span>  <span class="hljs-comment"># Dimensionality of your vectors</span>
num_elements = <span class="hljs-number">10000</span>  <span class="hljs-comment"># Number of elements to insert</span>
<button class="copy-code-btn"></button></code></pre>
<p>Vamos criar os dados:</p>
<pre><code translate="no">data = np.random.rand(num_elements, dim).astype(np.float32)  <span class="hljs-comment"># Example data</span>
<button class="copy-code-btn"></button></code></pre>
<p>Agora que nossos dados estão prontos, vamos criar um índice.</p>
<h3 id="Building-an-Index" class="common-anchor-header">Criar um índice</h3><p>Ao construir um índice, precisamos de definir a dimensionalidade dos vectores e o tipo de espaço. Vamos criar um índice:</p>
<pre><code translate="no">p = hnswlib.<span class="hljs-title class_">Index</span>(space=<span class="hljs-string">&#x27;l2&#x27;</span>, dim=dim)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">space='l2'</code>: Este parâmetro define a métrica de distância utilizada para a similaridade. Se o definir para <code translate="no">'l2'</code> significa que utiliza a distância euclidiana (norma L2). Se, em vez disso, o definir para <code translate="no">'ip'</code>, utilizará o produto interno, o que é útil para tarefas como a semelhança de cosseno.</li>
</ul>
<ul>
<li><code translate="no">dim=dim</code>: Este parâmetro especifica a dimensionalidade dos pontos de dados com que vai trabalhar. Ele deve corresponder à dimensão dos dados que planeja adicionar ao índice.</li>
</ul>
<p>Veja como inicializar um índice:</p>
<pre><code translate="no">p.init_index(max_elements=num_elements, ef_construction=200, M=16)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">max_elements=num_elements</code>: Isto define o número máximo de elementos que podem ser adicionados ao índice. <code translate="no">Num_elements</code> é a capacidade máxima, por isso definimos isto para 10.000, uma vez que estamos a trabalhar com 10.000 pontos de dados.</li>
</ul>
<ul>
<li><code translate="no">ef_construction=200</code>: Este parâmetro controla o compromisso precisão vs. velocidade de construção durante a criação do índice. Um valor mais elevado melhora a recuperação (precisão), mas aumenta a utilização da memória e o tempo de construção. Os valores comuns variam de 100 a 200.</li>
</ul>
<ul>
<li><code translate="no">M=16</code>: Este parâmetro determina o número de ligações bidireccionais criadas para cada ponto de dados, influenciando a precisão e a velocidade de pesquisa. Os valores típicos estão entre 12 e 48; 16 é frequentemente um bom equilíbrio para precisão e velocidade moderadas.</li>
</ul>
<pre><code translate="no">p.set_ef(<span class="hljs-number">50</span>)  <span class="hljs-comment"># This parameter controls the speed/accuracy trade-off</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">ef</code>: O parâmetro <code translate="no">ef</code>, abreviatura de "fator de exploração", determina quantos vizinhos são examinados durante uma pesquisa. Um valor <code translate="no">ef</code> mais elevado resulta em mais vizinhos a serem explorados, o que geralmente aumenta a exatidão (recuperação) da pesquisa, mas também a torna mais lenta. Por outro lado, um valor mais baixo de <code translate="no">ef</code> pode fazer uma pesquisa mais rápida, mas pode reduzir a precisão.</li>
</ul>
<p>Nesse caso, definir <code translate="no">ef</code> como 50 significa que o algoritmo de pesquisa avaliará até 50 vizinhos ao encontrar os pontos de dados mais semelhantes.</p>
<p>Nota: <code translate="no">ef_construction</code> define o esforço de pesquisa de vizinhos durante a criação do índice, aumentando a precisão mas tornando a construção mais lenta. <code translate="no">ef</code> controla o esforço de pesquisa durante a consulta, equilibrando dinamicamente a velocidade e a recuperação para cada consulta.</p>
<h3 id="Performing-Searches" class="common-anchor-header">Execução de pesquisas</h3><p>Para executar uma pesquisa de vizinho mais próximo usando HNSWlib, primeiro criamos um vetor de consulta aleatório. Neste exemplo, a dimensionalidade do vetor corresponde aos dados indexados.</p>
<pre><code translate="no">query_vector = np.random.rand(dim).astype(np.float32)  <span class="hljs-comment"># Example query</span>

labels, distances = p.knn_query(query_vector, k=<span class="hljs-number">5</span>)  <span class="hljs-comment"># k is the number of nearest neighbors</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">query_vector</code>: Esta linha gera um vetor aleatório com a mesma dimensionalidade que os dados indexados, assegurando a compatibilidade para a pesquisa do vizinho mais próximo.</li>
<li><code translate="no">knn_query</code>: O método procura os <code translate="no">k</code> vizinhos mais próximos do <code translate="no">query_vector</code> dentro do índice <code translate="no">p</code>. Devolve dois arrays: <code translate="no">labels</code>, que contém os índices dos vizinhos mais próximos, e <code translate="no">distances</code>, que indica as distâncias do vetor de consulta a cada um destes vizinhos. Aqui, <code translate="no">k=5</code> especifica que queremos encontrar os cinco vizinhos mais próximos.</li>
</ul>
<p>Aqui estão os resultados depois de imprimir as etiquetas e as distâncias:</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Nearest neighbors&#x27; labels:&quot;</span>, labels)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Distances:&quot;</span>, distances)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">&gt; Nearest neighbors&#x27; labels: [[4498 1751 5647 4483 2471]]
&gt; Distances: [[33.718    35.484592 35.627766 35.828312 35.91495 ]]
<button class="copy-code-btn"></button></code></pre>
<p>Aqui está, um guia simples para começar a usar a HNSWlib.</p>
<p>Como mencionado, o HNSWlib é um excelente motor de pesquisa vetorial para criar protótipos ou fazer experiências com conjuntos de dados de média dimensão. Se tiver requisitos de escalabilidade mais elevados ou necessitar de outras funcionalidades de nível empresarial, poderá ter de escolher uma base de dados vetorial criada para o efeito, como o <a href="https://zilliz.com/what-is-milvus">Milvus</a> de código aberto ou o seu serviço totalmente gerido no <a href="https://zilliz.com/cloud">Zilliz Cloud</a>. Assim, na secção seguinte, iremos comparar o HNSWlib com o Milvus.</p>
<h2 id="HNSWlib-vs-Purpose-Built-Vector-Databases-Like-Milvus" class="common-anchor-header">HNSWlib vs. Bases de dados vectoriais criadas para fins específicos como o Milvus<button data-href="#HNSWlib-vs-Purpose-Built-Vector-Databases-Like-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Uma <a href="https://zilliz.com/learn/what-is-vector-database">base de dados vetorial</a> armazena dados como representações matemáticas, permitindo que <a href="https://zilliz.com/ai-models">os modelos de aprendizagem automática</a> potenciem a pesquisa, as recomendações e a geração de texto, identificando dados através de <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">métricas de semelhança</a> para compreensão contextual.</p>
<p>As bibliotecas de índices vectoriais, como a HNSWlib, melhoram<a href="https://zilliz.com/learn/vector-similarity-search">a pesquisa</a> e a recuperação de vectores, mas não possuem as funcionalidades de gestão de uma base de dados completa. Por outro lado, as bases de dados de vectores, como <a href="https://milvus.io/">a Milvus</a>, foram concebidas para lidar com incorporações de vectores em escala, proporcionando vantagens na gestão de dados, indexação e capacidades de consulta que as bibliotecas autónomas normalmente não possuem. Aqui estão alguns outros benefícios da utilização do Milvus:</p>
<ul>
<li><p><strong>Pesquisa de similaridade vetorial de alta velocidade</strong>: O Milvus proporciona um desempenho de pesquisa ao nível dos milésimos de segundo em conjuntos de dados vectoriais à escala de mil milhões, ideal para aplicações como a recuperação de imagens, sistemas de recomendação, processamento de linguagem natural<a href="https://zilliz.com/learn/A-Beginner-Guide-to-Natural-Language-Processing">(PNL</a>) e geração aumentada de recuperação<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>).</p></li>
<li><p><strong>Escalabilidade e alta disponibilidade:</strong> Criado para lidar com grandes volumes de dados, o Milvus é escalonado horizontalmente e inclui mecanismos de replicação e failover para garantir a fiabilidade.</p></li>
<li><p><strong>Arquitetura distribuída:</strong> O Milvus utiliza uma arquitetura distribuída e escalável que separa o armazenamento e a computação em vários nós para maior flexibilidade e robustez.</p></li>
<li><p><a href="https://zilliz.com/blog/a-review-of-hybrid-search-in-milvus"><strong>Pesquisa híbrida</strong></a><strong>:</strong> Milvus suporta pesquisa multimodal, <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">pesquisa híbrida esparsa e densa</a>, e <a href="https://thenewstack.io/elasticsearch-was-great-but-vector-databases-are-the-future/">pesquisa</a> híbrida densa e <a href="https://thenewstack.io/elasticsearch-was-great-but-vector-databases-are-the-future/">de texto completo</a>, oferecendo uma funcionalidade de pesquisa versátil e flexível.</p></li>
<li><p><strong>Suporte flexível de dados</strong>: O Milvus suporta vários tipos de dados - vectores, escalares e dados estruturados - permitindo uma gestão e análise contínuas num único sistema.</p></li>
<li><p><a href="https://discord.com/invite/8uyFbECzPX"><strong>Comunidade</strong></a> <strong>e suporte</strong><a href="https://discord.com/invite/8uyFbECzPX"><strong>activos</strong></a>: Uma comunidade próspera fornece atualizações regulares, tutoriais e suporte, garantindo que o Milvus permaneça alinhado com as necessidades do usuário e os avanços no campo.</p></li>
<li><p><a href="https://milvus.io/docs/integrations_overview.md">Integração de IA</a>: O Milvus foi integrado com várias estruturas e tecnologias populares de IA, facilitando aos programadores a criação de aplicações com as suas pilhas de tecnologia familiares.</p></li>
</ul>
<p>Milvus também fornece um serviço totalmente gerenciado no <a href="https://zilliz.com/cloud">Ziliz Cloud</a>, que é descomplicado e 10x mais rápido do que Milvus.</p>
<h3 id="Comparison-Milvus-vs-HNSWlib" class="common-anchor-header">Comparação: Milvus vs. HNSWlib</h3><table>
<thead>
<tr><th style="text-align:center"><strong>Caraterísticas</strong></th><th style="text-align:center"><strong>Milvus</strong></th><th style="text-align:center"><strong>HNSWlib</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Escalabilidade</td><td style="text-align:center">Lida com milhares de milhões de vectores com facilidade</td><td style="text-align:center">Adequado para conjuntos de dados mais pequenos devido à utilização de RAM</td></tr>
<tr><td style="text-align:center">Ideal para</td><td style="text-align:center">Prototipagem, experimentação e aplicações de nível empresarial</td><td style="text-align:center">Foca-se em protótipos e tarefas ANN leves</td></tr>
<tr><td style="text-align:center">Indexação</td><td style="text-align:center">Suporta mais de 10 algoritmos de indexação, incluindo HNSW, DiskANN, Quantização e Binário</td><td style="text-align:center">Utiliza apenas um HNSW baseado em gráficos</td></tr>
<tr><td style="text-align:center">Integração</td><td style="text-align:center">Oferece APIs e serviços nativos da nuvem</td><td style="text-align:center">Serve como uma biblioteca leve e autónoma</td></tr>
<tr><td style="text-align:center">Desempenho</td><td style="text-align:center">Optimiza para grandes dados, consultas distribuídas</td><td style="text-align:center">Oferece alta velocidade, mas escalabilidade limitada</td></tr>
</tbody>
</table>
<p>No geral, o Milvus é geralmente preferível para aplicações de grande escala e de nível de produção com necessidades de indexação complexas, enquanto o HNSWlib é ideal para prototipagem e casos de utilização mais simples.</p>
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
    </button></h2><p>A pesquisa semântica pode consumir muitos recursos, pelo que a estruturação interna de dados, como a efectuada pelo HNSW, é essencial para uma recuperação de dados mais rápida. Bibliotecas como a HNSWlib preocupam-se com a implementação, pelo que os programadores têm as receitas prontas para criar protótipos de capacidades vectoriais. Com apenas algumas linhas de código, podemos construir o nosso próprio índice e efetuar pesquisas.</p>
<p>A HNSWlib é uma óptima maneira de começar. No entanto, se quiser criar aplicações de IA complexas e prontas a produzir, as bases de dados vectoriais criadas para o efeito são a melhor opção. Por exemplo, <a href="https://milvus.io/">a Milvus</a> é uma base de dados vetorial de código aberto com muitas funcionalidades prontas para empresas, como pesquisa vetorial de alta velocidade, escalabilidade, disponibilidade e flexibilidade em termos de tipos de dados e linguagem de programação.</p>
<h2 id="Further-Reading" class="common-anchor-header">Ler mais<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://zilliz.com/learn/faiss">O que é o Faiss (Facebook AI Similarity Search)? </a></p></li>
<li><p><a href="https://zilliz.com/learn/learn-hnswlib-graph-based-library-for-fast-anns">O que é HNSWlib? Uma biblioteca baseada em gráficos para pesquisa rápida de RNAs </a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">O que é ScaNN (Scalable Nearest Neighbors)? </a></p></li>
<li><p><a href="https://zilliz.com/vector-database-benchmark-tool?database=ZillizCloud%2CMilvus%2CElasticCloud%2CPgVector%2CPinecone%2CQdrantCloud%2CWeaviateCloud&amp;dataset=medium&amp;filter=none%2Clow%2Chigh&amp;tab=1">VectorDBBench: Uma ferramenta de benchmark VectorDB de código aberto</a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">Centro de recursos de IA generativa | Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-vector-database">O que são bancos de dados vetoriais e como eles funcionam? </a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">O que é RAG? </a></p></li>
<li><p><a href="https://zilliz.com/ai-models">Modelos de IA de alto desempenho para seus aplicativos GenAI | Zilliz</a></p></li>
</ul>
