---
id: >-
  beyond-context-overload-how-parlant-milvus-brings-control-and-clarity-to-llm-agent-behavior.md
title: >-
  Más allá de la sobrecarga de contexto: Cómo Parlant × Milvus aporta control y
  claridad al comportamiento de los agentes LLM
author: Min Yin
date: 2025-11-05T00:00:00.000Z
cover: assets.zilliz.com/parlant_cover1_466dc0fe21.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Parlant, Milvus, AI agents, vector database, LLM'
meta_title: How Parlant × Milvus Brings Control to LLM Agent Behavior
desc: >-
  Descubra cómo Parlant × Milvus utiliza el modelado de alineación y la
  inteligencia vectorial para hacer que el comportamiento de los agentes LLM sea
  controlable, explicable y listo para la producción.
origin: >-
  https://milvus.io/blog/beyond-context-overload-how-parlant-milvus-brings-control-and-clarity-to-llm-agent-behavior.md
---
<p>Imagínese que le dicen que complete una tarea que implica 200 reglas de negocio, 50 herramientas y 30 demostraciones, y sólo tiene una hora para hacerlo. Eso es sencillamente imposible. Sin embargo, a menudo esperamos que los grandes modelos lingüísticos hagan exactamente eso cuando los convertimos en "agentes" y los sobrecargamos de instrucciones.</p>
<p>En la práctica, este planteamiento se rompe rápidamente. Los marcos de agentes tradicionales, como LangChain o LlamaIndex, inyectan todas las reglas y herramientas en el contexto del modelo a la vez, lo que provoca conflictos entre reglas, sobrecarga del contexto y un comportamiento impredecible en la producción.</p>
<p>Para abordar este problema, un marco de agentes de código abierto llamado<a href="https://github.com/emcie-co/parlant?utm_source=chatgpt.com"> <strong>Parlant</strong></a> ha ido ganando terreno recientemente en GitHub. Introduce un nuevo enfoque llamado Alignment Modeling, junto con un mecanismo de supervisión y transiciones condicionales que hacen que el comportamiento del agente sea mucho más controlable y explicable.</p>
<p>Cuando se combina con <a href="https://milvus.io/"><strong>Milvus</strong></a>, una base de datos vectorial de código abierto, Parlant es aún más capaz. Milvus añade inteligencia semántica, permitiendo a los agentes recuperar dinámicamente las reglas más relevantes y el contexto en tiempo real, manteniéndolos precisos, eficientes y listos para la producción.</p>
<p>En este artículo, exploraremos cómo funciona Parlant bajo el capó y cómo su integración con Milvus permite alcanzar el nivel de producción.</p>
<h2 id="Why-Traditional-Agent-Frameworks-Fall-Apart" class="common-anchor-header">Por qué los marcos de agentes tradicionales fracasan<button data-href="#Why-Traditional-Agent-Frameworks-Fall-Apart" class="anchor-icon" translate="no">
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
    </button></h2><p>A los marcos de agentes tradicionales les encanta ir a lo grande: cientos de reglas, docenas de herramientas y un puñado de demos, todo ello metido en un único y sobrecargado prompt. Puede quedar muy bien en una demostración o en una pequeña prueba de caja de arena, pero una vez que se pone en producción, las grietas empiezan a aparecer rápidamente.</p>
