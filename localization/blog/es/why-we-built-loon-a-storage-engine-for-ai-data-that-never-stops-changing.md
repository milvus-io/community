---
id: why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md
title: >
  Por qué creamos Loon: un motor de almacenamiento para datos de IA que nunca
  deja de cambiar.
author: Ted Xu
date: 2026-6-5
cover: assets.zilliz.com/Loon_New_Cover_8270435335.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 3.0, Zilliz Vector Lakebase, vector storage, AI datasets, Vortex'
meta_title: |
  AI Datasets Are Never Done. So We Built Loon.
desc: >
  Loon es un nuevo motor de almacenamiento para Milvus 3.0 y Zilliz Vector
  Lakebase, diseñado para gestionar conjuntos de datos vectoriales en constante
  evolución mediante ColumnGroups, alineación de identificadores de fila y
  manifiestos.
origin: >-
  https://zilliz.com/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing
---
<p><em>Este blog se publicó originalmente en zilliz.com y se ha vuelto a publicar con permiso.</em></p>
<h2 id="Key-takeaways" class="common-anchor-header">Puntos clave<button data-href="#Key-takeaways" class="anchor-icon" translate="no">
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
    </button></h2><p>Se trata de un análisis técnico extenso y en profundidad, así que aquí tienes los puntos clave antes de entrar en detalles.</p>
<ul>
<li>Los conjuntos de datos de IA no son tablas estáticas. Las mismas filas cambian constantemente a medida que los equipos sustituyen modelos de incrustación, añaden vectores dispersos, revisan leyendas, rellenan etiquetas, reconstruyen índices y ejecutan análisis fuera de línea.</li>
<li>Los diseños de almacenamiento tradicionales presentan tres limitaciones: las columnas de vectores largos encarecen el rellenado de datos, un único formato de archivo no puede dar un buen servicio tanto para escaneos como para lecturas puntuales, y el almacenamiento en bases de datos privadas obliga a los flujos de trabajo externos a crear copias adicionales de los datos originales.</li>
<li>Loon es el nuevo motor de almacenamiento para Milvus y Zilliz Vector Lakebase. Se basa en formatos de archivo híbridos, la alineación de ID de filas y un «Manifest» que define el estado versionado del conjunto de datos.</li>
<li>El objetivo es permitir que un único conjunto de datos vectoriales admita búsquedas en línea, análisis fuera de línea, rellenos, compactación y computación externa sin tener que copiar, reescribir o reimportar datos constantemente.</li>
</ul>
<h2 id="Introduction" class="common-anchor-header">Introducción<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Durante un tiempo, hubo un argumento en contra de las bases de datos vectoriales que parecía razonable.</p>
<p><em>Las bases de datos tradicionales ya almacenan enteros, cadenas de caracteres, JSON, blobs e índices. ¿Por qué no añadir un</em> <em>tipo</em> « <code translate="no">_vector_</code> <em>», crear un índice ANN junto a él y dar el tema por zanjado?</em></p>
<p>Para las primeras etapas de la búsqueda semántica, eso funciona bastante bien. Una columna vectorial más un índice pueden servir para una demostración, una pequeña aplicación RAG o una función de búsqueda interna. El problema surge más adelante, cuando el conjunto de datos empieza a comportarse menos como una tabla y más como un sistema de datos de IA.</p>
<p>Un conjunto de datos vectorial en producción tiene filas, claves primarias, campos escalares y columnas consultables. En ese sentido, se parece a una tabla de base de datos. Pero también tiene la escala y la estructura de flujo de trabajo de un lago de datos. Puede contener cientos de millones de registros. Es leído y reescrito repetidamente por Spark, Ray, DuckDB, pipelines de entrenamiento, trabajos de evaluación y sistemas de calidad de datos.</p>
<p>También depende del almacenamiento de objetos. Los objetos de origen suelen ser vídeos, imágenes, archivos PDF, archivos de audio o documentos web que permanecen en S3, GCS, OSS u otro almacén de objetos. La base de datos almacena referencias, metadatos, características derivadas e índices. A continuación, añade elementos que los modelos de almacenamiento tradicionales no estaban diseñados para gestionar como objetos de primera clase: incrustaciones densas, vectores dispersos, leyendas, índices vectoriales, índices de texto, registros de eliminación, estadísticas, versiones de modelos, versiones de analizadores sintácticos, referencias a blobs externos y las relaciones de versión entre todos ellos.</p>
<p><strong>Ahí es donde la idea de «basta con añadir una columna vectorial» empieza a fallar.</strong> La cuestión no es si una base de datos puede almacenar bytes vectoriales. Muchos sistemas pueden hacerlo. La pregunta más difícil es <strong>si el modelo de almacenamiento puede gestionar cómo cambian los datos vectoriales, cómo se consultan y cómo se comparten a lo largo de la pila de datos de IA.</strong></p>
<p><strong>Por eso hemos creado Loon, el nuevo motor de almacenamiento para Milvus y</strong> <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a> <strong>(la próxima evolución de Zilliz Cloud).</strong></p>
<p>Loon se ha diseñado en torno a tres ideas:</p>
<ol>
<li>Utilizar diferentes formatos físicos para los distintos tipos de columnas.</li>
<li>Alinear esas columnas mediante un espacio compartido de identificadores de fila.</li>
<li>Utilizar un manifiesto para definir el estado versionado del conjunto de datos.</li>
</ol>
<p>Para entender por qué estos elementos son importantes, empecemos con un flujo de trabajo multimodal habitual.</p>
<h2 id="A-vector-dataset-is-never-really-finished" class="common-anchor-header">Un conjunto de datos vectoriales nunca está realmente terminado.<button data-href="#A-vector-dataset-is-never-really-finished" class="anchor-icon" translate="no">
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
    </button></h2><p>Imagina un equipo de IA que crea un conjunto de datos de vídeo para el entrenamiento multimodal.</p>
<p>Se sube un vídeo largo a un almacenamiento de objetos. Un proceso lo divide en clips basándose en los cambios de escena, los límites de las tomas o las ventanas de tiempo. Se filtran los clips que son demasiado largos o cortos, borrosos, duplicados o de baja calidad. Los clips restantes son puntuados por un modelo estético, subtitulados por otro modelo, integrados por un modelo de visión-lenguaje y almacenados en una base de datos vectorial para su búsqueda, deduplicación y filtrado de datos de entrenamiento.</p>
<p>A grandes rasgos, el flujo de trabajo parece sencillo:</p>
<pre><code translate="no">video
→ clips
→ metadata
→ aesthetic_score
→ caption
→ embedding
→ search / dedup / training data filtering
<button class="copy-code-btn"></button></code></pre>
<p>Pero el conjunto de datos no llega ya completamente formado.</p>
<ul>
<li>En la primera semana, la tabla puede contener únicamente <code translate="no">clip_id</code>, <code translate="no">video_id</code>, <code translate="no">start_offset</code> y <code translate="no">duration</code>.</li>
<li>En la segunda semana, el equipo añade <code translate="no">aesthetic_score</code>.</li>
<li>En la tercera semana, se ejecuta un modelo de subtitulación y cada clip obtiene un <code translate="no">caption</code>.</li>
<li>En la cuarta semana, se pone en marcha el primer modelo de incrustación, y cada clip obtiene una incrustación CLIP de 768 dimensiones.</li>
<li>Un mes después, el equipo cambia de modelo y retroactiva l <code translate="no">embedding_v2</code>, ahora con 1024 dimensiones.</li>
<li>Dos meses después, la búsqueda híbrida se convierte en un requisito, por lo que el equipo añade una columna de vectores dispersos.</li>
<li>Tres meses después, los subtítulos se someten a revisión humana y deben corregirse in situ.</li>
</ul>
<p>El conjunto de datos nunca se completó. No dejaba de acumular nuevas interpretaciones de las mismas filas subyacentes.</p>
<p>Esa es una de las diferencias fundamentales entre los datos vectoriales y los datos empresariales tradicionales. La misma fila se vuelve a procesar una y otra vez. Y la escala convierte esto de un inconveniente en un problema de almacenamiento: los conjuntos de datos multimodales a menudo no contienen millones de registros, sino cientos de millones o miles de millones. LAION-5B es una referencia útil en cuanto a su estructura: miles de millones de pares de imagen y texto, cada uno con metadatos, leyendas y representaciones vectoriales. Así pues, lo difícil no es la primera inserción. Lo difícil es todo lo que ocurre una vez que el conjunto de datos empieza a evolucionar. <strong>Esa evolución pone de manifiesto tres problemas.</strong></p>
<h2 id="The-first-problem-long-columns-make-write-amplification-expensive" class="common-anchor-header">El primer problema: las columnas largas encarecen la amplificación de escritura<button data-href="#The-first-problem-long-columns-make-write-amplification-expensive" class="anchor-icon" translate="no">
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
    </button></h2><p>Los formatos columnares, como Parquet, son excelentes para muchas cargas de trabajo analíticas. Funcionan bien cuando los esquemas son bastante estables, los datos se leen con más frecuencia de lo que se reescriben, los escaneos solo afectan a un subconjunto de columnas y la compresión es importante. Ese es el entorno para el que se optimizaron muchos formatos analíticos.</p>
