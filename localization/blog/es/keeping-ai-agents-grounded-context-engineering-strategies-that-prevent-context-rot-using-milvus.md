---
id: >-
  keeping-ai-agents-grounded-context-engineering-strategies-that-prevent-context-rot-using-milvus.md
title: >-
  Mantener los agentes de IA en tierra: Estrategias de ingeniería del contexto
  que evitan que éste se pudra utilizando Milvus
author: Min Yin
date: 2025-12-23T00:00:00.000Z
cover: assets.zilliz.com/context_rot_cover_804387e7c9.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'context engineering, context rot, vector database, Milvus, vector search'
meta_title: |
  Context Engineering Strategies to Prevent LLM Context Rot with Milvus
desc: >-
  Descubra por qué el contexto se pudre en los flujos de trabajo LLM de larga
  duración y cómo la ingeniería del contexto, las estrategias de recuperación y
  la búsqueda vectorial de Milvus ayudan a mantener a los agentes de IA
  precisos, centrados y fiables en tareas complejas de varios pasos.
origin: >-
  https://milvus.io/blog/keeping-ai-agents-grounded-context-engineering-strategies-that-prevent-context-rot-using-milvus.md
---
<p>Si has trabajado con conversaciones de LLM de larga duración, probablemente hayas pasado por este frustrante momento: a mitad de un largo hilo, el modelo empieza a ir a la deriva. Las respuestas se vuelven vagas, el razonamiento se debilita y los detalles clave desaparecen misteriosamente. Pero si se le pide exactamente lo mismo en una nueva conversación, de repente el modelo se comporta de forma centrada, precisa y fundamentada.</p>
<p>No es que el modelo se esté "cansando", es que <strong>el contexto se está pudriendo</strong>. A medida que crece la conversación, el modelo tiene que hacer malabarismos con más información y su capacidad para establecer prioridades disminuye lentamente. <a href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents">Los estudios de Antropic</a> demuestran que cuando las ventanas de contexto pasan de unos 8.000 tokens a 128.000, la precisión de la recuperación puede caer entre un 15 y un 30%. El modelo aún tiene espacio, pero pierde de vista lo que importa. Las ventanas de contexto más grandes ayudan a retrasar el problema, pero no lo eliminan.</p>
<p>Aquí es donde entra en juego <strong>la ingeniería del contexto</strong>. En lugar de dárselo todo al modelo de una vez, le damos forma a lo que ve: recuperando sólo las partes que importan, comprimiendo lo que ya no necesita ser verboso y manteniendo los avisos y herramientas lo suficientemente limpios para que el modelo pueda razonar sobre ellos. El objetivo es sencillo: hacer que la información importante esté disponible en el momento adecuado e ignorar el resto.</p>
<p>La recuperación desempeña aquí un papel fundamental, sobre todo en el caso de los agentes de larga duración. Las bases de datos vectoriales como <a href="https://milvus.io/"><strong>Milvus</strong></a> proporcionan los cimientos para recuperar de forma eficiente los conocimientos relevantes en su contexto, lo que permite al sistema mantener los pies en la tierra incluso cuando las tareas crecen en profundidad y complejidad.</p>
<p>En este blog, veremos cómo se produce la rotación del contexto, las estrategias que utilizan los equipos para gestionarla y los patrones arquitectónicos -desde la recuperación hasta el diseño de avisos- que mantienen a los agentes de IA alerta a lo largo de flujos de trabajo largos y de varios pasos.</p>
<h2 id="Why-Context-Rot-Happens" class="common-anchor-header">Por qué se pierde el contexto<button data-href="#Why-Context-Rot-Happens" class="anchor-icon" translate="no">
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
    </button></h2><p>A menudo se asume que dar más contexto a un modelo de IA conduce de forma natural a mejores respuestas. Pero eso no es cierto. Los humanos también tenemos problemas con las entradas largas: la ciencia cognitiva sugiere que nuestra memoria de trabajo contiene aproximadamente <strong>7±2 trozos</strong> de información. Si vamos más allá, empezamos a olvidar, desdibujar o malinterpretar los detalles.</p>
