---
id: 25-million-vectors-1gb-memory-milvus-flat.md
title: >-
  Come eseguire 25 milioni di immagini vettoriali con meno di 1 GB di memoria in
  Milvus
author: Jack Li
date: 2026-6-3
cover: >-
  assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_1_19b2539810.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus FLAT index, vector database memory, mmap vector index, FP16 vector
  quantization, image search
meta_title: |
  How to Run 25 Million Image Vectors on Under 1GB of Memory in Milvus
desc: >-
  Come un utente della comunità ha eseguito una ricerca di immagini con 25
  milioni di vettori su meno di 1 GB di memoria in Milvus utilizzando FLAT, FP16
  e mmap, invece dei 139 GB stimati dallo strumento di dimensionamento.
origin: 'https://milvus.io/blog/25-million-vectors-1gb-memory-milvus-flat.md'
---
<p>Recentemente un utente di Milvus ci ha sottoposto un problema di ricerca di immagini molto pratico.</p>
<p>"Dobbiamo effettuare una ricerca da immagine a immagine su 25 milioni di immagini, codificate come vettori a 1280 dimensioni. Il carico di lavoro sarà svolto da una singola macchina. Ha 64 GB di RAM e al massimo 32 GB possono essere destinati al database vettoriale. Ma il <a href="https://milvus.io/tools/sizing"><strong>Milvus Sizing Tool</strong></a> dice che abbiamo bisogno di 139 GB. Siamo cotti?".</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_2_06e0f8be39.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Risultati della stima dello strumento di dimensionamento: 25M × 1280 vettori dimensionali, dimensione dati grezzi 119,2 GB, memoria di caricamento 139,4 GB</p>
<p>Non proprio.</p>
<p>All'inizio la risposta più ovvia sembrava essere un indice più avanzato. Se il set di dati è grande e la memoria è limitata, sicuramente un indice ANN più intelligente dovrebbe aiutare. In questo caso, non è stato così. L'indice che finalmente ha funzionato è l'opzione più semplice di Milvus: <a href="https://milvus.io/docs/flat.md"><strong>FLAT</strong></a>.</p>
<p>Il risultato è stato migliore di quanto ci si aspettasse: la memoria allo stato stazionario è rimasta sotto 1 GB, la memoria residente del contenitore è stata di circa 600 MB e la latenza delle query a caldo è rimasta sotto i 100 ms. L'avvio ha avuto un breve picco di circa 12,5 GB e la prima query ha richiesto circa 30 secondi durante il riscaldamento del sistema.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/25_million_vectors_1gb_memory_milvus_flat_md_3_272794fc9b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La cosa importante non è che FLAT abbia reso magicamente economici 25 milioni di confronti brute-force. Non è così. La parte importante è che questo carico di lavoro non ha quasi mai cercato tutti i 25 milioni di vettori. I filtri scalari restringevano prima ogni query e FLAT confrontava solo i vettori all'interno di quell'insieme di candidati molto più piccolo.</p>
<p>Questo post spiega cosa non ha funzionato, perché FLAT ha funzionato e quando vale la pena provare lo stesso schema nel proprio carico di lavoro.</p>
<h2 id="Why-AISAQ-and-IVFFLAT-Did-Not-Work-Here" class="common-anchor-header">Perché AISAQ e IVF_FLAT non hanno funzionato in questo caso<button data-href="#Why-AISAQ-and-IVFFLAT-Did-Not-Work-Here" class="anchor-icon" translate="no">
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
    </button></h2><p>Prima di FLAT, l'utente ha provato due indici che sembravano più naturali per una macchina vincolata.</p>
