---
id: we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md
title: >-
  Abbiamo estratto il sistema di memoria di OpenClaw e lo abbiamo reso open
  source (memsearch)
author: Cheney Zhang
date: 2026-02-13T00:00:00.000Z
cover: assets.zilliz.com/memsearch_openclaw_memory_11zon_b2a6b4cbb9.jpg
tag: Engineering
recommend: true
publishToMedium: true
tags: 'OpenClaw, AI agent memory, vector search, Milvus'
meta_keywords: >-
  OpenClaw, AI agent memory, persistent memory, Python, vector search, Milvus,
  memsearch
meta_title: |
  We Extracted OpenClaw’s Memory System and Open-Sourced It (memsearch)
desc: >-
  Abbiamo estratto l'architettura di memoria AI di OpenClaw in memsearch, una
  libreria Python indipendente con registri Markdown, ricerca vettoriale ibrida
  e supporto Git.
origin: >-
  https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md
---
<p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a> (precedentemente clawdbot e moltbot) sta diventando virale: <a href="https://github.com/openclaw/openclaw">più di 189k stelle su GitHub</a> in meno di due settimane. È una cosa pazzesca. La maggior parte del clamore riguarda le sue capacità autonome e agenziali nei canali di chat di tutti i giorni, tra cui iMessage, WhatsApp, Slack, Telegram e altri ancora.</p>
<p>Ma come ingegneri che lavorano a un sistema di database vettoriale, ciò che ha davvero attirato la nostra attenzione è stato l'<strong>approccio di OpenClaw alla memoria a lungo termine</strong>. A differenza della maggior parte dei sistemi di memoria in circolazione, OpenClaw fa sì che la sua IA scriva automaticamente i log giornalieri come file Markdown. Questi file sono la fonte della verità e il modello "ricorda" solo ciò che viene scritto su disco. Gli sviluppatori umani possono aprire questi file Markdown, modificarli direttamente, distillare i principi a lungo termine e vedere esattamente ciò che l'IA ricorda in qualsiasi momento. Nessuna scatola nera. Onestamente, è una delle architetture di memoria più pulite e più facili da sviluppare che abbiamo visto.</p>
<p>Quindi, naturalmente, ci siamo posti una domanda: <strong><em>perché questo dovrebbe funzionare solo all'interno di OpenClaw? E se qualsiasi agente potesse avere una memoria di questo tipo?</em></strong> Abbiamo preso l'esatta architettura di memoria di OpenClaw e abbiamo costruito <a href="https://github.com/zilliztech/memsearch">memsearch</a>, una libreria di memoria a lungo termine indipendente e plug-and-play che fornisce a qualsiasi agente una memoria persistente, trasparente e modificabile dall'uomo. Non dipende dal resto di OpenClaw. Basta inserirla e l'agente ottiene una memoria durevole con una ricerca alimentata da Milvus/Zilliz Cloud, oltre ai log Markdown come fonte canonica di verità.</p>
<iframe width="997" height="561" src="https://www.youtube.com/embed/VRzqRVFm39s" title="MemSearch: OpenClaw's long-term memory" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<ul>
<li><p><strong>GitHub Repo:</strong> <a href="https://github.com/zilliztech/memsearch">github.com/zilliztech/memsearch</a> (open-source, licenza MIT)</p></li>
<li><p><strong>Documentazione:</strong> <a href="https://zilliztech.github.io/memsearch/">https://zilliztech.github.io/memsearch/</a></p></li>
<li><p><strong>Plugin per il codice Claude:</strong> <a href="https://zilliztech.github.io/memsearch/claude-plugin/">https://zilliztech.github.io/memsearch/claude-plugin/</a></p></li>
</ul>
<h2 id="What-Makes-OpenClaws-Memory-Different" class="common-anchor-header">Cosa rende diversa la memoria di OpenClaw<button data-href="#What-Makes-OpenClaws-Memory-Different" class="anchor-icon" translate="no">
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
    </button></h2><p>Prima di immergerci nell'architettura della memoria di OpenClaw, chiariamo due concetti: <strong>contesto</strong> e <strong>memoria</strong>. Sembrano simili, ma in pratica funzionano in modo molto diverso.</p>
