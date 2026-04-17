---
id: >-
  unlocking-8×-milvus-performance-with-cloudian-hyperstore-and-nvidia-rdma-for-s3-storage.md
title: >-
  Rendimiento 8× Milvus con Cloudian HyperStore y NVIDIA RDMA para
  almacenamiento S3
author: Jon Toor
date: 2025-11-17T00:00:00.000Z
cover: assets.zilliz.com/cloudian_931ffc8646.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Cloudian, NVIDIA, RDMA for S3-compatible storage, Milvus'
meta_title: 8× Milvus Boost with Cloudian HyperStore and NVIDIA RDMA
desc: >-
  Cloudian y NVIDIA introducen RDMA para almacenamiento compatible con S3,
  acelerando las cargas de trabajo de IA con baja latencia y permitiendo un
  aumento del rendimiento de 8× en Milvus.
origin: >-
  https://cloudian.com/blog/cloudian-deploys-new-nvidia-rdma-for-s3-compatible-storage-a-game-changer-for-ai-storage-performance/
---
<p><em>Este post se publicó originalmente en <a href="https://cloudian.com/blog/cloudian-deploys-new-nvidia-rdma-for-s3-compatible-storage-a-game-changer-for-ai-storage-performance/">Cloudian</a> y se vuelve a publicar aquí con permiso.</em></p>
<p>Cloudian ha colaborado con NVIDIA para añadir soporte de RDMA para almacenamiento compatible con S3 a su solución HyperStore®, aprovechando sus más de 13 años de experiencia en la implementación de la API de S3. Como plataforma basada en S3-API con arquitectura de procesamiento paralelo, Cloudian está especialmente capacitada para contribuir y capitalizar el desarrollo de esta tecnología. Esta colaboración aprovecha la profunda experiencia de Cloudian en protocolos de almacenamiento de objetos y el liderazgo de NVIDIA en aceleración de computación y redes para crear una solución que integre a la perfección la computación de alto rendimiento con el almacenamiento a escala empresarial.</p>
<p>NVIDIA ha anunciado la próxima disponibilidad general de la tecnología RDMA para almacenamiento compatible con S3 (Remote Direct Memory Access), lo que marcará un hito importante en la evolución de la infraestructura de IA. Esta revolucionaria tecnología promete transformar la forma en que las organizaciones manejan los requisitos de datos masivos de las cargas de trabajo de IA modernas, proporcionando mejoras de rendimiento sin precedentes y manteniendo la escalabilidad y simplicidad que han hecho del almacenamiento de objetos compatible con S3 la base de la computación en nube.</p>
<h2 id="What-is-RDMA-for-S3-compatible-storage" class="common-anchor-header">¿Qué es RDMA para el almacenamiento compatible con S3?<button data-href="#What-is-RDMA-for-S3-compatible-storage" class="anchor-icon" translate="no">
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
    </button></h2><p>Este lanzamiento representa un avance fundamental en la forma en que los sistemas de almacenamiento se comunican con los aceleradores de IA. La tecnología permite la transferencia directa de datos entre el almacenamiento de objetos compatible con la API de S3 y la memoria de la GPU, evitando por completo las rutas de datos tradicionales mediadas por la CPU. A diferencia de las arquitecturas de almacenamiento convencionales, que dirigen todas las transferencias de datos a través de la CPU y la memoria del sistema -lo que genera cuellos de botella y latencia-, RDMA para almacenamiento compatible con S3 establece una autopista directa del almacenamiento a la GPU.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RDMA_for_S3_compatible_storage_18fdd69d02.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>En esencia, esta tecnología elimina los pasos intermedios con una ruta directa que reduce la latencia, disminuye drásticamente las demandas de procesamiento de la CPU y reduce significativamente el consumo de energía. El resultado son sistemas de almacenamiento que pueden suministrar datos a la velocidad que las GPU modernas necesitan para las exigentes aplicaciones de IA.</p>
