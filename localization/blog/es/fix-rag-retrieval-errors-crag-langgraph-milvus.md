---
id: fix-rag-retrieval-errors-crag-langgraph-milvus.md
title: 'Corregir errores de recuperación de RAG con CRAG, LangGraph y Milvus'
author: Min Yin
date: 2026-3-23
cover: assets.zilliz.com/cover_CRAG_a05dddbaa2_aafaad6bc0.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'CRAG, RAG retrieval, LangGraph, Milvus, hybrid retrieval'
meta_title: |
  Fix RAG Retrieval Errors with CRAG, LangGraph, and Milvus
desc: >-
  ¿Alta similitud pero respuestas erróneas? Descubra cómo CRAG añade evaluación
  y corrección a los procesos RAG. Cree un sistema listo para la producción con
  LangGraph + Milvus.
origin: 'https://milvus.io/blog/fix-rag-retrieval-errors-crag-langgraph-milvus.md'
---
<p>A medida que las aplicaciones LLM entran en producción, los equipos necesitan cada vez más que sus modelos respondan a preguntas basadas en datos privados o información en tiempo real. La <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">generación aumentada por recuperación</a> (RAG), en la que el modelo recurre a una base de conocimientos externa en el momento de la consulta, es el enfoque estándar. Reduce las alucinaciones y mantiene las respuestas actualizadas.</p>
<p>Pero en la práctica surge un problema: <strong>un documento puede tener una puntuación alta en similitud y, sin embargo, ser completamente erróneo para la pregunta.</strong> Los procedimientos tradicionales de RAG equiparan la similitud con la pertinencia. En la práctica, esta suposición se rompe. Un resultado muy valorado puede estar obsoleto, tener una relación tangencial o carecer del detalle exacto que necesita el usuario.</p>
<p>CRAG (Corrective Retrieval-Augmented Generation) aborda este problema añadiendo la evaluación y la corrección entre la recuperación y la generación. En lugar de confiar ciegamente en las puntuaciones de similitud, el sistema comprueba si el contenido recuperado responde realmente a la pregunta y corrige la situación cuando no es así.</p>
<p>Este artículo explica cómo construir un sistema CRAG listo para la producción utilizando LangChain, LangGraph y <a href="https://milvus.io/intro">Milvus</a>.</p>
<h2 id="Three-Retrieval-Problems-Traditional-RAG-Doesnt-Solve" class="common-anchor-header">Tres problemas de recuperación que la GAR tradicional no resuelve<button data-href="#Three-Retrieval-Problems-Traditional-RAG-Doesnt-Solve" class="anchor-icon" translate="no">
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
    </button></h2><p>La mayoría de los fallos de RAG en producción se remontan a uno de estos tres problemas:</p>
<p><strong>Desajuste en la recuperación.</strong> El documento es similar desde el punto de vista temático, pero en realidad no responde a la pregunta. Pregunte cómo configurar un certificado HTTPS en Nginx, y el sistema podría devolver una guía de configuración de Apache, un tutorial 2019, o una explicación general sobre cómo funciona TLS. Semánticamente cercano, prácticamente inútil.</p>
<p><strong>Contenido obsoleto.</strong> <a href="https://zilliz.com/learn/vector-similarity-search">La búsqueda vectorial</a> no tiene concepto de actualidad. Consulta "Python async best practices" y obtendrás una mezcla de patrones de 2018 y patrones de 2024, clasificados puramente por distancia de incrustación. El sistema no puede distinguir cuál necesita realmente el usuario.</p>
<p><strong>Contaminación de la memoria.</strong> Este problema se agrava con el tiempo y suele ser el más difícil de solucionar. Digamos que el sistema recupera una referencia API obsoleta y genera código incorrecto. Ese resultado erróneo se almacena de nuevo en la memoria. En la siguiente consulta similar, el sistema la recupera de nuevo, lo que refuerza el error. La información antigua y la nueva se mezclan gradualmente, y la fiabilidad del sistema se erosiona con cada ciclo.</p>
<p>No se trata de casos aislados. Aparecen con regularidad cuando un sistema GAR gestiona tráfico real. Eso es lo que hace que los controles de calidad de la recuperación sean un requisito, y no un detalle.</p>
<h2 id="What-Is-CRAG-Evaluate-First-Then-Generate" class="common-anchor-header">¿Qué es el CRAG? Evaluar primero, generar después<button data-href="#What-Is-CRAG-Evaluate-First-Then-Generate" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>La Generación mejorada de recuperación correctiva (CRAG)</strong> es un método que añade un paso de evaluación y corrección entre la recuperación y la generación en un proceso de GAR. Se introdujo en el artículo <a href="https://openreview.net/forum?id=JnWJbrnaUE"><em>Corrective Retrieval Augmented Generation</em></a> (Yan et al., 2024). A diferencia de la GAR tradicional, que toma una decisión binaria -utilizar el documento o descartarlo-, la GAR puntúa cada resultado recuperado según su relevancia y lo dirige a través de una de las tres rutas de corrección antes de que llegue al modelo lingüístico.</p>
<p>La RAG tradicional tiene dificultades cuando los resultados de la recuperación se sitúan en una zona gris: parcialmente relevantes, algo anticuados o sin una pieza clave. Una simple puerta sí/no descarta la información parcial útil o deja pasar el contenido ruidoso. CRAG replantea el proceso de <strong>recuperar → generar</strong> a <strong>recuperar → evaluar → corregir → generar</strong>, dando al sistema la oportunidad de corregir la calidad de la recuperación antes de que comience la generación.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/fix_rag_retrieval_errors_crag_langgraph_milvus_1_11a820f454.png" alt="CRAG four-step workflow: Retrieval → Evaluation → Correction → Generation, showing how documents are scored and routed" class="doc-image" id="crag-four-step-workflow:-retrieval-→-evaluation-→-correction-→-generation,-showing-how-documents-are-scored-and-routed" />
   <span>Flujo de trabajo en cuatro pasos de CRAG: Recuperación → Evaluación → Corrección → Generación, que muestra cómo se puntúan y enrutan los documentos.</span> </span></p>
