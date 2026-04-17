---
id: milvus-boost-ranker-business-aware-vector-search.md
title: >-
  Cómo utilizar Milvus Boost Ranker para la búsqueda vectorial orientada a las
  empresas
author: Wei Zang
date: 2026-3-24
cover: >-
  assets.zilliz.com/How_to_Use_Milvus_Boost_Ranker_to_Improve_Vector_Search_Ranking_4f47a2a8c6_c3ed6feec6.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus Boost Ranker, vector search ranking, metadata reranking, Milvus 2.6'
meta_title: |
  Milvus Boost Ranker: Add Business Rules to Vector Search
desc: >-
  Descubra cómo Milvus Boost Ranker le permite superponer reglas empresariales a
  la similitud vectorial: potencie los documentos oficiales, degrade el
  contenido obsoleto y añada diversidad.
origin: 'https://milvus.io/blog/milvus-boost-ranker-business-aware-vector-search.md'
---
<p>La búsqueda vectorial ordena los resultados por similitud de incrustación: cuanto más cercanos sean los vectores, mayor será el resultado. Algunos sistemas añaden un reordenador basado en modelos (BGE, Voyage, Cohere) para mejorar la ordenación. Pero ninguno de los dos enfoques tiene en cuenta un requisito fundamental en la producción: <strong>el contexto empresarial importa tanto como la relevancia semántica, a veces más.</strong></p>
<p>Un sitio de comercio electrónico necesita mostrar primero los productos en stock de las tiendas oficiales. Una plataforma de contenidos quiere fijar anuncios recientes. Una base de conocimientos empresariales necesita que los documentos autorizados aparezcan en primer lugar. Cuando la clasificación se basa únicamente en la distancia vectorial, se ignoran estas reglas. Los resultados pueden ser relevantes, pero no apropiados.</p>
<p><strong><a href="https://milvus.io/docs/reranking.md">Boost Ranker</a></strong>, introducido en <a href="https://milvus.io/intro">Milvus</a> 2.6, resuelve este problema. Le permite ajustar la clasificación de los resultados de búsqueda utilizando reglas de metadatos, sin necesidad de reconstruir el índice ni cambiar el modelo. Este artículo explica cómo funciona, cuándo utilizarlo y cómo implementarlo con código.</p>
<h2 id="What-Is-Boost-Ranker" class="common-anchor-header">¿Qué es Boost Ranker?<button data-href="#What-Is-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Boost Ranker es una función ligera de reordenación basada en reglas de Milvus 2.6.2</strong> que ajusta los resultados de <a href="https://zilliz.com/learn/vector-similarity-search">búsqueda vectoriales</a> utilizando campos de metadatos escalares. A diferencia de los reordenadores basados en modelos que llaman a LLM externos o a servicios de incrustación, Boost Ranker funciona completamente dentro de Milvus utilizando simples reglas de filtrado y ponderación. Sin dependencias externas, con una sobrecarga de latencia mínima - adecuado para el uso en tiempo real.</p>
<p>Se configura a través de la <a href="https://milvus.io/docs/manage-functions.md">API de funciones</a>. Después de que la búsqueda vectorial devuelva un conjunto de candidatos, Boost Ranker aplica tres operaciones:</p>
<ol>
<li><strong>Filter:</strong> identifica los resultados que coinciden con condiciones específicas (por ejemplo, <code translate="no">is_official == true</code>)</li>
<li><strong>Boost:</strong> multiplica sus puntuaciones por un peso configurado</li>
<li><strong>Mezclar:</strong> añadir opcionalmente un pequeño factor aleatorio (0-1) para introducir diversidad.</li>
</ol>
<h3 id="How-It-Works-Under-the-Hood" class="common-anchor-header">Cómo funciona</h3><p>Boost Ranker se ejecuta dentro de Milvus como un paso de post-procesamiento:</p>
<ol>
<li><strong>Búsqueda vectorial</strong>: cada segmento devuelve candidatos con ID, puntuaciones de similitud y metadatos.</li>
<li><strong>Aplicar reglas</strong>: el sistema filtra los registros coincidentes y ajusta sus puntuaciones utilizando el peso configurado y <code translate="no">random_score</code> opcional.</li>
<li><strong>Combinar y ordenar</strong>: todos los candidatos se combinan y se vuelven a ordenar por puntuaciones actualizadas para obtener los resultados finales Top-K.</li>
</ol>
<p>Como Boost Ranker sólo funciona con los candidatos ya recuperados, y no con el conjunto de datos completo, el coste computacional adicional es insignificante.</p>
<h2 id="When-Should-You-Use-Boost-Ranker" class="common-anchor-header">¿Cuándo utilizar Boost Ranker?<button data-href="#When-Should-You-Use-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Boosting-Important-Results" class="common-anchor-header">Potenciación de resultados importantes</h3><p>El caso de uso más común: superponer reglas de negocio sencillas a la búsqueda semántica.</p>
<ul>
<li><strong>Comercio electrónico:</strong> impulsar productos de tiendas insignia, vendedores oficiales o promociones de pago. Aumente las ventas recientes o el porcentaje de clics.</li>
<li><strong>Plataformas de contenido:</strong> priorice el contenido publicado recientemente a través de un campo <code translate="no">publish_time</code>, o potencie las publicaciones de cuentas verificadas.</li>
<li><strong>Búsqueda empresarial:</strong> dé mayor prioridad a los documentos en los que <code translate="no">doctype == &quot;policy&quot;</code> o <code translate="no">is_canonical == true</code>.</li>
</ul>
<p>Todo configurable con un filtro + peso. Sin cambios en el modelo de incrustación ni reconstrucciones del índice.</p>
<h3 id="Demoting-Without-Removing" class="common-anchor-header">Degradar sin eliminar</h3><p>Boost Ranker también puede bajar la clasificación de determinados resultados: una alternativa más suave al filtrado duro.</p>
<ul>
<li><strong>Productos de bajo stock:</strong> si <code translate="no">stock &lt; 10</code>, reduce su peso ligeramente. Seguirán siendo localizables, pero no dominarán las primeras posiciones.</li>
<li><strong>Contenido sensible:</strong> reducir el peso del contenido marcado en lugar de eliminarlo por completo. Limita la exposición sin censura dura.</li>
<li><strong>Documentos obsoletos:</strong> los documentos de <code translate="no">year &lt; 2020</code> se clasifican peor para que el contenido más reciente aparezca primero.</li>
</ul>
<p>Los usuarios aún pueden encontrar los resultados degradados desplazándose o buscando con más precisión, pero no desplazarán a los contenidos más relevantes.</p>
<h3 id="Adding-Diversity-with-Controlled-Randomness" class="common-anchor-header">Añadir diversidad con aleatoriedad controlada</h3><p>Cuando muchos resultados tienen puntuaciones similares, el Top-K puede parecer idéntico en todas las consultas. El parámetro <code translate="no">random_score</code> de Boost Ranker introduce una ligera variación:</p>
<pre><code translate="no" class="language-json"><span class="hljs-string">&quot;random_score&quot;</span>: {
  <span class="hljs-string">&quot;seed&quot;</span>: <span class="hljs-number">126</span>,
  <span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;id&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">seed</code>Controla la aleatoriedad general para la reproducibilidad.</li>
<li><code translate="no">field</code>Por lo general, la clave principal <code translate="no">id</code> garantiza que el mismo registro reciba siempre el mismo valor aleatorio.</li>
</ul>
<p>Esto es útil para <strong>diversificar las recomendaciones</strong> (evitando que los mismos elementos aparezcan siempre en primer lugar) y <strong>la exploración</strong> (combinando ponderaciones comerciales fijas con pequeñas perturbaciones aleatorias).</p>
<h3 id="Combining-Boost-Ranker-with-Other-Rankers" class="common-anchor-header">Combinar Boost Ranker con otros Rankers</h3><p>Boost Ranker se configura a través de la API de funciones con <code translate="no">params.reranker = &quot;boost&quot;</code>. Dos cosas que hay que saber sobre su combinación</p>
<ul>
<li><strong>Limitación:</strong> en la búsqueda híbrida (multivectorial), Boost Ranker no puede ser el ranker de nivel superior. Pero puede utilizarse dentro de cada <code translate="no">AnnSearchRequest</code> individual para ajustar los resultados antes de fusionarlos.</li>
<li><strong>Combinaciones habituales:</strong><ul>
<li><strong>RRF + Bo</strong> ost<strong>:</strong> utiliza RRF para fusionar resultados multimodales y, a continuación, aplica Boost para el ajuste basado en metadatos.</li>
<li>Clasificador de<strong>modelos + Boost:</strong> utilice un clasificador basado en modelos para la calidad semántica y, a continuación, Boost para las reglas de negocio.</li>
</ul></li>
</ul>
<h2 id="How-to-Configure-Boost-Ranker" class="common-anchor-header">Cómo configurar Boost Ranker<button data-href="#How-to-Configure-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><p>Boost Ranker se configura a través de la API de funciones. Para una lógica más compleja, combínelo con <code translate="no">FunctionScore</code> para aplicar varias reglas a la vez.</p>
<h3 id="Required-Fields" class="common-anchor-header">Campos obligatorios</h3><p>Al crear un objeto <code translate="no">Function</code>:</p>
<ul>
<li><code translate="no">name</code>: cualquier nombre personalizado</li>
<li><code translate="no">input_field_names</code>: debe ser una lista vacía <code translate="no">[]</code></li>
<li><code translate="no">function_type</code>: debe ser <code translate="no">FunctionType.RERANK</code></li>
<li><code translate="no">params.reranker</code>debe ser <code translate="no">&quot;boost&quot;</code></li>
</ul>
<h3 id="Key-Parameters" class="common-anchor-header">Parámetros clave</h3><p><strong><code translate="no">params.weight</code> (obligatorio)</strong></p>
<p>El multiplicador aplicado a las puntuaciones de los registros coincidentes. La forma de establecerlo depende de la métrica:</p>
<table>
<thead>
<tr><th>Tipo de métrica</th><th>Aumentar resultados</th><th>Reducir resultados</th></tr>
</thead>
<tbody>
<tr><td>Más alto es mejor (COSINE, IP)</td><td><code translate="no">weight &gt; 1</code></td><td><code translate="no">weight &lt; 1</code></td></tr>
<tr><td>Más bajo es mejor (L2/Euclídeo)</td><td><code translate="no">weight &lt; 1</code></td><td><code translate="no">weight &gt; 1</code></td></tr>
</tbody>
</table>
<p><strong><code translate="no">params.filter</code> (opcional)</strong></p>
<p>Condición que selecciona los registros cuyas puntuaciones se ajustan:</p>
<ul>
<li><code translate="no">&quot;doctype == 'abstract'&quot;</code></li>
<li><code translate="no">&quot;is_premium == true&quot;</code></li>
<li><code translate="no">&quot;views &gt; 1000 and category == 'tech'&quot;</code></li>
</ul>
<p>Sólo los registros coincidentes se ven afectados. Todo lo demás mantiene su puntuación original.</p>
<p><strong><code translate="no">params.random_score</code> (opcional)</strong></p>
<p>Añade un valor aleatorio entre 0 y 1 para la diversidad. Para más detalles, consulte la sección sobre aleatoriedad.</p>
<h3 id="Single-vs-Multiple-Rules" class="common-anchor-header">Reglas únicas frente a reglas múltiples</h3><p><strong>Regla única</strong> - cuando tiene una restricción de negocio (por ejemplo, potenciar los documentos oficiales), pase el clasificador directamente a <code translate="no">search(..., ranker=ranker)</code>.</p>
<p><strong>Reglas múltiples</strong> - cuando necesite varias restricciones (priorizar artículos en stock + degradar productos con baja calificación + añadir aleatoriedad), cree múltiples objetos <code translate="no">Function</code> y combínelos con <code translate="no">FunctionScore</code>. Usted configura:</p>
<ul>
<li><code translate="no">boost_mode</code>: cómo se combina cada regla con la puntuación original (<code translate="no">multiply</code> o <code translate="no">add</code>)</li>
<li><code translate="no">function_mode</code>cómo se combinan varias reglas entre sí (<code translate="no">multiply</code> o <code translate="no">add</code>).</li>
</ul>
<h2 id="Hands-On-Prioritizing-Official-Documents" class="common-anchor-header">Práctica: Priorización de documentos oficiales<button data-href="#Hands-On-Prioritizing-Official-Documents" class="anchor-icon" translate="no">
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
    </button></h2><p>Veamos un ejemplo concreto: hacer que los documentos oficiales tengan un rango más alto en un sistema de búsqueda de documentos.</p>
<h3 id="Schema" class="common-anchor-header">Esquema</h3><p>Una colección llamada <code translate="no">milvus_collection</code> con estos campos:</p>
<table>
<thead>
<tr><th>Campo</th><th>Tipo</th><th>Propósito</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">id</code></td><td>INT64</td><td>Clave principal</td></tr>
<tr><td><code translate="no">content</code></td><td>VARCHAR</td><td>Texto del documento</td></tr>
<tr><td><code translate="no">embedding</code></td><td>VECTOR_FLOAT (3072)</td><td>Vector semántico</td></tr>
<tr><td><code translate="no">source</code></td><td>VARCHAR</td><td>Origen: &quot;oficial&quot;, &quot;comunidad&quot; o &quot;ticket</td></tr>
<tr><td><code translate="no">is_official</code></td><td>BOOL</td><td><code translate="no">True</code> si <code translate="no">source == &quot;official&quot;</code></td></tr>
</tbody>
</table>
<p>Los campos <code translate="no">source</code> y <code translate="no">is_official</code> son los metadatos que Boost Ranker utilizará para ajustar las clasificaciones.</p>
<h3 id="Setup-Code" class="common-anchor-header">Código de configuración</h3><pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> (
    MilvusClient,
    DataType,
    Function,
    FunctionType,
)

<span class="hljs-comment"># 1. Connect to Milvus</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
collection_name = <span class="hljs-string">&quot;milvus_collection&quot;</span>

<span class="hljs-comment"># If it already exists, drop it first for repeated testing</span>
<span class="hljs-keyword">if</span> collection_name <span class="hljs-keyword">in</span> client.list_collections():
    client.drop_collection(collection_name)

<span class="hljs-comment"># 2. Define schema</span>
schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)

schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=DataType.INT64,
    is_primary=<span class="hljs-literal">True</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;content&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">512</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;source&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">32</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;is_official&quot;</span>,
    datatype=DataType.BOOL,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    datatype=DataType.FLOAT_VECTOR,
    dim=<span class="hljs-number">3072</span>,
)

text_embedding_function = Function(
    name=<span class="hljs-string">&quot;openai_embedding&quot;</span>,
    function_type=FunctionType.TEXTEMBEDDING,
    input_field_names=[<span class="hljs-string">&quot;content&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;embedding&quot;</span>],
    params={
        <span class="hljs-string">&quot;provider&quot;</span>: <span class="hljs-string">&quot;openai&quot;</span>,
        <span class="hljs-string">&quot;model_name&quot;</span>: <span class="hljs-string">&quot;text-embedding-3-large&quot;</span>
    }
)

schema.add_function(text_embedding_function)

<span class="hljs-comment"># 3. Create Collection</span>
client.create_collection(
    collection_name=collection_name,
    schema=schema,
)

<span class="hljs-comment"># 4. Create index</span>
index_params = client.prepare_index_params()

index_params.add_index(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;IVF_FLAT&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    params={<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">16</span>},
)

client.create_index(
    collection_name=collection_name,
    index_params=index_params,
)

<span class="hljs-comment"># 5. Load Collection into memory</span>
client.load_collection(collection_name=collection_name)

docs = [
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;How to deploy Milvus on Kubernetes (Official Guide)&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;official&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">True</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">2</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Quick deployment of Milvus with Docker Compose (Official Tutorial)&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;official&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">True</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">3</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Community experience: Lessons learned from deploying Milvus&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;community&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">False</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">4</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Ticket record: Milvus deployment issue&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;ticket&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">False</span>
    },
]

