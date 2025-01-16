---
id: scalable-and-blazing-fast-similarity-search-with-milvus-vector-database.md
title: >-
  Búsqueda de similitudes escalable y rapidísima con la base de datos vectorial
  Milvus
author: Dipanjan Sarkar
date: 2022-06-21T00:00:00.000Z
desc: >-
  Almacene, indexe, gestione y busque billones de vectores de documentos en
  milisegundos.
cover: assets.zilliz.com/69eba74e_4a9a_4c38_a2d9_2cde283e8a1d_e265515238.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://milvus.io/blog/scalable_and_blazing_fast_similarity_search_with_milvus_vector_database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/69eba74e_4a9a_4c38_a2d9_2cde283e8a1d_e265515238.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>imagen de portada</span> </span></p>
<h2 id="Introduction" class="common-anchor-header">Introducción<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>En este artículo trataremos algunos aspectos interesantes relacionados con las bases de datos vectoriales y la búsqueda de similitudes a escala. En el mundo actual, en rápida evolución, vemos nuevas tecnologías, nuevos negocios, nuevas fuentes de datos y, en consecuencia, tendremos que seguir utilizando nuevas formas de almacenar, gestionar y aprovechar estos datos para obtener información. Los datos estructurados y tabulares se han almacenado en bases de datos relacionales durante décadas, y el Business Intelligence se nutre del análisis y la extracción de información a partir de dichos datos. Sin embargo, teniendo en cuenta el panorama actual de los datos, "más del 80-90% de los datos es información no estructurada, como texto, vídeo, audio, registros de servidores web, redes sociales, etc.". Las organizaciones han estado aprovechando el poder del aprendizaje automático y el aprendizaje profundo para tratar de extraer información de estos datos, ya que los métodos tradicionales basados en consultas pueden no ser suficientes o ni siquiera posibles. Existe un enorme potencial sin explotar para extraer información valiosa de estos datos, ¡y solo estamos empezando!</p>
<blockquote>
<p>"Dado que la mayoría de los datos del mundo no están estructurados, la capacidad de analizarlos y actuar en consecuencia representa una gran oportunidad". - Mikey Shulman, Director de ML, Kensho</p>
</blockquote>
<p>Los datos no estructurados, como su nombre indica, no tienen una estructura implícita, como una tabla de filas y columnas (de ahí que se denominen datos tabulares o estructurados). A diferencia de los datos estructurados, no existe una forma sencilla de almacenar el contenido de los datos no estructurados en una base de datos relacional. El aprovechamiento de los datos no estructurados para obtener información plantea tres problemas principales:</p>
<ul>
<li><strong>Almacenamiento:</strong> Las bases de datos relacionales normales sirven para almacenar datos estructurados. Aunque se pueden utilizar bases de datos NoSQL para almacenar dichos datos, el procesamiento de los mismos para extraer las representaciones adecuadas para potenciar las aplicaciones de IA a escala supone una sobrecarga adicional.</li>
<li><strong>Representación:</strong> Los ordenadores no entienden el texto o las imágenes como nosotros. Sólo entienden de números y necesitamos convertir los datos no estructurados en alguna representación numérica útil, normalmente vectores o incrustaciones.</li>
<li><strong>Consulta:</strong> Los datos no estructurados no se pueden consultar directamente a partir de sentencias condicionales definidas, como ocurre con los datos estructurados en SQL. Imagínese, por ejemplo, que intenta buscar zapatos similares a partir de una foto de su par favorito. No puede utilizar valores de píxeles sin procesar para la búsqueda, ni tampoco puede representar características estructuradas como la forma, el tamaño, el estilo, el color, etc. de los zapatos. Imagínese tener que hacer esto con millones de zapatos.</li>
</ul>
<p>Por eso, para que los ordenadores entiendan, procesen y representen datos no estructurados, solemos convertirlos en vectores densos, a menudo llamados embeddings.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Representing_Images_as_Dense_Embedding_Vectors_0b6a5f516c.png" alt="figure 1" class="doc-image" id="figure-1" />
   </span> <span class="img-wrapper"> <span>Figura 1</span> </span></p>
