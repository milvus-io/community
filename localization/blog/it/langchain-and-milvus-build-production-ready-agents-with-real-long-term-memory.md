---
id: >-
  langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md
title: >-
  LangChain 1.0 e Milvus: come costruire agenti pronti per la produzione con una
  vera memoria a lungo termine
author: Min Yin
date: 2025-12-19T00:00:00.000Z
cover: assets.zilliz.com/langchain1_0_cover_8c4bc608af.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, LangChain 1.0, AI Agent, vector database, LangGraph'
meta_title: >
  LangChain 1.0 and Milvus: Build Production-Ready AI Agents with Long-Term
  Memory
desc: >-
  Scoprite come LangChain 1.0 semplifica l'architettura degli agenti e come
  Milvus aggiunge la memoria a lungo termine per applicazioni AI scalabili e
  pronte per la produzione.
origin: >-
  https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md
---
<p>LangChain è un popolare framework open-source per lo sviluppo di applicazioni basate su grandi modelli linguistici (LLM). Fornisce un kit di strumenti modulari per la costruzione di agenti di ragionamento e di utilizzo degli strumenti, per la connessione dei modelli ai dati esterni e per la gestione dei flussi di interazione.</p>
<p>Con il rilascio di <strong>LangChain 1.0</strong>, il framework fa un passo avanti verso un'architettura più adatta alla produzione. La nuova versione sostituisce il precedente design basato sulla catena con un ciclo ReAct standardizzato (Reason → Tool Call → Observe → Decide) e introduce il Middleware per gestire l'esecuzione, il controllo e la sicurezza.</p>
<p>Tuttavia, il ragionamento da solo non è sufficiente. Gli agenti devono anche avere la capacità di memorizzare, richiamare e riutilizzare le informazioni. È qui che <a href="https://milvus.io/"><strong>Milvus</strong></a>, un database vettoriale open-source, può svolgere un ruolo essenziale. Milvus fornisce un livello di memoria scalabile e ad alte prestazioni che consente agli agenti di memorizzare, cercare e recuperare le informazioni in modo efficiente attraverso la similarità semantica.</p>
<p>In questo post esploreremo come LangChain 1.0 aggiorna l'architettura degli agenti e come l'integrazione di Milvus aiuta gli agenti ad andare oltre il ragionamento, consentendo una memoria persistente e intelligente per i casi d'uso reali.</p>
<h2 id="Why-the-Chain-based-Design-Falls-Short" class="common-anchor-header">Perché il design basato sulle catene non è all'altezza<button data-href="#Why-the-Chain-based-Design-Falls-Short" class="anchor-icon" translate="no">
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
    </button></h2><p>Agli inizi (versione 0.x), l'architettura di LangChain era incentrata sulle catene. Ogni catena definiva una sequenza fissa e veniva fornita con modelli precostituiti che rendevano l'orchestrazione di LLM semplice e veloce. Questo design era ottimo per costruire rapidamente prototipi. Ma con l'evoluzione dell'ecosistema LLM e l'aumento della complessità dei casi d'uso reali, questa architettura ha iniziato a presentare delle crepe.</p>
