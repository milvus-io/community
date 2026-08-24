---
id: milvus-3-0-external-collection.md
title: >-
  Colección Externa de Milvus: Indexa y Recupera Datos Residentes en el Lago Sin
  Moverlos
author: Leo Liu
date: 2026-8-24
cover: assets.zilliz.com/blog_cover_external_collection_3e4d7334de.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  External Collection, Milvus 3.0, vector search on data lake, Iceberg vector
  search, Vector Lakebase
meta_title: >
  Milvus External Collection: Index and Retrieve Lake-Resident Data Without
  Moving It
desc: >-
  Milvus 3.0 introdujo External Collection, lo que permite a Milvus construir
  índices y proporcionar recuperación sobre datos que permanecen en el data
  lake.
origin: 'https://milvus.io/blog/milvus-3-0-external-collection.md'
---
<p>En muchos pipelines de IA, los embeddings y los metadatos ya se producen y almacenan en un data lake. Un pipeline de productos podría escribir atributos de producto y embeddings multimodales en archivos Parquet en S3. Un corpus de recuperación o entrenamiento podría vivir en una tabla Iceberg o Lance. El lake ya es el lugar donde estos conjuntos de datos se generan, actualizan, versionan y utilizan por el resto del stack de datos.</p>
<p>Las bases de datos vectoriales, sin embargo, se han construido tradicionalmente en torno a una copia de servicio propiedad de la base de datos. Si los equipos querían búsqueda vectorial de baja latencia sobre datos ya ubicados en un lake, generalmente tenían dos opciones:</p>
<ul>
<li><strong>Copiar los datos en una base de datos vectorial.</strong> Esto proporciona índices ANN y una ruta de servicio de producción, pero crea una segunda copia del conjunto de datos y un pipeline ETL que debe mantenerse sincronizado con la fuente.</li>
<li><strong>Consultar el lake directamente.</strong> Esto evita la duplicación, pero sin una capa de indexación y servicio ANN, la búsqueda vectorial recurre a escaneos que no están diseñados para la latencia de producción.</li>
</ul>
<p><strong>Milvus 3.0</strong> <a href="https://milvus.io/docs/create-an-external-collection.md"><strong>External Collection</strong></a> <strong>introduce una tercera vía.</strong> Los datos fuente permanecen en Parquet, Iceberg, Lance, Vortex u otro formato externo compatible, mientras Milvus construye y sirve índices sobre ellos. Mapeas los campos externos en un esquema de Milvus, defines los índices que necesitas, refrescas la colección y usas las API normales de búsqueda y consulta de Milvus, sin copiar primero las filas fuente a una colección gestionada por Milvus.</p>
<p>El cambio arquitectónico es sencillo: los datos pueden permanecer en el lake, mientras Milvus añade la capa de indexación y recuperación.</p>
<p>Eso también convierte a External Collection en un paso importante hacia <a href="https://zilliz.com/blog/what-is-a-vector-lakebase"><strong>Vector Lakebase</strong></a><strong>,</strong> una arquitectura de datos unificada y nativa del lake para IA que combina el servicio de grado de base de datos vectorial con almacenamiento abierto en lake, índices reutilizables a nivel de lake y una capa semántica compartida. La recuperación en línea ya no tiene que partir de una copia de servicio separada mientras Spark, los pipelines de entrenamiento, los trabajos de evaluación y las herramientas de gobernanza operan sobre otra versión de los datos. Pueden trabajar desde la misma capa de datos residente en el lake.</p>
<h2 id="What-an-External-Collection-is-and-what-it-changes" class="common-anchor-header">Qué es una External Collection y qué cambia<button data-href="#What-an-External-Collection-is-and-what-it-changes" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Una External Collection</strong> es un tipo de colección de Milvus cuyos datos fuente viven fuera del almacenamiento gestionado por Milvus.</p>
<p>Sin una External Collection, poner ese catálogo detrás de la búsqueda vectorial de producción normalmente significa crear otra copia en Milvus:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_2_333b278a04.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Cada vez que el catálogo cambia, el modelo de embeddings cambia o un campo se rellena retroactivamente, otro pipeline tiene que mover los datos actualizados a través de ese límite.</p>
<p>Con External Collection, la arquitectura se convierte en:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_3_71172afb44.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus <strong>no</strong> convierte los archivos externos en su propia copia de datos fuente. En cambio, la External Collection contiene la información que Milvus necesita para interpretarlos y buscarlos:</p>
<ol>
<li>Un <code translate="no">external_source</code> que identifica los archivos o tabla externos.</li>
<li>Un <code translate="no">external_spec</code> que describe el formato de la fuente y el acceso al almacenamiento.</li>
<li>Mapeos de <code translate="no">external_field</code> que conectan campos del esquema de Milvus con columnas del conjunto de datos externo.</li>
<li>Los índices, manifiestos y estado de servicio que Milvus crea para la recuperación.</li>
</ol>
<p><strong>Que los datos fuente tengan cero copias no significa que no haya estado dentro de Milvus.</strong> Milvus sigue construyendo índices. Sigue usando cómputo. Sigue almacenando en caché. El cambio es que las filas autoritativas ya no tienen que copiarse en Milvus simplemente porque necesitas que Milvus las busque.</p>
<h3 id="Normal-Milvus-Collection-vs-External-Collection" class="common-anchor-header">Colección normal de Milvus vs. External Collection<button data-href="#Normal-Milvus-Collection-vs-External-Collection" class="anchor-icon" translate="no">
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
    </button></h3><table>
