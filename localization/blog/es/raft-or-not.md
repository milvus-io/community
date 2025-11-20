---
id: raft-or-not.md
title: >-
  ¿Balsa o no? La mejor solución para la coherencia de datos en bases de datos
  nativas de la nube
author: Xiaofan Luan
date: 2022-05-16T00:00:00.000Z
desc: >-
  ¿Por qué el algoritmo de replicación basado en el consenso no es la panacea
  para lograr la coherencia de los datos en las bases de datos distribuidas?
cover: assets.zilliz.com/Tech_Modify_5_e18025ffbc.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/raft-or-not.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Tech_Modify_5_e18025ffbc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Imagen de portada</span> </span></p>
<blockquote>
<p>Este artículo ha sido escrito por <a href="https://github.com/xiaofan-luan">Xiaofan Luan</a> y transcrito por <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>La replicación basada en el consenso es una estrategia ampliamente adoptada en muchas bases de datos distribuidas nativas de la nube. Sin embargo, tiene ciertas deficiencias y definitivamente no es la bala de plata.</p>
<p>El objetivo de este artículo es explicar los conceptos de replicación, consistencia y consenso en una base de datos distribuida y nativa de la nube, aclarar por qué los algoritmos basados en el consenso como Paxos y Raft no son la panacea y, por último, proponer una <a href="#a-log-replication-strategy-for-cloud-native-and-distributed-database">solución a la replicación basada en el consenso</a>.</p>
<p><strong>Ir a:</strong></p>
<ul>
<li><a href="#Understanding-replication-consistency-and-consensus">Comprender la replicación, la consistencia y el consenso</a></li>
<li><a href="#Consensus-based-replication">Replicación basada en el consenso</a></li>
<li><a href="#A-log-replication-strategy-for-cloud-native-and-distributed-database">Una estrategia de replicación de registros para bases de datos distribuidas y nativas de la nube</a></li>
<li><a href="#Summary">Resumen</a></li>
</ul>
<h2 id="Understanding-replication-consistency-and-consensus" class="common-anchor-header">Comprender la replicación, la consistencia y el consenso<button data-href="#Understanding-replication-consistency-and-consensus" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de profundizar en los pros y contras de Paxos y Raft, y proponer la estrategia de replicación de logs más adecuada, necesitamos desmitificar los conceptos de replicación, consistencia y consenso.</p>
<p>Nótese que este artículo se centra principalmente en la sincronización de datos/logs incrementales. Por lo tanto, cuando se habla de replicación de datos/logs, sólo se hace referencia a la replicación de datos incrementales, no de datos históricos.</p>
<h3 id="Replication" class="common-anchor-header">Replicación</h3><p>La replicación es el proceso de hacer múltiples copias de datos y almacenarlas en diferentes discos, procesos, máquinas, clusters, etc, con el propósito de aumentar la fiabilidad de los datos y acelerar las consultas de datos. Dado que en la replicación los datos se copian y almacenan en múltiples ubicaciones, los datos son más fiables frente a la recuperación de fallos de disco, fallos de máquinas físicas o errores de clúster. Además, las réplicas múltiples de datos pueden aumentar el rendimiento de una base de datos distribuida al acelerar enormemente las consultas.</p>
<p>Existen varios modos de replicación, como la replicación síncrona/asíncrona, la replicación con consistencia fuerte/eventual, la replicación líder-seguidor/descentralizada. La elección del modo de replicación influye en la disponibilidad y la coherencia del sistema. Por lo tanto, tal y como se propone en el famoso <a href="https://medium.com/analytics-vidhya/cap-theorem-in-distributed-system-and-its-tradeoffs-d8d981ecf37e">teorema CAP</a>, un arquitecto de sistemas debe elegir entre consistencia y disponibilidad cuando la partición de la red es inevitable.</p>
<h3 id="Consistency" class="common-anchor-header">Consistencia</h3><p>En resumen, la consistencia en una base de datos distribuida se refiere a la propiedad que asegura que cada nodo o réplica tiene la misma visión de los datos cuando escribe o lee datos en un momento dado. Para una lista completa de niveles de consistencia, lee el documento <a href="https://docs.microsoft.com/en-us/azure/cosmos-db/consistency-levels">aquí</a>.</p>
<p>Para aclarar, aquí estamos hablando de consistencia como en el teorema CAP, no ACID (atomicidad, consistencia, aislamiento, durabilidad). La consistencia en el teorema CAP se refiere a que cada nodo del sistema tenga los mismos datos, mientras que la consistencia en ACID se refiere a que un único nodo aplique las mismas reglas en cada commit potencial.</p>
<p>Por lo general, las bases de datos OLTP (procesamiento de transacciones en línea) requieren una fuerte consistencia o linealidad para garantizar que:</p>
<ul>
<li>Cada lectura pueda acceder a los últimos datos insertados.</li>
<li>Si se devuelve un nuevo valor después de una lectura, todas las lecturas siguientes, independientemente de que se realicen en el mismo cliente o en clientes diferentes, deben devolver el nuevo valor.</li>
</ul>
<p>La esencia de la linearizabilidad es garantizar la recencia de múltiples réplicas de datos - una vez que un nuevo valor es escrito o leído, todas las lecturas posteriores pueden ver el nuevo valor hasta que el valor sea sobrescrito posteriormente. Un sistema distribuido que ofrezca linealidad puede ahorrar a los usuarios la molestia de vigilar múltiples réplicas y puede garantizar la atomicidad y el orden de cada operación.</p>
<h3 id="Consensus" class="common-anchor-header">Consenso</h3><p>El concepto de consenso se introduce en los sistemas distribuidos porque los usuarios desean que los sistemas distribuidos funcionen del mismo modo que los sistemas autónomos.</p>
<p>Para simplificarlo, el consenso es un acuerdo general sobre un valor. Por ejemplo, Steve y Frank querían comer algo. Steve sugirió comer sándwiches. Frank acepta la sugerencia de Steve y ambos comen sándwiches. Han llegado a un consenso. Más concretamente, un valor (sándwiches) propuesto por uno de ellos es acordado por ambos, y ambos realizan acciones basadas en el valor. Del mismo modo, el consenso en un sistema distribuido significa que cuando un proceso propone un valor, todos los demás procesos del sistema lo aceptan y actúan en consecuencia.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2bb46e57_9eb5_456e_be7e_e7762aa9eb7e_68dd2e8e65.png" alt="Consensus" class="doc-image" id="consensus" />
   </span> <span class="img-wrapper"> <span>Consenso</span> </span></p>
