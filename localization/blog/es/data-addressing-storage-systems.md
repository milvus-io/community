---
id: data-addressing-storage-systems.md
title: >-
  Una inmersión profunda en el direccionamiento de datos en sistemas de
  almacenamiento: De HashMap a HDFS, Kafka, Milvus e Iceberg
author: Bill Chen
date: 2026-3-25
cover: >-
  assets.zilliz.com/cover_A_Deep_Dive_into_Data_Addressing_in_Storage_Systems_6b436abeae.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  data addressing, distributed storage architecture, Milvus storage design,
  vector database internals, Apache Iceberg
meta_title: |
  Data Addressing Deep Dive: From HashMap to Milvus
desc: >-
  Descubra cómo funciona el direccionamiento de datos desde HashMap hasta HDFS,
  Kafka, Milvus e Iceberg, y por qué las ubicaciones informáticas superan a las
  búsquedas a cualquier escala.
origin: 'https://milvus.io/blog/data-addressing-storage-systems.md'
---
<p>Si trabajas en sistemas backend o de almacenamiento distribuido, probablemente hayas visto esto: la red no está saturada, las máquinas no están sobrecargadas, pero una simple búsqueda desencadena miles de E/S de disco o llamadas a la API de almacenamiento de objetos, y la consulta sigue tardando segundos.</p>
<p>El cuello de botella rara vez es el ancho de banda o el cálculo. Es el <em>direccionamiento</em>: el trabajo que realiza un sistema para averiguar dónde se encuentran los datos antes de poder leerlos. El <strong>direccionamiento de datos</strong> es el proceso de traducir un identificador lógico (una clave, una ruta de archivo, un desplazamiento, un predicado de consulta) en la ubicación física de los datos en el almacenamiento. A escala, este proceso -no la transferencia de datos en sí- domina la latencia.</p>
<p>El rendimiento del almacenamiento puede reducirse a un modelo sencillo:</p>
<blockquote>
<p><strong>Coste total de direccionamiento = accesos a metadatos + accesos a datos</strong></p>
</blockquote>
<p>Casi todas las optimizaciones de almacenamiento -desde las tablas hash hasta las capas de metadatos lakehouse- se centran en esta ecuación. Las técnicas varían, pero el objetivo es siempre el mismo: localizar los datos con el menor número posible de operaciones de alta latencia.</p>
<p>Este artículo recorre esta idea a través de sistemas de escala creciente, desde estructuras de datos en memoria como HashMap, pasando por sistemas distribuidos como HDFS y Apache Kafka, hasta llegar a motores modernos como <a href="https://milvus.io/">Milvus</a> (una <a href="https://zilliz.com/learn/what-is-a-vector-database">base de datos vectorial</a>) y Apache Iceberg, que operan con almacenamiento de objetos. A pesar de sus diferencias, todos ellos optimizan la misma ecuación.</p>
<h2 id="Three-Core-Addressing-Techniques" class="common-anchor-header">Tres técnicas básicas de direccionamiento<button data-href="#Three-Core-Addressing-Techniques" class="anchor-icon" translate="no">
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
    </button></h2><p>En todos los sistemas de almacenamiento y motores distribuidos, la mayoría de las optimizaciones de direccionamiento se dividen en tres técnicas:</p>
<ul>
<li><strong>Computación</strong> - Derivar la ubicación de los datos directamente de una fórmula, en lugar de escanear o atravesar estructuras para encontrarla.</li>
<li><strong>Almacenamiento en caché</strong> - Mantener en memoria los metadatos o índices a los que se accede con frecuencia para evitar repetidas lecturas de alta latencia desde el disco o el almacenamiento remoto.</li>
<li><strong>Poda</strong>: utilice información de rango o límites de partición para descartar archivos, fragmentos o nodos que no puedan contener el resultado.</li>
</ul>
<p>A lo largo de este artículo, un <em>acceso</em> significa cualquier operación con un coste real a nivel de sistema: una lectura de disco, una llamada de red o una solicitud de API de almacenamiento de objetos. El cálculo de la CPU a nivel de nanosegundos no cuenta. Lo que importa es reducir el número de operaciones de E/S, o convertir las costosas E/S aleatorias en lecturas secuenciales más baratas.</p>
<h2 id="How-Addressing-Works-The-Two-Sum-Problem" class="common-anchor-header">Cómo funciona el direccionamiento: El problema de las dos sumas<button data-href="#How-Addressing-Works-The-Two-Sum-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>Para concretar el direccionamiento, consideremos un problema algorítmico clásico. Dada una matriz de enteros <code translate="no">nums</code> y un valor objetivo <code translate="no">target</code>, devuelva los índices de dos números que sumen <code translate="no">target</code>.</p>
<p>Por ejemplo: <code translate="no">nums = [2, 7, 11, 15]</code>, <code translate="no">target = 9</code> → resultado <code translate="no">[0, 1]</code>.</p>
<p>Este problema ilustra claramente la diferencia entre buscar datos y calcular dónde se encuentran.</p>
<h3 id="Solution-1-Brute-Force-Search" class="common-anchor-header">Solución 1: Búsqueda por fuerza bruta</h3><p>El método de fuerza bruta comprueba cada par. Para cada elemento, explora el resto de la matriz en busca de una coincidencia. Simple, pero O(n²).</p>
<pre><code translate="no" class="language-java"><span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-built_in">int</span>[] <span class="hljs-title">twoSum</span>(<span class="hljs-params"><span class="hljs-built_in">int</span>[] nums, <span class="hljs-built_in">int</span> target</span>)</span> {
    <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> i = <span class="hljs-number">0</span>; i &lt; nums.length; i++) {
        <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> j = i + <span class="hljs-number">1</span>; j &lt; nums.length; j++) {
            <span class="hljs-keyword">if</span> (nums[i] + nums[j] == target) <span class="hljs-keyword">return</span> <span class="hljs-keyword">new</span> <span class="hljs-built_in">int</span>[]{i, j};
        }
    }
    <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>;
}
<button class="copy-code-btn"></button></code></pre>
<p>No se sabe dónde puede estar la respuesta. Cada búsqueda empieza de cero y recorre la matriz a ciegas. El cuello de botella no es la aritmética, sino el escaneo repetido.</p>
<h3 id="Solution-2-Direct-Addressing-via-Computation" class="common-anchor-header">Solución 2: Direccionamiento directo mediante cálculo</h3><p>La solución optimizada sustituye la exploración por un HashMap. En lugar de buscar un valor que coincida, calcula qué valor se necesita y lo busca directamente. La complejidad temporal se reduce a O(n).</p>
<pre><code translate="no" class="language-java">public <span class="hljs-type">int</span>[] twoSum(<span class="hljs-type">int</span>[] nums, <span class="hljs-type">int</span> target) {
    Map&lt;Integer, Integer&gt; <span class="hljs-keyword">map</span> = <span class="hljs-built_in">new</span> HashMap&lt;&gt;();
    <span class="hljs-keyword">for</span> (<span class="hljs-type">int</span> i = <span class="hljs-number">0</span>; i &lt; nums.length; i++) {
        <span class="hljs-type">int</span> complement = target - nums[i]; <span class="hljs-comment">// compute what we need</span>
        <span class="hljs-keyword">if</span> (<span class="hljs-keyword">map</span>.containsKey(complement)) { <span class="hljs-comment">// direct lookup, no scan</span>
            <span class="hljs-keyword">return</span> <span class="hljs-built_in">new</span> <span class="hljs-type">int</span>[]{<span class="hljs-keyword">map</span>.get(complement), i};
        }
        <span class="hljs-keyword">map</span>.put(nums[i], i);
    }
    <span class="hljs-keyword">return</span> null;
}
<button class="copy-code-btn"></button></code></pre>
<p>El cambio: en lugar de escanear la matriz para encontrar una coincidencia, se calcula lo que se necesita y se va directamente a su ubicación. Una vez obtenida la ubicación, desaparece el recorrido.</p>
<p>Ésta es la misma idea que subyace en todos los sistemas de almacenamiento de alto rendimiento que examinaremos: sustituir el escaneo por el cálculo y las rutas de búsqueda indirectas por el direccionamiento directo.</p>
<h2 id="HashMap-How-Computed-Addresses-Replace-Scans" class="common-anchor-header">HashMap: Cómo las direcciones computadas sustituyen a los escaneos<button data-href="#HashMap-How-Computed-Addresses-Replace-Scans" class="anchor-icon" translate="no">
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
    </button></h2><p>Un HashMap almacena pares clave-valor y localiza los valores calculando una dirección a partir de la clave, no buscando en las entradas. Dada una clave, aplica una función hash, calcula un índice de matriz y salta directamente a esa ubicación. No es necesario escanear.</p>
