---
id: 2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md
title: Utilización
author: Lichen Wang
date: 2022-02-07T00:00:00.000Z
desc: >-
  El diseño cardinal de la función de borrado de Milvus 2.0, la base de datos
  vectorial más avanzada del mundo.
cover: assets.zilliz.com/Delete_9f40bbfa94.png
tag: Engineering
---
<custom-h1>Cómo Milvus elimina datos de flujo en un clúster distribuido</custom-h1><p>Con un procesamiento unificado de lotes y flujos y una arquitectura nativa en la nube, Milvus 2.0 plantea un reto mayor que su predecesor durante el desarrollo de la función DELETE. Gracias a su avanzado diseño de desagregación almacenamiento-computación y al flexible mecanismo de publicación/suscripción, nos enorgullece anunciar que lo hemos conseguido. En Milvus 2.0, puede eliminar una entidad de una colección determinada con su clave primaria, de modo que la entidad eliminada ya no aparecerá en el resultado de una búsqueda o una consulta.</p>
<p>Tenga en cuenta que la operación DELETE en Milvus se refiere a la eliminación lógica, mientras que la limpieza física de datos se produce durante la compactación de datos. El borrado lógico no sólo aumenta enormemente el rendimiento de la búsqueda limitada por la velocidad de E/S, sino que también facilita la recuperación de datos. Los datos borrados lógicamente aún pueden recuperarse con la ayuda de la función Time Travel.</p>
<h2 id="Usage" class="common-anchor-header">Utilización<button data-href="#Usage" class="anchor-icon" translate="no">
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
    </button></h2><p>Probemos primero la función DELETE en Milvus 2.0. (El siguiente ejemplo utiliza PyMilvus 2.0.0 en Milvus 2.0.0).</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, utility, Collection, DataType, FieldSchema, CollectionSchema