<thead>
<tr><th><strong>Aspecto</strong></th><th><strong>Colección gestionada por Milvus</strong></th><th><strong>External Collection</strong></th></tr>
</thead>
<tbody>
<tr><td>Registros fuente</td><td>Almacenados y gestionados por Milvus</td><td>Permanecen en los archivos o tabla externos</td></tr>
<tr><td>Cómo entran los datos en Milvus</td><td>Insert, upsert, importación o escritura en streaming</td><td>Mapeo de fuente externa + Refresh</td></tr>
<tr><td>Mutaciones en línea</td><td>Compatible</td><td>Solo lectura desde Milvus</td></tr>
<tr><td>Frescura</td><td>Sigue la ruta de escritura de Milvus y el modelo de consistencia</td><td>Sigue la última publicación de Refresh exitosa</td></tr>
<tr><td>Estado gestionado por Milvus</td><td>Datos fuente, metadatos, índices, cachés</td><td>Mapeos, manifiestos, índices, cachés</td></tr>
<tr><td>Ruta de consulta</td><td>API de búsqueda y consulta de Milvus</td><td>API de búsqueda y consulta de Milvus</td></tr>
<tr><td>Mejor ajuste</td><td>Datos en línea que cambian continuamente</td><td>Datos de lake grandes, producidos por lotes y con mucha lectura</td></tr>
</tbody>
</table>
<p>Por tanto, External Collection complementa las colecciones normales de Milvus en lugar de reemplazarlas.</p>
<p>Un sistema puede mantener estado en línea que cambia rápidamente en colecciones normales de Milvus y usar External Collections para corpus grandes, catálogos, conjuntos de datos históricos, características de modelos u otros datos ya producidos y gobernados en el lake.</p>
<h2 id="Why-removing-the-second-copy-matters" class="common-anchor-header">Por qué es importante eliminar la segunda copia<button data-href="#Why-removing-the-second-copy-matters" class="anchor-icon" translate="no">
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
    </button></h2><p>Puede resultar tentador describir External Collections como una optimización de almacenamiento: no copiar varios terabytes de datos a otra base de datos y así ahorrar almacenamiento. Eso es útil, pero no es el principal problema arquitectónico.</p>
