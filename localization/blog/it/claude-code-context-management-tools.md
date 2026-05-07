---
id: claude-code-context-management-tools.md
title: >-
  7 migliori strumenti open source per la gestione del contesto del codice
  Claude
author: Cheney Zhang
date: 2026-5-7
cover: assets.zilliz.com/claude_code_context_management_tools_16_9fdd81ad02.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Claude Code context, Claude Code tools, token management, MCP code search, AI
  agent memory
meta_title: |
  7 Best Open-Source Tools for Claude Code Context Management
desc: >-
  Le lunghe sessioni di codice Claude perdono rapidamente segnale. Imparate 7
  strumenti per ridurre il rumore del terminale, il recupero del codice,
  l'output dello strumento, la memoria e l'uso dei token.
origin: 'https://milvus.io/blog/claude-code-context-management-tools.md'
---
<p>Si può dare a Claude Code una finestra di contesto da 1M di token e comunque ottenere risposte peggiori nel tempo. Il problema non è solo la dimensione del contesto. È la qualità del contesto.</p>
<p>Le sessioni di Claude Code si degradano quando i log del terminale, l'output grezzo dello strumento, le letture ripetute dei file, le risposte verbose e la cronologia dimenticata del progetto competono per l'attenzione. Nei flussi di lavoro ad agenti di lunga durata, il rumore si trasforma in un ciclo: il modello perde il filo, si aggiungono altri giri per risolvere la risposta e questi giri aggiungono ancora più rumore.</p>
<p>Si tratta di una <strong>defocalizzazione del contesto</strong>: il modello ha abbastanza spazio per contenere le informazioni, ma le informazioni importanti sono sepolte da un contesto a basso segnale. Le finestre più grandi possono rendere questo fenomeno più facile da ignorare, perché gli sviluppatori smettono di pensare attentamente a ciò che entra nel prompt.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_13_3e7a004cd6.png" alt="Prompt caching diagram showing how reused prefixes can still add billed context across turns" class="doc-image" id="prompt-caching-diagram-showing-how-reused-prefixes-can-still-add-billed-context-across-turns" />
   </span> <span class="img-wrapper"> <span>Diagramma della cache dei prompt che mostra come i prefissi riutilizzati possano ancora aggiungere un contesto fatturato nei vari turni</span> </span></p>
<p>La cache dei prompt può ridurre il costo dei prefissi ripetuti, ma non trasforma la finestra del contesto in un cassetto della spazzatura. Si continua a pagare per i nuovi token e si ha ancora bisogno del modello per ragionare sulle informazioni giuste.</p>
<p>Questo articolo passa in rassegna sette strumenti open source che attaccano la defocalizzazione del contesto da diversi livelli: l'output del terminale, l'output dello strumento, la navigazione nella codebase, la lettura dei file, la verbosità del modello, il recupero semantico del codice e la memoria intersessionale. Spiega inoltre come queste idee si adattino alla progettazione <a href="https://zilliz.com/learn/what-is-vector-database">di database vettoriali</a>, alla <a href="https://zilliz.com/learn/vector-similarity-search">ricerca di similarità vettoriali</a> e ai sistemi di recupero come Milvus.</p>
<h2 id="What-causes-Claude-Code-context-defocus" class="common-anchor-header">Quali sono le cause della defocalizzazione del contesto del Codice Claude?<button data-href="#What-causes-Claude-Code-context-defocus" class="anchor-icon" translate="no">
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
    </button></h2><p>La perdita di contesto di Claude Code deriva solitamente da cinque modalità di fallimento: troppo testo di istruzioni grezzo, output rumoroso dello strumento, esplorazione ripetuta della base di codice, risposte lunghe del modello e vuoti di memoria tra sessioni o agenti.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_15_56a2da172a.png" alt="Five causes of Claude Code context loss: redundant instructions, messy tool output, repeated codebase retrieval, long responses, and memory gaps" class="doc-image" id="five-causes-of-claude-code-context-loss:-redundant-instructions,-messy-tool-output,-repeated-codebase-retrieval,-long-responses,-and-memory-gaps" />
   </span> <span class="img-wrapper"> <span>Cinque cause di perdita di contesto di Claude Code: istruzioni ridondanti, output disordinato dello strumento, ripetuto recupero del codebase, risposte lunghe e vuoti di memoria</span> </span>.</p>
