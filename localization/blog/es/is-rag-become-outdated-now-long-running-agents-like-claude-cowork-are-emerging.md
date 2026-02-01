---
id: >-
  is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md
title: >-
  ¿Se está quedando anticuada la RAG ahora que surgen agentes de largo recorrido
  como Claude Cowork?
author: Min Yin
date: 2026-1-27
desc: >-
  Un análisis en profundidad de la memoria a largo plazo de Claude Cowork, la
  memoria de agente escribible, las compensaciones RAG y por qué las bases de
  datos vectoriales siguen siendo importantes.
cover: assets.zilliz.com/RAG_vs_Long_Running_Agents_fc67810cf8.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, claude, RAG'
meta_keywords: >-
  Claude Cowork long-term memory, RAG vs Claude Cowork, vector databases for AI
  agents
meta_title: |
  RAG vs Long-Running Agents: Is RAG Obsolete? 
origin: >-
  https://milvus.io/blog/is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md
---
<p><a href="https://support.claude.com/en/articles/13345190-getting-started-with-cowork">Claude Cowork</a> es un nuevo agente de la aplicación Claude Desktop. Desde el punto de vista de un desarrollador, es básicamente un ejecutor de tareas automatizado envuelto alrededor del modelo: puede leer, modificar y generar archivos locales, y puede planificar tareas de múltiples pasos sin que tengas que preguntar manualmente por cada paso. Piense en ello como el mismo bucle detrás de Claude Code, pero expuesto al escritorio en lugar de a la terminal.</p>
<p>La capacidad clave de Cowork es su capacidad para funcionar durante períodos prolongados sin perder el estado. No sufre los habituales tiempos de espera de conversación o reinicio de contexto. Puede seguir trabajando, rastrear resultados intermedios y reutilizar información previa en distintas sesiones. Esto da la impresión de ser una "memoria a largo plazo", aunque la mecánica subyacente se parezca más a un estado de tarea persistente + transferencia contextual. En cualquier caso, la experiencia es diferente del modelo de chat tradicional, en el que todo se reinicia a menos que construyas tu propia capa de memoria.</p>
<p>Esto plantea dos cuestiones prácticas para los desarrolladores:</p>
<ol>
<li><p><strong>Si el modelo ya puede recordar información pasada, ¿dónde encaja la RAG o la RAG agéntica? ¿Se sustituirá la GAR?</strong></p></li>
<li><p><strong>Si queremos un agente local, al estilo Cowork, ¿cómo implementamos nosotros mismos la memoria a largo plazo?</strong></p></li>
</ol>
<p>El resto de este artículo aborda estas cuestiones en detalle y explica cómo encajan las bases de datos vectoriales en este nuevo panorama de "memoria modelo".</p>
<h2 id="Claude-Cowork-vs-RAG-What’s-the-Difference" class="common-anchor-header">Claude Cowork vs. RAG: ¿Cuál es la diferencia?<button data-href="#Claude-Cowork-vs-RAG-What’s-the-Difference" class="anchor-icon" translate="no">
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
    </button></h2><p>Como he mencionado anteriormente, Claude Cowork es un modo agente dentro de Claude Desktop que puede leer y escribir archivos locales, dividir tareas en pasos más pequeños y seguir trabajando sin perder el estado. Mantiene su propio contexto de trabajo, por lo que las tareas de varias horas no se reinician como una sesión de chat normal.</p>
