---
id: deep-dive-6-oss-qa.md
title: >-
  Garanzia di qualità del software open source (OSS) - Un caso di studio di
  Milvus
author: Wenxing Zhu
date: 2022-04-25T00:00:00.000Z
desc: >-
  L'assicurazione della qualità è un processo per determinare se un prodotto o
  un servizio soddisfa determinati requisiti.
cover: assets.zilliz.com/Deep_Dive_6_c2cd44801d.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-6-oss-qa.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_6_c2cd44801d.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Immagine di copertina</span> </span></p>
<blockquote>
<p>Questo articolo è stato scritto da <a href="https://github.com/zhuwenxing">Wenxing Zhu</a> e trascritto da <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>L'assicurazione della qualità (AQ) è un processo sistematico per determinare se un prodotto o un servizio soddisfa determinati requisiti. Un sistema di AQ è una parte indispensabile del processo di R&amp;S perché, come suggerisce il nome, assicura la qualità del prodotto.</p>
<p>Questo post introduce il quadro di riferimento per l'AQ adottato nello sviluppo del database vettoriale Milvus, con l'obiettivo di fornire una linea guida per gli sviluppatori e gli utenti che contribuiscono al processo. Verranno inoltre illustrati i principali moduli di test di Milvus, nonché i metodi e gli strumenti che possono essere utilizzati per migliorare l'efficienza dei test QA.</p>
<p><strong>Vai a:</strong></p>
<ul>
<li><a href="#A-general-introduction-to-the-Milvus-QA-system">Introduzione generale al sistema QA di Milvus</a></li>
<li><a href="#Test-modules-in-Milvus">Moduli di test in Milvus</a></li>
<li><a href="#Tools-and-methods-for-better-QA-efficiency">Strumenti e metodi per migliorare l'efficienza della QA</a></li>
</ul>
<h2 id="A-general-introduction-to-the-Milvus-QA-system" class="common-anchor-header">Introduzione generale al sistema QA di Milvus<button data-href="#A-general-introduction-to-the-Milvus-QA-system" class="anchor-icon" translate="no">
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
    </button></h2><p>L'<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">architettura del sistema</a> è fondamentale per condurre i test QA. Più un ingegnere QA conosce il sistema, più è probabile che riesca a elaborare un piano di test ragionevole ed efficiente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_architecture_feaccc489d.png" alt="Milvus architecture" class="doc-image" id="milvus-architecture" />
   </span> <span class="img-wrapper"> <span>Architettura di Milvus</span> </span></p>
<p>Milvus 2.0 adotta un'<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-cloud-native-first-approach">architettura cloud-native, distribuita e stratificata</a>, con l'SDK come <a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">ingresso principale per il</a> flusso dei <a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">dati</a> in Milvus. Gli utenti di Milvus utilizzano l'SDK molto spesso, quindi i test funzionali sul lato SDK sono molto necessari. Inoltre, i test funzionali sull'SDK possono aiutare a rilevare i problemi interni che potrebbero esistere nel sistema Milvus. Oltre ai test funzionali, verranno condotti anche altri tipi di test sul database vettoriale, tra cui test unitari, test di distribuzione, test di affidabilità, test di stabilità e test di prestazioni.</p>
<p>Un'architettura cloud-native e distribuita comporta sia vantaggi che sfide per i test QA. A differenza dei sistemi distribuiti ed eseguiti localmente, un'istanza di Milvus distribuita ed eseguita su un cluster Kubernetes può garantire che i test del software vengano eseguiti nelle stesse circostanze dello sviluppo del software. Tuttavia, l'aspetto negativo è che la complessità dell'architettura distribuita comporta maggiori incertezze che possono rendere il test QA del sistema ancora più difficile e faticoso. Ad esempio, Milvus 2.0 utilizza microservizi di diversi componenti, il che comporta un numero maggiore di <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#A-bare-bones-skeleton-of-the-Milvus-architecture">servizi e nodi</a> e una maggiore possibilità di errore del sistema. Di conseguenza, è necessario un piano di AQ più sofisticato e completo per migliorare l'efficienza dei test.</p>
<h3 id="QA-testings-and-issue-management" class="common-anchor-header">Test QA e gestione dei problemi</h3><p>La QA in Milvus comprende sia la conduzione di test che la gestione dei problemi emersi durante lo sviluppo del software.</p>
<h4 id="QA-testings" class="common-anchor-header">Test QA</h4><p>Milvus conduce diversi tipi di test QA in base alle caratteristiche di Milvus e alle esigenze degli utenti, in ordine di priorità, come mostrato nell'immagine seguente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_14_2aff081d41.png" alt="QA testing priority" class="doc-image" id="qa-testing-priority" />
   </span> <span class="img-wrapper"> <span>Priorità dei test QA</span> </span></p>
