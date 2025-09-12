---
id: get-started-with-langgraph-up-react-a-practical-langgraph-template.md
title: 'Come iniziare con langgraph-up-react: Un modello pratico di LangGraph'
author: Min Yin
date: 2025-09-11T00:00:00.000Z
desc: >-
  introdurre langgraph-up-react, un modello LangGraph + ReAct pronto all'uso per
  gli agenti ReAct.
cover: assets.zilliz.com/Chat_GPT_Image_Sep_12_2025_12_09_04_PM_804305620a.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LangGraph, ReAct'
meta_keywords: 'Milvus, AI Agents, LangGraph, ReAct, langchain'
meta_title: |
  Getting Started with langgraph-up-react: A LangGraph Template
origin: >-
  https://milvus.io/blog/get-started-with-langgraph-up-react-a-practical-langgraph-template.md
---
<p>Gli agenti di IA stanno diventando un modello centrale nell'IA applicata. Un numero sempre maggiore di progetti sta superando i singoli prompt e sta inserendo i modelli in cicli decisionali. Questo è entusiasmante, ma comporta anche la gestione dello stato, il coordinamento degli strumenti, la gestione delle diramazioni e l'aggiunta di passaggi umani, cose che non sono immediatamente ovvie.</p>
<p><a href="https://github.com/langchain-ai/langgraph"><strong>LangGraph</strong></a> è una scelta importante per questo livello. È un framework per l'intelligenza artificiale che fornisce loop, condizionali, persistenza, controlli umani nel loop e streaming: una struttura sufficiente per trasformare un'idea in una vera applicazione multiagente. Tuttavia, LangGraph ha una curva di apprendimento ripida. La documentazione è veloce, le astrazioni richiedono tempo per abituarsi e il passaggio da una semplice demo a qualcosa che sembra un prodotto può essere frustrante.</p>
<p>Recentemente ho iniziato a usare <a href="https://github.com/webup/langgraph-up-react"><strong>langgraph-up-react, un</strong></a>modello LangGraph + ReAct pronto all'uso per gli agenti ReAct. Riduce le configurazioni, viene fornito con valori predefiniti sani e consente di concentrarsi sul comportamento invece che sul materiale di base. In questo post spiegherò come iniziare a lavorare con LangGraph utilizzando questo modello.</p>
<h2 id="Understanding-ReAct-Agents" class="common-anchor-header">Capire gli agenti ReAct<button data-href="#Understanding-ReAct-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Prima di immergerci nel template stesso, vale la pena di esaminare il tipo di agente che costruiremo. Uno dei modelli più comuni oggi è il framework <strong>ReAct (Reason + Act)</strong>, introdotto per la prima volta nel documento di Google del 2022 <em>"</em><a href="https://arxiv.org/abs/2210.03629"><em>ReAct: Synergizing Reasoning and Acting in Language Models</em></a><em>"</em><a href="https://arxiv.org/abs/2210.03629"><em>.</em></a></p>
<p>L'idea è semplice: invece di trattare il ragionamento e l'azione in modo separato, ReAct li combina in un ciclo di feedback che assomiglia molto alla risoluzione dei problemi umani. L'agente <strong>ragiona</strong> sul problema, <strong>agisce</strong> chiamando uno strumento o un'API e poi <strong>osserva</strong> il risultato prima di decidere cosa fare dopo. Questo semplice ciclo - ragionare → agire → osservare - consente agli agenti di adattarsi dinamicamente invece di seguire un copione fisso.</p>
<p>Ecco come si incastrano i pezzi:</p>
<ul>
<li><p><strong>Ragione</strong>: Il modello suddivide i problemi in fasi, pianifica le strategie e può persino correggere gli errori a metà strada.</p></li>
<li><p><strong>Agire</strong>: In base al suo ragionamento, l'agente chiama gli strumenti, siano essi un motore di ricerca, una calcolatrice o un'API personalizzata.</p></li>
<li><p><strong>Osservare</strong>: L'agente esamina il risultato dello strumento, filtra i risultati e li inserisce nel suo ragionamento successivo.</p></li>
</ul>
<p>Questo ciclo è diventato rapidamente la spina dorsale dei moderni agenti di intelligenza artificiale. Se ne trovano tracce nei plugin ChatGPT, nelle pipeline RAG, negli assistenti intelligenti e persino nella robotica. Nel nostro caso, è la base su cui si fonda il modello <code translate="no">langgraph-up-react</code>.</p>
<h2 id="Understanding-LangGraph" class="common-anchor-header">Capire LangGraph<button data-href="#Understanding-LangGraph" class="anchor-icon" translate="no">
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
    </button></h2><p>Dopo aver esaminato il modello ReAct, la domanda successiva è: come si fa a implementare qualcosa di simile nella pratica? La maggior parte dei modelli linguistici non gestisce molto bene i ragionamenti in più fasi. Ogni chiamata è stateless: il modello genera una risposta e dimentica tutto non appena ha finito. Questo rende difficile portare avanti i risultati intermedi o regolare le fasi successive sulla base di quelle precedenti.</p>
