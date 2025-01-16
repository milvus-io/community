---
id: optimizing-billion-scale-image-search-milvus-part-1.md
title: Visión general
author: Rife Wang
date: 2020-08-04T20:39:09.882Z
desc: >-
  Un estudio de caso con UPYUN. Descubra cómo Milvus se desmarca de las
  soluciones tradicionales de bases de datos y ayuda a crear un sistema de
  búsqueda por similitud de imágenes.
cover: assets.zilliz.com/header_23bbd76c8b.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-1'
---
<custom-h1>El viaje hacia la optimización de la búsqueda de imágenes a escala de miles de millones (1/2)</custom-h1><p>Yupoo Picture Manager da servicio a decenas de millones de usuarios y gestiona decenas de miles de millones de imágenes. Como su galería de usuarios es cada vez mayor, Yupoo necesita urgentemente una solución que pueda localizar rápidamente la imagen. En otras palabras, cuando un usuario introduce una imagen, el sistema debe encontrar su imagen original e imágenes similares en la galería. El desarrollo del servicio de búsqueda por imagen proporciona un enfoque eficaz a este problema.</p>
<p>El servicio de búsqueda por imagen ha experimentado dos evoluciones:</p>
<ol>
<li>Comenzó la primera investigación técnica a principios de 2019 y lanzó el sistema de primera generación en marzo y abril de 2019;</li>
<li>Comenzó la investigación del plan de actualización a principios de 2020 y comenzó la actualización general al sistema de segunda generación en abril de 2020.</li>
</ol>
<p>Este artículo describe la selección de la tecnología y los principios básicos en los que se basan las dos generaciones del sistema de búsqueda por imágenes a partir de mi propia experiencia en este proyecto.</p>
<h2 id="Overview" class="common-anchor-header">Visión general<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="What-is-an-image" class="common-anchor-header">¿Qué es una imagen?</h3><p>Debemos saber qué es una imagen antes de tratar con imágenes.</p>
<p>La respuesta es que una imagen es una colección de píxeles.</p>
<p>Por ejemplo, la parte del recuadro rojo de esta imagen es prácticamente una serie de píxeles.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_what_is_an_image_021e0280cc.png" alt="1-what-is-an-image.png" class="doc-image" id="1-what-is-an-image.png" />
   </span> <span class="img-wrapper"> <span>1-que-es-una-imagen.png</span> </span></p>
<p>Supongamos que la parte del recuadro rojo es una imagen, entonces cada cuadradito independiente de la imagen es un píxel, la unidad básica de información. Entonces, el tamaño de la imagen es 11 x 11 px.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_what_is_an_image_602a91b4a0.png" alt="2-what-is-an-image.png" class="doc-image" id="2-what-is-an-image.png" />
   </span> <span class="img-wrapper"> <span>2-que-es-una-imagen.png</span> </span></p>
<h3 id="Mathematical-representation-of-images" class="common-anchor-header">Representación matemática de las imágenes</h3><p>Cada imagen puede representarse mediante una matriz. Cada píxel de la imagen corresponde a un elemento de la matriz.</p>
<h3 id="Binary-images" class="common-anchor-header">Imágenes binarias</h3><p>Los píxeles de una imagen binaria son blancos o negros, por lo que cada píxel puede representarse por 0 o 1. Por ejemplo, la representación matricial de una imagen binaria de 4 * 4 es:</p>
<pre><code translate="no">0 1 0 1
1 0 0 0
1 1 1 0
0 0 1 0
</code></pre>
<h3 id="RGB-images" class="common-anchor-header">Imágenes RGB</h3><p>Los tres colores primarios (rojo, verde y azul) pueden mezclarse para producir cualquier color. Para las imágenes RGB, cada píxel tiene la información básica de tres canales RGB. Del mismo modo, si cada canal utiliza un número de 8 bits (en 256 niveles) para representar su escala de grises, entonces la representación matemática de un píxel es:</p>
<pre><code translate="no">([0 .. 255], [0 .. 255], [0 .. 255])
</code></pre>
<p>Tomando como ejemplo una imagen RGB de 4 * 4:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_4_x_4_rgb_image_136cec77ce.png" alt="3-4-x-4-rgb-image.png" class="doc-image" id="3-4-x-4-rgb-image.png" />
   </span> <span class="img-wrapper"> <span>3-4-x-4-rgb-image.png</span> </span></p>
<p>La esencia del tratamiento de imágenes es procesar estas matrices de píxeles.</p>
<h2 id="The-technical-problem-of-search-by-image" class="common-anchor-header">El problema técnico de la búsqueda por imagen<button data-href="#The-technical-problem-of-search-by-image" class="anchor-icon" translate="no">
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
    </button></h2><p>Si busca la imagen original, es decir, una imagen con exactamente los mismos píxeles, puede comparar directamente sus valores MD5. Sin embargo, las imágenes que se suben a Internet suelen estar comprimidas o con marcas de agua. Incluso un pequeño cambio en una imagen puede crear un resultado MD5 diferente. Mientras haya inconsistencia en los píxeles, es imposible encontrar la imagen original.</p>