<p>Los resultados obtenidos se clasifican en una de las tres categorías siguientes:</p>
<ul>
<li><strong>Correctos:</strong> responden directamente a la consulta; utilizables tras un ligero refinamiento.</li>
<li><strong>Ambiguos</strong>: parcialmente pertinentes; necesitan información complementaria.</li>
<li><strong>Incorrecto</strong>: irrelevante; se descarta y se recurre a fuentes alternativas.</li>
</ul>
<table>
<thead>
<tr><th>Decisión</th><th>Confianza</th><th>Acción</th></tr>
</thead>
<tbody>
<tr><td>Correcto</td><td>&gt; 0.9</td><td>Afinar el contenido del documento</td></tr>
<tr><td>Ambiguo</td><td>0.5-0.9</td><td>Refinar el documento + completar con búsqueda en la web</td></tr>
<tr><td>Incorrecto</td><td>&lt; 0.5</td><td>Descartar los resultados de la recuperación; recurrir por completo a la búsqueda en la web</td></tr>
</tbody>
</table>
<h3 id="Content-Refinement" class="common-anchor-header">Perfeccionamiento del contenido</h3><p>La CRAG también aborda un problema más sutil de la RAG estándar: la mayoría de los sistemas introducen en el modelo el documento recuperado completo. Esto desperdicia tokens y diluye la señal: el modelo tiene que vadear párrafos irrelevantes para encontrar la frase que realmente importa. CRAG refina primero el contenido recuperado, extrayendo las partes relevantes y eliminando el resto.</p>
<p>Para ello, el artículo original utiliza tiras de conocimiento y reglas heurísticas. En la práctica, la concordancia de palabras clave funciona en muchos casos, y los sistemas de producción pueden añadir un resumen basado en LLM o una extracción estructurada para obtener una mayor calidad.</p>
<p>El proceso de refinamiento consta de tres partes:</p>
<ul>
<li><strong>Descomposición del documento:</strong> extracción de los pasajes clave de un documento más largo.</li>
<li><strong>Reescritura de consultas:</strong> transforma consultas vagas o ambiguas en otras más específicas.</li>
<li><strong>Selección del conocimiento:</strong> deduplicar, clasificar y retener sólo el contenido más útil.</li>
</ul>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/fix_rag_retrieval_errors_crag_langgraph_milvus_2_9ec4b6aa81.png" alt="The three-step document refinement process: Document Decomposition (2000 → 500 tokens), Query Rewriting (improved search precision), and Knowledge Selection (filter, rank, and trim)" class="doc-image" id="the-three-step-document-refinement-process:-document-decomposition-(2000-→-500-tokens),-query-rewriting-(improved-search-precision),-and-knowledge-selection-(filter,-rank,-and-trim)" />
   <span>El proceso de refinamiento de documentos en tres pasos: Descomposición del documento (2000 → 500 tokens), reescritura de la consulta (mejora de la precisión de la búsqueda) y selección del conocimiento (filtrado, clasificación y recorte)</span> </span></p>
