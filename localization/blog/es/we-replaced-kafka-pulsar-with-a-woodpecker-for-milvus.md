---
id: we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md
title: >-
  Sustituimos Kafka/Pulsar por un pájaro carpintero para Milvus: esto es lo que
  ocurrió
author: James Luan
date: 2025-05-15T00:00:00.000Z
desc: >-
  Hemos creado Woodpecker, un sistema de WAL nativo de la nube, para sustituir a
  Kafka y Pulsar en Milvus y reducir la complejidad operativa y los costes.
cover: >-
  assets.zilliz.com/We_Replaced_Kafka_Pulsar_with_a_Woodpecker_for_Milvus_Here_s_What_Happened_77e8de27a9.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Replace Kafka, replace Pulsar, messaging queues, Write-Ahead Logging (WAL),
  Milvus vector database
meta_title: |
  We Replaced Kafka/Pulsar with a Woodpecker for Milvus
origin: >-
  https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md
---
<p><strong>TL;DR:</strong> Hemos creado Woodpecker, un sistema de registro de escritura en cabeza (WAL) nativo de la nube, para sustituir a Kafka y Pulsar en Milvus 2.6. ¿El resultado? Operaciones simplificadas, mejor rendimiento y menores costes para nuestra base de datos vectorial Milvus.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/We_Replaced_Kafka_Pulsar_with_a_Woodpecker_for_Milvus_Here_s_What_Happened_77e8de27a9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Starting-Point-When-Message-Queues-No-Longer-Fit" class="common-anchor-header">El punto de partida: Cuando las colas de mensajes ya no encajan<button data-href="#The-Starting-Point-When-Message-Queues-No-Longer-Fit" class="anchor-icon" translate="no">
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
    </button></h2><p>Amábamos y utilizábamos Kafka y Pulsar. Funcionaron hasta que dejaron de hacerlo. A medida que Milvus, la principal base de datos vectorial de código abierto, evolucionaba, descubrimos que estas potentes colas de mensajes ya no satisfacían nuestros requisitos de escalabilidad. Así que dimos un paso audaz: reescribimos la columna vertebral del streaming en Milvus 2.6 e implementamos nuestro propio WAL: <strong>Woodpecker</strong>.</p>
<p>Permítame guiarle a través de nuestro viaje y explicarle por qué hicimos este cambio, que podría parecer contraintuitivo a primera vista.</p>
<h2 id="Cloud-Native-From-Day-One" class="common-anchor-header">Nube nativa desde el primer día<button data-href="#Cloud-Native-From-Day-One" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus ha sido una base de datos vectorial nativa de la nube desde sus inicios. Aprovechamos Kubernetes para el escalado elástico y la recuperación rápida de fallos, junto con soluciones de almacenamiento de objetos como Amazon S3 y MinIO para la persistencia de datos.</p>
<p>Este enfoque basado en la nube ofrece enormes ventajas, pero también presenta algunos retos:</p>
<ul>
<li><p>Los servicios de almacenamiento de objetos en la nube como S3 proporcionan una capacidad prácticamente ilimitada de manejo de rendimientos y disponibilidad, pero con latencias que a menudo superan los 100 ms.</p></li>
<li><p>Los modelos de precios de estos servicios (basados en patrones y frecuencia de acceso) pueden añadir costes inesperados a las operaciones de bases de datos en tiempo real.</p></li>
<li><p>Equilibrar las características nativas de la nube con las exigencias de la búsqueda vectorial en tiempo real introduce importantes retos arquitectónicos.</p></li>
</ul>
<h2 id="The-Shared-Log-Architecture-Our-Foundation" class="common-anchor-header">La arquitectura de registro compartido: Nuestra base<button data-href="#The-Shared-Log-Architecture-Our-Foundation" class="anchor-icon" translate="no">
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
    </button></h2><p>Muchos sistemas de búsqueda vectorial se limitan al procesamiento por lotes porque construir un sistema de streaming en un entorno nativo de la nube presenta retos aún mayores. Por el contrario, Milvus da prioridad a la frescura de los datos en tiempo real e implementa una arquitectura de registro compartido: piense en ella como en un disco duro para un sistema de archivos.</p>