<p>Ésta es la forma más simple del principio que rige todos los sistemas de este artículo: evitar los escaneos derivando ubicaciones mediante el cálculo. La misma idea -que sustenta todo, desde las búsquedas distribuidas de metadatos hasta los <a href="https://zilliz.com/learn/vector-index">índices vectoriales-</a> aparece a todas las escalas.</p>
<h3 id="The-Core-Data-Structure" class="common-anchor-header">El núcleo de la estructura de datos</h3><p>En esencia, un HashMap se construye en torno a una única estructura: una matriz. Una función hash asigna claves a índices de matriz. Dado que el espacio de claves es mucho mayor que el de la matriz, las colisiones son inevitables: diferentes claves pueden coincidir con el mismo índice. Estas colisiones se gestionan localmente dentro de cada ranura mediante una lista enlazada o un árbol rojo-negro.</p>
<p>Las matrices permiten un acceso por índice en tiempo constante. Esta propiedad - direccionamiento directo y predecible - es la base del rendimiento de HashMap, y el mismo principio que subyace en el acceso eficiente a los datos en los sistemas de almacenamiento a gran escala.</p>
<pre><code translate="no" class="language-java"><span class="hljs-keyword">public</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">HashMap</span>&lt;K,V&gt; {

    <span class="hljs-comment">// Core structure: an array that supports O(1) random access</span>
    <span class="hljs-keyword">transient</span> Node&lt;K,V&gt;[] table;

    <span class="hljs-comment">// Node structure</span>
    <span class="hljs-keyword">static</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">Node</span>&lt;K,V&gt; {
        <span class="hljs-keyword">final</span> <span class="hljs-type">int</span> hash;      <span class="hljs-comment">// hash value (cached to avoid recomputation)</span>
        <span class="hljs-keyword">final</span> K key;         <span class="hljs-comment">// key</span>
        V value;             <span class="hljs-comment">// value</span>
        Node&lt;K,V&gt; next;      <span class="hljs-comment">// next node (for handling collision)</span>
    }

    <span class="hljs-comment">// Hash function：key → integer</span>
    <span class="hljs-keyword">static</span> <span class="hljs-keyword">final</span> <span class="hljs-type">int</span> <span class="hljs-title function_">hash</span><span class="hljs-params">(Object key)</span> {
        <span class="hljs-type">int</span> h;
        <span class="hljs-keyword">return</span> (key == <span class="hljs-literal">null</span>) ? <span class="hljs-number">0</span> : (h = key.hashCode()) ^ (h &gt;&gt;&gt; <span class="hljs-number">16</span>);
    }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Does-a-HashMap-Locate-Data" class="common-anchor-header">¿Cómo localiza los datos un HashMap?</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_2_4ada70fe33.png" alt="Step-by-step HashMap addressing: hash the key, compute the array index, jump directly to the bucket, and resolve locally — achieving O(1) lookup without traversal" class="doc-image" id="step-by-step-hashmap-addressing:-hash-the-key,-compute-the-array-index,-jump-directly-to-the-bucket,-and-resolve-locally-—-achieving-o(1)-lookup-without-traversal" />
   </span> <span class="img-wrapper"> <span>Direccionamiento HashMap paso a paso: hash de la clave, calcular el índice de la matriz, saltar directamente a la cubeta, y resolver a nivel local - el logro de O (1) de búsqueda sin travesía</span> </span></p>
