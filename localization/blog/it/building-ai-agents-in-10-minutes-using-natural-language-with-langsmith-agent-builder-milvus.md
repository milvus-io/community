---
id: >-
  building-ai-agents-in-10-minutes-using-natural-language-with-langsmith-agent-builder-milvus.md
title: >-
  Costruire agenti AI in 10 minuti usando il linguaggio naturale con LangSmith
  Agent Builder + Milvus
author: Min Yin
date: 2026-01-22T00:00:00.000Z
desc: >-
  Imparate a costruire agenti AI abilitati alla memoria in pochi minuti usando
  LangSmith Agent Builder e Milvus: niente codice, linguaggio naturale, pronti
  per la produzione.
cover: assets.zilliz.com/cover_LS_MVS_ab8af19bfa.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: >-
  LangSmith Agent Builder, Milvus vector database, AI agent memory, no-code AI
  agents, building AI assistants
meta_title: |
  Build AI Agents in 10 Minutes with LangSmith Agent Builder & Milvus
origin: >-
  https://milvus.io/blog/building-ai-agents-in-10-minutes-using-natural-language-with-langsmith-agent-builder-milvus.md
---
<p>Con l'accelerazione dello sviluppo dell'intelligenza artificiale, un numero sempre maggiore di team sta scoprendo che la creazione di un assistente AI non richiede necessariamente un background di ingegneria del software. Le persone che hanno più bisogno di assistenti - team di prodotto, operativi, di supporto, ricercatori - spesso sanno esattamente cosa deve fare l'agente, ma non come implementarlo nel codice. Gli strumenti tradizionali "no-code" hanno tentato di colmare questo divario con tele trascinabili, ma crollano nel momento in cui è necessario un vero comportamento dell'agente: ragionamento in più fasi, uso di strumenti o memoria persistente.</p>
<p>Il nuovo <a href="https://www.langchain.com/langsmith/agent-builder"><strong>Agent Builder</strong></a> di <a href="https://www.langchain.com/langsmith/agent-builder"><strong>LangSmith</strong></a> adotta un approccio diverso. Invece di progettare flussi di lavoro, si descrivono gli obiettivi dell'agente e gli strumenti disponibili in un linguaggio semplice, e il runtime gestisce il processo decisionale. Niente diagrammi di flusso, niente script, solo un'intenzione chiara.</p>
<p>Ma l'intento da solo non produce un assistente intelligente. Lo fa la <strong>memoria</strong>. È qui che <a href="https://milvus.io/"><strong>Milvus</strong></a>, il database vettoriale open source ampiamente adottato, fornisce le basi. Memorizzando i documenti e la cronologia delle conversazioni come embeddings, Milvus consente all'agente di ricordare il contesto, recuperare le informazioni pertinenti e rispondere con precisione su scala.</p>
<p>Questa guida spiega come costruire un assistente AI pronto per la produzione e abilitato alla memoria utilizzando <strong>LangSmith Agent Builder + Milvus</strong>, il tutto senza scrivere una sola riga di codice.</p>
<h2 id="What-is-LangSmith-Agent-Builder-and-How-It-Works" class="common-anchor-header">Cos'è e come funziona LangSmith Agent Builder?<button data-href="#What-is-LangSmith-Agent-Builder-and-How-It-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Proprio come rivela il suo nome, <a href="https://www.google.com/search?q=LangSmith+Agent+Builder&amp;oq=what+is+LangSmith+Agent+Builder&amp;gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQABiABDIHCAIQABiABDIHCAMQABiABDIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDIHCAcQABiABDIGCAgQABgDMggICRAAGBYYHtIBCTI1OTJqMGoxNagCCLACAfEF2Mylr_IuXLk&amp;sourceid=chrome&amp;ie=UTF-8&amp;ved=2ahUKEwjV1LfvxZ6SAxVFsFYBHYzTJAsQgK4QegQIARAB">LangSmith Agent Builder</a> è uno strumento no-code di LangChain che consente di costruire, distribuire e gestire agenti AI utilizzando un linguaggio semplice. Invece di scrivere logica o progettare flussi visivi, si spiega cosa deve fare l'agente, quali strumenti può usare e come deve comportarsi. Il sistema si occupa poi delle parti più difficili: generazione di prompt, selezione degli strumenti, collegamento dei componenti e abilitazione della memoria.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_57c5cee35b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>A differenza dei tradizionali strumenti no-code o di workflow, Agent Builder non dispone di canvas drag-and-drop né di una libreria di nodi. Si interagisce con esso nello stesso modo in cui si interagisce con ChatGPT. Si descrive ciò che si vuole costruire, si risponde ad alcune domande chiarificatrici e il Generatore produce un agente completamente funzionante in base alle intenzioni dell'utente.</p>
<p>Dietro le quinte, l'agente è costruito a partire da quattro blocchi fondamentali.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_05b90b1f3d.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ul>
<li><strong>Prompt:</strong> Il prompt è il cervello dell'agente, che definisce gli obiettivi, i vincoli e la logica decisionale. LangSmith Agent Builder utilizza il meta-prompting per costruirlo automaticamente: voi descrivete ciò che volete, l'agente pone domande chiarificatrici e le vostre risposte vengono sintetizzate in un prompt di sistema dettagliato e pronto per la produzione. Invece di scrivere a mano la logica, si esprime semplicemente l'intenzione.</li>
<li><strong>Strumenti:</strong> Gli strumenti consentono all'agente di agire: inviare e-mail, inviare messaggi a Slack, creare eventi di calendario, cercare dati o chiamare API. Agent Builder integra questi strumenti attraverso il Model Context Protocol (MCP), che fornisce un modo sicuro ed estensibile per esporre le funzionalità. Gli utenti possono affidarsi alle integrazioni integrate o aggiungere server MCP personalizzati, compresi i <a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">server MCP</a>Milvus per la ricerca vettoriale e la memoria a lungo termine.</li>
<li><strong>Trigger:</strong> I trigger definiscono quando un agente viene eseguito. Oltre all'esecuzione manuale, è possibile collegare gli agenti a pianificazioni o eventi esterni in modo che rispondano automaticamente a messaggi, e-mail o attività webhook. Quando scatta un trigger, Agent Builder avvia un nuovo thread di esecuzione ed esegue la logica dell'agente, consentendo un comportamento continuo e guidato dagli eventi.</li>
<li><strong>Subagenti:</strong> I subagenti suddividono compiti complessi in unità più piccole e specializzate. Un agente primario può delegare il lavoro ai subagenti, ciascuno con il proprio prompt e il proprio set di strumenti, in modo che compiti come il recupero dei dati, il riassunto o la formattazione siano gestiti da assistenti dedicati. In questo modo si evita un singolo prompt sovraccarico e si crea un'architettura di agenti più modulare e scalabile.</li>
</ul>
<h2 id="How-Does-an-Agent-Remember-Your-Preferences" class="common-anchor-header">Come fa un agente a ricordare le preferenze dell'utente?<button data-href="#How-Does-an-Agent-Remember-Your-Preferences" class="anchor-icon" translate="no">
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
    </button></h2><p>Ciò che rende Agent Builder unico è il modo in cui tratta la <em>memoria</em>. Invece di archiviare le preferenze nella cronologia della chat, l'agente può aggiornare le proprie regole di comportamento durante l'esecuzione. Se si dice: "D'ora in poi, concludi ogni messaggio Slack con una poesia", l'agente non lo considera come una richiesta una tantum, ma lo memorizza come una preferenza persistente da applicare alle esecuzioni future.</p>