<p>Existe una variedad de metodologías que aprovechan especialmente el aprendizaje profundo, incluidas las redes neuronales convolucionales (CNN) para datos visuales como imágenes y Transformers para datos de texto que pueden utilizarse para transformar dichos datos no estructurados en incrustaciones. <a href="https://zilliz.com/">Zilliz</a> tiene <a href="https://zilliz.com/learn/embedding-generation">un excelente artículo que cubre diferentes técnicas de incrustación</a>.</p>
<p>Ahora bien, no basta con almacenar estos vectores de incrustación. También es necesario poder consultar y encontrar vectores similares. ¿Por qué? La mayoría de las aplicaciones del mundo real se basan en la búsqueda de vectores similares para soluciones basadas en IA. Esto incluye la búsqueda visual (de imágenes) en Google, los sistemas de recomendaciones en Netflix o Amazon, los motores de búsqueda de texto en Google, la búsqueda multimodal, la desduplicación de datos y muchas más.</p>
<p>Almacenar, gestionar y consultar vectores a escala no es una tarea sencilla. Para ello se necesitan herramientas especializadas, y las bases de datos vectoriales son las más eficaces. En este artículo trataremos los siguientes aspectos:</p>
<ul>
<li><a href="#Vectors-and-Vector-Similarity-Search">Vectores y búsqueda de similitud de vectores</a></li>
<li><a href="#What-is-a-Vector-Database">¿Qué es una base de datos vectorial?</a></li>
<li><a href="#Milvus—The-World-s-Most-Advanced-Vector-Database">Milvus - La base de datos vectorial más avanzada del mundo</a></li>
<li><a href="#Performing-visual-image-search-with-Milvus—A-use-case-blueprint">Realización de búsquedas visuales de imágenes con Milvus - Un modelo de caso de uso</a></li>
</ul>
<p>Empecemos</p>
<h2 id="Vectors-and-Vector-Similarity-Search" class="common-anchor-header">Vectores y búsqueda de similitud de vectores<button data-href="#Vectors-and-Vector-Similarity-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Anteriormente, establecimos la necesidad de representar datos no estructurados como imágenes y texto como vectores, ya que los ordenadores sólo pueden entender números. Normalmente utilizamos modelos de IA, más concretamente modelos de aprendizaje profundo, para convertir datos no estructurados en vectores numéricos que puedan ser leídos por las máquinas. Normalmente, estos vectores son básicamente una lista de números de coma flotante que representan colectivamente el elemento subyacente (imagen, texto, etc.).</p>
<h3 id="Understanding-Vectors" class="common-anchor-header">Comprender los vectores</h3><p>En el campo del procesamiento del lenguaje natural (PLN) disponemos de muchos modelos de incrustación de palabras, como <a href="https://towardsdatascience.com/understanding-feature-engineering-part-4-deep-learning-methods-for-text-data-96c44370bbfa">Word2Vec, GloVe y FastText</a>, que pueden ayudar a representar palabras como vectores numéricos. Con el paso del tiempo, hemos asistido a la aparición de modelos <a href="https://arxiv.org/abs/1706.03762">de transformación</a> como <a href="https://jalammar.github.io/illustrated-bert/">BERT</a>, que pueden aprovecharse para aprender vectores de incrustación contextuales y mejores representaciones de frases y párrafos enteros.</p>
<p>Del mismo modo, en el campo de la visión por ordenador tenemos modelos como <a href="https://proceedings.neurips.cc/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf">las redes neuronales convolucionales (CNN)</a>, que pueden ayudar a aprender representaciones a partir de datos visuales como imágenes y vídeos. Con el auge de los transformadores, también tenemos <a href="https://arxiv.org/abs/2010.11929">transformadores de visión</a> que pueden funcionar mejor que las CNN normales.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sample_workflow_for_extracting_insights_from_unstructured_data_c74f08f75a.png" alt="figure 2" class="doc-image" id="figure-2" />
   </span> <span class="img-wrapper"> <span>Figura 2</span> </span></p>
<p>La ventaja de estos vectores es que podemos aprovecharlos para resolver problemas del mundo real, como la búsqueda visual, en la que se sube una foto y se obtienen resultados de búsqueda que incluyen imágenes visualmente similares. Google tiene esta característica muy popular en su motor de búsqueda, como se muestra en el siguiente ejemplo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/An_example_of_Google_s_Visual_Image_Search_fa49b81e88.png" alt="figure 3" class="doc-image" id="figure-3" />
   </span> <span class="img-wrapper"> <span>Figura 3</span> </span></p>
