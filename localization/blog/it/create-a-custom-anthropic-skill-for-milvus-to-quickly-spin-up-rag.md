---
id: create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md
title: >-
  Come le abilità antropiche cambiano gli strumenti dell'agente e come costruire
  un'abilità personalizzata per Milvus per avviare rapidamente il RAG
author: Min Yin
date: 2026-01-23T00:00:00.000Z
cover: assets.zilliz.com/skills_cover_new_8caa774cc5.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude Code, Anthropic Skills, MCP, RAG, Milvus'
meta_title: |
  Create a Custom Anthropic Skill for Milvus to Quickly Spin Up RAG
desc: >-
  Scoprite cosa sono le Skill e come creare una Skill personalizzata in Claude
  Code che costruisce sistemi RAG supportati da Milvus a partire da istruzioni
  in linguaggio naturale utilizzando un flusso di lavoro riutilizzabile.
origin: >-
  https://milvus.io/blog/create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md
---
<p>L'uso degli strumenti è una parte importante del funzionamento di un agente. L'agente deve scegliere lo strumento giusto, decidere quando chiamarlo e formattare correttamente gli input. Sulla carta sembra semplice, ma quando si inizia a costruire sistemi reali, si scoprono molti casi limite e modalità di fallimento.</p>
<p>Molti team utilizzano definizioni di strumenti in stile MCP per organizzare il tutto, ma l'MCP presenta alcune asperità. Il modello deve ragionare su tutti gli strumenti contemporaneamente e non c'è molta struttura per guidare le sue decisioni. Inoltre, ogni definizione di strumento deve vivere nella finestra di contesto. Alcuni di questi sono di grandi dimensioni (l'MCP di GitHub è di circa 26k token), il che consuma il contesto prima ancora che l'agente inizi a lavorare davvero.</p>
<p>Anthropic ha introdotto <a href="https://github.com/anthropics/skills?tab=readme-ov-file"><strong>le competenze</strong></a> per migliorare questa situazione. Le abilità sono più piccole, più mirate e più facili da caricare su richiesta. Invece di scaricare tutto nel contesto, si impacchettano la logica del dominio, i flussi di lavoro o gli script in unità compatte che l'agente può utilizzare solo quando necessario.</p>
<p>In questo post spiegherò come funzionano le Anthropic Skills e poi spiegherò come costruire una semplice Skill in Claude Code che trasforma il linguaggio naturale in una base di conoscenza <a href="https://milvus.io/">supportata da Milvus</a>: una configurazione rapida per RAG senza cablaggi aggiuntivi.</p>
<h2 id="What-Are-Anthropic-Skills" class="common-anchor-header">Cosa sono le abilità antropiche?<button data-href="#What-Are-Anthropic-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p>Le<a href="https://milvus.io/blog/is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md">Abilità antropiche</a> (o Abilità dell'agente) non sono altro che cartelle che raggruppano le istruzioni, gli script e i file di riferimento di cui un agente ha bisogno per gestire un compito specifico. Sono come piccoli pacchetti di capacità autosufficienti. Un'abilità può definire come generare un report, eseguire un'analisi o seguire un particolare flusso di lavoro o un insieme di regole.</p>
<p>L'idea chiave è che le Skill sono modulari e possono essere caricate su richiesta. Invece di inserire enormi definizioni di strumenti nella finestra del contesto, l'agente inserisce solo le Skill di cui ha bisogno. In questo modo, l'uso del contesto è ridotto e il modello riceve una guida chiara su quali strumenti esistono, quando chiamarli e come eseguire ogni fase.</p>
<p>Il formato è volutamente semplice e, per questo motivo, è già supportato o facilmente adattabile da una serie di strumenti per sviluppatori: Claude Code, Cursor, estensioni di VS Code, integrazioni con GitHub, configurazioni in stile Codex e così via.</p>
<p>Una Skill segue una struttura di cartelle coerente:</p>
<pre><code translate="no">skill-name/

├── SKILL.md       <span class="hljs-comment"># Required: Skill instructions and metadata</span>

├── scripts/         <span class="hljs-comment"># Optional: helper scripts</span>

├── templates/       <span class="hljs-comment"># Optional: document templates</span>

└── resources/       <span class="hljs-comment"># Optional: reference materials</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>1.</strong> <code translate="no">SKILL.md</code> <strong>(Core File)</strong></p>
<p>È la guida all'esecuzione per l'agente, il documento che indica esattamente all'agente come deve essere eseguita l'attività. Definisce i metadati dell'Abilità (come il nome, la descrizione e le parole chiave di attivazione), il flusso di esecuzione e le impostazioni predefinite. In questo file è necessario descrivere chiaramente</p>
<ul>
<li><p><strong>Quando l'abilità deve essere eseguita:</strong> Ad esempio, attivare l'abilità quando l'input dell'utente include una frase come "elaborare file CSV con Python".</p></li>
<li><p><strong>Come deve essere eseguita l'attività:</strong> Disporre le fasi di esecuzione in ordine, come ad esempio: interpretare la richiesta dell'utente → richiamare gli script di preelaborazione dalla directory <code translate="no">scripts/</code> → generare il codice richiesto → formattare l'output utilizzando i modelli di <code translate="no">templates/</code>.</p></li>
<li><p><strong>Regole e vincoli:</strong> Specificano dettagli come le convenzioni di codifica, i formati di output e il modo in cui devono essere gestiti gli errori.</p></li>
</ul>
<p><strong>2.</strong> <code translate="no">scripts/</code> <strong>(script di esecuzione)</strong></p>
<p>Questa directory contiene script pre-scritti in linguaggi come Python, Shell o Node.js. L'agente può richiamare direttamente questi script, invece di generare ripetutamente lo stesso codice in fase di esecuzione. Esempi tipici sono <code translate="no">create_collection.py</code> e <code translate="no">check_env.py</code>.</p>
<p><strong>3.</strong> <code translate="no">templates/</code> <strong>(Modelli di documento)</strong></p>
<p>File modello riutilizzabili che l'agente può usare per generare contenuti personalizzati. Esempi comuni sono i modelli di rapporto o i modelli di configurazione.</p>
<p><strong>4.</strong> <code translate="no">resources/</code> <strong>(Materiali di riferimento)</strong></p>
<p>Documenti di riferimento che l'agente può consultare durante l'esecuzione, come la documentazione API, le specifiche tecniche o le guide alle best practice.</p>
<p>Nel complesso, questa struttura rispecchia il modo in cui il lavoro viene consegnato a un nuovo compagno di squadra: <code translate="no">SKILL.md</code> spiega il lavoro, <code translate="no">scripts/</code> fornisce strumenti pronti all'uso, <code translate="no">templates/</code> definisce formati standard e <code translate="no">resources/</code> fornisce informazioni di base. Con tutto questo, l'agente può eseguire il compito in modo affidabile e con il minimo di incertezze.</p>
<h2 id="Hands-on-Tutorial-Creating-a-Custom-Skill-for-a-Milvus-Powered-RAG-System" class="common-anchor-header">Esercitazione pratica: Creazione di un'abilità personalizzata per un sistema RAG alimentato da Milvus<button data-href="#Hands-on-Tutorial-Creating-a-Custom-Skill-for-a-Milvus-Powered-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>In questa sezione, vedremo come costruire un'abilità personalizzata in grado di impostare una raccolta Milvus e di assemblare una pipeline RAG completa a partire da semplici istruzioni in linguaggio naturale. L'obiettivo è quello di saltare tutto il lavoro di configurazione abituale: nessuna progettazione manuale dello schema, nessuna configurazione degli indici, nessun codice boilerplate. Si dice all'agente ciò che si vuole, e l'abilità gestisce i pezzi di Milvus per l'utente.</p>
<h3 id="Design-Overview" class="common-anchor-header">Panoramica della progettazione</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/design_overview_d4c886291b.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Prerequisites" class="common-anchor-header">Prerequisiti</h3><table>
<thead>
<tr><th>Componente</th><th>Requisiti</th></tr>
</thead>
<tbody>
<tr><td>CLI</td><td><code translate="no">claude-code</code></td></tr>
<tr><td>Modelli</td><td>GLM 4.7, OpenAI</td></tr>
<tr><td>Contenitore</td><td>Docker</td></tr>
<tr><td>Milvus</td><td>2.6.8</td></tr>
<tr><td>Piattaforma di configurazione del modello</td><td>CC-Switch</td></tr>
<tr><td>Gestore dei pacchetti</td><td>npm</td></tr>
<tr><td>Linguaggio di sviluppo</td><td>Python</td></tr>
</tbody>
</table>
<h3 id="Step-1-Environment-Setup" class="common-anchor-header">Passo 1: Configurazione dell'ambiente</h3><p><strong>Installare</strong> <code translate="no">claude-code</code></p>
<pre><code translate="no">npm install -g <span class="hljs-meta">@anthropic</span>-ai/claude-code
<button class="copy-code-btn"></button></code></pre>
<p><strong>Installare CC-Switch</strong></p>
<p><strong>Nota:</strong> CC-Switch è uno strumento di commutazione dei modelli che semplifica il passaggio da un'API all'altra quando si eseguono modelli di intelligenza artificiale in locale.</p>
<p>Repository del progetto: <a href="https://github.com/farion1231/cc-switch">https://github.com/farion1231/cc-switch</a></p>
<p><strong>Selezionare Claude e aggiungere una chiave API</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_0cdfab2e54.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_615ee13649.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Controllare lo stato attuale</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_f1c13da1fe.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Distribuire e avviare Milvus-Standalone</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Download docker-compose.yml</span>

wget https://github.com/milvus-io/milvus/releases/download/v2<span class="hljs-number">.6</span><span class="hljs-number">.8</span>/milvus-standalone-docker-compose.yml -O docker-compose.yml

  

<span class="hljs-comment"># Start Milvus (check port mapping: 19530:19530)</span>

docker-compose up -d

  

<span class="hljs-comment"># Verify that the services are running</span>

docker ps | grep milvus

<span class="hljs-comment"># You should see three containers: milvus-standalone, milvus-etcd, milvus-minio</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code1_9c6a1a7f93.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Configurare la chiave API OpenAI</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Add this to ~/.bashrc or ~/.zshrc</span>

OPENAI_API_KEY=your_openai_api_key_here
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-the-Custom-Skill-for-Milvus" class="common-anchor-header">Passo 2: Creare l'abilità personalizzata per Milvus</h3><p><strong>Creare la struttura della directory</strong></p>
<pre><code translate="no"><span class="hljs-built_in">cd</span> ~/.claude/skills/

<span class="hljs-built_in">mkdir</span> -p milvus-skills/example milvus-skills/scripts
<button class="copy-code-btn"></button></code></pre>
<p><strong>Inizializzare</strong> <code translate="no">SKILL.md</code></p>
<p><strong>Nota:</strong> SKILL.md serve come guida all'esecuzione dell'agente. Definisce cosa fa l'abilità e come deve essere attivata.</p>
<pre><code translate="no"><span class="hljs-attr">name</span>: milvus-collection-builder

<span class="hljs-attr">description</span>: <span class="hljs-title class_">Create</span> <span class="hljs-title class_">Milvus</span> collections <span class="hljs-keyword">using</span> natural language, supporting both <span class="hljs-variable constant_">RAG</span> and text search scenarios
<button class="copy-code-btn"></button></code></pre>
<p><strong>Scrivere gli script principali</strong></p>
<table>
<thead>
<tr><th>Tipo di script</th><th>Nome del file</th><th>Scopo</th></tr>
</thead>
<tbody>
<tr><td>Controllo ambiente</td><td><code translate="no">check_env.py</code></td><td>Controlla la versione di Python, le dipendenze necessarie e la connessione a Milvus.</td></tr>
<tr><td>Analisi degli intenti</td><td><code translate="no">intent_parser.py</code></td><td>Converte richieste come "costruisci un database RAG" in un intento strutturato come <code translate="no">scene=rag</code></td></tr>
<tr><td>Creazione di collezioni</td><td><code translate="no">milvus_builder.py</code></td><td>Il costruttore di base che genera lo schema della collezione e la configurazione degli indici.</td></tr>
<tr><td>Ingestione dei dati</td><td><code translate="no">insert_milvus_data.py</code></td><td>Carica i documenti, li raggruppa, genera le incorporazioni e scrive i dati in Milvus.</td></tr>
<tr><td>Esempio 1</td><td><code translate="no">basic_text_search.py</code></td><td>Dimostra come creare un sistema di ricerca di documenti</td></tr>
<tr><td>Esempio 2</td><td><code translate="no">rag_knowledge_base.py</code></td><td>Dimostra come costruire una base di conoscenza completa di RAG</td></tr>
</tbody>
</table>
<p>Questi script mostrano come trasformare una Skill incentrata su Milvus in qualcosa di pratico: un sistema di ricerca di documenti funzionante e una configurazione di Q&amp;A intelligente (RAG).</p>
<h3 id="Step-3-Enable-the-Skill-and-Run-a-Test" class="common-anchor-header">Fase 3: Abilitare l'abilità ed eseguire un test</h3><p><strong>Descrivere la richiesta in linguaggio naturale</strong></p>
<pre><code translate="no"><span class="hljs-string">&quot;I want to build an RAG system.&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test1_64fd549573.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Creazione del sistema RAG</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test2_80656d59b1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Inserire dati di esempio</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test3_392753eb73.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Eseguire una query</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test4_75e23c6a3a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>In questa esercitazione, abbiamo costruito un sistema RAG alimentato da Milvus utilizzando una Skill personalizzata. L'obiettivo non era solo quello di mostrare un altro modo di chiamare Milvus, ma anche quello di mostrare come le Skill possono trasformare ciò che normalmente è una configurazione in più fasi e pesante in qualcosa che si può riutilizzare e iterare. Invece di definire manualmente gli schemi, di mettere a punto gli indici o di mettere insieme il codice del flusso di lavoro, la Skill gestisce la maggior parte della documentazione di base e permette di concentrarsi sulle parti di RAG che contano davvero.</p>
<p>Questo è solo l'inizio. Una pipeline RAG completa ha molti pezzi in movimento: preelaborazione, chunking, impostazioni di ricerca ibrida, reranking, valutazione e altro ancora. Tutti questi elementi possono essere confezionati come Skills separate e composti a seconda del caso d'uso. Se il team dispone di standard interni per le dimensioni dei vettori, i parametri degli indici, i modelli di richiesta o la logica di recupero, le competenze sono un modo pulito per codificare queste conoscenze e renderle ripetibili.</p>
<p>Per i nuovi sviluppatori, questo riduce la barriera d'ingresso: non è necessario imparare ogni dettaglio di Milvus prima di far funzionare qualcosa. Per i team più esperti, riduce la necessità di ripetere le impostazioni e aiuta a mantenere la coerenza dei progetti in tutti gli ambienti. Le competenze non sostituiscono una progettazione accurata del sistema, ma eliminano molti attriti inutili.</p>
<p>L'implementazione completa è disponibile nel <a href="https://github.com/yinmin2020/open-milvus-skills">repository open-source</a> ed è possibile esplorare altri esempi creati dalla comunità nel <a href="https://skillsmp.com/">mercato delle competenze</a>.</p>
<h2 id="Stay-tuned" class="common-anchor-header">Restate sintonizzati!<button data-href="#Stay-tuned" class="anchor-icon" translate="no">
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
    </button></h2><p>Stiamo anche lavorando per introdurre le competenze ufficiali di Milvus e Zilliz Cloud che coprono i modelli RAG comuni e le migliori pratiche di produzione. Se avete idee o flussi di lavoro specifici che volete siano supportati, unitevi al nostro <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">canale Slack</a> e chiacchierate con i nostri ingegneri. E se volete una guida per la vostra configurazione, potete sempre prenotare una sessione di <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a>.</p>
