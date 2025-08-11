---
id: ai-agents-vs-workflows-why-80-need-simple-automation.md
title: >-
  Agenti AI o flussi di lavoro? Perché si dovrebbero evitare gli agenti per
  l'80% delle attività di automazione
author: Min Yin
date: 2025-08-11T00:00:00.000Z
desc: >-
  L'integrazione di Refly e Milvus offre un approccio pragmatico
  all'automazione, che privilegia l'affidabilità e la facilità d'uso rispetto a
  inutili complessità.
cover: >-
  assets.zilliz.com/AI_Agents_or_Workflows_Why_You_Should_Skip_Agents_for_80_of_Automation_Tasks_9f54386e8a.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, AI Agent, workflow, Refly, vector database'
meta_title: |
  AI Agents or Workflows? Why Skip Agents for 80% of Automation
origin: 'https://milvus.io/blog/ai-agents-vs-workflows-why-80-need-simple-automation.md'
---
<p>Gli agenti di intelligenza artificiale sono ovunque, dai copiloti di codifica ai bot del servizio clienti, e possono essere incredibilmente bravi in ragionamenti complessi. Come molti di voi, li adoro. Ma dopo aver costruito sia agenti che flussi di lavoro di automazione, ho imparato una semplice verità: <strong>gli agenti non sono la soluzione migliore per ogni problema.</strong></p>
<p>Ad esempio, quando ho costruito un sistema multi-agente con CrewAI per la decodifica di ML, le cose si sono complicate rapidamente. Gli agenti di ricerca ignoravano i web crawler per il 70% del tempo. Gli agenti di sintesi abbandonavano le citazioni. Il coordinamento crollava ogni volta che i compiti non erano chiari.</p>
<p>E non si tratta solo di esperimenti. Molti di noi si muovono già tra ChatGPT per il brainstorming, Claude per la codifica e una mezza dozzina di API per l'elaborazione dei dati, pensando silenziosamente: <em>deve esserci un modo migliore per far funzionare tutto questo insieme.</em></p>
<p>A volte la risposta è un agente. Più spesso, si tratta di un <strong>flusso di lavoro AI ben progettato</strong> che ricuce gli strumenti esistenti in qualcosa di potente, senza la complessità imprevedibile.</p>
<h2 id="Building-Smarter-AI-Workflows-with-Refly-and-Milvus" class="common-anchor-header">Creare flussi di lavoro AI più intelligenti con Refly e Milvus<button data-href="#Building-Smarter-AI-Workflows-with-Refly-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>So che alcuni di voi stanno già scuotendo la testa: "I flussi di lavoro? Sono rigidi. Non sono abbastanza intelligenti per una vera automazione dell'IA". È vero: la maggior parte dei flussi di lavoro sono rigidi, perché sono modellati come le catene di montaggio della vecchia scuola: fase A → fase B → fase C, nessuna deviazione è consentita.</p>
<p>Ma il vero problema non è l'<em>idea</em> dei flussi di lavoro, bensì l'<em>esecuzione</em>. Non dobbiamo accontentarci di pipeline lineari e fragili. Possiamo progettare flussi di lavoro più intelligenti che si adattino al contesto, si flettano con la creatività e forniscano comunque risultati prevedibili.</p>
<p>In questa guida, costruiremo un sistema completo di creazione di contenuti utilizzando Refly e Milvus per dimostrare perché i flussi di lavoro AI possono superare le complesse architetture multi-agente, soprattutto se si ha a cuore la velocità, l'affidabilità e la manutenibilità.</p>
<h3 id="The-Tools-We’re-Using" class="common-anchor-header">Gli strumenti che utilizziamo</h3><p><a href="https://refly.ai/"><strong>Refly</strong></a>: Una piattaforma open-source per la creazione di contenuti AI-native, costruita attorno al concetto di "free canvas".</p>
<ul>
<li><p><strong>Funzionalità principali:</strong> canvas intelligente, gestione della conoscenza, dialogo multi-thread e strumenti di creazione professionale.</p></li>
<li><p><strong>Perché è utile:</strong> La costruzione di flussi di lavoro drag-and-drop consente di concatenare gli strumenti in sequenze di automazione coese, senza bloccarsi in un'esecuzione rigida e a percorso unico.</p></li>
</ul>
<p><a href="https://milvus.io/"><strong>Milvus</strong></a>: un database vettoriale open-source che gestisce il livello dei dati.</p>
<ul>
<li><p><strong>Perché è importante:</strong> La creazione di contenuti consiste principalmente nel trovare e ricombinare informazioni esistenti. I database tradizionali gestiscono bene i dati strutturati, ma la maggior parte del lavoro creativo coinvolge formati non strutturati: documenti, immagini, video.</p></li>
<li><p><strong>Cosa aggiunge:</strong> Milvus sfrutta modelli di incorporazione integrati per codificare i dati non strutturati come vettori, consentendo la ricerca semantica in modo che i flussi di lavoro possano recuperare il contesto pertinente con una latenza di un millisecondo. Grazie a protocolli come MCP, si integra perfettamente con i vostri framework di intelligenza artificiale, consentendovi di interrogare i dati in linguaggio naturale invece di lottare con la sintassi dei database.</p></li>
</ul>
<h3 id="Setting-Up-Your-Environment" class="common-anchor-header">Impostazione dell'ambiente</h3><p>Vi illustrerò come impostare questo flusso di lavoro a livello locale.</p>
<p><strong>Lista di controllo per la configurazione rapida:</strong></p>
<ul>
<li><p>Ubuntu 20.04+ (o Linux simile)</p></li>
<li><p>Docker + Docker Compose</p></li>
<li><p>Una chiave API da qualsiasi LLM che supporti le chiamate di funzione. In questa guida, utilizzerò l'LLM di <a href="https://platform.moonshot.ai/docs/introduction#text-generation-model">Moonshot</a>.</p></li>
</ul>
<p><strong>Requisiti di sistema</strong></p>
<ul>
<li><p>CPU: 8 core minimo (16 core consigliati)</p></li>
<li><p>Memoria: 16 GB minimo (32 GB consigliati)</p></li>
<li><p>Memoria: 100 GB di SSD minimo (500 GB consigliati)</p></li>
<li><p>Rete: È richiesta una connessione Internet stabile</p></li>
</ul>
<p><strong>Dipendenze software</strong></p>
<ul>
<li><p>Sistema operativo: Linux (consigliato Ubuntu 20.04+)</p></li>
<li><p>Containerizzazione: Docker + Docker Compose</p></li>
<li><p>Python: Versione 3.11 o superiore</p></li>
<li><p>Modello di linguaggio: Qualsiasi modello che supporti le chiamate di funzione (i servizi online o la distribuzione offline di Ollama funzionano entrambi).</p></li>
</ul>
<h3 id="Step-1-Deploy-the-Milvus-Vector-Database" class="common-anchor-header">Passo 1: Distribuzione del database vettoriale Milvus</h3><p><strong>1.1 Scaricare Milvus</strong></p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus/releases/download/v2.5.12/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p><strong>1.2 Avviare i servizi Milvus</strong></p>
<pre><code translate="no">docker-compose up -d
docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_b93ce78614.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Deploy-the-Refly-Platform" class="common-anchor-header">Passo 2: Distribuzione della piattaforma Refly</h3><p><strong>2.1 Clonare il repository</strong></p>
<p>È possibile utilizzare i valori predefiniti per tutte le variabili d'ambiente, a meno che non si abbiano requisiti specifici:</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/refly-ai/refly.git
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-built_in">cd</span> deploy/docker
<span class="hljs-built_in">cp</span> ../../apps/api/.env.example .<span class="hljs-built_in">env</span> <span class="hljs-comment"># copy the example api env file</span>
docker compose up -d
<button class="copy-code-btn"></button></code></pre>
<p><strong>2.2 Verificare lo stato del servizio</strong></p>
<pre><code translate="no">docker ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_cfcde2c570.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Set-Up-MCP-Services" class="common-anchor-header">Fase 3: Impostazione dei servizi MCP</h3><p><strong>3.1 Scaricare il server MCP Milvus</strong></p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/zilliztech/mcp-server-milvus.git
<span class="hljs-built_in">cd</span> mcp-server-milvus
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.2 Avviare il servizio MCP</strong></p>
<p>Questo esempio utilizza la modalità SSE. Sostituire l'URI con l'endpoint del servizio Milvus disponibile:</p>
<pre><code translate="no">uv run src/mcp_server_milvus/server.py --sse --milvus-uri http://localhost:19530 --port 8000
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.3 Confermare che il servizio MCP è in funzione</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_b755922c41.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configuration-and-Setup" class="common-anchor-header">Passo 4: Configurazione e impostazione</h3><p>Ora che l'infrastruttura è in funzione, configuriamo il tutto in modo che funzioni perfettamente.</p>
<p><strong>4.1 Accesso alla piattaforma Refly</strong></p>
<p>Accedere alla propria istanza Refly locale:</p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//192.168.7.148:5700</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_c1e421fece.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.2 Creare il proprio account</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/42_4b8af22fe3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/422_e8cd8439f0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.3 Configurare il modello linguistico</strong></p>
<p>Per questa guida, utilizzeremo <a href="https://platform.moonshot.ai/docs/introduction#text-generation-model">Moonshot</a>. Per prima cosa, registrarsi e ottenere la chiave API.</p>
<p><strong>4.4 Aggiungere il fornitore del modello</strong></p>
<p>Inserire la chiave API ottenuta nel passaggio precedente:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/44_b085f9a263.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.5 Configurare il modello LLM</strong></p>
<p>Assicuratevi di selezionare un modello che supporti le funzionalità di chiamata di funzione, poiché questo è essenziale per le integrazioni del flusso di lavoro che costruiremo:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/45_a05213d0fa.pngQ" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.6 Integrare il servizio Milvus-MCP</strong></p>
<p>Si noti che la versione web non supporta connessioni di tipo stdio, quindi useremo l'endpoint HTTP che abbiamo impostato in precedenza:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/46_027e21e479.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/462_959ee44a78.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Eccellente! Una volta configurato il tutto, vediamo il sistema in azione attraverso alcuni esempi pratici.</p>
<p><strong>4.7 Esempio: Recupero efficiente di vettori con MCP-Milvus-Server</strong></p>
<p>Questo esempio mostra come <strong>MCP-Milvus-Server</strong> funzioni come middleware tra i modelli di intelligenza artificiale e le istanze del database vettoriale Milvus. Agisce come un traduttore, accettando le richieste in linguaggio naturale del modello AI, convertendole in query corrette al database e restituendo i risultati, in modo che i modelli possano lavorare con i dati vettoriali senza conoscere la sintassi del database.</p>
<p><strong>4.7.1 Creare un nuovo canvas</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/471_a684e275ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.7.2 Avviare una conversazione</strong></p>
<p>Aprire l'interfaccia di dialogo, selezionare il modello, inserire la domanda e inviare.</p>
<p><strong>4.7.3 Esaminare i risultati</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/473_7c24a28999.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ciò che sta accadendo è piuttosto notevole: abbiamo appena mostrato il controllo in linguaggio naturale di un database vettoriale Milvus utilizzando <a href="https://milvus.io/blog/talk-to-vector-db-manage-milvus-via-natural-language.md">MCP-Milvus-Server</a> come livello di integrazione. Non c'è bisogno di una sintassi complessa per le query: basta dire al sistema ciò di cui si ha bisogno in un linguaggio semplice e il sistema gestisce le operazioni del database al posto nostro.</p>
<p><strong>4.8 Esempio 2: Creazione di una guida all'implementazione di Refly con i flussi di lavoro</strong></p>
<p>Questo secondo esempio mostra la vera potenza dell'orchestrazione dei flussi di lavoro. Creeremo una guida all'implementazione completa combinando più strumenti di IA e fonti di dati in un unico processo coerente.</p>
<p><strong>4.8.1 Raccogliere i materiali di partenza</strong></p>
<p>La forza di Refly è la sua flessibilità nel gestire diversi formati di input. È possibile importare risorse in diversi formati, che si tratti di documenti, immagini o dati strutturati.</p>
<p><strong>4.8.2 Creare attività e collegare le schede delle risorse</strong></p>
<p>Ora creeremo il nostro flusso di lavoro definendo le attività e collegandole ai materiali di partenza.</p>
<p><strong>4.8.3 Impostare tre attività di elaborazione</strong></p>
<p>Questo è il punto in cui l'approccio del flusso di lavoro è davvero brillante. Invece di tentare di gestire tutto in un unico processo complesso, suddividiamo il lavoro in tre attività mirate che integrano i materiali caricati e li perfezionano sistematicamente.</p>
<ul>
<li><p><strong>Attività di integrazione dei contenuti</strong>: Combina e struttura i materiali di partenza</p></li>
<li><p><strong>Attività di perfezionamento dei contenuti</strong>: migliora la chiarezza e la fluidità</p></li>
<li><p><strong>Compilazione della bozza finale</strong>: Crea un output pronto per la pubblicazione</p></li>
</ul>
<p>I risultati parlano da soli. Ciò che avrebbe richiesto ore di coordinamento manuale tra più strumenti viene ora gestito automaticamente, con ogni fase che si basa logicamente sulla precedente.</p>
<p><strong>Funzionalità del flusso di lavoro multimodale:</strong></p>
<ul>
<li><p><strong>Generazione ed elaborazione di immagini</strong>: Integrazione con modelli di alta qualità come flux-schnell, flux-pro e SDXL.</p></li>
<li><p><strong>Generazione e comprensione di video</strong>: Supporto di vari modelli video stilizzati, tra cui Seedance, Kling e Veo.</p></li>
<li><p><strong>Strumenti di generazione audio</strong>: Generazione di musica attraverso modelli come Lyria-2 e sintesi vocale attraverso modelli come Chatterbox.</p></li>
<li><p><strong>Elaborazione integrata</strong>: Tutti gli output multimodali possono essere referenziati, analizzati e rielaborati all'interno del sistema.</p></li>
</ul>
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
    </button></h2><p>L'integrazione di <strong>Refly</strong> e <strong>Milvus</strong> offre un approccio pragmatico all'automazione, che privilegia l'affidabilità e la facilità d'uso rispetto a inutili complessità. Combinando l'orchestrazione del flusso di lavoro con l'elaborazione multimodale, i team possono passare più rapidamente dall'idea alla pubblicazione, mantenendo il pieno controllo in ogni fase.</p>
<p>Non si tratta di scartare gli agenti di intelligenza artificiale. Sono preziosi per affrontare problemi veramente complessi e imprevedibili. Ma per molte esigenze di automazione, soprattutto nella creazione di contenuti e nell'elaborazione dei dati, un flusso di lavoro ben progettato può fornire risultati migliori con meno spese.</p>
<p>Con l'evoluzione della tecnologia AI, i sistemi più efficaci probabilmente combineranno entrambe le strategie:</p>
<ul>
<li><p><strong>Flussi di lavoro</strong> in cui la prevedibilità, la manutenibilità e la riproducibilità sono fondamentali.</p></li>
<li><p><strong>Agenti</strong> dove sono richiesti ragionamento, adattabilità e risoluzione di problemi aperti.</p></li>
</ul>
<p>L'obiettivo non è costruire l'IA più appariscente, ma quella più <em>utile</em>. E spesso la soluzione più utile è anche la più semplice.</p>