<p>Sotto il cofano, l'agente conserva un file di memoria interna, in pratica il suo prompt di sistema in evoluzione. Ogni volta che si avvia, legge questo file per decidere come comportarsi. Quando si forniscono correzioni o vincoli, l'agente modifica il file aggiungendo regole strutturate come "Chiudi sempre il briefing con una breve poesia edificante". Questo approccio è molto più stabile di quello che si basa sulla cronologia delle conversazioni, perché l'agente riscrive attivamente le sue istruzioni operative invece di seppellire le preferenze dell'utente in una trascrizione.</p>
<p>Questo progetto deriva dal FilesystemMiddleware di DeepAgents, ma è completamente astratto in Agent Builder. Non si toccano mai i file direttamente: si esprimono gli aggiornamenti in linguaggio naturale e il sistema gestisce le modifiche dietro le quinte. Se si desidera un maggiore controllo, è possibile inserire un server MCP personalizzato o passare al livello DeepAgents per una personalizzazione avanzata della memoria.</p>
<h2 id="Hands-on-Demo-Building-a-Milvus-Assistant-in-10-Minutes-using-Agent-Builder" class="common-anchor-header">Dimostrazione pratica: Creazione di un assistente Milvus in 10 minuti con Agent Builder<button data-href="#Hands-on-Demo-Building-a-Milvus-Assistant-in-10-Minutes-using-Agent-Builder" class="anchor-icon" translate="no">
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
    </button></h2><p>Dopo aver illustrato la filosofia progettuale che sta alla base di Agent Builder, vediamo l'intero processo di creazione con un esempio pratico. Il nostro obiettivo è creare un assistente intelligente in grado di rispondere a domande tecniche su Milvus, di cercare nella documentazione ufficiale e di ricordare le preferenze dell'utente nel tempo.</p>
