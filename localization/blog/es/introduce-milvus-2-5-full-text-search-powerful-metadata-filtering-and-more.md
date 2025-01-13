---
id: introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md
title: >-
  Presentamos Milvus 2.5: búsqueda de texto completo, filtrado de metadatos más
  potente y mejoras en la usabilidad.
author: 'Ken Zhang, Stefan Webb, Jiang Chen'
date: 2024-12-17T00:00:00.000Z
cover: assets.zilliz.com/Introducing_Milvus_2_5_e4968e1cdb.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md
---
<h2 id="Overview" class="common-anchor-header">Resumen<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Estamos encantados de presentar la última versión de Milvus, 2.5, que introduce una nueva y potente capacidad: la búsqueda de <a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">texto completo</a>, también conocida como búsqueda léxica o por palabras clave. Si no está familiarizado con la búsqueda, la búsqueda de texto completo le permite encontrar documentos buscando palabras o frases específicas dentro de ellos, de forma similar a como se busca en Google. Esto complementa nuestras capacidades de búsqueda semántica, que entienden el significado de la búsqueda en lugar de buscar sólo palabras exactas.</p>
<p>Utilizamos la métrica estándar BM25 para la similitud entre documentos, y nuestra implementación se basa en vectores dispersos, lo que permite un almacenamiento y una recuperación más eficientes. Para quienes no estén familiarizados con el término, los vectores dispersos son una forma de representar texto en la que la mayoría de los valores son cero, lo que los hace muy eficientes a la hora de almacenarlos y procesarlos: imagínese una enorme hoja de cálculo en la que sólo unas pocas celdas contienen números y el resto están vacías. Este enfoque encaja bien en la filosofía de producto de Milvus, en la que el vector es la entidad de búsqueda principal.</p>
<p>Un aspecto adicional digno de mención de nuestra implementación es la capacidad de insertar y consultar texto <em>directamente</em> en lugar de tener que convertir manualmente el texto en vectores dispersos. Milvus da así un paso más hacia el procesamiento completo de datos no estructurados.</p>
<p>Pero esto es sólo el principio. Con el lanzamiento de la versión 2.5, hemos actualizado la <a href="https://milvus.io/docs/roadmap.md">hoja de ruta del producto Milvus</a>. En futuras iteraciones de Milvus, nos centraremos en desarrollar las capacidades de Milvus en cuatro direcciones clave:</p>
<ul>
<li>Procesamiento racionalizado de datos no estructurados;</li>
<li>Mejor calidad y eficacia de la búsqueda;</li>
<li>Facilitar la gestión de datos;</li>
<li>Reducción de costes mediante avances algorítmicos y de diseño</li>
</ul>
<p>Nuestro objetivo es construir una infraestructura de datos que pueda almacenar y recuperar información de forma eficiente en la era de la IA.</p>
<h2 id="Full-text-Search-via-Sparse-BM25" class="common-anchor-header">Búsqueda de texto completo mediante Sparse-BM25<button data-href="#Full-text-Search-via-Sparse-BM25" class="anchor-icon" translate="no">
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
    </button></h2><p>Aunque la búsqueda semántica suele tener mejor conocimiento del contexto y comprensión de la intención, cuando un usuario necesita buscar nombres propios específicos, números de serie o una frase que coincida completamente, la recuperación de texto completo con concordancia de palabras clave suele producir resultados más precisos.</p>
