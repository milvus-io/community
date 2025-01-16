---
id: scalable-and-blazing-fast-similarity-search-with-milvus-vector-database.md
title: >-
  Ricerca di similarità scalabile e velocissima con il database vettoriale
  Milvus
author: Dipanjan Sarkar
date: 2022-06-21T00:00:00.000Z
desc: >-
  Archiviate, indicizzate, gestite e ricercate trilioni di vettori di documenti
  in pochi millisecondi!
cover: assets.zilliz.com/69eba74e_4a9a_4c38_a2d9_2cde283e8a1d_e265515238.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: >-
  https://milvus.io/blog/scalable_and_blazing_fast_similarity_search_with_milvus_vector_database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/69eba74e_4a9a_4c38_a2d9_2cde283e8a1d_e265515238.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>immagine di copertina</span> </span></p>
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
    </button></h2><p>In questo articolo tratteremo alcuni aspetti interessanti relativi ai database vettoriali e alla ricerca di similarità su scala. Nel mondo di oggi, in rapida evoluzione, vediamo nuove tecnologie, nuove aziende, nuove fonti di dati e, di conseguenza, dobbiamo continuare a utilizzare nuovi modi per archiviare, gestire e sfruttare questi dati per ottenere informazioni. Per decenni i dati strutturati e tabellari sono stati archiviati in database relazionali e la Business Intelligence si basa sull'analisi e sull'estrazione di informazioni da questi dati. Tuttavia, considerando l'attuale panorama dei dati, "oltre l'80-90% dei dati è costituito da informazioni non strutturate come testo, video, audio, log di server web, social media e altro ancora". Le organizzazioni hanno sfruttato la potenza dell'apprendimento automatico e dell'apprendimento profondo per cercare di estrarre informazioni da questi dati, poiché i metodi tradizionali basati sulle query potrebbero non essere sufficienti o addirittura possibili. Esiste un enorme potenziale non sfruttato per estrarre informazioni preziose da questi dati e siamo solo all'inizio!</p>
<blockquote>
<p>"Poiché la maggior parte dei dati del mondo non è strutturata, la capacità di analizzarli e di agire su di essi rappresenta una grande opportunità". - Mikey Shulman, responsabile ML, Kensho</p>
</blockquote>
<p>I dati non strutturati, come suggerisce il nome, non hanno una struttura implicita, come una tabella di righe e colonne (quindi chiamati dati tabellari o strutturati). A differenza dei dati strutturati, non esiste un modo semplice per memorizzare i contenuti dei dati non strutturati all'interno di un database relazionale. Le sfide principali per lo sfruttamento dei dati non strutturati sono tre:</p>
<ul>
<li><strong>Memorizzazione:</strong> I normali database relazionali sono adatti a contenere dati strutturati. Sebbene sia possibile utilizzare i database NoSQL per archiviare tali dati, l'elaborazione di questi dati per estrarre le rappresentazioni giuste per alimentare le applicazioni di intelligenza artificiale su scala diventa un ulteriore sovraccarico.</li>
<li><strong>Rappresentazione:</strong> I computer non capiscono il testo o le immagini come noi. Capiscono solo i numeri e noi dobbiamo convertire i dati non strutturati in una rappresentazione numerica utile, in genere vettori o embeddings.</li>
<li><strong>Interrogazione:</strong> Non è possibile interrogare i dati non strutturati direttamente sulla base di dichiarazioni condizionali definite come l'SQL per i dati strutturati. Immaginiamo un semplice esempio di ricerca di scarpe simili, data una foto del nostro paio di scarpe preferite! Non è possibile utilizzare i valori grezzi dei pixel per la ricerca, né rappresentare caratteristiche strutturate come la forma, la misura, lo stile, il colore e altro ancora. Immaginate di doverlo fare per milioni di scarpe!</li>
</ul>
<p>Per questo motivo, per consentire ai computer di comprendere, elaborare e rappresentare i dati non strutturati, di solito li convertiamo in vettori densi, spesso chiamati embeddings.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Representing_Images_as_Dense_Embedding_Vectors_0b6a5f516c.png" alt="figure 1" class="doc-image" id="figure-1" />
   </span> <span class="img-wrapper"> <span>Figura 1</span> </span></p>
