---
id: how-to-safely-upgrade-from-milvu-2-5-x-to-milvus-2-6-x.md
title: Come aggiornare in modo sicuro da Milvus 2.5.x a Milvus 2.6.x
author: Yiqing Lu
date: 2025-12-25T00:00:00.000Z
cover: assets.zilliz.com/milvus_upgrade_25x_to_26x_700x438_856ac6b75c.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector databases, Milvus 2.6 features, Nvidia Cagra, full text search'
meta_title: |
  How to Safely Upgrade from Milvus 2.5.x to Milvus 2.6.x
desc: >-
  Scoprite le novità di Milvus 2.6, tra cui le modifiche all'architettura e le
  caratteristiche principali, e imparate come eseguire un aggiornamento continuo
  da Milvus 2.5.
origin: >-
  https://milvus.io/blog/how-to-safely-upgrade-from-milvu-2-5-x-to-milvus-2-6-x.md
---
<p><a href="https://milvus.io/docs/release_notes.md"><strong>Milvus 2.6</strong></a> è disponibile da un po' e si sta dimostrando un solido passo avanti per il progetto. Il rilascio porta con sé un'architettura perfezionata, prestazioni più elevate in tempo reale, un minore consumo di risorse e un comportamento di scalabilità più intelligente negli ambienti di produzione. Molti di questi miglioramenti sono stati determinati direttamente dal feedback degli utenti e i primi utilizzatori della versione 2.6.x hanno già riferito di ricerche sensibilmente più veloci e di prestazioni del sistema più prevedibili in caso di carichi di lavoro pesanti o dinamici.</p>
<p>Per i team che utilizzano Milvus 2.5.x e che stanno valutando il passaggio a 2.6.x, questa guida è il punto di partenza. Essa analizza le differenze architettoniche, evidenzia le funzionalità chiave introdotte in Milvus 2.6 e fornisce un percorso di aggiornamento pratico e graduale, progettato per ridurre al minimo le interruzioni operative.</p>
<p>Se i vostri carichi di lavoro prevedono pipeline in tempo reale, ricerca multimodale o ibrida, o operazioni vettoriali su larga scala, questo blog vi aiuterà a valutare se la versione 2.6 è in linea con le vostre esigenze e, se decidete di procedere, a eseguire l'aggiornamento con fiducia, mantenendo l'integrità dei dati e la disponibilità del servizio.</p>
<h2 id="Architecture-Changes-from-Milvus-25-to-Milvus-26" class="common-anchor-header">Cambiamenti nell'architettura da Milvus 2.5 a Milvus 2.6<button data-href="#Architecture-Changes-from-Milvus-25-to-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Prima di addentrarci nel flusso di aggiornamento vero e proprio, cerchiamo di capire come cambia l'architettura di Milvus 2.6.</p>
<h3 id="Milvus-25-Architecture" class="common-anchor-header">Architettura di Milvus 2.5</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_2_5_4e228af3c4.PNG" alt="Milvus 2.5 Architecture" class="doc-image" id="milvus-2.5-architecture" />
   </span> <span class="img-wrapper"> <span>Architettura di Milvus 2.5</span> </span></p>
<p>In Milvus 2.5, i flussi di lavoro in streaming e batch erano intrecciati tra più nodi worker:</p>
<ul>
<li><p><strong>QueryNode</strong> gestiva sia le query storiche <em>che quelle</em> incrementali (streaming).</p></li>
<li><p>Il<strong>DataNode</strong> gestiva sia l'ingest-time flushing <em>che la</em> compattazione in background dei dati storici.</p></li>
</ul>
<p>Questa mescolanza di logica batch e real-time rendeva difficile scalare i carichi di lavoro batch in modo indipendente. Inoltre, lo stato di streaming era disperso in diversi componenti, introducendo ritardi di sincronizzazione, complicando il ripristino dei guasti e aumentando la complessità operativa.</p>
<h3 id="Milvus-26-Architecture" class="common-anchor-header">Architettura di Milvus 2.6</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_Architecture_2_6_ee6f1f0635.PNG" alt="Milvus 2.6 Architecture" class="doc-image" id="milvus-2.6-architecture" />
   </span> <span class="img-wrapper"> <span>Architettura di Milvus 2.6</span> </span></p>