<p>Para ilustrar esto con un ejemplo:</p>
<ul>
<li>La búsqueda semántica es mejor cuando se pregunta: "Buscar documentos sobre soluciones de energías renovables".</li>
<li>La búsqueda de texto completo es mejor cuando necesitas: &quot;Encontrar documentos que mencionen <em>el Tesla Model 3 2024</em>&quot;</li>
</ul>
<p>En nuestra versión anterior (Milvus 2.4), los usuarios tenían que preprocesar su texto utilizando una herramienta separada (el módulo BM25EmbeddingFunction de PyMilvus) en sus propias máquinas antes de poder buscarlo. Este enfoque tenía varias limitaciones: no podía manejar bien conjuntos de datos crecientes, requería pasos de configuración adicionales y hacía que todo el proceso fuera más complicado de lo necesario. Para los técnicos, las principales limitaciones eran que sólo podía funcionar en una única máquina; el vocabulario y otras estadísticas del corpus utilizadas para la puntuación BM25 no podían actualizarse a medida que cambiaba el corpus; y la conversión de texto a vectores en el lado del cliente es menos intuitiva si se trabaja directamente con texto.</p>
<p>Milvus 2.5 lo simplifica todo. Ahora puede trabajar con su texto directamente:</p>
<ul>
<li>Almacenar sus documentos de texto originales tal cual</li>
<li>Realice búsquedas mediante consultas en lenguaje natural</li>
<li>Obtenga los resultados en formato legible</li>
</ul>
<p>Entre bastidores, Milvus se encarga automáticamente de todas las conversiones vectoriales complejas, lo que facilita el trabajo con datos de texto. Esto es lo que llamamos nuestro enfoque "Doc in, Doc out": usted trabaja con texto legible y nosotros nos encargamos del resto.</p>
<h3 id="Techical-Implementation" class="common-anchor-header">Implementación técnica</h3><p>Para aquellos interesados en los detalles técnicos, Milvus 2.5 añade la capacidad de búsqueda de texto completo a través de su implementación Sparse-BM25 incorporada, que incluye:</p>
<ul>
<li><strong>Un Tokenizer construido sobre tantivy</strong>: Milvus se integra ahora con el próspero ecosistema tantivy</li>
<li><strong>Capacidad de ingesta y recuperación de documentos en bruto</strong>: Soporte para la ingesta directa y la consulta de datos de texto</li>
<li><strong>Puntuación de relevancia BM25</strong>: Internalización de la puntuación BM25, basada en vectores dispersos.</li>
</ul>
<p>Decidimos trabajar con el ecosistema tantivy bien desarrollado y construir el tokenizador de texto Milvus sobre tantivy. En el futuro, Milvus soportará más tokenizadores y expondrá el proceso de tokenización para ayudar a los usuarios a comprender mejor la calidad de la recuperación. También exploraremos tokenizadores basados en aprendizaje profundo y estrategias stemmer para optimizar aún más el rendimiento de la búsqueda de texto completo. A continuación se muestra un ejemplo de código para utilizar y configurar el tokenizador:</p>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Tokenizer configuration</span>
schema.add_field(
    field_name=<span class="hljs-string">&#x27;text&#x27;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">65535</span>,
    enable_analyzer=<span class="hljs-literal">True</span>, <span class="hljs-comment"># Enable tokenizer on this column</span>
    analyzer_params={<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>},  <span class="hljs-comment"># Configure tokenizer parameters, here we choose the english template, fine-grained configuration is also supported</span>
    enable_match=<span class="hljs-literal">True</span>, <span class="hljs-comment"># Build an inverted index for Text_Match</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Tras configurar el tokenizador en el esquema de la colección, los usuarios pueden registrar el texto en la función bm25 mediante el método add_function. Esto se ejecutará internamente en el servidor Milvus. Todos los flujos de datos posteriores, como adiciones, eliminaciones, modificaciones y consultas, pueden completarse operando sobre la cadena de texto sin procesar, en contraposición a la representación vectorial. Véase a continuación un ejemplo de código sobre cómo ingerir texto y realizar búsquedas de texto completo con la nueva API:</p>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Define the mapping relationship between raw text data and vectors on the schema</span>
bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25_emb&quot;</span>,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>], <span class="hljs-comment"># Input text field</span>
    output_field_names=[<span class="hljs-string">&quot;sparse&quot;</span>], <span class="hljs-comment"># Internal mapping sparse vector field</span>
    function_type=FunctionType.BM25, <span class="hljs-comment"># Model for processing mapping relationship</span>
)

