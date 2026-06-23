---
id: claude-code-context-management-tools.md
title: >
  I 7 migliori strumenti open source per la gestione del contesto del codice di
  Claude
author: Cheney Zhang
date: 2026-5-7
cover: assets.zilliz.com/Chat_GPT_Image_Jun_22_2026_07_49_53_PM_11zon_d1a8de60bd.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Claude Code context, Claude Code tools, token management, MCP code search, AI
  agent memory
meta_title: |
  7 Best Open-Source Tools for Claude Code Context Management
desc: >
  Le sessioni di Long Claude Code perdono rapidamente il segnale. Scopri 7
  strumenti per ridurre il rumore del terminale, il recupero del codice,
  l'output degli strumenti, l'utilizzo della memoria e dei token.
origin: 'https://milvus.io/blog/claude-code-context-management-tools.md'
---
<p>È possibile fornire a Claude Code una finestra di contesto di 1 milione di token e ottenere comunque risposte sempre peggiori col passare del tempo. Il problema non è solo la dimensione del contesto, ma anche la sua qualità.</p>
<p>Le sessioni di Claude Code si deteriorano quando i log del terminale, l’output grezzo degli strumenti, le letture ripetute di file, le risposte verbose e la cronologia del progetto dimenticata competono tutti per l’attenzione. Nei flussi di lavoro degli agenti di lunga durata, quel rumore si trasforma in un circolo vizioso: il modello perde il filo del discorso, si aggiungono ulteriori turni per correggere la risposta e quei turni extra aggiungono ancora più rumore.</p>
<p>Si tratta di <strong>“sfocatura del contesto</strong>”: il modello ha spazio sufficiente per contenere le informazioni, ma quelle importanti sono sepolte sotto un contesto di scarso rilievo. Finestre più ampie possono rendere più facile ignorare questo problema, poiché gli sviluppatori smettono di riflettere attentamente su ciò che inseriscono nel prompt.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_13_3e7a004cd6.png" alt="Prompt caching diagram showing how reused prefixes can still add billed context across turns" class="doc-image" id="prompt-caching-diagram-showing-how-reused-prefixes-can-still-add-billed-context-across-turns" /> 
   <span>Diagramma della memorizzazione temporanea dei prompt che mostra come i prefissi riutilizzati possano comunque aggiungere contesto a pagamento tra un turno e l’altro</span>
  
 </span></p>
<p>La memorizzazione del prompt può ridurre il costo dei prefissi ripetuti, ma non trasforma la finestra di contesto in un cassetto delle cianfrusaglie. Si pagano comunque i nuovi token e si ha ancora bisogno che il modello ragioni sulle informazioni giuste.</p>
<p>Questo articolo esamina sette strumenti open-source che affrontano la perdita di focus contestuale da diversi livelli: output del terminale, output degli strumenti, navigazione nel codice sorgente, lettura dei file, verbosità del modello, recupero semantico del codice e memoria tra sessioni. Spiega inoltre come queste idee si colleghino alla progettazione <a href="https://zilliz.com/learn/what-is-vector-database">di database vettoriali</a>, <a href="https://zilliz.com/learn/vector-similarity-search">alla ricerca di similarità vettoriale</a> e a sistemi di recupero come Milvus.</p>
<h2 id="What-causes-Claude-Code-context-defocus" class="common-anchor-header">Cosa causa la perdita di contesto in Claude Code?<button data-href="#What-causes-Claude-Code-context-defocus" class="anchor-icon" translate="no">
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
    </button></h2><p>La perdita di contesto in Claude Code deriva solitamente da cinque modalità di errore: troppo testo grezzo di istruzioni, output rumoroso degli strumenti, esplorazione ripetuta del codice sorgente, risposte lunghe del modello e lacune di memoria tra sessioni o agenti.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_15_56a2da172a.png" alt="Five causes of Claude Code context loss: redundant instructions, messy tool output, repeated codebase retrieval, long responses, and memory gaps" class="doc-image" id="five-causes-of-claude-code-context-loss:-redundant-instructions,-messy-tool-output,-repeated-codebase-retrieval,-long-responses,-and-memory-gaps" /> 
   <span>Cinque cause della perdita di contesto in Claude Code: istruzioni ridondanti, output disordinato degli strumenti, recupero ripetuto del codice sorgente, risposte lunghe e lacune di memoria</span>
  
 </span></p>
