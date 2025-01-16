---
id: understanding-consistency-levels-in-the-milvus-vector-database.md
title: Comprensione del livello di consistenza nel database dei vettori Milvus
author: Chenglong Li
date: 2022-08-29T00:00:00.000Z
desc: >-
  Imparate a conoscere i quattro livelli di consistenza - forte, stallo
  limitato, sessione ed eventuale - supportati dal database vettoriale Milvus.
cover: assets.zilliz.com/1280_X1280_0e0d4bc107.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_0e0d4bc107.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>Immagine di copertina</span> </span></p>
<blockquote>
<p>Questo articolo è stato scritto da <a href="https://github.com/JackLCL">Chenglong Li</a> e trascritto da <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a>.</p>
</blockquote>
<p>Vi siete mai chiesti perché a volte i dati che avete cancellato dal database vettoriale di Mlivus appaiono ancora nei risultati della ricerca?</p>
<p>È molto probabile che il motivo sia che non avete impostato il livello di coerenza appropriato per la vostra applicazione. Il livello di coerenza in un database vettoriale distribuito è fondamentale perché determina in quale momento una particolare scrittura di dati può essere letta dal sistema.</p>
<p>Per questo motivo, questo articolo intende demistificare il concetto di consistenza e approfondire i livelli di consistenza supportati dal database vettoriale Milvus.</p>
<p><strong>Vai a:</strong></p>
<ul>
<li><a href="#What-is-consistency">Cos'è la coerenza</a></li>
<li><a href="#Four-levels-of-consistency-in-the-Milvus-vector-database">Quattro livelli di coerenza nel database vettoriale Milvus</a><ul>
<li><a href="#Strong">Forte</a></li>
<li><a href="#Bounded-staleness">Stallo limitato</a></li>
<li><a href="#Session">Sessione</a></li>
<li><a href="#Eventual">Eventuale</a></li>
</ul></li>
</ul>
<h2 id="What-is-consistency" class="common-anchor-header">Cos'è la consistenza<button data-href="#What-is-consistency" class="anchor-icon" translate="no">
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
    </button></h2><p>Prima di iniziare, è necessario chiarire la connotazione della consistenza in questo articolo, poiché la parola "consistenza" è un termine sovraccarico nell'industria informatica. La consistenza in un database distribuito si riferisce specificamente alla proprietà che assicura che ogni nodo o replica abbia la stessa visione dei dati quando scrive o legge i dati in un determinato momento. Pertanto, qui si parla di coerenza come nel <a href="https://en.wikipedia.org/wiki/CAP_theorem">teorema CAP</a>.</p>
<p>Per servire le grandi aziende online nel mondo moderno, vengono comunemente adottate repliche multiple. Ad esempio, il gigante dell'e-commerce online Amazon replica i suoi ordini o i dati SKU in più centri dati, zone o addirittura paesi per garantire un'elevata disponibilità del sistema in caso di arresto o guasto. Ciò pone una sfida al sistema: la coerenza dei dati tra più repliche. Senza coerenza, è molto probabile che l'articolo cancellato dal carrello di Amazon ricompaia, causando una pessima esperienza all'utente.</p>
<p>Per questo motivo, abbiamo bisogno di diversi livelli di coerenza dei dati per le diverse applicazioni. Fortunatamente Milvus, un database per l'intelligenza artificiale, offre una certa flessibilità nel livello di consistenza e consente di impostare il livello di consistenza più adatto alla propria applicazione.</p>
<h3 id="Consistency-in-the-Milvus-vector-database" class="common-anchor-header">Consistenza nel database vettoriale Milvus</h3><p>Il concetto di livello di coerenza è stato introdotto per la prima volta con il rilascio di Milvus 2.0. La versione 1.0 di Milvus non era un database vettoriale distribuito e quindi non prevedeva livelli di consistenza regolabili. Milvus 1.0 esegue il flussaggio dei dati ogni secondo, il che significa che i nuovi dati sono quasi immediatamente visibili al momento del loro inserimento e che Milvus legge la vista dei dati più aggiornata nel momento esatto in cui arriva una richiesta di ricerca o di interrogazione di similarità vettoriale.</p>
<p>Tuttavia, Milvus è stato ristrutturato nella sua versione 2.0 e <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus 2.0 è un database vettoriale distribuito</a> basato su un meccanismo pub-sub. Il teorema <a href="https://en.wikipedia.org/wiki/PACELC_theorem">PACELC</a> indica che un sistema distribuito deve trovare un compromesso tra coerenza, disponibilità e latenza. Inoltre, diversi livelli di consistenza servono per diversi scenari. Per questo motivo, in <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">Milvus 2.0</a> è stato introdotto il concetto di consistenza, che supporta la regolazione dei livelli di consistenza.</p>
<h2 id="Four-levels-of-consistency-in-the-Milvus-vector-database" class="common-anchor-header">Quattro livelli di coerenza nel database vettoriale Milvus<button data-href="#Four-levels-of-consistency-in-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus supporta quattro livelli di consistenza: forte, stallo limitato, sessione ed eventuale. L'utente di Milvus può specificare il livello di consistenza quando <a href="https://milvus.io/docs/v2.1.x/create_collection.md">crea una collezione</a> o esegue una <a href="https://milvus.io/docs/v2.1.x/search.md">ricerca</a> o un'<a href="https://milvus.io/docs/v2.1.x/query.md">interrogazione</a> <a href="https://milvus.io/docs/v2.1.x/search.md">di similarità vettoriale</a>. Questa sezione continuerà a spiegare come si differenziano questi quattro livelli di consistenza e per quale scenario sono più adatti.</p>
<h3 id="Strong" class="common-anchor-header">Forte</h3><p>Strong è il livello di coerenza più alto e più rigoroso. Garantisce che gli utenti possano leggere la versione più recente dei dati.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Strong_5d791eb8b2.png" alt="Strong" class="doc-image" id="strong" />
   </span> <span class="img-wrapper"> <span>Forte</span> </span></p>
