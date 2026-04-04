---
id: is-mcp-dead-cli-and-skills-for-ai-agents.md
title: >-
  MCP è morto? Cosa abbiamo imparato Costruendo con MCP, CLI e competenze di
  agente
author: Cheney Zhang
date: 2026-4-1
cover: assets.zilliz.com/mcp_dead_a23ff23c27.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  MCP protocol, AI agent tooling, agent skills, model context protocol, CLI
  tools
meta_title: |
  Is MCP Dead? MCP vs CLI vs Agent Skills Compared
desc: >-
  MCP mangia il contesto, si rompe in produzione e non può riutilizzare l'LLM
  dell'agente. Li abbiamo costruiti tutti e tre: ecco quando ciascuno di essi è
  adatto.
origin: 'https://milvus.io/blog/is-mcp-dead-cli-and-skills-for-ai-agents.md'
---
<p>Quando Denis Yarats, CTO di Perplexity, ha dichiarato ad ASK 2026 che l'azienda stava eliminando MCP al suo interno, si è scatenato il solito ciclo. L'amministratore delegato di YC, Garry Tan, ha attaccato: MCP mangia troppa finestra di contesto, l'autenticazione è rotta, ha costruito un sostituto della CLI in 30 minuti. Hacker News si è schierato decisamente contro MCP.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_1_4e49d13991.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_2_7dc46108c1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Un anno fa, questo livello di scetticismo pubblico sarebbe stato insolito. Il Model Context Protocol (MCP) era posizionato come lo standard definitivo per l'integrazione degli strumenti <a href="https://zilliz.com/glossary/ai-agents">di intelligenza artificiale</a>. I server raddoppiavano ogni settimana. Da allora l'andamento ha seguito un arco familiare: rapido clamore, ampia adozione, poi disillusione della produzione.</p>
<p>Il settore sta reagendo rapidamente. Lark/Feishu di Bytedance ha reso pubblica la propria CLI ufficiale: più di 200 comandi per 11 domini aziendali e 19 abilità di agente integrate. Google ha lanciato gws per Google Workspace. Il modello CLI + Skills sta rapidamente diventando il default per gli strumenti di agentistica aziendale, non un'alternativa di nicchia.</p>
<p>Noi di Zilliz abbiamo rilasciato <a href="https://docs.zilliz.com/reference/cli/overview">Zilliz CLI</a>, che vi permette di operare e gestire <a href="https://milvus.io/intro">Milvus</a> e <a href="https://zilliz.com/cloud">Zilliz Cloud</a> (Milvus completamente gestito) direttamente dal vostro terminale senza lasciare il vostro ambiente di codifica. Inoltre, abbiamo creato <a href="https://milvus.io/docs/milvus_for_agents.md">Milvus Skills</a> e <a href="https://docs.zilliz.com/docs/agents/zilliz-skill">Zilliz Skills</a>in modo che agenti di codifica AI come Claude Code e Codex possano gestire il vostro <a href="https://zilliz.com/learn/what-is-vector-database">database di vettori</a> attraverso il linguaggio naturale.</p>
<p>Un anno fa abbiamo anche costruito un server MCP per Milvus e Zilliz Cloud. Quell'esperienza ci ha insegnato esattamente dove MCP si rompe e dove è ancora adatto. Tre limitazioni architettoniche ci hanno spinto verso la CLI e le Skills: l'ingombro della finestra di contesto, il design passivo dello strumento e l'impossibilità di riutilizzare l'LLM dell'agente stesso.</p>
<p>In questo post esamineremo ogni problema, mostreremo cosa stiamo costruendo al suo posto e delineeremo un quadro pratico per scegliere tra MCP, CLI e Agent Skills.</p>
<h2 id="MCP-Eats-72-of-Your-Context-Window-at-Startup" class="common-anchor-header">MCP consuma il 72% della finestra di contesto all'avvio<button data-href="#MCP-Eats-72-of-Your-Context-Window-at-Startup" class="anchor-icon" translate="no">
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
    </button></h2><p>Una configurazione MCP standard può consumare circa il 72% della finestra di contesto disponibile prima che l'agente compia una sola azione. Collegando tre server - GitHub, Playwright e un'integrazione IDE - su un modello da 200K token, le sole definizioni degli strumenti occupano circa 143K token. L'agente non ha ancora fatto nulla. È già pieno per tre quarti.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_3_767d46c583.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Il costo non è solo di token. Più contenuti non correlati vengono inseriti nel contesto, più debole è la concentrazione del modello su ciò che conta davvero. Un centinaio di schemi di strumenti inseriti nel contesto significa che l'agente li attraversa tutti per ogni decisione. I ricercatori hanno documentato quello che chiamano " <em>context rot"</em>, ovvero il degrado della qualità del ragionamento dovuto al sovraccarico del contesto. Nei test misurati, l'accuratezza della selezione degli strumenti è scesa dal 43% a meno del 14% con l'aumentare del numero di strumenti. Più strumenti, paradossalmente, significa un uso peggiore degli strumenti.</p>