<p>Los LLM muestran un comportamiento similar, pero a una escala mucho mayor y con modos de fallo más dramáticos.</p>
<p>El problema radica en la propia <a href="https://zilliz.com/learn/decoding-transformer-models-a-study-of-their-architecture-and-underlying-principles">arquitectura de Transformer</a>. Cada testigo debe compararse con todos los demás, formando pares de atención en toda la secuencia. Esto significa que el cálculo crece <strong>O(n²)</strong> con la longitud del contexto. Ampliar la solicitud de 1.000 fichas a 100.000 no hace que el modelo "trabaje más", sino que multiplica <strong>por 10.000 el</strong> número de interacciones entre fichas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/contextual_dilution_622033db72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Luego está el problema de los datos de entrenamiento.</strong> Los modelos ven muchas más secuencias cortas que largas. Cuando se pide a un LLM que trabaje en contextos muy amplios, se le empuja a un régimen para el que no ha sido entrenado. En la práctica, el razonamiento en contextos muy largos suele estar <strong>fuera de distribución</strong> para la mayoría de los modelos.</p>
<p>A pesar de estos límites, el contexto largo es ahora inevitable. Las primeras aplicaciones LLM consistían principalmente en tareas de un solo turno: clasificación, resumen o generación simple. Hoy en día, más del 70% de los sistemas empresariales de IA se basan en agentes que permanecen activos durante muchas rondas de interacción, a menudo durante horas, gestionando flujos de trabajo ramificados y de múltiples pasos. Las sesiones de larga duración han pasado de ser una excepción a convertirse en algo predeterminado.</p>
<p>Entonces, la siguiente pregunta es: <strong>¿cómo mantenemos la atención del modelo sin abrumarlo?</strong></p>
<h2 id="Context-Retrieval-Approaches-to-Solving-Context-Rot" class="common-anchor-header">Enfoques de recuperación del contexto para resolver la putrefacción del contexto<button data-href="#Context-Retrieval-Approaches-to-Solving-Context-Rot" class="anchor-icon" translate="no">
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
    </button></h2><p>La recuperación es una de las palancas más eficaces que tenemos para combatir la putrefacción del contexto, y en la práctica tiende a aparecer en modelos complementarios que abordan la putrefacción del contexto desde distintos ángulos.</p>