<p><strong>El mayor costo proviene de mantener dos sistemas de datos alineados.</strong></p>
<p>Consideremos de nuevo el catálogo de productos. La plataforma de datos produce el conjunto de datos Parquet autoritativo. La búsqueda lo importa a una base de datos vectorial. Un equipo de recomendación puede leer los mismos datos del lake mediante Spark para análisis fuera de línea. Un nuevo modelo de embeddings genera entonces una columna vectorial de reemplazo. El inventario y los metadatos siguen cambiando simultáneamente.</p>
<p>Una vez que la copia de servicio en línea se independiza del lake, cada cambio tiene que cruzar ese límite:</p>
<ul>
<li>los datos deben copiarse;</li>
<li>la transferencia debe programarse y monitorizarse;</li>
<li>los trabajos fallidos necesitan reintentos;</li>
<li>los esquemas y permisos pueden necesitar representarse en múltiples sistemas;</li>
<li>la frescura depende de la rapidez con que el pipeline de sincronización se ponga al día;</li>
<li>los equipos tienen que saber qué copia representa la versión que realmente quieren.</li>
</ul>
<p>El almacenamiento es solo una partida.</p>
<table>
<thead>
<tr><th><strong>Costo</strong></th><th><strong>Lake separado + copia de servicio</strong></th><th><strong>External Collection</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Copias de datos fuente</strong></td><td>Copia en el lake más una copia de servicio separada</td><td>Las filas fuente permanecen en el lake</td></tr>
<tr><td><strong>Movimiento de datos</strong></td><td>Pipeline ETL/importación persistente</td><td>Refresh sobre la fuente externa</td></tr>
<tr><td><strong>Frescura</strong></td><td>Depende de la cadencia de exportación/importación</td><td>Controlada por el momento en que se publica un nuevo Refresh</td></tr>
<tr><td><strong>Gobernanza</strong></td><td>La copia fuente y la de servicio deben mantenerse alineadas</td><td>La propiedad, el linaje y el versionado de la fuente permanecen en la plataforma de lake</td></tr>
<tr><td><strong>Reutilización fuera de línea</strong></td><td>Otros consumidores pueden preparar sus propias copias</td><td>Las herramientas existentes del lake pueden seguir leyendo la misma fuente</td></tr>
<tr><td><strong>Recursos de servicio</strong></td><td>Dimensionados en torno a la copia de la base de datos y la carga de consultas</td><td>La indexación, el cómputo de consultas y las cachés pueden gestionarse por separado de la propiedad de las filas fuente</td></tr>
</tbody>
</table>
<p>La diferencia se vuelve especialmente importante a medida que los datos de IA cambian con más frecuencia.</p>
<p>Los equipos deduplican corpus. Agrupan datos para análisis. Generan nuevos embeddings cuando cambia un modelo. Añaden etiquetas, resúmenes, entidades extraídas, puntuaciones de calidad o señales de retroalimentación. Ejecutan trabajos de evaluación y pipelines de limpieza de datos sobre el mismo corpus del que las aplicaciones de producción recuperan.</p>
<p>Si cada sistema es dueño de su propia copia, cada mejora se convierte en otro trabajo de sincronización.</p>
<p>External Collection cambia ese límite: <strong>los sistemas fuera de línea pueden seguir trabajando sobre el dataset del lake, mientras Milvus sirve la recuperación sobre la misma base.</strong></p>
<h2 id="What-data-sources-External-Collection-supports" class="common-anchor-header">Qué fuentes de datos admite External Collection<button data-href="#What-data-sources-External-Collection-supports" class="anchor-icon" translate="no">
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
    </button></h2><p>External Collection está diseñada en torno a datos abiertos y gestionados externamente, no a un diseño de fuente específico de Milvus. Admite múltiples formatos de fuente externa a través de <a href="https://milvus.io/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md">Storage V3</a>:</p>
<table>
<thead>
<tr><th><strong>Formato externo</strong></th><th><strong>Valor de format</strong></th><th><strong>Lo que Milvus lee</strong></th></tr>
</thead>
<tbody>
<tr><td>Apache Parquet</td><td>parquet</td><td>Un directorio o prefijo de almacenamiento de objetos que contiene archivos Parquet y row groups</td></tr>
<tr><td>Vortex</td><td>vortex</td><td>Archivos Vortex y sus metadatos de layout</td></tr>
<tr><td>Lance</td><td>lance-table</td><td>Un dataset Lance y sus metadatos de fragmentos</td></tr>
<tr><td>Apache Iceberg</td><td>iceberg-table</td><td>Metadatos de Iceberg más una instantánea seleccionada</td></tr>
<tr><td>Milvus snapshot</td><td>milvus-table</td><td>Una instantánea de Milvus compatible expuesta como fuente externa</td></tr>
</tbody>
</table>
<p>El mapeo entre la fuente y Milvus es explícito.</p>
<p>Una columna fuente llamada <code translate="no">product_id</code> puede convertirse en el campo <code translate="no">id</code> de Milvus; <code translate="no">image_vec</code> puede convertirse en <code translate="no">embedding</code>; y una tabla fuente amplia no necesita exponer todas sus columnas a la colección. Eso significa que la plataforma de datos no tiene que renombrar ni reescribir su fuente solo para satisfacer a la base de datos de servicio.</p>
<p>Los formatos versionados añaden otra propiedad útil. Con una fuente como Iceberg, la colección puede apuntar a una instantánea concreta en lugar de a lo que sea actual cuando se ejecuta la consulta. Una versión fija de la fuente es útil para evaluación repetible, pruebas de regresión, análisis histórico y cargas de trabajo de auditoría.</p>
<p>Los archivos subyacentes también siguen siendo utilizables por el resto del stack de datos. Spark, los frameworks de entrenamiento, los sistemas de gobernanza y otras herramientas compatibles con lake pueden seguir leyendo los mismos datos abiertos.</p>
<p>External Collection añade otro consumidor de esos datos; no convierte a Milvus en su único propietario.</p>
<h3 id="Accessing-external-storage-securely" class="common-anchor-header">Acceso seguro al almacenamiento externo<button data-href="#Accessing-external-storage-securely" class="anchor-icon" translate="no">
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
    </button></h3><p>Milvus también necesita permiso para leer el almacenamiento externo.</p>
