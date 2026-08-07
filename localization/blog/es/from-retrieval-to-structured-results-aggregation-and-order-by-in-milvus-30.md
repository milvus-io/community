---
id: from-retrieval-to-structured-results-aggregation-and-order-by-in-milvus-30.md
title: >-
  De la recuperación a resultados estructurados: agregación y ORDER BY en Milvus
  3.0
author: Chun Han
date: 2026-8-7
cover: assets.zilliz.com/cover_of_milvus_3_blog_37a6c88c81.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus 3.0, query aggregation, Search Aggregation, ORDER BY, vector search'
meta_title: |
  Milvus 3.0 Aggregation & ORDER BY: Query and Search Guide
desc: >-
  Descubra cómo Milvus 3.0 añade agregación de consultas, Search Aggregation y
  ORDER BY del lado del servidor para obtener resultados de búsqueda vectorial
  estructurados y eficientes.
origin: >-
  https://milvus.io/blog/from-retrieval-to-structured-results-aggregation-and-order-by-in-milvus-30.md
---
<p>Considere un flujo familiar de búsqueda de productos. Un comprador sube una foto de un vestido, y la búsqueda vectorial recupera un conjunto de candidatos relevante de un catálogo que contiene decenas de millones de productos.</p>
<p>La página, sin embargo, necesita más que una lista clasificada. Necesita facetas de marca. Necesita una ordenación por precio. El equipo de merchandising quiere saber qué marcas dominan este conjunto de resultados, el rango de precios dentro de cada marca y algunos productos representativos de cada grupo.</p>
<p>Antes de Milvus 3.0, las aplicaciones solían encargarse ellas mismas de ese segundo paso: recuperar filas de Milvus, agruparlas y ordenarlas en pandas o en una capa de servicio, y luego ensamblar la respuesta. Algunos equipos mantenían una canalización de analítica independiente únicamente para calcular recuentos y distribuciones sobre datos que ya estaban en la base de datos vectorial.</p>
<p>La base de datos vectorial encontraba los candidatos; la aplicación tenía que convertirlos en un resultado estructurado.</p>
<p>Milvus 3.0 traslada más de ese trabajo al motor de recuperación. Añade tres capacidades relacionadas pero distintas:</p>
<ul>
<li><strong>La agregación de consultas</strong> calcula <code translate="no">count</code>, <code translate="no">sum</code>, <code translate="no">avg</code>, <code translate="no">min</code> y <code translate="no">max</code> sobre filas filtradas y visibles, con campos <code translate="no">GROUP BY</code> opcionales.</li>
<li><strong>Search Aggregation</strong> organiza los candidatos de vecinos más cercanos aproximados (ANN) retenidos en buckets, calcula métricas por bucket, crea buckets anidados y devuelve resultados representativos.</li>
<li><strong>El lado del servidor</strong> <code translate="no">**ORDER BY**</code> ordena los resultados de consulta o los candidatos ANN por uno o más campos escalares antes de que la aplicación los reciba.</li>
</ul>
<p>La distinción entre consulta y búsqueda importa:</p>
<table>
<thead>
<tr><th>Capacidad</th><th>Datos que se resumen u ordenan</th><th>Forma principal del resultado</th><th>Límite de exactitud</th></tr>
</thead>
<tbody>
<tr><td>Agregación de consultas</td><td>Todas las filas visibles que coinciden con el filtro</td><td>Una fila por grupo, con valores agregados</td><td>Exacta sobre el conjunto de filas visibles de la consulta</td></tr>
<tr><td>Search Aggregation</td><td>Candidatos retenidos por la búsqueda ANN y la etapa de agrupación</td><td>Buckets, métricas, resultados representativos y buckets secundarios opcionales</td><td>Aproximada por diseño</td></tr>
<tr><td>Consulta <code translate="no">ORDER BY</code></td><td>Filas visibles que coinciden con el filtro</td><td>Filas ordenadas</td><td>Exacta sobre el resultado de consulta filtrado</td></tr>
<tr><td>Búsqueda <code translate="no">ORDER BY</code></td><td>Candidatos ANN</td><td>Resultados de búsqueda o grupos ordenados</td><td>No amplía el límite de recuperación ANN</td></tr>
</tbody>
</table>
<p>Este artículo explica por qué estas operaciones pertenecen dentro de la base de datos, cómo funciona la agregación distribuida, en qué se diferencia Search Aggregation de Grouping Search y dónde terminan las nuevas semánticas.</p>
<h2 id="Why-application-side-post-processing-breaks-down" class="common-anchor-header">Por qué el posprocesamiento del lado de la aplicación deja de funcionar<button data-href="#Why-application-side-post-processing-breaks-down" class="anchor-icon" translate="no">
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
    </button></h2><p>Mover la agregación y la ordenación a la aplicación puede parecer una pequeña decisión de implementación. A escala, crea tres problemas mayores.</p>
