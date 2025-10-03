---
id: >-
  when-context-engineering-is-done-right-hallucinations-can-spark-ai-creativity.md
title: >-
  Cuando la ingeniería contextual se hace bien, las alucinaciones pueden ser la
  chispa de la creatividad de la IA
author: James Luan
date: 2025-09-30T00:00:00.000Z
desc: >-
  Descubra por qué las alucinaciones de la IA no son meros errores, sino chispas
  de creatividad, y cómo la ingeniería contextual las convierte en resultados
  fiables para el mundo real.
cover: assets.zilliz.com/Chat_GPT_Image_Oct_1_2025_10_42_15_AM_101639b3bf.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, AI Agents, Context Engineering'
meta_keywords: 'Milvus, vector database, AI Agents, Context Engineering'
meta_title: |
  If Context Engineering Done Right, Hallucinations Can Spark AI Creativity
origin: >-
  https://milvus.io/blog/when-context-engineering-is-done-right-hallucinations-can-spark-ai-creativity.md
---
<p>Durante mucho tiempo, muchos de nosotros -incluido yo mismo- tratamos las alucinaciones LLM como simples defectos. Se ha construido toda una cadena de herramientas en torno a su eliminación: sistemas de recuperación, barandillas de seguridad, ajuste fino y mucho más. Estas salvaguardas siguen siendo valiosas. Pero cuanto más he estudiado cómo los modelos generan realmente respuestas -y cómo sistemas como <a href="https://milvus.io/"><strong>Milvus</strong></a> encajan en conductos de IA más amplios- menos creo que las alucinaciones sean simplemente fallos. De hecho, también pueden ser la chispa de la creatividad de la IA.</p>
<p>Si nos fijamos en la creatividad humana, encontramos el mismo patrón. Todos los avances se basan en saltos imaginativos. Pero esos saltos nunca surgen de la nada. Los poetas primero dominan el ritmo y la métrica antes de romper las reglas. Los científicos se basan en teorías establecidas antes de aventurarse en terrenos desconocidos. El progreso depende de estos saltos, siempre que se basen en un conocimiento y una comprensión sólidos.</p>
<p>Los LLM funcionan de forma muy parecida. Sus llamadas "alucinaciones" o "saltos" - analogías, asociaciones y extrapolaciones - surgen del mismo proceso generativo que permite a los modelos establecer conexiones, ampliar conocimientos y sacar a la superficie ideas que van más allá de lo que se les ha enseñado explícitamente. No todos los saltos tienen éxito, pero cuando lo tienen, los resultados pueden ser convincentes.</p>
<p>Por eso considero que <strong>la ingeniería del contexto</strong> es el siguiente paso fundamental. En lugar de intentar eliminar todas las alucinaciones, deberíamos centrarnos en <em>dirigirlas</em>. Diseñando el contexto adecuado, podemos alcanzar un equilibrio: mantener los modelos lo bastante imaginativos como para explorar nuevos terrenos y, al mismo tiempo, garantizar que sigan estando lo bastante anclados como para que se pueda confiar en ellos.</p>
<h2 id="What-is-Context-Engineering" class="common-anchor-header">¿Qué es la ingeniería del contexto?<button data-href="#What-is-Context-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>¿Qué entendemos exactamente por <em>ingeniería contextual</em>? Puede que el término sea nuevo, pero la práctica lleva años evolucionando. Técnicas como RAG, prompting, llamada a funciones y MCP son los primeros intentos de resolver el mismo problema: proporcionar a los modelos el entorno adecuado para producir resultados útiles. La ingeniería del contexto consiste en unificar estos enfoques en un marco coherente.</p>
<h2 id="The-Three-Pillars-of-Context-Engineering" class="common-anchor-header">Los tres pilares de la ingeniería contextual<button data-href="#The-Three-Pillars-of-Context-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>La ingeniería de contexto eficaz se basa en tres capas interconectadas:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/context_engineering_1_8f2b39c5e7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="1-The-Instructions-Layer--Defining-Direction" class="common-anchor-header">1. 1. La capa de instrucciones: definir la dirección</h3><p>Esta capa incluye indicaciones, ejemplos breves y demostraciones. Es el sistema de navegación del modelo: no se trata de un vago "ve hacia el norte", sino de una ruta clara con puntos de referencia. Las instrucciones bien estructuradas establecen límites, definen objetivos y reducen la ambigüedad en el comportamiento del modelo.</p>
<h3 id="2-The-Knowledge-Layer--Supplying-Ground-Truth" class="common-anchor-header">2. 2. La capa de conocimiento: la verdad sobre el terreno</h3><p>Aquí colocamos los hechos, el código, los documentos y el estado que el modelo necesita para razonar con eficacia. Sin esta capa, el sistema improvisa a partir de una memoria incompleta. Con ella, el modelo puede basar sus resultados en datos específicos del dominio. Cuanto más preciso y pertinente sea el conocimiento, más fiable será el razonamiento.</p>
<h3 id="3-The-Tools-Layer--Enabling-Action-and-Feedback" class="common-anchor-header">3. La capa de herramientas: permitir la acción y la retroalimentación</h3><p>Esta capa abarca las API, las llamadas a funciones y las integraciones externas. Es lo que permite al sistema pasar del razonamiento a la ejecución: recuperar datos, realizar cálculos o activar flujos de trabajo. Y lo que es igual de importante, estas herramientas proporcionan información en tiempo real que puede incorporarse al razonamiento del modelo. Esa información es la que permite corregir, adaptar y mejorar continuamente. En la práctica, esto es lo que transforma a los LLM de respondedores pasivos en participantes activos en un sistema.</p>
<p>Estas capas no son compartimentos estancos, sino que se refuerzan mutuamente. Las instrucciones fijan el destino, los conocimientos proporcionan la información con la que trabajar y las herramientas transforman las decisiones en acciones y retroalimentan los resultados. Bien orquestadas, crean un entorno en el que los modelos pueden ser creativos y fiables.</p>
<h2 id="The-Long-Context-Challenges-When-More-Becomes-Less" class="common-anchor-header">Los retos del contexto a largo plazo: Cuando más se convierte en menos<button data-href="#The-Long-Context-Challenges-When-More-Becomes-Less" class="anchor-icon" translate="no">
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
    </button></h2><p>Muchos modelos de IA anuncian ahora ventanas de millones de tokens, suficientes para unas 75.000 líneas de código o un documento de 750.000 palabras. Pero más contexto no produce automáticamente mejores resultados. En la práctica, los contextos muy largos introducen distintos modos de fallo que pueden degradar el razonamiento y la fiabilidad.</p>