<p>La causa principale è architettonica. MCP carica tutte le descrizioni degli strumenti all'inizio della sessione, indipendentemente dal fatto che la conversazione in corso li utilizzi o meno. Si tratta di una scelta progettuale a livello di protocollo, non di un bug, ma il costo aumenta con ogni strumento aggiunto.</p>
<p>Le competenze degli agenti adottano un approccio diverso: la <strong>divulgazione progressiva</strong>. All'inizio della sessione, l'agente legge solo i metadati di ciascuna abilità: nome, descrizione di una riga, condizione di attivazione. In totale poche decine di token. Il contenuto completo dell'Abilità viene caricato solo quando l'agente ne determina la rilevanza. Vedetela in questo modo: MCP mette in fila tutti gli strumenti e vi fa scegliere; Skills vi offre prima un indice e poi il contenuto completo su richiesta.</p>
<p>Gli strumenti CLI offrono un vantaggio simile. Un agente esegue git --help o docker --help per scoprire le funzionalità su richiesta, senza precaricare ogni definizione di parametro. Il costo del contesto è a consumo, non anticipato.</p>
<p>Su piccola scala, la differenza è trascurabile. Su scala di produzione, è la differenza tra un agente che funziona e uno che annega nelle definizioni dei propri strumenti.</p>
<h2 id="MCPs-Passive-Architecture-Limits-Agent-Workflows" class="common-anchor-header">L'architettura passiva di MCP limita i flussi di lavoro degli agenti<button data-href="#MCPs-Passive-Architecture-Limits-Agent-Workflows" class="anchor-icon" translate="no">
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
    </button></h2><p>MCP è un protocollo di chiamata degli strumenti: come scoprire gli strumenti, chiamarli e ricevere i risultati. Un design pulito per casi d'uso semplici. Ma questa pulizia è anche un vincolo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_4_f80de07814.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Flat-Tool-Space-with-No-Hierarchy" class="common-anchor-header">Spazio degli strumenti piatto senza gerarchia</h3><p>Uno strumento MCP è una firma di funzione piatta. Nessun sottocomando, nessuna consapevolezza del ciclo di vita della sessione, nessuna percezione della posizione dell'agente in un flusso di lavoro a più fasi. Aspetta di essere chiamato. È tutto ciò che fa.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_5_e7f3630e1f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Una CLI funziona in modo diverso. git commit, git push e git log sono percorsi di esecuzione completamente diversi che condividono una singola interfaccia. Un agente esegue --help, esplora la superficie disponibile in modo incrementale ed espande solo ciò di cui ha bisogno, senza caricare in anticipo tutta la documentazione dei parametri nel contesto.</p>
