---
id: data-in-and-data-out-in-milvus-2-6.md
title: >-
  Presentación de la función de incrustación: Cómo Milvus 2.6 agiliza la
  vectorización y la búsqueda semántica
author: Xuqi Yang
date: 2025-12-03T00:00:00.000Z
cover: assets.zilliz.com/data_in_data_out_cover_0783504ea4.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database, embedding, vector search'
meta_title: >
  Introducing the Embedding Function: How Milvus 2.6 Streamlines Vectorization
  and Semantic Search
desc: >-
  Descubra cómo Milvus 2.6 simplifica el proceso de incrustación y la búsqueda
  vectorial con Data-in, Data-out. Gestiona automáticamente la incrustación y la
  reordenación, sin necesidad de preprocesamiento externo.
origin: 'https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md'
---
<p>Si alguna vez has creado una aplicación de búsqueda vectorial, ya conoces el flujo de trabajo demasiado bien. Antes de almacenar los datos, hay que transformarlos en vectores mediante un modelo de incrustación, limpiarlos, formatearlos y, por último, introducirlos en la base de datos vectorial. Cada consulta pasa también por el mismo proceso: incrustar la entrada, ejecutar una búsqueda de similitud y, a continuación, asignar los ID resultantes a los documentos o registros originales. Funciona, pero crea una maraña distribuida de secuencias de comandos de preprocesamiento, conductos de incrustación y código de cola que hay que mantener.</p>
<p><a href="https://milvus.io/">Milvus</a>, una base de datos vectorial de código abierto de alto rendimiento, da ahora un gran paso hacia la simplificación de todo esto. <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a> introduce la <strong>función Data-in, Data-out (también conocida como</strong> <a href="https://milvus.io/docs/embedding-function-overview.md#Embedding-Function-Overview"><strong>función de incrustación</strong></a><strong>)</strong>, una capacidad de incrustación integrada que se conecta directamente a los principales proveedores de modelos como OpenAI, AWS Bedrock, Google Vertex AI y Hugging Face. En lugar de gestionar su propia infraestructura de incrustación, Milvus puede ahora llamar a estos modelos por usted. También puede insertar y consultar utilizando texto sin formato - y pronto otros tipos de datos - mientras Milvus maneja automáticamente la vectorización en el momento de la escritura y la consulta.</p>
<p>En el resto de este artículo, veremos más de cerca cómo funciona Data-in, Data-out, cómo configurar los proveedores y las funciones de incrustación, y cómo puede utilizarlo para agilizar sus flujos de trabajo de búsqueda vectorial de principio a fin.</p>
<h2 id="What-is-Data-in-Data-out" class="common-anchor-header">¿Qué es Data-in, Data-out?<button data-href="#What-is-Data-in-Data-out" class="anchor-icon" translate="no">
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
    </button></h2><p>Data-in, Data-out en Milvus 2.6 está construido sobre el nuevo módulo Function - un marco que permite a Milvus manejar la transformación de datos y la generación de incrustaciones internamente, sin ningún servicio externo de preprocesamiento. (Puede seguir la propuesta de diseño en <a href="https://github.com/milvus-io/milvus/issues/35856">GitHub issue #35856</a>.) Con este módulo, Milvus puede tomar datos de entrada sin procesar, llamar directamente a un proveedor de incrustación y escribir automáticamente los vectores resultantes en su colección.</p>
<p>A un alto nivel, el módulo <strong>Function</strong> convierte la generación de incrustación en una capacidad de base de datos nativa. En lugar de ejecutar tuberías de incrustación separadas, trabajadores en segundo plano o servicios reranker, Milvus ahora envía solicitudes a su proveedor configurado, recupera incrustaciones y las almacena junto con sus datos, todo dentro de la ruta de ingestión. Esto elimina la sobrecarga operativa de gestionar su propia infraestructura de incrustación.</p>
<p>Data-in, Data-out introduce tres mejoras importantes en el flujo de trabajo de Milvus:</p>
<ul>
<li><p><strong>Inserción directa de datos sin procesar</strong>: ahora puede insertar texto, imágenes u otros tipos de datos sin procesar directamente en Milvus. No es necesario convertirlos previamente en vectores.</p></li>
<li><p><strong>Configure una función de incrustación</strong> - Una vez configurado un modelo de incrustación en Milvus, éste gestiona automáticamente todo el proceso de incrustación. Milvus se integra perfectamente con una gama de proveedores de modelos, incluyendo OpenAI, AWS Bedrock, Google Vertex AI, Cohere y Hugging Face.</p></li>
<li><p><strong>Consulta con entradas sin procesar</strong> - Ahora puede realizar búsquedas semánticas utilizando texto sin procesar u otras consultas basadas en contenido. Milvus utiliza el mismo modelo configurado para generar incrustaciones sobre la marcha, realizar búsquedas por similitud y devolver resultados relevantes.</p></li>
</ul>
<p>En resumen, Milvus ahora incrusta automáticamente - y opcionalmente reordena - sus datos. La vectorización se convierte en una función integrada en la base de datos, eliminando la necesidad de servicios de incrustación externos o de lógica de preprocesamiento personalizada.</p>
<h2 id="How-Data-in-Data-out-Works" class="common-anchor-header">Cómo funciona Data-in, Data-out<button data-href="#How-Data-in-Data-out-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>El siguiente diagrama ilustra cómo funciona Data-in, Data-out dentro de Milvus.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/diagram_data_in_data_out_4c9e06c884.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>El flujo de trabajo Data-in, Data-out puede dividirse en seis pasos principales:</p>
<ol>
<li><p><strong>Entrada de datos</strong> - El usuario inserta datos sin procesar - como texto, imágenes u otros tipos de contenido - directamente en Milvus sin realizar ningún preprocesamiento externo.</p></li>
<li><p><strong>Generar inc</strong> rustaciones - El módulo Function invoca automáticamente el modelo de incrustación configurado a través de su API de terceros, convirtiendo la entrada bruta en incrustaciones vectoriales en tiempo real.</p></li>
<li><p><strong>Almacenar inc</strong> rustaciones - Milvus escribe las incrustaciones generadas en el campo vectorial designado dentro de su colección, donde están disponibles para operaciones de búsqueda de similitud.</p></li>
<li><p><strong>Enviar una consulta</strong> - El usuario envía a Milvus una consulta de texto sin procesar o basada en el contenido, igual que en la etapa de entrada.</p></li>
<li><p><strong>Búsqueda semántica</strong> - Milvus incorpora la consulta utilizando el mismo modelo configurado, ejecuta una búsqueda de similitud sobre los vectores almacenados y determina las coincidencias semánticas más cercanas.</p></li>
<li><p><strong>Devolución de resultados</strong> - Milvus devuelve directamente a la aplicación los k resultados más similares, asignados a sus datos originales.</p></li>
</ol>
<h2 id="How-to-Configure-Data-in-Data-out" class="common-anchor-header">Cómo configurar Data-in, Data-out<button data-href="#How-to-Configure-Data-in-Data-out" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">Requisitos previos</h3><ul>
<li><p>Instale la última versión de <strong>Milvus 2.6</strong>.</p></li>
<li><p>Prepare su clave API de incrustación de un proveedor compatible (por ejemplo, OpenAI, AWS Bedrock o Cohere). En este ejemplo, utilizaremos <strong>Cohere</strong> como proveedor de incrustación.</p></li>
</ul>
<h3 id="Modify-the-milvusyaml-Configuration" class="common-anchor-header">Modifique la configuración de <code translate="no">milvus.yaml</code> </h3><p>Si está ejecutando Milvus con <strong>Docker Compose</strong>, necesitará modificar el archivo <code translate="no">milvus.yaml</code> para habilitar el módulo Function. Puede consultar la documentación oficial como guía: <a href="https://milvus.io/docs/configure-docker.md?tab=component#Download-a-configuration-file">Configure Milvus with Docker Comp</a> ose (También puede encontrar instrucciones para otros métodos de despliegue aquí).</p>
<p>En el archivo de configuración, localice las secciones <code translate="no">credential</code> y <code translate="no">function</code>.</p>
<p>A continuación, actualice los campos <code translate="no">apikey1.apikey</code> y <code translate="no">providers.cohere</code>.</p>
<pre><code translate="no">...
credential:
  aksk1:
    access_key_id:  <span class="hljs-comment"># Your access_key_id</span>
    secret_access_key:  <span class="hljs-comment"># Your secret_access_key</span>
  apikey1:
    apikey: <span class="hljs-string">&quot;***********************&quot;</span> <span class="hljs-comment"># Edit this section</span>
  gcp1:
    credential_json:  <span class="hljs-comment"># base64 based gcp credential data</span>
<span class="hljs-comment"># Any configuration related to functions</span>
function:
  textEmbedding:
    providers:
                        ...
      cohere: <span class="hljs-comment"># Edit the section below</span>
        credential:  apikey1 <span class="hljs-comment"># The name in the crendential configuration item</span>
        enable: true <span class="hljs-comment"># Whether to enable cohere model service</span>
        url:  <span class="hljs-string">&quot;https://api.cohere.com/v2/embed&quot;</span> <span class="hljs-comment"># Your cohere embedding url, Default is the official embedding url</span>
      ...
...
<button class="copy-code-btn"></button></code></pre>
<p>Una vez realizados estos cambios, reinicie Milvus para aplicar la configuración actualizada.</p>
<h2 id="How-to-Use-the-Data-in-Data-out-Feature" class="common-anchor-header">Cómo utilizar la función de entrada y salida de datos<button data-href="#How-to-Use-the-Data-in-Data-out-Feature" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Define-the-Schema-for-the-Collection" class="common-anchor-header">1. 1. Definir el esquema de la colección</h3><p>Para habilitar la función de incrustación, el <strong>esquema</strong> de su colección debe incluir al menos tres campos:</p>
<ul>
<li><p><strong>Campo de clave primaria (</strong><code translate="no">id</code> ) - Identifica de forma única cada entidad de la colección.</p></li>
<li><p><strong>Campo escalar (</strong><code translate="no">document</code> ) - Almacena los datos originales sin procesar.</p></li>
<li><p><strong>Campo vectorial (</strong><code translate="no">dense</code> ) - Almacena las incrustaciones vectoriales generadas.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType
<span class="hljs-comment"># Initialize Milvus client</span>
client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
)
<span class="hljs-comment"># Create a new schema for the collection</span>
schema = client.create_schema()
<span class="hljs-comment"># Add primary field &quot;id&quot;</span>
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">False</span>)
<span class="hljs-comment"># Add scalar field &quot;document&quot; for storing textual data</span>
schema.add_field(<span class="hljs-string">&quot;document&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">9000</span>)
<span class="hljs-comment"># Add vector field &quot;dense&quot; for storing embeddings.</span>
<span class="hljs-comment"># IMPORTANT: Set `dim` to match the exact output dimension of the embedding model.</span>
<span class="hljs-comment"># For instance, OpenAI&#x27;s text-embedding-3-small model outputs 1536-dimensional vectors.</span>
<span class="hljs-comment"># For dense vector, data type can be FLOAT_VECTOR or INT8_VECTOR</span>
schema.add_field(<span class="hljs-string">&quot;dense&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>) <span class="hljs-comment"># Set dim according to the embedding model you use.</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Define-the-Embedding-Function" class="common-anchor-header">2. Definir la función de incrustación</h3><p>A continuación, defina la <strong>función de inc</strong> rustación en el esquema.</p>
<ul>
<li><p><code translate="no">name</code> - Un identificador único para la función.</p></li>
<li><p><code translate="no">function_type</code> - Establézcalo en <code translate="no">FunctionType.TEXTEMBEDDING</code> para incrustaciones de texto. Milvus también admite otros tipos de función como <code translate="no">FunctionType.BM25</code> y <code translate="no">FunctionType.RERANK</code>. Consulte <a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">Búsqueda de texto completo</a> y <a href="https://milvus.io/docs/decay-ranker-overview.md#Decay-Ranker-Overview">descripción general del clasificador de descomposición</a> para obtener más detalles.</p></li>
<li><p><code translate="no">input_field_names</code> - Define el campo de entrada para datos sin procesar (<code translate="no">document</code>).</p></li>
<li><p><code translate="no">output_field_names</code> - Define el campo de salida donde se almacenarán las incrustaciones vectoriales (<code translate="no">dense</code>).</p></li>
<li><p><code translate="no">params</code> - Contiene parámetros de configuración para la función de incrustación. Los valores de <code translate="no">provider</code> y <code translate="no">model_name</code> deben coincidir con las entradas correspondientes del archivo de configuración <code translate="no">milvus.yaml</code>.</p></li>
</ul>
<p><strong>Nota:</strong> Cada función debe tener un único <code translate="no">name</code> y <code translate="no">output_field_names</code> para distinguir diferentes lógicas de transformación y evitar conflictos.</p>
<pre><code translate="no"><span class="hljs-comment"># Define embedding function (example: OpenAI provider)</span>
text_embedding_function = Function(
    name=<span class="hljs-string">&quot;cohere_embedding&quot;</span>,                  <span class="hljs-comment"># Unique identifier for this embedding function</span>
    function_type=FunctionType.TEXTEMBEDDING, <span class="hljs-comment"># Type of embedding function</span>
    input_field_names=[<span class="hljs-string">&quot;document&quot;</span>],           <span class="hljs-comment"># Scalar field to embed</span>
    output_field_names=[<span class="hljs-string">&quot;dense&quot;</span>],             <span class="hljs-comment"># Vector field to store embeddings</span>
    params={                                  <span class="hljs-comment"># Provider-specific configuration (highest priority)</span>
        <span class="hljs-string">&quot;provider&quot;</span>: <span class="hljs-string">&quot;cohere&quot;</span>,                 <span class="hljs-comment"># Embedding model provider</span>
        <span class="hljs-string">&quot;model_name&quot;</span>: <span class="hljs-string">&quot;embed-v4.0&quot;</span>,     <span class="hljs-comment"># Embedding model</span>
        <span class="hljs-comment"># &quot;credential&quot;: &quot;apikey1&quot;,            # Optional: Credential label</span>
        <span class="hljs-comment"># Optional parameters:</span>
        <span class="hljs-comment"># &quot;dim&quot;: &quot;1536&quot;,       # Optionally shorten the vector dimension</span>
        <span class="hljs-comment"># &quot;user&quot;: &quot;user123&quot;    # Optional: identifier for API tracking</span>
    }
)
<span class="hljs-comment"># Add the embedding function to your schema</span>
schema.add_function(text_embedding_function)
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Configure-the-Index" class="common-anchor-header">3. Configurar el índice</h3><p>Una vez definidos los campos y las funciones, cree un índice para la colección. Para simplificar, utilizamos aquí como ejemplo el tipo AUTOINDEX.</p>
<pre><code translate="no"><span class="hljs-comment"># Prepare index parameters</span>
index_params = client.prepare_index_params()
<span class="hljs-comment"># Add AUTOINDEX to automatically select optimal indexing method</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;dense&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span> 
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Create-the-Collection" class="common-anchor-header">4. Crear la colección</h3><p>Utilice el esquema y el índice definidos para crear una nueva colección. En este ejemplo, crearemos una colección llamada Demo.</p>
<pre><code translate="no"><span class="hljs-comment"># Create collection named &quot;demo&quot;</span>
client.create_collection(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>, 
    schema=schema, 
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Insert-Data" class="common-anchor-header">5. Insertar datos</h3><p>Ahora puede insertar datos sin procesar directamente en Milvus - no hay necesidad de generar incrustaciones manualmente.</p>
<pre><code translate="no"><span class="hljs-comment"># Insert sample documents</span>
client.insert(<span class="hljs-string">&#x27;demo&#x27;</span>, [
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">1</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Milvus simplifies semantic search through embeddings.&#x27;</span>},
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">2</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Vector embeddings convert text into searchable numeric data.&#x27;</span>},
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">3</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Semantic search helps users find relevant information quickly.&#x27;</span>},
])
<button class="copy-code-btn"></button></code></pre>
<h3 id="6-Perform-Vector-Search" class="common-anchor-header">6. 6. Realizar búsqueda vectorial</h3><p>Después de insertar los datos, puede realizar búsquedas directamente utilizando consultas de texto sin procesar. Milvus convierte automáticamente su consulta en una incrustación, realiza una búsqueda de similitud contra vectores almacenados y devuelve las coincidencias más altas.</p>
<pre><code translate="no"><span class="hljs-comment"># Perform semantic search</span>
results = client.search(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>, 
    data=[<span class="hljs-string">&#x27;How does Milvus handle semantic search?&#x27;</span>], <span class="hljs-comment"># Use text query rather than query vector</span>
    anns_field=<span class="hljs-string">&#x27;dense&#x27;</span>,   <span class="hljs-comment"># Use the vector field that stores embeddings</span>
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&#x27;document&#x27;</span>],
)
<span class="hljs-built_in">print</span>(results)
<span class="hljs-comment"># Example output:</span>
<span class="hljs-comment"># data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.8821347951889038, &#x27;entity&#x27;: {&#x27;document&#x27;: &#x27;Milvus simplifies semantic search through embeddings.&#x27;}}]&quot;]</span>
<button class="copy-code-btn"></button></code></pre>
<p>Para más detalles sobre la búsqueda vectorial, véase: <a href="https://milvus.io/docs/single-vector-search.md">Búsqueda vectorial básica </a>y <a href="https://milvus.io/docs/get-and-scalar-query.md">API de consulta</a>.</p>
<h2 id="Get-Started-with-Milvus-26" class="common-anchor-header">Empezar con Milvus 2.6<button data-href="#Get-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Con Data-in, Data-out, Milvus 2.6 lleva la simplicidad de la búsqueda vectorial al siguiente nivel. Al integrar las funciones de incrustación y reordenación directamente en Milvus, ya no necesitará gestionar el preprocesamiento externo ni mantener servicios de incrustación independientes.</p>
<p>¿Listo para probarlo? Instale <a href="https://milvus.io/docs">Milvus</a> 2.6 hoy mismo y experimente por sí mismo la potencia de Data-in, Data-out.</p>
<p>¿Tiene alguna pregunta o desea profundizar en alguna función? Únase a nuestro<a href="https://discord.com/invite/8uyFbECzPX"> canal Discord</a> o presente incidencias en<a href="https://github.com/milvus-io/milvus"> GitHub</a>. También puede reservar una sesión individual de 20 minutos para obtener información, orientación y respuestas a sus preguntas a través de<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Más información sobre las características de Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Presentación de Milvus 2.6: Búsqueda vectorial asequible a escala de miles de millones</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">JSON Shredding en Milvus: Filtrado JSON 88,9 veces más rápido con flexibilidad</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Desbloqueo de la verdadera recuperación a nivel de entidad: Nuevas funciones Array-of-Structs y MAX_SIM en Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH en Milvus: El arma secreta para combatir los duplicados en los datos de formación LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Llevar la compresión vectorial al extremo: cómo Milvus sirve 3 veces más consultas con RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Los puntos de referencia mienten: las bases de datos vectoriales merecen una prueba real </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Sustituimos Kafka/Pulsar por un Woodpecker para Milvus </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Búsqueda vectorial en el mundo real: cómo filtrar eficazmente sin matar la recuperación </a></p></li>
</ul>
