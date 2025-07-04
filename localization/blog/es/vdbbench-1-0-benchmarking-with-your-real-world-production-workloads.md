---
id: vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md
title: >-
  Anuncio de VDBBench 1.0: Evaluación comparativa de bases de datos vectoriales
  de código abierto con cargas de trabajo reales
author: Tian Min
date: 2025-07-04T00:00:00.000Z
desc: >-
  Descubra VDBBench 1.0, una herramienta de código abierto para la evaluación
  comparativa de bases de datos vectoriales con datos del mundo real, ingestión
  de streaming y cargas de trabajo concurrentes.
cover: assets.zilliz.com/milvus_vdb_e0e8146c90.jpeg
tag: Announcements
recommend: false
publishToMedium: true
tags: 'vector database, Milvus, vectordb benchmarking, vector search'
meta_keywords: 'VDBBench, vector database, Milvus, Zilliz Cloud, benchmarking'
meta_title: |
  VDBBench 1.0: Real-World Benchmarking for Vector Databases
origin: >-
  https://zilliz.com/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads
---
<p>La mayoría de las pruebas de referencia de bases de datos vectoriales se realizan con datos estáticos e índices preconstruidos. Pero los sistemas de producción no funcionan así: los datos fluyen continuamente mientras los usuarios ejecutan consultas, los filtros fragmentan los índices y las características de rendimiento cambian drásticamente bajo cargas concurrentes de lectura/escritura.</p>
<p>Hoy lanzamos <a href="https://github.com/zilliztech/VectorDBBench/releases/tag/v1.0.0"><strong>VDBBench 1.0</strong></a>, un benchmark de código abierto diseñado desde cero para probar bases de datos vectoriales en condiciones de producción realistas: ingestión de datos en flujo, filtrado de metadatos con selectividad variable y cargas de trabajo concurrentes que revelan los cuellos de botella reales del sistema.</p>
<p><a href="https://github.com/zilliztech/VectorDBBench/releases/tag/v1.0.0"><strong>Descargar VDBBench 1.0</strong></a> →<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> <strong>→ Ver clasificación →</strong></a></p>
<h2 id="Why-Current-Benchmarks-Are-Misleading" class="common-anchor-header">Por qué los puntos de referencia actuales son engañosos<button data-href="#Why-Current-Benchmarks-Are-Misleading" class="anchor-icon" translate="no">
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
    </button></h2><p>Seamos honestos: hay un fenómeno extraño en nuestra industria. Todo el mundo habla de "no jugar a los benchmarks", y sin embargo muchos participan exactamente en ese comportamiento. Desde que estalló el mercado de las bases de datos vectoriales en 2023, hemos visto numerosos ejemplos de sistemas que "funcionan de maravilla" pero "fracasan estrepitosamente" en producción, lo que hace perder tiempo a los ingenieros y daña la credibilidad del proyecto.</p>
<p>Hemos sido testigos directos de esta desconexión. Por ejemplo, Elasticsearch presume de velocidades de consulta de milisegundos, pero entre bastidores puede tardar más de 20 horas sólo en optimizar su índice. ¿Qué sistema de producción puede tolerar semejante tiempo de inactividad?</p>
<p>El problema se deriva de tres defectos fundamentales:</p>
<ul>
<li><p><strong>Conjuntos de datos obsoletos:</strong> Muchas pruebas de rendimiento siguen basándose en conjuntos de datos antiguos como SIFT (128 dimensiones), mientras que las incrustaciones modernas tienen entre 768 y 3.072 dimensiones. Las características de rendimiento de los sistemas que funcionan con vectores de 128D frente a los de 1024D+ son fundamentalmente diferentes: los patrones de acceso a la memoria, la eficiencia de los índices y la complejidad computacional cambian drásticamente.</p></li>
<li><p><strong>Métricas de vanidad:</strong> Los puntos de referencia se centran en la latencia media o el QPS máximo, lo que crea una imagen distorsionada. Un sistema con una latencia media de 10 ms pero una latencia P99 de 2 segundos crea una experiencia de usuario terrible. El rendimiento máximo medido en 30 segundos no dice nada sobre el rendimiento sostenido.</p></li>
<li><p><strong>Escenarios excesivamente simplificados:</strong> La mayoría de las pruebas comparativas analizan flujos de trabajo básicos de "escritura de datos, creación de índices, consultas", básicamente pruebas de nivel "Hola mundo". La producción real implica la ingestión continua de datos mientras se sirven consultas, el filtrado complejo de metadatos que fragmenta los índices y las operaciones concurrentes de lectura/escritura que compiten por los recursos.</p></li>
</ul>
<h2 id="What’s-New-in-VDBBench-10" class="common-anchor-header">¿Qué hay de nuevo en VDBBench 1.0?<button data-href="#What’s-New-in-VDBBench-10" class="anchor-icon" translate="no">
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
    </button></h2><p>VDBBench no se limita a iterar sobre filosofías de benchmarking obsoletas, sino que reconstruye el concepto a partir de los primeros principios con una creencia rectora: un benchmark sólo es valioso si predice el comportamiento real de la producción.</p>