<h3 id="Skills-Encode-Workflow-Logic--MCP-Cant" class="common-anchor-header">Le competenze codificano la logica del flusso di lavoro, mentre MCP non può farlo.</h3><p>Un'abilità dell'agente è un file Markdown che contiene una procedura operativa standard: cosa fare per primo, cosa fare dopo, come gestire i fallimenti e quando far emergere qualcosa all'utente. L'agente non riceve solo uno strumento, ma un intero flusso di lavoro. Le competenze modellano attivamente il comportamento dell'agente durante la conversazione: cosa lo attiva, cosa prepara in anticipo e come recupera gli errori. Gli strumenti MCP possono solo aspettare.</p>
<h3 id="MCP-Cant-Access-the-Agents-LLM" class="common-anchor-header">MCP non può accedere all'LLM dell'agente</h3><p>Questa è la limitazione che ci ha fermato.</p>
<p>Quando abbiamo costruito <a href="https://github.com/zilliztech/claude-context">claude-context</a> - un plugin MCP che aggiunge la <a href="https://zilliz.com/glossary/semantic-search">ricerca semantica</a> a Claude Code e ad altri agenti di codifica AI, fornendo loro un contesto profondo da un'intera base di codice - volevamo recuperare frammenti di conversazioni storiche rilevanti da Milvus e farle emergere come contesto. La <a href="https://zilliz.com/learn/vector-similarity-search">ricerca vettoriale</a> ha funzionato. Il problema era cosa fare con i risultati.</p>
<p>Recuperando i primi 10 risultati, forse 3 sono utili. Gli altri 7 sono rumore. Se si consegnano tutti e 10 all'agente esterno, il rumore interferisce con la risposta. Nei test, abbiamo visto che le risposte venivano distratte da record storici irrilevanti. Dovevamo filtrare prima di passare i risultati.</p>
<p>Abbiamo provato diversi approcci. Aggiungere una fase di reranking all'interno del server MCP utilizzando un modello di piccole dimensioni: non era abbastanza preciso e la soglia di rilevanza doveva essere regolata in base al caso d'uso. Utilizzare un modello di grandi dimensioni per il reranking: tecnicamente valido, ma un server MCP viene eseguito come processo separato senza accesso all'LLM dell'agente esterno. Dovremmo configurare un client LLM separato, gestire una chiave API separata e gestire un percorso di chiamata separato.</p>
<p>Quello che volevamo era semplice: lasciare che l'LLM dell'agente esterno partecipasse direttamente alla decisione di filtraggio. Recuperare la top 10, lasciare che sia l'agente stesso a giudicare cosa vale la pena conservare e restituire solo i risultati rilevanti. Nessun secondo modello. Nessuna chiave API aggiuntiva.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_6_aca200f359.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>MCP non può fare questo. Il confine del processo tra server e agente è anche un confine di intelligenza. Il server non può usare l'LLM dell'agente; l'agente non può governare ciò che accade all'interno del server. Va bene per semplici strumenti CRUD. Nel momento in cui uno strumento deve esprimere un giudizio, l'isolamento diventa un vero e proprio vincolo.</p>
<p>Un'abilità agente risolve direttamente questo problema. Un'abilità di reperimento può chiamare la ricerca vettoriale per la top 10, far sì che l'LLM dell'agente valuti la pertinenza e restituire solo ciò che passa. Nessun modello aggiuntivo. L'agente si occupa da solo del filtraggio.</p>
<h2 id="What-We-Built-Instead-with-CLI-and-Skills" class="common-anchor-header">Cosa abbiamo costruito invece con CLI e Skills<button data-href="#What-We-Built-Instead-with-CLI-and-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p>Per noi CLI e Skills rappresentano la direzione dell'interazione agente-strumento, non solo per il recupero della memoria, ma per tutto lo stack. Questa convinzione guida tutto ciò che stiamo costruendo.</p>
<h3 id="memsearch-A-Skills-Based-Memory-Layer-for-AI-Agents" class="common-anchor-header">memsearch: Un livello di memoria basato sulle competenze per gli agenti AI</h3><p>Abbiamo costruito <a href="https://github.com/zilliztech/memsearch">memsearch</a>, un livello di memoria open-source per Claude Code e altri agenti AI. L'abilità viene eseguita all'interno di un subagente con tre fasi: Milvus gestisce la ricerca vettoriale iniziale per un'ampia scoperta, l'LLM dell'agente valuta la rilevanza ed espande il contesto per i risultati promettenti, e un drill-down finale accede alle conversazioni originali solo quando necessario. Il rumore viene scartato in ogni fase: la spazzatura intermedia non raggiunge mai la finestra del contesto primario.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_7_7c85103513.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>L'intuizione chiave: l'intelligenza dell'agente fa parte dell'esecuzione dello strumento. L'LLM già presente nel loop si occupa del filtraggio: nessun secondo modello, nessuna chiave API aggiuntiva, nessuna regolazione fragile delle soglie. Questo è un caso d'uso specifico - il recupero del contesto di conversazione per gli agenti di codifica - ma l'architettura è generalizzabile a qualsiasi scenario in cui uno strumento ha bisogno di giudizio, non solo di esecuzione.</p>
<h3 id="Zilliz-CLI-Skills-and-Plugin-for-Vector-Database-Operations" class="common-anchor-header">Zilliz CLI, Skills e Plugin per operazioni su database vettoriali</h3><p>Milvus è il database vettoriale open-source più diffuso al mondo, con <a href="https://github.com/milvus-io/milvus">oltre 43.000 stelle su GitHub</a>. <a href="https://zilliz.com/cloud">Zilliz Cloud</a> è il servizio completamente gestito di Milvus con funzionalità aziendali avanzate ed è molto più veloce di Milvus.</p>
<p>La stessa architettura a livelli di cui sopra è alla base dei nostri strumenti per gli sviluppatori:</p>
<ul>
<li><a href="https://docs.zilliz.com/reference/cli/overview">Zilliz CLI</a> è il livello dell'infrastruttura. Gestione dei cluster, <a href="https://milvus.io/docs/manage-collections.md">operazioni di raccolta</a>, ricerca vettoriale, <a href="https://milvus.io/docs/rbac.md">RBAC</a>, backup, fatturazione: tutto ciò che fareste nella console di Zilliz Cloud è disponibile dal terminale. Gli esseri umani e gli agenti utilizzano gli stessi comandi. Zilliz CLI funge anche da base per Milvus Skills e Zilliz Skills.</li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md">Milvus Skill</a> è il livello di conoscenza per Milvus open-source. Insegna agli agenti di codifica AI (Claude Code, Cursor, Codex, GitHub Copilot) a gestire qualsiasi implementazione Milvus - <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>, Standalone o Distributed - attraverso il codice Python <a href="https://milvus.io/docs/install-pymilvus.md">di Milvus</a>: connessioni, <a href="https://milvus.io/docs/schema-hands-on.md">progettazione di schemi</a>, CRUD, <a href="https://zilliz.com/learn/hybrid-search-with-milvus">ricerca ibrida</a>, <a href="https://milvus.io/docs/full-text-search.md">ricerca full-text</a>, <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">pipeline RAG</a>.</li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-skill">Zilliz Skill</a> fa lo stesso per Zilliz Cloud, insegnando agli agenti a gestire l'infrastruttura cloud attraverso Zilliz CLI.</li>
<li><a href="https://github.com/zilliztech/zilliz-plugin">Zilliz Plugin</a> è il livello di esperienza dello sviluppatore per Claude Code - racchiude CLI + Skill in un'esperienza guidata con comandi slash come /zilliz:quickstart e /zilliz:status.</li>
</ul>
<p>La CLI gestisce l'esecuzione, le Skill codificano le conoscenze e la logica del flusso di lavoro, il Plugin fornisce la UX. Nessun server MCP nel ciclo.</p>
<p>Per maggiori dettagli, consultate queste risorse:</p>
<ul>
<li><a href="https://zilliz.com/blog/introducing-zilliz-cli-and-agent-skills-for-zilliz-cloud">Presentazione di Zilliz CLI e Agent Skills per Zilliz Cloud</a></li>
<li><a href="https://zilliz.com/blog/zilliz-cloud-just-landed-in-claude-code">Zilliz Cloud è appena sbarcato in Claude Code</a></li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-ai-prompts">Prompt AI - Hub per gli sviluppatori di Zilliz Cloud</a></li>
<li><a href="https://docs.zilliz.com/reference/cli/overview">Riferimento alla CLI di Zilliz - Hub per gli sviluppatori di Zilliz Cloud</a></li>
<li><a href="https://docs.zilliz.com/docs/agents/zilliz-skill">Zilliz Skill - Hub degli sviluppatori di Zilliz Cloud</a></li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md">Milvus per gli agenti AI - Documentazione Milvus</a></li>
</ul>
<h2 id="Is-MCP-Actually-Dying" class="common-anchor-header">L'MCP sta davvero morendo?<button data-href="#Is-MCP-Actually-Dying" class="anchor-icon" translate="no">
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
    </button></h2><p>Molti sviluppatori e aziende, compresi noi di Zilliz, si stanno rivolgendo a CLI e Skill. Ma MCP sta davvero morendo?</p>
