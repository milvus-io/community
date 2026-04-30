---
id: claude-context-reduce-claude-code-token-usage.md
title: >-
  Contesto Claude: Ridurre l'uso dei token del codice Claude con il recupero del
  codice da parte di Milvus
author: Cheney Zhang
date: 2026-4-30
cover: assets.zilliz.com/image_3b2d2999ac.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude Context, Claude Code token usage, code retrieval, MCP server, Milvus'
meta_title: |
  Claude Context: Cut Claude Code Token Usage with Milvus
desc: >-
  Claude Code brucia token su grep? Scoprite come Claude Context utilizza il
  recupero ibrido supportato da Milvus per ridurre l'uso dei token del 39,4%.
origin: 'https://milvus.io/blog/claude-context-reduce-claude-code-token-usage.md'
---
<p>Le ampie finestre contestuali fanno sentire gli agenti di codifica AI senza limiti, fino a quando non iniziano a leggere metà del vostro repository per rispondere a una domanda. Per molti utenti di Claude Code, la parte più costosa non è solo il ragionamento del modello. È il ciclo di recupero: cercare una parola chiave, leggere un file, cercare di nuovo, leggere altri file e continuare a pagare per un contesto irrilevante.</p>
<p>Claude Context è un server MCP open-source per il recupero del codice che offre a Claude Code e ad altri agenti di codifica AI un modo migliore per trovare il codice rilevante. Indicizza il repository, memorizza i pezzi di codice ricercabili in un <a href="https://zilliz.com/learn/what-is-vector-database">database vettoriale</a> e utilizza un sistema <a href="https://zilliz.com/blog/hybrid-search-with-milvus">di recupero ibrido</a>, in modo che l'agente possa prelevare il codice di cui ha effettivamente bisogno invece di inondare il prompt con i risultati di grep.</p>
<p>Nei nostri benchmark, Claude Context ha ridotto il consumo di token del 39,4% in media e ha tagliato le chiamate agli strumenti del 36,1%, preservando la qualità del reperimento. Questo post spiega perché il recupero in stile grep spreca il contesto, come funziona Claude Context sotto il cofano e come si confronta con un flusso di lavoro di base su attività di debug reali.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_6_68b1f70723.png" alt="Claude Context GitHub repository trending and passing 10,000 stars" class="doc-image" id="claude-context-github-repository-trending-and-passing-10,000-stars" />
   </span> <span class="img-wrapper"> <span>Il repository GitHub di Claude Context ha superato le 10.000 stelle</span> </span>.</p>
<h2 id="Why-grep-style-code-retrieval-burns-tokens-in-AI-coding-agents" class="common-anchor-header">Perché il recupero del codice in stile grep brucia i token negli agenti di codifica AI<button data-href="#Why-grep-style-code-retrieval-burns-tokens-in-AI-coding-agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Un agente di codifica AI può scrivere codice utile solo se comprende la base di codice che circonda il compito: percorsi di chiamata delle funzioni, convenzioni di denominazione, test correlati, modelli di dati e modelli di implementazione storici. Un'ampia finestra di contesto aiuta, ma non risolve il problema del reperimento. Se i file sbagliati entrano nel contesto, il modello spreca ancora token e può ragionare a partire da codice irrilevante.</p>
<p>Il reperimento del codice rientra solitamente in due schemi generali:</p>
<table>
<thead>
<tr><th>Modello di recupero</th><th>Come funziona</th><th>Dove si rompe</th></tr>
</thead>
<tbody>
<tr><td>Recupero in stile Grep</td><td>Cerca stringhe letterali, poi legge i file o gli intervalli di righe corrispondenti.</td><td>Manca il codice semanticamente correlato, restituisce corrispondenze rumorose e spesso richiede cicli ripetuti di ricerca/lettura.</td></tr>
<tr><td>Recupero in stile RAG</td><td>Indicizza il codice in anticipo, quindi recupera i pezzi rilevanti con una ricerca semantica, lessicale o ibrida.</td><td>Richiede logiche di chunking, embedding, indicizzazione e aggiornamento che la maggior parte degli strumenti di codifica non vuole possedere direttamente.</td></tr>
</tbody>
</table>
<p>Questa è la stessa distinzione che gli sviluppatori vedono nella progettazione <a href="https://zilliz.com/blog/metadata-filtering-hybrid-search-or-agent-in-rag-applications">delle applicazioni RAG</a>: la corrispondenza letterale è utile, ma raramente è sufficiente quando il significato è importante. Una funzione denominata <code translate="no">compute_final_cost()</code> può essere rilevante per una query su <code translate="no">calculate_total_price()</code> anche se le parole esatte non corrispondono. È qui che la <a href="https://zilliz.com/blog/semantic-search-vs-lexical-search-vs-full-text-search">ricerca semantica</a> ci viene in aiuto.</p>
<p>In un'esecuzione di debug, Claude Code ha cercato e letto ripetutamente i file prima di individuare l'area giusta. Dopo diversi minuti, solo una piccola parte del codice consumato era rilevante.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_4_69b8455aeb.png" alt="Claude Code grep-style search spending time on irrelevant file reads" class="doc-image" id="claude-code-grep-style-search-spending-time-on-irrelevant-file-reads" />
    La </span> <span class="img-wrapper"> <span>ricerca in stile grep di Claude Code spende tempo per leggere file irrilevanti</span> </span></p>
