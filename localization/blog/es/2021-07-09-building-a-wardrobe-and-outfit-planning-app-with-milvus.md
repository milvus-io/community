---
id: building-a-wardrobe-and-outfit-planning-app-with-milvus.md
title: Visión general del sistema
author: Yu Fang
date: 2021-07-09T06:30:06.439Z
desc: >-
  Descubra cómo Mozat utiliza Milvus, una base de datos vectorial de código
  abierto, para impulsar una aplicación de moda que ofrece recomendaciones de
  estilo personalizadas y un sistema de búsqueda de imágenes.
cover: assets.zilliz.com/mozat_blog_0ea9218c71.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-wardrobe-and-outfit-planning-app-with-milvus
---
<custom-h1>Creación de una aplicación de planificación de vestuario y atuendos con Milvus</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_1_5f239a8d48.png" alt="stylepedia-1.png" class="doc-image" id="stylepedia-1.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-1.png</span> </span></p>
<p>Fundada en 2003, <a href="http://www.mozat.com/home">Mozat</a> es una empresa emergente con sede en Singapur y oficinas en China y Arabia Saudí. La empresa está especializada en la creación de aplicaciones para redes sociales, comunicación y estilo de vida. <a href="https://stylepedia.com/">Stylepedia</a> es una aplicación de vestuario creada por Mozat que ayuda a los usuarios a descubrir nuevos estilos y a conectar con otros apasionados de la moda. Sus principales características son la posibilidad de crear un armario digital, recomendaciones de estilo personalizadas, funciones de redes sociales y una herramienta de búsqueda de imágenes para encontrar artículos similares a los que se ven en Internet o en la vida real.</p>
<p>El sistema de búsqueda de imágenes de Stylepedia se basa en<a href="https://milvus.io">Milvus</a>. La aplicación maneja tres tipos de imágenes: imágenes de usuario, imágenes de producto y fotografías de moda. Cada imagen puede incluir uno o más elementos, lo que complica aún más cada consulta. Para ser útil, un sistema de búsqueda de imágenes debe ser preciso, rápido y estable, características que sientan una sólida base técnica para añadir nuevas funcionalidades a la aplicación, como sugerencias de atuendos y recomendaciones de contenidos de moda.</p>
<h2 id="System-overview" class="common-anchor-header">Visión general del sistema<button data-href="#System-overview" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_system_process_8e7e2ab3e4.png" alt="stylepedia-system-process.png" class="doc-image" id="stylepedia-system-process.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-sistema-proceso.png</span> </span></p>
<p>El sistema de búsqueda de imágenes se divide en componentes offline y online.</p>
<p>Fuera de línea, las imágenes se vectorizan y se insertan en una base de datos vectorial (Milvus). En el flujo de trabajo de datos, las imágenes de productos y fotografías de moda relevantes se convierten en vectores de características de 512 dimensiones mediante modelos de detección de objetos y extracción de características. A continuación, los datos vectoriales se indexan y se añaden a la base de datos vectorial.</p>
<p>En línea, se consulta la base de datos de imágenes y se devuelven al usuario imágenes similares. Al igual que en el componente fuera de línea, una imagen consultada se procesa mediante modelos de detección de objetos y extracción de características para obtener un vector de características. A partir del vector de características, Milvus busca vectores similares TopK y obtiene sus correspondientes ID de imagen. Por último, tras el posprocesamiento (filtrado, clasificación, etc.), se obtiene una colección de imágenes similares a la imagen de consulta.</p>
<h2 id="Implementation" class="common-anchor-header">Implementación<button data-href="#Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>La aplicación se divide en cuatro módulos:</p>
<ol>
<li>Detección de prendas</li>
<li>Extracción de características</li>
<li>Búsqueda de vectores de similitud</li>
<li>Tratamiento posterior</li>
</ol>
<h3 id="Garment-detection" class="common-anchor-header">Detección de prendas</h3><p>En el módulo de detección de prendas, se utiliza <a href="https://pytorch.org/hub/ultralytics_yolov5/">YOLOv5</a>, un marco de detección de objetivos de una etapa basado en anclajes, como modelo de detección de objetos por su pequeño tamaño y su inferencia en tiempo real. Ofrece cuatro tamaños de modelo (YOLOv5s/m/l/x), y cada tamaño específico tiene pros y contras. Los modelos más grandes ofrecen mejores resultados (mayor precisión), pero requieren mucha más potencia de cálculo y son más lentos. Como en este caso los objetos son relativamente grandes y fáciles de detectar, basta con el modelo más pequeño, YOLOv5s.</p>
<p>Las prendas de ropa de cada imagen se reconocen y recortan para que sirvan como entradas del modelo de extracción de características utilizado en el procesamiento posterior. Simultáneamente, el modelo de detección de objetos también predice la clasificación de las prendas según clases predefinidas (tops, prendas exteriores, pantalones, faldas, vestidos y peleles).</p>
<h3 id="Feature-extraction" class="common-anchor-header">Extracción de características</h3><p>La clave de la búsqueda de similitudes es el modelo de extracción de características. Las imágenes de prendas recortadas se incrustan en vectores de coma flotante de 512 dimensiones que representan sus atributos en un formato de datos numéricos legibles por máquina. Se adopta la metodología de <a href="https://github.com/Joon-Park92/Survey_of_Deep_Metric_Learning">aprendizaje métrico profundo (DML</a> ) con <a href="https://arxiv.org/abs/1905.11946">EfficientNet</a> como modelo troncal.</p>
<p>El aprendizaje métrico tiene como objetivo entrenar un módulo de extracción de características no lineal basado en CNN (o un codificador) para reducir la distancia entre los vectores de características correspondientes a la misma clase de muestras, y aumentar la distancia entre los vectores de características correspondientes a diferentes clases de muestras. En este escenario, la misma clase de muestras se refiere a la misma prenda de ropa.</p>
<p>EfficientNet tiene en cuenta tanto la velocidad como la precisión a la hora de escalar uniformemente la anchura, la profundidad y la resolución de la red. EfficientNet-B4 se utiliza como red de extracción de características, y la salida de la última capa totalmente conectada son las características de imagen necesarias para realizar la búsqueda de similitud vectorial.</p>
<h3 id="Vector-similarity-search" class="common-anchor-header">Búsqueda de similitudes vectoriales</h3><p>Milvus es una base de datos vectorial de código abierto que admite operaciones de creación, lectura, actualización y eliminación (CRUD), así como búsquedas casi en tiempo real en conjuntos de datos de billones de bytes. En Stylepedia, se utiliza para la búsqueda de similitudes vectoriales a gran escala porque es altamente elástica, estable, fiable y rapidísima. Milvus amplía las capacidades de bibliotecas de índices vectoriales ampliamente utilizadas (Faiss, NMSLIB, Annoy, etc.) y proporciona un conjunto de API sencillas e intuitivas que permiten a los usuarios seleccionar el tipo de índice ideal para un escenario determinado.</p>
<p>Dados los requisitos del escenario y la escala de los datos, los desarrolladores de Stylepedia utilizaron la distribución de Milvus sólo para CPU emparejada con el índice HNSW. Se han creado dos colecciones indexadas, una para productos y otra para fotografías de moda, para alimentar diferentes funcionalidades de la aplicación. Cada colección se divide a su vez en seis particiones basadas en los resultados de detección y clasificación para reducir el alcance de la búsqueda. Milvus realiza búsquedas en decenas de millones de vectores en milisegundos, proporcionando un rendimiento óptimo al tiempo que mantiene bajos los costes de desarrollo y minimiza el consumo de recursos.</p>
<h3 id="Post-processing" class="common-anchor-header">Postprocesamiento</h3><p>Para mejorar la similitud entre los resultados de la recuperación de imágenes y la imagen de consulta, utilizamos el filtrado por colores y el filtrado por etiquetas clave (longitud de las mangas, longitud de la ropa, estilo del cuello, etc.) para filtrar las imágenes no aptas. Además, se utiliza un algoritmo de evaluación de la calidad de la imagen para asegurarse de que las imágenes de mayor calidad se presentan primero a los usuarios.</p>
<h2 id="Application" class="common-anchor-header">Aplicación<button data-href="#Application" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="User-uploads-and-image-search" class="common-anchor-header">Subida de imágenes por el usuario y búsqueda</h3><p>Los usuarios pueden hacer fotos de su propia ropa y subirlas a su armario digital de Stylepedia para, a continuación, recuperar las imágenes de productos más parecidas a las que han subido.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_search_results_0568e20dc0.png" alt="stylepedia-search-results.png" class="doc-image" id="stylepedia-search-results.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-búsqueda-resultados.png</span> </span></p>
<h3 id="Outfit-suggestions" class="common-anchor-header">Sugerencias de conjuntos</h3><p>Al realizar una búsqueda de similitudes en la base de datos de Stylepedia, los usuarios pueden encontrar fotografías de moda que contengan un artículo de moda específico. Puede tratarse de una prenda nueva que alguien esté pensando en comprar o de algo de su propia colección que podría llevarse o combinarse de forma diferente. A continuación, mediante la agrupación de las prendas con las que suele combinarse, se generan sugerencias de conjuntos. Por ejemplo, una chaqueta negra de motorista puede combinar con una gran variedad de prendas, como unos vaqueros pitillo negros. A continuación, los usuarios pueden consultar fotografías de moda relevantes en las que se produzca esta combinación en la fórmula seleccionada.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_jacket_outfit_e84914da9e.png" alt="stylepedia-jacket-outfit.png" class="doc-image" id="stylepedia-jacket-outfit.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-chaqueta-outfit.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_jacket_snapshot_25f53cc09b.png" alt="stylepedia-jacket-snapshot.png" class="doc-image" id="stylepedia-jacket-snapshot.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-chaqueta-snapshot.png</span> </span></p>
<h3 id="Fashion-photograph-recommendations" class="common-anchor-header">Recomendaciones de fotografías de moda</h3><p>Basándose en el historial de navegación de un usuario, sus gustos y el contenido de su armario digital, el sistema calcula la similitud y ofrece recomendaciones personalizadas de fotografías de moda que pueden ser de su interés.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_user_wardrobe_6770c856b9.png" alt="stylepedia-user-wardrobe.png" class="doc-image" id="stylepedia-user-wardrobe.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-usuario-armario.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_streetsnap_rec_901601a34d.png" alt="stylepedia-streetsnap-rec.png" class="doc-image" id="stylepedia-streetsnap-rec.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-streetsnap-rec.png</span> </span></p>
<p>Mediante la combinación de metodologías de aprendizaje profundo y visión por ordenador, Mozat fue capaz de construir un sistema de búsqueda de similitud de imágenes rápido, estable y preciso utilizando Milvus para potenciar varias funciones de la app Stylepedia.</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">No sea un extraño<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
<li>Encuentre o contribuya a Milvus en <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Interactúe con la comunidad a través de <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Conéctese con nosotros en <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
