---
id: >-
  announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md
title: >-
  Presentamos Milvus 3.0: búsqueda vectorial nativa de lago y un motor de
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
  Descubre la búsqueda vectorial nativa de lake de Milvus 3.0, las colecciones
  externas de cero copia, la recuperación dispersa más rápida, las instantáneas,
  la integración con Spark y las capacidades avanzadas de ranking.
origin: >-
  https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md
---
<p>Hoy lanzamos Milvus 3.0, un hito arquitectónico importante para el proyecto. Cambia tanto dónde Milvus puede crear y servir índices como cuánto trabajo de recuperación puede realizarse directamente dentro del motor.</p>
<ul>
<li>Milvus 3.0 introduce <strong>una ruta nativa de lake</strong> para indexar datos vectoriales que residen en almacenamiento de objetos y formatos de tabla abiertos, incluidos Parquet, Lance, Iceberg y Vortex. Los equipos pueden hacer que los datos residentes en el lake sean buscables sin mantener otra copia en una base de datos vectorial.</li>
<li><strong>Esta versión también amplía Milvus más allá de la recuperación inicial de candidatos.</strong> La ordenación del lado del servidor, la agregación, la búsqueda facetada, StructArray para estructuras anidadas de documento/fragmento y vectores ColBERT, y un índice disperso rediseñado trasladan más clasificación, agrupación y procesamiento de resultados fuera del código de la aplicación y dentro del motor de recuperación.</li>
</ul>
<p>En conjunto, estos avances convierten a Milvus en la base de código abierto para la recuperación de IA en producción y para arquitecturas <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Vector Lakebase</a> que combinan almacenamiento nativo de lake con recuperación vectorial de alto rendimiento.</p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/SAm4YfrO1ok?si=xzgw5RjRTwaHWYxO" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="A-quick-glance-at-the-Milvus-30-feature-set" class="common-anchor-header">Un vistazo rápido al conjunto de funciones de Milvus 3.0<button data-href="#A-quick-glance-at-the-Milvus-30-feature-set" class="anchor-icon" translate="no">
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
<tr><th><strong>Área</strong></th><th><strong>Funciones</strong></th><th><strong>Por qué importa</strong></th></tr>
</thead>
<tbody>
<tr><td>Recuperación nativa de lake</td><td>Colecciones externas sobre Parquet, Lance, Iceberg y Vortex</td><td>Busca datos residentes en el lake sin mantener una segunda copia de servicio</td></tr>
<tr><td>Almacenamiento basado en S3</td><td>Loon (Storage v3)</td><td>Reduce la amplificación de lecturas puntuales para el acceso de estilo serving y admite la evolución del esquema</td></tr>
<tr><td>Flujos de trabajo offline/batch y recuperación</td><td>Snapshots, Spark DataSource V2 y evolución de esquema en línea</td><td>Lleva vistas estables de colecciones a canalizaciones de evaluación, deduplicación, clustering y características</td></tr>
<tr><td>Motor de recuperación</td><td>ORDER BY, agregación, facetas, StructArray y recuperación dispersa mejorada</td><td>Traslada más procesamiento de resultados y puntuación multivectorial a Milvus</td></tr>
<tr><td>Modelo de datos y operaciones</td><td>Vectores anulables, TEXT LOB, TTL, MinHash, Woodpecker y ForceMerge</td><td>Admite modelos de datos más ricos y patrones operativos de producción</td></tr>
</tbody>
</table>
<h2 id="The-lake-native-infrastructure-index-and-serve-data-where-it-already-lives" class="common-anchor-header">La infraestructura nativa de lake: indexa y sirve datos donde ya residen<button data-href="#The-lake-native-infrastructure-index-and-serve-data-where-it-already-lives" class="anchor-icon" translate="no">
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
    </button></h2><p>El mayor cambio arquitectónico en Milvus 3.0 es dónde el sistema puede crear y servir índices. Los datos vectoriales pueden permanecer en formatos abiertos sobre almacenamiento de objetos mientras Milvus proporciona indexación, recuperación y API de nivel de producción.</p>
