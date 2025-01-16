---
id: 2021-10-10-milvus-helps-analyze-videos.md
title: Detección de objetos
author: Shiyu Chen
date: 2021-10-11T00:00:00.000Z
desc: Descubra cómo Milvus potencia el análisis de IA de los contenidos de vídeo.
cover: assets.zilliz.com/Who_is_it_e9d4510ace.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/milvus-helps-analyze-videos-intelligently'
---
<custom-h1>Creación de un sistema de análisis de vídeo con la base de datos vectorial Milvus</custom-h1><p><em>Shiyu Chen, ingeniera de datos de Zilliz, es licenciada en Informática por la Universidad de Xidian. Desde que se incorporó a Zilliz, ha estado explorando soluciones para Milvus en diversos campos, como el análisis de audio y vídeo, la recuperación de fórmulas de moléculas, etc., lo que ha enriquecido enormemente los escenarios de aplicación de la comunidad. Actualmente está explorando más soluciones interesantes. En su tiempo libre, le encantan los deportes y la lectura.</em></p>
<p>El fin de semana pasado, mientras veía <em>Free Guy</em>, tuve la sensación de haber visto antes en alguna parte al actor que interpreta a Buddy, el guardia de seguridad, pero no recordaba ninguno de sus trabajos. Mi cabeza se llenó de "¿quién es este tipo?". Estaba seguro de haber visto esa cara y me esforzaba por recordar su nombre. Un caso similar es que una vez vi al protagonista de un vídeo tomando una bebida que me gustaba mucho, pero acabé por no recordar el nombre de la marca.</p>
<p>Tenía la respuesta en la punta de la lengua, pero mi cerebro se sentía completamente atascado.</p>
<p>El fenómeno de la punta de la lengua (TOT) me vuelve loco cuando veo películas. Ojalá existiera un motor de búsqueda inversa de imágenes para vídeos que me permitiera encontrar vídeos y analizar su contenido. Antes, construí un <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search/quick_deploy">motor de búsqueda inversa de imágenes utilizando Milvus</a>. Teniendo en cuenta que el análisis de contenido de vídeo se parece en cierto modo al análisis de imágenes, decidí construir un motor de análisis de contenido de vídeo basado en Milvus.</p>
<h2 id="Object-detection" class="common-anchor-header">Detección de objetos<button data-href="#Object-detection" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Overview" class="common-anchor-header">Visión general</h3><p>Antes de ser analizados, los objetos de un vídeo deben ser detectados. Detectar objetos en un vídeo de forma eficaz y precisa es el principal reto de la tarea. También es una tarea importante para aplicaciones como el piloto automático, los dispositivos wearables y el IoT.</p>
<p>Desarrollados a partir de algoritmos tradicionales de procesamiento de imágenes hasta redes neuronales profundas (DNN), los principales modelos actuales para la detección de objetos incluyen R-CNN, FRCNN, SSD y YOLO. El sistema de análisis de vídeo de aprendizaje profundo basado en Milvus que se presenta en este tema puede detectar objetos de forma inteligente y rápida.</p>
<h3 id="Implementation" class="common-anchor-header">Implementación</h3><p>Para detectar y reconocer objetos en un vídeo, el sistema debe extraer primero fotogramas de un vídeo y detectar objetos en las imágenes de fotogramas utilizando la detección de objetos, en segundo lugar, extraer vectores de características de los objetos detectados y, por último, analizar el objeto en función de los vectores de características.</p>
<ul>
<li>Extracción de fotogramas</li>
</ul>
<p>El análisis de vídeo se convierte en análisis de imagen mediante la extracción de fotogramas. Actualmente, la tecnología de extracción de fotogramas está muy madura. Programas como FFmpeg y OpenCV permiten extraer fotogramas a intervalos específicos. Este artículo presenta cómo extraer fotogramas de un vídeo cada segundo utilizando OpenCV.</p>
<ul>
<li>Detección de objetos</li>
</ul>
<p>La detección de objetos consiste en encontrar objetos en los fotogramas extraídos y extraer capturas de los objetos según su posición. Como se muestra en las siguientes figuras, se detectaron una bicicleta, un perro y un coche. Este tema presenta cómo detectar objetos utilizando YOLOv3, que se utiliza habitualmente para la detección de objetos.</p>
<ul>
<li>Extracción de características</li>
</ul>
<p>La extracción de características consiste en convertir datos no estructurados, difíciles de reconocer por las máquinas, en vectores de características. Por ejemplo, las imágenes se pueden convertir en vectores de características multidimensionales utilizando modelos de aprendizaje profundo. Actualmente, los modelos de IA de reconocimiento de imágenes más populares incluyen VGG, GNN y ResNet. Este tema presenta cómo extraer características de objetos detectados utilizando ResNet-50.</p>
<ul>
<li>Análisis de vectores</li>
</ul>
<p>Los vectores de características extraídos se comparan con vectores de biblioteca y se devuelve la información correspondiente a los vectores más similares. Para conjuntos de datos de vectores de características a gran escala, el cálculo es un gran reto. Este tema presenta cómo analizar vectores de características utilizando Milvus.</p>
<h2 id="Key-technologies" class="common-anchor-header">Tecnologías clave<button data-href="#Key-technologies" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="OpenCV" class="common-anchor-header">OpenCV</h3><p>Open Source Computer Vision Library (OpenCV) es una biblioteca de visión por ordenador multiplataforma, que proporciona muchos algoritmos universales para el procesamiento de imágenes y la visión por ordenador. OpenCV se utiliza habitualmente en el campo de la visión por ordenador.</p>
<p>El siguiente ejemplo muestra cómo capturar fotogramas de vídeo a intervalos especificados y guardarlos como imágenes utilizando OpenCV con Python.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> cv2 
<span class="hljs-built_in">cap</span> = cv2.VideoCapture(file_path)   
framerate = <span class="hljs-built_in">cap</span>.get(cv2.CAP_PROP_FPS)   
allframes = <span class="hljs-type">int</span>(cv2.VideoCapture.get(<span class="hljs-built_in">cap</span>, <span class="hljs-type">int</span>(cv2.CAP_PROP_FRAME_COUNT)))  
success, image = <span class="hljs-built_in">cap</span>.read() 
cv2.imwrite(file_name, image)
<button class="copy-code-btn"></button></code></pre>
<h3 id="YOLOv3" class="common-anchor-header">YOLOv3</h3><p>You Only Look Once, Version 3 (YOLOv3 [5]) es un algoritmo de detección de objetos de una etapa propuesto en los últimos años. Comparado con los algoritmos tradicionales de detección de objetos con la misma precisión, YOLOv3 es dos veces más rápido. YOLOv3 mencionado en este tema es la versión mejorada de PaddlePaddle [6]. Utiliza múltiples métodos de optimización con una mayor velocidad de inferencia.</p>
<h3 id="ResNet-50" class="common-anchor-header">ResNet-50</h3><p>ResNet [7] es el ganador de ILSVRC 2015 en clasificación de imágenes por su simplicidad y practicidad. Como base de muchos métodos de análisis de imágenes, ResNet demuestra ser un modelo popular especializado en detección, segmentación y reconocimiento de imágenes.</p>
<h3 id="Milvus" class="common-anchor-header">Milvus</h3><p><a href="https://milvus.io/">Milvus</a> es una base de datos vectorial de código abierto y nativa de la nube creada para gestionar vectores de incrustación generados por modelos de aprendizaje automático y redes neuronales. Se utiliza ampliamente en escenarios como la visión por ordenador, el procesamiento del lenguaje natural, la química computacional, los sistemas de recomendación personalizados, etc.</p>
<p>Los siguientes procedimientos describen el funcionamiento de Milvus.</p>
<ol>
<li>Los datos no estructurados se convierten en vectores de características utilizando modelos de aprendizaje profundo y se importan a Milvus.</li>
<li>Milvus almacena e indexa los vectores de características.</li>
<li>Milvus devuelve los vectores más similares al vector consultado por los usuarios.</li>
</ol>
<h2 id="Deployment" class="common-anchor-header">Despliegue<button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>Ahora ya conoce los sistemas de análisis de vídeo basados en Milvus. El sistema consta principalmente de dos partes, como se muestra en la siguiente figura.</p>
<ul>
<li><p>Las flechas rojas indican el proceso de importación de datos. Utilice ResNet-50 para extraer vectores de características del conjunto de datos de imágenes e importe los vectores de características a Milvus.</p></li>
<li><p>Las flechas negras indican el proceso de análisis de vídeo. En primer lugar, se extraen fotogramas de un vídeo y se guardan como imágenes. En segundo lugar, se detectan y extraen objetos de las imágenes con YOLOv3. A continuación, se utiliza ResNet-50 para extraer vectores de características de las imágenes. Por último, Milvus busca y devuelve la información de los objetos con los vectores de características correspondientes.</p></li>
</ul>
<p>Para más información, consulte <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/video_similarity_search/object_detection">Milvus Bootcamp: Sistema de detección de objetos de vídeo</a>.</p>
<p><strong>Importación de datos</strong></p>
<p>El proceso de importación de datos es sencillo. Convierta los datos en vectores de 2.048 dimensiones e importe los vectores a Milvus.</p>
<pre><code translate="no" class="language-python">vector = image_encoder.execute(filename)
entities = [vector]
collection.insert(data=entities)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Análisis de vídeo</strong></p>
<p>Como se ha indicado anteriormente, el proceso de análisis de vídeo incluye la captura de fotogramas de vídeo, la detección de objetos en cada fotograma, la extracción de vectores de los objetos, el cálculo de la similitud de vectores con la métrica de distancia euclidiana (L2) y la búsqueda de resultados utilizando Milvus.</p>
<pre><code translate="no" class="language-python">images = extract_frame(filename, 1, prefix)   
detector = Detector()   
run(detector, DATA_PATH)       
vectors = get_object_vector(image_encoder, DATA_PATH)
search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: 10}}
results = collection.search(vectors, param=search_params, <span class="hljs-built_in">limit</span>=10)
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>En la actualidad, más del 80% de los datos no están estructurados. Con el rápido desarrollo de la IA, se ha desarrollado un número creciente de modelos de aprendizaje profundo para analizar datos no estructurados. Tecnologías como la detección de objetos y el procesamiento de imágenes han logrado grandes avances tanto en el mundo académico como en la industria. Potenciadas por estas tecnologías, cada vez más plataformas de IA han cumplido requisitos prácticos.</p>
<p>El sistema de análisis de vídeo analizado en este tema está construido con Milvus, que puede analizar rápidamente contenidos de vídeo.</p>
<p>Como base de datos vectorial de código abierto, Milvus admite vectores de características extraídos utilizando varios modelos de aprendizaje profundo. Integrado con bibliotecas como Faiss, NMSLIB y Annoy, Milvus proporciona un conjunto de API intuitivas, que permiten cambiar los tipos de índice según los escenarios. Además, Milvus admite el filtrado escalar, lo que aumenta la tasa de recuperación y la flexibilidad de búsqueda. Milvus se ha aplicado a muchos campos, como el procesamiento de imágenes, la visión por ordenador, el procesamiento del lenguaje natural, el reconocimiento del habla, los sistemas de recomendación y el descubrimiento de nuevos fármacos.</p>
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
    </button></h2><p>[1] A. D. Bagdanov, L. Ballan, M. Bertini, A. Del Bimbo. "Trademark matching and retrieval in sports video databases". Proceedings of the international workshop on Workshop on multimedia information retrieval, ACM, 2007. https://www.researchgate.net/publication/210113141_Trademark_matching_and_retrieval_in_sports_video_databases</p>
<p>[2] J. Kleban, X. Xie, W.-Y. Ma. "Spatial pyramid mining for logo detection in natural scenes". IEEE International Conference, 2008. https://ieeexplore.ieee.org/document/4607625</p>
<p>[3] R. Boia, C. Florea, L. Florea, R. Dogaru. "Localización y reconocimiento de logos en imágenes naturales usando grafos de clases homográficas". Machine Vision and Applications 27 (2), 2016. https://link.springer.com/article/10.1007/s00138-015-0741-7</p>
<p>[4] R. Boia, C. Florea, L. Florea. "Aglomeración elíptica asift en prototipo de clase para la detección de logotipos". BMVC, 2015. http://citeseerx.ist.psu.edu/viewdoc/download;jsessionid=5C87F52DE38AB0C90F8340DFEBB841F7?doi=10.1.1.707.9371&amp;rep=rep1&amp;type=pdf</p>
<p>[5] https://arxiv.org/abs/1804.02767</p>
<p>[6] https://paddlepaddle.org.cn/modelbasedetail/yolov3</p>
<p>[7] https://arxiv.org/abs/1512.03385</p>
