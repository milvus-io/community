---
id: music-recommender-system-item-based-collaborative-filtering-milvus.md
title: "\U0001F50E Selezionare un motore di ricerca per la somiglianza delle caratteristiche"
author: milvus
date: 2020-09-08T00:01:59.064Z
desc: Un caso di studio con WANYIN APP
cover: assets.zilliz.com/header_f8cea596d2.png
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/music-recommender-system-item-based-collaborative-filtering-milvus
---
<custom-h1>Filtro collaborativo basato sugli elementi per un sistema di raccomandazione musicale</custom-h1><p>L'applicazione Wanyin è una comunità di condivisione musicale basata sull'intelligenza artificiale con l'intento di incoraggiare la condivisione di musica e rendere più facile la composizione musicale per gli appassionati.</p>
<p>La libreria di Wanyin contiene un'enorme quantità di musica caricata dagli utenti. Il compito principale è quello di selezionare la musica di interesse in base al comportamento precedente degli utenti. Abbiamo valutato due modelli classici: il filtraggio collaborativo basato sull'utente (User-based CF) e il filtraggio collaborativo basato sugli elementi (Item-based CF), come potenziali modelli di sistema di raccomandazione.</p>
<ul>
<li>Il CF basato sull'utente utilizza le statistiche di somiglianza per ottenere utenti vicini con preferenze o interessi simili. Con l'insieme dei vicini recuperati, il sistema può prevedere l'interesse dell'utente target e generare raccomandazioni.</li>
<li>Introdotto da Amazon, l'item-based CF, o item-to-item (I2I) CF, è un noto modello di filtraggio collaborativo per i sistemi di raccomandazione. Calcola le somiglianze tra gli articoli invece che tra gli utenti, partendo dal presupposto che gli articoli di interesse devono essere simili agli articoli con punteggi elevati.</li>
</ul>
<p>Il CF basato sugli utenti può portare a tempi di calcolo proibitivi quando il numero di utenti supera un certo punto. Tenendo conto delle caratteristiche del nostro prodotto, abbiamo deciso di adottare la CF I2I per implementare il sistema di raccomandazione musicale. Poiché non disponiamo di molti metadati sulle canzoni, dobbiamo occuparci delle canzoni in sé, estraendo da esse vettori di caratteristiche (embeddings). Il nostro approccio consiste nel convertire queste canzoni in mel-frequency cepstrum (MFC), progettare una rete neurale convoluzionale (CNN) per estrarre gli embeddings delle caratteristiche delle canzoni e quindi formulare raccomandazioni musicali attraverso la ricerca della similarità degli embeddings.</p>
<h2 id="🔎-Select-an-embedding-similarity-search-engine" class="common-anchor-header">🔎 Selezionare un motore di ricerca per la somiglianza delle caratteristiche<button data-href="#🔎-Select-an-embedding-similarity-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Ora che disponiamo di vettori di caratteristiche, il problema rimanente è come recuperare dal grande volume di vettori quelli che sono simili al vettore di destinazione. Per quanto riguarda il motore di ricerca degli embeddings, stavamo valutando tra Faiss e Milvus. Ho notato Milvus mentre scorrevo i repository di tendenza di GitHub nel novembre 2019. Ho dato un'occhiata al progetto e mi ha attirato per le sue API astratte. (All'epoca era alla versione 0.5.x e ora alla versione 0.10.2).</p>
<p>Preferiamo Milvus a Faiss. Da un lato, abbiamo già usato Faiss e quindi vorremmo provare qualcosa di nuovo. D'altra parte, rispetto a Milvus, Faiss è più una libreria di base, quindi non molto comoda da usare. Dopo aver imparato di più su Milvus, abbiamo deciso di adottare Milvus per le sue due caratteristiche principali:</p>
<ul>
<li>Milvus è molto facile da usare. È sufficiente prelevare l'immagine Docker e aggiornare i parametri in base al proprio scenario.</li>
<li>Supporta più indici e dispone di una documentazione di supporto dettagliata.</li>
</ul>
<p>In poche parole, Milvus è molto amichevole per gli utenti e la documentazione è abbastanza dettagliata. Se ci si imbatte in qualche problema, di solito si possono trovare le soluzioni nella documentazione; altrimenti, si può sempre ottenere supporto dalla comunità di Milvus.</p>
<h2 id="Milvus-cluster-service-☸️-⏩" class="common-anchor-header">Servizio cluster Milvus ☸️ ⏩<button data-href="#Milvus-cluster-service-☸️-⏩" class="anchor-icon" translate="no">
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
    </button></h2><p>Dopo aver deciso di utilizzare Milvus come motore di ricerca vettoriale, abbiamo configurato un nodo autonomo in un ambiente di sviluppo (DEV). Il nodo funzionava bene da alcuni giorni, quindi abbiamo pianificato l'esecuzione di test in un ambiente di test di accettazione di fabbrica (FAT). Se un nodo standalone si bloccasse in produzione, l'intero servizio diventerebbe indisponibile. Pertanto, è necessario implementare un servizio di ricerca ad alta disponibilità.</p>
