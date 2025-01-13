---
id: 2022-03-10-manage-your-milvus-vector-database-with-one-click-simplicity.md
title: Gestire il database vettoriale Milvus con la semplicità di un clic
author: Zhen Chen
date: 2022-03-10T00:00:00.000Z
desc: Attu - strumento di interfaccia grafica per Milvus 2.0.
cover: assets.zilliz.com/Attu_3ff9a76156.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://zilliz.com/blog/manage-your-milvus-vector-database-with-one-click-simplicity
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Attu_3ff9a76156.png" alt="Binlog Cover Image" class="doc-image" id="binlog-cover-image" />
   </span> <span class="img-wrapper"> <span>Immagine di copertina di Binlog</span> </span></p>
<p>Bozza di <a href="https://github.com/czhen-zilliz">Zhen Chen</a> e trascrizione di <a href="https://github.com/LocoRichard">Lichen Wang</a>.</p>
<p style="font-size: 12px;color: #4c5a67">Cliccare <a href="https://zilliz.com/blog/manage-your-milvus-vector-database-with-one-click-simplicity">qui</a> per controllare il post originale.</p> 
<p>Di fronte alla rapida crescita della domanda di elaborazione di dati non strutturati, Milvus 2.0 si distingue. Si tratta di un sistema di database vettoriale orientato all'intelligenza artificiale e progettato per scenari di produzione massiva. Oltre a tutti questi SDK Milvus e a Milvus CLI, un'interfaccia a riga di comando per Milvus, esiste uno strumento che permetta agli utenti di utilizzare Milvus in modo più intuitivo? La risposta è SÌ. Zilliz ha annunciato un'interfaccia grafica - Attu - specifica per Milvus. In questo articolo vi mostriamo passo dopo passo come eseguire una ricerca di similarità vettoriale con Attu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/map_aa1cda30d4.png" alt="Attu island" class="doc-image" id="attu-island" />
   </span> <span class="img-wrapper"> <span>L'isola di Attu</span> </span></p>
<p>Rispetto alla CLI di Milvus, che offre la massima semplicità d'uso, Attu presenta altre caratteristiche:</p>
<ul>
<li>Installatori per i sistemi operativi Windows, macOS e Linux;</li>
<li>GUI intuitiva per facilitare l'uso di Milvus;</li>
<li>Copertura delle principali funzionalità di Milvus;</li>
<li>Plugin per l'espansione delle funzionalità personalizzate;</li>
<li>Informazioni complete sulla topologia del sistema per facilitare la comprensione e l'amministrazione dell'istanza Milvus.</li>
</ul>
<h2 id="Installation" class="common-anchor-header">Installazione<button data-href="#Installation" class="anchor-icon" translate="no">
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
    </button></h2><p>La versione più recente di Attu è disponibile su <a href="https://github.com/zilliztech/attu/releases">GitHub</a>. Attu offre installatori eseguibili per diversi sistemi operativi. È un progetto open-source e accoglie i contributi di tutti.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/installation_bbe62873af.png" alt="Installation" class="doc-image" id="installation" />
   </span> <span class="img-wrapper"> <span>Installazione</span> </span></p>
<p>È possibile installare Attu anche tramite Docker.</p>
<pre><code translate="no" class="language-shell">docker run -p <span class="hljs-number">8000</span>:<span class="hljs-number">3000</span> -e <span class="hljs-variable constant_">HOST_URL</span>=<span class="hljs-attr">http</span>:<span class="hljs-comment">//{ attu IP }:8000 -e MILVUS_URL={milvus server IP}:19530 zilliz/attu:latest</span>
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">attu IP</code> è l'indirizzo IP dell'ambiente in cui viene eseguito Attu e <code translate="no">milvus server IP</code> è l'indirizzo IP dell'ambiente in cui viene eseguito Milvus.</p>
<p>Dopo aver installato Attu con successo, è possibile inserire l'IP e la porta di Milvus nell'interfaccia per avviare Attu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/connect_1fde46d9d5.png" alt="Connect Milvus with Attu" class="doc-image" id="connect-milvus-with-attu" />
   </span> <span class="img-wrapper"> <span>Collegare Milvus con Attu</span> </span></p>
<h2 id="Feature-overview" class="common-anchor-header">Panoramica delle funzioni<button data-href="#Feature-overview" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/overview_591e230514.png" alt="Overview page" class="doc-image" id="overview-page" />
   </span> <span class="img-wrapper"> <span>Pagina di panoramica</span> </span></p>
