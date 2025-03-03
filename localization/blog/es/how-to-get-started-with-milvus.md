---
id: how-to-get-started-with-milvus.md
title: Cómo empezar con Milvus
author: Ruben Winastwan
date: 2025-01-17T00:00:00.000Z
cover: >-
  assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: false
canonicalUrl: 'https://milvus.io/blog/how-to-get-started-with-milvus.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png" alt="How to get started with Milvus" class="doc-image" id="how-to-get-started-with-milvus" />
   </span> <span class="img-wrapper"> <span>Cómo empezar con Milvus</span> </span></p>
<p><strong><em>Última actualización: enero de 2025</em></strong></p>
<p>Los avances en los grandes modelos lingüísticos (LLM<a href="https://zilliz.com/glossary/large-language-models-(llms)">)</a> y el creciente volumen de datos requieren una infraestructura flexible y escalable para almacenar cantidades masivas de información, como una base de datos. Sin embargo, <a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">las bases de datos tradicionales</a> están diseñadas para almacenar datos tabulares y estructurados, mientras que la información que suele ser útil para aprovechar la potencia de los sofisticados LLM y los algoritmos de recuperación de información es <a href="https://zilliz.com/learn/introduction-to-unstructured-data">no estructurada</a>, como texto, imágenes, vídeos o audio.</p>
<p><a href="https://zilliz.com/learn/what-is-vector-database">Las bases de datos vectoriales</a> son sistemas de bases de datos diseñados específicamente para datos no estructurados. Con las bases de datos vectoriales no sólo podemos almacenar cantidades masivas de datos no estructurados, sino que también podemos realizar <a href="https://zilliz.com/learn/vector-similarity-search">búsquedas vectoriales</a> con ellas. Las bases de datos vectoriales disponen de métodos de indexación avanzados, como el Índice de Archivos Invertido (IVFFlat) o el Hierarchical Navigable Small World<a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">(HNSW</a>), para realizar búsquedas vectoriales y procesos de recuperación de información rápidos y eficaces.</p>
<p><strong>Milvus</strong> es una base de datos vectorial de código abierto que podemos utilizar para aprovechar todas las características beneficiosas que puede ofrecer una base de datos vectorial. Esto es lo que cubriremos en este post:</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#What-is-Milvus">Una visión general de Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Milvus-Deployment-Options">Opciones de despliegue de Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Getting-Started-with-Milvus-Lite">Introducción a Milvus Lite</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Getting-Started-with-Milvus-Standalone">Primeros pasos con Milvus Standalone</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Fully-Managed-Milvus">Milvus totalmente gestionado </a></p></li>
</ul>
<h2 id="What-is-Milvus" class="common-anchor-header">¿Qué es Milvus?<button data-href="#What-is-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/overview.md"><strong>Milvus</strong> es </a>una base de datos vectorial de código abierto que nos permite almacenar cantidades masivas de datos no estructurados y realizar búsquedas vectoriales rápidas y eficientes en ellos. Milvus es muy útil para muchas aplicaciones GenAI populares, como sistemas de recomendación, chatbots personalizados, detección de anomalías, búsqueda de imágenes, procesamiento del lenguaje natural y generación aumentada de recuperación<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>).</p>
<p>Son varias las ventajas que puede obtener utilizando Milvus como base de datos vectorial:</p>
<ul>
<li><p>Milvus ofrece múltiples opciones de despliegue que puede elegir en función de su caso de uso y del tamaño de las aplicaciones que desee crear.</p></li>
<li><p>Milvus admite una amplia gama de métodos de indexación para satisfacer diversas necesidades de datos y rendimiento, incluidas opciones en memoria como FLAT, IVFFlat, HNSW y <a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">SCANN</a>, variantes cuantizadas para la eficiencia en memoria, <a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN</a> en disco para grandes conjuntos de datos e índices optimizados para GPU como GPU_CAGRA, GPU_IVF_FLAT y GPU_IVF_PQ para búsquedas aceleradas y eficientes en memoria.</p></li>
<li><p>Milvus también ofrece búsqueda híbrida, en la que podemos utilizar una combinación de incrustaciones densas, incrustaciones dispersas y filtrado de metadatos durante las operaciones de búsqueda vectorial, lo que conduce a resultados de recuperación más precisos. Además, <a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5</a> admite ahora una <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">búsqueda</a> híbrida <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">de texto completo</a> y búsqueda vectorial, lo que hace que su recuperación sea aún más precisa.</p></li>
<li><p>Milvus puede utilizarse completamente en la nube a través de <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, donde puede optimizar sus costes operativos y la velocidad de búsqueda vectorial gracias a cuatro funciones avanzadas: clústeres lógicos, desagregación de datos históricos y de flujo, almacenamiento por niveles, autoescalado y separación hot-cold multitenancy.</p></li>
</ul>
<p>Al utilizar Milvus como su base de datos vectorial, puede elegir tres opciones de despliegue diferentes, cada una con sus puntos fuertes y sus ventajas. Hablaremos de cada una de ellas en la siguiente sección.</p>
<h2 id="Milvus-Deployment-Options" class="common-anchor-header">Opciones de despliegue de Milvus<button data-href="#Milvus-Deployment-Options" class="anchor-icon" translate="no">
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
    </button></h2><p>Podemos elegir entre cuatro opciones de despliegue para empezar a utilizar Milvus: <strong>Milvus Lite, Milvus Standalone, Milvus Distributed y Zilliz Cloud (Milvus gestionado).</strong> Cada opción de despliegue está diseñada para adaptarse a varios escenarios en nuestro caso de uso, como el tamaño de nuestros datos, el propósito de nuestra aplicación y la escala de nuestra aplicación.</p>