<p>Esta arquitectura de registro compartido proporciona una base crítica que separa los protocolos de consenso de la funcionalidad central de la base de datos. Al adoptar este enfoque, Milvus elimina la necesidad de gestionar directamente complejos protocolos de consenso, lo que nos permite centrarnos en ofrecer excepcionales capacidades de búsqueda vectorial.</p>
<p>No estamos solos en este patrón arquitectónico: bases de datos como AWS Aurora, Azure Socrates y Neon utilizan un diseño similar. <strong>Sin embargo, sigue existiendo un vacío importante en el ecosistema de código abierto: a pesar de las claras ventajas de este enfoque, la comunidad carece de una implementación distribuida de registro de escritura anticipada (WAL) de baja latencia, escalable y rentable.</strong></p>
<p>Las soluciones existentes, como Bookie, resultaron inadecuadas para nuestras necesidades debido a su diseño de cliente pesado y a la ausencia de SDK listos para la producción para Golang y C++. Esta brecha tecnológica nos llevó a nuestro enfoque inicial con colas de mensajes.</p>
<h2 id="Our-Initial-Solution-Message-Queues-as-WAL" class="common-anchor-header">Nuestra solución inicial: Colas de mensajes como WAL<button data-href="#Our-Initial-Solution-Message-Queues-as-WAL" class="anchor-icon" translate="no">
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
    </button></h2><p>Para salvar esta brecha, nuestro enfoque inicial utilizó colas de mensajes (Kafka/Pulsar) como nuestro registro de escritura anticipada (WAL). La arquitectura funcionaba así:</p>
<ul>
<li><p>Todas las actualizaciones entrantes en tiempo real fluyen a través de la cola de mensajes.</p></li>
<li><p>Los escritores reciben confirmación inmediata una vez que es aceptada por la cola de mensajes.</p></li>
<li><p>QueryNode y DataNode procesan estos datos de forma asíncrona, garantizando un alto rendimiento de escritura y manteniendo la frescura de los datos.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_2_0_Architecture_Overview_465f5ba27a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura: Visión general de la arquitectura de Milvus 2.0</p>
<p>Este sistema proporcionaba de forma eficaz una confirmación de escritura inmediata a la vez que permitía el procesamiento asíncrono de los datos, lo que era crucial para mantener el equilibrio entre el rendimiento y la frescura de los datos que esperan los usuarios de Milvus.</p>
<h2 id="Why-We-Needed-Something-Different-for-WAL" class="common-anchor-header">Por qué necesitábamos algo diferente para WAL<button data-href="#Why-We-Needed-Something-Different-for-WAL" class="anchor-icon" translate="no">
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
    </button></h2><p>Con Milvus 2.6, hemos decidido eliminar gradualmente las colas de mensajes externas en favor de Woodpecker, nuestra implementación de WAL nativa en la nube y creada específicamente. No fue una decisión que tomamos a la ligera. Después de todo, habíamos utilizado con éxito Kafka y Pulsar durante años.</p>
