---
id: journey-to-35k-github-stars-story-of-building-milvus-from-scratch.md
title: >-
  Il nostro viaggio verso le oltre 35.000 stelle di GitHub: La vera storia della
  costruzione di Milvus da zero
author: Zilliz
date: 2025-06-27T00:00:00.000Z
cover: assets.zilliz.com/Github_star_30_K_2_f329467096.png
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, vector database, vector search, AI search, Zilliz Cloud'
meta_title: |
  Our Journey to 35K+ GitHub Stars: Building Milvus from Scratch
desc: >-
  Unitevi a noi per celebrare Milvus, il database vettoriale che ha raggiunto le
  35,5K stelle su GitHub. Scoprite la nostra storia e come stiamo semplificando
  le soluzioni di intelligenza artificiale per gli sviluppatori.
origin: >-
  https://milvus.io/blog/journey-to-35k-github-stars-story-of-building-milvus-from-scratch.md
---
<p>Negli ultimi anni ci siamo concentrati su una cosa: costruire un database vettoriale pronto per l'impresa per l'era dell'intelligenza artificiale. La parte difficile non è costruire <em>un</em> database, ma costruirne uno che sia scalabile, facile da usare e che risolva effettivamente problemi reali in produzione.</p>
<p>A giugno abbiamo raggiunto un nuovo traguardo: Milvus ha raggiunto le <a href="https://github.com/milvus-io/milvus">35.000 stelle su GitHub</a> (ora ha più di 35,5K stelle al momento in cui scriviamo). Non faremo finta che si tratti di un numero qualsiasi: per noi significa molto.</p>
<p>Ogni stella rappresenta uno sviluppatore che si è preso il tempo di guardare ciò che abbiamo costruito, lo ha trovato abbastanza utile da metterlo tra i preferiti e, in molti casi, ha deciso di usarlo. Alcuni di voi si sono spinti oltre: hanno segnalato problemi, contribuito al codice, risposto alle domande nei nostri forum e aiutato altri sviluppatori quando si sono bloccati.</p>
<p>Volevamo condividere con voi la nostra storia, quella vera, con tutte le parti più complicate.</p>
<h2 id="We-Started-Building-Milvus-Because-Nothing-Else-Worked" class="common-anchor-header">Abbiamo iniziato a costruire Milvus perché non c'era nient'altro che funzionasse<button data-href="#We-Started-Building-Milvus-Because-Nothing-Else-Worked" class="anchor-icon" translate="no">
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
    </button></h2><p>Nel 2017 siamo partiti da una semplice domanda: Mentre le applicazioni di intelligenza artificiale iniziavano ad emergere e i dati non strutturati stavano esplodendo, come si potevano archiviare e cercare in modo efficiente le incorporazioni vettoriali che alimentano la comprensione semantica?</p>
<p>I database tradizionali non sono stati costruiti per questo. Sono ottimizzati per righe e colonne, non per vettori ad alta dimensionalità. Le tecnologie e gli strumenti esistenti erano impossibili o dolorosamente lenti per le nostre esigenze.</p>
<p>Abbiamo provato tutto ciò che era disponibile. Abbiamo messo insieme soluzioni con Elasticsearch. Abbiamo costruito indici personalizzati su MySQL. Abbiamo persino sperimentato FAISS, ma era stato progettato come biblioteca di ricerca, non come infrastruttura di database di produzione. Nulla forniva la soluzione completa che avevamo immaginato per i carichi di lavoro aziendali di intelligenza artificiale.</p>
<p><strong>Così abbiamo iniziato a costruirne una nostra.</strong> Non perché pensassimo che sarebbe stato facile - i database sono notoriamente difficili da ottenere - ma perché vedevamo dove l'IA stava andando e sapevamo che aveva bisogno di un'infrastruttura costruita ad hoc per arrivarci.</p>
<p>Nel 2018 eravamo già impegnati nello sviluppo di quello che sarebbe diventato <a href="https://milvus.io/">Milvus</a>. Il termine &quot;<strong>database vettoriale</strong>&quot; non esisteva ancora. Stavamo essenzialmente creando una nuova categoria di software infrastrutturale, il che era eccitante e terrificante allo stesso tempo.</p>
<h2 id="Open-Sourcing-Milvus-Building-in-Public" class="common-anchor-header">Open-Sourcing di Milvus: costruire in pubblico<button data-href="#Open-Sourcing-Milvus-Building-in-Public" class="anchor-icon" translate="no">
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
    </button></h2><p>Nel novembre 2019 abbiamo deciso di rendere open-source la versione 0.10 di Milvus.</p>
