---
id: music-recommender-system-item-based-collaborative-filtering-milvus.md
title: "\U0001F50E Seleccionar un motor de búsqueda de similitud de incrustación"
author: milvus
date: 2020-09-08T00:01:59.064Z
desc: Un estudio de caso con WANYIN APP
cover: assets.zilliz.com/header_f8cea596d2.png
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/music-recommender-system-item-based-collaborative-filtering-milvus
---
<custom-h1>Filtrado colaborativo basado en ítems para un sistema de recomendación musical</custom-h1><p>Wanyin App es una comunidad de intercambio de música basada en IA que pretende fomentar el intercambio de música y facilitar la composición musical a los entusiastas de la música.</p>
<p>La biblioteca de Wanyin contiene una enorme cantidad de música subida por los usuarios. La tarea principal es clasificar la música de interés basándose en el comportamiento previo de los usuarios. Evaluamos dos modelos clásicos: el filtrado colaborativo basado en el usuario (FC basado en el usuario) y el filtrado colaborativo basado en el ítem (FC basado en el ítem), como modelos potenciales del sistema de recomendación.</p>
<ul>
<li>El FC basado en el usuario utiliza estadísticas de similitud para obtener usuarios vecinos con preferencias o intereses similares. Con el conjunto recuperado de vecinos más cercanos, el sistema puede predecir el interés del usuario objetivo y generar recomendaciones.</li>
<li>Introducida por Amazon, la CF basada en artículos, o CF de artículo a artículo (I2I), es un conocido modelo de filtrado colaborativo para sistemas de recomendación. Calcula las similitudes entre elementos en lugar de entre usuarios, basándose en el supuesto de que los elementos de interés deben ser similares a los elementos con puntuaciones altas.</li>
</ul>
<p>El CF basado en el usuario puede llevar a un tiempo de cálculo prohibitivamente más largo cuando el número de usuarios pasa de un cierto punto. Teniendo en cuenta las características de nuestro producto, nos decidimos por el CF I2I para implementar el sistema de recomendación musical. Dado que no poseemos muchos metadatos sobre las canciones, tenemos que tratar con las canciones per se, extrayendo vectores de características (embeddings) de ellas. Nuestro enfoque consiste en convertir estas canciones en cepstrum de mel-frecuencia (MFC), diseñar una red neuronal convolucional (CNN) para extraer las incrustaciones de características de las canciones y, a continuación, realizar recomendaciones musicales mediante la búsqueda de similitudes de incrustación.</p>
<h2 id="🔎-Select-an-embedding-similarity-search-engine" class="common-anchor-header">🔎 Seleccionar un motor de búsqueda de similitud de incrustación<button data-href="#🔎-Select-an-embedding-similarity-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Ahora que tenemos los vectores de características, la cuestión pendiente es cómo recuperar del gran volumen de vectores los que son similares al vector objetivo. En cuanto al motor de búsqueda de incrustaciones, estábamos sopesando entre Faiss y Milvus. Me di cuenta de Milvus cuando estaba revisando los repositorios de tendencias de GitHub en noviembre de 2019. Eché un vistazo al proyecto y me atrajo con sus API abstractas. (Estaba en v0.5.x por entonces y v0.10.2 por ahora).</p>
<p>Preferimos Milvus a Faiss. Por un lado, hemos utilizado Faiss antes, y por lo tanto nos gustaría probar algo nuevo. Por otro lado, en comparación con Milvus, Faiss es más una biblioteca subyacente, por lo que no es muy cómodo de usar. A medida que fuimos aprendiendo más sobre Milvus, finalmente decidimos adoptar Milvus por sus dos características principales:</p>
<ul>
<li>Milvus es muy fácil de usar. Todo lo que necesitas hacer es extraer su imagen Docker y actualizar los parámetros basados en tu propio escenario.</li>
<li>Soporta más índices y tiene una documentación de apoyo detallada.</li>
</ul>
<p>En resumen, Milvus es muy fácil de usar y la documentación es bastante detallada. Si se encuentra con algún problema, normalmente puede encontrar soluciones en la documentación; de lo contrario, siempre puede obtener soporte de la comunidad Milvus.</p>
<h2 id="Milvus-cluster-service-☸️-⏩" class="common-anchor-header">Servicio de clúster de Milvus ☸️ ⏩<button data-href="#Milvus-cluster-service-☸️-⏩" class="anchor-icon" translate="no">
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
    </button></h2><p>Después de decidir utilizar Milvus como motor de búsqueda de vectores de características, configuramos un nodo independiente en un entorno de desarrollo (DEV). Había estado funcionando bien durante unos días, así que planeamos realizar pruebas en un entorno de pruebas de aceptación de fábrica (FAT). Si un nodo independiente se bloquea en producción, todo el servicio dejará de estar disponible. Por lo tanto, necesitamos desplegar un servicio de búsqueda de alta disponibilidad.</p>
