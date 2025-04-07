---
id: what-is-vector-database-and-how-it-works.md
title: Cos'è esattamente un database vettoriale e come funziona
author: Zilliz
date: 2025-03-24T00:00:00.000Z
desc: >-
  Un database vettoriale memorizza, indicizza e ricerca le incorporazioni
  vettoriali generate da modelli di apprendimento automatico per il recupero
  rapido delle informazioni e la ricerca di similarità.
cover: assets.zilliz.com/What_s_a_Vector_Database_and_How_Does_It_Work_cac0875415.png
tag: Engineering
canonicalUrl: >-
  https://milvus.io/blog/parse-is-hard-solve-semantic-understanding-with-mistral-ocr-and-milvus.md
---
<p>Un database vettoriale indicizza e memorizza le incorporazioni vettoriali per un rapido recupero e una ricerca di similarità, con funzionalità come le operazioni CRUD, il filtraggio dei metadati e la scalabilità orizzontale progettata appositamente per le applicazioni di intelligenza artificiale.</p>
<iframe width="100%" height="315" src="https://www.youtube.com/embed/4yQjsY5iD9Q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
<h2 id="Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="common-anchor-header">Introduzione: L'ascesa dei database vettoriali nell'era dell'IA<button data-href="#Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="anchor-icon" translate="no">
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
    </button></h2><p>Agli albori di ImageNet, erano necessari 25.000 curatori umani per etichettare manualmente il set di dati. Questo numero sbalorditivo evidenzia una sfida fondamentale per l'IA: la categorizzazione manuale di dati non strutturati semplicemente non è scalabile. Con miliardi di immagini, video, documenti e file audio generati ogni giorno, era necessario un cambiamento di paradigma nel modo in cui i computer comprendono e interagiscono con i contenuti.</p>
<p><a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">I tradizionali</a> sistemi di<a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">database relazionali</a> eccellono nella gestione di dati strutturati con formati predefiniti e nell'esecuzione di precise operazioni di ricerca. I database vettoriali, invece, sono specializzati nell'archiviazione e nel recupero di tipi di <a href="https://zilliz.com/learn/introduction-to-unstructured-data">dati non strutturati </a>, come immagini, audio, video e contenuti testuali, attraverso rappresentazioni numeriche ad alta dimensione note come embeddings vettoriali. I database vettoriali supportano <a href="https://zilliz.com/glossary/large-language-models-(llms)">modelli linguistici di grandi dimensioni</a> fornendo un efficiente recupero e gestione dei dati. I moderni database vettoriali superano i sistemi tradizionali di 2-10 volte grazie all'ottimizzazione hardware-aware (AVX512, SIMD, GPU, SSD NVMe), agli algoritmi di ricerca altamente ottimizzati (HNSW, IVF, DiskANN) e al design dello storage orientato alle colonne. La loro architettura cloud-native e disaccoppiata consente di scalare in modo indipendente i componenti di ricerca, inserimento dati e indicizzazione, permettendo ai sistemi di gestire in modo efficiente miliardi di vettori mantenendo le prestazioni per le applicazioni AI aziendali di aziende come Salesforce, PayPal, eBay e NVIDIA.</p>
<p>Questo rappresenta quello che gli esperti chiamano "gap semantico": i database tradizionali operano su corrispondenze esatte e relazioni predefinite, mentre la comprensione umana dei contenuti è sfumata, contestuale e multidimensionale. Questo divario diventa sempre più problematico man mano che le applicazioni di IA lo richiedono:</p>
<ul>
<li><p>Trovare somiglianze concettuali piuttosto che corrispondenze esatte.</p></li>
<li><p>Comprendere le relazioni contestuali tra i diversi contenuti</p></li>
<li><p>catturare l'essenza semantica delle informazioni al di là delle parole chiave</p></li>
<li><p>Elaborare dati multimodali all'interno di un quadro unificato.</p></li>
</ul>
<p>I database vettoriali sono emersi come tecnologia cruciale per colmare questo divario, diventando una componente essenziale della moderna infrastruttura di IA. Migliorano le prestazioni dei modelli di apprendimento automatico facilitando compiti come il clustering e la classificazione.</p>
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/episode/1T6K6wlZuryLbETUrafO9f?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
<h2 id="Understanding-Vector-Embeddings-The-Foundation" class="common-anchor-header">Comprendere le incorporazioni vettoriali: La base<button data-href="#Understanding-Vector-Embeddings-The-Foundation" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/glossary/vector-embeddings">Gli embeddings vettoriali</a> costituiscono il ponte critico per superare il divario semantico. Queste rappresentazioni numeriche ad alta dimensione catturano l'essenza semantica dei dati non strutturati in una forma che i computer possono elaborare in modo efficiente. I moderni modelli di embedding trasformano i contenuti grezzi - siano essi testi, immagini o audio - in vettori densi in cui concetti simili si raggruppano nello spazio vettoriale, indipendentemente dalle differenze di superficie.</p>
<p>Ad esempio, le incorporazioni correttamente costruite posizionano concetti come "automobile", "macchina" e "veicolo" in prossimità all'interno dello spazio vettoriale, nonostante abbiano forme lessicali diverse. Questa proprietà consente alle <a href="https://zilliz.com/glossary/semantic-search">ricerche semantiche</a>, ai <a href="https://zilliz.com/vector-database-use-cases/recommender-system">sistemi di raccomandazione</a> e alle applicazioni di intelligenza artificiale di comprendere i contenuti al di là della semplice corrispondenza dei modelli.</p>
<p>La potenza delle incorporazioni si estende a tutte le modalità. I database vettoriali avanzati supportano diversi tipi di dati non strutturati (testo, immagini, audio) in un sistema unificato, consentendo ricerche intermodali e relazioni che in precedenza era impossibile modellare in modo efficiente. Queste capacità dei database vettoriali sono fondamentali per le tecnologie guidate dall'intelligenza artificiale, come i chatbot e i sistemi di riconoscimento delle immagini, che supportano applicazioni avanzate come la ricerca semantica e i sistemi di raccomandazione.</p>
<p>Tuttavia, la memorizzazione, l'indicizzazione e il recupero degli embeddings su scala presenta sfide computazionali uniche che i database tradizionali non sono stati costruiti per affrontare.</p>
<h2 id="Vector-Databases-Core-Concepts" class="common-anchor-header">Basi di dati vettoriali: Concetti fondamentali<button data-href="#Vector-Databases-Core-Concepts" class="anchor-icon" translate="no">
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
    </button></h2><p>I database vettoriali rappresentano un cambiamento di paradigma nel modo di memorizzare e interrogare i dati non strutturati. A differenza dei tradizionali sistemi di database relazionali che eccellono nella gestione di dati strutturati con formati predefiniti, i database vettoriali sono specializzati nella gestione di dati non strutturati attraverso rappresentazioni numeriche vettoriali.</p>