<p><strong>RAG</strong> (Retrieval-Augmented Generation) resuelve un problema diferente: dar a un modelo acceso a conocimientos externos. Se indexan los datos en una base vectorial, se recuperan los fragmentos relevantes para cada consulta y se introducen en el modelo. Se utiliza mucho porque proporciona a las aplicaciones LLM una forma de "memoria a largo plazo" para documentos, registros, datos de productos y mucho más.</p>
<p>Si ambos sistemas ayudan a un modelo a "recordar", ¿cuál es la diferencia real?</p>
<h3 id="How-Cowork-Handles-Memory" class="common-anchor-header">Cómo gestiona Cowork la memoria</h3><p>La memoria de Cowork es de lectura-escritura. El agente decide qué información de la tarea o conversación actual es relevante, la almacena como entradas de memoria y la recupera más tarde a medida que avanza la tarea. Esto permite a Cowork mantener la continuidad a través de flujos de trabajo de larga duración - especialmente aquellos que producen nuevos estados intermedios a medida que avanzan.</p>
<h3 id="How-RAG-and-Agentic-RAG-Handle-Memory" class="common-anchor-header">Cómo gestionan la memoria RAG y Agentic RAG</h3><p>La RAG estándar es una recuperación basada en consultas: el usuario pregunta algo, el sistema obtiene los documentos relevantes y el modelo los utiliza para responder. El corpus de recuperación permanece estable y versionado, y los desarrolladores controlan exactamente lo que entra en él.</p>
<p>La RAG moderna amplía este modelo. El modelo puede decidir cuándo recuperar información, qué recuperar y cómo utilizarla durante la planificación o ejecución de un flujo de trabajo. Estos sistemas pueden ejecutar tareas largas y llamar a herramientas, de forma similar a Cowork. Pero incluso con el GAR agéntico, la capa de recuperación sigue estando más orientada al conocimiento que al estado. El agente recupera hechos fidedignos, no escribe en el corpus el estado evolutivo de su tarea.</p>
<p>Otra forma de verlo:</p>
<ul>
<li><p><strong>La memoria de Cowork está orientada a tareas:</strong> el agente escribe y lee su propio estado evolutivo.</p></li>
<li><p><strong>La RAG se basa en el conocimiento:</strong> el sistema recupera información establecida en la que debe basarse el modelo.</p></li>
</ul>
<h2 id="Reverse-Engineering-Claude-Cowork-How-It-Builds-Long-Running-Agent-Memory" class="common-anchor-header">Claude Cowork: ingeniería inversa: Cómo construye una memoria de agente de larga duración<button data-href="#Reverse-Engineering-Claude-Cowork-How-It-Builds-Long-Running-Agent-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>A Cowork se le da mucho bombo porque maneja tareas de varios pasos sin olvidar constantemente lo que estaba haciendo. Desde la perspectiva de un desarrollador, me pregunto <strong>cómo mantiene el estado a través de sesiones tan largas.</strong> Anthropic no ha publicado la información interna, pero basándonos en experimentos anteriores con el módulo de memoria de Claude, podemos elaborar un modelo mental decente.</p>
<p>Claude parece confiar en una configuración híbrida: <strong>una capa de memoria persistente a largo plazo más herramientas de recuperación bajo demanda.</strong> En lugar de incluir toda la conversación en cada petición, Claude recupera selectivamente el contexto pasado sólo cuando decide que es relevante. De este modo, el modelo mantiene un alto nivel de precisión sin gastar fichas en cada turno.</p>
<p>Si desglosas la estructura de la petición, es más o menos así:</p>
<pre><code translate="no">[<span class="hljs-meta">0</span>] Static system instructions
[<span class="hljs-meta">1</span>] <span class="hljs-function">User <span class="hljs-title">memory</span> (<span class="hljs-params"><span class="hljs-built_in">long</span>-term</span>)
[2] Retrieved / pruned conversation history
[3] Current user message
</span><button class="copy-code-btn"></button></code></pre>
<p>El comportamiento interesante no es la estructura en sí, sino cómo el modelo decide qué actualizar y cuándo ejecutar la recuperación.</p>
<h3 id="User-Memory-The-Persistent-Layer" class="common-anchor-header">Memoria de usuario: La capa persistente</h3><p>Claude mantiene un almacén de memoria a largo plazo que se actualiza con el tiempo. Y a diferencia del sistema de memoria más predecible de ChatGPT, el de Claude se siente un poco más "vivo". Almacena las memorias en bloques tipo XML y las actualiza de dos maneras:</p>
<ul>
<li><p><strong>Actualizaciones implícitas:</strong> A veces el modelo simplemente decide que algo es una preferencia o un hecho estable y lo escribe tranquilamente en la memoria. Estas actualizaciones no son instantáneas; aparecen al cabo de unos turnos, y los recuerdos más antiguos pueden desvanecerse si desaparece la conversación relacionada.</p></li>
<li><p><strong>Actualizaciones explícitas:</strong> Los usuarios pueden modificar directamente la memoria con la herramienta <code translate="no">memory_user_edits</code> ("recuerda X", "olvida Y"). Estas escrituras son inmediatas y se comportan más como una operación CRUD.</p></li>
</ul>
<p>Claude ejecuta una heurística en segundo plano para decidir qué vale la pena persistir, y no espera instrucciones explícitas.</p>
<h3 id="Conversation-Retrieval-The-On-Demand-Part" class="common-anchor-header">Recuperación de conversaciones: La parte bajo demanda</h3><p>Claude <em>no</em> mantiene un resumen continuo como muchos sistemas LLM. En su lugar, dispone de una caja de herramientas de funciones de recuperación a las que puede recurrir cuando cree que le falta contexto. Estas llamadas no se producen en cada turno, sino que el modelo las activa en función de su propio criterio interno.</p>
<p>La más destacada es <code translate="no">conversation_search</code>. Cuando el usuario dice algo tan vago como "ese proyecto del mes pasado", Claude suele activar esta herramienta para buscar los turnos pertinentes. Lo notable es que sigue funcionando cuando la frase es ambigua o está en otro idioma. Eso implica claramente</p>
<ul>
<li><p>Algún tipo de concordancia semántica (embeddings)</p></li>
<li><p>Probablemente combinado con normalización o traducción ligera.</p></li>
<li><p>Búsqueda de palabras clave para mayor precisión.</p></li>
</ul>
<p>Básicamente, esto se parece mucho a un sistema RAG en miniatura integrado en el conjunto de herramientas del modelo.</p>
<h3 id="How-Claude’s-Retrieval-Behavior-Differs-From-Basic-History-Buffers" class="common-anchor-header">Diferencias entre el comportamiento de recuperación de Claude y los búferes de historial básicos</h3><p>A partir de las pruebas y los registros, destacan algunos patrones:</p>
<ul>
<li><p><strong>La recuperación no es automática.</strong> El modelo elige cuándo llamarla. Si cree que ya tiene suficiente contexto, ni siquiera se molesta.</p></li>
<li><p><strong>Los fragmentos recuperados incluyen</strong> <strong>mensajes tanto del usuario como del asistente.</strong> Esto es útil, ya que conserva más matices que los resúmenes sólo del usuario.</p></li>
<li><p><strong>El uso de tokens es razonable.</strong> Como el historial no se inyecta en cada turno, las sesiones largas no se disparan de forma impredecible.</p></li>
</ul>
<p>En general, se siente como un LLM de recuperación aumentada, excepto que la recuperación se produce como parte del propio bucle de razonamiento del modelo.</p>
<p>Esta arquitectura es inteligente, pero no gratuita:</p>
<ul>
<li><p>La recuperación añade latencia y más "partes móviles" (indexación, clasificación, reclasificación).</p></li>
<li><p>En ocasiones, el modelo se equivoca al juzgar si necesita contexto, lo que se traduce en el clásico "olvido LLM", aunque los datos <em>estuvieran</em> disponibles.</p></li>
<li><p>La depuración se vuelve más complicada porque el comportamiento del modelo depende de disparadores invisibles de la herramienta, no sólo de la entrada de datos.</p></li>
</ul>
<h3 id="Claude-Cowork-vs-Claude-Codex-in-handling-long-term-memory" class="common-anchor-header">Claude Cowork frente a Claude Codex en el manejo de la memoria a largo plazo</h3><p>En contraste con la configuración de recuperación de Claude, ChatGPT maneja la memoria de una manera mucho más estructurada y predecible. En lugar de realizar búsquedas semánticas o tratar las conversaciones antiguas como un mini almacén vectorial, ChatGPT inyecta memoria directamente en cada sesión a través de los siguientes componentes estratificados:</p>
<ul>
<li><p>Memoria de usuario</p></li>
<li><p>Metadatos de sesión</p></li>
<li><p>Mensajes de la sesión actual</p></li>
</ul>
<p><strong>Memoria de usuario</strong></p>
<p>La Memoria de Usuario es la principal capa de almacenamiento a largo plazo, la parte que persiste a través de las sesiones y que puede ser editada por el usuario. Almacena cosas bastante estándar: nombre, antecedentes, proyectos en curso, preferencias de aprendizaje, ese tipo de cosas. A cada nueva conversación se le inyecta este bloque al principio, de modo que el modelo siempre comienza con una visión coherente del usuario.</p>
<p>ChatGPT actualiza esta capa de dos maneras:</p>
<ul>
<li><p><strong>Actualizaciones explícitas:</strong> Los usuarios pueden decirle al modelo "recuerda esto" u "olvida aquello", y la memoria cambia inmediatamente. Se trata básicamente de una API CRUD que el modelo expone a través del lenguaje natural.</p></li>
<li><p><strong>Actualizaciones implícitas:</strong> Si el modelo detecta información que se ajusta a las reglas de OpenAI para la memoria a largo plazo -como un puesto de trabajo o una preferencia- y el usuario no ha desactivado la memoria, la añadirá discretamente por su cuenta.</p></li>
</ul>
<p>Desde el punto de vista del desarrollador, esta capa es sencilla, determinista y fácil de razonar. Sin búsquedas incrustadas, sin heurística sobre qué obtener.</p>
<p><strong>Metadatos de sesión</strong></p>
<p>Los metadatos de sesión se sitúan en el extremo opuesto del espectro. Son efímeros, no persistentes y sólo se inyectan una vez al inicio de la sesión. Piense en ellos como variables de entorno para la conversación. Esto incluye cosas como</p>
<ul>
<li><p>en qué dispositivo estás</p></li>
<li><p>estado de la cuenta/suscripción</p></li>
<li><p>patrones de uso aproximados (días activos, distribución del modelo, duración media de la conversación)</p></li>
</ul>
<p>Estos metadatos ayudan al modelo a dar forma a las respuestas para el entorno actual -por ejemplo, escribir respuestas más cortas en el móvil- sin contaminar la memoria a largo plazo.</p>
<p><strong>Mensajes de la sesión actual</strong></p>
<p>Se trata del historial estándar de ventana deslizante: todos los mensajes de la conversación actual hasta que se alcanza el límite de tokens. Cuando la ventana se hace demasiado grande, los turnos más antiguos se desalojan automáticamente.</p>
<p>Crucialmente, este desalojo <strong>no</strong> toca la Memoria de Usuario ni los resúmenes entre sesiones. Sólo se reduce el historial local de la conversación.</p>
<p>La mayor divergencia con Claude aparece en cómo ChatGPT maneja las conversaciones "recientes pero no actuales". Claude llamará a una herramienta de búsqueda para recuperar el contexto pasado si cree que es relevante. ChatGPT no hace eso.</p>
<p>En su lugar, ChatGPT mantiene un <strong>resumen</strong> muy ligero <strong>entre sesiones</strong> que se inyecta en cada conversación. Algunos detalles clave sobre esta capa:</p>
<ul>
<li><p>Resume <strong>sólo los mensajes del usuario</strong>, no los del asistente.</p></li>
<li><p>Almacena un conjunto muy reducido de elementos (unos 15), lo suficiente para captar temas o intereses estables.</p></li>
<li><p><strong>No realiza cálculos de incrustación, clasificaciones de similitud ni llamadas de recuperación</strong>. Básicamente, se trata de contexto pre-masticado, no de búsqueda dinámica.</p></li>
</ul>
<p>Desde el punto de vista de la ingeniería, este enfoque cambia flexibilidad por previsibilidad. No hay posibilidad de que se produzca un fallo extraño en la recuperación, y la latencia de la inferencia se mantiene estable porque no se obtiene nada sobre la marcha. El inconveniente es que ChatGPT no recuperará un mensaje aleatorio de hace seis meses a menos que haya llegado a la capa de resumen.</p>
<h2 id="Challenges-to-Making-Agent-Memory-Writable" class="common-anchor-header">Desafíos para hacer que la memoria del agente sea escribible<button data-href="#Challenges-to-Making-Agent-Memory-Writable" class="anchor-icon" translate="no">
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
    </button></h2><p>Cuando un agente pasa de <strong>la memoria de sólo lectura</strong> (típica RAG) a la <strong>memoria con capacidad de escritura -donde</strong>puede registrar las acciones, decisiones y preferencias del usuario- la complejidad aumenta rápidamente. Ya no se trata sólo de recuperar documentos, sino de mantener un estado creciente del que depende el modelo.</p>