<h3 id="The-Evaluator" class="common-anchor-header">El evaluador</h3><p>El evaluador es el núcleo de CRAG. No está pensado para un razonamiento profundo, sino para un rápido triaje. Dada una consulta y un conjunto de documentos recuperados, decide si el contenido es lo suficientemente bueno como para utilizarlo.</p>
<p>El artículo original opta por un modelo T5-Large ajustado en lugar de un LLM de propósito general. El razonamiento: la velocidad y la precisión son más importantes que la flexibilidad para esta tarea concreta.</p>
<table>
<thead>
<tr><th>Atributo</th><th>T5-Large ajustado</th><th>GPT-4</th></tr>
</thead>
<tbody>
<tr><td>Latencia</td><td>10-20 ms</td><td>200 ms+</td></tr>
<tr><td>Precisión</td><td>92% (experimentos en papel)</td><td>TBD</td></tr>
<tr><td>Ajuste de tareas</td><td>Alta: ajuste fino para una sola tarea, mayor precisión</td><td>Media - de uso general, más flexible pero menos especializada</td></tr>
</tbody>
</table>
<h3 id="Web-Search-Fallback" class="common-anchor-header">Búsqueda web de emergencia</h3><p>Cuando la recuperación interna se considera incorrecta o ambigua, el CRAG puede activar una búsqueda en Internet para obtener información más reciente o complementaria. Esto actúa como una red de seguridad para consultas urgentes y temas en los que la base de conocimientos interna tiene lagunas.</p>
<h2 id="Why-Milvus-Is-a-Good-Fit-for-CRAG-in-Production" class="common-anchor-header">Por qué Milvus es una buena opción para CRAG en producción<button data-href="#Why-Milvus-Is-a-Good-Fit-for-CRAG-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>La eficacia de CRAG depende de lo que haya debajo. La <a href="https://zilliz.com/learn/what-is-vector-database">base de datos vectorial</a> tiene que hacer algo más que una búsqueda básica de similitudes: tiene que soportar el aislamiento multiusuario, la recuperación híbrida y la flexibilidad de esquemas que exige un sistema CRAG de producción.</p>
<p>Después de evaluar varias opciones, elegimos <a href="https://zilliz.com/what-is-milvus">Milvus</a> por tres razones.</p>
<h3 id="Multi-Tenant-Isolation" class="common-anchor-header">Aislamiento multiusuario</h3><p>En los sistemas basados en agentes, cada usuario o sesión necesita su propio espacio de memoria. El enfoque ingenuo (una colección por inquilino) se convierte rápidamente en un quebradero de cabeza operativo, especialmente a gran escala.</p>
<p>Milvus maneja esto con <a href="https://milvus.io/docs/use-partition-key.md">Partition Key</a>. Establezca <code translate="no">is_partition_key=True</code> en el campo <code translate="no">agent_id</code> y Milvus dirigirá las consultas a la partición correcta automáticamente. Sin desbordamiento de colecciones, sin código de enrutamiento manual.</p>
<p>En nuestras pruebas comparativas con 10 millones de vectores a través de 100 inquilinos, Milvus con compactación de agrupamiento proporcionó <strong>un QPS entre 3 y 5 veces superior</strong> en comparación con la línea de base no optimizada.</p>
<h3 id="Hybrid-Retrieval" class="common-anchor-header">Recuperación híbrida</h3><p>La búsqueda vectorial pura se queda corta en SKU de contenido-producto de coincidencia exacta como <code translate="no">SKU-2024-X5</code>, cadenas de versión o terminología específica.</p>
<p>Milvus 2.5 admite de forma nativa la <a href="https://milvus.io/docs/multi-vector-search.md">recuperación híbr</a> ida: vectores densos para la similitud semántica, vectores dispersos para la concordancia de palabras clave al estilo BM25 y filtrado escalar de metadatos, todo en una sola consulta. Los resultados se fusionan mediante la fusión recíproca de rangos (RRF), por lo que no es necesario crear y fusionar procesos de recuperación independientes.</p>
<p>En un conjunto de datos de 1 millón de vectores, la latencia de recuperación de Milvus Sparse-BM25 fue de <strong>6 ms</strong>, con un impacto insignificante en el rendimiento CRAG de extremo a extremo.</p>
<h3 id="Flexible-Schema-for-Evolving-Memory" class="common-anchor-header">Esquema flexible para una memoria en evolución</h3><p>A medida que los procesos CRAG maduran, el modelo de datos evoluciona con ellos. Necesitábamos añadir campos como <code translate="no">confidence</code>, <code translate="no">verified</code>, y <code translate="no">source</code> mientras iterábamos sobre la lógica de evaluación. En la mayoría de las bases de datos, eso significa scripts de migración y tiempo de inactividad.</p>
<p>Milvus admite campos JSON dinámicos, por lo que los metadatos pueden ampliarse sobre la marcha sin interrupciones del servicio.</p>
<p>He aquí un esquema típico:</p>
<pre><code translate="no" class="language-python">fields = [
    FieldSchema(name=<span class="hljs-string">&quot;agent_id&quot;</span>, dtype=DataType.VARCHAR, is_partition_key=<span class="hljs-literal">True</span>),  <span class="hljs-comment"># multi-tenancy</span>
    FieldSchema(name=<span class="hljs-string">&quot;dense_embedding&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>),   <span class="hljs-comment"># semantic retrieval</span>
    FieldSchema(name=<span class="hljs-string">&quot;sparse_embedding&quot;</span>, dtype=DataType.SPARSE_FLOAT_VECTOR),<span class="hljs-comment"># BM25</span>
    FieldSchema(name=<span class="hljs-string">&quot;metadata&quot;</span>, dtype=DataType.JSON),<span class="hljs-comment"># dynamic schema</span>
]