<p>Según el proveedor de almacenamiento, los despliegues pueden usar mecanismos como identidad de carga de trabajo o de instancia, asunción de roles AWS STS, suplantación de cuentas de servicio, acceso basado en SAS o sistemas de roles específicos del proveedor, en lugar de incrustar credenciales de larga duración en la configuración de la aplicación.</p>
<p>Esta identidad de almacenamiento controla cómo llega Milvus a la fuente. La autorización dentro de Milvus sigue siendo un límite de seguridad separado.</p>
<h2 id="How-to-create-index-refresh-and-query-an-external-collection" class="common-anchor-header">Cómo crear, indexar, refrescar y consultar una External Collection<button data-href="#How-to-create-index-refresh-and-query-an-external-collection" class="anchor-icon" translate="no">
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
    </button></h2><p>El ciclo de vida de una External Collection tiene cuatro pasos principales:</p>
<ol>
<li>Definir la fuente externa y mapear sus columnas en un esquema de Milvus.</li>
<li>Definir los índices que necesita la carga de trabajo.</li>
<li>Ejecutar Refresh para que Milvus descubra los datos fuente y prepare una versión consultable.</li>
<li>Cargar la colección y usar las API normales de búsqueda y consulta de Milvus.</li>
</ol>
<p>Aquí está el mismo catálogo de productos representado como una External Collection:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> time

<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">DataType</span>, <span class="hljs-title class_">MilvusClient</span>

client = <span class="hljs-title class_">MilvusClient</span>(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>,
)

schema = client.<span class="hljs-title function_">create_schema</span>(
    external_source=<span class="hljs-string">&quot;s3://my-lake/datasets/products/&quot;</span>,
    external_spec=json.<span class="hljs-title function_">dumps</span>(
        {
            <span class="hljs-string">&quot;format&quot;</span>: <span class="hljs-string">&quot;parquet&quot;</span>,
            <span class="hljs-string">&quot;extfs&quot;</span>: {
                <span class="hljs-string">&quot;cloud_provider&quot;</span>: <span class="hljs-string">&quot;aws&quot;</span>,
                <span class="hljs-string">&quot;region&quot;</span>: <span class="hljs-string">&quot;us-east-1&quot;</span>,
                <span class="hljs-string">&quot;use_iam&quot;</span>: <span class="hljs-string">&quot;true&quot;</span>,
                <span class="hljs-string">&quot;iam_endpoint&quot;</span>: <span class="hljs-string">&quot;https://sts.us-east-1.amazonaws.com&quot;</span>,
            },
        }
    ),
)

schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">INT64</span>,
    external_field=<span class="hljs-string">&quot;product_id&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">FLOAT_VECTOR</span>,
    dim=<span class="hljs-number">768</span>,
    external_field=<span class="hljs-string">&quot;image_vec&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;title&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">VARCHAR</span>,
    max_length=<span class="hljs-number">256</span>,
    external_field=<span class="hljs-string">&quot;product_name&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;stock&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">INT64</span>,
    external_field=<span class="hljs-string">&quot;stock&quot;</span>,
)
schema.<span class="hljs-title function_">add_field</span>(
    field_name=<span class="hljs-string">&quot;rating&quot;</span>,
    datatype=<span class="hljs-title class_">DataType</span>.<span class="hljs-property">FLOAT</span>,
    external_field=<span class="hljs-string">&quot;rating&quot;</span>,
)