<p>Milvus 2.6 introduce uno <strong>StreamingNode</strong> dedicato che gestisce tutte le responsabilità dei dati in tempo reale: consumare la coda dei messaggi, scrivere segmenti incrementali, servire query incrementali e gestire il recupero basato su WAL. Con lo streaming isolato, i restanti componenti assumono ruoli più puliti e mirati:</p>
<ul>
<li><p><strong>QueryNode</strong> gestisce ora <em>solo le</em> query batch sui segmenti storici.</p></li>
<li><p><strong>Il DataNode</strong> gestisce <em>solo le</em> attività relative ai dati storici, come la compattazione e la creazione di indici.</p></li>
</ul>
<p>Lo StreamingNode assorbe tutti i compiti relativi allo streaming che in Milvus 2.5 erano suddivisi tra DataNode, QueryNode e persino il Proxy, facendo chiarezza e riducendo la condivisione dello stato tra i vari ruoli.</p>
<h3 id="Milvus-25x-vs-Milvus-26x-Component-by-Component-Comparison" class="common-anchor-header">Milvus 2.5.x vs Milvus 2.6.x: Confronto componente per componente</h3><table>
<thead>
<tr><th></th><th style="text-align:center"><strong>Milvus 2.5.x</strong></th><th style="text-align:center"><strong>Milvus 2.6.x</strong></th><th style="text-align:center"><strong>Cosa è cambiato</strong></th></tr>
</thead>
<tbody>
<tr><td>Servizi di coordinamento</td><td style="text-align:center">RootCoord / QueryCoord / DataCoord (o MixCoord)</td><td style="text-align:center">MixCoord</td><td style="text-align:center">La gestione dei metadati e la programmazione delle attività sono consolidate in un unico MixCoord, semplificando la logica di coordinamento e riducendo la complessità della distribuzione.</td></tr>
<tr><td>Livello di accesso</td><td style="text-align:center">Proxy</td><td style="text-align:center">Proxy</td><td style="text-align:center">Le richieste di scrittura vengono instradate solo attraverso il nodo di streaming per l'ingestione dei dati.</td></tr>
<tr><td>Nodi di lavoro</td><td style="text-align:center">-</td><td style="text-align:center">Nodo di streaming</td><td style="text-align:center">Nodo dedicato all'elaborazione dello streaming, responsabile di tutta la logica incrementale (segmenti crescenti), tra cui:- Ingestione dei dati incrementali- Interrogazione dei dati incrementali- Persistenza dei dati incrementali nello storage degli oggetti- Scritture basate sul flusso- Recupero dei guasti basato su WAL</td></tr>
<tr><td></td><td style="text-align:center">Nodo di interrogazione</td><td style="text-align:center">Nodo di interrogazione</td><td style="text-align:center">Nodo di elaborazione batch che gestisce le interrogazioni solo sui dati storici.</td></tr>
<tr><td></td><td style="text-align:center">Nodo dati</td><td style="text-align:center">Nodo dati</td><td style="text-align:center">Nodo di elaborazione batch responsabile solo dei dati storici, compresa la compattazione e la creazione di indici.</td></tr>
<tr><td></td><td style="text-align:center">Nodo indice</td><td style="text-align:center">-</td><td style="text-align:center">L'Index Node viene unito al Data Node, semplificando la definizione dei ruoli e la topologia di distribuzione.</td></tr>
</tbody>
</table>
<p>In breve, Milvus 2.6 traccia una chiara linea di demarcazione tra i carichi di lavoro in streaming e quelli in batch, eliminando il groviglio di componenti presenti nella versione 2.5 e creando un'architettura più scalabile e manutenibile.</p>
<h2 id="Milvus-26-Feature-Highlights" class="common-anchor-header">Caratteristiche principali di Milvus 2.6<button data-href="#Milvus-26-Feature-Highlights" class="anchor-icon" translate="no">
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
    </button></h2><p>Prima di addentrarci nel flusso di aggiornamento, ecco una rapida occhiata a ciò che Milvus 2.6 porta in tavola. <strong>Questa versione si concentra sulla riduzione dei costi dell'infrastruttura, sul miglioramento delle prestazioni di ricerca e sulla facilità di scalare grandi carichi di lavoro dinamici di intelligenza artificiale.</strong></p>