<p>Este tipo de aplicaciones funcionan con vectores de datos y búsqueda de similitud vectorial. Si consideramos dos puntos en un espacio de coordenadas cartesianas X-Y. La distancia entre dos puntos se puede calcular como una simple distancia euclidiana representada por la siguiente ecuación.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_D_Euclidean_Distance_6a52b7bc2f.png" alt="figure 4" class="doc-image" id="figure-4" />
   </span> <span class="img-wrapper"> <span>figura 4</span> </span></p>
<p>Imaginemos ahora que cada punto de datos es un vector con dimensiones D. Podríamos seguir utilizando la distancia euclídea o incluso otras métricas de distancia, como la distancia de Hamming o la distancia coseno, para averiguar la proximidad entre dos puntos de datos. Esto puede ayudar a construir una noción de cercanía o similitud que podría utilizarse como una métrica cuantificable para encontrar elementos similares dado un elemento de referencia utilizando sus vectores.</p>
<h3 id="Understanding-Vector-Similarity-Search" class="common-anchor-header">Comprensión de la búsqueda de similitud vectorial</h3><p>La búsqueda por similitud vectorial, a menudo conocida como búsqueda del vecino más cercano (NN), consiste básicamente en calcular la similitud (o distancia) entre pares de un elemento de referencia (para el que queremos encontrar elementos similares) y una colección de elementos existentes (normalmente en una base de datos) y devolver los 'k' vecinos más cercanos que son los 'k' elementos más similares. El componente clave para calcular esta similitud es la métrica de similitud, que puede ser la distancia euclídea, el producto interior, la distancia coseno, la distancia hamming, etc. Cuanto menor es la distancia, más similares son los vectores.</p>
<p>El reto de la búsqueda exacta del vecino más próximo (NN) es la escalabilidad. Es necesario calcular N distancias (suponiendo que existan N elementos) cada vez para obtener elementos similares. Esto puede ser muy lento, especialmente si no almacena e indexa los datos en algún lugar (¡como una base de datos de vectores!). Para acelerar el cálculo, solemos aprovechar la búsqueda aproximada del vecino más cercano, que a menudo se denomina búsqueda RNA y que acaba almacenando los vectores en un índice. El índice ayuda a almacenar estos vectores de forma inteligente para permitir la recuperación rápida de vecinos "aproximadamente" similares para un elemento de consulta de referencia. Las metodologías típicas de indexación de RNA incluyen</p>
<ul>
<li><strong>Transformaciones de vectores:</strong> Incluye la adición de transformaciones adicionales a los vectores, como la reducción de dimensiones (por ejemplo, PCA \ t-SNE), la rotación, etc.</li>
<li><strong>Codificación de vectores:</strong> Incluye la aplicación de técnicas basadas en estructuras de datos como Locality Sensitive Hashing (LSH), cuantificación, árboles, etc., que pueden ayudar a recuperar más rápidamente elementos similares.</li>
<li><strong>Métodos de búsqueda no exhaustiva:</strong> Se utilizan principalmente para evitar la búsqueda exhaustiva e incluyen métodos como los grafos de vecindad, los índices invertidos, etc.</li>
</ul>
<p>Para crear cualquier aplicación de búsqueda vectorial de similitudes, se necesita una base de datos que pueda ayudar a almacenar, indexar y consultar (buscar) de forma eficiente a gran escala. Las bases de datos vectoriales.</p>
<h2 id="What-is-a-Vector-Database" class="common-anchor-header">¿Qué es una base de datos vectorial?<button data-href="#What-is-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>Ahora que ya sabemos cómo se pueden utilizar los vectores para representar datos no estructurados y cómo funciona la búsqueda vectorial, podemos combinar ambos conceptos para crear una base de datos vectorial.</p>
<p>Las bases de datos vectoriales son plataformas de datos escalables para almacenar, indexar y consultar vectores incrustados que se generan a partir de datos no estructurados (imágenes, texto, etc.) utilizando modelos de aprendizaje profundo.</p>
<p>Manejar un número masivo de vectores para la búsqueda de similitudes (incluso con índices) puede resultar muy caro. A pesar de ello, las mejores y más avanzadas bases de datos vectoriales deberían permitirte insertar, indexar y buscar entre millones o miles de millones de vectores objetivo, además de especificar un algoritmo de indexación y una métrica de similitud de tu elección.</p>
<p>Las bases de datos vectoriales deben satisfacer principalmente los siguientes requisitos clave para que un sistema de gestión de bases de datos robusto pueda utilizarse en la empresa:</p>
<ol>
<li><strong>Escalable:</strong> Las bases de datos vectoriales deben ser capaces de indexar y ejecutar la búsqueda aproximada del vecino más próximo para miles de millones de vectores incrustados</li>
<li><strong>Fiables:</strong> Las bases de datos vectoriales deben ser capaces de gestionar fallos internos sin pérdida de datos y con un impacto operativo mínimo, es decir, ser tolerantes a fallos.</li>
<li><strong>Rápidas:</strong> Las velocidades de consulta y escritura son importantes para las bases de datos vectoriales. Para plataformas como Snapchat e Instagram, que pueden tener cientos o miles de nuevas imágenes cargadas por segundo, la velocidad se convierte en un factor increíblemente importante.</li>
</ol>
<p>Las bases de datos vectoriales no sólo almacenan vectores de datos. También son responsables de utilizar estructuras de datos eficientes para indexar estos vectores para una recuperación rápida y soportar operaciones CRUD (crear, leer, actualizar y eliminar). Idealmente, las bases de datos vectoriales también deberían soportar el filtrado de atributos, es decir, el filtrado basado en campos de metadatos que suelen ser campos escalares. Un ejemplo sencillo sería recuperar zapatos similares a partir de los vectores de imágenes de una marca concreta. En este caso, la marca sería el atributo en función del cual se realizaría el filtrado.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Bitmask_f72259b751.png" alt="figure 5" class="doc-image" id="figure-5" />
   </span> <span class="img-wrapper"> <span>Figura 5</span> </span></p>