<h3 id="Step-1-Sign-In-to-the-LangChain-Website" class="common-anchor-header">Passo 1. Accedere al sito web di LangChain</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_1_b3c461d39b.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Set-Up-Your-Anthropic-API-Key" class="common-anchor-header">Passo 2. Impostare la chiave API Anthropic</h3><p><strong>Nota:</strong> Anthropic è supportato per impostazione predefinita. È possibile utilizzare anche un modello personalizzato, purché il suo tipo sia incluso nell'elenco ufficialmente supportato da LangChain.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_2_c04400695e.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>1. Aggiungere una chiave API</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_3_11db4b3824.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>2. Inserire e salvare la chiave API</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_4_abfc27d796.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Create-a-New-Agent" class="common-anchor-header">Passo 3. Creare un nuovo agente</h3><p><strong>Nota:</strong> Fare clic su <strong>Ulteriori informazioni</strong> per visualizzare la documentazione d'uso.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_5_e90bf254f2.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_6_7c839d96f3.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol>
<li><strong>Configurare un modello personalizzato (opzionale)</strong></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_7_0dfd5ff561.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(1) Inserire i parametri e salvare</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_8_85f9e3008f.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_9_0d5d0c062c.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Describe-Your-Requirements-to-Create-the-Agent" class="common-anchor-header">Passo 4. Descrivere i requisiti per creare l'agente</h3><p><strong>Nota:</strong> creare l'agente utilizzando una descrizione in linguaggio naturale.</p>
<pre><code translate="no">
I need a Milvus technical consultant to <span class="hljs-built_in">help</span> me answer technical questions about vector databases. 

Search the official documentation <span class="hljs-keyword">and</span> remember my preference <span class="hljs-keyword">for</span> the index <span class="hljs-built_in">type</span> I use. 

