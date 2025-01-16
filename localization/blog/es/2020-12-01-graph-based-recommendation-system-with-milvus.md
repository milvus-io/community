---
id: graph-based-recommendation-system-with-milvus.md
title: ¿Cómo funcionan los sistemas de recomendación?
author: Shiyu Chen
date: 2020-12-01T21:41:08.582Z
desc: >-
  Los sistemas de recomendación pueden generar ingresos, reducir costes y
  ofrecer una ventaja competitiva. Aprenda a crear uno gratis con herramientas
  de código abierto.
cover: >-
  assets.zilliz.com/thisisengineering_raeng_z3c_Mj_I6k_P_I_unsplash_2228b9411c.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/graph-based-recommendation-system-with-milvus'
---
<custom-h1>Creación de un sistema de recomendación basado en gráficos con los conjuntos de datos Milvus, PinSage, DGL y MovieLens</custom-h1><p>Los sistemas de recomendación se basan en algoritmos que <a href="https://www.npr.org/2021/06/03/1002772749/the-rise-of-recommendation-systems-how-machines-figure-out-the-things-we-want">, en sus humildes orígenes,</a> ayudaban a los humanos a cribar el correo electrónico no deseado. En 1990, el inventor Doug Terry utilizó un algoritmo de filtrado colaborativo para separar el correo electrónico deseable del correo basura. Con sólo "gustar" u "odiar" un correo electrónico, en colaboración con otros que hacían lo mismo con un contenido similar, los usuarios podían entrenar rápidamente a los ordenadores para que determinaran qué enviar a la bandeja de entrada del usuario y qué a la carpeta de correo no deseado.</p>
<p>En sentido general, los sistemas de recomendación son algoritmos que hacen sugerencias pertinentes a los usuarios. Las sugerencias pueden ser películas para ver, libros para leer, productos para comprar o cualquier otra cosa, según el escenario o el sector. Estos algoritmos están a nuestro alrededor, influyendo en el contenido que consumimos y en los productos que compramos a grandes empresas tecnológicas como Youtube, Amazon, Netflix y muchas más.</p>
<p>Los sistemas de recomendación bien diseñados pueden ser generadores de ingresos esenciales, reductores de costes y diferenciadores competitivos. Gracias a la tecnología de código abierto y a la disminución de los costes de computación, los sistemas de recomendación personalizados nunca han sido tan accesibles. Este artículo explica cómo utilizar Milvus, una base de datos vectorial de código abierto; PinSage, una red neuronal convolucional de grafos (GCN); deep graph library (DGL), un paquete python escalable para el aprendizaje profundo de grafos; y los conjuntos de datos MovieLens para crear un sistema de recomendación basado en grafos.</p>
<p><strong>Ir a:</strong></p>
<ul>
<li><a href="#how-do-recommendation-systems-work">¿Cómo funcionan los sistemas de recomendación?</a></li>
<li><a href="#tools-for-building-a-recommender-system">Herramientas para crear un sistema de recomendación</a></li>
<li><a href="#building-a-graph-based-recommender-system-with-milvus">Creación de un sistema de recomendación basado en grafos con Milvus</a></li>
</ul>
<h2 id="How-do-recommendation-systems-work" class="common-anchor-header">¿Cómo funcionan los sistemas de recomendación?<button data-href="#How-do-recommendation-systems-work" class="anchor-icon" translate="no">
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
    </button></h2><p>Existen dos métodos habituales para crear sistemas de recomendación: el filtrado colaborativo y el filtrado basado en el contenido. La mayoría de los desarrolladores utilizan uno o ambos métodos y, aunque los sistemas de recomendación pueden variar en complejidad y construcción, suelen incluir tres elementos básicos:</p>
