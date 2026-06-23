---
id: when-ai-agents-do-the-work-what-do-we-lose.md
title: |
  Cuando los agentes de IA se encargan del trabajo, ¿qué perdemos?
author: Bill Chen
date: 2026-06-18T00:00:00.000Z
cover: assets.zilliz.com/AI_Agents_Work_blog_cover_1536x1024_565f1739a0.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'AI agents, agentic AI, AI coding agents, agent memory, LLM agents'
meta_title: |
  When AI Agents Do the Work, What Do We Lose?
desc: >
  Los agentes de IA están mejorando en cuanto a ejecución, memoria y estándares.
  Pero si eliminan el ciclo de aprendizaje que subyace al trabajo, el criterio
  humano podría dejar de mejorar.
origin: 'https://milvus.io/blog/when-ai-agents-do-the-work-what-do-we-lose.md'
---
<p>Los productos basados en agentes están mejorando mucho a la hora de realizar el trabajo.</p>
<p>Claude Code puede escribir y refactorizar grandes bloques de código. Cursor ayuda a los desarrolladores a moverse más rápido por los códigos fuente. Devin y otros agentes orientados a tareas intentan hacerse cargo de flujos de trabajo más largos. Más allá de la programación, los agentes redactan correos electrónicos, procesan documentos, resumen datos, actualizan tickets y automatizan tareas repetitivas que antes requerían la intervención directa de una persona.</p>
<p>La mayoría de estos productos hacen la misma promesa: si le das al agente suficiente contexto, se encargará de una mayor parte de la ejecución por ti. Esa promesa es útil, pero también plantea una pregunta que los productos de agentes aún no han respondido del todo: <strong>cuando el agente hace más trabajo, ¿qué perdemos?</strong></p>
<p>La respuesta no es simplemente «esfuerzo manual». La tarea puede completarse, pero es posible que el ser humano se haya saltado parte del proceso que solía desarrollar su capacidad de juicio: leer, rastrear, depurar, comparar opciones, cometer errores y aprender por qué una solución es mejor que otra.</p>
<p>Esto no significa que los agentes sean perjudiciales para el aprendizaje. Significa que los productos basados en agentes deben diseñarse teniendo en cuenta el aprendizaje. Si solo se optimizan para el resultado, pueden eliminar precisamente la experiencia que ayuda a los humanos a mejorar los estándares de los que dependen los agentes.</p>
<p>Una forma útil de abordar este problema es tomar prestada la «escalera de la autonomía» de los sistemas de conducción autónoma. La analogía no es perfecta, pero ayuda a distinguir los diferentes tipos de progreso en los productos basados en agentes:</p>
<ul>
<li><strong>Los agentes de nivel 1 ejecutan tareas.</strong> El ser humano da instrucciones y el agente las lleva a cabo.</li>
<li><strong>Los agentes de nivel 2 recuerdan.</strong> Aprenden a lo largo de las sesiones almacenando preferencias, correcciones y el contexto del proyecto.</li>
<li><strong>Los agentes de nivel 3 aplican estándares.</strong> El ser humano define reglas, restricciones y criterios de decisión en lugar de guiar cada paso.</li>
<li><strong>Los agentes de nivel 4 mejoran al ser humano.</strong> El agente no se limita a hacer el trabajo. Ayuda al ser humano a preservar y profundizar su capacidad de juicio.</li>
</ul>
<p>La mayor parte del sector sigue centrada en los tres primeros niveles. Es lógico. La ejecución, la memoria y los estándares son problemas inmediatos del producto. Pero es en el nivel L4 donde surge el riesgo a largo plazo. Si los humanos dejan de mejorar, los estándares que guían a los agentes también dejan de mejorar.</p>
<h2 id="L1-Agents-execute" class="common-anchor-header">Nivel 1: Los agentes ejecutan<button data-href="#L1-Agents-execute" class="anchor-icon" translate="no">
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
    </button></h2><p>El desarrollo de aplicaciones de IA ha pasado por varias capas de abstracción:</p>
