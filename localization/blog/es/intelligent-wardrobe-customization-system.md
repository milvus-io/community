---
id: intelligent-wardrobe-customization-system.md
title: >-
  Creación de un sistema inteligente de personalización de vestuario basado en
  la base de datos vectorial Milvus
author: Yiyun Ni
date: 2022-07-08T00:00:00.000Z
desc: >-
  Utilizar la tecnología de búsqueda por similitud para liberar el potencial de
  los datos no estructurados, ¡incluso como los armarios y sus componentes!
cover: assets.zilliz.com/Frame_1282_edc1fb7d99.png
tag: Engineering
tags: >-
  Data science, Database, Use Cases of Milvus, Artificial Intelligence, Vector
  Management
canonicalUrl: 'https://milvus.io/blog/intelligent-wardrobe-customization-system.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1282_edc1fb7d99.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>imagen de portada</span> </span></p>
<p>Si busca un armario que encaje perfectamente en su dormitorio o vestidor, seguro que la mayoría piensa en los hechos a medida. Sin embargo, no todo el mundo dispone de tanto presupuesto. Entonces, ¿qué pasa con los ya hechos? El problema de este tipo de armarios es que probablemente no cumplan tus expectativas, ya que no son lo bastante flexibles como para adaptarse a tus necesidades específicas de almacenamiento. Además, al buscar en Internet, es bastante difícil resumir con palabras clave el tipo concreto de armario que está buscando. Es muy probable que la palabra clave que escriba en el cuadro de búsqueda (p. ej., Un armario con bandeja para joyas) sea muy diferente de cómo se define en el motor de búsqueda (p. ej., Un armario con <a href="https://www.ikea.com/us/en/p/komplement-pull-out-tray-with-insert-black-brown-s79249366/">bandeja extraíble con inserción</a>).</p>
<p>Pero gracias a las nuevas tecnologías, ¡hay una solución! IKEA, el conglomerado minorista de muebles, ofrece una popular herramienta de diseño de <a href="https://www.ikea.com/us/en/rooms/bedroom/how-to/how-to-design-your-perfect-pax-wardrobe-pub8b76dda0">armarios PAX</a> que permite a los usuarios elegir entre una serie de armarios ya hechos y personalizar el color, el tamaño y el diseño interior de los mismos. Tanto si necesita espacio para colgar, como múltiples estantes o cajones interiores, este sistema inteligente de personalización de armarios siempre puede satisfacer sus necesidades.</p>
<p>Para encontrar o construir su armario ideal utilizando este sistema inteligente de diseño de armarios, es necesario:</p>
<ol>
<li>Especificar los requisitos básicos: la forma (normal, en L o en U), la longitud y la profundidad del armario.</li>
<li>Especificar sus necesidades de almacenamiento y la organización interior del armario (por ejemplo, si necesita espacio para colgar, un pantalonero extraíble, etc.).</li>
<li>Añada o elimine partes del armario, como cajones o estantes.</li>
</ol>
<p>A continuación, su diseño se ha completado. Fácil y sencillo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Pax_system_ff4c3fa182.png" alt="pax system" class="doc-image" id="pax-system" />
   </span> <span class="img-wrapper"> <span>sistema pax</span> </span></p>
