---
id: hermes-agent-learning-loop-milvus-hybrid-search.md
title: >-
  Cómo solucionar el bucle de aprendizaje del agente Hermes con la búsqueda
  híbrida de Milvus 2.6
author: Min Yin
date: 2026-4-24
cover: >-
  assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_2_e0b44ee562.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Hermes Agent, Milvus 2.6, hybrid search, agent memory, skill learning loop'
meta_title: |
  How to Fix Hermes Agent's Learning Loop with Milvus 2.6 Hybrid Search
desc: >-
  El bucle de aprendizaje del agente Hermes escribe "Skills from use", pero su
  recuperador FTS5 pasa por alto las consultas reformuladas. La búsqueda híbrida
  de Milvus 2.6 corrige la recuperación entre sesiones.
origin: 'https://milvus.io/blog/hermes-agent-learning-loop-milvus-hybrid-search.md'
---
<p><a href="https://github.com/NousResearch/hermes-agent"><strong>El agente Hermes</strong></a> <strong>ha estado en todas partes últimamente.</strong> Construido por Nous Research, Hermes es un agente de IA personal autoalojado que se ejecuta en tu propio hardware (un VPS de 5 dólares funciona) y habla contigo a través de canales de chat existentes como Telegram.</p>
<p><strong>Lo más destacado es su bucle de aprendizaje integrado:</strong> el bucle crea habilidades a partir de la experiencia, las mejora durante su uso y busca conversaciones anteriores para encontrar patrones reutilizables. Otros marcos de agentes codifican manualmente las habilidades antes de desplegarlas. Las habilidades de Hermes crecen con el uso, y los flujos de trabajo repetidos se vuelven reutilizables sin necesidad de cambiar el código.</p>
<p><strong>El problema es que Hermes sólo recupera palabras clave.</strong> Coincide con las palabras exactas, pero no con el significado que buscan los usuarios. Cuando los usuarios utilizan palabras diferentes en distintas sesiones, el bucle no puede relacionarlas y no se escribe ninguna nueva habilidad. Cuando sólo hay unos cientos de documentos, la diferencia es tolerable. <strong>A partir de ahí, el bucle deja de aprender porque no puede encontrar su propio historial.</strong></p>
<p><strong>La solución es Milvus 2.6.</strong> Su <a href="https://milvus.io/docs/multi-vector-search.md">búsqueda híbrida</a> abarca tanto el significado como las palabras clave exactas en una sola consulta, de modo que el bucle puede por fin conectar información reformulada entre sesiones. Es lo suficientemente ligero como para caber en un pequeño servidor en la nube (un VPS de 5 dólares al mes lo ejecuta). Para cambiarlo no es necesario modificar Hermes: Milvus se sitúa detrás de la capa de recuperación, por lo que el bucle de aprendizaje permanece intacto. Hermes sigue eligiendo qué habilidad ejecutar y Milvus se encarga de lo que hay que recuperar.</p>
<p>Una vez que la recuperación funciona, el bucle de aprendizaje puede almacenar la propia estrategia de recuperación como una habilidad, no sólo el contenido que recupera. De este modo, los conocimientos del agente se acumulan a lo largo de las sesiones.</p>
<h2 id="Hermes-Agent-Architecture-How-Four-Layer-Memory-Powers-the-Skill-Learning-Loop" class="common-anchor-header">Arquitectura del agente Hermes: Cómo la memoria de cuatro capas potencia el bucle de aprendizaje de habilidades<button data-href="#Hermes-Agent-Architecture-How-Four-Layer-Memory-Powers-the-Skill-Learning-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/NousResearch/hermes-agent"><strong>Hermes</strong></a> <strong>tiene cuatro capas de memoria, y L4 Skills es la que la distingue.</strong></p>
<ul>
<li><strong>L1</strong> - contexto de sesión, se borra cuando se cierra la sesión</li>
<li><strong>L2</strong> - hechos persistentes: pila del proyecto, convenciones del equipo, decisiones resueltas</li>
<li><strong>L3</strong> - búsqueda de palabras clave SQLite FTS5 sobre archivos locales</li>
<li><strong>L4</strong> - almacena los flujos de trabajo como archivos Markdown. A diferencia de las herramientas LangChain o los plugins AutoGPT, que los desarrolladores escriben en código antes de su despliegue, las habilidades L4 se escriben por sí mismas: crecen a partir de lo que el agente ejecuta realmente, sin que el desarrollador tenga que escribir nada.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_3_3653368e99.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-Hermess-FTS5-Keyword-Retrieval-Breaks-the-Learning-Loop" class="common-anchor-header">Por qué la recuperación de palabras clave FTS5 de Hermes rompe el bucle de aprendizaje<button data-href="#Why-Hermess-FTS5-Keyword-Retrieval-Breaks-the-Learning-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>En primer lugar, Hermes necesita la recuperación para activar flujos de trabajo entre sesiones.</strong> Pero su capa L3 incorporada utiliza SQLite FTS5, que sólo coincide con los tokens literales, no con el significado.</p>
<p><strong>Cuando los usuarios expresan la misma intención de forma diferente en las distintas sesiones, FTS5 no acierta.</strong> El bucle de aprendizaje no se activa. No se escribe ninguna Skill nueva, y la próxima vez que aparezca la intención, el usuario vuelve al enrutamiento manual.</p>
<p>Ejemplo: la base de conocimientos almacena "asyncio event loop, async task scheduling, non-blocking I/O". Un usuario busca "Python concurrency". FTS5 devuelve cero resultados: no hay solapamiento literal de palabras, y FTS5 no tiene forma de ver que se trata de la misma pregunta.</p>
<p>Por debajo de un par de cientos de documentos, la diferencia es tolerable. Más allá de eso, la documentación utiliza un vocabulario y los usuarios preguntan en otro, y FTS5 no tiene ningún puente entre ellos. <strong>El contenido no recuperable bien podría no estar en la base de conocimientos, y el bucle de aprendizaje no tiene nada de lo que aprender.</strong></p>
<h2 id="How-Milvus-26-Fixes-the-Retrieval-Gap-with-Hybrid-Search-and-Tiered-Storage" class="common-anchor-header">Cómo soluciona Milvus 2.6 la brecha de recuperación con la búsqueda híbrida y el almacenamiento por niveles<button data-href="#How-Milvus-26-Fixes-the-Retrieval-Gap-with-Hybrid-Search-and-Tiered-Storage" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvus 2.6 aporta dos mejoras que se ajustan a los puntos de fallo de Hermes.</strong> La <strong>búsqueda híbrida</strong> desbloquea el bucle de aprendizaje al cubrir la recuperación semántica y por palabras clave en una sola llamada. <strong>El almacenamiento por niveles</strong> mantiene todo el backend de recuperación lo suficientemente pequeño como para funcionar en el mismo VPS de 5 dólares al mes para el que se creó Hermes.</p>
<h3 id="What-Hybrid-Search-Solves-Finding-Relevant-Information" class="common-anchor-header">Qué resuelve la búsqueda híbrida: Encontrar información relevante</h3><p>Milvus 2.6 permite ejecutar tanto la recuperación vectorial (semántica) como <a href="https://milvus.io/docs/full-text-search.md">la búsqueda de texto completo BM25</a> (palabra clave) en una sola consulta y, a continuación, fusionar las dos listas clasificadas con la <a href="https://milvus.io/docs/multi-vector-search.md">Fusión de Rango Recíproco (RRF)</a>.</p>
<p>Por ejemplo: pregunte &quot;¿cuál es el principio de asyncio?&quot;, y la recuperación vectorial encontrará contenidos semánticamente relacionados. Si se pregunta &quot;¿dónde se define la función <code translate="no">find_similar_task</code>?&quot;, BM25 encuentra con precisión el nombre de la función en el código. Para las preguntas que implican una función dentro de un tipo particular de tarea, la búsqueda híbrida devuelve el resultado correcto en una sola llamada, sin lógica de enrutamiento escrita a mano.</p>
<p>Para Hermes, esto es lo que desbloquea el bucle de aprendizaje. Cuando una segunda sesión reformula la intención, la recuperación vectorial capta la coincidencia semántica que FTS5 pasó por alto. El bucle se activa y se escribe una nueva habilidad.</p>
<h3 id="What-Tiered-Storage-Solves-Cost" class="common-anchor-header">Qué resuelve el almacenamiento por niveles: Coste</h3><p>Una base de datos vectorial ingenua querría el índice de incrustación completo en RAM, lo que empuja a los despliegues personales hacia una infraestructura mayor y más cara. Milvus 2.6 evita esto con el almacenamiento en tres niveles, moviendo las entradas entre los niveles en función de la frecuencia de acceso:</p>
<ul>
<li><strong>Caliente</strong> - en memoria</li>
<li><strong>Caliente</strong> - en SSD</li>
<li><strong>Frío</strong>: en almacenamiento de objetos</li>
</ul>
<p>Sólo los datos calientes permanecen residentes. Una base de conocimientos de 500 documentos cabe en 2 GB de RAM. Toda la pila de recuperación se ejecuta en el mismo VPS de 5 dólares al mes al que se dirige Hermes, sin necesidad de actualizar la infraestructura.</p>
<h2 id="Hermes-+-Milvus-System-Architecture" class="common-anchor-header">Hermes + Milvus: Arquitectura del sistema<button data-href="#Hermes-+-Milvus-System-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hermes elige qué Skill ejecutar. Milvus se encarga de lo que hay que recuperar.</strong> Los dos sistemas permanecen separados y la interfaz de Hermes no cambia.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_4_1794304940.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>El flujo:</strong></p>
<ol>
<li>Hermes identifica la intención del usuario y la dirige a una habilidad.</li>
<li>El Skill llama a un script de recuperación a través de la herramienta terminal.</li>
<li>El script accede a Milvus, ejecuta una búsqueda híbrida y devuelve fragmentos clasificados con metadatos de origen.</li>
<li>Hermes compone la respuesta. La memoria registra el flujo de trabajo.</li>
<li>Cuando el mismo patrón se repite a lo largo de las sesiones, el bucle de aprendizaje escribe una nueva habilidad.</li>
</ol>
<h2 id="How-to-Install-Hermes-and-Milvus-26" class="common-anchor-header">Cómo instalar Hermes y Milvus 2.6<button data-href="#How-to-Install-Hermes-and-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Instale Hermes y</strong> <a href="https://milvus.io/docs/install_standalone-docker.md"><strong>Milvus 2.6 Standalone</strong></a><strong>, luego cree una colección con campos densos y BM25.</strong> Esa es la configuración completa antes de que el Bucle de Aprendizaje pueda dispararse.</p>
<h3 id="Install-Hermes" class="common-anchor-header">Instalar Hermes</h3><pre><code translate="no" class="language-bash">curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
<button class="copy-code-btn"></button></code></pre>
<p>Ejecute <code translate="no">hermes</code> para entrar en el asistente de init interactivo:</p>
<ul>
<li><strong>Proveedor LLM</strong> - OpenAI, Anthropic, OpenRouter (OpenRouter tiene modelos gratuitos)</li>
<li><strong>Canal</strong> - este tutorial utiliza un bot FLark</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_5_dceeae1519.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Run-Milvus-26-Standalone" class="common-anchor-header">Ejecutar Milvus 2.6 Standalone</h3><p>Un único nodo autónomo es suficiente para un agente personal:</p>
<pre><code translate="no" class="language-bash">curl -sfL https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh \
-o standalone_embed.sh
bash standalone_embed.sh start
<span class="hljs-comment"># Verify service status</span>
docker ps | grep milvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Create-the-Collection" class="common-anchor-header">Crear la colección</h3><p>El diseño del esquema tapa lo que la recuperación puede hacer. Este esquema ejecuta vectores densos y vectores dispersos BM25 uno al lado del otro:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType
client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>,
)
schema = client.create_schema(auto_id=<span class="hljs-literal">True</span>, enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-comment"># Raw text (for BM25 full-text search)</span>
schema.add_field(
    <span class="hljs-string">&quot;text&quot;</span>,
    DataType.VARCHAR,
    max_length=<span class="hljs-number">8192</span>,
    enable_analyzer=<span class="hljs-literal">True</span>,
    enable_match=<span class="hljs-literal">True</span>
)
<span class="hljs-comment"># Dense vector (semantic search)</span>
schema.add_field(<span class="hljs-string">&quot;dense_vector&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>)
<span class="hljs-comment"># Sparse vector (BM25 auto-generated, Milvus 2.6 feature)</span>
schema.add_field(<span class="hljs-string">&quot;sparse_vector&quot;</span>, DataType.SPARSE_FLOAT_VECTOR)
schema.add_field(<span class="hljs-string">&quot;source&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;chunk_index&quot;</span>, DataType.INT32)
<span class="hljs-comment"># Tell Milvus to auto-convert text to sparse_vector via BM25</span>
bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;sparse_vector&quot;</span>],
)
schema.add_function(bm25_function)
index_params = client.prepare_index_params()
<span class="hljs-comment"># HNSW graph index (dense vector)</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;dense_vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">256</span>}
)
<span class="hljs-comment"># BM25 inverted index (sparse vector)</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;SPARSE_INVERTED_INDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>
)
client.create_collection(
    collection_name=<span class="hljs-string">&quot;hermes_milvus&quot;</span>,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_6_0646f46d36.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Hybrid-Search-Script" class="common-anchor-header">Script de búsqueda híbrida</h3><pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> sys, json
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, AnnSearchRequest, RRFRanker

client = MilvusClient(<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>)
oai    = OpenAI()
COLLECTION = <span class="hljs-string">&quot;hermes_milvus&quot;</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">hybrid_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">dict</span>]:
    <span class="hljs-comment"># 1. Vectorize query</span>
    dense_vec = oai.embeddings.create(
        model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>,
        <span class="hljs-built_in">input</span>=query
    ).data[<span class="hljs-number">0</span>].embedding

    <span class="hljs-comment"># 2. Dense vector retrieval (semantic relevance)</span>
    dense_req = AnnSearchRequest(
        data=[dense_vec],
        anns_field=<span class="hljs-string">&quot;dense_vector&quot;</span>,
        param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">128</span>}},
        limit=top_k * <span class="hljs-number">2</span>       <span class="hljs-comment"># Widen candidate set, let RRF do final ranking</span>
    )

    <span class="hljs-comment"># 3. BM25 sparse vector retrieval (exact term matching)</span>
    bm25_req = AnnSearchRequest(
        data=[query],
        anns_field=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
        param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>},
        limit=top_k * <span class="hljs-number">2</span>
    )

    <span class="hljs-comment"># 4. RRF fusion ranking</span>
    results = client.hybrid_search(
        collection_name=COLLECTION,
        reqs=[dense_req, bm25_req],
        ranker=RRFRanker(k=<span class="hljs-number">60</span>),
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;doc_type&quot;</span>]
    )

    <span class="hljs-keyword">return</span> [
        {
            <span class="hljs-string">&quot;text&quot;</span>:     r.entity.get(<span class="hljs-string">&quot;text&quot;</span>),
            <span class="hljs-string">&quot;source&quot;</span>:   r.entity.get(<span class="hljs-string">&quot;source&quot;</span>),
            <span class="hljs-string">&quot;doc_type&quot;</span>: r.entity.get(<span class="hljs-string">&quot;doc_type&quot;</span>),
            <span class="hljs-string">&quot;score&quot;</span>:    <span class="hljs-built_in">round</span>(r.distance, <span class="hljs-number">4</span>)
        }
        <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]
    ]

