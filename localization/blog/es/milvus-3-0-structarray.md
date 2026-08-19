---
id: milvus-3-0-structarray.md
title: >-
  Una Entidad, Muchos Vectores: Búsqueda a Nivel de Entidad y de Elemento con
  StructArray de Milvus 3.0
author: Chenjie Tang
date: 2026-8-19
cover: assets.zilliz.com/milvus_3_0_entity_and_element_level_search_28bba6d843.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus 3.0, StructArray, multi-vector search, EmbeddingList search,
  element-level search
meta_title: |
  Milvus 3.0 StructArray: Multi-Vector Search Within One Entity
desc: >-
  Una entidad puede contener múltiples vectores alineados y campos de metadatos,
  y Milvus puede buscar tanto la entidad completa como un elemento individual
  sin aplanar los datos en filas separadas.
origin: 'https://milvus.io/blog/milvus-3-0-structarray.md'
---
<p>La mayoría de los esquemas de bases de datos vectoriales parten de un supuesto simple: una entidad, una incrustación. Un producto obtiene un vector, al igual que un documento. Una consulta de usuario se incrusta y se compara con esos vectores mediante búsqueda de vecinos más cercanos aproximados (ANN). Este modelo funciona para la primera generación de casos de uso de búsqueda vectorial, incluidos RAG, búsqueda semántica y sistemas de recomendación.</p>
<p><strong>Sin embargo, los datos de IA del mundo real rara vez se ajustan a ese supuesto.</strong> Un video contiene clips, tomas o fotogramas clave, cada uno con su propia incrustación, rango de tiempo, subtítulo, etiqueta de escena y puntuación de confianza. Un producto puede tener varias imágenes y ángulos de visualización. Un documento largo contiene pasajes o secciones cuyo significado local importa más que una única incrustación de todo el documento. Los populares modelos de interacción tardía exponen la misma limitación a una granularidad aún más fina: ColBERT produce un vector por token, mientras que ColPali produce un vector por parche visual.</p>
<p>En cada caso, la entidad principal sigue siendo la unidad que la aplicación almacena, muestra, protege y devuelve. Sin embargo, la relevancia, el filtrado y la explicación de resultados a menudo dependen de elementos dentro de esa entidad.</p>
<p><strong>La nueva función StructArray le brinda a Milvus un modelo de datos nativo para esta forma: una entidad contiene un arreglo ordenado de elementos Struct definidos por el esquema, y cada elemento puede llevar metadatos escalares, incrustaciones vectoriales, o ambos.</strong> Milvus puede filtrar campos que pertenecen al mismo elemento, comparar dos listas de incrustaciones a nivel de entidad, o buscar elementos individuales y devolver el desplazamiento correspondiente.</p>
<p>Este artículo utiliza un ejemplo de búsqueda de videos para explicar el modelo de datos y luego lo recorre a través del diseño de esquema, el filtrado, las granularidades de búsqueda vectorial, las estrategias de índice EmbeddingList, la consolidación de resultados híbridos y el diseño físico que hace ejecutable la función.</p>
<h2 id="Why-one-vector-and-one-flat-row-model-are-no-longer-enough" class="common-anchor-header">Por qué un vector y un modelo de fila plana ya no son suficientes<button data-href="#Why-one-vector-and-one-flat-row-model-are-no-longer-enough" class="anchor-icon" translate="no">
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
    </button></h2><p>Considere un usuario que busca en un catálogo de videos "una persona cortando verduras en una cocina". La señal relevante puede estar en un clip de ocho segundos, no en una incrustación de todo el video. <strong>Comprimir cada clip, objeto y acción en un solo vector puede preservar el tema general, pero puede diluir los detalles locales.</strong></p>
<p>La misma discrepancia aparece en otras cargas de trabajo:</p>
<ul>
<li>La relevancia de un producto puede provenir de una de varias imágenes o ángulos.</li>
<li>Un documento puede coincidir por un pasaje en lugar de por su tema general.</li>
<li>La memoria de un agente puede contener varias observaciones, de las cuales solo una importa para la tarea actual.</li>
<li>Un registro ColBERT o ColPali contiene una lista de longitud variable de vectores de token o parche en lugar de un único vector denso.</li>
</ul>
<p>Una alternativa es dividir cada clip, imagen o pasaje en una fila de base de datos separada. Eso permite la búsqueda local, pero también separa cada fragmento de su entidad principal. Los metadatos de la entidad principal pueden repetirse en varias filas, y la recuperación a nivel de entidad requiere agrupación, deduplicación y reordenamiento después de la búsqueda de fragmentos.</p>
<p>El almacenamiento anidado por sí solo no resuelve el problema de consulta. JSON puede almacenar objetos, pero no le da a Milvus un esquema de subcampo predefinido para indexación vectorial y escalar. Los arreglos paralelos pueden almacenar subtítulos, etiquetas de escena y valores de confianza, pero la aplicación debe mantener la alineación de desplazamientos. La base de datos no puede inferir de manera segura que <code translate="no">scene_type[3]</code> y <code translate="no">label_confidence[3]</code> describen el mismo clip a menos que esa relación sea parte del modelo de datos.</p>
<p>StructArray codifica esa relación directamente. Mantiene los elementos locales dentro de la entidad principal mientras expone sus subcampos alineados a la validación de esquema, indexación, filtrado y búsqueda vectorial.</p>
<h2 id="What-is-StructArray-and-its-data-model" class="common-anchor-header">¿Qué es StructArray y su modelo de datos?<button data-href="#What-is-StructArray-and-its-data-model" class="anchor-icon" translate="no">
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
    </button></h2><p>Un StructArray, también conocido como arreglo de estructuras, almacena un conjunto ordenado de elementos Struct en cada entidad. Un campo StructArray es un <code translate="no">Array</code> cuyos elementos siguen todos un esquema <code translate="no">Struct</code> predefinido. Para una colección de videos, la forma lógica podría verse así:</p>
