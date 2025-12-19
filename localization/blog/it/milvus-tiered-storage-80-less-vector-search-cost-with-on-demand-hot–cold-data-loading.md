---
id: >-
  milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md
title: >-
  Smettere di pagare per i dati freddi: Riduzione dell'80% dei costi con il
  caricamento dei dati caldo-freddo su richiesta nello storage a livelli Milvus
author: Buqian Zheng
date: 2025-12-15T00:00:00.000Z
cover: assets.zilliz.com/tiered_storage_cover_38237a3bda.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Tiered Storage, vector search, hot data, cold data'
meta_title: >
  Milvus Tiered Storage: 80% Less Vector Search Cost with On-Demand Hot–Cold
  Data Loading
desc: >-
  Scoprite come lo storage a livelli di Milvus consente il caricamento on-demand
  dei dati caldi e freddi, offrendo una riduzione dei costi fino all'80% e tempi
  di caricamento più rapidi su scala.
origin: >-
  https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md
---
<p><strong>Quanti di voi stanno ancora pagando bollette di infrastrutture premium per dati che il vostro sistema tocca a malapena? Siate onesti: la maggior parte dei team lo fa.</strong></p>
<p>Se gestite la ricerca vettoriale in produzione, probabilmente lo avete visto di persona. Si forniscono grandi quantità di memoria e di unità SSD in modo che tutto sia "pronto per le query", anche se solo una piccola parte del set di dati è effettivamente attiva. E non siete i soli. Abbiamo visto molti casi simili:</p>
<ul>
<li><p><strong>Piattaforme SaaS multi-tenant:</strong> Centinaia di tenant iscritti, ma solo il 10-15% attivo in un determinato giorno. Gli altri rimangono fermi ma occupano comunque risorse.</p></li>
<li><p><strong>Sistemi di raccomandazione per il commercio elettronico:</strong> Un milione di SKU, ma il primo 8% dei prodotti genera la maggior parte delle raccomandazioni e del traffico di ricerca.</p></li>
<li><p><strong>Ricerca AI:</strong> Vasti archivi di embeddings, anche se il 90% delle interrogazioni degli utenti riguarda articoli della settimana scorsa.</p></li>
</ul>
<p>È la stessa storia in tutti i settori: <strong>meno del 10% dei dati viene interrogato frequentemente, ma spesso consuma l'80% dello storage e della memoria.</strong> Tutti sanno che questo squilibrio esiste, ma fino a poco tempo fa non esisteva un'architettura pulita per risolverlo.</p>
<p><strong>Le cose cambiano con</strong> <a href="https://milvus.io/docs/release_notes.md">Milvus 2.6</a><strong>.</strong></p>
<p>Prima di questa versione, Milvus (come la maggior parte dei database vettoriali) dipendeva da <strong>un modello full-load</strong>: se i dati dovevano essere ricercabili, dovevano essere caricati sui nodi locali. Non importava che i dati venissero caricati un migliaio di volte al minuto o una volta al trimestre: <strong>dovevano rimanere caldi.</strong> Questa scelta progettuale garantiva prestazioni prevedibili, ma comportava anche il sovradimensionamento dei cluster e il pagamento di risorse che i dati freddi semplicemente non meritavano.</p>
<p><a href="https://milvus.io/docs/tiered-storage-overview.md">L</a> <strong>'</strong><a href="https://milvus.io/docs/tiered-storage-overview.md">archiviazione a livelli</a> <strong>è la nostra risposta.</strong></p>
<p>Milvus 2.6 introduce una nuova architettura di archiviazione a livelli con un <strong>vero caricamento on-demand</strong>, che consente al sistema di differenziare automaticamente i dati caldi da quelli freddi:</p>
<ul>
<li><p>I segmenti caldi rimangono nella cache vicino all'elaboratore.</p></li>
<li><p>I segmenti freddi vivono a basso costo in uno storage a oggetti remoto.</p></li>
<li><p>I dati vengono caricati nei nodi locali <strong>solo quando una query ne ha effettivamente bisogno</strong>.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://milvus.io/docs/v2.6.x/assets/full-load-mode-vs-tiered-storage-mode.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Questo sposta la struttura dei costi da "quanti dati si hanno" a <strong>"quanti dati si usano effettivamente".</strong> Nelle prime implementazioni di produzione, questo semplice cambiamento consente di <strong>ridurre fino all'80% i costi di storage e memoria</strong>.</p>
<p>Nel resto del post spiegheremo come funziona il Tiered Storage, condivideremo i risultati delle prestazioni reali e mostreremo dove questo cambiamento ha un impatto maggiore.</p>
<h2 id="Why-Full-Loading-Breaks-Down-at-Scale" class="common-anchor-header">Perché il caricamento completo si interrompe su larga scala<button data-href="#Why-Full-Loading-Breaks-Down-at-Scale" class="anchor-icon" translate="no">
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
    </button></h2><p>Prima di immergerci nella soluzione, vale la pena di esaminare più da vicino perché la <strong>modalità full-load</strong> utilizzata in Milvus 2.5 e nelle versioni precedenti è diventata un fattore limitante con la scalabilità dei carichi di lavoro.</p>
