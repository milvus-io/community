---
id: why-manual-sharding-is-a-bad-idea-for-vector-databases-and-how-to-fix-it.md
title: >-
  Perché lo sharding manuale è una cattiva idea per i database vettoriali e come
  risolverlo
author: James Luan
date: 2025-03-18T00:00:00.000Z
desc: >-
  Scoprite perché lo sharding manuale dei database vettoriali crea dei colli di
  bottiglia e come lo scaling automatico di Milvus elimina le spese di
  progettazione per una crescita continua.
cover: >-
  assets.zilliz.com/Why_Manual_Sharding_is_a_Bad_Idea_for_Vector_Database_And_How_to_Fix_It_1_968a5be504.png
tag: Engineering
tags: 'Milvus, Vector Database, Milvus, AI Infrastructure, Automated Sharding'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/why-manual-sharding-is-a-bad-idea-for-vector-databases-and-how-to-fix-it.md
---
<p>"<em>Inizialmente abbiamo costruito la nostra ricerca semantica su pgvector invece che su Milvus perché tutti i nostri dati relazionali erano già in PostgreSQL",</em> ricorda Alex, CTO di una startup SaaS di AI aziendale. <em>"Ma non appena abbiamo raggiunto l'idoneità del prodotto al mercato, la nostra crescita ha incontrato seri ostacoli dal punto di vista ingegneristico. È diventato subito chiaro che pgvector non era stato progettato per la scalabilità. Compiti semplici come l'aggiornamento dello schema su più shard si sono trasformati in processi noiosi e soggetti a errori, che hanno consumato giorni di lavoro per gli ingegneri. Quando abbiamo raggiunto i 100 milioni di incorporazioni vettoriali, la latenza delle query è schizzata a oltre un secondo, ben oltre quanto tollerato dai nostri clienti. Dopo il passaggio a Milvus, lo sharding manuale è sembrato un ritorno all'età della pietra. Non è divertente destreggiarsi tra i server shard come se fossero fragili manufatti. Nessuna azienda dovrebbe sopportarlo".</em></p>
<h2 id="A-Common-Challenge-for-AI-Companies" class="common-anchor-header">Una sfida comune per le aziende di intelligenza artificiale<button data-href="#A-Common-Challenge-for-AI-Companies" class="anchor-icon" translate="no">
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
    </button></h2><p>L'esperienza di Alex non è unica per gli utenti di pgvector. Che si utilizzi pgvector, Qdrant, Weaviate o qualsiasi altro database vettoriale che si basa sullo sharding manuale, le sfide di scalabilità rimangono le stesse. Quella che all'inizio è una soluzione gestibile si trasforma rapidamente in un debito tecnologico con l'aumento dei volumi di dati.</p>
<p>Per le startup di oggi, la <strong>scalabilità non è facoltativa, ma è fondamentale</strong>. Ciò è particolarmente vero per i prodotti di intelligenza artificiale basati su modelli linguistici di grandi dimensioni (LLM) e database vettoriali, dove il salto dall'adozione iniziale alla crescita esponenziale può avvenire da un giorno all'altro. Il raggiungimento del product-market fit spesso provoca un'impennata nella crescita degli utenti, un afflusso di dati travolgente e una richiesta di query alle stelle. Ma se l'infrastruttura del database non riesce a tenere il passo, le query lente e le inefficienze operative possono bloccare lo slancio e ostacolare il successo aziendale.</p>
<p>Una decisione tecnica a breve termine potrebbe portare a un collo di bottiglia a lungo termine, costringendo i team di ingegneri a occuparsi costantemente di problemi urgenti di prestazioni, crash del database e guasti del sistema invece di concentrarsi sull'innovazione. Lo scenario peggiore? Una costosa e lunga riarchitettura del database, proprio quando l'azienda dovrebbe scalare.</p>
<h2 id="Isn’t-Sharding-a-Natural-Solution-to-Scalability" class="common-anchor-header">Sharding non è una soluzione naturale alla scalabilità?<button data-href="#Isn’t-Sharding-a-Natural-Solution-to-Scalability" class="anchor-icon" translate="no">
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
    </button></h2><p>La scalabilità può essere affrontata in diversi modi. L'approccio più semplice, lo <strong>scaling up</strong>, consiste nel potenziare le risorse di una singola macchina aggiungendo più CPU, memoria o storage per far fronte all'aumento dei volumi di dati. Pur essendo semplice, questo metodo presenta evidenti limitazioni. In un ambiente Kubernetes, ad esempio, i pod di grandi dimensioni sono inefficienti e il fatto di affidarsi a un singolo nodo aumenta il rischio di guasti, portando potenzialmente a tempi di inattività significativi.</p>
