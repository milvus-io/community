---
id: harness-engineering-ai-agents.md
title: >-
  Ingeniería de aprovechamiento: La capa de ejecución que necesitan los agentes
  de IA
author: Min Yin
date: 2026-4-9
cover: assets.zilliz.com/05842e3a_b21b_41c9_9d29_13b8d7afa211_428ab449a7.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  harness engineering, AI agent infrastructure, hybrid search, Milvus 2.6,
  Sparse-BM25
meta_title: |
  What Is Harness Engineering for AI Agents? | Milvus
desc: >-
  Harness Engineering construye el entorno de ejecución en torno a los agentes
  autónomos de IA. Descubre qué es, cómo lo utiliza OpenAI y por qué requiere
  una búsqueda híbrida.
origin: 'https://milvus.io/blog/harness-engineering-ai-agents.md'
---
<p>Mitchell Hashimoto creó HashiCorp y Terraform. En febrero de 2026, publicó <a href="https://mitchellh.com/writing/my-ai-adoption-journey">un blog</a> en el que describía un hábito que había desarrollado al trabajar con agentes de IA: cada vez que un agente cometía un error, diseñaba una solución permanente en el entorno del agente. Lo llamó "ingeniería del arnés". En pocas semanas, <a href="https://openai.com/index/harness-engineering/">OpenAI</a> y <a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">Anthropic</a> publicaron artículos de ingeniería que ampliaban la idea. El término " <em>ingeniería del arnés</em> " había llegado.</p>
<p>Resonó porque nombra un problema al que todos los ingenieros que construyen <a href="https://zilliz.com/glossary/ai-agents">agentes de IA</a> ya se han enfrentado. La <a href="https://zilliz.com/glossary/prompt-as-code-(prompt-engineering)">ingeniería rápida</a> consigue mejores resultados en un solo turno. La ingeniería de contexto gestiona lo que ve el modelo. Pero ninguna de ellas aborda lo que ocurre cuando un agente funciona de forma autónoma durante horas, tomando cientos de decisiones sin supervisión. Ese es el vacío que cubre la ingeniería de arneses, y casi siempre depende de la búsqueda híbrida (híbrida de texto completo y búsqueda semántica) para funcionar.</p>
<h2 id="What-Is-Harness-Engineering" class="common-anchor-header">¿Qué es la ingeniería de arneses?<button data-href="#What-Is-Harness-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>La ingeniería de arneses es la disciplina que consiste en diseñar el entorno de ejecución en torno a un agente de IA autónomo. Define qué herramientas puede utilizar el agente, de dónde obtiene la información, cómo valida sus propias decisiones y cuándo debe detenerse.</p>
<p>Para entender por qué es importante, considere tres capas de desarrollo de agentes de IA:</p>
<table>
<thead>
<tr><th>Capa</th><th>Qué optimiza</th><th>Alcance</th><th>Ejemplo</th></tr>
</thead>
<tbody>
<tr><td><strong>Ingeniería de instrucciones</strong></td><td>Lo que se le dice al modelo</td><td>Intercambio único</td><td>Ejemplos de pocas palabras, indicaciones de la cadena de pensamiento</td></tr>
<tr><td><strong>Ingeniería del contexto</strong></td><td>Lo que el modelo puede ver</td><td><a href="https://zilliz.com/glossary/context-window">Ventana de contexto</a></td><td>Recuperación de documentos, compresión del historial</td></tr>
<tr><td><strong>Ingeniería del entorno</strong></td><td>El mundo en el que opera el agente</td><td>Ejecución autónoma durante varias horas</td><td>Herramientas, lógica de validación, restricciones arquitectónicas</td></tr>
</tbody>
</table>
<p><strong>Prompt</strong> Engineering optimiza la calidad de un único intercambio: fraseo, estructura, ejemplos. Una conversación, un resultado.</p>
<p>La<strong>ingeniería de contexto</strong> gestiona la cantidad de información que el modelo puede ver a la vez: qué documentos recuperar, cómo comprimir el historial, qué cabe en la ventana de contexto y qué se descarta.</p>
<p>La<strong>Ingeniería de Aprovechamiento</strong> construye el mundo en el que opera el agente. Herramientas, fuentes de conocimiento, lógica de validación, restricciones arquitectónicas: todo lo que determina si un agente puede funcionar de forma fiable en cientos de decisiones sin supervisión humana.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_4_2f4bc35890.png" alt="Three layers of AI agent development: Prompt Engineering optimizes what you say, Context Engineering manages what the model sees, and Harness Engineering designs the execution environment" class="doc-image" id="three-layers-of-ai-agent-development:-prompt-engineering-optimizes-what-you-say,-context-engineering-manages-what-the-model-sees,-and-harness-engineering-designs-the-execution-environment" />
   <span>Tres capas de desarrollo de agentes de IA: Prompt Engineering optimiza lo que se dice, Context Engineering gestiona lo que ve el modelo y Harness Engineering diseña el entorno de ejecución</span> </span>.</p>
