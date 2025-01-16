---
id: building-a-personalized-product-recommender-system-with-vipshop-and-milvus.md
title: Arquitectura general
author: milvus
date: 2021-07-29T08:46:39.920Z
desc: >-
  Milvus facilita la prestación del servicio de recomendación personalizada a
  los usuarios.
cover: assets.zilliz.com/blog_shopping_27fba2c990.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-personalized-product-recommender-system-with-vipshop-and-milvus
---
<custom-h1>Creación de un sistema personalizado de recomendación de productos con Vipshop y Milvus</custom-h1><p>Con el crecimiento explosivo de la escala de datos de Internet, la cantidad de productos, así como la categoría en la actual plataforma de comercio electrónico dominante aumentan por un lado, la dificultad de los usuarios para encontrar los productos que necesitan aumenta por otro.</p>
<p><a href="https://www.vip.com/">Vipshop</a> es un minorista de descuentos en línea líder en marcas en China. La empresa ofrece productos de marca populares y de alta calidad a consumidores de toda China con importantes descuentos respecto a los precios de venta al público. Para optimizar la experiencia de compra de sus clientes, la empresa decidió crear un sistema de recomendación de búsqueda personalizado basado en las palabras clave de la consulta y los retratos de los usuarios.</p>
<p>La función principal del sistema de recomendación de búsqueda de comercio electrónico es recuperar productos adecuados de entre un gran número de productos y mostrárselos a los usuarios según su intención de búsqueda y sus preferencias. En este proceso, el sistema tiene que calcular la similitud entre los productos y la intención de búsqueda y las preferencias de los usuarios, y recomienda los productos TopK con mayor similitud a los usuarios.</p>
<p>La información sobre los productos, la intención de búsqueda y las preferencias de los usuarios son datos no estructurados. Intentamos calcular la similitud de estos datos utilizando CosineSimilarity(7.x) del motor de búsqueda Elasticsearch (ES), pero este método presenta los siguientes inconvenientes.</p>
<ul>
<li><p>Largo tiempo de respuesta computacional - la latencia media para recuperar resultados TopK de millones de elementos es de unos 300 ms.</p></li>
<li><p>Alto coste de mantenimiento de los índices de ES - se utiliza el mismo conjunto de índices tanto para los vectores de características de los productos básicos como para otros datos relacionados, lo que apenas facilita la construcción de índices, pero produce una cantidad masiva de datos.</p></li>
</ul>
<p>Intentamos desarrollar nuestro propio complemento hash localmente sensible para acelerar el cálculo de CosineSimilarity de ES. Aunque el rendimiento y la producción mejoraron significativamente tras la aceleración, la latencia de más de 100 ms seguía siendo difícil de satisfacer para los requisitos reales de recuperación de productos en línea.</p>
<p>Después de una investigación exhaustiva, decidimos utilizar Milvus, una base de datos vectorial de código abierto, que cuenta con la ventaja de ser compatible con el despliegue distribuido, SDK multilingüe, separación de lectura/escritura, etc., en comparación con la comúnmente utilizada Faiss independiente.</p>
<p>Utilizando varios modelos de aprendizaje profundo, convertimos datos masivos no estructurados en vectores de características e importamos los vectores a Milvus. Con el excelente rendimiento de Milvus, nuestro sistema de recomendación de búsqueda de comercio electrónico puede consultar eficientemente los vectores TopK que son similares a los vectores objetivo.</p>
<h2 id="Overall-Architecture" class="common-anchor-header">Arquitectura general<button data-href="#Overall-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Arquitectura](https://assets.zilliz.com/1_01551e7b2b.jpg &quot;Arquitectura&quot;.) Como se muestra en el diagrama, la arquitectura general del sistema consta de dos partes principales.</p>
<ul>
<li><p>Proceso de escritura: los vectores de características de artículos (en lo sucesivo, vectores de artículos) generados por el modelo de aprendizaje profundo se normalizan y se escriben en MySQL. A continuación, MySQL lee los vectores de características de elementos procesados mediante la herramienta de sincronización de datos (ETL) y los importa a la base de datos de vectores Milvus.</p></li>
<li><p>Proceso de lectura: El servicio de búsqueda obtiene los vectores de características de preferencia del usuario (en lo sucesivo, vectores de usuario) basándose en las palabras clave de consulta del usuario y en los retratos del usuario, consulta vectores similares en Milvus y recupera vectores de artículos TopK.</p></li>
</ul>
<p>Milvus admite tanto la actualización incremental de datos como la actualización completa de datos. Cada actualización incremental tiene que eliminar el vector de elementos existente e insertar un nuevo vector de elementos, lo que significa que cada colección recién actualizada se volverá a indexar. Se adapta mejor a un escenario con más lecturas y menos escrituras. Por lo tanto, elegimos el método de actualización de datos completos. Además, sólo se tarda unos minutos en escribir todos los datos en lotes de varias particiones, lo que equivale a actualizaciones casi en tiempo real.</p>
<p>Los nodos de escritura de Milvus realizan todas las operaciones de escritura, incluyendo la creación de colecciones de datos, la construcción de índices, la inserción de vectores, etc., y proporcionan servicios al público con nombres de dominio de escritura. Los nodos de lectura de Milvus realizan todas las operaciones de lectura y proporcionan servicios al público con nombres de dominio de sólo lectura.</p>
<p>Mientras que la versión actual de Milvus no admite el cambio de alias de colecciones, introducimos Redis para cambiar sin problemas de alias entre varias colecciones de datos completas.</p>
<p>El nodo de lectura sólo necesita leer la información de metadatos existente y los datos vectoriales o índices de MySQL, Milvus y el sistema de archivos distribuido GlusterFS, por lo que la capacidad de lectura puede ampliarse horizontalmente desplegando múltiples instancias.</p>
<h2 id="Implementation-Details" class="common-anchor-header">Detalles de implementación<button data-href="#Implementation-Details" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Data-Update" class="common-anchor-header">Actualización de datos</h3><p>El servicio de actualización de datos incluye no sólo la escritura de datos vectoriales, sino también la detección del volumen de datos de los vectores, la construcción de índices, la precarga de índices, el control de alias, etc. El proceso global es el siguiente. <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_6052b01334.jpg" alt="Process" class="doc-image" id="process" /><span>Proceso</span> </span></p>
<ol>
<li><p>Supongamos que antes de construir los datos completos, la ColecciónA proporciona el servicio de datos al público, y los datos completos que se utilizan se dirigen a la ColecciónA (<code translate="no">redis key1 = CollectionA</code>). El objetivo de la construcción de datos completos es crear una nueva colección ColecciónB.</p></li>
<li><p>Comprobación de datos de materias primas: compruebe el número de posición de los datos de materias primas en la tabla MySQL, compare los datos de materias primas con los datos existentes en la colecciónA. La alerta puede establecerse en función de la cantidad o del porcentaje. Si no se alcanza la cantidad (porcentaje) establecida, no se crearán todos los datos y se considerará un fallo de esta operación de creación, activando la alerta; una vez alcanzada la cantidad (porcentaje) establecida, se inicia el proceso de creación de todos los datos.</p></li>
<li><p>Comienza la construcción de los datos completos - inicializa el alias de los datos completos que se están construyendo, y actualiza Redis. Después de la actualización, el alias de los datos completos que se están construyendo se dirige a CollectionB (<code translate="no">redis key2 = CollectionB</code>).</p></li>
<li><p>Crear una nueva colección completa - determinar si CollectionB existe. Si existe, elimínela antes de crear una nueva.</p></li>
<li><p>Escritura de datos por lotes - calcule el ID de partición de cada dato de producto con su propio ID utilizando la operación módulo, y escriba los datos en múltiples particiones a la colección recién creada por lotes.</p></li>
<li><p>Construir y precargar índice - Crear índice (<code translate="no">createIndex()</code>) para la nueva colección. El archivo de índice se almacena en el servidor de almacenamiento distribuido GlusterFS. El sistema simula automáticamente la consulta en la nueva colección y precarga el índice para el calentamiento de la consulta.</p></li>
<li><p>Comprobación de los datos de la colección: comprueba el número de elementos de los datos de la nueva colección, compara los datos con los de la colección existente y establece alarmas en función de la cantidad y el porcentaje. Si no se alcanza el número establecido (porcentaje), la colección no se conmutará y el proceso de construcción se considerará un fallo, activando la alerta.</p></li>
<li><p>Cambio de colección - Control de alias. Tras actualizar Redis, todo el alias de datos que se está utilizando se dirige a la colecciónB (<code translate="no">redis key1 = CollectionB</code>), se elimina la clave original de Redis2 y finaliza el proceso de construcción.</p></li>
</ol>
<h3 id="Data-Recall" class="common-anchor-header">Recuperación de datos</h3><p>Los datos de partición de Milvus se llaman varias veces para calcular la similitud entre los vectores de usuario, obtenidos a partir de las palabras clave de la consulta del usuario y el retrato del usuario, y el vector de artículo, y los vectores de artículo TopK se devuelven después de la fusión. El esquema general del flujo de trabajo es el siguiente: <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_93518602b1.jpg" alt="workflow" class="doc-image" id="workflow" /><span>flujo de trabajo</span>En la </span>tabla siguiente se enumeran los principales servicios que intervienen en este proceso. Se puede observar que la latencia media para recuperar los vectores TopK es de unos 30 ms.</p>
<table>
<thead>
<tr><th><strong>Servicio</strong></th><th><strong>Función</strong></th><th><strong>Parámetros de entrada</strong></th><th><strong>Parámetros de salida</strong></th><th><strong>Latencia de respuesta</strong></th></tr>
</thead>
<tbody>
<tr><td>Obtención de vectores de usuario</td><td>Obtención de vectores de usuario</td><td>información del usuario + consulta</td><td>vector usuario</td><td>10 ms</td></tr>
<tr><td>Búsqueda Milvus</td><td>Calcular la similitud vectorial y devolver los resultados TopK</td><td>vector usuario</td><td>vector elemento</td><td>10 ms</td></tr>
<tr><td>Lógica de programación</td><td>Recuperación y fusión simultáneas de resultados</td><td>Vectores de elementos recuperados multicanal y puntuación de similitud</td><td>TopK artículos</td><td>10 ms</td></tr>
</tbody>
</table>
<p><strong>Proceso de implementación:</strong></p>
<ol>
<li>Basado en las palabras clave de consulta del usuario y el retrato del usuario, el vector de usuario es calculado por el modelo de aprendizaje profundo.</li>
<li>Se obtiene el alias de la colección de todos los datos que se están utilizando de Redis currentInUseKeyRef y se obtiene Milvus CollectionName. Este proceso es un servicio de sincronización de datos, es decir, cambia el alias a Redis después de la actualización de todos los datos.</li>
<li>Milvus se llama de forma concurrente y asíncrona con el vector de usuario para obtener datos de diferentes particiones de la misma colección, y Milvus calcula la similitud entre el vector de usuario y el vector de elementos, y devuelve los TopK vectores de elementos similares en cada partición.</li>
<li>Fusiona los vectores de artículos TopK devueltos de cada partición y clasifica los resultados en orden inverso a la distancia de similitud, que se calcula utilizando el producto interior IP (cuanto mayor es la distancia entre los vectores, más similares son). Se obtienen los vectores de elementos TopK finales.</li>
</ol>
<h2 id="Looking-Ahead" class="common-anchor-header">De cara al futuro<button data-href="#Looking-Ahead" class="anchor-icon" translate="no">
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
    </button></h2><p>En la actualidad, la búsqueda vectorial basada en Milvus puede utilizarse de forma constante en la búsqueda de escenarios de recomendación, y su alto rendimiento nos da más margen para jugar en la dimensionalidad del modelo y la selección del algoritmo.</p>
