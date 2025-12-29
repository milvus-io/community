---
id: how-to-safely-upgrade-from-milvu-2-5-x-to-milvus-2-6-x.md
title: Cómo actualizar con seguridad de Milvus 2.5.x a Milvus 2.6.x
author: Yiqing Lu
date: 2025-12-25T00:00:00.000Z
cover: assets.zilliz.com/milvus_upgrade_25x_to_26x_700x438_856ac6b75c.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector databases, Milvus 2.6 features, Nvidia Cagra, full text search'
meta_title: |
  How to Safely Upgrade from Milvus 2.5.x to Milvus 2.6.x
desc: >-
  Explore las novedades de Milvus 2.6, incluidos los cambios de arquitectura y
  las características clave, y aprenda a realizar una actualización continua
  desde Milvus 2.5.
origin: >-
  https://milvus.io/blog/how-to-safely-upgrade-from-milvu-2-5-x-to-milvus-2-6-x.md
---
<p><a href="https://milvus.io/docs/release_notes.md"><strong>Milvus 2.6</strong></a> lleva un tiempo en funcionamiento y está demostrando ser un sólido paso adelante para el proyecto. La versión aporta una arquitectura refinada, un mayor rendimiento en tiempo real, un menor consumo de recursos y un comportamiento de escalado más inteligente en entornos de producción. Muchas de estas mejoras han surgido directamente de los comentarios de los usuarios, y los primeros usuarios de 2.6.x ya han informado de búsquedas notablemente más rápidas y de un rendimiento del sistema más predecible bajo cargas de trabajo pesadas o dinámicas.</p>
<p>Para los equipos que utilizan Milvus 2.5.x y están evaluando el paso a 2.6.x, esta guía es su punto de partida. Desglosa las diferencias arquitectónicas, destaca las capacidades clave introducidas en Milvus 2.6 y proporciona una ruta de actualización práctica, paso a paso, diseñada para minimizar la interrupción operativa.</p>
<p>Si sus cargas de trabajo implican canalizaciones en tiempo real, búsquedas multimodales o híbridas, u operaciones vectoriales a gran escala, este blog le ayudará a evaluar si 2.6 se ajusta a sus necesidades y, si decide seguir adelante, actualizar con confianza manteniendo la integridad de los datos y la disponibilidad del servicio.</p>
<h2 id="Architecture-Changes-from-Milvus-25-to-Milvus-26" class="common-anchor-header">Cambios en la arquitectura de Milvus 2.5 a Milvus 2.6<button data-href="#Architecture-Changes-from-Milvus-25-to-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de sumergirnos en el flujo de trabajo de actualización propiamente dicho, entendamos primero cómo cambia la arquitectura de Milvus en Milvus 2.6.</p>
<h3 id="Milvus-25-Architecture" class="common-anchor-header">Arquitectura de Milvus 2.5</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_2_5_4e228af3c4.PNG" alt="Milvus 2.5 Architecture" class="doc-image" id="milvus-2.5-architecture" />
   </span> <span class="img-wrapper"> <span>Arquitectura de Milvus 2.5</span> </span></p>
<p>En Milvus 2.5, los flujos de trabajo en flujo y por lotes estaban entrelazados a través de múltiples nodos trabajadores:</p>
<ul>
<li><p><strong>QueryNode</strong> gestionaba tanto las consultas históricas <em>como</em> las incrementales (streaming).</p></li>
<li><p><strong>DataNode</strong> gestionaba tanto la descarga en tiempo de ingesta <em>como la</em> compactación en segundo plano de los datos históricos.</p></li>
</ul>
<p>Esta mezcla de lógica por lotes y en tiempo real dificultaba el escalado independiente de las cargas de trabajo por lotes. También significaba que el estado de streaming estaba disperso entre varios componentes, lo que introducía retrasos en la sincronización, complicaba la recuperación en caso de fallo y aumentaba la complejidad operativa.</p>
<h3 id="Milvus-26-Architecture" class="common-anchor-header">Arquitectura de Milvus 2.6</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_2_6_ee6f1f0635.PNG" alt="Milvus 2.6 Architecture" class="doc-image" id="milvus-2.6-architecture" />
   </span> <span class="img-wrapper"> <span>Arquitectura de Milvus 2.6</span> </span></p>