<h3 id="Cost--Efficiency-Improvements" class="common-anchor-header">Miglioramenti dei costi e dell'efficienza</h3><ul>
<li><p><strong>Quantizzazione</strong><a href="https://milvus.io/docs/ivf-rabitq.md#RaBitQ"><strong>RaBitQ</strong></a> <strong>per gli indici primari</strong> - Un nuovo metodo di quantizzazione a 1 bit che comprime gli indici vettoriali a <strong>1/32</strong> della loro dimensione originale. In combinazione con il reranking SQ8, riduce l'utilizzo della memoria a ~28%, aumenta il QPS di 4× e mantiene un richiamo di ~95%, riducendo significativamente i costi dell'hardware.</p></li>
<li><p><a href="https://milvus.io/docs/full-text-search.md#BM25-implementation"><strong>BM25-Optimized</strong></a><strong> Full-Text Search</strong> - Punteggio nativo BM25 alimentato da vettori di pesi radi per termini. La ricerca per parole chiave viene eseguita <strong>3-4 volte più velocemente</strong> (fino a <strong>7 volte</strong> su alcuni set di dati) rispetto a Elasticsearch, mantenendo le dimensioni dell'indice a circa un terzo dei dati di testo originali.</p></li>
<li><p><strong>Indicizzazione dei percorsi JSON con JSON Shredding</strong> - Il filtraggio strutturato su JSON annidati è ora molto più veloce e prevedibile. I percorsi JSON pre-indicizzati riducono la latenza del filtro da <strong>140 ms a 1,5 ms</strong> (P99: <strong>480 ms → 10 ms</strong>), rendendo la ricerca ibrida vettoriale e il filtraggio dei metadati molto più reattivi.</p></li>
<li><p><strong>Supporto ampliato per i tipi di dati</strong> - Aggiunge i tipi di vettore Int8, i campi <a href="https://milvus.io/docs/geometry-field.md#Geometry-Field">geometrici</a> (POINT / LINESTRING / POLYGON) e gli array di strutture. Queste estensioni supportano i carichi di lavoro geospaziali, la modellazione di metadati più ricchi e schemi più puliti.</p></li>
<li><p><strong>Upsert per aggiornamenti parziali</strong> - È ora possibile inserire o aggiornare entità utilizzando un'unica chiamata a chiave primaria. Gli aggiornamenti parziali modificano solo i campi forniti, riducendo l'amplificazione della scrittura e semplificando le pipeline che aggiornano frequentemente i metadati o gli embeddings.</p></li>
</ul>
<h3 id="Search-and-Retrieval-Enhancements" class="common-anchor-header">Miglioramenti nella ricerca e nel recupero</h3><ul>
<li><p><strong>Elaborazione del testo e supporto multilingue migliorati:</strong> I nuovi tokenizer Lindera e ICU migliorano la gestione del testo giapponese, coreano e <a href="https://milvus.io/docs/multi-language-analyzers.md#Multi-language-Analyzers">multilingue</a>. Jieba supporta ora i dizionari personalizzati. <code translate="no">run_analyzer</code> aiuta a eseguire il debug del comportamento della tokenizzazione e gli analizzatori multilingue assicurano una ricerca multilingue coerente.</p></li>
<li><p><strong>Corrispondenza del testo ad alta precisione:</strong> <a href="https://milvus.io/docs/phrase-match.md#Phrase-Match">Phrase Match</a> impone query di frasi ordinate con slop configurabile. Il nuovo indice <a href="https://milvus.io/docs/ngram.md#NGRAM">NGRAM</a> accelera le query di sottostringa e <code translate="no">LIKE</code> su campi VARCHAR e percorsi JSON, consentendo una rapida corrispondenza di testo parziale e fuzzy.</p></li>
<li><p><strong>Reranking time-aware e metadata-aware:</strong> <a href="https://milvus.io/docs/decay-ranker-overview.md">I Decay Ranker</a> (esponenziale, lineare, gaussiano) regolano i punteggi in base ai timestamp; i <a href="https://milvus.io/docs/boost-ranker.md#Boost-Ranker">Boost Ranker</a> applicano regole basate sui metadati per promuovere o declassare i risultati. Entrambi aiutano a perfezionare il comportamento di recupero senza modificare i dati sottostanti.</p></li>
<li><p><strong>Integrazione semplificata dei modelli e vettorizzazione automatica:</strong> Le integrazioni integrate con OpenAI, Hugging Face e altri fornitori di incorporazioni consentono a Milvus di vettorializzare automaticamente il testo durante le operazioni di inserimento e interrogazione. Niente più pipeline di incorporamento manuale per i casi d'uso più comuni.</p></li>
<li><p><strong>Aggiornamenti online dello schema per i campi scalari:</strong> Aggiungete nuovi campi scalari alle collezioni esistenti senza tempi di inattività o ricariche, semplificando l'evoluzione dello schema all'aumentare dei requisiti dei metadati.</p></li>
<li><p><strong>Rilevamento di quasi duplicati con MinHash:</strong> <a href="https://milvus.io/docs/minhash-lsh.md#MINHASHLSH">MinHash</a> + LSH consente un efficiente rilevamento di quasi-duplicazioni in grandi insiemi di dati senza costosi confronti esatti.</p></li>
</ul>
<h3 id="Architecture-and-Scalability-Upgrades" class="common-anchor-header">Aggiornamenti dell'architettura e della scalabilità</h3><ul>
<li><p><a href="https://milvus.io/docs/tiered-storage-overview.md#Tiered-Storage-Overview"><strong>Archiviazione a livelli</strong></a> <strong>per la gestione dei dati caldi e freddi:</strong> Separa i dati caldi da quelli freddi su SSD e object storage; supporta il caricamento pigro e parziale; elimina la necessità di caricare completamente le raccolte in locale; riduce l'utilizzo delle risorse fino al 50% e accelera i tempi di caricamento per i dataset di grandi dimensioni.</p></li>
<li><p><strong>Servizio di streaming in tempo reale:</strong> Aggiunge nodi di streaming dedicati integrati con Kafka/Pulsar per l'ingestione continua; consente l'indicizzazione immediata e la disponibilità di query; migliora il throughput di scrittura e accelera il recupero dei guasti per carichi di lavoro in tempo reale e in rapida evoluzione.</p></li>
<li><p><strong>Scalabilità e stabilità migliorate:</strong> Milvus supporta ora oltre 100.000 collezioni per grandi ambienti multi-tenant. Gli aggiornamenti dell'infrastruttura - <a href="https://milvus.io/docs/woodpecker_architecture.md#Woodpecker">Woodpecker</a> (WAL a disco zero), <a href="https://milvus.io/docs/roadmap.md#%F0%9F%94%B9-HotCold-Tiering--Storage-Architecture-StorageV2">Storage v2</a> (IOPS/memoria ridotti) e <a href="https://milvus.io/docs/release_notes.md#Coordinator-Merge-into-MixCoord">Coordinator Merge</a> - migliorano la stabilità del cluster e consentono una scalabilità prevedibile in presenza di carichi di lavoro elevati.</p></li>
</ul>
<p>Per un elenco completo delle caratteristiche di Milvus 2.6, consultare le <a href="https://milvus.io/docs/release_notes.md">note di rilascio di Milvus</a>.</p>
<h2 id="How-to-Upgrade-from-Milvus-25x-to-Milvus-26x" class="common-anchor-header">Come aggiornare da Milvus 2.5.x a Milvus 2.6.x<button data-href="#How-to-Upgrade-from-Milvus-25x-to-Milvus-26x" class="anchor-icon" translate="no">
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
    </button></h2><p>Per mantenere la massima disponibilità del sistema durante l'aggiornamento, i cluster Milvus 2.5 devono essere aggiornati a Milvus 2.6 nel seguente ordine.</p>