<ol>
<li><strong>Modelo de usuario:</strong> Los sistemas de recomendación requieren modelar las características, preferencias y necesidades del usuario. Muchos sistemas de recomendación basan sus sugerencias en información implícita o explícita de los usuarios a nivel de artículo.</li>
<li><strong>Modelo de objeto:</strong> Los sistemas de recomendación también modelan los objetos con el fin de hacer recomendaciones de artículos basadas en los retratos de los usuarios.</li>
<li><strong>Algoritmo de recomendación:</strong> El componente central de cualquier sistema de recomendación es el algoritmo que impulsa sus recomendaciones. Entre los algoritmos más utilizados se encuentran el filtrado colaborativo, el modelado semántico implícito, el modelado basado en gráficos y la recomendación combinada, entre otros.</li>
</ol>
<p>A grandes rasgos, los sistemas de recomendación que se basan en el filtrado colaborativo construyen un modelo a partir del comportamiento anterior del usuario (incluidas las entradas de comportamiento de usuarios similares) para predecir lo que podría interesarle a un usuario. Los sistemas que se basan en el filtrado por contenido utilizan etiquetas discretas y predefinidas basadas en las características de los artículos para recomendar artículos similares.</p>
<p>Un ejemplo de filtrado colaborativo sería una emisora de radio personalizada en Spotify que se basa en el historial de escucha, los intereses, la biblioteca musical y otros datos del usuario. La emisora reproduce música que el usuario no ha guardado o por la que no ha expresado interés, pero que otros usuarios con gustos similares suelen escuchar. Un ejemplo de filtrado basado en el contenido sería una emisora de radio basada en una canción o artista concretos que utiliza atributos de la entrada para recomendar música similar.</p>
<h2 id="Tools-for-building-a-recommender-system" class="common-anchor-header">Herramientas para crear un sistema de recomendación<button data-href="#Tools-for-building-a-recommender-system" class="anchor-icon" translate="no">
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
    </button></h2><p>En este ejemplo, la construcción desde cero de un sistema de recomendación basado en grafos depende de las siguientes herramientas:</p>
<h3 id="Pinsage-A-graph-convolutional-network" class="common-anchor-header">Pinsage: Una red convolucional de grafos</h3><p><a href="https://medium.com/pinterest-engineering/pinsage-a-new-graph-convolutional-neural-network-for-web-scale-recommender-systems-88795a107f48">PinSage</a> es una red convolucional de grafos de recorrido aleatorio capaz de aprender incrustaciones de nodos en grafos a escala web que contienen miles de millones de objetos. La red fue desarrollada por <a href="https://www.pinterest.com/">Pinterest</a>, una empresa de tablones de anuncios en línea, para ofrecer recomendaciones visuales temáticas a sus usuarios.</p>
<p>Los usuarios de Pinterest pueden "pinear" contenidos que les interesan en "tableros", que son colecciones de contenidos pineados. Con más de <a href="https://business.pinterest.com/audience/">478 millones de</a> usuarios activos mensuales (MAU) y más de <a href="https://newsroom.pinterest.com/en/company">240.000 millones de</a> objetos guardados, la empresa tiene una inmensa cantidad de datos de usuarios que debe crear nueva tecnología para mantener al día.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_742d28f7a9.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>PinSage utiliza grafos bipartitos de pines para generar incrustaciones de alta calidad a partir de pines que se utilizan para recomendar a los usuarios contenidos visualmente similares. A diferencia de los algoritmos GCN tradicionales, que realizan convoluciones sobre las matrices de características y el grafo completo, PinSage muestrea los nodos/pines cercanos y realiza convoluciones locales más eficientes mediante la construcción dinámica de grafos computacionales.</p>
<p>Realizar convoluciones en todo el vecindario de un nodo dará como resultado un grafo computacional masivo. Para reducir las necesidades de recursos, los algoritmos GCN tradicionales actualizan la representación de un nodo agregando información de su vecindario de k saltos. PinSage simula un paseo aleatorio para establecer el contenido más visitado como vecindario clave y, a continuación, construye una convolución basada en él.</p>
<p>Como a menudo hay solapamiento en los vecindarios k-hop, la convolución local en los nodos da lugar a cálculos repetidos. Para evitar esto, en cada paso agregado PinSage mapea todos los nodos sin cálculos repetidos, luego los vincula a los nodos de nivel superior correspondientes y, por último, recupera las incrustaciones de los nodos de nivel superior.</p>
<h3 id="Deep-Graph-Library-A-scalable-python-package-for-deep-learning-on-graphs" class="common-anchor-header">Biblioteca de grafos profundos: Un paquete python escalable para el aprendizaje profundo en grafos</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/dgl_framework_building_graph_based_recommender_milvus_af62de6dd4.png" alt="dgl-framework-building-graph-based-recommender-milvus.png" class="doc-image" id="dgl-framework-building-graph-based-recommender-milvus.png" />
   </span> <span class="img-wrapper"> <span>dgl-framework-construccion-recomendador-basado-en-graficos-milvus.png</span> </span></p>
