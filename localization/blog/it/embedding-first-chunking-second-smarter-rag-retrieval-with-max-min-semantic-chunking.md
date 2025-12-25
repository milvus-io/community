---
id: >-
  embedding-first-chunking-second-smarter-rag-retrieval-with-max-min-semantic-chunking.md
title: >-
  Prima l'incorporazione, poi il chunking: Recupero più intelligente di RAG con
  il chunking semantico Max-Min
author: Rachel Liu
date: 2025-12-24T00:00:00.000Z
cover: assets.zilliz.com/maxmin_cover_8be0b87409.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Max–Min Semantic Chunking, Milvus, RAG, chunking strategies'
meta_title: |
  Max–Min Semantic Chunking: Top Chunking Strategy to Improve RAG Performance
desc: >-
  Scoprite come il Max-Min Semantic Chunking aumenta l'accuratezza della RAG
  grazie a un approccio embedding-first che crea chunk più intelligenti,
  migliora la qualità del contesto e offre migliori prestazioni di recupero.
origin: >-
  https://milvus.io/blog/embedding-first-chunking-second-smarter-rag-retrieval-with-max-min-semantic-chunking.md
---
<p>La<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval Augmented Generation (RAG)</a> è diventata l'approccio predefinito per fornire contesto e memoria alle applicazioni di IA - gli agenti di IA, gli assistenti di supporto ai clienti, le basi di conoscenza e i sistemi di ricerca fanno tutti affidamento su di essa.</p>
<p>In quasi tutte le pipeline RAG, il processo standard è lo stesso: si prendono i documenti, si dividono in pezzi e poi si incorporano questi pezzi per il recupero delle somiglianze in un database vettoriale come <a href="https://milvus.io/">Milvus</a>. Poiché <strong>il chunking</strong> avviene a monte, la qualità dei pezzi influisce direttamente sulla qualità del sistema e sull'accuratezza delle risposte finali.</p>
<p>Il problema è che le strategie tradizionali di chunking solitamente dividono il testo senza alcuna comprensione semantica. Il chunking a lunghezza fissa si basa sul conteggio dei token e il chunking ricorsivo utilizza la struttura a livello superficiale, ma entrambi ignorano il significato effettivo del testo. Di conseguenza, le idee correlate vengono spesso separate, le righe non correlate vengono raggruppate e il contesto importante viene frammentato.</p>
<p><a href="https://link.springer.com/article/10.1007/s10791-025-09638-7"><strong>Il chunking semantico Max-Min</strong></a> affronta il problema in modo diverso. Invece di effettuare il chunking per primo, incorpora il testo in anticipo e utilizza la somiglianza semantica per decidere dove devono formarsi i confini. Incorporando il testo prima di tagliarlo, la pipeline è in grado di seguire i naturali spostamenti di significato, anziché affidarsi a limiti di lunghezza arbitrari.</p>
<p>Nel nostro blog precedente abbiamo parlato di metodi come il <a href="https://milvus.io/blog/smarter-retrieval-for-rag-late-chunking-with-jina-embeddings-v2-and-milvus.md"><strong>Late Chunking</strong></a> di Jina AI, che ha contribuito a rendere popolare l'idea di "embed-first" e ha dimostrato che può funzionare nella pratica. <strong>Il Max-Min Semantic Chunking</strong> si basa sullo stesso concetto, con una semplice regola che identifica quando il significato cambia abbastanza da giustificare un nuovo chunk. In questo post spiegheremo come funziona Max-Min ed esamineremo i suoi punti di forza e i suoi limiti per i carichi di lavoro RAG reali.</p>
<h2 id="How-a-Typical-RAG-Pipeline-Works" class="common-anchor-header">Come funziona una tipica pipeline RAG<button data-href="#How-a-Typical-RAG-Pipeline-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>La maggior parte delle pipeline RAG, indipendentemente dal framework, segue la stessa catena di montaggio in quattro fasi. Probabilmente ne avete scritto voi stessi una qualche versione:</p>
<h3 id="1-Data-Cleaning-and-Chunking" class="common-anchor-header">1. Pulizia e raggruppamento dei dati</h3><p>La pipeline inizia pulendo i documenti grezzi: rimuovendo intestazioni, piè di pagina, testo di navigazione e tutto ciò che non è contenuto reale. Una volta eliminato il rumore, il testo viene suddiviso in parti più piccole. La maggior parte dei team utilizza pezzi di dimensioni fisse, in genere 300-800 token, perché in questo modo il modello di incorporazione è gestibile. Lo svantaggio è che le suddivisioni si basano sulla lunghezza, non sul significato, quindi i confini possono essere arbitrari.</p>
<h3 id="2-Embedding-and-Storage" class="common-anchor-header">2. Incorporamento e archiviazione</h3><p>Ogni pezzo viene poi incorporato utilizzando un modello di incorporamento come quello di OpenAI <a href="https://zilliz.com/ai-models/text-embedding-3-small"><code translate="no">text-embedding-3-small</code></a> o il codificatore di BAAI. I vettori risultanti vengono memorizzati in un database vettoriale come <a href="https://milvus.io/">Milvus</a> o <a href="https://zilliz.com/cloud">Zilliz Cloud</a>. Il database gestisce l'indicizzazione e la ricerca di similarità, in modo da poter confrontare rapidamente le nuove query con tutti i chunk memorizzati.</p>
<h3 id="3-Querying" class="common-anchor-header">3. Interrogazione</h3><p>Quando un utente pone una domanda, ad esempio <em>"Come fa il RAG a ridurre le allucinazioni?".</em> - il sistema incorpora la domanda e la invia al database. Il database restituisce i top-K chunk i cui vettori sono più vicini alla domanda. Questi sono i pezzi di testo su cui il modello si baserà per rispondere alla domanda.</p>
<h3 id="4-Answer-Generation" class="common-anchor-header">4. Generazione della risposta</h3><p>I pezzi recuperati vengono raggruppati insieme alla domanda dell'utente e inseriti in un LLM. Il modello genera una risposta utilizzando il contesto fornito come base.</p>
<p><strong>Il chunking si trova all'inizio dell'intera pipeline, ma ha un impatto notevole</strong>. Se i pezzi sono in linea con il significato naturale del testo, il recupero è accurato e coerente. Se i frammenti sono stati tagliati in punti scomodi, il sistema ha più difficoltà a trovare le informazioni giuste, anche con embeddings forti e un database vettoriale veloce.</p>
<h3 id="The-Challenges-of-Getting-Chunking-Right" class="common-anchor-header">Le sfide di un corretto chunking</h3><p>La maggior parte dei sistemi RAG oggi utilizza uno dei due metodi di chunking di base, che presentano entrambi dei limiti.</p>
<p><strong>1. Chunking a dimensione fissa</strong></p>
<p>Questo è l'approccio più semplice: dividere il testo in base a un numero fisso di token o di caratteri. È veloce e prevedibile, ma ignora completamente la grammatica, gli argomenti o le transizioni. Le frasi possono essere tagliate a metà. A volte anche le parole. Le incorporazioni ottenute da questi pezzi tendono a essere rumorose perché i confini non riflettono la reale struttura del testo.</p>
<p><strong>2. Suddivisione ricorsiva dei caratteri</strong></p>
<p>Questo metodo è un po' più intelligente. Suddivide il testo gerarchicamente in base a indicazioni come paragrafi, interruzioni di riga o frasi. Se una sezione è troppo lunga, la divide ulteriormente in modo ricorsivo. Il risultato è generalmente più coerente, ma ancora incoerente. Alcuni documenti non hanno una struttura chiara o hanno sezioni di lunghezza non uniforme, il che compromette l'accuratezza del reperimento. In alcuni casi, inoltre, questo approccio produce pezzi che superano la finestra di contesto del modello.</p>
<p>Entrambi i metodi devono affrontare lo stesso compromesso: precisione contro contesto. I pezzi più piccoli migliorano l'accuratezza del recupero, ma perdono il contesto circostante; quelli più grandi preservano il significato, ma rischiano di aggiungere rumore irrilevante. Trovare il giusto equilibrio è ciò che rende il chunking fondamentale e frustrante nella progettazione di sistemi RAG.</p>
<h2 id="Max–Min-Semantic-Chunking-Embed-First-Chunk-Second" class="common-anchor-header">Chunking semantico Max-Min: Incorporare prima, spezzettare dopo<button data-href="#Max–Min-Semantic-Chunking-Embed-First-Chunk-Second" class="anchor-icon" translate="no">
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
    </button></h2><p>Nel 2025, S.R. Bhat et al. hanno pubblicato <a href="https://arxiv.org/abs/2505.21700"><em>Rethinking Chunk Size for Long-Document Retrieval: A Multi-Dataset Analysis</em></a>. Uno dei loro risultati principali è che non esiste un'unica dimensione <strong>"migliore"</strong> per il RAG. I chunk piccoli (64-128 token) tendono a funzionare meglio per le domande di tipo fattuale o di ricerca, mentre i chunk più grandi (512-1024 token) sono utili per i compiti narrativi o di ragionamento di alto livello. In altre parole, il chunking a dimensione fissa è sempre un compromesso.</p>
