---
id: 2021-11-08-frustrated-with-new-data-our-vector-database-can-help.md
title: Introducción
author: Zilliz
date: 2021-11-08T00:00:00.000Z
desc: >-
  Diseño y práctica de sistemas de bases de datos vectoriales de propósito
  general orientados a la IA
cover: assets.zilliz.com/Frustrated_with_new_data_5051d3ad15.png
tag: Engineering
---
<custom-h1>¿Frustrado con los nuevos datos? Nuestra base de datos vectorial puede ayudarle</custom-h1><p>En la era del Big Data, ¿qué tecnologías y aplicaciones de bases de datos cobrarán protagonismo? ¿Cuál será la próxima revolución?</p>
<p>Dado que los datos no estructurados representan aproximadamente el 80-90% de todos los datos almacenados, ¿qué se supone que debemos hacer con estos crecientes lagos de datos? Se podría pensar en utilizar métodos analíticos tradicionales, pero éstos no consiguen extraer información útil, si es que la obtienen. Para responder a esta pregunta, los "Tres Mosqueteros" del equipo de Investigación y Desarrollo de Zilliz, el Dr. Rentong Guo, el Sr. Xiaofan Luan y el Dr. Xiaomeng Yi, han escrito conjuntamente un artículo en el que analizan el diseño y los retos a los que se enfrenta la creación de un sistema de base de datos vectorial de uso general.</p>
<p>Este artículo se ha incluido en Programmer, una revista producida por CSDN, la mayor comunidad de desarrolladores de software de China. Este número de Programmer también incluye artículos de Jeffrey Ullman, galardonado con el Premio Turing 2020, Yann LeCun, galardonado con el Premio Turing 2018, Mark Porter, CTO de MongoDB, Zhenkun Yang, fundador de OceanBase, Dongxu Huang, fundador de PingCAP, etc.</p>
<p>A continuación compartimos con vosotros el artículo completo:</p>
<custom-h1>Diseño y práctica de sistemas de bases de datos vectoriales de propósito general orientados a la IA</custom-h1><h2 id="Introduction" class="common-anchor-header">Introducción<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Las aplicaciones de datos modernas pueden tratar con facilidad datos estructurados, que representan aproximadamente el 20% de los datos actuales. En su caja de herramientas se encuentran sistemas como las bases de datos relacionales, las bases de datos NoSQL, etc.; en cambio, los datos no estructurados, que representan aproximadamente el 80% de todos los datos, no cuentan con ningún sistema fiable. Para resolver este problema, este artículo tratará los puntos débiles que la analítica de datos tradicional tiene con los datos no estructurados y, además, analizará la arquitectura y los retos a los que nos enfrentamos al crear nuestro propio sistema de base de datos vectorial de propósito general.</p>
<h2 id="Data-Revolution-in-the-AI-era" class="common-anchor-header">La revolución de los datos en la era de la IA<button data-href="#Data-Revolution-in-the-AI-era" class="anchor-icon" translate="no">
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
    </button></h2><p>Con el rápido desarrollo de las tecnologías 5G e IoT, las industrias buscan multiplicar sus canales de recopilación de datos y proyectar aún más el mundo real en el espacio digital. Aunque ha traído consigo algunos desafíos tremendos, también ha traído consigo enormes beneficios para la creciente industria. Uno de estos duros retos es cómo obtener una visión más profunda de estos nuevos datos entrantes.</p>
<p>Según las estadísticas de IDC, sólo en 2020 se generarán más de 40.000 exabytes de nuevos datos en todo el mundo. Del total, sólo el 20% son datos estructurados, es decir, datos muy ordenados y fáciles de organizar y analizar mediante cálculos numéricos y álgebra relacional. Por el contrario, los datos no estructurados (que representan el 80% restante) son extremadamente ricos en variaciones de tipos de datos, lo que dificulta descubrir la semántica profunda a través de los métodos tradicionales de análisis de datos.</p>
<p>Afortunadamente, estamos experimentando una rápida evolución simultánea de los datos no estructurados y la IA, que nos permite comprender mejor los datos a través de diversos tipos de redes neuronales, como se muestra en la Figura 1.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata1_d5c34497d0.jpeg" alt="newdata1.jpeg" class="doc-image" id="newdata1.jpeg" />
   </span> <span class="img-wrapper"> <span>newdata1.jpeg</span> </span></p>