<p>Milvus proporciona tanto Mishards, un middleware de fragmentación de clústeres, como Milvus-Helm para la configuración. El proceso de despliegue de un servicio de cluster Milvus es sencillo. Sólo tenemos que actualizar algunos parámetros y empaquetarlos para su despliegue en Kubernetes. El siguiente diagrama de la documentación de Milvus muestra cómo funciona Mishards:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_how_mishards_works_in_milvus_documentation_43a73076bf.png" alt="1-how-mishards-works-in-milvus-documentation.png" class="doc-image" id="1-how-mishards-works-in-milvus-documentation.png" />
   </span> <span class="img-wrapper"> <span>1-cómo-funciona-mishards-en-la-documentación-de-milvus.png</span> </span></p>
<p>Mishards transmite en cascada una solicitud de la línea ascendente a sus submódulos dividiendo la solicitud de la línea ascendente y, a continuación, recopila y devuelve los resultados de los subservicios a la línea ascendente. A continuación se muestra la arquitectura general de la solución de clúster basada en Mishards:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_mishards_based_cluster_solution_architecture_3ad89cf269.jpg" alt="2-mishards-based-cluster-solution-architecture.jpg" class="doc-image" id="2-mishards-based-cluster-solution-architecture.jpg" />
   </span> <span class="img-wrapper"> <span>2-mishards-based-cluster-solution-architecture.jpg</span> </span></p>
<p>La documentación oficial proporciona una introducción clara de Mishards. Puede consultar <a href="https://milvus.io/cn/docs/v0.10.2/mishards.md">Mishards</a> si está interesado.</p>
<p>En nuestro sistema de recomendación de música, desplegamos un nodo de escritura, dos nodos de sólo lectura y una instancia de middleware Mishards en Kubernetes, utilizando Milvus-Helm. Después de que el servicio se ejecutara de forma estable en un entorno FAT durante un tiempo, lo desplegamos en producción. Hasta ahora se ha mantenido estable.</p>
<h2 id="🎧-I2I-music-recommendation-🎶" class="common-anchor-header">🎧 Recomendación de música I2I 🎶<button data-href="#🎧-I2I-music-recommendation-🎶" class="anchor-icon" translate="no">
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
    </button></h2><p>Como se mencionó anteriormente, construimos el sistema de recomendación de música I2I de Wanyin utilizando las incrustaciones extraídas de las canciones existentes. En primer lugar, separamos la voz y la BGM (separación de pistas) de una nueva canción cargada por el usuario y extrajimos las incrustaciones BGM como la representación de características de la canción. Esto también ayuda a distinguir las versiones de las canciones originales. A continuación, almacenamos estas incrustaciones en Milvus, buscamos canciones similares basándonos en las canciones que ha escuchado el usuario y ordenamos y reorganizamos las canciones recuperadas para generar recomendaciones musicales. A continuación se muestra el proceso de implementación:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_music_recommender_system_implementation_c52a333eb8.png" alt="3-music-recommender-system-implementation.png" class="doc-image" id="3-music-recommender-system-implementation.png" />
   </span> <span class="img-wrapper"> <span>3-music-recommender-system-implementation.png</span> </span></p>
