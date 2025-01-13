---
id: Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing.md
title: Aceleración de la búsqueda por similitud en Big Data con indexación vectorial
author: milvus
date: 2019-12-05T08:33:04.230Z
desc: >-
  Sin la indexación vectorial, muchas aplicaciones modernas de IA serían
  imposiblemente lentas. Aprende a seleccionar el índice adecuado para tu
  próxima aplicación de aprendizaje automático.
cover: assets.zilliz.com/4_1143e443aa.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing
---
<custom-h1>Aceleración de la búsqueda de similitudes en Big Data con indexación vectorial</custom-h1><p>Desde la visión por ordenador hasta el descubrimiento de nuevos fármacos, los motores de búsqueda de similitud vectorial impulsan muchas aplicaciones populares de inteligencia artificial (IA). La indexación, un proceso de organización de datos que acelera drásticamente la búsqueda de big data, es un componente fundamental que permite realizar consultas eficientes en los conjuntos de datos de millones, miles de millones o incluso billones de vectores en los que se basan los motores de búsqueda de similitudes. En este artículo se explica el papel que desempeña la indexación en la eficiencia de la búsqueda de similitudes vectoriales, los diferentes tipos de índices de archivos invertidos vectoriales (IVF) y consejos sobre qué índice utilizar en diferentes situaciones.</p>
<p><strong>Ir a:</strong></p>
<ul>
<li><a href="#accelerating-similarity-search-on-really-big-data-with-vector-indexing">Aceleración de la búsqueda de similitudes en datos realmente grandes con indexación vectorial</a><ul>
<li><a href="#how-does-vector-indexing-accelerate-similarity-search-and-machine-learning">¿Cómo acelera la indexación vectorial la búsqueda de similitudes y el aprendizaje automático?</a></li>
<li><a href="#what-are-different-types-of-ivf-indexes-and-which-scenarios-are-they-best-suited-for">¿Cuáles son los distintos tipos de índices FIV y para qué situaciones son los más adecuados?</a></li>
<li><a href="#flat-good-for-searching-relatively-small-million-scale-datasets-when-100-recall-is-required">FLAT: Adecuado para la búsqueda de conjuntos de datos relativamente pequeños (a escala de millones) cuando se requiere una recuperación del 100%.</a><ul>
<li><a href="#flat-performance-test-results">Resultados de las pruebas de rendimiento de FLAT:</a><ul>
<li><a href="#query-time-test-results-for-the-flat-index-in-milvus"><em>Resultados de la prueba de tiempo de consulta del índice FLAT en Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways">Principales conclusiones:</a></li>
</ul></li>
<li><a href="#ivf_flat-improves-speed-at-the-expense-of-accuracy-and-vice-versa">IVF_FLAT: Mejora la velocidad a expensas de la precisión (y viceversa).</a><ul>
<li><a href="#ivf_flat-performance-test-results">Resultados de la prueba de rendimiento IVF_FLAT:</a><ul>
<li><a href="#query-time-test-results-for-ivf_flat-index-in-milvus"><em>Resultados de la prueba de tiempo de consulta para el índice IVF_FLAT en Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-1">Puntos clave:</a><ul>
<li><a href="#recall-rate-test-results-for-the-ivf_flat-index-in-milvus"><em>Resultados de la prueba de tasa de recuperación para el índice IVF_FLAT en Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-2">Puntos clave:</a></li>
</ul></li>
<li><a href="#ivf_sq8-faster-and-less-resource-hungry-than-ivf_flat-but-also-less-accurate">IVF_SQ8: Más rápido y con menos consumo de recursos que IVF_FLAT, pero también menos preciso.</a><ul>
<li><a href="#ivf_sq8-performance-test-results">Resultados de la prueba de rendimiento de IVF_SQ8:</a><ul>
<li><a href="#query-time-test-results-for-ivf_sq8-index-in-milvus"><em>Resultados de la prueba de tiempo de consulta para el índice IVF_SQ8 en Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-3">Principales conclusiones:</a><ul>
<li><a href="#recall-rate-test-results-for-ivf_sq8-index-in-milvus"><em>Resultados de la prueba de tasa de recuperación del índice IVF_SQ8 en Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-4">Puntos clave:</a></li>
</ul></li>
<li><a href="#ivf_sq8h-new-hybrid-gpucpu-approach-that-is-even-faster-than-ivf_sq8">IVF_SQ8H: Nuevo enfoque híbrido GPU/CPU que es incluso más rápido que IVF_SQ8.</a><ul>
<li><a href="#ivf_sq8h-performance-test-results">Resultados de las pruebas de rendimiento de IVF_SQ8H:</a><ul>
<li><a href="#query-time-test-results-for-ivf_sq8h-index-in-milvus"><em>Resultados de la prueba de tiempo de consulta para el índice IVF_SQ8H en Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-5">Puntos clave:</a></li>
</ul></li>
<li><a href="#learn-more-about-milvus-a-massive-scale-vector-data-management-platform">Más información sobre Milvus, una plataforma de gestión de datos vectoriales a gran escala.</a></li>
<li><a href="#methodology">Metodología</a><ul>
<li><a href="#performance-testing-environment">Entorno de pruebas de rendimiento</a></li>
<li><a href="#relevant-technical-concepts">Conceptos técnicos relevantes</a></li>
<li><a href="#resources">Recursos</a></li>
</ul></li>
</ul></li>
</ul>
<h3 id="How-does-vector-indexing-accelerate-similarity-search-and-machine-learning" class="common-anchor-header">¿Cómo acelera la indexación vectorial la búsqueda de similitudes y el aprendizaje automático?</h3><p>Los motores de búsqueda de similitudes comparan una entrada con una base de datos para encontrar los objetos más parecidos a la entrada. La indexación es el proceso de organización eficiente de los datos y desempeña un papel fundamental en la utilidad de la búsqueda de similitudes, ya que acelera drásticamente las consultas sobre grandes conjuntos de datos que requieren mucho tiempo. Una vez indexado un gran conjunto de datos vectoriales, las consultas pueden dirigirse a los clusters, o subconjuntos de datos, que tienen más probabilidades de contener vectores similares a una consulta de entrada. En la práctica, esto significa que se sacrifica un cierto grado de precisión para acelerar las consultas sobre datos vectoriales realmente grandes.</p>
<p>Se puede establecer una analogía con un diccionario, en el que las palabras se ordenan alfabéticamente. Al buscar una palabra, es posible navegar rápidamente a una sección que sólo contenga palabras con la misma inicial, lo que acelera drásticamente la búsqueda de la definición de la palabra introducida.</p>
<h3 id="What-are-different-types-of-IVF-indexes-and-which-scenarios-are-they-best-suited-for" class="common-anchor-header">¿Cuáles son los distintos tipos de índices FIV y para qué situaciones son los más adecuados?</h3><p>Existen numerosos índices diseñados para la búsqueda de similitud vectorial de alta dimensión, y cada uno de ellos presenta ventajas y desventajas en cuanto a rendimiento, precisión y requisitos de almacenamiento. Este artículo cubre varios tipos de índices FIV comunes, sus puntos fuertes y débiles, así como los resultados de las pruebas de rendimiento para cada tipo de índice. Las pruebas de rendimiento cuantifican el tiempo de consulta y las tasas de recuperación para cada tipo de índice en <a href="https://milvus.io/">Milvus</a>, una plataforma de gestión de datos vectoriales de código abierto. Para más información sobre el entorno de pruebas, véase la sección de metodología al final de este artículo.</p>
<h3 id="FLAT-Good-for-searching-relatively-small-million-scale-datasets-when-100-recall-is-required" class="common-anchor-header">FLAT: Bueno para la búsqueda de conjuntos de datos relativamente pequeños (a escala de un millón) cuando se requiere una recuperación del 100%.</h3><p>Para aplicaciones de búsqueda de similitud vectorial que requieren una precisión perfecta y dependen de conjuntos de datos relativamente pequeños (a escala de millones), el índice FLAT es una buena elección. FLAT no comprime los vectores y es el único índice que puede garantizar resultados de búsqueda exactos. Los resultados de FLAT también pueden utilizarse como punto de comparación para los resultados producidos por otros índices que tienen menos del 100% de recuperación.</p>
<p>FLAT es preciso porque adopta un enfoque exhaustivo de la búsqueda, lo que significa que, para cada consulta, la entrada objetivo se compara con todos los vectores de un conjunto de datos. Esto hace que FLAT sea el índice más lento de nuestra lista y poco adecuado para consultar datos vectoriales masivos. No hay parámetros para el índice FLAT en Milvus y su uso no requiere entrenamiento de datos ni almacenamiento adicional.</p>
<h4 id="FLAT-performance-test-results" class="common-anchor-header">Resultados de las pruebas de rendimiento de FLAT:</h4><p>La prueba de rendimiento del tiempo de consulta FLAT se realizó en Milvus utilizando un conjunto de datos compuesto por 2 millones de vectores de 128 dimensiones.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_2_f34fb95d65.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_2.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_2.png" />
   </span> <span class="img-wrapper"> <span>Blog_Aceleración de la búsqueda por similitud en datos realmente grandes con indexación vectorial_2.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Principales conclusiones:</h4><ul>
