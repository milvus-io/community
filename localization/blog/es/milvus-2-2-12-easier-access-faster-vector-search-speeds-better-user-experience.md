---
id: >-
  milvus-2-2-12-easier-access-faster-vector-search-speeds-better-user-experience.md
title: >-
  Milvus 2.2.12: Acceso más fácil, mayor velocidad de búsqueda de vectores y
  mejor experiencia de usuario
author: 'Owen Jiao, Fendy Feng'
date: 2023-07-28T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_12_20230720_143424_7d19280738.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-2-12-easier-access-faster-vector-search-speeds-better-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_12_20230720_143424_7d19280738.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Estamos encantados de anunciar la última versión de Milvus 2.2.12. Esta actualización incluye múltiples novedades, como la compatibilidad con la API RESTful, la función <code translate="no">json_contains</code> y la recuperación de vectores durante las búsquedas RNA en respuesta a los comentarios de los usuarios. También hemos simplificado la experiencia del usuario, mejorado la velocidad de búsqueda de vectores y resuelto muchos problemas. Profundicemos en lo que podemos esperar de Milvus 2.2.12.</p>
<h2 id="Support-for-RESTful-API" class="common-anchor-header">Soporte para RESTful API<button data-href="#Support-for-RESTful-API" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.12 soporta ahora la API RESTful, que permite a los usuarios acceder a Milvus sin instalar un cliente, haciendo que las operaciones cliente-servidor se realicen sin esfuerzo. Además, el despliegue de Milvus es ahora más cómodo porque el SDK de Milvus y la API RESTful comparten el mismo número de puerto.</p>
<p><strong>Nota</strong>: Seguimos recomendando el uso del SDK para desplegar Milvus para operaciones avanzadas o si su negocio es sensible a la latencia.</p>
<h2 id="Vector-retrieval-during-ANN-searches" class="common-anchor-header">Recuperación de vectores durante las búsquedas RNA<button data-href="#Vector-retrieval-during-ANN-searches" class="anchor-icon" translate="no">
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
    </button></h2><p>En versiones anteriores, Milvus no permitía la recuperación de vectores durante las búsquedas aproximadas del vecino más cercano (RNA) para priorizar el rendimiento y el uso de memoria. Como resultado, la recuperación de vectores sin procesar tenía que dividirse en dos pasos: realizar la búsqueda RNA y después consultar los vectores sin procesar basándose en sus ID. Este enfoque aumentaba los costes de desarrollo y dificultaba la implantación y adopción de Milvus por parte de los usuarios.</p>
<p>Con Milvus 2.2.12, los usuarios pueden recuperar vectores sin procesar durante las búsquedas RNA configurando el campo vectorial como campo de salida y realizando consultas en colecciones indexadas por HNSW, DiskANN o IVF-FLAT. Además, los usuarios pueden esperar una velocidad de recuperación de vectores mucho mayor.</p>
<h2 id="Support-for-operations-on-JSON-arrays" class="common-anchor-header">Compatibilidad con operaciones en matrices JSON<button data-href="#Support-for-operations-on-JSON-arrays" class="anchor-icon" translate="no">
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
    </button></h2><p>Recientemente hemos añadido soporte para JSON en Milvus 2.2.8. Desde entonces, los usuarios han enviado numerosas peticiones para soportar operaciones adicionales con matrices JSON, como inclusión, exclusión, intersección, unión, diferencia y más. En Milvus 2.2.12, hemos dado prioridad al soporte de la función <code translate="no">json_contains</code> para habilitar la operación de inclusión. Seguiremos añadiendo soporte para otros operadores en futuras versiones.</p>
<h2 id="Enhancements-and-bug-fixes" class="common-anchor-header">Mejoras y correcciones de errores<button data-href="#Enhancements-and-bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>Además de introducir nuevas funciones, Milvus 2.2.12 ha mejorado su rendimiento de búsqueda vectorial con una sobrecarga reducida, lo que facilita el manejo de búsquedas topk extensas. Además, mejora el rendimiento de escritura en situaciones de partición clave y multipartición y optimiza el uso de la CPU para máquinas grandes. Esta actualización soluciona varios problemas: uso excesivo del disco, compactación atascada, borrado infrecuente de datos y fallos de inserción masiva. Para más información, consulte <a href="https://milvus.io/docs/release_notes.md#2212">las Notas de la versión de Milvus 2.2.12</a>.</p>
<h2 id="Lets-keep-in-touch" class="common-anchor-header">¡Sigamos en contacto!<button data-href="#Lets-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Si tiene preguntas o comentarios sobre Milvus, no dude en ponerse en contacto con nosotros a través de <a href="https://twitter.com/milvusio">Twitter</a> o <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. También le invitamos a unirse a nuestro <a href="https://milvus.io/slack/">canal de Slack</a> para charlar directamente con nuestros ingenieros y la comunidad, o a consultar nuestro <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">horario de oficina de los martes</a>.</p>