<ul>
<li><p><strong>Las reglas contradictorias provocan el caos:</strong> Cuando se aplican dos o más reglas al mismo tiempo, estos marcos no tienen una forma integrada de decidir cuál gana. A veces elige una. A veces combina ambas. A veces hace algo totalmente imprevisible.</p></li>
<li><p><strong>Los casos extremos dejan al descubierto las lagunas:</strong> No es posible predecir todo lo que un usuario puede decir. Y cuando su modelo se encuentra con algo fuera de sus datos de entrenamiento, recurre por defecto a respuestas genéricas y sin compromiso.</p></li>
<li><p><strong>La depuración es dolorosa y costosa:</strong> Cuando un agente se comporta mal, es casi imposible determinar con precisión qué regla causó el problema. Dado que todo vive dentro de un prompt gigante del sistema, la única manera de solucionarlo es reescribir el prompt y volver a probar todo desde cero.</p></li>
</ul>
<h2 id="What-is-Parlant-and-How-It-Works" class="common-anchor-header">Qué es Parlant y cómo funciona<button data-href="#What-is-Parlant-and-How-It-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Parlant es un motor de alineación de código abierto para agentes LLM. Puedes controlar con precisión cómo se comporta un agente en diferentes escenarios modelando su proceso de toma de decisiones de una forma estructurada y basada en reglas.</p>
<p>Para hacer frente a los problemas encontrados en los marcos de agentes tradicionales, Parlant introduce un nuevo y potente enfoque: <strong>Modelado de alineación</strong>. Su idea central es separar la definición de reglas de su ejecución, garantizando que sólo se inyecten en el contexto del LLM las reglas más relevantes en cada momento.</p>
<h3 id="Granular-Guidelines-The-Core-of-Alignment-Modeling" class="common-anchor-header">Directrices granulares: El núcleo del modelado de alineación</h3><p>En el corazón del modelo de alineación de Parlant está el concepto de <strong>Directrices Granulares</strong>. En lugar de escribir un sistema gigante lleno de reglas, se definen pequeñas directrices modulares, cada una describiendo cómo el agente debe manejar un tipo específico de situación.</p>
<p>Cada directriz consta de tres partes:</p>
<ul>
<li><p><strong>Condición</strong> - Una descripción en lenguaje natural de cuándo debe aplicarse la regla. Parlant convierte esta condición en un vector semántico y lo compara con la entrada del usuario para averiguar si es relevante.</p></li>
<li><p><strong>Acción</strong> - Una instrucción clara que define cómo debe responder el agente una vez que se cumple la condición. Esta acción se inyecta en el contexto del LLM sólo cuando se activa.</p></li>
<li><p><strong>Herramientas</strong> - Cualquier función externa o API vinculada a esa regla específica. Éstas se exponen al agente sólo cuando la directriz está activa, manteniendo el uso de herramientas controlado y consciente del contexto.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">await</span> agent.<span class="hljs-title function_">create_guideline</span>(
    condition=<span class="hljs-string">&quot;The user asks about a refund and the order amount exceeds 500 RMB&quot;</span>,
    action=<span class="hljs-string">&quot;First call the order status check tool to confirm whether the refund conditions are met, then provide a detailed explanation of the refund process&quot;</span>,
    tools=[check_order_status, calculate_refund_amount]
)
<button class="copy-code-btn"></button></code></pre>
<p>Cada vez que un usuario interactúa con el agente, Parlant ejecuta un paso de correspondencia ligero para encontrar las tres a cinco directrices más relevantes. Sólo esas reglas se inyectan en el contexto del modelo, manteniendo las indicaciones concisas y centradas, y garantizando al mismo tiempo que el agente siga sistemáticamente las reglas correctas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/guideline_system_652fb287ce.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Supervising-Mechanism-for-Accuracy-and-Consistency" class="common-anchor-header">Mecanismo de supervisión de la precisión y la coherencia</h3><p>Para mantener la precisión y la coherencia, Parlant introduce un <strong>mecanismo</strong> de supervisión que actúa como una segunda capa de control de calidad. El proceso se desarrolla en tres pasos:</p>
<p><strong>1.</strong> 1.<strong>Generación de una respuesta candidata</strong>: el agente crea una respuesta inicial basada en las directrices coincidentes y el contexto actual de la conversación.</p>
<p><strong>2.</strong> 2.<strong>Comprobación</strong> de la<strong>conformidad</strong> - La respuesta se compara con las directrices activas para verificar que se han seguido correctamente todas las instrucciones.</p>
<p><strong>3.</strong> 3.<strong>Revisar o confirmar</strong>: si se detecta algún problema, el sistema corrige el resultado; si todo es correcto, la respuesta se aprueba y se envía al usuario.</p>
<p>Este mecanismo de supervisión garantiza que el agente no sólo entiende las normas, sino que las cumple antes de responder, lo que mejora tanto la fiabilidad como el control.</p>
<h3 id="Conditional-Transitions-for-Control-and-Safety" class="common-anchor-header">Transiciones condicionales para el control y la seguridad</h3><p>En los marcos de agentes tradicionales, todas las herramientas disponibles están expuestas al LLM en todo momento. Este enfoque de "todo sobre la mesa" a menudo conduce a peticiones sobrecargadas y llamadas a herramientas no intencionadas. Parlant resuelve esto a través de <strong>transiciones condicionales</strong>. De forma similar al funcionamiento de las máquinas de estado, una acción o herramienta se activa sólo cuando se cumple una condición específica. Cada herramienta está estrechamente vinculada a su directriz correspondiente, y sólo está disponible cuando se activa la condición de esa directriz.</p>
<pre><code translate="no"><span class="hljs-comment"># The balance inquiry tool is exposed only when the condition &quot;the user wants to make a transfer&quot; is met</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
    condition=<span class="hljs-string">&quot;The user wants to make a transfer&quot;</span>,
    action=<span class="hljs-string">&quot;First check the account balance. If the balance is below 500 RMB, remind the user that an overdraft fee may apply.&quot;</span>,
    tools=[get_user_account_balance]
)
<button class="copy-code-btn"></button></code></pre>
<p>Este mecanismo convierte la invocación de herramientas en una transición condicional: las herramientas pasan de "inactivas" a "activas" sólo cuando se cumplen sus condiciones de activación. Al estructurar la ejecución de este modo, Parlant garantiza que cada acción se realice de forma deliberada y contextual, lo que evita el uso indebido y mejora la eficacia y la seguridad del sistema.</p>
<h2 id="How-Milvus-Powers-Parlant" class="common-anchor-header">Cómo Milvus potencia Parlant<button data-href="#How-Milvus-Powers-Parlant" class="anchor-icon" translate="no">
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
    </button></h2><p>Cuando miramos bajo el capó del proceso de correspondencia de pautas de Parlant, queda claro un reto técnico fundamental: ¿cómo puede el sistema encontrar las tres o cinco reglas más relevantes de entre cientos (o incluso miles) de opciones en tan solo unos milisegundos? Ahí es exactamente donde entra en juego una base de datos vectorial. La recuperación semántica es lo que lo hace posible.</p>