<pre><code translate="no">Plaintext
clips: ARRAY&lt;STRUCT&lt;
    clip_embedding_list: FLOAT_VECTOR,
    clip_embedding: FLOAT_VECTOR,
    start_sec: DOUBLE,
    end_sec: DOUBLE,
    caption: VARCHAR,
    scene_type: VARCHAR,
    label_confidence: FLOAT
&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Aquí:</p>
<ul>
<li><code translate="no">clips</code> es el campo StructArray principal.</li>
<li><code translate="no">clip_embedding_list</code>, <code translate="no">clip_embedding</code>, <code translate="no">start_sec</code> y los demás atributos son subcampos.</li>
<li><code translate="no">clips[0]</code> es el primer clip.</li>
<li>Cada subcampo en el desplazamiento <code translate="no">0</code> pertenece a ese mismo clip.</li>
<li>Cada subcampo en el desplazamiento <code translate="no">3</code> pertenece a otro clip.</li>
</ul>
<p>Los dos subcampos vectoriales sirven para diferentes modos de búsqueda. <code translate="no">clips[clip_embedding_list]</code> se indexa con una métrica <code translate="no">MAX_SIM*</code> para búsqueda EmbeddingList a nivel de entidad, mientras que <code translate="no">clips[clip_embedding]</code> se indexa con una métrica vectorial regular para búsqueda a nivel de elemento. Debido a que un campo vectorial o subcampo vectorial acepta solo un índice, una colección que necesite ambos modos debe definir e indexar los dos subcampos por separado.</p>
<p>Este modelo admite tres semánticas de consulta distintas.</p>
<h3 id="1-EmbeddingList-search-returns-parent-entities" class="common-anchor-header">1. La búsqueda EmbeddingList devuelve entidades principales</h3><p>Los vectores en <code translate="no">clips[clip_embedding_list]</code> forman una lista de incrustaciones para el video. La consulta también es un <code translate="no">EmbeddingList</code>. Milvus compara la lista de consulta con cada lista almacenada usando una métrica <code translate="no">MAX_SIM*</code> y devuelve un resultado a nivel de entidad.</p>
<pre><code translate="no">Plaintext
clips[clip_embedding_list] = [
    embedding_0,
    embedding_1,
    embedding_2,
    ...
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-The-MATCH-family-filters-parent-entities" class="common-anchor-header">2. La familia <code translate="no">MATCH_*</code> filtra entidades principales</h3><p><code translate="no">MATCH_ANY</code>, <code translate="no">MATCH_ALL</code>, <code translate="no">MATCH_LEAST</code>, <code translate="no">MATCH_MOST</code> y <code translate="no">MATCH_EXACT</code> evalúan un predicado contra los elementos Struct, cuentan cuántos elementos lo satisfacen y deciden si la entidad principal pasa el filtro.</p>
<p>Por ejemplo:</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">MATCH_ANY</span><span class="hljs-params">(clips, $[scene_type] == <span class="hljs-string">&quot;kitchen&quot;</span> &amp;&amp; $[label_confidence] &gt; <span class="hljs-number">0.8</span>)</span>
<button class="copy-code-btn"></button></code></pre>
<p>Ambas condiciones escalares deben ser verdaderas en el mismo desplazamiento de clip. Milvus no combina una etiqueta de cocina de un clip con un valor de alta confianza de otro.</p>
<h3 id="3-Element-level-search-returns-the-matching-element-offset" class="common-anchor-header">3. La búsqueda a nivel de elemento devuelve el desplazamiento del elemento coincidente</h3><p>Un vector de consulta regular puede buscar en cada vector de <code translate="no">clips[clip_embedding]</code> de forma independiente. Cada coincidencia identifica la entidad principal y el desplazamiento basado en cero del elemento Struct coincidente. Un <code translate="no">element_filter</code> puede restringir qué elementos participan en esa búsqueda vectorial.</p>
<p>Estas operaciones comparten una premisa: Milvus sabe qué valores vectoriales y escalares pertenecen al mismo elemento, y qué elementos pertenecen a la misma entidad.</p>
<p>StructArray no es un sistema de anidamiento arbitrario de propósito general. Su modelo actual es un <code translate="no">Array</code> de elementos <code translate="no">Struct</code> con subcampos escalares y vectoriales compatibles. Ese límite hace manejables la indexación de subcampos y la ejecución consciente de elementos.</p>
<h2 id="Build-the-schema-indexes-and-insert-path" class="common-anchor-header">Construya el esquema, los índices y la ruta de inserción<button data-href="#Build-the-schema-indexes-and-insert-path" class="anchor-icon" translate="no">
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
    </button></h2><p>El siguiente ejemplo simplificado de PyMilvus crea una colección de videos con un vector de nivel superior y un StructArray para clips. Utiliza subcampos vectoriales de clip separados para que la misma colección pueda demostrar ambos modos de búsqueda.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> DataType, MilvusClient

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

schema = client.create_schema(auto_id=<span class="hljs-literal">False</span>, enable_dynamic_field=<span class="hljs-literal">False</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;title&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;video_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)

<span class="hljs-comment"># Define the Struct schema explicitly.</span>
clip_schema = client.create_struct_field_schema()
clip_schema.add_field(<span class="hljs-string">&quot;clip_embedding_list&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)
clip_schema.add_field(<span class="hljs-string">&quot;clip_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)
clip_schema.add_field(<span class="hljs-string">&quot;start_sec&quot;</span>, DataType.DOUBLE)
clip_schema.add_field(<span class="hljs-string">&quot;end_sec&quot;</span>, DataType.DOUBLE)
clip_schema.add_field(<span class="hljs-string">&quot;caption&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">2048</span>)
clip_schema.add_field(<span class="hljs-string">&quot;scene_type&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">128</span>)
clip_schema.add_field(<span class="hljs-string">&quot;label_confidence&quot;</span>, DataType.FLOAT)

schema.add_field(
    <span class="hljs-string">&quot;clips&quot;</span>,
    datatype=DataType.ARRAY,
    element_type=DataType.STRUCT,
    struct_schema=clip_schema,
    max_capacity=<span class="hljs-number">1024</span>,
)

client.create_collection(<span class="hljs-string">&quot;videos&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p>Los subcampos vectoriales deben indexarse antes de la búsqueda. Debido a que la familia de métricas determina el modo de búsqueda, cada subcampo vectorial recibe su propio índice:</p>
<pre><code translate="no" class="language-python">index_params = client.prepare_index_params()

<span class="hljs-meta"># EmbeddingList search.</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;clips[clip_embedding_list]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
    index_name=<span class="hljs-string">&quot;clips_clip_embedding_list_maxsim_idx&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>},
)

<span class="hljs-meta"># Element-level search.</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    index_name=<span class="hljs-string">&quot;clips_clip_embedding_cosine_idx&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>},
)

client.create_index(<span class="hljs-string">&quot;videos&quot;</span>, index_params=index_params)
<button class="copy-code-btn"></button></code></pre>
<p>Los índices escalares son opcionales, pero los subcampos que aparecen con frecuencia en filtros a gran escala deberían usar un índice escalar compatible. Por ejemplo, <code translate="no">clips[scene_type]</code> puede usar un índice invertido, mientras que un subcampo numérico como <code translate="no">clips[label_confidence]</code> puede usar un índice adecuado para filtrado numérico.</p>
<p>Inserte datos en su forma natural de entidad: una fila de video con un arreglo de objetos de clip. Para mantener el ejemplo compacto, escribe el mismo vector de clip en ambos subcampos vectoriales.</p>
<pre><code translate="no" class="language-python">rows = [
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;cooking tutorial&quot;</span>,
        <span class="hljs-string">&quot;video_embedding&quot;</span>: video_vec,
        <span class="hljs-string">&quot;clips&quot;</span>: [
            {
                <span class="hljs-string">&quot;clip_embedding_list&quot;</span>: clip_vec_1,
                <span class="hljs-string">&quot;clip_embedding&quot;</span>: clip_vec_1,
                <span class="hljs-string">&quot;start_sec&quot;</span>: <span class="hljs-number">0.0</span>,
                <span class="hljs-string">&quot;end_sec&quot;</span>: <span class="hljs-number">8.0</span>,
                <span class="hljs-string">&quot;caption&quot;</span>: <span class="hljs-string">&quot;A person washes vegetables.&quot;</span>,
                <span class="hljs-string">&quot;scene_type&quot;</span>: <span class="hljs-string">&quot;kitchen&quot;</span>,
                <span class="hljs-string">&quot;label_confidence&quot;</span>: <span class="hljs-number">0.92</span>,
            },
            {
                <span class="hljs-string">&quot;clip_embedding_list&quot;</span>: clip_vec_2,
                <span class="hljs-string">&quot;clip_embedding&quot;</span>: clip_vec_2,
                <span class="hljs-string">&quot;start_sec&quot;</span>: <span class="hljs-number">8.0</span>,
                <span class="hljs-string">&quot;end_sec&quot;</span>: <span class="hljs-number">16.0</span>,
                <span class="hljs-string">&quot;caption&quot;</span>: <span class="hljs-string">&quot;A person cuts carrots on a board.&quot;</span>,
                <span class="hljs-string">&quot;scene_type&quot;</span>: <span class="hljs-string">&quot;kitchen&quot;</span>,
                <span class="hljs-string">&quot;label_confidence&quot;</span>: <span class="hljs-number">0.96</span>,
            },
        ],
    }
]

