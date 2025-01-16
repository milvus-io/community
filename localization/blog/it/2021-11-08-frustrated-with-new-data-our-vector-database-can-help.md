---
id: 2021-11-08-frustrated-with-new-data-our-vector-database-can-help.md
title: Introduzione
author: Zilliz
date: 2021-11-08T00:00:00.000Z
desc: >-
  Progettazione e pratica di sistemi di database vettoriali di uso generale
  orientati all'IA
cover: assets.zilliz.com/Frustrated_with_new_data_5051d3ad15.png
tag: Engineering
---
<custom-h1>Frustrati dai nuovi dati? Il nostro database vettoriale può aiutarvi</custom-h1><p>Nell'era dei Big Data, quali tecnologie e applicazioni di database saliranno alla ribalta? Quale sarà il prossimo cambiamento?</p>
<p>Con i dati non strutturati che rappresentano circa l'80-90% di tutti i dati archiviati, cosa dovremmo fare con questi laghi di dati in crescita? Si potrebbe pensare di utilizzare i metodi analitici tradizionali, ma questi non riescono a ricavare informazioni utili, se non addirittura informazioni. Per rispondere a questa domanda, i "tre moschettieri" del team di ricerca e sviluppo di Zilliz, il dottor Rentong Guo, il signor Xiaofan Luan e il dottor Xiaomeng Yi, hanno collaborato alla stesura di un articolo che illustra la progettazione e le sfide affrontate nella costruzione di un sistema di database vettoriale di uso generale.</p>
<p>L'articolo è stato pubblicato su Programmer, una rivista prodotta da CSDN, la più grande comunità di sviluppatori di software in Cina. Questo numero di Programmer include anche articoli di Jeffrey Ullman, vincitore del Turing Award 2020, Yann LeCun, vincitore del Turing Award 2018, Mark Porter, CTO di MongoDB, Zhenkun Yang, fondatore di OceanBase, Dongxu Huang, fondatore di PingCAP, ecc.</p>
<p>Di seguito condividiamo con voi l'articolo completo:</p>
<custom-h1>Design and Practice of AI-oriented General-purpose Vector Database Systems (Progettazione e pratica di sistemi di database vettoriali orientati all'intelligenza artificiale)</custom-h1><h2 id="Introduction" class="common-anchor-header">Introduzione<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Le moderne applicazioni di dati possono facilmente gestire i dati strutturati, che rappresentano circa il 20% dei dati odierni. Nella sua cassetta degli attrezzi ci sono sistemi come i database relazionali, i database NoSQL e così via; al contrario, i dati non strutturati, che rappresentano circa l'80% di tutti i dati, non dispongono di sistemi affidabili. Per risolvere questo problema, questo articolo discuterà i punti dolenti che la tradizionale analisi dei dati ha con i dati non strutturati e discuterà ulteriormente l'architettura e le sfide che abbiamo affrontato per costruire il nostro sistema di database vettoriale di uso generale.</p>
<h2 id="Data-Revolution-in-the-AI-era" class="common-anchor-header">La rivoluzione dei dati nell'era dell'intelligenza artificiale<button data-href="#Data-Revolution-in-the-AI-era" class="anchor-icon" translate="no">
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
    </button></h2><p>Con il rapido sviluppo delle tecnologie 5G e IoT, le industrie stanno cercando di moltiplicare i canali di raccolta dei dati e di proiettare ulteriormente il mondo reale nello spazio digitale. Sebbene ciò abbia comportato alcune sfide enormi, ha anche portato con sé enormi vantaggi per l'industria in crescita. Una di queste sfide difficili è come ottenere approfondimenti su questi nuovi dati in arrivo.</p>
<p>Secondo le statistiche di IDC, solo nel 2020 verranno generati oltre 40.000 exabyte di nuovi dati in tutto il mondo. Del totale, solo il 20% è costituito da dati strutturati, ovvero dati altamente ordinati e facili da organizzare e analizzare tramite calcoli numerici e algebra relazionale. Al contrario, i dati non strutturati (che costituiscono il restante 80%) sono estremamente ricchi di variazioni di tipo di dati, il che rende difficile scoprire la semantica profonda attraverso i metodi tradizionali di analisi dei dati.</p>
<p>Fortunatamente, stiamo assistendo a una rapida evoluzione dei dati non strutturati e dell'intelligenza artificiale, che ci permette di comprendere meglio i dati attraverso vari tipi di reti neurali, come illustrato nella Figura 1.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata1_d5c34497d0.jpeg" alt="newdata1.jpeg" class="doc-image" id="newdata1.jpeg" />
   </span> <span class="img-wrapper"> <span>newdata1.jpeg</span> </span></p>
<p>La tecnologia di incorporazione ha rapidamente guadagnato popolarità dopo il debutto di Word2vec, con l'idea di "incorporare tutto" che ha raggiunto tutti i settori dell'apprendimento automatico. Questo porta all'emergere di due principali livelli di dati: il livello dei dati grezzi e il livello dei dati vettoriali. Il livello dei dati grezzi è composto da dati non strutturati e da alcuni tipi di dati strutturati; il livello vettoriale è la raccolta di incorporazioni facilmente analizzabili che provengono dal livello grezzo e passano attraverso i modelli di apprendimento automatico.</p>
<p>Rispetto ai dati grezzi, i dati vettoriali presentano i seguenti vantaggi:</p>
<ul>
<li>I vettori di embedding sono un tipo astratto di dati, il che significa che possiamo costruire un sistema algebrico unificato dedicato alla riduzione della complessità dei dati non strutturati.</li>
<li>I vettori di incorporamento sono espressi attraverso vettori densi in virgola mobile, consentendo alle applicazioni di sfruttare la SIMD. Poiché la SIMD è supportata dalle GPU e da quasi tutte le CPU moderne, le computazioni attraverso i vettori possono raggiungere prestazioni elevate a un costo relativamente basso.</li>
<li>I dati vettoriali codificati tramite modelli di apprendimento automatico occupano meno spazio di archiviazione rispetto ai dati non strutturati originali, consentendo un throughput più elevato.</li>
<li>Anche l'aritmetica può essere eseguita attraverso i vettori incorporati. La Figura 2 mostra un esempio di corrispondenza semantica approssimativa cross-modale: le immagini mostrate nella figura sono il risultato della corrispondenza tra embedding di parole e embedding di immagini.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata2_14e0554305.png" alt="newdata2.png" class="doc-image" id="newdata2.png" />
   </span> <span class="img-wrapper"> <span>newdata2.png</span> </span></p>
<p>Come mostrato nella Figura 3, la combinazione della semantica delle immagini e delle parole può essere effettuata con una semplice addizione e sottrazione vettoriale tra le rispettive incorporazioni.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata3_3c71fc56b9.png" alt="newdata3.png" class="doc-image" id="newdata3.png" />
   </span> <span class="img-wrapper"> <span>newdata3.png</span> </span></p>
<p>Oltre a queste caratteristiche, questi operatori supportano query più complesse in scenari pratici. La raccomandazione di contenuti è un esempio ben noto. In genere, il sistema incorpora sia i contenuti sia le preferenze di visualizzazione degli utenti. Successivamente, il sistema abbina le preferenze dell'utente incorporato con i contenuti incorporati più simili tramite l'analisi della somiglianza semantica, ottenendo nuovi contenuti simili alle preferenze degli utenti. Questo strato di dati vettoriali non è limitato ai sistemi di raccomandazione, ma i casi d'uso includono l'e-commerce, l'analisi del malware, l'analisi dei dati, la verifica biometrica, l'analisi delle formule chimiche, la finanza, le assicurazioni, ecc.</p>
<h2 id="Unstructured-data-requires-a-complete-basic-software-stack" class="common-anchor-header">I dati non strutturati richiedono uno stack software completo di base<button data-href="#Unstructured-data-requires-a-complete-basic-software-stack" class="anchor-icon" translate="no">
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
    </button></h2><p>Il software di sistema è alla base di tutte le applicazioni orientate ai dati, ma il software di sistema costruito negli ultimi decenni, ad esempio i database, i motori di analisi dei dati e così via, è stato concepito per trattare dati strutturati. Le moderne applicazioni di dati si basano quasi esclusivamente su dati non strutturati e non beneficiano dei tradizionali sistemi di gestione dei database.</p>
<p>Per affrontare questo problema, abbiamo sviluppato e reso open-source un sistema di database vettoriale generale orientato all'intelligenza artificiale, chiamato <em>Milvus</em> (riferimento n. 1~2). Rispetto ai sistemi di database tradizionali, Milvus lavora su un diverso livello di dati. I database tradizionali, come i database relazionali, i database KV, i database di testo, i database di immagini/video, ecc... lavorano sul livello dei dati grezzi, mentre Milvus lavora sul livello dei dati vettoriali.</p>
<p>Nei capitoli seguenti, discuteremo le nuove caratteristiche, il progetto architettonico e le sfide tecniche che abbiamo affrontato durante la costruzione di Milvus.</p>
<h2 id="Major-attributes-of-vector-database" class="common-anchor-header">Attributi principali dei database vettoriali<button data-href="#Major-attributes-of-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>I database vettoriali memorizzano, recuperano e analizzano i vettori e, come qualsiasi altro database, forniscono anche un'interfaccia standard per le operazioni CRUD. Oltre a queste caratteristiche "standard", gli attributi elencati di seguito sono qualità importanti per un database vettoriale:</p>
<ul>
<li><strong>Supporto per operatori vettoriali ad alta efficienza</strong></li>
</ul>
<p>Il supporto per gli operatori vettoriali in un motore di analisi si concentra su due livelli. In primo luogo, il database vettoriale deve supportare diversi tipi di operatori, ad esempio la corrispondenza di similarità semantica e l'aritmetica semantica di cui sopra. Inoltre, deve supportare una varietà di metriche di similarità per i calcoli di similarità sottostanti. La somiglianza è solitamente quantificata come distanza spaziale tra vettori, con metriche comuni come la distanza euclidea, la distanza coseno e la distanza del prodotto interno.</p>
<ul>
<li><strong>Supporto per l'indicizzazione dei vettori</strong></li>
</ul>
<p>Rispetto agli indici basati su B-tree o LSM-tree dei database tradizionali, gli indici vettoriali ad alta dimensionalità consumano solitamente molte più risorse di calcolo. Si consiglia di utilizzare algoritmi di clustering e indici a grafo e di dare priorità alle operazioni matriciali e vettoriali, sfruttando così appieno le capacità di accelerazione hardware del calcolo vettoriale già menzionate.</p>
<ul>
<li><strong>Esperienza utente coerente in diversi ambienti di distribuzione</strong></li>
</ul>
<p>I database vettoriali vengono solitamente sviluppati e distribuiti in ambienti diversi. Nella fase preliminare, gli scienziati dei dati e gli ingegneri degli algoritmi lavorano principalmente sui loro computer portatili e sulle loro stazioni di lavoro, prestando maggiore attenzione all'efficienza della verifica e alla velocità di iterazione. Una volta completata la verifica, possono distribuire il database completo su un cluster privato o sul cloud. Pertanto, un sistema di database vettoriale qualificato deve offrire prestazioni e un'esperienza utente coerenti in diversi ambienti di distribuzione.</p>
<ul>
<li><strong>Supporto per la ricerca ibrida</strong></li>
</ul>
<p>Con la diffusione dei database vettoriali, stanno emergendo nuove applicazioni. Tra tutte queste richieste, la più frequentemente citata è la ricerca ibrida su vettori e altri tipi di dati. Alcuni esempi sono la ricerca approssimata del vicino (ANNS) dopo il filtraggio scalare, il richiamo multicanale dalla ricerca full-text e dalla ricerca vettoriale e la ricerca ibrida di dati spazio-temporali e vettoriali. Queste sfide richiedono una scalabilità elastica e l'ottimizzazione delle query per fondere efficacemente i motori di ricerca vettoriale con KV, testo e altri motori di ricerca.</p>
<ul>
<li><strong>Architettura cloud-nativa</strong></li>
</ul>
<p>Il volume dei dati vettoriali cresce a dismisura con la crescita esponenziale della raccolta dati. I dati vettoriali ad alta dimensionalità su scala trilione corrispondono a migliaia di TB di spazio di archiviazione, il che va ben oltre il limite di un singolo nodo. Di conseguenza, l'estensibilità orizzontale è una capacità fondamentale per un database vettoriale e dovrebbe soddisfare le richieste di elasticità e agilità di implementazione degli utenti. Inoltre, dovrebbe anche ridurre la complessità del funzionamento e della manutenzione del sistema, migliorando al contempo l'osservabilità con l'aiuto dell'infrastruttura cloud. Alcune di queste esigenze si presentano sotto forma di isolamento multi-tenant, snapshot e backup dei dati, crittografia dei dati e visualizzazione dei dati, che sono comuni nei database tradizionali.</p>
<h2 id="Vector-database-system-architecture" class="common-anchor-header">Architettura del sistema di database vettoriale<button data-href="#Vector-database-system-architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.0 segue i principi di progettazione &quot;log as data&quot;, &quot;unified batch and stream processing&quot;, &quot;stateless&quot; e &quot;micro-services&quot;. La Figura 4 illustra l'architettura complessiva di Milvus 2.0.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata4_b7f3ab6969.png" alt="newdata4.png" class="doc-image" id="newdata4.png" />
   </span> <span class="img-wrapper"> <span>newdata4.png</span> </span></p>
<p><strong>Log come dati</strong>: Milvus 2.0 non mantiene tabelle fisiche. Al contrario, garantisce l'affidabilità dei dati attraverso la persistenza dei log e le istantanee dei log. Il log broker (la spina dorsale del sistema) archivia i log e disaccoppia componenti e servizi attraverso il meccanismo di pubblicazione-sottoscrizione dei log (pub-sub). Come mostrato nella Figura 5, il log broker è composto da &quot;log sequence&quot; e &quot;log subscriber&quot;. Il log sequence registra tutte le operazioni che modificano lo stato di una collezione (equivalente a una tabella in un database relazionale); il log subscriber si abbona al log sequence per aggiornare i propri dati locali e fornire servizi sotto forma di copie in sola lettura. Il meccanismo pub-sub lascia spazio anche all'estendibilità del sistema in termini di acquisizione dei dati di modifica (CDC) e di distribuzione distribuita a livello globale.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/newdata5_853dd38bc3.png" alt="newdata5.png" class="doc-image" id="newdata5.png" />
   </span> <span class="img-wrapper"> <span>newdata5.png</span> </span></p>
<p><strong>Elaborazione batch e stream unificata</strong>: Lo streaming dei log consente a Milvus di aggiornare i dati in tempo reale, garantendo così la deliverability in tempo reale. Inoltre, trasformando i batch di dati in snapshot di log e costruendo indici sugli snapshot, Milvus è in grado di ottenere una maggiore efficienza delle query. Durante un'interrogazione, Milvus fonde i risultati della query sia dai dati incrementali che da quelli storici per garantire l'integrità dei dati restituiti. Questo design bilancia meglio le prestazioni in tempo reale e l'efficienza, alleggerendo il carico di manutenzione dei sistemi online e offline rispetto all'architettura Lambda tradizionale.</p>
<p><strong>Senza stato</strong>: L'infrastruttura cloud e i componenti di storage open-source liberano Milvus dalla persistenza dei dati all'interno dei suoi stessi componenti. Milvus 2.0 conserva i dati con tre tipi di storage: storage dei metadati, storage dei log e storage degli oggetti. L'archiviazione dei metadati non solo memorizza i metadati, ma gestisce anche la scoperta dei servizi e la gestione dei nodi. Lo storage dei log esegue la persistenza incrementale dei dati e la pubblicazione-sottoscrizione dei dati. Lo storage a oggetti memorizza le istantanee dei log, gli indici e alcuni risultati di calcolo intermedi.</p>
<p><strong>Microservizi</strong>: Milvus segue i principi della disaggregazione del piano dati e del piano di controllo, della separazione lettura/scrittura e della separazione dei compiti online/offline. È composto da quattro livelli di servizio: il livello di accesso, il livello del coordinatore, il livello del lavoratore e il livello di archiviazione. Questi livelli sono indipendenti l'uno dall'altro per quanto riguarda lo scaling e il disaster recovery. Il livello di accesso, che è il livello frontale e l'endpoint dell'utente, gestisce le connessioni dei clienti, convalida le richieste dei clienti e combina i risultati delle query. Come &quot;cervello&quot; del sistema, il livello coordinatore si occupa della gestione della topologia del cluster, del bilanciamento del carico, della dichiarazione dei dati e della gestione dei dati. Il livello worker contiene gli "arti" del sistema, eseguendo gli aggiornamenti dei dati, le query e le operazioni di creazione degli indici. Infine, il livello di storage è responsabile della persistenza e della replica dei dati. Nel complesso, questo design basato su microservizi assicura una complessità del sistema controllabile, con ogni componente responsabile della sua funzione corrispondente. Milvus chiarisce i confini dei servizi attraverso interfacce ben definite e disaccoppia i servizi in base a una granularità più fine, ottimizzando ulteriormente la scalabilità elastica e la distribuzione delle risorse.</p>
<h2 id="Technical-challenges-faced-by-vector-databases" class="common-anchor-header">Le sfide tecniche dei database vettoriali<button data-href="#Technical-challenges-faced-by-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Le prime ricerche sui database vettoriali si sono concentrate principalmente sulla progettazione di strutture di indici e di metodi di interrogazione ad alta efficienza, dando vita a una serie di librerie di algoritmi di ricerca vettoriale (riferimento n. 3~5). Negli ultimi anni, un numero sempre maggiore di team accademici e di ingegneri ha affrontato i problemi della ricerca vettoriale dal punto di vista della progettazione del sistema e ha proposto alcune soluzioni sistematiche. Riassumendo gli studi esistenti e le richieste degli utenti, abbiamo classificato le principali sfide tecniche per i database vettoriali come segue:</p>
<ul>
<li><strong>Ottimizzazione del rapporto costo-prestazioni in relazione al carico</strong></li>
</ul>
<p>Rispetto ai tipi di dati tradizionali, l'analisi dei dati vettoriali richiede molte più risorse di archiviazione e di calcolo a causa della loro elevata dimensionalità. Inoltre, gli utenti hanno mostrato preferenze diverse per quanto riguarda le caratteristiche di carico e l'ottimizzazione dei costi e delle prestazioni delle soluzioni di ricerca vettoriale. Ad esempio, gli utenti che lavorano con insiemi di dati estremamente grandi (decine o centinaia di miliardi di vettori) preferirebbero soluzioni con costi di archiviazione dei dati più bassi e una latenza di ricerca variabile, mentre altri potrebbero richiedere prestazioni di ricerca più elevate e una latenza media non variabile. Per soddisfare queste diverse preferenze, la componente principale dell'indice del database vettoriale deve essere in grado di supportare strutture di indice e algoritmi di ricerca con diversi tipi di hardware di archiviazione e di calcolo.</p>
<p>Ad esempio, la memorizzazione dei dati vettoriali e dei corrispondenti dati di indice su supporti di memorizzazione più economici (come NVM e SSD) deve essere presa in considerazione per ridurre i costi di memorizzazione. Tuttavia, la maggior parte degli algoritmi di ricerca vettoriale esistenti lavora su dati letti direttamente dalla memoria. Per evitare la perdita di prestazioni dovuta all'uso delle unità disco, il database vettoriale dovrebbe essere in grado di sfruttare la località dell'accesso ai dati combinata con gli algoritmi di ricerca, oltre a potersi adattare alle soluzioni di archiviazione per i dati vettoriali e la struttura degli indici (riferimento n. 6~8). Per migliorare le prestazioni, la ricerca contemporanea si è concentrata sulle tecnologie di accelerazione hardware che coinvolgono GPU, NPU, FPGA e così via (riferimento n. 9). Tuttavia, l'hardware e i chip specifici per l'accelerazione variano nella progettazione dell'architettura e il problema dell'esecuzione più efficiente tra i diversi acceleratori hardware non è ancora stato risolto.</p>
<ul>
<li><strong>Configurazione e messa a punto automatica del sistema</strong></li>
</ul>
<p>La maggior parte degli studi esistenti sugli algoritmi di ricerca vettoriale cerca un equilibrio flessibile tra i costi di memorizzazione, le prestazioni di calcolo e l'accuratezza della ricerca. In generale, sia i parametri dell'algoritmo sia le caratteristiche dei dati influenzano le prestazioni effettive di un algoritmo. Poiché le richieste degli utenti differiscono in termini di costi e prestazioni, la scelta di un metodo di interrogazione vettoriale che si adatti alle loro esigenze e alle caratteristiche dei dati rappresenta una sfida significativa.</p>
<p>Tuttavia, i metodi manuali per analizzare gli effetti della distribuzione dei dati sugli algoritmi di ricerca non sono efficaci a causa dell'elevata dimensionalità dei dati vettoriali. Per risolvere questo problema, il mondo accademico e l'industria stanno cercando soluzioni di raccomandazione degli algoritmi basate sull'apprendimento automatico (riferimento n. 10).</p>
<p>Anche la progettazione di un algoritmo di ricerca vettoriale intelligente alimentato da ML è un punto caldo della ricerca. In generale, gli algoritmi di ricerca vettoriale esistenti sono stati sviluppati universalmente per dati vettoriali con vari modelli di dimensionalità e distribuzione. Di conseguenza, non supportano strutture di indici specifiche in base alle caratteristiche dei dati e hanno quindi poco spazio per l'ottimizzazione. Gli studi futuri dovrebbero anche esplorare tecnologie efficaci di apprendimento automatico in grado di adattare le strutture degli indici alle diverse caratteristiche dei dati (riferimento n. 11-12).</p>
<ul>
<li><strong>Supporto per la semantica avanzata delle query</strong></li>
</ul>
<p>Le applicazioni moderne si basano spesso su query più avanzate tra i vettori: le tradizionali semantiche di ricerca nearest neighbour non sono più applicabili alla ricerca di dati vettoriali. Inoltre, sta emergendo la richiesta di ricerche combinate su più database vettoriali o su dati vettoriali e non vettoriali (riferimento n. 13).</p>
<p>In particolare, le variazioni nelle metriche di distanza per la similarità vettoriale sono in rapida crescita. I punteggi di somiglianza tradizionali, come la distanza euclidea, la distanza del prodotto interno e la distanza del coseno, non possono soddisfare tutte le esigenze applicative. Con la diffusione della tecnologia dell'intelligenza artificiale, molte industrie stanno sviluppando le proprie metriche di similarità vettoriale specifiche per il settore, come la distanza di Tanimoto, la distanza di Mahalanobis, la sovrastruttura e la sottostruttura. L'integrazione di queste metriche di valutazione negli algoritmi di ricerca esistenti e la progettazione di nuovi algoritmi che utilizzano tali metriche sono entrambi problemi di ricerca impegnativi.</p>
<p>Con l'aumento della complessità dei servizi agli utenti, le applicazioni dovranno effettuare ricerche sia su dati vettoriali che su dati non vettoriali. Ad esempio, un content recommender analizza le preferenze degli utenti, le relazioni sociali e le abbina ai temi caldi del momento per proporre agli utenti i contenuti adeguati. Tali ricerche comportano normalmente interrogazioni su più tipi di dati o su più sistemi di elaborazione dei dati. Supportare queste ricerche ibride in modo efficiente e flessibile è un'altra sfida per la progettazione del sistema.</p>
<h2 id="Authors" class="common-anchor-header">Gli autori<button data-href="#Authors" class="anchor-icon" translate="no">
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
    </button></h2><p>Rentong Guo (Ph.D. in Computer Software and Theory, Huazhong University of Science and Technology), socio e direttore della ricerca e sviluppo di Zilliz. È membro del China Computer Federation Technical Committee on Distributed Computing and Processing (CCF TCDCP). La sua ricerca si concentra su database, sistemi distribuiti, sistemi di caching e informatica eterogenea. I suoi lavori di ricerca sono stati pubblicati in diverse conferenze e riviste di alto livello, tra cui Usenix ATC, ICS, DATE, TPDS. In qualità di architetto di Milvus, il Dr. Guo è alla ricerca di soluzioni per sviluppare sistemi di analisi dei dati basati sull'intelligenza artificiale altamente scalabili ed efficienti dal punto di vista dei costi.</p>
<p>Xiaofan Luan, partner e direttore tecnico di Zilliz e membro del comitato consultivo tecnico della LF AI &amp; Data Foundation. Ha lavorato successivamente nella sede centrale di Oracle US e in Hedvig, una startup di software defined storage. È entrato a far parte del team di Alibaba Cloud Database e si è occupato dello sviluppo dei database NoSQL HBase e Lindorm. Luan ha conseguito un master in Ingegneria elettronica informatica presso la Cornell University.</p>
<p>Dr. Xiaomeng Yi (dottorato di ricerca in architettura informatica, Huazhong University of Science and Technology), ricercatore senior e responsabile del team di ricerca di Zilliz. La sua ricerca si concentra sulla gestione dei dati ad alta dimensione, sul reperimento di informazioni su larga scala e sull'allocazione delle risorse nei sistemi distribuiti. I lavori di ricerca del Dr. Yi sono stati pubblicati su importanti riviste e conferenze internazionali, tra cui IEEE Network Magazine, IEEE/ACM TON, ACM SIGMOD, IEEE ICDCS e ACM TOMPECS.</p>
<p>Filip Haltmayer, Data Engineer di Zilliz, si è laureato in Informatica presso la University of California, Santa Cruz. Dopo essere entrato a far parte di Zilliz, Filip trascorre la maggior parte del suo tempo lavorando su implementazioni cloud, interazioni con i clienti, conferenze tecniche e sviluppo di applicazioni AI.</p>
<h2 id="References" class="common-anchor-header">Riferimenti<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li>Progetto Milvus: https://github.com/milvus-io/milvus</li>
<li>Milvus: A Purpose-Built Vector Data Management System, SIGMOD'21</li>
<li>Progetto Faiss: https://github.com/facebookresearch/faiss</li>
<li>Progetto Annoy: https://github.com/spotify/annoy</li>
<li>Progetto SPTAG: https://github.com/microsoft/SPTAG</li>
<li>GRIP: Multi-Store Capacity-Optimized High-Performance Nearest Neighbor Search for Vector Search Engine, CIKM'19</li>
<li>DiskANN: Fast Accurate Billion-point Nearest Neighbor Search on a Single Node, NIPS'19</li>
<li>HM-ANN: ricerca efficiente dei vicini di casa in miliardi di punti su memoria eterogenea, NIPS'20</li>
<li>SONG: ricerca approssimativa dei vicini su GPU, ICDE'20</li>
<li>Una dimostrazione del servizio di messa a punto automatica del sistema di gestione di database ottertune, VLDB'18</li>
<li>Il caso delle strutture di indice apprese, SIGMOD'18</li>
<li>Miglioramento della ricerca approssimativa dei vicini attraverso la terminazione anticipata adattiva appresa, SIGMOD'20</li>
<li>AnalyticDB-V: A Hybrid Analytical Engine Towards Query Fusion for Structured and Unstructured Data, VLDB'20</li>
</ol>
<h2 id="Engage-with-our-open-source-community" class="common-anchor-header">Impegnatevi con la nostra comunità open-source:<button data-href="#Engage-with-our-open-source-community" class="anchor-icon" translate="no">
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
<li>Trovate o contribuite a Milvus su <a href="https://bit.ly/3khejQB">GitHub</a>.</li>
<li>Interagite con la comunità tramite il <a href="https://bit.ly/307HVsY">Forum</a>.</li>
<li>Connettetevi con noi su <a href="https://bit.ly/3wn5aek">Twitter</a>.</li>
</ul>
