---
id: elasticsearch-is-dead-long-live-lexical-search.md
title: 'Elasticsearch ha muerto, larga vida a la búsqueda léxica'
author: James Luan
date: 2024-12-17T00:00:00.000Z
cover: >-
  assets.zilliz.com/Elasticsearch_is_Dead_Long_Live_Lexical_Search_0fa15cd6d7.png
tag: Engineering
tags: Milvus
recommend: false
canonicalUrl: 'https://milvus.io/blog/elasticsearch-is-dead-long-live-lexical-search.md'
---
<p>A estas alturas, todo el mundo sabe que la búsqueda híbrida ha mejorado la calidad de la búsqueda <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> (Retrieval-Augmented Generation). Aunque la búsqueda <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">de incrustación densa</a> ha demostrado una capacidad impresionante para captar relaciones semánticas profundas entre consultas y documentos, sigue teniendo notables limitaciones. Entre ellas, la falta de explicabilidad y un rendimiento subóptimo con consultas de cola larga y términos poco frecuentes.</p>
<p>Muchas aplicaciones RAG tienen dificultades porque los modelos preentrenados suelen carecer de conocimientos específicos del dominio. En algunos casos, la simple concordancia de palabras clave BM25 supera a estos sofisticados modelos. Aquí es donde la búsqueda híbrida salva las distancias, combinando la comprensión semántica de la recuperación de vectores densos con la precisión de la concordancia de palabras clave.</p>
<h2 id="Why-Hybrid-Search-is-Complex-in-Production" class="common-anchor-header">Por qué la búsqueda híbrida es compleja en la producción<button data-href="#Why-Hybrid-Search-is-Complex-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Aunque los marcos de trabajo como <a href="https://zilliz.com/learn/LangChain">LangChain</a> o <a href="https://zilliz.com/learn/getting-started-with-llamaindex">LlamaIndex</a> facilitan la creación de un recuperador híbrido de prueba de concepto, el escalado a la producción con conjuntos de datos masivos es todo un reto. Las arquitecturas tradicionales requieren bases de datos vectoriales y motores de búsqueda independientes, lo que conlleva varios retos clave:</p>
<ul>
<li><p>Elevados costes de mantenimiento de la infraestructura y complejidad operativa</p></li>
<li><p>Redundancia de datos en varios sistemas</p></li>
<li><p>Difícil gestión de la coherencia de los datos</p></li>
<li><p>Seguridad y control de acceso complejos en todos los sistemas</p></li>
</ul>
<p>El mercado necesita una solución unificada que admita la búsqueda léxica y semántica al tiempo que reduce la complejidad y el coste del sistema.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/elasticsearch_vs_milvus_5be6e2b69e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Pain-Points-of-Elasticsearch" class="common-anchor-header">Los puntos débiles de Elasticsearch<button data-href="#The-Pain-Points-of-Elasticsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>Elasticsearch ha sido uno de los proyectos de búsqueda de código abierto más influyentes de la última década. Basado en Apache Lucene, ganó popularidad gracias a su alto rendimiento, escalabilidad y arquitectura distribuida. Aunque añadió la búsqueda vectorial RNA en la versión 8.0, las implantaciones de producción se enfrentan a varios retos críticos:</p>
<p><strong>Altos costes de actualización e indexación:</strong> La arquitectura de Elasticsearch no desacopla completamente las operaciones de escritura, la creación de índices y las consultas. Esto conlleva una sobrecarga significativa de CPU y E/S durante las operaciones de escritura, especialmente en las actualizaciones masivas. La contención de recursos entre la indexación y la consulta afecta al rendimiento, creando un importante cuello de botella para los escenarios de actualización de alta frecuencia.</p>
<p><strong>Bajo rendimiento en tiempo real:</strong> Como motor de búsqueda "casi en tiempo real", Elasticsearch introduce una latencia notable en la visibilidad de los datos. Esta latencia resulta especialmente problemática para las aplicaciones de IA, como los sistemas de agentes, en los que las interacciones de alta frecuencia y la toma de decisiones dinámica requieren un acceso inmediato a los datos.</p>
<p><strong>Difícil gestión de shards:</strong> Aunque Elasticsearch utiliza sharding para la arquitectura distribuida, la gestión de shards plantea retos significativos. La falta de soporte dinámico de sharding crea un dilema: demasiados shards en pequeños conjuntos de datos conducen a un rendimiento pobre, mientras que muy pocos shards en grandes conjuntos de datos limitan la escalabilidad y causan una distribución desigual de los datos.</p>
<p><strong>Arquitectura no nativa de la nube:</strong> Desarrollado antes de que las arquitecturas nativas de la nube se volvieran prevalentes, el diseño de Elasticsearch acopla estrechamente el almacenamiento y el cómputo, lo que limita su integración con infraestructuras modernas como nubes públicas y Kubernetes. El escalado de recursos requiere aumentos simultáneos tanto en almacenamiento como en computación, lo que reduce la flexibilidad. En escenarios de múltiples réplicas, cada shard debe construir su índice de forma independiente, lo que aumenta los costes computacionales y reduce la eficiencia de los recursos.</p>
<p><strong>Bajo rendimiento de la búsqueda vectorial:</strong> Aunque Elasticsearch 8.0 introdujo la búsqueda vectorial RNA, su rendimiento está muy por detrás del de motores vectoriales dedicados como Milvus. Basada en el núcleo Lucene, su estructura de índices resulta ineficaz para datos de alta dimensión, lo que dificulta los requisitos de búsqueda vectorial a gran escala. El rendimiento se vuelve particularmente inestable en escenarios complejos que implican filtrado escalar y multi-tenancy, por lo que es difícil soportar una alta carga o diversas necesidades de negocio.</p>
<p><strong>Consumo excesivo de recursos:</strong> Elasticsearch impone exigencias extremas a la memoria y la CPU, especialmente cuando procesa datos a gran escala. Su dependencia de la JVM requiere frecuentes ajustes del tamaño de la pila y de la recolección de basura, lo que afecta gravemente a la eficiencia de la memoria. Las operaciones de búsqueda vectorial requieren cálculos intensivos optimizados para SIMD, para los que el entorno JVM dista mucho de ser ideal.</p>
<p>Estas limitaciones fundamentales se vuelven cada vez más problemáticas a medida que las organizaciones escalan su infraestructura de IA, lo que hace que Elasticsearch sea particularmente desafiante para las aplicaciones modernas de IA que requieren un alto rendimiento y fiabilidad.</p>
<h2 id="Introducing-Sparse-BM25-Reimagining-Lexical-Search" class="common-anchor-header">Presentación de Sparse-BM25: Reimaginar la búsqueda léxica<button data-href="#Introducing-Sparse-BM25-Reimagining-Lexical-Search" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5</a> introduce soporte nativo de búsqueda léxica a través de Sparse-BM25, basándose en las capacidades de búsqueda híbrida introducidas en la versión 2.4. Este enfoque innovador incluye los siguientes componentes clave</p>
<ul>
<li><p>tokenización y preprocesamiento avanzados mediante Tantivy</p></li>
<li><p>Gestión distribuida del vocabulario y de la frecuencia de los términos</p></li>
<li><p>Generación de vectores dispersos mediante TF del corpus y TF-IDF de la consulta.</p></li>
<li><p>Soporte de índices invertidos con el algoritmo WAND (Block-Max WAND y soporte de índices gráficos en desarrollo).</p></li>
</ul>
<p>En comparación con Elasticsearch, Milvus ofrece ventajas significativas en la flexibilidad del algoritmo. Su cálculo de similitud basado en la distancia vectorial permite una comparación más sofisticada, incluyendo la implementación de TW-BERT (Term Weighting BERT) basado en la investigación "End-to-End Query Term Weighting". Este enfoque ha demostrado un rendimiento superior en las pruebas dentro y fuera del dominio.</p>
<p>Otra ventaja crucial es la rentabilidad. Al aprovechar tanto el índice invertido como la compresión de incrustación densa, Milvus consigue quintuplicar el rendimiento con menos de un 1% de degradación de la recuperación. El uso de memoria se ha reducido en más de un 50% gracias a la poda de los términos de cola y la cuantificación vectorial.</p>
<p>La optimización de las consultas largas es uno de sus puntos fuertes. Mientras que los algoritmos WAND tradicionales tienen dificultades con las consultas largas, Milvus sobresale combinando incrustaciones dispersas con índices de grafos, lo que multiplica por diez el rendimiento en escenarios de búsqueda de vectores dispersos de alta dimensión.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/document_in_and_out_b84771bec4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-The-Ultimate-Vector-Database-for-RAG" class="common-anchor-header">Milvus: la base de datos vectorial definitiva para RAG<button data-href="#Milvus-The-Ultimate-Vector-Database-for-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus es la primera opción para aplicaciones RAG gracias a su completo conjunto de características. Entre sus principales ventajas se incluyen</p>
<ul>
<li><p>Amplio soporte de metadatos con capacidades de esquema dinámico y potentes opciones de filtrado</p></li>
<li><p>Arrendamiento múltiple de nivel empresarial con aislamiento flexible a través de colecciones, particiones y claves de partición.</p></li>
<li><p>Soporte de índices vectoriales de disco pionero en el sector con almacenamiento en varios niveles desde la memoria hasta S3</p></li>
<li><p>Escalabilidad nativa en la nube que admite un escalado sin fisuras de 10M a 1B+ vectores</p></li>
<li><p>Amplias capacidades de búsqueda, incluidas la agrupación, el rango y la búsqueda híbrida</p></li>
<li><p>Profunda integración del ecosistema con LangChain, LlamaIndex, Dify y otras herramientas de IA</p></li>
</ul>
<p>Las diversas capacidades de búsqueda del sistema abarcan metodologías de agrupación, rango y búsqueda híbrida. La profunda integración con herramientas como LangChain, LlamaIndex y Dify, así como la compatibilidad con numerosos productos de IA, sitúan a Milvus en el centro del ecosistema moderno de infraestructuras de IA.</p>
<h2 id="Looking-Forward" class="common-anchor-header">De cara al futuro<button data-href="#Looking-Forward" class="anchor-icon" translate="no">
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
    </button></h2><p>A medida que la IA pasa de POC a producción, Milvus sigue evolucionando. Nos centramos en hacer que la búsqueda vectorial sea más accesible y rentable, al tiempo que mejoramos la calidad de la búsqueda. Tanto si se trata de una startup como de una empresa, Milvus reduce las barreras técnicas para el desarrollo de aplicaciones de IA.</p>
