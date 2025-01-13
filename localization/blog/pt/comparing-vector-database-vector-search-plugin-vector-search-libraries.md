---
id: comparing-vector-database-vector-search-plugin-vector-search-libraries.md
title: >-
  Comparação de bases de dados vectoriais, bibliotecas de pesquisa vetorial e
  plug-ins de pesquisa vetorial
author: Frank Liu
date: 2023-11-9
desc: >-
  Nesta publicação, continuaremos a explorar o intrincado domínio da pesquisa
  vetorial, comparando bases de dados vectoriais, plug-ins de pesquisa vetorial
  e bibliotecas de pesquisa vetorial.
cover: >-
  assets.zilliz.com/Vector_Databases_vs_Vector_Search_Plugins_vs_Vector_Search_Libraries_74def521ad.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  vector search
recommend: true
canonicalUrl: >-
  https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vector_Databases_vs_Vector_Search_Plugins_vs_Vector_Search_Libraries_74def521ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Olá - bem-vindo de volta ao Vetor Database 101!</p>
<p>O aumento do <a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a> e de outros modelos de linguagem de grande porte (LLMs) impulsionou o crescimento das tecnologias de pesquisa vetorial, apresentando bancos de dados vetoriais especializados, como <a href="https://zilliz.com/what-is-milvus">Milvus</a> e <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, juntamente com bibliotecas como <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a> e plug-ins de pesquisa vetorial integrados em bancos de dados convencionais.</p>
<p>Na <a href="https://zilliz.com/learn/what-is-vector-database">publicação anterior da</a> nossa <a href="https://zilliz.com/learn/what-is-vector-database">série</a>, analisámos os fundamentos das bases de dados vectoriais. Nesta publicação, continuaremos a explorar o complexo domínio da pesquisa vetorial, comparando bases de dados vectoriais, plug-ins de pesquisa vetorial e bibliotecas de pesquisa vetorial.</p>
<h2 id="What-is-vector-search" class="common-anchor-header">O que é pesquisa vetorial?<button data-href="#What-is-vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/learn/vector-similarity-search">A pesquisa vetorial</a>, também conhecida como pesquisa de similaridade vetorial, é uma técnica para recuperar os resultados top-k que são mais semelhantes ou semanticamente relacionados a um determinado vetor de consulta entre uma extensa coleção de dados vetoriais densos. Antes de efetuar pesquisas de semelhança, utilizamos redes neuronais para transformar <a href="https://zilliz.com/learn/introduction-to-unstructured-data">dados não estruturados</a>, como texto, imagens, vídeos e áudio, em vectores numéricos de elevada dimensão, denominados vectores de incorporação. Depois de gerar vectores de incorporação, os motores de pesquisa vetorial comparam a distância espacial entre o vetor de consulta de entrada e os vectores nos armazenamentos vectoriais. Quanto mais próximos estiverem no espaço, mais semelhantes são.</p>
<p>Estão disponíveis no mercado várias tecnologias de pesquisa vetorial, incluindo bibliotecas de aprendizagem automática como a NumPy do Python, bibliotecas de pesquisa vetorial como a FAISS, plug-ins de pesquisa vetorial criados em bases de dados tradicionais e bases de dados vectoriais especializadas como a Milvus e a Zilliz Cloud.</p>
<h2 id="Vector-databases-vs-vector-search-libraries" class="common-anchor-header">Bases de dados vectoriais vs. bibliotecas de pesquisa vetorial<button data-href="#Vector-databases-vs-vector-search-libraries" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/blog/what-is-a-real-vector-database">Os bancos de dados vetoriais especializados</a> não são a única pilha para pesquisas de similaridade. Antes do advento dos bancos de dados vetoriais, muitas bibliotecas de pesquisa de vetores, como FAISS, ScaNN e HNSW, eram usadas para recuperação de vetores.</p>
<p>As bibliotecas de pesquisa vetorial podem ajudá-lo a criar rapidamente um protótipo de sistema de pesquisa vetorial de elevado desempenho. Tomando o FAISS como exemplo, é de código aberto e foi desenvolvido pela Meta para uma pesquisa eficiente de semelhanças e agrupamento de vectores densos. O FAISS pode lidar com colecções de vectores de qualquer tamanho, mesmo aquelas que não podem ser totalmente carregadas na memória. Além disso, o FAISS oferece ferramentas para avaliação e ajuste de parâmetros. Embora escrito em C++, o FAISS fornece uma interface Python/NumPy.</p>
<p>No entanto, as bibliotecas de pesquisa vetorial são apenas bibliotecas ANN leves, em vez de soluções geridas, e têm uma funcionalidade limitada. Se o seu conjunto de dados for pequeno e limitado, estas bibliotecas podem ser suficientes para o processamento de dados não estruturados, mesmo para sistemas em produção. No entanto, à medida que o tamanho do conjunto de dados aumenta e mais utilizadores são integrados, o problema da escala torna-se cada vez mais difícil de resolver. Além disso, não permitem quaisquer modificações nos seus dados de índice e não podem ser consultadas durante a importação de dados.</p>
<p>Em contrapartida, as bases de dados vectoriais são uma solução mais adequada para o armazenamento e a recuperação de dados não estruturados. Podem armazenar e consultar milhões ou mesmo milhares de milhões de vectores, fornecendo simultaneamente respostas em tempo real; são altamente escaláveis para satisfazer as crescentes necessidades comerciais dos utilizadores.</p>
<p>Além disso, as bases de dados vectoriais como o Milvus têm caraterísticas muito mais fáceis de utilizar para dados estruturados/semi-estruturados: natividade da nuvem, multi-tenancy, escalabilidade, etc. Estas caraterísticas tornar-se-ão claras à medida que nos aprofundarmos neste tutorial.</p>
<p>Também operam numa camada de abstração totalmente diferente das bibliotecas de pesquisa vetorial - as bases de dados vectoriais são serviços completos, enquanto as bibliotecas ANN se destinam a ser integradas na aplicação que está a desenvolver. Neste sentido, as bibliotecas ANN são um dos muitos componentes sobre os quais as bases de dados vectoriais são construídas, da mesma forma que o Elasticsearch é construído sobre o Apache Lucene.</p>
<p>Para dar um exemplo do motivo pelo qual esta abstração é tão importante, vejamos como inserir um novo elemento de dados não estruturados numa base de dados vetorial. Isto é muito fácil no Milvus:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collectioncollection</span> = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&#x27;book&#x27;</span>)mr = collection.<span class="hljs-title function_">insert</span>(data)
<button class="copy-code-btn"></button></code></pre>
<p>É realmente tão fácil quanto isso - 3 linhas de código. Com uma biblioteca como a FAISS ou a ScaNN, não há, infelizmente, uma forma fácil de o fazer sem recriar manualmente todo o índice em determinados pontos de controlo. Mesmo que fosse possível, as bibliotecas de pesquisa vetorial continuam a não ter escalabilidade e multilocação, duas das caraterísticas mais importantes das bases de dados vectoriais.</p>
<h2 id="Vector-databases-vs-vector-search-plugins-for-traditional-databases" class="common-anchor-header">Bases de dados vectoriais vs. plugins de pesquisa vetorial para bases de dados tradicionais<button data-href="#Vector-databases-vs-vector-search-plugins-for-traditional-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Ótimo, agora que já estabelecemos a diferença entre bibliotecas de pesquisa vetorial e bases de dados vectoriais, vamos ver como as bases de dados vectoriais diferem dos <strong>plugins de pesquisa vetorial</strong>.</p>
<p>Um número crescente de bancos de dados relacionais tradicionais e sistemas de pesquisa como o Clickhouse e o <a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">Elasticsearch</a> estão incluindo plug-ins de pesquisa vetorial integrados. O Elasticsearch 8.0, por exemplo, inclui a inserção de vetores e a funcionalidade de pesquisa ANN que pode ser chamada por meio de pontos de extremidade de API restrita. O problema com os plug-ins de pesquisa vetorial deve ser claro como a noite e o dia - <strong>essas soluções não adotam uma abordagem de pilha completa para incorporar o gerenciamento e a pesquisa vetorial</strong>. Em vez disso, esses plug-ins devem ser aprimorados em arquiteturas existentes, o que os torna limitados e não otimizados. Desenvolver uma aplicação de dados não estruturados sobre uma base de dados tradicional seria como tentar encaixar baterias de lítio e motores eléctricos na estrutura de um carro a gasolina - não é uma boa ideia!</p>
<p>Para ilustrar esta situação, voltemos à lista de funcionalidades que uma base de dados vetorial deve implementar (da primeira secção). Os plugins de pesquisa vetorial carecem de duas destas caraterísticas - afinabilidade e APIs/SDKs fáceis de utilizar. Continuarei a utilizar o motor ANN do Elasticsearch como exemplo; outros plugins de pesquisa vetorial funcionam de forma muito semelhante, pelo que não entrarei muito em pormenores. O Elasticsearch suporta o armazenamento de vectores através do tipo de campo de dados <code translate="no">dense_vector</code> e permite a consulta através do <code translate="no">knnsearch endpoint</code>:</p>
<pre><code translate="no" class="language-json">PUT index
{
<span class="hljs-string">&quot;mappings&quot;</span>: {
  <span class="hljs-string">&quot;properties&quot;</span>: {
    <span class="hljs-string">&quot;image-vector&quot;</span>: {
      <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;dense_vector&quot;</span>,
      <span class="hljs-string">&quot;dims&quot;</span>: 128,
      <span class="hljs-string">&quot;index&quot;</span>: <span class="hljs-literal">true</span>,
      <span class="hljs-string">&quot;similarity&quot;</span>: <span class="hljs-string">&quot;l2_norm&quot;</span>
    }
  }
}
}