<h3 id="How-Milvus-Supports-Parlant’s-Guideline-Matching-Process" class="common-anchor-header">Cómo Milvus apoya el proceso de correspondencia de directrices de Parlant</h3><p>La correspondencia de directrices funciona a través de la similitud semántica. El campo Condición de cada directriz se convierte en una incrustación vectorial, capturando su significado en lugar de sólo su texto literal. Cuando un usuario envía un mensaje, Parlant compara la semántica de ese mensaje con todas las incrustaciones de directrices almacenadas para encontrar las más relevantes.</p>
<p>Así funciona el proceso paso a paso:</p>
<p><strong>1. Codificar la consulta</strong> - El mensaje del usuario y el historial de conversaciones recientes se transforman en un vector de consulta.</p>
<p><strong>2.</strong> 2. Búsqueda<strong>de similitudes</strong> - El sistema realiza una búsqueda de similitudes dentro del almacén de vectores de pautas para encontrar las coincidencias más cercanas.</p>
<p><strong>3.</strong> 3.<strong>Obtención de los resultados Top-K</strong>: se muestran las tres a cinco directrices semánticamente más relevantes.</p>
<p><strong>4.</strong> 4.<strong>Inyectar en el contexto</strong> - Estas directrices coincidentes se insertan dinámicamente en el contexto del LLM para que el modelo pueda actuar de acuerdo con las reglas correctas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/guideline_matching_process_ffd874c77e.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Para que este flujo de trabajo sea posible, la base de datos vectorial debe ofrecer tres capacidades críticas: búsqueda de alto rendimiento por vecino más próximo aproximado (RNA), filtrado flexible de metadatos y actualizaciones de vectores en tiempo real. <a href="https://milvus.io/"><strong>Milvus</strong></a>, la base de datos vectorial de código abierto y nativa de la nube, proporciona un rendimiento de nivel de producción en las tres áreas.</p>
<p>Para entender cómo funciona Milvus en escenarios reales, veamos el ejemplo de un agente de servicios financieros.</p>
<p>Supongamos que el sistema define 800 directrices empresariales que abarcan tareas como consultas de cuentas, transferencias de fondos y consultas de productos de gestión de patrimonios. En esta configuración, Milvus actúa como capa de almacenamiento y recuperación de todos los datos de las directrices.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType
<span class="hljs-keyword">import</span> parlant.sdk <span class="hljs-keyword">as</span> p

<span class="hljs-comment"># Connect to Milvus</span>
connections.connect(host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)

