---
id: milvus-exceeds-40k-github-stars.md
title: >-
  7 anni, 2 grandi ricostruzioni, oltre 40.000 stelle GitHub: L'ascesa di Milvus
  come principale database vettoriale open source
author: Fendy Feng
date: 2025-12-02T00:00:00.000Z
cover: assets.zilliz.com/star_history_3dfceda40f.png
tag: announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database'
meta_title: >
  7 Years, 2 Major Rebuilds, 40K+ GitHub Stars: The Rise of Milvus as the
  Leading Open-Source Vector Database
desc: >-
  Celebrazione del viaggio di 7 anni di Milvus per diventare il principale
  database vettoriale open source del mondo
origin: 'https://milvus.io/blog/milvus-exceeds-40k-github-stars.md'
---
<p>Nel giugno 2025, Milvus ha raggiunto le 35.000 stelle di GitHub. A pochi mesi di distanza, abbiamo <a href="https://github.com/milvus-io/milvus">superato le 40.000 stelle, a riprova</a>non solo dello slancio, ma anche di una comunità globale che continua a spingere in avanti il futuro della ricerca vettoriale e multimodale.</p>
<p>Siamo profondamente grati. A tutti coloro che hanno dato la stelletta, hanno fatto il fork, hanno presentato problemi, hanno discusso su un'API, hanno condiviso un benchmark o hanno costruito qualcosa di incredibile con Milvus: <strong>grazie, e siete il motivo per cui questo progetto si muove così velocemente</strong>. Ogni stella rappresenta più di un pulsante premuto: riflette qualcuno che ha scelto Milvus per alimentare il proprio lavoro, qualcuno che crede in ciò che stiamo costruendo, qualcuno che condivide la nostra visione di un'infrastruttura AI aperta, accessibile e ad alte prestazioni.</p>
<p>Perciò, mentre festeggiamo, guardiamo anche al futuro: alle funzionalità che ci chiedete, alle architetture che l'IA ora richiede e a un mondo in cui la comprensione multimodale e semantica è l'opzione predefinita in ogni applicazione.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/star_history_3dfceda40f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="The-Journey-From-Zero-to-40000+-Stars" class="common-anchor-header">Il viaggio: Da zero a oltre 40.000 stelle<button data-href="#The-Journey-From-Zero-to-40000+-Stars" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando abbiamo iniziato a costruire Milvus nel 2017, il termine <em>database vettoriale</em> non esisteva nemmeno. Eravamo solo un piccolo team di ingegneri convinti che le applicazioni di intelligenza artificiale avrebbero presto avuto bisogno di un nuovo tipo di infrastruttura di dati, costruita non per righe e colonne, ma per dati multimodali, destrutturati e ad alta dimensione. I database tradizionali non sono stati costruiti per questo mondo e sapevamo che qualcuno doveva reimmaginare l'aspetto dell'archiviazione e del recupero dei dati.</p>
<p>I primi tempi sono stati tutt'altro che entusiasmanti. Costruire un'infrastruttura di livello aziendale è un lavoro lento e ostinato: settimane passate a profilare i percorsi del codice, a riscrivere i componenti e a mettere in discussione le scelte di progettazione alle due di notte. Ma noi ci siamo attenuti a una semplice missione: <strong>rendere la ricerca vettoriale accessibile, scalabile e affidabile per ogni sviluppatore che realizza applicazioni di intelligenza artificiale</strong>. Questa missione ci ha portato a superare le prime scoperte e le inevitabili battute d'arresto.</p>
<p>E lungo il percorso, alcuni punti di svolta hanno cambiato tutto:</p>
<ul>
<li><p><strong>2019:</strong> abbiamo reso disponibile Milvus 0.10. Significava esporre tutte le nostre asperità: gli hack, i TODO, i pezzi di cui non eravamo ancora orgogliosi. Ma la comunità si è fatta sentire. Gli sviluppatori hanno presentato problemi che non avremmo mai trovato, hanno proposto funzionalità che non avevamo immaginato e hanno messo in discussione ipotesi che alla fine hanno reso Milvus più forte.</p></li>
<li><p><strong>2020-2021:</strong> Ci siamo uniti alla <a href="https://lfaidata.foundation/projects/milvus/">LF AI &amp; Data Foundation</a>, abbiamo distribuito Milvus 1.0, ci siamo diplomati alla LF AI &amp; Data e abbiamo vinto la sfida della ricerca vettoriale su scala di un miliardo di <a href="https://big-ann-benchmarks.com/neurips21.html">BigANN</a>: una prima prova che la nostra architettura era in grado di gestire la scala del mondo reale.</p></li>
<li><p><strong>2022:</strong> gli utenti aziendali avevano bisogno di una scalabilità nativa Kubernetes, di elasticità e di una reale separazione tra storage e calcolo. Ci trovammo di fronte a una decisione difficile: mettere mano al vecchio sistema o ricostruire tutto. Abbiamo scelto la strada più difficile. <strong>Milvus 2.0 è stato reinventato</strong>, introducendo un'architettura cloud-nativa completamente disaccoppiata che ha trasformato Milvus in una piattaforma di livello produttivo per carichi di lavoro AI mission-critical.</p></li>
<li><p><strong>2024-2025:</strong> <a href="https://zilliz.com/">Zilliz</a> (il team dietro Milvus) è stato nominato <a href="https://zilliz.com/resources/analyst-report/zilliz-forrester-wave-vector-database-report">leader da Forrester</a>, ha superato le 30.000 stelle e ora è oltre le 40.000. È diventato la spina dorsale della ricerca multimodale, dei sistemi RAG, dei flussi di lavoro agici e del reperimento su scala miliardaria in tutti i settori: istruzione, finanza, produzione creativa, ricerca scientifica e altro ancora.</p></li>
</ul>
<p>Questo traguardo è stato raggiunto non grazie all'hype, ma grazie agli sviluppatori che hanno scelto Milvus per carichi di lavoro di produzione reali e che ci hanno spinto a migliorare in ogni momento.</p>
<h2 id="2025-Two-Major-Releases-Massive-Performance-Gains" class="common-anchor-header">2025: Due importanti release, enormi guadagni in termini di prestazioni<button data-href="#2025-Two-Major-Releases-Massive-Performance-Gains" class="anchor-icon" translate="no">
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
    </button></h2><p>Il 2025 è stato l'anno in cui Milvus è entrato in un nuovo campionato. Mentre la ricerca vettoriale eccelle nella comprensione semantica, la realtà in produzione è semplice: <strong>gli sviluppatori hanno ancora bisogno di una corrispondenza precisa delle parole chiave</strong> per gli ID dei prodotti, i numeri di serie, le frasi esatte, i termini legali e altro ancora. Senza la ricerca full-text nativa, i team erano costretti a mantenere cluster Elasticsearch/OpenSearch o a incollare insieme le proprie soluzioni personalizzate, raddoppiando i costi operativi e la frammentazione.</p>