<p>Para un sistema de búsqueda por imagen, queremos buscar imágenes con contenido similar. Entonces, tenemos que resolver dos problemas básicos:</p>
<ul>
<li>Representar o abstraer una imagen como un formato de datos que pueda ser procesado por un ordenador.</li>
<li>Los datos deben ser comparables para el cálculo.</li>
</ul>
<p>Más concretamente, necesitamos las siguientes características:</p>
<ul>
<li>Extracción de características de la imagen.</li>
<li>Cálculo de características (cálculo de similitudes).</li>
</ul>
<h2 id="The-first-generation-search-by-image-system" class="common-anchor-header">El sistema de búsqueda por imágenes de primera generación<button data-href="#The-first-generation-search-by-image-system" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Feature-extraction--image-abstraction" class="common-anchor-header">Extracción de características - abstracción de imágenes</h3><p>El sistema de búsqueda por imágenes de primera generación utiliza el algoritmo Perceptual hash o pHash para la extracción de características. ¿Cuáles son los fundamentos de este algoritmo?</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_first_generation_image_search_ffd7088158.png" alt="4-first-generation-image-search.png" class="doc-image" id="4-first-generation-image-search.png" />
   </span> <span class="img-wrapper"> <span>4-búsqueda-de-imágenes-de-primera-generación.png</span> </span></p>
<p>Como se muestra en la figura anterior, el algoritmo pHash realiza una serie de transformaciones en la imagen para obtener el valor hash. Durante el proceso de transformación, el algoritmo abstrae continuamente las imágenes, acercando así los resultados de imágenes similares.</p>
<h3 id="Feature-calculation--similarity-calculation" class="common-anchor-header">Cálculo de características - cálculo de similitud</h3><p>¿Cómo calcular la similitud entre los valores hash de dos imágenes? La respuesta es utilizar la distancia de Hamming. Cuanto menor sea la distancia de Hamming, más similar será el contenido de las imágenes.</p>
<p>¿Qué es la distancia de Hamming? Es el número de bits diferentes.</p>
<p>Por ejemplo,</p>
<pre><code translate="no">Value 1： 0 1 0 1 0
Value 2： 0 0 0 1 1
</code></pre>
<p>Hay dos bits diferentes en los dos valores anteriores, por lo que la distancia Hamming entre ellos es 2.</p>
<p>Ahora ya conocemos el principio del cálculo de la similitud. La siguiente pregunta es, ¿cómo calcular las distancias Hamming de 100 millones de datos a partir de 100 millones de imágenes? En resumen, ¿cómo buscar imágenes similares?</p>
<p>En la fase inicial del proyecto, no encontré una herramienta satisfactoria (o un motor informático) que pudiera calcular rápidamente la distancia de Hamming. Así que cambié de plan.</p>
<p>Mi idea es que si la distancia de Hamming de dos valores pHash es pequeña, entonces puedo cortar los valores pHash y es probable que las partes pequeñas correspondientes sean iguales.</p>
<p>Por ejemplo:</p>
<pre><code translate="no">Value 1： 8 a 0 3 0 3 f 6
Value 2： 8 a 0 3 0 3 d 8
</code></pre>
<p>Dividimos los dos valores anteriores en ocho segmentos y los valores de seis segmentos son exactamente iguales. Se puede deducir que su distancia Hamming es cercana y por lo tanto estas dos imágenes son similares.</p>
<p>Tras la transformación, se puede comprobar que el problema del cálculo de la distancia de Hamming se ha convertido en un problema de equivalencia de coincidencias. Si divido cada valor pHash en ocho segmentos, mientras haya más de cinco segmentos que tengan exactamente los mismos valores, entonces los dos valores pHash son similares.</p>
<p>Por lo tanto, es muy sencillo resolver el emparejamiento de equivalencias. Podemos utilizar el filtrado clásico de un sistema de base de datos tradicional.</p>
<p>Por supuesto, yo utilizo la concordancia multitérmino y especifico el grado de concordancia utilizando minimum_should_match en ElasticSearch (este artículo no introduce el principio de ES, puedes aprenderlo por ti mismo).</p>
<p>¿Por qué elegimos ElasticSearch? En primer lugar, proporciona la función de búsqueda antes mencionada. En segundo lugar, el proyecto de gestor de imágenes en sí mismo está utilizando ES para proporcionar una función de búsqueda de texto completo y es muy económico utilizar los recursos existentes.</p>
<h2 id="Summary-of-the-first-generation-system" class="common-anchor-header">Resumen del sistema de primera generación<button data-href="#Summary-of-the-first-generation-system" class="anchor-icon" translate="no">
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
    </button></h2><p>El sistema de búsqueda por imágenes de primera generación opta por la solución pHash + ElasticSearch, que presenta las siguientes características:</p>
<ul>
<li>El algoritmo pHash es sencillo de utilizar y puede resistir cierto grado de compresión, marca de agua y ruido.</li>
<li>ElasticSearch utiliza los recursos existentes del proyecto sin añadir costes adicionales a la búsqueda.</li>
<li>Pero la limitación de este sistema es obvia: el algoritmo pHash es una representación abstracta de toda la imagen. Una vez que destruimos la integridad de la imagen, por ejemplo añadiendo un borde negro a la imagen original, es casi imposible juzgar la similitud entre el original y los demás.</li>
</ul>
<p>Para superar estas limitaciones, surgió el sistema de búsqueda de imágenes de segunda generación con una tecnología subyacente completamente distinta.</p>
<p>Este artículo ha sido escrito por rifewang, usuario de Milvus e ingeniero de software de UPYUN. Si te gusta este artículo, ¡ven a saludarnos! https://github.com/rifewang</p>
