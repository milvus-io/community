---
id: >-
  how-to-cut-vector-database-costs-by-up-to-80-a-practical-milvus-optimization-guide.md
title: >-
  Come ridurre i costi dei database vettoriali fino all'80%: Guida pratica
  all'ottimizzazione di Milvus
author: Jack Li
date: 2026-3-20
cover: assets.zilliz.com/cover_reduce_vdb_cost_by_80_56ed2fe3ae.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus cost optimization, vector database cost reduction, RAG cost
  optimization, HNSW vs IVF_SQ8, vector search cost
meta_title: |
  Milvus Cost Optimization Guide: Cut Vector Database Costs by Up to 80%
desc: >-
  Milvus è gratuito, ma l'infrastruttura non lo è. Scoprite come ridurre i costi
  di memoria dei database vettoriali del 60-80% con indici migliori, MMap e
  storage a livelli.
origin: >-
  https://milvus.io/blog/how-to-cut-vector-database-costs-by-up-to-80-a-practical-milvus-optimization-guide.md
---
<p>Il vostro prototipo di RAG funzionava benissimo. Poi è entrato in produzione, il traffico è cresciuto e ora il conto del database vettoriale è passato da 500 a 5.000 dollari al mese. Vi suona familiare?</p>
<p>Questo è uno dei problemi di scalabilità più comuni nelle applicazioni di intelligenza artificiale. Avete costruito qualcosa che crea un valore reale, ma i costi dell'infrastruttura crescono più velocemente della vostra base di utenti. E quando si guarda al conto, il database vettoriale è spesso la sorpresa più grande: nelle implementazioni che abbiamo visto, può rappresentare circa il 40-50% del costo totale dell'applicazione, secondo solo alle chiamate API LLM.</p>
<p>In questa guida, vi illustrerò dove vanno effettivamente a finire i soldi e le cose specifiche che potete fare per ridurli, in molti casi del 60-80%. Utilizzerò <a href="https://milvus.io/">Milvus</a>, il più popolare database vettoriale open-source, come esempio principale poiché è quello che conosco meglio, ma i principi si applicano alla maggior parte dei database vettoriali.</p>
<p><em>Per essere chiari:</em> <em><a href="https://milvus.io/">Milvus</a></em> <em>stesso è gratuito e open source - non si paga mai il software. Il costo deriva interamente dall'infrastruttura su cui viene eseguito: istanze cloud, memoria, storage e rete. La buona notizia è che la maggior parte dei costi dell'infrastruttura sono riducibili.</em></p>
<h2 id="Where-Does-the-Money-Actually-Go-When-Using-a-VectorDB" class="common-anchor-header">Dove va effettivamente il denaro quando si usa un VectorDB?<button data-href="#Where-Does-the-Money-Actually-Go-When-Using-a-VectorDB" class="anchor-icon" translate="no">
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
    </button></h2><p>Cominciamo con un esempio concreto. Supponiamo di avere 100 milioni di vettori, 768 dimensioni, memorizzati come float32 - una tipica configurazione RAG. Ecco i costi mensili di AWS:</p>
