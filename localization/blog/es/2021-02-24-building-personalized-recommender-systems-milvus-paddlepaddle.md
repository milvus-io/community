---
id: building-personalized-recommender-systems-milvus-paddlepaddle.md
title: Antecedentes Introducción
author: Shiyu Chen
date: 2021-02-24T23:12:34.209Z
desc: Cómo crear un sistema de recomendación basado en aprendizaje profundo
cover: assets.zilliz.com/header_e6c4a8aee6.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-personalized-recommender-systems-milvus-paddlepaddle
---
<custom-h1>Creación de sistemas de recomendación personalizados con Milvus y PaddlePaddle</custom-h1><h2 id="Background-Introduction" class="common-anchor-header">Antecedentes Introducción<button data-href="#Background-Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Con el desarrollo continuo de la tecnología de red y la escala cada vez mayor del comercio electrónico, el número y la variedad de productos crecen rápidamente y los usuarios necesitan dedicar mucho tiempo a encontrar los productos que desean comprar. Esto supone una sobrecarga de información. Para resolver este problema surgieron los sistemas de recomendación.</p>
<p>El sistema de recomendación es un subconjunto del sistema de filtrado de información, que puede utilizarse en diversos ámbitos, como las recomendaciones de películas, música, comercio electrónico y Feed stream. El sistema de recomendación descubre las necesidades e intereses personalizados del usuario analizando y extrayendo los comportamientos del usuario, y le recomienda información o productos que pueden ser de su interés. A diferencia de los motores de búsqueda, los sistemas de recomendación no requieren que los usuarios describan con precisión sus necesidades, sino que modelan su comportamiento histórico para ofrecer de forma proactiva información que satisfaga los intereses y necesidades del usuario.</p>
<p>En este artículo utilizamos PaddlePaddle, una plataforma de aprendizaje profundo de Baidu, para construir un modelo y combinar Milvus, un motor de búsqueda de similitud vectorial, para construir un sistema de recomendación personalizado que pueda proporcionar a los usuarios información interesante de forma rápida y precisa.</p>
<h2 id="Data-Preparation" class="common-anchor-header">Preparación de datos<button data-href="#Data-Preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>Tomamos como ejemplo MovieLens Million Dataset (ml-1m) [1]. El conjunto de datos ml-1m contiene 1.000.000 de reseñas de 4.000 películas realizadas por 6.000 usuarios, recopiladas por el laboratorio de investigación GroupLens. Los datos originales incluyen datos de características de la película, características del usuario y valoración del usuario de la película, puede consultar ml-1m-README [2] .</p>
<p>El conjunto de datos ml-1m incluye 3 artículos .dat: movies.dat、users.dat y ratings.dat.movies.dat incluye las características de la película, véase el ejemplo a continuación:</p>
<pre><code translate="no">MovieID::Title::Genres
1::ToyStory(1995)::Animation|Children's|Comedy
</code></pre>
<p>Esto significa que el id de la película es 1, y el título es 《Toy Story》, que se divide en tres categorías. Estas tres categorías son animación, infantil y comedia.</p>
<p>users.dat incluye las características del usuario, véase el ejemplo a continuación:</p>
<pre><code translate="no">UserID::Gender::Age::Occupation::Zip-code
1::F::1::10::48067
</code></pre>
<p>El ID de usuario es 1, mujer y menor de 18 años. El ID de ocupación es 10.</p>
<p>ratings.dat incluye la característica de clasificación de películas, véase el ejemplo siguiente</p>
<p>UserID::MovieID::Rating::Timestamp 1::1193::5::978300760</p>
<p>Es decir, el usuario 1 valora la película 1193 con 5 puntos.</p>
<h2 id="Fusion-Recommendation-Model" class="common-anchor-header">Modelo de recomendación por fusión<button data-href="#Fusion-Recommendation-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>En el sistema de recomendación personalizada de películas utilizamos el Modelo de Recomendación por Fusión [3] que PaddlePaddle ha implementado. Este modelo está creado a partir de su práctica industrial.</p>
<p>En primer lugar, toma las características del usuario y las características de la película como entrada a la red neuronal, donde:</p>
<ul>
<li>Las características del usuario incorporan cuatro atributos de información: ID de usuario, género, ocupación y edad.</li>
<li>Las características de la película incorporan tres atributos: ID de la película, ID del tipo de película y nombre de la película.</li>
</ul>
<p>Para la función de usuario, se asigna el ID de usuario a una representación vectorial con una dimensión de 256, se introduce la capa totalmente conectada y se realiza un procesamiento similar para los otros tres atributos. A continuación, las representaciones de los cuatro atributos se conectan completamente y se añaden por separado.</p>
<p>Para las características de la película, el ID de la película se procesa de forma similar al ID de usuario. El ID del tipo de película se introduce directamente en la capa totalmente conectada en forma de vector, y el nombre de la película se representa mediante un vector de longitud fija utilizando una red neuronal convolucional de texto. A continuación, las representaciones de los tres atributos se conectan completamente y se añaden por separado.</p>
<p>Una vez obtenida la representación vectorial del usuario y la película, se calcula la similitud coseno de ambos como puntuación del sistema de recomendación personalizada. Por último, el cuadrado de la diferencia entre la puntuación de similitud y la puntuación real del usuario se utiliza como función de pérdida del modelo de regresión.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_user_film_personalized_recommender_Milvus_9ec39f501d.jpg" alt="1-user-film-personalized-recommender-Milvus.jpg" class="doc-image" id="1-user-film-personalized-recommender-milvus.jpg" />
   </span> <span class="img-wrapper"> <span>1-usuario-pelicula-recomendador-personalizado-Milvus.jpg</span> </span></p>
