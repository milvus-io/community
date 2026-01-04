---
id: >-
  phrase-match-with-slop-in-milvus-2-6-how-to-improve-phrase-level-full-text-search-accuracy.md
title: >-
  Concordancia de frases con Slop en Milvus 2.6: Cómo mejorar la precisión de la
  búsqueda de texto completo a nivel de frase
author: Alex Zhang
date: 2025-12-29T00:00:00.000Z
cover: assets.zilliz.com/Phrase_Match_Cover_93a84b0587.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 2.6, Phrase Match, full-text search, keyword matching, vector search'
meta_title: |
  Phrase Match with Slop: Better Full-Text Search Accuracy in Milvus
desc: >-
  Descubra cómo Phrase Match en Milvus 2.6 admite la búsqueda de texto completo
  a nivel de frase con slop, lo que permite un filtrado de palabras clave más
  tolerante para la producción en el mundo real.
origin: >-
  https://milvus.io/blog/phrase-match-with-slop-in-milvus-2-6-how-to-improve-phrase-level-full-text-search-accuracy.md
---
<p>A medida que los datos no estructurados siguen explotando y los modelos de IA se hacen cada vez más inteligentes, la búsqueda vectorial se ha convertido en la capa de recuperación por defecto de muchos sistemas de IA: canalizaciones RAG, búsqueda de IA, agentes, motores de recomendación, etcétera. Funciona porque capta el significado: no sólo las palabras que escriben los usuarios, sino la intención que hay detrás de ellas.</p>
<p>Sin embargo, una vez que estas aplicaciones entran en producción, los equipos suelen descubrir que la comprensión semántica es sólo una parte del problema de la recuperación. Muchas cargas de trabajo también dependen de reglas textuales estrictas, como la coincidencia de terminología exacta, la conservación del orden de las palabras o la identificación de frases con significado técnico, legal u operativo.</p>
<p><a href="https://milvus.io/docs/release_notes.md#v267">Milvus 2.6</a> elimina esa división introduciendo la búsqueda nativa de texto completo directamente en la base de datos vectorial. Gracias a los índices posicionales y de tokens integrados en el motor central, Milvus puede interpretar la intención semántica de una consulta al tiempo que aplica restricciones precisas a nivel de palabras clave y frases. El resultado es un proceso de recuperación unificado en el que el significado y la estructura se refuerzan mutuamente en lugar de vivir en sistemas separados.</p>
<p><a href="https://milvus.io/docs/phrase-match.md">La concordancia de frases</a> es un elemento clave de esta capacidad de texto completo. Identifica secuencias de términos que aparecen juntos y en orden, algo crucial para detectar patrones de registro, firmas de error, nombres de productos y cualquier texto en el que el orden de las palabras defina el significado. En este artículo, explicaremos cómo funciona <a href="https://milvus.io/docs/phrase-match.md">Phrase Match</a> en <a href="https://milvus.io/">Milvus</a>, cómo <code translate="no">slop</code> añade la flexibilidad necesaria para el texto del mundo real y por qué estas características hacen que la búsqueda híbrida de vector-texto completo no sólo sea posible sino práctica dentro de una única base de datos.</p>
<h2 id="What-is-Phrase-Match" class="common-anchor-header">¿Qué es Phrase Match?<button data-href="#What-is-Phrase-Match" class="anchor-icon" translate="no">
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
    </button></h2><p>La concordancia de frases es un tipo de consulta de texto completo en Milvus que se centra en la <em>estructura -específicamente</em>, si una secuencia de palabras aparece en el mismo orden dentro de un documento. Cuando no se permite ninguna flexibilidad, la consulta se comporta de forma estricta: los términos deben aparecer uno al lado del otro y en secuencia. Por tanto, una consulta como <strong>"robótica aprendizaje automático"</strong> sólo coincide cuando esas tres palabras aparecen como una frase continua.</p>