<li>A medida que aumenta nq (el número de vectores objetivo de una consulta), aumenta el tiempo de consulta.</li>
<li>Utilizando el índice FLAT en Milvus, podemos ver que el tiempo de consulta aumenta bruscamente una vez que nq supera los 200.</li>
<li>En general, el índice FLAT es más rápido y coherente cuando Milvus se ejecuta en la GPU que en la CPU. Sin embargo, las consultas FLAT en CPU son más rápidas cuando nq es inferior a 20.</li>
</ul>
<h3 id="IVFFLAT-Improves-speed-at-the-expense-of-accuracy-and-vice-versa" class="common-anchor-header">IVF_FLAT: Mejora la velocidad a expensas de la precisión (y viceversa).</h3><p>Una forma habitual de acelerar el proceso de búsqueda de similitudes a expensas de la precisión es realizar una búsqueda aproximada por vecino más cercano (RNA). Los algoritmos RNA reducen los requisitos de almacenamiento y la carga computacional agrupando vectores similares, lo que da como resultado una búsqueda de vectores más rápida. IVF_FLAT es el tipo de índice de archivo invertido más básico y se basa en una forma de búsqueda RNA.</p>
<p>IVF_FLAT divide los datos vectoriales en un número de unidades de clúster (nlist) y, a continuación, compara las distancias entre el vector de entrada objetivo y el centro de cada clúster. Dependiendo del número de conglomerados que el sistema consulte (nprobe), los resultados de la búsqueda de similitud se basan en comparaciones entre el vector de entrada y los vectores del conglomerado o conglomerados más similares, lo que reduce drásticamente el tiempo de consulta.</p>
<p>Ajustando nprobe, se puede encontrar un equilibrio ideal entre precisión y velocidad para un escenario determinado. Los resultados de nuestra prueba de rendimiento de IVF_FLAT demuestran que el tiempo de consulta aumenta drásticamente a medida que aumentan tanto el número de vectores de entrada objetivo (nq) como el número de conglomerados en los que buscar (nprobe). IVF_FLAT no comprime los datos vectoriales; sin embargo, los archivos de índice incluyen metadatos que aumentan marginalmente los requisitos de almacenamiento en comparación con el conjunto de datos vectoriales sin indexar.</p>
<h4 id="IVFFLAT-performance-test-results" class="common-anchor-header">Resultados de las pruebas de rendimiento de IVF_FLAT:</h4><p>Las pruebas de rendimiento del tiempo de consulta de IVF_FLAT se realizaron en Milvus utilizando el conjunto de datos público 1B SIFT, que contiene mil millones de vectores de 128 dimensiones.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_3_92055190d7.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_3.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_3.png" />
   </span> <span class="img-wrapper"> <span>Blog_Aceleración de la búsqueda por similitud en Big Data con indexación vectorial_3.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Principales conclusiones:</h4><ul>
