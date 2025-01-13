---
id: top-10-keywords-dominates-milvus-community-in-2023.md
title: Desvelamos las 10 palabras clave que dominarán la comunidad Milvus en 2023
author: 'Jack Li, Fendy Feng'
date: 2024-1-21
desc: >-
  Este post explora el corazón de la comunidad analizando los historiales de los
  chats y revelando las 10 palabras clave más utilizadas en las discusiones.
metaTitle: Top 10 Keywords Dominating the Milvus Community in 2023
cover: >-
  assets.zilliz.com/Top_10_Keywords_in_the_Milvus_Community_20240116_111204_1_f65b17a8ea.png
tag: Engineering
tags: >-
  Data science, Database, Tech, Artificial Intelligence, Vector Management,
  Milvus
recommend: true
canonicalUrl: 'https://milvus.io/blog/top-10-keywords-dominates-milvus-community-in-2023.md'
---
<p>Al concluir el año 2023, repasemos el extraordinario viaje de la comunidad Milvus: <a href="https://github.com/milvus-io/milvus">25.000 GitHub Stars</a>, el lanzamiento de <a href="https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md">Milvus 2.3.0</a> y más de 10 millones de descargas de <a href="https://hub.docker.com/r/milvusdb/milvus">imágenes Docker</a>. Este post explora el corazón de la comunidad analizando los historiales de chat y revelando las 10 palabras clave principales en las discusiones.</p>
<iframe class="video-player" src="https://www.youtube.com/embed/o5uMdNLioQ0?list=PLPg7_faNDlT5Fb8WN8r1PzzQTNzdechnS" title="Mastering Milvus: Turbocharge Your Vector Database with Optimization Secrets!" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
<h2 id="1-Version--The-rise-of-AIGC-drives-rapid-Milvus-iteration" class="common-anchor-header">#1 Version - El auge de AIGC impulsa la rápida iteración de Milvus<button data-href="#1-Version--The-rise-of-AIGC-drives-rapid-Milvus-iteration" class="anchor-icon" translate="no">
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
    </button></h2><p>Sorprendentemente, "Versión" emergió como la palabra clave más discutida en 2023. Esta revelación tiene su origen en la ola de IA del año, con las bases de datos vectoriales como infraestructura crítica para abordar los retos en los problemas de alucinación de las aplicaciones AIGC.</p>
<p>El entusiasmo en torno a las bases de datos vectoriales lleva a Milvus a una etapa de rápida iteración. La comunidad fue testigo del lanzamiento de Veinte versiones sólo en 2023, dando cabida a las demandas de los desarrolladores de AIGC que inundaban la comunidad con consultas sobre la elección de la versión óptima de Milvus para diversas aplicaciones. Para los usuarios que navegan por estas actualizaciones, recomendamos adoptar la última versión para mejorar las funciones y el rendimiento.</p>
<p>Si está interesado en la planificación de versiones de Milvus, consulte la página de <a href="https://wiki.lfaidata.foundation/display/MIL/Milvus+Long+Term+Roadmap+and+Time+schedule">la hoja de ruta de Milvus</a> en el sitio web oficial.</p>
<h2 id="2-Search--beyond-Vector-Search" class="common-anchor-header">#2 Búsqueda - más allá de la búsqueda vectorial<button data-href="#2-Search--beyond-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>"Búsqueda" ocupa el segundo lugar, reflejando su papel fundamental en las operaciones de base de datos. Milvus admite varias capacidades de búsqueda, desde la búsqueda Top-K ANN hasta la búsqueda escalar filtrada y la búsqueda por rangos. El inminente lanzamiento de Milvus 3.0 (Beta) promete la búsqueda por palabras clave (sparse embeddings), que muchos desarrolladores de aplicaciones RAG esperan con impaciencia.</p>
<p>Los debates de la comunidad sobre la búsqueda se centran en el rendimiento, las capacidades y los principios. Los usuarios suelen plantear preguntas sobre el filtrado de atributos, el establecimiento de valores umbral de índice y la resolución de problemas de latencia. Los recursos como la <a href="https://milvus.io/docs/v2.0.x/search.md">documentación de consulta y búsqueda</a>, <a href="https://wiki.lfaidata.foundation/pages/viewpage.action?pageId=43287103">las Propuestas de mejora de Milvus (MEP)</a> y las discusiones en Discord se han convertido en las referencias a las que acudir para desentrañar las complejidades de la búsqueda en Milvus.</p>
<h2 id="3-Memory--trade-offs-between-performance-and-accuracy-for-minimized-memory-overhead" class="common-anchor-header">Memoria #3 - compromisos entre rendimiento y precisión para minimizar la sobrecarga de memoria<button data-href="#3-Memory--trade-offs-between-performance-and-accuracy-for-minimized-memory-overhead" class="anchor-icon" translate="no">
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
    </button></h2><p>La "memoria" también ocupó un lugar central en los debates de la comunidad durante el año pasado. Como tipo de datos distintivo, los vectores tienen intrínsecamente dimensiones elevadas. El almacenamiento de vectores en memoria es una práctica común para un rendimiento óptimo, pero el creciente volumen de datos limita la memoria disponible. Milvus optimiza el uso de la memoria adoptando técnicas como <a href="https://zilliz.com/blog/milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability">MMap</a> y DiskANN.</p>
