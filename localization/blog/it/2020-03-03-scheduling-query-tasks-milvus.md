---
id: scheduling-query-tasks-milvus.md
title: Il contesto
author: milvus
date: 2020-03-03T22:38:17.829Z
desc: Il lavoro dietro le quinte
cover: assets.zilliz.com/eric_rothermel_Fo_KO_4_Dp_Xam_Q_unsplash_469fe12aeb.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/scheduling-query-tasks-milvus'
---
<custom-h1>Come Milvus pianifica le attività di query</custom-h1><p>n questo articolo parleremo di come Milvus pianifica le attività di interrogazione. Parleremo anche di problemi, soluzioni e orientamenti futuri per l'implementazione dello scheduling di Milvus.</p>
<h2 id="Background" class="common-anchor-header">Il contesto<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>Dalla Gestione dei dati nel motore di ricerca vettoriale su larga scala sappiamo che la ricerca di similarità vettoriale è implementata dalla distanza tra due vettori nello spazio ad alta dimensione. L'obiettivo della ricerca vettoriale è trovare i K vettori più vicini al vettore di destinazione.</p>
<p>Esistono molti modi per misurare la distanza vettoriale, come la distanza euclidea:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_euclidean_distance_156037c939.png" alt="1-euclidean-distance.png" class="doc-image" id="1-euclidean-distance.png" />
   </span> <span class="img-wrapper"> <span>1-euclidea-distanza.png</span> </span></p>
<p>dove x e y sono due vettori. n è la dimensione dei vettori.</p>
<p>Per trovare i K vettori più vicini in un set di dati, è necessario calcolare la distanza euclidea tra il vettore di destinazione e tutti i vettori del set di dati da cercare. Quindi, i vettori vengono ordinati in base alla distanza per acquisire i K vettori più vicini. Il lavoro di calcolo è direttamente proporzionale alla dimensione del set di dati. Più grande è il set di dati, più lavoro di calcolo richiede una query. Una GPU, specializzata nell'elaborazione dei grafi, dispone di molti core per fornire la potenza di calcolo richiesta. Pertanto, il supporto multi-GPU viene preso in considerazione durante l'implementazione di Milvus.</p>
<h2 id="Basic-concepts" class="common-anchor-header">Concetti di base<button data-href="#Basic-concepts" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Data-blockTableFile" class="common-anchor-header">Blocco dati (file tabellare)</h3><p>Per migliorare il supporto alla ricerca di dati su larga scala, abbiamo ottimizzato l'archiviazione dei dati di Milvus. Milvus divide i dati di una tabella per dimensione in più blocchi di dati. Durante la ricerca vettoriale, Milvus cerca i vettori in ogni blocco di dati e unisce i risultati. Un'operazione di ricerca vettoriale consiste in N operazioni indipendenti di ricerca vettoriale (N è il numero di blocchi di dati) e N-1 operazioni di unione dei risultati.</p>
<h3 id="Task-queueTaskTable" class="common-anchor-header">Coda dei task (tabella dei task)</h3><p>Ogni risorsa ha un array di task, che registra i task appartenenti alla risorsa. Ogni task ha diversi stati, tra cui Start, Loading, Loaded, Executing ed Executed. Il Loader e l'Executor di un dispositivo informatico condividono la stessa coda di task.</p>
<h3 id="Query-scheduling" class="common-anchor-header">Pianificazione delle query</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_query_scheduling_5798178be2.png" alt="2-query-scheduling.png" class="doc-image" id="2-query-scheduling.png" />
   </span> <span class="img-wrapper"> <span>2-query-scheduling.png</span> </span></p>
<ol>
<li>Quando il server Milvus si avvia, Milvus lancia la GpuResource corrispondente tramite i parametri <code translate="no">gpu_resource_config</code> nel file di configurazione <code translate="no">server_config.yaml</code>. DiskResource e CpuResource non possono ancora essere modificati in <code translate="no">server_config.yaml</code>. GpuResource è la combinazione di <code translate="no">search_resources</code> e <code translate="no">build_index_resources</code> ed è indicata come <code translate="no">{gpu0, gpu1}</code> nell'esempio seguente:</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_sample_code_ffee1c290f.png" alt="3-sample-code.png" class="doc-image" id="3-sample-code.png" />
   </span> <span class="img-wrapper"> <span>3-codice-esempio.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_example_0eeb85da71.png" alt="3-example.png" class="doc-image" id="3-example.png" />
   </span> <span class="img-wrapper"> <span>3-esempio.png</span> </span></p>