<p><a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md"><strong>Milvus 2.5</strong></a> <strong>ha cambiato le cose</strong>. Ha introdotto una <strong>ricerca ibrida veramente nativa</strong>, combinando il reperimento del testo completo e la ricerca vettoriale in un unico motore. Per la prima volta, gli sviluppatori hanno potuto eseguire insieme query lessicali, semantiche e filtri di metadati senza dover ricorrere a sistemi aggiuntivi o a pipeline di sincronizzazione. Abbiamo anche migliorato il filtraggio dei metadati, l'analisi delle espressioni e l'efficienza di esecuzione, in modo che le query ibride risultassero naturali e veloci sotto carichi di produzione reali.</p>
<p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Milvus 2.6</strong></a> <strong>ha spinto ulteriormente questo slancio</strong>, affrontando le due sfide che sentiamo più spesso dagli utenti che operano su scala: <strong><em>costi</em> e <em>prestazioni</em>.</strong> Questa versione ha apportato profondi miglioramenti architetturali: percorsi di query più prevedibili, indicizzazione più veloce, utilizzo della memoria nettamente inferiore e archiviazione significativamente più efficiente. Molti team hanno registrato guadagni immediati senza modificare una sola riga di codice dell'applicazione.</p>
<p>Ecco alcuni punti salienti di Milvus 2.6:</p>
<ul>
<li><p><a href="https://milvus.io/docs/tiered-storage-overview.md"><strong>Archiviazione a livelli</strong></a> che consente ai team di bilanciare in modo più intelligente costi e prestazioni, riducendo i costi di archiviazione fino al 50%.</p></li>
<li><p><strong>Enorme risparmio di memoria</strong> grazie alla <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">quantizzazione a 1 bit RaBitQ</a>, che consente di ridurre l'utilizzo della memoria fino al 72% pur garantendo query più veloci.</p></li>
<li><p><a href="https://milvus.io/docs/full-text-search.md"><strong>Un motore full-text riprogettato</strong></a> con un'implementazione BM25 significativamente più veloce - fino a 4 volte più veloce di Elasticsearch nei nostri benchmark.</p></li>
<li><p><strong>Un nuovo Path Index</strong> per i <a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">metadati strutturati in JSON</a>, che consente un filtraggio fino a 100 volte più veloce su documenti complessi.</p></li>
<li><p><a href="https://milvus.io/docs/aisaq.md"><strong>AiSAQ</strong>:</a> compressione su scala miliardaria con riduzione dello storage di 3200× e forte richiamo.</p></li>
<li><p><a href="https://milvus.io/docs/geometry-operators.md"><strong>Ricerca</strong></a><strong>semantica e</strong> <a href="https://milvus.io/docs/geometry-operators.md"><strong>geospaziale</strong></a> <strong>con R-Tree:</strong> Combinare la <em>posizione delle cose</em> con il <em>loro significato</em> per ottenere risultati più pertinenti.</p></li>
<li><p><a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA"><strong>CAGRA+ Vamana</strong></a><strong>:</strong> Riduce i costi di implementazione con una modalità ibrida CAGRA che si basa sulla GPU ma esegue le query sulla CPU.</p></li>
<li><p><strong>Un</strong><strong>flusso di lavoro</strong><strong>"</strong><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md"><strong>data in, data out</strong></a><strong>"</strong> che semplifica l'ingestione e il recupero degli embedding, soprattutto per le pipeline multimodali.</p></li>
<li><p><strong>Supporto per un massimo di 100K collezioni</strong> in un singolo cluster: un passo importante verso una vera multi-tenancy su scala.</p></li>
</ul>
<p>Per un approfondimento su Milvus 2.6, consultate le <a href="https://milvus.io/docs/release_notes.md">note di rilascio complete</a>.</p>
<h2 id="Beyond-Milvus-Open-Source-Tools-for-AI-Developers" class="common-anchor-header">Oltre Milvus: strumenti open source per gli sviluppatori di IA<button data-href="#Beyond-Milvus-Open-Source-Tools-for-AI-Developers" class="anchor-icon" translate="no">
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
    </button></h2><p>Nel 2025 non ci siamo limitati a migliorare Milvus, ma abbiamo costruito strumenti che rafforzano l'intero ecosistema degli sviluppatori di IA. Il nostro obiettivo non è stato quello di inseguire le tendenze, ma di fornire ai costruttori il tipo di strumenti aperti, potenti e trasparenti che abbiamo sempre desiderato esistessero.</p>
