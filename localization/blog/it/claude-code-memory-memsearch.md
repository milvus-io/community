---
id: claude-code-memory-memsearch.md
title: >-
  Abbiamo letto la fonte trapelata di Claude Code. Ecco come funziona la sua
  memoria
author: Cheney Zhang
date: 2026-4-3
cover: assets.zilliz.com/claude_memory_845a789ee8.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Claude Code memory, AI agent memory, memsearch, Claude Code source leak,
  cross-agent memory
meta_title: |
  Claude Code Memory System Explained: 4 Layers, 5 Limits, and a Fix
desc: >-
  I sorgenti di Claude Code rivelano una memoria a 4 livelli con un limite di
  200 righe e una ricerca solo in grep. Ecco come funziona ogni livello e cosa
  risolve memsearch.
origin: 'https://milvus.io/blog/claude-code-memory-memsearch.md'
---
<p>Il codice sorgente di Claude Code è stato distribuito pubblicamente per errore. La versione 2.1.88 includeva un file di mappa dei sorgenti di 59,8 MB che avrebbe dovuto essere eliminato dalla build. Quell'unico file conteneva l'intera base di codice TypeScript leggibile - 512.000 righe, che ora vengono riprodotte su GitHub.</p>
<p>Il <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">sistema di memoria</a> ha attirato la nostra attenzione. Claude Code è l'agente di codifica AI più popolare sul mercato e la memoria è la parte con cui la maggior parte degli utenti interagisce senza capire come funziona sotto il cofano. Così abbiamo scavato.</p>
<p>La versione breve: La memoria di Claude Code è più semplice di quanto si possa pensare. Ha un limite massimo di 200 righe di note. È in grado di trovare le memorie solo in base a una corrispondenza esatta di parole chiave: se chiedete di "conflitti di porte", ma la nota dice "mappatura di docker-compose", non otterrete nulla. E niente di tutto ciò lascia il codice Claude. Se si passa a un altro agente, si riparte da zero.</p>
<p>Ecco i quattro livelli:</p>
<ul>
<li><strong>CLAUDE.md</strong> - un file scritto da voi stessi con le regole da seguire per Claude. Manuale, statico e limitato da quanto si pensa di scrivere in anticipo.</li>
<li><strong>Memoria automatica</strong> - Claude prende da solo gli appunti durante le sessioni. Utile, ma limitato a un indice di 200 righe e senza ricerca per significato.</li>
<li><strong>Auto Dream</strong> - un processo di pulizia in background che consolida le memorie disordinate mentre si è inattivi. Aiuta a risolvere problemi vecchi di giorni, ma non riesce a superare i mesi.</li>
<li><strong>KAIROS</strong> - una modalità daemon always-on non ancora rilasciata, trovata nel codice trapelato. Non è ancora presente in nessuna build pubblica.</li>
</ul>
<p>Di seguito, esaminiamo ogni livello, quindi i punti in cui l'architettura si rompe e ciò che abbiamo costruito per colmare le lacune.</p>
<h2 id="How-Does-CLAUDEmd-Work" class="common-anchor-header">Come funziona CLAUDE.md?<button data-href="#How-Does-CLAUDEmd-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>CLAUDE.md è un file Markdown creato e collocato nella cartella del progetto. Lo si riempie con tutto ciò che si vuole far ricordare a Claude: regole di stile del codice, struttura del progetto, comandi di test, fasi di distribuzione. Claude lo carica all'inizio di ogni sessione.</p>
<p>Esistono tre ambiti: a livello di progetto (nella radice del repo), personale (<code translate="no">~/.claude/CLAUDE.md</code>) e organizzativo (configurazione aziendale). I file più corti vengono seguiti in modo più affidabile.</p>
<p>Il limite è ovvio: CLAUDE.md contiene solo le cose scritte in anticipo. Decisioni di debug, preferenze menzionate nel corso della conversazione, casi limite scoperti insieme: nulla di tutto ciò viene catturato a meno che non ci si fermi ad aggiungerlo manualmente. La maggior parte delle persone non lo fa.</p>
<h2 id="How-Does-Auto-Memory-Work" class="common-anchor-header">Come funziona la memoria automatica?<button data-href="#How-Does-Auto-Memory-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>La memoria automatica cattura ciò che emerge durante il lavoro. Claude decide cosa vale la pena conservare e lo scrive in una cartella di memoria sul vostro computer, organizzata in quattro categorie: utente (ruolo e preferenze), feedback (le vostre correzioni), progetto (decisioni e contesto) e riferimento (dove le cose vivono).</p>
<p>Ogni nota è un file Markdown separato. Il punto di ingresso è <code translate="no">MEMORY.md</code> - un indice in cui ogni riga è una breve etichetta (sotto i 150 caratteri) che punta a un file dettagliato. Claude legge l'indice, poi estrae i file specifici quando sembrano rilevanti.</p>
<pre><code translate="no">~<span class="hljs-regexp">/.claude/</span>projects/-<span class="hljs-title class_">Users</span>-me-myproject/memory/
├── <span class="hljs-variable constant_">MEMORY</span>.<span class="hljs-property">md</span>                  ← index file, one pointer per line
├── user_role.<span class="hljs-property">md</span>               ← <span class="hljs-string">&quot;Backend engineer, fluent in Go, new to React&quot;</span>
├── feedback_testing.<span class="hljs-property">md</span>        ← <span class="hljs-string">&quot;Integration tests must use real DB, no mocking&quot;</span>
├── project_auth_rewrite.<span class="hljs-property">md</span>    ← <span class="hljs-string">&quot;Auth rewrite driven by compliance, not tech debt&quot;</span>
└── reference_linear.<span class="hljs-property">md</span>        ← <span class="hljs-string">&quot;Pipeline bugs tracked in Linear INGEST project&quot;</span>