<p>Milvus 2.6 introduce un <strong>StreamingNode</strong> dedicado que maneja todas las responsabilidades de los datos en tiempo real: consumir la cola de mensajes, escribir segmentos incrementales, servir consultas incrementales y gestionar la recuperación basada en WAL. Con el streaming aislado, el resto de componentes asumen funciones más limpias y centradas:</p>
<ul>
<li><p><strong>QueryNode</strong> gestiona ahora <em>sólo</em> consultas por lotes sobre segmentos históricos.</p></li>
<li><p><strong>DataNode</strong> gestiona ahora <em>sólo</em> las tareas de datos históricos, como la compactación y la creación de índices.</p></li>
</ul>
<p>El StreamingNode absorbe todas las tareas relacionadas con el streaming que se dividían entre DataNode, QueryNode e incluso el Proxy en Milvus 2.5, aportando claridad y reduciendo la compartición de estados entre roles.</p>
<h3 id="Milvus-25x-vs-Milvus-26x-Component-by-Component-Comparison" class="common-anchor-header">Milvus 2.5.x frente a Milvus 2.6.x: Comparación componente por componente</h3><table>
<thead>
<tr><th></th><th style="text-align:center"><strong>Milvus 2.5.x</strong></th><th style="text-align:center"><strong>Milvus 2.6.x</strong></th><th style="text-align:center"><strong>Qué ha cambiado</strong></th></tr>
</thead>
<tbody>
<tr><td>Servicios de coordinación</td><td style="text-align:center">RootCoord / QueryCoord / DataCoord (o MixCoord)</td><td style="text-align:center">MixCoord</td><td style="text-align:center">La gestión de metadatos y la programación de tareas se consolidan en un único MixCoord, lo que simplifica la lógica de coordinación y reduce la complejidad distribuida.</td></tr>
<tr><td>Capa de acceso</td><td style="text-align:center">Proxy</td><td style="text-align:center">Proxy</td><td style="text-align:center">Las solicitudes de escritura se enrutan únicamente a través del nodo de transmisión para la ingestión de datos.</td></tr>
<tr><td>Nodos de trabajo</td><td style="text-align:center">-</td><td style="text-align:center">Nodo de transmisión</td><td style="text-align:center">Nodo dedicado al procesamiento de secuencias responsable de toda la lógica incremental (segmentos crecientes), incluyendo:- Ingesta de datos incrementales- Consulta de datos incrementales- Persistencia de datos incrementales en el almacenamiento de objetos- Escrituras basadas en secuencias- Recuperación de fallos basada en WAL</td></tr>
<tr><td></td><td style="text-align:center">Nodo de consulta</td><td style="text-align:center">Nodo de consulta</td><td style="text-align:center">Nodo de procesamiento por lotes que sólo gestiona consultas sobre datos históricos.</td></tr>
<tr><td></td><td style="text-align:center">Nodo de datos</td><td style="text-align:center">Nodo de datos</td><td style="text-align:center">Nodo de procesamiento por lotes responsable únicamente de los datos históricos, incluida la compactación y la creación de índices.</td></tr>
<tr><td></td><td style="text-align:center">Nodo de índices</td><td style="text-align:center">-</td><td style="text-align:center">El nodo de índice se fusiona con el nodo de datos, lo que simplifica la definición de funciones y la topología de despliegue.</td></tr>
</tbody>
</table>
<p>En resumen, Milvus 2.6 traza una línea clara entre las cargas de trabajo de streaming y batch, eliminando el enredo entre componentes visto en 2.5 y creando una arquitectura más escalable y fácil de mantener.</p>
<h2 id="Milvus-26-Feature-Highlights" class="common-anchor-header">Características destacadas de Milvus 2.6<button data-href="#Milvus-26-Feature-Highlights" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de entrar en el flujo de trabajo de la actualización, he aquí un rápido vistazo a lo que Milvus 2.6 pone sobre la mesa. <strong>Esta versión se centra en reducir los costes de infraestructura, mejorar el rendimiento de las búsquedas y facilitar el escalado de cargas de trabajo de IA dinámicas y de gran tamaño.</strong></p>
<h3 id="Cost--Efficiency-Improvements" class="common-anchor-header">Mejoras en costes y eficiencia</h3><ul>
<li><p><strong>Cuantización</strong><a href="https://milvus.io/docs/ivf-rabitq.md#RaBitQ"><strong>RaBitQ</strong></a> <strong>para índices primarios</strong>: un nuevo método de cuantización de 1 bit que comprime los índices vectoriales a <strong>1/32</strong> de su tamaño original. Combinado con el reordenamiento SQ8, reduce el uso de memoria en un 28%, aumenta los QPS en 4 veces y mantiene una recuperación del 95%, lo que reduce significativamente los costes de hardware.</p></li>
<li><p><strong>Búsqueda de texto completo</strong><a href="https://milvus.io/docs/full-text-search.md#BM25-implementation"><strong>optimizada para BM25</strong></a>: puntuación nativa de BM25 basada en vectores de ponderación de términos dispersos. La búsqueda por palabras clave se ejecuta <strong>entre 3 y 4 veces más rápido</strong> (hasta <strong>7 veces</strong> en algunos conjuntos de datos) en comparación con Elasticsearch, manteniendo el tamaño del índice en torno a un tercio de los datos de texto originales.</p></li>
<li><p><strong>Indexación de rutas JSON con JSON Shredding</strong> - El filtrado estructurado en JSON anidado es ahora mucho más rápido y predecible. Las rutas JSON previamente indexadas reducen la latencia del filtro de <strong>140 ms → 1,5 ms</strong> (P99: <strong>480 ms → 10 ms</strong>), lo que hace que la búsqueda vectorial híbrida + el filtrado de metadatos respondan significativamente mejor.</p></li>
<li><p><strong>Soporte ampliado de tipos de datos</strong>: añade tipos de vectores Int8, campos de <a href="https://milvus.io/docs/geometry-field.md#Geometry-Field">geometría</a> (POINT / LINESTRING / POLYGON) y matrices de estructuras. Estas extensiones soportan cargas de trabajo geoespaciales, un modelado de metadatos más rico y esquemas más limpios.</p></li>
<li><p><strong>Upsert para actualizaciones parciales</strong> - Ahora puede insertar o actualizar entidades utilizando una única llamada de clave primaria. Las actualizaciones parciales sólo modifican los campos proporcionados, lo que reduce la amplificación de escritura y simplifica los procesos que actualizan con frecuencia los metadatos o las incrustaciones.</p></li>
</ul>
<h3 id="Search-and-Retrieval-Enhancements" class="common-anchor-header">Mejoras en la búsqueda y recuperación</h3><ul>
<li><p><strong>Procesamiento de texto y soporte multilingüe mejorados:</strong> Los nuevos tokenizadores Lindera e ICU mejoran el tratamiento de textos en japonés, coreano y <a href="https://milvus.io/docs/multi-language-analyzers.md#Multi-language-Analyzers">multilingües</a>. Jieba es ahora compatible con diccionarios personalizados. <code translate="no">run_analyzer</code> ayuda a depurar el comportamiento de la tokenización, y los analizadores multilingües garantizan la coherencia de la búsqueda en varios idiomas.</p></li>
<li><p><strong>Concordancia</strong> <a href="https://milvus.io/docs/phrase-match.md#Phrase-Match">de</a><strong>texto de alta precisión: la</strong> <a href="https://milvus.io/docs/phrase-match.md#Phrase-Match">concordancia de frases</a> impone consultas de frases ordenadas con inclinación configurable. El nuevo índice <a href="https://milvus.io/docs/ngram.md#NGRAM">NGRAM</a> acelera las consultas de subcadenas y <code translate="no">LIKE</code> tanto en campos VARCHAR como en rutas JSON, lo que permite una rápida coincidencia parcial y difusa del texto.</p></li>
<li><p><strong>Reordenación en función del tiempo y los metadatos:</strong> <a href="https://milvus.io/docs/boost-ranker.md#Boost-Ranker">Los Clasificadores</a> <a href="https://milvus.io/docs/decay-ranker-overview.md">de Decaimiento</a> (exponencial, lineal, gaussiano) ajustan las puntuaciones utilizando marcas de tiempo; <a href="https://milvus.io/docs/boost-ranker.md#Boost-Ranker">los Clasificadores de Impulso</a> aplican reglas basadas en metadatos para promover o degradar los resultados. Ambos ayudan a ajustar el comportamiento de recuperación sin cambiar los datos subyacentes.</p></li>
<li><p><strong>Integración simplificada de modelos y vectorización automática:</strong> Las integraciones incorporadas con OpenAI, Hugging Face y otros proveedores de incrustación permiten a Milvus vectorizar automáticamente el texto durante las operaciones de inserción y consulta. Se acabaron las canalizaciones de incrustación manuales para casos de uso comunes.</p></li>
<li><p><strong>Actualizaciones de esquema en línea para campos escalares:</strong> Añada nuevos campos escalares a las colecciones existentes sin tiempo de inactividad ni recargas, simplificando la evolución del esquema a medida que crecen los requisitos de metadatos.</p></li>
<li><p><strong>Detección de casi duplicados con MinHash:</strong> <a href="https://milvus.io/docs/minhash-lsh.md#MINHASHLSH">MinHash</a> + LSH permite una detección eficaz de casi duplicados en grandes conjuntos de datos sin costosas comparaciones exactas.</p></li>
</ul>
<h3 id="Architecture-and-Scalability-Upgrades" class="common-anchor-header">Mejoras de arquitectura y escalabilidad</h3><ul>
<li><p><a href="https://milvus.io/docs/tiered-storage-overview.md#Tiered-Storage-Overview"><strong>Almacenamiento por niveles</strong></a> <strong>para la gestión de datos calientes y fríos:</strong> Separa los datos calientes y fríos en SSD y almacenamiento de objetos; admite la carga lenta y parcial; elimina la necesidad de cargar completamente las colecciones de forma local; reduce el uso de recursos hasta en un 50% y acelera los tiempos de carga para grandes conjuntos de datos.</p></li>
<li><p><strong>Servicio de streaming en tiempo real:</strong> Añade nodos de streaming dedicados e integrados con Kafka/Pulsar para una ingestión continua; permite la indexación inmediata y la disponibilidad de consultas; mejora el rendimiento de escritura y acelera la recuperación de fallos para cargas de trabajo en tiempo real que cambian rápidamente.</p></li>
<li><p><strong>Escalabilidad y estabilidad mejoradas:</strong> Milvus admite ahora más de 100.000 colecciones para grandes entornos multiempresa. Las actualizaciones de infraestructura - <a href="https://milvus.io/docs/woodpecker_architecture.md#Woodpecker">Woodpecker</a> (WAL sin disco), <a href="https://milvus.io/docs/roadmap.md#%F0%9F%94%B9-HotCold-Tiering--Storage-Architecture-StorageV2">Storage v2</a> (IOPS/memoria reducidas) y <a href="https://milvus.io/docs/release_notes.md#Coordinator-Merge-into-MixCoord">Coordinator Merge</a> - mejoran la estabilidad del clúster y permiten un escalado predecible bajo cargas de trabajo pesadas.</p></li>
</ul>
<p>Para obtener una lista completa de las características de Milvus 2.6, consulte <a href="https://milvus.io/docs/release_notes.md">las notas de la versión de Milvus</a>.</p>
<h2 id="How-to-Upgrade-from-Milvus-25x-to-Milvus-26x" class="common-anchor-header">Cómo actualizar de Milvus 2.5.x a Milvus 2.6.x<button data-href="#How-to-Upgrade-from-Milvus-25x-to-Milvus-26x" class="anchor-icon" translate="no">
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
    </button></h2><p>Para mantener el sistema lo más disponible posible durante la actualización, los clusters Milvus 2.5 deben actualizarse a Milvus 2.6 en el siguiente orden.</p>