<h3 id="Milvus-Lite" class="common-anchor-header">Milvus Lite</h3><p>Milvus<a href="https://milvus.io/docs/quickstart.md"><strong>Lite</strong></a> es una versión ligera de Milvus y la forma más sencilla de empezar. En la siguiente sección, veremos cómo podemos ejecutar Milvus Lite en acción, y todo lo que tenemos que hacer para empezar es instalar la biblioteca Pymilvus con pip. Después de eso, podemos realizar la mayoría de las funcionalidades básicas de Milvus como una base de datos vectorial.</p>
<p>Milvus Lite es perfecto para la creación rápida de prototipos o con fines de aprendizaje y se puede ejecutar en un cuaderno Jupyter sin ninguna configuración complicada. En términos de almacenamiento de vectores, Milvus Lite es adecuado para almacenar aproximadamente hasta un millón de incrustaciones vectoriales. Debido a su ligereza y capacidad de almacenamiento, Milvus Lite es una opción de despliegue perfecta para trabajar con dispositivos edge, como motor de búsqueda de documentos privados, detección de objetos en dispositivos, etc.</p>
<h3 id="Milvus-Standalone" class="common-anchor-header">Milvus Standalone</h3><p>Milvus Standalone es un despliegue de servidor de una sola máquina empaquetado en una imagen Docker. Por lo tanto, todo lo que tenemos que hacer para empezar es instalar Milvus en Docker, y luego iniciar el contenedor Docker. También veremos la implementación detallada de Milvus Standalone en la siguiente sección.</p>
<p>Milvus Standalone es ideal para construir y producir aplicaciones de pequeña a mediana escala, ya que es capaz de almacenar hasta 10M de incrustaciones vectoriales. Además, Milvus Standalone ofrece una alta disponibilidad a través de un modo de copia de seguridad primaria, por lo que es muy fiable para su uso en aplicaciones listas para la producción.</p>
<p>También podemos utilizar Milvus Standalone, por ejemplo, después de realizar prototipos rápidos y aprender las funcionalidades de Milvus con Milvus Lite, ya que tanto Milvus Standalone como Milvus Lite comparten la misma API del lado del cliente.</p>
<h3 id="Milvus-Distributed" class="common-anchor-header">Milvus Distribuido</h3><p>Milvus Distributed es una opción de despliegue que aprovecha una arquitectura basada en la nube, en la que la ingesta y la recuperación de datos se gestionan por separado, lo que permite una aplicación altamente escalable y eficiente.</p>
<p>Para ejecutar Milvus Distributed, normalmente necesitamos utilizar un clúster Kubernetes para permitir que el contenedor se ejecute en múltiples máquinas y entornos. La aplicación de un clúster Kubernetes garantiza la escalabilidad y flexibilidad de Milvus Distributed para personalizar los recursos asignados en función de la demanda y la carga de trabajo. Esto también significa que si una parte falla, otras pueden tomar el relevo, garantizando que todo el sistema permanezca ininterrumpido.</p>
<p>Milvus Distributed es capaz de manejar hasta decenas de miles de millones de incrustaciones vectoriales y está especialmente diseñado para casos de uso en los que los datos son demasiado grandes para ser almacenados en una sola máquina servidor. Por lo tanto, esta opción de despliegue es perfecta para clientes empresariales que atienden a una gran base de usuarios.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Vector_embedding_storage_capability_of_different_Milvus_deployment_options_e3959ccfcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: Capacidad de almacenamiento de incrustación vectorial de las diferentes opciones de despliegue de Milvus.</em></p>
<p>En este artículo, vamos a mostrarle cómo empezar tanto con Milvus Lite como con Milvus Standalone, ya que puede empezar rápidamente con ambos métodos sin una configuración complicada. Milvus Distributed, sin embargo, es más complicado de configurar. Una vez que configuramos Milvus Distributed, el código y el proceso lógico para crear colecciones, ingerir datos, realizar búsquedas vectoriales, etc. son similares a Milvus Lite y Milvus Standalone, ya que comparten la misma API del lado del cliente.</p>
<p>Además de las tres opciones de despliegue mencionadas anteriormente, también puede probar Milvus gestionado en <a href="https://zilliz.com/cloud">Zilliz Cloud</a> para disfrutar de una experiencia sin complicaciones. También hablaremos de Zilliz Cloud más adelante en este artículo.</p>
<h2 id="Getting-Started-with-Milvus-Lite" class="common-anchor-header">Primeros pasos con Milvus Lite<button data-href="#Getting-Started-with-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Lite puede implementarse directamente con Python importando una biblioteca llamada Pymilvus utilizando pip. Antes de instalar Pymilvus, asegúrese de que su entorno cumple los siguientes requisitos:</p>
<ul>
<li><p>Ubuntu &gt;= 20.04 (x86_64 y arm64)</p></li>
<li><p>MacOS &gt;= 11.0 (Apple Silicon M1/M2 y x86_64)</p></li>
<li><p>Python 3.7 o posterior</p></li>
</ul>
<p>Una vez cumplidos estos requisitos, puede instalar Milvus Lite y las dependencias necesarias para la demostración utilizando el siguiente comando:</p>
<pre><code translate="no">!pip install -U pymilvus
!pip install <span class="hljs-string">&quot;pymilvus[model]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p><code translate="no">!pip install -U pymilvus</code>: Este comando instala o actualiza la biblioteca <code translate="no">pymilvus</code>, el SDK Python de Milvus. Milvus Lite se incluye con PyMilvus, por lo que esta única línea de código es todo lo que necesita para instalar Milvus Lite.</p></li>
<li><p><code translate="no">!pip install &quot;pymilvus[model]&quot;</code>: Este comando añade funciones avanzadas y herramientas extra preintegradas con Milvus, incluyendo modelos de aprendizaje automático como Hugging Face Transformers, modelos de incrustación de Jina AI y modelos de reranking.</p></li>
</ul>
<p>Estos son los pasos que vamos a seguir con Milvus Lite:</p>
<ol>
<li><p>Transformar los datos de texto en su representación de incrustación utilizando un modelo de incrustación.</p></li>
<li><p>Crear un esquema en nuestra base de datos Milvus para almacenar nuestros datos de texto y sus representaciones de incrustación.</p></li>
<li><p>Almacenar e indexar nuestros datos en nuestro esquema.</p></li>
<li><p>Realizar una búsqueda vectorial simple en los datos almacenados.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Workflow_of_vector_search_operation_3e38ccc1f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: Flujo de trabajo de la operación de búsqueda vectorial.</em></p>
<p>Para transformar los datos de texto en incrustaciones vectoriales, utilizaremos un <a href="https://zilliz.com/ai-models">modelo de incrustación</a> de SentenceTransformers llamado 'all-MiniLM-L6-v2'. Este modelo de incrustación transforma nuestro texto en una incrustación vectorial de 384 dimensiones. Carguemos el modelo, transformemos nuestros datos de texto y empaquetémoslo todo.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model

