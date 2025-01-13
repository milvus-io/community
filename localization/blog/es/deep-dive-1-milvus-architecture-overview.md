---
id: deep-dive-1-milvus-architecture-overview.md
title: >-
  Creación de una base de datos vectorial para la búsqueda escalable de
  similitudes
author: Xiaofan Luan
date: 2022-03-14T00:00:00.000Z
desc: >-
  El primero de una serie de blogs que analizan el proceso de reflexión y los
  principios de diseño que subyacen a la creación de la base de datos vectorial
  de código abierto más popular.
cover: assets.zilliz.com/20220705_102717_dd4124dee3.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220705_102717_dd4124dee3.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Imagen de portada</span> </span></p>
<blockquote>
<p>Este artículo ha sido escrito por Xiaofan Luan y transcrito por Angela Ni y Claire Yu.</p>
</blockquote>
<p>Según <a href="https://mitsloan.mit.edu/ideas-made-to-matter/tapping-power-unstructured-data">las estadísticas</a>, entre el 80% y el 90% de los datos del mundo son no estructurados. Impulsada por el rápido crecimiento de Internet, se espera una explosión de datos no estructurados en los próximos años. En consecuencia, las empresas necesitan urgentemente una base de datos potente que les ayude a manejar y comprender mejor este tipo de datos. Sin embargo, desarrollar una base de datos siempre es más fácil de decir que de hacer. Este artículo tiene como objetivo compartir el proceso de pensamiento y los principios de diseño de la construcción de Milvus, una base de datos vectorial de código abierto, nativa de la nube para la búsqueda de similitud escalable. Este artículo también explica en detalle la arquitectura de Milvus.</p>
<p>Ir a:</p>
<ul>
<li><a href="#Unstructured-data-requires-a-complete-basic-software-stack">Los datos no estructurados requieren una pila de software básica completa</a><ul>
<li><a href="#Vectors-and-scalars">Vectores y escalares</a></li>
<li><a href="#From-vector-search-engine-to-vector-database">Del motor de búsqueda vectorial a la base de datos vectorial</a></li>
<li><a href="#A-cloud-native-first-approach">Un primer enfoque nativo en la nube</a></li>
</ul></li>
<li><a href="#The-design-principles-of-Milvus-20">Los principios de diseño de Milvus 2.0</a><ul>
<li><a href="#Log-as-data">El registro como dato</a></li>
<li><a href="#Duality-of-table-and-log">Dualidad de tabla y registro</a></li>
<li><a href="#Log-persistency">Persistencia del registro</a></li>
</ul></li>
<li><a href="#Building-a-vector-database-for-scalable-similarity-search">Creación de una base de datos vectorial para la búsqueda escalable de similitudes</a><ul>
<li><a href="#Standalone-and-cluster">Independiente y en clúster</a></li>
<li><a href="#A-bare-bones-skeleton-of-the-Milvus-architecture">Esqueleto básico de la arquitectura Milvus</a></li>
<li><a href="#Data-Model">Modelo de datos</a></li>
</ul></li>
</ul>
<h2 id="Unstructured-data-requires-a-complete-basic-software-stack" class="common-anchor-header">Los datos no estructurados requieren una pila de software básica completa<button data-href="#Unstructured-data-requires-a-complete-basic-software-stack" class="anchor-icon" translate="no">
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
    </button></h2><p>A medida que Internet crecía y evolucionaba, los datos no estructurados se hicieron cada vez más comunes, incluyendo correos electrónicos, documentos, datos de sensores IoT, fotos de Facebook, estructuras de proteínas y mucho más. Para que los ordenadores puedan comprender y procesar los datos no estructurados, estos se convierten en vectores mediante <a href="https://zilliz.com/learn/embedding-generation">técnicas de incrustación</a>.</p>
<p>Milvus almacena e indexa estos vectores y analiza la correlación entre dos vectores calculando su distancia de similitud. Si los dos vectores incrustados son muy similares, significa que las fuentes de datos originales también lo son.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_6_5e0ab80f2c.png" alt="The workflow of processing unstructured data." class="doc-image" id="the-workflow-of-processing-unstructured-data." />
   </span> <span class="img-wrapper"> <span>El flujo de trabajo del tratamiento de datos no estructurados</span>. </span></p>
