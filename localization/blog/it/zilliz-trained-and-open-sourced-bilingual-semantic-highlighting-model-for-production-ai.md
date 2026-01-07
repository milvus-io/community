---
id: >-
  zilliz-trained-and-open-sourced-bilingual-semantic-highlighting-model-for-production-ai.md
title: >-
  Abbiamo addestrato e reso pubblico un modello di evidenziazione semantica
  bilingue per la produzione di RAG e la ricerca AI
author: Cheney Zhang
date: 2026-01-06T00:00:00.000Z
cover: assets.zilliz.com/semantic_highlight_cover_f35a98fc58.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Semantic Highlighting, RAG, semantic search, Milvus, bilingual model'
meta_title: |
  Open-sourcing a Bilingual Semantic Highlighting Model for Production AI
desc: >-
  Approfondite il tema dell'evidenziazione semantica, imparate come viene
  costruito il modello bilingue di Zilliz e come si comporta nei benchmark in
  inglese e cinese per i sistemi RAG.
origin: >-
  https://milvus.io/blog/zilliz-trained-and-open-sourced-bilingual-semantic-highlighting-model-for-production-ai.md
---
<p>Che si tratti di una ricerca di prodotti, di una pipeline RAG o di un agente AI, gli utenti hanno bisogno della stessa cosa: un modo rapido per capire perché un risultato è rilevante. L <strong>'evidenziazione</strong> aiuta a contrassegnare il testo esatto che supporta la corrispondenza, in modo che gli utenti non debbano scansionare l'intero documento.</p>
<p>La maggior parte dei sistemi si basa ancora sull'evidenziazione basata su parole chiave. Se un utente cerca "prestazioni iPhone", il sistema evidenzia i token esatti "iPhone" e "prestazioni". Ma questo sistema si rompe non appena il testo esprime la stessa idea con parole diverse. Una descrizione come "Chip A15 Bionic, oltre un milione di benchmark, fluido senza lag" si riferisce chiaramente alle prestazioni, ma non viene evidenziato nulla perché le parole chiave non compaiono mai.</p>
<p>L<strong>'evidenziazione semantica</strong> risolve questo problema. Invece di corrispondere a stringhe esatte, identifica gli intervalli di testo che sono semanticamente allineati con la query. Per i sistemi RAG, la ricerca AI e gli agenti, dove la rilevanza dipende dal significato piuttosto che dalla forma superficiale, ciò consente di ottenere spiegazioni più precise e affidabili del motivo per cui un documento è stato recuperato.</p>
<p>Tuttavia, i metodi di evidenziazione semantica esistenti non sono progettati per i carichi di lavoro dell'IA di produzione. Dopo aver valutato tutte le soluzioni disponibili, abbiamo scoperto che nessuna offriva la precisione, la latenza, la copertura multilingue o la robustezza necessarie per le pipeline RAG, i sistemi ad agenti o la ricerca web su larga scala. <strong>Abbiamo quindi addestrato il nostro modello di evidenziazione semantica bilingue e lo abbiamo reso disponibile come open-source.</strong></p>
<ul>
<li><p>Il nostro modello di evidenziazione semantica: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p>Diteci cosa ne pensate: partecipate al nostro <a href="https://discord.com/invite/8uyFbECzPX">Discord</a>, seguiteci su <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> o prenotate una sessione <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">di 20 minuti di Milvus Office Hours</a> con noi.</p></li>
</ul>
<h2 id="How-Keyword-Based-Highlighting-Works--and-Why-It-Fails-in-Modern-AI-Systems" class="common-anchor-header">Come funziona l'evidenziazione basata su parole chiave e perché fallisce nei moderni sistemi di intelligenza artificiale<button data-href="#How-Keyword-Based-Highlighting-Works--and-Why-It-Fails-in-Modern-AI-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>I sistemi di ricerca tradizionali implementano l'evidenziazione attraverso la semplice corrispondenza delle parole chiave</strong>. Quando vengono restituiti i risultati, il motore individua le posizioni esatte dei token che corrispondono alla query e le racchiude nel markup (di solito i tag <code translate="no">&lt;em&gt;</code> ), lasciando al frontend il compito di rendere l'evidenziazione. Questo funziona bene quando i termini della query appaiono testualmente nel testo.</p>
<p>Il problema è che questo modello presuppone che la rilevanza sia legata alla sovrapposizione esatta delle parole chiave. Quando questo presupposto viene meno, l'affidabilità cala rapidamente. Qualsiasi risultato che esprima l'idea giusta con una formulazione diversa finisce per non essere evidenziato, anche se la fase di recupero è stata corretta.</p>
<p>Questa debolezza diventa evidente nelle moderne applicazioni di IA. Nelle pipeline RAG e nei flussi di lavoro degli agenti di IA, le query sono più astratte, i documenti sono più lunghi e le informazioni rilevanti potrebbero non riutilizzare le stesse parole. L'evidenziazione basata sulle parole chiave non è più in grado di mostrare agli sviluppatori, o agli utenti finali, dove<em>si trova effettivamente la risposta</em>, il che fa sì che il sistema nel suo complesso risulti meno accurato anche quando il reperimento funziona come previsto.</p>
<p>Supponiamo che un utente chieda: <em>"Come posso migliorare l'efficienza di esecuzione del codice Python?".</em> Il sistema recupera un documento tecnico da un database vettoriale. L'evidenziazione tradizionale può contrassegnare solo le corrispondenze letterali come <em>"Python",</em> <em>"codice",</em> <em>"esecuzione"</em> ed <em>"efficienza".</em></p>
<p>Tuttavia, le parti più utili del documento potrebbero essere:</p>
<ul>
<li><p>Usare le operazioni vettoriali di NumPy invece dei loop espliciti.</p></li>
<li><p>Evitare di creare ripetutamente oggetti all'interno di loop</p></li>
</ul>
<p>Queste frasi rispondono direttamente alla domanda, ma non contengono nessuno dei termini della query. Di conseguenza, l'evidenziazione tradizionale fallisce completamente. Il documento può essere rilevante, ma l'utente deve comunque scansionarlo riga per riga per trovare la risposta vera e propria.</p>
<p>Il problema diventa ancora più evidente con gli agenti di intelligenza artificiale. La domanda di ricerca di un agente spesso non è la domanda originale dell'utente, ma un'istruzione derivata prodotta attraverso il ragionamento e la scomposizione dei compiti. Ad esempio, se un utente chiede: <em>"Puoi analizzare le recenti tendenze di mercato?",</em> l'agente potrebbe generare una query del tipo "Recupera i dati di vendita dell'elettronica di consumo del quarto trimestre 2024, i tassi di crescita annuali, le variazioni delle quote di mercato dei principali concorrenti e le fluttuazioni dei costi della catena di fornitura".</p>
<p>Questa query si estende su più dimensioni e codifica un intento complesso. L'evidenziazione tradizionale basata sulle parole chiave, tuttavia, può solo contrassegnare meccanicamente le corrispondenze letterali come <em>"2024",</em> <em>"dati di vendita"</em> o <em>"tasso di crescita".</em></p>
<p>Nel frattempo, le informazioni più preziose possono essere le seguenti:</p>
<ul>
<li><p>La serie iPhone 15 ha guidato una ripresa più ampia del mercato</p></li>
<li><p>I vincoli di fornitura dei chip hanno fatto aumentare i costi del 15%.</p></li>
</ul>
<p>Queste conclusioni potrebbero non condividere una sola parola chiave con la query, anche se sono esattamente ciò che l'agente sta cercando di estrarre. Gli agenti hanno bisogno di identificare rapidamente le informazioni veramente utili da grandi volumi di contenuti recuperati e l'evidenziazione basata sulle parole chiave non offre un vero aiuto.</p>
<h2 id="What-Is-Semantic-Highlighting-and-Pain-Points-in-Today’s-Solutions" class="common-anchor-header">Cos'è l'evidenziazione semantica e i punti deboli delle soluzioni attuali<button data-href="#What-Is-Semantic-Highlighting-and-Pain-Points-in-Today’s-Solutions" class="anchor-icon" translate="no">
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
    </button></h2><p>L<strong>'evidenziazione semantica si basa sulla stessa idea alla base della ricerca semantica: la corrispondenza basata sul significato piuttosto che sulle parole esatte</strong>. Nella ricerca semantica, i modelli di embedding mappano il testo in vettori, in modo che un sistema di ricerca - tipicamente supportato da un database vettoriale come <a href="https://milvus.io/">Milvus - possa</a>recuperare i passaggi che trasmettono la stessa idea della query, anche se la formulazione è diversa. L'evidenziazione semantica applica questo principio a una granularità più fine. Invece di contrassegnare i risultati letterali delle parole chiave, evidenzia gli intervalli specifici all'interno di un documento che sono semanticamente rilevanti per l'intento dell'utente.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vs_20ec73c4a7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Questo approccio risolve un problema fondamentale dell'evidenziazione tradizionale, che funziona solo quando i termini della query appaiono alla lettera. Se un utente cerca "prestazioni dell'iPhone", l'evidenziazione basata su parole chiave ignora frasi come "chip A15 Bionic", "oltre un milione di benchmark" o "fluido senza lag", anche se queste righe rispondono chiaramente alla domanda. L'evidenziazione semantica cattura queste connessioni basate sul significato e fa emergere le parti del testo che interessano agli utenti.</p>
