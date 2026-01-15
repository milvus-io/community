---
id: reflections-on-chatgpt-and-claude-memory-systems.md
title: >-
  Reflexiones sobre ChatGPT y los sistemas de memoria de Claude: Lo que hace
  falta para permitir la recuperación conversacional a la carta
author: Min Yin
date: 2026-01-09T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_VS_Claude_cover_555fdac36d.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'ChatGPT, Claude, memory systems, on-demand retrieval, conversational retrieval'
meta_title: |
  Milvus 2.6 Makes Claude-Style On-Demand Retrieval Practical
desc: >-
  Explore cómo ChatGPT y Claude diseñan la memoria de forma diferente, por qué
  la recuperación conversacional a petición es difícil y cómo Milvus 2.6 lo
  permite a escala de producción.
origin: 'https://milvus.io/blog/reflections-on-chatgpt-and-claude-memory-systems.md'
---
<p>En los sistemas de agentes de IA de alta calidad, el diseño de la memoria es mucho más complejo de lo que parece a primera vista. En esencia, debe responder a tres preguntas fundamentales: ¿Cómo debe almacenarse el historial de conversaciones? ¿Cuándo debe recuperarse el contexto pasado? ¿Y qué debe recuperarse exactamente?</p>
<p>Estas opciones determinan directamente la latencia de respuesta de un agente, el uso de recursos y, en última instancia, su límite de capacidad.</p>
<p>Los modelos como ChatGPT y Claude son cada vez más "conscientes de la memoria" cuanto más los utilizamos. Recuerdan preferencias, se adaptan a objetivos a largo plazo y mantienen la continuidad entre sesiones. En ese sentido, ya funcionan como agentes de IA en miniatura. Sin embargo, bajo la superficie, sus sistemas de memoria se basan en supuestos arquitectónicos muy diferentes.</p>
<p>Recientes análisis de ingeniería inversa de <a href="https://manthanguptaa.in/posts/claude_memory/">los mecanismos de memoria de</a> <a href="https://manthanguptaa.in/posts/chatgpt_memory/">ChatGPT</a>y <a href="https://manthanguptaa.in/posts/claude_memory/">Claude</a> revelan un claro contraste. <strong>ChatGPT</strong> se basa en la inyección de contexto precalculado y el almacenamiento en caché por capas para ofrecer una continuidad ligera y predecible. <strong>Claude,</strong> por el contrario, adopta el estilo RAG, la recuperación bajo demanda con actualizaciones dinámicas de memoria para equilibrar la profundidad de la memoria y la eficiencia.</p>
<p>Estos dos enfoques no son sólo preferencias de diseño, sino que están determinados por la capacidad de la infraestructura. <a href="https://milvus.io/docs/release_notes.md#v268"><strong>Milvus 2.6</strong></a> introduce la combinación de recuperación híbrida densa-esparcida, filtrado escalar eficiente y almacenamiento por niveles que requiere la memoria conversacional a petición, lo que hace que la recuperación selectiva sea lo suficientemente rápida y económica como para desplegarse en sistemas del mundo real.</p>
<p>En este artículo, explicaremos cómo funcionan realmente los sistemas de memoria de ChatGPT y Claude, por qué divergen arquitectónicamente y cómo los recientes avances en sistemas como Milvus hacen que la recuperación conversacional bajo demanda sea práctica a escala.</p>
<h2 id="ChatGPT’s-Memory-System" class="common-anchor-header">El sistema de memoria de ChatGPT<button data-href="#ChatGPT’s-Memory-System" class="anchor-icon" translate="no">
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
    </button></h2><p>En lugar de consultar una base de datos vectorial o recuperar dinámicamente conversaciones pasadas en el momento de la inferencia, ChatGPT construye su "memoria" reuniendo un conjunto fijo de componentes contextuales e inyectándolos directamente en cada solicitud. Cada componente se prepara con antelación y ocupa una posición conocida en el mensaje.</p>
