---
id: 2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md
title: Utilizzo
author: Lichen Wang
date: 2022-02-07T00:00:00.000Z
desc: >-
  Il progetto cardine della funzione di cancellazione di Milvus 2.0, il database
  vettoriale più avanzato al mondo.
cover: assets.zilliz.com/Delete_9f40bbfa94.png
tag: Engineering
---
<custom-h1>Come Milvus elimina i dati in streaming in un cluster distribuito</custom-h1><p>Grazie all'elaborazione unificata di batch e stream e all'architettura cloud-native, Milvus 2.0 ha posto una sfida maggiore rispetto al suo predecessore durante lo sviluppo della funzione DELETE. Grazie al suo design avanzato di disaggregazione storage-computazione e al meccanismo flessibile di pubblicazione/sottoscrizione, siamo orgogliosi di annunciare che ci siamo riusciti. In Milvus 2.0, è possibile cancellare un'entità in una determinata collezione con la sua chiave primaria, in modo che l'entità cancellata non venga più elencata nei risultati di una ricerca o di una query.</p>
<p>Si noti che l'operazione DELETE in Milvus si riferisce alla cancellazione logica, mentre la pulizia fisica dei dati avviene durante la Compattazione dei dati. La cancellazione logica non solo aumenta notevolmente le prestazioni di ricerca limitate dalla velocità di I/O, ma facilita anche il recupero dei dati. I dati eliminati logicamente possono essere recuperati con l'aiuto della funzione Time Travel.</p>
<h2 id="Usage" class="common-anchor-header">Utilizzo<button data-href="#Usage" class="anchor-icon" translate="no">
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
    </button></h2><p>Proviamo innanzitutto la funzione DELETE di Milvus 2.0. (L'esempio seguente utilizza PyMilvus 2.0.0 su Milvus 2.0.0).</p>
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
<h2 id="Implementation" class="common-anchor-header">Implementazione<button data-href="#Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>In un'istanza Milvus, un nodo dati è principalmente responsabile dell'impacchettamento dei dati in streaming (registri nel log broker) come dati storici (istantanee dei registri) e del loro scarico automatico nella memoria degli oggetti. Un nodo di interrogazione esegue le richieste di ricerca sui dati completi, cioè sia sui dati in streaming che sui dati storici.</p>
<p>Per sfruttare al meglio la capacità di scrittura dei dati dei nodi paralleli di un cluster, Milvus adotta una strategia di sharding basata sull'hashing delle chiavi primarie per distribuire uniformemente le operazioni di scrittura ai diversi nodi worker. In altre parole, il proxy instrada i messaggi DML (Data Manipulation Language) (cioè le richieste) di un'entità verso lo stesso nodo dati e lo stesso nodo di interrogazione. Questi messaggi vengono pubblicati attraverso il canale DML e consumati dal nodo dati e dal nodo di interrogazione separatamente per fornire servizi di ricerca e interrogazione insieme.</p>
<h3 id="Data-node" class="common-anchor-header">Nodo dati</h3><p>Dopo aver ricevuto i messaggi INSERT, il nodo dati inserisce i dati in un segmento in crescita, che è un nuovo segmento creato per ricevere i dati in streaming in memoria. Se il conteggio delle righe di dati o la durata del segmento in crescita raggiunge la soglia, il nodo dati lo sigilla per impedire l'arrivo di dati. Il nodo dati quindi scarica il segmento sigillato, che contiene i dati storici, nella memoria degli oggetti. Nel frattempo, il nodo dati genera un filtro bloom basato sulle chiavi primarie dei nuovi dati e lo archivia nella memoria oggetti insieme al segmento sigillato, salvando il filtro bloom come parte del registro binario delle statistiche (binlog), che contiene le informazioni statistiche del segmento.</p>
<blockquote>
<p>Un filtro bloom è una struttura dati probabilistica che consiste in un lungo vettore binario e in una serie di funzioni di mappatura casuale. Può essere utilizzato per verificare se un elemento è un membro di un insieme, ma potrebbe restituire false corrispondenze positive.           -- Wikipedia</p>
</blockquote>
<p>Quando arrivano i messaggi di DELETE dei dati, il nodo dei dati esegue un buffer di tutti i filtri bloom nello shard corrispondente e li abbina alle chiavi primarie fornite nei messaggi per recuperare tutti i segmenti (sia quelli in crescita che quelli sigillati) che potrebbero includere le entità da cancellare. Dopo aver individuato i segmenti corrispondenti, il nodo dati li bufferizza in memoria per generare i binlog Delta per registrare le operazioni di cancellazione, e poi scarica questi binlog insieme ai segmenti nello storage degli oggetti.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_node_2397ad70c3.png" alt="Data Node" class="doc-image" id="data-node" />
   </span> <span class="img-wrapper"> <span>Nodo dati</span> </span></p>
<p>Poiché a uno shard è assegnato un solo canale DML, i nodi di query aggiunti al cluster non saranno in grado di sottoscrivere il canale DML. Per garantire che tutti i nodi di interrogazione possano ricevere i messaggi DELETE, i nodi dati filtrano i messaggi DELETE dal canale DML e li inoltrano al canale Delta per notificare a tutti i nodi di interrogazione le operazioni di cancellazione.</p>
<h3 id="Query-node" class="common-anchor-header">Nodo di interrogazione</h3><p>Quando si carica una collezione dall'archivio oggetti, il nodo di query ottiene innanzitutto il checkpoint di ogni shard, che segna le operazioni DML dall'ultima operazione di flush. Sulla base del checkpoint, il nodo di query carica tutti i segmenti sigillati insieme ai loro filtri binlog e bloom Delta. Una volta caricati tutti i dati, il nodo di query si iscrive al DML-Channel, al Delta-Channel e al Query-Channel.</p>
<p>Se arrivano altri messaggi INSERT dopo che la raccolta è stata caricata in memoria, il nodo di query individua prima i segmenti in crescita in base ai messaggi e aggiorna i filtri bloom corrispondenti in memoria solo a scopo di query. Questi filtri bloom dedicati alla query non verranno scaricati nella memoria degli oggetti al termine della query.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_node_a78b1d664f.png" alt="Query Node" class="doc-image" id="query-node" />
   </span> <span class="img-wrapper"> <span>Nodo di interrogazione</span> </span></p>
<p>Come già detto, solo un certo numero di nodi di query può ricevere messaggi DELETE dal canale DML, il che significa che solo loro possono eseguire le richieste DELETE in segmenti crescenti. I nodi di interrogazione che si sono iscritti al canale DML filtrano prima i messaggi DELETE nei segmenti in crescita, individuano le entità facendo corrispondere le chiavi primarie fornite con i filtri bloom dei segmenti in crescita dedicati alla query e quindi registrano le operazioni di cancellazione nei segmenti corrispondenti.</p>
<p>I nodi di interrogazione che non possono sottoscrivere il canale DML possono elaborare solo richieste di ricerca o di interrogazione su segmenti sigillati, perché possono solo sottoscrivere il canale Delta e ricevere i messaggi DELETE inoltrati dai nodi dati. Dopo aver raccolto tutti i messaggi DELETE nei segmenti sigillati dal Delta-Channel, i nodi di interrogazione localizzano le entità facendo corrispondere le chiavi primarie fornite con i filtri bloom dei segmenti sigillati e quindi registrano le operazioni di cancellazione nei segmenti corrispondenti.</p>
<p>Alla fine, in una ricerca o in un'interrogazione, i nodi di interrogazione generano un set di bit basato sui record di cancellazione per omettere le entità cancellate e cercare tra le entità rimanenti di tutti i segmenti, indipendentemente dallo stato del segmento. Infine, il livello di coerenza influisce sulla visibilità dei dati cancellati. Con il livello di consistenza Strong (come mostrato nell'esempio di codice precedente), le entità cancellate sono immediatamente invisibili dopo l'eliminazione. Se invece si adotta il livello di consistenza Bounded, ci saranno diversi secondi di latenza prima che le entità cancellate diventino invisibili.</p>
<h2 id="Whats-next" class="common-anchor-header">Cosa succederà in seguito?<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Nella serie di blog sulle nuove funzionalità 2.0, ci proponiamo di spiegare il design delle nuove funzionalità. Leggete di più in questa serie di blog!</p>
<ul>
<li><a href="https://milvus.io/blog/2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md">Come Milvus elimina i dati in streaming in un cluster distribuito</a></li>
<li><a href="https://milvus.io/blog/2022-2-21-compact.md">Come compattare i dati in Milvus?</a></li>
<li><a href="https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md">Come Milvus bilancia il carico delle query tra i nodi?</a></li>
<li><a href="https://milvus.io/blog/2022-2-14-bitset.md">Come Bitset consente la versatilità della ricerca per similarità vettoriale</a></li>
</ul>