<p>Las dos primeras capas determinan la calidad de un solo giro. La tercera determina si un agente puede funcionar durante horas sin que usted lo vea.</p>
<p>No se trata de enfoques contrapuestos. Son una progresión. A medida que crece la capacidad del agente, el mismo equipo pasa por las tres, a menudo dentro de un mismo proyecto.</p>
<h2 id="How-OpenAI-Used-Harness-Engineering-to-Build-a-Million-Line-Codebase-and-Lessons-They-Learnt" class="common-anchor-header">Cómo OpenAI utilizó Harness Engineering para crear una base de código de un millón de líneas y las lecciones que aprendieron<button data-href="#How-OpenAI-Used-Harness-Engineering-to-Build-a-Million-Line-Codebase-and-Lessons-They-Learnt" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAI llevó a cabo un experimento interno que concreta la ingeniería de aprovechamiento. Lo describieron en su blog de ingeniería, <a href="https://openai.com/index/harness-engineering/">"Harness Engineering: Leveraging Codex in an Agent-First World".</a> Un equipo de tres personas comenzó con un repositorio vacío a finales de agosto de 2025. Durante cinco meses, no escribieron código: cada línea fue generada por Codex, el agente de codificación de OpenAI impulsado por IA. El resultado: un millón de líneas de código de producción y 1.500 pull requests fusionadas.</p>
<p>Lo interesante no es el resultado. Son los cuatro problemas a los que se enfrentaron y las soluciones que crearon.</p>
<h3 id="Problem-1-No-Shared-Understanding-of-the-Codebase" class="common-anchor-header">Problema 1: No hay una comprensión compartida del código base</h3><p>¿Qué capa de abstracción debe utilizar el agente? ¿Cuáles son las convenciones de nomenclatura? ¿Dónde quedó la discusión sobre arquitectura de la semana pasada? Sin respuestas, el agente adivinaba -y adivinaba mal- repetidamente.</p>
<p>El primer instinto fue un único archivo <code translate="no">AGENTS.md</code> que contenía todas las convenciones, reglas y decisiones históricas. Fracasó por cuatro razones. El contexto es escaso, y un archivo de instrucciones hinchado desplazaba la tarea real. Cuando todo se considera importante, nada lo es. La documentación se pudre: las normas de la segunda semana son erróneas en la octava. Y un documento plano no puede verificarse mecánicamente.</p>
<p>La solución: reducir <code translate="no">AGENTS.md</code> a 100 líneas. No son reglas, es un mapa. Apunta a un directorio estructurado <code translate="no">docs/</code> que contiene decisiones de diseño, planes de ejecución, especificaciones del producto y documentos de referencia. Linters y CI verifican que los enlaces cruzados permanezcan intactos. El agente navega hasta exactamente lo que necesita.</p>
<p>El principio subyacente: si algo no está en contexto en tiempo de ejecución, no existe para el agente.</p>
<h3 id="Problem-2-Human-QA-Couldnt-Keep-Pace-with-Agent-Output" class="common-anchor-header">Problema 2: El control de calidad humano no podía seguir el ritmo de los resultados del agente</h3><p>El equipo conectó Chrome DevTools Protocol a Codex. El agente podía realizar capturas de pantalla de las rutas de la interfaz de usuario, observar eventos en tiempo de ejecución y consultar registros con LogQL y métricas con PromQL. Establecieron un umbral concreto: un servicio tenía que iniciarse en menos de 800 milisegundos para que una tarea se considerara completa. Las tareas del Codex se ejecutaban durante más de seis horas seguidas, normalmente mientras los ingenieros dormían.</p>
<h3 id="Problem-3-Architectural-Drift-Without-Constraints" class="common-anchor-header">Problema 3: deriva arquitectónica sin restricciones</h3><p>Sin guardarraíles, el agente reproducía cualquier patrón que encontrara en el repositorio, incluidos los malos.</p>
<p>La solución: una estricta arquitectura en capas con una única dirección de dependencia - Types → Config → Repo → Service → Runtime → UI. Los linters personalizados aplicaban estas reglas mecánicamente, con mensajes de error que incluían la instrucción de corrección en línea.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_3_f0fc3c9e92.png" alt="Strict layered architecture with one-way dependency validation: Types at the base, UI at the top, custom linters enforce rules with inline fix suggestions" class="doc-image" id="strict-layered-architecture-with-one-way-dependency-validation:-types-at-the-base,-ui-at-the-top,-custom-linters-enforce-rules-with-inline-fix-suggestions" />
   <span>Arquitectura estricta por capas con validación de dependencias unidireccional: Tipos en la base, interfaz de usuario en la parte superior, los linters personalizados aplican las reglas con sugerencias de corrección en línea</span> </span>.</p>