client.<span class="hljs-title function_">insert</span>(<span class="hljs-string">&quot;videos&quot;</span>, rows)
client.<span class="hljs-title function_">flush</span>(<span class="hljs-string">&quot;videos&quot;</span>)
client.<span class="hljs-title function_">load_collection</span>(<span class="hljs-string">&quot;videos&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>En el límite de la API, <code translate="no">clips</code> sigue siendo un arreglo de objetos estructurados. Dentro de Milvus, cada subcampo sigue la ruta tipada requerida para su propio índice, filtro y comportamiento de salida. Esa distinción es transparente en el momento de la inserción, pero fundamental para todo lo que sigue.</p>
<h2 id="Same-element-filtering-is-the-difference-between-structure-and-parallel-arrays" class="common-anchor-header">El filtrado de mismo elemento es la diferencia entre estructura y arreglos paralelos<button data-href="#Same-element-filtering-is-the-difference-between-structure-and-parallel-arrays" class="anchor-icon" translate="no">
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
    </button></h2><p>El principal beneficio del filtrado no es una sintaxis más corta para campos anidados. Es la correlación correcta entre subcampos escalares.</p>
<p>Supongamos que la aplicación necesita videos que contengan un clip de cocina con confianza de etiqueta superior a <code translate="no">0.8</code>. No es suficiente que un video contenga algún clip de cocina y algún clip de alta confianza; el mismo clip debe satisfacer ambas condiciones.</p>
<p>La familia <code translate="no">MATCH_*</code> de StructArray expresa esto directamente:</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">MATCH_ANY</span><span class="hljs-params">(clips, $[scene_type] == <span class="hljs-string">&quot;kitchen&quot;</span> &amp;&amp; $[label_confidence] &gt; <span class="hljs-number">0.8</span>)</span>
MATCH_ALL(clips, $[label_confidence] &gt; <span class="hljs-number">0.5</span>)
MATCH_LEAST(clips, $[scene_type] == <span class="hljs-string">&quot;sports&quot;</span>, threshold=<span class="hljs-number">3</span>)
MATCH_MOST(clips, $[label_confidence] &lt; <span class="hljs-number">0.2</span>, threshold=<span class="hljs-number">1</span>)
MATCH_EXACT(clips, $[scene_type] == <span class="hljs-string">&quot;intro&quot;</span>, threshold=<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus evalúa el predicado en cada desplazamiento de elemento y luego aplica el cuantificador del operador para decidir si la entidad principal pasa:</p>
<ul>
<li><code translate="no">MATCH_ANY</code>: Al menos un elemento coincide.</li>
<li><code translate="no">MATCH_ALL</code>: Todos los elementos coinciden.</li>
<li><code translate="no">MATCH_LEAST</code>: Al menos <code translate="no">threshold</code> elementos coinciden.</li>
<li><code translate="no">MATCH_MOST</code>: Como máximo <code translate="no">threshold</code> elementos coinciden.</li>
<li><code translate="no">MATCH_EXACT</code>: Exactamente <code translate="no">threshold</code> elementos coinciden.</li>
</ul>
<p>Si los mismos datos se almacenaran como dos arreglos independientes, la siguiente expresión no preservaría esa correlación:</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">array_contains</span><span class="hljs-params">(clips[scene_type], <span class="hljs-string">&quot;kitchen&quot;</span>)</span>
AND
<span class="hljs-title function_">array_contains</span><span class="hljs-params">(clips[label_confidence], <span class="hljs-number">0.9</span>)</span>
<button class="copy-code-btn"></button></code></pre>
<p>Los dos valores podrían ocurrir en desplazamientos diferentes. Eso puede ser válido para atributos no relacionados, pero es incorrecto cuando ambas condiciones describen el mismo clip, imagen de producto o pasaje de documento.</p>
<p>StructArray hace que la identidad del elemento sea parte del predicado de la base de datos, en lugar de una convención que la aplicación debe imponer.</p>
<h2 id="Two-vector-search-granularities-two-result-identities" class="common-anchor-header">Dos granularidades de búsqueda vectorial, dos identidades de resultado<button data-href="#Two-vector-search-granularities-two-result-identities" class="anchor-icon" translate="no">
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
    </button></h2><p>Una vez que una entidad almacena múltiples vectores, la recuperación debe resolver una cuestión de modelado antes de que comience la búsqueda ANN:</p>
<p><strong>¿Deben puntuarse los vectores juntos como una representación de la entidad principal, o debe competir cada vector de elemento de forma independiente?</strong></p>
<p>StructArray admite ambos modelos, pero utilizan diferentes formas de consulta, familias de métricas, subcampos vectoriales e identidades de resultado.</p>
<h3 id="EmbeddingList-search-a-list-of-query-vectors-finds-an-entity" class="common-anchor-header">Búsqueda EmbeddingList: una lista de vectores de consulta encuentra una entidad</h3><p>Una consulta <code translate="no">EmbeddingList</code> contiene múltiples vectores. Un video de consulta podría dividirse en varios clips; una consulta de producto podría contener varias imágenes de referencia; una consulta ColBERT contiene un vector por token de consulta.</p>
<p>Para cada entidad, Milvus compara la lista de consulta con la lista de incrustaciones almacenada de la entidad. Bajo la puntuación estilo MaxSim, cada vector de consulta selecciona su mejor coincidencia en la lista de la entidad, y Milvus agrega esas puntuaciones de mejor coincidencia en una puntuación de entidad. La coincidencia final representa la entidad principal, no un elemento Struct particular.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus.client.embedding_list import EmbeddingList

query = EmbeddingList()
query.<span class="hljs-keyword">add</span>(query_clip_vec_1)
query.<span class="hljs-keyword">add</span>(query_clip_vec_2)

client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding_list]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>},
    limit=<span class="hljs-number">10</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Esta búsqueda responde: <strong>¿Qué videos son la mejor coincidencia general para este conjunto de clips de consulta?</strong></p>