client.<span class="hljs-title function_">create_collection</span>(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    schema=schema,
)
<button class="copy-code-btn"></button></code></pre>
<p>Los índices usan la interfaz normal de Milvus:</p>
<pre><code translate="no" class="language-python">index_params = client.<span class="hljs-title function_">prepare_index_params</span>()
index_params.<span class="hljs-title function_">add_index</span>(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
)
index_params.<span class="hljs-title function_">add_index</span>(field_name=<span class="hljs-string">&quot;stock&quot;</span>, index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>)
index_params.<span class="hljs-title function_">add_index</span>(field_name=<span class="hljs-string">&quot;rating&quot;</span>, index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>)

client.<span class="hljs-title function_">create_index</span>(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    index_params=index_params,
)
<button class="copy-code-btn"></button></code></pre>
<p>Luego, refresca la fuente externa:</p>
<pre><code translate="no" class="language-python">job_id = client.refresh_external_collection(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
)

<span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
    progress = client.get_refresh_external_collection_progress(job_id=job_id)
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshCompleted&quot;</span>:
        <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshFailed&quot;</span>:
        <span class="hljs-keyword">raise</span> RuntimeError(progress.reason)
    time.sleep(<span class="hljs-number">2</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Una vez que la versión refrescada esté lista, cárgala y búscala como una colección normal de Milvus:</p>
<pre><code translate="no" class="language-python">client.load_collection(<span class="hljs-string">&quot;products_ext&quot;</span>)

results = client.search(
    collection_name=<span class="hljs-string">&quot;products_ext&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;stock &gt; 0 and rating &gt;= 4.0&quot;</span>,
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;stock&quot;</span>, <span class="hljs-string">&quot;rating&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>La diferencia importante no está en la llamada de búsqueda. Está en dónde comienza el ciclo de vida. Una colección gestionada por Milvus comienza con datos que se escriben o importan en Milvus. Una External Collection comienza con una referencia a datos que ya existen en otro lugar.</p>
<h2 id="How-Refresh-picks-up-changes-in-external-data" class="common-anchor-header">Cómo Refresh detecta cambios en los datos externos<button data-href="#How-Refresh-picks-up-changes-in-external-data" class="anchor-icon" translate="no">
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
    </button></h2><p>External Collection es de solo lectura desde el lado de Milvus, pero el dataset del lake subyacente no tiene que permanecer congelado para siempre.</p>
<p>Supongamos que el pipeline de productos agrega otro lote, actualiza metadatos o escribe embeddings de un nuevo modelo. Milvus no sigue continuamente cada objeto que aparece en la ruta de la fuente. Esos cambios se vuelven visibles a través de <strong>Refresh</strong>.</p>
<p>Refresh lee los metadatos externos, resuelve los fragmentos de la fuente, actualiza los manifiestos que los conectan con la colección de Milvus y prepara el estado de índice correspondiente.</p>
<p>La clave es que este trabajo puede ser incremental.</p>
<p>Milvus identifica los fragmentos de la fuente que no han cambiado y puede reutilizar el trabajo de segmento e índice existente. Los fragmentos nuevos o modificados son las partes que requieren nuevo procesamiento.</p>
<p>Por lo tanto, un pequeño cambio en un conjunto de datos de varios terabytes no tiene que provocar otra importación completa y otra reconstrucción completa del índice.</p>
<p>Refresh también le da al sistema de servicio un límite de versión claro. Mientras se prepara una nueva versión, las consultas siguen usando el estado publicado anteriormente. Una vez que Refresh se completa, el nuevo estado queda disponible como una versión completa, en lugar de exponer una mezcla de datos antiguos y parcialmente preparados.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_4_46aaa22589.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Este modelo encaja de forma natural con compilaciones de catálogo por hora, actualizaciones nocturnas de bases de conocimiento, refrescos periódicos de embeddings, pipelines de características generadas por modelos y cargas de trabajo similares orientadas a lotes.</p>
<p><strong>No</strong> reemplaza una ruta de escritura en streaming. Si cada inserción o borrado debe volverse buscable a través de Milvus de inmediato, una colección gestionada sigue siendo el mejor modelo.</p>
<h2 id="How-Lazy-Loading-reduces-memory-use-for-wide-datasets" class="common-anchor-header">Cómo Lazy Loading reduce el uso de memoria en conjuntos de datos anchos<button data-href="#How-Lazy-Loading-reduces-memory-use-for-wide-datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>Mantener las filas fuente en el almacenamiento de objetos solo ayuda si la capa de servicio no tiene que cargar cada byte localmente antes de poder responder consultas. Con Milvus Tiered Storage habilitado, no es así.</p>
<p>En el momento de cargar la colección, los QueryNodes pueden mantener inicialmente solo metadatos ligeros, como información de esquema, definiciones de índices, mapas de chunks y referencias a objetos remotos. Los datos de los campos se obtienen a nivel de chunk cuando una consulta los necesita; los índices pueden permanecer remotos hasta su primer uso y luego almacenarse en caché localmente. Los datos de uso frecuente permanecen activos, mientras que los datos menos accedidos pueden ser expulsados.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_5_145b2aa0c7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Esto es especialmente útil para conjuntos de datos de IA anchos.</p>
<p>Una fila de producto puede contener varios embeddings, una descripción larga, JSON sin procesar, metadatos de imagen, resúmenes generados, inventario, precios, calificaciones y muchos otros atributos. Una búsqueda de similitud típica puede tocar solo un vector más inventario, precio y calificación. No hay razón para que todos los demás campos ocupen permanentemente memoria de servicio solo porque pertenecen al mismo registro.</p>
<p>External Collection puede reducir la huella de servicio en dos niveles:</p>
<ul>
<li><strong>Primero, proyección a nivel de esquema.</strong> Mediante <code translate="no">external_field</code>, la External Collection puede exponer solo las columnas fuente que la aplicación necesita. Las demás columnas permanecen en el dataset del lake y no se incluyen en este esquema de servicio.</li>
<li><strong>Segundo, proyección en tiempo de ejecución.</strong> Bajo el modelo de servicio en niveles, los QueryNodes obtienen y almacenan en caché los campos e índices que la carga de trabajo realmente necesita, en lugar de cargar todo el dataset mapeado por adelantado.</li>
</ul>
<p>En otras palabras, <strong>el dataset puede permanecer ancho en el lake sin obligar a que la huella de servicio sea igualmente ancha.</strong></p>
<p>Hay una compensación obvia. Una consulta que alcanza un campo o índice frío puede pagar un costo de lectura remota en el primer acceso. Las políticas de calentamiento pueden precargar campos o índices críticos para la latencia, mientras que las políticas de caché y expulsión evitan que el estado menos accedido ocupe recursos locales indefinidamente.</p>
<p>El punto no es que el almacenamiento de objetos se comporte como RAM. Es que la memoria y el disco local pueden seguir el conjunto de trabajo de la carga de recuperación, en lugar del tamaño total y la anchura del dataset fuente.</p>
<p>El formato fuente también importa aquí. Los formatos diseñados para escaneos analíticos amplios y los formatos optimizados para lecturas más estrechas o aleatorias pueden producir un comportamiento de E/S diferente bajo acceso bajo demanda. External Collection no borra esas compensaciones a nivel de almacenamiento; permite que Milvus construya una capa de recuperación sobre ellas.</p>
<h2 id="What-search-and-indexing-capabilities-External-Collection-supports" class="common-anchor-header">Qué capacidades de búsqueda e indexación admite External Collection<button data-href="#What-search-and-indexing-capabilities-External-Collection-supports" class="anchor-icon" translate="no">
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
    </button></h2><p>External Collection no se limita a apuntar a Milvus a un directorio de embeddings y escanear los archivos. Milvus construye estructuras de recuperación sobre datos externos y ejecuta consultas a través de su motor de recuperación estándar.</p>
<h3 id="Milvus-indexes-built-over-external-data" class="common-anchor-header">Índices de Milvus construidos sobre datos externos<button data-href="#Milvus-indexes-built-over-external-data" class="anchor-icon" translate="no">
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
    </button></h3><p>Según los campos y la carga de trabajo, Milvus puede construir:</p>
<ul>
<li>índices vectoriales para búsqueda ANN;</li>
<li>índices escalares para filtrado de metadatos;</li>
<li>índices JSON para atributos semiestructurados;</li>
<li>índices BM25 y de texto completo para recuperación léxica.</li>
<li>Campos generados por funciones compatibles con el modelo de datos de Milvus.</li>
</ul>
<p>La búsqueda ANN usa esos índices para reducir el conjunto de candidatos en lugar de leer cada vector fuente.</p>
<p>Esa distinción importa porque almacenar un embedding en un lake no es lo mismo que operar una base de datos vectorial sobre él. La persistencia te da bytes. La recuperación en producción también necesita índices, planificación de consultas, filtrado, ranking, caché y una ruta de servicio de baja latencia.</p>
<h3 id="Beyond-vector-top-K" class="common-anchor-header">Más allá del top-K vectorial<button data-href="#Beyond-vector-top-K" class="anchor-icon" translate="no">
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
    </button></h3><p>Otro error común es leer «External Collection» como «búsqueda vectorial sobre Parquet». Eso no hace justicia a lo que la recuperación en producción realmente requiere.</p>
<p>Un resultado de búsqueda en producción rara vez depende solo de la similitud vectorial. También puede depender de términos exactos, política de acceso, inventario, timestamp, categoría, precio, calidad de la fuente o señales de ranking de negocio.</p>
<p>Considere una consulta como:</p>
<table>
<thead>
<tr><th>vestido floral rojo para verano, en stock, mejor calificado primero</th></tr>
</thead>
<tbody>
</tbody>
</table>
<p>Una ruta de recuperación en producción puede necesitar varias señales:</p>
<ul>
<li><strong>Similitud vectorial</strong> para el significado semántico de «vestido floral de verano».</li>
<li><strong>Búsqueda léxica o de texto completo</strong> para un término exacto como «rojo».</li>
<li><strong>Filtros escalares</strong> para eliminar productos agotados o por debajo de un umbral de calificación.</li>
<li><strong>Recuperación híbrida y ranking</strong> para combinar múltiples señales de recuperación.</li>
</ul>
<p>Milvus 3.0 también expande el motor de consultas más allá de la recuperación inicial de vecinos más cercanos con capacidades como <strong>ordenamiento, agregación y facetado en el servidor</strong>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_6_d805a24b72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>El punto más amplio es que External Collection da a los datos residentes en el lake una ruta de recuperación de nivel de base de datos, no solo una forma de leer vectores desde archivos.</p>
<h2 id="How-the-same-lake-data-supports-online-serving-and-offline-processing" class="common-anchor-header">Cómo los mismos datos del lake admiten servicio en línea y procesamiento fuera de línea<button data-href="#How-the-same-lake-data-supports-online-serving-and-offline-processing" class="anchor-icon" translate="no">
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
    </button></h2><p>La razón arquitectónica más fuerte para mantener la fuente en un formato de lake abierto no es simplemente que una segunda copia cueste dinero. Es que el mismo dataset puede seguir disponible para los sistemas que lo mejoran continuamente.</p>
<p>Volvamos al catálogo de productos.</p>
<p>Durante el día, Milvus puede servir una External Collection para búsqueda de productos, recomendaciones o recuperación para agentes.</p>
<p>Al mismo tiempo, otros sistemas pueden trabajar directamente sobre el dataset del lake:</p>
<ul>
<li>Spark puede identificar productos duplicados.</li>
<li>Un pipeline de entrenamiento puede generar embeddings con un nuevo modelo.</li>
<li>Un trabajo de calidad de datos puede detectar registros malformados o anómalos.</li>
<li>Un pipeline de evaluación puede comparar la calidad de recuperación entre versiones de modelos.</li>
<li>Un proceso por lotes puede generar resúmenes, etiquetas o metadatos adicionales.</li>
</ul>
<p>External Collection <strong>no</strong> ejecuta esos trabajos por sí misma. Spark sigue siendo Spark; el entrenamiento sigue siendo entrenamiento. Su rol es eliminar el límite adicional de datos de servicio entre ellos.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_30_external_collection_vector_search_on_lake_resident_data_without_a_second_copy_md_7_df2791e199.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>El trabajo fuera de línea puede escribir datos mejorados o nuevos campos de vuelta al lake. Un Refresh posterior hace que la fuente actualizada esté disponible para la ruta de recuperación de Milvus.</p>
<p>No hay un bucle separado de exportación e importación cuyo único propósito sea reconstruir otra copia autoritativa para el servicio.</p>
<p>La gobernanza también se mantiene claramente dividida. Las versiones de la fuente, el linaje y la propiedad de la fuente permanecen en la plataforma de lake. Milvus mantiene su propia autorización a nivel de colección y las credenciales necesarias para leer la fuente. Compartir una única capa de datos no significa colapsar todos los dominios de seguridad en un solo sistema.</p>
<p>Esta es la conexión con <a href="https://zilliz.com/blog/what-is-a-vector-lakebase"><strong>Vector Lakebase</strong></a>: el lake sigue siendo la capa de datos compartida, mientras Milvus proporciona una capa de recuperación de baja latencia sobre él. External Collection es una parte de esa arquitectura, junto con Storage V3, Snapshots, integración con Spark, evolución de esquemas y backfill.</p>
<h2 id="Where-External-Collection-fitsand-where-it-does-not" class="common-anchor-header">Dónde encaja External Collection, y dónde no<button data-href="#Where-External-Collection-fitsand-where-it-does-not" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>External Collection es una opción muy adecuada cuando:</strong></p>
<ul>
<li>Tus datos autoritativos ya viven en Parquet, Vortex, Lance, Iceberg u otra fuente externa compatible.</li>
<li>El dataset se produce principalmente por lotes, no mediante escrituras transaccionales de alta frecuencia.</li>
<li>Mantener una segunda copia de servicio genera una sobrecarga significativa de ETL, frescura o gobernanza.</li>
<li>Múltiples sistemas necesitan trabajar con el mismo dataset abierto.</li>
<li>Un límite de Refresh explícito es aceptable para la frescura del servicio.</li>
<li>Quieres recuperación de producción con Milvus sin convertir a Milvus en el propietario de las filas fuente.</li>
</ul>
<p><strong>Una colección normal de Milvus sigue siendo la mejor opción cuando:</strong></p>
<ul>
<li>la aplicación inserta o actualiza (upsert) registros continuamente;</li>
<li>los borrados deben hacerse visibles a través de la ruta de escritura en línea;</li>
<li>la carga de trabajo depende de características de colección no disponibles para esquemas externos;</li>
<li>el diseño de servicio mantiene intencionalmente todos los datos requeridos en memoria, evitando fallos de caché remotos.</li>
</ul>
<p><strong>Vale la pena tener en cuenta varios límites.</strong></p>
<ul>
<li><strong>Las External Collections son de solo lectura.</strong> Los cambios en la fuente ocurren fuera de Milvus.</li>
<li><strong>El cero copias se aplica a las filas fuente.</strong> Los índices, manifiestos, cachés y cómputo siguen costando recursos.</li>
<li><strong>Refresh es explícito.</strong> No es un mecanismo de sincronización en streaming.</li>
<li><strong>La fuente debe permanecer accesible.</strong> El comportamiento de búsqueda, indexación y refresh sigue dependiendo del acceso al almacenamiento y las credenciales.</li>
<li><strong>Storage V3 es obligatorio.</strong> En Milvus 3.0 de código abierto, debe estar habilitado antes de usar External Collection.</li>
<li><strong>External Collection no reemplaza el procesamiento upstream.</strong> La generación de embeddings, el clustering, la deduplicación y la limpieza de datos siguen ocurriendo en los sistemas upstream apropiados.</li>
</ul>
<p>La elección es, por tanto, complementaria más que binaria. Un sistema puede usar colecciones normales de Milvus para el estado en línea que cambia rápidamente y External Collections para conjuntos de datos grandes y producidos por lotes cuyo hogar natural es el lake.</p>
<h2 id="Try-External-Collection-in-Milvus-30" class="common-anchor-header">Prueba External Collection en Milvus 3.0<button data-href="#Try-External-Collection-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>External Collection está disponible en Milvus 3.0. Comienza con un dataset de lake representativo y evalúa los aspectos que importan para tu carga de trabajo: refresh inicial e incremental, costo de construcción de índices, comportamiento de consultas en caliente y en frío, y el intervalo de frescura que tu aplicación requiere.</p>
<p>Para detalles de implementación, consulta:</p>
<ul>
<li><a href="https://milvus.io/docs/create-an-external-collection.md">Crear una External Collection</a></li>
<li><a href="https://milvus.io/docs/release_notes.md">Notas de la versión de Milvus 3.0</a></li>
<li><a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">Blog de lanzamiento de Milvus 3.0</a></li>
</ul>
<p>Si prefieres una ruta gestionada, External Collection también está disponible como parte de <strong>Zilliz Vector Lakebase</strong> en Zilliz Cloud. Consulta:</p>
<ul>
<li><a href="https://docs.zilliz.com/docs/external-collection">External Collection en Zilliz Cloud</a></li>
<li><a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">De base de datos vectorial a Vector Lakebase</a></li>
<li><a href="https://zilliz.com/blog/why-we-built-vector-lakebase">Por qué construimos Vector Lakebase: repensando la arquitectura de datos no estructurados para la IA</a></li>
</ul>
<p>También puedes llevar preguntas de implementación o comentarios al <a href="https://github.com/milvus-io/milvus">repositorio de Milvus en GitHub</a> o a la <a href="https://discord.com/invite/8uyFbECzPX">comunidad de Milvus en Discord</a>.</p>