<p>Quando lo Scaling Up non è più praticabile, le aziende ricorrono naturalmente allo <strong>Scaling Out</strong>, distribuendo i dati su più server. A prima vista, lo <strong>sharding</strong> sembra essere una soluzione semplice: dividere un database in database più piccoli e indipendenti per aumentare la capacità e consentire più nodi primari scrivibili.</p>
<p>Tuttavia, anche se concettualmente semplice, lo sharding diventa rapidamente una sfida complessa nella pratica. La maggior parte delle applicazioni sono inizialmente progettate per funzionare con un unico database unificato. Nel momento in cui un database vettoriale viene suddiviso in più shard, ogni parte dell'applicazione che interagisce con i dati deve essere modificata o interamente riscritta, introducendo un significativo overhead di sviluppo. La progettazione di una strategia di sharding efficace diventa fondamentale, così come l'implementazione della logica di routing per garantire che i dati siano indirizzati allo shard corretto. La gestione delle transazioni atomiche su più shard spesso richiede la ristrutturazione delle applicazioni per evitare operazioni cross-shard. Inoltre, gli scenari di guasto devono essere gestiti con grazia per evitare interruzioni quando alcuni shard diventano non disponibili.</p>
<h2 id="Why-Manual-Sharding-Becomes-a-Burden" class="common-anchor-header">Perché lo sharding manuale diventa un peso<button data-href="#Why-Manual-Sharding-Becomes-a-Burden" class="anchor-icon" translate="no">
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
    </button></h2><p>&quot;<em>Inizialmente avevamo stimato che l'implementazione dello sharding manuale per il nostro database pgvector avrebbe richiesto a due ingegneri circa sei mesi&quot;,</em> ricorda Alex, <em>&quot;</em> ma <em> non avevamo capito che quegli ingegneri sarebbero stati</em> <strong><em>sempre</em></strong> <em>necessari. Ogni modifica dello schema, operazione di ribilanciamento dei dati o decisione di scalare richiedeva le loro competenze specialistiche. In sostanza, ci stavamo impegnando a creare un 'team di sharding' permanente solo per mantenere in funzione il nostro database&quot;.</em></p>
