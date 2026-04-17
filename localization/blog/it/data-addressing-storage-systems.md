---
id: data-addressing-storage-systems.md
title: >-
  Un'immersione profonda nell'indirizzamento dei dati nei sistemi di
  archiviazione: Da HashMap a HDFS, Kafka, Milvus e Iceberg
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
  Scoprite come funziona l'indirizzamento dei dati da HashMap a HDFS, Kafka,
  Milvus e Iceberg - e perché le posizioni di calcolo battono la ricerca su ogni
  scala.
origin: 'https://milvus.io/blog/data-addressing-storage-systems.md'
---
<p>Se lavorate su sistemi di backend o di storage distribuito, probabilmente vi sarà capitato di assistere a questa situazione: la rete non è satura, le macchine non sono sovraccariche, eppure una semplice ricerca comporta migliaia di I/O su disco o di chiamate API per lo storage di oggetti, e la query impiega comunque pochi secondi.</p>
<p>Il collo di bottiglia raramente è la larghezza di banda o il calcolo. È l'<em>indirizzamento</em>, ovvero il lavoro che un sistema fa per capire dove si trovano i dati prima di poterli leggere. L <strong>'indirizzamento dei dati</strong> è il processo di traduzione di un identificatore logico (una chiave, un percorso di file, un offset, un predicato di query) nella posizione fisica dei dati sullo storage. In scala, questo processo - e non il trasferimento effettivo dei dati - domina la latenza.</p>
<p>Le prestazioni dello storage possono essere ridotte a un semplice modello:</p>
<blockquote>
<p><strong>Costo totale di indirizzamento = accessi ai metadati + accessi ai dati.</strong></p>
</blockquote>
<p>Quasi tutte le ottimizzazioni dello storage, dalle tabelle hash ai livelli di metadati lakehouse, mirano a questa equazione. Le tecniche variano, ma l'obiettivo è sempre lo stesso: individuare i dati con il minor numero possibile di operazioni ad alta latenza.</p>
<p>Questo articolo ripercorre questa idea attraverso sistemi di scala crescente, dalle strutture di dati in-memory come HashMap, ai sistemi distribuiti come HDFS e Apache Kafka, fino ai moderni motori come <a href="https://milvus.io/">Milvus</a> (un <a href="https://zilliz.com/learn/what-is-a-vector-database">database vettoriale</a>) e Apache Iceberg che operano su storage a oggetti. Nonostante le differenze, tutti ottimizzano la stessa equazione.</p>
<h2 id="Three-Core-Addressing-Techniques" class="common-anchor-header">Tre tecniche di indirizzamento fondamentali<button data-href="#Three-Core-Addressing-Techniques" class="anchor-icon" translate="no">
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
    </button></h2><p>Nei sistemi di archiviazione e nei motori distribuiti, la maggior parte delle ottimizzazioni dell'indirizzamento rientra in tre tecniche:</p>
<ul>
<li><strong>Calcolo</strong> - Deriva la posizione dei dati direttamente da una formula, invece di scansionare o attraversare le strutture per trovarli.</li>
<li><strong>Caching</strong> - Mantenere in memoria i metadati o gli indici a cui si accede di frequente, per evitare letture ripetute ad alta latenza dal disco o dallo storage remoto.</li>
<li><strong>Pruning</strong> - Utilizzare le informazioni sull'intervallo o i confini delle partizioni per escludere file, shard o nodi che non possono contenere il risultato.</li>
</ul>
<p>In questo articolo, per <em>accesso</em> si intende qualsiasi operazione con un costo reale a livello di sistema: una lettura del disco, una chiamata di rete o una richiesta di API per lo storage degli oggetti. Il calcolo della CPU a livello di nanosecondo non conta. Ciò che conta è ridurre il numero di operazioni di I/O o trasformare il costoso I/O casuale in letture sequenziali più economiche.</p>
<h2 id="How-Addressing-Works-The-Two-Sum-Problem" class="common-anchor-header">Come funziona l'indirizzamento: Il problema delle due somme<button data-href="#How-Addressing-Works-The-Two-Sum-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>Per rendere concreto l'indirizzamento, si consideri un classico problema di algoritmo. Dato un array di numeri interi <code translate="no">nums</code> e un valore di destinazione <code translate="no">target</code>, restituire gli indici di due numeri la cui somma è <code translate="no">target</code>.</p>
<p>Ad esempio: <code translate="no">nums = [2, 7, 11, 15]</code>, <code translate="no">target = 9</code> → risultato <code translate="no">[0, 1]</code>.</p>
<p>Questo problema illustra chiaramente la differenza tra la ricerca di dati e il calcolo della loro posizione.</p>
<h3 id="Solution-1-Brute-Force-Search" class="common-anchor-header">Soluzione 1: Ricerca a forza bruta</h3><p>L'approccio a forza bruta controlla ogni coppia. Per ogni elemento, scansiona il resto dell'array alla ricerca di una corrispondenza. Semplice, ma O(n²).</p>
<pre><code translate="no" class="language-java"><span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-built_in">int</span>[] <span class="hljs-title">twoSum</span>(<span class="hljs-params"><span class="hljs-built_in">int</span>[] nums, <span class="hljs-built_in">int</span> target</span>)</span> {
    <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> i = <span class="hljs-number">0</span>; i &lt; nums.length; i++) {
        <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> j = i + <span class="hljs-number">1</span>; j &lt; nums.length; j++) {
            <span class="hljs-keyword">if</span> (nums[i] + nums[j] == target) <span class="hljs-keyword">return</span> <span class="hljs-keyword">new</span> <span class="hljs-built_in">int</span>[]{i, j};
        }
    }
    <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>;
}
<button class="copy-code-btn"></button></code></pre>
<p>Non si sa dove possa trovarsi la risposta. Ogni ricerca parte da zero e attraversa l'array alla cieca. Il collo di bottiglia non è l'aritmetica, ma la scansione ripetuta.</p>
<h3 id="Solution-2-Direct-Addressing-via-Computation" class="common-anchor-header">Soluzione 2: indirizzamento diretto tramite calcolo</h3><p>La soluzione ottimizzata sostituisce la scansione con una HashMap. Invece di cercare un valore corrispondente, calcola il valore necessario e lo cerca direttamente. La complessità del tempo scende a O(n).</p>
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
<p>Il cambiamento: invece di scansionare l'array per trovare una corrispondenza, si calcola il valore necessario e si va direttamente alla sua posizione. Una volta che la posizione può essere ricavata, l'attraversamento scompare.</p>
<p>Questa è la stessa idea alla base di ogni sistema di archiviazione ad alte prestazioni che esamineremo: sostituire le scansioni con il calcolo e i percorsi di ricerca indiretti con l'indirizzamento diretto.</p>
<h2 id="HashMap-How-Computed-Addresses-Replace-Scans" class="common-anchor-header">HashMap: Come gli indirizzi calcolati sostituiscono le scansioni<button data-href="#HashMap-How-Computed-Addresses-Replace-Scans" class="anchor-icon" translate="no">
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
    </button></h2><p>Una HashMap memorizza coppie chiave-valore e individua i valori calcolando un indirizzo dalla chiave, non cercando tra le voci. Data una chiave, applica una funzione hash, calcola un indice di array e salta direttamente a quella posizione. Non è necessaria alcuna scansione.</p>