client.insert(
    collection_name=collection_name,
    data=docs,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Comparing-Results-With-and-Without-Boost-Ranker" class="common-anchor-header">Comparación de resultados: Con y sin Boost Ranker</h3><p>En primer lugar, ejecuta una búsqueda de referencia sin Boost Ranker. A continuación, añada Boost Ranker con <code translate="no">filter: is_official == true</code> y <code translate="no">weight: 1.2</code>, y compare.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># 6. Baseline search (without Boost Ranker)</span>
query_vector = <span class="hljs-string">&quot;how to deploy milvus&quot;</span>

search_params = {
    <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
    <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">2</span>},
}

results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_params=search_params,
    limit=<span class="hljs-number">4</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;is_official&quot;</span>],
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=== Baseline search (no Boost Ranker) ===&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;id=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, &quot;</span>
        <span class="hljs-string">f&quot;source=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;source&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;is_official=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;is_official&#x27;</span>]}</span>&quot;</span>
    )

<span class="hljs-comment"># 7. Define Boost Ranker: apply weight to documents where is_official == true</span>
boost_official_ranker = Function(
    name=<span class="hljs-string">&quot;boost_official&quot;</span>,
    input_field_names=[],               <span class="hljs-comment"># Boost Ranker requires this to be an empty list</span>
    function_type=FunctionType.RERANK,
    params={
        <span class="hljs-string">&quot;reranker&quot;</span>: <span class="hljs-string">&quot;boost&quot;</span>,            <span class="hljs-comment"># Specify Boost Ranker</span>
        <span class="hljs-string">&quot;filter&quot;</span>: <span class="hljs-string">&quot;is_official==true&quot;</span>,
        <span class="hljs-comment"># For COSINE / IP (higher score is better), use weight &gt; 1 to boost</span>
        <span class="hljs-string">&quot;weight&quot;</span>: <span class="hljs-number">1.2</span>
    },
)

