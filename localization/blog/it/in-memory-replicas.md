---
id: in-memory-replicas.md
title: >-
  Aumentate il throughput di lettura del database vettoriale con le repliche in
  memoria
author: Congqi Xia
date: 2022-08-22T00:00:00.000Z
desc: >-
  Utilizzare le repliche in memoria per migliorare il throughput di lettura e
  l'utilizzo delle risorse hardware.
cover: assets.zilliz.com/in_memory_replica_af1fa21d61.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/in-memory-replicas.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/in_memory_replica_af1fa21d61.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>Immagine di copertina</span> </span></p>
<blockquote>
<p>Questo articolo è stato scritto da <a href="https://github.com/congqixia">Congqi Xia</a> e <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Con il suo rilascio ufficiale, Milvus 2.1 è dotato di molte nuove funzionalità per offrire comodità e una migliore esperienza d'uso. Sebbene il concetto di replica in-memory non sia una novità per il mondo dei database distribuiti, si tratta di una funzionalità fondamentale che può aiutare a incrementare le prestazioni e la disponibilità del sistema in modo semplice. Per questo motivo, questo post si propone di spiegare cos'è la replica in-memory e perché è importante, per poi introdurre come abilitare questa nuova funzionalità in Milvus, un database vettoriale per l'AI.</p>
<p><strong>Vai a:</strong></p>
<ul>
<li><p><a href="#Concepts-related-to-in-memory-replica">Concetti relativi alla replica in-memory</a></p></li>
<li><p><a href="#What-is-in-memory-replica">Cos'è la replica in-memory?</a></p></li>
<li><p><a href="#Why-are-in-memory-replicas-important">Perché le repliche in-memory sono importanti?</a></p></li>
<li><p><a href="#Enable-in-memory-replicas-in-the-Milvus-vector-database">Abilitare le repliche in-memory nel database vettoriale Milvus</a></p></li>
</ul>
<h2 id="Concepts-related-to-in-memory-replica" class="common-anchor-header">Concetti relativi alla replica in-memoria<button data-href="#Concepts-related-to-in-memory-replica" class="anchor-icon" translate="no">
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
    </button></h2><p>Prima di capire che cos'è la replica in-memory e perché è importante, è necessario comprendere alcuni concetti rilevanti, tra cui gruppo di replica, replica di shard, replica in streaming, replica storica e leader di shard. L'immagine seguente illustra questi concetti.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/diagram_1_525afc706a.jpg" alt="Replica_concepts" class="doc-image" id="replica_concepts" />
   </span> <span class="img-wrapper"> <span>Concetti di replica</span> </span></p>
<h3 id="Replica-group" class="common-anchor-header">Gruppo di replica</h3><p>Un gruppo di replica è costituito da più <a href="https://milvus.io/docs/v2.1.x/four_layers.md#Query-node">nodi di query</a> responsabili della gestione dei dati storici e delle repliche.</p>
<h3 id="Shard-replica" class="common-anchor-header">Replica shard</h3><p>Una replica shard consiste in una replica streaming e in una replica storica, entrambe appartenenti allo stesso <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Shard">shard</a> (cioè al canale DML). Più repliche shard costituiscono un gruppo di repliche. Il numero esatto di repliche shard in un gruppo di repliche è determinato dal numero di shard in una raccolta specifica.</p>
<h3 id="Streaming-replica" class="common-anchor-header">Replica in streaming</h3><p>Una replica in streaming contiene tutti i <a href="https://milvus.io/docs/v2.1.x/glossary.md#Segment">segmenti in crescita</a> dello stesso canale DML. Tecnicamente, una replica in streaming dovrebbe essere servita da un solo nodo di query in una replica.</p>
<h3 id="Historical-replica" class="common-anchor-header">Replica storica</h3><p>Una replica storica contiene tutti i segmenti sigillati dello stesso canale DML. I segmenti sigillati di una replica storica possono essere distribuiti su diversi nodi di query all'interno dello stesso gruppo di replica.</p>
<h3 id="Shard-leader" class="common-anchor-header">Leader dello shard</h3><p>Uno shard leader è il nodo di query che serve la replica in streaming in una replica shard.</p>
<h2 id="What-is-in-memory-replica" class="common-anchor-header">Che cos'è la replica in-memory?<button data-href="#What-is-in-memory-replica" class="anchor-icon" translate="no">
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
    </button></h2><p>L'abilitazione delle repliche in-memory consente di caricare i dati di una raccolta su più nodi di query, in modo da sfruttare le risorse extra di CPU e memoria. Questa funzione è molto utile se si dispone di un insieme di dati relativamente piccolo ma si desidera aumentare la velocità di lettura e migliorare l'utilizzo delle risorse hardware.</p>
