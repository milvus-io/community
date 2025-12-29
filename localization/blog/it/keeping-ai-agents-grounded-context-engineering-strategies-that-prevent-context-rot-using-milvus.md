---
id: >-
  keeping-ai-agents-grounded-context-engineering-strategies-that-prevent-context-rot-using-milvus.md
title: >-
  Mantenere gli agenti AI a terra: Strategie di ingegneria del contesto che
  prevengono il marciume del contesto usando Milvus
author: Min Yin
date: 2025-12-23T00:00:00.000Z
cover: assets.zilliz.com/context_rot_cover_804387e7c9.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'context engineering, context rot, vector database, Milvus, vector search'
meta_title: |
  Context Engineering Strategies to Prevent LLM Context Rot with Milvus
desc: >-
  Scoprite perché la rotazione del contesto avviene nei flussi di lavoro LLM di
  lunga durata e come l'ingegneria del contesto, le strategie di recupero e la
  ricerca vettoriale di Milvus aiutano a mantenere gli agenti AI precisi,
  concentrati e affidabili in attività complesse in più fasi.
origin: >-
  https://milvus.io/blog/keeping-ai-agents-grounded-context-engineering-strategies-that-prevent-context-rot-using-milvus.md
---
<p>Se avete lavorato a conversazioni LLM di lunga durata, probabilmente avete vissuto questo momento di frustrazione: a metà di una lunga discussione, il modello inizia ad andare alla deriva. Le risposte diventano vaghe, il ragionamento si indebolisce e i dettagli chiave scompaiono misteriosamente. Ma se si inserisce la stessa identica richiesta in una nuova chat, improvvisamente il modello si comporta in modo concentrato, accurato, concreto.</p>
<p>Non si tratta di "stanchezza" del modello, ma di un'<strong>alterazione del contesto</strong>. Man mano che una conversazione cresce, il modello deve destreggiarsi tra più informazioni e la sua capacità di stabilire le priorità diminuisce lentamente. <a href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents">Gli studi di Antropic</a> mostrano che quando le finestre di contesto passano da circa 8K token a 128K, l'accuratezza del recupero può diminuire del 15-30%. Il modello ha ancora spazio, ma perde di vista ciò che conta. Finestre di contesto più grandi aiutano a ritardare il problema, ma non lo eliminano.</p>
<p>È qui che entra in gioco l <strong>'ingegneria del contesto</strong>. Invece di dare al modello tutto in una volta, modifichiamo ciò che vede: recuperando solo i pezzi che contano, comprimendo ciò che non ha più bisogno di essere verboso e mantenendo i prompt e gli strumenti abbastanza puliti da permettere al modello di ragionarci sopra. L'obiettivo è semplice: rendere disponibili le informazioni importanti al momento giusto e ignorare il resto.</p>
<p>Il recupero gioca un ruolo centrale in questo senso, soprattutto per gli agenti di lunga durata. I database vettoriali come <a href="https://milvus.io/"><strong>Milvus</strong></a> forniscono le fondamenta per recuperare in modo efficiente la conoscenza pertinente nel contesto, consentendo al sistema di rimanere ancorato alla base anche quando i compiti crescono in profondità e complessità.</p>
<p>In questo blog analizzeremo come avviene la rotazione del contesto, le strategie che i team utilizzano per gestirla e i modelli architettonici - dal reperimento alla progettazione dei prompt - che consentono agli agenti di intelligenza artificiale di mantenere la lucidità nei flussi di lavoro lunghi e in più fasi.</p>
<h2 id="Why-Context-Rot-Happens" class="common-anchor-header">Perché si verifica la rotazione del contesto<button data-href="#Why-Context-Rot-Happens" class="anchor-icon" translate="no">
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
    </button></h2><p>Spesso si pensa che fornire a un modello di intelligenza artificiale un contesto più ampio porti naturalmente a risposte migliori. Ma in realtà non è così. Anche gli esseri umani hanno difficoltà a gestire input lunghi: la scienza cognitiva suggerisce che la nostra memoria di lavoro contiene circa <strong>7±2 pezzi di</strong> informazioni. Se ci spingiamo oltre, iniziamo a dimenticare, confondere o interpretare male i dettagli.</p>