<p><strong>1. Avviare prima il nodo di streaming</strong></p>
<p>Avviare il nodo di streaming in anticipo. Il nuovo <strong>Delegator</strong> (il componente del Query Node responsabile della gestione dei dati in streaming) deve essere spostato nel Milvus 2.6 Streaming Node.</p>
<p><strong>2. Aggiornamento di MixCoord</strong></p>
<p>Aggiornare i componenti del coordinatore a <strong>MixCoord</strong>. Durante questa fase, MixCoord deve rilevare le versioni dei Worker Nodes per gestire la compatibilità tra le versioni all'interno del sistema distribuito.</p>
<p><strong>3. Aggiornamento del nodo di interrogazione</strong></p>
<p>Gli aggiornamenti del Query Node richiedono in genere più tempo. Durante questa fase, i Data Node e gli Index Node di Milvus 2.5 possono continuare a gestire operazioni come il Flush e la creazione di indici, contribuendo a ridurre la pressione sul lato query mentre i Query Node vengono aggiornati.</p>
<p><strong>4. Aggiornamento del nodo dati</strong></p>
<p>Una volta che i DataNode di Milvus 2.5 sono stati messi offline, le operazioni di Flush diventano indisponibili e i dati nei Segmenti in crescita possono continuare ad accumularsi fino a quando tutti i nodi non saranno completamente aggiornati a Milvus 2.6.</p>
<p><strong>5. Aggiornamento del Proxy</strong></p>
<p>Dopo aver aggiornato un Proxy a Milvus 2.6, le operazioni di scrittura su tale Proxy rimarranno indisponibili fino a quando tutti i componenti del cluster non saranno aggiornati alla versione 2.6.</p>
<p><strong>6. Rimuovere il nodo indice</strong></p>
<p>Una volta che tutti gli altri componenti sono stati aggiornati, il nodo indice standalone può essere rimosso in modo sicuro.</p>
<p><strong>Note:</strong></p>
<ul>
<li><p>Dal completamento dell'aggiornamento del DataNode fino al completamento dell'aggiornamento del Proxy, le operazioni di Flush non sono disponibili.</p></li>
<li><p>Dal momento dell'aggiornamento del primo Proxy fino all'aggiornamento di tutti i nodi Proxy, alcune operazioni di scrittura non sono disponibili.</p></li>
<li><p><strong>Quando si esegue l'aggiornamento diretto da Milvus 2.5.x a 2.6.6, le operazioni DDL (Data Definition Language) non sono disponibili durante il processo di aggiornamento a causa delle modifiche apportate al framework DDL.</strong></p></li>
</ul>
<h2 id="How-to-Upgrade-to-Milvus-26-with-Milvus-Operator" class="common-anchor-header">Come aggiornare Milvus 2.6 con Milvus Operator<button data-href="#How-to-Upgrade-to-Milvus-26-with-Milvus-Operator" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/milvus-operator">Milvus Operator</a> è un operatore Kubernetes open-source che fornisce un modo scalabile e altamente disponibile per distribuire, gestire e aggiornare l'intero stack di servizi Milvus su un cluster Kubernetes di destinazione. Lo stack di servizi Milvus gestito dall'operatore comprende:</p>
<ul>
<li><p>Componenti principali di Milvus</p></li>
<li><p>Dipendenze necessarie come etcd, Pulsar e MinIO.</p></li>
</ul>
<p>Milvus Operator segue lo schema standard di Kubernetes Operator. Introduce una risorsa personalizzata (CR) Milvus che descrive lo stato desiderato di un cluster Milvus, come la versione, la topologia e la configurazione.</p>
<p>Un controllore monitora continuamente il cluster e riconcilia lo stato attuale con lo stato desiderato definito nella CR. Quando vengono apportate delle modifiche, come l'aggiornamento della versione di Milvus, l'operatore le applica automaticamente in modo controllato e ripetibile, consentendo aggiornamenti automatici e una gestione continua del ciclo di vita.</p>
<h3 id="Milvus-Custom-Resource-CR-Example" class="common-anchor-header">Esempio di risorsa personalizzata (CR) Milvus</h3><pre><code translate="no">apiVersion: milvus.io/v1beta1
kind: Milvus
metadata:
  name: my-milvus-mansion    
  namespace: dev       