<h3 id="The-application-moves-far-more-data-than-the-answer-contains" class="common-anchor-header">La aplicación mueve muchos más datos de los que contiene la respuesta</h3><p>Supongamos que un panel de operaciones necesita el recuento de productos y el precio medio de cada categoría entre dos millones de filas con stock. Incluso con una carga útil aproximada de solo 100 bytes por fila para la categoría, el precio, la clave primaria y la sobrecarga de serialización, la aplicación debe recibir unos 200 MB de datos antes de poder calcular el resultado.</p>
<p>Si el catálogo tiene 200 categorías, la respuesta son solo unos pocos cientos de claves y números: del orden de kilobytes. La aplicación mueve varios órdenes de magnitud más datos de los que devuelve, paga el mismo coste en cada actualización y necesita suficiente memoria de cliente para mantener o transmitir las filas intermedias.</p>
<p>Una agregación dentro del motor cambia la unidad de movimiento de datos. Las filas sin procesar permanecen donde están. Lo que cruza nodos y finalmente sale de Milvus es el conjunto mucho más pequeño de estados de grupo parciales y finales.</p>
<h3 id="Page-local-sorting-is-not-global-sorting" class="common-anchor-header">La ordenación local de una página no es ordenación global</h3><p>Ordenar después de paginar es un error de corrección, no simplemente una implementación ineficiente.</p>
<p>Si una aplicación obtiene las filas 11 a 20 y ordena solo esas filas por precio, ha producido el orden de precios dentro de esa página, no las filas 11 a 20 del resultado global ordenado por precio. Una página posterior puede contener productos más baratos que todos los productos de la primera página.</p>
<p>El mismo límite importa en la búsqueda vectorial. Obtener un conjunto Top-K pequeño y ordenarlo en la aplicación solo puede reordenar esos candidatos. No puede recuperar candidatos relevantes que la etapa ANN no devolvió, y a menudo lleva a las aplicaciones a sobrerrecuperar solo para que la ordenación del lado del cliente sea útil.</p>
<p>La ordenación del lado del servidor da a Milvus control sobre la secuencia de ordenación y paginación. Para cargas de trabajo de consulta, el motor ordena el conjunto de filas filtradas antes de aplicar la ventana de página. Para cargas de trabajo de búsqueda, ordena dentro del límite de candidatos ANN y mantiene explícita esa limitación.</p>
<h3 id="The-client-cannot-reproduce-database-visibility" class="common-anchor-header">El cliente no puede reproducir la visibilidad de la base de datos</h3><p>La agregación también depende de qué filas son visibles en la marca de tiempo de la consulta. Las eliminaciones, las entidades expiradas y las escrituras concurrentes se rigen por el control de concurrencia multiversión (MVCC) de Milvus y sus semánticas de consistencia.</p>
<p>Una vez que las filas sin procesar salen de la base de datos, la aplicación suele asumir que el lote recibido representa la instantánea correcta. Reconstruir las mismas reglas de visibilidad en un cliente es impracticable, especialmente mientras la colección recibe escrituras y eliminaciones.</p>
<p>La solución alternativa habitual —un segundo motor de analítica alimentado por exportación y ETL— añade otra copia de los datos, otro límite de consistencia y otra canalización que operar. Los recuentos, las métricas y la ordenación deben ejecutarse donde ya existen tanto los datos como sus reglas de visibilidad.</p>
<p>Ahora, veamos qué ofrece Milvus 3.0.</p>
<h2 id="Query-aggregation-exact-statistics-over-visible-rows" class="common-anchor-header">Agregación de consultas: estadísticas exactas sobre filas visibles<button data-href="#Query-aggregation-exact-statistics-over-visible-rows" class="anchor-icon" translate="no">
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
    </button></h2><p>La agregación de consultas responde preguntas como:</p>