<h3 id="Vector-rows-are-much-wider-than-analytical-rows" class="common-anchor-header">Las filas vectoriales son mucho más anchas que las filas analíticas</h3><p>El TPC-H <code translate="no">lineitem</code> es una buena referencia. Tiene 16 columnas: claves enteras, valores decimales, fechas, cadenas cortas y un pequeño campo de comentarios. Una fila sin comprimir ocupa aproximadamente 150 bytes. Tras la compresión, puede ser mucho más pequeña. Con un grupo de filas de 64 MB, un sistema de almacenamiento puede agrupar cientos de miles de filas en un solo grupo.</p>
<p><strong>Los conjuntos de datos vectoriales no tienen ese aspecto.</strong></p>
<p>Un conjunto de datos de imagen y texto al estilo LAION se acerca mucho más a lo que producen hoy en día muchos flujos de trabajo de IA. Cada fila sigue teniendo metadatos habituales: una URL, un pie de foto, anchura, altura, puntuaciones de calidad, etiquetas, etcétera. Pero una vez que se añade la incrustación, la forma física de la fila cambia.</p>
<p>Un vector CLIP de 768 dimensiones ocupa aproximadamente 1,5 KB en fp16 o 3 KB en fp32. Esa única columna puede ser mucho más grande que toda una fila de TPC-H <code translate="no">lineitem</code>.</p>
<p>Y 768 dimensiones no son inusuales ni excesivas según los estándares actuales. Una incrustación de 1024 o 2048 dimensiones es habitual en los flujos de trabajo multimodales. El modelo « <code translate="no">text-embedding-3-large</code> » de OpenAI alcanza las 3072 dimensiones, lo que supone unos 12 KB por vector en fp32.</p>
<p>La comparación es contundente:</p>
<table>
<thead>
<tr><th>Forma del conjunto de datos</th><th>Tamaño aproximado de las filas</th><th>Qué predomina en la fila</th></tr>
</thead>
<tbody>
<tr><td>TPC-H lineitem</td><td>~150 bytes sin comprimir</td><td>campos escalares y de cadena corta</td></tr>
<tr><td>Fila de tipo LAION con un vector de 768 dimensiones en fp16</td><td>~1,5 KB+</td><td>incrustación</td></tr>
<tr><td>Fila de estilo LAION con un vector de 768 dimensiones en fp32</td><td>~3 KB+</td><td>incrustación</td></tr>
<tr><td>Fila con un vector de 3072 dimensiones en fp32</td><td>~12 KB+ solo para el vector</td><td>incrustación</td></tr>
</tbody>
</table>
<p>En muchos conjuntos de datos de IA, la columna del vector no es simplemente un campo más. Físicamente, ocupa la mayor parte de la fila. Esto modifica el coste de la evolución del esquema.</p>
<h3 id="Adding-one-vector-column-can-mean-hundreds-of-gigabytes" class="common-anchor-header">Añadir una columna de vectores puede suponer cientos de gigabytes</h3><p>Supongamos que un conjunto de datos contiene 100 millones de clips de vídeo. Añadir una nueva columna de incrustación de 1024 dimensiones en fp32 supone escribir aproximadamente 400 GB de datos vectoriales sin procesar. Eso no incluye las estadísticas, los índices, las actualizaciones de metadatos, la sobrecarga del almacenamiento de objetos, la validación ni la integración de la ruta de servicio.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_3_ca3c616b9e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Si el equipo añade una o dos columnas de tipo vectorial cada mes, como las características de « <code translate="no">embedding_v2</code> », « <code translate="no">sparse_vector</code> » o «rerank», la evolución del esquema se convierte en una tarea recurrente de ingeniería de datos que se mide en cientos de gigabytes o terabytes.</p>
<h3 id="Small-logical-updates-can-trigger-large-physical-rewrites" class="common-anchor-header">Pequeñas actualizaciones lógicas pueden desencadenar grandes reescrituras físicas</h3><p>Las actualizaciones son igual de importantes.</p>
<p>En los sistemas columnares, los datos antiguos no suelen actualizarse in situ. Un registro de eliminaciones anota lo que ha cambiado y, posteriormente, la compactación reescribe las filas activas en nuevos archivos. Ese modelo es manejable cuando las filas son pequeñas.</p>
<p>Con datos vectoriales, una pequeña actualización lógica puede desencadenar una reescritura física de gran envergadura.</p>
<p>Una tarea de revisión manual puede corregir solo unos pocos cientos de bytes en un título. Pero si el título, el vector denso, el vector disperso y otras características derivadas comparten el mismo ciclo de vida del archivo físico, el sistema puede acabar reescribiendo también los vectores. El cambio lógico es pequeño. La E/S física puede ser enorme.</p>
<p>Este es el problema de la amplificación de escritura en el almacenamiento de vectores. Lo costoso no es solo que los vectores sean grandes, sino que los campos derivados grandes y los campos mutables pequeños suelen quedar vinculados entre sí por una estructura de almacenamiento que los trata como una sola unidad.</p>
<h3 id="For-AI-datasets-backfill-is-a-routine-workload" class="common-anchor-header">En el caso de los conjuntos de datos de IA, el rellenado es una carga de trabajo habitual</h3><p>En el caso de las tablas analíticas tradicionales, la evolución del esquema puede producirse solo de forma ocasional. En los conjuntos de datos de IA, es algo habitual. Se actualizan los modelos de subtítulos. Se sustituyen los modelos de incrustación. Se añaden vectores dispersos posteriormente. Aparecen características de reordenación. Se corrigen las etiquetas humanas. Se completan las etiquetas de gobernanza. Se reconstruyen los índices.</p>
<p>Estas operaciones no son simples añadidos. Con frecuencia modifican o amplían las filas existentes.</p>
<p>Por eso, el almacenamiento vectorial no solo debe optimizarse para el rendimiento de escaneo. También debe abaratar los rellenos y las actualizaciones parciales.</p>
<h2 id="The-second-problem-the-same-data-must-support-scans-and-point-reads" class="common-anchor-header">El segundo problema: los mismos datos deben admitir escaneos y lecturas puntuales<button data-href="#The-second-problem-the-same-data-must-support-scans-and-point-reads" class="anchor-icon" translate="no">
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
    </button></h2><p>Una vez escritos los datos, la ruta de lectura se bifurca. El mismo conjunto de datos vectoriales suele tener dos patrones de acceso distintos: <strong>el escaneo analítico y las lecturas puntuales.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_4_cef8d0e3ea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Analytical-workloads-want-wide-compressed-scans" class="common-anchor-header">Las cargas de trabajo analíticas requieren escaneos amplios y comprimidos</h3><p>Un proceso puede ejecutar filtros como:</p>