<span class="hljs-comment"># hybrid retrieval + metadata filtering</span>
results = collection.hybrid_search(
    reqs=[
        AnnSearchRequest(data=[dense_vec], anns_field=<span class="hljs-string">&quot;dense_embedding&quot;</span>, limit=<span class="hljs-number">20</span>),
        AnnSearchRequest(data=[sparse_vec], anns_field=<span class="hljs-string">&quot;sparse_embedding&quot;</span>, limit=<span class="hljs-number">20</span>)
    ],
    rerank=RRFRanker(),
    output_fields=[<span class="hljs-string">&quot;metadata&quot;</span>],
    expr=<span class="hljs-string">&#x27;metadata[&quot;confidence&quot;] &gt; 0.9&#x27;</span>,<span class="hljs-comment"># CRAG confidence filtering</span>
    limit=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus también simplifica el escalado del despliegue. Ofrece <a href="https://milvus.io/docs/install-overview.md">los modos Lite, Standalone y Distributed</a> que son compatibles con el código: para pasar del desarrollo local a un clúster de producción sólo es necesario cambiar la cadena de conexión.</p>
<h2 id="Hands-On-Build-a-CRAG-System-with-LangGraph-Middleware-and-Milvus" class="common-anchor-header">Práctica: Creación de un sistema CRAG con LangGraph Middleware y Milvus<button data-href="#Hands-On-Build-a-CRAG-System-with-LangGraph-Middleware-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Why-the-Middleware-Approach" class="common-anchor-header">¿Por qué el enfoque Middleware?</h3><p>Una forma común de construir CRAG con LangGraph es cablear un grafo de estado con nodos y aristas controlando cada paso. Esto funciona, pero el gráfico se enreda a medida que crece la complejidad, y la depuración se convierte en un dolor de cabeza.</p>
<p>En LangGraph 1.0 nos decidimos por el <strong>patrón Middleware</strong>. Intercepta las peticiones antes de la llamada al modelo, por lo que la recuperación, evaluación y corrección se gestionan en un único lugar. En comparación con el enfoque del gráfico de estados:</p>
<ul>
<li><strong>Menos código:</strong> la lógica está centralizada, no dispersa por los nodos del grafo.</li>
<li><strong>Más fácil de seguir:</strong> el flujo de control se lee linealmente.</li>
<li><strong>Más fácil de depurar:</strong> los fallos apuntan a una única ubicación, no a un recorrido por el gráfico.</li>
</ul>
<h3 id="Core-Workflow" class="common-anchor-header">Flujo de trabajo principal</h3><p>El proceso se ejecuta en cuatro pasos:</p>
<ol>
<li><strong>Recuperación:</strong> se obtienen los 3 documentos más relevantes de Milvus, asignados al inquilino actual.</li>
<li><strong>Evaluación:</strong> valorar la calidad de los documentos con un modelo ligero</li>
<li><strong>Corrección:</strong> refinar, complementar con búsquedas en la web o volver atrás por completo en función del veredicto.</li>
<li><strong>Inyección:</strong> pasar el contexto finalizado al modelo a través de una solicitud dinámica del sistema.</li>
</ol>
<h3 id="Environment-Setup-and-Data-Preparation" class="common-anchor-header">Configuración del entorno y preparación de los datos</h3><p><strong>Variables de entorno</strong></p>
<pre><code translate="no" class="language-bash"><span class="hljs-keyword">export</span> <span class="hljs-variable constant_">OPENAI_API_KEY</span>=<span class="hljs-string">&quot;your-api-key&quot;</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">TAVILY_API_KEY</span>=<span class="hljs-string">&quot;your-tavily-key&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Crear la colección Milvus</strong></p>
<p>Antes de ejecutar el código, cree una colección en Milvus con un esquema que coincida con la lógica de recuperación.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># filename: crag_agent.py</span>

<span class="hljs-comment"># ============ Import dependencies ============</span>
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">Literal</span>, <span class="hljs-type">List</span>
<span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> AgentMiddleware, before_model, dynamic_prompt
<span class="hljs-keyword">from</span> langchain.chat_models <span class="hljs-keyword">import</span> init_chat_model
<span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain_openai <span class="hljs-keyword">import</span> OpenAIEmbeddings
<span class="hljs-keyword">from</span> langchain_core.documents <span class="hljs-keyword">import</span> Document
<span class="hljs-keyword">from</span> langchain_core.messages <span class="hljs-keyword">import</span> SystemMessage, HumanMessage
<span class="hljs-keyword">from</span> langchain_community.tools.tavily_search <span class="hljs-keyword">import</span> TavilySearchResults


<span class="hljs-comment"># ============ CRAG Middleware (minimal-change version) ============</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">CRAGMiddleware</span>(<span class="hljs-title class_ inherited__">AgentMiddleware</span>):
    <span class="hljs-string">&quot;&quot;&quot;CRAG evaluation and correction middleware (uses official decorator-based hooks to avoid permanently polluting the message stack)&quot;&quot;&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, vector_store: Milvus, agent_id: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-built_in">super</span>().__init__()
        <span class="hljs-variable language_">self</span>.vector_store = vector_store
        <span class="hljs-variable language_">self</span>.agent_id = agent_id  <span class="hljs-comment"># multi-tenant isolation</span>
        <span class="hljs-comment"># Lightweight evaluator: used for relevance judgment (can be replaced with the structured version introduced later)</span>
        <span class="hljs-variable language_">self</span>.evaluator = init_chat_model(<span class="hljs-string">&quot;openai:gpt-4o-mini&quot;</span>, temperature=<span class="hljs-number">0</span>)
        <span class="hljs-comment"># Web search fallback</span>
        <span class="hljs-variable language_">self</span>.web_search = TavilySearchResults(max_results=<span class="hljs-number">3</span>)

<span class="hljs-meta">    @before_model</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">run_crag</span>(<span class="hljs-params">self, state</span>):
        <span class="hljs-string">&quot;&quot;&quot;Run retrieval -&gt; evaluation -&gt; correction before model invocation and prepare the final context&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Get the last user message</span>
        last_msg = state[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>]
        query = <span class="hljs-built_in">getattr</span>(last_msg, <span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>) <span class="hljs-keyword">if</span> <span class="hljs-built_in">hasattr</span>(last_msg, <span class="hljs-string">&quot;content&quot;</span>) <span class="hljs-keyword">else</span> last_msg.get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)

        <span class="hljs-comment"># 1. Retrieval: get documents from Milvus (PartitionKey + confidence filtering)</span>
        docs = <span class="hljs-variable language_">self</span>._retrieve_from_milvus(query)

        <span class="hljs-comment"># 2. Evaluation: three-way decision</span>
        verdict = <span class="hljs-variable language_">self</span>._evaluate_relevance(query, docs)

        <span class="hljs-comment"># 3. Correction: choose the handling strategy based on the verdict</span>
        <span class="hljs-keyword">if</span> verdict == <span class="hljs-string">&quot;incorrect&quot;</span>:
            <span class="hljs-comment"># Retrieval failed, rely entirely on Web search</span>
            web_results = <span class="hljs-variable language_">self</span>._web_search_fallback(query)
            final_context = <span class="hljs-variable language_">self</span>._format_web_results(web_results)
        <span class="hljs-keyword">elif</span> verdict == <span class="hljs-string">&quot;ambiguous&quot;</span>:
            <span class="hljs-comment"># Retrieval is ambiguous, refine documents + supplement with Web search</span>
            refined_docs = <span class="hljs-variable language_">self</span>._refine_documents(docs, query)
            web_results = <span class="hljs-variable language_">self</span>._web_search_fallback(query)
            final_context = <span class="hljs-variable language_">self</span>._merge_context(refined_docs, web_results)
        <span class="hljs-keyword">else</span>:
            <span class="hljs-comment"># Retrieval quality is good, only refine the documents</span>
            refined_docs = <span class="hljs-variable language_">self</span>._refine_documents(docs, query)
            final_context = <span class="hljs-variable language_">self</span>._format_internal_docs(refined_docs)

        <span class="hljs-comment"># 4. Put the context into a temporary key, used only for dynamic prompt assembly in the current model call</span>
        state[<span class="hljs-string">&quot;_crag_context&quot;</span>] = final_context
        <span class="hljs-keyword">return</span> state