<p>Ciò solleva una domanda naturale: invece di scegliere una lunghezza e sperare che sia la migliore, possiamo suddividere i pezzi in base al significato piuttosto che alla dimensione? <a href="https://link.springer.com/article/10.1007/s10791-025-09638-7"><strong>Il Max-Min Semantic Chunking</strong></a> è un approccio che ho trovato e che cerca di fare proprio questo.</p>
<p>L'idea è semplice: <strong>prima incorporare, poi suddividere</strong>. Invece di dividere il testo e poi incorporare i pezzi che ne escono, l'algoritmo incorpora <em>tutte le frasi</em> in anticipo. Utilizza poi le relazioni semantiche tra queste incorporazioni di frasi per decidere dove devono andare i confini.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/embed_first_chunk_second_94f69c664c.png" alt="Diagram showing embed-first chunk-second workflow in Max-Min Semantic Chunking" class="doc-image" id="diagram-showing-embed-first-chunk-second-workflow-in-max-min-semantic-chunking" />
   </span> <span class="img-wrapper"> <span>Diagramma che mostra il flusso di lavoro embed-first chunk-second nel chunking semantico Max-Min</span> </span></p>
<p>Concettualmente, il metodo tratta il chunking come un problema di raggruppamento vincolato nello spazio delle incorporazioni. Si percorre il documento in ordine, una frase alla volta. Per ogni frase, l'algoritmo confronta il suo embedding con quello del chunking corrente. Se la nuova frase è semanticamente abbastanza vicina, si unisce al chunk. Se è troppo lontana, l'algoritmo inizia un nuovo chunk. Il vincolo fondamentale è che i chunk devono seguire l'ordine delle frasi originali: nessun riordino, nessun raggruppamento globale.</p>
<p>Il risultato è un insieme di pezzi di lunghezza variabile che riflettono i punti in cui il significato del documento cambia effettivamente, invece di quelli in cui un contatore di caratteri arriva a zero.</p>
<h2 id="How-the-Max–Min-Semantic-Chunking-Strategy-Works" class="common-anchor-header">Come funziona la strategia di chunking semantico Max-Min<button data-href="#How-the-Max–Min-Semantic-Chunking-Strategy-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Il Max-Min Semantic Chunking determina i confini dei pezzi confrontando il modo in cui le frasi si relazionano tra loro nello spazio vettoriale ad alta dimensione. Invece di basarsi su lunghezze fisse, osserva come il significato si sposta all'interno del documento. Il processo può essere suddiviso in sei fasi:</p>
<h3 id="1-Embed-all-sentences-and-start-a-chunk" class="common-anchor-header">1. Incorporare tutte le frasi e iniziare un chunk</h3><p>Il modello di incorporazione converte ogni frase del documento in un'incorporazione vettoriale. Le frasi vengono elaborate in ordine. Se le prime <em>n-k</em> frasi formano il chunk corrente C, la frase successiva (sₙ₋ₖ₊₁) deve essere valutata: deve unirsi a C o iniziare un nuovo chunk?</p>
<h3 id="2-Measure-how-consistent-the-current-chunk-is" class="common-anchor-header">2. Misurare la coerenza del chunk corrente</h3><p>All'interno del chunk C, calcolare la minima somiglianza di coseno a coppie tra tutte le incorporazioni di frasi. Questo valore riflette quanto siano strettamente correlate le frasi all'interno del chunk. Una somiglianza minima più bassa indica che le frasi sono meno correlate, il che suggerisce che il chunk potrebbe dover essere diviso.</p>
<h3 id="3-Compare-the-new-sentence-to-the-chunk" class="common-anchor-header">3. Confrontare la nuova frase con il chunk</h3><p>Successivamente, si calcola la massima somiglianza del coseno tra la nuova frase e qualsiasi frase già presente in C. Questo valore riflette il grado di allineamento semantico della nuova frase con il chunk esistente.</p>
<h3 id="4-Decide-whether-to-extend-the-chunk-or-start-a-new-one" class="common-anchor-header">4. Decidere se estendere il chunk o iniziarne uno nuovo.</h3><p>Questa è la regola fondamentale:</p>
<ul>
<li><p>Se <strong>la somiglianza massima della nuova frase</strong> con il chunk <strong>C</strong> è <strong>maggiore o uguale alla</strong> <strong>somiglianza minima all'interno di C</strong>, → la nuova frase si adatta e rimane nel chunk.</p></li>
<li><p>Altrimenti, → inizia un nuovo chunk.</p></li>
</ul>
<p>Questo assicura che ogni chunk mantenga la sua coerenza semantica interna.</p>
<h3 id="5-Adjust-thresholds-as-the-document-changes" class="common-anchor-header">5. Regolare le soglie in base alle modifiche del documento</h3><p>Per ottimizzare la qualità dei chunk, è possibile regolare dinamicamente parametri come le dimensioni dei chunk e le soglie di somiglianza. Ciò consente all'algoritmo di adattarsi alle diverse strutture e densità semantiche dei documenti.</p>
<h3 id="6-Handle-the-first-few-sentences" class="common-anchor-header">6. Gestire le prime frasi</h3><p>Quando un chunk contiene una sola frase, l'algoritmo gestisce il primo confronto utilizzando una soglia di somiglianza fissa. Se la somiglianza tra la frase 1 e la frase 2 è superiore a tale soglia, le due frasi formano un chunk. In caso contrario, si dividono immediatamente.</p>
<h2 id="Strengths-and-Limitations-of-Max–Min-Semantic-Chunking" class="common-anchor-header">Punti di forza e limiti del chunking semantico Max-Min<button data-href="#Strengths-and-Limitations-of-Max–Min-Semantic-Chunking" class="anchor-icon" translate="no">
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
    </button></h2><p>Il Max-Min Semantic Chunking migliora il modo in cui i sistemi RAG suddividono il testo utilizzando il significato anziché la lunghezza, ma non è una soluzione definitiva. Ecco un'analisi pratica di ciò che fa bene e dei punti deboli.</p>