<h2 id="Consensus-based-replication" class="common-anchor-header">Replicación basada en el consenso<button data-href="#Consensus-based-replication" class="anchor-icon" translate="no">
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
    </button></h2><p>Los primeros algoritmos basados en el consenso se propusieron junto con la <a href="https://pmg.csail.mit.edu/papers/vr.pdf">replicación con sello de vista</a> en 1988. En 1989, Leslie Lamport propuso <a href="https://lamport.azurewebsites.net/pubs/paxos-simple.pdf">Paxos</a>, un algoritmo basado en el consenso.</p>
<p>En los últimos años, hemos sido testigos de otro algoritmo basado en el consenso que ha prevalecido en la industria: <a href="https://raft.github.io/">Raft</a>. Ha sido adoptado por muchas bases de datos NewSQL como CockroachDB, TiDB, OceanBase, etc.</p>
<p>En particular, un sistema distribuido no es necesariamente linealizable aunque adopte la replicación basada en el consenso. Sin embargo, la linealidad es un requisito previo para crear una base de datos distribuida ACID.</p>
<p>Al diseñar un sistema de base de datos, debe tenerse en cuenta el orden de confirmación de los registros y las máquinas de estado. También es necesario tomar precauciones adicionales para mantener el arrendamiento líder de Paxos o Raft y evitar una división del cerebro en caso de partición de la red.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://user-images.githubusercontent.com/1500781/165926429-69b5144c-f3ba-4819-87c3-ab7e04a7e22e.png" alt="Raft replication state machine" class="doc-image" id="raft-replication-state-machine" />
   </span> <span class="img-wrapper"> <span>Máquina de estado de replicación Raft</span> </span></p>
