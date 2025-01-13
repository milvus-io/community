---
id: >-
  2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md
title: >-
  Como utilizar dados de cadeias de caracteres para potenciar as suas aplicações
  de pesquisa por semelhança
author: Xi Ge
date: 2022-08-08T00:00:00.000Z
desc: >-
  Utilize dados de cadeia de caracteres para simplificar o processo de criação
  das suas próprias aplicações de pesquisa por semelhança.
cover: assets.zilliz.com/string_6129ce83e6.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/string_6129ce83e6.png" alt="Cover" class="doc-image" id="cover" />
   </span> <span class="img-wrapper"> <span>Capa</span> </span></p>
<p>O Milvus 2.1 vem com <a href="https://milvus.io/blog/2022-08-05-whats-new-in-milvus-2-1.md">algumas actualizações significativas</a> que tornam o trabalho com o Milvus muito mais fácil. Uma delas é o suporte do tipo de dados string. Neste momento, o Milvus <a href="https://milvus.io/docs/v2.1.x/schema.md#Supported-data-type">suporta tipos de dados</a> que incluem strings, vectores, booleanos, inteiros, números de vírgula flutuante e muito mais.</p>
<p>Este artigo apresenta uma introdução ao suporte do tipo de dados string. Leia e saiba o que pode fazer com ele e como o utilizar.</p>
<p><strong>Saltar para:</strong></p>
<ul>
<li><a href="#What-can-you-do-with-string-data">O que é que se pode fazer com dados de cadeia de caracteres?</a></li>
<li><a href="#How-to-manage-string-data-in-Milvus-21">Como gerir dados string no Milvus 2.1?</a><ul>
<li><a href="#Create-a-collection">Criar uma coleção</a></li>
<li><a href="#Insert-data">Inserir e apagar dados</a></li>
<li><a href="#Build-an-index">Construir um índice</a></li>
<li><a href="#Hybrid-search">Pesquisa híbrida</a></li>
<li><a href="#String-expressions">Expressões de cadeia de caracteres</a></li>
</ul></li>
</ul>
<custom-h1>O que pode fazer com dados de cadeia de caracteres?</custom-h1><p>O suporte do tipo de dados string tem sido uma das funções mais esperadas pelos utilizadores. Esta função simplifica o processo de construção de uma aplicação com a base de dados vetorial do Milvus e acelera a velocidade da pesquisa por semelhança e da consulta vetorial, aumentando largamente a eficiência e reduzindo o custo de manutenção de qualquer aplicação em que esteja a trabalhar.</p>
<p>Especificamente, o Milvus 2.1 suporta o tipo de dados VARCHAR, que armazena cadeias de caracteres de comprimento variável. Com o suporte do tipo de dados VARCHAR, é possível:</p>
<ol>
<li>Gerenciar diretamente dados de string sem a ajuda de um banco de dados relacional externo.</li>
</ol>
<p>O suporte do tipo de dados VARCHAR permite-lhe saltar a etapa de conversão de cadeias de caracteres noutros tipos de dados quando insere dados no Milvus. Digamos que está a trabalhar num sistema de pesquisa de livros para a sua própria livraria online. Está a criar um conjunto de dados de livros e pretende identificar os livros com os seus nomes. Enquanto nas versões anteriores o Milvus não suportava o tipo de dados string, antes de inserir dados no MIilvus, pode ser necessário transformar primeiro as strings (os nomes dos livros) em IDs de livros com a ajuda de uma base de dados relacional como o MySQL. Neste momento, como o tipo de dados string é suportado, pode simplesmente criar um campo string e introduzir diretamente os nomes dos livros em vez dos respectivos números de ID.</p>
<p>A conveniência também se aplica ao processo de pesquisa e consulta. Imagine que há um cliente cujo livro favorito é <em>"Hello Milvus</em>". Pretende procurar no sistema livros semelhantes e recomendá-los ao cliente. Nas versões anteriores do Milvus, o sistema apenas lhe devolve os IDs dos livros e é necessário dar um passo extra para verificar a informação do livro correspondente numa base de dados relacional. Mas no Milvus 2.1, pode obter diretamente os nomes dos livros, uma vez que já criou um campo de cadeia de caracteres com os nomes dos livros.</p>
<p>Em suma, o suporte do tipo de dados string poupa-lhe o esforço de recorrer a outras ferramentas para gerir dados string, o que simplifica bastante o processo de desenvolvimento.</p>
<ol start="2">
<li>Acelere a velocidade da <a href="https://milvus.io/docs/v2.1.x/hybridsearch.md">pesquisa híbrida</a> e da <a href="https://milvus.io/docs/v2.1.x/query.md">consulta vetorial</a> através da filtragem de atributos.</li>
</ol>
<p>Tal como outros tipos de dados escalares, o VARCHAR pode ser utilizado para filtragem de atributos na pesquisa híbrida e na consulta vetorial através de expressões booleanas. É particularmente importante referir que o Milvus 2.1 adiciona o operador <code translate="no">like</code>, que lhe permite efetuar correspondências de prefixos. Além disso, é possível efetuar uma correspondência exacta utilizando o operador <code translate="no">==</code>.</p>
<p>Além disso, é suportado um índice invertido baseado na MARISA-trie para acelerar a pesquisa e a consulta híbridas. Continue a ler e descubra todas as expressões de cadeia que pode querer saber para efetuar a filtragem de atributos com dados de cadeia.</p>
<custom-h1>Como gerir dados de cadeia de caracteres no Milvus 2.1?</custom-h1><p>Agora sabemos que o tipo de dados "string" é extremamente útil, mas quando é que precisamos exatamente de utilizar este tipo de dados na construção das nossas próprias aplicações? A seguir, verá alguns exemplos de código de cenários que podem envolver dados string, o que lhe dará uma melhor compreensão de como gerir dados VARCHAR no Milvus 2.1.</p>
<h2 id="Create-a-collection" class="common-anchor-header">Criar uma coleção<button data-href="#Create-a-collection" class="anchor-icon" translate="no">
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
    </button></h2><p>Vamos seguir o exemplo anterior. Ainda está a trabalhar no sistema de recomendação de livros e pretende criar uma coleção de livros com um campo de chave primária chamado <code translate="no">book_name</code>, no qual irá inserir dados em string. Neste caso, pode definir o tipo de dados como <code translate="no">DataType.VARCHAR</code>ao definir o esquema do campo, como mostra o exemplo abaixo.</p>
