---
id: >-
  milvus-2-3-4-faster-searches-expanded-data-support-improved-monitoring-and-more.md
title: >-
  Milvus 2.3.4: Búsquedas más rápidas, soporte de datos ampliado, supervisión
  mejorada y mucho más.
author: 'Ken Zhang, Fendy Feng'
date: 2024-01-12T00:00:00.000Z
cover: assets.zilliz.com/What_is_new_in_Milvus_2_3_4_1847b0fa8a.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
desc: presentación de Milvus 2.3.4 nuevas funciones y mejoras
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-3-4-faster-searches-expanded-data-support-improved-monitoring-and-more.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_is_new_in_Milvus_2_3_4_1847b0fa8a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nos complace presentar la última versión de Milvus 2.3.4. Esta actualización introduce un conjunto de características y mejoras meticulosamente diseñadas para optimizar el rendimiento, aumentar la eficiencia y ofrecer una experiencia de usuario sin fisuras. En esta entrada de blog, profundizaremos en los aspectos más destacados de Milvus 2.3.4.</p>
<h2 id="Access-logs-for-improved-monitoring" class="common-anchor-header">Registros de acceso para una mejor supervisión<button data-href="#Access-logs-for-improved-monitoring" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus admite ahora registros de acceso, que ofrecen información muy valiosa sobre las interacciones con interfaces externas. Estos registros registran los nombres de los métodos, las solicitudes de los usuarios, los tiempos de respuesta, los códigos de error y otra información sobre las interacciones, lo que permite a los desarrolladores y administradores de sistemas realizar análisis de rendimiento, auditorías de seguridad y una solución de problemas eficaz.</p>
<p><strong><em>Nota:</em></strong> <em>Actualmente, los registros de acceso sólo soportan interacciones gRPC. Sin embargo, nuestro compromiso de mejora continúa, y futuras versiones ampliarán esta capacidad para incluir registros de peticiones RESTful.</em></p>
<p>Para obtener información más detallada, consulte <a href="https://milvus.io/docs/configure_access_logs.md">Configurar registros de acceso</a>.</p>
<h2 id="Parquet-file-imports-for-enhanced-data-processing-efficiency" class="common-anchor-header">Importación de archivos Parquet para mejorar la eficiencia del procesamiento de datos<button data-href="#Parquet-file-imports-for-enhanced-data-processing-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3.4 soporta ahora la importación de archivos Parquet, un formato de almacenamiento en columnas ampliamente aceptado y diseñado para mejorar la eficiencia del almacenamiento y procesamiento de conjuntos de datos a gran escala. Esta incorporación ofrece a los usuarios una mayor flexibilidad y eficacia en sus tareas de procesamiento de datos. Al eliminar la necesidad de laboriosas conversiones de formatos de datos, los usuarios que gestionen conjuntos de datos sustanciales en formato Parquet experimentarán un proceso de importación de datos racionalizado, reduciendo significativamente el tiempo desde la preparación inicial de los datos hasta la posterior recuperación de vectores.</p>
<p>Además, nuestra herramienta de conversión de formatos de datos, BulkWriter, ha adoptado Parquet como formato de datos de salida predeterminado, lo que garantiza una experiencia más intuitiva para los desarrolladores.</p>
<h2 id="Binlog-index-on-growing-segments-for-faster-searches" class="common-anchor-header">Índice Binlog en segmentos crecientes para búsquedas más rápidas<button data-href="#Binlog-index-on-growing-segments-for-faster-searches" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus aprovecha ahora un índice binlog en segmentos crecientes, lo que resulta en búsquedas hasta diez veces más rápidas en segmentos crecientes. Esta mejora aumenta significativamente la eficiencia de la búsqueda y admite índices avanzados como IVF o Fast Scan, mejorando la experiencia general del usuario.</p>
<h2 id="Support-for-up-to-10000-collectionspartitions" class="common-anchor-header">Soporte de hasta 10.000 colecciones/particiones<button data-href="#Support-for-up-to-10000-collectionspartitions" class="anchor-icon" translate="no">
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
    </button></h2><p>Al igual que las tablas y particiones en las bases de datos relacionales, las colecciones y particiones son las unidades centrales para almacenar y gestionar datos vectoriales en Milvus. En respuesta a las necesidades cambiantes de los usuarios de una organización de datos matizada, Milvus 2.3.4 admite ahora hasta 10.000 colecciones/particiones en un clúster, un salto significativo desde el límite anterior de 4.096. Esta mejora beneficia a diversos casos de uso, como la gestión de bases de conocimiento y los entornos multiempresa. La mayor compatibilidad con colecciones/particiones se debe a mejoras en el mecanismo de tictac de tiempo, la gestión de goroutines y el uso de memoria.</p>
<p><strong><em>Nota:</em></strong> <em>El límite recomendado para el número de colecciones/particiones es de 10.000, ya que superarlo puede afectar a la recuperación de fallos y al uso de recursos.</em></p>
<h2 id="Other-enhancements" class="common-anchor-header">Otras mejoras<button data-href="#Other-enhancements" class="anchor-icon" translate="no">
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
    </button></h2><p>Además de las características anteriores, Milvus 2.3.4 incluye varias mejoras y correcciones de errores. Entre ellas se incluyen la reducción del uso de memoria durante la recuperación de datos y la gestión de datos de longitud variable, el perfeccionamiento de los mensajes de error, la aceleración de la velocidad de carga y la mejora del equilibrio de los fragmentos de consulta. Estas mejoras colectivas contribuyen a que la experiencia general del usuario sea más fluida y eficiente.</p>
<p>Para obtener una visión general de todos los cambios introducidos en Milvus 2.3.4, consulte nuestras <a href="https://milvus.io/docs/release_notes.md#v234">Notas de la versión</a>.</p>
<h2 id="Stay-connected" class="common-anchor-header">Manténgase conectado<button data-href="#Stay-connected" class="anchor-icon" translate="no">
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
    </button></h2><p>Si tiene preguntas o comentarios sobre Milvus, únase a nuestro <a href="https://discord.com/invite/8uyFbECzPX">canal de Discord</a> para interactuar con nuestros ingenieros y la comunidad directamente o únase a nuestro <a href="https://discord.com/invite/RjNbk8RR4f">Almuerzo y Aprendizaje de la Comunidad Milvus</a> todos los martes de 12 a 12:30 PM PST. También puede seguirnos en <a href="https://twitter.com/milvusio">Twitter</a> o <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> para conocer las últimas noticias y actualizaciones sobre Milvus.</p>