<p>Milvus fornisce sia Mishards, un middleware di sharding per cluster, sia Milvus-Helm per la configurazione. Il processo di distribuzione di un servizio cluster Milvus è semplice. Dobbiamo solo aggiornare alcuni parametri e impacchettarli per la distribuzione in Kubernetes. Il diagramma seguente, tratto dalla documentazione di Milvus, mostra il funzionamento di Mishards:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_how_mishards_works_in_milvus_documentation_43a73076bf.png" alt="1-how-mishards-works-in-milvus-documentation.png" class="doc-image" id="1-how-mishards-works-in-milvus-documentation.png" />
   </span> <span class="img-wrapper"> <span>1-how-mishards-works-in-milvus-documentation.png</span> </span></p>
<p>Mishards esegue una richiesta a cascata da upstream verso i suoi sottomoduli che dividono la richiesta upstream, quindi raccoglie e restituisce i risultati dei sottoservizi a upstream. L'architettura complessiva della soluzione cluster basata su Mishards è illustrata di seguito:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_mishards_based_cluster_solution_architecture_3ad89cf269.jpg" alt="2-mishards-based-cluster-solution-architecture.jpg" class="doc-image" id="2-mishards-based-cluster-solution-architecture.jpg" />
   </span> <span class="img-wrapper"> <span>2-mishards-based-cluster-solution-architecture.jpg</span> </span></p>
<p>La documentazione ufficiale fornisce una chiara introduzione a Mishards. Se siete interessati, potete fare riferimento a <a href="https://milvus.io/cn/docs/v0.10.2/mishards.md">Mishards</a>.</p>
<p>Nel nostro sistema di raccomandazione musicale, abbiamo distribuito un nodo scrivibile, due nodi di sola lettura e un'istanza del middleware Mishards in Kubernetes, utilizzando Milvus-Helm. Dopo che il servizio ha funzionato in modo stabile in un ambiente FAT per un po' di tempo, lo abbiamo distribuito in produzione. Finora si è dimostrato stabile.</p>
<h2 id="🎧-I2I-music-recommendation-🎶" class="common-anchor-header">🎧 Raccomandazione musicale I2I 🎶<button data-href="#🎧-I2I-music-recommendation-🎶" class="anchor-icon" translate="no">
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
    </button></h2><p>Come accennato in precedenza, abbiamo costruito il sistema di raccomandazione musicale I2I di Wanyin utilizzando gli embdings estratti delle canzoni esistenti. Per prima cosa, abbiamo separato la voce e la BGM (separazione delle tracce) di una nuova canzone caricata dall'utente e abbiamo estratto gli embeddings della BGM come rappresentazione delle caratteristiche della canzone. Questo aiuta anche a distinguere le versioni cover delle canzoni originali. Successivamente, abbiamo memorizzato questi embeddings in Milvus, abbiamo cercato canzoni simili in base alle canzoni ascoltate dall'utente e poi abbiamo ordinato e riordinato le canzoni recuperate per generare raccomandazioni musicali. Il processo di implementazione è illustrato di seguito:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_music_recommender_system_implementation_c52a333eb8.png" alt="3-music-recommender-system-implementation.png" class="doc-image" id="3-music-recommender-system-implementation.png" />
   </span> <span class="img-wrapper"> <span>3-music-recommender-system-implementation.png</span> </span></p>
