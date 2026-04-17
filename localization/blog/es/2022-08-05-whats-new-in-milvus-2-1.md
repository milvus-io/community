---
id: 2022-08-05-whats-new-in-milvus-2-1.md
title: Novedades de Milvus 2.1 - Hacia la simplicidad y la rapidez
author: Xiaofan Luan
date: 2022-08-05T00:00:00.000Z
desc: >-
  Milvus, la base de datos vectorial de código abierto, presenta ahora mejoras
  de rendimiento y facilidad de uso que los usuarios llevaban tiempo esperando.
cover: assets.zilliz.com/What_s_New_in_2_1_2_a0660df2a5.png
tag: News
canonicalUrl: 'https://milvus.io/blog/2022-08-05-whats-new-in-milvus-2-1.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_1_2_a0660df2a5.png" alt="What's new in Milvus 2.1 - Towards simplicity and speed" class="doc-image" id="what's-new-in-milvus-2.1---towards-simplicity-and-speed" />
   </span> <span class="img-wrapper"> <span>Novedades de Milvus 2.1 - Hacia la simplicidad y la velocidad</span> </span></p>
<p>Estamos muy contentos de anunciar el<a href="https://milvus.io/docs/v2.1.x/release_notes.md">lanzamiento</a> de Milvus 2.1 después de seis meses de duro trabajo por parte de todos los colaboradores de nuestra comunidad Milvus. Esta importante iteración de la popular base de datos vectorial hace hincapié en el <strong>rendimiento</strong> y la <strong>facilidad de uso</strong>, dos de las palabras clave más importantes de nuestro enfoque. Hemos añadido soporte para cadenas, cola de mensajes Kafka y Milvus incrustado, así como una serie de mejoras en el rendimiento, la escalabilidad, la seguridad y la observabilidad. Milvus 2.1 es una actualización emocionante que tenderá un puente en la "última milla" desde el ordenador portátil del ingeniero de algoritmos hasta los servicios de búsqueda de similitud vectorial a nivel de producción.</p>
<custom-h1>Rendimiento - Más de 3,2 veces superior</custom-h1><h2 id="5ms-level-latency" class="common-anchor-header">Latencia de 5 ms<button data-href="#5ms-level-latency" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus ya admite la búsqueda aproximada del vecino más próximo (RNA), un salto sustancial respecto al método KNN tradicional. Sin embargo, los problemas de rendimiento y latencia siguen siendo un reto para los usuarios que necesitan enfrentarse a escenarios de recuperación de datos vectoriales a escala de miles de millones.</p>
<p>En Milvus 2.1, hay un nuevo protocolo de enrutamiento que ya no depende de las colas de mensajes en el enlace de recuperación, lo que reduce significativamente la latencia de recuperación para conjuntos de datos pequeños. Los resultados de nuestras pruebas muestran que Milvus reduce ahora su nivel de latencia a 5 ms, lo que satisface los requisitos de los enlaces en línea críticos, como la búsqueda de similitudes y la recomendación.</p>
<h2 id="Concurrency-control" class="common-anchor-header">Control de la concurrencia<button data-href="#Concurrency-control" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 perfecciona su modelo de concurrencia introduciendo un nuevo modelo de evaluación de costes y un programador de concurrencia. Ahora ofrece un control de la concurrencia que garantiza que no habrá un gran número de solicitudes concurrentes compitiendo por los recursos de la CPU y la caché, ni se infrautilizará la CPU porque no haya suficientes solicitudes. La nueva capa de programación inteligente de Milvus 2.1 también fusiona las consultas small-nq que tienen parámetros de solicitud coherentes, lo que proporciona un sorprendente aumento del rendimiento de 3,2 veces en escenarios con small-nq y alta concurrencia de consultas.</p>
<h2 id="In-memory-replicas" class="common-anchor-header">Réplicas en memoria<button data-href="#In-memory-replicas" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 incorpora réplicas en memoria que mejoran la escalabilidad y la disponibilidad para conjuntos de datos pequeños. Al igual que las réplicas de sólo lectura de las bases de datos tradicionales, las réplicas en memoria pueden escalarse horizontalmente añadiendo máquinas cuando el QPS de lectura es alto. En la recuperación de vectores para conjuntos de datos pequeños, un sistema de recomendación a menudo necesita proporcionar QPS que superen el límite de rendimiento de una sola máquina. Ahora bien, en estos escenarios, el rendimiento del sistema puede mejorarse significativamente cargando múltiples réplicas en la memoria. En el futuro, también introduciremos un mecanismo de lectura con cobertura basado en réplicas en memoria, que solicitará rápidamente otras copias funcionales en caso de que el sistema necesite recuperarse de fallos y haga pleno uso de la redundancia en memoria para mejorar la disponibilidad general del sistema.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_1_Figure_1_excalidraw_1f7fe3c998.png" alt="In-memory replicas allow query services to be based on separate
copies of the same data." class="doc-image" id="in-memory-replicas-allow-query-services-to-be-based-on-separate-copies-of-the-same-data." />
   </span> <span class="img-wrapper"> <span>Las réplicas en memoria permiten que los servicios de consulta se basen en copias separadas de los mismos datos</span>. </span></p>