<ol start="2">
<li>Milvus riceve una richiesta. I metadati delle tabelle sono memorizzati in un database esterno, che è SQLite o MySQl per gli host singoli e MySQL per quelli distribuiti. Dopo aver ricevuto una richiesta di ricerca, Milvus convalida se la tabella esiste e se la dimensione è coerente. Quindi, Milvus legge l'elenco TableFile della tabella.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_milvus_reads_tablefile_list_1e9d851543.png" alt="4-milvus-reads-tablefile-list.png" class="doc-image" id="4-milvus-reads-tablefile-list.png" />
   </span> <span class="img-wrapper"> <span>4-milvus-reads-tablefile-list.png</span> </span></p>
<ol start="3">
<li>Milvus crea un task di ricerca. Poiché il calcolo di ogni TableFile viene eseguito in modo indipendente, Milvus crea un task di ricerca per ogni TableFile. Come unità di base della programmazione dei task, un task di ricerca contiene i vettori di destinazione, i parametri di ricerca e i nomi dei file di TableFile.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_table_file_list_task_creator_36262593e4.png" alt="5-table-file-list-task-creator.png" class="doc-image" id="5-table-file-list-task-creator.png" />
   </span> <span class="img-wrapper"> <span>5-tabella-file-elenco-task-creator.png</span> </span></p>
<ol start="4">
<li>Milvus sceglie un dispositivo di elaborazione. Il dispositivo con cui un task di ricerca esegue i calcoli dipende dal tempo di <strong>completamento stimato</strong> per ogni dispositivo. Il tempo di <strong>completamento stimato</strong> specifica l'intervallo stimato tra l'ora corrente e l'ora prevista per il completamento del calcolo.</li>
</ol>
<p>Ad esempio, quando un blocco di dati di un task di ricerca viene caricato nella memoria della CPU, il task di ricerca successivo è in attesa nella coda dei task di calcolo della CPU e la coda dei task di calcolo della GPU è inattiva. Il <strong>tempo di completamento stimato</strong> per la CPU è pari alla somma del costo temporale stimato del task di ricerca precedente e del task di ricerca corrente. Il <strong>tempo di completamento stimato</strong> per una GPU è uguale alla somma del tempo di caricamento dei blocchi di dati sulla GPU e del costo temporale stimato del task di ricerca corrente. Il <strong>tempo di completamento stimato</strong> per un task di ricerca in una risorsa è uguale al tempo medio di esecuzione di tutti i task di ricerca nella risorsa. Milvus sceglie quindi un dispositivo con il minor <strong>tempo di completamento stimato</strong> e assegna il SearchTask al dispositivo.</p>
<p>In questo caso si assume che il <strong>tempo di completamento stimato</strong> per la GPU1 sia più breve.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_GPU_1_shorter_estimated_completion_time_42c7639b87.png" alt="6-GPU1-shorter-estimated-completion-time.png" class="doc-image" id="6-gpu1-shorter-estimated-completion-time.png" />
   </span> <span class="img-wrapper"> <span>6-GPU1-tempo di completamento stimato più breve.png</span> </span></p>
<ol start="5">
<li><p>Milvus aggiunge SearchTask alla coda di task di DiskResource.</p></li>
<li><p>Milvus sposta SearchTask nella coda dei task di CpuResource. Il thread di caricamento in CpuResource carica ogni task dalla coda dei task in modo sequenziale. CpuResource legge i blocchi di dati corrispondenti nella memoria della CPU.</p></li>
<li><p>Milvus sposta SearchTask in GpuResource. Il thread di caricamento in GpuResource copia i dati dalla memoria della CPU alla memoria della GPU. GpuResource legge i blocchi di dati corrispondenti nella memoria della GPU.</p></li>
<li><p>Milvus esegue SearchTask in GpuResource. Poiché il risultato di un SearchTask è relativamente piccolo, viene restituito direttamente alla memoria della CPU.</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_scheduler_53f1fbbaba.png" alt="7-scheduler.png" class="doc-image" id="7-scheduler.png" />
   </span> <span class="img-wrapper"> <span>7-scheduler.png</span> </span></p>
<ol start="9">
<li>Milvus unisce il risultato di SearchTask all'intero risultato della ricerca.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_milvus_merges_searchtast_result_9f3446e65a.png" alt="8-milvus-merges-searchtast-result.png" class="doc-image" id="8-milvus-merges-searchtast-result.png" />
   </span> <span class="img-wrapper"> <span>8-milvus-merge-il-risultato-di-ricerca.png</span> </span></p>
<p>Dopo che tutti i SearchTask sono stati completati, Milvus restituisce al client l'intero risultato della ricerca.</p>
<h2 id="Index-building" class="common-anchor-header">Costruzione dell'indice<button data-href="#Index-building" class="anchor-icon" translate="no">
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
    </button></h2><p>La costruzione dell'indice è sostanzialmente uguale al processo di ricerca, senza il processo di fusione. Non ne parleremo in dettaglio.</p>