<span class="hljs-meta">    @dynamic_prompt</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">attach_context</span>(<span class="hljs-params">self, state, prompt_messages: <span class="hljs-type">List</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Inject the CRAG-generated context as a SystemMessage before the prompt for the current model call&quot;&quot;&quot;</span>
        final_context = state.get(<span class="hljs-string">&quot;_crag_context&quot;</span>)
        <span class="hljs-keyword">if</span> final_context:
            sys_msg = SystemMessage(
                content=<span class="hljs-string">f&quot;Here is some relevant background information. Please answer the user&#x27;s question based on this information:\n\n<span class="hljs-subst">{final_context}</span>&quot;</span>
            )
            <span class="hljs-comment"># Applies only to the current call and is not permanently written into state[&quot;messages&quot;]</span>
            prompt_messages = [sys_msg] + prompt_messages
        <span class="hljs-keyword">return</span> prompt_messages

    <span class="hljs-comment"># ======== Internal methods: retrieval / evaluation / refinement / formatting ========</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_retrieve_from_milvus</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Retrieve documents from Milvus (Partition Key + confidence filtering)&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            <span class="hljs-comment"># Note: different adapter versions may place filter parameters differently; here expr is passed through search_kwargs</span>
            docs = <span class="hljs-variable language_">self</span>.vector_store.similarity_search(
                query,
                k=<span class="hljs-number">3</span>,
                search_kwargs={<span class="hljs-string">&quot;expr&quot;</span>: <span class="hljs-string">f&#x27;agent_id == &quot;<span class="hljs-subst">{self.agent_id}</span>&quot;&#x27;</span>}
            )
            <span class="hljs-comment"># Confidence filtering (to avoid low-quality memory contamination)</span>
            filtered_docs = [
                doc <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs
                <span class="hljs-keyword">if</span> (doc.metadata <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;confidence&quot;</span>, <span class="hljs-number">0.0</span>) &gt; <span class="hljs-number">0.7</span>
            ]
            <span class="hljs-keyword">return</span> filtered_docs <span class="hljs-keyword">or</span> docs  <span class="hljs-comment"># If there are no high-confidence results, fall back to the original results for evaluator judgment</span>
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Retrieval failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> []

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_evaluate_relevance</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]:
        <span class="hljs-string">&quot;&quot;&quot;Evaluate document relevance (three-way decision), simplified version: the LLM returns the verdict directly&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;incorrect&quot;</span>

        <span class="hljs-comment"># Evaluate only the Top-3 documents, taking the first 500 characters of each</span>
        doc_content = <span class="hljs-string">&quot;\n\n&quot;</span>.join([
            <span class="hljs-string">f&quot;[Document <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>] <span class="hljs-subst">{(doc.page_content <span class="hljs-keyword">or</span> <span class="hljs-string">&#x27;&#x27;</span>)[:<span class="hljs-number">500</span>]}</span>...&quot;</span>
            <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs[:<span class="hljs-number">3</span>])
        ])

        prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an expert in document relevance evaluation. Assess whether the following documents can answer the query.

Query: <span class="hljs-subst">{query}</span>

Document content:
<span class="hljs-subst">{doc_content}</span>

Evaluation criteria:
- relevant: the document directly contains the answer and is highly relevant
- ambiguous: the document is partially relevant and needs external knowledge
- incorrect: the document is irrelevant and cannot answer the query

Return only one word: relevant or ambiguous or incorrect
&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            result = <span class="hljs-variable language_">self</span>.evaluator.invoke(prompt)
            verdict = (<span class="hljs-built_in">getattr</span>(result, <span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>) <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;&quot;</span>).strip().lower()
            <span class="hljs-keyword">if</span> verdict <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> {<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>}:
                verdict = <span class="hljs-string">&quot;ambiguous&quot;</span>
            <span class="hljs-keyword">return</span> verdict
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Evaluation failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;ambiguous&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_refine_documents</span>(<span class="hljs-params">self, docs: <span class="hljs-built_in">list</span>, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Refine documents (simplified strips: sentence filtering based on keywords)&quot;&quot;&quot;</span>
        refined = []
        <span class="hljs-comment"># Simple Chinese-period replacement + rough English sentence splitting</span>
        keywords = [kw.strip() <span class="hljs-keyword">for</span> kw <span class="hljs-keyword">in</span> query.split() <span class="hljs-keyword">if</span> kw.strip()]

        <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs:
            text = doc.page_content <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;&quot;</span>
            sentences = (
                text.replace(<span class="hljs-string">&quot;。&quot;</span>, <span class="hljs-string">&quot;。\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;. &quot;</span>, <span class="hljs-string">&quot;.\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;! &quot;</span>, <span class="hljs-string">&quot;!\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;? &quot;</span>, <span class="hljs-string">&quot;?\n&quot;</span>)
                    .split(<span class="hljs-string">&quot;\n&quot;</span>)
            )
            sentences = [s.strip() <span class="hljs-keyword">for</span> s <span class="hljs-keyword">in</span> sentences <span class="hljs-keyword">if</span> s.strip()]

            <span class="hljs-comment"># Match any keyword</span>
            relevant_sentences = [
                s <span class="hljs-keyword">for</span> s <span class="hljs-keyword">in</span> sentences
                <span class="hljs-keyword">if</span> <span class="hljs-built_in">any</span>(keyword <span class="hljs-keyword">in</span> s <span class="hljs-keyword">for</span> keyword <span class="hljs-keyword">in</span> keywords)
            ]

            <span class="hljs-keyword">if</span> relevant_sentences:
                refined_text = <span class="hljs-string">&quot;。&quot;</span>.join(relevant_sentences[:<span class="hljs-number">3</span>])
                refined.append(Document(page_content=refined_text, metadata=doc.metadata <span class="hljs-keyword">or</span> {}))

        <span class="hljs-keyword">return</span> refined <span class="hljs-keyword">if</span> refined <span class="hljs-keyword">else</span> docs  <span class="hljs-comment"># If nothing is extracted, fall back to the original documents</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_web_search_fallback</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Web search fallback&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.web_search.invoke(query) <span class="hljs-keyword">or</span> []
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Web search failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> []

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_merge_context</span>(<span class="hljs-params">self, internal_docs: <span class="hljs-built_in">list</span>, web_results: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Merge internal memory and external knowledge into the final context&quot;&quot;&quot;</span>
        parts = []
        <span class="hljs-keyword">if</span> internal_docs:
            parts.append(<span class="hljs-string">&quot;[Internal Memory]&quot;</span>)
            <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(internal_docs, <span class="hljs-number">1</span>):
                parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{doc.page_content}</span>&quot;</span>)
        <span class="hljs-keyword">if</span> web_results:
            parts.append(<span class="hljs-string">&quot;[External Knowledge]&quot;</span>)
            <span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(web_results, <span class="hljs-number">1</span>):
                content = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
                url = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;url&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
                parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{content}</span>\n   Source: <span class="hljs-subst">{url}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts) <span class="hljs-keyword">if</span> parts <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_format_internal_docs</span>(<span class="hljs-params">self, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Format internal documents&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>
        parts = [<span class="hljs-string">&quot;[Internal Memory]&quot;</span>]
        <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs, <span class="hljs-number">1</span>):
            parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{doc.page_content}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts)

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_format_web_results</span>(<span class="hljs-params">self, results: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Format Web search results&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> results:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>
        parts = [<span class="hljs-string">&quot;[External Knowledge]&quot;</span>]
        <span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results, <span class="hljs-number">1</span>):
            content = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
            url = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;url&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
            parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{content}</span>\n   Source: <span class="hljs-subst">{url}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts)


