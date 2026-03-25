---
id: build-smarter-rag-routing-hybrid-retrieval.md
title: >-
  Más allá de la RAG ingenua: crear sistemas más inteligentes con enrutamiento
  de consultas y recuperación híbrida
author: Min Yin
date: 2026-3-25
cover: assets.zilliz.com/cover_beyond_naive_rag_7db83a08f9.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  RAG architecture, hybrid retrieval, query routing, vector search BM25, RAG
  evaluation
meta_title: |
  Build Smarter RAG with Routing and Hybrid Retrieval
desc: >-
  Descubra cómo los sistemas RAG modernos utilizan el enrutamiento de consultas,
  la recuperación híbrida y la evaluación por etapas para ofrecer mejores
  respuestas a menor coste.
origin: 'https://milvus.io/blog/build-smarter-rag-routing-hybrid-retrieval.md'
---
<p>Su canal de <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> recupera documentos para cada consulta, independientemente de si es necesaria la recuperación. Ejecuta la misma búsqueda por similitud en código, lenguaje natural e informes financieros. Y cuando los resultados son malos, no hay forma de saber qué etapa se ha roto.</p>
<p>Estos son los síntomas de un sistema RAG ingenuo: un proceso fijo que trata todas las consultas de la misma manera. Los sistemas RAG modernos funcionan de otra manera. Dirigen las consultas al gestor adecuado, combinan varios métodos de recuperación y evalúan cada etapa de forma independiente.</p>
<p>Este artículo describe una arquitectura de cuatro nodos para crear sistemas RAG más inteligentes, explica cómo implementar <a href="https://zilliz.com/learn/hybrid-search-a-practical-guide">la recuperación híbrida</a> sin mantener índices separados y muestra cómo evaluar cada etapa de la canalización para poder depurar los problemas con mayor rapidez.</p>
<h2 id="Why-Long-Context-Doesnt-Replace-RAG" class="common-anchor-header">Por qué el contexto largo no sustituye a la RAG<button data-href="#Why-Long-Context-Doesnt-Replace-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>"Poner todo en el prompt" es una sugerencia común ahora que los modelos soportan ventanas de tokens de 128K+. No se sostiene en producción por dos razones.</p>
<p><strong>El coste aumenta con la base de conocimientos, no con la consulta.</strong> Cada solicitud envía toda la base de conocimientos a través del modelo. Para un corpus de 100.000 tokens, son 100.000 tokens de entrada por solicitud, independientemente de si la respuesta requiere un párrafo o diez. Los costes mensuales de inferencia crecen linealmente con el tamaño del corpus.</p>
<p><strong>La atención disminuye con la longitud del contexto.</strong> Los modelos tienen dificultades para centrarse en la información relevante oculta en contextos largos. La investigación sobre el efecto "perdido en el medio" (Liu et al., 2023) muestra que los modelos son más propensos a pasar por alto información situada en medio de entradas largas. Las ventanas de contexto más grandes no han resuelto este problema, ya que la calidad de la atención no ha seguido el ritmo del tamaño de la ventana.</p>
<p>RAG evita ambos problemas recuperando sólo los pasajes relevantes antes de la generación. La cuestión no es si la GAR es necesaria, sino cómo construir una GAR que realmente funcione.</p>
<h2 id="Whats-Wrong-with-Traditional-RAG" class="common-anchor-header">¿Qué tiene de malo la GAR tradicional?<button data-href="#Whats-Wrong-with-Traditional-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>La RAG tradicional sigue un proceso fijo: incrustar la consulta, ejecutar <a href="https://zilliz.com/learn/what-is-vector-search">la búsqueda de similitud vectorial</a>, obtener los K mejores resultados y generar una respuesta. Todas las consultas siguen el mismo camino.</p>
<p>Esto crea dos problemas:</p>
<ol>
<li><p><strong>Cálculo desperdiciado en consultas triviales.</strong> "¿Cuánto es 2 + 2?" no necesita recuperación, pero el sistema la ejecuta de todos modos, lo que añade latencia y coste sin ningún beneficio.</p></li>
<li><p><strong>Recuperación frágil en consultas complejas.</strong> Las frases ambiguas, los sinónimos o las consultas en varios idiomas a menudo hacen fracasar la similitud vectorial pura. Cuando la recuperación omite documentos relevantes, la calidad de la generación cae sin remedio.</p></li>
</ol>
<p>La solución: añadir la toma de decisiones antes de la recuperación. Un sistema RAG moderno decide <em>si</em> recuperar, <em>qué</em> buscar y <em>cómo</em> buscar, en lugar de ejecutar ciegamente el mismo proceso cada vez.</p>
<h2 id="How-Modern-RAG-Systems-Work-A-Four-Node-Architecture" class="common-anchor-header">Cómo funcionan los sistemas RAG modernos: Arquitectura de cuatro nodos<button data-href="#How-Modern-RAG-Systems-Work-A-Four-Node-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_smarter_rag_routing_hybrid_retrieval_1_058ab7eb6b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>En lugar de un proceso fijo, un sistema RAG moderno dirige cada consulta a través de cuatro nodos de decisión. Cada nodo responde a una pregunta sobre cómo gestionar la consulta actual.</p>
<h3 id="Node-1-Query-Routing--Does-This-Query-Need-Retrieval" class="common-anchor-header">Nodo 1: Enrutamiento de la consulta - ¿Es necesario recuperar esta consulta?</h3><p>El enrutamiento de consultas es la primera decisión del proceso. Clasifica la consulta entrante y la envía por el camino adecuado:</p>
<table>
<thead>
<tr><th>Tipo de consulta</th><th>Ejemplo</th><th>Acción</th></tr>
</thead>
<tbody>
<tr><td>Sentido común / conocimiento general</td><td>"¿Qué es 2 + 2?</td><td>Respuesta directa con la recuperación de saltos LLM</td></tr>
<tr><td>Pregunta de base de conocimientos</td><td>"¿Cuáles son las especificaciones del Modelo X?</td><td>Dirigir a la cadena de recuperación</td></tr>
<tr><td>Información en tiempo real</td><td>"El tiempo en París este fin de semana</td><td>Llamar a una API externa</td></tr>
</tbody>
</table>
<p>El enrutamiento por adelantado evita la recuperación innecesaria de consultas que no la necesitan. En los sistemas en los que una gran parte de las consultas son simples o de conocimiento general, esto por sí solo puede reducir significativamente los costes de computación.</p>
<h3 id="Node-2-Query-Rewriting--What-Should-the-System-Search-For" class="common-anchor-header">Nodo 2: Reescritura de consultas: ¿qué debe buscar el sistema?</h3><p>Las consultas de los usuarios suelen ser vagas. Una pregunta como "las principales cifras del informe del tercer trimestre de LightOn" no se traduce bien en una consulta de búsqueda.</p>
<p>La reescritura de consultas transforma la pregunta original en condiciones de búsqueda estructuradas:</p>
<ul>
<li><strong>Rango temporal:</strong> 1 de julio - 30 de septiembre de 2025 (Q3)</li>
<li><strong>Tipo de documento:</strong> Informe financiero</li>
<li><strong>Entidad:</strong> LightOn, Departamento financiero</li>
</ul>
<p>Este paso acorta la distancia entre la forma en que los usuarios formulan las preguntas y la forma en que los sistemas de recuperación indexan los documentos. Mejores consultas significan menos resultados irrelevantes.</p>
<h3 id="Node-3-Retrieval-Strategy-Selection--How-Should-the-System-Search" class="common-anchor-header">Nodo 3: Selección de la estrategia de recuperación - ¿Cómo debe buscar el sistema?</h3><p>Cada tipo de contenido requiere una estrategia de recuperación diferente. Un único método no puede abarcarlo todo:</p>
<table>
<thead>
<tr><th>Tipo de contenido</th><th>Mejor método de recuperación</th><th>Por qué</th></tr>
</thead>
<tbody>
<tr><td>Código (nombres de variables, firmas de funciones)</td><td>Búsqueda léxica<a href="https://zilliz.com/learn/mastering-bm25-a-deep-dive-into-the-algorithm-and-application-in-milvus">(BM25</a>)</td><td>La concordancia exacta de palabras clave funciona bien en tokens estructurados</td></tr>
<tr><td>Lenguaje natural (documentos, artículos)</td><td>Búsqueda semántica (vectores densos)</td><td>Maneja sinónimos, paráfrasis e intención</td></tr>
<tr><td>Multimodal (gráficos, diagramas, dibujos)</td><td>Recuperación multimodal</td><td>Captura la estructura visual que la extracción de texto pasa por alto.</td></tr>
</tbody>
</table>
<p>Los documentos se etiquetan con metadatos en el momento de la indexación. En el momento de la consulta, estas etiquetas orientan sobre qué documentos buscar y qué método de recuperación utilizar.</p>
<h3 id="Node-4-Minimal-Context-Generation--How-Much-Context-Does-the-Model-Need" class="common-anchor-header">Nodo 4: Generación de contexto mínimo: ¿cuánto contexto necesita el modelo?</h3><p>Tras la recuperación y <a href="https://zilliz.com/learn/optimize-rag-with-rerankers-the-role-and-tradeoffs">reordenación</a>, el sistema sólo envía al modelo los pasajes más relevantes, no documentos enteros.</p>
<p>Esto es más importante de lo que parece. En comparación con la carga de documentos completos, el envío de sólo los pasajes relevantes puede reducir el uso de tokens en más de un 90%. Un menor número de tokens se traduce en respuestas más rápidas y menores costes, incluso cuando se utiliza la memoria caché.</p>
<h2 id="Why-Hybrid-Retrieval-Matters-for-Enterprise-RAG" class="common-anchor-header">Por qué la recuperación híbrida es importante para la GDR empresarial<button data-href="#Why-Hybrid-Retrieval-Matters-for-Enterprise-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>En la práctica, la selección de la estrategia de recuperación (nodo 3) es donde la mayoría de los equipos se atascan. Ningún método de recuperación cubre todos los tipos de documentos empresariales.</p>
<p>Algunos argumentan que la búsqueda por palabras clave es suficiente, después de todo, la búsqueda de código basada en grep de Claude Code funciona bien. Pero el código está muy estructurado, con convenciones de nomenclatura coherentes. Los documentos de empresa son harina de otro costal.</p>
<h3 id="Enterprise-Documents-Are-Messy" class="common-anchor-header">Los documentos de empresa son desordenados</h3><p><strong>Sinónimos y frases variadas.</strong> "Optimizar el uso de la memoria" y "reducir la huella de memoria" significan lo mismo pero utilizan palabras diferentes. La búsqueda por palabras clave coincide con una y no con la otra. En entornos multilingües -chino con segmentación de palabras, japonés con escritura mixta, alemán con palabras compuestas- el problema se multiplica.</p>
<p><strong>La estructura visual es importante.</strong> Los planos de ingeniería dependen de la maquetación. Los informes financieros se basan en tablas. Las imágenes médicas dependen de las relaciones espaciales. El OCR extrae el texto pero pierde la estructura. La recuperación de sólo texto no puede gestionar estos documentos de forma fiable.</p>
<h3 id="How-to-Implement-Hybrid-Retrieval" class="common-anchor-header">Cómo implementar la recuperación híbrida</h3><p>La recuperación híbrida combina varios métodos de búsqueda -por lo general, <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">BM25 para la concordancia de palabras clave y vectores densos para la búsqueda semántica- para</a>cubrir lo que ninguno de los dos métodos gestiona por sí solo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_smarter_rag_routing_hybrid_retrieval_2_7f305f024e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>El método tradicional utiliza dos sistemas distintos: uno para BM25 y otro para la búsqueda vectorial. Cada consulta se realiza en ambos y los resultados se fusionan después. Funciona, pero conlleva una sobrecarga real:</p>
<table>
<thead>
<tr><th></th><th>Tradicional (sistemas separados)</th><th>Unificado (colección única)</th></tr>
</thead>
<tbody>
<tr><td>Almacenamiento</td><td>Dos índices separados</td><td>Una colección, ambos tipos de vectores</td></tr>
<tr><td>Sincronización de datos</td><td>Los dos sistemas deben estar sincronizados</td><td>Una única ruta de escritura</td></tr>
<tr><td>Ruta de consulta</td><td>Dos consultas + fusión de resultados</td><td>Una llamada a la API, fusión automática</td></tr>
<tr><td>Ajuste</td><td>Ajuste de los pesos de fusión en todos los sistemas</td><td>Cambio del peso denso/esparcido en una consulta</td></tr>
<tr><td>Complejidad operativa</td><td>Alta</td><td>Baja</td></tr>
</tbody>
</table>
<p><a href="https://milvus.io/">Milvus</a> 2.6 admite vectores densos (para la búsqueda semántica) y vectores dispersos (para la búsqueda de palabras clave al estilo BM25) en la misma colección. Una única llamada a la API devuelve resultados fusionados, con un comportamiento de recuperación ajustable cambiando el peso entre los tipos de vectores. Sin índices separados, sin problemas de sincronización, sin latencia de fusión.</p>
<h2 id="How-to-Evaluate-a-RAG-Pipeline-Stage-by-Stage" class="common-anchor-header">Cómo evaluar una canalización RAG etapa por etapa<button data-href="#How-to-Evaluate-a-RAG-Pipeline-Stage-by-Stage" class="anchor-icon" translate="no">
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
    </button></h2><p>Comprobar sólo la respuesta final no es suficiente. RAG es un proceso de múltiples etapas, y un fallo en cualquier etapa se propaga aguas abajo. Si sólo se mide la calidad de la respuesta, no se puede saber si el problema está en el enrutamiento, la reescritura, la recuperación, la reordenación o la generación.</p>