<p>L'interfaccia di Attu è composta da una pagina <strong>di panoramica</strong>, una pagina di <strong>raccolta</strong>, una pagina di <strong>ricerca vettoriale</strong> e una pagina di <strong>visualizzazione del sistema</strong>, corrispondenti rispettivamente alle quattro icone del pannello di navigazione di sinistra.</p>
<p>La pagina <strong>Panoramica</strong> mostra le raccolte caricate. La pagina <strong>Raccolta</strong> elenca tutte le raccolte e indica se sono caricate o rilasciate.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/collection_42656fe308.png" alt="Collection page" class="doc-image" id="collection-page" />
   </span> <span class="img-wrapper"> <span>Pagina delle raccolte</span> </span></p>
<p>Le pagine <strong>Ricerca vettoriale</strong> e <strong>Vista del sistema</strong> sono plugin di Attu. I concetti e l'uso dei plugin saranno introdotti nella parte finale del blog.</p>
<p>È possibile eseguire una ricerca di similarità vettoriale nella pagina <strong>Ricerca vettoriale</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vector_search_be7365687c.png" alt="Vector Search page" class="doc-image" id="vector-search-page" />
   </span> <span class="img-wrapper"> <span>Pagina Ricerca vettoriale</span> </span></p>
<p>Nella pagina <strong>System View</strong> è possibile controllare la struttura topologica di Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/system_view_e1df15023d.png" alt="System View page" class="doc-image" id="system-view-page" />
   </span> <span class="img-wrapper"> <span>Pagina Vista del sistema</span> </span></p>
<p>È inoltre possibile controllare le informazioni dettagliate di ogni nodo facendo clic sul nodo stesso.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/node_view_5bbc25f9b2.png" alt="Node view" class="doc-image" id="node-view" />
   </span> <span class="img-wrapper"> <span>Vista dei nodi</span> </span></p>
<h2 id="Demonstration" class="common-anchor-header">Dimostrazione<button data-href="#Demonstration" class="anchor-icon" translate="no">
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
    </button></h2><p>Esploriamo Attu con un set di dati di prova.</p>
<p>Consultate il nostro <a href="https://github.com/zilliztech/attu/tree/main/examples">repo GitHub</a> per il set di dati utilizzato nel seguente test.</p>
<p>Per prima cosa, creare una collezione denominata test con i seguenti quattro campi:</p>
<ul>
<li>Nome campo: id, campo chiave primaria</li>
<li>Nome campo: vector, campo vettoriale, vettore float, dimensione: 128</li>
<li>Nome campo: brand, campo scalare, Int64</li>
<li>Nome campo: colore, campo scalare, Int64</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/create_collection_95dfa15354.png" alt="Create a collection" class="doc-image" id="create-a-collection" />
   </span> <span class="img-wrapper"> <span>Creare una raccolta</span> </span></p>
<p>Caricare la collezione per la ricerca dopo che è stata creata con successo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/load_collection_fec39171df.png" alt="Load the collection" class="doc-image" id="load-the-collection" />
   </span> <span class="img-wrapper"> <span>Caricare l'insieme</span> </span></p>
<p>È ora possibile controllare la collezione appena creata nella pagina <strong>Panoramica</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/check_collection_163b05477e.png" alt="Check the collection" class="doc-image" id="check-the-collection" />
   </span> <span class="img-wrapper"> <span>Controllare la collezione</span> </span></p>
<p>Importare il set di dati di prova in Milvus.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_1_f73d71be85.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>Importazione dei dati</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_2_4b3c3c3c25.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>Importazione dei dati</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/import_data_3_0def4e8550.png" alt="Import data" class="doc-image" id="import-data" />
   </span> <span class="img-wrapper"> <span>Importazione dei dati</span> </span></p>
<p>Fare clic sul nome della raccolta nella pagina Panoramica o Raccolta per accedere all'interfaccia di interrogazione per verificare i dati importati.</p>
<p>Aggiungere un filtro, specificare l'espressione <code translate="no">id != 0</code>, fare clic su <strong>Applica filtro</strong> e fare clic su <strong>Query</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_data_24d9f71ccc.png" alt="Query data" class="doc-image" id="query-data" />
   </span> <span class="img-wrapper"> <span>Interrogazione dei dati</span> </span></p>