<ul>
<li>Al principio, los desarrolladores invocaban un modelo a través de una API: enviaban texto y recibían texto a cambio.</li>
<li>Luego llegó <strong>la ingeniería de prompts</strong>, donde la habilidad principal consistía en aprender a formular mejores preguntas.</li>
<li>Después llegó <strong>la ingeniería de contexto</strong>, en la que la tarea consistía en proporcionar al modelo suficientes ejemplos, restricciones y antecedentes para que se comportara de forma útil en una situación concreta.</li>
<li>Después llegó <strong>la ingeniería de harness</strong>: conectar los modelos a herramientas, flujos de trabajo, archivos, bases de datos, navegadores, terminales y sistemas de producción.</li>
<li><strong>La ingeniería de agentes</strong> se basa en todo ello. En lugar de pedirle al modelo que responda a una sola indicación, le pedimos que planifique pasos, elija herramientas, inspeccione resultados, se recupere de errores y complete tareas de varios pasos con menos supervisión.</li>
</ul>
<p>La superficie técnica sigue cambiando, pero la relación básica en el nivel 1 sigue siendo la misma: <strong>el ser humano define la tarea y el agente la lleva a cabo.</strong> Cada interacción sigue siendo, en su mayor parte, autónoma. Se completa la tarea, la sesión termina y la siguiente tarea comienza desde cero.</p>
<p>Este nivel ya funciona lo suficientemente bien como para modificar el comportamiento. Los agentes pueden gestionar más tareas con menos esfuerzo manual. A medida que se vuelven más económicos, rápidos y fiables, el rendimiento aumenta mientras que el coste disminuye.</p>
<p>Pero una ejecución más sencilla crea un nuevo cuello de botella. Cada sesión paralela sigue necesitando a una persona que explique la tarea, proporcione contexto, revise el resultado, evalúe la calidad y decida qué hacer a continuación. Puede que el agente esté realizando el trabajo, pero la persona sigue siendo responsable de determinar si el trabajo es bueno.</p>
<p><strong>La ejecución se abarata. El criterio cobra mayor importancia.</strong></p>
<h2 id="L2-Agents-remember" class="common-anchor-header">Nivel 2: Los agentes recuerdan<button data-href="#L2-Agents-remember" class="anchor-icon" translate="no">
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
    </button></h2><p>El L1 resuelve la tarea que tiene ante sí. El L2 plantea una pregunta diferente: <strong>¿puede el agente aprender de esta interacción para que la siguiente salga mejor?</strong></p>
<p>Un agente L1 puro carece de estado. Una vez que finaliza la sesión, el contexto desaparece. La siguiente tarea empieza desde cero. Los agentes L2 rompen ese patrón al acumular experiencia a lo largo de las sesiones. Recuerdan las preferencias del usuario, las convenciones del proyecto, los comentarios recurrentes, las decisiones anteriores y los patrones en la forma de trabajar del usuario. <strong>El objetivo es convertir la experiencia generada a través de la interacción entre humanos y agentes en un activo reutilizable.</strong></p>
<p>Por eso mismo, la memoria del agente no debe tratarse como una indicación más larga o una carpeta de transcripciones guardadas. Una memoria útil necesita infraestructura: almacenamiento duradero, recuperación semántica, deduplicación, actualizaciones y una forma de separar el contexto obsoleto del conocimiento que sigue siendo útil. Aquí es donde nuestro trabajo en <a href="https://zilliz.com/">Zilliz</a> se relaciona con el problema. <a href="https://milvus.io/">Milvus</a>, y los servicios gestionados de Zilliz Cloud construidos en torno a él, se utilizan a menudo como capa de recuperación para la memoria del agente, ya que permiten buscar en el contexto pasado en lugar de limitarse a archivarlo.</p>
<p><strong>Pero la memoria de nivel 2 tiene un límite estructural.</strong> La mayor parte de lo que los agentes aprenden en esta etapa proviene del comportamiento observable: lo que el usuario dijo, cambió, aceptó, rechazó o corrigió. Un agente puede recordar que reescribiste un párrafo, rechazaste una implementación o cambiaste la firma de una función. Pero puede que no entienda por qué.</p>
<p>¿El problema era la precisión, el tono, la facilidad de mantenimiento, el riesgo de seguridad, el rendimiento, el posicionamiento del producto o algo más? El comportamiento es la superficie visible del juicio. El razonamiento subyacente suele permanecer oculto.</p>
<p>Eso hace que el Nivel 2 sea mejor a la hora de captar el conocimiento explícito que el tácito. Puede recordar las reglas que has establecido directamente y almacenar ejemplos de decisiones pasadas. Pero los ejemplos no se convierten automáticamente en principios. El agente puede recordar lo que ocurrió sin comprender la norma que hay detrás.</p>
<p>Esa brecha nos lleva al nivel L3.</p>
<h2 id="L3-Agents-apply-standards" class="common-anchor-header">Nivel 3: Los agentes aplican normas<button data-href="#L3-Agents-apply-standards" class="anchor-icon" translate="no">
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
    </button></h2><p>Una vez que L1 y L2 empiezan a funcionar, el siguiente paso obvio es el paralelismo.</p>