boosted_results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_params=search_params,
    limit=<span class="hljs-number">4</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;is_official&quot;</span>],
    ranker=boost_official_ranker,
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Search with Boost Ranker (official boosted) ===&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> boosted_results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;id=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, &quot;</span>
        <span class="hljs-string">f&quot;source=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;source&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;is_official=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;is_official&#x27;</span>]}</span>&quot;</span>
    )
<button class="copy-code-btn"></button></code></pre>
<h3 id="Results" class="common-anchor-header">Resultados</h3><pre><code translate="no">=== Baseline search (no Boost Ranker) ===
<span class="hljs-built_in">id</span>=<span class="hljs-number">1</span>, score=<span class="hljs-number">0.7351</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">4</span>, score=<span class="hljs-number">0.7017</span>, source=ticket, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">3</span>, score=<span class="hljs-number">0.6706</span>, source=community, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">2</span>, score=<span class="hljs-number">0.6435</span>, source=official, is_official=<span class="hljs-literal">True</span>

=== Search <span class="hljs-keyword">with</span> Boost Ranker (official boosted) ===
<span class="hljs-built_in">id</span>=<span class="hljs-number">1</span>, score=<span class="hljs-number">0.8821</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">2</span>, score=<span class="hljs-number">0.7722</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">4</span>, score=<span class="hljs-number">0.7017</span>, source=ticket, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">3</span>, score=<span class="hljs-number">0.6706</span>, source=community, is_official=<span class="hljs-literal">False</span>
<button class="copy-code-btn"></button></code></pre>
<p>El cambio clave: el documento <code translate="no">id=2</code> (oficial) saltó del 4º al 2º puesto porque su puntuación se multiplicó por 1,2. Las entradas de la comunidad y los registros de tickets no se eliminan, sólo se clasifican peor. Ese es el objetivo de Boost Ranker: mantener la búsqueda semántica como base y, a continuación, superponer reglas de negocio.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusión<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/reranking.md">Boost Ranker</a> te ofrece una forma de inyectar lógica empresarial en los resultados de búsqueda de vectores sin tocar tus incrustaciones ni reconstruir índices. Aumente el contenido oficial, degrade los resultados obsoletos, añada diversidad controlada, todo ello mediante una sencilla configuración de filtro + peso en la <a href="https://milvus.io/docs/manage-functions.md">API Milvus Function</a>.</p>
<p>Ya sea que esté construyendo tuberías RAG, sistemas de recomendación o búsqueda empresarial, Boost Ranker ayuda a cerrar la brecha entre lo que es semánticamente similar y lo que es realmente útil para sus usuarios.</p>
<p>Si está trabajando en la clasificación de búsquedas y desea discutir su caso de uso:</p>
<ul>
<li>Únase a la <a href="https://slack.milvus.io/">comunidad Milvus Slack</a> para conectar con otros desarrolladores que crean sistemas de búsqueda y recuperación.</li>
<li><a href="https://milvus.io/office-hours">Reserve una sesión gratuita de 20 minutos de Milvus Office Hours</a> para analizar su lógica de clasificación con el equipo.</li>
<li>Si prefiere saltarse la configuración de la infraestructura, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus gestionado) tiene un nivel gratuito para empezar.</li>
</ul>
<hr>
<p>Algunas preguntas que surgen cuando los equipos comienzan a utilizar Boost Ranker:</p>
<p><strong>¿Puede Boost Ranker sustituir a un reranker basado en modelos como Cohere o BGE?</strong>Resuelven problemas diferentes. Los rerankers basados en modelos vuelven a puntuar los resultados según la calidad semántica: son buenos para decidir "qué documento responde realmente a la pregunta". Boost Ranker ajusta las puntuaciones por reglas de negocio - decide "qué documento relevante debe aparecer primero". En la práctica, a menudo se necesitan ambos: un modelo de clasificación para la relevancia semántica y Boost Ranker para la lógica empresarial.</p>
<p><strong>¿Añade Boost Ranker una latencia significativa</strong>? No. Opera sobre el conjunto de candidatos ya recuperados (normalmente el Top-K de la búsqueda vectorial), no sobre el conjunto de datos completo. Las operaciones son simples de filtrado y multiplicación, por lo que la sobrecarga es insignificante en comparación con la búsqueda vectorial en sí.</p>
<p><strong>¿Cómo establezco el valor de la ponderación</strong>? Comience con pequeños ajustes. Para la similitud COSINE (cuanto más alta, mejor), una ponderación de 1,1-1,3 suele ser suficiente para modificar notablemente las clasificaciones sin anular por completo la relevancia semántica. Pruebe con sus datos reales: si los resultados potenciados con baja similitud empiezan a dominar, reduzca la ponderación.</p>
<p><strong>¿Puedo combinar varias reglas de Boost Ranker?</strong>Sí. Crea varios objetos <code translate="no">Function</code> y combínalos utilizando <code translate="no">FunctionScore</code>. Puedes controlar cómo interactúan las reglas a través de <code translate="no">boost_mode</code> (cómo se combina cada regla con la puntuación original) y <code translate="no">function_mode</code> (cómo se combinan las reglas entre sí) - ambos soportan <code translate="no">multiply</code> y <code translate="no">add</code>.</p>