<h3 id="Vectors-and-scalars" class="common-anchor-header">Vectores y escalares</h3><p>Un escalar es una cantidad que sólo se describe en una medida: la magnitud. Un escalar puede representarse como un número. Por ejemplo, un coche circula a una velocidad de 80 km/h. En este caso, la velocidad (80 km/h) es un escalar. Por su parte, un vector es una cantidad que se describe en al menos dos medidas: magnitud y dirección. Si un coche viaja hacia el oeste a una velocidad de 80 km/h, la velocidad (80 km/h oeste) es un vector. La imagen siguiente es un ejemplo de escalares y vectores comunes.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_7_90a142ab5b.png" alt="Scalars vs. Vectors" class="doc-image" id="scalars-vs.-vectors" />
   </span> <span class="img-wrapper"> <span>Escalares vs. Vectores</span> </span></p>
<p>Dado que la mayoría de los datos importantes tienen más de un atributo, podemos entender mejor estos datos si los convertimos en vectores. Una forma habitual de manipular datos vectoriales es calcular la distancia entre vectores utilizando <a href="https://milvus.io/docs/v2.0.x/metric.md">métricas</a> como la distancia euclídea, el producto interior, la distancia de Tanimoto, la distancia de Hamming, etc. Cuanto más cercana es la distancia, más parecidos son los vectores. Para consultar un conjunto de datos vectoriales masivos de forma eficiente, podemos organizar los datos vectoriales creando índices sobre ellos. Una vez indexado el conjunto de datos, las consultas pueden dirigirse a los clusters o subconjuntos de datos que tienen más probabilidades de contener vectores similares a una consulta de entrada.</p>
<p>Para obtener más información sobre los índices, consulte <a href="https://milvus.io/docs/v2.0.x/index.md">Índice vectorial</a>.</p>
<h3 id="From-vector-search-engine-to-vector-database" class="common-anchor-header">Del motor de búsqueda de vectores a la base de datos de vectores</h3><p>Desde el principio, Milvus 2.0 está diseñado para servir no sólo como motor de búsqueda, sino, lo que es más importante, como una potente base de datos vectorial.</p>
<p>Una forma de ayudarle a entender la diferencia es establecer una analogía entre <a href="https://dev.mysql.com/doc/refman/5.7/en/innodb-introduction.html">InnoDB</a> y <a href="https://www.mysql.com/">MySQL</a>, o <a href="https://lucene.apache.org/">Lucene</a> y <a href="https://www.elastic.co/">Elasticsearch</a>.</p>
<p>Al igual que MySQL y Elasticsearch, Milvus también está construido sobre bibliotecas de código abierto como <a href="https://github.com/facebookresearch/faiss">Faiss</a>, <a href="https://github.com/nmslib/hnswlib">HNSW</a>, <a href="https://github.com/spotify/annoy">Annoy</a>, que se centran en proporcionar funcionalidades de búsqueda y garantizar el rendimiento de la búsqueda. Sin embargo, sería injusto degradar Milvus a una mera capa por encima de Faiss, ya que almacena, recupera y analiza vectores y, al igual que cualquier otra base de datos, también proporciona una interfaz estándar para operaciones CRUD. Además, Milvus también cuenta con características como:</p>
<ul>
<li>Separación y partición</li>
<li>Replicación</li>
<li>Recuperación en caso de catástrofe</li>
<li>Equilibrio de carga</li>
<li>Analizador u optimizador de consultas</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/database_d912320ea7.png" alt="Vector database" class="doc-image" id="vector-database" />
   </span> <span class="img-wrapper"> <span>Base de datos vectorial</span> </span></p>
<p>Para una comprensión más completa de lo que es una base de datos vectorial, lea el blog <a href="https://zilliz.com/learn/what-is-vector-database">aquí</a>.</p>
<h3 id="A-cloud-native-first-approach" class="common-anchor-header">Un primer enfoque nativo en la nube</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_2_be82d762db.png" alt="Could-native approach" class="doc-image" id="could-native-approach" />
   </span> <span class="img-wrapper"> <span>Enfoque nativo de la nube</span> </span></p>