<ul>
<li><p>Il<strong>contesto</strong> è tutto ciò che l'agente vede in una singola richiesta: prompt di sistema, file di guida a livello di progetto come <code translate="no">AGENTS.md</code> e <code translate="no">SOUL.md</code>, cronologia delle conversazioni (messaggi, chiamate agli strumenti, sommari compressi) e il messaggio corrente dell'utente. È limitato a una sessione e relativamente compatto.</p></li>
<li><p>La<strong>memoria</strong> è ciò che persiste tra le sessioni. Si trova sul disco locale: la storia completa delle conversazioni passate, i file con cui l'agente ha lavorato e le preferenze dell'utente. Non è riassunto. Non compresso. Il materiale grezzo.</p></li>
</ul>
<p>Ecco la decisione progettuale che rende speciale l'approccio di OpenClaw: <strong>tutta la memoria è memorizzata come semplici file Markdown sul filesystem locale.</strong> Dopo ogni sessione, l'intelligenza artificiale scrive automaticamente gli aggiornamenti di questi file Markdown. L'utente e qualsiasi sviluppatore può aprirli, modificarli, riorganizzarli, cancellarli o perfezionarli. Nel frattempo, il database vettoriale si affianca a questo sistema, creando e mantenendo un indice per il recupero. Ogni volta che un file Markdown cambia, il sistema lo rileva e lo reindicizza automaticamente.</p>
<p>Se avete usato strumenti come Mem0 o Zep, noterete subito la differenza. Quei sistemi memorizzano le memorie come embeddings: questa è l'unica copia. Non è possibile leggere ciò che l'agente ricorda. Non è possibile correggere un ricordo errato modificando una riga. L'approccio di OpenClaw offre entrambe le cose: la trasparenza dei file semplici <strong>e la</strong> potenza di ricerca di un database vettoriale. Si può leggere, <code translate="no">git diff</code>, grep: sono solo file.</p>
<p>L'unico aspetto negativo? Al momento questo sistema di memoria Markdown-first è strettamente intrecciato con l'intero ecosistema OpenClaw: il processo Gateway, i connettori della piattaforma, la configurazione dello spazio di lavoro e l'infrastruttura di messaggistica. Se si vuole solo il modello di memoria, si tratta di un sacco di macchinari da trascinare.</p>
<p>È proprio per questo che abbiamo creato <a href="http://github.com/zilliztech/memsearch"><strong>memsearch</strong></a>: la stessa filosofia - markdown come fonte di verità, indicizzazione vettoriale automatica, completamente modificabile dall'uomo - ma come libreria leggera e indipendente da inserire in qualsiasi architettura agenziale.</p>
<h2 id="How-Memsearch-Works" class="common-anchor-header">Come funziona Memsearch<button data-href="#How-Memsearch-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Come già accennato, <a href="https://github.com/zilliztech/memsearch">memsearch</a> è una libreria di memoria a lungo termine completamente indipendente che implementa la stessa architettura di memoria utilizzata in OpenClaw, senza portare con sé il resto dello stack di OpenClaw. È possibile inserirla in qualsiasi framework di agenti (Claude, GPT, Llama, agenti personalizzati, motori di flusso di lavoro) e fornire immediatamente al sistema una memoria persistente, trasparente e modificabile dall'uomo.</p>
<p>Tutta la memoria dell'agente in memsearch è memorizzata come Markdown in testo semplice in una directory locale. La struttura è volutamente semplice, in modo che gli sviluppatori possano comprenderla a colpo d'occhio:</p>
<pre><code translate="no">~/your-project/
└── memory/
    ├── MEMORY.md              <span class="hljs-comment"># Hand-written long-term memory</span>
    ├── 2026-02-09.md          <span class="hljs-comment"># Today&#x27;s work log</span>
    ├── 2026-02-08.md
    └── 2026-02-07.md
