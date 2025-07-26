---
id: build-open-source-alternative-to-cursor-with-code-context.md
title: Costruire un'alternativa open source al Cursore con il contesto del codice
author: Cheney Zhang
date: 2025-07-24T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Jul_26_2025_08_26_35_PM_b728fb730c.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'vector database, mcp, LLM, claude, gemini'
meta_keywords: 'Cursor, Claude Code, Gemini CLI, Code search, semantic code search'
meta_title: |
  Building an Open-Source Alternative to Cursor with Code Context
desc: >-
  Code Context: un plugin open-source, compatibile con MCP, che porta una
  potente ricerca semantica del codice in qualsiasi agente di codifica AI,
  Claude Code e Gemini CLI, IDE come VSCode e persino ambienti come Chrome.
origin: >-
  https://milvus.io/blog/build-open-source-alternative-to-cursor-with-code-context.md
---
<h2 id="The-AI-Coding-BoomAnd-Its-Blind-Spot" class="common-anchor-header">Il boom della codifica dell'intelligenza artificiale e il suo punto cieco<button data-href="#The-AI-Coding-BoomAnd-Its-Blind-Spot" class="anchor-icon" translate="no">
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
    </button></h2><p>Gli strumenti di codifica AI sono ovunque e stanno diventando virali per una buona ragione. Da <a href="https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md">Claude Code a Gemini CLI</a>, fino alle alternative open-source di Cursor, questi agenti sono in grado di scrivere funzioni, spiegare le dipendenze del codice e rifattorizzare interi file con un solo prompt. Gli sviluppatori stanno facendo a gara per integrarli nei loro flussi di lavoro e, per molti versi, stanno mantenendo l'entusiasmo.</p>
<p><strong>Ma quando si tratta di <em>comprendere la vostra base di codice</em>, la maggior parte degli strumenti di intelligenza artificiale si scontra con un muro.</strong></p>
<p>Se chiedete a Claude Code di trovare "dove questo progetto gestisce l'autenticazione dell'utente", il risultato è <code translate="no">grep -r &quot;auth&quot;</code>, con 87 corrispondenze vagamente correlate tra commenti, nomi di variabili e nomi di file, senza probabilmente trovare molte funzioni con logica di autenticazione ma non chiamate "auth". Provate Gemini CLI, e cercherà parole chiave come "login" o "password", mancando del tutto funzioni come <code translate="no">verifyCredentials()</code>. Questi strumenti sono ottimi per generare codice, ma quando è il momento di navigare, eseguire il debug o esplorare sistemi sconosciuti, cadono a pezzi. A meno che non inviino l'intera base di codice all'LLM per contestualizzarla - bruciando token e tempo - fanno fatica a fornire risposte significative.</p>
<p><em>Questa è la vera lacuna degli attuali strumenti di intelligenza artificiale: il</em> <strong><em>contesto del codice.</em></strong></p>
<h2 id="Cursor-Nailed-ItBut-Not-for-Everyone" class="common-anchor-header">Cursor l'ha colmata, ma non per tutti<button data-href="#Cursor-Nailed-ItBut-Not-for-Everyone" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Cursor</strong> affronta questo problema di petto. Invece di una ricerca per parole chiave, costruisce una mappa semantica della base di codice utilizzando alberi di sintassi, embeddings vettoriali e ricerca code-aware. Se gli chiedete "dov'è la logica di convalida delle e-mail?", vi restituirà <code translate="no">isValidEmailFormat()</code>, non perché il nome corrisponda, ma perché capisce cosa <em>fa</em> quel codice.</p>
<p>Pur essendo potente, Cursor potrebbe non essere adatto a tutti. <strong><em>Cursor è closed-source, ospitato nel cloud e basato su abbonamento.</em></strong> Questo lo rende irraggiungibile per i team che lavorano con codice sensibile, per le organizzazioni attente alla sicurezza, per gli sviluppatori indipendenti, per gli studenti e per tutti coloro che preferiscono i sistemi aperti.</p>
<h2 id="What-if-You-Could-Build-Your-Own-Cursor" class="common-anchor-header">E se si potesse costruire il proprio cursore?<button data-href="#What-if-You-Could-Build-Your-Own-Cursor" class="anchor-icon" translate="no">
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
    </button></h2><p>Ecco il punto: la tecnologia di base di Cursor non è proprietaria. È costruita su basi open-source collaudate, come i database vettoriali di <a href="https://milvus.io/">Milvus</a>, i <a href="https://zilliz.com/ai-models">modelli di embedding</a>, i parser di sintassi con Tree-sitter, tutti disponibili per chiunque voglia unire i puntini.</p>