<p>Secondo il teorema PACELC, se il livello di coerenza è impostato su forte, la latenza aumenterà. Pertanto, si consiglia di scegliere una consistenza forte durante i test funzionali per garantire l'accuratezza dei risultati dei test. Inoltre, la consistenza forte è la più adatta per le applicazioni che richiedono una stretta consistenza dei dati a scapito della velocità di ricerca. Un esempio può essere un sistema finanziario online che si occupa di pagamenti e fatturazione degli ordini.</p>
<h3 id="Bounded-staleness" class="common-anchor-header">Stalliezza limitata</h3><p>La staleness limitata, come suggerisce il nome, consente l'inconsistenza dei dati per un certo periodo di tempo. Tuttavia, in genere, i dati sono sempre globalmente coerenti al di fuori di quel periodo di tempo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Bounded_c034bc6e51.png" alt="Bounded_staleness" class="doc-image" id="bounded_staleness" />
   </span> <span class="img-wrapper"> <span>Stallo limitato</span> </span></p>
<p>La staleness limitata è adatta a scenari che devono controllare la latenza di ricerca e possono accettare l'invisibilità sporadica dei dati. Ad esempio, nei sistemi di raccomandazione come i motori di raccomandazione video, l'invisibilità dei dati una volta ogni tanto ha un impatto davvero minimo sul tasso di richiamo complessivo, ma può aumentare significativamente le prestazioni del sistema di raccomandazione. Un esempio può essere un'applicazione per monitorare lo stato degli ordini online.</p>
<h3 id="Session" class="common-anchor-header">Sessione</h3><p>La sessione garantisce che tutti i dati scritti possano essere immediatamente percepiti in lettura durante la stessa sessione. In altre parole, quando si scrivono dati tramite un client, i nuovi dati inseriti diventano istantaneamente ricercabili.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Session_6dc4782212.png" alt="Session" class="doc-image" id="session" />
   </span> <span class="img-wrapper"> <span>Sessione</span> </span></p>
<p>Si consiglia di scegliere la sessione come livello di coerenza per quegli scenari in cui la richiesta di coerenza dei dati nella stessa sessione è elevata. Un esempio può essere la cancellazione dei dati di una voce di libro dal sistema bibliotecario; dopo la conferma della cancellazione e l'aggiornamento della pagina (una sessione diversa), il libro non dovrebbe più essere visibile nei risultati di ricerca.</p>
<h3 id="Eventual" class="common-anchor-header">Eventuale</h3><p>Non esiste un ordine garantito di lettura e scrittura, e le repliche finiscono per convergere allo stesso stato se non vengono effettuate altre operazioni di scrittura. In caso di coerenza eventuale, le repliche iniziano a lavorare sulle richieste di lettura con gli ultimi valori aggiornati. La consistenza eventuale è il livello più debole tra i quattro.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Eventual_7c66dd5b6f.png" alt="Eventual" class="doc-image" id="eventual" />
   </span> <span class="img-wrapper"> <span>Eventuale</span> </span></p>
<p>Tuttavia, secondo il teorema PACELC, la latenza di ricerca può essere enormemente ridotta sacrificando la coerenza. Pertanto, la consistenza eventuale è più adatta a scenari che non richiedono un'elevata consistenza dei dati, ma che richiedono prestazioni di ricerca rapidissime. Un esempio può essere il recupero delle recensioni e delle valutazioni dei prodotti Amazon con la consistenza eventuale.</p>
<h2 id="Endnote" class="common-anchor-header">Nota finale<button data-href="#Endnote" class="anchor-icon" translate="no">
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
    </button></h2><p>Tornando alla domanda posta all'inizio di questo articolo, i dati cancellati vengono comunque restituiti come risultati di ricerca perché l'utente non ha scelto il livello di consistenza adeguato. Il valore predefinito per il livello di consistenza è bounded staleness (<code translate="no">Bounded</code>) nel database vettoriale Milvus. Pertanto, la lettura dei dati potrebbe essere in ritardo e Milvus potrebbe leggere la vista dei dati prima che siano state effettuate operazioni di cancellazione durante una ricerca o una query di similarità. Tuttavia, questo problema è semplice da risolvere. È sufficiente <a href="https://milvus.io/docs/v2.1.x/tune_consistency.md">regolare il livello di coerenza</a> quando si crea una collezione o si esegue una ricerca o una query di similarità vettoriale. Semplice!</p>
<p>Nel prossimo post sveleremo il meccanismo che sta dietro e spiegheremo come il database vettoriale Milvus raggiunge diversi livelli di coerenza. Restate sintonizzati!</p>
<h2 id="Whats-next" class="common-anchor-header">Il prossimo passo<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Con il rilascio ufficiale di Milvus 2.1, abbiamo preparato una serie di blog che introducono le nuove funzionalità. Per saperne di più, leggete questa serie di blog:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Come utilizzare i dati sulle stringhe per potenziare le applicazioni di ricerca per similarità</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Utilizzo di Milvus incorporato per installare ed eseguire immediatamente Milvus con Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Aumentare la velocità di lettura del database vettoriale con le repliche in memoria</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Capire il livello di consistenza nel database vettoriale Milvus</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Capire il livello di consistenza del database vettoriale Milvus (parte II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">In che modo il database vettoriale Milvus garantisce la sicurezza dei dati?</a></li>
</ul>
