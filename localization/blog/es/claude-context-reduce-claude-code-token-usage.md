---
id: claude-context-reduce-claude-code-token-usage.md
title: >-
  Contexto Claude: Reducir el uso de tokens de código Claude con la recuperación
  de código impulsada por Milvus
author: Cheney Zhang
date: 2026-4-30
cover: assets.zilliz.com/image_3b2d2999ac.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude Context, Claude Code token usage, code retrieval, MCP server, Milvus'
meta_title: |
  Claude Context: Cut Claude Code Token Usage with Milvus
desc: >-
  ¿Código Claude quema tokens en grep? Vea cómo Claude Context utiliza la
  recuperación híbrida respaldada por Milvus para reducir el uso de tokens en un
  39,4%.
origin: 'https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md'
---
<p>Las grandes ventanas contextuales hacen que los agentes de codificación de IA se sientan ilimitados, justo hasta que empiezan a leer la mitad de tu repositorio para responder a una pregunta. Para muchos usuarios de Claude Code, lo costoso no es sólo el razonamiento del modelo. Es el bucle de recuperación: buscar una palabra clave, leer un archivo, buscar de nuevo, leer más archivos y seguir pagando por contexto irrelevante.</p>
<p>Claude Context es un servidor MCP de recuperación de código abierto que proporciona a Claude Code y a otros agentes de codificación de IA una forma mejor de encontrar código relevante. Indexa su repositorio, almacena trozos de código en una <a href="https://zilliz.com/learn/what-is-vector-database">base de datos vectorial</a> y utiliza <a href="https://zilliz.com/blog/hybrid-search-with-milvus">la recuperación híbrida</a> para que el agente pueda extraer el código que realmente necesita en lugar de inundar la consulta con resultados de grep.</p>
<p>En nuestras pruebas comparativas, Claude Context redujo el consumo de tokens en un 39,4% de media y recortó las llamadas a herramientas en un 36,1%, preservando al mismo tiempo la calidad de la recuperación. Este artículo explica por qué la recuperación al estilo grep desperdicia contexto, cómo funciona Claude Context y cómo se compara con un flujo de trabajo de referencia en tareas de depuración reales.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_6_68b1f70723.png" alt="Claude Context GitHub repository trending and passing 10,000 stars" class="doc-image" id="claude-context-github-repository-trending-and-passing-10,000-stars" />
   </span> <span class="img-wrapper"> <span>El repositorio GitHub de Claude Context supera las 10.000 estrellas</span> </span></p>
<h2 id="Why-grep-style-code-retrieval-burns-tokens-in-AI-coding-agents" class="common-anchor-header">Por qué la recuperación de código estilo grep quema tokens en los agentes de codificación de IA<button data-href="#Why-grep-style-code-retrieval-burns-tokens-in-AI-coding-agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Un agente de codificación de IA sólo puede escribir código útil si comprende la base de código que rodea a la tarea: rutas de llamada a funciones, convenciones de nomenclatura, pruebas relacionadas, modelos de datos y patrones de implementación históricos. Una ventana de contexto grande ayuda, pero no resuelve el problema de la recuperación. Si los archivos equivocados entran en el contexto, el modelo sigue desperdiciando tokens y puede razonar a partir de código irrelevante.</p>
<p>La recuperación de código suele dividirse en dos grandes patrones:</p>
<table>
<thead>
<tr><th>Patrón de recuperación</th><th>Cómo funciona</th><th>Fallos</th></tr>
</thead>
<tbody>
<tr><td>Recuperación tipo Grep</td><td>Busca cadenas literales y, a continuación, lee los archivos o intervalos de líneas coincidentes.</td><td>Pierde código relacionado semánticamente, devuelve coincidencias ruidosas y suele requerir ciclos repetidos de búsqueda y lectura.</td></tr>
<tr><td>Recuperación tipo RAG</td><td>Indexa el código por adelantado y, a continuación, recupera los fragmentos pertinentes mediante búsquedas semánticas, léxicas o híbridas.</td><td>Requiere una lógica de fragmentación, incrustación, indexación y actualización que la mayoría de las herramientas de codificación no desean poseer directamente.</td></tr>
</tbody>
</table>
<p>Esta es la misma distinción que los desarrolladores ven en el diseño de <a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">aplicaciones RAG</a>: la correspondencia literal es útil, pero rara vez es suficiente cuando el significado importa. Una función llamada <code translate="no">compute_final_cost()</code> puede ser relevante para una consulta sobre <code translate="no">calculate_total_price()</code> aunque las palabras exactas no coincidan. Ahí es donde ayuda <a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">la búsqueda semántica</a>.</p>
<p>En una ejecución de depuración, Claude Code buscó y leyó archivos repetidamente antes de localizar el área correcta. Después de varios minutos, sólo una pequeña fracción del código que había consumido era relevante.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_4_69b8455aeb.png" alt="Claude Code grep-style search spending time on irrelevant file reads" class="doc-image" id="claude-code-grep-style-search-spending-time-on-irrelevant-file-reads" />
   </span> <span class="img-wrapper"> <span>La búsqueda de Claude Code al estilo grep pierde tiempo en lecturas de archivos irrelevantes</span> </span></p>