<p>Gli LLM mostrano un comportamento simile, ma su scala molto più ampia e con modalità di fallimento più drammatiche.</p>
<p>Il problema principale deriva dall'<a href="https://zilliz.com/learn/decoding-transformer-models-a-study-of-their-architecture-and-underlying-principles">architettura</a> stessa di <a href="https://zilliz.com/learn/decoding-transformer-models-a-study-of-their-architecture-and-underlying-principles">Transformer</a>. Ogni token deve confrontarsi con ogni altro token, formando un'attenzione a coppie sull'intera sequenza. Ciò significa che la computazione cresce <strong>O(n²)</strong> con la lunghezza del contesto. Espandere il prompt da 1K token a 100K non fa sì che il modello "lavori di più", ma moltiplica il numero di interazioni tra i token di <strong>10.000×</strong>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/contextual_dilution_622033db72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>C'è poi il problema dei dati di addestramento.</strong> I modelli vedono molte più sequenze brevi che lunghe. Quindi, quando si chiede a un LLM di operare in contesti estremamente ampi, lo si spinge in un regime per il quale non è stato addestrato. In pratica, il ragionamento su contesti molto lunghi è spesso <strong>fuori distribuzione</strong> per la maggior parte dei modelli.</p>
<p>Nonostante questi limiti, i contesti lunghi sono ormai inevitabili. Le prime applicazioni di LLM erano per lo più compiti a turno singolo: classificazione, riassunto o semplice generazione. Oggi, oltre il 70% dei sistemi di intelligenza artificiale aziendali si basa su agenti che rimangono attivi per molti cicli di interazione, spesso per ore, gestendo flussi di lavoro ramificati e in più fasi. Le sessioni di lunga durata sono passate da eccezione a regola d'arte.</p>
<p>La domanda successiva è: <strong>come mantenere viva l'attenzione del modello senza sovraccaricarlo?</strong></p>
<h2 id="Context-Retrieval-Approaches-to-Solving-Context-Rot" class="common-anchor-header">Approcci di recupero del contesto per risolvere il problema del Context Rot<button data-href="#Context-Retrieval-Approaches-to-Solving-Context-Rot" class="anchor-icon" translate="no">
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
    </button></h2><p>Il recupero è una delle leve più efficaci per combattere il marciume del contesto e, nella pratica, tende a manifestarsi in modelli complementari che affrontano il marciume del contesto da diverse angolazioni.</p>