<h3 id="Context-Poisoning--When-Bad-Information-Spreads" class="common-anchor-header">Envenenamiento del contexto: cuando la información errónea se propaga</h3><p>Una vez que la información falsa entra en el contexto de trabajo -ya sea en objetivos, resúmenes o estados intermedios- puede descarrilar todo el proceso de razonamiento. <a href="https://arxiv.org/pdf/2507.06261">El informe Gemini 2.5 de DeepMind</a> ofrece un claro ejemplo. Un agente LLM que jugaba a Pokémon malinterpretó el estado del juego y decidió que su misión era "atrapar al legendario imposible de atrapar". Ese objetivo incorrecto se registró como un hecho, lo que llevó al agente a generar estrategias elaboradas pero imposibles.</p>
<p>Como se muestra en el siguiente extracto, el contexto envenenado atrapó al modelo en un bucle: repitiendo errores, ignorando el sentido común y reforzando el mismo error hasta que todo el proceso de razonamiento se vino abajo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_1_Excerpt_from_Gemini_2_5_Tech_Paper_e89adf9eed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura 1: Extracto <a href="https://arxiv.org/pdf/2507.06261">del documento técnico de Gemini 2.5</a></p>
<h3 id="Context-Distraction--Lost-in-the-Details" class="common-anchor-header">Distracción del contexto: perderse en los detalles</h3><p>A medida que se amplían las ventanas de contexto, los modelos pueden empezar a sobredimensionar la transcripción e infrautilizar lo aprendido durante el entrenamiento. Gemini 2.5 Pro de DeepMind, por ejemplo, admite una ventana de un millón de <a href="https://arxiv.org/pdf/2507.06261">tokens</a>, pero <a href="https://arxiv.org/pdf/2507.06261">comienza a desviarse en torno a los 100.000 tokens, reciclando</a>acciones pasadas en lugar de generar nuevas estrategias. <a href="https://www.databricks.com/blog/long-context-rag-performance-llms">La investigación de Databricks</a> muestra que los modelos más pequeños, como Llama 3.1-405B, alcanzan ese límite mucho antes, en torno a los ~32.000 tokens. Es un efecto humano familiar: demasiada lectura de fondo y se pierde el hilo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_2_Excerpt_from_Gemini_2_5_Tech_Paper_56d775c59d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura 2: Extracto <a href="https://arxiv.org/pdf/2507.06261">del documento técnico de Gemini 2.5</a></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_3_Long_context_performance_of_GPT_Claude_Llama_Mistral_and_DBRX_models_on_4_curated_RAG_datasets_Databricks_Docs_QA_Finance_Bench_Hot_Pot_QA_and_Natural_Questions_Source_Databricks_99086246b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 3: Rendimiento en contexto largo de los modelos GPT, Claude, Llama, Mistral y DBRX en 4 conjuntos de datos RAG (</em> <a href="https://www.databricks.com/blog/long-context-rag-performance-llms"><em>Databricks</em></a><em>DocsQA, FinanceBench, HotPotQA y Natural Questions) [Fuente:</em> <a href="https://www.databricks.com/blog/long-context-rag-performance-llms"><em>Databricks</em></a><em>].</em></p>
<h3 id="Context-Confusion--Too-Many-Tools-in-the-Kitchen" class="common-anchor-header">Confusión contextual - Demasiadas herramientas en la cocina</h3><p>Añadir más herramientas no siempre ayuda. El <a href="https://gorilla.cs.berkeley.edu/leaderboard.html">Berkeley Function-Calling Leaderboard</a> muestra que cuando el contexto muestra extensos menús de herramientas -a menudo con muchas opciones irrelevantes- la fiabilidad del modelo disminuye, y se invocan herramientas incluso cuando no se necesita ninguna. Un ejemplo claro: un cuantificado Llama 3.1-8B falló con 46 herramientas disponibles, pero tuvo éxito cuando el conjunto se redujo a 19. Es la paradoja de la elección para los sistemas de IA: demasiadas opciones, peores decisiones.</p>
<h3 id="Context-Clash--When-Information-Conflicts" class="common-anchor-header">Choque de contextos: cuando la información entra en conflicto</h3><p>Las interacciones multiturno añaden un modo de fallo distinto: los primeros malentendidos se agravan a medida que el diálogo se ramifica. En <a href="https://arxiv.org/pdf/2505.06120v1">los experimentos de Microsoft y Salesforce</a>, tanto los LLM de ponderación abierta como los de ponderación cerrada obtuvieron resultados notablemente peores en las configuraciones de varios turnos que en las de un solo turno: una caída media del 39% en seis tareas de generación. Una vez que una suposición errónea entra en el estado de conversación, los turnos posteriores la heredan y amplifican el error.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_4_LL_Ms_get_lost_in_multi_turn_conversations_in_experiments_21f194b02d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 4: Los LLM se pierden en conversaciones multiturno en los experimentos</em></p>
<p>El efecto aparece incluso en los modelos de frontera. Cuando las tareas de referencia se distribuyeron por turnos, la puntuación de rendimiento del modelo o3 de OpenAI cayó de <strong>98,1</strong> a <strong>64,1 puntos</strong>. Un error de lectura inicial "fija" de hecho el modelo del mundo; cada respuesta se basa en él, convirtiendo una pequeña contradicción en un punto ciego endurecido a menos que se corrija explícitamente.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_4_The_performance_scores_in_LLM_multi_turn_conversation_experiments_414d3a0b3f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 4: Puntuaciones de rendimiento en experimentos de conversación multiturno LLM</em></p>
<h2 id="Six-Strategies-to-Tame-Long-Context" class="common-anchor-header">Seis estrategias para domar el contexto largo<button data-href="#Six-Strategies-to-Tame-Long-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>La respuesta a los retos del contexto largo no es abandonar la capacidad, sino diseñarla con disciplina. He aquí seis estrategias que han funcionado en la práctica:</p>
<h3 id="Context-Isolation" class="common-anchor-header">Aislamiento del contexto</h3><p>Divida los flujos de trabajo complejos en agentes especializados con contextos aislados. Cada agente se centra en su propio ámbito sin interferencias, lo que reduce el riesgo de propagación de errores. Esto no sólo mejora la precisión, sino que también permite la ejecución en paralelo, de forma muy similar a un equipo de ingeniería bien estructurado.</p>
<h3 id="Context-Pruning" class="common-anchor-header">Poda del contexto</h3><p>Audite y recorte periódicamente el contexto. Elimine detalles redundantes, información obsoleta y rastros irrelevantes. Piense en ello como en una refactorización: elimine el código muerto y las dependencias, dejando sólo lo esencial. Una poda eficaz requiere criterios explícitos sobre lo que pertenece y lo que no.</p>
<h3 id="Context-Summarization" class="common-anchor-header">Resumir el contexto</h3><p>Los historiales largos no tienen por qué cargarse por completo. En su lugar, hay que condensarlas en resúmenes concisos que recojan sólo lo esencial para el siguiente paso. Un buen resumen conserva los hechos, las decisiones y las limitaciones fundamentales, al tiempo que elimina las repeticiones y los detalles innecesarios. Es como sustituir una especificación de 200 páginas por un resumen de diseño de una página que te sigue dando todo lo que necesitas para avanzar.</p>
<h3 id="Context-Offloading" class="common-anchor-header">Descarga de contexto</h3><p>No es necesario que todos los detalles formen parte del contexto real. Persista los datos no críticos en sistemas externos -bases de conocimiento, almacenes de documentos o bases de datos vectoriales como Milvus- y recupérelos sólo cuando sea necesario. De este modo se aligera la carga cognitiva del modelo al tiempo que se mantiene accesible la información de fondo.</p>
<h3 id="Strategic-RAG" class="common-anchor-header">GAR estratégica</h3><p>La recuperación de información sólo es potente si es selectiva. Introduzca conocimientos externos mediante un filtrado riguroso y controles de calidad, asegurándose de que el modelo consume datos relevantes y precisos. Como ocurre con cualquier canal de datos: basura entra, basura sale, pero con una recuperación de alta calidad, el contexto se convierte en un activo, no en un pasivo.</p>
<h3 id="Optimized-Tool-Loading" class="common-anchor-header">Carga optimizada de herramientas</h3><p>Más herramientas no significa mejor rendimiento. Los estudios demuestran que la fiabilidad disminuye drásticamente por encima de las 30 herramientas disponibles. Cargue sólo las funciones que requiere una tarea determinada y bloquee el acceso al resto. Una caja de herramientas reducida fomenta la precisión y reduce el ruido que puede saturar la toma de decisiones.</p>
<h2 id="The-Infrastructure-Challenge-of-Context-Engineering" class="common-anchor-header">El reto infraestructural de la ingeniería contextual<button data-href="#The-Infrastructure-Challenge-of-Context-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>La eficacia de la ingeniería contextual depende de la infraestructura sobre la que se ejecuta. Y las empresas actuales se enfrentan a una tormenta perfecta de retos relacionados con los datos:</p>
<h3 id="Scale-Explosion--From-Terabytes-to-Petabytes" class="common-anchor-header">Explosión de escala: de terabytes a petabytes</h3><p>Hoy en día, el crecimiento de los datos ha redefinido la línea de base. Las cargas de trabajo que antes cabían cómodamente en una sola base de datos ahora abarcan petabytes, exigiendo almacenamiento y computación distribuidos. Un cambio de esquema que solía ser una actualización SQL de una sola línea puede convertirse en un esfuerzo de orquestación completo a través de clústeres, canalizaciones y servicios. El escalado no consiste simplemente en añadir hardware, sino en diseñar la coordinación, la resistencia y la elasticidad a una escala en la que cada suposición se somete a pruebas de estrés.</p>
<h3 id="Consumption-Revolution--Systems-That-Speak-AI" class="common-anchor-header">Revolución del consumo: sistemas que hablan IA</h3><p>Los agentes de IA no sólo consultan datos, sino que los generan, transforman y consumen continuamente a velocidades de máquina. La infraestructura diseñada sólo para aplicaciones orientadas al ser humano no puede seguirles el ritmo. Para dar soporte a los agentes, los sistemas deben proporcionar recuperación de baja latencia, actualizaciones de flujo y cargas de trabajo de escritura pesada sin interrupciones. En otras palabras, la pila de infraestructura debe construirse para "hablar de IA" como su carga de trabajo nativa, no como una ocurrencia tardía.</p>
<h3 id="Multimodal-Complexity--Many-Data-Types-One-System" class="common-anchor-header">Complejidad multimodal: muchos tipos de datos, un sistema</h3><p>Las cargas de trabajo de la IA mezclan texto, imágenes, audio, vídeo e incrustaciones de alta dimensión, cada uno con ricos metadatos adjuntos. Gestionar esta heterogeneidad es el quid de la ingeniería contextual práctica. El reto no consiste sólo en almacenar objetos diversos, sino también en indexarlos, recuperarlos eficazmente y mantener la coherencia semántica entre las distintas modalidades. Una infraestructura verdaderamente preparada para la IA debe tratar la multimodalidad como un principio de diseño de primera clase, no como una característica añadida.</p>
<h2 id="Milvus-+-Loon-Purpose-Built-Data-Infrastructure-for-AI" class="common-anchor-header">Milvus + Loon: Infraestructura de datos específica para la IA<button data-href="#Milvus-+-Loon-Purpose-Built-Data-Infrastructure-for-AI" class="anchor-icon" translate="no">
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
    </button></h2><p>Los retos de la escala, el consumo y la multimodalidad no pueden resolverse sólo con teoría: exigen una infraestructura diseñada específicamente para la IA. Por eso, en <a href="https://zilliz.com/">Zilliz</a> hemos diseñado <strong>Milvus</strong> y <strong>Loon</strong> para que trabajen juntos, abordando ambos lados del problema: la recuperación de alto rendimiento en tiempo de ejecución y el procesamiento de datos a gran escala.</p>