<h4 id="From-shared-nothing-to-shared-storage-then-to-shared-something" class="common-anchor-header">De la nada compartida al almacenamiento compartido, y de ahí a algo compartido</h4><p>Las bases de datos tradicionales solían adoptar una arquitectura de "nada compartido" en la que los nodos de los sistemas distribuidos son independientes pero están conectados por una red. Los nodos no comparten memoria ni almacenamiento. Sin embargo, <a href="https://docs.snowflake.com/en/user-guide/intro-key-concepts.html">Snowflake</a> revolucionó el sector al introducir una arquitectura de "almacenamiento compartido" en la que el cálculo (procesamiento de consultas) se separa del almacenamiento (almacenamiento de bases de datos). Con una arquitectura de almacenamiento compartido, las bases de datos pueden lograr una mayor disponibilidad, escalabilidad y una reducción de la duplicación de datos. Inspiradas por Snowflake, muchas empresas empezaron a aprovechar la infraestructura basada en la nube para la persistencia de los datos, al tiempo que utilizaban el almacenamiento local para el almacenamiento en caché. Este tipo de arquitectura de base de datos se denomina "algo compartido" y se ha convertido en la arquitectura dominante en la mayoría de las aplicaciones actuales.</p>
<p>Aparte de la arquitectura de "algo compartido", Milvus admite el escalado flexible de cada componente utilizando Kubernetes para gestionar su motor de ejecución y separando los servicios de lectura, escritura y otros con microservicios.</p>
<h4 id="Database-as-a-service-DBaaS" class="common-anchor-header">Base de datos como servicio (DBaaS)</h4><p>La base de datos como servicio es una tendencia candente, ya que muchos usuarios no solo se preocupan por las funcionalidades habituales de la base de datos, sino que también anhelan servicios más variados. Esto significa que, aparte de las operaciones CRUD tradicionales, nuestra base de datos tiene que enriquecer el tipo de servicios que puede proporcionar, como gestión de bases de datos, transporte de datos, carga, visualización, etc.</p>
<h4 id="Synergy-with-the-broader-open-source-ecosystem" class="common-anchor-header">Sinergia con el ecosistema de código abierto más amplio</h4><p>Otra tendencia en el desarrollo de bases de datos es aprovechar la sinergia entre la base de datos y otras infraestructuras nativas de la nube. En el caso de Milvus, se apoya en algunos sistemas de código abierto. Por ejemplo, Milvus utiliza <a href="https://etcd.io/">etcd</a> para almacenar metadatos. También adopta la cola de mensajes, un tipo de comunicación asíncrona de servicio a servicio utilizada en la arquitectura de microservicios, que puede ayudar a exportar datos incrementales.</p>
<p>En el futuro, esperamos construir Milvus sobre infraestructuras de IA como <a href="https://spark.apache.org/">Spark</a> o <a href="https://www.tensorflow.org/">Tensorflow</a>, e integrar Milvus con motores de streaming para que podamos soportar mejor el procesamiento unificado de streaming y por lotes para satisfacer las diversas necesidades de los usuarios de Milvus.</p>
<h2 id="The-design-principles-of-Milvus-20" class="common-anchor-header">Los principios de diseño de Milvus 2.0<button data-href="#The-design-principles-of-Milvus-20" class="anchor-icon" translate="no">
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
    </button></h2><p>Como nuestra base de datos vectorial nativa de la nube de próxima generación, Milvus 2.0 se construye en torno a los siguientes tres principios.</p>
<h3 id="Log-as-data" class="common-anchor-header">Registro como datos</h3><p>Un registro en una base de datos registra en serie todos los cambios realizados en los datos. Como se muestra en la siguiente figura, de izquierda a derecha están los &quot;datos antiguos&quot; y los &quot;datos nuevos&quot;. Y los registros están en orden temporal. Milvus tiene un mecanismo de temporizador global que asigna una marca de tiempo global única y auto-incremental.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_8_6e40211f44.png" alt="Logs" class="doc-image" id="logs" />
   </span> <span class="img-wrapper"> <span>Registros</span> </span></p>
