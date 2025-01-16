---
id: >-
  efficient-vector-similarity-search-recommender-workflows-using-milvus-nvidia-merlin.md
title: >-
  Búsqueda eficiente de vectores de similitud en flujos de trabajo de
  recomendación utilizando Milvus con NVIDIA Merlin
author: Burcin Bozkaya
date: 2023-12-15T00:00:00.000Z
desc: >-
  Introducción a la integración de NVIDIA Merlin y Milvus en la creación de
  sistemas de recomendación y evaluación comparativa de su rendimiento en
  distintos escenarios.
cover: assets.zilliz.com/nvidia_4921837ca6.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, NVIDIA, Merlin
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/efficient-vector-similarity-search-recommender-workflows-using-milvus-nvidia-merlin
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/nvidia_4921837ca6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Este artículo se publicó por primera vez en <a href="https://medium.com/nvidia-merlin/efficient-vector-similarity-search-in-recommender-workflows-using-milvus-with-nvidia-merlin-84d568290ee4">el canal de NVIDIA Merlin en Medium</a> y se ha editado y publicado aquí con permiso. Ha sido escrito conjuntamente por <a href="https://medium.com/u/743df9db1666?source=post_page-----84d568290ee4--------------------------------">Burcin Bozkaya</a> y <a href="https://medium.com/u/279d4c25a145?source=post_page-----84d568290ee4--------------------------------">William Hicks</a> de NVIDIA y <a href="https://medium.com/u/3e8a3c67a8a5?source=post_page-----84d568290ee4--------------------------------">Filip Haltmayer</a> y <a href="https://github.com/liliu-z">Liu</a> de Zilliz.</em></p>
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
    </button></h2><p>Los sistemas de recomendación modernos (Recsys) consisten en procesos de entrenamiento e inferencia que incluyen múltiples etapas de entrada de datos, preprocesamiento de datos, entrenamiento de modelos y ajuste de hiperparámetros para recuperar, filtrar, clasificar y puntuar elementos relevantes. Un componente esencial de un sistema de recomendación es la recuperación o descubrimiento de los elementos más relevantes para un usuario, sobre todo en presencia de grandes catálogos de artículos. Este paso suele implicar una búsqueda <a href="https://zilliz.com/glossary/anns">aproximada del vecino más cercano (RNA</a> ) en una base de datos indexada de representaciones vectoriales de baja dimensión (es decir, incrustaciones) de atributos de productos y usuarios creadas a partir de modelos de aprendizaje profundo que se entrenan en interacciones entre usuarios y productos/servicios.</p>
<p><a href="https://github.com/NVIDIA-Merlin">NVIDIA Merlin</a>, un marco de código abierto desarrollado para entrenar modelos de extremo a extremo para hacer recomendaciones a cualquier escala, se integra con un índice de <a href="https://zilliz.com/learn/what-is-vector-database">base de datos vectorial</a> eficiente y un marco de búsqueda. <a href="https://zilliz.com/what-is-milvus">Milvus</a>, una base de datos vectorial de código abierto creada por <a href="https://zilliz.com/">Zilliz</a>, es uno de estos marcos que ha suscitado gran interés recientemente. Ofrece funciones rápidas de índice y consulta. Recientemente, Milvus ha añadido <a href="https://zilliz.com/blog/getting-started-with-gpu-powered-milvus-unlocking-10x-higher-performance">soporte de aceleración en la GPU</a> que utiliza las GPU NVIDIA para sostener los flujos de trabajo de IA. El soporte de la aceleración de GPU es una gran noticia porque una biblioteca de búsqueda vectorial acelerada hace posibles las consultas concurrentes rápidas, impactando positivamente en los requisitos de latencia en los sistemas de recomendación de hoy en día, donde los desarrolladores esperan muchas solicitudes concurrentes. Milvus tiene más de 5 millones de docker pulls, ~23.000 estrellas en GitHub (en septiembre de 2023), más de 5.000 clientes empresariales y es un componente central de muchas aplicaciones (véanse <a href="https://medium.com/vector-database/tagged/use-cases-of-milvus">los casos de</a> uso).</p>
<p>Este blog muestra cómo funciona Milvus con el marco Merlin Recsys en el momento de la formación y la inferencia. Mostramos cómo Milvus complementa a Merlin en la fase de recuperación de elementos con una búsqueda de incrustación vectorial top-k de alta eficiencia y cómo puede utilizarse con NVIDIA Triton Inference Server (TIS) en el momento de la inferencia (véase la Figura 1). <strong>Nuestros resultados de referencia muestran un impresionante aumento de la velocidad de 37 a 91 veces con Milvus acelerado en la GPU que utiliza NVIDIA RAFT con las incrustaciones vectoriales generadas por Merlin Models.</strong> El código que utilizamos para mostrar la integración Merlin-Milvus y los resultados detallados de las pruebas de rendimiento, junto con la <a href="https://github.com/zilliztech/VectorDBBench">biblioteca</a> que facilitó nuestro estudio comparativo, están disponibles aquí.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Multistage_recommender_system_with_Milvus_ee891c4ad5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 1. Sistema de recomendación multietapa con Merlin-Milvus Sistema de recomendación multietapa con el marco Milvus contribuyendo a la etapa de recuperación. Fuente de la figura original: esta <a href="https://medium.com/nvidia-merlin/recommender-systems-not-just-recommender-models-485c161c755e">entrada de blog</a>.</em></p>
<h2 id="The-challenges-facing-recommenders" class="common-anchor-header">Los retos de los recomendadores<button data-href="#The-challenges-facing-recommenders" class="anchor-icon" translate="no">
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
    </button></h2><p>Dada la naturaleza multietapa de los recomendadores y la disponibilidad de varios componentes y bibliotecas que integran, un reto importante es integrar todos los componentes a la perfección en una canalización de extremo a extremo. En nuestros cuadernos de ejemplo pretendemos demostrar que la integración puede realizarse con menos esfuerzo.</p>