<p>Este compromiso con la accesibilidad y la innovación nos ha llevado a dar otro gran paso adelante. Aunque nuestra solución de código abierto sigue sirviendo de base para miles de aplicaciones en todo el mundo, reconocemos que muchas organizaciones necesitan una solución totalmente gestionada que elimine los gastos operativos.</p>
<h2 id="Zilliz-Cloud-The-Managed-Solution" class="common-anchor-header">Zilliz Cloud: La solución gestionada<button data-href="#Zilliz-Cloud-The-Managed-Solution" class="anchor-icon" translate="no">
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
    </button></h2><p>Hemos construido <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, un servicio de base de datos vectorial totalmente gestionado basado en Milvus, durante los últimos tres años. Mediante una reimplementación nativa en la nube del protocolo Milvus, ofrece mayor facilidad de uso, rentabilidad y seguridad.</p>
<p>Aprovechando nuestra experiencia en el mantenimiento de los clústeres de búsqueda vectorial más grandes del mundo y dando soporte a miles de desarrolladores de aplicaciones de IA, Zilliz Cloud reduce significativamente los gastos operativos y los costes en comparación con las soluciones autoalojadas.</p>
<p>¿Listo para experimentar el futuro de la búsqueda vectorial? Comience su prueba gratuita hoy mismo con hasta 200 $ en créditos, sin necesidad de tarjeta de crédito.</p>