<p><strong>1. Inicie primero el nodo de transmisión</strong></p>
<p>Inicie el Nodo de Transmisión por adelantado. El nuevo <strong>Delegator</strong> (el componente en el Query Node responsable del manejo de los datos de streaming) debe moverse al Milvus 2.6 Streaming Node.</p>
<p><strong>2. Actualizar MixCoord</strong></p>
<p>Actualice los componentes del coordinador a <strong>MixCoord</strong>. Durante este paso, MixCoord necesita detectar las versiones de los Worker Nodes para manejar la compatibilidad entre versiones dentro del sistema distribuido.</p>
<p><strong>3. Actualizar el nodo de consulta</strong></p>
<p>Las actualizaciones del Nodo de Consulta suelen llevar más tiempo. Durante esta fase, los Nodos de Datos y los Nodos de Índice de Milvus 2.5 pueden continuar manejando operaciones como Flush y la construcción de Índices, ayudando a reducir la presión del lado de la consulta mientras se actualizan los Nodos de Consulta.</p>
<p><strong>4. Actualizar el Nodo de Datos</strong></p>
<p>Una vez que los Nodos de Datos Milvus 2.5 se desconectan, las operaciones de Flush dejan de estar disponibles y los datos en Segmentos Crecientes pueden seguir acumulándose hasta que todos los nodos se actualicen completamente a Milvus 2.6.</p>
<p><strong>5. Actualizar el proxy</strong></p>
<p>Después de actualizar un Proxy a Milvus 2.6, las operaciones de escritura en ese Proxy seguirán sin estar disponibles hasta que todos los componentes del clúster se actualicen a 2.6.</p>
<p><strong>6. Eliminar el nodo de índice</strong></p>
<p>Una vez que todos los demás componentes estén actualizados, el Nodo de Índice autónomo puede retirarse de forma segura.</p>
<p><strong>Notas:</strong></p>
<ul>
<li><p>Desde la finalización de la actualización del DataNode hasta la finalización de la actualización del Proxy, las operaciones de Flush no están disponibles.</p></li>
<li><p>Desde el momento en que se actualiza el primer Proxy hasta que se actualizan todos los nodos Proxy, algunas operaciones de escritura no están disponibles.</p></li>
<li><p><strong>Cuando se actualiza directamente de Milvus 2.5.x a 2.6.6, las operaciones DDL (Lenguaje de Definición de Datos) no están disponibles durante el proceso de actualización debido a cambios en el marco DDL.</strong></p></li>
</ul>
<h2 id="How-to-Upgrade-to-Milvus-26-with-Milvus-Operator" class="common-anchor-header">Cómo actualizar a Milvus 2.6 con Milvus Operator<button data-href="#How-to-Upgrade-to-Milvus-26-with-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/milvus-operator">Milvus Operator</a> es un operador Kubernetes de código abierto que proporciona una forma escalable y altamente disponible de desplegar, gestionar y actualizar toda la pila de servicios Milvus en un clúster Kubernetes de destino. La pila de servicios Milvus gestionada por el operador incluye:</p>
<ul>
<li><p>Componentes centrales de Milvus</p></li>
<li><p>Dependencias necesarias como etcd, Pulsar y MinIO</p></li>
</ul>
<p>Milvus Operator sigue el patrón estándar de Kubernetes Operator. Introduce un Recurso Personalizado Milvus (CR) que describe el estado deseado de un clúster Milvus, como su versión, topología y configuración.</p>
<p>Un controlador supervisa continuamente el clúster y concilia el estado real con el estado deseado definido en el CR. Cuando se realizan cambios, como actualizar la versión de Milvus, el operador los aplica automáticamente de forma controlada y repetible, lo que permite actualizaciones automatizadas y una gestión continua del ciclo de vida.</p>
<h3 id="Milvus-Custom-Resource-CR-Example" class="common-anchor-header">Ejemplo de recurso personalizado (CR) de Milvus</h3><pre><code translate="no">apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-milvus-mansion    
  namespace: dev       
