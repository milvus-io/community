---
id: attu-3-0-beta.md
title: >
  Attu 3.0 Beta: gestione multi-cluster, agente AI e console Milvus
  completamente rinnovata
author: Ray Jiang
date: 2026-06-11T00:00:00.000Z
cover: assets.zilliz.com/Attu_3_0_New_cover_1af4c44467.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Attu, Milvus, vector database, AI agent, database management'
meta_keywords: >-
  Attu 3.0, Milvus management, Attu AI Agent, multi-cluster Milvus, vector
  database GUI
meta_title: >
  Attu 3.0 Beta: Multi-Cluster Management, AI Agent, and a Rebuilt Milvus
  Console
desc: >
  La versione beta di Attu 3.0 ripropone la console di gestione Milvus con
  funzionalità di gestione multi-cluster, stato persistente, un agente AI
  integrato, diagnostica avanzata, metriche in tempo reale, debug tramite API,
  backup e ripristino, nonché flussi di lavoro RBAC semplificati.
origin: 'https://milvus.io/blog/attu-3-0-beta.md'
---
<p>Attu 3.0 Beta è ora disponibile.</p>
<p><a href="https://github.com/zilliztech/attu"><strong>Attu</strong></a> è la console di gestione open source per <a href="https://milvus.io"><strong>Milvus</strong></a>. Se avete utilizzato Milvus in locale o in produzione, probabilmente avete usato Attu per ispezionare le collezioni, sfogliare i dati, gestire gli schemi o verificare cosa sta succedendo all'interno di un cluster.</p>
<p>Attu 2.x funzionava bene per la gestione di base di un singolo cluster. Tuttavia, con la crescita delle implementazioni di Milvus, i suoi limiti sono diventati più evidenti. Era in grado di connettersi a una sola istanza di Milvus alla volta. Lo stato della connessione andava perso dopo il riavvio di un container. La navigazione tra i dati era per lo più incentrata sulle collezioni. La diagnostica, il monitoraggio, il debug delle API, il backup e il ripristino, nonché la gestione delle autorizzazioni, richiedevano spesso strumenti separati o operazioni manuali.</p>
<p><strong>Attu 3.0 Beta rappresenta una completa riprogettazione dell’esperienza di gestione di Milvus.</strong></p>
<p>Questa versione aggiunge la gestione multi-cluster, lo stato locale persistente, un agente AI integrato con oltre 50 strumenti Milvus, capacità diagnostiche avanzate, un browser dati riprogettato, metriche Prometheus integrate, un API Playground, backup e ripristino basati su GUI e flussi di lavoro RBAC semplificati.</p>
<p>In breve, Attu non è più solo un visualizzatore leggero per una singola istanza di Milvus. Sta diventando una console operativa pratica per sviluppatori e team che gestiscono Milvus in ambienti locali, di staging e di produzione.</p>
<h2 id="What-Changed-in-Attu-30-Beta" class="common-anchor-header">Cosa è cambiato in Attu 3.0 Beta<button data-href="#What-Changed-in-Attu-30-Beta" class="anchor-icon" translate="no">
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
    </button></h2><p>Ecco un confronto di alto livello tra Attu 2.x e Attu 3.0 Beta.</p>