<p><strong>Primo tentativo:</strong> <a href="https://milvus.io/docs/aisaq.md"><strong>AISAQ</strong></a><strong>.</strong> AISAQ è un indice orientato al disco, progettato per mantenere basso l'utilizzo della memoria. Il problema di questo carico di lavoro era il percorso di creazione e caricamento. In un test precedente con 55 milioni di vettori, un carico di raccolta ha scritto 249 GB di dati temporanei su disco e ha richiesto troppo tempo per essere pratico.</p>
<p><strong>Secondo tentativo: IVF_FLAT.</strong> Anche IVF_FLAT sembrava ragionevole perché è un indice ANN standard. L'indice è stato costruito con successo, ma il carico di raccolta si è bloccato al 14% e non si è più ripreso.</p>
<p>Dopo questi due vicoli ciechi, l'utente ha provato l'opzione più noiosa: FLAT. Il caricamento è avvenuto in modo pulito. Inoltre, ha fornito il miglior comportamento in fase di esecuzione per questo specifico modello di query.</p>
<table>
<thead>
<tr><th><strong>Indice</strong></th><th><strong>Perché sembrava promettente</strong></th><th><strong>Cosa è successo in questo carico di lavoro</strong></th></tr>
</thead>
<tbody>
<tr><td>AISAQ</td><td>Indice orientato al disco con un basso utilizzo della memoria in teoria</td><td>Il percorso di creazione/caricamento generava file temporanei di grandi dimensioni. In un test con 55 milioni di vettori, un carico di raccolta ha scritto 249 GB di dati temporanei ed è stato lento.</td></tr>
<tr><td>IVF_FLAT</td><td>Indice ANN standard con un costo di ricerca inferiore a quello di una scansione completa</td><td>L'indice è stato costruito, ma il carico di raccolta si è bloccato al 14% e non si è ripreso.</td></tr>
<tr><td>PIATTO</td><td>Nessuna struttura RNA aggiuntiva e nessuna complessità di costruzione dell'indice</td><td>La memoria allo stato stazionario è rimasta sotto 1 GB. La memoria residente del contenitore era di circa 600 MB. L'avvio ha raggiunto un picco di 12,5 GB. La prima query ha richiesto circa 30 secondi, poi le query a caldo sono rimaste sotto i 100ms.</td></tr>
</tbody>
</table>
<p>La lezione è semplice: un indice che in teoria è efficiente può ancora essere inadeguato per una macchina, una forma di dati e un modello di query specifici.</p>
<h2 id="Why-FLAT-Worked" class="common-anchor-header">Perché FLAT ha funzionato<button data-href="#Why-FLAT-Worked" class="anchor-icon" translate="no">
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
    </button></h2><p>FLAT è l'indice più semplice supportato da Milvus. Nessun grafico. Nessun albero. Nessun clustering. Confronta direttamente il vettore di interrogazione con i vettori candidati.</p>
<p>Sembra uno strumento sbagliato per 25 milioni di vettori. Sarebbe lo strumento sbagliato se ogni query cercasse l'intera collezione.</p>
<p>Ma questo carico di lavoro aveva un forte filtro davanti alla ricerca vettoriale. Ogni query ha prima ristretto lo spazio di ricerca con campi scalari come <code translate="no">dataid</code> e <code translate="no">classid</code>. Solo successivamente Milvus ha eseguito la ricerca di similarità vettoriale. In questo modo il problema è passato da "ricerca di 25 milioni di vettori" a "ricerca di poche centinaia o decine di migliaia di vettori dopo il filtro".</p>
<p>Tre elementi hanno fatto funzionare la configurazione: La memorizzazione dei vettori in FP16, la mmap per i dati vettoriali grezzi e il filtraggio scalare prima del passaggio FLAT.</p>
<h2 id="Optimization-1-FP16-Cuts-Vector-Data-in-Half" class="common-anchor-header">Ottimizzazione 1: FP16 dimezza i dati vettoriali<button data-href="#Optimization-1-FP16-Cuts-Vector-Data-in-Half" class="anchor-icon" translate="no">
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
    </button></h2><p>I vettori avevano 1280 dimensioni. Memorizzato in FP32, ogni vettore necessita di 5120 byte:</p>
<p><code translate="no">1280 dimensions x 4 bytes = 5120 bytes</code></p>
<p>Per 25 milioni di vettori, si tratta di circa 119,2 GB di dati vettoriali grezzi. FP16 riduce ogni dimensione da 4 a 2 byte:</p>
<p><code translate="no">1280 dimensions x 2 bytes = 2560 bytes</code></p>
<p>I dati vettoriali grezzi scendono quindi a circa 59,6 GB.</p>
<p>Questo non si adatta ancora perfettamente alla RAM disponibile, ma dimezza la quantità di dati vettoriali che Milvus e il sistema operativo devono gestire. In molti carichi di lavoro di recupero di immagini, FP16 ha un piccolo impatto sul richiamo, ma non è una regola gratuita. Prima di renderla predefinita, verificare il richiamo con le proprie incorporazioni, metriche e barre di qualità.</p>
<h2 id="Optimization-2-mmap-Keeps-Raw-Vectors-Off-the-Process-Heap" class="common-anchor-header">Ottimizzazione 2: mmap mantiene i vettori grezzi fuori dall'heap del processo<button data-href="#Optimization-2-mmap-Keeps-Raw-Vectors-Off-the-Process-Heap" class="anchor-icon" translate="no">
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
    </button></h2><p>Anche dopo l'FP16, circa 60 GB di vettori sono ancora troppi per il budget di memoria. È qui che <a href="https://milvus.io/docs/mmap.md"><strong>mmap</strong></a> diventa utile.</p>