<p>Se ajusta a la recuperación video-a-video, la búsqueda de productos con múltiples imágenes, la recuperación estilo ColBERT y ColPali, y otros casos donde tanto la consulta como la entidad almacenada están representadas por múltiples vectores.</p>
<h3 id="Element-level-search-one-query-vector-finds-a-clip-inside-an-entity" class="common-anchor-header">Búsqueda a nivel de elemento: un vector de consulta encuentra un clip dentro de una entidad</h3><p>La búsqueda a nivel de elemento utiliza un vector de consulta regular. Cada vector en <code translate="no">clips[clip_embedding]</code> participa en la búsqueda ANN como un candidato independiente. Cada coincidencia identifica la entidad principal y el desplazamiento del elemento coincidente.</p>
<pre><code translate="no" class="language-python">client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    <span class="hljs-built_in">limit</span>=10,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;clips&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Para buscar solo clips seleccionados, adjunte un <code translate="no">element_filter</code> cuyas condiciones escalares se apliquen al mismo clip:</p>
<pre><code translate="no" class="language-python">client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;element_filter(clips, $[scene_type] == &quot;kitchen&quot; &amp;&amp; $[label_confidence] &gt; 0.8)&#x27;</span>,
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;clips&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>El filtro no selecciona primero un clip de cocina y luego busca un clip de alta confianza diferente. Tanto los predicados como el candidato vectorial se refieren al mismo elemento Struct.</p>
<p>Una respuesta sin agrupar podría verse así:</p>
<pre><code translate="no">Plaintext
<span class="hljs-built_in">id</span> = <span class="hljs-number">1</span>, offset = <span class="hljs-number">1</span>, distance = <span class="hljs-number">0.91</span>
<span class="hljs-built_in">id</span> = <span class="hljs-number">8</span>, offset = <span class="hljs-number">4</span>, distance = <span class="hljs-number">0.88</span>
<span class="hljs-built_in">id</span> = <span class="hljs-number">1</span>, offset = <span class="hljs-number">3</span>, distance = <span class="hljs-number">0.84</span>
<button class="copy-code-btn"></button></code></pre>
<p>La misma entidad puede aparecer más de una vez porque varios clips pueden coincidir. Eso es útil cuando la aplicación necesita mostrar no solo qué video o documento es relevante, sino también qué clip o pasaje produjo la coincidencia.</p>
<table>
<thead>
<tr><th>Aspecto</th><th>Búsqueda EmbeddingList</th><th>Búsqueda a nivel de elemento</th></tr>
</thead>
<tbody>
<tr><td>Entrada de consulta</td><td>Uno o más vectores de consulta en un <code translate="no">EmbeddingList</code></td><td>Un vector de consulta regular</td></tr>
<tr><td>Ejemplo de objetivo</td><td><code translate="no">clips[clip_embedding_list]</code></td><td><code translate="no">clips[clip_embedding]</code></td></tr>
<tr><td>Familia de métricas</td><td><code translate="no">MAX_SIM*</code></td><td>Métricas regulares como <code translate="no">COSINE</code>, <code translate="no">IP</code> o <code translate="no">L2</code></td></tr>
<tr><td>Unidad candidata ANN</td><td>La lista de incrustaciones de la entidad principal</td><td>Cada vector de elemento Struct</td></tr>
<tr><td>Identidad del resultado</td><td>Entidad principal</td><td>Entidad principal más desplazamiento de elemento</td></tr>
<tr><td>Caso de uso típico</td><td>Comparar una consulta multi-vector contra una entidad multi-vector</td><td>Encontrar el clip, imagen, pasaje, parche o hecho más relevante</td></tr>
</tbody>
</table>
<p>Para admitir ambos modos en una sola colección, defina e indexe subcampos vectoriales separados. La forma de consulta, la familia de métricas y el índice objetivo deben coincidir.</p>
<h2 id="EmbeddingList-indexing-is-a-quality-cost-decision" class="common-anchor-header">La indexación EmbeddingList es una decisión de calidad-costo<button data-href="#EmbeddingList-indexing-is-a-quality-cost-decision" class="anchor-icon" translate="no">
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
    </button></h2><p>Con una incrustación por entidad, un índice ANN encuentra entidades cercanas a un vector de consulta. La búsqueda EmbeddingList es más costosa porque la relevancia depende de interacciones por pares entre dos listas de vectores.</p>
