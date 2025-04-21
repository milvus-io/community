---
id: >-
  introducing-milvus-sdk-v2-native-async-support-unified-apis-and-superior-performance.md
title: >-
  Presentamos Milvus SDK v2: Compatibilidad nativa con Async, API unificadas y
  rendimiento superior
author: Ken Zhang
date: 2025-04-16T00:00:00.000Z
desc: >-
  Experimente Milvus SDK v2, ¡reimaginado para desarrolladores! Disfrute de una
  API unificada, soporte nativo async y rendimiento mejorado para sus proyectos
  de búsqueda vectorial.
cover: assets.zilliz.com/Introducing_Milvus_SDK_v2_05c9e5e8b2.png
tag: Engineering
tags: 'Milvus SDK v2, Async Support, Milvus vector database'
canonicalUrl: >-
  https://milvus.io/blog/introducing-milvus-sdk-v2-native-async-support-unified-apis-and-superior-performance.md
---
<h2 id="TLDR" class="common-anchor-header">RESUMEN<button data-href="#TLDR" class="anchor-icon" translate="no">
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
    </button></h2><p>Usted ha hablado y nosotros le hemos escuchado. Milvus SDK v2 es una reimaginación completa de nuestra experiencia de desarrollador, construida directamente a partir de sus comentarios. Con una API unificada a través de Python, Java, Go y Node.js, soporte nativo async que ha estado pidiendo, una caché de esquema que mejora el rendimiento y una interfaz MilvusClient simplificada, Milvus SDK v2 hace que el desarrollo de <a href="https://zilliz.com/learn/vector-similarity-search">búsqueda vectorial</a> sea más rápido e intuitivo que nunca. Tanto si está creando aplicaciones <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>, sistemas de recomendación o soluciones <a href="https://zilliz.com/learn/what-is-computer-vision">de visión por ordenador</a>, esta actualización impulsada por la comunidad transformará su forma de trabajar con Milvus.</p>
<h2 id="Why-We-Built-It-Addressing-Community-Pain-Points" class="common-anchor-header">Por qué lo creamos: Abordar los puntos débiles de la comunidad<button data-href="#Why-We-Built-It-Addressing-Community-Pain-Points" class="anchor-icon" translate="no">
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
    </button></h2><p>A lo largo de los años, Milvus se ha convertido en la <a href="https://milvus.io/blog/what-is-a-vector-database.md">base de datos vectorial</a> elegida por miles de aplicaciones de IA. Sin embargo, a medida que nuestra comunidad crecía, escuchamos constantemente acerca de varias limitaciones con nuestro SDK v1:</p>