<h3 id="Pros-and-cons" class="common-anchor-header">Ventajas e inconvenientes</h3><p>De hecho, Raft, ZAB y <a href="https://aws.amazon.com/blogs/database/amazon-aurora-under-the-hood-quorum-and-correlated-failure/">el protocolo de registro basado en quórum</a> de Aurora son variaciones de Paxos. La replicación basada en el consenso tiene las siguientes ventajas:</p>
<ol>
<li>Aunque la replicación basada en el consenso se centra más en la consistencia y la partición de la red en el teorema CAP, proporciona una disponibilidad relativamente mejor en comparación con la replicación tradicional líder-seguidor.</li>
<li>Raft es un gran avance que ha simplificado enormemente los algoritmos basados en el consenso. Y hay muchas bibliotecas Raft de código abierto en GitHub (por ejemplo, <a href="https://github.com/sofastack/sofa-jraft">sofa-jraft</a>).</li>
<li>El rendimiento de la replicación basada en el consenso puede satisfacer la mayoría de las aplicaciones y empresas. Con la cobertura de SSD de alto rendimiento y NIC (tarjeta de interfaz de red) de gigabyte, se alivia la carga de sincronizar múltiples réplicas, lo que convierte a los algoritmos Paxos y Raft en la corriente principal de la industria.</li>
</ol>
<p>Una idea errónea es que la replicación basada en el consenso es la panacea para lograr la coherencia de los datos en una base de datos distribuida. Sin embargo, esto no es cierto. Los problemas de disponibilidad, complejidad y rendimiento a los que se enfrenta el algoritmo basado en el consenso impiden que sea la solución perfecta.</p>
<ol>
<li><p>Disponibilidad comprometida El algoritmo optimizado Paxos o Raft tiene una fuerte dependencia de la réplica líder, que viene acompañada de una débil capacidad para luchar contra los fallos grises. En la replicación basada en el consenso, una nueva elección de la réplica líder no tendrá lugar hasta que el nodo líder no responda durante un largo periodo de tiempo. Por lo tanto, la replicación basada en consenso es incapaz de manejar situaciones en las que el nodo líder es lento o se produce un thrashing.</p></li>
<li><p>Alta complejidad Aunque ya existen muchos algoritmos extendidos basados en Paxos y Raft, la aparición de <a href="http://www.vldb.org/pvldb/vol13/p3072-huang.pdf">Multi-Raft</a> y <a href="https://www.vldb.org/pvldb/vol11/p1849-cao.pdf">Parallel Ra</a> ft requiere más consideraciones y pruebas sobre la sincronización entre registros y máquinas de estado.</p></li>
<li><p>Rendimiento comprometido En una era nativa de la nube, el almacenamiento local se sustituye por soluciones de almacenamiento compartido como EBS y S3 para garantizar la fiabilidad y coherencia de los datos. Como resultado, la replicación basada en el consenso ya no es una necesidad para los sistemas distribuidos. Es más, la replicación basada en consenso viene con el problema de la redundancia de datos, ya que tanto la solución como EBS tienen múltiples réplicas.</p></li>
</ol>
<p>Para la replicación en múltiples centros de datos y múltiples nubes, la búsqueda de la coherencia compromete no sólo la disponibilidad, sino también <a href="https://en.wikipedia.org/wiki/PACELC_theorem">la latencia</a>, lo que se traduce en una disminución del rendimiento. Por lo tanto, la linealidad no es imprescindible para la tolerancia a desastres en múltiples centros de datos en la mayoría de las aplicaciones.</p>
<h2 id="A-log-replication-strategy-for-cloud-native-and-distributed-database" class="common-anchor-header">Una estrategia de replicación de logs para bases de datos distribuidas y nativas de la nube<button data-href="#A-log-replication-strategy-for-cloud-native-and-distributed-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Es innegable que los algoritmos basados en el consenso, como Raft y Paxos, siguen siendo los principales algoritmos adoptados por muchas bases de datos OLTP. Sin embargo, observando los ejemplos del protocolo <a href="https://www.microsoft.com/en-us/research/publication/pacifica-replication-in-log-based-distributed-storage-systems/">PacificA</a>, <a href="https://www.microsoft.com/en-us/research/uploads/prod/2019/05/socrates.pdf">Socrates</a> y <a href="https://rockset.com/">Rockset</a>, podemos ver que la tendencia está cambiando.</p>
<p>Hay dos principios fundamentales para una solución que pueda servir mejor a una base de datos distribuida y nativa de la nube.</p>
<h3 id="1-Replication-as-a-service" class="common-anchor-header">1. La replicación como servicio</h3><p>Se necesita un microservicio independiente dedicado a la sincronización de datos. El módulo de sincronización y el módulo de almacenamiento ya no deben estar estrechamente acoplados dentro del mismo proceso.</p>
<p>Por ejemplo, Sócrates desacopla el almacenamiento, el registro y la computación. Hay un servicio de registro dedicado (servicio XLog en el centro de la figura siguiente).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_0d7822a781.png" alt="Socrates architecture" class="doc-image" id="socrates-architecture" />
   </span> <span class="img-wrapper"> <span>Arquitectura de Sócrates</span> </span></p>