<p>Questo modello è abbastanza comune che gli sviluppatori se ne lamentano pubblicamente: l'agente può essere intelligente, ma il ciclo di recupero del contesto è ancora costoso e impreciso.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_8_b857ab4777.png" alt="Developer comment about Claude Code context and token usage" class="doc-image" id="developer-comment-about-claude-code-context-and-token-usage" />
   </span> <span class="img-wrapper"> <span>Commento degli sviluppatori sull'uso del contesto e dei token di Claude Code</span> </span></p>
<p>Il recupero in stile Grep fallisce in tre modi prevedibili:</p>
<ul>
<li><strong>Sovraccarico di informazioni:</strong> archivi di grandi dimensioni producono molte corrispondenze letterali, la maggior parte delle quali non sono utili per il compito corrente.</li>
<li><strong>Cecità semantica:</strong> grep cerca le stringhe, non l'intento, il comportamento o i modelli di implementazione equivalenti.</li>
<li><strong>Perdita di contesto: le</strong> corrispondenze a livello di riga non includono automaticamente la classe circostante, le dipendenze, i test o il grafico delle chiamate.</li>
</ul>
<p>Un livello migliore di recupero del codice deve combinare la precisione delle parole chiave con la comprensione semantica e restituire pezzi sufficientemente completi per consentire al modello di ragionare sul codice.</p>
<h2 id="What-is-Claude-Context" class="common-anchor-header">Che cos'è Claude Context?<button data-href="#What-is-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Context è un server open-source <a href="https://zilliz.com/glossary/model-context-protocol-(mcp)">Model Context Protocol</a> per il recupero del codice. Collega gli strumenti di codifica dell'intelligenza artificiale a un indice di codice supportato da Milvus, in modo che un agente possa cercare in un archivio in base al significato, invece di affidarsi solo alla ricerca di testo letterale.</p>
<p>L'obiettivo è semplice: quando l'agente chiede un contesto, restituisce il più piccolo insieme utile di pezzi di codice. Claude Context fa questo analizzando la base di codice, generando embeddings, memorizzando i pezzi nel <a href="https://zilliz.com/what-is-milvus">database vettoriale di Milvus</a> ed esponendo il recupero attraverso strumenti compatibili con MCP.</p>
<table>
<thead>
<tr><th>Problema Grep</th><th>Approccio Claude Context</th></tr>
</thead>
<tbody>
<tr><td>Troppe corrispondenze irrilevanti</td><td>Classifica i pezzi di codice in base alla somiglianza dei vettori e alla rilevanza delle parole chiave.</td></tr>
<tr><td>Nessuna comprensione semantica</td><td>Utilizzare un <a href="https://zilliz.com/blog/voyage-ai-embeddings-and-rerankers-for-search-and-rag">modello di embedding</a> per far corrispondere le implementazioni correlate anche quando i nomi differiscono.</td></tr>
<tr><td>Manca il contesto circostante</td><td>Restituire pezzi di codice completi con una struttura sufficiente per consentire al modello di ragionare sul comportamento.</td></tr>
<tr><td>Letture ripetute di file</td><td>Cercate prima nell'indice, poi leggete o modificate solo i file che contano.</td></tr>
</tbody>
</table>
<p>Poiché Claude Context è esposto attraverso MCP, può funzionare con Claude Code, Gemini CLI, host MCP di tipo Cursor e altri ambienti compatibili con MCP. Lo stesso livello centrale di reperimento può supportare più interfacce agente.</p>
<h2 id="How-Claude-Context-works-under-the-hood" class="common-anchor-header">Come funziona Claude Context sotto il cofano<button data-href="#How-Claude-Context-works-under-the-hood" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Context ha due livelli principali: un modulo centrale riutilizzabile e moduli di integrazione. Il nucleo gestisce parsing, chunking, indicizzazione, ricerca e sincronizzazione incrementale. Il livello superiore espone queste funzionalità attraverso integrazioni con MCP ed editor.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_5_cf9f17013f.png" alt="Claude Context architecture showing MCP integrations, core module, embedding provider, and vector database" class="doc-image" id="claude-context-architecture-showing-mcp-integrations,-core-module,-embedding-provider,-and-vector-database" />
   </span> <span class="img-wrapper"> <span>L'architettura di Claude Context mostra le integrazioni MCP, il modulo centrale, il fornitore di incorporazioni e il database vettoriale</span> </span>.</p>
