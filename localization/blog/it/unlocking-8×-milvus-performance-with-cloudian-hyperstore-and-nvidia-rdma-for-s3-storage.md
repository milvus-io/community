---
id: >-
  unlocking-8×-milvus-performance-with-cloudian-hyperstore-and-nvidia-rdma-for-s3-storage.md
title: >-
  Sblocco delle prestazioni 8× Milvus con Cloudian HyperStore e NVIDIA RDMA per
  lo storage S3
author: Jon Toor
date: 2025-11-17T00:00:00.000Z
cover: assets.zilliz.com/cloudian_b7531febff.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Cloudian, NVIDIA, RDMA for S3-compatible storage, Milvus'
meta_title: 8× Milvus Boost with Cloudian HyperStore and NVIDIA RDMA
desc: >-
  Cloudian e NVIDIA introducono RDMA per lo storage compatibile con S3,
  accelerando i carichi di lavoro AI con bassa latenza e consentendo un aumento
  delle prestazioni di 8 volte in Milvus.
origin: >-
  https://cloudian.com/blog/cloudian-deploys-new-nvidia-rdma-for-s3-compatible-storage-a-game-changer-for-ai-storage-performance/
---
<p><em>Questo post è stato pubblicato originariamente su <a href="https://cloudian.com/blog/cloudian-deploys-new-nvidia-rdma-for-s3-compatible-storage-a-game-changer-for-ai-storage-performance/">Cloudian</a> e viene ripubblicato qui con l'autorizzazione.</em></p>
<p>Cloudian ha collaborato con NVIDIA per aggiungere il supporto di RDMA per lo storage compatibile con S3 alla sua soluzione HyperStore®, sfruttando i suoi oltre 13 anni di esperienza nell'implementazione delle API S3. In quanto piattaforma basata su S3-API con architettura di elaborazione in parallelo, Cloudian è particolarmente adatta a contribuire e a capitalizzare lo sviluppo di questa tecnologia. Questa collaborazione sfrutta la profonda esperienza di Cloudian nei protocolli di storage a oggetti e la leadership di NVIDIA nell'accelerazione del calcolo e della rete per creare una soluzione che integra perfettamente il computing ad alte prestazioni con lo storage su scala aziendale.</p>
<p>NVIDIA ha annunciato l'imminente disponibilità generale della tecnologia RDMA per lo storage compatibile con S3 (Remote Direct Memory Access), segnando una tappa significativa nell'evoluzione dell'infrastruttura AI. Questa tecnologia rivoluzionaria promette di trasformare il modo in cui le organizzazioni gestiscono gli enormi requisiti di dati dei moderni carichi di lavoro AI, offrendo miglioramenti prestazionali senza precedenti e mantenendo al contempo la scalabilità e la semplicità che hanno reso lo storage di oggetti compatibile con S3 la base del cloud computing.</p>
<h2 id="What-is-RDMA-for-S3-compatible-storage" class="common-anchor-header">Che cos'è RDMA per lo storage compatibile con S3?<button data-href="#What-is-RDMA-for-S3-compatible-storage" class="anchor-icon" translate="no">
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
    </button></h2><p>Questo lancio rappresenta un progresso fondamentale nel modo in cui i sistemi di storage comunicano con gli acceleratori AI. La tecnologia consente il trasferimento diretto dei dati tra lo storage a oggetti compatibile con S3 API e la memoria della GPU, bypassando completamente i tradizionali percorsi dei dati mediati dalla CPU. A differenza delle architetture di storage convenzionali che instradano tutti i trasferimenti di dati attraverso la CPU e la memoria di sistema, creando colli di bottiglia e latenza, RDMA per lo storage compatibile con S3 stabilisce un percorso diretto dallo storage alla GPU.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RDMA_for_S3_compatible_storage_18fdd69d02.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Questa tecnologia elimina i passaggi intermedi con un percorso diretto che riduce la latenza, riduce drasticamente le richieste di elaborazione della CPU e riduce significativamente il consumo energetico. Il risultato sono sistemi di storage in grado di fornire dati alla velocità richiesta dalle moderne GPU per le applicazioni AI più esigenti.</p>