<span class="hljs-comment"># Define the schema for the guideline collection</span>
fields = [
    FieldSchema(name=<span class="hljs-string">&quot;guideline_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>, is_primary=<span class="hljs-literal">True</span>),
    FieldSchema(name=<span class="hljs-string">&quot;condition_vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>),
    FieldSchema(name=<span class="hljs-string">&quot;condition_text&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">1000</span>),
    FieldSchema(name=<span class="hljs-string">&quot;action_text&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>),
    FieldSchema(name=<span class="hljs-string">&quot;priority&quot;</span>, dtype=DataType.INT64),
    FieldSchema(name=<span class="hljs-string">&quot;business_domain&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
]
schema = CollectionSchema(fields=fields, description=<span class="hljs-string">&quot;Agent Guidelines&quot;</span>)
guideline_collection = Collection(name=<span class="hljs-string">&quot;agent_guidelines&quot;</span>, schema=schema)

<span class="hljs-comment"># Create an HNSW index for high-performance retrieval</span>
index_params = {
    <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;HNSW&quot;</span>,
    <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
    <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
}
guideline_collection.create_index(field_name=<span class="hljs-string">&quot;condition_vector&quot;</span>, index_params=index_params)
<button class="copy-code-btn"></button></code></pre>
<p>Ahora, cuando un usuario dice "Quiero transferir 100.000 RMB a la cuenta de mi madre", el flujo en tiempo de ejecución es:</p>
<p><strong>1. Rectorizar la consulta</strong> - Convertir la entrada del usuario en un vector de 768 dimensiones.</p>
<p><strong>2.</strong> 2.<strong>Recuperación híbrida</strong> - Ejecutar una búsqueda de similitud vectorial en Milvus con filtrado de metadatos (por ejemplo, <code translate="no">business_domain=&quot;transfer&quot;</code>).</p>
<p><strong>3.</strong> Clasificación de<strong>los resultados</strong> - Clasificar las directrices candidatas en función de las puntuaciones de similitud combinadas con sus valores de <strong>prioridad</strong>.</p>
<p><strong>4. Inyección de contexto</strong> - Inyectar las tres directrices más parecidas <code translate="no">action_text</code> en el contexto del agente Parlant.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/bank_transfer_use_case_481d09a407.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Con esta configuración, Milvus ofrece una latencia P99 inferior a 15 ms, incluso cuando la biblioteca de directrices alcanza las 100.000 entradas. En comparación, el uso de una base de datos relacional tradicional con concordancia de palabras clave suele dar como resultado una latencia superior a 200 ms y una precisión de concordancia significativamente inferior.</p>
<h3 id="How-Milvus-Enables-Long-Term-Memory-and-Personalization" class="common-anchor-header">Cómo Milvus permite la memoria a largo plazo y la personalización</h3><p>Milvus hace algo más que la concordancia de pautas. En escenarios en los que los agentes necesitan memoria a largo plazo y respuestas personalizadas, Milvus puede servir como la capa de memoria que almacena y recupera las interacciones pasadas de los usuarios como incrustaciones vectoriales, ayudando al agente a recordar lo que se discutió anteriormente.</p>
<pre><code translate="no"><span class="hljs-comment"># store user’s past interactions</span>
user_memory_fields = [
    FieldSchema(name=<span class="hljs-string">&quot;interaction_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">100</span>, is_primary=<span class="hljs-literal">True</span>),
    FieldSchema(name=<span class="hljs-string">&quot;user_id&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">50</span>),
    FieldSchema(name=<span class="hljs-string">&quot;interaction_vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>),
    FieldSchema(name=<span class="hljs-string">&quot;interaction_summary&quot;</span>, dtype=DataType.VARCHAR, max_length=<span class="hljs-number">500</span>),
    FieldSchema(name=<span class="hljs-string">&quot;timestamp&quot;</span>, dtype=DataType.INT64)
]
memory_collection = Collection(name=<span class="hljs-string">&quot;user_memory&quot;</span>, schema=CollectionSchema(user_memory_fields))
<button class="copy-code-btn"></button></code></pre>
<p>Cuando vuelve el mismo usuario, el agente puede recuperar las interacciones históricas más relevantes de Milvus y utilizarlas para generar una experiencia más conectada y similar a la humana. Por ejemplo, si un usuario preguntó sobre un fondo de inversión la semana pasada, el agente puede recordar ese contexto y responder de forma proactiva: "¡Bienvenido de nuevo! ¿Todavía tiene preguntas sobre el fondo del que hablamos la última vez?".</p>
<h3 id="How-to-Optimize-Performance-for-Milvus-Powered-Agent-Systems" class="common-anchor-header">Cómo optimizar el rendimiento de los sistemas de agentes basados en Milvus</h3><p>Cuando se despliega un sistema de agentes alimentado por Milvus en un entorno de producción, el ajuste del rendimiento se convierte en algo crítico. Para lograr una baja latencia y un alto rendimiento, es necesario prestar atención a varios parámetros clave:</p>
<p><strong>1. Elección del tipo de índice adecuado</strong></p>
<p>Es importante seleccionar la estructura de índice adecuada. Por ejemplo, HNSW (Hierarchical Navigable Small World) es ideal para escenarios de alta recuperación como las finanzas o la sanidad, donde la precisión es crítica. IVF_FLAT funciona mejor para aplicaciones a gran escala, como las recomendaciones de comercio electrónico, en las que una recuperación ligeramente inferior es aceptable a cambio de un rendimiento más rápido y un menor uso de memoria.</p>
<p><strong>2. Estrategia de fragmentación</strong></p>
<p>Cuando el número de pautas almacenadas supera el millón de entradas, se recomienda utilizar <strong>Partition</strong> para dividir los datos por dominio de negocio o caso de uso. La partición reduce el espacio de búsqueda por consulta, mejorando la velocidad de recuperación y manteniendo la latencia estable incluso a medida que crece el conjunto de datos.</p>
<p><strong>3. Configuración de la caché</strong></p>
<p>Para las directrices a las que se accede con frecuencia, como las consultas estándar de clientes o los flujos de trabajo de alto tráfico, puede utilizar la caché de resultados de consulta de Milvus. Esto permite al sistema reutilizar resultados anteriores, reduciendo la latencia a menos de 5 milisegundos para búsquedas repetidas.</p>
<h2 id="Hands-on-Demo-How-to-Build-a-Smart-QA-System-with-Parlant-and-Milvus-Lite" class="common-anchor-header">Demostración práctica: Cómo construir un sistema inteligente de preguntas y respuestas con Parlant y Milvus Lite<button data-href="#Hands-on-Demo-How-to-Build-a-Smart-QA-System-with-Parlant-and-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/install-overview.md">Milvus Lite</a> es una versión ligera de Milvus, una biblioteca Python que puede integrarse fácilmente en sus aplicaciones. Es ideal para la creación rápida de prototipos en entornos como Jupyter Notebooks o para ejecutarse en dispositivos edge e inteligentes con recursos informáticos limitados. A pesar de su pequeño tamaño, Milvus Lite es compatible con las mismas API que otras implementaciones de Milvus. Esto significa que el código del lado del cliente que escriba para Milvus Lite puede conectarse sin problemas a una instancia completa de Milvus o Zilliz Cloud más adelante, sin necesidad de refactorización.</p>
<p>En esta demostración, utilizaremos Milvus Lite junto con Parlant para demostrar cómo crear un sistema inteligente de preguntas y respuestas que ofrezca respuestas rápidas y contextualizadas con una configuración mínima.</p>
<h3 id="Prerequisites" class="common-anchor-header">Requisitos previos：</h3><p>1.Parlant GitHub: https://github.com/emcie-co/parlant</p>
<p>2.Documentación de Parlant: https://parlant.io/docs</p>
<p>3.python3.10+</p>
<p>4.OpenAI_key</p>
<p>5.MlivusLite</p>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">Paso 1: Instalar dependencias</h3><pre><code translate="no"><span class="hljs-comment"># Install required Python packages</span>
pip install pymilvus parlant openai
<span class="hljs-comment"># Or, if you’re using a Conda environment:</span>
conda activate your_env_name
pip install pymilvus parlant openai
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Configure-Environment-Variables" class="common-anchor-header">Paso 2: Configurar las variables de entorno</h3><pre><code translate="no"><span class="hljs-comment"># Set your OpenAI API key</span>
<span class="hljs-built_in">export</span> OPENAI_API_KEY=<span class="hljs-string">&quot;your_openai_api_key_here&quot;</span>
<span class="hljs-comment"># Verify that the variable is set correctly</span>
<span class="hljs-built_in">echo</span> <span class="hljs-variable">$OPENAI_API_KEY</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Implement-the-Core-Code" class="common-anchor-header">Paso 3: Implementar el código base</h3><ul>
<li>Crear un OpenAI Embedder personalizado</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">class</span> <span class="hljs-title class_">OpenAIEmbedder</span>(p.Embedder):
    <span class="hljs-comment"># Converts text into vector embeddings with built-in timeout and retry</span>
    <span class="hljs-comment"># Dimension: 1536 (text-embedding-3-small)</span>
    <span class="hljs-comment"># Timeout: 60 seconds; Retries: up to 2 times</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Inicializar la base de conocimientos</li>
</ul>
<p>1.Cree una colección Milvus llamada kb_articles.</p>
<p>2.Inserte datos de ejemplo (por ejemplo, política de reembolso, política de cambio, tiempo de envío).</p>
<p>3.Construir un índice HNSW para acelerar la recuperación.</p>
<ul>
<li>4.Construir la herramienta de búsqueda vectorial</li>
</ul>
<pre><code translate="no"><span class="hljs-meta">@p.tool</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">vector_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span>, min_score: <span class="hljs-built_in">float</span> = <span class="hljs-number">0.35</span></span>):
    <span class="hljs-comment"># 1. Convert user query into a vector</span>
    <span class="hljs-comment"># 2. Perform similarity search in Milvus</span>
    <span class="hljs-comment"># 3. Return results with relevance above threshold</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Configurar el agente Parlant</li>
</ul>
<p><strong>Directriz 1:</strong> Para preguntas relacionadas con hechos o políticas, el agente debe realizar primero una búsqueda vectorial.</p>
<p><strong>Directriz 2:</strong> Cuando se encuentran pruebas, el agente debe responder utilizando una plantilla estructurada (resumen + puntos clave + fuentes).</p>
<pre><code translate="no"><span class="hljs-comment"># Guideline 1: Run vector search for factual or policy-related questions</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;User asks a factual question about policy, refund, exchange, or shipping&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Call vector_search with the user&#x27;s query. &quot;</span>
                <span class="hljs-string">&quot;If evidence is found, synthesize an answer by quoting key sentences and cite doc_id/title. &quot;</span>
                <span class="hljs-string">&quot;If evidence is insufficient, ask a clarifying question before answering.&quot;</span>
            ),
            tools=[vector_search],

<span class="hljs-comment"># Guideline 2: Use a standardized, structured response when evidence is available</span>
<span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;Evidence is available&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Answer with the following template:\\n&quot;</span>
                <span class="hljs-string">&quot;Summary: provide a concise conclusion.\\n&quot;</span>
                <span class="hljs-string">&quot;Key points: 2-3 bullets distilled from evidence.\\n&quot;</span>
                <span class="hljs-string">&quot;Sources: list doc_id and title.\\n&quot;</span>
                <span class="hljs-string">&quot;Note: if confidence is low, state limitations and ask for clarification.&quot;</span>
            ),
            tools=[],
        )

    tools=[],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li>Escribir el código completo</li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>, <span class="hljs-type">Any</span>
<span class="hljs-keyword">import</span> parlant.sdk <span class="hljs-keyword">as</span> p
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType
<span class="hljs-comment"># 1) Environment variables: using OpenAI (as both the default generation model and embedding service)</span>
<span class="hljs-comment"># Make sure the OPENAI_API_KEY is set</span>
OPENAI_API_KEY = os.environ.get(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> OPENAI_API_KEY:
    <span class="hljs-keyword">raise</span> RuntimeError(<span class="hljs-string">&quot;Please set OPENAI_API_KEY environment variable&quot;</span>)
<span class="hljs-comment"># 2) Initialize Milvus Lite (runs locally, no standalone service required)</span>
<span class="hljs-comment"># MilvusClient runs in Lite mode using a local file path (requires pymilvus &gt;= 2.x)</span>
client = MilvusClient(<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)  <span class="hljs-comment"># Lite mode uses a local file path</span>
COLLECTION = <span class="hljs-string">&quot;kb_articles&quot;</span>
<span class="hljs-comment"># 3) Example data: three policy or FAQ entries (in practice, you can load and chunk data from files)</span>
DOCS = [
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;POLICY-001&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Refund Policy&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Refunds are available within 30 days of purchase if the product is unused.&quot;</span>},
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;POLICY-002&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Exchange Policy&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Exchanges are permitted within 15 days; original packaging required.&quot;</span>},
    {<span class="hljs-string">&quot;doc_id&quot;</span>: <span class="hljs-string">&quot;FAQ-101&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;Shipping Time&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>: <span class="hljs-string">&quot;Standard shipping usually takes 3–5 business days within the country.&quot;</span>},
]
<span class="hljs-comment"># 4) Generate embeddings using OpenAI (you can replace this with another embedding service)</span>
<span class="hljs-comment"># Here we use Parlant’s built-in OpenAI embedder for simplicity, but you could also call the OpenAI SDK directly.</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">OpenAIEmbedder</span>(p.Embedder):
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">embed</span>(<span class="hljs-params">self, texts: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>], hints: <span class="hljs-type">Dict</span>[<span class="hljs-built_in">str</span>, <span class="hljs-type">Any</span>] = {}</span>) -&gt; p.EmbeddingResult:
        <span class="hljs-comment"># Generate text embeddings using the OpenAI API, with timeout and retry handling</span>
        <span class="hljs-keyword">import</span> openai
        <span class="hljs-keyword">try</span>:
            client = openai.AsyncOpenAI(
                api_key=OPENAI_API_KEY,
                timeout=<span class="hljs-number">60.0</span>,  <span class="hljs-comment"># 60-second timeout</span>
                max_retries=<span class="hljs-number">2</span>  <span class="hljs-comment"># Retry up to 2 times</span>
            )
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Generating embeddings for <span class="hljs-subst">{<span class="hljs-built_in">len</span>(texts)}</span> texts...&quot;</span>)
            response = <span class="hljs-keyword">await</span> client.embeddings.create(
                model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>,
                <span class="hljs-built_in">input</span>=texts
            )
            vectors = [data.embedding <span class="hljs-keyword">for</span> data <span class="hljs-keyword">in</span> response.data]
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Successfully generated <span class="hljs-subst">{<span class="hljs-built_in">len</span>(vectors)}</span> embeddings.&quot;</span>)
            <span class="hljs-keyword">return</span> p.EmbeddingResult(vectors=vectors)
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;OpenAI API call failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-comment"># Return mock vectors for testing Milvus connectivity</span>
            <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Using mock vectors for testing...&quot;</span>)
            <span class="hljs-keyword">import</span> random
            vectors = [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">1536</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> texts]
            <span class="hljs-keyword">return</span> p.EmbeddingResult(vectors=vectors)
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">id</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">max_tokens</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">int</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-number">8192</span>
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">tokenizer</span>(<span class="hljs-params">self</span>) -&gt; p.EstimatingTokenizer:
        <span class="hljs-keyword">from</span> parlant.core.nlp.tokenization <span class="hljs-keyword">import</span> ZeroEstimatingTokenizer
        <span class="hljs-keyword">return</span> ZeroEstimatingTokenizer()
<span class="hljs-meta">    @property</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">dimensions</span>(<span class="hljs-params">self</span>) -&gt; <span class="hljs-built_in">int</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-number">1536</span>
embedder = OpenAIEmbedder()
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">ensure_collection_and_load</span>():
    <span class="hljs-comment"># Create the collection (schema: primary key, vector field, additional fields)</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> client.has_collection(COLLECTION):
        client.create_collection(
            collection_name=COLLECTION,
            dimension=<span class="hljs-built_in">len</span>((<span class="hljs-keyword">await</span> embedder.embed([<span class="hljs-string">&quot;dimension_probe&quot;</span>])).vectors[<span class="hljs-number">0</span>]),
            <span class="hljs-comment"># Default metric: COSINE (can be changed with metric_type=&quot;COSINE&quot;)</span>
            auto_id=<span class="hljs-literal">True</span>,
        )
        <span class="hljs-comment"># Create an index to speed up retrieval (HNSW used here as an example)</span>
        client.create_index(
            collection_name=COLLECTION,
            field_name=<span class="hljs-string">&quot;vector&quot;</span>,
            index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
            metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
            params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">32</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>}
        )
    <span class="hljs-comment"># Insert data (skip if already exists; simple idempotent logic for the demo)</span>
    <span class="hljs-comment"># Generate embeddings</span>
    chunks = [d[<span class="hljs-string">&quot;chunk&quot;</span>] <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> DOCS]
    embedding_result = <span class="hljs-keyword">await</span> embedder.embed(chunks)
    vectors = embedding_result.vectors
    <span class="hljs-comment"># Check if the same doc_id already exists; this is for demo purposes only — real applications should use stricter deduplication</span>
    <span class="hljs-comment"># Here we insert directly. In production, use an upsert operation or an explicit primary key</span>
    client.insert(
        COLLECTION,
        data=[
            {<span class="hljs-string">&quot;vector&quot;</span>: vectors[i], <span class="hljs-string">&quot;doc_id&quot;</span>: DOCS[i][<span class="hljs-string">&quot;doc_id&quot;</span>], <span class="hljs-string">&quot;title&quot;</span>: DOCS[i][<span class="hljs-string">&quot;title&quot;</span>], <span class="hljs-string">&quot;chunk&quot;</span>: DOCS[i][<span class="hljs-string">&quot;chunk&quot;</span>]}
            <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(DOCS))
        ],
    )
    <span class="hljs-comment"># Load into memory</span>
    client.load_collection(COLLECTION)