<h3 id="What-It-Does-Well" class="common-anchor-header">Cosa fa bene</h3><p>Il chunking semantico Max-Min migliora il chunking tradizionale in tre modi importanti:</p>
<h4 id="1-Dynamic-meaning-driven-chunk-boundaries" class="common-anchor-header"><strong>1. Confini dei chunk dinamici e guidati dal significato</strong></h4><p>A differenza degli approcci basati su dimensioni o strutture fisse, questo metodo si basa sulla somiglianza semantica per guidare il chunking. Confronta la somiglianza minima all'interno del chunk corrente (quanto è coeso) con la somiglianza massima tra la nuova frase e quel chunk (quanto si adatta). Se quest'ultima è maggiore, la frase si unisce al chunk; altrimenti, inizia un nuovo chunk.</p>
<h4 id="2-Simple-practical-parameter-tuning" class="common-anchor-header"><strong>2. Regolazione dei parametri semplice e pratica</strong></h4><p>L'algoritmo dipende da tre soli iperparametri fondamentali:</p>
<ul>
<li><p>la <strong>dimensione massima del chunk</strong>,</p></li>
<li><p>la <strong>somiglianza minima</strong> tra le prime due frasi, e</p></li>
<li><p>la <strong>soglia di somiglianza</strong> per l'aggiunta di nuove frasi.</p></li>
</ul>
<p>Questi parametri si adattano automaticamente al contesto: pezzi più grandi richiedono soglie di somiglianza più severe per mantenere la coerenza.</p>
<h4 id="3-Low-processing-overhead" class="common-anchor-header"><strong>3. Basso overhead di elaborazione</strong></h4><p>Poiché la pipeline RAG calcola già gli embeddings delle frasi, Max-Min Semantic Chunking non aggiunge calcoli pesanti. Tutto ciò che serve è una serie di controlli di somiglianza del coseno durante la scansione delle frasi. Questo lo rende più economico di molte tecniche di chunking semantico che richiedono modelli aggiuntivi o clustering a più stadi.</p>
<h3 id="What-It-Still-Can’t-Solve" class="common-anchor-header">Cosa non può ancora risolvere</h3><p>Il Max-Min Semantic Chunking migliora i confini dei pezzi, ma non elimina tutte le sfide della segmentazione dei documenti. Poiché l'algoritmo elabora le frasi in ordine e raggruppa solo localmente, può ancora perdere le relazioni a lungo raggio nei documenti più lunghi o complessi.</p>
<p>Un problema comune è la <strong>frammentazione del contesto</strong>. Quando le informazioni importanti sono sparse in diverse parti di un documento, l'algoritmo può collocare questi pezzi in chunk separati. Ogni pezzo porta con sé solo una parte del significato.</p>
<p>Ad esempio, nelle note di rilascio di Milvus 2.4.13, come mostrato di seguito, un pezzo potrebbe contenere l'identificatore della versione e un altro l'elenco delle funzionalità. Una domanda come <em>"Quali nuove funzionalità sono state introdotte in Milvus 2.4.13?"</em> dipende da entrambi. Se questi dettagli sono suddivisi in diversi chunk, il modello di incorporamento potrebbe non collegarli, con conseguente indebolimento del recupero.</p>
<ul>
<li>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/v2413_a98e1b1f99.png" alt="Example showing context fragmentation in Milvus 2.4.13 Release Notes with version identifier and feature list in separate chunks" class="doc-image" id="example-showing-context-fragmentation-in-milvus-2.4.13-release-notes-with-version-identifier-and-feature-list-in-separate-chunks" />
   </span> <span class="img-wrapper"> <span>Esempio che mostra la frammentazione del contesto nelle note di rilascio di Milvus 2.4.13, con l'identificatore della versione e l'elenco delle caratteristiche in parti separate.</span> </span></li>