<p>Tenha em atenção que, ao criar um campo VARCHAR, é necessário especificar o comprimento máximo dos caracteres através do parâmetro <code translate="no">max_length</code>, cujo valor pode variar entre 1 e 65.535.  Neste exemplo, definimos o comprimento máximo como 200.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> CollectionSchema, FieldSchema, DataType
book_id = FieldSchema(
  name=<span class="hljs-string">&quot;book_id&quot;</span>, 
  dtype=DataType.INT64, 
)
book_name = FieldSchema( 
  name=<span class="hljs-string">&quot;book_name&quot;</span>, 
  dtype=DataType.VARCHAR, 
  max_length=<span class="hljs-number">200</span>, 
  is_primary=<span class="hljs-literal">True</span>, 
)
word_count = FieldSchema(
  name=<span class="hljs-string">&quot;word_count&quot;</span>, 
  dtype=DataType.INT64,  
)
book_intro = FieldSchema(
  name=<span class="hljs-string">&quot;book_intro&quot;</span>, 
  dtype=DataType.FLOAT_VECTOR, 
  dim=<span class="hljs-number">2</span>
)
schema = CollectionSchema(
  fields=[book_id, word_count, book_intro], 
  description=<span class="hljs-string">&quot;Test book search&quot;</span>
)
collection_name = <span class="hljs-string">&quot;book&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Insert-data" class="common-anchor-header">Inserir dados<button data-href="#Insert-data" class="anchor-icon" translate="no">
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
    </button></h2><p>Agora que a coleção foi criada, podemos inserir dados na mesma. No exemplo seguinte, inserimos 2.000 linhas de dados de cadeia de caracteres gerados aleatoriamente.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">import</span> random