<p>Si un agente puede completar una tarea, ¿por qué no poner en marcha diez? Si un agente puede aprender de una sesión, ¿por qué no abrir muchas sesiones y dejar que todos produzcan trabajo a la vez? Esta es la lógica del «ingeniero 10x» o del «ingeniero 100x»: utilizar agentes para multiplicar el rendimiento.</p>
<p>En la práctica, el paralelismo genera su propio coste. Cada sesión sigue exigiendo que la persona cambie de contexto, comprenda el problema, revise el trabajo, dé retroalimentación y decida si el resultado es lo suficientemente bueno. A partir de cierto punto, un mayor número de agentes deja de parecer una ventaja y empieza a parecer una carga.</p>
<p>No se trata solo de un problema de flujo de trabajo. Es una barrera cognitiva. Los seres humanos no gestionan las tareas en paralelo como lo hacen las máquinas. Cambiar de tarea agota la atención. La memoria de trabajo es limitada. Cada cambio aumenta la probabilidad de pasar por alto detalles, aplicar un criterio erróneo o aprobar el trabajo con demasiada rapidez.</p>
<p><strong>Un buen producto no debe luchar contra este límite. Debe diseñarse teniendo en cuenta este límite.</strong></p>
<p>En el nivel 3, la indicación pasa de ser «resuelve este problema concreto de esta forma concreta» a «estas son las normas que debes aplicar». El ser humano deja de ser el operador que guía cada paso y se convierte en la persona que define las reglas, las restricciones, las preferencias, los umbrales de calidad y los criterios de decisión.</p>
<p>Un usuario aún puede guiar a un agente a través de una tarea específica, pero el valor de esa orientación no debería desaparecer al finalizar la sesión. La interacción debería dejar como legado un estándar reutilizable, no solo un registro de la conversación. La próxima vez que surja una tarea similar, el agente debería aplicar el estándar sin pedirle a la persona que reconstruya todo el contexto y vuelva a emitir el mismo juicio.</p>
<p>El sector ya se está moviendo en esta dirección. Muchos productos de agentes permiten a los usuarios definir reglas, instrucciones, recuerdos, convenciones de proyecto y preferencias de comportamiento. La dirección es la correcta, pero la mayoría de las implementaciones aún se encuentran en una fase inicial. Las reglas suelen ser texto estático: actualizadas manualmente, fragmentadas y conectadas solo de forma laxa con el razonamiento que subyace a las decisiones del usuario.</p>
<p>El modelo más sólido es un modelo cognitivo personal que se actualiza continuamente: una representación legible por máquina de cómo una persona juzga, decide y sopesa las opciones. Debería codificar preferencias, valores, restricciones, excepciones, normas y estilo de decisión como contexto que los agentes puedan recuperar y aplicar.</p>
<p>En lugar de limitarse a almacenar conversaciones pasadas, debería hacer que el pensamiento del usuario resulte legible para las máquinas.</p>
<p>La labor del usuario cambia en consecuencia. En lugar de explicar cada tarea desde cero, el usuario mantiene el modelo perfeccionando los estándares, actualizando las preferencias, corrigiendo supuestos y haciendo explícito el juicio implícito. En cierto sentido, el usuario se está «tokenizando» continuamente: convirtiendo una mayor parte de su pensamiento en una forma que los agentes puedan utilizar.</p>
<p>Cuando la ejecución es económica, el ser humano no necesita decidir cada detalle de la implementación antes de que comience una tarea. El ser humano debe definir qué se considera un buen resultado, qué es inaceptable y cómo deben gestionarse las compensaciones.</p>
<h2 id="L4-Agents-preserve-human-learning" class="common-anchor-header">Nivel 4: Los agentes preservan el aprendizaje humano<button data-href="#L4-Agents-preserve-human-learning" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Los tres primeros niveles se centran en lograr que los agentes presten un mejor servicio a los humanos. El nivel L4 invierte la pregunta: ¿cómo pueden los agentes ayudar a los humanos a mejorar?</strong></p>
<p>Esta es la parte que la mayoría de los productos basados en agentes no han abordado plenamente. Cuando los agentes realizan una mayor parte del trabajo por nosotros, ¿qué es exactamente lo que desaparece del lado humano del bucle?</p>
<p>A simple vista, perdemos el esfuerzo manual. Esa es la ventaja obvia. Pero también podemos perder tres cosas menos visibles: la memoria situada del trabajo, la práctica a la hora de hacer concesiones y el reconocimiento de patrones que surge de la exposición repetida a detalles complicados.</p>
<p><strong>Lo he experimentado de primera mano al programar.</strong> Cuando escribía el código yo mismo, recordaba dónde se encontraba cada línea y cómo funcionaba el sistema porque había dedicado tiempo a leerlo, depurarlo, rastrearlo y corregirlo a mano. Ese proceso no solo generaba código. Entrenaba a mi cerebro para reconocer estructuras.</p>
<p>Con Claude Code, el código sigue generándose, a menudo más rápido. Pero al cabo de un tiempo, mi recuerdo del sistema no es tan profundo. Puede que sepa lo que hace el sistema, pero no siempre recuerdo cómo encajaban todas las piezas. La experiencia de crear se ve comprimida, y parte del aprendizaje desaparece con ella.</p>
<p>Esto no es un argumento en contra de los agentes de programación. Es un argumento a favor de que los productos de estos agentes deben preservar aquellas partes del trabajo que desarrollan el juicio humano.</p>
<p>El mismo patrón se repite fuera del ámbito de la programación. Si un agente redacta todos los memorandos estratégicos, el ser humano puede perder la práctica de estructurar un argumento. Si un agente resume todos los artículos, el ser humano puede perder el hábito de darse cuenta de lo que el resumen ha omitido. Si un agente se encarga de todas las decisiones operativas, el ser humano puede dejar de desarrollar la intuición que surge al lidiar con excepciones complicadas.</p>
<p>El trabajo desaparece. El resultado permanece. Pero el ciclo de aprendizaje puede debilitarse.</p>
<p>Ese es el problema del nivel 4.</p>
<h2 id="Human-judgment-is-the-ceiling" class="common-anchor-header">El juicio humano es el límite<button data-href="#Human-judgment-is-the-ceiling" class="anchor-icon" translate="no">
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
    </button></h2><p>Esta pérdida es importante porque los agentes no operan en el vacío. Un agente es un multiplicador, no un sustituto. La misma herramienta produce resultados muy diferentes en manos de un experto y de un principiante. Un ingeniero sénior que utilice un agente puede llegar a ser mucho más eficaz. Un principiante puede limitarse a producir más resultados sin desarrollar un mejor criterio.</p>
