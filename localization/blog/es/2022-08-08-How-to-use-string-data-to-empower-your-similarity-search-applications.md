---
id: >-
  2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md
title: >-
  Cómo utilizar los datos de cadenas para potenciar sus aplicaciones de búsqueda
  por similitud
author: Xi Ge
date: 2022-08-08T00:00:00.000Z
desc: >-
  Utilice datos de cadenas para agilizar el proceso de creación de sus propias
  aplicaciones de búsqueda de similitudes.
cover: assets.zilliz.com/string_6129ce83e6.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/string_6129ce83e6.png" alt="Cover" class="doc-image" id="cover" />
   </span> <span class="img-wrapper"> <span>Portada</span> </span></p>
<p>Milvus 2.1 viene con <a href="https://milvus.io/blog/2022-08-05-whats-new-in-milvus-2-1.md">algunas actualizaciones significativas</a> que hacen que trabajar con Milvus sea mucho más fácil. Una de ellas es el soporte del tipo de datos cadena. Actualmente Milvus <a href="https://milvus.io/docs/v2.1.x/schema.md#Supported-data-type">soporta tipos de datos</a> que incluyen cadenas, vectores, booleanos, enteros, números de punto flotante y más.</p>
<p>Este artículo presenta una introducción al soporte del tipo de datos string. Lea y aprenda qué puede hacer con él y cómo utilizarlo.</p>
<p><strong>Ir a:</strong></p>
<ul>
<li><a href="#What-can-you-do-with-string-data">¿Qué se puede hacer con los datos de cadena?</a></li>
<li><a href="#How-to-manage-string-data-in-Milvus-21">¿Cómo gestionar datos de cadena en Milvus 2.1?</a><ul>
<li><a href="#Create-a-collection">Crear una colección</a></li>
<li><a href="#Insert-data">Insertar y eliminar datos</a></li>
<li><a href="#Build-an-index">Construir un índice</a></li>
<li><a href="#Hybrid-search">Búsqueda híbrida</a></li>
<li><a href="#String-expressions">Expresiones de cadenas</a></li>
</ul></li>
</ul>
<custom-h1>¿Qué se puede hacer con datos de tipo cadena?</custom-h1><p>El soporte del tipo de datos cadena ha sido una de las funciones más esperadas por los usuarios. Agiliza el proceso de creación de una aplicación con la base de datos vectorial Milvus y acelera la velocidad de búsqueda de similitudes y de consulta vectorial, aumentando en gran medida la eficiencia y reduciendo el coste de mantenimiento de cualquier aplicación en la que esté trabajando.</p>
<p>En concreto, Milvus 2.1 soporta el tipo de datos VARCHAR, que almacena cadenas de caracteres de longitud variable. Con el soporte del tipo de datos VARCHAR, usted puede:</p>
<ol>
<li>Gestionar directamente datos de cadenas sin la ayuda de una base de datos relacional externa.</li>
</ol>
<p>El soporte del tipo de datos VARCHAR le permite omitir el paso de convertir cadenas en otros tipos de datos al insertar datos en Milvus. Supongamos que está trabajando en un sistema de búsqueda de libros para su propia librería en línea. Está creando un conjunto de datos de libros y desea identificar los libros con sus nombres. Mientras que en versiones anteriores Milvus no soportaba el tipo de datos cadena, antes de insertar datos en MIilvus, puede que necesite transformar primero las cadenas (los nombres de los libros) en IDs de libros con la ayuda de una base de datos relacional como MySQL. En este momento, como se admite el tipo de datos de cadena, puede simplemente crear un campo de cadena e introducir directamente los nombres de los libros en lugar de sus números de identificación.</p>
<p>La comodidad se extiende también al proceso de búsqueda y consulta. Imagine que hay un cliente cuyo libro favorito es <em>Hello Milvus</em>. Usted quiere buscar en el sistema libros similares y recomendárselos al cliente. En versiones anteriores de Milvus, el sistema sólo le devolverá los ID de los libros y tendrá que dar un paso más para comprobar la información del libro correspondiente en una base de datos relacional. Pero en Milvus 2.1, puede obtener directamente los nombres de los libros porque ya ha creado un campo de cadena con los nombres de los libros.</p>
<p>En una palabra, el soporte del tipo de datos cadena le ahorra el esfuerzo de recurrir a otras herramientas para gestionar datos cadena, lo que simplifica enormemente el proceso de desarrollo.</p>
<ol start="2">
<li>Acelere la velocidad de la <a href="https://milvus.io/docs/v2.1.x/hybridsearch.md">búsqueda híbrida</a> y la <a href="https://milvus.io/docs/v2.1.x/query.md">consulta vectorial</a> mediante el filtrado de atributos.</li>
</ol>
<p>Al igual que otros tipos de datos escalares, VARCHAR puede utilizarse para el filtrado de atributos en la búsqueda híbrida y la consulta vectorial mediante expresiones booleanas. Merece la pena mencionar que Milvus 2.1 añade el operador <code translate="no">like</code>, que le permite realizar correspondencias de prefijos. También puede realizar correspondencias exactas utilizando el operador <code translate="no">==</code>.</p>
<p>Además, se admite un índice invertido basado en MARISA-trie para acelerar la búsqueda y la consulta híbridas. Continúe leyendo y descubra todas las expresiones de cadena que puede desear conocer para realizar el filtrado de atributos con datos de cadena.</p>
<custom-h1>¿Cómo gestionar datos de cadena en Milvus 2.1?</custom-h1><p>Ahora sabemos que el tipo de datos string es extremadamente útil, pero ¿cuándo necesitamos exactamente utilizar este tipo de datos para crear nuestras propias aplicaciones? A continuación, verá algunos ejemplos de código de escenarios que pueden implicar datos de cadena, lo que le dará una mejor comprensión de cómo gestionar datos VARCHAR en Milvus 2.1.</p>
<h2 id="Create-a-collection" class="common-anchor-header">Crear una colección<button data-href="#Create-a-collection" class="anchor-icon" translate="no">
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
    </button></h2><p>Sigamos con el ejemplo anterior. Sigue trabajando en el sistema de recomendación de libros y desea crear una colección de libros con un campo de clave primaria llamado <code translate="no">book_name</code>, en el que insertará datos de cadena. En este caso, puede establecer el tipo de datos como <code translate="no">DataType.VARCHAR</code>al configurar el esquema del campo, como se muestra en el ejemplo siguiente.</p>