<pre><code translate="no" class="language-sql">WHERE aesthetic_score &gt; 0.8 AND duration &gt; 5
<button class="copy-code-btn"></button></code></pre>
<p>O bien puede realizar análisis fuera de línea, evaluación completa de incrustaciones, estadísticas BM25, construcción de mapas de bits, comprobaciones de calidad de datos, recuentos y agrupaciones.</p>
<p>Este patrón lee muchas filas, pero solo unas pocas columnas. Se beneficia de la E/S secuencial, los grupos de filas más grandes, la compresión, la poda de columnas, la decodificación por lotes y la ejecución vectorizada.</p>
<p>Los grupos de filas grandes resultan útiles en este caso. Permiten que una sola solicitud de E/S extraiga una gran cantidad de datos útiles, mejoran la eficiencia de la compresión y proporcionan al motor de ejecución datos contiguos suficientes para amortizar la sobrecarga. Cuando se leen varias columnas a la vez, mantenerlas organizadas para el rendimiento del escaneo también ayuda a reducir las faltas de acierto en la caché durante la ejecución vectorizada.</p>
<p>Parquet destaca en este aspecto.</p>
<h3 id="ANN-results-need-narrow-row-level-lookups" class="common-anchor-header">Los resultados de la búsqueda ANN requieren búsquedas específicas a nivel de fila</h3><p>Una vez que la búsqueda de la red neuronal artificial (ANN) devuelve los ID de las filas candidatas, el sistema a menudo necesita recuperar campos como:</p>
<pre><code translate="no">caption
embedding
rerank feature
video_uri
metadata
<button class="copy-code-btn"></button></code></pre>
<p>Este patrón lee menos filas, a menudo cientos o miles, pero requiere un acceso preciso por ID de fila. Busca localizar una fila y una columna específicas, recuperar solo el rango de bytes necesario y evitar extraer un grupo de filas completo solo para recuperar unos pocos registros.</p>
<p>La búsqueda puntual tiene una preferencia casi opuesta en cuanto al escaneo. Requiere una granularidad de lectura menor. Lo ideal es que la capa de almacenamiento pueda encontrar el segmento o rango de bytes relevante mediante el ID de fila, lea solo ese rango y decodifique únicamente los datos necesarios para el resultado.</p>
<p>La compresión también presenta una disyuntiva diferente. Para los escaneos, suele merecer la pena una compresión más intensa, ya que el sistema lee una gran cantidad de datos y ahorra operaciones de E/S. Para la búsqueda puntual, la compresión puede convertirse en un lastre si recuperar una sola fila requiere decodificar un bloque comprimido mucho mayor.</p>
<h3 id="One-layout-cannot-optimize-for-both-paths" class="common-anchor-header">Un único diseño no puede optimizarse para ambas vías</h3><p>Este es el conflicto fundamental. El filtrado escalar y el análisis requieren diseños amplios, comprimidos y aptos para escaneos. La búsqueda vectorial requiere diseños estrechos, precisos y direccionables por fila.</p>
<p>Un único formato de archivo puede admitir ambos hasta cierto punto, pero no puede ser óptimo para ambos simultáneamente.</p>
<p>Si todas las columnas residen en Parquet, los escaneos escalares funcionan bien. Pero la búsqueda en redes neuronales (ANN) tras la recuperación se complica. Es posible que el sistema solo necesite unos pocos cientos de vectores, leyendas o registros de metadatos, mientras que la capa de almacenamiento podría tener que leer grandes grupos de filas que contienen en su mayoría filas irrelevantes.</p>
<p>En un SSD local, la caché y mmap pueden ocultar parte de este coste. Una vez que los datos se almacenan en un almacenamiento de objetos, el coste se hace más evidente. Cada fallo de caché puede convertirse en una lectura de rango remoto. Si las filas candidatas están dispersas por muchos grupos de filas, una sola consulta puede desencadenar múltiples lecturas, cada una de las cuales extrae más datos de los que la consulta necesita. En una estructura mal diseñada, recuperar 1.000 filas candidatas puede traducirse fácilmente en decenas o cientos de megabytes de E/S innecesaria y, en casos extremos, en mucho más.</p>
<p>Reducir el tamaño de los grupos de filas facilita la búsqueda por referencia, pero perjudica los escaneos. Un número excesivo de fragmentos pequeños reduce la eficiencia de la compresión, aumenta la sobrecarga de metadatos y rompe las lecturas secuenciales largas de las que dependen los motores analíticos.</p>
<p><strong>Así pues, el problema no consiste en encontrar un único tamaño «mágico» para los grupos de filas. El problema es que se le pide al mismo conjunto de datos que se comporte como dos sistemas de almacenamiento diferentes.</strong></p>
<h3 id="Hybrid-search-forces-both-paths-into-one-query" class="common-anchor-header">La búsqueda híbrida obliga a combinar ambas vías en una sola consulta</h3><p>La búsqueda híbrida hace que el conflicto sea más difícil de ignorar. Una misma consulta puede aplicar primero filtros escalares:</p>
<pre><code translate="no" class="language-sql">aesthetic_score &gt; 0.8 AND duration &gt; 5
<button class="copy-code-btn"></button></code></pre>
<p>A continuación, ejecuta una búsqueda ANN.</p>
<p>A continuación, recupera el título, el vector y los metadatos por ID de fila.</p>
<p>Para el usuario, se trata de una única solicitud de búsqueda. Para la capa de almacenamiento, es tanto un escaneo analítico como una consulta aleatoria de baja latencia.</p>
<p>Por eso el almacenamiento vectorial necesita algo más que una mejor configuración de Parquet. Necesita una forma de colocar las diferentes columnas según cómo se leen realmente.</p>
<h2 id="The-third-problem-the-dataset-does-not-live-inside-one-engine" class="common-anchor-header">El tercer problema: el conjunto de datos no reside en un único motor<button data-href="#The-third-problem-the-dataset-does-not-live-inside-one-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Los dos primeros problemas se producen dentro de la base de datos. El tercero se produce en el límite entre sistemas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_5_802e6d92c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="AI-data-pipelines-span-many-systems" class="common-anchor-header">Los flujos de datos de IA abarcan muchos sistemas</h3><p>En el flujo de trabajo de vídeo, ocurre muy poco dentro de la propia base de datos vectorial.</p>
<p>Los vídeos sin procesar se almacenan en un sistema de almacenamiento de objetos. La generación de clips puede ejecutarse en Spark o Ray. La puntuación estética puede ejecutarse en un servicio de GPU. La generación de subtítulos puede ejecutarse en un flujo de trabajo de inferencia de un modelo de lenguaje grande (LLM). Las representaciones vectoriales pueden generarse mediante otro proceso de GPU. Los vectores dispersos pueden proceder de un servicio SPLADE. La evaluación fuera de línea, el filtrado de datos de entrenamiento, la revisión humana y las tareas de gobernanza pueden ejecutarse en otros lugares.</p>
<p>La base de datos vectorial se encarga de la búsqueda en línea, pero el conjunto de datos es producido, corregido, evaluado y ampliado por numerosos sistemas.</p>
<h3 id="Private-storage-formats-create-multiple-copies-of-the-truth" class="common-anchor-header">Los formatos de almacenamiento privados crean múltiples copias de la «verdad»</h3><p>Si la base de datos utiliza un formato físico propio que solo ella puede leer y escribir, cada tarea externa necesita una exportación, una conversión, una copia y una importación. La misma colección puede existir en la base de datos, en un directorio temporal de Spark, en un resultado de evaluación y en un directorio local de rellenado. Entonces, la verdadera pregunta es:</p>
<ul>
<li>¿Qué copia es la fuente de la verdad?</li>
<li>¿Cuál contiene el modelo de subtítulos del mes pasado?</li>
<li>¿Qué filas ya han sido corregidas mediante revisión humana?</li>
<li>¿Qué columna de vectores dispersos fue generada por qué modelo?</li>
<li>¿Qué índice vectorial sigue siendo válido tras el rellenado?</li>
<li>¿A qué objeto de vídeo original hace referencia esta fila?</li>
</ul>
<p>A pequeña escala, los equipos a veces pueden arreglárselas con convenciones de nomenclatura y comprobaciones manuales. Con cientos de millones de filas y terabytes de representaciones, esto se convierte en un problema de coherencia.</p>
<h3 id="Vector-datasets-need-a-shared-versioned-state" class="common-anchor-header">Los conjuntos de datos vectoriales necesitan un estado compartido y versionado</h3><p>Los sistemas «lakehouse» abordaron una variante de este problema para los datos estructurados. Iceberg, Delta Lake y Hudi no se limitan a almacenar archivos. Su principal aportación es permitir que múltiples motores se coordinen en torno al mismo estado de la tabla.</p>
<p>Las bases de datos vectoriales necesitan ahora una capacidad similar, pero el estado es más complejo. Debe incluir no solo archivos de tabla y particiones, sino también índices vectoriales, índices de texto, características dispersas, registros de eliminación, estadísticas, rangos de ID de filas y referencias a blobs externos.</p>
<p>La pregunta no es simplemente: «¿Puede Spark leer archivos de Milvus?».</p>
<p>La pregunta es: después de que Spark rellene una columna vectorial dispersa, ¿cómo sabe Milvus a qué versión pertenece esa columna, qué filas abarca, qué modelo la generó y cuándo pueden las consultas en línea utilizarla de forma segura?</p>
<p>La respuesta debe residir en el modelo de almacenamiento.</p>
<h2 id="Why-patches-are-not-enough" class="common-anchor-header">Por qué los parches no son suficientes<button data-href="#Why-patches-are-not-enough" class="anchor-icon" translate="no">
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
    </button></h2><p>Resulta tentador tratar estos aspectos como tres problemas de ingeniería independientes.</p>