<p>La risposta breve è: no, ma il suo campo di applicazione si sta restringendo.</p>
<p>MCP è stato donato alla Linux Foundation. I server attivi sono oltre 10.000. I download mensili dell'SDK sono 97 milioni. Un ecosistema di queste dimensioni non scompare per un commento a una conferenza.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_8_b2246e6825.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Un thread di Hacker News - <em>"Quando ha senso MCP rispetto a CLI?"</em> - ha suscitato risposte che per lo più favoriscono la CLI: "Gli strumenti della CLI sono come strumenti di precisione", "Le CLI sono anche più veloci degli MCP". Alcuni sviluppatori hanno una visione più equilibrata: Le competenze sono una ricetta dettagliata che aiuta a risolvere meglio un problema; l'MCP è lo strumento che aiuta a risolvere il problema. Entrambi hanno il loro posto.</p>
<p>Questo è giusto, ma solleva una questione pratica. Se la ricetta stessa può indirizzare l'agente su quali strumenti utilizzare e come, è ancora necessario un protocollo di distribuzione degli strumenti separato?</p>
<p>Dipende dal caso d'uso.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/is_mcp_dead_cli_and_skills_for_ai_agents_md_9_e2cb28812b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>L'MCP su stdio</strong> - la versione che la maggior parte degli sviluppatori esegue localmente - è il punto in cui si accumulano i problemi: comunicazione interprocesso instabile, isolamento disordinato dell'ambiente, elevato overhead dei token. In questo contesto, esistono alternative migliori per quasi tutti i casi d'uso.</p>
<p><strong>MCP su HTTP</strong> è una storia diversa. Le piattaforme di tooling interne alle aziende hanno bisogno di una gestione centralizzata dei permessi, di OAuth unificato, di telemetria e logging standardizzati. Gli strumenti CLI frammentati fanno davvero fatica a fornirli. L'architettura centralizzata di MCP ha un valore reale in questo contesto.</p>
<p>Ciò che Perplexity ha effettivamente abbandonato è stato principalmente il caso d'uso di stdio. Denis Yarats ha specificato "internamente" e non ha chiesto l'adozione di questa scelta a livello industriale. Questa sfumatura si è persa nella trasmissione: "Perplexity abbandona MCP" si diffonde molto più velocemente di "Perplexity priorizza MCP rispetto a stdio per l'integrazione di strumenti interni".</p>
<p>MCP è emerso perché ha risolto un problema reale: prima di esso, ogni applicazione di IA scriveva la propria logica di chiamata degli strumenti, senza uno standard condiviso. MCP ha fornito un'interfaccia unificata al momento giusto e l'ecosistema si è sviluppato rapidamente. L'esperienza di produzione ha poi fatto emergere i limiti. Si tratta di un arco normale per gli strumenti dell'infrastruttura, non di una condanna a morte.</p>
<h2 id="When-to-Use-MCP-CLI-or-Skills" class="common-anchor-header">Quando usare MCP, CLI o Skills<button data-href="#When-to-Use-MCP-CLI-or-Skills" class="anchor-icon" translate="no">
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
<tr><th></th><th>MCP su stdio (locale)</th><th>MCP su HTTP (aziendale)</th></tr>
</thead>
<tbody>
<tr><td><strong>Autenticazione</strong></td><td>Nessuna</td><td>OAuth, centralizzata</td></tr>
<tr><td><strong>Stabilità della connessione</strong></td><td>Problemi di isolamento dei processi</td><td>HTTPS stabile</td></tr>
<tr><td><strong>Registrazione</strong></td><td>Nessun meccanismo standard</td><td>Telemetria centralizzata</td></tr>
<tr><td><strong>Controllo degli accessi</strong></td><td>Nessuno</td><td>Autorizzazioni basate sui ruoli</td></tr>
<tr><td><strong>Il nostro punto di vista</strong></td><td>Sostituire con CLI + competenze</td><td>Mantenere per gli strumenti aziendali</td></tr>
</tbody>
</table>
<p>Per i team che scelgono il loro stack di strumenti per l <a href="https://zilliz.com/glossary/ai-agents">'intelligenza artificiale</a>, ecco come si adattano i livelli:</p>
<table>
<thead>
<tr><th>Strato</th><th>Cosa fa</th><th>Meglio per</th><th>Esempi</th></tr>
</thead>
<tbody>
<tr><td><strong>CLI</strong></td><td>Attività operative, gestione delle infrastrutture</td><td>Comandi eseguiti da agenti e umani</td><td>git, docker, zilliz-cli</td></tr>
<tr><td><strong>Competenze</strong></td><td>Logica del flusso di lavoro dell'agente, conoscenza codificata</td><td>Compiti che richiedono il giudizio di LLM, SOP a più fasi</td><td>milvus-skill, zilliz-skill, memsearch</td></tr>
<tr><td><strong>API REST</strong></td><td>Integrazioni esterne</td><td>Connessione a servizi di terze parti</td><td>API GitHub, API Slack</td></tr>
<tr><td><strong>MCP HTTP</strong></td><td>Piattaforme di strumenti aziendali</td><td>Autenticazione centralizzata, registrazione degli audit</td><td>Gateway interni per gli strumenti</td></tr>
</tbody>
</table>
<h2 id="Get-Started" class="common-anchor-header">Iniziare<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>Tutto ciò di cui abbiamo parlato in questo articolo è disponibile da oggi:</p>
<ul>
<li><a href="https://github.com/zilliztech/memsearch"><strong>memsearch</strong></a> - il livello di memoria basato sulle competenze per gli agenti AI. Inseritelo in Claude Code o in qualsiasi agente che supporti le abilità.</li>
<li><a href="https://docs.zilliz.com/reference/cli/overview"><strong>Zilliz CLI</strong></a> - gestisce Milvus e Zilliz Cloud dal terminale. Installatelo ed esplorate i sottocomandi che i vostri agenti possono utilizzare.</li>
<li><a href="https://milvus.io/docs/milvus_for_agents.md"><strong>Milvus Skill</strong></a> e <a href="https://docs.zilliz.com/docs/agents/zilliz-skill"><strong>Zilliz Skill</strong></a> - per fornire al vostro agente di codifica AI le conoscenze native di Milvus e Zilliz Cloud.</li>
</ul>
<p>Avete domande sulla ricerca vettoriale, sull'architettura degli agenti o sulla costruzione con CLI e Skill? Unitevi alla <a href="https://discord.com/invite/8uyFbECzPX">comunità Milvus Discord</a> o <a href="https://milvus.io/office-hours">prenotate una sessione gratuita di Office Hours</a> per discutere del vostro caso d'uso.</p>
<p>Siete pronti a costruire? <a href="https://cloud.zilliz.com/signup">Iscriviti a Zilliz Cloud</a>: i nuovi account con un'email di lavoro riceveranno 100 dollari di crediti gratuiti. Hai già un account? <a href="https://cloud.zilliz.com/login">Accedi qui</a>.</p>
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
    </button></h2><h3 id="What-is-wrong-with-MCP-for-AI-agents" class="common-anchor-header">Cosa c'è di sbagliato nell'MCP per gli agenti AI?</h3><p>MCP ha tre principali limitazioni architettoniche in produzione. In primo luogo, carica tutti gli schemi degli strumenti nella finestra del contesto all'inizio della sessione: la connessione di soli tre server MCP su un modello da 200K token può consumare oltre il 70% del contesto disponibile prima che l'agente faccia qualcosa. In secondo luogo, gli strumenti MCP sono passivi: aspettano di essere chiamati e non possono codificare flussi di lavoro in più fasi, logica di gestione degli errori o procedure operative standard. In terzo luogo, i server MCP vengono eseguiti come processi separati senza accesso all'LLM dell'agente, per cui qualsiasi strumento che necessiti di un giudizio (come il filtraggio dei risultati di ricerca per la rilevanza) richiede la configurazione di un modello separato con una propria chiave API. Questi problemi sono più gravi con MCP su stdio; MCP su HTTP ne attenua alcuni.</p>