<table>
<thead>
<tr><th>Modalità di perdita del contesto</th><th>Come si presenta in Claude Code</th><th>Categoria di strumenti che aiutano</th></tr>
</thead>
<tbody>
<tr><td>I log dei terminali sono rumorosi</td><td><code translate="no">git</code> <code translate="no">pytest</code>, , e le CLI cloud scaricano più testo di quello che serve al modello. <code translate="no">gh</code></td><td>Compressione dell'output della CLI</td></tr>
<tr><td>Gli output degli strumenti invadono la finestra</td><td>I log dei test, i dump DOM e gli output MCP entrano nella chat come enormi blocchi grezzi.</td><td>Sandboxing degli output degli strumenti</td></tr>
<tr><td>La navigazione nella base di codice si ripete</td><td>Claude elenca le directory, cerca, legge i file e ripete la stessa esplorazione a ogni sessione.</td><td>Grafo del codice o recupero semantico</td></tr>
<tr><td>La lettura dei file è troppo ampia</td><td>Il modello legge un intero file quando ha bisogno solo di un simbolo o di un riassunto.</td><td>Lettura progressiva del codice</td></tr>
<tr><td>Claude parla troppo</td><td>La risposta stessa aggiunge un contesto non necessario per le svolte future.</td><td>Compressione della risposta</td></tr>
<tr><td>La memoria non persiste</td><td>Ogni volta che si inizia una nuova sessione si spiegano nuovamente le decisioni del progetto.</td><td>Memoria Markdown-first</td></tr>
</tbody>
</table>
<p>Un buon stack di gestione del contesto dovrebbe fare tre cose: tenere fuori la spazzatura, recuperare la giusta conoscenza del progetto su richiesta e preservare le decisioni durevoli tra le sessioni.</p>
<h2 id="Which-Claude-Code-context-tool-should-you-use-first" class="common-anchor-header">Quale strumento di gestione del contesto di Claude Code dovreste usare per primo?<button data-href="#Which-Claude-Code-context-tool-should-you-use-first" class="anchor-icon" translate="no">
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
    </button></h2><p>Iniziate dal livello che crea più rumore nel vostro flusso di lavoro. Se il problema è l'output del terminale, iniziate con RTK. Se Claude continua a vagare in un repository di grandi dimensioni, iniziate con claude-context o code-review-graph. Se il vero problema è quello di ripetere ogni giorno le stesse decisioni, iniziate con memsearch.</p>