<span class="hljs-comment"># ============ Initialize the Milvus vector database ============</span>
vector_store = Milvus(
    embedding_function=OpenAIEmbeddings(),
    connection_args={<span class="hljs-string">&quot;host&quot;</span>: <span class="hljs-string">&quot;localhost&quot;</span>, <span class="hljs-string">&quot;port&quot;</span>: <span class="hljs-string">&quot;19530&quot;</span>},
    collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>
)

<span class="hljs-comment"># ============ Create Agent ============</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[TavilySearchResults(max_results=<span class="hljs-number">3</span>)],  <span class="hljs-comment"># Web search tool</span>
    middleware=[
        CRAGMiddleware(
            vector_store=vector_store,
            agent_id=<span class="hljs-string">&quot;user_123_session_456&quot;</span>  <span class="hljs-comment"># multi-tenant isolation: each Agent instance uses its own ID</span>
        )
    ]
)

<span class="hljs-comment"># ============ Example run ============</span>
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-comment"># Example query: use HumanMessage to ensure compatibility</span>
    response = agent.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [
            HumanMessage(content=<span class="hljs-string">&quot;What were the operating expenses in Nike&#x27;s latest quarterly earnings report?&quot;</span>)
        ]
    })
    <span class="hljs-built_in">print</span>(response[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>].content)
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p><strong>Versión Nota:</strong> Este código utiliza las últimas características de Middleware en LangGraph y LangChain. Estas API pueden cambiar a medida que evolucionan los marcos de trabajo; consulte la <a href="https://langchain-ai.github.io/langgraph/">documentación de LangGraph</a> para conocer el uso más actual.</p>
</blockquote>
<h3 id="Key-Modules" class="common-anchor-header">Módulos clave</h3><p><strong>1. Diseño del evaluador de producción</strong></p>
<p>El método <code translate="no">_evaluate_relevance()</code> del código anterior se ha simplificado intencionadamente para realizar pruebas rápidas. Para producción, querrá una salida estructurada con puntuación de confianza y explicabilidad:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pydantic <span class="hljs-keyword">import</span> BaseModel
<span class="hljs-keyword">from</span> langchain.prompts <span class="hljs-keyword">import</span> PromptTemplate

<span class="hljs-keyword">class</span> <span class="hljs-title class_">RelevanceVerdict</span>(<span class="hljs-title class_ inherited__">BaseModel</span>):
    <span class="hljs-string">&quot;&quot;&quot;Structured output for the evaluation result&quot;&quot;&quot;</span>
    verdict: <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]
    confidence: <span class="hljs-built_in">float</span>  <span class="hljs-comment"># confidence score (used for memory quality monitoring)</span>
    reasoning: <span class="hljs-built_in">str</span>     <span class="hljs-comment"># reason for the judgment (used for debugging and review)</span>