<p>La tecnología de incrustación ha ganado popularidad rápidamente tras el debut de Word2vec, y la idea de "incrustarlo todo" ha llegado a todos los sectores del aprendizaje automático. Esto conduce a la aparición de dos grandes capas de datos: la capa de datos brutos y la capa de datos vectoriales. La capa de datos brutos se compone de datos no estructurados y ciertos tipos de datos estructurados; la capa vectorial es la colección de incrustaciones fácilmente analizables que se origina a partir de la capa de datos brutos pasando por modelos de aprendizaje automático.</p>
<p>En comparación con los datos brutos, los datos vectorizados presentan las siguientes ventajas:</p>
<ul>
<li>Los vectores de incrustación son un tipo abstracto de datos, lo que significa que podemos construir un sistema de álgebra unificada dedicado a reducir la complejidad de los datos no estructurados.</li>
<li>Los vectores incrustados se expresan mediante vectores densos de coma flotante, lo que permite a las aplicaciones aprovechar las ventajas de SIMD. Dado que las GPU y casi todas las CPU modernas admiten SIMD, los cálculos a través de vectores pueden alcanzar un alto rendimiento a un coste relativamente bajo.</li>
<li>Los datos vectoriales codificados mediante modelos de aprendizaje automático ocupan menos espacio de almacenamiento que los datos no estructurados originales, lo que permite un mayor rendimiento.</li>
<li>La aritmética también puede realizarse a través de vectores incrustados. La figura 2 muestra un ejemplo de correspondencia semántica aproximada entre modalidades: las imágenes de la figura son el resultado de la correspondencia entre incrustaciones de palabras e incrustaciones de imágenes.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata2_14e0554305.png" alt="newdata2.png" class="doc-image" id="newdata2.png" />
   </span> <span class="img-wrapper"> <span>datosnuevos2.png</span> </span></p>
<p>Como se muestra en la figura 3, la combinación de la semántica de imágenes y palabras puede realizarse con una simple suma y resta de vectores a través de sus correspondientes incrustaciones.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata3_3c71fc56b9.png" alt="newdata3.png" class="doc-image" id="newdata3.png" />
   </span> <span class="img-wrapper"> <span>newdata3.png</span> </span></p>
<p>Aparte de las funciones anteriores, estos operadores permiten realizar consultas más complejas en situaciones prácticas. La recomendación de contenidos es un ejemplo bien conocido. Por lo general, el sistema incrusta tanto el contenido como las preferencias de visualización de los usuarios. A continuación, el sistema compara las preferencias del usuario con los contenidos más similares mediante un análisis de similitud semántica, lo que da como resultado nuevos contenidos similares a las preferencias del usuario. Esta capa de datos vectoriales no se limita a los sistemas de recomendación, los casos de uso incluyen el comercio electrónico, el análisis de malware, el análisis de datos, la verificación biométrica, el análisis de fórmulas químicas, las finanzas, los seguros, etc.</p>
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
    </button></h2><p>El software de sistema está en la base de todas las aplicaciones orientadas a datos, pero el software de sistema de datos construido en las últimas décadas, como bases de datos, motores de análisis de datos, etc., está pensado para tratar datos estructurados. Las aplicaciones de datos modernas se basan casi exclusivamente en datos no estructurados y no se benefician de los sistemas tradicionales de gestión de bases de datos.</p>