spec:
  mode: cluster                  <span class="hljs-comment"># cluster or standalone</span>
  <span class="hljs-comment"># Milvus Components</span>
  components:
    image: milvusdb/milvus:v2.6.5
    imageUpdateMode: rollingUpgrade 
    proxy:                   
      replicas: 1          
    mixCoord:              
      replicas: 1           
    dataNode:               
      replicas: 1          
    queryNode:              
      replicas: 2           
      resources:
        requests:
          cpu: <span class="hljs-string">&quot;2&quot;</span>
          memory: <span class="hljs-string">&quot;8Gi&quot;</span>  
  <span class="hljs-comment"># Dependencies, including etcd, storage and message stream</span>
  dependencies:
    etcd:                   
      inCluster:
        values:
          replicaCount: 3    
    storage:                 
      <span class="hljs-built_in">type</span>: MinIO
      inCluster:
        values:
          mode: distributed     
    msgStreamType: pulsar    
    pulsar:
      inCluster:
        values:
          bookkeeper:
            replicas: 3   
  <span class="hljs-comment"># Milvus configs</span>
  config:
    dataCoord:
      enableActiveStandby: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Rolling-Upgrades-from-Milvus-25-to-26-with-Milvus-Operator" class="common-anchor-header">Actualizaciones continuas de Milvus 2.5 a 2.6 con Milvus Operator</h3><p>Milvus Operator proporciona soporte integrado para <strong>actualizaciones continuas de Mil</strong> vus <strong>2.5 a 2.6</strong> en modo clúster, adaptando su comportamiento para tener en cuenta los cambios arquitectónicos introducidos en 2.6.</p>