<p>Le sfide del mondo reale con i database vettoriali shardati includono:</p>
<ol>
<li><p><strong>Squilibrio nella distribuzione dei dati (hotspot)</strong>: Nei casi di utilizzo multi-tenant, la distribuzione dei dati può variare da centinaia a miliardi di vettori per tenant. Questo squilibrio crea hotspot in cui alcuni shard diventano sovraccarichi mentre altri rimangono inattivi.</p></li>
<li><p><strong>Il mal di testa da resharding</strong>: Scegliere il numero giusto di shard è quasi impossibile. Un numero troppo basso porta a frequenti e costose operazioni di resharding. Un numero eccessivo crea un inutile overhead di metadati, aumentando la complessità e riducendo le prestazioni.</p></li>
<li><p><strong>Complessità nella modifica dello schema</strong>: Molti database vettoriali implementano lo sharding gestendo più database sottostanti. Questo fa sì che la sincronizzazione delle modifiche allo schema tra gli shard sia macchinosa e soggetta a errori, rallentando i cicli di sviluppo.</p></li>
<li><p><strong>Spreco di risorse</strong>: Nei database accoppiati storage-compute, è necessario allocare meticolosamente le risorse su ogni nodo, anticipando la crescita futura. In genere, quando l'utilizzo delle risorse raggiunge il 60-70%, è necessario iniziare a pianificare il resharding.</p></li>
</ol>
<p>In poche parole, la <strong>gestione manuale degli shard è dannosa per l'azienda</strong>. Invece di costringere il vostro team di ingegneri a una gestione costante degli shard, prendete in considerazione l'idea di investire in un database vettoriale progettato per scalare automaticamente, senza l'onere operativo.</p>
<h2 id="How-Milvus-Solves-the-Scalability-Problem" class="common-anchor-header">Come Milvus risolve il problema della scalabilità<button data-href="#How-Milvus-Solves-the-Scalability-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>Molti sviluppatori, dalle startup alle aziende, hanno riconosciuto il notevole sovraccarico associato allo sharding manuale dei database. Milvus adotta un approccio fondamentalmente diverso, consentendo di scalare senza problemi da milioni a miliardi di vettori, senza alcuna complessità.</p>
<h3 id="Automated-Scaling-Without-the-Tech-Debt" class="common-anchor-header">Scalabilità automatizzata senza debiti tecnici</h3><p>Milvus sfrutta Kubernetes e un'architettura storage-compute disaggregata per supportare un'espansione continua. Questo design consente:</p>
<ul>
<li><p>scalare rapidamente in risposta alle mutevoli esigenze</p></li>
<li><p>Bilanciamento automatico del carico su tutti i nodi disponibili</p></li>
<li><p>allocazione indipendente delle risorse, che consente di regolare separatamente calcolo, memoria e storage</p></li>
<li><p>Prestazioni elevate e costanti, anche durante i periodi di rapida crescita.</p></li>
</ul>
<h3 id="Distributed-Architecture-Designed-from-the-Ground-Up" class="common-anchor-header">Architettura distribuita progettata da zero</h3><p>Milvus raggiunge le sue capacità di scalabilità grazie a due innovazioni chiave:</p>
<p><strong>Architettura basata su segmenti:</strong> Milvus organizza i dati in &quot;segmenti&quot;, le più piccole unità di gestione dei dati:</p>
<ul>
<li><p>I segmenti in crescita risiedono sugli StreamNodes, ottimizzando la freschezza dei dati per le interrogazioni in tempo reale.</p></li>
<li><p>I segmenti chiusi sono gestiti dai QueryNodes, che utilizzano potenti indici per accelerare la ricerca.</p></li>
<li><p>Questi segmenti sono distribuiti uniformemente tra i nodi per ottimizzare l'elaborazione parallela.</p></li>
</ul>
<p><strong>Routing a due livelli</strong>: A differenza dei database tradizionali, dove ogni shard risiede su una singola macchina, Milvus distribuisce i dati di uno shard in modo dinamico su più nodi:</p>
<ul>
<li><p>Ogni shard può memorizzare più di 1 miliardo di punti di dati</p></li>
<li><p>I segmenti all'interno di ogni shard sono automaticamente bilanciati tra le macchine</p></li>
<li><p>Espandere le collezioni è semplice come aumentare il numero di shard</p></li>
<li><p>L'imminente Milvus 3.0 introdurrà la suddivisione dinamica degli shard, eliminando anche questo minimo passaggio manuale.</p></li>
</ul>
<h3 id="Query-Processing-at-Scale" class="common-anchor-header">Elaborazione delle query su scala</h3><p>Quando si esegue una query, Milvus segue un processo efficiente:</p>
<ol>
<li><p>il Proxy identifica gli shard rilevanti per la raccolta richiesta</p></li>
<li><p>Il Proxy raccoglie i dati da StreamNodes e QueryNodes.</p></li>
<li><p>Gli StreamNodes gestiscono i dati in tempo reale, mentre i QueryNodes elaborano i dati storici in modo simultaneo.</p></li>
<li><p>I risultati vengono aggregati e restituiti all'utente</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Query_Processing_at_Scale_5792dc9e37.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="A-Different-Engineering-Experience" class="common-anchor-header">Un'esperienza ingegneristica diversa<button data-href="#A-Different-Engineering-Experience" class="anchor-icon" translate="no">
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
    </button></h2><p>"<em>Quando la scalabilità è integrata nel database stesso, tutti i problemi scompaiono",</em> dice Alex, riflettendo sul passaggio del suo team a Milvus. <em>"I miei ingegneri sono tornati a costruire le funzionalità che i clienti amano, invece di badare ai frammenti di database".</em></p>
<p>Se siete alle prese con l'onere ingegneristico dello sharding manuale, con i colli di bottiglia delle prestazioni su scala o con la scoraggiante prospettiva delle migrazioni di database, è ora di ripensare il vostro approccio. Visitate la nostra <a href="https://milvus.io/docs/overview.md#What-Makes-Milvus-so-Scalable">pagina dei documenti</a> per saperne di più sull'architettura di Milvus, oppure provate in prima persona la scalabilità senza sforzo con Milvus completamente gestito su <a href="https://zilliz.com/cloud">zilliz.com/cloud</a>.</p>
<p>Con la giusta base di database vettoriale, la vostra innovazione non conosce limiti.</p>
