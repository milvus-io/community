---
id: >-
  why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md
title: >-
  Perché sono contrario al recupero di solo Grep di Claude Code? Brucia troppi
  token
author: Cheney Zhang
date: 2025-08-25T00:00:00.000Z
desc: >-
  Scoprite come il recupero del codice basato su vettori riduce il consumo di
  token Claude Code del 40%. Soluzione open-source con facile integrazione MCP.
  Provate oggi stesso claude-context.
cover: >-
  assets.zilliz.com/why_im_against_claude_codes_grep_only_retrieval_it_just_burns_too_many_tokens_milvus_cover_2928b4b72d.png
tag: Engineering
recommend: false
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Claude Code, vector search, AI IDE, code retrieval, token optimization'
meta_title: >
  Why I’m Against Claude Code’s Grep-Only Retrieval? It Just Burns Too Many
  Tokens
origin: >
  https://milvus.io/blog/why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md
---
<p>Gli assistenti di codifica AI stanno esplodendo. Negli ultimi due anni, strumenti come Cursor, Claude Code, Gemini CLI e Qwen Code sono passati da curiosità a compagni quotidiani per milioni di sviluppatori. Ma dietro questa rapida ascesa si nasconde una lotta su qualcosa di ingannevolmente semplice: <strong>in che modo un assistente di codifica AI dovrebbe effettivamente cercare il contesto nella vostra base di codice?</strong></p>
<p>Al momento esistono due approcci:</p>
<ul>
<li><p><strong>RAG</strong> (recupero semantico)<strong>alimentato dalla ricerca vettoriale</strong>.</p></li>
<li><p><strong>Ricerca per parole chiave con grep</strong> (corrispondenza di stringhe letterali).</p></li>
</ul>
<p>Claude Code e Gemini hanno scelto quest'ultimo. In effetti, un ingegnere di Claude ha ammesso apertamente su Hacker News che Claude Code non usa affatto RAG. Al contrario, si limita a eseguire il greping del repo riga per riga (ciò che chiamano "ricerca agenziale") - nessuna semantica, nessuna struttura, solo una corrispondenza di stringhe grezze.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_2b03e89759.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Questa rivelazione ha diviso la comunità:</p>
<ul>
<li><p><strong>I sostenitori</strong> difendono la semplicità di grep. È veloce, preciso e, soprattutto, prevedibile. Nella programmazione, sostengono, la precisione è tutto, e gli incorporamenti di oggi sono ancora troppo confusi per fidarsi.</p></li>
<li><p><strong>I critici</strong> vedono grep come un vicolo cieco. Affoga in corrispondenze irrilevanti, brucia token e blocca il flusso di lavoro. Senza comprensione semantica, è come chiedere all'intelligenza artificiale di eseguire il debug con gli occhi bendati.</p></li>
</ul>
<p>Entrambe le parti hanno ragione. E dopo aver costruito e testato la mia soluzione, posso dire che l'approccio RAG basato sulla ricerca vettoriale cambia le carte in tavola. <strong>Non solo rende la ricerca molto più veloce e accurata, ma riduce anche l'uso dei token del 40% o più. (Passate alla parte relativa al contesto di Claude per il mio approccio)</strong></p>
<p>Perché grep è così limitante? E come può la ricerca vettoriale fornire risultati migliori nella pratica? Vediamo di capire meglio.</p>
<h2 id="What’s-Wrong-with-Claude-Code’s-Grep-Only-Code-Search" class="common-anchor-header">Cosa c'è di sbagliato nella ricerca del codice solo con Grep di Claude Code?<button data-href="#What’s-Wrong-with-Claude-Code’s-Grep-Only-Code-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Mi sono imbattuto in questo problema durante il debug di una questione spinosa. Claude Code ha lanciato query di grep su tutto il mio repo, scaricandomi blob giganteschi di testo irrilevante. Dopo un minuto, non avevo ancora trovato il file pertinente. Cinque minuti dopo, finalmente avevo le 10 righe giuste, ma erano state sepolte da 500 righe di rumore.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_299eeeaea5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Non si tratta di un caso limite. Scorrendo i problemi di Claude Code su GitHub si vedono molti sviluppatori frustrati che si scontrano con lo stesso muro:</p>
<ul>
<li><p>problema1:<a href="https://github.com/anthropics/claude-code/issues/1315"> https://github.com/anthropics/claude-code/issues/1315</a></p></li>
<li><p>problema2:<a href="https://github.com/anthropics/claude-code/issues/4556"> https://github.com/anthropics/claude-code/issues/4556</a></p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_938c7244da.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La frustrazione della comunità si riduce a tre punti dolenti:</p>
<ol>
<li><p><strong>Gonfiore dei token.</strong> Ogni grep dump sparge enormi quantità di codice irrilevante nell'LLM, facendo lievitare i costi che aumentano terribilmente con le dimensioni del repo.</p></li>
<li><p><strong>Tassa sul tempo.</strong> Si è bloccati ad aspettare mentre l'intelligenza artificiale gioca a fare le venti domande con la propria base di codice, uccidendo la concentrazione e il flusso.</p></li>
<li><p><strong>Zero contesto.</strong> Grep corrisponde a stringhe letterali. Non ha alcun senso del significato o delle relazioni, quindi la ricerca avviene alla cieca.</p></li>
</ol>
<p>Ecco perché il dibattito è importante: grep non è solo "vecchia scuola", ma ostacola attivamente la programmazione assistita dall'intelligenza artificiale.</p>
<h2 id="Claude-Code-vs-Cursor-Why-the-Latter-Has-Better-Code-Context" class="common-anchor-header">Codice Claude vs Cursore: Perché il secondo ha un contesto migliore<button data-href="#Claude-Code-vs-Cursor-Why-the-Latter-Has-Better-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando si parla di contesto del codice, Cursor ha fatto un lavoro migliore. Fin dal primo giorno, Cursor ha puntato sull'<strong>indicizzazione della base di codice</strong>: suddividere il repo in parti significative, incorporarle in vettori e recuperarle semanticamente ogni volta che l'intelligenza artificiale ha bisogno di un contesto. Si tratta di un'applicazione da manuale della RAG (Retrieval-Augmented Generation) al codice, e i risultati parlano da soli: un contesto più stretto, meno sprechi di token e un recupero più rapido.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_a9f5beb01d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Claude Code, invece, ha puntato tutto sulla semplicità. Niente indici, niente incorporazioni: solo grep. Ciò significa che ogni ricerca è una corrispondenza letterale di stringhe, senza alcuna comprensione della struttura o della semantica. In teoria è veloce, ma in pratica gli sviluppatori finiscono spesso per setacciare pagliai di corrispondenze irrilevanti prima di trovare l'ago di cui hanno effettivamente bisogno.</p>
<table>
<thead>
<tr><th></th><th><strong>Codice Claude</strong></th><th><strong>Cursore</strong></th></tr>
</thead>
<tbody>
<tr><td>Precisione della ricerca</td><td>Supera solo le corrispondenze esatte, mentre ignora tutto ciò che ha un nome diverso.</td><td>Trova codice semanticamente rilevante anche quando le parole chiave non corrispondono esattamente.</td></tr>
<tr><td>Efficienza</td><td>Grep scarica enormi quantità di codice nel modello, aumentando i costi dei token.</td><td>Pezzi più piccoli e con un segnale elevato riducono il carico di token del 30-40%.</td></tr>
<tr><td>Scalabilità</td><td>Rifare il repo ogni volta, il che rallenta la crescita dei progetti.</td><td>Indicizza una volta, quindi recupera su scala con un ritardo minimo.</td></tr>
<tr><td>Filosofia</td><td>Rimanere minimali, senza infrastrutture aggiuntive.</td><td>Indicizzare tutto, recuperare in modo intelligente.</td></tr>
</tbody>
</table>
<p>Perché Claude (o Gemini, o Cline) non ha seguito l'esempio di Cursor? Le ragioni sono in parte tecniche e in parte culturali. <strong>Il recupero vettoriale non è banale: bisogna risolvere i problemi di chunking, aggiornamenti incrementali e indicizzazione su larga scala.</strong> Ma soprattutto, Claude Code è costruito sul minimalismo: niente server, niente indici, solo una CLI pulita. Embeddings e DB vettoriali non rientrano in questa filosofia di progettazione.</p>
<p>Questa semplicità è attraente, ma limita anche il limite di ciò che Claude Code può offrire. La volontà di Cursor di investire in una vera infrastruttura di indicizzazione è il motivo per cui oggi si sente più potente.</p>
<h2 id="Claude-Context-an-Open-Source-Project-for-Adding-Semantic-Code-Search-to-Claude-Code" class="common-anchor-header">Claude Context: un progetto open source per aggiungere la ricerca semantica del codice a Claude Code<button data-href="#Claude-Context-an-Open-Source-Project-for-Adding-Semantic-Code-Search-to-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code è uno strumento forte, ma ha un contesto di codice scarso. Cursor ha risolto questo problema con l'indicizzazione della codebase, ma Cursor è closed-source, bloccato da abbonamenti e costoso per i singoli o i piccoli team.</p>
<p>Per questo motivo abbiamo iniziato a costruire la nostra soluzione open-source: <a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a>.</p>
<p><a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a> è un plugin MCP open-source che porta la <strong>ricerca semantica del codice</strong> in Claude Code (e in qualsiasi altro agente di codifica AI che parli MCP). Invece di forzare brutalmente il vostro repo con grep, integra database vettoriali con modelli di embedding per dare agli LLM un <em>contesto profondo e mirato</em> dall'intera base di codice. Il risultato è un reperimento più preciso, meno spreco di token e un'esperienza migliore per gli sviluppatori.</p>
<p>Ecco come lo abbiamo costruito:</p>
<h3 id="Technologies-We-Use" class="common-anchor-header">Tecnologie utilizzate</h3><p><strong>🔌 Livello di interfaccia: MCP come connettore universale</strong></p>
<p>Volevamo che funzionasse ovunque, non solo con Claude. MCP (Model Context Protocol) agisce come lo standard USB per gli LLM, consentendo agli strumenti esterni di collegarsi senza problemi. Impacchettando Claude Context come server MCP, funziona non solo con Claude Code ma anche con Gemini CLI, Qwen Code, Cline e persino Cursor.</p>
<p><strong>🗄️ Database vettoriale: Zilliz Cloud</strong></p>
<p>Per la struttura portante abbiamo scelto <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (un servizio completamente gestito costruito su <a href="https://milvus.io/">Milvus</a>). È ad alte prestazioni, cloud-native, elastico e progettato per carichi di lavoro AI come l'indicizzazione di codebase. Ciò significa recupero a bassa latenza, scala quasi infinita e affidabilità assoluta.</p>
<p><strong>🧩 Modelli di incorporazione: Diversi</strong>team hanno esigenze diverse, perciò Claude Context supporta diversi fornitori di incorporazioni:</p>
<ul>
<li><p><strong>Embedding OpenAI</strong> per la stabilità e l'ampia adozione.</p></li>
<li><p><strong>Embedding Voyage</strong> per prestazioni specifiche del codice.</p></li>
<li><p><strong>Ollama</strong> per implementazioni locali orientate alla privacy.</p></li>
</ul>
<p>Altri modelli possono essere inseriti in base all'evoluzione dei requisiti.</p>
<p><strong>💻 Scelta del linguaggio: TypeScript</strong></p>
<p>Abbiamo discusso su Python e TypeScript. TypeScript ha vinto, non solo per la compatibilità a livello di applicazione (plugin VSCode, strumenti web), ma anche perché Claude Code e Gemini CLI sono basati su TypeScript. Questo rende l'integrazione perfetta e mantiene l'ecosistema coerente.</p>
<h3 id="System-Architecture" class="common-anchor-header">Architettura del sistema</h3><p>Claude Context segue un design pulito e stratificato:</p>
<ul>
<li><p>I<strong>moduli principali</strong> gestiscono il lavoro pesante: parsing del codice, chunking, indicizzazione, recupero e sincronizzazione.</p></li>
<li><p>L'<strong>interfaccia utente</strong> gestisce le integrazioni: server MCP, plugin VSCode o altri adattatori.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_0c70864d6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Questa separazione mantiene il motore centrale riutilizzabile in ambienti diversi, consentendo alle integrazioni di evolversi rapidamente con l'emergere di nuovi assistenti di codifica AI.</p>
<h3 id="Core-Module-Implementation" class="common-anchor-header">Implementazione del modulo centrale</h3><p>I moduli principali costituiscono la base dell'intero sistema. Astraggono i database vettoriali, i modelli di incorporamento e altri componenti in moduli componibili che creano un oggetto Context, consentendo di utilizzare database vettoriali e modelli di incorporamento diversi per scenari diversi.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Context</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/claude-context-core&#x27;</span>;
<span class="hljs-comment">// Initialize embedding provider</span>
<span class="hljs-keyword">const</span> embedding = <span class="hljs-keyword">new</span> <span class="hljs-title class_">OpenAIEmbedding</span>(...);
<span class="hljs-comment">// Initialize vector database</span>
<span class="hljs-keyword">const</span> vectorDatabase = <span class="hljs-keyword">new</span> <span class="hljs-title class_">MilvusVectorDatabase</span>(...);
<span class="hljs-comment">// Create context instance</span>
<span class="hljs-keyword">const</span> context = <span class="hljs-keyword">new</span> <span class="hljs-title class_">Context</span>({embedding, vectorDatabase});
<span class="hljs-comment">// Index your codebase with progress tracking</span>
<span class="hljs-keyword">const</span> stats = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">indexCodebase</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>);
<span class="hljs-comment">// Perform semantic search</span>
<span class="hljs-keyword">const</span> results = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">semanticSearch</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>, <span class="hljs-string">&#x27;vector database operations&#x27;</span>);
<button class="copy-code-btn"></button></code></pre>
<h2 id="Solving-Key-Technical-Challenges" class="common-anchor-header">Risolvere le principali sfide tecniche<button data-href="#Solving-Key-Technical-Challenges" class="anchor-icon" translate="no">
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
    </button></h2><p>Per costruire Claude Context non è bastato collegare gli embedding e un DB vettoriale. Il vero lavoro è stato quello di risolvere i problemi più difficili che rendono possibile o meno l'indicizzazione del codice su scala. Ecco come abbiamo affrontato le tre sfide più importanti:</p>