<h3 id="DeepSearcher-Research-Without-Cloud-Lock-In" class="common-anchor-header">DeepSearcher: Ricerca senza blocco del cloud</h3><p>Deep Researcher di OpenAI ha dimostrato cosa possono fare gli agenti di ragionamento profondo. Ma è chiuso, costoso e bloccato dietro API cloud. <a href="https://github.com/zilliztech/deep-searcher"><strong>DeepSearcher</strong></a> <strong>è la nostra risposta.</strong> È un motore di ricerca profonda locale e open-source progettato per tutti coloro che desiderano indagini strutturate senza sacrificare il controllo o la privacy.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepsearcher_5cf6a4f0dc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>DeepSearcher viene eseguito interamente sulla vostra macchina, raccoglie informazioni da tutte le fonti, sintetizza le intuizioni e fornisce citazioni, fasi di ragionamento e tracciabilità, caratteristiche essenziali per una vera ricerca, non solo per riassunti di superficie. Nessuna scatola nera. Nessun vincolo con il fornitore. Solo analisi trasparenti e riproducibili di cui sviluppatori e ricercatori possono fidarsi.</p>
<h3 id="Claude-Context-Coding-Assistants-That-Actually-Understand-Your-Code" class="common-anchor-header">Claude Context: Assistenti di codifica che capiscono davvero il vostro codice</h3><p>La maggior parte degli strumenti di codifica dell'intelligenza artificiale si comportano ancora come pipeline di grep di fantasia: veloci, superficiali, bruciano token e non tengono conto della struttura reale del progetto. <a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a> cambia questa situazione. Costruito come plugin MCP, offre finalmente agli assistenti di codifica ciò che mancava loro: una vera comprensione semantica della vostra base di codice.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_7f608a153d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Claude Context costruisce un indice semantico vettoriale del progetto, consentendo agli agenti di trovare i moduli giusti, seguire le relazioni tra i file, comprendere l'intento a livello di architettura e rispondere alle domande con pertinenza anziché con congetture. Riduce lo spreco di token, aumenta la precisione e, cosa più importante, permette agli assistenti di codifica di comportarsi come se capissero davvero il vostro software, invece di fingere.</p>
<p>Entrambi gli strumenti sono completamente open source. Perché l'infrastruttura dell'IA dovrebbe essere di tutti e perché il futuro dell'IA non dovrebbe essere rinchiuso dietro mura proprietarie.</p>
<h2 id="Trusted-by-10000+-Teams-in-Production" class="common-anchor-header">Affidato a più di 10.000 team in produzione<button data-href="#Trusted-by-10000+-Teams-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>Oggi, più di 10.000 team aziendali utilizzano Milvus in produzione, da startup in rapida crescita ad alcune delle aziende tecnologiche più affermate del mondo e delle Fortune 500. I team di NVIDIA, Salesforce, eBay, Airbnb, IBM, AT&amp;T, LINE, Shopee, Roblox, Bosch e Microsoft si affidano a Milvus per alimentare i sistemi di intelligenza artificiale che operano ogni minuto di ogni giorno. I loro carichi di lavoro comprendono ricerca, raccomandazioni, pipeline agenziali, recupero multimodale e altre applicazioni che spingono l'infrastruttura vettoriale ai suoi limiti.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/logos_eb0d3ad4af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ma ciò che conta di più non è solo <em>chi</em> usa Milvus, ma anche <em>cosa ci costruisce</em>. In tutti i settori, Milvus è alla base di sistemi che modellano il modo in cui le aziende operano, innovano e competono:</p>
<ul>
<li><p><strong>Copiloti AI e assistenti aziendali</strong> che migliorano l'assistenza ai clienti, i flussi di lavoro di vendita e il processo decisionale interno grazie all'accesso istantaneo a miliardi di embeddings.</p></li>
<li><p><strong>Ricerca semantica e visiva nell'e-commerce, nei media e nella pubblicità</strong>, per aumentare la conversione, migliorare la scoperta e velocizzare la produzione creativa.</p></li>
<li><p><strong>Piattaforme di intelligence legale, finanziaria e scientifica</strong> in cui precisione, verificabilità e conformità si traducono in reali vantaggi operativi.</p></li>
<li><p><strong>Motori di rilevamento delle frodi e dei rischi</strong> nel settore fintech e bancario che dipendono da una rapida corrispondenza semantica per prevenire le perdite in tempo reale.</p></li>
<li><p><strong>Sistemi RAG e agenziali su larga scala</strong> che forniscono ai team un comportamento AI profondamente contestuale e consapevole del dominio.</p></li>
<li><p><strong>Livelli di conoscenza aziendali</strong> che unificano testo, codice, immagini e metadati in un unico tessuto semantico coerente.</p></li>
</ul>
<p>E non si tratta di benchmark di laboratorio, ma di alcune delle implementazioni di produzione più impegnative al mondo. Milvus è sempre all'altezza:</p>
<ul>
<li><p>Recupero in meno di 50 ms su miliardi di vettori</p></li>
<li><p>Miliardi di documenti ed eventi gestiti in un unico sistema</p></li>
<li><p>Flussi di lavoro 5-10 volte più veloci rispetto a soluzioni alternative</p></li>
<li><p>Architetture multi-tenant che supportano centinaia di migliaia di collezioni</p></li>
</ul>
<p>I team scelgono Milvus per un semplice motivo: <strong>offre i risultati che contano in termini di velocità, affidabilità, efficienza dei costi e capacità di scalare fino a miliardi senza dover smantellare l'architettura ogni pochi mesi.</strong> La fiducia che questi team ripongono in noi è il motivo per cui continuiamo a rafforzare Milvus per il decennio di AI che ci attende.</p>
<p><a href="https://zilliz.com/share-your-story">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/share_your_story_3c44c533ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
<h2 id="When-You-Need-Milvus-Without-the-Ops-Zilliz-Cloud" class="common-anchor-header">Quando serve Milvus senza le operazioni: Zilliz Cloud<button data-href="#When-You-Need-Milvus-Without-the-Ops-Zilliz-Cloud" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus è gratuito, potente e collaudato. Ma è anche un sistema distribuito e far funzionare bene i sistemi distribuiti è un vero lavoro di ingegneria. La messa a punto degli indici, la gestione della memoria, la stabilità del cluster, la scalabilità, l'osservabilità... sono compiti che richiedono tempo e competenze che molti team non hanno a disposizione. Gli sviluppatori volevano la potenza di Milvus, ma senza il peso operativo che inevitabilmente deriva dalla gestione su scala.</p>
<p>Questa realtà ci ha portato a una semplice conclusione: se Milvus doveva diventare l'infrastruttura principale per le applicazioni di intelligenza artificiale, dovevamo renderlo facile da gestire. Ecco perché abbiamo costruito <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a>, il servizio Milvus completamente gestito, creato e mantenuto dallo stesso team che sta dietro al progetto open-source.</p>
<p>Zilliz Cloud offre agli sviluppatori il Milvus che già conoscono e di cui si fidano, ma senza dover fare il provisioning dei cluster, combattere i problemi di prestazioni, pianificare gli aggiornamenti o preoccuparsi della messa a punto dello storage e del calcolo. E poiché include ottimizzazioni impossibili da eseguire in ambienti autogestiti, è ancora più veloce e affidabile. <a href="https://zilliz.com/blog/cardinal-most-performant-vector-search-engine">Cardinal</a>, il nostro motore vettoriale auto-ottimizzante di livello commerciale, offre prestazioni 10 volte superiori a <strong>Milvus open-source</strong>.</p>
<p><strong>Cosa distingue Zilliz Cloud</strong></p>
<ul>
<li><strong>Prestazioni auto-ottimizzanti:</strong> AutoIndex regola automaticamente HNSW, IVF e DiskANN, garantendo un richiamo superiore al 96% senza alcuna configurazione manuale.</li>
</ul>
<ul>
<li><p><strong>Elastico ed efficiente in termini di costi:</strong> I prezzi pay-as-you-go, l'autoscaling serverless e la gestione intelligente delle risorse spesso riducono i costi del 50% o più rispetto alle implementazioni autogestite.</p></li>
<li><p><strong>Affidabilità di livello enterprise:</strong> SLA di uptime del 99,95%, ridondanza multi-AZ, conformità SOC 2 Type II, ISO 27001 e GDPR. Supporto completo per RBAC, BYOC, registri di audit e crittografia.</p></li>
<li><p><strong>Distribuzione cloud-agnostica:</strong> Esecuzione su AWS, Azure, GCP, Alibaba Cloud o Tencent Cloud: nessun vendor lock-in, prestazioni uniformi ovunque.</p></li>
<li><p><strong>Query in linguaggio naturale:</strong> Il supporto integrato per il server MCP consente di interrogare i dati in modo conversazionale, invece di creare manualmente le chiamate API.</p></li>
<li><p><strong>Migrazione senza sforzo</strong>: Passate da Milvus, Pinecone, Qdrant, Weaviate, Elasticsearch o PostgreSQL utilizzando gli strumenti di migrazione integrati: non sono necessarie riscritture dello schema o tempi di inattività.</p></li>
<li><p><strong>100% compatibile con Milvus open-source.</strong> Nessun fork proprietario. Nessun lock-in. Solo Milvus, reso più semplice.</p></li>
</ul>
<p><strong>Milvus rimarrà sempre open source e gratuito.</strong> Ma per gestirlo e farlo funzionare in modo affidabile su scala aziendale sono necessarie competenze e risorse significative. <strong>Zilliz Cloud è la nostra risposta a questa lacuna</strong>. Distribuito in 29 regioni e su cinque cloud principali, Zilliz Cloud offre prestazioni, sicurezza ed efficienza economica di livello aziendale, mantenendo l'allineamento completo con il Milvus che già conoscete.</p>
<p><a href="https://cloud.zilliz.com/signup"><strong>Iniziare la prova gratuita →</strong></a></p>
<h2 id="Whats-Next-Milvus-Lake" class="common-anchor-header">Cosa c'è dopo: Milvus Lake<button data-href="#Whats-Next-Milvus-Lake" class="anchor-icon" translate="no">
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
    </button></h2><p>In qualità di team che ha introdotto il database vettoriale, abbiamo assistito in prima fila al cambiamento dei dati aziendali. Ciò che un tempo si inseriva ordinatamente in terabyte di tabelle strutturate si sta rapidamente trasformando in petabyte - e presto in trilioni - di oggetti multimodali. Testo, immagini, audio, video, flussi di serie temporali, registri multisensoriali... questi sono i set di dati su cui si basano i moderni sistemi di intelligenza artificiale.</p>