<p>La tecnologia mantiene la compatibilità con le onnipresenti API S3, pur aggiungendo questo percorso di dati ad alte prestazioni. I comandi vengono ancora inviati tramite i protocolli di storage standard basati su S3-API, ma il trasferimento effettivo dei dati avviene tramite RDMA direttamente alla memoria della GPU, bypassando completamente la CPU ed eliminando l'overhead dell'elaborazione del protocollo TCP.</p>
<h2 id="Breakthrough-Performance-Results" class="common-anchor-header">Risultati prestazionali rivoluzionari<button data-href="#Breakthrough-Performance-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>I miglioramenti delle prestazioni offerti da RDMA per lo storage compatibile con S3 sono a dir poco rivoluzionari. I test sul campo dimostrano la capacità della tecnologia di eliminare i colli di bottiglia dell'I/O dello storage che limitano i carichi di lavoro dell'intelligenza artificiale.</p>
<h3 id="Dramatic-Speed-Improvements" class="common-anchor-header">Miglioramenti drastici della velocità:</h3><ul>
<li><p><strong>35 GB/s</strong> di<strong>throughput per nodo</strong> (lettura) misurati, con scalabilità lineare tra i cluster.</p></li>
<li><p><strong>Scalabilità fino a TBs/s</strong> con l'architettura di elaborazione parallela di Cloudian</p></li>
<li><p><strong>Miglioramento del throughput di 3-5 volte</strong> rispetto allo storage di oggetti convenzionale basato su TCP</p></li>
</ul>
<h3 id="Resource-Efficiency-Gains" class="common-anchor-header">Guadagni in termini di efficienza delle risorse:</h3><ul>
<li><p><strong>Riduzione del 90% dell'utilizzo della CPU</strong> grazie alla creazione di percorsi di dati diretti alle GPU.</p></li>
<li><p><strong>Aumento dell'utilizzo delle GPU</strong> con l'eliminazione dei colli di bottiglia</p></li>
<li><p>drastica riduzione del consumo energetico grazie alla riduzione dell'overhead di elaborazione</p></li>
<li><p>Riduzione dei costi per lo storage dell'intelligenza artificiale</p></li>
</ul>
<h3 id="8X-Performance-Boost-on-Milvus-by-Zilliz-Vector-DB" class="common-anchor-header">Aumento delle prestazioni di 8 volte su Milvus by Zilliz Vector DB</h3><p>Questi miglioramenti delle prestazioni sono particolarmente evidenti nelle operazioni di database vettoriale, dove la collaborazione tra Cloudian e Zilliz con le <a href="https://www.nvidia.com/en-us/data-center/l40s/">GPU</a> <a href="https://developer.nvidia.com/cuvs">NVIDIA cuVS</a> e <a href="https://www.nvidia.com/en-us/data-center/l40s/">NVIDIA L40S</a> ha dimostrato un <strong>aumento delle prestazioni di 8 volte nelle operazioni Milvus</strong> rispetto ai sistemi basati su CPU e al trasferimento di dati basato su TCP. Questo rappresenta un passaggio fondamentale dallo storage come vincolo allo storage che permette alle applicazioni di AI di raggiungere il loro pieno potenziale.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vector_indexing_time_354bdd4b46.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-S3-API-based-Object-Storage-for-AI-Workloads" class="common-anchor-header">Perché lo storage a oggetti basato su S3 API per i carichi di lavoro AI<button data-href="#Why-S3-API-based-Object-Storage-for-AI-Workloads" class="anchor-icon" translate="no">
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
    </button></h2><p>La convergenza della tecnologia RDMA con l'architettura di storage a oggetti crea la base ideale per l'infrastruttura di IA, risolvendo molteplici problemi che hanno limitato gli approcci tradizionali allo storage.</p>
<p><strong>Scalabilità Exabyte per l'esplosione dei dati dell'IA:</strong> I carichi di lavoro dell'intelligenza artificiale, in particolare quelli che coinvolgono dati sintetici e multimodali, stanno spingendo i requisiti di storage verso i 100 petabyte e oltre. Lo spazio di indirizzamento piatto dell'archiviazione a oggetti è in grado di scalare senza problemi da petabyte a exabyte, consentendo la crescita esponenziale dei dataset di addestramento dell'IA senza le limitazioni gerarchiche che vincolano i sistemi basati su file.</p>
<p><strong>Piattaforma unificata per flussi di lavoro AI completi:</strong> Le moderne operazioni di IA comprendono l'ingestione dei dati, la pulizia, l'addestramento, il checkpoint e l'inferenza, ognuna delle quali richiede prestazioni e capacità distinte. Lo storage a oggetti compatibile con S3 supporta l'intero spettro attraverso un accesso API coerente, eliminando la complessità e i costi di gestione di più livelli di storage. I dati di training, i modelli, i file di checkpoint e i dataset di inferenza possono risiedere in un unico data lake ad alte prestazioni.</p>
<p><strong>Metadati ricchi per le operazioni di intelligenza artificiale:</strong> Le operazioni critiche di IA, come la ricerca e l'enumerazione, sono fondamentalmente basate sui metadati. Le funzionalità di metadati ricchi e personalizzabili dello storage a oggetti consentono di etichettare, cercare e gestire in modo efficiente i dati, essenziali per organizzare e recuperare i dati nei complessi flussi di lavoro di formazione e inferenza dei modelli di intelligenza artificiale.</p>
<p><strong>Vantaggi economici e operativi:</strong> Lo storage a oggetti compatibile con S3 offre un costo totale di proprietà inferiore fino all'80% rispetto alle alternative di storage dei file, sfruttando l'hardware standard del settore e la scalabilità indipendente di capacità e prestazioni. Questa efficienza economica diventa fondamentale quando i dataset di intelligenza artificiale raggiungono una scala aziendale.</p>
<p><strong>Sicurezza e governance aziendale:</strong> A differenza delle implementazioni GPUDirect che richiedono modifiche a livello di kernel, RDMA per lo storage compatibile con S3 non richiede modifiche al kernel specifiche del fornitore, mantenendo la sicurezza del sistema e la conformità alle normative. Questo approccio è particolarmente prezioso in settori come la sanità e la finanza, dove la sicurezza dei dati e la conformità alle normative sono fondamentali.</p>
<h2 id="The-Road-Ahead" class="common-anchor-header">La strada da percorrere<button data-href="#The-Road-Ahead" class="anchor-icon" translate="no">
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
    </button></h2><p>L'annuncio della disponibilità generale di RDMA per lo storage compatibile con S3 da parte di NVIDIA rappresenta molto più di una pietra miliare tecnologica: segnala la maturazione dell'architettura dell'infrastruttura AI. Combinando la scalabilità illimitata dello storage a oggetti con le prestazioni rivoluzionarie dell'accesso diretto alle GPU, le organizzazioni possono finalmente creare infrastrutture di IA in grado di scalare con le loro ambizioni.</p>