<h2 id="Performance-optimization" class="common-anchor-header">Ottimizzazione delle prestazioni<button data-href="#Performance-optimization" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Cache" class="common-anchor-header">Cache</h3><p>Come già detto, i blocchi di dati devono essere caricati sui dispositivi di memorizzazione corrispondenti, come la memoria della CPU o la memoria della GPU, prima di essere calcolati. Per evitare il caricamento ripetitivo dei dati, Milvus introduce la cache LRU (Least Recently Used). Quando la cache è piena, i nuovi blocchi di dati allontanano quelli vecchi. La dimensione della cache può essere personalizzata dal file di configurazione in base alle dimensioni della memoria corrente. Si consiglia di utilizzare una cache di grandi dimensioni per memorizzare i dati di ricerca, in modo da risparmiare tempo di caricamento dei dati e migliorare le prestazioni di ricerca.</p>
<h3 id="Data-loading-and-computation-overlap" class="common-anchor-header">Sovrapposizione di caricamento e calcolo dei dati</h3><p>La cache non può soddisfare le esigenze di migliori prestazioni di ricerca. I dati devono essere ricaricati quando la memoria è insufficiente o le dimensioni del set di dati sono troppo grandi. È necessario ridurre l'effetto del caricamento dei dati sulle prestazioni di ricerca. Il caricamento dei dati, sia che avvenga dal disco alla memoria della CPU, sia che avvenga dalla memoria della CPU alla memoria della GPU, rientra nelle operazioni di IO e non richiede quasi alcun lavoro di calcolo da parte dei processori. Pertanto, consideriamo di eseguire il caricamento dei dati e la computazione in parallelo per un migliore utilizzo delle risorse.</p>
<p>Dividiamo il calcolo su un blocco di dati in 3 fasi (caricamento dal disco alla memoria della CPU, calcolo della CPU, fusione dei risultati) o 4 fasi (caricamento dal disco alla memoria della CPU, caricamento dalla memoria della CPU alla memoria della GPU, calcolo e recupero dei risultati da parte della GPU e fusione dei risultati). Prendendo come esempio la computazione in 3 fasi, possiamo lanciare 3 thread responsabili delle 3 fasi per funzionare come pipelining di istruzioni. Poiché gli insiemi di risultati sono per lo più piccoli, l'unione dei risultati non richiede molto tempo. In alcuni casi, la sovrapposizione del caricamento dei dati e del calcolo può ridurre di 1/2 il tempo di ricerca.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_sequential_overlapping_load_milvus_1af809b29e.png" alt="9-sequential-overlapping-load-milvus.png" class="doc-image" id="9-sequential-overlapping-load-milvus.png" />
   </span> <span class="img-wrapper"> <span>9-sequenziale-sovrapposizione-carico-milvus.png</span> </span></p>
<h2 id="Problems-and-solutions" class="common-anchor-header">Problemi e soluzioni<button data-href="#Problems-and-solutions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Different-transmission-speeds" class="common-anchor-header">Velocità di trasmissione diverse</h3><p>In precedenza, Milvus utilizzava la strategia Round Robin per la programmazione dei task multi-GPU. Questa strategia ha funzionato perfettamente nel nostro server a 4-GPU e le prestazioni di ricerca sono state 4 volte migliori. Tuttavia, per i nostri host a 2-GPU, le prestazioni non erano 2 volte migliori. Abbiamo fatto alcuni esperimenti e abbiamo scoperto che la velocità di copia dei dati per una GPU era di 11 GB/s. Per un'altra GPU, invece, era di 3 GB/s. Dopo aver consultato la documentazione della scheda madre, abbiamo confermato che la scheda madre era collegata a una GPU tramite PCIe x16 e a un'altra GPU tramite PCIe x4. Ciò significa che queste GPU hanno velocità di copia diverse. In seguito, abbiamo aggiunto il tempo di copia per misurare il dispositivo ottimale per ogni SearchTask.</p>
<h2 id="Future-work" class="common-anchor-header">Lavoro futuro<button data-href="#Future-work" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Hardware-environment-with-increased-complexity" class="common-anchor-header">Ambiente hardware con maggiore complessità</h3><p>In condizioni reali, l'ambiente hardware può essere più complicato. Per gli ambienti hardware con più CPU, memoria con architettura NUMA, NVLink e NVSwitch, la comunicazione tra CPU/GPU offre molte opportunità di ottimizzazione.</p>
<p>Ottimizzazione delle query</p>
<p>Durante la sperimentazione, abbiamo scoperto alcune opportunità di miglioramento delle prestazioni. Ad esempio, quando il server riceve più query per la stessa tabella, in alcune condizioni le query possono essere unite. Utilizzando la localizzazione dei dati, possiamo migliorare le prestazioni. Queste ottimizzazioni saranno implementate nello sviluppo futuro. Ora sappiamo già come vengono programmate ed eseguite le query per lo scenario single-host e multi-GPU. Nei prossimi articoli continueremo a introdurre altri meccanismi interni a Milvus.</p>
