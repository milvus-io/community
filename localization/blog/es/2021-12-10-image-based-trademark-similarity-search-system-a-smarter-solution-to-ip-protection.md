---
id: >-
  2021-12-10-image-based-trademark-similarity-search-system-a-smarter-solution-to-ip-protection.md
title: >-
  Milvus en la protección de la PI：Creación de un sistema de búsqueda de
  similitud de marcas con Milvus
author: Zilliz
date: 2021-12-10T00:00:00.000Z
desc: >-
  Aprenda a aplicar la búsqueda de similitud vectorial en el sector de la
  protección de la propiedad intelectual.
cover: assets.zilliz.com/IP_protection_0a33547579.png
tag: Scenarios
---
<p>En los últimos años, la cuestión de la protección de la propiedad intelectual se ha convertido en el centro de atención a medida que aumenta la concienciación de la gente sobre la infracción de la propiedad intelectual. En particular, el gigante multinacional de la tecnología Apple Inc. ha <a href="https://en.wikipedia.org/wiki/Apple_Inc._litigation">presentado</a> activamente <a href="https://en.wikipedia.org/wiki/Apple_Inc._litigation">demandas contra varias empresas por infracción de la propiedad intelectual</a>, incluida la infracción de marcas, patentes y diseños. Aparte de esos casos más notorios, Apple Inc. también <a href="https://www.smh.com.au/business/apple-bites-over-woolworths-logo-20091005-ghzr.html">impugnó</a> en 2009 <a href="https://www.smh.com.au/business/apple-bites-over-woolworths-logo-20091005-ghzr.html">una solicitud de marca de Woolworths Limited</a>, una cadena de supermercados australiana, por infracción de marca.  Apple. Inc argumentó que el logotipo de la marca australiana, una &quot;w&quot; estilizada, se parece a su propio logotipo de una manzana. Por ello, Apple Inc. se opuso a la gama de productos, incluidos aparatos electrónicos, que Woolworths solicitó vender con el logotipo. La historia termina con Woolworths modificando su logotipo y Apple retirando su oposición.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Logo_of_Woolworths_b04ece5b20.png" alt="Logo of Woolworths.png" class="doc-image" id="logo-of-woolworths.png" />
   </span> <span class="img-wrapper"> <span>Logotipo de Woolworths.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Logo_of_Apple_Inc_181e5bd5f8.png" alt="Logo of Apple Inc.png" class="doc-image" id="logo-of-apple-inc.png" />
   </span> <span class="img-wrapper"> <span>Logotipo de Apple Inc.png</span> </span></p>
<p>Con la creciente concienciación sobre la cultura de marca, las empresas vigilan más de cerca cualquier amenaza que perjudique sus derechos de propiedad intelectual (PI). La infracción de la PI incluye</p>
<ul>
<li>Infracción de los derechos de autor</li>
<li>Infracción de patentes</li>
<li>Infracción de marcas</li>
<li>Infracción de diseños</li>
<li>Ciberocupación</li>
</ul>
<p>El mencionado litigio entre Apple y Woolworths se debe principalmente a una infracción de marca, precisamente por la similitud entre las imágenes de marca de ambas entidades. Para evitar convertirse en otro Woolworths, una búsqueda exhaustiva de similitudes de marcas es un paso crucial para los solicitantes, tanto antes de la presentación como durante la revisión de las solicitudes de marca. El recurso más habitual es realizar una búsqueda en la <a href="https://tmsearch.uspto.gov/search/search-information">base de datos de la Oficina de Patentes y Marcas de los Estados Unidos (USPTO</a> ), que contiene todos los registros y solicitudes de marca activos e inactivos. A pesar de que la interfaz de usuario no es muy atractiva, este proceso de búsqueda también es muy defectuoso por su naturaleza basada en texto, ya que se basa en palabras y códigos de diseño de marcas (que son etiquetas de características de diseño anotadas a mano) para buscar imágenes.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_8_b2fff6ca11.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>Este artículo pretende mostrar cómo construir un sistema eficaz de búsqueda de similitudes de marcas basado en imágenes utilizando <a href="https://milvus.io">Milvus</a>, una base de datos vectorial de código abierto.</p>
<h2 id="A-vector-similarity-search-system-for-trademarks" class="common-anchor-header">Un sistema de búsqueda vectorial de marcas similares<button data-href="#A-vector-similarity-search-system-for-trademarks" class="anchor-icon" translate="no">
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
    </button></h2><p>Para crear un sistema de búsqueda de similitudes vectoriales para marcas comerciales, es necesario seguir los siguientes pasos:</p>
<ol>
<li>Preparar un conjunto de datos masivo de logotipos. Es probable que el sistema pueda utilizar un conjunto de datos como <a href="https://developer.uspto.gov/product/trademark-24-hour-box-and-supplemental">éste</a>,).</li>
<li>Entrenar un modelo de extracción de características de imagen utilizando el conjunto de datos y modelos basados en datos o algoritmos de IA.</li>
<li>Convertir los logotipos en vectores utilizando el modelo o algoritmo entrenado en el paso 2.</li>
<li>Almacenar los vectores y realizar búsquedas de similitud de vectores en Milvus, la base de datos de vectores de código abierto.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/trademark_system_e9700df555.png" alt="Nike.png" class="doc-image" id="nike.png" />
   </span> <span class="img-wrapper"> <span>Nike.png</span> </span></p>
