---
id: why-and-when-you-need-a-purpose-built-vector-database.md
title: ¿Por qué y cuándo se necesita una base de datos vectorial específica?
author: James Luan
date: 2023-08-29T00:00:00.000Z
cover: >-
  assets.zilliz.com/Why_you_need_a_real_vector_database2_20230830_075505_1_4b32582c87.png
tag: Engineering
tags: >-
  Vector Database, AI, Artificial Intelligence, Machine Learning, Milvus, LLM,
  Large Language Models, Embeddings, Vector search, Vector similarity search
desc: >-
  En este artículo se ofrece una visión general de la búsqueda vectorial y su
  funcionamiento, se comparan distintas tecnologías de búsqueda vectorial y se
  explica por qué es crucial optar por una base de datos vectorial específica.
recommend: true
canonicalUrl: >-
  https://www.aiacceleratorinstitute.com/why-and-when-do-you-need-a-purpose-built-vector-database/
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Why_you_need_a_real_vector_database2_20230830_075505_1_4b32582c87.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Este artículo se publicó originalmente en <a href="https://www.aiacceleratorinstitute.com/why-and-when-do-you-need-a-purpose-built-vector-database/">AIAI</a> y se publica aquí con permiso.</em></p>
<p>La creciente popularidad de <a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a> y otros grandes modelos lingüísticos (LLM) ha impulsado el auge de las tecnologías de búsqueda vectorial, entre las que se incluyen bases de datos vectoriales específicas como <a href="https://milvus.io/docs/overview.md">Milvus</a> y <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, bibliotecas de búsqueda vectorial como <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a> y plugins de búsqueda vectorial integrados con bases de datos tradicionales. Sin embargo, elegir la mejor solución para sus necesidades puede ser todo un reto. Al igual que elegir entre un restaurante de alta gama y una cadena de comida rápida, la selección de la tecnología de búsqueda vectorial adecuada depende de sus necesidades y expectativas.</p>
<p>En este post, le ofreceré una visión general de la búsqueda vectorial y su funcionamiento, compararé diferentes tecnologías de búsqueda vectorial y le explicaré por qué es crucial optar por una base de datos vectorial creada específicamente para este fin.</p>
<h2 id="What-is-vector-search-and-how-does-it-work" class="common-anchor-header">¿Qué es la búsqueda vectorial y cómo funciona?<button data-href="#What-is-vector-search-and-how-does-it-work" class="anchor-icon" translate="no">
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
    </button></h2><p>La búsqueda<a href="https://zilliz.com/blog/vector-similarity-search">vectorial</a>, también conocida como búsqueda de similitud vectorial, es una técnica para recuperar los resultados top-k más similares o semánticamente relacionados con un vector de consulta dado entre una extensa colección de datos vectoriales densos.</p>
<p>Antes de realizar búsquedas de similitud, aprovechamos las redes neuronales para transformar <a href="https://zilliz.com/blog/introduction-to-unstructured-data">datos no estructurados</a>, como texto, imágenes, vídeos y audio, en vectores numéricos de alta dimensión denominados vectores de incrustación. Por ejemplo, podemos utilizar la red neuronal convolucional preentrenada ResNet-50 para transformar una imagen de un pájaro en una colección de incrustaciones con 2.048 dimensiones. Enumeramos aquí los tres primeros y los tres últimos elementos del vector: <code translate="no">[0.1392, 0.3572, 0.1988, ..., 0.2888, 0.6611, 0.2909]</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/bird_image_4a1be18f99.png" alt="A bird image by Patrice Bouchard" class="doc-image" id="a-bird-image-by-patrice-bouchard" />
   </span> <span class="img-wrapper"> <span>Imagen de un pájaro de Patrice Bouchard</span> </span></p>
<p>Tras generar los vectores de incrustación, los motores de búsqueda vectorial comparan la distancia espacial entre el vector de consulta de entrada y los vectores de los almacenes de vectores. Cuanto más cerca estén en el espacio, más parecidos serán.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_3732_20230510_073643_25f985523e.png" alt="Embedding arithmetic" class="doc-image" id="embedding-arithmetic" />
   </span> <span class="img-wrapper"> <span>Aritmética de la incrustación</span> </span></p>
<h2 id="Popular-vector-search-technologies" class="common-anchor-header">Tecnologías populares de búsqueda vectorial<button data-href="#Popular-vector-search-technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>Existen múltiples tecnologías de búsqueda vectorial en el mercado, incluyendo bibliotecas de aprendizaje automático como NumPy de Python, bibliotecas de búsqueda vectorial como FAISS, plugins de búsqueda vectorial construidos sobre bases de datos tradicionales y bases de datos vectoriales especializadas como Milvus y Zilliz Cloud.</p>
<h3 id="Machine-learning-libraries" class="common-anchor-header">Bibliotecas de aprendizaje automático</h3><p>El uso de bibliotecas de aprendizaje automático es la forma más sencilla de implementar búsquedas vectoriales. Por ejemplo, podemos utilizar NumPy de Python para implementar un algoritmo de vecino más cercano en menos de 20 líneas de código.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np