spec:
  mode: cluster                  <span class="hljs-comment"># cluster or standalone</span>
  <span class="hljs-comment"># Milvus Components</span>
  components:
    image: milvusdb/milvus:v2.6.5
    imageUpdateMode: rollingUpgrade 
    proxy:                   
      replicas: 1          
    mixCoord:              
      replicas: 1           
    dataNode:               
      replicas: 1          
    queryNode:              
      replicas: 2           
      resources:
        requests:
          cpu: <span class="hljs-string">&quot;2&quot;</span>
          memory: <span class="hljs-string">&quot;8Gi&quot;</span>  
  <span class="hljs-comment"># Dependencies, including etcd, storage and message stream</span>
  dependencies:
    etcd:                   
      inCluster:
        values:
          replicaCount: 3    
    storage:                 
      <span class="hljs-built_in">type</span>: MinIO
      inCluster:
        values:
          mode: distributed     
    msgStreamType: pulsar    
    pulsar:
      inCluster:
        values:
          bookkeeper:
            replicas: 3   
  <span class="hljs-comment"># Milvus configs</span>
  config:
    dataCoord:
      enableActiveStandby: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Rolling-Upgrades-from-Milvus-25-to-26-with-Milvus-Operator" class="common-anchor-header">Aggiornamento continuo da Milvus 2.5 a 2.6 con Milvus Operator</h3><p>Milvus Operator offre un supporto integrato per l'<strong>aggiornamento continuo da Milvus 2.5 a 2.6</strong> in modalità cluster, adattando il proprio comportamento alle modifiche architettoniche introdotte in 2.6.</p>
