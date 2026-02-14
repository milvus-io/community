---
id: >-
  adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md
title: >-
  Aggiunta di memoria persistente al codice Claude con il plugin Lightweight
  memsearch
author: Cheney Zhang
date: 2026-02-13T00:00:00.000Z
cover: assets.zilliz.com/blog_cover_memsearch_ccplugin_43b5ecfd6f.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'OpenClaw, vector search, Milvus, Claude Code'
meta_keywords: >-
  Claude Code memory, Claude Code plugin, persistent memory, ccplugin, long-term
  memory AI
meta_title: |
  Persistent Memory for Claude Code: memsearch ccplugin
desc: >-
  Date a Claude Code una memoria a lungo termine con il ccplugin memsearch.
  Archiviazione Markdown leggera e trasparente, recupero semantico automatico,
  zero token overhead.
origin: >-
  https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md
---
<p>Di recente abbiamo realizzato e reso open source <a href="https://github.com/zilliztech/memsearch">memsearch</a>, una libreria di memoria a lungo termine standalone e plug-and-play che fornisce a qualsiasi agente una memoria persistente, trasparente e modificabile dall'uomo. Utilizza la stessa architettura di memoria di OpenClaw, ma senza il resto dello stack di OpenClaw. Ciò significa che è possibile inserirla in qualsiasi framework di agenti (Claude, GPT, Llama, agenti personalizzati, motori di flusso di lavoro) e aggiungere immediatamente una memoria durevole e interrogabile. <em>(Se volete approfondire il funzionamento di memsearch, abbiamo scritto un</em> <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md"><em>post a parte qui</em></a><em>).</em></p>
<p>Nella maggior parte dei flussi di lavoro degli agenti, memsearch funziona esattamente come previsto. Ma la <strong>codifica agenziale</strong> è una storia diversa. Le sessioni di codifica sono lunghe, i cambi di contesto sono continui e le informazioni che vale la pena conservare si accumulano per giorni o settimane. Questo volume e questa volatilità mettono a nudo i punti deboli dei sistemi di memoria tipici degli agenti, compreso memsearch. Negli scenari di codifica, gli schemi di recupero differiscono abbastanza da non poter semplicemente riutilizzare lo strumento esistente così com'è.</p>
<p>Per risolvere questo problema, abbiamo creato un <strong>plugin di memoria persistente progettato appositamente per Claude Code</strong>. Si trova sopra la CLI di memsearch e lo chiamiamo <strong>memsearch ccplugin</strong>.</p>
<ul>
<li>GitHub Repo: <a href="https://github.com/zilliztech/memsearch"></a><a href="https://zilliztech.github.io/memsearch/claude-plugin/">https://zilliztech.github.io/memsearch/claude-plugin/</a> <em>(open-source, licenza MIT)</em></li>
</ul>
<p>Con il leggero <strong>ccplugin memsearch</strong> che gestisce la memoria dietro le quinte, Claude Code ottiene la capacità di ricordare ogni conversazione, ogni decisione, ogni preferenza di stile e ogni thread di più giorni: indicizzato automaticamente, completamente ricercabile e persistente in tutte le sessioni.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_plugin_diagram_41563f84dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Per chiarezza in questo post: "ccplugin" si riferisce al livello superiore, ovvero al plugin Claude Code stesso. "memsearch" si riferisce al livello inferiore, lo strumento CLI standalone sottostante.</em></p>
<p>Perché la codifica ha bisogno di un proprio plugin e perché abbiamo costruito qualcosa di così leggero? Il motivo è da ricercare in due problemi che quasi sicuramente avrete riscontrato: La mancanza di memoria persistente di Claude Code e la goffaggine e complessità delle soluzioni esistenti come claude-mem.</p>
<p>Allora perché creare un plugin dedicato? Perché gli agenti di codifica si imbattono in due punti dolenti che quasi certamente avete sperimentato voi stessi:</p>
<ul>
<li><p>Claude Il codice non ha memoria persistente.</p></li>
<li><p>Molte delle soluzioni comunitarie esistenti, come <em>claude-mem, sono</em>potenti, ma pesanti, goffe o troppo complesse per il lavoro di codifica quotidiano.</p></li>
</ul>
<p>Il ccplugin mira a risolvere entrambi i problemi con un livello minimo, trasparente e facile da sviluppare sopra memsearch.</p>
<h2 id="Claude-Codes-Memory-Problem-It-Forgets-Everything-When-a-Session-Ends" class="common-anchor-header">Il problema di memoria del codice Claude: dimentica tutto quando una sessione finisce<button data-href="#Claude-Codes-Memory-Problem-It-Forgets-Everything-When-a-Session-Ends" class="anchor-icon" translate="no">
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
    </button></h2><p>Cominciamo con uno scenario in cui gli utenti di Claude Code si sono sicuramente imbattuti.</p>