<p>Este diseño mantiene intactas la personalización y la continuidad de la conversación, al tiempo que hace más predecibles la latencia, el uso de tokens y el comportamiento del sistema. En otras palabras, la memoria no es algo que el modelo busque sobre la marcha, sino algo que el sistema empaqueta y entrega al modelo cada vez que genera una respuesta.</p>
<p>A alto nivel, una consulta ChatGPT completa consta de las siguientes capas, ordenadas de más global a más inmediata:</p>
<p>[0] Instrucciones del sistema</p>
<p>[1] Instrucciones del desarrollador</p>
<p>[2] Metadatos de sesión (efímeros)</p>
<p>[3] Memoria del usuario (hechos a largo plazo)</p>
<p>[4] Resumen de Conversaciones Recientes (chats pasados, títulos + fragmentos)</p>
<p>[5] Mensajes de la sesión actual (este chat)</p>
<p>[6] Su último mensaje</p>
<p>Entre estos, los componentes [2] a [5] forman la memoria efectiva del sistema, cada uno cumpliendo una función distinta.</p>
<h3 id="Session-Metadata" class="common-anchor-header">Metadatos de sesión</h3><p>Los metadatos de sesión representan información efímera y no persistente que se inyecta una vez al principio de una conversación y se descarta cuando finaliza la sesión. Su función es ayudar al modelo a adaptarse al contexto de uso actual más que personalizar el comportamiento a largo plazo.</p>
<p>Esta capa captura señales sobre el entorno inmediato del usuario y sus patrones de uso recientes. Las señales típicas incluyen:</p>
<ul>
<li><p><strong>Información sobre el dispositivo</strong> - por ejemplo, si el usuario está en el móvil o en el escritorio.</p></li>
<li><p><strong>Atributos de la cuenta</strong>: como el nivel de suscripción (por ejemplo, ChatGPT Go), la antigüedad de la cuenta y la frecuencia de uso general.</p></li>
<li><p><strong>Métricas de comportamiento</strong>: incluidos los días activos de los últimos 1, 7 y 30 días, la duración media de las conversaciones y la distribución del uso del modelo (por ejemplo, el 49% de las solicitudes gestionadas por GPT-5).</p></li>
</ul>
<h3 id="User-Memory" class="common-anchor-header">Memoria de usuario</h3><p>La memoria de usuario es la capa de memoria persistente y editable que permite la personalización a través de las conversaciones. Almacena información relativamente estable -como el nombre del usuario, su función o sus objetivos profesionales, proyectos en curso, resultados anteriores y preferencias de aprendizaje- y se inyecta en cada nueva conversación para mantener la continuidad a lo largo del tiempo.</p>
<p>Esta memoria puede actualizarse de dos maneras:</p>
<ul>
<li><p>Las<strong>actualizaciones explícitas</strong> se producen cuando los usuarios gestionan directamente la memoria con instrucciones como "recuerda esto" o "elimina esto de la memoria".</p></li>
<li><p>Las<strong>actualizaciones implícitas</strong> se producen cuando el sistema identifica información que cumple los criterios de almacenamiento de OpenAI -como un nombre confirmado o un puesto de trabajo- y la guarda automáticamente, sujeta a la configuración predeterminada de consentimiento y memoria del usuario.</p></li>
</ul>
<h3 id="Recent-Conversation-Summary" class="common-anchor-header">Resumen de conversaciones recientes</h3><p>El resumen de conversaciones recientes es una capa de contexto ligera que permite mantener la continuidad sin necesidad de reproducir o recuperar historiales de chat completos. En lugar de depender de la recuperación dinámica, como en los enfoques tradicionales basados en RAG, este resumen se calcula previamente y se inyecta directamente en cada nueva conversación.</p>
<p>Esta capa sólo resume los mensajes de los usuarios, excluyendo las respuestas de los asistentes. Su tamaño es intencionadamente limitado (unas 15 entradas) y sólo conserva señales de alto nivel sobre intereses recientes, en lugar de contenido detallado. Al no depender de incrustaciones ni de búsquedas de similitudes, mantiene bajos tanto la latencia como el consumo de tokens.</p>
<h3 id="Current-Session-Messages" class="common-anchor-header">Mensajes de la sesión actual</h3><p>Los mensajes de la sesión actual contienen el historial completo de mensajes de la conversación en curso y proporcionan el contexto a corto plazo necesario para dar respuestas coherentes y detalladas. Esta capa incluye tanto las entradas del usuario como las respuestas del asistente, pero sólo mientras la sesión permanece activa.</p>
<p>Como el modelo funciona con un límite fijo de tokens, este historial no puede crecer indefinidamente. Cuando se alcanza el límite, el sistema elimina los mensajes más antiguos para dejar espacio a los más recientes. Este truncamiento sólo afecta a la sesión actual: la memoria a largo plazo del usuario y el resumen de la conversación reciente permanecen intactos.</p>
<h2 id="Claude’s-Memory-System" class="common-anchor-header">El sistema de memoria de Claude<button data-href="#Claude’s-Memory-System" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude adopta un enfoque diferente en la gestión de la memoria. En lugar de inyectar un paquete grande y fijo de componentes de memoria en cada consulta -como hace ChatGPT- Claude combina la memoria persistente del usuario con herramientas bajo demanda y recuperación selectiva. El contexto histórico sólo se recupera cuando el modelo lo considera relevante, lo que permite al sistema compensar la profundidad contextual con el coste computacional.</p>
<p>El contexto de Claude se estructura de la siguiente manera:</p>
<p>[0] Indicaciones del sistema (instrucciones estáticas)</p>
<p>[1] Recuerdos del usuario</p>
<p>[2] Historial de conversaciones</p>
<p>[3] Mensaje actual</p>
<p>Las diferencias clave entre Claude y ChatGPT radican en <strong>cómo se recupera el historial de conversaciones</strong> y <strong>cómo se actualiza y mantiene la memoria de usuario</strong>.</p>
<h3 id="User-Memories" class="common-anchor-header">Memorias de usuario</h3><p>En Claude, las memorias de usuario forman una capa de contexto a largo plazo similar a la memoria de usuario de ChatGPT, pero con un mayor énfasis en las actualizaciones automáticas en segundo plano. Estas memorias se almacenan en un formato estructurado (envuelto en etiquetas de estilo XML) y están diseñadas para evolucionar gradualmente con el tiempo con una intervención mínima del usuario.</p>
<p>Claude admite dos vías de actualización:</p>
<ul>
<li><p><strong>Actualizaciones implícitas</strong>: el sistema analiza periódicamente el contenido de las conversaciones y actualiza las memorias en segundo plano. Estas actualizaciones no se aplican en tiempo real, y las memorias asociadas a conversaciones borradas se eliminan gradualmente como parte de la optimización en curso.</p></li>
<li><p><strong>Actualizaciones explícitas</strong> - Los usuarios pueden gestionar directamente la memoria mediante comandos como "recordar esto" o "borrar esto", que se ejecutan a través de una herramienta específica de <code translate="no">memory_user_edits</code>.</p></li>
</ul>
<p>En comparación con ChatGPT, Claude atribuye una mayor responsabilidad al propio sistema a la hora de refinar, actualizar y podar la memoria a largo plazo. Esto reduce la necesidad de que los usuarios seleccionen activamente lo que se almacena.</p>
<h3 id="Conversation-History" class="common-anchor-header">Historial de conversaciones</h3><p>Para el historial de conversaciones, Claude no se basa en un resumen fijo que se inyecta en cada solicitud. En su lugar, recupera el contexto pasado sólo cuando el modelo decide que es necesario, utilizando tres mecanismos distintos. De este modo se evita arrastrar un historial irrelevante y se mantiene bajo control el uso de tokens.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Componente</strong></th><th style="text-align:center"><strong>Finalidad</strong></th><th style="text-align:center"><strong>Cómo se utiliza</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>Ventana móvil (conversación actual)</strong></td><td style="text-align:center">Almacena el historial completo de mensajes de la conversación actual (no un resumen), similar al contexto de sesión de ChatGPT.</td><td style="text-align:center">Se inyecta automáticamente. El límite de tokens es ~190K; los mensajes más antiguos se eliminan una vez alcanzado el límite.</td></tr>
<tr><td style="text-align:center"><code translate="no">conversation_search</code> <strong>herramienta</strong></td><td style="text-align:center">Busca conversaciones pasadas por tema o palabra clave, devolviendo enlaces de conversaciones, títulos y extractos de mensajes de usuario/asistente.</td><td style="text-align:center">Se activa cuando el modelo determina que se necesitan detalles históricos. Los parámetros incluyen <code translate="no">query</code> (términos de búsqueda) y <code translate="no">max_results</code> (1-10)</td></tr>
<tr><td style="text-align:center"><code translate="no">recent_chats</code> <strong>herramienta</strong></td><td style="text-align:center">Recupera conversaciones recientes dentro de un intervalo de tiempo especificado (por ejemplo, "últimos 3 días"), con resultados formateados igual que <code translate="no">conversation_search</code></td><td style="text-align:center">Se activa cuando el contexto reciente y temporal es relevante. Los parámetros son <code translate="no">n</code> (número de resultados), <code translate="no">sort_order</code> y el intervalo de tiempo.</td></tr>
</tbody>
</table>
<p>Entre estos componentes, destaca especialmente <code translate="no">conversation_search</code>. Es capaz de mostrar resultados relevantes incluso en el caso de consultas con una redacción poco precisa o multilingües, lo que indica que opera a nivel semántico en lugar de basarse en la simple coincidencia de palabras clave. Es probable que esto implique una recuperación basada en la incrustación o un enfoque híbrido que primero traduzca o normalice la consulta a una forma canónica y luego aplique la recuperación por palabras clave o híbrida.</p>
<p>En general, el método de recuperación a petición de Claude tiene varios puntos fuertes notables:</p>
<ul>
<li><p>La<strong>recuperación no es automática</strong>: Las llamadas a la herramienta se activan por el propio criterio del modelo. Por ejemplo, cuando un usuario menciona <em>"el proyecto que discutimos la última vez",</em> Claude puede decidir invocar <code translate="no">conversation_search</code> para recuperar el contexto relevante.</p></li>
<li><p>Contexto<strong>más rico cuando es necesario</strong>: Los resultados recuperados pueden incluir <strong>extractos de las respuestas de los asistentes</strong>, mientras que los resúmenes de ChatGPT sólo capturan los mensajes de los usuarios. Esto hace que Claude sea más adecuado para casos de uso que requieren un contexto conversacional más profundo o preciso.</p></li>
<li><p><strong>Mayor eficacia por defecto</strong>: Como el contexto histórico no se inyecta a menos que sea necesario, el sistema evita cargar grandes cantidades de historial irrelevante, reduciendo el consumo innecesario de tokens.</p></li>
</ul>
<p>Las contrapartidas son igualmente claras. La introducción de la recuperación bajo demanda aumenta la complejidad del sistema: hay que crear y mantener índices, ejecutar consultas, clasificar los resultados y, a veces, volver a clasificarlos. La latencia de extremo a extremo también es menos predecible que con un contexto precalculado y siempre inyectado. Además, el modelo debe aprender a decidir cuándo es necesaria la recuperación. Si ese juicio falla, es posible que el contexto relevante no se recupere nunca.</p>
<h2 id="The-Constraints-Behind-Claude-Style-On-Demand-Retrieval" class="common-anchor-header">Las limitaciones de la recuperación a petición al estilo de Claude<button data-href="#The-Constraints-Behind-Claude-Style-On-Demand-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>Adoptar un modelo de recuperación bajo demanda convierte a la base de datos vectorial en una parte fundamental de la arquitectura. La recuperación de conversaciones impone exigencias inusualmente altas tanto al almacenamiento como a la ejecución de consultas, y el sistema debe cumplir cuatro restricciones al mismo tiempo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/constraints_b6ed74e454.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="1-Low-Latency-Tolerance" class="common-anchor-header">1. Tolerancia a la baja latencia</h3><p>En los sistemas de conversación, la latencia P99 debe ser inferior a ~20 ms. Los retrasos superiores a este valor se notan inmediatamente. Los retrasos superiores a esa cifra son inmediatamente perceptibles para los usuarios. Esto deja poco margen para la ineficacia: la búsqueda vectorial, el filtrado de metadatos y la clasificación de resultados deben optimizarse cuidadosamente. Un cuello de botella en cualquier punto puede degradar toda la experiencia conversacional.</p>
<h3 id="2-Hybrid-Search-Requirement" class="common-anchor-header">2. Requisitos de la búsqueda híbrida</h3><p>Las consultas de los usuarios suelen abarcar múltiples dimensiones. Una petición como <em>"discusiones sobre RAG de la semana pasada"</em> combina la relevancia semántica con el filtrado basado en el tiempo. Si una base de datos sólo admite la búsqueda vectorial, puede devolver 1.000 resultados semánticamente similares, sólo para que el filtrado de la capa de aplicación los reduzca a un puñado, desperdiciando la mayor parte del cálculo. Para ser práctica, la base de datos debe admitir de forma nativa consultas vectoriales y escalares combinadas.</p>
<h3 id="3-Storage–Compute-Separation" class="common-anchor-header">3. Separación entre almacenamiento y cálculo</h3><p>El historial de conversaciones muestra un claro patrón de acceso caliente-frío. Las conversaciones recientes se consultan con frecuencia, mientras que las antiguas apenas se tocan. Si todos los vectores tuvieran que permanecer en memoria, el almacenamiento de decenas de millones de conversaciones consumiría cientos de gigabytes de RAM, un coste poco práctico a escala. Para ser viable, el sistema debe soportar la separación almacenamiento-computación, manteniendo los datos calientes en memoria y los fríos en almacenamiento de objetos, con vectores cargados bajo demanda.</p>
<h3 id="4-Diverse-Query-Patterns" class="common-anchor-header">4. Patrones de consulta diversos</h3><p>La recuperación de conversaciones no sigue un único patrón de acceso. Algunas consultas son puramente semánticas (por ejemplo, <em>"la optimización del rendimiento que discutimos")</em>, otras son puramente temporales (<em>"todas las conversaciones de la semana pasada")</em>, y muchas combinan múltiples restricciones (<em>"discusiones relacionadas con Python que mencionen FastAPI en los últimos tres meses")</em>. El planificador de consultas de la base de datos debe adaptar las estrategias de ejecución a los distintos tipos de consulta, en lugar de basarse en una búsqueda de fuerza bruta de talla única.</p>
<p>En conjunto, estos cuatro retos definen las principales limitaciones de la recuperación conversacional. Cualquier sistema que pretenda implantar la recuperación a la carta al estilo de Claude debe abordarlos todos de forma coordinada.</p>
<h2 id="Why-Milvus-26-Works-Well-for-Conversational-Retrieval" class="common-anchor-header">Por qué Milvus 2.6 funciona bien para la recuperación conversacional<button data-href="#Why-Milvus-26-Works-Well-for-Conversational-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>Las opciones de diseño de <a href="https://milvus.io/docs/release_notes.md#v268">Milvus 2.</a> 6 se ajustan estrechamente a los requisitos básicos de la recuperación conversacional a petición. A continuación se presenta un desglose de las capacidades clave y su correspondencia con las necesidades reales de recuperación conversacional.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_2_6_ce379ff42d.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Hybrid-Retrieval-with-Dense-and-Sparse-Vectors" class="common-anchor-header">Recuperación híbrida con vectores densos y dispersos</h3><p>Milvus 2.6 admite de forma nativa el almacenamiento de vectores densos y dispersos dentro de la misma colección y la fusión automática de sus resultados en el momento de la consulta. Los vectores densos (por ejemplo, las incrustaciones de 768 dimensiones generadas por modelos como BGE-M3) capturan la similitud semántica, mientras que los vectores dispersos (producidos normalmente por BM25) conservan las señales exactas de las palabras clave.</p>
<p>Para una consulta del tipo <em>"debates sobre el GAR de la semana pasada",</em> Milvus ejecuta la recuperación semántica y la recuperación de palabras clave en paralelo, y luego fusiona los resultados mediante reordenación. En comparación con el uso de cualquiera de los dos enfoques por separado, esta estrategia híbrida ofrece una recuperación significativamente mayor en escenarios conversacionales reales.</p>
<h3 id="Storage–Compute-Separation-and-Query-Optimization" class="common-anchor-header">Separación almacenamiento-ordenador y optimización de consultas</h3><p>Milvus 2.6 admite el almacenamiento por niveles de dos maneras:</p>
<ul>
<li><p>Datos calientes en memoria, datos fríos en almacenamiento de objetos</p></li>
<li><p>Índices en memoria, datos vectoriales en bruto en almacenamiento de objetos</p></li>
</ul>
<p>Con este diseño, se puede almacenar un millón de entradas de conversación con aproximadamente 2 GB de memoria y 8 GB de almacenamiento de objetos. Con el ajuste adecuado, la latencia de P99 puede permanecer por debajo de 20 ms, incluso con la separación almacenamiento-computación activada.</p>
<h3 id="JSON-Shredding-and-Fast-Scalar-Filtering" class="common-anchor-header">Trituración JSON y filtrado escalar rápido</h3><p>Milvus 2.6 activa JSON Shredding por defecto, aplanando los campos JSON anidados en almacenamiento columnar. Esto mejora el rendimiento del filtrado escalar entre 3 y 5 veces según los puntos de referencia oficiales (las ganancias reales varían según el patrón de consulta).</p>
<p>La recuperación conversacional suele requerir el filtrado por metadatos, como el ID de usuario, el ID de sesión o el intervalo de tiempo. Con JSON Shredding, las consultas del tipo <em>"todas las conversaciones del usuario A en la última semana"</em> pueden ejecutarse directamente en índices columnares, sin tener que analizar repetidamente blobs JSON completos.</p>
<h3 id="Open-Source-Control-and-Operational-Flexibility" class="common-anchor-header">Control de código abierto y flexibilidad operativa</h3><p>Como sistema de código abierto, Milvus ofrece un nivel de control arquitectónico y operativo que no ofrecen las soluciones cerradas de caja negra. Los equipos pueden ajustar los parámetros de los índices, aplicar estrategias de clasificación de datos por niveles y personalizar los despliegues distribuidos para adaptarlos a sus cargas de trabajo.</p>
<p>Esta flexibilidad reduce la barrera de entrada: los equipos pequeños y medianos pueden crear sistemas de recuperación conversacional a escala de millones a decenas de millones sin depender de presupuestos de infraestructura desorbitados.</p>
<h2 id="Why-ChatGPT-and-Claude-Took-Different-Paths" class="common-anchor-header">Por qué ChatGPT y Claude tomaron caminos diferentes<button data-href="#Why-ChatGPT-and-Claude-Took-Different-Paths" class="anchor-icon" translate="no">
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
    </button></h2><p>A grandes rasgos, la diferencia entre los sistemas de memoria de ChatGPT y Claude se reduce a cómo gestiona cada uno el olvido. ChatGPT favorece el olvido proactivo: una vez que la memoria supera unos límites fijos, se elimina el contexto más antiguo. De este modo, se sustituye la exhaustividad por la simplicidad y el comportamiento predecible del sistema. Claude prefiere el olvido retardado. En teoría, el historial de conversaciones puede crecer sin límites, y la recuperación se delega en un sistema a la carta.</p>
