---
id: >-
  unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md
title: >-
  Desbloquear la verdadera recuperación a nivel de entidad: Nuevas funciones
  Array-of-Structs y MAX_SIM en Milvus
author: 'Jeremy Zhu, Min Tian'
date: 2025-12-05T00:00:00.000Z
cover: assets.zilliz.com/array_of_structs_cover_update_5c3d76ac94.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Array of Structs, MAX_SIM, vector database, multi-vector retrieval'
meta_title: |
  Array of Structs in Milvus: Entity-Level Multi-Vector Retrieval
desc: >-
  Descubra cómo Array of Structs y MAX_SIM en Milvus permiten una verdadera
  búsqueda a nivel de entidad para datos multivectoriales, eliminando la
  deduplicación y mejorando la precisión de la recuperación.
origin: >-
  https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md
---
<p>Si ha creado aplicaciones de IA sobre bases de datos vectoriales, probablemente se haya encontrado con el mismo problema: la base de datos recupera incrustaciones de fragmentos individuales, pero su aplicación se centra en <strong><em>entidades</em>.</strong> El desajuste hace que todo el flujo de trabajo de recuperación sea complejo.</p>
<p>Es probable que haya visto esta situación una y otra vez:</p>
<ul>
<li><p><strong>Bases de conocimiento RAG:</strong> Los artículos se dividen en párrafos, por lo que el motor de búsqueda devuelve fragmentos dispersos en lugar del documento completo.</p></li>
<li><p><strong>Recomendaciones de comercio electrónico:</strong> Un producto tiene varias imágenes incrustadas y el sistema devuelve cinco ángulos del mismo artículo en lugar de cinco productos únicos.</p></li>
<li><p><strong>Plataformas de vídeo:</strong> Los vídeos se dividen en incrustaciones de clips, pero los resultados de búsqueda muestran fragmentos del mismo vídeo en lugar de una única entrada consolidada.</p></li>
<li><p><strong>Recuperación al estilo ColBERT / ColPali:</strong> Los documentos se expanden en cientos de incrustaciones a nivel de token o parche, y los resultados se obtienen en trozos minúsculos que todavía hay que combinar.</p></li>
</ul>
<p>Todos estos problemas tienen su origen en la <em>misma carencia arquitectónica</em>: la mayoría de las bases de datos vectoriales tratan cada incrustación como una fila aislada, mientras que las aplicaciones reales operan con entidades de nivel superior: documentos, productos, vídeos, elementos, escenas. Como resultado, los equipos de ingeniería se ven obligados a reconstruir las entidades manualmente utilizando la lógica de deduplicación, agrupación, bucketing y reordenación. Funciona, pero es frágil, lento y sobrecarga su capa de aplicación con lógica que nunca debería haber vivido allí en primer lugar.</p>
<p><a href="https://milvus.io/docs/release_notes.md#v264">Milvus 2.6.4</a> cierra esta brecha con una nueva característica: <a href="https://milvus.io/docs/array-of-structs.md"><strong>Array of Structs</strong></a> con el tipo métrico <strong>MAX_SIM</strong>. Juntos, permiten que todas las incrustaciones de una única entidad se almacenen en un único registro y permiten a Milvus puntuar y devolver la entidad de forma holística. Se acabaron los conjuntos de resultados duplicados. Se acabaron los complejos postprocesamientos, como el reordenamiento y la fusión.</p>
<p>En este artículo, veremos cómo funcionan Array of Structs y MAX_SIM, y lo demostraremos con dos ejemplos reales: La recuperación de documentos de Wikipedia y la búsqueda de documentos basada en imágenes de ColPali.</p>
<h2 id="What-is-an-Array-of-Structs" class="common-anchor-header">¿Qué es una matriz de estructuras?<button data-href="#What-is-an-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><p>En Milvus, un campo <strong>Array of Structs</strong> permite que un único registro contenga una <em>lista ordenada</em> de elementos Struct, cada uno de los cuales sigue el mismo esquema predefinido. Una Struct puede contener múltiples vectores, así como campos escalares, cadenas o cualquier otro tipo admitido. En otras palabras, le permite agrupar todas las piezas que pertenecen a una entidad (incrustaciones de párrafos, vistas de imágenes, vectores de tokens, metadatos) directamente dentro de una fila.</p>
<p>He aquí un ejemplo de entidad de una colección que contiene un campo Array of Structs.</p>
<pre><code translate="no">{
    <span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">0</span>,
    <span class="hljs-string">&#x27;title&#x27;</span>: <span class="hljs-string">&#x27;Walden&#x27;</span>,
    <span class="hljs-string">&#x27;title_vector&#x27;</span>: [<span class="hljs-number">0.1</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.3</span>, <span class="hljs-number">0.4</span>, <span class="hljs-number">0.5</span>],
    <span class="hljs-string">&#x27;author&#x27;</span>: <span class="hljs-string">&#x27;Henry David Thoreau&#x27;</span>,
    <span class="hljs-string">&#x27;year_of_publication&#x27;</span>: <span class="hljs-number">1845</span>,
    <span class="hljs-comment">// highlight-start</span>
    <span class="hljs-string">&#x27;chunks&#x27;</span>: [
        {
            <span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;When I wrote the following pages, or rather the bulk of them...&#x27;</span>,
            <span class="hljs-string">&#x27;text_vector&#x27;</span>: [<span class="hljs-number">0.3</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.3</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.5</span>],
            <span class="hljs-string">&#x27;chapter&#x27;</span>: <span class="hljs-string">&#x27;Economy&#x27;</span>,
        },
        {
            <span class="hljs-string">&#x27;text&#x27;</span>: <span class="hljs-string">&#x27;I would fain say something, not so much concerning the Chinese and...&#x27;</span>,
            <span class="hljs-string">&#x27;text_vector&#x27;</span>: [<span class="hljs-number">0.7</span>, <span class="hljs-number">0.4</span>, <span class="hljs-number">0.2</span>, <span class="hljs-number">0.7</span>, <span class="hljs-number">0.8</span>],
            <span class="hljs-string">&#x27;chapter&#x27;</span>: <span class="hljs-string">&#x27;Economy&#x27;</span>
        }
    ]
    <span class="hljs-comment">// hightlight-end</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>En el ejemplo anterior, el campo <code translate="no">chunks</code> es un campo Array of Structs, y cada elemento Struct contiene sus propios campos, a saber, <code translate="no">text</code>, <code translate="no">text_vector</code> y <code translate="no">chapter</code>.</p>
