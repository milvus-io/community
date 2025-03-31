---
id: >-
  stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md
title: >-
  Deje de utilizar GAR anticuadas: el enfoque de GAR agenética de DeepSearcher
  lo cambia todo
author: Cheney Zhang
date: 2025-03-23T00:00:00.000Z
cover: >-
  assets.zilliz.com/Stop_Using_Outdated_RAG_Deep_Searcher_s_Agentic_RAG_Approach_Changes_Everything_b2eaa644cf.png
tag: Engineering
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md
---
<h2 id="The-Shift-to-AI-Powered-Search-with-LLMs-and-Deep-Research" class="common-anchor-header">El cambio a la búsqueda impulsada por IA con LLM e investigación profunda<button data-href="#The-Shift-to-AI-Powered-Search-with-LLMs-and-Deep-Research" class="anchor-icon" translate="no">
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
    </button></h2><p>La evolución de la tecnología de búsqueda ha progresado drásticamente a lo largo de las décadas: desde la recuperación basada en palabras clave de antes de la década de 2000 hasta las experiencias de búsqueda personalizadas de la década de 2010. Estamos asistiendo a la aparición de soluciones basadas en IA capaces de gestionar consultas complejas que requieren un análisis profundo y profesional.</p>
<p>Deep Research de OpenAI es un ejemplo de este cambio, ya que utiliza capacidades de razonamiento para sintetizar grandes cantidades de información y generar informes de investigación de varios pasos. Por ejemplo, ante la pregunta "¿Cuál es la capitalización bursátil razonable de Tesla?" Deep Research puede analizar exhaustivamente las finanzas corporativas, las trayectorias de crecimiento empresarial y las estimaciones del valor de mercado.</p>
<p>Deep Research implementa una forma avanzada del marco RAG (Retrieval-Augmented Generation) en su núcleo. La RAG tradicional mejora los resultados de los modelos lingüísticos recuperando e incorporando información externa relevante. El enfoque de OpenAI va más allá al implementar ciclos iterativos de recuperación y razonamiento. En lugar de un único paso de recuperación, Deep Research genera dinámicamente múltiples consultas, evalúa los resultados intermedios y refina su estrategia de búsqueda, demostrando cómo las técnicas avanzadas o agénticas de RAG pueden ofrecer contenidos de alta calidad a nivel empresarial que se asemejan más a la investigación profesional que a la simple respuesta a preguntas.</p>
<h2 id="DeepSearcher-A-Local-Deep-Research-Bringing-Agentic-RAG-to-Everyone" class="common-anchor-header">DeepSearcher: Una investigación profunda local que pone la RAG agéntica al alcance de todos<button data-href="#DeepSearcher-A-Local-Deep-Research-Bringing-Agentic-RAG-to-Everyone" class="anchor-icon" translate="no">
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
    </button></h2><p>Inspirados por estos avances, desarrolladores de todo el mundo han creado sus propias implementaciones. Los ingenieros de Zilliz crearon el proyecto <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>, que puede considerarse una investigación profunda local y de código abierto. Este proyecto ha conseguido más de 4.900 estrellas de GitHub en menos de un mes.</p>
<p>DeepSearcher redefine la búsqueda empresarial impulsada por IA combinando la potencia de modelos de razonamiento avanzados, sofisticadas funciones de búsqueda y un asistente de investigación integrado. Al integrar datos locales a través de <a href="https://milvus.io/docs/overview.md">Milvus</a> (una base de datos vectorial de alto rendimiento y código abierto), DeepSearcher ofrece resultados más rápidos y relevantes, al tiempo que permite a los usuarios intercambiar fácilmente los modelos centrales para obtener una experiencia personalizada.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_1_Deep_Searcher_s_star_history_9c1a064ed8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 1:</em> <em>Historia estelar de DeepSearcher (</em><a href="https://www.star-history.com/#zilliztech/deep-searcher&amp;Date"><em>Fuente</em></a><em>)</em></p>
<p>En este artículo, exploraremos la evolución de la RAG tradicional a la RAG Agentic, explorando lo que específicamente hace que estos enfoques sean diferentes a nivel técnico. Luego discutiremos la implementación de DeepSearcher, mostrando cómo aprovecha las capacidades de los agentes inteligentes para permitir el razonamiento dinámico y multi-vuelta, y por qué esto es importante para los desarrolladores que construyen soluciones de búsqueda a nivel empresarial.</p>
<h2 id="From-Traditional-RAG-to-Agentic-RAG-The-Power-of-Iterative-Reasoning" class="common-anchor-header">De la RAG tradicional a la Agentic RAG: el poder del razonamiento iterativo<button data-href="#From-Traditional-RAG-to-Agentic-RAG-The-Power-of-Iterative-Reasoning" class="anchor-icon" translate="no">
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
    </button></h2><p>Agentic RAG mejora el marco RAG tradicional incorporando funciones de agente inteligente. DeepSearcher es un excelente ejemplo de un marco RAG agéntico. Mediante la planificación dinámica, el razonamiento en varios pasos y la toma de decisiones autónoma, establece un proceso de bucle cerrado que recupera, procesa, valida y optimiza datos para resolver problemas complejos.</p>