<span class="hljs-comment"># Connect to Milvus</span>
connections.connect(
    alias=<span class="hljs-string">&quot;default&quot;</span>, 
    host=<span class="hljs-string">&#x27;x.x.x.x&#x27;</span>, 
    port=<span class="hljs-string">&#x27;19530&#x27;</span>
)
<span class="hljs-comment"># Create a collection with Strong Consistency level</span>
pk_field = FieldSchema(
    name=<span class="hljs-string">&quot;id&quot;</span>, 
    dtype=DataType.INT64, 
    is_primary=<span class="hljs-literal">True</span>, 
)
vector_field = FieldSchema(
    name=<span class="hljs-string">&quot;vector&quot;</span>, 
    dtype=DataType.FLOAT_VECTOR, 
    dim=<span class="hljs-number">2</span>
)
schema = CollectionSchema(
    fields=[pk_field, vector_field], 
    description=<span class="hljs-string">&quot;Test delete&quot;</span>
)
collection_name = <span class="hljs-string">&quot;test_delete&quot;</span>
collection = Collection(
    name=collection_name, 
    schema=schema, 
    using=<span class="hljs-string">&#x27;default&#x27;</span>, 
    shards_num=<span class="hljs-number">2</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
<span class="hljs-comment"># Insert randomly generated vectors</span>
<span class="hljs-keyword">import</span> random
data = [
    [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">100</span>)],
    [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">100</span>)],
]
collection.insert(data)
<span class="hljs-comment"># Query to make sure the entities to delete exist</span>
collection.load()
expr = <span class="hljs-string">&quot;id in [2,4,6,8,10]&quot;</span>
pre_del_res = collection.query(
    expr,
    output_fields = [<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>]
)
<span class="hljs-built_in">print</span>(pre_del_res)
<span class="hljs-comment"># Delete the entities with the previous expression</span>
collection.delete(expr)
<span class="hljs-comment"># Query again to check if the deleted entities exist</span>
post_del_res = collection.query(
    expr,
    output_fields = [<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>]
)
<span class="hljs-built_in">print</span>(post_del_res)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Implementation" class="common-anchor-header">Implementación<button data-href="#Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>En una instancia de Milvus, un nodo de datos es el principal responsable de empaquetar los datos de flujo (registros en el corredor de registros) como datos históricos (instantáneas de registros) y de volcarlos automáticamente al almacenamiento de objetos. Un nodo de consulta ejecuta las peticiones de búsqueda sobre los datos completos, es decir, tanto los datos de flujo como los históricos.</p>
<p>Para aprovechar al máximo la capacidad de escritura de datos de los nodos paralelos de un clúster, Milvus adopta una estrategia de fragmentación basada en hash de clave primaria para distribuir las operaciones de escritura uniformemente entre los distintos nodos de trabajo. Es decir, el proxy dirigirá los mensajes del Lenguaje de Manipulación de Datos (DML) (es decir, las solicitudes) de una entidad al mismo nodo de datos y nodo de consulta. Estos mensajes se publican a través del DML-Channel y son consumidos por el nodo de datos y el nodo de consulta por separado para proporcionar servicios de búsqueda y consulta conjuntamente.</p>
<h3 id="Data-node" class="common-anchor-header">Nodo de datos</h3><p>Una vez recibidos los mensajes INSERT de datos, el nodo de datos inserta los datos en un segmento creciente, que es un nuevo segmento creado para recibir datos de flujo en memoria. Si el recuento de filas de datos o la duración del segmento creciente alcanza el umbral, el nodo de datos lo sella para impedir la entrada de datos. A continuación, el nodo de datos vacía el segmento sellado, que contiene los datos históricos, en el almacenamiento de objetos. Mientras tanto, el nodo de datos genera un filtro bloom basado en las claves primarias de los nuevos datos, y lo descarga en el almacenamiento de objetos junto con el segmento sellado, guardando el filtro bloom como parte del registro binario de estadísticas (binlog), que contiene la información estadística del segmento.</p>
<blockquote>
<p>Un filtro bloom es una estructura de datos probabilística que consta de un vector binario largo y una serie de funciones de asignación aleatoria. Se puede utilizar para comprobar si un elemento es miembro de un conjunto, pero puede devolver falsos positivos.           -- Wikipedia</p>
</blockquote>
<p>Cuando llegan mensajes DELETE de datos, el nodo de datos almacena en la memoria intermedia todos los filtros bloom del fragmento correspondiente y los compara con las claves primarias proporcionadas en los mensajes para recuperar todos los segmentos (tanto de los crecientes como de los sellados) que posiblemente incluyan las entidades a eliminar. Una vez localizados los segmentos correspondientes, el nodo de datos los almacena en memoria para generar los binlogs Delta que registran las operaciones de borrado y, a continuación, los descarga junto con los segmentos en el almacén de objetos.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_node_2397ad70c3.png" alt="Data Node" class="doc-image" id="data-node" />
   </span> <span class="img-wrapper"> <span>Nodo de datos</span> </span></p>
<p>Dado que un fragmento sólo tiene asignado un canal DML, los nodos de consulta adicionales que se añadan al clúster no podrán suscribirse al canal DML. Para garantizar que todos los nodos de consulta puedan recibir los mensajes DELETE, los nodos de datos filtran los mensajes DELETE del DML-Channel y los reenvían al Delta-Channel para notificar las operaciones de eliminación a todos los nodos de consulta.</p>
<h3 id="Query-node" class="common-anchor-header">Nodo de consulta</h3><p>Al cargar una colección desde el almacenamiento de objetos, el nodo de consulta obtiene primero el punto de control de cada fragmento, que marca las operaciones DML desde la última operación de vaciado. Basándose en el punto de control, el nodo de consulta carga todos los segmentos sellados junto con sus filtros binlog y bloom Delta. Con todos los datos cargados, el nodo de consulta se suscribe a DML-Channel, Delta-Channel y Query-Channel.</p>
<p>Si llegan más mensajes INSERT de datos después de que la colección se haya cargado en memoria, el nodo de consulta señala primero los segmentos crecientes según los mensajes y actualiza los filtros bloom correspondientes en memoria sólo para fines de consulta. Estos filtros bloom dedicados a la consulta no se vaciarán en el almacenamiento de objetos una vez finalizada la consulta.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_node_a78b1d664f.png" alt="Query Node" class="doc-image" id="query-node" />
   </span> <span class="img-wrapper"> <span>Nodo de consulta</span> </span></p>
<p>Como se ha mencionado anteriormente, sólo un cierto número de nodos de consulta pueden recibir mensajes DELETE del canal DML, lo que significa que sólo ellos pueden ejecutar las peticiones DELETE en segmentos crecientes. Los nodos de consulta que se han suscrito al canal DML filtran primero los mensajes DELETE en los segmentos crecientes, localizan las entidades haciendo coincidir las claves primarias proporcionadas con los filtros bloom dedicados a la consulta de los segmentos crecientes y, a continuación, registran las operaciones de eliminación en los segmentos correspondientes.</p>
<p>Los nodos de consulta que no pueden suscribirse al canal DML sólo pueden procesar solicitudes de búsqueda o consulta en segmentos sellados, ya que sólo pueden suscribirse al canal Delta y recibir los mensajes DELETE enviados por los nodos de datos. Una vez recogidos todos los mensajes DELETE en los segmentos sellados del Delta-Channel, los nodos de consulta localizan las entidades haciendo coincidir las claves primarias proporcionadas con los filtros bloom de los segmentos sellados y, a continuación, registran las operaciones de eliminación en los segmentos correspondientes.</p>
<p>Finalmente, en una búsqueda o consulta, los nodos de consulta generan un conjunto de bits basado en los registros de borrado para omitir las entidades borradas, y buscan entre las entidades restantes de todos los segmentos, independientemente del estado del segmento. Por último, el nivel de coherencia afecta a la visibilidad de los datos eliminados. En el nivel de consistencia fuerte (como se muestra en el ejemplo de código anterior), las entidades eliminadas son invisibles inmediatamente después de la eliminación. Mientras se adopta el Nivel de Consistencia Limitado, habrá varios segundos de latencia antes de que las entidades borradas se vuelvan invisibles.</p>
<h2 id="Whats-next" class="common-anchor-header">¿Y ahora qué?<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>En el blog de la serie de nuevas funciones 2.0, pretendemos explicar el diseño de las nuevas funciones. Más información en esta serie de blogs</p>
<ul>
<li><a href="https://milvus.io/blog/2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md">Cómo Milvus elimina los datos en streaming en un clúster distribuido</a></li>
<li><a href="https://milvus.io/blog/2022-2-21-compact.md">¿Cómo compactar datos en Milvus?</a></li>
<li><a href="https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md">¿Cómo equilibra Milvus la carga de consultas entre nodos?</a></li>
<li><a href="https://milvus.io/blog/2022-2-14-bitset.md">Cómo Bitset permite la versatilidad de la búsqueda de similitud vectorial</a></li>
</ul>
