---
id: building-a-wardrobe-and-outfit-planning-app-with-milvus.md
title: Panoramica del sistema
author: Yu Fang
date: 2021-07-09T06:30:06.439Z
desc: >-
  Scoprite come Milvus, un database vettoriale open-source, viene utilizzato da
  Mozat per alimentare un'app di moda che offre consigli di stile personalizzati
  e un sistema di ricerca delle immagini.
cover: assets.zilliz.com/mozat_blog_0ea9218c71.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-wardrobe-and-outfit-planning-app-with-milvus
---
<custom-h1>Creare un'app per la pianificazione del guardaroba e dell'abbigliamento con Milvus</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_1_5f239a8d48.png" alt="stylepedia-1.png" class="doc-image" id="stylepedia-1.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-1.png</span> </span></p>
<p>Fondata nel 2003, <a href="http://www.mozat.com/home">Mozat</a> è una start-up con sede a Singapore e uffici in Cina e Arabia Saudita. L'azienda è specializzata nella creazione di applicazioni per i social media, la comunicazione e lo stile di vita. <a href="https://stylepedia.com/">Stylepedia</a> è un'applicazione per il guardaroba realizzata da Mozat che aiuta gli utenti a scoprire nuovi stili e a connettersi con altre persone appassionate di moda. Le sue caratteristiche principali includono la possibilità di curare un armadio digitale, consigli di stile personalizzati, funzionalità per i social media e uno strumento di ricerca di immagini per trovare articoli simili a quelli visti online o nella vita reale.</p>
<p><a href="https://milvus.io">Milvus</a> è utilizzato per alimentare il sistema di ricerca delle immagini all'interno di Stylepedia. L'applicazione gestisce tre tipi di immagini: immagini di utenti, immagini di prodotti e fotografie di moda. Ogni immagine può includere uno o più elementi, complicando ulteriormente ogni ricerca. Per essere utile, un sistema di ricerca di immagini deve essere accurato, veloce e stabile, caratteristiche che costituiscono una solida base tecnica per l'aggiunta di nuove funzionalità all'app, come i suggerimenti di outfit e le raccomandazioni di contenuti di moda.</p>
<h2 id="System-overview" class="common-anchor-header">Panoramica del sistema<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_system_process_8e7e2ab3e4.png" alt="stylepedia-system-process.png" class="doc-image" id="stylepedia-system-process.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-sistema-processo.png</span> </span></p>
<p>Il sistema di ricerca delle immagini è suddiviso in componenti offline e online.</p>
<p>Offline, le immagini vengono vettorializzate e inserite in un database vettoriale (Milvus). Nel flusso di lavoro dei dati, le immagini rilevanti dei prodotti e le fotografie di moda vengono convertite in vettori di caratteristiche a 512 dimensioni utilizzando modelli di rilevamento degli oggetti e di estrazione delle caratteristiche. I dati vettoriali vengono poi indicizzati e aggiunti al database vettoriale.</p>
<p>Online, il database delle immagini viene interrogato e le immagini simili vengono restituite all'utente. Analogamente alla componente off-line, un'immagine interrogata viene elaborata dai modelli di rilevamento degli oggetti e di estrazione delle caratteristiche per ottenere un vettore di caratteristiche. Utilizzando il vettore di caratteristiche, Milvus cerca i vettori simili TopK e ottiene gli ID delle immagini corrispondenti. Infine, dopo la post-elaborazione (filtraggio, ordinamento, ecc.), viene restituita una raccolta di immagini simili all'immagine interrogata.</p>
<h2 id="Implementation" class="common-anchor-header">L'implementazione<button data-href="#Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>L'implementazione è suddivisa in quattro moduli:</p>
<ol>
<li>Rilevamento dell'indumento</li>
<li>Estrazione delle caratteristiche</li>
<li>Ricerca della somiglianza vettoriale</li>
<li>Post-elaborazione</li>
</ol>
<h3 id="Garment-detection" class="common-anchor-header">Rilevamento degli indumenti</h3><p>Nel modulo di rilevamento degli indumenti, come modello di rilevamento degli oggetti viene utilizzato <a href="https://pytorch.org/hub/ultralytics_yolov5/">YOLOv5</a>, un framework di rilevamento dei target basato su un'unica fase, per le sue dimensioni ridotte e l'inferenza in tempo reale. Offre quattro dimensioni di modello (YOLOv5s/m/l/x) e ogni dimensione specifica ha pro e contro. I modelli più grandi offrono prestazioni migliori (maggiore precisione), ma richiedono molta più potenza di calcolo e funzionano più lentamente. Poiché in questo caso gli oggetti sono relativamente grandi e facili da rilevare, il modello più piccolo, YOLOv5s, è sufficiente.</p>
<p>I capi di abbigliamento presenti in ogni immagine vengono riconosciuti e ritagliati per essere utilizzati come input del modello di estrazione delle caratteristiche per le elaborazioni successive. Contemporaneamente, il modello di rilevamento degli oggetti prevede anche la classificazione degli indumenti in base a classi predefinite (top, capispalla, pantaloni, gonne, abiti e tutine).</p>
<h3 id="Feature-extraction" class="common-anchor-header">Estrazione delle caratteristiche</h3><p>La chiave per la ricerca della somiglianza è il modello di estrazione delle caratteristiche. Le immagini dei vestiti ritagliate sono incorporate in vettori in virgola mobile a 512 dimensioni che rappresentano i loro attributi in un formato di dati numerici leggibili dalla macchina. La metodologia di <a href="https://github.com/Joon-Park92/Survey_of_Deep_Metric_Learning">apprendimento metrico profondo (DML)</a> è adottata con <a href="https://arxiv.org/abs/1905.11946">EfficientNet</a> come modello di base.</p>
<p>L'apprendimento metrico mira ad addestrare un modulo di estrazione di caratteristiche non lineari basato su CNN (o un codificatore) per ridurre la distanza tra i vettori di caratteristiche corrispondenti alla stessa classe di campioni e aumentare la distanza tra i vettori di caratteristiche corrispondenti a classi diverse di campioni. In questo scenario, la stessa classe di campioni si riferisce allo stesso capo di abbigliamento.</p>
<p>EfficientNet tiene conto sia della velocità che della precisione quando scala uniformemente l'ampiezza, la profondità e la risoluzione della rete. EfficientNet-B4 è utilizzata come rete di estrazione delle caratteristiche e l'output dell'ultimo strato completamente connesso è costituito dalle caratteristiche dell'immagine necessarie per condurre la ricerca di similarità vettoriale.</p>
<h3 id="Vector-similarity-search" class="common-anchor-header">Ricerca di similarità vettoriale</h3><p>Milvus è un database vettoriale open source che supporta le operazioni di creazione, lettura, aggiornamento e cancellazione (CRUD) e la ricerca in tempo quasi reale su insiemi di dati da mille miliardi di byte. In Stylepedia viene utilizzato per la ricerca di somiglianze vettoriali su larga scala perché è altamente elastico, stabile, affidabile e velocissimo. Milvus estende le funzionalità delle librerie di indici vettoriali più diffuse (Faiss, NMSLIB, Annoy, ecc.) e fornisce una serie di API semplici e intuitive che consentono agli utenti di selezionare il tipo di indice ideale per un determinato scenario.</p>
<p>Dati i requisiti dello scenario e la scala dei dati, gli sviluppatori di Stylepedia hanno utilizzato la distribuzione solo per CPU di Milvus abbinata all'indice HNSW. Due collezioni indicizzate, una per i prodotti e l'altra per le fotografie di moda, sono state costruite per alimentare diverse funzionalità dell'applicazione. Ciascuna raccolta è ulteriormente suddivisa in sei partizioni in base ai risultati di rilevamento e classificazione per restringere l'ambito di ricerca. Milvus esegue ricerche su decine di milioni di vettori in millisecondi, fornendo prestazioni ottimali e mantenendo bassi i costi di sviluppo e minimizzando il consumo di risorse.</p>
<h3 id="Post-processing" class="common-anchor-header">Post-elaborazione</h3><p>Per migliorare la somiglianza tra i risultati del reperimento delle immagini e l'immagine interrogata, utilizziamo il filtraggio dei colori e delle etichette chiave (lunghezza delle maniche, lunghezza dei vestiti, stile del colletto, ecc.) per filtrare le immagini non ammissibili. Inoltre, viene utilizzato un algoritmo di valutazione della qualità dell'immagine per assicurarsi che le immagini di qualità superiore vengano presentate per prime agli utenti.</p>
<h2 id="Application" class="common-anchor-header">Applicazione<button data-href="#Application" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="User-uploads-and-image-search" class="common-anchor-header">Caricamento degli utenti e ricerca delle immagini</h3><p>Gli utenti possono scattare foto dei propri abiti e caricarle nell'armadio digitale di Stylepedia, per poi recuperare le immagini dei prodotti più simili a quelle caricate.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_search_results_0568e20dc0.png" alt="stylepedia-search-results.png" class="doc-image" id="stylepedia-search-results.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-search-results.png</span> </span></p>
<h3 id="Outfit-suggestions" class="common-anchor-header">Suggerimenti di abbigliamento</h3><p>Effettuando una ricerca per similarità sul database di Stylepedia, gli utenti possono trovare fotografie di moda che contengono uno specifico articolo di moda. Potrebbe trattarsi di nuovi capi che qualcuno sta pensando di acquistare o di qualcosa della propria collezione che potrebbe essere indossato o abbinato in modo diverso. Poi, grazie al raggruppamento degli articoli a cui è spesso abbinato, vengono generati suggerimenti per l'outfit. Ad esempio, una giacca nera da motociclista può essere abbinata a diversi capi, come un paio di jeans skinny neri. Gli utenti possono quindi sfogliare le fotografie di moda in cui si verifica questo abbinamento nella formula selezionata.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_jacket_outfit_e84914da9e.png" alt="stylepedia-jacket-outfit.png" class="doc-image" id="stylepedia-jacket-outfit.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-jacket-outfit.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_jacket_snapshot_25f53cc09b.png" alt="stylepedia-jacket-snapshot.png" class="doc-image" id="stylepedia-jacket-snapshot.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-jacket-snapshot.png</span> </span></p>
<h3 id="Fashion-photograph-recommendations" class="common-anchor-header">Raccomandazioni sulle fotografie di moda</h3><p>In base alla cronologia di navigazione dell'utente, ai suoi gusti e al contenuto del suo armadio digitale, il sistema calcola la somiglianza e fornisce raccomandazioni personalizzate di fotografie di moda che potrebbero essere di interesse.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_user_wardrobe_6770c856b9.png" alt="stylepedia-user-wardrobe.png" class="doc-image" id="stylepedia-user-wardrobe.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-user-wardrobe.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/stylepedia_streetsnap_rec_901601a34d.png" alt="stylepedia-streetsnap-rec.png" class="doc-image" id="stylepedia-streetsnap-rec.png" />
   </span> <span class="img-wrapper"> <span>stylepedia-streetsnap-rec.png</span> </span></p>
<p>Combinando le metodologie di deep learning e di computer vision, Mozat è riuscita a costruire un sistema di ricerca della somiglianza delle immagini veloce, stabile e accurato, utilizzando Milvus per alimentare diverse funzioni dell'app Stylepedia.</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">Non essere un estraneo<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
<li>Trovate o contribuite a Milvus su <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Interagite con la comunità via <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Connettetevi con noi su <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