<table>
<thead>
<tr><th>Modalità di errore del contesto</th><th>Come si manifesta in Claude Code</th><th>Categoria di strumenti utili</th></tr>
</thead>
<tbody>
<tr><td>I log del terminale sono rumorosi</td><td><code translate="no">git</code>, <code translate="no">pytest</code>, <code translate="no">gh</code>, e le CLI cloud generano più testo di quanto ne serva al modello.</td><td>Compressione dell’output della CLI</td></tr>
<tr><td>Gli output degli strumenti inondano la finestra</td><td>I log di test, i dump DOM e gli output MCP vengono inseriti nella chat come enormi blocchi di dati grezzi.</td><td>Sandboxing dell’output degli strumenti</td></tr>
<tr><td>La navigazione nel codice si ripete</td><td>Claude elenca le directory, esegue il grep, legge i file e ripete la stessa esplorazione in ogni sessione.</td><td>Grafico del codice o recupero semantico</td></tr>
<tr><td>La lettura dei file è troppo estesa</td><td>Il modello legge un intero file quando gli servirebbe solo un simbolo o un riassunto.</td><td>Lettura progressiva del codice</td></tr>
<tr><td>Claude parla troppo</td><td>La risposta stessa aggiunge un contesto superfluo per i turni successivi.</td><td>Compressione della risposta</td></tr>
<tr><td>La memoria non persiste</td><td>Si devono spiegare nuovamente le decisioni relative al progetto ogni volta che si avvia una nuova sessione.</td><td>Memoria basata su Markdown</td></tr>
</tbody>
</table>
<p>Un buon sistema di gestione del contesto dovrebbe fare tre cose: tenere fuori le informazioni superflue, recuperare le giuste conoscenze relative al progetto su richiesta e conservare le decisioni definitive tra una sessione e l’altra.</p>
<h2 id="Which-Claude-Code-context-tool-should-you-use-first" class="common-anchor-header">Quale strumento di contesto Claude Code dovresti usare per primo?<button data-href="#Which-Claude-Code-context-tool-should-you-use-first" class="anchor-icon" translate="no">
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
    </button></h2><p>Inizia dal livello che crea più rumore nel tuo flusso di lavoro. Se il problema è l’output del terminale, inizia con RTK. Se Claude continua a vagare in un repository di grandi dimensioni, inizia con claude-context o code-review-graph. Se la tua vera seccatura è dover spiegare ogni giorno le stesse decisioni, inizia con memsearch.</p>