<ul>
<li><p><a href="https://milvus.io/"><strong>Milvus</strong></a>: la base de datos vectorial de código abierto más adoptada y optimizada para la recuperación y el almacenamiento de vectores de alto rendimiento.</p></li>
<li><p><strong>Loon</strong>: nuestro próximo servicio de lago de datos multimodal nativo en la nube diseñado para procesar y organizar datos multimodales a gran escala antes de que lleguen a la base de datos. Esté atento.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/loon_milvus_min_76aaa39b4e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Lightning-Fast-Vector-Search" class="common-anchor-header">Búsqueda vectorial ultrarrápida</h3><p><strong>Milvus</strong> está diseñado desde cero para cargas de trabajo vectoriales. Como capa de servicio, ofrece una recuperación inferior a 10 ms en cientos de millones -o incluso miles de millones- de vectores, ya sean derivados de texto, imágenes, audio o vídeo. Para las aplicaciones de Inteligencia Artificial, la velocidad de recuperación no es un "detalle". Es lo que determina si un agente se siente receptivo o lento, si un resultado de búsqueda parece relevante o fuera de lugar. En este caso, el rendimiento se refleja directamente en la experiencia del usuario final.</p>
<h3 id="Multimodal-Data-Lake-Service-at-Scale" class="common-anchor-header">Servicio de lago de datos multimodal a escala</h3><p><strong>Loon</strong> es nuestro próximo servicio de lago de datos multimodal, diseñado para el procesamiento y análisis offline a gran escala de datos no estructurados. Complementa a Milvus en el lado de la canalización, preparando los datos antes de que lleguen a la base de datos. Los conjuntos de datos multimodales del mundo real -que abarcan texto, imágenes, audio y vídeo- suelen estar desordenados, con duplicaciones, ruido y formatos incoherentes. Loon se encarga de este trabajo pesado utilizando marcos distribuidos como Ray y Daft, comprimiendo, deduplicando y agrupando los datos antes de transmitirlos directamente a Milvus. El resultado es sencillo: sin cuellos de botella en la puesta en escena, sin dolorosas conversiones de formato, sólo datos limpios y estructurados que los modelos pueden utilizar inmediatamente.</p>
<h3 id="Cloud-Native-Elasticity" class="common-anchor-header">Elasticidad nativa de la nube</h3><p>Ambos sistemas son nativos de la nube, con escalabilidad independiente de almacenamiento y computación. Esto significa que a medida que las cargas de trabajo crecen de gigabytes a petabytes, puede equilibrar los recursos entre el servicio en tiempo real y la formación fuera de línea, en lugar de sobreaprovisionar uno o reducir el otro.</p>
<h3 id="Future-Proof-Architecture" class="common-anchor-header">Arquitectura preparada para el futuro</h3><p>Y lo que es más importante, esta arquitectura está diseñada para crecer con usted. La ingeniería contextual sigue evolucionando. En estos momentos, la mayoría de los equipos se centran en la búsqueda semántica y en las canalizaciones RAG. Pero la próxima ola exigirá más: integración de múltiples tipos de datos, razonamiento entre ellos y flujos de trabajo impulsados por agentes.</p>
<p>Con Milvus y Loon, esa transición no requiere arrancar los cimientos. La misma pila que soporta los casos de uso actuales puede extenderse de forma natural a los futuros. Puede añadir nuevas capacidades sin tener que empezar de nuevo, lo que significa menos riesgos, menos costes y un camino más sencillo a medida que las cargas de trabajo de IA se vuelven más complejas.</p>
<h2 id="Your-Next-Move" class="common-anchor-header">Su próximo paso<button data-href="#Your-Next-Move" class="anchor-icon" translate="no">
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
    </button></h2><p>La ingeniería contextual no es sólo otra disciplina técnica: es la forma en que liberamos el potencial creativo de la IA al mismo tiempo que la mantenemos conectada a tierra y fiable. Si está listo para poner en práctica estas ideas, empiece por donde más importa.</p>
<ul>
<li><p><a href="https://milvus.io/docs/overview.md"><strong>Experimente con Milvus</strong></a> para ver cómo las bases de datos vectoriales pueden anclar la recuperación en despliegues del mundo real.</p></li>
<li><p><a href="https://www.linkedin.com/company/the-milvus-project/"><strong>Siga a Milvus</strong></a> para estar al día sobre el lanzamiento de Loon y para obtener información sobre la gestión de datos multimodales a gran escala.</p></li>
<li><p><a href="https://discord.com/invite/8uyFbECzPX"><strong>Únase a la comunidad Zilliz en Discord</strong></a> para compartir estrategias, comparar arquitecturas y ayudar a dar forma a las mejores prácticas.</p></li>
</ul>
<p>Las empresas que dominen hoy la ingeniería contextual conformarán el panorama de la IA del mañana. No deje que la infraestructura sea una limitación: construya los cimientos que merece su creatividad en IA.</p>