<p>Con mmap, Milvus può accedere ai dati vettoriali attraverso file mappati in memoria, invece di caricare l'intero campo vettoriale grezzo nella memoria di processo. Il sistema operativo inserisce i dati man mano che le query li toccano e può conservare le pagine calde nella sua cache delle pagine.</p>
<p>Nell'ambiente Milvus 2.6.14 di questo utente, la configurazione mmap a livello di cluster copriva già i dati vettoriali grezzi, quindi l'utente non ha dovuto impostare mmap manualmente.</p>
<p>Un dettaglio ha creato confusione durante il debug: Attu mostra l'impostazione mmap a livello di schema, non quella predefinita a livello di cluster. Quindi <a href="https://zilliz.com/attu"><strong>Attu</strong></a> può mostrare mmap come disabilitato anche quando la configurazione a livello di cluster sta effettivamente abilitando mmap per il percorso dei dati.</p>
<p>Il compromesso è semplice: mmap fa risparmiare RAM, ma utilizza maggiormente il disco e la cache di pagina del sistema operativo. È ancora necessaria la capacità dell'SSD per i file vettoriali e la prima query può essere più lenta mentre le pagine rilevanti vengono lette dal disco.</p>
<h2 id="Optimization-3-Scalar-Filtering-Is-the-Real-Performance-Multiplier" class="common-anchor-header">Ottimizzazione 3: il filtro scalare è il vero moltiplicatore di prestazioni<button data-href="#Optimization-3-Scalar-Filtering-Is-the-Real-Performance-Multiplier" class="anchor-icon" translate="no">
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
    </button></h2><p>FP16 e mmap spiegano il numero di memoria. Il filtraggio scalare spiega il numero di latenza.</p>
<p>Ogni query in questo carico di lavoro includeva un'espressione di filtro come questa:</p>
<pre><code translate="no" class="language-sql">dataid in [123] AND classid in [0, 2, 3]
<button class="copy-code-btn"></button></code></pre>
<p>Il filtro viene eseguito prima della fase di confronto dei vettori. Invece di confrontare 25 milioni di vettori, FLAT ha confrontato l'insieme dei candidati filtrati, che variava da poche centinaia a decine di migliaia di vettori.</p>
<p>Per questo motivo le query calde sono rimaste sotto i 100 ms. Decine di migliaia di confronti tra vettori sono pratici su una CPU moderna. Venticinque milioni di confronti per query sarebbero una storia molto diversa.</p>
<p>Questo spiega anche perché IVF_FLAT e HNSW non sono stati utili in questo caso. Una volta che il filtraggio scalare ha ridotto a sufficienza l'insieme dei candidati, una struttura RNA aggiuntiva può diventare un peso morto. Aggiunge memoria, tempo di costruzione e complessità di carico, ma potrebbe non migliorare di molto la latenza.</p>
<p>C'è un'avvertenza. I filtri di questo carico di lavoro erano semplici. Se i vostri filtri utilizzano elenchi <code translate="no">IN</code> di grandi dimensioni, modelli <code translate="no">LIKE</code>, predicati di intervallo o condizioni JSON annidate, aggiungete indici scalari sui campi pertinenti e misurate direttamente lo stadio del filtro.</p>
<table>
<thead>
<tr><th>Ottimizzazione</th><th>Cosa fa</th><th>Perché è importante in questo caso</th><th>Scambio</th></tr>
</thead>
<tbody>
<tr><td>Memorizzazione del vettore FP16</td><td>Memorizzazione di ogni dimensione vettoriale con 2 byte invece di 4 byte</td><td>Riduce i dati vettoriali grezzi da circa 119,2 GB a circa 59,6 GB.</td><td>L'impatto sul richiamo dipende dagli embeddings e dalla metrica. Testatelo.</td></tr>
<tr><td>mmap su vettori grezzi</td><td>Mappa i file vettoriali dal disco invece di caricare l'intero campo vettoriale grezzo nella memoria del processo.</td><td>Mantiene bassa la memoria di processo lasciando che il sistema operativo inserisca i dati secondo le necessità.</td><td>Richiede capacità SSD e può rendere più lente le query a freddo.</td></tr>
<tr><td>Filtrare prima gli scalari</td><td>Filtra per campi scalari prima di confrontare i vettori</td><td>Riduce ogni query da 25 milioni di candidati a centinaia o decine di migliaia.</td><td>I filtri complessi possono richiedere indici scalari.</td></tr>
</tbody>
</table>
<h2 id="Where-This-Pattern-Applies" class="common-anchor-header">Dove si applica questo schema<button data-href="#Where-This-Pattern-Applies" class="anchor-icon" translate="no">
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
    </button></h2><p>Il caso della ricerca di immagini ha funzionato perché lo spazio di ricerca reale era molto più piccolo della collezione totale. Questa stessa forma appare in molti carichi di lavoro di produzione.</p>
