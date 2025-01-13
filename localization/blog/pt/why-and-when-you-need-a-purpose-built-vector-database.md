---
id: why-and-when-you-need-a-purpose-built-vector-database.md
title: >-
  Porquê e quando é que é necessária uma base de dados de vectores criada para o
  efeito?
author: James Luan
date: 2023-08-29T00:00:00.000Z
cover: >-
  assets.zilliz.com/Why_you_need_a_real_vector_database2_20230830_075505_1_4b32582c87.png
tag: Engineering
tags: >-
  Vector Database, AI, Artificial Intelligence, Machine Learning, Milvus, LLM,
  Large Language Models, Embeddings, Vector search, Vector similarity search
desc: >-
  Esta publicação apresenta uma visão geral da pesquisa vetorial e do seu
  funcionamento, compara diferentes tecnologias de pesquisa vetorial e explica
  por que razão é crucial optar por uma base de dados vetorial criada para o
  efeito.
recommend: true
canonicalUrl: >-
  https://www.aiacceleratorinstitute.com/why-and-when-do-you-need-a-purpose-built-vector-database/
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Why_you_need_a_real_vector_database2_20230830_075505_1_4b32582c87.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Este artigo foi publicado originalmente no <a href="https://www.aiacceleratorinstitute.com/why-and-when-do-you-need-a-purpose-built-vector-database/">AIAI</a> e é republicado aqui com permissão.</em></p>
<p>A crescente popularidade do <a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a> e de outros modelos de linguagem de grande dimensão (LLMs) impulsionou o aumento das tecnologias de pesquisa vetorial, incluindo bases de dados vectoriais criadas para o efeito, como o <a href="https://milvus.io/docs/overview.md">Milvus</a> e o <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, bibliotecas de pesquisa vetorial, como o <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a>, e plug-ins de pesquisa vetorial integrados em bases de dados tradicionais. No entanto, escolher a melhor solução para as suas necessidades pode ser um desafio. Tal como escolher entre um restaurante de luxo e uma cadeia de fast-food, a seleção da tecnologia de pesquisa vetorial adequada depende das suas necessidades e expectativas.</p>
<p>Nesta publicação, apresentarei uma panorâmica geral da pesquisa vetorial e do seu funcionamento, compararei diferentes tecnologias de pesquisa vetorial e explicarei por que razão é crucial optar por uma base de dados vetorial criada para o efeito.</p>
<h2 id="What-is-vector-search-and-how-does-it-work" class="common-anchor-header">O que é a pesquisa vetorial e como funciona?<button data-href="#What-is-vector-search-and-how-does-it-work" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/blog/vector-similarity-search">A pesquisa vetorial</a>, também conhecida como pesquisa por semelhança de vectores, é uma técnica para recuperar os principais resultados que são mais semelhantes ou semanticamente relacionados com um determinado vetor de consulta entre uma extensa coleção de dados vectoriais densos.</p>
<p>Antes de efetuar pesquisas de semelhança, utilizamos redes neuronais para transformar <a href="https://zilliz.com/blog/introduction-to-unstructured-data">dados não estruturados</a>, como texto, imagens, vídeos e áudio, em vectores numéricos de elevada dimensão, denominados vectores de incorporação. Por exemplo, podemos utilizar a rede neural convolucional ResNet-50 pré-treinada para transformar uma imagem de uma ave numa coleção de incorporação com 2.048 dimensões. Aqui, listamos os três primeiros e os três últimos elementos do vetor: <code translate="no">[0.1392, 0.3572, 0.1988, ..., 0.2888, 0.6611, 0.2909]</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/bird_image_4a1be18f99.png" alt="A bird image by Patrice Bouchard" class="doc-image" id="a-bird-image-by-patrice-bouchard" />
   </span> <span class="img-wrapper"> <span>Imagem de uma ave por Patrice Bouchard</span> </span></p>
<p>Depois de gerar os vectores de incorporação, os motores de pesquisa vetorial comparam a distância espacial entre o vetor de consulta de entrada e os vectores nos armazenamentos vectoriais. Quanto mais próximos estiverem no espaço, mais semelhantes são.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_3732_20230510_073643_25f985523e.png" alt="Embedding arithmetic" class="doc-image" id="embedding-arithmetic" />
   </span> <span class="img-wrapper"> <span>Aritmética de incorporação</span> </span></p>
<h2 id="Popular-vector-search-technologies" class="common-anchor-header">Tecnologias populares de pesquisa vetorial<button data-href="#Popular-vector-search-technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>Estão disponíveis no mercado várias tecnologias de pesquisa vetorial, incluindo bibliotecas de aprendizagem automática como a NumPy do Python, bibliotecas de pesquisa vetorial como a FAISS, plug-ins de pesquisa vetorial criados em bases de dados tradicionais e bases de dados vectoriais especializadas como a Milvus e a Zilliz Cloud.</p>
<h3 id="Machine-learning-libraries" class="common-anchor-header">Bibliotecas de aprendizagem automática</h3><p>A utilização de bibliotecas de aprendizagem automática é a forma mais fácil de implementar pesquisas vectoriais. Por exemplo, podemos usar o NumPy do Python para implementar um algoritmo de vizinho mais próximo em menos de 20 linhas de código.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np