<h2 id="System-Overview" class="common-anchor-header">Visión general del sistema<button data-href="#System-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Combinado con el modelo de recomendación por fusión de PaddlePaddle, el vector de características de la película generado por el modelo se almacena en el motor de búsqueda de similitud vectorial Milvus, y la característica del usuario se utiliza como vector objetivo a buscar. La búsqueda de similitud se realiza en Milvus para obtener el resultado de la consulta como las películas recomendadas para el usuario.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_system_overview_5652afdca7.jpg" alt="2-system-overview.jpg" class="doc-image" id="2-system-overview.jpg" />
   </span> <span class="img-wrapper"> <span>2-system-overview.jpg</span> </span></p>
<blockquote>
<p>Milvus utiliza el método del producto interior (PI) para calcular la distancia vectorial. Después de normalizar los datos, la similitud del producto interior es coherente con el resultado de la similitud del coseno en el modelo de recomendación de fusión.</p>
</blockquote>
<h2 id="Application-of-Personal-Recommender-System" class="common-anchor-header">Aplicación del sistema de recomendación personal<button data-href="#Application-of-Personal-Recommender-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Hay tres pasos en la construcción de un sistema de recomendación personalizado con Milvus, los detalles sobre cómo operar por favor refiérase a Mivus Bootcamp [4].</p>
<h3 id="Step-1Model-Training" class="common-anchor-header">Paso 1：Entrenamiento del modelo</h3><pre><code translate="no"># run train.py
    $ python train.py
</code></pre>
<p>Ejecutando este comando se generará un modelo recommender_system.inference.model en el directorio, que puede convertir los datos de la película y los datos del usuario en vectores de características, y generar datos de aplicación para que Milvus los almacene y recupere.</p>
<h3 id="Step-2Data-Preprocessing" class="common-anchor-header">Paso 2：Preprocesamiento de datos</h3><pre><code translate="no"># Data preprocessing, -f followed by the parameter raw movie data file name
    $ python get_movies_data.py -f movies_origin.txt
</code></pre>
<p>Al ejecutar este comando se generarán datos de prueba movies_data.txt en el directorio para lograr el preprocesamiento de datos de películas.</p>
<h3 id="Step-3Implementing-Personal-Recommender-System-with-Milvus" class="common-anchor-header">Paso 3：Implementación del Sistema de Recomendación Personal con Milvus</h3><pre><code translate="no"># Implementing personal recommender system based on user conditions
    $ python infer_milvus.py -a &lt;age&gt;-g &lt;gender&gt;-j &lt;job&gt;[-i]
</code></pre>
<p>Ejecutando este comando se implementarán recomendaciones personalizadas para los usuarios especificados.</p>
<p>El proceso principal es:</p>
<ul>
<li>A través del load_inference_model, los datos de la película son procesados por el modelo para generar un vector de características de la película.</li>
<li>Cargar el vector de características de la película en Milvus a través de milvus.insert.</li>
<li>De acuerdo con la edad / sexo / ocupación del usuario especificada por los parámetros, se convierte en un vector de características del usuario, milvus.search_vectors se utiliza para la recuperación de similitudes, y se devuelve el resultado con la mayor similitud entre el usuario y la película.</li>
</ul>
<p>Predicción de las cinco películas que más interesan al usuario:</p>
<pre><code translate="no">TopIdsTitleScore
03030Yojimbo2.9444923996925354
13871Shane2.8583481907844543
23467Hud2.849525213241577
31809Hana-bi2.826111316680908
43184Montana2.8119677305221558 
</code></pre>
<h2 id="Summary" class="common-anchor-header">Resumen<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Al introducir la información del usuario y la de la película en el modelo de recomendación por fusión, podemos obtener puntuaciones de coincidencia y, a continuación, ordenar las puntuaciones de todas las películas en función del usuario para recomendarle películas que puedan interesarle. <strong>Este artículo combina Milvus y PaddlePaddle para construir un sistema de recomendación personalizado. Milvus, un motor de búsqueda vectorial, se utiliza para almacenar todos los datos de las características de las películas y, a continuación, la recuperación de similitudes se realiza sobre las características del usuario en Milvus.</strong> El resultado de la búsqueda es la clasificación de películas recomendada por el sistema al usuario.</p>
<p>El motor de búsqueda de similitud vectorial Milvus [5] es compatible con varias plataformas de aprendizaje profundo, y busca miles de millones de vectores con una respuesta de tan solo milisegundos. Puede explorar más posibilidades de aplicaciones de IA con Milvus con facilidad.</p>
<h2 id="Reference" class="common-anchor-header">Referencia<button data-href="#Reference" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>MovieLens Million Dataset (ml-1m): http://files.grouplens.org/datasets/movielens/ml-1m.zip</li>
<li>ml-1m-README: http://files.grouplens.org/datasets/movielens/ml-1m-README.txt</li>
<li>Modelo de Recomendación de Fusión por PaddlePaddle: https://www.paddlepaddle.org.cn/documentation/docs/zh/beginners_guide/basics/recommender_system/index.html#id7</li>
<li>Bootcamp: https://github.com/milvus-io/bootcamp/tree/master/solutions/recommendation_system</li>
<li>Milvus: https://milvus.io/</li>
</ol>