<button class="copy-code-btn"></button></code></pre>
<p>Memsearch utilizza <a href="https://milvus.io/"><strong>Milvus</strong></a> come database vettoriale per indicizzare questi file Markdown e ottenere un rapido recupero semantico. Ma è fondamentale che l'indice vettoriale <em>non sia</em> la fonte della verità: lo sono i file. Se si elimina completamente l'indice Milvus, <strong>non si perde nulla.</strong> Memsearch si limita a reinserire e reindicizzare i file Markdown, ricostruendo l'intero livello di recupero in pochi minuti. Ciò significa che la memoria dell'agente è trasparente, duratura e completamente ricostruibile.</p>
<p>Ecco le principali funzionalità di memsearch:</p>
<h3 id="Readable-Markdown-Makes-Debugging-as-Simple-as-Editing-a-File" class="common-anchor-header">Il Markdown leggibile rende il debug semplice come la modifica di un file</h3><p>Il debug della memoria dell'intelligenza artificiale è solitamente doloroso. Quando un agente produce una risposta sbagliata, la maggior parte dei sistemi di memoria non offre un modo chiaro per vedere <em>cosa</em> ha effettivamente memorizzato. Il flusso di lavoro tipico consiste nello scrivere codice personalizzato per interrogare un'API di memoria, per poi passare al setaccio embeddings opachi o blob JSON verbosi, nessuno dei quali ci dice molto sul reale stato interno dell'intelligenza artificiale.</p>
<p><strong>memsearch elimina questa classe di problemi.</strong> Tutta la memoria vive nella cartella memory/ come semplice Markdown:</p>
<pre><code translate="no" class="language-markdown"><span class="hljs-meta">## Morning</span>
- Fixed N+<span class="hljs-number">1</span> query issue — <span class="hljs-function">switched to <span class="hljs-title">selectinload</span>()
- Query count dropped <span class="hljs-keyword">from</span> 152 to 3
</span><button class="copy-code-btn"></button></code></pre>
<p>Se l'intelligenza artificiale sbaglia qualcosa, è sufficiente modificare il file per risolvere il problema. Si aggiorna la voce, si salva e memsearch reindicizza automaticamente la modifica. Cinque secondi. Nessuna chiamata API. Nessun tool. Nessun mistero. Si esegue il debug della memoria AI nello stesso modo in cui si esegue il debug della documentazione: modificando un file.</p>
<h3 id="Git-Backed-Memory-Means-Teams-Can-Track-Review-and-Roll-Back-Changes" class="common-anchor-header">La memoria supportata da Git consente ai team di monitorare, rivedere e ripristinare le modifiche</h3><p>La memoria AI che vive in un database è difficile da gestire. Capire chi ha cambiato cosa e quando significa scavare nei registri di controllo, e molte soluzioni non forniscono nemmeno quelli. Le modifiche avvengono in silenzio e i disaccordi su ciò che l'intelligenza artificiale deve ricordare non hanno un percorso di risoluzione chiaro. I team finiscono per affidarsi ai messaggi di Slack e alle supposizioni.</p>
<p>Memsearch risolve questo problema rendendo la memoria solo file Markdown, il che significa che <strong>Git gestisce automaticamente il versioning</strong>. Un singolo comando mostra l'intera cronologia:</p>
<pre><code translate="no" class="language-bash">git <span class="hljs-built_in">log</span> memory/MEMORY.md
git diff HEAD~1 memory/2026-02-09.md
<button class="copy-code-btn"></button></code></pre>
<p>Ora la memoria AI partecipa allo stesso flusso di lavoro del codice. Le decisioni sull'architettura, gli aggiornamenti della configurazione e le modifiche alle preferenze appaiono tutte in diff che chiunque può commentare, approvare o ripristinare:</p>
<pre><code translate="no" class="language-diff">+ <span class="hljs-meta">## Architecture Decision</span>
+ - Use Kafka <span class="hljs-keyword">for</span> <span class="hljs-keyword">event</span> bus instead of RabbitMQ
+ - Reason: better horizontal scaling
<button class="copy-code-btn"></button></code></pre>
<h3 id="Plaintext-Memory-Makes-Migration-Nearly-Effortless" class="common-anchor-header">La memoria Plaintext rende la migrazione quasi senza problemi</h3><p>La migrazione è uno dei maggiori costi nascosti dei framework di memoria. Passare da uno strumento all'altro significa di solito esportare i dati, convertire i formati, reimportarli e sperare che i campi siano compatibili. Questo tipo di lavoro può facilmente consumare mezza giornata e il risultato non è mai garantito.</p>
<p>memsearch evita completamente il problema perché la memoria è Markdown in chiaro. Non c'è un formato proprietario, non c'è uno schema da tradurre, non c'è nulla da migrare:</p>
<ul>
<li><p><strong>Cambiare macchina:</strong> <code translate="no">rsync</code> la cartella di memoria. Fatto.</p></li>
<li><p><strong>Cambiare modello di incorporamento:</strong> Eseguire nuovamente il comando index. Ci vorranno cinque minuti e i file markdown non verranno toccati.</p></li>
<li><p><strong>Cambiare la distribuzione del database vettoriale:</strong> Cambiare un valore di configurazione. Ad esempio, passando da Milvus Lite in fase di sviluppo a Zilliz Cloud in fase di produzione:</p></li>
</ul>
<pre><code translate="no" class="language-python"><span class="hljs-meta"># Development</span>
ms = MemSearch(milvus_uri=<span class="hljs-string">&quot;~/.memsearch/milvus.db&quot;</span>)

