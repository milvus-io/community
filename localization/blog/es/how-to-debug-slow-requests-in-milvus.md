---
id: how-to-debug-slow-requests-in-milvus.md
title: Cómo depurar solicitudes de búsqueda lentas en Milvus
author: Jael Gu
date: 2025-10-02T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Oct_2_2025_10_52_33_AM_min_fdb227d8c6.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database, slow requests, debug Milvus'
meta_title: |
  How to Debug Slow Search Requests in Milvus
desc: >-
  En este post, compartiremos cómo clasificar las solicitudes lentas en Milvus y
  compartiremos los pasos prácticos que puede seguir para mantener la latencia
  predecible, estable y consistentemente baja.
origin: 'https://milvus.io/blog/how-to-debug-slow-requests-in-milvus.md'
---
<p>El rendimiento está en el corazón de Milvus. En condiciones normales, una solicitud de búsqueda en Milvus se completa en milisegundos. Pero, ¿qué ocurre cuando su clúster se ralentiza, cuando la latencia de la búsqueda se extiende a segundos enteros?</p>
<p>Las búsquedas lentas no ocurren a menudo, pero pueden aparecer a gran escala o con cargas de trabajo complejas. Y cuando lo hacen, son importantes: alteran la experiencia del usuario, distorsionan el rendimiento de la aplicación y, a menudo, dejan al descubierto ineficiencias ocultas en la configuración.</p>
<p>En este artículo, explicaremos cómo clasificar las solicitudes lentas en Milvus y compartiremos los pasos prácticos que puede seguir para mantener la latencia predecible, estable y constantemente baja.</p>
<h2 id="Identifying-Slow-Searches" class="common-anchor-header">Identificación de búsquedas lentas<button data-href="#Identifying-Slow-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>El diagnóstico de una solicitud lenta comienza con dos preguntas: <strong>¿con qué frecuencia ocurre y a dónde se va el tiempo?</strong> Milvus le da ambas respuestas a través de métricas y registros.</p>
<h3 id="Milvus-Metrics" class="common-anchor-header">Métricas de Milvus</h3><p>Milvus exporta métricas detalladas que puede supervisar en paneles de Grafana.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_2_64a5881bf2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_3_b7b8b369ec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Los paneles clave incluyen:</p>
<ul>
<li><p><strong>Calidad del servicio → Consulta lenta</strong>: Marca cualquier solicitud que exceda proxy.slowQuerySpanInSeconds (por defecto: 5s). Estas también se marcan en Prometheus.</p></li>
<li><p><strong>Calidad del servicio</strong> →<strong>Latencia</strong> de<strong>búsqueda</strong>: Muestra la distribución general de la latencia. Si parece normal, pero los usuarios finales siguen viendo retrasos, es probable que el problema esté fuera de Milvus, en la red o en la capa de aplicación.</p></li>
<li><p><strong>Nodo de consulta → Latencia de búsqueda por fase</strong>: Desglosa la latencia en las fases de cola, consulta y reducción. Para una atribución más profunda, paneles como <em>Scalar</em> <em>Filter Latency</em>, <em>Vector Search Latency</em> y <em>Wait tSafe Lat</em> ency revelan qué etapa domina.</p></li>
</ul>
<h3 id="Milvus-Logs" class="common-anchor-header">Registros de Milvus</h3><p>Milvus también registra cualquier solicitud que dure más de un segundo, etiquetada con marcadores como [Búsqueda lenta]. Estos registros muestran <em>qué</em> consultas son lentas, complementando la información <em>obtenida</em> de las métricas. Como regla general</p>
<ul>
<li><p><strong>&lt; 30 ms</strong> → latencia de búsqueda saludable en la mayoría de los escenarios</p></li>
<li><p><strong>&gt; 100 ms</strong> → merece la pena investigar</p></li>
<li><p><strong>&gt; 1 s</strong> → definitivamente lenta y requiere atención</p></li>
</ul>
<p>Ejemplo de registro:</p>
<pre><code translate="no">[<span class="hljs-number">2025</span>/<span class="hljs-number">08</span>/<span class="hljs-number">23</span> <span class="hljs-number">19</span>:<span class="hljs-number">22</span>:<span class="hljs-number">19.900</span> +<span class="hljs-number">00</span>:<span class="hljs-number">00</span>] [INFO] [proxy/impl.<span class="hljs-keyword">go</span>:<span class="hljs-number">3141</span>] [<span class="hljs-string">&quot;Search slow&quot;</span>] [traceID=<span class="hljs-number">9100</span>b3092108604716f1472e4c7d54e4] [role=proxy] [db=<span class="hljs-keyword">default</span>] [collection=my_repos] [partitions=<span class="hljs-string">&quot;[]&quot;</span>] [dsl=<span class="hljs-string">&quot;user == \&quot;milvus-io\&quot; &amp;&amp; repo == \&quot;proxy.slowQuerySpanInSeconds\&quot;&quot;</span>] [<span class="hljs-built_in">len</span>(PlaceholderGroup)=<span class="hljs-number">8204</span>] [OutputFields=<span class="hljs-string">&quot;[user,repo,path,descripion]&quot;</span>] [search_params=<span class="hljs-string">&quot;[{\&quot;key\&quot;:\&quot;topk\&quot;,\&quot;value\&quot;:\&quot;10\&quot;},{\&quot;key\&quot;:\&quot;metric_type\&quot;,\&quot;value\&quot;:\&quot;COSINE\&quot;},{\&quot;key\&quot;:\&quot;anns_field\&quot;,\&quot;value\&quot;:\&quot;vector\&quot;},{\&quot;key\&quot;:\&quot;params\&quot;,\&quot;value\&quot;:\&quot;{\\\&quot;nprobe\\\&quot;:256,\\\&quot;metric_type\\\&quot;:\\\&quot;COSINE\\\&quot;}\&quot;}]&quot;</span>] [ConsistencyLevel=Strong] [useDefaultConsistency=<span class="hljs-literal">true</span>] [guarantee_timestamp=<span class="hljs-number">460318735832711168</span>] [nq=<span class="hljs-number">1</span>] [duration=<span class="hljs-number">5</span>m12<span class="hljs-number">.002784545</span>s] [durationPerNq=<span class="hljs-number">5</span>m12<span class="hljs-number">.002784545</span>s]
<button class="copy-code-btn"></button></code></pre>
<p>En resumen, <strong>las métricas le dicen a dónde va el tiempo; los registros le dicen qué consultas son golpeadas.</strong></p>
<h2 id="Analyzing-Root-Cause" class="common-anchor-header">Análisis de la causa<button data-href="#Analyzing-Root-Cause" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Heavy-Workload" class="common-anchor-header">Carga de trabajo pesada</h3><p>Una causa común de las peticiones lentas es una carga de trabajo excesiva. Cuando una petición tiene un <strong>NQ</strong> (número de consultas por petición) muy grande, puede ejecutarse durante un periodo prolongado y monopolizar los recursos del nodo de consultas. Las demás peticiones se acumulan detrás de ella, lo que provoca un aumento de la latencia de la cola. Incluso si cada petición tiene un NQ pequeño, un rendimiento global (QPS) muy alto puede causar el mismo efecto, ya que Milvus puede fusionar internamente peticiones de búsqueda concurrentes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/high_workload_cf9c75e24c.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>Señales a tener en cuenta:</strong></p>
<ul>
<li><p>Todas las consultas muestran una latencia inesperadamente alta.</p></li>
<li><p>Las métricas del Nodo de Consulta informan de una alta <strong>latencia en cola</strong>.</p></li>
<li><p>Los registros muestran una petición con un NQ grande y una duración total larga, pero una duraciónPerNQ relativamente pequeña, lo que indica que una petición sobredimensionada está dominando los recursos.</p></li>
</ul>
<p><strong>Cómo solucionarlo:</strong></p>
<ul>
<li><p><strong>Consultas por lotes</strong>: Mantenga un NQ modesto para evitar sobrecargar una única petición.</p></li>
<li><p><strong>Reduzca los nodos de consulta</strong>: Si la alta concurrencia es una parte habitual de su carga de trabajo, añada nodos de consulta para repartir la carga y mantener una latencia baja.</p></li>
</ul>
<h3 id="Inefficient-Filtering" class="common-anchor-header">Filtrado ineficiente</h3><p>Otro cuello de botella común proviene de los filtros ineficientes. Si las expresiones de filtrado están mal realizadas o los campos carecen de índices escalares, Milvus puede volver a un <strong>escaneo completo</strong> en lugar de escanear un subconjunto pequeño y específico. Los filtros JSON y los ajustes de consistencia estrictos pueden aumentar aún más la sobrecarga.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/inefficient_filtering_e524615d63.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>Señales a tener en cuenta:</strong></p>
<ul>
<li><p>Alta <strong>latencia del filtro escalar</strong> en las métricas del nodo de consulta.</p></li>
<li><p>Picos de latencia notables sólo cuando se aplican filtros.</p></li>
<li><p><strong>Latencia tSafe de espera</strong> prolongada si la coherencia estricta está activada.</p></li>
</ul>
<p><strong>Cómo solucionarlo:</strong></p>
<ul>
<li><strong>Simplificar las expresiones de filtro</strong>: Reduzca la complejidad del plan de consulta optimizando los filtros. Por ejemplo, sustituya las largas cadenas OR por una expresión IN:</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Replace chains of OR conditions with IN</span>
tag = {<span class="hljs-string">&quot;tag&quot;</span>: [<span class="hljs-string">&quot;A&quot;</span>, <span class="hljs-string">&quot;B&quot;</span>, <span class="hljs-string">&quot;C&quot;</span>, <span class="hljs-string">&quot;D&quot;</span>]}
filter_expr = <span class="hljs-string">&quot;tag IN {tag}&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p>Milvus también introduce un mecanismo de plantillas de expresiones de filtro diseñado para mejorar la eficiencia reduciendo el tiempo empleado en analizar expresiones complejas. Consulte <a href="https://milvus.io/docs/filtering-templating.md">este documento</a> para obtener más detalles.</p></li>
<li><p><strong>Añada índices adecuados</strong>: Evite las exploraciones completas creando índices escalares en los campos utilizados en los filtros.</p></li>
<li><p><strong>Maneje JSON eficientemente</strong>: Milvus 2.6 introdujo índices de ruta y planos para los campos JSON, lo que permite un manejo eficiente de los datos JSON. La trituración de JSON también está en <a href="https://milvus.io/docs/roadmap.md">la hoja de ruta</a> para mejorar aún más el rendimiento. Consulte <a href="https://milvus.io/docs/use-json-fields.md#JSON-Field">el documento sobre campos JSON</a> para obtener más información.</p></li>
<li><p><strong>Ajuste del nivel de consistencia</strong>: Utilice lecturas consistentes <em>limitadas</em> o <em>eventuales</em> cuando no se requieran garantías estrictas, reduciendo el tiempo de espera <em>de tSafe</em>.</p></li>
</ul>
<h3 id="Improper-Choice-of-Vector-Index" class="common-anchor-header">Elección incorrecta del índice vectorial</h3><p><a href="https://milvus.io/docs/index-explained.md">Los índices vectoriales</a> no son universales. Seleccionar el índice incorrecto puede afectar significativamente a la latencia. Los índices en memoria ofrecen el rendimiento más rápido pero consumen más memoria, mientras que los índices en disco ahorran memoria a costa de la velocidad. Los vectores binarios también requieren estrategias de indexación especializadas.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_4_25fa1b9c13.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>Señales a tener en cuenta:</strong></p>
<ul>
<li><p>Alta latencia de búsqueda de vectores en las métricas del nodo de consulta.</p></li>
<li><p>Saturación de E/S de disco cuando se utiliza DiskANN o MMAP.</p></li>
<li><p>Consultas más lentas inmediatamente después del reinicio debido al arranque en frío de la caché.</p></li>
</ul>
<p><strong>Cómo solucionarlo:</strong></p>
<ul>
<li><p><strong>Adaptar el índice a la carga de trabajo (vectores flotantes):</strong></p>
<ul>
<li><p><strong>HNSW</strong>: mejor para casos de uso en memoria con alta recuperación y baja latencia.</p></li>
<li><p><strong>Familia IVF</strong>: compromiso flexible entre recuperación y velocidad.</p></li>
<li><p><strong>DiskANN</strong>: admite conjuntos de datos a escala de miles de millones, pero requiere un gran ancho de banda de disco.</p></li>
</ul></li>
<li><p><strong>Para vectores binarios:</strong> Utilice el <a href="https://milvus.io/docs/minhash-lsh.md">índice MINHASH_LSH</a> (introducido en Milvus 2.6) con la métrica MHJACCARD para aproximar eficientemente la similitud de Jaccard.</p></li>
<li><p><strong>Habilitar</strong> <a href="https://milvus.io/docs/mmap.md"><strong>MMAP</strong></a>: Asigne archivos de índice a la memoria en lugar de mantenerlos totalmente residentes para lograr un equilibrio entre la latencia y el uso de memoria.</p></li>
<li><p><strong>Ajuste de los parámetros de índice/búsqueda</strong>: Ajuste la configuración para equilibrar la recuperación y la latencia para su carga de trabajo.</p></li>
<li><p><strong>Mitigue los arranques en frío</strong>: Caliente los segmentos de acceso frecuente tras un reinicio para evitar la lentitud inicial de las consultas.</p></li>
</ul>
<h3 id="Runtime--Environment-Conditions" class="common-anchor-header">Tiempo de ejecución y condiciones del entorno</h3><p>No todas las consultas lentas se deben a la propia consulta. Los nodos de consulta suelen compartir recursos con trabajos en segundo plano, como la compactación, la migración de datos o la creación de índices. Los upserts frecuentes pueden generar muchos segmentos pequeños sin indexar, lo que obliga a las búsquedas a escanear datos sin procesar. En algunos casos, las ineficiencias específicas de la versión también pueden introducir latencia hasta que se parcheen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/img_v3_02q5_4dd2e545_93dc_4c58_b609_d76d50c2013g_aad0a89208.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>Señales a tener en cuenta:</strong></p>
<ul>
<li><p>Picos de uso de la CPU durante trabajos en segundo plano (compactación, migración, creación de índices).</p></li>
<li><p>Saturación de E/S de disco que afecta al rendimiento de las consultas.</p></li>
<li><p>Calentamiento muy lento de la caché tras un reinicio.</p></li>
<li><p>Gran número de segmentos pequeños sin indexar (debido a upserts frecuentes).</p></li>
<li><p>Regresiones de latencia vinculadas a versiones específicas de Milvus.</p></li>
</ul>
<p><strong>Cómo solucionarlo:</strong></p>
<ul>
<li><p><strong>Reprograme las tareas en segundo plano</strong> (por ejemplo, la compactación) para las horas de menor actividad.</p></li>
<li><p>Libere<strong>las colecciones no utilizadas</strong> para liberar memoria.</p></li>
<li><p><strong>Tenga en cuenta el tiempo de calentamiento</strong> tras los reinicios; precaliente las cachés si es necesario.</p></li>
<li><p><strong>Realice upserts por lotes</strong> para reducir la creación de segmentos diminutos y permitir que la compactación siga el ritmo.</p></li>
<li><p><strong>Manténgase al día</strong>: actualice a las versiones más recientes de Milvus para corregir errores y obtener optimizaciones.</p></li>
<li><p><strong>Proporcione recursos</strong>: dedique más CPU/memoria a las cargas de trabajo sensibles a la latencia.</p></li>
</ul>
<p>Combinando cada señal con la acción adecuada, la mayoría de las consultas lentas pueden resolverse de forma rápida y predecible.</p>
<h2 id="Best-Practices-to-Prevent-Slow-Searches" class="common-anchor-header">Mejores prácticas para evitar las búsquedas lentas<button data-href="#Best-Practices-to-Prevent-Slow-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>La mejor sesión de depuración es la que nunca necesita ejecutar. En nuestra experiencia, unos pocos hábitos simples ayudan mucho a prevenir las consultas lentas en Milvus:</p>
<ul>
<li><p><strong>Planifique la asignación de recursos</strong> para evitar la contención de CPU y disco.</p></li>
<li><p><strong>Establezca alertas proactivas</strong> tanto para fallos como para picos de latencia.</p></li>
<li><p><strong>Mantenga las expresiones de filtro</strong> cortas, simples y eficientes.</p></li>
<li><p><strong>Realice upserts por lotes</strong> y mantenga NQ/QPS en niveles sostenibles.</p></li>
<li><p><strong>Indexe todos los campos</strong> utilizados en los filtros.</p></li>
</ul>
<p>Las consultas lentas en Milvus son poco frecuentes y, cuando aparecen, suelen tener causas claras y diagnosticables. Con métricas, registros y un enfoque estructurado, puede identificar y resolver rápidamente los problemas. Este es el mismo manual que nuestro equipo de soporte utiliza cada día, y ahora también es el suyo.</p>
<p>Esperamos que esta guía proporcione no solo un marco de solución de problemas, sino también la confianza para mantener sus cargas de trabajo Milvus funcionando sin problemas y de manera eficiente.</p>
<h2 id="💡-Want-to-dive-deeper" class="common-anchor-header">¿Quieres profundizar más?<button data-href="#💡-Want-to-dive-deeper" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p>Únete al <a href="https://discord.com/invite/8uyFbECzPX"><strong>Discord</strong></a> de Milvus para hacer preguntas, compartir experiencias y aprender de la comunidad.</p></li>
<li><p>Inscríbete en nuestro <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>Milvus Office Hours</strong></a> para hablar directamente con el equipo y recibir asistencia práctica con tus cargas de trabajo.</p></li>
</ul>