<ul>
<li>¿Amplificación de escritura? Añade el procesamiento por lotes.</li>
<li>¿Lecturas puntuales? Añade una caché.</li>
<li>¿Sistemas externos? Añade herramientas de exportación e importación.</li>
</ul>
<p>Esos parches pueden ayudar, pero no abordan el problema subyacente: un conjunto de datos vectoriales es físicamente heterogéneo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_6_0744ff4445.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>En el ejemplo del vídeo, <code translate="no">clip_id</code>, <code translate="no">video_id</code>, <code translate="no">duration</code> y <code translate="no">aesthetic_score</code> son campos escalares cortos. Son útiles para el filtrado y el análisis.</p>
<ul>
<li><code translate="no">caption</code> es texto. Se puede utilizar para BM25, revisión, corrección y rellenado.</li>
<li><code translate="no">embedding</code> es un vector largo y denso. Se utiliza para la recuperación de la red neuronal artificial (ANN) y, posteriormente, para la búsqueda a nivel de fila o la reordenación.</li>
<li><code translate="no">embedding_v2</code> es una nueva salida del modelo, que a menudo se rellena mucho tiempo después de que se hayan insertado los datos originales.</li>
<li><code translate="no">sparse_vector</code> Admite la búsqueda híbrida y tiene su propio patrón de acceso.</li>
<li>El vídeo sin procesar debe permanecer en el almacenamiento de objetos. La base de datos debe almacenar una referencia, una suma de comprobación, un tipo MIME, una versión del analizador sintáctico y una relación a nivel de fila.</li>
<li>Los índices vectoriales, los índices de texto, las estadísticas y los registros de eliminación son objetos derivados con su propia semántica de versiones.</li>
</ul>
<p>Estos objetos comparten una fila lógica, pero no deben compartir todos el mismo diseño físico ni el mismo ciclo de vida.</p>
<ul>
<li>Si se les obliga a adoptar una estructura de tabla ordinaria, las actualizaciones resultan costosas.</li>
<li>Si se les obliga a adoptar un único formato de archivo columnar, las lecturas puntuales se vuelven costosas.</li>
<li>Si se tratan como archivos de objetos independientes, la gestión de versiones se vuelve frágil.</li>
</ul>
<p>Por lo tanto, el modelo de almacenamiento debe partir del hecho de que el conjunto de datos es heterogéneo.</p>
<p><strong>Esto da lugar a tres requisitos de diseño:</strong></p>
<ul>
<li>En primer lugar, los distintos grupos de columnas deben almacenarse en formatos físicos diferentes.</li>
<li>En segundo lugar, esos grupos de columnas necesitan un espacio compartido de identificadores de fila, para que puedan seguir comportándose como una única tabla lógica.</li>
<li>En tercer lugar, el conjunto de datos necesita un manifiesto versionado que declare qué archivos, índices, registros, estadísticas y referencias a objetos pertenecen a la vista actual.</li>
</ul>
<p><strong>Este es el diseño en el que se basa Loon, nuestro nuevo motor de almacenamiento detrás de Milvus y Zilliz Cloud.</strong></p>
<h2 id="Loon-a-storage-engine-behind-Milvus-and-Zilliz-Cloud-for-evolving-vector-datasets" class="common-anchor-header">Loon: un motor de almacenamiento para Milvus y Zilliz Cloud destinado a conjuntos de datos vectoriales en evolución<button data-href="#Loon-a-storage-engine-behind-Milvus-and-Zilliz-Cloud-for-evolving-vector-datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>Para resolver todos los problemas anteriores, hemos creado <strong>Loon</strong>, el nuevo motor de almacenamiento para Milvus y <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a> (la próxima evolución de Zilliz Cloud), diseñado para conjuntos de datos vectoriales en evolución.</p>
<p>El nombre sigue la tradición de Zilliz de dar nombres de aves a sus productos. Un «loon» es un ave zambullidora que vive en los lagos, lo que encaja perfectamente con el objetivo del sistema: una base de datos vectorial no debería tener que mover, escanear o reescribir todo un «lago» de datos cada vez que ejecuta una consulta, rellena una columna o crea un índice. En primer lugar, debe comprender la versión actual del conjunto de datos, incluidas sus columnas, índices, estadísticas, registros de eliminación y referencias a objetos, para luego leer únicamente la parte que realmente necesita.</p>
<p>Los formatos de archivo híbridos, la alineación de ID de filas y Manifest no son tres características independientes. Todas ellas se derivan de la misma premisa de diseño: un conjunto de datos vectorial es intrínsecamente heterogéneo.</p>
<h3 id="Three-pieces-one-storage-model" class="common-anchor-header">Tres elementos, un único modelo de almacenamiento</h3><p>Los formatos de archivo híbridos reconocen que las diferentes columnas tienen distintos patrones de acceso. Los campos escalares son adecuados para exploraciones y filtros. Los campos vectoriales requieren una búsqueda eficiente a nivel de fila. Los objetos sin procesar, como vídeos, PDF, imágenes y archivos de audio, deben almacenarse en un sistema de almacenamiento de objetos, no dentro de los archivos de datos de la base de datos.</p>
<p>La alineación de los ID de fila reconoce que estas columnas pueden estar físicamente separadas, pero siguen describiendo las mismas filas lógicas. Un pie de foto, una incrustación, un vector disperso y un URI de vídeo pueden residir en diferentes archivos y formatos, pero aún así deben reunirse como un único resultado.</p>
<p>El Manifiesto reconoce que el conjunto de datos no se escribe una vez y se deja tal cual. Será modificado por múltiples sistemas, a lo largo de múltiples versiones, para múltiples tareas. Los índices, las estadísticas, los registros de eliminación, las referencias a objetos externos y los grupos de columnas deben aparecer todos en la misma vista versionada.</p>
<p><strong>Por eso Loon no es solo un formato de archivo vectorial más rápido.</strong> Un formato más rápido facilita la búsqueda por índice, pero no resuelve la evolución del esquema ni la coordinación entre múltiples motores. La alineación de los ID de fila permite que las columnas divididas se comporten como una única tabla, pero no especifica qué archivos pertenecen a la versión actual. Un «Manifest» puede describir el estado de un conjunto de datos, pero sin grupos de columnas ni alineación de identificadores de fila, no puede representar de forma clara los diferentes diseños físicos dentro de una misma colección lógica.</p>
<p>El modelo de almacenamiento necesita estos tres elementos: diferentes formatos para los distintos grupos de columnas, un espacio compartido de identificadores de fila para reconstruir las filas y un «Manifest» versionado que indique a todos los lectores y escritores cuál es el estado actual del conjunto de datos.</p>
<h3 id="Where-Loon-fits-in-Milvus-and-Zilliz-Vector-Lakebase" class="common-anchor-header">El papel de Loon en Milvus y Zilliz Vector Lakebase</h3><p>En Milvus, sustituye la antigua capa de almacenamiento de binlog por segmentos por un modelo construido en torno a Manifest, ColumnGroup, el formato de archivo y las abstracciones del sistema de archivos. En <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase"><strong>Zilliz Vector Lakebase</strong></a> (la próxima evolución de Zilliz Cloud)<strong>,</strong> se aplica la misma orientación a la arquitectura de Vector Lakebase: mantener rápida la ruta de servicio de la base de datos vectorial, al tiempo que se facilita la evolución, el análisis y la coordinación de los datos subyacentes con sistemas externos.</p>
<p>Los componentes de nivel superior de Milvus siguen desempeñando sus funciones habituales. Proxy se encarga del enrutamiento. QueryCoord y DataCoord se encargan de la programación. IndexNode crea los índices. Las API orientadas a las aplicaciones para colecciones, inserciones, búsquedas y búsquedas híbridas no necesitan exponer archivos Manifest ni ColumnGroups.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_7_d4d1a34604.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>El cambio se produce en el fondo.</p>
<p>DataNode, QueryNode, segcore, la compactación y los conectores externos pueden funcionar a través de la misma abstracción de almacenamiento. Esto es importante porque el conjunto de datos ya no es escrito y leído únicamente por la base de datos. Puede ser ampliado por sistemas informáticos externos y consumido por búsquedas en línea de forma simultánea.</p>
<p>A grandes rasgos, las capas tienen este aspecto:</p>
<pre><code translate="no">Manifest
→ ColumnGroup
→ file <span class="hljs-built_in">format</span> layer
→ filesystem abstraction
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_8_70917bdfc7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>El «Manifest» describe el estado versionado del conjunto de datos. Los «ColumnGroups» asignan una colección lógica a grupos físicos de columnas. La capa de formato de archivo permite que cada «ColumnGroup» elija un formato adecuado. La abstracción del sistema de archivos funciona tanto en el almacenamiento de objetos como en el almacenamiento local.</p>
<p>Lo importante es que los formatos de archivo híbridos, la alineación de los ID de fila y el «Manifest» no son características independientes. Juntas, definen el modelo de almacenamiento.</p>
<p>Con ese modelo establecido, podemos analizar una por una las tres opciones de diseño: cómo almacena Loon los diferentes ColumnGroups, cómo los realinea en filas y cómo el Manifest convierte esos archivos en un conjunto de datos versionado.</p>
<h2 id="Design-1-use-the-right-file-format-for-the-right-column-group" class="common-anchor-header">Diseño 1: utilizar el formato de archivo adecuado para cada grupo de columnas<button data-href="#Design-1-use-the-right-file-format-for-the-right-column-group" class="anchor-icon" translate="no">
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
    </button></h2><p>Las diferentes columnas tienen distintos patrones de acceso. No se les debe obligar a utilizar el mismo formato de archivo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_9_c262865944.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Loon-separates-a-logical-collection-into-ColumnGroups" class="common-anchor-header">Loon divide una colección lógica en grupos de columnas.</h3><ul>
