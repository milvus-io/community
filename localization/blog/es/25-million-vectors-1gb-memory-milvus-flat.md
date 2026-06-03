---
id: 25-million-vectors-1gb-memory-milvus-flat.md
title: >-
  Cómo ejecutar 25 millones de vectores de imagen con menos de 1 GB de memoria
  en Milvus
author: Jack Li
date: 2026-6-3
cover: >-
  assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_1_19b2539810.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus FLAT index, vector database memory, mmap vector index, FP16 vector
  quantization, image search
meta_title: |
  How to Run 25 Million Image Vectors on Under 1GB of Memory in Milvus
desc: >-
  Cómo un usuario de la comunidad ejecutó una búsqueda de imágenes de 25M de
  vectores en &lt;1GB de memoria en Milvus utilizando FLAT, FP16 y mmap - en
  lugar de la estimación de 139GB de la Herramienta de Dimensionamiento.
origin: 'https://milvus.io/blog/25-million-vectors-1gb-memory-milvus-flat.md'
---
<p>Un usuario de Milvus nos planteó recientemente un problema muy práctico de búsqueda de imágenes.</p>
<p>"Necesitamos realizar búsquedas imagen a imagen en 25 millones de imágenes, codificadas como vectores de 1280 dimensiones. Una sola máquina se encargará de la carga de trabajo. Tiene 64 GB de RAM, y como máximo 32 GB pueden ir a la base de datos de vectores. Pero <a href="https://milvus.io/tools/sizing"><strong>Milvus Sizing Tool</strong></a> dice que necesitamos 139 GB. ¿Estamos listos?"</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_2_06e0f8be39.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Resultados de la estimación de la herramienta de dimensionamiento: 25M × 1280 vectores dimensionales, tamaño de datos brutos 119,2 GB, memoria de carga 139,4 GB</p>
<p>No del todo.</p>
<p>Al principio, la respuesta obvia parecía ser un índice más avanzado. Si el conjunto de datos es grande y la memoria es escasa, seguramente un índice RNA más inteligente debería ayudar. En este caso, no fue así. El índice que finalmente funcionó fue la opción más sencilla de Milvus: <a href="https://milvus.io/docs/flat.md"><strong>FLAT</strong></a>.</p>
<p>El resultado fue mejor de lo esperado: la memoria en estado estacionario se mantuvo por debajo de 1 GB, la memoria residente del contenedor rondó los 600 MB y la latencia de consulta en caliente se mantuvo por debajo de los 100 ms. El arranque alcanzó brevemente un máximo de 12,5 GB, y la primera consulta tardó unos 30 segundos mientras el sistema se calentaba.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_3_272794fc9b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Lo importante no es que FLAT abaratara mágicamente 25 millones de comparaciones de fuerza bruta. No es así. Lo importante es que esta carga de trabajo casi nunca buscó los 25 millones de vectores. Los filtros escalares redujeron primero cada consulta, y FLAT sólo comparó vectores dentro de ese conjunto de candidatos mucho más pequeño.</p>
<p>Este artículo explica qué falló, por qué funcionó FLAT y cuándo merece la pena probar el mismo patrón en su propia carga de trabajo.</p>
<h2 id="Why-AISAQ-and-IVFFLAT-Did-Not-Work-Here" class="common-anchor-header">Por qué AISAQ e IVF_FLAT no funcionaron aquí<button data-href="#Why-AISAQ-and-IVFFLAT-Did-Not-Work-Here" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de FLAT, el usuario probó dos índices que parecían más naturales para una máquina con restricciones.</p>
<p><strong>Primer intento:</strong> <a href="https://milvus.io/docs/aisaq.md"><strong>AISAQ</strong></a><strong>.</strong> AISAQ es un índice orientado al disco diseñado para mantener bajo el uso de memoria. El problema de esta carga de trabajo era la ruta de creación y carga. En una prueba anterior con 55 millones de vectores, una carga de recopilación escribió 249 GB de datos temporales en el disco y tardó demasiado tiempo para ser práctica.</p>
<p><strong>Segundo intento: IVF_FLAT.</strong> IVF_FLAT también parecía razonable porque es un índice ANN estándar. El índice se construyó con éxito, pero la carga de la colección se estancó en el 14% y nunca se recuperó.</p>
<p>Tras estos dos callejones sin salida, el usuario probó la opción más aburrida: FLAT. Se cargó limpiamente. También ofrecía el mejor comportamiento en tiempo de ejecución para este patrón de consulta específico.</p>
<table>
<thead>
<tr><th><strong>Índice</strong></th><th><strong>Por qué parecía prometedor</strong></th><th><strong>Qué ocurrió en esta carga de trabajo</strong></th></tr>
</thead>
<tbody>
<tr><td>AISAQ</td><td>Índice orientado a disco con bajo uso de memoria en teoría</td><td>La ruta de creación/carga generó grandes archivos temporales. En una prueba de 55M de vectores, una carga de recopilación escribió 249GB de datos temporales y fue lenta.</td></tr>
<tr><td>IVF_FLAT</td><td>Índice RNA estándar con menor coste de búsqueda que un escaneo completo</td><td>El índice se creó, pero la carga de recopilación se estancó en el 14% y no se recuperó.</td></tr>
<tr><td>FLAT</td><td>Sin estructura RNA adicional ni complejidad de creación de índices</td><td>La memoria en estado estacionario se mantuvo por debajo de 1 GB. La memoria residente del contenedor rondaba los 600 MB. El arranque alcanzó un máximo de 12,5 GB. La primera consulta tardó unos 30 segundos, y las consultas en caliente se mantuvieron por debajo de los 100 ms.</td></tr>
</tbody>
</table>
<p>La lección es sencilla: un índice que es eficiente en teoría puede ser inadecuado para un equipo, una forma de datos y un patrón de consulta concretos.</p>
<h2 id="Why-FLAT-Worked" class="common-anchor-header">Por qué funcionó FLAT<button data-href="#Why-FLAT-Worked" class="anchor-icon" translate="no">
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
    </button></h2><p>FLAT es el índice más simple que admite Milvus. Sin gráfico. Sin árbol. Sin agrupación. Compara el vector de consulta directamente con los vectores candidatos.</p>