<table>
<thead>
<tr><th><strong>Componente di costo</strong></th><th><strong>Quota</strong></th><th><strong>~Costo mensile</strong></th><th><strong>Note</strong></th></tr>
</thead>
<tbody>
<tr><td>Elaborazione (CPU + memoria)</td><td>85-90%</td><td>$2,800</td><td>Il più grande - per lo più guidato dalla memoria</td></tr>
<tr><td>Rete</td><td>5-10%</td><td>$250</td><td>Traffico cross-AZ, payload di risultati di grandi dimensioni</td></tr>
<tr><td>Memoria</td><td>2-5%</td><td>$100</td><td>Economico: lo storage a oggetti (S3/MinIO) è di ~$0,03/GB</td></tr>
</tbody>
</table>
<p>Il risultato è semplice: la memoria è la destinazione dell'85-90% del denaro. La rete e l'archiviazione sono importanti ai margini, ma se volete tagliare i costi in modo significativo, la memoria è la leva principale. Tutto il contenuto di questa guida si concentra su questo aspetto.</p>
<p><strong>Una breve nota su rete e storage:</strong> È possibile ridurre i costi di rete restituendo solo i campi necessari (ID, punteggio, metadati chiave) ed evitando le query interregionali. Per quanto riguarda l'archiviazione, Milvus separa già l'archiviazione dal calcolo: i vettori si trovano in uno storage a oggetti a basso costo come S3, quindi anche con 100 milioni di vettori, l'archiviazione è di solito inferiore a 50 dollari al mese. Nessuno di questi due elementi sposta l'ago della bilancia come l'ottimizzazione della memoria.</p>
<h2 id="Why-Memory-Is-So-Expensive-for-Vector-Search" class="common-anchor-header">Perché la memoria è così costosa per la ricerca vettoriale<button data-href="#Why-Memory-Is-So-Expensive-for-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Se si proviene da database tradizionali, i requisiti di memoria per la ricerca vettoriale possono essere sorprendenti. Un database relazionale può sfruttare gli indici B-tree su disco e la cache delle pagine del sistema operativo. La ricerca vettoriale è diversa: comporta calcoli massicci in virgola mobile e indici come HNSW o IVF devono rimanere caricati in memoria per garantire una latenza di millisecondi.</p>
<p>Ecco una formula rapida per stimare il fabbisogno di memoria:</p>
<p><strong>Memoria necessaria = (vettori × dimensioni × 4 byte) × moltiplicatore dell'indice</strong></p>
<p>Per il nostro esempio 100M × 768 × float32 con HNSW (moltiplicatore ~1,8x):</p>
<ul>
<li>Dati grezzi: 100M × 768 × 4 byte ≈ 307 GB</li>
<li>Con indice HNSW: 307 GB × 1,8 ≈ 553 GB</li>
<li>Con overhead del sistema operativo, cache e headroom: ~768 GB totali</li>
<li>Su AWS: 3× r6i.8xlarge (256 GB ciascuno) ≈ $2.800/mese</li>
</ul>
<p><strong>Questa è la base di partenza. Ora vediamo come ridurla.</strong></p>
<h2 id="1-Pick-the-Right-Index-to-Get-4x-Less-Memory-Usage" class="common-anchor-header">1. Scegliere l'indice giusto per ottenere un consumo di memoria 4 volte inferiore<button data-href="#1-Pick-the-Right-Index-to-Get-4x-Less-Memory-Usage" class="anchor-icon" translate="no">
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
    </button></h2><p>Questa è la modifica a più alto impatto che si possa fare. Per lo stesso dataset di 100 milioni di vettori, l'utilizzo della memoria può variare di 4-6 volte a seconda della scelta dell'indice.</p>
