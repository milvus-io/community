---
id: >-
  announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md
title: >-
  Presentamos Milvus 3.0: búsqueda vectorial nativa de lake y un motor de
  recuperación más potente
author: Fendy Feng and Li Liu
date: 2026-7-27
cover: assets.zilliz.com/cover_of_milvus_3_0_6fab4ba929.jpg
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus 3.0, lake-native vector search, vector database, External Collections,
  AI retrieval engine
meta_title: |
  Milvus 3.0: Lake-Native Vector Search & Retrieval Engine
desc: >-
  Descubre la búsqueda vectorial lake-native de Milvus 3.0, las colecciones
  externas de copia cero, la recuperación dispersa más rápida, las instantáneas,
  la integración con Spark y las capacidades avanzadas de ranking.
origin: >-
  https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md
---
<p>Hoy lanzamos Milvus 3.0, un hito arquitectónico importante para el proyecto. Cambia tanto dónde Milvus puede crear y servir índices como cuánto trabajo de recuperación puede realizarse directamente dentro del motor.</p>
<ul>
<li>Milvus 3.0 introduce <strong>una ruta nativa del lago</strong> para indexar datos vectoriales que residen en almacenamiento de objetos y formatos de tabla abiertos, incluidos Parquet, Lance, Iceberg y Vortex. Los equipos pueden hacer que los datos residentes en el lago sean buscables sin mantener otra copia en una base de datos vectorial.</li>
<li><strong>Esta versión también expande Milvus más allá de la recuperación inicial de candidatos.</strong> La ordenación del lado del servidor, la agregación, la búsqueda facetada, StructArray para estructuras anidadas de documento/fragmento y vectores ColBERT, y un índice disperso rediseñado trasladan más clasificación, agrupación y procesamiento de resultados fuera del código de la aplicación y dentro del motor de recuperación.</li>
</ul>
<p>En conjunto, estos avances convierten a Milvus en la base de código abierto para la recuperación de IA en producción y para arquitecturas <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Vector Lakebase</a> que combinan almacenamiento nativo del lago con recuperación vectorial de alto rendimiento.</p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/SAm4YfrO1ok?si=xzgw5RjRTwaHWYxO" title="Reproductor de video de YouTube" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="A-quick-glance-at-the-Milvus-30-feature-set" class="common-anchor-header">Un vistazo rápido al conjunto de características de Milvus 3.0<button data-href="#A-quick-glance-at-the-Milvus-30-feature-set" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th><strong>Área</strong></th><th><strong>Características</strong></th><th><strong>Por qué importa</strong></th></tr>
</thead>
<tbody>
<tr><td>Recuperación nativa del lago</td><td>Colecciones externas sobre Parquet, Lance, Iceberg y Vortex</td><td>Buscar datos residentes en el lago sin mantener una segunda copia de servicio</td></tr>
<tr><td>Almacenamiento basado en S3</td><td>Loon (Storage v3)</td><td>Reducir la amplificación de lecturas puntuales para acceso de tipo servicio y admitir la evolución del esquema</td></tr>
<tr><td>Flujos de trabajo offline/por lotes y recuperación</td><td>Snapshots, Spark DataSource V2 y evolución de esquemas en línea</td><td>Llevar vistas estables de colecciones a canalizaciones de evaluación, deduplicación, clustering y características</td></tr>
<tr><td>Motor de recuperación</td><td>ORDER BY, agregación, facetas, StructArray y recuperación dispersa mejorada</td><td>Trasladar más procesamiento de resultados y puntuación multivectorial a Milvus</td></tr>
<tr><td>Modelo de datos y operaciones</td><td>Vectores anulables, TEXT LOB, TTL, MinHash, Woodpecker y ForceMerge</td><td>Admitir modelos de datos más ricos y patrones operativos de producción</td></tr>
</tbody>
</table>
<h2 id="The-lake-native-infrastructure-index-and-serve-data-where-it-already-lives" class="common-anchor-header">La infraestructura nativa del lago: indexar y servir datos donde ya residen<button data-href="#The-lake-native-infrastructure-index-and-serve-data-where-it-already-lives" class="anchor-icon" translate="no">
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
    </button></h2><p>El mayor cambio arquitectónico en Milvus 3.0 es dónde el sistema puede crear y servir índices. Los datos vectoriales pueden permanecer en formatos abiertos en almacenamiento de objetos mientras Milvus proporciona indexación, recuperación y API de nivel de producción.</p>