<p><em>Così ci siamo chiesti:</em> <strong><em>E se chiunque potesse costruire il proprio Cursor?</em></strong> Funziona sulla vostra infrastruttura. Nessun costo di abbonamento. Completamente personalizzabile. Controllo completo su codice e dati.</p>
<p>Ecco perché abbiamo creato <a href="https://github.com/zilliztech/code-context"><strong>Code Context, un</strong></a>plugin open-source compatibile con MCP che porta una potente ricerca semantica del codice in qualsiasi agente di codifica AI, come Claude Code e Gemini CLI, IDE come VSCode e persino ambienti come Google Chrome. Inoltre, vi dà la possibilità di costruire da zero il vostro agente di codifica come Cursor, sbloccando la navigazione intelligente in tempo reale della vostra base di codice.</p>
<p><strong><em>Nessun abbonamento. Nessuna scatola nera. Solo intelligenza del codice alle vostre condizioni.</em></strong></p>
<p>Nel resto del post vi spiegheremo come funziona Code Context e come potete iniziare a usarlo oggi stesso.</p>
<h2 id="Code-Context-Open-Source-Alternative-to-Cursors-Intelligence" class="common-anchor-header">Code Context: Alternativa open source all'intelligenza di Cursor<button data-href="#Code-Context-Open-Source-Alternative-to-Cursors-Intelligence" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/code-context"><strong>Code Context</strong></a> è un motore di ricerca semantica del codice open-source e compatibile con MCP. Sia che stiate costruendo un assistente di codifica AI personalizzato da zero o che vogliate aggiungere la consapevolezza semantica ad agenti di codifica AI come Claude Code e Gemini CLI, Code Context è il motore che lo rende possibile.</p>
<p>Funziona localmente, si integra con gli strumenti e gli ambienti preferiti, come VS Code e i browser Chrome, e offre una solida comprensione del codice senza affidarsi a piattaforme closed-source solo cloud.</p>
<p><strong>Le funzionalità principali includono:</strong></p>
<ul>
<li><p><strong>Ricerca semantica del codice tramite linguaggio naturale:</strong> Trova il codice usando l'inglese semplice. Cercate concetti come "verifica del login dell'utente" o "logica di elaborazione dei pagamenti" e Code Context individua le funzioni pertinenti, anche se non corrispondono esattamente alle parole chiave.</p></li>
<li><p><strong>Supporto multilingue:</strong> Ricerca senza soluzione di continuità in oltre 15 linguaggi di programmazione, tra cui JavaScript, Python, Java e Go, con una comprensione semantica coerente tra tutti.</p></li>
<li><p><strong>Code Chunking basato su AST:</strong> Il codice viene automaticamente suddiviso in unità logiche, come funzioni e classi, utilizzando il parsing AST, per garantire risultati di ricerca completi, significativi e mai interrotti a metà funzione.</p></li>
<li><p><strong>Indicizzazione incrementale in tempo reale:</strong> Le modifiche al codice vengono indicizzate in tempo reale. Man mano che si modificano i file, l'indice di ricerca rimane aggiornato, senza bisogno di aggiornamenti o reindicizzazioni manuali.</p></li>
<li><p><strong>Distribuzione completamente locale e sicura:</strong> Eseguite tutto sulla vostra infrastruttura. Code Context supporta i modelli locali tramite Ollama e l'indicizzazione tramite <a href="https://milvus.io/">Milvus</a>, in modo che il codice non esca mai dal vostro ambiente.</p></li>
<li><p><strong>Integrazione IDE di prima classe:</strong> L'estensione VSCode consente di cercare e saltare ai risultati istantaneamente, direttamente dall'editor, senza passare dal contesto.</p></li>
<li><p><strong>Supporto del protocollo MCP:</strong> Code Context parla MCP, facilitando l'integrazione con gli assistenti di codifica AI e portando la ricerca semantica direttamente nei loro flussi di lavoro.</p></li>
<li><p><strong>Supporto per i plugin del browser:</strong> Ricerca nei repository direttamente da GitHub nel browser: nessuna scheda, nessun copia-incolla, solo un contesto immediato ovunque si stia lavorando.</p></li>
</ul>
<h3 id="How-Code-Context-Works" class="common-anchor-header">Come funziona Code Context</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/How_Code_Context_Works_3faaa2fff3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Code Context utilizza un'architettura modulare con un orchestratore centrale e componenti specializzati per l'incorporazione, il parsing, l'archiviazione e il recupero.</p>
<h3 id="The-Core-Module-Code-Context-Core" class="common-anchor-header">Il modulo centrale: Code Context Core</h3><p>Il cuore di Code Context è il <strong>Code Context Core</strong>, che coordina il parsing, l'embedding, l'archiviazione e il recupero semantico del codice:</p>
<ul>
<li><p>Il<strong>modulo di elaborazione del testo</strong> divide e analizza il codice utilizzando Tree-sitter per l'analisi AST consapevole della lingua.</p></li>
<li><p>L<strong>'interfaccia di incorporazione</strong> supporta backend collegabili - attualmente OpenAI e VoyageAI - che convertono i pezzi di codice in embeddings vettoriali che catturano il loro significato semantico e le relazioni contestuali.</p></li>
<li><p><strong>La Vector Database Interface</strong> memorizza questi embeddings in un'istanza <a href="https://milvus.io/">Milvus</a> self-hosted (per impostazione predefinita) o in <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, la versione gestita di Milvus.</p></li>
</ul>
<p>Tutto questo viene sincronizzato con il vostro file system su base programmata, assicurando che l'indice rimanga aggiornato senza richiedere un intervento manuale.</p>
<h3 id="Extension-Modules-on-top-of-Code-Context-Core" class="common-anchor-header">Moduli di estensione in aggiunta al Code Context Core</h3><ul>
<li><p><strong>Estensione VSCode</strong>: Integrazione perfetta con l'IDE per una rapida ricerca semantica in editor e per il salto alla definizione.</p></li>
<li><p><strong>Estensione per Chrome</strong>: Ricerca semantica in linea del codice durante la navigazione nei repository GitHub, senza bisogno di cambiare scheda.</p></li>
<li><p><strong>MCP Server</strong>: Espone Code Context a qualsiasi assistente di codifica AI tramite il protocollo MCP, consentendo un'assistenza in tempo reale e consapevole del contesto.</p></li>
</ul>
<h2 id="Getting-Started-with-Code-Context" class="common-anchor-header">Come iniziare con Code Context<button data-href="#Getting-Started-with-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Code Context può essere inserito negli strumenti di codifica già in uso o per creare un assistente di codifica AI personalizzato da zero. In questa sezione illustreremo entrambi gli scenari:</p>
<ul>
<li><p>Come integrare Code Context con gli strumenti esistenti</p></li>
<li><p>Come configurare il modulo Core per la ricerca semantica autonoma del codice quando si costruisce il proprio assistente di codifica AI</p></li>
</ul>
<h3 id="MCP-Integration" class="common-anchor-header">Integrazione MCP</h3><p>Code Context supporta il <strong>Model Context Protocol (MCP)</strong>, consentendo agli agenti di codifica AI come Claude Code di utilizzarlo come backend semantico.</p>
<p>Integrazione con Claude Code:</p>
<pre><code translate="no">claude mcp add code-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_ADDRESS=your-zilliz-cloud-<span class="hljs-keyword">public</span>-endpoint -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/code-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_code_context_processed_3908097481.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Una volta configurato, Claude Code chiamerà automaticamente Code Context per la ricerca semantica del codice quando necessario.</p>
<p>Per l'integrazione con altri strumenti o ambienti, consultare il nostro<a href="https://github.com/zilliztech/code-context"> repo GitHub</a> per ulteriori esempi e adattatori.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/MCP_Integration_2_683c7ef73d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Building-Your-Own-AI-Coding-Assistant-with-Code-Context" class="common-anchor-header">Creare il proprio assistente di codifica AI con Code Context</h3><p>Per creare un assistente AI personalizzato con Code Context, è necessario configurare il modulo principale per la ricerca semantica del codice in soli tre passaggi:</p>
<ol>
<li><p>Configurare il modello di incorporamento</p></li>
<li><p>Connettersi al proprio database vettoriale</p></li>
<li><p>Indicizzare il progetto e avviare la ricerca</p></li>
</ol>
<p>Ecco un esempio che utilizza <strong>OpenAI Embeddings</strong> e il <strong>database vettoriale</strong> <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a> come backend vettoriale:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">CodeContext</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/code-context-core&#x27;</span>;