<p>Sin embargo, conseguir un bajo uso de memoria, un rendimiento excelente y una gran precisión simultáneamente en un sistema de base de datos sigue siendo complejo, ya que es necesario hacer concesiones entre el rendimiento y la precisión para minimizar la sobrecarga de memoria.</p>
<p>En el caso de los Contenidos Generados por Inteligencia Artificial (AIGC), los desarrolladores suelen dar prioridad a las respuestas rápidas y a la precisión de los resultados frente a los estrictos requisitos de rendimiento. La incorporación de MMap y DiskANN de Milvus minimiza el uso de memoria al tiempo que maximiza el procesamiento de datos y la precisión de los resultados, logrando un equilibrio que se alinea con las necesidades prácticas de las aplicaciones AIGC.</p>
<h2 id="4-Insert--smooth-sailing-through-data-insertion" class="common-anchor-header">#4 Insert - navegación fluida a través de la inserción de datos<button data-href="#4-Insert--smooth-sailing-through-data-insertion" class="anchor-icon" translate="no">
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
    </button></h2><p>La inserción eficiente de datos es una preocupación crucial para los desarrolladores, lo que suscita frecuentes debates sobre la optimización de la velocidad de inserción dentro de la comunidad Milvus. Milvus destaca en la inserción eficiente de datos en flujo y en la creación de índices, gracias a su hábil separación de datos en flujo y por lotes. Esta capacidad lo distingue como una solución de alto rendimiento en comparación con otros proveedores de bases de datos vectoriales, como Pinecone.</p>