<h3 id="How-does-MCP-connect-Claude-Context-to-coding-agents" class="common-anchor-header">In che modo MCP collega Claude Context agli agenti di codifica?</h3><p>MCP fornisce l'interfaccia tra l'host LLM e gli strumenti esterni. Esponendo Claude Context come server MCP, il livello di reperimento rimane indipendente da qualsiasi IDE o assistente di codifica. L'agente chiama uno strumento di ricerca; Claude Context gestisce l'indice del codice e restituisce i pezzi rilevanti.</p>
<p>Se volete capire il modello più ampio, la <a href="https://milvus.io/docs/milvus_and_mcp.md">guida MCP + Milvus</a> mostra come MCP può collegare strumenti di intelligenza artificiale a operazioni di database vettoriali.</p>
<h3 id="Why-use-Milvus-for-code-retrieval" class="common-anchor-header">Perché usare Milvus per il recupero del codice?</h3><p>Il reperimento del codice richiede una ricerca vettoriale veloce, il filtraggio dei metadati e una scala sufficiente per gestire archivi di grandi dimensioni. Milvus è progettato per la ricerca vettoriale ad alte prestazioni e può supportare vettori densi, vettori radi e flussi di lavoro di reranking. Per i team che stanno costruendo sistemi ad agenti con un elevato carico di ricerca, i documenti sulla <a href="https://milvus.io/docs/multi-vector-search.md">ricerca ibrida multivettoriale</a> e l'<a href="https://milvus.io/api-reference/pymilvus/v2.6.x/MilvusClient/Vector/hybrid_search.md">API PyMilvus hybrid_search</a> mostrano lo stesso modello di ricerca utilizzato nei sistemi di produzione.</p>
<p>Claude Context può utilizzare Zilliz Cloud come backend gestito di Milvus, evitando così di gestire e scalare il database vettoriale. La stessa architettura può essere adattata anche a distribuzioni Milvus autogestite.</p>
<h3 id="Which-embedding-providers-does-Claude-Context-support" class="common-anchor-header">Quali fornitori di incorporazioni supporta Claude Context?</h3><p>Claude Context supporta diverse opzioni di incorporamento:</p>
<table>
<thead>
<tr><th>Provider</th><th>Più adatto</th></tr>
</thead>
<tbody>
<tr><td>Incorporamenti OpenAI</td><td>Embedding ospitati di uso generale con ampio supporto dell'ecosistema.</td></tr>
<tr><td>Embedding di Voyage AI</td><td>Recupero orientato al codice, soprattutto quando la qualità della ricerca è importante.</td></tr>
<tr><td>Ollama</td><td>Flussi di lavoro di incorporazione locale per ambienti sensibili alla privacy.</td></tr>
</tbody>
</table>
<p>Per i flussi di lavoro Milvus correlati, vedere la <a href="https://milvus.io/docs/embeddings.md">panoramica sull'incorporazione Milvus</a>, l'<a href="https://milvus.io/docs/embed-with-openai.md">integrazione dell'incorporazione OpenAI</a>, l'<a href="https://milvus.io/docs/embed-with-voyage.md">integrazione dell'incorporazione Voyage</a> e gli esempi di esecuzione di <a href="https://zilliz.com/blog/simplifying-legal-research-with-rag-milvus-ollama">Ollama con Milvus</a>.</p>
<h3 id="Why-is-the-core-library-written-in-TypeScript" class="common-anchor-header">Perché la libreria principale è scritta in TypeScript?</h3><p>Claude Context è scritto in TypeScript perché molte integrazioni di coding-agent, plugin di editor e host MCP sono già caratterizzati da TypeScript. Mantenere il nucleo di recupero in TypeScript rende più facile l'integrazione con gli strumenti del livello applicativo, pur esponendo un'API pulita.</p>
<p>Il modulo centrale astrae il database vettoriale e il fornitore di incorporazioni in un oggetto componibile <code translate="no">Context</code>:</p>
<pre><code translate="no" class="language-javascript"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Context</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/claude-context-core&#x27;</span>;
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
<h2 id="How-Claude-Context-chunks-code-and-keeps-indexes-fresh" class="common-anchor-header">Come Claude Context suddivide il codice e mantiene gli indici freschi<button data-href="#How-Claude-Context-chunks-code-and-keeps-indexes-fresh" class="anchor-icon" translate="no">
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
    </button></h2><p>Il chunking e gli aggiornamenti incrementali determinano se un sistema di reperimento del codice è utilizzabile nella pratica. Se i pezzi sono troppo piccoli, il modello perde il contesto. Se i pezzi sono troppo grandi, il sistema di recupero restituisce rumore. Se l'indicizzazione è troppo lenta, gli sviluppatori smettono di usarla.</p>