<p><strong>1. Rilevamento dello scenario di aggiornamento</strong></p>
<p>Durante un aggiornamento, Milvus Operator determina la versione Milvus di destinazione dalle specifiche del cluster. Questo avviene tramite:</p>
<ul>
<li><p>ispezionando il tag dell'immagine definito in <code translate="no">spec.components.image</code>, oppure</p></li>
<li><p>Leggendo la versione esplicita specificata in <code translate="no">spec.components.version</code></p></li>
</ul>
<p>L'operatore confronta quindi la versione desiderata con quella attualmente in esecuzione, registrata in <code translate="no">status.currentImage</code> o <code translate="no">status.currentVersion</code>. Se la versione attuale è 2.5 e quella desiderata è 2.6, l'operatore identifica l'aggiornamento come uno scenario di aggiornamento 2.5 → 2.6.</p>
<p><strong>2. Ordine di esecuzione dell'aggiornamento continuo</strong></p>
<p>Quando viene rilevato un aggiornamento 2.5 → 2.6 e la modalità di aggiornamento è impostata su rolling upgrade (<code translate="no">spec.components.imageUpdateMode: rollingUpgrade</code>, che è l'impostazione predefinita), Milvus Operator esegue automaticamente l'aggiornamento secondo un ordine predefinito allineato con l'architettura di Milvus 2.6:</p>
<p>Avviare il Nodo di Streaming → Aggiornare MixCoord → Aggiornare il Nodo di Query → Aggiornare il Nodo Dati → Aggiornare il Proxy → Rimuovere il Nodo Indice</p>
<p><strong>3. Consolidamento automatico dei coordinatori</strong></p>
<p>Milvus 2.6 sostituisce più componenti del coordinatore con un unico MixCoord. Milvus Operator gestisce automaticamente questa transizione architettonica.</p>
<p>Quando <code translate="no">spec.components.mixCoord</code> è configurato, l'operatore richiama MixCoord e attende che sia pronto. Una volta che MixCoord è pienamente operativo, l'operatore chiude con grazia i componenti del coordinatore precedente: RootCoord, QueryCoord e DataCoord, completando la migrazione senza richiedere alcun intervento manuale.</p>
<h3 id="Upgrade-Steps-from-Milvus-25-to-26" class="common-anchor-header">Fasi di aggiornamento da Milvus 2.5 a 2.6</h3><p>1. Aggiornare Milvus Operator alla versione più recente (in questa guida utilizziamo la <strong>versione 1.3.3</strong>, l'ultima rilasciata al momento della stesura della guida).</p>
<pre><code translate="no"><span class="hljs-comment"># Option 1: Using Helm</span>
helm upgrade --install milvus-operator \
  -n milvus-operator --create-namespace \
  https://github.com/zilliztech/milvus-operator/releases/download/v1.3.3/milvus-operator-1.3.3.tgz
 <span class="hljs-comment"># Option 2: Using kubectl &amp; raw manifests</span>
 kubectl apply -f https://raw.githubusercontent.com/zilliztech/milvus-operator/v1.3.3/deploy/manifests/deployment.yaml
<button class="copy-code-btn"></button></code></pre>
<p>2. Unire i componenti del coordinatore</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;mixCoord&quot;: {
        &quot;replicas&quot;: 1
      }
    }
  }
}&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p>3. Assicurarsi che nel cluster sia in esecuzione Milvus 2.5.16 o versione successiva.</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;image&quot;: &quot;milvusdb/milvus:v2.5.22&quot;
    }
  }
}&#x27;</span>
<span class="hljs-comment"># wait till updated</span>
kubectl <span class="hljs-built_in">wait</span> milvus my-release -n demo-operator --<span class="hljs-keyword">for</span>=condition=milvusupdated --<span class="hljs-built_in">timeout</span>=1h
<button class="copy-code-btn"></button></code></pre>
<p>4. Aggiornare Milvus alla versione 2.6.</p>
<pre><code translate="no">kubectl patch milvus my-release -n demo-operator --<span class="hljs-built_in">type</span>=merge -p <span class="hljs-string">&#x27;
{
  &quot;spec&quot;: {
    &quot;components&quot;: {
      &quot;image&quot;: &quot;milvusdb/milvus:v2.6.5&quot;
    }
  }
}&#x27;</span>
<span class="hljs-comment"># wait till updated</span>
kubectl <span class="hljs-built_in">wait</span> milvus my-release -n demo-operator --<span class="hljs-keyword">for</span>=condition=milvusupdated --<span class="hljs-built_in">timeout</span>=1h
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Upgrade-to-Milvus-26-with-Helm" class="common-anchor-header">Come aggiornare Milvus 2.6 con Helm<button data-href="#How-to-Upgrade-to-Milvus-26-with-Helm" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando si distribuisce Milvus utilizzando Helm, tutte le risorse di Kubernetes <code translate="no">Deployment</code> vengono aggiornate in parallelo, senza un ordine di esecuzione garantito. Di conseguenza, Helm non fornisce un controllo rigoroso sulle sequenze di aggiornamento tra i componenti. Per gli ambienti di produzione, si raccomanda pertanto di utilizzare Milvus Operator.</p>
<p>È comunque possibile aggiornare Milvus da 2.5 a 2.6 utilizzando Helm, seguendo i passaggi indicati di seguito.</p>
<p>Requisiti di sistema</p>
<ul>
<li><p><strong>Versione di Helm:</strong> ≥ 3.14.0</p></li>
<li><p><strong>Versione di Kubernetes:</strong> ≥ 1.20.0</p></li>
</ul>
<p>1.Aggiornare il grafico Milvus Helm alla versione più recente. In questa guida utilizziamo la <strong>versione 5.0.7</strong>, la più recente al momento della stesura della guida.</p>
<pre><code translate="no">helm repo <span class="hljs-keyword">add</span> zilliztech https:<span class="hljs-comment">//zilliztech.github.io/milvus-helm</span>
helm repo update
<button class="copy-code-btn"></button></code></pre>
<p>2.Se il cluster è distribuito con più componenti coordinatori, aggiornare prima Milvus alla versione 2.5.16 o successiva e abilitare MixCoord.</p>
<pre><code translate="no">mixCoordinator
。
helm upgrade -i my-release zilliztech/milvus \
  --namespace=helm-demo \
  --<span class="hljs-built_in">set</span> image.all.tag=<span class="hljs-string">&quot;v2.5.22&quot;</span> \
  --<span class="hljs-built_in">set</span> mixCoordinator.enabled=<span class="hljs-literal">true</span> \
  --<span class="hljs-built_in">set</span> rootCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> indexCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> queryCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> dataCoordinator.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> streaming.enabled=<span class="hljs-literal">false</span> \
  --<span class="hljs-built_in">set</span> indexNode.enabled=<span class="hljs-literal">true</span> \
  --reset-then-reuse-values \
  --version=5.0.7 \
  --<span class="hljs-built_in">wait</span> --<span class="hljs-built_in">timeout</span> 1h