<p><a href="https://www.dgl.ai/">Deep Graph Library (DGL)</a> es un paquete de Python diseñado para construir modelos de redes neuronales basados en grafos sobre los marcos de aprendizaje profundo existentes (por ejemplo, PyTorch, MXNet, Gluon, etc.). DGL incluye una interfaz backend fácil de usar, lo que facilita su implantación en frameworks basados en tensores y que soportan la generación automática. El algoritmo PinSage mencionado anteriormente está optimizado para su uso con DGL y PyTorch.</p>
<h3 id="Milvus-An-open-source-vector-database-built-for-AI-and-similarity-search" class="common-anchor-header">Milvus: Una base de datos vectorial de código abierto creada para la IA y la búsqueda de similitudes</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_does_milvus_work_6926180543.png" alt="how-does-milvus-work.png" class="doc-image" id="how-does-milvus-work.png" />
   </span> <span class="img-wrapper"> <span>cómo-funciona-milvus.png</span> </span></p>
<p>Milvus es una base de datos vectorial de código abierto creada para potenciar la búsqueda de similitudes vectoriales y las aplicaciones de inteligencia artificial (IA). A grandes rasgos, el uso de Milvus para la búsqueda de similitudes funciona de la siguiente manera:</p>
<ol>
<li>Se utilizan modelos de aprendizaje profundo para convertir datos no estructurados en vectores de características, que se importan a Milvus.</li>
<li>Milvus almacena e indexa los vectores de características.</li>
<li>A petición, Milvus busca y devuelve los vectores más similares a un vector de entrada.</li>
</ol>
<h2 id="Building-a-graph-based-recommendation-system-with-Milvus" class="common-anchor-header">Creación de un sistema de recomendación basado en grafos con Milvus<button data-href="#Building-a-graph-based-recommendation-system-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_intelligent_house_platform_diagram_6e278da118.jpg" alt="beike-intelligent-house-platform-diagram.jpg" class="doc-image" id="beike-intelligent-house-platform-diagram.jpg" />
   </span> <span class="img-wrapper"> <span>beike-intelligent-house-platform-diagram.jpg</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_building_graph_based_recommender_system_bf89770634.png" alt="3-building-graph-based-recommender-system.png" class="doc-image" id="3-building-graph-based-recommender-system.png" />
   </span> <span class="img-wrapper"> <span>3-construir-sistema-de-recomendación-basado-en-grafos.jpg</span> </span></p>
