---
id: clawdbot-long-running-ai-agents-langgraph-milvus.md
title: >-
  Perché Clawdbot è diventato virale - e come costruire agenti di lunga durata
  pronti per la produzione con LangGraph e Milvus
author: Min Yin
date: 2026-02-03T00:00:00.000Z
cover: >-
  assets.zilliz.com/Clawdbot_Long_Running_Agents_with_Lang_Graph_and_Milvus_62dab00205.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'AI Agent, Langgraph, Milvus, vector database, Clawdbot'
meta_keywords: 'Clawdbot, LangGraph, Milvus, AI Agents, Openclaw'
meta_title: |
  Build Clawdbot-Style AI Agents with LangGraph & Milvus
desc: >-
  Clawdbot ha dimostrato che le persone vogliono un'intelligenza artificiale che
  agisca. Imparate a costruire agenti di lunga durata pronti per la produzione
  con l'architettura a due agenti, Milvus e LangGraph.
origin: 'https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md'
---
<h2 id="Clawdbot-now-OpenClaw-went-viral" class="common-anchor-header">Clawdbot (ora OpenClaw) è diventato virale<button data-href="#Clawdbot-now-OpenClaw-went-viral" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/openclaw_screenshot_two_agents_p1_9bf856b499.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://openclaw.ai/">Clawdbot</a>, ora ribattezzato OpenClaw, ha fatto il giro di Internet la scorsa settimana. L'assistente AI open-source costruito da Peter Steinberger ha raggiunto le <a href="https://github.com/openclaw/openclaw">110.000 stelle GitHub</a> in pochi giorni. Gli utenti hanno postato video in cui l'assistente effettuava autonomamente il check-in dei voli, gestiva le e-mail e controllava i dispositivi della casa intelligente. Andrej Karpathy, ingegnere fondatore di OpenAI, ne ha tessuto le lodi. David Sacks, fondatore e investitore di Tech, ne ha parlato su Twitter. La gente lo ha definito "Jarvis, ma reale".</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/David_Stacks_replace_NYC_with_Mac_and_clawdbot_two_agent_p2_2f62f6ad49.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Poi sono arrivati gli avvertimenti sulla sicurezza.</p>
<p>I ricercatori hanno trovato centinaia di pannelli di amministrazione esposti. Il bot funziona con accesso root per impostazione predefinita. Non c'è sandboxing. Le vulnerabilità di iniezione del prompt potrebbero consentire agli aggressori di dirottare l'agente. Un incubo per la sicurezza.</p>
<h2 id="Clawdbot-went-viral-for-a-reason" class="common-anchor-header">Clawdbot è diventato virale per un motivo<button data-href="#Clawdbot-went-viral-for-a-reason" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Clawdbot è diventato virale per un motivo.</strong> Viene eseguito localmente o sul proprio server. Si collega alle app di messaggistica che le persone già utilizzano: WhatsApp, Slack, Telegram, iMessage. Ricorda il contesto nel tempo invece di dimenticare tutto dopo ogni risposta. Gestisce i calendari, riassume le e-mail e automatizza le attività tra le varie app.</p>
<p>Gli utenti hanno la sensazione di un'intelligenza artificiale personale, sempre attiva, non solo di uno strumento di risposta immediata. Il suo modello open-source e self-hosted piace agli sviluppatori che desiderano controllo e personalizzazione. Inoltre, la facilità di integrazione con i flussi di lavoro esistenti ne facilita la condivisione e la raccomandazione.</p>
<h2 id="Two-challenges-for-building-long-running-agents" class="common-anchor-header">Due sfide per la creazione di agenti di lunga durata<button data-href="#Two-challenges-for-building-long-running-agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>La popolarità di Clawdbot dimostra che le persone vogliono un'intelligenza artificiale che</strong> <em>agisca</em><strong>, non solo che risponda.</strong> Ma qualsiasi agente che funzioni per lunghi periodi e porti a termine compiti reali, sia che si tratti di Clawdbot o di qualcosa che si costruisce da soli, deve risolvere due problemi tecnici: la <strong>memoria</strong> e la <strong>verifica</strong>.</p>
<p><strong>Il problema della memoria</strong> si manifesta in diversi modi:</p>
<ul>
<li><p>Gli agenti esauriscono la loro finestra di contesto nel bel mezzo di un'attività e si lasciano dietro un lavoro incompleto.</p></li>
<li><p>perdono di vista l'elenco completo dei compiti e dichiarano "finito" troppo presto</p></li>
<li><p>Non possono passare il contesto tra una sessione e l'altra, quindi ogni nuova sessione inizia da zero.</p></li>
</ul>
<p>Tutti questi problemi hanno la stessa origine: gli agenti non hanno una memoria persistente. Le finestre di contesto sono limitate, il recupero tra le sessioni è limitato e i progressi non sono tracciati in modo accessibile agli agenti.</p>
<p><strong>Il problema della verifica</strong> è diverso. Anche quando la memoria funziona, gli agenti segnano i compiti come completati dopo un rapido test dell'unità, senza verificare se la funzione funziona effettivamente da un capo all'altro.</p>
<p>Clawdbot affronta entrambi i problemi. Memorizza la memoria localmente tra le sessioni e utilizza "abilità" modulari per automatizzare browser, file e servizi esterni. L'approccio funziona. Ma non è pronto per la produzione. Per l'uso aziendale, occorrono struttura, verificabilità e sicurezza che Clawdbot non è in grado di fornire.</p>
<p>Questo articolo affronta gli stessi problemi delle soluzioni pronte per la produzione.</p>
<p>Per la memoria, utilizziamo un'<strong>architettura a due agenti</strong> basata sulla <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">ricerca di Anthropic</a>: un agente inizializzatore che suddivide i progetti in caratteristiche verificabili e un agente di codifica che li elabora uno alla volta con passaggi puliti. Per il richiamo semantico tra le sessioni, utilizziamo <a href="https://milvus.io/">Milvus</a>, un database vettoriale che consente agli agenti di effettuare ricerche in base al significato, non alle parole chiave.</p>
<p>Per la verifica, utilizziamo l'<strong>automazione del browser</strong>. Invece di affidarsi ai test unitari, l'agente testa le funzionalità come farebbe un utente reale.</p>
<p>Illustreremo i concetti e mostreremo un'implementazione funzionante utilizzando <a href="https://github.com/langchain-ai/langgraph">LangGraph</a> e Milvus.</p>
<h2 id="How-the-Two-Agent-Architecture-Prevents-Context-Exhaustion" class="common-anchor-header">Come l'architettura a due agenti previene l'esaurimento del contesto<button data-href="#How-the-Two-Agent-Architecture-Prevents-Context-Exhaustion" class="anchor-icon" translate="no">
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
    </button></h2><p>Ogni LLM ha una finestra di contesto: un limite alla quantità di testo che può elaborare contemporaneamente. Quando un agente lavora su un compito complesso, questa finestra si riempie di codice, messaggi di errore, cronologia delle conversazioni e documentazione. Quando la finestra è piena, l'agente si ferma o inizia a dimenticare il contesto precedente. Per le attività di lunga durata, questo è inevitabile.</p>