<p>El problema es que el texto real rara vez se comporta de esta manera. El lenguaje natural introduce ruido: se cuelan adjetivos adicionales, los registros reordenan los campos, los nombres de los productos ganan modificadores y los autores humanos no escriben pensando en los motores de consulta. Una concordancia de frase estricta se rompe con facilidad: una palabra insertada, una reformulación o un término intercambiado pueden provocar un fallo. Y en muchos sistemas de inteligencia artificial, especialmente en los de producción, no es aceptable omitir una línea de registro relevante o una frase que desencadene una regla.</p>
<p>Milvus 2.6 aborda esta fricción con un mecanismo sencillo: el <strong>margen de error</strong>. La holgura define <em>el margen de maniobra permitido entre</em> los términos de <em>la consulta</em>. En lugar de tratar una frase como frágil e inflexible, el margen de maniobra le permite decidir si una palabra extra es tolerable, o dos, o incluso si una ligera reordenación debe seguir contando como coincidencia. De este modo, la búsqueda de frases deja de ser una prueba binaria de aprobado-desaprobado para convertirse en una herramienta de recuperación controlada y ajustable.</p>
<p>Para ver por qué esto es importante, imagine que busca en los registros todas las variantes del conocido error de red <strong>"conexión restablecida por el par".</strong> En la práctica, sus registros podrían tener este aspecto:</p>
<pre><code translate="no">connection reset <span class="hljs-keyword">by</span> peer
connection fast reset <span class="hljs-keyword">by</span> peer
connection was suddenly reset <span class="hljs-keyword">by</span> the peer
peer reset connection <span class="hljs-keyword">by</span> ...
peer unexpected connection reset happened
<button class="copy-code-btn"></button></code></pre>
<p>A primera vista, todos ellos representan el mismo evento subyacente. Pero los métodos comunes de recuperación tienen dificultades:</p>
<h3 id="BM25-struggles-with-structure" class="common-anchor-header">BM25 tiene problemas con la estructura.</h3><p>Considera la consulta como un conjunto de palabras clave, ignorando el orden en que aparecen. Siempre que "conexión" y "homólogo" aparezcan en algún lugar, BM25 puede clasificar el documento en un puesto alto, incluso si la frase es inversa o no está relacionada con el concepto que se está buscando.</p>
<h3 id="Vector-search-struggles-with-constraints" class="common-anchor-header">La búsqueda vectorial tiene dificultades con las restricciones.</h3><p>Las incrustaciones son excelentes para captar el significado y las relaciones semánticas, pero no pueden imponer una regla del tipo "estas palabras deben aparecer en esta secuencia". Es posible que recupere mensajes relacionados semánticamente, pero siga sin encontrar el patrón estructural exacto necesario para la depuración o el cumplimiento de normas.</p>
<p>La concordancia de frases llena el vacío existente entre estos dos enfoques. Mediante el uso de <strong>slop</strong>, puede especificar exactamente cuánta variación es aceptable:</p>
<ul>
<li><p><code translate="no">slop = 0</code> - Coincidencia exacta (Todos los términos deben aparecer contiguos y en orden.)</p></li>
<li><p><code translate="no">slop = 1</code> - Permitir una palabra extra (Cubre variaciones comunes del lenguaje natural con un solo término insertado).</p></li>
<li><p><code translate="no">slop = 2</code> - Permitir varias palabras insertadas (permite expresiones más descriptivas o verbales).</p></li>
<li><p><code translate="no">slop = 3</code> - Permitir reordenación (admite frases invertidas o poco ordenadas, a menudo el caso más difícil en el texto del mundo real).</p></li>
</ul>
<p>En lugar de esperar que el algoritmo de puntuación "acierte", usted declara explícitamente la tolerancia estructural que requiere su aplicación.</p>
<h2 id="How-Phrase-Match-Works-in-Milvus" class="common-anchor-header">Cómo funciona la concordancia de frases en Milvus<button data-href="#How-Phrase-Match-Works-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Desarrollado por la biblioteca del motor de búsqueda <a href="https://github.com/quickwit-oss/tantivy">Tantivy</a>, Phrase Match en Milvus se implementa sobre un índice invertido con información posicional. En lugar de comprobar únicamente si los términos aparecen en un documento, verifica que aparezcan en el orden correcto y dentro de una distancia controlable.</p>
<p>El diagrama siguiente ilustra el proceso:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/phrase_match_workflow_a4f3badb66.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>1. Tokenización de documentos (con posiciones)</strong></p>
<p>Cuando se insertan documentos en Milvus, los campos de texto son procesados por un <a href="https://milvus.io/docs/analyzer-overview.md">analizador</a>, que divide el texto en tokens (palabras o términos) y registra la posición de cada token dentro del documento. Por ejemplo, <code translate="no">doc_1</code> se divide en tokens como: <code translate="no">machine (pos=0), learning (pos=1), boosts (pos=2), efficiency (pos=3)</code>.</p>
<p><strong>2. Creación de índices invertidos</strong></p>
<p>A continuación, Milvus crea un índice invertido. En lugar de asignar los documentos a su contenido, el índice invertido asigna cada token a los documentos en los que aparece, junto con todas las posiciones registradas de ese token dentro de cada documento.</p>
<p><strong>3. Comparación de frases</strong></p>
<p>Cuando se ejecuta una consulta de frase, Milvus utiliza primero el índice invertido para identificar los documentos que contienen todos los tokens de la consulta. A continuación, valida cada candidato comparando las posiciones de los tokens para asegurarse de que los términos aparecen en el orden correcto y dentro de la distancia permitida <code translate="no">slop</code>. Sólo los documentos que cumplen ambas condiciones se consideran coincidentes.</p>
<p>El siguiente diagrama resume el funcionamiento de Phrase Match de principio a fin.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/workflow2_63c168b107.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-to-Enable-Phrase-Match-in-Milvus" class="common-anchor-header">Cómo activar la concordancia de frases en Milvus<button data-href="#How-to-Enable-Phrase-Match-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>La concordancia de frases funciona en campos de tipo <strong><code translate="no">VARCHAR</code></strong>el tipo de cadena en Milvus. Para utilizarlo, debe configurar el esquema de su colección para que Milvus realice el análisis de texto y almacene la información posicional del campo. Esto se hace habilitando dos parámetros: <code translate="no">enable_analyzer</code> y <code translate="no">enable_match</code>.</p>
<h3 id="Set-enableanalyzer-and-enablematch" class="common-anchor-header">Configurar enable_analyzer y enable_match</h3><p>Para activar Phrase Match para un campo VARCHAR específico, establezca ambos parámetros en <code translate="no">True</code> cuando defina el esquema del campo. Juntos, le dicen a Milvus que</p>
<ul>
<li><p><strong>tokenice</strong> el texto (a través de <code translate="no">enable_analyzer</code>), y</p></li>
<li><p><strong>construya un índice invertido con desplazamientos posicionales</strong> (a través de <code translate="no">enable_match</code>).</p></li>
</ul>
<p>La concordancia de frases se basa en ambos pasos: el analizador divide el texto en tokens y el índice de concordancia almacena dónde aparecen esos tokens, lo que permite realizar consultas eficientes basadas en frases y slop.</p>
<p>A continuación se muestra un ejemplo de configuración de esquema que activa la concordancia de frases en un campo <code translate="no">text</code>:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