<ul>
<li>¿Cuántos productos con stock hay en cada categoría?</li>
<li>¿Cuál es el precio medio por marca?</li>
<li>¿Cuáles son las marcas de tiempo de evento mínima y máxima para cada host?</li>
<li>¿Cuántos registros permanecen después de aplicar un filtro y la visibilidad TTL?</li>
</ul>
<p>La API resulta familiar para cualquiera que haya usado SQL: pase uno o más campos en <code translate="no">group_by_fields</code> y luego coloque expresiones de agregación en <code translate="no">output_fields</code>.</p>
<pre><code translate="no" class="language-python">res = client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;status == &quot;on_sale&quot;&#x27;</span>,
    group_by_fields=[<span class="hljs-string">&quot;category&quot;</span>],
    output_fields=[<span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;count(*)&quot;</span>, <span class="hljs-string">&quot;avg(price)&quot;</span>],
)

<span class="hljs-comment"># [</span>
<span class="hljs-comment">#     {&quot;category&quot;: &quot;books&quot;, &quot;count(*)&quot;: 18734, &quot;avg(price)&quot;: 45.3},</span>
<span class="hljs-comment">#     ...</span>
<span class="hljs-comment"># ]</span>
<button class="copy-code-btn"></button></code></pre>
<p>La sintaxis es la parte sencilla. El modelo de ejecución es lo que hace que el resultado sea útil en una base de datos vectorial distribuida.</p>
<h3 id="Segment-local-states-replace-raw-row-movement" class="common-anchor-header">Los estados locales de segmento sustituyen el movimiento de filas sin procesar</h3><p>Una colección de Milvus puede abarcar cientos o miles de segmentos distribuidos entre varios nodos de consulta, con datos escritos recientemente todavía en la ruta de streaming. Ningún nodo de ejecución individual comienza con todas las filas visibles.</p>
<p>Por lo tanto, Milvus empuja la agregación hacia los segmentos:</p>
<ol>
<li>Cada segmento aplica localmente el filtro y las reglas de visibilidad MVCC.</li>
<li>El segmento emite un estado parcial por grupo en lugar de sus filas coincidentes.</li>
<li>Los estados parciales se fusionan dentro de un nodo de consulta.</li>
<li>El proxy realiza la fusión final entre nodos y devuelve los grupos completos.</li>
</ol>
<p>La cantidad de datos intermedios ahora escala con el número de grupos y estados agregados, en lugar de escalar directamente con el número de filas coincidentes.</p>
<p>La operación de fusión depende del agregado:</p>
<table>
<thead>
<tr><th>Agregado</th><th>Estado parcial</th><th>Regla de fusión</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">count</code></td><td>Recuento parcial</td><td>Sumar recuentos</td></tr>
<tr><td><code translate="no">sum</code></td><td>Suma parcial</td><td>Sumar sumas</td></tr>
<tr><td><code translate="no">min</code></td><td>Mínimo parcial</td><td>Tomar el mínimo</td></tr>
<tr><td><code translate="no">max</code></td><td>Máximo parcial</td><td>Tomar el máximo</td></tr>
<tr><td><code translate="no">avg</code></td><td>Suma y recuento parciales</td><td>Sumar ambos estados y luego dividir una vez en la etapa final</td></tr>
</tbody>
</table>
<p><code translate="no">avg</code> es el caso ilustrativo. Promediar dos promedios parciales es incorrecto cuando las particiones contienen distintos números de filas. Milvus lleva <code translate="no">sum</code> y <code translate="no">count</code> de forma independiente y calcula el promedio final solo después de que ambos se hayan fusionado globalmente.</p>
<p>Esta es una razón por la que la agregación pertenece a la base de datos: la operación no consiste simplemente en “ejecutar la misma función sobre varios lotes”. El motor debe preservar el álgebra de cada agregado a través de los límites de segmentos y nodos.</p>
<h3 id="Visibility-is-applied-before-aggregation" class="common-anchor-header">La visibilidad se aplica antes de la agregación</h3><p>Las filas eliminadas y expiradas se eliminan de los estados parciales a nivel de segmento según el límite de visibilidad de la consulta. No viajan hacia arriba para luego corregirse en la aplicación.</p>
<p>Por lo tanto, el resultado describe las filas que Milvus considera visibles para esa solicitud, no una colección arbitraria de lotes extraídos en momentos ligeramente distintos.</p>
<h3 id="limit-now-counts-groups" class="common-anchor-header"><code translate="no">limit</code> ahora cuenta grupos</h3><p>En una consulta normal, <code translate="no">limit</code> controla cuántas filas de entidad se devuelven. En una consulta agrupada, controla cuántos grupos se devuelven. Como la cardinalidad del resultado está determinada por los grupos y no por las filas coincidentes, una agregación de consulta también puede omitir <code translate="no">limit</code> cuando necesita todos los grupos.</p>
<p>Esto suena como un pequeño detalle de API, pero refleja un modelo de resultados diferente: la salida ya no es una página de entidades. Es una relación cuyas filas representan grupos.</p>
<h2 id="Search-Aggregation-a-bucketed-view-of-ANN-candidates" class="common-anchor-header">Search Aggregation: una vista en buckets de candidatos ANN<button data-href="#Search-Aggregation-a-bucketed-view-of-ANN-candidates" class="anchor-icon" translate="no">
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
    </button></h2><p>La agregación de consultas responde: “¿Qué aspecto tienen las filas visibles que coinciden con este filtro?”. Search Aggregation plantea una pregunta diferente: “¿Qué aspecto tiene el conjunto de candidatos recuperado para este vector?”.</p>