<p>Esiste una varietà di metodologie che sfruttano in particolare il deep learning, tra cui le reti neurali convoluzionali (CNN) per i dati visivi come le immagini e i Transformer per i dati testuali, che possono essere utilizzati per trasformare questi dati non strutturati in embeddings. <a href="https://zilliz.com/">Zilliz</a> ha <a href="https://zilliz.com/learn/embedding-generation">un ottimo articolo che illustra le diverse tecniche di embedding</a>!</p>
<p>Ora, memorizzare questi vettori di incorporazioni non è sufficiente. Bisogna anche essere in grado di interrogare e trovare vettori simili. Perché lo chiedete? La maggior parte delle applicazioni del mondo reale si basa sulla ricerca di similarità vettoriali per soluzioni basate sull'intelligenza artificiale. Ciò include la ricerca visiva (immagini) in Google, i sistemi di raccomandazione in Netflix o Amazon, i motori di ricerca testuale in Google, la ricerca multimodale, la de-duplicazione dei dati e molto altro ancora!</p>
<p>Memorizzare, gestire e interrogare i vettori su scala non è un compito semplice. Per questo sono necessari strumenti specializzati e i database vettoriali sono lo strumento più efficace per questo lavoro! In questo articolo tratteremo i seguenti aspetti:</p>
<ul>
<li><a href="#Vectors-and-Vector-Similarity-Search">Vettori e ricerca di similarità vettoriale</a></li>
<li><a href="#What-is-a-Vector-Database">Che cos'è un database vettoriale?</a></li>
<li><a href="#Milvus—The-World-s-Most-Advanced-Vector-Database">Milvus - Il database vettoriale più avanzato al mondo</a></li>
<li><a href="#Performing-visual-image-search-with-Milvus—A-use-case-blueprint">Esecuzione di una ricerca visiva di immagini con Milvus - Un caso d'uso</a></li>
</ul>
<p>Iniziamo!</p>
<h2 id="Vectors-and-Vector-Similarity-Search" class="common-anchor-header">Vettori e ricerca di similarità vettoriale<button data-href="#Vectors-and-Vector-Similarity-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Prima abbiamo stabilito la necessità di rappresentare i dati non strutturati, come le immagini e il testo, come vettori, poiché i computer possono comprendere solo i numeri. In genere sfruttiamo i modelli di intelligenza artificiale, più precisamente i modelli di deep learning, per convertire i dati non strutturati in vettori numerici che possono essere letti dalle macchine. In genere questi vettori sono fondamentalmente un elenco di numeri in virgola mobile che rappresentano collettivamente l'elemento sottostante (immagine, testo ecc.).</p>
<h3 id="Understanding-Vectors" class="common-anchor-header">Capire i vettori</h3><p>Nel campo dell'elaborazione del linguaggio naturale (NLP) esistono molti modelli di incorporamento delle parole, come <a href="https://towardsdatascience.com/understanding-feature-engineering-part-4-deep-learning-methods-for-text-data-96c44370bbfa">Word2Vec, GloVe e FastText</a>, che possono aiutare a rappresentare le parole come vettori numerici. Con il passare del tempo, si è assistito alla nascita di modelli <a href="https://arxiv.org/abs/1706.03762">di trasformazione</a> come <a href="https://jalammar.github.io/illustrated-bert/">BERT</a>, che possono essere sfruttati per apprendere vettori di incorporamento contestuali e migliori rappresentazioni per intere frasi e paragrafi.</p>
<p>Allo stesso modo, nel campo della computer vision abbiamo modelli come le <a href="https://proceedings.neurips.cc/paper/2012/file/c399862d3b9d6b76c8436e924a68c45b-Paper.pdf">reti neurali convoluzionali (CNN)</a> che possono aiutare ad apprendere rappresentazioni da dati visivi come immagini e video. Con l'avvento dei trasformatori, abbiamo anche i <a href="https://arxiv.org/abs/2010.11929">trasformatori di visione</a> che possono avere prestazioni migliori delle normali CNN.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sample_workflow_for_extracting_insights_from_unstructured_data_c74f08f75a.png" alt="figure 2" class="doc-image" id="figure-2" />
   </span> <span class="img-wrapper"> <span>Figura 2</span> </span></p>
<p>Il vantaggio di questi vettori è che possono essere sfruttati per risolvere problemi del mondo reale come la ricerca visiva, in cui si carica una foto e si ottengono risultati di ricerca che includono immagini visivamente simili. Google ha una funzione molto popolare nel suo motore di ricerca, come illustrato nell'esempio seguente.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/An_example_of_Google_s_Visual_Image_Search_fa49b81e88.png" alt="figure 3" class="doc-image" id="figure-3" />
   </span> <span class="img-wrapper"> <span>Figura 3</span> </span></p>