<p>Si apre Claude Code al mattino. "Continua il refactor dell'autenticazione di ieri", scrivete. Claude risponde: "Non sono sicuro su cosa stavi lavorando ieri". Così si passano i dieci minuti successivi a copiare i log di ieri. Non è un problema enorme, ma diventa presto fastidioso perché si presenta così spesso.</p>
<p>Anche se Claude Code ha i suoi meccanismi di memoria, non sono affatto soddisfacenti. Il file <code translate="no">CLAUDE.md</code> può memorizzare le direttive e le preferenze del progetto, ma funziona meglio per regole statiche e comandi brevi, non per accumulare conoscenze a lungo termine.</p>
<p>Claude Code offre i comandi <code translate="no">resume</code> e <code translate="no">fork</code>, ma non sono affatto facili da usare. Per i comandi a forcella è necessario ricordare gli ID delle sessioni, digitare manualmente i comandi e gestire un albero di conversazioni ramificate. Quando si esegue <code translate="no">/resume</code>, si ottiene un muro di titoli di sessione. Se si ricordano solo pochi dettagli di ciò che si è fatto e che risale a più di qualche giorno fa, la fortuna è di trovare quella giusta.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_snippet_82ec01cc5e.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Per l'accumulo di conoscenze a lungo termine e su più progetti, questo approccio è impossibile.</p>
<p>Per realizzare questa idea, claude-mem utilizza un sistema di memoria a tre livelli. Il primo livello cerca sommari di alto livello. Il secondo livello scava in una linea temporale per ottenere maggiori dettagli. Il terzo livello estrae le osservazioni complete per le conversazioni non elaborate. A ciò si aggiungono le etichette per la privacy, il monitoraggio dei costi e un'interfaccia di visualizzazione web.</p>
<p>Ecco come funziona sotto il cofano:</p>
<ul>
<li><p><strong>Livello di runtime.</strong> Un servizio Node.js Worker viene eseguito sulla porta 37777. I metadati della sessione risiedono in un database SQLite leggero. Un database vettoriale gestisce il recupero semantico preciso del contenuto della memoria.</p></li>
<li><p><strong>Livello di interazione.</strong> Un'interfaccia web basata su React consente di visualizzare i ricordi acquisiti in tempo reale: riepiloghi, cronologie e record grezzi.</p></li>
<li><p><strong>Livello di interfaccia.</strong> Un server MCP (Model Context Protocol) espone interfacce standardizzate per gli strumenti. Claude può chiamare <code translate="no">search</code> (interrogare i riepiloghi di alto livello), <code translate="no">timeline</code> (visualizzare le timeline dettagliate) e <code translate="no">get_observations</code> (recuperare i record grezzi delle interazioni) per recuperare e utilizzare direttamente le memorie.</p></li>
</ul>
<p>A dire il vero, si tratta di un prodotto solido che risolve il problema della memoria di Claude Code. Ma è goffo e complesso nei modi che contano giorno per giorno.</p>
<table>
<thead>
<tr><th>Strato</th><th>Tecnologia</th></tr>
</thead>
<tbody>
<tr><td>Linguaggio</td><td>TypeScript (ES2022, moduli ESNext)</td></tr>
<tr><td>Tempo di esecuzione</td><td>Node.js 18+</td></tr>
<tr><td>Database</td><td>SQLite 3 con driver bun:sqlite</td></tr>
<tr><td>Archivio vettoriale</td><td>ChromaDB (opzionale, per la ricerca semantica)</td></tr>
<tr><td>Server HTTP</td><td>Express.js 4.18</td></tr>
<tr><td>In tempo reale</td><td>Eventi inviati dal server (SSE)</td></tr>
<tr><td>Struttura UI</td><td>React + TypeScript</td></tr>
<tr><td>SDK AI</td><td>@anthropic-ai/claude-agent-sdk</td></tr>
<tr><td>Strumento di compilazione</td><td>esbuild (include TypeScript)</td></tr>
<tr><td>Gestore di processi</td><td>Bun</td></tr>
<tr><td>Test</td><td>Runner di test integrato in Node.js</td></tr>
</tbody>
</table>
<p><strong>Per cominciare, la configurazione è pesante.</strong> Far funzionare claude-mem significa installare Node.js, Bun e il runtime MCP, quindi creare un servizio Worker, un server Express, un'interfaccia utente React, SQLite e un archivio vettoriale. Si tratta di un sacco di parti in movimento da distribuire, mantenere e debuggare quando qualcosa si rompe.</p>
<p><strong>Tutti questi componenti bruciano anche i gettoni che non avete chiesto di spendere.</strong> Le definizioni degli strumenti MCP vengono caricate in modo permanente nella finestra di contesto di Claude e ogni chiamata agli strumenti consuma token sulla richiesta e sulla risposta. Nel corso di lunghe sessioni, questo sovraccarico si accumula rapidamente e può portare i costi dei token fuori controllo.</p>
<p><strong>Il richiamo della memoria è inaffidabile perché dipende interamente dalla scelta di Claude di effettuare una ricerca.</strong> Claude deve decidere da solo di chiamare strumenti come <code translate="no">search</code> per attivare il recupero. Se non si rende conto di aver bisogno di una memoria, il contenuto pertinente non compare mai. E ognuno dei tre livelli di memoria richiede l'invocazione esplicita di uno strumento, quindi non c'è un ripiego se Claude non pensa di cercare.</p>
<p><strong>Infine, la memorizzazione dei dati è opaca, il che rende spiacevole il debugging e la migrazione.</strong> Le memorie sono divise tra SQLite per i metadati di sessione e Chroma per i dati vettoriali binari, senza un formato aperto che li colleghi. Migrare significa scrivere script di esportazione. Per vedere ciò che l'IA ricorda in realtà è necessario utilizzare l'interfaccia Web o un'interfaccia di interrogazione dedicata. Non c'è modo di guardare i dati grezzi.</p>
<h2 id="Why-the-memsearch-Plugin-for-Claude-Code-is-Better" class="common-anchor-header">Perché il plugin memsearch per Claude Code è migliore?<button data-href="#Why-the-memsearch-Plugin-for-Claude-Code-is-Better" class="anchor-icon" translate="no">
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
    </button></h2><p>Volevamo un livello di memoria che fosse veramente leggero: nessun servizio aggiuntivo, nessuna architettura ingarbugliata, nessun overhead operativo. Questo è il motivo che ci ha spinto a creare il <strong>plugin memsearch per Claude Code</strong>. In fondo, si trattava di un esperimento: <em>poteva un sistema di memoria incentrato sulla codifica essere radicalmente più semplice?</em></p>