<p>Este patrón es lo suficientemente común como para que los desarrolladores se quejen de él públicamente: el agente puede ser inteligente, pero el bucle de recuperación de contexto sigue resultando caro e impreciso.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_8_b857ab4777.png" alt="Developer comment about Claude Code context and token usage" class="doc-image" id="developer-comment-about-claude-code-context-and-token-usage" />
   </span> <span class="img-wrapper"> <span>Comentario de un desarrollador sobre el contexto y el uso de tokens de Claude Code</span> </span></p>
<p>La recuperación al estilo Grep falla de tres formas predecibles:</p>
<ul>
<li><strong>Sobrecarga de información:</strong> los repositorios grandes producen muchas coincidencias literales, y la mayoría no son útiles para la tarea actual.</li>
<li><strong>Ceguera semántica:</strong> grep busca cadenas, no la intención, el comportamiento o patrones de implementación equivalentes.</li>
<li><strong>Pérdida de contexto:</strong> las coincidencias a nivel de línea no incluyen automáticamente la clase circundante, las dependencias, las pruebas o el gráfico de llamadas.</li>
</ul>
<p>Una mejor capa de recuperación de código debe combinar la precisión de las palabras clave con la comprensión semántica y, a continuación, devolver fragmentos suficientemente completos para que el modelo pueda razonar sobre el código.</p>
<h2 id="What-is-Claude-Context" class="common-anchor-header">¿Qué es Claude Context?<button data-href="#What-is-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Context es un servidor de <a href="https://zilliz.com/glossary/model-context-protocol-(mcp)">Protocolo de Contexto de Modelo</a> de código abierto para la recuperación de código. Conecta las herramientas de codificación de IA a un índice de código respaldado por Milvus, de modo que un agente puede buscar en un repositorio por significado en lugar de basarse únicamente en la búsqueda de texto literal.</p>
<p>El objetivo es sencillo: cuando el agente pregunta por el contexto, devuelve el menor conjunto útil de trozos de código. Claude Context lo hace analizando la base de código, generando incrustaciones, almacenando trozos en la <a href="https://zilliz.com/what-is-milvus">base de datos vectorial de Milvus</a> y exponiendo la recuperación a través de herramientas compatibles con MCP.</p>
<table>
<thead>
<tr><th>Problema Grep</th><th>Enfoque Claude Context</th></tr>
</thead>
<tbody>
<tr><td>Demasiadas coincidencias irrelevantes</td><td>Clasificación de los fragmentos de código por similitud vectorial y relevancia de las palabras clave.</td></tr>
<tr><td>Sin comprensión semántica</td><td>Utilice un <a href="https://zilliz.com/blog/voyage-ai-embeddings-and-rerankers-for-search-and-rag">modelo de incrustación</a> para que las implementaciones relacionadas puedan coincidir aunque los nombres difieran.</td></tr>
<tr><td>Falta contexto circundante</td><td>Devuelva fragmentos de código completos con suficiente estructura para que el modelo pueda razonar sobre el comportamiento.</td></tr>
<tr><td>Lecturas repetidas de archivos</td><td>Busque primero en el índice y, a continuación, lea o edite sólo los archivos importantes.</td></tr>
</tbody>
</table>
<p>Dado que Claude Context se expone a través de MCP, puede funcionar con Claude Code, Gemini CLI, hosts MCP estilo Cursor y otros entornos compatibles con MCP. La misma capa central de recuperación puede soportar múltiples interfaces de agentes.</p>
<h2 id="How-Claude-Context-works-under-the-hood" class="common-anchor-header">Cómo funciona Claude Context bajo el capó<button data-href="#How-Claude-Context-works-under-the-hood" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Context tiene dos capas principales: un módulo central reutilizable y módulos de integración. El núcleo se encarga del análisis sintáctico, la fragmentación, la indexación, la búsqueda y la sincronización incremental. La capa superior expone esas capacidades a través de integraciones con MCP y editores.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_5_cf9f17013f.png" alt="Claude Context architecture showing MCP integrations, core module, embedding provider, and vector database" class="doc-image" id="claude-context-architecture-showing-mcp-integrations,-core-module,-embedding-provider,-and-vector-database" />
   </span> <span class="img-wrapper"> <span>Arquitectura de Claude Context mostrando las integraciones MCP, el módulo central, el proveedor de incrustación y la base de datos vectorial</span> </span>.</p>
