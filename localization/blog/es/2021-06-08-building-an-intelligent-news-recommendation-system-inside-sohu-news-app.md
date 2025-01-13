---
id: building-an-intelligent-news-recommendation-system-inside-sohu-news-app.md
title: Recomendación de contenidos mediante búsqueda semántica vectorial
author: milvus
date: 2021-06-08T01:42:53.489Z
desc: >-
  Descubra cómo se utilizó Milvus para crear un sistema inteligente de
  recomendación de noticias dentro de una aplicación.
cover: assets.zilliz.com/blog_Sohu_News_dec53d0814.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-an-intelligent-news-recommendation-system-inside-sohu-news-app
---
<custom-h1>Creación de un sistema inteligente de recomendación de noticias en la aplicación Sohu News</custom-h1><p>El <a href="https://www.socialmediatoday.com/news/new-research-shows-that-71-of-americans-now-get-news-content-via-social-pl/593255/">71% de los estadounidenses</a> obtienen sus recomendaciones de noticias de las plataformas sociales, por lo que el contenido personalizado se ha convertido rápidamente en la forma de descubrir los nuevos medios. Tanto si se buscan temas específicos como si se interactúa con contenidos recomendados, todo lo que ven los usuarios se optimiza mediante algoritmos para mejorar el porcentaje de clics, la participación y la relevancia. Sohu es un grupo chino de medios de comunicación, vídeo, búsquedas y juegos en línea que cotiza en el NASDAQ. Aprovechó <a href="https://milvus.io/">Milvus</a>, una base de datos vectorial de código abierto creada por <a href="https://zilliz.com/">Zilliz</a>, para construir un motor de búsqueda semántica vectorial dentro de su aplicación de noticias. En este artículo se explica cómo la empresa utilizó los perfiles de los usuarios para afinar las recomendaciones de contenidos personalizadas a lo largo del tiempo, mejorando la experiencia y la participación de los usuarios.</p>
<h2 id="Recommending-content-using-semantic-vector-search" class="common-anchor-header">Recomendación de contenidos mediante búsqueda semántica vectorial<button data-href="#Recommending-content-using-semantic-vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Los perfiles de usuario de Sohu News se construyen a partir del historial de navegación y se ajustan a medida que los usuarios buscan contenidos de noticias e interactúan con ellos. El sistema de recomendación de Sohu utiliza la búsqueda vectorial semántica para encontrar artículos de noticias relevantes. El sistema identifica un conjunto de etiquetas que se espera sean de interés para cada usuario basándose en su historial de navegación. A continuación, busca rápidamente los artículos pertinentes y ordena los resultados por popularidad (medida por el CTR medio), antes de servirlos a los usuarios.</p>
<p>Sólo el New York Times publica <a href="https://www.theatlantic.com/technology/archive/2016/05/how-many-stories-do-newspapers-publish-per-day/483845/">230 contenidos</a> al día, lo que da una idea de la magnitud de los nuevos contenidos que debe ser capaz de procesar un sistema de recomendación eficaz. La ingestión de grandes volúmenes de noticias exige una búsqueda de similitudes en milisegundos y una correspondencia cada hora de las etiquetas con los nuevos contenidos. Sohu eligió Milvus porque procesa conjuntos de datos masivos con eficacia y precisión, reduce el uso de memoria durante la búsqueda y admite implementaciones de alto rendimiento.</p>
<h2 id="Understanding-a-news-recommendation-system-workflow" class="common-anchor-header">Comprender el flujo de trabajo de un sistema de recomendación de noticias<button data-href="#Understanding-a-news-recommendation-system-workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>La recomendación de contenidos basada en la búsqueda vectorial semántica de Sohu se basa en el Modelo Semántico Estructurado Profundo (DSSM), que utiliza dos redes neuronales para representar las consultas de los usuarios y los artículos de noticias como vectores. El modelo calcula la similitud coseno de los dos vectores semánticos y, a continuación, el lote de noticias más similar se envía al grupo de candidatos a recomendación. A continuación, los artículos de noticias se clasifican en función de su CTR estimado y se muestran a los usuarios aquellos con el mayor porcentaje de clics previsto.</p>
<h3 id="Encoding-news-articles-into-semantic-vectors-with-BERT-as-service" class="common-anchor-header">Codificación de noticias en vectores semánticos con BERT-as-service</h3><p>Para codificar las noticias en vectores semánticos, el sistema utiliza la herramienta <a href="https://github.com/hanxiao/bert-as-service.git">BERT-as-service</a>. Si el número de palabras de un contenido supera las 512, se produce una pérdida de información durante el proceso de incrustación. Para evitarlo, el sistema extrae primero un resumen y lo codifica en un vector semántico de 768 dimensiones. A continuación, se extraen los dos temas más relevantes de cada noticia y se identifican los correspondientes vectores temáticos preentrenados (200 dimensiones) a partir del ID del tema. A continuación, los vectores temáticos se unen al vector semántico de 768 dimensiones extraído del resumen del artículo, formando un vector semántico de 968 dimensiones.</p>
<p>Los nuevos contenidos llegan continuamente a través de Kafta y se convierten en vectores semánticos antes de ser insertados en la base de datos Milvus.</p>
<h3 id="Extracting-semantically-similar-tags-from-user-profiles-with-BERT-as-service" class="common-anchor-header">Extracción de etiquetas semánticamente similares de perfiles de usuario con BERT-as-service</h3><p>La otra red neuronal del modelo es el vector semántico del usuario. Las etiquetas semánticamente similares (por ejemplo, coronavirus, covid, COVID-19, pandemia, nueva cepa, neumonía) se extraen de los perfiles de los usuarios en función de sus intereses, consultas de búsqueda e historial de navegación. La lista de etiquetas adquiridas se ordena por peso, y las 200 primeras se dividen en diferentes grupos semánticos. Las permutaciones de las etiquetas dentro de cada grupo semántico se utilizan para generar nuevas frases de etiquetas, que luego se codifican en vectores semánticos mediante BERT-as-service.</p>
<p>Para cada perfil de usuario, los conjuntos de frases de etiquetas tienen un <a href="https://github.com/baidu/Familia">conjunto correspondiente de temas</a> que se marcan con un peso que indica el nivel de interés del usuario. El modelo de aprendizaje automático (ML) selecciona los dos temas más relevantes y los codifica para incorporarlos al vector semántico de etiquetas correspondiente, formando un vector semántico de usuario de 968 dimensiones. Aunque el sistema genere las mismas etiquetas para distintos usuarios, las distintas ponderaciones de las etiquetas y sus temas correspondientes, así como la varianza explícita entre los vectores temáticos de cada usuario, garantizan que las recomendaciones sean únicas.</p>
<p>El sistema es capaz de hacer recomendaciones de noticias personalizadas calculando la similitud coseno de los vectores semánticos extraídos tanto de los perfiles de usuario como de los artículos de noticias.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sohu01_1e466fe0c3.jpg" alt="Sohu01.jpg" class="doc-image" id="sohu01.jpg" />
   </span> <span class="img-wrapper"> <span>Sohu01.jpg</span> </span></p>
