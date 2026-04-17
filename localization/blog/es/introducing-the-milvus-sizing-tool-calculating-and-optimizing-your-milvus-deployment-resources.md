---
id: >-
  introducing-the-milvus-sizing-tool-calculating-and-optimizing-your-milvus-deployment-resources.md
title: >-
  Presentación de la herramienta de dimensionamiento de Milvus: Cálculo y
  optimización de sus recursos de despliegue de Milvus
author: 'Ken Zhang, Fendy Feng'
date: 2025-04-11T00:00:00.000Z
desc: >-
  Maximice el rendimiento de Milvus con nuestra sencilla herramienta de
  dimensionamiento. Aprenda a configurar su despliegue para un uso óptimo de los
  recursos y un ahorro de costes.
cover: assets.zilliz.com/Introducing_Milvus_Sizing_Tool_c0c98343a2.png
tag: Tutorials
recommend: false
canonicalUrl: 'https://zilliz.com/blog/demystify-milvus-sizing-tool'
---
<h2 id="Introduction" class="common-anchor-header">Introducción<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Seleccionar la configuración óptima para su despliegue de Milvus es crítico para la optimización del rendimiento, la utilización eficiente de los recursos y la gestión de costes. Ya sea que esté construyendo un prototipo o planificando un despliegue de producción, dimensionar correctamente su instancia de Milvus puede significar la diferencia entre una base de datos vectorial que funcione sin problemas y una que tenga problemas de rendimiento o incurra en costes innecesarios.</p>
<p>Para simplificar este proceso, hemos renovado nuestra <a href="https://milvus.io/tools/sizing">Herramienta de dimensionamiento de Milvus</a>, una calculadora fácil de usar que genera estimaciones de recursos recomendadas basadas en sus requisitos específicos. En esta guía, le guiaremos en el uso de la herramienta y le proporcionaremos información más detallada sobre los factores que influyen en el rendimiento de Milvus.</p>
<h2 id="How-to-Use-the-Milvus-Sizing-Tool" class="common-anchor-header">Cómo utilizar la herramienta de dimensionamiento de Milvus<button data-href="#How-to-Use-the-Milvus-Sizing-Tool" class="anchor-icon" translate="no">
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
    </button></h2><p>Es muy fácil utilizar esta herramienta de dimensionamiento. Sólo tiene que seguir los siguientes pasos.</p>
<ol>
<li><p>Visite la página<a href="https://milvus.io/tools/sizing/"> Milvus Sizing</a> Tool.</p></li>
<li><p>Introduzca sus parámetros clave:</p>
<ul>
<li><p>Número de vectores y dimensiones por vector</p></li>
<li><p>Tipo de índice</p></li>
<li><p>Tamaño de los datos del campo escalar</p></li>
<li><p>Tamaño del segmento</p></li>
<li><p>Su modo de despliegue preferido</p></li>
</ul></li>
<li><p>Revise las recomendaciones de recursos generadas</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_sizing_tool_3ca881b3d5.jpeg" alt="milvus sizing tool" class="doc-image" id="milvus-sizing-tool" />
   </span> <span class="img-wrapper"> <span>herramienta de dimensionamiento de milvus</span> </span></p>
<p>Exploremos cómo afecta cada uno de estos parámetros a su despliegue de Milvus.</p>
<h2 id="Index-Selection-Balancing-Storage-Cost-Accuracy-and-Speed" class="common-anchor-header">Selección de índices: Equilibrio entre almacenamiento, coste, precisión y velocidad<button data-href="#Index-Selection-Balancing-Storage-Cost-Accuracy-and-Speed" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus ofrece varios algoritmos de índice, incluyendo <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a>, FLAT, IVF_FLAT, IVF_SQ8, <a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">ScaNN</a>, <a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN</a> y más, cada uno con distintas compensaciones en el uso de memoria, requisitos de espacio en disco, velocidad de consulta y precisión de búsqueda.</p>
<p>Esto es lo que hay que saber sobre las opciones más comunes:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/index_dde661d579.jpeg" alt="index" class="doc-image" id="index" />
   </span> <span class="img-wrapper"> <span>índice</span> </span></p>