<p>Claude Context gestisce questo problema con una suddivisione del codice basata su AST, una suddivisione del testo di ripiego e un rilevamento delle modifiche basato sull'albero di Merkle.</p>
<h3 id="How-does-AST-based-code-chunking-preserve-context" class="common-anchor-header">In che modo il chunking del codice basato su AST preserva il contesto?</h3><p>Il chunking AST è la strategia principale. Invece di suddividere i file in base al numero di righe o di caratteri, Claude Context analizza la struttura del codice e lo suddivide in unità semantiche come funzioni, classi e metodi.</p>
<p>Ciò conferisce a ciascun chunk tre utili proprietà:</p>
<table>
<thead>
<tr><th>Proprietà</th><th>Perché è importante</th></tr>
</thead>
<tbody>
<tr><td>Completezza sintattica</td><td>Le funzioni e le classi non sono divise a metà.</td></tr>
<tr><td>Coerenza logica</td><td>La logica correlata rimane unita, quindi i pezzi recuperati sono più facili da usare per il modello.</td></tr>
<tr><td>Supporto multilingue</td><td>Diversi parser tree-sitter possono gestire JavaScript, Python, Java, Go e altri linguaggi.</td></tr>
</tbody>
</table>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_9_153144cc04.png" alt="AST-based code chunking preserving complete syntactic units and chunking results" class="doc-image" id="ast-based-code-chunking-preserving-complete-syntactic-units-and-chunking-results" />
   </span> <span class="img-wrapper"> <span>Chunking del codice basato su AST che preserva le unità sintattiche complete e i risultati del chunking.</span> </span></p>
<h3 id="What-happens-when-AST-parsing-fails" class="common-anchor-header">Cosa succede quando il parsing AST fallisce?</h3><p>Per i linguaggi o i file che il parsing AST non è in grado di gestire, Claude Context ricorre a LangChain <code translate="no">RecursiveCharacterTextSplitter</code>. È meno preciso del chunking AST, ma impedisce che l'indicizzazione fallisca su input non supportati.</p>
<pre><code translate="no" class="language-php"><span class="hljs-comment">// Use recursive character splitting to preserve code structure</span>
<span class="hljs-keyword">const</span> splitter = <span class="hljs-title class_">RecursiveCharacterTextSplitter</span>.<span class="hljs-title function_">fromLanguage</span>(language, {
    <span class="hljs-attr">chunkSize</span>: <span class="hljs-number">1000</span>,
    <span class="hljs-attr">chunkOverlap</span>: <span class="hljs-number">200</span>,
});
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-does-Claude-Context-avoid-re-indexing-the-whole-repository" class="common-anchor-header">Come fa Claude Context a evitare di reindicizzare l'intero repository?</h3><p>Reindicizzare un intero repository dopo ogni modifica è troppo costoso. Claude Context utilizza un albero di Merkle per individuare esattamente le modifiche apportate.</p>
<p>Un albero di Merkle assegna a ogni file un hash, ricava l'hash di ogni directory dai suoi figli e arrotola l'intero repository in un hash principale. Se l'hash della radice è invariato, Claude Context può saltare l'indicizzazione. Se la radice è cambiata, si scende lungo l'albero per trovare i file modificati e si inseriscono nuovamente solo quelli.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_10_73daa3ca83.png" alt="Merkle tree change detection comparing unchanged and changed file hashes" class="doc-image" id="merkle-tree-change-detection-comparing-unchanged-and-changed-file-hashes" />
   </span> <span class="img-wrapper"> <span>Rilevamento delle modifiche dell'albero di Merkle che confronta gli hash dei file invariati e modificati</span> </span></p>
