---
id: build-multi-tenancy-rag-with-milvus-best-practices-part-one.md
title: >-
  Progettazione di RAG multi-tenancy con Milvus: le migliori pratiche per basi
  di conoscenza aziendali scalabili
author: Robert Guo
date: 2024-12-04T00:00:00.000Z
cover: assets.zilliz.com/Designing_Multi_Tenancy_RAG_with_Milvus_40b3737145.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/build-multi-tenancy-rag-with-milvus-best-practices-part-one
---
<h2 id="Introduction" class="common-anchor-header">Introduzione<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Negli ultimi due anni, la <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval-Augmented Generation (RAG)</a> è emersa come una soluzione affidabile per le grandi organizzazioni per migliorare le loro applicazioni <a href="https://zilliz.com/glossary/large-language-models-(llms)">basate su LLM</a>, soprattutto quelle con utenti diversi. Con la crescita di tali applicazioni, l'implementazione di un framework multi-tenancy diventa essenziale. La <strong>multi-tenancy</strong> fornisce un accesso sicuro e isolato ai dati per diversi gruppi di utenti, garantendo la fiducia degli utenti, il rispetto degli standard normativi e il miglioramento dell'efficienza operativa.</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvus</a> è un <a href="https://zilliz.com/learn/what-is-vector-database">database vettoriale</a> open-source costruito per gestire <a href="https://zilliz.com/glossary/vector-embeddings">dati vettoriali</a> ad alta dimensione. È un componente indispensabile dell'infrastruttura di RAG, che memorizza e recupera informazioni contestuali per gli LLM da fonti esterne. Milvus offre <a href="https://milvus.io/docs/multi_tenancy.md">strategie flessibili di multi-tenancy</a> per varie esigenze, tra cui <strong>multi-tenancy a livello di database, di collezione e di partizione</strong>.</p>
<p>In questo post tratteremo di:</p>
<ul>
<li><p>Cos'è la multi-tenancy e perché è importante</p></li>
<li><p>Strategie di multi-tenancy in Milvus</p></li>
<li><p>Esempio: Strategia di multi-tenancy per una Knowledge Base aziendale alimentata da RAG</p></li>
</ul>
<h2 id="What-is-Multi-Tenancy-and-Why-It-Matters" class="common-anchor-header">Cos'è la multi-tenancy e perché è importante<button data-href="#What-is-Multi-Tenancy-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p>La<a href="https://milvus.io/docs/multi_tenancy.md"><strong>multi-tenancy</strong></a> è un'architettura in cui più clienti o team, noti come &quot;<strong>tenant&quot;,</strong> condividono una singola istanza di un'applicazione o di un sistema. I dati e le configurazioni di ciascun tenant sono logicamente isolati, garantendo privacy e sicurezza, mentre tutti i tenant condividono la stessa infrastruttura sottostante.</p>
<p>Immaginate una piattaforma SaaS che fornisce soluzioni basate sulla conoscenza a più aziende. Ogni azienda è un tenant.</p>
<ul>
<li><p>L'inquilino A è un'organizzazione sanitaria che archivia FAQ rivolte ai pazienti e documenti di conformità.</p></li>
<li><p>L'inquilino B è un'azienda tecnologica che gestisce i flussi di lavoro interni per la risoluzione dei problemi IT.</p></li>
<li><p>L'inquilino C è un'azienda di vendita al dettaglio con FAQ per il servizio clienti per la restituzione dei prodotti.</p></li>
</ul>
<p>Ogni tenant opera in un ambiente completamente isolato, garantendo che nessun dato del tenant A trapeli nel sistema del tenant B o viceversa. Inoltre, l'allocazione delle risorse, le prestazioni delle query e le decisioni di scaling sono specifiche per ogni tenant, garantendo prestazioni elevate indipendentemente dai picchi di carico di lavoro di un tenant.</p>
<p>La multi-tenancy funziona anche per i sistemi che servono team diversi all'interno della stessa organizzazione. Immaginate una grande azienda che utilizza una base di conoscenza alimentata da RAG per servire i suoi dipartimenti interni, come HR, Legal e Marketing. In questa configurazione, ogni <strong>reparto è un tenant</strong> con dati e risorse isolate.</p>
<p>La multi-tenancy offre vantaggi significativi, tra cui l'<strong>efficienza dei costi, la scalabilità e la sicurezza dei dati</strong>. Condividendo un'unica infrastruttura, i fornitori di servizi possono ridurre i costi generali e garantire un consumo più efficace delle risorse. Inoltre, questo approccio è facilmente scalabile: l'inserimento di nuovi locatari richiede molte meno risorse rispetto alla creazione di istanze separate per ciascuno di essi, come avviene nei modelli single-tenancy. Inoltre, la multi-tenancy garantisce una solida sicurezza dei dati, assicurando un rigoroso isolamento dei dati per ciascun tenant, con controlli di accesso e crittografia che proteggono le informazioni sensibili da accessi non autorizzati. Inoltre, gli aggiornamenti, le patch e le nuove funzionalità possono essere distribuite simultaneamente su tutti i tenant, semplificando la manutenzione del sistema e riducendo l'onere per gli amministratori, garantendo al contempo il rispetto costante degli standard di sicurezza e conformità.</p>
<h2 id="Multi-Tenancy-Strategies-in-Milvus" class="common-anchor-header">Strategie Multi-Tenancy in Milvus<button data-href="#Multi-Tenancy-Strategies-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Per capire come Milvus supporta la multi-tenancy, è importante prima vedere come organizza i dati degli utenti.</p>
<h3 id="How-Milvus-Organizes-User-Data" class="common-anchor-header">Come Milvus organizza i dati degli utenti</h3><p>Milvus struttura i dati su tre livelli, da ampio a granulare: <a href="https://milvus.io/docs/manage_databases.md"><strong>Database</strong></a>, <a href="https://milvus.io/docs/manage-collections.md"><strong>Raccolta</strong></a> e <a href="https://milvus.io/docs/manage-partitions.md"><strong>Partizione/Chiave di partizione</strong></a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_How_Milvus_organizes_user_data_4521c4b8f9.png" alt="Figure- How Milvus organizes user data .png" class="doc-image" id="figure--how-milvus-organizes-user-data-.png" />
   </span> <span class="img-wrapper"> <span>Figura - Come Milvus organizza i dati degli utenti .png</span> </span></p>