<p>In Milvus i test QA sono condotti sui seguenti aspetti in base alla seguente priorità:</p>
<ol>
<li><strong>Funzione</strong>: Verifica se le funzioni e le caratteristiche funzionano come progettato originariamente.</li>
<li><strong>Distribuzione</strong>: Verificare se l'utente può distribuire, reinstallare e aggiornare sia la versione standalone di Mivus che il cluster Milvus con metodi diversi (Docker Compose, Helm, APT o YUM, ecc.).</li>
<li><strong>Prestazioni</strong>:  Verifica delle prestazioni dell'inserimento dei dati, dell'indicizzazione, della ricerca vettoriale e dell'interrogazione in Milvus.</li>
<li><strong>Stabilità</strong>: Verificare se Milvus può funzionare in modo stabile per 5-10 giorni con un carico di lavoro normale.</li>
<li><strong>Affidabilità</strong>: Verificare se Milvus può continuare a funzionare parzialmente in caso di errori di sistema.</li>
<li><strong>Configurazione</strong>: Verificare se Milvus funziona come previsto con determinate configurazioni.</li>
<li><strong>Compatibilità</strong>: Verifica se Milvus è compatibile con diversi tipi di hardware o software.</li>
</ol>
<h4 id="Issue-management" class="common-anchor-header">Gestione dei problemi</h4><p>Durante lo sviluppo del software possono emergere molti problemi. Gli autori dei problemi possono essere gli stessi ingegneri QA o gli utenti di Milvus della comunità open-source. Il team QA è responsabile della risoluzione dei problemi.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Issue_management_workflow_12c726efa1.png" alt="Issue management workflow" class="doc-image" id="issue-management-workflow" />
   </span> <span class="img-wrapper"> <span>Flusso di lavoro della gestione dei problemi</span> </span></p>
<p>Quando viene creato un <a href="https://github.com/milvus-io/milvus/issues">problema</a>, questo viene prima sottoposto al triage. Durante il triage, i nuovi problemi vengono esaminati per assicurarsi che siano forniti dettagli sufficienti. Se il problema è confermato, verrà accettato dagli sviluppatori che cercheranno di risolverlo. Una volta terminato lo sviluppo, l'autore del problema deve verificare se è stato risolto. In caso affermativo, il problema verrà chiuso.</p>
<h3 id="When-is-QA-needed" class="common-anchor-header">Quando è necessaria la QA?</h3><p>Un'idea sbagliata comune è che QA e sviluppo siano indipendenti l'uno dall'altro. In realtà, per garantire la qualità del sistema, sono necessari gli sforzi sia degli sviluppatori che degli ingegneri QA. Pertanto, l'AQ deve essere coinvolta durante l'intero ciclo di vita.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/QA_lifecycle_375f4fd8a8.png" alt="QA lifecycle" class="doc-image" id="qa-lifecycle" />
   </span> <span class="img-wrapper"> <span>Ciclo di vita della QA</span> </span></p>