<h3 id="Computing-new-semantic-user-profile-vectors-and-inserting-them-to-Milvus" class="common-anchor-header">Cálculo de nuevos vectores semánticos de perfil de usuario e inserción de los mismos en Milvus</h3><p>Los vectores semánticos de los perfiles de los usuarios se calculan diariamente, con los datos del periodo de 24 horas anterior procesados la noche siguiente. Los vectores se insertan individualmente en Milvus y se someten al proceso de consulta para ofrecer a los usuarios resultados de noticias relevantes. El contenido de las noticias es intrínsecamente actual, lo que requiere que el cálculo se ejecute cada hora para generar una fuente de noticias actual que contenga contenido con un alto índice de clics previsto y que sea relevante para los usuarios. El contenido de las noticias también se clasifica en particiones por fecha, y las noticias antiguas se eliminan a diario.</p>
<h3 id="Decreasing-semantic-vector-extraction-time-from-days-to-hours" class="common-anchor-header">Reducción del tiempo de extracción de vectores semánticos de días a horas</h3><p>La recuperación de contenidos mediante vectores semánticos requiere convertir cada día decenas de millones de frases de etiquetas en vectores semánticos. Se trata de un proceso lento que tardaría días en completarse incluso cuando se ejecuta en unidades de procesamiento gráfico (GPU), que aceleran este tipo de cálculo. Para superar este problema técnico, los vectores semánticos de la incrustación anterior deben optimizarse para que, cuando aparezcan frases con etiquetas similares, se recuperen directamente los vectores semánticos correspondientes.</p>
<p>El vector semántico del conjunto existente de frases con etiquetas se almacena, y un nuevo conjunto de frases con etiquetas que se genera diariamente se codifica en vectores MinHash. La distancia de <a href="https://milvus.io/docs/v1.1.1/metric.md">Jaccard</a> se utiliza para calcular la similitud entre el vector MinHash de la nueva frase con etiqueta y el vector de frases con etiqueta guardado. Si la distancia de Jaccard supera un umbral predefinido, los dos conjuntos se consideran similares. Si se alcanza el umbral de similitud, las nuevas frases pueden aprovechar la información semántica de las incrustaciones anteriores. Las pruebas sugieren que una distancia superior a 0,8 debería garantizar una precisión suficiente para la mayoría de las situaciones.</p>
<p>Gracias a este proceso, la conversión diaria de las decenas de millones de vectores antes mencionados se reduce de días a unas dos horas. Aunque otros métodos de almacenamiento de vectores semánticos podrían ser más apropiados en función de los requisitos específicos de cada proyecto, el cálculo de la similitud entre dos frases de etiquetas mediante la distancia de Jaccard en una base de datos Milvus sigue siendo un método eficaz y preciso en una amplia variedad de escenarios.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sohu02_d50fccc538.jpg" alt="Sohu02.jpg" class="doc-image" id="sohu02.jpg" />
   </span> <span class="img-wrapper"> <span>Sohu02.jpg</span> </span></p>