<p><a href="https://github.com/langchain-ai/langgraph"><strong>LangGraph</strong></a> colma questa lacuna. Invece di trattare ogni richiesta come una tantum, offre un modo per suddividere compiti complessi in fasi, ricordare cosa è successo in ogni punto e decidere cosa fare dopo in base allo stato attuale. In altre parole, trasforma il processo di ragionamento di un agente in qualcosa di strutturato e ripetibile, piuttosto che in una catena di richieste ad hoc.</p>
<p>Si può pensare a un <strong>diagramma di flusso per il ragionamento dell'intelligenza artificiale</strong>:</p>
<ul>
<li><p><strong>Analizzare</strong> la richiesta dell'utente</p></li>
<li><p><strong>Selezionare</strong> lo strumento giusto per il lavoro</p></li>
<li><p><strong>Eseguire</strong> il compito chiamando lo strumento</p></li>
<li><p><strong>Elaborare</strong> i risultati</p></li>
<li><p><strong>Controllare</strong> se il compito è stato completato; in caso contrario, tornare indietro e continuare il ragionamento.</p></li>
<li><p><strong>Emettere la</strong> risposta finale</p></li>
</ul>
<p>Lungo il percorso, LangGraph gestisce la <strong>memoria</strong> per non perdere i risultati delle fasi precedenti e si integra con una <strong>libreria di strumenti esterni</strong> (API, database, ricerca, calcolatori, file system, ecc.).</p>
<p>Per questo si chiama <em>LangGraph</em>: <strong>Lang (Language) + Graph, un</strong>framework per organizzare il modo in cui i modelli linguistici pensano e agiscono nel tempo.</p>
<h2 id="Understanding-langgraph-up-react" class="common-anchor-header">Capire il langgraph-up-react<button data-href="#Understanding-langgraph-up-react" class="anchor-icon" translate="no">
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
    </button></h2><p>LangGraph è potente, ma comporta dei costi aggiuntivi. L'impostazione della gestione degli stati, la progettazione di nodi e bordi, la gestione degli errori e il cablaggio di modelli e strumenti richiedono tempo. Anche il debug dei flussi a più fasi può essere doloroso: quando qualcosa si rompe, il problema potrebbe essere in qualsiasi nodo o transizione. Quando i progetti crescono, anche le piccole modifiche possono ripercuotersi sulla base di codice e rallentare tutto.</p>
<p>È qui che un modello maturo fa un'enorme differenza. Invece di partire da zero, un modello offre una struttura collaudata, strumenti precostituiti e script che funzionano. Si salta il boilerplate e ci si concentra direttamente sulla logica dell'agente.</p>
<p><a href="https://github.com/webup/langgraph-up-react"><strong>langgraph-up-react</strong></a> è uno di questi modelli. È stato progettato per aiutarvi a creare rapidamente un agente LangGraph ReAct, con:</p>
<ul>
<li><p>🔧 <strong>Ecosistema di strumenti integrato</strong>: adattatori e utility pronti all'uso</p></li>
<li><p>⚡ A <strong>vvio rapido</strong>: configurazione semplice e un agente funzionante in pochi minuti</p></li>
<li><p>🧪 <strong>Test inclusi</strong>: test unitari e test di integrazione per una maggiore sicurezza durante l'espansione</p></li>
<li><p>📦 <strong>Configurazione pronta per la produzione</strong>: modelli di architettura e script che consentono di risparmiare tempo durante il deploy.</p></li>
</ul>
<p>In breve, si occupa della documentazione di base, in modo che possiate concentrarvi sulla creazione di agenti che risolvano effettivamente i vostri problemi aziendali.</p>
<h2 id="Getting-Started-with-the-langgraph-up-react-Template" class="common-anchor-header">Come iniziare con il template langgraph-up-react<button data-href="#Getting-Started-with-the-langgraph-up-react-Template" class="anchor-icon" translate="no">
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
    </button></h2><p>Il funzionamento del template è semplice. Ecco il processo di configurazione passo per passo:</p>
