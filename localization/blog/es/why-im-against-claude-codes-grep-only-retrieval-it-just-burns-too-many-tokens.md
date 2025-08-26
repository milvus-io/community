---
id: >-
  why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md
title: >-
  ¿Por qué estoy en contra de la recuperación Grep de Claude Code? Quema
  demasiados tokens
author: Cheney Zhang
date: 2025-08-25T00:00:00.000Z
desc: >-
  Descubra cómo la recuperación de código basada en vectores reduce el consumo
  de Claude Code token en un 40%. Solución de código abierto con fácil
  integración MCP. Pruebe claude-context hoy mismo.
cover: >-
  assets.zilliz.com/why_im_against_claude_codes_grep_only_retrieval_it_just_burns_too_many_tokens_milvus_cover_2928b4b72d.png
tag: Engineering
recommend: false
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Claude Code, vector search, AI IDE, code retrieval, token optimization'
meta_title: >
  Why I’m Against Claude Code’s Grep-Only Retrieval? It Just Burns Too Many
  Tokens
origin: >
  https://milvus.io/blog/why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md
---
<p>Los asistentes de programación con inteligencia artificial están en auge. En los dos últimos años, herramientas como Cursor, Claude Code, Gemini CLI y Qwen Code han pasado de ser curiosidades a compañeros cotidianos de millones de desarrolladores. Pero detrás de este rápido ascenso se esconde una lucha en ciernes sobre algo aparentemente simple: <strong>¿cómo debería un asistente de codificación de IA buscar realmente el contexto en tu base de código?</strong></p>
<p>En la actualidad, existen dos enfoques:</p>
<ul>
<li><p><strong>Búsqueda vectorial con RAG</strong> (recuperación semántica).</p></li>
<li><p><strong>Búsqueda por palabras clave con grep</strong> (búsqueda literal de cadenas).</p></li>
</ul>
<p>Claude Code y Gemini han optado por esta última. De hecho, un ingeniero de Claude admitió abiertamente en Hacker News que Claude Code no utiliza RAG en absoluto. En lugar de eso, simplemente saluda tu repositorio línea por línea (lo que ellos llaman "búsqueda agéntica") -sin semántica, sin estructura, sólo coincidencia de cadenas sin procesar.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_2b03e89759.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Esta revelación dividió a la comunidad:</p>
<ul>
<li><p><strong>Los partidarios</strong> defienden la simplicidad de grep. Es rápido, exacto y, lo más importante, predecible. En programación, argumentan, la precisión lo es todo, y las incrustaciones actuales siguen siendo demasiado confusas para confiar en ellas.</p></li>
<li><p><strong>Los críticos</strong> consideran que grep es un callejón sin salida. Te ahoga en coincidencias irrelevantes, quema tokens y estanca tu flujo de trabajo. Sin comprensión semántica, es como pedirle a tu IA que depure con los ojos vendados.</p></li>
</ul>
<p>Ambas partes tienen razón. Y después de construir y probar mi propia solución, puedo decir lo siguiente: el enfoque RAG basado en la búsqueda vectorial cambia las reglas del juego. <strong>No sólo hace que la búsqueda sea mucho más rápida y precisa, sino que también reduce el uso de tokens en un 40% o más. (Salta a la parte de Claude Context para ver mi enfoque)</strong></p>
<p>Entonces, ¿por qué grep es tan limitante? ¿Y cómo puede la búsqueda vectorial ofrecer mejores resultados en la práctica? Desglosémoslo.</p>
<h2 id="What’s-Wrong-with-Claude-Code’s-Grep-Only-Code-Search" class="common-anchor-header">¿Qué es lo que falla en la búsqueda de código sólo grep de Claude Code?<button data-href="#What’s-Wrong-with-Claude-Code’s-Grep-Only-Code-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Me encontré con este problema mientras depuraba un asunto espinoso. Claude Code disparó consultas grep a través de mi repositorio, volcando grandes cantidades de texto irrelevante hacia mí. Un minuto después, todavía no había encontrado el archivo relevante. Cinco minutos más tarde, por fin tenía las 10 líneas correctas, pero estaban enterradas en 500 líneas de ruido.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_299eeeaea5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>No es un caso excepcional. Si echamos un vistazo a los problemas de Claude Code en GitHub, veremos que muchos desarrolladores frustrados se han topado con el mismo obstáculo:</p>
<ul>
<li><p>issue1:<a href="https://github.com/anthropics/claude-code/issues/1315"> https://github.com/anthropics/claude-code/issues/1315</a></p></li>
<li><p>issue2:<a href="https://github.com/anthropics/claude-code/issues/4556"> https://github.com/anthropics/claude-code/issues/4556</a></p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_938c7244da.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La frustración de la comunidad se reduce a tres puntos dolorosos:</p>
<ol>
<li><p><strong>Token bloat.</strong> Cada volcado de grep introduce enormes cantidades de código irrelevante en el LLM, lo que aumenta los costes de forma terrible con el tamaño del repositorio.</p></li>
<li><p><strong>Impuesto sobre el tiempo.</strong> Estás atrapado esperando mientras la IA juega a las veinte preguntas con tu código base, matando la concentración y el flujo.</p></li>
<li><p><strong>Cero contexto.</strong> Grep compara cadenas literales. No tiene sentido del significado o de las relaciones, por lo que estás buscando a ciegas.</p></li>
</ol>
<p>Por eso el debate es importante: grep no es sólo "de la vieja escuela", sino que está frenando activamente la programación asistida por IA.</p>
<h2 id="Claude-Code-vs-Cursor-Why-the-Latter-Has-Better-Code-Context" class="common-anchor-header">Claude Code vs Cursor: Por qué el último tiene mejor contexto de código<button data-href="#Claude-Code-vs-Cursor-Why-the-Latter-Has-Better-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Cuando se trata de contexto de código, Cursor ha hecho un mejor trabajo. Desde el primer día, Cursor se ha inclinado en la <strong>indexación de código base</strong>: romper su repo en trozos significativos, incrustar esos trozos en vectores, y recuperarlos semánticamente cada vez que la IA necesita contexto. Esto es lo que se conoce como Retrieval-Augmented Generation (RAG) aplicado al código, y los resultados hablan por sí solos: contexto más ajustado, menos tokens desperdiciados y recuperación más rápida.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_a9f5beb01d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Claude Code, en cambio, ha apostado por la simplicidad. Sin índices ni incrustaciones, sólo grep. Eso significa que cada búsqueda es una coincidencia literal de cadenas, sin comprensión de la estructura o la semántica. En teoría es rápido, pero en la práctica, los desarrolladores acaban rebuscando entre pajares de coincidencias irrelevantes antes de encontrar la aguja que realmente necesitan.</p>
<table>
<thead>
<tr><th></th><th><strong>Código Claude</strong></th><th><strong>Cursor</strong></th></tr>
</thead>
<tbody>
<tr><td>Precisión de la búsqueda</td><td>Sólo encuentra coincidencias exactas; no encuentra nada que tenga un nombre diferente.</td><td>Encuentra código semánticamente relevante incluso cuando las palabras clave no coinciden exactamente.</td></tr>
<tr><td>Eficacia</td><td>Grep vierte grandes cantidades de código en el modelo, lo que aumenta el coste de los tokens.</td><td>Los fragmentos más pequeños y de mayor señal reducen la carga de tokens en un 30-40%.</td></tr>
<tr><td>Escalabilidad</td><td>Vuelve a generar el repositorio cada vez, lo que ralentiza el crecimiento de los proyectos.</td><td>Indexa una vez y luego recupera a escala con un retraso mínimo.</td></tr>
<tr><td>Filosofía</td><td>Mantener el mínimo, sin infraestructura adicional.</td><td>Indexa todo, recupera de forma inteligente.</td></tr>
</tbody>
</table>
<p>Entonces, ¿por qué Claude (o Géminis, o Cline) no ha seguido el ejemplo de Cursor? Las razones son en parte técnicas y en parte culturales. <strong>La recuperación vectorial no es trivial: hay que resolver la fragmentación, las actualizaciones incrementales y la indexación a gran escala.</strong> Pero lo más importante es que Claude Code se basa en el minimalismo: sin servidores, sin índices, sólo una CLI limpia. Las incrustaciones y las bases de datos vectoriales no encajan en esa filosofía de diseño.</p>
<p>Esa simplicidad es atractiva, pero también limita el techo de lo que Claude Code puede ofrecer. La voluntad de Cursor de invertir en una verdadera infraestructura de indexación es la razón por la que se siente más poderoso hoy.</p>
<h2 id="Claude-Context-an-Open-Source-Project-for-Adding-Semantic-Code-Search-to-Claude-Code" class="common-anchor-header">Claude Context: un proyecto de código abierto para añadir la búsqueda semántica de código a Claude Code<button data-href="#Claude-Context-an-Open-Source-Project-for-Adding-Semantic-Code-Search-to-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code es una herramienta fuerte, pero tiene un contexto de código pobre. Cursor resolvió esto con la indexación de código base, pero Cursor es de código cerrado, bloqueado detrás de las suscripciones, y caro para los individuos o equipos pequeños.</p>
<p>Esa es la razón por la que empezamos a construir nuestra propia solución de código abierto: <a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a>.</p>
<p>Claude<a href="https://github.com/zilliztech/claude-context"><strong>Context</strong></a> es un plugin MCP de código abierto que aporta <strong>búsqueda semántica de código</strong> a Claude Code (y a cualquier otro agente de codificación AI que hable MCP). En lugar de forzar bruscamente su repositorio con grep, integra bases de datos vectoriales con modelos de incrustación para proporcionar a los LLM <em>un contexto profundo y específico</em> de toda su base de código. El resultado: una recuperación más nítida, menos desperdicio de tokens y una experiencia mucho mejor para el desarrollador.</p>
<p>He aquí cómo lo hemos creado:</p>
<h3 id="Technologies-We-Use" class="common-anchor-header">Tecnologías que utilizamos</h3><p><strong>🔌 Capa de interfaz: MCP como conector universal</strong></p>
<p>Queríamos que esto funcionara en todas partes, no solo en Claude. MCP (Model Context Protocol) actúa como el estándar USB para LLMs, permitiendo a las herramientas externas conectarse sin problemas. Al empaquetar Claude Context como un servidor MCP, funciona no sólo con Claude Code sino también con Gemini CLI, Qwen Code, Cline e incluso Cursor.</p>
<p><strong>🗄️ Base de datos vectorial: Zilliz Cloud</strong></p>
<p>Para la columna vertebral, elegimos <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (un servicio totalmente gestionado basado en <a href="https://milvus.io/">Milvus</a>). Es de alto rendimiento, nativo de la nube, elástico y diseñado para cargas de trabajo de IA como la indexación de bases de código. Eso significa recuperación de baja latencia, escala casi infinita y fiabilidad sólida como una roca.</p>
<p><strong>🧩 Modelos de incrustación: Flexible por diseñoDiferentes</strong>equipos tienen diferentes necesidades, por lo que Claude Context soporta múltiples proveedores de incrustación fuera de la caja:</p>
<ul>
<li><p><strong>OpenAI embeddings</strong> para estabilidad y amplia adopción.</p></li>
<li><p><strong>Voyage</strong> para un rendimiento especializado en código.</p></li>
<li><p><strong>Ollama</strong> para despliegues locales que priman la privacidad.</p></li>
</ul>
<p>Se pueden incorporar modelos adicionales a medida que evolucionen los requisitos.</p>
<p><strong>Elección de lenguaje: TypeScript</strong></p>
<p>Debatimos entre Python y TypeScript. TypeScript ganó, no solo por la compatibilidad a nivel de aplicación (plugins de VSCode, herramientas web), sino también porque Claude Code y Gemini CLI están basados en TypeScript. Esto facilita la integración y mantiene la coherencia del ecosistema.</p>
<h3 id="System-Architecture" class="common-anchor-header">Arquitectura del sistema</h3><p>Claude Context sigue un diseño limpio y por capas:</p>
<ul>
<li><p><strong>Los módulos centrales</strong> se encargan del trabajo pesado: análisis sintáctico del código, fragmentación, indexación, recuperación y sincronización.</p></li>
<li><p><strong>La interfaz de usuario</strong> se encarga de las integraciones: servidores MCP, complementos VSCode u otros adaptadores.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_0c70864d6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Esta separación mantiene el motor central reutilizable en diferentes entornos, al tiempo que permite que las integraciones evolucionen rápidamente a medida que surgen nuevos asistentes de codificación de IA.</p>
<h3 id="Core-Module-Implementation" class="common-anchor-header">Implementación del módulo central</h3><p>Los módulos centrales constituyen la base de todo el sistema. Abstraen las bases de datos vectoriales, los modelos de incrustación y otros componentes en módulos componibles que crean un objeto Context, permitiendo diferentes bases de datos vectoriales y modelos de incrustación para diferentes escenarios.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Context</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/claude-context-core&#x27;</span>;
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
<h2 id="Solving-Key-Technical-Challenges" class="common-anchor-header">Resolver los principales retos técnicos<button data-href="#Solving-Key-Technical-Challenges" class="anchor-icon" translate="no">
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
    </button></h2><p>Construir Claude Context no consistió únicamente en conectar bases de datos vectoriales e incrustaciones. El verdadero trabajo consistió en resolver los problemas difíciles que hacen o deshacen la indexación de código a escala. He aquí cómo abordamos los tres retos más importantes:</p>