<ul>
<li><strong>FLAT / IVF_FLAT</strong>: quasi nessuna compressione, quindi l'utilizzo della memoria rimane vicino alla dimensione dei dati grezzi, circa <strong>300 GB</strong>.</li>
<li><strong>HNSW</strong>: memorizza una struttura grafica aggiuntiva, quindi l'utilizzo della memoria è di solito <strong>da 1,5x a 2,0x</strong> rispetto alla dimensione dei dati grezzi, ovvero circa <strong>450-600 GB.</strong></li>
<li><strong>IVF_SQ8</strong>: comprime i valori float32 in uint8, ottenendo una <strong>compressione</strong> di circa <strong>4 volte</strong>, quindi l'uso della memoria può scendere a circa <strong>75-100 GB</strong>.</li>
<li><strong>IVF_PQ / DiskANN</strong>: utilizzano una compressione più forte o un indice basato su disco, per cui la memoria può scendere ulteriormente a circa <strong>30-60 GB</strong>.</li>
</ul>
<p>Molti team iniziano con HNSW perché ha la migliore velocità di interrogazione, ma finiscono per pagare 3-5 volte di più del necessario.</p>
<p>Ecco come si confrontano i principali tipi di indice:</p>
<table>
<thead>
<tr><th><strong>Indice</strong></th><th><strong>Moltiplicatore di memoria</strong></th><th><strong>Velocità di interrogazione</strong></th><th><strong>Richiamo</strong></th><th><strong>Il migliore per</strong></th></tr>
</thead>
<tbody>
<tr><td>PIATTO</td><td>~1.0x</td><td>Lento</td><td>100%</td><td>Piccoli insiemi di dati (&lt;1M), test</td></tr>
<tr><td>IVF_FLAT</td><td>~1.05x</td><td>Medio</td><td>95-99%</td><td>Uso generale</td></tr>
<tr><td>FIV_SQ8</td><td>~0.30x</td><td>Media</td><td>93-97%</td><td>Produzione sensibile ai costi (consigliata)</td></tr>
<tr><td>FIV_PQ</td><td>~0.12x</td><td>Veloce</td><td>70-80%</td><td>Insiemi di dati molto grandi, recupero grossolano</td></tr>
<tr><td>HNSW</td><td>~1.8x</td><td>Molto veloce</td><td>98-99%</td><td>Solo quando la latenza è più importante del costo</td></tr>
<tr><td>DiscoANN</td><td>~0.08x</td><td>Medio</td><td>95-98%</td><td>Scala molto ampia con SSD NVMe</td></tr>
</tbody>
</table>
<p><strong>Il risultato finale:</strong> Il passaggio da HNSW o IVF_FLAT a IVF_SQ8 in genere riduce il richiamo solo del 2-3% (ad esempio, dal 97% al 94-95%), mentre riduce il costo della memoria di circa il 70%. Per la maggior parte dei carichi di lavoro RAG, questo compromesso vale assolutamente la pena. Se state facendo un recupero grossolano o la vostra barra di precisione è più bassa, IVF_PQ o IVF_RABITQ possono aumentare ulteriormente i risparmi.</p>
<p><strong>Il mio consiglio:</strong> Se si utilizza HNSW in produzione e il costo è un problema, provare prima IVF_SQ8 su una raccolta di prova. Misurare il richiamo sulle query effettive. La maggior parte dei team è sorpresa da quanto sia ridotto il calo di accuratezza.</p>
<h2 id="2-Stop-Loading-Everything-into-Memory-for-60-80-Cost-Reduction" class="common-anchor-header">2. Smettere di caricare tutto in memoria per ridurre i costi del 60%-80%.<button data-href="#2-Stop-Loading-Everything-into-Memory-for-60-80-Cost-Reduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Anche dopo aver scelto un indice più efficiente, potreste avere in memoria più dati del necessario. Milvus offre due modi per risolvere questo problema: <strong>MMap (disponibile dalla versione 2.3) e la memorizzazione a livelli (disponibile dalla versione 2.6). Entrambi possono ridurre l'uso della memoria del 60-80%.</strong></p>
<p>L'idea alla base di entrambi è la stessa: non tutti i dati devono essere sempre in memoria. La differenza sta nel modo in cui gestiscono i dati che non sono in memoria.</p>
<h3 id="MMap-Memory-Mapped-Files" class="common-anchor-header">MMap (file mappati in memoria)</h3><p>MMap mappa i file di dati dal disco locale nello spazio degli indirizzi del processo. L'intero set di dati rimane sul disco locale del nodo e il sistema operativo carica le pagine in memoria su richiesta, solo quando vi si accede. Prima di usare MMap, tutti i dati vengono scaricati dallo storage degli oggetti (S3/MinIO) sul disco locale del QueryNode.</p>
<ul>
<li>L'utilizzo della memoria scende a circa il 10-30% della modalità a pieno carico.</li>
<li>La latenza rimane stabile e prevedibile (i dati sono sul disco locale, senza fetch di rete).</li>
<li>Contropartita: il disco locale deve essere abbastanza grande da contenere l'intero set di dati.</li>
</ul>
<h3 id="Tiered-Storage" class="common-anchor-header">Archiviazione a livelli</h3><p>Lo storage a livelli fa un ulteriore passo avanti. Invece di scaricare tutto sul disco locale, utilizza il disco locale come cache per i dati caldi e mantiene l'object storage come livello primario. I dati vengono recuperati dallo storage a oggetti solo quando necessario.</p>
<ul>
<li>L'utilizzo della memoria scende a &lt;10% della modalità a pieno carico.</li>
<li>Anche l'uso del disco locale diminuisce: solo i dati caldi vengono memorizzati nella cache (di solito il 10-30% del totale).</li>
<li>Contropartita: le mancanze della cache aggiungono 50-200 ms di latenza (recupero dallo storage degli oggetti).</li>
</ul>
<h3 id="Data-flow-and-resource-usage" class="common-anchor-header">Flusso di dati e utilizzo delle risorse</h3><table>
<thead>
<tr><th><strong>Modalità</strong></th><th><strong>Flusso di dati</strong></th><th><strong>Utilizzo della memoria</strong></th><th><strong>Utilizzo del disco locale</strong></th><th><strong>Latenza</strong></th></tr>
</thead>
<tbody>
<tr><td>Tradizionale a pieno carico</td><td>Memorizzazione degli oggetti → memoria (100%)</td><td>Molto alta (100%)</td><td>Bassa (solo temporanea)</td><td>Molto bassa e stabile</td></tr>
<tr><td>MMap</td><td>Memorizzazione degli oggetti → disco locale (100%) → memoria (su richiesta)</td><td>Bassa (10-30%)</td><td>Alta (100%)</td><td>Basso e stabile</td></tr>
<tr><td>Archiviazione a livelli</td><td>Archiviazione a oggetti ↔ cache locale (dati caldi) → memoria (su richiesta)</td><td>Molto basso (&lt;10%)</td><td>Basso (solo dati caldi)</td><td>Basso livello di hit della cache, alto livello di miss della cache</td></tr>
</tbody>
</table>
<p><strong>Raccomandazioni sull'hardware:</strong> entrambi i metodi dipendono fortemente dall'I/O locale del disco, pertanto si consiglia vivamente di utilizzare <strong>unità SSD NVMe</strong>, idealmente con <strong>IOPS superiori a 10.000</strong>.</p>
<h3 id="MMap-vs-Tiered-Storage-Which-One-Should-You-Use" class="common-anchor-header">MMap vs. archiviazione a livelli: Quale utilizzare?</h3><table>
<thead>
<tr><th><strong>La vostra situazione</strong></th><th><strong>Utilizzare questo metodo</strong></th><th><strong>Perché</strong></th></tr>
</thead>
<tbody>
<tr><td>Sensibile alla latenza (P99 &lt; 20 ms)</td><td>MMap</td><td>I dati sono già sul disco locale - nessun fetch di rete, latenza stabile</td></tr>
<tr><td>Accesso uniforme (nessuna divisione netta tra caldo e freddo)</td><td>MMap</td><td>Lo storage a livelli ha bisogno di uno skew caldo/freddo per essere efficace; senza di esso, il tasso di hit della cache è basso.</td></tr>
<tr><td>Il costo è la priorità (picchi di latenza occasionali sono accettabili)</td><td>Archiviazione a livelli</td><td>Risparmia sia sulla memoria che sul disco locale (70-90% di disco in meno)</td></tr>
<tr><td>Schema chiaro caldo/freddo (regola 80/20)</td><td>Archiviazione a livelli</td><td>I dati caldi restano nella cache, quelli freddi restano a basso costo nello storage a oggetti</td></tr>
<tr><td>Scala molto grande (&gt;500M di vettori)</td><td>Archiviazione a livelli</td><td>Il disco locale di un nodo spesso non è in grado di contenere l'intero set di dati su questa scala.</td></tr>
</tbody>
</table>
<p><strong>Nota:</strong> MMap richiede Milvus 2.3+. Lo storage a livelli richiede Milvus 2.6+. Entrambi funzionano al meglio con le unità SSD NVMe (si consigliano 10.000+ IOPS).</p>
<h3 id="How-to-Configure-MMap" class="common-anchor-header">Come configurare MMap</h3><p><strong>Opzione 1: configurazione YAML (consigliata per le nuove installazioni)</strong></p>
<p>Modificare il file di configurazione Milvus milvus.yaml e aggiungere le seguenti impostazioni nella sezione queryNode:</p>
<pre><code translate="no">queryNode:
  mmap:
    vectorField: <span class="hljs-literal">true</span>      <span class="hljs-comment"># vector data</span>
    vectorIndex: <span class="hljs-literal">true</span>      <span class="hljs-comment"># vector index (largest source of savings!)</span>
    scalarField: <span class="hljs-literal">true</span>      <span class="hljs-comment"># scalar data (recommended for RAG workloads)</span>
    scalarIndex: <span class="hljs-literal">true</span>      <span class="hljs-comment"># scalar index</span>
    growingMmapEnabled: <span class="hljs-literal">false</span>  <span class="hljs-comment"># incremental data stays in memory</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Opzione 2: configurazione dell'SDK Python (per le collezioni esistenti)</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># You must release the collection before changing the mmap setting</span>