<h3 id="1-Just-in-Time-Retrieval-Reducing-Unnecessary-Context" class="common-anchor-header">1. Recupero just-in-time: Ridurre il contesto non necessario</h3><p>Una delle cause principali del context rot è il <em>sovraccarico</em> del modello con informazioni di cui non ha ancora bisogno. Claude Code, l'assistente di codifica di Anthropic, risolve questo problema con il <strong>recupero Just-in-Time (JIT)</strong>, una strategia in cui il modello recupera le informazioni solo quando sono rilevanti.</p>
<p>Invece di inserire intere basi di codice o insiemi di dati nel suo contesto (il che aumenta notevolmente la possibilità di deriva e dimenticanza), Claude Code mantiene un piccolo indice: percorsi di file, comandi e link alla documentazione. Quando il modello ha bisogno di un'informazione, recupera quell'elemento specifico e lo inserisce nel contesto nel <strong>momento in</strong>cui <strong>è importante, non</strong>prima.</p>
<p>Ad esempio, se chiedete a Claude Code di analizzare un database di 10 GB, non cercherà mai di caricarlo tutto. Lavora più come un ingegnere:</p>
<ol>
<li><p>Esegue una query SQL per ottenere sintesi di alto livello del set di dati.</p></li>
<li><p>Utilizza comandi come <code translate="no">head</code> e <code translate="no">tail</code> per visualizzare i dati di esempio e comprenderne la struttura.</p></li>
<li><p>Conserva solo le informazioni più importanti, come le statistiche chiave o le righe di esempio, all'interno del contesto.</p></li>
</ol>
<p>Riducendo al minimo ciò che viene conservato nel contesto, il recupero JIT evita l'accumulo di token irrilevanti che causano il marciume. Il modello rimane concentrato perché vede solo le informazioni necessarie per la fase di ragionamento corrente.</p>
<h3 id="2-Pre-retrieval-Vector-Search-Preventing-Context-Drift-Before-It-Starts" class="common-anchor-header">2. Pre-recupero (ricerca vettoriale): Prevenire la deriva del contesto prima che cominci</h3><p>A volte il modello non può "chiedere" informazioni in modo dinamico: l'assistenza clienti, i sistemi di domande e risposte e i flussi di lavoro degli agenti hanno spesso bisogno di avere a disposizione le conoscenze giuste <em>prima dell'</em> inizio della generazione. È qui che <strong>il pre-recupero</strong> diventa fondamentale.</p>
<p>La rotazione del contesto avviene spesso perché al modello viene consegnata una grande pila di testo grezzo e ci si aspetta che selezioni ciò che conta. Il pre-recupero ribalta la situazione: un database vettoriale (come <a href="https://milvus.io/">Milvus</a> e <a href="https://zilliz.com/cloud">Zilliz Cloud</a>) identifica i pezzi più rilevanti <em>prima dell'</em> inferenza, assicurando che solo il contesto di alto valore raggiunga il modello.</p>
<p>In una tipica configurazione RAG:</p>
<ul>
<li><p>I documenti sono incorporati e memorizzati in un database vettoriale, come Milvus.</p></li>
<li><p>Al momento dell'interrogazione, il sistema recupera un piccolo insieme di pezzi altamente rilevanti attraverso ricerche di similarità.</p></li>
<li><p>Solo questi pezzi vengono inseriti nel contesto del modello.</p></li>
</ul>
<p>In questo modo si evita il marciume in due modi:</p>
<ul>
<li><p><strong>Riduzione del rumore: il</strong> testo irrilevante o debolmente correlato non entra mai nel contesto.</p></li>
<li><p><strong>Efficienza:</strong> i modelli elaborano un numero molto inferiore di token, riducendo la possibilità di perdere traccia di dettagli essenziali.</p></li>
</ul>
<p>Milvus è in grado di ricercare milioni di documenti in millisecondi, rendendo questo approccio ideale per i sistemi live in cui la latenza è importante.</p>
<h3 id="3-Hybrid-JIT-and-Vector-Retrieval" class="common-anchor-header">3. Recupero ibrido JIT e vettoriale</h3><p>Il pre-recupero basato sulla ricerca vettoriale risolve una parte significativa della rotazione del contesto, garantendo che il modello parta da informazioni ad alto segnale piuttosto che da testo grezzo e sovradimensionato. Ma Anthropic mette in evidenza due sfide reali che i team spesso trascurano:</p>
<ul>
<li><p><strong>La tempestività:</strong> Se la base di conoscenza si aggiorna più velocemente di quanto venga ricostruito l'indice vettoriale, il modello può basarsi su informazioni obsolete.</p></li>
<li><p><strong>Accuratezza:</strong> prima dell'inizio di un'attività, è difficile prevedere con precisione ciò di cui il modello avrà bisogno, soprattutto nel caso di flussi di lavoro multi-fase o esplorativi.</p></li>
</ul>
<p>Per questo motivo, nei carichi di lavoro del mondo reale, un'applicazione ibrida è la soluzione ottimale.</p>
<ul>
<li><p>Ricerca vettoriale di conoscenze stabili e ad alta affidabilità</p></li>
<li><p>Esplorazione JIT guidata dagli agenti per le informazioni che si evolvono o che diventano rilevanti solo a metà dell'attività.</p></li>
</ul>
<p>Combinando questi due approcci, si ottiene la velocità e l'efficienza del recupero vettoriale per le informazioni note e la flessibilità del modello per scoprire e caricare nuovi dati ogni volta che diventano rilevanti.</p>
<p>Vediamo come funziona in un sistema reale. Prendiamo ad esempio un assistente alla documentazione di produzione. La maggior parte dei team alla fine sceglie una pipeline a due fasi: Ricerca vettoriale alimentata da Milvus + recupero JIT basato su agenti.</p>
<p><strong>1. Ricerca vettoriale alimentata da Milvus (pre-recupero)</strong></p>
<ul>
<li><p>Convertire la documentazione, i riferimenti API, i changelog e i problemi noti in embeddings.</p></li>
<li><p>Memorizzateli nel database vettoriale di Milvus con metadati come l'area del prodotto, la versione e l'ora di aggiornamento.</p></li>
<li><p>Quando un utente fa una domanda, eseguite una ricerca semantica per prendere i primi K segmenti pertinenti.</p></li>
</ul>
<p>Questo risolve circa l'80% delle domande di routine in meno di 500 ms, dando al modello un punto di partenza forte e resistente al contesto.</p>
<p><strong>2. Esplorazione basata su agenti</strong></p>
<p>Quando il reperimento iniziale non è sufficiente, ad esempio quando l'utente chiede qualcosa di molto specifico o sensibile al tempo, l'agente può chiamare strumenti per ottenere nuove informazioni:</p>
<ul>
<li><p>Utilizzare <code translate="no">search_code</code> per individuare funzioni o file specifici nella base di codice.</p></li>
<li><p>Utilizzare <code translate="no">run_query</code> per prelevare dati in tempo reale dal database.</p></li>
<li><p>Utilizzare <code translate="no">fetch_api</code> per ottenere lo stato più recente del sistema</p></li>
</ul>
<p>Queste chiamate richiedono in genere <strong>3-5 secondi</strong>, ma assicurano che il modello funzioni sempre con dati freschi, accurati e pertinenti, anche per le domande che il sistema non poteva prevedere in anticipo.</p>
<p>Questa struttura ibrida garantisce che il contesto rimanga tempestivo, corretto e specifico per l'attività, riducendo drasticamente il rischio di rotazione del contesto nei flussi di lavoro degli agenti di lunga durata.</p>
<p>Milvus è particolarmente efficace in questi scenari ibridi perché supporta:</p>
<ul>
<li><p><strong>Ricerca vettoriale + filtraggio scalare</strong>, che combina la rilevanza semantica con vincoli strutturati.</p></li>
<li><p><strong>Aggiornamenti incrementali</strong>, che consentono di rinfrescare le incorporazioni senza tempi morti.</p></li>
</ul>
<p>Questo fa di Milvus la spina dorsale ideale per i sistemi che necessitano sia di una comprensione semantica che di un controllo preciso su ciò che viene recuperato.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_in_hybrid_architecture_7d4e391aa4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ad esempio, si potrebbe eseguire una query come:</p>
<pre><code translate="no"><span class="hljs-comment"># You can combine queries like this in Milvus</span>
collection.search(
    data=[query_embedding],  <span class="hljs-comment"># Semantic similarity</span>
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    expr=<span class="hljs-string">&quot;doc_type == &#x27;API&#x27; and update_time &gt; &#x27;2025-01-01&#x27;&quot;</span>,  <span class="hljs-comment"># Structured filtering</span>
    limit=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Choose-the-Right-Approach-for-Dealing-With-Context-Rot" class="common-anchor-header">Come scegliere l'approccio giusto per gestire il Context Rot<button data-href="#How-to-Choose-the-Right-Approach-for-Dealing-With-Context-Rot" class="anchor-icon" translate="no">
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
    </button></h2><p>Con il pre-recupero a ricerca vettoriale, il reperimento Just-in-Time e il reperimento ibrido, la domanda naturale è: <strong>quale utilizzare?</strong></p>
<p>Ecco un modo semplice ma pratico per scegliere, in base alla <em>stabilità</em> delle conoscenze e alla <em>prevedibilità</em> delle esigenze informative del modello.</p>
<h3 id="1-Vector-Search-→-Best-for-Stable-Domains" class="common-anchor-header">1. Ricerca vettoriale → migliore per i domini stabili</h3><p>Se il dominio cambia lentamente ma richiede precisione - finanza, lavoro legale, conformità, documentazione medica - allora una base di conoscenza alimentata da Milvus con <strong>pre-recupero</strong> è di solito la soluzione giusta.</p>
<p>Le informazioni sono ben definite, gli aggiornamenti sono poco frequenti e la maggior parte delle domande può trovare risposta recuperando in anticipo i documenti semanticamente rilevanti.</p>
<p><strong>Compiti prevedibili + conoscenza stabile → Pre-recupero.</strong></p>
<h3 id="2-Just-in-Time-Retrieval-→-Best-for-Dynamic-Exploratory-Workflows" class="common-anchor-header">2. Recupero Just-in-Time → Ideale per flussi di lavoro dinamici ed esplorativi.</h3><p>Settori come l'ingegneria del software, il debugging, l'analisi e la scienza dei dati comportano ambienti in rapida evoluzione: nuovi file, nuovi dati, nuovi stati di distribuzione. Il modello non può prevedere ciò di cui avrà bisogno prima dell'inizio dell'attività.</p>
<p><strong>Attività imprevedibili + conoscenza in rapida evoluzione → Recupero Just-in-Time.</strong></p>
<h3 id="3-Hybrid-Approach-→-When-Both-Conditions-Are-True" class="common-anchor-header">3. Approccio ibrido → Quando entrambe le condizioni sono vere</h3><p>Molti sistemi reali non sono né puramente stabili né puramente dinamici. Ad esempio, la documentazione degli sviluppatori cambia lentamente, mentre lo stato di un ambiente di produzione cambia di minuto in minuto. Un approccio ibrido consente di:</p>
<ul>
<li><p>caricare conoscenze note e stabili utilizzando la ricerca vettoriale (veloce e a bassa latenza)</p></li>
<li><p>Recuperare informazioni dinamiche con strumenti ad agente su richiesta (accurate e aggiornate).</p></li>
</ul>
<p><strong>Conoscenza mista + struttura mista dei compiti → Approccio di recupero ibrido.</strong></p>
<h2 id="What-if-the-Context-Window-Still-Isn’t-Enough" class="common-anchor-header">Cosa succede se la finestra di contesto non è ancora sufficiente?<button data-href="#What-if-the-Context-Window-Still-Isn’t-Enough" class="anchor-icon" translate="no">
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
    </button></h2><p>L'ingegneria del contesto aiuta a ridurre il sovraccarico, ma a volte il problema è più fondamentale: <strong>l'attività non è sufficiente</strong>, anche con un'attenta riduzione.</p>
<p>Alcuni flussi di lavoro, come la migrazione di una grande base di codice, la revisione di architetture multi-repository o la generazione di rapporti di ricerca approfonditi, possono superare le 200K finestre di contesto prima che il modello raggiunga la fine dell'attività. Anche con la ricerca vettoriale, alcuni compiti richiedono una memoria più persistente e strutturata.</p>
<p>Recentemente, Anthropic ha proposto tre strategie pratiche.</p>
<h3 id="1-Compression-Preserve-Signal-Drop-Noise" class="common-anchor-header">1. Compressione: Preservare il segnale, eliminare il rumore</h3><p>Quando la finestra di contesto si avvicina al limite, il modello può <strong>comprimere le interazioni precedenti</strong> in riassunti concisi. Una buona compressione mantiene</p>
<ul>
<li><p>Decisioni chiave</p></li>
<li><p>Vincoli e requisiti</p></li>
<li><p>Problemi in sospeso</p></li>
<li><p>Esempi o campioni rilevanti</p></li>
</ul>
<p>E rimuove:</p>
<ul>
<li><p>Output di strumenti prolissi</p></li>
<li><p>Registri irrilevanti</p></li>
<li><p>Passi ridondanti</p></li>
</ul>
<p>La sfida è l'equilibrio. Se si comprime in modo troppo aggressivo, il modello perde informazioni critiche; se si comprime in modo troppo leggero, si guadagna poco spazio. Una compressione efficace mantiene il "perché" e il "cosa", mentre scarta il "come siamo arrivati qui".</p>
<h3 id="2-Structured-Note-Taking-Move-Stable-Information-Outside-Context" class="common-anchor-header">2. Prendere appunti strutturati: Spostare le informazioni stabili fuori dal contesto</h3><p>Invece di tenere tutto all'interno della finestra del modello, il sistema può memorizzare i fatti importanti in una <strong>memoria esterna, un</strong>database separato o un archivio strutturato che l'agente può interrogare quando necessario.</p>
<p>Ad esempio, il prototipo di agente Pokémon di Claude memorizza fatti durevoli come:</p>
<ul>
<li><p><code translate="no">Pikachu leveled up to 8</code></p></li>
<li><p><code translate="no">Trained 1234 steps on Route 1</code></p></li>
<li><p><code translate="no">Goal: reach level 10</code></p></li>
</ul>
<p>Nel frattempo, i dettagli transitori - registri di battaglia, output di strumenti lunghi - rimangono al di fuori del contesto attivo. Questo rispecchia il modo in cui gli esseri umani usano i taccuini: non conserviamo ogni dettaglio nella nostra memoria di lavoro; memorizziamo i punti di riferimento all'esterno e li consultiamo quando necessario.</p>
<p>L'annotazione strutturata evita il marciume del contesto causato da dettagli ripetuti e non necessari, fornendo al modello una fonte affidabile di verità.</p>
<h3 id="3-Sub-Agent-Architecture-Divide-and-Conquer-Large-Tasks" class="common-anchor-header">3. Architettura a sub-agenti: Dividere e conquistare grandi compiti</h3><p>Per compiti complessi, è possibile progettare un'architettura multi-agente in cui un agente principale supervisiona il lavoro complessivo, mentre diversi subagenti specializzati gestiscono aspetti specifici del compito. Questi subagenti scavano in profondità in grandi quantità di dati relativi ai loro sottocompiti, ma restituiscono solo i risultati concisi ed essenziali. Questo approccio è comunemente utilizzato in scenari come i rapporti di ricerca o l'analisi dei dati.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/longduration_task_cbbc07b9ca.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>In pratica, è meglio iniziare utilizzando un singolo agente combinato con la compressione per gestire il compito. L'archiviazione esterna dovrebbe essere introdotta solo quando c'è la necessità di mantenere la memoria tra le sessioni. L'architettura multi-agente dovrebbe essere riservata ai compiti che richiedono realmente l'elaborazione parallela di sotto-compiti complessi e specializzati.</p>
<p>Ogni approccio estende la "memoria di lavoro" effettiva del sistema senza far saltare la finestra del contesto e senza innescare la rotazione del contesto.</p>
<h2 id="Best-Practices-for-Designing-Context-That-Actually-Works" class="common-anchor-header">Le migliori pratiche per progettare un contesto che funzioni davvero<button data-href="#Best-Practices-for-Designing-Context-That-Actually-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Dopo aver gestito l'overflow del contesto, c'è un altro aspetto altrettanto importante: il modo in cui il contesto viene costruito. Anche con la compressione, le note esterne e i subagenti, il sistema farà fatica se il prompt e gli strumenti stessi non sono progettati per supportare ragionamenti lunghi e complessi.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/System_Prompts_cf655dcd0d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Anthropic offre un modo utile di pensare a questo aspetto: meno come un singolo esercizio di scrittura di un prompt e più come la costruzione di un contesto su tre livelli.</p>
<h3 id="System-Prompts-Find-the-Goldilocks-Zone" class="common-anchor-header"><strong>Prompt di sistema: Trovare la zona Goldilocks</strong></h3><p>La maggior parte dei suggerimenti di sistema fallisce agli estremi. Troppi dettagli - elenchi di regole, condizioni annidate, eccezioni codificate - rendono il prompt fragile e difficile da mantenere. Troppo poco strutturato lascia il modello a indovinare cosa fare.</p>
<p>I migliori prompt si collocano nel mezzo: abbastanza strutturati da guidare il comportamento, ma abbastanza flessibili da permettere al modello di ragionare. In pratica, questo significa dare al modello un ruolo chiaro, un flusso di lavoro generale e una guida leggera per lo strumento: niente di più, niente di meno.</p>
<p>Per esempio:</p>
<pre><code translate="no">You are a technical documentation assistant serving developers.
<span class="hljs-number">1.</span> Start <span class="hljs-keyword">by</span> retrieving relevant documents <span class="hljs-keyword">from</span> the Milvus knowledge <span class="hljs-keyword">base</span>.  
<span class="hljs-number">2.</span> If the retrieval results are insufficient, use the `search_code` tool to perform a deeper search <span class="hljs-keyword">in</span> the codebase.  
<span class="hljs-number">3.</span> When answering, cite specific documentation sections <span class="hljs-keyword">or</span> code line numbers.

<span class="hljs-meta">## Tool guidance</span>
- search_docs: Used <span class="hljs-keyword">for</span> semantic retrieval, best <span class="hljs-keyword">for</span> conceptual questions.  
- search_code: Used <span class="hljs-keyword">for</span> precise lookup <span class="hljs-keyword">in</span> the codebase, best <span class="hljs-keyword">for</span> implementation-detail questions.  
…
<button class="copy-code-btn"></button></code></pre>
<p>Questo prompt stabilisce una direzione senza sovraccaricare il modello o costringerlo a destreggiarsi tra informazioni dinamiche che non gli competono.</p>
<h3 id="Tool-Design-Less-Is-More" class="common-anchor-header">Progettazione degli strumenti: Meno è meglio</h3><p>Una volta che il prompt del sistema stabilisce il comportamento di alto livello, gli strumenti portano la logica operativa vera e propria. Una modalità di fallimento sorprendentemente comune nei sistemi con strumenti è semplicemente quella di avere troppi strumenti, o di avere strumenti i cui scopi si sovrappongono.</p>
<p>Una buona regola empirica:</p>
<ul>
<li><p><strong>Uno strumento, uno scopo</strong></p></li>
<li><p><strong>Parametri espliciti e non ambigui</strong></p></li>
<li><p><strong>Nessuna sovrapposizione di responsabilità</strong></p></li>
</ul>
<p>Se un ingegnere umano esiterebbe su quale strumento usare, lo farà anche il modello. Una progettazione pulita degli strumenti riduce l'ambiguità, diminuisce il carico cognitivo ed evita che il contesto sia ingombrato da tentativi di strumenti non necessari.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/tooling_complexity_7d2bb60c54.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Dynamic-Information-Should-Be-Retrieved-Not-Hardcoded" class="common-anchor-header">Le informazioni dinamiche devono essere recuperate, non codificate in modo rigido</h3><p>L'ultimo livello è il più facile da trascurare. Le informazioni dinamiche o sensibili al tempo, come i valori di stato, gli aggiornamenti recenti o lo stato specifico dell'utente, non dovrebbero mai comparire nel prompt del sistema. Inserirle nel prompt garantisce che diventino stantie, gonfie o contraddittorie nel corso di lunghe attività.</p>
<p>Invece, queste informazioni dovrebbero essere recuperate solo quando sono necessarie, attraverso il recupero o gli strumenti dell'agente. Mantenere i contenuti dinamici fuori dal prompt del sistema evita la putrefazione del contesto e mantiene pulito lo spazio di ragionamento del modello.</p>
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
    </button></h2><p>Man mano che gli agenti di intelligenza artificiale entrano negli ambienti di produzione di diversi settori, si trovano ad affrontare flussi di lavoro più lunghi e compiti più complessi che mai. In questi contesti, la gestione del contesto diventa una necessità pratica.</p>
<p><strong>Tuttavia, una finestra di contesto più grande non produce automaticamente risultati migliori</strong>; in molti casi, fa il contrario. Quando un modello viene sovraccaricato, alimentato con informazioni stantie o obbligato a rispondere a richieste massicce, l'accuratezza si allontana silenziosamente. Questo lento e sottile declino è ciò che oggi chiamiamo <strong>context rot</strong>.</p>
<p>Tecniche come il recupero JIT, il pre-recupero, le pipeline ibride e la ricerca semantica alimentata da database vettoriali mirano tutte allo stesso obiettivo: <strong>fare in modo che il modello veda le informazioni giuste al momento giusto - né più né meno - in modo che possa rimanere con i piedi per terra e produrre risposte affidabili.</strong></p>
<p><a href="https://milvus.io/"><strong>Milvus</strong></a>, un database vettoriale open-source ad alte prestazioni, è al centro di questo flusso di lavoro. Fornisce l'infrastruttura per archiviare le conoscenze in modo efficiente e recuperare le parti più rilevanti con una bassa latenza. Abbinato al recupero JIT e ad altre strategie complementari, Milvus aiuta gli agenti di intelligenza artificiale a rimanere precisi anche quando i loro compiti diventano più profondi e dinamici.</p>
<p>Ma il recupero è solo un pezzo del puzzle. Un buon design dei prompt, un set di strumenti pulito e minimale e strategie di overflow sensate - che si tratti di compressione, note strutturate o subagenti - lavorano insieme per mantenere il modello concentrato durante le sessioni di lunga durata. Questo è l'aspetto di una vera ingegneria del contesto: non si tratta di ingegnosi hack, ma di un'architettura ponderata.</p>
<p>Se volete agenti di intelligenza artificiale che rimangano precisi per ore, giorni o interi flussi di lavoro, il contesto merita la stessa attenzione che dedichereste a qualsiasi altra parte fondamentale del vostro stack.</p>
<p>Avete domande o volete un approfondimento su una qualsiasi funzionalità? Unitevi al nostro<a href="https://discord.com/invite/8uyFbECzPX"> canale Discord</a> o inviate problemi su<a href="https://github.com/milvus-io/milvus"> GitHub</a>. È anche possibile prenotare una sessione individuale di 20 minuti per ottenere approfondimenti, indicazioni e risposte alle vostre domande attraverso<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