<p>Parece la herramienta equivocada para 25 millones de vectores. Sería la herramienta equivocada si cada consulta buscara en toda la colección.</p>
<p>Pero esta carga de trabajo tenía un filtro fuerte delante de la búsqueda de vectores. Cada consulta acotaba primero el espacio de búsqueda con campos escalares como <code translate="no">dataid</code> y <code translate="no">classid</code>. Sólo entonces Milvus ejecutaba la búsqueda de similitud vectorial. Eso cambió el problema de "buscar 25 millones de vectores" a "buscar entre unos cientos y decenas de miles de vectores después de filtrar".</p>
<p>Tres piezas hicieron que la configuración funcionara: Almacenamiento de vectores FP16, mmap para datos vectoriales sin procesar y filtrado escalar antes del pase FLAT.</p>
<h2 id="Optimization-1-FP16-Cuts-Vector-Data-in-Half" class="common-anchor-header">Optimización 1: FP16 reduce los datos vectoriales a la mitad<button data-href="#Optimization-1-FP16-Cuts-Vector-Data-in-Half" class="anchor-icon" translate="no">
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
    </button></h2><p>Los vectores tenían 1.280 dimensiones. Almacenados como FP32, cada vector necesita 5.120 bytes:</p>
<p><code translate="no">1280 dimensions x 4 bytes = 5120 bytes</code></p>
<p>En 25 millones de vectores, esto supone unos 119,2 GB de datos vectoriales sin procesar. FP16 reduce cada dimensión de 4 a 2 bytes:</p>
<p><code translate="no">1280 dimensions x 2 bytes = 2560 bytes</code></p>
<p>Así que los datos vectoriales en bruto se reducen a unos 59,6 GB.</p>
<p>Esto sigue sin encajar perfectamente en la RAM disponible, pero reduce a la mitad la cantidad de datos vectoriales que Milvus y el sistema operativo tienen que manejar. En muchas cargas de trabajo de recuperación de imágenes, FP16 tiene un pequeño impacto en la recuperación, pero no es una regla gratuita. Pruebe la recuperación con sus propias incrustaciones, métrica y barra de calidad antes de hacerla por defecto.</p>
<h2 id="Optimization-2-mmap-Keeps-Raw-Vectors-Off-the-Process-Heap" class="common-anchor-header">Optimización 2: mmap mantiene los vectores sin procesar fuera de la pila del proceso<button data-href="#Optimization-2-mmap-Keeps-Raw-Vectors-Off-the-Process-Heap" class="anchor-icon" translate="no">
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
    </button></h2><p>Incluso después de FP16, alrededor de 60 GB de vectores sigue siendo demasiado para el presupuesto de memoria. Ahí es donde <a href="https://milvus.io/docs/mmap.md"><strong>mmap</strong></a> se vuelve útil.</p>