<p>Open-sourcing significa esporre al mondo tutti i propri difetti. Ogni hack, ogni commento TODO, ogni decisione progettuale di cui non si è del tutto sicuri. Ma eravamo convinti che se i database vettoriali dovevano diventare un'infrastruttura critica per l'intelligenza artificiale, dovevano essere aperti e accessibili a tutti.</p>
<p>La risposta è stata travolgente. Gli sviluppatori non si sono limitati a usare Milvus, ma lo hanno migliorato. Hanno trovato bug che ci erano sfuggiti, suggerito funzionalità che non avevamo considerato e posto domande che ci hanno fatto riflettere sulle nostre scelte progettuali.</p>
<p>Nel 2020 ci siamo uniti alla <a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation</a>. Non si trattava solo di credibilità: ci ha insegnato come mantenere un progetto open-source sostenibile. Come gestire la governance, la retrocompatibilità e costruire un software che duri anni, non mesi.</p>
<p>Nel 2021 abbiamo rilasciato Milvus 1.0 e ci siamo <a href="https://lfaidata.foundation/projects/milvus/">laureati presso la LF AI &amp; Data Foundation</a>. Nello stesso anno abbiamo vinto la <a href="https://big-ann-benchmarks.com/neurips21.html">sfida globale BigANN</a> per la ricerca vettoriale su scala miliardaria. Questa vittoria ci ha fatto sentire bene, ma soprattutto ci ha dato la conferma che stavamo risolvendo problemi reali nel modo giusto.</p>
<h2 id="The-Hardest-Decision-Starting-Over" class="common-anchor-header">La decisione più difficile: Ricominciare da capo<button data-href="#The-Hardest-Decision-Starting-Over" class="anchor-icon" translate="no">
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
    </button></h2><p>È qui che le cose si complicano. Nel 2021, Milvus 1.0 funzionava bene per molti casi d'uso, ma i clienti aziendali continuavano a chiedere le stesse cose: una migliore architettura cloud-native, una scalabilità orizzontale più facile, una maggiore semplicità operativa.</p>
<p>Avevamo una scelta: fare una patch per andare avanti o ricostruire da zero. Abbiamo scelto di ricostruire.</p>
<p>Milvus 2.0 è stato essenzialmente una riscrittura completa. Abbiamo introdotto un'architettura storage-compute completamente disaccoppiata con scalabilità dinamica. Ci sono voluti due anni e sinceramente è stato uno dei periodi più stressanti della storia della nostra azienda. Stavamo buttando via un sistema funzionante che migliaia di persone utilizzavano per costruire qualcosa di non collaudato.</p>
<p><strong>Ma quando nel 2022 abbiamo rilasciato Milvus 2.0, abbiamo trasformato Milvus da un potente database vettoriale a un'infrastruttura pronta per la produzione, in grado di scalare i carichi di lavoro aziendali.</strong> Nello stesso anno abbiamo anche completato un <a href="https://zilliz.com/news/vector-database-company-zilliz-series-b-extension">round di finanziamento di Serie B+, non</a>per bruciare soldi, ma per raddoppiare la qualità del prodotto e il supporto ai clienti globali. Sapevamo che questo percorso avrebbe richiesto tempo, ma ogni passo doveva essere costruito su basi solide.</p>
<h2 id="When-Everything-Accelerated-with-AI" class="common-anchor-header">Quando tutto si è accelerato con l'intelligenza artificiale<button data-href="#When-Everything-Accelerated-with-AI" class="anchor-icon" translate="no">
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
    </button></h2><p>Il 2023 è stato l'anno della <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> (retrieval-augmented generation). Improvvisamente, la ricerca semantica è passata da un'interessante tecnica di AI a un'infrastruttura essenziale per chatbot, sistemi di domande e risposte sui documenti e agenti di AI.</p>