<p>La creciente popularidad de la GAR agéntica está impulsada por los significativos avances en las capacidades de razonamiento de los modelos de grandes lenguajes (LLM), en particular su capacidad mejorada para desglosar problemas complejos y mantener cadenas coherentes de pensamiento a través de múltiples pasos.</p>
<table>
<thead>
<tr><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Dimensión comparativa</strong></td><td><strong>GAR tradicional</strong></td><td><strong>GAR Agenética</strong></td></tr>
<tr><td>Enfoque central</td><td>Pasivo y reactivo</td><td>Proactivo y basado en agentes</td></tr>
<tr><td>Flujo de procesos</td><td>Recuperación y generación en un solo paso (proceso único)</td><td>Recuperación y generación dinámica en varios pasos (perfeccionamiento iterativo)</td></tr>
<tr><td>Estrategia de recuperación</td><td>Búsqueda por palabras clave fijas, en función de la consulta inicial</td><td>Recuperación adaptativa (por ejemplo, refinamiento de palabras clave, cambio de fuente de datos)</td></tr>
<tr><td>Gestión de consultas complejas</td><td>Generación directa; propensa a errores con datos contradictorios</td><td>Descomposición de tareas → recuperación selectiva → síntesis de respuestas</td></tr>
<tr><td>Capacidad de interacción</td><td>Depende totalmente de las aportaciones del usuario; sin autonomía</td><td>Participación proactiva (por ejemplo, aclaración de ambigüedades, solicitud de detalles)</td></tr>
<tr><td>Corrección de errores y retroalimentación</td><td>Sin autocorrección; limitado por los resultados iniciales</td><td>Validación iterativa → autorrecuperación para mayor precisión</td></tr>
<tr><td>Casos de uso ideales</td><td>Preguntas y respuestas sencillas, búsqueda de hechos</td><td>Razonamiento complejo, resolución de problemas en varias fases, tareas abiertas</td></tr>
<tr><td>Ejemplo</td><td>El usuario pregunta "¿Qué es la computación cuántica?" → El sistema devuelve una definición de libro de texto</td><td>El usuario pregunta: "¿Cómo puede la computación cuántica optimizar la logística?" → El sistema recupera principios cuánticos y algoritmos logísticos y, a continuación, sintetiza ideas procesables</td></tr>
</tbody>
</table>
<p>A diferencia de la RAG tradicional, que se basa en una única consulta, la RAG Agentic descompone una consulta en múltiples subpreguntas y refina iterativamente su búsqueda hasta alcanzar una respuesta satisfactoria. Esta evolución ofrece tres ventajas principales:</p>
<ul>
<li><p><strong>Resolución proactiva de problemas:</strong> El sistema pasa de reaccionar pasivamente a resolver activamente los problemas.</p></li>
<li><p><strong>Recuperación dinámica multivuelta:</strong> En lugar de realizar una única búsqueda, el sistema ajusta continuamente sus consultas y se autocorrige en función de la información recibida.</p></li>
<li><p><strong>Mayor aplicabilidad:</strong> Va más allá de la comprobación básica de hechos para gestionar tareas de razonamiento complejas y generar informes exhaustivos.</p></li>
</ul>
<p>Al aprovechar estas capacidades, las aplicaciones Agentic RAG como DeepSearcher funcionan de forma muy parecida a la de un experto humano: no sólo ofrecen la respuesta final, sino también un desglose completo y transparente de su proceso de razonamiento y los detalles de ejecución.</p>
<p>A largo plazo, la GAR robótica está llamada a superar a los sistemas de GAR básicos. Los enfoques convencionales suelen tener dificultades para abordar la lógica subyacente en las consultas de los usuarios, que requieren razonamiento iterativo, reflexión y optimización continua.</p>
<h2 id="What-Does-an-Agentic-RAG-Architecture-Look-Like-DeepSearcher-as-an-Example" class="common-anchor-header">¿Qué aspecto tiene una arquitectura de GAR robótica? DeepSearcher como ejemplo<button data-href="#What-Does-an-Agentic-RAG-Architecture-Look-Like-DeepSearcher-as-an-Example" class="anchor-icon" translate="no">
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
    </button></h2><p>Ahora que hemos entendido el poder de los sistemas RAG agénticos, ¿cómo es su arquitectura? Tomemos DeepSearcher como ejemplo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_2_Two_Modules_Within_Deep_Searcher_baf5ca5952.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 2: Dos módulos de DeepSearcher</em></p>