<p>Calcular MaxSim exacto contra cada vector en cada entidad produce la clasificación de referencia más limpia, pero un escaneo completo suele ser demasiado costoso para la recuperación en línea. Por lo tanto, Milvus utiliza un modelo de dos etapas:</p>
<ol>
<li>Una estrategia aproximada recupera entidades principales candidatas.</li>
<li>Cuando <code translate="no">emb_list_rerank</code> está habilitado, Milvus recalcula MaxSim sobre esos candidatos para producir la clasificación final.</li>
</ol>
<p>Recuperar más candidatos de primera etapa generalmente mejora la probabilidad de que los verdaderos mejores resultados lleguen al reclasificador, pero también aumenta la latencia y el cómputo. Las tres estrategias difieren principalmente en cómo producen ese conjunto de candidatos.</p>
<table>
<thead>
<tr><th>Estrategia</th><th>Representación candidata de primera etapa</th><th>Buen punto de partida cuando</th><th>Compensación principal</th></tr>
</thead>
<tbody>
<tr><td>TokenANN</td><td>Indexa cada vector en cada lista de incrustaciones. Los vectores de consulta ejecutan ANN de forma independiente; las coincidencias se agregan de vuelta a las entidades principales antes del reclasificación MaxSim.</td><td>La calidad es la prioridad, las listas son cortas o medianas, y los vectores individuales son discriminativos.</td><td>El tamaño del índice y el trabajo de búsqueda de primera etapa crecen con la longitud de la lista y el número de vectores de consulta.</td></tr>
<tr><td>MUVERA</td><td>Codifica cada lista de incrustaciones en un vector de dimensión fija mediante proyecciones aleatorias, luego ejecuta ANN ordinario.</td><td>TokenANN es demasiado pesado y se prefiere compresión sin un pipeline de entrenamiento.</td><td>La codificación pierde información; configuraciones de proyección más fuertes aumentan la dimensionalidad codificada y el costo ANN.</td></tr>
<tr><td>LEMUR</td><td>Entrena un modelo que mapea una lista de incrustaciones a un vector de entidad principal de dimensión fija.</td><td>Las incrustaciones son menos discriminativas, las listas son grandes, o la carga de trabajo es visual o multimodal.</td><td>Requiere entrenamiento y puede ser sensible a la distribución del corpus y al sesgo de longitud de documento.</td></tr>
</tbody>
</table>
<p>Ninguna estrategia es la mejor para cada carga de trabajo. Comience con los datos objetivo y la distribución de consultas:</p>
<ul>
<li>Use TokenANN como referencia de calidad primero cuando el tamaño del conjunto de datos lo permita.</li>
<li>Pruebe MUVERA cuando el índice de TokenANN o la recuperación de candidatos se vuelva demasiado costosa a medida que crece la longitud de la lista, y quiera evitar un pipeline de entrenamiento.</li>
<li>Evalúe LEMUR cuando el espacio de incrustaciones sea ruidoso o débilmente discriminativo, o cuando la carga de trabajo sea visual o multimodal.</li>
<li>Mida recall o nDCG junto con latencia y tamaño de índice. Una estrategia que funciona para texto corto puede comportarse de manera diferente con longitudes de documento de cola larga o miles de parches visuales.</li>
</ul>
<p>StructArray aborda un problema: cómo representar elementos alineados, filtrables y portadores de vectores dentro de una sola entidad. La estrategia EmbeddingList aborda otro: cómo aproximar MaxSim a un costo aceptable para un modelo y corpus particulares.</p>
<h2 id="Hybrid-search-makes-result-identity-explicit" class="common-anchor-header">La búsqueda híbrida hace explícita la identidad del resultado<button data-href="#Hybrid-search-makes-result-identity-explicit" class="anchor-icon" translate="no">
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
    </button></h2><p>La recuperación en producción rara vez sigue una única ruta vectorial. Una solicitud de video puede combinar una incrustación de video de nivel superior, una o más incrustaciones a nivel de clip, una señal de subtítulo o transcripción, y un reclasificador.</p>
