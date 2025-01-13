---
id: building-a-search-by-image-shopping-experience-with-vova-and-milvus.md
title: Creación de una experiencia de compra de búsqueda por imagen con VOVA y Milvus
author: milvus
date: 2021-05-13T08:44:05.528Z
desc: >-
  Descubra cómo la plataforma de comercio electrónico VOVA ha utilizado Milvus,
  una base de datos vectorial de código abierto, para impulsar las compras por
  imágenes.
cover: assets.zilliz.com/vova_thumbnail_db2d6c0c9c.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-search-by-image-shopping-experience-with-vova-and-milvus
---
<custom-h1>Creación de una experiencia de compra de búsqueda por imagen con VOVA y Milvus</custom-h1><p>Ir a:</p>
<ul>
<li><a href="#building-a-search-by-image-shopping-experience-with-vova-and-milvus">Construir una experiencia de compra de búsqueda por imagen con VOVA y Milvus</a><ul>
<li><a href="#how-does-image-search-work">¿Cómo funciona la búsqueda por imágenes</a>? - <a href="#system-process-of-vovas-search-by-image-functionality"><em>Proceso de sistema de la funcionalidad de búsqueda por imágenes de VOVA.</em></a></li>
<li><a href="#target-detection-using-the-yolo-model">Detección de objetivos mediante el modelo YOLO</a>- <a href="#yolo-network-architecture"><em>Arquitectura de la red YOLO.</em></a></li>
<li><a href="#image-feature-vector-extraction-with-resnet">Extracción de vectores de características de imagen con ResNet</a>- <a href="#resnet-structure"><em>Estructura de ResNet.</em></a></li>
<li><a href="#vector-similarity-search-powered-by-milvus">Búsqueda por similitud de vectores</a> <a href="#mishards-architecture-in-milvus"><em>con Milvus - Arquitectura de Mishards en Milvus.</em></a></li>
<li><a href="#vovas-shop-by-image-tool">Herramienta</a> <a href="#screenshots-of-vovas-search-by-image-shopping-tool"><em>de compra por imagen de VOVA - Capturas de pantalla de la herramienta de compra por imagen de VOVA.</em></a></li>
<li><a href="#reference">Referencia</a></li>
</ul></li>
</ul>
<p>Las compras en línea aumentaron en 2020, <a href="https://www.digitalcommerce360.com/2021/02/15/ecommerce-during-coronavirus-pandemic-in-charts/">un 44%</a>, en gran parte debido a la pandemia de coronavirus. A medida que la gente buscaba distanciarse socialmente y evitar el contacto con extraños, la entrega sin contacto se convirtió en una opción increíblemente deseable para muchos consumidores. Esta popularidad también ha llevado a la gente a comprar una mayor variedad de productos en línea, incluidos artículos especializados que pueden ser difíciles de describir mediante una búsqueda tradicional por palabras clave.</p>
<p>Para ayudar a los usuarios a superar las limitaciones de las consultas basadas en palabras clave, las empresas pueden crear motores de búsqueda de imágenes que permitan a los usuarios utilizar imágenes en lugar de palabras para la búsqueda. Esto no sólo permite a los usuarios encontrar artículos difíciles de describir, sino que también les ayuda a comprar cosas que encuentran en la vida real. Esta funcionalidad contribuye a crear una experiencia de usuario única y ofrece una comodidad general que los clientes aprecian.</p>
<p>VOVA es una plataforma de comercio electrónico emergente que se centra en la asequibilidad y en ofrecer una experiencia de compra positiva a sus usuarios, con listados que abarcan millones de productos y compatibilidad con 20 idiomas y 35 divisas principales. Para mejorar la experiencia de compra de sus usuarios, la empresa utilizó Milvus para incorporar la funcionalidad de búsqueda de imágenes a su plataforma de comercio electrónico. El artículo explora cómo VOVA construyó con éxito un motor de búsqueda de imágenes con Milvus.</p>
<p><br/></p>
<h3 id="How-does-image-search-work" class="common-anchor-header">¿Cómo funciona la búsqueda por imágenes?</h3><p>El sistema de compra por imágenes de VOVA busca en el inventario de la empresa imágenes de productos que sean similares a las subidas por los usuarios. El siguiente gráfico muestra las dos etapas del proceso del sistema, la etapa de importación de datos (azul) y la etapa de consulta (naranja):</p>
<ol>
<li>Utilizar el modelo YOLO para detectar objetivos a partir de las fotos cargadas;</li>
<li>Utilizar ResNet para extraer vectores de características de los objetivos detectados;</li>
<li>Utilizar Milvus para la búsqueda de similitudes vectoriales.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Vova_1_47ee6f2da9.png" alt="Vova-1.png" class="doc-image" id="vova-1.png" />
   </span> <span class="img-wrapper"> <span>Vova-1.png</span> </span></p>