<h3 id="1-External-Collections-indexing-directly-on-lake-resident-data" class="common-anchor-header">1. Colecciones externas: indexación directamente sobre datos residentes en el lake</h3><p>Muchos equipos ya almacenan embeddings en un data lake: tablas Lance, tablas Iceberg, archivos Parquet u otros conjuntos de datos de formato abierto en S3, GCS o Azure Blob Storage. Antes de Milvus 3.0, normalmente había dos opciones para buscar esos datos.</p>
<ul>
<li>Copiar los embeddings en una base de datos vectorial. Esto proporciona búsqueda de baja latencia, pero crea una segunda copia y una canalización ETL que debe permanecer sincronizada.</li>
<li>Consultar el lake directamente. Esto evita la duplicación, pero sin índices ANN, la búsqueda vectorial se convierte en un escaneo de fuerza bruta que no puede cumplir con la latencia de producción.</li>
</ul>
<p><strong>Las colecciones externas introducen una tercera vía.</strong> Defines una colección de Milvus sobre datos que permanecen en el almacenamiento de objetos, mapeas campos externos a un esquema de Milvus y utilizas las mismas API de búsqueda y consulta que con una colección nativa. Los archivos de origen no se mueven; Milvus crea y sirve índices vectoriales, invertidos BM25, JSON y escalares sobre los datos externos.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_1_c1fb7ab16e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Las colecciones externas son de solo lectura y zero-copy</strong>, lo que las hace útiles cuando la gobernanza, los límites de propiedad o el coste operativo exigen que el conjunto de datos de origen permanezca en el lake.</p>
<p>Cuando el conjunto de datos externo cambia, Milvus lee su manifiesto de almacenamiento e indexa los fragmentos recién añadidos en lugar de reconstruir toda la colección.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> time

<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> DataType, MilvusClient

client = MilvusClient(uri=<span class="hljs-string">&quot;&quot;</span>)

<span class="hljs-comment"># Register an Iceberg table as a zero-copy collection.</span>
schema = client.create_schema(
    external_source=<span class="hljs-string">&quot;s3://lake/docs/metadata/v1.metadata.json&quot;</span>,
    external_spec=json.dumps(
        {
            <span class="hljs-string">&quot;format&quot;</span>: <span class="hljs-string">&quot;iceberg-table&quot;</span>,
            <span class="hljs-string">&quot;snapshot_id&quot;</span>: <span class="hljs-number">123456789</span>,
            <span class="hljs-string">&quot;extfs&quot;</span>: {
                <span class="hljs-string">&quot;cloud_provider&quot;</span>: <span class="hljs-string">&quot;aws&quot;</span>,
                <span class="hljs-string">&quot;region&quot;</span>: <span class="hljs-string">&quot;us-east-1&quot;</span>,
                <span class="hljs-string">&quot;access_key_id&quot;</span>: os.environ[<span class="hljs-string">&quot;AWS_ACCESS_KEY_ID&quot;</span>],
                <span class="hljs-string">&quot;access_key_value&quot;</span>: os.environ[<span class="hljs-string">&quot;AWS_SECRET_ACCESS_KEY&quot;</span>],
            },
        }
    ),
)

schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, external_field=<span class="hljs-string">&quot;doc_id&quot;</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;emb&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1024</span>, external_field=<span class="hljs-string">&quot;embedding&quot;</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;title&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">1024</span>, external_field=<span class="hljs-string">&quot;title&quot;</span>)

client.create_collection(collection_name=<span class="hljs-string">&quot;docs&quot;</span>, schema=schema)

<span class="hljs-comment"># Import the external table snapshot.</span>
job_id = client.refresh_external_collection(collection_name=<span class="hljs-string">&quot;docs&quot;</span>)
<span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
    progress = client.get_refresh_external_collection_progress(job_id=job_id)
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshCompleted&quot;</span>:
        <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshFailed&quot;</span>:
        <span class="hljs-keyword">raise</span> RuntimeError(progress.reason)
    time.sleep(<span class="hljs-number">1</span>)