<button class="copy-code-btn"></button></code></pre>
<p>3.Aggiornare Milvus alla versione 2.6</p>
<pre><code translate="no">helm upgrade my-release zilliztech/milvus \
  --namespace=helm-demo \
  --<span class="hljs-built_in">set</span> image.all.tag=<span class="hljs-string">&quot;v2.6.5&quot;</span> \
  --<span class="hljs-built_in">set</span> streaming.enabled=<span class="hljs-literal">true</span> \
  --<span class="hljs-built_in">set</span> indexNode.enabled=<span class="hljs-literal">false</span> \
  --reset-then-reuse-values \
  --version=5.0.7 \
  --<span class="hljs-built_in">wait</span> --<span class="hljs-built_in">timeout</span> 1h
<button class="copy-code-btn"></button></code></pre>
<h2 id="FAQ-on-Milvus-26-Upgrade-and-Operations" class="common-anchor-header">FAQ sull'aggiornamento e le operazioni di Milvus 2.6<button data-href="#FAQ-on-Milvus-26-Upgrade-and-Operations" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Q1-Milvus-Helm-vs-Milvus-Operator--which-one-should-I-use" class="common-anchor-header">Q1: Milvus Helm vs Milvus Operator - quale devo usare?</h3><p>Per gli ambienti di produzione, Milvus Operator è fortemente consigliato.</p>
<p>Per maggiori dettagli, consultare la guida ufficiale: <a href="https://github.com/zilliztech/milvus-operator?tab=readme-ov-file#milvus-operator-vs-helm">https://github.com/zilliztech/milvus-operator?tab=readme-ov-file#milvus-operator-vs-helm</a>.</p>
<h3 id="Q2-How-should-I-choose-a-Message-Queue-MQ" class="common-anchor-header">D2: Come scegliere una coda di messaggi (MQ)?</h3><p>L'MQ consigliato dipende dalla modalità di distribuzione e dai requisiti operativi:</p>
<p><strong>1. Modalità standalone:</strong> Per le implementazioni sensibili ai costi, si consiglia RocksMQ.</p>
<p><strong>2. Modalità cluster</strong></p>
<ul>
<li><p><strong>Pulsar</strong> supporta la multi-tenancy, permette a grandi cluster di condividere l'infrastruttura e offre una forte scalabilità orizzontale.</p></li>
<li><p><strong>Kafka</strong> ha un ecosistema più maturo, con offerte SaaS gestite disponibili sulle principali piattaforme cloud.</p></li>
</ul>
<p><strong>3. Woodpecker (introdotto in Milvus 2.6):</strong> Woodpecker elimina la necessità di una coda di messaggi esterna, riducendo i costi e la complessità operativa.</p>
<ul>
<li><p>Attualmente è supportata solo la modalità Woodpecker integrata, leggera e facile da usare.</p></li>
<li><p>Per le implementazioni standalone di Milvus 2.6, si raccomanda Woodpecker.</p></li>
<li><p>Per le implementazioni in cluster di produzione, si consiglia di utilizzare la modalità Woodpecker, di prossima uscita, non appena sarà disponibile.</p></li>
</ul>
<h3 id="Q3-Can-the-Message-Queue-be-switched-during-an-upgrade" class="common-anchor-header">D3: È possibile cambiare la coda dei messaggi durante un aggiornamento?</h3><p>No. La commutazione della coda di messaggi durante un aggiornamento non è attualmente supportata. Le versioni future introdurranno API di gestione per supportare la commutazione tra Pulsar, Kafka, Woodpecker e RocksMQ.</p>
<h3 id="Q4-Do-rate-limiting-configurations-need-to-be-updated-for-Milvus-26" class="common-anchor-header">D4: Le configurazioni di limitazione della velocità devono essere aggiornate per Milvus 2.6?</h3><p>Le configurazioni di limitazione della velocità esistenti rimangono valide e si applicano anche al nuovo Streaming Node. Non sono necessarie modifiche.</p>
<h3 id="Q5-After-the-coordinator-merge-do-monitoring-roles-or-configurations-change" class="common-anchor-header">D5: Dopo la fusione dei coordinatori, cambiano i ruoli di monitoraggio o le configurazioni?</h3><ul>
<li><p>I ruoli di monitoraggio rimangono invariati (<code translate="no">RootCoord</code>, <code translate="no">QueryCoord</code>, <code translate="no">DataCoord</code>).</p></li>
<li><p>Le opzioni di configurazione esistenti continuano a funzionare come prima.</p></li>
<li><p>È stata introdotta una nuova opzione di configurazione, <code translate="no">mixCoord.enableActiveStandby</code>, che tornerà a <code translate="no">rootcoord.enableActiveStandby</code> se non viene impostata esplicitamente.</p></li>
</ul>
<h3 id="Q6-What-are-the-recommended-resource-settings-for-StreamingNode" class="common-anchor-header">D6: Quali sono le impostazioni delle risorse consigliate per StreamingNode?</h3><ul>
<li><p>Per un'ingestione leggera in tempo reale o per carichi di lavoro occasionali di scrittura e interrogazione, è sufficiente una configurazione più piccola, come 2 core di CPU e 8 GB di memoria.</p></li>
<li><p>Per l'ingestione pesante in tempo reale o per carichi di lavoro continui di scrittura e interrogazione, si consiglia di allocare risorse paragonabili a quelle del Query Node.</p></li>
</ul>
<h3 id="Q7-How-do-I-upgrade-a-standalone-deployment-using-Docker-Compose" class="common-anchor-header">D7: Come si aggiorna un'implementazione standalone che utilizza Docker Compose?</h3><p>Per le distribuzioni standalone basate su Docker Compose, è sufficiente aggiornare il tag dell'immagine Milvus in <code translate="no">docker-compose.yaml</code>.</p>
<p>Per i dettagli, consultare la guida ufficiale: <a href="https://milvus.io/docs/upgrade_milvus_standalone-docker.md">https://milvus.io/docs/upgrade_milvus_standalone-docker.md</a>.</p>
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
    </button></h2><p>Milvus 2.6 segna un importante miglioramento sia nell'architettura che nelle operazioni. Separando l'elaborazione in streaming da quella in batch con l'introduzione di StreamingNode, consolidando i coordinatori in MixCoord e semplificando i ruoli dei lavoratori, Milvus 2.6 fornisce una base più stabile, scalabile e facile da usare per carichi di lavoro vettoriali su larga scala.</p>