<p>Con mmap, Milvus puede acceder a los datos vectoriales a través de archivos mapeados en memoria en lugar de cargar todo el campo de vectores sin procesar en la memoria del proceso. El sistema operativo pagina los datos a medida que las consultas los tocan y puede mantener las páginas calientes en su caché de páginas.</p>
<p>En el entorno Milvus 2.6.14 de este usuario, la configuración mmap a nivel de clúster ya cubría los datos vectoriales sin procesar, por lo que el usuario no necesitaba configurar mmap manualmente.</p>
<p>Un detalle causó confusión durante la depuración: Attu muestra la configuración mmap a nivel de esquema, no la predeterminada a nivel de clúster. Así que <a href="https://zilliz.com/attu"><strong>Attu</strong></a> puede mostrar mmap como deshabilitado incluso cuando la configuración a nivel de cluster está efectivamente habilitando mmap para la ruta de datos.</p>
<p>mmap ahorra RAM, pero utiliza más el disco y la caché de páginas del sistema operativo. Sigue necesitando capacidad SSD para los archivos vectoriales, y la primera consulta puede ser más lenta mientras se leen del disco las páginas relevantes.</p>
<h2 id="Optimization-3-Scalar-Filtering-Is-the-Real-Performance-Multiplier" class="common-anchor-header">Optimización 3: El filtrado escalar es el verdadero multiplicador del rendimiento<button data-href="#Optimization-3-Scalar-Filtering-Is-the-Real-Performance-Multiplier" class="anchor-icon" translate="no">
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
    </button></h2><p>FP16 y mmap explican el número de memoria. El filtrado escalar explica el número de latencia.</p>
<p>Cada consulta de esta carga de trabajo incluía una expresión de filtro como ésta:</p>
<pre><code translate="no" class="language-sql">dataid in [123] AND classid in [0, 2, 3]
<button class="copy-code-btn"></button></code></pre>
<p>Ese filtro se ejecutaba antes del paso de comparación de vectores. En lugar de comparar con 25 millones de vectores, FLAT comparó con el conjunto de candidatos filtrados, que oscilaba entre unos cientos y decenas de miles de vectores.</p>
<p>Por eso, las consultas en caliente se mantuvieron por debajo de los 100 ms. Decenas de miles de comparaciones de vectores son prácticas en una CPU moderna. Veinticinco millones de comparaciones por consulta sería una historia muy diferente.</p>
<p>Esto también explica por qué IVF_FLAT y HNSW no resultaron útiles en este caso. Una vez que el filtrado escalar ha reducido el conjunto de candidatos lo suficiente, una estructura ANN adicional puede convertirse en peso muerto. Añade memoria, tiempo de construcción y complejidad de carga, pero puede que no mejore mucho la latencia.</p>
<p>Hay una advertencia. Los filtros de esta carga de trabajo eran sencillos. Si sus filtros utilizan grandes listas <code translate="no">IN</code>, patrones <code translate="no">LIKE</code>, predicados de rango o condiciones JSON anidadas, añada índices escalares en los campos relevantes y mida la etapa de filtrado directamente.</p>
<table>
<thead>
<tr><th>Optimización</th><th>Para qué sirve</th><th>Por qué es importante aquí</th><th>Contrapartida</th></tr>
</thead>
<tbody>
<tr><td>Almacenamiento de vectores FP16</td><td>Almacena cada dimensión vectorial con 2 bytes en lugar de 4 bytes</td><td>Reducción de los datos vectoriales brutos de 119,2 GB a 59,6 GB.</td><td>El impacto en la recuperación depende de las incrustaciones y de la métrica. Pruébelo.</td></tr>
<tr><td>mmap en vectores sin procesar</td><td>Asigna archivos vectoriales desde el disco en lugar de cargar todo el campo de vectores sin procesar en la memoria del proceso.</td><td>Mantiene baja la memoria de proceso mientras permite que el sistema operativo pagine los datos según sea necesario.</td><td>Requiere capacidad SSD y puede hacer que las consultas en frío sean más lentas.</td></tr>
<tr><td>Filtrado escalar primero</td><td>Filtra por campos escalares antes de comparar vectores.</td><td>Reduce cada consulta de 25 millones de candidatos a cientos o decenas de miles.</td><td>Los filtros complejos pueden necesitar índices escalares.</td></tr>
</tbody>
</table>
<h2 id="Where-This-Pattern-Applies" class="common-anchor-header">Dónde se aplica este patrón<button data-href="#Where-This-Pattern-Applies" class="anchor-icon" translate="no">
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
    </button></h2><p>El caso de la búsqueda de imágenes funcionó porque el espacio de búsqueda real era mucho menor que la colección total. Esa misma forma aparece en muchas cargas de trabajo de producción.</p>