<p>Le stelle di Milvus su GitHub hanno avuto un'impennata. Le richieste di assistenza si sono moltiplicate. Gli sviluppatori che non avevano mai sentito parlare di database vettoriali improvvisamente facevano domande sofisticate sulle strategie di indicizzazione e sull'ottimizzazione delle query.</p>
<p>Questa crescita è stata entusiasmante ma anche travolgente. Ci siamo resi conto che dovevamo scalare non solo la nostra tecnologia, ma anche il nostro intero approccio al supporto della comunità. Abbiamo assunto un maggior numero di sostenitori degli sviluppatori, abbiamo riscritto completamente la nostra documentazione e abbiamo iniziato a creare contenuti didattici per gli sviluppatori alle prime armi con i database vettoriali.</p>
<p>Abbiamo anche lanciato <a href="https://zilliz.com/cloud">Zilliz Cloud, la nostra</a>versione completamente gestita di Milvus. Alcuni ci hanno chiesto perché stavamo "commercializzando" il nostro progetto open-source. La risposta onesta è che mantenere un'infrastruttura di livello aziendale è costoso e complesso. Zilliz Cloud ci permette di sostenere e accelerare lo sviluppo di Milvus mantenendo il nucleo del progetto completamente open source.</p>
<p>Poi è arrivato il 2024. <a href="https://zilliz.com/blog/zilliz-named-a-leader-in-the-forrester-wave-vector-database-report"><strong>Forrester ci ha nominato leader</strong></a> <strong>nella categoria dei database vettoriali.</strong> Milvus ha superato le 30.000 stelle di GitHub. <strong>E ci rendemmo conto che la strada che avevamo tracciato per sette anni era finalmente diventata un'autostrada.</strong> Man mano che un numero sempre maggiore di aziende adottava i database vettoriali come infrastruttura critica, la nostra crescita aziendale ha subito una rapida accelerazione, confermando che le fondamenta che avevamo costruito potevano essere scalate sia dal punto di vista tecnico che commerciale.</p>
<h2 id="The-Team-Behind-Milvus-Zilliz" class="common-anchor-header">Il team dietro Milvus: Zilliz<button data-href="#The-Team-Behind-Milvus-Zilliz" class="anchor-icon" translate="no">
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
    </button></h2><p>Ecco una cosa interessante: molte persone conoscono Milvus ma non Zilliz. A noi va bene così. <a href="https://zilliz.com/"><strong>Zilliz</strong></a> <strong>è il team che sta dietro a Milvus: lo costruiamo, lo manteniamo e lo supportiamo.</strong></p>
<p>Ciò che ci sta più a cuore sono gli aspetti poco appariscenti che fanno la differenza tra una bella demo e un'infrastruttura pronta per la produzione: le ottimizzazioni delle prestazioni, le patch di sicurezza, la documentazione che aiuta davvero i principianti e la risposta ponderata ai problemi di GitHub.</p>
<p>Abbiamo creato un team di assistenza globale 24 ore su 24, 7 giorni su 7, negli Stati Uniti, in Europa e in Asia, perché gli sviluppatori hanno bisogno di aiuto nei loro fusi orari, non nei nostri. Abbiamo collaboratori della comunità che chiamiamo &quot;<a href="https://docs.google.com/forms/d/e/1FAIpQLSfkVTYObayOaND8M1ci9eF_YWvoKDb-xQjLJYZ-LhbCdLAt2Q/viewform">Ambasciatori Milvus</a>&quot;, che organizzano eventi, rispondono alle domande dei forum e spesso spiegano i concetti meglio di noi.</p>
<p>Abbiamo anche accolto con favore le integrazioni con AWS, GCP e altri fornitori di cloud, anche quando offrono le loro versioni gestite di Milvus. Più opzioni di distribuzione sono positive per gli utenti. Abbiamo notato che quando i team si trovano di fronte a sfide tecniche complesse, spesso finiscono per rivolgersi direttamente a noi, perché conosciamo il sistema nel profondo.</p>
<p>Molti pensano che l'open source sia solo una &quot;cassetta degli attrezzi&quot;, ma in realtà è un &quot;processo evolutivo&quot;, uno sforzo collettivo di innumerevoli persone che lo amano e ci credono. Solo chi comprende veramente l'architettura può fornire il "perché" delle correzioni dei bug, dell'analisi dei colli di bottiglia delle prestazioni, dell'integrazione dei sistemi di dati e delle modifiche architetturali.</p>
<p><strong>Quindi, se state utilizzando Milvus open-source o se state considerando i database vettoriali come componente centrale del vostro sistema di intelligenza artificiale, vi invitiamo a contattarci direttamente per ottenere un supporto professionale e tempestivo.</strong></p>
<h2 id="Real-Impact-in-Production-The-Trust-from-Users" class="common-anchor-header">Impatto reale nella produzione: La fiducia degli utenti<button data-href="#Real-Impact-in-Production-The-Trust-from-Users" class="anchor-icon" translate="no">
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
    </button></h2><p>I casi d'uso di Milvus sono cresciuti oltre le nostre aspettative iniziali. Stiamo alimentando le infrastrutture di intelligenza artificiale di alcune delle aziende più esigenti del mondo, in tutti i settori.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/zilliz_customers_e7340d5dd4.png" alt="zilliz customers.png" class="doc-image" id="zilliz-customers.png" />
   </span> <span class="img-wrapper"> <span>clienti di zilliz.png</span> </span></p>