<span class="hljs-comment"># Note: the CRAG paper uses a fine-tuned T5-Large evaluator (10-20 ms latency)</span>
<span class="hljs-comment"># Here, gpt-4o-mini is used as the engineering implementation option (easier to deploy, but with slightly higher latency)</span>
grader_llm = ChatOpenAI(model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>, temperature=<span class="hljs-number">0</span>)

grader_prompt = PromptTemplate(
    template=<span class="hljs-string">&quot;&quot;&quot;You are an expert in document relevance evaluation. Assess whether the following documents can answer the query.

Query: {query}

Document content:
{document}

Evaluation criteria:
- relevant: the document directly contains the answer, confidence &gt; 0.9
- ambiguous: the document is partially relevant, confidence 0.5-0.9
- incorrect: the document is irrelevant, confidence &lt; 0.5

Return in JSON format: {{&quot;verdict&quot;: &quot;...&quot;, &quot;confidence&quot;: 0.xx, &quot;reasoning&quot;: &quot;...&quot;}}
&quot;&quot;&quot;</span>,
    input_variables=[<span class="hljs-string">&quot;query&quot;</span>, <span class="hljs-string">&quot;document&quot;</span>]
)

grader_chain = grader_prompt | grader_llm.with_structured_output(RelevanceVerdict)

<span class="hljs-comment"># Replace the _evaluate_relevance() method in CRAGMiddleware</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">_evaluate_relevance</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Evaluate document relevance (returns structured result)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;incorrect&quot;</span>

    <span class="hljs-comment"># Evaluate only the Top-3 documents, taking the first 500 characters of each</span>
    doc_content = <span class="hljs-string">&quot;\n\n&quot;</span>.join([
        <span class="hljs-string">f&quot;[Document <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>] <span class="hljs-subst">{doc.page_content[:<span class="hljs-number">500</span>]}</span>...&quot;</span>
        <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs[:<span class="hljs-number">3</span>])
    ])

    result = grader_chain.invoke({
        <span class="hljs-string">&quot;query&quot;</span>: query,
        <span class="hljs-string">&quot;document&quot;</span>: doc_content
    })

    <span class="hljs-comment"># Store the confidence score in logs or a monitoring system</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG Evaluation] verdict=<span class="hljs-subst">{result.verdict}</span>, confidence=<span class="hljs-subst">{result.confidence:<span class="hljs-number">.2</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG Reasoning] <span class="hljs-subst">{result.reasoning}</span>&quot;</span>)

    <span class="hljs-comment"># Optional: store the evaluation result in Milvus for memory quality analysis</span>
    <span class="hljs-variable language_">self</span>._store_evaluation_metrics(query, result)

    <span class="hljs-keyword">return</span> result.verdict

<span class="hljs-keyword">def</span> <span class="hljs-title function_">_store_evaluation_metrics</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, verdict_result: RelevanceVerdict</span>):
    <span class="hljs-string">&quot;&quot;&quot;Store evaluation metrics in Milvus (for memory quality monitoring)&quot;&quot;&quot;</span>
    <span class="hljs-comment"># Example: store the evaluation result in a separate Collection for analysis</span>
    <span class="hljs-comment"># In actual use, you need to create the evaluation_metrics Collection</span>
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>2. Perfeccionamiento del conocimiento y fallback</strong></p>
<p>Tres mecanismos trabajan juntos para mantener la alta calidad del contexto del modelo:</p>
<ul>
<li>El<strong>refinamiento del conocimiento</strong> extrae las frases más relevantes para la consulta y elimina el ruido.</li>
<li><strong>La búsqueda fallback</strong> se activa cuando la recuperación local es insuficiente, recurriendo al conocimiento externo a través de Tavily.</li>
<li><strong>La fusión de contextos</strong> combina la memoria interna con los resultados externos en un único bloque de contexto deduplicado antes de que llegue al modelo.</li>
</ul>
<h2 id="Tips-for-Running-CRAG-in-Production" class="common-anchor-header">Consejos para ejecutar CRAG en producción<button data-href="#Tips-for-Running-CRAG-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Una vez que se ha superado la fase de creación de prototipos, hay tres áreas que son muy importantes.</p>
<h3 id="1-Cost-Pick-the-Right-Evaluator" class="common-anchor-header">1. 1. Costes: Elija el evaluador adecuado</h3><p>El evaluador se ejecuta en cada una de las consultas, lo que lo convierte en la mayor palanca tanto para la latencia como para el coste.</p>
<ul>
<li><strong>Cargas de trabajo de alta concurrencia:</strong> Un modelo ligero ajustado como T5-Large mantiene la latencia en 10-20 ms y los costes predecibles.</li>
<li><strong>Poco tráfico o prototipos:</strong> Un modelo alojado como <code translate="no">gpt-4o-mini</code> es más rápido de configurar y necesita menos trabajo operativo, pero la latencia y los costes por llamada son más elevados.</li>
</ul>
<h3 id="2-Observability-Instrument-from-Day-One" class="common-anchor-header">2. Observabilidad: Instrumento desde el primer día</h3><p>Los problemas de producción más difíciles son los que no se ven hasta que la calidad de la respuesta ya se ha degradado.</p>
<ul>
<li><strong>Supervisión de la infraestructura:</strong> Milvus se integra con <a href="https://milvus.io/docs/monitor_overview.md">Prometheus</a>. Comience con tres métricas: <code translate="no">milvus_query_latency_seconds</code>, <code translate="no">milvus_search_qps</code>, y <code translate="no">milvus_insert_throughput</code>.</li>
<li><strong>Supervisión de aplicaciones:</strong> Realice un seguimiento de la distribución del veredicto CRAG, la tasa de activación de búsquedas web y la distribución de la puntuación de confianza. Sin estas señales, no podrá saber si un descenso de la calidad se debe a una mala recuperación o a un error de apreciación del evaluador.</li>
</ul>
<h3 id="3-Long-Term-Maintenance-Prevent-Memory-Contamination" class="common-anchor-header">3. Mantenimiento a largo plazo: Evitar la contaminación de la memoria</h3><p>Cuanto más tiempo se ejecuta un agente, más datos obsoletos y de baja calidad se acumulan en la memoria. Establezca barandillas con antelación:</p>
<ul>
<li><strong>Prefiltrado:</strong> Aflore a la superficie sólo las memorias con <code translate="no">confidence &gt; 0.7</code>, de modo que el contenido de baja calidad quede bloqueado antes de llegar al evaluador.</li>
<li><strong>Decadencia temporal:</strong> Reduzca gradualmente el peso de las memorias más antiguas. Treinta días es un plazo inicial razonable, que puede ajustarse en función del caso.</li>
<li><strong>Limpieza programada:</strong> Ejecute una tarea semanal para purgar las memorias antiguas, poco fiables y no verificadas. Así se evita el bucle de retroalimentación en el que los datos obsoletos se recuperan, se utilizan y se vuelven a almacenar.</li>
</ul>
<h2 id="Wrapping-Up--and-a-Few-Common-Questions" class="common-anchor-header">Conclusión y algunas preguntas frecuentes<button data-href="#Wrapping-Up--and-a-Few-Common-Questions" class="anchor-icon" translate="no">
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
    </button></h2><p>El CRAG aborda uno de los problemas más persistentes del GAR en producción: los resultados de recuperación que parecen relevantes pero no lo son. Al insertar un paso de evaluación y corrección entre la recuperación y la generación, filtra los malos resultados, rellena los huecos con búsquedas externas y proporciona al modelo un contexto más limpio con el que trabajar.</p>