<p>Para abordar este problema, hemos desarrollado y puesto en marcha un sistema de base de datos vectorial de propósito general orientado a la IA llamado <em>Milvus</em> (Referencia nº 1~2). En comparación con los sistemas de bases de datos tradicionales, Milvus trabaja sobre una capa de datos diferente. Las bases de datos tradicionales, como las bases de datos relacionales, las bases de datos KV, las bases de datos de texto, las bases de datos de imágenes/vídeos, etc... trabajan sobre la capa de datos brutos, mientras que Milvus trabaja sobre la capa de datos vectoriales.</p>
<p>En los capítulos siguientes, analizaremos las características novedosas, el diseño arquitectónico y los retos técnicos a los que nos enfrentamos al construir Milvus.</p>
<h2 id="Major-attributes-of-vector-database" class="common-anchor-header">Principales atributos de las bases de datos vectoriales<button data-href="#Major-attributes-of-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Las bases de datos vectoriales almacenan, recuperan y analizan vectores y, al igual que cualquier otra base de datos, también proporcionan una interfaz estándar para operaciones CRUD. Además de estas características "estándar", los atributos enumerados a continuación también son cualidades importantes para una base de datos vectorial:</p>
<ul>
<li><strong>Soporte para operadores vectoriales de alta eficiencia</strong></li>
</ul>
<p>El soporte de operadores vectoriales en un motor de análisis se centra en dos niveles. En primer lugar, la base de datos vectorial debe admitir distintos tipos de operadores, por ejemplo, la coincidencia de similitud semántica y la aritmética semántica mencionadas anteriormente. Además, debe admitir diversas métricas de similitud para los cálculos de similitud subyacentes. Dicha similitud suele cuantificarse como distancia espacial entre vectores, siendo métricas comunes la distancia euclidiana, la distancia coseno y la distancia producto interior.</p>
<ul>
<li><strong>Apoyo a la indexación vectorial</strong></li>
</ul>
<p>En comparación con los índices basados en árboles B o LSM de las bases de datos tradicionales, los índices vectoriales de alta dimensión suelen consumir muchos más recursos informáticos. Recomendamos utilizar algoritmos de clustering e índices de grafos, y dar prioridad a las operaciones matriciales y vectoriales, aprovechando así al máximo las capacidades de aceleración del cálculo vectorial por hardware mencionadas anteriormente.</p>
<ul>
<li><strong>Experiencia de usuario coherente en distintos entornos de despliegue</strong></li>
</ul>
<p>Las bases de datos vectoriales suelen desarrollarse y desplegarse en distintos entornos. En la fase preliminar, los científicos de datos y los ingenieros de algoritmos trabajan principalmente en sus portátiles y estaciones de trabajo, ya que prestan más atención a la eficiencia de la verificación y a la velocidad de iteración. Una vez finalizada la verificación, pueden desplegar la base de datos a tamaño completo en un clúster privado o en la nube. Por lo tanto, un sistema de base de datos vectorial cualificado debe ofrecer un rendimiento y una experiencia de usuario coherentes en diferentes entornos de despliegue.</p>
<ul>
<li><strong>Compatibilidad con la búsqueda híbrida</strong></li>
</ul>
<p>A medida que las bases de datos vectoriales se vuelven omnipresentes, surgen nuevas aplicaciones. Entre todas estas demandas, la que se menciona con más frecuencia es la búsqueda híbrida en vectores y otros tipos de datos. Algunos ejemplos son la búsqueda aproximada del vecino más próximo (ANNS) tras el filtrado escalar, la recuperación multicanal a partir de la búsqueda de texto completo y la búsqueda vectorial, y la búsqueda híbrida de datos espaciotemporales y datos vectoriales. Estos retos exigen una escalabilidad elástica y una optimización de las consultas para fusionar eficazmente los motores de búsqueda vectorial con los motores de búsqueda KV, de texto y de otro tipo.</p>
<ul>
<li><strong>Arquitectura nativa en la nube</strong></li>
</ul>
<p>El volumen de datos vectoriales crece como setas con el crecimiento exponencial de la recopilación de datos. Los datos vectoriales a escala de billones y de alta dimensión corresponden a miles de TB de almacenamiento, lo que supera con creces el límite de un único nodo. En consecuencia, la capacidad de ampliación horizontal es una característica clave de las bases de datos vectoriales y debe satisfacer las demandas de elasticidad y agilidad de despliegue de los usuarios. Además, también debe reducir la complejidad de funcionamiento y mantenimiento del sistema, al tiempo que mejora la observabilidad con la ayuda de la infraestructura en la nube. Algunas de estas necesidades se presentan en forma de aislamiento multiusuario, instantáneas y copias de seguridad de datos, cifrado de datos y visualización de datos, que son habituales en las bases de datos tradicionales.</p>
<h2 id="Vector-database-system-architecture" class="common-anchor-header">Arquitectura del sistema de base de datos vectorial<button data-href="#Vector-database-system-architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.0 sigue los principios de diseño de &quot;registro como datos&quot;, &quot;procesamiento unificado de lotes y flujos&quot;, &quot;sin estado&quot; y &quot;microservicios&quot;. La figura 4 muestra la arquitectura general de Milvus 2.0.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata4_b7f3ab6969.png" alt="newdata4.png" class="doc-image" id="newdata4.png" />
   </span> <span class="img-wrapper"> <span>newdata4.png</span> </span></p>