<table>
<thead>
<tr><th>Strumento</th><th>Problema principale che risolve</th><th>Ideale per</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/rtk-ai/rtk">RTK</a></td><td>Output del terminale rumoroso dovuto ai comandi comuni degli sviluppatori.</td><td>Sviluppatori che eseguono numerosi comandi CLI all'interno di Claude Code.</td></tr>
<tr><td><a href="https://github.com/mksglu/context-mode">Modalità contesto</a></td><td>Enormi quantità di output grezzi degli strumenti che entrano nella conversazione principale.</td><td>Utenti intensivi di Playwright, GitHub, log o strumenti MCP.</td></tr>
<tr><td><a href="https://github.com/tirth8205/code-review-graph">code-review-graph</a></td><td>Esplorazione alla cieca del codice in repository di grandi dimensioni.</td><td>Revisioni, analisi delle dipendenze e domande sul raggio d'azione.</td></tr>
<tr><td><a href="https://github.com/Mibayy/token-savior">Token Savior</a></td><td>Lettura completa dei file quando basterebbe un riepilogo dei simboli.</td><td>File di grandi dimensioni, ricerche ripetute di simboli e lettura incrementale del codice.</td></tr>
<tr><td><a href="https://github.com/JuliusBrussee/caveman">Caveman</a></td><td>L'abitudine di Claude a fornire risposte prolisse.</td><td>Utenti che desiderano un output conciso e un contesto futuro più ridotto.</td></tr>
<tr><td><a href="https://github.com/zilliztech/claude-context">claude-context</a></td><td>Riesplorazione del codice in ogni sessione.</td><td>Ricerca semantica del codice tramite MCP.</td></tr>
<tr><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>Perdita della memoria del progetto tra sessioni, agenti e cambi di modello.</td><td>Progetti di lunga durata con decisioni e insegnamenti duraturi.</td></tr>
</tbody>
</table>
<p>I primi cinque strumenti riducono ciò che entra o rimane nel contesto. Gli ultimi due rendono più facile richiamare il contesto utile.</p>
<h2 id="RTK-compresses-raw-command-output-before-Claude-sees-it" class="common-anchor-header">RTK comprime l’output grezzo dei comandi prima che Claude lo veda<button data-href="#RTK-compresses-raw-command-output-before-Claude-sees-it" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rtk_de6e8e7fb3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>RTK è un proxy CLI che riduce l’utilizzo di token nei comandi comuni degli sviluppatori. La sua descrizione su GitHub afferma che riduce il consumo di token LLM del 60-90% nei comandi di sviluppo più comuni ed è distribuito come singolo binario Rust.</p>
<p>Nell’uso quotidiano di Claude Code, comandi come <code translate="no">git status</code>, <code translate="no">pytest</code> e gli elenchi delle directory spesso riversano informazioni complete sull’ambiente e descrizioni dello stato nella finestra del contesto. Il modello di solito necessita solo di una risposta più concisa: quali file sono stati modificati, quale test è fallito, dove si è bloccato il PR o quali file chiave esistono nella directory.</p>
<p>RTK si colloca tra la shell e Claude. È in grado di riscrivere i comandi tramite gli hook di Claude Code e restituire un output compresso.</p>
<p>Output grezzo di <code translate="no">git status</code>:</p>
<pre><code translate="no" class="language-bash">On branch feat/payment-retry
Your branch is up to <span class="hljs-built_in">date</span> with <span class="hljs-string">&#x27;origin/feat/payment-retry&#x27;</span>.

Changes not staged <span class="hljs-keyword">for</span> commit:
  modified:   src/webhook/handler.ts
  modified:   src/queue/dlq.ts
  modified:   tests/webhook.test.ts

Untracked files:
  docs/notes.md

no changes added to commit
<button class="copy-code-btn"></button></code></pre>
<p>Ciò che conta davvero:</p>
<pre><code translate="no" class="language-bash">3 modified, 1 untracked
- src/webhook/handler.ts
- src/queue/dlq.ts
- tests/webhook.test.ts
<button class="copy-code-btn"></button></code></pre>
<p>Stessa storia con ` <code translate="no">pytest</code>`. L’output grezzo è pieno di casi superati e rumore ambientale:</p>
<pre><code translate="no" class="language-markdown">============================= <span class="hljs-built_in">test</span> session starts =============================
platform darwin -- Python 3.12.4, pytest-8.4.1
collected 128 items

tests/test_auth.py ....................................
tests/test_webhook.py ....F....
tests/test_queue.py ...................................