<p>I database vettoriali sono progettati per risolvere un problema fondamentale: consentire ricerche efficienti di somiglianza tra enormi insiemi di dati non strutturati. Questo obiettivo viene raggiunto attraverso tre componenti chiave:</p>
<p><strong>Embeddings vettoriali</strong>: Rappresentazioni numeriche ad alta dimensione che catturano il significato semantico dei dati non strutturati (testo, immagini, audio, ecc.).</p>
<p><strong>Indicizzazione specializzata</strong>: Algoritmi ottimizzati per spazi vettoriali ad alta dimensione che consentono ricerche approssimative e veloci. Il database vettoriale indicizza i vettori per migliorare la velocità e l'efficienza delle ricerche di similarità, utilizzando vari algoritmi di ML per creare indici sulle incorporazioni vettoriali.</p>
<p><a href="https://zilliz.com/blog/similarity-metrics-for-vector-search"><strong>Metriche di distanza</strong></a>: Funzioni matematiche che quantificano la somiglianza tra vettori.</p>
<p>L'operazione principale di un database vettoriale è la query <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">k-nearest neighbors</a> (KNN), che trova i k vettori più simili a un dato vettore di interrogazione. Per le applicazioni su larga scala, questi database implementano in genere algoritmi di <a href="https://zilliz.com/glossary/anns">nearest neighbor approssimati</a> (ANN), scambiando una piccola quantità di accuratezza per un significativo guadagno in termini di velocità di ricerca.</p>
<h3 id="Mathematical-Foundations-of-Vector-Similarity" class="common-anchor-header">Fondamenti matematici della similarità vettoriale</h3><p>Per comprendere i database vettoriali è necessario comprendere i principi matematici alla base della similarità vettoriale. Ecco i concetti fondamentali:</p>
<h3 id="Vector-Spaces-and-Embeddings" class="common-anchor-header">Spazi vettoriali e incorporazioni</h3><p>Un <a href="https://zilliz.com/learn/everything-you-should-know-about-vector-embeddings">embedding vettoriale</a> è un array a lunghezza fissa di numeri in virgola mobile (può variare da 100 a 32.768 dimensioni!) che rappresenta dati non strutturati in un formato numerico. Questi embedding posizionano elementi simili più vicini tra loro in uno spazio vettoriale ad alta dimensione.</p>
<p>Ad esempio, le parole "re" e "regina" hanno rappresentazioni vettoriali che sono più vicine tra loro di quanto non lo sia "automobile" in uno spazio di incorporamento di parole ben addestrato.</p>
<h3 id="Distance-Metrics" class="common-anchor-header">Metriche di distanza</h3><p>La scelta della metrica di distanza influisce fondamentalmente sul modo in cui viene calcolata la somiglianza. Le metriche di distanza più comuni sono:</p>
<ol>
<li><p><strong>Distanza euclidea</strong>: La distanza rettilinea tra due punti nello spazio euclideo.</p></li>
<li><p><strong>Similitudine del coseno</strong>: Misura il coseno dell'angolo tra due vettori, concentrandosi sull'orientamento piuttosto che sulla grandezza.</p></li>
<li><p><strong>Prodotto di punto</strong>: Per i vettori normalizzati, rappresenta l'allineamento di due vettori.</p></li>
<li><p><strong>Distanza di Manhattan (norma L1)</strong>: Somma delle differenze assolute tra le coordinate.</p></li>
</ol>
<p>Casi d'uso diversi possono richiedere metriche di distanza diverse. Per esempio, la somiglianza del coseno spesso funziona bene per le incorporazioni di testo, mentre la distanza euclidea può essere più adatta per alcuni tipi di <a href="https://zilliz.com/learn/image-embeddings-for-enhanced-image-search">incorporazioni di immagini</a>.</p>
<p><a href="https://zilliz.com/glossary/semantic-similarity">Somiglianza semantica</a> tra vettori in uno spazio vettoriale</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Semantic_similarity_between_vectors_in_a_vector_space_ee6fb35909.png" alt="Semantic similarity between vectors in a vector space" class="doc-image" id="semantic-similarity-between-vectors-in-a-vector-space" />
   </span> <span class="img-wrapper"> <span>Somiglianza semantica tra vettori in uno spazio vettoriale</span> </span></p>