<p>La sincronizzazione viene eseguita in tre fasi:</p>
<table>
<thead>
<tr><th>Fase</th><th>Cosa succede</th><th>Perché è efficiente</th></tr>
</thead>
<tbody>
<tr><td>Controllo rapido</td><td>Confronta la radice Merkle corrente con l'ultima istantanea.</td><td>Se non è cambiato nulla, il controllo termina rapidamente.</td></tr>
<tr><td>Diff precisa</td><td>Percorre l'albero per identificare i file aggiunti, cancellati e modificati.</td><td>Solo i percorsi modificati avanzano.</td></tr>
<tr><td>Aggiornamento incrementale</td><td>Ricalcola gli embeddings per i file modificati e aggiorna Milvus.</td><td>L'indice vettoriale rimane fresco senza una ricostruzione completa.</td></tr>
</tbody>
</table>
<p>Lo stato di sincronizzazione locale è memorizzato in <code translate="no">~/.context/merkle/</code>, così Claude Context può ripristinare la tabella hash dei file e l'albero di Merkle serializzato dopo un riavvio.</p>
<h2 id="What-happens-when-Claude-Code-uses-Claude-Context" class="common-anchor-header">Cosa succede quando Claude Code utilizza Claude Context?<button data-href="#What-happens-when-Claude-Code-uses-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Il setup è un singolo comando prima di lanciare Claude Code:</p>
<pre><code translate="no" class="language-nginx">claude mcp add claude-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>Dopo aver indicizzato il repository, Claude Code può chiamare Claude Context quando ha bisogno del contesto della codebase. Nello stesso scenario di ricerca di bug che in precedenza aveva fatto perdere tempo con grep e lettura di file, Claude Context ha trovato il file esatto e il numero di riga con una spiegazione completa.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/article_12_9ad25bd75b.gif" alt="Claude Context demo showing Claude Code finding the relevant bug location" class="doc-image" id="claude-context-demo-showing-claude-code-finding-the-relevant-bug-location" />
   </span> <span class="img-wrapper"> <span>Dimostrazione di Claude Context che mostra Claude Code che trova la posizione del bug rilevante</span> </span></p>
<p>Lo strumento non si limita alla ricerca di bug. È utile anche per il refactoring, il rilevamento di codice duplicato, la risoluzione di problemi, la generazione di test e qualsiasi attività in cui l'agente ha bisogno di un contesto accurato del repository.</p>
<p>A parità di richiamo, Claude Context ha ridotto il consumo di token del 39,4% e le chiamate agli strumenti del 36,1% nel nostro benchmark. Questo è importante perché le chiamate agli strumenti e la lettura di file irrilevanti spesso dominano il costo dei flussi di lavoro degli agenti di codifica.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_3_e20064021b.png" alt="Benchmark chart showing Claude Context reducing token usage and tool calls versus baseline" class="doc-image" id="benchmark-chart-showing-claude-context-reducing-token-usage-and-tool-calls-versus-baseline" />
   </span> <span class="img-wrapper"> <span>Grafico di benchmark che mostra la riduzione dell'utilizzo dei token e delle chiamate agli strumenti da parte di Claude Context rispetto alla linea di riferimento</span> </span></p>
<p>Il progetto ha ora più di 10.000 stelle su GitHub e il repository include i dettagli completi del benchmark e i link ai pacchetti.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_7_210af604bd.png" alt="Claude Context GitHub star history showing rapid growth" class="doc-image" id="claude-context-github-star-history-showing-rapid-growth" />
   </span> <span class="img-wrapper"> <span>La cronologia delle stelle di GitHub di Claude Context mostra una rapida crescita</span> </span>.</p>
<h2 id="How-does-Claude-Context-compare-with-grep-on-real-bugs" class="common-anchor-header">Come si confronta Claude Context con grep su bug reali?<button data-href="#How-does-Claude-Context-compare-with-grep-on-real-bugs" class="anchor-icon" translate="no">
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
    </button></h2><p>Il benchmark confronta la ricerca di testo pura con il recupero del codice supportato da Milvus su attività di debug reali. La differenza non è solo il minor numero di token. Claude Context cambia il percorso di ricerca dell'agente: inizia più vicino all'implementazione da modificare.</p>
<table>
<thead>
<tr><th>Caso</th><th>Comportamento di base</th><th>Comportamento di Claude Context</th><th>Riduzione dei token</th></tr>
</thead>
<tbody>
<tr><td>Django <code translate="no">YearLookup</code> bug</td><td>Cercato il simbolo correlato sbagliato e modificata la logica di registrazione.</td><td>Trovata direttamente la logica di ottimizzazione di <code translate="no">YearLookup</code>.</td><td>93% di token in meno</td></tr>
<tr><td>Xarray <code translate="no">swap_dims()</code> bug</td><td>Lettura di file sparsi intorno alle menzioni di <code translate="no">swap_dims</code>.</td><td>Trovata l'implementazione e i test correlati in modo più diretto.</td><td>62% di token in meno</td></tr>
</tbody>
</table>
<h3 id="Case-1-Django-YearLookup-bug" class="common-anchor-header">Caso 1: bug di Django YearLookup</h3><p><strong>Descrizione del problema:</strong> Nel framework Django, l'ottimizzazione della query <code translate="no">YearLookup</code> rompe il filtro <code translate="no">__iso_year</code>. Quando si usa il filtro <code translate="no">__iso_year</code>, la classe <code translate="no">YearLookup</code> applica erroneamente l'ottimizzazione standard BETWEEN, valida per gli anni solari, ma non per gli anni con numerazione settimanale ISO.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># This should use EXTRACT(&#x27;isoyear&#x27; FROM ...) but incorrectly uses BETWEEN</span>
DTModel.objects.<span class="hljs-built_in">filter</span>(start_date__iso_year=<span class="hljs-number">2020</span>)

