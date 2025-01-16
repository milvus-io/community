---
id: Making-with-Milvus-Detecting-Android-Viruses-in-Real-Time-for-Trend-Micro.md
title: >-
  Fabricación con Milvus Detección de virus Android en tiempo real para Trend
  Micro
author: milvus
date: 2021-04-23T06:46:13.732Z
desc: >-
  Descubra cómo se utiliza Milvus para mitigar las amenazas a los datos críticos
  y reforzar la ciberseguridad con la detección de virus en tiempo real.
cover: assets.zilliz.com/blog_Trend_Micro_5c8ba3e2ce.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-with-Milvus-Detecting-Android-Viruses-in-Real-Time-for-Trend-Micro
---
<custom-h1>Making with Milvus: Detección de virus Android en tiempo real para Trend Micro</custom-h1><p>La ciberseguridad sigue siendo una amenaza persistente tanto para los particulares como para las empresas, ya que la preocupación por la privacidad de los datos aumentará para <a href="https://www.getapp.com/resources/annual-data-security-report/">el 86% de las empresas</a> en 2020 y solo <a href="https://merchants.fiserv.com/content/dam/firstdata/us/en/documents/pdf/digital-commerce-cybersecurity-ebook.pdf">el 23% de los consumidores</a> cree que sus datos personales están muy seguros. A medida que el malware se vuelve cada vez más omnipresente y sofisticado, un enfoque proactivo para la detección de amenazas se ha vuelto esencial. <a href="https://www.trendmicro.com/en_us/business.html">Trend Micro</a> es líder mundial en seguridad en la nube híbrida, defensa de redes, seguridad para pequeñas empresas y seguridad para puntos finales. Para proteger los dispositivos Android de los virus, la empresa creó Trend Micro Mobile Security, una aplicación móvil que compara los APK (paquetes de aplicaciones Android) de Google Play Store con una base de datos de malware conocido. El sistema de detección de virus funciona de la siguiente manera</p>
<ul>
<li>Se rastrean los APK (paquete de aplicaciones Android) externos de Google Play Store.</li>
<li>El malware conocido se convierte en vectores y se almacena en <a href="https://www.milvus.io/docs/v1.0.0/overview.md">Milvus</a>.</li>
<li>Los nuevos APK también se convierten en vectores y se comparan con la base de datos de malware mediante una búsqueda de similitudes.</li>
<li>Si un vector APK es similar a cualquiera de los vectores de malware, la aplicación proporciona a los usuarios información detallada sobre el virus y su nivel de amenaza.</li>
</ul>
<p>Para funcionar, el sistema tiene que realizar búsquedas de similitud muy eficientes en conjuntos de datos de vectores masivos en tiempo real. Al principio, Trend Micro utilizaba <a href="https://www.mysql.com/">MySQL</a>. Sin embargo, a medida que su negocio crecía, también lo hacía el número de APK con código nefasto almacenados en su base de datos. El equipo de algoritmos de la empresa comenzó a buscar soluciones alternativas de búsqueda de similitud vectorial después de que MySQL quedara rápidamente obsoleto.</p>
<p><br/></p>
<h3 id="Comparing-vector-similarity-search-solutions" class="common-anchor-header">Comparación de soluciones de búsqueda de similitud vectorial</h3><p>Existen varias soluciones de búsqueda de similitud vectorial, muchas de las cuales son de código abierto. Aunque las circunstancias varían de un proyecto a otro, la mayoría de los usuarios se benefician de aprovechar una base de datos vectorial creada para el procesamiento y análisis de datos no estructurados, en lugar de una simple biblioteca que requiere una amplia configuración. A continuación comparamos algunas soluciones populares de búsqueda de similitud vectorial y explicamos por qué Trend Micro eligió Milvus.</p>
<h4 id="Faiss" class="common-anchor-header">Faiss</h4><p><a href="https://ai.facebook.com/tools/faiss/">Faiss</a> es una biblioteca desarrollada por Facebook AI Research que permite la búsqueda eficiente de similitudes y la agrupación de vectores densos. Los algoritmos que contiene buscan vectores de cualquier tamaño en conjuntos. Faiss está escrita en C++ con wrappers para Python/numpy, y admite varios índices, como IndexFlatL2, IndexFlatIP, HNSW e IVF.</p>
<p>Aunque Faiss es una herramienta increíblemente útil, tiene limitaciones. Sólo funciona como una biblioteca básica de algoritmos, no como una base de datos para gestionar conjuntos de datos vectoriales. Además, no ofrece una versión distribuida, servicios de monitorización, SDK o alta disponibilidad, que son las características clave de la mayoría de los servicios basados en la nube.</p>
<h4 id="Plug-ins-based-on-Faiss--other-ANN-search-libraries" class="common-anchor-header">Plug-ins basados en Faiss y otras bibliotecas de búsqueda RNA</h4><p>Existen varios complementos creados sobre Faiss, NMSLIB y otras bibliotecas de búsqueda RNA que están diseñados para mejorar la funcionalidad básica de la herramienta subyacente que los alimenta. Elasticsearch (ES) es un motor de búsqueda basado en la biblioteca Lucene con varios plugins de este tipo. A continuación se muestra un diagrama de arquitectura de un complemento de ES:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_3ce4e516c3.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>El soporte integrado para sistemas distribuidos es una de las principales ventajas de una solución ES. Esto ahorra tiempo a los desarrolladores y dinero a las empresas gracias al código que no hay que escribir. Los plug-ins de ES son técnicamente avanzados y están muy extendidos. Elasticsearch proporciona un QueryDSL (lenguaje específico de dominio), que define consultas basadas en JSON y es fácil de comprender. Un conjunto completo de servicios ES permite realizar búsquedas vectoriales/textuales y filtrar datos escalares simultáneamente.</p>
<p>Amazon, Alibaba y Netease son algunas de las grandes empresas tecnológicas que actualmente confían en los plug-ins de Elasticsearch para la búsqueda vectorial de similitudes. Los principales inconvenientes de esta solución son el elevado consumo de memoria y la falta de soporte para el ajuste del rendimiento. En cambio, <a href="http://jd.com/">JD.com</a> ha desarrollado su propia solución distribuida basada en Faiss, denominada <a href="https://github.com/vearch/vearch">Vearch</a>. Sin embargo, Vearch sigue siendo un proyecto en fase de incubación y su comunidad de código abierto está relativamente inactiva.</p>
<h4 id="Milvus" class="common-anchor-header">Milvus</h4><p><a href="https://www.milvus.io/">Milvus</a> es una base de datos vectorial de código abierto creada por <a href="https://zilliz.com">Zilliz</a>. Es muy flexible, fiable y rapidísima. Al encapsular múltiples bibliotecas de índices ampliamente adoptadas, como Faiss, NMSLIB y Annoy, Milvus proporciona un amplio conjunto de API intuitivas, lo que permite a los desarrolladores elegir el tipo de índice ideal para su escenario. También proporciona soluciones distribuidas y servicios de supervisión. Milvus cuenta con una comunidad de código abierto muy activa y más de 5,5K estrellas en <a href="https://github.com/milvus-io/milvus">Github</a>.</p>
<h4 id="Milvus-bests-the-competition" class="common-anchor-header">Milvus supera a la competencia</h4><p>Hemos recopilado una serie de resultados de pruebas diferentes de las distintas soluciones de búsqueda de similitud vectorial mencionadas anteriormente. Como podemos ver en la siguiente tabla comparativa, Milvus fue significativamente más rápido que la competencia a pesar de haber sido probado en un conjunto de datos de 1.000 millones de vectores de 128 dimensiones.</p>
<table>
<thead>
<tr><th style="text-align:left"><strong>Motor</strong></th><th style="text-align:left"><strong>Rendimiento (ms)</strong></th><th style="text-align:left"><strong>Tamaño del conjunto de datos (millones)</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:left">ES</td><td style="text-align:left">600</td><td style="text-align:left">1</td></tr>
<tr><td style="text-align:left">ES + Alibaba Cloud</td><td style="text-align:left">900</td><td style="text-align:left">20</td></tr>
<tr><td style="text-align:left">Milvus</td><td style="text-align:left">27</td><td style="text-align:left">1000+</td></tr>
<tr><td style="text-align:left">SPTAG</td><td style="text-align:left">No es bueno</td><td style="text-align:left"></td></tr>
<tr><td style="text-align:left">ES + nmslib, faiss</td><td style="text-align:left">90</td><td style="text-align:left">150</td></tr>
</tbody>
</table>
<h6 id="A-comparison-of-vector-similarity-search-solutions" class="common-anchor-header"><em>Comparación de soluciones de búsqueda de similitud vectorial.</em></h6><p>Tras sopesar los pros y los contras de cada solución, Trend Micro se decantó por Milvus para su modelo de recuperación vectorial. Con un rendimiento excepcional en conjuntos de datos masivos a escala de miles de millones, es obvio por qué la empresa eligió Milvus para un servicio de seguridad móvil que requiere una búsqueda de similitud vectorial en tiempo real.</p>
<p><br/></p>
<h3 id="Designing-a-system-for-real-time-virus-detection" class="common-anchor-header">Diseño de un sistema de detección de virus en tiempo real</h3><p>Trend Micro tiene más de 10 millones de APK maliciosos almacenados en su base de datos MySQL, con 100.000 nuevos APK añadidos cada día. El sistema funciona extrayendo y calculando los valores Thash de los distintos componentes de un archivo APK y, a continuación, utiliza el algoritmo Sha256 para transformarlo en archivos binarios y generar valores Sha256 de 256 bits que diferencian el APK de los demás. Dado que los valores Sha256 varían con los archivos APK, un APK puede tener un valor Thash combinado y un valor Sha256 único.</p>
<p>Los valores Sha256 sólo se utilizan para diferenciar APKs, y los valores Thash se utilizan para la recuperación de similitud de vectores. APKs similares pueden tener los mismos valores Thash pero diferentes valores Sha256.</p>
<p>Para detectar APK con código malicioso, Trend Micro desarrolló su propio sistema para recuperar valores Thash similares y sus correspondientes valores Sha256. Trend Micro eligió Milvus para realizar una búsqueda instantánea de similitud vectorial en conjuntos de datos vectoriales masivos convertidos a partir de valores Thash. Una vez ejecutada la búsqueda de similitudes, los valores Sha256 correspondientes se consultan en MySQL. También se añade una capa de caché Redis a la arquitectura para asignar valores Thash a valores Sha256, lo que reduce significativamente el tiempo de consulta.</p>
<p>A continuación se muestra el diagrama de arquitectura del sistema de seguridad móvil de Trend Micro.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_20210118_022039_ae824b663c.png" alt="image-20210118-022039.png" class="doc-image" id="image-20210118-022039.png" />
   </span> <span class="img-wrapper"> <span>image-20210118-022039.png</span> </span></p>