<p>Este enfoque resuelve un antiguo problema de modelado en las bases de datos vectoriales. Tradicionalmente, cada incrustación o atributo tiene que convertirse en su propia fila, lo que obliga a dividir <strong>las entidades multivectoriales (documentos, productos, vídeos)</strong> en docenas, cientos o incluso miles de registros. Con Array of Structs, Milvus le permite almacenar toda la entidad multivectorial en un único campo, lo que lo convierte en un ajuste natural para listas de párrafos, incrustaciones de tokens, secuencias de clips, imágenes multivista o cualquier escenario en el que un elemento lógico esté compuesto por muchos vectores.</p>
<h2 id="How-Does-an-Array-of-Structs-Work-with-MAXSIM" class="common-anchor-header">¿Cómo funciona una matriz de estructuras con MAX_SIM?<button data-href="#How-Does-an-Array-of-Structs-Work-with-MAXSIM" class="anchor-icon" translate="no">
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
    </button></h2><p>Encima de esta nueva estructura de matriz de estructuras se encuentra <strong>MAX_SIM</strong>, una nueva estrategia de puntuación que hace que la recuperación semántica sea consciente de la entidad. Cuando llega una consulta, Milvus la compara con <em>cada</em> vector dentro de cada matriz de estructuras y toma la <strong>máxima similitud</strong> como puntuación final de la entidad. A continuación, la entidad se clasifica -y se devuelve- en función de esa única puntuación. De este modo se evita el problema clásico de las bases de datos vectoriales de recuperar fragmentos dispersos y se traslada la carga de agrupar, desagregar y volver a clasificar a la capa de aplicación. Con MAX_SIM, la recuperación a nivel de entidad se vuelve integrada, consistente y eficiente.</p>