<p>Una vez que los candidatos a nivel de elemento ingresan a ese pipeline, el motor debe decidir qué identifica a un candidato final.</p>
<table>
<thead>
<tr><th>Composición de solicitud híbrida</th><th>Alcance del candidato final</th><th>Identidad del resultado</th></tr>
</thead>
<tbody>
<tr><td>Todas las sub-búsquedas son a nivel de elemento y apuntan a subcampos vectoriales bajo el mismo StructArray</td><td>Nivel de elemento</td><td>Clave primaria más campo StructArray más desplazamiento de elemento</td></tr>
<tr><td>Se incluye un campo vectorial de nivel superior</td><td>Nivel de entidad</td><td>Clave primaria</td></tr>
<tr><td>Se incluye una solicitud EmbeddingList</td><td>Nivel de entidad</td><td>Clave primaria</td></tr>
<tr><td>Las solicitudes a nivel de elemento apuntan a diferentes campos StructArray</td><td>Nivel de entidad</td><td>Clave primaria</td></tr>
</tbody>
</table>
<p>La primera configuración preserva la identidad del elemento porque el desplazamiento <code translate="no">3</code> se refiere al mismo elemento Struct para cada sub-búsqueda bajo un StructArray principal dado. Esto se ajusta a una aplicación que quiere devolver el clip o pasaje más relevante después de fusionar varias señales a nivel de elemento.</p>
<p>Las otras configuraciones mezclan granularidades de candidatos o espacios de nombres de elementos. Por lo tanto, una coincidencia de elemento debe consolidarse en una puntuación a nivel de entidad antes del reclasificación final. Milvus admite varias estrategias de consolidación:</p>
<table>
<thead>
<tr><th>Estrategia de consolidación</th><th>Puntuación de entidad a partir de las coincidencias de elemento devueltas</th><th>Condición importante</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">max</code></td><td>Mejor puntuación de elemento</td><td>Funciona con métricas vectoriales regulares compatibles</td></tr>
<tr><td><code translate="no">sum</code></td><td>Suma de todas las puntuaciones de elemento devueltas</td><td>Use con métricas de correlación positiva como <code translate="no">IP</code> o <code translate="no">COSINE</code></td></tr>
<tr><td><code translate="no">avg</code></td><td>Promedio de las puntuaciones de elemento devueltas</td><td>Funciona con métricas vectoriales regulares compatibles</td></tr>
<tr><td><code translate="no">topk_sum</code></td><td>Suma de las mejores <code translate="no">K</code> puntuaciones de elemento devueltas</td><td>Requiere un <code translate="no">topk</code> positivo; use con <code translate="no">IP</code> o <code translate="no">COSINE</code></td></tr>
<tr><td><code translate="no">topk_avg</code></td><td>Promedio de las mejores <code translate="no">K</code> puntuaciones de elemento devueltas</td><td>Requiere un <code translate="no">topk</code> positivo</td></tr>
</tbody>
</table>
<p>La consolidación opera solo sobre las coincidencias de elemento devueltas por esa sub-búsqueda ANN; no escanea cada elemento de la entidad después de la recuperación. Por lo tanto, el <code translate="no">limit</code> de la solicitud controla qué coincidencias de elemento están disponibles para la función de consolidación.</p>
<p>Esta elección da forma a la semántica de recuperación, no solo al formato de salida. Si la aplicación presenta un clip o pasaje, preservar el desplazamiento a través de la fusión es natural. Si presenta un video, producto o documento, la consolidación a nivel de entidad es natural. Cuando las señales operan a diferentes granularidades, el sistema necesita una regla explícita de puntuación de elemento a entidad.</p>
<p>StructArray mueve ese problema de identidad-y-consolidación del posprocesamiento ad hoc al modelo de ejecución de búsqueda.</p>
<h2 id="How-Milvus-executes-StructArray-without-treating-it-as-a-blob" class="common-anchor-header">Cómo ejecuta Milvus StructArray sin tratarlo como un blob<button data-href="#How-Milvus-executes-StructArray-without-treating-it-as-a-blob" class="anchor-icon" translate="no">
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
    </button></h2><p>El modelo orientado al usuario es <code translate="no">ARRAY&lt;STRUCT&gt;</code>. Sin embargo, almacenar todo el valor como un solo blob opaco haría ineficientes los índices de subcampos, los filtros y la salida selectiva.</p>