<p>I database vettoriali sono costruiti appositamente per i dati non strutturati e multimodali, ma non sempre sono la scelta più economica o architetturale, soprattutto quando la maggior parte dei dati è fredda. I corpora di addestramento per i modelli di grandi dimensioni, i registri di percezione della guida autonoma e i set di dati della robotica di solito non richiedono una latenza di millisecondi o un'elevata concurrency. L'esecuzione di questo volume di dati attraverso un database vettoriale in tempo reale diventa costosa, pesante dal punto di vista operativo ed eccessivamente complessa per le pipeline che non richiedono questo livello di prestazioni.</p>
<p>Questa realtà ci ha portato alla nostra prossima importante iniziativa: <strong>Milvus Lake, un</strong>lakehouse multimodale semantico e index-first progettato per i dati su scala AI. Milvus Lake unifica i segnali semantici in tutte le modalità - vettori, metadati, etichette, descrizioni generate da LLM e campi strutturati - e li organizza in <strong>Semantic Wide Tables</strong> ancorate a entità aziendali reali. I dati che prima vivevano come file grezzi e sparsi in archivi di oggetti, lakehouse e pipeline di modelli diventano un livello semantico unificato e interrogabile. I grandi corpora multimodali si trasformano in risorse gestibili, recuperabili e riutilizzabili con un significato coerente in tutta l'azienda.</p>
<p>Sotto il cofano, Milvus Lake è costruito su un'architettura pulita di <strong>manifesto + dati + indice</strong>, che considera l'indicizzazione come fondamentale e non come un ripensamento. Questo sblocca un flusso di lavoro "recupera prima, elabora poi" ottimizzato per i dati freddi su scala trilionaria, offrendo una latenza prevedibile, costi di archiviazione nettamente inferiori e una stabilità operativa di gran lunga superiore. Un approccio di archiviazione a più livelli -VMe/SSD per i percorsi caldi e storage a oggetti per gli archivi profondi - abbinato a una compressione efficiente e a indici pigri, preserva la fedeltà semantica e tiene sotto controllo i costi dell'infrastruttura.</p>
<p>Milvus Lake si inserisce perfettamente nell'ecosistema dei dati moderni, integrandosi con Paimon, Iceberg, Hudi, Spark, Ray e altri motori e formati di big data. I team possono eseguire l'elaborazione batch, le pipeline quasi in tempo reale, il recupero semantico, l'ingegnerizzazione delle caratteristiche e la preparazione dei dati di formazione in un unico luogo, senza dover riformulare i flussi di lavoro esistenti. Che si tratti di costruire corpora di modelli di base, di gestire librerie di simulazioni di guida autonoma, di addestrare agenti robotici o di alimentare sistemi di reperimento su larga scala, Milvus Lake fornisce un lago semantico estensibile e conveniente per l'era dell'intelligenza artificiale.</p>
<p><strong>Milvus Lake è in fase di sviluppo attivo.</strong> Siete interessati all'accesso anticipato o volete saperne di più?<a href="https://zilliz.com/contact"> </a></p>
<p><a href="https://zilliz.com/contact-sales"><strong>Contattateci →</strong></a></p>
<h2 id="Built-by-the-Community-For-the-Community" class="common-anchor-header">Costruito dalla comunità, per la comunità<button data-href="#Built-by-the-Community-For-the-Community" class="anchor-icon" translate="no">
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
    </button></h2><p>Ciò che rende speciale Milvus non è solo la tecnologia, ma anche le persone che ci sono dietro. La nostra base di collaboratori abbraccia tutto il mondo, riunendo specialisti del calcolo ad alte prestazioni, dei sistemi distribuiti e dell'infrastruttura AI. Ingegneri e ricercatori di ARM, NVIDIA, AMD, Intel, Meta, IBM, Salesforce, Alibaba, Microsoft e molti altri hanno contribuito con la loro esperienza a trasformare Milvus in ciò che è oggi.</p>