<p>Otro reto de los flujos de trabajo de recomendación es acelerar ciertas partes del proceso. Aunque se sabe que desempeñan un papel muy importante en el entrenamiento de grandes redes neuronales, las GPU son una incorporación reciente a las bases de datos vectoriales y la búsqueda de RNA. A medida que aumenta el tamaño de los inventarios de productos de comercio electrónico o las bases de datos de streaming multimedia y el número de usuarios que utilizan estos servicios, las CPU deben proporcionar el rendimiento necesario para atender a millones de usuarios en flujos de trabajo de Recsys de alto rendimiento. Para hacer frente a este reto, se ha hecho necesaria la aceleración en la GPU de otras partes del pipeline. La solución de este blog aborda este reto demostrando que la búsqueda RNA es eficiente cuando se utilizan GPU.</p>
<h2 id="Tech-stacks-for-the-solution" class="common-anchor-header">Pilas tecnológicas para la solución<button data-href="#Tech-stacks-for-the-solution" class="anchor-icon" translate="no">
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
    </button></h2><p>Empecemos por repasar primero algunos de los fundamentos necesarios para llevar a cabo nuestro trabajo.</p>
<ul>
<li><p>NVIDIA <a href="https://github.com/NVIDIA-Merlin/Merlin">Merlin</a>: una biblioteca de código abierto con API de alto nivel que acelera los recomendadores en las GPU NVIDIA.</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/NVTabular">NVTabular</a>: para el preprocesamiento de los datos tabulares de entrada y la ingeniería de características.</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/models">Merlin Models</a>: para entrenar modelos de aprendizaje profundo y aprender, en este caso, vectores de incrustación de usuarios y elementos a partir de datos de interacción de usuarios.</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/systems">Merlin Systems</a>: para combinar un modelo de recomendación basado en TensorFlow con otros elementos (por ejemplo, almacén de características, búsqueda RNA con Milvus) que se servirán con TIS.</p></li>
<li><p><a href="https://github.com/triton-inference-server/server">Triton Inference Server</a>: para la etapa de inferencia en la que se pasa un vector de características del usuario y se generan recomendaciones de productos.</p></li>
<li><p>Containerización: todo lo anterior está disponible a través de los contenedores que NVIDIA proporciona en el <a href="https://catalog.ngc.nvidia.com/">catálogo NGC</a>. Hemos utilizado el contenedor Merlin TensorFlow 23.06 disponible <a href="https://catalog.ngc.nvidia.com/orgs/nvidia/teams/merlin/containers/merlin-tensorflow">aquí</a>.</p></li>
<li><p><a href="https://github.com/milvus-io/milvus/releases/tag/v2.3.0">Milvus 2.3</a>: para realizar indexaciones y consultas vectoriales aceleradas en la GPU.</p></li>
<li><p><a href="https://github.com/milvus-io/milvus/releases">Milvus 2.2.11</a>: igual que el anterior, pero para hacerlo en CPU.</p></li>
<li><p><a href="https://zilliz.com/product/integrations/python">Pymilvus SDK</a>: para conectarse al servidor Milvus, crear índices de bases de datos vectoriales y ejecutar consultas a través de una interfaz Python.</p></li>
<li><p><a href="https://github.com/feast-dev/feast">Feast</a>: para guardar y recuperar atributos de usuarios y elementos en un almacén de características (de código abierto) como parte de nuestro proceso RecSys de extremo a extremo.</p></li>
</ul>
<p>También se utilizan varias bibliotecas y marcos subyacentes. Por ejemplo, Merlin se basa en otras librerías de NVIDIA, como cuDF y Dask, ambas disponibles en <a href="https://github.com/rapidsai/cudf">RAPIDS cuDF</a>. Del mismo modo, Milvus se basa en <a href="https://github.com/rapidsai/raft">NVIDIA RAFT</a> para las primitivas de aceleración de la GPU y en librerías modificadas como <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a> y <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a> para la búsqueda.</p>
<h2 id="Understanding-vector-databases-and-Milvus" class="common-anchor-header">Comprensión de las bases de datos vectoriales y Milvus<button data-href="#Understanding-vector-databases-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/glossary/anns">El vecino más cercano aproximado (RNA</a> ) es una funcionalidad que las bases de datos relacionales no pueden manejar. Las bases de datos relacionales están diseñadas para manejar datos tabulares con estructuras predefinidas y valores directamente comparables. Los índices de las bases de datos relacionales se basan en esto para comparar datos y crear estructuras que aprovechen la ventaja de saber si cada valor es menor o mayor que el otro. Los vectores incrustados no pueden compararse directamente entre sí de este modo, ya que necesitamos saber qué representa cada valor del vector. No se puede decir si un vector es necesariamente menor que el otro. Lo único que podemos hacer es calcular la distancia entre los dos vectores. Si la distancia entre dos vectores es pequeña, podemos suponer que las características que representan son similares, y si es grande, podemos suponer que los datos que representan son más diferentes. Sin embargo, estos índices eficientes tienen un coste: calcular la distancia entre dos vectores es costoso desde el punto de vista computacional, y los índices vectoriales no son fácilmente adaptables y a veces no son modificables. Debido a estas dos limitaciones, la integración de estos índices es más compleja en las bases de datos relacionales, por lo que se necesitan <a href="https://zilliz.com/blog/what-is-a-real-vector-database">bases de datos vectoriales creadas específicamente</a>.</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvus</a> se creó para resolver los problemas a los que se enfrentan las bases de datos relacionales con vectores y se diseñó desde cero para manejar estos vectores incrustados y sus índices a gran escala. Para cumplir el distintivo de "nativo de la nube", Milvus separa la computación y el almacenamiento y las distintas tareas informáticas: la consulta, la gestión de datos y la indexación. Los usuarios pueden escalar cada parte de la base de datos para gestionar otros casos de uso, ya sea de inserción de datos o de búsqueda. Si hay una gran afluencia de solicitudes de inserción, el usuario puede escalar temporalmente los nodos de indexación horizontal y verticalmente para gestionar la ingestión. Del mismo modo, si no se están ingiriendo datos, pero hay muchas búsquedas, el usuario puede reducir los nodos de índice y, en su lugar, escalar los nodos de consulta para obtener un mayor rendimiento. Este diseño del sistema (véase la Figura 2) nos obligó a pensar en computación paralela, lo que dio como resultado un sistema optimizado para computación con muchas puertas abiertas para nuevas optimizaciones.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_system_design_bb3a44c9cc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 2. Diseño del sistema Milvus Diseño del sistema Milvus</em></p>
<p>Milvus también utiliza muchas bibliotecas de indexación de última generación para ofrecer a los usuarios tanta personalización para su sistema como sea posible. Las mejora añadiendo la capacidad de manejar operaciones CRUD, datos en flujo y filtrado. Más adelante analizaremos en qué se diferencian estos índices y cuáles son los pros y los contras de cada uno.</p>
<h2 id="Example-solution-integration-of-Milvus-and-Merlin" class="common-anchor-header">Ejemplo de solución: integración de Milvus y Merlin<button data-href="#Example-solution-integration-of-Milvus-and-Merlin" class="anchor-icon" translate="no">
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
    </button></h2><p>La solución de ejemplo que presentamos aquí demuestra la integración de Milvus con Merlin en la fase de recuperación de elementos (cuando se recuperan los k elementos más relevantes mediante una búsqueda RNA). Utilizamos un conjunto de datos reales de un <a href="https://www.kaggle.com/datasets/chadgostopp/recsys-challenge-2015">desafío RecSys</a>, descrito a continuación. Entrenamos un modelo de aprendizaje profundo Two-Tower que aprende incrustaciones vectoriales para usuarios y elementos. En esta sección también se describe nuestro trabajo de evaluación comparativa, incluidas las métricas que recopilamos y la gama de parámetros que utilizamos.</p>