<p>Tali applicazioni sono alimentate da vettori di dati e dalla ricerca di similarità vettoriale. Se si considerano due punti in uno spazio di coordinate cartesiane X-Y. La distanza tra due punti può essere calcolata come una semplice distanza euclidea, rappresentata dalla seguente equazione.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_D_Euclidean_Distance_6a52b7bc2f.png" alt="figure 4" class="doc-image" id="figure-4" />
   </span> <span class="img-wrapper"> <span>figura 4</span> </span></p>
<p>Immaginando che ogni punto dati sia un vettore di dimensioni D, è possibile utilizzare la distanza euclidea o anche altre metriche di distanza come la distanza di Hamming o la distanza del coseno per scoprire quanto sono vicini i due punti dati. Questo può aiutare a costruire una nozione di vicinanza o di somiglianza che può essere usata come metrica quantificabile per trovare elementi simili dati da un elemento di riferimento usando i loro vettori.</p>
<h3 id="Understanding-Vector-Similarity-Search" class="common-anchor-header">Capire la ricerca per similarità vettoriale</h3><p>La ricerca per similarità vettoriale, spesso nota come ricerca del vicino più prossimo (NN), è fondamentalmente il processo di calcolo della somiglianza a coppie (o delle distanze) tra un elemento di riferimento (per il quale si vogliono trovare elementi simili) e un insieme di elementi esistenti (tipicamente in un database) e di restituzione dei primi 'k' vicini più prossimi che sono i primi 'k' elementi più simili. Il componente chiave per calcolare questa somiglianza è la metrica di somiglianza, che può essere la distanza euclidea, il prodotto interno, la distanza coseno, la distanza di Hamming, ecc. Quanto più piccola è la distanza, tanto più simili sono i vettori.</p>
<p>La sfida della ricerca esatta del vicino (NN) è la scalabilità. È necessario calcolare N distanze (assumendo N elementi esistenti) ogni volta per ottenere elementi simili. Questo può essere molto lento, soprattutto se non si memorizzano e indicizzano i dati da qualche parte (come un database vettoriale!). Per accelerare i calcoli, di solito si ricorre alla ricerca approssimata dei vicini, spesso chiamata ricerca ANN, che finisce per memorizzare i vettori in un indice. L'indice aiuta a memorizzare questi vettori in modo intelligente per consentire un rapido recupero dei vicini "approssimativamente" simili per un elemento di riferimento della query. Le tipiche metodologie di indicizzazione della RNA includono:</p>
<ul>
<li><strong>Trasformazioni vettoriali:</strong> Include l'aggiunta di trasformazioni aggiuntive ai vettori, come la riduzione delle dimensioni (ad esempio PCA \ t-SNE), la rotazione e così via.</li>
<li><strong>Codifica dei vettori:</strong> Applicazione di tecniche basate su strutture di dati come Locality Sensitive Hashing (LSH), Quantizzazione, Alberi, ecc. che possono aiutare a recuperare più velocemente elementi simili.</li>
<li><strong>Metodi di ricerca non esaustivi:</strong> Sono utilizzati soprattutto per evitare la ricerca esaustiva e comprendono metodi come i grafi di vicinato, gli indici invertiti ecc.</li>
</ul>
<p>Per creare un'applicazione di ricerca per similarità vettoriale, è necessario un database che possa aiutare a memorizzare, indicizzare e interrogare in modo efficiente (ricerca) su scala. Ecco i database vettoriali!</p>
<h2 id="What-is-a-Vector-Database" class="common-anchor-header">Che cos'è un database vettoriale?<button data-href="#What-is-a-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>Dato che ora abbiamo capito come i vettori possono essere utilizzati per rappresentare i dati non strutturati e come funziona la ricerca vettoriale, possiamo combinare insieme i due concetti per costruire un database vettoriale.</p>
<p>I database vettoriali sono piattaforme di dati scalabili per memorizzare, indicizzare e interrogare vettori incorporati generati da dati non strutturati (immagini, testo ecc.) utilizzando modelli di deep learning.</p>
<p>Gestire un numero enorme di vettori per la ricerca di similarità (anche con gli indici) può essere molto costoso. Ciononostante, i database vettoriali migliori e più avanzati dovrebbero consentire di inserire, indicizzare e cercare tra milioni o miliardi di vettori di destinazione, oltre a specificare un algoritmo di indicizzazione e una metrica di similarità a scelta.</p>
<p>I database vettoriali devono principalmente soddisfare i seguenti requisiti chiave per un sistema di gestione di database robusto da utilizzare in azienda:</p>
<ol>
<li><strong>Scalabile:</strong> I database vettoriali devono essere in grado di indicizzare ed eseguire una ricerca approssimativa dei vicini per miliardi di vettori incorporati.</li>
<li><strong>Affidabile:</strong> I database vettoriali devono essere in grado di gestire i guasti interni senza perdita di dati e con un impatto operativo minimo, vale a dire essere tolleranti ai guasti.</li>
<li><strong>Veloce:</strong> La velocità di interrogazione e di scrittura è importante per i database vettoriali. Per piattaforme come Snapchat e Instagram, che possono avere centinaia o migliaia di nuove immagini caricate al secondo, la velocità diventa un fattore incredibilmente importante.</li>
</ol>
<p>I database vettoriali non si limitano a memorizzare i dati vettoriali. Sono anche responsabili dell'utilizzo di strutture dati efficienti per indicizzare questi vettori per un rapido recupero e per supportare le operazioni CRUD (creazione, lettura, aggiornamento e cancellazione). I database vettoriali dovrebbero anche supportare idealmente il filtraggio degli attributi, ovvero il filtraggio basato su campi di metadati che di solito sono campi scalari. Un semplice esempio potrebbe essere il recupero di scarpe simili in base ai vettori di immagini per una marca specifica. In questo caso, la marca sarebbe l'attributo in base al quale effettuare il filtraggio.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Bitmask_f72259b751.png" alt="figure 5" class="doc-image" id="figure-5" />
   </span> <span class="img-wrapper"> <span>Figura 5</span> </span></p>