<span class="hljs-variable constant_">MEMORY</span>.<span class="hljs-property">md</span> <span class="hljs-title function_">sample</span> (each line ≤<span class="hljs-number">150</span> chars):
- [<span class="hljs-title class_">User</span> role](user_role.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Backend</span> engineer, strong <span class="hljs-title class_">Go</span>, <span class="hljs-keyword">new</span> to <span class="hljs-title class_">React</span>
- [<span class="hljs-title class_">Testing</span> rule](feedback_testing.<span class="hljs-property">md</span>) — <span class="hljs-title class_">No</span> mocking the database <span class="hljs-keyword">in</span> integration tests
- [<span class="hljs-title class_">Auth</span> rewrite](project_auth_rewrite.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Compliance</span>-driven, not tech debt
- [<span class="hljs-title class_">Bug</span> tracker](reference_linear.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Pipeline</span> bugs → <span class="hljs-title class_">Linear</span> <span class="hljs-variable constant_">INGEST</span>
<button class="copy-code-btn"></button></code></pre>
<p>Le prime 200 righe di MEMORY.md vengono caricate in ogni sessione. Tutto ciò che va oltre è invisibile.</p>
<p>Una scelta progettuale intelligente: il prompt di sistema trapelato indica a Claude di trattare la propria memoria come un suggerimento, non come un dato di fatto. Prima di agire su qualsiasi cosa venga ricordata, Claude verifica il codice reale, il che contribuisce a ridurre le allucinazioni, un modello che altri <a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">framework di agenti di intelligenza artificiale</a> stanno iniziando ad adottare.</p>
<h2 id="How-Does-Auto-Dream-Consolidate-Stale-Memories" class="common-anchor-header">Come fa Auto Dream a consolidare i ricordi obsoleti?<button data-href="#How-Does-Auto-Dream-Consolidate-Stale-Memories" class="anchor-icon" translate="no">
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
    </button></h2><p>Auto Memory cattura le note, ma dopo settimane di utilizzo queste diventano stantie. Una voce che dice "bug dell'implementazione di ieri" diventa priva di significato una settimana dopo. Una nota dice che si usa PostgreSQL; una più recente dice che si è migrati a MySQL. I file cancellati hanno ancora voci in memoria. L'indice si riempie di contraddizioni e riferimenti obsoleti.</p>
<p>Auto Dream è il processo di pulizia. Viene eseguito in background e:</p>
<ul>
<li>Sostituisce i riferimenti temporali vaghi con date esatte. "Problema di distribuzione di ieri" → "Problema di distribuzione del 2026-03-28".</li>
<li>Risolve le contraddizioni. Nota PostgreSQL + nota MySQL → mantiene la verità attuale.</li>
<li>Elimina le voci obsolete. Le note che fanno riferimento a file cancellati o a compiti completati vengono rimosse.</li>
<li>Mantiene <code translate="no">MEMORY.md</code> sotto le 200 righe.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_1_7973e94494.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Condizioni di attivazione:</strong> più di 24 ore dall'ultima pulizia e almeno 5 nuove sessioni accumulate. È anche possibile digitare "dream" per eseguirlo manualmente. Il processo viene eseguito in un subagente in background: come il sonno vero e proprio, non interrompe il lavoro attivo.</p>
<p>Il messaggio di sistema dell'agente dream inizia con: <em>"Stai eseguendo un sogno - un passaggio riflessivo sui tuoi file di memoria".</em></p>
<h2 id="What-Is-KAIROS-Claude-Codes-Unreleased-Always-On-Mode" class="common-anchor-header">Cos'è KAIROS? La modalità Always-On non ancora rilasciata di Claude Code<button data-href="#What-Is-KAIROS-Claude-Codes-Unreleased-Always-On-Mode" class="anchor-icon" translate="no">
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
    </button></h2><p>I primi tre livelli sono già attivi o in fase di sviluppo. Il codice trapelato contiene anche qualcosa che non è stato distribuito: KAIROS.</p>
<p>KAIROS - che pare prenda il nome dalla parola greca che indica il "momento giusto" - compare oltre 150 volte nel sorgente. Trasformerebbe Claude Code da uno strumento da usare attivamente a un assistente in background che controlla continuamente il progetto.</p>
<p>In base al codice trapelato, KAIROS:</p>
<ul>
<li>Tiene un registro delle osservazioni, delle decisioni e delle azioni durante la giornata.</li>
<li>Controlla un timer. A intervalli regolari, riceve un segnale e decide se agire o rimanere in silenzio.</li>
<li>Rimane fuori dai piedi. Qualsiasi azione che vi blocchi per più di 15 secondi viene rimandata.</li>
<li>Esegue internamente la pulizia dei sogni, oltre a un ciclo completo di osservazione-pensiero-azione in background.</li>
<li>Ha strumenti esclusivi che il normale Claude Code non ha: spingere i file all'utente, inviare notifiche, monitorare le richieste di pull su GitHub.</li>
</ul>
<p>KAIROS si nasconde dietro un flag di funzionalità in fase di compilazione. Non è presente in nessuna build pubblica. Pensate ad Anthropic che esplora cosa succede quando <a href="https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md">la memoria dell'agente</a> smette di essere sessione per sessione e diventa sempre attiva.</p>
<h2 id="Where-Does-Claude-Codes-Memory-Architecture-Break-Down" class="common-anchor-header">Dove si rompe l'architettura di memoria di Claude Code?<button data-href="#Where-Does-Claude-Codes-Memory-Architecture-Break-Down" class="anchor-icon" translate="no">
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
    </button></h2><p>La memoria di Claude Code svolge un lavoro concreto. Ma cinque limitazioni strutturali limitano la capacità di gestire i progetti in crescita.</p>
<table>
<thead>
<tr><th>Limitazione</th><th>Cosa succede</th></tr>
</thead>
<tbody>
<tr><td><strong>Indice di 200 righe</strong></td><td><code translate="no">MEMORY.md</code> contiene ~25 KB. Se si gestisce un progetto per mesi, le vecchie voci vengono eliminate da quelle nuove. "Su quale configurazione di Redis ci siamo accordati la settimana scorsa?". - sparito.</td></tr>
<tr><td><strong>Recupero solo con Grep</strong></td><td>La ricerca in memoria utilizza la <a href="https://milvus.io/docs/full-text-search.md">corrispondenza</a> letterale <a href="https://milvus.io/docs/full-text-search.md">delle parole chiave</a>. Ci si ricorda di "conflitti di porte deploy-time", ma la nota dice "mappatura di porte docker-compose". Grep non è in grado di colmare questo divario.</td></tr>
<tr><td><strong>Solo sommari, nessun ragionamento</strong></td><td>La memoria automatica salva le note di alto livello, ma non le fasi di debug o il ragionamento che hanno portato al risultato. Il <em>come va</em> perso.</td></tr>
<tr><td><strong>La complessità si accatasta senza fissare le fondamenta</strong></td><td>CLAUDE.md → Auto Memory → Auto Dream → KAIROS. Ogni strato esiste perché il precedente non era sufficiente. Ma nessuna stratificazione cambia ciò che c'è sotto: uno strumento, file locali, acquisizione sessione per sessione.</td></tr>
<tr><td><strong>La memoria è bloccata all'interno di Claude Code</strong></td><td>Se si passa a OpenCode, Codex CLI o qualsiasi altro agente, si riparte da zero. Nessuna esportazione, nessun formato condiviso, nessuna portabilità.</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_2_b006110116.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Questi non sono bug. Sono i limiti naturali dell'architettura a singolo strumento e file locale. Ogni mese arrivano nuovi agenti, i flussi di lavoro cambiano, ma le conoscenze acquisite in un progetto non dovrebbero scomparire con loro. Ecco perché abbiamo creato <a href="https://github.com/zilliztech/memsearch">memsearch</a>.</p>
<h2 id="What-Is-memsearch-Persistent-Memory-for-Any-AI-Coding-Agent" class="common-anchor-header">Che cos'è memsearch? Memoria persistente per qualsiasi agente di codifica dell'intelligenza artificiale<button data-href="#What-Is-memsearch-Persistent-Memory-for-Any-AI-Coding-Agent" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/memsearch">memsearch</a> estrae la memoria dall'agente e la inserisce nel proprio livello. Gli agenti vanno e vengono. La memoria rimane.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_3_4151da0414.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="How-to-Install-memsearch" class="common-anchor-header">Come installare memsearch</h3><p>Gli utenti di Claude Code installano memsearch dal marketplace:</p>
<pre><code translate="no">/plugin marketplace add zilliztech/memsearch
/plugin install memsearch
<button class="copy-code-btn"></button></code></pre>
<p>Fatto. Non è necessaria alcuna configurazione.</p>
<p>Altre piattaforme sono altrettanto semplici. OpenClaw: <code translate="no">openclaw plugins install clawhub:memsearch</code>. API Python tramite uv o pip:</p>
<pre><code translate="no">uv tool install <span class="hljs-string">&quot;memsearch[onnx]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="What-Does-memsearch-Capture" class="common-anchor-header">Cosa cattura memsearch?</h3><p>Una volta installato, memsearch si aggancia al ciclo di vita dell'agente. Ogni conversazione viene riassunta e indicizzata automaticamente. Quando si pone una domanda che necessita di cronologia, il richiamo si attiva da solo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_4_13b257186e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>I file di memoria sono archiviati come Markdown datato - un file al giorno:</p>
<pre><code translate="no">.memsearch/
└── memory/
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-28.</span>md    ← one <span class="hljs-keyword">file</span> per day
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-29.</span>md
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-30.</span>md
    └── <span class="hljs-number">2026</span><span class="hljs-number">-04</span><span class="hljs-number">-01.</span>md
<button class="copy-code-btn"></button></code></pre>
<p>È possibile aprire, leggere e modificare i file di memoria con qualsiasi editor di testo. Se si vuole migrare, si copia la cartella. Se si desidera il controllo di versione, git funziona in modo nativo.</p>
<p>L'<a href="https://milvus.io/docs/index-explained.md">indice vettoriale</a> memorizzato in <a href="https://milvus.io/docs/overview.md">Milvus</a> è un livello di cache: se si perde, lo si ricostruisce dai file Markdown. I dati vivono nei file, non nell'indice.</p>
<h2 id="How-Does-memsearch-Find-Memories-Semantic-Search-vs-Grep" class="common-anchor-header">Come fa memsearch a trovare i ricordi? Ricerca semantica vs. Grep<button data-href="#How-Does-memsearch-Find-Memories-Semantic-Search-vs-Grep" class="anchor-icon" translate="no">
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
    </button></h2><p>Il recupero dei ricordi di Claude Code utilizza grep, ovvero la corrispondenza letterale delle parole chiave. Funziona quando si hanno poche decine di note, ma si rompe dopo mesi di storia quando non si riesce a ricordare l'esatta formulazione.</p>
<p>memsearch utilizza invece <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">una ricerca ibrida</a>. I <a href="https://zilliz.com/glossary/semantic-search">vettori semantici</a> trovano contenuti correlati alla query anche se la formulazione è diversa, mentre BM25 corrisponde a parole chiave esatte. <a href="https://milvus.io/docs/rrf-ranker.md">RRF (Reciprocal Rank Fusion)</a> unisce e classifica entrambi i risultati.</p>
<p>Se chiedete "Come abbiamo risolto il timeout di Redis la scorsa settimana?". - La ricerca semantica capisce l'intento e lo trova. Se si chiede &quot;cerca <code translate="no">handleTimeout</code>&quot;, BM25 trova il nome esatto della funzione. I due percorsi coprono i rispettivi punti ciechi.</p>
<p>Quando si attiva il richiamo, il subagente effettua una ricerca in tre fasi, approfondendo solo se necessario:</p>
<h3 id="L1-Semantic-Search--Short-Previews" class="common-anchor-header">L1: Ricerca semantica - Brevi anteprime</h3><p>Il subagente esegue <code translate="no">memsearch search</code> rispetto all'indice di Milvus ed estrae i risultati più rilevanti:</p>
<pre><code translate="no">┌─ L1 search results ────────────────────────────┐
│                                                 │
│  <span class="hljs-meta">#a3f8c1 [score: 0.85] memory/2026-03-28.md    │</span>
│  &gt; Redis port conflict during deploy, <span class="hljs-literal">default</span>   │
│    <span class="hljs-number">6379</span> occupied, switched to <span class="hljs-number">6380</span>, updated     │
│    docker-compose...                            │
│                                                 │
│  <span class="hljs-meta">#b7e2d4 [score: 0.72] memory/2026-03-25.md    │</span>
│  &gt; Auth module rewrite complete, JWT replaced   │
│    <span class="hljs-keyword">with</span> session tokens, mobile token refresh    │
│    was unreliable...                            │
│                                                 │
│  <span class="hljs-meta">#c9f1a6 [score: 0.68] memory/2026-03-20.md    │</span>
│  &gt; DB index optimization, added composite       │
│    index <span class="hljs-keyword">on</span> users table, query time dropped     │
│    <span class="hljs-keyword">from</span> <span class="hljs-number">800</span>ms to <span class="hljs-number">50</span>ms...                        │
│                                                 │
└─────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>Ogni risultato mostra un punteggio di rilevanza, il file di origine e un'anteprima di 200 caratteri. La maggior parte delle query si ferma qui.</p>
<h3 id="L2-Full-Context--Expand-a-Specific-Result" class="common-anchor-header">L2: Contesto completo - Espansione di un risultato specifico</h3><p>Se l'anteprima di L1 non è sufficiente, il subagente esegue <code translate="no">memsearch expand a3f8c1</code> per estrarre la voce completa:</p>
<pre><code translate="no">┌─ L2 expanded result ───────────────────────────┐
│                                                 │
│  <span class="hljs-comment">## 2026-03-28 Deploy troubleshooting           │</span>
│                                                 │
│  Redis port conflict resolution:                │
│  1. docker-compose up → Redis container failed  │
│  2. Host port 6379 occupied by another instance │
│  3. Changed docker-compose.yml: <span class="hljs-string">&quot;6380:6379&quot;</span>     │
│  4. Updated .<span class="hljs-built_in">env</span>: REDIS_PORT=6380               │
│  5. Updated config/database.py connection       │
│                                                 │
│  Note: Only affects <span class="hljs-built_in">local</span> dev. Prod unaffected. │
│                                                 │
│  [<span class="hljs-built_in">source</span>: memory/2026-03-28.md  lines: 42-55]  │
└─────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<h3 id="L3-Raw-Conversation-Transcript" class="common-anchor-header">L3: Trascrizione grezza della conversazione</h3><p>Nei rari casi in cui è necessario vedere esattamente ciò che è stato detto, il subagente estrae lo scambio originale:</p>
<pre><code translate="no">┌─ L3 raw transcript ───────────────────────────┐
│                                                │
│  [user] docker-compose up won&#x27;t start, Redis   │
│         port conflict — can you take a look?   │
│                                                │
│  [agent] Checking host port usage...           │
│          Running lsof -i :6379...              │
│          Suggest remapping to port 6380...     │
│          (tool_call: Bash &quot;lsof -i :6379&quot;)     │
│          (tool_call: Edit &quot;docker-compose.yml&quot;)│
│                                                │
│  [user] Done. Anything else to update?         │
│                                                │
│  [agent] Also need to update .env and          │
│          database.py...                        │
│                                                │
└────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>La trascrizione conserva tutto: le parole esatte dell'utente, la risposta esatta dell'agente e ogni chiamata agli strumenti. Le tre fasi vanno da leggere a pesanti: il subagente decide quanto in profondità scavare, quindi restituisce i risultati organizzati alla sessione principale.</p>
<h2 id="How-Does-memsearch-Share-Memory-Across-AI-Coding-Agents" class="common-anchor-header">Come fa memsearch a condividere la memoria tra gli agenti di codifica dell'intelligenza artificiale?<button data-href="#How-Does-memsearch-Share-Memory-Across-AI-Coding-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Questo è il divario fondamentale tra memsearch e la memoria di Claude Code.</p>
<p>La memoria di Claude Code è chiusa in un unico strumento. Se si usa OpenCode, OpenClaw o Codex CLI, si parte da zero. MEMORY.md è locale, legato a un utente e a un agente.</p>
<p>memsearch supporta quattro agenti di codifica: Claude Code, OpenClaw, OpenCode e Codex CLI. Essi condividono lo stesso formato di memoria Markdown e la stessa <a href="https://milvus.io/docs/manage-collections.md">raccolta Milvus</a>. Le memorie scritte da qualsiasi agente sono ricercabili da ogni altro agente.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_5_6ed2e386b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Due scenari reali:</strong></p>
<p><strong>Cambiare strumento.</strong> Si trascorre un pomeriggio in Claude Code per capire la pipeline di deploy, incontrando diversi ostacoli. Le conversazioni vengono riassunte e indicizzate automaticamente. Il giorno dopo si passa a OpenCode e si chiede: "Come abbiamo risolto quel conflitto di porte ieri?". OpenCode cerca in memsearch, trova i ricordi di Claude Code di ieri e fornisce la risposta giusta.</p>
<p><strong>Collaborazione di squadra.</strong> Puntate il backend di Milvus su <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> e più sviluppatori su macchine diverse, usando agenti diversi, leggono e scrivono la memoria dello stesso progetto. Un nuovo membro del team si unisce e non ha bisogno di scavare in mesi di Slack e documenti: l'agente lo sa già.</p>
<h2 id="Developer-API" class="common-anchor-header">API per gli sviluppatori<button data-href="#Developer-API" class="anchor-icon" translate="no">
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
    </button></h2><p>Se state costruendo i vostri <a href="https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md">strumenti per gli agenti</a>, memsearch fornisce un'API CLI e Python.</p>
<p><strong>CLI:</strong></p>
<pre><code translate="no" class="language-bash"><span class="hljs-comment"># Index markdown files</span>
memsearch index ./memory

<span class="hljs-comment"># Search memories</span>
memsearch search <span class="hljs-string">&quot;Redis port conflict&quot;</span>

<span class="hljs-comment"># Expand a specific memory&#x27;s full content</span>
memsearch <span class="hljs-built_in">expand</span> a3f8c1

<span class="hljs-comment"># Watch for file changes, auto-index</span>
memsearch watch ./memory

<span class="hljs-comment"># Compact old memories</span>
memsearch compact
<button class="copy-code-btn"></button></code></pre>
<p><strong>API Python:</strong></p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> memsearch <span class="hljs-keyword">import</span> MemSearch

mem = MemSearch(paths=[<span class="hljs-string">&quot;./memory&quot;</span>])
<span class="hljs-keyword">await</span> mem.index()                          <span class="hljs-comment"># index markdown</span>
results = <span class="hljs-keyword">await</span> mem.search(<span class="hljs-string">&quot;Redis config&quot;</span>) <span class="hljs-comment"># hybrid search</span>
<span class="hljs-keyword">await</span> mem.compact()                        <span class="hljs-comment"># compact old memories</span>
<span class="hljs-keyword">await</span> mem.watch()                          <span class="hljs-comment"># auto-index on file change</span>
<button class="copy-code-btn"></button></code></pre>
<p>Sotto il cofano, Milvus gestisce la ricerca vettoriale. Si può eseguire localmente con <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> (zero configurazioni), collaborare con <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (livello gratuito disponibile) o autoalimentarsi con Docker. <a href="https://milvus.io/docs/embeddings.md">Gli embeddings</a> sono predefiniti con ONNX - funziona su CPU, non è necessaria la GPU. È possibile passare a OpenAI o Ollama in qualsiasi momento.</p>
<h2 id="Claude-Code-Memory-vs-memsearch-Full-Comparison" class="common-anchor-header">Claude Code Memory vs. memsearch: Confronto completo<button data-href="#Claude-Code-Memory-vs-memsearch-Full-Comparison" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>Caratteristiche</th><th>Memoria del codice Claude</th><th>memsearch</th></tr>
</thead>
<tbody>
<tr><td>Cosa viene salvato</td><td>Cosa Claude considera importante</td><td>Ogni conversazione, riassunta automaticamente</td></tr>
<tr><td>Limite di memoria</td><td>Indice di ~200 righe (~25 KB)</td><td>Illimitato (file giornalieri + indice vettoriale)</td></tr>
<tr><td>Trovare vecchi ricordi</td><td>Corrispondenza di parole chiave Grep</td><td>Ricerca ibrida basata sui significati + parole chiave (Milvus)</td></tr>
<tr><td>È possibile leggerle?</td><td>Controllare manualmente la cartella delle memorie</td><td>Aprire qualsiasi file .md</td></tr>
<tr><td>Si possono modificare?</td><td>Modificare i file a mano</td><td>Lo stesso - reindicizzazione automatica al salvataggio</td></tr>
<tr><td>Controllo della versione</td><td>Non è stato progettato per questo</td><td>git funziona in modo nativo</td></tr>
<tr><td>Supporto trasversale agli strumenti</td><td>Solo codice Claude</td><td>4 agenti, memoria condivisa</td></tr>
<tr><td>Richiamo a lungo termine</td><td>Si degrada dopo settimane</td><td>Persistente per mesi</td></tr>
</tbody>
</table>
<h2 id="Get-Started-with-memsearch" class="common-anchor-header">Iniziare con memsearch<button data-href="#Get-Started-with-memsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>La memoria di Claude Code ha punti di forza reali: il design auto-scettico, il concetto di consolidamento dei sogni e il budget di 15 secondi per il blocco in KAIROS. Anthropic sta riflettendo a fondo su questo problema.</p>
<p>Ma la memoria di un singolo strumento ha un limite. Quando il flusso di lavoro si estende a più agenti, a più persone o a più di qualche settimana di storia, occorre una memoria che esista da sola.</p>
<ul>
<li>Provate <a href="https://github.com/zilliztech/memsearch">memsearch</a> - open source, con licenza MIT. Si installa in Claude Code con due comandi.</li>
<li>Leggete <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">come funziona memsearch sotto il cofano</a> o la <a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">guida ai plugin di Claude Code</a>.</li>
<li>Avete domande? Unitevi alla <a href="https://discord.com/invite/8uyFbECzPX">comunità Milvus Discord</a> o <a href="https://milvus.io/office-hours">prenotate una sessione gratuita di Office Hours</a> per illustrare il vostro caso d'uso.</li>
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
    </button></h2><h3 id="How-does-Claude-Codes-memory-system-work-under-the-hood" class="common-anchor-header">Come funziona il sistema di memoria di Claude Code?</h3><p>Claude Code utilizza un'architettura di memoria a quattro livelli, tutti memorizzati come file Markdown locali. CLAUDE.md è un file di regole statiche che si scrive manualmente. Auto Memory consente a Claude di salvare le proprie note durante le sessioni, organizzate in quattro categorie: preferenze dell'utente, feedback, contesto del progetto e punti di riferimento. Auto Dream consolida le memorie stantie in background. KAIROS è un demone always-on non rilasciato, trovato nel codice sorgente trapelato. L'intero sistema è limitato a un indice di 200 righe e può essere ricercato solo tramite una corrispondenza esatta di parole chiave, senza ricerca semantica o richiamo basato sul significato.</p>
<h3 id="Can-AI-coding-agents-share-memory-across-different-tools" class="common-anchor-header">Gli agenti di codifica AI possono condividere la memoria tra diversi strumenti?</h3><p>Non in modo nativo. La memoria di Claude Code è bloccata a Claude Code: non esiste un formato di esportazione o un protocollo tra agenti. Se si passa a OpenCode, Codex CLI o OpenClaw, si riparte da zero. memsearch risolve questo problema memorizzando le memorie come file Markdown datati e indicizzati in un <a href="https://zilliz.com/learn/what-is-vector-database">database vettoriale</a> (Milvus). Tutti e quattro gli agenti supportati leggono e scrivono lo stesso archivio di memoria, quindi il contesto si trasferisce automaticamente quando si cambia strumento.</p>
<h3 id="What-is-the-difference-between-keyword-search-and-semantic-search-for-agent-memory" class="common-anchor-header">Qual è la differenza tra la ricerca per parole chiave e la ricerca semantica per la memoria dell'agente?</h3><p>La ricerca per parole chiave (grep) corrisponde a stringhe esatte: se la memoria dice "docker-compose port mapping" ma si cerca "port conflicts", non restituisce nulla. La ricerca semantica converte il testo in <a href="https://zilliz.com/glossary/vector-embeddings">incorporazioni vettoriali</a> che catturano il significato, in modo che i concetti correlati corrispondano anche con formulazioni diverse. memsearch combina entrambi gli approcci con una ricerca ibrida, offrendo un richiamo basato sul significato e una precisione esatta delle parole chiave in un'unica query.</p>
<h3 id="What-was-leaked-in-the-Claude-Code-source-code-incident" class="common-anchor-header">Cosa è trapelato nell'incidente del codice sorgente di Claude Code?</h3><p>La versione 2.1.88 di Claude Code è stata fornita con un file di mappa dei sorgenti di 59,8 MB che avrebbe dovuto essere eliminato dalla versione di produzione. Il file conteneva la base di codice TypeScript completa e leggibile - circa 512.000 righe - compresa l'implementazione completa del sistema di memoria, il processo di consolidamento di Auto Dream e i riferimenti a KAIROS, una modalità di agente always-on non ancora rilasciata. Il codice è stato rapidamente riprodotto su GitHub prima che potesse essere eliminato.</p>
