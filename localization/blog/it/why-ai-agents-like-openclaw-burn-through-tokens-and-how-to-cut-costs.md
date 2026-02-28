---
id: why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md
title: >-
  Perché gli agenti di intelligenza artificiale come OpenClaw consumano i
  gettoni e come ridurre i costi
author: Min Yin
date: 2026-2-28
cover: assets.zilliz.com/Blog_Open_Claw_Burning_Through_Tokens_1_39b7ee4fdf.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'OpenClaw, Token Optimization, Vector Search, AI Agents, Milvus'
meta_keywords: >-
  OpenClaw token costs, OpenClaw token optimization, reduce OpenClaw API costs,
  hybrid search BM25 vector, AI agent memory, memsearch, Milvus
meta_title: |
  Why AI Agents like OpenClaw Burn Through Tokens and How to Cut Costs
desc: >-
  Perché le fatture dei token di OpenClaw e di altri agenti AI aumentano e come
  risolvere il problema con BM25 + recupero vettoriale (index1, QMD, Milvus) e
  memoria Markdown-first (memsearch).
origin: >-
  https://milvus.io/blog/why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md
---
<p>Se avete trascorso un po' di tempo con <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a> (precedentemente Clawdbot e Moltbot), sapete già quanto sia bravo questo agente AI. È veloce, locale, flessibile e in grado di eseguire flussi di lavoro sorprendentemente complessi attraverso Slack, Discord, la vostra base di codice e praticamente qualsiasi altra cosa a cui lo agganciate. Ma quando si inizia a usarlo seriamente, emerge rapidamente un modello: <strong>l'utilizzo dei token inizia a salire.</strong></p>
<p>Non è una colpa specifica di OpenClaw: è il modo in cui la maggior parte degli agenti AI si comporta oggi. Essi attivano una chiamata LLM per quasi tutto: per cercare un file, per pianificare un'attività, per scrivere una nota, per eseguire uno strumento o per fare una domanda di follow-up. E poiché i token sono la valuta universale di queste chiamate, ogni azione ha un costo.</p>
<p>Per capire da dove proviene questo costo, dobbiamo guardare sotto il cofano a due grandi contributori:</p>
<ul>
<li><strong>La ricerca:</strong> Le ricerche mal costruite raccolgono carichi di contesto spropositati: interi file, log, messaggi e regioni di codice di cui il modello non ha effettivamente bisogno.</li>
<li><strong>Memoria:</strong> La memorizzazione di informazioni non importanti costringe l'agente a rileggerle e rielaborarle in occasione di chiamate future, aumentando il consumo di token nel tempo.</li>
</ul>
<p>Entrambi i problemi aumentano silenziosamente i costi operativi senza migliorare le capacità.</p>
<h2 id="How-AI-Agents-Like-OpenClaw-Actually-Perform-Searches--and-Why-That-Burns-Tokens" class="common-anchor-header">Come gli agenti AI come OpenClaw eseguono effettivamente le ricerche - e perché questo brucia i token<button data-href="#How-AI-Agents-Like-OpenClaw-Actually-Perform-Searches--and-Why-That-Burns-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando un agente ha bisogno di informazioni dal vostro codebase o dalla vostra libreria di documenti, in genere esegue l'equivalente di un <strong>Ctrl+F</strong> a livello di progetto. Ogni riga corrispondente viene restituita, non classificata, non filtrata e non prioritaria. Claude Code implementa questo metodo con uno strumento Grep dedicato, basato su ripgrep. OpenClaw non ha uno strumento di ricerca della base di codice incorporato, ma il suo strumento exec consente al modello sottostante di eseguire qualsiasi comando e le competenze caricate possono guidare l'agente a usare strumenti come rg. In entrambi i casi, la ricerca nel codebase restituisce corrispondenze di parole chiave non classificate e non filtrate.</p>
<p>Questo approccio di forza bruta va bene per i piccoli progetti. Ma quando i repository crescono, il prezzo aumenta. Le corrispondenze irrilevanti si accumulano nella finestra di contesto dell'LLM, costringendo il modello a leggere ed elaborare migliaia di token di cui non ha effettivamente bisogno. Una singola ricerca non circoscritta può trascinare file interi, enormi blocchi di commenti o registri che condividono una parola chiave ma non l'intento sottostante. Se si ripete questo schema per una lunga sessione di debug o di ricerca, l'ingombro aumenta rapidamente.</p>
<p>Sia OpenClaw che Claude Code cercano di gestire questa crescita. OpenClaw elimina gli output sovradimensionati degli strumenti e compatta le lunghe cronologie delle conversazioni, mentre Claude Code limita l'output della lettura dei file e supporta la compattazione del contesto. Queste mitigazioni funzionano, ma solo dopo che la query gonfia è già stata eseguita. I risultati della ricerca non classificata hanno comunque consumato token e voi li avete pagati. La gestione del contesto aiuta i giri futuri, non la chiamata originale che ha generato lo spreco.</p>
<h2 id="How-AI-Agent-Memory-Works-and-Why-It-Also-Costs-Tokens" class="common-anchor-header">Come funziona la memoria dell'agente AI e perché costa anche i gettoni<button data-href="#How-AI-Agent-Memory-Works-and-Why-It-Also-Costs-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>La ricerca non è l'unica fonte di sovraccarico di token. Ogni pezzo di contesto che un agente richiama dalla memoria deve anche essere caricato nella finestra del contesto dell'LLM, e anche questo costa token.</p>
<p>Le API LLM su cui si basa la maggior parte degli agenti oggi sono stateless: L'API Messages di Anthropic richiede l'intera cronologia delle conversazioni a ogni richiesta e l'API Chat Completions di OpenAI funziona allo stesso modo. Anche la più recente API Stateful Responses di OpenAI, che gestisce lo stato della conversazione lato server, richiede ancora la finestra di contesto completa a ogni chiamata. La memoria caricata nel contesto costa token indipendentemente dal modo in cui vi arriva.</p>
<p>Per ovviare a questo problema, i framework per agenti scrivono le note in file su disco e le caricano nuovamente nella finestra di contesto quando l'agente ne ha bisogno. Ad esempio, OpenClaw memorizza le note curate in MEMORY.md e aggiunge i log giornalieri a file Markdown con data e ora, quindi li indicizza con una ricerca ibrida BM25 e vettoriale, in modo che l'agente possa richiamare il contesto pertinente su richiesta.</p>
<p>Il design della memoria di OpenClaw funziona bene, ma richiede l'intero ecosistema OpenClaw: il processo Gateway, le connessioni alla piattaforma di messaggistica e il resto dello stack. Lo stesso vale per la memoria di Claude Code, che è legata alla sua CLI. Se si sta costruendo un agente personalizzato al di fuori di queste piattaforme, è necessaria una soluzione indipendente. La prossima sezione tratta gli strumenti disponibili per entrambi i problemi.</p>
<h2 id="How-to-Stop-OpenClaw-From-Burning-Through-Tokens" class="common-anchor-header">Come impedire a OpenClaw di consumare i token<button data-href="#How-to-Stop-OpenClaw-From-Burning-Through-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>Se volete ridurre il consumo di token di OpenClaw, potete agire su due leve.</p>
<ul>
<li>La prima è un <strong>migliore recupero</strong>, sostituendo i dump di parole chiave in stile grep con strumenti di ricerca classificati e basati sulla rilevanza, in modo che il modello veda solo le informazioni effettivamente importanti.</li>
<li>Il secondo è una <strong>memoria migliore</strong>: passare da uno storage opaco e dipendente dal framework a qualcosa che si possa capire, ispezionare e controllare.</li>
</ul>
<h3 id="Replacing-grep-with-Better-Retrieval-index1-QMD-and-Milvus" class="common-anchor-header">Sostituire grep con un migliore recupero: index1, QMD e Milvus</h3><p>Molti agenti di codifica dell'intelligenza artificiale cercano nelle basi di codice con grep o ripgrep. Claude Code ha uno strumento Grep dedicato, basato su ripgrep. OpenClaw non ha uno strumento integrato per la ricerca delle basi di codice, ma il suo strumento exec consente al modello sottostante di eseguire qualsiasi comando e di caricare competenze come ripgrep o QMD per guidare la ricerca dell'agente. Senza un'abilità focalizzata sul reperimento, l'agente ricade in qualsiasi approccio scelto dal modello sottostante. Il problema principale è lo stesso per tutti gli agenti: senza un reperimento classificato, le corrispondenze di parole chiave entrano nella finestra di contesto senza essere filtrate.</p>
<p>Questo funziona quando un progetto è abbastanza piccolo da far rientrare comodamente ogni corrispondenza nella finestra del contesto. Il problema inizia quando una base di codice o una libreria di documenti cresce al punto che una parola chiave restituisce decine o centinaia di risultati e l'agente deve caricarli tutti nel prompt. A quel punto, i risultati devono essere classificati per rilevanza, non solo filtrati per corrispondenza.</p>
<p>La soluzione standard è la ricerca ibrida, che combina due metodi di classificazione complementari:</p>
<ul>
<li>BM25 assegna un punteggio a ciascun risultato in base alla frequenza e all'univocità con cui un termine compare in un determinato documento. Un file mirato che menziona "autenticazione" 15 volte si classifica meglio di un file vasto che lo menziona una sola volta.</li>
<li>La ricerca vettoriale converte il testo in rappresentazioni numeriche del significato, quindi "autenticazione" può corrispondere a "flusso di login" o "gestione delle sessioni" anche se non condividono alcuna parola chiave.</li>
</ul>
<p>Nessuno dei due metodi è sufficiente: Il BM25 non trova i termini parafrasati e la ricerca vettoriale non trova i termini esatti come i codici di errore. La combinazione di entrambi e l'unione degli elenchi classificati attraverso un algoritmo di fusione copre entrambe le lacune.</p>
<p>Gli strumenti che seguono implementano questo schema su scale diverse. Grep è lo strumento di base con cui si inizia. index1, QMD e Milvus aggiungono ciascuno una ricerca ibrida con capacità crescente.</p>
<h4 id="index1-fast-hybrid-search-on-a-single-machine" class="common-anchor-header">index1: ricerca ibrida veloce su una singola macchina</h4><p><a href="https://github.com/gladego/index1">index1</a> è uno strumento CLI che racchiude la ricerca ibrida in un singolo file di database SQLite. FTS5 gestisce BM25, sqlite-vec gestisce la similarità vettoriale e RRF fonde gli elenchi classificati. Gli embeddings sono generati localmente da Ollama, quindi nulla lascia la vostra macchina.</p>
<p>index1 suddivide il codice per struttura, non per numero di righe: I file Markdown sono divisi per titoli, i file Python per AST, JavaScript e TypeScript per pattern regex. Ciò significa che i risultati della ricerca restituiscono unità coerenti come una funzione completa o una sezione di documentazione completa, non intervalli di righe arbitrari che si interrompono a metà blocco. Il tempo di risposta è compreso tra 40 e 180 ms per le query ibride. Senza Ollama, si torna al solo BM25, che classifica comunque i risultati invece di scaricare ogni corrispondenza nella finestra del contesto.</p>
<p>index1 include anche un modulo di memoria episodica per memorizzare le lezioni apprese, le cause dei bug e le decisioni architettoniche. Queste memorie vivono all'interno dello stesso database SQLite dell'indice del codice, anziché come file indipendenti.</p>
<p>Nota: index1 è un progetto in fase iniziale (0 stelle, 4 commit a febbraio 2026). Valutatelo con la vostra base di codice prima di impegnarvi.</p>
<ul>
<li><strong>Ideale per</strong>: sviluppatori singoli o piccoli team con una base di codice che sta su una sola macchina, alla ricerca di un miglioramento veloce rispetto a grep.</li>
<li><strong>Lo si supera quando</strong>: si ha bisogno di un accesso multiutente allo stesso indice, oppure i dati superano la capacità di gestione di un singolo file SQLite.</li>
</ul>
<h4 id="QMD-higher-accuracy-through-local-LLM-re-ranking" class="common-anchor-header">QMD: maggiore accuratezza grazie al riarrangiamento locale di LLM</h4><p><a href="https://github.com/tobi/qmd">QMD</a> (Query Markup Documents), creato dal fondatore di Shopify Tobi Lütke, aggiunge una terza fase: La ri-classificazione LLM. Dopo che BM25 e la ricerca vettoriale hanno restituito tutti i candidati, un modello linguistico locale rilegge i risultati migliori e li riordina in base all'effettiva rilevanza della query. In questo modo vengono individuati i casi in cui sia le corrispondenze di parole chiave che quelle semantiche restituiscono risultati plausibili ma sbagliati.</p>
<p>QMD viene eseguito interamente sulla vostra macchina utilizzando tre modelli GGUF per un totale di circa 2 GB: un modello di embedding (embeddinggemma-300M), un reranker cross-encoder (Qwen3-Reranker-0.6B) e un modello di espansione della query (qmd-query-expansion-1.7B). Tutti e tre vengono scaricati automaticamente alla prima esecuzione. Nessuna chiamata all'API cloud, nessuna chiave API.</p>
<p>Il compromesso è il tempo di avvio a freddo: il caricamento di tre modelli dal disco richiede circa 15-16 secondi. QMD supporta una modalità server persistente (qmd mcp) che mantiene i modelli in memoria tra una richiesta e l'altra, eliminando la penalizzazione dell'avvio a freddo per le query ripetute.</p>
<ul>
<li><strong>Ideale per:</strong> ambienti critici per la privacy, dove nessun dato può lasciare la macchina e dove l'accuratezza del recupero è più importante del tempo di risposta.</li>
<li><strong>Superatelo quando:</strong> avete bisogno di risposte al di sotto del secondo, di un accesso condiviso da parte di un team o quando il vostro set di dati supera la capacità di una singola macchina.</li>
</ul>
<h4 id="Milvus-hybrid-search-at-team-and-enterprise-scale" class="common-anchor-header">Milvus: ricerca ibrida su scala aziendale e di team</h4><p>Gli strumenti a macchina singola di cui sopra funzionano bene per i singoli sviluppatori, ma incontrano dei limiti quando più persone o agenti devono accedere alla stessa base di conoscenze. <a href="https://github.com/milvus-io/milvus"></a></p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a> è un database vettoriale open source costruito per questa fase successiva: distribuito, multiutente e in grado di gestire miliardi di vettori.</p>
<p>La sua caratteristica chiave per questo caso d'uso è la Sparse-BM25 integrata, disponibile fin da Milvus 2.5 e significativamente più veloce nella 2.6. L'utente fornisce testo grezzo e Milvus lo tokenizza internamente usando un analizzatore costruito su tantivy, quindi converte il risultato in vettori sparsi che vengono precalcolati e memorizzati al momento dell'indice.</p>
<p>Poiché la rappresentazione BM25 è già memorizzata, non è necessario ricalcolare i punteggi al volo. Questi vettori sparsi vivono accanto ai vettori densi (embeddings semantici) nella stessa Collection. Al momento dell'interrogazione, si fondono entrambi i segnali con un classificatore come RRFRanker, che Milvus fornisce in dotazione. Lo stesso modello di ricerca ibrida di index1 e QMD, ma su un'infrastruttura che scala orizzontalmente.</p>
<p>Milvus offre anche funzionalità che gli strumenti a macchina singola non possono offrire: isolamento multi-tenant (database o raccolte separate per team), replica dei dati con failover automatico e tiering dei dati caldo/freddo per uno storage efficiente dal punto di vista dei costi. Per gli agenti, ciò significa che più sviluppatori o più istanze di agenti possono interrogare contemporaneamente la stessa base di conoscenza senza calpestare i dati degli altri.</p>
<ul>
<li><strong>Ideale per</strong>: più sviluppatori o agenti che condividono una base di conoscenza, set di documenti di grandi dimensioni o in rapida crescita, o ambienti di produzione che necessitano di replica, failover e controllo degli accessi.</li>
</ul>
<p>Per riassumere:</p>
<table>
<thead>
<tr><th>Strumento</th><th>Fase</th><th>Distribuzione</th><th>Segnale di migrazione</th></tr>
</thead>
<tbody>
<tr><td>Claude Grep nativo</td><td>Prototipazione</td><td>Integrato, zero impostazioni</td><td>I conti salgono o le query rallentano</td></tr>
<tr><td>indicex1</td><td>Macchina singola (velocità)</td><td>SQLite locale + Ollama</td><td>Necessità di accesso multiutente o i dati superano una sola macchina</td></tr>
<tr><td>QMD</td><td>Macchina singola (precisione)</td><td>Tre modelli GGUF locali</td><td>Necessità di indici condivisi dal team</td></tr>
<tr><td>Milvus</td><td>Team o produzione</td><td>Cluster distribuito</td><td>Grandi insiemi di documenti o requisiti multi-tenant</td></tr>
</tbody>
</table>
<h3 id="Reducing-AI-Agent-Token-Costs-by-Giving-Them-Persistent-Editable-Memory-with-memsearch" class="common-anchor-header">Ridurre i costi dei token degli agenti AI fornendo loro una memoria persistente e modificabile con memsearch</h3><p>L'ottimizzazione della ricerca riduce lo spreco di token per ogni query, ma non aiuta con ciò che l'agente conserva tra le sessioni.</p>
<p>Ogni pezzo di contesto che un agente richiama dalla memoria deve essere caricato nel prompt, e anche questo costa token. La questione non è se memorizzare la memoria, ma come. Il metodo di memorizzazione determina la possibilità di vedere ciò che l'agente ricorda, di correggerlo quando è sbagliato e di portarlo con sé se si cambia strumento.</p>
<p>La maggior parte dei framework fallisce su tutti e tre i fronti. Mem0 e Zep memorizzano tutto in un database vettoriale, che funziona per il recupero, ma rende la memoria:</p>
<ul>
<li><strong>Opaca.</strong> Non si può vedere cosa ricorda l'agente senza interrogare un'API.</li>
<li><strong>Difficile da modificare.</strong> Correggere o rimuovere una memoria significa chiamare le API, non aprire un file.</li>
<li><strong>Bloccato.</strong> Cambiare framework significa esportare, convertire e reimportare i dati.</li>
</ul>
<p>OpenClaw adotta un approccio diverso. Tutta la memoria vive in semplici file Markdown su disco. L'agente scrive automaticamente i log giornalieri e gli esseri umani possono aprire e modificare direttamente qualsiasi file di memoria. Questo risolve tutti e tre i problemi: la memoria è leggibile, modificabile e trasportabile per design.</p>
<p>Il compromesso è l'overhead di distribuzione. Eseguire la memoria di OpenClaw significa eseguire l'intero ecosistema OpenClaw: il processo Gateway, le connessioni alla piattaforma di messaggistica e il resto dello stack. Per i team che già utilizzano OpenClaw, questo va bene. Per tutti gli altri, la barriera è troppo alta. <strong>memsearch</strong> è stato costruito per colmare questa lacuna: estrae il modello di memoria Markdown-first di OpenClaw in una libreria indipendente che funziona con qualsiasi agente.</p>
<p><strong><a href="https://github.com/zilliztech/memsearch">memsearch</a></strong>, realizzato da Zilliz (il team dietro Milvus), tratta i file Markdown come unica fonte di verità. Un file MEMORY.md contiene fatti e decisioni a lungo termine scritti a mano. I registri giornalieri (2026-02-26.md) sono generati automaticamente dai sommari delle sessioni. L'indice vettoriale, memorizzato in Milvus, è un livello derivato che può essere ricostruito dal Markdown in qualsiasi momento.</p>
<p>In pratica, ciò significa che è possibile aprire qualsiasi file di memoria in un editor di testo, leggere esattamente ciò che l'agente sa e modificarlo. Salvando il file, il file watcher di memsearch rileva la modifica e la reindicizza automaticamente. È possibile gestire le memorie con Git, rivedere le memorie generate dall'intelligenza artificiale tramite richieste di pull o spostarsi su una nuova macchina copiando una cartella. Se l'indice di Milvus viene perso, lo si ricostruisce a partire dai file. I file non sono mai a rischio.</p>
<p>Sotto il cofano, memsearch utilizza lo stesso schema di ricerca ibrido descritto in precedenza: pezzi divisi in base alla struttura dei titoli e ai confini dei paragrafi, recupero BM25 + vettoriale e un comando compatto alimentato da LLM che riassume le vecchie memorie quando i registri diventano grandi.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Open_Claw_Burning_Through_Tokens_3_d9df026b47.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ideale per: i team che desiderano una visibilità completa su ciò che l'agente ricorda, che hanno bisogno di un controllo di versione sulla memoria o che vogliono un sistema di memoria che non sia vincolato a un singolo framework di agente.</p>
<p>Per riassumere:</p>
<table>
<thead>
<tr><th>Capacità</th><th>Mem0 / Zep</th><th>memsearch</th></tr>
</thead>
<tbody>
<tr><td>Fonte di verità</td><td>Database vettoriale (unica fonte di dati)</td><td>File Markdown (primario) + Milvus (indice)</td></tr>
<tr><td>Trasparenza</td><td>Scatola nera, richiede API per l'ispezione</td><td>Aprire qualsiasi file .md per leggerlo</td></tr>
<tr><td>Modificabilità</td><td>Modifica tramite chiamate API</td><td>Modifica diretta in qualsiasi editor di testo, con reindicizzazione automatica</td></tr>
<tr><td>Controllo della versione</td><td>Richiede una registrazione di audit separata</td><td>Git funziona in modo nativo</td></tr>
<tr><td>Costo della migrazione</td><td>Esportare → convertire il formato → reimportare</td><td>Copiare la cartella Markdown</td></tr>
<tr><td>Collaborazione uomo-IA</td><td>L'IA scrive, l'uomo osserva</td><td>Gli umani possono modificare, integrare e rivedere</td></tr>
</tbody>
</table>
<h2 id="Which-setup-fits-your-scale" class="common-anchor-header">Quale configurazione si adatta alla vostra scala<button data-href="#Which-setup-fits-your-scale" class="anchor-icon" translate="no">
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
<tr><th>Scenario</th><th>Ricerca</th><th>La memoria</th><th>Quando andare avanti</th></tr>
</thead>
<tbody>
<tr><td>Primi prototipi</td><td>Grep (integrato)</td><td>-</td><td>I conti salgono o le query rallentano</td></tr>
<tr><td>Singolo sviluppatore, solo ricerca</td><td><a href="https://github.com/gladego/index1">index1</a> (velocità) o <a href="https://github.com/tobi/qmd">QMD</a> (precisione)</td><td>-</td><td>Necessità di accesso multiutente o i dati superano una sola macchina</td></tr>
<tr><td>Singolo sviluppatore, entrambi</td><td><a href="https://github.com/gladego/index1">indicex1</a></td><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>Necessità di accesso multiutente o i dati superano una sola macchina</td></tr>
<tr><td>Team o produzione, entrambi</td><td><a href="https://github.com/milvus-io/milvus">Milvus</a></td><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>-</td></tr>
<tr><td>Integrazione rapida, solo memoria</td><td>-</td><td>Mem0 o Zep</td><td>Necessità di ispezionare, modificare o migrare le memorie</td></tr>
</tbody>
</table>
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
    </button></h2><p>I costi di token che derivano dagli agenti AI sempre attivi non sono inevitabili. Questa guida ha trattato due aree in cui una migliore strumentazione può ridurre gli sprechi: la ricerca e la memoria.</p>
