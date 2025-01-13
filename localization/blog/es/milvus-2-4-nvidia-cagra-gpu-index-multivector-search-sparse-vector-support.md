---
id: milvus-2-4-nvidia-cagra-gpu-index-multivector-search-sparse-vector-support.md
title: >-
  Presentación de Milvus 2.4: búsqueda multivectorial, vector disperso, índice
  CAGRA, ¡y mucho más!
author: Fendy Feng
date: 2024-3-20
desc: >-
  Nos complace anunciar el lanzamiento de Milvus 2.4, un importante avance en la
  mejora de las capacidades de búsqueda de conjuntos de datos a gran escala.
metaTitle: 'Milvus 2.4 Supports Multi-vector Search, Sparse Vector, CAGRA, and More!'
cover: assets.zilliz.com/What_is_new_in_Milvus_2_4_1_c580220be3.png
tag: Engineering
tags: >-
  Data science, Database, Tech, Artificial Intelligence, Vector Management,
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-4-nvidia-cagra-gpu-index-multivector-search-sparse-vector-support.md
---
<p>Nos complace anunciar el lanzamiento de Milvus 2.4, un importante avance en la mejora de las capacidades de búsqueda de conjuntos de datos a gran escala. Esta última versión añade nuevas funciones, como la compatibilidad con el índice CAGRA basado en GPU, la compatibilidad beta con <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">incrustaciones dispersas</a>, la búsqueda de grupos y otras mejoras en las capacidades de búsqueda. Estos avances refuerzan nuestro compromiso con la comunidad al ofrecer a desarrolladores como usted una herramienta potente y eficaz para manejar y consultar datos vectoriales. Analicemos juntos las principales ventajas de Milvus 2.4.</p>
<h2 id="Enabled-Multi-vector-Search-for-Simplified-Multimodal-Searches" class="common-anchor-header">Búsqueda multivectorial habilitada para búsquedas multimodales simplificadas<button data-href="#Enabled-Multi-vector-Search-for-Simplified-Multimodal-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.4 proporciona la capacidad de búsqueda multivectorial, permitiendo la búsqueda simultánea y la reordenación de diferentes tipos de vectores dentro del mismo sistema Milvus. Esta función agiliza las búsquedas multimodales, mejorando significativamente las tasas de recuperación y permitiendo a los desarrolladores gestionar sin esfuerzo intrincadas aplicaciones de IA con diversos tipos de datos. Además, esta funcionalidad simplifica la integración y el ajuste de modelos de reordenación personalizados, ayudando a la creación de funciones de búsqueda avanzadas como <a href="https://zilliz.com/vector-database-use-cases/recommender-system">sistemas de recomendación</a> precisos que utilizan información de datos multidimensionales.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_the_multi_vector_search_feature_works_6c85961349.png" alt="How the Milti-Vector Search Feature Works" class="doc-image" id="how-the-milti-vector-search-feature-works" />
   </span> <span class="img-wrapper"> <span>Cómo funciona la función de búsqueda multivectorial</span> </span></p>