<p>Questa è la forma più semplice del principio che guida tutti i sistemi presentati in questo articolo: evitare le scansioni ricavando le posizioni attraverso il calcolo. La stessa idea, che è alla base di tutto, dalla ricerca distribuita di metadati agli <a href="https://zilliz.com/learn/vector-index">indici vettoriali</a>, è presente in ogni scala.</p>
<h3 id="The-Core-Data-Structure" class="common-anchor-header">La struttura dati principale</h3><p>Nel suo nucleo, una HashMap è costruita attorno a una singola struttura: un array. Una funzione hash mappa le chiavi in indici di array. Poiché lo spazio delle chiavi è molto più grande dell'array, le collisioni sono inevitabili: chiavi diverse possono avere lo stesso indice. Queste vengono gestite localmente all'interno di ogni slot utilizzando un elenco collegato o un albero rosso-nero.</p>
<p>Gli array offrono un accesso in tempo costante per indice. Questa proprietà - l'indirizzamento diretto e prevedibile - è alla base delle prestazioni delle HashMap ed è lo stesso principio che sta alla base dell'accesso efficiente ai dati nei sistemi di archiviazione su larga scala.</p>
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
<h3 id="How-Does-a-HashMap-Locate-Data" class="common-anchor-header">Come fa una HashMap a localizzare i dati?</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_2_4ada70fe33.png" alt="Step-by-step HashMap addressing: hash the key, compute the array index, jump directly to the bucket, and resolve locally — achieving O(1) lookup without traversal" class="doc-image" id="step-by-step-hashmap-addressing:-hash-the-key,-compute-the-array-index,-jump-directly-to-the-bucket,-and-resolve-locally-—-achieving-o(1)-lookup-without-traversal" />
   </span> <span class="img-wrapper"> <span>Indirizzamento HashMap passo dopo passo: hash della chiave, calcolo dell'indice dell'array, salto diretto al bucket e risoluzione locale, per ottenere una ricerca O(1) senza attraversamento.</span> </span></p>
<p>Prendiamo come esempio <code translate="no">put(&quot;apple&quot;, 100)</code>. L'intera ricerca richiede quattro passaggi, senza scansione dell'intera tabella:</p>
<ol>
<li><strong>Hash della chiave:</strong> Passare la chiave attraverso una funzione di hash → <code translate="no">hash(&quot;apple&quot;) = 93029210</code></li>
<li><strong>Mappatura su un indice di array:</strong> <code translate="no">93029210 &amp; (arrayLength - 1)</code> → ad esempio, <code translate="no">93029210 &amp; 15 = 10</code></li>
<li><strong>Saltare al bucket:</strong> Accedere direttamente a <code translate="no">table[10]</code> - un singolo accesso alla memoria, non una traversata.</li>
<li><strong>Risolvere localmente:</strong> Se non ci sono collisioni, leggere o scrivere immediatamente. Se c'è una collisione, controllare un piccolo elenco collegato o un albero rosso-nero all'interno del bucket.</li>
</ol>
<h3 id="Why-Is-HashMap-Lookup-O1" class="common-anchor-header">Perché la ricerca di HashMap è O(1)?</h3><p>L'accesso agli array è O(1) grazie a una semplice formula di indirizzamento:</p>
<pre><code translate="no">element_address = base_address + index × element_size
<button class="copy-code-btn"></button></code></pre>
<p>Dato un indice, l'indirizzo di memoria viene calcolato con una moltiplicazione e un'addizione. Il costo è fisso, indipendentemente dalla dimensione dell'array: un calcolo, una lettura della memoria. Un elenco collegato, invece, deve essere attraversato nodo per nodo, seguendo i puntatori attraverso posizioni di memoria separate: O(n) nel caso peggiore.</p>
<p>Una HashMap esegue l'hash di una chiave in un indice di array, trasformando quella che sarebbe una traversata in un indirizzo calcolato. Invece di cercare i dati, calcola esattamente dove si trovano e vi salta.</p>
<h2 id="How-Does-Addressing-Change-in-Distributed-Systems" class="common-anchor-header">Come cambia l'indirizzamento nei sistemi distribuiti?<button data-href="#How-Does-Addressing-Change-in-Distributed-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>HashMap risolve l'indirizzamento all'interno di una singola macchina, dove i dati vivono in memoria e i costi di accesso sono banali. Su scale maggiori, i vincoli cambiano drasticamente:</p>
<table>
<thead>
<tr><th>Fattore di scala</th><th>Impatto</th></tr>
</thead>
<tbody>
<tr><td>Dimensione dei dati</td><td>Megabyte → terabyte o petabyte su cluster</td></tr>
<tr><td>Mezzo di memorizzazione</td><td>Memoria → disco → rete → memorizzazione degli oggetti</td></tr>
<tr><td>Latenza di accesso</td><td>Memoria: ~100 ns / Disco: 10-20 ms / Rete Same-DC: ~0,5 ms / Cross-region: ~150 ms</td></tr>
</tbody>
</table>
<p>Il problema dell'indirizzamento non cambia: diventa solo più costoso. Ogni ricerca può comportare salti di rete e I/O su disco, quindi la riduzione del numero di accessi è molto più importante che in memoria.</p>
<p>Per vedere come i sistemi reali gestiscono questo problema, esaminiamo due esempi classici. HDFS applica l'indirizzamento basato sul calcolo a file di grandi dimensioni e basati su blocchi. Kafka lo applica ai flussi di messaggi di sola appendice. Entrambi seguono lo stesso principio: calcolare dove si trovano i dati invece di cercarli.</p>
<h2 id="HDFS-Addressing-Large-Files-with-In-Memory-Metadata" class="common-anchor-header">HDFS: indirizzare file di grandi dimensioni con metadati in memoria<button data-href="#HDFS-Addressing-Large-Files-with-In-Memory-Metadata" class="anchor-icon" translate="no">
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
    </button></h2><p>HDFS è un sistema <a href="https://milvus.io/docs/architecture_overview.md">di archiviazione distribuito</a> progettato per file molto grandi su cluster di macchine. Dato un percorso di file e un offset di byte, deve trovare il blocco di dati giusto e il DataNode che lo memorizza.</p>
