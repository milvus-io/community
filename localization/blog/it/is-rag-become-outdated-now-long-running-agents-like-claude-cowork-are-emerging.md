---
id: >-
  is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md
title: >-
  Il RAG sta diventando obsoleto ora che stanno emergendo agenti di lunga data
  come Claude Cowork?
author: Min Yin
date: 2026-1-27
desc: >-
  Un'analisi approfondita della memoria a lungo termine di Claude Cowork, della
  memoria agente scrivibile, dei compromessi RAG e del perché i database
  vettoriali sono ancora importanti.
cover: assets.zilliz.com/RAG_vs_Long_Running_Agents_fc67810cf8.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, claude, RAG'
meta_keywords: >-
  Claude Cowork long-term memory, RAG vs Claude Cowork, vector databases for AI
  agents
meta_title: |
  RAG vs Long-Running Agents: Is RAG Obsolete? 
origin: >-
  https://milvus.io/blog/is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md
---
<p><a href="https://support.claude.com/en/articles/13345190-getting-started-with-cowork">Claude Cowork</a> è una nuova funzione agente dell'applicazione Claude Desktop. Dal punto di vista dello sviluppatore, si tratta fondamentalmente di un task runner automatico avvolto intorno al modello: può leggere, modificare e generare file locali e può pianificare attività in più fasi senza dover richiedere manualmente ogni passo. Pensate allo stesso ciclo che sta dietro a Claude Code, ma esposto al desktop invece che al terminale.</p>
<p>La caratteristica principale di Cowork è la capacità di funzionare per lunghi periodi senza perdere lo stato. Non subisce il solito timeout della conversazione o il reset del contesto. Può continuare a lavorare, tenere traccia dei risultati intermedi e riutilizzare le informazioni precedenti nelle varie sessioni. Questo dà l'impressione di una "memoria a lungo termine", anche se la meccanica sottostante è più simile a uno stato di attività persistente + carryover contestuale. In ogni caso, l'esperienza è diversa dal modello tradizionale di chat, dove tutto si azzera a meno che non si costruisca un proprio livello di memoria.</p>
<p>Questo solleva due questioni pratiche per gli sviluppatori:</p>
<ol>
<li><p><strong>Se il modello è già in grado di ricordare le informazioni passate, dove si colloca la RAG o la RAG agenziale? RAG sarà sostituito?</strong></p></li>
<li><p><strong>Se vogliamo un agente locale, in stile Cowork, come possiamo implementare noi stessi la memoria a lungo termine?</strong></p></li>
</ol>
<p>Il resto dell'articolo affronta queste domande in dettaglio e spiega come i database vettoriali si inseriscono in questo nuovo panorama di "memoria modello".</p>
<h2 id="Claude-Cowork-vs-RAG-What’s-the-Difference" class="common-anchor-header">Claude Cowork vs. RAG: qual è la differenza?<button data-href="#Claude-Cowork-vs-RAG-What’s-the-Difference" class="anchor-icon" translate="no">
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
    </button></h2><p>Come ho detto in precedenza, Claude Cowork è una modalità agente all'interno di Claude Desktop che può leggere e scrivere file locali, suddividere i compiti in fasi più piccole e continuare a lavorare senza perdere lo stato. Mantiene il proprio contesto di lavoro, quindi le attività di più ore non si azzerano come una normale sessione di chat.</p>