<p><a href="https://zilliz.com/customers/bosch"><strong>Bosch</strong></a>, leader mondiale della tecnologia automobilistica e pioniere della guida autonoma, ha rivoluzionato l'analisi dei dati con Milvus, ottenendo una riduzione dell'80% dei costi di raccolta dei dati e un risparmio annuo di 1,4 milioni di dollari, ricercando miliardi di scenari di guida in millisecondi per individuare casi critici.</p>
<p><a href="https://zilliz.com/customers/read-ai"><strong>Read AI</strong></a>, una delle aziende di AI per la produttività in più rapida crescita che serve milioni di utenti attivi mensilmente, utilizza Milvus per ottenere una latenza di recupero inferiore a 20-50 ms su miliardi di record e una velocità di 5 volte superiore nella ricerca agenziale. Il loro CTO afferma: "Milvus funge da repository centrale e alimenta il nostro reperimento di informazioni tra miliardi di record".</p>
<p><a href="https://zilliz.com/customers/global-fintech-leader"><strong>Un leader globale del settore fintech</strong></a>, una delle più grandi piattaforme di pagamento digitale al mondo che elabora decine di miliardi di transazioni in oltre 200 Paesi e 25 valute, ha scelto Milvus per un'ingestione di batch 5-10 volte più veloce rispetto ai concorrenti, completando in meno di un'ora lavori che ad altri richiedevano oltre 8 ore.</p>
<p><a href="https://zilliz.com/customers/filevine"><strong>Filevine</strong></a>, la principale piattaforma di lavoro legale a cui si affidano migliaia di studi legali in tutti gli Stati Uniti, gestisce 3 miliardi di vettori in milioni di documenti legali, facendo risparmiare agli avvocati il 60-80% del tempo nell'analisi dei documenti e ottenendo una "vera consapevolezza dei dati" per la gestione dei casi legali.</p>
<p>Stiamo supportando anche <strong>NVIDIA, OpenAI, Microsoft, Salesforce, Walmart</strong> e molti altri in quasi tutti i settori. Oltre 10.000 organizzazioni hanno scelto Milvus o Zilliz Cloud come database vettoriale.</p>
<p>Non si tratta solo di storie di successo tecnico, ma di esempi di come i database vettoriali stiano silenziosamente diventando un'infrastruttura critica che alimenta le applicazioni di intelligenza artificiale utilizzate ogni giorno.</p>
<h2 id="Why-We-Built-Zilliz-Cloud-Enterprise-Grade-Vector-Database-as-a-Service" class="common-anchor-header">Perché abbiamo costruito Zilliz Cloud: Database vettoriali di livello aziendale come servizio<button data-href="#Why-We-Built-Zilliz-Cloud-Enterprise-Grade-Vector-Database-as-a-Service" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus è open-source e gratuito. Ma il buon funzionamento di Milvus su scala aziendale richiede competenze approfondite e risorse significative. Selezione degli indici, gestione della memoria, strategie di scalabilità, configurazioni di sicurezza: non sono decisioni banali. Molti team vogliono la potenza di Milvus senza la complessità operativa e con un supporto aziendale, garanzie SLA, ecc.</p>
<p>Ecco perché abbiamo creato <a href="https://zilliz.com/cloud">Zilliz Cloud, una</a>versione completamente gestita di Milvus distribuita in 25 regioni globali e in 5 cloud principali, tra cui AWS, GCP e Azure, progettata specificamente per carichi di lavoro AI su scala aziendale che richiedono prestazioni, sicurezza e affidabilità.</p>
<p>Ecco cosa rende Zilliz Cloud diverso:</p>
<ul>
<li><p><strong>Scala massiccia con prestazioni elevate:</strong> Il nostro motore proprietario AutoIndex, alimentato dall'intelligenza artificiale, offre una velocità di interrogazione 3-5 volte superiore a quella di Milvus open-source, senza bisogno di sintonizzare gli indici. L'architettura cloud-native supporta miliardi di vettori e decine di migliaia di query simultanee, mantenendo tempi di risposta inferiori al secondo.</p></li>
<li><p><a href="https://zilliz.com/trust-center"><strong>Sicurezza e conformità integrate</strong></a><strong>:</strong> Crittografia a riposo e in transito, RBAC a grana fine, registrazione completa degli audit, integrazione SAML/OAuth2.0 e implementazioni <a href="https://zilliz.com/bring-your-own-cloud">BYOC</a> (bring your own cloud). Siamo conformi a GDPR, HIPAA e ad altri standard globali di cui le aziende hanno bisogno.</p></li>
<li><p><strong>Ottimizzato per l'efficienza dei costi:</strong> Lo storage dei dati caldo/freddo a livelli, lo scaling elastico che risponde ai carichi di lavoro reali e i prezzi pay-as-you-go possono ridurre il costo totale di proprietà del 50% o più rispetto alle implementazioni autogestite.</p></li>
<li><p><strong>Veramente cloud-agnostico senza vendor lock-in:</strong> Distribuzione su AWS, Azure, GCP, Alibaba Cloud o Tencent Cloud senza vendor lock-in. Garantiamo coerenza e scalabilità a livello globale, indipendentemente dal luogo di esecuzione.</p></li>
</ul>
<p>Queste funzionalità potrebbero non sembrare appariscenti, ma risolvono problemi reali e quotidiani che i team aziendali devono affrontare quando costruiscono applicazioni AI su scala. E soprattutto: sotto il cofano c'è ancora Milvus, quindi non ci sono problemi di compatibilità o di lock-in proprietario.</p>
<h2 id="Whats-Next-Vector-Data-Lake" class="common-anchor-header">Il prossimo passo: Lago di dati vettoriale<button data-href="#Whats-Next-Vector-Data-Lake" class="anchor-icon" translate="no">
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
    </button></h2><p>Abbiamo coniato il termine &quot;<a href="https://zilliz.com/learn/what-is-vector-database">database vettoriale</a>&quot; e siamo stati i primi a costruirne uno, ma non ci fermiamo qui. Ora stiamo costruendo la prossima evoluzione: <strong>Vector Data Lake.</strong></p>