<h3 id="Challenge-1-Intelligent-Code-Chunking" class="common-anchor-header">Desafío 1: fragmentación inteligente del código</h3><p>El código no puede dividirse simplemente por líneas o caracteres. Esto crea fragmentos desordenados e incompletos y elimina la lógica que hace que el código sea comprensible.</p>
<p>Lo resolvimos con <strong>dos estrategias complementarias</strong>:</p>
<h4 id="AST-Based-Chunking-Primary-Strategy" class="common-anchor-header">Troceado basado en AST (estrategia principal)</h4><p>Este es el enfoque predeterminado, que utiliza analizadores sintácticos de árbol para comprender la estructura sintáctica del código y dividirlo a lo largo de los límites semánticos: funciones, clases, métodos. De este modo se consigue</p>
<ul>
<li><p><strong>Completitud sintáctica</strong>: no hay funciones entrecortadas ni declaraciones rotas.</p></li>
<li><p><strong>Coherencia lógica</strong>: la lógica relacionada permanece unida para una mejor recuperación semántica.</p></li>
<li><p><strong>Soporte multi-idioma</strong> - funciona en JS, Python, Java, Go, y más a través de gramáticas tree-sitter.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_e976593d7e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="LangChain-Text-Splitting-Fallback-Strategy" class="common-anchor-header">División de texto LangChain (estrategia alternativa)</h4><p>Para los idiomas que AST no puede analizar o cuando falla el análisis sintáctico, <code translate="no">RecursiveCharacterTextSplitter</code> de LangChain proporciona una copia de seguridad fiable.</p>
<pre><code translate="no"><span class="hljs-comment">// Use recursive character splitting to maintain code structure</span>
<span class="hljs-keyword">const</span> splitter = <span class="hljs-title class_">RecursiveCharacterTextSplitter</span>.<span class="hljs-title function_">fromLanguage</span>(language, { 
  <span class="hljs-attr">chunkSize</span>: <span class="hljs-number">1000</span>, 
  <span class="hljs-attr">chunkOverlap</span>: <span class="hljs-number">200</span>,
});
<button class="copy-code-btn"></button></code></pre>
<p>Es menos "inteligente" que AST, pero muy fiable, lo que garantiza que los desarrolladores nunca se queden tirados. Juntas, estas dos estrategias equilibran la riqueza semántica con la aplicabilidad universal.</p>
<h3 id="Challenge-2-Handling-Code-Changes-Efficiently" class="common-anchor-header">Reto 2: Gestión eficaz de los cambios de código</h3><p>La gestión de los cambios en el código representa uno de los mayores retos de los sistemas de indexación de código. Volver a indexar proyectos enteros por pequeñas modificaciones en los archivos sería totalmente inviable.</p>
<p>Para resolver este problema, hemos creado un mecanismo de sincronización basado en Merkle Trees.</p>
<h4 id="Merkle-Trees-The-Foundation-of-Change-Detection" class="common-anchor-header">Árboles Merkle: La base de la detección de cambios</h4><p>Los árboles Merkle crean un sistema jerárquico de "huellas dactilares" en el que cada archivo tiene su propia huella dactilar hash, las carpetas tienen huellas dactilares basadas en su contenido y todo culmina en una huella dactilar única del nodo raíz para todo el código base.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_79adb21c84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Cuando cambia el contenido de un archivo, las huellas digitales hash suben en cascada por cada capa hasta el nodo raíz. Esto permite una rápida detección de los cambios comparando las huellas hash capa por capa desde la raíz hacia abajo, identificando y localizando rápidamente las modificaciones de los archivos sin necesidad de reindexar todo el proyecto.</p>
<p>El sistema realiza comprobaciones de sincronización de handshake cada 5 minutos mediante un proceso simplificado de tres fases:</p>
<p><strong>Fase 1: La detección ultrarrápida</strong> calcula el hash Merkle de la raíz de todo el código base y lo compara con la instantánea anterior. Un hash raíz idéntico significa que no se han producido cambios: el sistema omite todo el procesamiento en milisegundos.</p>
<p><strong>Fase 2: Comparación</strong> precisa se activa cuando los hash raíz difieren, realizando un análisis detallado a nivel de archivo para identificar exactamente qué archivos se han añadido, eliminado o modificado.</p>
<p><strong>Fase 3: Actualizaciones incrementales</strong> recalcula los vectores sólo para los archivos modificados y actualiza la base de datos de vectores en consecuencia, maximizando la eficiencia.</p>
<h4 id="Local-Snapshot-Management" class="common-anchor-header">Gestión local de instantáneas</h4><p>Todo el estado de sincronización persiste localmente en el directorio <code translate="no">~/.context/merkle/</code> del usuario. Cada base de código mantiene su propio archivo de instantáneas independiente que contiene tablas hash de archivos y datos serializados del árbol Merkle, lo que garantiza una recuperación precisa del estado incluso después de reiniciar el programa.</p>
<p>Este diseño ofrece ventajas evidentes: la mayoría de las comprobaciones se completan en milisegundos cuando no hay cambios, sólo los archivos realmente modificados activan el reprocesamiento (evitando un enorme gasto computacional) y la recuperación del estado funciona sin problemas en todas las sesiones del programa.</p>
<p>Desde el punto de vista de la experiencia del usuario, la modificación de una única función activa la reindexación sólo para ese archivo, no para todo el proyecto, lo que mejora drásticamente la eficacia del desarrollo.</p>
<h3 id="Challenge-3-Designing-the-MCP-Interface" class="common-anchor-header">Reto 3: Diseño de la interfaz MCP</h3><p>Incluso el motor de indexación más inteligente es inútil sin una interfaz limpia para el desarrollador. MCP fue la elección obvia, pero introdujo desafíos únicos:</p>
<h4 id="🔹-Tool-Design-Keep-It-Simple" class="common-anchor-header"><strong>🔹 Diseño de la herramienta: Simplicidad</strong></h4><p>El módulo MCP sirve como interfaz de usuario, por lo que la experiencia del usuario es la máxima prioridad.</p>
<p>El diseño de la herramienta comienza con la abstracción de las operaciones estándar de indexación y búsqueda de bases de código en dos herramientas principales: <code translate="no">index_codebase</code> para indexar bases de código y <code translate="no">search_code</code> para buscar código.</p>
<p>Esto plantea una cuestión importante: ¿qué herramientas adicionales son necesarias?</p>
<p>El número de herramientas requiere un cuidadoso equilibrio: demasiadas herramientas crean una sobrecarga cognitiva y confunden la selección de herramientas LLM, mientras que muy pocas podrían omitir funcionalidades esenciales.</p>
<p>Trabajar a partir de casos de uso reales ayuda a responder a esta pregunta.</p>
<h4 id="Addressing-Background-Processing-Challenges" class="common-anchor-header">Afrontar los retos del procesamiento en segundo plano</h4><p>La indexación de grandes bases de código puede llevar un tiempo considerable. El planteamiento ingenuo de esperar a que se complete de forma sincrónica obliga a los usuarios a esperar varios minutos, lo cual es sencillamente inaceptable. El procesamiento asíncrono en segundo plano resulta esencial, pero MCP no admite este patrón de forma nativa.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_e1f0aa290f.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>Nuestro servidor MCP ejecuta un proceso en segundo plano dentro del servidor MCP para gestionar la indexación mientras devuelve inmediatamente mensajes de inicio a los usuarios, permitiéndoles seguir trabajando.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_1cb37d15f3.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>Esto plantea un nuevo reto: ¿cómo pueden los usuarios seguir el progreso de la indexación?</p>
<p>Una herramienta específica para consultar el progreso o el estado de la indexación lo resuelve con elegancia. El proceso de indexación en segundo plano almacena en caché de forma asíncrona la información sobre el progreso, lo que permite a los usuarios comprobar los porcentajes de finalización, el estado de éxito o las condiciones de fallo en cualquier momento. Además, una herramienta de borrado manual de índices gestiona las situaciones en las que los usuarios necesitan restablecer índices imprecisos o reiniciar el proceso de indexación.</p>
<p><strong>Diseño final de la herramienta:</strong></p>
<p><code translate="no">index_codebase</code> - Index codebase<code translate="no">search_code</code> - Search code<code translate="no">get_indexing_status</code> - Query indexing status<code translate="no">clear_index</code> - Clear index</p>
<p>Cuatro herramientas que logran el equilibrio perfecto entre sencillez y funcionalidad.</p>
<h4 id="🔹-Environment-Variable-Management" class="common-anchor-header">🔹 Gestión de variables de entorno</h4><p>La gestión de variables de entorno a menudo se pasa por alto a pesar de tener un impacto significativo en la experiencia del usuario. Requerir una configuración de clave API separada para cada Cliente MCP obligaría a los usuarios a configurar las credenciales varias veces al cambiar entre Claude Code y Gemini CLI.</p>
<p>Un enfoque de configuración global elimina esta fricción mediante la creación de un archivo <code translate="no">~/.context/.env</code> en el directorio principal del usuario:</p>
<pre><code translate="no"><span class="hljs-comment"># ~/.context/.env</span>
OPENAI_API_KEY=your-api-key-here
MILVUS_TOKEN=your-milvus-token
<button class="copy-code-btn"></button></code></pre>
<p><strong>Este enfoque ofrece claras ventajas:</strong> los usuarios configuran una vez y la utilizan en todas partes a través de todos los clientes MCP, todas las configuraciones se centralizan en una única ubicación para facilitar el mantenimiento y las claves API sensibles no se dispersan a través de múltiples archivos de configuración.</p>
<p>También implementamos una jerarquía de prioridades de tres niveles: las variables de entorno del proceso tienen la máxima prioridad, los archivos de configuración global tienen una prioridad media y los valores por defecto sirven como fallbacks.</p>
<p>Este diseño ofrece una enorme flexibilidad: los desarrolladores pueden utilizar variables de entorno para anulaciones de pruebas temporales, los entornos de producción pueden inyectar configuraciones sensibles a través de variables de entorno del sistema para mejorar la seguridad, y los usuarios configuran una vez para trabajar sin problemas a través de Claude Code, Gemini CLI y otras herramientas.</p>
<p>En este punto, la arquitectura central del servidor MCP está completa, abarcando desde el análisis sintáctico de código y el almacenamiento de vectores hasta la recuperación inteligente y la gestión de configuraciones. Cada componente ha sido cuidadosamente diseñado y optimizado para crear un sistema potente y fácil de usar.</p>
<h2 id="Hands-on-Testing" class="common-anchor-header">Pruebas prácticas<button data-href="#Hands-on-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p>¿Cómo funciona Claude Context en la práctica? Lo probé exactamente en el mismo escenario de búsqueda de errores que inicialmente me dejó frustrado.</p>
<p>La instalación fue sólo un comando antes de lanzar Claude Code:</p>
<pre><code translate="no">claude mcp add claude-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>Una vez indexado mi código base, le di a Claude Code la misma descripción de error que le había llevado a una <strong>búsqueda inútil de cinco minutos con grep</strong>. Esta vez, a través de las llamadas a <code translate="no">claude-context</code> MCP, <strong>localizó inmediatamente el archivo exacto y el número de línea</strong>, junto con una explicación del problema.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_gif_e04d07cd00.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La diferencia no era sutil: era como el día y la noche.</p>
<p>Y no se trataba sólo de buscar errores. Con Claude Context integrado, Claude Code produjo sistemáticamente resultados de mayor calidad:</p>
<ul>
<li><p><strong>Resolución de problemas</strong></p></li>
<li><p><strong>Refactorización de código</strong></p></li>
<li><p><strong>Detección de código duplicado</strong></p></li>
<li><p><strong>Pruebas exhaustivas</strong></p></li>
</ul>
<p>La mejora del rendimiento también se refleja en las cifras. En las pruebas comparativas:</p>
<ul>
<li><p>El uso de tokens se redujo en más de un 40%, sin pérdida de memoria.</p></li>
<li><p>Esto se traduce directamente en menores costes de API y respuestas más rápidas.</p></li>
<li><p>Por otra parte, con el mismo presupuesto, Claude Context proporcionó recuperaciones mucho más precisas.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_2659dd3429.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Hemos puesto Claude Context en código abierto en GitHub, y ya ha obtenido más de 2.600 estrellas. Gracias a todos por vuestro apoyo y vuestros "me gusta".</p>
<p>Puedes probarlo tú mismo:</p>
<ul>
<li><p>GitHub:<a href="https://github.com/zilliztech/claude-context"> github.com/zilliztech/claude-context</a></p></li>
<li><p>npm:<a href="https://www.npmjs.com/package/@zilliz/claude-context-mcp"> @zilliz/claude-context-mcp</a></p></li>
</ul>
<p>Los puntos de referencia detallados y la metodología de prueba están disponibles en el repositorio; nos encantaría recibir sus comentarios.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_88bf595b15.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Looking-Forward" class="common-anchor-header">De cara al futuro<button data-href="#Looking-Forward" class="anchor-icon" translate="no">
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
    </button></h2><p>Lo que comenzó como una frustración con grep en Claude Code se ha convertido en una solución sólida: <a href="https://github.com/zilliztech/claude-context"><strong>Claude Context, un</strong></a>complemento MCP de código abierto que aporta búsqueda semántica y vectorial a Claude Code y otros asistentes de codificación. El mensaje es sencillo: los desarrolladores no tienen por qué conformarse con herramientas de IA ineficaces. Con RAG y la recuperación vectorial, puede depurar más rápido, reducir los costes de token en un 40% y, por fin, obtener asistencia de IA que realmente entienda su código base.</p>
<p>Y esto no se limita a Claude Code. Dado que Claude Context se basa en estándares abiertos, el mismo enfoque funciona a la perfección con Gemini CLI, Qwen Code, Cursor, Cline y otros. Se acabaron los compromisos entre proveedores que priorizan la simplicidad sobre el rendimiento.</p>
<p>Nos encantaría que formaras parte de ese futuro:</p>
<ul>
<li><p><strong>Prueba</strong> <a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a><strong>:</strong> es de código abierto y totalmente gratuito<strong>.</strong> </p></li>
<li><p><strong>Contribuya a su desarrollo</strong></p></li>
<li><p><strong>O construye tu propia solución</strong> utilizando Claude Context</p></li>
</ul>
<p>👉 Comparte tus comentarios, haz preguntas u obtén ayuda uniéndote a nuestra <a href="https://discord.com/invite/8uyFbECzPX"><strong>comunidad de Discord</strong></a>.</p>