<h3 id="How-does-MCP-connect-Claude-Context-to-coding-agents" class="common-anchor-header">¿Cómo conecta MCP Claude Context a los agentes de codificación?</h3><p>MCP proporciona la interfaz entre el host LLM y las herramientas externas. Al exponer Claude Context como un servidor MCP, la capa de recuperación permanece independiente de cualquier IDE o asistente de codificación. El agente llama a una herramienta de búsqueda; Claude Context gestiona el índice de código y devuelve los trozos relevantes.</p>
<p>Si desea comprender el patrón más amplio, la <a href="https://milvus.io/docs/milvus_and_mcp.md">guía MCP + Milvus</a> muestra cómo MCP puede conectar herramientas de IA a operaciones de bases de datos vectoriales.</p>
<h3 id="Why-use-Milvus-for-code-retrieval" class="common-anchor-header">¿Por qué utilizar Milvus para la recuperación de código?</h3><p>La recuperación de código necesita una búsqueda vectorial rápida, filtrado de metadatos y escala suficiente para gestionar grandes repositorios. Milvus está diseñado para la búsqueda vectorial de alto rendimiento y es compatible con vectores densos, vectores dispersos y flujos de trabajo de reordenación. Para los equipos que construyen sistemas de agentes de recuperación pesada, los documentos de <a href="https://milvus.io/docs/multi-vector-search.md">búsqueda híbrida multivectorial</a> y la <a href="https://milvus.io/api-reference/pymilvus/v2.6.x/MilvusClient/Vector/hybrid_search.md">API PyMilvus hybrid_search</a> muestran el mismo patrón de recuperación subyacente utilizado en los sistemas de producción.</p>
<p>Claude Context puede utilizar Zilliz Cloud como backend gestionado de Milvus, lo que evita tener que ejecutar y escalar la base de datos vectorial. La misma arquitectura también puede adaptarse a despliegues Milvus autogestionados.</p>
<h3 id="Which-embedding-providers-does-Claude-Context-support" class="common-anchor-header">¿Qué proveedores de incrustación admite Claude Context?</h3><p>Claude Context admite múltiples opciones de incrustación:</p>
<table>
<thead>
<tr><th>Proveedor</th><th>Mejor ajuste</th></tr>
</thead>
<tbody>
<tr><td>Incrustaciones OpenAI</td><td>Incrustaciones alojadas de propósito general con amplio soporte del ecosistema.</td></tr>
<tr><td>Incrustaciones Voyage AI</td><td>Recuperación orientada al código, especialmente cuando la calidad de la búsqueda es importante.</td></tr>
<tr><td>Ollama</td><td>Flujos de trabajo de incrustación local para entornos sensibles a la privacidad.</td></tr>
</tbody>
</table>
<p>Para conocer los flujos de trabajo relacionados con <a href="https://zilliz.com/blog/simplifying-legal-research-with-rag-milvus-ollama">Milvus</a>, consulte la <a href="https://milvus.io/docs/embeddings.md">descripción general de la incrustación de</a> <a href="https://zilliz.com/blog/simplifying-legal-research-with-rag-milvus-ollama">Milvus</a>, la <a href="https://milvus.io/docs/embed-with-openai.md">integración de la incrustación de OpenAI</a>, <a href="https://milvus.io/docs/embed-with-voyage.md">la integración de la incrustación de Voyage</a> y ejemplos de ejecución de <a href="https://zilliz.com/blog/simplifying-legal-research-with-rag-milvus-ollama">Ollama con Milvus</a>.</p>
<h3 id="Why-is-the-core-library-written-in-TypeScript" class="common-anchor-header">¿Por qué la biblioteca central está escrita en TypeScript?</h3><p>Claude Context está escrita en TypeScript porque muchas integraciones de agentes de codificación, plugins de editores y hosts MCP ya utilizan TypeScript. Mantener el núcleo de recuperación en TypeScript hace que sea más fácil de integrar con las herramientas de la capa de aplicación sin dejar de exponer una API limpia.</p>
<p>El módulo central abstrae la base de datos vectorial y el proveedor de incrustación en un objeto componible <code translate="no">Context</code>:</p>
<pre><code translate="no" class="language-javascript"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Context</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/claude-context-core&#x27;</span>;
<span class="hljs-comment">// Initialize embedding provider</span>
<span class="hljs-keyword">const</span> embedding = <span class="hljs-keyword">new</span> <span class="hljs-title class_">OpenAIEmbedding</span>(...);
<span class="hljs-comment">// Initialize vector database</span>
<span class="hljs-keyword">const</span> vectorDatabase = <span class="hljs-keyword">new</span> <span class="hljs-title class_">MilvusVectorDatabase</span>(...);
<span class="hljs-comment">// Create context instance</span>
<span class="hljs-keyword">const</span> context = <span class="hljs-keyword">new</span> <span class="hljs-title class_">Context</span>({embedding, vectorDatabase});
<span class="hljs-comment">// Index your codebase with progress tracking</span>
<span class="hljs-keyword">const</span> stats = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">indexCodebase</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>);
<span class="hljs-comment">// Perform semantic search</span>
<span class="hljs-keyword">const</span> results = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">semanticSearch</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>, <span class="hljs-string">&#x27;vector database operations&#x27;</span>);
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-Claude-Context-chunks-code-and-keeps-indexes-fresh" class="common-anchor-header">Cómo Claude Context fragmenta el código y mantiene los índices actualizados<button data-href="#How-Claude-Context-chunks-code-and-keeps-indexes-fresh" class="anchor-icon" translate="no">
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
    </button></h2><p>La fragmentación y las actualizaciones incrementales determinan si un sistema de recuperación de código es utilizable en la práctica. Si los trozos son demasiado pequeños, el modelo pierde contexto. Si los trozos son demasiado grandes, el sistema de recuperación devuelve ruido. Si la indexación es demasiado lenta, los desarrolladores dejan de utilizarla.</p>