<p>Si consideri un agente che riceve una semplice richiesta: "Costruisci un clone di claude.ai". Il progetto richiede autenticazione, interfacce di chat, cronologia delle conversazioni, risposte in streaming e decine di altre funzionalità. Un singolo agente cercherà di affrontare tutto in una volta. A metà dell'implementazione dell'interfaccia di chat, la finestra di contesto si riempie. La sessione termina con codice scritto a metà, nessuna documentazione di ciò che è stato tentato e nessuna indicazione di ciò che funziona e di ciò che non funziona. La sessione successiva eredita un pasticcio. Anche con la compattazione del contesto, il nuovo agente deve indovinare cosa stava facendo la sessione precedente, eseguire il debug del codice che non ha scritto e capire dove riprendere. Si perdono ore prima di fare qualsiasi progresso.</p>
<h3 id="The-Two-Fold-Agent-Solution" class="common-anchor-header">La soluzione a due agenti</h3><p>La soluzione di Anthropic, descritta nel post <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">"Effective harnesses for long-running agents",</a> consiste nell'utilizzare due diverse modalità di prompt: <strong>un prompt di inizializzazione</strong> per la prima sessione e <strong>un prompt di codifica</strong> per le sessioni successive.</p>
<p>Tecnicamente, entrambe le modalità utilizzano lo stesso agente sottostante, lo stesso prompt di sistema, gli stessi strumenti e lo stesso harness. L'unica differenza è il prompt iniziale dell'utente. Tuttavia, poiché svolgono ruoli distinti, è utile pensare a due agenti separati. Questa è l'architettura a due agenti.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/two_agent_p3_f9dd23fed9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>L'inizializzatore imposta l'ambiente per un progresso incrementale.</strong> Prende una richiesta vaga e fa tre cose:</p>
<ul>
<li><p><strong>Suddivide il progetto in caratteristiche specifiche e verificabili.</strong> Non requisiti vaghi come "creare un'interfaccia di chat", ma passi concreti e testabili: "l'utente fa clic sul pulsante Nuova chat → la nuova conversazione appare nella barra laterale → l'area della chat mostra lo stato di benvenuto". L'esempio del clone claude.ai di Anthropic aveva oltre 200 funzioni di questo tipo.</p></li>
<li><p><strong>Crea un file di monitoraggio dei progressi.</strong> Questo file registra lo stato di completamento di ogni funzionalità, in modo che ogni sessione possa vedere cosa è stato fatto e cosa rimane.</p></li>
<li><p><strong>Scrive gli script di configurazione e fa un commit git iniziale.</strong> Gli script come <code translate="no">init.sh</code> consentono alle sessioni future di avviare rapidamente l'ambiente di sviluppo. Il commit git stabilisce una linea di base pulita.</p></li>
</ul>
<p>L'inizializzatore non si limita a pianificare. Crea un'infrastruttura che consente alle sessioni future di iniziare a lavorare immediatamente.</p>
<p><strong>L'agente di codifica</strong> gestisce ogni sessione successiva. Esso:</p>
<ul>
<li><p>Legge il file di avanzamento e i log di git per capire lo stato attuale.</p></li>
<li><p>Esegue un test end-to-end di base per confermare che l'applicazione funziona ancora.</p></li>
<li><p>Sceglie una funzionalità su cui lavorare</p></li>
<li><p>Implementa la funzionalità, la testa accuratamente, effettua il commit su git con un messaggio descrittivo e aggiorna il file di avanzamento.</p></li>
</ul>
<p>Quando la sessione termina, la base di codice è in uno stato mergeable: nessun bug importante, codice ordinato, documentazione chiara. Non c'è lavoro a metà e non c'è alcun mistero su ciò che è stato fatto. La sessione successiva riprende esattamente da dove si è interrotta quella precedente.</p>
<h3 id="Use-JSON-for-Feature-Tracking-Not-Markdown" class="common-anchor-header">Usare JSON per la tracciabilità delle caratteristiche, non Markdown</h3><p><strong>Un dettaglio di implementazione degno di nota: l'elenco delle funzionalità deve essere JSON, non Markdown.</strong></p>
<p>Quando si modifica JSON, i modelli AI tendono a modificare chirurgicamente campi specifici. Quando modificano Markdown, spesso riscrivono intere sezioni. Con un elenco di oltre 200 funzionalità, le modifiche in Markdown possono danneggiare accidentalmente il monitoraggio dei progressi.</p>
<p>Una voce JSON ha questo aspetto:</p>
<pre><code translate="no">json
{
  <span class="hljs-string">&quot;category&quot;</span>: <span class="hljs-string">&quot;functional&quot;</span>,
  <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;New chat button creates a fresh conversation&quot;</span>,
  <span class="hljs-string">&quot;steps&quot;</span>: [
    <span class="hljs-string">&quot;Navigate to main interface&quot;</span>,
    <span class="hljs-string">&quot;Click the &#x27;New Chat&#x27; button&quot;</span>,
    <span class="hljs-string">&quot;Verify a new conversation is created&quot;</span>,
    <span class="hljs-string">&quot;Check that chat area shows welcome state&quot;</span>,
    <span class="hljs-string">&quot;Verify conversation appears in sidebar&quot;</span>
  ],
  <span class="hljs-string">&quot;passes&quot;</span>: <span class="hljs-literal">false</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>Ogni caratteristica ha fasi di verifica chiare. Il campo <code translate="no">passes</code> tiene traccia del completamento. Per evitare che l'agente giochi con il sistema eliminando le funzioni più difficili, si raccomanda anche di scrivere in modo deciso istruzioni come "È inaccettabile rimuovere o modificare i test, perché ciò potrebbe portare a funzionalità mancanti o difettose".</p>
<h2 id="How-Milvus-Gives-Agents-Semantic-Memory-Across-Sessions" class="common-anchor-header">Come Milvus fornisce agli agenti una memoria semantica attraverso le sessioni<button data-href="#How-Milvus-Gives-Agents-Semantic-Memory-Across-Sessions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>L'architettura a due agenti risolve l'esaurimento del contesto, ma non risolve la dimenticanza.</strong> Anche con passaggi puliti tra le sessioni, l'agente perde traccia di ciò che ha imparato. Non può ricordare che "i token di aggiornamento JWT" sono collegati all'"autenticazione dell'utente", a meno che queste parole esatte non compaiano nel file di avanzamento. Quando il progetto cresce, la ricerca tra centinaia di commit git diventa lenta. La corrispondenza tra le parole chiave non permette di individuare le connessioni che sarebbero ovvie per un essere umano.</p>
<p><strong>È qui che entrano in gioco i database vettoriali.</strong> Invece di memorizzare il testo e cercare le parole chiave, un database vettoriale converte il testo in rappresentazioni numeriche del significato. Quando si cerca "autenticazione utente", si trovano voci su "token di aggiornamento JWT" e "gestione della sessione di login". Non perché le parole corrispondano, ma perché i concetti sono semanticamente vicini. L'agente può chiedere "ho già visto qualcosa di simile?" e ottenere una risposta utile.</p>
<p><strong>In pratica, questo funziona incorporando i record di avanzamento e i commit di git nel database come vettori.</strong> Quando inizia una sessione di codifica, l'agente interroga il database con il suo compito corrente. Il database restituisce la cronologia rilevante in millisecondi: cosa è stato provato in precedenza, cosa ha funzionato, cosa è fallito. L'agente non parte da zero. Inizia con il contesto.</p>
<p><a href="https://milvus.io/"><strong>Milvus</strong></a> <strong>è adatto a questo caso d'uso.</strong> È open source e progettato per la ricerca vettoriale su scala di produzione, in grado di gestire miliardi di vettori senza sudare. Per progetti più piccoli o per lo sviluppo locale, <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> può essere integrato direttamente in un'applicazione come SQLite. Non è necessaria la configurazione di un cluster. Quando il progetto cresce, è possibile migrare a Milvus distribuito senza modificare il codice. Per la generazione di incorporazioni, è possibile utilizzare modelli esterni come <a href="https://www.sbert.net/">SentenceTransformer</a> per un controllo a grana fine, oppure fare riferimento alle <a href="https://milvus.io/docs/embeddings.md">funzioni di incorporamento integrate</a> per configurazioni più semplici. Milvus supporta anche la <a href="https://milvus.io/docs/hybridsearch.md">ricerca ibrida</a>, combinando la similarità vettoriale con il filtraggio tradizionale, in modo da poter chiedere "trova problemi di autenticazione simili dell'ultima settimana" con un'unica chiamata.</p>
<p><strong>Questo risolve anche il problema del trasferimento.</strong> Il database dei vettori persiste al di fuori di ogni singola sessione, quindi le conoscenze si accumulano nel tempo. La sessione 50 ha accesso a tutto ciò che è stato appreso nelle sessioni dalla 1 alla 49. Il progetto sviluppa una memoria istituzionale.</p>
<h2 id="Verifying-Completion-with-Automated-Testing" class="common-anchor-header">Verifica del completamento con test automatici<button data-href="#Verifying-Completion-with-Automated-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Anche con l'architettura a due agenti e la memoria a lungo termine, gli agenti possono dichiarare la vittoria troppo presto. Questo è il problema della verifica.</strong></p>
<p>Ecco una modalità di fallimento comune: Una sessione di codifica termina una funzione, esegue un rapido test unitario, lo vede passare e gira <code translate="no">&quot;passes&quot;: false</code> su <code translate="no">&quot;passes&quot;: true</code>. Ma il superamento del test unitario non significa che la funzione funzioni davvero. L'API potrebbe restituire dati corretti mentre l'interfaccia utente non visualizza nulla a causa di un bug dei CSS. Il file di avanzamento dice "completo", mentre gli utenti non vedono nulla.</p>
<p><strong>La soluzione è fare in modo che l'agente esegua i test come un utente reale.</strong> Ogni funzione dell'elenco delle funzioni ha delle fasi di verifica concrete: "l'utente fa clic sul pulsante Nuova chat → la nuova conversazione appare nella barra laterale → l'area della chat mostra lo stato di benvenuto". L'agente deve verificare questi passaggi alla lettera. Invece di eseguire solo test a livello di codice, utilizza strumenti di automazione del browser come Puppeteer per simulare l'uso effettivo. Apre la pagina, clicca sui pulsanti, compila i moduli e controlla che sullo schermo appaiano gli elementi giusti. Solo quando l'intero flusso viene superato, l'agente contrassegna il completamento della funzione.</p>
<p><strong>In questo modo si possono individuare i problemi che i test unitari non rilevano</strong>. Una funzione di chat può avere una logica di backend perfetta e risposte API corrette. Ma se il frontend non rende la risposta, gli utenti non vedono nulla. L'automazione del browser può fare uno screenshot del risultato e verificare che ciò che appare sullo schermo corrisponda a ciò che dovrebbe apparire. Il campo <code translate="no">passes</code> diventa <code translate="no">true</code> solo quando la funzione funziona davvero end-to-end.</p>
<p><strong>Esistono tuttavia delle limitazioni.</strong> Alcune funzioni native del browser non possono essere automatizzate da strumenti come Puppeteer. I selezionatori di file e le finestre di conferma del sistema sono esempi comuni. <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">Anthropic ha notato</a> che le funzionalità che si basano su modali di avviso nativi del browser tendono a essere più difettose perché l'agente non può vederle attraverso Puppeteer. La soluzione pratica consiste nel progettare intorno a queste limitazioni. Usare componenti dell'interfaccia utente personalizzati invece di finestre di dialogo native, quando possibile, in modo che l'agente possa testare ogni fase di verifica nell'elenco delle funzionalità.</p>
<h2 id="Putting-It-Together-LangGraph-for-Session-State-Milvus-for-Long-Term-Memory" class="common-anchor-header">Mettere tutto insieme: LangGraph per lo stato di sessione, Milvus per la memoria a lungo termine<button data-href="#Putting-It-Together-LangGraph-for-Session-State-Milvus-for-Long-Term-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>I concetti di cui sopra confluiscono in un sistema funzionante grazie a due strumenti: LangGraph per lo stato di sessione e Milvus per la memoria a lungo termine.</strong> LangGraph gestisce ciò che accade all'interno di una singola sessione: quale funzione è in corso di lavorazione, cosa è stato completato, cosa è in programma. Milvus memorizza la cronologia delle sessioni: cosa è stato fatto prima, quali problemi sono stati incontrati e quali soluzioni hanno funzionato. Insieme, forniscono agli agenti una memoria a breve e a lungo termine.</p>
<p><strong>Una nota su questa implementazione:</strong> Il codice che segue è una dimostrazione semplificata. Mostra gli schemi principali in un singolo script, ma non replica completamente la separazione delle sessioni descritta in precedenza. In una configurazione di produzione, ogni sessione di codifica sarebbe un'invocazione separata, potenzialmente su macchine diverse o in momenti diversi. I servizi <code translate="no">MemorySaver</code> e <code translate="no">thread_id</code> di LangGraph consentono di mantenere lo stato tra un'invocazione e l'altra. Per vedere chiaramente il comportamento di ripresa, si esegue lo script una volta, lo si interrompe e poi lo si esegue di nuovo con lo stesso <code translate="no">thread_id</code>. La seconda esecuzione riprende da dove si era interrotta la prima.</p>
<p>Python</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sentence_transformers <span class="hljs-keyword">import</span> SentenceTransformer
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> MemorySaver
<span class="hljs-keyword">from</span> langgraph.graph <span class="hljs-keyword">import</span> StateGraph, START, END
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> TypedDict, Annotated
<span class="hljs-keyword">import</span> operator
<span class="hljs-keyword">import</span> subprocess
<span class="hljs-keyword">import</span> json

<span class="hljs-comment"># ==================== Initialization ====================</span>
embedding_model = SentenceTransformer(<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>)
milvus_client = MilvusClient(<span class="hljs-string">&quot;./milvus_agent_memory.db&quot;</span>)

<span class="hljs-comment"># Create collection</span>
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> milvus_client.has_collection(<span class="hljs-string">&quot;agent_history&quot;</span>):
    milvus_client.create_collection(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        dimension=<span class="hljs-number">384</span>,
        auto_id=<span class="hljs-literal">True</span>
    )

<span class="hljs-comment"># ==================== Milvus Operations ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">retrieve_context</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">3</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Retrieve relevant history from Milvus (core element: semantic retrieval)&quot;&quot;&quot;</span>
    query_vec = embedding_model.encode(query).tolist()
    results = milvus_client.search(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        data=[query_vec],
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;content&quot;</span>]
    )
    <span class="hljs-keyword">if</span> results <span class="hljs-keyword">and</span> results[<span class="hljs-number">0</span>]:
        <span class="hljs-keyword">return</span> [hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;content&quot;</span>] <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]
    <span class="hljs-keyword">return</span> []