<p>In teoria, si tratta di un problema di corrispondenza semantica semplice. I moderni modelli di embedding codificano già bene la somiglianza, quindi i pezzi concettuali sono già al loro posto. La sfida deriva dai vincoli del mondo reale: l'evidenziazione avviene per ogni query, spesso su molti documenti recuperati, rendendo la latenza, il throughput e la robustezza cross-domain requisiti non negoziabili. I modelli linguistici di grandi dimensioni sono semplicemente troppo lenti e costosi per essere eseguiti in questo percorso ad alta frequenza.</p>
<p>Per questo motivo, l'evidenziazione semantica pratica richiede un modello leggero e specializzato, abbastanza piccolo da affiancare l'infrastruttura di ricerca e abbastanza veloce da restituire risultati in pochi millisecondi. È qui che la maggior parte delle soluzioni esistenti non funziona. I modelli pesanti offrono precisione, ma non possono essere eseguiti su scala; i modelli leggeri sono veloci, ma perdono precisione o falliscono su dati multilingue o specifici del dominio.</p>
<h3 id="opensearch-semantic-highlighter" class="common-anchor-header">opensearch-semantic-highlighter</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/opensearch_en_aea06a2114.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>L'anno scorso OpenSearch ha rilasciato un modello dedicato all'evidenziazione semantica: <a href="https://huggingface.co/opensearch-project/opensearch-semantic-highlighter-v1"><strong>opensearch-semantic-highlighter-v1</strong></a>. Pur essendo un tentativo significativo di risolvere il problema, presenta due limiti critici.</p>
<ul>
<li><p><strong>Finestra di contesto piccola:</strong> Il modello si basa su un'architettura BERT e supporta un massimo di 512 token - circa 300-400 caratteri cinesi o 400-500 parole inglesi. Negli scenari reali, le descrizioni dei prodotti e i documenti tecnici spesso comprendono migliaia di parole. Il contenuto oltre la prima finestra viene semplicemente troncato, costringendo il modello a identificare i punti salienti basandosi solo su una piccola parte del documento.</p></li>
<li><p><strong>Scarsa generalizzazione al di fuori del dominio:</strong> Il modello funziona bene solo su distribuzioni di dati simili al suo set di addestramento. Quando viene applicato a dati esterni al dominio, come nel caso dell'utilizzo di un modello addestrato su articoli di cronaca per evidenziare contenuti di e-commerce o documentazione tecnica, le prestazioni si riducono drasticamente. Nei nostri esperimenti, il modello raggiunge un punteggio F1 di circa 0,72 sui dati interni al dominio, ma scende a circa 0,46 sui set di dati esterni al dominio. Questo livello di instabilità è problematico in produzione. Inoltre, il modello non supporta il cinese.</p></li>
</ul>
<h3 id="Provence--XProvence" class="common-anchor-header">Provence / XProvence</h3><p><a href="https://huggingface.co/naver/provence-reranker-debertav3-v1"><strong>Provence</strong></a> è un modello sviluppato da <a href="https://zilliz.com/customers/naver">Naver</a> ed è stato inizialmente addestrato per il <strong>context pruning, un</strong>compito strettamente legato all'evidenziazione semantica.</p>
<p>Entrambi i compiti si basano sulla stessa idea di fondo: utilizzare la corrispondenza semantica per identificare i contenuti rilevanti e filtrare le parti irrilevanti. Per questo motivo, Provence può essere riutilizzato per l'evidenziazione semantica con un adattamento relativamente ridotto.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/provence_053cd3bccc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Provence è un modello per la sola lingua inglese e si comporta ragionevolmente bene in questo contesto. <a href="https://huggingface.co/naver/xprovence-reranker-bgem3-v1"><strong>XProvence</strong></a> è la sua variante multilingue, che supporta più di una dozzina di lingue, tra cui il cinese, il giapponese e il coreano. A prima vista, XProvence sembra essere un buon candidato per scenari di evidenziazione semantica bilingue o multilingue.</p>
<p>In pratica, però, sia Provence che XProvence presentano diversi limiti degni di nota:</p>
<ul>
<li><p><strong>Prestazioni più deboli in inglese nel modello multilingue:</strong> XProvence non eguaglia le prestazioni di Provence nei benchmark in inglese. Si tratta di un compromesso comune nei modelli multilingue: la capacità è condivisa tra le varie lingue, il che spesso porta a prestazioni più deboli nelle lingue ad alte risorse come l'inglese. Questa limitazione è importante nei sistemi reali in cui l'inglese rimane un carico di lavoro primario o dominante.</p></li>
<li><p><strong>Prestazioni limitate in cinese:</strong> XProvence supporta molte lingue. Durante l'addestramento multilingue, i dati e la capacità del modello sono distribuiti tra le varie lingue, il che limita la capacità del modello di specializzarsi in una singola lingua. Di conseguenza, le prestazioni in cinese sono solo marginalmente accettabili e spesso insufficienti per i casi d'uso di evidenziazione ad alta precisione.</p></li>
<li><p><strong>Disadattamento tra gli obiettivi di potatura e di evidenziazione:</strong> Provence è ottimizzato per la potatura del contesto, in cui la priorità è il richiamo: mantenere il maggior numero possibile di contenuti potenzialmente utili per evitare di perdere informazioni critiche. L'evidenziazione semantica, al contrario, enfatizza la precisione: evidenzia solo le frasi più rilevanti, non ampie porzioni del documento. Quando i modelli di tipo provenzale vengono applicati all'evidenziazione, questa discrepanza porta spesso a evidenziazioni troppo ampie o rumorose.</p></li>
<li><p><strong>Licenze restrittive:</strong> Sia Provence che XProvence sono rilasciati con licenza CC BY-NC 4.0, che non consente l'uso commerciale. Questa restrizione da sola li rende inadatti a molte implementazioni di produzione.</p></li>
</ul>
<h3 id="Open-Provence" class="common-anchor-header">Provenza aperta</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openprovence_en_c4f0aa8b65.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://github.com/hotchpotch/open_provence"><strong>Open Provence</strong></a> è un progetto guidato dalla comunità che reimplementa la pipeline di formazione Provence in modo aperto e trasparente. Fornisce non solo script di addestramento, ma anche flussi di lavoro per l'elaborazione dei dati, strumenti di valutazione e modelli preaddestrati su più scale.</p>
<p>Un vantaggio fondamentale di Open Provence è la sua <strong>licenza MIT</strong>. A differenza di Provence e XProvence, può essere tranquillamente utilizzato in ambienti commerciali senza restrizioni legali, il che lo rende interessante per i team orientati alla produzione.</p>
<p>Detto questo, Open Provence supporta attualmente solo l'<strong>inglese e il giapponese</strong>, il che lo rende inadatto ai nostri casi d'uso bilingue.</p>
<h2 id="We-Trained-and-Open-Sourced-a-Bilingual-Semantic-Highlighting-Model" class="common-anchor-header">Abbiamo addestrato e reso disponibile un modello di evidenziazione semantica bilingue<button data-href="#We-Trained-and-Open-Sourced-a-Bilingual-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>Un modello di evidenziazione semantica progettato per carichi di lavoro reali deve offrire alcune funzionalità essenziali:</p>
<ul>
<li><p>Prestazioni multilingue elevate</p></li>
<li><p>Una finestra di contesto sufficientemente ampia da supportare documenti lunghi</p></li>
<li><p>Robusta generalizzazione fuori dal dominio</p></li>
<li><p>Elevata precisione nei compiti di evidenziazione semantica</p></li>
<li><p>Una licenza permissiva e adatta alla produzione (MIT o Apache 2.0).</p></li>
</ul>
<p>Dopo aver valutato le soluzioni esistenti, abbiamo scoperto che nessuno dei modelli disponibili soddisfaceva i requisiti necessari per l'uso in produzione. Abbiamo quindi deciso di addestrare il nostro modello di evidenziazione semantica: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hugging_face_56eca8f423.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Per ottenere tutti questi risultati, abbiamo adottato un approccio semplice: utilizzare modelli linguistici di grandi dimensioni per generare dati etichettati di alta qualità, quindi addestrare un modello di evidenziazione semantica leggero su di esso utilizzando strumenti open-source. Questo ci permette di combinare la forza di ragionamento degli LLM con l'efficienza e la bassa latenza richieste dai sistemi di produzione.</p>
<p><strong>La parte più impegnativa di questo processo è la costruzione dei dati</strong>. Durante l'annotazione, chiediamo a un LLM (Qwen3 8B) di produrre non solo gli intervalli di evidenziazione, ma anche l'intero ragionamento che li sottende. Questo segnale di ragionamento aggiuntivo produce una supervisione più accurata e coerente e migliora significativamente la qualità del modello risultante.</p>
<p>Ad alto livello, la pipeline di annotazione funziona come segue: <strong>ragionamento LLM → etichette di evidenziazione → filtraggio → campione di addestramento finale.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/pipeline_en_2e917fe1ce.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Questa struttura offre tre vantaggi concreti nella pratica:</p>
<ul>
<li><p><strong>Maggiore qualità dell'etichettatura</strong>: Il modello è spinto <em>prima</em> a <em>pensare e poi a rispondere</em>. Questa fase intermedia di ragionamento funge da autoverifica integrata, riducendo la probabilità di etichette superficiali o incoerenti.</p></li>
<li><p><strong>Migliore osservabilità e debuggabilità</strong>: Poiché ogni etichetta è accompagnata da una traccia di ragionamento, gli errori diventano visibili. In questo modo è più facile diagnosticare i casi di errore e regolare rapidamente i prompt, le regole o i filtri dei dati nella pipeline.</p></li>
<li><p><strong>Dati riutilizzabili</strong>: Le tracce di ragionamento forniscono un contesto prezioso per le future rietichettature. Quando i requisiti cambiano, gli stessi dati possono essere rivisti e perfezionati senza ricominciare da zero.</p></li>
</ul>
<p>Utilizzando questa pipeline, abbiamo generato più di un milione di campioni di formazione bilingue, suddivisi in modo approssimativo tra inglese e cinese.</p>
<p>Per l'addestramento del modello, siamo partiti da BGE-M3 Reranker v2 (0,6B parametri, finestra di contesto da 8.192 token), abbiamo adottato il framework di addestramento Open Provence e ci siamo addestrati per tre epoche su 8× GPU A100, completando l'addestramento in circa cinque ore.</p>
<p>Approfondiremo queste scelte tecniche - compreso il motivo per cui ci affidiamo alle tracce di ragionamento, come abbiamo selezionato il modello di base e come è stato costruito il set di dati - in un post successivo.</p>
<h2 id="Benchmarking-Zilliz’s-Bilingual-Semantic-Highlighting-Model" class="common-anchor-header">Analisi comparativa del modello di evidenziazione semantica bilingue di Zilliz<button data-href="#Benchmarking-Zilliz’s-Bilingual-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>Per valutare le prestazioni nel mondo reale, abbiamo valutato diversi modelli di evidenziazione semantica su una serie di set di dati diversi. I benchmark coprono scenari sia all'interno che all'esterno del dominio, in inglese e in cinese, per riflettere la varietà di contenuti incontrati nei sistemi di produzione.</p>
<h3 id="Datasets" class="common-anchor-header">Set di dati</h3><p>Per la nostra valutazione abbiamo utilizzato i seguenti set di dati:</p>
<ul>
<li><p><strong>MultiSpanQA (inglese)</strong> - un set di dati di risposta a domande multi-span nel dominio</p></li>
<li><p><strong>WikiText-2 (inglese)</strong> - un corpus di Wikipedia fuori dominio</p></li>
<li><p><strong>MultiSpanQA-ZH (cinese)</strong> - un set di dati cinese per la risposta a domande multi-span</p></li>
<li><p><strong>WikiText-2-ZH (cinese)</strong> - un corpus di Wikipedia cinese fuori dal dominio.</p></li>
</ul>
<h3 id="Models-Compared" class="common-anchor-header">Modelli a confronto</h3><p>I modelli inclusi nel confronto sono:</p>
<ul>
<li><p><strong>Modelli open Provence</strong></p></li>
<li><p><strong>Provence / XProvence</strong> (rilasciato da Naver)</p></li>
<li><p><strong>Evidenziatore semantico OpenSearch</strong></p></li>
<li><p><strong>Modello di evidenziazione semantica bilingue di Zilliz</strong></p></li>
</ul>
<h3 id="Results-and-Analysis" class="common-anchor-header">Risultati e analisi</h3><p><strong>Set di dati in inglese:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/en_dataset_fce4cbc747.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Dataset cinesi:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zh_dataset_ac7760e0b5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Su tutti i benchmark bilingue, il nostro modello raggiunge <strong>punteggi medi F1 all'avanguardia</strong>, superando tutti i modelli e gli approcci precedentemente valutati. I guadagni sono particolarmente pronunciati sui <strong>dataset cinesi</strong>, dove il nostro modello supera significativamente XProvence, l'unico altro modello valutato con supporto cinese.</p>
<p>Inoltre, il nostro modello offre prestazioni equilibrate sia in inglese che in cinese, una proprietà che le soluzioni esistenti faticano a raggiungere:</p>
<ul>
<li><p><strong>Open Provence</strong> supporta solo l'inglese</p></li>
<li><p><strong>XProvence</strong> sacrifica le prestazioni in inglese rispetto a Provence</p></li>
<li><p><strong>OpenSearch Semantic Highlighter</strong> non supporta il cinese e mostra una debole generalizzazione.</p></li>
</ul>
<p>Di conseguenza, il nostro modello evita i comuni compromessi tra copertura linguistica e prestazioni, rendendolo più adatto alle implementazioni bilingue del mondo reale.</p>
<h3 id="A-Concrete-Example-in-Practice" class="common-anchor-header">Un esempio concreto nella pratica</h3><p>Al di là dei punteggi dei benchmark, spesso è più rivelatore esaminare un esempio concreto. Il caso seguente mostra come si comporta il nostro modello in uno scenario reale di evidenziazione semantica e perché la precisione è importante.</p>
<p><strong>Interrogazione:</strong> Chi ha scritto il film <em>The Killing of a Sacred Deer</em>?</p>
<p><strong>Contesto (5 frasi):</strong></p>
<ol>
<li><p><em>The Killing of a Sacred Deer</em> è un film thriller psicologico del 2017 diretto da Yorgos Lanthimos, con la sceneggiatura scritta da Lanthimos e Efthymis Filippou.</p></li>
<li><p>Il film è interpretato da Colin Farrell, Nicole Kidman, Barry Keoghan, Raffey Cassidy, Sunny Suljic, Alicia Silverstone e Bill Camp.</p></li>
<li><p>La storia è basata sull'antica opera greca <em>Ifigenia in Aulis</em> di Euripide.</p></li>
<li><p>Il film segue un cardiochirurgo che stringe un'amicizia segreta con un adolescente legato al suo passato.</p></li>
<li><p>Egli presenta il ragazzo alla sua famiglia, dopodiché iniziano a verificarsi misteriose malattie.</p></li>
</ol>
<p><strong>Evidenziazione corretta:</strong> La<strong>frase 1</strong> è la risposta corretta, poiché afferma esplicitamente che la sceneggiatura è stata scritta da Yorgos Lanthimos e Efthymis Filippou.</p>
<p>Questo esempio contiene una sottile trappola. <strong>La frase 3</strong> cita Euripide, l'autore dell'opera originale greca su cui la storia è vagamente basata. Tuttavia, la domanda chiede chi ha scritto il <em>film</em>, non il materiale di partenza antico. La risposta corretta è quindi gli sceneggiatori del film, non il drammaturgo di migliaia di anni fa.</p>
<p><strong>Risultati:</strong></p>
<p>La tabella seguente riassume le prestazioni dei diversi modelli su questo esempio.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Modello</strong></th><th style="text-align:center"><strong>Risposta corretta identificata</strong></th><th style="text-align:center"><strong>Risultato</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>Il nostro (M3 bilingue)</strong></td><td style="text-align:center">✓</td><td style="text-align:center">Selezionato la frase 1 (corretta) e la frase 3</td></tr>
<tr><td style="text-align:center"><strong>XProvence v1</strong></td><td style="text-align:center">✗</td><td style="text-align:center">Ha selezionato solo la frase 3, non ha trovato la risposta corretta.</td></tr>
<tr><td style="text-align:center"><strong>XProvence v2</strong></td><td style="text-align:center">✗</td><td style="text-align:center">Ha selezionato solo la frase 3, non ha trovato la risposta corretta.</td></tr>
</tbody>
</table>
<p><strong>Confronto dei punteggi a livello di frase</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Frase</strong></th><th><strong>Nostro (bilingue M3)</strong></th><th style="text-align:center"><strong>XProvence v1</strong></th><th style="text-align:center"><strong>XProvence v2</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Frase 1 (sceneggiatura cinematografica, <strong>corretta</strong>)</td><td><strong>0.915</strong></td><td style="text-align:center">0.133</td><td style="text-align:center">0.081</td></tr>
<tr><td style="text-align:center">Frase 3 (opera teatrale originale, distrattore)</td><td>0.719</td><td style="text-align:center"><strong>0.947</strong></td><td style="text-align:center"><strong>0.802</strong></td></tr>
</tbody>
</table>
<p><strong>Dove XProvence fallisce</strong></p>
<ul>
<li><p>XProvence è fortemente attratto dalle parole chiave <em>"Euripide"</em> e <em>"scritto",</em> assegnando alla frase 3 un punteggio quasi perfetto (0,947 e 0,802).</p></li>
<li><p>Allo stesso tempo, ignora ampiamente la risposta corretta della frase 1, assegnando punteggi estremamente bassi (0,133 e 0,081).</p></li>
<li><p>Anche dopo aver abbassato la soglia decisionale da 0,5 a 0,2, il modello continua a non individuare la risposta corretta.</p></li>
</ul>
<p>In altre parole, il modello è guidato principalmente dalle associazioni di parole chiave a livello superficiale piuttosto che dall'intento effettivo della domanda.</p>
<p><strong>Come il nostro modello si comporta diversamente</strong></p>
<ul>
<li><p>Il nostro modello assegna un punteggio elevato (0,915) alla risposta corretta nella frase 1, identificando correttamente <em>gli sceneggiatori del film</em>.</p></li>
<li><p>Assegna anche un punteggio moderato (0,719) alla frase 3, poiché questa frase menziona un concetto legato alla sceneggiatura.</p></li>
<li><p>La separazione è chiara e significativa: <strong>0,915 vs. 0,719</strong>, un divario di quasi 0,2.</p></li>
</ul>
<p>Questo esempio evidenzia il punto di forza del nostro approccio: andare oltre le associazioni basate sulle parole chiave per interpretare correttamente l'intento dell'utente. Anche quando compaiono più concetti di "autore", il modello evidenzia in modo coerente quello a cui si riferisce effettivamente la domanda.</p>
<p>Condivideremo un rapporto di valutazione più dettagliato e altri casi di studio in un post successivo.</p>
<h2 id="Try-It-Out-and-Tell-Us-What-You-Think" class="common-anchor-header">Provatelo e diteci cosa ne pensate<button data-href="#Try-It-Out-and-Tell-Us-What-You-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>Abbiamo reso disponibile il nostro modello di evidenziazione semantica bilingue su <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">Hugging Face</a>, con tutti i pesi del modello disponibili pubblicamente, in modo che possiate iniziare subito a sperimentare. Ci piacerebbe sapere come funziona per voi: vi invitiamo a condividere qualsiasi feedback, problema o idea di miglioramento mentre lo provate.</p>
<p>Parallelamente, stiamo lavorando a un servizio di inferenza pronto per la produzione e all'integrazione del modello direttamente in <a href="https://milvus.io/">Milvus</a> come API nativa di Semantic Highlighting. Questa integrazione è già in corso e sarà presto disponibile.</p>
<p>L'evidenziazione semantica apre le porte a un'esperienza di RAG e AI agenziale più intuitiva. Quando Milvus recupera diversi documenti lunghi, il sistema è in grado di far emergere immediatamente le frasi più rilevanti, rendendo chiaro dove si trova la risposta. Questo non migliora solo l'esperienza dell'utente finale, ma aiuta anche gli sviluppatori a eseguire il debug delle pipeline di reperimento, mostrando esattamente su quali parti del contesto si basa il sistema.</p>
<p>Crediamo che l'evidenziazione semantica diventerà una funzionalità standard nei sistemi di ricerca e di RAG di prossima generazione. Se avete idee, suggerimenti o casi d'uso per l'evidenziazione semantica bilingue, iscrivetevi al nostro <a href="https://discord.com/invite/8uyFbECzPX">canale Discord</a> e condividete i vostri pensieri. Potete anche prenotare una sessione individuale di 20 minuti per ottenere approfondimenti, indicazioni e risposte alle vostre domande attraverso <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>.</p>