client.release_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)

<span class="hljs-comment"># Enable MMap</span>
client.alter_collection_properties(
    collection_name=<span class="hljs-string">&quot;my_collection&quot;</span>,
    properties={<span class="hljs-string">&quot;mmap.enabled&quot;</span>: <span class="hljs-literal">True</span>}
)

<span class="hljs-comment"># Load the collection again to apply the MMap setting</span>
client.load_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)

<span class="hljs-comment"># Verify that the setting has taken effect</span>
<span class="hljs-built_in">print</span>(client.describe_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)[<span class="hljs-string">&quot;properties&quot;</span>])
<span class="hljs-comment"># Output: {&#x27;mmap.enabled&#x27;: &#x27;True&#x27;}</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-to-Configure-Tiered-Storage-Milvus-26+" class="common-anchor-header">Come configurare l'archiviazione a livelli (Milvus 2.6+)</h3><p>Modificare il file di configurazione Milvus milvus.yaml e aggiungere le seguenti impostazioni nella sezione queryNode:</p>
<pre><code translate="no">queryNode:
  segcore:
    tieredStorage:
      warmup:                                                                                                                                                      
          <span class="hljs-comment"># Options: sync, async, disable                      </span>
          <span class="hljs-comment"># Specifies when tiered storage cache warm-up happens.                                                                                                                             </span>
          <span class="hljs-comment"># - &quot;sync&quot;: data is loaded into the cache before the segment is considered fully loaded.                                                                                    </span>
          <span class="hljs-comment"># - &quot;disable&quot;: data is not proactively loaded into the cache, and is loaded only when needed by Search/Query tasks.                                                                            </span>
          <span class="hljs-comment"># The default is &quot;sync&quot;, but vector fields default to &quot;disable&quot;.                                                                                                            </span>
          scalarField: sync                                                                                                                                          
          scalarIndex: sync                                                                                                                                          
          vectorField: disable <span class="hljs-comment"># Cache warm-up for raw vector field data is disabled by default.</span>
          vectorIndex: sync
      memoryHighWatermarkRatio: <span class="hljs-number">0.85</span>   <span class="hljs-comment"># Start eviction when memory usage exceeds 85%</span>
      memoryLowWatermarkRatio: <span class="hljs-number">0.70</span>    <span class="hljs-comment"># Stop eviction when memory usage drops to 70%</span>
      diskHighWatermarkRatio: <span class="hljs-number">0.80</span>     <span class="hljs-comment"># High watermark for disk eviction</span>
      diskLowWatermarkRatio: <span class="hljs-number">0.75</span>      <span class="hljs-comment"># Low watermark for disk eviction</span>
      evictionEnabled: true            <span class="hljs-comment"># Must be enabled!</span>
      backgroundEvictionEnabled: true  <span class="hljs-comment"># Background eviction thread</span>
      cacheTtl: <span class="hljs-number">3600</span>                   <span class="hljs-comment"># Automatically evict if not accessed for 1 hour</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Use-Lower-Dimensional-Embeddings" class="common-anchor-header">Usa incorporazioni a bassa dimensione<button data-href="#Use-Lower-Dimensional-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>Questo aspetto è facile da trascurare, ma la dimensione incide direttamente sui costi. La memoria, lo storage e il calcolo crescono linearmente con il numero di dimensioni. Un modello a 1536 dimensioni costa circa 4 volte di più di un modello a 384 dimensioni per gli stessi dati.</p>
