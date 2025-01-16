---
id: >-
  2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md
title: >-
  Cómo la plataforma de vídeos cortos Likee elimina los vídeos duplicados con
  Milvus
author: 'Xinyang Guo, Baoyu Han'
date: 2022-06-23T00:00:00.000Z
desc: >-
  Descubra cómo Likee utiliza Milvus para identificar vídeos duplicados en
  milisegundos.
cover: >-
  assets.zilliz.com/How_Short_video_Platform_Likee_Removes_Duplicate_Videos_with_Milvus_07bd75ec82.png
tag: Scenarios
tags: Use Cases of Milvus
canonicalUrl: >-
  https://milvus.io/blog/2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_Short_video_Platform_Likee_Removes_Duplicate_Videos_with_Milvus_07bd75ec82.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Imagen de portada</span> </span></p>
<blockquote>
<p>Este artículo ha sido escrito por Xinyang Guo y Baoyu Han, ingenieros de BIGO, y traducido por <a href="https://www.linkedin.cn/incareer/in/rosie-zhang-694528149">Rosie Zhang</a>.</p>
</blockquote>
<p><a href="https://www.bigo.sg/">BIGO Technology</a> (BIGO) es una de las empresas tecnológicas de Singapur de más rápido crecimiento. Gracias a su tecnología de inteligencia artificial, los productos y servicios de vídeo de BIGO han ganado una inmensa popularidad en todo el mundo, con más de 400 millones de usuarios en más de 150 países. Entre ellos figuran <a href="https://www.bigo.tv/bigo_intro/en.html?hk=true">Bigo Live</a> (transmisión en directo) y <a href="https://likee.video/">Likee</a> (vídeo de corta duración).</p>
<p>Likee es una plataforma global de creación de vídeos cortos en la que los usuarios pueden compartir sus momentos, expresarse y conectar con el mundo. Para mejorar la experiencia de los usuarios y recomendarles contenidos de mayor calidad, Likee tiene que eliminar los vídeos duplicados de entre la enorme cantidad de vídeos que generan los usuarios cada día, lo cual no es una tarea sencilla.</p>
<p>Este blog presenta cómo BIGO utiliza <a href="https://milvus.io">Milvus</a>, una base de datos vectorial de código abierto, para eliminar eficazmente los vídeos duplicados.</p>
<p><strong>Ir a:</strong></p>
<ul>
<li><a href="#Overview">Visión general</a></li>
<li><a href="#Video-deduplication-workflow">Flujo de trabajo de la deduplicación de vídeos</a></li>
<li><a href="#System-architecture">Arquitectura del sistema</a></li>
<li><a href="#Using-Milvus-vector-database-to-power-similarity-search">Uso de Milvus para potenciar la búsqueda de similitudes</a></li>
</ul>
<custom-h1>Visión general</custom-h1><p>Milvus es una base de datos vectorial de código abierto que ofrece una búsqueda vectorial ultrarrápida. Gracias a Milvus, Likee es capaz de completar una búsqueda en 200 ms, garantizando al mismo tiempo una alta tasa de recuperación. Mientras tanto, al <a href="https://milvus.io/docs/v2.0.x/scaleout.md#Scale-a-Milvus-Cluster">escalar Milvus horizontalmente</a>, Likee aumenta con éxito el rendimiento de las consultas vectoriales, mejorando aún más su eficiencia.</p>
<custom-h1>Flujo de trabajo de la deduplicación de vídeos</custom-h1><p>¿Cómo identifica Likee los vídeos duplicados? Cada vez que se introduce un vídeo de consulta en el sistema Likee, se corta en 15-20 fotogramas y cada fotograma se convierte en un vector de características. A continuación, Likee busca en una base de datos de 700 millones de vectores los K vectores más similares. Cada uno de los K vectores principales corresponde a un vídeo de la base de datos. A continuación, Likee realiza búsquedas refinadas para obtener los resultados finales y determinar los vídeos que deben eliminarse.</p>
<custom-h1>Arquitectura del sistema</custom-h1><p>Veamos más de cerca cómo funciona el sistema de desduplicación de vídeos de Likee utilizando Milvus. Como se muestra en el diagrama siguiente, los nuevos vídeos subidos a Likee se escribirán en Kafka, un sistema de almacenamiento de datos, en tiempo real y serán consumidos por los consumidores de Kafka. Los vectores de características de estos vídeos se extraen mediante modelos de aprendizaje profundo, en los que los datos no estructurados (vídeo) se convierten en vectores de características. Estos vectores de características serán empaquetados por el sistema y enviados al auditor de similitud.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Likee_1_6f7ebcd8fc.png" alt="Architechure of Likee's video de-duplication system" class="doc-image" id="architechure-of-likee's-video-de-duplication-system" />
   </span> <span class="img-wrapper"> <span>Arquitectura del sistema de de-duplicación de vídeo de Likee</span> </span></p>
<p>Los vectores de características extraídos serán indexados por <a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Milvus</a> y almacenados en Ceph, antes de ser <a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">cargados por el nodo de consulta de Milvus</a> para su posterior búsqueda. Los ID de vídeo correspondientes a estos vectores de características también se almacenarán simultáneamente en TiDB o Pika en función de las necesidades reales.</p>
<h3 id="Using-Milvus-vector-database-to-power-similarity-search" class="common-anchor-header">Utilización de la base de datos de vectores Milvus para potenciar la búsqueda de similitudes</h3><p>A la hora de buscar vectores similares, los miles de millones de datos existentes, junto con las grandes cantidades de datos nuevos que se generan cada día, plantean grandes retos a la funcionalidad del motor de búsqueda de vectores. Tras un análisis exhaustivo, Likee eligió finalmente Milvus, un motor de búsqueda vectorial distribuido de alto rendimiento y elevada tasa de recuperación, para llevar a cabo la búsqueda de similitudes vectoriales.</p>
<p>Como se muestra en el diagrama siguiente, el procedimiento de una búsqueda de similitudes es el siguiente:</p>
<ol>
<li><p>En primer lugar, Milvus realiza una búsqueda por lotes para recuperar los 100 mejores vectores similares para cada uno de los múltiples vectores de características extraídos de un nuevo vídeo. Cada vector similar se vincula a su correspondiente ID de vídeo.</p></li>
<li><p>En segundo lugar, al comparar los ID de los vídeos, Milvus elimina los vídeos duplicados y recupera los vectores de características de los vídeos restantes de TiDB o Pika.</p></li>
<li><p>Por último, Milvus calcula y puntúa la similitud entre cada conjunto de vectores de características recuperados y los vectores de características del vídeo de consulta. El ID del vídeo con la puntuación más alta se devuelve como resultado. Así concluye la búsqueda de similitudes de vídeo.</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/02_a24d251c8f.png" alt="Procedure of a similarity search" class="doc-image" id="procedure-of-a-similarity-search" />
   </span> <span class="img-wrapper"> <span>Procedimiento de una búsqueda por similitud</span> </span></p>
<p>Como motor de búsqueda vectorial de alto rendimiento, Milvus ha realizado un trabajo extraordinario en el sistema de de-duplicación de vídeo de Likee, impulsando en gran medida el crecimiento del negocio de vídeos cortos de BIGO. En cuanto a los negocios de vídeo, hay muchos otros escenarios en los que Milvus puede aplicarse, como el bloqueo de contenidos ilegales o la recomendación personalizada de vídeos. Tanto BIGO como Milvus esperan cooperar en el futuro en más áreas.</p>