<p>Los agentes amplifican el nivel cognitivo existente del usuario.</p>
<p>Esto es importante porque el Nivel 3 depende de que los humanos definan las normas que deben seguir los agentes. Pero la calidad de esas normas depende de la calidad del juicio humano. Si el ser humano deja de mejorar, las normas acaban quedando obsoletas. Se vuelven incompletas, superficiales o desalineadas con la realidad actual del trabajo.</p>
<p>El sistema funciona mejor como un ciclo:</p>
<ul>
<li>El criterio humano define las normas.</li>
<li>Los agentes actúan dentro de esos estándares.</li>
<li>Los resultados de la ejecución se incorporan al aprendizaje humano.</li>
<li>El aprendizaje humano mejora las normas.</li>
</ul>
<p>Si el ciclo funciona, ambas partes mejoran. El agente actúa con mayor eficacia y el ser humano mejora a la hora de definir qué significa «eficaz». Si el ciclo se rompe, el sistema se degrada. El criterio humano se estanca. Los estándares quedan obsoletos. Los agentes siguen optimizando, pero lo hacen dentro de un marco que poco a poco se va quedando atrás.</p>
<p>Por eso el juicio humano es el límite máximo. Unos agentes más potentes no eliminan la necesidad de personas más competentes. Hacen que la calidad del juicio humano sea más importante, porque ese juicio se convierte en el marco dentro del cual opera el agente.</p>
<h2 id="Why-agents-cannot-solve-the-whole-problem-alone" class="common-anchor-header">Por qué los agentes no pueden resolver todo el problema por sí solos<button data-href="#Why-agents-cannot-solve-the-whole-problem-alone" class="anchor-icon" translate="no">
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
    </button></h2><p>Una respuesta es obvia: los agentes seguirán haciéndose más potentes, por lo que quizá acaben generando por sí mismos mejores conocimientos, mejores reglas y mejores estándares.</p>