<p>Nuestro enfoque incluye</p>
<ul>
<li><p>Introducción y preprocesamiento de datos</p></li>
<li><p>Entrenamiento del modelo de aprendizaje profundo Two-Tower</p></li>
<li><p>Creación del índice Milvus</p></li>
<li><p>Búsqueda de similitud Milvus</p></li>
</ul>
<p>Describimos brevemente cada paso y remitimos al lector a nuestros <a href="https://github.com/bbozkaya/merlin-milvus/tree/main/notebooks">cuadernos</a> para más detalles.</p>
<h3 id="Dataset" class="common-anchor-header">Conjunto de datos</h3><p>YOOCHOOSE GmbH proporciona el conjunto de datos que utilizamos en este estudio de integración y evaluación comparativa para el <a href="https://www.kaggle.com/datasets/chadgostopp/recsys-challenge-2015">desafío RecSys</a> 2015 y está disponible en Kaggle. Contiene eventos de clic/compra de usuarios de un minorista online europeo con atributos como un ID de sesión, una marca de tiempo, un ID de artículo asociado al clic/compra y una categoría de artículo, disponibles en el archivo yoochoose-clicks.dat. Las sesiones son independientes y no hay indicios de usuarios que regresan, por lo que tratamos cada sesión como perteneciente a un usuario distinto. El conjunto de datos tiene 9.249.729 sesiones únicas (usuarios) y 52.739 artículos únicos.</p>
<h3 id="Data-ingestion-and-preprocessing" class="common-anchor-header">Captura y preprocesamiento de datos</h3><p>La herramienta que utilizamos para el preprocesamiento de datos es <a href="https://github.com/NVIDIA-Merlin/NVTabular">NVTabular</a>, un componente de Merlin de ingeniería de características y preprocesamiento altamente escalable y acelerado en la GPU. Utilizamos NVTabular para leer los datos en la memoria de la GPU, reorganizar las características según sea necesario, exportar a archivos parquet y crear una división de entrenamiento-validación para el entrenamiento. El resultado son 7.305.761 usuarios únicos y 49.008 elementos únicos con los que entrenar. También categorizamos cada columna y sus valores en enteros. El conjunto de datos ya está listo para el entrenamiento con el modelo de dos torres.</p>
<h3 id="Model-training" class="common-anchor-header">Entrenamiento del modelo</h3><p>Utilizamos el modelo de aprendizaje profundo <a href="https://github.com/NVIDIA-Merlin/models/blob/main/examples/05-Retrieval-Model.ipynb">Two-Tower</a> para entrenar y generar incrustaciones de usuarios y elementos, que posteriormente se utilizan en la indexación y consulta de vectores. Después de entrenar el modelo, podemos extraer las incrustaciones de usuario y elemento aprendidas.</p>
<p>Los dos pasos siguientes son opcionales: un modelo <a href="https://arxiv.org/abs/1906.00091">DLRM</a> entrenado para clasificar los elementos recuperados con fines de recomendación y un almacén de características utilizado (en este caso, <a href="https://github.com/feast-dev/feast">Feast</a>) para almacenar y recuperar características de usuarios y elementos. Los incluimos para completar el flujo de trabajo en varias fases.</p>
<p>Por último, exportamos las incrustaciones de usuarios e ítems a archivos parquet, que pueden recargarse posteriormente para crear un índice vectorial Milvus.</p>
<h3 id="Building-and-querying-the-Milvus-index" class="common-anchor-header">Creación y consulta del índice Milvus</h3><p>Milvus facilita la indexación vectorial y la búsqueda de similitud a través de un "servidor" lanzado en la máquina de inferencia. En nuestro cuaderno nº 2, lo configuramos instalando mediante pip el servidor Milvus y Pymilvus, e iniciando el servidor con su puerto de escucha predeterminado. A continuación, demostramos la creación de un índice sencillo (IVF_FLAT) y la consulta del mismo mediante las funciones <code translate="no">setup_milvus</code> y <code translate="no">query_milvus</code>, respectivamente.</p>
<h2 id="Benchmarking" class="common-anchor-header">Pruebas de rendimiento<button data-href="#Benchmarking" class="anchor-icon" translate="no">
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
    </button></h2><p>Hemos diseñado dos pruebas comparativas para demostrar la conveniencia de utilizar una biblioteca de indexación/búsqueda vectorial rápida y eficiente como Milvus.</p>