</ul>
<p>Questa frammentazione influisce anche sulla fase di generazione dell'LLM. Se il riferimento alla versione è in un chunk e le descrizioni delle caratteristiche sono in un altro, il modello riceve un contesto incompleto e non può ragionare in modo pulito sulla relazione tra i due.</p>
<p>Per mitigare questi casi, i sistemi utilizzano spesso tecniche come le finestre scorrevoli, la sovrapposizione dei confini dei chunk o le scansioni multi-pass. Questi approcci reintroducono parte del contesto mancante, riducono la frammentazione e aiutano la fase di recupero a conservare le informazioni correlate.</p>
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
    </button></h2><p>Il chunking semantico Max-Min non è una soluzione magica per tutti i problemi di RAG, ma ci offre un modo più sano di pensare ai confini dei chunk. Invece di lasciare che siano i limiti dei token a decidere dove le idee vengono tagliate, utilizza gli embeddings per individuare dove il significato si sposta effettivamente. Per molti documenti del mondo reale - API, specifiche, log, note di rilascio, guide alla risoluzione dei problemi - questo approccio può da solo aumentare notevolmente la qualità del recupero.</p>
<p>L'aspetto positivo di questo approccio è che si inserisce naturalmente nelle pipeline RAG esistenti. Se si incorporano già frasi o paragrafi, il costo aggiuntivo è costituito da pochi controlli di somiglianza del coseno. Non sono necessari modelli aggiuntivi, clustering complessi o preelaborazioni pesanti. E quando funziona, i pezzi prodotti sembrano più "umani", più vicini al modo in cui raggruppiamo mentalmente le informazioni durante la lettura.</p>
<p>Ma il metodo ha ancora dei punti deboli. Vede il significato solo a livello locale e non riesce a ricollegare le informazioni che sono intenzionalmente separate. Finestre sovrapposte, scansioni a più passaggi e altri trucchi per preservare il contesto sono ancora necessari, soprattutto per i documenti in cui i riferimenti e le spiegazioni vivono lontani l'uno dall'altro.</p>
<p>Tuttavia, il Max-Min Semantic Chunking ci porta nella giusta direzione: lontano dall'affettatura arbitraria del testo e verso pipeline di reperimento che rispettino effettivamente la semantica. Se state esplorando modi per rendere RAG più affidabile, vale la pena di sperimentarlo.</p>
<p>Avete domande o volete approfondire il tema del miglioramento delle prestazioni di RAG? Unitevi al nostro <a href="https://discord.com/invite/8uyFbECzPX">Discord</a> e mettetevi in contatto con gli ingegneri che ogni giorno costruiscono e mettono a punto sistemi di reperimento reali.</p>