<h3 id="Challenge-1-Intelligent-Code-Chunking" class="common-anchor-header">Sfida 1: suddivisione intelligente del codice</h3><p>Il codice non può essere suddiviso semplicemente per linee o caratteri. Questo crea frammenti disordinati e incompleti e toglie la logica che rende il codice comprensibile.</p>
<p>Abbiamo risolto questo problema con <strong>due strategie complementari</strong>:</p>
<h4 id="AST-Based-Chunking-Primary-Strategy" class="common-anchor-header">Chunking basato su AST (strategia primaria)</h4><p>È l'approccio predefinito, che utilizza parser ad albero per comprendere la struttura sintattica del codice e dividerlo lungo i confini semantici: funzioni, classi, metodi. In questo modo si ottengono:</p>
<ul>
<li><p><strong>Completezza della sintassi</strong> - nessuna funzione tagliata o dichiarazione interrotta.</p></li>
<li><p><strong>Coerenza logica</strong> - la logica correlata rimane unita per un migliore recupero semantico.</p></li>
<li><p><strong>Supporto multilingue</strong>: funziona con JS, Python, Java, Go e altri tramite grammatiche tree-sitter.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_e976593d7e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="LangChain-Text-Splitting-Fallback-Strategy" class="common-anchor-header">Divisione del testo LangChain (strategia di ripiego)</h4><p>Per le lingue che AST non è in grado di analizzare o quando l'analisi fallisce, <code translate="no">RecursiveCharacterTextSplitter</code> di LangChain fornisce un backup affidabile.</p>
<pre><code translate="no"><span class="hljs-comment">// Use recursive character splitting to maintain code structure</span>
<span class="hljs-keyword">const</span> splitter = <span class="hljs-title class_">RecursiveCharacterTextSplitter</span>.<span class="hljs-title function_">fromLanguage</span>(language, { 
  <span class="hljs-attr">chunkSize</span>: <span class="hljs-number">1000</span>, 
  <span class="hljs-attr">chunkOverlap</span>: <span class="hljs-number">200</span>,
});
<button class="copy-code-btn"></button></code></pre>
<p>È meno "intelligente" dell'AST, ma altamente affidabile: garantisce che gli sviluppatori non siano mai lasciati a piedi. Insieme, queste due strategie bilanciano la ricchezza semantica con l'applicabilità universale.</p>
<h3 id="Challenge-2-Handling-Code-Changes-Efficiently" class="common-anchor-header">Sfida 2: Gestire in modo efficiente le modifiche al codice</h3><p>La gestione delle modifiche al codice rappresenta una delle maggiori sfide dei sistemi di indicizzazione del codice. Reindicizzare interi progetti per piccole modifiche ai file sarebbe del tutto impraticabile.</p>
<p>Per risolvere questo problema, abbiamo creato un meccanismo di sincronizzazione basato sugli alberi di Merkle.</p>
<h4 id="Merkle-Trees-The-Foundation-of-Change-Detection" class="common-anchor-header">Alberi di Merkle: La base del rilevamento delle modifiche</h4><p>I Merkle Tree creano un sistema gerarchico di "impronte digitali" in cui ogni file ha la sua impronta digitale hash, le cartelle hanno impronte digitali basate sul loro contenuto e tutto culmina in un'unica impronta digitale del nodo radice per l'intera base di codice.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_79adb21c84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Quando il contenuto dei file cambia, le impronte digitali hash salgono a cascata attraverso ogni livello fino al nodo radice. Ciò consente di rilevare rapidamente le modifiche confrontando le impronte digitali hash strato per strato, dalla radice in giù, identificando e localizzando rapidamente le modifiche ai file senza dover reindicizzare l'intero progetto.</p>
<p>Il sistema esegue controlli di sincronizzazione handshake ogni 5 minuti utilizzando un processo semplificato in tre fasi:</p>
<p><strong>Fase 1: Lightning-Fast Detection</strong> calcola l'hash Merkle dell'intera base di codice e lo confronta con l'istantanea precedente. Gli hash delle radici identici significano che non sono state apportate modifiche: il sistema salta tutte le elaborazioni in pochi millisecondi.</p>
<p>La<strong>fase 2: Confronto preciso</strong> si attiva quando gli hash delle radici differiscono, eseguendo un'analisi dettagliata a livello di file per identificare esattamente quali file sono stati aggiunti, eliminati o modificati.</p>
<p><strong>Fase 3: Aggiornamenti incrementali</strong> ricalcola i vettori solo per i file modificati e aggiorna il database dei vettori di conseguenza, massimizzando l'efficienza.</p>
<h4 id="Local-Snapshot-Management" class="common-anchor-header">Gestione delle istantanee locali</h4><p>Tutto lo stato di sincronizzazione persiste localmente nella directory <code translate="no">~/.context/merkle/</code> dell'utente. Ciascuna base di codice mantiene il proprio file di snapshot indipendente contenente le tabelle hash dei file e i dati serializzati dell'albero di Merkle, assicurando un recupero accurato dello stato anche dopo il riavvio del programma.</p>
<p>Questo design offre vantaggi evidenti: la maggior parte dei controlli viene completata in pochi millisecondi quando non ci sono modifiche, solo i file realmente modificati vengono rielaborati (evitando un enorme spreco computazionale) e il recupero dello stato funziona perfettamente in tutte le sessioni del programma.</p>
<p>Dal punto di vista dell'esperienza utente, la modifica di una singola funzione attiva la reindicizzazione solo per quel file, non per l'intero progetto, migliorando notevolmente l'efficienza dello sviluppo.</p>
<h3 id="Challenge-3-Designing-the-MCP-Interface" class="common-anchor-header">Sfida 3: progettare l'interfaccia MCP</h3><p>Anche il motore di indicizzazione più intelligente è inutile senza un'interfaccia pulita per gli sviluppatori. MCP era la scelta più ovvia, ma ha introdotto sfide uniche:</p>
<h4 id="🔹-Tool-Design-Keep-It-Simple" class="common-anchor-header"><strong>🔹 Progettazione dello strumento: Mantenere la semplicità</strong></h4><p>Il modulo MCP funge da interfaccia utente, rendendo l'esperienza dell'utente la priorità assoluta.</p>
<p>La progettazione degli strumenti inizia con l'astrazione delle operazioni standard di indicizzazione e ricerca delle codebase in due strumenti principali: <code translate="no">index_codebase</code> per l'indicizzazione delle codebase e <code translate="no">search_code</code> per la ricerca del codice.</p>
<p>Ciò solleva una domanda importante: quali strumenti aggiuntivi sono necessari?</p>
<p>Il numero di strumenti richiede un attento bilanciamento: un numero eccessivo di strumenti crea un sovraccarico cognitivo e confonde la selezione degli strumenti LLM, mentre un numero troppo esiguo di strumenti potrebbe perdere funzionalità essenziali.</p>
<p>Per rispondere a questa domanda è necessario partire da casi d'uso reali.</p>
<h4 id="Addressing-Background-Processing-Challenges" class="common-anchor-header">Affrontare le sfide dell'elaborazione in background</h4><p>L'indicizzazione di grandi basi di codice può richiedere molto tempo. L'approccio ingenuo che prevede l'attesa sincrona del completamento costringe gli utenti ad aspettare diversi minuti, il che è semplicemente inaccettabile. L'elaborazione asincrona in background diventa essenziale, ma MCP non supporta in modo nativo questo modello.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_e1f0aa290f.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>Il nostro server MCP esegue un processo in background all'interno del server MCP per gestire l'indicizzazione e restituire immediatamente i messaggi di avvio agli utenti, consentendo loro di continuare a lavorare.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_1cb37d15f3.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>Questo crea una nuova sfida: come fanno gli utenti a seguire i progressi dell'indicizzazione?</p>
<p>Uno strumento dedicato per interrogare l'avanzamento o lo stato dell'indicizzazione risolve elegantemente questo problema. Il processo di indicizzazione in background memorizza in modo asincrono le informazioni sull'avanzamento, consentendo agli utenti di controllare in qualsiasi momento le percentuali di completamento, lo stato di successo o le condizioni di fallimento. Inoltre, uno strumento di cancellazione manuale degli indici gestisce le situazioni in cui gli utenti devono ripristinare gli indici imprecisi o riavviare il processo di indicizzazione.</p>
<p><strong>Design finale dello strumento:</strong></p>
<p><code translate="no">index_codebase</code> - Codice indice<code translate="no">search_code</code> - Codice di ricerca<code translate="no">get_indexing_status</code> - Stato di indicizzazione delle query<code translate="no">clear_index</code> - Cancella indice</p>
<p>Quattro strumenti che raggiungono il perfetto equilibrio tra semplicità e funzionalità.</p>
<h4 id="🔹-Environment-Variable-Management" class="common-anchor-header">Gestione delle variabili d'ambiente</h4><p>La gestione delle variabili d'ambiente viene spesso trascurata, nonostante abbia un impatto significativo sull'esperienza dell'utente. Richiedere una configurazione separata della chiave API per ogni client MCP costringerebbe gli utenti a configurare le credenziali più volte quando si passa da Claude Code a Gemini CLI.</p>
<p>Un approccio di configurazione globale elimina questo attrito creando un file <code translate="no">~/.context/.env</code> nella home directory dell'utente:</p>
<pre><code translate="no"><span class="hljs-comment"># ~/.context/.env</span>
OPENAI_API_KEY=your-api-key-here
MILVUS_TOKEN=your-milvus-token
<button class="copy-code-btn"></button></code></pre>
<p><strong>Questo approccio offre evidenti vantaggi:</strong> gli utenti configurano una sola volta e utilizzano ovunque tutti i client MCP, tutte le configurazioni sono centralizzate in un'unica posizione per una facile manutenzione e le chiavi API sensibili non si disperdono in più file di configurazione.</p>
<p>Inoltre, implementiamo una gerarchia di priorità a tre livelli: le variabili d'ambiente del processo hanno la massima priorità, i file di configurazione globali hanno una priorità media e i valori predefiniti servono come fallback.</p>
<p>Questo design offre un'enorme flessibilità: gli sviluppatori possono usare le variabili d'ambiente per le sostituzioni temporanee nei test, gli ambienti di produzione possono iniettare le configurazioni sensibili attraverso le variabili d'ambiente del sistema per una maggiore sicurezza e gli utenti configurano una sola volta per lavorare senza problemi con Claude Code, Gemini CLI e altri strumenti.</p>
<p>A questo punto, l'architettura di base del server MCP è completa e comprende l'analisi del codice e l'archiviazione dei vettori fino al recupero intelligente e alla gestione delle configurazioni. Ogni componente è stato accuratamente progettato e ottimizzato per creare un sistema potente e facile da usare.</p>
<h2 id="Hands-on-Testing" class="common-anchor-header">Test pratici<button data-href="#Hands-on-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p>Come si comporta Claude Context nella pratica? L'ho testato con lo stesso identico scenario di ricerca di bug che inizialmente mi aveva lasciato frustrato.</p>
<p>L'installazione era solo un comando prima di lanciare Claude Code:</p>
<pre><code translate="no">claude mcp add claude-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>Una volta che la mia base di codice è stata indicizzata, ho dato a Claude Code la stessa descrizione del bug che lo aveva precedentemente mandato a <strong>caccia di bug in cinque minuti</strong>. Questa volta, attraverso le chiamate a <code translate="no">claude-context</code> MCP, ha <strong>individuato immediatamente il file esatto e il numero di riga</strong>, con tanto di spiegazione del problema.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_gif_e04d07cd00.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>La differenza non era sottile: era notte e giorno.</p>
<p>E non si trattava solo di ricerca di bug. Con Claude Context integrato, Claude Code ha prodotto costantemente risultati di qualità superiore:</p>
<ul>
<li><p><strong>Risoluzione dei problemi</strong></p></li>
<li><p><strong>Rifattorizzazione del codice</strong></p></li>
<li><p><strong>Rilevamento di codice duplicato</strong></p></li>
<li><p><strong>Test completi</strong></p></li>
</ul>
<p>L'aumento delle prestazioni si vede anche nei numeri. Nei test side-by-side:</p>
<ul>
<li><p>L'utilizzo dei token è diminuito di oltre il 40%, senza alcuna perdita di richiamo.</p></li>
<li><p>Questo si traduce direttamente in costi API inferiori e risposte più rapide.</p></li>
<li><p>In alternativa, con lo stesso budget, Claude Context ha fornito risultati molto più precisi.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_2659dd3429.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Abbiamo aperto Claude Context su GitHub e ha già ottenuto oltre 2,6 milioni di stelle. Grazie a tutti per il vostro sostegno e per i vostri apprezzamenti.</p>
<p>Potete provarlo voi stessi:</p>
<ul>
<li><p>GitHub:<a href="https://github.com/zilliztech/claude-context"> github.com/zilliztech/claude-context</a></p></li>
<li><p>npm:<a href="https://www.npmjs.com/package/@zilliz/claude-context-mcp"> @zilliz/claude-context-mcp</a></p></li>
</ul>
<p>I benchmark dettagliati e la metodologia di test sono disponibili nel repo - ci piacerebbe avere il vostro feedback.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_88bf595b15.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Looking-Forward" class="common-anchor-header">Guardare avanti<button data-href="#Looking-Forward" class="anchor-icon" translate="no">
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
    </button></h2><p>Ciò che è iniziato come una frustrazione con grep in Claude Code si è trasformato in una soluzione solida: <a href="https://github.com/zilliztech/claude-context"><strong>Claude Context, un</strong></a>plugin MCP open-source che porta la ricerca semantica e vettoriale in Claude Code e in altri assistenti di codifica. Il messaggio è semplice: gli sviluppatori non devono accontentarsi di strumenti di IA inefficienti. Con RAG e la ricerca vettoriale, è possibile eseguire il debug più velocemente, ridurre i costi dei token del 40% e ottenere finalmente un'assistenza AI che comprenda veramente la vostra base di codice.</p>
<p>E questo non è limitato a Claude Code. Poiché Claude Context è costruito su standard aperti, lo stesso approccio funziona perfettamente con Gemini CLI, Qwen Code, Cursor, Cline e altri. Non dovrete più essere bloccati da compromessi tra fornitori che privilegiano la semplicità rispetto alle prestazioni.</p>
<p>Ci piacerebbe che anche voi faceste parte di questo futuro:</p>
<ul>
<li><p><strong>Provate</strong> <a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a><strong>:</strong> è open-source e totalmente gratuito<strong>.</strong> </p></li>
<li><p><strong>Contribuite al suo sviluppo</strong></p></li>
<li><p><strong>Oppure costruite la vostra soluzione</strong> utilizzando Claude Context.</p></li>
</ul>
<p>👉 Condividete il vostro feedback, fate domande o chiedete aiuto unendovi alla nostra <a href="https://discord.com/invite/8uyFbECzPX"><strong>comunità Discord</strong></a>.</p>