<p>Tutte le cinquanta voci delle entità sono state importate con successo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_result_bcbbd17084.png" alt="Query result" class="doc-image" id="query-result" />
   </span> <span class="img-wrapper"> <span>Risultato dell'interrogazione</span> </span></p>
<p>Proviamo la ricerca di similarità vettoriale.</p>
<p>Copiare un vettore da <code translate="no">search_vectors.csv</code> e incollarlo nel campo <strong>Valore vettore</strong>. Scegliere la collezione e il campo. Fare clic su <strong>Cerca</strong>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/search_data_5af3a1db53.png" alt="Search data" class="doc-image" id="search-data" />
   </span> <span class="img-wrapper"> <span>Ricerca dei dati</span> </span></p>
<p>È possibile controllare i risultati della ricerca. Senza compilare alcuno script, è possibile effettuare ricerche con Milvus in modo semplice.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/search_result_961886efab.png" alt="Search result" class="doc-image" id="search-result" />
   </span> <span class="img-wrapper"> <span>Risultato della ricerca</span> </span></p>
<p>Infine, controlliamo la pagina <strong>System View</strong>.</p>
<p>Grazie all'API Metrics incapsulata nell'SDK Milvus Node.js, è possibile controllare lo stato del sistema, le relazioni tra i nodi e lo stato dei nodi.</p>
<p>Come caratteristica esclusiva di Attu, la pagina Panoramica del sistema include un grafico topologico completo del sistema. Facendo clic su ciascun nodo, è possibile verificarne lo stato (aggiornamento ogni 10 secondi).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/topological_graph_d0c5c17586.png" alt="Milvus node topological graph" class="doc-image" id="milvus-node-topological-graph" />
   </span> <span class="img-wrapper"> <span>Grafico topologico dei nodi Milvus</span> </span></p>
<p>Facendo clic su ciascun nodo si accede alla <strong>vista Elenco nodi</strong>. È possibile controllare tutti i nodi figli di un nodo coord. Ordinando i nodi, è possibile identificare rapidamente i nodi con un elevato utilizzo della CPU o della memoria e individuare il problema del sistema.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/node_list_64fc610a8d.png" alt="Milvus node list" class="doc-image" id="milvus-node-list" />
   </span> <span class="img-wrapper"> <span>Elenco dei nodi Milvus</span> </span></p>
<h2 id="Whats-more" class="common-anchor-header">Cosa c'è di più<button data-href="#Whats-more" class="anchor-icon" translate="no">
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
    </button></h2><p>Come già detto, le pagine <strong>Ricerca vettoriale</strong> e <strong>Vista del sistema</strong> sono plugin di Attu. Incoraggiamo gli utenti a sviluppare i propri plugin in Attu per adattarli ai loro scenari applicativi. Nel codice sorgente c'è una cartella creata appositamente per i codici dei plugin.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/plugins_a2d98e4e5b.png" alt="Plugins" class="doc-image" id="plugins" />
   </span> <span class="img-wrapper"> <span>I plugin</span> </span></p>
<p>È possibile fare riferimento a qualsiasi plugin per imparare a costruire un plugin. Impostando il seguente file di configurazione, è possibile aggiungere il plugin ad Attu.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/add_plugins_e3ef53cc0d.png" alt="Add plugins to Attu" class="doc-image" id="add-plugins-to-attu" />
   </span> <span class="img-wrapper"> <span>Aggiungere plugin ad Attu</span> </span></p>
<p>Per istruzioni dettagliate è possibile consultare <a href="https://github.com/zilliztech/attu/tree/main/doc">Attu GitHub Repo</a> e <a href="https://milvus.io/docs/v2.0.x/attu.md">Milvus Technical Document</a>.</p>
<p>Attu è un progetto open-source. Tutti i contributi sono benvenuti. È inoltre possibile <a href="https://github.com/zilliztech/attu/issues">segnalare un problema</a> se si riscontrano problemi con Attu.</p>
<p>Ci auguriamo sinceramente che Attu possa migliorare l'esperienza d'uso di Milvus. Se vi piace Attu o se avete dei commenti sull'utilizzo, potete compilare il <a href="https://wenjuan.feishu.cn/m/cfm?t=suw4QnODU1ui-ok7r">sondaggio Attu per</a> aiutarci a ottimizzare Attu per una migliore esperienza d'uso.</p>