<li>Los campos escalares, los campos de filtro, las claves de negocio y los campos estadísticos suelen ser objeto de escaneo, filtrado, agregación o utilizarse para la planificación de consultas. Se benefician de la compresión, la poda de columnas y la compatibilidad con el ecosistema. Parquet es una buena opción para estas columnas.</li>
<li>Los vectores densos, los vectores dispersos y las características de reordenación suelen leerse tras la recuperación de la red neuronal artificial (ANN) por ID de fila. Necesitan un acceso aleatorio de baja latencia, lecturas precisas de rangos de bytes y decodificación selectiva. Un diseño orientado a segmentos se adapta mejor. Loon utiliza Vortex en este sentido.</li>
<li>Los objetos sin procesar, como vídeos, archivos PDF, imágenes y archivos de audio, no deben integrarse en los archivos de datos de la base de datos vectorial. Deben permanecer en el almacenamiento de objetos. La base de datos registra referencias, sumas de comprobación, tipos MIME, versiones de analizadores sintácticos y relaciones a nivel de fila.</li>
</ul>
<p>En el ejemplo del vídeo, un diseño físico podría tener este aspecto:</p>
<pre><code translate="no"><span class="hljs-title class_">Parquet</span> <span class="hljs-title class_">ColumnGroup</span>:
clip_id / video_id / start_offset / duration / aesthetic_score / caption

<span class="hljs-title class_">Vortex</span> <span class="hljs-title class_">ColumnGroups</span>:
embedding
embedding_v2
sparse_vector

<span class="hljs-title class_">Object</span> <span class="hljs-attr">storage</span>:
raw video objects
<button class="copy-code-btn"></button></code></pre>
<p>Para la aplicación, sigue tratándose de una única colección. Para la capa de almacenamiento, las diferentes partes de esa colección utilizan formatos físicos distintos. Esto reduce directamente las reescrituras innecesarias. Añadir un « <code translate="no">embedding_v2</code> » puede traducirse en un nuevo ColumnGroup vectorial más una confirmación del manifiesto. No requiere reescribir la columna de subtítulos, los metadatos escalares ni la columna de incrustación existente.</p>
<p>La misma idea se aplica a los vectores dispersos, las características de reordenación u otros campos derivados. Si una nueva columna puede ser físicamente independiente y alinearse por ID de fila, no es necesario arrastrar columnas no relacionadas por la misma ruta de reescritura.</p>
<h3 id="Loon-also-adapts-the-use-of-file-formats" class="common-anchor-header">Loon también adapta el uso de los formatos de archivo.</h3><p><strong>En el caso de Parquet, la configuración predeterminada no siempre es ideal para datos con gran cantidad de vectores.</strong> Un grupo de filas de 64 MB puede resultar demasiado grande para la búsqueda puntual, ya que una pequeña lectura aleatoria puede extraer muchos más datos de los necesarios. Loon reduce los grupos de filas a 1 MB en las rutas relevantes y desactiva codificaciones, como la codificación de diccionario en columnas vectoriales, cuando estas no benefician a los datos vectoriales de búsqueda aleatoria.</p>
<p><strong>En el caso de Vortex, el aspecto más importante es el diseño.</strong> Loon utiliza un diseño que equilibra la eficiencia del escaneo y la búsqueda puntual. Dentro de un grupo de filas, los segmentos de columnas relacionadas pueden colocarse cerca unos de otros para facilitar el escaneo. Para realizar operaciones, las lecturas de subsegmentos permiten al sistema recuperar solo los bytes relevantes en lugar de extraer un segmento completo.</p>
<p><strong>Loon también admite la integración de Lance en modo de solo lectura</strong>, por lo que los conjuntos de datos existentes de Lance pueden montarse como ColumnGroups cuando la compatibilidad sea importante.</p>
<h3 id="What-the-benchmark-shows" class="common-anchor-header">Lo que muestra la prueba de rendimiento</h3><p>En una prueba local, utilizando un único archivo con 40 000 filas y el esquema <code translate="no">{id: int64, name: utf8, value: float64, vector: list&lt;float32&gt;[128]}</code>, Vortex mostró estos resultados frente a Parquet con grupos de filas de 1 MB:</p>
<table>
<thead>
<tr><th>Operación</th><th>Vortex</th><th>Parquet</th><th>Diferencia</th></tr>
</thead>
<tbody>
<tr><td>Extracción, K = 1.000 filas aleatorias</td><td>5,8 ms</td><td>144 ms</td><td>25 veces más rápido</td></tr>
<tr><td>Escaneo completo de vectores por columnas</td><td>21 ms</td><td>142 ms</td><td>6,76 veces más rápido</td></tr>
<tr><td>Tamaño del archivo: ~21 MB de datos sin procesar</td><td>6,62 MB</td><td>7,16 MB</td><td>Un 7 % más pequeño</td></tr>
</tbody>
</table>
<p>El resultado de « <code translate="no">take</code> » se debe a la reducción de la cantidad de datos irrelevantes que deben leerse y descodificarse. El resultado del escaneo se debe a la compresión y a las opciones de implementación.</p>
<p>Estas cifras deben considerarse en el contexto de su configuración: 8 vCPU, Ubuntu 22.04 KVM, sistema de archivos local, un archivo, 40 000 filas, grupos de filas de 1 MB y el esquema anterior. En el almacenamiento de objetos, la E/S de red puede ser predominante, por lo que reducir la amplificación de lectura puede ser aún más importante. Los resultados reales dependen de la forma del conjunto de datos, el comportamiento del almacenamiento de objetos, el estado de la caché y el patrón de consulta.</p>
<p>La cuestión general no es que todas las columnas deban utilizar Vortex.</p>
<p>La cuestión es que los conjuntos de datos vectoriales necesitan una elección de formato de archivo a nivel de ColumnGroup.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_11_127c1953e6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Design-2-align-physical-files-through-row-IDs" class="common-anchor-header">Diseño 2: alinear los archivos físicos mediante los ID de fila<button data-href="#Design-2-align-physical-files-through-row-IDs" class="anchor-icon" translate="no">
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
    </button></h2><p>Los formatos de archivo híbridos resuelven un problema: ahora las diferentes columnas pueden residir en los formatos que mejor se adapten a ellas.</p>