<p>Claude Context se encarga de ello mediante la fragmentación basada en AST, un divisor de texto alternativo y la detección de cambios basada en el árbol de Merkle.</p>
<h3 id="How-does-AST-based-code-chunking-preserve-context" class="common-anchor-header">¿Cómo conserva el contexto la fragmentación del código basada en AST?</h3><p>La estrategia principal es la fragmentación AST. En lugar de dividir los archivos por número de líneas o caracteres, Claude Context analiza la estructura del código y lo agrupa en unidades semánticas como funciones, clases y métodos.</p>
<p>Esto confiere a cada trozo tres propiedades útiles:</p>
<table>
<thead>
<tr><th>Propiedad</th><th>Importancia</th></tr>
</thead>
<tbody>
<tr><td>Completitud sintáctica</td><td>Las funciones y clases no están divididas por la mitad.</td></tr>
<tr><td>Coherencia lógica</td><td>La lógica relacionada permanece unida, por lo que los fragmentos recuperados son más fáciles de utilizar para el modelo.</td></tr>
<tr><td>Compatibilidad con varios idiomas</td><td>Los distintos analizadores sintácticos pueden trabajar con JavaScript, Python, Java, Go y otros lenguajes.</td></tr>
</tbody>
</table>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_9_153144cc04.png" alt="AST-based code chunking preserving complete syntactic units and chunking results" class="doc-image" id="ast-based-code-chunking-preserving-complete-syntactic-units-and-chunking-results" />
   </span> <span class="img-wrapper"> <span>Troceado de código basado en AST que conserva las unidades sintácticas completas y los resultados del troceado</span> </span>.</p>
<h3 id="What-happens-when-AST-parsing-fails" class="common-anchor-header">¿Qué ocurre cuando falla el análisis sintáctico AST?</h3><p>En el caso de los lenguajes o archivos que el análisis sintáctico AST no puede procesar, Claude Context recurre a LangChain <code translate="no">RecursiveCharacterTextSplitter</code>. Es menos preciso que la fragmentación AST, pero evita que la indexación falle en entradas no compatibles.</p>
<pre><code translate="no" class="language-php"><span class="hljs-comment">// Use recursive character splitting to preserve code structure</span>
<span class="hljs-keyword">const</span> splitter = <span class="hljs-title class_">RecursiveCharacterTextSplitter</span>.<span class="hljs-title function_">fromLanguage</span>(language, {
    <span class="hljs-attr">chunkSize</span>: <span class="hljs-number">1000</span>,
    <span class="hljs-attr">chunkOverlap</span>: <span class="hljs-number">200</span>,
});
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-does-Claude-Context-avoid-re-indexing-the-whole-repository" class="common-anchor-header">¿Cómo evita Claude Context la reindexación de todo el repositorio?</h3><p>Volver a indexar un repositorio entero después de cada cambio es demasiado caro. Claude Context utiliza un árbol de Merkle para detectar exactamente qué ha cambiado.</p>
<p>Un árbol de Merkle asigna un hash a cada archivo, deriva el hash de cada directorio a partir de sus hijos y agrupa todo el repositorio en un hash raíz. Si el hash raíz no cambia, Claude Context puede omitir la indexación. Si la raíz cambia, recorre el árbol para encontrar los archivos modificados y reincorpora sólo esos archivos.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_10_73daa3ca83.png" alt="Merkle tree change detection comparing unchanged and changed file hashes" class="doc-image" id="merkle-tree-change-detection-comparing-unchanged-and-changed-file-hashes" />
   </span> <span class="img-wrapper"> <span>Detección de cambios en el árbol Merkle comparando hashes de archivos modificados y no modificados</span> </span></p>