<p><em>Figura: Come Milvus organizza i dati degli utenti</em></p>
<ul>
<li><p><strong>Database</strong>: Funge da contenitore logico, simile a un database nei sistemi relazionali tradizionali.</p></li>
<li><p><strong>Raccolta</strong>: Paragonabile a una tabella di un database, una raccolta organizza i dati in gruppi gestibili.</p></li>
<li><p><strong>Partizione/chiave di partizione</strong>: All'interno di una raccolta, i dati possono essere ulteriormente segmentati da <strong>partizioni</strong>. Utilizzando una <strong>chiave di partizione</strong>, i dati con la stessa chiave vengono raggruppati insieme. Ad esempio, se si utilizza un <strong>ID utente</strong> come <strong>chiave di partizione</strong>, tutti i dati di un utente specifico saranno archiviati nello stesso segmento logico. In questo modo è facile recuperare i dati legati ai singoli utenti.</p></li>
</ul>
<p>Passando da <strong>Database</strong> a <strong>Raccolta</strong> a <strong>Chiave di partizione</strong>, la granularità dell'organizzazione dei dati diventa progressivamente più fine.</p>
<p>Per garantire una maggiore sicurezza dei dati e un adeguato controllo degli accessi, Milvus offre anche un solido <a href="https://zilliz.com/blog/enabling-fine-grained-access-control-with-milvus-row-level-rbac"><strong>controllo degli accessi basato sui ruoli (RBAC)</strong></a>, che consente agli amministratori di definire autorizzazioni specifiche per ogni utente. Solo gli utenti autorizzati possono accedere a determinati dati.</p>
<p>Milvus supporta <a href="https://milvus.io/docs/multi_tenancy.md">diverse strategie</a> per l'implementazione della multi-tenancy, offrendo flessibilità in base alle esigenze della vostra applicazione: <strong>multi-tenancy a livello di database, a livello di collezione e a livello di partizione</strong>.</p>
<h3 id="Database-Level-Multi-Tenancy" class="common-anchor-header">Multi-tenancy a livello di database</h3><p>Con l'approccio multi-tenancy a livello di database, a ogni tenant viene assegnato il proprio database all'interno dello stesso cluster Milvus. Questa strategia offre un forte isolamento dei dati e garantisce prestazioni di ricerca ottimali. Tuttavia, può portare a un utilizzo inefficiente delle risorse se alcuni tenant rimangono inattivi.</p>
<h3 id="Collection-Level-Multi-Tenancy" class="common-anchor-header">Multi-tenancy a livello di collezione</h3><p>In questo caso, con la multi-tenancy a livello di collezione, possiamo organizzare i dati per i tenant in due modi.</p>
<ul>
<li><p><strong>Una collezione per tutti i tenant</strong>: Tutti gli affittuari condividono un'unica collezione, con campi specifici per gli affittuari usati per il filtraggio. Sebbene sia semplice da implementare, questo approccio può incontrare dei colli di bottiglia nelle prestazioni all'aumentare del numero di inquilini.</p></li>
<li><p><strong>Una raccolta per tenant</strong>: Ogni tenant può avere una raccolta dedicata, migliorando l'isolamento e le prestazioni, ma richiedendo più risorse. Questa configurazione può incontrare limiti di scalabilità se il numero di tenant supera la capacità di raccolta di Milvus.</p></li>
</ul>
<h3 id="Partition-Level-Multi-Tenancy" class="common-anchor-header">Multi-tenancy a livello di partizione</h3><p>Il Partition-Level Multi-Tenancy si concentra sull'organizzazione dei tenant all'interno di una singola collezione. Anche in questo caso esistono due modi per organizzare i dati dei tenant.</p>
<ul>
<li><p><strong>Una partizione per inquilino</strong>: I tenant condividono una collezione, ma i loro dati sono archiviati in partizioni separate. È possibile isolare i dati assegnando a ogni tenant una partizione dedicata, bilanciando isolamento e prestazioni di ricerca. Tuttavia, questo approccio è limitato dal limite massimo di partizioni di Milvus.</p></li>
<li><p><strong>Multi-tenancy basato su chiavi di partizione</strong>: Si tratta di un'opzione più scalabile in cui una singola collezione utilizza chiavi di partizione per distinguere i tenant. Questo metodo semplifica la gestione delle risorse e supporta una maggiore scalabilità, ma non supporta gli inserimenti di dati in massa.</p></li>
</ul>
<p>La tabella seguente riassume le differenze principali tra i principali approcci multi-tenancy.</p>
<table>
<thead>
<tr><th><strong>Granularità</strong></th><th><strong>A livello di database</strong></th><th><strong>Livello di raccolta</strong></th><th><strong>Livello chiave di partizione</strong></th></tr>
</thead>
<tbody>
<tr><td>Inquilini massimi supportati</td><td>~1,000</td><td>~10,000</td><td>~10,000,000</td></tr>
<tr><td>Flessibilità dell'organizzazione dei dati</td><td>Alta: gli utenti possono definire collezioni multiple con schemi personalizzati.</td><td>Media: Gli utenti sono limitati a una sola raccolta con uno schema personalizzato.</td><td>Bassa: tutti gli utenti condividono una raccolta, che richiede uno schema coerente.</td></tr>
<tr><td>Costo per utente</td><td>Alto</td><td>medio</td><td>Basso</td></tr>
<tr><td>Isolamento fisico delle risorse</td><td>Sì</td><td>Sì</td><td>No</td></tr>
<tr><td>RBAC</td><td>Sì</td><td>Sì</td><td>No</td></tr>
<tr><td>Prestazioni di ricerca</td><td>Forte</td><td>Medio</td><td>Forte</td></tr>
</tbody>
</table>
<h2 id="Example-Multi-Tenancy-Strategy-for-a-RAG-Powered-Enterprise-Knowledge-Base" class="common-anchor-header">Esempio: Strategia multi-tenancy per una Knowledge Base aziendale alimentata da RAG<button data-href="#Example-Multi-Tenancy-Strategy-for-a-RAG-Powered-Enterprise-Knowledge-Base" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando si progetta la strategia multi-tenancy per un sistema RAG, è essenziale allineare l'approccio alle esigenze specifiche dell'azienda e dei tenant. Milvus offre diverse strategie multi-tenancy e la scelta di quella giusta dipende dal numero di tenant, dai loro requisiti e dal livello di isolamento dei dati necessario. Ecco una guida pratica per prendere queste decisioni, prendendo come esempio una knowledge base aziendale alimentata da RAG.</p>
<h3 id="Understanding-Tenant-Structure-Before-Choosing-a-Multi-Tenancy-Strategy" class="common-anchor-header">Capire la struttura dei tenant prima di scegliere una strategia multi-tenancy</h3><p>Una knowledge base aziendale alimentata da RAG spesso serve un numero ridotto di tenant. Questi tenant sono di solito unità aziendali indipendenti come IT, Vendite, Legale e Marketing, ognuna delle quali richiede servizi di knowledge base distinti. Ad esempio, il reparto Risorse Umane gestisce informazioni sensibili sui dipendenti, come le guide all'ingresso e le politiche di benefit, che devono essere riservate e accessibili solo al personale delle Risorse Umane.</p>
<p>In questo caso, ogni unità aziendale deve essere trattata come un tenant separato e una <strong>strategia multi-tenancy a livello di database</strong> è spesso la più adatta. Assegnando database dedicati a ciascun tenant, le organizzazioni possono ottenere un forte isolamento logico, semplificando la gestione e migliorando la sicurezza. Questa configurazione offre ai tenant una notevole flessibilità: possono definire modelli di dati personalizzati all'interno delle collezioni, creare tutte le collezioni necessarie e gestire in modo indipendente il controllo degli accessi alle proprie collezioni.</p>
<h3 id="Enhancing-Security-with-Physical-Resource-Isolation" class="common-anchor-header">Migliorare la sicurezza con l'isolamento fisico delle risorse</h3><p>In situazioni in cui la sicurezza dei dati è altamente prioritaria, l'isolamento logico a livello di database potrebbe non essere sufficiente. Ad esempio, alcune unità aziendali potrebbero gestire dati critici o altamente sensibili, richiedendo maggiori garanzie contro le interferenze di altri tenant. In questi casi, possiamo implementare un <a href="https://milvus.io/docs/resource_group.md">approccio di isolamento fisico</a> in cima a una struttura multi-tenancy a livello di database.</p>
<p>Milvus ci permette di mappare componenti logici, come database e collezioni, su risorse fisiche. Questo metodo garantisce che le attività degli altri tenant non abbiano un impatto sulle operazioni critiche. Vediamo come funziona questo approccio nella pratica.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_How_Milvus_manages_physical_resources_6269b908d7.png" alt="Figure- How Milvus manages physical resources.png" class="doc-image" id="figure--how-milvus-manages-physical-resources.png" />
   </span> <span class="img-wrapper"> <span>Figura - Come Milvus gestisce le risorse fisiche.png</span> </span></p>