<p>El problema no radicaba en estas tecnologías en sí, ya que ambos son sistemas excelentes con potentes funciones. En cambio, el desafío provenía de la creciente complejidad y sobrecarga que estos sistemas externos introducían a medida que Milvus evolucionaba. A medida que nuestros requisitos se hacían más especializados, la brecha entre lo que ofrecían las colas de mensajes de uso general y lo que necesitaba nuestra base de datos vectorial seguía ampliándose.</p>
<p>Tres factores específicos impulsaron en última instancia nuestra decisión de construir un sustituto:</p>
<h3 id="Operational-Complexity" class="common-anchor-header">Complejidad operativa</h3><p>Las dependencias externas como Kafka o Pulsar exigen máquinas dedicadas con múltiples nodos y una gestión cuidadosa de los recursos. Esto crea varios retos:</p>
<ul>
<li>Mayor complejidad operativa</li>
</ul>
<ul>
<li>Curvas de aprendizaje más pronunciadas para los administradores de sistemas</li>
</ul>
<ul>
<li>Mayor riesgo de errores de configuración y vulnerabilidades de seguridad</li>
</ul>
<h3 id="Architectural-Constraints" class="common-anchor-header">Restricciones arquitectónicas</h3><p>Las colas de mensajes como Kafka tienen limitaciones inherentes en cuanto al número de temas admitidos. Desarrollamos VShard como solución para compartir temas entre componentes, pero esta solución, aunque abordaba eficazmente las necesidades de escalado, introducía una complejidad arquitectónica significativa.</p>
<p>Estas dependencias externas dificultaban la implementación de funciones críticas, como la recolección de basura de registros, y aumentaban las fricciones de integración con otros módulos del sistema. Con el tiempo, el desajuste arquitectónico entre las colas de mensajes de uso general y las demandas específicas de alto rendimiento de una base de datos vectorial se hizo cada vez más evidente, lo que nos llevó a reconsiderar nuestras opciones de diseño.</p>
<h3 id="Resource-Inefficiency" class="common-anchor-header">Ineficiencia de recursos</h3><p>Garantizar una alta disponibilidad con sistemas como Kafka y Pulsar suele exigir</p>
<ul>
<li><p>Despliegue distribuido en múltiples nodos</p></li>
<li><p>Asignación sustancial de recursos incluso para cargas de trabajo pequeñas</p></li>
<li><p>Almacenamiento para señales efímeras (como Timetick de Milvus), que en realidad no requieren retención a largo plazo.</p></li>
</ul>
<p>Sin embargo, estos sistemas carecen de la flexibilidad necesaria para eludir la persistencia de dichas señales transitorias, lo que conlleva operaciones de E/S y un uso del almacenamiento innecesarios. Esto conlleva una sobrecarga de recursos desproporcionada y un aumento de los costes, especialmente en entornos de menor escala o con recursos limitados.</p>
<h2 id="Introducing-Woodpecker---A-Cloud-Native-High-Performance-WAL-Engine" class="common-anchor-header">Presentación de Woodpecker: un motor WAL nativo de la nube y de alto rendimiento<button data-href="#Introducing-Woodpecker---A-Cloud-Native-High-Performance-WAL-Engine" class="anchor-icon" translate="no">
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
    </button></h2><p>En Milvus 2.6, hemos sustituido Kafka/Pulsar por <strong>Woodpecker</strong>, un sistema WAL nativo de la nube creado específicamente. Diseñado para el almacenamiento de objetos, Woodpecker simplifica las operaciones al tiempo que aumenta el rendimiento y la escalabilidad.</p>