<p>En Milvus 2.0, el corredor de registros sirve de columna vertebral del sistema: todas las operaciones de inserción y actualización de datos deben pasar por el corredor de registros, y los nodos trabajadores ejecutan las operaciones CRUD suscribiéndose a los registros y consumiéndolos.</p>
<h3 id="Duality-of-table-and-log" class="common-anchor-header">Dualidad de tabla y registro</h3><p>Tanto la tabla como el registro son datos, y no son más que dos formas diferentes. Las tablas son datos delimitados, mientras que los registros son ilimitados. Los registros pueden convertirse en tablas. En el caso de Milvus, agrega registros utilizando una ventana de procesamiento de TimeTick. Basándose en la secuencia del registro, se agregan múltiples registros en un pequeño archivo llamado instantánea del registro. A continuación, estas instantáneas de registro se combinan para formar un segmento, que puede utilizarse individualmente para el equilibrio de carga.</p>
<h3 id="Log-persistency" class="common-anchor-header">Persistencia de los registros</h3><p>La persistencia de los registros es uno de los problemas más complicados a los que se enfrentan muchas bases de datos. El almacenamiento de registros en un sistema distribuido suele depender de algoritmos de replicación.</p>
<p>A diferencia de bases de datos como <a href="https://aws.amazon.com/rds/aurora/">Aurora</a>, <a href="https://hbase.apache.org/">HBase</a>, <a href="https://www.cockroachlabs.com/">Cockroach DB</a> y <a href="https://en.pingcap.com/">TiDB</a>, Milvus adopta un enfoque innovador e introduce un sistema de publicación y suscripción (pub/sub) para el almacenamiento y la persistencia de registros. Un sistema pub/sub es análogo a la cola de mensajes de <a href="https://kafka.apache.org/">Kafka</a> o <a href="https://pulsar.apache.org/">Pulsar</a>. Todos los nodos del sistema pueden consumir los registros. En Milvus, este tipo de sistema se denomina log broker. Gracias al corredor de registros, los registros se desacoplan del servidor, lo que garantiza que Milvus sea en sí mismo apátrida y esté mejor posicionado para recuperarse rápidamente de un fallo del sistema.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/log_broker_cafe889835.png" alt="Log broker" class="doc-image" id="log-broker" />
   </span> <span class="img-wrapper"> <span>Agente de registros</span> </span></p>
<h2 id="Building-a-vector-database-for-scalable-similarity-search" class="common-anchor-header">Creación de una base de datos vectorial para la búsqueda escalable de similitudes<button data-href="#Building-a-vector-database-for-scalable-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Construido sobre bibliotecas populares de búsqueda vectorial, incluyendo Faiss, ANNOY, HNSW, y más, Milvus fue diseñado para la búsqueda de similitud en conjuntos de datos vectoriales densos que contienen millones, miles de millones, o incluso billones de vectores.</p>
<h3 id="Standalone-and-cluster" class="common-anchor-header">Independiente y en clúster</h3><p>Milvus ofrece dos formas de despliegue: independiente o en clúster. En Milvus standalone, puesto que todos los nodos se despliegan juntos, podemos ver Milvus como un único proceso. Actualmente, Milvus standalone depende de MinIO y etcd para la persistencia de datos y el almacenamiento de metadatos. En futuras versiones, esperamos eliminar estas dos dependencias de terceros para garantizar la simplicidad del sistema Milvus. Milvus cluster incluye ocho componentes de microservicio y tres dependencias de terceros: MinIO, etcd y Pulsar. Pulsar actúa como intermediario de registros y proporciona servicios pub/sub de registros.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/standalone_and_cluster_7558f56e8c.png" alt="Standalone and cluster" class="doc-image" id="standalone-and-cluster" />
   </span> <span class="img-wrapper"> <span>Independiente y clúster</span> </span></p>