<p>En las siguientes secciones, vamos a examinar más de cerca los dos pasos principales en la construcción de un sistema de búsqueda de similitud vectorial para marcas: el uso de modelos de IA para la extracción de características de imagen, y el uso de Milvus para la búsqueda de similitud vectorial. En nuestro caso, utilizamos VGG16, una red neuronal convolucional (CNN), para extraer características de imagen y convertirlas en vectores de incrustación.</p>
<h3 id="Using-VGG16-for-image-feature-extraction" class="common-anchor-header">Uso de VGG16 para la extracción de características de imagen</h3><p><a href="https://medium.com/@mygreatlearning/what-is-vgg16-introduction-to-vgg16-f2d63849f615">VGG16</a> es una CNN diseñada para el reconocimiento de imágenes a gran escala. El modelo es rápido y preciso en el reconocimiento de imágenes y puede aplicarse a imágenes de todos los tamaños. A continuación se muestran dos ilustraciones de la arquitectura de VGG16.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vgg16_layers_9e621f62cc.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vgg16_architecture_992614e882.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<p>El modelo VGG16, como su nombre indica, es una CNN con 16 capas. Todos los modelos VGG, incluidos VGG16 y VGG19, contienen 5 bloques VGG, con una o más capas convolucionales en cada bloque VGG. Y al final de cada bloque, se conecta una capa de agrupación máxima para reducir el tamaño de la imagen de entrada. El número de núcleos es equivalente en cada capa convolucional, pero se duplica en cada bloque VGG. Por lo tanto, el número de núcleos del modelo pasa de 64 en el primer bloque a 512 en el cuarto y quinto. Todos los kernels convolucionales<em>tienen un tamaño de 33, mientras que los kernels de agrupación tienen todos un tamaño de 22</em>. Esto favorece la conservación de los datos. Esto permite conservar más información sobre la imagen de entrada.</p>
<p>Por lo tanto, VGG16 es un modelo adecuado para el reconocimiento de imágenes de conjuntos de datos masivos en este caso. Puede utilizar Python, Tensorflow y Keras para entrenar un modelo de extracción de características de imagen basado en VGG16.</p>
<h3 id="Using-Milvus-for-vector-similarity-search" class="common-anchor-header">Uso de Milvus para la búsqueda de similitud vectorial</h3><p>Después de usar el modelo VGG16 para extraer características de imagen y convertir imágenes de logotipos en vectores de incrustación, necesita buscar vectores similares en un conjunto de datos masivo.</p>
<p>Milvus es una base de datos nativa de la nube que ofrece una gran escalabilidad y elasticidad. Además, como base de datos, puede garantizar la coherencia de los datos. Para un sistema de búsqueda de similitudes de marcas como este, los nuevos datos, como los últimos registros de marcas, se cargan en el sistema en tiempo real. Y estos datos recién cargados deben estar disponibles inmediatamente para la búsqueda. Por lo tanto, este artículo adopta Milvus, la base de datos vectorial de código abierto, para llevar a cabo la búsqueda de similitud vectorial.</p>
<p>Al insertar los vectores de logotipos, puede crear colecciones en Milvus para diferentes tipos de vectores de logotipos según la <a href="https://en.wikipedia.org/wiki/International_(Nice)_Classification_of_Goods_and_Services">Clasificación Internacional (de Niza) de Productos y Servicios</a>, un sistema de clasificación de productos y servicios para el registro de marcas. Por ejemplo, puede insertar un grupo de vectores de logotipos de marcas de ropa en una colección denominada &quot;ropa&quot; en Milvus e insertar otro grupo de vectores de logotipos de marcas tecnológicas en otra colección denominada &quot;tecnología&quot;. De este modo, puede aumentar enormemente la eficacia y la velocidad de su búsqueda de similitud vectorial.</p>
<p>Milvus no sólo admite múltiples índices para la búsqueda de similitud vectorial, sino que también proporciona API y herramientas enriquecidas para facilitar DevOps. El siguiente diagrama ilustra la <a href="https://milvus.io/docs/v2.0.x/architecture_overview.md">arquitectura de Milvus</a>. Puede obtener más información sobre Milvus leyendo su <a href="https://milvus.io/docs/v2.0.x/overview.md">introducción</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ea45a5ab53.png" alt="11.png" class="doc-image" id="11.png" />
   </span> <span class="img-wrapper"> <span>11.png</span> </span></p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">¿Busca más recursos?<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p>Construya más sistemas de búsqueda de similitud vectorial para otros escenarios de aplicación con Milvus:</p>
<ul>
<li><a href="https://milvus.io/blog/dna-sequence-classification-based-on-milvus.md">Clasificación de secuencias de ADN basada en Milvus</a></li>
<li><a href="https://milvus.io/blog/audio-retrieval-based-on-milvus.md">Recuperación de audio basada en Milvus</a></li>
<li><a href="https://milvus.io/blog/building-video-search-system-with-milvus.md">4 pasos para crear un sistema de búsqueda de vídeo</a></li>
<li><a href="https://milvus.io/blog/building-intelligent-chatbot-with-nlp-and-milvus.md">Creación de un sistema inteligente de control de calidad con NLP y Milvus</a></li>
<li><a href="https://milvus.io/blog/molecular-structure-similarity-with-milvus.md">Acelerar el descubrimiento de nuevos fármacos</a></li>
</ul></li>
<li><p>Participe en nuestra comunidad de código abierto:</p>
<ul>
<li>Encuentre o contribuya a Milvus en <a href="https://bit.ly/307b7jC">GitHub</a>.</li>
<li>Interactúe con la comunidad a través <a href="https://bit.ly/3qiyTEk">del Foro</a>.</li>
<li>Conéctese con nosotros en <a href="https://bit.ly/3ob7kd8">Twitter</a>.</li>
</ul></li>
</ul>