<p>El soporte multivectorial en Milvus tiene dos componentes:</p>
<ol>
<li><p>La capacidad de almacenar/consultar múltiples vectores para una sola entidad dentro de una colección, que es una forma más natural de organizar los datos.</p></li>
<li><p>La capacidad de construir/optimizar un algoritmo de reordenación aprovechando los algoritmos de reordenación predefinidos en Milvus.</p></li>
</ol>
<p>Además de ser una <a href="https://github.com/milvus-io/milvus/issues/25639">función</a> muy <a href="https://github.com/milvus-io/milvus/issues/25639">solicitada</a>, hemos creado esta capacidad porque el sector está avanzando hacia modelos multimodales con el lanzamiento de GPT-4 y Claude 3. La reordenación es una técnica muy utilizada para mejorar el rendimiento de las consultas en las búsquedas. Nuestro objetivo era facilitar a los desarrolladores la creación y optimización de sus reordenadores dentro del ecosistema Milvus.</p>
<h2 id="Grouping-Search-Support-for-Enhanced-Compute-Efficiency" class="common-anchor-header">Soporte de búsqueda agrupada para mejorar la eficiencia computacional<button data-href="#Grouping-Search-Support-for-Enhanced-Compute-Efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>La búsqueda agrupada es otra de las <a href="https://github.com/milvus-io/milvus/issues/25343">características</a> más <a href="https://github.com/milvus-io/milvus/issues/25343">solicitadas</a> que hemos añadido a Milvus 2.4. Integra una operación de agrupación diseñada para campos de tipo BOOL, INT, o VARCHAR, llenando un vacío de eficiencia crucial en la ejecución de consultas de agrupación a gran escala.</p>
<p>Tradicionalmente, los desarrolladores dependían de extensas búsquedas Top-K seguidas de un postprocesamiento manual para destilar los resultados específicos de grupo, un método intensivo en computación y pesado en código. La búsqueda de grupos perfecciona este proceso vinculando eficazmente los resultados de las consultas a identificadores de grupos agregados, como nombres de documentos o vídeos, lo que agiliza la gestión de entidades segmentadas dentro de grandes conjuntos de datos.</p>
<p>Milvus distingue su Grouping Search con una implementación basada en iteradores, que ofrece una notable mejora de la eficiencia computacional con respecto a tecnologías similares. Esta elección garantiza una escalabilidad superior del rendimiento, especialmente en entornos de producción en los que la optimización de los recursos informáticos es primordial. Al reducir la sobrecarga computacional y de procesamiento de datos, Milvus soporta un procesamiento de consultas más eficiente, reduciendo significativamente los tiempos de respuesta y los costes operativos en comparación con otras bases de datos vectoriales.</p>
<p>La búsqueda agrupada refuerza la capacidad de Milvus para gestionar consultas complejas de gran volumen y se ajusta a las prácticas informáticas de alto rendimiento para soluciones de gestión de datos sólidas.</p>
<h2 id="Beta-Support-for-Sparse-Vector-Embeddings" class="common-anchor-header">Soporte Beta para incrustaciones de vectores dispersos<button data-href="#Beta-Support-for-Sparse-Vector-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/learn/sparse-and-dense-embeddings">Las incrustaciones de</a> vectores dispersos representan un cambio de paradigma con respecto a los enfoques tradicionales de vectores densos, ya que tienen en cuenta los matices de la similitud semántica en lugar de la mera frecuencia de palabras clave. Esta distinción permite una capacidad de búsqueda más matizada, en estrecha consonancia con el contenido semántico de la consulta y los documentos. Los modelos de vectores dispersos, especialmente útiles en la recuperación de información y el procesamiento del lenguaje natural, ofrecen potentes capacidades de búsqueda fuera del dominio e interpretabilidad en comparación con sus homólogos densos.</p>
<p>En Milvus 2.4, hemos ampliado la búsqueda híbrida para incluir incrustaciones dispersas generadas por modelos neuronales avanzados como SPLADEv2 o modelos estadísticos como BM25. En Milvus, los vectores dispersos reciben el mismo tratamiento que los vectores densos, lo que permite crear colecciones con campos de vectores dispersos, insertar datos, crear índices y realizar búsquedas de similitud. En particular, las incrustaciones dispersas de Milvus admiten la métrica de distancia <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search#Inner-Product">del producto interior</a> (IP), lo que resulta ventajoso dada su naturaleza altamente dimensional, que hace que otras métricas sean menos eficaces. Esta funcionalidad también admite tipos de datos con una dimensión como un entero de 32 bits sin signo y un flotante de 32 bits para el valor, lo que facilita un amplio espectro de aplicaciones, desde búsquedas de texto matizadas hasta elaborados sistemas <a href="https://zilliz.com/learn/information-retrieval-metrics">de recuperación de información</a>.</p>
<p>Con esta nueva función, Milvus permite metodologías de búsqueda híbridas que combinan técnicas basadas en palabras clave e incrustaciones, ofreciendo una transición fluida a los usuarios que pasan de marcos de búsqueda centrados en palabras clave a una solución completa y de bajo mantenimiento.</p>
<p>Etiquetamos esta función como "Beta" para seguir probando su rendimiento y recabar comentarios de la comunidad. La disponibilidad general (GA) del soporte de vectores dispersos está prevista para el lanzamiento de Milvus 3.0.</p>
<h2 id="CAGRA-Index-Support-for-Advanced-GPU-Accelerated-Graph-Indexing" class="common-anchor-header">Soporte de índices CAGRA para la indexación avanzada de gráficos acelerada en la GPU<button data-href="#CAGRA-Index-Support-for-Advanced-GPU-Accelerated-Graph-Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>Desarrollada por NVIDIA, <a href="https://arxiv.org/abs/2308.15136">CAGRA</a> (Cuda Anns GRAph-based) es una tecnología de indexación de gráficos basada en la GPU que supera con creces los métodos tradicionales basados en la CPU, como el índice HNSW, en eficiencia y rendimiento, especialmente en entornos de alta producción.</p>
<p>Con la introducción del índice CAGRA, Milvus 2.4 proporciona una mayor capacidad de indexación de grafos acelerada por la GPU. Esta mejora es ideal para crear aplicaciones de búsqueda de similitudes que requieran una latencia mínima. Además, Milvus 2.4 integra una búsqueda de fuerza bruta con el índice CAGRA para conseguir las máximas tasas de recuperación en las aplicaciones. Para obtener información detallada, explore el <a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">blog de introducción sobre CAGRA</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_raft_cagra_vs_milvus_hnsw_ffe0415ff5.png" alt="Milvus Raft CAGRA vs. Milvus HNSW" class="doc-image" id="milvus-raft-cagra-vs.-milvus-hnsw" />
   </span> <span class="img-wrapper"> <span>Milvus Raft CAGRA frente a Milvus HNSW</span> </span></p>