<p>Para entender cómo funciona MAX_SIM en la práctica, veamos un ejemplo concreto.</p>
<p><strong>Nota:</strong> Todos los vectores de este ejemplo son generados por el mismo modelo de incrustación, y la similitud se mide con la similitud coseno en el rango [0,1].</p>
<p>Supongamos que un usuario busca <strong>"Curso de aprendizaje automático para principiantes".</strong></p>
<p>La consulta se tokeniza en tres <strong>tokens</strong>:</p>
<ul>
<li><p><em>Aprendizaje automático</em></p></li>
<li><p><em>principiante</em></p></li>
<li><p><em>curso</em></p></li>
</ul>
<p>A continuación, cada uno de estos tokens se <strong>convierte en un vector</strong> de incrustación mediante el mismo modelo de incrustación utilizado para los documentos.</p>
<p>Ahora, imaginemos que la base de datos de vectores contiene dos documentos:</p>
<ul>
<li><p><strong>doc_1:</strong> <em>Guía de introducción a las redes neuronales profundas con Python</em></p></li>
<li><p><strong>doc_2:</strong> <em>Guía avanzada para la lectura de trabajos LLM</em></p></li>
</ul>
<p>Ambos documentos han sido embebidos en vectores y almacenados dentro de un Array de Structs.</p>
<h3 id="Step-1-Compute-MAXSIM-for-doc1" class="common-anchor-header"><strong>Paso 1: Calcular MAX_SIM para doc_1</strong></h3><p>Para cada vector de consulta, Milvus calcula su similitud coseno contra cada vector en doc_1:</p>
<table>
<thead>
<tr><th></th><th>Introducción</th><th>guía</th><th>redes neuronales profundas</th><th>python</th></tr>
</thead>
<tbody>
<tr><td>aprendizaje automático</td><td>0.0</td><td>0.0</td><td><strong>0.9</strong></td><td>0.3</td></tr>
<tr><td>principiante</td><td><strong>0.8</strong></td><td>0.1</td><td>0.0</td><td>0.3</td></tr>
<tr><td>curso</td><td>0.3</td><td><strong>0.7</strong></td><td>0.1</td><td>0.1</td></tr>
</tbody>
</table>
<p>Para cada vector de consulta, MAX_SIM selecciona la <strong>mayor</strong> similitud de su fila:</p>
<ul>
<li><p>aprendizaje automático → redes neuronales profundas (0,9)</p></li>
<li><p>principiante → introducción (0,8)</p></li>
<li><p>curso → guía (0,7)</p></li>
</ul>
<p>La suma de las mejores coincidencias da a doc_1 una <strong>puntuación MAX_SIM de 2,4</strong>.</p>
<h3 id="Step-2-Compute-MAXSIM-for-doc2" class="common-anchor-header">Paso 2: Calcular MAX_SIM para doc_2</h3><p>Ahora repetimos el proceso para doc_2:</p>
<table>
<thead>
<tr><th></th><th>avanzado</th><th>guía</th><th>LLM</th><th>papel</th><th>lectura</th></tr>
</thead>
<tbody>
<tr><td>aprendizaje automático</td><td>0.1</td><td>0.2</td><td><strong>0.9</strong></td><td>0.3</td><td>0.1</td></tr>
<tr><td>principiante</td><td>0.4</td><td><strong>0.6</strong></td><td>0.0</td><td>0.2</td><td>0.5</td></tr>
<tr><td>curso</td><td>0.5</td><td><strong>0.8</strong></td><td>0.1</td><td>0.4</td><td>0.7</td></tr>
</tbody>
</table>
<p>Las mejores coincidencias para doc_2 son:</p>
<ul>
<li><p>"aprendizaje automático" → "LLM" (0,9)</p></li>
<li><p>"beginner" → "guide" (0.6)</p></li>
<li><p>"curso" → "guía" (0,8)</p></li>
</ul>
<p>Al sumarlos, doc_2 obtiene una <strong>puntuación MAX_SIM de 2,3</strong>.</p>
<h3 id="Step-3-Compare-the-Scores" class="common-anchor-header">Paso 3: Comparar las puntuaciones</h3><p>Como <strong>2,4 &gt; 2,3</strong>, <strong>doc_1 tiene una puntuación más alta que doc_2</strong>, lo que tiene un sentido intuitivo, ya que doc_1 está más cerca de una guía introductoria de aprendizaje automático.</p>
<p>De este ejemplo, podemos destacar tres características principales de MAX_SIM:</p>
<ul>
<li><p><strong>Primero semántico, no basado en palabras clave:</strong> MAX_SIM compara incrustaciones, no literales de texto. Aunque <em>"aprendizaje automático"</em> y <em>"redes neuronales profundas</em> " comparten cero palabras que se solapan, su similitud semántica es de 0,9. Esto hace que MAX_SIM sea robusto ante sinergias. Esto hace que MAX_SIM sea robusto frente a sinónimos, paráfrasis, solapamiento conceptual y cargas de trabajo modernas ricas en incrustaciones.</p></li>
<li><p><strong>Insensible a la longitud y el orden:</strong> MAX_SIM no requiere que la consulta y el documento tengan el mismo número de vectores (por ejemplo, doc_1 tiene 4 vectores mientras que doc_2 tiene 5, y ambos funcionan bien). Tampoco tiene en cuenta el orden de los vectores: que "principiante" aparezca antes en la consulta y que "introducción" aparezca después en el documento no influye en la puntuación.</p></li>
<li><p><strong>Cada vector de consulta es importante:</strong> MAX_SIM toma la mejor coincidencia para cada vector de consulta y suma las mejores puntuaciones. Esto evita que los vectores no coincidentes distorsionen el resultado y garantiza que todos los token de consulta importantes contribuyan a la puntuación final. Por ejemplo, la coincidencia de menor calidad para "principiante" en doc_2 reduce directamente su puntuación total.</p></li>
</ul>
<h2 id="Why-MAXSIM-+-Array-of-Structs-Matter-in-Vector-Database" class="common-anchor-header">Por qué MAX_SIM + Array de estructuras son importantes en la base de datos vectorial<button data-href="#Why-MAXSIM-+-Array-of-Structs-Matter-in-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a> es una base de datos vectorial de código abierto y alto rendimiento, y ahora es totalmente compatible con MAX_SIM junto con Array of Structs, lo que permite una recuperación vectorial nativa y multivectorial a nivel de entidad:</p>
<ul>
<li><p><strong>Almacene entidades multivectoriales de forma nativa:</strong> Array of Structs le permite almacenar grupos de vectores relacionados en un único campo sin dividirlos en filas separadas o tablas auxiliares.</p></li>
<li><p><strong>Cálculo eficaz de la mejor correspondencia:</strong> Combinado con índices vectoriales como IVF y HNSW, MAX_SIM puede calcular las mejores coincidencias sin escanear cada vector, manteniendo un alto rendimiento incluso con documentos de gran tamaño.</p></li>
<li><p><strong>Diseñado específicamente para cargas de trabajo semánticas pesadas:</strong> Este enfoque destaca en la recuperación de textos largos, la correspondencia semántica multifacética, la alineación documento-resumen, las consultas multipalabra clave y otros escenarios de IA que requieren un razonamiento semántico flexible y detallado.</p></li>
</ul>
<h2 id="When-to-Use-an-Array-of-Structs" class="common-anchor-header">Cuándo utilizar una matriz de estructuras<button data-href="#When-to-Use-an-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><p>El valor de las <strong>matrices de</strong> estructuras se hace evidente cuando se observa lo que permiten. En esencia, esta función proporciona tres capacidades fundamentales:</p>
<ul>
<li><p><strong>Agrupa datos heterogéneos -vectores</strong>, escalares, cadenas, metadatos- en un único objeto estructurado.</p></li>
<li><p>Alinea<strong>el almacenamiento con entidades del mundo real</strong>, de modo que cada fila de la base de datos se asigna limpiamente a un elemento real, como un artículo, un producto o un vídeo.</p></li>
<li><p><strong>Cuando se combina con funciones de agregación como MAX_SIM</strong>, permite una verdadera recuperación multivectorial a nivel de entidad directamente desde la base de datos, eliminando la deduplicación, agrupación o renumeración en la capa de aplicación.</p></li>
</ul>
<p>Debido a estas propiedades, Array of Structs es un ajuste natural siempre que una <em>única entidad lógica esté representada por múltiples vectores</em>. Algunos ejemplos comunes son los artículos divididos en párrafos, los documentos descompuestos en incrustaciones de tokens o los productos representados por múltiples imágenes. Si los resultados de una búsqueda contienen resultados duplicados, fragmentos dispersos o la misma entidad aparece varias veces entre los primeros resultados, Array of Structs resuelve estos problemas en la capa de almacenamiento y recuperación, no mediante parches a posteriori en el código de la aplicación.</p>
<p>Este patrón es especialmente potente para los modernos sistemas de inteligencia artificial que se basan en la <strong>recuperación multivectorial</strong>. Por ejemplo:</p>
<ul>
<li><p><a href="https://zilliz.com/learn/explore-colbert-token-level-embedding-and-ranking-model-for-similarity-search"><strong>ColBERT</strong></a> representa un único documento como 100-500 tokens incrustados para realizar correspondencias semánticas precisas en ámbitos como el texto jurídico y la investigación académica.</p></li>
<li><p><a href="https://zilliz.com/blog/colpali-enhanced-doc-retrieval-with-vision-language-models-and-colbert-strategy"><strong>ColPali</strong> convierte </a>cada página PDF en 256-1024 parches de imagen para la recuperación multimodal de estados financieros, contratos, facturas y otros documentos escaneados.</p></li>
</ul>
<p>Una matriz de Structs permite a Milvus almacenar todos estos vectores en una única entidad y calcular la similitud agregada (por ejemplo, MAX_SIM) de forma eficiente y nativa. Para que esto quede más claro, he aquí dos ejemplos concretos.</p>
<h3 id="Example-1-E-commerce-Product-Search" class="common-anchor-header">Ejemplo 1: Búsqueda de productos en el comercio electrónico</h3><p>Anteriormente, los productos con varias imágenes se almacenaban en un esquema plano: una imagen por fila. Un producto con imágenes frontales, laterales y en ángulo producía tres filas. A menudo, los resultados de la búsqueda devolvían varias imágenes del mismo producto, lo que obligaba a deduplicarlas y reordenarlas manualmente.</p>
<p>Con una matriz de estructuras, cada producto se convierte en <strong>una fila</strong>. Todas las incrustaciones de imágenes y metadatos (ángulo, is_primary, etc.) viven dentro de un campo <code translate="no">images</code> como una matriz de structs. Milvus entiende que pertenecen al mismo producto y devuelve el producto como un todo, no sus imágenes individuales.</p>
<h3 id="Example-2-Knowledge-Base-or-Wikipedia-Search" class="common-anchor-header">Ejemplo 2: Base de conocimientos o búsqueda en Wikipedia</h3><p>Anteriormente, un solo artículo de Wikipedia se dividía en <em>N</em> filas de párrafos. Los resultados de la búsqueda devolvían párrafos dispersos, lo que obligaba al sistema a agruparlos y adivinar a qué artículo pertenecían.</p>
<p>Con una matriz de estructuras, todo el artículo se convierte <strong>en una fila</strong>. Todos los párrafos y sus incrustaciones se agrupan en un campo de párrafos, y la base de datos devuelve el artículo completo, no trozos fragmentados.</p>
<h2 id="Hands-on-Tutorials-Document-Level-Retrieval-with-the-Array-of-Structs" class="common-anchor-header">Tutoriales prácticos: Recuperación a nivel de documento con la matriz de estructuras<button data-href="#Hands-on-Tutorials-Document-Level-Retrieval-with-the-Array-of-Structs" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Wikipedia-Document-Retrieval" class="common-anchor-header">1. Recuperación de documentos de Wikipedia</h3><p>En este tutorial, veremos cómo utilizar una <strong>matriz de estructuras</strong> para convertir datos a nivel de párrafo en registros de documentos completos, permitiendo a Milvus realizar <strong>una verdadera recuperación a nivel de documento</strong> en lugar de devolver fragmentos aislados.</p>
<p>Muchas cadenas de bases de conocimiento almacenan los artículos de Wikipedia como fragmentos de párrafos. Esto funciona bien para la incrustación y la indexación, pero dificulta la recuperación: una consulta de usuario suele devolver párrafos dispersos, lo que obliga a agrupar y reconstruir manualmente el artículo. Con una matriz de estructuras y MAX_SIM, podemos rediseñar el esquema de almacenamiento para que <strong>cada artículo se convierta en una fila</strong>, y Milvus pueda clasificar y devolver el documento completo de forma nativa.</p>
<p>En los siguientes pasos, mostraremos cómo:</p>
<ol>
<li><p>Cargar y preprocesar los datos de los párrafos de Wikipedia</p></li>
<li><p>Agrupar todos los párrafos que pertenecen al mismo artículo en una matriz de estructuras.</p></li>
<li><p>Insertar estos documentos estructurados en Milvus</p></li>
<li><p>Ejecutar consultas MAX_SIM para recuperar artículos completos, de forma limpia, sin deduplicación ni renumeración.</p></li>
</ol>
<p>Al final de este tutorial, tendrá un canal de trabajo en el que Milvus gestiona directamente la recuperación a nivel de entidad, exactamente como esperan los usuarios.</p>
<p><strong>Modelo de datos:</strong></p>
<pre><code translate="no">{
    <span class="hljs-string">&quot;wiki_id&quot;</span>: <span class="hljs-built_in">int</span>,                  <span class="hljs-comment"># WIKI ID(primary key） </span>
    <span class="hljs-string">&quot;paragraphs&quot;</span>: ARRAY&lt;STRUCT&lt;      <span class="hljs-comment"># Array of paragraph structs</span>
        text:VARCHAR                 <span class="hljs-comment"># Paragraph text</span>
        emb: FLOAT_VECTOR(<span class="hljs-number">768</span>)       <span class="hljs-comment"># Embedding for each paragraph</span>
    &gt;&gt;
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Paso 1: Agrupar y transformar los datos</strong></p>
<p>Para esta demostración, utilizamos el conjunto de datos <a href="https://huggingface.co/datasets/Cohere/wikipedia-22-12-simple-embeddings">Simple Wikipedia Embeddings</a>.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> pandas <span class="hljs-keyword">as</span> pd
<span class="hljs-keyword">import</span> pyarrow <span class="hljs-keyword">as</span> pa

<span class="hljs-comment"># Load the dataset and group by wiki_id</span>
df = pd.read_parquet(<span class="hljs-string">&quot;train-*.parquet&quot;</span>)
grouped = df.groupby(<span class="hljs-string">&#x27;wiki_id&#x27;</span>)

<span class="hljs-comment"># Build the paragraph array for each article</span>
wiki_data = []
<span class="hljs-keyword">for</span> wiki_id, group <span class="hljs-keyword">in</span> grouped:
    wiki_data.append({
        <span class="hljs-string">&#x27;wiki_id&#x27;</span>: wiki_id,
        <span class="hljs-string">&#x27;paragraphs&#x27;</span>: [{<span class="hljs-string">&#x27;text&#x27;</span>: row[<span class="hljs-string">&#x27;text&#x27;</span>], <span class="hljs-string">&#x27;emb&#x27;</span>: row[<span class="hljs-string">&#x27;emb&#x27;</span>]}
                       <span class="hljs-keyword">for</span> _, row <span class="hljs-keyword">in</span> group.iterrows()]
    })
<button class="copy-code-btn"></button></code></pre>
<p><strong>Paso 2: Crear la colección Milvus</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
schema = client.create_schema()
schema.add_field(<span class="hljs-string">&quot;wiki_id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)

<span class="hljs-comment"># Define the Struct schema</span>
struct_schema = client.create_struct_field_schema()
struct_schema.add_field(<span class="hljs-string">&quot;text&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>)
struct_schema.add_field(<span class="hljs-string">&quot;emb&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)

schema.add_field(<span class="hljs-string">&quot;paragraphs&quot;</span>, DataType.ARRAY,
                 element_type=DataType.STRUCT,
                 struct_schema=struct_schema, max_capacity=<span class="hljs-number">200</span>)

client.create_collection(<span class="hljs-string">&quot;wiki_docs&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Paso 3: Insertar datos y crear un índice</strong></p>
<pre><code translate="no"><span class="hljs-meta"># Batch insert documents</span>
client.insert(<span class="hljs-string">&quot;wiki_docs&quot;</span>, wiki_data)

<span class="hljs-meta"># Create an HNSW index</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;paragraphs[emb]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
)
client.create_index(<span class="hljs-string">&quot;wiki_docs&quot;</span>, index_params)
client.load_collection(<span class="hljs-string">&quot;wiki_docs&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Paso 4: Buscar documentos</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Search query</span>
<span class="hljs-keyword">import</span> cohere
<span class="hljs-keyword">from</span> pymilvus.client.embedding_list <span class="hljs-keyword">import</span> EmbeddingList

<span class="hljs-comment"># The dataset uses Cohere&#x27;s multilingual-22-12 embedding model, so we must embed the query using the same model.</span>
co = cohere.Client(<span class="hljs-string">f&quot;&lt;&lt;COHERE_API_KEY&gt;&gt;&quot;</span>)
query = <span class="hljs-string">&#x27;Who founded Youtube&#x27;</span>
response = co.embed(texts=[query], model=<span class="hljs-string">&#x27;multilingual-22-12&#x27;</span>)
query_embedding = response.embeddings
query_emb_list = EmbeddingList()

<span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> query_embedding[<span class="hljs-number">0</span>]:
    query_emb_list.add(vec)

results = client.search(
    collection_name=<span class="hljs-string">&quot;wiki_docs&quot;</span>,
    data=[query_emb_list],
    anns_field=<span class="hljs-string">&quot;paragraphs[emb]&quot;</span>,
    search_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
        <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">200</span>, <span class="hljs-string">&quot;retrieval_ann_ratio&quot;</span>: <span class="hljs-number">3</span>}
    },
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;wiki_id&quot;</span>]
)

<span class="hljs-comment"># Results: directly return 10 full articles!</span>
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Article <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;wiki_id&#x27;</span>]}</span>: Score <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Comparación de resultados: Recuperación tradicional frente a matriz de estructuras</strong></p>
<p>El impacto de Array of Structs queda claro cuando observamos lo que devuelve realmente la base de datos:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Dimensión</strong></th><th style="text-align:center"><strong>Enfoque tradicional</strong></th><th style="text-align:center"><strong>Matriz de estructuras</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>Resultados de la base de datos</strong></td><td style="text-align:center">Devuelve <strong>los 100 párrafos principales</strong> (alta redundancia)</td><td style="text-align:center">Devuelve los <em>10 mejores documentos completos</em> - limpio y preciso</td></tr>
<tr><td style="text-align:center"><strong>Lógica de aplicación</strong></td><td style="text-align:center">Requiere <strong>agrupación, deduplicación y reordenación</strong> (complejo)</td><td style="text-align:center">No necesita post-procesamiento - los resultados a nivel de entidad provienen directamente de Milvus</td></tr>
</tbody>
</table>
<p>En el ejemplo de Wikipedia, sólo hemos demostrado el caso más sencillo: combinar vectores de párrafos en una representación unificada del documento. Pero el verdadero punto fuerte de Array of Structs es que se generaliza a <strong>cualquier</strong> modelo de datos multivectorial, tanto a las canalizaciones de recuperación clásicas como a las arquitecturas de IA modernas.</p>
<p><strong>Escenarios tradicionales de recuperación multivectorial</strong></p>
<p>Muchos sistemas de búsqueda y recomendación bien establecidos operan de forma natural sobre entidades con múltiples vectores asociados. Array of Structs se adapta perfectamente a estos casos de uso:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Escenario</strong></th><th style="text-align:center"><strong>Modelo de datos</strong></th><th style="text-align:center"><strong>Vectores por entidad</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">🛍️ <strong>Productos de comercio electrónico</strong></td><td style="text-align:center">Un producto → varias imágenes</td><td style="text-align:center">5-20</td></tr>
<tr><td style="text-align:center">🎬 <strong>Búsqueda de vídeos</strong></td><td style="text-align:center">Un vídeo → múltiples clips</td><td style="text-align:center">20-100</td></tr>
<tr><td style="text-align:center">📖 <strong>Recuperación de papel</strong></td><td style="text-align:center">Un papel → múltiples secciones</td><td style="text-align:center">5-15</td></tr>
</tbody>
</table>
<p><strong>Cargas de trabajo de modelos de IA (casos de uso multivectoriales clave)</strong></p>
<p>Array of Structs se vuelve aún más crítico en los modelos de IA modernos que producen intencionalmente grandes conjuntos de vectores por entidad para el razonamiento semántico de grano fino.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Modelo</strong></th><th style="text-align:center"><strong>Modelo de datos</strong></th><th style="text-align:center"><strong>Vectores por entidad</strong></th><th style="text-align:center"><strong>Aplicación</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>ColBERT</strong></td><td style="text-align:center">Un documento → muchas incrustaciones de token</td><td style="text-align:center">100-500</td><td style="text-align:center">Textos jurídicos, documentos académicos, recuperación de documentos detallada</td></tr>
<tr><td style="text-align:center"><strong>ColPali</strong></td><td style="text-align:center">Una página PDF → muchas incrustaciones de parches</td><td style="text-align:center">256-1024</td><td style="text-align:center">Informes financieros, contratos, facturas, búsqueda multimodal de documentos</td></tr>
</tbody>
</table>
<p>Estos modelos <em>requieren</em> un patrón de almacenamiento multivectorial. Antes de Array of Structs, los desarrolladores tenían que dividir los vectores en filas y volver a unir manualmente los resultados. Con Milvus, estas entidades pueden ahora almacenarse y recuperarse de forma nativa, con MAX_SIM gestionando automáticamente la puntuación a nivel de documento.</p>
<h3 id="2-ColPali-Image-Based-Document-Search" class="common-anchor-header">2. Búsqueda de documentos basada en imágenes ColPali</h3><p><a href="https://zilliz.com/blog/colpali-enhanced-doc-retrieval-with-vision-language-models-and-colbert-strategy"><strong>ColPali</strong></a> es un potente modelo de recuperación multimodal de PDF. En lugar de basarse en el texto, procesa cada página PDF como una imagen y la divide en hasta 1024 parches visuales, generando una incrustación por parche. En un esquema de base de datos tradicional, esto requeriría almacenar una sola página como cientos o miles de filas separadas, lo que haría imposible que la base de datos entendiera que estas filas pertenecen a la misma página. Como resultado, la búsqueda a nivel de entidad se vuelve fragmentada y poco práctica.</p>
<p>Array of Structs resuelve esto limpiamente almacenando todas las incrustaciones de parches <em>dentro de un único campo</em>, permitiendo a Milvus tratar la página como una entidad multivectorial cohesiva.</p>
<p>La búsqueda tradicional en PDF depende a menudo <strong>del OCR</strong>, que convierte las imágenes de la página en texto. Esto funciona para el texto sin formato, pero se pierden los gráficos, las tablas, el diseño y otras señales visuales. ColPali evita esta limitación trabajando directamente sobre las imágenes de las páginas, conservando toda la información visual y textual. La contrapartida es la escala: cada página contiene ahora cientos de vectores, lo que requiere una base de datos que pueda agregar muchas incrustaciones en una entidad, exactamente lo que ofrece Array of Structs + MAX_SIM.</p>
<p>El caso de uso más común es <strong>Vision RAG</strong>, donde cada página PDF se convierte en una entidad multivectorial. Los escenarios típicos incluyen:</p>
<ul>
<li><p><strong>Informes financieros:</strong> búsqueda en miles de PDF de páginas que contengan gráficos o tablas específicos.</p></li>
<li><p><strong>Contratos:</strong> recuperación de cláusulas de documentos legales escaneados o fotografiados.</p></li>
<li><p><strong>Facturas:</strong> búsqueda de facturas por proveedor, importe o diseño.</p></li>
<li><p><strong>Presentaciones:</strong> localización de diapositivas que contengan una figura o diagrama concreto.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Col_Pali_1daaab3c1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Modelo de datos:</strong></p>
<pre><code translate="no">{
    <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-built_in">int</span>,                     <span class="hljs-comment"># Page ID (primary key) </span>
    <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-built_in">int</span>,                 <span class="hljs-comment"># Page number within the document </span>
    <span class="hljs-string">&quot;doc_name&quot;</span>: VARCHAR,                <span class="hljs-comment"># Document name</span>
    <span class="hljs-string">&quot;patches&quot;</span>: ARRAY&lt;STRUCT&lt;            <span class="hljs-comment"># Array of patch objects</span>
        patch_embedding: FLOAT_VECTOR(<span class="hljs-number">128</span>)  <span class="hljs-comment"># Embedding for each patch</span>
    &gt;&gt;
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Paso 1: Preparar los datos</strong>Puede consultar el documento para obtener información detallada sobre cómo ColPali convierte imágenes o texto en representaciones multivectoriales.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> torch
<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image

<span class="hljs-keyword">from</span> colpali_engine.models <span class="hljs-keyword">import</span> ColPali, ColPaliProcessor

model_name = <span class="hljs-string">&quot;vidore/colpali-v1.3&quot;</span>

model = ColPali.from_pretrained(
    model_name,
    torch_dtype=torch.bfloat16,
    device_map=<span class="hljs-string">&quot;cuda:0&quot;</span>,  <span class="hljs-comment"># or &quot;mps&quot; if on Apple Silicon</span>
).<span class="hljs-built_in">eval</span>()

processor = ColPaliProcessor.from_pretrained(model_name)
<span class="hljs-comment"># Example: 2 documents, 5 pages each, total 10 images</span>
images = [
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image1.png&quot;</span>), 
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image2.png&quot;</span>), 
    ....
    Image.<span class="hljs-built_in">open</span>(<span class="hljs-string">&quot;path/to/your/image10.png&quot;</span>)
]
<span class="hljs-comment"># Convert each image into multiple patch embeddings</span>
batch_images = processor.process_images(images).to(model.device)
<span class="hljs-keyword">with</span> torch.no_grad():
    image_embeddings = model(**batch_images)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Paso 2: Crear la colección Milvus</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