<p>Esa operación no tiene un equivalente SQL exacto. La búsqueda ANN primero establece un límite de candidatos impulsado por similitud. Luego Milvus organiza los candidatos retenidos por claves escalares y devuelve un árbol de buckets en lugar de una lista plana ordinaria de resultados.</p>
<p>Un bucket puede contener:</p>
<ul>
<li>una clave como <code translate="no">brand</code> o una clave compuesta como <code translate="no">(brand, color)</code>;</li>
<li>un recuento de candidatos retenidos;</li>
<li>métricas que incluyen <code translate="no">count</code>, <code translate="no">sum</code>, <code translate="no">avg</code>, <code translate="no">min</code> y <code translate="no">max</code>;</li>
<li>entidades representativas seleccionadas con <code translate="no">top_hits</code>; y</li>
<li>una <code translate="no">sub_aggregation</code> anidada que crea buckets secundarios.</li>
</ul>
<p>Para la página de búsqueda de productos, una solicitud puede devolver buckets de marca, el precio medio dentro de cada bucket y tres productos representativos por marca:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> SearchAggregation, TopHits

aggregation = SearchAggregation(
    fields=[<span class="hljs-string">&quot;brand&quot;</span>],
    size=<span class="hljs-number">10</span>,                                    <span class="hljs-comment"># Return up to 10 brand buckets</span>
    metrics={<span class="hljs-string">&quot;avg_price&quot;</span>: {<span class="hljs-string">&quot;avg&quot;</span>: <span class="hljs-string">&quot;price&quot;</span>}},
    order=[{<span class="hljs-string">&quot;_count&quot;</span>: <span class="hljs-string">&quot;desc&quot;</span>}],               <span class="hljs-comment"># Order by retained-candidate count</span>
    top_hits=TopHits(
        size=<span class="hljs-number">3</span>,
        sort=[{<span class="hljs-string">&quot;_score&quot;</span>: <span class="hljs-string">&quot;desc&quot;</span>}],            <span class="hljs-comment"># Use &quot;asc&quot; for L2 distance</span>
    ),
)

res = client.search(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_aggregation=aggregation,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;brand&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
)