<p>Per il momento, il database vettoriale Milvus conserva in memoria una replica per ogni segmento. Tuttavia, con le repliche in memoria, è possibile avere più repliche di un segmento su diversi nodi di interrogazione. Ciò significa che se un nodo di interrogazione sta conducendo una ricerca su un segmento, una nuova richiesta di ricerca in arrivo può essere assegnata a un altro nodo di interrogazione inattivo, poiché questo nodo di interrogazione ha una replica esattamente dello stesso segmento.</p>
<p>Inoltre, se disponiamo di più repliche in memoria, possiamo affrontare meglio la situazione in cui un nodo di query si blocca. Prima dovevamo aspettare che il segmento venisse ricaricato per poter continuare la ricerca su un altro nodo di query. Tuttavia, con la replica in-memory, la richiesta di ricerca può essere inviata immediatamente a un nuovo nodo di query senza dover ricaricare i dati.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/replication_3_1_2c25513cb9.jpg" alt="Replication" class="doc-image" id="replication" />
   </span> <span class="img-wrapper"> <span>La replica</span> </span></p>
<h2 id="Why-are-in-memory-replicas-important" class="common-anchor-header">Perché le repliche in-memory sono importanti?<button data-href="#Why-are-in-memory-replicas-important" class="anchor-icon" translate="no">
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
    </button></h2><p>Uno dei vantaggi più significativi dell'abilitazione delle repliche in-memory è l'aumento del QPS (query per secondo) e del throughput complessivo. Inoltre, è possibile mantenere più repliche di segmento e il sistema è più resiliente in caso di failover.</p>
<h2 id="Enable-in-memory-replicas-in-the-Milvus-vector-database" class="common-anchor-header">Abilitazione delle repliche in-memory nel database vettoriale Milvus<button data-href="#Enable-in-memory-replicas-in-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Abilitare la nuova funzione delle repliche in-memory è facile nel database vettoriale Milvus. È sufficiente specificare il numero di repliche che si desidera quando si carica una collezione (cioè chiamando <code translate="no">collection.load()</code>).</p>
<p>Nell'esempio seguente, supponiamo di aver già <a href="https://milvus.io/docs/v2.1.x/create_collection.md">creato una collezione</a> denominata "libro" e di avervi <a href="https://milvus.io/docs/v2.1.x/insert_data.md">inserito dei dati</a>. Si può quindi eseguire il seguente comando per creare due repliche quando si <a href="https://milvus.io/docs/v2.1.x/load_collection.md">carica</a> un insieme di libri.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> Collection
collection = Collection(<span class="hljs-string">&quot;book&quot;</span>)      <span class="hljs-comment"># Get an existing collection.</span>
collection.load(replica_number=<span class="hljs-number">2</span>) <span class="hljs-comment"># load collection as 2 replicas</span>
<button class="copy-code-btn"></button></code></pre>
<p>È possibile modificare in modo flessibile il numero di repliche nell'esempio di codice sopra riportato, per adattarlo al meglio al proprio scenario applicativo. È quindi possibile eseguire direttamente una <a href="https://milvus.io/docs/v2.1.x/search.md">ricerca</a> o una <a href="https://milvus.io/docs/v2.1.x/query.md">query</a> di somiglianza vettoriale su più repliche senza eseguire altri comandi. Tuttavia, va notato che il numero massimo di repliche consentito è limitato dalla quantità totale di memoria utilizzabile per eseguire i nodi della query. Se il numero di repliche specificato supera i limiti della memoria utilizzabile, verrà restituito un errore durante il caricamento dei dati.</p>
<p>È inoltre possibile verificare le informazioni delle repliche in memoria create eseguendo <code translate="no">collection.get_replicas()</code>. Verranno restituite le informazioni dei gruppi di repliche e dei corrispondenti nodi di query e shard. Di seguito è riportato un esempio di output.</p>
<pre><code translate="no">Replica <span class="hljs-built_in">groups</span>:
- Group: &lt;group_id:435309823872729305&gt;, &lt;group_nodes:(21, 20)&gt;, &lt;shards:[Shard: &lt;channel_name:milvus-zong-rootcoord-dml_27_435367661874184193v0&gt;, &lt;shard_leader:21&gt;, &lt;shard_nodes:[21]&gt;, Shard: &lt;channel_name:milvus-zong-rootcoord-dml_28_435367661874184193v1&gt;, &lt;shard_leader:20&gt;, &lt;shard_nodes:[20, 21]&gt;]&gt;
- Group: &lt;group_id:435309823872729304&gt;, &lt;group_nodes:(25,)&gt;, &lt;shards:[Shard: &lt;channel_name:milvus-zong-rootcoord-dml_28_435367661874184193v1&gt;, &lt;shard_leader:25&gt;, &lt;shard_nodes:[25]&gt;, Shard: &lt;channel_name:milvus-zong-rootcoord-dml_27_435367661874184193v0&gt;, &lt;shard_leader:25&gt;, &lt;shard_nodes:[25]&gt;]&gt;
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-next" class="common-anchor-header">Il prossimo passo<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Con il rilascio ufficiale di Milvus 2.1, abbiamo preparato una serie di blog che introducono le nuove funzionalità. Per saperne di più, leggete questa serie di blog:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Come utilizzare i dati delle stringhe per potenziare le applicazioni di ricerca per similarità</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Utilizzo di Milvus incorporato per installare ed eseguire immediatamente Milvus con Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Aumentare la velocità di lettura del database vettoriale con le repliche in memoria</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Capire il livello di consistenza nel database vettoriale Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Capire il livello di consistenza del database vettoriale Milvus (parte II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">In che modo il database vettoriale Milvus garantisce la sicurezza dei dati?</a></li>
</ul>