<p>La figura anterior muestra cómo <a href="https://milvus.io/">Milvus</a>, la base de datos vectorial de la que hablaremos en breve, utiliza el filtrado por atributos. <a href="https://milvus.io/">Milvus</a> introduce el concepto de máscara de bits en el mecanismo de filtrado para mantener vectores similares con una máscara de bits de 1 basada en la satisfacción de filtros de atributos específicos. Más detalles <a href="https://zilliz.com/learn/attribute-filtering">aquí</a>.</p>
<h2 id="Milvus--The-World’s-Most-Advanced-Vector-Database" class="common-anchor-header">Milvus - La base de datos vectorial más avanzada del mundo<button data-href="#Milvus--The-World’s-Most-Advanced-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a> es una plataforma de gestión de bases de datos vectoriales de código abierto construida específicamente para datos vectoriales a gran escala y para agilizar las operaciones de aprendizaje automático (MLOps).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_Logo_ee3ae48b61.png" alt="figure 6" class="doc-image" id="figure-6" />
   </span> <span class="img-wrapper"> <span>figura 6</span> </span></p>
<p><a href="https://zilliz.com/">Zilliz</a>, es la organización que está detrás de la construcción de <a href="https://milvus.io/">Milvus</a>, la base de datos vectorial más avanzada del mundo, para acelerar el desarrollo del tejido de datos de próxima generación. Milvus es actualmente un proyecto de graduación en la <a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation</a> y se centra en la gestión de conjuntos masivos de datos no estructurados para su almacenamiento y búsqueda. La eficiencia y fiabilidad de la plataforma simplifica el proceso de despliegue de modelos de IA y MLOps a escala. Milvus tiene amplias aplicaciones que abarcan el descubrimiento de fármacos, la visión por ordenador, los sistemas de recomendación, los chatbots y mucho más.</p>
<h3 id="Key-Features-of-Milvus" class="common-anchor-header">Características principales de Milvus</h3><p>Milvus está repleto de características y capacidades útiles, tales como:</p>
<ul>
<li><strong>Velocidades de búsqueda fulgurantes en un billón de conjuntos de datos vectoriales:</strong> La latencia media de la búsqueda y recuperación de vectores se ha medido en milisegundos en un billón de conjuntos de datos vectoriales.</li>
<li><strong>Gestión simplificada de datos no estructurados:</strong> Milvus cuenta con ricas API diseñadas para flujos de trabajo de ciencia de datos.</li>
<li><strong>Base de datos vectorial fiable y siempre activa:</strong> Las funciones integradas de replicación y failover/failback de Milvus garantizan que los datos y las aplicaciones puedan mantener la continuidad del negocio siempre.</li>
<li><strong>Altamente escalable y elástica:</strong> La escalabilidad a nivel de componente permite aumentar y reducir la escala según la demanda.</li>
<li><strong>Búsqueda híbrida:</strong> Además de vectores, Milvus admite tipos de datos como booleanos, cadenas, enteros, números de punto flotante y más. Milvus combina el filtrado escalar con una potente búsqueda de similitud vectorial (como se ve en el ejemplo anterior de similitud de zapatos).</li>
<li><strong>Estructura lambda unificada:</strong> Milvus combina el flujo y el procesamiento por lotes para el almacenamiento de datos para equilibrar la puntualidad y la eficiencia.</li>
<li><strong><a href="https://milvus.io/docs/v2.0.x/timetravel_ref.md">Viaje en el tiempo</a>:</strong> Milvus mantiene una línea de tiempo para todas las operaciones de inserción y eliminación de datos. Permite a los usuarios especificar marcas de tiempo en una búsqueda para recuperar una vista de datos en un punto específico en el tiempo.</li>
<li><strong>Respaldado por la comunidad y reconocido por la industria:</strong> Con más de 1.000 usuarios empresariales, más de 10.500 estrellas en <a href="https://github.com/milvus-io/milvus">GitHub</a> y una comunidad activa de código abierto, no está solo cuando utiliza Milvus. Como proyecto de posgrado de la <a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation</a>, Milvus cuenta con apoyo institucional.</li>
</ul>
<h3 id="Existing-Approaches-to-Vector-Data-Management-and-Search" class="common-anchor-header">Enfoques existentes para la gestión y búsqueda de datos vectoriales</h3><p>Una forma común de construir un sistema de IA basado en la búsqueda de similitud vectorial es emparejar algoritmos como la búsqueda del vecino más cercano aproximado (ANNS) con bibliotecas de código abierto como:</p>
<ul>
<li><strong><a href="https://ai.facebook.com/tools/faiss/">Facebook AI Similarity Search (FAISS)</a>:</strong> Este marco permite la búsqueda eficiente de similitudes y la agrupación de vectores densos. Contiene algoritmos que buscan en conjuntos de vectores de cualquier tamaño, hasta los que posiblemente no quepan en la memoria RAM. Admite funciones de indexación como el multiíndice invertido y la cuantización de productos.</li>
<li><strong><a href="https://github.com/spotify/annoy">Annoy de Spotify (Approximate Nearest Neighbors Oh Yeah)</a>:</strong> Este marco utiliza <a href="http://en.wikipedia.org/wiki/Locality-sensitive_hashing#Random_projection">proyecciones aleatorias</a> y construye un árbol para permitir ANNS a escala para vectores densos.</li>
<li><strong><a href="https://github.com/google-research/google-research/tree/master/scann">ScaNN (Scalable Nearest Neighbors) de Google</a>:</strong> Este marco realiza una búsqueda eficiente de similitudes vectoriales a escala. Consta de implementaciones que incluyen la poda del espacio de búsqueda y la cuantización para la búsqueda máxima de productos internos (MIPS).</li>
</ul>
<p>Aunque cada una de estas bibliotecas es útil a su manera, debido a varias limitaciones, estas combinaciones de algoritmo y biblioteca no son equivalentes a un sistema completo de gestión de datos vectoriales como Milvus. A continuación analizaremos algunas de estas limitaciones.</p>
<h3 id="Limitations-of-Existing-Approaches" class="common-anchor-header">Limitaciones de los enfoques existentes</h3><p>Los enfoques existentes utilizados para la gestión de datos vectoriales, tal y como se ha comentado en la sección anterior, presentan las siguientes limitaciones:</p>
<ol>
<li><strong>Flexibilidad:</strong> Los sistemas existentes suelen almacenar todos los datos en la memoria principal, por lo que no pueden ejecutarse fácilmente en modo distribuido en varias máquinas y no son adecuados para gestionar conjuntos de datos masivos.</li>
<li><strong>Tratamiento dinámico de datos:</strong> A menudo se asume que los datos son estáticos una vez introducidos en los sistemas existentes, lo que complica el procesamiento de datos dinámicos e imposibilita la búsqueda en tiempo casi real.</li>
<li><strong>Procesamiento avanzado de consultas:</strong> La mayoría de las herramientas no admiten el procesamiento avanzado de consultas (por ejemplo, filtrado de atributos, búsqueda híbrida y consultas multivectoriales), que es esencial para construir motores de búsqueda de similitudes en el mundo real que admitan el filtrado avanzado.</li>
<li><strong>Optimizaciones para computación heterogénea:</strong> Pocas plataformas ofrecen optimizaciones para arquitecturas de sistemas heterogéneos tanto en CPU como en GPU (excluyendo FAISS), lo que conlleva pérdidas de eficiencia.</li>
</ol>
<p><a href="https://milvus.io/">Milvus</a> intenta superar todas estas limitaciones y lo analizaremos en detalle en la siguiente sección.</p>
<h3 id="The-Milvus-Advantage-Understanding-Knowhere" class="common-anchor-header">La ventaja de Milvus: comprender Knowhere</h3><p><a href="https://milvus.io/">Milvus</a> intenta abordar y resolver con éxito las limitaciones de los sistemas existentes construidos sobre algoritmos ineficientes de gestión de datos vectoriales y de búsqueda de similitudes de las siguientes maneras:</p>
<ul>
<li>Mejora la flexibilidad ofreciendo soporte para una variedad de interfaces de aplicación (incluyendo SDKs en Python, Java, Go, C++ y RESTful APIs).</li>
<li>Soporta múltiples tipos de índices vectoriales (por ejemplo, índices basados en cuantización e índices basados en grafos) y procesamiento avanzado de consultas.</li>
<li>Milvus maneja datos vectoriales dinámicos utilizando un árbol de fusión estructurado en registros (árbol LSM), manteniendo la eficiencia de las inserciones y supresiones de datos y el ritmo de las búsquedas en tiempo real.</li>
<li>Milvus también proporciona optimizaciones para arquitecturas informáticas heterogéneas en CPU y GPU modernas, lo que permite a los desarrolladores ajustar los sistemas a escenarios, conjuntos de datos y entornos de aplicación específicos.</li>
</ul>
<p>Knowhere, el motor de ejecución vectorial de Milvus, es una interfaz de operaciones para acceder a servicios en las capas superiores del sistema y a bibliotecas de búsqueda de similitud vectorial como Faiss, Hnswlib, Annoy en las capas inferiores del sistema. Además, Knowhere también se encarga de la computación heterogénea. Knowhere controla en qué hardware (por ejemplo, CPU o GPU) se ejecutan las solicitudes de creación de índices y de búsqueda. Así es como Knowhere obtiene su nombre - sabiendo dónde ejecutar las operaciones. Más tipos de hardware incluyendo DPU y TPU serán soportados en futuras versiones.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/knowhere_architecture_f1be3dbb1a.png" alt="figure 7" class="doc-image" id="figure-7" />
   </span> <span class="img-wrapper"> <span>Figura 7</span> </span></p>