<span class="hljs-comment">// Initialize embedding model</span>
<span class="hljs-keyword">const</span> embedding = <span class="hljs-keyword">new</span> <span class="hljs-title class_">OpenAIEmbedding</span>({
    <span class="hljs-attr">apiKey</span>: <span class="hljs-string">&#x27;your-openai-api-key&#x27;</span>,
    <span class="hljs-attr">model</span>: <span class="hljs-string">&#x27;text-embedding-3-small&#x27;</span>
});

<span class="hljs-comment">// Initialize Zilliz Cloud vector database</span>
<span class="hljs-comment">// Sign up for free at https://zilliz.com/cloud</span>
<span class="hljs-keyword">const</span> vectorDatabase = <span class="hljs-keyword">new</span> <span class="hljs-title class_">MilvusVectorDatabase</span>({
    <span class="hljs-attr">address</span>: <span class="hljs-string">&#x27;https://xxx-xxxxxxxxxxxx.serverless.gcp-us-west1.cloud.zilliz.com&#x27;</span>,
    <span class="hljs-attr">token</span>: <span class="hljs-string">&#x27;xxxxxxx&#x27;</span>
});

<span class="hljs-comment">// Create the Code Context indexer</span>
<span class="hljs-keyword">const</span> context = <span class="hljs-keyword">new</span> <span class="hljs-title class_">CodeContext</span>({ embedding, vectorDatabase });

