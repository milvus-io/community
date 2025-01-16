---
id: deep-dive-2-milvus-sdk-and-api.md
title: Introduzione all'SDK e all'API Milvus Python
author: Xuan Yang
date: 2022-03-21T00:00:00.000Z
desc: >-
  Scoprite come gli SDK interagiscono con Milvus e perché le API in stile ORM vi
  aiutano a gestire meglio Milvus.
cover: assets.zilliz.com/20220322_175856_e8e7bea7dc.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220322_175856_e8e7bea7dc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>Immagine di copertina</span> </span></p>
<p>Di <a href="https://github.com/XuanYang-cn">Xuan Yang</a></p>
<h2 id="Background" class="common-anchor-header">Sfondo<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>La figura seguente illustra l'interazione tra gli SDK e Milvus attraverso gRPC. Immaginiamo che Milvus sia una scatola nera. I buffer di protocollo sono utilizzati per definire le interfacce del server e la struttura delle informazioni che trasportano. Pertanto, tutte le operazioni nella scatola nera Milvus sono definite dalle API di protocollo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/SDK_10c9673111.png" alt="Interaction" class="doc-image" id="interaction" />
   </span> <span class="img-wrapper"> <span>Interazione</span> </span></p>
<h2 id="Milvus-Protocol-API" class="common-anchor-header">API di protocollo Milvus<button data-href="#Milvus-Protocol-API" class="anchor-icon" translate="no">
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
    </button></h2><p>L'API di protocollo Milvus è costituita da <code translate="no">milvus.proto</code>, <code translate="no">common.proto</code>, e <code translate="no">schema.proto</code>, che sono file di Protocol Buffers con il suffisso <code translate="no">.proto</code>. Per garantire il corretto funzionamento, gli SDK devono interagire con Milvus con questi file Protocol Buffers.</p>
<h3 id="milvusproto" class="common-anchor-header">milvus.proto</h3><p><code translate="no">milvus.proto</code> è il componente fondamentale dell'API di protocollo di Milvus, perché definisce l'interfaccia <code translate="no">MilvusService</code>, che definisce ulteriormente tutte le interfacce RPC di Milvus.</p>
<p>Il seguente esempio di codice mostra l'interfaccia <code translate="no">CreatePartitionRequest</code>. Ha due parametri principali di tipo stringa <code translate="no">collection_name</code> e <code translate="no">partition_name</code>, in base ai quali è possibile avviare una richiesta di creazione di partizione.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/code_d5f034d58d.png" alt="CreatePartitionRequest" class="doc-image" id="createpartitionrequest" />
   </span> <span class="img-wrapper"> <span>Richiesta di creazione di partizione</span> </span></p>
<p>Si veda un esempio di protocollo nel <a href="https://github.com/milvus-io/milvus-proto/blob/44f59db22b27cc55e4168c8e53b6e781c010a713/proto/milvus.proto">repository GitHub di PyMilvus</a> alla riga 19.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/create_partition_938691f07f.png" alt="Example" class="doc-image" id="example" />
   </span> <span class="img-wrapper"> <span>Esempio</span> </span></p>
<p>La definizione di <code translate="no">CreatePartitionRequest</code> si trova qui.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112254_4ec4f35bd3.png" alt="Definition" class="doc-image" id="definition" />
   </span> <span class="img-wrapper"> <span>Definizione</span> </span></p>
<p>I collaboratori che desiderano sviluppare una funzione di Milvus o un SDK in un linguaggio di programmazione diverso sono invitati a trovare tutte le interfacce che Milvus offre tramite RPC.</p>
<h3 id="commonproto" class="common-anchor-header">comune.proto</h3><p><code translate="no">common.proto</code> definisce i tipi comuni di informazioni, tra cui <code translate="no">ErrorCode</code>, e <code translate="no">Status</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112303_eaafc432a8.png" alt="common.proto" class="doc-image" id="common.proto" />
   </span> <span class="img-wrapper"> <span>comune.proto</span> </span></p>
<h3 id="schemaproto" class="common-anchor-header">schema.proto</h3><p><code translate="no">schema.proto</code> definisce lo schema nei parametri. Il seguente esempio di codice è un esempio di <code translate="no">CollectionSchema</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112313_df4ebe36e7.png" alt="schema.proto" class="doc-image" id="schema.proto" />
   </span> <span class="img-wrapper"> <span>schema.proto</span> </span></p>
<p><code translate="no">milvus.proto</code>, <code translate="no">common.proto</code> e <code translate="no">schema.proto</code> insieme costituiscono l'API di Milvus, rappresentando tutte le operazioni che possono essere chiamate tramite RPC.</p>
<p>Se si scava nel codice sorgente e si osserva attentamente, si scopre che quando si chiamano interfacce come <code translate="no">create_index</code>, in realtà si chiamano più interfacce RPC come <code translate="no">describe_collection</code> e <code translate="no">describe_index</code>. Molte delle interfacce esterne di Milvus sono una combinazione di più interfacce RPC.</p>
<p>Avendo compreso i comportamenti di RPC, è possibile sviluppare nuove funzionalità per Milvus attraverso una combinazione. Siete più che invitati a usare la vostra immaginazione e creatività e a contribuire alla comunità di Milvus.</p>
<h2 id="PyMilvus-20" class="common-anchor-header">PyMilvus 2.0<button data-href="#PyMilvus-20" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Object-relational-mapping-ORM" class="common-anchor-header">Mappatura relazionale degli oggetti (ORM)</h3><p>In poche parole, il termine Object-relational mapping (ORM) si riferisce al fatto che quando si opera su un oggetto locale, tali operazioni hanno effetto sull'oggetto corrispondente sul server. L'API in stile ORM di PyMilvus presenta le seguenti caratteristiche:</p>
<ol>
<li>Opera direttamente sugli oggetti.</li>
<li>Isola la logica del servizio e i dettagli dell'accesso ai dati.</li>
<li>Nasconde la complessità dell'implementazione ed è possibile eseguire gli stessi script su diverse istanze di Milvus, indipendentemente dal loro approccio di distribuzione o dalla loro implementazione.</li>
</ol>
<h3 id="ORM-style-API" class="common-anchor-header">API in stile ORM</h3><p>L'essenza dell'API in stile ORM risiede nel controllo della connessione a Milvus. Ad esempio, è possibile specificare alias per più server Milvus e connettersi o disconnettersi da essi semplicemente con i loro alias. È anche possibile eliminare l'indirizzo del server locale e controllare determinati oggetti tramite una connessione specifica.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112320_d5ff08a582.png" alt="Control Connection" class="doc-image" id="control-connection" />
   </span> <span class="img-wrapper"> <span>Controllo della connessione</span> </span></p>
<p>Un'altra caratteristica dell'API in stile ORM è che, dopo l'astrazione, tutte le operazioni possono essere eseguite direttamente sugli oggetti, comprese le raccolte, le partizioni e gli indici.</p>
<p>È possibile astrarre un oggetto collezione ottenendo un oggetto esistente o creandone uno nuovo. È anche possibile assegnare una connessione Milvus a oggetti specifici utilizzando gli alias di connessione, in modo da poter operare su questi oggetti localmente.</p>
<p>Per creare un oggetto partizione, è possibile crearlo con il suo oggetto collezione genitore, oppure è possibile farlo come quando si crea un oggetto collezione. Questi metodi possono essere utilizzati anche per un oggetto indice.</p>
<p>Nel caso in cui questi oggetti partizione o indice esistano, è possibile ottenerli attraverso l'oggetto collezione padre.</p>
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