<p>En un equipo humano, esta limitación suele aparecer cuando la empresa se amplía a cientos de ingenieros. Para un agente de codificación, es un requisito previo desde el primer día. Cuanto más rápido avance un agente sin restricciones, peor será la deriva arquitectónica.</p>
<h3 id="Problem-4-Silent-Technical-Debt" class="common-anchor-header">Problema 4: Deuda técnica silenciosa</h3><p>La solución: codificar los principios básicos del proyecto en el repositorio y, a continuación, ejecutar tareas de Codex en segundo plano de forma programada para buscar desviaciones y enviar PR de refactorización. La mayoría se fusionaron automáticamente en menos de un minuto: pequeños pagos continuos en lugar de cuentas periódicas.</p>
<h2 id="Why-AI-Agents-Cant-Grade-Their-Own-Work" class="common-anchor-header">Por qué los agentes de IA no pueden calificar su propio trabajo<button data-href="#Why-AI-Agents-Cant-Grade-Their-Own-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>El experimento de OpenAI demostró que Harness Engineering funciona. Pero una investigación independiente puso de manifiesto un fallo en su interior: los agentes son sistemáticamente malos a la hora de evaluar su propio trabajo.</p>
<p>El problema se presenta de dos formas.</p>
<p><strong>Ansiedad de contexto.</strong> A medida que la ventana de contexto se llena, los agentes empiezan a terminar las tareas antes de tiempo, no porque el trabajo esté hecho, sino porque sienten que se acerca el límite de la ventana. Cognition, el equipo detrás del agente de codificación de IA Devin, <a href="https://cognition.ai/blog/devin-sonnet-4-5-lessons-and-challenges">documentó este comportamiento</a> mientras reconstruía Devin para Claude Sonnet 4.5: el modelo se dio cuenta de su propia ventana de contexto y empezó a tomar atajos mucho antes de quedarse sin espacio.</p>
<p>Su solución fue pura ingeniería de arneses. Habilitaron el contexto beta de 1 millón de tokens, pero limitaron el uso real a 200.000 tokens, engañando al modelo para que creyera que disponía de mucho espacio. La ansiedad desapareció. No fue necesario ningún cambio de modelo, sólo un entorno más inteligente.</p>
<p>La mitigación general más común es la compactación: resumir el historial y dejar que el mismo agente continúe con el contexto comprimido. Esto preserva la continuidad pero no elimina el comportamiento subyacente. Una alternativa es el restablecimiento del contexto: borrar la ventana, iniciar una nueva instancia y transferir el estado a través de un artefacto estructurado. Esto elimina por completo el desencadenante de la ansiedad, pero exige un documento de traspaso completo: las lagunas en el artefacto significan lagunas en la comprensión del nuevo agente.</p>
<p><strong>Sesgo de autoevaluación.</strong> Cuando los agentes evalúan sus propios resultados, los puntúan alto. Incluso en tareas con criterios objetivos de aprobado/desaprobado, el agente detecta un problema, se convence a sí mismo de que no es grave y aprueba un trabajo que debería fracasar.</p>
<p>La solución se basa en las GAN (Generative Adversarial Networks): separar completamente el generador del evaluador. En una GAN, dos redes neuronales compiten -una genera y otra juzga- y esa tensión adversarial obliga a mejorar la calidad. La misma dinámica se aplica a <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">los sistemas multiagente</a>.</p>
<p>Anthropic lo probó con un arnés de tres agentes (planificador, generador y evaluador) contra un agente en solitario encargado de construir un motor de juego retro 2D. Describen el experimento completo en <a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">"Harness Design for Long-Running Application Development"</a> (Anthropic, 2026). El planificador amplía una breve petición para convertirla en una especificación completa del producto, dejando deliberadamente sin especificar los detalles de implementación (el exceso de especificación temprana se traduce en errores posteriores). El Generador implementa características en sprints, pero antes de escribir código, firma un contrato de sprint con el Evaluador: una definición compartida de "hecho". El evaluador utiliza Playwright (el marco de automatización del navegador de código abierto de Microsoft) para hacer clic en la aplicación como un usuario real, probando la interfaz de usuario, la API y el comportamiento de la base de datos. Si algo falla, el sprint fracasa.</p>
<p>El agente en solitario produjo un juego que técnicamente se lanzaba, pero las conexiones entidad-tiempo de ejecución estaban rotas a nivel de código, lo que sólo se podía descubrir leyendo el código fuente. El arnés de tres agentes produjo un juego jugable con generación de niveles asistida por IA, animación de sprites y efectos de sonido.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_1_38a13120a7.png" alt="Comparison of solo agent versus three-agent harness: solo agent ran 20 minutes at nine dollars with broken core functionality, while the full harness ran 6 hours at two hundred dollars producing a fully functional game with AI-assisted features" class="doc-image" id="comparison-of-solo-agent-versus-three-agent-harness:-solo-agent-ran-20-minutes-at-nine-dollars-with-broken-core-functionality,-while-the-full-harness-ran-6-hours-at-two-hundred-dollars-producing-a-fully-functional-game-with-ai-assisted-features" />
   </span> <span class="img-wrapper"> <span>Comparación entre el agente en solitario y el arnés de tres agentes: el agente en solitario funcionó durante 20 minutos a un precio de nueve dólares con una funcionalidad básica rota, mientras que el arnés completo funcionó durante 6 horas a un precio de doscientos dólares, produciendo un juego completamente funcional con características asistidas por IA</span> </span>.</p>