<p>Tenga en cuenta que al crear un campo VARCHAR, es necesario especificar la longitud máxima de caracteres mediante el parámetro <code translate="no">max_length</code> cuyo valor puede oscilar entre 1 y 65.535.  En este ejemplo, fijamos la longitud máxima en 200.</p>
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
<h2 id="Insert-data" class="common-anchor-header">Insertar datos<button data-href="#Insert-data" class="anchor-icon" translate="no">
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
    </button></h2><p>Ahora que la colección está creada, podemos insertar datos en ella. En el siguiente ejemplo, insertamos 2.000 filas de datos de cadena generados aleatoriamente.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">import</span> random
data = [
  [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
  [<span class="hljs-string">&quot;book_&quot;</span> + <span class="hljs-built_in">str</span>(i) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
  [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">10000</span>, <span class="hljs-number">12000</span>)],
  [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Delete-data" class="common-anchor-header">Borrar datos<button data-href="#Delete-data" class="anchor-icon" translate="no">
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
    </button></h2><p>Suponga que dos libros, llamados <code translate="no">book_0</code> y <code translate="no">book_1</code>, ya no están disponibles en su tienda, por lo que desea eliminar la información relevante de su base de datos. En este caso, puede utilizar la expresión de términos <code translate="no">in</code> para filtrar las entidades a eliminar, como se muestra en el siguiente ejemplo.</p>
<p>Recuerde que Milvus sólo admite la eliminación de entidades con claves primarias claramente especificadas, por lo que antes de ejecutar el código siguiente, asegúrese de que ha establecido el campo <code translate="no">book_name</code> como campo de clave primaria.</p>
<pre><code translate="no" class="language-Python">expr = <span class="hljs-string">&quot;book_name in [\&quot;book_0\&quot;, \&quot;book_1\&quot;]&quot;</span> 
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collection</span>
collection = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&quot;book&quot;</span>)     
collection.<span class="hljs-title function_">delete</span>(expr)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Build-an-Index" class="common-anchor-header">Construir un índice<button data-href="#Build-an-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 soporta la construcción de índices escalares, lo que acelerará enormemente el filtrado de campos de cadena. A diferencia de la construcción de un índice vectorial, no tiene que preparar parámetros antes de construir un índice escalar. Milvus sólo admite temporalmente el índice de árbol de diccionario (MARISA-trie), por lo que el tipo de índice del campo de tipo VARCHAR es MARISA-trie por defecto.</p>
<p>Puede especificar el nombre del índice al construirlo. Si no se especifica, el valor por defecto de <code translate="no">index_name</code> es <code translate="no">&quot;_default_idx_&quot;</code>. En el ejemplo siguiente, hemos llamado al índice <code translate="no">scalar_index</code>.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collection</span>
collection = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&quot;book&quot;</span>)   
collection.<span class="hljs-title function_">create_index</span>(
  field_name=<span class="hljs-string">&quot;book_name&quot;</span>, 
  index_name=<span class="hljs-string">&quot;scalar_index&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Hybrid-search" class="common-anchor-header">Búsqueda híbrida<button data-href="#Hybrid-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Especificando expresiones booleanas, puede filtrar los campos de cadena durante una búsqueda de similitud vectorial.</p>
<p>Por ejemplo, si busca los libros cuya introducción es más parecida a Hola Milvus pero sólo desea obtener los libros cuyos nombres empiezan por "libro_2", puede utilizar el operador <code translate="no">like</code>para realizar una coincidencia de prefijos y obtener los libros buscados, como se muestra en el ejemplo siguiente.</p>
<pre><code translate="no" class="language-Python">search_param = {
  <span class="hljs-string">&quot;data&quot;</span>: [[<span class="hljs-number">0.1</span>, <span class="hljs-number">0.2</span>]],
  <span class="hljs-string">&quot;anns_field&quot;</span>: <span class="hljs-string">&quot;book_intro&quot;</span>,
  <span class="hljs-string">&quot;param&quot;</span>: {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
  <span class="hljs-string">&quot;limit&quot;</span>: <span class="hljs-number">2</span>,
  <span class="hljs-string">&quot;expr&quot;</span>: <span class="hljs-string">&quot;book_name like \&quot;Hello%\&quot;&quot;</span>,
}
res = collection.<span class="hljs-title function_">search</span>(**search_param)
<button class="copy-code-btn"></button></code></pre>
<h2 id="String-expressions" class="common-anchor-header">Expresiones de cadena<button data-href="#String-expressions" class="anchor-icon" translate="no">
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
    </button></h2><p>Aparte del nuevo operador <code translate="no">like</code>, también pueden utilizarse otros operadores, que ya se admitían en versiones anteriores de Milvus, para filtrar campos de cadena. A continuación se muestran algunos ejemplos de <a href="https://milvus.io/docs/v2.1.x/boolean.md">expresiones de cadena de</a> uso común, donde <code translate="no">A</code> representa un campo de tipo VARCHAR. Recuerde que todas las expresiones de cadena que aparecen a continuación pueden combinarse lógicamente utilizando operadores lógicos, como AND, OR y NOT.</p>
<h3 id="Set-operations" class="common-anchor-header">Operaciones de conjunto</h3><p>Puede utilizar <code translate="no">in</code> y <code translate="no">not in</code> para realizar operaciones de conjunto, como <code translate="no">A in [&quot;str1&quot;, &quot;str2&quot;]</code>.</p>
<h3 id="Compare-two-string-fields" class="common-anchor-header">Comparación de dos campos de cadena</h3><p>Puede utilizar operadores relacionales para comparar los valores de dos campos de cadena. Dichos operadores relacionales incluyen <code translate="no">==</code>, <code translate="no">!=</code>, <code translate="no">&gt;</code>, <code translate="no">&gt;=</code>, <code translate="no">&lt;</code>, <code translate="no">&lt;=</code>. Para obtener más información, consulte <a href="https://milvus.io/docs/v2.1.x/boolean.md#Relational-operators">Operadores relacionales</a>.</p>
<p>Tenga en cuenta que los campos de cadena sólo pueden compararse con otros campos de cadena y no con campos de otros tipos de datos. Por ejemplo, un campo de tipo VARCHAR no puede compararse con un campo de tipo booleano o de tipo entero.</p>
<h3 id="Compare-a-field-with-a-constant-value" class="common-anchor-header">Comparar un campo con un valor constante</h3><p>Puede utilizar <code translate="no">==</code> o <code translate="no">!=</code> para comprobar si el valor de un campo es igual a un valor constante.</p>
<h3 id="Filter-fields-with-a-single-range" class="common-anchor-header">Filtrar campos con un único rango</h3><p>Puede utilizar <code translate="no">&gt;</code>, <code translate="no">&gt;=</code>, <code translate="no">&lt;</code>, <code translate="no">&lt;=</code> para filtrar campos de cadena con un único rango, como <code translate="no">A &gt; &quot;str1&quot;</code>.</p>
<h3 id="Prefix-matching" class="common-anchor-header">Coincidencia de prefijos</h3><p>Como ya se ha mencionado, Milvus 2.1 añade el operador <code translate="no">like</code> para la concordancia de prefijos, como <code translate="no">A like &quot;prefix%&quot;</code>.</p>
<h2 id="Whats-next" class="common-anchor-header">Próximos pasos<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Con el lanzamiento oficial de Milvus 2.1, hemos preparado una serie de blogs presentando las nuevas características. Lea más en esta serie de blogs:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Cómo utilizar datos de cadenas para potenciar sus aplicaciones de búsqueda por similitud</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Uso de Milvus integrado para instalar y ejecutar Milvus con Python de forma instantánea</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Aumente el rendimiento de lectura de su base de datos vectorial con réplicas en memoria</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Comprender el nivel de consistencia en la base de datos vectorial Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Comprender el nivel de consistencia en la base de datos vectorial de Milvus (Parte II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">¿Cómo Garantiza la Seguridad de los Datos la Base de Datos Vectorial de Milvus?</a></li>
</ul>