<p>HDFS risolve questo problema con una scelta progettuale deliberata: mantenere tutti i metadati del filesystem in memoria.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_1_26ff6257b1.png" alt="HDFS data organization showing logical view of a 300MB file mapped to physical storage as three blocks distributed across DataNodes with replication" class="doc-image" id="hdfs-data-organization-showing-logical-view-of-a-300mb-file-mapped-to-physical-storage-as-three-blocks-distributed-across-datanodes-with-replication" />
   </span> <span class="img-wrapper"> <span>L'organizzazione dei dati di HDFS mostra la vista logica di un file di 300 MB mappato sullo storage fisico come tre blocchi distribuiti tra i DataNode con replica</span> </span>.</p>
<p>Al centro si trova il NameNode. Carica in memoria l'intero albero del filesystem: struttura delle directory, mappature da file a blocco e mappature da blocco a DataNode. Poiché i metadati non vengono mai toccati dal disco durante la lettura, HDFS risolve tutti i problemi di indirizzamento solo attraverso ricerche in memoria.</p>
<p>Concettualmente, si tratta di HashMap su scala cluster: utilizzare strutture di dati in-memory per trasformare le ricerche lente in ricerche veloci e calcolate. La differenza è che HDFS applica lo stesso principio a insiemi di dati distribuiti su migliaia di macchine.</p>
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
<h3 id="How-Does-HDFS-Locate-Data" class="common-anchor-header">Come fa HDFS a localizzare i dati?</h3><p>Consideriamo la lettura di dati all'offset di 200 MB di <code translate="no">/user/data/bigfile.txt</code>, con una dimensione di blocco predefinita di 128 MB:</p>
<ol>
<li>Il client invia un singolo RPC al NameNode.</li>
<li>Il NameNode risolve il percorso del file e calcola che l'offset 200 MB rientra nel secondo blocco (intervallo 128-256 MB), interamente in memoria.</li>
<li>Il NameNode restituisce i DataNode che memorizzano il blocco (ad esempio, DN2 e DN3).</li>
<li>Il client legge direttamente dal DataNode più vicino (DN2)</li>
</ol>
<p>Costo totale: una RPC, qualche ricerca in memoria, una lettura di dati. I metadati non vengono mai letti su disco durante questo processo e ogni ricerca è a tempo costante. HDFS evita le costose scansioni dei metadati anche quando i dati scalano su cluster di grandi dimensioni.</p>
<h2 id="Apache-Kafka-How-Sparse-Indexing-Avoids-Random-IO" class="common-anchor-header">Apache Kafka: Come l'indicizzazione sparsa evita l'I/O casuale<button data-href="#Apache-Kafka-How-Sparse-Indexing-Avoids-Random-IO" class="anchor-icon" translate="no">
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
    </button></h2><p>Apache Kafka è stato progettato per flussi di messaggi ad alta velocità. Dato un offset di un messaggio, deve individuare l'esatta posizione del byte sul disco, senza trasformare le letture in I/O casuale.</p>
<p>Kafka combina l'archiviazione sequenziale con un indice rado in memoria. Invece di cercare tra i dati, calcola una posizione approssimativa ed esegue una piccola scansione limitata.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_4_6af2d2cf97.png" alt="Kafka data organization showing logical view with topics and partitions mapped to physical storage as partition directories containing .log, .index, and .timeindex segment files" class="doc-image" id="kafka-data-organization-showing-logical-view-with-topics-and-partitions-mapped-to-physical-storage-as-partition-directories-containing-.log,-.index,-and-.timeindex-segment-files" />
   </span> <span class="img-wrapper"> <span>L'organizzazione dei dati di Kafka mostra una vista logica con argomenti e partizioni mappati sullo storage fisico come directory di partizione contenenti file di segmento .log, .index e .timeindex</span> </span>.</p>