<p>La computación en Milvus implica principalmente operaciones vectoriales y escalares. Knowhere sólo maneja las operaciones sobre vectores en Milvus. La figura anterior ilustra la arquitectura Knowhere en Milvus. La capa inferior es el hardware del sistema. Las bibliotecas de índices de terceros están sobre el hardware. Luego Knowhere interactúa con el nodo de índice y el nodo de consulta en la parte superior a través de CGO. Knowhere no sólo amplía las funciones de Faiss, sino que también optimiza el rendimiento y tiene varias ventajas, incluyendo soporte para BitsetView, soporte para más métricas de similitud, soporte para el conjunto de instrucciones AVX512, selección automática de instrucciones SIMD y otras optimizaciones de rendimiento. Encontrará más información <a href="https://milvus.io/blog/deep-dive-8-knowhere.md">aquí</a>.</p>
<h3 id="Milvus-Architecture" class="common-anchor-header">Arquitectura de Milvus</h3><p>La siguiente figura muestra la arquitectura general de la plataforma Milvus. Milvus separa el flujo de datos del flujo de control y se divide en cuatro capas que son independientes en términos de escalabilidad y recuperación de desastres.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ca80be5f96.png" alt="figure 8" class="doc-image" id="figure-8" />
   </span> <span class="img-wrapper"> <span>Figura 8</span> </span></p>