<h2 id="🚫-Duplicate-song-filter" class="common-anchor-header">🚫 Filtro de canciones duplicadas<button data-href="#🚫-Duplicate-song-filter" class="anchor-icon" translate="no">
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
    </button></h2><p>Otro escenario en el que utilizamos Milvus es el filtrado de canciones duplicadas. Algunos usuarios suben la misma canción o clip varias veces, y estas canciones duplicadas pueden aparecer en su lista de recomendaciones. Esto significa que generar recomendaciones sin preprocesamiento afectaría a la experiencia del usuario. Por lo tanto, necesitamos encontrar las canciones duplicadas y asegurarnos de que no aparecen en la misma lista mediante preprocesamiento.</p>
<p>Otro escenario en el que utilizamos Milvus es el filtrado de canciones duplicadas. Algunos usuarios suben la misma canción o clip varias veces, y estas canciones duplicadas pueden aparecer en su lista de recomendaciones. Esto significa que generar recomendaciones sin preprocesamiento afectaría a la experiencia del usuario. Por lo tanto, necesitamos encontrar las canciones duplicadas y asegurarnos de que no aparecen en la misma lista mediante preprocesamiento.</p>
<p>Al igual que en el caso anterior, aplicamos el filtrado de canciones duplicadas mediante la búsqueda de vectores de características similares. En primer lugar, separamos la voz de la música de fondo y recuperamos una serie de canciones similares con Milvus. Para filtrar con precisión las canciones duplicadas, extrajimos las huellas dactilares de audio de la canción objetivo y de las canciones similares (con tecnologías como Echoprint, Chromaprint, etc.), calculamos la similitud entre la huella dactilar de audio de la canción objetivo con cada una de las huellas dactilares de las canciones similares. Si la similitud supera el umbral, definimos una canción como duplicado de la canción objetivo. El proceso de comparación de huellas de audio hace que el filtrado de canciones duplicadas sea más preciso, pero también requiere mucho tiempo. Por lo tanto, cuando se trata de filtrar canciones en una biblioteca de música masiva, utilizamos Milvus para filtrar nuestras canciones duplicadas candidatas como paso previo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_using_milvus_filter_songs_music_recommender_duplicates_0ff68d3e67.png" alt="4-using-milvus-filter-songs-music-recommender-duplicates.png" class="doc-image" id="4-using-milvus-filter-songs-music-recommender-duplicates.png" />
   </span> <span class="img-wrapper"> <span>4-using-milvus-filter-songs-music-recommender-duplicates.png</span> </span></p>
<p>Para implementar el sistema de recomendación I2I para la enorme biblioteca musical de Wanyin, nuestro método consiste en extraer las incrustaciones de las canciones como su característica, recuperar incrustaciones similares a la incrustación de la canción objetivo y, a continuación, ordenar y reorganizar los resultados para generar listas de recomendación para el usuario. Para conseguir recomendaciones en tiempo real, elegimos Milvus en lugar de Faiss como motor de búsqueda de similitud de vectores de características, ya que Milvus resulta más fácil de usar y más sofisticado. Del mismo modo, también hemos aplicado Milvus a nuestro filtro de canciones duplicadas, lo que mejora la experiencia del usuario y la eficiencia.</p>
<p>Puedes descargar <a href="https://enjoymusic.ai/wanyin">Wanyin App</a> 🎶 y probarlo. (Nota: puede que no esté disponible en todas las tiendas de aplicaciones).</p>
<h3 id="📝-Authors" class="common-anchor-header">📝 Autores:</h3><p>Jason, ingeniero de algoritmos en Stepbeats Shiyu Chen, ingeniero de datos en Zilliz.</p>
<h3 id="📚-References" class="common-anchor-header">📚 Referencias:</h3><p>Mishards Docs: https://milvus.io/docs/v0.10.2/mishards.md Mishards: https://github.com/milvus-io/milvus/tree/master/shards Milvus-Helm: https://github.com/milvus-io/milvus-helm/tree/master/charts/milvus</p>
<p><strong>🤗 ¡No seas un extraño, síguenos en <a href="https://twitter.com/milvusio/">Twitter</a> o únete a nosotros en <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">Slack</a>!👇🏻</strong></p>