<p>Tomemos como ejemplo <code translate="no">put(&quot;apple&quot;, 100)</code>. La búsqueda completa se realiza en cuatro pasos, sin escanear toda la tabla:</p>
<ol>
<li><strong>Hash de la clave:</strong> Pasar la clave a través de una función hash →. <code translate="no">hash(&quot;apple&quot;) = 93029210</code></li>
<li><strong>Asignar a un índice de matriz:</strong> <code translate="no">93029210 &amp; (arrayLength - 1)</code> → Ej, <code translate="no">93029210 &amp; 15 = 10</code></li>
<li><strong>Saltar al cubo:</strong> Acceder directamente a <code translate="no">table[10]</code> - un único acceso a memoria, no un traversal.</li>
<li><strong>Resolver localmente:</strong> Si no hay colisión, leer o escribir inmediatamente. Si hay una colisión, comprueba una pequeña lista enlazada o árbol rojo-negro dentro de ese cubo.</li>
</ol>
<h3 id="Why-Is-HashMap-Lookup-O1" class="common-anchor-header">¿Por qué la búsqueda en HashMap es O(1)?</h3><p>El acceso a matrices es O(1) debido a una sencilla fórmula de direccionamiento:</p>
<pre><code translate="no">element_address = base_address + index × element_size
<button class="copy-code-btn"></button></code></pre>
<p>Dado un índice, la dirección de memoria se calcula con una multiplicación y una suma. El coste es fijo independientemente del tamaño de la matriz: un cálculo, una lectura de memoria. En cambio, una lista enlazada debe recorrerse nodo por nodo, siguiendo punteros a través de distintas posiciones de memoria: O(n) en el peor de los casos.</p>
<p>Un HashMap transforma una clave en un índice de matriz, convirtiendo lo que sería un recorrido en una dirección calculada. En lugar de buscar los datos, calcula exactamente dónde se encuentran y salta allí.</p>
<h2 id="How-Does-Addressing-Change-in-Distributed-Systems" class="common-anchor-header">¿Cómo cambia el direccionamiento en los sistemas distribuidos?<button data-href="#How-Does-Addressing-Change-in-Distributed-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>HashMap resuelve el direccionamiento dentro de una sola máquina, donde los datos viven en la memoria y los costes de acceso son triviales. A mayor escala, las restricciones cambian drásticamente:</p>
<table>
<thead>
<tr><th>Factor de escala</th><th>Impacto</th></tr>
</thead>
<tbody>
<tr><td>Tamaño de los datos</td><td>Megabytes → terabytes o petabytes en clusters</td></tr>
<tr><td>Medio de almacenamiento</td><td>Memoria → disco → red → almacenamiento de objetos</td></tr>
<tr><td>Latencia de acceso</td><td>Memoria: ~100 ns / Disco: 10-20 ms / Red misma región: ~0,5 ms / Cross-region: ~150 ms</td></tr>
</tbody>
</table>
<p>El problema del direccionamiento no cambia, sólo se encarece. Cada búsqueda puede implicar saltos de red y E/S de disco, por lo que reducir el número de accesos es mucho más importante que en memoria.</p>
<p>Para ver cómo manejan esto los sistemas reales, veremos dos ejemplos clásicos. HDFS aplica el direccionamiento basado en computación a archivos grandes basados en bloques. Kafka lo aplica a flujos de mensajes basados únicamente en anexos. Ambos siguen el mismo principio: calcular dónde están los datos en lugar de buscarlos.</p>
<h2 id="HDFS-Addressing-Large-Files-with-In-Memory-Metadata" class="common-anchor-header">HDFS: direccionamiento de archivos grandes con metadatos en memoria<button data-href="#HDFS-Addressing-Large-Files-with-In-Memory-Metadata" class="anchor-icon" translate="no">
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
    </button></h2><p>HDFS es un sistema <a href="https://milvus.io/docs/architecture_overview.md">de almacenamiento distribuido</a> diseñado para archivos muy grandes en clusters de máquinas. Dada una ruta de archivo y un desplazamiento de bytes, necesita encontrar el bloque de datos correcto y el DataNode que lo almacena.</p>
<p>HDFS resuelve esto con una elección de diseño deliberada: mantener todos los metadatos del sistema de archivos en memoria.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_1_26ff6257b1.png" alt="HDFS data organization showing logical view of a 300MB file mapped to physical storage as three blocks distributed across DataNodes with replication" class="doc-image" id="hdfs-data-organization-showing-logical-view-of-a-300mb-file-mapped-to-physical-storage-as-three-blocks-distributed-across-datanodes-with-replication" />
   </span> <span class="img-wrapper"> <span>Organización de datos HDFS mostrando la vista lógica de un archivo de 300MB mapeado al almacenamiento físico como tres bloques distribuidos a través de DataNodes con replicación</span> </span></p>
<p>En el centro está el NameNode. Carga todo el árbol del sistema de archivos (estructura de directorios, asignación de archivos a bloques y asignación de bloques a DataNodes) en la memoria. Debido a que los metadatos nunca tocan el disco durante las lecturas, HDFS resuelve todas las cuestiones de direccionamiento sólo a través de búsquedas en memoria.</p>
<p>Conceptualmente, esto es HashMap a escala de clúster: utilizar estructuras de datos en memoria para convertir las búsquedas lentas en búsquedas rápidas y calculadas. La diferencia es que HDFS aplica el mismo principio a conjuntos de datos distribuidos en miles de máquinas.</p>
<pre><code translate="no" class="language-java"><span class="hljs-comment">// Data structures stored in the NameNode&#x27;s memory</span>

<span class="hljs-comment">// 1. Filesystem directory tree</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">FSDirectory</span> {
    INodeDirectory rootDir;           <span class="hljs-comment">// root directory &quot;/&quot;</span>
    INodeMap inodeMap;                <span class="hljs-comment">// path → INode (HashMap!)</span>
}

<span class="hljs-comment">// 2. INode：file / directory node</span>
<span class="hljs-keyword">abstract</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">INode</span> {
    <span class="hljs-type">long</span> id;                          <span class="hljs-comment">// unique identifier</span>
    String name;                      <span class="hljs-comment">// name</span>
    INode parent;                     <span class="hljs-comment">// parent node</span>
    <span class="hljs-type">long</span> modificationTime;            <span class="hljs-comment">// last modification time</span>
}

<span class="hljs-keyword">class</span> <span class="hljs-title class_">INodeFile</span> <span class="hljs-keyword">extends</span> <span class="hljs-title class_">INode</span> {
    BlockInfo[] blocks;               <span class="hljs-comment">// list of blocks that make up the file</span>
}

<span class="hljs-comment">// 3. Block metadata mapping</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">BlocksMap</span> {
    GSet&lt;Block, BlockInfo&gt; blocks;    <span class="hljs-comment">// Block → location info (HashMap!)</span>
}

