---
id: >-
  productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable.md
title: >-
  Produrre la ricerca semantica: Come abbiamo costruito e scalato
  l'infrastruttura vettoriale di Airtable
author: Aria Malkani and Cole Dearmon-Moore
date: 2026-3-18
cover: assets.zilliz.com/cover_airtable_milvus_3c77b22ee2.jpg
tag: Use Cases
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Airtable semantic search, Milvus vector database, vector infrastructure,
  multi-tenant vector search, scalable AI retrieval
meta_title: |
  How Airtable Built and Scaled Vector Infrastructure with Milvus
desc: >-
  Scoprite come Airtable ha costruito un'infrastruttura vettoriale scalabile
  basata su Milvus per la ricerca semantica, il reperimento multi-tenant e le
  esperienze AI a bassa latenza.
origin: >-
  https://milvus.io/blog/productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable.md
---
<p><em>Questo post è stato pubblicato originariamente sul</em> <em>canale</em> <em><a href="https://medium.com/airtable-eng/productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable-180fff11a136">Medium di Airtable</a></em> <em>e viene ripubblicato qui con l'autorizzazione.</em></p>
<p>Quando la ricerca semantica di Airtable si è trasformata da un concetto a una funzionalità di base del prodotto, il team dell'infrastruttura dati ha dovuto affrontare la sfida di scalare la ricerca. Come descritto nel nostro <a href="https://medium.com/airtable-eng/building-a-resilient-embedding-system-for-semantic-search-at-airtable-d5fdf27807e2">precedente post sulla costruzione del sistema di incorporamento</a>, avevamo già progettato un livello applicativo robusto e coerente per gestire il ciclo di vita dell'incorporazione. Ma nel nostro diagramma di architettura mancava ancora un pezzo fondamentale: il database vettoriale.</p>
<p>Avevamo bisogno di un motore di archiviazione in grado di indicizzare e servire miliardi di embedding, di supportare una massiccia multi-tenancy e di mantenere gli obiettivi di prestazioni e disponibilità in un ambiente cloud distribuito. Questa è la storia di come abbiamo progettato, rafforzato ed evoluto la nostra piattaforma di ricerca vettoriale fino a farla diventare un pilastro fondamentale dello stack infrastrutturale di Airtable.</p>
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
    </button></h2><p>L'obiettivo di Airtable è aiutare i clienti a lavorare con i loro dati in modo potente e intuitivo. Con l'emergere di LLM sempre più potenti e precisi, le funzionalità che sfruttano il significato semantico dei dati sono diventate fondamentali per il nostro prodotto.</p>
<h2 id="How-We-Use-Semantic-Search" class="common-anchor-header">Come utilizziamo la ricerca semantica<button data-href="#How-We-Use-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Omni-Airtable’s-AI-Chat-answering-real-questions-from-large-datasets" class="common-anchor-header">Omni (la chat AI di Airtable) che risponde a domande reali da grandi insiemi di dati</h3><p>Immaginate di porre una domanda in linguaggio naturale alla vostra base (database) con mezzo milione di righe e di ottenere una risposta corretta e ricca di contesto. Ad esempio:</p>
<p>"Cosa dicono i clienti sulla durata della batteria ultimamente?".</p>
<p>Su piccoli insiemi di dati, è possibile inviare tutte le righe direttamente a un LLM. In scala, questa soluzione diventa rapidamente impraticabile. Avevamo invece bisogno di un sistema in grado di:</p>
<ul>
<li>comprendere l'intento semantico di una query</li>
<li>Recuperare le righe più rilevanti tramite una ricerca di similarità vettoriale.</li>
<li>Fornire queste righe come contesto a un LLM.</li>
</ul>
<p>Questo requisito ha influenzato quasi tutte le decisioni di progettazione successive: Omni doveva essere immediato e intelligente, anche su basi molto grandi.</p>
<h3 id="Linked-record-recommendations-Meaning-over-exact-matches" class="common-anchor-header">Raccomandazioni di record collegati: Il significato rispetto alle corrispondenze esatte</h3><p>La ricerca semantica migliora anche una caratteristica fondamentale di Airtable: i record collegati. Gli utenti hanno bisogno di suggerimenti sulle relazioni basati sul contesto piuttosto che su corrispondenze testuali esatte. Per esempio, la descrizione di un progetto potrebbe implicare una relazione con "Team Infrastructure" senza mai usare quella frase specifica.</p>
<p>Per fornire questi suggerimenti su richiesta è necessario un recupero semantico di alta qualità con una latenza costante e prevedibile.</p>
<h2 id="Our-Design-Priorities" class="common-anchor-header">Le nostre priorità di progettazione<button data-href="#Our-Design-Priorities" class="anchor-icon" translate="no">
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
    </button></h2><p>Per supportare queste caratteristiche e altre ancora, abbiamo ancorato il sistema a 4 obiettivi:</p>