<p>Sì, e lo abbiamo dimostrato.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_icon_d68365006a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>L'intero ccplugin è costituito da quattro hook di shell più un processo di watch in background. Niente Node.js, niente server MCP, niente interfaccia web. Si tratta solo di script di shell che richiamano la CLI di memsearch, che riduce drasticamente la barra di configurazione e manutenzione.</p>
<p>Il ccplugin può essere così sottile grazie ai rigidi limiti di responsabilità. Non gestisce l'archiviazione della memoria, il recupero di vettori o l'inserimento di testo. Tutto ciò è delegato alla CLI memsearch sottostante. Il ccplugin ha un solo compito: fare da ponte tra gli eventi del ciclo di vita di Claude Code (inizio della sessione, invio della richiesta, interruzione della risposta, fine della sessione) e le corrispondenti funzioni della CLI di memsearch.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_2_6b2dbeaaf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Questa struttura disaccoppiata rende il sistema flessibile al di là di Claude Code. La CLI di memsearch funziona indipendentemente da altri IDE, da altri framework di agenti o anche dalla semplice invocazione manuale. Non è vincolata a un singolo caso d'uso.</p>
<p>In pratica, questo design offre tre vantaggi chiave.</p>
<h3 id="1-All-Memories-Live-in-Plain-Markdown-Files" class="common-anchor-header">1. Tutte le memorie vivono in semplici file Markdown</h3><p>Ogni memoria creata dal ccplugin vive in <code translate="no">.memsearch/memory/</code> come file Markdown.</p>
<pre><code translate="no">.memsearch/memory/
├── 2026-02-09.md
├── 2026-02-10.md
└── 2026-02-11.md
<button class="copy-code-btn"></button></code></pre>
<p>Si tratta di un file al giorno. Ogni file contiene i riassunti delle sessioni di quel giorno in testo semplice, completamente leggibile. Ecco una schermata dei file di memoria giornalieri dal progetto memsearch stesso:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/markdown_file_d0ab53e13b.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Si può notare subito il formato: timestamp, ID della sessione, ID del turno e un riassunto della sessione. Non c'è nulla di nascosto.</p>
<p>Volete sapere cosa ricorda l'intelligenza artificiale? Aprite il file Markdown. Volete modificare una memoria? Utilizzate il vostro editor di testo. Volete migrare i vostri dati? Copiate la cartella <code translate="no">.memsearch/memory/</code>.</p>
<p>L'indice vettoriale <a href="https://milvus.io/">di Milvus</a> è una cache per accelerare la ricerca semantica. Si ricostruisce da Markdown in qualsiasi momento. Nessun database opaco, nessuna scatola nera binaria. Tutti i dati sono tracciabili e completamente ricostruibili.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_index_workflow_e8de4628da.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Automatic-Context-Injection-Costs-Zero-Extra-Tokens" class="common-anchor-header">2. L'iniezione automatica del contesto non comporta alcun costo aggiuntivo in termini di gettoni.</h3><p>L'archiviazione trasparente è alla base di questo sistema. Il vero guadagno deriva dal modo in cui queste memorie vengono utilizzate e in ccplugin il richiamo della memoria è completamente automatico.</p>
<p>Ogni volta che viene inviato un prompt, l'hook di <code translate="no">UserPromptSubmit</code> avvia una ricerca semantica e inietta nel contesto le prime tre memorie rilevanti. Claude non decide se effettuare la ricerca. Si limita a ottenere il contesto.</p>
<p>Durante questo processo, Claude non vede mai le definizioni degli strumenti MCP, quindi non occupa nulla di extra nella finestra del contesto. L'hook viene eseguito a livello di CLI e inietta i risultati della ricerca in testo semplice. Nessun overhead IPC, nessun costo di token per le chiamate agli strumenti. L'ingombro della finestra di contesto che viene fornito con le definizioni degli strumenti MCP è completamente eliminato.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/diagram_3_b9e8391c2a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Per i casi in cui la top-3 automatica non è sufficiente, abbiamo creato anche tre livelli di recupero progressivo. Tutti e tre sono comandi CLI, non strumenti MCP.</p>
<ul>
<li><p><strong>L1 (automatico):</strong> Ogni prompt restituisce i primi 3 risultati della ricerca semantica con un'anteprima di <code translate="no">chunk_hash</code> e 200 caratteri. Questo copre la maggior parte dell'uso quotidiano.</p></li>
<li><p><strong>L2 (su richiesta):</strong> Quando è necessario un contesto completo, <code translate="no">memsearch expand &lt;chunk_hash&gt;</code> restituisce l'intera sezione Markdown e i metadati.</p></li>
<li><p><strong>L3 (profondo):</strong> Quando è necessaria la conversazione originale, <code translate="no">memsearch transcript &lt;jsonl_path&gt; --turn &lt;uuid&gt;</code> estrae il record JSONL grezzo da Claude Code.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_4_ccc495d5ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_5_0333650103.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Session-Summaries-Are-Generated-in-the-Background-at-Near-Zero-Cost" class="common-anchor-header">3. I riassunti delle sessioni sono generati in background a costo quasi zero</h3><p>Il recupero riguarda il modo in cui le memorie vengono utilizzate. Ma prima le memorie devono essere scritte. Come vengono creati tutti quei file Markdown?</p>
<p>Il ccplugin li genera attraverso una pipeline in background che viene eseguita in modo asincrono e non costa quasi nulla. Ogni volta che si interrompe una risposta di Claude, scatta l'hook <code translate="no">Stop</code>: analizza la trascrizione della conversazione, chiama Claude Haiku (<code translate="no">claude -p --model haiku</code>) per generare un riassunto e lo aggiunge al file Markdown del giorno corrente. Le chiamate all'API Haiku sono estremamente economiche, quasi trascurabili per ogni invocazione.</p>
<p>Da qui, il processo di sorveglianza rileva la modifica del file e indicizza automaticamente il nuovo contenuto in Milvus, in modo che sia subito disponibile per il recupero. L'intero flusso viene eseguito in background senza interrompere il lavoro e i costi rimangono controllati.</p>
<h2 id="Quickstart-memsearch-plugin-with-Claude-Code" class="common-anchor-header">Avvio rapido del plugin memsearch con Claude Code<button data-href="#Quickstart-memsearch-plugin-with-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="First-install-from-the-Claude-Code-plugin-marketplace" class="common-anchor-header">Innanzitutto, installatelo dal marketplace dei plugin di Claude Code:</h3><pre><code translate="no">
bash
<span class="hljs-comment"># Run in Claude Code terminal</span>
/plugin marketplace add zilliztech/memsearch
/plugin install memsearch
<button class="copy-code-btn"></button></code></pre>
<h3 id="Second-restart-Claude-Code" class="common-anchor-header">In secondo luogo, riavviare Claude Code.</h3><p>Il plugin inizializza automaticamente la sua configurazione.</p>
<h3 id="Third-after-a-conversation-check-the-days-memory-file" class="common-anchor-header">Terzo, dopo una conversazione, controllate il file di memoria del giorno:</h3><pre><code translate="no">bash
<span class="hljs-built_in">cat</span> .memsearch/memory/$(<span class="hljs-built_in">date</span> +%Y-%m-%d).md
<button class="copy-code-btn"></button></code></pre>
<h3 id="Fourth-enjoy" class="common-anchor-header">Quarto, godetevi il momento.</h3><p>Al successivo avvio di Claude Code, il sistema recupera e inserisce automaticamente i ricordi pertinenti. Non sono necessari altri passaggi.</p>
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
    </button></h2><p>Torniamo alla domanda iniziale: come si fa a dare all'intelligenza artificiale una memoria persistente? claude-mem e memsearch ccplugin adottano approcci diversi, ciascuno con punti di forza differenti. Abbiamo riassunto una rapida guida alla scelta tra i due:</p>