<p>Pero eso genera un segundo problema. Si los campos escalares residen en Parquet, los vectores en Vortex y los objetos sin procesar en el almacenamiento de objetos, ¿cómo puede el sistema seguir tratándolos como una única colección?</p>
<p><strong>Loon resuelve esto mediante la alineación de los ID de fila.</strong></p>
<h3 id="Row-ID-is-the-storage-layer-coordinate-system" class="common-anchor-header">El identificador de fila es el sistema de coordenadas de la capa de almacenamiento</h3><p>Cada ColumnGroupFile físico registra la ruta del archivo y el rango de identificadores de fila que abarca:</p>
<pre><code translate="no">path
start_index
end_index
<button class="copy-code-btn"></button></code></pre>
<p>Diferentes ColumnGroups pueden abarcar el mismo espacio de ID de fila, incluso si se encuentran en archivos y formatos distintos.</p>
<p>Para el ID de fila <code translate="no">12345</code>, los metadatos escalares pueden estar en un ColumnGroup de Parquet, la incrustación puede estar en un ColumnGroup de Vortex y el vídeo sin procesar puede estar representado por una referencia de almacenamiento de objetos. Lógicamente, siguen siendo una sola fila. Esto proporciona a la capa de almacenamiento un sistema de coordenadas estable.</p>
<p>El ID de fila no es la clave primaria del negocio. Es el sistema de coordenadas de la capa de almacenamiento lo que permite a Loon dividir físicamente una colección sin perder la capacidad de reconstruirla lógicamente.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_12_3da04acdec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="New-columns-do-not-have-to-rewrite-old-columns" class="common-anchor-header">Las nuevas columnas no requieren reescribir las antiguas</h3><p>Añadir un « <code translate="no">embedding_v2</code> » no requiere reescribir la leyenda original, los metadatos ni los ColumnGroups de « <code translate="no">embedding_v1</code> ». Loon puede escribir un nuevo ColumnGroup vectorial, registrar el rango de ID de fila que abarca y confirmar ese cambio a través del manifiesto.</p>
<p>Lo mismo se aplica a los vectores dispersos, las características reordenadas u otros campos derivados que se incorporen posteriormente.</p>
<p>Siempre que el nuevo ColumnGroup cubra el rango de ID de fila correcto, puede incorporarse a la misma colección lógica sin obligar a mover datos no relacionados.</p>
<h3 id="Deletes-and-compaction-can-be-more-targeted" class="common-anchor-header">Las eliminaciones y la compactación pueden ser más específicas</h3><p>La alineación de los ID de fila también facilita las eliminaciones.</p>
<p>Una eliminación puede expresarse primero a través de un registro de eliminación. La fila se vuelve invisible a nivel lógico, mientras que la limpieza física se retrasa hasta la compactación. Cuando finalmente se ejecuta la compactación, no siempre es necesario reescribir todos los ColumnGroup vinculados a las filas afectadas. Puede centrarse en los ColumnGroups que necesitan limpieza.</p>
<p>Esto es importante porque no todas las columnas tienen el mismo perfil de coste. Reescribir un ColumnGroup escalar corto es muy diferente a reescribir cientos de gigabytes de vectores densos.</p>
<h3 id="Hybrid-search-can-fetch-only-the-columns-it-needs" class="common-anchor-header">La búsqueda híbrida puede recuperar solo las columnas que necesita</h3><p>La alineación de los ID de fila es también lo que hace que la búsqueda híbrida resulte práctica sobre los formatos de archivo híbridos.</p>
<p>Una vez que la búsqueda ANN devuelve los ID de fila candidatos, el sistema puede recuperar únicamente los campos necesarios para el resultado final: leyendas, metadatos, vectores, características de reordenación o referencias a objetos.</p>
<p>Por ejemplo, una consulta puede necesitar:</p>
<pre><code translate="no">caption
embedding
video_uri
<button class="copy-code-btn"></button></code></pre>
<p>Esos campos pueden encontrarse en diferentes ColumnGroups. Loon puede localizar los archivos relevantes por rango de ID de fila, leer los rangos de bytes necesarios y ensamblar el resultado.</p>
<p>Sin la alineación de los ID de fila, los formatos híbridos no serían más que archivos separados situados uno al lado del otro. Con la alineación de los ID de fila, se comportan como una única colección lógica.</p>
<h3 id="Packed-Reader-hides-the-split-from-the-upper-layer" class="common-anchor-header">Packed Reader oculta la división a la capa superior</h3><p>El componente de tiempo de ejecución que hace que esto sea utilizable es el Packed Reader.</p>
<p>La capa superior ve un flujo unificado de Arrow RecordBatch. En el fondo, los datos pueden proceder de múltiples ColumnGroups en diferentes formatos de archivo. El Packed Reader oculta esas diferencias, alinea los datos por rangos de ID de fila y programa la E/S de múltiples archivos con un uso controlado de la memoria.</p>
<p>También admite la consulta directa « <code translate="no">take</code> » por ID de fila. A partir de un conjunto de ID de fila, localiza los ColumnGroupFiles pertinentes, realiza lecturas por rango y devuelve los campos solicitados.</p>
<p>Para el flujo de trabajo de vídeo, una consulta ANN puede necesitar <code translate="no">caption</code>, <code translate="no">embedding</code> y <code translate="no">video_uri</code>. El Packed Reader puede recuperar el ColumnGroup escalar y el ColumnGroup vectorial sin tocar columnas no relacionadas.</p>
<p>Esa es la diferencia entre «archivos separados» y «una tabla con múltiples diseños físicos».</p>
<h2 id="Design-3-make-the-Manifest-the-source-of-truth" class="common-anchor-header">Diseño 3: convertir el manifiesto en la fuente de verdad<button data-href="#Design-3-make-the-Manifest-the-source-of-truth" class="anchor-icon" translate="no">
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
    </button></h2><p>Los formatos de archivo híbridos definen cómo se almacenan físicamente los datos. La alineación de los ID de fila determina cómo los ColumnGroups separados siguen formando una única tabla lógica. Pero el sistema aún debe responder a una pregunta más amplia: <strong>¿qué archivos, registros, estadísticas, índices y referencias a objetos pertenecen a la versión actual del conjunto de datos? Esa es la función del Manifest.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/why_we_built_loon_a_storage_engine_for_ai_data_that_never_stops_changing_md_13_cd18b2da18.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Object-storage-directories-are-not-enough" class="common-anchor-header">Los directorios de almacenamiento de objetos no son suficientes</h3><p>El almacenamiento de objetos no es un catálogo de bases de datos. Un directorio puede contener archivos antiguos, archivos nuevos, resultados de tareas fallidas, archivos temporales, registros de eliminación, archivos a los que aún hacen referencia instantáneas anteriores y archivos a la espera de ser eliminados. El hecho de que un archivo exista no significa que pertenezca a la versión actual del conjunto de datos.</p>