<p>I messaggi sono organizzati come Argomento → Partizione → Segmento. Ogni partizione è un registro di sola appendice suddiviso in segmenti, ciascuno dei quali è costituito da:</p>
<ul>
<li>un file <code translate="no">.log</code> che memorizza i messaggi in modo sequenziale su disco</li>
<li>Un file <code translate="no">.index</code> che funge da indice sparso nel registro.</li>
</ul>
<p>Il file <code translate="no">.index</code> è mappato in memoria (mmap), quindi le ricerche dell'indice vengono effettuate direttamente dalla memoria senza I/O su disco.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_3_0e4e99b226.png" alt="Kafka sparse index design showing one index entry per 4KB of data, with memory comparison: dense index at 800MB versus sparse index at just 2MB resident in memory" class="doc-image" id="kafka-sparse-index-design-showing-one-index-entry-per-4kb-of-data,-with-memory-comparison:-dense-index-at-800mb-versus-sparse-index-at-just-2mb-resident-in-memory" />
   </span> <span class="img-wrapper"> <span>Il design dell'indice sparse di Kafka mostra una voce dell'indice per 4KB di dati, con un confronto di memoria: indice denso a 800MB contro indice sparse a soli 2MB residenti in memoria</span> </span></p>
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
<h3 id="How-Does-Kafka-Locate-Data" class="common-anchor-header">Come fa Kafka a localizzare i dati?</h3><p>Supponiamo che un consumatore legga il messaggio all'offset 500.000. Kafka risolve questo problema in tre passi:</p>
<p><strong>1. Individuazione del segmento</strong> (ricerca su TreeMap)</p>
<ul>
<li>Offset di base del segmento: <code translate="no">[0, 367834, 735668, 1103502]</code></li>
<li><code translate="no">floorEntry(500000)</code> → <code translate="no">baseOffset = 367834</code></li>
<li>File di destinazione: <code translate="no">00000000000000367834.log</code></li>
<li>Complessità temporale: O(log S), dove S è il numero di segmenti (in genere &lt; 100).</li>
</ul>
<p><strong>2. Cercare la posizione nell'indice sparse</strong> (.index)</p>
<ul>
<li>Offset relativo: <code translate="no">500000 − 367834 = 132166</code></li>
<li>Ricerca binaria in <code translate="no">.index</code>: trovare la voce più grande ≤ 132166 → <code translate="no">[132100 → position 20500000]</code></li>
<li>Complessità temporale: O(log N), dove N è il numero di voci dell'indice.</li>
</ul>
<p><strong>3. Lettura sequenziale dal log</strong> (.log)</p>
<ul>
<li>Iniziare la lettura dalla posizione 20.500.000</li>
<li>Continuare fino a raggiungere l'offset 500.000</li>
<li>Viene scansionato al massimo un intervallo di indice (~4 KB)</li>
</ul>
<p>Totale: una ricerca del segmento in memoria, una ricerca dell'indice, una breve lettura sequenziale. Nessun accesso casuale al disco.</p>
<h2 id="HDFS-vs-Apache-Kafka" class="common-anchor-header">HDFS vs. Apache Kafka<button data-href="#HDFS-vs-Apache-Kafka" class="anchor-icon" translate="no">
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
<tr><th>Dimensione</th><th>HDFS</th><th>Kafka</th></tr>
</thead>
<tbody>
<tr><td>Obiettivo di progettazione</td><td>Memorizzazione e lettura efficiente di file di grandi dimensioni</td><td>Lettura/scrittura sequenziale ad alta velocità di flussi di messaggi</td></tr>
<tr><td>Modello di indirizzamento</td><td>Percorso → blocco → DataNode tramite HashMaps in memoria</td><td>Offset → segmento → posizione tramite indice sparse + scansione sequenziale</td></tr>
<tr><td>Memorizzazione dei metadati</td><td>Centralizzata nella memoria del NameNode</td><td>File locali, mappati in memoria tramite mmap</td></tr>
<tr><td>Costo di accesso per ricerca</td><td>1 RPC + N letture di blocchi</td><td>1 ricerca di indici + 1 lettura di dati</td></tr>
<tr><td>Ottimizzazione chiave</td><td>Tutti i metadati in memoria - nessun disco nel percorso di ricerca</td><td>L'indicizzazione sparsa e il layout sequenziale evitano l'I/O casuale.</td></tr>
</tbody>
</table>
<h2 id="Why-Object-Storage-Changes-the-Addressing-Problem" class="common-anchor-header">Perché lo storage a oggetti cambia il problema dell'indirizzamento<button data-href="#Why-Object-Storage-Changes-the-Addressing-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>Da HashMap a HDFS e Kafka, abbiamo visto l'indirizzamento in memoria e nello storage distribuito classico. Con l'evoluzione dei carichi di lavoro, i requisiti continuano a crescere:</p>
<ul>
<li><strong>Query più ricche.</strong> I sistemi moderni gestiscono filtri multi-campo, <a href="https://zilliz.com/glossary/similarity-search">ricerca per similarità</a> e predicati complessi, non solo semplici chiavi e offset.</li>
<li><strong>Archiviazione a oggetti come impostazione predefinita.</strong> I dati vivono sempre più spesso in archivi compatibili con S3. I file sono distribuiti tra i vari bucket e ogni accesso è una chiamata API con una latenza fissa dell'ordine di decine di millisecondi, anche per pochi kilobyte.</li>
</ul>
<p>A questo punto, il collo di bottiglia è la latenza, non la larghezza di banda. Una singola richiesta S3 GET costa ~50 ms, indipendentemente dalla quantità di dati restituiti. Se una query genera migliaia di richieste di questo tipo, la latenza totale aumenta. La minimizzazione del fan-out dell'API diventa il vincolo centrale della progettazione.</p>
<p>Esamineremo due sistemi moderni - <a href="https://milvus.io/">Milvus</a>, un <a href="https://zilliz.com/learn/what-is-a-vector-database">database vettoriale</a>, e Apache Iceberg, un formato di tabella lakehouse - per vedere come affrontano queste sfide. Nonostante le differenze, entrambi applicano le stesse idee di base: minimizzare gli accessi ad alta latenza, ridurre precocemente il fan-out e privilegiare il calcolo rispetto all'attraversamento.</p>
<h2 id="Milvus-V1-When-Field-Level-Storage-Creates-Too-Many-Files" class="common-anchor-header">Milvus V1: Quando l'archiviazione a livello di campo crea troppi file<button data-href="#Milvus-V1-When-Field-Level-Storage-Creates-Too-Many-Files" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus è un database vettoriale molto diffuso, progettato per la <a href="https://zilliz.com/glossary/similarity-search">ricerca di similarità</a> su <a href="https://zilliz.com/glossary/vector-embeddings">incorporazioni vettoriali</a>. Il suo progetto iniziale di archiviazione riflette un primo approccio comune alla costruzione di un archivio di oggetti: archiviare ogni campo separatamente.</p>
<p>Nella V1, ogni campo di una <a href="https://milvus.io/docs/manage-collections.md">collezione</a> è memorizzato in file binlog separati tra i vari <a href="https://milvus.io/docs/glossary.md">segmenti</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_5_08cf1c8ec1.png" alt="Milvus V1 storage layout showing a collection split into segments, with each segment storing fields like id, vector, and scalar data in separate binlog files, plus separate stats_log files for file statistics" class="doc-image" id="milvus-v1-storage-layout-showing-a-collection-split-into-segments,-with-each-segment-storing-fields-like-id,-vector,-and-scalar-data-in-separate-binlog-files,-plus-separate-stats_log-files-for-file-statistics" />
   </span> <span class="img-wrapper"> <span>Il layout di archiviazione di Milvus V1 mostra una collezione divisa in segmenti, con ogni segmento che memorizza campi come id, vettori e dati scalari in file binlog separati, oltre a file stats_log separati per le statistiche dei file</span> </span>.</p>