<p>Come mostrato nella figura precedente, un ciclo di vita completo di ricerca e sviluppo del software comprende tre fasi.</p>
<p>Durante la fase iniziale, gli sviluppatori pubblicano la documentazione di progettazione, mentre gli ingegneri QA elaborano piani di test, definiscono i criteri di rilascio e assegnano i compiti QA. Gli sviluppatori e gli ingegneri QA devono avere familiarità con il documento di progettazione e con il piano di test, in modo che i due team condividano l'obiettivo del rilascio (in termini di funzionalità, prestazioni, stabilità, convergenza dei bug, ecc.</p>
<p>Durante la fase di R&amp;S, i test di sviluppo e di AQ interagiscono frequentemente per sviluppare e verificare le caratteristiche e le funzioni e per risolvere i bug e i problemi segnalati dalla <a href="https://slack.milvus.io/">comunità</a> open-source.</p>
<p>Nella fase finale, se i criteri di rilascio sono soddisfatti, viene rilasciata una nuova immagine Docker della nuova versione di Milvus. Per il rilascio ufficiale è necessaria una nota di rilascio incentrata sulle nuove funzionalità e sui bug risolti e un tag di rilascio. Il team QA pubblicherà anche un rapporto di test su questo rilascio.</p>
<h2 id="Test-modules-in-Milvus" class="common-anchor-header">Moduli di test in Milvus<button data-href="#Test-modules-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Ci sono diversi moduli di test in Milvus e questa sezione spiegherà ogni modulo in dettaglio.</p>
<h3 id="Unit-test" class="common-anchor-header">Test unitario</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Unit_test_7d3d422345.png" alt="Unit test" class="doc-image" id="unit-test" />
   </span> <span class="img-wrapper"> <span>Test unitario</span> </span></p>
<p>I test delle unità possono aiutare a identificare i bug del software in una fase iniziale e fornire un criterio di verifica per la ristrutturazione del codice. Secondo i criteri di accettazione delle richieste di pull (PR) di Milvus, la <a href="https://app.codecov.io/gh/milvus-io/milvus/">copertura</a> dei test unitari del codice dovrebbe essere dell'80%.</p>
<h3 id="Function-test" class="common-anchor-header">Test di funzione</h3><p>I test di funzionamento in Milvus sono organizzati principalmente intorno a <a href="https://github.com/milvus-io/pymilvus">PyMilvus</a> e agli SDK. Lo scopo principale dei test di funzionamento è verificare se le interfacce possono funzionare come progettato. I test di funzionamento hanno due aspetti:</p>
<ul>
<li>Verificare se gli SDK possono restituire i risultati attesi quando vengono passati i parametri corretti.</li>
<li>Verificare se gli SDK sono in grado di gestire gli errori e di restituire messaggi di errore ragionevoli quando vengono passati parametri errati.</li>
</ul>
<p>La figura seguente illustra l'attuale struttura per i test di funzione, basata sul framework mainstream <a href="https://pytest.org/">pytest</a>. Questo framework aggiunge un wrapper a PyMilvus e potenzia i test con un'interfaccia di test automatizzata.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Function_test_41f837d3e7.png" alt="Function test" class="doc-image" id="function-test" />
   </span> <span class="img-wrapper"> <span>Test delle funzioni</span> </span></p>