<span class="hljs-comment"># Function to calculate euclidean distance</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">euclidean_distance</span>(<span class="hljs-params">a, b</span>):
<span class="hljs-keyword">return</span> np.linalg.norm(a - b)

<span class="hljs-comment"># Function to perform knn</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">knn</span>(<span class="hljs-params">data, target, k</span>):
<span class="hljs-comment"># Calculate distances between target and all points in the data</span>
distances = [euclidean_distance(d, target) <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> data]
<span class="hljs-comment"># Combine distances with data indices</span>
distances = np.array(<span class="hljs-built_in">list</span>(<span class="hljs-built_in">zip</span>(distances, np.arange(<span class="hljs-built_in">len</span>(data)))))

<span class="hljs-comment"># Sort by distance</span>
sorted_distances = distances[distances[:, <span class="hljs-number">0</span>].argsort()]

<span class="hljs-comment"># Get the top k closest indices</span>
closest_k_indices = sorted_distances[:k, <span class="hljs-number">1</span>].astype(<span class="hljs-built_in">int</span>)

<span class="hljs-comment"># Return the top k closest vectors</span>
<span class="hljs-keyword">return</span> data[closest_k_indices]
<button class="copy-code-btn"></button></code></pre>
<p>Podemos generar 100 vectores bidimensionales y encontrar el vecino más cercano al vector [0,5, 0,5].</p>
<pre><code translate="no"><span class="hljs-comment"># Define some 2D vectors</span>
data = np.random.rand(<span class="hljs-number">100</span>, <span class="hljs-number">2</span>)

<span class="hljs-comment"># Define a target vector</span>
target = np.array([<span class="hljs-number">0.5</span>, <span class="hljs-number">0.5</span>])

<span class="hljs-comment"># Define k</span>
k = <span class="hljs-number">3</span>

<span class="hljs-comment"># Perform knn</span>
closest_vectors = knn(data, target, k)

<span class="hljs-comment"># Print the result</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;The closest vectors are:&quot;</span>)
<span class="hljs-built_in">print</span>(closest_vectors)
<button class="copy-code-btn"></button></code></pre>
<p>Las bibliotecas de aprendizaje automático, como NumPy de Python, ofrecen una gran flexibilidad a bajo coste. Sin embargo, tienen algunas limitaciones. Por ejemplo, sólo pueden manejar una pequeña cantidad de datos y no garantizan la persistencia de los datos.</p>
<p>Sólo recomiendo utilizar NumPy u otras bibliotecas de aprendizaje automático para la búsqueda vectorial cuando:</p>
<ul>
<li>Necesitas prototipado rápido.</li>
<li>No te importa la persistencia de los datos.</li>
<li>El tamaño de tus datos es inferior a un millón y no necesitas filtrado escalar.</li>
<li>No necesita un alto rendimiento.</li>
</ul>
<h3 id="Vector-search-libraries" class="common-anchor-header">Bibliotecas de búsqueda vectorial</h3><p>Las bibliotecas de búsqueda vectorial pueden ayudarle a crear rápidamente un prototipo de sistema de búsqueda vectorial de alto rendimiento. FAISS es un ejemplo típico. Es de código abierto y ha sido desarrollada por Meta para la búsqueda eficiente de similitudes y la agrupación de vectores densos. FAISS puede manejar colecciones de vectores de cualquier tamaño, incluso aquellas que no pueden cargarse completamente en memoria. Además, FAISS ofrece herramientas de evaluación y ajuste de parámetros. Aunque está escrito en C++, FAISS proporciona una interfaz Python/NumPy.</p>
<p>A continuación se muestra el código de un ejemplo de búsqueda vectorial basado en FAISS:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> faiss

<span class="hljs-comment"># Generate some example data</span>
dimension = <span class="hljs-number">64</span> <span class="hljs-comment"># dimension of the vector space</span>
database_size = <span class="hljs-number">10000</span> <span class="hljs-comment"># size of the database</span>
query_size = <span class="hljs-number">100</span> <span class="hljs-comment"># number of queries to perform</span>
np.random.seed(<span class="hljs-number">123</span>) <span class="hljs-comment"># make the random numbers predictable</span>