================================== FAILURES ==================================
________________ test_retry_to_dlq __________________
E   AssertionError: expected status code 202, got 500
<button class="copy-code-btn"></button></code></pre>
<p>Una volta compresso, il segnale è immediato:</p>
<pre><code translate="no" class="language-apache">128 tests collected, 1 failed
FAIL tests/test_webhook.py::test_retry_to_dlq
AssertionError: expected status code 202, got 500
<button class="copy-code-btn"></button></code></pre>
<p>RTK è il punto di partenza più semplice quando il sovraccarico di contesto deriva dai comandi della shell piuttosto che dal recupero del codice.</p>
<h2 id="Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="common-anchor-header">La modalità Context isola gli output di strumenti di grandi dimensioni al di fuori della chat principale<button data-href="#Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="anchor-icon" translate="no">
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
    </button></h2><p>La Modalità Contesto è progettata per i blocchi grezzi restituiti dagli strumenti: log di test, istantanee DOM del browser, payload GitHub, output degli strumenti MCP e pagine estratte. La sua descrizione su GitHub evidenzia l’ottimizzazione della finestra di contesto per gli agenti di codifica basati sull’IA e riporta una riduzione del 98% dell’output degli strumenti.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_5_f00e17ea6f.png" alt="Context Mode GitHub repository card showing sandboxed tool output and context optimization positioning" class="doc-image" id="context-mode-github-repository-card-showing-sandboxed-tool-output-and-context-optimization-positioning" /> 
   <span>Scheda del repository GitHub della Modalità Contesto che mostra l’output degli strumenti isolato in una sandbox e il posizionamento dell’ottimizzazione del contesto</span>
  
 </span></p>
<p>Il suo approccio consiste nell’isolare i grandi output degli strumenti in una sandbox locale e in un indice, per poi trasmettere alla conversazione di Claude solo i riassunti e gli handle di recupero.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_12_32e50fec44.png" alt="Context Mode flow showing large tool output moving through sandbox execution, SQLite or FTS indexes, summaries, and retrieval results" class="doc-image" id="context-mode-flow-showing-large-tool-output-moving-through-sandbox-execution,-sqlite-or-fts-indexes,-summaries,-and-retrieval-results" /> 
   <span>Flusso di Context Mode che mostra l’output di grandi dimensioni degli strumenti che passa attraverso l’esecuzione in sandbox, gli indici SQLite o FTS, i riassunti e i risultati del recupero</span>
  
 </span></p>
<p>Il flusso è utile perché un agente di codifica spesso ha bisogno del nodo che ha generato l’errore, del selettore non funzionante o della traccia dello stack pertinente, non dell’intero DOM o di ogni riga di test superata. Context Mode mantiene l’output completo disponibile localmente, impedendo al contempo che esso domini la conversazione principale.</p>
<p>Questo è simile al modo in cui i sistemi <a href="https://zilliz.com/blog/hybrid-search-with-milvus">di ricerca ibridi</a> di produzione separano l’archiviazione dal recupero. Si conservano i dati grezzi in un luogo durevole, per poi recuperare solo la porzione che conta.</p>
<h2 id="code-review-graph-maps-code-structure-before-Claude-navigates-it" class="common-anchor-header">code-review-graph mappa la struttura del codice prima che Claude la analizzi<button data-href="#code-review-graph-maps-code-structure-before-Claude-navigates-it" class="anchor-icon" translate="no">
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
    </button></h2><p>code-review-graph affronta un problema diverso: Claude non ha sempre bisogno di più testo, ma di una mappa migliore.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_8_6d4632f3c9.png" alt="code-review-graph logo image used in the original article" class="doc-image" id="code-review-graph-logo-image-used-in-the-original-article" /> 
   <span>Immagine del logo di code-review-graph utilizzata nell’articolo originale</span>
  
 </span></p>