<p>Considerando che è necessario un metodo di test condiviso e che alcune funzioni devono essere riutilizzate, viene adottato il framework di test di cui sopra, piuttosto che utilizzare direttamente l'interfaccia di PyMilvus. Il framework include anche un modulo "check" per rendere più agevole la verifica dei valori attesi e reali.</p>
<p>Nella directory <code translate="no">tests/python_client/testcases</code> sono stati inseriti ben 2.700 casi di test funzionali, che coprono quasi tutte le interfacce di PyMilvus. Questi test funzionali controllano rigorosamente la qualità di ogni PR.</p>
<h3 id="Deployment-test" class="common-anchor-header">Test di distribuzione</h3><p>Milvus è disponibile in due modalità: <a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">standalone</a> e <a href="https://milvus.io/docs/v2.0.x/install_cluster-docker.md">cluster</a>. Esistono due modi principali per distribuire Milvus: utilizzando Docker Compose o Helm. Dopo aver distribuito Milvus, gli utenti possono anche riavviare o aggiornare il servizio Milvus. Esistono due categorie principali di test di distribuzione: test di riavvio e test di aggiornamento.</p>
<p>Il test di riavvio si riferisce al processo di verifica della persistenza dei dati, cioè se i dati sono ancora disponibili dopo un riavvio. Il test di aggiornamento si riferisce al processo di verifica della compatibilità dei dati per evitare che vengano inseriti in Milvus formati di dati incompatibili. Entrambi i tipi di test di distribuzione condividono lo stesso flusso di lavoro, come illustrato nell'immagine seguente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deployment_test_342ab3b3f5.png" alt="Deployment test" class="doc-image" id="deployment-test" />
   </span> <span class="img-wrapper"> <span>Test di distribuzione</span> </span></p>
<p>In un test di riavvio, le due distribuzioni utilizzano la stessa immagine docker. In un test di aggiornamento, invece, il primo deployment utilizza un'immagine docker di una versione precedente, mentre il secondo deployment utilizza un'immagine docker di una versione successiva. I risultati e i dati del test vengono salvati nel file <code translate="no">Volumes</code> o nel <a href="https://kubernetes.io/docs/concepts/storage/persistent-volumes/">persistent volume claim</a> (PVC).</p>
<p>Durante l'esecuzione del primo test, vengono create più raccolte e vengono eseguite diverse operazioni su ciascuna raccolta. Quando si esegue il secondo test, l'obiettivo principale è verificare se le raccolte create sono ancora disponibili per le operazioni CRUD e se è possibile creare nuove raccolte.</p>
<h3 id="Reliability-test" class="common-anchor-header">Test di affidabilità</h3><p>I test sull'affidabilità di un sistema distribuito cloud-native adottano solitamente un metodo di ingegneria del caos, il cui scopo è quello di bloccare sul nascere gli errori e i guasti del sistema. In altre parole, in un test di ingegneria del caos, creiamo di proposito guasti del sistema per identificare i problemi nei test di pressione e risolvere i guasti del sistema prima che inizino davvero a creare pericoli. Durante un test sul caos in Milvus, scegliamo <a href="https://chaos-mesh.org/">Chaos Mesh</a> come strumento per creare il caos. Ci sono diversi tipi di guasti da creare:</p>
<ul>
<li><strong>Pod kill</strong>: una simulazione dello scenario in cui i nodi sono fuori uso.</li>
<li><strong>Fallimento del pod</strong>: Verifica se uno dei pod dei nodi worker si guasta e se l'intero sistema può continuare a funzionare.</li>
<li><strong>Memory stress</strong>: simulazione di un forte consumo di risorse di memoria e CPU da parte dei nodi di lavoro.</li>
<li><strong>Partizione di rete</strong>: Poiché Milvus <a href="https://milvus.io/docs/v2.0.x/four_layers.md">separa l'archiviazione dall'elaborazione</a>, il sistema si basa molto sulla comunicazione tra i vari componenti. Per verificare l'interdipendenza dei diversi componenti di Milvus, è necessaria una simulazione dello scenario in cui la comunicazione tra i diversi pod è partizionata.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Reliability_test_a7331b91f4.png" alt="Reliability test" class="doc-image" id="reliability-test" />
   </span> <span class="img-wrapper"> <span>Test di affidabilità</span> </span></p>