<p><br/></p>
<h3 id="Target-detection-using-the-YOLO-model" class="common-anchor-header">Detección de objetivos usando el modelo YOLO</h3><p>Las aplicaciones móviles de VOVA para Android e iOS soportan actualmente la búsqueda de imágenes. La empresa utiliza un avanzado sistema de detección de objetos en tiempo real denominado YOLO (You only look once) para detectar objetos en las imágenes cargadas por los usuarios. El modelo YOLO se encuentra actualmente en su quinta iteración.</p>
<p>YOLO es un modelo de una sola etapa, que utiliza una sola red neuronal convolucional (CNN) para predecir categorías y posiciones de distintos objetivos. Es pequeño, compacto y muy adecuado para su uso móvil.</p>
<p>YOLO utiliza capas convolucionales para extraer características y capas totalmente conectadas para obtener valores de predicción. Inspirada en el modelo GooLeNet, la CNN de YOLO incluye 24 capas convolucionales y dos capas totalmente conectadas.</p>
<p>Como muestra la siguiente ilustración, una imagen de entrada de 448 × 448 es convertida por varias capas convolucionales y capas de agrupación en un tensor de 7 × 7 × 1024 dimensiones (representado en el antepenúltimo cubo) y, a continuación, es convertida por dos capas totalmente conectadas en un tensor de salida de 7 × 7 × 30 dimensiones.</p>
<p>La salida predicha de YOLO P es un tensor bidimensional, cuya forma es [lote,7 ×7 ×30]. Utilizando el corte, P[:,0:7×7×20] es la probabilidad de categoría, P[:,7×7×20:7×7×(20+2)] es la confianza, y P[:,7×7×(20+2)]:] es el resultado predicho del cuadro delimitador.</p>
<p>![vova-2.png](https://assets.zilliz.com/vova_2_1ccf38f721.png &quot;Arquitectura de red YOLO.)</p>
<p><br/></p>
<h3 id="Image-feature-vector-extraction-with-ResNet" class="common-anchor-header">Extracción de vectores de características de imagen con ResNet</h3><p>VOVA adoptó el modelo de red neuronal residual (ResNet) para extraer vectores de características a partir de una extensa biblioteca de imágenes de productos y de fotos subidas por los usuarios. ResNet está limitada porque, a medida que aumenta la profundidad de una red de aprendizaje, disminuye su precisión. La imagen siguiente muestra ResNet ejecutando el modelo VGG19 (una variante del modelo VGG) modificado para incluir una unidad residual mediante el mecanismo de cortocircuito. VGG se propuso en 2014 e incluye solo 14 capas, mientras que ResNet salió un año después y puede tener hasta 152.</p>
<p>La estructura ResNet es fácil de modificar y escalar. Cambiando el número de canales en el bloque y el número de bloques apilados, la anchura y la profundidad de la red pueden ajustarse fácilmente para obtener redes con diferentes capacidades expresivas. Esto resuelve eficazmente el efecto de degeneración de la red, en el que la precisión disminuye a medida que aumenta la profundidad del aprendizaje. Con suficientes datos de entrenamiento, se puede obtener un modelo con mejores prestaciones expresivas mientras se profundiza gradualmente en la red. Mediante el entrenamiento del modelo, se extraen las características de cada imagen y se convierten en vectores de 256 dimensiones en coma flotante.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vova_3_df4b810281.png" alt="vova-3.png" class="doc-image" id="vova-3.png" />
   </span> <span class="img-wrapper"> <span>vova-3.png</span> </span></p>
<p><br/></p>
<h3 id="Vector-similarity-search-powered-by-Milvus" class="common-anchor-header">Búsqueda de similitud vectorial con Milvus</h3><p>La base de datos de imágenes de productos de VOVA incluye 30 millones de imágenes y crece rápidamente. Para recuperar rápidamente las imágenes de productos más similares de este enorme conjunto de datos, se utiliza Milvus para realizar la búsqueda de similitud vectorial. Gracias a una serie de optimizaciones, Milvus ofrece un enfoque rápido y racionalizado para la gestión de datos vectoriales y la creación de aplicaciones de aprendizaje automático. Milvus ofrece integración con bibliotecas de índices populares (por ejemplo, Faiss, Annoy), soporta múltiples tipos de índices y métricas de distancia, tiene SDKs en múltiples idiomas, y proporciona APIs ricas para la gestión de datos vectoriales.</p>
<p>Milvus puede realizar búsquedas de similitud en conjuntos de datos de billones de vectores en milisegundos, con un tiempo de consulta inferior a 1,5 segundos cuando nq=1 y un tiempo medio de consulta por lotes inferior a 0,08 segundos. Para construir su motor de búsqueda de imágenes, VOVA se basó en el diseño de Mishards, la solución de middleware de fragmentación de Milvus (véase el gráfico siguiente para conocer el diseño de su sistema), para implementar un clúster de servidores de alta disponibilidad. Al aprovechar la escalabilidad horizontal de un clúster Milvus, se cumplió el requisito del proyecto de un alto rendimiento de consulta en conjuntos de datos masivos.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vova_4_e305f1955c.png" alt="vova-4.png" class="doc-image" id="vova-4.png" />
   </span> <span class="img-wrapper"> <span>vova-4.png</span> </span></p>
<h3 id="VOVAs-shop-by-image-tool" class="common-anchor-header">La herramienta VOVA's shop by image</h3><p>Las capturas de pantalla siguientes muestran la herramienta de compra por imágenes de VOVA en la aplicación Android de la empresa.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vova_5_c4c25a3bae.png" alt="vova-5.png" class="doc-image" id="vova-5.png" />
   </span> <span class="img-wrapper"> <span>vova-5.png</span> </span></p>
<p>A medida que más usuarios busquen productos y suban fotos, VOVA seguirá optimizando los modelos que alimentan el sistema. Además, la empresa incorporará nuevas funcionalidades de Milvus que pueden mejorar aún más la experiencia de compra en línea de sus usuarios.</p>
<h3 id="Reference" class="common-anchor-header">Referencia</h3><p><strong>YOLO</strong></p>
<p>https://arxiv.org/pdf/1506.02640.pdf</p>
<p>https://arxiv.org/pdf/1612.08242.pdf</p>
<p><strong>ResNet:</strong></p>
<p>https://arxiv.org/abs/1512.03385</p>
<p><strong>Milvus</strong></p>
<p>https://milvus.io/docs</p>