<p>Sync se ejecuta en tres etapas:</p>
<table>
<thead>
<tr><th>Etapa</th><th>Qué ocurre</th><th>Por qué es eficaz</th></tr>
</thead>
<tbody>
<tr><td>Comprobación rápida</td><td>Compara la raíz Merkle actual con la última instantánea.</td><td>Si nada ha cambiado, la comprobación finaliza rápidamente.</td></tr>
<tr><td>Diferencia precisa</td><td>Recorra el árbol para identificar los archivos añadidos, eliminados y modificados.</td><td>Sólo avanzan las rutas modificadas.</td></tr>
<tr><td>Actualización incremental</td><td>Vuelve a calcular las incrustaciones de los archivos modificados y actualiza Milvus.</td><td>El índice vectorial se mantiene fresco sin una reconstrucción completa.</td></tr>
</tbody>
</table>
<p>El estado de sincronización local se almacena en <code translate="no">~/.context/merkle/</code>, por lo que Claude Context puede restaurar la tabla hash de archivos y el árbol Merkle serializado después de un reinicio.</p>
<h2 id="What-happens-when-Claude-Code-uses-Claude-Context" class="common-anchor-header">¿Qué sucede cuando Claude Code utiliza Claude Context?<button data-href="#What-happens-when-Claude-Code-uses-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>La configuración es un único comando antes de lanzar Claude Code:</p>
<pre><code translate="no" class="language-nginx">claude mcp add claude-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>Después de indexar el repositorio, Claude Code puede llamar a Claude Context cuando necesite el contexto del código base. En el mismo escenario de búsqueda de errores que anteriormente quemaba tiempo en grep y lecturas de archivos, Claude Context encontró el archivo exacto y el número de línea con una explicación completa.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/article_12_9ad25bd75b.gif" alt="Claude Context demo showing Claude Code finding the relevant bug location" class="doc-image" id="claude-context-demo-showing-claude-code-finding-the-relevant-bug-location" />
   </span> <span class="img-wrapper"> <span>Demostración de Claude Context en la que se ve cómo Claude Code encuentra la ubicación del error en cuestión</span> </span>.</p>
<p>La herramienta no se limita a la búsqueda de errores. También ayuda con la refactorización, la detección de código duplicado, la resolución de problemas, la generación de pruebas y cualquier tarea en la que el agente necesite un contexto preciso del repositorio.</p>
<p>Con una recuperación equivalente, Claude Context redujo el consumo de tokens en un 39,4% y las llamadas a herramientas en un 36,1% en nuestra prueba. Esto es importante porque las llamadas a herramientas y las lecturas de archivos irrelevantes suelen dominar el coste de los flujos de trabajo de los agentes de codificación.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_3_e20064021b.png" alt="Benchmark chart showing Claude Context reducing token usage and tool calls versus baseline" class="doc-image" id="benchmark-chart-showing-claude-context-reducing-token-usage-and-tool-calls-versus-baseline" />
   </span> <span class="img-wrapper"> <span>Gráfico de pruebas comparativas que muestra cómo Claude Context reduce el uso de tokens y las llamadas a herramientas en comparación con la línea de base</span> </span>.</p>
<p>El proyecto cuenta ya con más de 10.000 estrellas de GitHub, y el repositorio incluye todos los detalles de la prueba y enlaces a paquetes.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_7_210af604bd.png" alt="Claude Context GitHub star history showing rapid growth" class="doc-image" id="claude-context-github-star-history-showing-rapid-growth" />
   </span> <span class="img-wrapper"> <span>El historial de estrellas de GitHub de Claude Context muestra un rápido crecimiento</span> </span></p>
<h2 id="How-does-Claude-Context-compare-with-grep-on-real-bugs" class="common-anchor-header">¿Cómo se compara Claude Context con grep en errores reales?<button data-href="#How-does-Claude-Context-compare-with-grep-on-real-bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>La prueba compara la búsqueda de texto puro con la recuperación de código respaldada por Milvus en tareas de depuración reales. La diferencia no estriba únicamente en un menor número de tokens. Claude Context cambia la ruta de búsqueda del agente: empieza más cerca de la implementación que necesita cambiar.</p>
<table>
<thead>
<tr><th>Caso</th><th>Comportamiento básico</th><th>Comportamiento de Claude Context</th><th>Reducción de tokens</th></tr>
</thead>
<tbody>
<tr><td>Error de Django <code translate="no">YearLookup</code> </td><td>Se buscó el símbolo relacionado erróneo y se editó la lógica de registro.</td><td>Encontrada la lógica de optimización <code translate="no">YearLookup</code> directamente.</td><td>93% menos tokens</td></tr>
<tr><td>Error de Xarray <code translate="no">swap_dims()</code> </td><td>Leídos archivos dispersos alrededor de menciones de <code translate="no">swap_dims</code>.</td><td>Encontrada la implementación y las pruebas relacionadas más directamente.</td><td>62% menos tokens</td></tr>
</tbody>
</table>
<h3 id="Case-1-Django-YearLookup-bug" class="common-anchor-header">Caso 1: bug Django YearLookup</h3><p><strong>Descripción del problema:</strong> En el framework Django, la optimización de consulta <code translate="no">YearLookup</code> rompe el filtrado <code translate="no">__iso_year</code>. Cuando se utiliza el filtro <code translate="no">__iso_year</code>, la clase <code translate="no">YearLookup</code> aplica incorrectamente la optimización estándar BETWEEN, válida para años naturales, pero no para años con numeración de semana ISO.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># This should use EXTRACT(&#x27;isoyear&#x27; FROM ...) but incorrectly uses BETWEEN</span>
DTModel.objects.<span class="hljs-built_in">filter</span>(start_date__iso_year=<span class="hljs-number">2020</span>)