index_params = client.prepare_index_params()
index_params.add_index(field_name=<span class="hljs-string">&quot;emb&quot;</span>, index_type=<span class="hljs-string">&quot;HNSW&quot;</span>, metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>)
client.create_index(collection_name=<span class="hljs-string">&quot;docs&quot;</span>, index_params=index_params)

client.load_collection(collection_name=<span class="hljs-string">&quot;docs&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>En entornos gobernados, la recuperación puede ejecutarse donde se permite que residan los datos. Para sistemas de IA a gran escala, un conjunto de datos residente en el lake puede admitir múltiples despliegues de recuperación sin un trabajo de migración entre ellos.</p>
<p>Las colecciones externas son una capacidad aditiva. Las colecciones nativas de Milvus siguen siendo la ruta principal para serving de baja latencia y con muchas escrituras, mientras que las colecciones externas están diseñadas para conjuntos de datos cuyo sistema de registro permanece fuera de Milvus.</p>
<p>Para obtener más detalles, consulta <a href="https://milvus.io/docs/create-an-external-collection.md">Crear una colección externa</a>.</p>
<h3 id="2-Loon-Storage-v3-Efficient-Point-Reads-for-Lake-Native-Retrieval" class="common-anchor-header">2. Loon (Storage v3): lecturas puntuales eficientes para la recuperación nativa de lake</h3><p>Las colecciones externas plantean una pregunta obvia: el almacenamiento de objetos está diseñado para escalabilidad y durabilidad, pero ¿puede admitir las lecturas puntuales estrechas que siguen a una búsqueda ANN?</p>
<p><strong>El desafío es la amplificación de lectura.</strong> La búsqueda vectorial suele ejecutarse en dos etapas: un índice ANN devuelve IDs candidatos y el sistema obtiene campos seleccionados para esos candidatos. Los formatos optimizados para escaneos analíticos pueden convertir una búsqueda lógica estrecha en una lectura física mucho mayor.</p>
<p><strong>Milvus 3.0 aborda este problema con Loon, también conocido como Storage v3, un motor de almacenamiento columnar basado en manifiestos para almacenamiento de objetos compatible con S3.</strong> Loon organiza los campos en <code translate="no">ColumnGroups</code> con IDs de fila alineados, lo que permite que los campos escalares favorezcan el filtrado y los escaneos, mientras que los vectores y los campos con muchas lecturas puntuales utilizan diseños pensados para búsquedas más estrechas.</p>
<p>Loon mantiene los índices vectoriales e invertidos separados del formato de archivo en lugar de incrustarlos dentro de él. Cada versión del conjunto de datos se describe mediante un manifiesto inmutable que registra sus <code translate="no">ColumnGroups</code>, lo que permite que el mismo motor de indexación funcione en Lance, Parquet, Iceberg y Vortex.</p>
<p>El diseño basado en manifiestos también hace que la evolución del esquema sea menos disruptiva. Añadir o eliminar un campo puede actualizar los metadatos sin reescribir las columnas existentes. Rellenar un nuevo campo escribe un nuevo <code translate="no">ColumnGroup</code> mientras deja los <code translate="no">ColumnGroups</code> existentes sin cambios.</p>
<p><a href="https://github.com/vortex-data/vortex"><strong>Vortex</strong></a> es el formato predeterminado para esta ruta. Es un formato columnar abierto y compatible con Arrow, con diseños flexibles y codificaciones anidadas que se ajustan mejor a datos de IA con muchas consultas puntuales. En una prueba comparativa interna con 3 millones de filas, vectores de 128 dimensiones, S3 y 256 lectores concurrentes, la E/S medida por lectura puntual cayó de aproximadamente 9,4 MB para la línea base de Parquet a 0,07 MB para Vortex con Loon, unas 135 veces menos.</p>
<p>Milvus 3.0 no hace que el almacenamiento de objetos se comporte como memoria local. Reduce la amplificación de lectura que, de otro modo, haría impracticable el almacenamiento de objetos para búsquedas puntuales de estilo serving. El predicate pushdown en el formato y una variante local de Vortex son los siguientes pasos en la hoja de ruta.</p>
<p><em>Para obtener más detalles, consulta nuestro blog:</em> <a href="https://milvus.io/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md"><em>Por qué creamos Loon</em></a> <em>y el</em> <a href="https://github.com/vortex-data/vortex"><em>proyecto Vortex</em></a><em>.</em></p>
<h3 id="3-Snapshots-point-in-time-view-without-data-copy" class="common-anchor-header">3. Snapshots: vista en un punto en el tiempo sin copia de datos</h3><p>Los trabajos offline necesitan una vista coherente de los datos incluso mientras las colecciones de producción siguen recibiendo escrituras. Un snapshot de Milvus es una vista de solo lectura en un punto en el tiempo que registra referencias a archivos de datos, índices y metadatos existentes en lugar de copiar todo el conjunto de datos.</p>
<p>Eso hace que los snapshots sean lo bastante económicos como para crearlos antes de operaciones arriesgadas, como un cambio de modelo, un trabajo de re-embedding o una migración de esquema. Restaurar un snapshot puede reutilizar los archivos de datos e índices existentes mediante copia del lado del servidor en el almacenamiento de objetos, en lugar de reimportar cada fila y reconstruir cada índice. Esta función es especialmente útil para cargas de trabajo que avanzan rápido, como agentes de IA, donde los datos cambian constantemente y quieres puntos de recuperación frecuentes y baratos en lugar de copias de seguridad pesadas ocasionales.</p>
<p>La misma vista congelada puede admitir evaluación, deduplicación, validación de backfill y pruebas aisladas mientras la colección en vivo continúa aceptando escrituras. El snapshot estabiliza la entrada lógica, aunque las cargas de trabajo aún pueden compartir infraestructura como almacenamiento de objetos y ancho de banda de red.</p>
<p>Los snapshots no reemplazan las copias de seguridad. Un snapshot referencia archivos propiedad de la colección en vivo y es más adecuado para recuperación lógica, clonación y vistas estables de corta duración. Una copia de seguridad crea una copia independiente para retención a largo plazo y recuperación ante desastres.</p>
<p>Para obtener más información, consulta <a href="https://milvus.io/docs/snapshots.md">Snapshots</a>, <a href="https://milvus.io/docs/manage-snapshots.md">Gestionar snapshots</a> y <a href="https://milvus.io/docs/snapshot-use-cases.md">Casos de uso de snapshots</a>.</p>
<h3 id="4-Spark-connector-connect-Milvus-to-batch-workflows" class="common-anchor-header">4. Conector Spark: conecta Milvus con flujos de trabajo batch</h3><p>Una snapshot estable solo es útil si los motores batch pueden leerla. Milvus 3.0 expone Milvus como una Spark DataSource V2, lo que permite que trabajos de Spark, Databricks y EMR lean de Milvus y escriban en Milvus como parte de canalizaciones batch estándar.</p>
<p>Esta función importa porque los flujos de trabajo de datos de IA son iterativos: la deduplicación alimenta el re-embedding, el clustering alimenta la evaluación y la evaluación produce conjuntos seleccionados para entrenamiento o serving. Un snapshot estable proporciona a esos trabajos una entrada coherente, mientras la colección en vivo sigue sirviendo. Con el conector Spark, el destino de un trabajo se convierte en el origen del siguiente, sin exportar una colección completa fuera de Milvus cada vez.</p>
<p>Milvus 3.0 también introduce operadores batch nativos de vectores para tareas como deduplicación, detección de anomalías y clustering, manteniendo el trabajo intensivo en cómputo fuera de la ruta de consulta online mientras opera directamente sobre datos vectoriales.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_3_cd37cad0c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="5-Online-schema-changes-and-backfill" class="common-anchor-header">5. Cambios de esquema en línea y backfill</h3><p>Un esquema rara vez permanece estático en producción: los equipos añaden nuevos modelos de embedding, vectores dispersos, etiquetas, campos de metadatos y políticas de retención con el tiempo. Milvus 3.0 les permite añadir, rellenar y eliminar columnas mientras el servicio continúa, en lugar de las reconstrucciones disruptivas que esto solía requerir.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_4_51c9b4e2c1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Añadir o eliminar una columna no requiere reescribir los datos existentes. <code translate="no">client.add_collection_field(...)</code> incorpora una nueva columna anulable sin desconectar la colección, y <code translate="no">client.drop_collection_field(...)</code> elimina un campo obsoleto o experimental en tiempo de ejecución. Ninguna de las dos operaciones reescribe los datos existentes: cada una es un cambio en el manifiesto de la colección, no en los archivos de datos, por eso no hay reconstrucción.</p>
<p>Milvus 3.0 admite dos rutas de backfill:</p>
<ul>
<li><strong>Backfill interno</strong> (en 3.0) es para valores derivados de campos existentes. Milvus puede generar un vector disperso BM25 a partir de una columna de texto dentro del kernel, eliminando la necesidad de un codificador del lado del cliente al crear recuperación híbrida densa más dispersa.</li>
<li><strong>Backfill externo</strong>(en la hoja de ruta) será para valores calculados fuera de Milvus: tomar un snapshot, ejecutar Spark contra la vista coherente, calcular una nueva columna, escribir los valores de vuelta y permitir que Milvus actualice el índice de forma incremental. Esta es la ruta prevista para grandes trabajos de re-embedding; por ejemplo, añadir una nueva columna de embedding en cientos de millones de filas mientras las escrituras continúan.</li>
</ul>
<p>En conjunto, los cambios de esquema en línea y el backfill facilitan la evolución de canalizaciones de recuperación sin reconstruir una colección completa cada vez que cambia el modelo de datos.</p>
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
    </button></h2><p>Milvus ha admitido durante mucho tiempo más que búsqueda ANN densa, incluida la recuperación dispersa basada en BM25 y la búsqueda híbrida. Milvus 3.0 amplía el motor en un eje diferente: lleva más de la canalización de recuperación multietapa al propio Milvus, reduciendo la sobreobtención, la lógica de aplicación duplicada y la dependencia de servicios de posprocesamiento separados.</p>
<h3 id="1-Server-side-ORDER-BY-sort-inside-the-engine-per-segment" class="common-anchor-header">1. ORDER BY del lado del servidor: ordena dentro del motor, por segmento</h3><p>Anteriormente, la ordenación requería que las aplicaciones obtuvieran candidatos de más, los trasladaran al cliente y los ordenaran allí. Eso consumía ancho de banda y hacía que el resultado final dependiera de dónde se produjera el truncamiento del lado del cliente.</p>
<p><strong>Milvus 3.0 añade ORDER BY del lado del servidor</strong>, lo que permite que las cargas de trabajo de consulta ordenen filas filtradas por campos escalares como calificación, precio, frescura, inventario o marca temporal.</p>
<ul>
<li>En la ruta de consulta, cada segmento ordena su conjunto de resultados filtrados, los nodos de consulta fusionan esos flujos y el proxy devuelve el segmento solicitado.</li>
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
<p>Esto es especialmente útil para búsquedas que combinan relevancia con restricciones empresariales o orientadas al usuario, como calificación, precio, frescura, inventario o marca temporal.</p>
<p>Para obtener más información, consulta <a href="https://milvus.io/docs/single-vector-search.md#Sort-Search-Results-by-Scalar-Fields--Milvus-30x">Ordenar resultados de búsqueda por campos escalares</a> y <a href="https://milvus.io/docs/get-and-scalar-query.md#Sort-Query-Results--Milvus-30x">Ordenar resultados de consulta</a>.</p>
<h3 id="2-Aggregation-and-faceted-search" class="common-anchor-header">2. Agregación y búsqueda facetada</h3><p>Milvus 3.0 añade agregación del lado de consulta con operaciones como conteo, suma, promedio, mínimo y máximo, agrupadas por uno o más campos escalares. Esto elimina un patrón común en el que los equipos extraen filas filtradas al código del cliente solo para contar, agrupar o calcular estadísticas simples.</p>
<pre><code translate="no" class="language-sql">client.query(
    collection_name=<span class="hljs-string">&quot;orders&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;in_stock == true&quot;</span>,
    group_by_fields=[<span class="hljs-string">&quot;category&quot;</span>],
    output_fields=[<span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;count(*)&quot;</span>, <span class="hljs-string">&quot;avg(price)&quot;</span>, <span class="hljs-string">&quot;max(rating)&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus 3.0 también añade <strong>agregación de búsqueda</strong> para búsqueda facetada. Después de una búsqueda ANN, Milvus agrupa los aciertos recuperados por un campo y devuelve conteos de buckets, estadísticas agregadas y los N principales aciertos de muestra por bucket: el patrón detrás de la agrupación por marca, rango de precio, color, tenant o tipo de documento. Una salvedad: la agregación de búsqueda opera sobre el conjunto de resultados recuperado por ANN, no sobre toda la colección, por lo que los conteos de facetas son aproximados. Cuando necesites conteos exactos, usa la agregación del lado de consulta.</p>
<p>Para obtener más información, consulta <a href="https://milvus.io/docs/get-and-scalar-query.md#Aggregate-Query-Results--Milvus-30x">Agregar resultados de consulta</a>.</p>
<h3 id="3-StructArray-for-Nested-Vectors-and-Late-Interaction-Model" class="common-anchor-header">3. StructArray para vectores anidados y modelo de interacción tardía</h3><p>Muchas entidades se representan naturalmente mediante múltiples vectores. Un documento largo es una serie de fragmentos; un vídeo es una secuencia de fotogramas que preferirías mantener juntos en una fila en lugar de dispersarlos en muchas; un producto tiene varias imágenes o ángulos. Los modelos de interacción tardía llevan esto aún más lejos: ColBERT emite un vector por token, ColPali uno por parche visual. En todos los casos, la unidad que realmente quieres almacenar y buscar es la entidad completa, no cada fragmento por separado.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_5_e15816e38b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>StructArray</strong> permite que una fila de Milvus contenga un array de longitud variable de elementos estructurados, incluidos múltiples vectores, preservando al mismo tiempo un único ID de entidad y un único conjunto de metadatos. Eso evita dividir un documento en múltiples filas y duplicar etiquetas, permisos u otros campos entre fragmentos.</p>
<p>Milvus admite dos granularidades de búsqueda.</p>
<ul>
<li><strong>Búsqueda a nivel de elemento</strong> compara un vector de consulta con cada elemento de la lista y devuelve el elemento específico coincidente con su desplazamiento. Esto es útil cuando quieres saber qué fragmento, token, parche o imagen coincidió. Una fila puede aparecer más de una vez si coinciden varios elementos.</li>
<li><strong>Búsqueda a nivel de entidad</strong> compara la lista completa de vectores de una consulta con la lista de vectores de la fila mediante <code translate="no">MAX_SIM</code>, con la métrica <code translate="no">MAX_SIM_COSINE</code>. Cada token de consulta toma su mejor coincidencia en el documento, y esas mejores puntuaciones se suman. Esto proporciona a Milvus compatibilidad nativa con patrones de recuperación de interacción tardía como ColBERT y ColPali, manteniendo una fila por documento.</li>
</ul>
<p>Indexar cada vector de token puede ser costoso; por eso Milvus 3.0 añade múltiples rutas de aceleración, incluidas TokenANN, Muvera y Lemur, que intercambian tamaño de índice, coste de entrenamiento y recall.</p>
<table>
<thead>
<tr><th>Estrategia</th><th>Representación de primera etapa</th><th>Perfil de coste</th><th>Mejor para</th></tr>
</thead>
<tbody>
<tr><td>TokenANN</td><td>Se indexa cada vector de token.</td><td>Más alto, exacto</td><td>Modelos de alta discriminación y documentos cortos</td></tr>
<tr><td>Muvera</td><td>Un vector por documento usando FDE de proyección aleatoria.</td><td>Medio, sin entrenamiento</td><td>Documentos largos</td></tr>
<tr><td>Lemur</td><td>Un vector por documento usando compresión MLP aprendida</td><td>Más bajo, requiere entrenamiento</td><td>Modelos de baja discriminación y vectores visuales o de parches</td></tr>
</tbody>
</table>
<p>En nuestras pruebas comparativas, Lemur iguala o supera el recall de TokenANN en la mayoría de los conjuntos de datos mientras colapsa cada documento a un único vector; la excepción son los corpus con alta varianza de longitud, donde TokenANN u otra estrategia es más segura.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_7_8ff1ab957e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Para corpus más grandes que la memoria, Milvus también admite un índice <code translate="no">DISKANN</code> que mantiene las listas de embeddings en disco para reducir la presión sobre la RAM.</p>
<p>La búsqueda a nivel de elemento ya llegó en Milvus 2.6. El filtrado para Muvera, Lemur y StructList es nuevo en 3.0.</p>
<h3 id="4-BM25-Index-Compression-and-SINDI" class="common-anchor-header">4. Compresión de índices BM25 y SINDI</h3><p>Milvus ha admitido la búsqueda de vectores dispersos en versiones anteriores. Milvus 3.0 reduce el tamaño del índice disperso mediante postings comprimidos por bloques (algoritmos relacionados con VByte más decodificación SIMD) y cuantización (fp16 para productos internos, u16 para BM25).</p>
<p>En un conjunto de pruebas comparativas internas de BM25, la nueva implementación fue aproximadamente 3 veces más pequeña que el índice disperso de Milvus 2.6 con un recall comparable. Un índice más pequeño reduce la presión sobre memoria y ancho de banda y puede mejorar la velocidad en cargas de trabajo limitadas por el movimiento de datos.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_8_2e62fc9573.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 3.0 también introduce <a href="https://arxiv.org/abs/2509.08395">SINDI</a>, un nuevo algoritmo de recuperación dispersa optimizado para embeddings dispersos aprendidos como SPLADE. Debido a que estos embeddings producen listas de postings más densas que BM25, los algoritmos de búsqueda con mucha poda pueden dedicar un tiempo considerable de CPU a decidir qué omitir. En cambio, SINDI organiza los postings en ventanas compactas y usa acumulación de puntuación compatible con SIMD para procesarlos de forma eficiente, preservando al mismo tiempo la precisión de recuperación mediante poda sin pérdida.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_9_c7de29a223.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>También ampliamos SINDI más allá de su diseño original para incluir compatibilidad nativa con BM25, lo que permite a Milvus usar la misma ruta de recuperación dispersa optimizada tanto para embeddings dispersos aprendidos como para la búsqueda tradicional de texto completo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_10_e94a903bcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>En nuestras pruebas comparativas sobre 4 conjuntos de datos de vectores dispersos SPLADE, SINDI alcanza hasta aproximadamente 10 veces el QPS de MaxScore en vectores aprendidos dispersos, con un peor caso de alrededor de 5 veces.</p>
<p>SINDI es el valor predeterminado para la búsqueda dispersa de producto interno en Milvus 3.0.</p>
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
<li><strong>TEXT LOB:</strong> Almacena texto fuente largo junto a los vectores. El texto inferior a 64 KB permanece inline; los valores más grandes usan una referencia Vortex LOB.</li>
<li><strong>Compatibilidad ampliada con índices densos:</strong> Añade más opciones de índice dentro de la familia Faiss, incluidas SVS, Panorama, PQ, IVFPQ y ScaNN, para diferentes requisitos de escala, memoria y recall.</li>
<li><strong>MinHash y búsqueda de casi duplicados:</strong> Genera firmas MinHash en el lado del servidor y recupera candidatos casi duplicados usando MINHASH_LSH.</li>
<li><strong>Vectores anulables y nuevos tipos:</strong> Permite que los campos vectoriales sean NULL y añade TIMESTAMPTZ para filtrado consciente del tiempo y políticas de retención.</li>
<li><strong>Diccionarios de texto completo personalizados:</strong> Registra diccionarios, sinónimos y recursos de palabras vacías en el clúster para tokenización multilingüe y específica del dominio.</li>
<li><strong>Woodpecker independiente:</strong> Ejecuta el registro write-ahead de Milvus como un servicio escalable y observable de forma independiente.</li>
<li><strong>Entidad</strong> <strong>TTL****:</strong> Expira registros individuales mediante un campo TIMESTAMPTZ, con filtrado MVCC seguido de recolección de basura durante la compactación.</li>
<li><strong>ForceMerge:</strong> Compacta segmentos pequeños a un tamaño objetivo y reconstruye índices para reducir la amplificación de lectura antes de un servicio sostenido con muchas lecturas.</li>
<li>Y más</li>
</ul>
<h2 id="Get-started-with-Milvus-30" class="common-anchor-header">Empieza con Milvus 3.0<button data-href="#Get-started-with-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 está disponible hoy bajo la licencia Apache 2.0 y sigue siendo un proyecto de LF AI &amp; Data. Para empezar:</p>
<ul>
<li>Lee las <a href="https://milvus.io/docs/release_notes.md">notas de la versión</a> y la <a href="https://milvus.io/docs/quickstart.md">guía de inicio rápido</a>, y obtén el código fuente en <a href="https://github.com/milvus-io/milvus">github.com/milvus-io/milvus</a>.</li>
<li>Únete a la <a href="https://discord.com/invite/8uyFbECzPX">comunidad de Milvus en Discord</a> o reserva una sesión de <a href="https://milvus.io/office-hours">Milvus Office Hours</a> para hablar sobre tu caso de uso con los mantenedores.</li>
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
    </button></h2><p>Milvus 3.0 establece la base de código abierto para la recuperación de IA en producción y la arquitectura emergente <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Vector Lakebase</a>, que combina almacenamiento nativo de lake con recuperación vectorial de alto rendimiento sobre una única fuente de verdad, cada uno al coste adecuado.</p>
<p><a href="https://zilliz.com/">Zilliz Cloud</a> es un Vector Lakebase totalmente gestionado creado por el equipo detrás de Milvus. Comparte la misma arquitectura distribuida y nativa de lake que Milvus y es totalmente compatible con la API de Milvus. Impulsado por su motor de indexación propietario Cardinal, Zilliz Cloud ofrece hasta 10× mejor relación precio-rendimiento que los enfoques estándar de indexación de código abierto, al tiempo que elimina la complejidad operativa de gestionar infraestructura. Las capacidades empresariales incluyen cómputo scale-to-zero, recuperación ante desastres entre regiones, despliegue BYOC, seguridad y cumplimiento de nivel empresarial (SOC 2, HIPAA, ISO 27001 y GDPR), y hasta un SLA del 99,99 %.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_12_08d1c21d25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Los desarrolladores pueden desplegar Milvus como una base de datos vectorial de código abierto o usar <a href="https://zilliz.com/">Zilliz Cloud</a> para una plataforma gestionada en múltiples cargas de trabajo a lo largo del ciclo de vida de los datos de IA.</p>
<h2 id="What-comes-next" class="common-anchor-header">Qué viene después<button data-href="#What-comes-next" class="anchor-icon" translate="no">
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
    </button></h2><p>La hoja de ruta de Milvus se basa en la arquitectura 3.0 con predicate pushdown para colecciones externas, backfill externo, operadores Spark adicionales y compatibilidad con más formatos de tabla, incluidos Delta Lake y Apache Paimon.</p>
<p>La dirección general está clara: los sistemas de datos de IA necesitan un bucle más estrecho entre la recuperación online y la mejora de datos offline. Los datos vectoriales no deberían tener que copiarse en sistemas separados cada vez que los equipos quieran buscarlos, analizarlos, mejorarlos o servirlos.</p>
