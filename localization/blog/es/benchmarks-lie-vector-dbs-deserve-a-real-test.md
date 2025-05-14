---
id: benchmarks-lie-vector-dbs-deserve-a-real-test.md
title: Las bases de datos vectoriales merecen una prueba real
author: Min Tian
date: 2025-05-14T00:00:00.000Z
desc: >-
  Descubra la brecha de rendimiento en las bases de datos vectoriales con
  VDBBench. Nuestra herramienta realiza pruebas en escenarios de producción
  reales, lo que garantiza que sus aplicaciones de IA funcionen sin problemas y
  sin tiempos de inactividad inesperados.
cover: >-
  assets.zilliz.com/Benchmarks_Lie_Vector_D_Bs_Deserve_a_Real_Test_9280c66efc.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: >-
  Vector database, vectordbbench, vector database benchmark, vector search
  performance
meta_title: |
  Benchmarks Lie — Vector DBs Deserve a Real Test
origin: 'https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md'
---
<h2 id="The-Vector-Database-You-Chose-Based-on-Benchmarks-Might-Fail-in-Production" class="common-anchor-header">La base de datos vectorial que eligió basándose en puntos de referencia podría fallar en la producción<button data-href="#The-Vector-Database-You-Chose-Based-on-Benchmarks-Might-Fail-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>A la hora de seleccionar una <a href="https://milvus.io/blog/what-is-a-vector-database.md">base de datos</a> vectorial para su aplicación de IA, los puntos de referencia convencionales son como probar un coche deportivo en una pista vacía, sólo para descubrir que se cala en hora punta. ¿La incómoda verdad? La mayoría de las pruebas comparativas sólo evalúan el rendimiento en condiciones artificiales que nunca se dan en entornos de producción.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Benchmarks_Lie_Vector_D_Bs_Deserve_a_Real_Test_9280c66efc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La mayoría de las pruebas de rendimiento evalúan las bases de datos vectoriales <strong>una vez que</strong> se han ingestado todos los datos y se ha creado el índice completo. Pero en producción, los datos nunca dejan de fluir. No es posible detener el sistema durante horas para reconstruir un índice.</p>
<p>Hemos visto la desconexión de primera mano. Por ejemplo, Elasticsearch puede presumir de velocidades de consulta de milisegundos, pero entre bastidores, hemos visto que tarda <strong>más de 20 horas</strong> sólo en optimizar su índice. Eso es tiempo de inactividad que ningún sistema de producción puede permitirse, especialmente en cargas de trabajo de IA que exigen actualizaciones continuas y respuestas instantáneas.</p>
<p>Con Milvus, después de realizar innumerables evaluaciones de prueba de concepto (PoC) con clientes empresariales, hemos descubierto un patrón preocupante: <strong>las bases de datos vectoriales que sobresalen en entornos de laboratorio controlados suelen tener dificultades con cargas de producción reales.</strong> Esta brecha crítica no sólo frustra a los ingenieros de infraestructuras, sino que puede hacer descarrilar iniciativas enteras de IA basadas en estas promesas de rendimiento engañosas.</p>
<p>Por eso hemos creado <a href="https://github.com/zilliztech/VectorDBBench">VDBBench</a>: un benchmark de código abierto diseñado desde cero para simular la realidad de la producción. A diferencia de las pruebas sintéticas que seleccionan escenarios, VDBBench somete a las bases de datos a una ingestión continua, condiciones de filtrado rigurosas y diversos escenarios, al igual que sus cargas de trabajo de producción reales. Nuestra misión es sencilla: proporcionar a los ingenieros una herramienta que muestre el rendimiento real de las bases de datos vectoriales en condiciones reales para que puedan tomar decisiones de infraestructura basadas en cifras fiables.</p>
<h2 id="The-Gap-between-Benchmarks-and-Reality" class="common-anchor-header">La brecha entre las pruebas comparativas y la realidad<button data-href="#The-Gap-between-Benchmarks-and-Reality" class="anchor-icon" translate="no">
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
    </button></h2><p>Los métodos tradicionales de evaluación comparativa adolecen de tres defectos críticos que hacen que sus resultados carezcan prácticamente de sentido para la toma de decisiones en producción:</p>