<p>Milvus utiliza un diseño de padre lógico, columnas hijas físicas.</p>
<p>En la capa de esquema, <code translate="no">clips</code> es el campo padre lógico. Define propiedades como el esquema Struct, la capacidad máxima y la anulabilidad. Sus subcampos se normalizan en rutas como <code translate="no">clips[clip_embedding_list]</code>, <code translate="no">clips[clip_embedding]</code>, <code translate="no">clips[scene_type]</code> y <code translate="no">clips[label_confidence]</code>.</p>
<p>Los subcampos escalares siguen rutas de almacenamiento de arreglos escalares por entidad, mientras que los subcampos vectoriales siguen rutas de arreglos vectoriales. Cada subcampo puede entonces usar la ruta de datos apropiada para su tipo: filtrado escalar e índices escalares para metadatos, e índices vectoriales y búsqueda ANN para incrustaciones.</p>
<p>En la ingesta, el Proxy expande la lista Struct anidada en columnas hijas tipadas. Durante la ejecución, Milvus mantiene la relación entre cada elemento físico y su entidad principal. Conceptualmente, esa relación se ve así:</p>
<pre><code translate="no">Plaintext
entity 0 -&gt; elements [0, 1, 2]
entity 1 -&gt; elements [3]
entity 2 -&gt; elements []
entity 3 -&gt; elements [4, 5, 6, 7]
<button class="copy-code-btn"></button></code></pre>
<p>Cuando la búsqueda a nivel de elemento devuelve un ID de elemento físico, Milvus lo mapea de vuelta a la entidad principal y al desplazamiento del elemento. Cuando <code translate="no">element_filter</code> produce un mapa de bits a nivel de elemento, el motor lo alinea con la visibilidad de la entidad principal, las eliminaciones y otros filtros.</p>
<p>Al devolver resultados, Milvus utiliza el esquema lógico y los desplazamientos compartidos para reconstruir la forma StructArray que la aplicación insertó. El sistema puede ejecutar sobre columnas hijas tipadas mientras el usuario continúa leyendo y escribiendo objetos anidados naturales. Este diseño físico hace que StructArray sea más que JSON tipado: la relación anidada participa en el modelo de índice y ejecución.</p>
<h2 id="Where-StructArray-fits-and-where-it-does-not" class="common-anchor-header">Dónde encaja StructArray y dónde no<button data-href="#Where-StructArray-fits-and-where-it-does-not" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArray es un gran ajuste cuando todas las siguientes condiciones son verdaderas:</p>
<ul>
<li>La aplicación tiene una entidad principal significativa, como un video, producto, documento, página visual o registro de memoria.</li>
<li>Cada entidad principal contiene un conjunto ordenado y de longitud variable de elementos locales.</li>
<li>Esos elementos necesitan sus propios metadatos escalares, vectores, o ambos.</li>
<li>La búsqueda o el filtrado deben preservar la relación entre subcampos en el mismo desplazamiento de elemento.</li>
<li>La aplicación necesita recuperación multi-vector a nivel de entidad, coincidencias a nivel de elemento, o ambas.</li>
</ul>
<p>StructArray no es automáticamente mejor para cada colección. Un documento corto o una consulta simple pueden ser bien atendidos por una única incrustación densa. La indexación multi-vector agrega costos de almacenamiento y búsqueda, por lo que la representación adicional debe ganarse su lugar mediante una mejor calidad de recuperación o una granularidad de resultados más útil.</p>
<p>Los límites actuales del esquema y la ejecución también importan:</p>
<ul>
<li><code translate="no">Struct</code> se admite como tipo de elemento de un <code translate="no">Array</code>, no como campo de colección de nivel superior.</li>
<li>Todos los elementos en un StructArray comparten un esquema predefinido.</li>
<li><code translate="no">max_capacity</code> es obligatorio y limita el número de elementos por entidad.</li>
<li>Los subcampos <code translate="no">Struct</code>, <code translate="no">Array</code>, <code translate="no">ArrayOfStruct</code> y <code translate="no">JSON</code> anidados no se admiten dentro de un StructArray.</li>
<li>Un subcampo vectorial acepta un índice. Use subcampos vectoriales separados para búsqueda EmbeddingList y a nivel de elemento cuando se requieran ambos.</li>
<li>Los subcampos vectoriales deben indexarse antes de la búsqueda. Los subcampos escalares muy utilizados en filtros deben indexarse apropiadamente.</li>
<li>El esquema de subcampos es fijo después de crear el campo StructArray, así que planifique los atributos de los elementos antes del lanzamiento de producción.</li>
</ul>
<p>Estas restricciones hacen que el modelo sea más estrecho que el anidamiento arbitrario de una base de datos documental, pero también le dan a Milvus suficiente estructura para razonar sobre la identidad de los elementos, indexar cada subcampo y ejecutar en dos granularidades de búsqueda.</p>
<h2 id="StructArray-keeps-local-evidence-first-class-without-losing-the-entity" class="common-anchor-header">StructArray mantiene la evidencia local como ciudadano de primera clase sin perder la entidad<button data-href="#StructArray-keeps-local-evidence-first-class-without-losing-the-entity" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArray le da a Milvus un objeto de recuperación que los esquemas planos luchan por representar: una entidad principal con un conjunto ordenado de elementos estructurados. Las relaciones entre esos elementos participan en el filtrado, la indexación y la búsqueda, en lugar de existir solo en el almacenamiento.</p>
<p>Cada elemento conserva sus propios metadatos e incrustaciones. Los elementos pueden satisfacer predicados escalares de mismo elemento, participar juntos en la búsqueda EmbeddingList a nivel de entidad, o competir independientemente en la búsqueda a nivel de elemento. Al mismo tiempo, permanecen adjuntos a la entidad principal cuyos metadatos, permisos e identidad de aplicación les dan contexto.</p>
<p>Para clips de video, imágenes de producto, pasajes de documento, parches visuales y fragmentos de memoria, la evidencia local puede buscarse y filtrarse sin perder la entidad a la que pertenece. Las decisiones de diseño restantes son explícitas: seleccione la granularidad de búsqueda, asigne a cada subcampo vectorial la métrica e índice correspondientes, y decida si los resultados híbridos deben preservar los desplazamientos de elemento o consolidarse de vuelta a entidades.</p>
<h2 id="Try-StructArray-in-Milvus-30" class="common-anchor-header">Pruebe StructArray en Milvus 3.0<button data-href="#Try-StructArray-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArray está disponible en Milvus 3.0. Comience con la <a href="https://milvus.io/docs/array-of-structs.md">descripción general de StructArray</a>. Si está evaluando la recuperación multi-vector a nivel de entidad, lea la <a href="https://milvus.io/docs/choose-an-embeddinglist-search-strategy.md">guía de estrategias EmbeddingList</a>. Para conocer la granularidad de resultados y el comportamiento de consolidación, consulte <a href="https://milvus.io/docs/hybrid-search-with-structarray.md">Búsqueda híbrida con StructArray</a>.</p>
<p>Para obtener un contexto más amplio del lanzamiento, consulte el <a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">blog de lanzamiento de Milvus 3.0</a>, las <a href="https://milvus.io/docs/release_notes.md">notas de versión</a> y el <a href="https://github.com/milvus-io/milvus">repositorio milvus-io/milvus</a>.</p>
<p><a href="https://zilliz.com/">Zilliz Cloud</a> también admite StructArray y búsqueda EmbeddingList para implementaciones administradas. Revise la <a href="https://docs.zilliz.com/docs/use-array-of-structs">guía de StructArray de Zilliz Cloud</a> para conocer los límites específicos del servicio. En Zilliz Cloud, los operadores escalares en StructArray están documentados actualmente para clústeres On-Demand.</p>
<p>Para discutir un diseño de esquema o recuperación con el equipo, únase a la <a href="https://discord.com/invite/8uyFbECzPX">comunidad de Discord de Milvus</a> o reserve una sesión de <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting">Milvus Office Hours</a>.</p>