<span class="hljs-meta"># Production (change only this <span class="hljs-keyword">line</span>)</span>
ms = MemSearch(milvus_uri=<span class="hljs-string">&quot;https://xxx.zillizcloud.com&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>I file di memoria rimangono esattamente gli stessi. L'infrastruttura che li circonda può evolvere liberamente. Il risultato è una portabilità a lungo termine, una proprietà rara nei sistemi di intelligenza artificiale.</p>
<h3 id="Shared-Markdown-Files-Let-Humans-and-Agents-Co-Author-Memory" class="common-anchor-header">I file Markdown condivisi permettono a umani e agenti di essere coautori della memoria</h3><p>Nella maggior parte delle soluzioni di memoria, la modifica di ciò che l'intelligenza artificiale ricorda richiede la scrittura di codice per un'API. Ciò significa che solo gli sviluppatori possono gestire la memoria dell'IA, e anche per loro è complicato.</p>
<p>Memsearch consente una divisione più naturale delle responsabilità:</p>
<ul>
<li><p><strong>L'intelligenza artificiale gestisce:</strong> Registri giornalieri automatici (<code translate="no">YYYY-MM-DD.md</code>) con dettagli di esecuzione come "distribuito v2.3.1, miglioramento delle prestazioni del 12%".</p></li>
<li><p><strong>Gli esseri umani gestiscono:</strong> Principi a lungo termine in <code translate="no">MEMORY.md</code>, come "Team stack: Python + FastAPI + PostgreSQL".</p></li>
</ul>
<p>Entrambe le parti modificano gli stessi file Markdown con gli strumenti che già utilizzano. Nessuna chiamata API, nessuno strumento speciale, nessun gatekeeper. Quando la memoria è bloccata all'interno di un database, questo tipo di autorialità condivisa non è possibile. memsearch la rende predefinita.</p>
<h2 id="Under-the-Hood-memsearch-Runs-on-Four-Workflows-That-Keep-Memory-Fast-Fresh-and-Lean" class="common-anchor-header">Sotto il cofano: memsearch funziona con quattro flussi di lavoro che mantengono la memoria veloce, fresca e snella<button data-href="#Under-the-Hood-memsearch-Runs-on-Four-Workflows-That-Keep-Memory-Fast-Fresh-and-Lean" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/ms1_c855cb19a5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>memsearch ha quattro flussi di lavoro fondamentali: <strong>Watch</strong> (monitorare) → <strong>Index</strong> (raggruppare e incorporare) → <strong>Search</strong> (recuperare) → <strong>Compact</strong> (riassumere). Ecco cosa fa ciascuno di essi.</p>
<h3 id="1-Watch-Automatically-Re-Index-on-Every-File-Save" class="common-anchor-header">1. Guarda: Reindicizzazione automatica a ogni salvataggio di file</h3><p>Il flusso di lavoro <strong>Watch</strong> monitora tutti i file Markdown nella memoria/directory e attiva una reindicizzazione ogni volta che un file viene modificato e salvato. Un <strong>debounce di 1500 ms</strong> assicura che gli aggiornamenti vengano rilevati senza sprechi di calcolo: se si verificano più salvataggi in rapida successione, il timer si resetta e scatta solo quando le modifiche si sono stabilizzate.</p>
<p>Questo ritardo è regolato empiricamente:</p>
<ul>
<li><p><strong>100 ms</strong> → troppo sensibile; scatta a ogni pressione dei tasti, bruciando le chiamate di incorporamento</p></li>
<li><p><strong>10s</strong> → troppo lento; gli sviluppatori notano un ritardo</p></li>
<li><p><strong>1500ms</strong> → equilibrio ideale tra reattività ed efficienza delle risorse</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ms2_92fdb7f1f8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>In pratica, questo significa che uno sviluppatore può scrivere codice in una finestra e modificare <code translate="no">MEMORY.md</code> in un'altra, aggiungendo un URL di documentazione API o correggendo una voce obsoleta. Salvando il file, la successiva interrogazione dell'intelligenza artificiale recupera la nuova memoria. Nessun riavvio, nessuna reindicizzazione manuale.</p>
<h3 id="2-Index-Smart-Chunking-Deduplication-and-Version-Aware-Embeddings" class="common-anchor-header">2. Indice: Chunking intelligente, deduplicazione e incorporazioni consapevoli delle versioni</h3><p>Index è il flusso di lavoro critico per le prestazioni. Gestisce tre aspetti: <strong>chunking, deduplicazione e ID chunk versionati.</strong></p>
<p><strong>Il chunking</strong> divide il testo lungo i confini semantici (titoli e corpo), in modo che i contenuti correlati rimangano insieme. In questo modo si evitano i casi in cui una frase come "configurazione di Redis" viene divisa tra i vari chunk.</p>
<p>Per esempio, questo Markdown:</p>
<pre><code translate="no" class="language-markdown"><span class="hljs-comment">## Redis Caching</span>
We use Redis <span class="hljs-keyword">for</span> L1 cache <span class="hljs-keyword">with</span> 5<span class="hljs-built_in">min</span> TTL.
The connection pool <span class="hljs-keyword">is</span> configured <span class="hljs-keyword">with</span> <span class="hljs-built_in">max</span> <span class="hljs-number">100</span> connections.

<span class="hljs-comment">## Database</span>
PostgreSQL <span class="hljs-number">16</span> <span class="hljs-keyword">is</span> the primary database.
<button class="copy-code-btn"></button></code></pre>
<p>Diventa due pezzi:</p>
<ul>
<li><p>Pezzo 1: <code translate="no">## Redis Caching\nWe use Redis for L1 cache...</code></p></li>
<li><p>Chunk 2: <code translate="no">## Database\nPostgreSQL 16 is the primary database.</code></p></li>
</ul>
<p>La<strong>deduplicazione</strong> utilizza un hash SHA-256 di ogni chunk per evitare di incorporare lo stesso testo due volte. Se più file menzionano "PostgreSQL 16", l'API di incorporamento viene chiamata una volta sola, non una volta per ogni file. Per ~500KB di testo, si risparmia circa <strong> 0,15$/mese.</strong> In scala, questo si aggiunge a centinaia di dollari.</p>
<p><strong>Il design dell'ID del chunk</strong> codifica tutto ciò che serve per sapere se un chunk è stantio. Il formato è <code translate="no">hash(source_path:start_line:end_line:content_hash:model_version)</code>. Il campo <code translate="no">model_version</code> è la parte importante: quando un modello di incorporamento viene aggiornato da <code translate="no">text-embedding-3-small</code> a <code translate="no">text-embedding-3-large</code>, i vecchi incorporamenti diventano non validi. Poiché la versione del modello è incorporata nell'ID, il sistema identifica automaticamente quali chunk devono essere incorporati di nuovo. Non è necessaria alcuna pulizia manuale.</p>
<h3 id="3-Search-Hybrid-Vector-+-BM25-Retrieval-for-Maximum-Accuracy" class="common-anchor-header">3. Ricerca: Recupero ibrido di vettori + BM25 per la massima precisione</h3><p>Il recupero utilizza un approccio di ricerca ibrido: ricerca vettoriale ponderata al 70% e ricerca per parole chiave BM25 ponderata al 30%. In questo modo si bilanciano due esigenze diverse che si presentano spesso nella pratica.</p>
<ul>
<li><p>La<strong>ricerca vettoriale</strong> gestisce la corrispondenza semantica. Una query per "Redis cache config" restituisce un chunk contenente "Redis L1 cache with 5min TTL" anche se la formulazione è diversa. Questo è utile quando lo sviluppatore ricorda il concetto ma non la formulazione esatta.</p></li>
<li><p><strong>BM25</strong> gestisce la corrispondenza esatta. Una query per "PostgreSQL 16" non restituisce risultati per "PostgreSQL 15". Questo è importante per i codici di errore, i nomi delle funzioni e i comportamenti specifici della versione, dove la vicinanza non è sufficiente.</p></li>
</ul>
<p>La suddivisione predefinita 70/30 funziona bene per la maggior parte dei casi d'uso. Per i flussi di lavoro che puntano molto sulle corrispondenze esatte, l'aumento del peso di BM25 al 50% è una modifica di configurazione di una sola riga.</p>
<p>I risultati vengono restituiti come pezzi top-K (default 3), ciascuno troncato a 200 caratteri. Quando è necessario il contenuto completo, <code translate="no">memsearch expand &lt;chunk_hash&gt;</code> lo carica. Questa divulgazione progressiva mantiene l'uso della finestra contestuale di LLM snello senza sacrificare l'accesso ai dettagli.</p>
<h3 id="4-Compact-Summarize-Historical-Memory-to-Keep-Context-Clean" class="common-anchor-header">4. Compatto: Riassumere la memoria storica per mantenere pulito il contesto</h3><p>L'accumulo di memoria alla fine diventa un problema. Le vecchie voci riempiono la finestra del contesto, aumentano i costi dei token e aggiungono rumore che degrada la qualità delle risposte. Compact risolve questo problema chiamando un LLM per riassumere la memoria storica in una forma condensata, quindi eliminando o archiviando gli originali. Può essere attivato manualmente o programmato per essere eseguito a intervalli regolari.</p>
<h2 id="How-to-get-started-with-memsearch" class="common-anchor-header">Come iniziare con memsearch<button data-href="#How-to-get-started-with-memsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>Memsearch fornisce sia un'<strong>API Python</strong> che una <strong>CLI</strong>, in modo da poterlo utilizzare all'interno di framework di agenti o come strumento di debug autonomo. L'installazione è minima e il sistema è progettato in modo che l'ambiente di sviluppo locale e la distribuzione di produzione siano quasi identici.</p>
<p>Memsearch supporta tre backend compatibili con Milvus, tutti esposti attraverso la <strong>stessa API</strong>:</p>
<ul>
<li><p><a href="https://milvus.io/docs/milvus_lite.md"><strong>Milvus Lite (predefinito)</strong></a><strong>:</strong> File locale <code translate="no">.db</code>, nessuna configurazione, adatto all'uso individuale.</p></li>
<li><p><strong>Milvus Standalone / Cluster:</strong> Self-hosted, supporta più agenti che condividono i dati, adatto ad ambienti di gruppo.</p></li>
<li><p><a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a><strong>:</strong> Completamente gestito, con autoscaling, backup, alta disponibilità e isolamento. Ideale per i carichi di lavoro di produzione.</p></li>
</ul>
<p>Il passaggio dallo sviluppo locale alla produzione è in genere <strong>una modifica di configurazione di una sola riga</strong>. Il codice rimane lo stesso.</p>
<h3 id="Install" class="common-anchor-header">Installazione</h3><pre><code translate="no" class="language-bash">pip install memsearch
<button class="copy-code-btn"></button></code></pre>
<p>memsearch supporta anche diversi fornitori di incorporazioni, tra cui OpenAI, Google, Voyage, Ollama e modelli locali. In questo modo l'architettura della memoria rimane portatile e indipendente dai fornitori.</p>
<h3 id="Option-1-Python-API-integrated-into-your-agent-framework" class="common-anchor-header">Opzione 1: API Python (integrata nel framework dell'agente)</h3><p>Ecco un esempio minimo di un ciclo completo di agente che utilizza memsearch. È possibile fare copia/incolla e modificare secondo le necessità:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> memsearch <span class="hljs-keyword">import</span> MemSearch

llm = OpenAI()
ms = MemSearch(paths=[<span class="hljs-string">&quot;./memory/&quot;</span>])

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">agent_chat</span>(<span class="hljs-params">user_input: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-comment"># 1. Recall — search relevant memories</span>
    memories = <span class="hljs-keyword">await</span> ms.search(user_input, top_k=<span class="hljs-number">3</span>)
    context = <span class="hljs-string">&quot;\n&quot;</span>.join(<span class="hljs-string">f&quot;- <span class="hljs-subst">{m[<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">200</span>]}</span>&quot;</span> <span class="hljs-keyword">for</span> m <span class="hljs-keyword">in</span> memories)

    <span class="hljs-comment"># 2. Think — call LLM</span>
    resp = llm.chat.completions.create(
        model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>,
        messages=[
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">f&quot;Memories:\n<span class="hljs-subst">{context}</span>&quot;</span>},
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: user_input},
        ],
    )

    <span class="hljs-comment"># 3. Remember — write to markdown, update index</span>
    save_memory(<span class="hljs-string">f&quot;## <span class="hljs-subst">{user_input}</span>\n<span class="hljs-subst">{resp.choices[<span class="hljs-number">0</span>].message.content}</span>&quot;</span>)
    <span class="hljs-keyword">await</span> ms.index()
    <span class="hljs-keyword">return</span> resp.choices[<span class="hljs-number">0</span>].message.content
<button class="copy-code-btn"></button></code></pre>
<p>Questo mostra il ciclo principale:</p>
<ul>
<li><p><strong>Ricordiamo</strong> che memsearch esegue il recupero ibrido di vettori + BM25.</p></li>
<li><p><strong>Pensate</strong>: il vostro LLM elabora l'input dell'utente + la memoria recuperata</p></li>
<li><p><strong>Ricordate</strong>: l'agente scrive nuova memoria in Markdown e memsearch aggiorna il suo indice.</p></li>
</ul>
<p>Questo schema si adatta naturalmente a qualsiasi sistema di agenti: LangChain, AutoGPT, router semantici, LangGraph o cicli di agenti personalizzati. È un sistema indipendente dal framework.</p>
<h3 id="Option-2-CLI-quick-operations-good-for-debugging" class="common-anchor-header">Opzione 2: CLI (operazioni rapide, ottime per il debug)</h3><p>La CLI è ideale per i flussi di lavoro autonomi, i controlli rapidi o l'ispezione della memoria durante lo sviluppo:</p>
<pre><code translate="no" class="language-bash">memsearch index ./docs/              <span class="hljs-comment"># Index files</span>
memsearch search <span class="hljs-string">&quot;Redis caching&quot;</span>     <span class="hljs-comment"># Search</span>
memsearch watch ./docs/              <span class="hljs-comment"># Watch for file changes</span>
memsearch compact                    <span class="hljs-comment"># Compact old memory</span>
<button class="copy-code-btn"></button></code></pre>
<p>La CLI rispecchia le funzionalità dell'API Python, ma funziona senza scrivere alcun codice: è l'ideale per il debug, le ispezioni, le migrazioni o la convalida della struttura delle cartelle di memoria.</p>
<h2 id="How-memsearch-Compares-to-Other-Memory-Solutions" class="common-anchor-header">Come memsearch si confronta con altre soluzioni di memoria<button data-href="#How-memsearch-Compares-to-Other-Memory-Solutions" class="anchor-icon" translate="no">
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
    </button></h2><p>La domanda più frequente che gli sviluppatori si pongono è perché utilizzare memsearch quando esistono già opzioni consolidate. La risposta è breve: memsearch scambia funzionalità avanzate come i grafi di conoscenza temporali con trasparenza, portabilità e semplicità. Per la maggior parte dei casi di utilizzo della memoria degli agenti, questo è il giusto compromesso.</p>
<table>
<thead>
<tr><th>La soluzione</th><th>Punti di forza</th><th>Limitazioni</th><th>Migliore per</th></tr>
</thead>
<tbody>
<tr><td>memsearch</td><td>Memoria trasparente in chiaro, co-authoring umano-AI, zero attriti di migrazione, debugging semplice, Git-native</td><td>Nessun grafo temporale incorporato o complesse strutture di memoria multi-agente</td><td>Team che apprezzano il controllo, la semplicità e la portabilità della memoria a lungo termine</td></tr>
<tr><td>Mem0</td><td>Completamente gestito, nessuna infrastruttura da gestire o mantenere</td><td>Opaco: non è possibile ispezionare o modificare manualmente la memoria; l'unica rappresentazione è quella degli embeddings.</td><td>Squadre che desiderano un servizio gestito in modo non invasivo e che accettano una minore visibilità</td></tr>
<tr><td>Zep</td><td>Ricco set di funzionalità: memoria temporale, modellazione multi-persona, grafi di conoscenza complessi</td><td>Architettura pesante; più pezzi in movimento; più difficile da imparare e utilizzare</td><td>Agenti che hanno veramente bisogno di strutture di memoria avanzate o di un ragionamento consapevole del tempo</td></tr>
<tr><td>LangMem / Letta</td><td>Integrazione profonda e senza soluzione di continuità all'interno dei loro ecosistemi</td><td>Lock-in del framework; difficile da portare su altri stack di agenti</td><td>Team già impegnati su quei framework specifici</td></tr>
</tbody>
</table>
<h2 id="Start-Using-memsearch-and-Join-the-Project" class="common-anchor-header">Iniziare a usare memsearch e unirsi al progetto<button data-href="#Start-Using-memsearch-and-Join-the-Project" class="anchor-icon" translate="no">
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
    </button></h2><p>Memsearch è completamente open source sotto licenza MIT e il repository è già pronto per gli esperimenti di produzione.</p>
<ul>
<li><p><strong>Repo:</strong> <a href="https://github.com/zilliztech/memsearch">github.com/zilliztech/memsearch</a></p></li>
<li><p><strong>Documenti:</strong> <a href="https://zilliztech.github.io/memsearch">zilliztech.github.io/memsearch</a></p></li>
</ul>
<p>Se state costruendo un agente che ha bisogno di ricordare le cose tra le varie sessioni e volete avere il pieno controllo su ciò che ricorda, memsearch merita un'occhiata. La libreria si installa con un singolo <code translate="no">pip install</code>, funziona con qualsiasi framework per agenti e memorizza tutto come Markdown che si può leggere, modificare e versionare con Git.</p>
<p>Stiamo sviluppando attivamente memsearch e ci piacerebbe ricevere suggerimenti dalla comunità.</p>
<ul>
<li><p>Aprite un problema se qualcosa si rompe.</p></li>
<li><p>Inviate una PR se volete estendere la libreria.</p></li>
<li><p>Date una stella al repo se la filosofia di Markdown-as-source-of-truth vi convince.</p></li>
</ul>
<p>Il sistema di memoria di OpenClaw non è più chiuso all'interno di OpenClaw. Ora chiunque può usarlo.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Continua a leggere<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">Cos'è OpenClaw? Guida completa all'agente di intelligenza artificiale open source</a></p></li>
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Esercitazione su OpenClaw: Connettersi a Slack per un assistente AI locale</a></p></li>
<li><p><a href="https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md">Costruire agenti di intelligenza artificiale in stile Clawdbot con LangGraph e Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md">RAG e agenti a lunga durata: RAG è obsoleto?</a></p></li>
<li><p><a href="https://milvus.io/blog/create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md">Creare un'abilità antropica personalizzata per Milvus per avviare rapidamente RAG</a></p></li>
</ul>
