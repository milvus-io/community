---
id: AI-applications-with-Milvus.md
title: Cómo crear 4 aplicaciones de IA populares con Milvus
author: milvus
date: 2021-04-08T04:14:03.700Z
desc: >-
  Milvus acelera el desarrollo de aplicaciones de aprendizaje automático y las
  operaciones de aprendizaje automático (MLOps). Con Milvus, puede desarrollar
  rápidamente un producto mínimo viable (MVP) manteniendo los costes en límites
  inferiores.
cover: assets.zilliz.com/blog_cover_4a9807b9e0.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/AI-applications-with-Milvus'
---
<custom-h1>Cómo crear 4 aplicaciones populares de IA con Milvus</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/blog_cover_4a9807b9e0.png" alt="blog cover.png" class="doc-image" id="blog-cover.png" />
   </span> <span class="img-wrapper"> <span>portada blog.png</span> </span></p>
<p><a href="https://milvus.io/">Milvus</a> es una base de datos vectorial de código abierto. Admite la adición, eliminación, actualización y búsqueda casi en tiempo real de conjuntos de datos vectoriales masivos creados mediante la extracción de vectores de características a partir de datos no estructurados utilizando modelos de IA. Con un amplio conjunto de API intuitivas y compatibilidad con múltiples bibliotecas de índices ampliamente adoptadas (por ejemplo, Faiss, NMSLIB y Annoy), Milvus acelera el desarrollo de aplicaciones de aprendizaje automático y las operaciones de aprendizaje automático (MLOps). Con Milvus, puede desarrollar rápidamente un producto mínimo viable (MVP) manteniendo los costes en los límites más bajos.</p>
<p>&quot;¿Qué recursos están disponibles para desarrollar una aplicación de IA con Milvus?&quot; es una pregunta habitual en la comunidad Milvus. Zilliz, la <a href="https://zilliz.com/">empresa</a> que está detrás de Milvus, ha desarrollado una serie de demos que aprovechan Milvus para realizar búsquedas de similitud a la velocidad del rayo que potencian las aplicaciones inteligentes. El código fuente de las soluciones Milvus puede encontrarse en <a href="https://github.com/zilliz-bootcamp">zilliz-bootcamp</a>. Los siguientes escenarios interactivos muestran el procesamiento del lenguaje natural (PLN), la búsqueda inversa de imágenes, la búsqueda de audio y la visión por ordenador.</p>
<p>No dude en probar las soluciones para adquirir experiencia práctica con escenarios específicos. Comparta sus propios escenarios de aplicación a través de:</p>
<ul>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a></li>
<li><a href="https://github.com/milvus-io/milvus/discussions">GitHub</a></li>
</ul>
<p><br/></p>
<p><strong>Ir a:</strong></p>
<ul>
<li><a href="#natural-language-processing-chatbots">Procesamiento del lenguaje natural (chatbots)</a></li>
<li><a href="#reverse-image-search-systems">Búsqueda inversa de imágenes</a></li>
<li><a href="#audio-search-systems">Búsqueda de audio</a></li>
<li><a href="#video-object-detection-computer-vision">Detección de objetos de vídeo (visión por ordenador)</a></li>
</ul>
<p><br/></p>
<h3 id="Natural-language-processing-chatbots" class="common-anchor-header">Procesamiento del lenguaje natural (chatbots)</h3><p>Milvus puede utilizarse para crear chatbots que utilicen el procesamiento del lenguaje natural para simular un operador en directo, responder preguntas, dirigir a los usuarios a la información pertinente y reducir los costes de mano de obra. Para demostrar este escenario de aplicación, Zilliz construyó un chatbot impulsado por IA que entiende el lenguaje semántico combinando Milvus con <a href="https://en.wikipedia.org/wiki/BERT_(language_model)">BERT</a>, un modelo de aprendizaje automático (ML) desarrollado para el pre-entrenamiento NLP.</p>
<p>👉Source <a href="https://github.com/zilliz-bootcamp/intelligent_question_answering_v2">code：zilliz-bootcamp/intelligent_question_answering_v2</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_c301a9e4bd.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">Cómo utilizarlo</h4><ol>
<li><p>Cargue un conjunto de datos que incluya pares pregunta-respuesta. Formatee las preguntas y respuestas en dos columnas separadas. También puede descargar un <a href="https://zilliz.com/solutions/qa">conjunto de datos de ejemplo</a>.</p></li>
<li><p>Una vez introducida la pregunta, se obtendrá una lista de preguntas similares a partir del conjunto de datos cargado.</p></li>
<li><p>Revele la respuesta seleccionando la pregunta más similar a la suya.</p></li>
</ol>
<p>👉Video<a href="https://www.youtube.com/watch?v=ANgoyvgAxgU">：[Demo] Sistema QA desarrollado por Milvus</a></p>
<h4 id="How-it-works" class="common-anchor-header">Cómo funciona</h4><p>Las preguntas se convierten en vectores de características utilizando el modelo BERT de Google y, a continuación, se utiliza Milvus para gestionar y consultar el conjunto de datos.</p>
<p><strong>Procesamiento de datos:</strong></p>
<ol>
<li>BERT se utiliza para convertir los pares pregunta-respuesta cargados en vectores de características de 768 dimensiones. A continuación, los vectores se importan a Milvus y se les asignan identificadores individuales.</li>
<li>Los ID de los vectores de preguntas y respuestas correspondientes se almacenan en PostgreSQL.</li>
</ol>
<p><strong>Búsqueda de preguntas similares:</strong></p>
<ol>
<li>BERT se utiliza para extraer vectores de características de la pregunta de entrada de un usuario.</li>
<li>Milvus recupera los vectores ID de las preguntas más similares a la pregunta de entrada.</li>
<li>El sistema busca las respuestas correspondientes en PostgreSQL.</li>
</ol>
<p><br/></p>
<h3 id="Reverse-image-search-systems" class="common-anchor-header">Sistemas de búsqueda inversa de imágenes</h3><p>La búsqueda inversa de imágenes está transformando el comercio electrónico a través de recomendaciones personalizadas de productos y herramientas similares de búsqueda de productos que pueden impulsar las ventas. En este escenario de aplicación, Zilliz construyó un sistema de búsqueda inversa de imágenes combinando Milvus con <a href="https://towardsdatascience.com/how-to-use-a-pre-trained-model-vgg-for-image-classification-8dd7c4a4a517">VGG</a>, un modelo ML que puede extraer características de imágenes.</p>
<p>👉Código <a href="https://github.com/zilliz-bootcamp/image_search">fuente：zilliz-bootcamp/image_search</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_09000e2e2e.jpeg" alt="2.jpeg" class="doc-image" id="2.jpeg" />
   </span> <span class="img-wrapper"> <span>2.jpeg</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">Cómo utilizarlo</h4><ol>