<h3 id="1-Outdated-Data" class="common-anchor-header">1. 1. Datos obsoletos</h3><p>Muchas pruebas comparativas siguen basándose en conjuntos de datos obsoletos como SIFT o<a href="https://zilliz.com/glossary/glove"> GloVe</a>, que se parecen muy poco a las complejas incrustaciones vectoriales de alta dimensión generadas por los modelos de IA. Piense en esto: SIFT contiene vectores de 128 dimensiones, mientras que las incrustaciones populares de los modelos de incrustación de OpenAI oscilan entre 768 y 3072 dimensiones.</p>
<h3 id="2-Vanity-Metrics" class="common-anchor-header">2. Métricas de vanidad</h3><p>Muchas pruebas comparativas se centran únicamente en la latencia media o el QPS máximo, lo que crea una imagen distorsionada. Estas métricas idealizadas no captan los valores atípicos y las incoherencias que experimentan los usuarios reales en los entornos de producción. Por ejemplo, ¿de qué sirve una impresionante cifra de QPS si requiere recursos computacionales ilimitados que llevarían a su organización a la bancarrota?</p>
<h3 id="3-Oversimplified-Scenarios" class="common-anchor-header">3. Escenarios excesivamente simplificados</h3><p>La mayoría de los puntos de referencia sólo prueban cargas de trabajo básicas y estáticas, básicamente el "Hola Mundo" de la búsqueda vectorial. Por ejemplo, emiten peticiones de búsqueda sólo después de que todo el conjunto de datos haya sido ingestado e indexado, ignorando la realidad dinámica en la que los usuarios buscan mientras llegan nuevos datos. Este diseño simplista pasa por alto los complejos patrones que definen los sistemas de producción reales, como las consultas concurrentes, las búsquedas filtradas y la ingesta continua de datos.</p>
<p>Al reconocer estos defectos, nos dimos cuenta de que el sector necesitaba un <strong>cambio radical en la filosofía de la evaluación comparativa,</strong>basada en el comportamiento real de los sistemas de IA. Por eso creamos <a href="https://github.com/zilliztech/VectorDBBench">VDBBench</a>.</p>
<h2 id="From-Lab-to-Production-How-VDBBench-Bridges-the-Gap" class="common-anchor-header">Del laboratorio a la producción: Cómo VDBBench salva las distancias<button data-href="#From-Lab-to-Production-How-VDBBench-Bridges-the-Gap" class="anchor-icon" translate="no">
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
    </button></h2><p>VDBBench no se limita a iterar sobre filosofías de evaluación comparativa obsoletas, sino que reconstruye el concepto a partir de los primeros principios con una creencia rectora: <strong>una evaluación comparativa sólo es valiosa si predice el comportamiento real de la producción</strong>.</p>