<p>Queste modifiche architettoniche rendono gli aggiornamenti, specialmente quelli da Milvus 2.5, più sensibili all'ordine. Il successo dell'aggiornamento dipende dal rispetto delle dipendenze dei componenti e dei vincoli di disponibilità temporanea. Per gli ambienti di produzione, Milvus Operator è l'approccio consigliato, in quanto automatizza la sequenza degli aggiornamenti e riduce il rischio operativo, mentre gli aggiornamenti basati su Helm sono più adatti ai casi d'uso non di produzione.</p>
<p>Con funzionalità di ricerca migliorate, tipi di dati più ricchi, archiviazione a livelli e opzioni di coda di messaggi migliorate, Milvus 2.6 è ben posizionato per supportare le moderne applicazioni di intelligenza artificiale che richiedono ingestione in tempo reale, elevate prestazioni di interrogazione e operazioni efficienti su scala.</p>
<p>Avete domande o volete un approfondimento su una qualsiasi caratteristica dell'ultima versione di Milvus? Unitevi al nostro<a href="https://discord.com/invite/8uyFbECzPX"> canale Discord</a> o inviate problemi su<a href="https://github.com/milvus-io/milvus"> GitHub</a>. È anche possibile prenotare una sessione individuale di 20 minuti per ottenere approfondimenti, indicazioni e risposte alle vostre domande tramite<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="More-Resources-about-Milvus-26" class="common-anchor-header">Altre risorse su Milvus 2.6<button data-href="#More-Resources-about-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p><a href="https://milvus.io/docs/release_notes.md">Note di rilascio di Milvus 2.6</a></p></li>
<li><p><a href="https://www.youtube.com/watch?v=Guct-UMK8lw&amp;t=157s">Registrazione del webinar Milvus 2.6: Ricerca più veloce, costi più bassi e scalabilità più intelligente</a></p></li>
<li><p>Blog sulle funzioni di Milvus 2.6</p>
<ul>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Introduzione alla funzione Embedding: Come Milvus 2.6 semplifica la vettorizzazione e la ricerca semantica</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Triturazione JSON in Milvus: filtraggio JSON 88,9 volte più veloce e flessibile</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Il vero recupero a livello di entità: Nuove capacità di Array-of-Structs e MAX_SIM in Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot%E2%80%93cold-data-loading.md">Smettere di pagare per i dati freddi: Riduzione dell'80% dei costi con il caricamento dei dati caldo-freddo su richiesta nello storage a livelli di Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">Introduzione di AISAQ in Milvus: la ricerca vettoriale su scala miliardaria è appena diventata 3.200 volte più economica sulla memoria</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">Ottimizzazione di NVIDIA CAGRA in Milvus: un approccio ibrido GPU-CPU per un'indicizzazione più rapida e query meno costose</a></p></li>
<li><p><a href="https://milvus.io/blog/milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md">Introduzione dell'indice Ngram di Milvus: Corrispondenza di parole chiave e query LIKE più veloci per i carichi di lavoro degli agenti</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Filtraggio geospaziale e ricerca vettoriale con campi geometrici e RTREE in Milvus 2.6</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">La ricerca vettoriale nel mondo reale: come filtrare in modo efficiente senza uccidere la memoria</a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Portare la compressione vettoriale all'estremo: come Milvus serve 3 volte di più le query con RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">I benchmark mentono: i DB vettoriali meritano un test reale</a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Abbiamo sostituito Kafka/Pulsar con un picchio per Milvus: ecco cosa è successo</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH in Milvus: l'arma segreta per combattere i duplicati nei dati di formazione LLM</a></p></li>
</ul></li>
</ul>