<li>Cargue un conjunto de datos de imágenes comprimido compuesto únicamente por imágenes .jpg (no se aceptan otros tipos de archivos de imagen). También puede descargar un <a href="https://zilliz.com/solutions/image-search">conjunto de datos de muestra</a>.</li>
<li>Cargue una imagen para utilizarla como entrada de búsqueda para encontrar imágenes similares.</li>
</ol>
<p>👉Video: <a href="https://www.youtube.com/watch?v=mTO8YdQObKY">[Demo] Búsqueda de imágenes con Milvus</a></p>
<h4 id="How-it-works" class="common-anchor-header">Cómo funciona</h4><p>Las imágenes se convierten en vectores de características de 512 dimensiones utilizando el modelo VGG y, a continuación, se utiliza Milvus para gestionar y consultar el conjunto de datos.</p>
<p><strong>Procesamiento de datos:</strong></p>
<ol>
<li>El modelo VGG se utiliza para convertir el conjunto de datos de imágenes cargado en vectores de características. A continuación, los vectores se importan a Milvus y se les asignan ID individuales.</li>
<li>Los vectores de características de las imágenes y las rutas de los archivos de imagen correspondientes se almacenan en CacheDB.</li>
</ol>
<p><strong>Búsqueda de imágenes similares:</strong></p>
<ol>
<li>VGG se utiliza para convertir la imagen cargada por un usuario en vectores de características.</li>
<li>Los vectores ID de las imágenes más similares a la imagen de entrada se recuperan de Milvus.</li>
<li>El sistema busca las rutas de los archivos de imagen correspondientes en CacheDB.</li>
</ol>
<p><br/></p>
<h3 id="Audio-search-systems" class="common-anchor-header">Sistemas de búsqueda de audio</h3><p>La búsqueda de voz, música, efectos de sonido y otros tipos de audio permite consultar rápidamente grandes volúmenes de datos de audio y encontrar sonidos similares. Las aplicaciones incluyen la identificación de efectos de sonido similares, la minimización de infracciones de la propiedad intelectual, etc. Para demostrar este escenario de aplicación, Zilliz construyó un sistema de búsqueda de similitud de audio altamente eficiente combinando Milvus con <a href="https://arxiv.org/abs/1912.10211">PANNs, una</a>red neuronal de audio preentrenada a gran escala construida para el reconocimiento de patrones de audio.</p>
<p>👉Código <a href="https://github.com/zilliz-bootcamp/audio_search">fuente：zilliz-bootcamp/audio_search</a> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_419bac3dd2.png" alt="3.png" class="doc-image" id="3.png" /><span>3.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">Cómo utilizarlo</h4><ol>
<li>Cargue un conjunto de datos de audio comprimido compuesto únicamente por archivos .wav (no se aceptan otros tipos de archivos de audio). También puede descargar un <a href="https://zilliz.com/solutions/audio-search">conjunto de datos de muestra</a>.</li>
<li>Cargue un archivo .wav para utilizarlo como entrada de búsqueda para encontrar audio similar.</li>
</ol>
<p>👉Video: <a href="https://www.youtube.com/watch?v=0eQHeqriCXw">[Demo] Búsqueda de audio con Milvus</a></p>
<h4 id="How-it-works" class="common-anchor-header">Cómo funciona</h4><p>El audio se convierte en vectores de características utilizando PANNs, redes neuronales de audio pre-entrenadas a gran escala construidas para el reconocimiento de patrones de audio. A continuación, se utiliza Milvus para gestionar y consultar el conjunto de datos.</p>
<p><strong>Procesamiento de datos:</strong></p>
<ol>
<li>PANNs convierte el audio del conjunto de datos cargado en vectores de características. A continuación, los vectores se importan a Milvus y se les asignan ID individuales.</li>
<li>Los ID de los vectores de características de audio y sus correspondientes rutas de archivos .wav se almacenan en PostgreSQL.</li>
</ol>
<p><strong>Búsqueda de audio similar:</strong></p>
<ol>
<li>PANNs se utiliza para convertir el archivo de audio cargado por un usuario en vectores de características.</li>
<li>Las ID de los vectores de audio más similares al archivo cargado se recuperan de Milvus calculando la distancia del producto interior (PI).</li>
<li>El sistema busca las rutas de los archivos de audio correspondientes en MySQL.</li>
</ol>
<p><br/></p>
<h3 id="Video-object-detection-computer-vision" class="common-anchor-header">Detección de objetos en vídeo (visión por ordenador)</h3><p>La detección de objetos de vídeo tiene aplicaciones en visión por ordenador, recuperación de imágenes, conducción autónoma, etc. Para demostrar este escenario de aplicación, Zilliz construyó un sistema de detección de objetos de vídeo combinando Milvus con tecnologías y algoritmos que incluyen <a href="https://en.wikipedia.org/wiki/OpenCV">OpenCV</a>, <a href="https://towardsdatascience.com/yolo-v3-object-detection-53fb7d3bfe6b">YOLOv3</a> y <a href="https://www.mathworks.com/help/deeplearning/ref/resnet50.html">ResNet50</a>.</p>
<p>👉Código fuente: <a href="https://github.com/zilliz-bootcamp/video_analysis">zilliz-bootcamp/video_analysis</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_54b4ceb2ad.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">Cómo utilizarlo</h4><ol>
<li>Cargue un conjunto de datos de imágenes comprimido compuesto únicamente por archivos .jpg (no se aceptan otros tipos de archivos de imagen). Asegúrese de que cada archivo de imagen lleva el nombre del objeto que representa. También puede descargar un <a href="https://zilliz.com/solutions/video-obj-analysis">conjunto de datos de muestra</a>.</li>
<li>Cargue un vídeo para utilizarlo en el análisis.</li>
<li>Haga clic en el botón de reproducción para ver el vídeo cargado con los resultados de detección de objetos mostrados en tiempo real.</li>
</ol>
<p>👉Video: <a href="https://www.youtube.com/watch?v=m9rosLClByc">[Demo] Sistema de detección de objetos de vídeo con tecnología Milvus</a></p>
<h4 id="How-it-works" class="common-anchor-header">Cómo funciona</h4><p>Las imágenes de objetos se convierten en vectores de características de 2048 dimensiones utilizando ResNet50. A continuación, se utiliza Milvus para gestionar y consultar el conjunto de datos.</p>
<p><strong>Procesamiento de datos:</strong></p>
<ol>
<li>ResNet50 convierte imágenes de objetos en vectores de características de 2048 dimensiones. A continuación, los vectores se importan a Milvus y se les asignan ID individuales.</li>
<li>Los ID de los vectores de características de audio y sus correspondientes rutas de archivo de imagen se almacenan en MySQL.</li>
</ol>
<p><strong>Detección de objetos en vídeo:</strong></p>
<ol>
<li>OpenCV se utiliza para recortar el vídeo.</li>
<li>YOLOv3 se utiliza para detectar objetos en el vídeo.</li>
<li>ResNet50 convierte las imágenes de los objetos detectados en vectores de características de 2048 dimensiones.</li>
</ol>
<p>Milvus busca las imágenes de objetos más similares en el conjunto de datos cargado. Los nombres de los objetos correspondientes y las rutas de los archivos de imagen se recuperan de MySQL.</p>