<p>In un repository di grandi dimensioni, una semplice domanda può innescare un’esplorazione dispendiosa:</p>
<blockquote>
<p>Dopo aver modificato questa logica di accesso, quali file e test ne risentono?</p>
</blockquote>
<p>Senza un grafico del codice, la mossa tipica di Claude è:</p>
<pre><code translate="no" class="language-perl"><span class="hljs-built_in">read</span> auth.ts
grep login
<span class="hljs-built_in">read</span> middleware
<span class="hljs-built_in">read</span> tests
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>code-review-graph crea in anticipo una mappa strutturale del codice. Utilizza Tree-sitter per analizzare funzioni, classi, importazioni, relazioni di chiamata, ereditarietà e dipendenze dei test, quindi scrive il grafico in SQLite.</p>
<p>Ciò lo rende utile per la revisione del codice e l’analisi del raggio d’azione. Invece di chiedere a Claude di riscoprire il grafico delle dipendenze attraverso letture ripetute, gli si permette di interrogare prima la struttura.</p>
<p>Si tratta di un approccio affine alla <a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">ricerca semantica</a>, ma non identico. Un grafico strutturale risponde alla domanda «cosa dipende da cosa?», mentre il recupero semantico risponde a «quale codice è concettualmente correlato a questa domanda?». Nei flussi di lavoro reali con un assistente di codice, spesso si desidera entrambi.</p>
<h2 id="Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="common-anchor-header">Token Savior fornisce a Claude riepiloghi dei simboli prima dei file completi<button data-href="#Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="anchor-icon" translate="no">
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
    </button></h2><p>L’idea alla base di Token Savior è semplice: non inviare il file completo per impostazione predefinita. Invia prima un indice o un riepilogo dei simboli, quindi espandi solo quando l’attività richiede maggiori dettagli.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_10_5f63ad36d1.png" alt="Token Savior GitHub repository card showing its MCP server description and project statistics" class="doc-image" id="token-savior-github-repository-card-showing-its-mcp-server-description-and-project-statistics" /> 
   <span>Scheda del repository GitHub di Token Savior che mostra la descrizione del server MCP e le statistiche del progetto</span>
  
 </span></p>
<p>Se si chiede dove viene gestito un webhook di pagamento, spesso il modello non ha bisogno di ogni riga di ogni file correlato. Deve innanzitutto sapere se un file o un simbolo è rilevante.</p>
<p>Token Savior fornisce il codice a livelli:</p>
<table>
<thead>
<tr><th>Livello</th><th>Cosa riceve Claude</th><th>Quando espande</th></tr>
</thead>
<tbody>
<tr><td>Riepilogo</td><td>Indice, nomi dei simboli e brevi descrizioni.</td><td>Prima risposta predefinita.</td></tr>
<tr><td>Frammento</td><td>Una sezione di codice più breve relativa al simbolo in questione.</td><td>Quando il riassunto è probabilmente pertinente.</td></tr>
<tr><td>File completo</td><td>Il contenuto completo del file.</td><td>Solo quando la modifica o un'analisi approfondita lo richiedono.</td></tr>
</tbody>
</table>
<p>Questo rispecchia il modo in cui gli sviluppatori leggono effettivamente il codice. Si esegue una scansione, si conferma la rilevanza, quindi si apre il file completo solo quando necessario. Assomiglia inoltre al modello di recupero progressivo utilizzato nelle <a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">applicazioni RAG</a>: recuperare in modo sufficientemente ampio per orientarsi, quindi restringere il contesto prima della generazione.</p>
<h2 id="Caveman-reduces-Claudes-own-response-bloat" class="common-anchor-header">Caveman riduce il sovraccarico delle risposte di Claude<button data-href="#Caveman-reduces-Claudes-own-response-bloat" class="anchor-icon" translate="no">
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
    </button></h2><p>La maggior parte degli strumenti contestuali si concentra su ciò che viene immesso nel modello. Caveman si concentra invece su ciò che Claude produce.</p>