<p>La figura precedente mostra il framework di test di affidabilità di Milvus che può automatizzare i test di caos. Il flusso di lavoro di un test di affidabilità è il seguente:</p>
<ol>
<li>Inizializzare un cluster Milvus leggendo le configurazioni di distribuzione.</li>
<li>Quando il cluster è pronto, si esegue <code translate="no">test_e2e.py</code> per verificare se le funzionalità di Milvus sono disponibili.</li>
<li>Eseguire <code translate="no">hello_milvus.py</code> per verificare la persistenza dei dati. Creare una collezione chiamata "hello_milvus" per l'inserimento dei dati, il flush, la costruzione dell'indice, la ricerca vettoriale e l'interrogazione. Questa collezione non verrà rilasciata o abbandonata durante il test.</li>
<li>Creare un oggetto di monitoraggio che avvii sei thread che eseguano le operazioni di creazione, inserimento, lavaggio, indicizzazione, ricerca e interrogazione.</li>
</ol>
<pre><code translate="no">checkers = {
    Op.create: CreateChecker(),
    Op.insert: InsertFlushChecker(),
    Op.flush: InsertFlushChecker(flush=<span class="hljs-literal">True</span>),
    Op.index: IndexChecker(),
    Op.search: SearchChecker(),
    Op.query: QueryChecker()
}
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>Eseguire la prima asserzione: tutte le operazioni hanno successo come previsto.</li>
<li>Introdurre un errore di sistema in Milvus utilizzando Chaos Mesh per analizzare il file yaml che definisce l'errore. Un guasto può essere, ad esempio, l'uccisione del nodo di interrogazione ogni cinque secondi.</li>
<li>Fare la seconda affermazione durante l'introduzione di un errore di sistema: giudicare se i risultati restituiti dalle operazioni in Milvus durante un errore di sistema corrispondono alle aspettative.</li>
<li>Eliminare il guasto tramite Chaos Mesh.</li>
<li>Quando il servizio Milvus viene ripristinato (cioè tutti i pod sono pronti), fare la terza asserzione: tutte le operazioni hanno avuto successo come previsto.</li>
<li>Eseguire <code translate="no">test_e2e.py</code> per verificare se le funzionalità di Milvus sono disponibili. Alcune operazioni durante il caos potrebbero essere bloccate a causa della terza asserzione. E anche dopo che il caos è stato eliminato, alcune operazioni potrebbero continuare a essere bloccate, impedendo alla terza asserzione di avere successo come previsto. Questo passo ha lo scopo di facilitare la terza asserzione e serve come standard per verificare se il servizio Milvus si è ripreso.</li>
<li>Eseguire <code translate="no">hello_milvus.py</code>, caricare la raccolta creata ed eseguire operazioni CRUP sulla raccolta. Quindi, verificare se i dati esistenti prima del guasto del sistema sono ancora disponibili dopo il ripristino del guasto.</li>
<li>Raccogliere i log.</li>
</ol>
<h3 id="Stability-and-performance-test" class="common-anchor-header">Test di stabilità e prestazioni</h3><p>La figura seguente descrive gli scopi, gli scenari di test e le metriche dei test di stabilità e prestazioni.</p>
<table>
<thead>
<tr><th></th><th>Test di stabilità</th><th>Test delle prestazioni</th></tr>
</thead>
<tbody>
<tr><td>Scopi</td><td>- Assicurarsi che Milvus possa funzionare senza problemi per un periodo di tempo determinato con un carico di lavoro normale. <br> - Assicurarsi che le risorse vengano consumate in modo stabile all'avvio del servizio Milvus.</td><td>- Testare le prestazioni di tutte le interfacce di Milvus. <br> - Trovare la configurazione ottimale con l'aiuto dei test di prestazione.  <br> - Servono come benchmark per le versioni future. <br> - Individuare i colli di bottiglia che ostacolano il miglioramento delle prestazioni.</td></tr>
<tr><td>Scenari</td><td>- Scenario offline ad alta intensità di lettura, in cui i dati sono appena aggiornati dopo l'inserimento e la percentuale di elaborazione di ciascun tipo di richiesta è: richiesta di ricerca 90%, richiesta di inserimento 5%, altri 5%. <br> - Scenario online ad alta intensità di scrittura, in cui i dati vengono inseriti e ricercati simultaneamente e la percentuale di elaborazione di ciascun tipo di richiesta è: richiesta di inserimento 50%, richiesta di ricerca 40%, altre 10%.</td><td>- Inserimento dei dati <br> - Costruzione dell'indice <br> - Ricerca vettoriale</td></tr>
<tr><td>Metriche</td><td>- Utilizzo della memoria <br> - Consumo di CPU <br> - Latenza IO <br> - Stato dei pod Milvus <br> - Tempo di risposta del servizio Milvus <br> ecc.</td><td>- Il throughput dei dati durante l'inserimento dei dati <br> - Il tempo necessario per costruire un indice <br> - Tempo di risposta durante una ricerca vettoriale <br> - Interrogazione al secondo (QPS) <br> - Richiesta al secondo  <br> - Tasso di richiamo <br> ecc.</td></tr>
</tbody>
</table>
<p>Sia il test di stabilità che il test delle prestazioni condividono lo stesso flusso di lavoro:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Stability_and_performance_test_6ed8532697.png" alt="Stability and performance test" class="doc-image" id="stability-and-performance-test" />
   </span> <span class="img-wrapper"> <span>Test di stabilità e prestazioni</span> </span></p>