<p>Hemos diseñado VDBBench para replicar fielmente las condiciones del mundo real en tres dimensiones críticas: autenticidad de los datos, patrones de carga de trabajo y medición del rendimiento.</p>
<h3 id="Modernizing-the-Dataset" class="common-anchor-header">Modernización del conjunto de datos</h3><p>Hemos revisado por completo los conjuntos de datos utilizados para la evaluación comparativa de vectorDB. En lugar de conjuntos de pruebas heredados como SIFT y GloVe, VDBBench utiliza vectores generados a partir de modelos de incrustación de última generación que impulsan las aplicaciones de IA actuales.</p>
<p>Para garantizar la pertinencia, especialmente en casos de uso como la generación mejorada por recuperación (RAG), hemos seleccionado corpus que reflejan escenarios empresariales y de dominios específicos del mundo real. Estos corpus abarcan desde bases de conocimiento de uso general hasta aplicaciones verticales como la respuesta a preguntas biomédicas y la búsqueda web a gran escala.</p>
<table>
<thead>
<tr><th></th><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>Corpus</strong></td><td><strong>Modelo de incrustación</strong></td><td><strong>Dimensiones</strong></td><td><strong>Tamaño</strong></td></tr>
<tr><td>Wikipedia</td><td>Cohere V2</td><td>768</td><td>1M / 10M</td></tr>
<tr><td>BioASQ</td><td>Cohere V3</td><td>1024</td><td>1M / 10M</td></tr>
<tr><td>C4</td><td>OpenAI</td><td>1536</td><td>500K / 5M</td></tr>
<tr><td>MSMarco V2</td><td>udever-bloom-1b1</td><td>1536</td><td>1M / 10M / 138M</td></tr>
</tbody>
</table>
<p>Tabla: Conjuntos de datos utilizados en VDBBench</p>
<p>VDBBench también admite conjuntos de datos personalizados, lo que le permite realizar pruebas comparativas con sus propios datos generados a partir de sus modelos de incrustación específicos para sus cargas de trabajo concretas. Después de todo, ningún conjunto de datos cuenta una historia mejor que sus propios datos de producción.</p>
<h3 id="Production-Focused-Metric-Design" class="common-anchor-header">Diseño de métricas centrado en la producción</h3><p><strong>VDBBench da prioridad a las métricas que reflejan el rendimiento en el mundo real, no sólo los resultados de laboratorio.</strong> Hemos rediseñado la evaluación comparativa en torno a lo que realmente importa en entornos de producción: fiabilidad bajo carga, latencia de cola, rendimiento sostenido y precisión.</p>
<ul>
<li><p><strong>Latencia P95/P99 para medir la experiencia real del usuario</strong>: La latencia media oculta los valores atípicos que frustran a los usuarios reales. Por eso VDBBench se centra en la latencia de cola como P95/P99, revelando qué rendimiento alcanzarán realmente el 95% o el 99% de sus consultas.</p></li>
<li><p><strong>Rendimiento sostenible bajo carga:</strong> Un sistema que funciona bien durante 5 segundos no es suficiente en producción. VDBBench aumenta gradualmente la concurrencia para encontrar las consultas por segundo máximas sostenibles de su base de datos (<code translate="no">max_qps</code>)-no el número máximo en condiciones cortas e ideales. Esto muestra lo bien que aguanta el sistema a lo largo del tiempo.</p></li>
<li><p><strong>Recuperación equilibrada con rendimiento:</strong> La velocidad sin precisión no tiene sentido. Todas las cifras de rendimiento de VDBBench están emparejadas con la recuperación, para que sepa exactamente cuánta relevancia está cambiando por rendimiento. Esto permite realizar comparaciones justas entre sistemas con compensaciones internas muy diferentes.</p></li>
</ul>
<h3 id="Test-Methodology-That-Reflects-Reality" class="common-anchor-header">Metodología de pruebas que refleja la realidad</h3><p>Una innovación clave en el diseño de VDBBench es la <strong>separación de las pruebas en serie y concurrentes</strong>, que ayuda a captar cómo se comportan los sistemas bajo diferentes tipos de carga. Por ejemplo, las métricas de latencia se dividen de la siguiente manera:</p>
<ul>
<li><p><code translate="no">serial_latency_p99</code> mide el rendimiento del sistema bajo una carga mínima, en la que sólo se procesa una petición a la vez. Esto representa el <em>mejor escenario posible</em> para la latencia.</p></li>
<li><p><code translate="no">conc_latency_p99</code> capta el comportamiento del sistema en <em>condiciones realistas de alta concurrencia</em>, en las que llegan varias peticiones simultáneamente.</p></li>
</ul>
<h3 id="Two-Benchmark-Phases" class="common-anchor-header">Dos fases de pruebas</h3><p>VDBBench separa las pruebas en dos fases cruciales:</p>
<ol>
<li><strong>Prueba en serie</strong></li>
</ol>
<p>Se trata de una ejecución de 1.000 consultas en un único proceso. Esta fase establece una línea de base para el rendimiento y la precisión ideales, informando tanto de <code translate="no">serial_latency_p99</code> como de la recuperación.</p>
<ol start="2">
<li><strong>Prueba de concurrencia</strong></li>
</ol>
<p>Esta fase simula un entorno de producción bajo carga sostenida.</p>
<ul>
<li><p><strong>Simulación realista del cliente</strong>: Cada proceso de prueba funciona de forma independiente con su propia conexión y conjunto de consultas. De este modo se evitan las interferencias de estado compartido (por ejemplo, caché) que podrían distorsionar los resultados.</p></li>
<li><p><strong>Inicio sincronizado</strong>: Todos los procesos comienzan simultáneamente, lo que garantiza que el QPS medido refleje con precisión el nivel de concurrencia declarado.</p></li>
</ul>
<p>Estos métodos cuidadosamente estructurados garantizan que los valores de <code translate="no">max_qps</code> y <code translate="no">conc_latency_p99</code> notificados por VDBBench sean <strong>precisos y relevantes para la producción</strong>, proporcionando información significativa para la planificación de la capacidad de producción y el diseño del sistema.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Latency_of_Milvus_16c64g_standalone_at_Varying_Concurrency_Levels_Cohere_1_M_Test_7f2294e87a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: QPS y latencia de Milvus-16c64g-standalone con distintos niveles de concurrencia (prueba Cohere 1M). En esta prueba, Milvus está inicialmente infrautilizado hasta el</em> <strong><em>nivel de concurrencia 20</em></strong><em>, el aumento de la concurrencia mejora la utilización del sistema y da como resultado un mayor QPS. Más allá de la</em> <strong><em>concurrencia 20</em></strong><em>, el sistema alcanza la plena carga: los nuevos aumentos en la concurrencia ya no mejoran el rendimiento, y la latencia aumenta debido a los retrasos en las colas.</em></p>
<h2 id="Beyond-Searching-Static-Data-The-Real-Production-Scenarios" class="common-anchor-header">Más allá de la búsqueda de datos estáticos: Escenarios reales de producción<button data-href="#Beyond-Searching-Static-Data-The-Real-Production-Scenarios" class="anchor-icon" translate="no">
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
    </button></h2><p>Hasta donde sabemos, VDBBench es la única herramienta de evaluación comparativa que prueba las bases de datos vectoriales en todo el espectro de escenarios críticos de producción, incluidos los casos de recopilación estática, filtrado y streaming.</p>
