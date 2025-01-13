---
id: milvus-229-highly-anticipated-release-with-optimal-user-experience.md
title: 'Milvus 2.2.9: Una versión muy esperada con una experiencia de usuario óptima'
author: 'Owen Jiao, Fendy Feng'
date: 2023-06-06T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_9_858e54a2d3.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-229-highly-anticipated-release-with-optimal-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_9_858e54a2d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Estamos encantados de anunciar la llegada de Milvus 2.2.9, una versión muy esperada que marca un hito importante para el equipo y la comunidad. Esta versión ofrece muchas características interesantes, incluyendo la tan esperada compatibilidad con tipos de datos JSON, esquemas dinámicos y claves de partición, garantizando una experiencia de usuario optimizada y un flujo de trabajo de desarrollo simplificado. Además, esta versión incorpora numerosas mejoras y correcciones de errores. Únase a nosotros para explorar Milvus 2.2.9 y descubrir por qué esta versión es tan emocionante.</p>
<h2 id="Optimized-user-experience-with-JSON-support" class="common-anchor-header">Experiencia de usuario optimizada con soporte JSON<button data-href="#Optimized-user-experience-with-JSON-support" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus ha introducido la tan esperada compatibilidad con el tipo de datos JSON, permitiendo el almacenamiento sin fisuras de datos JSON junto con los metadatos de vectores dentro de las colecciones de los usuarios. Con esta mejora, los usuarios pueden insertar eficazmente datos JSON en bloque y realizar consultas y filtrados avanzados basados en el contenido de sus campos JSON. Además, los usuarios pueden aprovechar las expresiones y realizar operaciones adaptadas a los campos JSON de sus conjuntos de datos, construir consultas y aplicar filtros basados en el contenido y la estructura de sus campos JSON, lo que les permite extraer información relevante y manipular mejor los datos.</p>
<p>En el futuro, el equipo de Milvus añadirá índices para campos dentro del tipo JSON, optimizando aún más el rendimiento de las consultas mixtas escalares y vectoriales. Esté atento a los próximos desarrollos.</p>
<h2 id="Added-flexibility-with-support-for-dynamic-schema" class="common-anchor-header">Mayor flexibilidad gracias a la compatibilidad con esquemas dinámicos<button data-href="#Added-flexibility-with-support-for-dynamic-schema" class="anchor-icon" translate="no">
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
    </button></h2><p>Con soporte para datos JSON, Milvus 2.2.9 proporciona ahora funcionalidad de esquema dinámico a través de un kit de desarrollo de software (SDK) simplificado.</p>
<p>A partir de Milvus 2.2.9, el SDK de Milvus incluye una API de alto nivel que rellena automáticamente los campos dinámicos en el campo JSON oculto de la colección, lo que permite a los usuarios concentrarse únicamente en sus campos de negocio.</p>
<h2 id="Better-data-separation-and-enhanced-search-efficiency-with-Partition-Key" class="common-anchor-header">Mejor separación de datos y mayor eficacia de búsqueda con Partition Key<button data-href="#Better-data-separation-and-enhanced-search-efficiency-with-Partition-Key" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.9 mejora sus capacidades de partición introduciendo la función Partition Key. Permite columnas específicas del usuario como claves primarias para la partición, eliminando la necesidad de API adicionales como <code translate="no">loadPartition</code> y <code translate="no">releasePartition</code>. Esta nueva función también elimina el límite en el número de particiones, lo que conduce a una utilización más eficiente de los recursos.</p>
<h2 id="Support-for-Alibaba-Cloud-OSS" class="common-anchor-header">Compatibilidad con Alibaba Cloud OSS<button data-href="#Support-for-Alibaba-Cloud-OSS" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.9 ahora es compatible con Alibaba Cloud Object Storage Service (OSS). Los usuarios de Alibaba Cloud pueden configurar fácilmente el <code translate="no">cloudProvider</code> a Alibaba Cloud y aprovechar la perfecta integración para el almacenamiento eficiente y la recuperación de datos vectoriales en la nube.</p>
<p>Además de las características mencionadas anteriormente, Milvus 2.2.9 ofrece soporte de base de datos en Role-Based Access Control (RBAC), introduce la gestión de conexiones e incluye múltiples mejoras y correcciones de errores. Para más información, consulte <a href="https://milvus.io/docs/release_notes.md">las Notas de la versión de Milvus 2.2.9</a>.</p>
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
    </button></h2><p>Si tiene preguntas o comentarios sobre Milvus, no dude en ponerse en contacto con nosotros a través de <a href="https://twitter.com/milvusio">Twitter</a> o <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. También le invitamos a unirse a nuestro <a href="https://milvus.io/slack/">canal de Slack</a> para charlar directamente con nuestros ingenieros y la comunidad, o a consultar nuestro <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">horario de oficina de los martes</a>.</p>