<p>He aquí algunas valiosas ideas y recomendaciones sobre la inserción de datos:</p>
<ul>
<li><p><strong>Inserción por lotes:</strong> Opte por la inserción por lotes en lugar de la inserción de una sola fila para mejorar la eficiencia. En particular, la inserción desde archivos supera en velocidad a la inserción por lotes. Cuando maneje grandes conjuntos de datos que superen los diez millones de registros, considere la posibilidad de utilizar la interfaz <code translate="no">bulk_insert</code> para agilizar y acelerar el proceso de importación.</p></li>
<li><p><strong>Uso estratégico de <code translate="no">flush()</code>:</strong> En lugar de invocar la interfaz <code translate="no">flush()</code> después de cada lote, realice una única llamada tras completar toda la inserción de datos. El uso excesivo de la interfaz <code translate="no">flush()</code> entre lotes puede provocar la generación de archivos de segmentos fragmentados, lo que supone una carga de compactación considerable para el sistema.</p></li>
<li><p><strong>Deduplicación de claves primarias:</strong> Milvus no realiza deduplicación de claves primarias cuando se utiliza la interfaz <code translate="no">insert</code> para la inserción de datos. Si necesita deduplicar claves primarias, le recomendamos que utilice la interfaz <code translate="no">upsert</code>. Sin embargo, el rendimiento de inserción de <code translate="no">upsert</code>es inferior al de <code translate="no">insert</code>, debido a una operación de consulta interna adicional.</p></li>
</ul>
<h2 id="5-Configuration--decoding-the-parameter-maze" class="common-anchor-header">#5 Configuración - descifrando el laberinto de parámetros<button data-href="#5-Configuration--decoding-the-parameter-maze" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus es una base de datos vectorial distribuida que integra muchos componentes de terceros como almacenamiento de objetos, colas de mensajes y Etcd. Los usuarios lidiaron con el ajuste de parámetros y la comprensión de su impacto en el rendimiento de Milvus, haciendo de la "Configuración" un tema discutido con frecuencia.</p>
<p>Entre todas las preguntas sobre configuraciones, "qué parámetros ajustar" es posiblemente el aspecto más desafiante, ya que los parámetros varían en diferentes situaciones. Por ejemplo, la optimización de los parámetros de rendimiento de búsqueda difiere de la optimización de los parámetros de rendimiento de inserción y depende en gran medida de la experiencia práctica.</p>
<p>Una vez que los usuarios identifican "qué parámetros ajustar", las preguntas subsiguientes sobre "cómo ajustar" se vuelven más manejables. Para procedimientos específicos, consulte nuestra documentación <a href="https://milvus.io/docs/configure-helm.md">Configurar Milvus</a>. La gran noticia es que Milvus ha soportado ajustes dinámicos de parámetros desde la versión 2.3.0, eliminando la necesidad de reiniciar para que los cambios surtan efecto. Para procedimientos específicos, consulte <a href="https://milvus.io/docs/dynamic_config.md">Configure Milvus on the Fly</a>.</p>
<h2 id="6-Logs--navigating-the-troubleshooting-compass" class="common-anchor-header">#6 Logs - navegando por la brújula de localización de averías<button data-href="#6-Logs--navigating-the-troubleshooting-compass" class="anchor-icon" translate="no">
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
    </button></h2><p>Los "Logs" sirven como brújula para la resolución de problemas. Los usuarios buscaron orientación en la comunidad sobre la exportación de registros de Milvus, el ajuste de los niveles de registro y la integración con sistemas como Loki de Grafana. He aquí algunas sugerencias sobre los registros de Milvus.</p>
<ul>
<li><p><strong>Cómo ver y exportar los registros de Milvus:</strong> Puede exportar fácilmente los registros de Milvus con el script de un solo clic <a href="https://github.com/milvus-io/milvus/tree/master/deployments/export-log">export-milvus-log.sh</a> que está disponible en el repositorio de GitHub.</p></li>
<li><p><strong>Nivel de registro:</strong> Milvus tiene múltiples niveles de registro para adaptarse a diversos casos de uso. El nivel info es suficiente para la mayoría de los casos, y el nivel debug es para depuración. Un exceso de registros de Milvus puede indicar niveles de registro mal configurados.</p></li>
<li><p><strong>Recomendamos integrar los registros de Milvus con un sistema de recopilación de registros</strong> como Loki para agilizar la recuperación de registros en la resolución de problemas futuros.</p></li>
</ul>
<h2 id="7-Cluster--scaling-for-production-environments" class="common-anchor-header">Cluster #7 - escalado para entornos de producción<button data-href="#7-Cluster--scaling-for-production-environments" class="anchor-icon" translate="no">
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
    </button></h2><p>Dada la identidad de Milvus como base de datos vectorial distribuida, el término "cluster" es un tema de discusión frecuente en la comunidad. Las conversaciones giran en torno al escalado de datos en un clúster, la migración de datos y la copia de seguridad y sincronización de datos.</p>
