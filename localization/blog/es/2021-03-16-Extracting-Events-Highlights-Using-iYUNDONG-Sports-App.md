---
id: Extracting-Events-Highlights-Using-iYUNDONG-Sports-App.md
title: >-
  Extracción de lo más destacado de un acontecimiento con la aplicación iYUNDONG
  Sports
author: milvus
date: 2021-03-16T03:41:30.983Z
desc: >-
  Realización con Milvus Sistema inteligente de recuperación de imágenes para
  deportes App iYUNDONG
cover: assets.zilliz.com/blog_iyundong_6db0f70ef4.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/Extracting-Events-Highlights-Using-iYUNDONG-Sports-App'
---
<custom-h1>Cómo extraer lo más destacado de un evento con la aplicación deportiva iYUNDONG</custom-h1><p>iYUNDONG es una empresa de Internet cuyo objetivo es atraer a más amantes del deporte y participantes en eventos como carreras de maratón. Desarrolla herramientas <a href="https://en.wikipedia.org/wiki/Artificial_intelligence">de inteligencia artificial (IA)</a> capaces de analizar imágenes captadas durante eventos deportivos para generar automáticamente lo más destacado. Por ejemplo, al subir un selfie, un usuario de la aplicación deportiva iYUNDONG que haya participado en un acontecimiento deportivo puede recuperar instantáneamente sus propias fotos o vídeos de un enorme conjunto de datos multimedia del acontecimiento.</p>
<p>Una de las principales funciones de la aplicación iYUNDONG es "Encuéntrame en movimiento".  Los fotógrafos suelen tomar grandes cantidades de fotos o vídeos durante un acontecimiento deportivo, como una carrera de maratón, y los suben en tiempo real a la base de datos iYUNDONG. Los corredores de maratón que quieran ver sus momentos destacados pueden recuperar fotos en las que aparezcan ellos mismos simplemente subiendo uno de sus selfies. Esto les ahorra mucho tiempo, ya que un sistema de recuperación de imágenes de la aplicación iYUNDONG se encarga de cotejarlas. iYUNDONG adopta <a href="https://milvus.io/">Milvus</a> para impulsar este sistema, ya que Milvus puede acelerar enormemente el proceso de recuperación y devolver resultados muy precisos.</p>
<p><br/></p>
<p><strong>Ir a:</strong></p>
<ul>
<li><a href="#extracting-event-highlights-using-iyundong-sports-app">Extracción de lo más destacado de un evento mediante la aplicación iYUNDONG Sports</a><ul>
<li><a href="#difficulties-and-solutions">Dificultades y soluciones</a></li>
<li><a href="#what-is-milvus">Qué es Milvus</a>- <a href="#an-overview-of-milvus"><em>Una visión general de Milvus.</em></a></li>
<li><a href="#why-milvus">Por qué Milvus</a></li>
<li><a href="#system-and-workflow">Sistema y flujo de trabajo</a></li>
<li><a href="#iyundong-app-interface">Interfaz</a> <a href="#iyundong-app-interface-1"><em>de</em></a><a href="#iyundong-app-interface">la aplicación</a> <a href="#iyundong-app-interface-1"><em>iYUNDONG</em></a> - <a href="#iyundong-app-interface-1"><em>Interfaz de la aplicación iYUNDONG.</em></a></li>
<li><a href="#conclusion">Conclusión</a></li>
</ul></li>
</ul>
<p><br/></p>
<h3 id="Difficulties-and-solutions" class="common-anchor-header">Dificultades y soluciones</h3><p>iYUNDONG se enfrentó a los siguientes problemas y encontró con éxito las soluciones correspondientes al crear su sistema de recuperación de imágenes.</p>
<ul>
<li>Las fotos de los eventos deben estar disponibles inmediatamente para su búsqueda.</li>
</ul>
<p>iYUNDONG desarrolló una función llamada InstantUpload para garantizar que las fotos de los eventos estuvieran disponibles para la búsqueda inmediatamente después de ser cargadas.</p>
<ul>
<li>Almacenamiento de conjuntos de datos masivos</li>
</ul>
<p>Cada milisegundo se cargan en el backend de iYUNDONG datos masivos como fotos y vídeos. Por ello, iYUNDONG decidió migrar a sistemas de almacenamiento en la nube como <a href="https://aws.amazon.com/">AWS</a>, <a href="https://aws.amazon.com/s3/?nc1=h_ls">S3</a> y <a href="https://www.alibabacloud.com/product/oss">Alibaba Cloud Object Storage Service (OSS)</a> para gestionar volúmenes gigantescos de datos no estructurados de forma segura, rápida y fiable.</p>
<ul>
<li>Lectura instantánea</li>
</ul>
<p>Para lograr la lectura instantánea, iYUNDONG desarrolló su propio middleware de fragmentación para lograr fácilmente la escalabilidad horizontal y mitigar el impacto en el sistema de la lectura en disco. Además, <a href="https://redis.io/">Redis</a> se utiliza como capa de almacenamiento en caché para garantizar un rendimiento constante en situaciones de alta concurrencia.</p>
<ul>
<li>Extracción instantánea de rasgos faciales</li>
</ul>
<p>Para extraer con precisión y eficacia los rasgos faciales de las fotos cargadas por los usuarios, iYUNDONG desarrolló un algoritmo propio de conversión de imágenes que las convierte en vectores de rasgos de 128 dimensiones. Otro problema que se planteó fue que, a menudo, muchos usuarios y fotógrafos cargaban imágenes o vídeos simultáneamente. Por eso, los ingenieros de sistemas tuvieron que tener en cuenta la escalabilidad dinámica a la hora de desplegar el sistema. Más concretamente, iYUNDONG aprovechó al máximo su servicio de computación elástica (ECS) en la nube para lograr un escalado dinámico.</p>
<ul>
<li>Búsqueda vectorial rápida y a gran escala</li>
</ul>
<p>iYUNDONG necesitaba una base de datos de vectores para almacenar su gran número de vectores de características extraídos por modelos de IA. De acuerdo con su escenario de aplicación empresarial único, iYUNDONG esperaba que la base de datos de vectores fuera capaz de:</p>
<ol>
<li>Realizar una recuperación de vectores rapidísima en conjuntos de datos ultra grandes.</li>
<li>Lograr un almacenamiento masivo a bajo coste.</li>
</ol>
<p>Al principio, se procesaba una media de un millón de imágenes al año, por lo que iYUNDONG almacenaba todos sus datos de búsqueda en RAM. Sin embargo, en los últimos dos años, su negocio se disparó y experimentó un crecimiento exponencial de los datos no estructurados: el número de imágenes en la base de datos de iYUNDONG superó los 60 millones en 2019, lo que significa que había más de mil millones de vectores de características que necesitaban ser almacenados. Una cantidad ingente de datos hizo inevitablemente que el sistema iYUNDONG tuviera una estructura pesada y consumiera muchos recursos. Así que tuvo que invertir continuamente en instalaciones de hardware para garantizar un alto rendimiento. En concreto, iYUNDONG desplegó más servidores de búsqueda, mayor memoria RAM y una CPU de mejor rendimiento para lograr una mayor eficiencia y escalabilidad horizontal. Sin embargo, uno de los defectos de esta solución era que elevaba prohibitivamente los costes operativos. Por ello, iYUNDONG empezó a explorar una solución mejor para este problema y sopesó la posibilidad de aprovechar bibliotecas de índices vectoriales como Faiss para ahorrar costes y dirigir mejor su negocio. Finalmente, iYUNDONG eligió la base de datos vectorial de código abierto Milvus.</p>
<p><br/></p>
<h3 id="What-is-Milvus" class="common-anchor-header">Qué es Milvus</h3><p>Milvus es una base de datos vectorial de código abierto fácil de usar, muy flexible, fiable y rapidísima. Combinado con varios modelos de aprendizaje profundo, como el reconocimiento de fotos y voz, el procesamiento de vídeo, el procesamiento del lenguaje natural, Milvus puede procesar y analizar datos no estructurados que se convierten en vectores mediante el uso de varios algoritmos de IA. A continuación se muestra el flujo de trabajo de cómo Milvus procesa todos los datos no estructurados:</p>
<p>● Los datos no estructurados se convierten en vectores de incrustación mediante modelos de aprendizaje profundo u otros algoritmos de IA.</p>
<p>A continuación, los vectores incrustados se insertan en Milvus para su almacenamiento. Milvus también construye índices para esos vectores.</p>
<p>● Milvus realiza búsquedas de similitud y devuelve resultados de búsqueda precisos basados en diversas necesidades empresariales.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/i_YUNDONG_Blog_1_d8abe065ae.png" alt="iYUNDONG Blog 1.png" class="doc-image" id="iyundong-blog-1.png" />
   </span> <span class="img-wrapper"> <span>iYUNDONG Blog 1.png</span> </span></p>