<li>Cuando se ejecuta en la CPU, el tiempo de consulta para el índice IVF_FLAT en Milvus aumenta con nprobe y nq. Esto significa que cuantos más vectores de entrada contenga una consulta, o cuantos más clusters busque una consulta, mayor será el tiempo de consulta.</li>
<li>En la GPU, el índice muestra menos variación de tiempo frente a los cambios en nq y nprobe. Esto se debe a que los datos del índice son grandes y la copia de datos de la memoria de la CPU a la memoria de la GPU representa la mayor parte del tiempo total de consulta.</li>
<li>En todos los escenarios, excepto cuando nq = 1.000 y nprobe = 32, el índice IVF_FLAT es más eficiente cuando se ejecuta en la CPU.</li>
</ul>
<p>Las pruebas de rendimiento de recuperación de IVF_FLAT se realizaron en Milvus utilizando tanto el conjunto de datos público 1M SIFT, que contiene 1 millón de vectores de 128 dimensiones, como el conjunto de datos glove-200-angular, que contiene más de 1 millón de vectores de 200 dimensiones, para la creación de índices (nlist = 16.384).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_4_8c8a6b628e.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_4.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_4.png" />
   </span> <span class="img-wrapper"> <span>Blog_Aceleración de la búsqueda por similitud en Big Data con indexación vectorial_4.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Principales conclusiones:</h4><ul>