<span class="hljs-comment"># Generating vectors to index in the database (db_vectors)</span>
db_vectors = np.random.random((database_size, dimension)).astype(<span class="hljs-string">&#x27;float32&#x27;</span>)

<span class="hljs-comment"># Generating vectors for query (query_vectors)</span>
query_vectors = np.random.random((query_size, dimension)).astype(<span class="hljs-string">&#x27;float32&#x27;</span>)

<span class="hljs-comment"># Building the index</span>
index = faiss.IndexFlatL2(dimension) <span class="hljs-comment"># using the L2 distance metric</span>
<span class="hljs-built_in">print</span>(index.is_trained) <span class="hljs-comment"># should return True</span>

<span class="hljs-comment"># Adding vectors to the index</span>
index.add(db_vectors)
<span class="hljs-built_in">print</span>(index.ntotal) <span class="hljs-comment"># should return database_size (10000)</span>

<span class="hljs-comment"># Perform a search</span>
k = <span class="hljs-number">4</span> <span class="hljs-comment"># we want to see 4 nearest neighbors</span>
distances, indices = index.search(query_vectors, k)

<span class="hljs-comment"># Print the results</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Indices of nearest neighbors: \n&quot;</span>, indices)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nL2 distances to the nearest neighbors: \n&quot;</span>, distances)
<button class="copy-code-btn"></button></code></pre>
<p>Las bibliotecas de búsqueda vectorial como FAISS son fáciles de usar y lo suficientemente rápidas como para manejar entornos de producción a pequeña escala con millones de vectores. Se puede mejorar su rendimiento de consulta utilizando la cuantización y las GPU y reduciendo las dimensiones de los datos.</p>
<p>Sin embargo, estas bibliotecas tienen algunas limitaciones cuando se utilizan en producción. Por ejemplo, FAISS no admite la adición y eliminación de datos en tiempo real, las llamadas remotas, los lenguajes múltiples, el filtrado escalar, la escalabilidad o la recuperación ante desastres.</p>
<h3 id="Different-types-of-vector-databases" class="common-anchor-header">Diferentes tipos de bases de datos vectoriales</h3><p>Las bases de datos vectoriales han surgido para hacer frente a las limitaciones de las bibliotecas anteriores, proporcionando una solución más completa y práctica para las aplicaciones de producción.</p>
<p>Existen cuatro tipos de bases de datos vectoriales:</p>
<ul>
<li>Bases de datos relacionales o columnares existentes que incorporan un complemento de búsqueda vectorial. PG Vector es un ejemplo.</li>
<li>Motores de búsqueda tradicionales de índice invertido con soporte para indexación vectorial densa. <a href="https://zilliz.com/comparison/elastic-vs-milvus">ElasticSearch</a> es un ejemplo.</li>
<li>Bases de datos vectoriales ligeras construidas sobre bibliotecas de búsqueda vectorial. Chroma es un ejemplo.</li>
<li><strong>Bases de datos vectoriales específicas</strong>. Este tipo de base de datos está específicamente diseñada y optimizada para la búsqueda vectorial desde la base. Las bases de datos vectoriales específicas suelen ofrecer características más avanzadas, como computación distribuida, recuperación ante desastres y persistencia de datos. <a href="https://zilliz.com/what-is-milvus">Milvus</a> es uno de los principales ejemplos.</li>
</ul>
<p>No todas las bases de datos vectoriales son iguales. Cada pila tiene ventajas y limitaciones únicas, lo que las hace más o menos adecuadas para diferentes aplicaciones.</p>
<p>Yo prefiero las bases de datos vectoriales especializadas a otras soluciones porque son la opción más eficiente y conveniente, y ofrecen numerosas ventajas únicas. En las secciones siguientes, utilizaré Milvus como ejemplo para explicar las razones de mi preferencia.</p>
<h2 id="Key-benefits-of-purpose-built-vector-databases" class="common-anchor-header">Principales ventajas de las bases de datos vectoriales específicas<button data-href="#Key-benefits-of-purpose-built-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a> es una base de datos vectorial de código abierto, distribuida y creada específicamente para almacenar, indexar, gestionar y recuperar miles de millones de vectores de incrustación. También es una de las bases de datos vectoriales más populares para la <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">generación aumentada de recuperación LLM</a>. Como instancia ejemplar de bases de datos vectoriales construidas a propósito, Milvus comparte muchas ventajas únicas con sus homólogas.</p>
<h3 id="Data-Persistence-and-Cost-Effective-Storage" class="common-anchor-header">Persistencia de datos y almacenamiento rentable</h3><p>Aunque evitar la pérdida de datos es el requisito mínimo para una base de datos, muchas bases de datos vectoriales ligeras y de una sola máquina no dan prioridad a la fiabilidad de los datos. Por el contrario, las bases de datos vectoriales distribuidas creadas específicamente, como <a href="https://zilliz.com/what-is-milvus">Milvus</a>, dan prioridad a la resistencia del sistema, la escalabilidad y la persistencia de los datos mediante la separación del almacenamiento y el cálculo.</p>
<p>Además, la mayoría de las bases de datos vectoriales que utilizan índices de aproximación al vecino más cercano (RNA) necesitan mucha memoria para realizar búsquedas vectoriales, ya que cargan los índices RNA exclusivamente en memoria. Sin embargo, Milvus admite índices en disco, lo que hace que el almacenamiento sea más de diez veces más rentable que los índices en memoria.</p>
<h3 id="Optimal-Query-Performance" class="common-anchor-header">Rendimiento óptimo de las consultas</h3><p>Una base de datos vectorial especializada proporciona un rendimiento de consulta óptimo en comparación con otras opciones de búsqueda vectorial. Por ejemplo, Milvus es diez veces más rápido en el manejo de consultas que los plugins de búsqueda vectorial. Milvus utiliza el <a href="https://zilliz.com/glossary/anns">algoritmo ANN</a> en lugar del algoritmo de búsqueda brutal KNN para una búsqueda vectorial más rápida. Además, fragmenta sus índices, reduciendo el tiempo que se tarda en construir un índice a medida que aumenta el volumen de datos. Este enfoque permite a Milvus manejar fácilmente miles de millones de vectores con adiciones y supresiones de datos en tiempo real. Por el contrario, otros complementos de búsqueda vectorial sólo son adecuados para escenarios con menos de decenas de millones de datos y adiciones y supresiones poco frecuentes.</p>
<p>Milvus también es compatible con la aceleración por GPU. Las pruebas internas demuestran que la indexación vectorial acelerada en la GPU puede alcanzar más de 10.000 QPS cuando se buscan decenas de millones de datos, lo que es al menos diez veces más rápido que la indexación tradicional en la CPU para el rendimiento de las consultas en una sola máquina.</p>
<h3 id="System-Reliability" class="common-anchor-header">Fiabilidad del sistema</h3><p>Muchas aplicaciones utilizan bases de datos vectoriales para consultas en línea que requieren baja latencia de consulta y alto rendimiento. Estas aplicaciones exigen la conmutación por error de una sola máquina a nivel de minutos, y algunas incluso requieren la recuperación de desastres entre regiones para escenarios críticos. Las estrategias de replicación tradicionales basadas en Raft/Paxos sufren un grave despilfarro de recursos y necesitan ayuda para separar previamente los datos, lo que da lugar a una escasa fiabilidad. Por el contrario, Milvus tiene una arquitectura distribuida que aprovecha las colas de mensajes K8s para una alta disponibilidad, reduciendo el tiempo de recuperación y ahorrando recursos.</p>
<h3 id="Operability-and-Observability" class="common-anchor-header">Operabilidad y observabilidad</h3><p>Para prestar un mejor servicio a los usuarios empresariales, las bases de datos vectoriales deben ofrecer una serie de características de nivel empresarial para una mejor operabilidad y observabilidad. Milvus soporta múltiples métodos de despliegue, incluyendo K8s Operator y Helm chart, docker-compose, y pip install, haciéndolo accesible a usuarios con diferentes necesidades. Milvus también proporciona un sistema de monitorización y alarma basado en Grafana, Prometheus y Loki, mejorando su observabilidad. Con una arquitectura distribuida nativa de la nube, Milvus es la primera base de datos vectorial de la industria que admite aislamiento multitenant, RBAC, limitación de cuotas y actualizaciones continuas. Todos estos enfoques simplifican enormemente la gestión y supervisión de Milvus.</p>
<h2 id="Getting-started-with-Milvus-in-3-simple-steps-within-10-minutes" class="common-anchor-header">Empezar a utilizar Milvus en 3 sencillos pasos en 10 minutos<button data-href="#Getting-started-with-Milvus-in-3-simple-steps-within-10-minutes" class="anchor-icon" translate="no">
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
    </button></h2><p>Construir una base de datos vectorial es una tarea compleja, pero utilizar una es tan sencillo como usar Numpy y FAISS. Incluso los estudiantes no familiarizados con la IA pueden implementar la búsqueda vectorial basada en Milvus en sólo diez minutos. Para experimentar servicios de búsqueda vectorial altamente escalables y de alto rendimiento, siga estos tres pasos:</p>
<ul>
<li>Despliegue Milvus en su servidor con la ayuda del <a href="https://milvus.io/docs/install_standalone-docker.md">documento de despliegue de Milvus</a>.</li>
<li>Implemente la búsqueda vectorial con sólo 50 líneas de código consultando el <a href="https://milvus.io/docs/example_code.md">documento Hello Milvus</a>.</li>
<li>Explore los <a href="https://github.com/towhee-io/examples/">documentos de ejemplo de Towhee</a> para conocer <a href="https://zilliz.com/use-cases">casos de uso</a> populares <a href="https://zilliz.com/use-cases">de bases de datos vectoriales</a>.</li>
</ul>