<h3 id="Static-Collection" class="common-anchor-header">Recopilación estática</h3><p>A diferencia de otros benchmarks que se apresuran a realizar las pruebas, VDBBench primero se asegura de que cada base de datos haya optimizado completamente sus índices, un requisito previo crítico para la producción que muchos benchmarks suelen pasar por alto. Esto le ofrece una visión completa:</p>
<ul>
<li><p>Tiempo de ingestión de datos</p></li>
<li><p>Tiempo de indexación (el tiempo utilizado para construir un índice optimizado, que afecta drásticamente al rendimiento de la búsqueda)</p></li>
<li><p>Rendimiento de la búsqueda en índices totalmente optimizados, tanto en condiciones en serie como concurrentes.</p></li>
</ul>
<h3 id="Filtering" class="common-anchor-header">Filtrado</h3><p>La búsqueda vectorial en producción rara vez se produce de forma aislada. Las aplicaciones reales combinan la similitud vectorial con el filtrado de metadatos ("encontrar zapatos que se parezcan a esta foto pero que cuesten menos de 100 dólares"). Esta búsqueda vectorial filtrada plantea retos únicos:</p>
<ul>
<li><p><strong>Complejidad</strong> del<strong>filtro</strong>: Más columnas escalares y condiciones lógicas aumentan las demandas computacionales</p></li>
<li><p><strong>Selectividad del filtro</strong>: <a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Nuestra experiencia en producción</a> revela que éste es el asesino oculto del rendimiento: las velocidades de consulta pueden fluctuar en órdenes de magnitud dependiendo de lo selectivos que sean los filtros.</p></li>
</ul>
<p>VDBBench evalúa sistemáticamente el rendimiento de los filtros en distintos niveles de selectividad (del 50% al 99,9%), proporcionando un perfil completo de cómo las bases de datos gestionan este patrón de producción crítico.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Recall_of_Milvus_and_Open_Search_Across_Different_Filter_Selectivity_Levels_Cohere_1_M_Test_4b5df2244d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: QPS y recuperación de Milvus y OpenSearch en diferentes niveles de selectividad de filtros (prueba Cohere 1M). El eje X representa el porcentaje de datos filtrados. Como se muestra, Milvus mantiene una recuperación consistentemente alta en todos los niveles de selectividad del filtro, mientras que OpenSearch muestra un rendimiento inestable, con una recuperación que fluctúa significativamente bajo diferentes condiciones de filtrado.</em></p>
<h3 id="Streaming" class="common-anchor-header">Streaming</h3><p>Los sistemas de producción rara vez pueden permitirse el lujo de disponer de datos estáticos. La información nueva fluye continuamente mientras se ejecutan las búsquedas, un escenario en el que muchas bases de datos impresionantes se colapsan.</p>
<p>El caso de prueba de streaming exclusivo de VDBBench examina el rendimiento de la búsqueda durante la inserción, midiendo:</p>
<ol>
<li><p><strong>Impacto del creciente volumen de datos</strong>: Cómo se escala el rendimiento de la búsqueda con el aumento del tamaño de los datos.</p></li>
<li><p><strong>Impacto de la carga de escritura</strong>: cómo afectan las escrituras concurrentes a la latencia y el rendimiento de la búsqueda, ya que la escritura también consume recursos de CPU o memoria en el sistema.</p></li>
</ol>
<p>Los escenarios de streaming representan una prueba de estrés exhaustiva para cualquier base de datos vectorial. Pero construir un benchmark <em>justo</em> para esto no es trivial. No basta con describir cómo se comporta un sistema: necesitamos un modelo de evaluación coherente que permita <strong>realizar comparaciones</strong> entre distintas bases de datos.</p>
<p>Basándonos en nuestra experiencia ayudando a empresas con implantaciones en el mundo real, hemos creado un enfoque estructurado y repetible. Con VDBBench:</p>
<ul>
<li><p>Usted <strong>define una tasa de inserción fija</strong> que refleja su carga de trabajo de producción objetivo.</p></li>
<li><p>A continuación, VDBBench aplica <strong>una presión de carga idéntica</strong> en todos los sistemas, garantizando que los resultados de rendimiento sean directamente comparables.</p></li>
</ul>
<p>Por ejemplo, con un conjunto de datos Cohere de 10 millones y un objetivo de ingesta de 500 filas/segundo:</p>
<ul>
<li><p>VDBBench pone en marcha 5 procesos productores paralelos, cada uno insertando 100 filas por segundo.</p></li>
<li><p>Después de cada 10% de los datos se ingiere, VDBBench desencadena una ronda de pruebas de búsqueda, tanto en serie y condiciones concurrentes.</p></li>
<li><p>Después de cada etapa se registran métricas como la latencia, el QPS y la recuperación.</p></li>
</ul>
<p>Esta metodología controlada revela cómo evoluciona el rendimiento de cada sistema a lo largo del tiempo y en condiciones de tensión operativa real, lo que le proporciona la información que necesita para tomar decisiones de infraestructura escalables.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/igure_QPS_and_Recall_of_Pinecone_vs_Elasticsearch_in_the_Cohere_10_M_Streaming_Test_500_rows_s_Ingestion_Rate_548fc02f24.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: QPS y recuperación de Pinecone frente a Elasticsearch en la prueba de flujo Cohere 10M (tasa de ingestión de 500 filas/s). Pinecone mantuvo un mayor QPS y recall, mostrando una mejora significativa del QPS después de insertar el 100% de los datos.</em></p>
<p>Pero aquí no acaba la historia. VDBBench va aún más lejos al soportar un paso de optimización opcional, permitiendo a los usuarios comparar el rendimiento de la búsqueda de streaming antes y después de la optimización del índice. También rastrea e informa del tiempo real empleado en cada etapa, ofreciendo una visión más profunda de la eficiencia y el comportamiento del sistema en condiciones similares a las de producción.</p>
<p><span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_QPS_and_Recall_of_Pinecone_vs_Elasticsearch_in_the_Cohere_10_M_Streaming_Test_After_Optimization_500_rows_s_Ingestion_Rate_d249d290bb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura: QPS y recuperación de Pinecone frente a Elasticsearch en la prueba de flujo Cohere 10M después de la optimización (tasa de ingestión de 500 filas/s)</em></p>
<p>Como se muestra en el diagrama, ElasticSearch superó a Pinecone en QPS después de la optimización del índice. ¿Un milagro? No del todo. El gráfico de la derecha cuenta la historia completa: una vez que el eje x refleja el tiempo transcurrido real, está claro que ElasticSearch tardó mucho más tiempo en alcanzar ese rendimiento. Y en producción, ese retraso es importante. Esta comparación revela un equilibrio clave: rendimiento máximo frente a tiempo de servicio.</p>
<h2 id="Choose-Your-Vector-Database-with-Confidence" class="common-anchor-header">Elija su base de datos vectorial con confianza<button data-href="#Choose-Your-Vector-Database-with-Confidence" class="anchor-icon" translate="no">
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
    </button></h2><p>La diferencia entre los resultados del benchmark y el rendimiento en el mundo real no debería ser un juego de adivinanzas. VDBBench proporciona una forma de evaluar las bases de datos vectoriales en condiciones realistas, similares a las de producción, incluida la ingestión continua de datos, el filtrado de metadatos y las cargas de trabajo de streaming.</p>
<p>Si está planeando desplegar una base de datos vectorial en producción, merece la pena conocer su rendimiento más allá de las pruebas de laboratorio idealizadas. VDBBench es una herramienta de código abierto, transparente y diseñada para realizar comparaciones significativas.</p>
<p>Pruebe VDBBench con sus propias cargas de trabajo hoy mismo y compruebe cómo se comportan los distintos sistemas en la práctica: <a href="https://github.com/zilliztech/VectorDBBench">https://github.com/zilliztech/VectorDBBench.</a></p>
<p>¿Tienes preguntas o quieres compartir tus resultados? Únete a la conversación en<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a> o conéctate con nuestra comunidad en <a href="https://discord.com/invite/FG6hMJStWu">Discord</a>. Nos encantaría conocer tus opiniones.</p>