<p><br/></p>
<h3 id="Why-Milvus" class="common-anchor-header">Por qué Milvus</h3><p>Desde finales de 2019, iYUNDONG ha llevado a cabo una serie de pruebas sobre el uso de Milvus para potenciar su sistema de recuperación de imágenes. Los resultados de las pruebas resultaron que Milvus supera a otras bases de datos vectoriales principales, ya que admite múltiples índices y puede reducir eficientemente el uso de RAM, comprimiendo significativamente la línea de tiempo para la búsqueda de similitud vectorial.</p>
<p>Además, Milvus publica regularmente nuevas versiones. Durante el periodo de pruebas, Milvus ha pasado por múltiples actualizaciones de versión, desde la v0.6.0 hasta la v0.10.1.</p>
<p>Además, con su activa comunidad de código abierto y sus potentes funciones listas para usar, Milvus permite a iYUNDONG operar con un presupuesto de desarrollo ajustado.</p>
<p><br/></p>
<h3 id="System-and-Workflow" class="common-anchor-header">Sistema y flujo de trabajo</h3><p>El sistema de iYUNDONG extrae los rasgos faciales detectando primero las caras en las fotos de eventos subidas por los fotógrafos. A continuación, esos rasgos faciales se convierten en vectores de 128 dimensiones y se almacenan en la biblioteca Milvus. Milvus crea índices para esos vectores y puede devolver instantáneamente resultados muy precisos.</p>
<p>Otra información adicional, como los ID de las fotos y las coordenadas que indican la posición de un rostro en una foto, se almacenan en una base de datos de terceros.</p>
<p>Cada vector de características tiene su ID único en la biblioteca Milvus. iYUNDONG adoptó el <a href="https://github.com/Meituan-Dianping/Leaf">algoritmo Leaf</a>, un servicio distribuido de generación de ID desarrollado por la plataforma básica de I+D <a href="https://about.meituan.com/en">Meituan</a>, para asociar el ID del vector en Milvus con su correspondiente información adicional almacenada en otra base de datos. Combinando el vector de características y la información adicional, el sistema iYUNDONG puede devolver resultados similares a la búsqueda del usuario.</p>
<p><br/></p>
<h3 id="iYUNDONG-App-Interface" class="common-anchor-header">Interfaz de la aplicación iYUNDONG</h3><p>En la página de inicio aparecen una serie de eventos deportivos de última hora. Al tocar uno de los eventos, los usuarios pueden ver todos los detalles.</p>
<p>Tras pulsar el botón situado en la parte superior de la página de la galería de fotos, los usuarios pueden subir una foto propia para obtener imágenes de sus momentos más destacados.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/iyundong_interface_3da684d206.jpg" alt="iyundong-interface.jpg" class="doc-image" id="iyundong-interface.jpg" />
   </span> <span class="img-wrapper"> <span>iyundong-interfaz.jpg</span> </span></p>
<p><br/></p>
<h3 id="Conclusion" class="common-anchor-header">Conclusión</h3><p>Este artículo presenta cómo la aplicación iYUNDONG crea un sistema inteligente de recuperación de imágenes capaz de ofrecer resultados de búsqueda precisos a partir de fotos subidas por los usuarios que varían en resolución, tamaño, claridad, ángulo y otros aspectos que complican la búsqueda de similitudes. Con la ayuda de Milvus, iYUNDONG App puede realizar consultas de nivel de milisegundos en una base de datos de más de 60 millones de imágenes. Y la tasa de precisión de la recuperación de fotos está constantemente por encima del 92%. Milvus facilita a iYUNDONG la creación de un potente sistema de recuperación de imágenes de nivel empresarial en poco tiempo y con recursos limitados.</p>
<p>Lea otras <a href="https://zilliz.com/user-stories">historias de usuarios</a> para saber más sobre cómo hacer cosas con Milvus.</p>
