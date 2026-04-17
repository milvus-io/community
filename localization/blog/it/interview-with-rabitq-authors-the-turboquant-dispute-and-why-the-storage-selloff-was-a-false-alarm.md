---
id: >-
  interview-with-rabitq-authors-the-turboquant-dispute-and-why-the-storage-selloff-was-a-false-alarm.md
title: >-
  Intervista agli autori di RaBitQ: La disputa su TurboQuant e perché il crollo
  dello storage è stato un falso allarme
author: 'Cheng Long, Jianyang Gao, Li Liu'
date: 2026-4-17
cover: assets.zilliz.com/0415_updated_rabitq_interviewdocx_md_1_d5709718fc.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'RaBitQ, TurboQuant, vector quantization, Milvus, IVF_RABITQ'
meta_title: |
  RaBitQ Authors on the TurboQuant Vector Quantization Dispute
desc: >-
  Gli autori di RaBitQ rispondono al documento TurboQuant di Google: lo
  squilibrio dei benchmark, la teoria errata e perché il crollo dello storage è
  stato un falso allarme.
origin: >-
  https://milvus.io/blog/interview-with-rabitq-authors-the-turboquant-dispute-and-why-the-storage-selloff-was-a-false-alarm.md
---
<p>Il documento <a href="https://research.google/blog/turboquant-redefining-ai-efficiency-with-extreme-compression/">TurboQuant</a> di Google sosteneva una <strong>compressione di 6 volte, un aumento di velocità di 8 volte e una perdita di precisione prossima allo zero</strong> per le rappresentazioni vettoriali. Dopo la pubblicazione, i titoli della memoria e dello storage hanno subito un brusco calo e le principali testate tecnologiche hanno rapidamente trasformato l'articolo in una notizia da prima pagina.</p>
<p>La reazione del mercato è stata solo l'inizio. I ricercatori hanno iniziato a chiedersi se le affermazioni del documento fossero esagerate e se il lavoro precedente, in particolare <a href="https://dl.acm.org/doi/10.1145/3654970">RaBitQ</a>, fosse stato trattato in modo equo. La controversia ha riportato la <strong>quantizzazione vettoriale</strong> sotto i riflettori, in parte perché le stesse idee di base sono ora importanti in due parti critiche dello stack dell'IA: i <a href="https://zilliz.com/learn/vector-similarity-search">sistemi di ricerca vettoriale</a> e la compressione della cache KV per modelli di grandi dimensioni.</p>
<p>Per comprendere il dibattito tecnico e le sue implicazioni per i sistemi di produzione, abbiamo parlato con <strong>Cheng Long</strong>, professore associato presso l'NTU di Singapore e responsabile di VectorDB@NTU, <strong>Jianyang Gao</strong>, primo autore di RaBitQ, e <strong>Li Liu</strong>, direttore tecnico di Zilliz. La conversazione ha riguardato la quantizzazione vettoriale in sé, le questioni sollevate da TurboQuant e il motivo per cui ciò è importante per sistemi come <a href="https://milvus.io/">Milvus</a>, il più popolare <a href="https://zilliz.com/learn/what-is-vector-database">database vettoriale</a> open-source, e il reperimento di vettori su larga scala.</p>
<p><strong><em>Lettura correlata:</em></strong> <em>Se volete conoscere l'aspetto ingegneristico piuttosto che l'intervista, consultate il nostro articolo di approfondimento su</em> <a href="https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md"><em>come la quantizzazione vettoriale influisce sui costi dell'infrastruttura dell'IA</em></a><em>.</em></p>
<h2 id="Why-did-vector-quantization-suddenly-become-such-a-big-topic" class="common-anchor-header">Perché la quantizzazione vettoriale è diventata improvvisamente un argomento così importante?<button data-href="#Why-did-vector-quantization-suddenly-become-such-a-big-topic" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz: Prima di entrare nel merito della controversia, potrebbe spiegare cos'è la quantizzazione vettoriale e perché è diventata così importante nell'IA?</strong></p>
<p><strong>Cheng Long:</strong> La quantizzazione vettoriale è una tecnica di <strong>compressione dei dati</strong> e di <strong>rappresentazione approssimativa</strong>. In origine proveniva dall'elaborazione dei segnali, dove veniva utilizzata per la compressione di immagini e audio. Nei moderni sistemi di intelligenza artificiale, il suo ruolo è cambiato perché i vettori sono diventati una delle unità di base del calcolo.</p>
<p>Oggi la sua importanza è evidente in due ambiti.</p>
<p>Uno è la <strong>ricerca in tempo reale su collezioni con miliardi o addirittura decine di miliardi di vettori</strong>. Nei sistemi di recupero semantico, il compito principale è la ricerca di similarità su vettori ad alta dimensione. Ma i vettori grezzi sono grandi e il calcolo in virgola mobile è costoso. In scala, questo rende difficile fornire una latenza di livello millisecondo. La quantizzazione vettoriale aiuta a comprimere i vettori in rappresentazioni a basso numero di bit e a velocizzare il calcolo della distanza. Per questo motivo è importante per i carichi di lavoro pratici, come la <a href="https://milvus.io/docs/single-vector-search.md">ricerca a vettore singolo</a>, la <a href="https://milvus.io/docs/multi-vector-search.md">ricerca multivettore</a> e la progettazione di indici nell'<a href="https://milvus.io/docs/index-explained.md">architettura di ricerca Milvus</a>.</p>
<p>L'altro è la <strong>compressione della cache KV</strong> per i modelli di grandi dimensioni. La cache KV riduce il calcolo ridondante durante la generazione, ma il costo della memoria cresce rapidamente con l'allungarsi del contesto. Il problema diventa quindi come comprimere questi vettori senza danneggiare troppo la qualità dell'output. In fondo, anche questo è un problema di quantizzazione vettoriale.</p>
<p><strong>Zilliz: Se la quantizzazione vettoriale diventa più diffusa - e se i risultati di TurboQuant si confermano - significa che la domanda di memoria diminuisce drasticamente?</strong></p>
<p><strong>Jianyang Gao:</strong> A parità di modello e di carico di lavoro, la compressione può ridurre la domanda di storage. Ma questo non giustifica la conclusione più ampia a cui si è giunti.</p>
<p>Quando TurboQuant parla di una <strong>compressione 6x</strong> e di un <strong>aumento di velocità 8x</strong>, fa un confronto con una <strong>linea di</strong> base <strong>a 16 bit/32 bit</strong>. Non è la stessa cosa di un confronto con altri metodi della stessa categoria. Quindi l'effetto reale deve essere valutato con maggiore attenzione.</p>
<p><strong>Zilliz: Da questo punto di vista, se la reazione del mercato riguardasse davvero la tecnologia in sé, sarebbe dovuta avvenire molto prima, quando erano già apparse idee simili?</strong></p>
<p><strong>Cheng Long:</strong> Da un punto di vista tecnico, si potrebbe dire che un territorio teorico simile era già stato raggiunto in precedenza. Ma i mercati non si muovono in sincronia con la ricerca. Di solito c'è un ritardo tra i risultati accademici, l'adozione ingegneristica e l'interpretazione finanziaria.</p>
<p>E su un orizzonte più lungo, l'effetto può anche non essere lineare. La compressione può rendere possibile l'esecuzione di modelli di grandi dimensioni su dispositivi più piccoli, il che può creare nuova domanda piuttosto che ridurla. Il rapporto tra tecnologia e mercati è più complicato di un'estrapolazione lineare.</p>
<h2 id="How-did-RaBitQ-emerge-and-what-did-it-contribute" class="common-anchor-header">Come è nata RaBitQ e qual è stato il suo contributo?<button data-href="#How-did-RaBitQ-emerge-and-what-did-it-contribute" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz: Come è nata l'idea di RaBitQ?</strong></p>
<p><strong>Jianyang Gao:</strong> Siamo partiti da una lacuna che abbiamo riscontrato nei database vettoriali. I metodi tradizionali, come la <a href="https://milvus.io/docs/ivf-pq.md">quantizzazione del prodotto</a>, funzionavano bene dal punto di vista empirico, ma offrivano ben poche garanzie teoriche.</p>
<p>All'epoca studiavo probabilità ad alta dimensionalità all'NTU di Singapore e questo mi ha portato a chiedermi se fosse possibile costruire un metodo non solo pratico, ma anche con una chiara garanzia teorica. Questo è stato il punto di partenza di RaBitQ.</p>
<p><strong>Zilliz: Qual è secondo lei l'originalità di RaBitQ?</strong></p>
<p><strong>Jianyang Gao:</strong> L'idea chiave è stata quella di utilizzare una rotazione casuale, ovvero la trasformazione di Johnson-Lindenstrauss, per rendere la distribuzione delle coordinate vettoriali più uniforme e prevedibile.</p>
<p>Una volta ottenuto questo risultato, è possibile ricavare uno stimatore di quantizzazione ottimale. Abbiamo poi fornito una prova rigorosa che raggiunge il limite inferiore teorico.</p>
<p>Anche i lavori precedenti avevano cercato di introdurre la rotazione casuale. Ma dal nostro punto di vista, questi metodi non hanno ottenuto l'effetto che cercavamo a causa di problemi pratici nella progettazione degli algoritmi.</p>
<p><strong>Zilliz: Dal punto di vista ingegneristico, cosa vi ha colpito di più di RaBitQ?</strong></p>
<p><strong>Li Liu:</strong> Abbiamo lavorato con molti algoritmi di quantizzazione, dai <a href="https://milvus.io/docs/ivf-sq8.md">metodi di quantizzazione scalare</a> a PQ e altre varianti. Ciò che si è distinto di RaBitQ è stato il fatto che ha cambiato il modo di affrontare il problema.</p>
<p>Prima di allora, gran parte del campo era ancora piuttosto empirico. Si poteva dire che un metodo sembrava funzionare, ma era più difficile spiegare chiaramente perché. RaBitQ ha affrontato il problema in modo molto più matematico. Il metodo sembrava elegante e, in un certo senso, semplice. Questo modo di pensare ha influenzato molto del lavoro successivo.</p>
<p><strong>Zilliz: In parole povere, quanto si può risparmiare in termini di memoria e di costi?</strong></p>
<p><strong>Li Liu:</strong> A parità di richiamo, il passaggio dalla compressione a 4 bit a quella a 2 bit dimezza l'uso della memoria.</p>
<p>E non si tratta solo di compressione. Le sue prestazioni sono paragonabili a quelle di approcci precedenti e questo è importante in ambienti di produzione in cui i team si preoccupano sia dell'efficienza della memoria che della qualità del recupero. È per questo che è importante per i sistemi che devono bilanciare l'<a href="https://milvus.io/docs/dense-vector.md">archiviazione vettoriale densa</a>, il throughput e il richiamo.</p>
<p><strong>Zilliz: Oltre a Milvus, quali sono gli ambiti di utilizzo di RaBitQ oggi?</strong></p>
<p><strong>Cheng Long:</strong> Innanzitutto, voglio ringraziare il team di Milvus, perché è stato uno dei primi ad adottare RaBitQ. Abbiamo anche avuto molte discussioni e ricerche collaborative lungo il percorso.</p>
<p>RaBitQ è stato adottato anche in altri sistemi, tra cui FAISS di Meta, VSAG, VectorChord, Volcengine OpenSearch, CockroachDB, ElasticSearch, Lucene e turbopuffer. Per quanto riguarda Milvus, il team ha lanciato <a href="https://milvus.io/docs/ivf-rabitq.md">IVF_RABITQ</a> come opzione di indice reale in <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a>, insieme a un lavoro più ampio sulla <a href="https://milvus.io/docs/manage-collections.md">gestione delle collezioni</a>, sull'<a href="https://milvus.io/docs/ivf-flat.md">indicizzazione basata su IVF</a> e su <a href="https://milvus.io/docs/hnsw.md">HNSW</a>.</p>
<h2 id="How-should-we-evaluate-TurboQuant" class="common-anchor-header">Come valutare TurboQuant?<button data-href="#How-should-we-evaluate-TurboQuant" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz: Nella sua risposta pubblica, lei ha detto che TurboQuant aveva alcuni problemi seri. Quali sono, secondo lei, i principali?</strong></p>
<p><strong>Jianyang Gao:</strong> Vediamo tre problemi principali.</p>
<p>Uno è il modo in cui il documento descrive i lavori precedenti e discute le sovrapposizioni. Il documento di TurboQuant travisa la metodologia di RaBitQ, ignorando la parte più simile, come la Trasformazione di Johnson-Lindenstrauss. Un altro aspetto è il modo in cui l'articolo caratterizza il risultato teorico. Descrive RaBitQ come subottimale senza fornire alcuna spiegazione o prova, mentre in realtà RaBitQ è ottimale. Il terzo è l'equità del confronto sperimentale. Utilizzano una CPU single-core per valutare RaBitQ e una GPU A100 per valutare TurboQuant.</p>
<p><strong>Zilliz: Prendiamo prima la questione dei benchmark. Perché ritiene che il confronto non sia stato equo?</strong></p>
<p><strong>Jianyang Gao:</strong> I benchmark hanno un significato solo se la configurazione è comparabile. Se un sistema viene testato in un ambiente hardware o software molto diverso, il risultato può riflettere la configurazione più che l'algoritmo stesso.</p>
<p>A nostro avviso, le differenze nella scelta del processore, nel linguaggio di implementazione e nel livello di ottimizzazione possono fare una grande differenza. Per questo motivo la metodologia dei benchmark deve essere interpretata con molta attenzione, soprattutto dai team che costruiscono sistemi di reperimento di produzione.</p>
<p><strong>Cheng Long:</strong> Il documento contiene anche altre affermazioni che non sono valide.</p>
<p>Ad esempio, il documento afferma che <strong>RaBitQ non può essere vettorializzato</strong>. Ma RaBitQ aveva già reso disponibile un codice con calcolo vettoriale basato su SIMD quando è stato pubblicato l'articolo 2024. Dal nostro punto di vista, quindi, quell'affermazione era di fatto scorretta.</p>
<p>Vale la pena ricordare che l'anno scorso abbiamo iniziato a collaborare con NVIDIA e abbiamo completato un'implementazione di RaBitQ su GPU. Il relativo codice è in fase di revisione per l'inclusione nella libreria cuVS di NVIDIA.</p>
<p><strong>Zilliz: Milvus ha valutato TurboQuant nella seconda metà del 2025 ma non l'ha adottato. Che cosa ha riscontrato il vostro team durante i test?</strong></p>
<p><strong>Li Liu:</strong> Contiene un'idea utile. A nostro avviso, apporta una piccola ottimizzazione nel modo in cui viene allocata la griglia di quantizzazione. Ma il passo più importante del metodo - l'uso della rotazione casuale per la quantizzazione - è stato introdotto per la prima volta da RaBitQ.</p>
<p>Per quanto riguarda la stima imparziale, l'approccio di RaBitQ è più pulito e la sua derivazione teorica è più solida.</p>
<p>Detto questo, poiché si tratta di un risultato di Google, lo abbiamo testato nel 2025. Nel nostro laboratorio, in un ambiente CPU standardizzato, TurboQuant non ha superato la nostra versione interna di RaBitQ nella maggior parte dei casi valutati. Quindi, quando il mercato ha reagito così fortemente, siamo rimasti davvero sorpresi.</p>
<p><strong>Zilliz: Per i lettori che non hanno esaminato da vicino i due documenti, può spiegare in parole povere dove RaBitQ e TurboQuant si sovrappongono?</strong></p>
<p><strong>Li Liu:</strong> Ad alto livello, entrambi i metodi iniziano con una <strong>rotazione casuale</strong>. Matematicamente, ciò significa moltiplicare il vettore per una matrice ortogonale casuale. Si può pensare che cambi l'angolo di osservazione in uno spazio ad alta dimensione. Non cambia la posizione relativa dei punti di dati, ma distribuisce le informazioni tra le dimensioni in modo più uniforme.</p>
<p>Poi viene la <strong>quantizzazione</strong>. Si divide lo spazio continuo a valori reali in <strong>2^k celle di griglia</strong>, dove <strong>k</strong> è il numero di bit di quantizzazione, e si mappa ogni elemento del vettore in un punto di griglia vicino. TurboQuant effettua un piccolo aggiustamento, assegnando la griglia in base alla distribuzione dei dati, invece di distribuirla uniformemente.</p>
<p>L'ultimo passo è la <strong>stima dell'errore</strong>, ed è qui che risiede il principale contributo di RaBitQ. I metodi tradizionali calcolano direttamente i valori quantizzati, rendendo l'errore più difficile da controllare. RaBitQ stima l'errore di quantizzazione in modo più preciso, e da qui deriva la sua ottimalità matematica. La soluzione di TurboQuant è più complicata e nel nostro caso il compromesso non è sembrato così interessante.</p>
<h2 id="Why-is-attribution-so-hard-to-resolve-in-practice" class="common-anchor-header">Perché l'attribuzione è così difficile da risolvere nella pratica?<button data-href="#Why-is-attribution-so-hard-to-resolve-in-practice" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz</strong>: Dopo la pubblicazione della sua dichiarazione pubblica, come hanno risposto Google e l'ICLR?</p>
<p><strong>Cheng Long:</strong> L'ICLR non ha preso provvedimenti. Abbiamo inviato un'e-mail durante il periodo di revisione nel settembre dello scorso anno, ma non abbiamo ricevuto risposta. Abbiamo scritto di nuovo a marzo di quest'anno e ci è stato detto di pubblicare i commenti su OpenReview, ma oltre a questo non c'è stata alcuna azione.</p>
<p>Per quanto riguarda Google, uno dei coautori ha risposto qualche giorno fa. La risposta diceva che avrebbero rivisto la versione arXiv per correggere la descrizione imprecisa dell'ottimalità di RaBitQ.</p>
<p><strong>Zilliz:</strong> Prima la discussione era incentrata sulla cattiva condotta accademica. Ora sembra anche una questione di squilibrio e di chi deve dare forma alla storia. Perché è così difficile difendere il vostro lavoro?</p>
<p><strong>Cheng Long:</strong> Un problema è la scala. Le conferenze sull'intelligenza artificiale sono ormai così grandi che un singolo ciclo può portare decine di migliaia di articoli. Gli organizzatori semplicemente non hanno la capacità di gestire ogni controversia di questo tipo.</p>
<p>L'altro problema è lo squilibrio. Le grandi aziende hanno una voce pubblica molto più forte. I ricercatori indipendenti o i team più piccoli non hanno lo stesso potere di comunicazione.</p>
<p><strong>Jianyang Gao:</strong> Per i singoli, il costo è estremamente elevato. Nelle ultime settimane io e il professor Long siamo riusciti a malapena a lavorare normalmente.</p>
<p>Anche il processo stesso è stato frustrante. Siamo stati respinti con fermezza quando abbiamo contattato gli autori e non abbiamo ricevuto alcuna risposta dagli organizzatori della conferenza. In pratica, molti ricercatori guardano a situazioni come questa e decidono di lasciar perdere. Ma è anche così che molti contributi originali scompaiono dalla narrazione pubblica.</p>
<p><strong>Zilliz:</strong> Sembra che non sia la prima volta che il suo team si imbatte in questo tipo di problema.</p>
<p><strong>Cheng Long:</strong> No, non è così.</p>
<p>Abbiamo già visto casi in cui le aziende prendono RaBitQ, apportano alcune modifiche tecniche, gli danno un nuovo nome e poi lo descrivono solo come qualcosa ispirato a RaBitQ.</p>
<p>Per questo motivo apprezzo il modo in cui alcuni team del settore gestiscono la questione, tra cui Milvus. Quando usano RaBitQ, lo descrivono in modo oggettivo. E quando aggiungono ottimizzazioni oltre alla versione originale, le spiegano chiaramente come proprio contributo ingegneristico. In questo modo si dà il giusto credito al lavoro originale e si dimostra al tempo stesso la forza tecnica dell'azienda.</p>
<p><strong>Zilliz:</strong> Quando le grandi aziende si basano su un lavoro accademico, di solito forniscono una condivisione finanziaria o una ripartizione dei benefici?</p>
<p><strong>Jianyang Gao:</strong> Nella maggior parte dei casi, no.</p>
<p>Detto questo, le grandi aziende hanno comunque un forte incentivo a presentare un progresso tecnico come qualcosa che hanno creato loro stesse piuttosto che come qualcosa che hanno adottato da altri. Tutti vogliono che i clienti e gli investitori vedano il lavoro più avanzato come il risultato dell'innovazione del proprio team.</p>
<h2 id="What-comes-next-for-vector-quantization" class="common-anchor-header">Quali sono i prossimi sviluppi della quantizzazione vettoriale?<button data-href="#What-comes-next-for-vector-quantization" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zilliz:</strong> Su quali direzioni di ricerca state lavorando ora?</p>
<p><strong>Cheng Long:</strong> Gran parte del nostro lavoro rimarrà incentrato sul recupero dei vettori.</p>
<p>Una direzione è quella di combinare RaBitQ con diversi indici di reperimento vettoriale, come IVF e HNSW, in modo che il sistema possa supportare dati su larga scala con una latenza inferiore, una maggiore concurrency e un costo inferiore. Sto anche prestando attenzione alla compressione della cache KV.</p>
<p><strong>Jianyang Gao:</strong> La cache KV in modelli di grandi dimensioni e il recupero vettoriale condividono molte delle stesse proprietà, sia dal punto di vista matematico che a livello di sistema, perché entrambi trattano vettori ad alta dimensionalità.</p>
<p>In futuro, voglio pensare di più a come applicare gli strumenti matematici, comprese le idee della probabilità ad alta dimensione, per accelerare l'inferenza e l'addestramento.</p>
<p><strong>Zilliz</strong>: Qual è il limite massimo della quantizzazione vettoriale come campo? Quanto spazio c'è ancora per i miglioramenti?</p>
<p><strong>Cheng Long:</strong> Da un punto di vista teorico, il limite massimo è ampiamente in vista. RaBitQ è già asintoticamente ottimale.</p>
<p>Ma dal punto di vista ingegneristico c'è ancora molto spazio. Bisogna ancora fare i conti con le caratteristiche dell'hardware, la distribuzione dei dati, i vincoli di latenza e molti altri fattori pratici. È proprio per questo che i sistemi di produzione hanno ancora bisogno di un lavoro accurato in aree come l'<a href="https://milvus.io/docs/architecture_overview.md">architettura dei database vettoriali distribuiti</a>, il <a href="https://milvus.io/docs/sparse_vector.md">supporto vettoriale sparse</a>, le <a href="https://milvus.io/docs/reranking.md">pipeline di reranking</a> e la selezione delle metriche di <a href="https://milvus.io/docs/metric.md">distanza Milvus</a>.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Continuate a leggere<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
    </button></h2><p>Se volete approfondire l'aspetto ingegneristico di RaBitQ e come si inserisce in Milvus, queste sono le risorse più importanti:</p>