<h3 id="How-Does-Milvus-V1-Locate-Data" class="common-anchor-header">Come Milvus V1 individua i dati?</h3><p>Consideriamo una semplice interrogazione: <code translate="no">SELECT id, vector FROM collection WHERE id = 123</code>.</p>
<ol>
<li><strong>Ricerca dei metadati</strong> - Interrogazione di etcd/MySQL per l'elenco dei segmenti → <code translate="no">[Segment 12345, 12346, 12347, …]</code></li>
<li><strong>Leggere il campo id tra i segmenti</strong> - Per ogni segmento, leggere i file binlog id</li>
<li><strong>Individuare la riga di destinazione</strong> - Eseguire la scansione dei dati id caricati per trovare <code translate="no">id = 123</code></li>
<li><strong>Leggere il campo vettoriale</strong> - Leggere i file binlog vettoriali corrispondenti per il segmento corrispondente</li>
</ol>
<p>Totale accessi ai file: <strong>N × (F₁ + F₂ + ...)</strong> dove N = numero di segmenti, F = file binlog per campo.</p>
<p>I conti si fanno presto difficili. Per una raccolta con 100 campi, 1.000 segmenti e 5 file binlog per campo:</p>
<blockquote>
<p><strong>1.000 × 100 × 5 = 500.000 file.</strong></p>
</blockquote>
<p>Anche se una query tocca solo tre campi, si tratta di 15.000 chiamate all'API di archiviazione degli oggetti. Con 50 ms per richiesta S3, la latenza serializzata raggiunge i <strong>750 secondi</strong>, oltre 12 minuti per una singola query.</p>
<h2 id="Milvus-V2-How-Segment-Level-Parquet-Cuts-API-Calls-by-10x" class="common-anchor-header">Milvus V2: Come il Parquet a livello di segmento riduce le chiamate API di 10 volte<button data-href="#Milvus-V2-How-Segment-Level-Parquet-Cuts-API-Calls-by-10x" class="anchor-icon" translate="no">
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
    </button></h2><p>Per risolvere i limiti di scalabilità della V1, Milvus V2 apporta un cambiamento fondamentale: organizzare i dati per <a href="https://milvus.io/docs/glossary.md">segmento</a> anziché per campo. Invece di molti piccoli file binlog, la V2 consolida i dati in file Parquet basati su segmenti.</p>
<p>Il numero di file scende da <code translate="no">N × fields × binlogs</code> a circa <code translate="no">N</code> (un gruppo di file per segmento).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_7_95db65a6e0.png" alt="Milvus V2 storage layout showing a segment stored as Parquet files with row groups containing column chunks for id, vector, and timestamp, plus a footer with schema and column statistics" class="doc-image" id="milvus-v2-storage-layout-showing-a-segment-stored-as-parquet-files-with-row-groups-containing-column-chunks-for-id,-vector,-and-timestamp,-plus-a-footer-with-schema-and-column-statistics" />
   </span> <span class="img-wrapper"> <span>Il layout di archiviazione di Milvus V2 mostra un segmento memorizzato come file Parquet con gruppi di righe contenenti gruppi di colonne per id, vettore e timestamp, oltre a un piè di pagina con lo schema e le statistiche delle colonne.</span> </span></p>
