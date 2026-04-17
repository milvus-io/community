---
id: in-memory-replicas.md
title: >-
  Aumente el rendimiento de lectura de su base de datos vectorial con réplicas
  en memoria
author: Congqi Xia
date: 2022-08-22T00:00:00.000Z
desc: >-
  Utilice réplicas en memoria para mejorar el rendimiento de lectura y la
  utilización de los recursos de hardware.
cover: assets.zilliz.com/in_memory_replica_af1fa21d61.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/in-memory-replicas.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/in_memory_replica_af1fa21d61.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>Imagen_de_portada</span> </span></p>
<blockquote>
<p>Este artículo ha sido escrito por <a href="https://github.com/congqixia">Congqi Xia</a> y <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Con su lanzamiento oficial, Milvus 2.1 viene con muchas características nuevas para proporcionar comodidad y una mejor experiencia de usuario. Aunque el concepto de réplica en memoria no es nada nuevo en el mundo de las bases de datos distribuidas, es una característica crítica que puede ayudarle a aumentar el rendimiento del sistema y mejorar la disponibilidad del sistema sin esfuerzo. Por lo tanto, este post se propone explicar qué es la réplica en memoria y por qué es importante, y luego presenta cómo habilitar esta nueva característica en Milvus, una base de datos vectorial para IA.</p>
<p><strong>Ir a:</strong></p>
<ul>
<li><p><a href="#Concepts-related-to-in-memory-replica">Conceptos relacionados con la réplica en memoria</a></p></li>
<li><p><a href="#What-is-in-memory-replica">¿Qué es la réplica en memoria?</a></p></li>
<li><p><a href="#Why-are-in-memory-replicas-important">¿Por qué son importantes las réplicas en memoria?</a></p></li>
<li><p><a href="#Enable-in-memory-replicas-in-the-Milvus-vector-database">Habilitar réplicas en memoria en la base de datos vectorial Milvus</a></p></li>
</ul>
<h2 id="Concepts-related-to-in-memory-replica" class="common-anchor-header">Conceptos relacionados con la réplica en memoria<button data-href="#Concepts-related-to-in-memory-replica" class="anchor-icon" translate="no">
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
    </button></h2><p>Antes de saber qué es la réplica en memoria y por qué es importante, necesitamos entender primero algunos conceptos relevantes, incluyendo grupo de réplica, réplica de fragmento, réplica de flujo, réplica histórica y líder de fragmento. La siguiente imagen ilustra estos conceptos.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/diagram_1_525afc706a.jpg" alt="Replica_concepts" class="doc-image" id="replica_concepts" />
   </span> <span class="img-wrapper"> <span>Conceptos_de_réplica</span> </span></p>
<h3 id="Replica-group" class="common-anchor-header">Grupo de réplica</h3><p>Un grupo de réplica consiste en múltiples <a href="https://milvus.io/docs/v2.1.x/four_layers.md#Query-node">nodos de consulta</a> que son responsables de manejar datos históricos y réplicas.</p>
<h3 id="Shard-replica" class="common-anchor-header">Réplica de fragmentos</h3><p>Una réplica de fragmento consta de una réplica de flujo y una réplica histórica, ambas pertenecientes al mismo <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Shard">fragmento</a> (es decir, canal DML). Varias réplicas de fragmentos forman un grupo de réplicas. El número exacto de réplicas de fragmentos de un grupo de réplicas viene determinado por el número de fragmentos de una colección específica.</p>
<h3 id="Streaming-replica" class="common-anchor-header">Réplica de flujo</h3><p>Una réplica de streaming contiene todos los <a href="https://milvus.io/docs/v2.1.x/glossary.md#Segment">segmentos crecientes</a> del mismo canal DML. Técnicamente hablando, una réplica de streaming debe ser servida por un único nodo de consulta en una réplica.</p>
<h3 id="Historical-replica" class="common-anchor-header">Réplica histórica</h3><p>Una réplica histórica contiene todos los segmentos sellados del mismo canal DML. Los segmentos sellados de una réplica histórica pueden distribuirse en varios nodos de consulta dentro del mismo grupo de réplica.</p>
<h3 id="Shard-leader" class="common-anchor-header">Líder de fragmentos</h3><p>Un líder de fragmento es el nodo de consulta que sirve la réplica de flujo en una réplica de fragmento.</p>
<h2 id="What-is-in-memory-replica" class="common-anchor-header">¿Qué es la réplica en memoria?<button data-href="#What-is-in-memory-replica" class="anchor-icon" translate="no">
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
    </button></h2><p>Activar las réplicas en memoria le permite cargar los datos de una colección en varios nodos de consulta para que pueda aprovechar los recursos adicionales de CPU y memoria. Esta característica es muy útil si tiene un conjunto de datos relativamente pequeño pero desea aumentar el rendimiento de lectura y mejorar la utilización de los recursos de hardware.</p>