schema.add_function(bm25_function)
...
<span class="hljs-comment"># Support for raw text in/out</span>
MilvusClient.insert(<span class="hljs-string">&#x27;demo&#x27;</span>, [
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Artificial intelligence was founded as an academic discipline in 1956.&#x27;</span>},
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;</span>},
    {<span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;Born in Maida Vale, London, Turing was raised in southern England.&#x27;</span>},
])

MilvusClient.search(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>,
    data=[<span class="hljs-string">&#x27;Who started AI research?&#x27;</span>],
    anns_field=<span class="hljs-string">&#x27;sparse&#x27;</span>,
    limit=<span class="hljs-number">3</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Hemos adoptado una implementación de la puntuación de relevancia BM25 que representa las consultas y los documentos como vectores dispersos, denominada <strong>Sparse-BM25</strong>. Esto desbloquea muchas optimizaciones basadas en vectores dispersos, tales como:</p>
<p>Milvus consigue capacidades de búsqueda híbrida a través de su vanguardista <strong>implementación Sparse-BM25</strong>, que integra la búsqueda de texto completo en la arquitectura de la base de datos vectorial. Al representar las frecuencias de términos como vectores dispersos en lugar de índices invertidos tradicionales, Sparse-BM25 permite optimizaciones avanzadas, como <strong>la indexación de grafos</strong>, la <strong>cuantización de productos (PQ)</strong> y <strong>la cuantización escalar (SQ)</strong>. Estas optimizaciones minimizan el uso de memoria y aceleran el rendimiento de la búsqueda. Al igual que el enfoque de índice invertido, Milvus admite la entrada de texto sin formato y la generación interna de vectores dispersos. Esto le permite trabajar con cualquier tokenizador y captar cualquier palabra que aparezca en el corpus que cambia dinámicamente.</p>
<p>Además, la poda heurística descarta los vectores dispersos de bajo valor, lo que mejora aún más la eficiencia sin comprometer la precisión. A diferencia de los enfoques anteriores que utilizan vectores dispersos, éste puede adaptarse a un corpus en crecimiento, y no a la precisión de la puntuación BM25.</p>
<ol>
<li>Creación de índices de grafos en el vector disperso, que funciona mejor que el índice invertido en consultas con texto largo, ya que el índice invertido necesita más pasos para terminar de emparejar los tokens de la consulta;</li>
<li>Aprovechamiento de técnicas de aproximación para acelerar la búsqueda con un impacto mínimo en la calidad de la recuperación, como la cuantificación vectorial y la poda heurística;</li>
<li>Unificar la interfaz y el modelo de datos para realizar búsquedas semánticas y de texto completo, mejorando así la experiencia del usuario.</li>
</ol>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Creating an index on the sparse column</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,  <span class="hljs-comment"># Default WAND index</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span> <span class="hljs-comment"># Configure relevance scoring through metric_type</span>
)

<span class="hljs-comment"># Configurable parameters at search time to speed up search</span>
search_params = {
    <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;drop_ratio_search&#x27;</span>: <span class="hljs-number">0.6</span>}, <span class="hljs-comment"># WAND search parameter configuration can speed up search</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>En resumen, Milvus 2.5 ha ampliado su capacidad de búsqueda más allá de la búsqueda semántica introduciendo la recuperación de texto completo, lo que facilita a los usuarios la creación de aplicaciones de IA de alta calidad. Éstos son sólo los pasos iniciales en el espacio de la búsqueda Sparse-BM25 y prevemos que habrá más medidas de optimización que probar en el futuro.</p>
<h2 id="Text-Matching-Search-Filters" class="common-anchor-header">Filtros de búsqueda de coincidencias de texto<button data-href="#Text-Matching-Search-Filters" class="anchor-icon" translate="no">
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
    </button></h2><p>Una segunda función de búsqueda de texto lanzada con Milvus 2.5 es <strong>Text Match</strong>, que permite al usuario filtrar la búsqueda a entradas que contengan una cadena de texto específica. Esta función también se basa en la tokenización y se activa con <code translate="no">enable_match=True</code>.</p>
<p>Cabe señalar que con Text Match, el tratamiento del texto de la consulta se basa en la lógica de OR tras la tokenización. Por ejemplo, en el ejemplo siguiente, el resultado devolverá todos los documentos (utilizando el campo "texto") que contengan "vector" o "base de datos".</p>
<pre><code translate="no" class="language-Python"><span class="hljs-built_in">filter</span> = <span class="hljs-string">&quot;TEXT_MATCH(text, &#x27;vector database&#x27;)&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Si su escenario requiere que coincidan tanto 'vector' como 'base de datos', entonces necesitará escribir dos Coincidencias de Texto separadas y superponerlas con AND para lograr su objetivo.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-built_in">filter</span> = <span class="hljs-string">&quot;TEXT_MATCH(text, &#x27;vector&#x27;) and TEXT_MATCH(text, &#x27;database&#x27;)&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Significant-Enhancement-in-Scalar-Filtering-Performance" class="common-anchor-header">Mejora significativa del rendimiento del filtrado escalar<button data-href="#Significant-Enhancement-in-Scalar-Filtering-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Nuestro énfasis en el rendimiento del filtrado escalar tiene su origen en nuestro descubrimiento de que la combinación de la recuperación vectorial y el filtrado de metadatos puede mejorar enormemente el rendimiento y la precisión de las consultas en diversos escenarios. Estos escenarios van desde aplicaciones de búsqueda de imágenes, como la identificación de esquinas en la conducción autónoma, hasta escenarios RAG complejos en bases de conocimiento empresariales. Por lo tanto, es muy adecuado para que los usuarios empresariales lo implementen en escenarios de aplicación de datos a gran escala.</p>
<p>En la práctica, muchos factores, como la cantidad de datos que se están filtrando, la organización de los datos y el modo de búsqueda, pueden afectar al rendimiento. Para solucionar esto, Milvus 2.5 introduce tres nuevos tipos de índices: Índice BitMap, Índice invertido de matriz e Índice invertido después de tokenizar el campo de texto Varchar. Estos nuevos índices pueden mejorar significativamente el rendimiento en casos de uso del mundo real.</p>
<p>En concreto:</p>
<ol>
<li><strong>BitMap Index</strong> se puede utilizar para acelerar el filtrado de etiquetas (operadores comunes incluyen in, array_contains, etc.), y es adecuado para escenarios con menos datos de categoría de campo (cardinalidad de datos). El principio es determinar si una fila de datos tiene un determinado valor en una columna, con 1 para sí y 0 para no, y luego mantener una lista BitMap. El siguiente gráfico muestra la comparación de pruebas de rendimiento que realizamos basándonos en el escenario de negocio de un cliente. En este escenario, el volumen de datos es de 500 millones, la categoría de datos es 20, diferentes valores tienen diferentes proporciones de distribución (1%, 5%, 10%, 50%), y el rendimiento bajo diferentes cantidades de filtrado también varía. Con un filtrado del 50%, podemos conseguir una ganancia de rendimiento de 6,8 veces mediante BitMap Index. Cabe destacar que a medida que aumenta la cardinalidad, en comparación con el índice BitMap, el índice invertido mostrará un rendimiento más equilibrado.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/QPS_comparison_f3f580d697.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li><strong>Text Match</strong> se basa en el índice invertido después de tokenizar el campo de texto. Su rendimiento supera con creces la función Wildcard Match (es decir, like + %) que proporcionamos en 2.4. De acuerdo con los resultados de nuestras pruebas internas, las ventajas de Text Match son muy claras, especialmente en escenarios de consultas concurrentes, en los que puede lograr un aumento de hasta 400 veces el QPS.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_size_and_concurrency_e19dc44c59.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>En cuanto al procesamiento de datos JSON, tenemos previsto introducir en versiones posteriores de 2.5.x la construcción de índices invertidos para claves especificadas por el usuario y el registro de información de ubicación por defecto para todas las claves con el fin de acelerar el análisis sintáctico. Esperamos que ambos aspectos mejoren significativamente el rendimiento de las consultas de JSON y Dynamic Field. Tenemos previsto mostrar más información en futuras notas de la versión y blogs técnicos, así que permanezca atento.</p>
<h2 id="New-Management-Interface" class="common-anchor-header">Nueva interfaz de gestión<button data-href="#New-Management-Interface" class="anchor-icon" translate="no">
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
    </button></h2><p>Gestionar una base de datos no debería requerir una licenciatura en informática, pero sabemos que los administradores de bases de datos necesitan herramientas potentes. Por eso hemos introducido la <strong>WebUI de gestión</strong> de clústeres, una nueva interfaz basada en web accesible en la dirección de su clúster en el puerto 9091/webui. Esta herramienta de observabilidad proporciona:</p>
<ul>
<li>Paneles de supervisión en tiempo real que muestran métricas de todo el clúster</li>
<li>Análisis detallados de memoria y rendimiento por nodo</li>
<li>Información de segmentos y seguimiento de consultas lentas</li>
<li>Indicadores de salud del sistema y estado de los nodos</li>
<li>Herramientas fáciles de usar para solucionar problemas complejos del sistema</li>
</ul>
<p>Aunque esta interfaz aún está en fase beta, la estamos desarrollando activamente basándonos en los comentarios de los usuarios administradores de bases de datos. Las futuras actualizaciones incluirán diagnósticos asistidos por IA, funciones de gestión más interactivas y capacidades mejoradas de observación de clústeres.</p>
<h2 id="Documentation-and-Developer-Experience" class="common-anchor-header">Documentación y experiencia del desarrollador<button data-href="#Documentation-and-Developer-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p>Hemos renovado completamente nuestra <strong>documentación</strong> y experiencia <strong>SDK/API</strong> para hacer Milvus más accesible, manteniendo la profundidad para los usuarios experimentados. Las mejoras incluyen:</p>
<ul>
<li>Un sistema de documentación reestructurado con una progresión más clara de los conceptos básicos a los avanzados.</li>
<li>Tutoriales interactivos y ejemplos reales que muestran implementaciones prácticas</li>
<li>Referencias completas de la API con ejemplos prácticos de código</li>
<li>Un diseño del SDK más fácil de usar que simplifica las operaciones comunes</li>
<li>Guías ilustradas que facilitan la comprensión de conceptos complejos.</li>
<li>Un asistente de documentación basado en inteligencia artificial (ASK AI) para obtener respuestas rápidas.</li>
</ul>
<p>El SDK/API actualizado se centra en mejorar la experiencia de los desarrolladores a través de interfaces más intuitivas y una mejor integración con la documentación. Creemos que notará estas mejoras cuando trabaje con la serie 2.5.x.</p>
<p>Sin embargo, sabemos que el desarrollo de la documentación y el SDK es un proceso continuo. Seguiremos optimizando tanto la estructura del contenido como el diseño del SDK basándonos en los comentarios de la comunidad. Únete a nuestro canal de Discord para compartir tus sugerencias y ayudarnos a seguir mejorando.</p>
<h2 id="Summary" class="common-anchor-header"><strong>Resumen</strong><button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.5 contiene 13 nuevas características y varias optimizaciones a nivel de sistema, aportadas no sólo por Zilliz sino por la comunidad de código abierto. Sólo hemos tocado algunas de ellas en este post y le animamos a visitar nuestra <a href="https://milvus.io/docs/release_notes.md">nota de lanzamiento</a> y <a href="https://milvus.io/docs">los documentos oficiales</a> para obtener más información.</p>