<p>Un componente muy importante que hace posible este sistema de diseño de armarios es la <a href="https://zilliz.com/learn/what-is-vector-database">base de datos vectorial</a>. Por lo tanto, este artículo pretende presentar el flujo de trabajo y las soluciones de búsqueda de similitudes utilizadas para construir un sistema inteligente de personalización de armarios basado en la búsqueda de similitudes vectoriales.</p>
<p>Ir a:</p>
<ul>
<li><a href="#System-overview">Visión general del sistema</a></li>
<li><a href="#Data-flow">Flujo de datos</a></li>
<li><a href="#System-demo">Demostración del sistema</a></li>
</ul>
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
    </button></h2><p>Para poder ofrecer una herramienta de personalización de armarios tan inteligente, primero tenemos que definir la lógica empresarial y comprender los atributos de los artículos y el recorrido del usuario. Los armarios y sus componentes, como cajones, bandejas y estanterías, son datos no estructurados. Por lo tanto, el segundo paso consiste en aprovechar los algoritmos y las reglas de la IA, los conocimientos previos, la descripción de los artículos, etc., para convertir esos datos no estructurados en un tipo de datos que puedan entender los ordenadores: ¡vectores!</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Customization_tool_overview_86d62e1730.png" alt="Customization tool overview" class="doc-image" id="customization-tool-overview" />
   </span> <span class="img-wrapper"> <span>Visión general de la herramienta de personalización</span> </span></p>
<p>Con los vectores generados, necesitamos potentes bases de datos vectoriales y motores de búsqueda para procesarlos.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/tool_architecutre_33fb646954.png" alt="tool architecture" class="doc-image" id="tool-architecture" />
   </span> <span class="img-wrapper"> <span>arquitectura de la herramienta</span> </span></p>
<p>La herramienta de personalización aprovecha algunos de los motores de búsqueda y bases de datos más populares: Elasticsearch, <a href="https://milvus.io/">Milvus</a> y PostgreSQL.</p>
<h3 id="Why-Milvus" class="common-anchor-header">¿Por qué Milvus?</h3><p>Un componente de vestuario contiene información muy compleja, como el color, la forma, la organización interior, etc. Sin embargo, la forma tradicional de guardar los datos del guardarropa en una base de datos relacional dista mucho de ser suficiente. Una forma muy extendida es utilizar técnicas de incrustación para convertir los vestuarios en vectores. Por tanto, hay que buscar un nuevo tipo de base de datos diseñada específicamente para el almacenamiento de vectores y la búsqueda de similitudes. Tras sondear varias soluciones populares, se selecciona la base de datos vectorial <a href="https://github.com/milvus-io/milvus">Milvus</a> por su excelente rendimiento, estabilidad, compatibilidad y facilidad de uso. El cuadro siguiente es una comparación de varias soluciones populares de búsqueda de vectores.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Solution_comparison_d96b8f1dd5.png" alt="solution comparison" class="doc-image" id="solution-comparison" />
   </span> <span class="img-wrapper"> <span>comparación de soluciones</span> </span></p>
<h3 id="System-workflow" class="common-anchor-header">Flujo de trabajo del sistema</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/System_workflow_250c275ec1.png" alt="System workflow" class="doc-image" id="system-workflow" />
   </span> <span class="img-wrapper"> <span>Flujo de trabajo del sistema</span> </span></p>
<p>Elasticsearch se utiliza para un filtrado grueso por el tamaño del vestuario, el color, etc. A continuación, los resultados filtrados pasan por la base de datos vectorial Milvus para una búsqueda de similitud y los resultados se clasifican en función de su distancia/similitud con el vector de consulta. Por último, los resultados se consolidan y se afinan en función de la visión empresarial.</p>
<h2 id="Data-flow" class="common-anchor-header">Flujo de datos<button data-href="#Data-flow" class="anchor-icon" translate="no">
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
    </button></h2><p>El sistema de personalización de armarios es muy similar a los motores de búsqueda tradicionales y a los sistemas de recomendación. Consta de tres partes:</p>
<ul>
<li>Preparación de datos fuera de línea: definición y generación de datos.</li>
<li>Servicios en línea, que incluyen la recuperación y la clasificación.</li>
<li>Postprocesamiento de datos basado en la lógica empresarial.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_flow_d0d9fa0fca.png" alt="Data flow" class="doc-image" id="data-flow" />
   </span> <span class="img-wrapper"> <span>Flujo de datos</span> </span></p>