<p>Hay algo de verdad en eso. Los agentes ya son muy eficaces a la hora de combinar ideas, explorar espacios de soluciones y descubrir caminos que los humanos quizá no hayan considerado. Un modelo puede producir frases, diseños y soluciones que nunca aparecieron en sus datos de entrenamiento. Puede recombinar patrones de distintos ámbitos y generar alternativas útiles.</p>
<p>Ese es el valor real. Pero el Nivel 4 se centra en un tipo diferente de creación. La cuestión no es solo quién puede encontrar una respuesta mejor, sino quién puede plantear una nueva pregunta, reescribir la norma o ampliar el espacio del problema.</p>
<p>Los agentes son muy buenos generalizando, combinando y buscando dentro de una distribución existente. Pueden encontrar mejores caminos a través de un terreno conocido, a veces caminos que los humanos no han probado. Pero decidir si el terreno en sí mismo debe rediseñarse es otra cosa.</p>
<p>Ese tipo de decisión suele surgir del contexto humano: las limitaciones vividas, los intereses personales, la curiosidad, la insatisfacción y el coste de equivocarse. Una persona puede formular una hipótesis que rompa con el marco actual y ponerla a prueba frente a la realidad. Y lo que es más importante, una persona puede tener una razón para seguir probando cuando la idea parece errónea, arriesgada o inútil en un primer momento.</p>
<p>La geometría no euclidiana es un ejemplo útil. El paso importante no fue simplemente preguntarse: «¿Y si las líneas paralelas se cruzaran?». Cualquier agente podría haber formulado esa frase. El paso importante fue considerar que valía la pena investigar esa extraña suposición y, a continuación, seguir sus consecuencias hasta que se convirtiera en un nuevo espacio teórico. Eso requirió persistencia, intereses en juego y una razón para preocuparse por el resultado.</p>
<p>El marco de creatividad de Margaret Boden resulta útil en este contexto. Ella distingue entre tres tipos de creatividad:</p>
<ul>
<li><strong>Creatividad combinatoria:</strong> combinar ideas conocidas de formas nuevas.</li>
<li><strong>Creatividad exploratoria:</strong> buscar dentro de un espacio conceptual ya existente.</li>
<li><strong>Creatividad transformacional:</strong> cambiar las reglas del propio espacio conceptual.</li>
</ul>
<p>Los agentes ya destacan en los dos primeros modos. Combinan ideas existentes y exploran dentro de espacios conceptuales ya existentes. El tercer modo es más difícil. La creatividad transformacional depende de algo más que de una búsqueda más rápida. Depende de por qué alguien decide rechazar una regla antigua, aceptar el coste del fracaso y seguir probando una idea que aún no encaja.</p>
<p><strong>La afirmación más precisa es la siguiente: los agentes destacan sobre todo a la hora de combinar y explorar dentro de los espacios existentes. Los nuevos conocimientos fundamentales, los nuevos espacios de problemas y los nuevos marcos de valores siguen dependiendo en gran medida de los seres humanos.</strong></p>
<h2 id="Design-for-the-loop-not-just-the-output" class="common-anchor-header">Diseña pensando en el ciclo, no solo en el resultado<button data-href="#Design-for-the-loop-not-just-the-output" class="anchor-icon" translate="no">
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
    </button></h2><p>No todos los productos basados en agentes tienen que resolver el nivel 4. Algunos productos solo tienen que ayudar a los usuarios a realizar tareas más rápido. Eso está bien. Otros necesitan memoria, estándares y una mejor integración en el flujo de trabajo.</p>