<p>La tecnología mantiene la compatibilidad con las omnipresentes API de S3 al tiempo que añade esta ruta de datos de alto rendimiento. Los comandos se siguen emitiendo a través de los protocolos de almacenamiento estándar basados en la API de S3, pero la transferencia de datos en sí se produce a través de RDMA directamente a la memoria de la GPU, evitando por completo la CPU y eliminando la sobrecarga del procesamiento del protocolo TCP.</p>
<h2 id="Breakthrough-Performance-Results" class="common-anchor-header">Resultados de rendimiento revolucionarios<button data-href="#Breakthrough-Performance-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>Las mejoras de rendimiento proporcionadas por RDMA para el almacenamiento compatible con S3 son nada menos que transformadoras. Las pruebas reales demuestran la capacidad de la tecnología para eliminar los cuellos de botella de E/S del almacenamiento que limitan las cargas de trabajo de IA.</p>
<h3 id="Dramatic-Speed-Improvements" class="common-anchor-header">Dramáticas mejoras de velocidad:</h3><ul>
<li><p><strong>Rendimiento</strong> medido<strong>de 35 GB/s por nodo</strong> (lecturas), con escalabilidad lineal entre clústeres.</p></li>
<li><p><strong>Escalabilidad a TBs/s</strong> con la arquitectura de procesamiento paralelo de Cloudian</p></li>
<li><p><strong>Mejora del rendimiento de 3 a 5 veces</strong> en comparación con el almacenamiento de objetos convencional basado en TCP.</p></li>
</ul>
<h3 id="Resource-Efficiency-Gains" class="common-anchor-header">Aumento de la eficiencia de los recursos:</h3><ul>
<li><p><strong>Reducción del 90% en la utilización de la CPU</strong> al establecer rutas de datos directas a las GPU</p></li>
<li><p><strong>Aumento de la utilización de la GPU</strong> al eliminar los cuellos de botella</p></li>
<li><p>Reducción drástica del consumo de energía gracias a la reducción de la sobrecarga de procesamiento</p></li>
<li><p>Reducción de costes para el almacenamiento de IA</p></li>
</ul>
<h3 id="8X-Performance-Boost-on-Milvus-by-Zilliz-Vector-DB" class="common-anchor-header">Aumento del rendimiento 8 veces superior en Milvus by Zilliz Vector DB</h3><p>Estas mejoras de rendimiento son especialmente evidentes en las operaciones de bases de datos vectoriales, donde la colaboración entre Cloudian y Zilliz utilizando <a href="https://www.nvidia.com/en-us/data-center/l40s/">las GPU NVIDIA</a> <a href="https://developer.nvidia.com/cuvs">cuVS</a> y <a href="https://www.nvidia.com/en-us/data-center/l40s/">NVIDIA L40S</a> demostró un <strong>aumento del rendimiento 8 veces superior en las operaciones Milvus</strong> en comparación con los sistemas basados en CPU y la transferencia de datos basada en TCP. Esto representa un cambio fundamental, ya que el almacenamiento pasa de ser una limitación a permitir que las aplicaciones de IA alcancen todo su potencial.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_indexing_time_354bdd4b46.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-S3-API-based-Object-Storage-for-AI-Workloads" class="common-anchor-header">Por qué el almacenamiento de objetos basado en la API de S3 para cargas de trabajo de IA<button data-href="#Why-S3-API-based-Object-Storage-for-AI-Workloads" class="anchor-icon" translate="no">
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
    </button></h2><p>La convergencia de la tecnología RDMA con la arquitectura de almacenamiento de objetos crea la base ideal para la infraestructura de IA, abordando múltiples retos que han limitado los enfoques de almacenamiento tradicionales.</p>
<p><strong>Escalabilidad de exabytes para la explosión de datos de IA:</strong> Las cargas de trabajo de IA, especialmente las que implican datos sintéticos y multimodales, están empujando los requisitos de almacenamiento al rango de los 100 petabytes y más. El espacio de direcciones plano del almacenamiento de objetos se escala sin problemas de petabytes a exabytes, dando cabida al crecimiento exponencial de los conjuntos de datos de entrenamiento de IA sin las limitaciones jerárquicas que restringen los sistemas basados en archivos.</p>
<p><strong>Plataforma unificada para flujos de trabajo de IA completos:</strong> Las operaciones modernas de IA abarcan la ingesta de datos, la limpieza, la formación, la comprobación y la inferencia, cada una de ellas con distintos requisitos de rendimiento y capacidad. El almacenamiento de objetos compatible con S3 admite todo este espectro a través de un acceso API coherente, lo que elimina la complejidad y el coste de gestionar varios niveles de almacenamiento. Los datos de formación, los modelos, los archivos de puntos de comprobación y los conjuntos de datos de inferencia pueden residir en un único lago de datos de alto rendimiento.</p>
<p><strong>Metadatos enriquecidos para operaciones de IA:</strong> Las operaciones críticas de IA, como la búsqueda y la enumeración, se basan fundamentalmente en metadatos. Las funciones de metadatos personalizables y enriquecidos del almacenamiento de objetos permiten etiquetar, buscar y gestionar los datos de forma eficaz, lo que resulta esencial para organizar y recuperar datos en flujos de trabajo complejos de formación e inferencia de modelos de IA.</p>
<p><strong>Ventajas económicas y operativas:</strong> El almacenamiento de objetos compatible con S3 ofrece un coste total de propiedad hasta un 80% inferior en comparación con las alternativas de almacenamiento de archivos, aprovechando el hardware estándar del sector y el escalado independiente de la capacidad y el rendimiento. Esta eficiencia económica resulta crucial a medida que los conjuntos de datos de IA alcanzan escala empresarial.</p>
<p><strong>Seguridad y gobernanza empresarial:</strong> A diferencia de las implementaciones GPUDirect que requieren modificaciones a nivel de kernel, RDMA para el almacenamiento compatible con S3 no requiere cambios de kernel específicos del proveedor, manteniendo la seguridad del sistema y el cumplimiento normativo. Este enfoque es especialmente valioso en sectores como la sanidad y las finanzas, donde la seguridad de los datos y el cumplimiento de la normativa son primordiales.</p>
<h2 id="The-Road-Ahead" class="common-anchor-header">El camino por recorrer<button data-href="#The-Road-Ahead" class="anchor-icon" translate="no">
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
    </button></h2><p>El anuncio por parte de NVIDIA de la disponibilidad general de RDMA para almacenamiento compatible con S3 representa algo más que un hito tecnológico: señala la maduración de la arquitectura de infraestructuras de IA. Al combinar la escalabilidad ilimitada del almacenamiento de objetos con el extraordinario rendimiento del acceso directo a la GPU, las organizaciones pueden construir infraestructuras de IA que se adapten a sus ambiciones.</p>