<p>La comprensione di queste basi matematiche porta a un'importante questione di implementazione: È sufficiente aggiungere un indice vettoriale a qualsiasi database, giusto?</p>
<p>La semplice aggiunta di un indice vettoriale a un database relazionale non è sufficiente, così come l'utilizzo di una <a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">libreria di indici vettoriali</a> indipendente. Sebbene gli indici vettoriali forniscano la capacità critica di trovare vettori simili in modo efficiente, mancano dell'infrastruttura necessaria per le applicazioni di produzione:</p>
<ul>
<li><p>non forniscono operazioni CRUD per la gestione dei dati vettoriali</p></li>
<li><p>Mancano di capacità di archiviazione e filtraggio dei metadati.</p></li>
<li><p>Non offrono scalabilità, replicazione o tolleranza ai guasti incorporate</p></li>
<li><p>Richiedono un'infrastruttura personalizzata per la persistenza e la gestione dei dati.</p></li>
</ul>
<p>I database vettoriali sono nati per risolvere queste limitazioni, fornendo funzionalità complete di gestione dei dati progettate specificamente per le incorporazioni vettoriali. Combinano la potenza semantica della ricerca vettoriale con le capacità operative dei sistemi di database.</p>
<p>A differenza dei database tradizionali che operano su corrispondenze esatte, i database vettoriali si concentrano sulla ricerca semantica, trovando i vettori "più simili" a un vettore di interrogazione secondo specifiche metriche di distanza. Questa differenza fondamentale determina l'architettura e gli algoritmi unici che alimentano questi sistemi specializzati.</p>
<h2 id="Vector-Database-Architecture-A-Technical-Framework" class="common-anchor-header">Architettura dei database vettoriali: Un quadro tecnico<button data-href="#Vector-Database-Architecture-A-Technical-Framework" class="anchor-icon" translate="no">
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
    </button></h2><p>I moderni database vettoriali implementano una sofisticata architettura a più livelli che separa i problemi, consente la scalabilità e garantisce la manutenzione. Questa struttura tecnica va ben oltre i semplici indici di ricerca per creare sistemi in grado di gestire i carichi di lavoro dell'intelligenza artificiale in produzione. I database vettoriali funzionano elaborando e recuperando le informazioni per le applicazioni di intelligenza artificiale e ML, utilizzando algoritmi per la ricerca approssimativa dei vicini, convertendo vari tipi di dati grezzi in vettori e gestendo in modo efficiente diversi tipi di dati attraverso ricerche semantiche.</p>
<h3 id="Four-Tier-Architecture" class="common-anchor-header">Architettura a quattro livelli</h3><p>Un database vettoriale di produzione è tipicamente composto da quattro livelli architettonici principali:</p>
<ol>
<li><p><strong>Livello di archiviazione</strong>: Gestisce l'archiviazione persistente dei dati vettoriali e dei metadati, implementa strategie di codifica e compressione specializzate e ottimizza i modelli di I/O per l'accesso specifico ai vettori.</p></li>
<li><p><strong>Livello indice</strong>: Mantiene diversi algoritmi di indicizzazione, ne gestisce la creazione e l'aggiornamento e implementa ottimizzazioni hardware specifiche per le prestazioni.</p></li>
<li><p><strong>Livello di interrogazione</strong>: Elabora le query in arrivo, determina le strategie di esecuzione, gestisce l'elaborazione dei risultati e implementa la cache per le query ripetute.</p></li>
<li><p><strong>Livello di servizio</strong>: Gestisce le connessioni dei client, gestisce l'instradamento delle richieste, fornisce il monitoraggio e la registrazione e implementa la sicurezza e la multi-tenancy.</p></li>
</ol>
<h3 id="Vector-Search-Workflow" class="common-anchor-header">Flusso di lavoro della ricerca vettoriale</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Complete_workflow_of_a_vector_search_operation_7283d7546a.png" alt="Complete workflow of a vector search operation.png" class="doc-image" id="complete-workflow-of-a-vector-search-operation.png" />
   </span> <span class="img-wrapper"> <span>Flusso di lavoro completo di un'operazione di ricerca vettoriale.png</span> </span></p>