<ul>
<li><strong>Query a bassa latenza (500 ms p99): la</strong> prevedibilità delle prestazioni è fondamentale per la fiducia degli utenti<strong>.</strong> </li>
<li><strong>Scritture ad alta velocità: le</strong> basi cambiano continuamente e le incorporazioni devono rimanere sincronizzate.</li>
<li><strong>Scalabilità orizzontale:</strong> il sistema deve supportare milioni di basi indipendenti.</li>
<li><strong>Self-hosting:</strong> tutti i dati dei clienti devono rimanere all'interno dell'infrastruttura controllata da Airtable.</li>
</ul>
<p>Questi obiettivi hanno influenzato tutte le decisioni architettoniche successive.</p>
<h2 id="Vector-Database-Vendor-Evaluation" class="common-anchor-header">Valutazione dei fornitori di database vettoriali<button data-href="#Vector-Database-Vendor-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>Alla fine del 2024, abbiamo valutato diverse opzioni di database vettoriale e alla fine abbiamo scelto <a href="https://milvus.io/">Milvus</a> in base a tre requisiti chiave.</p>
<ul>
<li>In primo luogo, abbiamo dato priorità a una soluzione self-hosted per garantire la privacy dei dati e mantenere un controllo a grana fine della nostra infrastruttura.</li>
<li>In secondo luogo, il nostro carico di lavoro pesantemente scritto e i modelli di query a raffica richiedevano un sistema in grado di scalare elasticamente mantenendo una latenza bassa e prevedibile.</li>
<li>Infine, la nostra architettura richiedeva un forte isolamento tra milioni di clienti.</li>
</ul>
<p><strong>Milvus</strong> si è rivelato il sistema più adatto: la sua natura distribuita supporta la multi-tenancy di massa e ci permette di scalare l'ingestione, l'indicizzazione e l'esecuzione delle query in modo indipendente, garantendo prestazioni e costi prevedibili.</p>
<h2 id="Architecture-Design" class="common-anchor-header">Progettazione dell'architettura<button data-href="#Architecture-Design" class="anchor-icon" translate="no">
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
    </button></h2><p>Dopo aver scelto la tecnologia, abbiamo dovuto determinare un'architettura per rappresentare la forma unica dei dati di Airtable: milioni di "basi" distinte di proprietà di clienti diversi.</p>
<h2 id="The-Partitioning-Challenge" class="common-anchor-header">La sfida del partizionamento<button data-href="#The-Partitioning-Challenge" class="anchor-icon" translate="no">
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
    </button></h2><p>Abbiamo valutato due strategie principali di partizionamento dei dati:</p>