<p>Ma la V2 non memorizza tutti i campi in un unico file. Raggruppa i campi per dimensione:</p>
<ul>
<li>I<strong> <a href="https://milvus.io/docs/scalar_index.md">campi scalari</a> piccoli</strong> (come id, timestamp) sono memorizzati insieme.</li>
<li>I<strong>campi grandi</strong> (come i <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">vettori densi</a>) sono divisi in file dedicati.</li>
</ul>
<p>Tutti i file appartengono allo stesso segmento e le righe sono allineate per indice tra i file.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_9_fe4f57a1e0.png" alt="Parquet file structure showing row groups with column chunks and compressed data pages, plus a footer containing file metadata, row group metadata, and column statistics like min/max values" class="doc-image" id="parquet-file-structure-showing-row-groups-with-column-chunks-and-compressed-data-pages,-plus-a-footer-containing-file-metadata,-row-group-metadata,-and-column-statistics-like-min/max-values" />
   </span> <span class="img-wrapper"> <span>Struttura del file Parquet che mostra i gruppi di righe con i pezzi di colonna e le pagine di dati compressi, oltre a un piè di pagina contenente i metadati del file, i metadati dei gruppi di righe e le statistiche delle colonne, come i valori minimi e massimi</span> </span>.</p>
<h3 id="How-Does-Milvus-V2-Locate-Data" class="common-anchor-header">Come Milvus V2 individua i dati?</h3><p>Per la stessa query - <code translate="no">SELECT id, vector FROM collection WHERE id = 123</code>:</p>
<ol>
<li><strong>Ricerca dei metadati</strong> - Recupera l'elenco dei segmenti → <code translate="no">[12345, 12346, …]</code></li>
<li><strong>Leggere i piè di pagina di Parquet</strong> - Estrarre le statistiche dei gruppi di righe. Controllare il min/max della colonna id per gruppo di righe. <code translate="no">id = 123</code> rientra nel gruppo di righe 0 (min=1, max=1000).</li>
<li><strong>Leggere solo ciò che è necessario</strong> - La potatura delle colonne di Parquet legge solo la colonna id dal file a campo ridotto e solo la colonna <a href="https://milvus.io/docs/index-vector-fields.md">vettore</a> dal file a campo grande. Si accede solo ai gruppi di righe corrispondenti.</li>
</ol>
<p>La suddivisione dei campi grandi offre due vantaggi fondamentali:</p>
<ul>
<li><strong>Letture più efficienti.</strong> Le <a href="https://zilliz.com/glossary/vector-embeddings">incorporazioni vettoriali</a> dominano le dimensioni della memoria. Insieme ai campi piccoli, limitano il numero di righe che possono essere inserite in un gruppo di righe, aumentando gli accessi al file. Isolandoli, i gruppi di righe di campi piccoli possono contenere molte più righe, mentre i campi grandi utilizzano layout ottimizzati per le loro dimensioni.</li>
<li><strong>Evoluzione flessibile <a href="https://milvus.io/docs/schema.md">dello schema</a>.</strong> Aggiungere una colonna significa creare un nuovo file. Rimuoverne una significa saltarla in lettura. Non è necessario riscrivere i dati storici.</li>
</ul>
<p>Il risultato: il numero di file si riduce di oltre 10 volte, le chiamate API di oltre 10 volte e la latenza delle query passa da minuti a secondi.</p>
<h2 id="Milvus-V1-vs-V2" class="common-anchor-header">Milvus V1 vs V2<button data-href="#Milvus-V1-vs-V2" class="anchor-icon" translate="no">
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
<tr><th>Aspetto</th><th>V1</th><th>V2</th></tr>
</thead>
<tbody>
<tr><td>Organizzazione dei file</td><td>Diviso per campo</td><td>Integrato per segmento</td></tr>
<tr><td>File per collezione</td><td>N × campi × binlog</td><td>~N × gruppi di colonne</td></tr>
<tr><td>Formato di archiviazione</td><td>Binlog personalizzato</td><td>Parquet (supporta anche Lance e Vortex)</td></tr>
<tr><td>Potenziamento delle colonne</td><td>Naturale (file a livello di campo)</td><td>Potenziamento delle colonne Parquet</td></tr>
<tr><td>Statistiche</td><td>File stats_log separati</td><td>Incorporato nel footer di Parquet</td></tr>
<tr><td>Chiamate API S3 per query</td><td>10,000+</td><td>~1,000</td></tr>
<tr><td>Latenza della query</td><td>Minuti</td><td>Secondi</td></tr>
</tbody>
</table>
<h2 id="Apache-Iceberg-Metadata-Driven-File-Pruning" class="common-anchor-header">Apache Iceberg: Potenziamento dei file guidato dai metadati<button data-href="#Apache-Iceberg-Metadata-Driven-File-Pruning" class="anchor-icon" translate="no">
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
    </button></h2><p>Apache Iceberg gestisce tabelle analitiche su enormi insiemi di dati in sistemi lakehouse. Quando una tabella si estende su migliaia di file di dati, la sfida consiste nel restringere una query ai soli file rilevanti, senza scansionare tutto.</p>
<p>La risposta di Iceberg: decidere quali file leggere <em>prima che</em> avvenga l'I/O dei dati, utilizzando metadati stratificati. È lo stesso principio che sta alla base del <a href="https://zilliz.com/learn/metadata-filtering-with-milvus">filtraggio dei metadati</a> nei database vettoriali: utilizzare statistiche precalcolate per saltare i dati irrilevanti.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_8_a9b063bdbe.png" alt="Iceberg data organization showing a metadata directory with metadata.json, manifest lists, and manifest files alongside a data directory with date-partitioned Parquet files" class="doc-image" id="iceberg-data-organization-showing-a-metadata-directory-with-metadata.json,-manifest-lists,-and-manifest-files-alongside-a-data-directory-with-date-partitioned-parquet-files" />
   </span> <span class="img-wrapper"> <span>L'organizzazione dei dati di Iceberg mostra una directory di metadati con metadata.json, elenchi di manifest e file di manifest accanto a una directory di dati con file Parquet suddivisi per data</span> </span>.</p>
<p>Iceberg utilizza una struttura di metadati a strati. Ogni livello filtra i dati irrilevanti prima che venga consultato il successivo, in modo simile a come i <a href="https://milvus.io/docs/architecture_overview.md">database distribuiti</a> separano i metadati dai dati per un accesso efficiente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_6_afc159ea22.png" alt="Iceberg four-layer architecture: metadata.json points to manifest lists, which reference manifest files containing file-level statistics, which point to actual Parquet data files" class="doc-image" id="iceberg-four-layer-architecture:-metadata.json-points-to-manifest-lists,-which-reference-manifest-files-containing-file-level-statistics,-which-point-to-actual-parquet-data-files" />
   </span> <span class="img-wrapper"> <span>Architettura a quattro livelli di Iceberg: metadata.json punta a elenchi di manifest, che fanno riferimento a file di manifest contenenti statistiche a livello di file, che puntano ai file di dati Parquet veri e propri.</span> </span></p>
<h3 id="How-Does-Iceberg-Locate-Data" class="common-anchor-header">Come fa Iceberg a localizzare i dati?</h3><p>Si consideri: <code translate="no">SELECT * FROM orders WHERE date='2024-01-15' AND amount&gt;1000</code>.</p>
<ol>
<li><strong>Leggere metadata.json</strong> (1 I/O) - Caricare lo snapshot corrente e i suoi elenchi manifesti</li>
<li><strong>Leggere l'elenco dei manifesti</strong> (1 I/O) - Applicare filtri <a href="https://milvus.io/docs/use-partition-key.md">a livello di partizione</a> per saltare intere partizioni (ad esempio, tutti i dati 2023 vengono eliminati)</li>
<li><strong>Leggere i file manifest</strong> (2 I/O) - Usare le statistiche a livello di file (data minima/massima, quantità minima/massima) per eliminare i file che non corrispondono alla query.</li>
<li><strong>Lettura dei file di dati</strong> (3 I/O) - Rimangono solo tre file che vengono effettivamente letti.</li>
</ol>
<p>Invece di scansionare tutti i 1.000 file di dati, Iceberg completa la ricerca in <strong>7 operazioni di I/O</strong>, evitando oltre il 94% delle letture non necessarie.</p>
<h2 id="How-Different-Systems-Address-Data" class="common-anchor-header">Come i diversi sistemi affrontano i dati<button data-href="#How-Different-Systems-Address-Data" class="anchor-icon" translate="no">
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
<tr><th>Sistema</th><th>Organizzazione dei dati</th><th>Meccanismo di indirizzamento principale</th><th>Costo di accesso</th></tr>
</thead>
<tbody>
<tr><td>HashMap</td><td>Chiave → slot dell'array</td><td>Funzione hash → indice diretto</td><td>Accesso alla memoria O(1)</td></tr>
<tr><td>HDFS</td><td>Percorso → blocco → DataNode</td><td>HashMaps in-memory + calcolo del blocco</td><td>1 RPC + N letture di blocchi</td></tr>
<tr><td>Kafka</td><td>Argomento → Partizione → Segmento</td><td>TreeMap + indice sparso + scansione sequenziale</td><td>1 ricerca dell'indice + 1 lettura dei dati</td></tr>
<tr><td><a href="https://milvus.io/">Milvus</a> V2</td><td><a href="https://milvus.io/docs/manage-collections.md">Raccolta</a> → Segmento → Colonne Parquet</td><td>Ricerca dei metadati + potatura delle colonne</td><td>N letture (N = segmenti)</td></tr>
<tr><td>Iceberg</td><td>Tabella → Istantanea → Manifesto → File di dati</td><td>Metadati stratificati + potatura statistica</td><td>3 letture di metadati + M letture di dati</td></tr>
</tbody>
</table>
<h2 id="Three-Principles-Behind-Efficient-Data-Addressing" class="common-anchor-header">Tre principi alla base di un indirizzamento efficiente dei dati<button data-href="#Three-Principles-Behind-Efficient-Data-Addressing" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Computation-Always-Beats-Search" class="common-anchor-header">1. Il calcolo batte sempre la ricerca</h3><p>In tutti i sistemi esaminati, l'ottimizzazione più efficace segue la stessa regola: calcolare dove si trovano i dati invece di cercarli.</p>
<ul>
<li>HashMap calcola l'indice di un array da <code translate="no">hash(key)</code> invece di effettuare una scansione.</li>
<li>HDFS calcola il blocco di destinazione a partire dall'offset di un file, invece di esplorare i metadati del filesystem.</li>
<li>Kafka calcola il segmento rilevante e la posizione dell'indice invece di eseguire la scansione del log.</li>
<li>Iceberg usa i predicati e le statistiche a livello di file per calcolare quali file valgono la pena di essere letti.</li>
</ul>
<p>Il calcolo è aritmetico con un costo fisso. La ricerca è un'operazione di attraversamento - confronti, ricerca di puntatori o I/O - il cui costo cresce con la dimensione dei dati. Quando un sistema può ricavare direttamente una posizione, la scansione diventa superflua.</p>
<h3 id="2-Minimize-High-Latency-Accesses" class="common-anchor-header">2. Ridurre al minimo gli accessi ad alta latenza</h3><p>Questo ci riporta alla formula principale: <strong>Costo totale dell'indirizzamento = accessi ai metadati + accessi ai dati.</strong> Ogni ottimizzazione mira a ridurre queste operazioni ad alta latenza.</p>
<table>
<thead>
<tr><th>Schema</th><th>Esempio</th></tr>
</thead>
<tbody>
<tr><td>Riduzione del numero di file per limitare il fan-out dell'API</td><td>Consolidamento del segmento Milvus V2</td></tr>
<tr><td>Utilizzare le statistiche per escludere i dati in anticipo</td><td>Potenziamento dei manifesti Iceberg</td></tr>
<tr><td>Cache dei metadati in memoria</td><td>NameNode HDFS, indici mmap Kafka</td></tr>
<tr><td>Scambiare piccole scansioni sequenziali per un minor numero di letture casuali</td><td>Indice sparso di Kafka</td></tr>
</tbody>
</table>
<h3 id="3-Statistics-Enable-Early-Decisions" class="common-anchor-header">3. Le statistiche consentono di prendere decisioni tempestive</h3><p>La registrazione di semplici informazioni in fase di scrittura (valori minimi/massimi, confini delle partizioni, conteggio delle righe) consente ai sistemi di decidere in fase di lettura quali file valgono la pena di essere letti e quali possono essere completamente saltati.</p>
<p>Si tratta di un piccolo investimento con un grande ritorno. Le statistiche trasformano l'accesso ai file da una lettura cieca a una scelta deliberata. Che si tratti del pruning a livello di manifest di Iceberg o delle statistiche del footer di Parquet di Milvus V2, il principio è lo stesso: pochi byte di metadati in fase di scrittura possono eliminare migliaia di operazioni di I/O in fase di lettura.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusione<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Da Two Sum a HashMap, da HDFS e Kafka a Milvus e Apache Iceberg, uno schema continua a ripetersi: le prestazioni dipendono dall'efficienza con cui un sistema individua i dati.</p>
<p>Con la crescita dei dati e il passaggio dalla memoria al disco e all'archiviazione a oggetti, le meccaniche cambiano, ma non le idee di base. I sistemi migliori calcolano le posizioni invece di cercare, mantengono i metadati vicini e usano le statistiche per evitare di toccare dati non importanti. Tutti i vantaggi in termini di prestazioni che abbiamo esaminato derivano dalla riduzione degli accessi ad alta latenza e dal restringimento dello spazio di ricerca il più presto possibile.</p>
<p>Sia che stiate progettando una pipeline di <a href="https://zilliz.com/learn/what-is-vector-search">ricerca vettoriale</a>, sia che stiate costruendo sistemi su <a href="https://zilliz.com/learn/introduction-to-unstructured-data">dati non strutturati</a>, sia che stiate ottimizzando un motore di query lakehouse, vale la stessa equazione. Capire come il vostro sistema affronta i dati è il primo passo per renderlo più veloce.</p>
<hr>
<p>Se lavorate con Milvus e volete ottimizzare le prestazioni di archiviazione o di interrogazione, saremo lieti di aiutarvi:</p>
<ul>
<li>Unitevi alla <a href="https://slack.milvus.io/">community Milvus su Slack</a> per porre domande, condividere la vostra architettura e imparare da altri ingegneri che lavorano su problemi simili.</li>
<li><a href="https://milvus.io/office-hours">Prenotate una sessione gratuita di 20 minuti di Milvus Office Hours</a> per analizzare il vostro caso d'uso, che si tratti di layout di storage, messa a punto di query o scalata verso la produzione.</li>
<li>Se preferite evitare la configurazione dell'infrastruttura, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (gestito da Milvus) offre un livello gratuito per iniziare.</li>
</ul>
<hr>
<p>Alcune domande che sorgono quando gli ingegneri iniziano a pensare all'indirizzamento dei dati e alla progettazione dello storage:</p>
<p><strong>D: Perché Milvus è passato dallo storage a livello di campo a quello a livello di segmento?</strong></p>
<p>In Milvus V1, ogni campo era memorizzato in file binlog separati tra i segmenti. Per una raccolta con 100 campi e 1.000 segmenti, si creavano centinaia di migliaia di piccoli file, ognuno dei quali richiedeva una propria chiamata API S3. V2 consolida i dati in file Parquet basati su segmenti, riducendo il numero di file di oltre 10 volte e riducendo la latenza delle query da minuti a secondi. L'intuizione principale: sullo storage a oggetti, il numero di chiamate API è più importante del volume totale dei dati.</p>
<p><strong>D: Come fa Milvus a gestire in modo efficiente sia la ricerca vettoriale che il filtraggio scalare?</strong></p>
<p>Milvus V2 memorizza i <a href="https://milvus.io/docs/scalar_index.md">campi scalari</a> e i <a href="https://milvus.io/docs/index-vector-fields.md">campi vettoriali</a> in gruppi di file separati all'interno dello stesso segmento. Le query scalari utilizzano il potenziamento delle colonne di Parquet e le statistiche dei gruppi di righe per saltare i dati irrilevanti. La <a href="https://zilliz.com/learn/what-is-vector-search">ricerca vettoriale</a> utilizza <a href="https://zilliz.com/learn/vector-index">indici vettoriali</a> dedicati. Entrambe condividono la stessa struttura di segmento, quindi <a href="https://zilliz.com/learn/hybrid-search-a-practical-guide">le query ibride</a> - che combinano filtri scalari e similarità vettoriale - possono operare sugli stessi dati senza duplicazioni.</p>
<p><strong>D: Il principio della "prevalenza del calcolo sulla ricerca" si applica ai database vettoriali?</strong></p>
<p>Sì. <a href="https://zilliz.com/learn/vector-index">Gli indici vettoriali</a> come HNSW e IVF si basano sulla stessa idea. Invece di confrontare un vettore interrogato con ogni vettore memorizzato (ricerca bruta), utilizzano strutture a grafo o centri di cluster per calcolare quartieri approssimativi e saltare direttamente alle regioni rilevanti dello spazio vettoriale. Il compromesso - una piccola perdita di precisione per un numero di ordini di grandezza inferiore di calcoli di distanza - è lo stesso modello di "calcolo su ricerca" applicato ai dati <a href="https://zilliz.com/glossary/vector-embeddings">di incorporazione</a> ad alta dimensione.</p>
<p><strong>D: Qual è il più grande errore di performance che i team commettono con lo storage a oggetti?</strong></p>
<p>Creare troppi file di piccole dimensioni. Ogni richiesta S3 GET ha una latenza fissa (~50 ms), indipendentemente dalla quantità di dati restituiti. Un sistema che legge 10.000 piccoli file serializza 500 secondi di latenza, anche se il volume totale dei dati è modesto. La soluzione è il consolidamento: unire file piccoli in file più grandi, usare formati colonnari come Parquet per letture selettive e mantenere metadati che consentano di saltare completamente i file.</p>