<span class="hljs-keyword">def</span> <span class="hljs-title function_">save_progress</span>(<span class="hljs-params">content: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Save progress to Milvus (long-term memory)&quot;&quot;&quot;</span>
    embedding = embedding_model.encode(content).tolist()
    milvus_client.insert(
        collection_name=<span class="hljs-string">&quot;agent_history&quot;</span>,
        data=[{<span class="hljs-string">&quot;vector&quot;</span>: embedding, <span class="hljs-string">&quot;content&quot;</span>: content}]
    )

<span class="hljs-comment"># ==================== Core Element 1: Git Commit ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">git_commit</span>(<span class="hljs-params">message: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Git commit (core element from the article)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># In a real project, actual Git commands would be executed</span>
        <span class="hljs-comment"># subprocess.run([&quot;git&quot;, &quot;add&quot;, &quot;.&quot;], check=True)</span>
        <span class="hljs-comment"># subprocess.run([&quot;git&quot;, &quot;commit&quot;, &quot;-m&quot;, message], check=True)</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Git Commit] <span class="hljs-subst">{message}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">True</span>
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Git Commit Failed] <span class="hljs-subst">{e}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>

<span class="hljs-comment"># ==================== Core Element 2: Test Verification ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">run_tests</span>(<span class="hljs-params">feature: <span class="hljs-built_in">str</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Run tests (end-to-end testing emphasized in the article)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">try</span>:
        <span class="hljs-comment"># In a real project, testing tools like Puppeteer would be called</span>
        <span class="hljs-comment"># Simplified to simulated testing here</span>
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Verification] Testing feature: <span class="hljs-subst">{feature}</span>&quot;</span>)
        <span class="hljs-comment"># Simulated test result</span>
        test_passed = <span class="hljs-literal">True</span>  <span class="hljs-comment"># In practice, this would return actual test results</span>
        <span class="hljs-keyword">if</span> test_passed:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Passed] <span class="hljs-subst">{feature}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> test_passed
    <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Test Failed] <span class="hljs-subst">{e}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-literal">False</span>

