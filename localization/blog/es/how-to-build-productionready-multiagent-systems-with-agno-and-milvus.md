---
id: how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md
title: Cómo crear sistemas multiagente listos para la producción con Agno y Milvus
author: Min Yin
date: 2026-02-10T00:00:00.000Z
cover: assets.zilliz.com/cover_b5fc8a3c48.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  production-ready multi-agent systems, Agno framework, Milvus vector database,
  AgentOS deployment, LLM agent architecture
meta_title: |
  How to Build Production-Ready Multi-Agent Systems with Agno and Milvus
desc: >-
  Aprenda a construir, desplegar y escalar sistemas multiagente listos para
  producción utilizando Agno, AgentOS y Milvus para cargas de trabajo del mundo
  real.
origin: >-
  https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md
---
<p>Si has estado construyendo agentes de IA, probablemente te hayas topado con este muro: tu demo funciona muy bien, pero llevarla a producción es una historia completamente diferente.</p>
<p>Ya hemos hablado de la gestión de la memoria del agente y de la reordenación en entradas anteriores. Ahora vamos a abordar el mayor desafío: crear agentes que realmente se mantengan en producción.</p>
<p>Esta es la realidad: los entornos de producción son desordenados. Un único agente rara vez es suficiente, por eso los sistemas multiagente están por todas partes. Pero los marcos disponibles hoy en día tienden a caer en dos campos: los ligeros que demo bien, pero romper bajo carga real, o los poderosos que toman una eternidad para aprender y construir con.</p>
<p>Recientemente he estado experimentando con <a href="https://github.com/agno-agi/agno">Agno</a>, y parece encontrar un término medio razonable, centrado en la preparación para la producción sin excesiva complejidad. El proyecto ha ganado más de 37.000 estrellas de GitHub en pocos meses, lo que sugiere que otros desarrolladores también lo encuentran útil.</p>
<p>En este post, compartiré lo que aprendí mientras construía un sistema multi-agente usando Agno con <a href="https://milvus.io/">Milvus</a> como capa de memoria. Veremos cómo se compara Agno con alternativas como LangGraph y recorreremos una implementación completa que puedes probar tú mismo.</p>
<h2 id="What-Is-Agno" class="common-anchor-header">¿Qué es Agno?<button data-href="#What-Is-Agno" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/agno-agi/agno">Agno</a> es un framework multi-agente construido específicamente para su uso en producción. Tiene dos capas distintas:</p>
<ul>
<li><p><strong>Agno framework layer</strong>: Donde se define la lógica del agente</p></li>
<li><p><strong>Capa de ejecución AgentOS</strong>: Convierte esa lógica en servicios HTTP que puedes desplegar.</p></li>
</ul>
<p>Piénselo de esta manera: la capa de marco define <em>lo que</em> sus agentes deben hacer, mientras que AgentOS se encarga de <em>cómo</em> se ejecuta y se sirve ese trabajo.</p>
<h3 id="The-Framework-Layer" class="common-anchor-header">La capa Framework</h3><p>Esto es con lo que se trabaja directamente. Introduce tres conceptos básicos:</p>
<ul>
<li><p><strong>Agente</strong>: Maneja un tipo específico de tarea</p></li>
<li><p><strong>Equipo</strong>: Coordina múltiples agentes para resolver problemas complejos</p></li>
<li><p><strong>Flujo de trabajo</strong>: Define el orden y la estructura de ejecución</p></li>
</ul>
<p>Una cosa que aprecié: no necesitas aprender un nuevo DSL o dibujar diagramas de flujo. El comportamiento de los agentes se define mediante llamadas a funciones estándar de Python. El framework maneja la invocación LLM, la ejecución de herramientas y la gestión de memoria.</p>
<h3 id="The-AgentOS-Runtime-Layer" class="common-anchor-header">Capa de ejecución de AgentOS</h3><p>AgentOS está diseñado para grandes volúmenes de peticiones a través de la ejecución asíncrona, y su arquitectura sin estado hace que el escalado sea sencillo.</p>
<p>Entre sus principales características se incluyen:</p>
<ul>
<li><p>Integración FastAPI integrada para exponer agentes como puntos finales HTTP</p></li>
<li><p>Gestión de sesiones y streaming de respuestas</p></li>
<li><p>Puntos finales de supervisión</p></li>
<li><p>Soporte de escalado horizontal</p></li>
</ul>
<p>En la práctica, AgentOS se encarga de la mayor parte del trabajo de infraestructura, lo que le permite centrarse en la propia lógica del agente.</p>
<p>A continuación se muestra una vista de alto nivel de la arquitectura de Agno.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_dfbf444ee6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Agno-vs-LangGraph" class="common-anchor-header">Agno vs. LangGraph<button data-href="#Agno-vs-LangGraph" class="anchor-icon" translate="no">
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
    </button></h2><p>Para entender dónde encaja Agno, comparémoslo con LangGraph, uno de los frameworks multiagente más utilizados.</p>
