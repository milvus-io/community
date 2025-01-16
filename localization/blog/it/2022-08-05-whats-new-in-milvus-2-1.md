---
id: 2022-08-05-whats-new-in-milvus-2-1.md
title: Cosa c'è di nuovo in Milvus 2.1 - Verso la semplicità e la velocità
author: Xiaofan Luan
date: 2022-08-05T00:00:00.000Z
desc: >-
  Milvus, il database vettoriale open-source, presenta ora miglioramenti delle
  prestazioni e dell'usabilità che gli utenti attendevano da tempo.
cover: assets.zilliz.com/What_s_New_in_2_1_2_a0660df2a5.png
tag: News
canonicalUrl: 'https://milvus.io/blog/2022-08-05-whats-new-in-milvus-2-1.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_1_2_a0660df2a5.png" alt="What's new in Milvus 2.1 - Towards simplicity and speed" class="doc-image" id="what's-new-in-milvus-2.1---towards-simplicity-and-speed" />
   </span> <span class="img-wrapper"> <span>Cosa c'è di nuovo in Milvus 2.1 - Verso la semplicità e la velocità</span> </span></p>
<p>Siamo molto lieti di annunciare che il<a href="https://milvus.io/docs/v2.1.x/release_notes.md">rilascio</a> di Milvus 2.1 è ora disponibile dopo sei mesi di duro lavoro da parte di tutti i collaboratori della comunità Milvus. Questa importante iterazione del popolare database vettoriale enfatizza le <strong>prestazioni</strong> e l'<strong>usabilità</strong>, due parole chiave fondamentali del nostro obiettivo. Abbiamo aggiunto il supporto per le stringhe, la coda di messaggi Kafka e Milvus incorporato, oltre a una serie di miglioramenti in termini di prestazioni, scalabilità, sicurezza e osservabilità. Milvus 2.1 è un aggiornamento entusiasmante che colmerà l'"ultimo miglio" dal laptop dell'ingegnere algoritmico ai servizi di ricerca di similarità vettoriale a livello di produzione.</p>
<custom-h1>Prestazioni - Più di un incremento di 3,2 volte</custom-h1><h2 id="5ms-level-latency" class="common-anchor-header">Latenza di 5 ms<button data-href="#5ms-level-latency" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus supporta già la ricerca approssimativa dei vicini (ANN), un salto sostanziale rispetto al metodo KNN tradizionale. Tuttavia, i problemi di throughput e latenza continuano a sfidare gli utenti che devono gestire scenari di recupero di dati vettoriali su scala miliardaria.</p>
<p>In Milvus 2.1 è stato introdotto un nuovo protocollo di routing che non si affida più alle code di messaggi nel collegamento di recupero, riducendo in modo significativo la latenza di recupero per piccoli insiemi di dati. I risultati dei nostri test dimostrano che Milvus ha abbassato il livello di latenza a 5 ms, soddisfacendo i requisiti dei collegamenti online critici come la ricerca di similarità e la raccomandazione.</p>
<h2 id="Concurrency-control" class="common-anchor-header">Controllo della concorrenza<button data-href="#Concurrency-control" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 perfeziona il suo modello di concorrenza introducendo un nuovo modello di valutazione dei costi e uno scheduler di concorrenza. Ora offre un controllo della concorrenza che garantisce che non ci sia un gran numero di richieste simultanee in competizione per le risorse della CPU e della cache, né che la CPU sia sottoutilizzata perché non ci sono abbastanza richieste. Il nuovo livello di scheduler intelligente di Milvus 2.1 unisce anche le query di piccole dimensioni che hanno parametri di richiesta coerenti, offrendo un incredibile aumento delle prestazioni di 3,2 volte in scenari con query di piccole dimensioni e alta concurrency.</p>
<h2 id="In-memory-replicas" class="common-anchor-header">Repliche in memoria<button data-href="#In-memory-replicas" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 introduce repliche in-memory che migliorano la scalabilità e la disponibilità per i piccoli insiemi di dati. Simili alle repliche di sola lettura dei database tradizionali, le repliche in-memory possono scalare orizzontalmente aggiungendo macchine quando il QPS di lettura è elevato. Nel recupero vettoriale di piccoli insiemi di dati, un sistema di raccomandazione deve spesso fornire QPS che superano il limite di prestazioni di una singola macchina. In questi scenari, il throughput del sistema può essere notevolmente migliorato caricando più repliche in memoria. In futuro, introdurremo anche un meccanismo di hedged read basato su repliche in-memory, che richiederà rapidamente altre copie funzionali nel caso in cui il sistema debba riprendersi da guasti e sfrutterà appieno la ridondanza della memoria per migliorare la disponibilità complessiva del sistema.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_1_Figure_1_excalidraw_1f7fe3c998.png" alt="In-memory replicas allow query services to be based on separate
copies of the same data." class="doc-image" id="in-memory-replicas-allow-query-services-to-be-based-on-separate-copies-of-the-same-data." />
   </span> <span class="img-wrapper"> <span>Le repliche in-memory consentono ai servizi di interrogazione di basarsi su copie separate degli stessi dati</span>. </span></p>