<span class="hljs-comment"># Function to calculate euclidean distance</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">euclidean_distance</span>(<span class="hljs-params">a, b</span>):
<span class="hljs-keyword">return</span> np.linalg.norm(a - b)

<span class="hljs-comment"># Function to perform knn</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">knn</span>(<span class="hljs-params">data, target, k</span>):
<span class="hljs-comment"># Calculate distances between target and all points in the data</span>
distances = [euclidean_distance(d, target) <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> data]
<span class="hljs-comment"># Combine distances with data indices</span>
distances = np.array(<span class="hljs-built_in">list</span>(<span class="hljs-built_in">zip</span>(distances, np.arange(<span class="hljs-built_in">len</span>(data)))))

<span class="hljs-comment"># Sort by distance</span>
sorted_distances = distances[distances[:, <span class="hljs-number">0</span>].argsort()]

<span class="hljs-comment"># Get the top k closest indices</span>
closest_k_indices = sorted_distances[:k, <span class="hljs-number">1</span>].astype(<span class="hljs-built_in">int</span>)

<span class="hljs-comment"># Return the top k closest vectors</span>
<span class="hljs-keyword">return</span> data[closest_k_indices]
<button class="copy-code-btn"></button></code></pre>
<p>Podemos gerar 100 vectores bidimensionais e encontrar o vizinho mais próximo do vetor [0.5, 0.5].</p>
<pre><code translate="no"><span class="hljs-comment"># Define some 2D vectors</span>
data = np.random.rand(<span class="hljs-number">100</span>, <span class="hljs-number">2</span>)

<span class="hljs-comment"># Define a target vector</span>
target = np.array([<span class="hljs-number">0.5</span>, <span class="hljs-number">0.5</span>])

<span class="hljs-comment"># Define k</span>
k = <span class="hljs-number">3</span>

<span class="hljs-comment"># Perform knn</span>
closest_vectors = knn(data, target, k)

<span class="hljs-comment"># Print the result</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;The closest vectors are:&quot;</span>)
<span class="hljs-built_in">print</span>(closest_vectors)
<button class="copy-code-btn"></button></code></pre>
<p>As bibliotecas de aprendizagem automática, como a NumPy do Python, oferecem uma grande flexibilidade a um baixo custo. No entanto, têm algumas limitações. Por exemplo, só podem lidar com uma pequena quantidade de dados e não garantem a persistência dos dados.</p>
<p>Só recomendo a utilização do NumPy ou de outras bibliotecas de aprendizagem automática para pesquisa vetorial quando:</p>
<ul>
<li>Necessita de uma prototipagem rápida.</li>
<li>Não se preocupa com a persistência dos dados.</li>
<li>O tamanho dos seus dados é inferior a um milhão e não necessita de filtragem escalar.</li>
<li>Não precisa de alto desempenho.</li>
</ul>
<h3 id="Vector-search-libraries" class="common-anchor-header">Bibliotecas de pesquisa vetorial</h3><p>As bibliotecas de pesquisa vetorial podem ajudá-lo a construir rapidamente um protótipo de sistema de pesquisa vetorial de elevado desempenho. O FAISS é um exemplo típico. É de código aberto e foi desenvolvida pela Meta para pesquisa eficiente de semelhanças e agrupamento de vectores densos. O FAISS pode lidar com colecções de vectores de qualquer tamanho, mesmo aquelas que não podem ser totalmente carregadas na memória. Além disso, o FAISS oferece ferramentas para avaliação e ajuste de parâmetros. Embora escrito em C++, FAISS fornece uma interface Python/NumPy.</p>
<p>Abaixo está o código de um exemplo de pesquisa vetorial baseado no FAISS:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> faiss

<span class="hljs-comment"># Generate some example data</span>
dimension = <span class="hljs-number">64</span> <span class="hljs-comment"># dimension of the vector space</span>
database_size = <span class="hljs-number">10000</span> <span class="hljs-comment"># size of the database</span>
query_size = <span class="hljs-number">100</span> <span class="hljs-comment"># number of queries to perform</span>
np.random.seed(<span class="hljs-number">123</span>) <span class="hljs-comment"># make the random numbers predictable</span>

