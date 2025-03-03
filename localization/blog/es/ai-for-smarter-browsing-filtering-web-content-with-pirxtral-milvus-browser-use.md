---
id: >-
  ai-for-smarter-browsing-filtering-web-content-with-pixtral-milvus-browser-use.md
title: >-
  IA para una navegación más inteligente: Filtrado de contenidos web con
  Pixtral, Milvus y el uso del navegador
author: Stephen Batifol
date: 2025-02-25T00:00:00.000Z
desc: >-
  Aprenda a crear un asistente inteligente que filtre contenidos combinando
  Pixtral para el análisis de imágenes, la base de datos vectorial Milvus para
  el almacenamiento y Browser Use para la navegación web.
cover: >-
  assets.zilliz.com/Multimodal_Semantic_Search_with_Images_and_Text_1_3da9b83015.png
tag: Engineering
tags: >-
  Vector Database Milvus, AI Content Filtering, Pixtral Image Analysis, Browser
  Use Web Navigation, Intelligent Agent Development
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/ai-for-smarter-browsing-filtering-web-content-with-pixtral-milvus-browser-use.md
---
<iframe width="100%" height="480" src="https://www.youtube.com/embed/4Xf4_Wfjk_Y" title="How to Build a Smart Social Media Agent with Milvus, Pixtral &amp; Browser Use" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>Como Defensor de los Desarrolladores de Milvus, paso mucho tiempo en las redes sociales, escuchando lo que la gente tiene que decir sobre nosotros y si yo también puedo ayudar. Sin embargo, hay un pequeño choque de mundos cuando se busca &quot;Milvus&quot;. Es tanto un vector DB como un género de ave, lo que significa que en un momento estoy metido de lleno en un hilo sobre algoritmos de similitud vectorial y al siguiente estoy admirando impresionantes fotografías de pájaros negros volando por el cielo.</p>
<p>Aunque ambos temas son interesantes, mezclarlos no es realmente útil en mi caso, ¿y si hubiera una forma inteligente de resolver este problema sin que yo tuviera que comprobarlo manualmente?</p>
<p>Construyamos algo más inteligente: combinando la comprensión visual con el conocimiento del contexto, podemos construir un asistente que sepa distinguir entre los patrones de migración de un milano negro y un nuevo artículo nuestro.</p>
<h2 id="The-tech-stack" class="common-anchor-header">La pila tecnológica<button data-href="#The-tech-stack" class="anchor-icon" translate="no">
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
    </button></h2><p>Combinamos tres tecnologías diferentes:</p>
<ul>
<li><strong>Browser-Use:</strong> esta herramienta navega por varios sitios web (por ejemplo, Twitter) para buscar contenidos.</li>
<li><strong>Pixtral</strong>: Un modelo de visión-lenguaje que analiza imágenes y contexto. En este ejemplo, distingue entre un diagrama técnico sobre nuestra base de datos vectorial y una impresionante fotografía de un pájaro.</li>
<li><strong>Milvus</strong>: Una BD Vectorial de alto rendimiento y de código abierto. En ella almacenaremos las entradas relevantes para su posterior consulta.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/the_tech_stack_ad695ccf9e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Seeing-it-in-action" class="common-anchor-header">Verlo en acción<button data-href="#Seeing-it-in-action" class="anchor-icon" translate="no">
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
    </button></h2><p>Echemos un vistazo a esos 2 posts:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Langchian_tweet_1_with_Milvus_f2bd988503.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Tweet_2_with_Bird_4b534efced.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Para el de la izquierda, Pixtral reconoce que se trata de un post sobre Milvus, el Vector DB. Mencionó algunos detalles de implementación, sino también una imagen que muestra un diagrama del sistema, lo que indica que esto es, en efecto, sobre el Vector DB. Podemos ver a continuación que Pixtral también piensa lo mismo.</p>