<p><strong>1. Detección del escenario de actualización</strong></p>
<p>Durante una actualización, Milvus Operator determina la versión de Milvus de destino a partir de la especificación del clúster. Esto se hace</p>
<ul>
<li><p>Inspeccionando la etiqueta de imagen definida en <code translate="no">spec.components.image</code>, o</p></li>
<li><p>Leyendo la versión explícita especificada en <code translate="no">spec.components.version</code></p></li>
</ul>
<p>A continuación, el operador compara esta versión deseada con la versión actualmente en ejecución, que se registra en <code translate="no">status.currentImage</code> o <code translate="no">status.currentVersion</code>. Si la versión actual es 2.5 y la versión deseada es 2.6, el operador identifica la actualización como un escenario de actualización 2.5 → 2.6.</p>
<p><strong>2. Orden de ejecución de la actualización progresiva</strong></p>
<p>Cuando se detecta una actualización 2.5 → 2.6 y el modo de actualización está configurado como actualización continua (<code translate="no">spec.components.imageUpdateMode: rollingUpgrade</code>, que es el valor predeterminado), Milvus Operator realiza automáticamente la actualización en un orden predefinido alineado con la arquitectura de Milvus 2.6:</p>
<p>Iniciar el nodo de transmisión → Actualizar MixCoord → Actualizar el nodo de consulta → Actualizar el nodo de datos → Actualizar el proxy → Eliminar el nodo de índice.</p>
<p><strong>3. Consolidación automática de coordinadores</strong></p>
<p>Milvus 2.6 sustituye múltiples componentes de coordinador por un único MixCoord. Milvus Operator maneja esta transición arquitectónica automáticamente.</p>
<p>Cuando se configura <code translate="no">spec.components.mixCoord</code>, el operador trae MixCoord y espera hasta que esté listo. Una vez que MixCoord está totalmente operativo, el operador apaga los componentes del coordinador heredado -RootCoord, QueryCoord y DataCoord- completando la migración sin necesidad de intervención manual.</p>
<h3 id="Upgrade-Steps-from-Milvus-25-to-26" class="common-anchor-header">Pasos de actualización de Milvus 2.5 a 2.6</h3><p>1.Actualice Milvus Operator a la última versión (En esta guía, utilizamos <strong>la versión 1.3.3</strong>, que era la última versión en el momento de redactar este documento).</p>
<pre><code translate="no"><span class="hljs-comment"># Option 1: Using Helm</span>
helm upgrade --install milvus-operator \
  -n milvus-operator --create-namespace \
  https://github.com/zilliztech/milvus-operator/releases/download/v1.3.3/milvus-operator-1.3.3.tgz
 <span class="hljs-comment"># Option 2: Using kubectl &amp; raw manifests</span>
 kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/v1.3.3/deploy/manifests/deployment.yaml