<p>Ogni richiesta di pull, ogni segnalazione di bug, ogni domanda a cui si risponde nei nostri forum, ogni tutorial creato: questi contributi rendono Milvus migliore per tutti.</p>
<p>Questa pietra miliare appartiene a tutti voi:</p>
<ul>
<li><p><strong>Ai nostri collaboratori</strong>: Grazie per il vostro codice, le vostre idee e il vostro tempo. Rendete Milvus migliore ogni singolo giorno.</p></li>
<li><p><strong>Ai nostri utenti</strong>: Grazie per aver affidato a Milvus i vostri carichi di lavoro di produzione e per aver condiviso le vostre esperienze, sia positive che negative. Il vostro feedback guida la nostra tabella di marcia.</p></li>
<li><p><strong>Ai sostenitori della nostra comunità</strong>: Grazie per rispondere alle domande, scrivere tutorial, creare contenuti e aiutare i nuovi arrivati a iniziare. Siete voi a rendere la nostra comunità accogliente e inclusiva.</p></li>
<li><p><strong>Ai nostri partner e integratori</strong>: Grazie per aver costruito con noi e per aver reso Milvus un cittadino di prima classe nell'ecosistema di sviluppo dell'intelligenza artificiale.</p></li>
<li><p><strong>Al team di Zilliz</strong>: Grazie per il vostro costante impegno sia per il progetto open-source che per il successo dei nostri utenti.</p></li>
</ul>
<p>Milvus è cresciuto perché migliaia di persone hanno deciso di costruire qualcosa insieme, in modo aperto, generoso e con la convinzione che un'infrastruttura di AI fondamentale debba essere accessibile a tutti.</p>
<h2 id="Join-Us-on-This-Journey" class="common-anchor-header">Unitevi a noi in questo viaggio<button data-href="#Join-Us-on-This-Journey" class="anchor-icon" translate="no">
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
    </button></h2><p>Sia che stiate costruendo la vostra prima applicazione di ricerca vettoriale o che stiate scalando verso miliardi di vettori, ci piacerebbe avervi come parte della comunità Milvus.</p>
