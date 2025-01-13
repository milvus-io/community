---
id: Making-With-Milvus-AI-Infused-Proptech-for-Personalized-Real-Estate-Search.md
title: Con Milvus AI-Infused Proptech para una búsqueda inmobiliaria personalizada
author: milvus
date: 2021-03-18T03:53:54.736Z
desc: >-
  La IA está transformando el sector inmobiliario. Descubra cómo la tecnología
  inteligente acelera el proceso de búsqueda y compra de viviendas.
cover: assets.zilliz.com/blog_realistate_search_da4e8ee01d.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-With-Milvus-AI-Infused-Proptech-for-Personalized-Real-Estate-Search
---
<custom-h1>Making With Milvus: Proptech con IA para una búsqueda inmobiliaria personalizada</custom-h1><p>La inteligencia artificial (IA) tiene <a href="https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f#d62b">potentes aplicaciones</a> en el sector inmobiliario que están transformando el proceso de búsqueda de vivienda. Los profesionales inmobiliarios expertos en tecnología llevan años sacando partido de la IA, reconociendo su capacidad para ayudar a los clientes a encontrar la casa adecuada más rápidamente y simplificar el proceso de compra de una propiedad. La pandemia de coronavirus ha <a href="https://www.pwc.com/ca/en/industries/real-estate/emerging-trends-in-real-estate-2021/shifting-landscape-proptech.html">acelerado el</a> interés, la adopción y la inversión en tecnología inmobiliaria (o proptech) en todo el mundo, lo que sugiere que desempeñará un papel cada vez más importante en el sector inmobiliario de cara al futuro.</p>
<p>Este artículo explora cómo <a href="https://bj.ke.com/">Beike</a> ha utilizado la búsqueda por similitud vectorial para construir una plataforma de búsqueda de vivienda que ofrece resultados personalizados y recomienda listados casi en tiempo real.</p>
<h3 id="What-is-vector-similarity-search" class="common-anchor-header">¿Qué es la búsqueda vectorial por similitud?</h3><p>La<a href="https://medium.com/unstructured-data-service/vector-similarity-search-hides-in-plain-view-654f8152f8ab">búsqueda de similitud vectorial</a> tiene aplicaciones que abarcan una amplia variedad de escenarios de inteligencia artificial, aprendizaje profundo y cálculo vectorial tradicional. La proliferación de la tecnología de IA se atribuye en parte a la búsqueda vectorial y su capacidad para dar sentido a los datos no estructurados, que incluyen cosas como imágenes, video, audio, datos de comportamiento, documentos y mucho más.</p>
<p>Se estima que los datos no estructurados representan entre el 80 y el 90% de todos los datos, y extraer información de ellos se está convirtiendo rápidamente en un requisito para las empresas que quieren seguir siendo competitivas en un mundo en constante cambio. La creciente demanda de análisis de datos no estructurados, el aumento de la potencia de cálculo y el descenso de los costes informáticos han hecho que la búsqueda vectorial basada en IA sea más accesible que nunca.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_blog_img1_2dc95cac08.jpg" alt="beike-blog-img1.jpg" class="doc-image" id="beike-blog-img1.jpg" />
   </span> <span class="img-wrapper"> <span>beike-blog-img1.jpg</span> </span></p>
<p>Tradicionalmente, los datos no estructurados han sido un reto a la hora de procesarlos y analizarlos a gran escala porque no siguen un modelo o una estructura organizativa predefinidos. Las redes neuronales (por ejemplo, CNN, RNN y BERT) permiten convertir datos no estructurados en vectores de características, un formato de datos numéricos que los ordenadores pueden interpretar fácilmente. A continuación, se utilizan algoritmos para calcular la similitud entre vectores utilizando métricas como la similitud coseno o la distancia euclídea.</p>
<p>En definitiva, la búsqueda de similitud vectorial es un término amplio que describe técnicas para identificar cosas similares en conjuntos de datos masivos. Beike utiliza esta tecnología para impulsar un motor inteligente de búsqueda de viviendas que recomienda automáticamente listados basados en las preferencias individuales del usuario, su historial de búsqueda y los criterios de la propiedad, acelerando el proceso de búsqueda y compra de inmuebles. Milvus es una base de datos vectorial de código abierto que conecta información con algoritmos, lo que permite a Beike desarrollar y gestionar su plataforma inmobiliaria de IA.</p>
<p><br/></p>
<h3 id="How-does-Milvus-manage-vector-data" class="common-anchor-header">¿Cómo gestiona Milvus los datos vectoriales?</h3><p>Milvus se construyó específicamente para la gestión de datos vectoriales a gran escala, y tiene aplicaciones que abarcan la búsqueda de imágenes y vídeos, el análisis de similitud química, los sistemas de recomendación personalizados, la IA conversacional y mucho más. Los conjuntos de datos vectoriales almacenados en Milvus pueden consultarse de forma eficiente, y la mayoría de las implementaciones siguen este proceso general:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_blog_img2_d5abb58f95.jpg" alt="beike-blog-img2.jpg" class="doc-image" id="beike-blog-img2.jpg" />
   </span> <span class="img-wrapper"> <span>beike-blog-img2.jpg</span> </span></p>