<button class="copy-code-btn"></button></code></pre>
<p>2.Fusione los componentes del coordinador</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;mixCoord&quot;: {
        &quot;replicas&quot;: 1
      }
    }
  }
}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3. Asegúrese de que el clúster ejecuta Milvus 2.5.16 o posterior.</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;image&quot;: &quot;milvusdb/milvus:v2.5.22&quot;
    }
  }
}&#x27;</span>
<span class="hljs-comment"># wait till updated</span>
kubectl <span class="hljs-built_in">wait</span> milvus my-release -n demo-operator --<span class="hljs-keyword">for</span>=condition=milvusupdated --<span class="hljs-built_in">timeout</span>=1h
<button class="copy-code-btn"></button></code></pre>
<p>4.Actualice Milvus a la versión 2.6</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;image&quot;: &quot;milvusdb/milvus:v2.6.5&quot;
    }
  }
}&#x27;</span>
<span class="hljs-comment"># wait till updated</span>
kubectl <span class="hljs-built_in">wait</span> milvus my-release -n demo-operator --<span class="hljs-keyword">for</span>=condition=milvusupdated --<span class="hljs-built_in">timeout</span>=1h
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Upgrade-to-Milvus-26-with-Helm" class="common-anchor-header">Cómo actualizar a Milvus 2.6 con Helm<button data-href="#How-to-Upgrade-to-Milvus-26-with-Helm" class="anchor-icon" translate="no">
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
    </button></h2><p>Al desplegar Milvus utilizando Helm, todos los recursos de Kubernetes <code translate="no">Deployment</code> se actualizan en paralelo, sin un orden de ejecución garantizado. Como resultado, Helm no proporciona un control estricto sobre las secuencias de actualización entre componentes. Para entornos de producción, se recomienda encarecidamente el uso de Milvus Operator.</p>
<p>Milvus aún puede actualizarse de 2.5 a 2.6 utilizando Helm siguiendo los pasos que se indican a continuación.</p>
<p>Requisitos del sistema</p>
<ul>
<li><p><strong>Versión</strong> de<strong>Helm</strong>: ≥ 3.14.0</p></li>
<li><p><strong>Versión de Kubernetes:</strong> ≥ 1.20.0</p></li>
</ul>
<p>1.Actualice la carta Milvus Helm a la última versión. En esta guía, utilizamos <strong>la versión 5.0.7 del gráfico</strong>, que era la más reciente en el momento de la redacción.</p>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> zilliztech https:<span class="hljs-comment">//zilliztech.github.io/milvus-helm</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<p>2.Si el cluster está desplegado con múltiples componentes coordinadores, primero actualice Milvus a la versión 2.5.16 o posterior y habilite MixCoord.</p>
<pre><code translate="no">mixCoordinator
。
helm upgrade -i my-release zilliztech/milvus \
  --namespace=helm-demo \
  --<span class="hljs-built_in">set</span> image.all.tag=<span class="hljs-string">&quot;v2.5.22&quot;</span> \
  --<span class="hljs-built_in">set</span> mixCoordinator.enabled=<span class="hljs-literal">true</span> \
  --<span class="hljs-built_in">set</span> rootCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> indexCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> queryCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> dataCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> streaming.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> indexNode.enabled=<span class="hljs-literal">true</span> \
  --reset-then-reuse-values \
  --version=5.0.7 \
  --<span class="hljs-built_in">wait</span> --<span class="hljs-built_in">timeout</span> 1h
<button class="copy-code-btn"></button></code></pre>
<p>3.Actualice Milvus a la versión 2.6</p>
<pre><code translate="no">helm upgrade my-release zilliztech/milvus \
  --namespace=helm-demo \
  --<span class="hljs-built_in">set</span> image.all.tag=<span class="hljs-string">&quot;v2.6.5&quot;</span> \
  --<span class="hljs-built_in">set</span> streaming.enabled=<span class="hljs-literal">true</span> \
  --<span class="hljs-built_in">set</span> indexNode.enabled=<span class="hljs-literal">false</span> \
  --reset-then-reuse-values \
  --version=5.0.7 \
  --<span class="hljs-built_in">wait</span> --<span class="hljs-built_in">timeout</span> 1h
