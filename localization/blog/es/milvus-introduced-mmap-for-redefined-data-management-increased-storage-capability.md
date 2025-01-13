---
id: >-
  milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability.md
title: >-
  Milvus presenta MMap para una gestión de datos redefinida y una mayor
  capacidad de almacenamiento
author: Yang Cen
date: 2023-11-15T00:00:00.000Z
desc: >-
  La función MMap de Milvus permite a los usuarios manejar más datos dentro de
  una memoria limitada, logrando un delicado equilibrio entre rendimiento, coste
  y límites del sistema.
cover: assets.zilliz.com/Exploring_M_Map_5086d652bd.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, MMap, Data Management, Vector Embeddings
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Exploring_M_Map_5086d652bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvus</a> es la solución más rápida en <a href="https://zilliz.com/blog/what-is-a-real-vector-database">bases de datos vectoriales</a> de código abierto, que atiende a usuarios con necesidades de rendimiento intensivo. Sin embargo, la diversidad de necesidades de los usuarios refleja los datos con los que trabajan. Algunos priorizan las soluciones económicas y el almacenamiento expansivo sobre la velocidad pura y dura. Entendiendo este espectro de demandas, Milvus introduce la característica MMap, redefiniendo cómo manejamos grandes volúmenes de datos a la vez que prometemos rentabilidad sin sacrificar funcionalidad.</p>
<h2 id="What-is-MMap" class="common-anchor-header">¿Qué es MMap?<button data-href="#What-is-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>MMap, abreviatura de memory-mapped files (archivos mapeados en memoria), tiende un puente entre los archivos y la memoria dentro de los sistemas operativos. Esta tecnología permite a Milvus mapear archivos de gran tamaño directamente en el espacio de memoria del sistema, transformando los archivos en bloques de memoria contiguos. Esta integración elimina la necesidad de operaciones explícitas de lectura o escritura, cambiando fundamentalmente la forma en que Milvus gestiona los datos. Garantiza un acceso sin fisuras y un almacenamiento eficiente para archivos de gran tamaño o situaciones en las que los usuarios necesitan acceder a archivos de forma aleatoria.</p>
<h2 id="Who-benefits-from-MMap" class="common-anchor-header">¿A quién beneficia MMap?<button data-href="#Who-benefits-from-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>Las bases de datos vectoriales exigen una capacidad de memoria considerable debido a los requisitos de almacenamiento de los datos vectoriales. Con la función MMap, procesar más datos dentro de una memoria limitada se convierte en una realidad. Sin embargo, esta mayor capacidad tiene un coste de rendimiento. El sistema gestiona la memoria de forma inteligente, desalojando algunos datos en función de la carga y el uso. Este desalojo permite a Milvus procesar más datos con la misma capacidad de memoria.</p>
<p>Durante nuestras pruebas, observamos que con una memoria amplia, todos los datos residen en la memoria tras un periodo de calentamiento, preservando el rendimiento del sistema. Sin embargo, a medida que aumenta el volumen de datos, el rendimiento disminuye gradualmente. <strong>Por lo tanto, recomendamos la función MMap a los usuarios menos sensibles a las fluctuaciones de rendimiento.</strong></p>
<h2 id="Enabling-MMap-in-Milvus-a-simple-configuration" class="common-anchor-header">Activar MMap en Milvus: una configuración sencilla<button data-href="#Enabling-MMap-in-Milvus-a-simple-configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>Activar MMap en Milvus es notablemente sencillo. Todo lo que tiene que hacer es modificar el archivo <code translate="no">milvus.yaml</code>: añada el elemento <code translate="no">mmapDirPath</code> en la configuración <code translate="no">queryNode</code> y establezca una ruta válida como valor.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/enabling_mmap_a2df88276b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Striking-the-balance-performance-storage-and-system-limits" class="common-anchor-header">Encontrar el equilibrio: rendimiento, almacenamiento y límites del sistema<button data-href="#Striking-the-balance-performance-storage-and-system-limits" class="anchor-icon" translate="no">
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
    </button></h2><p>Los patrones de acceso a los datos afectan significativamente al rendimiento. La función MMap de Milvus optimiza el acceso a los datos basándose en la localidad. MMap permite a Milvus escribir datos escalares directamente en el disco para segmentos de datos a los que se accede secuencialmente. Los datos de longitud variable, como las cadenas, se aplanan y se indexan utilizando una matriz de offsets en memoria. Este método garantiza la localización de los datos y elimina la sobrecarga de almacenar cada dato de longitud variable por separado. La optimización de los índices vectoriales es meticulosa. El MMap se emplea de forma selectiva para los datos vectoriales, conservando las listas de adyacencia en memoria, lo que permite ahorrar una cantidad significativa de memoria sin comprometer el rendimiento.</p>
<p>Además, MMap maximiza el procesamiento de datos minimizando el uso de memoria. A diferencia de las versiones anteriores de Milvus, en las que QueryNode copiaba conjuntos de datos enteros, MMap adopta un proceso de streaming racionalizado y sin copias durante el desarrollo. Esta optimización reduce drásticamente la sobrecarga de memoria.</p>
<p><strong>Los resultados de nuestras pruebas internas demuestran que Milvus puede gestionar eficazmente el doble de volumen de datos cuando se habilita MMap.</strong></p>
<h2 id="The-road-ahead-continuous-innovation-and-user-centric-enhancements" class="common-anchor-header">El camino por recorrer: innovación continua y mejoras centradas en el usuario<button data-href="#The-road-ahead-continuous-innovation-and-user-centric-enhancements" class="anchor-icon" translate="no">
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
    </button></h2><p>Aunque la función MMap se encuentra en fase beta, el equipo de Milvus está comprometido con la mejora continua. Las futuras actualizaciones perfeccionarán el uso de memoria del sistema, lo que permitirá a Milvus soportar volúmenes de datos aún mayores en un único nodo. Los usuarios pueden anticipar un control más granular sobre la función MMap, permitiendo cambios dinámicos en las colecciones y modos avanzados de carga de campos. Estas mejoras proporcionan una flexibilidad sin precedentes, permitiendo a los usuarios adaptar sus estrategias de procesamiento de datos a requisitos específicos.</p>
<h2 id="Conclusion-redefining-data-processing-excellence-with-Milvus-MMap" class="common-anchor-header">Conclusión: redefinir la excelencia del procesamiento de datos con Milvus MMap<button data-href="#Conclusion-redefining-data-processing-excellence-with-Milvus-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>La función MMap de Milvus 2.3 marca un salto significativo en la tecnología de procesamiento de datos. Al lograr un delicado equilibrio entre rendimiento, coste y límites del sistema, Milvus permite a los usuarios manejar grandes cantidades de datos de forma eficaz y rentable. A medida que Milvus sigue evolucionando, se mantiene a la vanguardia de las soluciones innovadoras, redefiniendo los límites de lo que se puede conseguir en la gestión de datos.</p>
<p>Esté atento a los desarrollos más innovadores a medida que Milvus continúa su viaje hacia la excelencia en el procesamiento de datos sin precedentes.</p>