<span class="hljs-comment"># ==================== State Definition ====================</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">AgentState</span>(<span class="hljs-title class_ inherited__">TypedDict</span>):
    messages: Annotated[<span class="hljs-built_in">list</span>, operator.add]
    features: <span class="hljs-built_in">list</span>  <span class="hljs-comment"># All features list</span>
    completed_features: <span class="hljs-built_in">list</span>  <span class="hljs-comment"># Completed features</span>
    current_feature: <span class="hljs-built_in">str</span>  <span class="hljs-comment"># Currently processing feature</span>
    session_count: <span class="hljs-built_in">int</span>  <span class="hljs-comment"># Session counter</span>

<span class="hljs-comment"># ==================== Two-Agent Nodes ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">initialize_node</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Initializer Agent: Generate feature list and set up work environment&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n========== Initializer Agent Started ==========&quot;</span>)
    
    <span class="hljs-comment"># Generate feature list (in practice, a detailed feature list would be generated based on requirements)</span>
    features = [
        <span class="hljs-string">&quot;Implement user registration&quot;</span>,
        <span class="hljs-string">&quot;Implement user login&quot;</span>,
        <span class="hljs-string">&quot;Implement password reset&quot;</span>,
        <span class="hljs-string">&quot;Implement user profile editing&quot;</span>,
        <span class="hljs-string">&quot;Implement session management&quot;</span>
    ]
    
    <span class="hljs-comment"># Save initialization info to Milvus</span>
    init_summary = <span class="hljs-string">f&quot;Project initialized with <span class="hljs-subst">{<span class="hljs-built_in">len</span>(features)}</span> features&quot;</span>
    save_progress(init_summary)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Initialization Complete] Feature list: <span class="hljs-subst">{features}</span>&quot;</span>)
    
    <span class="hljs-keyword">return</span> {
        **state,
        <span class="hljs-string">&quot;features&quot;</span>: features,
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: features[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> features <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>,
        <span class="hljs-string">&quot;messages&quot;</span>: [init_summary]
    }

<span class="hljs-keyword">def</span> <span class="hljs-title function_">code_node</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Coding Agent: Implement, test, commit (core loop node)&quot;&quot;&quot;</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n========== Coding Agent Session #<span class="hljs-subst">{state[<span class="hljs-string">&#x27;session_count&#x27;</span>] + <span class="hljs-number">1</span>}</span> ==========&quot;</span>)
    
    current_feature = state[<span class="hljs-string">&quot;current_feature&quot;</span>]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Current Task] <span class="hljs-subst">{current_feature}</span>&quot;</span>)
    
    <span class="hljs-comment"># ===== Core Element 3: Retrieve history from Milvus (cross-session memory) =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Retrieving History] Querying experiences related to &#x27;<span class="hljs-subst">{current_feature}</span>&#x27;...&quot;</span>)
    context = retrieve_context(current_feature)
    <span class="hljs-keyword">if</span> context:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Retrieval Results] Found <span class="hljs-subst">{<span class="hljs-built_in">len</span>(context)}</span> relevant records:&quot;</span>)
        <span class="hljs-keyword">for</span> i, ctx <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(context, <span class="hljs-number">1</span>):
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  <span class="hljs-subst">{i}</span>. <span class="hljs-subst">{ctx[:<span class="hljs-number">60</span>]}</span>...&quot;</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[Retrieval Results] No relevant history (first time implementing this type of feature)&quot;</span>)
    
    <span class="hljs-comment"># ===== Step 1: Implement feature =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Starting Implementation] <span class="hljs-subst">{current_feature}</span>&quot;</span>)
    <span class="hljs-comment"># In practice, an LLM would be called to generate code</span>
    implementation_result = <span class="hljs-string">f&quot;Implemented feature: <span class="hljs-subst">{current_feature}</span>&quot;</span>
    
    <span class="hljs-comment"># ===== Step 2: Test verification (core element) =====</span>
    test_passed = run_tests(current_feature)
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> test_passed:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Session End] Tests did not pass, fixes needed&quot;</span>)
        <span class="hljs-keyword">return</span> state  <span class="hljs-comment"># Don&#x27;t proceed if tests fail</span>
    
    <span class="hljs-comment"># ===== Step 3: Git commit (core element) =====</span>
    commit_message = <span class="hljs-string">f&quot;feat: <span class="hljs-subst">{current_feature}</span>&quot;</span>
    git_commit(commit_message)
    
    <span class="hljs-comment"># ===== Step 4: Update progress file =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Updating Progress] Marking feature as complete&quot;</span>)
    
    <span class="hljs-comment"># ===== Step 5: Save to Milvus long-term memory =====</span>
    progress_record = <span class="hljs-string">f&quot;Completed feature: <span class="hljs-subst">{current_feature}</span> | Commit message: <span class="hljs-subst">{commit_message}</span> | Test status: passed&quot;</span>
    save_progress(progress_record)
    
    <span class="hljs-comment"># ===== Step 6: Update state and prepare for next feature =====</span>
    new_completed = state[<span class="hljs-string">&quot;completed_features&quot;</span>] + [current_feature]
    remaining_features = [f <span class="hljs-keyword">for</span> f <span class="hljs-keyword">in</span> state[<span class="hljs-string">&quot;features&quot;</span>] <span class="hljs-keyword">if</span> f <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> new_completed]
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Progress] Completed: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(new_completed)}</span>/<span class="hljs-subst">{<span class="hljs-built_in">len</span>(state[<span class="hljs-string">&#x27;features&#x27;</span>])}</span>&quot;</span>)
    <span class="hljs-comment"># ===== Core Element 4: Session end (clear session boundary) =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[Session End] Codebase is in clean state, safe to interrupt\n&quot;</span>)
    
    <span class="hljs-keyword">return</span> {
        **state,
        <span class="hljs-string">&quot;completed_features&quot;</span>: new_completed,
        <span class="hljs-string">&quot;current_feature&quot;</span>: remaining_features[<span class="hljs-number">0</span>] <span class="hljs-keyword">if</span> remaining_features <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: state[<span class="hljs-string">&quot;session_count&quot;</span>] + <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;messages&quot;</span>: [implementation_result]
    }

<span class="hljs-comment"># ==================== Core Element 3: Loop Control ====================</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">should_continue</span>(<span class="hljs-params">state: AgentState</span>):
    <span class="hljs-string">&quot;&quot;&quot;Determine whether to continue to next feature (incremental loop development)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> state[<span class="hljs-string">&quot;current_feature&quot;</span>] <span class="hljs-keyword">and</span> state[<span class="hljs-string">&quot;current_feature&quot;</span>] != <span class="hljs-string">&quot;&quot;</span>:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;code&quot;</span>  <span class="hljs-comment"># Continue to next feature</span>
    <span class="hljs-keyword">else</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n========== All Features Complete ==========&quot;</span>)
        <span class="hljs-keyword">return</span> END

<span class="hljs-comment"># ==================== Build Workflow ====================</span>
workflow = StateGraph(AgentState)

<span class="hljs-comment"># Add nodes</span>
workflow.add_node(<span class="hljs-string">&quot;initialize&quot;</span>, initialize_node)
workflow.add_node(<span class="hljs-string">&quot;code&quot;</span>, code_node)

<span class="hljs-comment"># Add edges</span>
workflow.add_edge(START, <span class="hljs-string">&quot;initialize&quot;</span>)
workflow.add_edge(<span class="hljs-string">&quot;initialize&quot;</span>, <span class="hljs-string">&quot;code&quot;</span>)

<span class="hljs-comment"># Add conditional edges (implement loop)</span>
workflow.add_conditional_edges(
    <span class="hljs-string">&quot;code&quot;</span>,
    should_continue,
    {
        <span class="hljs-string">&quot;code&quot;</span>: <span class="hljs-string">&quot;code&quot;</span>,  <span class="hljs-comment"># Continue loop</span>
        END: END  <span class="hljs-comment"># End</span>
    }
)

<span class="hljs-comment"># Compile workflow (using MemorySaver as checkpointer)</span>
app = workflow.<span class="hljs-built_in">compile</span>(checkpointer=MemorySaver())

<span class="hljs-comment"># ==================== Usage Example: Demonstrating Cross-Session Recovery ====================</span>
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Demo Scenario: Multi-Session Development for Long-Running Agents&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    
    <span class="hljs-comment"># ===== Session 1: Initialize + complete first 2 features =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n[Scenario 1] First launch: Complete first 2 features&quot;</span>)
    config = {<span class="hljs-string">&quot;configurable&quot;</span>: {<span class="hljs-string">&quot;thread_id&quot;</span>: <span class="hljs-string">&quot;project_001&quot;</span>}}
    
    result = app.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [],
        <span class="hljs-string">&quot;features&quot;</span>: [],
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>
    }, config)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;[Simulated Scenario] Developer manually interrupts (Ctrl+C) or context window exhausted&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    
    <span class="hljs-comment"># ===== Session 2: Restore state from checkpoint =====</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n[Scenario 2] New session starts: Continue from last interruption&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Using the same thread_id, LangGraph automatically restores from checkpoint...&quot;</span>)
    
    <span class="hljs-comment"># Using the same thread_id, LangGraph will automatically restore state from checkpoint</span>
    result = app.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [],
        <span class="hljs-string">&quot;features&quot;</span>: [],
        <span class="hljs-string">&quot;completed_features&quot;</span>: [],
        <span class="hljs-string">&quot;current_feature&quot;</span>: <span class="hljs-string">&quot;&quot;</span>,
        <span class="hljs-string">&quot;session_count&quot;</span>: <span class="hljs-number">0</span>
    }, config)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n&quot;</span> + <span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Demo Complete!&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=&quot;</span> * <span class="hljs-number">60</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nKey Takeaways:&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;1. ✅ Two-Agent Architecture (initialize + code)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;2. ✅ Incremental Loop Development (conditional edges control loop)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;3. ✅ Git Commits (commit after each feature)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;4. ✅ Test Verification (end-to-end testing)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;5. ✅ Session Management (clear session boundaries)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;6. ✅ Cross-Session Recovery (thread_id + checkpoint)&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;7. ✅ Semantic Retrieval (Milvus long-term memory)&quot;</span>)
  