<p>Una tipica implementazione di database vettoriale segue questo flusso di lavoro:</p>
<ol>
<li><p>Un modello di apprendimento automatico trasforma i dati non strutturati (testo, immagini, audio) in embeddings vettoriali.</p></li>
<li><p>Questi embeddings vettoriali vengono memorizzati nel database insieme ai metadati pertinenti.</p></li>
<li><p>Quando un utente esegue una query, questa viene convertita in un embedding vettoriale utilizzando lo <em>stesso</em> modello</p></li>
<li><p>Il database confronta il vettore dell'interrogazione con i vettori memorizzati utilizzando un algoritmo di prossimità approssimativa.</p></li>
<li><p>Il sistema restituisce i primi K risultati più rilevanti in base alla somiglianza dei vettori</p></li>
<li><p>Una post-elaborazione opzionale può applicare filtri aggiuntivi o un reranking.</p></li>
</ol>
<p>Questa pipeline consente di effettuare ricerche semantiche efficienti su enormi raccolte di dati non strutturati, impossibili con gli approcci tradizionali ai database.</p>
<h4 id="Consistency-in-Vector-Databases" class="common-anchor-header">Consistenza nei database vettoriali</h4><p>Garantire la coerenza nei database vettoriali distribuiti è una sfida dovuta al compromesso tra prestazioni e correttezza. Mentre la consistenza eventuale è comune nei sistemi su larga scala, per le applicazioni mission-critical come il rilevamento delle frodi e le raccomandazioni in tempo reale sono necessari modelli di consistenza forti. Tecniche come le scritture basate sul quorum e il consenso distribuito (ad esempio, <a href="https://zilliz.com/learn/raft-or-not">Raft</a>, Paxos) garantiscono l'integrità dei dati senza eccessivi compromessi in termini di prestazioni.</p>
<p>Le implementazioni di produzione adottano un'architettura di storage condiviso con disaggregazione dello storage e dell'elaborazione. Questa separazione segue il principio della disaggregazione del piano dati e del piano di controllo, con ogni livello scalabile in modo indipendente per un utilizzo ottimale delle risorse.</p>
<h3 id="Managing-Connections-Security-and-Multitenancy" class="common-anchor-header">Gestione delle connessioni, della sicurezza e della multitenancy</h3><p>Poiché questi database sono utilizzati in ambienti multi-utente e multi-tenant, la protezione dei dati e la gestione del controllo degli accessi sono fondamentali per mantenere la riservatezza.</p>
<p>Misure di sicurezza come la crittografia (sia a riposo che in transito) proteggono i dati sensibili, come le incorporazioni e i metadati. L'autenticazione e l'autorizzazione garantiscono che solo gli utenti autorizzati possano accedere al sistema, con permessi a grana fine per gestire l'accesso a dati specifici.</p>
<p>Il controllo degli accessi definisce ruoli e permessi per limitare l'accesso ai dati. Questo aspetto è particolarmente importante per i database che conservano informazioni sensibili come i dati dei clienti o i modelli di intelligenza artificiale proprietari.</p>
<p>La multitenancy prevede l'isolamento dei dati di ciascun tenant per impedire l'accesso non autorizzato, consentendo al contempo la condivisione delle risorse. Ciò si ottiene attraverso lo sharding, il partizionamento o la sicurezza a livello di riga per garantire un accesso scalabile e sicuro a diversi team o clienti.</p>
<p>I sistemi esterni di gestione delle identità e degli accessi (IAM) si integrano con i database vettoriali per applicare le politiche di sicurezza e garantire la conformità agli standard di settore.</p>
<h2 id="Advantages-of-Vector-Databases" class="common-anchor-header">Vantaggi dei database vettoriali<button data-href="#Advantages-of-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>I database vettoriali offrono diversi vantaggi rispetto ai database tradizionali, che li rendono la scelta ideale per la gestione dei dati vettoriali. Ecco alcuni dei principali vantaggi:</p>
<ol>
<li><p><strong>Ricerca di similarità efficiente</strong>: Una delle caratteristiche principali dei database vettoriali è la loro capacità di eseguire ricerche semantiche efficienti. A differenza dei database tradizionali che si basano su corrispondenze esatte, i database vettoriali eccellono nel trovare punti di dati simili a un determinato vettore di interrogazione. Questa capacità è fondamentale per applicazioni come i sistemi di raccomandazione, dove la ricerca di elementi simili alle interazioni passate di un utente può migliorare significativamente l'esperienza dell'utente.</p></li>
<li><p><strong>Gestione di dati ad alta dimensionalità</strong>: I database vettoriali sono progettati specificamente per gestire in modo efficiente i dati ad alta dimensionalità. Questo li rende particolarmente adatti alle applicazioni di elaborazione del linguaggio naturale, <a href="https://zilliz.com/learn/what-is-computer-vision">computer vision</a> e genomica, dove i dati sono spesso presenti in spazi ad alta dimensionalità. Sfruttando algoritmi di indicizzazione e di ricerca avanzati, i database vettoriali possono recuperare rapidamente i punti di dati rilevanti, anche in insiemi di dati complessi che incorporano vettori.</p></li>
<li><p><strong>Scalabilità</strong>: La scalabilità è un requisito fondamentale per le moderne applicazioni di intelligenza artificiale e i database vettoriali sono costruiti per scalare in modo efficiente. Che si tratti di milioni o miliardi di vettori, i database vettoriali sono in grado di gestire le crescenti esigenze delle applicazioni di IA grazie alla scalabilità orizzontale. Ciò garantisce che le prestazioni rimangano costanti anche quando i volumi di dati aumentano.</p></li>
<li><p><strong>Flessibilità</strong>: I database vettoriali offrono una notevole flessibilità in termini di rappresentazione dei dati. Possono memorizzare e gestire vari tipi di dati, tra cui caratteristiche numeriche, incorporazioni di testo o immagini e persino dati complessi come le strutture molecolari. Questa versatilità rende i database vettoriali uno strumento potente per un'ampia gamma di applicazioni, dall'analisi del testo alla ricerca scientifica.</p></li>
<li><p><strong>Applicazioni in tempo reale</strong>: Molti database vettoriali sono ottimizzati per l'interrogazione in tempo reale o quasi. Ciò è particolarmente importante per le applicazioni che richiedono risposte rapide, come il rilevamento delle frodi, le raccomandazioni in tempo reale e i sistemi interattivi di intelligenza artificiale. La capacità di eseguire ricerche di similarità rapide garantisce che queste applicazioni possano fornire risultati tempestivi e pertinenti.</p></li>
</ol>
<h2 id="Use-Cases-for-Vector-Databases" class="common-anchor-header">Casi d'uso dei database vettoriali<button data-href="#Use-Cases-for-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>I database vettoriali hanno un'ampia gamma di applicazioni in vari settori, a dimostrazione della loro versatilità e potenza. Ecco alcuni casi d'uso degni di nota:</p>
<ol>
<li><p><strong>Elaborazione del linguaggio naturale</strong>: Nell'ambito dell'elaborazione del linguaggio naturale (NLP), i database vettoriali svolgono un ruolo fondamentale. Vengono utilizzati per compiti quali la classificazione del testo, l'analisi del sentiment e la traduzione linguistica. Convertendo il testo in embedding vettoriali ad alta dimensione, i database vettoriali consentono di effettuare ricerche efficienti di similarità e di comprendere la semantica, migliorando le prestazioni dei <a href="https://zilliz.com/learn/7-nlp-models">modelli NLP</a>.</p></li>
<li><p><strong>Visione artificiale</strong>: I database vettoriali sono ampiamente utilizzati anche nelle applicazioni di computer vision. Attività come il riconoscimento delle immagini, il <a href="https://zilliz.com/learn/what-is-object-detection">rilevamento degli oggetti</a> e la segmentazione delle immagini traggono vantaggio dalla capacità dei database vettoriali di gestire le incorporazioni di immagini ad alta dimensione. Ciò consente un recupero rapido e accurato di immagini visivamente simili, rendendo i database vettoriali indispensabili in campi come la guida autonoma, l'imaging medico e la gestione delle risorse digitali.</p></li>
<li><p><strong>Genomica</strong>: in genomica, i database vettoriali sono utilizzati per memorizzare e analizzare sequenze genetiche, strutture proteiche e altri dati molecolari. La natura altamente dimensionale di questi dati rende i database vettoriali la scelta ideale per gestire e interrogare grandi insiemi di dati genomici. I ricercatori possono eseguire ricerche vettoriali per trovare sequenze genetiche con pattern simili, favorendo la scoperta di marcatori genetici e la comprensione di processi biologici complessi.</p></li>
<li><p><strong>Sistemi di raccomandazione</strong>: I database vettoriali sono la pietra miliare dei moderni sistemi di raccomandazione. Memorizzando le interazioni dell'utente e le caratteristiche degli articoli come embeddings vettoriali, questi database possono identificare rapidamente gli articoli simili a quelli con cui l'utente ha interagito in precedenza. Questa capacità aumenta l'accuratezza e la pertinenza delle raccomandazioni, migliorando la soddisfazione e il coinvolgimento degli utenti.</p></li>
<li><p><strong>Chatbot e assistenti virtuali</strong>: I database vettoriali sono utilizzati nei chatbot e negli assistenti virtuali per fornire risposte contestuali in tempo reale alle domande degli utenti. Convertendo gli input dell'utente in embedding vettoriali, questi sistemi possono eseguire ricerche di similarità per trovare le risposte più pertinenti. Ciò consente ai chatbot e agli assistenti virtuali di fornire risposte più accurate e contestuali, migliorando l'esperienza complessiva dell'utente.</p></li>
</ol>
<p>Sfruttando le capacità uniche dei database vettoriali, le organizzazioni di vari settori possono creare applicazioni di intelligenza artificiale più intelligenti, reattive e scalabili.</p>
<h2 id="Vector-Search-Algorithms-From-Theory-to-Practice" class="common-anchor-header">Algoritmi di ricerca vettoriale: Dalla teoria alla pratica<button data-href="#Vector-Search-Algorithms-From-Theory-to-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p>I database vettoriali richiedono <a href="https://zilliz.com/learn/vector-index">algoritmi di</a> indicizzazione specializzati per consentire un'efficiente ricerca di similarità in spazi ad alta dimensionalità. La scelta dell'algoritmo ha un impatto diretto sulla precisione, la velocità, l'utilizzo della memoria e la scalabilità.</p>
<h3 id="Graph-Based-Approaches" class="common-anchor-header">Approcci basati sui grafi</h3><p><strong>HNSW (</strong><a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW"><strong>Hierarchical Navigable Small World</strong></a><strong>)</strong> crea strutture navigabili collegando vettori simili, consentendo una traversata efficiente durante la ricerca. HNSW limita le connessioni massime per nodo e l'ambito di ricerca per bilanciare prestazioni e accuratezza, rendendolo uno degli algoritmi più utilizzati per la ricerca di similarità vettoriale.</p>
<p><strong>Cagra</strong> è un indice a grafo ottimizzato specificamente per l'accelerazione su GPU. Costruisce strutture a grafo navigabili che si allineano ai modelli di elaborazione delle GPU, consentendo confronti vettoriali in parallelo. Ciò che rende Cagra particolarmente efficace è la sua capacità di bilanciare richiamo e prestazioni attraverso parametri configurabili come il grado del grafo e l'ampiezza della ricerca. L'uso di GPU di livello inferenziale con Cagra può essere più conveniente rispetto al costoso hardware di livello training, pur garantendo un elevato throughput, soprattutto per le raccolte vettoriali su larga scala. Tuttavia, vale la pena notare che gli indici su GPU come Cagra non necessariamente riducono la latenza rispetto agli indici su CPU, a meno che non si operi con una pressione elevata sulle query.</p>
<h3 id="Quantization-Techniques" class="common-anchor-header">Tecniche di quantizzazione</h3><p><a href="https://zilliz.com/learn/scalar-quantization-and-product-quantization"><strong>La quantizzazione del prodotto (PQ)</strong></a> decompone i vettori ad alta dimensione in sottovettori più piccoli, quantizzando ciascuno di essi separatamente. Questo riduce in modo significativo le esigenze di memorizzazione (spesso di oltre il 90%), ma introduce una certa perdita di precisione.</p>
<p>La<strong>quantizzazione scalare (SQ)</strong> converte i float a 32 bit in interi a 8 bit, riducendo l'uso della memoria del 75% con un impatto minimo sulla precisione.</p>
<h3 id="On-Disk-Indexing-Cost-Effective-Scaling" class="common-anchor-header">Indicizzazione su disco: Scalabilità a costi contenuti</h3><p>Per collezioni di vettori su larga scala (oltre 100 milioni di vettori), gli indici in memoria diventano proibitivi. Ad esempio, 100 milioni di vettori a 1024 dimensioni richiederebbero circa 400 GB di RAM. È qui che algoritmi di indicizzazione su disco come DiskANN offrono notevoli vantaggi in termini di costi.</p>
<p><a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN</a>, basato sull'algoritmo a grafo Vamana, consente un'efficiente ricerca vettoriale memorizzando la maggior parte dell'indice su unità SSD NVMe anziché sulla RAM. Questo approccio offre diversi vantaggi in termini di costi:</p>
<ul>
<li><p><strong>Riduzione dei costi hardware</strong>: Le organizzazioni possono implementare la ricerca vettoriale su scala utilizzando hardware di base con configurazioni di RAM modeste.</p></li>
<li><p><strong>Riduzione delle spese operative</strong>: Meno RAM significa meno consumo di energia e costi di raffreddamento nei data center.</p></li>
<li><p><strong>Scalabilità lineare dei costi</strong>: I costi della memoria scalano linearmente con il volume dei dati, mentre le prestazioni rimangono relativamente stabili.</p></li>
<li><p><strong>Modelli di I/O ottimizzati</strong>: Il design specializzato di DiskANN riduce al minimo le letture su disco grazie ad accurate strategie di attraversamento dei grafi.</p></li>
</ul>
<p>Il compromesso è in genere un modesto aumento della latenza delle query (spesso solo 2-3 ms) rispetto agli approcci puramente in-memory, che è accettabile per molti casi di utilizzo in produzione.</p>
<h3 id="Specialized-Index-Types" class="common-anchor-header">Tipi di indici specializzati</h3><p>Gli<strong>indici Binary Embedding</strong> sono specializzati per la computer vision, il fingerprinting delle immagini e i sistemi di raccomandazione in cui i dati possono essere rappresentati come caratteristiche binarie. Questi indici rispondono a diverse esigenze applicative. Per la deduplicazione delle immagini, il watermarking digitale e il rilevamento del copyright, dove la corrispondenza esatta è fondamentale, gli indici binari ottimizzati forniscono un rilevamento preciso della somiglianza. Per i sistemi di raccomandazione ad alto rendimento, il recupero di immagini basate sui contenuti e la corrispondenza di caratteristiche su larga scala, in cui la velocità è prioritaria rispetto al richiamo perfetto, gli indici binari offrono vantaggi eccezionali in termini di prestazioni.</p>
<p>Gli<strong>indici vettoriali sparsi</strong> sono ottimizzati per vettori in cui la maggior parte degli elementi è zero, con solo pochi valori non nulli. A differenza dei vettori densi (in cui la maggior parte o tutte le dimensioni contengono valori significativi), i vettori sparsi rappresentano in modo efficiente dati con molte dimensioni ma poche caratteristiche attive. Questa rappresentazione è particolarmente comune nell'elaborazione dei testi, dove un documento può utilizzare solo un piccolo sottoinsieme di tutte le possibili parole di un vocabolario. Gli indici di vettori sparsi eccellono nelle attività di elaborazione del linguaggio naturale, come la ricerca semantica di documenti, le interrogazioni full-text e la modellazione di argomenti. Questi indici sono particolarmente utili per la ricerca aziendale su grandi collezioni di documenti, per la ricerca di documenti legali in cui è necessario individuare in modo efficiente termini e concetti specifici e per le piattaforme di ricerca accademica che indicizzano milioni di documenti con una terminologia specializzata.</p>
<h2 id="Advanced-Query-Capabilities" class="common-anchor-header">Capacità di interrogazione avanzate<button data-href="#Advanced-Query-Capabilities" class="anchor-icon" translate="no">
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
    </button></h2><p>Il cuore dei database vettoriali è la capacità di eseguire ricerche semantiche efficienti. Le capacità di ricerca vettoriale vanno dalla corrispondenza di similarità di base alle tecniche avanzate per migliorare la rilevanza e la diversità.</p>
<h3 id="Basic-ANN-Search" class="common-anchor-header">Ricerca ANN di base</h3><p>La ricerca approssimativa dei vicini (ANN) è il metodo di ricerca fondamentale dei database vettoriali. A differenza della ricerca esatta k-Nearest Neighbors (kNN), che confronta un vettore interrogato con tutti i vettori del database, la ricerca ANN utilizza strutture di indicizzazione per identificare rapidamente un sottoinsieme di vettori probabilmente più simili, migliorando notevolmente le prestazioni.</p>
<p>I componenti chiave della ricerca ANN includono:</p>
<ul>
<li><p><strong>Vettori di interrogazione</strong>: La rappresentazione vettoriale di ciò che si sta cercando.</p></li>
<li><p><strong>Strutture indice</strong>: Strutture di dati precostituite che organizzano i vettori per un recupero efficiente.</p></li>
<li><p><strong>Tipi di metriche</strong>: Funzioni matematiche come Euclidea (L2), Coseno o Prodotto interno che misurano la somiglianza tra vettori.</p></li>
<li><p><strong>Risultati Top-K</strong>: Il numero specificato di vettori più simili da restituire</p></li>
</ul>
<p>I database vettoriali offrono ottimizzazioni per migliorare l'efficienza della ricerca:</p>
<ul>
<li><p><strong>Ricerca vettoriale massiva</strong>: Ricerca con più vettori di query in parallelo.</p></li>
<li><p><strong>Ricerca partizionata</strong>: Limitazione della ricerca a specifiche partizioni di dati</p></li>
<li><p><strong>Paginazione</strong>: Utilizzo dei parametri di limite e di offset per il recupero di grandi insiemi di risultati</p></li>
<li><p><strong>Selezione del campo di output</strong>: Controllo di quali campi di entità vengono restituiti con i risultati</p></li>
</ul>
<h3 id="Advanced-Search-Techniques" class="common-anchor-header">Tecniche di ricerca avanzate</h3><h4 id="Range-Search" class="common-anchor-header">Ricerca per intervallo</h4><p>La ricerca per intervallo migliora la rilevanza dei risultati limitando i risultati ai vettori con punteggi di somiglianza che rientrano in un intervallo specifico. A differenza della ricerca RNA standard, che restituisce i primi K vettori più simili, la ricerca per intervallo definisce una "regione anulare" utilizzando:</p>
<ul>
<li><p>un confine esterno (raggio) che fissa la distanza massima consentita</p></li>
<li><p>Un confine interno (range_filter) che può escludere i vettori troppo simili.</p></li>
</ul>
<p>Questo approccio è particolarmente utile quando si vogliono trovare elementi "simili ma non identici", come ad esempio raccomandazioni di prodotti correlati ma non duplicati esatti di quelli già visti da un utente.</p>
<h4 id="Filtered-Search" class="common-anchor-header">Ricerca filtrata</h4><p>La ricerca filtrata combina la somiglianza dei vettori con i vincoli dei metadati per restringere i risultati ai vettori che corrispondono a criteri specifici. Ad esempio, in un catalogo di prodotti, è possibile trovare articoli visivamente simili ma limitare i risultati a una marca o a una fascia di prezzo specifica.</p>
<p>I database vettoriali altamente scalabili supportano due approcci di filtraggio:</p>
<ul>
<li><p><strong>Filtraggio standard</strong>: Applica i filtri dei metadati prima della ricerca dei vettori, riducendo in modo significativo il pool di candidati.</p></li>
<li><p><strong>Filtraggio iterativo</strong>: Esegue prima la ricerca vettoriale, quindi applica i filtri a ciascun risultato fino a raggiungere il numero desiderato di corrispondenze.</p></li>
</ul>
<h4 id="Text-Match" class="common-anchor-header">Corrispondenza testuale</h4><p>La corrispondenza testuale consente di recuperare documenti precisi in base a termini specifici, integrando la ricerca vettoriale di similarità con funzionalità di corrispondenza testuale esatta. A differenza della ricerca semantica, che trova contenuti concettualmente simili, la corrispondenza testuale si concentra sulla ricerca delle occorrenze esatte dei termini della query.</p>
<p>Ad esempio, una ricerca di prodotti può combinare la corrispondenza testuale per trovare i prodotti che menzionano esplicitamente "impermeabile" con la similarità vettoriale per trovare prodotti visivamente simili, assicurando che siano soddisfatti sia la rilevanza semantica che i requisiti specifici delle caratteristiche.</p>
<h4 id="Grouping-Search" class="common-anchor-header">Ricerca per raggruppamento</h4><p>La ricerca per gruppi aggrega i risultati in base a un campo specifico per migliorare la diversità dei risultati. Ad esempio, in una raccolta di documenti in cui ogni paragrafo è un vettore separato, il raggruppamento garantisce che i risultati provengano da documenti diversi piuttosto che da più paragrafi dello stesso documento.</p>
<p>Questa tecnica è utile per:</p>
<ul>
<li><p>sistemi di reperimento di documenti in cui si desidera una rappresentazione da fonti diverse</p></li>
<li><p>Sistemi di raccomandazione che devono presentare diverse opzioni</p></li>
<li><p>Sistemi di ricerca in cui la diversità dei risultati è importante quanto la somiglianza.</p></li>
</ul>
<h4 id="Hybrid-Search" class="common-anchor-header">Ricerca ibrida</h4><p>La ricerca ibrida combina i risultati di più campi vettoriali, ciascuno dei quali rappresenta potenzialmente aspetti diversi dei dati o utilizza modelli di incorporazione diversi. Questo permette di:</p>
<ul>
<li><p><strong>Combinazioni di vettori sparsi e densi</strong>: Combinare la comprensione semantica (vettori densi) con la corrispondenza delle parole chiave (vettori radi) per una ricerca testuale più completa.</p></li>
<li><p><strong>Ricerca multimodale</strong>: Trovare corrispondenze tra diversi tipi di dati, come ad esempio la ricerca di prodotti utilizzando input sia di immagine che di testo.</p></li>
</ul>
<p>Le implementazioni della ricerca ibrida utilizzano sofisticate strategie di reranking per combinare i risultati:</p>
<ul>
<li><p><strong>Classifica ponderata</strong>: Privilegia i risultati provenienti da campi vettoriali specifici</p></li>
<li><p><strong>Fusione di rango reciproco</strong>: Bilancia i risultati tra tutti i campi vettoriali senza enfasi specifica.</p></li>
</ul>
<h4 id="Full-Text-Search" class="common-anchor-header">Ricerca full-text</h4><p>Le funzionalità di ricerca full-text dei moderni database vettoriali colmano il divario tra la ricerca testuale tradizionale e la similarità vettoriale. Questi sistemi:</p>
<ul>
<li><p>convertono automaticamente le query di testo grezzo in incorporazioni sparse</p></li>
<li><p>Recuperano i documenti contenenti termini o frasi specifiche</p></li>
<li><p>classificano i risultati in base alla rilevanza dei termini e alla somiglianza semantica</p></li>
<li><p>Completano la ricerca vettoriale individuando le corrispondenze esatte che la ricerca semantica potrebbe tralasciare.</p></li>
</ul>
<p>Questo approccio ibrido è particolarmente utile per i sistemi di <a href="https://zilliz.com/learn/what-is-information-retrieval">recupero di informazioni</a> complete che necessitano sia di una precisa corrispondenza dei termini che di una comprensione semantica.</p>
<h2 id="Performance-Engineering-Metrics-That-Matter" class="common-anchor-header">Ingegneria delle prestazioni: Le metriche che contano<button data-href="#Performance-Engineering-Metrics-That-Matter" class="anchor-icon" translate="no">
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
    </button></h2><p>L'ottimizzazione delle prestazioni nei database vettoriali richiede la comprensione delle metriche chiave e dei loro compromessi.</p>
<h3 id="The-Recall-Throughput-Tradeoff" class="common-anchor-header">Il compromesso tra richiamo e throughput</h3><p>Il richiamo misura la percentuale di veri vicini trovati tra i risultati restituiti. Un richiamo più elevato richiede una ricerca più approfondita, riducendo il throughput (query al secondo). I sistemi di produzione bilanciano queste metriche in base ai requisiti dell'applicazione, puntando in genere a un richiamo dell'80-99% a seconda del caso d'uso.</p>
<p>Per valutare le prestazioni dei database vettoriali, gli ambienti di benchmarking standardizzati come ANN-Benchmarks forniscono dati comparativi preziosi. Questi strumenti misurano metriche critiche, tra cui:</p>
<ul>
<li><p>Richiamo della ricerca: La percentuale di query per le quali vengono trovati i veri vicini tra i risultati restituiti.</p></li>
<li><p>Query al secondo (QPS): La velocità con cui il database elabora le query in condizioni standardizzate.</p></li>
<li><p>Prestazioni su dataset di dimensioni e dimensioni diverse</p></li>
</ul>
<p>Un'alternativa è un sistema di benchmark open source chiamato <a href="https://zilliz.com/vector-database-benchmark-tool?database=ZillizCloud%2CMilvus%2CElasticCloud%2CPgVector%2CPinecone%2CQdrantCloud%2CWeaviateCloud&amp;dataset=medium&amp;filter=none%2Clow%2Chigh&amp;tab=1">VDB Bench</a>. VectorDBBench è uno <a href="https://github.com/zilliztech/VectorDBBench">strumento di benchmarking open source</a> progettato per valutare e confrontare le prestazioni dei principali database vettoriali, come Milvus e Zilliz Cloud, utilizzando i loro set di dati. Inoltre, aiuta gli sviluppatori a scegliere il database vettoriale più adatto ai loro casi d'uso.</p>
<p>Questi benchmark consentono alle aziende di identificare l'implementazione del database vettoriale più adatta alle loro esigenze specifiche, considerando l'equilibrio tra precisione, velocità e scalabilità.</p>
<h3 id="Memory-Management" class="common-anchor-header">Gestione della memoria</h3><p>Una gestione efficiente della memoria consente ai database vettoriali di scalare fino a miliardi di vettori mantenendo inalterate le prestazioni:</p>
<ul>
<li><p>L'<strong>allocazione dinamica</strong> regola l'uso della memoria in base alle caratteristiche del carico di lavoro.</p></li>
<li><p><strong>Le politiche di caching</strong> conservano in memoria i vettori a cui si accede di frequente.</p></li>
<li><p><strong>Le tecniche di compressione vettoriale</strong> riducono significativamente i requisiti di memoria</p></li>
</ul>
<p>Per i set di dati che superano la capacità di memoria, le soluzioni basate su disco offrono una capacità fondamentale. Questi algoritmi ottimizzano i modelli di I/O per le unità SSD NVMe attraverso tecniche come la ricerca a raggiera e la navigazione a grafo.</p>
<h3 id="Advanced-Filtering-and-Hybrid-Search" class="common-anchor-header">Filtraggio avanzato e ricerca ibrida</h3><p>I database vettoriali combinano la similarità semantica con il filtraggio tradizionale per creare potenti funzionalità di interrogazione:</p>
<ul>
<li><p>Il<strong>pre-filtraggio</strong> applica i vincoli dei metadati prima della ricerca vettoriale, riducendo il set di candidati per il confronto di similarità.</p></li>
<li><p>Il<strong>post-filtraggio</strong> esegue prima la ricerca vettoriale e poi applica i filtri ai risultati.</p></li>
<li><p>L'<strong>indicizzazione dei metadati</strong> migliora le prestazioni del filtraggio attraverso indici specializzati per diversi tipi di dati.</p></li>
</ul>
<p>I database vettoriali performanti supportano modelli di query complessi che combinano più campi vettoriali con vincoli scalari. Le query multivettoriali trovano entità simili a più punti di riferimento contemporaneamente, mentre le query vettoriali negative escludono i vettori simili a esempi specificati.</p>
<h2 id="Scaling-Vector-Databases-in-Production" class="common-anchor-header">Scalare i database vettoriali in produzione<button data-href="#Scaling-Vector-Databases-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>I database vettoriali richiedono strategie di distribuzione ponderate per garantire prestazioni ottimali a diverse scale:</p>
<ul>
<li><p><strong>Le distribuzioni su piccola scala</strong> (milioni di vettori) possono funzionare efficacemente su una singola macchina con memoria sufficiente.</p></li>
<li><p><strong>Le distribuzioni su media scala</strong> (da decine a centinaia di milioni) traggono vantaggio dallo scaling verticale con istanze ad alta memoria e storage SSD.</p></li>
<li><p><strong>Le distribuzioni su scala miliardaria</strong> richiedono uno scaling orizzontale su più nodi con ruoli specializzati.</p></li>
</ul>
<p>Lo sharding e la replica sono alla base dell'architettura dei database vettoriali scalabili:</p>
<ul>
<li><p>Lo<strong>sharding orizzontale</strong> divide le collezioni su più nodi.</p></li>
<li><p>La<strong>replica</strong> crea copie ridondanti dei dati, migliorando la tolleranza agli errori e il throughput delle query.</p></li>
</ul>
<p>I sistemi moderni regolano dinamicamente i fattori di replica in base ai modelli di query e ai requisiti di affidabilità.</p>
<h2 id="Real-World-Impact" class="common-anchor-header">Impatto sul mondo reale<button data-href="#Real-World-Impact" class="anchor-icon" translate="no">
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
    </button></h2><p>La flessibilità dei database vettoriali ad alte prestazioni è evidente nelle loro opzioni di implementazione. I sistemi possono essere eseguiti in uno spettro di ambienti, da installazioni leggere su computer portatili per la prototipazione a cluster massicci distribuiti che gestiscono decine di miliardi di vettori. Questa scalabilità ha permesso alle organizzazioni di passare dall'ideazione alla produzione senza cambiare tecnologia di database.</p>
<p>Aziende come Salesforce, PayPal, eBay, NVIDIA, IBM e Airbnb si affidano ora a database vettoriali come l'open source <a href="https://milvus.io/">Milvus</a> per alimentare applicazioni AI su larga scala. Queste implementazioni abbracciano diversi casi d'uso, dai sofisticati sistemi di raccomandazione dei prodotti alla moderazione dei contenuti, al rilevamento delle frodi e all'automazione dell'assistenza clienti, tutti costruiti sulla base della ricerca vettoriale.</p>
<p>Negli ultimi anni, i database vettoriali sono diventati fondamentali per risolvere i problemi di allucinazione comuni nei LLM, fornendo dati specifici per il dominio, aggiornati o riservati. Ad esempio, <a href="https://zilliz.com/cloud">Zilliz Cloud</a> memorizza dati specializzati come embeddings vettoriali. Quando un utente pone una domanda, trasforma la richiesta in vettori, esegue ricerche ANN per i risultati più rilevanti e li combina con la domanda originale per creare un contesto completo per i modelli linguistici di grandi dimensioni. Questo framework serve come base per lo sviluppo di applicazioni affidabili alimentate da LLM che producono risposte più accurate e contestualmente rilevanti.</p>
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
    </button></h2><p>L'ascesa dei database vettoriali rappresenta molto di più di una nuova tecnologia: significa un cambiamento fondamentale nell'approccio alla gestione dei dati per le applicazioni di intelligenza artificiale. Colmando il divario tra i dati non strutturati e i sistemi computazionali, i database vettoriali sono diventati una componente essenziale della moderna infrastruttura di IA, consentendo alle applicazioni di comprendere ed elaborare le informazioni con modalità sempre più simili a quelle umane.</p>
<p>I principali vantaggi dei database vettoriali rispetto ai sistemi di database tradizionali includono:</p>
<ul>
<li><p>Ricerca ad alta dimensione: Ricerche di similarità efficienti su vettori ad alta densità utilizzati nelle applicazioni di apprendimento automatico e di IA generativa.</p></li>
<li><p>Scalabilità: scalabilità orizzontale per l'archiviazione e il recupero efficiente di grandi collezioni vettoriali.</p></li>
<li><p>Flessibilità con la ricerca ibrida: Gestione di vari tipi di dati vettoriali, compresi vettori radi e densi</p></li>
<li><p>Prestazioni: Ricerche di similarità vettoriale significativamente più veloci rispetto ai database tradizionali</p></li>
<li><p>Indicizzazione personalizzabile: Supporto per schemi di indicizzazione personalizzati ottimizzati per casi d'uso e tipi di dati specifici.</p></li>
</ul>
<p>Man mano che le applicazioni di intelligenza artificiale diventano sempre più sofisticate, le esigenze dei database vettoriali continuano ad evolversi. I sistemi moderni devono trovare un equilibrio tra prestazioni, accuratezza, scalabilità ed economicità, integrandosi al tempo stesso con il più ampio ecosistema dell'IA. Per le organizzazioni che vogliono implementare l'IA su scala, la comprensione della tecnologia dei database vettoriali non è solo una considerazione tecnica, ma un imperativo strategico.</p>
