---
id: 2022-02-28-how-milvus-balances-query-load-across-nodes.md
title: ¿Cómo equilibra Milvus la carga de consultas entre nodos?
author: Xi Ge
date: 2022-02-28T00:00:00.000Z
desc: >-
  Milvus 2.0 admite el equilibrio de carga automático entre los nodos de
  consulta.
cover: assets.zilliz.com/Load_balance_b2f35a5577.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Load_balance_b2f35a5577.png" alt="Binlog Cover Image" class="doc-image" id="binlog-cover-image" />
   </span> <span class="img-wrapper"> <span>Imagen de portada de Binlog</span> </span></p>
<p>Por <a href="https://github.com/xige-16">Xi Ge</a>.</p>
<p>En artículos anteriores del blog, hemos introducido sucesivamente las funciones Deletion, Bitset y Compaction en Milvus 2.0. Para culminar esta serie, nos gustaría compartir el diseño detrás de Load Balance, una función vital en el cluster distribuido de Milvus.</p>
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
    </button></h2><p>Mientras que el número y el tamaño de los segmentos almacenados en los nodos de consulta difieren, el rendimiento de la búsqueda en los nodos de consulta también puede variar. El peor caso podría darse cuando unos pocos nodos de consulta se agotan buscando en una gran cantidad de datos, pero los nodos de consulta recién creados permanecen inactivos porque no se les distribuye ningún segmento, lo que provoca un desperdicio masivo de recursos de CPU y una enorme caída en el rendimiento de la búsqueda.</p>
<p>Para evitar estas circunstancias, el coordinador de consultas (query coord) está programado para distribuir segmentos uniformemente a cada nodo de consulta en función del uso de RAM de los nodos. De este modo, los recursos de la CPU se consumen por igual en todos los nodos, lo que mejora significativamente el rendimiento de la búsqueda.</p>
<h3 id="Trigger-automatic-load-balance" class="common-anchor-header">Activar el equilibrio de carga automático</h3><p>De acuerdo con el valor por defecto de la configuración <code translate="no">queryCoord.balanceIntervalSeconds</code>, la coordenada de consulta comprueba el uso de RAM (en porcentaje) de todos los nodos de consulta cada 60 segundos. Si se cumple alguna de las siguientes condiciones, el coordinador de consultas comienza a equilibrar la carga de las consultas entre los nodos de consulta:</p>
<ol>
<li>El uso de RAM de cualquier nodo de consulta del clúster es superior a <code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code> (por defecto: 90);</li>
<li>O el valor absoluto de la diferencia de uso de RAM de dos nodos de consulta cualesquiera es superior a <code translate="no">queryCoord.memoryUsageMaxDifferencePercentage</code> (por defecto: 30).</li>
</ol>
<p>Una vez transferidos los segmentos del nodo de consulta de origen al nodo de consulta de destino, también deben cumplir las dos condiciones siguientes:</p>
<ol>
<li>El uso de RAM del nodo de consulta de destino no es mayor que <code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code> (por defecto: 90);</li>
<li>El valor absoluto de la diferencia de uso de RAM de los nodos de consulta de origen y destino después del equilibrado de carga es menor que antes del equilibrado de carga.</li>
</ol>
<p>Si se cumplen estas condiciones, la coordinación de consultas procede a equilibrar la carga de consultas entre los nodos.</p>
<h2 id="Load-balance" class="common-anchor-header">Equilibrio de carga<button data-href="#Load-balance" class="anchor-icon" translate="no">
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
    </button></h2><p>Cuando se activa el equilibrio de carga, el coordinador de consultas carga primero el segmento o segmentos de destino en el nodo de consulta de destino. En este punto, ambos nodos de consulta devuelven los resultados de búsqueda del segmento o segmentos de destino en cualquier solicitud de búsqueda para garantizar la integridad del resultado.</p>
<p>Después de que el nodo de consulta de destino cargue con éxito el segmento de destino, la coordenada de consulta publica un <code translate="no">sealedSegmentChangeInfo</code> en el Canal de Consulta. Como se muestra a continuación, <code translate="no">onlineNodeID</code> y <code translate="no">onlineSegmentIDs</code> indican el nodo de consulta que carga el segmento y el segmento cargado respectivamente, y <code translate="no">offlineNodeID</code> y <code translate="no">offlineSegmentIDs</code> indican el nodo de consulta que necesita liberar el segmento y el segmento a liberar respectivamente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220228_145413_f253cec15b.png" alt="sealedSegmentChangeInfo" class="doc-image" id="sealedsegmentchangeinfo" />
   </span> <span class="img-wrapper"> <span>sealedSegmentChangeInfo</span> </span></p>
<p>Una vez recibido <code translate="no">sealedSegmentChangeInfo</code>, el nodo de consulta de origen libera el segmento de destino.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220228_145436_2604bc57a5.png" alt="Load Balance Workflow" class="doc-image" id="load-balance-workflow" />
   </span> <span class="img-wrapper"> <span>Flujo de trabajo de equilibrio de carga</span> </span></p>
<p>El proceso completo tiene éxito cuando el nodo de consulta de origen libera el segmento de destino. Al completar esto, la carga de la consulta se equilibra entre los nodos de consulta, lo que significa que el uso de RAM de todos los nodos de consulta no es mayor que <code translate="no">queryCoord.overloadedMemoryThresholdPercentage</code>, y el valor absoluto de la diferencia de uso de RAM de los nodos de consulta de origen y destino después del equilibrado de carga es menor que antes del equilibrado de carga.</p>
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
    </button></h2><p>En el blog de la serie de nuevas funciones 2.0, pretendemos explicar el diseño de las nuevas funciones. ¡Lea más en esta serie de blogs!</p>
<ul>
<li><a href="https://milvus.io/blog/2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md">Cómo Milvus elimina los datos de streaming en un clúster distribuido</a></li>
<li><a href="https://milvus.io/blog/2022-2-21-compact.md">¿Cómo compactar datos en Milvus?</a></li>
<li><a href="https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md">¿Cómo equilibra Milvus la carga de consultas entre nodos?</a></li>
<li><a href="https://milvus.io/blog/2022-2-14-bitset.md">Cómo Bitset permite la versatilidad de la búsqueda de similitud vectorial</a></li>
</ul>
<p>Este es el final de la serie de blogs sobre las nuevas características de Milvus 2.0. Después de esta serie, estamos planeando una nueva serie de Milvus <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Deep Dive</a>, que introduce la arquitectura básica de Milvus 2.0. Permanezca atento.</p>