<p><strong>Iniziate</strong>:</p>
<ul>
<li><p><strong>Inizia su GitHub</strong>:<a href="https://github.com/milvus-io/milvus"> github.com/milvus-io/milvus</a></p></li>
<li><p>☁️ <strong>Prova Zilliz Cloud gratuitamente</strong>:<a href="https://zilliz.com/"> zilliz.com/cloud</a></p></li>
<li><p>💬 <strong>Unisciti al nostro</strong> <a href="https://discord.com/invite/8uyFbECzPX"><strong>Discord</strong></a> per connetterti con gli sviluppatori di tutto il mondo</p></li>
<li><p>📚 <strong>Esplora la nostra documentazione</strong>: <a href="https://milvus.io/docs">Documentazione Milvus</a></p></li>
<li><p>💬 <strong>Prenotate una</strong> <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>sessione individuale di 20 minuti</strong></a> per ottenere approfondimenti, indicazioni e risposte alle vostre domande.</p></li>
</ul>
<p>La strada da percorrere è entusiasmante. Mentre l'intelligenza artificiale rimodella i settori e apre nuove possibilità, i database vettoriali saranno al centro di questa trasformazione. Insieme, stiamo costruendo le fondamenta semantiche su cui si basano le moderne applicazioni di IA, e siamo solo all'inizio.</p>
<p>Alle prossime 40.000 stelle e a costruire <strong>insieme</strong> il futuro dell'infrastruttura dell'IA. 🎉</p>