<p>A medida que las cargas de trabajo de IA siguen creciendo en complejidad y escala, RDMA para el almacenamiento compatible con S3 proporciona la base de almacenamiento que permite a las organizaciones maximizar sus inversiones en IA, manteniendo la soberanía de los datos y la simplicidad operativa. La tecnología transforma el almacenamiento de un cuello de botella a un habilitador, permitiendo que las aplicaciones de IA alcancen su máximo potencial a escala empresarial.</p>
<p>Para las organizaciones que planifican su hoja de ruta de infraestructura de IA, la disponibilidad general de RDMA para almacenamiento compatible con S3 marca el comienzo de una nueva era en la que el rendimiento del almacenamiento realmente se ajusta a las demandas de las cargas de trabajo de IA modernas.</p>
<h2 id="Industry-Perspectives" class="common-anchor-header">Perspectivas del sector<button data-href="#Industry-Perspectives" class="anchor-icon" translate="no">
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
    </button></h2><p>A medida que la IA se vuelve cada vez más importante para la prestación de asistencia sanitaria, buscamos continuamente aumentar el rendimiento y la eficiencia de nuestra infraestructura. El nuevo RDMA para almacenamiento compatible con S3 de NVIDIA y Cloudian será fundamental para nuestras aplicaciones de análisis de imágenes médicas y diagnóstico de IA, donde el procesamiento rápido de grandes conjuntos de datos puede tener un impacto directo en la atención al paciente, al tiempo que reduce los costes de mover datos entre dispositivos de almacenamiento basados en S3-API y almacenamientos NAS basados en SSD".  - <em>Dr. Swapnil Rane MD, DNB, PDCC (Nephropath), Mres (TCM), Fellowship in Oncopath, FRCPath Profesor (F) de Patología, PI, AI/Computational Pathology And Imaging Lab OIC- Departamento de Oncología Digital y Computacional, Tata Memorial Centre</em></p>
<p>"El anuncio de NVIDIA de RDMA compatible con S3 confirma el valor de nuestra estrategia de infraestructura de IA basada en Cloudian. Permitimos a las organizaciones ejecutar IA de alto rendimiento a escala al tiempo que preservamos la compatibilidad con la API de S3 que mantiene la migración simple y los costos de desarrollo de aplicaciones bajos." - <em>Sunil Gupta, cofundador, director general y consejero delegado (CEO) de Yotta Data Services</em>.</p>
<p>"A medida que ampliamos nuestras capacidades locales para ofrecer IA soberana, la tecnología de almacenamiento compatible con RDMA para S3 de NVIDIA y el almacenamiento de objetos de alto rendimiento de Cloudian nos dan el rendimiento que necesitamos sin comprometer la residencia de datos y sin requerir ninguna modificación a nivel del kernel. La plataforma Cloudian HyperStore nos permite escalar a exabytes manteniendo nuestros datos sensibles de IA completamente bajo nuestro control." - <em>Logan Lee, vicepresidente ejecutivo y responsable de la nube, Kakao</em></p>
<p>"Estamos entusiasmados con el anuncio de NVIDIA del próximo lanzamiento de RDMA para almacenamiento GA compatible con S3. Nuestras pruebas con Cloudian mostraron una mejora del rendimiento de hasta 8X para las operaciones de bases de datos vectoriales, lo que permitirá a nuestros usuarios de Milvus by Zilliz lograr un rendimiento a escala de nube para cargas de trabajo de IA exigentes, manteniendo al mismo tiempo la soberanía total de los datos." - <em>Charles Xie, fundador y consejero delegado de Zilliz</em></p>