docs = [
    <span class="hljs-string">&quot;Artificial intelligence was founded as an academic discipline in 1956.&quot;</span>,
    <span class="hljs-string">&quot;Alan Turing was the first person to conduct substantial research in AI.&quot;</span>,
    <span class="hljs-string">&quot;Born in Maida Vale, London, Turing was raised in southern England.&quot;</span>,
]

sentence_transformer_ef = model.dense.SentenceTransformerEmbeddingFunction(
    model_name=<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>, 
    device=<span class="hljs-string">&#x27;cpu&#x27;</span> 
)

vectors  = sentence_transformer_ef.encode_documents(docs)
data = [ {<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: vectors[i], <span class="hljs-string">&quot;text&quot;</span>: docs[i]} <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(vectors)) ]
<button class="copy-code-btn"></button></code></pre>
<p>A continuación, vamos a crear un esquema para almacenar todos los datos anteriores en Milvus. Como puede ver arriba, nuestros datos constan de tres campos: ID, vector y texto. Por lo tanto, vamos a crear un esquema con estos tres campos.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">True</span>,
)

<span class="hljs-comment"># Add fields to schema</span>
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;vector&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">384</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Con Milvus Lite, podemos crear fácilmente una colección en una base de datos particular basada en el esquema definido anteriormente, así como insertar e indexar los datos en la colección en sólo unas pocas líneas de código.</p>
<pre><code translate="no" class="language-python">client = MilvusClient(<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)