<p>La arquitectura de tres agentes costó aproximadamente 20 veces más. El resultado pasó de inutilizable a utilizable. Ese es el principal intercambio que hace la ingeniería de arneses: sobrecarga estructural a cambio de fiabilidad.</p>
<h2 id="The-Retrieval-Problem-Inside-Every-Agent-Harness" class="common-anchor-header">El problema de la recuperación dentro de cada arnés de agentes<button data-href="#The-Retrieval-Problem-Inside-Every-Agent-Harness" class="anchor-icon" translate="no">
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
    </button></h2><p>Ambos patrones -el sistema estructurado <code translate="no">docs/</code> y el ciclo de sprints Generador/Evaluador- comparten una dependencia silenciosa: el agente debe encontrar la información correcta de una base de conocimientos viva y en evolución cuando la necesita.</p>
<p>Esto es más difícil de lo que parece. Tomemos un ejemplo concreto: el Generador está ejecutando el Sprint 3, implementando la autenticación de usuarios. Antes de escribir el código, necesita dos tipos de información.</p>
<p>En primer lugar, una consulta de <a href="https://zilliz.com/glossary/semantic-search">búsqueda semántica</a>: <em>¿cuáles son los principios de diseño de este producto en torno a las sesiones de usuario?</em> El documento relevante podría utilizar "gestión de sesiones" o "control de acceso", no "autenticación de usuarios". Sin una comprensión semántica, la recuperación se pierde.</p>
<p>En segundo lugar, una consulta de coincidencia exacta: <em>¿qué documentos hacen referencia a la función <code translate="no">validateToken</code>?</em> El nombre de una función es una cadena arbitraria sin significado semántico. La <a href="https://zilliz.com/glossary/vector-embeddings">recuperación basada en la incrustación</a> no puede encontrarla de forma fiable. Sólo funciona la concordancia de palabras clave.</p>
<p>Estas dos consultas se producen simultáneamente. No pueden separarse en pasos secuenciales.</p>
<p>La <a href="https://zilliz.com/learn/vector-similarity-search">búsqueda vectorial</a> pura falla en la coincidencia exacta. <a href="https://milvus.io/docs/embed-with-bm25.md">La BM25</a> tradicional falla en las consultas semánticas y no puede predecir qué vocabulario utilizará un documento. Antes de Milvus 2.5, la única opción eran dos sistemas de recuperación paralelos (un índice vectorial y un <a href="https://milvus.io/docs/full-text-search.md">índice de texto completo</a> ) que funcionaban simultáneamente en el momento de la consulta con una lógica de fusión de resultados personalizada. Para un repositorio vivo de <code translate="no">docs/</code> con actualizaciones continuas, ambos índices tenían que estar sincronizados: cada cambio de documento provocaba la reindexación en dos lugares, con el riesgo constante de incoherencia.</p>
<h2 id="How-Milvus-26-Solves-Agent-Retrieval-with-a-Single-Hybrid-Pipeline" class="common-anchor-header">Cómo Milvus 2.6 resuelve la recuperación de agentes con una única canalización híbrida<button data-href="#How-Milvus-26-Solves-Agent-Retrieval-with-a-Single-Hybrid-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus es una <a href="https://zilliz.com/learn/what-is-vector-database">base de datos vectorial</a> de código abierto diseñada para cargas de trabajo de IA. Sparse-BM25 de Milvus 2.6 colapsa el problema de la recuperación de doble canalización en un único sistema.</p>
<p>En la ingesta, Milvus genera dos representaciones simultáneamente: una <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">incrustación densa</a> para la recuperación semántica y un <a href="https://milvus.io/docs/sparse_vector.md">vector disperso codificado con TF</a> para la puntuación BM25. <a href="https://zilliz.com/learn/tf-idf-understanding-term-frequency-inverse-document-frequency-in-nlp">Las estadísticas</a> globales <a href="https://zilliz.com/learn/tf-idf-understanding-term-frequency-inverse-document-frequency-in-nlp">de IDF</a> se actualizan automáticamente a medida que se añaden o eliminan documentos, sin necesidad de reindexación manual. En el momento de la consulta, una entrada en lenguaje natural genera internamente ambos tipos de vectores de consulta. <a href="https://milvus.io/docs/rrf-ranker.md">La fusión por rango recíproco (RRF)</a> fusiona los resultados clasificados y el usuario recibe un único conjunto de resultados unificado.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_2_8504a6ee08.png" alt="Before and after: two separate systems with manual sync, fragmented results, and custom fusion logic versus Milvus 2.6 single pipeline with dense embedding, Sparse BM25, RRF fusion, and automatic IDF maintenance producing unified results" class="doc-image" id="before-and-after:-two-separate-systems-with-manual-sync,-fragmented-results,-and-custom-fusion-logic-versus-milvus-2.6-single-pipeline-with-dense-embedding,-sparse-bm25,-rrf-fusion,-and-automatic-idf-maintenance-producing-unified-results" />
   </span> <span class="img-wrapper"> <span>Antes y después: dos sistemas separados con sincronización manual, resultados fragmentados y lógica de fusión personalizada frente a la canalización única Milvus 2.6 con incrustación densa, Sparse BM25, fusión RRF y mantenimiento IDF automático que produce resultados unificados</span> </span>.</p>