<ul>
<li><strong>Capa de acceso:</strong> La capa de acceso está compuesta por un grupo de proxies sin estado y sirve como capa frontal del sistema y punto final para los usuarios.</li>
<li><strong>Servicio de coordinación:</strong> El servicio de coordinación es responsable de la gestión de los nodos de la topología del clúster, el equilibrio de carga, la generación de marcas de tiempo, la declaración de datos y la gestión de datos.</li>
<li><strong>Nodos de trabajo:</strong> El nodo trabajador, o de ejecución, ejecuta las instrucciones emitidas por el servicio coordinador y los comandos del lenguaje de manipulación de datos (DML) iniciados por el proxy. Un nodo trabajador en Milvus es similar a un nodo de datos en <a href="https://hadoop.apache.org/">Hadoop</a> o a un servidor de región en HBase.</li>
<li><strong>Almacenamiento:</strong> Es la piedra angular de Milvus, responsable de la persistencia de los datos. La capa de almacenamiento se compone de <strong>meta store</strong>, <strong>log broker</strong> y <strong>object storage</strong>.</li>
</ul>
<p>Consulte <a href="https://milvus.io/docs/v2.0.x/four_layers.md">aquí</a> más detalles sobre la arquitectura.</p>
<h2 id="Performing-visual-image-search-with-Milvus--A-use-case-blueprint" class="common-anchor-header">Realizar búsquedas visuales de imágenes con Milvus - Un modelo de caso de uso<button data-href="#Performing-visual-image-search-with-Milvus--A-use-case-blueprint" class="anchor-icon" translate="no">
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
    </button></h2><p>Las bases de datos vectoriales de código abierto como Milvus permiten a cualquier empresa crear su propio sistema de búsqueda de imágenes visuales con un número mínimo de pasos. Los desarrolladores pueden utilizar modelos de IA preentrenados para convertir sus propios conjuntos de datos de imágenes en vectores y, a continuación, aprovechar Milvus para permitir la búsqueda de productos similares por imagen. Veamos en el siguiente esquema cómo diseñar y construir un sistema de este tipo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Workflow_for_Visual_Image_Search_c490906a58.jpeg" alt="figure 9" class="doc-image" id="figure-9" />
   </span> <span class="img-wrapper"> <span>Figura 9</span> </span></p>