<table>
<thead>
<tr><th>Strumento</th><th>Problema principale che risolve</th><th>Migliore adattamento</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/rtk-ai/rtk">RTK</a></td><td>Output rumoroso del terminale per i comuni comandi degli sviluppatori.</td><td>Sviluppatori che eseguono molti comandi CLI all'interno del codice Claude.</td></tr>
<tr><td><a href="https://github.com/mksglu/context-mode">Modalità contesto</a></td><td>Output massicci di strumenti grezzi che entrano nella conversazione principale.</td><td>Utenti intensi di Playwright, GitHub, log o MCP-tool.</td></tr>
<tr><td><a href="https://github.com/tirth8205/code-review-graph">grafico di revisione del codice</a></td><td>Esplorazione cieca della codebase in repository di grandi dimensioni.</td><td>Recensioni, analisi delle dipendenze e domande sul raggio di esplosione.</td></tr>
<tr><td><a href="https://github.com/Mibayy/token-savior">Salvatore dei token</a></td><td>Lettura completa dei file quando un riassunto dei simboli sarebbe sufficiente.</td><td>File di grandi dimensioni, ricerche ripetute di simboli e lettura incrementale del codice.</td></tr>
<tr><td><a href="https://github.com/JuliusBrussee/caveman">Cavernicolo</a></td><td>Le abitudini di risposta verbose di Claude.</td><td>Gli utenti che desiderano un output terso e un contesto futuro più ridotto.</td></tr>
<tr><td><a href="https://github.com/zilliztech/claude-context">claude-contesto</a></td><td>Riesplorazione della base di codice a ogni sessione.</td><td>Ricerca semantica del codice attraverso MCP.</td></tr>
<tr><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>Perdita di memoria del progetto tra sessioni, agenti e cambi di modello.</td><td>Progetti di lunga durata con decisioni e lezioni durature.</td></tr>
</tbody>
</table>
<p>I primi cinque strumenti riducono ciò che entra o rimane nel contesto. Gli ultimi due rendono il contesto utile più facile da richiamare.</p>
<h2 id="RTK-compresses-raw-command-output-before-Claude-sees-it" class="common-anchor-header">RTK comprime l'output di comando grezzo prima che Claude lo veda<button data-href="#RTK-compresses-raw-command-output-before-Claude-sees-it" class="anchor-icon" translate="no">
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
<p>RTK è un proxy della CLI per ridurre l'uso dei token nei comuni comandi degli sviluppatori. La sua descrizione su GitHub dice che riduce il consumo di token LLM del 60-90% sui comuni comandi di sviluppo e viene fornito come un singolo binario Rust.</p>
<p>Nell'uso quotidiano di Claude Code, comandi come <code translate="no">git status</code>, <code translate="no">pytest</code> e l'elenco delle directory spesso scaricano informazioni complete sull'ambiente e descrizioni di stato nella finestra contestuale. Il modello di solito ha bisogno solo di una risposta più piccola: quali file sono cambiati, quale test è fallito, dove si è bloccata la PR o quali file chiave esistono nella directory.</p>
<p>RTK si colloca tra la shell e Claude. Può riscrivere i comandi attraverso gli hook del codice Claude e restituire l'output compresso.</p>
<p>Output grezzo <code translate="no">git status</code>:</p>
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
<p>Stessa storia con <code translate="no">pytest</code>. L'output grezzo è pieno di casi di passaggio e di rumore ambientale:</p>
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
<p>Compresso, il segnale è immediato:</p>
<pre><code translate="no" class="language-apache">128 tests collected, 1 failed
FAIL tests/test_webhook.py::test_retry_to_dlq
AssertionError: expected status code 202, got 500
<button class="copy-code-btn"></button></code></pre>
<p>RTK è il punto di partenza più semplice quando l'ingombro del contesto deriva da comandi di shell piuttosto che dal recupero di codice.</p>
<h2 id="Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="common-anchor-header">La Modalità Contesto consente di creare sandbox per i giganteschi output dello strumento al di fuori della chat principale.<button data-href="#Context-Mode-sandboxes-giant-tool-outputs-outside-the-main-chat" class="anchor-icon" translate="no">
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
    </button></h2><p>La Modalità Contesto è costruita per i blocchi grezzi che gli strumenti restituiscono: log di test, istantanee del DOM del browser, payload di GitHub, output dello strumento MCP e pagine raschiate. La sua descrizione su GitHub evidenzia l'ottimizzazione della finestra di contesto per gli agenti di codifica AI e riporta una riduzione del 98% dell'output degli strumenti.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_5_f00e17ea6f.png" alt="Context Mode GitHub repository card showing sandboxed tool output and context optimization positioning" class="doc-image" id="context-mode-github-repository-card-showing-sandboxed-tool-output-and-context-optimization-positioning" />
   </span> <span class="img-wrapper"> <span>Scheda del repository GitHub di Context Mode che mostra l'output dello strumento in sandbox e il posizionamento dell'ottimizzazione del contesto</span> </span>.</p>
<p>Il suo approccio consiste nell'isolare gli output degli strumenti di grandi dimensioni in una sandbox locale e in un indice, per poi passare alla conversazione con Claude solo i riassunti e gli handle di recupero.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_12_32e50fec44.png" alt="Context Mode flow showing large tool output moving through sandbox execution, SQLite or FTS indexes, summaries, and retrieval results" class="doc-image" id="context-mode-flow-showing-large-tool-output-moving-through-sandbox-execution,-sqlite-or-fts-indexes,-summaries,-and-retrieval-results" />
   </span> <span class="img-wrapper"> <span>Flusso della modalità contesto che mostra l'output di uno strumento di grandi dimensioni che passa attraverso l'esecuzione in sandbox, gli indici SQLite o FTS, i riepiloghi e i risultati del recupero</span> </span>.</p>