<p>Una interfaz. Un índice que mantener.</p>
<p>En la <a href="https://zilliz.com/glossary/beir">prueba de referencia BEIR</a>, un conjunto de evaluación estándar que abarca 18 conjuntos de datos de recuperación heterogéneos, Milvus consigue un rendimiento entre 3 y 4 veces superior al de Elasticsearch con una recuperación equivalente, con una mejora de hasta 7 veces QPS en cargas de trabajo específicas. Para el escenario sprint, una única consulta encuentra tanto el principio de diseño de la sesión (ruta semántica) como todos los documentos que mencionan <code translate="no">validateToken</code> (ruta exacta). El repositorio <code translate="no">docs/</code> se actualiza continuamente; el mantenimiento de BM25 IDF significa que un documento recién escrito participa en la puntuación de la siguiente consulta sin ninguna reconstrucción por lotes.</p>
<p>Esta es la capa de recuperación construida exactamente para esta clase de problemas. Cuando un arnés de agentes necesita buscar en una base de conocimientos viva -documentación de código, decisiones de diseño, historial de sprints-, la búsqueda híbrida en una sola línea no es un "nice-to-have". Es lo que hace que el resto del arnés funcione.</p>
<h2 id="The-Best-Harness-Components-Are-Designed-to-Be-Deleted" class="common-anchor-header">Los mejores componentes del arnés están diseñados para ser eliminados<button data-href="#The-Best-Harness-Components-Are-Designed-to-Be-Deleted" class="anchor-icon" translate="no">
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
    </button></h2><p>Cada componente de un arnés codifica una suposición sobre las limitaciones del modelo. La descomposición de sprints era necesaria cuando los modelos perdían coherencia en tareas largas. El restablecimiento del contexto era necesario cuando los modelos experimentaban ansiedad cerca del límite de la ventana. Los agentes evaluadores se hicieron necesarios cuando el sesgo de autoevaluación era inmanejable.</p>
