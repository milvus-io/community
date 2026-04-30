---
id: how-robobrain-builds-longterm-robot-memory-with-milvus.md
title: Cómo RoboBrain crea memoria robótica a largo plazo con Milvus
author: Song Zhi
date: 2026-4-30
cover: assets.zilliz.com/robobrain_cover_a96f93fbce.jpg
tag: Use Cases
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'robot agent, robot memory, task execution, vector database, Milvus'
meta_title: |
  How RoboBrain Builds Long-Term Robot Memory with Milvus
desc: >-
  Los módulos robóticos pueden funcionar solos, pero fallan cuando se encadenan.
  El director general de Senqi AI explica cómo RoboBrain utiliza el estado de
  las tareas, la retroalimentación y la memoria Milvus.
origin: >-
  https://milvus.io/blog/how-robobrain-builds-longterm-robot-memory-with-milvus.md
---
<p><em>Este artículo ha sido escrito por Song Zhi, CEO de Senqi AI, una empresa de IA incorporada que crea una infraestructura de ejecución de tareas para robots. RoboBrain es uno de los principales productos de Senqi AI.</em></p>
<p>La mayoría de las funciones de los robots funcionan bien por sí solas. Un modelo de navegación puede planificar una ruta. Un modelo de percepción puede identificar objetos. Un módulo de habla puede aceptar instrucciones. El fallo de producción aparece cuando esas capacidades tienen que ejecutarse como una tarea continua.</p>
<p>Para un robot, una simple instrucción del tipo "ve a comprobar esa zona, fotografía cualquier cosa inusual y avísame" requiere planificación antes de que empiece la tarea, adaptación mientras se ejecuta y producción de un resultado útil cuando termina. Cada traspaso puede fallar: la navegación se bloquea tras un obstáculo, una foto borrosa se acepta como definitiva o el sistema olvida la excepción que gestionó hace cinco minutos.</p>
<p>Ese es el principal reto para <a href="https://zilliz.com/glossary/ai-agents">los agentes de IA</a> que operan en el mundo físico. A diferencia de los agentes digitales, los robots ejecutan contra <a href="https://zilliz.com/learn/introduction-to-unstructured-data">datos no estructurados</a> continuos: caminos bloqueados, cambios de luz, límites de la batería, ruido de los sensores y reglas del operador.</p>
<p>RoboBrain es el sistema operativo de inteligencia corporal de Senqi AI para la ejecución de tareas robóticas. Se sitúa en la capa de tareas, conectando la percepción, la planificación, el control de la ejecución y la retroalimentación de datos para que las instrucciones en lenguaje natural puedan convertirse en flujos de trabajo robóticos estructurados y recuperables.</p>
<table>
<thead>
<tr><th>Punto de interrupción</th><th>Qué falla en la producción</th><th>Cómo lo soluciona RoboBrain</th></tr>
</thead>
<tbody>
<tr><td>Planificación de tareas</td><td>Las instrucciones imprecisas dejan a los módulos posteriores sin campos de ejecución concretos.</td><td>La objetivación de tareas convierte la intención en estado compartido.</td></tr>
<tr><td>Enrutamiento del contexto</td><td>Existe la información correcta, pero llega a la fase de decisión equivocada.</td><td>La memoria escalonada encamina el contexto en tiempo real, a corto plazo y a largo plazo por separado.</td></tr>
<tr><td>Retroalimentación de datos</td><td>Una sola pasada se completa o falla sin mejorar la siguiente ejecución.</td><td>La retroalimentación actualiza el estado de la tarea y la memoria a largo plazo.</td></tr>
</tbody>
</table>
<h2 id="Three-Breakpoints-in-Robot-Task-Execution" class="common-anchor-header">Tres puntos de interrupción en la ejecución de tareas robóticas<button data-href="#Three-Breakpoints-in-Robot-Task-Execution" class="anchor-icon" translate="no">
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
    </button></h2><p>Las tareas de software pueden delimitarse a menudo como entrada, proceso y resultado. Las tareas del robot se ejecutan en un estado físico en movimiento: caminos bloqueados, cambios de luz, límites de la batería, ruido de los sensores y reglas del operador.</p>