<h2 id="Faster-data-loading" class="common-anchor-header">Carga de datos más rápida<button data-href="#Faster-data-loading" class="anchor-icon" translate="no">
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
    </button></h2><p>La última mejora del rendimiento procede de la carga de datos. Milvus 2.1 comprime ahora <a href="https://milvus.io/docs/v2.1.x/glossary.md#Log-snapshot">los registros binarios</a> con Zstandard (zstd), lo que reduce significativamente el tamaño de los datos en los almacenes de objetos y mensajes, así como la sobrecarga de la red durante la carga de datos. Además, ahora se introducen grupos de goroutines para que Milvus pueda cargar segmentos simultáneamente con huellas de memoria controladas y minimizar el tiempo necesario para recuperarse de fallos y cargar datos.</p>
<p>Los resultados completos de Milvus 2.1 se publicarán próximamente en nuestro sitio web. Permanezca atento.</p>
<h2 id="String-and-scalar-index-support" class="common-anchor-header">Soporte de cadenas e índices escalares<button data-href="#String-and-scalar-index-support" class="anchor-icon" translate="no">
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
    </button></h2><p>Con la versión 2.1, Milvus admite ahora cadenas de longitud variable (VARCHAR) como tipo de datos escalares. VARCHAR se puede utilizar como la clave primaria que se puede devolver como salida, y también puede actuar como filtros de atributos. <a href="https://milvus.io/docs/v2.1.x/hybridsearch.md">El filtrado de atributos</a> es una de las funciones más populares que necesitan los usuarios de Milvus. Si a menudo desea &quot;encontrar los productos más similares a un usuario en un rango de precios <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>de</mn><mo>200-200</mo></mrow><annotation encoding="application/x-tex">-</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">200-300</span></span></span></span>&quot;, o &quot;encontrar artículos que tengan la palabra clave 'base de datos vectorial' y estén relacionados con temas nativos de la nube&quot;, le encantará Milvus 2.1.</p>
<p>Milvus 2.1 también admite el índice escalar invertido para mejorar la velocidad de filtrado basado en<a href="https://github.com/s-yata/marisa-trie">MARISA-Tries</a><a href="https://www.cs.le.ac.uk/people/ond1/XMLcomp/confersWEA06_LOUDS.pdf">sucinta</a>como estructura de datos. Todos los datos pueden cargarse ahora en la memoria con una huella muy baja, lo que permite una comparación, filtrado y correspondencia de prefijos en cadenas mucho más rápidos. Los resultados de nuestras pruebas muestran que el requisito de memoria de MARISA-trie es sólo el 10% del de los diccionarios de Python para cargar todos los datos en memoria y proporcionar capacidades de consulta.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_new_in_Milvus_Figure_2_excalidraw_a1149aca96.png" alt="Milvus 2.1 combines MARISA-Trie with inverted index to significantly improve filtering speed." class="doc-image" id="milvus-2.1-combines-marisa-trie-with-inverted-index-to-significantly-improve-filtering-speed." />
   </span> <span class="img-wrapper"> <span>Milvus 2.1 combina MARISA-Trie con un índice invertido para mejorar significativamente la velocidad de filtrado.</span> </span></p>