<ol>
<li><strong>RAG de varios inquilinos:</strong> filtre primero por <code translate="no">tenant_id</code>, <code translate="no">workspace_id</code> o <code translate="no">project_id</code>. Cada inquilino puede tener sólo miles o decenas de miles de chunks.</li>
<li><strong>Búsqueda de productos de comercio electrónico:</strong> Filtre por categoría, marca, vendedor, región o disponibilidad antes de la búsqueda vectorial.</li>
<li><strong>Recuperación de registros y documentos:</strong> Filtrado por intervalo de tiempo, fuente, servicio o tipo de documento antes de la búsqueda semántica.</li>
<li><strong>Búsqueda de imágenes o medios con etiquetas:</strong> Filtre por conjunto de datos, clase, cliente o grupo de activos antes de comparar incrustaciones.</li>
</ol>
<p>Estos son buenos candidatos para FLAT + FP16 + mmap porque la colección completa puede ser grande mientras que cada consulta sigue afectando a un pequeño subconjunto.</p>
<p>El patrón no se aplica cuando cada consulta busca en toda la colección. Si cada consulta realmente necesita escanear los 25 millones de vectores, FLAT no le dará la misma latencia. En ese caso, utilice un índice RNA como HNSW, IVF o un índice orientado a disco, y planifique las compensaciones de memoria, disco y tiempo de compilación.</p>
<h2 id="How-to-Read-the-Sizing-Tool-Estimate" class="common-anchor-header">Cómo leer la estimación de la herramienta de dimensionamiento<button data-href="#How-to-Read-the-Sizing-Tool-Estimate" class="anchor-icon" translate="no">
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
    </button></h2><p>La herramienta de dimensionamiento de Milvus es un punto de partida, no un veredicto final sobre su hardware.</p>
<p>En este caso, la estimación de 139,4 GB de memoria de carga sirvió como punto de partida conservador para 25 millones de vectores FP32 de 1280 dimensiones. La carga de trabajo real cambió varios supuestos:</p>
<ol>
<li>FP16 redujo el tamaño de los vectores en bruto aproximadamente a la mitad.</li>
<li>mmap evitó cargar todo el campo de vectores en bruto en la memoria de proceso.</li>
<li>FLAT evitó estructuras de índice RNA adicionales.</li>
<li>Los filtros escalares hacían que cada consulta buscara un conjunto de candidatos mucho más pequeño.</li>
</ol>
<p>Por eso son tan importantes las pruebas con cargas de trabajo reales. Antes de rechazar una configuración de hardware basada únicamente en una estimación de tamaño, realice pruebas con su precisión de vector real, tipo de índice, configuración mmap, filtros escalares, comportamiento de consulta en frío y comportamiento de consulta en caliente.</p>
<h2 id="Get-Started" class="common-anchor-header">Comenzar<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>Si desea probar la misma receta, comience con el patrón de consulta, no con el nombre del índice.</p>
<ol>
<li>Compruebe si cada consulta tiene filtros escalares selectivos.</li>
<li>Calcule cuántos vectores quedan después del filtrado.</li>
<li>Almacene los vectores como FP16 si la prueba de recuperación parece buena.</li>
<li>Utilizar FLAT cuando el conjunto de candidatos filtrados sea lo suficientemente pequeño para la comparación por fuerza bruta.</li>
<li>Verificar el comportamiento de mmap para datos vectoriales sin procesar. Compruebe tanto la configuración a nivel de esquema como la configuración a nivel de clúster.</li>
<li>Mida la memoria de arranque, la latencia de la primera consulta, la latencia de la consulta en caliente y la E/S de disco.</li>
<li>Añada índices escalares si la evaluación de filtros se convierte en el cuello de botella.</li>
</ol>
<p>Para pruebas locales, comience con el <a href="https://milvus.io/docs/quickstart.md"><strong>inicio rápido de Milvus</strong></a> o el repositorio <a href="https://github.com/milvus-io/milvus"><strong>GitHub</strong></a> de Milvus. Utilice Attu para inspeccionar las colecciones, pero recuerde que Attu puede no mostrar los valores predeterminados mmap a nivel de clúster.</p>
<p>Si no desea ejecutar la infraestructura usted mismo, <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a> es el servicio Milvus gestionado. Obtiene el mismo núcleo de Milvus con operaciones gestionadas, escalado y un nivel gratuito para pruebas. <a href="https://cloud.zilliz.com/signup"><strong>Regístrese</strong></a> para obtener 100 dólares de créditos gratuitos con una dirección de correo electrónico del trabajo, o <a href="https://cloud.zilliz.com/login"><strong>inicie sesión</strong></a> si ya tiene una cuenta.</p>