<h3 id="Offline-data-flow" class="common-anchor-header">Flujo de datos offline</h3><ol>
<li>Definir los datos utilizando el conocimiento del negocio.</li>
<li>Utilizar conocimientos previos para definir cómo combinar diferentes componentes y formarlos en un armario.</li>
<li>Reconocer las etiquetas de características de los armarios y codificar las características en datos de Elasticsearch en el archivo <code translate="no">.json</code>.</li>
<li>Preparar los datos recall codificando los datos no estructurados en vectores.</li>
<li>Utilizar la base de datos de vectores Milvus para clasificar los resultados recuperados obtenidos en el paso anterior.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/offline_data_flow_f91ac9cf4c.png" alt="offline data flow" class="doc-image" id="offline-data-flow" />
   </span> <span class="img-wrapper"> <span>flujo de datos offline</span> </span></p>
<h3 id="Online-data-flow" class="common-anchor-header">Flujo de datos en línea</h3><ol>
<li>Recibir solicitudes de consulta de los usuarios y recopilar sus perfiles.</li>
<li>Comprender la consulta del usuario identificando sus requisitos para el armario.</li>
<li>Búsqueda gruesa utilizando Elasticsearch.</li>
<li>Puntuar y clasificar los resultados obtenidos de la búsqueda gruesa basándose en el cálculo de la similitud vectorial en Milvus.</li>
<li>Post-procesar y organizar los resultados en la plataforma back-end para generar los resultados finales.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/online_data_flow_1f2af25cc3.png" alt="online data flow" class="doc-image" id="online-data-flow" />
   </span> <span class="img-wrapper"> <span>flujo de datos en línea</span> </span></p>
<h3 id="Data-post-processing" class="common-anchor-header">Post-procesamiento de datos</h3><p>La lógica empresarial varía de una empresa a otra. Puede añadir un toque final a los resultados aplicando la lógica empresarial de su empresa.</p>
<h2 id="System-demo" class="common-anchor-header">Demostración del sistema<button data-href="#System-demo" class="anchor-icon" translate="no">
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
    </button></h2><p>Veamos ahora cómo funciona realmente el sistema que hemos construido.</p>
<p>La interfaz de usuario (UI) muestra la posibilidad de diferentes combinaciones de componentes del armario.</p>
<p>Cada componente se etiqueta por su característica (talla, color, etc.) y se almacena en Elasticsearch (ES). Al almacenar las etiquetas en ES, hay que rellenar cuatro campos de datos principales: ID, etiquetas, ruta de almacenamiento y otros campos de apoyo. ES y los datos etiquetados se utilizan para la recuperación granular y el filtrado de atributos.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/es_d5b0639610.png" alt="es" class="doc-image" id="es" />
   </span> <span class="img-wrapper"> <span>es</span> </span></p>
<p>A continuación, se utilizan distintos algoritmos de IA para codificar un armario en un conjunto de vectores. Los conjuntos de vectores se almacenan en Milvus para la búsqueda de similitudes y la clasificación. Este paso devuelve resultados más refinados y precisos.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_38dd93a439.jpeg" alt="Milvus" class="doc-image" id="milvus" />
   </span> <span class="img-wrapper"> <span>Milvus</span> </span></p>
<p>Elasticsearch, Milvus y otros componentes del sistema forman en conjunto la plataforma de diseño de personalización en su conjunto. Durante la recuperación, el lenguaje específico del dominio (DSL) en Elasticsearch y Milvus es el siguiente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/dsl_df60097d23.png" alt="dsl" class="doc-image" id="dsl" />
   </span> <span class="img-wrapper"> <span>dsl</span> </span></p>
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
    </button></h2><p>Descubra cómo la base de datos vectorial Milvus puede impulsar más aplicaciones de IA:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md">Cómo la plataforma de vídeos cortos Likee elimina los vídeos duplicados con Milvus</a></li>
<li><a href="https://milvus.io/blog/2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md">Zhentu - El detector de fraude fotográfico basado en Milvus</a></li>
</ul>
