---
id: llm-context-pruning-a-developers-guide-to-better-rag-and-agentic-ai-results.md
title: >-
  Poda de contexto LLM: Guía del desarrollador para mejorar los resultados de la
  RAG y la IA agéntica
author: Cheney Zhang
date: 2026-01-15T00:00:00.000Z
cover: assets.zilliz.com/context_pruning_cover_d1b034ba67.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Context Pruning, RAG, long context LLMs, context engineering'
meta_title: |
  LLM Context Pruning: Improving RAG and Agentic AI Systems
desc: >-
  Aprenda cómo funciona la poda de contexto en los sistemas RAG de contexto
  largo, por qué es importante y cómo modelos como Provence permiten el filtrado
  semántico y funcionan en la práctica.
origin: >-
  https://milvus.io/blog/llm-context-pruning-a-developers-guide-to-better-rag-and-agentic-ai-results.md
---
<p>Últimamente, las ventanas de contexto de los LLM son enormes. Algunos modelos pueden tomar un millón de tokens o más en una sola pasada, y cada nueva versión parece aumentar ese número. Es emocionante, pero si realmente has construido algo que utiliza un contexto largo, sabes que hay una brecha entre lo que es <em>posible</em> y lo que es <em>útil</em>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/LLM_Leaderboard_7c64e4a18c.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>El hecho de que un modelo <em>pueda</em> leer un libro entero de una sola vez no significa que debas dárselo. La mayoría de las entradas largas están llenas de cosas que el modelo no necesita. Una vez que empiezas a verter cientos de miles de tokens en una pregunta, normalmente obtienes respuestas más lentas, mayores costes de computación y, a veces, respuestas de menor calidad porque el modelo está intentando prestar atención a todo a la vez.</p>
<p>Así que, aunque las ventanas de contexto sigan creciendo, la verdadera pregunta es: <strong>¿qué debemos poner ahí?</strong> Ahí es donde entra en juego <strong>la poda de contextos</strong>. Se trata básicamente del proceso de recortar las partes del contexto recuperado o ensamblado que no ayudan al modelo a responder a la pregunta. Si se hace bien, el sistema será rápido, estable y mucho más predecible.</p>
<p>En este artículo, hablaremos de por qué el contexto largo a menudo se comporta de forma diferente a lo que cabría esperar, cómo la poda ayuda a mantener las cosas bajo control y cómo las herramientas de poda como <strong>Provence</strong> encajan en las canalizaciones RAG reales sin complicar la configuración.</p>
<h2 id="Four-Common-Failure-Modes-in-Long-Context-Systems" class="common-anchor-header">Cuatro modos de fallo habituales en los sistemas de contexto largo<button data-href="#Four-Common-Failure-Modes-in-Long-Context-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>Una ventana de contexto más grande no hace que el modelo sea más inteligente por arte de magia. En todo caso, una vez que se empieza a introducir una gran cantidad de información en la ventana de contexto, se abre un nuevo abanico de posibilidades de que las cosas vayan mal. Aquí hay cuatro problemas que verá todo el tiempo al construir sistemas de contexto largo o RAG.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Four_Failure_Modes_e9b9bcb3b2.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="1-Context-Clash" class="common-anchor-header">1. Choque de contextos</h3><p>El choque de contextos se produce cuando la información acumulada a lo largo de varios turnos se contradice internamente.</p>
<p>Por ejemplo, un usuario puede decir "me gustan las manzanas" al principio de una conversación y más tarde afirmar "no me gusta la fruta". Cuando ambas afirmaciones permanecen en el contexto, el modelo no tiene una forma fiable de resolver el conflicto, lo que lleva a respuestas incoherentes o dubitativas.</p>
<h3 id="2-Context-Confusion" class="common-anchor-header">2. Confusión de contexto</h3><p>La confusión de contexto surge cuando el contexto contiene grandes cantidades de información irrelevante o poco relacionada, lo que dificulta al modelo la selección de la acción o herramienta correcta.</p>
<p>Este problema es especialmente visible en los sistemas con herramientas. Cuando el contexto está repleto de detalles no relacionados, el modelo puede malinterpretar la intención del usuario y seleccionar la herramienta o acción equivocada, no porque falte la opción correcta, sino porque la señal está oculta bajo el ruido.</p>
<h3 id="3-Context-Distraction" class="common-anchor-header">3. Distracción del contexto</h3><p>La distracción del contexto se produce cuando un exceso de información contextual domina la atención del modelo, reduciendo su confianza en el conocimiento preformado y el razonamiento general.</p>
<p>En lugar de basarse en patrones ampliamente aprendidos, el modelo sobrevalora los detalles recientes del contexto, incluso cuando son incompletos o poco fiables. Esto puede dar lugar a un razonamiento superficial o frágil que refleje demasiado el contexto en lugar de aplicar una comprensión de más alto nivel.</p>
<h3 id="4-Context-Poisoning" class="common-anchor-header">4. Envenenamiento del contexto</h3><p>El envenenamiento del contexto se produce cuando una información incorrecta entra en el contexto y es repetidamente referenciada y reforzada a lo largo de varios turnos.</p>
<p>Una sola afirmación falsa introducida al principio de la conversación puede convertirse en la base del razonamiento posterior. A medida que el diálogo continúa, el modelo se basa en esta suposición errónea, agravando el error y alejándose aún más de la respuesta correcta.</p>
<h2 id="What-Is-Context-Pruning-and-Why-It-Matters" class="common-anchor-header">Qué es la poda de contextos y por qué es importante<button data-href="#What-Is-Context-Pruning-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p>Una vez que se empieza a trabajar con contextos largos, uno se da cuenta rápidamente de que necesita más de un truco para mantener las cosas bajo control. En los sistemas reales, los equipos suelen combinar varias tácticas: RAG, carga de herramientas, resumen, puesta en cuarentena de determinados mensajes, descarga del historial antiguo, etc. Todas ellas ayudan de distintas maneras. Todas ellas ayudan de distintas maneras. Pero la <strong>poda de contexto</strong> es la que decide directamente <em>lo que realmente se alimenta</em> al modelo.</p>
<p>La poda de contexto, en términos sencillos, es el proceso de eliminar automáticamente la información irrelevante, de poco valor o conflictiva antes de que entre en la ventana de contexto del modelo. Básicamente, se trata de un filtro que conserva sólo los fragmentos de texto que tienen más importancia para la tarea actual.</p>
<p>Otras estrategias pueden reorganizar el contexto, comprimirlo o dejar algunas partes para más adelante. La poda es más directa: <strong>responde a la pregunta: "¿Debería incluirse esta información en el texto?</strong></p>
<p>Por eso la poda acaba siendo especialmente importante en los sistemas RAG. La búsqueda vectorial es genial, pero no es perfecta. A menudo devuelve una gran cantidad de candidatos, algunos útiles, otros vagamente relacionados y otros completamente equivocados. Si simplemente los vuelca todos en la consulta, se encontrará con los modos de fallo que hemos mencionado antes. La poda se sitúa entre la recuperación y el modelo, actuando como un guardián que decide qué trozos conservar.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RAG_Pipeline_with_Context_Pruning_01a0d40819.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Cuando la poda funciona bien, los beneficios aparecen de inmediato: contexto más limpio, respuestas más coherentes, menor uso de tokens y menos efectos secundarios extraños derivados de la introducción de texto irrelevante. Incluso si no se cambia nada en la configuración de la recuperación, añadir un paso de poda sólido puede mejorar notablemente el rendimiento general del sistema.</p>
<p>En la práctica, la poda es una de las optimizaciones de mayor aprovechamiento en un canal de contexto largo o RAG: idea sencilla, gran impacto.</p>
<h2 id="Provence-A-Practical-Context-Pruning-Model" class="common-anchor-header">Provenza: Un modelo práctico de poda de contextos<button data-href="#Provence-A-Practical-Context-Pruning-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>Mientras exploraba enfoques para la poda de contextos, me topé con dos atractivos modelos de código abierto desarrollados en <strong>Naver Labs Europe</strong>: <a href="https://huggingface.co/naver/provence-reranker-debertav3-v1"><strong>Provence</strong></a> y su variante multilingüe, <a href="https://huggingface.co/naver/xprovence-reranker-bgem3-v1"><strong>XProvence</strong></a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/provence1_b9d2c43276.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Provence es un método para entrenar un modelo ligero de poda contextual para la generación aumentada por recuperación, con especial atención a la respuesta a preguntas. Dada una pregunta del usuario y un pasaje recuperado, identifica y elimina las frases irrelevantes, manteniendo sólo la información que contribuye a la respuesta final.</p>
<p>Al podar el contenido de poco valor antes de la generación, Provence reduce el ruido en la entrada del modelo, acorta los mensajes y disminuye la latencia de la inferencia LLM. También es plug-and-play, trabajando con cualquier LLM o sistema de recuperación sin necesidad de una estrecha integración o cambios arquitectónicos.</p>
<p>Provence ofrece varias características prácticas para las canalizaciones RAG del mundo real.</p>
<p><strong>1. Comprensión a nivel de documento</strong></p>
<p>Provence razona sobre los documentos en su conjunto, en lugar de puntuar las frases de forma aislada. Esto es importante porque los documentos del mundo real a menudo contienen referencias como "esto", "esto" o "el método anterior". Aisladas, estas frases pueden ser ambiguas o incluso carecer de sentido. Cuando se ven en su contexto, su relevancia queda clara. Al modelar el documento de forma holística, Provence produce decisiones de poda más precisas y coherentes.</p>
<p><strong>2. Selección adaptativa de frases</strong></p>
<p>Provence determina automáticamente cuántas frases debe conservar de un documento recuperado. En lugar de basarse en reglas fijas como "conservar las cinco frases principales", se adapta a la consulta y al contenido.</p>
<p>Algunas preguntas pueden responderse con una sola frase, mientras que otras requieren varias frases de apoyo. Provence gestiona esta variación de forma dinámica, utilizando un umbral de relevancia que funciona bien en todos los dominios y que puede ajustarse cuando sea necesario, sin necesidad de ajuste manual en la mayoría de los casos.</p>
<p><strong>3. Alta eficiencia con reordenación integrada</strong></p>
<p>Provence está diseñado para ser eficiente. Es un modelo compacto y ligero, por lo que es significativamente más rápido y más barato de ejecutar que los enfoques de poda basados en LLM.</p>
<p>Y lo que es más importante, Provence puede combinar la reordenación y la poda contextual en un único paso. Dado que el reranking es ya una etapa estándar en los pipelines RAG modernos, la integración de la poda en este punto hace que el coste adicional de la poda de contexto sea cercano a cero, al tiempo que mejora la calidad del contexto pasado al modelo de lenguaje.</p>
<p><strong>4. Soporte multilingüe mediante XProvence</strong></p>
<p>Provence también tiene una variante llamada XProvence, que utiliza la misma arquitectura pero está entrenada en datos multilingües. Esto le permite evaluar consultas y documentos en varios idiomas, como chino, inglés y coreano, por lo que es adecuado para sistemas RAG multilingües y multilingües.</p>
<h3 id="How-Provence-Is-Trained" class="common-anchor-header">Cómo se entrena Provence</h3><p>Provence utiliza un diseño de entrenamiento limpio y eficaz basado en una arquitectura de codificación cruzada. Durante el entrenamiento, la consulta y cada pasaje recuperado se concatenan en una única entrada y se codifican juntos. Esto permite al modelo observar el contexto completo tanto de la pregunta como del pasaje a la vez y razonar directamente sobre su relevancia.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/provence2_80523f7a9e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Esta codificación conjunta permite a Provence aprender de señales de relevancia muy precisas. El modelo se ajusta en <a href="https://zilliz.com/ai-faq/what-is-the-difference-between-bert-roberta-and-deberta-for-embeddings"><strong>DeBERTa</strong></a> como codificador ligero y se optimiza para realizar dos tareas simultáneamente:</p>
<ol>
<li><p><strong>Puntuación de relevancia a nivel de documento (puntuación rerank):</strong> El modelo predice una puntuación de relevancia para todo el documento, indicando su grado de coincidencia con la consulta. Por ejemplo, una puntuación de 0,8 representa una gran relevancia.</p></li>
<li><p><strong>Etiquetado de relevancia a nivel de token (máscara binaria):</strong> Paralelamente, el modelo asigna una etiqueta binaria a cada token, indicando si es relevante (<code translate="no">1</code>) o irrelevante (<code translate="no">0</code>) para la consulta.</p></li>
</ol>
<p>Como resultado, el modelo entrenado puede evaluar la relevancia global de un documento e identificar qué partes deben conservarse o eliminarse.</p>
<p>En el momento de la inferencia, Provence predice las etiquetas de pertinencia a nivel de token. A continuación, estas predicciones se agregan a nivel de frase: una frase se conserva si contiene más tokens relevantes que irrelevantes; de lo contrario, se poda. Dado que el modelo se entrena con supervisión a nivel de frase, las predicciones de los tokens dentro de la misma frase tienden a ser coherentes, lo que hace que esta estrategia de agregación sea fiable en la práctica. El comportamiento de poda también puede ajustarse modificando el umbral de agregación para conseguir una poda más conservadora o más agresiva.</p>
<p>Y lo que es más importante, Provence reutiliza la etapa de reordenación que ya incluyen la mayoría de los algoritmos RAG. Esto significa que la poda de contexto se puede añadir con poca o ninguna sobrecarga adicional, haciendo que Provence sea especialmente práctico para los sistemas RAG del mundo real.</p>
<h2 id="Evaluating-Context-Pruning-Performance-Across-Models" class="common-anchor-header">Evaluación del rendimiento de la poda de contexto en distintos modelos<button data-href="#Evaluating-Context-Pruning-Performance-Across-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>Hasta ahora, nos hemos centrado en el diseño y la formación de Provence. El siguiente paso es evaluar su rendimiento en la práctica: qué tan bien poda el contexto, cómo se compara con otros enfoques y cómo se comporta en condiciones reales.</p>
<p>Para responder a estas preguntas, hemos diseñado un conjunto de experimentos cuantitativos que comparan la calidad de la depuración del contexto entre varios modelos en entornos de evaluación realistas.</p>
<p>Los experimentos se centran en dos objetivos principales:</p>
<ul>
<li><p><strong>Eficacia de la poda:</strong> Medimos la precisión con la que cada modelo retiene el contenido relevante al tiempo que elimina la información irrelevante, utilizando métricas estándar como la precisión, la recuperación y la puntuación F1.</p></li>
<li><p><strong>Generalización fuera del dominio:</strong> Se evalúa el rendimiento de cada modelo en distribuciones de datos distintas a las de los datos de entrenamiento, con lo que se evalúa la solidez en situaciones fuera del dominio.</p></li>
</ul>
<h3 id="Models-Compared" class="common-anchor-header">Modelos comparados</h3><ul>
<li><p><a href="https://huggingface.co/naver/provence-reranker-debertav3-v1"><strong>Provenza</strong></a></p></li>
<li><p><a href="https://huggingface.co/naver/xprovence-reranker-bgem3-v1"><strong>XProvence</strong></a></p></li>
<li><p><a href="https://huggingface.co/opensearch-project/opensearch-semantic-highlighter-v1"><strong>OpenSearch Semantic Highlighter</strong></a> (modelo de poda basado en una arquitectura BERT, diseñado específicamente para tareas de resaltado semántico)</p></li>
</ul>
<h3 id="Dataset" class="common-anchor-header">Conjunto de datos</h3><p>Utilizamos WikiText-2 como conjunto de datos de evaluación. WikiText-2 procede de artículos de Wikipedia y contiene diversas estructuras documentales, en las que la información relevante suele estar repartida entre varias frases y las relaciones semánticas pueden no ser triviales.</p>
<p>Es importante destacar que WikiText-2 difiere sustancialmente de los datos que se suelen utilizar para entrenar modelos de poda contextual, aunque sigue pareciéndose a los contenidos del mundo real, con gran cantidad de conocimientos. Esto lo hace muy adecuado para la evaluación fuera del dominio, que es un objetivo clave de nuestros experimentos.</p>
<h3 id="Query-Generation-and-Annotation" class="common-anchor-header">Generación de consultas y anotación</h3><p>Para construir una tarea de poda fuera del dominio, generamos automáticamente pares pregunta-respuesta a partir del corpus WikiText-2 en bruto utilizando <strong>GPT-4o-mini</strong>. Cada muestra de evaluación consta de tres componentes:</p>
<ul>
<li><p><strong>Pregunta:</strong> Una pregunta en lenguaje natural generada a partir del documento.</p></li>
<li><p><strong>Contexto:</strong> El documento completo sin modificar.</p></li>
<li><p><strong>Verdad básica:</strong> anotaciones a nivel de frase que indican qué frases contienen la respuesta (deben conservarse) y cuáles son irrelevantes (deben eliminarse).</p></li>
</ul>
<p>Esta configuración define de forma natural una tarea de poda de contexto: dada una consulta y un documento completo, el modelo debe identificar las frases que realmente importan. Las frases que contienen la respuesta se consideran relevantes y deben conservarse, mientras que todas las demás se consideran irrelevantes y deben eliminarse. Esta formulación permite medir cuantitativamente la calidad de la poda mediante las puntuaciones Precision, Recall y F1.</p>
<p>Lo más importante es que las preguntas generadas no aparecen en los datos de entrenamiento de ningún modelo evaluado. Como resultado, el rendimiento refleja la verdadera generalización en lugar de la memorización. En total, generamos 300 muestras, que abarcan preguntas sencillas basadas en hechos, tareas de razonamiento multisalto y preguntas analíticas más complejas, con el fin de reflejar mejor los patrones de uso del mundo real.</p>
<h3 id="Evaluation-Pipeline" class="common-anchor-header">Proceso de evaluación</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/pipeline_77e52002fc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Optimización de hiperparámetros: Para cada modelo, realizamos una búsqueda cuadriculada en un espacio predefinido de hiperparámetros y seleccionamos la configuración que maximiza la puntuación F1.</p>
<h3 id="Results-and-Analysis" class="common-anchor-header">Resultados y análisis</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/result_0df098152a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Los resultados revelan claras diferencias de rendimiento entre los tres modelos.</p>
<p><strong>Provence</strong> obtiene el mejor rendimiento global, con una <strong>puntuación F1 del 66,76%</strong>. La precisión<strong>(69,53%</strong>) y la recuperación<strong>(64,19%</strong>) están bien equilibradas, lo que indica una sólida generalización fuera del dominio. La configuración óptima utiliza un umbral de poda de <strong>0,6</strong> y α <strong>= 0,051</strong>, lo que sugiere que las puntuaciones de relevancia del modelo están bien calibradas y que el comportamiento de la poda es intuitivo y fácil de ajustar en la práctica.</p>
<p><strong>XProvence</strong> alcanza una <strong>puntuación F1 del 58,97%</strong>, caracterizada por una <strong>alta recuperación (75,52%)</strong> y una <strong>menor precisión (48,37%)</strong>. Esto refleja una estrategia de poda más conservadora que prioriza la retención de información potencialmente relevante frente a la eliminación agresiva del ruido. Este comportamiento puede ser deseable en ámbitos en los que los falsos negativos son costosos, como la sanidad o las aplicaciones jurídicas, pero también aumenta los falsos positivos, lo que reduce la precisión. A pesar de esta desventaja, la capacidad multilingüe de XProvence lo convierte en una buena opción para entornos no anglosajones o multilingües.</p>
<p>Por el contrario, <strong>OpenSearch Semantic Highlighter</strong> obtiene resultados sustancialmente peores, con una <strong>puntuación F1 del 46,37%</strong> (Precisión <strong>62,35%</strong>, Recuperación <strong>36,98%</strong>). La diferencia respecto a Provence y XProvence apunta a limitaciones tanto en la calibración de la puntuación como en la generalización fuera del dominio, especialmente en condiciones fuera del dominio.</p>
<h2 id="Semantic-Highlighting-Another-Way-to-Find-What-Actually-Matters-in-Text" class="common-anchor-header">Resaltado semántico: Otra forma de encontrar lo que realmente importa en el texto<button data-href="#Semantic-Highlighting-Another-Way-to-Find-What-Actually-Matters-in-Text" class="anchor-icon" translate="no">
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
    </button></h2><p>Ahora que hemos hablado de la poda contextual, merece la pena examinar una pieza relacionada del rompecabezas: el <a href="https://milvus.io/blog/zilliz-trained-and-open-sourced-bilingual-semantic-highlighting-model-for-production-ai.md"><strong>resaltado semántico</strong></a>. Desde el punto de vista técnico, ambas funciones realizan prácticamente la misma función subyacente: puntúan los fragmentos de texto en función de su relevancia para una consulta. La diferencia radica en cómo se utiliza el resultado en el proceso.</p>