<p>Woodpecker se ha creado desde cero para maximizar el potencial del almacenamiento nativo de la nube, con un objetivo concreto: convertirse en la solución de WAL de mayor rendimiento optimizada para entornos de nube, al tiempo que ofrece las funciones básicas necesarias para un registro de escritura anticipada de solo apéndice.</p>
<h3 id="The-Zero-Disk-Architecture-for-Woodpecker" class="common-anchor-header">La arquitectura de disco cero de Woodpecker</h3><p>La principal innovación de Woodpecker es su <strong>arquitectura de disco cero</strong>:</p>
<ul>
<li><p>Todos los datos de registro se almacenan en almacenamiento de objetos en la nube (como Amazon S3, Google Cloud Storage o Alibaba OS).</p></li>
<li><p>Metadatos gestionados a través de almacenes de valores clave distribuidos como etcd</p></li>
<li><p>Sin dependencia del disco local para las operaciones principales</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Woodpecker_Architecture_cc31e15ed9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura:  Visión general de la arquitectura de Woodpecker</p>
<p>Este enfoque reduce drásticamente la sobrecarga operativa al tiempo que maximiza la durabilidad y la eficiencia de la nube. Al eliminar las dependencias del disco local, Woodpecker se alinea perfectamente con los principios nativos de la nube y reduce significativamente la carga operativa de los administradores del sistema.</p>
<h3 id="Performance-Benchmarks-Exceeding-Expectations" class="common-anchor-header">Benchmarks de rendimiento: Superando las expectativas</h3><p>Ejecutamos pruebas comparativas exhaustivas para evaluar el rendimiento de Woodpecker en una configuración de nodo único, cliente único y flujo de registro único. Los resultados fueron impresionantes en comparación con Kafka y Pulsar:</p>
<table>
<thead>
<tr><th><strong>Sistema</strong></th><th><strong>Kafka</strong></th><th><strong>Pulsar</strong></th><th><strong>WP MinIO</strong></th><th><strong>WP Local</strong></th><th><strong>WP S3</strong></th></tr>
</thead>
<tbody>
<tr><td>Rendimiento</td><td>129,96 MB/s</td><td>107 MB/s</td><td>71 MB/s</td><td>450 MB/s</td><td>750 MB/s</td></tr>
<tr><td>Latencia</td><td>58 ms</td><td>35 ms</td><td>184 ms</td><td>1,8 ms</td><td>166 ms</td></tr>
</tbody>
</table>
<p>Para contextualizar, hemos medido los límites teóricos de rendimiento de distintos backends de almacenamiento en nuestra máquina de pruebas:</p>
<ul>
<li><p><strong>MinIO</strong>: ~110 MB/s</p></li>
<li><p><strong>Sistema de archivos local</strong>: 600-750 MB/s</p></li>
<li><p><strong>Amazon S3 (instancia EC2 única)</strong>: hasta 1,1 GB/s</p></li>
</ul>
<p>Sorprendentemente, Woodpecker alcanzó sistemáticamente el 60-80% del rendimiento máximo posible para cada backend, un nivel de eficiencia excepcional para el middleware.</p>
<h4 id="Key-Performance-Insights" class="common-anchor-header">Principales datos de rendimiento</h4><ol>
<li><p><strong>Modo de sistema de archivos local</strong>: Woodpecker alcanzó 450 MB/s -3,5 veces más rápido que Kafka y 4,2 veces más rápido que Pulsar- con una latencia ultrabaja de tan solo 1,8 ms, lo que lo hace ideal para implantaciones de un solo nodo de alto rendimiento.</p></li>
<li><p><strong>Modo de almacenamiento en la nube (S3)</strong>: Al escribir directamente en S3, Woodpecker alcanzó 750 MB/s (alrededor del 68% del límite teórico de S3), 5,8 veces más que Kafka y 7 veces más que Pulsar. Aunque la latencia es mayor (166 ms), esta configuración proporciona un rendimiento excepcional para cargas de trabajo por lotes.</p></li>
<li><p><strong>Modo de almacenamiento de objetos (MinIO)</strong>: Incluso con MinIO, Woodpecker alcanzó 71 MB/s, alrededor del 65% de la capacidad de MinIO. Este rendimiento es comparable al de Kafka y Pulsar, pero con unos requisitos de recursos significativamente menores.</p></li>
</ol>
<p>Woodpecker está especialmente optimizado para escrituras concurrentes de gran volumen en las que es fundamental mantener el orden. Y estos resultados sólo reflejan las primeras fases de desarrollo: se espera que las optimizaciones en curso de la fusión de E/S, el almacenamiento en búfer inteligente y la precarga lleven el rendimiento aún más cerca de los límites teóricos.</p>
<h3 id="Design-Goals" class="common-anchor-header">Objetivos de diseño</h3><p>Woodpecker aborda las demandas cambiantes de las cargas de trabajo de búsqueda vectorial en tiempo real a través de estos requisitos técnicos clave:</p>
<ul>
<li><p>ingestión de datos de alto rendimiento con persistencia duradera en toda la zona de disponibilidad</p></li>
<li><p>Lecturas de cola de baja latencia para suscripciones en tiempo real y lecturas de recuperación de alto rendimiento para la recuperación de fallos.</p></li>
<li><p>Backends de almacenamiento conectables, incluido el almacenamiento de objetos en la nube y los sistemas de archivos compatibles con el protocolo NFS.</p></li>
<li><p>Opciones de despliegue flexibles, compatibles tanto con configuraciones independientes ligeras como con clústeres a gran escala para despliegues Milvus multiusuario.</p></li>
</ul>
<h3 id="Architecture-Components" class="common-anchor-header">Componentes de la arquitectura</h3><p>Un despliegue estándar de Woodpecker incluye los siguientes componentes.</p>
<ul>
<li><p><strong>Client</strong> - Capa de interfaz para emitir solicitudes de lectura y escritura</p></li>
<li><p><strong>LogStore</strong>: gestiona el almacenamiento en búfer de escritura de alta velocidad, las cargas asíncronas al almacenamiento y la compactación de registros.</p></li>
<li><p><strong>Backend de almacenamiento</strong>: admite servicios de almacenamiento escalables y de bajo coste como S3, GCS y sistemas de archivos como EFS.</p></li>
<li><p><strong>ETCD</strong>: almacena metadatos y coordina el estado de los registros en nodos distribuidos.</p></li>
</ul>
<h3 id="Flexible-Deployments-to-Match-Your-Specific-Needs" class="common-anchor-header">Implementaciones flexibles para satisfacer sus necesidades específicas</h3><p>Woodpecker ofrece dos modos de despliegue para adaptarse a sus necesidades específicas:</p>
<p><strong>Modo MemoryBuffer - Ligero y sin mantenimiento</strong></p>
<p>El modo MemoryBuffer proporciona una opción de despliegue sencilla y ligera en la que Woodpecker almacena temporalmente las escrituras entrantes en la memoria y las descarga periódicamente en un servicio de almacenamiento de objetos en la nube. Los metadatos se gestionan mediante etcd para garantizar la coherencia y la coordinación. Este modo es el más adecuado para cargas de trabajo de lotes pesados en implantaciones a pequeña escala o entornos de producción que priorizan la simplicidad sobre el rendimiento, especialmente cuando la baja latencia de escritura no es crítica.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_memory_Buffer_Mode_3429d693a1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: El modo memoryBuffer</em></p>
<p><strong>Modo QuorumBuffer - Optimizado para despliegues de baja latencia y alta durabilidad</strong></p>
<p>El modo QuorumBuffer está diseñado para cargas de trabajo de lectura/escritura sensibles a la latencia y de alta frecuencia que requieren tanto capacidad de respuesta en tiempo real como una fuerte tolerancia a fallos. En este modo, el Woodpecker funciona como un búfer de escritura de alta velocidad con escrituras de quórum de tres réplicas, lo que garantiza una gran coherencia y alta disponibilidad.</p>
<p>Una escritura se considera correcta cuando se replica en al menos dos de los tres nodos, y normalmente se completa en milisegundos de un solo dígito, tras lo cual los datos se vuelcan de forma asíncrona al almacenamiento de objetos en la nube para una durabilidad a largo plazo. Esta arquitectura minimiza el estado en el nodo, elimina la necesidad de grandes volúmenes de disco locales y evita las complejas reparaciones antientropía que suelen requerir los sistemas tradicionales basados en quórum.</p>
<p>El resultado es una capa de WAL racionalizada y robusta, ideal para entornos de producción de misión crítica en los que la coherencia, la disponibilidad y la recuperación rápida son esenciales.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_The_Quorum_Buffer_Mode_72573dc666.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: El modo QuorumBuffer</em></p>
<h2 id="StreamingService-Built-for-Real-Time-Data-Flow" class="common-anchor-header">StreamingService: Creado para el flujo de datos en tiempo real<button data-href="#StreamingService-Built-for-Real-Time-Data-Flow" class="anchor-icon" translate="no">
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
    </button></h2><p>Además de Woodpecker, Milvus 2.6 introduce <strong>StreamingService, un</strong>componente especializado diseñado para la gestión de registros, la ingestión de registros y la suscripción de datos de flujo.</p>