<p>Hemos diseñado VDBBench para reproducir fielmente las condiciones del mundo real en tres dimensiones críticas: <strong>autenticidad de los datos, patrones de carga de trabajo y metodologías de medición del rendimiento.</strong></p>
<p>Echemos un vistazo más de cerca a qué nuevas características se ponen sobre la mesa.</p>
<h3 id="🚀-Redesigned-Dashboard-with-Production-Relevant-Visualizations" class="common-anchor-header"><strong>🚀 Panel de control rediseñado con visualizaciones relevantes para la producción</strong></h3><p>La mayoría de los puntos de referencia se centran únicamente en la salida de datos en bruto, pero lo que importa es cómo los ingenieros interpretan y actúan sobre esos resultados. Hemos rediseñado la interfaz de usuario para dar prioridad a la claridad y la interactividad, lo que le permite detectar las diferencias de rendimiento entre los sistemas y tomar decisiones rápidas sobre la infraestructura.</p>
<p>El nuevo panel no sólo visualiza las cifras de rendimiento, sino también las relaciones entre ellas: cómo se degrada el QPS con distintos niveles de selectividad de filtros, cómo fluctúa la recuperación durante la ingestión de secuencias y cómo las distribuciones de latencia revelan las características de estabilidad del sistema.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_1_df593dea0b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Hemos vuelto a probar las principales plataformas de bases de datos vectoriales, como <strong>Milvus, Zilliz Cloud, Elastic Cloud, Qdrant Cloud, Pinecone y OpenSearch</strong>, con sus últimas configuraciones y ajustes recomendados, para garantizar que todos los datos de referencia reflejen las capacidades actuales. Todos los resultados de las pruebas están disponibles en<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> VDBBench Leaderboard</a>.</p>
<h3 id="🏷️-Tag-Filtering-The-Hidden-Performance-Killer" class="common-anchor-header">🏷️ Filtrado de etiquetas: El asesino oculto del rendimiento</h3><p>Las consultas en el mundo real rara vez se producen de forma aislada. Las aplicaciones combinan la similitud vectorial con el filtrado de metadatos ("encontrar zapatos que se parezcan a esta foto pero que cuesten menos de 100 dólares"). Esta búsqueda vectorial filtrada crea desafíos únicos que la mayoría de las pruebas de referencia ignoran por completo.</p>
<p>Las búsquedas filtradas introducen complejidad en dos áreas críticas:</p>
<ul>
<li><p><strong>Complejidad del filtro</strong>: Un mayor número de campos escalares y condiciones lógicas complejas aumentan la demanda computacional y pueden provocar una recuperación insuficiente y la fragmentación del índice gráfico.</p></li>
<li><p><strong>Selectividad del filtro</strong>: Este es el "asesino oculto del rendimiento" que hemos comprobado repetidamente en producción. Cuando las condiciones de filtrado se vuelven muy selectivas (filtrando más del 99% de los datos), la velocidad de las consultas puede fluctuar en varios órdenes de magnitud, y la recuperación puede volverse inestable a medida que las estructuras de índices se enfrentan a conjuntos de resultados dispersos.</p></li>
</ul>
<p>VDBBench prueba sistemáticamente varios niveles de selectividad de filtrado (del 50% al 99,9%), proporcionando un perfil de rendimiento completo bajo este patrón de producción crítico. Los resultados revelan a menudo drásticos desniveles de rendimiento que nunca aparecerían en las pruebas de rendimiento tradicionales.</p>
<p><strong>Por ejemplo</strong>: En las pruebas de Cohere 1M, Milvus mantuvo un alto nivel de recuperación en todos los niveles de selectividad de filtrado, mientras que OpenSearch mostró un rendimiento inestable con una recuperación que fluctuaba significativamente bajo diferentes condiciones de filtrado, cayendo por debajo de 0,8 de recuperación en muchos casos, lo que es inaceptable para la mayoría de los entornos de producción.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_2_0ef89463e5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: QPS y recuperación de Milvus y OpenSearch en diferentes niveles de selectividad de filtro (prueba Cohere 1M).</em></p>
<h3 id="🌊-Streaming-ReadWrite-Beyond-Static-Index-Testing" class="common-anchor-header">🌊 Lectura/escritura en flujo: Más allá de las pruebas de índices estáticos</h3><p>Los sistemas de producción rara vez disfrutan del lujo de datos estáticos. La nueva información fluye continuamente mientras se ejecutan las búsquedas, un escenario en el que muchas bases de datos, por lo demás impresionantes, colapsan bajo la doble presión de mantener el rendimiento de la búsqueda mientras se gestionan las escrituras continuas.</p>
<p>Los escenarios de streaming de VDBBench simulan operaciones paralelas reales, lo que ayuda a los desarrolladores a comprender la estabilidad del sistema en entornos de alta concurrencia, en particular cómo afecta la escritura de datos al rendimiento de las consultas y cómo evoluciona el rendimiento a medida que aumenta el volumen de datos.</p>
<p>Para garantizar comparaciones justas entre diferentes sistemas, VDBBench utiliza un enfoque estructurado:</p>
<ul>
<li><p>Configurar tasas de escritura controladas que reflejen las cargas de trabajo de producción objetivo (por ejemplo, 500 filas/seg distribuidas en 5 procesos paralelos).</p></li>
<li><p>Desencadenar las operaciones de búsqueda después de cada 10% de ingestión de datos, alternando entre los modos serie y concurrente.</p></li>
<li><p>Registro de métricas exhaustivas: distribuciones de latencia (incluido P99), QPS sostenidos y precisión de recuperación.</p></li>
<li><p>Seguimiento de la evolución del rendimiento a lo largo del tiempo, a medida que aumentan el volumen de datos y la carga del sistema.</p></li>
</ul>
<p>Esta prueba de carga incremental y controlada revela hasta qué punto los sistemas mantienen la estabilidad y la precisión durante la ingesta continua, algo que los puntos de referencia tradicionales rara vez captan.</p>
<p><strong>Ejemplo</strong>: En las pruebas de streaming Cohere 10M, Pinecone mantuvo un QPS y una recuperación superiores durante todo el ciclo de escritura en comparación con Elasticsearch. En particular, el rendimiento de Pinecone mejoró significativamente tras la finalización de la ingesta, lo que demuestra una gran estabilidad bajo carga sostenida, mientras que Elasticsearch mostró un comportamiento más errático durante las fases de ingesta activa.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb3_9d2a5298b0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura: QPS y Recall de Pinecone frente a Elasticsearch en la prueba de streaming Cohere 10M (tasa de ingestión de 500 filas/s).</p>
<p>VDBBench va incluso más allá al admitir un paso de optimización opcional, lo que permite a los usuarios comparar el rendimiento de la búsqueda de flujo antes y después de la optimización del índice. También realiza un seguimiento e informa del tiempo real empleado en cada etapa, ofreciendo una visión más profunda de la eficiencia y el comportamiento del sistema en condiciones similares a las de producción.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb4_0caee3b201.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: QPS y recuperación de Pinecone frente a Elasticsearch en la prueba de flujo Cohere 10M después de la optimización (tasa de ingestión de 500 filas/s)</em></p>
<p>Como se muestra en nuestras pruebas, Elasticsearch superó a Pinecone en QPS después de la optimización del índice. Pero cuando el eje x refleja el tiempo transcurrido real, está claro que Elasticsearch tardó mucho más tiempo en alcanzar ese rendimiento. En producción, ese retraso es importante. Esta comparación revela un equilibrio clave: rendimiento máximo frente a tiempo de servicio.</p>
<h3 id="🔬-Modern-Datasets-That-Reflect-Current-AI-Workloads" class="common-anchor-header">Conjuntos de datos modernos que reflejan las cargas de trabajo de IA actuales</h3><p>Hemos revisado por completo los conjuntos de datos utilizados para la evaluación comparativa de las bases de datos vectoriales. En lugar de conjuntos de pruebas heredados como SIFT y GloVe, VDBBench utiliza vectores generados a partir de modelos de incrustación de última generación como OpenAI y Cohere que potencian las aplicaciones de IA actuales.</p>
<p>Para garantizar la relevancia, especialmente en casos de uso como la Generación de Recuperación Aumentada (RAG), hemos seleccionado corpus que reflejan escenarios empresariales y de dominios específicos del mundo real:</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Corpus</strong></td><td><strong>Modelo de incrustación</strong></td><td><strong>Dimensiones</strong></td><td><strong>Tamaño</strong></td><td><strong>Caso de uso</strong></td></tr>
<tr><td>Wikipedia</td><td>Cohere V2</td><td>768</td><td>1M / 10M</td><td>Base general de conocimientos</td></tr>
<tr><td>BioASQ</td><td>Cohere V3</td><td>1024</td><td>1M / 10M</td><td>Dominio específico (biomédico)</td></tr>
<tr><td>C4</td><td>OpenAI</td><td>1536</td><td>500K / 5M</td><td>Procesamiento de texto a escala web</td></tr>
<tr><td>MSMarco V2</td><td>udever-bloom-1b1</td><td>1536</td><td>1M / 10M / 138M</td><td>Búsqueda a gran escala</td></tr>
</tbody>
</table>
<p>Estos conjuntos de datos simulan mejor los datos vectoriales actuales de gran volumen y alta dimensión, lo que permite realizar pruebas realistas de la eficacia del almacenamiento, el rendimiento de las consultas y la precisión de la recuperación en condiciones que coinciden con las cargas de trabajo de la IA moderna.</p>
<h3 id="⚙️-Custom-Dataset-Support-for-Industry-Specific-Testing" class="common-anchor-header">⚙️ Soporte de conjuntos de datos personalizados para pruebas específicas del sector</h3><p>Cada negocio es único. El sector financiero puede necesitar pruebas centradas en la incrustación de transacciones, mientras que las plataformas sociales se preocupan más por los vectores de comportamiento de los usuarios. VDBBench le permite realizar pruebas comparativas con sus propios datos generados a partir de sus modelos de incrustación específicos para sus cargas de trabajo concretas.</p>
<p>Puede personalizar</p>
<ul>
<li><p>Dimensiones vectoriales y tipos de datos</p></li>
<li><p>Esquema de metadatos y patrones de filtrado</p></li>
<li><p>Volumen de datos y patrones de ingestión</p></li>
<li><p>Distribuciones de consultas que coincidan con su tráfico de producción</p></li>
</ul>
<p>Después de todo, ningún conjunto de datos cuenta una historia mejor que sus propios datos de producción.</p>
<h2 id="How-VDBBench-Measures-What-Actually-Matters-in-Production" class="common-anchor-header">Cómo mide VDBBench lo que realmente importa en la producción<button data-href="#How-VDBBench-Measures-What-Actually-Matters-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Production-Focused-Metric-Design" class="common-anchor-header">Diseño de métricas centrado en la producción</h3><p>VDBBench da prioridad a las métricas que reflejan el rendimiento en el mundo real, no sólo los resultados de laboratorio. Hemos rediseñado la evaluación comparativa en torno a lo que realmente importa en entornos de producción: <strong>fiabilidad bajo carga, características de latencia de cola, rendimiento sostenido y conservación de la precisión.</strong></p>
<ul>
<li><p><strong>Latencia P95/P99 para una experiencia de usuario real</strong>: La latencia media oculta los valores atípicos que frustran a los usuarios reales y pueden indicar inestabilidad subyacente del sistema. VDBBench se centra en la latencia de cola como P95/P99, revelando qué rendimiento alcanzarán realmente el 95% o el 99% de sus consultas. Esto es crucial para la planificación de los acuerdos de nivel de servicio (SLA) y para comprender la experiencia del usuario en el peor de los casos.</p></li>
<li><p><strong>Rendimiento sostenible bajo carga</strong>: Un sistema que funciona bien durante 5 segundos no es suficiente en producción. VDBBench aumenta gradualmente la concurrencia para encontrar las consultas por segundo máximas sostenibles de su base de datos (<code translate="no">max_qps</code>), no el número máximo en condiciones ideales y breves. Esta metodología revela la capacidad del sistema a lo largo del tiempo y ayuda a planificar la capacidad de forma realista.</p></li>
<li><p><strong>Recuperación equilibrada con rendimiento</strong>: La velocidad sin precisión no tiene sentido. Cada número de rendimiento en VDBBench está emparejado con mediciones de recuperación, para que sepa exactamente cuánta relevancia está cambiando por rendimiento. Esto permite realizar comparaciones justas entre sistemas con compensaciones internas muy diferentes.</p></li>
</ul>
<h3 id="Test-Methodology-That-Reflects-Reality" class="common-anchor-header">Metodología de pruebas que refleja la realidad</h3><p>Una innovación clave en el diseño de VDBBench es la separación de las pruebas en serie y concurrentes, que ayuda a captar cómo se comportan los sistemas bajo diferentes tipos de carga y revela las características de rendimiento que importan para diferentes casos de uso.</p>
<p><strong>Separación de la medición de latencia:</strong></p>
<ul>
<li><p><code translate="no">serial_latency_p99</code> Mide el rendimiento del sistema bajo una carga mínima, en la que sólo se procesa una petición a la vez. Esto representa el mejor escenario posible para la latencia y ayuda a identificar las capacidades básicas del sistema.</p></li>
<li><p><code translate="no">conc_latency_p99</code> Captura el comportamiento del sistema en condiciones realistas de alta concurrencia, en las que varias solicitudes llegan simultáneamente y compiten por los recursos del sistema.</p></li>
</ul>
<p><strong>Estructura de la prueba comparativa en dos fases</strong>:</p>
<ol>
<li><p><strong>Prueba en serie</strong>: Ejecución en un único proceso de 1.000 consultas que establece el rendimiento y la precisión de referencia, informando tanto de <code translate="no">serial_latency_p99</code> como de la recuperación. Esta fase ayuda a identificar el límite teórico de rendimiento.</p></li>
<li><p>Prueba<strong>de concurrencia</strong>: Simula el entorno de producción bajo carga sostenida con varias innovaciones clave:</p>
<ul>
<li><p><strong>Simulación realista del cliente</strong>: Cada proceso de prueba funciona de forma independiente con su propia conexión y conjunto de consultas, evitando interferencias de estado compartido que podrían distorsionar los resultados.</p></li>
<li><p><strong>Inicio sincronizado</strong>: Todos los procesos se inician simultáneamente, lo que garantiza que el QPS medido refleje con precisión los niveles de concurrencia reclamados.</p></li>
<li><p><strong>Conjuntos de consultas independientes</strong>: Evita índices de aciertos de caché poco realistas que no reflejan la diversidad de consultas en producción.</p></li>
</ul></li>
</ol>
<p>Estos métodos cuidadosamente estructurados garantizan que los valores de <code translate="no">max_qps</code> y <code translate="no">conc_latency_p99</code> notificados por VDBBench sean precisos y relevantes para la producción, proporcionando información significativa para la planificación de la capacidad de producción y el diseño del sistema.</p>
<h2 id="Getting-Started-with-VDBBench-10" class="common-anchor-header">Introducción a VDBBench 1.0<button data-href="#Getting-Started-with-VDBBench-10" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>VDBBench 1.0</strong> representa un cambio fundamental hacia la evaluación comparativa relevante para la producción. Al cubrir la escritura continua de datos, el filtrado de metadatos con selectividad variable y las cargas de streaming bajo patrones de acceso concurrentes, proporciona la mayor aproximación a los entornos de producción reales disponibles en la actualidad.</p>
<p>La diferencia entre los resultados de las pruebas comparativas y el rendimiento en el mundo real no debería ser un juego de adivinanzas. Si está planeando desplegar una base de datos vectorial en producción, merece la pena conocer su rendimiento más allá de las pruebas de laboratorio idealizadas. VDBBench es una herramienta de código abierto, transparente y diseñada para realizar comparaciones significativas.</p>
<p>No se deje llevar por cifras impresionantes que no se traducen en valor de producción. <strong>Utilice VDBBench 1.0 para probar escenarios importantes para su negocio, con sus datos y en condiciones que reflejen su carga de trabajo real.</strong> La era de los puntos de referencia engañosos en la evaluación de bases de datos vectoriales ha llegado a su fin: es hora de tomar decisiones basadas en datos relevantes para la producción.</p>
<p><strong>Pruebe VDBBench con sus propias cargas de trabajo:</strong><a href="https://github.com/zilliztech/VectorDBBench"> https://github.com/zilliztech/VectorDBBench</a></p>
<p><strong>Vea los resultados de las pruebas de las principales bases de datos vectoriales:</strong><a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch"> Tabla de clasificación de VDBBench</a></p>
<p>¿Tienes preguntas o quieres compartir tus resultados? Únase a la conversación en<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a> o conecte con nuestra comunidad en<a href="https://discord.com/invite/FG6hMJStWu"> Discord</a>.</p>