<h3 id="1-External-Collections-indexing-directly-on-lake-resident-data" class="common-anchor-header">1. External Collections: indexación directamente sobre datos residentes en el lago</h3><p>Muchos equipos ya almacenan embeddings en un lago de datos: tablas Lance, tablas Iceberg, archivos Parquet u otros conjuntos de datos de formato abierto en S3, GCS o Azure Blob Storage. Antes de Milvus 3.0, normalmente había dos opciones para buscar en esos datos.</p>
<ul>
<li>Copiar los embeddings en una base de datos vectorial. Esto proporciona búsqueda de baja latencia, pero crea una segunda copia y una canalización ETL que debe permanecer sincronizada.</li>
<li>Consultar el lago directamente. Esto evita la duplicación, pero sin índices ANN, la búsqueda vectorial se convierte en un escaneo de fuerza bruta que no puede cumplir la latencia de producción.</li>
</ul>
<p><strong>External Collections introduce una tercera ruta.</strong> Define una colección de Milvus sobre datos que permanecen en almacenamiento de objetos, asigna campos externos a un esquema de Milvus y usa las mismas API de búsqueda y consulta que una colección nativa. Los archivos de origen no se mueven; Milvus crea y sirve índices vectoriales, invertidos BM25, JSON y escalares sobre los datos externos.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_1_c1fb7ab16e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>External Collections son de solo lectura y zero-copy</strong>, lo que las hace útiles cuando la gobernanza, los límites de propiedad o el costo operativo requieren que el conjunto de datos de origen permanezca en el lago.</p>
<p>Cuando el conjunto de datos externo cambia, Milvus lee su manifiesto de almacenamiento e indexa los fragmentos recién añadidos en lugar de reconstruir toda la colección. Un modo de carga a nivel de colección también permite a los equipos elegir cuántos datos mantener localmente:</p>
<table>
<thead>
<tr><th><strong>Modo de carga</strong></th><th><strong>Comportamiento</strong></th><th><strong>Ideal para</strong></th></tr>
</thead>
<tbody>
<tr><td>Take</td><td>Leer desde almacenamiento de objetos en cada consulta</td><td>Menor costo de almacenamiento; cargas de trabajo menos sensibles a la latencia</td></tr>
<tr><td>LazyLoad</td><td>Almacenar en caché los datos en el primer acceso</td><td>Cargas de trabajo mixtas donde los datos calientes emergen con el tiempo</td></tr>
<tr><td>Load</td><td>Mantener los datos residentes</td><td>Servicio de menor latencia</td></tr>
</tbody>
</table>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># register a lake table as a zero-copy Collection</span>
client.create_collection(
  name=<span class="hljs-string">&quot;docs&quot;</span>,
  external_source={<span class="hljs-string">&quot;format&quot;</span>: <span class="hljs-string">&quot;iceberg&quot;</span>,  <span class="hljs-comment"># iceberg|lance|parquet|vortex</span>
                   <span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;s3://lake/docs&quot;</span>},
  schema=[
    Field(<span class="hljs-string">&quot;id&quot;</span>,  INT64, primary=<span class="hljs-literal">True</span>, external_field=<span class="hljs-string">&quot;doc_id&quot;</span>),
    Field(<span class="hljs-string">&quot;emb&quot;</span>, FLOAT_VECTOR, dim=<span class="hljs-number">1024</span>, external_field=<span class="hljs-string">&quot;embedding&quot;</span>),
    Field(<span class="hljs-string">&quot;title&quot;</span>, VARCHAR, external_field=<span class="hljs-string">&quot;title&quot;</span>)])

client.create_index(<span class="hljs-string">&quot;docs&quot;</span>, <span class="hljs-string">&quot;emb&quot;</span>, {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;HNSW&quot;</span>})  <span class="hljs-comment"># in place</span>
client.load(<span class="hljs-string">&quot;docs&quot;</span>, mode=<span class="hljs-string">&quot;lazy&quot;</span>)  <span class="hljs-comment"># Take | LazyLoad | Load</span>
<button class="copy-code-btn"></button></code></pre>
<p>Para entornos gobernados, la recuperación puede ejecutarse donde se permite que vivan los datos. Para grandes sistemas de IA, un conjunto de datos residente en el lago puede admitir múltiples despliegues de recuperación sin un trabajo de migración entre ellos.</p>
<p>Las colecciones externas son una capacidad aditiva. Las colecciones nativas de Milvus siguen siendo la ruta principal para servicios de baja latencia e intensivos en escrituras, mientras que External Collections están diseñadas para conjuntos de datos cuyo sistema de registro permanece fuera de Milvus.</p>
<p>Para obtener más detalles, consulte <a href="https://milvus.io/docs/create-an-external-collection.md">Crear una colección externa</a>.</p>
<h3 id="2-Loon-Storage-v3-Efficient-Point-Reads-for-Lake-Native-Retrieval" class="common-anchor-header">2. Loon (Storage v3): lecturas puntuales eficientes para recuperación nativa del lago</h3><p>External Collections plantean una pregunta obvia: el almacenamiento de objetos está diseñado para escala y durabilidad, pero ¿puede admitir las lecturas puntuales estrechas que siguen a una búsqueda ANN?</p>
<p><strong>El desafío es la amplificación de lectura.</strong> La búsqueda vectorial normalmente se ejecuta en dos etapas: un índice ANN devuelve IDs candidatos y el sistema obtiene campos seleccionados para esos candidatos. Los formatos optimizados para escaneos analíticos pueden convertir una búsqueda lógica estrecha en una lectura física mucho mayor.</p>
<p><strong>Milvus 3.0 aborda este problema con Loon, también conocido como Storage v3, un motor de almacenamiento columnar basado en manifiestos para almacenamiento de objetos compatible con S3.</strong> Loon organiza los campos en <code translate="no">ColumnGroups</code> con IDs de fila alineados, lo que permite que los campos escalares favorezcan el filtrado y los escaneos mientras que los vectores y los campos con muchas lecturas puntuales usan diseños pensados para búsquedas más estrechas.</p>
<p>Loon mantiene los índices vectoriales e invertidos separados del formato de archivo en lugar de incrustarlos dentro de él. Cada versión del conjunto de datos se describe mediante un manifiesto inmutable que registra sus <code translate="no">ColumnGroups</code>, lo que permite que el mismo motor de indexación funcione con Lance, Parquet, Iceberg y Vortex.</p>
<p>El diseño del manifiesto también hace que la evolución del esquema sea menos disruptiva. Añadir o eliminar un campo puede actualizar los metadatos sin reescribir las columnas existentes. Rellenar un nuevo campo escribe un nuevo <code translate="no">ColumnGroup</code> mientras deja sin cambios los <code translate="no">ColumnGroups</code> existentes.</p>
<p><a href="https://github.com/vortex-data/vortex"><strong>Vortex</strong></a> es el formato predeterminado para esta ruta. Es un formato columnar abierto, compatible con Arrow, con diseños flexibles y codificaciones anidadas que se ajustan mejor a datos de IA con muchas consultas puntuales. En un benchmark interno que usó 3 millones de filas, vectores de 128 dimensiones, S3 y 256 lectores concurrentes, la E/S medida por lectura puntual cayó de aproximadamente 9,4 MB para la línea base de Parquet a 0,07 MB para Vortex con Loon, alrededor de 135 veces menos.</p>
<p>Milvus 3.0 no hace que el almacenamiento de objetos se comporte como memoria local. Reduce la amplificación de lectura que, de otro modo, hace que el almacenamiento de objetos sea impracticable para búsquedas puntuales de estilo servicio. El pushdown de predicados al formato y una variante local de Vortex son los próximos elementos de la hoja de ruta.</p>
<p><em>Para obtener más detalles, consulte nuestro blog:</em> <a href="https://milvus.io/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md"><em>Por qué construimos Loon</em></a> <em>y el</em> <a href="https://github.com/vortex-data/vortex"><em>proyecto Vortex</em></a><em>.</em></p>
<h3 id="3-Snapshots-point-in-time-view-without-data-copy" class="common-anchor-header">3. Snapshots: vista en un punto en el tiempo sin copia de datos</h3><p>Los trabajos offline necesitan una vista coherente de los datos incluso mientras las colecciones de producción siguen recibiendo escrituras. Un snapshot de Milvus es una vista de solo lectura en un punto en el tiempo que registra referencias a archivos de datos, índices y metadatos existentes en lugar de copiar el conjunto de datos completo.</p>
<p>Eso hace que los snapshots sean lo suficientemente económicos como para crearlos antes de operaciones arriesgadas, como un cambio de modelo, un trabajo de re-embedding o una migración de esquema. Restaurar un snapshot puede reutilizar archivos de datos e índices existentes mediante copia del lado del servidor en almacenamiento de objetos, en lugar de volver a importar cada fila y reconstruir cada índice. Esta característica es especialmente útil para cargas de trabajo de rápido movimiento como agentes de IA, donde los datos cambian constantemente y se desean puntos de recuperación frecuentes y baratos en lugar de copias de seguridad pesadas ocasionales.</p>
<p>La misma vista congelada puede admitir evaluación, deduplicación, validación de backfill y pruebas aisladas mientras la colección activa continúa aceptando escrituras. El snapshot estabiliza la entrada lógica, aunque las cargas de trabajo aún pueden compartir infraestructura como almacenamiento de objetos y ancho de banda de red.</p>
<p>Los snapshots no reemplazan las copias de seguridad. Un snapshot referencia archivos propiedad de la colección activa y es más adecuado para recuperación lógica, clonación y vistas estables de corta duración. Una copia de seguridad crea una copia independiente para retención a largo plazo y recuperación ante desastres.</p>
<p>Para obtener más información, consulte <a href="https://milvus.io/docs/snapshots.md">Snapshots</a>, <a href="https://milvus.io/docs/manage-snapshots.md">Gestionar snapshots</a> y <a href="https://milvus.io/docs/snapshot-use-cases.md">Casos de uso de snapshots</a>.</p>
<h3 id="4-Spark-connector-connect-Milvus-to-batch-workflows" class="common-anchor-header">4. Conector Spark: conectar Milvus con flujos de trabajo por lotes</h3><p>Un snapshot estable solo es útil si los motores por lotes pueden leerlo. Milvus 3.0 expone Milvus como una Spark DataSource V2, lo que permite que trabajos de Spark, Databricks y EMR lean de Milvus y escriban en Milvus como parte de canalizaciones por lotes estándar.</p>
<p>Esta característica importa porque los flujos de trabajo de datos de IA son iterativos: la deduplicación alimenta el re-embedding, el clustering alimenta la evaluación y la evaluación produce conjuntos seleccionados de entrenamiento o servicio. Un snapshot estable proporciona a esos trabajos una entrada coherente, mientras la colección activa sigue sirviendo. Con el conector Spark, el destino de un trabajo se convierte en el origen del siguiente, sin exportar una colección completa fuera de Milvus cada vez.</p>
<p>Milvus 3.0 también introduce operadores por lotes nativos de vectores para tareas como deduplicación, detección de anomalías y clustering, manteniendo el trabajo intensivo en cómputo fuera de la ruta de consulta online mientras opera directamente sobre datos vectoriales.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_3_cd37cad0c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="5-Online-schema-changes-and-backfill" class="common-anchor-header">5. Cambios de esquema en línea y backfill</h3><p>Un esquema rara vez permanece estático en producción: los equipos añaden nuevos modelos de embeddings, vectores dispersos, etiquetas, campos de metadatos y políticas de retención con el tiempo. Milvus 3.0 les permite añadir, rellenar y eliminar columnas mientras el servicio continúa, en lugar de las reconstrucciones disruptivas que esto solía requerir.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_4_51c9b4e2c1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Añadir o eliminar una columna no requiere reescribir los datos existentes. <code translate="no">client.add_collection_field(...)</code> crea una nueva columna anulable sin desconectar la colección, y <code translate="no">client.drop_collection_field(...)</code> elimina un campo obsoleto o experimental en tiempo de ejecución. Ninguna de las dos operaciones reescribe los datos existentes: cada una es un cambio en el manifiesto de la colección en lugar de en los archivos de datos, por eso no hay reconstrucción.</p>
<p>Milvus 3.0 admite dos rutas de backfill:</p>
<ul>
<li><strong>Backfill interno</strong> (en 3.0) es para valores derivados de campos existentes. Milvus puede generar un vector disperso BM25 a partir de una columna de texto dentro del kernel, eliminando la necesidad de un codificador del lado del cliente al crear recuperación híbrida densa más dispersa.</li>
<li><strong>Backfill externo</strong>(en la hoja de ruta) será para valores calculados fuera de Milvus: tomar un snapshot, ejecutar Spark contra la vista coherente, calcular una nueva columna, escribir los valores de vuelta y dejar que Milvus actualice el índice incrementalmente. Esta es la ruta prevista para grandes trabajos de re-embedding; por ejemplo, añadir una nueva columna de embeddings en cientos de millones de filas mientras continúan las escrituras.</li>
</ul>
<p>En conjunto, los cambios de esquema en línea y el backfill facilitan la evolución de las canalizaciones de recuperación sin reconstruir una colección completa cada vez que cambia el modelo de datos.</p>
<h2 id="A-More-Powerful-Engine-for-End-to-End-Retrieval" class="common-anchor-header">Un motor más potente para la recuperación de extremo a extremo<button data-href="#A-More-Powerful-Engine-for-End-to-End-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus ha admitido durante mucho tiempo más que la búsqueda ANN densa, incluida la recuperación dispersa basada en BM25 y la búsqueda híbrida. Milvus 3.0 extiende el motor a lo largo de un eje diferente: incorpora más de la canalización de recuperación en varias etapas dentro del propio Milvus, reduciendo la sobreobtención, la lógica de aplicación duplicada y la dependencia de servicios separados de posprocesamiento.</p>
<h3 id="1-Server-side-ORDER-BY-sort-inside-the-engine-per-segment" class="common-anchor-header">1. ORDER BY del lado del servidor: ordenar dentro del motor, por segmento</h3><p>Anteriormente, la ordenación requería que las aplicaciones sobreobtuvieran candidatos, los movieran al cliente y los ordenaran allí. Eso consumía ancho de banda y hacía que el resultado final dependiera de dónde ocurriera el truncamiento del lado del cliente.</p>
<p><strong>Milvus 3.0 añade ORDER BY del lado del servidor</strong>, lo que permite que las cargas de trabajo de consulta ordenen filas filtradas por campos escalares como valoración, precio, frescura, inventario o marca temporal.</p>
<ul>
<li>En la ruta de consulta, cada segmento ordena su conjunto de resultados filtrado, los nodos de consulta fusionan esos flujos y el proxy devuelve el segmento solicitado.</li>
<li>En la ruta de búsqueda, ORDER BY ordena el conjunto de candidatos ANN dentro de Milvus, reduciendo la sobreobtención del lado del cliente y el posprocesamiento duplicado. No cambia el límite de recall establecido por los candidatos ANN.</li>
</ul>
<pre><code translate="no" class="language-sql">client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;category == &#x27;shoes&#x27;&quot;</span>,
    output_fields=[<span class="hljs-string">&quot;price&quot;</span>, <span class="hljs-string">&quot;rating&quot;</span>],
    limit=<span class="hljs-number">10</span>,
    order_by=[<span class="hljs-string">&quot;rating:desc&quot;</span>, <span class="hljs-string">&quot;price:asc&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Esto es especialmente útil para búsquedas que combinan relevancia con restricciones comerciales o orientadas al usuario, como valoración, precio, frescura, inventario o marca temporal.</p>
<p>Para obtener más información, consulte <a href="https://milvus.io/docs/single-vector-search.md#Sort-Search-Results-by-Scalar-Fields--Milvus-30x">Ordenar resultados de búsqueda por campos escalares</a> y <a href="https://milvus.io/docs/get-and-scalar-query.md#Sort-Query-Results--Milvus-30x">Ordenar resultados de consulta</a>.</p>
<h3 id="2-Aggregation-and-faceted-search" class="common-anchor-header">2. Agregación y búsqueda facetada</h3><p>Milvus 3.0 añade agregación del lado de la consulta con operaciones como conteo, suma, promedio, mínimo y máximo, agrupadas por uno o más campos escalares. Esto elimina un patrón común en el que los equipos extraen filas filtradas al código cliente solo para contar, agrupar o calcular estadísticas simples.</p>
<pre><code translate="no" class="language-sql">client.query(
    collection_name=<span class="hljs-string">&quot;orders&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;in_stock == true&quot;</span>,
    group_by_fields=[<span class="hljs-string">&quot;category&quot;</span>],
    output_fields=[<span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;count(*)&quot;</span>, <span class="hljs-string">&quot;avg(price)&quot;</span>, <span class="hljs-string">&quot;max(rating)&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus 3.0 también añade <strong>agregación de búsqueda</strong> para búsqueda facetada. Después de una búsqueda ANN, Milvus agrupa los aciertos recuperados por un campo y devuelve recuentos de buckets, estadísticas agregadas y los N principales aciertos de muestra por bucket: el patrón detrás de agrupar por marca, rango de precio, color, tenant o tipo de documento. Una advertencia: la agregación de búsqueda opera sobre el conjunto de resultados recuperados por ANN, no sobre toda la colección, por lo que los recuentos de facetas son aproximados. Cuando necesite recuentos exactos, use agregación del lado de la consulta.</p>
<p>Para obtener más información, consulte <a href="https://milvus.io/docs/get-and-scalar-query.md#Aggregate-Query-Results--Milvus-30x">Agregar resultados de consulta</a>.</p>
<h3 id="3-StructArray-for-Nested-Vectors-and-Late-Interaction-Model" class="common-anchor-header">3. StructArray para vectores anidados y modelos de interacción tardía</h3><p>Muchas entidades se representan de forma natural mediante múltiples vectores. Un documento largo es una serie de fragmentos; un video es una secuencia de fotogramas que se preferiría mantener juntos en una fila en lugar de dispersarlos en muchas; un producto tiene varias imágenes o ángulos. Los modelos de interacción tardía llevan esto aún más lejos: ColBERT emite un vector por token, ColPali uno por parche visual. En todos los casos, la unidad que realmente desea almacenar y buscar es la entidad completa, no cada fragmento por separado.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_5_e15816e38b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>StructArray</strong> permite que una fila de Milvus contenga un array de longitud variable de elementos estructurados, incluidos múltiples vectores, mientras conserva un único ID de entidad y un único conjunto de metadatos. Eso evita dividir un documento en varias filas y duplicar etiquetas, permisos u otros campos en los fragmentos.</p>
<p>Milvus admite dos granularidades de búsqueda.</p>
<ul>
<li><strong>Búsqueda a nivel de elemento</strong> compara un vector de consulta con cada elemento de la lista y devuelve el elemento específico coincidente con su offset. Esto es útil cuando desea saber qué fragmento, token, parche o imagen coincidió. Una fila puede aparecer más de una vez si coinciden varios elementos.</li>
<li><strong>Búsqueda a nivel de entidad</strong> compara la lista completa de vectores de una consulta con la lista de vectores de la fila usando <code translate="no">MAX_SIM</code>, con la métrica <code translate="no">MAX_SIM_COSINE</code>. Cada token de consulta toma su mejor coincidencia en el documento, y esas mejores puntuaciones se suman. Esto proporciona a Milvus soporte nativo para patrones de recuperación de interacción tardía como ColBERT y ColPali, manteniendo una fila por documento.</li>
</ul>
<p>Indexar cada vector de token puede ser costoso; por eso Milvus 3.0 añade múltiples rutas de aceleración, incluidos TokenANN, Muvera y Lemur, que intercambian tamaño de índice, costo de entrenamiento y recall.</p>
<table>
<thead>
<tr><th>Estrategia</th><th>Representación de la primera etapa</th><th>Perfil de costo</th><th>Ideal para</th></tr>
</thead>
<tbody>
<tr><td>TokenANN</td><td>Se indexa cada vector de token.</td><td>Más alto, exacto</td><td>Modelos de alta discriminación y documentos cortos</td></tr>
<tr><td>Muvera</td><td>Un vector por documento usando FDE de proyección aleatoria.</td><td>Medio, sin entrenamiento</td><td>Documentos largos</td></tr>
<tr><td>Lemur</td><td>Un vector por documento usando compresión MLP aprendida</td><td>Más bajo, requiere entrenamiento</td><td>Modelos de baja discriminación y vectores visuales o de parches</td></tr>
</tbody>
</table>
<p>En nuestros benchmarks, Lemur iguala o supera el recall de TokenANN en la mayoría de los conjuntos de datos mientras colapsa cada documento en un solo vector; la excepción son los corpus con alta variación de longitud, donde TokenANN u otra estrategia es más segura.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_7_8ff1ab957e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Para corpus más grandes que la memoria, Milvus también admite un índice <code translate="no">DISKANN</code> que mantiene las listas de embeddings en disco para reducir la presión sobre la RAM.</p>
<p>La búsqueda a nivel de elemento ya llegó en Milvus 2.6. El filtrado para Muvera, Lemur y StructList es nuevo en 3.0.</p>
<h3 id="4-BM25-Index-Compression-and-SINDI" class="common-anchor-header">4. Compresión de índices BM25 y SINDI</h3><p>Milvus ha admitido la búsqueda de vectores dispersos en versiones anteriores. Milvus 3.0 reduce la huella del índice disperso mediante postings comprimidos por bloques (algoritmos relacionados con VByte más decodificación SIMD) y cuantización (fp16 para productos internos, u16 para BM25).</p>
<p>En un conjunto de benchmarks internos de BM25, la nueva implementación fue aproximadamente 3 veces más pequeña que el índice disperso de Milvus 2.6 con recall comparable. Un índice más pequeño reduce la presión sobre memoria y ancho de banda y puede mejorar la velocidad en cargas de trabajo limitadas por el movimiento de datos.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_8_2e62fc9573.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 3.0 también introduce <a href="https://arxiv.org/abs/2509.08395">SINDI</a>, un nuevo algoritmo de recuperación dispersa optimizado para embeddings dispersos aprendidos como SPLADE. Debido a que estos embeddings producen listas de postings más densas que BM25, los algoritmos de búsqueda con mucha poda pueden gastar mucho tiempo de CPU decidiendo qué omitir. En su lugar, SINDI organiza los postings en ventanas compactas y usa acumulación de puntuaciones compatible con SIMD para procesarlos eficientemente, al tiempo que preserva la precisión de recuperación mediante poda sin pérdida.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_9_c7de29a223.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>También extendimos SINDI más allá de su diseño original para incluir soporte nativo de BM25, lo que permite a Milvus usar la misma ruta optimizada de recuperación dispersa tanto para embeddings dispersos aprendidos como para la búsqueda tradicional de texto completo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_10_e94a903bcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>En nuestros benchmarks en 4 conjuntos de datos de vectores dispersos SPLADE, SINDI alcanza hasta alrededor de 10 veces los QPS de MaxScore en vectores dispersos aprendidos, con un peor caso de aproximadamente 5 veces.</p>
<p>SINDI es el predeterminado para la búsqueda dispersa de producto interno en Milvus 3.0.</p>
<h2 id="Other-Enhancements" class="common-anchor-header">Otras mejoras<button data-href="#Other-Enhancements" class="anchor-icon" translate="no">
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
<li><strong>TEXT LOB:</strong> Almacena texto fuente largo junto a los vectores. El texto de menos de 64 KB permanece inline; los valores más grandes usan una referencia LOB de Vortex.</li>
<li><strong>Soporte ampliado de índices densos:</strong> Añade más opciones de índices dentro de la familia Faiss, incluidas SVS, Panorama, PQ, IVFPQ y ScaNN, para diferentes requisitos de escala, memoria y recall.</li>
<li><strong>MinHash y búsqueda de casi duplicados:</strong> Genera firmas MinHash en el lado del servidor y recupera candidatos casi duplicados usando MINHASH_LSH.</li>
<li><strong>Vectores anulables y nuevos tipos:</strong> Permite que los campos vectoriales sean NULL y añade TIMESTAMPTZ para filtrado sensible al tiempo y políticas de retención.</li>
<li><strong>Diccionarios personalizados de texto completo:</strong> Registra diccionarios, sinónimos y recursos de palabras vacías en el clúster para tokenización multilingüe y específica de dominio.</li>
<li><strong>Woodpecker independiente:</strong> Ejecuta el registro write-ahead de Milvus como un servicio independientemente escalable y observable.</li>
<li><strong>Entidad</strong> <strong>TTL****:</strong> Expira registros individuales mediante un campo TIMESTAMPTZ, con filtrado MVCC seguido de recolección de basura durante la compactación.</li>
<li><strong>ForceMerge:</strong> Compacta segmentos pequeños a un tamaño objetivo y reconstruye índices para reducir la amplificación de lectura antes de un servicio sostenido con muchas lecturas.</li>
<li>Y más</li>
</ul>
<h2 id="Get-started-with-Milvus-30" class="common-anchor-header">Comience con Milvus 3.0<button data-href="#Get-started-with-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 está disponible hoy bajo la licencia Apache 2.0 y sigue siendo un proyecto de LF AI &amp; Data. Para comenzar:</p>
<ul>
<li>Lea las <a href="https://milvus.io/docs/release_notes.md">notas de la versión</a> y la <a href="https://milvus.io/docs/quickstart.md">guía de inicio rápido</a>, y obtenga el código fuente en <a href="https://github.com/milvus-io/milvus">github.com/milvus-io/milvus</a>.</li>
<li>Únase a la <a href="https://discord.com/invite/8uyFbECzPX">comunidad de Milvus en Discord</a> o reserve una sesión de <a href="https://milvus.io/office-hours">Milvus Office Hours</a> para hablar de su caso de uso con los mantenedores.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_11_78476298b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-30-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Milvus 3.0 y Zilliz Vector Lakebase<button data-href="#Milvus-30-and-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 establece la base de código abierto para la recuperación de IA en producción y la arquitectura emergente <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Vector Lakebase</a>, que combina almacenamiento nativo del lago con recuperación vectorial de alto rendimiento sobre una única fuente de verdad, cada uno al costo adecuado.</p>
<p><a href="https://zilliz.com/">Zilliz Cloud</a> es un Vector Lakebase completamente gestionado creado por el equipo detrás de Milvus. Comparte la misma arquitectura distribuida y nativa del lago que Milvus y es totalmente compatible con la API de Milvus. Impulsado por su motor de indexación propietario Cardinal, Zilliz Cloud ofrece hasta 10× mejor relación precio-rendimiento que los enfoques estándar de indexación de código abierto, al tiempo que elimina la complejidad operativa de gestionar infraestructura. Las capacidades empresariales incluyen cómputo scale-to-zero, recuperación ante desastres entre regiones, despliegue BYOC, seguridad y cumplimiento de nivel empresarial (SOC 2, HIPAA, ISO 27001 y GDPR), y hasta un SLA del 99,99 %.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_12_08d1c21d25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Los desarrolladores pueden desplegar Milvus como una base de datos vectorial de código abierto o usar <a href="https://zilliz.com/">Zilliz Cloud</a> como plataforma gestionada para múltiples cargas de trabajo a lo largo del ciclo de vida de los datos de IA.</p>
<h2 id="What-comes-next" class="common-anchor-header">Qué viene a continuación<button data-href="#What-comes-next" class="anchor-icon" translate="no">
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
    </button></h2><p>La hoja de ruta de Milvus se basa en la arquitectura 3.0 con pushdown de predicados para External Collections, backfill externo, operadores Spark adicionales y soporte para más formatos de tabla, incluidos Delta Lake y Apache Paimon.</p>
<p>La dirección general es clara: los sistemas de datos de IA necesitan un bucle más estrecho entre la recuperación online y la mejora offline de los datos. Los datos vectoriales no deberían tener que copiarse en sistemas separados cada vez que los equipos quieran buscarlos, analizarlos, mejorarlos o servirlos.</p>