<h2 id="Faster-data-loading" class="common-anchor-header">Caricamento dei dati più veloce<button data-href="#Faster-data-loading" class="anchor-icon" translate="no">
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
    </button></h2><p>L'ultimo incremento di prestazioni viene dal caricamento dei dati. Milvus 2.1 ora comprime <a href="https://milvus.io/docs/v2.1.x/glossary.md#Log-snapshot">i log binari</a> con Zstandard (zstd), riducendo in modo significativo le dimensioni dei dati nei magazzini di oggetti e messaggi e l'overhead di rete durante il caricamento dei dati. Inoltre, sono stati introdotti i pool di goroutine, in modo che Milvus possa caricare i segmenti in modo simultaneo con un footprint di memoria controllato e ridurre al minimo il tempo necessario per il ripristino dai guasti e per il caricamento dei dati.</p>
<p>I risultati completi dei benchmark di Milvus 2.1 saranno presto pubblicati sul nostro sito web. Restate sintonizzati.</p>
<h2 id="String-and-scalar-index-support" class="common-anchor-header">Supporto per indici stringa e scalari<button data-href="#String-and-scalar-index-support" class="anchor-icon" translate="no">
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
    </button></h2><p>Con la versione 2.1, Milvus supporta ora le stringhe di lunghezza variabile (VARCHAR) come tipo di dati scalari. VARCHAR può essere utilizzato come chiave primaria da restituire come output e può anche fungere da filtro per gli attributi. <a href="https://milvus.io/docs/v2.1.x/hybridsearch.md">Il filtraggio degli attributi</a> è una delle funzioni più richieste dagli utenti di Milvus. Se vi capita spesso di voler &quot;trovare i prodotti più simili a un utente in una fascia di prezzo <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo>200-200</mo></mrow><annotation encoding="application/x-tex">-</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">200-300</span></span></span></span>&quot;, o &quot;trovare gli articoli che hanno la parola chiave 'database vettoriale' e sono correlati ad argomenti cloud-native&quot;, Milvus 2.1 vi piacerà.</p>
<p>Milvus 2.1 supporta anche l'indice scalare invertito per migliorare la velocità di filtraggio basato su<a href="https://github.com/s-yata/marisa-trie">MARISA-Tries</a> come struttura dati. Tutti i dati possono ora essere caricati in memoria con un ingombro molto ridotto, il che consente un confronto, un filtraggio e una corrispondenza di prefissi molto più rapidi sulle stringhe. I risultati dei nostri test mostrano che il requisito di memoria di MARISA-trie è solo il 10% di quello dei dizionari Python per caricare tutti i dati in memoria e fornire funzionalità di interrogazione.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_new_in_Milvus_Figure_2_excalidraw_a1149aca96.png" alt="Milvus 2.1 combines MARISA-Trie with inverted index to significantly improve filtering speed." class="doc-image" id="milvus-2.1-combines-marisa-trie-with-inverted-index-to-significantly-improve-filtering-speed." />
   </span> <span class="img-wrapper"> <span>Milvus 2.1 combina MARISA-trie con un indice invertito per migliorare significativamente la velocità di filtraggio.</span> </span></p>