<p>Por ahora, la base de datos vectorial de Milvus mantiene una réplica para cada segmento en memoria. Sin embargo, con las réplicas en memoria, puede tener múltiples réplicas de un segmento en diferentes nodos de consulta. Esto significa que si un nodo de consulta está realizando una búsqueda en un segmento, una nueva solicitud de búsqueda entrante puede asignarse a otro nodo de consulta inactivo, ya que este nodo de consulta tiene una réplica de exactamente el mismo segmento.</p>
<p>Además, si disponemos de varias réplicas en memoria, podemos hacer frente mejor a la situación en la que un nodo de consulta se bloquea. Antes, teníamos que esperar a que se recargara el segmento para continuar y buscar en otro nodo de consulta. Sin embargo, con la replicación en memoria, la petición de búsqueda puede reenviarse a un nuevo nodo de consulta inmediatamente sin tener que volver a cargar los datos.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/replication_3_1_2c25513cb9.jpg" alt="Replication" class="doc-image" id="replication" />
   </span> <span class="img-wrapper"> <span>Replicación</span> </span></p>
<h2 id="Why-are-in-memory-replicas-important" class="common-anchor-header">¿Por qué son importantes las réplicas en memoria?<button data-href="#Why-are-in-memory-replicas-important" class="anchor-icon" translate="no">
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
    </button></h2><p>Una de las ventajas más significativas de habilitar las réplicas en memoria es el aumento del QPS (consulta por segundo) y del rendimiento globales. Además, se pueden mantener múltiples réplicas de segmentos y el sistema es más resistente ante una conmutación por error.</p>
<h2 id="Enable-in-memory-replicas-in-the-Milvus-vector-database" class="common-anchor-header">Habilitar las réplicas en memoria en la base de datos vectorial Milvus<button data-href="#Enable-in-memory-replicas-in-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Habilitar la nueva función de réplicas en memoria no supone ningún esfuerzo en la base de datos vectorial Milvus. Todo lo que necesita hacer es simplemente especificar el número de réplicas que desea al cargar una colección (es decir, llamando a <code translate="no">collection.load()</code>).</p>
<p>En el siguiente tutorial de ejemplo, suponemos que ya ha <a href="https://milvus.io/docs/v2.1.x/create_collection.md">creado una colección</a> llamada "libro" y ha <a href="https://milvus.io/docs/v2.1.x/insert_data.md">insertado datos</a> en ella. Entonces puede ejecutar el siguiente comando para crear dos réplicas al <a href="https://milvus.io/docs/v2.1.x/load_collection.md">cargar</a> una colección de libros.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> Collection
collection = Collection(<span class="hljs-string">&quot;book&quot;</span>)      <span class="hljs-comment"># Get an existing collection.</span>
collection.load(replica_number=<span class="hljs-number">2</span>) <span class="hljs-comment"># load collection as 2 replicas</span>
<button class="copy-code-btn"></button></code></pre>
<p>Puede modificar de forma flexible el número de réplicas en el código de ejemplo anterior para que se adapte mejor al escenario de su aplicación. A continuación, puede realizar directamente una <a href="https://milvus.io/docs/v2.1.x/search.md">búsqueda</a> o <a href="https://milvus.io/docs/v2.1.x/query.md">consulta</a> de similitud vectorial en varias réplicas sin ejecutar ningún comando adicional. Sin embargo, debe tenerse en cuenta que el número máximo de réplicas permitido está limitado por la cantidad total de memoria utilizable para ejecutar los nodos de consulta. Si el número de réplicas especificado supera las limitaciones de memoria utilizable, se devolverá un error durante la carga de datos.</p>
<p>También puede comprobar la información de las réplicas en memoria que ha creado ejecutando <code translate="no">collection.get_replicas()</code>. Se devolverá la información de los grupos de réplica y los nodos de consulta y shards correspondientes. A continuación se muestra un ejemplo de la salida.</p>
<pre><code translate="no">Replica <span class="hljs-built_in">groups</span>:
- Group: &lt;group_id:435309823872729305&gt;, &lt;group_nodes:(21, 20)&gt;, &lt;shards:[Shard: &lt;channel_name:milvus-zong-rootcoord-dml_27_435367661874184193v0&gt;, &lt;shard_leader:21&gt;, &lt;shard_nodes:[21]&gt;, Shard: &lt;channel_name:milvus-zong-rootcoord-dml_28_435367661874184193v1&gt;, &lt;shard_leader:20&gt;, &lt;shard_nodes:[20, 21]&gt;]&gt;
- Group: &lt;group_id:435309823872729304&gt;, &lt;group_nodes:(25,)&gt;, &lt;shards:[Shard: &lt;channel_name:milvus-zong-rootcoord-dml_28_435367661874184193v1&gt;, &lt;shard_leader:25&gt;, &lt;shard_nodes:[25]&gt;, Shard: &lt;channel_name:milvus-zong-rootcoord-dml_27_435367661874184193v0&gt;, &lt;shard_leader:25&gt;, &lt;shard_nodes:[25]&gt;]&gt;
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-next" class="common-anchor-header">Próximos pasos<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Con el lanzamiento oficial de Milvus 2.1, hemos preparado una serie de blogs presentando las nuevas características. Lea más en esta serie de blogs:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Cómo utilizar datos de cadenas para potenciar sus aplicaciones de búsqueda por similitud</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Uso de Milvus integrado para instalar y ejecutar Milvus con Python de forma instantánea</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Aumente el rendimiento de lectura de su base de datos vectorial con réplicas en memoria</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Comprender el nivel de consistencia en la base de datos vectorial Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Comprender el nivel de consistencia en la base de datos vectorial de Milvus (Parte II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">¿Cómo Garantiza la Seguridad de los Datos la Base de Datos Vectorial de Milvus?</a></li>
</ul>