<p>La arquitectura de DeepSearcher consta de dos módulos principales:</p>
<h3 id="1-Data-Ingestion-Module" class="common-anchor-header">1. Módulo de ingestión de datos</h3><p>Este módulo conecta varias fuentes de datos propias de terceros a través de una base de datos vectorial Milvus. Es especialmente valioso para entornos empresariales que dependen de conjuntos de datos propietarios. El módulo se encarga de</p>
<ul>
<li><p>Análisis sintáctico y fragmentación de documentos</p></li>
<li><p>Generación de incrustaciones</p></li>
<li><p>Almacenamiento e indexación de vectores</p></li>
<li><p>Gestión de metadatos para una recuperación eficiente</p></li>
</ul>
<h3 id="2-Online-Reasoning-and-Query-Module" class="common-anchor-header">2. Módulo de razonamiento y consulta en línea</h3><p>Este componente implementa diversas estrategias de agentes en el marco de la GAR para ofrecer respuestas precisas y perspicaces. Funciona en un bucle iterativo dinámico: después de cada recuperación de datos, el sistema reflexiona sobre si la información acumulada responde suficientemente a la consulta original. En caso negativo, se activa otra iteración; en caso afirmativo, se genera el informe final.</p>
<p>Este ciclo continuo de "seguimiento" y "reflexión" representa una mejora fundamental respecto a otros planteamientos básicos de GAR. Mientras que el GAR tradicional realiza un proceso de recuperación y generación de datos de una sola vez, el enfoque iterativo de DeepSearcher refleja la forma de trabajar de los investigadores humanos: formulación de preguntas iniciales, evaluación de la información recibida, identificación de lagunas y búsqueda de nuevas líneas de investigación.</p>
<h2 id="How-Effective-is-DeepSearcher-and-What-Use-Cases-is-It-Best-Suited-For" class="common-anchor-header">¿Cuál es la eficacia de DeepSearcher y para qué casos de uso es más adecuado?<button data-href="#How-Effective-is-DeepSearcher-and-What-Use-Cases-is-It-Best-Suited-For" class="anchor-icon" translate="no">
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
    </button></h2><p>Una vez instalado y configurado, DeepSearcher indexa sus archivos locales a través de la base de datos vectorial Milvus. Cuando envías una consulta, realiza una búsqueda exhaustiva y en profundidad de este contenido indexado. Una ventaja clave para los desarrolladores es que el sistema registra cada paso de su proceso de búsqueda y razonamiento, proporcionando transparencia sobre cómo llegó a sus conclusiones, una característica crítica para la depuración y optimización de los sistemas RAG.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_3_Accelerated_Playback_of_Deep_Searcher_Iteration_0c36baea2f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 3: Reproducción acelerada de una iteración de DeepSearcher</em></p>