<p>In futuro, Milvus continuerà a concentrarsi sugli sviluppi relativi alle query scalari, a supportare altri tipi di indici scalari e operatori di query e a fornire funzionalità di query scalari basate su disco, il tutto nell'ambito di uno sforzo continuo per ridurre i costi di archiviazione e di utilizzo dei dati scalari.</p>
<custom-h1>Miglioramenti dell'usabilità</custom-h1><h2 id="Kafka-support" class="common-anchor-header">Supporto Kafka<button data-href="#Kafka-support" class="anchor-icon" translate="no">
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
    </button></h2><p>La nostra comunità ha richiesto da tempo il supporto di <a href="https://kafka.apache.org">Apache Kafka</a> come <a href="https://milvus.io/docs/v2.1.x/deploy_pulsar.md">storage dei messaggi</a> in Milvus. Milvus 2.1 offre ora la possibilità di utilizzare<a href="https://pulsar.apache.org">Pulsar</a> o Kafka come storage dei messaggi in base alle configurazioni dell'utente, grazie al design di astrazione e incapsulamento di Milvus e all'SDK Go Kafka fornito da Confluent.</p>
<h2 id="Production-ready-Java-SDK" class="common-anchor-header">SDK Java pronto per la produzione<button data-href="#Production-ready-Java-SDK" class="anchor-icon" translate="no">
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
    </button></h2><p>Con Milvus 2.1, il nostro <a href="https://github.com/milvus-io/milvus-sdk-java">SDK Java</a> è ora ufficialmente rilasciato. L'SDK Java ha le stesse funzionalità dell'SDK Python, con prestazioni di concorrenza ancora migliori. Nella prossima fase, i collaboratori della nostra comunità miglioreranno gradualmente la documentazione e i casi d'uso dell'SDK Java e contribuiranno a rendere pronti per la produzione anche gli SDK Go e RESTful.</p>
<h2 id="Observability-and-maintainability" class="common-anchor-header">Osservabilità e manutenibilità<button data-href="#Observability-and-maintainability" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 aggiunge importanti<a href="https://milvus.io/docs/v2.1.x/metrics_dashboard.md">metriche di</a> monitoraggio come il conteggio degli inserimenti di vettori, la latenza/throughput di ricerca, l'overhead della memoria del nodo e l'overhead della CPU. Inoltre, la nuova versione ottimizza in modo significativo la tenuta dei registri, regolandone i livelli e riducendo la stampa di registri inutili.</p>
<h2 id="Embedded-Milvus" class="common-anchor-header">Milvus integrato<button data-href="#Embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus ha semplificato notevolmente l'implementazione di servizi di recupero di dati vettoriali massivi su larga scala, ma per gli scienziati che vogliono convalidare gli algoritmi su scala ridotta, Docker o K8s sono ancora troppo inutilmente complicati. Con l'introduzione di <a href="https://github.com/milvus-io/embd-milvus">Milvus incorporato</a>, è ora possibile installare Milvus utilizzando pip, proprio come con Pyrocksb e Pysqlite. Milvus integrato supporta tutte le funzionalità sia della versione cluster che di quella standalone, consentendo di passare facilmente dal proprio portatile a un ambiente di produzione distribuito senza modificare una sola riga di codice. I progettisti di algoritmi avranno un'esperienza molto migliore quando costruiranno un prototipo con Milvus.</p>
<custom-h1>Provate subito la ricerca vettoriale out-of-the-box</custom-h1><p>Inoltre, Milvus 2.1 presenta anche alcuni grandi miglioramenti in termini di stabilità e scalabilità, e attendiamo il vostro utilizzo e i vostri feedback.</p>
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
    </button></h2><ul>
<li>Consultate le <a href="https://milvus.io/docs/v2.1.x/release_notes.md">note di rilascio</a> dettagliate per tutte le modifiche apportate a Milvus 2.1.</li>
<li><a href="https://milvus.io/docs/v2.1.x/install_standalone-docker.md">Installate</a>Milvus 2.1 e provate le nuove funzionalità.</li>
<li>Unitevi alla nostra <a href="https://slack.milvus.io/">comunità Slack</a> e discutete delle nuove funzionalità con migliaia di utenti Milvus in tutto il mondo</li>
<li>Seguiteci su <a href="https://twitter.com/milvusio">Twitter</a> e<a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> per ricevere gli aggiornamenti quando i nostri blog sulle nuove funzionalità specifiche saranno pubblicati.</li>
</ul>
<blockquote>
<p>A cura di <a href="https://github.com/songxianj">Songxian Jiang</a></p>
</blockquote>