<p>Pero a nivel del ecosistema, algunos productos deben preservar el ciclo de aprendizaje. Si cada producto de agente ayuda a las personas a realizar menos trabajo, y ninguno les ayuda a seguir aprendiendo una vez que dejan de realizar el trabajo directamente, la capacidad humana se debilita con el tiempo. El espacio de optimización de los agentes deja de expandirse. Todo el sistema permanece limitado por el nivel actual de juicio humano.</p>
<p>Aquí es donde el diseño del producto cobra importancia. El Nivel 4 no consiste simplemente en pedir al agente que resuma lo que ha hecho. Un producto útil de Nivel 4 conserva aquellas partes del trabajo que desarrollan el juicio humano, incluso cuando el agente se encarga de la mayor parte de la ejecución.</p>
<p>Hay algunos patrones de producto que cobran importancia aquí:</p>
<ul>
<li><strong>Conservar los puntos clave de juicio.</strong> Algunas decisiones deben seguir siendo visibles para el ser humano, no porque el agente no pueda tomarlas, sino porque esas decisiones entrenan el juicio. El producto debe identificar qué momentos son importantes y mantenerlos como objeto de deliberación.</li>
<li><strong>Reconstruir el proceso, no solo el resultado.</strong> Un producto final no es suficiente. El sistema debe poner de manifiesto las ramificaciones clave de la toma de decisiones, las compensaciones, las vías alternativas y los intentos fallidos. Un usuario que solo ve el resultado puede aprobarlo o rechazarlo. Un usuario que ve el razonamiento puede actualizar su modelo mental.</li>
<li><strong>Fomenta la exploración colaborativa.</strong> Cuando el usuario tiene dudas, el agente no debe lanzarse directamente a dar una respuesta. Debe ayudar a ampliar el espacio del problema: qué dimensiones son importantes, qué supuestos faltan, qué información se necesita aún y qué costes conlleva cada opción.</li>
<li><strong>Cuestionar las suposiciones humanas.</strong> Esto no significa rebatir por el mero hecho de discrepar. Significa reconocer las lagunas o tensiones en el razonamiento del usuario y formular preguntas específicas que hagan visibles esas tensiones.</li>
</ul>
<p>El objetivo no es obligar a los humanos a volver a realizar cada paso manualmente. Eso iría en contra de la finalidad de los agentes. El objetivo es preservar aquellas partes del trabajo que convierten la experiencia en juicio.</p>
<p>Los productos basados en agentes no solo deben optimizarse en función del resultado. Deben optimizarse para el ciclo de retroalimentación: un mejor juicio humano, mejores estándares, una mejor ejecución por parte de los agentes y un mejor aprendizaje humano a partir de los resultados.</p>
<p><strong>Cuando los agentes de IA realizan el trabajo, no debemos perder el ciclo que, en primer lugar, hizo que los humanos fueran mejores en ese trabajo.</strong></p>
<h2 id="We’d-love-to-hear-your-thoughts" class="common-anchor-header">Nos encantaría conocer tu opinión<button data-href="#We’d-love-to-hear-your-thoughts" class="anchor-icon" translate="no">
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
    </button></h2><p>Si estás desarrollando agentes, me encantaría saber qué opinas al respecto: ¿qué partes del trabajo deberían asumir por completo los agentes y qué partes deberían seguir siendo visibles porque ayudan a los humanos a seguir mejorando?</p>