<p>En este flujo de trabajo podemos utilizar un marco de trabajo de código abierto como <a href="https://github.com/towhee-io/towhee">towhee</a> para aprovechar un modelo preentrenado como ResNet-50 y extraer vectores de imágenes, almacenar e indexar estos vectores con facilidad en Milvus y también almacenar una asignación de ID de imagen a las imágenes reales en una base de datos MySQL. Una vez indexados los datos, podemos cargar cualquier imagen nueva con facilidad y realizar búsquedas de imágenes a escala utilizando Milvus. La siguiente figura muestra un ejemplo de búsqueda visual de imágenes.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sample_Visual_Search_Example_52c6410dfd.png" alt="figure 10" class="doc-image" id="figure-10" />
   </span> <span class="img-wrapper"> <span>figura 10</span> </span></p>
<p>Eche un vistazo al <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search/quick_deploy">tutorial</a> detallado que se ha abierto en GitHub gracias a Milvus.</p>
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
    </button></h2><p>Hemos cubierto una buena cantidad de terreno en este artículo. Empezamos con los retos de representar datos no estructurados, aprovechando los vectores y la búsqueda de similitud vectorial a escala con Milvus, una base de datos vectorial de código abierto. Hablamos de los detalles de la estructura de Milvus y de los componentes clave que la impulsan, así como de un plan para resolver un problema del mundo real: la búsqueda visual de imágenes con Milvus. Pruébelo y empiece a resolver sus propios problemas del mundo real con <a href="https://milvus.io/">Milvus</a>.</p>
<p>¿Le ha gustado este artículo? Póngase <a href="https://www.linkedin.com/in/dipanzan/">en contacto conmigo</a> para hablar más sobre él o para darme su opinión.</p>
<h2 id="About-the-author" class="common-anchor-header">Sobre el autor<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>Dipanjan (DJ) Sarkar es Jefe de Ciencia de Datos, Experto en Desarrollo de Google - Aprendizaje Automático, Autor, Consultor y Asesor de IA. Contacto: http://bit.ly/djs_linkedin</p>