<table>
<thead>
<tr><th>Categoria</th><th>memsearch</th><th>claude-mem</th></tr>
</thead>
<tbody>
<tr><td>Architettura</td><td>4 ganci di shell + 1 processo di osservazione</td><td>Lavoratore Node.js + Express + React UI</td></tr>
<tr><td>Metodo di integrazione</td><td>Ganci nativi + CLI</td><td>Server MCP (stdio)</td></tr>
<tr><td>Richiamo</td><td>Automatico (iniezione di ganci)</td><td>Guidato da agenti (richiede l'invocazione di uno strumento)</td></tr>
<tr><td>Consumo di contesto</td><td>Zero (inietta solo il testo del risultato)</td><td>Le definizioni degli strumenti MCP persistono</td></tr>
<tr><td>Riepilogo della sessione</td><td>Una chiamata Haiku CLI asincrona</td><td>Più chiamate API + compressione dell'osservazione</td></tr>
<tr><td>Formato di archiviazione</td><td>File Markdown semplici</td><td>SQLite + incorporazioni Chroma</td></tr>
<tr><td>Migrazione dei dati</td><td>File Markdown semplici</td><td>SQLite + incorporazioni Chroma</td></tr>
<tr><td>Metodo di migrazione</td><td>Copia dei file .md</td><td>Esportazione dal database</td></tr>
<tr><td>Tempo di esecuzione</td><td>Python + Claude CLI</td><td>Node.js + Bun + runtime MCP</td></tr>
</tbody>
</table>
<p>claude-mem offre funzioni più ricche, un'interfaccia utente raffinata e un controllo a grana più fine. Per i team che hanno bisogno di collaborazione, visualizzazione web o gestione dettagliata della memoria, è una scelta importante.</p>
<p>memsearch ccplugin offre un design minimale, zero overhead della finestra di contesto e una memoria completamente trasparente. Per gli ingegneri che vogliono un livello di memoria leggero senza ulteriori complessità, è la scelta migliore. Quale sia il migliore dipende dalle vostre esigenze.</p>
<p>Volete approfondire o essere aiutati a costruire con memsearch o Milvus?</p>
<ul>
<li><p>Unitevi alla <a href="https://milvus.io/slack">community Milvus su Slack</a> per entrare in contatto con altri sviluppatori e condividere ciò che state costruendo.</p></li>
<li><p>Prenotate i nostri <a href="https://milvus.io/office-hours">Milvus Office Hours per ricevere</a>domande e risposte dal vivo e il supporto diretto del team.</p></li>
</ul>
<h2 id="Resources" class="common-anchor-header">Risorse<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><strong>Documentazione del ccplugin memsearch:</strong> <a href="https://zilliztech.github.io/memsearch/claude-plugin/">https://zilliztech.github.io/memsearch/claude-plugin/</a></p></li>
<li><p><strong>GitHub:</strong> <a href="https://github.com/zilliztech/memsearch/tree/main/ccplugin">https://github.com/zilliztech/memsearch/tree/main/ccplugin</a></p></li>
<li><p><strong>Progetto memsearch:</strong> <a href="https://github.com/zilliztech/memsearch">https://github.com/zilliztech/memsearch</a></p></li>
<li><p>Blog: <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Abbiamo estratto il sistema di memoria di OpenClaw e lo abbiamo reso open source (memsearch)</a></p></li>
<li><p>Blog: <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">Cos'è OpenClaw? Guida completa all'agente di intelligenza artificiale open-source</a></p></li>
<li><p>Blog: <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Tutorial su OpenClaw: Connettersi a Slack per l'assistente AI locale</a></p></li>
</ul>