<table>
<thead>
<tr><th>Funzionalità</th><th>Attu 2.x</th><th>Attu 3.0 Beta</th></tr>
</thead>
<tbody>
<tr><td>Connessioni in cluster</td><td>Solo istanza singola</td><td>Cluster multipli con commutazione con un solo clic</td></tr>
<tr><td>Persistenza dello stato</td><td>Senza stato; perso al riavvio del container</td><td>Database locale; sopravvive ai riavvii</td></tr>
<tr><td>Assistenza AI</td><td>Nessuna</td><td>Agente integrato con oltre 50 strumenti Milvus</td></tr>
<tr><td>Diagnostica</td><td>Analisi manuale</td><td>4 competenze diagnostiche integrate di livello esperto</td></tr>
<tr><td>Gestione RBAC</td><td>Pagine separate, flusso in più fasi</td><td>Creazione utente contestuale con un solo clic</td></tr>
<tr><td>Navigazione tra i dati</td><td>Elenco piatto delle raccolte</td><td>Albero gerarchico: database → raccolta → partizione</td></tr>
<tr><td>Monitoraggio</td><td>È richiesto Grafana esterno</td><td>Dashboard delle metriche Prometheus integrata</td></tr>
<tr><td>Debug dell'API</td><td>Strumenti esterni come curl o Postman</td><td>Playground API REST integrato</td></tr>
<tr><td>Backup e ripristino</td><td>Solo CLI</td><td>Interfaccia grafica con supporto per S3, MinIO, GCS e Azure</td></tr>
<tr><td>Integrazione con LLM</td><td>Nessuna</td><td>BYOL: OpenAI, Anthropic, DeepSeek, Gemini e altri</td></tr>
</tbody>
</table>
<h2 id="Manage-Multiple-Milvus-Clusters-From-One-Sidebar" class="common-anchor-header">Gestione di più cluster Milvus da un'unica barra laterale<button data-href="#Manage-Multiple-Milvus-Clusters-From-One-Sidebar" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Il cambiamento più significativo nell’uso quotidiano è la gestione multi-cluster.</strong> Attu 3.0 è in grado di connettersi a tutte le istanze Milvus in esecuzione e di elencarle in un’unica barra laterale.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_2_aaf3fddf83.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Immagine: barra laterale di Attu 3.0 che mostra più connessioni Milvus con indicatori di integrità</p>
<p>In Attu 2.x, passare da un cluster Milvus a un altro significava disconnettersi, riconnettersi e attendere. Se si disponeva di cluster separati per lo sviluppo, lo staging, la produzione o diverse linee di business, spesso ci si ritrovava con una scheda del browser per ogni cluster.</p>
<p>Attu 3.0 sostituisce quel flusso con una barra laterale sinistra permanente. Ogni connessione Milvus è elencata in un unico posto, con un indicatore di integrità in tempo reale accanto. Un punto verde indica che il cluster è raggiungibile. Un punto rosso indica che il cluster è inattivo o non disponibile.</p>
<p>Il passaggio da un cluster all’altro richiede un solo clic. Attu mantiene il contesto di ciascuna connessione, quindi non è necessario riconnettersi ogni volta che si passa da un ambiente all’altro.</p>
<h3 id="Connection-Setup-Is-Less-Fragile" class="common-anchor-header">La configurazione delle connessioni è meno fragile</h3><p>Le nuove connessioni supportano la crittografia TLS/SSL, l’autenticazione tramite token e l’autenticazione con nome utente e password. È possibile testare una connessione prima di salvarla, conservare i dettagli della connessione localmente e cancellare in blocco le connessioni inattive quando i vecchi ambienti non sono più necessari.</p>
<p><strong>Ogni cluster dispone di un proprio spazio di lavoro.</strong> La panoramica, il browser dei dati, la gestione degli utenti, le metriche e le operazioni sono tutte limitate al cluster attualmente selezionato. Ciò rende molto più difficile confondere l’ambiente di staging con quello di produzione o eseguire un’operazione nel posto sbagliato.</p>
<p>Per chiunque gestisca più di un'istanza di Milvus, questa è una delle modifiche più importanti di Attu 3.0. Può sembrare una cosa banale, ma elimina gran parte del passaggio da una scheda all’altra e delle difficoltà di riconnnessione dal lavoro quotidiano con Milvus.</p>
<h2 id="Local-State-Now-Survives-Restarts" class="common-anchor-header">Lo stato locale ora sopravvive ai riavvii<button data-href="#Local-State-Now-Survives-Restarts" class="anchor-icon" translate="no">
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
    </button></h2><p>Attu 2.x era stateless. Se il container veniva riavviato, le informazioni di connessione salvate andavano perse ed era necessario ricostruire l’area di lavoro.</p>