<li>El índice IVF_FLAT puede optimizarse en cuanto a precisión, alcanzando una tasa de recuperación superior a 0,99 en el conjunto de datos SIFT 1M cuando nprobe = 256.</li>
</ul>
<h3 id="IVFSQ8-Faster-and-less-resource-hungry-than-IVFFLAT-but-also-less-accurate" class="common-anchor-header">IVF_SQ8: Es más rápido y consume menos recursos que IVF_FLAT, pero también es menos preciso.</h3><p>IVF_FLAT no realiza ninguna compresión, por lo que los archivos de índice que produce tienen aproximadamente el mismo tamaño que los datos vectoriales originales sin indexar. Por ejemplo, si el conjunto de datos SIFT 1B original tiene 476 GB, sus archivos de índice IVF_FLAT serán ligeramente mayores (~470 GB). Cargar todos los archivos de índice en memoria consumirá 470 GB de almacenamiento.</p>
<p>Cuando los recursos de disco, CPU o memoria GPU son limitados, IVF_SQ8 es una mejor opción que IVF_FLAT. Este tipo de índice puede convertir cada FLOAT (4 bytes) a UINT8 (1 byte) realizando una cuantización escalar. Esto reduce el consumo de memoria de disco, CPU y GPU en un 70-75%. Para el conjunto de datos SIFT 1B, los archivos de índice IVF_SQ8 requieren sólo 140 GB de almacenamiento.</p>
<h4 id="IVFSQ8-performance-test-results" class="common-anchor-header">Resultados de las pruebas de rendimiento de IVF_SQ8:</h4><p>Las pruebas de tiempo de consulta de IVF_SQ8 se realizaron en Milvus utilizando el conjunto de datos público 1B SIFT, que contiene mil millones de vectores de 128 dimensiones, para la creación de índices.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_5_467fafbec4.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_5.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_5.png" />
   </span> <span class="img-wrapper"> <span>Blog_Aceleración de la búsqueda por similitud en Big Data con indexación vectorial_5.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Principales conclusiones:</h4><ul>
<li>Al reducir el tamaño del archivo de índice, IVF_SQ8 ofrece notables mejoras de rendimiento con respecto a IVF_FLAT. IVF_SQ8 sigue una curva de rendimiento similar a IVF_FLAT, en la que el tiempo de consulta aumenta con nq y nprobe.</li>
<li>Al igual que IVF_FLAT, el rendimiento de IVF_SQ8 es mayor cuando se ejecuta en la CPU y cuando nq y nprobe son menores.</li>
</ul>
<p>Las pruebas de rendimiento de IVF_SQ8 se realizaron en Milvus utilizando el conjunto de datos público 1M SIFT, que contiene 1 millón de vectores de 128 dimensiones, y el conjunto de datos glove-200-angular, que contiene más de 1 millón de vectores de 200 dimensiones, para la creación de índices (nlist = 16.384).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_6_b1e0e5b6a5.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_6.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_6.png" />
   </span> <span class="img-wrapper"> <span>Blog_Aceleración de la búsqueda por similitud en Big Data con indexación vectorial_6.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Principales conclusiones:</h4><ul>
<li>A pesar de comprimir los datos originales, IVF_SQ8 no experimenta una disminución significativa en la precisión de la consulta. Con varios ajustes de nprobe, IVF_SQ8 tiene como mucho un 1% menos de tasa de recuperación que IVF_FLAT.</li>
</ul>
<h3 id="IVFSQ8H-New-hybrid-GPUCPU-approach-that-is-even-faster-than-IVFSQ8" class="common-anchor-header">IVF_SQ8H: Nuevo enfoque híbrido GPU/CPU que es incluso más rápido que IVF_SQ8.</h3><p>IVF_SQ8H es un nuevo tipo de índice que mejora el rendimiento de las consultas en comparación con IVF_SQ8. Cuando se consulta un índice IVF_SQ8 ejecutado en la CPU, la mayor parte del tiempo total de consulta se emplea en encontrar los clusters nprobe más cercanos al vector de entrada objetivo. Para reducir el tiempo de consulta, IVF_SQ8 copia los datos de las operaciones de cuantificación gruesa, que son más pequeños que los archivos de índice, en la memoria de la GPU, lo que acelera enormemente las operaciones de cuantificación gruesa. A continuación, gpu_search_threshold determina qué dispositivo ejecuta la consulta. Cuando nq &gt;= gpu_search_threshold, la GPU ejecuta la consulta; en caso contrario, lo hace la CPU.</p>
<p>IVF_SQ8H es un tipo de índice híbrido que requiere que la CPU y la GPU trabajen conjuntamente. Sólo puede utilizarse con Milvus habilitado para GPU.</p>
<h4 id="IVFSQ8H-performance-test-results" class="common-anchor-header">Resultados de las pruebas de rendimiento de IVF_SQ8H:</h4><p>Las pruebas de rendimiento del tiempo de consulta de IVF_SQ8H se realizaron en Milvus utilizando el conjunto de datos público 1B SIFT, que contiene mil millones de vectores de 128 dimensiones, para la construcción del índice.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_7_b70bfe8bce.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_7.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_7.png" />
   </span> <span class="img-wrapper"> <span>Blog_Aceleración de la búsqueda por similitud en Big Data con indexación vectorial_7.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Puntos clave:</h4><ul>