<p>Por eso, el bucle de tareas necesita algo más que modelos aislados. Necesita una forma de preservar el contexto a través de la planificación, la ejecución y la retroalimentación.</p>
<h3 id="1-Task-Planning-Vague-Instructions-Produce-Vague-Execution" class="common-anchor-header">1. 1. Planificación de tareas: Las instrucciones imprecisas producen una ejecución imprecisa</h3><p>Una frase como "ve a echar un vistazo" esconde muchas decisiones. ¿Qué zona? ¿Qué debe fotografiar el robot? ¿Qué se considera inusual? ¿Qué debe hacer si falla la toma? ¿Qué resultado debe devolver al operador?</p>
<p>Si la capa de tareas no puede resolver esos detalles en campos concretos -área objetivo, objeto de inspección, condición de finalización, política de fallos y formato de devolución-, la tarea se ejecuta sin dirección desde el principio y nunca recupera el contexto aguas abajo.</p>
<h3 id="2-Context-Routing-The-Right-Data-Reaches-the-Wrong-Stage" class="common-anchor-header">2. Enrutamiento del contexto: Los datos correctos llegan a la etapa equivocada</h3><p>La pila del robot puede contener ya la información correcta, pero la ejecución de la tarea depende de que se recupere en la fase adecuada.</p>
<p>La fase de arranque necesita mapas, definiciones de áreas y reglas de funcionamiento. A mitad de la ejecución se necesita el estado de los sensores en tiempo real. La gestión de excepciones necesita casos similares de despliegues anteriores. Cuando estas fuentes se mezclan, el sistema toma la decisión correcta en el contexto equivocado.</p>
<p>Cuando falla el enrutamiento, el inicio extrae experiencia antigua en lugar de reglas de área, la gestión de excepciones no puede llegar a los casos que necesita, y la ejecución intermedia obtiene el mapa de ayer en lugar de lecturas en vivo. Dar a alguien un diccionario no le ayuda a escribir una redacción. Los datos tienen que llegar al punto de decisión correcto, en la etapa correcta, en la forma correcta.</p>
<h3 id="3-Data-Feedback-Single-Pass-Execution-Does-Not-Improve" class="common-anchor-header">3. Retroalimentación de datos: La ejecución en una sola pasada no mejora</h3><p>Sin writeback, un robot puede terminar una ejecución sin mejorar la siguiente. Una acción completada aún necesita una comprobación de calidad: ¿es la imagen lo suficientemente nítida, o debería el robot volver a disparar? ¿El camino sigue despejado o debe desviarse? ¿Está la batería por encima del umbral, o debería terminar la tarea?</p>
<p>Un sistema de una sola pasada no dispone de ningún mecanismo para estas llamadas. Se ejecuta, se detiene y repite el mismo fallo la próxima vez.</p>
<h2 id="How-RoboBrain-Closes-the-Robot-Task-Loop" class="common-anchor-header">Cómo cierra RoboBrain el bucle de tareas del robot<button data-href="#How-RoboBrain-Closes-the-Robot-Task-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p>RoboBrain conecta la comprensión del entorno, la planificación de tareas, el control de la ejecución y la retroalimentación de datos en un bucle operativo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_robobrain_builds_longterm_robot_memory_with_milvus_2_660d1c90e3.png" alt="RoboBrain core middleware architecture showing how user intent flows through task objects, stage-aware memory powered by Milvus, and a policy engine before reaching embodied capabilities" class="doc-image" id="robobrain-core-middleware-architecture-showing-how-user-intent-flows-through-task-objects,-stage-aware-memory-powered-by-milvus,-and-a-policy-engine-before-reaching-embodied-capabilities" />
   </span> <span class="img-wrapper"> <span>Arquitectura del middleware central de RoboBrain que muestra cómo la intención del usuario fluye a través de los objetos de tarea, la memoria consciente de las etapas impulsada por Milvus y un motor de políticas antes de alcanzar las capacidades incorporadas</span> </span>.</p>