<p>Un conjunto de datos de Loon puede estar organizado en directorios como:</p>
<pre><code translate="no">_metadata/
_data/
_delta/
_stats/
_index/
<button class="copy-code-btn"></button></code></pre>
<p>Pero la estructura de directorios no es la fuente de verdad. El Manifiesto sí lo es. Los lectores no deben enumerar directorios e inferir el estado a partir de los archivos que casualmente existan. Deben leer el Manifiesto actual y seguir la vista versionada que este declara.</p>
<h3 id="The-Manifest-defines-one-versioned-view-of-the-dataset" class="common-anchor-header">El Manifiesto define una vista versionada del conjunto de datos</h3><p>El Manifiesto define el conjunto de datos en una versión determinada. En él se registran:</p>
<ul>
<li>qué ColumnGroups existen</li>
<li>qué rangos de ID de fila abarcan</li>
<li>qué formato físico utiliza cada ColumnGroup</li>
<li>dónde se encuentran los archivos</li>
<li>qué registros de eliminación están activos</li>
<li>qué estadísticas están disponibles</li>
<li>qué índices existen</li>
<li>a qué blobs externos se hace referencia</li>
<li>qué columnas y rangos de filas abarcan esas estadísticas o índices</li>
</ul>
<p>Cada actualización escribe una nueva versión del manifiesto. Un lector que abra la versión N verá una vista estable del conjunto de datos en la versión N. Un escritor puede preparar la versión N+1 sin interrumpir a los lectores que aún estén utilizando la versión N.</p>
<h3 id="The-Manifest-tracks-more-than-table-files" class="common-anchor-header">El «Manifest» hace un seguimiento de más elementos que los archivos de tabla</h3><p>En Loon, el cuerpo del Manifiesto está codificado con Apache Avro y organizado en torno a cuatro secciones principales.</p>
<ul>
<li>Los ColumnGroups describen las columnas, los formatos, los archivos y los rangos de ID de filas.</li>
<li>Los «DeltaLogs» describen las eliminaciones. Los diferentes tipos de eliminación abarcan distintas fuentes de cambio, como las eliminaciones de claves primarias por parte de los clientes, las eliminaciones posicionales debidas a la compactación interna o las eliminaciones por igualdad procedentes de motores externos.</li>
<li>Las «Stats» incluyen metadatos de planificación, como filtros Bloom, estadísticas BM25 y valores mínimos y máximos.</li>
<li>Los «Indexes» describen el tipo de índice, los parámetros, las columnas cubiertas y los rangos de ID de fila. Esto puede incluir índices vectoriales como HNSW o IVF, índices de texto, índices invertidos, índices de mapa de bits y estructuras relacionadas.</li>
</ul>
<p>Aquí es donde Loon se diferencia de un manifiesto de tabla tradicional.</p>
<p>Un conjunto de datos vectorial no solo debe realizar un seguimiento de los archivos de datos y las particiones, sino también de los índices vectoriales, los índices de texto, las características dispersas, los registros de eliminación, las estadísticas, las referencias a objetos externos y los rangos de ID de fila que los conectan.</p>
<h3 id="The-Manifest-must-be-writable-by-more-than-the-database" class="common-anchor-header">El manifiesto debe ser modificable por más entidades además de la base de datos</h3><p>Lo más importante no es solo lo que contiene el manifiesto, sino quién puede escribir en él.</p>
<ul>
<li>Si solo la base de datos puede escribir en el manifiesto, este sigue siendo metadatos internos. Metadatos más limpios, pero que siguen siendo privados de un único motor.</li>
<li>Si los motores externos pueden generar nuevos ColumnGroups, estadísticas y entradas del «Manifest», este se convierte en una interfaz de coordinación.</li>
<li>Un trabajo de Spark, por ejemplo, puede rellenar una columna de vectores dispersos. Escribe un nuevo ColumnGroup, registra la cobertura de filas y las estadísticas, y confirma un nuevo Manifiesto. Las consultas en línea pueden seguir leyendo la versión antigua mientras se ejecuta el trabajo. Una vez que la confirmación se realiza con éxito, la nueva versión se hace visible.</li>
</ul>
<p>Esto es similar en esencia a Iceberg y Delta Lake, pero el modelo de objetos es más amplio. Un conjunto de datos vectorial necesita realizar un seguimiento de índices vectoriales, índices de texto, características dispersas, registros de eliminación, estadísticas, referencias a blobs y rangos de ID de filas, no solo de archivos de tabla y particiones.</p>
<h3 id="Optimistic-commits-keep-version-updates-simple" class="common-anchor-header">Las confirmaciones optimistas simplifican las actualizaciones de versión</h3><p>Cada confirmación escribe una nueva versión del «Manifest». Un escritor puede crear nuevo contenido basado en la versión N y, a continuación, intentar escribir un « <code translate="no">manifest-{N+1}.avro</code> ». La semántica de escritura condicional o de coincidencia de generación del almacenamiento de objetos puede hacer que la confirmación falle si esa versión ya existe. El escritor puede entonces volver a intentarlo con la versión más reciente.</p>
<p>Esto proporciona a Loon concurrencia optimista sin obligar a que cada actualización pase por una ruta de coordinación pesada y fuertemente consistente. Sin un «Manifest», el almacenamiento multiformato y multimotor acaba convirtiéndose en convenciones de nomenclatura y reconciliación manual. Eso puede funcionar para conjuntos de datos pequeños, pero no para datos vectoriales a escala de terabytes.</p>
<p>El «Manifest» es lo que convierte los archivos heterogéneos en un conjunto de datos que múltiples sistemas pueden leer y actualizar de forma segura.</p>
<h2 id="What-changes-for-users-when-storage-becomes-versioned" class="common-anchor-header">¿Qué cambia para los usuarios cuando el almacenamiento pasa a estar versionado?<button data-href="#What-changes-for-users-when-storage-becomes-versioned" class="anchor-icon" translate="no">
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
    </button></h2><p>Para los desarrolladores de aplicaciones, Loon no debería suponer una nueva carga en forma de API.</p>