<p><strong>Registro como datos</strong>: Milvus 2.0 no mantiene ninguna tabla física. En su lugar, garantiza la fiabilidad de los datos mediante la persistencia y las instantáneas de los registros. El corredor de registros (la columna vertebral del sistema) almacena los registros y desacopla los componentes y servicios mediante el mecanismo de publicación-suscripción de registros (pub-sub). Como se muestra en la Figura 5, el corredor de registros se compone de una &quot;secuencia de registros&quot; y un &quot;suscriptor de registros&quot;. La secuencia de logs registra todas las operaciones que cambian el estado de una colección (equivalente a una tabla en una base de datos relacional ); el suscriptor de logs se suscribe a la secuencia de logs para actualizar sus datos locales y proporcionar servicios en forma de copias de sólo lectura. El mecanismo pub-sub también da cabida a la extensibilidad del sistema en términos de captura de datos de cambios (CDC) y despliegue distribuido globalmente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata5_853dd38bc3.png" alt="newdata5.png" class="doc-image" id="newdata5.png" />
   </span> <span class="img-wrapper"> <span>newdata5.png</span> </span></p>
<p><strong>Procesamiento unificado de lotes y flujos</strong>: El flujo de registros permite a Milvus actualizar los datos en tiempo real, garantizando así la entregabilidad en tiempo real. Además, al transformar los lotes de datos en instantáneas de registros y crear índices a partir de las instantáneas, Milvus puede lograr una mayor eficacia en las consultas. Durante una consulta, Milvus fusiona los resultados de la consulta tanto de los datos incrementales como de los históricos para garantizar la integridad de los datos devueltos. Este diseño equilibra mejor el rendimiento y la eficiencia en tiempo real, aliviando la carga de mantenimiento de los sistemas en línea y fuera de línea en comparación con la arquitectura Lambda tradicional.</p>
<p><strong>Sin estado</strong>: La infraestructura en la nube y los componentes de almacenamiento de código abierto liberan a Milvus de la persistencia de datos dentro de sus propios componentes. Milvus 2.0 persiste los datos con tres tipos de almacenamiento: almacenamiento de metadatos, almacenamiento de registros y almacenamiento de objetos. El almacenamiento de metadatos no sólo almacena los metadatos, sino que también gestiona el descubrimiento de servicios y la gestión de nodos. El almacenamiento de registros ejecuta la persistencia incremental de datos y la publicación-suscripción de datos. El almacenamiento de objetos almacena instantáneas de registros, índices y algunos resultados de cálculos intermedios.</p>
<p><strong>Microservicios</strong>: Milvus sigue los principios de desagregación del plano de datos y el plano de control, separación de lectura/escritura y separación de tareas en línea/fuera de línea. Se compone de cuatro capas de servicio: la capa de acceso, la capa de coordinador, la capa de trabajador y la capa de almacenamiento. Estas capas son mutuamente independientes cuando se trata de escalado y recuperación de desastres. La capa de acceso, que es la capa frontal y el punto final del usuario, gestiona las conexiones de los clientes, valida sus solicitudes y combina los resultados de las consultas. Como &quot;cerebro&quot; del sistema, la capa de coordinación asume las tareas de gestión de la topología del clúster, equilibrio de carga, declaración de datos y gestión de datos. La capa de trabajadores contiene las "extremidades" del sistema, ejecutando actualizaciones de datos, consultas y operaciones de creación de índices. Por último, la capa de almacenamiento se encarga de la persistencia y replicación de los datos. En conjunto, este diseño basado en microservicios garantiza una complejidad controlable del sistema, en el que cada componente es responsable de su función correspondiente. Milvus aclara los límites de los servicios mediante interfaces bien definidas y desacopla los servicios basándose en una granularidad más fina, lo que optimiza aún más la escalabilidad elástica y la distribución de recursos.</p>
<h2 id="Technical-challenges-faced-by-vector-databases" class="common-anchor-header">Retos técnicos de las bases de datos vectoriales<button data-href="#Technical-challenges-faced-by-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Las primeras investigaciones sobre bases de datos vectoriales se centraron principalmente en el diseño de estructuras de índices y métodos de consulta de alta eficiencia, lo que dio lugar a una gran variedad de bibliotecas de algoritmos de búsqueda vectorial (Referencia nº 3~5). En los últimos años, un número cada vez mayor de equipos académicos y de ingeniería han vuelto a examinar los problemas de la búsqueda vectorial desde la perspectiva del diseño de sistemas, y han propuesto algunas soluciones sistemáticas. Resumiendo los estudios existentes y la demanda de los usuarios, clasificamos los principales retos técnicos de las bases de datos vectoriales del siguiente modo:</p>
<ul>
<li><strong>Optimización de la relación coste-rendimiento en relación con la carga</strong></li>
</ul>
<p>En comparación con los tipos de datos tradicionales, el análisis de datos vectoriales requiere muchos más recursos de almacenamiento y computación debido a su alta dimensionalidad. Además, los usuarios han mostrado preferencias diversas en cuanto a las características de la carga y la optimización del coste-rendimiento de las soluciones de búsqueda vectorial. Por ejemplo, los usuarios que trabajan con conjuntos de datos extremadamente grandes (decenas o cientos de miles de millones de vectores) preferirían soluciones con menores costes de almacenamiento de datos y una latencia de búsqueda variable, mientras que otros podrían exigir un mayor rendimiento de búsqueda y una latencia media no variable. Para satisfacer estas preferencias tan diversas, el componente central del índice de la base de datos vectorial debe ser capaz de soportar estructuras de índice y algoritmos de búsqueda con diferentes tipos de almacenamiento y hardware informático.</p>
<p>Por ejemplo, el almacenamiento de datos vectoriales y de los datos de índice correspondientes en medios de almacenamiento más baratos (como NVM y SSD) debe tenerse en cuenta a la hora de reducir los costes de almacenamiento. Sin embargo, la mayoría de los algoritmos de búsqueda vectorial existentes funcionan con datos leídos directamente de la memoria. Para evitar la pérdida de rendimiento que conlleva el uso de unidades de disco, la base de datos vectorial debe ser capaz de explotar la localidad de acceso a los datos combinada con los algoritmos de búsqueda, además de poder ajustarse a las soluciones de almacenamiento de datos vectoriales y estructura de índices (Referencia nº 6~8). Con el fin de mejorar el rendimiento, la investigación actual se ha centrado en tecnologías de aceleración de hardware que incluyen GPU, NPU, FPGA, etc. (Referencia nº 9). Sin embargo, el hardware y los chips específicos de aceleración varían en el diseño de la arquitectura, y el problema de la ejecución más eficiente a través de diferentes aceleradores de hardware aún no está resuelto.</p>
<ul>
<li><strong>Configuración y ajuste automatizados del sistema</strong></li>
</ul>
<p>La mayoría de los estudios existentes sobre algoritmos de búsqueda vectorial buscan un equilibrio flexible entre los costes de almacenamiento, el rendimiento computacional y la precisión de la búsqueda. Por lo general, tanto los parámetros del algoritmo como las características de los datos influyen en el rendimiento real de un algoritmo. Dado que las demandas de los usuarios difieren en costes y rendimiento, la selección de un método de búsqueda vectorial que se adapte a sus necesidades y a las características de los datos plantea un reto importante.</p>
<p>Sin embargo, los métodos manuales de análisis de los efectos de la distribución de datos en los algoritmos de búsqueda no son eficaces debido a la alta dimensionalidad de los datos vectoriales. Para abordar este problema, el mundo académico y la industria están buscando soluciones de recomendación de algoritmos basadas en el aprendizaje automático (Referencia nº 10).</p>
<p>El diseño de un algoritmo de búsqueda vectorial inteligente basado en el aprendizaje automático es también un tema candente de investigación. En general, los algoritmos de búsqueda vectorial existentes se desarrollan universalmente para datos vectoriales con diversos patrones de dimensionalidad y distribución. En consecuencia, no admiten estructuras de índices específicas según las características de los datos, por lo que tienen poco espacio para la optimización. Los estudios futuros también deberían explorar tecnologías eficaces de aprendizaje automático que puedan adaptar las estructuras de los índices a las diferentes características de los datos (Referencia nº 11-12).</p>
<ul>
<li><strong>Soporte de semántica de consulta avanzada</strong></li>
</ul>
<p>Las aplicaciones modernas se basan a menudo en consultas más avanzadas a través de vectores: la semántica tradicional de búsqueda del vecino más próximo ya no es aplicable a la búsqueda de datos vectoriales. Además, está surgiendo una demanda de búsqueda combinada en múltiples bases de datos vectoriales o en datos vectoriales y no vectoriales (Referencia nº 13).</p>
<p>Concretamente, las variaciones en las métricas de distancia para la similitud vectorial crecen rápidamente. Las puntuaciones de similitud tradicionales, como la distancia euclidiana, la distancia producto interior y la distancia coseno, no pueden satisfacer todas las demandas de las aplicaciones. Con la popularización de la tecnología de inteligencia artificial, muchas industrias están desarrollando sus propias métricas de similitud vectorial específicas para cada campo, como la distancia Tanimoto, la distancia Mahalanobis, la superestructura y la subestructura. Tanto la integración de estas métricas de evaluación en los algoritmos de búsqueda existentes como el diseño de nuevos algoritmos que utilicen dichas métricas son problemas de investigación que suponen todo un reto.</p>
<p>A medida que aumente la complejidad de los servicios a los usuarios, las aplicaciones tendrán que buscar tanto en datos vectoriales como en datos no vectoriales. Por ejemplo, un recomendador de contenidos analiza las preferencias y relaciones sociales de los usuarios y las relaciona con los temas de actualidad para ofrecerles el contenido adecuado. Estas búsquedas suelen implicar consultas en varios tipos de datos o en varios sistemas de procesamiento de datos. Dar soporte a estas búsquedas híbridas de forma eficiente y flexible es otro de los retos del diseño de sistemas.</p>
<h2 id="Authors" class="common-anchor-header">Autores<button data-href="#Authors" class="anchor-icon" translate="no">
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
    </button></h2><p>Dr. Rentong Guo (Doctor en Teoría y Software Informático por la Universidad Huazhong de Ciencia y Tecnología), socio y Director de I+D de Zilliz. Es miembro del Comité Técnico de Informática Distribuida y Procesamiento de la Federación China de Ordenadores (CCF TCDCP). Sus investigaciones se centran en bases de datos, sistemas distribuidos, sistemas de caché y computación heterogénea. Sus trabajos de investigación se han publicado en varios congresos y revistas de primer nivel, como Usenix ATC, ICS, DATE y TPDS. Como arquitecto de Milvus, el Dr. Guo busca soluciones para desarrollar sistemas analíticos de datos basados en IA altamente escalables y rentables.</p>