<h3 id="1-Just-in-Time-Retrieval-Reducing-Unnecessary-Context" class="common-anchor-header">1. Recuperación "justo a tiempo": Reducción del contexto innecesario</h3><p>Una de las principales causas de la descomposición del contexto es <em>sobrecargar</em> el modelo con información que aún no necesita. Claude Code -el asistente de codificación de Anthropic- resuelve este problema con la <strong>recuperación Just-in-Time (JIT</strong>), una estrategia en la que el modelo obtiene información sólo cuando es relevante.</p>
<p>En lugar de almacenar bases de código o conjuntos de datos enteros en su contexto (lo que aumenta enormemente la probabilidad de deriva y olvido), Claude Code mantiene un pequeño índice: rutas de archivos, comandos y enlaces a documentación. Cuando el modelo necesita un elemento de información, lo recupera y lo inserta en el contexto <strong>en el</strong>momento <strong>en que importa, no</strong>antes.</p>
<p>Por ejemplo, si le pide a Claude Code que analice una base de datos de 10 GB, nunca intenta cargarla entera. Trabaja más como un ingeniero:</p>
<ol>
<li><p>Ejecuta una consulta SQL para obtener resúmenes de alto nivel del conjunto de datos.</p></li>
<li><p>Utiliza comandos como <code translate="no">head</code> y <code translate="no">tail</code> para ver datos de muestra y comprender su estructura.</p></li>
<li><p>Conserva sólo la información más importante -como estadísticas clave o filas de muestra- dentro del contexto.</p></li>
</ol>
<p>Al minimizar lo que se guarda en el contexto, la recuperación JIT evita la acumulación de tokens irrelevantes que provocan la putrefacción. El modelo se mantiene centrado porque sólo ve la información necesaria para el paso de razonamiento actual.</p>
<h3 id="2-Pre-retrieval-Vector-Search-Preventing-Context-Drift-Before-It-Starts" class="common-anchor-header">2. Pre-recuperación (búsqueda vectorial): Evitar la deriva del contexto antes de que empiece</h3><p>A veces, el modelo no puede "pedir" información de forma dinámica: los sistemas de atención al cliente, de preguntas y respuestas y los flujos de trabajo de los agentes a menudo necesitan disponer de los conocimientos adecuados <em>antes de que</em> comience la generación. Aquí es donde <strong>la recuperación previa</strong> es fundamental.</p>
<p>La pérdida de contexto suele deberse a que el modelo recibe una gran pila de texto sin procesar y se espera que clasifique lo que importa. La recuperación previa invierte esta situación: una base de datos vectorial (como <a href="https://milvus.io/">Milvus</a> y <a href="https://zilliz.com/cloud">Zilliz Cloud</a>) identifica las piezas más relevantes <em>antes de</em> la inferencia, garantizando que sólo el contexto de alto valor llega al modelo.</p>
<p>En una configuración RAG típica</p>
<ul>
<li><p>Los documentos se incrustan y almacenan en una base de datos vectorial, como Milvus.</p></li>
<li><p>En el momento de la consulta, el sistema recupera un pequeño conjunto de fragmentos muy relevantes mediante búsquedas de similitud.</p></li>
<li><p>Sólo esos fragmentos entran en el contexto del modelo.</p></li>
</ul>
<p>De este modo se evita la putrefacción de dos maneras:</p>
<ul>
<li><p><strong>Reducción del ruido:</strong> el texto irrelevante o poco relacionado nunca entra en el contexto.</p></li>
<li><p><strong>Eficacia:</strong> los modelos procesan muchos menos tokens, lo que reduce la posibilidad de perder de vista detalles esenciales.</p></li>
</ul>
<p>Milvus puede buscar millones de documentos en milisegundos, lo que hace que este enfoque sea ideal para sistemas en vivo en los que la latencia importa.</p>
<h3 id="3-Hybrid-JIT-and-Vector-Retrieval" class="common-anchor-header">3. Recuperación vectorial y JIT híbrida</h3><p>La recuperación previa basada en la búsqueda vectorial aborda una parte importante de la pérdida de contexto al garantizar que el modelo comience con información de alta señal en lugar de con texto sin procesar y sobredimensionado. Pero Anthropic pone de relieve dos retos reales que los equipos suelen pasar por alto:</p>
<ul>
<li><p><strong>La puntualidad:</strong> Si la base de conocimientos se actualiza más rápido de lo que se reconstruye el índice vectorial, el modelo puede basarse en información obsoleta.</p></li>
<li><p><strong>Precisión:</strong> antes de que comience una tarea, es difícil predecir con exactitud lo que necesitará el modelo, especialmente en el caso de flujos de trabajo exploratorios o de varios pasos.</p></li>
</ul>
<p>Por ello, en las cargas de trabajo del mundo real, la solución óptima es un appaorch híbrido.</p>
<ul>
<li><p>Búsqueda vectorial de conocimientos estables y de alta confianza</p></li>
<li><p>Exploración JIT dirigida por agentes para información que evoluciona o que sólo se vuelve relevante a mitad de la tarea</p></li>
</ul>
<p>Al combinar estos dos enfoques, se obtiene la velocidad y eficacia de la recuperación vectorial para la información conocida, y la flexibilidad para que el modelo descubra y cargue nuevos datos siempre que sean relevantes.</p>
<p>Veamos cómo funciona esto en un sistema real. Tomemos como ejemplo un asistente de documentación de producción. La mayoría de los equipos se deciden finalmente por un proceso en dos etapas: Búsqueda vectorial impulsada por Milvus + recuperación JIT basada en agentes.</p>
<p><strong>1. Búsqueda vectorial con Milvus (Pre-recuperación)</strong></p>
<ul>
<li><p>Convierta su documentación, referencias API, registros de cambios y problemas conocidos en incrustaciones.</p></li>
<li><p>Almacénelos en la base de datos vectorial de Milvus con metadatos como el área del producto, la versión y la hora de actualización.</p></li>
<li><p>Cuando un usuario formule una pregunta, ejecute una búsqueda semántica para obtener los K segmentos más relevantes.</p></li>
</ul>
<p>Esto resuelve aproximadamente el 80% de las consultas rutinarias en menos de 500 ms, lo que proporciona al modelo un punto de partida sólido y resistente al contexto.</p>
<p><strong>2. Exploración basada en agentes</strong></p>
<p>Cuando la recuperación inicial no es suficiente (por ejemplo, cuando el usuario pide algo muy específico o urgente), el agente puede recurrir a herramientas para obtener nueva información:</p>
<ul>
<li><p>Utilice <code translate="no">search_code</code> para localizar funciones o archivos específicos en el código base.</p></li>
<li><p>Utilizar <code translate="no">run_query</code> para obtener datos en tiempo real de la base de datos.</p></li>
<li><p>Utilice <code translate="no">fetch_api</code> para obtener el estado más reciente del sistema</p></li>
</ul>
<p>Estas llamadas suelen tardar <strong>entre 3 y 5 segundos</strong>, pero garantizan que el modelo funcione siempre con datos actualizados, precisos y relevantes, incluso para cuestiones que el sistema no podía prever de antemano.</p>
<p>Esta estructura híbrida garantiza que el contexto siga siendo oportuno, correcto y específico de la tarea, lo que reduce drásticamente el riesgo de que se pierda el contexto en los flujos de trabajo de agentes de larga duración.</p>
<p>Milvus es especialmente eficaz en estos escenarios híbridos porque admite:</p>
<ul>
<li><p><strong>Búsqueda vectorial + filtrado escalar</strong>, que combina la relevancia semántica con restricciones estructuradas.</p></li>
<li><p><strong>Actualizaciones incrementales</strong>, que permiten refrescar las incrustaciones sin tiempo de inactividad.</p></li>
</ul>
<p>Esto convierte a Milvus en una columna vertebral ideal para los sistemas que necesitan tanto comprensión semántica como control preciso sobre lo que se recupera.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_in_hybrid_architecture_7d4e391aa4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Por ejemplo, puede ejecutar una consulta del tipo:</p>
<pre><code translate="no"><span class="hljs-comment"># You can combine queries like this in Milvus</span>
collection.search(
    data=[query_embedding],  <span class="hljs-comment"># Semantic similarity</span>
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    expr=<span class="hljs-string">&quot;doc_type == &#x27;API&#x27; and update_time &gt; &#x27;2025-01-01&#x27;&quot;</span>,  <span class="hljs-comment"># Structured filtering</span>
    limit=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Choose-the-Right-Approach-for-Dealing-With-Context-Rot" class="common-anchor-header">Cómo elegir el enfoque adecuado para tratar la putrefacción del contexto<button data-href="#How-to-Choose-the-Right-Approach-for-Dealing-With-Context-Rot" class="anchor-icon" translate="no">
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
    </button></h2><p>Con la recuperación previa de búsqueda vectorial, la recuperación "Just-in-Time" y la recuperación híbrida, la pregunta natural es: <strong>¿cuál debería utilizar?</strong></p>
<p>He aquí una forma sencilla pero práctica de elegir en función de la <em>estabilidad de</em> sus conocimientos y de la <em>previsibilidad de</em> las necesidades de información del modelo.</p>
<h3 id="1-Vector-Search-→-Best-for-Stable-Domains" class="common-anchor-header">1. Búsqueda vectorial → Mejor para dominios estables</h3><p>Si el dominio cambia lentamente pero exige precisión-finanzas, trabajo legal, cumplimiento, documentación médica-entonces una base de conocimiento impulsada por Milvus con <strong>pre-recuperación</strong> suele ser la adecuada.</p>
<p>La información está bien definida, las actualizaciones son poco frecuentes y la mayoría de las preguntas pueden responderse recuperando documentos semánticamente relevantes por adelantado.</p>
<p><strong>Tareas predecibles + conocimiento estable → Pre-recuperación.</strong></p>
<h3 id="2-Just-in-Time-Retrieval-→-Best-for-Dynamic-Exploratory-Workflows" class="common-anchor-header">2. Mejor para flujos de trabajo dinámicos y exploratorios.</h3><p>Campos como la ingeniería de software, la depuración, la analítica y la ciencia de datos implican entornos que cambian rápidamente: nuevos archivos, nuevos datos, nuevos estados de despliegue. El modelo no puede predecir lo que necesitará antes de que comience la tarea.</p>
<p><strong>Tareas impredecibles + conocimientos que cambian rápidamente → Recuperación justo a tiempo.</strong></p>
<h3 id="3-Hybrid-Approach-→-When-Both-Conditions-Are-True" class="common-anchor-header">3. Enfoque híbrido → Cuando se cumplen ambas condiciones</h3><p>Muchos sistemas reales no son puramente estables ni puramente dinámicos. Por ejemplo, la documentación de los desarrolladores cambia lentamente, mientras que el estado de un entorno de producción cambia minuto a minuto. Un enfoque híbrido le permite:</p>
<ul>
<li><p>Cargar conocimientos conocidos y estables mediante la búsqueda vectorial (rápida y de baja latencia).</p></li>
<li><p>Obtener información dinámica con herramientas de agente bajo demanda (precisa, actualizada)</p></li>
</ul>
<p><strong>Conocimiento mixto + estructura de tareas mixta → Enfoque de recuperación híbrido.</strong></p>
<h2 id="What-if-the-Context-Window-Still-Isn’t-Enough" class="common-anchor-header">¿Y si la ventana de contexto no es suficiente?<button data-href="#What-if-the-Context-Window-Still-Isn’t-Enough" class="anchor-icon" translate="no">
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
    </button></h2><p>La ingeniería del contexto ayuda a reducir la sobrecarga, pero a veces el problema es más fundamental: <strong>la tarea simplemente no cabe</strong>, incluso con un recorte cuidadoso.</p>
<p>Algunos flujos de trabajo, como la migración de una base de código de gran tamaño, la revisión de arquitecturas de múltiples repositorios o la generación de informes de investigación exhaustivos, pueden superar los 200.000 ventanas de contexto antes de que el modelo llegue al final de la tarea. Incluso con la búsqueda vectorial haciendo el trabajo pesado, algunas tareas requieren una memoria más persistente y estructurada.</p>
<p>Recientemente, Anthropic ha ofrecido tres estrategias prácticas.</p>
<h3 id="1-Compression-Preserve-Signal-Drop-Noise" class="common-anchor-header">1. 1. Compresión: Preservar la señal, eliminar el ruido</h3><p>Cuando la ventana de contexto se acerca a su límite, el modelo puede <strong>comprimir las interacciones anteriores</strong> en resúmenes concisos. Una buena compresión mantiene</p>
<ul>
<li><p>Decisiones clave</p></li>
<li><p>Restricciones y requisitos</p></li>
<li><p>Cuestiones pendientes</p></li>
<li><p>Muestras o ejemplos relevantes</p></li>
</ul>
<p>Y elimina</p>
<ul>
<li><p>Salidas verbosas de la herramienta</p></li>
<li><p>Registros irrelevantes</p></li>
<li><p>Pasos redundantes</p></li>
</ul>
<p>El reto es el equilibrio. Si se comprime demasiado, el modelo pierde información crítica; si se comprime demasiado poco, se gana poco espacio. Una compresión eficaz conserva el "por qué" y el "qué", pero descarta el "cómo hemos llegado hasta aquí".</p>
<h3 id="2-Structured-Note-Taking-Move-Stable-Information-Outside-Context" class="common-anchor-header">2. Toma de notas estructurada: Mover la información estable fuera del contexto</h3><p>En lugar de guardarlo todo dentro de la ventana del modelo, el sistema puede almacenar los hechos importantes en <strong>una memoria externa:</strong>una base de datos independiente o un almacén estructurado que el agente pueda consultar cuando lo necesite.</p>
<p>Por ejemplo, el prototipo de agente Pokémon de Claude almacena datos duraderos como:</p>
<ul>
<li><p><code translate="no">Pikachu leveled up to 8</code></p></li>
<li><p><code translate="no">Trained 1234 steps on Route 1</code></p></li>
<li><p><code translate="no">Goal: reach level 10</code></p></li>
</ul>
<p>Mientras tanto, los detalles transitorios -registros de batalla, resultados de herramientas largas- permanecen fuera del contexto activo. Esto refleja la forma en que los humanos utilizamos los cuadernos: no guardamos todos los detalles en nuestra memoria de trabajo, sino que almacenamos puntos de referencia externos y los consultamos cuando los necesitamos.</p>
<p>La toma de notas estructurada evita la pérdida de contexto provocada por la repetición de detalles innecesarios, al tiempo que proporciona al modelo una fuente fiable de verdad.</p>
<h3 id="3-Sub-Agent-Architecture-Divide-and-Conquer-Large-Tasks" class="common-anchor-header">3. Arquitectura de subagentes: Dividir y conquistar grandes tareas</h3><p>Para tareas complejas, puede diseñarse una arquitectura multiagente en la que un agente principal supervise el trabajo global, mientras varios subagentes especializados se encargan de aspectos específicos de la tarea. Estos subagentes profundizan en grandes cantidades de datos relacionados con sus subtareas, pero sólo devuelven los resultados concisos y esenciales. Este enfoque suele utilizarse en situaciones como informes de investigación o análisis de datos.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/longduration_task_cbbc07b9ca.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>En la práctica, lo mejor es empezar utilizando un único agente combinado con compresión para gestionar la tarea. El almacenamiento externo sólo debe introducirse cuando exista la necesidad de conservar la memoria a lo largo de las sesiones. La arquitectura multiagente debe reservarse para tareas que realmente requieran el procesamiento paralelo de subtareas complejas y especializadas.</p>
<p>Cada uno de estos enfoques amplía la "memoria de trabajo" efectiva del sistema sin reventar la ventana de contexto y sin provocar la rotación del contexto.</p>
<h2 id="Best-Practices-for-Designing-Context-That-Actually-Works" class="common-anchor-header">Mejores prácticas para diseñar un contexto que realmente funcione<button data-href="#Best-Practices-for-Designing-Context-That-Actually-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Después de gestionar el desbordamiento del contexto, hay otra pieza igualmente importante: cómo se construye el contexto en primer lugar. Incluso con compresión, notas externas y subagentes, el sistema tendrá problemas si las instrucciones y las herramientas no están diseñadas para soportar razonamientos largos y complejos.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/System_Prompts_cf655dcd0d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Anthropic ofrece una manera útil de pensar en esto, menos como un solo ejercicio de escritura, y más como la construcción de contexto a través de tres capas.</p>
<h3 id="System-Prompts-Find-the-Goldilocks-Zone" class="common-anchor-header"><strong>Sistema de estímulos: Encontrar la zona Goldilocks</strong></h3><p>La mayoría de las instrucciones sobre sistemas fracasan en los extremos. Demasiados detalles (listas de reglas, condiciones anidadas, excepciones codificadas) hacen que el aviso sea frágil y difícil de mantener. Demasiada poca estructura deja al modelo adivinando qué hacer.</p>
<p>Las mejores instrucciones se sitúan en un término medio: lo suficientemente estructuradas como para guiar el comportamiento y lo suficientemente flexibles como para que el modelo pueda razonar. En la práctica, esto significa dar al modelo un papel claro, un flujo de trabajo general y una ligera guía de herramientas, ni más ni menos.</p>
<p>Por ejemplo:</p>
<pre><code translate="no">You are a technical documentation assistant serving developers.
<span class="hljs-number">1.</span> Start <span class="hljs-keyword">by</span> retrieving relevant documents <span class="hljs-keyword">from</span> the Milvus knowledge <span class="hljs-keyword">base</span>.  
<span class="hljs-number">2.</span> If the retrieval results are insufficient, use the `search_code` tool to perform a deeper search <span class="hljs-keyword">in</span> the codebase.  
<span class="hljs-number">3.</span> When answering, cite specific documentation sections <span class="hljs-keyword">or</span> code line numbers.

<span class="hljs-meta">## Tool guidance</span>
- search_docs: Used <span class="hljs-keyword">for</span> semantic retrieval, best <span class="hljs-keyword">for</span> conceptual questions.  
- search_code: Used <span class="hljs-keyword">for</span> precise lookup <span class="hljs-keyword">in</span> the codebase, best <span class="hljs-keyword">for</span> implementation-detail questions.  
…
<button class="copy-code-btn"></button></code></pre>
<p>Este aviso marca la dirección sin abrumar al modelo ni obligarle a hacer malabarismos con información dinámica que no corresponde.</p>
<h3 id="Tool-Design-Less-Is-More" class="common-anchor-header">Diseño de herramientas: Menos es más</h3><p>Una vez que el sistema establece el comportamiento de alto nivel, las herramientas se encargan de la lógica operativa real. Un modo de fallo sorprendentemente común en los sistemas aumentados por herramientas es simplemente tener demasiadas herramientas, o tener herramientas cuyos propósitos se solapan.</p>
<p>Una buena regla general</p>
<ul>
<li><p><strong>Una herramienta, un propósito</strong></p></li>
<li><p><strong>Parámetros explícitos e inequívocos</strong></p></li>
<li><p><strong>Sin solapamiento de responsabilidades</strong></p></li>
</ul>
<p>Si un ingeniero humano dudara sobre qué herramienta utilizar, el modelo también lo haría. Un diseño limpio de las herramientas reduce la ambigüedad, disminuye la carga cognitiva y evita que el contexto se sature con intentos innecesarios de utilizar herramientas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/tooling_complexity_7d2bb60c54.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Dynamic-Information-Should-Be-Retrieved-Not-Hardcoded" class="common-anchor-header">La información dinámica debe recuperarse, no codificarse</h3><p>La última capa es la más fácil de pasar por alto. La información dinámica o sensible al tiempo, como los valores de estado, las actualizaciones recientes o el estado específico del usuario, no debe aparecer en absoluto en el indicador del sistema. Incluirla en el prompt garantiza que se volverá obsoleta, hinchada o contradictoria en tareas largas.</p>
<p>En su lugar, esta información debe obtenerse sólo cuando sea necesario, ya sea a través de la recuperación o a través de herramientas de agente. Mantener el contenido dinámico fuera del sistema evita que se pierda el contexto y mantiene limpio el espacio de razonamiento del modelo.</p>
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
    </button></h2><p>A medida que los agentes de IA se introducen en los entornos de producción de distintos sectores, asumen flujos de trabajo más largos y tareas más complejas que nunca. En estos entornos, la gestión del contexto se convierte en una necesidad práctica.</p>
<p><strong>Sin embargo, una ventana de contexto más grande no produce automáticamente mejores resultados</strong>; en muchos casos, hace lo contrario. Cuando se sobrecarga un modelo, se le proporciona información obsoleta o se le obliga a responder a preguntas masivas, la precisión disminuye silenciosamente. Ese lento y sutil declive es lo que ahora llamamos <strong>"putrefacción del contexto"</strong>.</p>
<p>Técnicas como la recuperación JIT, la recuperación previa, los conductos híbridos y la búsqueda semántica basada en bases de datos vectoriales persiguen el mismo objetivo: <strong>garantizar que el modelo vea la información correcta en el momento adecuado, ni más ni menos, para que pueda mantener los pies en la tierra y producir respuestas fiables.</strong></p>
<p>Como base de datos vectorial de alto rendimiento y código abierto, <a href="https://milvus.io/"><strong>Milvus</strong></a> se sitúa en el núcleo de este flujo de trabajo. Proporciona la infraestructura necesaria para almacenar los conocimientos de forma eficiente y recuperar las piezas más relevantes con baja latencia. Junto con la recuperación JIT y otras estrategias complementarias, Milvus ayuda a los agentes de IA a mantener la precisión a medida que sus tareas se hacen más profundas y dinámicas.</p>
<p>Pero la recuperación es sólo una pieza del rompecabezas. Un buen diseño de las instrucciones, un conjunto de herramientas limpias y mínimas, y unas estrategias de desbordamiento sensatas -ya sea compresión, notas estructuradas o subagentes- trabajan conjuntamente para mantener el modelo centrado en sesiones de larga duración. Así es la verdadera ingeniería contextual: no se trata de ingeniosos hacks, sino de una arquitectura bien pensada.</p>
<p>Si desea que los agentes de IA sean precisos durante horas, días o flujos de trabajo completos, el contexto merece la misma atención que prestaría a cualquier otra parte fundamental de su pila.</p>
<p>¿Tienes preguntas o quieres que profundicemos en alguna función? Únete a nuestro<a href="https://discord.com/invite/8uyFbECzPX"> canal de Discord</a> o presenta incidencias en<a href="https://github.com/milvus-io/milvus"> GitHub</a>. También puede reservar una sesión individual de 20 minutos para obtener información, orientación y respuestas a sus preguntas a través de<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