<ol>
<li><p>Usando Milvus para construir índices vectoriales con los dos conjuntos de incrustaciones que generamos: 1) incrustaciones de usuarios para 7,3 millones de usuarios únicos, divididos en un 85% para el conjunto de entrenamiento (para indexación) y un 15% para el conjunto de prueba (para consulta), y 2) incrustaciones de artículos para 49.000 productos (con una división 50-50 entre entrenamiento y prueba). Esta prueba se realiza de forma independiente para cada conjunto de datos vectoriales, y los resultados se presentan por separado.</p></li>
<li><p>Utilización de Milvus para crear un índice vectorial para el conjunto de datos de 49.000 elementos incrustados y consulta de los 7,3 millones de usuarios únicos en este índice para la búsqueda de similitudes.</p></li>
</ol>
<p>En estas pruebas, utilizamos los algoritmos de indexación IVFPQ y HNSW ejecutados en GPU y CPU, junto con varias combinaciones de parámetros. Los detalles están disponibles <a href="https://github.com/bbozkaya/merlin-milvus/tree/main/results">aquí</a>.</p>
<p>El equilibrio entre la calidad y el rendimiento de la búsqueda es un aspecto importante del rendimiento, especialmente en un entorno de producción. Milvus permite un control total sobre los parámetros de indexación para explorar este compromiso en un caso de uso determinado y lograr mejores resultados de búsqueda con la verdad sobre el terreno. Esto puede suponer un aumento del coste computacional en forma de reducción de la tasa de rendimiento o de las consultas por segundo (QPS). Medimos la calidad de la búsqueda RNA con una métrica de recuperación y proporcionamos curvas QPS-recall que demuestran el compromiso. De este modo, se puede decidir cuál es el nivel aceptable de calidad de la búsqueda en función de los recursos informáticos o de los requisitos de latencia/rendimiento de la empresa.</p>
<p>Obsérvese también el tamaño del lote de consulta (nq) utilizado en nuestras pruebas comparativas. Esto resulta útil en flujos de trabajo en los que se envían varias solicitudes simultáneas a la inferencia (por ejemplo, recomendaciones fuera de línea solicitadas y enviadas a una lista de destinatarios de correo electrónico o recomendaciones en línea creadas agrupando las solicitudes concurrentes que llegan y procesándolas todas a la vez). Dependiendo del caso de uso, TIS también puede ayudar a procesar estas solicitudes por lotes.</p>
<h3 id="Results" class="common-anchor-header">Resultados</h3><p>A continuación presentamos los resultados de los tres conjuntos de pruebas tanto en CPU como en GPU, utilizando los tipos de índice HNSW (sólo CPU) e IVF_PQ (CPU y GPU) implementados por Milvus.</p>
<h4 id="Items-vs-Items-vector-similarity-search" class="common-anchor-header">Búsqueda de similitud vectorial de ítems frente a ítems</h4><p>Con este conjunto de datos más pequeño, cada ejecución para una combinación de parámetros determinada toma el 50% de los vectores de artículos como vectores de consulta y consulta los 100 vectores más similares del resto. HNSW e IVF_PQ consiguen una alta recuperación con los parámetros probados, en el intervalo 0,958-1,0 y 0,665-0,997, respectivamente. Este resultado sugiere que HNSW obtiene mejores resultados en cuanto a recall, pero IVF_PQ con ajustes pequeños de nlist produce un recall muy comparable. También hay que tener en cuenta que los valores de recuperación pueden variar mucho en función de los parámetros de indexación y consulta. Los valores que presentamos se han obtenido tras una experimentación preliminar con rangos de parámetros generales y una ampliación de un subconjunto selecto.</p>
<p>El tiempo total de ejecución de todas las consultas en la CPU con HNSW para una combinación de parámetros dada oscila entre 5,22 y 5,33 s (más rápido a medida que aumenta m, relativamente invariable con ef) y con IVF_PQ entre 13,67 y 14,67 s (más lento a medida que aumentan nlist y nprobe). La aceleración en la GPU tiene un efecto notable, como puede verse en la Figura 3.</p>
<p>La Figura 3 muestra la relación entre recuperación y rendimiento en todas las ejecuciones realizadas en CPU y GPU con este pequeño conjunto de datos utilizando IVF_PQ. Se observa que la GPU proporciona un incremento de velocidad de entre 4 y 15 veces en todas las combinaciones de parámetros probadas (mayor a medida que aumenta nprobe). Esto se calcula tomando la relación entre los QPS de la GPU y los QPS de la CPU para cada combinación de parámetros. En general, este conjunto de datos supone un pequeño reto para la CPU o la GPU y muestra perspectivas de mayor aceleración con conjuntos de datos más grandes, como se explica a continuación.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_item_item_d32de8443d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 3. Aceleración de la GPU con Milvus Aceleración en GPU con el algoritmo IVF_PQ de Milvus ejecutado en la GPU NVIDIA A100 (búsqueda de similitud entre elementos)</em></p>
<h4 id="Users-vs-Users-vector-similarity-search" class="common-anchor-header">Búsqueda vectorial de similitudes entre usuarios</h4><p>Con el segundo conjunto de datos, mucho mayor (7,3 millones de usuarios), reservamos el 85% (~6,2 millones) de los vectores como "entrenamiento" (el conjunto de vectores que se indexarán) y el 15% restante (~1,1 millones) como "prueba" o conjunto de vectores de consulta. Los resultados de HNSW e IVF_PQ son excepcionalmente buenos en este caso, con valores de recuperación de 0,884-1,0 y 0,922-0,999, respectivamente. Sin embargo, son mucho más exigentes desde el punto de vista computacional, especialmente con IVF_PQ en la CPU. El tiempo total de ejecución de todas las consultas en la CPU con HNSW oscila entre 279,89 y 295,56 s y con IVF_PQ entre 3082,67 y 10932,33 s. Obsérvese que estos tiempos de consulta son acumulativos para 1,1 millones de vectores consultados, por lo que puede decirse que una sola consulta contra el índice sigue siendo muy rápida.</p>
<p>Sin embargo, las consultas basadas en la CPU pueden no ser viables si el servidor de inferencia espera muchos miles de peticiones simultáneas para ejecutar consultas contra un inventario de millones de elementos.</p>
<p>La GPU A100 proporciona una velocidad de 37x a 91x (con una media de 76,1x) en todas las combinaciones de parámetros con IVF_PQ en términos de rendimiento (QPS), como se muestra en la Figura 4. Esto es coherente con lo observado con la GPU A100. Esto concuerda con lo observado con el pequeño conjunto de datos, lo que sugiere que el rendimiento de la GPU se escala razonablemente bien utilizando Milvus con millones de vectores de incrustación.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_algorithm_user_user_c91f4e4164.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 4. Aumento de la velocidad de la GPU con Milvus Aceleración de la GPU con el algoritmo IVF_PQ de Milvus ejecutado en la GPU NVIDIA A100 (búsqueda de similitud usuario-usuario)</em></p>
<p>La siguiente Figura 5 muestra en detalle la compensación recall-QPS para todas las combinaciones de parámetros probadas en CPU y GPU con IVF_PQ. Cada conjunto de puntos (arriba para la GPU, abajo para la CPU) de este gráfico representa la compensación que se produce al cambiar los parámetros de indexación/consulta de vectores para conseguir una mayor recuperación a expensas de un menor rendimiento. Obsérvese la considerable pérdida de QPS en el caso de la GPU cuando se intentan alcanzar mayores niveles de recuperación.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Recall_Throughput_tradeoff_519b2289e5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 5. Equilibrio entre recuperación y rendimiento para todas las combinaciones de parámetros probadas en CPU y GPU con IVF_PQ (usuarios frente a usuarios)</em></p>
<h4 id="Users-vs-Items-vector-similarity-search" class="common-anchor-header">Usuarios frente a elementos Búsqueda por similitud vectorial</h4><p>Por último, consideramos otro caso de uso realista en el que se consultan vectores de usuarios frente a vectores de elementos (como se demostró en el cuaderno 01). En este caso, se indexan 49.000 vectores de artículos y se consultan 7,3 millones de vectores de usuarios en busca de los 100 artículos más similares.</p>
<p>Aquí es donde las cosas se ponen interesantes porque la consulta de 7,3M en lotes de 1000 contra un índice de 49K elementos parece consumir mucho tiempo en la CPU tanto para HNSW como para IVF_PQ. La GPU parece manejar mejor este caso (véase la Figura 6). Los niveles de precisión más altos de IVF_PQ en la CPU cuando nlist = 100 se calculan en unos 86 minutos de media, pero varían significativamente a medida que aumenta el valor de nprobe (51 min. cuando nprobe = 5 frente a 128 min. cuando nprobe = 20). La GPU NVIDIA A100 acelera considerablemente el rendimiento en un factor de 4x a 17x (mayor velocidad a medida que aumenta nprobe). Recordemos que el algoritmo IVF_PQ, a través de su técnica de cuantización, también reduce la huella de memoria y proporciona una solución de búsqueda de RNA computacionalmente viable combinada con la aceleración de la GPU.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_algorithm_user_item_504462fcc0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 6. Aceleración de la GPU con Milvus Aceleración de la GPU con el algoritmo IVF_PQ de Milvus ejecutado en la GPU NVIDIA A100 (búsqueda de similitudes entre elementos de usuario)</em></p>
<p>Al igual que en la Figura 5, en la Figura 7 se muestra la relación entre recuperación y rendimiento para todas las combinaciones de parámetros probadas con IVF_PQ. En este caso, todavía se puede ver cómo es posible que haya que renunciar ligeramente a cierta precisión en la búsqueda RNA en favor de un mayor rendimiento, aunque las diferencias son mucho menos notables, especialmente en el caso de las ejecuciones en la GPU. Esto sugiere que se pueden esperar niveles relativamente altos de rendimiento computacional con la GPU y, al mismo tiempo, conseguir una alta recuperación.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Recall_Throughput_tradeoff_user_items_0abce91c5e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 7. Equilibrio entre recuperación y rendimiento para todas las combinaciones de parámetros probadas en CPU y GPU con IVF_PQ (usuarios frente a elementos)</em></p>
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
    </button></h2><p>Si has llegado hasta aquí, nos gustaría compartir contigo algunas observaciones finales. Queremos recordarte que la complejidad y la naturaleza multietapa de Recsys requieren rendimiento y eficiencia en cada paso. Esperamos que este blog te haya dado razones de peso para considerar el uso de dos funciones críticas en tus pipelines RecSys:</p>