<p>Este enfoque consume más recursos informáticos que el GAR tradicional, pero ofrece mejores resultados para consultas complejas. Analicemos dos casos de uso específicos para los que DeepSearcher es más adecuado.</p>
<h3 id="1-Overview-Type-Queries" class="common-anchor-header">1. Consultas de tipo general</h3><p>Las consultas de tipo general, como la generación de informes, la redacción de documentos o el resumen de tendencias, proporcionan un tema breve pero requieren un resultado exhaustivo y detallado.</p>
<p>Por ejemplo, al consultar &quot;¿Cómo han cambiado Los Simpson con el tiempo?&quot;, DeepSearcher genera primero un conjunto inicial de subconsultas:</p>
<pre><code translate="no">_Break down the original query <span class="hljs-keyword">into</span> <span class="hljs-keyword">new</span> sub queries: [_

_<span class="hljs-string">&#x27;How has the cultural impact and societal relevance of The Simpsons evolved from its debut to the present?&#x27;</span>,_

_<span class="hljs-string">&#x27;What changes in character development, humor, and storytelling styles have occurred across different seasons of The Simpsons?&#x27;</span>,_

_<span class="hljs-string">&#x27;How has the animation style and production technology of The Simpsons changed over time?&#x27;</span>,_

_<span class="hljs-string">&#x27;How have audience demographics, reception, and ratings of The Simpsons shifted throughout its run?&#x27;</span>]_
<button class="copy-code-btn"></button></code></pre>
<p>Recupera la información pertinente y, a continuación, itera con retroalimentación para refinar su búsqueda, generando las siguientes subconsultas:</p>
<pre><code translate="no">_New search queries <span class="hljs-keyword">for</span> <span class="hljs-built_in">next</span> iteration: [_

_<span class="hljs-string">&quot;How have changes in The Simpsons&#x27; voice cast and production team influenced the show&#x27;s evolution over different seasons?&quot;</span>,_

_<span class="hljs-string">&quot;What role has The Simpsons&#x27; satire and social commentary played in its adaptation to contemporary issues across decades?&quot;</span>,_

_<span class="hljs-string">&#x27;How has The Simpsons addressed and incorporated shifts in media consumption, such as streaming services, into its distribution and content strategies?&#x27;</span>]_
<button class="copy-code-btn"></button></code></pre>
<p>Cada iteración se basa en la anterior, culminando en un informe exhaustivo que cubre múltiples facetas del tema, estructurado con secciones como:</p>
<pre><code translate="no">**<span class="hljs-title class_">Report</span>: <span class="hljs-title class_">The</span> <span class="hljs-title class_">Evolution</span> <span class="hljs-keyword">of</span> _The <span class="hljs-title class_">Simpsons</span>_ (<span class="hljs-number">1989</span>–<span class="hljs-title class_">Present</span>)**
**<span class="hljs-number">1.</span> <span class="hljs-title class_">Cultural</span> <span class="hljs-title class_">Impact</span> and <span class="hljs-title class_">Societal</span> <span class="hljs-title class_">Relevance</span>** 
_The <span class="hljs-title class_">Simpsons</span>_ debuted <span class="hljs-keyword">as</span> a subversive critique <span class="hljs-keyword">of</span> <span class="hljs-title class_">American</span> middle-<span class="hljs-keyword">class</span> <span class="hljs-title class_">life</span>, gaining notoriety <span class="hljs-keyword">for</span> its bold satire <span class="hljs-keyword">in</span> the 1990s. <span class="hljs-title class_">Initially</span> a countercultural phenomenon, it challenged norms <span class="hljs-keyword">with</span> episodes tackling religion, politics, and consumerism. <span class="hljs-title class_">Over</span> time, its cultural dominance waned <span class="hljs-keyword">as</span> competitors like _South <span class="hljs-title class_">Park</span>_ and _Family <span class="hljs-title class_">Guy</span>_ pushed boundaries further. <span class="hljs-title class_">By</span> the 2010s, the show transitioned <span class="hljs-keyword">from</span> trendsetter to nostalgic institution, balancing legacy appeal <span class="hljs-keyword">with</span> attempts to address modern issues like climate change and <span class="hljs-variable constant_">LGBTQ</span>+ rights, albeit <span class="hljs-keyword">with</span> less societal resonance.
**<span class="hljs-number">2.</span> <span class="hljs-title class_">Character</span> <span class="hljs-title class_">Development</span> and <span class="hljs-title class_">Storytelling</span> <span class="hljs-title class_">Shifts</span>** 
<span class="hljs-title class_">Early</span> seasons featured nuanced character <span class="hljs-title function_">arcs</span> (e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Lisa</span>’s activism, <span class="hljs-title class_">Marge</span>’s resilience), but later seasons saw <span class="hljs-string">&quot;Flanderization&quot;</span> (exaggerating traits, e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Homer</span>’s stupidity, <span class="hljs-title class_">Ned</span> <span class="hljs-title class_">Flanders</span>’ piety). <span class="hljs-title class_">Humor</span> evolved <span class="hljs-keyword">from</span> witty, character-driven satire to reliance on pop culture references and meta-humor. <span class="hljs-title class_">Serialized</span> storytelling <span class="hljs-keyword">in</span> early episodes gave way to episodic, gag-focused plots, often sacrificing emotional depth <span class="hljs-keyword">for</span> absurdity.
[...]
**<span class="hljs-number">12.</span> <span class="hljs-title class_">Merchandising</span> and <span class="hljs-title class_">Global</span> <span class="hljs-title class_">Reach</span>** 
<span class="hljs-title class_">The</span> 1990s merchandise <span class="hljs-title function_">boom</span> (action figures, _Simpsons_-themed cereals) faded, but the franchise persists via <span class="hljs-title function_">collaborations</span> (e.<span class="hljs-property">g</span>., _Fortnite_ skins, <span class="hljs-title class_">Lego</span> sets). <span class="hljs-title class_">International</span> adaptations include localized dubbing and culturally tailored <span class="hljs-title function_">episodes</span> (e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Japanese</span> _Itchy &amp; <span class="hljs-title class_">Scratchy</span>_ variants).
**<span class="hljs-title class_">Conclusion</span>** 
_The <span class="hljs-title class_">Simpsons</span>_ evolved <span class="hljs-keyword">from</span> a radical satire to a television institution, navigating shifts <span class="hljs-keyword">in</span> technology, politics, and audience expectations. <span class="hljs-title class_">While</span> its golden-age brilliance remains unmatched, its adaptability—through streaming, updated humor, and <span class="hljs-variable language_">global</span> outreach—secures its place <span class="hljs-keyword">as</span> a cultural touchstone. <span class="hljs-title class_">The</span> show’s longevity reflects both nostalgia and a pragmatic embrace <span class="hljs-keyword">of</span> change, even <span class="hljs-keyword">as</span> it grapples <span class="hljs-keyword">with</span> the challenges <span class="hljs-keyword">of</span> relevance <span class="hljs-keyword">in</span> a fragmented media landscape.
<button class="copy-code-btn"></button></code></pre>
<p><em>(Por brevedad, sólo se muestran extractos del proceso y del informe final)</em></p>
<p>El informe final ofrece un análisis exhaustivo con citas adecuadas y una organización estructurada.</p>
<h3 id="2-Complex-Reasoning-Queries" class="common-anchor-header">2. Consultas de razonamiento complejo</h3><p>Las consultas complejas implican múltiples capas de lógica y entidades interconectadas.</p>
<p>Considere la consulta "¿Qué película tiene el director de más edad, God's Gift To Women o Aldri annet enn bråk?".</p>
<p>Aunque esto podría parecer sencillo para un ser humano, los sistemas RAG simples tienen dificultades porque la respuesta no se almacena directamente en la base de conocimientos. DeepSearcher aborda este reto descomponiendo la consulta en subpreguntas más pequeñas:</p>
<pre><code translate="no">[<span class="hljs-string">&quot;Who is the director of God&#x27;S Gift To Women?&quot;</span>, <span class="hljs-string">&#x27;Who is the director of Aldri annet enn bråk?&#x27;</span>, <span class="hljs-string">&#x27;What are the ages of the respective directors?&#x27;</span>, <span class="hljs-string">&#x27;Which director is older?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Primero recupera información sobre los directores de ambas películas,</p>
<pre><code translate="no">The director of <span class="hljs-string">&quot;God&#x27;s Gift To Women&quot;</span> <span class="hljs-keyword">is</span> Michael Curtiz, the director of <span class="hljs-string">&quot;Aldri annet enn bråk&quot;</span> <span class="hljs-keyword">is</span> Edith Carlmar
<button class="copy-code-btn"></button></code></pre>
<p>luego genera subconsultas:</p>
<pre><code translate="no">[<span class="hljs-string">&quot;Find the birthdate of Michael Curtiz, the director of God&#x27;s Gift To Women&quot;</span>, <span class="hljs-string">&#x27;Find the birthdate of Edith Carlmar, the director of Aldri annet enn bråk&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Después extrae sus fechas de nacimiento y, por último, las compara para determinar la respuesta correcta:</p>
<pre><code translate="no">The director of <span class="hljs-string">&quot;God&#x27;s Gift To Women&quot;</span> <span class="hljs-keyword">is</span> Michael Curtiz, who was born <span class="hljs-keyword">on</span> December <span class="hljs-number">24</span>, <span class="hljs-number">1886</span> <span class="hljs-keyword">and</span> passed away <span class="hljs-keyword">on</span> April <span class="hljs-number">11</span>, <span class="hljs-number">1962.</span> He was a Hungarian-born American film director known <span class="hljs-keyword">for</span> his prolific career <span class="hljs-keyword">in</span> Hollywood.
On the other hand, the director of <span class="hljs-string">&quot;Aldri annet enn bråk&quot;</span> <span class="hljs-keyword">is</span> Edith Carlmar, who was born <span class="hljs-keyword">on</span> November <span class="hljs-number">15</span>, <span class="hljs-number">1911</span> <span class="hljs-keyword">and</span> passed away <span class="hljs-keyword">on</span> May <span class="hljs-number">17</span>, <span class="hljs-number">2003.</span>
Therefore, Michael Curtiz <span class="hljs-keyword">is</span> older than Edith Carlmar.
<button class="copy-code-btn"></button></code></pre>
<p>Por el contrario, un sistema RAG convencional podría pasar por alto detalles clave debido a una recuperación limitada en una sola pasada, lo que podría dar lugar a respuestas <a href="https://zilliz.com/blog/decoding-llm-hallucinations-deep-dive-into-llm-errors">alucinadas</a> o inexactas:</p>
<pre><code translate="no"><span class="hljs-number">1.</span> **Aldri annet enn bråk** (<span class="hljs-number">1954</span>) <span class="hljs-keyword">is</span> directed <span class="hljs-keyword">by</span> **Edith Carlmar**, who was born <span class="hljs-keyword">on</span> November <span class="hljs-number">15</span>, <span class="hljs-number">1911.</span>
<span class="hljs-number">2.</span> The related chunks did <span class="hljs-keyword">not</span> provide specific details about the director of <span class="hljs-string">&quot;God&#x27;s Gift to Women.&quot;</span> However, <span class="hljs-keyword">if</span> we look at external sources <span class="hljs-keyword">for</span> <span class="hljs-string">&quot;God&#x27;s Gift to Women,&quot;</span> the film was directed <span class="hljs-keyword">by</span> **L. M. (Lyman) Steinberg**, who was born <span class="hljs-keyword">on</span> December <span class="hljs-number">19</span>, <span class="hljs-number">1905.</span>
By comparing their birth dates:
- Edith Carlmar: November <span class="hljs-number">15</span>, <span class="hljs-number">1911</span>
- L. M. Steinberg: December <span class="hljs-number">19</span>, <span class="hljs-number">1905</span>
**Conclusion**: L. M. Steinberg, the director of <span class="hljs-string">&quot;God&#x27;s Gift to Women,&quot;</span> <span class="hljs-keyword">is</span> older than Edith Carlmar, the director of <span class="hljs-string">&quot;Aldri annet enn bråk.&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>DeepSearcher destaca por realizar búsquedas profundas e iterativas en datos locales importados. Registra cada paso de su proceso de razonamiento y, en última instancia, ofrece un informe completo y unificado. Esto lo hace especialmente eficaz para consultas de tipo general -como generar informes detallados o resumir tendencias- y para consultas de razonamiento complejas que requieren dividir una pregunta en subpreguntas más pequeñas y agregar datos a través de múltiples bucles de retroalimentación.</p>
<p>En la siguiente sección, compararemos DeepSearcher con otros sistemas de GAR, explorando cómo su enfoque iterativo y la integración flexible de modelos se comparan con los métodos tradicionales.</p>
<h2 id="Quantitative-Comparison-DeepSearcher-vs-Traditional-RAG" class="common-anchor-header">Comparación cuantitativa: DeepSearcher frente al GAR tradicional<button data-href="#Quantitative-Comparison-DeepSearcher-vs-Traditional-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>En el repositorio GitHub de DeepSearcher, hemos puesto a disposición código para pruebas cuantitativas. Para este análisis, hemos utilizado el popular conjunto de datos 2WikiMultiHopQA. (Nota: Evaluamos sólo las 50 primeras entradas para gestionar el consumo de tokens de la API, pero las tendencias generales siguen siendo claras).</p>
<h3 id="Recall-Rate-Comparison" class="common-anchor-header">Comparación de la tasa de recuperación</h3><p>Como muestra la figura 4, el índice de recuperación mejora significativamente a medida que aumenta el número de iteraciones máximas:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_4_Max_Iterations_vs_Recall_18a8d6e9bf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 4: Iteraciones máximas frente a recuperación</em></p>
<p>A partir de cierto punto, las mejoras marginales disminuyen, por lo que normalmente fijamos el valor predeterminado en 3 iteraciones, aunque puede ajustarse en función de las necesidades específicas.</p>
<h3 id="Token-Consumption-Analysis" class="common-anchor-header">Análisis del consumo de tokens</h3><p>También hemos medido el consumo total de tokens en 50 consultas con diferentes iteraciones:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_5_Max_Iterations_vs_Token_Usage_6d1d44b114.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 5: Iteraciones máximas frente a uso de tokens</em></p>
<p>Los resultados muestran que el consumo de tokens aumenta linealmente con más iteraciones. Por ejemplo, con 4 iteraciones, DeepSearcher consume aproximadamente 0,3 millones de tokens. Utilizando una estimación aproximada basada en el precio gpt-4o-mini de OpenAI de <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0,</mn></mrow></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">60/1Moutputtokens</span></span></span><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">,</annotation><mrow><mi>lo que equivale a un coste medio de aproximadamente</mi><mi>0</mi></mrow><annotation encoding="application/x-tex">,60/1M output tokens, esto equivale a un coste medio de aproximadamente</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span></span></span></span>0 <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,</span><span class="mord mathnormal">60/1Moutputtokens</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">lo</span><span class="mord mathnormal">que</span><span class="mord mathnormal">equivale a un coste medio de aproximadamente 0</span></span></span></span>,0036 por consulta (o aproximadamente 0,18 dólares por 50 consultas).</p>
<p>En el caso de modelos de inferencia con un uso más intensivo de recursos, los costes serían varias veces superiores debido a un precio por token más elevado y a una mayor producción de tokens.</p>
<h3 id="Model-Performance-Comparison" class="common-anchor-header">Comparación del rendimiento de los modelos</h3><p>Una ventaja significativa de DeepSearcher es su flexibilidad a la hora de cambiar entre diferentes modelos. Hemos probado varios modelos de inferencia y modelos sin inferencia (como gpt-4o-mini). En general, los modelos de inferencia -especialmente Claude 3.7 Sonnet- obtuvieron los mejores resultados, aunque las diferencias no fueron drásticas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_6_Average_Recall_by_Model_153c93f616.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 6: Recuperación media por modelo</em></p>
<p>Cabe destacar que algunos modelos más pequeños no basados en la inferencia a veces no podían completar todo el proceso de consulta al agente debido a su limitada capacidad para seguir instrucciones, un reto común para muchos desarrolladores que trabajan con sistemas similares.</p>
<h2 id="DeepSearcher-Agentic-RAG-vs-Graph-RAG" class="common-anchor-header">DeepSearcher (Agentic RAG) frente a Graph RAG<button data-href="#DeepSearcher-Agentic-RAG-vs-Graph-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/blog/graphrag-explained-enhance-rag-with-knowledge-graphs">Graph RAG</a> también es capaz de gestionar consultas complejas, sobre todo consultas multisalto. Entonces, ¿cuál es la diferencia entre DeepSearcher (Agentic RAG) y Graph RAG?</p>
<p>Graph RAG está diseñado para consultar documentos basándose en vínculos relacionales explícitos, lo que lo hace especialmente potente en consultas multisalto. Por ejemplo, al procesar una novela larga, Graph RAG puede extraer con precisión las intrincadas relaciones entre personajes. Sin embargo, este método requiere un uso considerable de tokens durante la importación de datos para trazar estas relaciones, y su modo de consulta tiende a ser rígido, por lo que normalmente sólo es eficaz para consultas de una única relación.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_7_Graph_RAG_vs_Deep_Searcher_a5c7130374.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 7: Graph RAG frente a DeepSearcher</em></p>
<p>Por el contrario, Agentic RAG, ejemplificado por DeepSearcher, adopta un enfoque fundamentalmente diferente. Minimiza el consumo de tokens durante la importación de datos y, en su lugar, invierte recursos computacionales durante el procesamiento de las consultas. Esta elección de diseño crea importantes compensaciones técnicas:</p>
<ol>
<li><p>Menores costes iniciales: DeepSearcher requiere menos preprocesamiento de documentos, por lo que la configuración inicial es más rápida y menos costosa.</p></li>
<li><p>Gestión dinámica de las consultas: El sistema puede ajustar su estrategia de recuperación sobre la marcha en función de los resultados intermedios.</p></li>
<li><p>Mayores costes por consulta: Cada consulta requiere más cálculos que Graph RAG, pero ofrece resultados más flexibles.</p></li>
</ol>
<p>Para los desarrolladores, esta distinción es crucial a la hora de diseñar sistemas con distintos patrones de uso. Graph RAG puede ser más eficiente para aplicaciones con patrones de consulta predecibles y un alto volumen de consultas, mientras que el enfoque de DeepSearcher sobresale en escenarios que requieren flexibilidad y manejo de consultas impredecibles y complejas.</p>
<p>De cara al futuro, a medida que el coste de los LLM disminuya y el rendimiento de la inferencia siga mejorando, es probable que los sistemas RAG Agentic como DeepSearcher se generalicen. La desventaja del coste computacional disminuirá, mientras que la ventaja de la flexibilidad se mantendrá.</p>
<h2 id="DeepSearcher-vs-Deep-Research" class="common-anchor-header">DeepSearcher frente a Deep Research<button data-href="#DeepSearcher-vs-Deep-Research" class="anchor-icon" translate="no">
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
    </button></h2><p>A diferencia de Deep Research de OpenAI, DeepSearcher está específicamente diseñado para la recuperación y el análisis en profundidad de datos privados. Al aprovechar una base de datos vectorial, DeepSearcher puede ingerir diversas fuentes de datos, integrar varios tipos de datos y almacenarlos uniformemente en un repositorio de conocimiento basado en vectores. Sus sólidas capacidades de búsqueda semántica le permiten buscar eficientemente entre enormes cantidades de datos offline.</p>
<p>Además, DeepSearcher es completamente de código abierto. Aunque Deep Research sigue siendo líder en calidad de generación de contenidos, tiene una cuota mensual y funciona como un producto de código cerrado, lo que significa que sus procesos internos están ocultos a los usuarios. En cambio, DeepSearcher ofrece total transparencia: los usuarios pueden examinar el código, personalizarlo para adaptarlo a sus necesidades o incluso implantarlo en sus propios entornos de producción.</p>
<h2 id="Technical-Insights" class="common-anchor-header">Información técnica<button data-href="#Technical-Insights" class="anchor-icon" translate="no">
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
    </button></h2><p>A lo largo del desarrollo y las sucesivas iteraciones de DeepSearcher, hemos recopilado varios conocimientos técnicos importantes:</p>
<h3 id="Inference-Models-Effective-but-Not-Infallible" class="common-anchor-header">Modelos de inferencia: Eficaces pero no infalibles</h3><p>Nuestros experimentos revelan que, aunque los modelos de inferencia funcionan bien como agentes, a veces analizan en exceso instrucciones sencillas, lo que provoca un consumo excesivo de tokens y tiempos de respuesta más lentos. Esta observación coincide con el enfoque de los principales proveedores de IA, como OpenAI, que ya no distinguen entre modelos de inferencia y no inferencia. En su lugar, los servicios de modelos deberían determinar automáticamente la necesidad de la inferencia basándose en requisitos específicos para conservar tokens.</p>
<h3 id="The-Imminent-Rise-of-Agentic-RAG" class="common-anchor-header">El inminente auge de la RAG agenética</h3><p>Desde el punto de vista de la demanda, la generación de contenidos en profundidad es esencial; desde el punto de vista técnico, mejorar la eficacia de la GAR también es crucial. A largo plazo, el coste es el principal obstáculo para la adopción generalizada de la GAR Agenética. Sin embargo, con la aparición de LLM rentables y de alta calidad como DeepSeek-R1 y la reducción de costes impulsada por la Ley de Moore, se espera que disminuyan los gastos asociados a los servicios de inferencia.</p>
<h3 id="The-Hidden-Scaling-Limit-of-Agentic-RAG" class="common-anchor-header">El límite de escala oculto de la GAR agéntica</h3><p>Uno de los principales resultados de nuestra investigación se refiere a la relación entre rendimiento y recursos informáticos. Inicialmente, nuestra hipótesis era que un simple aumento del número de iteraciones y de la asignación de tokens mejoraría proporcionalmente los resultados de las consultas complejas.</p>
<p>Nuestros experimentos revelaron una realidad más matizada: aunque el rendimiento mejora con iteraciones adicionales, observamos claros rendimientos decrecientes. En concreto:</p>
<ul>
<li><p>El rendimiento aumentó considerablemente de 1 a 3 iteraciones.</p></li>
<li><p>Las mejoras de 3 a 5 iteraciones fueron modestas.</p></li>
<li><p>Más allá de 5 iteraciones, las ganancias eran insignificantes a pesar de los aumentos significativos en el consumo de tokens.</p></li>
</ul>
<p>Este hallazgo tiene importantes implicaciones para los desarrolladores: dedicar simplemente más recursos informáticos a los sistemas RAG no es el enfoque más eficiente. La calidad de la estrategia de recuperación, la lógica de descomposición y el proceso de síntesis suelen ser más importantes que el número de iteraciones. Esto sugiere que los desarrolladores deberían centrarse en optimizar estos componentes en lugar de limitarse a aumentar los presupuestos de tokens.</p>
<h3 id="The-Evolution-Beyond-Traditional-RAG" class="common-anchor-header">La evolución más allá de la GAR tradicional</h3><p>La RAG tradicional ofrece una valiosa eficiencia con su enfoque de bajo coste y recuperación única, lo que la hace adecuada para escenarios sencillos de respuesta a preguntas. Sin embargo, sus limitaciones se hacen evidentes cuando se manejan consultas con una lógica implícita compleja.</p>
<p>Consideremos una consulta de usuario del tipo "Cómo ganar 100 millones en un año". Un sistema RAG tradicional podría recuperar contenidos sobre carreras con altos ingresos o estrategias de inversión, pero tendría dificultades para:</p>
<ol>
<li><p>Identificar expectativas poco realistas en la consulta.</p></li>
<li><p>descomponer el problema en subobjetivos viables</p></li>
<li><p>Sintetizar información de múltiples ámbitos (negocios, finanzas, espíritu empresarial).</p></li>
<li><p>Presentar un planteamiento estructurado de múltiples vías con plazos realistas.</p></li>
</ol>
<p>Aquí es donde los sistemas RAG agenéticos como DeepSearcher demuestran su fuerza. Al descomponer las consultas complejas y aplicar el razonamiento en varios pasos, pueden ofrecer respuestas matizadas y completas que responden mejor a las necesidades de información subyacentes del usuario. A medida que estos sistemas sean más eficientes, esperamos que su adopción se acelere en las aplicaciones empresariales.</p>
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
    </button></h2><p>DeepSearcher representa una evolución significativa en el diseño de sistemas RAG, ofreciendo a los desarrolladores un potente marco para construir capacidades de búsqueda e investigación más sofisticadas. Sus principales ventajas técnicas son</p>
<ol>
<li><p>Razonamiento iterativo: La capacidad de desglosar consultas complejas en subpasos lógicos y avanzar progresivamente hacia respuestas completas.</p></li>
<li><p>Arquitectura flexible: Permite intercambiar los modelos subyacentes y personalizar el proceso de razonamiento para adaptarlo a las necesidades específicas de la aplicación.</p></li>
<li><p>Integración de bases de datos vectoriales: Conexión sin fisuras con Milvus para un almacenamiento y una recuperación eficaces de las incrustaciones vectoriales a partir de fuentes de datos privadas.</p></li>
<li><p>Ejecución transparente: Registro detallado de cada paso del razonamiento, lo que permite a los desarrolladores depurar y optimizar el comportamiento del sistema.</p></li>
</ol>
<p>Nuestras pruebas de rendimiento confirman que DeepSearcher ofrece resultados superiores para consultas complejas en comparación con los enfoques RAG tradicionales, aunque con claras compensaciones en la eficiencia computacional. La configuración óptima (normalmente en torno a 3 iteraciones) equilibra la precisión con el consumo de recursos.</p>
<p>A medida que los costes de LLM sigan disminuyendo y las capacidades de razonamiento mejoren, el enfoque RAG Agentic implementado en DeepSearcher será cada vez más práctico para las aplicaciones de producción. Para los desarrolladores que trabajan en la búsqueda empresarial, asistentes de investigación o sistemas de gestión del conocimiento, DeepSearcher ofrece una potente base de código abierto que se puede personalizar según los requisitos específicos del dominio.</p>
<p>Damos la bienvenida a las contribuciones de la comunidad de desarrolladores y le invitamos a explorar este nuevo paradigma en la implementación de RAG consultando nuestro <a href="https://github.com/zilliztech/deep-searcher">repositorio GitHub</a>.</p>