<p>En la arquitectura descrita en este artículo, este bucle se implementa a través de tres mecanismos:</p>
<ol>
<li>La<strong>objetivación de tareas</strong> estructura el punto de entrada.</li>
<li>La<strong>memoria escalonada</strong> dirige la información correcta a la etapa adecuada.</li>
<li><strong>Un bucle de retroalimentación</strong> devuelve los resultados y decide el siguiente paso.</li>
</ol>
<p>Sólo funcionan como un conjunto. Arregla uno sin los otros y la cadena seguirá rompiéndose en el siguiente punto.</p>
<h3 id="1-Task-Objectification-Turning-Intent-into-Shared-State" class="common-anchor-header">1. 1. Objetivación de tareas: Convertir la intención en estado compartido</h3><p>Antes de que comience la ejecución, RoboBrain convierte cada instrucción en un objeto de tarea: tipo de tarea, área de destino, objeto de inspección, restricciones, resultado esperado, fase actual y política de fallos.</p>
<p>No se trata sólo de analizar el lenguaje. Se trata de que todos los módulos posteriores tengan la misma visión del estado de la tarea. Sin esa conversión, la tarea no tiene dirección.</p>
<p>En el ejemplo de la patrulla, el objeto de tarea rellena el tipo de inspección, la zona designada, los elementos anómalos como objeto de comprobación, la batería &gt;= 20% como restricción, una foto clara de la anomalía más la alerta del operador como resultado esperado, y el retorno a la base como política de fallos.</p>
<p>El campo de escenario se actualiza a medida que cambia la ejecución. Un obstáculo desplaza la tarea de navegación a desvío o petición de ayuda. Una imagen borrosa hace que se pase de inspeccionar a volver a fotografiar. Si la batería está baja, se pasa a la terminación y al regreso a la base.</p>
<p>Los módulos posteriores ya no reciben órdenes aisladas. Reciben la etapa actual de la tarea, sus restricciones y la razón por la que ha cambiado la etapa.</p>
<h3 id="2-Tiered-Memory-Routing-Context-to-the-Right-Stage" class="common-anchor-header">2. Memoria por niveles: Enrutamiento del contexto a la etapa correcta</h3><p>RoboBrain divide la información relevante para la tarea en tres niveles para que los datos correctos lleguen a la fase correcta.</p>
<p><strong>El estado en tiempo real</strong> contiene la postura, la batería, las lecturas de los sensores y las observaciones del entorno. Permite tomar decisiones en cada paso de control.</p>
<p><strong>El contexto a corto plazo</strong> registra los acontecimientos de la tarea actual: el obstáculo que el robot ha evitado hace dos minutos, la foto que ha vuelto a tomar o la puerta que no ha conseguido abrir al primer intento. Evita que el sistema pierda la noción de lo que acaba de ocurrir.</p>
<p><strong>La memoria semántica a largo plazo</strong> almacena el conocimiento de la escena, la experiencia histórica, los casos de excepción y las anotaciones posteriores a la tarea. Una determinada zona de aparcamiento puede requerir ajustes del ángulo de la cámara por la noche debido a las superficies reflectantes. Un determinado tipo de anomalía puede tener un historial de falsos positivos y debería desencadenar una revisión humana en lugar de una alerta automática.</p>
<p>Este nivel a largo plazo se basa en la <a href="https://zilliz.com/learn/vector-similarity-search">búsqueda de similitud vectorial</a> a través de la <a href="https://milvus.io/">base de datos vectorial Milvus</a>, ya que recuperar la memoria correcta significa buscar por significado, no por ID o palabra clave. Las descripciones de las escenas y los registros de manipulación se almacenan como <a href="https://zilliz.com/glossary/vector-embeddings">incrustaciones v</a> ectoriales y se recuperan con la <a href="https://zilliz.com/glossary/anns">búsqueda aproximada del vecino más cercano</a> para encontrar las coincidencias semánticas más próximas.</p>
<p>El inicio extrae de la memoria a largo plazo las reglas de la zona y los resúmenes de patrullas anteriores. La ejecución intermedia se basa en el estado en tiempo real y el contexto a corto plazo. La gestión de excepciones utiliza la <a href="https://zilliz.com/glossary/semantic-search">búsqueda semántica</a> para encontrar casos similares en la memoria a largo plazo.</p>
<h3 id="3-Feedback-Loop-Writing-Results-Back-into-the-System" class="common-anchor-header">3. 3. Bucle de retroalimentación: Devolución de resultados al sistema</h3><p>RoboBrain escribe los resultados de la navegación, la percepción y la acción en el objeto de la tarea después de cada paso, actualizando el campo del escenario. El sistema lee esas observaciones y decide el siguiente movimiento: desviarse si el camino es inalcanzable, volver a disparar si la imagen es borrosa, reintentar si la puerta no se abre o terminar si la batería está baja.</p>
<p>La ejecución se convierte en un ciclo: ejecutar, observar, ajustar, volver a ejecutar. La cadena sigue adaptándose a los cambios del entorno en lugar de interrumpirse la primera vez que aparece algo inesperado.</p>
<h2 id="How-Milvus-Powers-RoboBrains-Long-Term-Robot-Memory" class="common-anchor-header">Cómo Milvus potencia la memoria a largo plazo del robot RoboBrain<button data-href="#How-Milvus-Powers-RoboBrains-Long-Term-Robot-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>Algunas memorias de robots pueden consultarse por ID de tarea, marca de tiempo o metadatos de sesión. La experiencia operativa a largo plazo no suele ser posible.</p>
<p>El registro útil suele ser el caso que es semánticamente similar a la escena actual, aunque el ID de la tarea, el nombre de la ubicación o la redacción sean diferentes. Esto lo convierte en un problema de <a href="https://zilliz.com/learn/what-is-vector-database">base de datos vectorial</a>, y Milvus es adecuado para el nivel de memoria a largo plazo.</p>
<p>Este nivel almacena información como</p>
<ul>
<li>Descripciones de reglas de área y semántica de localización de puntos</li>
<li>Definiciones de tipos de anomalías y resúmenes de ejemplos</li>
<li>Registros históricos de manipulación y conclusiones de la revisión posterior a la tarea</li>
<li>Resúmenes de patrulla redactados al finalizar la tarea</li>
<li>Escritos de experiencia tras el relevo humano</li>
<li>Causas de fallos y estrategias de corrección de escenarios similares</li>
</ul>
<p>Nada de esto se teclea de forma natural en un campo estructurado. Todo ello debe recordarse por su significado.</p>
<p>Un ejemplo concreto: el robot patrulla la entrada de un aparcamiento por la noche. El resplandor de las luces hace que la detección de anomalías sea inestable. Los reflejos se siguen marcando como anomalías.</p>
<p>El sistema debe recordar las estrategias de repetición de tomas que funcionaron con el fuerte resplandor nocturno, las correcciones del ángulo de la cámara en zonas similares y las conclusiones de las revisiones humanas que marcaron detecciones anteriores como falsos positivos. Una consulta de coincidencia exacta puede encontrar un ID de tarea o una ventana temporal conocidos. No puede encontrar de forma fiable "el caso anterior de deslumbramiento que se comportó como éste" a menos que esa relación ya haya sido etiquetada.</p>
<p>La similitud semántica es el patrón de recuperación que funciona. <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">Las métricas de similitud</a> clasifican los recuerdos almacenados por relevancia, mientras que <a href="https://milvus.io/docs/filtered-search.md">el filtrado de metadatos</a> puede reducir el espacio de búsqueda por área, tipo de tarea o ventana temporal. En la práctica, esto se convierte a menudo en <a href="https://zilliz.com/learn/hybrid-search-combining-text-and-image">una búsqueda híbrida</a>: correspondencia semántica para el significado, filtros estructurados para las restricciones operativas.</p>
<p>Para la implementación, la capa de filtrado es a menudo donde la memoria semántica se vuelve operativa. <a href="https://milvus.io/docs/boolean.md">Las expresiones de filtro Milvus</a> definen restricciones escalares, mientras que <a href="https://milvus.io/docs/get-and-scalar-query.md?file=query.md">las consultas escalares Milvus</a> soportan búsquedas exactas cuando el sistema necesita registros por metadatos en lugar de por similitud.</p>
<p>Este patrón de recuperación se asemeja a <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">la generación de recuperación aumentada</a> adaptada a la toma de decisiones en el mundo físico, más que a la generación de texto. El robot no recupera documentos para responder a una pregunta; recupera experiencia previa para elegir la siguiente acción segura.</p>
<p>No todo entra en Milvus. Los identificadores de tareas, las marcas de tiempo y los metadatos de sesión se almacenan en una base de datos relacional. Los registros de tiempo de ejecución en bruto viven en un sistema de registro. Cada sistema de almacenamiento gestiona el patrón de consulta para el que está construido.</p>
<table>
<thead>
<tr><th>Tipo de datos</th><th>Dónde viven</th><th>Cómo se consulta</th></tr>
</thead>
<tbody>
<tr><td>ID de tareas, marcas de tiempo, metadatos de sesión</td><td>Base de datos relacional</td><td>Consultas exactas, uniones</td></tr>
<tr><td>Registros en tiempo de ejecución y flujos de eventos</td><td>Sistema de registro</td><td>Búsqueda de texto completo, filtros de intervalo de tiempo</td></tr>
<tr><td>Reglas de escena, tratamiento de casos, anotaciones de experiencia</td><td>Milvus</td><td>Búsqueda de similitud vectorial por significado</td></tr>
</tbody>
</table>
<p>A medida que se ejecutan las tareas y se acumulan las escenas, la capa de memoria a largo plazo alimenta los procesos posteriores: conservación de muestras para el ajuste de modelos, análisis de datos más amplios y transferencia de conocimientos entre implantaciones. La memoria se convierte en un activo de datos que proporciona a cada despliegue futuro un punto de partida superior.</p>
<h2 id="What-This-Architecture-Changes-in-Deployment" class="common-anchor-header">Lo que esta arquitectura cambia en la implantación<button data-href="#What-This-Architecture-Changes-in-Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>La objetivación de tareas, la memoria por niveles y el bucle de retroalimentación convierten el bucle de tareas de RoboBrain en un patrón de despliegue: cada tarea conserva el estado, cada excepción puede recuperar la experiencia previa y cada ejecución puede mejorar la siguiente.</p>
<p>Un robot que patrulle un edificio nuevo no debe empezar desde cero si ya ha manejado en otro lugar iluminación, obstáculos, tipos de anomalías o reglas de operador similares. Esto es lo que hace que la ejecución de las tareas del robot sea más repetible en todas las escenas, y lo que hace que los costes de despliegue a largo plazo sean más fáciles de controlar.</p>
<p>Para los equipos de robótica, la lección más profunda es que la memoria no es sólo una capa de almacenamiento. Forma parte del control de la ejecución. El sistema necesita saber lo que está haciendo, lo que acaba de cambiar, qué casos similares se han producido antes y qué debe escribirse de nuevo para la siguiente ejecución.</p>
<h2 id="Further-Reading" class="common-anchor-header">Lecturas complementarias<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
    </button></h2><p>Si estás trabajando en problemas similares con la memoria robótica, la ejecución de tareas o la recuperación semántica para la IA encarnada, estos recursos son útiles como próximos pasos:</p>
<ul>
<li>Lea la <a href="https://milvus.io/docs">documentación de Milvus</a> o pruebe el <a href="https://milvus.io/docs/quickstart.md">inicio rápido de Milvus</a> para ver cómo funciona la búsqueda vectorial en la práctica.</li>
<li>Revise la <a href="https://milvus.io/docs/architecture_overview.md">descripción general de la arquitectura de Milvus</a> si está planificando una capa de memoria de producción.</li>
<li>Examine <a href="https://zilliz.com/vector-database-use-cases">los casos de uso de la base de datos vectorial</a> para ver más ejemplos de búsqueda semántica en sistemas de producción.</li>
<li>Únase a la <a href="https://milvus.io/community">comunidad Milvus</a> para hacer preguntas y compartir lo que está construyendo.</li>
<li>Si desea Milvus gestionado en lugar de ejecutar su propia infraestructura, obtenga más información sobre <a href="https://zilliz.com/cloud">Zilliz Cloud</a>.</li>
</ul>