buckets = res.agg_buckets[<span class="hljs-number">0</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Cuando <code translate="no">search_aggregation</code> está establecido, la lista ordinaria de resultados está vacía. La aplicación lee la respuesta de buckets desde <code translate="no">result.agg_buckets</code>.</p>
<h3 id="The-aggregation-specification-sets-two-different-bounds" class="common-anchor-header">La especificación de agregación establece dos límites diferentes</h3><p>Search Aggregation no ejecuta <code translate="no">GROUP BY</code> sobre cada entidad de la colección, y tampoco toma simplemente una respuesta Top-K ordinaria para agregar esa lista plana.</p>
<p>Su ejecución tiene tres etapas:</p>
<ol>
<li>Milvus ejecuta una búsqueda ANN para recuperar candidatos cercanos al vector de consulta.</li>
<li>La etapa de agrupación retiene un número acotado de candidatos para cada clave de bucket completa.</li>
<li>Milvus crea buckets, calcula métricas sobre los candidatos retenidos, ordena los buckets y adjunta resultados representativos o buckets secundarios.</li>
</ol>
<p>Dos parámetros controlan partes distintas del resultado:</p>
<ul>
<li><code translate="no">SearchAggregation.size</code> limita cuántos buckets se devuelven en ese nivel de agregación.</li>
<li>El mayor <code translate="no">TopHits.size</code> en cualquier lugar del árbol de agregación establece el presupuesto de candidatos retenidos para cada clave compuesta completa. Si la solicitud no contiene <code translate="no">top_hits</code>, el presupuesto por clave toma el valor predeterminado de uno.</li>
</ul>
<p>El <code translate="no">limit</code> de búsqueda de nivel superior no controla este modo y se ignora cuando <code translate="no">search_aggregation</code> está presente.</p>
<p>Esa distinción es esencial al leer el <code translate="no">count</code> o las métricas de un bucket. Con <code translate="no">TopHits(size=3)</code>, un bucket de marca puede resumir como máximo tres candidatos retenidos para su clave completa, incluso si la colección contiene miles de productos relevantes de esa marca. Aumentar <code translate="no">TopHits.size</code> amplía la ventana de métricas por clave, pero no convierte la búsqueda ANN en un escaneo exacto.</p>
<p>Si la aplicación necesita estadísticas exactas sobre cada fila visible que coincide con un filtro, debe usar la agregación de consultas. Search Aggregation sirve para describir y comparar los candidatos producidos por la recuperación por similitud.</p>
<h2 id="Search-Aggregation-and-Grouping-Search-solve-different-problems" class="common-anchor-header">Search Aggregation y Grouping Search resuelven problemas diferentes<button data-href="#Search-Aggregation-and-Grouping-Search-solve-different-problems" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus admite Grouping Search (<code translate="no">group_by</code>)desde Milvus 2.4. Es fácil ver la palabra “grouping” en ambas funciones y asumir que son dos interfaces para la misma operación. Sus contratos de salida son diferentes.</p>
<p><strong>Grouping Search</strong> cambia qué entidades aparecen en una lista de resultados clasificada. Un patrón RAG común almacena fragmentos como entidades individuales, los agrupa por <code translate="no">doc_id</code> y devuelve uno o algunos fragmentos de cada documento. La salida principal sigue siendo resultados de búsqueda ordinarios, pero con menos valores repetidos del campo de agrupación.</p>
<p><strong>Search Aggregation</strong> devuelve una vista estadística. La salida principal es un árbol de buckets que contiene claves, recuentos, métricas, resultados representativos y buckets secundarios opcionales.</p>
<table>
<thead>
<tr><th>Necesidad de la aplicación</th><th>Preferir</th><th>Consumir</th></tr>
</thead>
<tbody>
<tr><td>Una lista de entidades clasificada con mayor diversidad en un campo</td><td>Grouping Search</td><td>Resultados de búsqueda ordinarios</td></tr>
<tr><td>Recuentos de facetas, métricas por grupo, resultados representativos o distribuciones anidadas</td><td>Search Aggregation</td><td>Objetos <code translate="no">AggregationBucket</code> en <code translate="no">result.agg_buckets</code></td></tr>
</tbody>
</table>
<p>Una regla práctica es comenzar por la forma de la respuesta de la UI o la API. Si la aplicación renderiza una lista, Grouping Search suele ser la primitiva adecuada. Si renderiza facetas, tarjetas de distribución o una jerarquía de grupos, use Search Aggregation.</p>
<p>Los dos modos son mutuamente excluyentes en una solicitud porque definen formas de resultado principales diferentes.</p>
<h2 id="ORDER-BY-move-sorting-before-the-application-boundary" class="common-anchor-header"><code translate="no">ORDER BY</code>: mover la ordenación antes del límite de la aplicación<button data-href="#ORDER-BY-move-sorting-before-the-application-boundary" class="anchor-icon" translate="no">
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
    </button></h2><p>La ordenación es la función menos exótica de esta versión y una de las más fáciles de implementar incorrectamente fuera del motor.</p>
<p>Milvus 3.0 expone la ordenación tanto en consulta como en búsqueda, pero las dos rutas usan parámetros de SDK diferentes y operan sobre conjuntos de entrada distintos.</p>
<h3 id="Query-sorting-orders-the-filtered-row-set" class="common-anchor-header">La ordenación de consultas ordena el conjunto de filas filtradas</h3><p>La consulta de PyMilvus usa <code translate="no">order_by</code>, expresado como una lista de cadenas <code translate="no">&quot;field:direction&quot;</code>. El motor aplica el filtro, ordena las filas visibles y luego aplica <code translate="no">limit</code> y <code translate="no">offset</code>.</p>
<pre><code translate="no" class="language-python">res = client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;category == &quot;books&quot;&#x27;</span>,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
    order_by=[<span class="hljs-string">&quot;price:desc&quot;</span>, <span class="hljs-string">&quot;title:asc&quot;</span>],
    limit=<span class="hljs-number">10</span>,
    offset=<span class="hljs-number">10</span>,  <span class="hljs-comment"># Rows 11-20 in the filtered, price-sorted result</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Esto hace que la consulta sea útil para la navegación ordenada por criterios de negocio: registros ingeridos más recientes, productos de mayor precio dentro de un filtro, menor inventario o valores extremos para inspección de datos. Sin ordenación del lado del servidor, las aplicaciones tenían que recuperar filas primero y no podían definir un orden de negocio fiable entre páginas.</p>
<p>Para campos de consulta anulables, el orden ascendente coloca los nulos al final y el orden descendente los coloca al principio. Un campo de ordenación no tiene que aparecer en <code translate="no">output_fields</code>; inclúyalo solo cuando la aplicación necesite el valor en la respuesta.</p>
<h3 id="Search-sorting-reorders-the-ANN-candidate-set" class="common-anchor-header">La ordenación de búsqueda reordena el conjunto de candidatos ANN</h3><p>La búsqueda de PyMilvus usa <code translate="no">order_by_fields</code>, donde cada entrada nombra un campo escalar y una dirección:</p>
<pre><code translate="no" class="language-python">res = client.search(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    <span class="hljs-built_in">limit</span>=50,
    output_fields=[<span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
    order_by_fields=[
        {<span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;price&quot;</span>, <span class="hljs-string">&quot;order&quot;</span>: <span class="hljs-string">&quot;asc&quot;</span>},
    ],
)
<button class="copy-code-btn"></button></code></pre>
<p>ANN sigue determinando qué entidades se convierten en candidatos. <code translate="no">order_by_fields</code> cambia cómo se devuelven esos candidatos; no hace que la búsqueda escanee globalmente la colección para encontrar los productos más baratos.</p>
<p>Ese límite da a las dos API trabajos distintos:</p>
<ul>
<li>Use consulta más <code translate="no">order_by</code> cuando el orden escalar en sí define el resultado, como los diez productos con stock más baratos.</li>
<li>Use búsqueda más <code translate="no">order_by_fields</code> cuando la relevancia semántica o vectorial define el conjunto de candidatos y un campo escalar determina cómo deben presentarse esos candidatos.</li>
</ul>
<p>La ordenación por varios campos aplica las claves en el orden de la lista. Cuando los candidatos de búsqueda tienen los mismos valores para cada clave escalar especificada, Milvus conserva su orden original por puntuación de similitud.</p>
<p>La ordenación también se compone con Grouping Search. Milvus ordena los grupos por el valor escalar configurado de la entidad principal de cada grupo, conservando la forma de resultado agrupado. Esto es útil cuando la aplicación quiere tanto diversidad entre un campo como un orden de grupo relevante para el negocio.</p>
<h2 id="What-these-capabilities-make-possible" class="common-anchor-header">Qué hacen posibles estas capacidades<button data-href="#What-these-capabilities-make-possible" class="anchor-icon" translate="no">
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
    </button></h2><p>Las API son primitivas generales de base de datos, pero varias cargas de trabajo de recuperación se benefician de inmediato.</p>
<h3 id="RAG-and-agents-inspect-retrieval-concentration" class="common-anchor-header">RAG y agentes: inspeccionar la concentración de la recuperación</h3><p>Un sistema RAG o agéntico puede agrupar en buckets los fragmentos recuperados por documento de origen, línea de producto, tenant o tipo de contenido. Un resultado concentrado en dos documentos transmite una señal de cobertura distinta a la de uno distribuido entre decenas de fuentes.</p>
<p>Esa distribución no es una garantía de calidad de la respuesta. Sin embargo, es un diagnóstico de recuperación útil que una aplicación o agente puede combinar con puntuaciones, citas y otras comprobaciones al decidir si ampliar la consulta, recuperar de nuevo o pedir aclaración.</p>
<p>Grouping Search sigue siendo la opción adecuada cuando el objetivo es simplemente diversificar los fragmentos devueltos. Search Aggregation es útil cuando el sistema necesita la distribución en sí.</p>
<h3 id="E-commerce-and-content-recommendation-return-facets-with-the-search" class="common-anchor-header">Comercio electrónico y recomendación de contenido: devolver facetas con la búsqueda</h3><p>La página inicial de búsqueda de productos puede recibir de Milvus buckets de marca, métricas de precio, artículos representativos y una lista de candidatos ordenada por escalares. La aplicación sigue controlando la presentación y la lógica de negocio, pero ya no necesita reconstruir semánticas básicas de buckets a partir de resultados exportados.</p>
<h3 id="Logs-and-security-combine-similarity-with-incident-distribution" class="common-anchor-header">Registros y seguridad: combinar similitud con distribución de incidentes</h3><p>La búsqueda por similitud puede encontrar eventos relacionados con una línea de registro sospechosa. Search Aggregation puede entonces mostrar qué hosts dominan esos candidatos, la marca de tiempo mínima y máxima en cada bucket de host, o cómo se dividen los candidatos por severidad y servicio.</p>
<p>El resultado sigue siendo una vista de candidatos recuperados, no un recuento global exacto de incidentes. Cuando la investigación necesita recuentos exactos sobre cada evento que coincide con un filtro, la agregación de consultas proporciona esa segunda ruta.</p>
<h3 id="Operations-and-data-exploration-calculate-instead-of-export" class="common-anchor-header">Operaciones y exploración de datos: calcular en lugar de exportar</h3><p>Los paneles y las herramientas administrativas pueden ejecutar recuentos y promedios exactos sobre filas filtradas, y luego explorar las entidades subyacentes en un orden escalar definido. Eso elimina muchas utilidades puntuales de “exportar, calcular y ordenar” sin pretender que Milvus se haya convertido en una base de datos analítica completa.</p>
<h2 id="Boundaries-what-aggregation-and-ORDER-BY-do-not-replace" class="common-anchor-header">Límites: lo que la agregación y <code translate="no">ORDER BY</code> no reemplazan<button data-href="#Boundaries-what-aggregation-and-ORDER-BY-do-not-replace" class="anchor-icon" translate="no">
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
    </button></h2><p>Estas funciones amplían el motor de recuperación; no convierten Milvus en un sistema de procesamiento analítico en línea (OLAP).</p>
<ul>
<li>La agregación de consultas admite agrupación más <code translate="no">count</code>, <code translate="no">sum</code>, <code translate="no">avg</code>, <code translate="no">min</code> y <code translate="no">max</code>. No añade joins, funciones de ventana ni subconsultas complejas. Los trabajos analíticos offline de gran tamaño siguen perteneciendo a sistemas como Spark, que pueden trabajar con instantáneas de Milvus 3.0 y rutas de almacenamiento compartidas.</li>
<li>Las claves de grupo de consulta admiten campos enteros, <code translate="no">VARCHAR</code> y <code translate="no">TIMESTAMPTZ</code>. Las claves de bucket de Search Aggregation admiten además campos booleanos. Los valores de punto flotante, vector, JSON y array no son claves de bucket.</li>
<li>Para Search Aggregation, <code translate="no">count</code> acepta <code translate="no">&quot;*&quot;</code> o una fuente no JSON y no dinámica; <code translate="no">sum</code> y <code translate="no">avg</code> requieren fuentes numéricas; y <code translate="no">min</code> y <code translate="no">max</code> también admiten fuentes de cadena y <code translate="no">TIMESTAMPTZ</code>. La agregación de consultas sigue los mismos límites de tipos aritméticos. Consulte la guía de la API antes de aplicar un agregado a un tipo de campo complejo.</li>
<li>La agregación de consultas puede ordenar la salida agrupada por claves de grupo, mientras que ordenar por un agregado calculado como <code translate="no">count(*)</code> sigue siendo un límite actual. Sin un orden explícito, el orden de los grupos no está garantizado.</li>
<li>Search Aggregation no puede combinarse actualmente con Hybrid Search, Grouping Search, Search Iterators, un desplazamiento distinto de cero o resaltado en la misma solicitud.</li>
<li>Los recuentos y las métricas de Search Aggregation describen candidatos ANN retenidos, no la colección completa ni cada entidad que podría ser semánticamente relevante.</li>
<li>La búsqueda <code translate="no">ORDER BY</code> cambia la presentación de candidatos. No repara candidatos ANN omitidos ni convierte la recuperación por similitud en una consulta escalar Top-N exacta.</li>
</ul>
<p>La forma más clara de elegir entre las nuevas primitivas es empezar por la pregunta:</p>
<ul>
<li>Para estadísticas exactas sobre filas visibles filtradas, use la agregación de consultas.</li>
<li>Para una distribución sobre candidatos de recuperación por similitud, use Search Aggregation.</li>
<li>Para una lista clasificada diversa, use Grouping Search.</li>
<li>Para un orden escalar definido, use consulta o búsqueda <code translate="no">ORDER BY</code> según qué ruta haya establecido el conjunto de resultados.</li>
</ul>
<h2 id="From-candidate-lists-to-structured-results" class="common-anchor-header">De listas de candidatos a resultados estructurados<button data-href="#From-candidate-lists-to-structured-results" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Las bases de datos vectoriales han optimizado tradicionalmente una pregunta: ¿qué K entidades están más cerca de este vector?</strong></p>
<p>Los sistemas de recuperación de producción hacen preguntas de seguimiento de inmediato. ¿Qué grupos dominan el resultado? ¿Cuáles son sus recuentos y rangos? ¿Qué ejemplos representan a cada grupo? ¿En qué orden de negocio debe la aplicación presentar las filas o los candidatos?</p>
<p>Milvus 3.0 incorpora esas operaciones al mismo motor que posee los datos, el límite de candidatos ANN y las semánticas de visibilidad. La agregación de consultas realiza una reducción distribuida exacta sobre filas visibles. Search Aggregation crea una vista en buckets sobre candidatos ANN retenidos. <code translate="no">ORDER BY</code> da a las rutas de consulta y búsqueda un orden escalar del lado del servidor sin pedir a la aplicación que lo reconstruya página por página.</p>
<p>El resultado no es un motor OLAP oculto dentro de una base de datos vectorial. Es un motor de recuperación que puede devolver más de la estructura que las aplicaciones realmente necesitan.</p>
<h2 id="Try-aggregation-and-ORDER-BY-in-Milvus-30" class="common-anchor-header">Pruebe la agregación y <code translate="no">ORDER BY</code> en Milvus 3.0<button data-href="#Try-aggregation-and-ORDER-BY-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 ya está disponible. Use la <a href="https://milvus.io/docs/get-and-scalar-query.md">guía de consultas</a> para agregación exacta y ordenación de consultas, la <a href="https://milvus.io/docs/search-aggregation.md">guía de Search Aggregation</a> para semánticas y límites de buckets, la <a href="https://milvus.io/docs/single-vector-search.md">guía de búsqueda vectorial básica</a> para ordenación de búsqueda, y la <a href="https://milvus.io/docs/grouping-search.md">guía de Grouping Search</a> cuando su objetivo principal sea la diversidad de resultados.</p>
<p>Para la versión más amplia, consulte el <a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">blog de lanzamiento de Milvus 3.0</a>, las <a href="https://milvus.io/docs/release_notes.md">notas de la versión de Milvus 3.0</a> y el <a href="https://github.com/milvus-io/milvus">repositorio milvus-io/milvus</a>.</p>
<p>Si desea evaluar las mismas API sin operar usted mismo el clúster, pruébelas en <a href="https://cloud.zilliz.com">Zilliz Cloud</a>. La <a href="https://docs.zilliz.com/reference/python/python/Vector-query">referencia actual de consultas de Zilliz Cloud</a> y la <a href="https://docs.zilliz.com/reference/python/python/Vector-search">referencia de búsqueda</a> describen la disponibilidad y los parámetros para tipos de clúster gestionados.</p>
<p>Para hablar con el equipo sobre una carga de trabajo o un caso límite, únase a la <a href="https://discord.com/invite/8uyFbECzPX">comunidad de Milvus en Discord</a> o reserve una <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting">sesión de Milvus Office Hours</a>.</p>