<span class="hljs-comment"># 5) Define the vector search tool (Parlant Tool)</span>
<span class="hljs-meta">@p.tool</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">vector_search</span>(<span class="hljs-params">context: p.ToolContext, query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span>, min_score: <span class="hljs-built_in">float</span> = <span class="hljs-number">0.35</span></span>) -&gt; p.ToolResult:
    <span class="hljs-comment"># 5.1 Generate the query vector</span>
    embed_res = <span class="hljs-keyword">await</span> embedder.embed([query])
    qvec = embed_res.vectors[<span class="hljs-number">0</span>]
    <span class="hljs-comment"># 5.2 Search Milvus</span>
    results = client.search(
        collection_name=COLLECTION,
        data=[qvec],
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;doc_id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;chunk&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">128</span>}},
    )
    <span class="hljs-comment"># 5.3 Assemble structured evidence and filter by score threshold</span>
    hits = []
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
        score = hit[<span class="hljs-string">&quot;distance&quot;</span>] <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;distance&quot;</span> <span class="hljs-keyword">in</span> hit <span class="hljs-keyword">else</span> hit.get(<span class="hljs-string">&quot;score&quot;</span>, <span class="hljs-number">0.0</span>)
        <span class="hljs-keyword">if</span> score &gt;= min_score:
            hits.append({
                <span class="hljs-string">&quot;doc_id&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;doc_id&quot;</span>],
                <span class="hljs-string">&quot;title&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;title&quot;</span>],
                <span class="hljs-string">&quot;chunk&quot;</span>: hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;chunk&quot;</span>],
                <span class="hljs-string">&quot;score&quot;</span>: <span class="hljs-built_in">float</span>(score),
            })
    <span class="hljs-keyword">return</span> p.ToolResult({<span class="hljs-string">&quot;evidence&quot;</span>: hits})