<p>Estos supuestos caducan. El truco de la ventana de contexto de la cognición puede llegar a ser innecesario a medida que los modelos desarrollan una verdadera resistencia a contextos largos. A medida que los modelos sigan mejorando, otros componentes se convertirán en una sobrecarga innecesaria que ralentiza a los agentes sin añadir fiabilidad.</p>
<p>Harness Engineering no es una arquitectura fija. Es un sistema que se recalibra con cada nueva versión del modelo. La primera pregunta tras cualquier actualización importante no es "¿qué puedo añadir?". Sino "¿qué puedo eliminar?".</p>
<p>La misma lógica se aplica a la recuperación. A medida que los modelos manejen contextos más largos de forma más fiable, cambiarán las estrategias de fragmentación y los plazos de recuperación. La información que hoy necesita una fragmentación cuidadosa puede ser ingerible como páginas completas mañana. La infraestructura de recuperación se adapta al modelo.</p>
<p>Todos los componentes de un arnés bien construido están esperando a que un modelo más inteligente los haga redundantes. Eso no es un problema. Es el objetivo.</p>
<h2 id="Get-Started-with-Milvus" class="common-anchor-header">Empiece con Milvus<button data-href="#Get-Started-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Si está construyendo una infraestructura de agentes que necesita una recuperación híbrida -búsqueda semántica y por palabras clave en una sola canalización-, aquí es donde puede empezar:</p>
<ul>
<li>Lea <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>las notas de la versión Milvus 2.</strong></a> 6 para obtener todos los detalles sobre Sparse-BM25, el mantenimiento automático de IDF y las pruebas de rendimiento.</li>
<li>Únase a la <a href="https://milvus.io/community"><strong>comunidad Milvus</strong></a> para hacer preguntas y compartir lo que está construyendo.</li>
<li><a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>Reserve una sesión gratuita de Milvus Office Hours</strong></a> para analizar su caso de uso con un experto en bases de datos vectoriales.</li>
<li>Si prefiere omitir la configuración de la infraestructura, <a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloud</strong></a> (Milvus totalmente gestionado) ofrece un nivel gratuito para empezar con 100 dólares de créditos gratuitos al registrarse con el correo electrónico del trabajo.</li>
<li>Síguenos en GitHub: <a href="https://github.com/milvus-io/milvus"><strong>milvus-io/milvus</strong></a> - 43k+ estrellas y creciendo.</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Preguntas frecuentes<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="What-is-harness-engineering-and-how-is-it-different-from-prompt-engineering" class="common-anchor-header">¿Qué es la ingeniería de arneses y en qué se diferencia de la ingeniería de avisos?</h3><p>La ingeniería de avisos optimiza lo que se le dice a un modelo en un único intercambio: fraseología, estructura, ejemplos. La ingeniería de arneses construye el entorno de ejecución en torno a un agente de IA autónomo: las herramientas que puede utilizar, los conocimientos a los que puede acceder, la lógica de validación que comprueba su trabajo y las restricciones que evitan la desviación de la arquitectura. La ingeniería de avisos da forma a un turno de conversación. La ingeniería de aprovechamiento determina si un agente puede funcionar de forma fiable durante horas tomando cientos de decisiones sin supervisión humana.</p>
<h3 id="Why-do-AI-agents-need-both-vector-search-and-BM25-at-the-same-time" class="common-anchor-header">¿Por qué los agentes de IA necesitan al mismo tiempo la búsqueda vectorial y la BM25?</h3><p>Los agentes deben responder simultáneamente a dos consultas de recuperación fundamentalmente diferentes. Las consultas semánticas -¿cuáles <em>son nuestros principios de diseño en torno a las sesiones de usuario?</em> - requieren incrustaciones vectoriales densas para emparejar contenidos conceptualmente relacionados, independientemente del vocabulario. Consultas de coincidencia exacta: <em>¿qué documentos hacen referencia a la función <code translate="no">validateToken</code>?</em> - requieren una puntuación de palabras clave BM25, ya que los nombres de las funciones son cadenas arbitrarias sin significado semántico. Un sistema de recuperación que sólo se ocupe de un modo perderá sistemáticamente consultas del otro tipo.</p>
<h3 id="How-does-Milvus-Sparse-BM25-work-for-agent-knowledge-retrieval" class="common-anchor-header">¿Cómo funciona Milvus Sparse-BM25 para la recuperación del conocimiento de los agentes?</h3><p>En el momento de la ingesta, Milvus genera simultáneamente una incrustación densa y un vector disperso codificado con TF para cada documento. Las estadísticas globales de IDF se actualizan en tiempo real a medida que cambia la base de conocimientos, sin necesidad de reindexación manual. En el momento de la consulta, se generan internamente ambos tipos de vectores, la fusión recíproca de rangos fusiona los resultados clasificados y el agente recibe un único conjunto de resultados unificado. Todo el proceso se ejecuta a través de una interfaz y un índice, lo que es fundamental para las bases de conocimiento que se actualizan continuamente, como un repositorio de documentación de código.</p>
<h3 id="When-should-I-add-an-evaluator-agent-to-my-agent-harness" class="common-anchor-header">¿Cuándo debo añadir un agente evaluador a mi arnés de agentes?</h3><p>Añada un evaluador independiente cuando la calidad de los resultados de su generador no pueda verificarse únicamente mediante pruebas automatizadas, o cuando el sesgo de la autoevaluación haya causado la omisión de defectos. El principio clave: el evaluador debe estar separado arquitectónicamente del generador, ya que el contexto compartido reintroduce el mismo sesgo que se intenta eliminar. El evaluador debe tener acceso a las herramientas de ejecución (automatización del navegador, llamadas a la API, consultas a bases de datos) para probar el comportamiento, no sólo revisar el código. La <a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">investigación</a> de Anthropic descubrió que esta separación inspirada en GAN hizo que la calidad del resultado pasara de "técnicamente lanzado pero roto" a "totalmente funcional con características que el agente en solitario nunca intentó".</p>