<p>La figura precedente mostra come <a href="https://milvus.io/">Milvus</a>, il database vettoriale di cui parleremo tra poco, utilizza il filtraggio degli attributi. <a href="https://milvus.io/">Milvus</a> introduce il concetto di bitmask nel meccanismo di filtraggio per mantenere vettori simili con un bitmask di 1 in base alla soddisfazione di specifici filtri di attributo. Maggiori dettagli su questo aspetto <a href="https://zilliz.com/learn/attribute-filtering">sono disponibili qui</a>.</p>
<h2 id="Milvus--The-World’s-Most-Advanced-Vector-Database" class="common-anchor-header">Milvus - Il database vettoriale più avanzato del mondo<button data-href="#Milvus--The-World’s-Most-Advanced-Vector-Database" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a> è una piattaforma open-source per la gestione di database vettoriali costruita appositamente per i dati vettoriali su larga scala e per semplificare le operazioni di apprendimento automatico (MLOps).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_Logo_ee3ae48b61.png" alt="figure 6" class="doc-image" id="figure-6" />
   </span> <span class="img-wrapper"> <span>figura 6</span> </span></p>
<p><a href="https://zilliz.com/">Zilliz</a> è l'organizzazione che ha realizzato <a href="https://milvus.io/">Milvus</a>, il database vettoriale più avanzato al mondo, per accelerare lo sviluppo di data fabric di nuova generazione. Milvus è attualmente un progetto di laurea presso la <a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation</a> e si concentra sulla gestione di enormi insiemi di dati non strutturati per l'archiviazione e la ricerca. L'efficienza e l'affidabilità della piattaforma semplificano il processo di implementazione di modelli di AI e MLOps su scala. Milvus ha ampie applicazioni che spaziano dalla scoperta di farmaci, alla computer vision, ai sistemi di raccomandazione, ai chatbot e molto altro ancora.</p>
<h3 id="Key-Features-of-Milvus" class="common-anchor-header">Caratteristiche principali di Milvus</h3><p>Milvus è ricco di caratteristiche e funzionalità utili, quali:</p>
<ul>
<li><strong>Velocità di ricerca impressionante su un trilione di set di dati vettoriali:</strong> La latenza media della ricerca e del recupero vettoriale è stata misurata in millisecondi su un trilione di set di dati vettoriali.</li>
<li><strong>Gestione semplificata dei dati non strutturati:</strong> Milvus dispone di ricche API progettate per i flussi di lavoro della scienza dei dati.</li>
<li><strong>Database vettoriale affidabile e sempre attivo:</strong> Le funzioni di replica e failover/failback integrate in Milvus assicurano che i dati e le applicazioni possano mantenere sempre la continuità operativa.</li>
<li><strong>Altamente scalabile ed elastico:</strong> La scalabilità a livello di componente consente di scalare su e giù su richiesta.</li>
<li><strong>Ricerca ibrida:</strong> Oltre ai vettori, Milvus supporta tipi di dati come booleani, stringhe, numeri interi, numeri in virgola mobile e altro ancora. Milvus abbina il filtraggio scalare a una potente ricerca di similarità vettoriale (come si è visto nell'esempio di similarità delle scarpe).</li>
<li><strong>Struttura Lambda unificata:</strong> Milvus combina l'elaborazione in stream e in batch per l'archiviazione dei dati, per bilanciare tempestività ed efficienza.</li>
<li><strong><a href="https://milvus.io/docs/v2.0.x/timetravel_ref.md">Viaggi nel tempo</a>:</strong> Milvus mantiene una linea temporale per tutte le operazioni di inserimento e cancellazione dei dati. Consente agli utenti di specificare i timestamp in una ricerca per recuperare una vista dei dati in un determinato momento.</li>
<li><strong>Sostenuto dalla comunità e riconosciuto dal settore:</strong> Con oltre 1.000 utenti aziendali, più di 10.5K stelle su <a href="https://github.com/milvus-io/milvus">GitHub</a> e una comunità open-source attiva, non siete soli quando utilizzate Milvus. In quanto progetto di laurea della <a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation</a>, Milvus gode di un sostegno istituzionale.</li>
</ul>
<h3 id="Existing-Approaches-to-Vector-Data-Management-and-Search" class="common-anchor-header">Approcci esistenti alla gestione e alla ricerca dei dati vettoriali</h3><p>Un modo comune di costruire un sistema di intelligenza artificiale basato sulla ricerca di somiglianze vettoriali è quello di accoppiare algoritmi come Approximate Nearest Neighbor Search (ANNS) con librerie open-source come:</p>
<ul>
<li><strong><a href="https://ai.facebook.com/tools/faiss/">Facebook AI Similarity Search (FAISS)</a>:</strong> Questo framework consente una ricerca efficiente della somiglianza e il raggruppamento di vettori densi. Contiene algoritmi che cercano insiemi di vettori di qualsiasi dimensione, fino a quelli che potrebbero non entrare nella RAM. Supporta funzionalità di indicizzazione come il multi-indice invertito e la quantizzazione del prodotto.</li>
<li><strong><a href="https://github.com/spotify/annoy">Annoy di Spotify (Approximate Nearest Neighbors Oh Yeah)</a>:</strong> Questo framework utilizza <a href="http://en.wikipedia.org/wiki/Locality-sensitive_hashing#Random_projection">proiezioni casuali</a> e costruisce un albero per consentire ANNS in scala per vettori densi.</li>
<li><strong><a href="https://github.com/google-research/google-research/tree/master/scann">ScaNN (Scalable Nearest Neighbors) di Google</a>:</strong> Questo framework esegue un'efficiente ricerca di similarità vettoriale in scala. Consiste in implementazioni che includono la potatura dello spazio di ricerca e la quantizzazione per la ricerca del prodotto interno massimo (MIPS).</li>
</ul>
<p>Sebbene ognuna di queste librerie sia utile a modo suo, a causa di diverse limitazioni, queste combinazioni di algoritmi e librerie non sono equivalenti a un vero e proprio sistema di gestione dei dati vettoriali come Milvus. Discuteremo ora alcune di queste limitazioni.</p>
<h3 id="Limitations-of-Existing-Approaches" class="common-anchor-header">Limitazioni degli approcci esistenti</h3><p>Gli approcci esistenti utilizzati per la gestione dei dati vettoriali, come discusso nella sezione precedente, presentano le seguenti limitazioni:</p>
<ol>
<li><strong>Flessibilità:</strong> I sistemi esistenti memorizzano tipicamente tutti i dati nella memoria principale, quindi non possono essere eseguiti facilmente in modalità distribuita su più macchine e non sono adatti a gestire insiemi di dati massicci.</li>
<li><strong>Gestione dinamica dei dati:</strong> I dati sono spesso considerati statici una volta inseriti nei sistemi esistenti, il che complica l'elaborazione dei dati dinamici e rende impossibile una ricerca quasi in tempo reale.</li>
<li><strong>Elaborazione avanzata delle query:</strong> La maggior parte degli strumenti non supporta l'elaborazione avanzata delle query (ad esempio, il filtraggio degli attributi, la ricerca ibrida e le query multivettore), che è essenziale per la costruzione di motori di ricerca di similarità del mondo reale che supportino il filtraggio avanzato.</li>
<li><strong>Ottimizzazioni per il calcolo eterogeneo:</strong> Poche piattaforme offrono ottimizzazioni per architetture di sistema eterogenee su CPU e GPU (ad eccezione di FAISS), con conseguenti perdite di efficienza.</li>
</ol>
<p><a href="https://milvus.io/">Milvus</a> cerca di superare tutte queste limitazioni e ne parleremo in dettaglio nella prossima sezione.</p>
<h3 id="The-Milvus-Advantage-Understanding-Knowhere" class="common-anchor-header">Il vantaggio di Milvus - Comprensione di Knowhere</h3><p><a href="https://milvus.io/">Milvus</a> cerca di affrontare e risolvere con successo le limitazioni dei sistemi esistenti basati su algoritmi inefficienti di gestione dei dati vettoriali e di ricerca di similarità nei seguenti modi:</p>
<ul>
<li>Migliora la flessibilità offrendo il supporto per una varietà di interfacce applicative (inclusi SDK in Python, Java, Go, C++ e API RESTful).</li>
<li>Supporta diversi tipi di indici vettoriali (ad esempio, indici basati sulla quantizzazione e indici basati su grafi) e l'elaborazione avanzata delle query.</li>
<li>Milvus gestisce i dati vettoriali dinamici utilizzando un log-structured merge-tree (albero LSM), mantenendo efficienti gli inserimenti e le cancellazioni di dati e le ricerche in tempo reale.</li>
<li>Milvus offre anche ottimizzazioni per architetture di calcolo eterogenee su CPU e GPU moderne, consentendo agli sviluppatori di adattare i sistemi a scenari, set di dati e ambienti applicativi specifici.</li>
</ul>
<p>Knowhere, il motore di esecuzione vettoriale di Milvus, è un'interfaccia operativa per l'accesso ai servizi negli strati superiori del sistema e alle librerie di ricerca di similarità vettoriale come Faiss, Hnswlib, Annoy negli strati inferiori del sistema. Inoltre, Knowhere è anche responsabile dell'elaborazione eterogenea. Knowhere controlla su quale hardware (ad esempio, CPU o GPU) eseguire le richieste di creazione di indici e di ricerca. È così che Knowhere prende il suo nome: sa dove eseguire le operazioni. Nelle versioni future saranno supportati altri tipi di hardware, tra cui DPU e TPU.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/knowhere_architecture_f1be3dbb1a.png" alt="figure 7" class="doc-image" id="figure-7" />
   </span> <span class="img-wrapper"> <span>Figura 7</span> </span></p>
<p>Il calcolo in Milvus coinvolge principalmente operazioni vettoriali e scalari. Knowhere gestisce solo le operazioni sui vettori in Milvus. La figura precedente illustra l'architettura di Knowhere in Milvus. Il livello più basso è l'hardware di sistema. Le librerie di indici di terze parti si trovano sopra l'hardware. Poi Knowhere interagisce con il nodo indice e il nodo di interrogazione in alto tramite CGO. Knowhere non solo estende ulteriormente le funzioni di Faiss, ma ne ottimizza anche le prestazioni e presenta diversi vantaggi, tra cui il supporto di BitsetView, il supporto di più metriche di similarità, il supporto del set di istruzioni AVX512, la selezione automatica delle istruzioni SIMD e altre ottimizzazioni delle prestazioni. I dettagli sono disponibili <a href="https://milvus.io/blog/deep-dive-8-knowhere.md">qui</a>.</p>
<h3 id="Milvus-Architecture" class="common-anchor-header">Architettura Milvus</h3><p>La figura seguente illustra l'architettura complessiva della piattaforma Milvus. Milvus separa il flusso di dati dal flusso di controllo ed è suddiviso in quattro livelli indipendenti in termini di scalabilità e disaster recovery.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ca80be5f96.png" alt="figure 8" class="doc-image" id="figure-8" />
   </span> <span class="img-wrapper"> <span>Figura 8</span> </span></p>
<ul>
<li><strong>Livello di accesso:</strong> Il livello di accesso è composto da un gruppo di proxy stateless e funge da livello frontale del sistema e da endpoint per gli utenti.</li>
<li><strong>Servizio di coordinamento:</strong> Il servizio di coordinamento è responsabile della gestione dei nodi della topologia del cluster, del bilanciamento del carico, della generazione dei timestamp, della dichiarazione dei dati e della gestione dei dati.</li>
<li><strong>Nodi worker:</strong> Il nodo worker, o di esecuzione, esegue le istruzioni emesse dal servizio coordinatore e i comandi del linguaggio di manipolazione dei dati (DML) avviati dal proxy. Un nodo worker in Milvus è simile a un nodo dati in <a href="https://hadoop.apache.org/">Hadoop</a> o a un region server in HBase.</li>
<li><strong>Archiviazione:</strong> È la pietra angolare di Milvus, responsabile della persistenza dei dati. Il livello di storage è composto da <strong>meta store</strong>, <strong>log broker</strong> e <strong>object storage</strong>.</li>
</ul>
<p>Per maggiori dettagli sull'architettura, consultate <a href="https://milvus.io/docs/v2.0.x/four_layers.md">qui</a>!</p>
<h2 id="Performing-visual-image-search-with-Milvus--A-use-case-blueprint" class="common-anchor-header">Eseguire una ricerca visiva di immagini con Milvus - Un esempio di caso d'uso<button data-href="#Performing-visual-image-search-with-Milvus--A-use-case-blueprint" class="anchor-icon" translate="no">
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
    </button></h2><p>I database vettoriali open-source come Milvus consentono a qualsiasi azienda di creare il proprio sistema di ricerca di immagini visive con un numero minimo di passaggi. Gli sviluppatori possono utilizzare modelli di intelligenza artificiale pre-addestrati per convertire i propri set di dati di immagini in vettori, e quindi sfruttare Milvus per consentire la ricerca di prodotti simili in base all'immagine. Vediamo di seguito un esempio di come progettare e costruire un sistema di questo tipo.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Workflow_for_Visual_Image_Search_c490906a58.jpeg" alt="figure 9" class="doc-image" id="figure-9" />
   </span> <span class="img-wrapper"> <span>Figura 9</span> </span></p>
<p>In questo flusso di lavoro possiamo utilizzare un framework open-source come <a href="https://github.com/towhee-io/towhee">towhee</a> per sfruttare un modello pre-addestrato come ResNet-50 ed estrarre vettori dalle immagini, memorizzare e indicizzare questi vettori con facilità in Milvus e memorizzare anche una mappatura degli ID delle immagini alle immagini reali in un database MySQL. Una volta che i dati sono indicizzati, possiamo caricare facilmente qualsiasi nuova immagine ed eseguire ricerche su scala utilizzando Milvus. La figura seguente mostra un esempio di ricerca visiva di immagini.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sample_Visual_Search_Example_52c6410dfd.png" alt="figure 10" class="doc-image" id="figure-10" />
   </span> <span class="img-wrapper"> <span>Figura 10</span> </span></p>
<p>Date un'occhiata al <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search/quick_deploy">tutorial</a> dettagliato che è stato reso disponibile su GitHub grazie a Milvus.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusione<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>In questo articolo abbiamo affrontato un bel po' di argomenti. Abbiamo iniziato con le sfide legate alla rappresentazione di dati non strutturati, allo sfruttamento dei vettori e alla ricerca di similarità vettoriale su scala con Milvus, un database vettoriale open source. Abbiamo discusso i dettagli su come Milvus è strutturato e sui componenti chiave che lo alimentano, oltre a una descrizione di come risolvere un problema del mondo reale, la ricerca di immagini visive con Milvus. Provatelo e iniziate a risolvere i vostri problemi reali con <a href="https://milvus.io/">Milvus</a>!</p>
<p>Vi è piaciuto questo articolo? <a href="https://www.linkedin.com/in/dipanzan/">Contattatemi</a> per discuterne ancora o per dare un feedback!</p>
<h2 id="About-the-author" class="common-anchor-header">Informazioni sull'autore<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>Dipanjan (DJ) Sarkar è un Data Science Lead, esperto di Google Developer - Machine Learning, autore, consulente e consulente AI. Contatti: http://bit.ly/djs_linkedin</p>