<span class="hljs-keyword">class</span> <span class="hljs-title class_">BlockInfo</span> {
    <span class="hljs-type">long</span> blockId;
    DatanodeDescriptor[] storages;    <span class="hljs-comment">// list of DataNodes storing this block</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Does-HDFS-Locate-Data" class="common-anchor-header">¿Cómo localiza HDFS los datos?</h3><p>Considere la lectura de datos en el desplazamiento de 200 MB de <code translate="no">/user/data/bigfile.txt</code>, con un tamaño de bloque por defecto de 128 MB:</p>
<ol>
<li>El cliente envía una única RPC al NameNode</li>
<li>El NameNode resuelve la ruta del archivo y calcula que el offset 200 MB cae en el segundo bloque (rango 128-256 MB) - enteramente en memoria</li>
<li>El NameNode devuelve los DataNodes que almacenan ese bloque (por ejemplo, DN2 y DN3)</li>
<li>El cliente lee directamente del DataNode más cercano (DN2)</li>
</ol>
<p>Coste total: una RPC, unas cuantas búsquedas en memoria, una lectura de datos. Los metadatos nunca llegan al disco durante este proceso, y cada búsqueda es de tiempo constante. HDFS evita costosos escaneos de metadatos incluso cuando los datos se escalan a través de grandes clusters.</p>
<h2 id="Apache-Kafka-How-Sparse-Indexing-Avoids-Random-IO" class="common-anchor-header">Apache Kafka: Cómo la indexación dispersa evita la E/S aleatoria<button data-href="#Apache-Kafka-How-Sparse-Indexing-Avoids-Random-IO" class="anchor-icon" translate="no">
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
    </button></h2><p>Apache Kafka está diseñado para flujos de mensajes de alto rendimiento. Dado un desplazamiento de mensaje, necesita localizar la posición exacta del byte en el disco, sin convertir las lecturas en E/S aleatorias.</p>
<p>Kafka combina el almacenamiento secuencial con un índice disperso en memoria. En lugar de buscar en los datos, calcula una ubicación aproximada y realiza una pequeña exploración limitada.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_4_6af2d2cf97.png" alt="Kafka data organization showing logical view with topics and partitions mapped to physical storage as partition directories containing .log, .index, and .timeindex segment files" class="doc-image" id="kafka-data-organization-showing-logical-view-with-topics-and-partitions-mapped-to-physical-storage-as-partition-directories-containing-.log,-.index,-and-.timeindex-segment-files" />
   </span> <span class="img-wrapper"> <span>La organización de datos de Kafka muestra una vista lógica con temas y particiones asignados al almacenamiento físico como directorios de partición que contienen archivos de segmento .log, .index y .timeindex</span> </span>.</p>
<p>Los mensajes se organizan como Tema → Partición → Segmento. Cada partición es un registro de sólo apéndice dividido en segmentos, cada uno consistente en:</p>
<ul>
<li>Un archivo <code translate="no">.log</code> que almacena los mensajes secuencialmente en el disco</li>
<li>Un archivo <code translate="no">.index</code> que actúa como índice disperso del registro.</li>
</ul>
<p>El archivo <code translate="no">.index</code> está mapeado en memoria (mmap), por lo que las búsquedas de índices se realizan directamente desde la memoria sin E/S de disco.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_3_0e4e99b226.png" alt="Kafka sparse index design showing one index entry per 4KB of data, with memory comparison: dense index at 800MB versus sparse index at just 2MB resident in memory" class="doc-image" id="kafka-sparse-index-design-showing-one-index-entry-per-4kb-of-data,-with-memory-comparison:-dense-index-at-800mb-versus-sparse-index-at-just-2mb-resident-in-memory" />
   </span> <span class="img-wrapper"> <span>Diseño del índice disperso de Kafka mostrando una entrada de índice por cada 4 KB de datos, con comparación de memoria: índice denso de 800 MB frente a índice disperso de sólo 2 MB residente en memoria</span> </span>.</p>
<pre><code translate="no" class="language-java"><span class="hljs-comment">// A Partition manages all its Segments</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">LocalLog</span> {
    <span class="hljs-comment">// Core structure: TreeMap, ordered by baseOffset</span>
    ConcurrentNavigableMap&lt;Long, LogSegment&gt; segments;

    <span class="hljs-comment">// Locate the target Segment</span>
    LogSegment <span class="hljs-title function_">floorEntry</span><span class="hljs-params">(<span class="hljs-type">long</span> offset)</span> {
        <span class="hljs-keyword">return</span> segments.floorEntry(offset);  <span class="hljs-comment">// O(log N)</span>
    }
}

<span class="hljs-comment">// A single Segment</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">LogSegment</span> {
    FileRecords log;           <span class="hljs-comment">// .log file (message data)</span>
    LazyIndex&lt;OffsetIndex&gt; offsetIndex;  <span class="hljs-comment">// .index file (sparse index)</span>
    <span class="hljs-type">long</span> baseOffset;           <span class="hljs-comment">// starting Offset</span>
}

<span class="hljs-comment">// Sparse index entry (8 bytes per entry)</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">OffsetPosition</span> {
    <span class="hljs-type">int</span> relativeOffset;        <span class="hljs-comment">// offset relative to baseOffset (4 bytes)</span>
    <span class="hljs-type">int</span> position;              <span class="hljs-comment">// physical position in the .log file (4 bytes)</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Does-Kafka-Locate-Data" class="common-anchor-header">¿Cómo localiza Kafka los datos?</h3><p>Supongamos que un consumidor lee el mensaje en el offset 500.000. Kafka resuelve esto en tres pasos:</p>