<ol>
<li>Installare le dipendenze dell'ambiente</li>
</ol>
<pre><code translate="no">curl -<span class="hljs-title class_">LsSf</span> <span class="hljs-attr">https</span>:<span class="hljs-comment">//astral.sh/uv/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>Clonare il progetto</li>
</ol>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/webup/langgraph-up-react.git
<span class="hljs-built_in">cd</span> langgraph-up-react
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>Installare le dipendenze</li>
</ol>
<pre><code translate="no">uv <span class="hljs-built_in">sync</span> --dev
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>Configurare l'ambiente</li>
</ol>
<p>Copiare la configurazione di esempio e aggiungere le proprie chiavi:</p>
<pre><code translate="no"><span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p>Modificare .env e impostare almeno un fornitore di modelli e la propria chiave API Tavily:</p>
<pre><code translate="no">TAVILY_API_KEY=your-tavily-api-key      <span class="hljs-comment"># Required for web search  </span>
DASHSCOPE_API_KEY=your-dashscope-api-key  <span class="hljs-comment"># Qwen (default recommended)  </span>
OPENAI_API_KEY=your-openai-api-key        <span class="hljs-comment"># OpenAI or compatible platforms  </span>
<span class="hljs-comment"># OPENAI_API_BASE=https://your-api-endpoint  # If using OpenAI-compatible API  </span>
REGION=us                <span class="hljs-comment"># Optional: region flag  </span>
ENABLE_DEEPWIKI=true      <span class="hljs-comment"># Optional: enable document tools  </span>
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>Avviare il progetto</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># Start development server (without UI)</span>
make dev

<span class="hljs-comment"># Start development server with LangGraph Studio UI</span>
make dev_ui
<button class="copy-code-btn"></button></code></pre>
<p>Il vostro server dev sarà ora attivo e pronto per i test.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/template_set_up_a42d1819ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="What-Can-You-Build-with-langgraph-up-react" class="common-anchor-header">Cosa si può costruire con langgraph-up-react?<button data-href="#What-Can-You-Build-with-langgraph-up-react" class="anchor-icon" translate="no">
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
    </button></h2><p>Cosa si può fare una volta che il modello è attivo e funzionante? Ecco due esempi concreti che mostrano come può essere applicato in progetti reali.</p>
<h3 id="Enterprise-Knowledge-Base-QA-Agentic-RAG" class="common-anchor-header">Base di conoscenza aziendale Q&amp;A (Agentic RAG)</h3><p>Un caso d'uso comune è quello di un assistente Q&amp;A interno per le conoscenze aziendali. Pensate ai manuali dei prodotti, ai documenti tecnici, alle FAQ, alle informazioni utili ma disperse. Con <code translate="no">langgraph-up-react</code> è possibile creare un agente che indicizza questi documenti in un database vettoriale <a href="https://milvus.io/"><strong>Milvus</strong></a>, recupera i passaggi più rilevanti e genera risposte accurate e contestualizzate.</p>
<p>Per la distribuzione, Milvus offre opzioni flessibili: <strong>Lite</strong> per una rapida prototipazione, <strong>Standalone</strong> per carichi di lavoro di produzione di medie dimensioni e <strong>Distribuito</strong> per sistemi su scala aziendale. È inoltre necessario regolare i parametri dell'indice (ad esempio, HNSW) per bilanciare velocità e precisione e impostare il monitoraggio della latenza e del richiamo per garantire l'affidabilità del sistema sotto carico.</p>
<h3 id="Multi-Agent-Collaboration" class="common-anchor-header">Collaborazione tra più agenti</h3><p>Un altro potente caso d'uso è la collaborazione tra più agenti. Invece di un agente che cerca di fare tutto, si definiscono diversi agenti specializzati che lavorano insieme. In un flusso di lavoro di sviluppo software, ad esempio, un agente Product Manager analizza i requisiti, un agente Architetto redige il progetto, un agente Sviluppatore scrive il codice e un agente Test convalida i risultati.</p>
<p>Questa orchestrazione evidenzia i punti di forza di LangGraph: gestione degli stati, ramificazione e coordinamento tra gli agenti. Tratteremo questa configurazione in modo più dettagliato in un prossimo articolo, ma il punto chiave è che <code translate="no">langgraph-up-react</code> rende pratico provare questi pattern senza dover spendere settimane di scaffolding.</p>
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
    </button></h2><p>Costruire agenti affidabili non è solo una questione di suggerimenti intelligenti: si tratta di strutturare il ragionamento, gestire lo stato e collegare tutto in un sistema che si possa effettivamente mantenere. LangGraph fornisce la struttura per farlo e <code translate="no">langgraph-up-react</code> abbassa la barriera gestendo il boilerplate in modo da potersi concentrare sul comportamento dell'agente.</p>
<p>Grazie a questo modello, è possibile avviare progetti come sistemi di domande e risposte su basi di conoscenza o flussi di lavoro multi-agente senza perdersi nella configurazione. È un punto di partenza che fa risparmiare tempo, evita le insidie più comuni e rende la sperimentazione con LangGraph molto più agevole.</p>
<p>Nel prossimo post, mi addentrerò in un tutorial pratico, mostrando passo dopo passo come estendere il modello e costruire un agente funzionante per un caso d'uso reale, utilizzando LangGraph, <code translate="no">langgraph-up-react</code> e il database vettoriale Milvus. Restate sintonizzati.</p>
