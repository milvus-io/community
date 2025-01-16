---
id: milvus-2210-and-2211-enhanced-stability-and-better-user-experience.md
title: >-
  Milvus 2.2.10 y 2.2.11: actualizaciones menores para mejorar la estabilidad
  del sistema y la experiencia del usuario
author: 'Fendy Feng, Owen Jiao'
date: 2023-07-06T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_Milvus_2_2_10_and_2_2_11_5018946465.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
desc: introducción de nuevas funciones y mejoras de Milvus 2.2.10 y 2.2.11
recommend: true
metaTitle: Milvus 2.2.10 & 2.2.11 Enhanced System Stability and User Experience
canonicalUrl: >-
  https://milvus.io/blog/milvus-2210-and-2211-enhanced-stability-and-better-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_2_10_and_2_2_11_5018946465.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>¡Saludos, fans de Milvus! Nos complace anunciar que acabamos de lanzar Milvus 2.2.10 y 2.2.11, dos actualizaciones menores centradas principalmente en la corrección de errores y la mejora general del rendimiento. Puede esperar un sistema más estable y una mejor experiencia de usuario con las dos actualizaciones. Echemos un vistazo rápido a las novedades de estas dos versiones.</p>
<h2 id="Milvus-2210" class="common-anchor-header">Milvus 2.2.10<button data-href="#Milvus-2210" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.10 ha corregido fallos ocasionales del sistema, ha acelerado la carga y la indexación, ha reducido el uso de memoria en los nodos de datos y ha realizado muchas otras mejoras. A continuación se indican algunos cambios notables:</p>
<ul>
<li>Se ha sustituido el antiguo escritor de carga útil CGO por uno nuevo escrito en Go puro, reduciendo el uso de memoria en los nodos de datos.</li>
<li>Añadido <code translate="no">go-api/v2</code> al archivo <code translate="no">milvus-proto</code> para evitar confusiones con diferentes versiones de <code translate="no">milvus-proto</code>.</li>
<li>Se ha actualizado Gin de la versión 1.9.0 a la 1.9.1 para corregir un error en la función <code translate="no">Context.FileAttachment</code>.</li>
<li>Añadido el control de acceso basado en roles (RBAC) para las APIs FlushAll y Database.</li>
<li>Se ha corregido un fallo aleatorio causado por el SDK de AWS S3.</li>
<li>Mejoradas las velocidades de carga e indexación.</li>
</ul>
<p>Para más detalles, consulte <a href="https://milvus.io/docs/release_notes.md#2210">las Notas de la versión de Milvus 2.2.10</a>.</p>
<h2 id="Milvus-2211" class="common-anchor-header">Milvus 2.2.11<button data-href="#Milvus-2211" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.11 ha resuelto varios problemas para mejorar la estabilidad del sistema. También ha mejorado su rendimiento en la supervisión, el registro, la limitación de velocidad y la interceptación de peticiones entre clústeres. Consulte a continuación los aspectos más destacados de esta actualización.</p>
<ul>
<li>Se ha añadido un interceptor al servidor Milvus GRPC para evitar problemas con el enrutamiento entre clústeres.</li>
<li>Se han añadido códigos de error al gestor de trozos de minio para facilitar el diagnóstico y la corrección de errores.</li>
<li>Utilización de un conjunto de coroutines singleton para evitar el desperdicio de coroutines y maximizar el uso de recursos.</li>
<li>Reducido el uso de disco para RocksMq a una décima parte de su nivel original habilitando la compresión zstd.</li>
<li>Corregido el pánico ocasional de QueryNode durante la carga.</li>
<li>Rectificado el problema de estrangulamiento de peticiones de lectura causado por calcular mal la longitud de la cola dos veces.</li>
<li>Se han corregido los problemas por los que GetObject devolvía valores nulos en MacOS.</li>
<li>Se ha corregido un fallo causado por el uso incorrecto del modificador noexcept.</li>
</ul>
<p>Para más detalles, consulte <a href="https://milvus.io/docs/release_notes.md#2211">las Notas de la versión de Milvus 2.2.11</a>.</p>
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
    </button></h2><p>Si tiene preguntas o comentarios sobre Milvus, no dude en ponerse en contacto con nosotros a través de <a href="https://twitter.com/milvusio">Twitter</a> o <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. También le invitamos a unirse a nuestro <a href="https://milvus.io/slack/">canal de Slack</a> para charlar con nuestros ingenieros y la comunidad directamente o eche un vistazo a nuestro <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">horario de oficina de los martes</a>.</p>