<span class="hljs-comment">// Index the codebase</span>
<span class="hljs-keyword">await</span> context.<span class="hljs-title function_">indexCodebase</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>);

<span class="hljs-comment">// Perform semantic code search</span>
<span class="hljs-keyword">const</span> results = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">semanticSearch</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>, <span class="hljs-string">&#x27;vector database operations&#x27;</span>, <span class="hljs-number">5</span>);
results.<span class="hljs-title function_">forEach</span>(<span class="hljs-function"><span class="hljs-params">result</span> =&gt;</span> {
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">`<span class="hljs-subst">${result.relativePath}</span>:<span class="hljs-subst">${result.startLine}</span>-<span class="hljs-subst">${result.endLine}</span>`</span>);
    <span class="hljs-variable language_">console</span>.<span class="hljs-title function_">log</span>(<span class="hljs-string">`score: <span class="hljs-subst">${(result.score * <span class="hljs-number">100</span>).toFixed(<span class="hljs-number">2</span>)}</span>%`</span>);
});
<button class="copy-code-btn"></button></code></pre>
<h3 id="VSCode-Extension" class="common-anchor-header">Estensione VSCode</h3><p>Code Context è disponibile come estensione di VSCode denominata <strong>"Semantic Code Search",</strong> che porta la ricerca intelligente di codice in linguaggio naturale direttamente nel vostro editor.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/VS_Code_Extension_e358f36464.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Una volta installata:</p>
<ul>
<li><p>Configurare la chiave API</p></li>
<li><p>Indicizzare il progetto</p></li>
<li><p>Usare query in inglese semplice (non è necessaria la corrispondenza esatta).</p></li>
<li><p>Saltare istantaneamente ai risultati con un clic di navigazione</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/mcp_code_context_processed_3908097481.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>In questo modo l'esplorazione semantica diventa parte integrante del vostro flusso di lavoro di codifica, senza bisogno di un terminale o di un browser.</p>
<h3 id="Chrome-Extension-Coming-Soon" class="common-anchor-header">Estensione per Chrome (in arrivo)</h3><p>La nostra prossima <strong>estensione per Chrome</strong> porta Code Context nelle pagine web di GitHub, permettendovi di eseguire ricerche semantiche sul codice direttamente all'interno di qualsiasi repository pubblico, senza dover cambiare contesto o scheda.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/chrome_4e67b683d7.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sarete in grado di esplorare codebase sconosciuti con le stesse capacità di ricerca profonda che avete a livello locale. Restate sintonizzati: l'estensione è in fase di sviluppo e verrà lanciata a breve.</p>
<h2 id="Why-Use-Code-Context" class="common-anchor-header">Perché usare Code Context?<button data-href="#Why-Use-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>La configurazione di base consente di lavorare rapidamente, ma <strong>Code Context</strong> si distingue soprattutto negli ambienti di sviluppo professionali ad alte prestazioni. Le sue funzioni avanzate sono progettate per supportare flussi di lavoro seri, dalle distribuzioni su scala aziendale agli strumenti AI personalizzati.</p>
<h3 id="Private-Deployment-for-Enterprise-Grade-Security" class="common-anchor-header">Distribuzione privata per una sicurezza di livello aziendale</h3><p>Code Context supporta la distribuzione completamente offline utilizzando il modello di incorporazione locale <strong>di Ollama</strong> e <strong>Milvus</strong> come database vettoriale self-hosted. Ciò consente una pipeline di ricerca del codice completamente privata: nessuna chiamata API, nessuna trasmissione via Internet e nessun dato lascia l'ambiente locale.</p>
<p>Questa architettura è ideale per i settori con requisiti di conformità rigorosi, come la finanza, la pubblica amministrazione e la difesa, dove la riservatezza del codice non è negoziabile.</p>
<h3 id="Real-Time-Indexing-with-Intelligent-File-Sync" class="common-anchor-header">Indicizzazione in tempo reale con sincronizzazione intelligente dei file</h3><p>Mantenere aggiornato l'indice del codice non deve essere lento o manuale. Code Context include un <strong>sistema di monitoraggio dei file basato su Merkle Tree</strong> che rileva istantaneamente le modifiche ed esegue aggiornamenti incrementali in tempo reale.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Real_Time_Indexing_with_Intelligent_File_Sync_49c303a38f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Reindicizzando solo i file modificati, riduce i tempi di aggiornamento dei repository di grandi dimensioni da minuti a secondi. Questo garantisce che il codice appena scritto sia già ricercabile, senza dover fare clic su "aggiorna".</p>
<p>In ambienti di sviluppo frenetici, questo tipo di immediatezza è fondamentale.</p>
<h3 id="AST-Parsing-That-Understands-Code-Like-You-Do" class="common-anchor-header">Parsing AST che capisce il codice come lo capisci tu</h3><p>Gli strumenti tradizionali di ricerca del codice suddividono il testo in base al numero di righe o di caratteri, spesso interrompendo le unità logiche e restituendo risultati confusi.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/AST_Parsing_That_Understands_Code_Like_You_Do_3236afc075.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Code Context fa di meglio. Utilizza il parsing AST di Tree-sitter per comprendere l'effettiva struttura del codice. Identifica funzioni, classi, interfacce e moduli completi, fornendo risultati puliti e semanticamente completi.</p>
<p>Supporta i principali linguaggi di programmazione, tra cui JavaScript/TypeScript, Python, Java, C/C++, Go e Rust, con strategie specifiche per il linguaggio per un chunking accurato. Per i linguaggi non supportati, si ricorre a un parsing basato su regole, assicurando così una gestione senza problemi, senza arresti anomali o risultati vuoti.</p>
<p>Queste unità di codice strutturato confluiscono anche nei metadati per una ricerca semantica più accurata.</p>
<h3 id="Open-Source-and-Extensible-by-Design" class="common-anchor-header">Open Source ed estensibile per design</h3><p>Code Context è completamente open source con licenza MIT. Tutti i moduli principali sono pubblicamente disponibili su GitHub.</p>
<p>Crediamo che l'infrastruttura aperta sia la chiave per costruire strumenti potenti e affidabili per gli sviluppatori e li invitiamo a estenderla per nuovi modelli, linguaggi o casi d'uso.</p>
<h3 id="Solving-the-Context-Window-Problem-for-AI-Assistants" class="common-anchor-header">Risolvere il problema della finestra contestuale per gli assistenti AI</h3><p>I modelli linguistici di grandi dimensioni (LLM) hanno un limite: la loro finestra di contesto. Ciò impedisce loro di vedere un'intera base di codice, riducendo l'accuratezza dei completamenti, delle correzioni e dei suggerimenti.</p>
<p>Code Context aiuta a colmare questa lacuna. La sua ricerca semantica del codice recupera i pezzi di codice <em>giusti</em>, fornendo all'assistente AI un contesto mirato e pertinente con cui ragionare. Migliora la qualità dei risultati generati dall'intelligenza artificiale, consentendo al modello di "concentrarsi" su ciò che conta davvero.</p>
<p>I più diffusi strumenti di codifica dell'intelligenza artificiale, come Claude Code e Gemini CLI, non dispongono di una ricerca semantica nativa del codice, ma si affidano a un'euristica superficiale basata su parole chiave. Code Context, se integrato tramite <strong>MCP</strong>, offre loro un aggiornamento cerebrale.</p>
<h3 id="Built-for-Developers-by-Developers" class="common-anchor-header">Costruito per gli sviluppatori, dagli sviluppatori</h3><p>Code Context è confezionato per il riutilizzo modulare: ogni componente è disponibile come pacchetto <strong>npm</strong> indipendente. È possibile mescolare, abbinare ed estendere a seconda delle esigenze del progetto.</p>
<ul>
<li><p>Avete bisogno solo di una ricerca semantica del codice? Utilizzare<code translate="no">@zilliz/code-context-core</code></p></li>
<li><p>Volete collegare un agente di intelligenza artificiale? Aggiungere <code translate="no">@zilliz/code-context-mcp</code></p></li>
<li><p>State costruendo il vostro IDE/strumento browser? Cercate tra i nostri esempi di VSCode e di estensione di Chrome.</p></li>
</ul>
<p>Alcuni esempi di applicazione del contesto del codice:</p>
<ul>
<li><p><strong>Plugin di autocompletamento consapevoli del contesto</strong> che estraggono snippet rilevanti per migliorare il completamento dell'LLM</p></li>
<li><p><strong>Rilevatori intelligenti di bug</strong> che raccolgono il codice circostante per migliorare i suggerimenti di correzione</p></li>
<li><p><strong>Strumenti di refactoring sicuro del codice</strong> che trovano automaticamente posizioni semanticamente correlate</p></li>
<li><p><strong>Visualizzatori di architettura</strong> che costruiscono diagrammi dalle relazioni semantiche del codice</p></li>
<li><p><strong>Assistenti alla revisione del codice più intelligenti</strong> che fanno emergere le implementazioni storiche durante le revisioni PR</p></li>
</ul>
<h2 id="Welcome-to-Join-Our-Community" class="common-anchor-header">Benvenuti a far parte della nostra comunità<button data-href="#Welcome-to-Join-Our-Community" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/code-context"><strong>Code Context</strong></a> è più di un semplice strumento: è una piattaforma per esplorare come l <strong>'intelligenza artificiale e i database vettoriali</strong> possano lavorare insieme per comprendere veramente il codice. Man mano che lo sviluppo assistito dall'intelligenza artificiale diventa la norma, crediamo che la ricerca semantica del codice sarà una capacità fondamentale.</p>
<p>Accogliamo con favore contributi di ogni tipo:</p>
<ul>
<li><p>Supporto per nuovi linguaggi</p></li>
<li><p>Nuovi backend di modelli di incorporamento</p></li>
<li><p>Flussi di lavoro innovativi assistiti dall'IA</p></li>
<li><p>Feedback, segnalazioni di bug e idee di design</p></li>
</ul>
<p>Trovateci qui:</p>
<ul>
<li><p><a href="https://github.com/zilliztech/code-context">Code Context su GitHub</a> | <a href="https://www.npmjs.com/package/@zilliz/code-context-mcp"><strong>Pacchetto npm MCP</strong></a> | <a href="https://marketplace.visualstudio.com/items?itemName=zilliz.semanticcodesearch"><strong>Mercato VSCode</strong></a></p></li>
<li><p><a href="https://discuss.milvus.io/">Discord</a> | <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> | <a href="https://x.com/zilliz_universe">X</a> | <a href="https://www.youtube.com/@MilvusVectorDatabase/featured">YouTube</a></p></li>
</ul>
<p>Insieme, possiamo costruire l'infrastruttura per la prossima generazione di strumenti di sviluppo dell'intelligenza artificiale: trasparenti, potenti e orientati agli sviluppatori.</p>
<p><a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/office_hour_83d4623510.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
