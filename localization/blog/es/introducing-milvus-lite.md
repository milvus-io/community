---
id: introducing-milvus-lite.md
title: 'Presentamos Milvus Lite: Empiece a construir una aplicación GenAI en segundos'
author: Jiang Chen
date: 2024-05-30T00:00:00.000Z
cover: assets.zilliz.com/introducing_Milvus_Lite_76ed4baf75.jpeg
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  GenAI developers, Retrieval Augmented Generation, RAG
recommend: true
canonicalUrl: 'https://milvus.io/blog/introducing-milvus-lite.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_72e444c8dc.JPG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nos complace presentar <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>, una base de datos vectorial ligera que se ejecuta localmente dentro de su aplicación Python. Basada en la popular base de datos vectorial de código abierto <a href="https://milvus.io/intro">Milvus</a>, Milvus Lite reutiliza los componentes centrales para la indexación vectorial y el análisis sintáctico de consultas, al tiempo que elimina elementos diseñados para una alta escalabilidad en sistemas distribuidos. Este diseño hace que sea una solución compacta y eficiente ideal para entornos con recursos informáticos limitados, como ordenadores portátiles, Jupyter Notebooks y dispositivos móviles o de borde.</p>
<p>Milvus Lite se integra con varias pilas de desarrollo de IA como LangChain y LlamaIndex, permitiendo su uso como almacén de vectores en pipelines de Generación Aumentada de Recuperación (RAG) sin necesidad de configurar servidores. Simplemente ejecute <code translate="no">pip install pymilvus</code> (versión 2.4.3 o superior) para incorporarlo a su aplicación de IA como una biblioteca Python.</p>
<p>Milvus Lite comparte la API de Milvus, asegurando que su código del lado del cliente funcione tanto para despliegues locales a pequeña escala como para servidores Milvus desplegados en Docker o Kubernetes con miles de millones de vectores.</p>
<h2 id="Why-We-Built-Milvus-Lite" class="common-anchor-header">Por qué construimos Milvus Lite<button data-href="#Why-We-Built-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Muchas aplicaciones de IA requieren búsqueda de similitud vectorial para datos no estructurados, incluyendo texto, imágenes, voces y videos, para aplicaciones como chatbots y asistentes de compras. Las bases de datos vectoriales están diseñadas para almacenar y buscar incrustaciones vectoriales y son una parte crucial de la pila de desarrollo de IA, particularmente para casos de uso de IA generativa como <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">la Generación Aumentada de Recuperación (RAG)</a>.</p>
<p>A pesar de la disponibilidad de numerosas soluciones de búsqueda vectorial, faltaba una opción fácil de poner en marcha que también funcionara para despliegues de producción a gran escala. Como creadores de Milvus, diseñamos Milvus Lite para ayudar a los desarrolladores de IA a crear aplicaciones más rápido y, al mismo tiempo, garantizar una experiencia consistente en varias opciones de implementación, incluyendo Milvus en Kubernetes, Docker y servicios de nube gestionados.</p>
<p>Milvus Lite es una adición crucial a nuestro conjunto de ofertas dentro del ecosistema Milvus. Proporciona a los desarrolladores una herramienta versátil que soporta cada etapa de su viaje de desarrollo. Desde la creación de prototipos hasta los entornos de producción y desde la computación de borde hasta las implementaciones a gran escala, Milvus es ahora la única base de datos vectorial que cubre casos de uso de cualquier tamaño y todas las etapas de desarrollo.</p>
<h2 id="How-Milvus-Lite-Works" class="common-anchor-header">Cómo funciona Milvus Lite<button data-href="#How-Milvus-Lite-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Lite admite todas las operaciones básicas disponibles en Milvus, como la creación de colecciones y la inserción, búsqueda y eliminación de vectores. Pronto soportará funciones avanzadas como la búsqueda híbrida. Milvus Lite carga datos en memoria para realizar búsquedas eficientes y los persiste como un archivo SQLite.</p>
<p>Milvus Lite está incluido en el <a href="https://github.com/milvus-io/pymilvus">SDK Python de Milvus</a> y puede desplegarse con un simple <code translate="no">pip install pymilvus</code>. El siguiente fragmento de código demuestra cómo configurar una base de datos vectorial con Milvus Lite especificando un nombre de archivo local y luego creando una nueva colección. Para aquellos familiarizados con la API Milvus, la única diferencia es que <code translate="no">uri</code> se refiere a un nombre de archivo local en lugar de a un punto final de red, por ejemplo, <code translate="no">&quot;milvus_demo.db&quot;</code> en lugar de <code translate="no">&quot;http://localhost:19530&quot;</code> para un servidor Milvus. Todo lo demás permanece igual. Milvus Lite también admite el almacenamiento de texto sin formato y otras etiquetas como metadatos, utilizando un esquema dinámico o definido explícitamente, como se muestra a continuación.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(<span class="hljs-string">&quot;milvus_demo.db&quot;</span>)
<span class="hljs-comment"># This collection can take input with mandatory fields named &quot;id&quot;, &quot;vector&quot; and</span>
<span class="hljs-comment"># any other fields as &quot;dynamic schema&quot;. You can also define the schema explicitly.</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    dimension=<span class="hljs-number">384</span>  <span class="hljs-comment"># Dimension for vectors.</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Para la escalabilidad, una aplicación de IA desarrollada con Milvus Lite puede pasar fácilmente a usar Milvus desplegado en Docker o Kubernetes simplemente especificando el <code translate="no">uri</code> con el punto final del servidor.</p>
<h2 id="Integration-with-AI-Development-Stack" class="common-anchor-header">Integración con la pila de desarrollo de IA<button data-href="#Integration-with-AI-Development-Stack" class="anchor-icon" translate="no">
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
    </button></h2><p>Además de presentar Milvus Lite para facilitar la búsqueda vectorial para comenzar, Milvus también se integra con muchos marcos y proveedores de la pila de desarrollo de IA, incluidos <a href="https://python.langchain.com/v0.2/docs/integrations/vectorstores/milvus/">LangChain</a>, <a href="https://docs.llamaindex.ai/en/stable/examples/vector_stores/MilvusIndexDemo/">LlamaIndex</a>, <a href="https://haystack.deepset.ai/integrations/milvus-document-store">Haystack</a>, <a href="https://blog.voyageai.com/2024/05/30/semantic-search-with-milvus-lite-and-voyage-ai/">Voyage AI</a>, <a href="https://milvus.io/docs/integrate_with_ragas.md">Ragas</a>, <a href="https://jina.ai/news/implementing-a-chat-history-rag-with-jina-ai-and-milvus-lite/">Jina AI</a>, <a href="https://dspy-docs.vercel.app/docs/deep-dive/retrieval_models_clients/MilvusRM">DSPy</a>, <a href="https://www.bentoml.com/blog/building-a-rag-app-with-bentocloud-and-milvus-lite">BentoML</a>, <a href="https://chiajy.medium.com/70873c7576f1">WhyHow</a>, <a href="https://blog.relari.ai/case-study-using-synthetic-data-to-benchmark-rag-systems-be324904ace1">Relari AI</a>, <a href="https://docs.airbyte.com/integrations/destinations/milvus">Airbyte</a>, <a href="https://milvus.io/docs/integrate_with_hugging-face.md">HuggingFace</a> y <a href="https://memgpt.readme.io/docs/storage#milvus">MemGPT</a>. Gracias a sus amplias herramientas y servicios, estas integraciones simplifican el desarrollo de aplicaciones de IA con capacidad de búsqueda vectorial.</p>
<p>Y esto es sólo el principio: ¡pronto habrá muchas más integraciones interesantes! Permanezca atento.</p>
<h2 id="More-Resources-and-Examples" class="common-anchor-header">Más recursos y ejemplos<button data-href="#More-Resources-and-Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>Explore <a href="https://milvus.io/docs/quickstart.md">la documentación de inicio rápido de Milvus</a> para obtener guías detalladas y ejemplos de código sobre el uso de Milvus Lite para crear aplicaciones de IA como la generación mejorada de recuperación<a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/build_RAG_with_milvus.ipynb">(RAG</a>) y la <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/image_search_with_milvus.ipynb">búsqueda de imágenes</a>.</p>
<p>Milvus Lite es un proyecto de código abierto y sus contribuciones son bienvenidas. Consulte nuestra <a href="https://github.com/milvus-io/milvus-lite/blob/main/CONTRIBUTING.md">Guía de Contribución</a> para empezar. También puede informar de errores o solicitar características presentando una incidencia en el repositorio <a href="https://github.com/milvus-io/milvus-lite">GitHub de Milvus Lite</a>.</p>