<p><br/></p>
<h3 id="How-does-Beike-use-Milvus-to-make-house-hunting-smarter" class="common-anchor-header">¿Cómo utiliza Beike Milvus para hacer más inteligente la búsqueda de vivienda?</h3><p>Comúnmente descrita como la respuesta china a Zillow, Beike es una plataforma en línea que permite a los agentes inmobiliarios publicar propiedades en alquiler o venta. Para ayudar a mejorar la experiencia de búsqueda de vivienda de los buscadores de casas y ayudar a los agentes a cerrar acuerdos más rápidamente, la empresa creó un motor de búsqueda basado en IA para su base de datos de listados. La base de datos de anuncios inmobiliarios de Beike se convirtió en vectores de características y se introdujo en Milvus para su indexación y almacenamiento. A continuación, Milvus se utiliza para realizar búsquedas de similitud basadas en un listado de entrada, criterios de búsqueda, perfil de usuario u otros criterios.</p>
<p>Por ejemplo, cuando se buscan más viviendas similares a una determinada, se extraen características como el plano, el tamaño, la orientación, los acabados interiores, los colores de pintura, etc. Como se ha <a href="https://medium.com/unstructured-data-service/how-to-choose-an-index-in-milvus-4f3d15259212">indexado</a> la base de datos original de listados de propiedades, las búsquedas pueden realizarse en apenas milisegundos. El producto final de Beike tenía un tiempo medio de consulta de 113 milisegundos en un conjunto de datos que contenía más de 3 millones de vectores. Sin embargo, Milvus es capaz de mantener velocidades eficientes en conjuntos de datos a escala de billones, lo que facilita el trabajo en esta base de datos inmobiliaria relativamente pequeña. En general, el sistema sigue el siguiente proceso:</p>
<ol>
<li><p>Los modelos de aprendizaje profundo (por ejemplo, CNN, RNN o BERT) convierten los datos no estructurados en vectores de características, que luego se importan a Milvus.</p></li>
<li><p>Milvus almacena e indexa los vectores de características.</p></li>
<li><p>Milvus devuelve resultados de búsqueda de similitud basados en las consultas del usuario.</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_overview_diagram_d17cda0e47.png" alt="milvus-overview-diagram.png" class="doc-image" id="milvus-overview-diagram.png" />
   </span> <span class="img-wrapper"> <span>milvus-view-diagram.png</span> </span></p>
<p><br/></p>
<p>La plataforma de búsqueda inmobiliaria inteligente de Beike se basa en un algoritmo de recomendación que calcula la similitud de los vectores mediante la distancia coseno. El sistema encuentra viviendas similares en función de los anuncios favoritos y los criterios de búsqueda. A grandes rasgos, funciona de la siguiente manera:</p>
<ol>
<li><p>A partir de un listado de entrada, se utilizan características como la planta, el tamaño y la orientación para extraer 4 colecciones de vectores de características.</p></li>
<li><p>Las colecciones de características extraídas se utilizan para realizar búsquedas de similitud en Milvus. Los resultados de la búsqueda de cada colección de vectores son una medida de la similitud entre el listado de entrada y otros listados similares.</p></li>
<li><p>Los resultados de la búsqueda de cada una de las 4 colecciones de vectores se comparan y se utilizan para recomendar viviendas similares.</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_intelligent_house_platform_diagram_6e278da118.jpg" alt="beike-intelligent-house-platform-diagram.jpg" class="doc-image" id="beike-intelligent-house-platform-diagram.jpg" />
   </span> <span class="img-wrapper"> <span>beike-intelligent-house-platform-diagram.jpg</span> </span></p>
<p><br/></p>
<p>Como muestra la figura anterior, el sistema implementa un mecanismo de conmutación de tablas A/B para actualizar los datos. Milvus almacena los datos de los primeros T días en la tabla A, el día T+1 empieza a almacenar datos en la tabla B, el día 2T+1, empieza a reescribir la tabla A, y así sucesivamente.</p>
<p><br/></p>
<h3 id="To-learn-more-about-making-things-with-Milvus-check-out-the-following-resources" class="common-anchor-header">Para saber más sobre cómo hacer cosas con Milvus, consulte los siguientes recursos:</h3><ul>
<li><p><a href="https://zilliz.com/blog/Building-an-AI-Powered-Writing-Assistant-with-WPS-Office">Construyendo un Asistente de Escritura Potenciado por IA para WPS Office</a></p></li>
<li><p><a href="https://zilliz.com/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser">Creando con Milvus: Recomendación de noticias con IA dentro del navegador móvil de Xiaomi</a></p></li>
</ul>