<p>Xiaofan Luan, socio y Director de Ingeniería de Zilliz, y miembro del Comité Asesor Técnico de LF AI &amp; Data Foundation. Trabajó sucesivamente en la sede estadounidense de Oracle y en Hedvig, una startup de almacenamiento definido por software. Se incorporó al equipo de Alibaba Cloud Database y se encargó del desarrollo de las bases de datos NoSQL HBase y Lindorm. Luan obtuvo su máster en Ingeniería Informática Electrónica en la Universidad de Cornell.</p>
<p>Dr. Xiaomeng Yi (Doctor en Arquitectura Informática por la Universidad Huazhong de Ciencia y Tecnología), Investigador principal y jefe del equipo de investigación de Zilliz. Sus investigaciones se centran en la gestión de datos de alta dimensión, la recuperación de información a gran escala y la asignación de recursos en sistemas distribuidos. Los trabajos de investigación del Dr. Yi se han publicado en destacadas revistas y conferencias internacionales como IEEE Network Magazine, IEEE/ACM TON, ACM SIGMOD, IEEE ICDCS y ACM TOMPECS.</p>
<p>Filip Haltmayer, ingeniero de datos de Zilliz, se licenció en Informática por la Universidad de California, Santa Cruz. Después de unirse a Zilliz, Filip pasa la mayor parte de su tiempo trabajando en despliegues en la nube, interacciones con clientes, charlas técnicas y desarrollo de aplicaciones de IA.</p>
<h2 id="References" class="common-anchor-header">Referencias<button data-href="#References" class="anchor-icon" translate="no">
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
<li>Proyecto Milvus: https://github.com/milvus-io/milvus</li>
<li>Milvus: Un sistema de gestión de datos vectoriales creado a propósito, SIGMOD'21</li>
<li>Proyecto Faiss: https://github.com/facebookresearch/faiss</li>
<li>Proyecto Annoy: https://github.com/spotify/annoy</li>
<li>Proyecto SPTAG: https://github.com/microsoft/SPTAG</li>
<li>GRIP: Multi-Store Capacity-Optimized High-Performance Nearest Neighbor Search for Vector Search Engine, CIKM'19</li>
<li>DiskANN: Fast Accurate Billion-point Nearest Neighbor Search on a Single Node, NIPS'19</li>
<li>HM-ANN: búsqueda eficiente de vecinos más próximos en miles de millones de puntos en memoria heterogénea, NIPS'20</li>
<li>SONG: búsqueda aproximada del vecino más próximo en la GPU, ICDE'20</li>
<li>Demostración del servicio de ajuste automático del sistema de gestión de bases de datos ottertune, VLDB'18</li>
<li>El caso de las estructuras de índices aprendidas, SIGMOD'18</li>
<li>Improving Approximate Nearest Neighbor Search through Learned Adaptive Early Termination, SIGMOD'20</li>
<li>AnalyticDB-V: A Hybrid Analytical Engine Towards Query Fusion for Structured and Unstructured Data, VLDB'20</li>
</ol>
<h2 id="Engage-with-our-open-source-community" class="common-anchor-header">Participe en nuestra comunidad de código abierto:<button data-href="#Engage-with-our-open-source-community" class="anchor-icon" translate="no">
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
<li>Encuentre o contribuya a Milvus en <a href="https://bit.ly/3khejQB">GitHub</a>.</li>
<li>Interactúe con la comunidad a través <a href="https://bit.ly/307HVsY">del Foro</a>.</li>
<li>Conéctese con nosotros en <a href="https://bit.ly/3wn5aek">Twitter</a>.</li>
</ul>