<p>HNSW (Pequeño mundo navegable jerárquico)</p>
<ul>
<li><p><strong>Arquitectura</strong>: Combina listas de exclusión con gráficos de mundos pequeños navegables (NSW) en una estructura jerárquica.</p></li>
<li><p><strong>Rendimiento</strong>: Consultas muy rápidas con excelentes índices de recuperación</p></li>
<li><p><strong>Consumo de recursos</strong>: Requiere la mayor cantidad de memoria por vector (coste más elevado)</p></li>
<li><p><strong>Ideal para</strong>: Aplicaciones en las que la velocidad y la precisión son fundamentales y las limitaciones de memoria son menos importantes.</p></li>
<li><p><strong>Nota técnica</strong>: La búsqueda comienza en la capa superior con menos nodos y desciende por capas cada vez más densas.</p></li>
</ul>
<p>PLANA</p>
<ul>
<li><p><strong>Arquitectura</strong>: Búsqueda exhaustiva simple sin aproximación</p></li>
<li><p><strong>Rendimiento</strong>: 100% de recuperación pero tiempos de consulta extremadamente lentos (<code translate="no">O(n)</code> para datos de tamaño <code translate="no">n</code>)</p></li>
<li><p><strong>Uso de recursos</strong>: El tamaño del índice es igual al tamaño de los datos vectoriales en bruto</p></li>
<li><p><strong>Ideal para</strong>: Conjuntos de datos pequeños o aplicaciones que requieren una recuperación perfecta</p></li>
<li><p><strong>Nota técnica</strong>: Realiza cálculos completos de distancia entre el vector de consulta y todos los vectores de la base de datos.</p></li>
</ul>
<p>IVF_FLAT</p>
<ul>
<li><p><strong>Arquitectura</strong>: Divide el espacio vectorial en clusters para una búsqueda más eficaz.</p></li>
<li><p><strong>Rendimiento</strong>: Recuperación media-alta con velocidad de consulta moderada (más lenta que HNSW pero más rápida que FLAT)</p></li>
<li><p><strong>Consumo de recursos</strong>: Requiere menos memoria que FLAT pero más que HNSW</p></li>
<li><p><strong>Ideal para</strong>: Aplicaciones equilibradas en las que se puede cambiar algo de recuperación por un mejor rendimiento.</p></li>
<li><p><strong>Nota técnica</strong>: Durante la búsqueda, sólo se examinan las agrupaciones de <code translate="no">nlist</code>, lo que reduce significativamente los cálculos.</p></li>
</ul>
<p>IVF_SQ8</p>
<ul>
<li><p><strong>Arquitectura</strong>: Aplica la cuantización escalar a IVF_FLAT, comprimiendo los datos vectoriales.</p></li>
<li><p><strong>Rendimiento</strong>: Recuperación media con velocidad de consulta media-alta</p></li>
<li><p><strong>Uso de recursos</strong>: Reduce el consumo de disco, cálculo y memoria en un 70-75% en comparación con IVF_FLAT</p></li>
<li><p><strong>Ideal para</strong>: Entornos con recursos limitados en los que la precisión puede verse ligeramente comprometida</p></li>
<li><p><strong>Nota técnica</strong>: Comprime valores de coma flotante de 32 bits en valores enteros de 8 bits.</p></li>
</ul>
<h3 id="Advanced-Index-Options-ScaNN-DiskANN-CAGRA-and-more" class="common-anchor-header">Opciones de índice avanzadas: ScaNN, DiskANN, CAGRA, etc.</h3><p>Para desarrolladores con requisitos especializados, Milvus también ofrece:</p>
<ul>
<li><p><a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google"><strong>ScaNN</strong></a>: 20% más rápido en CPU que HNSW con tasas de recuperación similares</p></li>
<li><p><a href="https://milvus.io/docs/disk_index.md"><strong>DiskANN</strong></a>: Un índice híbrido de disco/memoria que resulta ideal cuando se necesita admitir un gran número de vectores con una alta recuperación y se puede aceptar una latencia ligeramente superior (~100 ms). Equilibra el uso de memoria con el rendimiento manteniendo sólo una parte del índice en memoria mientras el resto permanece en disco.</p></li>
<li><p><strong>Índices basados en GPU</strong>:</p>
<ul>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">GPU_CAGRA</a>: es el más rápido de los índices GPU, pero requiere una tarjeta de inferencia con memoria GDDR en lugar de una con memoria HBM.</p></li>
<li><p>GPU_BRUTE_FORCE: Búsqueda exhaustiva implementada en la GPU</p></li>
<li><p>GPU_IVF_FLAT: Versión de IVF_FLAT acelerada en la GPU</p></li>
<li><p>GPU_IVF_PQ: versión de IVF con <a href="https://zilliz.com/learn/harnessing-product-quantization-for-memory-efficiency-in-vector-databases">cuantificación de productos</a> acelerada en la GPU</p></li>
</ul></li>
<li><p><strong>HNSW-PQ/SQ/PRQ</strong>:</p>
<ul>
<li><p><strong>HNSW_SQ</strong>: consulta de muy alta velocidad, recursos de memoria limitados; acepta un compromiso menor en la tasa de recuperación.</p></li>
<li><p><strong>HNSW_PQ</strong>: Consulta de velocidad media; recursos de memoria muy limitados; acepta un compromiso menor en la tasa de recuperación.</p></li>
<li><p><strong>HNSW_PRQ</strong>: Consulta a velocidad media; recursos de memoria muy limitados; acepta un compromiso menor en la tasa de recuperación.</p></li>
<li><p><strong>AUTOINDEX</strong>: Utiliza por defecto HNSW en Milvus de código abierto (o utiliza índices propietarios de mayor rendimiento en <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, el Milvus gestionado).</p></li>
</ul></li>
<li><p><strong>Índices binarios, dispersos y otros índices especializados</strong>: Para tipos de datos y casos de uso específicos. Consulte <a href="https://milvus.io/docs/index.md">esta página de documentación sobre índices</a> para obtener más detalles.</p></li>
</ul>
<h2 id="Segment-Size-and-Deployment-Configuration" class="common-anchor-header">Tamaño del segmento y configuración del despliegue<button data-href="#Segment-Size-and-Deployment-Configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>Los segmentos son los bloques de construcción fundamentales de la organización interna de datos de Milvus. Funcionan como trozos de datos que permiten la búsqueda distribuida y el equilibrio de carga a través de su despliegue. Esta herramienta de dimensionamiento de Milvus ofrece tres opciones de tamaño de segmento (512 MB, 1024 MB, 2048 MB), con 1024 MB como valor predeterminado.</p>
<p>Comprender los segmentos es crucial para la optimización del rendimiento. Como pauta general</p>
<ul>
<li><p>Segmentos de 512 MB: Lo mejor para nodos de consulta con 4-8 GB de memoria</p></li>
<li><p>Segmentos de 1 GB: Óptimo para nodos de consulta con 8-16 GB de memoria</p></li>
<li><p>Segmentos de 2 GB: Recomendado para nodos de consulta con &gt;16 GB de memoria</p></li>
</ul>
<p>Información para desarrolladores: Menos segmentos y más grandes suelen ofrecer un rendimiento de búsqueda más rápido. Para implantaciones a gran escala, los segmentos de 2 GB suelen ofrecer el mejor equilibrio entre eficiencia de memoria y velocidad de consulta.</p>
<h2 id="Message-Queue-System-Selection" class="common-anchor-header">Selección del sistema de colas de mensajes<button data-href="#Message-Queue-System-Selection" class="anchor-icon" translate="no">
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
    </button></h2><p>A la hora de elegir entre Pulsar y Kafka como sistema de mensajería:</p>