<p><strong>Ecco il problema che stiamo risolvendo: non tutte le ricerche vettoriali hanno bisogno di una latenza di millisecondi.</strong> Molte aziende dispongono di enormi set di dati che vengono interrogati occasionalmente, ad esempio per l'analisi storica dei documenti, per i calcoli di similarità in batch e per l'analisi delle tendenze a lungo termine. Per questi casi d'uso, un database vettoriale tradizionale in tempo reale è eccessivo e costoso.</p>
<p>Vector Data Lake utilizza un'architettura separata storage-compute ottimizzata specificamente per vettori su larga scala e ad accesso non frequente, mantenendo i costi nettamente inferiori rispetto ai sistemi in tempo reale.</p>
<p><strong>Le funzionalità principali includono:</strong></p>
<ul>
<li><p><strong>Stack di dati unificato:</strong> Collega senza soluzione di continuità i livelli di dati online e offline con formati coerenti e archiviazione efficiente, in modo da poter spostare i dati tra i livelli caldi e freddi senza riformattazioni o migrazioni complesse.</p></li>
<li><p><strong>Ecosistema di calcolo compatibile:</strong> Funziona in modo nativo con framework come Spark e Ray, supportando tutto, dalla ricerca vettoriale all'ETL e all'analisi tradizionali. Ciò significa che i team di dati esistenti possono lavorare con i dati vettoriali utilizzando gli strumenti che già conoscono.</p></li>
<li><p><strong>Architettura ottimizzata per i costi:</strong> I dati caldi rimangono su SSD o NVMe per un accesso veloce; i dati freddi passano automaticamente allo storage a oggetti come S3. Le strategie di indicizzazione e archiviazione intelligenti consentono di mantenere l'I/O veloce quando serve, rendendo i costi di archiviazione prevedibili e accessibili.</p></li>
</ul>
<p>Non si tratta di sostituire i database vettoriali, ma di fornire alle aziende lo strumento giusto per ogni carico di lavoro. Ricerca in tempo reale per le applicazioni rivolte all'utente, data lake vettoriali convenienti per l'analisi e l'elaborazione storica.</p>
<p>Crediamo ancora nella logica della Legge di Moore e del Paradosso di Jevons: quando il costo unitario dell'informatica diminuisce, l'adozione cresce. Lo stesso vale per l'infrastruttura vettoriale.</p>
<p>Migliorando gli indici, le strutture di archiviazione, il caching e i modelli di implementazione, giorno dopo giorno, speriamo di rendere l'infrastruttura di IA più accessibile e conveniente per tutti e di contribuire a portare i dati non strutturati nel futuro dell'IA.</p>
<h2 id="A-Big-Thanks-to-You-All" class="common-anchor-header">Un grande ringraziamento a tutti voi!<button data-href="#A-Big-Thanks-to-You-All" class="anchor-icon" translate="no">
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
    </button></h2><p>Le oltre 35.000 stelle rappresentano qualcosa di cui siamo veramente orgogliosi: una comunità di sviluppatori che trova Milvus abbastanza utile da consigliarlo e contribuirvi.</p>