<button class="copy-code-btn"></button></code></pre>
<h2 id="FAQ-on-Milvus-26-Upgrade-and-Operations" class="common-anchor-header">Preguntas frecuentes sobre la actualización y el funcionamiento de Milvus 2.6<button data-href="#FAQ-on-Milvus-26-Upgrade-and-Operations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Q1-Milvus-Helm-vs-Milvus-Operator--which-one-should-I-use" class="common-anchor-header">P1: Milvus Helm vs. Milvus Operator - ¿cuál debería usar?</h3><p>Para entornos de producción, se recomienda encarecidamente Milvus Operator.</p>
<p>Consulte la guía oficial para más detalles: <a href="https://github.com/zilliztech/milvus-operator?tab=readme-ov-file#milvus-operator-vs-helm">https://github.com/zilliztech/milvus-operator?tab=readme-ov-file#milvus-operator-vs-helm</a></p>
<h3 id="Q2-How-should-I-choose-a-Message-Queue-MQ" class="common-anchor-header">P2: ¿Cómo debo elegir una cola de mensajes (MQ)?</h3><p>La MQ recomendada depende del modo de despliegue y de los requisitos operativos:</p>
<p><strong>1. Modo autónomo:</strong> Para despliegues sensibles a los costes, se recomienda RocksMQ.</p>
<p><strong>2. Modo clúster</strong></p>
<ul>
<li><p><strong>Pulsar</strong> soporta multi-tenancy, permite a grandes clusters compartir infraestructura y ofrece una fuerte escalabilidad horizontal.</p></li>
<li><p><strong>Kafka</strong> tiene un ecosistema más maduro, con ofertas SaaS gestionadas disponibles en la mayoría de las principales plataformas en la nube.</p></li>
</ul>
<p><strong>3. Woodpecker (introducido en Milvus 2.6):</strong> Woodpecker elimina la necesidad de una cola de mensajes externa, reduciendo el coste y la complejidad operativa.</p>
<ul>
<li><p>Actualmente, sólo se admite el modo Woodpecker integrado, que es ligero y fácil de manejar.</p></li>
<li><p>Para las implantaciones independientes de Milvus 2.6, se recomienda el uso de Woodpecker.</p></li>
<li><p>Para los despliegues de clúster de producción, se recomienda utilizar el próximo modo de clúster Woodpecker una vez que esté disponible.</p></li>
</ul>
<h3 id="Q3-Can-the-Message-Queue-be-switched-during-an-upgrade" class="common-anchor-header">P3: ¿Se puede cambiar la cola de mensajes durante una actualización?</h3><p>No. Actualmente no es posible cambiar la cola de mensajes durante una actualización. En futuras versiones se introducirán API de gestión para permitir el cambio entre Pulsar, Kafka, Woodpecker y RocksMQ.</p>
<h3 id="Q4-Do-rate-limiting-configurations-need-to-be-updated-for-Milvus-26" class="common-anchor-header">P4: ¿Es necesario actualizar las configuraciones de limitación de velocidad para Milvus 2.6?</h3><p>No. Las configuraciones de limitación de velocidad existentes siguen siendo efectivas y también se aplican al nuevo Streaming Node. No es necesario realizar ningún cambio.</p>
<h3 id="Q5-After-the-coordinator-merge-do-monitoring-roles-or-configurations-change" class="common-anchor-header">P5: Tras la fusión de coordinadores, ¿cambian las funciones de supervisión o las configuraciones?</h3><ul>
<li><p>Los roles de monitorización permanecen sin cambios (<code translate="no">RootCoord</code>, <code translate="no">QueryCoord</code>, <code translate="no">DataCoord</code>).</p></li>
<li><p>Las opciones de configuración existentes siguen funcionando como antes.</p></li>
<li><p>Se introduce una nueva opción de configuración, <code translate="no">mixCoord.enableActiveStandby</code>, que volverá a <code translate="no">rootcoord.enableActiveStandby</code> si no se establece explícitamente.</p></li>
</ul>
<h3 id="Q6-What-are-the-recommended-resource-settings-for-StreamingNode" class="common-anchor-header">P6: ¿Cuál es la configuración de recursos recomendada para StreamingNode?</h3><ul>
<li><p>Para ingestión ligera en tiempo real o cargas de trabajo ocasionales de escritura y consulta, basta con una configuración pequeña, como 2 núcleos de CPU y 8 GB de memoria.</p></li>
<li><p>Para una ingestión intensa en tiempo real o cargas de trabajo continuas de escritura y consulta, se recomienda asignar recursos comparables a los del Nodo de Consulta.</p></li>
</ul>
<h3 id="Q7-How-do-I-upgrade-a-standalone-deployment-using-Docker-Compose" class="common-anchor-header">P7: ¿Cómo actualizo una implantación independiente que utiliza Docker Compose?</h3><p>Para despliegues autónomos basados en Docker Compose, simplemente actualice la etiqueta de imagen Milvus en <code translate="no">docker-compose.yaml</code>.</p>
<p>Consulte la guía oficial para más detalles: <a href="https://milvus.io/docs/upgrade_milvus_standalone-docker.md">https://milvus.io/docs/upgrade_milvus_standalone-docker.md</a></p>
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
    </button></h2><p>Milvus 2.6 marca una mejora importante tanto en la arquitectura como en las operaciones. Al separar el streaming y el procesamiento por lotes con la introducción de StreamingNode, consolidando los coordinadores en MixCoord y simplificando los roles de los trabajadores, Milvus 2.6 proporciona una base más estable, escalable y fácil de operar para cargas de trabajo vectoriales a gran escala.</p>
