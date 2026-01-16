---
id: llm-context-pruning-a-developers-guide-to-better-rag-and-agentic-ai-results.md
title: >-
  Potenziamento del contesto LLM: Una guida per gli sviluppatori per migliorare
  i risultati delle RAG e dell'IA agenziale
author: Cheney Zhang
date: 2026-01-15T00:00:00.000Z
cover: assets.zilliz.com/context_pruning_cover_d1b034ba67.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Context Pruning, RAG, long context LLMs, context engineering'
meta_title: |
  LLM Context Pruning: Improving RAG and Agentic AI Systems
desc: >-
  Scoprite come funziona il context pruning nei sistemi RAG a contesto lungo,
  perché è importante e come modelli come Provence consentono il filtraggio
  semantico e si comportano nella pratica.
origin: >-
  https://milvus.io/blog/llm-context-pruning-a-developers-guide-to-better-rag-and-agentic-ai-results.md
---
<p>Ultimamente le finestre di contesto negli LLM sono diventate enormi. Alcuni modelli possono accettare un milione di token o più in un singolo passaggio, e ogni nuova versione sembra aumentare questo numero. È entusiasmante, ma se avete costruito qualcosa che utilizza un contesto lungo, sapete che c'è un divario tra ciò che è <em>possibile</em> e ciò che è <em>utile</em>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/LLM_Leaderboard_7c64e4a18c.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Solo perché un modello <em>è in grado di</em> leggere un intero libro con un solo prompt, non significa che si debba darglielo. La maggior parte degli input lunghi sono pieni di cose di cui il modello non ha bisogno. Quando si iniziano a inserire centinaia di migliaia di token in un prompt, di solito si ottengono risposte più lente, costi di calcolo più elevati e talvolta risposte di qualità inferiore, perché il modello cerca di prestare attenzione a tutto contemporaneamente.</p>
<p>Quindi, anche se le finestre di contesto continuano a diventare più grandi, la vera domanda diventa: <strong>che cosa dobbiamo inserire?</strong> È qui che entra in gioco <strong>il Context Pruning</strong>. Si tratta fondamentalmente di tagliare le parti del contesto recuperato o assemblato che non aiutano il modello a rispondere alla domanda. Se fatto bene, mantiene il sistema veloce, stabile e molto più prevedibile.</p>
<p>In questo articolo parleremo del motivo per cui i contesti lunghi spesso si comportano in modo diverso da quanto ci si aspetterebbe, di come il pruning aiuti a tenere le cose sotto controllo e di come gli strumenti di pruning come <strong>Provence</strong> si inseriscano nelle pipeline RAG reali senza complicare la configurazione.</p>
<h2 id="Four-Common-Failure-Modes-in-Long-Context-Systems" class="common-anchor-header">Quattro modalità di fallimento comuni nei sistemi a contesto lungo<button data-href="#Four-Common-Failure-Modes-in-Long-Context-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>Una finestra di contesto più grande non rende magicamente il modello più intelligente. Anzi, una volta che si inizia a inserire una tonnellata di informazioni nel prompt, si apre una serie di nuovi modi in cui le cose possono andare storte. Ecco quattro problemi che si presentano di continuo quando si costruiscono sistemi a contesto lungo o RAG.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Four_Failure_Modes_e9b9bcb3b2.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="1-Context-Clash" class="common-anchor-header">1. Scontro tra contesti</h3><p>Lo scontro di contesto si verifica quando le informazioni accumulate in più turni diventano internamente contraddittorie.</p>
<p>Ad esempio, un utente potrebbe dire "mi piacciono le mele" all'inizio di una conversazione e successivamente affermare "non mi piace la frutta". Quando entrambe le affermazioni rimangono nel contesto, il modello non ha un modo affidabile per risolvere il conflitto, il che porta a risposte incoerenti o esitanti.</p>
<h3 id="2-Context-Confusion" class="common-anchor-header">2. Confusione del contesto</h3><p>La confusione del contesto si verifica quando il contesto contiene una grande quantità di informazioni irrilevanti o debolmente correlate, rendendo difficile per il modello selezionare l'azione o lo strumento corretto.</p>
<p>Questo problema è particolarmente visibile nei sistemi con strumenti. Quando il contesto è ingombro di dettagli non correlati, il modello può interpretare male l'intento dell'utente e selezionare lo strumento o l'azione sbagliata, non perché manchi l'opzione corretta, ma perché il segnale è sepolto dal rumore.</p>
<h3 id="3-Context-Distraction" class="common-anchor-header">3. Distrazione del contesto</h3><p>La distrazione da contesto si verifica quando un'eccessiva quantità di informazioni contestuali domina l'attenzione del modello, riducendo il suo affidamento sulla conoscenza preformata e sul ragionamento generale.</p>
<p>Invece di affidarsi a schemi ampiamente appresi, il modello dà troppo peso ai dettagli recenti del contesto, anche quando sono incompleti o inaffidabili. Questo può portare a un ragionamento superficiale o fragile, che rispecchia troppo da vicino il contesto invece di applicare una comprensione di livello superiore.</p>
<h3 id="4-Context-Poisoning" class="common-anchor-header">4. Avvelenamento del contesto</h3><p>L'avvelenamento del contesto si verifica quando le informazioni errate entrano nel contesto e vengono ripetutamente citate e rafforzate nel corso di più turni.</p>
<p>Una singola affermazione falsa introdotta all'inizio della conversazione può diventare la base del ragionamento successivo. Man mano che il dialogo prosegue, il modello si basa su questo presupposto errato, aggravando l'errore e allontanandosi ulteriormente dalla risposta corretta.</p>
<h2 id="What-Is-Context-Pruning-and-Why-It-Matters" class="common-anchor-header">Cos'è il Context Pruning e perché è importante<button data-href="#What-Is-Context-Pruning-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando si inizia ad avere a che fare con contesti lunghi, ci si rende subito conto che è necessario più di un trucco per tenere la situazione sotto controllo. Nei sistemi reali, i team di solito combinano un insieme di tattiche: RAG, loadout degli strumenti, riepilogo, messa in quarantena di determinati messaggi, scarico della vecchia cronologia e così via. Tutte aiutano in modi diversi. Ma il <strong>Context Pruning</strong> è quello che decide direttamente <em>cosa viene effettivamente fornito</em> al modello.</p>
<p>Il Context Pruning, in parole povere, è il processo di rimozione automatica delle informazioni irrilevanti, di basso valore o in conflitto prima che entrino nella finestra del contesto del modello. In pratica, si tratta di un filtro che mantiene solo le parti di testo più importanti per il compito corrente.</p>
<p>Altre strategie possono riorganizzare il contesto, comprimerlo o mettere da parte alcune parti per un secondo momento. Il pruning è più diretto: <strong>risponde alla domanda "Questa informazione deve essere inserita nel prompt?".</strong></p>
<p>Ecco perché il pruning diventa particolarmente importante nei sistemi RAG. La ricerca vettoriale è ottima, ma non è perfetta. Spesso restituisce una grande quantità di candidati, alcuni utili, altri vagamente correlati, altri ancora completamente fuori strada. Se si scaricano tutti nel prompt, si verificano le modalità di fallimento descritte in precedenza. Il pruning si colloca tra il recupero e il modello, agendo come un guardiano che decide quali pezzi conservare.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RAG_Pipeline_with_Context_Pruning_01a0d40819.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Quando il pruning funziona bene, i vantaggi si vedono subito: un contesto più pulito, risposte più coerenti, un minore utilizzo di token e meno effetti collaterali dovuti all'inserimento di testo irrilevante. Anche se non si cambia nulla dell'impostazione del reperimento, l'aggiunta di una solida fase di pruning può migliorare sensibilmente le prestazioni complessive del sistema.</p>
<p>In pratica, il pruning è una delle ottimizzazioni più utili in una pipeline long-context o RAG: idea semplice, grande impatto.</p>
<h2 id="Provence-A-Practical-Context-Pruning-Model" class="common-anchor-header">Provenza: Un modello pratico di potatura del contesto<button data-href="#Provence-A-Practical-Context-Pruning-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>Mentre esploravo gli approcci al context pruning, mi sono imbattuto in due interessanti modelli open-source sviluppati da <strong>Naver Labs Europe</strong>: <a href="https://huggingface.co/naver/provence-reranker-debertav3-v1"><strong>Provence</strong></a> e la sua variante multilingue, <a href="https://huggingface.co/naver/xprovence-reranker-bgem3-v1"><strong>XProvence</strong></a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/provence1_b9d2c43276.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Provence è un metodo per l'addestramento di un modello leggero di context pruning per la generazione aumentata dal reperimento, con particolare attenzione alla risposta alle domande. Data una domanda dell'utente e un brano recuperato, il modello identifica e rimuove le frasi irrilevanti, mantenendo solo le informazioni che contribuiscono alla risposta finale.</p>
<p>Tagliando i contenuti di scarso valore prima della generazione, Provence riduce il rumore nell'input del modello, accorcia le richieste e riduce la latenza dell'inferenza LLM. Inoltre, è plug-and-play e funziona con qualsiasi sistema LLM o di retrieval senza richiedere una stretta integrazione o modifiche architettoniche.</p>
<p>Provence offre diverse caratteristiche pratiche per le pipeline RAG del mondo reale.</p>
<p><strong>1. Comprensione a livello di documento</strong></p>
<p>Provence analizza i documenti nel loro complesso, anziché valutare le frasi in modo isolato. Questo è importante perché i documenti del mondo reale contengono spesso riferimenti come "it", "this" o "the method above". Da sole, queste frasi possono essere ambigue o addirittura prive di significato. Se considerate nel contesto, la loro rilevanza diventa chiara. Modellando il documento in modo olistico, Provence produce decisioni di potatura più accurate e coerenti.</p>
<p><strong>2. Selezione adattiva delle frasi</strong></p>
<p>Provence determina automaticamente il numero di frasi da conservare in un documento recuperato. Invece di affidarsi a regole fisse come "mantenere le prime cinque frasi", si adatta alla domanda e al contenuto.</p>
<p>Ad alcune domande si può rispondere con una sola frase, mentre altre richiedono più affermazioni di supporto. Provence gestisce questa variazione in modo dinamico, utilizzando una soglia di rilevanza che funziona bene in tutti i domini e che può essere regolata quando necessario, senza alcuna regolazione manuale nella maggior parte dei casi.</p>
<p><strong>3. Alta efficienza con il reranking integrato</strong></p>
<p>Provence è stato progettato per essere efficiente. Si tratta di un modello compatto e leggero, che lo rende significativamente più veloce ed economico da eseguire rispetto agli approcci di pruning basati su LLM.</p>
<p>Inoltre, Provence è in grado di combinare il reranking e il context pruning in un unico passaggio. Poiché il reranking è già una fase standard delle moderne pipeline RAG, l'integrazione del pruning a questo punto rende il costo aggiuntivo del context pruning prossimo allo zero, migliorando comunque la qualità del contesto passato al modello linguistico.</p>
<p><strong>4. Supporto multilingue tramite XProvence</strong></p>
<p>Provence ha anche una variante chiamata XProvence, che utilizza la stessa architettura ma è addestrata su dati multilingue. Ciò gli consente di valutare query e documenti in diverse lingue, come il cinese, l'inglese e il coreano, rendendolo adatto ai sistemi RAG multilingue e interlinguistici.</p>
<h3 id="How-Provence-Is-Trained" class="common-anchor-header">Come viene addestrato Provence</h3><p>Provence utilizza un design di addestramento pulito ed efficace, basato su un'architettura cross-encoder. Durante l'addestramento, l'interrogazione e ogni brano recuperato vengono concatenati in un unico input e codificati insieme. Ciò consente al modello di osservare l'intero contesto della domanda e del brano in una sola volta e di ragionare direttamente sulla loro rilevanza.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/provence2_80523f7a9e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Questa codifica congiunta consente a Provence di apprendere da segnali di rilevanza a grana fine. Il modello è stato messo a punto su <a href="https://zilliz.com/ai-faq/what-is-the-difference-between-bert-roberta-and-deberta-for-embeddings"><strong>DeBERTa</strong></a> come codificatore leggero e ottimizzato per svolgere due compiti contemporaneamente:</p>
<ol>
<li><p><strong>Punteggio di rilevanza a livello di documento (rerank score):</strong> Il modello predice un punteggio di rilevanza per l'intero documento, che indica la corrispondenza con la query. Ad esempio, un punteggio di 0,8 rappresenta una forte rilevanza.</p></li>
<li><p><strong>Etichettatura della rilevanza a livello di token (maschera binaria):</strong> In parallelo, il modello assegna un'etichetta binaria a ciascun token, indicando se è rilevante (<code translate="no">1</code>) o irrilevante (<code translate="no">0</code>) per la query.</p></li>
</ol>
<p>Di conseguenza, il modello addestrato è in grado di valutare la rilevanza complessiva di un documento e di identificare quali parti dovrebbero essere mantenute o rimosse.</p>
<p>Al momento dell'inferenza, Provence predice le etichette di rilevanza a livello di token. Queste previsioni vengono poi aggregate a livello di frase: una frase viene mantenuta se contiene più token rilevanti di quelli irrilevanti, altrimenti viene eliminata. Poiché il modello è addestrato con una supervisione a livello di frase, le previsioni dei token all'interno della stessa frase tendono a essere coerenti, rendendo questa strategia di aggregazione affidabile nella pratica. Il comportamento di potatura può anche essere regolato regolando la soglia di aggregazione per ottenere una potatura più conservativa o più aggressiva.</p>
<p>È importante notare che Provence riutilizza la fase di reranking che la maggior parte delle pipeline RAG già include. Ciò significa che la potatura del contesto può essere aggiunta con un overhead minimo o nullo, rendendo Provence particolarmente pratico per i sistemi RAG del mondo reale.</p>
<h2 id="Evaluating-Context-Pruning-Performance-Across-Models" class="common-anchor-header">Valutazione delle prestazioni del context pruning tra i vari modelli<button data-href="#Evaluating-Context-Pruning-Performance-Across-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>Finora ci siamo concentrati sulla progettazione e sull'addestramento di Provence. Il passo successivo è quello di valutare le sue prestazioni nella pratica: quanto bene pota il contesto, come si confronta con altri approcci e come si comporta in condizioni reali.</p>
<p>Per rispondere a queste domande, abbiamo progettato una serie di esperimenti quantitativi per confrontare la qualità della potatura del contesto tra più modelli in contesti di valutazione realistici.</p>
<p>Gli esperimenti si concentrano su due obiettivi principali:</p>
<ul>
<li><p><strong>Efficacia della potatura:</strong> Misuriamo l'accuratezza con cui ogni modello conserva i contenuti rilevanti rimuovendo le informazioni irrilevanti, utilizzando metriche standard come precisione, richiamo e punteggio F1.</p></li>
<li><p><strong>Generalizzazione fuori dal dominio:</strong> Valutiamo il rendimento di ciascun modello su distribuzioni di dati diverse da quelle di addestramento, valutando la robustezza in scenari fuori dal dominio.</p></li>
</ul>
<h3 id="Models-Compared" class="common-anchor-header">Modelli a confronto</h3><ul>
<li><p><a href="https://huggingface.co/naver/provence-reranker-debertav3-v1"><strong>Provenza</strong></a></p></li>
<li><p><a href="https://huggingface.co/naver/xprovence-reranker-bgem3-v1"><strong>XProvence</strong></a></p></li>
<li><p><a href="https://huggingface.co/opensearch-project/opensearch-semantic-highlighter-v1"><strong>OpenSearch Semantic Highlighter</strong></a> (un modello di pruning basato su un'architettura BERT, progettato specificamente per compiti di evidenziazione semantica)</p></li>
</ul>
<h3 id="Dataset" class="common-anchor-header">Set di dati</h3><p>Come dataset di valutazione utilizziamo WikiText-2. WikiText-2 deriva da articoli di Wikipedia e contiene diverse strutture di documenti, in cui le informazioni rilevanti sono spesso distribuite su più frasi e le relazioni semantiche possono essere non banali.</p>
<p>È importante notare che WikiText-2 differisce in modo sostanziale dai dati tipicamente utilizzati per addestrare i modelli di potatura del contesto, pur assomigliando a contenuti del mondo reale e ricchi di conoscenza. Questo lo rende adatto alla valutazione fuori dal dominio, che è uno degli obiettivi principali dei nostri esperimenti.</p>
<h3 id="Query-Generation-and-Annotation" class="common-anchor-header">Generazione di query e annotazione</h3><p>Per costruire un compito di pruning fuori dal dominio, abbiamo generato automaticamente coppie domanda-risposta dal corpus grezzo di WikiText-2 utilizzando <strong>GPT-4o-mini</strong>. Ogni campione di valutazione è costituito da tre componenti:</p>
<ul>
<li><p><strong>Domanda:</strong> Una domanda in linguaggio naturale generata dal documento.</p></li>
<li><p><strong>Contesto:</strong> Il documento completo, non modificato.</p></li>
<li><p><strong>Ground Truth:</strong> annotazioni a livello di frase che indicano quali frasi contengono la risposta (da mantenere) e quali sono irrilevanti (da eliminare).</p></li>
</ul>
<p>Questa impostazione definisce naturalmente un compito di potatura del contesto: data una query e un documento completo, il modello deve identificare le frasi che hanno effettivamente importanza. Le frasi che contengono la risposta sono etichettate come rilevanti e devono essere mantenute, mentre tutte le altre frasi sono trattate come irrilevanti e devono essere eliminate. Questa formulazione consente di misurare quantitativamente la qualità del pruning con precisione, richiamo e punteggio F1.</p>
<p>È fondamentale che le domande generate non compaiano nei dati di addestramento di nessun modello valutato. Di conseguenza, le prestazioni riflettono la vera generalizzazione piuttosto che la memorizzazione. In totale, abbiamo generato 300 campioni, che spaziano da semplici domande basate sui fatti, a compiti di ragionamento multi-hop e a richieste analitiche più complesse, per riflettere meglio i modelli di utilizzo del mondo reale.</p>
<h3 id="Evaluation-Pipeline" class="common-anchor-header">Linea di valutazione</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/pipeline_77e52002fc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ottimizzazione degli iperparametri: Per ogni modello, eseguiamo una ricerca a griglia su uno spazio di iperparametri predefinito e selezioniamo la configurazione che massimizza il punteggio F1.</p>
<h3 id="Results-and-Analysis" class="common-anchor-header">Risultati e analisi</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/result_0df098152a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>I risultati rivelano chiare differenze di prestazioni tra i tre modelli.</p>
<p><strong>Provence</strong> ottiene le migliori prestazioni complessive, con un <strong>punteggio F1 del 66,76%</strong>. La precisione<strong>(69,53%</strong>) e il richiamo<strong>(64,19%</strong>) sono ben bilanciati, il che indica una robusta generalizzazione al di fuori del dominio. La configurazione ottimale utilizza una soglia di potatura di <strong>0,6</strong> e <strong>α = 0,051</strong>, suggerendo che i punteggi di rilevanza del modello sono ben calibrati e che il comportamento di potatura è intuitivo e facile da regolare nella pratica.</p>
<p><strong>XProvence</strong> raggiunge un <strong>punteggio F1 del 58,97%</strong>, caratterizzato da <strong>un elevato richiamo (75,52%)</strong> e una <strong>minore precisione (48,37%)</strong>. Ciò riflette una strategia di potatura più conservativa, che privilegia la conservazione delle informazioni potenzialmente rilevanti rispetto alla rimozione aggressiva del rumore. Questo comportamento può essere auspicabile in ambiti in cui i falsi negativi sono costosi, come le applicazioni sanitarie o legali, ma aumenta anche i falsi positivi, riducendo la precisione. Nonostante questo compromesso, la capacità multilingue di XProvence lo rende un'opzione valida per i contesti non inglesi o multilingue.</p>
<p>Al contrario, <strong>OpenSearch Semantic Highlighter</strong> ottiene risultati sostanzialmente peggiori, con un <strong>punteggio F1 del 46,37%</strong> (Precision <strong>62,35%</strong>, Recall <strong>36,98%</strong>). Il divario rispetto a Provence e XProvence indica limiti nella calibrazione del punteggio e nella generalizzazione fuori dal dominio, soprattutto in condizioni fuori dal dominio.</p>
<h2 id="Semantic-Highlighting-Another-Way-to-Find-What-Actually-Matters-in-Text" class="common-anchor-header">Evidenziazione semantica: Un altro modo per trovare ciò che conta davvero nel testo<button data-href="#Semantic-Highlighting-Another-Way-to-Find-What-Actually-Matters-in-Text" class="anchor-icon" translate="no">
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
    </button></h2><p>Dopo aver parlato di potatura del contesto, vale la pena di esaminare un pezzo del puzzle correlato: l'<a href="https://milvus.io/blog/zilliz-trained-and-open-sourced-bilingual-semantic-highlighting-model-for-production-ai.md"><strong>evidenziazione semantica</strong></a>. Tecnicamente, entrambe le funzioni svolgono quasi lo stesso lavoro: assegnano un punteggio alle parti di testo in base alla loro rilevanza per una query. La differenza sta nel modo in cui il risultato viene utilizzato nella pipeline.</p>
<p>La maggior parte delle persone sente parlare di "evidenziazione" e pensa ai classici evidenziatori di parole chiave che si vedono in Elasticsearch o Solr. Questi strumenti cercano fondamentalmente le corrispondenze letterali delle parole chiave e le avvolgono in qualcosa come <code translate="no">&lt;em&gt;</code>. Sono economici e prevedibili, ma funzionano solo quando il testo utilizza <em>esattamente</em> le stesse parole della query. Se il documento parafrasa, usa sinonimi o formula l'idea in modo diverso, gli evidenziatori tradizionali non la colgono completamente.</p>
<p><strong>L'evidenziazione semantica segue una strada diversa.</strong> Invece di verificare le corrispondenze esatte tra le stringhe, utilizza un modello per stimare la somiglianza semantica tra la query e le diverse parti del testo. Questo permette di evidenziare i contenuti rilevanti anche quando la formulazione è completamente diversa. Per le pipeline RAG, i flussi di lavoro ad agenti o qualsiasi sistema di ricerca AI in cui il significato conta più dei token, l'evidenziazione semantica offre un quadro molto più chiaro del <em>motivo per cui</em> un documento è stato recuperato.</p>
<p>Il problema è che la maggior parte delle soluzioni di evidenziazione semantica esistenti non sono costruite per carichi di lavoro AI di produzione. Abbiamo testato tutte le soluzioni disponibili e nessuna ci ha fornito il livello di precisione, latenza e affidabilità multilingue di cui avevamo bisogno per i sistemi RAG e ad agenti reali. Così abbiamo finito per addestrare e rendere open-sourcing il nostro modello: <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a>.</p>
<p>Ad alto livello, il <strong>context pruning e l'evidenziazione semantica risolvono lo stesso compito fondamentale</strong>: data una query e un pezzo di testo, capire quali parti sono effettivamente importanti. L'unica differenza è ciò che accade dopo.</p>
<ul>
<li><p><strong>Il context pruning</strong> elimina le parti irrilevanti prima della generazione.</p></li>
<li><p>L<strong>'evidenziazione semantica</strong> mantiene il testo completo, ma fa emergere visivamente le parti importanti.</p></li>
</ul>
<p>Poiché l'operazione sottostante è così simile, spesso lo stesso modello può alimentare entrambe le funzioni. In questo modo è più facile riutilizzare i componenti in tutto lo stack e il sistema RAG rimane complessivamente più semplice ed efficiente.</p>
<h3 id="Semantic-Highlighting-in-Milvus-and-Zilliz-Cloud" class="common-anchor-header">Evidenziazione semantica in Milvus e Zilliz Cloud</h3><p>L'evidenziazione semantica è ora pienamente supportata in <a href="https://milvus.io">Milvus</a> e <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a> (il servizio completamente gestito di Milvus) e si sta già rivelando utile per chiunque lavori con RAG o con la ricerca guidata dall'intelligenza artificiale. La funzione risolve un problema molto semplice ma doloroso: quando la ricerca vettoriale restituisce una tonnellata di pezzi, come si fa a capire rapidamente <em>quali frasi all'interno di quei pezzi sono effettivamente importanti</em>?</p>
<p>Senza l'evidenziazione, gli utenti finiscono per leggere interi documenti solo per capire perché qualcosa è stato recuperato. Con l'evidenziazione semantica incorporata, Milvus e Zilliz Cloud contrassegnano automaticamente gli intervalli specifici che sono semanticamente correlati alla query, anche se la formulazione è diversa. Non è più necessario andare a caccia di corrispondenze di parole chiave o indovinare il motivo per cui un pezzo è stato trovato.</p>
<p>Questo rende il recupero molto più trasparente. Invece di restituire solo "documenti rilevanti", Milvus mostra <em>dove</em> risiede la rilevanza. Per le pipeline RAG, questo è particolarmente utile, perché è possibile vedere immediatamente a cosa dovrebbe assistere il modello, rendendo molto più semplice il debugging e la costruzione di prompt.</p>
<p>Abbiamo integrato questo supporto direttamente in Milvus e Zilliz Cloud, in modo che non dobbiate aggiungere modelli esterni o eseguire un altro servizio solo per ottenere un'attribuzione utilizzabile. Tutto viene eseguito all'interno del percorso di recupero: ricerca vettoriale → punteggio di rilevanza → intervalli evidenziati. Funziona su scala immediata e supporta carichi di lavoro multilingue con il nostro modello <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a>.</p>
<h2 id="Looking-Ahead" class="common-anchor-header">Guardando al futuro<button data-href="#Looking-Ahead" class="anchor-icon" translate="no">
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
    </button></h2><p>L'ingegneria del contesto è ancora piuttosto nuova e c'è ancora molto da capire. Anche se il pruning e l'evidenziazione semantica funzionano bene all'interno di <a href="https://milvus.io">Milvus</a> e <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a><strong>,</strong> non siamo vicini alla fine della storia. Ci sono molte aree che necessitano ancora di un vero lavoro di ingegneria: rendere i modelli di potatura più accurati senza rallentare le cose, migliorare la gestione di query strane o fuori dal dominio e collegare tutti i pezzi insieme in modo che retrieval → rerank → prune → highlight sembrino un'unica pipeline pulita invece di un insieme di hack incollati insieme.</p>
<p>Con la crescita delle finestre di contesto, queste decisioni diventano sempre più importanti. Una buona gestione del contesto non è più un "bel bonus", ma sta diventando una parte fondamentale per rendere affidabili i sistemi a contesto lungo e RAG.</p>
<p>Continueremo a sperimentare, a fare benchmarking e a distribuire i pezzi che fanno davvero la differenza per gli sviluppatori. L'obiettivo è semplice: rendere più facile la creazione di sistemi che non si rompano in presenza di dati disordinati, query imprevedibili o carichi di lavoro su larga scala.</p>
<p>Se volete parlare di tutto questo, o semplicemente avete bisogno di aiuto per il debug, potete collegarvi al nostro <a href="https://discord.com/invite/8uyFbECzPX">canale Discord</a> o prenotare una sessione individuale di 20 minuti per ottenere approfondimenti, indicazioni e risposte alle vostre domande attraverso<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
<p>Siamo sempre felici di chiacchierare e scambiare appunti con altri costruttori.</p>