<p><strong>Attu 3.0 aggiunge un database locale che conserva le configurazioni del cluster, la cronologia delle conversazioni dell’agente, le competenze personalizzate, la configurazione dell’LLM e le preferenze dell’utente.</strong></p>
<p>Quando si esegue Attu con Docker, è necessario montare un volume per conservare tale stato:</p>
<pre><code translate="no" class="language-bash">docker run -d --name attu -p 3000:3000 -v attu-data:/data zilliz/attu:v3.0.0-beta.6
<button class="copy-code-btn"></button></code></pre>
<p>Con il volume montato, il riavvio del container non comporta più il dover ricominciare da zero.</p>
<p>Questo è importante anche per il nuovo agente AI. La cronologia delle conversazioni, le competenze personalizzate e la configurazione LLM possono essere conservate localmente, così Attu diventa una console che puoi continuare a utilizzare nel tempo, anziché un'interfaccia utente temporanea che si azzera dopo ogni riavvio.</p>
<h2 id="Use-the-Built-in-AI-Agent-to-Operate-Milvus-in-Natural-Language" class="common-anchor-header">Utilizzare l’agente AI integrato per gestire Milvus in linguaggio naturale<button data-href="#Use-the-Built-in-AI-Agent-to-Operate-Milvus-in-Natural-Language" class="anchor-icon" translate="no">
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
    </button></h2><p>Attu 3.0 include un agente AI integrato per la gestione di Milvus. Non si tratta di un chatbot di documentazione. <strong>L’agente è collegato a oltre 50 strumenti Milvus, quindi può ispezionare lo stato del cluster ed eseguire operazioni reali tramite Attu.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_3_92689d4337.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Immagine: L’agente AI di Attu 3.0 può richiamare gli strumenti di Milvus tramite richieste in linguaggio naturale</p>