<ul>
<li><p><strong>Pulsar</strong>: Recomendado para nuevos proyectos debido a una menor sobrecarga por tema y una mejor escalabilidad.</p></li>
<li><p><strong>Kafka</strong>: Puede ser preferible si ya tiene experiencia o infraestructura de Kafka en su organización</p></li>
</ul>
<h2 id="Enterprise-Optimizations-in-Zilliz-Cloud" class="common-anchor-header">Optimizaciones empresariales en Zilliz Cloud<button data-href="#Enterprise-Optimizations-in-Zilliz-Cloud" class="anchor-icon" translate="no">
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
    </button></h2><p>Para despliegues de producción con estrictos requisitos de rendimiento, Zilliz Cloud (la versión empresarial y totalmente gestionada de Milvus en la nube) ofrece optimizaciones adicionales en indexación y cuantificación:</p>
<ul>
<li><p><strong>Prevención de falta de memoria (OOM):</strong> Gestión sofisticada de la memoria para evitar bloqueos por falta de memoria.</p></li>
<li><p><strong>Optimización de la compactación</strong>: Mejora el rendimiento de la búsqueda y la utilización de los recursos</p></li>
<li><p><strong>Almacenamiento por niveles</strong>: Gestión eficiente de los datos calientes y fríos con las unidades de cálculo adecuadas</p>
<ul>
<li><p>Unidades de cálculo (CU) estándar para los datos a los que se accede con más frecuencia</p></li>
<li><p>CUs de almacenamiento por niveles para un almacenamiento rentable de los datos a los que se accede con poca frecuencia</p></li>
</ul></li>
</ul>
<p>Para obtener información detallada sobre las opciones de dimensionamiento de la empresa, visite la<a href="https://docs.zilliz.com/docs/select-zilliz-cloud-service-plans"> documentación de los planes de servicio de Zilliz Cloud</a>.</p>
<h2 id="Advanced-Configuration-Tips-for-Developers" class="common-anchor-header">Consejos de configuración avanzada para desarrolladores<button data-href="#Advanced-Configuration-Tips-for-Developers" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li><p><strong>Múltiples tipos de índices</strong>: La herramienta de dimensionamiento se centra en un único índice. Para aplicaciones complejas que requieren diferentes algoritmos de índice para varias colecciones, cree colecciones separadas con configuraciones personalizadas.</p></li>
<li><p><strong>Asignación de memoria</strong>: Cuando planifique su implantación, tenga en cuenta los requisitos de memoria tanto de los datos vectoriales como de los índices. Normalmente, HNSW requiere entre 2 y 3 veces la memoria de los datos vectoriales sin procesar.</p></li>
<li><p><strong>Pruebas de rendimiento</strong>: Antes de finalizar la configuración, evalúe sus patrones de consulta específicos en un conjunto de datos representativo.</p></li>
<li><p><strong>Consideraciones de escala</strong>: Tenga en cuenta el crecimiento futuro. Es más fácil empezar con algo más de recursos que tener que reconfigurar más adelante.</p></li>
</ol>
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
    </button></h2><p>La<a href="https://milvus.io/tools/sizing/"> herramienta Milvus Sizing Tool</a> proporciona un excelente punto de partida para la planificación de recursos, pero recuerde que cada aplicación tiene requisitos únicos. Para obtener un rendimiento óptimo, deberá ajustar su configuración en función de las características específicas de su carga de trabajo, patrones de consulta y necesidades de escalado.</p>
<p>Mejoramos continuamente nuestras herramientas y documentación basándonos en los comentarios de los usuarios. Si tiene preguntas o necesita más ayuda con el dimensionamiento de su despliegue de Milvus, póngase en contacto con nuestra comunidad en<a href="https://github.com/milvus-io/milvus/discussions"> GitHub</a> o<a href="https://discord.com/invite/8uyFbECzPX"> Discord</a>.</p>
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
<li><p><a href="https://thesequence.substack.com/p/guest-post-choosing-the-right-vector">📝 Cómo elegir el índice vectorial adecuado para tu proyecto</a></p></li>
<li><p><a href="https://milvus.io/docs/index.md?tab=floating">Índice en memoria | Documentación de Milvus</a></p></li>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">Presentación de Milvus CAGRA: Elevación de la búsqueda vectorial con indexación en la GPU</a></p></li>
<li><p><a href="https://zilliz.com/pricing#estimate_your_cost">Calculadora de precios en la nube de Zilliz</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md">Cómo empezar con Milvus </a></p></li>
<li><p><a href="https://docs.zilliz.com/docs/resource-planning">Zilliz Cloud Resource Planning | Cloud | Zilliz Cloud Developer Hub</a></p></li>
</ul>