<p><a href="https://www.langchain.com/langgraph"><strong>LangGraph</strong></a> utiliza una máquina de estados basada en grafos. Modelas todo el flujo de trabajo de tu agente como un grafo: los pasos son nodos, las rutas de ejecución son aristas. Esto funciona bien cuando el proceso es fijo y está estrictamente ordenado. Pero para escenarios abiertos o conversacionales, puede resultar restrictivo. A medida que las interacciones se vuelven más dinámicas, resulta más difícil mantener un gráfico limpio.</p>
<p><strong>Agno</strong> adopta un enfoque diferente. En lugar de ser una capa de orquestación pura, es un sistema integral. Defina el comportamiento de su agente y AgentOS lo expondrá automáticamente como un servicio HTTP listo para la producción, con monitorización, escalabilidad y soporte para conversaciones de varios turnos. Sin pasarela API separada, sin gestión de sesión personalizada, sin herramientas operativas adicionales.</p>
<p>He aquí una rápida comparación:</p>
<table>
<thead>
<tr><th>Dimension</th><th>LangGraph</th><th>Agno</th></tr>
</thead>
<tbody>
<tr><td>Modelo de organización</td><td>Definición explícita del grafo mediante nodos y aristas</td><td>Flujos de trabajo declarativos definidos en Python</td></tr>
<tr><td>Gestión de estados</td><td>Clases de estado personalizadas definidas y gestionadas por los desarrolladores</td><td>Sistema de memoria integrado</td></tr>
<tr><td>Depuración y observabilidad</td><td>LangSmith (de pago)</td><td>AgentOS UI (código abierto)</td></tr>
<tr><td>Modelo de tiempo de ejecución</td><td>Integrado en un tiempo de ejecución existente</td><td>Servicio independiente basado en FastAPI</td></tr>
<tr><td>Complejidad del despliegue</td><td>Requiere configuración adicional a través de LangServe</td><td>Funciona listo para usar</td></tr>
</tbody>
</table>
<p>LangGraph le ofrece más flexibilidad y un control más preciso. Agno optimiza el tiempo de producción. La elección correcta depende de la fase en que se encuentre su proyecto, de la infraestructura existente y del nivel de personalización que necesite. Si no está seguro, realizar una pequeña prueba de concepto con ambos es probablemente la forma más fiable de decidir.</p>
<h2 id="Choosing-Milvus-for-the-Agent-Memory-Layer" class="common-anchor-header">Elegir Milvus para la capa de memoria del agente<button data-href="#Choosing-Milvus-for-the-Agent-Memory-Layer" class="anchor-icon" translate="no">
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
    </button></h2><p>Una vez que haya elegido un marco, la siguiente decisión es cómo almacenar la memoria y el conocimiento. Para ello utilizamos Milvus. <a href="https://milvus.io/">Milvus</a> es la base de datos vectorial de código abierto más popular construida para cargas de trabajo de IA con <a href="https://github.com/milvus-io/milvus">más de 42.000+</a> estrellas de <a href="https://github.com/milvus-io/milvus">GitHub</a>.</p>
