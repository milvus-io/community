---
id: Whats-Inside-Milvus-1.0.md
title: ¿Qué contiene Milvus 1.0?
author: milvus
date: 2021-04-29T08:46:04.019Z
desc: >-
  Milvus v1.0 ya está disponible. Conozca los fundamentos de Milvus y las
  principales características de Milvus v1.0.
cover: assets.zilliz.com/Milvus_510cf50aee.jpeg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/Whats-Inside-Milvus-1.0'
---
<custom-h1>¿Qué contiene Milvus 1.0?</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_510cf50aee.jpeg" alt="Milvus.jpeg" class="doc-image" id="milvus.jpeg" />
   </span> <span class="img-wrapper"> <span>Milvus.jpeg</span> </span></p>
<p>Milvus es una base de datos vectorial de código abierto diseñada para gestionar conjuntos de datos vectoriales masivos de millones, billones o incluso trillones. Milvus tiene amplias aplicaciones que abarcan el descubrimiento de nuevos fármacos, la visión por ordenador, la conducción autónoma, los motores de recomendación, los chatbots y mucho más.</p>
<p>En marzo de 2021, Zilliz, la empresa que está detrás de Milvus, lanzó la primera versión de soporte a largo plazo de la plataforma: Milvus v1.0. Después de meses de pruebas exhaustivas, una versión estable y lista para la producción de la base de datos vectorial más popular del mundo está lista para el prime time. Este artículo del blog cubre algunos fundamentos de Milvus, así como las características clave de la v1.0.</p>
<p><br/></p>
<h3 id="Milvus-distributions" class="common-anchor-header">Distribuciones de Milvus</h3><p>Milvus está disponible en distribuciones para CPU y para GPU. La primera depende exclusivamente de la CPU para la creación de índices y la búsqueda; la segunda permite la búsqueda híbrida con CPU y GPU y la creación de índices, lo que acelera aún más Milvus. Por ejemplo, con la distribución híbrida, la CPU puede utilizarse para la búsqueda y la GPU para la creación de índices, lo que mejora aún más la eficiencia de las consultas.</p>
<p>Ambas distribuciones de Milvus están disponibles en Docker. Puede compilar Milvus desde Docker (si su sistema operativo lo soporta) o compilar Milvus desde el código fuente en Linux (otros sistemas operativos no son compatibles).</p>
<p><br/></p>
<h3 id="Embedding-vectors" class="common-anchor-header">Incrustación de vectores</h3><p>Los vectores se almacenan en Milvus como entidades. Cada entidad tiene un campo de ID de vector y un campo de vector. Milvus v1.0 sólo soporta IDs de vectores enteros. Al crear una colección dentro de Milvus, los ID de vector pueden generarse automáticamente o definirse manualmente. Milvus garantiza que los ID de vectores generados automáticamente son únicos; sin embargo, los ID definidos manualmente pueden duplicarse dentro de Milvus. Si se definen manualmente los IDs, los usuarios son responsables de asegurarse de que todos los IDs son únicos.</p>
<p><br/></p>
<h3 id="Partitions" class="common-anchor-header">Particiones</h3><p>Milvus permite crear particiones en una colección. En situaciones en las que los datos se insertan regularmente y los datos históricos no son significativos (por ejemplo, datos en flujo), las particiones pueden utilizarse para acelerar la búsqueda de similitud vectorial. Una colección puede tener hasta 4.096 particiones. La especificación de una búsqueda vectorial dentro de una partición específica acota la búsqueda y puede reducir significativamente el tiempo de consulta, en particular para colecciones que contienen más de un billón de vectores.</p>
<p><br/></p>
<h3 id="Index-algorithm-optimizations" class="common-anchor-header">Optimizaciones del algoritmo de índices</h3><p>Milvus está construido sobre múltiples bibliotecas de índices ampliamente adoptadas, incluyendo Faiss, NMSLIB y Annoy. Milvus es mucho más que una envoltura básica para estas bibliotecas de índices. Estas son algunas de las principales mejoras que se han introducido en las bibliotecas subyacentes:</p>
<ul>
<li>Optimización del rendimiento de los índices IVF mediante el algoritmo k-means de Elkan.</li>
<li>Optimizaciones de búsqueda FLAT.</li>
<li>Soporte de índice híbrido IVF_SQ8H, que puede reducir el tamaño de los archivos de índice hasta en un 75% sin sacrificar la precisión de los datos. IVF_SQ8H se basa en IVF_SQ8, con una recuperación idéntica pero una velocidad de consulta mucho mayor. Se ha diseñado específicamente para Milvus con el fin de aprovechar la capacidad de procesamiento paralelo de las GPU y el potencial de sinergia entre el coprocesamiento CPU/GPU.</li>
<li>Compatibilidad dinámica del conjunto de instrucciones.</li>
</ul>
<p><br/></p>
<h3 id="Search-index-building-and-other-Milvus-optimizations" class="common-anchor-header">Búsqueda, creación de índices y otras optimizaciones de Milvus</h3><p>Se han realizado las siguientes optimizaciones en Milvus para mejorar el rendimiento de la búsqueda y la creación de índices.</p>
<ul>
<li>El rendimiento de la búsqueda se optimiza en situaciones en las que el número de consultas (nq) es inferior al número de subprocesos de la CPU.</li>
<li>Milvus combina las peticiones de búsqueda de un cliente que tienen el mismo topK y los mismos parámetros de búsqueda.</li>
<li>La creación de índices se suspende cuando entran solicitudes de búsqueda.</li>
<li>Milvus precarga automáticamente las colecciones en la memoria al inicio.</li>
<li>Se pueden asignar varios dispositivos GPU para acelerar la búsqueda de similitud vectorial.</li>
</ul>
<p><br/></p>
<h3 id="Distance-metrics" class="common-anchor-header">Métricas de distancia</h3><p>Milvus es una base de datos vectorial creada para potenciar la búsqueda de similitudes vectoriales. La plataforma se construyó teniendo en cuenta los MLOps y las aplicaciones de IA a nivel de producción. Milvus admite una amplia gama de métricas de distancia para calcular la similitud, como la distancia euclidiana (L2), el producto interior (PI), la distancia Jaccard, Tanimoto, la distancia Hamming, la superestructura y la subestructura. Las dos últimas métricas se utilizan habitualmente en la búsqueda molecular y el descubrimiento de nuevos fármacos impulsado por la IA.</p>
<p><br/></p>
<h3 id="Logging" class="common-anchor-header">Registro</h3><p>Milvus soporta la rotación de registros. En el archivo de configuración del sistema, milvus.yaml, puede establecer el tamaño de un único archivo de registro, el número de archivos de registro y la salida de registro a stdout.</p>
<p><br/></p>
<h3 id="Distributed-solution" class="common-anchor-header">Solución distribuida</h3><p>Con un nodo de escritura y un número ilimitado de nodos de lectura, Mishards libera el potencial computacional del cluster de servidores. Entre sus funciones se incluyen el reenvío de solicitudes, la división de lectura/escritura, el escalado dinámico/horizontal, etc.</p>
<p><br/></p>
<h3 id="Monitoring" class="common-anchor-header">Supervisión</h3><p>Milvus es compatible con Prometheus, un conjunto de herramientas de alertas y supervisión de sistemas de código abierto. Milvus añade soporte para Pushgateway en Prometheus, haciendo posible que Prometheus adquiera métricas por lotes de corta duración. El sistema de supervisión y alertas funciona del siguiente modo:</p>
<ul>
<li>El servidor Milvus envía datos métricos personalizados a Pushgateway.</li>
<li>Pushgateway garantiza que los datos métricos efímeros se envían de forma segura a Prometheus.</li>
<li>Prometheus continúa extrayendo datos de Pushgateway.</li>
<li>Alertmanager se utiliza para establecer el umbral de alerta para diferentes indicadores y enviar alertas por correo electrónico o mensaje.</li>
</ul>
<p><br/></p>
<h3 id="Metadata-management" class="common-anchor-header">Gestión de metadatos</h3><p>Milvus utiliza SQLite para la gestión de metadatos por defecto. SQLite está implementado en Milvus y no requiere configuración. En un entorno de producción, se recomienda utilizar MySQL para la gestión de metadatos.</p>
<p><br/></p>
<h3 id="Engage-with-our-open-source-community" class="common-anchor-header">Participe en nuestra comunidad de código abierto:</h3><ul>
<li>Encuentre o contribuya a Milvus en <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Interactúe con la comunidad a través de <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Conéctese con nosotros en <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
