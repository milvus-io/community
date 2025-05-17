---
id: >-
  milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md
title: >-
  Anteprima di Milvus 2.6: Riduzione della memoria del 72% senza compromettere
  il richiamo e 4 volte più veloce di Elasticsearch
author: Ken Zhang
date: 2025-05-17T00:00:00.000Z
cover: >-
  assets.zilliz.com/Milvus_2_6_Preview_72_Memory_Reduction_Without_Compromising_Recall_and_4x_Faster_Than_Elasticsearch_c607b644f1.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus 2.6, vector database, vector search, full text search, AI search'
meta_title: >
  Milvus 2.6 Preview: 72% Memory Reduction Without Compromising Recall and 4x
  Faster Than Elasticsearch
desc: >-
  Scoprite in esclusiva le innovazioni dell'imminente Milvus 2.6 che
  ridefiniranno le prestazioni e l'efficienza dei database vettoriali.
origin: >-
  https://milvus.io/blog/milvus-26-preview-72-memory-reduction-without-compromising-recall-and-4x-faster-than-elasticsearch.md
---
<p>Nel corso di questa settimana, abbiamo condiviso una serie di interessanti innovazioni in Milvus che spingono i confini della tecnologia dei database vettoriali:</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">La ricerca vettoriale nel mondo reale: come filtrare in modo efficiente senza uccidere il richiamo </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Portare la compressione vettoriale all'estremo: come Milvus serve 3 volte più query con RaBitQ</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">I benchmark mentono: i DB vettoriali meritano un test reale </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Abbiamo sostituito Kafka/Pulsar con un Woodpecker per Milvus </a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH in Milvus: l'arma segreta per combattere i duplicati nei dati di addestramento LLM </a></p></li>
</ul>
<p>Ora, mentre concludiamo la nostra serie di settimane Milvus, sono entusiasta di darvi un'anticipazione di ciò che arriverà in Milvus 2.6, una pietra miliare cruciale nella nostra roadmap di prodotti 2025, attualmente in fase di sviluppo, e di come questi miglioramenti trasformeranno la ricerca alimentata dall'intelligenza artificiale. La prossima release riunisce tutte queste innovazioni e altre ancora su tre fronti critici: <strong>ottimizzazione dell'efficienza dei costi</strong>, <strong>funzionalità di ricerca avanzate</strong> e <strong>una nuova architettura</strong> che spinge la ricerca vettoriale oltre la scala dei 10 miliardi di vettori.</p>
<p>Vediamo alcuni dei principali miglioramenti che potrete aspettarvi con l'arrivo di Milvus 2.6 a giugno, a partire da quelli che potrebbero avere un impatto più immediato: una drastica riduzione dell'uso della memoria e dei costi e prestazioni ultraveloci.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_2_6_Preview_72_Memory_Reduction_Without_Compromising_Recall_and_4x_Faster_Than_Elasticsearch_c607b644f1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Cost-Reduction-Slash-Memory-Usage-While-Boosting-Performance" class="common-anchor-header">Riduzione dei costi: Riduzione dell'uso della memoria e aumento delle prestazioni<button data-href="#Cost-Reduction-Slash-Memory-Usage-While-Boosting-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>L'utilizzo di una memoria costosa rappresenta uno dei maggiori ostacoli alla scalabilità della ricerca vettoriale fino a miliardi di record. Milvus 2.6 introdurrà diverse ottimizzazioni chiave che ridurranno drasticamente i costi dell'infrastruttura, migliorando al contempo le prestazioni.</p>
<h3 id="RaBitQ-1-bit-Quantization-72-Memory-Reduction-with-4×-QPS-and-No-Recall-Loss" class="common-anchor-header">Quantizzazione a 1 bit RaBitQ: 72% di riduzione della memoria con 4× QPS e nessuna perdita di richiamo</h3><p>Il consumo di memoria è stato a lungo il tallone d'Achille dei database vettoriali su larga scala. Sebbene la quantizzazione vettoriale non sia una novità, la maggior parte degli approcci esistenti sacrifica troppo la qualità della ricerca per risparmiare memoria. Milvus 2.6 affronta questa sfida introducendo la<a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md"> quantizzazione a 1 bit RaBitQ</a> negli ambienti di produzione.</p>
<p>Ciò che rende speciale la nostra implementazione è la capacità di ottimizzazione Refine regolabile che stiamo costruendo. Implementando un indice primario con quantizzazione RaBitQ e opzioni SQ4/SQ6/SQ8 Refine, abbiamo raggiunto un equilibrio ottimale tra utilizzo della memoria e qualità della ricerca (~95% di richiamo).</p>
<p>I nostri benchmark preliminari rivelano risultati promettenti:</p>
<table>
<thead>
<tr><th><strong>Metriche di</strong><strong>prestazione</strong> </th><th><strong>Tradizionale IVF_FLAT</strong></th><th><strong>Solo RaBitQ (1 bit)</strong></th><th><strong>RaBitQ (1 bit) + SQ8 Raffinare</strong></th></tr>
</thead>
<tbody>
<tr><td>Impronta di memoria</td><td>100% (linea di base)</td><td>3% (riduzione del 97%)</td><td>28% (riduzione del 72%)</td></tr>
<tr><td>Qualità di richiamo</td><td>95.2%</td><td>76.3%</td><td>94.9%</td></tr>
<tr><td>Velocità di interrogazione (QPS)</td><td>236</td><td>648 (2,7 volte più veloce)</td><td>946 (4 volte più veloce)</td></tr>
</tbody>
</table>
<p><em>Tabella: Valutazione di VectorDBBench con 1M di vettori di 768 dimensioni, testati su AWS m6id.2xlarge</em></p>
<p>Il vero punto di forza non è solo la riduzione della memoria, ma il fatto di ottenere contemporaneamente un miglioramento del throughput di 4 volte senza compromettere la precisione. Ciò significa che sarete in grado di servire lo stesso carico di lavoro con il 75% di server in meno o di gestire un traffico 4 volte superiore sulla vostra infrastruttura esistente.</p>
<p>Per gli utenti aziendali che utilizzano Milvus completamente gestito su<a href="https://zilliz.com/cloud"> Zilliz Cloud</a>, stiamo sviluppando profili di configurazione automatizzati che regoleranno dinamicamente i parametri di RaBitQ in base alle caratteristiche specifiche del carico di lavoro e ai requisiti di precisione.</p>
<h3 id="400-Faster-Full-text-Search-Than-Elasticsearch" class="common-anchor-header">Ricerca full-text più veloce del 400% rispetto a Elasticsearch</h3><p>Le funzionalità di<a href="https://milvus.io/blog/full-text-search-in-milvus-what-is-under-the-hood.md">ricerca full-text</a> nei database vettoriali sono diventate essenziali per la creazione di sistemi di reperimento ibridi. Da quando abbiamo introdotto BM25 in <a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5</a>, abbiamo ricevuto un feedback entusiasta, insieme a richieste di migliori prestazioni su scala.</p>
<p>Milvus 2.6 offrirà un sostanziale aumento delle prestazioni su BM25. I nostri test sul set di dati BEIR mostrano un throughput 3-4 volte superiore a quello di Elasticsearch con tassi di richiamo equivalenti. Per alcuni carichi di lavoro, il miglioramento arriva fino a 7 volte il QPS.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Milvus_vs_Elasticsearch_on_throughput_140b7c1b06.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Figura: Milvus vs. Elasticsearch sul throughput JSON Path Index: 99% di latenza in meno per filtri complessi</p>
<p>Le moderne applicazioni di intelligenza artificiale raramente si affidano alla sola similarità vettoriale: quasi sempre combinano la ricerca vettoriale con il filtraggio dei metadati. Quando queste condizioni di filtraggio diventano più complesse (soprattutto con oggetti JSON annidati), le prestazioni delle query possono peggiorare rapidamente.</p>
<p>Milvus 2.6 introdurrà un meccanismo di indicizzazione mirata per i percorsi JSON annidati che consente di creare indici su percorsi specifici (ad esempio, $meta. <code translate="no">user_info.location</code>) all'interno dei campi JSON. Invece di scansionare interi oggetti, Milvus cercherà direttamente i valori dagli indici precostituiti.</p>
<p>Nella nostra valutazione con oltre 100 M di record, JSON Path Index ha ridotto la latenza dei filtri da <strong>140 ms</strong> (P99: 480 ms) a soli <strong>1,5 ms</strong> (P99: 10 ms), una riduzione del 99% che trasformerà le query precedentemente impraticabili in risposte immediate.</p>
<p>Questa caratteristica sarà particolarmente utile per:</p>
<ul>
<li><p>sistemi di raccomandazione con un complesso filtraggio degli attributi dell'utente</p></li>
<li><p>Applicazioni RAG che filtrano i documenti in base a varie etichette</p></li>
</ul>
<h2 id="Next-Generation-Search-From-Basic-Vector-Similarity-to-Production-Grade-Retrieval" class="common-anchor-header">Ricerca di nuova generazione: Dalla similarità vettoriale di base al recupero di livello produttivo<button data-href="#Next-Generation-Search-From-Basic-Vector-Similarity-to-Production-Grade-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>La ricerca vettoriale da sola non è sufficiente per le moderne applicazioni di intelligenza artificiale. Gli utenti chiedono la precisione del recupero tradizionale delle informazioni combinata con la comprensione semantica delle incorporazioni vettoriali. Milvus 2.6 introdurrà diverse funzioni di ricerca avanzate che colmeranno questo divario.</p>
<h3 id="Better-Full-text-Search-with-Multi-language-Analyzer" class="common-anchor-header">Migliore ricerca full-text con analizzatore multilingue</h3><p>La ricerca full-text è fortemente dipendente dalla lingua... Milvus 2.6 introdurrà una pipeline di analisi del testo completamente rinnovata con supporto multilingue:</p>
<ul>
<li><p><code translate="no">RUN_ANALYZER</code> supporto della sintassi per l'osservabilità della configurazione dell'analizzatore/tokenizzazione</p></li>
<li><p>tokenizzatore Lindera per le lingue asiatiche come il giapponese e il coreano</p></li>
<li><p>tokenizzatore ICU per un supporto multilingue completo</p></li>
<li><p>Configurazione linguistica granulare per la definizione di regole di tokenizzazione specifiche per ogni lingua</p></li>
<li><p>Jieba migliorato con supporto per l'integrazione di dizionari personalizzati</p></li>
<li><p>Opzioni di filtro ampliate per un'elaborazione del testo più precisa</p></li>
</ul>
<p>Per le applicazioni globali, questo significa una migliore ricerca multilingue senza indicizzazione specializzata per lingua o complessi workaround.</p>
<h3 id="Phrase-Match-Capturing-Semantic-Nuance-in-Word-Order" class="common-anchor-header">Phrase Match: Catturare la sfumatura semantica nell'ordine delle parole</h3><p>L'ordine delle parole trasmette distinzioni di significato critiche che spesso sfuggono alla ricerca per parole chiave. Provate a confrontare &quot;tecniche di apprendimento automatico&quot; con &quot;tecniche di apprendimento automatico&quot;: stesse parole, significato completamente diverso.</p>
<p>Milvus 2.6 aggiungerà la <strong>funzione Phrase Match</strong>, che offre agli utenti un maggiore controllo sull'ordine delle parole e sulla loro prossimità rispetto alla ricerca full-text o alla corrispondenza esatta delle stringhe:</p>
<pre><code translate="no">PHRASE_MATCH(field_name, phrase, slop)
<button class="copy-code-btn"></button></code></pre>
<p>Il parametro <code translate="no">slop</code> consentirà di controllare in modo flessibile la prossimità delle parole: 0 richiede una corrispondenza esatta e consecutiva, mentre valori più alti consentono piccole variazioni nella frase.</p>
<p>Questa funzione sarà particolarmente utile per:</p>
<ul>
<li><p>Ricerca di documenti legali, dove l'esatta formulazione ha un significato legale.</p></li>
<li><p>Ricerca di contenuti tecnici in cui l'ordine dei termini distingue diversi concetti</p></li>
<li><p>Database di brevetti in cui è necessario trovare una corrispondenza precisa a frasi tecniche specifiche.</p></li>
</ul>
<h3 id="Time-Aware-Decay-Functions-Automatically-Prioritize-Fresh-Content" class="common-anchor-header">Funzioni di decadimento consapevoli del tempo: Privilegiare automaticamente i contenuti freschi</h3><p>Il valore delle informazioni spesso diminuisce con il tempo. Gli articoli di cronaca, i comunicati stampa e i post sui social network diventano meno rilevanti man mano che invecchiano, ma gli algoritmi di ricerca tradizionali trattano tutti i contenuti allo stesso modo, indipendentemente dalla data di pubblicazione.</p>
<p>Milvus 2.6 introdurrà le <strong>funzioni di decadimento</strong> per un ranking consapevole del tempo, che regolano automaticamente i punteggi di rilevanza in base all'età dei documenti.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/decay_function_210e65f9a0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sarà possibile configurare:</p>
<ul>
<li><p><strong>Tipo di funzione</strong>: Esponenziale (decadimento rapido), Gaussiana (decadimento graduale) o Lineare (decadimento costante).</p></li>
<li><p><strong>Tasso di decadimento</strong>: La velocità con cui la rilevanza diminuisce nel tempo</p></li>
<li><p><strong>Punto di origine</strong>: Il timestamp di riferimento per misurare le differenze temporali</p></li>
</ul>
<p>Questa ri-classificazione sensibile al tempo garantisce che i risultati più aggiornati e contestualmente rilevanti appaiano per primi, il che è fondamentale per i sistemi di raccomandazione delle notizie, le piattaforme di e-commerce e i feed dei social media.</p>
<h3 id="Data-in-Data-Out-From-Raw-Text-to-Vector-Search-in-One-Step" class="common-anchor-header">Dati in entrata, dati in uscita: Dal testo grezzo alla ricerca vettoriale in un solo passaggio</h3><p>Uno dei maggiori problemi degli sviluppatori con i database vettoriali è stato lo scollamento tra i dati grezzi e le incorporazioni vettoriali. Milvus 2.6 semplificherà drasticamente questo flusso di lavoro grazie a una nuova interfaccia <strong>Function</strong> che integra i modelli di incorporamento di terze parti direttamente nella pipeline dei dati. Questo semplifica la pipeline di ricerca vettoriale con un'unica chiamata.</p>
<p>Invece di pre-compilare le incorporazioni, sarete in grado di:</p>
<ol>
<li><p><strong>Inserire direttamente i dati grezzi</strong>: Inviare testo, immagini o altri contenuti a Milvus.</p></li>
<li><p><strong>Configurare i fornitori di embedding per la vettorizzazione</strong>: Milvus può collegarsi a servizi di modelli di embedding come OpenAI, AWS Bedrock, Google Vertex AI e Hugging Face.</p></li>
<li><p><strong>Interrogazione in linguaggio naturale</strong>: Ricerca tramite query di testo, non tramite incorporazioni vettoriali.</p></li>
</ol>
<p>In questo modo si crea un'esperienza semplificata "Data-In, Data-Out" in cui Milvus gestisce internamente la generazione dei vettori, rendendo il codice dell'applicazione più semplice.</p>
<h2 id="Architectural-Evolution-Scaling-to-Hundreds-of-Billions-of-Vectors" class="common-anchor-header">Evoluzione architettonica: Scalare fino a centinaia di miliardi di vettori<button data-href="#Architectural-Evolution-Scaling-to-Hundreds-of-Billions-of-Vectors" class="anchor-icon" translate="no">
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
    </button></h2><p>Un buon database non si limita ad avere grandi funzionalità, ma deve anche fornirle su scala, testate in produzione.</p>