<p><strong>RAG</strong> (Retrieval-Augmented Generation) risolve un problema diverso: dare a un modello l'accesso a conoscenze esterne. Si indicizzano i dati in un database vettoriale, si recuperano i pezzi rilevanti per ogni query e li si inserisce nel modello. È molto utilizzato perché fornisce alle applicazioni LLM una forma di "memoria a lungo termine" per documenti, registri, dati di prodotto e altro ancora.</p>
<p>Se entrambi i sistemi aiutano un modello a "ricordare", qual è la vera differenza?</p>
<h3 id="How-Cowork-Handles-Memory" class="common-anchor-header">Come Cowork gestisce la memoria</h3><p>La memoria di Cowork è di lettura-scrittura. L'agente decide quali informazioni dell'attività o della conversazione in corso sono rilevanti, le memorizza come voci della memoria e le recupera in seguito, man mano che l'attività procede. Ciò consente a Cowork di mantenere la continuità nei flussi di lavoro di lunga durata, in particolare quelli che producono nuovi stati intermedi durante il loro svolgimento.</p>
<h3 id="How-RAG-and-Agentic-RAG-Handle-Memory" class="common-anchor-header">Come RAG e Agentic RAG gestiscono la memoria</h3><p>Il RAG standard è un recupero guidato dalla domanda: l'utente chiede qualcosa, il sistema recupera i documenti pertinenti e il modello li usa per rispondere. Il corpus di recupero rimane stabile e aggiornato, e gli sviluppatori controllano esattamente cosa vi entra.</p>
<p>La moderna RAG agenziale estende questo modello. Il modello può decidere quando recuperare le informazioni, cosa recuperare e come utilizzarle durante la pianificazione o l'esecuzione di un flusso di lavoro. Questi sistemi possono eseguire compiti lunghi e chiamare strumenti, come Cowork. Ma anche con il RAG agenziale, il livello di recupero rimane orientato alla conoscenza piuttosto che allo stato. L'agente recupera fatti autorevoli; non scrive il suo stato di compito in evoluzione nel corpus.</p>
<p>Un altro modo di vedere la cosa:</p>
<ul>
<li><p><strong>La memoria di Cowork è orientata al compito:</strong> l'agente scrive e legge il proprio stato in evoluzione.</p></li>
<li><p><strong>La RAG è guidata dalla conoscenza:</strong> il sistema recupera informazioni consolidate su cui il modello deve basarsi.</p></li>
</ul>
<h2 id="Reverse-Engineering-Claude-Cowork-How-It-Builds-Long-Running-Agent-Memory" class="common-anchor-header">Reverse-Engineering di Claude Cowork: Come costruisce la memoria degli agenti a lunga durata<button data-href="#Reverse-Engineering-Claude-Cowork-How-It-Builds-Long-Running-Agent-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>Cowork è molto apprezzato perché gestisce compiti in più fasi senza dimenticare continuamente quello che sta facendo. Dal punto di vista di uno sviluppatore, mi chiedo <strong>come faccia a mantenere lo stato in sessioni così lunghe.</strong> Anthropic non ha pubblicato i dati interni, ma sulla base dei precedenti esperimenti di sviluppo con il modulo di memoria di Claude, possiamo mettere insieme un modello mentale decente.</p>
<p>Claude sembra affidarsi a una configurazione ibrida: <strong>un livello di memoria a lungo termine persistente e strumenti di recupero su richiesta.</strong> Invece di inserire l'intera conversazione in ogni richiesta, Claude inserisce selettivamente il contesto passato solo quando lo ritiene rilevante. Questo permette al modello di mantenere un'elevata precisione senza consumare token a ogni turno.</p>
<p>Se si scompone la struttura della richiesta, si ottiene più o meno questo aspetto:</p>
<pre><code translate="no">[<span class="hljs-meta">0</span>] Static system instructions
[<span class="hljs-meta">1</span>] <span class="hljs-function">User <span class="hljs-title">memory</span> (<span class="hljs-params"><span class="hljs-built_in">long</span>-term</span>)
[2] Retrieved / pruned conversation history
[3] Current user message
</span><button class="copy-code-btn"></button></code></pre>
<p>Il comportamento interessante non è la struttura in sé, ma il modo in cui il modello decide cosa aggiornare e quando eseguire il recupero.</p>
<h3 id="User-Memory-The-Persistent-Layer" class="common-anchor-header">Memoria utente: Lo strato persistente</h3><p>Claude mantiene un archivio di memoria a lungo termine che si aggiorna nel tempo. A differenza del sistema di memoria più prevedibile di ChatGPT, quello di Claude sembra un po' più "vivo". Memorizza le memorie in blocchi di tipo XML e le aggiorna in due modi:</p>
<ul>
<li><p><strong>Aggiornamenti impliciti:</strong> A volte il modello decide che qualcosa è una preferenza o un fatto stabile e lo scrive tranquillamente in memoria. Questi aggiornamenti non sono istantanei; appaiono dopo qualche turno e i ricordi più vecchi possono svanire se la conversazione relativa scompare.</p></li>
<li><p><strong>Aggiornamenti espliciti:</strong> Gli utenti possono modificare direttamente la memoria con lo strumento <code translate="no">memory_user_edits</code> ("ricorda X", "dimentica Y"). Queste scritture sono immediate e si comportano più come un'operazione CRUD.</p></li>
</ul>
<p>Claude esegue un'euristica in background per decidere cosa vale la pena di persistere e non aspetta istruzioni esplicite.</p>
<h3 id="Conversation-Retrieval-The-On-Demand-Part" class="common-anchor-header">Recupero delle conversazioni: La parte su richiesta</h3><p>Claude <em>non</em> mantiene un riepilogo continuo come molti sistemi LLM. Ha invece una serie di funzioni di recupero che può richiamare ogni volta che ritiene che manchi un contesto. Queste chiamate non avvengono a ogni turno: il modello le attiva in base al proprio giudizio interno.</p>
<p>La più importante è <code translate="no">conversation_search</code>. Quando l'utente dice qualcosa di vago come "quel progetto del mese scorso", Claude spesso attiva questo strumento per recuperare i turni pertinenti. La cosa notevole è che funziona anche quando la formulazione è ambigua o in una lingua diversa. Questo implica chiaramente che:</p>
<ul>
<li><p>Un qualche tipo di corrispondenza semantica (embeddings).</p></li>
<li><p>Probabilmente combinato con la normalizzazione o la traduzione leggera</p></li>
<li><p>Ricerca di parole chiave per precisione</p></li>
</ul>
<p>In sostanza, questo assomiglia molto a un sistema RAG in miniatura, integrato nel set di strumenti del modello.</p>
<h3 id="How-Claude’s-Retrieval-Behavior-Differs-From-Basic-History-Buffers" class="common-anchor-header">Come il comportamento di Claude nel recupero si differenzia dai buffer di cronologia di base</h3><p>Dai test e dai registri, emergono alcuni modelli:</p>
<ul>
<li><p><strong>Il recupero non è automatico.</strong> Il modello sceglie quando chiamarlo. Se ritiene di avere già un contesto sufficiente, non si preoccupa nemmeno.</p></li>
<li><p><strong>I pezzi recuperati includono</strong> <em>sia</em> <strong>i messaggi dell'utente che quelli dell'assistente.</strong> Questo è utile, perché mantiene più sfumature rispetto ai riassunti riservati all'utente.</p></li>
<li><p><strong>L'uso dei token rimane regolare.</strong> Dato che la cronologia non viene iniettata a ogni turno, le sessioni più lunghe non si allungano in modo imprevedibile.</p></li>
</ul>
<p>Nel complesso, sembra un LLM potenziato dal reperimento, con la differenza che il reperimento avviene come parte del ciclo di ragionamento del modello stesso.</p>
<p>Questa architettura è intelligente, ma non gratuita:</p>
<ul>
<li><p>Il recupero aggiunge latenza e più "parti mobili" (indicizzazione, classificazione, ri-classificazione).</p></li>
<li><p>Il modello a volte sbaglia a valutare se ha bisogno di un contesto, il che significa che si verifica la classica "dimenticanza di LLM" anche se i dati <em>erano</em> disponibili.</p></li>
<li><p>Il debug diventa più complicato perché il comportamento del modello dipende da trigger invisibili dello strumento, non solo dall'input del prompt.</p></li>
</ul>
<h3 id="Claude-Cowork-vs-Claude-Codex-in-handling-long-term-memory" class="common-anchor-header">Claude Cowork vs Claude Codex nella gestione della memoria a lungo termine</h3><p>In contrasto con l'impostazione di Claude, che fa leva sul recupero, ChatGPT gestisce la memoria in modo molto più strutturato e prevedibile. Invece di fare ricerche semantiche o di trattare le vecchie conversazioni come un mini archivio vettoriale, ChatGPT inietta la memoria direttamente in ogni sessione attraverso i seguenti componenti stratificati:</p>
<ul>
<li><p>Memoria dell'utente</p></li>
<li><p>Metadati della sessione</p></li>
<li><p>Messaggi della sessione corrente</p></li>
</ul>
<p><strong>Memoria utente</strong></p>
<p>La memoria dell'utente è il principale livello di memorizzazione a lungo termine, la parte che persiste tra le sessioni e che può essere modificata dall'utente. Memorizza cose piuttosto standard: nome, background, progetti in corso, preferenze di apprendimento, questo genere di cose. Ogni nuova conversazione viene iniettata in questo blocco all'inizio, in modo che il modello inizi sempre con una visione coerente dell'utente.</p>
<p>ChatGPT aggiorna questo livello in due modi:</p>
<ul>
<li><p><strong>Aggiornamenti espliciti:</strong> Gli utenti possono dire al modello di "ricordare questo" o "dimenticare quello" e la memoria cambia immediatamente. Si tratta in pratica di un'API CRUD che il modello espone attraverso il linguaggio naturale.</p></li>
<li><p><strong>Aggiornamenti impliciti:</strong> Se il modello individua un'informazione che corrisponde alle regole di OpenAI per la memoria a lungo termine, come un titolo di lavoro o una preferenza, e l'utente non ha disattivato la memoria, la aggiungerà silenziosamente da solo.</p></li>
</ul>
<p>Dal punto di vista dello sviluppatore, questo livello è semplice, deterministico e facile da interpretare. Non ci sono lookup incorporati, né euristiche su cosa recuperare.</p>
<p><strong>Metadati di sessione</strong></p>
<p>I metadati di sessione si trovano all'estremità opposta dello spettro. Hanno vita breve, non sono persistenti e vengono iniettati solo una volta all'inizio di una sessione. Considerateli come variabili d'ambiente per la conversazione. Include elementi come</p>
<ul>
<li><p>su quale dispositivo ci si trova</p></li>
<li><p>stato dell'account/abbonamento</p></li>
<li><p>modelli di utilizzo approssimativi (giorni attivi, distribuzione del modello, durata media della conversazione).</p></li>
</ul>
<p>Questi metadati aiutano il modello a modellare le risposte in base all'ambiente corrente, ad esempio scrivendo risposte più brevi sul cellulare, senza inquinare la memoria a lungo termine.</p>
<p><strong>Messaggi della sessione corrente</strong></p>
<p>È la cronologia standard a finestra scorrevole: tutti i messaggi della conversazione corrente fino al raggiungimento del limite di token. Quando la finestra diventa troppo grande, i turni più vecchi vengono eliminati automaticamente.</p>
<p>L'eliminazione <strong>non</strong> riguarda la memoria utente o i riepiloghi delle sessioni. Solo la cronologia locale delle conversazioni si riduce.</p>
<p>La più grande divergenza da Claude appare nel modo in cui ChatGPT gestisce le conversazioni "recenti ma non attuali". Claude chiama uno strumento di ricerca per recuperare il contesto passato se lo ritiene rilevante. ChatGPT non lo fa.</p>
<p>Invece, ChatGPT mantiene un leggerissimo <strong>riepilogo trasversale alle sessioni</strong> che viene iniettato in ogni conversazione. Alcuni dettagli chiave su questo livello:</p>
<ul>
<li><p>Riassume <strong>solo i messaggi degli utenti</strong>, non quelli degli assistenti.</p></li>
<li><p>Memorizza un insieme molto ridotto di elementi, circa 15, sufficienti a catturare temi o interessi stabili.</p></li>
<li><p><strong>Non</strong> esegue <strong>calcoli di incorporazione, né classifica la somiglianza, né effettua chiamate di recupero</strong>. In pratica si tratta di un contesto pre-masticato, non di una ricerca dinamica.</p></li>
</ul>
<p>Da un punto di vista ingegneristico, questo approccio scambia la flessibilità con la prevedibilità. Non c'è la possibilità di uno strano errore di recupero e la latenza dell'inferenza rimane stabile perché non viene recuperato nulla al volo. Lo svantaggio è che ChatGPT non recupererà un messaggio casuale di sei mesi fa, a meno che non sia stato inserito nel livello di riepilogo.</p>
<h2 id="Challenges-to-Making-Agent-Memory-Writable" class="common-anchor-header">Sfide nel rendere la memoria dell'agente scrivibile<button data-href="#Challenges-to-Making-Agent-Memory-Writable" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando un agente passa dalla <strong>memoria di sola lettura</strong> (tipica RAG) alla <strong>memoria scrivibile, dove</strong>può registrare le azioni, le decisioni e le preferenze degli utenti, la complessità aumenta rapidamente. Non si tratta più solo di recuperare documenti, ma di mantenere uno stato crescente da cui dipende il modello.</p>
<p>Un sistema di memoria scrivibile deve risolvere tre problemi reali:</p>
<ol>
<li><p><strong>Cosa ricordare:</strong> L'agente ha bisogno di regole per decidere quali eventi, preferenze o osservazioni vale la pena conservare. Senza queste regole, la memoria esplode in dimensioni o si riempie di rumore.</p></li>
<li><p><strong>Come immagazzinare e gestire la memoria:</strong> Non tutta la memoria è uguale. Gli elementi recenti, i fatti a lungo termine e gli appunti effimeri necessitano di diversi livelli di archiviazione, politiche di conservazione e strategie di indicizzazione.</p></li>
<li><p><strong>Come scrivere velocemente senza interrompere il recupero:</strong> La memoria deve essere scritta continuamente, ma gli aggiornamenti frequenti possono degradare la qualità dell'indice o rallentare le query se il sistema non è progettato per inserti ad alta velocità.</p></li>
</ol>
<h3 id="Challenge-1-What-Is-Worth-Remembering" class="common-anchor-header">Sfida 1: Cosa vale la pena ricordare?</h3><p>Non tutto ciò che un utente fa deve finire nella memoria a lungo termine. Se qualcuno crea un file temporaneo e lo cancella cinque minuti dopo, registrarlo per sempre non aiuta nessuno. Questa è la difficoltà principale: <strong>come fa il sistema a decidere cosa conta davvero?</strong></p>
<p><strong>(1) Modi comuni per giudicare l'importanza</strong></p>
<p>I team di solito si affidano a un mix di euristiche:</p>
<ul>
<li><p><strong>basate sul tempo</strong>: le azioni recenti contano più di quelle vecchie</p></li>
<li><p><strong>basata sulla frequenza</strong>: i file o le azioni a cui si accede ripetutamente sono più importanti</p></li>
<li><p><strong>Basata sul tipo</strong>: alcuni oggetti sono intrinsecamente più importanti (ad esempio, i file di configurazione del progetto rispetto ai file della cache).</p></li>
</ul>
<p><strong>(2) Quando le regole sono in conflitto</strong></p>
<p>Questi segnali sono spesso in conflitto. Un file creato la settimana scorsa ma modificato pesantemente oggi: deve prevalere l'età o l'attività? Non esiste un'unica risposta "corretta", ed è per questo che il punteggio di importanza tende a diventare rapidamente disordinato.</p>
<p><strong>(3) Come aiutano i database vettoriali</strong></p>
<p>I database vettoriali offrono dei meccanismi per applicare le regole di importanza senza doverle ripulire manualmente:</p>
<ul>
<li><p><strong>TTL:</strong> Milvus può rimuovere automaticamente i dati dopo un determinato periodo di tempo.</p></li>
<li><p><strong>Decadimento: i</strong> vettori più vecchi possono essere declassati in modo da scomparire naturalmente dal recupero.</p></li>
</ul>
<h3 id="Challenge-2-Memory-Tiering-in-Practice" class="common-anchor-header">Sfida 2: la gestione della memoria nella pratica</h3><p>Quando gli agenti funzionano più a lungo, la memoria si accumula. Mantenere tutto nella memoria veloce non è sostenibile, quindi il sistema ha bisogno di un modo per dividere la memoria in livelli <strong>caldi</strong> (a cui si accede frequentemente) e <strong>freddi</strong> (a cui si accede raramente).</p>
<p><strong>(1) Decidere quando la memoria diventa fredda</strong></p>
<p>In questo modello, la <em>memoria calda</em> si riferisce ai dati mantenuti nella RAM per un accesso a bassa latenza, mentre la <em>memoria fredda</em> si riferisce ai dati spostati su disco o su oggetti per ridurre i costi.</p>
<p>La decisione su quando la memoria diventa fredda può essere gestita in modi diversi. Alcuni sistemi utilizzano modelli leggeri per stimare l'importanza semantica di un'azione o di un file in base al suo significato e all'uso recente. Altri si basano su una semplice logica basata su regole, come lo spostamento della memoria che non è stata consultata per 30 giorni o che non è apparsa nei risultati di ricerca per una settimana. Gli utenti possono anche contrassegnare esplicitamente alcuni file o azioni come importanti, garantendo che rimangano sempre caldi.</p>
<p><strong>(2) Dove vengono conservate le memorie calde e fredde</strong></p>
<p>Una volta classificate, le memorie calde e fredde vengono archiviate in modo diverso. La memoria calda rimane nella RAM e viene utilizzata per i contenuti a cui si accede di frequente, come il contesto delle attività attive o le azioni recenti dell'utente. La memoria fredda viene spostata su disco o su sistemi di archiviazione a oggetti come S3, dove l'accesso è più lento ma i costi di archiviazione sono molto più bassi. Questo compromesso funziona bene perché la memoria fredda è raramente necessaria e di solito vi si accede solo per riferimenti a lungo termine.</p>
<p><strong>(3) Come aiutano i database vettoriali</strong></p>
<p><strong>Milvus e Zilliz Cloud</strong> supportano questo modello consentendo l'archiviazione a livelli caldo-freddo e mantenendo un'unica interfaccia di interrogazione, in modo che i vettori a cui si accede di frequente rimangano in memoria e i dati più vecchi si spostino automaticamente in uno storage a basso costo.</p>
<h3 id="Challenge-3-How-Fast-Should-Memory-Be-Written" class="common-anchor-header">Sfida 3: Qual è la velocità di scrittura della memoria?</h3><p>I sistemi RAG tradizionali di solito scrivono i dati in batch. Gli indici vengono ricostruiti offline, spesso durante la notte, e diventano ricercabili solo successivamente. Questo approccio funziona per le basi di conoscenza statiche, ma non è adatto alla memoria degli agenti.</p>
<p><strong>(1) Perché la memoria degli agenti ha bisogno di scritture in tempo reale</strong></p>
<p>La memoria dell'agente deve catturare le azioni dell'utente nel momento in cui avvengono. Se un'azione non viene registrata immediatamente, il successivo turno di conversazione potrebbe essere privo di un contesto critico. Per questo motivo, i sistemi di memoria scrivibile richiedono scritture in tempo reale piuttosto che aggiornamenti ritardati e offline.</p>
<p><strong>(2) La tensione tra velocità di scrittura e qualità di recupero</strong></p>
<p>La memoria in tempo reale richiede una latenza di scrittura molto bassa. Allo stesso tempo, un recupero di alta qualità dipende da indici ben costruiti e la costruzione di un indice richiede tempo. Ricostruire un indice per ogni scrittura è troppo costoso, ma ritardare l'indicizzazione significa che i dati appena scritti rimangono temporaneamente invisibili al recupero. Questo compromesso è al centro della progettazione della memoria scrivibile.</p>
<p><strong>(3) Come aiutano i database vettoriali</strong></p>
<p>I database vettoriali risolvono questo problema disaccoppiando la scrittura dall'indicizzazione. Una soluzione comune è lo streaming delle scritture e la creazione di indici incrementali. Utilizzando <strong>Milvus</strong> come esempio, i nuovi dati vengono prima scritti in un buffer in-memory, consentendo al sistema di gestire in modo efficiente le scritture ad alta frequenza. Anche prima della creazione di un indice completo, i dati del buffer possono essere interrogati in pochi secondi attraverso la fusione dinamica o la ricerca approssimativa.</p>
<p>Quando il buffer raggiunge una soglia predefinita, il sistema costruisce indici in batch e li persiste. Questo migliora le prestazioni di recupero a lungo termine senza bloccare le scritture in tempo reale. Separando l'ingestione veloce dalla costruzione più lenta degli indici, Milvus raggiunge un equilibrio pratico tra velocità di scrittura e qualità di ricerca che funziona bene per la memoria degli agenti.</p>
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
    </button></h2><p>Cowork ci fa intravedere una nuova classe di agenti, persistenti, statici e in grado di trasportare il contesto su lunghe linee temporali. Ma chiarisce anche un altro aspetto: la memoria a lungo termine è solo metà del quadro. Per costruire agenti pronti per la produzione, autonomi e affidabili, abbiamo ancora bisogno di un recupero strutturato su basi di conoscenza ampie e in evoluzione.</p>
<p>La RAG gestisce i fatti del mondo; la memoria scrivibile gestisce lo stato interno dell'agente. I database vettoriali si trovano all'intersezione, fornendo indicizzazione, ricerca ibrida e archiviazione scalabile che consentono a entrambi i livelli di lavorare insieme.</p>
<p>Man mano che gli agenti di lunga durata continueranno a maturare, le loro architetture probabilmente convergeranno verso questo design ibrido. Cowork è un segnale forte della direzione che si sta prendendo: non verso un mondo senza RAG, ma verso agenti con stack di memoria più ricchi alimentati da database vettoriali sottostanti.</p>
<p>Se volete esplorare queste idee o ricevere aiuto per la vostra configurazione, <strong>unitevi al nostro</strong> <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canale Slack</a> per chiacchierare con gli ingegneri Milvus. E per una guida più pratica, potete sempre <strong>prenotare una</strong> <strong>sessione di</strong> <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>Milvus Office Hours</strong></a> <strong>.</strong></p>