data = [
  [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
  [<span class="hljs-string">&quot;book_&quot;</span> + <span class="hljs-built_in">str</span>(i) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
  [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">10000</span>, <span class="hljs-number">12000</span>)],
  [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Delete-data" class="common-anchor-header">Eliminar dados<button data-href="#Delete-data" class="anchor-icon" translate="no">
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
    </button></h2><p>Suponha que dois livros, denominados <code translate="no">book_0</code> e <code translate="no">book_1</code>, já não estão disponíveis na sua loja, pelo que pretende eliminar as informações relevantes da sua base de dados. Neste caso, pode utilizar a expressão de termo <code translate="no">in</code> para filtrar as entidades a eliminar, como mostra o exemplo abaixo.</p>
<p>Lembre-se que o Milvus apenas suporta a eliminação de entidades com chaves primárias claramente especificadas, por isso, antes de executar o código seguinte, certifique-se de que definiu o campo <code translate="no">book_name</code> como o campo de chave primária.</p>
<pre><code translate="no" class="language-Python">expr = <span class="hljs-string">&quot;book_name in [\&quot;book_0\&quot;, \&quot;book_1\&quot;]&quot;</span> 
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collection</span>
collection = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&quot;book&quot;</span>)     
collection.<span class="hljs-title function_">delete</span>(expr)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Build-an-Index" class="common-anchor-header">Construir um índice<button data-href="#Build-an-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 suporta a construção de índices escalares, o que irá acelerar muito a filtragem de campos de string. Ao contrário da construção de um índice vetorial, não é necessário preparar parâmetros antes de construir um índice escalar. Milvus temporariamente só suporta o índice de árvore de dicionário (MARISA-trie), por isso o tipo de índice do campo do tipo VARCHAR é MARISA-trie por defeito.</p>
<p>Pode especificar o nome do índice ao construí-lo. Se não for especificado, o valor predefinido de <code translate="no">index_name</code> é <code translate="no">&quot;_default_idx_&quot;</code>. No exemplo abaixo, chamámos ao índice <code translate="no">scalar_index</code>.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collection</span>
collection = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&quot;book&quot;</span>)   
collection.<span class="hljs-title function_">create_index</span>(
  field_name=<span class="hljs-string">&quot;book_name&quot;</span>, 
  index_name=<span class="hljs-string">&quot;scalar_index&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Hybrid-search" class="common-anchor-header">Pesquisa híbrida<button data-href="#Hybrid-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Ao especificar expressões booleanas, pode filtrar os campos de cadeia de caracteres durante uma pesquisa de semelhança de vetor.</p>
<p>Por exemplo, se estiver a procurar livros cuja introdução seja mais semelhante a Hello Milvus, mas apenas pretender obter os livros cujos nomes comecem por 'book_2', pode utilizar o operador <code translate="no">like</code>para efetuar uma correspondência de prefixo e obter os livros visados, como se mostra no exemplo abaixo.</p>
<pre><code translate="no" class="language-Python">search_param = {
  <span class="hljs-string">&quot;data&quot;</span>: [[<span class="hljs-number">0.1</span>, <span class="hljs-number">0.2</span>]],
  <span class="hljs-string">&quot;anns_field&quot;</span>: <span class="hljs-string">&quot;book_intro&quot;</span>,
  <span class="hljs-string">&quot;param&quot;</span>: {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
  <span class="hljs-string">&quot;limit&quot;</span>: <span class="hljs-number">2</span>,
  <span class="hljs-string">&quot;expr&quot;</span>: <span class="hljs-string">&quot;book_name like \&quot;Hello%\&quot;&quot;</span>,
}
res = collection.<span class="hljs-title function_">search</span>(**search_param)
<button class="copy-code-btn"></button></code></pre>
<h2 id="String-expressions" class="common-anchor-header">Expressões de cadeia de caracteres<button data-href="#String-expressions" class="anchor-icon" translate="no">
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
    </button></h2><p>Para além do novo operador <code translate="no">like</code>, outros operadores, que já eram suportados em versões anteriores do Milvus, também podem ser utilizados para filtrar campos de cadeia de caracteres. Seguem-se alguns exemplos de <a href="https://milvus.io/docs/v2.1.x/boolean.md">expressões</a> de <a href="https://milvus.io/docs/v2.1.x/boolean.md">cadeia</a> normalmente utilizadas, em que <code translate="no">A</code> representa um campo do tipo VARCHAR. Lembre-se de que todas as expressões de cadeia de caracteres abaixo podem ser combinadas logicamente usando operadores lógicos, como AND, OR e NOT.</p>
<h3 id="Set-operations" class="common-anchor-header">Operações de conjunto</h3><p>Pode utilizar <code translate="no">in</code> e <code translate="no">not in</code> para efetuar operações de conjunto, como <code translate="no">A in [&quot;str1&quot;, &quot;str2&quot;]</code>.</p>
<h3 id="Compare-two-string-fields" class="common-anchor-header">Comparar dois campos de cadeia de caracteres</h3><p>Pode utilizar operadores relacionais para comparar os valores de dois campos de cadeia de caracteres. Estes operadores relacionais incluem <code translate="no">==</code>, <code translate="no">!=</code>, <code translate="no">&gt;</code>, <code translate="no">&gt;=</code>, <code translate="no">&lt;</code>, <code translate="no">&lt;=</code>. Para obter mais informações, consulte <a href="https://milvus.io/docs/v2.1.x/boolean.md#Relational-operators">Operadores relacionais</a>.</p>
<p>Note que os campos de cadeia de caracteres só podem ser comparados com outros campos de cadeia de caracteres em vez de campos de outros tipos de dados. Por exemplo, um campo do tipo VARCHAR não pode ser comparado com um campo do tipo Boolean ou do tipo integer.</p>
<h3 id="Compare-a-field-with-a-constant-value" class="common-anchor-header">Comparar um campo com um valor constante</h3><p>Você pode usar <code translate="no">==</code> ou <code translate="no">!=</code> para verificar se o valor de um campo é igual a um valor constante.</p>
<h3 id="Filter-fields-with-a-single-range" class="common-anchor-header">Filtrar campos com um único intervalo</h3><p>Pode utilizar <code translate="no">&gt;</code>, <code translate="no">&gt;=</code>, <code translate="no">&lt;</code>, <code translate="no">&lt;=</code> para filtrar campos de cadeia de caracteres com um único intervalo, como <code translate="no">A &gt; &quot;str1&quot;</code>.</p>
<h3 id="Prefix-matching" class="common-anchor-header">Correspondência de prefixos</h3><p>Como mencionado anteriormente, o Milvus 2.1 adiciona o operador <code translate="no">like</code> para correspondência de prefixo, como <code translate="no">A like &quot;prefix%&quot;</code>.</p>
<h2 id="Whats-next" class="common-anchor-header">O que vem a seguir<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Com o lançamento oficial do Milvus 2.1, preparámos uma série de blogues que apresentam as novas funcionalidades. Leia mais nesta série de blogues:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Como utilizar dados de cadeias de caracteres para potenciar as suas aplicações de pesquisa por semelhança</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Usando o Embedded Milvus para instalar e executar instantaneamente o Milvus com Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Aumente a taxa de transferência de leitura do seu banco de dados vetorial com réplicas na memória</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Entendendo o nível de consistência no banco de dados vetorial do Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Entendendo o nível de consistência no banco de dados vetorial do Milvus (Parte II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Como o banco de dados vetorial do Milvus garante a segurança dos dados?</a></li>
</ul>