<p>Questo flusso è utile perché un agente di codifica ha spesso bisogno del nodo non funzionante, del selettore non funzionante o della traccia di stack pertinente, non dell'intero DOM o di ogni riga di test che passa. La modalità contestuale mantiene l'intero output disponibile localmente, evitando che domini la conversazione principale.</p>
<p>È simile al modo in cui i sistemi di <a href="https://zilliz.com/blog/hybrid-search-with-milvus">ricerca ibridi</a> di produzione separano la memorizzazione dal recupero. Si conservano i dati grezzi in un luogo durevole e si recupera solo la parte che interessa.</p>
<h2 id="code-review-graph-maps-code-structure-before-Claude-navigates-it" class="common-anchor-header">code-review-graph mappa la struttura del codice prima che Claude lo navighi<button data-href="#code-review-graph-maps-code-structure-before-Claude-navigates-it" class="anchor-icon" translate="no">
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
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_8_6d4632f3c9.png" alt="code-review-graph logo image used in the original article" class="doc-image" id="code-review-graph-logo-image-used-in-the-original-article" />
   </span> <span class="img-wrapper"> <span>immagine del logo di code-review-graph utilizzata nell'articolo originale</span> </span></p>
<p>In un repository di grandi dimensioni, una semplice domanda può innescare un'esplorazione costosa:</p>
<blockquote>
<p>Dopo aver cambiato questa logica di login, quali sono i file e i test interessati?</p>
</blockquote>
<p>Senza un grafico del codice, la mossa tipica di Claude è:</p>
<pre><code translate="no" class="language-perl"><span class="hljs-built_in">read</span> auth.ts
grep login
<span class="hljs-built_in">read</span> middleware
<span class="hljs-built_in">read</span> tests
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>code-review-graph pre-costruisce una mappa strutturale della base di codice. Utilizza Tree-sitter per analizzare funzioni, classi, importazioni, relazioni di chiamata, ereditarietà e dipendenze dei test, quindi scrive il grafo in SQLite.</p>
<p>Questo lo rende utile per la revisione del codice e per l'analisi del blast-radius. Invece di chiedere a Claude di riscoprire il grafo delle dipendenze attraverso letture ripetute, gli si permette di interrogare prima la struttura.</p>
<p>Si tratta di una ricerca adiacente a quella <a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">semantica</a>, ma non identica. Un grafo strutturale risponde a "cosa dipende da cosa?". Il reperimento semantico risponde a "quale codice è concettualmente correlato a questa domanda?". Nei flussi di lavoro reali di assistenza al codice, spesso sono necessarie entrambe le cose.</p>
<h2 id="Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="common-anchor-header">Token Savior fornisce a Claude riassunti dei simboli prima dei file completi<button data-href="#Token-Savior-gives-Claude-symbol-summaries-before-full-files" class="anchor-icon" translate="no">
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
    </button></h2><p>L'idea di base di Token Savior è semplice: non inviare il file completo per impostazione predefinita. Inviate prima un indice o un riassunto dei simboli, per poi espanderlo solo quando il compito richiede maggiori dettagli.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_10_5f63ad36d1.png" alt="Token Savior GitHub repository card showing its MCP server description and project statistics" class="doc-image" id="token-savior-github-repository-card-showing-its-mcp-server-description-and-project-statistics" />
   </span> <span class="img-wrapper"> <span>Scheda del repository GitHub di Token Savior che mostra la descrizione del server MCP e le statistiche del progetto</span> </span></p>