<p>Milvus 2.6 introdurrà un cambiamento architettonico fondamentale che consentirà di scalare in modo conveniente fino a centinaia di miliardi di vettori. Il punto forte è una nuova architettura di archiviazione a livelli caldo-freddo che gestisce in modo intelligente il posizionamento dei dati in base agli schemi di accesso, spostando automaticamente i dati caldi nella memoria/SSD ad alte prestazioni e collocando i dati freddi nell'archiviazione a oggetti più economica. Questo approccio può ridurre drasticamente i costi, mantenendo le prestazioni delle query dove sono più importanti.</p>
<p>Inoltre, un nuovo <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md#StreamingService-Built-for-Real-Time-Data-Flow">Streaming Node</a> consentirà l'elaborazione vettoriale in tempo reale con l'integrazione diretta con piattaforme di streaming come Kafka e Pulsar e il nuovo <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Woodpecker</a>, rendendo i nuovi dati immediatamente consultabili senza ritardi di batch.</p>
<h2 id="Stay-tuned-for-Milvus-26" class="common-anchor-header">Restate sintonizzati per Milvus 2.6<button data-href="#Stay-tuned-for-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 è attualmente in fase di sviluppo attivo e sarà disponibile a giugno. Siamo entusiasti di potervi offrire queste ottimizzazioni rivoluzionarie delle prestazioni, capacità di ricerca avanzate e una nuova architettura per aiutarvi a creare applicazioni di intelligenza artificiale scalabili a costi inferiori.</p>
<p>Nel frattempo, siamo lieti di ricevere il vostro feedback su queste funzioni in arrivo. Cosa vi entusiasma di più? Quali sono le funzionalità che avrebbero il maggiore impatto sulle vostre applicazioni? Unitevi alla conversazione nel nostro<a href="https://discord.com/invite/8uyFbECzPX"> canale Discord</a> o seguite i nostri progressi su<a href="https://github.com/milvus-io/milvus"> GitHub</a>.</p>
<p>Volete essere i primi a sapere quando Milvus 2.6 verrà rilasciato? Seguiteci su<a href="https://www.linkedin.com/company/zilliz/"> LinkedIn</a> o su<a href="https://twitter.com/milvusio"> X</a> per ricevere gli ultimi aggiornamenti.</p>
