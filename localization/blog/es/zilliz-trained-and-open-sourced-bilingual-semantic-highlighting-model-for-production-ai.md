---
id: >-
  zilliz-trained-and-open-sourced-bilingual-semantic-highlighting-model-for-production-ai.md
title: >-
  Entrenamos y publicamos un modelo de resaltado semántico bilingüe para la RAG
  de producción y la búsqueda de IA
author: Cheney Zhang
date: 2026-01-06T00:00:00.000Z
cover: assets.zilliz.com/semantic_highlight_cover_f35a98fc58.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Semantic Highlighting, RAG, semantic search, Milvus, bilingual model'
meta_title: |
  Open-sourcing a Bilingual Semantic Highlighting Model for Production AI
desc: >-
  Sumérjase en el resaltado semántico, aprenda cómo se construye el modelo
  bilingüe de Zilliz y cómo se comporta en las pruebas comparativas de inglés y
  chino para los sistemas RAG.
origin: >-
  https://milvus.io/blog/zilliz-trained-and-open-sourced-bilingual-semantic-highlighting-model-for-production-ai.md
---
<p>Tanto si estás creando una búsqueda de productos, una canalización RAG o un agente de IA, los usuarios necesitan lo mismo: una forma rápida de ver por qué un resultado es relevante. <strong>El resaltado</strong> ayuda marcando el texto exacto que apoya la coincidencia, para que los usuarios no tengan que escanear todo el documento.</p>
<p>La mayoría de los sistemas siguen basándose en el resaltado por palabras clave. Si un usuario busca "rendimiento del iPhone", el sistema resalta los tokens exactos "iPhone" y "rendimiento". Pero esto se rompe en cuanto el texto expresa la misma idea utilizando una redacción diferente. Una descripción como "chip A15 Bionic, más de un millón en pruebas de rendimiento, fluido y sin lag" se refiere claramente al rendimiento, pero no se resalta nada porque las palabras clave nunca aparecen.</p>
<p><strong>El resaltado semántico</strong> resuelve este problema. En lugar de coincidir con cadenas exactas, identifica tramos de texto que están semánticamente alineados con la consulta. Para los sistemas RAG, la búsqueda por IA y los agentes -en los que la relevancia depende del significado y no de la forma superficial-, esto aporta explicaciones más precisas y fiables de por qué se ha recuperado un documento.</p>
<p>Sin embargo, los métodos de resaltado semántico existentes no están diseñados para cargas de trabajo de IA de producción. Tras evaluar todas las soluciones disponibles, descubrimos que ninguna ofrecía la precisión, latencia, cobertura multilingüe o robustez necesarias para los procesos RAG, los sistemas de agentes o las búsquedas web a gran escala. <strong>Así que entrenamos nuestro propio modelo de resaltado semántico bilingüe y lo pusimos a disposición del público.</strong></p>
<ul>
<li><p>Nuestro modelo de resaltado semántico: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p>Díganos lo que piensa: únase a nuestro <a href="https://discord.com/invite/8uyFbECzPX">Discord</a>, síganos en <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> o reserve una sesión <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">de 20 minutos de Milvus Office Hours</a> con nosotros.</p></li>
</ul>
<h2 id="How-Keyword-Based-Highlighting-Works--and-Why-It-Fails-in-Modern-AI-Systems" class="common-anchor-header">Cómo funciona el resaltado basado en palabras clave y por qué falla en los sistemas modernos de inteligencia artificial<button data-href="#How-Keyword-Based-Highlighting-Works--and-Why-It-Fails-in-Modern-AI-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>Los<strong>sistemas de búsqueda tradicionales implementan el resaltado a través de la simple concordancia de palabras clave</strong>. Cuando se obtienen resultados, el motor localiza las posiciones exactas de los tokens que coinciden con la consulta y las envuelve en marcas (normalmente etiquetas <code translate="no">&lt;em&gt;</code> ), dejando que el frontend se encargue de resaltarlas. Esto funciona bien cuando los términos de la consulta aparecen textualmente en el texto.</p>
<p>El problema es que este modelo asume que la relevancia está ligada a la coincidencia exacta de palabras clave. Una vez que se rompe esa suposición, la fiabilidad cae rápidamente. Cualquier resultado que exprese la idea correcta con una redacción diferente acabará sin destacar, aunque el paso de recuperación haya sido correcto.</p>
<p>Esta debilidad se hace evidente en las aplicaciones modernas de IA. En las canalizaciones RAG y los flujos de trabajo de los agentes de IA, las consultas son más abstractas, los documentos son más largos y la información relevante puede no reutilizar las mismas palabras. El resaltado basado en palabras clave ya no puede mostrar a los desarrolladores -o a los usuarios finales- dónde<em>está realmente la respuesta</em>, lo que hace que el sistema en general parezca menos preciso incluso cuando la recuperación funciona según lo previsto.</p>
<p>Supongamos que un usuario pregunta: <em>"¿Cómo puedo mejorar la eficiencia de ejecución del código Python?".</em> El sistema recupera un documento técnico de una base de datos vectorial. El resaltado tradicional sólo puede marcar coincidencias literales como <em>"Python",</em> <em>"código",</em> <em>"ejecución"</em> y <em>"eficiencia".</em></p>
<p>Sin embargo, las partes más útiles del documento podrían ser:</p>
<ul>
<li><p>Utilizar operaciones vectorizadas NumPy en lugar de bucles explícitos</p></li>
<li><p>Evitar la creación repetida de objetos dentro de bucles</p></li>
</ul>
<p>Estas frases responden directamente a la pregunta, pero no contienen ninguno de los términos de la consulta. En consecuencia, el resaltado tradicional falla por completo. Puede que el documento sea relevante, pero el usuario sigue teniendo que escanearlo línea por línea para localizar la respuesta real.</p>
<p>El problema se acentúa aún más con los agentes de IA. A menudo, la consulta de búsqueda de un agente no es la pregunta original del usuario, sino una instrucción derivada producida a través del razonamiento y la descomposición de tareas. Por ejemplo, si un usuario pregunta <em>: "¿Puedes analizar las tendencias recientes del mercado?",</em> el agente podría generar una consulta como "Recuperar datos de ventas de electrónica de consumo del cuarto trimestre de 2024, tasas de crecimiento interanuales, cambios en la cuota de mercado de los principales competidores y fluctuaciones de los costes de la cadena de suministro".</p>
<p>Esta consulta abarca múltiples dimensiones y codifica una intención compleja. Sin embargo, el resaltado tradicional basado en palabras clave sólo puede marcar mecánicamente coincidencias literales como <em>"2024",</em> <em>"datos de ventas"</em> o <em>"tasa de crecimiento".</em></p>
<p>Mientras tanto, los datos más valiosos pueden ser de este tipo:</p>
<ul>
<li><p>La serie iPhone 15 impulsó una recuperación más amplia del mercado.</p></li>
<li><p>Las limitaciones de suministro de chips elevaron los costes un 15</p></li>
</ul>
<p>Puede que estas conclusiones no compartan ni una sola palabra clave con la consulta, aunque sean exactamente lo que el agente está intentando extraer. Los agentes necesitan identificar rápidamente la información verdaderamente útil a partir de grandes volúmenes de contenido recuperado, y el resaltado basado en palabras clave no ofrece ninguna ayuda real.</p>
<h2 id="What-Is-Semantic-Highlighting-and-Pain-Points-in-Today’s-Solutions" class="common-anchor-header">Qué es el resaltado semántico y cuáles son los puntos débiles de las soluciones actuales<button data-href="#What-Is-Semantic-Highlighting-and-Pain-Points-in-Today’s-Solutions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>El resaltado semántico se basa en la misma idea que subyace a la búsqueda semántica: búsqueda basada en el significado y no en las palabras exactas</strong>. En la búsqueda semántica, los modelos de incrustación convierten el texto en vectores, de modo que un sistema de búsqueda (normalmente respaldado por una base de datos vectorial como <a href="https://milvus.io/">Milvus) puede</a>recuperar pasajes que transmiten la misma idea que la consulta, aunque la redacción sea diferente. El resaltado semántico aplica este principio con mayor precisión. En lugar de marcar los resultados literales de las palabras clave, destaca los espacios específicos dentro de un documento que son semánticamente relevantes para la intención del usuario.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vs_20ec73c4a7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Este enfoque resuelve un problema central del resaltado tradicional, que sólo funciona cuando los términos de la consulta aparecen textualmente. Si un usuario busca "rendimiento del iPhone", el resaltado basado en palabras clave ignora frases como "chip A15 Bionic", "más de un millón en pruebas comparativas" o "fluido sin lag", aunque estas líneas respondan claramente a la pregunta. El resaltado semántico capta estas conexiones basadas en el significado y muestra las partes del texto que realmente interesan a los usuarios.</p>
<p>En teoría, se trata de un problema sencillo de correspondencia semántica. Los modelos modernos de incrustación ya codifican bien la similitud, por lo que las piezas conceptuales ya están en su sitio. El reto viene de las limitaciones del mundo real: el resaltado se produce en cada consulta, a menudo a través de muchos documentos recuperados, lo que hace que la latencia, el rendimiento y la robustez entre dominios sean requisitos no negociables. Los grandes modelos lingüísticos son sencillamente demasiado lentos y caros para funcionar en esta ruta de alta frecuencia.</p>
<p>Por eso, la práctica del resaltado semántico requiere un modelo ligero y especializado, lo suficientemente pequeño como para integrarse en la infraestructura de búsqueda y lo suficientemente rápido como para devolver resultados en unos pocos milisegundos. Aquí es donde la mayoría de las soluciones existentes fallan. Los modelos pesados ofrecen precisión, pero no pueden funcionar a gran escala; los modelos ligeros son rápidos, pero pierden precisión o fallan con datos multilingües o específicos de un dominio.</p>
<h3 id="opensearch-semantic-highlighter" class="common-anchor-header">opensearch-semantic-highlighter</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/opensearch_en_aea06a2114.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A principios de este año, OpenSearch lanzó un modelo dedicado al resaltado semántico: <a href="https://huggingface.co/opensearch-project/opensearch-semantic-highlighter-v1"><strong>opensearch-semantic-highlighter-v1</strong></a>. Aunque es un intento significativo de resolver el problema, tiene dos limitaciones críticas.</p>
<ul>
<li><p><strong>Ventana de contexto pequeña:</strong> El modelo se basa en una arquitectura BERT y admite un máximo de 512 tokens, unos 300-400 caracteres chinos o 400-500 palabras inglesas. En el mundo real, las descripciones de productos y los documentos técnicos suelen abarcar miles de palabras. El contenido más allá de la primera ventana simplemente se trunca, lo que obliga al modelo a identificar lo más destacado basándose sólo en una pequeña fracción del documento.</p></li>
<li><p><strong>Escasa generalización fuera del dominio:</strong> El modelo sólo funciona bien en distribuciones de datos similares a las de su conjunto de entrenamiento. Cuando se aplica a datos fuera del dominio -como cuando se utiliza un modelo entrenado en artículos de noticias para destacar contenidos de comercio electrónico o documentación técnica-, el rendimiento se degrada drásticamente. En nuestros experimentos, el modelo alcanza una puntuación F1 de alrededor de 0,72 en datos dentro del dominio, pero cae a aproximadamente 0,46 en conjuntos de datos fuera del dominio. Este nivel de inestabilidad es problemático para la producción. Además, el modelo no es compatible con el chino.</p></li>
</ul>
<h3 id="Provence--XProvence" class="common-anchor-header">Provenza / XProvence</h3><p><a href="https://huggingface.co/naver/provence-reranker-debertav3-v1"><strong>Provence</strong></a> es un modelo desarrollado por <a href="https://zilliz.com/customers/naver">Naver</a> que se entrenó inicialmente para la <strong>poda de contextos,</strong>una tarea estrechamente relacionada con el resaltado semántico.</p>
<p>Ambas tareas se basan en la misma idea subyacente: utilizar la concordancia semántica para identificar el contenido relevante y filtrar las partes irrelevantes. Por esta razón, Provence puede reutilizarse para el resaltado semántico con relativamente poca adaptación.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/provence_053cd3bccc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Provence es un modelo exclusivamente inglés y funciona razonablemente bien en ese entorno. <a href="https://huggingface.co/naver/xprovence-reranker-bgem3-v1"><strong>XProvence</strong></a> es su variante multilingüe, compatible con más de una docena de idiomas, incluidos el chino, el japonés y el coreano. A primera vista, esto hace que XProvence parezca un buen candidato para escenarios de resaltado semántico bilingüe o multilingüe.</p>
<p>En la práctica, sin embargo, tanto Provence como XProvence presentan varias limitaciones notables:</p>
<ul>
<li><p><strong>Rendimiento más débil en inglés en el modelo multilingüe:</strong> XProvence no iguala el rendimiento de Provence en las pruebas de referencia en inglés. Se trata de una solución de compromiso habitual en los modelos multilingües: la capacidad se reparte entre las distintas lenguas, lo que a menudo se traduce en un menor rendimiento en las lenguas con más recursos, como el inglés. Esta limitación es importante en sistemas reales en los que el inglés sigue siendo la carga de trabajo principal o dominante.</p></li>
<li><p><strong>Rendimiento limitado en chino:</strong> XProvence admite muchos idiomas. Durante la formación multilingüe, los datos y la capacidad del modelo se reparten entre los distintos idiomas, lo que limita la especialización del modelo en uno solo. Como resultado, su rendimiento en chino es sólo marginalmente aceptable y a menudo insuficiente para los casos de uso de resaltado de alta precisión.</p></li>
<li><p><strong>Desajuste entre los objetivos de poda y de resaltado:</strong> Provence está optimizado para la poda contextual, en la que la prioridad es el recuerdo: conservar la mayor cantidad posible de contenido potencialmente útil para evitar la pérdida de información crítica. El resaltado semántico, por el contrario, hace hincapié en la precisión: resaltar sólo las frases más relevantes, no grandes porciones del documento. Cuando se aplican modelos provenzales al resaltado, este desajuste suele dar lugar a resaltados demasiado amplios o ruidosos.</p></li>
<li><p><strong>Licencias restrictivas:</strong> Tanto Provence como XProvence están sujetos a la licencia CC BY-NC 4.0, que no permite el uso comercial. Esta restricción por sí sola los hace inadecuados para muchos despliegues de producción.</p></li>
</ul>
<h3 id="Open-Provence" class="common-anchor-header">Open Provence</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openprovence_en_c4f0aa8b65.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://github.com/hotchpotch/open_provence"><strong>Open Provence</strong></a> es un proyecto impulsado por la comunidad que reimplementa el proceso de formación de Provence de forma abierta y transparente. No sólo proporciona scripts de entrenamiento, sino también flujos de trabajo de procesamiento de datos, herramientas de evaluación y modelos preentrenados a múltiples escalas.</p>
<p>Una ventaja clave de Open Provence es su <strong>licencia MIT permisiva</strong>. A diferencia de Provence y XProvence, se puede utilizar con seguridad en entornos comerciales sin restricciones legales, lo que lo hace atractivo para los equipos orientados a la producción.</p>
<p>Dicho esto, Open Provence actualmente sólo soporta <strong>inglés y japonés</strong>, lo que lo hace inadecuado para nuestros casos de uso bilingüe.</p>
<h2 id="We-Trained-and-Open-Sourced-a-Bilingual-Semantic-Highlighting-Model" class="common-anchor-header">Entrenamos y desarrollamos un modelo de resaltado semántico bilingüe<button data-href="#We-Trained-and-Open-Sourced-a-Bilingual-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>Un modelo de resaltado semántico diseñado para cargas de trabajo del mundo real debe ofrecer algunas capacidades esenciales:</p>
<ul>
<li><p>Alto rendimiento multilingüe</p></li>
<li><p>Una ventana de contexto lo suficientemente grande como para soportar documentos largos</p></li>
<li><p>Generalización robusta fuera del dominio</p></li>
<li><p>Alta precisión en las tareas de resaltado semántico</p></li>
<li><p>Una licencia permisiva y de fácil uso (MIT o Apache 2.0).</p></li>
</ul>
<p>Tras evaluar las soluciones existentes, descubrimos que ninguno de los modelos disponibles cumplía los requisitos necesarios para su uso en producción. Así que decidimos entrenar nuestro propio modelo de resaltado semántico: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hugging_face_56eca8f423.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Para conseguir todo esto, adoptamos un enfoque sencillo: utilizar grandes modelos lingüísticos para generar datos etiquetados de alta calidad y, a continuación, entrenar un modelo de resaltado semántico ligero sobre ellos utilizando herramientas de código abierto. Esto nos permite combinar la fuerza de razonamiento de los LLM con la eficiencia y la baja latencia necesarias en los sistemas de producción.</p>
<p><strong>La parte más difícil de este proceso es la construcción de datos</strong>. Durante la anotación, pedimos a un LLM (Qwen3 8B) que nos proporcione no sólo los tramos destacados, sino también todo el razonamiento que hay detrás de ellos. Esta señal de razonamiento adicional produce una supervisión más precisa y coherente y mejora significativamente la calidad del modelo resultante.</p>
<p>A grandes rasgos, el proceso de anotación funciona de la siguiente manera: <strong>razonamiento LLM → etiquetas destacadas → filtrado → muestra de entrenamiento final.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/pipeline_en_2e917fe1ce.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Este diseño ofrece tres ventajas concretas en la práctica:</p>
<ul>
<li><p><strong>Mayor calidad de etiquetado</strong>: Se pide al modelo que <em>primero piense y luego responda</em>. Este paso intermedio de razonamiento sirve como autocomprobación integrada, reduciendo la probabilidad de etiquetas superficiales o incoherentes.</p></li>
<li><p><strong>Mayor capacidad de observación y depuración</strong>: Como cada etiqueta va acompañada de un rastro de razonamiento, los errores se hacen visibles. Esto facilita el diagnóstico de los casos de fallo y el ajuste rápido de los avisos, las reglas o los filtros de datos en el proceso.</p></li>
<li><p><strong>Datos reutilizables</strong>: Las trazas de razonamiento proporcionan un contexto valioso para futuros reetiquetados. A medida que cambian los requisitos, los mismos datos pueden revisarse y refinarse sin tener que empezar de cero.</p></li>
</ul>
<p>Con este proceso generamos más de un millón de muestras de entrenamiento bilingües, divididas a partes iguales entre inglés y chino.</p>
<p>Para el entrenamiento del modelo, partimos de BGE-M3 Reranker v2 (0,6B parámetros, ventana de contexto de 8.192 tokens), adoptamos el marco de entrenamiento Open Provence y entrenamos durante tres épocas en GPUs 8× A100, completando el entrenamiento en aproximadamente cinco horas.</p>
<p>Profundizaremos en estas decisiones técnicas -incluyendo por qué nos basamos en trazas de razonamiento, cómo seleccionamos el modelo base y cómo se construyó el conjunto de datos- en un post posterior.</p>
<h2 id="Benchmarking-Zilliz’s-Bilingual-Semantic-Highlighting-Model" class="common-anchor-header">Evaluación comparativa del modelo de resaltado semántico bilingüe de Zilliz<button data-href="#Benchmarking-Zilliz’s-Bilingual-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>Para evaluar el rendimiento en el mundo real, evaluamos varios modelos de resaltado semántico en un conjunto de datos muy variado. Las pruebas comparativas abarcan escenarios dentro y fuera del dominio, en inglés y chino, para reflejar la variedad de contenidos que se encuentran en los sistemas de producción.</p>
<h3 id="Datasets" class="common-anchor-header">Conjuntos de datos</h3><p>En nuestra evaluación utilizamos los siguientes conjuntos de datos:</p>
<ul>
<li><p><strong>MultiSpanQA (inglés)</strong>: un conjunto de datos de respuesta a preguntas multi-span dentro del dominio.</p></li>
<li><p><strong>WikiText-2 (inglés)</strong>: un corpus de Wikipedia fuera del dominio.</p></li>
<li><p><strong>MultiSpanQA-ZH (chino)</strong>: conjunto de datos chino de respuesta a preguntas multipanorama.</p></li>
<li><p><strong>WikiText-2-ZH (chino)</strong>: un corpus Wikipedia chino fuera del dominio.</p></li>
</ul>
<h3 id="Models-Compared" class="common-anchor-header">Modelos comparados</h3><p>Los modelos incluidos en la comparación son</p>
<ul>
<li><p><strong>Modelos Open Provence</strong></p></li>
<li><p><strong>Provence / XProvence</strong> (publicado por Naver)</p></li>
<li><p><strong>Resaltador semántico OpenSearch</strong></p></li>
<li><p><strong>Modelo de resaltado semántico bilingüe de Zilliz</strong></p></li>
</ul>
<h3 id="Results-and-Analysis" class="common-anchor-header">Resultados y análisis</h3><p><strong>Conjuntos de datos en inglés:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/en_dataset_fce4cbc747.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Datos en chino:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zh_dataset_ac7760e0b5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>En todas las pruebas de referencia bilingües, nuestro modelo alcanza <strong>puntuaciones F1 medias de última generación</strong>, superando a todos los modelos y enfoques evaluados anteriormente. Las ganancias son especialmente pronunciadas en los <strong>conjuntos de datos chinos</strong>, donde nuestro modelo supera significativamente a XProvence, el único otro modelo evaluado con soporte chino.</p>
<p>Y lo que es más importante, nuestro modelo ofrece un rendimiento equilibrado tanto en inglés como en chino, una propiedad que las soluciones existentes tienen dificultades para alcanzar:</p>
<ul>
<li><p><strong>Open Provence</strong> sólo es compatible con el inglés</p></li>
<li><p><strong>XProvence</strong> sacrifica el rendimiento en inglés en comparación con Provence.</p></li>
<li><p><strong>OpenSearch Semantic Highlighter</strong> carece de soporte para chino y muestra una generalización débil.</p></li>
</ul>
<p>Como resultado, nuestro modelo evita las habituales disyuntivas entre cobertura lingüística y rendimiento, lo que lo hace más adecuado para las implantaciones bilingües del mundo real.</p>
<h3 id="A-Concrete-Example-in-Practice" class="common-anchor-header">Un ejemplo concreto en la práctica</h3><p>Más allá de las puntuaciones de referencia, a menudo resulta más revelador examinar un ejemplo concreto. El siguiente caso muestra cómo se comporta nuestro modelo en un escenario real de resaltado semántico y por qué importa la precisión.</p>
<p><strong>Consulta:</strong> ¿Quién escribió la película <em>"Matar a un ciervo sagrado"</em>?</p>
<p><strong>Contexto (5 frases):</strong></p>
<ol>
<li><p><em>The Killing of a Sacred De</em> er es una película de suspense psicológico de 2017 dirigida por Yorgos Lanthimos, con guion escrito por Lanthimos y Efthymis Filippou.</p></li>
<li><p>La película está protagonizada por Colin Farrell, Nicole Kidman, Barry Keoghan, Raffey Cassidy, Sunny Suljic, Alicia Silverstone y Bill Camp.</p></li>
<li><p>La historia se basa en la antigua obra griega <em>Ifigenia en Aulis</em>, de Eurípides.</p></li>
<li><p>La película narra la historia de un cirujano cardiaco que entabla una amistad secreta con un adolescente relacionado con su pasado.</p></li>
<li><p>Le presenta a su familia, tras lo cual comienzan a producirse misteriosas enfermedades.</p></li>
</ol>
<p><strong>Destacado correcto:</strong> La<strong>frase 1</strong> es la respuesta correcta, ya que indica explícitamente que el guión fue escrito por Yorgos Lanthimos y Efthymis Filippou.</p>
<p>Este ejemplo contiene una trampa sutil. <strong>La frase 3</strong> menciona a Eurípides, el autor de la obra griega original en la que se basa la historia. Sin embargo, la pregunta se refiere a quién escribió la <em>película</em>, no el material original. La respuesta correcta es, por tanto, los guionistas de la película, no el dramaturgo de hace miles de años.</p>
<p><strong>Resultados:</strong></p>
<p>En la tabla siguiente se resume el rendimiento de los distintos modelos en este ejemplo.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Modelo</strong></th><th style="text-align:center"><strong>Respuesta correcta identificada</strong></th><th style="text-align:center"><strong>Resultado</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>Nuestro (M3 bilingüe)</strong></td><td style="text-align:center">✓</td><td style="text-align:center">Seleccionó la frase 1 (correcta) y la frase 3</td></tr>
<tr><td style="text-align:center"><strong>XProvenza v1</strong></td><td style="text-align:center">✗</td><td style="text-align:center">Seleccionó sólo la frase 3, falló la respuesta correcta</td></tr>
<tr><td style="text-align:center"><strong>XProvence v2</strong></td><td style="text-align:center">✗</td><td style="text-align:center">Seleccionó sólo la frase 3, falló la respuesta correcta</td></tr>
</tbody>
</table>
<p><strong>Comparación de la puntuación a nivel de frase</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Frase</strong></th><th><strong>La nuestra (M3 bilingüe)</strong></th><th style="text-align:center"><strong>XProvence v1</strong></th><th style="text-align:center"><strong>XProvence v2</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Frase 1 (guión de película, <strong>correcto</strong>)</td><td><strong>0.915</strong></td><td style="text-align:center">0.133</td><td style="text-align:center">0.081</td></tr>
<tr><td style="text-align:center">Frase 3 (obra de teatro original, distractor)</td><td>0.719</td><td style="text-align:center"><strong>0.947</strong></td><td style="text-align:center"><strong>0.802</strong></td></tr>
</tbody>
</table>
<p><strong>Puntos débiles de XProvence</strong></p>
<ul>
<li><p>XProvence se siente fuertemente atraído por las palabras clave <em>"Eurípides"</em> y <em>"escribió",</em> asignando a la frase 3 una puntuación casi perfecta (0,947 y 0,802).</p></li>
<li><p>Al mismo tiempo, ignora en gran medida la respuesta correcta de la frase 1, asignándole puntuaciones extremadamente bajas (0,133 y 0,081).</p></li>
<li><p>Incluso tras reducir el umbral de decisión de 0,5 a 0,2, el modelo sigue sin encontrar la respuesta correcta.</p></li>
</ul>
<p>En otras palabras, el modelo se rige principalmente por asociaciones superficiales de palabras clave y no por la intención real de la pregunta.</p>
<p><strong>Diferencias en el comportamiento de nuestro modelo</strong></p>
<ul>
<li><p>Nuestro modelo asigna una puntuación alta (0,915) a la respuesta correcta de la frase 1, identificando correctamente a <em>los guionistas de la película</em>.</p></li>
<li><p>También asigna una puntuación moderada (0,719) a la frase 3, ya que esa frase sí menciona un concepto relacionado con el guión.</p></li>
<li><p>Lo más importante es que la separación es clara y significativa: <strong>0,915 frente a 0,719</strong>, una diferencia de casi 0,2.</p></li>
</ul>
<p>Este ejemplo pone de manifiesto la fuerza de nuestro método: ir más allá de las asociaciones basadas en palabras clave para interpretar correctamente la intención del usuario. Incluso cuando aparecen varios conceptos de "autor", el modelo destaca sistemáticamente aquel al que se refiere realmente la pregunta.</p>
<p>Compartiremos un informe de evaluación más detallado y otros estudios de casos en un próximo artículo.</p>
<h2 id="Try-It-Out-and-Tell-Us-What-You-Think" class="common-anchor-header">Pruébelo y díganos qué le parece<button data-href="#Try-It-Out-and-Tell-Us-What-You-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>Hemos puesto a disposición del público nuestro modelo de resaltado semántico bilingüe en <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">Hugging Face</a>, con todas las ponderaciones del modelo para que puedas empezar a experimentar de inmediato. Nos encantaría saber qué tal le funciona. Por favor, comparta con nosotros sus comentarios, problemas o ideas de mejora a medida que lo vaya probando.</p>
<p>Paralelamente, estamos trabajando en un servicio de inferencia listo para producción e integrando el modelo directamente en <a href="https://milvus.io/">Milvus</a> como una API nativa de Semantic Highlighting. Esta integración ya está en marcha y estará disponible en breve.</p>
<p>El resaltado semántico abre la puerta a una experiencia más intuitiva de la RAG y la IA agéntica. Cuando Milvus recupera varios documentos largos, el sistema puede mostrar inmediatamente las frases más relevantes, dejando claro dónde está la respuesta. Esto no sólo mejora la experiencia del usuario final, sino que también ayuda a los desarrolladores a depurar los procesos de recuperación al mostrar exactamente en qué partes del contexto se basa el sistema.</p>
<p>Creemos que el resaltado semántico se convertirá en una función estándar en la próxima generación de sistemas de búsqueda y GAR. Si tiene ideas, sugerencias o casos de uso para el resaltado semántico bilingüe, únase a nuestro <a href="https://discord.com/invite/8uyFbECzPX">canal de Discord</a> y comparta sus opiniones. También puede reservar una sesión individual de 20 minutos para obtener información, orientación y respuestas a sus preguntas a través de <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>.</p>