<p>En los entornos de producción, la escalabilidad robusta y la alta disponibilidad son requisitos estándar para los sistemas de bases de datos distribuidas. La arquitectura de separación almacenamiento-computación de Milvus permite una escalabilidad de datos sin fisuras ampliando los recursos para los nodos de computación y almacenamiento, acomodando escalas de datos ilimitadas. Milvus también proporciona alta disponibilidad con una arquitectura de réplica múltiple y sólidas capacidades de copia de seguridad y sincronización.  Para más información, consulte <a href="https://milvus.io/docs/coordinator_ha.md#Coordinator-HA">Coordinator HA</a>.</p>
<h2 id="8-Documentation--the-gateway-to-understanding-Milvus" class="common-anchor-header">#8 Documentación - la puerta de entrada a la comprensión de Milvus<button data-href="#8-Documentation--the-gateway-to-understanding-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>"Documentación" es otra palabra clave que aparece con frecuencia en los debates de la comunidad, a menudo vinculada a preguntas sobre si existe alguna página de documentación para una función específica y dónde encontrarla.</p>
<p>Sirviendo como puerta de entrada a la comprensión de Milvus, alrededor del 80% de las consultas de la comunidad encuentran respuesta en la <a href="https://milvus.io/docs">documentación oficial</a>. Le recomendamos que lea nuestra documentación antes de utilizar Milvus o de encontrarse con algún problema. Además, puede explorar ejemplos de código en varios repositorios SDK para obtener información sobre el uso de Milvus.</p>
<h2 id="9-Deployment--simplifying-the-Milvus-journey" class="common-anchor-header">Despliegue #9 - simplificando el viaje Milvus<button data-href="#9-Deployment--simplifying-the-Milvus-journey" class="anchor-icon" translate="no">
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
    </button></h2><p>El despliegue sencillo sigue siendo el objetivo permanente del equipo de Milvus. Para cumplir este compromiso, hemos introducido <a href="https://milvus.io/docs/milvus_lite.md#Get-Started-with-Milvus-Lite">Milvus Lite</a>, una alternativa ligera a Milvus que es completamente funcional pero no tiene dependencias de K8s o Docker.</p>
<p>Hemos racionalizado aún más el despliegue introduciendo la solución de mensajería <a href="https://zilliz.com/blog/optimizing-data-communication-milvus-embraces-nats-messaging">NATS</a> más ligera y consolidando los componentes de los nodos. En respuesta a los comentarios de los usuarios, nos estamos preparando para lanzar una versión independiente sin dependencias, con esfuerzos continuos para mejorar las funciones y simplificar las operaciones de despliegue. La rápida iteración de Milvus muestra el compromiso continuo de la comunidad con el perfeccionamiento continuo del proceso de despliegue.</p>
<h2 id="10-Deletion--unraveling-the-impact" class="common-anchor-header">#10 Supresión - desentrañar el impacto<button data-href="#10-Deletion--unraveling-the-impact" class="anchor-icon" translate="no">
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
    </button></h2><p>Los debates predominantes sobre el "borrado" giran en torno a los recuentos de datos que no cambian tras el borrado, la recuperabilidad continua de los datos borrados y el fracaso de la recuperación del espacio en disco tras el borrado.</p>
<p>Milvus 2.3 introduce la expresión <code translate="no">count(*)</code> para abordar las actualizaciones retrasadas del recuento de entidades. La persistencia de datos borrados en las consultas se debe probablemente al uso inadecuado de <a href="https://zilliz.com/blog/understand-consistency-models-for-vector-databases">modelos de consistencia de datos</a>. La preocupación por los fallos en la recuperación del espacio en disco hace que se rediseñe el mecanismo de recogida de basura de Milvus, que establece un periodo de espera antes de la eliminación completa de los datos. Este enfoque permite una ventana de tiempo para una posible recuperación.</p>
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
    </button></h2><p>Las 10 palabras clave principales ofrecen una visión de las vibrantes discusiones dentro de la comunidad Milvus. A medida que Milvus continúa evolucionando, la comunidad sigue siendo un recurso inestimable para los desarrolladores que buscan soluciones, comparten experiencias y contribuyen al avance de las bases de datos vectoriales en la era de la IA.</p>
<p>Únete a este emocionante viaje uniéndote a nuestro <a href="https://discord.com/invite/8uyFbECzPX">canal de Discord</a> en 2024. Allí, podrá interactuar con nuestros brillantes ingenieros y conectarse con entusiastas de Milvus de ideas afines. Además, asista al <a href="https://discord.com/invite/RjNbk8RR4f">Milvus Community Lunch and Learn</a> todos los martes de 12:00 a 12:30 PM PST. Comparta sus ideas, preguntas y comentarios, ya que cada contribución contribuye al espíritu de colaboración que impulsa a Milvus hacia adelante. Su participación activa no sólo es bienvenida, sino también apreciada. ¡Innovemos juntos!</p>