<p>Poiché i carichi di lavoro AI continuano a crescere in complessità e scala, RDMA per lo storage compatibile con S3 fornisce la base di storage che consente alle organizzazioni di massimizzare gli investimenti nell'AI mantenendo la sovranità dei dati e la semplicità operativa. Questa tecnologia trasforma lo storage da collo di bottiglia a fattore abilitante, consentendo alle applicazioni AI di raggiungere il loro pieno potenziale su scala aziendale.</p>
<p>Per le organizzazioni che stanno pianificando la loro roadmap di infrastrutture di IA, la disponibilità generale di RDMA per lo storage compatibile con S3 segna l'inizio di una nuova era in cui le prestazioni dello storage sono davvero all'altezza delle esigenze dei moderni carichi di lavoro di IA.</p>
<h2 id="Industry-Perspectives" class="common-anchor-header">Prospettive del settore<button data-href="#Industry-Perspectives" class="anchor-icon" translate="no">
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
    </button></h2><p>Poiché l'IA diventa sempre più centrale nella fornitura di assistenza sanitaria, cerchiamo continuamente di aumentare le prestazioni e l'efficienza della nostra infrastruttura. Il nuovo RDMA per lo storage compatibile con S3 di NVIDIA e Cloudian sarà fondamentale per le nostre applicazioni di analisi delle immagini mediche e di IA diagnostica, dove l'elaborazione rapida di grandi insiemi di dati può avere un impatto diretto sulla cura dei pazienti, riducendo al contempo i costi di spostamento dei dati tra i dispositivi di storage basati su S3-API e gli storage NAS basati su SSD.  - <em>Dr. Swapnil Rane MD, DNB, PDCC (Nephropath), Mres (TCM), Fellowship in Oncopath, FRCPath Professore (F) di Patologia, PI, AI/Computational Pathology And Imaging Lab OIC- Dipartimento di Oncologia Digitale e Computazionale, Tata Memorial Centre</em></p>
<p>"L'annuncio di NVIDIA di RDMA per la compatibilità con S3 conferma il valore della nostra strategia di infrastruttura AI basata su Cloudian. Permettiamo alle organizzazioni di eseguire AI ad alte prestazioni su scala, preservando al contempo la compatibilità con le API S3 che consente di mantenere la migrazione semplice e i costi di sviluppo delle applicazioni bassi". - <em>Sunil Gupta, cofondatore, amministratore delegato e direttore generale (CEO) di Yotta Data Services</em>.</p>
<p>"Mentre espandiamo le nostre capacità on-premises per offrire una AI sovrana, la tecnologia di storage RDMA for S3 compatibile di NVIDIA e lo storage di oggetti ad alte prestazioni di Cloudian ci offrono le prestazioni di cui abbiamo bisogno senza compromettere la residenza dei dati e senza richiedere alcuna modifica a livello di kernel. La piattaforma HyperStore di Cloudian ci permette di scalare fino a exabyte mantenendo i nostri dati sensibili di intelligenza artificiale completamente sotto il nostro controllo". - <em>Logan Lee, EVP e responsabile del cloud di Kakao</em></p>
<p>"Siamo entusiasti dell'annuncio di NVIDIA della prossima release di RDMA per lo storage GA compatibile con S3. I nostri test con Cloudian hanno dimostrato un miglioramento delle prestazioni fino a 8 volte per le operazioni di database vettoriale, il che consentirà ai nostri utenti di Milvus by Zilliz di ottenere prestazioni su scala cloud per i carichi di lavoro di intelligenza artificiale più impegnativi, mantenendo al contempo la completa sovranità dei dati." - <em>Charles Xie, fondatore e CEO di Zilliz</em></p>