<ul>
<li><a href="https://milvus.io/docs/ivf-rabitq.md">Documentazione IVF_RABITQ</a> - dettagli sulla configurazione e indicazioni sulla messa a punto.</li>
<li><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3×-more-queries-with-rabitq.md">Approfondimento sull'integrazione di RaBitQ</a> - come Milvus ha trasformato RaBitQ in un indice di produzione.</li>
<li><a href="https://milvus.io/blog/turboquant-rabitq-vector-database-cost.md">Come la quantizzazione vettoriale influisce sui costi dell'infrastruttura AI</a> - la nostra analisi più ampia della discussione TurboQuant-RaBitQ.</li>
<li><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Post sul rilascio di Milvus 2.6</a> - dove IVF_RABITQ è diventato una vera opzione dell'indice Milvus.</li>
<li>L<a href="https://milvus.io/docs/index-explained.md">'indice Milvus spiegato</a> - come IVF_RABITQ si adatta alle altre scelte di indice.</li>
<li>L<a href="https://milvus.io/docs/ivf-flat.md">'indicizzazione IVF_FLAT</a> e l'<a href="https://milvus.io/docs/hnsw.md">indicizzazione HNSW</a> - utili punti di riferimento per confrontare i compromessi tra gli indici.</li>
<li><a href="https://milvus.io/docs/schema.md">Progettazione di schemi in Milvus</a> e <a href="https://milvus.io/docs/filtered-search.md">ricerca filtrata</a> - utile se si sta valutando RaBitQ in un'applicazione reale piuttosto che in modo isolato.</li>
<li><a href="https://milvus.io/docs/quickstart.md">Avvio rapido di Milvus</a> e <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">progettazione del sistema RAG</a> - utile se si vuole provare questo sistema in una pipeline di reperimento.</li>
</ul>
<p>Unitevi alla <a href="https://slack.milvus.io/">comunità Slack di Milvus</a> o <a href="https://milvus.io/office-hours">prenotate le Milvus Office Hours</a> se volete parlare del vostro carico di lavoro.</p>
<p>Se preferite evitare la configurazione dell'infrastruttura, potete <a href="https://cloud.zilliz.com/signup">iscrivervi a Zilliz Cloud</a> (Milvus completamente gestito).</p>
