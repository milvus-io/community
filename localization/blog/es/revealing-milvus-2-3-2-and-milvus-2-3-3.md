---
id: revealing-milvus-2-3-2-and-milvus-2-3-3.md
title: >-
  Revelando Milvus 2.3.2 &amp; 2.3.3: Soporte para tipos de datos array, borrado
  complejo, integración TiKV y más
author: 'Fendy Feng, Owen Jiao'
date: 2023-11-20T00:00:00.000Z
desc: >-
  ¡Hoy estamos encantados de anunciar el lanzamiento de Milvus 2.3.2 y 2.3.3!
  Estas actualizaciones traen muchas características interesantes,
  optimizaciones y mejoras, mejorando el rendimiento del sistema, la
  flexibilidad y la experiencia general del usuario.
cover: assets.zilliz.com/What_s_New_in_Milvus_2_3_2_and_2_3_3_d3d0db03c3.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
recommend: true
canonicalUrl: null
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_3_2_and_2_3_3_d3d0db03c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>En el panorama en constante evolución de las tecnologías de búsqueda vectorial, Milvus se mantiene a la vanguardia, superando los límites y estableciendo nuevos estándares. Hoy, ¡estamos encantados de anunciar el lanzamiento de Milvus 2.3.2 y 2.3.3! Estas actualizaciones traen muchas características interesantes, optimizaciones y mejoras, mejorando el rendimiento del sistema, la flexibilidad y la experiencia general del usuario.</p>
<h2 id="Support-for-Array-data-types---making-search-results-more-accurate-and-relevant" class="common-anchor-header">Compatibilidad con tipos de datos Array: resultados de búsqueda más precisos y relevantes<button data-href="#Support-for-Array-data-types---making-search-results-more-accurate-and-relevant" class="anchor-icon" translate="no">
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
    </button></h2><p>La incorporación de la compatibilidad con tipos de datos Array es una mejora fundamental para Milvus, especialmente en escenarios de filtrado de consultas como la intersección y la unión. Esta incorporación garantiza que los resultados de la búsqueda no sólo sean más precisos, sino también más relevantes. En términos prácticos, por ejemplo, en el sector del comercio electrónico, las etiquetas de productos almacenadas como matrices de cadenas permiten a los consumidores realizar búsquedas avanzadas, filtrando los resultados irrelevantes.</p>
<p>Sumérjase en nuestra completa <a href="https://milvus.io/docs/array_data_type.md">documentación</a> para obtener una guía detallada sobre el aprovechamiento de los tipos Array en Milvus.</p>
<h2 id="Support-for-complex-delete-expressions---improving-your-data-management" class="common-anchor-header">Compatibilidad con expresiones de eliminación complejas: mejora de la gestión de datos<button data-href="#Support-for-complex-delete-expressions---improving-your-data-management" class="anchor-icon" translate="no">
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
    </button></h2><p>En versiones anteriores, Milvus soportaba expresiones de borrado de clave primaria, proporcionando una arquitectura estable y racionalizada. Con Milvus 2.3.2 o 2.3.3, los usuarios pueden emplear expresiones de borrado complejas, facilitando tareas sofisticadas de gestión de datos como la limpieza continua de datos antiguos o el borrado de datos conforme a GDPR basado en ID de usuario.</p>
<p>Nota: Asegúrese de haber cargado las colecciones antes de utilizar expresiones complejas. Además, es importante tener en cuenta que el proceso de eliminación no garantiza la atomicidad.</p>
<h2 id="TiKV-integration---scalable-metadata-storage-with-stability" class="common-anchor-header">Integración de TiKV: almacenamiento de metadatos escalable y estable<button data-href="#TiKV-integration---scalable-metadata-storage-with-stability" class="anchor-icon" translate="no">
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
    </button></h2><p>Al depender anteriormente de Etcd para el almacenamiento de metadatos, Milvus se enfrentaba a problemas de capacidad limitada y escalabilidad en el almacenamiento de metadatos. Para resolver estos problemas, Milvus añadió TiKV, un almacén de valores clave de código abierto, como una opción más para el almacenamiento de metadatos. TiKV ofrece mayor escalabilidad, estabilidad y eficiencia, lo que lo convierte en una solución ideal para los requisitos cambiantes de Milvus. A partir de Milvus 2.3.2, los usuarios pueden pasar sin problemas a TiKV para su almacenamiento de metadatos modificando la configuración.</p>