<span class="hljs-comment"># 6) Run Parlant Server and create the Agent + Guidelines</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    <span class="hljs-keyword">await</span> ensure_collection_and_load()
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">with</span> p.Server() <span class="hljs-keyword">as</span> server:
        agent = <span class="hljs-keyword">await</span> server.create_agent(
            name=<span class="hljs-string">&quot;Policy Assistant&quot;</span>,
            description=<span class="hljs-string">&quot;Rule-controlled RAG assistant with Milvus Lite&quot;</span>,
        )
        <span class="hljs-comment"># Example variable: current time (can be used in templates or logs)</span>
<span class="hljs-meta">        @p.tool</span>
        <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">get_datetime</span>(<span class="hljs-params">context: p.ToolContext</span>) -&gt; p.ToolResult:
            <span class="hljs-keyword">from</span> datetime <span class="hljs-keyword">import</span> datetime
            <span class="hljs-keyword">return</span> p.ToolResult({<span class="hljs-string">&quot;now&quot;</span>: datetime.now().isoformat()})
        <span class="hljs-keyword">await</span> agent.create_variable(name=<span class="hljs-string">&quot;current-datetime&quot;</span>, tool=get_datetime)
        <span class="hljs-comment"># Core Guideline 1: Run vector search for factual or policy-related questions</span>
        <span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;User asks a factual question about policy, refund, exchange, or shipping&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Call vector_search with the user&#x27;s query. &quot;</span>
                <span class="hljs-string">&quot;If evidence is found, synthesize an answer by quoting key sentences and cite doc_id/title. &quot;</span>
                <span class="hljs-string">&quot;If evidence is insufficient, ask a clarifying question before answering.&quot;</span>
            ),
            tools=[vector_search],
        )
        <span class="hljs-comment"># Core Guideline 2: Use a standardized, structured response when evidence is available</span>
        <span class="hljs-keyword">await</span> agent.create_guideline(
            condition=<span class="hljs-string">&quot;Evidence is available&quot;</span>,
            action=(
                <span class="hljs-string">&quot;Answer with the following template:\\n&quot;</span>
                <span class="hljs-string">&quot;Summary: provide a concise conclusion.\\n&quot;</span>
                <span class="hljs-string">&quot;Key points: 2-3 bullets distilled from evidence.\\n&quot;</span>
                <span class="hljs-string">&quot;Sources: list doc_id and title.\\n&quot;</span>
                <span class="hljs-string">&quot;Note: if confidence is low, state limitations and ask for clarification.&quot;</span>
            ),
            tools=[],
        )
        <span class="hljs-comment"># Hint: Local Playground URL</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Playground: &lt;http://localhost:8800&gt;&quot;</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    asyncio.run(main())
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Run-the-Code" class="common-anchor-header">Paso 4: Ejecutar el código</h3><pre><code translate="no"><span class="hljs-comment"># Run the main program</span>
python main.py
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/python_main_eb7d7c6d73.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ul>
<li>Visite el Playground:</li>
</ul>
<pre><code translate="no">&lt;<span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:8800&gt;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Ahora has construido con éxito un sistema inteligente de preguntas y respuestas utilizando Parlant y Milvus.</p>
<h2 id="Parlant-vs-LangChainLlamaIndex-How-They-Differ-and-How-They-Work-Together" class="common-anchor-header">Parlant vs. LangChain/LlamaIndex: En qué se diferencian y cómo trabajan juntos<button data-href="#Parlant-vs-LangChainLlamaIndex-How-They-Differ-and-How-They-Work-Together" class="anchor-icon" translate="no">
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
    </button></h2><p>¿En qué se diferencia Parlant de otros marcos de agentes como <strong>LangChain</strong> o <strong>LlamaIndex</strong>?</p>