<p><strong>"Manejar alta concurrencia es demasiado complejo".</strong> La falta de soporte nativo async en algunos SDK de lenguajes obligaba a los desarrolladores a depender de hilos o callbacks, lo que hacía que el código fuera más difícil de gestionar y depurar, especialmente en escenarios como la carga de datos por lotes y las consultas paralelas.</p>
<p><strong>"El rendimiento se degrada con la escala".</strong> Sin una caché de esquemas, v1 validaba repetidamente los esquemas durante las operaciones, creando cuellos de botella para cargas de trabajo de gran volumen. En los casos de uso que requerían un procesamiento vectorial masivo, este problema provocaba un aumento de la latencia y una reducción del rendimiento.</p>
<p><strong>"Las interfaces inconsistentes entre lenguajes crean una pronunciada curva de aprendizaje".</strong> Los SDK de los distintos lenguajes implementaban las interfaces a su manera, lo que complicaba el desarrollo entre lenguajes.</p>
<p><strong>"A la API RESTful le faltan funciones esenciales".</strong> Funcionalidades críticas como la gestión de particiones y la construcción de índices no estaban disponibles, obligando a los desarrolladores a cambiar entre diferentes SDKs.</p>
<p>No se trataba sólo de peticiones de funciones, sino de obstáculos reales en su flujo de trabajo de desarrollo. SDK v2 es nuestra promesa de eliminar estas barreras y permitirle centrarse en lo que importa: crear aplicaciones de IA asombrosas.</p>
<h2 id="The-Solution-Milvus-SDK-v2" class="common-anchor-header">La solución: Milvus SDK v2<button data-href="#The-Solution-Milvus-SDK-v2" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus SDK v2 es el resultado de un rediseño completo centrado en la experiencia del desarrollador, disponible en múltiples lenguajes:</p>
<ul>
<li><p><a href="https://milvus.io/api-reference/pymilvus/v2.5.x/About.md">Python SDK v2 (pymilvus.MilvusClient)</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-sdk-java">Java v2</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus/tree/client/v2.5.1/client">Go v2</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-sdk-node">NodeJS</a></p></li>
<li><p><a href="https://milvus.io/api-reference/restful/v2.5.x/About.md">RESTful v2</a></p></li>
</ul>
<h3 id="1-Native-Asynchronous-Support-From-Complex-to-Concurrent" class="common-anchor-header">1. Soporte asíncrono nativo: De complejo a concurrente</h3><p>La antigua forma de manejar la concurrencia implicaba engorrosos objetos Future y patrones callback. SDK v2 introduce una verdadera funcionalidad async/await, particularmente en Python con <code translate="no">AsyncMilvusClient</code> (desde v2.5.3). Con los mismos parámetros que el MilvusClient síncrono, puede ejecutar fácilmente operaciones como inserción, consulta y búsqueda en paralelo.</p>
<p>Este enfoque simplificado sustituye a los antiguos y engorrosos patrones Future y callback, dando lugar a un código más limpio y eficiente. La lógica concurrente compleja, como las inserciones de vectores por lotes o las consultas múltiples paralelas, ahora se pueden implementar sin esfuerzo utilizando herramientas como <code translate="no">asyncio.gather</code>.</p>
<h3 id="2-Schema-Cache-Boosting-Performance-Where-It-Counts" class="common-anchor-header">2. Caché de esquemas: Aumento del rendimiento donde más importa</h3><p>SDK v2 introduce una caché de esquemas que almacena los esquemas de las colecciones localmente después de la búsqueda inicial, lo que elimina las repetidas solicitudes de red y la sobrecarga de la CPU durante las operaciones.</p>
<p>Para escenarios de inserción y consulta de alta frecuencia, esta actualización se traduce en:</p>
<ul>
<li><p>Reducción del tráfico de red entre el cliente y el servidor</p></li>
<li><p>Menor latencia de las operaciones</p></li>
<li><p>Menor uso de la CPU del servidor</p></li>
<li><p>Mejor escalabilidad en condiciones de alta concurrencia</p></li>
</ul>
<p>Esto es especialmente valioso para aplicaciones como los sistemas de recomendación en tiempo real o las funciones de búsqueda en directo, donde los milisegundos importan.</p>
<h3 id="3-A-Unified-and-Streamlined-API-Experience" class="common-anchor-header">3. Una experiencia API unificada y racionalizada</h3><p>Milvus SDK v2 introduce una experiencia API unificada y más completa en todos los lenguajes de programación compatibles. En particular, la API RESTful se ha mejorado significativamente para ofrecer casi paridad de características con la interfaz gRPC.</p>
<p>En versiones anteriores, la API RESTful iba por detrás de gRPC, lo que limitaba lo que los desarrolladores podían hacer sin cambiar de interfaz. Esto ya no es así. Ahora, los desarrolladores pueden utilizar la API RESTful para realizar prácticamente todas las operaciones básicas, como crear colecciones, gestionar particiones, crear índices y ejecutar consultas, sin necesidad de recurrir a gRPC u otros métodos.</p>
<p>Este enfoque unificado garantiza una experiencia coherente para los desarrolladores en distintos entornos y casos de uso. Reduce la curva de aprendizaje, simplifica la integración y mejora la usabilidad general.</p>
<p>Nota: Para la mayoría de los usuarios, la API RESTful ofrece una forma más rápida y sencilla de empezar a utilizar Milvus. Sin embargo, si su aplicación exige un alto rendimiento o características avanzadas como iteradores, el cliente gRPC sigue siendo la opción a la que recurrir para obtener la máxima flexibilidad y control.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RES_Tful_8520a80a8e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="4-Aligned-SDK-Design-Across-All-Languages" class="common-anchor-header">4. Diseño SDK alineado en todos los idiomas</h3><p>Con Milvus SDK v2, hemos estandarizado el diseño de nuestros SDK en todos los lenguajes de programación compatibles para ofrecer una experiencia más coherente al desarrollador.</p>
<p>Ya sea que esté construyendo con Python, Java, Go o Node.js, cada SDK ahora sigue una estructura unificada centrada alrededor de la clase MilvusClient. Este rediseño aporta coherencia a la denominación de los métodos, el formato de los parámetros y los patrones generales de uso en todos los lenguajes compatibles. (Ver: <a href="https://github.com/milvus-io/milvus/discussions/33979">Actualización del ejemplo de código MilvusClient SDK - GitHub Discussion #33979</a>)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_Client_9a4a6da9e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ahora, una vez que esté familiarizado con Milvus en un idioma, puede cambiar fácilmente a otro sin tener que volver a aprender cómo funciona el SDK. Esta alineación no solo simplifica la incorporación, sino que también hace que el desarrollo en varios idiomas sea mucho más fluido e intuitivo.</p>
<h3 id="5-A-Simpler-Smarter-PyMilvus-Python-SDK-with-MilvusClient" class="common-anchor-header">5. Un PyMilvus (Python SDK) más simple e inteligente con <code translate="no">MilvusClient</code></h3><p>En la versión anterior, PyMilvus se basaba en un diseño estilo ORM que introducía una mezcla de enfoques orientados a objetos y procedimentales. Los desarrolladores tenían que definir objetos <code translate="no">FieldSchema</code>, construir un <code translate="no">CollectionSchema</code>, y luego instanciar una clase <code translate="no">Collection</code> -todo ello sólo para crear una colección. Este proceso no sólo era verborreico, sino que también introducía una curva de aprendizaje más pronunciada para los nuevos usuarios.</p>
<p>Con la nueva interfaz <code translate="no">MilvusClient</code>, las cosas son mucho más sencillas. Ahora puede crear una colección en un solo paso utilizando el método <code translate="no">create_collection()</code>. Le permite definir rápidamente el esquema pasando parámetros como <code translate="no">dimension</code> y <code translate="no">metric_type</code>, o también puede utilizar un objeto de esquema personalizado si es necesario.</p>
<p>Aún mejor, <code translate="no">create_collection()</code> admite la creación de índices como parte de la misma llamada. Si se proporcionan parámetros de índice, Milvus creará automáticamente el índice y cargará los datos en la memoria, sin necesidad de llamadas separadas a <code translate="no">create_index()</code> o <code translate="no">load()</code>. Un método lo hace todo: <em>crear colección → crear índice → cargar colección.</em></p>
<p>Este enfoque racionalizado reduce la complejidad de la configuración y hace que sea mucho más fácil empezar con Milvus, especialmente para los desarrolladores que quieren un camino rápido y eficiente para la creación de prototipos o la producción.</p>
<p>El nuevo módulo <code translate="no">MilvusClient</code> ofrece claras ventajas en usabilidad, consistencia y rendimiento. Aunque la interfaz ORM heredada sigue estando disponible por ahora, tenemos previsto eliminarla gradualmente en el futuro (véase <a href="https://docs.zilliz.com/reference/python/ORM#:~:text=About%20to%20Deprecate">la referencia</a>). Recomendamos encarecidamente actualizar al nuevo SDK para aprovechar al máximo las mejoras.</p>
<h3 id="6-Clearer-and-More-Comprehensive-Documentation" class="common-anchor-header">6. Documentación más clara y completa</h3><p>Hemos reestructurado la documentación del producto para ofrecer una <a href="https://milvus.io/docs">Referencia API</a> más completa y clara. Nuestras Guías de Usuario incluyen ahora código de ejemplo en varios idiomas, lo que le permitirá empezar a trabajar rápidamente y entender las características de Milvus con facilidad. Además, el asistente Ask AI disponible en nuestro sitio de documentación puede introducir nuevas características, explicar mecanismos internos e incluso ayudar a generar o modificar código de ejemplo, haciendo que su viaje a través de la documentación sea más suave y agradable.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ask_AI_Assistant_b044d4621a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="7-Milvus-MCP-Server-Designed-for-the-Future-of-AI-Integration" class="common-anchor-header">7. Servidor Milvus MCP: Diseñado para el futuro de la integración de IA</h3><p>El <a href="https://github.com/zilliztech/mcp-server-milvus">Servidor</a> MCP, construido sobre el SDK de Milvus, es nuestra respuesta a una necesidad creciente en el ecosistema de la IA: la integración sin fisuras entre grandes modelos lingüísticos<a href="https://zilliz.com/glossary/large-language-models-(llms)">(LLM</a>), <a href="https://milvus.io/blog/what-is-a-vector-database.md">bases de datos vectoriales</a> y herramientas externas o fuentes de datos. Implementa el Protocolo de Contexto de Modelo (MCP), proporcionando una interfaz unificada e inteligente para orquestar las operaciones de Milvus y más allá.</p>
<p>A medida que <a href="https://zilliz.com/blog/top-10-ai-agents-to-watch-in-2025">los agentes de IA</a> se vuelven más capaces -no sólo generando código, sino gestionando de forma autónoma los servicios backend-, aumenta la demanda de una infraestructura más inteligente y basada en API. El servidor MCP se diseñó pensando en este futuro. Permite interacciones inteligentes y automatizadas con los clústeres Milvus, agilizando tareas como el despliegue, el mantenimiento y la gestión de datos.</p>
<p>Y lo que es más importante, sienta las bases para un nuevo tipo de colaboración entre máquinas. Con el servidor MCP, los agentes de IA pueden llamar a las API para crear colecciones de forma dinámica, ejecutar consultas, crear índices y mucho más, todo ello sin intervención humana.</p>
<p>En resumen, el servidor MCP transforma Milvus no sólo en una base de datos, sino en un backend totalmente programable y preparado para la IA, allanando el camino para aplicaciones inteligentes, autónomas y escalables.</p>
<h2 id="Getting-Started-with-Milvus-SDK-v2-Sample-Code" class="common-anchor-header">Primeros pasos con Milvus SDK v2: Código de ejemplo<button data-href="#Getting-Started-with-Milvus-SDK-v2-Sample-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Los siguientes ejemplos muestran cómo utilizar la nueva interfaz PyMilvus (Python SDK v2) para crear una colección y realizar operaciones asíncronas. Comparado con el enfoque estilo ORM de la versión anterior, este código es más limpio, más consistente y más fácil de trabajar.</p>
<h3 id="1-Creating-a-Collection-Defining-Schemas-Building-Indexes-and-Loading-Data-with-MilvusClient" class="common-anchor-header">1. 1. Creación de una colección, definición de esquemas, creación de índices y carga de datos con Python <code translate="no">MilvusClient</code></h3><p>El siguiente fragmento de código de Python muestra cómo crear una colección, definir su esquema, crear índices y cargar datos, todo en una sola llamada:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

<span class="hljs-comment"># 1. Connect to Milvus (initialize the client)</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># 2. Define the collection schema</span>
schema = MilvusClient.create_schema(auto_id=<span class="hljs-literal">False</span>, description=<span class="hljs-string">&quot;schema for example collection&quot;</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)  <span class="hljs-comment"># Primary key field</span>
schema.add_field(<span class="hljs-string">&quot;embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">128</span>)  <span class="hljs-comment"># Vector field</span>

<span class="hljs-comment"># 3. Prepare index parameters (optional if indexing at creation time)</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;L2&quot;</span>
)

<span class="hljs-comment"># 4. Create the collection with indexes and load it into memory automatically</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;example_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Collection created and loaded with index!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>El parámetro <code translate="no">index_params</code> del método <code translate="no">create_collection</code> elimina la necesidad de realizar llamadas separadas a <code translate="no">create_index</code> y <code translate="no">load_collection</code>: todo sucede automáticamente.</p>
<p>Además, <code translate="no">MilvusClient</code> admite un modo de creación rápida de tablas. Por ejemplo, se puede crear una colección en una sola línea de código especificando únicamente los parámetros necesarios:</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_collection</span>(
    collection_name=<span class="hljs-string">&quot;test_collection&quot;</span>,
    dimension=<span class="hljs-number">128</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><em>(Nota comparativa: En el antiguo enfoque ORM, había que crear un <code translate="no">Collection(schema)</code>, y luego llamar por separado a <code translate="no">collection.create_index()</code> y <code translate="no">collection.load()</code>; ahora, MilvusClient agiliza todo el proceso).</em></p>
<h3 id="2-Performing-High-Concurrency-Asynchronous-Inserts-with-AsyncMilvusClient" class="common-anchor-header">2. Realización de inserciones asíncronas de alta concurrencia con MilvusClient <code translate="no">AsyncMilvusClient</code></h3><p>El siguiente ejemplo muestra cómo utilizar <code translate="no">AsyncMilvusClient</code> para realizar operaciones de inserción concurrentes utilizando <code translate="no">async/await</code>:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> AsyncMilvusClient

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">insert_vectors_concurrently</span>():
    client = AsyncMilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
    
    vectors_to_insert = [[...], [...], ...]  <span class="hljs-comment"># Assume 100,000 vectors</span>
    batch_size = <span class="hljs-number">1000</span>  <span class="hljs-comment"># Recommended batch size</span>
    tasks = []

    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(vectors_to_insert), batch_size):
        batch_vectors = vectors_to_insert[i:i+batch_size]

        <span class="hljs-comment"># Construct batch data</span>
        data = [
            <span class="hljs-built_in">list</span>(<span class="hljs-built_in">range</span>(i, i + <span class="hljs-built_in">len</span>(batch_vectors))),  <span class="hljs-comment"># Batch IDs</span>
            batch_vectors  <span class="hljs-comment"># Batch vectors</span>
        ]

        <span class="hljs-comment"># Add an asynchronous task for inserting each batch</span>
        tasks.append(client.insert(<span class="hljs-string">&quot;example_collection&quot;</span>, data=data))

    <span class="hljs-comment"># Concurrently execute batch inserts</span>
    insert_results = <span class="hljs-keyword">await</span> asyncio.gather(*tasks)
    <span class="hljs-keyword">await</span> client.close()

<span class="hljs-comment"># Execute asynchronous tasks</span>
asyncio.run(insert_vectors_concurrently())
<button class="copy-code-btn"></button></code></pre>
<p>En este ejemplo, <code translate="no">AsyncMilvusClient</code> se utiliza para insertar datos de forma concurrente programando múltiples tareas de inserción con <code translate="no">asyncio.gather</code>. Este enfoque aprovecha al máximo las capacidades de procesamiento concurrente del backend de Milvus. A diferencia de las inserciones síncronas, línea por línea en v1, este soporte asíncrono nativo aumenta drásticamente el rendimiento.</p>
<p>Del mismo modo, puede modificar el código para realizar consultas o búsquedas concurrentes, por ejemplo, sustituyendo la llamada a la inserción por <code translate="no">client.search(&quot;example_collection&quot;, data=[query_vec], limit=5)</code>. La interfaz asíncrona de Milvus SDK v2 garantiza que cada solicitud se ejecute de forma no bloqueante, aprovechando al máximo los recursos tanto del cliente como del servidor.</p>
<h2 id="Migration-Made-Easy" class="common-anchor-header">Migración sencilla<button data-href="#Migration-Made-Easy" class="anchor-icon" translate="no">
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
    </button></h2><p>Sabemos que ha invertido tiempo en SDK v1, por lo que hemos diseñado SDK v2 teniendo en cuenta sus aplicaciones existentes. SDK v2 incluye compatibilidad con versiones anteriores, por lo que las interfaces de estilo v1/ORM existentes seguirán funcionando durante un tiempo. Pero le recomendamos encarecidamente que se actualice al SDK v2 lo antes posible: la compatibilidad con v1 finalizará con el lanzamiento de Milvus 3.0 (finales de 2025).</p>
<p>La actualización al SDK v2 ofrece a los desarrolladores una experiencia más coherente y moderna, con una sintaxis simplificada, mejor compatibilidad con async y mayor rendimiento. También es donde se centran todas las nuevas características y el apoyo de la comunidad en el futuro. Actualizar ahora le asegura que está preparado para lo que viene y le da acceso a lo mejor que Milvus tiene que ofrecer.</p>
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
    </button></h2><p>Milvus SDK v2 aporta mejoras significativas con respecto a v1: mayor rendimiento, una interfaz unificada y coherente en múltiples lenguajes de programación y soporte asíncrono nativo que simplifica las operaciones de alta concurrencia. Con una documentación más clara y ejemplos de código más intuitivos, Milvus SDK v2 está diseñado para agilizar su proceso de desarrollo, haciendo más fácil y rápida la creación y despliegue de aplicaciones de IA.</p>
<p>Para obtener información más detallada, consulte nuestra última <a href="https://milvus.io/docs/install-pymilvus.md#Install-Milvus-Python-SDK">referencia</a> oficial <a href="https://milvus.io/docs/install-pymilvus.md#Install-Milvus-Python-SDK">de la API y las guías del usuario</a>. Si tiene alguna pregunta o sugerencia sobre el nuevo SDK, no dude en enviarnos sus comentarios a través de <a href="https://github.com/milvus-io/milvus/discussions">GitHub</a> y <a href="https://discord.com/invite/8uyFbECzPX">Discord</a>. Esperamos sus comentarios mientras seguimos mejorando Milvus.</p>