<p>Construir un sistema de recomendación basado en grafos con Milvus implica los siguientes pasos:</p>
<h3 id="Step-1-Preprocess-data" class="common-anchor-header">Paso 1: Preprocesar los datos</h3><p>El preprocesamiento de datos consiste en convertir los datos brutos en un formato más fácilmente comprensible. Este ejemplo utiliza los conjuntos de datos abiertos MovieLens[5] (m1-1m), que contienen 1.000.000 de valoraciones de 4.000 películas aportadas por 6.000 usuarios. Estos datos fueron recopilados por GroupLens e incluyen descripciones de películas, valoraciones de películas y características de los usuarios.</p>
<p>Tenga en cuenta que los conjuntos de datos de MovieLens utilizados en este ejemplo requieren una mínima limpieza u organización de los datos. Sin embargo, si utiliza conjuntos de datos diferentes, su experiencia puede variar.</p>
<p>Para empezar a crear un sistema de recomendación, cree un gráfico bipartito usuario-película con fines de clasificación utilizando los datos históricos usuario-película del conjunto de datos MovieLens.</p>
<pre><code translate="no">graph_builder = PandasGraphBuilder()
graph_builder.add_entities(users, 'user_id', 'user')
graph_builder.add_entities(movies_categorical, 'movie_id', 'movie')
graph_builder.add_binary_relations(ratings, 'user_id', 'movie_id', 'watched')
graph_builder.add_binary_relations(ratings, 'movie_id', 'user_id', 'watched-by')
g = graph_builder.build()
</code></pre>
<h3 id="Step-2-Train-model-with-PinSage" class="common-anchor-header">Paso 2: Entrenar el modelo con PinSage</h3><p>Los vectores de incrustación de pines generados con el modelo PinSage son vectores de características de la información de películas adquirida. Cree un modelo PinSage basado en el grafo bipartito g y las dimensiones personalizadas del vector de características de la película (256-d por defecto). A continuación, entrene el modelo con PyTorch para obtener las incrustaciones h_item de 4.000 películas.</p>
<pre><code translate="no"># Define the model
model = PinSAGEModel(g, item_ntype, textset, args.hidden_dims, args.num_layers).to(device)
opt = torch.optim.Adam(model.parameters(), lr=args.lr)
# Get the item embeddings
for blocks in dataloader_test:
   for i in range(len(blocks)):
   blocks[i] = blocks[i].to(device)
   h_item_batches.append(model.get_repr(blocks))
h_item = torch.cat(h_item_batches, 0)
</code></pre>
<h3 id="Step-3-Load-data" class="common-anchor-header">Paso 3: Cargar datos</h3><p>Cargue las incrustaciones de películas h_item generadas por el modelo PinSage en Milvus, que devolverá los ID correspondientes. Importe los ID y la información de la película correspondiente a MySQL.</p>
<pre><code translate="no"># Load data to Milvus and MySQL
status, ids = milvus.insert(milvus_table, h_item)
load_movies_to_mysql(milvus_table, ids_info)
</code></pre>
<h3 id="Step-4-Conduct-vector-similarity-search" class="common-anchor-header">Paso 4: Realizar una búsqueda de similitud vectorial</h3><p>Obtenga las incrustaciones correspondientes en Milvus basándose en los ID de las películas y, a continuación, utilice Milvus para realizar una búsqueda de similitud con estas incrustaciones. A continuación, identifique la información de la película correspondiente en una base de datos MySQL.</p>
<pre><code translate="no"># Get embeddings that users like
_, user_like_vectors = milvus.get_entity_by_id(milvus_table, ids)
# Get the information with similar movies
_, ids = milvus.search(param = {milvus_table, user_like_vectors, top_k})
sql = &quot;select * from &quot; + movies_table + &quot; where milvus_id=&quot; + ids + &quot;;&quot;
results = cursor.execute(sql).fetchall()
</code></pre>
<h3 id="Step-5-Get-recommendations" class="common-anchor-header">Paso 5: Obtener recomendaciones</h3><p>El sistema recomendará ahora las películas más similares a las consultas de búsqueda del usuario. Este es el flujo de trabajo general para crear un sistema de recomendación. Para probar y desplegar rápidamente sistemas de recomendación y otras aplicaciones de IA, pruebe el Milvus <a href="https://github.com/milvus-io/bootcamp">bootcamp</a>.</p>
<h2 id="Milvus-can-power-more-than-recommender-systems" class="common-anchor-header">Milvus puede hacer más que sistemas de recomendación<button data-href="#Milvus-can-power-more-than-recommender-systems" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus es una potente herramienta capaz de alimentar una amplia gama de aplicaciones de inteligencia artificial y búsqueda de similitud vectorial. Para saber más sobre el proyecto, consulte los siguientes recursos:</p>
<ul>
<li>Lea nuestro <a href="https://zilliz.com/blog">blog</a>.</li>
<li>Interactúe con nuestra comunidad de código abierto en <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Utilice o contribuya a la base de datos vectorial más popular del mundo en <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
</ul>