<h2 id="🚫-Duplicate-song-filter" class="common-anchor-header">🚫 Filtro per le canzoni duplicate<button data-href="#🚫-Duplicate-song-filter" class="anchor-icon" translate="no">
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
    </button></h2><p>Un altro scenario in cui utilizziamo Milvus è il filtraggio dei brani doppi. Alcuni utenti caricano più volte lo stesso brano o clip e questi brani duplicati possono comparire nell'elenco dei consigli. Ciò significa che la generazione di raccomandazioni senza pre-elaborazione potrebbe compromettere l'esperienza dell'utente. Pertanto, è necessario individuare i brani duplicati e assicurarsi che non compaiano nello stesso elenco attraverso la pre-elaborazione.</p>
<p>Un altro scenario in cui utilizziamo Milvus è il filtraggio dei brani duplicati. Alcuni utenti caricano più volte lo stesso brano o clip e questi brani duplicati possono comparire nell'elenco dei consigli. Ciò significa che la generazione di raccomandazioni senza pre-elaborazione comprometterebbe l'esperienza dell'utente. Pertanto, è necessario individuare i brani duplicati e assicurarsi che non compaiano nello stesso elenco attraverso la pre-elaborazione.</p>
<p>Come nello scenario precedente, abbiamo implementato il filtraggio dei brani duplicati attraverso la ricerca di vettori di caratteristiche simili. In primo luogo, abbiamo separato la voce e la BGM e abbiamo recuperato una serie di canzoni simili utilizzando Milvus. Per filtrare accuratamente i brani duplicati, abbiamo estratto le impronte digitali audio del brano di destinazione e dei brani simili (con tecnologie come Echoprint, Chromaprint, ecc.), calcolato la somiglianza tra l'impronta digitale audio del brano di destinazione e ciascuna delle impronte digitali dei brani simili. Se la somiglianza supera la soglia, definiamo un brano come un duplicato del brano di destinazione. Il processo di corrispondenza delle impronte audio rende più accurato il filtraggio dei brani duplicati, ma richiede anche molto tempo. Pertanto, quando si tratta di filtrare i brani in una libreria musicale di grandi dimensioni, utilizziamo Milvus per filtrare i brani candidati al duplicato come fase preliminare.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_using_milvus_filter_songs_music_recommender_duplicates_0ff68d3e67.png" alt="4-using-milvus-filter-songs-music-recommender-duplicates.png" class="doc-image" id="4-using-milvus-filter-songs-music-recommender-duplicates.png" />
   </span> <span class="img-wrapper"> <span>4-using-milvus-filtro-canzoni-musicali-raccomandanti-duplicati.png</span> </span></p>
<p>Per implementare il sistema di raccomandazione I2I per l'enorme libreria musicale di Wanyin, il nostro approccio consiste nell'estrarre le incorporazioni delle canzoni come loro caratteristica, richiamare le incorporazioni simili all'incorporazione della canzone di destinazione e quindi ordinare e riordinare i risultati per generare elenchi di raccomandazioni per l'utente. Per ottenere una raccomandazione in tempo reale, abbiamo scelto Milvus rispetto a Faiss come motore di ricerca per la similarità dei vettori di caratteristiche, poiché Milvus si è dimostrato più facile da usare e più sofisticato. Allo stesso modo, abbiamo applicato Milvus al nostro filtro per le canzoni duplicate, migliorando così l'esperienza e l'efficienza dell'utente.</p>
<p>Potete scaricare l'<a href="https://enjoymusic.ai/wanyin">app Wanyin</a> 🎶 e provarla. (Nota: potrebbe non essere disponibile su tutti gli app store).</p>
<h3 id="📝-Authors" class="common-anchor-header">📝 Autori:</h3><p>Jason, ingegnere degli algoritmi presso Stepbeats Shiyu Chen, ingegnere dei dati presso Zilliz</p>
<h3 id="📚-References" class="common-anchor-header">📚 Riferimenti:</h3><p>Mishards Docs: https://milvus.io/docs/v0.10.2/mishards.md Mishards: https://github.com/milvus-io/milvus/tree/master/shards Milvus-Helm: https://github.com/milvus-io/milvus-helm/tree/master/charts/milvus</p>
<p><strong>🤗 Non essere un estraneo, seguici su <a href="https://twitter.com/milvusio/">Twitter</a> o unisciti a noi su <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">Slack</a>!👇🏻</strong></p>