<p>Se si chiede dove viene gestito un webhook di pagamento, il modello spesso non ha bisogno di ogni riga di ogni file correlato. Deve prima sapere se un file o un simbolo è rilevante.</p>
<p>Token Savior serve il codice a strati:</p>
<table>
<thead>
<tr><th>Strato</th><th>Cosa riceve Claude</th><th>Quando si espande</th></tr>
</thead>
<tbody>
<tr><td>Sommario</td><td>Indice, nomi dei simboli e brevi descrizioni.</td><td>Prima risposta predefinita.</td></tr>
<tr><td>Frammento</td><td>Una sezione di codice più piccola intorno al simbolo rilevante.</td><td>Quando il sommario è probabilmente rilevante.</td></tr>
<tr><td>File completo</td><td>Il contenuto completo del file.</td><td>Solo quando la modifica o il ragionamento approfondito lo richiedono.</td></tr>
</tbody>
</table>
<p>Questo rispecchia il modo in cui gli sviluppatori leggono il codice. Si analizza, si conferma la rilevanza, quindi si apre il file completo solo se necessario. Inoltre, assomiglia al modello di recupero progressivo utilizzato nelle <a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">applicazioni RAG</a>: si recupera in modo sufficientemente ampio per orientarsi, quindi si restringe il contesto prima della generazione.</p>
<h2 id="Caveman-reduces-Claudes-own-response-bloat" class="common-anchor-header">Caveman riduce l'ingombro della risposta di Claude<button data-href="#Caveman-reduces-Claudes-own-response-bloat" class="anchor-icon" translate="no">
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
    </button></h2><p>La maggior parte degli strumenti di contesto si concentra su ciò che entra nel modello. Caveman si concentra su ciò che Claude produce.</p>
<p>Caveman è un'abilità/plugin del Codice Claude che elimina i riempitivi, i convenevoli, le frasi di contorno, le spiegazioni eccessive e le strutture ripetitive. L'obiettivo non è quello di eliminare le conoscenze, ma di rendere più densa la risposta.</p>
<p>Senza Caveman:</p>
<blockquote>
<p>Il motivo per cui il vostro componente React si sta ri-renderizzando è probabilmente perché...</p>
</blockquote>
<p>Con Caveman:</p>
<blockquote>
<p>Nuovo oggetto ref a ogni rendering. Oggetto inline prop = new ref = re-render. Avvolgere in useMemo.</p>
</blockquote>
<p>Questo è importante perché le risposte di Claude diventano un contesto futuro. Se ogni risposta include una lunga spiegazione, il turno successivo inizia con più testo di quanto ne abbia bisogno. Risposte più brevi possono migliorare il turno successivo tanto quanto quello attuale.</p>
<p>Per i team che pensano all'<a href="https://zilliz.com/blog/context-engineering-for-ai-agents">ingegneria del contesto per gli agenti AI</a>, Caveman ricorda che la politica di output è parte della politica del contesto.</p>
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
    </button></h2><p>claude-context risolve il problema dell'esplorazione ripetuta del codice con il recupero semantico. Indicizza un repository, memorizza pezzi di codice in un database vettoriale ed espone la ricerca attraverso il <a href="https://zilliz.com/glossary/model-context-protocol-%28mcp%29">Model Context Protocol</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_2_a0cc547fe3.png" alt="Claude Context repository shown on GitHub Trending in the original article" class="doc-image" id="claude-context-repository-shown-on-github-trending-in-the-original-article" />
   </span> <span class="img-wrapper"> <span>Il repository Claude Context mostrato su GitHub Tendenza nell'articolo originale</span> </span></p>
<p>In una grande base di codice, si pongono costantemente a Claude domande come:</p>
<blockquote>
<p>Aiutami a capire quali parti del codice potrebbero essere collegate a questo bug.</p>
</blockquote>
<p>Senza un livello di recupero, l'approccio predefinito di Claude è spesso:</p>
<pre><code translate="no" class="language-perl">list the directory
grep around
<span class="hljs-built_in">read</span> a bunch of files
keep guessing
<button class="copy-code-btn"></button></code></pre>
<p>claude-context sposta il lavoro in un livello di recupero. Il sistema suddivide il repository in pezzi, genera embeddings, li memorizza in un <a href="https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md">indice di codice supportato da Milvus</a> e recupera i pezzi di codice rilevanti prima che il modello inizi a leggere i file alla cieca.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_11_f9d952830d.png" alt="claude-context flow showing codebase chunking, embeddings, vector database and hybrid search, relevant code retrieval, and Claude context injection" class="doc-image" id="claude-context-flow-showing-codebase-chunking,-embeddings,-vector-database-and-hybrid-search,-relevant-code-retrieval,-and-claude-context-injection" />
   </span> <span class="img-wrapper"> <span>Flusso claude-context che mostra il chunking della base di codice, gli embeddings, il database vettoriale e la ricerca ibrida, il recupero del codice rilevante e l'iniezione del contesto Claude</span> </span>.</p>