<p>Figura: Come Milvus gestisce le risorse fisiche</p>
<p>Come mostrato nel diagramma precedente, in Milvus ci sono tre livelli di gestione delle risorse: <strong>Query Node</strong>, <strong>Resource Group</strong> e <strong>Database</strong>.</p>
<ul>
<li><p><strong>Nodo di interrogazione</strong>: Il componente che elabora le attività di interrogazione. Viene eseguito su una macchina fisica o su un container (ad esempio, un pod in Kubernetes).</p></li>
<li><p><strong>Gruppo di risorse</strong>: Un insieme di Query Node che fa da ponte tra i componenti logici (database e collezioni) e le risorse fisiche. È possibile allocare uno o più database o raccolte a un singolo Gruppo di risorse.</p></li>
</ul>
<p>Nell'esempio mostrato nel diagramma precedente, ci sono tre <strong>database</strong> logici: X, Y e Z.</p>
<ul>
<li><p><strong>Database X</strong>: contiene la <strong>raccolta A</strong>.</p></li>
<li><p><strong>Database Y</strong>: contiene le <strong>raccolte B</strong> e <strong>C</strong>.</p></li>
<li><p><strong>Database Z</strong>: contiene le <strong>raccolte D</strong> ed <strong>E</strong>.</p></li>
</ul>
<p>Supponiamo che il <strong>Database X</strong> contenga una base di conoscenza critica che non vogliamo sia influenzata dal carico del <strong>Database Y</strong> o del <strong>Database Z</strong>. Per garantire l'isolamento dei dati:</p>
<ul>
<li><p>Al<strong>database X</strong> viene assegnato un proprio <strong>gruppo di risorse</strong> per garantire che la sua base di conoscenza critica non sia influenzata dai carichi di lavoro di altri database.</p></li>
<li><p>Anche la<strong>raccolta E</strong> è assegnata a un <strong>gruppo di risorse</strong> separato all'interno del database padre<strong>(Z</strong>). In questo modo si ottiene l'isolamento a livello di collezione per specifici dati critici all'interno di un database condiviso.</p></li>
</ul>
<p>Nel frattempo, le restanti collezioni nei <strong>database Y</strong> e <strong>Z</strong> condividono le risorse fisiche del <strong>gruppo di risorse 2</strong>.</p>
<p>Grazie a un'attenta mappatura dei componenti logici sulle risorse fisiche, le organizzazioni possono ottenere un'architettura multi-tenancy flessibile, scalabile e sicura, adatta alle loro specifiche esigenze aziendali.</p>
<h3 id="Designing-End-User-Level-Access" class="common-anchor-header">Progettazione dell'accesso a livello di utente finale</h3><p>Dopo aver appreso le migliori pratiche per la scelta di una strategia multi-tenancy per una RAG aziendale, analizziamo come progettare l'accesso a livello utente in questi sistemi.</p>
<p>In questi sistemi, gli utenti finali di solito interagiscono con la base di conoscenza in modalità di sola lettura attraverso gli LLM. Tuttavia, le organizzazioni hanno ancora bisogno di tenere traccia dei dati Q&amp;A generati dagli utenti e di collegarli a utenti specifici per vari scopi, come migliorare l'accuratezza della base di conoscenza o offrire servizi personalizzati.</p>
<p>Prendiamo ad esempio il banco di consultazione intelligente di un ospedale. I pazienti potrebbero porre domande come: "Ci sono appuntamenti disponibili con lo specialista oggi?" o "È necessaria una preparazione specifica per il mio prossimo intervento?". Anche se queste domande non hanno un impatto diretto sulla base di conoscenza, è importante per l'ospedale tenere traccia di queste interazioni per migliorare i servizi. Queste coppie di domande e risposte vengono solitamente archiviate in un database separato (non necessariamente un database vettoriale) dedicato alla registrazione delle interazioni.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Figure_The_multi_tenancy_architecture_for_an_enterprise_RAG_knowledge_base_7c9ad8d4d1.png" alt="Figure- The multi-tenancy architecture for an enterprise RAG knowledge base .png" class="doc-image" id="figure--the-multi-tenancy-architecture-for-an-enterprise-rag-knowledge-base-.png" />
   </span> <span class="img-wrapper"> <span>Figura - L'architettura multi-tenancy per una base di conoscenza RAG aziendale .png</span> </span></p>