<p>¿Por qué los dos sistemas han elegido caminos diferentes? Con las limitaciones técnicas expuestas anteriormente, la respuesta es clara: <strong>cada arquitectura sólo es viable si la infraestructura subyacente puede soportarla</strong>.</p>
<p>Si el planteamiento de Claude se hubiera intentado en 2020, probablemente habría sido inviable. En aquella época, las bases de datos vectoriales solían incurrir en cientos de milisegundos de latencia, las consultas híbridas no estaban bien soportadas y el uso de recursos aumentaba prohibitivamente a medida que crecían los datos. En esas condiciones, la recuperación bajo demanda se habría considerado un exceso de ingeniería.</p>
<p>En 2025, el panorama ha cambiado. Los avances en infraestructura -impulsados por sistemas como <strong>Milvus 2.6-</strong>han hecho que la separación almacenamiento-ordenador, la optimización de consultas, la recuperación híbrida densa-esparcida y la trituración de JSON sean viables en producción. Estos avances reducen la latencia, controlan los costes y hacen que la recuperación selectiva sea práctica a escala. Como resultado, las herramientas bajo demanda y la memoria basada en la recuperación no sólo son viables, sino cada vez más atractivas, especialmente como base para sistemas de tipo agente.</p>
<p>En última instancia, la elección de la arquitectura depende de lo que la infraestructura haga posible.</p>
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
    </button></h2><p>En los sistemas del mundo real, el diseño de la memoria no es una elección binaria entre el contexto precalculado y la recuperación bajo demanda. Las arquitecturas más eficaces suelen ser híbridas, combinando ambos enfoques.</p>