<p>Cuando los usuarios informan de "resultados imprecisos", la causa puede estar en cualquier parte: el enrutamiento puede saltarse la recuperación cuando no debería; la reescritura de consultas puede omitir entidades clave; la recuperación puede pasar por alto documentos relevantes; la reordenación puede enterrar buenos resultados; o el modelo puede ignorar por completo el contexto recuperado.</p>
<p>Evalúe cada etapa con sus propias métricas:</p>
<table>
<thead>
<tr><th>Etapa</th><th>Métrica</th><th>Qué captura</th></tr>
</thead>
<tbody>
<tr><td>Enrutamiento</td><td>Puntuación F1</td><td>Alto índice de falsos negativos = se omiten las consultas que necesitan recuperación</td></tr>
<tr><td>Reescritura de consultas</td><td>Precisión de la extracción de entidades, cobertura de sinónimos</td><td>La consulta reescrita omite términos importantes o cambia la intención</td></tr>
<tr><td>Recuperación</td><td>Recall@K, NDCG@10</td><td>Los documentos relevantes no se recuperan o se clasifican demasiado bajo.</td></tr>
<tr><td>Nueva clasificación</td><td>Precisión@3</td><td>Los resultados más importantes no son realmente relevantes</td></tr>
<tr><td>Generación</td><td>Fidelidad, respuestas completas</td><td>El modelo ignora el contexto recuperado o da respuestas parciales</td></tr>
</tbody>
</table>
<p><strong>Establezca una supervisión por capas.</strong> Utilice conjuntos de pruebas fuera de línea para definir rangos de métricas de referencia para cada etapa. En producción, active alertas cuando cualquier etapa caiga por debajo de su línea de base. Esto le permite detectar las regresiones con antelación y rastrearlas hasta una etapa específica, en lugar de hacer conjeturas.</p>
<h2 id="What-to-Build-First" class="common-anchor-header">Qué construir primero<button data-href="#What-to-Build-First" class="anchor-icon" translate="no">
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
    </button></h2><p>Tres prioridades sobresalen de los despliegues RAG del mundo real:</p>