<p><strong>Agno tiene soporte nativo para Milvus.</strong> El módulo <code translate="no">agno.vectordb.milvus</code> incluye funciones de producción como gestión de conexiones, reintentos automáticos, escritura por lotes y generación de incrustaciones. No necesita crear grupos de conexiones ni gestionar los fallos de red usted mismo: unas pocas líneas de Python le proporcionan una capa de memoria vectorial de trabajo.</p>
<p><strong>Milvus se adapta a sus necesidades.</strong> Admite tres <a href="https://milvus.io/docs/install-overview.md">modos de despliegue:</a></p>
<ul>
<li><p><strong>Milvus Lite</strong>: Ligero, basado en archivos, ideal para desarrollo y pruebas locales.</p></li>
<li><p><strong>Independiente</strong>: Despliegue en un único servidor para cargas de trabajo de producción</p></li>
<li><p><strong>Distribuido</strong>: Clúster completo para escenarios a gran escala</p></li>
</ul>
<p>Puede empezar con Milvus Lite para validar la memoria de su agente localmente, y luego pasar a independiente o distribuido a medida que crece el tráfico, sin cambiar el código de su aplicación. Esta flexibilidad es especialmente útil cuando está iterando rápidamente en las primeras etapas, pero necesita un camino claro para escalar más adelante.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_1_1en_e0294d0ffa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Step-by-Step-Building-a-Production-Ready-Agno-Agent-with-Milvus" class="common-anchor-header">Paso a paso: Creación de un agente Agno listo para producción con Milvus<button data-href="#Step-by-Step-Building-a-Production-Ready-Agno-Agent-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Construyamos un agente listo para producción desde cero.</p>
<p>Empezaremos con un ejemplo sencillo de agente único para mostrar el flujo de trabajo completo. Después lo ampliaremos a un sistema multi-agente. AgentOS empaquetará automáticamente todo como un servicio HTTP invocable.</p>
<h3 id="1-Deploying-Milvus-Standalone-with-Docker" class="common-anchor-header">1. Despliegue de Milvus Standalone con Docker</h3><p><strong>(1) Descargue los archivos de despliegue</strong></p>
<pre><code translate="no">**wget** **
&lt;https://github.com/Milvus-io/Milvus/releases/download/v2.****5****.****12****/Milvus-standalone-docker-compose.yml&gt; -O docker-compose.yml**
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Inicie el servicio Milvus</strong></p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_80575354d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Core-Implementation" class="common-anchor-header">2. Implementación del núcleo</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">from</span> pathlib <span class="hljs-keyword">import</span> Path
<span class="hljs-keyword">from</span> agno.os <span class="hljs-keyword">import</span> AgentOS
<span class="hljs-keyword">from</span> agno.agent <span class="hljs-keyword">import</span> Agent
<span class="hljs-keyword">from</span> agno.models.openai <span class="hljs-keyword">import</span> OpenAIChat
<span class="hljs-keyword">from</span> agno.knowledge.knowledge <span class="hljs-keyword">import</span> Knowledge
<span class="hljs-keyword">from</span> agno.vectordb.milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> agno.knowledge.embedder.openai <span class="hljs-keyword">import</span> OpenAIEmbedder
<span class="hljs-keyword">from</span> agno.db.sqlite <span class="hljs-keyword">import</span> SqliteDb
os.environ\[<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>\] = <span class="hljs-string">&quot;you-key-here&quot;</span>
data_dir = Path(<span class="hljs-string">&quot;./data&quot;</span>)
data_dir.mkdir(exist_ok=<span class="hljs-literal">True</span>)
knowledge_base = Knowledge(
    contents_db=SqliteDb(
        db_file=<span class="hljs-built_in">str</span>(data_dir / <span class="hljs-string">&quot;knowledge_contents.db&quot;</span>),
        knowledge_table=<span class="hljs-string">&quot;knowledge_contents&quot;</span>,
    ),
    vector_db=Milvus(
        collection=<span class="hljs-string">&quot;agno_knowledge&quot;</span>,
        uri=<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>,
        embedder=OpenAIEmbedder(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>),
    ),
)
*<span class="hljs-comment"># Create Agent*</span>
agent = Agent(
    name=<span class="hljs-string">&quot;Knowledge Assistant&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    instructions=\[
        <span class="hljs-string">&quot;You are a knowledge base assistant that helps users query and manage knowledge base content.&quot;</span>,
        <span class="hljs-string">&quot;Answer questions in English.&quot;</span>,
        <span class="hljs-string">&quot;Always search the knowledge base before answering questions.&quot;</span>,
        <span class="hljs-string">&quot;If the knowledge base is empty, kindly prompt the user to upload documents.&quot;</span>
    \],
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    db=SqliteDb(
        db_file=<span class="hljs-built_in">str</span>(data_dir / <span class="hljs-string">&quot;agent.db&quot;</span>),
        session_table=<span class="hljs-string">&quot;agent_sessions&quot;</span>,
    ),
    add_history_to_context=<span class="hljs-literal">True</span>,
    markdown=<span class="hljs-literal">True</span>,
)
agent_os = AgentOS(agents=\[agent\])
app = agent_os.get_app()
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n🚀 Starting service...&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📍 http://localhost:7777&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;💡 Please upload documents to the knowledge base in the UI\n&quot;</span>)
    agent_os.serve(app=<span class="hljs-string">&quot;knowledge_agent:app&quot;</span>, port=<span class="hljs-number">7777</span>, reload=<span class="hljs-literal">False</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>(1) Ejecutar el agente</strong></p>
<pre><code translate="no">**python** **knowledge_agent.py**
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_df885706cf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Connecting-to-the-AgentOS-Console" class="common-anchor-header">3. Conexión a la consola del AgentOS</h3><p>https://os.agno.com/</p>
<p><strong>(1) Crear una Cuenta e Iniciar Sesión</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_db0af51e58.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(2) Conecte su Agente a AgentOS</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_0a8c6f9436.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(3) Configure el Puerto Expuesto y el Nombre del Agente</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_3844011799.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(4) Añadir documentos e indexarlos en Milvus</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_776ea7ca11.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_90b97c4660.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_a98262d8c5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_58b7d77eea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(5) Pruebe el Agente de extremo a extremo</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_6e61038ba5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>En esta configuración, Milvus se encarga de la recuperación semántica de alto rendimiento. Cuando el asistente de la base de conocimientos recibe una pregunta técnica, invoca la herramienta <code translate="no">search_knowledge</code> para incrustar la consulta, recupera los trozos de documentos más relevantes de Milvus y utiliza esos resultados como base para su respuesta.</p>
<p>Milvus ofrece tres opciones de despliegue, lo que le permite elegir una arquitectura que se adapte a sus necesidades operativas, manteniendo al mismo tiempo la coherencia de las API a nivel de aplicación en todos los modos de despliegue.</p>
<p>La demostración anterior muestra el flujo central de recuperación y generación. Sin embargo, para trasladar este diseño a un entorno de producción, es necesario analizar con más detalle varios aspectos de la arquitectura.</p>
<h2 id="How-Retrieval-Results-Are-Shared-Across-Agents" class="common-anchor-header">Cómo se comparten los resultados de recuperación entre los agentes<button data-href="#How-Retrieval-Results-Are-Shared-Across-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>El modo Equipo de Agno tiene una opción <code translate="no">share_member_interactions=True</code> que permite a los agentes posteriores heredar el historial completo de interacciones de los agentes anteriores. En la práctica, esto significa que cuando el primer agente recupera información de Milvus, los agentes posteriores pueden reutilizar esos resultados en lugar de volver a ejecutar la misma búsqueda.</p>
<ul>
<li><p><strong>La ventaja:</strong> Los costes de recuperación se amortizan en todo el equipo. Una búsqueda vectorial admite varios agentes, lo que reduce las consultas redundantes.</p></li>
<li><p><strong>Desventaja:</strong> La calidad de la recuperación se amplifica. Si la búsqueda inicial devuelve resultados incompletos o inexactos, ese error se propaga a todos los agentes que dependen de ella.</p></li>
</ul>
<p>Por eso, la precisión de la recuperación es aún más importante en los sistemas multiagente. Una mala recuperación no sólo degrada la respuesta de un agente, sino que afecta a todo el equipo.</p>
<p>He aquí un ejemplo de configuración de equipo:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> agno.team <span class="hljs-keyword">import</span> Team
analyst = Agent(
    name=<span class="hljs-string">&quot;Data Analyst&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    instructions=\[<span class="hljs-string">&quot;Analyze data and extract key metrics&quot;</span>\]
)
writer = Agent(
    name=<span class="hljs-string">&quot;Report Writer&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    instructions=\[<span class="hljs-string">&quot;Write reports based on the analysis results&quot;</span>\]
)
team = Team(
    agents=\[analyst, writer\],
    share_member_interactions=<span class="hljs-literal">True</span>,  *<span class="hljs-comment"># Share knowledge retrieval results*</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Why-Agno-and-Milvus-Are-Layered-Separately" class="common-anchor-header">Por qué Agno y Milvus están en capas separadas<button data-href="#Why-Agno-and-Milvus-Are-Layered-Separately" class="anchor-icon" translate="no">
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
    </button></h2><p>En esta arquitectura, <strong>Agno</strong> se sitúa en la capa de conversación y orquestación. Es responsable de gestionar el flujo de diálogo, coordinar a los agentes y mantener el estado de la conversación, con el historial de sesiones guardado en una base de datos relacional. El conocimiento real del dominio del sistema, como la documentación del producto y los informes técnicos, se gestiona por separado y se almacena como incrustaciones vectoriales en <strong>Milvus</strong>. Esta clara división mantiene la lógica conversacional y el almacenamiento de conocimientos totalmente desacoplados.</p>
<p>Por qué es importante desde el punto de vista operativo:</p>
<ul>
<li><p><strong>Escalado independiente</strong>: A medida que crece la demanda de Agno, se añaden más instancias de Agno. A medida que crece el volumen de consultas, se amplía Milvus añadiendo nodos de consulta. Cada capa escala de forma aislada.</p></li>
<li><p><strong>Diferentes necesidades de hardware</strong>: Agno se basa en la CPU y la memoria (inferencia LLM, ejecución del flujo de trabajo). Milvus está optimizado para la recuperación vectorial de alto rendimiento (E/S de disco, a veces aceleración GPU). Separarlos evita la contención de recursos.</p></li>
<li><p><strong>Optimización de costes</strong>: Puede ajustar y asignar recursos a cada capa de forma independiente.</p></li>
</ul>
<p>Este enfoque por capas le proporciona una arquitectura más eficiente, resistente y lista para la producción.</p>
<h2 id="What-to-Monitor-When-Using-Agno-with-Milvus" class="common-anchor-header">Qué supervisar cuando se utiliza Agno con Milvus<button data-href="#What-to-Monitor-When-Using-Agno-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Agno tiene capacidades de evaluación incorporadas, pero al añadir Milvus se amplía lo que debe vigilar. Basándonos en nuestra experiencia, céntrese en tres áreas:</p>
<ul>
<li><p><strong>Calidad de la recuperación</strong>: ¿Los documentos que Milvus devuelve son realmente relevantes para la consulta, o sólo superficialmente similares a nivel vectorial?</p></li>
<li><p><strong>Fidelidad de la respuesta</strong>: ¿La respuesta final se basa en el contenido recuperado o el LLM genera afirmaciones sin fundamento?</p></li>
<li><p><strong>Desglose de la latencia de extremo a extremo</strong>: No se limite a registrar el tiempo de respuesta total. Desglóselo por etapas -generación de incrustaciones, búsqueda de vectores, ensamblaje de contextos, inferencia LLM- para poder identificar dónde se producen las ralentizaciones.</p></li>
</ul>
<p><strong>Un ejemplo práctico:</strong> Cuando su colección Milvus crece de 1 millón a 10 millones de vectores, puede notar que la latencia de recuperación aumenta. Esto suele ser una señal para ajustar los parámetros del índice (como <code translate="no">nlist</code> y <code translate="no">nprobe</code>) o para considerar el cambio de una implementación independiente a una distribuida.</p>
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
    </button></h2><p>Construir sistemas de agentes listos para la producción requiere algo más que cablear llamadas LLM y demostraciones de recuperación. Se necesitan límites arquitectónicos claros, una infraestructura que escale de forma independiente y capacidad de observación para detectar los problemas en una fase temprana.</p>
<p>En este post, he explicado cómo Agno y Milvus pueden trabajar juntos: Agno para la orquestación multiagente, Milvus para la memoria escalable y la recuperación semántica. Al mantener estas capas separadas, puede pasar del prototipo a la producción sin reescribir la lógica central y escalar cada componente según sea necesario.</p>
<p>Si está experimentando con configuraciones similares, me gustaría saber qué le funciona.</p>
<p><strong>¿Preguntas sobre Milvus?</strong> Únase a nuestro <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canal de Slack</a> o reserve una sesión de 20 minutos <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">de Milvus Office Hours</a>.</p>