<h3 id="Option-1-Shared-Partitions" class="common-anchor-header">Opzione 1: partizioni condivise</h3><p>Più basi condividono una partizione e le interrogazioni sono classificate in base all'id della base. Questo migliora l'utilizzo delle risorse, ma introduce un overhead di filtraggio aggiuntivo e rende più complessa l'eliminazione delle basi.</p>
<h3 id="Option-2-One-Base-per-Partition" class="common-anchor-header">Opzione 2: Una base per partizione</h3><p>Ogni base Airtable è mappata su una propria partizione fisica in Milvus. In questo modo si ottiene un forte isolamento, si può eliminare la base in modo semplice e veloce e si evita l'impatto sulle prestazioni del filtraggio post-query.</p>
<h3 id="Final-Strategy" class="common-anchor-header">Strategia finale</h3><p>Abbiamo scelto l'opzione 2 per la sua semplicità e il forte isolamento. Tuttavia, i primi test hanno dimostrato che la creazione di 100k partizioni in una singola raccolta Milvus ha causato un significativo degrado delle prestazioni:</p>
<ul>
<li>La latenza di creazione delle partizioni è passata da ~20 ms a ~250 ms.</li>
<li>I tempi di caricamento delle partizioni superavano i 30 secondi</li>
</ul>
<p>Per risolvere questo problema, abbiamo limitato il numero di partizioni per collezione. Per ogni cluster Milvus, creiamo 400 collezioni, ciascuna con un massimo di 1.000 partizioni. Questo limita il numero totale di basi per cluster a 400k, e i nuovi cluster vengono forniti man mano che si aggiungono altri clienti.</p>
<h2 id="Indexing--Recall" class="common-anchor-header">Indicizzazione e richiamo<button data-href="#Indexing--Recall" class="anchor-icon" translate="no">
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
    </button></h2><p>La scelta degli indici si è rivelata uno dei compromessi più importanti del nostro sistema. Quando una partizione viene caricata, il suo indice viene memorizzato in memoria o su disco. Per trovare un equilibrio tra il tasso di richiamo, le dimensioni dell'indice e le prestazioni, abbiamo confrontato diversi tipi di indice.</p>
<ul>
<li><strong>IVF-SQ8:</strong> offre un ingombro di memoria ridotto ma un richiamo inferiore.</li>
<li><strong>HNSW:</strong> offre il miglior richiamo (99%-100%) ma è affamato di memoria.</li>
<li><strong>DiskANN:</strong> offre un richiamo simile a HNSW, ma con una latenza di interrogazione più elevata.</li>
</ul>
<p>In definitiva, abbiamo scelto HNSW per le sue caratteristiche di richiamo e prestazioni superiori.</p>
<h2 id="The-Application-layer" class="common-anchor-header">Il livello dell'applicazione<button data-href="#The-Application-layer" class="anchor-icon" translate="no">
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
    </button></h2><p>Ad alto livello, la pipeline di ricerca semantica di Airtable prevede due flussi principali:</p>
<ol>
<li><strong>Flusso di ingestione:</strong> Converte le righe di Airtable in embeddings e le memorizza in Milvus.</li>
<li><strong>Flusso di interrogazione:</strong> Incorpora le query dell'utente, recupera gli ID delle righe pertinenti e fornisce il contesto all'LLM.</li>
</ol>
<p>Entrambi i flussi devono funzionare in modo continuo e affidabile su scala, e li illustriamo di seguito. Di seguito illustriamo ciascuno di essi.</p>
<h2 id="Ingestion-Flow-Keeping-Milvus-in-Sync-with-Airtable" class="common-anchor-header">Flusso di ingestione: mantenere Milvus sincronizzato con Airtable<button data-href="#Ingestion-Flow-Keeping-Milvus-in-Sync-with-Airtable" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando un utente apre Omni, Airtable inizia a sincronizzare la sua base con Milvus. Creiamo una partizione, quindi elaboriamo le righe in pezzi, generando embeddings e inserendole in Milvus. Da quel momento in poi, catturiamo tutte le modifiche apportate alla base e inseriamo nuovamente le righe per mantenere i dati coerenti.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Airtable_Milvusblog_1_aac199ae50.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Query-Flow-How-we-use-the-Data" class="common-anchor-header">Flusso delle query: come usiamo i dati<button data-href="#Query-Flow-How-we-use-the-Data" class="anchor-icon" translate="no">
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
    </button></h2><p>Per quanto riguarda la query, incorporiamo la richiesta dell'utente e la inviamo a Milvus per recuperare gli ID delle righe più rilevanti. Quindi recuperiamo le versioni più recenti di tali righe e le includiamo come contesto nella richiesta all'LLM.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Airtable_Milvusblog_2_6e9067b16d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Operational-Challenges--How-We-Solved-Them" class="common-anchor-header">Sfide operative e come le abbiamo risolte<button data-href="#Operational-Challenges--How-We-Solved-Them" class="anchor-icon" translate="no">
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
    </button></h2><p>Costruire un'architettura di ricerca semantica è una sfida; farla funzionare in modo affidabile per centinaia di migliaia di basi è un'altra. Di seguito sono riportate alcune lezioni operative chiave che abbiamo imparato lungo il percorso.</p>
