---
id: >-
  Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser.md
title: >-
  Creación con Milvus de recomendaciones de noticias basadas en inteligencia
  artificial para el navegador móvil de Xiaomi
author: milvus
date: 2020-06-04T02:30:34.750Z
desc: >-
  Descubra cómo Xiaomi aprovechó la IA y Milvus para construir un sistema
  inteligente de recomendación de noticias capaz de encontrar el contenido más
  relevante para los usuarios de su navegador web móvil.
cover: assets.zilliz.com/blog_Sohu_News_dec53d0814.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser
---
<custom-h1>Con Milvus: recomendaciones de noticias basadas en inteligencia artificial en el navegador móvil de Xiaomi</custom-h1><p>Desde los feeds de las redes sociales hasta las recomendaciones de listas de reproducción en Spotify, <a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">la inteligencia artificial</a> ya desempeña un papel importante en el contenido que vemos y con el que interactuamos cada día. En un esfuerzo por diferenciar su navegador web móvil, el fabricante multinacional de electrónica Xiaomi ha creado un motor de recomendación de noticias basado en IA. <a href="https://milvus.io/">Milvus</a>, una base de datos vectorial de código abierto creada específicamente para la búsqueda de similitudes y la inteligencia artificial, se utilizó como plataforma central de gestión de datos de la aplicación. Este artículo explica cómo construyó Xiaomi su motor de recomendación de noticias basado en IA y cómo se utilizaron Milvus y otros algoritmos de IA.</p>
<p><br/></p>
<h3 id="Using-AI-to-suggest-personalized-content-and-cut-through-news-noise" class="common-anchor-header">Utilizar la IA para sugerir contenidos personalizados y eliminar el ruido de las noticias</h3><p>Sólo el New York Times publica más de <a href="https://www.theatlantic.com/technology/archive/2016/05/how-many-stories-do-newspapers-publish-per-day/483845/">230</a> contenidos al día, por lo que es imposible tener una visión completa de todas las noticias. Para ayudar a cribar grandes volúmenes de contenido y recomendar los artículos más relevantes o interesantes, recurrimos cada vez más a la inteligencia artificial. Aunque las recomendaciones distan mucho de ser perfectas, el aprendizaje automático es cada vez más necesario para abrirse paso a través del flujo constante de nueva información procedente de nuestro mundo, cada vez más complejo e interconectado.</p>
<p>Xiaomi fabrica e invierte en teléfonos inteligentes, aplicaciones móviles, ordenadores portátiles, electrodomésticos y muchos otros productos. En un esfuerzo por diferenciar un navegador móvil que viene preinstalado en muchos de los más de 40 millones de teléfonos inteligentes que la empresa vende cada trimestre, Xiaomi incorporó un sistema de recomendación de noticias. Cuando los usuarios inician el navegador móvil de Xiaomi, se utiliza inteligencia artificial para recomendar contenidos similares en función del historial de búsqueda del usuario, sus intereses, etc. Milvus es una base de datos de búsqueda de similitud vectorial de código abierto que se utiliza para acelerar la recuperación de artículos relacionados.</p>
<p><br/></p>
<h3 id="How-does-AI-powered-content-recommendation-work" class="common-anchor-header">¿Cómo funciona la recomendación de contenidos basada en IA?</h3><p>En esencia, la recomendación de noticias (o cualquier otro tipo de sistema de recomendación de contenidos) consiste en comparar los datos de entrada con una base de datos masiva para encontrar información similar. Para que la recomendación de contenidos tenga éxito, es necesario equilibrar la relevancia con la actualidad e incorporar con eficacia enormes volúmenes de datos nuevos, a menudo en tiempo real.</p>
<p>Para dar cabida a conjuntos de datos masivos, los sistemas de recomendación suelen dividirse en dos etapas:</p>
<ol>
<li><strong>Recuperación</strong>: Durante la recuperación, el contenido se reduce a partir de una biblioteca más amplia basada en los intereses y el comportamiento del usuario. En el navegador móvil de Xiaomi, se seleccionan miles de contenidos de un enorme conjunto de datos que contiene millones de artículos de noticias.</li>
<li><strong>Clasificación</strong>: A continuación, los contenidos seleccionados durante la recuperación se clasifican en función de determinados indicadores antes de ser enviados al usuario. A medida que los usuarios se interesan por los contenidos recomendados, el sistema se adapta en tiempo real para ofrecer sugerencias más pertinentes.</li>
</ol>
<p>Las recomendaciones de contenidos de noticias deben hacerse en tiempo real en función del comportamiento del usuario y de los contenidos publicados recientemente. Además, los contenidos sugeridos deben coincidir al máximo con los intereses del usuario y la intención de búsqueda.</p>
<p><br/></p>
<h3 id="Milvus-+-BERT--intelligent-content-suggestions" class="common-anchor-header">Milvus + BERT = sugerencias inteligentes de contenidos</h3><p>Milvus es una base de datos de búsqueda de similitud vectorial de código abierto que puede integrarse con modelos de aprendizaje profundo para potenciar aplicaciones que abarcan el procesamiento del lenguaje natural, la verificación de identidades y mucho más. Milvus indexa grandes conjuntos de datos vectoriales para que la búsqueda sea más eficiente, y es compatible con una variedad de marcos de IA populares para simplificar el proceso de desarrollo de aplicaciones de aprendizaje automático. Estas características hacen que la plataforma sea ideal para almacenar y consultar datos vectoriales, un componente crítico de muchas aplicaciones de aprendizaje automático.</p>
<p>Xiaomi eligió Milvus para gestionar los datos vectoriales de su sistema inteligente de recomendación de noticias porque es rápido, fiable y requiere una configuración y un mantenimiento mínimos. Sin embargo, Milvus debe emparejarse con un algoritmo de IA para crear aplicaciones desplegables. Xiaomi eligió BERT, abreviatura de Bidirectional Encoder Representation Transformers, como modelo de representación del lenguaje en su motor de recomendación. BERT puede utilizarse como un modelo general de NLU (comprensión del lenguaje natural) que puede impulsar diversas tareas de NLP (procesamiento del lenguaje natural). Sus principales características son:</p>
<ul>
<li>El transformador de BERT se utiliza como marco principal del algoritmo y es capaz de capturar relaciones explícitas e implícitas dentro y entre frases.</li>
<li>Objetivos de aprendizaje multitarea, modelado del lenguaje enmascarado (MLM) y predicción de la siguiente frase (NSP).</li>
<li>BERT obtiene mejores resultados con mayores cantidades de datos y puede mejorar otras técnicas de procesamiento del lenguaje natural, como Word2Vec, actuando como matriz de conversión.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_1_6301344312.jpeg" alt="Blog_Xiaomi_1.jpeg" class="doc-image" id="blog_xiaomi_1.jpeg" />
   </span> <span class="img-wrapper"> <span>Blog_Xiaomi_1.jpeg</span> </span></p>