schema = MilvusClient.create_schema(enable_dynamic_field=<span class="hljs-literal">False</span>)
schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=DataType.INT64,
    is_primary=<span class="hljs-literal">True</span>,
    auto_id=<span class="hljs-literal">True</span>
)
schema.add_field(
    field_name=<span class="hljs-string">&#x27;text&#x27;</span>,                 <span class="hljs-comment"># Name of the field</span>
    datatype=DataType.VARCHAR,         <span class="hljs-comment"># Field data type set as VARCHAR (string)</span>
    max_length=<span class="hljs-number">1000</span>,                   <span class="hljs-comment"># Maximum length of the string</span>
    enable_analyzer=<span class="hljs-literal">True</span>,              <span class="hljs-comment"># Enables text analysis (tokenization)</span>
    enable_match=<span class="hljs-literal">True</span>                  <span class="hljs-comment"># Enables inverted indexing for phrase matching</span>
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;embeddings&quot;</span>,
    datatype=DataType.FLOAT_VECTOR,
    dim=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Search-with-Phrase-Match-How-Slop-Affects-the-Candidate-Set" class="common-anchor-header">Búsqueda con concordancia de frases: Cómo afecta el Slop al conjunto de candidatos<button data-href="#Search-with-Phrase-Match-How-Slop-Affects-the-Candidate-Set" class="anchor-icon" translate="no">
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
    </button></h2><p>Una vez habilitada la coincidencia para un campo VARCHAR en el esquema de su colección, puede realizar coincidencias de frases utilizando la expresión <code translate="no">PHRASE_MATCH</code>.</p>
<p>Nota: La expresión <code translate="no">PHRASE_MATCH</code> no distingue entre mayúsculas y minúsculas. Puede utilizar <code translate="no">PHRASE_MATCH</code> o <code translate="no">phrase_match</code>.</p>
<p>En las operaciones de búsqueda, la concordancia de frase suele aplicarse antes de la clasificación por similitud vectorial. Primero filtra los documentos basándose en restricciones textuales explícitas, reduciendo el conjunto de candidatos. A continuación, los documentos restantes se vuelven a clasificar utilizando incrustaciones vectoriales.</p>
<p>El ejemplo siguiente muestra cómo afectan a este proceso los distintos valores de <code translate="no">slop</code>. Al ajustar el parámetro <code translate="no">slop</code>, se controla directamente qué documentos superan el filtro de frases y pasan a la fase de clasificación vectorial.</p>
<p>Supongamos que tiene una colección denominada <code translate="no">tech_articles</code> que contiene las cinco entidades siguientes:</p>
<table>
<thead>
<tr><th><strong>doc_id</strong></th><th><strong>texto</strong></th></tr>
</thead>
<tbody>
<tr><td>1</td><td>El aprendizaje automático aumenta la eficacia del análisis de datos a gran escala</td></tr>
<tr><td>2</td><td>El aprendizaje automático es vital para el progreso de la IA moderna</td></tr>
<tr><td>3</td><td>Las arquitecturas de máquinas de aprendizaje profundo optimizan las cargas computacionales</td></tr>
<tr><td>4</td><td>La máquina mejora rápidamente el rendimiento del modelo para el aprendizaje continuo</td></tr>
<tr><td>5</td><td>El aprendizaje de algoritmos de máquina avanzados amplía las capacidades de la IA</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=1</code></strong></p>
<p>Aquí, permitimos una inclinación de 1. El filtro se aplica a los documentos que contienen la frase "máquina de aprendizaje" con una ligera flexibilidad.</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;learning machine&quot; with slop=1</span>
filter_slop1 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;learning machine&#x27;, 1)&quot;</span>

result_slop1 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,
    data=[query_vector],
    <span class="hljs-built_in">filter</span>=filter_slop1,
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>Resultados de la búsqueda:</p>
<table>
<thead>
<tr><th>doc_id</th><th>texto</th></tr>
</thead>
<tbody>
<tr><td>2</td><td>El aprendizaje de una máquina es vital para el progreso de la IA moderna</td></tr>
<tr><td>3</td><td>Las arquitecturas de las máquinas de aprendizaje profundo optimizan las cargas computacionales</td></tr>
<tr><td>5</td><td>El aprendizaje de algoritmos de máquina avanzados amplía las capacidades de la IA</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=2</code></strong></p>
<p>Este ejemplo permite un slop de 2, lo que significa que se permiten hasta dos tokens adicionales (o términos invertidos) entre las palabras "máquina" y "aprendizaje".</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;machine learning&quot; with slop=2</span>
filter_slop2 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;machine learning&#x27;, 2)&quot;</span>

result_slop2 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,             <span class="hljs-comment"># Vector field name</span>
    data=[query_vector],                 <span class="hljs-comment"># Query vector</span>
    <span class="hljs-built_in">filter</span>=filter_slop2,                 <span class="hljs-comment"># Filter expression</span>
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,                            <span class="hljs-comment"># Maximum results to return</span>
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>Resultado de la búsqueda:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>doc_id</strong></th><th style="text-align:center"><strong>texto</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">1</td><td style="text-align:center">El aprendizaje automático aumenta la eficacia del análisis de datos a gran escala</td></tr>
<tr><td style="text-align:center">3</td><td style="text-align:center">Las arquitecturas de máquinas de aprendizaje profundo optimizan las cargas computacionales</td></tr>
</tbody>
</table>
<p><strong><code translate="no">slop=3</code></strong></p>
<p>En este ejemplo, un slop de 3 proporciona aún más flexibilidad. El filtro busca "aprendizaje automático" con un máximo de tres posiciones de token permitidas entre las palabras.</p>
<pre><code translate="no"><span class="hljs-comment"># Example: Filter documents containing &quot;machine learning&quot; with slop=3</span>
filter_slop3 = <span class="hljs-string">&quot;PHRASE_MATCH(text, &#x27;machine learning&#x27;, 3)&quot;</span>

result_slop2 = client.search(
    collection_name=<span class="hljs-string">&quot;tech_articles&quot;</span>,
    anns_field=<span class="hljs-string">&quot;embeddings&quot;</span>,             <span class="hljs-comment"># Vector field name</span>
    data=[query_vector],                 <span class="hljs-comment"># Query vector</span>
    <span class="hljs-built_in">filter</span>=filter_slop3,                 <span class="hljs-comment"># Filter expression</span>
    search_params={<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    limit=<span class="hljs-number">10</span>,                            <span class="hljs-comment"># Maximum results to return</span>
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>Resultado de la búsqueda:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>doc_id</strong></th><th style="text-align:center"><strong>texto</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">1</td><td style="text-align:center">El aprendizaje automático aumenta la eficacia del análisis de datos a gran escala</td></tr>
<tr><td style="text-align:center">2</td><td style="text-align:center">El aprendizaje automático es vital para el progreso de la IA moderna</td></tr>
<tr><td style="text-align:center">3</td><td style="text-align:center">Las arquitecturas de máquinas de aprendizaje profundo optimizan las cargas computacionales</td></tr>
<tr><td style="text-align:center">5</td><td style="text-align:center">El aprendizaje de algoritmos de máquina avanzados amplía las capacidades de la IA</td></tr>
</tbody>
</table>
<h2 id="Quick-Tips-What-You-Need-to-Know-Before-Enabling-Phrase-Match-in-Milvus" class="common-anchor-header">Consejos rápidos: Lo que necesita saber antes de habilitar Phrase Match en Milvus<button data-href="#Quick-Tips-What-You-Need-to-Know-Before-Enabling-Phrase-Match-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Phrase Match proporciona soporte para el filtrado a nivel de frase, pero activarlo implica más que la configuración en tiempo de consulta. Es útil conocer las consideraciones asociadas antes de aplicarlo en un entorno de producción.</p>
<ul>
<li><p>Al activar Phrase Match en un campo se crea un índice invertido, lo que aumenta el uso de almacenamiento. El coste exacto depende de factores como la longitud del texto, el número de tokens únicos y la configuración del analizador. Cuando se trabaja con campos de texto de gran tamaño o con datos de alta cardinalidad, esta sobrecarga debe tenerse en cuenta de antemano.</p></li>
<li><p>La configuración del analizador es otra opción de diseño fundamental. Una vez que se define un analizador en el esquema de recopilación, no se puede cambiar. Cambiar a un analizador diferente más adelante requiere eliminar la colección existente y volver a crearla con un nuevo esquema. Por este motivo, la selección del analizador debe tratarse como una decisión a largo plazo y no como un experimento.</p></li>
<li><p>El comportamiento de la concordancia de frases está estrechamente relacionado con la tokenización del texto. Antes de aplicar un analizador a toda una colección, se recomienda utilizar el método <code translate="no">run_analyzer</code> para inspeccionar el resultado de la tokenización y confirmar que coincide con sus expectativas. Este paso puede ayudar a evitar desajustes sutiles y resultados de consulta inesperados más adelante. Para obtener más información, consulte <a href="https://milvus.io/docs/analyzer-overview.md#share-DYZvdQ2vUowWEwx1MEHcdjNNnqT">Descripción general del analizador</a>.</p></li>
</ul>
<h2 id="Conclusion" class="common-anchor-header">Conclusión<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>La concordancia de frases es un tipo de búsqueda de texto completo básico que permite restricciones a nivel de frase y de posición más allá de la simple concordancia de palabras clave. Al operar en el orden y la proximidad de los tokens, proporciona una forma predecible y precisa de filtrar documentos basándose en cómo aparecen realmente los términos en el texto.</p>
<p>En los sistemas de recuperación modernos, la concordancia de frases suele aplicarse antes de la clasificación basada en vectores. En primer lugar, restringe el conjunto de candidatos a los documentos que satisfacen explícitamente las frases o estructuras requeridas. A continuación, se utiliza la búsqueda vectorial para clasificar estos resultados por relevancia semántica. Este patrón es especialmente eficaz en situaciones como el análisis de registros, la búsqueda de documentación técnica y las canalizaciones RAG, en las que deben aplicarse restricciones textuales antes de tener en cuenta la similitud semántica.</p>
<p>Con la introducción del parámetro <code translate="no">slop</code> en Milvus 2.6, Phrase Match se vuelve más tolerante a la variación del lenguaje natural, al tiempo que conserva su papel como mecanismo de filtrado de texto completo. Esto hace que las restricciones a nivel de frase sean más fáciles de aplicar en los flujos de trabajo de recuperación de producción.</p>
<p>👉 Pruébelo con los scripts de <a href="https://github.com/openvino-book/Milvus-Phrase-Match-Demo">demostración</a> y explore <a href="https://milvus.io/docs/release_notes.md#v267">Milvus 2.6</a> para ver cómo la recuperación consciente de las frases encaja en su pila.</p>
<p>Tienes preguntas o quieres una inmersión profunda en cualquier característica del último Milvus? Únase a nuestro<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> o presente incidencias en<a href="https://github.com/milvus-io/milvus"> GitHub</a>. También puede reservar una sesión individual de 20 minutos para obtener información, orientación y respuestas a sus preguntas a través de<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