<p>Ma non abbiamo finito. Milvus ha bug da correggere, miglioramenti delle prestazioni da apportare e funzioni richieste dalla nostra comunità. La nostra tabella di marcia è pubblica e vogliamo davvero il vostro contributo su quali siano le priorità.</p>
<p>Non è il numero in sé che conta, ma la fiducia che quelle stelle rappresentano. La fiducia nel fatto che continueremo a costruire all'aperto, ad ascoltare i commenti e a migliorare Milvus.</p>
<ul>
<li><p><strong>Ai nostri collaboratori:</strong> i vostri PR, le segnalazioni di bug e i miglioramenti della documentazione rendono Milvus migliore ogni giorno. Grazie di cuore.</p></li>
<li><p><strong>Ai nostri utenti:</strong> grazie per averci affidato i vostri carichi di lavoro di produzione e per il feedback che ci mantiene onesti.</p></li>
<li><p><strong>Alla nostra comunità:</strong> grazie per rispondere alle domande, organizzare eventi e aiutare i nuovi arrivati a iniziare.</p></li>
</ul>
<p>Se siete nuovi ai database vettoriali, saremo lieti di aiutarvi a iniziare. Se state già utilizzando Milvus o Zilliz Cloud, ci piacerebbe <a href="https://zilliz.com/share-your-story">conoscere la vostra esperienza</a>. E se siete semplicemente curiosi di sapere cosa stiamo costruendo, i canali della nostra comunità sono sempre aperti.</p>
<p>Continuiamo a costruire insieme l'infrastruttura che rende possibili le applicazioni AI.</p>
<hr>
<p>Trovateci qui: <a href="https://github.com/milvus-io/milvus">Milvus su GitHub</a> |<a href="https://zilliz.com/"> Zilliz Cloud</a> |<a href="https://discuss.milvus.io/"> Discord</a> | <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> | <a href="https://x.com/zilliz_universe">X</a> | <a href="https://www.youtube.com/@MilvusVectorDatabase/featured">YouTube</a></p>
<p><a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1751017913702.1751029841530.667&amp;__hssc=175614333.3.1751029841530&amp;__hsfp=3554976067">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/office_hour_4fb9130a9b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