<p>Un sistema de memoria escribible tiene que resolver tres problemas reales:</p>
<ol>
<li><p><strong>Qué recordar:</strong> El agente necesita reglas para decidir qué eventos, preferencias u observaciones merece la pena conservar. Sin esto, la memoria explota en tamaño o se llena de ruido.</p></li>
<li><p><strong>Cómo almacenar y clasificar la memoria:</strong> No toda la memoria es igual. Los elementos recientes, los hechos a largo plazo y las notas efímeras necesitan diferentes niveles de almacenamiento, políticas de retención y estrategias de indexación.</p></li>
<li><p><strong>Cómo escribir rápido sin interrumpir la recuperación:</strong> La memoria debe escribirse continuamente, pero las actualizaciones frecuentes pueden degradar la calidad del índice o ralentizar las consultas si el sistema no está diseñado para inserciones de alto rendimiento.</p></li>
</ol>
<h3 id="Challenge-1-What-Is-Worth-Remembering" class="common-anchor-header">Reto 1: ¿Qué merece la pena recordar?</h3><p>No todo lo que hace un usuario debe acabar en la memoria a largo plazo. Si alguien crea un archivo temporal y lo borra cinco minutos después, grabarlo para siempre no ayuda a nadie. Ésta es la principal dificultad: <strong>¿cómo decide el sistema lo que realmente importa?</strong></p>
<p><strong>(1) Formas habituales de juzgar la importancia</strong></p>
<p>Los equipos suelen basarse en una mezcla de heurísticas:</p>
<ul>
<li><p><strong>Basada en el tiempo</strong>: las acciones recientes importan más que las antiguas.</p></li>
<li><p><strong>Basada en la frecuencia</strong>: los archivos o acciones a los que se accede repetidamente son más importantes.</p></li>
<li><p><strong>Basada en el tipo</strong>: algunos objetos son intrínsecamente más importantes (por ejemplo, los archivos de configuración del proyecto frente a los archivos de caché).</p></li>
</ul>
<p><strong>(2) Cuando las reglas entran en conflicto</strong></p>
<p>Estas señales suelen entrar en conflicto. Un archivo creado la semana pasada pero muy editado hoy: ¿debe prevalecer la antigüedad o la actividad? No existe una única respuesta "correcta", por lo que la puntuación de importancia tiende a complicarse rápidamente.</p>
<p><strong>(3) Cómo ayudan las bases de datos vectoriales</strong></p>
<p>Las bases de datos vectoriales le ofrecen mecanismos para aplicar reglas de importancia sin necesidad de limpieza manual:</p>
<ul>
<li><p><strong>TTL:</strong> Milvus puede eliminar datos automáticamente después de un tiempo determinado.</p></li>
<li><p><strong>Decadencia:</strong> los vectores más antiguos se pueden ponderar a la baja para que desaparezcan de forma natural de la recuperación.</p></li>
</ul>
<h3 id="Challenge-2-Memory-Tiering-in-Practice" class="common-anchor-header">Reto 2: La jerarquización de la memoria en la práctica</h3><p>A medida que los agentes funcionan durante más tiempo, la memoria se acumula. Mantener todo en almacenamiento rápido no es sostenible, por lo que el sistema necesita una forma de dividir la memoria en niveles <strong>calientes</strong> (de acceso frecuente) y <strong>fríos</strong> (de acceso poco frecuente).</p>
<p><strong>(1) Decidir cuándo la memoria se convierte en fría</strong></p>
<p>En este modelo, la <em>memoria caliente</em> se refiere a los datos que se mantienen en la RAM para un acceso de baja latencia, mientras que la <em>memoria fría</em> se refiere a los datos que se mueven al disco o al almacenamiento de objetos para reducir costes.</p>
<p>Decidir cuándo se enfría la memoria puede hacerse de distintas maneras. Algunos sistemas utilizan modelos ligeros para estimar la importancia semántica de una acción o archivo basándose en su significado y uso reciente. Otros se basan en una lógica simple basada en reglas, como mover la memoria a la que no se ha accedido en 30 días o que no ha aparecido en los resultados de recuperación en una semana. Los usuarios también pueden marcar explícitamente determinados archivos o acciones como importantes, asegurándose de que siempre permanezcan calientes.</p>
<p><strong>(2) Dónde se almacenan las memorias calientes y frías</strong></p>
<p>Una vez clasificadas, las memorias calientes y frías se almacenan de forma diferente. La memoria caliente permanece en la RAM y se utiliza para contenidos de acceso frecuente, como el contexto de tareas activas o acciones recientes del usuario. La memoria fría se traslada al disco o a sistemas de almacenamiento de objetos como S3, donde el acceso es más lento pero los costes de almacenamiento son mucho menores. Esta compensación funciona bien porque la memoria fría rara vez se necesita y normalmente sólo se accede a ella como referencia a largo plazo.</p>
<p><strong>(3) Cómo ayudan las bases de datos vectoriales</strong></p>
<p><strong>Milvus y Zilliz Cloud</strong> admiten este patrón al permitir el almacenamiento por niveles frío-caliente manteniendo una única interfaz de consulta, de modo que los vectores a los que se accede con frecuencia permanecen en la memoria y los datos más antiguos se mueven automáticamente a un almacenamiento de menor coste.</p>
<h3 id="Challenge-3-How-Fast-Should-Memory-Be-Written" class="common-anchor-header">Reto 3: ¿A qué velocidad debe escribirse la memoria?</h3><p>Los sistemas RAG tradicionales suelen escribir datos por lotes. Los índices se reconstruyen fuera de línea -a menudo de un día para otro- y no se pueden consultar hasta más tarde. Este enfoque funciona para las bases de conocimiento estáticas, pero no se adapta a la memoria del agente.</p>
<p><strong>(1) Por qué la memoria del agente necesita escrituras en tiempo real</strong></p>
<p>La memoria del agente debe capturar las acciones del usuario en el momento en que se producen. Si una acción no se registra inmediatamente, el siguiente turno de conversación puede carecer de contexto crítico. Por esta razón, los sistemas de memoria con capacidad de escritura requieren escrituras en tiempo real en lugar de actualizaciones retrasadas y fuera de línea.</p>
<p><strong>(2) La tensión entre velocidad de escritura y calidad de recuperación</strong></p>
<p>La memoria en tiempo real exige una latencia de escritura muy baja. Al mismo tiempo, la recuperación de alta calidad depende de índices bien construidos, y la construcción de índices lleva tiempo. Reconstruir un índice para cada escritura es demasiado caro, pero retrasar la indexación significa que los datos recién escritos permanecen temporalmente invisibles para la recuperación. Esta disyuntiva es la base del diseño de memorias con capacidad de escritura.</p>
<p><strong>(3) Cómo ayudan las bases de datos vectoriales</strong></p>
<p>Las bases de datos vectoriales resuelven este problema desvinculando la escritura de la indexación. Una solución común es la escritura en flujo y la creación de índices incrementales. Utilizando <strong>Milvus</strong> como ejemplo, los nuevos datos se escriben primero en un búfer en memoria, lo que permite al sistema gestionar eficazmente las escrituras de alta frecuencia. Incluso antes de crear un índice completo, los datos almacenados en la memoria intermedia pueden consultarse en cuestión de segundos mediante una fusión dinámica o una búsqueda aproximada.</p>
<p>Cuando el búfer alcanza un umbral predefinido, el sistema construye índices por lotes y los persiste. Esto mejora el rendimiento de la recuperación a largo plazo sin bloquear las escrituras en tiempo real. Al separar la ingestión rápida de la construcción de índices más lenta, Milvus logra un equilibrio práctico entre la velocidad de escritura y la calidad de búsqueda que funciona bien para la memoria del agente.</p>
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
    </button></h2><p>Cowork nos permite vislumbrar una nueva clase de agentes: persistentes, con estado y capaces de llevar el contexto a través de largas líneas temporales. Pero también deja clara otra cosa: la memoria a largo plazo es sólo la mitad del problema. Para crear agentes listos para la producción que sean autónomos y fiables, necesitamos una recuperación estructurada de grandes bases de conocimiento en evolución.</p>
<p>La RAG se ocupa de los hechos del mundo; la memoria con capacidad de escritura, del estado interno del agente. Y las bases de datos vectoriales se sitúan en la intersección, proporcionando indexación, búsqueda híbrida y almacenamiento escalable que permiten a ambas capas trabajar juntas.</p>
<p>A medida que los agentes de larga duración vayan madurando, es probable que sus arquitecturas converjan en este diseño híbrido. Cowork es una clara señal de hacia dónde se dirigen las cosas, no hacia un mundo sin RAG, sino hacia agentes con pilas de memoria más ricas alimentadas por bases de datos vectoriales subyacentes.</p>
<p>Si quieres explorar estas ideas u obtener ayuda con tu propia configuración, <strong>únete a nuestro</strong> <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canal de Slack</a> para charlar con los ingenieros de Milvus. Y para una orientación más práctica, siempre puede <strong>reservar una</strong> <strong>sesión</strong> <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>de Milvus Office Hours</strong></a> <strong>.</strong></p>