schema = client.create_schema()
schema.add_field(<span class="hljs-string">&quot;page_id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;page_number&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;doc_name&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">500</span>)

<span class="hljs-comment"># Struct Array for patches</span>
struct_schema = client.create_struct_field_schema()
struct_schema.add_field(<span class="hljs-string">&quot;patch_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">128</span>)

schema.add_field(<span class="hljs-string">&quot;patches&quot;</span>, DataType.ARRAY,
                 element_type=DataType.STRUCT,
                 struct_schema=struct_schema, max_capacity=<span class="hljs-number">2048</span>)

client.create_collection(<span class="hljs-string">&quot;doc_pages&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Paso 3: Insertar datos y crear un índice</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Prepare data for insertion</span>
page_data=[
    {
        <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;doc_name&quot;</span>: <span class="hljs-string">&quot;Q1_Financial_Report.pdf&quot;</span>,
        <span class="hljs-string">&quot;patches&quot;</span>: [
            {<span class="hljs-string">&quot;patch_embedding&quot;</span>: emb} <span class="hljs-keyword">for</span> emb <span class="hljs-keyword">in</span> image_embeddings[<span class="hljs-number">0</span>]
        ],
    },
    ...,
    {
        <span class="hljs-string">&quot;page_id&quot;</span>: <span class="hljs-number">9</span>,
        <span class="hljs-string">&quot;page_number&quot;</span>: <span class="hljs-number">4</span>,
        <span class="hljs-string">&quot;doc_name&quot;</span>: <span class="hljs-string">&quot;Product_Manual.pdf&quot;</span>,
        <span class="hljs-string">&quot;patches&quot;</span>: [
            {<span class="hljs-string">&quot;patch_embedding&quot;</span>: emb} <span class="hljs-keyword">for</span> emb <span class="hljs-keyword">in</span> image_embeddings[<span class="hljs-number">9</span>]
        ],
    },
]

client.insert(<span class="hljs-string">&quot;doc_pages&quot;</span>, page_data)

<span class="hljs-comment"># Create index</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;patches[patch_embedding]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_IP&quot;</span>,
    params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">32</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
)
client.create_index(<span class="hljs-string">&quot;doc_pages&quot;</span>, index_params)
client.load_collection(<span class="hljs-string">&quot;doc_pages&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Paso 4: Búsqueda multimodal: Consulta de texto → Resultados de imagen</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Run the search</span>
<span class="hljs-keyword">from</span> pymilvus.client.embedding_list <span class="hljs-keyword">import</span> EmbeddingList

queries = [
    <span class="hljs-string">&quot;quarterly revenue growth chart&quot;</span>    
]
<span class="hljs-comment"># Convert the text query into a multi-vector representation</span>
batch_queries = processor.process_queries(queries).to(model.device)
<span class="hljs-keyword">with</span> torch.no_grad():
    query_embeddings = model(**batch_queries)

query_emb_list = EmbeddingList()
<span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> query_embeddings[<span class="hljs-number">0</span>]:
    query_emb_list.add(vec)
results = client.search(
    collection_name=<span class="hljs-string">&quot;doc_pages&quot;</span>,
    data=[query_emb_list],
    anns_field=<span class="hljs-string">&quot;patches[patch_embedding]&quot;</span>,
    search_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_IP&quot;</span>,
        <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">100</span>, <span class="hljs-string">&quot;retrieval_ann_ratio&quot;</span>: <span class="hljs-number">3</span>}
    },
    limit=<span class="hljs-number">3</span>,
    output_fields=[<span class="hljs-string">&quot;page_id&quot;</span>, <span class="hljs-string">&quot;doc_name&quot;</span>, <span class="hljs-string">&quot;page_number&quot;</span>]
)


<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Query: &#x27;<span class="hljs-subst">{queries[<span class="hljs-number">0</span>]}</span>&#x27;&quot;</span>)
<span class="hljs-keyword">for</span> i, hit <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results, <span class="hljs-number">1</span>):
    entity = hit[<span class="hljs-string">&#x27;entity&#x27;</span>]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;doc_name&#x27;</span>]}</span> - Page <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;page_number&#x27;</span>]}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   Score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>\n&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Ejemplo de resultados:</strong></p>
<pre><code translate="no"><span class="hljs-title class_">Query</span>: <span class="hljs-string">&#x27;quarterly revenue growth chart&#x27;</span>
<span class="hljs-number">1.</span> Q1_Financial_Report.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">2</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.9123</span>

<span class="hljs-number">2.</span> Q1_Financial_Report.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">1</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.7654</span>

<span class="hljs-number">3.</span> <span class="hljs-title class_">Product</span>_Manual.<span class="hljs-property">pdf</span> - <span class="hljs-title class_">Page</span> <span class="hljs-number">1</span>
   <span class="hljs-title class_">Score</span>: <span class="hljs-number">0.5231</span>
<button class="copy-code-btn"></button></code></pre>
<p>Aquí, los resultados devuelven directamente páginas PDF completas. No tenemos que preocuparnos de los 1024 patch embeddings subyacentes: Milvus se encarga de toda la agregación automáticamente.</p>
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
    </button></h2><p>La mayoría de las bases de datos vectoriales almacenan cada fragmento como un registro independiente, lo que significa que las aplicaciones tienen que volver a ensamblar esos fragmentos cuando necesitan un documento, producto o página completos. Una matriz de Structs cambia esta situación. Al combinar escalares, vectores, texto y otros campos en un único objeto estructurado, permite que una fila de la base de datos represente una entidad completa de extremo a extremo.</p>
<p>El resultado es sencillo pero potente: el trabajo que solía requerir agrupaciones complejas, deduplicación y reordenación en la capa de aplicación se convierte en una capacidad nativa de la base de datos. Y ahí es exactamente hacia donde se dirige el futuro de las bases de datos vectoriales: estructuras más ricas, recuperación más inteligente y canalizaciones más sencillas.</p>
<p>Para obtener más información sobre Array of Structs y MAX_SIM, consulte la documentación siguiente:</p>
<ul>
<li><a href="https://milvus.io/docs/array-of-structs.md">Array of Structs | Documentación de Milvus</a></li>
</ul>
<p>¿Tiene preguntas o desea una inmersión profunda en cualquier característica de la última Milvus? Únase a nuestro<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> o envíe problemas a<a href="https://github.com/milvus-io/milvus"> GitHub</a>. También puede reservar una sesión individual de 20 minutos para obtener información, orientación y respuestas a sus preguntas a través de<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