<p><strong>1.</strong> 1.<strong>Localizar el segmento</strong> (búsqueda TreeMap)</p>
<ul>
<li>Desplazamientos base del segmento: <code translate="no">[0, 367834, 735668, 1103502]</code></li>
<li><code translate="no">floorEntry(500000)</code> → <code translate="no">baseOffset = 367834</code></li>
<li>Archivo de destino: <code translate="no">00000000000000367834.log</code></li>
<li>Complejidad temporal: O(log S), donde S es el número de segmentos (típicamente &lt; 100).</li>
</ul>
<p><strong>2. Busca la posición en el índice disperso</strong> (.index)</p>
<ul>
<li>Desplazamiento relativo: <code translate="no">500000 − 367834 = 132166</code></li>
<li>Búsqueda binaria en <code translate="no">.index</code>: encontrar la entrada más grande ≤ 132166 → <code translate="no">[132100 → position 20500000]</code></li>
<li>Complejidad temporal: O(log N), donde N es el número de entradas del índice.</li>
</ul>
<p><strong>3. Lectura secuencial desde el registro</strong> (.log)</p>
<ul>
<li>Comenzar la lectura desde la posición 20.500.000</li>
<li>Continuar hasta alcanzar la posición 500.000</li>
<li>Se escanea como máximo un intervalo de índice (~4 KB)</li>
</ul>
<p>Total: una búsqueda de segmento en memoria, una búsqueda de índice, una lectura secuencial corta. Sin acceso aleatorio al disco.</p>
<h2 id="HDFS-vs-Apache-Kafka" class="common-anchor-header">HDFS frente a Apache Kafka<button data-href="#HDFS-vs-Apache-Kafka" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>Dimensión</th><th>HDFS</th><th>Kafka</th></tr>
</thead>
<tbody>
<tr><td>Objetivo de diseño</td><td>Almacenamiento y lectura eficientes de archivos masivos</td><td>Lectura/escritura secuencial de alto rendimiento de flujos de mensajes</td></tr>
<tr><td>Modelo de direccionamiento</td><td>Ruta → bloque → nodo de datos mediante HashMaps en memoria</td><td>Desplazamiento → segmento → posición mediante índice disperso + exploración secuencial</td></tr>
<tr><td>Almacenamiento de metadatos</td><td>Centralizado en la memoria de NameNode</td><td>Archivos locales, mapeados en memoria mediante mmap</td></tr>
<tr><td>Coste de acceso por búsqueda</td><td>1 RPC + N lecturas de bloque</td><td>1 búsqueda de índice + 1 lectura de datos</td></tr>
<tr><td>Optimización clave</td><td>Todos los metadatos en memoria - sin disco en la ruta de búsqueda</td><td>La indexación dispersa + la disposición secuencial evitan la E/S aleatoria</td></tr>
</tbody>
</table>
<h2 id="Why-Object-Storage-Changes-the-Addressing-Problem" class="common-anchor-header">Por qué el almacenamiento de objetos cambia el problema del direccionamiento<button data-href="#Why-Object-Storage-Changes-the-Addressing-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>Desde HashMap hasta HDFS y Kafka, hemos visto el direccionamiento en memoria y en almacenamiento distribuido clásico. A medida que las cargas de trabajo evolucionan, los requisitos siguen aumentando:</p>
<ul>
<li><strong>Consultas más ricas.</strong> Los sistemas modernos manejan filtros de campos múltiples, <a href="https://zilliz.com/glossary/similarity-search">búsquedas por similitud</a> y predicados complejos, no sólo simples claves y desplazamientos.</li>
<li><strong>Almacenamiento de objetos por defecto.</strong> Los datos viven cada vez más en almacenes compatibles con S3. Los archivos se distribuyen en cubos y cada acceso es una llamada a la API con una latencia fija del orden de decenas de milisegundos, incluso para unos pocos kilobytes.</li>
</ul>
<p>En este punto, la latencia -no el ancho de banda- es el cuello de botella. Una sola solicitud GET de S3 cuesta ~50 ms, independientemente de la cantidad de datos que devuelva. Si una consulta desencadena miles de solicitudes de este tipo, la latencia total se dispara. Minimizar el fan-out de la API se convierte en la principal restricción de diseño.</p>
<p>Analizaremos dos sistemas modernos <a href="https://milvus.io/">-Milvus</a>, una <a href="https://zilliz.com/learn/what-is-a-vector-database">base de datos vectorial</a>, y Apache Iceberg, un formato de tabla lakehouse- para ver cómo abordan estos retos. A pesar de sus diferencias, ambos aplican las mismas ideas básicas: minimizar los accesos de alta latencia, reducir el "fan-out" y favorecer la computación sobre el "traversal".</p>
<h2 id="Milvus-V1-When-Field-Level-Storage-Creates-Too-Many-Files" class="common-anchor-header">Milvus V1: Cuando el almacenamiento a nivel de campo crea demasiados archivos<button data-href="#Milvus-V1-When-Field-Level-Storage-Creates-Too-Many-Files" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus es una base de datos vectorial ampliamente utilizada, diseñada para la <a href="https://zilliz.com/glossary/similarity-search">búsqueda de similitudes</a> sobre <a href="https://zilliz.com/glossary/vector-embeddings">incrustaciones vectoriales</a>. Su primer diseño de almacenamiento refleja un primer enfoque común para construir sobre el almacenamiento de objetos: almacenar cada campo por separado.</p>
<p>En V1, cada campo de una <a href="https://milvus.io/docs/manage-collections.md">colección</a> se almacena en archivos binlog separados a través de <a href="https://milvus.io/docs/glossary.md">segmentos</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_5_08cf1c8ec1.png" alt="Milvus V1 storage layout showing a collection split into segments, with each segment storing fields like id, vector, and scalar data in separate binlog files, plus separate stats_log files for file statistics" class="doc-image" id="milvus-v1-storage-layout-showing-a-collection-split-into-segments,-with-each-segment-storing-fields-like-id,-vector,-and-scalar-data-in-separate-binlog-files,-plus-separate-stats_log-files-for-file-statistics" />
   </span> <span class="img-wrapper"> <span>Disposición de almacenamiento de Milvus V1 mostrando una colección dividida en segmentos, con cada segmento almacenando campos como id, vector y datos escalares en archivos binlog separados, además de archivos stats_log separados para estadísticas de archivos</span> </span>.</p>
<h3 id="How-Does-Milvus-V1-Locate-Data" class="common-anchor-header">¿Cómo localiza Milvus V1 los datos?</h3><p>Considere una consulta simple: <code translate="no">SELECT id, vector FROM collection WHERE id = 123</code>.</p>
<ol>
<li><strong>Búsqueda de metadatos</strong> - Consulta etcd/MySQL para obtener la lista de segmentos →. <code translate="no">[Segment 12345, 12346, 12347, …]</code></li>
<li><strong>Leer el campo id en todos los segmentos</strong> - Para cada segmento, leer los archivos binlog id</li>
<li><strong>Localizar la fila de destino</strong> - Escanear los datos id cargados para encontrar <code translate="no">id = 123</code></li>
<li>Lectura del<strong>campo vectorial</strong> - Lectura de los archivos binlog vectoriales correspondientes al segmento coincidente</li>
</ol>
<p>Total de accesos a archivos: <strong>N × (F₁ + F₂ + ...)</strong> donde N = número de segmentos, F = archivos binlog por campo.</p>
<p>Las matemáticas se ponen feas rápidamente. Para una colección con 100 campos, 1.000 segmentos y 5 archivos binlog por campo:</p>
<blockquote>
<p><strong>1.000 × 100 × 5 = 500.000 archivos</strong></p>
</blockquote>
<p>Incluso si una consulta toca sólo tres campos, son 15.000 llamadas a la API de almacenamiento de objetos. A 50 ms por solicitud S3, la latencia serializada alcanza los <strong>750 segundos</strong>, más de 12 minutos para una sola consulta.</p>
<h2 id="Milvus-V2-How-Segment-Level-Parquet-Cuts-API-Calls-by-10x" class="common-anchor-header">Milvus V2: Cómo el parquet a nivel de segmento reduce 10 veces las llamadas a la API<button data-href="#Milvus-V2-How-Segment-Level-Parquet-Cuts-API-Calls-by-10x" class="anchor-icon" translate="no">
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
    </button></h2><p>Para solucionar los límites de escalabilidad de la V1, Milvus V2 realiza un cambio fundamental: organizar los datos por <a href="https://milvus.io/docs/glossary.md">segmentos</a> en lugar de por campos. En lugar de muchos archivos binlog pequeños, V2 consolida los datos en archivos Parquet basados en segmentos.</p>