<p>Il costo delle query cresce allo stesso modo: la similarità del coseno è O(D), quindi i vettori a 768 dimensioni richiedono circa il doppio del calcolo dei vettori a 384 dimensioni per ogni query. Nei carichi di lavoro ad alto QPS, questa differenza si traduce direttamente in un minor numero di nodi necessari.</p>
<p>Ecco come si confrontano i modelli di incorporazione più comuni (usando 384-dim come base di riferimento 1.0x):</p>
<table>
<thead>
<tr><th><strong>Modello</strong></th><th><strong>Dimensioni</strong></th><th><strong>Costo relativo</strong></th><th><strong>Richiamo</strong></th><th><strong>Migliore per</strong></th></tr>
</thead>
<tbody>
<tr><td>testo-embedding-3-grande</td><td>3072</td><td>8.0x</td><td>98%+</td><td>Quando l'accuratezza è irrinunciabile (ricerca, sanità)</td></tr>
<tr><td>testo-embedding-3-piccolo</td><td>1536</td><td>4.0x</td><td>95-97%</td><td>Carichi di lavoro generali RAG</td></tr>
<tr><td>DistilBERT</td><td>768</td><td>2.0x</td><td>92-95%</td><td>Buon equilibrio costi-prestazioni</td></tr>
<tr><td>tutti i MiniLM-L6-v2</td><td>384</td><td>1.0x</td><td>88-92%</td><td>Carichi di lavoro sensibili ai costi</td></tr>
</tbody>
</table>
<p><strong>Consigli pratici:</strong> Non date per scontato che vi serva il modello più grande. Eseguite un test su un campione rappresentativo delle vostre query effettive (di solito sono sufficienti 1 milione di vettori) e trovate il modello con la dimensione più bassa che soddisfi i vostri requisiti di accuratezza. Molti team scoprono che 768 dimensioni vanno bene quanto 1536 per il loro caso d'uso.</p>
<p><strong>Avete già scelto un modello ad alte dimensioni?</strong> È possibile ridurre le dimensioni a posteriori. La PCA (Principal Component Analysis) può eliminare le caratteristiche ridondanti e le <a href="https://milvus.io/blog/matryoshka-embeddings-detail-at-multiple-scales.md">incorporazioni Matryoshka</a> consentono di ridurre le prime N dimensioni mantenendo la maggior parte della qualità. Vale la pena di provare entrambi prima di incorporare nuovamente l'intero set di dati.</p>
<h2 id="Manage-Data-Lifecycle-with-Compaction-and-TTL" class="common-anchor-header">Gestire il ciclo di vita dei dati con la compattazione e il TTL<button data-href="#Manage-Data-Lifecycle-with-Compaction-and-TTL" class="anchor-icon" translate="no">
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
    </button></h2><p>Questo aspetto è meno affascinante, ma è comunque importante, soprattutto per i sistemi di produzione a lungo termine. Milvus utilizza un modello di archiviazione di sola appendice: quando si cancellano i dati, questi vengono contrassegnati come cancellati ma non rimossi immediatamente. Nel corso del tempo, questi dati morti si accumulano, sprecano spazio di archiviazione e fanno sì che le query scansionino più righe del necessario.</p>