<h2 id="Overcoming-bad-cases-of-short-text-classification" class="common-anchor-header">Superar los "casos malos" de la clasificación de textos breves<button data-href="#Overcoming-bad-cases-of-short-text-classification" class="anchor-icon" translate="no">
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
    </button></h2><p>A la hora de clasificar textos de noticias, los artículos breves tienen menos características para extraer que los largos. Por este motivo, los algoritmos de clasificación fallan cuando el contenido de distintas longitudes pasa por el mismo clasificador. Milvus ayuda a resolver este problema buscando varias piezas de información de clasificación de texto largo con semántica similar y puntuaciones fiables, y utilizando después un mecanismo de votación para modificar la clasificación del texto corto.</p>
<h3 id="Identifying-and-resolving-misclassified-short-text" class="common-anchor-header">Identificación y resolución de textos cortos mal clasificados</h3><p>La clasificación precisa de cada artículo de noticias es crucial para ofrecer recomendaciones de contenido útiles. Dado que los artículos de noticias breves tienen menos características, aplicar el mismo clasificador a noticias de distinta longitud da lugar a una mayor tasa de error en la clasificación de textos breves. El etiquetado humano es demasiado lento e impreciso para esta tarea, por lo que BERT-as-service y Milvus se utilizan para identificar rápidamente los textos breves mal clasificados en lotes, reclasificarlos correctamente y, a continuación, utilizar los lotes de datos como corpus para el entrenamiento contra este problema.</p>
<p>BERT-as-service se utiliza para codificar en vectores semánticos un total de cinco millones de artículos largos de noticias con una puntuación del clasificador superior a 0,9. Tras insertar los artículos de texto largo en Milvus, las noticias de texto corto se codifican en vectores semánticos. Cada vector semántico de noticias cortas se utiliza para consultar la base de datos Milvus y obtener los 20 primeros artículos de noticias largas con la mayor similitud coseno con la noticia corta objetivo. Si 18 de las 20 noticias largas con mayor similitud semántica aparecen en la misma clasificación y ésta difiere de la de la noticia corta consultada, la clasificación de la noticia corta se considera incorrecta y debe ajustarse para alinearse con los 18 artículos de noticias largas.</p>
<p>Este proceso identifica y corrige rápidamente las clasificaciones inexactas de textos cortos. Las estadísticas de muestreo aleatorio muestran que, una vez corregidas las clasificaciones de textos cortos, la precisión global de la clasificación de textos supera el 95%. Al aprovechar la clasificación del texto largo de alta confianza para corregir la clasificación del texto corto, la mayoría de los casos de clasificación errónea se corrigen en poco tiempo. Esto también ofrece un buen corpus para entrenar un clasificador de texto corto.</p>
<p>Sohu03.jpg](https://assets.zilliz.com/Sohu03_a43074cf5f.jpg "Diagrama de flujo del descubrimiento de "casos malos" de clasificación de texto corto").</p>
<h2 id="Milvus-can-power-real-time-news-content-recommendation-and-more" class="common-anchor-header">Milvus puede potenciar la recomendación de contenidos de noticias en tiempo real y mucho más<button data-href="#Milvus-can-power-real-time-news-content-recommendation-and-more" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus ha mejorado enormemente el rendimiento en tiempo real del sistema de recomendación de noticias de Sohu y también ha reforzado la eficacia de la identificación de textos cortos mal clasificados. Si está interesado en saber más sobre Milvus y sus diversas aplicaciones:</p>
<ul>
<li>Lea nuestro <a href="https://zilliz.com/blog">blog</a>.</li>
<li>Interactúe con nuestra comunidad de código abierto en <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Utilice o contribuya a la base de datos vectorial más popular del mundo en <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Pruebe y despliegue rápidamente aplicaciones de IA con nuestro nuevo <a href="https://github.com/milvus-io/bootcamp">bootcamp</a>.</li>
</ul>