**The key insight <span class="hljs-keyword">is</span> <span class="hljs-keyword">in</span> the last part.** By using the same `thread_id`, LangGraph automatically restores the checkpoint <span class="hljs-keyword">from</span> the previous session. Session <span class="hljs-number">2</span> picks up exactly where session <span class="hljs-number">1</span> stopped — no manual state transfer, no lost progress.

<button class="copy-code-btn"></button></code></pre>
<h3 id="Conclusion" class="common-anchor-header">Conclusione</h3><p>Gli agenti di intelligenza artificiale falliscono nei compiti di lunga durata perché non dispongono di una memoria persistente e di una verifica adeguata. Clawdbot è diventato virale risolvendo questi problemi, ma il suo approccio non è pronto per la produzione.</p>
<p>Questo articolo ha trattato tre soluzioni che lo sono:</p>
<ul>
<li><p><strong>Architettura a due agenti:</strong> Un inizializzatore suddivide i progetti in caratteristiche verificabili; un agente di codifica li elabora uno alla volta con passaggi puliti. Questo previene l'esaurimento del contesto e rende tracciabili i progressi.</p></li>
<li><p><strong>Database vettoriale per la memoria semantica:</strong> <a href="https://milvus.io/">Milvus</a> memorizza i record di progresso e i commit di git come embeddings, in modo che gli agenti possano cercare in base al significato, non alle parole chiave. La sessione 50 ricorda ciò che la sessione 1 ha imparato.</p></li>
<li><p><strong>Automazione del browser per una verifica reale:</strong> I test unitari verificano che il codice funzioni. Puppeteer verifica se le funzionalità funzionano davvero, testando ciò che gli utenti vedono sullo schermo.</p></li>
</ul>
<p>Questi modelli non sono limitati allo sviluppo del software. La ricerca scientifica, la modellazione finanziaria, la revisione di documenti legali: qualsiasi attività che si estende su più sessioni e richiede passaggi affidabili può trarne beneficio.</p>
<p>I principi fondamentali:</p>
<ul>
<li><p>Utilizzare un inizializzatore per suddividere il lavoro in parti verificabili.</p></li>
<li><p>Tracciare i progressi in un formato strutturato e leggibile dalla macchina.</p></li>
<li><p>Memorizzare l'esperienza in un database vettoriale per il recupero semantico.</p></li>
<li><p>Verificare il completamento con test reali, non solo con test unitari.</p></li>
<li><p>Progettare per confini di sessione netti, in modo che il lavoro possa essere interrotto e ripreso in modo sicuro.</p></li>
</ul>
<p>Gli strumenti esistono. I modelli sono collaudati. Quello che resta da fare è applicarli.</p>
<p><strong>Pronti per iniziare?</strong></p>
<ul>
<li><p>Esplorate <a href="https://milvus.io/">Milvus</a> e <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> per aggiungere memoria semantica ai vostri agenti.</p></li>
<li><p>Scoprite LangGraph per gestire lo stato delle sessioni</p></li>
<li><p>Leggete la <a href="https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents">ricerca completa di Anthropic</a> sui cablaggi di agenti a lunga durata.</p></li>
</ul>
<p><strong>Avete domande o volete condividere ciò che state costruendo?</strong></p>
<ul>
<li><p>Unitevi alla <a href="https://milvus.io/slack">comunità Slack di Milvus</a> per connettervi con altri sviluppatori</p></li>
<li><p>Partecipate all'<a href="https://milvus.io/office-hours">orario di ufficio di Milvus</a> per avere domande e risposte in diretta con il team</p></li>
</ul>
