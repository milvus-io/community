---
id: build-semantic-search-at-speed-milvus-lucidworks.md
title: Cree búsquedas semánticas rápidas
author: Elizabeth Edmiston
date: 2021-04-19T07:32:50.416Z
desc: >-
  Obtenga más información sobre el uso de metodologías de aprendizaje automático
  semántico para potenciar resultados de búsqueda más relevantes en toda su
  organización.
cover: assets.zilliz.com/lucidworks_4753c98727.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/build-semantic-search-at-speed-milvus-lucidworks'
---
<custom-h1>Cree búsquedas semánticas rápidas</custom-h1><p><a href="https://lucidworks.com/post/what-is-semantic-search/">La búsqueda semántica</a> es una gran herramienta para ayudar a sus clientes -o a sus empleados- a encontrar los productos o la información adecuados. Incluso puede sacar a la superficie información difícil de indexar para obtener mejores resultados. Dicho esto, si sus metodologías semánticas no se despliegan para trabajar con rapidez, no le servirán de nada. El cliente o el empleado no van a quedarse sentados mientras el sistema se toma su tiempo para responder a su consulta, y es probable que se estén ingiriendo miles de consultas más al mismo tiempo.</p>
<p>¿Cómo hacer que la búsqueda semántica sea rápida? La búsqueda semántica lenta no es la solución.</p>
<p>Afortunadamente, este es el tipo de problema que a Lucidworks le encanta resolver. Recientemente hemos probado un clúster de tamaño modesto -siga leyendo para obtener más detalles- que dio como resultado 1.500 RPS (solicitudes por segundo) contra una colección de más de un millón de documentos, con un tiempo medio de respuesta de aproximadamente 40 milisegundos. Eso sí que es velocidad.</p>
<p><br/></p>
<h3 id="Implementing-Semantic-Search" class="common-anchor-header">Implementación de la búsqueda semántica</h3><p>Para hacer realidad la magia del aprendizaje automático a la velocidad del rayo, Lucidworks ha implementado la búsqueda semántica utilizando el enfoque de búsqueda vectorial semántica. Hay dos partes fundamentales.</p>
<p><br/></p>
<h4 id="Part-One-The-Machine-Learning-Model" class="common-anchor-header">Primera parte: el modelo de aprendizaje automático</h4><p>En primer lugar, se necesita una forma de codificar el texto en un vector numérico. El texto puede ser la descripción de un producto, una consulta de búsqueda de un usuario, una pregunta o incluso la respuesta a una pregunta. Un modelo de búsqueda semántica se entrena para codificar el texto de tal manera que el texto que es semánticamente similar a otro texto se codifica en vectores que son numéricamente "cercanos" entre sí. Este paso de codificación debe ser rápido para poder dar soporte a las miles o más posibles búsquedas de clientes o consultas de usuarios que llegan cada segundo.</p>
<p><br/></p>
<h4 id="Part-Two-The-Vector-Search-Engine" class="common-anchor-header">Segunda parte: el motor de búsqueda vectorial</h4><p>En segundo lugar, es necesario encontrar rápidamente las mejores coincidencias con la búsqueda del cliente o la consulta del usuario. El modelo habrá codificado ese texto en un vector numérico. A partir de ahí, tiene que compararlo con todos los vectores numéricos de su catálogo o listas de preguntas y respuestas para encontrar las mejores coincidencias, los vectores "más cercanos" al vector de la consulta. Para ello, necesitarás un motor vectorial capaz de manejar toda esa información con eficacia y a la velocidad del rayo. El motor puede contener millones de vectores y en realidad sólo se necesitan las veinte mejores coincidencias con la consulta. Y, por supuesto, tiene que gestionar unas mil consultas de este tipo por segundo.</p>
<p>Para hacer frente a estos retos, hemos añadido el motor de búsqueda vectorial <a href="https://doc.lucidworks.com/fusion/5.3/8821/milvus">Milvus</a> en la <a href="https://lucidworks.com/post/enhance-personalization-efforts-with-new-features-in-fusion/">versión 5.3 de Fusion</a>. Milvus es software de código abierto y es rápido. Milvus utiliza FAISS<a href="https://ai.facebook.com/tools/faiss/">(Facebook AI Similarity Search</a>), la misma tecnología que Facebook utiliza en producción para sus propias iniciativas de aprendizaje automático. Cuando es necesario, puede funcionar incluso más rápido en <a href="https://en.wikipedia.org/wiki/Graphics_processing_unit">la GPU</a>. Cuando se instala Fusion 5.3 (o superior) con el componente de aprendizaje automático, Milvus se instala automáticamente como parte de ese componente para que pueda activar todas estas capacidades con facilidad.</p>
<p>El tamaño de los vectores en una colección dada, especificado cuando se crea la colección, depende del modelo que produce esos vectores. Por ejemplo, una colección determinada podría almacenar los vectores creados a partir de la codificación (mediante un modelo) de todas las descripciones de productos de un catálogo de productos. Sin un motor de búsqueda vectorial como Milvus, las búsquedas de similitudes no serían factibles en todo el espacio vectorial. Por lo tanto, las búsquedas de similitud tendrían que limitarse a candidatos preseleccionados del espacio vectorial (por ejemplo, 500) y tendrían tanto un rendimiento más lento como resultados de menor calidad. Milvus puede almacenar cientos de miles de millones de vectores en múltiples colecciones de vectores para garantizar que la búsqueda sea rápida y los resultados relevantes.</p>
<p><br/></p>
<h3 id="Using-Semantic-Search" class="common-anchor-header">Utilización de la búsqueda semántica</h3><p>Volvamos al flujo de trabajo de la búsqueda semántica, ahora que hemos aprendido un poco por qué Milvus puede ser tan importante. La búsqueda semántica consta de tres etapas. Durante la primera etapa, se carga y/o se entrena el modelo de aprendizaje automático. Después, los datos se indexan en Milvus y Solr. La etapa final es la etapa de consulta, cuando se produce la búsqueda real. A continuación nos centraremos en estas dos últimas etapas.</p>
<p><br/></p>
<h3 id="Indexing-into-Milvus" class="common-anchor-header">Indexación en Milvus</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_1_47a9221723.png" alt="Lucidworks-1.png" class="doc-image" id="lucidworks-1.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-1.png</span> </span></p>
<p>Como se muestra en el diagrama anterior, la etapa de consulta comienza de forma similar a la etapa de indexación, pero con la entrada de consultas en lugar de documentos. Para cada consulta</p>
<ol>
<li>La consulta se envía al proceso de indexación <a href="https://lucidworks.com/products/smart-answers/">de Smart Answers</a>.</li>
<li>A continuación, la consulta se envía al modelo ML.</li>
<li>El modelo ML devuelve un vector numérico (codificado a partir de la consulta). Una vez más, el tipo de modelo determina el tamaño del vector.</li>
<li>El vector se envía a Milvus, que determina qué vectores de la colección Milvus especificada coinciden mejor con el vector proporcionado.</li>
<li>Milvus devuelve una lista de ID únicos y distancias correspondientes a los vectores determinados en el paso cuatro.</li>
<li>Se envía a Solr una consulta con esos ID y distancias.</li>
<li>Solr devuelve entonces una lista ordenada de los documentos asociados a esos ID.</li>
</ol>
<p><br/></p>
<h3 id="Scale-Testing" class="common-anchor-header">Pruebas de escala</h3><p>Con el fin de demostrar que nuestros flujos de búsqueda semántica funcionan con la eficiencia que exigimos a nuestros clientes, realizamos pruebas de escala utilizando scripts Gatling en Google Cloud Platform utilizando un clúster Fusion con ocho réplicas del modelo ML, ocho réplicas del servicio de consulta y una única instancia de Milvus. Las pruebas se realizaron utilizando los índices FLAT y HNSW de Milvus. El índice FLAT tiene una recuperación del 100%, pero es menos eficiente, excepto cuando los conjuntos de datos son pequeños. El índice HNSW (Hierarchical Small World Graph) sigue ofreciendo resultados de alta calidad y ha mejorado su rendimiento en conjuntos de datos más grandes.</p>
<p>Veamos algunas cifras de un ejemplo reciente:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_2_3162113560.png" alt="Lucidworks-2.png" class="doc-image" id="lucidworks-2.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-2.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_3_3dc17f0ed8.png" alt="Lucidworks-3.png" class="doc-image" id="lucidworks-3.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-3.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_4_8a6edd2f59.png" alt="Lucidworks-4.png" class="doc-image" id="lucidworks-4.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-4.png</span> </span></p>
<p><br/></p>
<h3 id="Getting-Started" class="common-anchor-header">Primeros pasos</h3><p>Los canales de <a href="https://lucidworks.com/products/smart-answers/">Smart Answers</a> están diseñados para ser fáciles de usar. Lucidworks dispone de <a href="https://doc.lucidworks.com/how-to/734/set-up-a-pre-trained-cold-start-model-for-smart-answers">modelos preentrenados que son fáciles de implantar</a> y que, por lo general, ofrecen buenos resultados, aunque el entrenamiento de sus propios modelos, junto con los modelos preentrenados, ofrecerá los mejores resultados. Póngase en contacto con nosotros hoy mismo para saber cómo puede implantar estas iniciativas en sus herramientas de búsqueda para obtener resultados más eficaces y atractivos.</p>
<blockquote>
<p>Este blog ha sido publicado en: https://lucidworks.com/post/how-to-build-fast-semantic-search/?utm_campaign=Oktopost-Blog+Posts&amp;utm_medium=organic_social&amp;utm_source=linkedin</p>
</blockquote>