<p>È qui che gli strumenti di codifica dell'intelligenza artificiale iniziano ad assomigliare a sistemi di ricerca. Servono chunking, embeddings, metadati, corrispondenza lessicale, ranking e freschezza. Questi sono gli stessi elementi che stanno alla base del <a href="https://zilliz.com/blog/top-10-context-engineering-techniques-you-should-know-for-production-rag">reperimento RAG di produzione</a>, dell'<a href="https://milvus.io/blog/build-smarter-rag-routing-hybrid-retrieval.md">instradamento del reperimento ibrido</a> e della <a href="https://milvus.io/blog/choose-embedding-model-rag-2026.md">selezione del modello di embedding</a>.</p>
<h2 id="memsearch-keeps-useful-memory-across-sessions-and-agents" class="common-anchor-header">memsearch mantiene la memoria utile tra le sessioni e gli agenti<button data-href="#memsearch-keeps-useful-memory-across-sessions-and-agents" class="anchor-icon" translate="no">
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
    </button></h2><p>memsearch affronta il lato opposto del problema: non cosa dimenticare, ma come ricordare ciò che conta.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_code_context_management_tools_7_d39c2f200e.png" alt="memsearch logo image from the original article" class="doc-image" id="memsearch-logo-image-from-the-original-article" />
   </span> <span class="img-wrapper"> <span>Immagine del logo di memsearch dall'articolo originale</span> </span></p>
<p>Immaginate di dire a Claude lunedì:</p>
<blockquote>
<p>Il nostro webhook non può essere ritentato in caso di fallimento: gli eventi falliti devono finire in una coda di attesa.</p>
</blockquote>
<p>Mercoledì si apre una nuova sessione e si chiede:</p>
<blockquote>
<p>Cos'altro possiamo ottimizzare nel livello webhook?</p>
</blockquote>
<p>Senza memoria durevole, Claude tratta la decisione di lunedì come se non fosse mai avvenuta. Glielo si spiega di nuovo.</p>
<p>memsearch memorizza la memoria come file Markdown locali, leggibili dall'uomo, e utilizza Milvus come indice di recupero ricostruibile. Questa struttura mantiene la memoria modificabile dall'uomo, pur rendendola ricercabile per gli agenti.</p>
<p>Al momento del recupero, memsearch utilizza un richiamo progressivo: prima la ricerca, poi l'espansione, se necessario, e quindi il passaggio alla trascrizione originale solo se necessario.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20260507_210137_73d4b0b8ea.png" alt="memsearch progressive retrieval flow showing search, expand, transcript, and summarized return to the main conversation" class="doc-image" id="memsearch-progressive-retrieval-flow-showing-search,-expand,-transcript,-and-summarized-return-to-the-main-conversation" />
   </span> <span class="img-wrapper"> <span>Il flusso di recupero progressivo di memsearch mostra la ricerca, l'espansione, la trascrizione e il ritorno sintetico alla conversazione principale</span> </span>.</p>