PUT index/_doc
{
<span class="hljs-string">&quot;image-vector&quot;</span>: [0.12, 1.34, ...]
}
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-json">GET index/_knn_search
{
<span class="hljs-string">&quot;knn&quot;</span>: {
  <span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;image-vector&quot;</span>,
  <span class="hljs-string">&quot;query_vector&quot;</span>: [-0.5, 9.4, ...],
  <span class="hljs-string">&quot;k&quot;</span>: 10,
  <span class="hljs-string">&quot;num_candidates&quot;</span>: 100
}
}
<button class="copy-code-btn"></button></code></pre>
<p>O plug-in ANN do Elasticsearch suporta apenas um algoritmo de indexação: Hierarchical Navigable Small Worlds, também conhecido como HNSW (gosto de pensar que o criador estava à frente da Marvel quando se tratou de popularizar o multiverso). Para além disso, apenas a distância L2/Euclidiana é suportada como métrica de distância. É um bom começo, mas vamos compará-lo com o Milvus, uma base de dados vetorial completa. Usando <code translate="no">pymilvus</code>:</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">&gt;&gt;&gt; </span>field1 = FieldSchema(name=<span class="hljs-string">&#x27;id&#x27;</span>, dtype=DataType.INT64, description=<span class="hljs-string">&#x27;int64&#x27;</span>, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>field2 = FieldSchema(name=<span class="hljs-string">&#x27;embedding&#x27;</span>, dtype=DataType.FLOAT_VECTOR, description=<span class="hljs-string">&#x27;embedding&#x27;</span>, dim=<span class="hljs-number">128</span>, is_primary=<span class="hljs-literal">False</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>schema = CollectionSchema(fields=[field1, field2], description=<span class="hljs-string">&#x27;hello world collection&#x27;</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>collection = Collection(name=<span class="hljs-string">&#x27;my_collection&#x27;</span>, data=<span class="hljs-literal">None</span>, schema=schema)
<span class="hljs-meta">&gt;&gt;&gt; </span>index_params = {
       <span class="hljs-string">&#x27;index_type&#x27;</span>: <span class="hljs-string">&#x27;IVF_FLAT&#x27;</span>,
       <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;nlist&#x27;</span>: <span class="hljs-number">1024</span>},
       <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&#x27;L2&#x27;</span>}
<span class="hljs-meta">&gt;&gt;&gt; </span>collection.create_index(<span class="hljs-string">&#x27;embedding&#x27;</span>, index_params)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-python"><span class="hljs-meta">&gt;&gt;&gt; </span>search_param = {
       <span class="hljs-string">&#x27;data&#x27;</span>: vector,
       <span class="hljs-string">&#x27;anns_field&#x27;</span>: <span class="hljs-string">&#x27;embedding&#x27;</span>,
       <span class="hljs-string">&#x27;param&#x27;</span>: {<span class="hljs-string">&#x27;metric_type&#x27;</span>: <span class="hljs-string">&#x27;L2&#x27;</span>, <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;nprobe&#x27;</span>: <span class="hljs-number">16</span>}},
       <span class="hljs-string">&#x27;limit&#x27;</span>: <span class="hljs-number">10</span>,
       <span class="hljs-string">&#x27;expr&#x27;</span>: <span class="hljs-string">&#x27;id_field &gt; 0&#x27;</span>
   }
<span class="hljs-meta">&gt;&gt;&gt; </span>results = collection.search(**search_param)
<button class="copy-code-btn"></button></code></pre>
<p>Embora tanto <a href="https://zilliz.com/comparison/elastic-vs-milvus">o Elasticsearch quanto o Milvus</a> tenham métodos para criar índices, inserir vetores de incorporação e executar a pesquisa de vizinho mais próximo, fica claro a partir desses exemplos que o Milvus tem uma API de pesquisa vetorial mais intuitiva (melhor API voltada para o usuário) e um índice vetorial mais amplo + suporte à métrica de distância (melhor ajuste). Milvus também planeia suportar mais índices vectoriais e permitir a consulta através de instruções do tipo SQL no futuro, melhorando ainda mais a afinação e a usabilidade.</p>
<p>Acabámos de passar por uma grande quantidade de conteúdo. Esta secção foi reconhecidamente bastante longa, por isso, para aqueles que a passaram despercebidos, aqui fica um tl;dr rápido: o Milvus é melhor do que os plugins de pesquisa vetorial porque o Milvus foi construído de raiz como uma base de dados vetorial, permitindo um conjunto mais rico de funcionalidades e uma arquitetura mais adequada a dados não estruturados.</p>
<h2 id="How-to-choose-from-different-vector-search-technologies" class="common-anchor-header">Como escolher entre diferentes tecnologias de pesquisa vetorial?<button data-href="#How-to-choose-from-different-vector-search-technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>Nem todas as bases de dados vectoriais são criadas da mesma forma; cada uma possui caraterísticas únicas que se adaptam a aplicações específicas. As bibliotecas e os plugins de pesquisa vetorial são fáceis de utilizar e ideais para lidar com ambientes de produção de pequena escala com milhões de vectores. Se a dimensão dos seus dados for pequena e apenas necessitar de uma funcionalidade básica de pesquisa de vectores, estas tecnologias são suficientes para a sua empresa.</p>
<p>No entanto, uma base de dados especializada em vectores deve ser a sua primeira escolha para empresas com grande volume de dados, que lidam com centenas de milhões de vectores e exigem respostas em tempo real. O Milvus, por exemplo, gere sem esforço milhares de milhões de vectores, oferecendo velocidades de consulta extremamente rápidas e uma funcionalidade rica. Além disso, as soluções totalmente geridas, como o Zilliz, revelam-se ainda mais vantajosas, libertando-o dos desafios operacionais e permitindo-lhe concentrar-se exclusivamente nas suas actividades principais.</p>
<h2 id="Take-another-look-at-the-Vector-Database-101-courses" class="common-anchor-header">Dê outra vista de olhos aos cursos Vetor Database 101<button data-href="#Take-another-look-at-the-Vector-Database-101-courses" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li><a href="https://zilliz.com/blog/introduction-to-unstructured-data">Introdução aos dados não estruturados</a></li>
<li><a href="https://zilliz.com/learn/what-is-vector-database">O que é uma Base de Dados Vetorial?</a></li>
<li><a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">Comparação entre Bases de Dados Vectoriais, Bibliotecas de Pesquisa Vetorial e Plugins de Pesquisa Vetorial</a></li>
<li><a href="https://zilliz.com/blog/introduction-to-milvus-vector-database">Introdução ao Milvus</a></li>
<li><a href="https://zilliz.com/blog/milvus-vector-database-quickstart">Início rápido do Milvus</a></li>
<li><a href="https://zilliz.com/blog/vector-similarity-search">Introdução à pesquisa de similaridade vetorial</a></li>
<li><a href="https://zilliz.com/blog/vector-index">Noções básicas sobre o índice vetorial e o índice de arquivo invertido</a></li>
<li><a href="https://zilliz.com/blog/scalar-quantization-and-product-quantization">Quantização escalar e quantização de produtos</a></li>
<li><a href="https://zilliz.com/blog/hierarchical-navigable-small-worlds-HNSW">Mundos pequenos navegáveis hierárquicos (HNSW)</a></li>
<li><a href="https://zilliz.com/learn/approximate-nearest-neighbor-oh-yeah-ANNOY">Vizinhos mais próximos aproximados Oh Yeah (ANNOY)</a></li>
<li><a href="https://zilliz.com/learn/choosing-right-vector-index-for-your-project">Escolhendo o índice vetorial correto para seu projeto</a></li>
<li><a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN e o Algoritmo Vamana</a></li>
</ol>