<p>Caveman è una skill/plugin di Claude Code che elimina riempitivi, convenevoli, frasi di contorno, spiegazioni eccessive e strutture ripetitive. L’obiettivo non è rimuovere la conoscenza, ma rendere la risposta più concisa.</p>
<p>Senza Caveman:</p>
<blockquote>
<p>Il motivo per cui il tuo componente React viene renderizzato nuovamente è probabilmente perché…</p>
</blockquote>
<p>Con Caveman:</p>
<blockquote>
<p>Nuovo riferimento all’oggetto ad ogni rendering. Prop dell’oggetto in linea = nuovo riferimento = nuovo rendering. Avvolgi in useMemo.</p>
</blockquote>
<p>Questo è importante perché le risposte di Claude stesso diventano il contesto futuro. Se ogni risposta include una lunga spiegazione, il turno successivo inizia con più testo del necessario. Risposte più concise possono migliorare il turno successivo tanto quanto migliorano quello attuale.</p>
<p>Per i team che stanno valutando <a href="https://zilliz.com/blog/context-engineering-for-ai-agents">l’ingegneria del contesto per gli agenti di IA</a>, Caveman ricorda che la politica di output fa parte della politica di contesto.</p>
<h2 id="claude-context-adds-semantic-code-search-through-MCP" class="common-anchor-header">claude-context aggiunge la ricerca semantica del codice tramite MCP<button data-href="#claude-context-adds-semantic-code-search-through-MCP" class="anchor-icon" translate="no">
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
    </button></h2><p>claude-context risolve il problema dell’esplorazione ripetuta del codice sorgente grazie al recupero semantico. Indice un repository, memorizza frammenti di codice in un database vettoriale ed espone la ricerca tramite il <a href="https://zilliz.com/glossary/model-context-protocol-%28mcp%29">Model Context Protocol</a>.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_2_a0cc547fe3.png" alt="Claude Context repository shown on GitHub Trending in the original article" class="doc-image" id="claude-context-repository-shown-on-github-trending-in-the-original-article" /> 
   <span>Repository di Claude Context mostrato su GitHub In primo piano nell’articolo originale</span>
  
 </span></p>
<p>In un codice sorgente di grandi dimensioni, si pongono costantemente domande a Claude del tipo:</p>
<blockquote>
<p>Aiutami a capire quali parti del codice potrebbero essere correlate a questo bug.</p>
</blockquote>
<p>Senza un livello di recupero, l’approccio predefinito di Claude è spesso:</p>
<pre><code translate="no" class="language-perl">list the directory
grep around
<span class="hljs-built_in">read</span> a bunch of files
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>claude-context trasferisce tale lavoro in un livello di recupero. Suddivide il repository in segmenti, genera embedding, li memorizza in un <a href="https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md">indice di codice basato su Milvus</a> e recupera i segmenti di codice rilevanti prima che il modello inizi a leggere i file alla cieca.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_11_f9d952830d.png" alt="claude-context flow showing codebase chunking, embeddings, vector database and hybrid search, relevant code retrieval, and Claude context injection" class="doc-image" id="claude-context-flow-showing-codebase-chunking,-embeddings,-vector-database-and-hybrid-search,-relevant-code-retrieval,-and-claude-context-injection" /> 
   <span>Flusso di claude-context che mostra la suddivisione in blocchi del codice sorgente, gli embedding, il database vettoriale e la ricerca ibrida, il recupero del codice pertinente e l’iniezione del contesto in Claude</span>
  
 </span></p>
<p>È qui che gli strumenti di programmazione basati sull’IA iniziano ad assomigliare ai sistemi di ricerca. Sono necessari suddivisione in segmenti, embedding, metadati, corrispondenza lessicale, classificazione e aggiornamento. Questi sono gli stessi elementi fondamentali alla base <a href="https://zilliz.com/blog/top-10-context-engineering-techniques-you-should-know-for-production-rag">del recupero RAG in produzione</a>, <a href="https://milvus.io/blog/build-smarter-rag-routing-hybrid-retrieval.md">dell’instradamento del recupero ibrido</a> e <a href="https://milvus.io/blog/choose-embedding-model-rag-2026.md">della selezione del modello di embedding</a>.</p>
<h2 id="memsearch-keeps-useful-memory-across-sessions-and-agents" class="common-anchor-header">memsearch conserva la memoria utile tra le sessioni e gli agenti<button data-href="#memsearch-keeps-useful-memory-across-sessions-and-agents" class="anchor-icon" translate="no">
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
    </button></h2><p>memsearch affronta il lato opposto del problema: non cosa dimenticare, ma come richiamare ciò che conta.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_7_d39c2f200e.png" alt="memsearch logo image from the original article" class="doc-image" id="memsearch-logo-image-from-the-original-article" /> 
   <span>Immagine del logo di memsearch tratta dall’articolo originale</span>
  
 </span></p>