index_params = client.prepare_index_params()

<span class="hljs-comment">#  Add indexes</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>, 
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-comment"># Insert data into collection</span>
res = client.insert(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=data
)
<button class="copy-code-btn"></button></code></pre>
<p>En el código anterior, creamos una colección llamada &quot;demo_collection&quot; dentro de una base de datos Milvus llamada &quot;milvus_demo&quot;. A continuación, indexamos todos nuestros datos en la "demo_collection" que acabamos de crear.</p>
<p>Ahora que tenemos nuestros datos dentro de la base de datos, podemos realizar una búsqueda vectorial en ellos para cualquier consulta. Digamos que tenemos una consulta: &quot;<em>¿Quién es Alan Turing?</em>&quot;. Podemos obtener la respuesta más adecuada a la consulta ejecutando los siguientes pasos:</p>
<ol>
<li><p>Transformar nuestra consulta en una incrustación vectorial utilizando el mismo modelo de incrustación que utilizamos para transformar nuestros datos de la base de datos en incrustaciones.</p></li>
<li><p>Calcular la similitud entre la incrustación de nuestra consulta y la incrustación de cada entrada de la base de datos utilizando métricas como la similitud coseno o la distancia euclídea.</p></li>
<li><p>Obtener la entrada más similar como respuesta adecuada a nuestra consulta.</p></li>
</ol>
<p>A continuación se muestra la implementación de los pasos anteriores con Milvus:</p>
<pre><code translate="no" class="language-python">query = [<span class="hljs-string">&quot;Who is Alan Turing&quot;</span>]
query_embedding = sentence_transformer_ef.encode_queries(query)

<span class="hljs-comment"># Load collection</span>
client.load_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>
)