<p>El servicio XLog es un servicio individual. La persistencia de los datos se consigue con la ayuda de un almacenamiento de baja latencia. La zona de aterrizaje en Sócrates se encarga de mantener tres réplicas a una velocidad acelerada.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_6d1182b6f1.png" alt="Socrates XLog service" class="doc-image" id="socrates-xlog-service" />
   </span> <span class="img-wrapper"> <span>Servicio XLog de Sócrates</span> </span></p>
<p>El nodo líder distribuye los logs a log broker de forma asíncrona, y descarga los datos a Xstore. La caché SSD local puede acelerar la lectura de datos. Una vez que la descarga de datos se realiza correctamente, los búferes de la zona de aterrizaje pueden limpiarse. Obviamente, todos los datos de registro se dividen en tres capas: zona de aterrizaje, SSD local y XStore.</p>
<h3 id="2-Russian-doll-principle" class="common-anchor-header">2. Principio de la muñeca rusa</h3><p>Una forma de diseñar un sistema es seguir el principio de la muñeca rusa: cada capa está completa y perfectamente adaptada a lo que hace para que otras capas puedan construirse sobre ella o a su alrededor.</p>
<p>Al diseñar una base de datos nativa de la nube, tenemos que aprovechar inteligentemente otros servicios de terceros para reducir la complejidad de la arquitectura del sistema.</p>
<p>Parece que con Paxos no podemos evitar el fallo de punto único. Sin embargo, aún podemos simplificar en gran medida la replicación de registros pasando la elección del líder a los servicios Raft o Paxos basados en <a href="https://research.google.com/archive/chubby-osdi06.pdf">Chubby</a>, <a href="https://github.com/bloomreach/zk-replicator">Zk</a> y <a href="https://etcd.io/">etcd</a>.</p>
<p>Por ejemplo, la arquitectura de <a href="https://rockset.com/">Rockset</a> sigue el principio de la muñeca rusa y utiliza Kafka/Kineses para los registros distribuidos, S3 para el almacenamiento y una caché SSD local para mejorar el rendimiento de las consultas.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://user-images.githubusercontent.com/1500781/165926697-c8b380dc-d71a-41a9-a76d-a261b77f0b5d.png" alt="Rockset architecture" class="doc-image" id="rockset-architecture" />
   </span> <span class="img-wrapper"> <span>Arquitectura de Rockset</span> </span></p>