<h3 id="Deployment" class="common-anchor-header">Distribuzione</h3><p>Distribuiamo Milvus tramite il suo CRD Kubernetes con l'<a href="https://github.com/zilliztech/milvus-operator">operatore Milvus</a>, che ci permette di definire e gestire i cluster in modo dichiarativo. Ogni modifica, che si tratti di un aggiornamento della configurazione, di un miglioramento del client o di un upgrade di Milvus, viene sottoposta a test unitari e a un test di carico su richiesta che simula il traffico di produzione prima di essere distribuita agli utenti.</p>
<p>Nella versione 2.5, il cluster Milvus è costituito da questi componenti principali:</p>
<ul>
<li>I nodi di interrogazione tengono in memoria gli indici vettoriali ed eseguono le ricerche vettoriali.</li>
<li>I nodi di dati gestiscono l'ingestione e la compattazione, e persistono i nuovi dati nello storage.</li>
<li>I nodi indice costruiscono e mantengono gli indici vettoriali per mantenere la ricerca veloce man mano che i dati crescono.</li>
<li>Il nodo Coordinator orchestra tutte le attività del cluster e l'assegnazione degli shard.</li>
<li>I nodi proxy instradano il traffico API e bilanciano il carico tra i nodi.</li>
<li>Kafka fornisce la spina dorsale di log/streaming per la messaggistica interna e il flusso di dati</li>
<li>Etcd memorizza i metadati del cluster e lo stato di coordinamento.</li>
</ul>
<p>Grazie all'automazione guidata da CRD e a una rigorosa pipeline di test, possiamo distribuire gli aggiornamenti in modo rapido e sicuro.</p>
<h2 id="Observability-Understanding-System-Health-End-to-End" class="common-anchor-header">Osservabilità: Comprendere la salute del sistema end-to-end<button data-href="#Observability-Understanding-System-Health-End-to-End" class="anchor-icon" translate="no">
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
    </button></h2><p>Monitoriamo il sistema su due livelli per garantire che la ricerca semantica rimanga veloce e prevedibile.</p>
<p>A livello di infrastruttura, monitoriamo la CPU, l'utilizzo della memoria e la salute dei pod in tutti i componenti di Milvus. Questi segnali ci dicono se il cluster sta operando entro limiti di sicurezza e ci aiutano a individuare problemi come la saturazione delle risorse o i nodi non sani prima che si ripercuotano sugli utenti.</p>
<p>A livello di servizio, ci concentriamo sulla capacità di ogni base di tenere il passo con i nostri carichi di lavoro di ingestione e di interrogazione. Metriche come la compattazione e il throughput di indicizzazione ci danno visibilità sull'efficienza dell'ingestione dei dati. I tassi di successo delle query e la latenza ci permettono di capire l'esperienza dell'utente nell'interrogare i dati, mentre la crescita delle partizioni ci permette di sapere come crescono i nostri dati, in modo da essere avvisati se è necessario scalare.</p>
<h2 id="Node-Rotation" class="common-anchor-header">Rotazione dei nodi<button data-href="#Node-Rotation" class="anchor-icon" translate="no">
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
    </button></h2><p>Per motivi di sicurezza e conformità, ruotiamo regolarmente i nodi Kubernetes. In un cluster di ricerca vettoriale, questa operazione non è banale:</p>