<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_10_0e033a5200.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol>
<li><strong>Il sistema pone delle domande successive per perfezionare i requisiti</strong></li>
</ol>
<p>Domanda 1: Selezionare i tipi di indice Milvus che si desidera far ricordare all'agente.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_11_050ac891f0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Domanda 2: Scegliere come l'agente deve gestire le domande tecniche.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_12_d1d6d4f2ed.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Domanda 3: specificare se l'agente deve concentrarsi sulla guida per una versione specifica di Milvus.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_13_5d60df75e9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-5-Review-and-Confirm-the-Generated-Agent" class="common-anchor-header">Passo 5. Esaminare e confermare l'agente generato</h3><p><strong>Nota:</strong> il sistema genera automaticamente la configurazione dell'agente.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_14_8a596ae853.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Prima di creare l'agente, è possibile esaminarne i metadati, gli strumenti e le richieste. Quando tutto sembra corretto, fare clic su <strong>Crea</strong> per procedere.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_15_5c0b27aca7.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_16_998921b071.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Explore-the-Interface-and-Feature-Areas" class="common-anchor-header">Passo 6. Esplorare l'interfaccia e le aree funzionali</h3><p>Dopo la creazione dell'agente, si vedranno tre aree funzionali nell'angolo in basso a sinistra dell'interfaccia:</p>
<p><strong>(1) Trigger</strong></p>
<p>I trigger definiscono quando l'agente deve essere eseguito, in risposta a eventi esterni o in base a una pianificazione:</p>
<ul>
<li><strong>Slack:</strong> Attivare l'agente quando arriva un messaggio in un canale specifico.</li>
<li><strong>Gmail:</strong> Attiva l'agente quando viene ricevuta una nuova email</li>
<li><strong>Cron:</strong> Eseguire l'agente a intervalli programmati</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_17_b77c603413.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(2) Toolbox</strong></p>
<p>È l'insieme degli strumenti che l'agente può richiamare. Nell'esempio mostrato, i tre strumenti sono generati automaticamente durante la creazione; è possibile aggiungerne altri facendo clic su <strong>Aggiungi strumento</strong>.  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_18_94637d4548.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Se l'agente ha bisogno di capacità di ricerca vettoriale, come la ricerca semantica su grandi volumi di documentazione tecnica, è possibile implementare il server MCP di Milvus</strong> e aggiungerlo qui utilizzando il pulsante <strong>MCP</strong>. Assicuratevi che il server MCP sia in esecuzione <strong>su un endpoint di rete raggiungibile</strong>, altrimenti Agent Builder non sarà in grado di richiamarlo.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_19_94fe99a3b8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_20_f887a8fbda.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(3) Sub-agenti</strong></p>
<p>Creare moduli di agenti indipendenti dedicati a sottoattività specifiche, consentendo una progettazione modulare del sistema.</p>
<h3 id="Step-7-Test-the-Agent" class="common-anchor-header">Passo 7. Testare l'agente</h3><p>Fare clic su <strong>Test</strong> nell'angolo in alto a destra per accedere alla modalità di test. Di seguito è riportato un esempio dei risultati del test.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_22_527619519b.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_23_639d40c40d.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_24_42a71d2592.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_25_8ab35e15f8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Agent-Builder-vs-DeepAgents-Which-One-Should-You-Choose" class="common-anchor-header">Agent Builder vs. DeepAgents: Quale scegliere?<button data-href="#Agent-Builder-vs-DeepAgents-Which-One-Should-You-Choose" class="anchor-icon" translate="no">
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
    </button></h2><p>LangChain offre diversi framework di agenti e la scelta giusta dipende dal grado di controllo di cui si ha bisogno. <a href="https://www.google.com/search?q=DeepAgents&amp;newwindow=1&amp;sca_esv=0e7ec9ce2aa7d5b4&amp;sxsrf=ANbL-n5pe1KqjmJVjQCqmc3jneYhmGGOUg%3A1769066335766&amp;ei=X89xab21Lp3a1e8Ppam06Ag&amp;ved=2ahUKEwio15nYzZ6SAxU_mq8BHcf3BqUQgK4QegQIARAB&amp;uact=5&amp;oq=what+is+DeepAgents&amp;gs_lp=Egxnd3Mtd2l6LXNlcnAiEndoYXQgaXMgRGVlcEFnZW50czIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzINEAAYgAQYsAMYQxiKBTINEAAYgAQYsAMYQxiKBUi8BlAYWL8FcAF4AZABAJgBqgKgAbAKqgEFMC4yLjS4AQPIAQD4AQGYAgGgAgyYAwCIBgGQBgqSBwExoAehHrIHALgHAMIHAzMtMcgHCYAIAA&amp;sclient=gws-wiz-serp">DeepAgents</a> è uno strumento di costruzione di agenti. È utilizzato per costruire agenti AI autonomi e di lunga durata che gestiscono compiti complessi e in più fasi. Costruito su LangGraph, supporta la pianificazione avanzata, la gestione del contesto basata su file e l'orchestrazione di subagenti, rendendolo ideale per progetti a lungo termine o di livello produttivo.</p>