<p>Immaginate di dire a Claude lunedì:</p>
<blockquote>
<p>Il nostro webhook non può riprovare in caso di errore: gli eventi falliti devono essere inseriti in una coda di messaggi non recapitati.</p>
</blockquote>
<p>Mercoledì, apri una nuova sessione e chiedi:</p>
<blockquote>
<p>Cos’altro possiamo ottimizzare nel livello del webhook?</p>
</blockquote>
<p>Senza una memoria persistente, Claude considera la decisione di lunedì come se non fosse mai stata presa. Glielo spieghi di nuovo.</p>
<p>memsearch memorizza i dati come file Markdown locali e leggibili dall’uomo e utilizza Milvus come indice di recupero ricostruibile. Questo design mantiene i dati modificabili dall’uomo, pur rendendoli ricercabili dagli agenti.</p>
<p>Al momento del recupero, memsearch utilizza il richiamo progressivo: prima si effettua la ricerca, poi si espande se necessario, e solo quando è indispensabile si scende in profondità fino alla trascrizione originale.</p>
<p><span class="img-wrapper">
  
   <img translate="no" src="https://assets.zilliz.com/20260507_210137_73d4b0b8ea.png" alt="memsearch progressive retrieval flow showing search, expand, transcript, and summarized return to the main conversation" class="doc-image" id="memsearch-progressive-retrieval-flow-showing-search,-expand,-transcript,-and-summarized-return-to-the-main-conversation" /> 
   <span>Flusso di recupero progressivo di memsearch che mostra ricerca, espansione, trascrizione e ritorno sintetizzato alla conversazione principale</span>
  
 </span></p>
<p>Questo modello «Markdown-first» è utile per i team che lavorano su più sessioni, modelli e agenti. Si integra inoltre in modo naturale con <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">la memoria a lungo termine degli agenti IA</a>, <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">la memoria condivisa tra più agenti</a> e la questione più ampia di prevenire <a href="https://zilliz.com/ai-faq/can-context-engineering-help-reduce-context-rot">il deterioramento del contesto nei sistemi di agenti</a>.</p>
<h2 id="How-do-these-tools-work-together" class="common-anchor-header">Come interagiscono questi strumenti?<button data-href="#How-do-these-tools-work-together" class="anchor-icon" translate="no">
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
    </button></h2><p>I sette strumenti sono complementari, non intercambiabili. Utilizzateli come livelli.</p>
