---
id: Milvus-2-2-8-better-query-performance-20-higher-throughputs.md
title: 'Milvus 2.2.8: Mejor rendimiento de las consultas, un 20% más de rendimiento'
author: Fendy Feng
date: 2023-05-12T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_8_f4dd6de0f2.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/Milvus-2-2-8-better-query-performance-20-higher-throughputs.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_8_f4dd6de0f2.png" alt="Milvus 2.2.8" class="doc-image" id="milvus-2.2.8" />
   </span> <span class="img-wrapper"> <span>Milvus 2.2.8</span> </span></p>
<p>Nos complace anunciar nuestra última versión de Milvus 2.2.8. Esta versión incluye numerosas mejoras y correcciones de errores de versiones anteriores, lo que resulta en un mejor rendimiento de consulta, ahorro de recursos y mayor rendimiento. Veamos juntos las novedades de esta versión.</p>
<h2 id="Reduced-peak-memory-consumption-during-collection-loading" class="common-anchor-header">Reducción del consumo máximo de memoria durante la carga de colecciones<button data-href="#Reduced-peak-memory-consumption-during-collection-loading" class="anchor-icon" translate="no">
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
    </button></h2><p>Para realizar consultas, Milvus necesita cargar datos e índices en la memoria. Sin embargo, durante el proceso de carga, las múltiples copias de memoria pueden hacer que el pico de uso de memoria aumente hasta tres o cuatro veces más que durante el tiempo de ejecución real. La última versión de Milvus 2.2.8 aborda eficazmente este problema y optimiza el uso de la memoria.</p>
<h2 id="Expanded-querying-scenarios-with-QueryNode-supporting-plugins" class="common-anchor-header">Escenarios de consulta ampliados con QueryNode compatible con plugins<button data-href="#Expanded-querying-scenarios-with-QueryNode-supporting-plugins" class="anchor-icon" translate="no">
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
    </button></h2><p>QueryNode soporta ahora plugins en la última versión de Milvus 2.2.8. Puede especificar fácilmente la ruta del archivo del plugin con la configuración de <code translate="no">queryNode.soPath</code>. Entonces, Milvus puede cargar el plugin en tiempo de ejecución y ampliar los escenarios de consulta disponibles. Consulte la <a href="https://pkg.go.dev/plugin">documentación del complemento Go</a>, si necesita orientación sobre el desarrollo de complementos.</p>
<h2 id="Optimized-querying-performance-with-enhanced-compaction-algorithm" class="common-anchor-header">Rendimiento de consulta optimizado con un algoritmo de compactación mejorado<button data-href="#Optimized-querying-performance-with-enhanced-compaction-algorithm" class="anchor-icon" translate="no">
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
    </button></h2><p>El algoritmo de compactación determina la velocidad a la que pueden converger los segmentos, lo que afecta directamente al rendimiento de la consulta. Con las recientes mejoras del algoritmo de compactación, la eficacia de la convergencia ha mejorado drásticamente, lo que se traduce en consultas más rápidas.</p>
<h2 id="Better-resource-saving-and-querying-performance-with-reduced-collection-shards" class="common-anchor-header">Mejor ahorro de recursos y rendimiento de las consultas con fragmentos de colección reducidos<button data-href="#Better-resource-saving-and-querying-performance-with-reduced-collection-shards" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus es un sistema de procesamiento paralelo masivo (MPP), lo que significa que el número de fragmentos de colección afecta a la eficiencia de Milvus en la escritura y la consulta. En versiones anteriores, una colección tenía dos fragmentos por defecto, lo que resultaba en un excelente rendimiento de escritura pero comprometía el rendimiento de consulta y el coste de recursos. Con la nueva actualización de Milvus 2.2.8, los fragmentos de colección por defecto se han reducido a uno, lo que permite a los usuarios ahorrar más recursos y realizar mejores consultas. La mayoría de los usuarios de la comunidad tienen menos de 10 millones de volúmenes de datos, y un shard es suficiente para lograr un buen rendimiento de escritura.</p>
<p><strong>Nota</strong>: Esta actualización no afecta a las colecciones creadas antes de esta versión.</p>
<h2 id="20-throughput-increase-with-an-improved-query-grouping-algorithm" class="common-anchor-header">Aumento del rendimiento del 20% con un algoritmo de agrupación de consultas mejorado<button data-href="#20-throughput-increase-with-an-improved-query-grouping-algorithm" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus cuenta con un eficiente algoritmo de agrupación de consultas que combina múltiples peticiones de consulta en la cola en una sola para una ejecución más rápida, mejorando significativamente el rendimiento. En la última versión, hemos introducido mejoras adicionales en este algoritmo, aumentando el rendimiento de Milvus en al menos un 20%.</p>
<p>Además de las mejoras mencionadas, Milvus 2.2.8 también corrige varios errores. Para más detalles, consulte <a href="https://milvus.io/docs/release_notes.md">las Notas de la versión de Milvus</a>.</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">¡Sigamos en contacto!<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Si tiene preguntas o comentarios sobre Milvus, no dude en ponerse en contacto con nosotros a través de <a href="https://twitter.com/milvusio">Twitter</a> o <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. También le invitamos a unirse a nuestro <a href="https://milvus.io/slack/">canal de Slack</a> para charlar directamente con nuestros ingenieros y con toda la comunidad, o a consultar nuestro <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">horario de oficina de los martes</a>.</p>