<p><br/></p>
<p>La arquitectura de red de BERT utiliza una estructura de transformador multicapa que abandona las tradicionales redes neuronales RNN y CNN. Funciona convirtiendo la distancia entre dos palabras en cualquier posición en una sola a través de su mecanismo de atención, y resuelve el problema de dependencia que ha persistido en PNL durante algún tiempo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_2_fe5cf2e401.jpeg" alt="Blog-Xiaomi-2.jpeg" class="doc-image" id="blog-xiaomi-2.jpeg" />
   </span> <span class="img-wrapper"> <span>Blog-Xiaomi-2.jpeg</span> </span></p>
<p><br/></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_3_5d10b51440.jpeg" alt="Blog-Xiaomi-3.jpeg" class="doc-image" id="blog-xiaomi-3.jpeg" />
   </span> <span class="img-wrapper"> <span>Blog-Xiaomi-3.jpeg</span> </span></p>
<p><br/></p>
<p>BERT ofrece un modelo simple y otro complejo. Los hiperparámetros correspondientes son los siguientes: BERT BASE: L = 12, H = 768, A = 12, parámetro total 110M; BERT LARGE: L = 24, H = 1024, A = 16, el número total de parámetros es 340M.</p>
<p>En los hiperparámetros anteriores, L representa el número de capas de la red (es decir, el número de bloques Transformer), A representa el número de autoatención en Multi-Head Attention, y el tamaño del filtro es 4H.</p>
<p><br/></p>
<h3 id="Xiaomi’s-content-recommendation-system" class="common-anchor-header">Sistema de recomendación de contenidos de Xiaomi</h3><p>El sistema de recomendación de noticias basado en el navegador de Xiaomi se basa en tres componentes clave: vectorización, asignación de ID y servicio de vecino más cercano aproximado (RNA).</p>
<p>La vectorización es un proceso en el que los títulos de los artículos se convierten en vectores de frases generales. En el sistema de recomendación de Xiaomi se utiliza el modelo SimBert, basado en BERT. SimBert es un modelo de 12 capas con un tamaño oculto de 768. Simbert utiliza el modelo de entrenamiento Chinese L-12_H-768_A-12 para el entrenamiento continuo (siendo la tarea de entrenamiento "aprendizaje métrico +UniLM", y ha entrenado 1,17 millones de pasos en una signle TITAN RTX con el optimizador Adam (tasa de aprendizaje 2e-6, tamaño de lote 128). En pocas palabras, se trata de un modelo BERT optimizado.</p>
<p>Los algoritmos de RNA comparan los títulos de los artículos vectorizados con toda la biblioteca de noticias almacenada en Milvus y, a continuación, devuelven contenidos similares a los usuarios. El mapeo de ID se utiliza para obtener información relevante como páginas vistas y clics para los artículos correspondientes.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_N1_f4749b3131.jpeg" alt="Blog-Xiaomi-N1.jpeg" class="doc-image" id="blog-xiaomi-n1.jpeg" />
   </span> <span class="img-wrapper"> <span>Blog-Xiaomi-N1.jpeg</span> </span></p>
<p><br/></p>
<p>Los datos almacenados en Milvus que alimentan el motor de recomendación de noticias de Xiaomi se actualizan constantemente, incluyendo artículos adicionales e información sobre la actividad. A medida que el sistema incorpora nuevos datos, los antiguos deben ser depurados. En este sistema, las actualizaciones de datos completas se realizan durante los primeros T-1 días y las actualizaciones incrementales se realizan en los T días siguientes.</p>
<p>A intervalos definidos, se eliminan los datos antiguos y se introducen en la colección los datos procesados de los T-1 días. Los nuevos datos generados se incorporan en tiempo real. Una vez insertados los nuevos datos, se realiza una búsqueda de similitudes en Milvus. Los artículos recuperados se clasifican de nuevo por porcentaje de clics y otros factores, y se muestra a los usuarios el contenido más destacado. En un escenario como éste, en el que los datos se actualizan con frecuencia y los resultados deben ofrecerse en tiempo real, la capacidad de Milvus para incorporar y buscar rápidamente nuevos datos permite acelerar drásticamente la recomendación de contenidos de noticias en el navegador móvil de Xiaomi.</p>
<p><br/></p>
<h3 id="Milvus-makes-vector-similarity-search-better" class="common-anchor-header">Milvus mejora la búsqueda de similitud vectorial</h3><p>Vectorizar los datos y calcular después la similitud entre vectores es la tecnología de recuperación más utilizada. El auge de los motores de búsqueda de similitud vectorial basados en RNA ha mejorado enormemente la eficacia de los cálculos de similitud vectorial. En comparación con soluciones similares, Milvus ofrece un almacenamiento de datos optimizado, abundantes SDK y una versión distribuida que reduce en gran medida la carga de trabajo que supone construir una capa de recuperación. Además, la activa comunidad de código abierto de Milvus es un poderoso recurso que puede ayudar a responder preguntas y solucionar problemas a medida que surgen.</p>
<p>Si desea obtener más información sobre la búsqueda de similitud vectorial y Milvus, consulte los siguientes recursos:</p>
<ul>
<li>Eche un vistazo a <a href="https://github.com/milvus-io/milvus">Milvus</a> en Github.</li>
<li><a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">La búsqueda de similitud vectorial se oculta a simple vista</a></li>
<li><a href="https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing">Aceleración de la búsqueda de similitud en datos realmente grandes con indexación vectorial</a></li>
</ul>
<p>Lea otras <a href="https://zilliz.com/user-stories">historias de usuarios</a> para aprender más sobre cómo hacer cosas con Milvus.</p>