<h3 id="A-bare-bones-skeleton-of-the-Milvus-architecture" class="common-anchor-header">Esqueleto básico de la arquitectura Milvus</h3><p>Milvus separa el flujo de datos del flujo de control y se divide en cuatro capas que son independientes en términos de escalabilidad y recuperación de desastres.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_b7743a4a7f.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Arquitectura Milvus</span> </span></p>
<h4 id="Access-layer" class="common-anchor-header">Capa de acceso</h4><p>La capa de acceso actúa como la cara del sistema, exponiendo el punto final de la conexión del cliente al mundo exterior. Se encarga de procesar las conexiones de los clientes, realizar la verificación estática, las comprobaciones dinámicas básicas de las solicitudes de los usuarios, reenviar las solicitudes y recopilar y devolver los resultados al cliente. El proxy en sí no tiene estado y proporciona direcciones de acceso unificadas y servicios al mundo exterior a través de componentes de equilibrio de carga (Nginx, Kubernetess Ingress, NodePort y LVS). Milvus utiliza una arquitectura de procesamiento paralelo masivo (MPP), en la que los proxies devuelven los resultados recogidos de los nodos trabajadores tras la agregación global y el post-procesamiento.</p>
<h4 id="Coordinator-service" class="common-anchor-header">Servicio de coordinación</h4><p>El servicio coordinador es el cerebro del sistema, responsable de la gestión de los nodos de la topología del clúster, el equilibrio de carga, la generación de marcas de tiempo, la declaración de datos y la gestión de datos. Para una explicación detallada de la función de cada servicio coordinador, lea la <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Coordinator-service">documentación técnica de Milvus</a>.</p>
<h4 id="Worker-nodes" class="common-anchor-header">Nodos trabajadores</h4><p>El nodo trabajador, o de ejecución, actúa como las extremidades del sistema, ejecutando las instrucciones emitidas por el servicio coordinador y los comandos del lenguaje de manipulación de datos (DML) iniciados por el proxy. Un nodo trabajador en Milvus es similar a un nodo de datos en <a href="https://hadoop.apache.org/">Hadoop</a>, o a un servidor de región en HBase. Cada tipo de nodo trabajador corresponde a un servicio de coordenadas. Para una explicación detallada de la función de cada nodo trabajador, lea la <a href="https://milvus.io/docs/v2.0.x/four_layers.md#Worker-nodes">documentación técnica de Milvus</a>.</p>
<h4 id="Storage" class="common-anchor-header">Almacenamiento</h4><p>El almacenamiento es la piedra angular de Milvus, responsable de la persistencia de los datos. La capa de almacenamiento se divide en tres partes:</p>
<ul>
<li><strong>Metaalmacén:</strong> Responsable de almacenar instantáneas de metadatos como el esquema de recolección, el estado de los nodos, los puntos de control de consumo de mensajes, etc. Milvus depende de etcd para estas funciones y Etcd también asume la responsabilidad del registro de servicios y las comprobaciones de estado.</li>
<li><strong>Log broker:</strong> Un sistema pub/sub que soporta la reproducción y es responsable de la persistencia de datos en streaming, la ejecución de consultas asíncronas fiables, las notificaciones de eventos y la devolución de los resultados de las consultas. Cuando los nodos están realizando la recuperación del tiempo de inactividad, el log broker garantiza la integridad de los datos incrementales a través de la reproducción del log broker. El clúster Milvus utiliza Pulsar como corredor de registros, mientras que el modo autónomo utiliza RocksDB. Los servicios de almacenamiento en streaming como Kafka y Pravega también pueden utilizarse como corredores de registros.</li>
<li><strong>Almacenamiento de objetos:</strong> Almacena archivos de instantáneas de registros, archivos de índices escalares/vectoriales y resultados intermedios del procesamiento de consultas. Milvus es compatible con <a href="https://aws.amazon.com/s3/">AWS S3</a> y <a href="https://azure.microsoft.com/en-us/services/storage/blobs/">Azure Blob</a>, así como con <a href="https://min.io/">MinIO</a>, un servicio de almacenamiento de objetos ligero y de código abierto. Debido a la alta latencia de acceso y facturación por consulta de los servicios de almacenamiento de objetos, Milvus pronto soportará grupos de caché basados en memoria/SSD y separación de datos en caliente/frío para mejorar el rendimiento y reducir costes.</li>
</ul>
<h3 id="Data-Model" class="common-anchor-header">Modelo de datos</h3><p>El modelo de datos organiza los datos en una base de datos. En Milvus, todos los datos se organizan por colección, fragmento, partición, segmento y entidad.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_model_1_5d6bb43673.png" alt="Data model 1" class="doc-image" id="data-model-1" />
   </span> <span class="img-wrapper"> <span>Modelo de datos 1</span> </span></p>