<p><br/></p>
<p>La elección de una métrica de distancia adecuada ayuda a mejorar la clasificación vectorial y el rendimiento de la agrupación. La siguiente tabla muestra las <a href="https://www.milvus.io/docs/v1.0.0/metric.md#binary">métricas de</a> distancia y los índices correspondientes que funcionan con vectores binarios.</p>
<table>
<thead>
<tr><th><strong>Métrica de distancia</strong></th><th><strong>Tipos de índices</strong></th></tr>
</thead>
<tbody>
<tr><td>- Jaccard <br/> - Tanimoto <br/> - Hamming</td><td>- PLANO <br/> - IVF_FLAT</td></tr>
<tr><td>- Superestructura <br/> - Subestructura</td><td>FLAT</td></tr>
</tbody>
</table>
<h6 id="Distance-metrics-and-indexes-for-binary-vectors" class="common-anchor-header"><em>Métricas de distancia e índices para vectores binarios.</em></h6><p><br/></p>
<p>Trend Micro convierte los valores Thash en vectores binarios y los almacena en Milvus. Para este escenario, Trend Micro utiliza la distancia Hamming para comparar vectores.</p>
<p>Milvus pronto soportará ID de vectores de cadena, y los ID de enteros no tendrán que ser mapeados al nombre correspondiente en formato de cadena. Esto hace que la capa de caché Redis sea innecesaria y que la arquitectura del sistema sea menos voluminosa.</p>
<p>Trend Micro adopta una solución basada en la nube e implementa muchas tareas en <a href="https://kubernetes.io/">Kubernetes</a>. Para lograr una alta disponibilidad, Trend Micro utiliza <a href="https://www.milvus.io/docs/v1.0.0/mishards.md">Mishards</a>, un middleware de fragmentación de clústeres Milvus desarrollado en Python.</p>
<p>![image-20210118-022104.png](https://assets.zilliz.com/image_20210118_022104_3001950ee8.png &quot;Mishards architecture in Milvus.)</p>
<p><br/></p>
<p>Trend Micro separa el almacenamiento y el cálculo de distancias almacenando todos los vectores en el <a href="https://aws.amazon.com/efs/">EFS</a> (Elastic File System) proporcionado por <a href="https://aws.amazon.com/">AWS</a>. Esta práctica es una tendencia popular en la industria. Kubernetes se utiliza para iniciar múltiples nodos de lectura, y desarrolla servicios LoadBalancer en estos nodos de lectura para garantizar una alta disponibilidad.</p>
<p>Para mantener la coherencia de los datos, Mishards solo admite un nodo de escritura. Sin embargo, una versión distribuida de Milvus con soporte para múltiples nodos de escritura estará disponible en los próximos meses.</p>
<p><br/></p>
<h3 id="Monitoring-and-Alert-Functions" class="common-anchor-header">Funciones de supervisión y alerta</h3><p>Milvus es compatible con sistemas de supervisión basados en <a href="https://prometheus.io/">Prometheus</a> y utiliza <a href="https://grafana.com/">Grafana</a>, una plataforma de código abierto para análisis de series temporales, para visualizar diversas métricas de rendimiento.</p>
<p>Prometheus supervisa y almacena las siguientes métricas:</p>
<ul>
<li>Métricas de rendimiento de Milvus, incluida la velocidad de inserción, la velocidad de consulta y el tiempo de actividad de Milvus.</li>
<li>Métricas de rendimiento del sistema, incluido el uso de CPU/GPU, el tráfico de red y la velocidad de acceso al disco.</li>
<li>Métricas de almacenamiento de hardware, incluido el tamaño de los datos y el número total de archivos.</li>
</ul>
<p>El sistema de supervisión y alerta funciona de la siguiente manera:</p>
<ul>
<li>Un cliente Milvus envía datos métricos personalizados a Pushgateway.</li>
<li>Pushgateway garantiza que los datos métricos efímeros y de corta duración se envíen de forma segura a Prometheus.</li>
<li>Prometheus sigue extrayendo datos de Pushgateway.</li>
<li>Alertmanager establece el umbral de alerta para diferentes métricas y emite alarmas a través de correos electrónicos o mensajes.</li>
</ul>
<p><br/></p>
<h3 id="System-Performance" class="common-anchor-header">Rendimiento del sistema</h3><p>Han pasado un par de meses desde que se lanzó por primera vez el servicio ThashSearch basado en Milvus. El siguiente gráfico muestra que la latencia de las consultas de extremo a extremo es inferior a 95 milisegundos.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_20210118_022116_a0c735ce20.png" alt="image-20210118-022116.png" class="doc-image" id="image-20210118-022116.png" />
   </span> <span class="img-wrapper"> <span>image-20210118-022116.png</span> </span></p>
<p><br/></p>
<p>La inserción también es rápida. Se tardan unos 10 segundos en insertar 3 millones de vectores de 192 dimensiones. Con la ayuda de Milvus, el rendimiento del sistema pudo cumplir los criterios de rendimiento establecidos por Trend Micro.</p>
<p><br/></p>
<h3 id="Don’t-be-a-stranger" class="common-anchor-header">No sea un extraño</h3><ul>
<li>Encuentre o contribuya a Milvus en <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Interactúe con la comunidad a través de <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Conéctese con nosotros en <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