<p>Milvus desempeñará un papel crucial como middleware para más escenarios, entre los que se incluyen la recuperación de la búsqueda en el sitio principal y las recomendaciones en todos los escenarios.</p>
<p>Las tres características más esperadas de Milvus en el futuro son las siguientes.</p>
<ul>
<li>Lógica para el cambio de alias de colecciones: coordina el cambio entre colecciones sin componentes externos.</li>
<li>Mecanismo de filtrado - Milvus v0.11.0 sólo soporta el mecanismo de filtrado ES DSL en la versión independiente. La nueva versión Milvus 2.0 soporta filtrado escalar y separación de lectura/escritura.</li>
<li>Soporte de almacenamiento para Hadoop Distributed File System (HDFS) - Milvus v0.10.6 que estamos utilizando sólo soporta la interfaz de archivos POSIX, y hemos desplegado GlusterFS con soporte FUSE como backend de almacenamiento. Sin embargo, HDFS es una mejor opción en términos de rendimiento y facilidad de escalado.</li>
</ul>
<h2 id="Lessons-Learned-and-Best-Practices" class="common-anchor-header">Lecciones aprendidas y mejores prácticas<button data-href="#Lessons-Learned-and-Best-Practices" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>Para aplicaciones en las que las operaciones de lectura son el objetivo principal, una implementación de separación de lectura-escritura puede aumentar significativamente la potencia de procesamiento y mejorar el rendimiento.</li>
<li>El cliente Java de Milvus carece de un mecanismo de reconexión porque el cliente Milvus utilizado por el servicio de recuperación es residente en memoria. Tenemos que construir nuestro propio pool de conexiones para garantizar la disponibilidad de la conexión entre el cliente Java y el servidor mediante la prueba heartbeat.</li>
<li>Ocasionalmente se producen consultas lentas en Milvus. Esto se debe a un calentamiento insuficiente de la nueva colección. Al simular la consulta en la nueva colección, el archivo de índice se carga en la memoria para lograr el calentamiento del índice.</li>
<li>nlist es el parámetro de construcción del índice y nprobe es el parámetro de consulta. Es necesario obtener un valor umbral razonable de acuerdo con el escenario de su negocio mediante experimentos de pruebas de presión para equilibrar el rendimiento y la precisión de la recuperación.</li>
<li>Para un escenario de datos estáticos, es más eficiente importar todos los datos a la colección primero y construir los índices después.</li>
</ol>