<p>Los usuarios deberían seguir trabajando con los conceptos habituales de Milvus: colecciones, inserciones, búsquedas y búsquedas híbridas. No deberían tener que pensar en archivos de manifiesto, ColumnGroups, rangos de ID de filas o el diseño de los archivos durante el desarrollo normal de las aplicaciones.</p>
<p>El cambio se produce en segundo plano. El almacenamiento tiene más en cuenta cómo evolucionan realmente los conjuntos de datos de IA.</p>
<h3 id="Adding-a-new-embedding-should-not-move-the-old-data" class="common-anchor-header">Añadir una nueva incrustación no debería desplazar los datos antiguos</h3><p>Anteriormente, añadir un <code translate="no">embedding_v2</code> o a una colección existente solía requerir exportar datos, entrenar un nuevo modelo, generar vectores y, a continuación, reimportar o actualizar de forma masiva la colección a través del SDK. Ese proceso genera mucho trabajo operativo: seguimiento de versiones, reintentos de tareas fallidas, reconstrucciones de índices, impacto en el servicio y comprobaciones de consistencia.</p>
<p><strong>Con Loon, esto puede reducirse a una evolución del esquema más una nueva confirmación de ColumnGroup.</strong> La nueva columna de incrustación puede escribirse como su propio ColumnGroup físico, alineada por ID de fila, y hacerse visible a través del Manifest. No es necesario mover la antigua columna de leyenda, la columna de metadatos escalares ni la columna de incrustación original.</p>
<h3 id="Backfills-should-not-require-a-client-side-update-loop" class="common-anchor-header">Las actualizaciones retrospectivas no deberían requerir un ciclo de actualización del lado del cliente</h3><p>Muchas actualizaciones de datos de IA son rellenos retrospectivos. Un equipo puede añadir vectores dispersos cuando la búsqueda híbrida cobra importancia. Puede añadir características de reordenación tras el entrenamiento de un nuevo modelo. Puede corregir los pies de foto tras una revisión humana. Puede añadir etiquetas de gobernanza tras una actualización de la política.</p>
<p>En una estructura tradicional, estos cambios suelen producirse mediante actualizaciones del SDK del cliente o rutas de escritura exclusivas de la base de datos, incluso cuando los datos son generados por Spark, Ray u otro motor externo.</p>
<p>Con Loon, los sistemas de computación externos pueden generar nuevos ColumnGroups y confirmarlos a través del Manifest. La base de datos ya no tiene por qué ser el único punto de entrada para cada reescritura.</p>
<h3 id="Offline-analysis-should-not-require-another-copy-of-the-truth" class="common-anchor-header">El análisis fuera de línea no debería requerir otra copia de los datos originales</h3><p>Anteriormente, los equipos solían volcar una colección en línea a Parquet para su evaluación o análisis sin conexión. Esto crea dos versiones del mismo conjunto de datos: la colección en línea y la copia de análisis. Una vez que se corrigen las leyendas, se regeneran las incrustaciones, se aplican los registros de eliminación o se reconstruyen los índices, el equipo tiene que preguntarse qué copia está actualizada.</p>
<p>Con un modelo de almacenamiento basado en el Manifest, los motores de análisis pueden leer la misma vista versionada del conjunto de datos que el sistema de servicio. Pueden proyectar solo las columnas que necesitan, escanear solo los rangos de filas relevantes y trabajar con una versión declarada del conjunto de datos en lugar de una instantánea exportada manualmente.</p>
<h3 id="Deletes-and-corrections-should-touch-only-what-changed" class="common-anchor-header">Las eliminaciones y correcciones solo deben afectar a lo que ha cambiado</h3><p>Las eliminaciones, las correcciones de leyendas, las correcciones de etiquetas y las actualizaciones de gobernanza son habituales en los conjuntos de datos de IA. No deberían obligar a que todas las columnas de vectores largos sigan la misma ruta de reescritura.</p>
<p>Con Loon, la eliminación de registros puede tratarse en un primer momento como una eliminación lógica. Posteriormente, la compactación puede limpiar los ColumnGroups afectados sin reescribir datos no relacionados. Si cambia un campo de texto corto, la capa de almacenamiento no debería tener que reescribir cientos de gigabytes de vectores densos solo porque compartan la misma fila lógica.</p>
<h3 id="External-engines-become-part-of-the-workflow-not-an-escape-hatch" class="common-anchor-header">Los motores externos pasan a formar parte del flujo de trabajo, no son una vía de escape</h3><p>El cambio más significativo es que los motores externos ya no se tratan como sistemas ajenos a la base de datos vectorial.</p>
<p>Spark, Ray, los trabajos de evaluación, los sistemas de etiquetado y los flujos de trabajo de gobernanza ya producen y modifican gran parte de los datos. La capa de almacenamiento debería permitirles colaborar en torno a una única fuente de verdad, en lugar de tener que exportar, copiar y reimportar constantemente.</p>
<p>Eso es lo que hace posible una versión de Manifest. Proporciona a la prestación de servicios en línea, el análisis fuera de línea, los trabajos de retroalimentación y la compactación una visión compartida del conjunto de datos.</p>
<p>Puede que esto suene a detalles de almacenamiento interno, pero afecta a la rapidez con la que los equipos pueden iterar sobre los conjuntos de datos de IA. Cada cambio de modelo, relleno de características, corrección de etiquetas, filtro de calidad y reconstrucción de índices depende de la misma pregunta:<strong>«¿Puede el sistema actualizar el conjunto de datos sin mover los datos que no es necesario mover?».</strong></p>
<p>Ese es el valor práctico del modelo de almacenamiento.</p>
<h2 id="Loon-is-available-in-Milvus-30-beta-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Loon está disponible en la versión beta de Milvus 3.0 y en Zilliz Vector Lakebase<button data-href="#Loon-is-available-in-Milvus-30-beta-and-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>Loon está disponible en <a href="https://milvus.io/docs/release_notes.md">la versión beta de Milvus 3.0</a> y también forma parte de la capa de almacenamiento de <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Zilliz Vector Lakebase</a>, la próxima evolución de Zilliz Cloud. Además, esta versión se centra en tres áreas fundamentales:</p>
<ul>
<li><strong>El Manifest.</strong> El objetivo es que las operaciones de escritura, relleno retrospectivo, eliminación, estadísticas y actualizaciones de índices generen vistas versionadas del conjunto de datos que los lectores puedan abrir de forma coherente. Para los lectores, esto significa que una consulta puede abrir una versión específica del «Manifest» y ver una vista estable del conjunto de datos. Para los escritores, esto significa que los nuevos archivos de datos, los registros de eliminación, las estadísticas o los archivos de índice pueden prepararse primero y luego hacerse visibles a través de una confirmación versionada.</li>
<li><strong>Compatibilidad con ColumnGroup y formatos.</strong> Parquet admite columnas escalares y compatibles con el ecosistema. Vortex admite patrones de acceso con gran volumen de vectores. Lance se puede integrar en modo de solo lectura para garantizar la compatibilidad con los conjuntos de datos de Lance existentes.</li>
<li><strong>El índice en Lake.</strong> Las estadísticas escalares, los índices de filtrado y los índices invertidos de texto pueden participar en la planificación basada en el manifiesto por rango de filas. Los índices vectoriales nativos de Lake tienen un papel más complejo. HNSW e IVF tienen un comportamiento diferente en el almacenamiento de objetos y, en particular, HNSW es sensible al acceso aleatorio y a la localidad de la caché. No se puede simplemente reutilizar una estructura diseñada para un SSD local y esperar el mismo resultado.</li>
</ul>
<h3 id="There-is-still-work-ahead" class="common-anchor-header">Aún queda trabajo por delante</h3><ul>
<li><strong>Las rutas de escritura externas</strong> son importantes porque Spark y Ray deberían poder generar ColumnGroups y confirmaciones de Manifest sin obligar a que cada relleno se realice a través de un bucle del SDK del cliente.</li>
<li><strong>La interoperabilidad de Lakehouse</strong> es importante porque muchos equipos ya utilizan catálogos y motores de consulta como <strong>Iceberg, Delta Lake, Trino, DuckDB y Athena.</strong> Los datos vectoriales deberían poder integrarse en ese ecosistema sin perder rendimiento en la búsqueda vectorial.</li>
<li><strong>El diseño de los índices</strong> es importante porque los índices de grafos y las estructuras invertidas tienen patrones de acceso diferentes en el almacenamiento de objetos.</li>
<li><strong>La semántica de los objetos de gran tamaño</strong> es importante porque los vídeos sin editar, los PDF, las imágenes y los archivos de audio requieren una gestión de referencias, un control de versiones y un comportamiento de eliminación que se ajusten al conjunto de datos vectoriales derivado.</li>
</ul>
<p>El comportamiento exacto de la versión, la configuración predeterminada y la ruta de migración deben seguir <a href="https://docs.zilliz.com/docs/release-notes-2605">las notas de la versión</a> pertinentes de Milvus y <a href="https://docs.zilliz.com/docs/release-notes-2605">Zilliz Cloud</a>. Sin embargo, la dirección en materia de almacenamiento está clara: las bases de datos vectoriales necesitan una base versionada y nativa del lago de datos bajo la capa de servicio.</p>
<h2 id="Try-Loon-under-Zilliz-Vector-Lakebase" class="common-anchor-header">Prueba Loon con Zilliz Vector Lakebase<button data-href="#Try-Loon-under-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>Si tu pila actual separa el servicio en línea, el análisis fuera de línea, los rellenos retrospectivos y los flujos de trabajo de lagos de datos externos en diferentes sistemas, merece la pena echar un vistazo a Zilliz Vector Lakebase. Puedes probarlo en <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>. Los nuevos registros con correo electrónico profesional obtienen 100 $ en créditos gratuitos. También te invitamos a <a href="https://zilliz.com/contact-sales">hablar con nosotros</a> sobre tu caso de uso.</p>
<p>También puedes seguir el <a href="https://milvus.io/docs/release_notes.md">lanzamiento de Milvus 3.0</a> para ver cómo evoluciona Loon en el motor de código abierto.</p>
<p><strong>Zilliz Vector Lakebase reúne:</strong></p>
<ul>
<li>Servicio por niveles para diferentes equilibrios entre rendimiento en tiempo real y costes</li>
<li>Búsqueda bajo demanda para cargas de trabajo a gran escala o exploratorias sin necesidad de recursos de computación siempre activos</li>
<li>Búsqueda en lagos de datos externos, para que puedas indexar y buscar directamente en los datos existentes del lago</li>
<li>Búsqueda de espectro completo en vectores, texto, JSON y datos geoespaciales, con recuperación híbrida y reordenación de resultados</li>
<li>Almacenamiento unificado nativo de lago de datos basado en Vortex, un formato abierto diseñado para lecturas aleatorias más rápidas y de menor coste en datos con gran cantidad de vectores</li>
</ul>