<p>LangChain y LlamaIndex son marcos de propósito general. Ofrecen una amplia gama de componentes e integraciones, lo que los hace ideales para la creación rápida de prototipos y experimentos de investigación. Sin embargo, cuando se trata de desplegar en producción, los desarrolladores a menudo necesitan construir ellos mismos capas adicionales -como gestión de reglas, comprobaciones de cumplimiento y mecanismos de fiabilidad- para mantener la coherencia y la fiabilidad de los agentes.</p>
<p>Parlant ofrece gestión de directrices integrada, mecanismos de autocrítica y herramientas de explicabilidad que ayudan a los desarrolladores a gestionar cómo se comporta, responde y razona un agente. Esto hace que Parlant sea especialmente adecuado para casos de uso de alto riesgo y de cara al cliente en los que la precisión y la responsabilidad son importantes, como las finanzas, la sanidad y los servicios jurídicos.</p>
<p>De hecho, estos marcos pueden funcionar juntos:</p>
<ul>
<li><p>Utiliza LangChain para crear complejos canales de procesamiento de datos o flujos de trabajo de recuperación.</p></li>
<li><p>Utilice Parlant para gestionar la capa de interacción final, garantizando que los resultados sigan las normas empresariales y sean interpretables.</p></li>
<li><p>Utilizar Milvus como base de datos vectorial para ofrecer búsqueda semántica en tiempo real, memoria y recuperación de conocimientos en todo el sistema.</p></li>
</ul>
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
    </button></h2><p>A medida que los agentes LLM pasan de la experimentación a la producción, la pregunta clave ya no es qué pueden hacer, sino cómo de fiables y seguros pueden hacerlo. Parlant proporciona la estructura y el control para esa fiabilidad, mientras que Milvus proporciona la infraestructura vectorial escalable que mantiene todo rápido y consciente del contexto.</p>
<p>Juntos, permiten a los desarrolladores crear agentes de IA que no solo son capaces, sino fiables, explicables y listos para la producción.</p>
<p>🚀 Echa un vistazo a<a href="https://github.com/emcie-co/parlant?utm_source=chatgpt.com"> Parlant en GitHub</a> e intégralo con<a href="https://milvus.io"> Milvus</a> para construir tu propio sistema de agente inteligente basado en reglas.</p>
<p>Tienes preguntas o quieres una inmersión profunda en alguna característica? Únase a nuestro<a href="https://discord.com/invite/8uyFbECzPX"> canal de Discord</a> o envíe incidencias a<a href="https://github.com/milvus-io/milvus"> GitHub</a>. También puede reservar una sesión individual de 20 minutos para obtener información, orientación y respuestas a sus preguntas a través de<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