<p>Questo modello basato su Markdown è utile per i team che lavorano su sessioni, modelli e agenti diversi. Inoltre, si abbina naturalmente alla <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">memoria a lungo termine degli agenti AI</a>, alla <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">memoria condivisa tra più agenti</a> e al problema più ampio di prevenire la <a href="https://zilliz.com/ai-faq/can-context-engineering-help-reduce-context-rot">rotazione del contesto nei sistemi di agenti</a>.</p>
<h2 id="How-do-these-tools-work-together" class="common-anchor-header">Come funzionano questi strumenti insieme?<button data-href="#How-do-these-tools-work-together" class="anchor-icon" translate="no">
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
<tr><th>Strato</th><th>Utilizzare questi strumenti</th><th>Perché</th></tr>
</thead>
<tbody>
<tr><td>Rimuovere il rumore di comando</td><td>RTK</td><td>Comprimere l'output del terminale ad alto volume prima che raggiunga Claude.</td></tr>
<tr><td>Sandbox dell'output grezzo dello strumento</td><td>Modalità contesto</td><td>Conserva i log, i DOM e i payload degli strumenti di grandi dimensioni al di fuori della conversazione principale.</td></tr>
<tr><td>Mappa la struttura del codice</td><td>grafico di revisione del codice</td><td>Rispondere alle domande sulle dipendenze e sul raggio di esplosione senza leggere i file alla cieca.</td></tr>
<tr><td>Leggere il codice progressivamente</td><td>Gettone salvatore</td><td>Iniziare con i riassunti dei simboli, quindi espandere solo se necessario.</td></tr>
<tr><td>Comprimere le risposte di Claude</td><td>Cavernicolo</td><td>Impedire che l'output del modello diventi una futura massa contestuale.</td></tr>
<tr><td>Recuperare il codice rilevante</td><td>claude-contesto</td><td>Usare la ricerca semantica e ibrida del codice invece di ripetuti cicli di grep.</td></tr>
<tr><td>Riutilizzare le decisioni durevoli</td><td>memsearch</td><td>Richiama la storia del progetto attraverso le sessioni, gli agenti e i cambi di modello.</td></tr>
</tbody>
</table>
<p>Un ordine pratico di implementazione è:</p>
<ol>
<li><strong>Eliminare prima il rumore evidente.</strong> Aggiungere RTK o la modalità contesto se l'output della shell e i payload degli strumenti dominano il contesto.</li>
<li><strong>Correggere la navigazione nel repository.</strong> Aggiungere code-review-graph per la struttura o claude-context per il recupero semantico del codice.</li>
<li><strong>Controllare ciò che rimane.</strong> Usare Token Savior e Caveman per mantenere compatte le letture dei file e le risposte dei modelli.</li>
<li><strong>Conservare la conoscenza durevole.</strong> Usare memsearch quando le spiegazioni ripetute diventano il collo di bottiglia.</li>
</ol>
<h2 id="Keep-in-touch" class="common-anchor-header">Rimanere in contatto<button data-href="#Keep-in-touch" class="anchor-icon" translate="no">
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
<li>Unitevi alla <a href="https://discord.com/invite/8uyFbECzPX">comunità Milvus Discord</a> per porre domande e confrontare i modelli di gestione del contesto con altri sviluppatori.</li>
<li><a href="https://milvus.io/office-hours">Prenotate una sessione gratuita di Milvus Office Hours</a> se volete essere aiutati a progettare un livello di recupero per il codice, la memoria o i carichi di lavoro RAG.</li>
<li>Se preferite evitare la configurazione dell'infrastruttura, <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (gestito da Milvus) offre un livello gratuito per iniziare.</li>
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
    </button></h2><p><strong>Come posso ridurre l'uso dei token di Claude Code senza perdere il contesto utile?</strong></p>
<p>Iniziate comprimendo gli input più rumorosi: l'output del terminale, i payload degli strumenti grezzi e le letture ripetute del codice. Poi aggiungete strumenti di recupero come claude-context o code-review-graph, in modo che Claude possa estrarre il codice rilevante invece di esplorare il repository da zero.</p>
<p><strong>Devo usare claude-context o code-review-graph per un repo di grandi dimensioni?</strong></p>
<p>Usate claude-context quando avete bisogno di una ricerca semantica del codice, soprattutto quando non conoscete il nome esatto del file o del simbolo. Usate code-review-graph quando avete bisogno di risposte strutturali, come le relazioni di chiamata, le importazioni, le dipendenze dei test e il raggio d'azione delle revisioni.</p>
<p><strong>La memoria è diversa dal recupero del codice in Claude Code?</strong></p>
<p>Sì. Il recupero del codice trova i file di progetto o i simboli rilevanti. Il recupero della memoria richiama le decisioni durevoli, le preferenze dell'utente, la cronologia del debug e le lezioni trasversali alle sessioni. memsearch si concentra sulla memoria; claude-context si concentra sul recupero del codice.</p>
<p><strong>Questi strumenti sostituiscono la cache del prompt o una finestra di contesto più grande?</strong></p>
<p>No. La cache dei prompt e le finestre di contesto di grandi dimensioni aiutano a ridurre la capacità e i costi, ma non decidono quali informazioni meritano attenzione. Gli strumenti di gestione del contesto migliorano la qualità e la densità di ciò che entra nel modello.</p>