<h2 id="Additional-Enhancements-and-Features" class="common-anchor-header">Mejoras y características adicionales<button data-href="#Additional-Enhancements-and-Features" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.4 también incluye otras mejoras clave, como la compatibilidad con expresiones regulares para mejorar la coincidencia de subcadenas en <a href="https://zilliz.com/blog/metadata-filtering-with-zilliz-cloud-pipelines">el filtrado de metadatos</a>, un nuevo índice escalar invertido para un filtrado eficaz de tipos de datos escalares y una herramienta de captura de datos de cambios para supervisar y replicar los cambios en las colecciones de Milvus. Estas actualizaciones mejoran colectivamente el rendimiento y la versatilidad de Milvus, convirtiéndolo en una solución completa para operaciones de datos complejas.</p>
<p>Para más detalles, consulte <a href="https://milvus.io/docs/release_notes.md">la documentación de Milvus 2.4</a>.</p>
<h2 id="Stay-Connected" class="common-anchor-header">Manténgase conectado<button data-href="#Stay-Connected" class="anchor-icon" translate="no">
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
    </button></h2><p>¿Quiere saber más sobre Milvus 2.4? <a href="https://zilliz.com/event/unlocking-advanced-search-capabilities-milvus">Participe en nuestro próximo seminario web</a> con James Luan, Vicepresidente de Ingeniería de Zilliz, para un debate en profundidad sobre las capacidades de esta última versión. Si tiene preguntas o comentarios, únase a nuestro <a href="https://discord.com/invite/8uyFbECzPX">canal de Discord</a> para hablar con nuestros ingenieros y miembros de la comunidad. No olvide seguirnos en <a href="https://twitter.com/milvusio">Twitter</a> o <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> para conocer las últimas noticias y actualizaciones sobre Milvus.</p>