<span class="hljs-comment"># Vector search</span>
res = client.search(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=query_embedding,
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<span class="hljs-built_in">print</span>(res)
<span class="hljs-string">&quot;&quot;&quot;
Output:
data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.7199002504348755, &#x27;entity&#x27;: {&#x27;text&#x27;: &#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;}}]&quot;] 
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>¡Y eso es todo! También puede obtener más información sobre otras funcionalidades que ofrece Milvus, como la gestión de bases de datos, la inserción y eliminación de colecciones, la elección del método de indexación adecuado y la realización de búsquedas vectoriales más avanzadas con filtrado de metadatos y búsqueda híbrida en <a href="https://milvus.io/docs/">la documentación de Milvus</a>.</p>
<h2 id="Getting-Started-with-Milvus-Standalone" class="common-anchor-header">Primeros pasos con Milvus Standalone<button data-href="#Getting-Started-with-Milvus-Standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Standalone es una opción de despliegue en la que todo está empaquetado en un contenedor Docker. Por lo tanto, necesitamos instalar Milvus en Docker y luego iniciar el contenedor Docker para comenzar con Milvus Standalone.</p>
<p>Antes de instalar Milvus Standalone, asegúrese de que tanto su hardware como su software cumplen los requisitos descritos en <a href="https://milvus.io/docs/prerequisite-docker.md">esta página</a>. Además, asegúrese de que ha instalado Docker. Para instalar Docker, consulte <a href="https://docs.docker.com/get-started/get-docker/">esta página</a>.</p>
<p>Una vez que nuestro sistema cumple los requisitos y hemos instalado Docker, podemos proceder con la instalación de Milvus en Docker utilizando el siguiente comando:</p>
<pre><code translate="no" class="language-shell"><span class="hljs-comment"># Download the installation script</span>
$ curl -sfL &lt;https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh&gt; -o standalone_embed.sh

<span class="hljs-comment"># Start the Docker container</span>
$ bash standalone_embed.sh start
<button class="copy-code-btn"></button></code></pre>
<p>En el código anterior, también iniciamos el contenedor Docker y una vez iniciado, obtendremos una salida similar a la siguiente:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Message_after_successful_starting_of_the_Docker_container_5c60fa15dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: Mensaje tras el arranque con éxito del contenedor Docker.</em></p>
<p>Tras ejecutar el script de instalación "standalone_embed.sh" anterior, se inicia un contenedor Docker llamado "milvus" en el puerto 19530. Por lo tanto, podemos crear una nueva base de datos así como acceder a todo lo relacionado con la base de datos Milvus apuntando a este puerto al iniciar el cliente.</p>
<p>Digamos que queremos crear una base de datos llamada "milvus_demo", similar a lo que hemos hecho anteriormente en Milvus Lite. Podemos hacerlo de la siguiente manera:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>

client = <span class="hljs-title class_">MilvusClient</span>(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>,
)
client.<span class="hljs-title function_">create_database</span>(<span class="hljs-string">&quot;milvus_demo&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>A continuación, puede verificar si la base de datos recién creada llamada "milvus_demo" existe realmente en su instancia de Milvus accediendo a la <a href="https://milvus.io/docs/milvus-webui.md">interfaz web de Milvus</a>. Como su nombre indica, Milvus Web UI es una interfaz gráfica de usuario proporcionada por Milvus para observar las estadísticas y métricas de los componentes, comprobar la lista y los detalles de las bases de datos, colecciones y configuraciones. Puede acceder a Milvus Web UI una vez que haya iniciado el contenedor Docker anterior en http://127.0.0.1:9091/webui/.</p>
<p>Si accede al enlace anterior, verá una página de aterrizaje como ésta:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Landing_page_UI_187a40e935.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>En la pestaña "Colecciones", verá que nuestra base de datos "milvus_demo" se ha creado correctamente. Como puede ver, también puede comprobar otras cosas como la lista de colecciones, las configuraciones, las consultas realizadas, etc., con esta interfaz web.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Web_Ui_2_666eae57b1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ahora podemos realizar todo exactamente como hemos visto en la sección anterior de Milvus Lite. Vamos a crear una colección llamada "demo_collection" dentro de la base de datos "milvus_demo" que consta de tres campos, los mismos que teníamos en la sección Milvus Lite anterior. A continuación, insertaremos nuestros datos en la colección.</p>
<pre><code translate="no" class="language-python">index_params = client.prepare_index_params()

<span class="hljs-comment">#  Add indexes</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>, 
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-comment"># Insert data into collection</span>
res = client.insert(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=data
)
<button class="copy-code-btn"></button></code></pre>
<p>El código para realizar una operación de búsqueda vectorial también es el mismo que el de Milvus Lite, como puede ver en el código siguiente:</p>
<pre><code translate="no" class="language-python">query = [<span class="hljs-string">&quot;Who is Alan Turing&quot;</span>]
query_embedding = sentence_transformer_ef.encode_queries(query)

<span class="hljs-comment"># Load collection</span>
client.load_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>
)

<span class="hljs-comment"># Vector search</span>
res = client.search(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=query_embedding,
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<span class="hljs-built_in">print</span>(res)
<span class="hljs-string">&quot;&quot;&quot;
Output:
data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.7199004292488098, &#x27;entity&#x27;: {&#x27;text&#x27;: &#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;}}]&quot;] 
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Además de utilizar Docker, también puede utilizar Milvus Standalone con <a href="https://milvus.io/docs/install_standalone-docker-compose.md">Docker Compose</a> (para Linux) y <a href="https://milvus.io/docs/install_standalone-windows.md">Docker Desktop</a> (para Windows).</p>
<p>Cuando ya no estemos utilizando nuestra instancia de Milvus, podemos detener Milvus Standalone con el siguiente comando:</p>
<pre><code translate="no" class="language-shell">$ bash standalone_embed.sh stop
<button class="copy-code-btn"></button></code></pre>
<h2 id="Fully-Managed-Milvus" class="common-anchor-header">Milvus totalmente gestionado<button data-href="#Fully-Managed-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Una forma alternativa de comenzar con Milvus es a través de una infraestructura nativa basada en la nube en <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, donde puede obtener una experiencia 10 veces más rápida y sin complicaciones.</p>
<p>Zilliz Cloud ofrece clústeres dedicados con entornos y recursos dedicados para dar soporte a su aplicación de IA. Al tratarse de una base de datos basada en la nube y construida sobre Milvus, no es necesario configurar ni gestionar la infraestructura local. Zilliz Cloud también proporciona características más avanzadas, como la separación entre el almacenamiento vectorial y el cálculo, la copia de seguridad de datos en sistemas de almacenamiento de objetos populares como S3 y el almacenamiento en caché de datos para acelerar las operaciones de búsqueda y recuperación de vectores.</p>
<p>Sin embargo, algo que hay que tener en cuenta al considerar los servicios basados en la nube es el coste operativo. En la mayoría de los casos, seguimos teniendo que pagar incluso cuando el clúster está inactivo sin actividad de ingestión de datos o búsqueda vectorial. Si desea optimizar aún más el coste operativo y el rendimiento de su aplicación, Zilliz Cloud Serverless sería una excelente opción.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Key_benefits_of_using_Zilliz_Cloud_Serverless_20f68e0fff.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: Beneficios clave del uso de Zilliz Cloud Serverless.</em></p>
<p>Zilliz Cloud Serverless está disponible en los principales proveedores de nube como AWS, Azure y GCP. Ofrece características como precios de pago por uso, lo que significa que solo pagas cuando usas el clúster.</p>
<p>Zilliz Cloud Serverless también implementa tecnologías avanzadas como clústeres lógicos, autoescalado, almacenamiento por niveles, desagregación de datos históricos y en streaming, y separación de datos en caliente y en frío. Estas características permiten a Zilliz Cloud Serverless conseguir un ahorro de costes de hasta 50 veces y operaciones de búsqueda vectorial aproximadamente 10 veces más rápidas en comparación con Milvus en memoria.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Illustration_of_tiered_storage_and_hot_cold_data_separation_c634dfd211.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: Ilustración del almacenamiento por niveles y la separación de datos en caliente y en frío.</em></p>
<p>Si desea empezar a utilizar Zilliz Cloud Serverless, consulte <a href="https://zilliz.com/serverless">esta página</a> para obtener más información.</p>
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
    </button></h2><p>Milvus destaca como una base de datos vectorial versátil y potente diseñada para afrontar los retos de gestionar datos no estructurados y realizar operaciones de búsqueda vectorial rápidas y eficientes en aplicaciones de IA modernas. Con opciones de implementación como Milvus Lite para la creación rápida de prototipos, Milvus Standalone para aplicaciones de pequeña y mediana escala, y Milvus Distributed para la escalabilidad a nivel empresarial, ofrece flexibilidad para adaptarse al tamaño y la complejidad de cualquier proyecto.</p>
<p>Además, Zilliz Cloud Serverless amplía las capacidades de Milvus a la nube y proporciona un modelo rentable de pago por uso que elimina la necesidad de infraestructura local. Con funciones avanzadas como el almacenamiento por niveles y el autoescalado, Zilliz Cloud Serverless garantiza operaciones de búsqueda vectorial más rápidas a la vez que optimiza los costes.</p>