<p><em>Figura: L'architettura multi-tenancy per una base di conoscenza RAG aziendale</em></p>
<p>Il diagramma precedente mostra l'architettura multi-tenancy di un sistema RAG aziendale.</p>
<ul>
<li><p><strong>Gli amministratori di sistema</strong> supervisionano il sistema RAG, gestiscono l'allocazione delle risorse, assegnano i database, li mappano ai gruppi di risorse e assicurano la scalabilità. Gestiscono l'infrastruttura fisica, come mostrato nel diagramma, dove ogni gruppo di risorse (ad esempio, i gruppi di risorse 1, 2 e 3) è mappato su server fisici (nodi di interrogazione).</p></li>
<li><p><strong>Gli affittuari (proprietari di database e sviluppatori)</strong> gestiscono la base di conoscenza, iterandola sulla base dei dati Q&amp;A generati dagli utenti, come mostrato nel diagramma. I diversi database (Database X, Y, Z) contengono collezioni con diversi contenuti della base di conoscenza (Collezione A, B, ecc.).</p></li>
<li><p><strong>Gli utenti finali</strong> interagiscono con il sistema in sola lettura attraverso il LLM. Quando interrogano il sistema, le loro domande vengono registrate nella tabella dei record Q&amp;A (un database separato), alimentando continuamente il sistema con dati preziosi.</p></li>
</ul>
<p>Questo progetto garantisce che ogni livello del processo, dall'interazione con l'utente all'amministrazione del sistema, funzioni senza problemi, aiutando l'organizzazione a costruire una base di conoscenze solida e in continuo miglioramento.</p>
<h2 id="Summary" class="common-anchor-header">Sintesi<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>In questo blog abbiamo analizzato come i framework <a href="https://milvus.io/docs/multi_tenancy.md"><strong>multi-tenancy</strong></a> svolgano un ruolo fondamentale per la scalabilità, la sicurezza e le prestazioni delle basi di conoscenza alimentate da RAG. Isolando i dati e le risorse per i diversi tenancy, le aziende possono garantire la privacy, la conformità alle normative e l'allocazione ottimizzata delle risorse in un'infrastruttura condivisa. <a href="https://milvus.io/docs/overview.md">Milvus</a>, con le sue strategie flessibili di multi-tenancy, consente alle aziende di scegliere il giusto livello di isolamento dei dati, dal livello di database a quello di partizione, in base alle loro esigenze specifiche. La scelta del giusto approccio multi-tenancy garantisce alle aziende di fornire servizi su misura ai tenant, anche quando si tratta di dati e carichi di lavoro diversi.</p>
<p>Seguendo le best practice qui descritte, le aziende possono progettare e gestire efficacemente sistemi RAG multi-tenancy che non solo offrono un'esperienza utente di qualità superiore, ma anche scalano senza problemi in base all'aumento delle esigenze aziendali. L'architettura di Milvus garantisce alle aziende alti livelli di isolamento, sicurezza e prestazioni, rendendola un componente cruciale nella costruzione di basi di conoscenza di livello aziendale alimentate da RAG.</p>
<h2 id="Stay-Tuned-for-More-Insights-into-Multi-Tenancy-RAG" class="common-anchor-header">Restate sintonizzati per ulteriori approfondimenti su RAG Multi-Tenancy<button data-href="#Stay-Tuned-for-More-Insights-into-Multi-Tenancy-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>In questo blog abbiamo discusso di come le strategie multi-tenancy di Milvus siano progettate per gestire i tenant, ma non gli utenti finali all'interno di questi tenant. Le interazioni con gli utenti finali avvengono di solito a livello di applicazione, mentre il database vettoriale stesso rimane all'oscuro di questi utenti.</p>
<p>Vi starete chiedendo: <em>Se voglio fornire risposte più precise in base alla cronologia delle query di ogni utente finale, Milvus non deve mantenere un contesto Q&amp;A personalizzato per ogni utente?</em></p>
<p>È una bella domanda e la risposta dipende dal caso d'uso. Ad esempio, in un servizio di consultazione on-demand, le richieste sono casuali e l'attenzione principale è rivolta alla qualità della base di conoscenze piuttosto che alla conservazione del contesto storico dell'utente.</p>
<p>In altri casi, invece, i sistemi RAG devono essere consapevoli del contesto. Quando ciò è richiesto, Milvus deve collaborare con il livello applicativo per mantenere una memoria personalizzata del contesto di ciascun utente. Questa progettazione è particolarmente importante per le applicazioni con un numero elevato di utenti finali, che analizzeremo in dettaglio nel prossimo post. Restate sintonizzati per ulteriori approfondimenti!</p>