<p>Estos cambios arquitectónicos hacen que las actualizaciones, especialmente desde Milvus 2.5, sean más sensibles al orden. Una actualización satisfactoria depende de que se respeten las dependencias de los componentes y las restricciones de disponibilidad temporal. Para entornos de producción, Milvus Operator es el enfoque recomendado, ya que automatiza la secuencia de actualización y reduce el riesgo operativo, mientras que las actualizaciones basadas en Helm son más adecuadas para casos de uso no relacionados con la producción.</p>
<p>Con capacidades de búsqueda mejoradas, tipos de datos más ricos, almacenamiento por niveles y opciones de cola de mensajes mejoradas, Milvus 2.6 está bien posicionado para soportar aplicaciones de IA modernas que requieren ingestión en tiempo real, alto rendimiento de consulta y operaciones eficientes a escala.</p>
<p>¿Tiene alguna pregunta o desea profundizar en alguna característica de la última versión de Milvus? Únase a nuestro<a href="https://discord.com/invite/8uyFbECzPX"> canal de Discord</a> o presente incidencias en<a href="https://github.com/milvus-io/milvus"> GitHub</a>. También puede reservar una sesión individual de 20 minutos para obtener información, orientación y respuestas a sus preguntas a través de<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="More-Resources-about-Milvus-26" class="common-anchor-header">Más recursos sobre Milvus 2.6<button data-href="#More-Resources-about-Milvus-26" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/docs/release_notes.md">Notas de la versión de Milvus 2.6</a></p></li>
<li><p><a href="https://www.youtube.com/watch?v=Guct-UMK8lw&amp;t=157s">Grabación del seminario web de Milvus 2.6: Búsqueda más rápida, menor coste y escalado más inteligente</a></p></li>
<li><p>Blogs de características de Milvus 2.6</p>
<ul>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Presentación de la función de incrustación: Cómo Milvus 2.6 agiliza la vectorización y la búsqueda semántica</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">JSON Shredding en Milvus: Filtrado JSON 88,9 veces más rápido con flexibilidad</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Desbloqueo de la verdadera recuperación a nivel de entidad: Nuevas funciones Array-of-Structs y MAX_SIM en Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot%E2%80%93cold-data-loading.md">Deje de pagar por datos fríos: Reducción de costes en un 80% con la carga de datos en caliente y en frío bajo demanda en el almacenamiento por niveles de Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">Presentación de AISAQ en Milvus: la búsqueda vectorial a escala de miles de millones es 3.200 veces más barata en memoria</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">Optimización de NVIDIA CAGRA en Milvus: un enfoque híbrido GPU-CPU para una indexación más rápida y consultas más baratas</a></p></li>
<li><p><a href="https://milvus.io/blog/milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md">Presentación del índice Ngram de Milvus: Coincidencia de palabras clave y consultas LIKE más rápidas para cargas de trabajo de agentes</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Unificación del filtrado geoespacial y la búsqueda vectorial con campos geométricos y RTREE en Milvus 2.6</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Búsqueda vectorial en el mundo real: cómo filtrar eficazmente sin matar la recuperación</a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Llevar la compresión vectorial al extremo: Cómo Milvus sirve 3 veces más consultas con RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Los puntos de referencia mienten: las bases de datos vectoriales merecen una prueba real</a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Sustituimos Kafka/Pulsar por un Woodpecker para Milvus: esto es lo que ocurrió</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH en Milvus: El arma secreta para luchar contra los duplicados en los datos de entrenamiento LLM</a></p></li>
</ul></li>
</ul>