<li>Cuando nq es inferior o igual a 1.000, IVF_SQ8H obtiene tiempos de consulta casi el doble de rápidos que IVFSQ8.</li>
<li>Cuando nq = 2000, los tiempos de consulta de IVFSQ8H e IVF_SQ8 son iguales. Sin embargo, si el parámetro gpu_search_threshold es inferior a 2000, IVF_SQ8H superará a IVF_SQ8.</li>
<li>La tasa de recuperación de consultas de IVF_SQ8H es idéntica a la de IVF_SQ8, lo que significa que se consigue menos tiempo de consulta sin pérdida de precisión en la búsqueda.</li>
</ul>
<h3 id="Learn-more-about-Milvus-a-massive-scale-vector-data-management-platform" class="common-anchor-header">Más información sobre Milvus, una plataforma de gestión de datos vectoriales a gran escala.</h3><p>Milvus es una plataforma de gestión de datos vectoriales que puede potenciar aplicaciones de búsqueda de similitudes en campos que abarcan la inteligencia artificial, el aprendizaje profundo, los cálculos vectoriales tradicionales, etc. Para obtener información adicional sobre Milvus, consulte los siguientes recursos:</p>
<ul>
<li>Milvus está disponible bajo una licencia de código abierto en <a href="https://github.com/milvus-io/milvus">GitHub</a>.</li>
<li>Milvus admite otros tipos de índices, incluidos los índices basados en gráficos y árboles. Para obtener una lista completa de los tipos de índice admitidos, consulte la <a href="https://milvus.io/docs/v0.11.0/index.md">documentación de los índices vectoriales</a> en Milvus.</li>
<li>Para obtener más información sobre la empresa que lanzó Milvus, visite <a href="https://zilliz.com/">Zilliz.com</a>.</li>
<li>Chatee con la comunidad de Milvus u obtenga ayuda con un problema en <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
</ul>
<h3 id="Methodology" class="common-anchor-header">Metodología</h3><h4 id="Performance-testing-environment" class="common-anchor-header">Entorno de pruebas de rendimiento</h4><p>La configuración del servidor utilizada en las pruebas de rendimiento a las que se hace referencia en este artículo es la siguiente:</p>
<ul>
<li>Intel ® Xeon ® Platinum 8163 @ 2.50GHz, 24 núcleos</li>
<li>GeForce GTX 2080Ti x 4</li>
<li>768 GB de memoria</li>
</ul>
<h4 id="Relevant-technical-concepts" class="common-anchor-header">Conceptos técnicos relevantes</h4><p>Aunque no son necesarios para comprender este artículo, a continuación se indican algunos conceptos técnicos que resultan útiles para interpretar los resultados de nuestras pruebas de rendimiento de índices:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_8_a6c1de937f.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_8.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_8.png" />
   </span> <span class="img-wrapper"> <span>Blog_Aceleración de la búsqueda por similitud en Big Data con indexación vectorial_8.png</span> </span></p>
<h4 id="Resources" class="common-anchor-header">Recursos</h4><p>Para este artículo se han utilizado las siguientes fuentes:</p>
<ul>
<li>"<a href="https://books.google.com/books/about/Encyclopedia_of_Database_Systems.html?id=YdT3wQEACAAJ">Enciclopedia de sistemas de bases de datos</a>", Ling Liu y M. Tamer Özsu.</li>
</ul>