<h2 id="Support-for-FP16-vector-type---embracing-machine-learning-efficiency" class="common-anchor-header">Compatibilidad con el tipo de vector FP16: adopción de la eficiencia del aprendizaje automático<button data-href="#Support-for-FP16-vector-type---embracing-machine-learning-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3.2 y versiones posteriores soportan ahora el tipo de vector FP16 a nivel de interfaz. FP16, o punto flotante de 16 bits, es un formato de datos ampliamente utilizado en el aprendizaje profundo y el aprendizaje automático, que proporciona una representación y un cálculo eficientes de los valores numéricos. Si bien el soporte completo para FP16 está en marcha, varios índices en la capa de indexación requieren convertir FP16 a FP32 durante la construcción.</p>
<p>Daremos soporte completo a los tipos de datos FP16, BF16 e int8 en versiones posteriores de Milvus. Permanezca atento.</p>
<h2 id="Significant-improvement-in-the-rolling-upgrade-experience---seamless-transition-for-users" class="common-anchor-header">Mejora significativa en la experiencia de actualización continua - transición sin problemas para los usuarios<button data-href="#Significant-improvement-in-the-rolling-upgrade-experience---seamless-transition-for-users" class="anchor-icon" translate="no">
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
    </button></h2><p>La actualización continua es una característica fundamental para los sistemas distribuidos, ya que permite actualizar el sistema sin interrumpir los servicios empresariales ni sufrir tiempos de inactividad. En las últimas versiones de Milvus, hemos reforzado la función de actualización continua de Milvus, garantizando una transición más ágil y eficiente para los usuarios que actualicen de la versión 2.2.15 a la 2.3.3 y a todas las versiones posteriores. La comunidad también ha invertido en extensas pruebas y optimizaciones, reduciendo el impacto de la consulta durante la actualización a menos de 5 minutos, proporcionando a los usuarios una experiencia sin complicaciones.</p>
<h2 id="Performance-optimization" class="common-anchor-header">Optimización del rendimiento<button data-href="#Performance-optimization" class="anchor-icon" translate="no">
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
    </button></h2><p>Además de introducir nuevas funciones, hemos optimizado significativamente el rendimiento de Milvus en las dos últimas versiones.</p>
<ul>
<li><p>Minimización de las operaciones de copia de datos para optimizar la carga de datos.</p></li>
<li><p>Se han simplificado las inserciones de gran capacidad mediante la lectura varchar por lotes.</p></li>
<li><p>Se han eliminado las comprobaciones de desplazamiento innecesarias durante el relleno de datos para mejorar el rendimiento de la fase de recuperación.</p></li>
<li><p>Se han solucionado los problemas de alto consumo de CPU en escenarios con grandes inserciones de datos.</p></li>
</ul>
<p>Estas optimizaciones contribuyen colectivamente a una experiencia Milvus más rápida y eficiente. Eche un vistazo a nuestro panel de control para ver cómo Milvus ha mejorado su rendimiento.</p>
<h2 id="Incompatible-changes" class="common-anchor-header">Cambios incompatibles<button data-href="#Incompatible-changes" class="anchor-icon" translate="no">
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
<li><p>Eliminado permanentemente el código relacionado con TimeTravel.</p></li>
<li><p>Soporte obsoleto para MySQL como almacén de metadatos.</p></li>
</ul>
<p>Consulte <a href="https://milvus.io/docs/release_notes.md">las notas de la versión de</a> Milvus para obtener información más detallada sobre todas las nuevas funciones y mejoras.</p>
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
    </button></h2><p>Con las últimas versiones de Milvus 2.3.2 y 2.3.3, nos comprometemos a proporcionar una solución de base de datos robusta, rica en funciones y de alto rendimiento. Explore estas nuevas características, aproveche las optimizaciones y únase a nosotros en este emocionante viaje a medida que evolucionamos Milvus para satisfacer las demandas de la gestión de datos moderna. Descargue ahora la última versión y experimente el futuro del almacenamiento de datos con Milvus.</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">Mantengámonos en contacto<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