<p>El número de archivos se reduce de <code translate="no">N × fields × binlogs</code> a aproximadamente <code translate="no">N</code> (un grupo de archivos por segmento).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_7_95db65a6e0.png" alt="Milvus V2 storage layout showing a segment stored as Parquet files with row groups containing column chunks for id, vector, and timestamp, plus a footer with schema and column statistics" class="doc-image" id="milvus-v2-storage-layout-showing-a-segment-stored-as-parquet-files-with-row-groups-containing-column-chunks-for-id,-vector,-and-timestamp,-plus-a-footer-with-schema-and-column-statistics" />
   </span> <span class="img-wrapper"> <span>Disposición de almacenamiento de Milvus V2 mostrando un segmento almacenado como archivos Parquet con grupos de filas que contienen trozos de columnas para id, vector y marca de tiempo, más un pie de página con estadísticas de esquema y columna</span> </span></p>
<p>Pero V2 no almacena todos los campos en un único archivo. Agrupa los campos por tamaño:</p>
<ul>
<li><strong>Los <a href="https://milvus.io/docs/scalar_index.md">campos escalares</a> pequeños</strong> (como id o timestamp) se almacenan juntos.</li>
<li>Los<strong>campos grandes</strong> (como <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">los vectores densos</a>) se dividen en archivos específicos.</li>
</ul>
<p>Todos los archivos pertenecen al mismo segmento, y las filas se alinean por índices entre archivos.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_9_fe4f57a1e0.png" alt="Parquet file structure showing row groups with column chunks and compressed data pages, plus a footer containing file metadata, row group metadata, and column statistics like min/max values" class="doc-image" id="parquet-file-structure-showing-row-groups-with-column-chunks-and-compressed-data-pages,-plus-a-footer-containing-file-metadata,-row-group-metadata,-and-column-statistics-like-min/max-values" />
   </span> <span class="img-wrapper"> <span>Estructura de archivos Parquet que muestra grupos de filas con trozos de columnas y páginas de datos comprimidas, además de un pie de página que contiene metadatos de archivos, metadatos de grupos de filas y estadísticas de columnas como valores mín./máx.</span> </span></p>
<h3 id="How-Does-Milvus-V2-Locate-Data" class="common-anchor-header">¿Cómo localiza Milvus V2 los datos?</h3><p>Para la misma consulta - <code translate="no">SELECT id, vector FROM collection WHERE id = 123</code>:</p>
<ol>
<li><strong>Búsqueda de metadatos</strong> - Obtención de la lista de segmentos → Lectura de los pies de página de Parquet <code translate="no">[12345, 12346, …]</code></li>
<li><strong>Leer pies de página de Parquet</strong> - Extraer estadísticas de grupos de filas. Compruebe el mínimo/máximo de la columna id por grupo de filas. <code translate="no">id = 123</code> cae en el grupo de filas 0 (min=1, max=1000).</li>
<li><strong>Leer sólo lo necesario</strong> - La poda de columnas de Parquet lee sólo la columna id del archivo de campo pequeño y sólo la columna <a href="https://milvus.io/docs/index-vector-fields.md">vector</a> del archivo de campo grande. Sólo se accede a los grupos de filas coincidentes.</li>
</ol>
<p>Dividir los campos grandes ofrece dos ventajas clave:</p>
<ul>
<li><strong>Lecturas más eficientes.</strong> <a href="https://zilliz.com/glossary/vector-embeddings">Las incrustaciones vectoriales</a> dominan el tamaño de almacenamiento. Mezclados con campos pequeños, limitan el número de filas que caben en un grupo de filas, lo que aumenta los accesos al archivo. Aislarlos permite que los grupos de filas de campos pequeños contengan muchas más filas, mientras que los campos grandes utilizan diseños optimizados para su tamaño.</li>
<li><strong>Evolución flexible <a href="https://milvus.io/docs/schema.md">del esquema</a>.</strong> Añadir una columna significa crear un nuevo archivo. Eliminar una columna significa omitirla en el momento de la lectura. No es necesario reescribir los datos históricos.</li>
</ul>
<p>El resultado: el número de archivos se reduce en más de 10 veces, las llamadas a la API en más de 10 veces y la latencia de las consultas pasa de minutos a segundos.</p>
<h2 id="Milvus-V1-vs-V2" class="common-anchor-header">Milvus V1 frente a V2<button data-href="#Milvus-V1-vs-V2" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>Aspecto</th><th>V1</th><th>V2</th></tr>
</thead>
<tbody>
<tr><td>Organización de archivos</td><td>Dividido por campo</td><td>Integrado por segmento</td></tr>
<tr><td>Ficheros por colección</td><td>N × campos × binlogs</td><td>~N × grupos de columnas</td></tr>
<tr><td>Formato de almacenamiento</td><td>Binlog personalizado</td><td>Parquet (también compatible con Lance y Vortex)</td></tr>
<tr><td>Poda de columnas</td><td>Natural (archivos a nivel de campo)</td><td>Poda de columnas Parquet</td></tr>
<tr><td>Estadísticas</td><td>Archivos stats_log independientes</td><td>Integrado en el pie de página de Parquet</td></tr>
<tr><td>Llamadas a la API de S3 por consulta</td><td>10,000+</td><td>~1,000</td></tr>
<tr><td>Latencia de la consulta</td><td>Minutos</td><td>Segundos</td></tr>
</tbody>
</table>
<h2 id="Apache-Iceberg-Metadata-Driven-File-Pruning" class="common-anchor-header">Apache Iceberg: Poda de archivos basada en metadatos<button data-href="#Apache-Iceberg-Metadata-Driven-File-Pruning" class="anchor-icon" translate="no">
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
    </button></h2><p>Apache Iceberg gestiona tablas analíticas sobre conjuntos de datos masivos en sistemas lakehouse. Cuando una tabla abarca miles de archivos de datos, el reto consiste en limitar la consulta a los archivos relevantes, sin tener que escanearlo todo.</p>
<p>La respuesta de Iceberg es decidir qué archivos leer <em>antes de</em> que se produzca cualquier E/S de datos, utilizando metadatos por capas. Es el mismo principio que subyace al <a href="https://zilliz.com/learn/metadata-filtering-with-milvus">filtrado de metadatos</a> en las bases de datos vectoriales: utilizar estadísticas precalculadas para omitir datos irrelevantes.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_8_a9b063bdbe.png" alt="Iceberg data organization showing a metadata directory with metadata.json, manifest lists, and manifest files alongside a data directory with date-partitioned Parquet files" class="doc-image" id="iceberg-data-organization-showing-a-metadata-directory-with-metadata.json,-manifest-lists,-and-manifest-files-alongside-a-data-directory-with-date-partitioned-parquet-files" />
   </span> <span class="img-wrapper"> <span>Organización de datos Iceberg mostrando un directorio de metadatos con metadata.json, listas de manifiesto y archivos de manifiesto junto a un directorio de datos con archivos Parquet particionados por fecha</span> </span>.</p>
<p>Iceberg utiliza una estructura de metadatos por capas. Cada capa filtra los datos irrelevantes antes de consultar la siguiente, de forma similar a como <a href="https://milvus.io/docs/architecture_overview.md">las bases de datos distribuidas</a> separan los metadatos de los datos para un acceso eficiente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_6_afc159ea22.png" alt="Iceberg four-layer architecture: metadata.json points to manifest lists, which reference manifest files containing file-level statistics, which point to actual Parquet data files" class="doc-image" id="iceberg-four-layer-architecture:-metadata.json-points-to-manifest-lists,-which-reference-manifest-files-containing-file-level-statistics,-which-point-to-actual-parquet-data-files" />
   </span> <span class="img-wrapper"> <span>Arquitectura de cuatro capas de Iceberg: metadata.json apunta a listas de manifiesto, que hacen referencia a archivos de manifiesto que contienen estadísticas a nivel de archivo, que apuntan a archivos de datos Parquet reales</span> </span>.</p>
<h3 id="How-Does-Iceberg-Locate-Data" class="common-anchor-header">¿Cómo localiza Iceberg los datos?</h3><p>Considérelo: <code translate="no">SELECT * FROM orders WHERE date='2024-01-15' AND amount&gt;1000</code>.</p>
<ol>
<li>Leer<strong>metadata.json</strong> (1 E/S) - Cargar la instantánea actual y sus listas de manifiesto</li>
<li><strong>Leer la lista de manifiestos</strong> (1 E/S) - Aplicar filtros <a href="https://milvus.io/docs/use-partition-key.md">a nivel de partición</a> para omitir particiones enteras (por ejemplo, se eliminan todos los datos de 2023)</li>
<li><strong>Lectura de</strong> archivos de<strong>manifiesto</strong> (2 E/S) - Uso de estadísticas a nivel de archivo (fecha mín./máx., cantidad mín./máx.) para eliminar archivos que no coincidan con la consulta</li>
<li>Lectura<strong>de ficheros de datos</strong> (3 E/S) - Sólo quedan tres ficheros que se leen realmente</li>
</ol>
<p>En lugar de escanear los 1.000 archivos de datos, Iceberg completa la búsqueda en <strong>7 operaciones de E/S</strong> - evitando más del 94% de las lecturas innecesarias.</p>
<h2 id="How-Different-Systems-Address-Data" class="common-anchor-header">Cómo tratan los datos los distintos sistemas<button data-href="#How-Different-Systems-Address-Data" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>Sistema</th><th>Organización de datos</th><th>Mecanismo de direccionamiento del núcleo</th><th>Coste de acceso</th></tr>
</thead>
<tbody>
<tr><td>HashMap</td><td>Clave → ranura del array</td><td>Función hash → índice directo</td><td>Acceso a memoria O(1)</td></tr>
<tr><td>HDFS</td><td>Ruta → bloque → DataNode</td><td>HashMaps en memoria + cálculo de bloques</td><td>1 RPC + N lecturas de bloque</td></tr>
<tr><td>Kafka</td><td>Tema → Partición → Segmento</td><td>TreeMap + índice disperso + escaneo secuencial</td><td>1 búsqueda de índice + 1 lectura de datos</td></tr>
<tr><td><a href="https://milvus.io/">Milvus</a> V2</td><td><a href="https://milvus.io/docs/manage-collections.md">Colección</a> → Segmento → Columnas de parquet</td><td>Búsqueda de metadatos + poda de columnas</td><td>N lecturas (N = segmentos)</td></tr>
<tr><td>Iceberg</td><td>Tabla → Instantánea → Manifiesto → Archivos de datos</td><td>Metadatos en capas + poda estadística</td><td>3 lecturas de metadatos + M lecturas de datos</td></tr>
</tbody>
</table>
<h2 id="Three-Principles-Behind-Efficient-Data-Addressing" class="common-anchor-header">Tres principios en los que se basa el direccionamiento eficiente de datos<button data-href="#Three-Principles-Behind-Efficient-Data-Addressing" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Computation-Always-Beats-Search" class="common-anchor-header">1. El cálculo siempre gana a la búsqueda</h3><p>En todos los sistemas que hemos examinado, la optimización más eficaz sigue la misma regla: calcular dónde están los datos en lugar de buscarlos.</p>
<ul>
<li>HashMap calcula un índice de matriz a partir de <code translate="no">hash(key)</code> en lugar de buscarlo.</li>
<li>HDFS calcula el bloque de destino a partir del desplazamiento de un archivo en lugar de recorrer los metadatos del sistema de archivos.</li>
<li>Kafka calcula el segmento relevante y la posición del índice en lugar de escanear el registro.</li>
<li>Iceberg utiliza predicados y estadísticas a nivel de archivo para calcular qué archivos merece la pena leer.</li>
</ul>
<p>El cálculo es aritmético con un coste fijo. La búsqueda es un proceso transversal (comparaciones, búsqueda de punteros o E/S) cuyo coste aumenta con el tamaño de los datos. Cuando un sistema puede derivar una ubicación directamente, la búsqueda se vuelve innecesaria.</p>
<h3 id="2-Minimize-High-Latency-Accesses" class="common-anchor-header">2. Minimizar los accesos de alta latencia</h3><p>Esto nos lleva de nuevo a la fórmula central: <strong>Coste total de direccionamiento = accesos a metadatos + accesos a datos.</strong> Toda optimización tiene como objetivo último reducir estas operaciones de alta latencia.</p>
<table>
<thead>
<tr><th>Patrón</th><th>Ejemplo</th></tr>
</thead>
<tbody>
<tr><td>Reducir el número de archivos para limitar el desbordamiento de la API</td><td>Consolidación de segmentos Milvus V2</td></tr>
<tr><td>Uso de estadísticas para descartar datos antes de tiempo</td><td>Poda del manifiesto Iceberg</td></tr>
<tr><td>Caché de metadatos en memoria</td><td>HDFS NameNode, índices mmap de Kafka</td></tr>
<tr><td>Intercambio de pequeñas exploraciones secuenciales por menos lecturas aleatorias</td><td>Índice disperso de Kafka</td></tr>
</tbody>
</table>
<h3 id="3-Statistics-Enable-Early-Decisions" class="common-anchor-header">3. Las estadísticas permiten tomar decisiones tempranas</h3><p>El registro de información sencilla en el momento de la escritura -valores mínimos/máximos, límites de partición, recuento de filas- permite a los sistemas decidir en el momento de la lectura qué archivos merece la pena leer y cuáles pueden omitirse por completo.</p>
<p>Se trata de una pequeña inversión muy rentable. Las estadísticas hacen que el acceso a un archivo pase de ser una lectura a ciegas a una elección deliberada. Ya se trate de la poda a nivel de manifiesto de Iceberg o de las estadísticas de pie de página de Parquet de Milvus V2, el principio es el mismo: unos pocos bytes de metadatos en tiempo de escritura pueden eliminar miles de operaciones de E/S en tiempo de lectura.</p>
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
    </button></h2><p>De Two Sum a HashMap, y de HDFS y Kafka a Milvus y Apache Iceberg, hay un patrón que se repite: el rendimiento depende de la eficiencia con la que un sistema localiza los datos.</p>
<p>A medida que los datos crecen y el almacenamiento pasa de la memoria al disco y al almacenamiento de objetos, la mecánica cambia, pero las ideas centrales no. Los mejores sistemas calculan las ubicaciones en lugar de buscarlas, mantienen los metadatos cerca y utilizan estadísticas para evitar tocar datos que no importan. Todas las mejoras de rendimiento que hemos examinado proceden de la reducción de los accesos de alta latencia y de la reducción del espacio de búsqueda lo antes posible.</p>
<p>Tanto si está diseñando un canal de <a href="https://zilliz.com/learn/what-is-vector-search">búsqueda vectorial</a> como si está construyendo sistemas sobre <a href="https://zilliz.com/learn/introduction-to-unstructured-data">datos no estructurados</a> u optimizando un motor de consulta de lago, se aplica la misma ecuación. Comprender cómo su sistema aborda los datos es el primer paso para hacerlo más rápido.</p>
<hr>
<p>Si trabaja con Milvus y desea optimizar su almacenamiento o el rendimiento de sus consultas, nos encantaría ayudarle:</p>
<ul>
<li>Únase a la <a href="https://slack.milvus.io/">comunidad Milvus Slack</a> para hacer preguntas, compartir su arquitectura y aprender de otros ingenieros que trabajan en problemas similares.</li>
<li><a href="https://milvus.io/office-hours">Reserve una sesión gratuita de 20 minutos de Milvus Office Hours</a> para analizar su caso de uso, ya sea la disposición del almacenamiento, el ajuste de consultas o el escalado a producción.</li>
<li>Si prefiere saltarse la configuración de la infraestructura, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus gestionado) ofrece un nivel gratuito para empezar.</li>
</ul>
<hr>
<p>Algunas preguntas que surgen cuando los ingenieros empiezan a pensar en el direccionamiento de datos y el diseño del almacenamiento:</p>
<p><strong>P: ¿Por qué Milvus cambió del almacenamiento a nivel de campo al almacenamiento a nivel de segmento?</strong></p>
<p>En Milvus V1, cada campo se almacenaba en archivos binlog separados a través de segmentos. Para una colección con 100 campos y 1.000 segmentos, esto creaba cientos de miles de archivos pequeños, cada uno de los cuales requería su propia llamada a la API de S3. V2 consolida los datos en archivos Parquet basados en segmentos, reduciendo el número de archivos en más de 10 veces y la latencia de las consultas de minutos a segundos. La idea central: en el almacenamiento de objetos, el número de llamadas a la API importa más que el volumen total de datos.</p>
<p><strong>P: ¿Cómo gestiona Milvus eficientemente la búsqueda vectorial y el filtrado escalar?</strong></p>
<p>Milvus V2 almacena los <a href="https://milvus.io/docs/scalar_index.md">campos escalares</a> y <a href="https://milvus.io/docs/index-vector-fields.md">los campos vectoriales</a> en grupos de archivos separados dentro del mismo segmento. Las consultas escalares utilizan la poda de columnas de Parquet y las estadísticas de grupos de filas para omitir datos irrelevantes. La <a href="https://zilliz.com/learn/what-is-vector-search">búsqueda vectorial</a> utiliza <a href="https://zilliz.com/learn/vector-index">índices vectoriales</a> específicos. Ambos comparten la misma estructura de segmento, por lo que las <a href="https://zilliz.com/learn/hybrid-search-a-practical-guide">consultas híbridas</a> -que combinan filtros escalares con similitud vectorial- pueden operar sobre los mismos datos sin duplicación.</p>
<p><strong>P: ¿Se aplica el principio de "computación sobre búsqueda" a las bases de datos vectoriales?</strong></p>
<p>Sí. <a href="https://zilliz.com/learn/vector-index">Los índices vectoriales</a> como HNSW e IVF se basan en la misma idea. En lugar de comparar un vector de consulta con todos los vectores almacenados (búsqueda por fuerza bruta), utilizan estructuras de grafos o centros de conglomerados para calcular vecindades aproximadas y saltar directamente a las regiones relevantes del espacio vectorial. La contrapartida -una pequeña pérdida de precisión a cambio de un número de órdenes de magnitud menor en el cálculo de distancias- es el mismo patrón de "cálculo en lugar de búsqueda" aplicado a los datos de <a href="https://zilliz.com/glossary/vector-embeddings">incrustación</a> de alta dimensión.</p>
<p><strong>P: ¿Cuál es el mayor error de rendimiento que cometen los equipos con el almacenamiento de objetos?</strong></p>
<p>Crear demasiados archivos pequeños. Cada solicitud GET de S3 tiene una latencia mínima fija (~50 ms), independientemente de la cantidad de datos que devuelva. Un sistema que lee 10.000 archivos pequeños serializa 500 segundos de latencia, aunque el volumen total de datos sea modesto. La solución es la consolidación: fusionar archivos pequeños en otros más grandes, utilizar formatos columnares como Parquet para lecturas selectivas y mantener metadatos que permitan omitir archivos por completo.</p>