<p>Sin embargo, para que el CRAG funcione de forma fiable en producción se necesita algo más que una buena lógica de recuperación. Requiere una base de datos vectorial que gestione el aislamiento multiusuario, la búsqueda híbrida y la evolución de los esquemas, que es donde <a href="https://milvus.io/intro">Milvus</a> encaja. En cuanto a la aplicación, elegir el evaluador adecuado, instrumentar la observabilidad en una fase temprana y gestionar activamente la calidad de la memoria es lo que separa una demostración de un sistema en el que se puede confiar.</p>
<p>Si está creando sistemas RAG o de agentes y se encuentra con problemas de calidad de recuperación, nos encantaría ayudarle:</p>
<ul>
<li>Únase a la <a href="https://slack.milvus.io/">comunidad Milvus Slack</a> para hacer preguntas, compartir su arquitectura y aprender de otros desarrolladores que trabajan en problemas similares.</li>
<li><a href="https://milvus.io/office-hours">Reserve una sesión gratuita de 20 minutos de Milvus Office Hours</a> para analizar su caso de uso con el equipo, ya sea el diseño de CRAG, la recuperación híbrida o el escalado multiempresa.</li>
<li>Si prefiere saltarse la configuración de la infraestructura y pasar directamente a la construcción, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus gestionado) ofrece un nivel gratuito para empezar.</li>
</ul>
<hr>
<p>Algunas preguntas que surgen a menudo cuando los equipos empiezan a implantar CRAG:</p>
<p><strong>¿En qué se diferencia CRAG de añadir un reordenador a RAG?</strong></p>
<p>Un reordenador reordena los resultados por relevancia, pero sigue asumiendo que los documentos recuperados son utilizables. El CRAG va más allá: evalúa si el contenido recuperado responde realmente a la consulta y toma medidas correctivas cuando no es así: refina las coincidencias parciales, complementa con búsquedas en la web o descarta los resultados por completo. Es un bucle de control de calidad, no sólo una mejor clasificación.</p>
<p><strong>¿Por qué una puntuación de similitud alta a veces devuelve el documento equivocado?</strong></p>
<p>La similitud de incrustación mide la proximidad semántica en el espacio vectorial, pero eso no es lo mismo que responder a la pregunta. Un documento sobre la configuración de HTTPS en Apache es semánticamente cercano a una pregunta sobre HTTPS en Nginx, pero no ayudará. CRAG detecta esto evaluando la relevancia para la consulta real, no sólo la distancia vectorial.</p>
<p><strong>¿Qué debo buscar en una base de datos vectorial para CRAG?</strong></p>
<p>Lo más importante son tres cosas: recuperación híbrida (para que pueda combinar la búsqueda semántica con la concordancia de palabras clave para términos exactos), aislamiento multiusuario (para que cada sesión de usuario o agente tenga su propio espacio de memoria) y un esquema flexible (para que pueda añadir campos como <code translate="no">confidence</code> o <code translate="no">verified</code> sin tiempo de inactividad a medida que evoluciona su canal de distribución).</p>
<p><strong>¿Qué ocurre cuando ninguno de los documentos recuperados es relevante?</strong></p>
<p>CRAG no se rinde. Cuando la confianza cae por debajo de 0,5, vuelve a la búsqueda web. Cuando los resultados son ambiguos (0,5-0,9), combina documentos internos refinados con resultados de búsquedas externas. El modelo siempre tiene algo de contexto con el que trabajar, incluso cuando la base de conocimientos tiene lagunas.</p>