<p><strong>1. Mancanza di flessibilità</strong></p>
<p>Le prime versioni di LangChain fornivano pipeline modulari come SimpleSequentialChain o LLMChain, ognuna delle quali seguiva un flusso fisso e lineare: creazione del prompt → chiamata al modello → elaborazione dell'output. Questa struttura ha funzionato bene per compiti semplici e prevedibili e ha reso facile la prototipazione rapida.</p>
<p>Tuttavia, quando le applicazioni sono diventate più dinamiche, questi modelli rigidi hanno cominciato a sembrare restrittivi. Quando la logica aziendale non si adatta più perfettamente a una sequenza predefinita, ci si trova di fronte a due opzioni insoddisfacenti: forzare la logica a conformarsi al framework o aggirarlo completamente chiamando direttamente l'API LLM.</p>
<p><strong>2. Mancanza di controllo di livello produttivo</strong></p>
<p>Ciò che funzionava bene nelle demo spesso si rompeva in produzione. Le catene non includono le salvaguardie necessarie per applicazioni su larga scala, persistenti o sensibili. I problemi più comuni sono stati:</p>
<ul>
<li><p><strong>Overflow del contesto:</strong> Le conversazioni lunghe potevano superare i limiti dei token, causando crash o troncamenti silenziosi.</p></li>
<li><p><strong>Perdite di dati sensibili:</strong> Le informazioni di identificazione personale (come e-mail o ID) potrebbero essere inviate inavvertitamente a modelli di terze parti.</p></li>
<li><p><strong>Operazioni non supervisionate:</strong> Gli agenti potrebbero cancellare dati o inviare e-mail senza l'approvazione umana.</p></li>
</ul>
<p><strong>3. Mancanza di compatibilità tra modelli</strong></p>
<p>Ogni fornitore di LLM - OpenAI, Anthropic e molti modelli cinesi - implementa i propri protocolli per il ragionamento e la chiamata agli strumenti. Ogni volta che si cambia fornitore, si deve riscrivere il livello di integrazione: modelli di prompt, adattatori e parser di risposta. Questo lavoro ripetitivo rallentava lo sviluppo e rendeva dolorosa la sperimentazione.</p>
<h2 id="LangChain-10-All-in-ReAct-Agent" class="common-anchor-header">LangChain 1.0: Agente ReAct all-in<button data-href="#LangChain-10-All-in-ReAct-Agent" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando il team di LangChain ha analizzato centinaia di implementazioni di agenti in produzione, è emersa un'intuizione: quasi tutti gli agenti di successo convergevano naturalmente sul <strong>modello ReAct ("Reasoning + Acting")</strong>.</p>
<p>Che si tratti di un sistema multi-agente o di un singolo agente che esegue un ragionamento approfondito, emerge lo stesso ciclo di controllo: alternare brevi fasi di ragionamento con chiamate mirate agli strumenti, quindi alimentare le osservazioni risultanti nelle decisioni successive fino a quando l'agente può fornire una risposta finale.</p>
<p>Per basarsi su questa struttura collaudata, LangChain 1.0 pone il ciclo ReAct al centro della sua architettura, rendendolo la struttura predefinita per costruire agenti affidabili, interpretabili e pronti per la produzione.</p>
<p>Per supportare qualsiasi cosa, dagli agenti semplici alle orchestrazioni complesse, LangChain 1.0 adotta un design a strati che combina facilità d'uso e controllo preciso:</p>
<ul>
<li><p><strong>Scenari standard:</strong> Iniziare con la funzione create_agent(), un ciclo ReAct pulito e standardizzato che gestisce il ragionamento e le chiamate agli strumenti.</p></li>
<li><p><strong>Scenari estesi:</strong> Aggiungete il Middleware per ottenere un controllo a grana fine. Il middleware consente di ispezionare o modificare ciò che accade all'interno dell'agente, ad esempio aggiungendo il rilevamento di PII, i checkpoint di approvazione umana, i tentativi automatici o i ganci di monitoraggio.</p></li>
<li><p><strong>Scenari complessi:</strong> Per i flussi di lavoro statici o l'orchestrazione di più agenti, utilizzate LangGraph, un motore di esecuzione basato su grafi che fornisce un controllo preciso sul flusso logico, sulle dipendenze e sugli stati di esecuzione.</p></li>
</ul>
<p>Ora analizziamo i tre componenti chiave che rendono lo sviluppo degli agenti più semplice, sicuro e coerente tra i vari modelli.</p>
<h3 id="1-The-createagent-A-Simpler-Way-to-Build-Agents" class="common-anchor-header">1. Il metodo create_agent(): Un modo più semplice di costruire gli agenti</h3><p>Una novità fondamentale di LangChain 1.0 è la riduzione della complessità della costruzione degli agenti a un'unica funzione, create_agent(). Non è più necessario gestire manualmente la gestione dello stato, la gestione degli errori o lo streaming delle uscite. Queste caratteristiche di livello produttivo sono ora gestite automaticamente dal runtime LangGraph sottostante.</p>
<p>Con soli tre parametri, è possibile lanciare un agente completamente funzionale:</p>
<ul>
<li><p><strong>model</strong> - un identificatore di modello (stringa) o un oggetto modello istanziato.</p></li>
<li><p><strong>tools</strong> - un elenco di funzioni che danno all'agente le sue capacità.</p></li>
<li><p><strong>system_prompt</strong> - l'istruzione che definisce il ruolo, il tono e il comportamento dell'agente.</p></li>
</ul>
<p>Sotto il cofano, create_agent() esegue il ciclo standard dell'agente: chiama un modello, gli lascia scegliere gli strumenti da eseguire e termina quando non sono più necessari strumenti:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/langchain_chain_1_1192c31ce3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Inoltre, eredita le funzionalità integrate di LangGraph per la persistenza dello stato, il recupero delle interruzioni e lo streaming. Attività che un tempo richiedevano centinaia di righe di codice di orchestrazione sono ora gestite attraverso un'unica API dichiarativa.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.<span class="hljs-property">agents</span> <span class="hljs-keyword">import</span> create_agent
agent = <span class="hljs-title function_">create_agent</span>(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[get_weather, query_database],
    system_prompt=<span class="hljs-string">&quot;You are a customer service assistant who helps users check the weather and order information.&quot;</span>
)
result = agent.<span class="hljs-title function_">invoke</span>({
    <span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;What’s the weather like in Shanghai today?&quot;</span>}]
})
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-The-Middleware-A-Composable-Layer-for-Production-Ready-Control" class="common-anchor-header">2. Il middleware: Uno strato componibile per un controllo pronto per la produzione</h3><p>Il middleware è il ponte chiave che porta LangChain dal prototipo alla produzione. Espone ganci in punti strategici del ciclo di esecuzione dell'agente, consentendo di aggiungere logica personalizzata senza riscrivere il processo principale di ReAct.</p>
<p>Il ciclo principale di un agente segue un processo decisionale in tre fasi: Modello → Strumento → Terminazione:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/langchain_1_0_chain_902054bde2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>LangChain 1.0 fornisce alcuni <a href="https://docs.langchain.com/oss/python/langchain/middleware#built-in-middleware">middleware precostituiti</a> per modelli comuni. Ecco quattro esempi.</p>
<ul>
<li><strong>Rilevamento di PII: Qualsiasi applicazione che gestisce dati sensibili dell'utente</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> PIIMiddleware


agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[],  <span class="hljs-comment"># Add tools as needed</span>
    middleware=[
        <span class="hljs-comment"># Redact emails in user input</span>
        PIIMiddleware(<span class="hljs-string">&quot;email&quot;</span>, strategy=<span class="hljs-string">&quot;redact&quot;</span>, apply_to_input=<span class="hljs-literal">True</span>),
        <span class="hljs-comment"># Mask credit cards (show last 4 digits)</span>
        PIIMiddleware(<span class="hljs-string">&quot;credit_card&quot;</span>, strategy=<span class="hljs-string">&quot;mask&quot;</span>, apply_to_input=<span class="hljs-literal">True</span>),
        <span class="hljs-comment"># Custom PII type with regex</span>
        PIIMiddleware(
            <span class="hljs-string">&quot;api_key&quot;</span>,
            detector=<span class="hljs-string">r&quot;sk-[a-zA-Z0-9]{32}&quot;</span>,
            strategy=<span class="hljs-string">&quot;block&quot;</span>,  <span class="hljs-comment"># Raise error if detected</span>
        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Riassunto: Riassumere automaticamente la cronologia delle conversazioni quando si avvicinano i limiti dei token.</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> SummarizationMiddleware


agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[weather_tool, calculator_tool],
    middleware=[
        SummarizationMiddleware(
            model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>,  <span class="hljs-comment">#Summarize using a cheaper model  </span>
            max_tokens_before_summary=<span class="hljs-number">4000</span>,  <span class="hljs-comment"># Trigger summarization at 4000 tokens</span>
            messages_to_keep=<span class="hljs-number">20</span>,  <span class="hljs-comment"># Keep last 20 messages after summary</span>
        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Riproduzione dello strumento: Riproduzione automatica delle chiamate allo strumento fallite con backoff esponenziale configurabile.</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> ToolRetryMiddleware
agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[search_tool, database_tool],
    middleware=[
        ToolRetryMiddleware(
            max_retries=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Retry up to 3 times</span>
            backoff_factor=<span class="hljs-number">2.0</span>,  <span class="hljs-comment"># Exponential backoff multiplier</span>
            initial_delay=<span class="hljs-number">1.0</span>,  <span class="hljs-comment"># Start with 1 second delay</span>
            max_delay=<span class="hljs-number">60.0</span>,  <span class="hljs-comment"># Cap delays at 60 seconds</span>
            jitter=<span class="hljs-literal">True</span>,  <span class="hljs-comment"># Add random jitter to avoid thundering herd (±25%)</span>

        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>Middleware personalizzato</strong></li>
</ul>
<p>Oltre alle opzioni di middleware ufficiali e precostituite, è possibile creare middleware personalizzati utilizzando metodi basati su decoratori o classi.</p>
<p>Ad esempio, lo snippet seguente mostra come registrare le chiamate al modello prima dell'esecuzione:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> before_model
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> AgentState
<span class="hljs-keyword">from</span> langgraph.runtime <span class="hljs-keyword">import</span> Runtime
<span class="hljs-meta">@before_model</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">log_before_model</span>(<span class="hljs-params">state: AgentState, runtime: Runtime</span>) -&gt; <span class="hljs-built_in">dict</span> | <span class="hljs-literal">None</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;About to call model with <span class="hljs-subst">{<span class="hljs-built_in">len</span>(state[<span class="hljs-string">&#x27;messages&#x27;</span>])}</span> messages&quot;</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-literal">None</span>  <span class="hljs-comment"># Returning None means the normal flow continues</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[...],
    middleware=[log_before_model],
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Structured-Output-A-Standardized-Way-to-Handle-Data" class="common-anchor-header">3. Output strutturato: Un modo standardizzato di gestire i dati</h3><p>Nello sviluppo tradizionale di agenti, l'output strutturato è sempre stato difficile da gestire. Ogni fornitore di modelli lo gestisce in modo diverso: ad esempio, OpenAI offre un'API nativa per l'output strutturato, mentre altri supportano le risposte strutturate solo indirettamente, tramite chiamate a strumenti. Questo spesso significava scrivere adattatori personalizzati per ogni fornitore, aggiungendo lavoro extra e rendendo la manutenzione più dolorosa del dovuto.</p>
<p>In LangChain 1.0, l'output strutturato è gestito direttamente attraverso il parametro response_format in create_agent().  È sufficiente definire lo schema dei dati una sola volta. LangChain sceglie automaticamente la migliore strategia di applicazione in base al modello in uso, senza bisogno di ulteriori impostazioni o codice specifico del fornitore.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> pydantic <span class="hljs-keyword">import</span> BaseModel, Field
<span class="hljs-keyword">class</span> <span class="hljs-title class_">WeatherReport</span>(<span class="hljs-title class_ inherited__">BaseModel</span>):
    location: <span class="hljs-built_in">str</span> = Field(description=<span class="hljs-string">&quot;City name&quot;</span>)
    temperature: <span class="hljs-built_in">float</span> = Field(description=<span class="hljs-string">&quot;Temperature (°C)&quot;</span>)
    condition: <span class="hljs-built_in">str</span> = Field(description=<span class="hljs-string">&quot;Weather condition&quot;</span>)
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[get_weather],
    response_format=WeatherReport  <span class="hljs-comment"># Use the Pydantic model as the response schema</span>
)
result = agent.invoke({<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;What’s the weather like in Shanghai today??&quot;</span>})
weather_data = result[<span class="hljs-string">&#x27;structured_response&#x27;</span>]  <span class="hljs-comment"># Retrieve the structured response</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{weather_data.location}</span>: <span class="hljs-subst">{weather_data.temperature}</span>°C, <span class="hljs-subst">{weather_data.condition}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>LangChain supporta due strategie per l'output strutturato:</p>
<p><strong>1. Strategia del fornitore:</strong> Alcuni fornitori di modelli supportano nativamente l'output strutturato attraverso le loro API (ad esempio OpenAI e Grok). Quando tale supporto è disponibile, LangChain utilizza direttamente l'applicazione dello schema incorporato del fornitore. Questo approccio offre il massimo livello di affidabilità e coerenza, poiché il modello stesso garantisce il formato di output.</p>
<p><strong>2. Strategia di chiamata dello strumento:</strong> Per i modelli che non supportano l'output strutturato nativo, LangChain utilizza la chiamata agli strumenti per ottenere lo stesso risultato.</p>
<p>Non è necessario preoccuparsi della strategia utilizzata: il framework rileva le capacità del modello e si adatta automaticamente. Questa astrazione consente di passare liberamente da un fornitore di modelli all'altro senza modificare la logica aziendale.</p>
<h2 id="How-Milvus-Enhances-Agent-Memory" class="common-anchor-header">Come Milvus migliora la memoria degli agenti<button data-href="#How-Milvus-Enhances-Agent-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>Per gli agenti di livello produttivo, il vero collo di bottiglia delle prestazioni spesso non è il motore di ragionamento, ma il sistema di memoria. In LangChain 1.0, i database vettoriali agiscono come memoria esterna dell'agente, fornendo un richiamo a lungo termine attraverso il recupero semantico.</p>
<p><a href="https://milvus.io/">Milvus</a> è uno dei database vettoriali open-source più maturi oggi disponibili, costruito appositamente per la ricerca vettoriale su larga scala nelle applicazioni di IA. Si integra in modo nativo con LangChain, in modo da non dover gestire manualmente la vettorializzazione, la gestione degli indici o la ricerca di similarità. Il pacchetto langchain_milvus racchiude Milvus come un'interfaccia standard di VectorStore, consentendo di collegarlo ai propri agenti con poche righe di codice.</p>
<p>In questo modo, Milvus affronta tre sfide fondamentali nella costruzione di sistemi di memoria per agenti scalabili e affidabili:</p>
<h4 id="1-Fast-Retrieval-from-Massive-Knowledge-Bases" class="common-anchor-header"><strong>1. Recupero rapido da basi di conoscenza enormi</strong></h4><p>Quando un agente deve elaborare migliaia di documenti, conversazioni passate o manuali di prodotti, la semplice ricerca per parole chiave non è sufficiente. Milvus utilizza la ricerca per similarità vettoriale per trovare informazioni semanticamente rilevanti in pochi millisecondi, anche se la query utilizza parole diverse. Questo permette al vostro agente di richiamare le conoscenze in base al significato, non solo alle corrispondenze esatte del testo.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain_openai <span class="hljs-keyword">import</span> OpenAIEmbeddings
<span class="hljs-comment"># Initialize the vector database as a knowledge base</span>
vectorstore = Milvus(
    embedding=OpenAIEmbeddings(),  
    collection_name=<span class="hljs-string">&quot;company_knowledge&quot;</span>,
    connection_args={<span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;http://localhost:19530&quot;</span>}  <span class="hljs-comment">#</span>
)
<span class="hljs-comment"># Convert the retriever into a Tool for the Agent</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[vectorstore.as_retriever().as_tool(
        name=<span class="hljs-string">&quot;knowledge_search&quot;</span>,
        description=<span class="hljs-string">&quot;Search the company knowledge base to answer professional questions&quot;</span>
    )],
    system_prompt=<span class="hljs-string">&quot;You can retrieve information from the knowledge base to answer questions.&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="2-Persistent-Long-Term-Memory" class="common-anchor-header"><strong>2. Memoria persistente a lungo termine</strong></h4><p>Il riassunto di LangChain può condensare la storia della conversazione quando diventa troppo lunga, ma cosa succede a tutti i dettagli che vengono riassunti? Milvus li conserva. Ogni conversazione, chiamata allo strumento e fase di ragionamento può essere vettorializzata e archiviata per un riferimento a lungo termine. In caso di necessità, l'agente può recuperare rapidamente i ricordi pertinenti attraverso la ricerca semantica, consentendo una vera continuità tra le sessioni.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> SummarizationMiddleware
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> InMemorySaver
<span class="hljs-comment"># Long-term memory storage(Milvus)</span>
long_term_memory = Milvus.from_documents(
    documents=[],  <span class="hljs-comment"># Initially empty; dynamically updated at runtime</span>
    embedding=OpenAIEmbeddings(),
    connection_args={<span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;./agent_memory.db&quot;</span>}
)
<span class="hljs-comment"># Short-term memory management(LangGraph Checkpointer + Summarization)</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[long_term_memory.as_retriever().as_tool(
        name=<span class="hljs-string">&quot;recall_memory&quot;</span>,
        description=<span class="hljs-string">&quot;Retrieve the agent’s historical memories and past experiences&quot;</span>
    )],
    checkpointer=InMemorySaver(),  <span class="hljs-comment"># Short-term memory</span>
    middleware=[
        SummarizationMiddleware(
            model=<span class="hljs-string">&quot;openai:gpt-4o-mini&quot;</span>,
            max_tokens_before_summary=<span class="hljs-number">4000</span>  <span class="hljs-comment"># When the threshold is exceeded, summarize and store it in Milvus</span>
        )
    ]
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="3-Unified-Management-of-Multimodal-Content" class="common-anchor-header"><strong>3. Gestione unificata dei contenuti multimodali</strong></h4><p>Gli agenti moderni non gestiscono solo il testo, ma interagiscono anche con immagini, audio e video. Milvus supporta la memorizzazione multivettoriale e lo schema dinamico, consentendo di gestire le incorporazioni di più modalità in un unico sistema. Questo fornisce una base di memoria unificata per gli agenti multimodali, consentendo un recupero coerente tra i diversi tipi di dati.</p>
<pre><code translate="no"><span class="hljs-comment"># Filter retrievals by source (e.g., search only medical reports)</span>
vectorstore.similarity_search(
    query=<span class="hljs-string">&quot;What is the patient&#x27;s blood pressure reading?&quot;</span>,
    k=<span class="hljs-number">3</span>,
    expr=<span class="hljs-string">&quot;source == &#x27;medical_reports&#x27; AND modality == &#x27;text&#x27;&quot;</span>  <span class="hljs-comment"># Milvus scalar filtering</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="LangChain-vs-LangGraph-How-to-Choose-the-One-That-Fits-for-Your-Agents" class="common-anchor-header">LangChain vs. LangGraph: Come scegliere quello più adatto ai vostri agenti<button data-href="#LangChain-vs-LangGraph-How-to-Choose-the-One-That-Fits-for-Your-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>L'aggiornamento a LangChain 1.0 è un passo essenziale per la creazione di agenti di livello produttivo, ma ciò non significa che sia sempre l'unica o la migliore scelta per ogni caso d'uso. La scelta del framework giusto determina la velocità con cui è possibile combinare queste funzionalità in un sistema funzionante e manutenibile.</p>
<p>In realtà, LangChain 1.0 e LangGraph 1.0 possono essere visti come parte della stessa struttura a strati, progettati per lavorare insieme piuttosto che per sostituirsi l'un l'altro: LangChain aiuta a costruire rapidamente agenti standard, mentre LangGraph offre un controllo a grana fine per flussi di lavoro complessi. In altre parole, LangChain aiuta a muoversi velocemente, mentre LangGraph aiuta ad andare in profondità.</p>
<p>Di seguito è riportato un rapido confronto delle differenze di posizionamento tecnico:</p>
<table>
<thead>
<tr><th><strong>Dimensione</strong></th><th><strong>LangChain 1.0</strong></th><th><strong>LangChain 1.0</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Livello di astrazione</strong></td><td>Astrazione di alto livello, progettata per scenari di agenti standard</td><td>Quadro di orchestrazione di basso livello, progettato per flussi di lavoro complessi</td></tr>
<tr><td><strong>Capacità di base</strong></td><td>Ciclo ReAct standard (Motivo → Chiamata allo strumento → Osservazione → Risposta)</td><td>Macchine a stati personalizzate e logica di ramificazione complessa (StateGraph + Routing condizionale)</td></tr>
<tr><td><strong>Meccanismo di estensione</strong></td><td>Middleware per funzionalità di livello produttivo</td><td>Gestione manuale di nodi, bordi e transizioni di stato</td></tr>
<tr><td><strong>Implementazione sottostante</strong></td><td>Gestione manuale di nodi, bordi e transizioni di stato</td><td>Runtime nativo con persistenza e recupero integrati</td></tr>
<tr><td><strong>Casi d'uso tipici</strong></td><td>80% degli scenari standard degli agenti</td><td>Collaborazione tra più agenti e orchestrazione di flussi di lavoro di lunga durata</td></tr>
<tr><td><strong>Curva di apprendimento</strong></td><td>Costruire un agente in ~10 righe di codice</td><td>Richiede la comprensione dei grafi di stato e dell'orchestrazione dei nodi</td></tr>
</tbody>
</table>
<p>Se siete alle prime armi con la creazione di agenti o volete avviare rapidamente un progetto, iniziate con LangChain. Se sapete già che il vostro caso d'uso richiede un'orchestrazione complessa, una collaborazione tra più agenti o flussi di lavoro di lunga durata, passate direttamente a LangGraph.</p>
<p>Entrambi i framework possono coesistere nello stesso progetto: si può iniziare in modo semplice con LangChain e introdurre LangGraph quando il sistema ha bisogno di maggiore controllo e flessibilità. La chiave è scegliere lo strumento giusto per ogni parte del flusso di lavoro.</p>
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
    </button></h2><p>Tre anni fa, LangChain è nato come un wrapper leggero per chiamare gli LLM. Oggi si è trasformato in un framework completo e di livello produttivo.</p>
<p>Gli strati di middleware forniscono sicurezza, conformità e osservabilità. LangGraph aggiunge l'esecuzione persistente, il flusso di controllo e la gestione dello stato. E a livello di memoria, <a href="https://milvus.io/">Milvus</a> colma una lacuna critica: fornisce una memoria a lungo termine scalabile e affidabile che consente agli agenti di recuperare il contesto, ragionare sulla storia e migliorare nel tempo.</p>
<p>Insieme, LangChain, LangGraph e Milvus formano una catena di strumenti pratici per l'era moderna degli agenti, che unisce la prototipazione rapida alla distribuzione su scala aziendale, senza sacrificare l'affidabilità o le prestazioni.</p>
<p>🚀 Siete pronti a dare al vostro agente una memoria affidabile e a lungo termine? Esplorate <a href="https://milvus.io">Milvus</a> e scoprite come alimenta una memoria intelligente e a lungo termine per gli agenti LangChain in produzione.</p>
<p>Avete domande o volete un approfondimento su una qualsiasi funzione? Unitevi al nostro <a href="https://discord.com/invite/8uyFbECzPX">canale Discord</a> o inviate problemi su <a href="https://github.com/milvus-io/milvus">GitHub</a>. È anche possibile prenotare una sessione individuale di 20 minuti per ottenere approfondimenti, indicazioni e risposte alle vostre domande attraverso <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>.</p>
