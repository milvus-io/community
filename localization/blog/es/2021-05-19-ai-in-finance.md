---
id: ai-in-.md
title: >-
  Acelerar la IA en las finanzas con Milvus, una base de datos vectorial de
  código abierto
author: milvus
date: 2021-05-19T03:41:20.776Z
desc: >-
  Milvus puede utilizarse para crear aplicaciones de IA para el sector
  financiero, como chatbots, sistemas de recomendación, etc.
cover: assets.zilliz.com/03_1_1e5aaf7dd1.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/ai-in-finance'
---
<custom-h1>Aceleración de la IA en las finanzas con Milvus, una base de datos vectorial de código abierto</custom-h1><p>Los bancos y otras instituciones financieras llevan mucho tiempo adoptando software de código abierto para el procesamiento y análisis de big data. En 2010, Morgan Stanley <a href="https://www.forbes.com/sites/tomgroenfeldt/2012/05/30/morgan-stanley-takes-on-big-data-with-hadoop/?sh=19f4f8cd16db">comenzó a utilizar</a> el marco Apache Hadoop de código abierto como parte de un pequeño experimento. La empresa tenía dificultades para adaptar las bases de datos tradicionales a los enormes volúmenes de datos que sus científicos querían aprovechar, así que decidió explorar soluciones alternativas. Hadoop es ahora un elemento básico en Morgan Stanley, que ayuda en todo, desde la gestión de datos CRM hasta el análisis de carteras. Otros programas de bases de datos relacionales de código abierto, como MySQL, MongoDB y PostgreSQL, han sido herramientas indispensables para dar sentido a los macrodatos en el sector financiero.</p>
<p>La tecnología es lo que da al sector de los servicios financieros una ventaja competitiva, y la inteligencia artificial (IA) se está convirtiendo rápidamente en el enfoque estándar para extraer información valiosa de los macrodatos y analizar la actividad en tiempo real en los sectores de la banca, la gestión de activos y los seguros. Mediante el uso de algoritmos de IA para convertir datos no estructurados como imágenes, audio o vídeo en vectores, un formato de datos numéricos legibles por máquina, es posible realizar búsquedas de similitud en conjuntos de datos vectoriales masivos de millones, miles de millones o incluso billones. Los datos vectoriales se almacenan en un espacio de alta dimensión, y los vectores similares se encuentran utilizando la búsqueda de similitud, que requiere una infraestructura dedicada llamada base de datos vectorial.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/01_1_cb99f15886.jpg" alt="01 (1).jpg" class="doc-image" id="01-(1).jpg" />
   </span> <span class="img-wrapper"> <span>01 (1).jpg</span> </span></p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a> es una base de datos vectorial de código abierto creada específicamente para gestionar datos vectoriales, lo que significa que los ingenieros y científicos de datos pueden centrarse en crear aplicaciones de IA o realizar análisis, en lugar de en la infraestructura de datos subyacente. La plataforma se creó en torno a los flujos de trabajo de desarrollo de aplicaciones de IA y está optimizada para agilizar las operaciones de aprendizaje automático (MLOps). Para obtener más información sobre Milvus y su tecnología subyacente, consulte nuestro <a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">blog</a>.</p>
<p>Entre las aplicaciones habituales de la IA en el sector de los servicios financieros se incluyen la negociación algorítmica, la composición y optimización de carteras, la validación de modelos, el backtesting, el robo-advising, los asistentes virtuales de clientes, el análisis del impacto en el mercado, el cumplimiento normativo y las pruebas de estrés. Este artículo cubre tres áreas específicas en las que se aprovechan los datos vectoriales como uno de los activos más valiosos para las empresas bancarias y financieras:</p>
<ol>
<li>Mejora de la experiencia del cliente con chatbots bancarios</li>
<li>Aumento de las ventas de servicios financieros y más con sistemas de recomendación</li>
<li>Análisis de informes de resultados y otros datos financieros no estructurados con minería semántica de textos.</li>
</ol>
<p><br/></p>
<h3 id="Enhancing-customer-experience-with-banking-chatbots" class="common-anchor-header">Mejorar la experiencia del cliente con chatbots bancarios</h3><p>Los chatbots bancarios pueden mejorar la experiencia del cliente ayudándole a seleccionar inversiones, productos bancarios y pólizas de seguros. Los servicios digitales están ganando popularidad rápidamente, en parte debido a las tendencias aceleradas por la pandemia de coronavirus. Los chatbots funcionan utilizando el procesamiento del lenguaje natural (PLN) para convertir las preguntas enviadas por el usuario en vectores semánticos para buscar respuestas coincidentes. Los chatbots bancarios modernos ofrecen una experiencia natural personalizada a los usuarios y hablan en un tono conversacional. Milvus proporciona un tejido de datos muy adecuado para crear chatbots utilizando la búsqueda de similitud vectorial en tiempo real.</p>
<p>Obtenga más información en nuestra demostración sobre la creación de <a href="https://zilliz.com/blog/building-intelligent-chatbot-with-nlp-and-milvus">chatbots con Milvus</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/02_1_8c298c45e5.jpg" alt="02 (1).jpg" class="doc-image" id="02-(1).jpg" />
   </span> <span class="img-wrapper"> <span>02 (1).jpg</span> </span></p>
<p><br/></p>
<h4 id="Boosting-financial-services-sales-and-more-with-recommender-systems" class="common-anchor-header">Aumentar las ventas de servicios financieros y más con sistemas de recomendación:</h4><p>El sector de la banca privada utiliza sistemas de recomendación para aumentar las ventas de productos financieros mediante recomendaciones personalizadas basadas en los perfiles de los clientes. Los sistemas de recomendación también pueden aprovecharse en la investigación financiera, las noticias empresariales, la selección de valores y los sistemas de apoyo a la negociación. Gracias a los modelos de aprendizaje profundo, cada usuario y artículo se describe como un vector de incrustación. Una base de datos vectorial ofrece un espacio de incrustación en el que se pueden calcular las similitudes entre usuarios y elementos.</p>
<p>Obtenga más información en nuestra <a href="https://zilliz.com/blog/graph-based-recommendation-system-with-milvus">demostración</a> sobre sistemas de recomendación basados en gráficos con Milvus.</p>
<p><br/></p>
<h4 id="Analyzing-earnings-reports-and-other-unstructured-financial-data-with-semantic-text-mining" class="common-anchor-header">Análisis de informes de resultados y otros datos financieros no estructurados con minería semántica de textos:</h4><p>Las técnicas de minería de textos han tenido un impacto sustancial en la industria financiera. A medida que los datos financieros crecen exponencialmente, la minería de textos se ha convertido en un importante campo de investigación en el ámbito de las finanzas.</p>
<p>Actualmente se aplican modelos de aprendizaje profundo para representar informes financieros mediante vectores de palabras capaces de capturar numerosos aspectos semánticos. Una base de datos vectorial como Milvus es capaz de almacenar vectores de palabras semánticas masivos de millones de informes y, a continuación, realizar búsquedas de similitud en ellos en milisegundos.</p>
<p>Más información sobre cómo <a href="https://medium.com/deepset-ai/semantic-search-with-milvus-knowledge-graph-qa-web-crawlers-and-more-837451eae9fa">utilizar Haystack de Deepset con Milvus</a>.</p>
<p><br/></p>
<h3 id="Don’t-be-a-stranger" class="common-anchor-header">No sea un extraño</h3><ul>
<li>Encuentre o contribuya a Milvus en <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Interactúe con la comunidad a través de <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Conéctese con nosotros en <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