<p>Para entender cómo funciona nuestra nueva arquitectura, es importante aclarar la relación entre estos dos componentes:</p>
<ul>
<li><p><strong>Woodpecker</strong> es la capa de almacenamiento que gestiona la persistencia real de los registros de escritura anticipada, proporcionando durabilidad y fiabilidad.</p></li>
<li><p><strong>StreamingService</strong> es la capa de servicio que gestiona las operaciones de registro y proporciona capacidades de transmisión de datos en tiempo real.</p></li>
</ul>
<p>Juntos, constituyen un sustituto completo de las colas de mensajes externas. Woodpecker proporciona la base de almacenamiento duradero, mientras que StreamingService ofrece la funcionalidad de alto nivel con la que interactúan directamente las aplicaciones. Esta separación de intereses permite optimizar cada componente para su función específica, a la vez que funcionan perfectamente juntos como un sistema integrado.</p>
<h3 id="Adding-Streaming-Service-to-Milvus-26" class="common-anchor-header">Añadir Streaming Service a Milvus 2.6</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_2_6_Architecture_Overview_238428c58f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura: Servicio de streaming añadido a la arquitectura de Milvus 2.6</p>
<p>El Servicio de Streaming está formado por tres componentes principales:</p>
<p><strong>Coordinador de Streaming</strong></p>
<ul>
<li><p>Descubre los nodos de transmisión disponibles supervisando las sesiones ETCD de Milvus.</p></li>
<li><p>Gestiona el estado de los WAL y recopila métricas de equilibrio de carga a través del ManagerService</p></li>
</ul>
<p><strong>Cliente de streaming</strong></p>
<ul>
<li><p>Consulta el AssignmentService para determinar la distribución de los segmentos de WAL entre los nodos de streaming.</p></li>
<li><p>Realiza operaciones de lectura/escritura a través del HandlerService en el Nodo de Transmisión apropiado.</p></li>
</ul>
<p><strong>Nodo de transmisión</strong></p>
<ul>
<li><p>Gestiona las operaciones reales de WAL y proporciona funciones de publicación y suscripción para la transmisión de datos en tiempo real.</p></li>
<li><p>Incluye el <strong>ManagerService</strong> para la administración de la WAL y la generación de informes de rendimiento</p></li>
<li><p>Incluye el <strong>HandlerService</strong> que implementa mecanismos eficientes de publicación-suscripción para entradas WAL</p></li>
</ul>
<p>Esta arquitectura en capas permite a Milvus mantener una clara separación entre la funcionalidad de streaming (suscripción, procesamiento en tiempo real) y los mecanismos de almacenamiento reales. Woodpecker gestiona el "cómo" del almacenamiento de registros, mientras que StreamingService gestiona el "qué" y el "cuándo" de las operaciones de registro.</p>
<p>Como resultado, el Streaming Service mejora significativamente las capacidades en tiempo real de Milvus al introducir el soporte nativo de suscripción, eliminando la necesidad de colas de mensajes externas. Reduce el consumo de memoria al consolidar las cachés previamente duplicadas en las rutas de consulta y datos, disminuye la latencia de las lecturas fuertemente coherentes al eliminar los retrasos de sincronización asíncrona y mejora tanto la escalabilidad como la velocidad de recuperación en todo el sistema.</p>
<h2 id="Conclusion---Streaming-on-a-Zero-Disk-Architecture" class="common-anchor-header">Conclusión - Streaming en una arquitectura de disco cero<button data-href="#Conclusion---Streaming-on-a-Zero-Disk-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Gestionar el estado es difícil. Los sistemas con estado a menudo sacrifican la elasticidad y la escalabilidad. La respuesta cada vez más aceptada en el diseño nativo de la nube es desacoplar el estado del cálculo, permitiendo que cada uno escale de forma independiente.</p>
<p>En lugar de reinventar la rueda, delegamos la complejidad del almacenamiento duradero y escalable en los equipos de ingeniería de primer nivel que están detrás de servicios como AWS S3, Google Cloud Storage y MinIO. Entre ellos, S3 destaca por su capacidad prácticamente ilimitada, once nueves (99,999999999%) de durabilidad, 99,99% de disponibilidad y rendimiento de lectura/escritura de alto rendimiento.</p>
<p>Pero incluso las arquitecturas de "disco cero" tienen ventajas y desventajas. Los almacenes de objetos siguen luchando contra la alta latencia de escritura y la ineficacia de los archivos pequeños, limitaciones que siguen sin resolverse en muchas cargas de trabajo en tiempo real.</p>
<p>Para las bases de datos vectoriales, especialmente las que soportan cargas de trabajo de misión crítica como RAG, agentes de inteligencia artificial y búsquedas de baja latencia, el acceso en tiempo real y las escrituras rápidas no son negociables. Por eso hemos rediseñado Milvus en torno a Woodpecker y Streaming Service. Este cambio simplifica el sistema en general (seamos realistas: nadie quiere mantener una pila Pulsar completa dentro de una base de datos vectorial), garantiza datos más frescos, mejora la rentabilidad y acelera la recuperación en caso de fallo.</p>
<p>Creemos que Woodpecker es algo más que un componente de Milvus: puede servir de base para otros sistemas nativos de la nube. A medida que evoluciona la infraestructura de la nube, innovaciones como S3 Express pueden acercarnos aún más al ideal: durabilidad entre zonas geográficas con latencia de escritura de un milisegundo.</p>
<h2 id="Getting-Started-with-Milvus-26" class="common-anchor-header">Primeros pasos con Milvus 2.6<button data-href="#Getting-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 ya está disponible. Además de Woodpecker, introduce docenas de nuevas funciones y optimizaciones de rendimiento, como el almacenamiento por niveles, el método de cuantificación RabbitQ y la búsqueda de texto completo y multitenencia mejoradas, que abordan directamente los retos más acuciantes de la búsqueda vectorial actual: escalar de forma eficiente manteniendo los costes bajo control.</p>
<p>¿Listo para explorar todo lo que ofrece Milvus? Sumérjase en nuestras<a href="https://milvus.io/docs/release_notes.md"> notas de la versión</a>, consulte la<a href="https://milvus.io/docs"> documentación completa</a> o eche un vistazo a nuestros<a href="https://milvus.io/blog"> blogs de funciones</a>.</p>
<p>¿Tiene alguna pregunta? También le invitamos a unirse a nuestra <a href="https://discord.com/invite/8uyFbECzPX">comunidad Discord</a> o a presentar una incidencia en<a href="https://github.com/milvus-io/milvus"> GitHub</a>: estamos aquí para ayudarle a sacar el máximo partido de Milvus 2.6.</p>
