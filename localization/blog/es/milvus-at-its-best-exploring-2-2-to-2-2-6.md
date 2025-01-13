---
id: milvus-at-its-best-exploring-2-2-to-2-2-6.md
title: 'Milvus en su mejor momento: Explorando de v2.2 a v2.2.6'
author: Fendy Feng
date: 2023-04-22T00:00:00.000Z
cover: assets.zilliz.com/explore_milvus_latest_versions_48a4138d02.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
desc: novedades de Milvus 2.2 a 2.2.6
recommend: true
canonicalUrl: 'https://milvus.io/blog/milvus-at-its-best-exploring-2-2-to-2-2-6.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/exploring_milvus_latest_versions_4fa890533e.png" alt="Milvus at Its Best" class="doc-image" id="milvus-at-its-best" />
   </span> <span class="img-wrapper"> <span>Milvus en su mejor momento</span> </span></p>
<p>¡Bienvenidos de nuevo, seguidores de Milvus! Sabemos que ha pasado un tiempo desde la última vez que compartimos nuestras actualizaciones sobre esta vanguardista base de datos vectorial de código abierto. Pero no temas, porque estamos aquí para ponerte al día de todos los emocionantes desarrollos que han tenido lugar desde el pasado mes de agosto.</p>
<p>En esta entrada de blog, le llevaremos a través de las últimas versiones de Milvus, que abarcan desde la versión 2.2 hasta la versión 2.2.6. Tenemos mucho que cubrir, incluyendo nuevas características, mejoras, correcciones de errores y optimizaciones. Así que, ¡abróchense los cinturones y sumerjámonos!</p>
<h2 id="Milvus-v22-a-major-release-with-enhanced-stability-faster-search-speed-and-flexible-scalability" class="common-anchor-header">Milvus v2.2: una versión mayor con estabilidad mejorada, mayor velocidad de búsqueda y escalabilidad flexible<button data-href="#Milvus-v22-a-major-release-with-enhanced-stability-faster-search-speed-and-flexible-scalability" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2 es una versión importante que introduce siete características totalmente nuevas y numerosas mejoras con respecto a las versiones anteriores. Echemos un vistazo a algunos de los aspectos más destacados:</p>
<ul>
<li><strong>Inserción masiva de entidades desde archivos</strong>: Con esta función, puede cargar un lote de entidades en uno o varios archivos directamente a Milvus con sólo unas pocas líneas de código, ahorrándole tiempo y esfuerzo.</li>
<li><strong>Paginación de resultados de consultas</strong>: Para evitar la devolución masiva de resultados de búsqueda y consulta en una sola llamada a procedimiento remoto (RPC), Milvus v2.2 le permite configurar el desplazamiento y filtrar los resultados con palabras clave en las búsquedas y consultas.</li>
<li><strong>Control de acceso basado en roles (RBAC)</strong>: Milvus v2.2 es ahora compatible con RBAC, lo que le permite controlar el acceso a su instancia de Milvus mediante la gestión de usuarios, funciones y permisos.</li>
<li><strong>Cuotas y límites</strong>: Cuotas y límites es un nuevo mecanismo de Milvus v2.2 que protege el sistema de base de datos de errores de falta de memoria (OOM) y caídas durante aumentos repentinos de tráfico. Con esta función, puede controlar la ingestión, la búsqueda y el uso de memoria.</li>
<li><strong>Tiempo de vida (TTL) a nivel de colección</strong>: En versiones anteriores, Milvus sólo le permitía configurar TTL para sus clusters. Sin embargo, Milvus v2.2 ahora permite configurar el TTL a nivel de colección. Si configura TTL para una colección específica, las entidades de esa colección caducarán automáticamente cuando finalice el TTL. Esta configuración proporciona un control más preciso sobre la retención de datos.</li>
<li><strong>Índices de búsqueda del vecino más próximo (ANNS) basados en disco (Beta)</strong>: Milvus v2.2 introduce soporte para DiskANN, un algoritmo ANNS basado en gráficos Vamana y residente en SSD. Este soporte permite la búsqueda directa en conjuntos de datos a gran escala, lo que puede reducir significativamente el uso de memoria, hasta 10 veces.</li>
<li><strong>Copia de seguridad de datos (Beta)</strong>: Milvus v2.2 proporciona <a href="https://github.com/zilliztech/milvus-backup">una herramienta totalmente nueva</a> para realizar copias de seguridad y restaurar sus datos Milvus correctamente, ya sea a través de una línea de comandos o un servidor API.</li>
</ul>
<p>Además de las nuevas características mencionadas anteriormente, Milvus v2.2 incluye correcciones de cinco errores y múltiples mejoras para aumentar la estabilidad, la observabilidad y el rendimiento de Milvus. Para más detalles, consulte <a href="https://milvus.io/docs/release_notes.md#v220">las notas de la versión Milvus v2.2</a>.</p>
<h2 id="Milvus-v221--v222-minor-releases-with-issues-fixed" class="common-anchor-header">Milvus v2.2.1 y v2.2.2: versiones menores con problemas corregidos<button data-href="#Milvus-v221--v222-minor-releases-with-issues-fixed" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.1 y v2.2.2 son versiones menores centradas en solucionar problemas críticos de versiones anteriores y en introducir nuevas funciones. He aquí algunas de las más destacadas:</p>
<h3 id="Milvus-v221" class="common-anchor-header">Milvus v2.2.1</h3><ul>
<li>Admite el inquilino y la autenticación Pulsa</li>
<li>Soporta seguridad de capa de transporte (TLS) en la fuente de configuración etcd</li>
<li>Mejora el rendimiento de la búsqueda en más de un 30%.</li>
<li>Optimiza el planificador y aumenta la probabilidad de fusión de tareas</li>
<li>Corrige varios errores, incluidos los fallos de filtrado de términos en campos escalares indexados y el pánico de IndexNode al fallar la creación de un índice.</li>
</ul>
<h3 id="Milvus-v222" class="common-anchor-header">Milvus v2.2.2</h3><ul>
<li>Se soluciona el problema de que el proxy no actualiza la caché de los líderes de fragmentos.</li>
<li>Se corrige el problema de que la información cargada no se limpia para las colecciones/particiones liberadas.</li>
<li>Corrige el problema de que el recuento de carga no se borra a tiempo</li>
</ul>
<p>Para más detalles, consulte las <a href="https://milvus.io/docs/release_notes.md#v222">Notas de la versión de Milvus</a> <a href="https://milvus.io/docs/release_notes.md#v221">v2.2.1</a> y <a href="https://milvus.io/docs/release_notes.md#v222">las Notas de la versión de Milvus v2.2.2</a>.</p>
<h2 id="Milvus-v223-more-secure-stable-and-available" class="common-anchor-header">Milvus v2.2.3: más seguro, estable y disponible<button data-href="#Milvus-v223-more-secure-stable-and-available" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.3 es una versión que se centra en mejorar la seguridad, estabilidad y disponibilidad del sistema. Además, introduce dos características importantes:</p>
<ul>
<li><p><strong>Actualización continua</strong>: Esta función permite a Milvus responder a las solicitudes entrantes durante el proceso de actualización, lo que era imposible en versiones anteriores. Las actualizaciones continuas garantizan que el sistema siga estando disponible y respondiendo a las peticiones de los usuarios incluso durante las actualizaciones.</p></li>
<li><p><strong>Coordinador de alta disponibilidad (HA)</strong>: Esta función permite a los coordinadores de Milvus trabajar en modo activo-espera, reduciendo el riesgo de fallos puntuales. Incluso en catástrofes inesperadas, el tiempo de recuperación se reduce a un máximo de 30 segundos.</p></li>
</ul>
<p>Además de estas nuevas funciones, Milvus v2.2.3 incluye numerosas mejoras y correcciones de errores, incluido un mayor rendimiento de la inserción masiva, un menor uso de memoria, métricas de supervisión optimizadas y un mejor rendimiento del metaalmacenamiento. Para más detalles, consulte <a href="https://milvus.io/docs/release_notes.md#v223">las Notas de la versión de Milvus v2.2.3</a>.</p>
<h2 id="Milvus-v224-faster-more-reliable-and-resource-saving" class="common-anchor-header">Milvus v2.2.4: más rápido, más fiable y ahorra recursos<button data-href="#Milvus-v224-faster-more-reliable-and-resource-saving" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.4 es una actualización menor de Milvus v2.2. Introduce cuatro nuevas funciones y varias mejoras, lo que se traduce en un rendimiento más rápido, una mayor fiabilidad y un menor consumo de recursos. Los aspectos más destacados de esta versión son</p>
<ul>
<li><strong>Agrupación de recursos</strong>: Milvus admite ahora la agrupación de QueryNodes en otros grupos de recursos, lo que permite el aislamiento completo del acceso a los recursos físicos en diferentes grupos.</li>
<li><strong>Cambio de nombre de colecciones</strong>: La API de cambio de nombre de colecciones permite a los usuarios cambiar el nombre de una colección, proporcionando más flexibilidad en la gestión de colecciones y mejorando la usabilidad.</li>
<li><strong>Compatibilidad con Google Cloud Storage</strong></li>
<li><strong>Nueva opción en las API de búsqueda y consulta</strong>: Esta nueva función permite a los usuarios omitir la búsqueda en todos los segmentos crecientes, ofreciendo un mejor rendimiento de búsqueda en escenarios donde la búsqueda se realiza simultáneamente con la inserción de datos.</li>
</ul>
<p>Para obtener más información, consulte <a href="https://milvus.io/docs/release_notes.md#v224">las Notas de la versión de Milvus v2.2.4</a>.</p>
<h2 id="Milvus-v225-NOT-RECOMMENDED" class="common-anchor-header">Milvus v2.2.5: NO RECOMENDADO<button data-href="#Milvus-v225-NOT-RECOMMENDED" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.5 tiene varios problemas críticos y, por lo tanto, no recomendamos utilizar esta versión.  Pedimos sinceras disculpas por cualquier inconveniente causado por ellos. No obstante, estos problemas se han solucionado en Milvus v2.2.6.</p>
<h2 id="Milvus-v226-resolves-critical-issues-from-v225" class="common-anchor-header">Milvus v2.2.6: resuelve problemas críticos de v2.2.5<button data-href="#Milvus-v226-resolves-critical-issues-from-v225" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.6 ha resuelto satisfactoriamente los problemas críticos descubiertos en v2.2.5, incluidos los problemas con el reciclaje de datos binlog sucios y el fallo de GC de DataCoord. Si actualmente utiliza la versión 2.2.5, actualícela para garantizar un rendimiento y una estabilidad óptimos.</p>
<p>Los problemas críticos solucionados incluyen:</p>
<ul>
<li>Fallo de DataCoord GC</li>
<li>Anulación de los parámetros de índice pasados</li>
<li>Retraso del sistema causado por la acumulación de mensajes de RootCoord.</li>
<li>Inexactitud de la métrica RootCoordInsertChannelTimeTick</li>
<li>Posible detención de timestamp</li>
<li>Autodestrucción ocasional del rol de coordinador durante el proceso de reinicio</li>
<li>Atraso de los puntos de control debido a una salida anormal de la recogida de basura</li>
</ul>
<p>Para más detalles, consulte <a href="https://milvus.io/docs/release_notes.md#v226">las notas de la versión Milvus v2.2.6</a>.</p>
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
    </button></h2><p>En conclusión, las últimas versiones de Milvus de v2.2 a v2.2.6 han proporcionado muchas actualizaciones y mejoras interesantes. Desde nuevas funciones hasta correcciones de errores y optimizaciones, Milvus sigue cumpliendo sus compromisos de proporcionar soluciones de vanguardia y potenciar las aplicaciones en diversos dominios. Permanezca atento a más actualizaciones e innovaciones interesantes de la comunidad Milvus.</p>