<table>
<thead>
<tr><th>Livello</th><th>Utilizzate questi strumenti</th><th>Perché</th></tr>
</thead>
<tbody>
<tr><td>Rimuovere il rumore dei comandi</td><td>RTK</td><td>Comprimere l'output del terminale ad alto volume prima che raggiunga Claude.</td></tr>
<tr><td>Metti in sandbox l'output grezzo dello strumento</td><td>Modalità contesto</td><td>Mantenere log di grandi dimensioni, DOM e payload degli strumenti al di fuori della conversazione principale.</td></tr>
<tr><td>Mappa della struttura del codice</td><td>grafico-di-revisione-del-codice</td><td>Rispondi alle domande sulle dipendenze e sul raggio d'azione senza dover leggere i file alla cieca.</td></tr>
<tr><td>Leggi il codice in modo progressivo</td><td>Token Savior</td><td>Inizia con i riassunti dei simboli, poi espandi solo se necessario.</td></tr>
<tr><td>Comprimere le risposte di Claude</td><td>Caveman</td><td>Evita che l'output del modello stesso appesantisca il contesto futuro.</td></tr>
<tr><td>Recupera il codice pertinente</td><td>claude-context</td><td>Utilizzare la ricerca semantica e ibrida del codice invece di ripetuti cicli grep.</td></tr>
<tr><td>Riutilizzare le decisioni durature</td><td>memsearch</td><td>Richiamare la cronologia del progetto tra sessioni, agenti e cambi di modello.</td></tr>
</tbody>
</table>
<p>Un ordine pratico di implementazione è:</p>
<ol>
<li><strong>Elimina prima il rumore evidente.</strong> Aggiungi RTK o la modalità Context se l'output della shell e i payload degli strumenti dominano il tuo contesto.</li>
<li><strong>Migliora la navigazione nel repository.</strong> Aggiungi code-review-graph per la struttura o claude-context per il recupero semantico del codice.</li>
<li><strong>Controlla ciò che rimane.</strong> Usa Token Savior e Caveman per mantenere compatte le letture dei file e le risposte dei modelli.</li>
<li><strong>Conserva la conoscenza duratura.</strong> Usa memsearch quando le spiegazioni ripetute diventano il collo di bottiglia.</li>
</ol>
<h2 id="Keep-in-touch" class="common-anchor-header">Resta in contatto<button data-href="#Keep-in-touch" class="anchor-icon" translate="no">
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
<li>Unisciti alla <a href="https://discord.com/invite/8uyFbECzPX">community Milvus su Discord</a> per porre domande e confrontare i modelli di gestione del contesto con altri sviluppatori.</li>
<li><a href="https://milvus.io/office-hours">Prenota una sessione gratuita di "Office Hours" di Milvus</a> se hai bisogno di aiuto per progettare un livello di recupero per carichi di lavoro relativi a codice, memoria o RAG.</li>
<li>Se preferisci evitare la configurazione dell’infrastruttura, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (Milvus gestito) offre un piano gratuito per iniziare.</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Domande frequenti<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Come posso ridurre l’utilizzo dei token di Claude Code senza perdere contesto utile?</strong></p>
<p>Inizia comprimendo gli input più "rumorosi": output del terminale, payload grezzi degli strumenti e letture ripetute di codice. Quindi aggiungi strumenti di recupero come claude-context o code-review-graph in modo che Claude possa estrarre il codice pertinente invece di esplorare il repository da zero.</p>
<p><strong>Devo usare claude-context o code-review-graph per un repository di grandi dimensioni?</strong></p>
<p>Utilizza claude-context quando hai bisogno di una ricerca semantica del codice, specialmente quando non conosci il nome esatto del file o del simbolo. Utilizza code-review-graph quando hai bisogno di risposte strutturali come le relazioni di chiamata, le importazioni, le dipendenze di test e il raggio d’azione della revisione.</p>
<p><strong>Il recupero della memoria è diverso dal recupero del codice in Claude Code?</strong></p>
<p>Sì. Il recupero del codice individua file o simboli rilevanti del progetto. Il recupero della memoria richiama decisioni permanenti, preferenze dell’utente, cronologia di debug e lezioni apprese tra una sessione e l’altra. memsearch si concentra sulla memoria; claude-context si concentra sul recupero del codice.</p>
<p><strong>Questi strumenti sostituiscono la memorizzazione temporanea dei prompt o una finestra di contesto più ampia?</strong></p>
<p>No. La memorizzazione temporanea dei prompt e le finestre di contesto estese aiutano in termini di capacità e costi, ma non determinano quali informazioni meritino attenzione. Gli strumenti di gestione del contesto migliorano innanzitutto la qualità e la densità delle informazioni che vengono immesse nel modello. <span class="img-wrapper">

  
   <img translate="no" src="https://assets.zilliz.com/Chat_GPT_Image_Jun_22_2026_07_49_53_PM_11zon_d1a8de60bd.png" alt="cccm 11zon" class="doc-image" id="cccm-11zon" /> 
 <span>   cccm 11zon</span>
  
 </span></p>