<ul>
<li><p>La librería Merlin Systems de NVIDIA te permite conectar fácilmente <a href="https://github.com/milvus-io/milvus/tree/2.3.0">Milvus</a>, un eficiente motor de búsqueda vectorial acelerado en la GPU.</p></li>
<li><p>Utilice la GPU para acelerar los cálculos de indexación de bases de datos vectoriales y búsqueda de RNA con tecnologías como <a href="https://github.com/rapidsai/raft">RAPIDS RAFT</a>.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/summary_benchmark_results_ae33fbe514.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Estos resultados sugieren que la integración Merlin-Milvus presentada ofrece un alto rendimiento y es mucho menos compleja que otras opciones para el entrenamiento y la inferencia. Además, ambos marcos de trabajo se desarrollan activamente y en cada versión se añaden muchas funciones nuevas (por ejemplo, los nuevos índices de bases de datos vectoriales acelerados por GPU de Milvus). El hecho de que la búsqueda de similitudes vectoriales sea un componente crucial en diversos flujos de trabajo, como la visión por computador, el modelado de grandes lenguajes y los sistemas de recomendación, hace que este esfuerzo merezca aún más la pena.</p>
<p>Para terminar, nos gustaría dar las gracias a todos los miembros de los equipos de Zilliz/Milvus y Merlin y de RAFT que han contribuido a la elaboración de este trabajo y de esta entrada de blog. Esperamos tener noticias suyas si tiene la oportunidad de implantar Merlin y Milvus en sus recsys u otros flujos de trabajo.</p>