<pre><code translate="no" class="language-Shell">INFO     [src.agent.custom_agent] 🧠 New Memory: <span class="hljs-number">1.</span> The post by LangChainAI discusses the <span class="hljs-string">&#x27;GraphRAG Agent&#x27;</span> which uses Neo4j <span class="hljs-keyword">and</span> Milvus vector search to enhance RAG systems.
<span class="hljs-number">2.</span> Replies include praise <span class="hljs-keyword">for</span> the use of Milvus <span class="hljs-keyword">in</span> intelligent retrieval <span class="hljs-keyword">and</span> vector search.
<span class="hljs-number">3.</span> Specific mention of Milvus <span class="hljs-keyword">as</span> a key component <span class="hljs-keyword">in</span> innovative RAG systems.
<span class="hljs-number">4.</span> No content related to birds <span class="hljs-keyword">or</span> photography was found.
INFO     [src.agent.custom_agent] ⏳ Task Progress:
<span class="hljs-number">1.</span> Navigated to the post URL. <span class="hljs-number">2.</span> Extracted relevant post content. <span class="hljs-number">3.</span> Analyzed the content <span class="hljs-keyword">for</span> relevance to Milvus, the Vector DB.
INFO     [src.agent.custom_agent] 📋 Future Plans:
<span class="hljs-number">1.</span> Summarize the findings <span class="hljs-keyword">and</span> confirm the relevance to Milvus. <span class="hljs-number">2.</span> Complete the task by providing a clear <span class="hljs-keyword">and</span> concise report.
INFO     [src.agent.custom_agent] 🤔 Thought: The task required analyzing the post content <span class="hljs-keyword">for</span> relevance to Milvus, the Vector DB, ignoring <span class="hljs-built_in">any</span> content about birds <span class="hljs-keyword">or</span> photography. The extracted content <span class="hljs-keyword">is</span> entirely relevant to Milvus <span class="hljs-keyword">and</span> its applications <span class="hljs-keyword">in</span> vector search <span class="hljs-keyword">and</span> RAG systems. I will now summarize the findings <span class="hljs-keyword">and</span> complete the task.
INFO     [src.agent.custom_agent] 🎯 Summary: The post <span class="hljs-keyword">and</span> its replies are relevant to Milvus, the Vector DB, focusing on its use <span class="hljs-keyword">in</span> intelligent retrieval <span class="hljs-keyword">and</span> vector search. No content about birds <span class="hljs-keyword">or</span> photography was found.
INFO     [src.agent.custom_agent] 🛠️  Action <span class="hljs-number">1</span>/<span class="hljs-number">1</span>: {<span class="hljs-string">&quot;done&quot;</span>:{<span class="hljs-string">&quot;text&quot;</span>:<span class="hljs-string">&quot;The post by LangChainAI discusses the &#x27;GraphRAG Agent,&#x27; which uses Neo4j and Milvus vector search to enhance RAG systems. Replies highlight the innovative use of Milvus for intelligent retrieval and vector search, with no mention of birds or photography. The content is entirely relevant to Milvus, the Vector DB.&quot;</span>}}
INFO     [src.agent.custom_agent] 🧠 All Memory:
<span class="hljs-number">1.</span> The post by LangChainAI discusses the <span class="hljs-string">&#x27;GraphRAG Agent&#x27;</span> which uses Neo4j <span class="hljs-keyword">and</span> Milvus vector search to enhance RAG systems.
<span class="hljs-number">2.</span> Replies focus on the innovative use of Milvus <span class="hljs-keyword">for</span> intelligent retrieval <span class="hljs-keyword">and</span> vector search alongside other technologies.
<span class="hljs-number">3.</span> No posts <span class="hljs-keyword">or</span> replies are related to birds <span class="hljs-keyword">or</span> photography.
<span class="hljs-number">1.</span> The post by LangChainAI discusses the <span class="hljs-string">&#x27;GraphRAG Agent&#x27;</span> which uses Neo4j <span class="hljs-keyword">and</span> Milvus vector search to enhance RAG systems.
<span class="hljs-number">2.</span> Replies include praise <span class="hljs-keyword">for</span> the use of Milvus <span class="hljs-keyword">in</span> intelligent retrieval <span class="hljs-keyword">and</span> vector search.
<span class="hljs-number">3.</span> Specific mention of Milvus <span class="hljs-keyword">as</span> a key component <span class="hljs-keyword">in</span> innovative RAG systems.
<span class="hljs-number">4.</span> No content related to birds <span class="hljs-keyword">or</span> photography was found.
<button class="copy-code-btn"></button></code></pre>
<p>La de la derecha, en cambio, no lo es, podemos ver que esta imagen, por muy bonita que sea, no trata de un Vector DB. Podemos ver un pájaro volando en el cielo, por lo tanto, Pixtral considerará ésta irrelevante.</p>
<pre><code translate="no" class="language-Shell">INFO     [src.agent.custom_agent] 🧠 New Memory: The post <span class="hljs-keyword">and</span> comments primarily discuss photography <span class="hljs-keyword">and</span> birds. No references to Milvus the Vector Database are found.
INFO     [src.agent.custom_agent] ⏳ Task Progress:
Navigated to the post. Analyzed the content <span class="hljs-keyword">for</span> relevance to Milvus, the Vector DB. No relevant information found.
INFO     [src.agent.custom_agent] 🤔 Thought: The content of the post <span class="hljs-keyword">and</span> comments only discusses birds <span class="hljs-keyword">and</span> photography. Since the task specifies ignoring such topics, there <span class="hljs-keyword">is</span> no relevant information <span class="hljs-keyword">for</span> Milvus, the Vector DB. The task can now be concluded.
INFO     [src.agent.custom_agent] 🎯 Summary: The post does <span class="hljs-keyword">not</span> contain relevant information <span class="hljs-keyword">for</span> Milvus, the Vector DB. I will conclude the task.
INFO     [src.agent.custom_agent] 🛠️  Action <span class="hljs-number">1</span>/<span class="hljs-number">1</span>: {<span class="hljs-string">&quot;done&quot;</span>:{<span class="hljs-string">&quot;text&quot;</span>:<span class="hljs-string">&quot;The post and comments focus on birds and photography. No relevant information related to Milvus, the Vector DB, was found.&quot;</span>}}
INFO     [src.agent.custom_agent] 🧠 All Memory:
The post <span class="hljs-keyword">and</span> comments primarily discuss photography <span class="hljs-keyword">and</span> birds. No references to Milvus the Vector Database are found.
<button class="copy-code-btn"></button></code></pre>
<p>Ahora que hemos filtrado las entradas que no queremos, podemos guardar las relevantes en Milvus. De este modo, podremos consultarlas más tarde utilizando la Búsqueda vectorial o la Búsqueda de texto completo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Browser_use_milvus_pixtral_39bf320a9f.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Storing-Data-in-Milvus" class="common-anchor-header">Almacenamiento de datos en Milvus<button data-href="#Storing-Data-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/enable-dynamic-field.md#Dynamic-Field">Los campos dinámicos</a> son imprescindibles en este caso porque no siempre es posible respetar el esquema que espera Milvus. Con Milvus, sólo tiene que utilizar <code translate="no">enable_dynamic_field=True</code> al crear su esquema, y eso es todo. He aquí un fragmento de código para mostrar el proceso:</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Connect to Milvus</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># Create a Schema that handles Dynamic Fields</span>
schema = <span class="hljs-variable language_">self</span>.client.create_schema(enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>, enable_analyzer=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;vector&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">384</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR)
<button class="copy-code-btn"></button></code></pre>
<p>A continuación definimos los datos a los que queremos tener acceso:</p>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Prepare data with dynamic fields</span>
data = {
    <span class="hljs-string">&#x27;text&#x27;</span>: content_str,
    <span class="hljs-string">&#x27;vector&#x27;</span>: embedding,
    <span class="hljs-string">&#x27;url&#x27;</span>: url,
    <span class="hljs-string">&#x27;type&#x27;</span>: content_type,
    <span class="hljs-string">&#x27;metadata&#x27;</span>: json.dumps(metadata <span class="hljs-keyword">or</span> {})
}

<span class="hljs-comment"># Insert into Milvus</span>
<span class="hljs-variable language_">self</span>.client.insert(
    collection_name=<span class="hljs-variable language_">self</span>.collection_name,
    data=[data]
)
<button class="copy-code-btn"></button></code></pre>
<p>Esta sencilla configuración significa que no tienes que preocuparte de que todos los campos estén perfectamente definidos de antemano. Simplemente configure el esquema para permitir adiciones dinámicas y deje que Milvus haga el trabajo pesado.</p>
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
    </button></h2><p>Combinando la navegación web de Browser Use, la comprensión visual de Pixtral y el almacenamiento eficiente de Milvus, hemos creado un asistente inteligente que realmente entiende el contexto. Ahora lo estoy utilizando para distinguir entre pájaros y DB vectoriales, pero el mismo enfoque podría ayudarte con otro problema al que te puedas estar enfrentando.</p>
<p>Por mi parte, quiero seguir trabajando en agentes que puedan ayudarme en mi trabajo diario para reducir mi carga cognitiva 😌.</p>
<h2 id="Wed-Love-to-Hear-What-You-Think" class="common-anchor-header">¡Nos encantaría conocer tu opinión!<button data-href="#Wed-Love-to-Hear-What-You-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>Si te gusta esta entrada de blog, por favor considera:</p>
<ul>
<li>⭐ Darnos una estrella en <a href="https://github.com/milvus-io/milvus">GitHub</a></li>
<li>💬 Unirte a nuestra <a href="https://discord.gg/FG6hMJStWu">comunidad Milvus Discord</a> para compartir tus experiencias o si necesitas ayuda para construir Agentes</li>
<li>🔍 Explorar nuestro <a href="https://github.com/milvus-io/bootcamp">repositorio Bootcamp</a> para ver ejemplos de aplicaciones que utilizan Milvus</li>
</ul>