<p>Come si confronta con <strong>Agent Builder</strong> e quando si dovrebbe usare?</p>
<p><strong>Agent Builder</strong> si concentra sulla semplicità e sulla velocità. Astrae la maggior parte dei dettagli dell'implementazione, consentendo di descrivere l'agente in linguaggio naturale, di configurare gli strumenti e di eseguirlo immediatamente. La memoria, l'uso degli strumenti e i flussi di lavoro con l'uomo sono gestiti per voi. Questo rende Agent Builder perfetto per la prototipazione rapida, per gli strumenti interni e per la validazione nelle prime fasi, dove la facilità d'uso è più importante del controllo granulare.</p>
<p><strong>DeepAgents</strong>, invece, è progettato per scenari in cui è necessario un controllo completo su memoria, esecuzione e infrastruttura. È possibile personalizzare il middleware, integrare qualsiasi strumento Python, modificare il backend di archiviazione (compresa la persistenza della memoria in <a href="https://milvus.io/blog">Milvus</a>) e gestire esplicitamente il grafico di stato dell'agente. Il compromesso è l'impegno ingegneristico: si scrive il codice, si gestiscono le dipendenze e le modalità di errore, ma si ottiene uno stack di agenti completamente personalizzabile.</p>
<p>È importante notare che <strong>Agent Builder e DeepAgents non sono ecosistemi separati: formano un unico continuum</strong>. Agent Builder si basa su DeepAgents. Ciò significa che si può iniziare con un prototipo veloce in Agent Builder, per poi passare a DeepAgents quando si ha bisogno di maggiore flessibilità, senza riscrivere tutto da zero. Funziona anche il contrario: i modelli costruiti in DeepAgents possono essere confezionati come modelli di Agent Builder, in modo che gli utenti non tecnici possano riutilizzarli.</p>
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
    </button></h2><p>Grazie allo sviluppo dell'intelligenza artificiale, la costruzione di agenti di intelligenza artificiale non richiede più flussi di lavoro complessi o una progettazione pesante. Con LangSmith Agent Builder, è possibile creare assistenti statici e di lunga durata utilizzando esclusivamente il linguaggio naturale. L'utente si concentra sulla descrizione di ciò che l'agente deve fare, mentre il sistema gestisce la pianificazione, l'esecuzione degli strumenti e gli aggiornamenti continui della memoria.</p>
<p>Abbinati a <a href="https://milvus.io/blog">Milvus</a>, questi agenti ottengono una memoria affidabile e persistente per la ricerca semantica, il monitoraggio delle preferenze e il contesto a lungo termine attraverso le sessioni. Che si tratti di validare un'idea o di implementare un sistema scalabile, LangSmith Agent Builder e Milvus forniscono una base semplice e flessibile per agenti che non si limitano a rispondere, ma ricordano e migliorano nel tempo.</p>
<p>Avete domande o volete un approfondimento? Unitevi al nostro <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canale Slack</a> o prenotate una sessione di 20 minuti di <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> per una guida personalizzata.</p>