<ul>
<li>Quando i nodi di interrogazione vengono ruotati, il coordinatore riequilibra i dati in memoria tra i nodi di interrogazione.</li>
<li>Kafka ed Etcd memorizzano informazioni statiche e richiedono quorum e disponibilità continua.</li>
</ul>
<p>Questo problema viene affrontato con un budget di interruzione rigoroso e una politica di rotazione di un nodo alla volta. Il coordinatore di Milvus ha il tempo di riequilibrarsi prima che il nodo successivo venga ciclato. Questa attenta orchestrazione preserva l'affidabilità senza rallentare la nostra velocità.</p>
<h2 id="Cold-Partition-Offloading" class="common-anchor-header">Offloading della partizione fredda<button data-href="#Cold-Partition-Offloading" class="anchor-icon" translate="no">
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
    </button></h2><p>Uno dei nostri maggiori successi operativi è stato quello di riconoscere che i nostri dati hanno chiari modelli di accesso caldo/freddo. Analizzando l'utilizzo, abbiamo scoperto che solo il 25% dei dati in Milvus viene scritto o letto in una determinata settimana. Milvus ci permette di scaricare intere partizioni, liberando memoria sui nodi di interrogazione. Se quei dati sono necessari in un secondo momento, possiamo ricaricarli in pochi secondi. Questo ci permette di mantenere i dati caldi in memoria e di scaricare il resto, riducendo i costi e permettendoci di scalare in modo più efficiente nel tempo.</p>
<h2 id="Data-Recovery" class="common-anchor-header">Recupero dei dati<button data-href="#Data-Recovery" class="anchor-icon" translate="no">
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
    </button></h2><p>Prima di distribuire Milvus su larga scala, avevamo bisogno di avere la certezza di poter recuperare rapidamente da qualsiasi scenario di guasto. Sebbene la maggior parte dei problemi sia coperta dalla tolleranza ai guasti incorporata nel cluster, abbiamo previsto anche casi rari in cui i dati potrebbero essere danneggiati o il sistema potrebbe entrare in uno stato irrecuperabile.</p>
<p>In queste situazioni, il nostro percorso di recupero è semplice. Per prima cosa creiamo un nuovo cluster Milvus, in modo da poter riprendere a servire il traffico quasi immediatamente. Una volta che il nuovo cluster è in funzione, provvediamo a reinserire in modo proattivo le basi più utilizzate, quindi elaboriamo pigramente le altre man mano che vi si accede. Questo riduce al minimo i tempi di inattività per i dati più consultati, mentre il sistema ricostruisce gradualmente un indice semantico coerente.</p>
<h2 id="What’s-Next" class="common-anchor-header">Il futuro<button data-href="#What’s-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Il nostro lavoro con <a href="https://milvus.io/">Milvus</a> ha gettato una solida base per la ricerca semantica in Airtable: l'alimentazione di esperienze AI veloci e significative su scala. Grazie a questo sistema, ora stiamo esplorando pipeline di ricerca più ricche e integrazioni AI più profonde in tutto il prodotto. Ci aspetta un lavoro entusiasmante, e siamo solo all'inizio.</p>
<p><em>Grazie a tutti gli Airtablet passati e presenti di Data Infrastructure e di tutta l'organizzazione che hanno contribuito a questo progetto: Alex Sorokin, Andrew Wang, Aria Malkani, Cole Dearmon-Moore, Nabeel Farooqui, Will Powelson, Xiaobing Xia.</em></p>
<h2 id="About-Airtable" class="common-anchor-header">Informazioni su Airtable<button data-href="#About-Airtable" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://www.airtable.com/">Airtable</a> è una piattaforma operativa digitale leader nel settore che consente alle organizzazioni di creare applicazioni personalizzate, automatizzare i flussi di lavoro e gestire dati condivisi su scala aziendale. Progettata per supportare processi complessi e interfunzionali, Airtable aiuta i team a costruire sistemi flessibili per la pianificazione, il coordinamento e l'esecuzione su una fonte di verità condivisa. Mentre Airtable espande la sua piattaforma alimentata dall'intelligenza artificiale, tecnologie come Milvus svolgono un ruolo importante nel rafforzare l'infrastruttura di reperimento necessaria per offrire esperienze di prodotto più rapide e intelligenti.</p>