<span class="hljs-comment"># Generated: WHERE &quot;start_date&quot; BETWEEN 2020-01-01 AND 2020-12-31</span>
<span class="hljs-comment"># Should be: WHERE EXTRACT(&#x27;isoyear&#x27; FROM &quot;start_date&quot;) = 2020</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Linea di base (grep):</strong></p>
<pre><code translate="no" class="language-swift">🔧 <span class="hljs-title function_">directory_tree</span>()
⚙️ <span class="hljs-title class_">Result</span>: <span class="hljs-title class_">Retrieved</span> <span class="hljs-number">3000</span>+ lines <span class="hljs-keyword">of</span> directory <span class="hljs-title function_">structure</span> (~50k tokens)
   <span class="hljs-title class_">Problem</span>: <span class="hljs-title class_">Massive</span> information overload, no direct relevance
🔧 <span class="hljs-title function_">search_text</span>(<span class="hljs-string">&#x27;ExtractIsoYear&#x27;</span>)
⚙️ <span class="hljs-title class_">Result</span>: <span class="hljs-title class_">Found</span> <span class="hljs-number">21</span> matches across multiple <span class="hljs-attr">files</span>:
   - django/db/models/functions/__init__.<span class="hljs-property">py</span>:<span class="hljs-number">5</span> (<span class="hljs-keyword">import</span> statement)
   - django/db/models/functions/__init__.<span class="hljs-property">py</span>:<span class="hljs-number">31</span> (<span class="hljs-keyword">export</span> list)  
   - django/db/models/functions/datetime.<span class="hljs-property">py</span>:<span class="hljs-number">93</span> (<span class="hljs-title class_">ExtractIsoYear</span> <span class="hljs-keyword">class</span>)
   <span class="hljs-title class_">Problem</span>: <span class="hljs-title class_">Most</span> are unrelated imports and registrations
🔧 <span class="hljs-title function_">edit_file</span>(<span class="hljs-string">&#x27;django/db/models/functions/datetime.py&#x27;</span>)
⚙️ <span class="hljs-title class_">Modified</span> multiple registration statements, but <span class="hljs-variable language_">this</span> is the wrong direction <span class="hljs-keyword">for</span> a fix
<button class="copy-code-btn"></button></code></pre>
<p>La ricerca del testo si concentrava sulla registrazione di <code translate="no">ExtractIsoYear</code> invece che sulla logica di ottimizzazione di <code translate="no">YearLookup</code>.</p>
<p><strong>Contesto Claude:</strong></p>
<pre><code translate="no" class="language-bash">🔧 search_code(<span class="hljs-string">&#x27;YearLookup&#x27;</span>)
⚙️ Found <span class="hljs-number">10</span> results <span class="hljs-keyword">for</span> query: <span class="hljs-string">&quot;YearLookup&quot;</span> across the codebase
   <span class="hljs-number">1.</span> Code <span class="hljs-title function_">snippet</span> <span class="hljs-params">(python)</span> [repo__django__django]
      Location: django/db/models/lookups.py:<span class="hljs-number">568</span>-<span class="hljs-number">577</span>
      Context: YearExact <span class="hljs-keyword">class</span> <span class="hljs-title class_">and</span> get_bound_params method
   <span class="hljs-number">2.</span> Code <span class="hljs-title function_">snippet</span> <span class="hljs-params">(python)</span> [repo__django__django]  
      Location: django/db/models/lookups.py:<span class="hljs-number">538</span>-<span class="hljs-number">569</span>
      Context: YearLookup base <span class="hljs-keyword">class</span> <span class="hljs-title class_">and</span> year_lookup_bounds method
🔧 edit_file(django/db/models/lookups.py)
⚙️ Successfully modified the core optimization logic, adding ISO year handling
<button class="copy-code-btn"></button></code></pre>
<p>La ricerca semantica ha compreso <code translate="no">YearLookup</code> come concetto centrale ed è andata direttamente alla classe giusta.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_2_159ccffec9.png" alt="Django YearLookup benchmark table showing 93 percent fewer tokens with Claude Context" class="doc-image" id="django-yearlookup-benchmark-table-showing-93-percent-fewer-tokens-with-claude-context" />
   </span> <span class="img-wrapper"> <span>Tabella di benchmark di Django YearLookup che mostra il 93% di token in meno con Claude Context</span> </span></p>
<p><strong>Risultato:</strong> 93% di tokens in meno.</p>
<h3 id="Case-2-Xarray-swapdims-bug" class="common-anchor-header">Caso 2: bug di Xarray swap_dims</h3><p><strong>Descrizione del problema:</strong> Il metodo <code translate="no">.swap_dims()</code> della libreria Xarray muta inaspettatamente l'oggetto originale, violando l'aspettativa di immutabilità.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> xarray <span class="hljs-keyword">as</span> xr
nz = <span class="hljs-number">11</span>
ds = xr.Dataset({
    <span class="hljs-string">&quot;y&quot;</span>: (<span class="hljs-string">&quot;z&quot;</span>, np.random.rand(nz)),
    <span class="hljs-string">&quot;lev&quot;</span>: (<span class="hljs-string">&quot;z&quot;</span>, np.arange(nz) * <span class="hljs-number">10</span>),
})

<span class="hljs-comment"># This shouldn&#x27;t modify ds, but it does</span>
ds2 = ds.swap_dims(z=<span class="hljs-string">&quot;lev&quot;</span>).rename_dims(lev=<span class="hljs-string">&quot;z&quot;</span>).reset_index(<span class="hljs-string">&quot;lev&quot;</span>).reset_coords()
ds2.swap_dims(z=<span class="hljs-string">&#x27;lev&#x27;</span>)  <span class="hljs-comment"># this unexpectedly modifies ds2[&#x27;lev&#x27;]</span>
<span class="hljs-comment"># ds2[&#x27;lev&#x27;] now has dimension &#x27;lev&#x27; instead of &#x27;z&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Linea di base (grep):</strong></p>
<pre><code translate="no" class="language-bash">🔧 list_directory(<span class="hljs-string">&#x27;repo__pydata__xarray&#x27;</span>)
⚙️ Result: Retrieved directory structure across multiple subdirectories
   Problem: Basic directory navigation, no targeted search
🔧 search_text(<span class="hljs-string">&#x27;swap_dims&#x27;</span>)
⚙️ Result: Found 21 matches across core files:
   - xarray/core/common.py:600 (Dataset.swap_dims reference)
   - xarray/core/dataarray.py:753 (<span class="hljs-string">&quot;.rename() or .swap_dims() instead.&quot;</span>)
   - xarray/core/dataarray.py:2026 (DataArray.swap_dims reference)
   - xarray/core/dataarray.py:2044 (def swap_dims method)
   Problem: Many matches scattered across different contexts
🔧 read_file(<span class="hljs-string">&#x27;xarray/core/dataarray.py&#x27;</span>, offset=2000, <span class="hljs-built_in">limit</span>=40)
⚙️ Result: Read lines 2001-2040 showing rename method documentation

🔧 read_file(<span class="hljs-string">&#x27;xarray/core/dataset.py&#x27;</span>, offset=3600, <span class="hljs-built_in">limit</span>=40) 
⚙️ Result: Read lines 3601-3640 showing rename_dims method
<button class="copy-code-btn"></button></code></pre>
<p>La linea di base ha trascorso del tempo navigando nelle directory e leggendo il codice vicino prima di individuare il percorso di implementazione effettivo.</p>
<p><strong>Claude Context:</strong></p>
<pre><code translate="no" class="language-bash">🔧 search_code(<span class="hljs-string">&#x27;.swap_dims()&#x27;</span>)
⚙️ Found <span class="hljs-number">10</span> results <span class="hljs-keyword">for</span> query: <span class="hljs-string">&quot;.swap_dims()&quot;</span> across the codebase
   <span class="hljs-number">1.</span> <span class="hljs-function">Code <span class="hljs-title">snippet</span> (<span class="hljs-params">python</span>) [repo__pydata__xarray]
      Location: xarray/tests/test_formatting_html.py:67-76
   2. Code <span class="hljs-title">snippet</span> (<span class="hljs-params">python</span>) [repo__pydata__xarray]
      Location: xarray/tests/test_dataset.py:2926-2979
🔧 <span class="hljs-title">edit_file</span>(<span class="hljs-params"><span class="hljs-string">&#x27;xarray/core/dataset.py&#x27;</span></span>)
⚙️ Successfully modified the <span class="hljs-keyword">file</span>, added dimension handling logic
🔧 <span class="hljs-title">edit_file</span>(<span class="hljs-params"><span class="hljs-string">&#x27;xarray/core/dataarray.py&#x27;</span></span>)
⚙️ Successfully modified the <span class="hljs-keyword">file</span>, ensuring the original DataArray <span class="hljs-keyword">is</span> <span class="hljs-keyword">not</span> mutated
</span><button class="copy-code-btn"></button></code></pre>
<p>La ricerca semantica ha individuato più rapidamente l'implementazione di <code translate="no">swap_dims()</code> e il relativo contesto.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/claude_context_reduce_claude_code_token_usage_1_d75e931f20.png" alt="Xarray swap_dims benchmark table showing 62 percent fewer tokens with Claude Context" class="doc-image" id="xarray-swap_dims-benchmark-table-showing-62-percent-fewer-tokens-with-claude-context" />
   </span> <span class="img-wrapper"> <span>Tabella di benchmark Xarray swap_dims che mostra il 62% di token in meno con Claude Context</span> </span></p>
<p><strong>Risultato:</strong> 62% di token in meno.</p>
<h2 id="Get-started-with-Claude-Context" class="common-anchor-header">Iniziare con Claude Context<button data-href="#Get-started-with-Claude-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>Se volete provare lo strumento di questo post, iniziate dal <a href="https://github.com/zilliztech/claude-context">repository GitHub di Claude Context</a> e dal <a href="https://www.npmjs.com/package/%40zilliz/claude-context-mcp">pacchetto MCP Claude Context</a>. Il repository include istruzioni di configurazione, benchmark e i pacchetti TypeScript di base.</p>
<p>Se si desidera comprendere o personalizzare il livello di recupero, queste risorse sono utili come passi successivi:</p>
<ul>
<li>Imparare le basi del database vettoriale con <a href="https://milvus.io/docs/quickstart.md">Milvus Quickstart</a>.</li>
<li>Esplorare la <a href="https://milvus.io/docs/full-text-search.md">ricerca full text di Milvus</a> e il <a href="https://milvus.io/docs/full_text_search_with_milvus.md">tutorial sulla ricerca full text di LangChain</a>, se si vuole combinare la ricerca in stile BM25 con vettori densi.</li>
<li>Esaminate i <a href="https://zilliz.com/blog/top-5-open-source-vector-search-engines">motori di ricerca vettoriale open-source</a> se state confrontando le opzioni di infrastruttura.</li>
<li>Provate il <a href="https://zilliz.com/blog/zilliz-cloud-just-landed-in-claude-code">Plugin Zilliz Cloud per Claude Code</a> se volete operazioni di database vettoriale direttamente all'interno del flusso di lavoro di Claude Code.</li>
</ul>
<p>Per assistenza su Milvus o sull'architettura di reperimento del codice, unitevi alla <a href="https://milvus.io/community/">comunità Milvus</a> o prenotate le <a href="https://milvus.io/office-hours">ore di ufficio Milvus</a> per una guida individuale. Se preferite evitare la configurazione dell'infrastruttura, iscrivetevi <a href="https://cloud.zilliz.com/signup">a Zilliz Cloud</a> o <a href="https://cloud.zilliz.com/login">accedete a Zilliz Cloud</a> e utilizzate Milvus gestito come backend.</p>
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
    </button></h2><h3 id="Why-does-Claude-Code-use-so-many-tokens-on-some-coding-tasks" class="common-anchor-header">Perché Claude Code utilizza molti token in alcune attività di codifica?</h3><p>Claude Code può utilizzare molti token quando un'attività richiede cicli ripetuti di ricerca e lettura di file in un repository di grandi dimensioni. Se l'agente esegue una ricerca per parola chiave, legge file irrilevanti e poi esegue una nuova ricerca, ogni file letto aggiunge token anche quando il codice non è utile per l'attività.</p>
<h3 id="How-does-Claude-Context-reduce-Claude-Code-token-usage" class="common-anchor-header">In che modo Claude Context riduce l'utilizzo dei token di Claude Code?</h3><p>Claude Context riduce l'uso dei token cercando in un indice di codice supportato da Milvus prima che l'agente legga i file. Recupera i pezzi di codice rilevanti con una ricerca ibrida, in modo che Claude Code possa ispezionare un numero minore di file e dedicare una parte maggiore della sua finestra di contesto al codice effettivamente importante.</p>
<h3 id="Is-Claude-Context-only-for-Claude-Code" class="common-anchor-header">Claude Context è solo per Claude Code?</h3><p>No. Claude Context è esposto come server MCP, quindi può funzionare con qualsiasi strumento di codifica che supporti MCP. Claude Code è l'esempio principale di questo post, ma lo stesso livello di recupero può supportare altri IDE e flussi di lavoro di agenti compatibili con MCP.</p>
<h3 id="Do-I-need-Zilliz-Cloud-to-use-Claude-Context" class="common-anchor-header">È necessario Zilliz Cloud per utilizzare Claude Context?</h3><p>Claude Context può utilizzare Zilliz Cloud come backend gestito di Milvus, che è il percorso più semplice se non si vuole gestire un'infrastruttura di database vettoriale. La stessa architettura di reperimento si basa sui concetti di Milvus, quindi i team possono adattarla anche alle implementazioni Milvus autogestite.</p>