<ol>
<li>Analizzare e aggiornare le configurazioni e definire le metriche. <code translate="no">server-configmap</code> corrisponde alla configurazione di Milvus standalone o cluster, mentre <code translate="no">client-configmap</code> corrisponde alle configurazioni dei casi di test.</li>
<li>Configurare il server e il client.</li>
<li>Preparazione dei dati</li>
<li>Richiesta di interazione tra il server e il client.</li>
<li>Report e visualizzazione delle metriche.</li>
</ol>
<h2 id="Tools-and-methods-for-better-QA-efficiency" class="common-anchor-header">Strumenti e metodi per una migliore efficienza della QA<button data-href="#Tools-and-methods-for-better-QA-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>Dalla sezione dedicata ai test dei moduli, si può notare che la procedura per la maggior parte dei test è in realtà quasi la stessa, e comporta principalmente la modifica delle configurazioni del server e del client Milvus e il passaggio dei parametri API. Quando ci sono più configurazioni, più varia è la combinazione delle diverse configurazioni, più numerosi sono gli scenari di prova che questi esperimenti e test possono coprire. Di conseguenza, il riutilizzo di codici e procedure è ancora più importante per migliorare l'efficienza dei test.</p>
<h3 id="SDK-test-framework" class="common-anchor-header">Struttura di test SDK</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/SDK_test_framework_8219e28f4c.png" alt="SDK test framework" class="doc-image" id="sdk-test-framework" />
   </span> <span class="img-wrapper"> <span>Struttura di test SDK</span> </span></p>
<p>Per accelerare il processo di test, possiamo aggiungere un wrapper <code translate="no">API_request</code> al framework di test originale e impostarlo come qualcosa di simile a un gateway API. Questo gateway API si occuperà di raccogliere tutte le richieste API e di passarle a Milvus per ricevere collettivamente le risposte. Queste risposte saranno poi ritrasmesse al cliente. Questa struttura rende molto più semplice la cattura di alcune informazioni di log, come i parametri e i risultati restituiti. Inoltre, il componente checker del framework di test SDK può verificare ed esaminare i risultati di Milvus. Tutti i metodi di verifica possono essere definiti all'interno di questo componente checker.</p>
<p>Con il framework di test SDK, alcuni processi di inizializzazione cruciali possono essere racchiusi in un'unica funzione. In questo modo, è possibile eliminare grandi porzioni di codice noioso.</p>
<p>È inoltre da notare che ogni singolo caso di test è collegato a una collezione unica per garantire l'isolamento dei dati.</p>
<p>Durante l'esecuzione dei casi di test,<code translate="no">pytest-xdist</code>, l'estensione di pytest, può essere sfruttata per eseguire tutti i singoli casi di test in parallelo, aumentando notevolmente l'efficienza.</p>
<h3 id="GitHub-action" class="common-anchor-header">Azione GitHub</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Git_Hub_action_c3c1bed591.png" alt="GitHub action" class="doc-image" id="github-action" />
   </span> <span class="img-wrapper"> <span>Azione GitHub</span> </span></p>