<h3 id="Compaction-Reclaim-Storage-from-Deleted-Data" class="common-anchor-header">Compattazione: Recuperare spazio di archiviazione dai dati cancellati</h3><p>La compattazione è il processo in background di Milvus per la pulizia. Unisce piccoli segmenti, rimuove fisicamente i dati eliminati e riscrive i file compattati. È utile se:</p>
<ul>
<li>Si verificano scritture e cancellazioni frequenti (cataloghi di prodotti, aggiornamenti di contenuti, registri in tempo reale).</li>
<li>Il numero di segmenti continua a crescere (questo aumenta l'overhead per le query).</li>
<li>L'utilizzo dello storage cresce molto più velocemente dei dati effettivamente validi.</li>
</ul>
<p><strong>Attenzione:</strong> La compattazione è ad alta intensità di I/O. Pianificatela in periodi a basso traffico (ad esempio, di notte) o sintonizzate attentamente i trigger in modo da non competere con le query di produzione.</p>
<h3 id="TTLTime-to-Live-Automatically-Expire-Old-Vector-Data" class="common-anchor-header">TTL (Time to Live): Scadenza automatica dei vecchi dati vettoriali</h3><p>Per i dati che scadono naturalmente, il TTL è più pulito dell'eliminazione manuale. Impostando un tempo di vita per i dati, Milvus li contrassegna automaticamente per la cancellazione quando scadono. La compattazione si occupa della pulizia vera e propria.</p>
<p>È utile per:</p>
<ul>
<li>Registri e dati di sessione: conservare solo gli ultimi 7 o 30 giorni.</li>
<li>RAG sensibili al tempo - preferire le conoscenze recenti, lasciare scadere i vecchi documenti</li>
<li>Raccomandazioni in tempo reale: recuperare solo il comportamento recente dell'utente.</li>
</ul>
<p>Insieme, la compattazione e il TTL impediscono al sistema di accumulare silenziosamente rifiuti. Non è la leva più importante per i costi, ma impedisce il tipo di accumulo lento di spazio di archiviazione che coglie i team alla sprovvista.</p>
<h2 id="One-More-Option-Zilliz-Cloud-Fully-Managed-Milvus" class="common-anchor-header">Un'altra opzione: Zilliz Cloud (Milvus completamente gestito)<button data-href="#One-More-Option-Zilliz-Cloud-Fully-Managed-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Per completezza di informazione: <a href="https://zilliz.com/">Zilliz Cloud</a> è costruito dallo stesso team che ha creato Milvus, quindi prendete questa notizia con le dovute precauzioni.</p>
<p>Detto questo, ecco la parte controintuitiva: anche se Milvus è gratuito e open source, un servizio gestito può effettivamente costare meno di un hosting autonomo. Il motivo è semplice: il software è gratuito, ma l'infrastruttura cloud per farlo funzionare non lo è, e servono ingegneri per gestirla e mantenerla. Se un servizio gestito è in grado di svolgere lo stesso lavoro con un numero inferiore di macchine e di ore di lavoro dei tecnici, il conto totale diminuisce anche dopo aver pagato il servizio stesso.</p>
<p><a href="https://zilliz.com/">Zilliz Cloud</a> è un servizio completamente gestito costruito su Milvus e compatibile con le API. Due cose sono rilevanti per il costo:</p>
<ul>
<li><strong>Migliori prestazioni per nodo.</strong> Zilliz Cloud funziona su Cardinal, il nostro motore di ricerca ottimizzato. In base ai <a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch">risultati di VectorDBBench</a>, offre un throughput 3-5 volte superiore a Milvus open-source ed è 10 volte più veloce. In pratica, ciò significa che è necessario un numero di nodi di calcolo da un terzo a un quinto per lo stesso carico di lavoro.</li>
<li><strong>Ottimizzazioni integrate.</strong> Le funzionalità descritte in questa guida - MMap, archiviazione a livelli e quantizzazione degli indici - sono integrate e regolate automaticamente. L'autoscaling regola la capacità in base al carico effettivo, evitando di pagare per avere spazio non necessario.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Howto_Cut_Vector_Database_Costsby_Upto80_A_Pract_1_5230ab94bf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://zilliz.com/zilliz-migration-service">La migrazione</a> è semplice, poiché le API e i formati dei dati sono compatibili. Zilliz fornisce anche uno strumento di migrazione. Per un confronto dettagliato, vedere: <a href="https://zilliz.com/zilliz-vs-milvus">Zilliz Cloud vs. Milvus</a></p>
<h2 id="Summary-A-Step-by-Step-Plan-to-Cut-Vector-Database-Costs" class="common-anchor-header">Sommario: Un piano passo dopo passo per ridurre i costi dei database vettoriali<button data-href="#Summary-A-Step-by-Step-Plan-to-Cut-Vector-Database-Costs" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Se c'è una sola cosa da fare, è questa: controllare il tipo di indice.</strong></p>
<p>Se state eseguendo HNSW su un carico di lavoro sensibile ai costi, passate a IVF_SQ8. Solo questo può ridurre il costo della memoria di circa il 70% con una perdita minima di richiami.</p>
<p>Se volete andare oltre, ecco l'ordine di priorità:</p>
<ul>
<li><strong>Cambiare l'indice</strong> - HNSW → IVF_SQ8 per la maggior parte dei carichi di lavoro. Il massimo del vantaggio a fronte di zero cambiamenti architettonici.</li>
<li><strong>Abilitare MMap o lo storage a livelli</strong> - Smettere di tenere tutto in memoria. Si tratta di una modifica della configurazione, non di una riprogettazione.</li>
<li><strong>Valutare le dimensioni di incorporamento</strong> - Verificare se un modello più piccolo soddisfa le esigenze di precisione. Questo richiede un nuovo incorporamento, ma i risparmi sono notevoli.</li>
<li><strong>Impostare la compattazione e il TTL</strong> - Prevenire l'ingrossamento silenzioso dei dati, soprattutto se le scritture/cancellazioni sono frequenti.</li>
</ul>
<p>Combinate, queste strategie possono ridurre la spesa per i database vettoriali del 60-80%. Non tutti i team hanno bisogno di tutte e quattro le strategie: iniziate con la modifica dell'indice, misurate l'impatto e scendete l'elenco.</p>
<p>Per i team che desiderano ridurre il lavoro operativo e migliorare l'efficienza dei costi, <a href="https://zilliz.com/">Zilliz Cloud</a> (gestito da Milvus) è un'altra opzione.</p>
<p>Se state lavorando a una di queste ottimizzazioni e volete confrontarvi, lo <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack della comunità Milvus</a> è un buon posto per fare domande. Potete anche partecipare all'<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Office Hours di Milvus</a> per una rapida chiacchierata con il team di ingegneri sulla vostra configurazione specifica.</p>