<h3 id="50+-Built-in-Tools-Across-Common-Milvus-Workflows" class="common-anchor-header">Oltre 50 strumenti integrati nei flussi di lavoro Milvus più comuni</h3><p>L’agente copre le operazioni quotidiane, la diagnostica, le autorizzazioni e la gestione del cluster. È possibile porre domande o impartire istruzioni come:</p>
<table>
<thead>
<tr><th>Scenario</th><th>Esempi di comandi</th></tr>
</thead>
<tbody>
<tr><td>Operazioni quotidiane</td><td>“Elenca tutte le mie raccolte.”<br>«Crea una raccolta con i campi id, titolo e embedding. Usa la dimensione 768 per il campo embedding.»<br>“Inserisci alcuni dati di prova in my_collection.”<br>“Cerca in my_collection i 10 record più simili a 'intelligenza artificiale'.”</td></tr>
<tr><td>Operazioni e diagnostica</td><td>“Il mio cluster è in buono stato?”<br>“Perché la ricerca è così lenta?”<br>“Quali collezioni utilizzano più memoria?”<br>“Ci sono state query lente di recente?”</td></tr>
<tr><td>Autorizzazioni</td><td>“Crea un utente in sola lettura chiamato analyst.”<br>«Concedi tutti i privilegi al ruolo admin.»<br>«Verifica quali privilegi possiede l’utente zhangsan.»</td></tr>
<tr><td>Gestione del cluster</td><td>“Mostra la versione e la configurazione attuali di Milvus.”<br>“Elenca l’utilizzo dei gruppi di risorse.”<br>«Compatta my_collection per me.»</td></tr>
</tbody>
</table>
<h3 id="Destructive-Actions-Require-Approval" class="common-anchor-header">Le azioni distruttive richiedono l’approvazione</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_4_130d227620.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Immagine: le operazioni distruttive o sensibili mostrano una finestra di dialogo di conferma prima dell’esecuzione</p>
<p><strong>L’agente è progettato per essere trasparente e controllabile.</strong> Le operazioni non distruttive, come l’elenco delle collezioni o la lettura delle metriche, restituiscono direttamente i risultati.</p>
<p>Le operazioni distruttive o sensibili, come l’eliminazione di una raccolta, la cancellazione dei dati o la modifica dei privilegi, attivano una finestra di dialogo di conferma. La finestra di dialogo elenca i parametri esatti e attende l’approvazione prima che l’operazione venga eseguita.</p>
<p>È inoltre possibile vedere quali strumenti l’agente ha richiamato, quanti token ha utilizzato e se qualche chiamata allo strumento è fallita. Questo è importante per un agente di gestione del database. Gli utenti dovrebbero essere in grado di comprendere cosa ha fatto l’agente, non solo di vedere il risultato finale.</p>
<h2 id="Run-Expert-Diagnostic-Skills-From-the-Console" class="common-anchor-header">Eseguire le competenze diagnostiche avanzate dalla console<button data-href="#Run-Expert-Diagnostic-Skills-From-the-Console" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>L’AI Agent include quattro competenze diagnostiche integrate.</strong> Si tratta di flussi di lavoro guidati per scenari comuni di risoluzione dei problemi in Milvus, non di prompt generici.</p>
<table>
<thead>
<tr><th>Funzionalità diagnostica</th><th>Cosa verifica</th></tr>
</thead>
<tbody>
<tr><td>Diagnosi dello stato di salute del cluster</td><td>Versione, stato dei nodi, integrità dei singoli componenti e metriche chiave.</td></tr>
<tr><td>Diagnosi delle prestazioni di ricerca</td><td>Integrità dell'indice, frammentazione dei segmenti, bilanciamento delle repliche e relativi segnali relativi alle prestazioni di ricerca.</td></tr>
<tr><td>Diagnosi della scrittura dei dati</td><td>Inserimenti lenti, controlli sui dati persi, anomalie di flush e sintomi relativi al percorso di scrittura.</td></tr>
<tr><td>Verifica della configurazione</td><td>Impostazioni rischiose o errate che potrebbero influire sulla stabilità, sulle prestazioni o sul comportamento previsto.</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_5_306b8464cb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Immagine: Attu 3.0 include competenze diagnostiche integrate e supporta competenze personalizzate</p>
<p>È inoltre possibile creare competenze personalizzate in linguaggio naturale. Una competenza può codificare una checklist pre-lancio, un controllo della qualità dei dati per una raccolta specifica o un flusso diagnostico che il vostro team esegue per un carico di lavoro noto.</p>
<p>Una skill personalizzata è essenzialmente conoscenza di dominio più una procedura. Una volta salvata, l’agente può riutilizzarla invece di affidarsi ogni volta a un prompt una tantum.</p>
<h2 id="Bring-Your-Own-LLM-Provider" class="common-anchor-header">Utilizza il tuo provider LLM<button data-href="#Bring-Your-Own-LLM-Provider" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu non include né funge da proxy per un servizio LLM.</strong> L’utente configura il proprio provider e mantiene il controllo del percorso del modello.</p>
<p>Le opzioni di provider supportate includono OpenAI, Anthropic, DeepSeek, Google Gemini, OpenRouter ed endpoint personalizzati compatibili con OpenAI.</p>
<table>
<thead>
<tr><th>Fornitore</th><th>Esempi di modelli</th></tr>
</thead>
<tbody>
<tr><td>OpenAI</td><td>GPT-5.5</td></tr>
<tr><td>Anthropic</td><td>Claude Opus 4.8</td></tr>
<tr><td>DeepSeek</td><td>DeepSeek-V4</td></tr>
<tr><td>Google Gemini</td><td>Gemini 3.5</td></tr>
<tr><td>OpenRouter</td><td>Qualsiasi modello instradato</td></tr>
<tr><td>Endpoint personalizzato</td><td>Qualsiasi API compatibile con OpenAI</td></tr>
</tbody>
</table>
<p>La chiave API viene crittografata localmente e non viene caricata su un servizio gestito da Attu. Questa struttura è importante per i team che desiderano l’assistenza dell’IA ma hanno comunque bisogno di mantenere il controllo sulle credenziali, sul flusso dei dati e sulla scelta del fornitore.</p>
<p>In pratica, il modello BYOL (Bring Your Own Model) rende l’agente utilizzabile in diversi ambienti. Un team potrebbe utilizzare OpenAI. Un altro potrebbe utilizzare un modello Anthropic. Un terzo potrebbe instradare il traffico tramite un endpoint compatibile con OpenAI. Attu non impone un unico fornitore di modelli.</p>
<h2 id="Browse-Milvus-Data-With-a-Database-→-Collection-→-Partition-Tree" class="common-anchor-header">Esplora i dati di Milvus con un albero Database → Collezione → Partizione<button data-href="#Browse-Milvus-Data-With-a-Database-→-Collection-→-Partition-Tree" class="anchor-icon" translate="no">
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
    </button></h2><p>Attu 3.0 riprogetta anche il browser dei dati. Attu 2.x presentava principalmente un elenco piatto di collezioni. Ciò diventa difficile da gestire quando un cluster dispone di più database, decine di collezioni e dati partizionati.</p>