<ol>
<li><strong>RAG con più tenant:</strong> filtrare prima per <code translate="no">tenant_id</code>, <code translate="no">workspace_id</code> o <code translate="no">project_id</code>. Ogni tenant può avere solo migliaia o decine di migliaia di chunk.</li>
<li><strong>Ricerca di prodotti di e-commerce:</strong> Filtrare per categoria, marca, venditore, regione o disponibilità prima della ricerca vettoriale.</li>
<li><strong>Recupero di log e documenti:</strong> Filtrare per intervallo di tempo, fonte, servizio o tipo di documento prima della ricerca semantica.</li>
<li><strong>Ricerca di immagini o media con etichette:</strong> Filtrare per set di dati, classe, cliente o gruppo di asset prima di confrontare le incorporazioni.</li>
</ol>
<p>Questi sono buoni candidati per FLAT + FP16 + mmap perché l'intera collezione può essere grande mentre ogni query tocca ancora un piccolo sottoinsieme.</p>
<p>Lo schema non si applica quando ogni query cerca l'intero insieme. Se ogni query deve davvero scansionare tutti i 25 milioni di vettori, FLAT non darà la stessa latenza. In questo caso, si deve utilizzare un indice ANN come HNSW, IVF o un indice orientato al disco e pianificare il compromesso tra memoria, disco e tempo di costruzione.</p>
<h2 id="How-to-Read-the-Sizing-Tool-Estimate" class="common-anchor-header">Come leggere la stima dello strumento di dimensionamento<button data-href="#How-to-Read-the-Sizing-Tool-Estimate" class="anchor-icon" translate="no">
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
    </button></h2><p>Lo strumento di dimensionamento Milvus è un punto di partenza, non un verdetto finale sul vostro hardware.</p>
<p>In questo caso, la stima di 139,4 GB di memoria di caricamento è servita come base conservativa per 25 milioni di vettori FP32 a 1280 dimensioni. Il carico di lavoro reale ha modificato diverse ipotesi:</p>
<ol>
<li>FP16 ha dimezzato le dimensioni dei vettori grezzi.</li>
<li>mmap ha evitato di caricare l'intero campo vettoriale grezzo nella memoria di processo.</li>
<li>FLAT ha evitato strutture di indice RNA aggiuntive.</li>
<li>I filtri scalari fanno sì che ogni query cerchi un insieme di candidati molto più piccolo.</li>
</ol>
<p>Ecco perché i test sui carichi di lavoro reali sono importanti. Prima di rifiutare una configurazione hardware basata solo su una stima del dimensionamento, fate dei test con la precisione effettiva del vettore, il tipo di indice, la configurazione di mmap, i filtri scalari, il comportamento delle query a freddo e delle query a caldo.</p>
<h2 id="Get-Started" class="common-anchor-header">Iniziare<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>Se volete provare la stessa ricetta, iniziate dal modello di query, non dal nome dell'indice.</p>
<ol>
<li>Verificare se ogni query ha filtri scalari selettivi.</li>
<li>Stimare quanti vettori rimangono dopo il filtraggio.</li>
<li>Memorizzare i vettori come FP16 se il test di richiamo sembra buono.</li>
<li>Usare FLAT quando l'insieme dei candidati filtrati è abbastanza piccolo per un confronto brutale.</li>
<li>Verificare il comportamento di mmap per i dati vettoriali grezzi. Controllare le impostazioni a livello di schema e la configurazione a livello di cluster.</li>
<li>Misurare la memoria di avvio, la latenza della prima richiesta, la latenza della richiesta a caldo e l'I/O su disco.</li>
<li>Aggiungere indici scalari se la valutazione dei filtri diventa il collo di bottiglia.</li>
</ol>
<p>Per i test locali, iniziare con il <a href="https://milvus.io/docs/quickstart.md"><strong>quickstart di Milvus</strong></a> o con il repository <a href="https://github.com/milvus-io/milvus"><strong>GitHub</strong></a> di Milvus. Usate Attu per ispezionare le collezioni, ma ricordate che Attu potrebbe non mostrare i valori predefiniti di mmap a livello di cluster.</p>
<p>Se non si vuole gestire l'infrastruttura in proprio, <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a> è il servizio Milvus gestito. Si ottiene lo stesso nucleo di Milvus con operazioni gestite, scalabilità e un livello gratuito per i test. <a href="https://cloud.zilliz.com/signup"><strong>Registratevi</strong></a> per ottenere 100 crediti gratuiti con un'e-mail di lavoro, oppure <a href="https://cloud.zilliz.com/login"><strong>accedete</strong></a> se avete già un account.</p>