<h4 id="Collection" class="common-anchor-header">Colección</h4><p>Una colección en Milvus puede compararse a una tabla en un sistema de almacenamiento relacional. La colección es la unidad de datos más grande de Milvus.</p>
<h4 id="Shard" class="common-anchor-header">Fragmento</h4><p>Para aprovechar al máximo la potencia de cálculo paralelo de los clusters al escribir datos, las colecciones en Milvus deben distribuir las operaciones de escritura de datos a diferentes nodos. Por defecto, una sola colección contiene dos fragmentos. Dependiendo del volumen de su conjunto de datos, puede tener más fragmentos en una colección. Milvus utiliza un método hash de clave maestra para la fragmentación.</p>
<h4 id="Partition" class="common-anchor-header">Partición</h4><p>También hay múltiples particiones en un fragmento. Una partición en Milvus se refiere a un conjunto de datos marcados con la misma etiqueta en una colección. Los métodos comunes de partición incluyen la partición por fecha, género, edad del usuario y más. La creación de particiones puede beneficiar el proceso de consulta, ya que los datos tremendos se pueden filtrar por etiqueta de partición.</p>
<p>En comparación, la fragmentación tiene más que ver con las capacidades de escalado cuando se escriben datos, mientras que el particionamiento tiene más que ver con la mejora del rendimiento del sistema cuando se leen datos.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Data_model_2_044a443751.png" alt="Data model 2" class="doc-image" id="data-model-2" />
   </span> <span class="img-wrapper"> <span>Modelo de datos 2</span> </span></p>
<h4 id="Segments" class="common-anchor-header">Segmentos</h4><p>Dentro de cada partición, hay múltiples segmentos pequeños. Un segmento es la unidad más pequeña para la programación del sistema en Milvus. Hay dos tipos de segmentos: crecientes y cerrados. Los segmentos crecientes son suscritos por nodos de consulta. El usuario de Milvus sigue escribiendo datos en segmentos crecientes. Cuando el tamaño de un segmento creciente alcanza un límite superior (512 MB por defecto), el sistema no permite escribir datos adicionales en este segmento creciente, por lo que se sella este segmento. Los índices se construyen sobre segmentos sellados.</p>
<p>Para acceder a los datos en tiempo real, el sistema lee los datos tanto en los segmentos crecientes como en los segmentos sellados.</p>
<h4 id="Entity" class="common-anchor-header">Entidad</h4><p>Cada segmento contiene una gran cantidad de entidades. Una entidad en Milvus equivale a una fila en una base de datos tradicional. Cada entidad tiene un campo de clave primaria único, que también puede generarse automáticamente. Las entidades también deben contener un sello de tiempo (ts), y un campo vectorial - el núcleo de Milvus.</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">Acerca de la serie Deep Dive<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Con el <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">anuncio oficial de la disponibilidad general</a> de Milvus 2.0, hemos orquestado esta serie de blogs Milvus Deep Dive para ofrecer una interpretación en profundidad de la arquitectura y el código fuente de Milvus. Los temas tratados en esta serie de blogs incluyen</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Visión general de la arquitectura de Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API y SDK de Python</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Procesamiento de datos</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Gestión de datos</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Consulta en tiempo real</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Motor de ejecución escalar</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">Sistema de control de calidad</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Motor de ejecución vectorial</a></li>
</ul>