<h3 id="What-is-the-difference-between-MCP-and-Agent-Skills" class="common-anchor-header">Qual è la differenza tra MCP e Agent Skills?</h3><p>MCP è un protocollo di chiamata di strumenti che definisce come un agente scopre e invoca strumenti esterni. Un Agent Skill è un file Markdown contenente una procedura operativa standard completa: trigger, istruzioni passo-passo, gestione degli errori e regole di escalation. La differenza architettonica fondamentale: Le Skill vengono eseguite all'interno del processo dell'agente, in modo da poter sfruttare l'LLM dell'agente stesso per le chiamate di giudizio, come il filtraggio della rilevanza o il reranking dei risultati. Gli strumenti MCP vengono eseguiti in un processo separato e non possono accedere all'intelligenza dell'agente. Le skill utilizzano anche la divulgazione progressiva: all'avvio vengono caricati solo i metadati leggeri, mentre il contenuto completo viene caricato su richiesta, mantenendo l'utilizzo della finestra di contesto al minimo rispetto al caricamento iniziale dello schema di MCP.</p>
<h3 id="When-should-I-still-use-MCP-instead-of-CLI-or-Skills" class="common-anchor-header">Quando conviene usare MCP invece di CLI o Skills?</h3><p>MCP su HTTP ha ancora senso per le piattaforme di tooling aziendali in cui sono necessari OAuth centralizzato, controllo degli accessi basato sui ruoli, telemetria standardizzata e log di audit per molti strumenti interni. Gli strumenti CLI frammentati faticano a fornire questi requisiti aziendali in modo coerente. Per i flussi di lavoro di sviluppo locale, in cui gli agenti interagiscono con gli strumenti sul proprio computer, la CLI + Skills offre in genere prestazioni migliori, un minor overhead di contesto e una logica di flusso di lavoro più flessibile rispetto a MCP su stdio.</p>
<h3 id="How-do-CLI-tools-and-Agent-Skills-work-together" class="common-anchor-header">Come lavorano insieme gli strumenti CLI e le competenze degli agenti?</h3><p>La CLI fornisce il livello di esecuzione (i comandi veri e propri), mentre le Skill forniscono il livello di conoscenza (quando eseguire i comandi, in quale ordine e come gestire i guasti). Ad esempio, la CLI di Zilliz gestisce operazioni infrastrutturali come la gestione dei cluster, il CRUD delle collezioni e la ricerca vettoriale. Milvus Skill insegna all'agente i giusti pattern pymilvus per la progettazione di schemi, la ricerca ibrida e le pipeline RAG. La CLI fa il lavoro; la Skill conosce il flusso di lavoro. Questo modello stratificato - CLI per l'esecuzione, Skill per la conoscenza, un plugin per l'UX - è il modo in cui abbiamo strutturato tutti i nostri strumenti per sviluppatori in Zilliz.</p>
<h3 id="MCP-vs-Skills-vs-CLI-when-should-I-use-each" class="common-anchor-header">MCP vs Skills vs CLI: quando dovrei usarli?</h3><p>Gli strumenti CLI come git, docker o zilliz-cli sono migliori per le attività operative - espongono sottocomandi gerarchici e si caricano su richiesta. Competenze come milvus-skill sono migliori per la logica del flusso di lavoro dell'agente - portano procedure operative, recupero degli errori e possono accedere all'LLM dell'agente. MCP su HTTP è ancora adatto alle piattaforme di strumenti aziendali che necessitano di OAuth centralizzato, permessi e registrazioni di audit. MCP su stdio - la versione locale - è stato sostituito da CLI + Skills nella maggior parte delle configurazioni di produzione.</p>