<p>Un patrón común consiste en inyectar los giros recientes de la conversación a través de una ventana de contexto deslizante, almacenar las preferencias estables del usuario como memoria fija y recuperar el historial más antiguo bajo demanda mediante búsqueda vectorial. A medida que un producto madura, este equilibrio puede cambiar gradualmente -de un contexto principalmente precalculado a otro cada vez más basado en la recuperación- sin que sea necesario un reinicio arquitectónico disruptivo.</p>
<p>Incluso cuando se empieza con un enfoque precalculado, es importante diseñar teniendo en cuenta la migración. La memoria debe almacenarse con identificadores claros, marcas de tiempo, categorías y referencias a la fuente. Cuando la recuperación sea viable, se pueden generar incrustaciones para la memoria existente y añadirlas a una base de datos vectorial junto con los mismos metadatos, lo que permite introducir la lógica de recuperación de forma incremental y con una interrupción mínima.</p>
<p>¿Tiene alguna pregunta o desea profundizar en alguna de las características de la última versión de Milvus? Únase a nuestro <a href="https://discord.com/invite/8uyFbECzPX">canal de Discord</a> o presente incidencias en <a href="https://github.com/milvus-io/milvus">GitHub</a>. También puede reservar una sesión individual de 20 minutos para obtener información, orientación y respuestas a sus preguntas a través de <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>.</p>