<h3 id="The-Milvus-approach" class="common-anchor-header">El enfoque Milvus</h3><p>La consistencia ajustable en Milvus es, de hecho, similar a las lecturas seguidas en la replicación basada en el consenso. La función de lecturas seguidas se refiere al uso de réplicas seguidas para realizar tareas de lectura de datos bajo la premisa de una consistencia fuerte. El objetivo es mejorar el rendimiento del clúster y reducir la carga del líder. El mecanismo que subyace a la función de lectura de seguidores consiste en consultar el índice de confirmación del último registro y proporcionar un servicio de consulta hasta que todos los datos del índice de confirmación se apliquen a las máquinas de estado.</p>
<p>Sin embargo, el diseño de Milvus no adopta la estrategia de seguimiento. En otras palabras, Milvus no consulta el índice de confirmación cada vez que recibe una solicitud de consulta. En su lugar, Milvus adopta un mecanismo como la marca de agua en <a href="https://flink.apache.org/">Flink</a>, que notifica al nodo de consulta la ubicación del índice de commit a intervalos regulares. La razón de este mecanismo es que los usuarios de Milvus no suelen tener una gran demanda de consistencia de datos, y pueden aceptar un compromiso en la visibilidad de los datos para un mejor rendimiento del sistema.</p>
<p>Además, Milvus también adopta múltiples microservicios y separa el almacenamiento de la computación. En la <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-bare-bones-skeleton-of-the-Milvus-architecture">arquitectura</a> de Milvus, S3, MinIo y Azure Blob se utilizan para el almacenamiento.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_b7743a4a7f.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Arquitectura Milvus</span> </span></p>
<h2 id="Summary" class="common-anchor-header">Resumen<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>En la actualidad, un número cada vez mayor de bases de datos nativas de la nube están haciendo de la replicación de logs un servicio individual. Al hacerlo, se puede reducir el coste de añadir réplicas de solo lectura y replicación heterogénea. El uso de múltiples microservicios permite una rápida utilización de la infraestructura madura basada en la nube, lo que es imposible para las bases de datos tradicionales. Un servicio de registro individual puede confiar en la replicación basada en el consenso, pero también puede seguir la estrategia de la muñeca rusa para adoptar varios protocolos de consistencia junto con Paxos o Raft para lograr la linealidad.</p>
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
    </button></h2><ul>
<li>Lamport L. Paxos simplificado[J]. ACM SIGACT News (Distributed Computing Column) 32, 4 (Número entero 121, diciembre de 2001), 2001: 51-58.</li>
<li>Ongaro D, Ousterhout J. En busca de un algoritmo de consenso comprensible[C]//2014 USENIX Annual Technical Conference (Usenix ATC 14). 2014: 305-319.</li>
<li>Oki B M, Liskov B H. Replicación Viewstamped: A new primary copy method to support highly-available distributed systems[C]//Proceedings of the seventh annual ACM Symposium on Principles of distributed computing. 1988: 8-17.</li>
<li>Lin W, Yang M, Zhang L, et al. PacificA: Replication in log-based distributed storage systems[J]. 2008.</li>
<li>Verbitski A, Gupta A, Saha D, et al. Amazon aurora: On avoiding distributed consensus for i/os, commits, and membership changes[C]//Proceedings of the 2018 International Conference on Management of Data. 2018: 789-796.</li>
<li>Antonopoulos P, Budovski A, Diaconu C, et al. Socrates: El nuevo servidor sql en la nube[C]//Proceedings of the 2019 International Conference on Management of Data. 2019: 1743-1756.</li>
</ul>