<p><strong>Il nuovo browser utilizza una gerarchia che rispecchia il modo in cui Milvus organizza i dati: database → collezione → partizione.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_7_3fe672c16d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Immagine: il browser dei dati riprogettato utilizza una navigazione gerarchica per database, collezioni e partizioni</p>
<h3 id="Data-Operations-Are-Closer-to-Where-You-Browse" class="common-anchor-header">Le operazioni sui dati sono più vicine al punto in cui si naviga</h3><p>Il browser dei dati mantiene le operazioni a cui gli utenti sono già abituati e aggiunge ulteriori azioni direttamente nell’interfaccia utente:</p>
<ul>
<li>Trascinare e rilasciare una collezione in un altro database.</li>
<li>Eseguire una ricerca vettoriale digitando direttamente il testo, quando è configurato un modello di embedding.</li>
<li>Esaminare i punteggi di similarità e restringere i risultati con i filtri.</li>
<li>Importare ed esportare dati in formato CSV, JSON e Parquet.</li>
<li>Visualizzare e modificare visivamente lo schema di una raccolta, compreso il supporto per i campi dinamici.</li>
<li>Creare, eliminare e esaminare le partizioni e le relative statistiche.</li>
<li>Gestire l'intero ciclo di vita della collezione: creare, caricare, rilasciare, copiare, rinominare, spostare tra database ed eliminare.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_8_952fd26c44.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Immagine: browser dati di Attu 3.0 con ricerca vettoriale e analisi dei risultati</p>
<p>La maggior parte di queste azioni è disponibile tramite i menu contestuali o i pannelli operativi. Per le operazioni comuni sulle collezioni, non è più necessario passare dalla navigazione nell’interfaccia utente alle operazioni da riga di comando.</p>
<p>Attu 3.0 è inoltre la linea di prodotti in cui il supporto dell’interfaccia utente per le nuove funzionalità <a href="https://milvus.io/docs/release_notes.md">di Milvus 3.0</a>, quali le istantanee e i vettori nullabili, continuerà ad essere implementato man mano che tali funzionalità matureranno.</p>
<h2 id="Check-Operations-Metrics-Slow-Queries-Topology-and-Backups-in-One-Place" class="common-anchor-header">Controlla operazioni, metriche, query lente, topologia e backup in un unico posto<button data-href="#Check-Operations-Metrics-Slow-Queries-Topology-and-Backups-in-One-Place" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 integra più informazioni operative nella console.</strong> L’area “Ops e monitoraggio” include la panoramica del cluster, le metriche in tempo reale, l’analisi delle query lente, la topologia, nonché il backup e il ripristino.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_9_4085e60553.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Immagine: Pagina "Ops e monitoraggio" di Attu 3.0</p>
<p>L’obiettivo non è sostituire tutti i sistemi di osservabilità già utilizzati da un team di produzione. I team possono continuare a utilizzare Prometheus, Grafana, i log, gli avvisi e il proprio stack di monitoraggio esistente. L’obiettivo è rendere possibile rispondere alle domande più comuni su Milvus direttamente dall’interno di Attu.</p>
<table>
<thead>
<tr><th>Area</th><th>Cosa è possibile fare</th></tr>
</thead>
<tbody>
<tr><td>Panoramica visiva del cluster</td><td>Visualizza a colpo d’occhio la versione di Milvus, la modalità di distribuzione, il numero di nodi, il numero di database, il numero di raccolte, lo stato di carico e le entità di quota.</td></tr>
<tr><td>Metriche in tempo reale</td><td>Esamina QPS, tassi di inserimento/eliminazione, latenza delle query, percentuale di cache hit e le relative metriche basate su Prometheus.</td></tr>
<tr><td>Analisi delle query lente</td><td>Esamina le query lente per tipo, durata, collezione, timestamp, origine e contesto di risoluzione dei problemi correlato.</td></tr>
<tr><td>Vista della topologia</td><td>Comprendi la topologia dei nodi e le connessioni tra componenti quali RootCoord, DataCoord, IndexCoord, QueryCoord e Proxy.</td></tr>
<tr><td>Backup e ripristino</td><td>Crea backup completi o incrementali su S3, MinIO, GCS o Azure e scarica i metadati di backup in formato ZIP oppure caricali per il ripristino.</td></tr>
</tbody>
</table>
<p>Il backup e il ripristino sono particolarmente importanti perché trasferiscono un flusso di lavoro che in precedenza dipendeva dall’uso della CLI nell’interfaccia grafica (GUI). Ciò è utile per i test locali, la convalida in ambiente di staging e per i team che desiderano un percorso di ripristino più visibile.</p>
<h2 id="Debug-Milvus-REST-APIs-With-the-Built-in-API-Playground" class="common-anchor-header">Debug delle API REST di Milvus con l’API Playground integrato<button data-href="#Debug-Milvus-REST-APIs-With-the-Built-in-API-Playground" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 aggiunge un API Playground REST per lo sviluppo e il debug delle API di Milvus.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_10_7630afab16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Immagine: API Playground di Attu 3.0</p>
<p>L’API Playground cataloga gli endpoint REST di Milvus per categoria. Selezionando un database e una collezione, Attu compila automaticamente il contesto di esecuzione. Da lì, è possibile inviare una richiesta con un solo clic e ispezionare la risposta in tempo reale.</p>
<p>Ciò è utile quando si desidera testare una chiamata API senza dover configurare comandi curl o una collezione Postman. È utile anche per comprendere come una funzionalità di Milvus si mappa all’API REST, poiché è possibile passare direttamente dal contesto dell’interfaccia utente al corpo della richiesta.</p>
<p>Per gli sviluppatori di applicazioni, l’API Playground è uno strumento di debug. Per i nuovi utenti di Milvus, è uno strumento di apprendimento. Per i team della piattaforma, è un modo rapido per convalidare le operazioni prima di trasformarle in script o codice applicativo.</p>
<h2 id="Manage-RBAC-Beside-the-Database-or-Collection" class="common-anchor-header">Gestione dell’RBAC accanto al database o alla raccolta<button data-href="#Manage-RBAC-Beside-the-Database-or-Collection" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 cambia la percezione dei flussi di lavoro relativi alle autorizzazioni nell’interfaccia utente.</strong> Anziché trattare <a href="https://milvus.io/docs/rbac.md">l’RBAC</a> come un’attività amministrativa separata, avvicina il controllo degli accessi alle schede del database e delle collezioni in cui gli utenti stanno già lavorando.</p>
<p>Il modello sottostante rimane l’RBAC di Milvus: utenti, ruoli, <a href="https://milvus.io/docs/grant_privileges.md">privilegi</a>, concessioni e revoche. Attu 3.0 semplifica il percorso operativo relativo a tale modello.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_11_8b431e168c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Immagine: Gestione contestuale di utenti e autorizzazioni in Attu 3.0</p>
<h3 id="One-Click-User-Creation-for-Common-Scopes" class="common-anchor-header">Creazione di utenti con un solo clic per ambiti comuni</h3><p>In Attu 2.x, l’apertura dell’accesso in sola lettura a una raccolta comportava solitamente diversi passaggi: creare l’utente, creare un ruolo, configurare i privilegi, assegnare il ruolo all’utente e assicurarsi che l’ambito fosse corretto.</p>
<p><strong>In Attu 3.0, è possibile aprire una raccolta, andare alla scheda Utenti, fare clic su Crea utente, scegliere Solo lettura o Lettura/scrittura e lasciare che Attu completi il flusso di lavoro.</strong> Il sistema crea l’utente, genera una password sicura, crea il ruolo con ambito corrispondente e applica l’autorizzazione.</p>
<p>Lo stesso modello funziona a livello di database. È inoltre possibile autorizzare un utente esistente alla raccolta corrente o revocare l’accesso con un solo clic.</p>
<p>In questo modo la gestione delle autorizzazioni rimane vicina alla risorsa da proteggere. Non è necessario passare da una pagina di amministrazione all’altra né ricordare una convenzione di denominazione dei ruoli solo per concedere a un collega un accesso con ambito specifico.</p>
<h2 id="What-This-Beta-Means-for-Attu-Users" class="common-anchor-header">Cosa significa questa versione beta per gli utenti di Attu<button data-href="#What-This-Beta-Means-for-Attu-Users" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 Beta rappresenta il più grande aggiornamento della console di gestione di Milvus dal lancio iniziale di Attu.</strong> Non si tratta solo di un restyling visivo, ma di una modifica dell’ambito di ciò che Attu è in grado di gestire.</p>
<p>Il principale miglioramento è che Attu ora si adatta al modo in cui molti utenti di Milvus lavorano effettivamente: cluster multipli, impostazioni locali persistenti, maggiore movimentazione dei dati, maggiore controllo degli accessi, maggiore risoluzione dei problemi e una maggiore necessità di comprendere il comportamento dei cluster senza dover passare da uno strumento all’altro.</p>
<p>I punti salienti sono:</p>
<ul>
<li>Gestione multi-cluster con indicatori di integrità e passaggio da un cluster all’altro con un solo clic.</li>
<li>Stato locale persistente per configurazioni dei cluster, preferenze, configurazione LLM, cronologia degli agenti e competenze personalizzate.</li>
<li>Un agente AI integrato con oltre 50 strumenti Milvus e procedure di conferma per le azioni distruttive.</li>
<li>Quattro competenze diagnostiche avanzate integrate per lo stato di salute del cluster, le prestazioni di ricerca, le operazioni di scrittura dei dati e la revisione della configurazione.</li>
<li>Un browser dati riprogettato con navigazione database → raccolta → partizione e operazioni di raccolta più avanzate.</li>
<li>Metriche Prometheus integrate, analisi delle query lente, topologia, backup e ripristino.</li>
<li>Un Playground API REST per il debug e l’apprendimento delle API di Milvus.</li>
<li>Flussi di lavoro RBAC che si svolgono a livello di database o collezione, non solo in un flusso amministrativo separato.</li>
</ul>
<p>Se utilizzi Attu solo per lo sviluppo locale di Milvus, la versione 3.0 ti offre una console più potente. Se gestisci diversi ambienti Milvus, vale la pena provare almeno le modifiche relative al multi-cluster e allo stato persistente. Se vi capita spesso di risolvere problemi di prestazioni o di autorizzazioni, l’Agent, la diagnostica, le metriche e i flussi di lavoro RBAC contestuali dovrebbero farvi risparmiare tempo fin da subito.</p>
<h2 id="Get-Started" class="common-anchor-header">Inizia<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>Prova Attu 3.0 Beta con Docker:</p>
<pre><code translate="no" class="language-bash">docker run -d --name attu -p 3000:3000 -v attu-data:/data zilliz/attu:v3.0.0-beta.6
<button class="copy-code-btn"></button></code></pre>
<p>Quindi apri:</p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:3000</span>
<button class="copy-code-btn"></button></code></pre>
<p>Aggiungi la tua connessione Milvus dalla barra laterale e inizia a esplorare la nuova console.</p>
<p>Preferisci un'app desktop? Scarica la build per la tua piattaforma da <a href="https://github.com/zilliztech/attu/releases"><strong>GitHub Releases</strong></a>. Attu 3.0 Beta offre pacchetti desktop per macOS, Linux e Windows. Le versioni più recenti includono anche un pacchetto server Linux autonomo per eseguire Attu senza Docker o Electron.</p>
<p><strong>Hai domande?</strong> Condividi la tua configurazione multi-cluster, le funzionalità personalizzate degli agenti o i tuoi scenari diagnostici sul <a href="https://discord.gg/milvus"><strong>Discord di Milvus</strong></a>, oppure prenota un appuntamento <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting?uuid=8d218acf-a841-4869-8330-91daff5e8a02"><strong>con Milvus Office Hours</strong></a> per affrontarli insieme alla community.</p>
<p><strong>Non vuoi gestire tu stesso l’infrastruttura di Milvus?</strong> <a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloud</strong></a> è la piattaforma completamente gestita dai creatori di Milvus. Mantiene l’API di Milvus e aggiunge un’infrastruttura gestita per la ricerca vettoriale in tempo reale, la scoperta su larga scala e le operazioni sui dati con l’IA. Per i team con requisiti di sovranità dei dati, Zilliz Cloud <strong>BYOC</strong> viene eseguito all’interno del tuo account cloud, in modo che i dati rimangano nel tuo VPC mentre Zilliz gestisce le operazioni.</p>