<p>Grep funziona su piccola scala, ma quando le basi di codice crescono, le corrispondenze di parole chiave non classificate inondano la finestra di contesto con contenuti di cui il modello non ha mai avuto bisogno. <a href="https://github.com/gladego/index1"></a><a href="https://github.com/gladego/index1">index1</a> e <a href="https://github.com/tobi/qmd"></a> QMD risolvono questo problema su una singola macchina, combinando il punteggio delle parole chiave BM25 con la ricerca vettoriale e restituendo solo i risultati più rilevanti. Per i team, le configurazioni multi-agente o i carichi di lavoro di produzione, <a href="https://milvus.io"></a><a href="https://milvus.io">Milvus</a> fornisce lo stesso modello di ricerca ibrida su un'infrastruttura che scala orizzontalmente.</p>
<p>Per quanto riguarda la memoria, la maggior parte dei framework memorizza tutto in un database vettoriale: opaco, difficile da modificare a mano e vincolato al framework che lo ha creato. <a href="https://github.com/zilliztech/memsearch">memsearch</a> adotta un approccio diverso. La memoria vive in semplici file Markdown che si possono leggere, modificare e controllare in versione con Git. Milvus funge da indice derivato che può essere ricostruito da questi file in qualsiasi momento. L'utente mantiene il controllo su ciò che l'agente conosce.</p>
<p>Sia <a href="https://github.com/zilliztech/memsearch"></a><a href="https://github.com/zilliztech/memsearch">memsearch</a> che <a href="https://github.com/milvus-io/milvus"></a><a href="https://github.com/milvus-io/milvus">Milvus</a> sono open source. Stiamo sviluppando attivamente memsearch e ci piacerebbe avere un feedback da chiunque lo utilizzi in produzione. Aprite un problema, inviate una PR o semplicemente diteci cosa funziona e cosa no.</p>
<p>Progetti citati in questa guida:</p>
<ul>
<li><a href="https://github.com/zilliztech/memsearch">memsearch</a>: Memoria Markdown-first per agenti AI, sostenuta da Milvus.</li>
<li><a href="https://github.com/milvus-io/milvus">Milvus</a>: database vettoriale open-source per la ricerca ibrida scalabile.</li>
<li><a href="https://github.com/gladego/index1">index1</a>: Ricerca ibrida BM25 + vettoriale per agenti di codifica AI.</li>
<li><a href="https://github.com/tobi/qmd">QMD</a>: ricerca ibrida locale con ri-ranking LLM.</li>
</ul>
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
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">Abbiamo estratto il sistema di memoria di OpenClaw e lo abbiamo reso open source (memsearch)</a></li>
<li><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Memoria persistente per il codice Claude: memsearch ccplugin</a></li>
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">Cos'è OpenClaw? Guida completa all'agente di intelligenza artificiale open source</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Tutorial su OpenClaw: Connettersi a Slack per un assistente AI locale</a></li>
</ul>