<p>La mayoría de la gente oye "resaltar" y piensa en los clásicos resaltadores de palabras clave que se ven en Elasticsearch o Solr. Estas herramientas básicamente buscan coincidencias literales de palabras clave y las envuelven en algo como <code translate="no">&lt;em&gt;</code>. Son baratas y predecibles, pero sólo funcionan cuando el texto utiliza <em>exactamente</em> las mismas palabras que la consulta. Si el documento parafrasea, utiliza sinónimos o formula la idea de forma diferente, los resaltadores tradicionales no lo detectan.</p>
<p><strong>El resaltado semántico toma un camino diferente.</strong> En lugar de buscar coincidencias exactas de cadenas, utiliza un modelo para estimar la similitud semántica entre la consulta y distintos fragmentos de texto. Esto le permite resaltar el contenido relevante incluso cuando la redacción es totalmente diferente. Para las cadenas RAG, los flujos de trabajo de agentes o cualquier sistema de búsqueda de inteligencia artificial en el que el significado importa más que los tokens, el resaltado semántico ofrece una imagen mucho más clara de <em>por qué</em> se ha recuperado un documento.</p>
<p>El problema es que la mayoría de las soluciones de resaltado semántico existentes no están diseñadas para cargas de trabajo de IA de producción. Probamos todo lo que había disponible y ninguna de ellas ofrecía el nivel de precisión, latencia o fiabilidad multilingüe que necesitábamos para los sistemas RAG y de agentes reales. Así que terminamos entrenando y abriendo nuestro propio modelo: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p>
<p>A grandes rasgos, <strong>la poda contextual y el resaltado semántico resuelven la misma tarea principal</strong>: dada una consulta y un fragmento de texto, averiguar qué partes son realmente importantes. La única diferencia es lo que ocurre a continuación.</p>
<ul>
<li><p>La<strong>poda contextual</strong> elimina las partes irrelevantes antes de la generación.</p></li>
<li><p><strong>El resaltado semántico</strong> mantiene el texto completo, pero resalta visualmente las partes importantes.</p></li>
</ul>
<p>Como el funcionamiento subyacente es tan similar, a menudo el mismo modelo puede alimentar ambas funciones. Esto facilita la reutilización de componentes en toda la pila y mantiene su sistema RAG más simple y más eficiente en general.</p>
<h3 id="Semantic-Highlighting-in-Milvus-and-Zilliz-Cloud" class="common-anchor-header">Resaltado semántico en Milvus y Zilliz Cloud</h3><p>El resaltado semántico es ahora totalmente compatible con <a href="https://milvus.io">Milvus</a> y <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a> (el servicio totalmente gestionado de Milvus), y ya está resultando útil para cualquiera que trabaje con RAG o búsqueda basada en IA. La función resuelve un problema muy simple pero doloroso: cuando la búsqueda vectorial devuelve un montón de trozos, ¿cómo averiguar rápidamente <em>qué frases de esos trozos son realmente importantes</em>?</p>
<p>Sin resaltado, los usuarios acaban leyendo documentos enteros sólo para entender por qué se ha recuperado algo. Con el resaltado semántico incorporado, Milvus y Zilliz Cloud marcan automáticamente los espacios específicos que están semánticamente relacionados con su consulta, incluso si la redacción es diferente. Se acabó el buscar coincidencias de palabras clave o adivinar por qué aparece un fragmento.</p>
<p>Esto hace que la recuperación sea mucho más transparente. En lugar de limitarse a devolver "documentos relevantes", Milvus muestra <em>dónde</em> reside la relevancia. Para las canalizaciones RAG, esto es especialmente útil porque se puede ver al instante lo que se supone que el modelo debe atender, lo que facilita la depuración y la construcción de avisos.</p>
<p>Hemos integrado este soporte directamente en Milvus y Zilliz Cloud, por lo que no es necesario añadir modelos externos o ejecutar otro servicio para obtener una atribución utilizable. Todo se ejecuta dentro de la ruta de recuperación: búsqueda vectorial → puntuación de relevancia → espacios destacados. Funciona a escala y admite cargas de trabajo multilingües con nuestro modelo <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a>.</p>
<h2 id="Looking-Ahead" class="common-anchor-header">De cara al futuro<button data-href="#Looking-Ahead" class="anchor-icon" translate="no">
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
    </button></h2><p>La ingeniería contextual es aún bastante reciente y queda mucho por descubrir. Incluso con la poda y el resaltado semántico funcionando bien dentro de <a href="https://milvus.io">Milvus</a> y <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a><strong>,</strong> no estamos ni cerca del final de la historia. Hay un montón de áreas que todavía necesitan un verdadero trabajo de ingeniería: hacer que los modelos de poda sean más precisos sin ralentizar las cosas, mejorar en el manejo de consultas extrañas o fuera del dominio, y conectar todas las piezas juntas para que la recuperación → rerank → poda → resaltado se sienta como una tubería limpia en lugar de un conjunto de hacks pegados.</p>
<p>A medida que aumentan las ventanas de contexto, estas decisiones adquieren mayor importancia. Una buena gestión del contexto ya no es un "bonito extra"; se está convirtiendo en una parte esencial para que los sistemas de contexto largo y RAG se comporten de forma fiable.</p>
<p>Vamos a seguir experimentando, evaluando y distribuyendo las piezas que realmente marcan la diferencia para los desarrolladores. El objetivo es sencillo: facilitar la creación de sistemas que no se estropeen con datos desordenados, consultas impredecibles o cargas de trabajo a gran escala.</p>
<p>Si desea hablar de todo esto, o simplemente necesita ayuda para depurar algo, puede entrar en nuestro <a href="https://discord.com/invite/8uyFbECzPX">canal de Discord</a> o reservar una sesión individual de 20 minutos para obtener información, orientación y respuestas a sus preguntas a través de<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<p>Siempre es un placer charlar e intercambiar notas con otros constructores.</p>