<span class="hljs-comment"># Generating vectors to index in the database (db_vectors)</span>
db_vectors = np.random.random((database_size, dimension)).astype(<span class="hljs-string">&#x27;float32&#x27;</span>)

<span class="hljs-comment"># Generating vectors for query (query_vectors)</span>
query_vectors = np.random.random((query_size, dimension)).astype(<span class="hljs-string">&#x27;float32&#x27;</span>)

<span class="hljs-comment"># Building the index</span>
index = faiss.IndexFlatL2(dimension) <span class="hljs-comment"># using the L2 distance metric</span>
<span class="hljs-built_in">print</span>(index.is_trained) <span class="hljs-comment"># should return True</span>

<span class="hljs-comment"># Adding vectors to the index</span>
index.add(db_vectors)
<span class="hljs-built_in">print</span>(index.ntotal) <span class="hljs-comment"># should return database_size (10000)</span>

<span class="hljs-comment"># Perform a search</span>
k = <span class="hljs-number">4</span> <span class="hljs-comment"># we want to see 4 nearest neighbors</span>
distances, indices = index.search(query_vectors, k)

<span class="hljs-comment"># Print the results</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Indices of nearest neighbors: \n&quot;</span>, indices)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nL2 distances to the nearest neighbors: \n&quot;</span>, distances)
<button class="copy-code-btn"></button></code></pre>
<p>As bibliotecas de pesquisa vetorial como o FAISS são fáceis de utilizar e suficientemente rápidas para lidar com ambientes de produção em pequena escala com milhões de vectores. É possível melhorar o desempenho da consulta utilizando quantização e GPUs e reduzindo as dimensões dos dados.</p>
<p>No entanto, essas bibliotecas têm algumas limitações quando usadas na produção. Por exemplo, o FAISS não suporta adição e exclusão de dados em tempo real, chamadas remotas, vários idiomas, filtragem escalar, escalabilidade ou recuperação de desastres.</p>
<h3 id="Different-types-of-vector-databases" class="common-anchor-header">Diferentes tipos de bases de dados vectoriais</h3><p>As bases de dados vectoriais surgiram para dar resposta às limitações das bibliotecas acima referidas, fornecendo uma solução mais abrangente e prática para aplicações de produção.</p>
<p>Há quatro tipos de bases de dados vectoriais disponíveis no campo de batalha:</p>
<ul>
<li>Bases de dados relacionais ou colunares existentes que incorporam um plugin de pesquisa vetorial. O PG Vetor é um exemplo.</li>
<li>Motores de pesquisa tradicionais de índice invertido com suporte para indexação vetorial densa. <a href="https://zilliz.com/comparison/elastic-vs-milvus">O ElasticSearch</a> é um exemplo.</li>
<li>Bases de dados vectoriais leves baseadas em bibliotecas de pesquisa vetorial. Chroma é um exemplo.</li>
<li><strong>Bases de dados vectoriais criadas para fins específicos</strong>. Este tipo de base de dados foi especificamente concebido e optimizado para a pesquisa vetorial de baixo para cima. As bases de dados vectoriais específicas oferecem normalmente funcionalidades mais avançadas, incluindo computação distribuída, recuperação de desastres e persistência de dados. <a href="https://zilliz.com/what-is-milvus">O Milvus</a> é um exemplo importante.</li>
</ul>
<p>Nem todas as bases de dados vectoriais são criadas da mesma forma. Cada pilha tem vantagens e limitações únicas, o que as torna mais ou menos adequadas para diferentes aplicações.</p>
<p>Prefiro bases de dados vectoriais especializadas a outras soluções porque são a opção mais eficiente e conveniente, oferecendo inúmeras vantagens únicas. Nas secções seguintes, utilizarei o Milvus como exemplo para explicar as razões da minha preferência.</p>
<h2 id="Key-benefits-of-purpose-built-vector-databases" class="common-anchor-header">Principais vantagens das bases de dados vectoriais criadas para fins específicos<button data-href="#Key-benefits-of-purpose-built-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">O Milvus</a> é uma base de dados de vectores de código aberto, distribuída e criada para o efeito, que pode armazenar, indexar, gerir e recuperar milhares de milhões de vectores de incorporação. É também uma das bases de dados vectoriais mais populares para a <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">geração aumentada de recuperação LLM</a>. Como exemplo de bases de dados vectoriais criadas para o efeito, o Milvus partilha muitas vantagens únicas com as suas congéneres.</p>
<h3 id="Data-Persistence-and-Cost-Effective-Storage" class="common-anchor-header">Persistência de dados e armazenamento económico</h3><p>Embora a prevenção da perda de dados seja o requisito mínimo para uma base de dados, muitas bases de dados vectoriais leves e de máquina única não dão prioridade à fiabilidade dos dados. Por outro lado, as bases de dados vectoriais distribuídas criadas para o efeito, como <a href="https://zilliz.com/what-is-milvus">a Milvus</a>, dão prioridade à resiliência do sistema, à escalabilidade e à persistência dos dados, separando o armazenamento e a computação.</p>
<p>Além disso, a maioria das bases de dados vectoriais que utilizam índices ANN (approximate nearest neighbor) necessitam de muita memória para efetuar pesquisas vectoriais, uma vez que carregam os índices ANN exclusivamente na memória. No entanto, o Milvus suporta índices em disco, tornando o armazenamento dez vezes mais económico do que os índices em memória.</p>
<h3 id="Optimal-Query-Performance" class="common-anchor-header">Desempenho ótimo das consultas</h3><p>Uma base de dados vetorial especializada fornece um desempenho de consulta ótimo em comparação com outras opções de pesquisa vetorial. Por exemplo, o Milvus é dez vezes mais rápido no tratamento de consultas do que os plugins de pesquisa vetorial. O Milvus utiliza o <a href="https://zilliz.com/glossary/anns">algoritmo ANN</a> em vez do algoritmo de pesquisa brutal KNN para uma pesquisa vetorial mais rápida. Além disso, fragmenta os seus índices, reduzindo o tempo necessário para construir um índice à medida que o volume de dados aumenta. Esta abordagem permite ao Milvus lidar facilmente com milhares de milhões de vectores com adições e eliminações de dados em tempo real. Em contrapartida, outros add-ons de pesquisa vetorial só são adequados para cenários com menos de dezenas de milhões de dados e adições e eliminações pouco frequentes.</p>
<p>O Milvus também suporta a aceleração por GPU. Testes internos mostram que a indexação vetorial acelerada por GPU pode atingir mais de 10.000 QPS ao pesquisar dezenas de milhões de dados, o que é pelo menos dez vezes mais rápido do que a indexação tradicional por CPU para o desempenho de consultas numa única máquina.</p>
<h3 id="System-Reliability" class="common-anchor-header">Confiabilidade do sistema</h3><p>Muitas aplicações utilizam bases de dados vectoriais para consultas online que requerem uma baixa latência de consulta e um elevado rendimento. Essas aplicações exigem failover de máquina única no nível do minuto, e algumas até exigem recuperação de desastres entre regiões para cenários críticos. As estratégias de replicação tradicionais baseadas em Raft/Paxos sofrem de um grave desperdício de recursos e necessitam de ajuda para pré-distribuir os dados, o que leva a uma fraca fiabilidade. Em contrapartida, o Milvus tem uma arquitetura distribuída que aproveita as filas de mensagens do K8s para uma elevada disponibilidade, reduzindo o tempo de recuperação e poupando recursos.</p>
<h3 id="Operability-and-Observability" class="common-anchor-header">Operacionalidade e observabilidade</h3><p>Para melhor servir os utilizadores empresariais, as bases de dados vectoriais devem oferecer uma gama de caraterísticas de nível empresarial para uma melhor operabilidade e observabilidade. O Milvus suporta vários métodos de implementação, incluindo K8s Operator e Helm chart, docker-compose e pip install, tornando-o acessível a utilizadores com diferentes necessidades. O Milvus também fornece um sistema de monitorização e alarme baseado em Grafana, Prometheus e Loki, melhorando a sua observabilidade. Com uma arquitetura distribuída nativa da nuvem, o Milvus é o primeiro banco de dados vetorial do setor a oferecer suporte ao isolamento de vários locatários, RBAC, limitação de cotas e atualizações contínuas. Todas essas abordagens tornam o gerenciamento e o monitoramento do Milvus muito mais simples.</p>
<h2 id="Getting-started-with-Milvus-in-3-simple-steps-within-10-minutes" class="common-anchor-header">Começar a utilizar o Milvus em 3 passos simples em 10 minutos<button data-href="#Getting-started-with-Milvus-in-3-simple-steps-within-10-minutes" class="anchor-icon" translate="no">
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
    </button></h2><p>Construir uma base de dados vetorial é uma tarefa complexa, mas utilizar uma é tão simples como utilizar Numpy e FAISS. Mesmo os estudantes não familiarizados com a IA podem implementar a pesquisa vetorial com base no Milvus em apenas dez minutos. Para experimentar serviços de pesquisa vetorial altamente escaláveis e de elevado desempenho, siga estes três passos:</p>
<ul>
<li>Implementar o Milvus no seu servidor com a ajuda do <a href="https://milvus.io/docs/install_standalone-docker.md">documento de implementação do Milvus</a>.</li>
<li>Implementar a pesquisa vetorial com apenas 50 linhas de código, consultando o <a href="https://milvus.io/docs/example_code.md">documento Hello Milvus</a>.</li>
<li>Explore os <a href="https://github.com/towhee-io/examples/">documentos de exemplo do Towhee</a> para obter informações sobre <a href="https://zilliz.com/use-cases">casos de utilização</a> populares <a href="https://zilliz.com/use-cases">de bases de dados vectoriais</a>.</li>
</ul>