<span class="hljs-comment"># Generated: WHERE &quot;start_date&quot; BETWEEN 2020-01-01 AND 2020-12-31</span>
<span class="hljs-comment"># Should be: WHERE EXTRACT(&#x27;isoyear&#x27; FROM &quot;start_date&quot;) = 2020</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Línea de base (grep):</strong></p>
<pre><code translate="no" class="language-swift">🔧 <span class="hljs-title function_">directory_tree</span>()
⚙️ <span class="hljs-title class_">Result</span>: <span class="hljs-title class_">Retrieved</span> <span class="hljs-number">3000</span>+ lines <span class="hljs-keyword">of</span> directory <span class="hljs-title function_">structure</span> (~50k tokens)
   <span class="hljs-title class_">Problem</span>: <span class="hljs-title class_">Massive</span> information overload, no direct relevance
🔧 <span class="hljs-title function_">search_text</span>(<span class="hljs-string">&#x27;ExtractIsoYear&#x27;</span>)
⚙️ <span class="hljs-title class_">Result</span>: <span class="hljs-title class_">Found</span> <span class="hljs-number">21</span> matches across multiple <span class="hljs-attr">files</span>:
   - django/db/models/functions/__init__.<span class="hljs-property">py</span>:<span class="hljs-number">5</span> (<span class="hljs-keyword">import</span> statement)
   - django/db/models/functions/__init__.<span class="hljs-property">py</span>:<span class="hljs-number">31</span> (<span class="hljs-keyword">export</span> list)  
   - django/db/models/functions/datetime.<span class="hljs-property">py</span>:<span class="hljs-number">93</span> (<span class="hljs-title class_">ExtractIsoYear</span> <span class="hljs-keyword">class</span>)
   <span class="hljs-title class_">Problem</span>: <span class="hljs-title class_">Most</span> are unrelated imports and registrations
🔧 <span class="hljs-title function_">edit_file</span>(<span class="hljs-string">&#x27;django/db/models/functions/datetime.py&#x27;</span>)
⚙️ <span class="hljs-title class_">Modified</span> multiple registration statements, but <span class="hljs-variable language_">this</span> is the wrong direction <span class="hljs-keyword">for</span> a fix
<button class="copy-code-btn"></button></code></pre>
<p>La búsqueda de texto se centraba en el registro <code translate="no">ExtractIsoYear</code> en lugar de en la lógica de optimización de <code translate="no">YearLookup</code>.</p>
<p><strong>Contexto Claude:</strong></p>
<pre><code translate="no" class="language-bash">🔧 search_code(<span class="hljs-string">&#x27;YearLookup&#x27;</span>)
⚙️ Found <span class="hljs-number">10</span> results <span class="hljs-keyword">for</span> query: <span class="hljs-string">&quot;YearLookup&quot;</span> across the codebase
   <span class="hljs-number">1.</span> Code <span class="hljs-title function_">snippet</span> <span class="hljs-params">(python)</span> [repo__django__django]
      Location: django/db/models/lookups.py:<span class="hljs-number">568</span>-<span class="hljs-number">577</span>
      Context: YearExact <span class="hljs-keyword">class</span> <span class="hljs-title class_">and</span> get_bound_params method
   <span class="hljs-number">2.</span> Code <span class="hljs-title function_">snippet</span> <span class="hljs-params">(python)</span> [repo__django__django]  
      Location: django/db/models/lookups.py:<span class="hljs-number">538</span>-<span class="hljs-number">569</span>
      Context: YearLookup base <span class="hljs-keyword">class</span> <span class="hljs-title class_">and</span> year_lookup_bounds method
🔧 edit_file(django/db/models/lookups.py)
⚙️ Successfully modified the core optimization logic, adding ISO year handling
<button class="copy-code-btn"></button></code></pre>
<p>La búsqueda semántica entendió <code translate="no">YearLookup</code> como el concepto central y fue directamente a la clase correcta.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_2_159ccffec9.png" alt="Django YearLookup benchmark table showing 93 percent fewer tokens with Claude Context" class="doc-image" id="django-yearlookup-benchmark-table-showing-93-percent-fewer-tokens-with-claude-context" />
   </span> <span class="img-wrapper"> <span>Tabla de referencia de Django YearLookup que muestra un 93% menos de tokens con Claude Context</span> </span></p>
<p><strong>Resultado:</strong> 93% menos de tokens.</p>
<h3 id="Case-2-Xarray-swapdims-bug" class="common-anchor-header">Caso 2: Error Xarray swap_dims</h3><p><strong>Descripción del problema:</strong> El método <code translate="no">.swap_dims()</code> de la librería Xarray muta inesperadamente el objeto original, violando la expectativa de inmutabilidad.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> xarray <span class="hljs-keyword">as</span> xr
nz = <span class="hljs-number">11</span>
ds = xr.Dataset({
    <span class="hljs-string">&quot;y&quot;</span>: (<span class="hljs-string">&quot;z&quot;</span>, np.random.rand(nz)),
    <span class="hljs-string">&quot;lev&quot;</span>: (<span class="hljs-string">&quot;z&quot;</span>, np.arange(nz) * <span class="hljs-number">10</span>),
})

<span class="hljs-comment"># This shouldn&#x27;t modify ds, but it does</span>
ds2 = ds.swap_dims(z=<span class="hljs-string">&quot;lev&quot;</span>).rename_dims(lev=<span class="hljs-string">&quot;z&quot;</span>).reset_index(<span class="hljs-string">&quot;lev&quot;</span>).reset_coords()
ds2.swap_dims(z=<span class="hljs-string">&#x27;lev&#x27;</span>)  <span class="hljs-comment"># this unexpectedly modifies ds2[&#x27;lev&#x27;]</span>
<span class="hljs-comment"># ds2[&#x27;lev&#x27;] now has dimension &#x27;lev&#x27; instead of &#x27;z&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Línea de base (grep):</strong></p>
<pre><code translate="no" class="language-bash">🔧 list_directory(<span class="hljs-string">&#x27;repo__pydata__xarray&#x27;</span>)
⚙️ Result: Retrieved directory structure across multiple subdirectories
   Problem: Basic directory navigation, no targeted search
🔧 search_text(<span class="hljs-string">&#x27;swap_dims&#x27;</span>)
⚙️ Result: Found 21 matches across core files:
   - xarray/core/common.py:600 (Dataset.swap_dims reference)
   - xarray/core/dataarray.py:753 (<span class="hljs-string">&quot;.rename() or .swap_dims() instead.&quot;</span>)
   - xarray/core/dataarray.py:2026 (DataArray.swap_dims reference)
   - xarray/core/dataarray.py:2044 (def swap_dims method)
   Problem: Many matches scattered across different contexts
🔧 read_file(<span class="hljs-string">&#x27;xarray/core/dataarray.py&#x27;</span>, offset=2000, <span class="hljs-built_in">limit</span>=40)
⚙️ Result: Read lines 2001-2040 showing rename method documentation

🔧 read_file(<span class="hljs-string">&#x27;xarray/core/dataset.py&#x27;</span>, offset=3600, <span class="hljs-built_in">limit</span>=40) 
⚙️ Result: Read lines 3601-3640 showing rename_dims method
<button class="copy-code-btn"></button></code></pre>
<p>La línea de base pasó tiempo navegando por directorios y leyendo código cercano antes de localizar la ruta de implementación real.</p>
<p><strong>Claude Context:</strong></p>
<pre><code translate="no" class="language-bash">🔧 search_code(<span class="hljs-string">&#x27;.swap_dims()&#x27;</span>)
⚙️ Found <span class="hljs-number">10</span> results <span class="hljs-keyword">for</span> query: <span class="hljs-string">&quot;.swap_dims()&quot;</span> across the codebase
   <span class="hljs-number">1.</span> <span class="hljs-function">Code <span class="hljs-title">snippet</span> (<span class="hljs-params">python</span>) [repo__pydata__xarray]
      Location: xarray/tests/test_formatting_html.py:67-76
   2. Code <span class="hljs-title">snippet</span> (<span class="hljs-params">python</span>) [repo__pydata__xarray]
      Location: xarray/tests/test_dataset.py:2926-2979
🔧 <span class="hljs-title">edit_file</span>(<span class="hljs-params"><span class="hljs-string">&#x27;xarray/core/dataset.py&#x27;</span></span>)
⚙️ Successfully modified the <span class="hljs-keyword">file</span>, added dimension handling logic
🔧 <span class="hljs-title">edit_file</span>(<span class="hljs-params"><span class="hljs-string">&#x27;xarray/core/dataarray.py&#x27;</span></span>)
⚙️ Successfully modified the <span class="hljs-keyword">file</span>, ensuring the original DataArray <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> mutated
</span><button class="copy-code-btn"></button></code></pre>
<p>La búsqueda semántica localizó más rápidamente la implementación relevante de <code translate="no">swap_dims()</code> y el contexto relacionado.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_1_d75e931f20.png" alt="Xarray swap_dims benchmark table showing 62 percent fewer tokens with Claude Context" class="doc-image" id="xarray-swap_dims-benchmark-table-showing-62-percent-fewer-tokens-with-claude-context" />
   </span> <span class="img-wrapper"> <span>Tabla de referencia Xarray swap_dims que muestra un 62% menos de tokens con Claude Context</span> </span></p>
<p><strong>Resultado:</strong> un 62% menos de tokens.</p>
<h2 id="Get-started-with-Claude-Context" class="common-anchor-header">Introducción a Claude Context<button data-href="#Get-started-with-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Si quieres probar la herramienta exacta de este post, empieza con el <a href="https://github.com/zilliztech/claude-context">repositorio GitHub</a> de <a href="https://github.com/zilliztech/claude-context">Claude Context</a> y el <a href="https://www.npmjs.com/package/%40zilliz/claude-context-mcp">paquete MCP de Claude Context</a>. El repositorio incluye instrucciones de configuración, puntos de referencia y los paquetes principales de TypeScript.</p>
<p>Si quieres entender o personalizar la capa de recuperación, estos recursos son pasos útiles:</p>
<ul>
<li>Aprenda los fundamentos de la base de datos vectorial con el <a href="https://milvus.io/docs/quickstart.md">Milvus Quickstart</a>.</li>
<li>Explore <a href="https://milvus.io/docs/full-text-search.md">la búsqueda de texto completo de Milvus</a> y el <a href="https://milvus.io/docs/full_text_search_with_milvus.md">tutorial de búsqueda de texto completo de LangChain</a> si desea combinar la búsqueda estilo BM25 con vectores densos.</li>
<li>Revise <a href="https://zilliz.com/blog/top-5-open-source-vector-search-engines">los motores de búsqueda vectorial de código abierto</a> si está comparando opciones de infraestructura.</li>
<li>Pruebe <a href="https://zilliz.com/blog/zilliz-cloud-just-landed-in-claude-code">Zilliz Cloud Plugin para Claude</a> Code si desea realizar operaciones con bases de datos vectoriales directamente dentro del flujo de trabajo de Claude Code.</li>
</ul>
<p>Si necesita ayuda con Milvus o con la arquitectura de recuperación de código, únase a la <a href="https://milvus.io/community/">comunidad Milvus</a> o reserve <a href="https://milvus.io/office-hours">Milvus Office Hours</a> para recibir orientación personalizada. Si prefiere omitir la configuración de la infraestructura, <a href="https://cloud.zilliz.com/signup">regístrese en Zilliz</a> <a href="https://cloud.zilliz.com/login">Cloud</a> o <a href="https://cloud.zilliz.com/login">inicie sesión en Zilliz Cloud</a> y utilice Milvus gestionado como backend.</p>
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
    </button></h2><h3 id="Why-does-Claude-Code-use-so-many-tokens-on-some-coding-tasks" class="common-anchor-header">¿Por qué Claude Code utiliza tantos tokens en algunas tareas de codificación?</h3><p>Claude Code puede utilizar muchos tokens cuando una tarea requiere repetidos bucles de búsqueda y lectura de archivos en un repositorio grande. Si el agente busca por palabra clave, lee archivos irrelevantes, y luego busca de nuevo, cada archivo leído añade tokens incluso cuando el código no es útil para la tarea.</p>
<h3 id="How-does-Claude-Context-reduce-Claude-Code-token-usage" class="common-anchor-header">¿Cómo reduce Claude Context el uso de tokens del Código Claude?</h3><p>Claude Context reduce el uso de tokens buscando en un índice de código respaldado por Milvus antes de que el agente lea los archivos. Recupera fragmentos de código relevantes con una búsqueda híbrida, de modo que Claude Code puede inspeccionar menos archivos y dedicar más tiempo de su ventana de contexto al código que realmente importa.</p>
<h3 id="Is-Claude-Context-only-for-Claude-Code" class="common-anchor-header">¿Claude Context es sólo para Claude Code?</h3><p>No. Claude Context está expuesto como un servidor MCP, por lo que puede funcionar con cualquier herramienta de codificación que soporte MCP. Claude Code es el ejemplo principal en este post, pero la misma capa de recuperación puede soportar otros IDEs compatibles con MCP y flujos de trabajo de agentes.</p>
<h3 id="Do-I-need-Zilliz-Cloud-to-use-Claude-Context" class="common-anchor-header">¿Necesito Zilliz Cloud para usar Claude Context?</h3><p>Claude Context puede utilizar Zilliz Cloud como un backend Milvus gestionado, que es el camino más fácil si no desea operar una infraestructura de base de datos de vectores. La misma arquitectura de recuperación se basa en conceptos Milvus, por lo que los equipos también pueden adaptarla a despliegues Milvus autogestionados.</p>