<p>En el futuro, Milvus seguirá centrándose en los desarrollos relacionados con las consultas escalares, soportará más tipos de índices escalares y operadores de consulta, y proporcionará capacidades de consulta escalar basadas en disco, todo ello como parte de un esfuerzo continuo para reducir el almacenamiento y el coste de uso de los datos escalares.</p>
<custom-h1>Mejoras en la usabilidad</custom-h1><h2 id="Kafka-support" class="common-anchor-header">Compatibilidad con Kafka<button data-href="#Kafka-support" class="anchor-icon" translate="no">
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
    </button></h2><p>Nuestra comunidad ha estado solicitando durante mucho tiempo soporte para <a href="https://kafka.apache.org">Apache Kafka</a> como <a href="https://milvus.io/docs/v2.1.x/deploy_pulsar.md">almacenamiento de mensajes</a> en Milvus. Milvus 2.1 le ofrece ahora la opción de utilizar<a href="https://pulsar.apache.org">Pulsar</a> o Kafka como almacenamiento de mensajes basándose en las configuraciones del usuario, gracias al diseño de abstracción y encapsulación de Milvus y al Go Kafka SDK aportado por Confluent.</p>
<h2 id="Production-ready-Java-SDK" class="common-anchor-header">SDK Java listo para producción<button data-href="#Production-ready-Java-SDK" class="anchor-icon" translate="no">
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
    </button></h2><p>Con Milvus 2.1, nuestro <a href="https://github.com/milvus-io/milvus-sdk-java">Java SD</a> K ha sido lanzado oficialmente. El SDK de Java tiene exactamente las mismas capacidades que el SDK de Python, con un rendimiento de concurrencia incluso mejor. En el siguiente paso, los colaboradores de nuestra comunidad mejorarán gradualmente la documentación y los casos de uso del SDK de Java, y ayudarán a que los SDK de Go y RESTful también estén listos para la producción.</p>
<h2 id="Observability-and-maintainability" class="common-anchor-header">Observabilidad y mantenibilidad<button data-href="#Observability-and-maintainability" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 añade<a href="https://milvus.io/docs/v2.1.x/metrics_dashboard.md">métricas de</a> supervisión importantes como el recuento de inserción de vectores, latencia/rendimiento de búsqueda, sobrecarga de memoria de nodo y sobrecarga de CPU. Además, la nueva versión también optimiza significativamente el mantenimiento de registros ajustando los niveles de registro y reduciendo la impresión de registros inútiles.</p>
<h2 id="Embedded-Milvus" class="common-anchor-header">Milvus integrado<button data-href="#Embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus ha simplificado enormemente el despliegue de servicios de recuperación de datos vectoriales masivos a gran escala, pero para los científicos que desean validar algoritmos a menor escala, Docker o K8s siguen siendo demasiado complicados sin necesidad. Con la introducción de Milvus <a href="https://github.com/milvus-io/embd-milvus">embebido</a>, ahora puede instalar Milvus utilizando pip, al igual que con Pyrocksb y Pysqlite. Embedded Milvus soporta todas las funcionalidades de las versiones cluster y standalone, permitiéndole cambiar fácilmente de su portátil a un entorno de producción distribuido sin cambiar una sola línea de código. Los ingenieros de algoritmos tendrán una experiencia mucho mejor cuando construyan un prototipo con Milvus.</p>
<custom-h1>Pruebe ahora la búsqueda vectorial lista para usar</custom-h1><p>Además, Milvus 2.1 también tiene algunas grandes mejoras en estabilidad y escalabilidad, y esperamos con interés su uso y comentarios.</p>
<h2 id="Whats-next" class="common-anchor-header">Novedades<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
<li>Consulte las <a href="https://milvus.io/docs/v2.1.x/release_notes.md">Notas de la versión</a> detalladas para conocer todos los cambios de Milvus 2.1</li>
<li><a href="https://milvus.io/docs/v2.1.x/install_standalone-docker.md">Instale</a>Milvus 2.1 y pruebe las nuevas características</li>
<li>Únase a nuestra <a href="https://slack.milvus.io/">comunidad de Slack</a> y discuta las nuevas funciones con miles de usuarios de Milvus de todo el mundo.</li>
<li>Síganos en <a href="https://twitter.com/milvusio">Twitter</a> y<a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> para recibir actualizaciones una vez que se publiquen nuestros blogs sobre nuevas funciones específicas.</li>
</ul>
<blockquote>
<p>Editado por <a href="https://github.com/songxianj">Songxian Jiang</a></p>
</blockquote>