<p>In Milvus 2.5 e nelle versioni precedenti, quando un utente inviava una richiesta a <code translate="no">Collection.load()</code>, ogni QueryNode memorizzava nella cache l'intera collezione a livello locale, compresi i metadati, i dati dei campi e gli indici. Questi componenti vengono scaricati dalla memoria degli oggetti e memorizzati completamente in memoria o mappati in memoria (mmap) sul disco locale. Solo dopo che <em>tutti</em> questi dati sono disponibili localmente, la collezione viene contrassegnata come caricata e pronta per servire le query.</p>
<p>In altre parole, l'insieme non è interrogabile finché il set di dati completo, caldo o freddo, non è presente sul nodo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_5_en_3adca38b7e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Nota:</strong> per i tipi di indice che incorporano dati vettoriali grezzi, Milvus carica solo i file dell'indice, non il campo vettoriale separatamente. Anche in questo caso, l'indice deve essere completamente caricato per servire le query, indipendentemente dalla quantità di dati effettivamente accessibili.</p>
<p>Per capire perché questo diventa problematico, si consideri un esempio concreto:</p>
<p>Supponiamo di avere un set di dati vettoriali di medie dimensioni con:</p>
<ul>
<li><p><strong>100 milioni di vettori</strong></p></li>
<li><p><strong>768 dimensioni</strong> (incorporazioni BERT)</p></li>
<li><p>precisione<strong>float32</strong> (4 byte per dimensione)</p></li>
<li><p>Un <strong>indice HNSW</strong></p></li>
</ul>
<p>In questa configurazione, il solo indice HNSW, compresi i vettori grezzi incorporati, occupa circa 430 GB di memoria. Se si aggiungono i campi scalari più comuni, come gli ID utente, i timestamp o le etichette di categoria, l'utilizzo totale delle risorse locali supera facilmente i 500 GB.</p>
<p>Ciò significa che anche se l'80% dei dati viene interrogato raramente o mai, il sistema deve comunque fornire e mantenere più di 500 GB di memoria locale o di disco solo per mantenere la raccolta online.</p>
<p>Per alcuni carichi di lavoro, questo comportamento è accettabile:</p>
<ul>
<li><p>Se quasi tutti i dati vengono consultati di frequente, il caricamento completo di tutti i dati offre la più bassa latenza di interrogazione possibile, al costo più elevato.</p></li>
<li><p>Se i dati possono essere suddivisi in sottoinsiemi caldi e caldi, il memory-mapping dei dati caldi su disco può ridurre parzialmente la pressione della memoria.</p></li>
</ul>
<p>Tuttavia, nei carichi di lavoro in cui l'80% o più dei dati si trova nella coda lunga, gli svantaggi del caricamento completo emergono rapidamente, sia in termini di <strong>prestazioni</strong> che di <strong>costi</strong>.</p>
<h3 id="Performance-bottlenecks" class="common-anchor-header">Colli di bottiglia delle prestazioni</h3><p>In pratica, il caricamento completo non influisce solo sulle prestazioni delle query e spesso rallenta i flussi di lavoro operativi di routine:</p>
<ul>
<li><p><strong>Aggiornamenti periodici più lunghi:</strong> Nei cluster di grandi dimensioni, gli aggiornamenti periodici possono richiedere ore o addirittura un giorno intero, poiché ogni nodo deve ricaricare l'intero set di dati prima di renderlo nuovamente disponibile.</p></li>
<li><p><strong>Recupero più lento dopo i guasti:</strong> Quando un QueryNode si riavvia, non può servire il traffico fino a quando tutti i dati non sono stati ricaricati, prolungando in modo significativo il tempo di recupero e amplificando l'impatto dei guasti ai nodi.</p></li>
<li><p><strong>Rallentamento dell'iterazione e della sperimentazione:</strong> Il caricamento completo rallenta i flussi di lavoro di sviluppo, costringendo i team di intelligenza artificiale ad attendere ore per il caricamento dei dati quando testano nuovi set di dati o configurazioni di indici.</p></li>
</ul>
<h3 id="Cost-inefficiencies" class="common-anchor-header">Inefficienze dei costi</h3><p>Il caricamento completo fa aumentare anche i costi dell'infrastruttura. Ad esempio, sulle istanze ottimizzate per la memoria del cloud mainstream, l'archiviazione di 1 TB di dati in locale costa all'incirca<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>**70</mn><mo separator="true">.</mo><mn>000 all'</mn><mi>anno</mi><mo separator="true">∗∗,</mo><mi>sulla base di un prezzo</mi><mi>conservativo</mi><mo stretchy="false">(</mo><mi>AWSr6i</mi><mo>:</mo></mrow></semantics></math></span></span><mtext> </mtext><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">70.000 all'anno**, sulla base di un prezzo conservativo (AWS r6i: ~</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8389em;vertical-align:-0.1944em;"></span><span class="mord">70</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord">000 all'</span><span class="mord mathnormal" style="margin-right:0.02778em;">anno</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∗</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mpunct"> ∗,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">sulla</span><span class="mord mathnormal" style="margin-right:0.03588em;">base</span><span class="mord mathnormal">di un prezzo conservativo</span><span class="mopen">(</span><span class="mord mathnormal">AWSr6i</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span></span>:<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace nobreak"> </span> 5.74 / GB / mese; GCP n4-highmem: ~5</span></span></span><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>,</mn><mi>68/GB/mese</mi><mo separator="true">;</mo><mi>AzureE-series</mi><mo>:</mo></mrow></semantics></math></span></span><mtext> </mtext> 5<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">,68 / GB/mese; Azure E-series: ~</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span></span></span></span>5<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,</span><span class="mord mathnormal">68/GB/mese</span><span class="mpunct">;</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.05764em;">AzureE</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6595em;"></span><span class="mord mathnormal">serie</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span></span>:<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace nobreak"> </span> 5,67 / GB / mese).</span></span></span></p>
<p>Consideriamo ora un modello di accesso più realistico, in cui l'80% dei dati è freddo e potrebbe essere archiviato nello storage a oggetti (a circa $0,023 / GB / mese):</p>
<ul>
<li><p>200 GB di dati caldi × 5,68 dollari</p></li>
<li><p>800 GB di dati freddi × 0,023 dollari</p></li>
</ul>
<p>Costo annuale: (200×5,68+800×0,023)×12≈$14<strong>.000</strong></p>
<p>Si tratta di una <strong>riduzione dell'80%</strong> del costo totale dello storage, senza sacrificare le prestazioni dove sono effettivamente importanti.</p>
<h2 id="What-Is-the-Tiered-Storage-and-How-Does-It-Work" class="common-anchor-header">Cos'è lo storage a livelli e come funziona?<button data-href="#What-Is-the-Tiered-Storage-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Per eliminare il compromesso, Milvus 2.6 ha introdotto l'<strong>archiviazione a livelli</strong>, che bilancia prestazioni e costi trattando l'archiviazione locale come una cache piuttosto che come un contenitore per l'intero set di dati.</p>
<p>In questo modello, i QueryNode caricano solo metadati leggeri all'avvio. I dati di campo e gli indici vengono recuperati su richiesta dallo storage remoto degli oggetti quando una query li richiede e vengono memorizzati nella cache locale se vengono consultati di frequente. I dati inattivi possono essere eliminati per liberare spazio.</p>
<p>Di conseguenza, i dati caldi rimangono vicino al livello di elaborazione per le query a bassa latenza, mentre i dati freddi rimangono nell'archiviazione degli oggetti fino a quando non sono necessari. In questo modo si riducono i tempi di caricamento, si migliora l'efficienza delle risorse e si consente ai QueryNode di interrogare insiemi di dati molto più grandi della loro memoria locale o della capacità del disco.</p>
<p>In pratica, l'archiviazione a livelli funziona come segue:</p>
<ul>
<li><p><strong>Mantenere i dati caldi in locale:</strong> Circa il 20% dei dati a cui si accede di frequente rimane nei nodi locali, garantendo una bassa latenza per l'80% delle interrogazioni più importanti.</p></li>
<li><p><strong>Caricare i dati freddi su richiesta:</strong> Il restante 80% dei dati ad accesso raro viene recuperato solo quando necessario, liberando la maggior parte delle risorse di memoria e disco locali.</p></li>
<li><p><strong>Adattamento dinamico con lo sfratto basato su LRU:</strong> Milvus utilizza una strategia di evasione LRU (Least Recently Used) per regolare continuamente i dati considerati caldi o freddi. I dati inattivi vengono automaticamente eliminati per fare spazio ai dati di recente accesso.</p></li>
</ul>
<p>Con questo design, Milvus non è più vincolato dalla capacità fissa della memoria locale e del disco. Al contrario, le risorse locali funzionano come una cache gestita dinamicamente, dove lo spazio viene continuamente recuperato dai dati inattivi e riassegnato ai carichi di lavoro attivi.</p>
<p>Questo comportamento è reso possibile da tre meccanismi tecnici fondamentali:</p>
<h3 id="1-Lazy-Load" class="common-anchor-header">1. Carico pigro</h3><p>All'inizializzazione, Milvus carica solo i metadati minimi a livello di segmento, consentendo alle collezioni di diventare interrogabili quasi immediatamente dopo l'avvio. I dati di campo e i file di indice rimangono nello storage remoto e vengono recuperati su richiesta durante l'esecuzione delle query, mantenendo basso l'utilizzo della memoria locale e del disco.</p>
<p><strong>Come funziona il caricamento delle collezioni in Milvus 2.5</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_5_en_aa89de3570.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Come funziona il caricamento pigro in Milvus 2.6 e successivi</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_6_en_049fa45540.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>I metadati caricati durante l'inizializzazione rientrano in quattro categorie principali:</p>
<ul>
<li><p><strong>Statistiche del segmento</strong> (informazioni di base come il conteggio delle righe, la dimensione del segmento e i metadati dello schema)</p></li>
<li><p><strong>Timestamp</strong> (usati per supportare le query di viaggio nel tempo)</p></li>
<li><p><strong>Record di inserimento e cancellazione</strong> (necessari per mantenere la coerenza dei dati durante l'esecuzione delle query)</p></li>
<li><p><strong>Filtri Bloom</strong> (utilizzati per un pre-filtraggio veloce per eliminare rapidamente i segmenti irrilevanti).</p></li>
</ul>
<h3 id="2-Partial-Load" class="common-anchor-header">2. Caricamento parziale</h3><p>Mentre il caricamento pigro controlla <em>quando</em> vengono caricati i dati, il caricamento parziale controlla <em>la quantità di</em> dati caricati. Una volta iniziate le query o le ricerche, il QueryNode esegue un caricamento parziale, recuperando solo i pezzi di dati o i file di indice necessari dallo storage degli oggetti.</p>
<p><strong>Indici vettoriali: Caricamento consapevole degli inquilini</strong></p>
<p>Una delle funzionalità di maggior impatto introdotte in Milvus 2.6+ è il caricamento tenant-aware degli indici vettoriali, progettato specificamente per i carichi di lavoro multi-tenant.</p>
<p>Quando una query accede ai dati di un singolo tenant, Milvus carica solo la parte dell'indice vettoriale che appartiene a quel tenant, saltando i dati dell'indice per tutti gli altri tenant. In questo modo le risorse locali si concentrano sui tenant attivi.</p>
<p>Questo design offre diversi vantaggi:</p>
<ul>
<li><p>Gli indici vettoriali per i tenant inattivi non consumano memoria o disco locale.</p></li>
<li><p>I dati degli indici per i tenant attivi rimangono nella cache per un accesso a bassa latenza.</p></li>
<li><p>Una politica di sfratto LRU a livello di tenant garantisce un uso equo della cache tra i tenant.</p></li>
</ul>
<p><strong>Campi scalari: Caricamento parziale a livello di colonna</strong></p>
<p>Il caricamento parziale si applica anche ai <strong>campi scalari</strong>, consentendo a Milvus di caricare solo le colonne esplicitamente referenziate da una query.</p>
<p>Consideriamo una collezione con <strong>50 campi dello schema</strong>, come <code translate="no">id</code>, <code translate="no">vector</code>, <code translate="no">title</code>, <code translate="no">description</code>, <code translate="no">category</code>, <code translate="no">price</code>, <code translate="no">stock</code>, e <code translate="no">tags</code>, e abbiamo bisogno di restituire solo tre campi:<code translate="no">id</code>, <code translate="no">title</code>, e <code translate="no">price</code>.</p>
<ul>
<li><p>In <strong>Milvus 2.5</strong>, tutti i 50 campi scalari vengono caricati indipendentemente dai requisiti della query.</p></li>
<li><p>In <strong>Milvus 2.6+</strong>, vengono caricati solo i tre campi richiesti. I restanti 47 campi non vengono caricati e vengono recuperati solo se vengono consultati in seguito.</p></li>
</ul>
<p>Il risparmio di risorse può essere notevole. Se ogni campo scalare occupa 20 GB:</p>
<ul>
<li><p>il caricamento di tutti i campi richiede <strong>1.000 GB</strong> (50 × 20 GB)</p></li>
<li><p>Il caricamento dei soli tre campi richiesti richiede <strong>60 GB</strong></p></li>
</ul>
<p>Ciò rappresenta una <strong>riduzione del 94%</strong> nel caricamento dei dati scalari, senza influire sulla correttezza delle query o sui risultati.</p>
<p><strong>Nota: il</strong> caricamento parziale tenant-aware per i campi scalari e gli indici vettoriali sarà introdotto ufficialmente in una prossima release. Una volta disponibile, ridurrà ulteriormente la latenza di carico e migliorerà le prestazioni delle cold-query in grandi implementazioni multi-tenant.</p>
<h3 id="3-LRU-Based-Cache-Eviction" class="common-anchor-header">3. Evacuazione della cache basata su LRU</h3><p>Il caricamento pigro e il caricamento parziale riducono in modo significativo la quantità di dati da portare in memoria locale e su disco. Tuttavia, nei sistemi di lunga durata, la cache continua a crescere con l'accesso a nuovi dati nel tempo. Quando la capacità locale viene raggiunta, entra in vigore l'evasione della cache basata su LRU.</p>
<p>L'evasione LRU (Least Recently Used) segue una semplice regola: i dati che non sono stati consultati di recente vengono evasi per primi. In questo modo si libera spazio locale per i dati di recente accesso, mantenendo nella cache i dati utilizzati di frequente.</p>
<h2 id="Performance-Evaluation-Tiered-Storage-vs-Full-Loading" class="common-anchor-header">Valutazione delle prestazioni: Archiviazione a livelli rispetto al caricamento completo<button data-href="#Performance-Evaluation-Tiered-Storage-vs-Full-Loading" class="anchor-icon" translate="no">
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
    </button></h2><p>Per valutare l'impatto reale del <strong>Tiered Storage</strong>, abbiamo creato un ambiente di prova che rispecchia fedelmente i carichi di lavoro di produzione. Abbiamo confrontato Milvus con e senza Tiered Storage su cinque dimensioni: tempo di caricamento, utilizzo delle risorse, prestazioni delle query, capacità effettiva ed efficienza dei costi.</p>
<h3 id="Experimental-setup" class="common-anchor-header">Configurazione sperimentale</h3><p><strong>Set di dati</strong></p>
<ul>
<li><p>100 milioni di vettori con 768 dimensioni (embeddings BERT)</p></li>
<li><p>Dimensione dell'indice vettoriale: circa 430 GB</p></li>
<li><p>10 campi scalari, tra cui ID, timestamp e categoria</p></li>
</ul>
<p><strong>Configurazione hardware</strong></p>
<ul>
<li><p>1 QueryNode con 4 vCPU, 32 GB di memoria e 1 TB di SSD NVMe</p></li>
<li><p>Rete a 10 Gbps</p></li>
<li><p>Cluster di object storage MinIO come backend di storage remoto</p></li>
</ul>
<p><strong>Modello di accesso</strong></p>
<p>Le query seguono una distribuzione realistica degli accessi caldo-freddo:</p>
<ul>
<li><p>L'80% delle interrogazioni riguarda i dati degli ultimi 30 giorni (≈20% dei dati totali).</p></li>
<li><p>Il 15% si rivolge a dati di 30-90 giorni (≈30% dei dati totali)</p></li>
<li><p>Il 5% si rivolge a dati più vecchi di 90 giorni (≈50% dei dati totali).</p></li>
</ul>
<h3 id="Key-results" class="common-anchor-header">Risultati principali</h3><p><strong>1. Tempo di caricamento 33 volte più veloce</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Fase</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+ (archiviazione a livelli)</strong></th><th style="text-align:center"><strong>Accelerazione</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Download dei dati</td><td style="text-align:center">22 minuti</td><td style="text-align:center">28 secondi</td><td style="text-align:center">47×</td></tr>
<tr><td style="text-align:center">Caricamento dell'indice</td><td style="text-align:center">3 minuti</td><td style="text-align:center">17 secondi</td><td style="text-align:center">10.5×</td></tr>
<tr><td style="text-align:center"><strong>Totale</strong></td><td style="text-align:center"><strong>25 minuti</strong></td><td style="text-align:center"><strong>45 secondi</strong></td><td style="text-align:center"><strong>33×</strong></td></tr>
</tbody>
</table>
<p>In Milvus 2.5, il caricamento della raccolta richiedeva <strong>25 minuti</strong>. Con Tiered Storage in Milvus 2.6+, lo stesso carico di lavoro viene completato in soli <strong>45 secondi</strong>, il che rappresenta un miglioramento significativo dell'efficienza di carico.</p>
<p><strong>2. Riduzione dell'80% dell'utilizzo delle risorse locali</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Fase</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+ (Tiered Storage)</strong></th><th style="text-align:center"><strong>Riduzione</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Dopo il carico</td><td style="text-align:center">430 GB</td><td style="text-align:center">12 GB</td><td style="text-align:center">-97%</td></tr>
<tr><td style="text-align:center">Dopo 1 ora</td><td style="text-align:center">430 GB</td><td style="text-align:center">68 GB</td><td style="text-align:center">-84%</td></tr>
<tr><td style="text-align:center">Dopo 24 ore</td><td style="text-align:center">430 GB</td><td style="text-align:center">85 GB</td><td style="text-align:center">-80%</td></tr>
<tr><td style="text-align:center">Stato stazionario</td><td style="text-align:center">430 GB</td><td style="text-align:center">85-95 GB</td><td style="text-align:center">~80%</td></tr>
</tbody>
</table>
<p>In Milvus 2.5, l'utilizzo delle risorse locali rimane costante a <strong>430 GB</strong>, indipendentemente dal carico di lavoro o dal tempo di esecuzione. Al contrario, Milvus 2.6+ inizia con soli <strong>12 GB</strong> subito dopo il caricamento.</p>
<p>Con l'esecuzione delle query, i dati di accesso frequente vengono memorizzati nella cache locale e l'utilizzo delle risorse aumenta gradualmente. Dopo circa 24 ore, il sistema si stabilizza a <strong>85-95 GB</strong>, riflettendo l'insieme dei dati caldi. A lungo termine, si ottiene una <strong> riduzione di circa l'80%</strong> dell'utilizzo della memoria locale e del disco, senza sacrificare la disponibilità delle query.</p>
<p><strong>3. Impatto quasi nullo sulle prestazioni dei dati a caldo</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Tipo di query</strong></th><th style="text-align:center"><strong>Latenza Milvus 2.5 P99</strong></th><th style="text-align:center"><strong>Milvus 2.6+ latenza P99</strong></th><th style="text-align:center"><strong>Cambiamento</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Interrogazione di dati a caldo</td><td style="text-align:center">15 ms</td><td style="text-align:center">16 ms</td><td style="text-align:center">+6.7%</td></tr>
<tr><td style="text-align:center">Interrogazioni di dati a caldo</td><td style="text-align:center">15 ms</td><td style="text-align:center">28 ms</td><td style="text-align:center">+86%</td></tr>
<tr><td style="text-align:center">Interrogazione di dati a freddo (primo accesso)</td><td style="text-align:center">15 ms</td><td style="text-align:center">120 ms</td><td style="text-align:center">+700%</td></tr>
<tr><td style="text-align:center">Interrogazione di dati freddi (cache)</td><td style="text-align:center">15 ms</td><td style="text-align:center">18 ms</td><td style="text-align:center">+20%</td></tr>
</tbody>
</table>
<p>Per i dati caldi, che rappresentano circa l'80% di tutte le query, la latenza di P99 aumenta solo del 6,7%, con un impatto praticamente impercettibile in produzione.</p>
<p>Le query sui dati freddi presentano una latenza più elevata al primo accesso, a causa del caricamento on-demand dallo storage degli oggetti. Tuttavia, una volta memorizzate nella cache, la loro latenza aumenta solo del 20%. Data la bassa frequenza di accesso dei dati freddi, questo compromesso è generalmente accettabile per la maggior parte dei carichi di lavoro reali.</p>
<p><strong>4. Capacità effettiva 4,3 volte superiore</strong></p>
<p>Con lo stesso budget hardware - otto server con 64 GB di memoria ciascuno (512 GB in totale) - Milvus 2.5 può caricare al massimo 512 GB di dati, equivalenti a circa 136 milioni di vettori.</p>
<p>Con il Tiered Storage abilitato in Milvus 2.6+, lo stesso hardware può supportare 2,2 TB di dati, ovvero circa 590 milioni di vettori. Ciò rappresenta un aumento di 4,3 volte della capacità effettiva, consentendo di servire insiemi di dati significativamente più grandi senza espandere la memoria locale.</p>
<p><strong>5. Riduzione dell'80,1% dei costi</strong></p>
<p>Prendendo come esempio un set di dati vettoriali da 2 TB in un ambiente AWS e ipotizzando che il 20% dei dati sia caldo (400 GB), il confronto dei costi è il seguente:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Articolo</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+ (archiviazione a livelli)</strong></th><th style="text-align:center"><strong>Risparmio</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Costo mensile</td><td style="text-align:center">$11,802</td><td style="text-align:center">$2,343</td><td style="text-align:center">$9,459</td></tr>
<tr><td style="text-align:center">Costo annuale</td><td style="text-align:center">$141,624</td><td style="text-align:center">$28,116</td><td style="text-align:center">$113,508</td></tr>
<tr><td style="text-align:center">Tasso di risparmio</td><td style="text-align:center">-</td><td style="text-align:center">-</td><td style="text-align:center"><strong>80.1%</strong></td></tr>
</tbody>
</table>
<h3 id="Benchmark-Summary" class="common-anchor-header">Riepilogo dei benchmark</h3><p>In tutti i test, lo storage a livelli offre miglioramenti costanti e misurabili:</p>
<ul>
<li><p><strong>Tempi di caricamento 33 volte più veloci:</strong> Il tempo di caricamento della raccolta si riduce da <strong>25 minuti a 45 secondi</strong>.</p></li>
<li><p><strong>80% in meno di utilizzo delle risorse locali:</strong> Nel funzionamento a regime, l'utilizzo della memoria e del disco locale si riduce di circa <strong>l'80%</strong>.</p></li>
<li><p><strong>Impatto quasi nullo sulle prestazioni dei dati a caldo:</strong> La latenza di P99 per i dati a caldo aumenta di <strong>meno del 10%</strong>, preservando le prestazioni delle query a bassa latenza.</p></li>
<li><p><strong>Latenza controllata per i dati freddi:</strong> I dati freddi comportano una latenza più elevata al primo accesso, ma è accettabile data la loro bassa frequenza di accesso.</p></li>
<li><p><strong>Capacità effettiva 4,3 volte superiore:</strong> Lo stesso hardware può servire <strong>4-5 volte più dati</strong> senza memoria aggiuntiva.</p></li>
<li><p><strong>Riduzione dei costi di oltre l'80%:</strong> I costi annuali dell'infrastruttura si riducono di <strong>oltre l'80%</strong>.</p></li>
</ul>
<h2 id="When-to-Use-Tiered-Storage-in-Milvus" class="common-anchor-header">Quando utilizzare lo storage a livelli in Milvus<button data-href="#When-to-Use-Tiered-Storage-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Sulla base dei risultati dei benchmark e dei casi di produzione reali, abbiamo raggruppato i casi d'uso del Tiered Storage in tre categorie per aiutarvi a decidere se è adatto al vostro carico di lavoro.</p>
<h3 id="Best-Fit-Use-Cases" class="common-anchor-header">Casi d'uso più adatti</h3><p><strong>1. Piattaforme di ricerca vettoriale multi-tenant</strong></p>
<ul>
<li><p><strong>Caratteristiche:</strong> Un gran numero di tenant con un'attività altamente disomogenea; la ricerca vettoriale è il carico di lavoro principale.</p></li>
<li><p><strong>Modello di accesso:</strong> Meno del 20% dei locatari genera oltre l'80% delle interrogazioni vettoriali.</p></li>
<li><p><strong>Benefici attesi:</strong> Riduzione dei costi del 70-80%; espansione della capacità di 3-5 volte.</p></li>
</ul>
<p><strong>2. Sistemi di raccomandazione per il commercio elettronico (carichi di lavoro di ricerca vettoriale)</strong></p>
<ul>
<li><p><strong>Caratteristiche:</strong> Forte sbandamento della popolarità tra i prodotti di punta e la coda lunga.</p></li>
<li><p><strong>Modello di accesso:</strong> Il 10% dei prodotti principali rappresenta l'80% del traffico di ricerca vettoriale.</p></li>
<li><p><strong>Benefici attesi:</strong> Nessuna necessità di capacità aggiuntiva durante gli eventi di punta; riduzione dei costi del 60-70%.</p></li>
</ul>
<p><strong>3. Insiemi di dati su larga scala con una netta separazione caldo-freddo (a prevalenza vettoriale).</strong></p>
<ul>
<li><p><strong>Caratteristiche:</strong> Dataset di dimensioni TB o superiori, con accesso fortemente orientato ai dati recenti.</p></li>
<li><p><strong>Modello di accesso:</strong> Una classica distribuzione 80/20: il 20% dei dati serve l'80% delle interrogazioni.</p></li>
<li><p><strong>Benefici attesi:</strong> Riduzione dei costi del 75-85%.</p></li>
</ul>
<h3 id="Good-Fit-Use-Cases" class="common-anchor-header">Casi d'uso adatti</h3><p><strong>1. Carichi di lavoro sensibili ai costi</strong></p>
<ul>
<li><p><strong>Caratteristiche:</strong> Budget ristretti con una certa tolleranza per piccoli compromessi sulle prestazioni.</p></li>
<li><p><strong>Modello di accesso:</strong> Le interrogazioni vettoriali sono relativamente concentrate.</p></li>
<li><p><strong>Benefici attesi:</strong> Riduzione dei costi del 50-70%; i dati freddi possono incorrere in una latenza di ~500 ms al primo accesso, che deve essere valutata in base ai requisiti SLA.</p></li>
</ul>
<p><strong>2. Conservazione dei dati storici e ricerca d'archivio</strong></p>
<ul>
<li><p><strong>Caratteristiche:</strong> Grandi volumi di vettori storici con una frequenza di interrogazione molto bassa.</p></li>
<li><p><strong>Modello di accesso:</strong> Circa il 90% delle interrogazioni riguarda dati recenti.</p></li>
<li><p><strong>Vantaggi attesi:</strong> Conservare i set di dati storici completi; mantenere i costi dell'infrastruttura prevedibili e controllati.</p></li>
</ul>
<h3 id="Poor-Fit-Use-Cases" class="common-anchor-header">Casi d'uso poco adatti</h3><p><strong>1. Carichi di lavoro di dati uniformemente caldi</strong></p>
<ul>
<li><p><strong>Caratteristiche:</strong> Tutti i dati vengono acceduti con una frequenza simile, senza una chiara distinzione tra caldo e freddo.</p></li>
<li><p><strong>Perché non adatto:</strong> Benefici limitati per la cache; aggiunta di complessità al sistema senza vantaggi significativi.</p></li>
</ul>
<p><strong>2. Carichi di lavoro a bassissima latenza</strong></p>
<ul>
<li><p><strong>Caratteristiche:</strong> Sistemi estremamente sensibili alla latenza, come il trading finanziario o le offerte in tempo reale.</p></li>
<li><p><strong>Perché non è adatto:</strong> Anche piccole variazioni di latenza sono inaccettabili; il caricamento completo fornisce prestazioni più prevedibili.</p></li>
</ul>
<h2 id="Quick-Start-Try-Tiered-Storage-in-Milvus-26+" class="common-anchor-header">Avvio rapido: Prova l'archiviazione a livelli in Milvus 2.6+<button data-href="#Quick-Start-Try-Tiered-Storage-in-Milvus-26+" class="anchor-icon" translate="no">
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
    </button></h2><pre><code translate="no"><span class="hljs-comment"># Download Milvus 2.6.1+</span>
$ wget https://github.com/milvus-io/milvus/releases/latest
<span class="hljs-comment"># Configure Tiered Storage</span>
$ vi milvus.yaml
queryNode.segcore.tieredStorage:
  warmup:
    scalarField: <span class="hljs-built_in">disable</span>
    scalarIndex: <span class="hljs-built_in">disable</span>
    vectorField: <span class="hljs-built_in">disable</span>
    vectorIndex: <span class="hljs-built_in">disable</span>
  evictionEnabled: <span class="hljs-literal">true</span>
<span class="hljs-comment"># Launch Milvus</span>
$ docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>Il sistema di archiviazione a livelli di Milvus 2.6 risolve una comune discrepanza tra il modo in cui i dati vettoriali vengono archiviati e il modo in cui vengono effettivamente consultati. Nella maggior parte dei sistemi di produzione, solo una piccola parte dei dati viene interrogata frequentemente, ma i modelli di caricamento tradizionali trattano tutti i dati come ugualmente caldi. Passando al caricamento su richiesta e gestendo la memoria locale e il disco come una cache, Milvus allinea il consumo di risorse al comportamento reale delle query piuttosto che alle ipotesi peggiori.</p>
<p>Questo approccio consente ai sistemi di scalare verso insiemi di dati più grandi senza aumenti proporzionali delle risorse locali, mantenendo le prestazioni delle query a caldo sostanzialmente invariate. I dati freddi rimangono accessibili quando servono, con una latenza prevedibile e limitata, rendendo il compromesso esplicito e controllabile. Poiché la ricerca vettoriale si sposta sempre più in ambienti di produzione sensibili ai costi, multi-tenant e di lunga durata, il Tiered Storage fornisce una base pratica per operare in modo efficiente su scala.</p>
<p>Per ulteriori informazioni sul Tiered Storage, consultate la documentazione qui sotto:</p>
<ul>
<li><a href="https://milvus.io/docs/tiered-storage-overview.md">Documentazione di Milvus</a></li>
</ul>
<p>Avete domande o volete un approfondimento su una qualsiasi funzionalità dell'ultima versione di Milvus? Unitevi al nostro<a href="https://discord.com/invite/8uyFbECzPX"> canale Discord</a> o inviate problemi su<a href="https://github.com/milvus-io/milvus"> GitHub</a>. È anche possibile prenotare una sessione individuale di 20 minuti per ottenere approfondimenti, indicazioni e risposte alle vostre domande tramite<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Per saperne di più sulle caratteristiche di Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Presentazione di Milvus 2.6: ricerca vettoriale accessibile su scala miliardaria</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Introduzione alla funzione Embedding: Come Milvus 2.6 semplifica la vettorizzazione e la ricerca semantica</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">Triturazione JSON in Milvus: filtraggio JSON 88,9 volte più veloce e flessibile</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Il vero recupero a livello di entità: Nuove funzionalità di Array-of-Structs e MAX_SIM in Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Filtraggio geospaziale e ricerca vettoriale insieme a campi geometrici e RTREE in Milvus 2.6</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">Introduzione di AISAQ in Milvus: la ricerca vettoriale su scala miliardaria è appena diventata 3.200 volte più economica sulla memoria</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">Ottimizzazione di NVIDIA CAGRA in Milvus: un approccio ibrido GPU-CPU per un'indicizzazione più rapida e query meno costose</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH in Milvus: l'arma segreta per combattere i duplicati nei dati di allenamento LLM </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Portare la compressione vettoriale all'estremo: come Milvus serve 3 volte di più le query con RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">I benchmark mentono: i DB vettoriali meritano un test reale </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Abbiamo sostituito Kafka/Pulsar con un Picchio per Milvus</a></p></li>
</ul>