<ol>
<li><p><strong>Añadir el enrutamiento pronto.</strong> Muchas consultas no necesitan recuperación en absoluto. Filtrarlas por adelantado reduce la carga y mejora el tiempo de respuesta con un mínimo esfuerzo de ingeniería.</p></li>
<li><p><strong>Utilice una recuperación híbrida unificada.</strong> Mantener sistemas de búsqueda vectorial y BM25 separados duplica los costes de almacenamiento, crea complejidad de sincronización y añade latencia de fusión. Un sistema unificado como Milvus 2.6, en el que los vectores densos y dispersos viven en la misma colección, elimina estos problemas.</p></li>
<li><p><strong>Evalúe cada etapa de forma independiente.</strong> La calidad de la respuesta de extremo a extremo por sí sola no es una señal útil. Las métricas por etapa (F1 para el enrutamiento, Recall@K y NDCG para la recuperación) permiten depurar más rápidamente y evitar romper una etapa mientras se ajusta otra.</p></li>
</ol>
<p>El valor real de un sistema RAG moderno no es sólo la recuperación, sino saber <em>cuándo</em> y <em>cómo</em> recuperar. Comience con el enrutamiento y la búsqueda híbrida unificada, y tendrá una base escalable.</p>
<hr>
<p>Si está construyendo o actualizando un sistema RAG y se encuentra con problemas de calidad de recuperación, nos encantaría ayudarle:</p>
<ul>
<li>Únase a la <a href="https://slack.milvus.io/">comunidad Milvus Slack</a> para hacer preguntas, compartir su arquitectura y aprender de otros desarrolladores que trabajan en problemas similares.</li>
<li><a href="https://milvus.io/office-hours">Reserve una sesión gratuita de 20 minutos de Milvus Office Hours</a> para analizar su caso de uso, ya sea un diseño de enrutamiento, una configuración de recuperación híbrida o una evaluación de varias etapas.</li>
<li>Si prefiere saltarse la configuración de la infraestructura, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus gestionado) ofrece un nivel gratuito para empezar.</li>
</ul>
<hr>
<p>Algunas preguntas que surgen a menudo cuando los equipos comienzan a construir sistemas RAG más inteligentes:</p>
<p><strong>P: ¿Sigue siendo necesaria la RAG ahora que los modelos admiten ventanas de contexto de 128K+?</strong></p>
<p>Sí. Las ventanas de contexto largas son útiles cuando se necesita procesar un solo documento de gran tamaño, pero no sustituyen a la recuperación para consultas de bases de conocimiento. Enviar todo el corpus con cada consulta aumenta los costes de forma lineal, y los modelos pierden el foco en la información relevante en contextos largos, un problema bien documentado conocido como el efecto "perdido en el medio" (Liu et al., 2023). RAG recupera sólo lo que es relevante, manteniendo los costes y la latencia predecibles.</p>
<p><strong>P: ¿Cómo puedo combinar BM25 y la búsqueda vectorial sin utilizar dos sistemas distintos?</strong></p>
<p>Utilice una base de datos vectorial que admita vectores densos y dispersos en la misma colección. Milvus 2.6 almacena ambos tipos de vectores por documento y devuelve resultados fusionados a partir de una única consulta. Puede ajustar el equilibrio entre la concordancia de palabras clave y la concordancia semántica cambiando un parámetro de peso: sin índices separados, sin fusión de resultados, sin quebraderos de cabeza de sincronización.</p>
<p><strong>P: ¿Qué es lo primero que debería añadir para mejorar mi canalización RAG existente?</strong></p>
<p>Enrutamiento de consultas. Es la mejora de mayor impacto y menor esfuerzo. La mayoría de los sistemas de producción reciben una parte significativa de consultas que no necesitan recuperación en absoluto: preguntas de sentido común, cálculos sencillos, conocimientos generales. Enrutarlas directamente al LLM reduce las llamadas de recuperación innecesarias y mejora el tiempo de respuesta de forma inmediata.</p>
<p><strong>P: ¿Cómo puedo saber qué etapa de mi proceso GAR está causando malos resultados?</strong></p>
<p>Evalúe cada etapa por separado. Utilice la puntuación F1 para la precisión del enrutamiento, Recall@K y NDCG@10 para la calidad de la recuperación, Precision@3 para la reordenación y métricas de fidelidad para la generación. Establezca líneas de base a partir de datos de prueba fuera de línea y supervise cada etapa en producción. Cuando baje la calidad de la respuesta, podrá localizar la fase específica que ha retrocedido en lugar de hacer conjeturas.</p>