<p>Anche<a href="https://docs.github.com/en/actions">GitHub Action</a> viene adottato per migliorare l'efficienza della QA per le sue caratteristiche:</p>
<ul>
<li>È uno strumento CI/CD nativo profondamente integrato con GitHub.</li>
<li>Viene fornito con un ambiente macchina uniformemente configurato e con strumenti di sviluppo software comuni preinstallati, tra cui Docker, Docker Compose, ecc.</li>
<li>Supporta diversi sistemi operativi e versioni, tra cui Ubuntu, MacOs, Windows-server, ecc.</li>
<li>Ha un marketplace che offre ricche estensioni e funzioni out-of-box.</li>
<li>La sua matrice supporta lavori simultanei e il riutilizzo dello stesso flusso di test per migliorare l'efficienza.</li>
</ul>
<p>Oltre alle caratteristiche di cui sopra, un altro motivo per adottare GitHub Action è che i test di distribuzione e di affidabilità richiedono un ambiente indipendente e isolato. E GitHub Action è ideale per i controlli quotidiani su insiemi di dati di piccole dimensioni.</p>
<h3 id="Tools-for-benchmark-tests" class="common-anchor-header">Strumenti per i test di benchmark</h3><p>Per rendere più efficienti i test QA, si utilizzano diversi strumenti.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_1_13_fbc71dfe4f.png" alt="QA tools" class="doc-image" id="qa-tools" />
   </span> <span class="img-wrapper"> <span>Strumenti QA</span> </span></p>
<ul>
<li><a href="https://argoproj.github.io/">Argo</a>: un insieme di strumenti open-source per Kubernetes per l'esecuzione di flussi di lavoro e la gestione di cluster mediante la pianificazione di attività. Può anche consentire l'esecuzione di più attività in parallelo.</li>
<li><a href="https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/">Kubernetes dashboard</a>: interfaccia utente di Kubernetes basata sul web per la visualizzazione di <code translate="no">server-configmap</code> e <code translate="no">client-configmap</code>.</li>
<li><a href="https://en.wikipedia.org/wiki/Network-attached_storage">NAS</a>: Network attached storage (NAS) è un server di archiviazione dati a livello di file per conservare i comuni set di dati di benchmark ANN.</li>
<li><a href="https://www.influxdata.com/">InfluxDB</a> e <a href="https://www.mongodb.com/">MongoDB</a>: database per il salvataggio dei risultati dei test di benchmark.</li>
<li><a href="https://grafana.com/">Grafana</a>: Una soluzione open-source di analisi e monitoraggio per il controllo delle metriche delle risorse del server e delle prestazioni del client.</li>
<li><a href="https://redash.io/">Redash</a>: Un servizio che aiuta a visualizzare i dati e a creare grafici per i test di benchmark.</li>
</ul>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">Informazioni sulla serie Deep Dive<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Con l'<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">annuncio ufficiale della disponibilità generale</a> di Milvus 2.0, abbiamo organizzato questa serie di blog Milvus Deep Dive per fornire un'interpretazione approfondita dell'architettura e del codice sorgente di Milvus. Gli argomenti trattati in questa serie di blog includono:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Panoramica dell'architettura Milvus</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">API e SDK Python</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Elaborazione dei dati</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Gestione dei dati</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Interrogazione in tempo reale</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Motore di esecuzione scalare</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">Sistema QA</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Motore di esecuzione vettoriale</a></li>
</ul>