<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    query= sys.argv[<span class="hljs-number">1</span>] <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(sys.argv) &gt; <span class="hljs-number">1</span> <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>
    top_k  = <span class="hljs-built_in">int</span>(sys.argv[<span class="hljs-number">2</span>]) <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(sys.argv) &gt; <span class="hljs-number">2</span> <span class="hljs-keyword">else</span> <span class="hljs-number">5</span>
    output = hybrid_search(query, top_k)
    <span class="hljs-built_in">print</span>(json.dumps(output, ensure_ascii=<span class="hljs-literal">False</span>, indent=<span class="hljs-number">2</span>))
<button class="copy-code-btn"></button></code></pre>
<p><strong>La solicitud densa amplía el conjunto de candidatos en 2× para que RRF tenga suficiente para clasificar.</strong> <code translate="no">text-embedding-3-small</code> es la incrustación de OpenAI más barata que mantiene la calidad de recuperación; cámbiala por <code translate="no">text-embedding-3-large</code> si el presupuesto lo permite.</p>
<p>Con el entorno y la base de conocimientos listos, la siguiente sección pone a prueba el bucle de aprendizaje.</p>
<h2 id="Hermes-Skill-Auto-Generation-in-Practice" class="common-anchor-header">La autogeneración de habilidades de Hermes en la práctica<button data-href="#Hermes-Skill-Auto-Generation-in-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Dos sesiones muestran el bucle de aprendizaje en acción.</strong> En la primera, el usuario nombra el script a mano. En la segunda, una nueva sesión hace la misma pregunta sin nombrar el guión. Hermes recoge el patrón y escribe tres Habilidades.</p>
<h3 id="Session-1-Call-the-Script-by-Hand" class="common-anchor-header">Sesión 1: Llamar al Script a Mano</h3><p>Abra Hermes en Lark. Dale la ruta del script y el objetivo de recuperación. Hermes invoca la herramienta terminal, ejecuta el script, y devuelve la respuesta con atribución de fuente. <strong>Todavía no existe ninguna habilidad. Esta es una simple llamada a la herramienta.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_7_1c2d9261f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Session-2-Ask-Without-Naming-the-Script" class="common-anchor-header">Sesión 2: Preguntar sin nombrar el script</h3><p>Borre la conversación. Empezar de nuevo. Haga la misma categoría de pregunta sin mencionar el guión o la ruta.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_8_27253eda82.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Memory-Writes-First-Skill-Follows" class="common-anchor-header">La memoria escribe primero, la habilidad le sigue</h3><p><strong>El Bucle de Aprendizaje registra el flujo de trabajo (guión, argumentos, forma de retorno) y devuelve la respuesta.</strong> La memoria guarda el rastro; aún no existe ninguna habilidad.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_9_a0768f84bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>La coincidencia de la segunda sesión indica al bucle que vale la pena conservar el patrón.</strong> Cuando se dispara, se escriben tres habilidades:</p>
<table>
<thead>
<tr><th>Habilidad</th><th>Función</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">hybrid-search-doc-qa</code></td><td>Ejecutar una búsqueda híbrida semántica + por palabra clave en la memoria y componer la respuesta.</td></tr>
<tr><td><code translate="no">milvus-docs-ingest-verification</code></td><td>Comprobar que los documentos se han incorporado a la base de conocimientos.</td></tr>
<tr><td><code translate="no">terminal</code></td><td>Ejecutar comandos shell: scripts, configuración del entorno, inspección</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_10_b68e35bc46.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A partir de este momento, <strong>los usuarios dejan de nombrar las habilidades.</strong> Hermes infiere la intención, se dirige a la habilidad, extrae los fragmentos relevantes de la memoria y escribe la respuesta. No hay selector de habilidad en el prompt.</p>
<p>La mayoría de los sistemas RAG (retrieval-augmented generation) resuelven el problema de almacenamiento y búsqueda, pero la lógica de búsqueda está codificada en el código de la aplicación. Si se pregunta de otra forma o en un nuevo escenario, la recuperación se interrumpe. Hermes almacena la estrategia de búsqueda como una habilidad, lo que significa <strong>que la ruta de búsqueda se convierte en un documento que se puede leer, editar y versionar.</strong> La línea <code translate="no">💾 Memory updated · Skill 'hybrid-search-doc-qa' created</code> no es un marcador de configuración-completa. Es <strong>el Agente comprometiendo un patrón de comportamiento en la memoria a largo plazo.</strong></p>
<h2 id="Hermes-vs-OpenClaw-Accumulation-vs-Orchestration" class="common-anchor-header">Hermes vs. OpenClaw: Acumulación vs. Orquestación<button data-href="#Hermes-vs-OpenClaw-Accumulation-vs-Orchestration" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hermes y OpenClaw responden a problemas diferentes.</strong> Hermes está construido para un único agente que acumula memoria y habilidades a lo largo de las sesiones. OpenClaw está diseñado para dividir una tarea compleja en partes y entregar cada parte a un agente especializado.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_11_afcb575d50.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>El punto fuerte de OpenClaw es la orquestación. Optimiza la cantidad de tareas que se realizan automáticamente. El punto fuerte de Hermes es la acumulación: un único agente que recuerda a lo largo de las sesiones, con habilidades que crecen con el uso. Hermes optimiza el contexto a largo plazo y la experiencia en el dominio.</p>
<p><strong>Los dos marcos se apilan.</strong> Hermes ofrece una ruta de migración de un solo paso que lleva la memoria y las habilidades de <code translate="no">~/.openclaw</code> a las capas de memoria de Hermes. Una pila de orquestación puede situarse encima, con un agente de acumulación debajo.</p>
<p>Para conocer el lado OpenClaw de la división, consulte <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">¿Qué es OpenClaw? Guía completa del agente de IA de código abierto</a> en el blog de Milvus.</p>
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
    </button></h2><p>El bucle de aprendizaje de Hermes convierte los flujos de trabajo repetidos en habilidades reutilizables, pero sólo si la recuperación puede conectarlos entre sesiones. La búsqueda por palabras clave de FTS5 no puede. <a href="https://milvus.io/docs/multi-vector-search.md"><strong>La búsqueda híbrida de Milvus 2.6</strong></a> sí puede: los vectores densos manejan el significado, BM25 maneja las palabras clave exactas, RRF fusiona ambas y <a href="https://milvus.io/docs/tiered-storage-overview.md">el almacenamiento por niveles</a> mantiene toda la pila en un VPS de 5 dólares al mes.</p>
<p>El punto más importante: una vez que la recuperación funciona, el agente no sólo almacena mejores respuestas: almacena mejores estrategias de recuperación como Skills. La ruta de obtención se convierte en un documento versionable que mejora con el uso. Esto es lo que diferencia a un agente que acumula experiencia en el dominio de otro que empieza de cero en cada sesión. Para una comparación de cómo otros agentes manejan (o no manejan) este problema, véase <a href="https://milvus.io/blog/claude-code-memory-memsearch.md">Explicación del sistema de memoria de Claude Code.</a></p>
<h2 id="Get-Started" class="common-anchor-header">Cómo empezar<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Pruebe las herramientas de este artículo:</strong></p>
<ul>
<li><a href="https://github.com/NousResearch/hermes-agent">Agente Hermes en GitHub</a> - script de instalación, configuración del proveedor y configuración del canal utilizado arriba.</li>
<li><a href="https://milvus.io/docs/install_standalone-docker.md">Milvus 2.6 Standalone Quickstart</a> - despliegue Docker de nodo único para el backend de la base de conocimientos.</li>
<li><a href="https://milvus.io/docs/multi-vector-search.md">Milvus Hybrid Search Tutorial</a> - denso completo + BM25 + RRF ejemplo que coincide con el guión en este post.</li>
</ul>
<p><strong>¿Tiene preguntas sobre la búsqueda híbrida Hermes + Milvus?</strong></p>
<ul>
<li>Únase al <a href="https://discord.gg/milvus">Discord</a> de Milvus para preguntar sobre la búsqueda híbrida, el almacenamiento por niveles o los patrones de Skill-routing - otros desarrolladores están construyendo pilas similares.</li>
<li><a href="https://milvus.io/community#office-hours">Reserve una sesión de Milvus Office Hours</a> para recorrer su propia configuración de agente + base de conocimientos con el equipo de Milvus.</li>
</ul>
<p><strong>¿Quiere saltarse el autoalojamiento?</strong></p>
<ul>
<li><a href="https://cloud.zilliz.com/signup">Regístrese</a> o <a href="https://cloud.zilliz.com/login">inicie</a> sesión en Zilliz Cloud: Milvus gestionado con búsqueda híbrida y almacenamiento por niveles listo para usar. Las nuevas cuentas de correo electrónico de trabajo obtienen <strong> 100 dólares en créditos gratuitos</strong>.</li>
</ul>
<h2 id="Further-Reading" class="common-anchor-header">Más información<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/docs/release_notes.md">Notas de la versión Milvus 2.6</a> - almacenamiento por niveles, búsqueda híbrida, cambios de esquema</li>
<li><a href="https://zilliz.com/blog">Zilliz Cloud &amp; Milvus CLI + Official Skills</a> - herramientas operativas para agentes nativos de Milvus</li>
<li><a href="https://zilliz.com/blog">Why RAG-Style Knowledge Management Breaks for Agents</a> - el caso del diseño de memoria específico para agentes</li>
<li><a href="https://zilliz.com/blog">Claude Code's Memory System Is More Primitive Than You'd Expect</a> - pieza de comparación sobre la pila de memoria de otro agente</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Preguntas más frecuentes<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-does-Hermes-Agents-Skill-Learning-Loop-actually-work" class="common-anchor-header">¿Cómo funciona realmente el Bucle de Aprendizaje de Habilidades del Agente Hermes?</h3><p>Hermes registra cada flujo de trabajo que ejecuta - el script llamado, los argumentos pasados y la forma de retorno - como una traza de memoria. Cuando el mismo patrón aparece en dos o más sesiones, el bucle de aprendizaje se activa y escribe una habilidad reutilizable: un archivo Markdown que captura el flujo de trabajo como un procedimiento repetible. A partir de ese momento, Hermes se dirige a la habilidad sólo por intención, sin que el usuario la nombre. La dependencia crítica es la recuperación: el bucle sólo se activa si puede encontrar el rastro de la sesión anterior, razón por la cual la búsqueda por palabras clave se convierte en un cuello de botella a gran escala.</p>
<h3 id="Whats-the-difference-between-hybrid-search-and-vector-only-search-for-agent-memory" class="common-anchor-header">¿Cuál es la diferencia entre la búsqueda híbrida y la búsqueda sólo vectorial para la memoria del agente?</h3><p>La búsqueda sólo vectorial maneja bien el significado, pero falla en las coincidencias exactas. Si un desarrollador pega una cadena de error como ConnectionResetError o un nombre de función como find_similar_task, una búsqueda puramente vectorial podría devolver resultados semánticamente relacionados pero erróneos. La búsqueda híbrida combina vectores densos (semántica) con BM25 (palabra clave) y fusiona los dos conjuntos de resultados con Reciprocal Rank Fusion. Para la memoria de agente - donde las consultas van desde una intención vaga ("Python concurrency") hasta símbolos exactos - la búsqueda híbrida cubre ambos extremos en una sola llamada sin lógica de enrutamiento en su capa de aplicación.</p>
<h3 id="Can-I-use-Milvus-hybrid-search-with-AI-agents-other-than-Hermes" class="common-anchor-header">¿Puedo utilizar la búsqueda híbrida de Milvus con agentes de IA distintos de Hermes?</h3><p>Sí. El patrón de integración es genérico: el agente llama a un script de recuperación, el script consulta a Milvus, y los resultados vuelven como trozos clasificados con metadatos de origen. Cualquier marco de agentes que admita llamadas a herramientas o ejecución de shell puede utilizar el mismo enfoque. Hermes encaja perfectamente porque su bucle de aprendizaje depende específicamente de la recuperación entre sesiones para activarse, pero la parte de Milvus es independiente del agente: no sabe ni le importa qué agente la llama.</p>
<h3 id="How-much-does-a-self-hosted-Milvus-+-Hermes-setup-cost-per-month" class="common-anchor-header">¿Cuánto cuesta al mes una configuración autoalojada de Milvus + Hermes?</h3><p>Un único nodo Milvus 2.6 Standalone en un VPS de 2 núcleos / 4 GB con almacenamiento escalonado cuesta unos 5 $/mes. OpenAI text-embedding-3-small cuesta 0,02$ por 1M de tokens - unos pocos céntimos al mes para una base de conocimiento personal. La inferencia LLM domina el coste total y escala con el uso, no con la pila de recuperación.</p>
