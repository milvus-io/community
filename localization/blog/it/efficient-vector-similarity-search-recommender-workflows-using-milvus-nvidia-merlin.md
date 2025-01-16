---
id: >-
  efficient-vector-similarity-search-recommender-workflows-using-milvus-nvidia-merlin.md
title: >-
  Ricerca efficiente della similarità vettoriale nei flussi di lavoro di
  raccomandazione utilizzando Milvus con NVIDIA Merlin
author: Burcin Bozkaya
date: 2023-12-15T00:00:00.000Z
desc: >-
  Un'introduzione all'integrazione di NVIDIA Merlin e Milvus nella creazione di
  sistemi di raccomandazione e nel benchmarking delle sue prestazioni in vari
  scenari.
cover: assets.zilliz.com/nvidia_4921837ca6.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, NVIDIA, Merlin
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/efficient-vector-similarity-search-recommender-workflows-using-milvus-nvidia-merlin
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/nvidia_4921837ca6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Questo post è stato pubblicato per la prima volta sul <a href="https://medium.com/nvidia-merlin/efficient-vector-similarity-search-in-recommender-workflows-using-milvus-with-nvidia-merlin-84d568290ee4">canale Medium di NVIDIA Merlin</a> e modificato e ripubblicato qui con l'autorizzazione. È stato scritto congiuntamente da <a href="https://medium.com/u/743df9db1666?source=post_page-----84d568290ee4--------------------------------">Burcin Bozkaya</a> e <a href="https://medium.com/u/279d4c25a145?source=post_page-----84d568290ee4--------------------------------">William Hicks</a> di NVIDIA e da <a href="https://medium.com/u/3e8a3c67a8a5?source=post_page-----84d568290ee4--------------------------------">Filip Haltmayer</a> e <a href="https://github.com/liliu-z">Li Liu</a> di Zilliz.</em></p>
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
    </button></h2><p>I moderni sistemi di raccomandazione (Recsys) consistono in pipeline di addestramento/inferenza che coinvolgono più fasi di ingestione dei dati, preelaborazione dei dati, addestramento del modello e messa a punto degli iperparametri per il recupero, il filtraggio, la classificazione e l'assegnazione di punteggi agli elementi rilevanti. Una componente essenziale di una pipeline di sistemi di raccomandazione è il recupero o la scoperta degli elementi più rilevanti per un utente, in particolare in presenza di grandi cataloghi di articoli. Questa fase comporta in genere una ricerca <a href="https://zilliz.com/glossary/anns">approssimata dei vicini (ANN)</a> su un database indicizzato di rappresentazioni vettoriali a bassa dimensione (cioè embeddings) di attributi di prodotti e utenti creati da modelli di deep learning che si allenano sulle interazioni tra utenti e prodotti/servizi.</p>
<p><a href="https://github.com/NVIDIA-Merlin">NVIDIA Merlin</a>, un framework open-source sviluppato per l'addestramento di modelli end-to-end per la formulazione di raccomandazioni su qualsiasi scala, si integra con un efficiente framework di indicizzazione e ricerca di <a href="https://zilliz.com/learn/what-is-vector-database">database vettoriali</a>. Uno di questi framework che ha guadagnato molta attenzione di recente è <a href="https://zilliz.com/what-is-milvus">Milvus</a>, un database vettoriale open-source creato da <a href="https://zilliz.com/">Zilliz</a>. Offre capacità di indicizzazione e di interrogazione veloci. Milvus ha recentemente aggiunto il <a href="https://zilliz.com/blog/getting-started-with-gpu-powered-milvus-unlocking-10x-higher-performance">supporto per l'accelerazione via GPU</a> che utilizza le GPU NVIDIA per sostenere i flussi di lavoro AI. Il supporto dell'accelerazione GPU è un'ottima notizia perché una libreria di ricerca vettoriale accelerata rende possibili query concomitanti veloci, con un impatto positivo sui requisiti di latenza degli attuali sistemi di raccomandazione, dove gli sviluppatori si aspettano molte richieste concomitanti. Milvus ha oltre 5 milioni di docker pull, circa 23.000 stelle su GitHub (a settembre 2023), oltre 5.000 clienti aziendali ed è un componente fondamentale di molte applicazioni (vedere i <a href="https://medium.com/vector-database/tagged/use-cases-of-milvus">casi</a> d'uso).</p>
<p>Questo blog mostra come Milvus lavora con il framework Merlin Recsys al momento della formazione e dell'inferenza. Mostriamo come Milvus integri Merlin nella fase di recupero degli elementi con una ricerca top-k altamente efficiente e come possa essere utilizzato con NVIDIA Triton Inference Server (TIS) nel momento dell'inferenza (vedi Figura 1). <strong>I risultati dei nostri benchmark mostrano un'impressionante accelerazione da 37 a 91 volte con Milvus accelerato da GPU che utilizza NVIDIA RAFT con le incorporazioni vettoriali generate da Merlin Models.</strong> Il codice utilizzato per mostrare l'integrazione Merlin-Milvus e i risultati dettagliati dei benchmark, insieme alla <a href="https://github.com/zilliztech/VectorDBBench">libreria</a> che ha facilitato il nostro studio sui benchmark, sono disponibili qui.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Multistage_recommender_system_with_Milvus_ee891c4ad5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 1. Sistema di raccomandazione multistadio con il framework Milvus che contribuisce alla fase di recupero. Fonte della figura originale a più fasi: questo <a href="https://medium.com/nvidia-merlin/recommender-systems-not-just-recommender-models-485c161c755e">post del blog</a>.</em></p>
<h2 id="The-challenges-facing-recommenders" class="common-anchor-header">Le sfide che i raccomandatori devono affrontare<button data-href="#The-challenges-facing-recommenders" class="anchor-icon" translate="no">
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
    </button></h2><p>Data la natura multistadio dei sistemi di raccomandazione e la disponibilità di vari componenti e librerie da essi integrati, una sfida significativa è l'integrazione di tutti i componenti senza soluzione di continuità in una pipeline end-to-end. Nei nostri notebook di esempio intendiamo dimostrare che l'integrazione può essere fatta con uno sforzo minore.</p>
<p>Un'altra sfida dei flussi di lavoro di raccomandazione è l'accelerazione di alcune parti della pipeline. Sebbene siano note per l'enorme ruolo svolto nell'addestramento di reti neurali di grandi dimensioni, le GPU sono state aggiunte solo di recente ai database vettoriali e alla ricerca di RNA. Con l'aumento delle dimensioni degli inventari dei prodotti di e-commerce o dei database dei media in streaming e il numero di utenti che utilizzano questi servizi, le CPU devono fornire le prestazioni necessarie per servire milioni di utenti in flussi di lavoro Recsys performanti. L'accelerazione via GPU in altre parti della pipeline è diventata necessaria per affrontare questa sfida. La soluzione presentata in questo blog affronta questa sfida dimostrando che la ricerca ANN è efficiente quando si utilizzano le GPU.</p>
<h2 id="Tech-stacks-for-the-solution" class="common-anchor-header">Stack tecnici per la soluzione<button data-href="#Tech-stacks-for-the-solution" class="anchor-icon" translate="no">
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
    </button></h2><p>Cominciamo con il rivedere alcuni dei fondamenti necessari per condurre il nostro lavoro.</p>
<ul>
<li><p>NVIDIA <a href="https://github.com/NVIDIA-Merlin/Merlin">Merlin</a>: una libreria open-source con API di alto livello che accelera i raccomandatori su GPU NVIDIA.</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/NVTabular">NVTabular</a>: per la preelaborazione dei dati tabellari in ingresso e l'ingegnerizzazione delle caratteristiche.</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/models">Merlin Models</a>: per l'addestramento di modelli di deep learning e per l'apprendimento, in questo caso, di vettori di incorporamento di utenti e articoli dai dati di interazione degli utenti.</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/systems">Merlin Systems</a>: per combinare un modello di raccomandazione basato su TensorFlow con altri elementi (ad esempio, feature store, ricerca ANN con Milvus) da servire con TIS.</p></li>
<li><p><a href="https://github.com/triton-inference-server/server">Triton Inference Server</a>: per la fase di inferenza in cui viene passato un vettore di caratteristiche dell'utente e vengono generate raccomandazioni di prodotti.</p></li>
<li><p>Containerizzazione: tutto quanto sopra è disponibile tramite i container che NVIDIA fornisce nel <a href="https://catalog.ngc.nvidia.com/">catalogo NGC</a>. Abbiamo utilizzato il contenitore Merlin TensorFlow 23.06 disponibile <a href="https://catalog.ngc.nvidia.com/orgs/nvidia/teams/merlin/containers/merlin-tensorflow">qui</a>.</p></li>
<li><p><a href="https://github.com/milvus-io/milvus/releases/tag/v2.3.0">Milvus 2.3</a>: per l'indicizzazione e l'interrogazione di vettori accelerati dalle GPU.</p></li>
<li><p><a href="https://github.com/milvus-io/milvus/releases">Milvus 2.2.11</a>: come sopra, ma per eseguire le operazioni su CPU.</p></li>
<li><p><a href="https://zilliz.com/product/integrations/python">Pymilvus SDK</a>: per connettersi al server Milvus, creare indici di database vettoriali ed eseguire query tramite un'interfaccia Python.</p></li>
<li><p><a href="https://github.com/feast-dev/feast">Feast</a>: per salvare e recuperare gli attributi di utenti e oggetti in un archivio di caratteristiche (open source) come parte della nostra pipeline RecSys end-to-end.</p></li>
</ul>
<p>Sotto il cofano vengono utilizzate anche diverse librerie e framework sottostanti. Ad esempio, Merlin si basa su altre librerie NVIDIA, come cuDF e Dask, entrambe disponibili sotto <a href="https://github.com/rapidsai/cudf">RAPIDS cuDF</a>. Allo stesso modo, Milvus si affida a <a href="https://github.com/rapidsai/raft">NVIDIA RAFT</a> per le primitive sull'accelerazione delle GPU e a librerie modificate come <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a> e <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a> per la ricerca.</p>
<h2 id="Understanding-vector-databases-and-Milvus" class="common-anchor-header">Comprensione dei database vettoriali e di Milvus<button data-href="#Understanding-vector-databases-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>L<a href="https://zilliz.com/glossary/anns">'approssimazione dei vicini (ANN)</a> è una funzionalità che i database relazionali non possono gestire. I database relazionali sono progettati per gestire dati tabellari con strutture predefinite e valori direttamente confrontabili. Gli indici dei database relazionali si basano su questo per confrontare i dati e creare strutture che sfruttano il vantaggio di sapere se ogni valore è minore o maggiore dell'altro. I vettori embedding non possono essere confrontati direttamente tra loro in questo modo, poiché è necessario sapere cosa rappresenta ogni valore del vettore. Non si può dire se un vettore è necessariamente minore dell'altro. L'unica cosa che possiamo fare è calcolare la distanza tra i due vettori. Se la distanza tra due vettori è piccola, possiamo supporre che le caratteristiche che rappresentano siano simili, mentre se è grande, possiamo supporre che i dati che rappresentano siano più diversi. Tuttavia, questi indici efficienti hanno un costo: calcolare la distanza tra due vettori è computazionalmente costoso e gli indici vettoriali non sono facilmente adattabili e talvolta non modificabili. A causa di queste due limitazioni, l'integrazione di questi indici è più complessa nei database relazionali, motivo per cui sono necessari <a href="https://zilliz.com/blog/what-is-a-real-vector-database">database vettoriali costruiti ad hoc</a>.</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvus</a> è stato creato per risolvere i problemi che i database relazionali incontrano con i vettori ed è stato progettato da zero per gestire questi vettori incorporati e i loro indici su larga scala. Per soddisfare il badge cloud-native, Milvus separa l'elaborazione e l'archiviazione da diverse attività di calcolo: interrogazione, gestione dei dati e indicizzazione. Gli utenti possono scalare ogni parte del database per gestire altri casi d'uso, sia che si tratti di un'attività di inserimento dati che di ricerca. Se c'è un grande afflusso di richieste di inserimento, l'utente può scalare temporaneamente i nodi di indice in senso orizzontale e verticale per gestire l'ingestione. Allo stesso modo, se non vengono inseriti dati, ma ci sono molte ricerche, l'utente può ridurre i nodi indice e scalare i nodi di interrogazione per ottenere un maggiore throughput. Questo progetto di sistema (vedi Figura 2) ci ha imposto di pensare in un'ottica di calcolo parallelo, dando vita a un sistema ottimizzato per il calcolo con molte porte aperte per ulteriori ottimizzazioni.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_system_design_bb3a44c9cc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 2. Progettazione del sistema Milvus</em></p>
<p>Milvus utilizza anche molte librerie di indicizzazione all'avanguardia per offrire agli utenti la massima personalizzazione possibile del loro sistema. Le migliora aggiungendo la capacità di gestire operazioni CRUD, dati in streaming e filtraggio. In seguito, discuteremo le differenze tra questi indici e i pro e i contro di ciascuno.</p>
<h2 id="Example-solution-integration-of-Milvus-and-Merlin" class="common-anchor-header">Soluzione di esempio: integrazione di Milvus e Merlin<button data-href="#Example-solution-integration-of-Milvus-and-Merlin" class="anchor-icon" translate="no">
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
    </button></h2><p>La soluzione di esempio che presentiamo qui dimostra l'integrazione di Milvus con Merlin nella fase di recupero degli elementi (quando i k elementi più rilevanti vengono recuperati attraverso una ricerca ANN). Utilizziamo un set di dati reali provenienti da una <a href="https://www.kaggle.com/datasets/chadgostopp/recsys-challenge-2015">sfida RecSys</a>, descritta di seguito. Addestriamo un modello di apprendimento profondo a due torri che apprende le incorporazioni vettoriali per gli utenti e gli articoli. Questa sezione fornisce anche lo schema del nostro lavoro di benchmarking, comprese le metriche che raccogliamo e la gamma di parametri che utilizziamo.</p>
<p>Il nostro approccio prevede:</p>
<ul>
<li><p>Ingestione e pre-elaborazione dei dati</p></li>
<li><p>Formazione del modello di apprendimento profondo a due torri</p></li>
<li><p>Costruzione dell'indice Milvus</p></li>
<li><p>Ricerca di similarità Milvus</p></li>
</ul>
<p>Descriviamo brevemente ogni fase e rimandiamo il lettore ai nostri <a href="https://github.com/bbozkaya/merlin-milvus/tree/main/notebooks">notebook</a> per i dettagli.</p>
<h3 id="Dataset" class="common-anchor-header">Set di dati</h3><p>YOOCHOOSE GmbH ha fornito il dataset che utilizziamo in questo studio di integrazione e benchmark per la <a href="https://www.kaggle.com/datasets/chadgostopp/recsys-challenge-2015">sfida RecSys 2015</a> ed è disponibile su Kaggle. Contiene gli eventi di clic/acquisto degli utenti di un rivenditore online europeo con attributi quali l'ID della sessione, il timestamp, l'ID dell'articolo associato al clic/acquisto e la categoria dell'articolo, disponibili nel file yoochoose-clicks.dat. Le sessioni sono indipendenti e non c'è traccia di utenti che ritornano, quindi trattiamo ogni sessione come appartenente a un utente distinto. Il dataset ha 9.249.729 sessioni uniche (utenti) e 52.739 articoli unici.</p>
<h3 id="Data-ingestion-and-preprocessing" class="common-anchor-header">Ingestione e preelaborazione dei dati</h3><p>Lo strumento utilizzato per la preelaborazione dei dati è <a href="https://github.com/NVIDIA-Merlin/NVTabular">NVTabular</a>, un componente di Merlin per l'ingegnerizzazione e la preelaborazione delle caratteristiche, accelerato da GPU e altamente scalabile. Usiamo NVTabular per leggere i dati nella memoria della GPU, riorganizzare le caratteristiche come necessario, esportare in file parquet e creare una divisione treno-validazione per l'addestramento. Si ottengono così 7.305.761 utenti unici e 49.008 oggetti unici su cui allenarsi. Inoltre, abbiamo categorizzato ogni colonna e i suoi valori in valori interi. Il set di dati è ora pronto per l'addestramento con il modello a due torri.</p>
<h3 id="Model-training" class="common-anchor-header">Formazione del modello</h3><p>Utilizziamo il modello di deep learning <a href="https://github.com/NVIDIA-Merlin/models/blob/main/examples/05-Retrieval-Model.ipynb">Two-Tower</a> per addestrare e generare embeddings di utenti e articoli, utilizzati poi per l'indicizzazione vettoriale e l'interrogazione. Dopo l'addestramento del modello, possiamo estrarre gli embeddings degli utenti e degli elementi appresi.</p>
<p>Le due fasi successive sono opzionali: un modello <a href="https://arxiv.org/abs/1906.00091">DLRM</a> addestrato per classificare gli elementi recuperati per la raccomandazione e un archivio di caratteristiche utilizzato (in questo caso, <a href="https://github.com/feast-dev/feast">Feast</a>) per memorizzare e recuperare le caratteristiche degli utenti e degli elementi. Li includiamo per la completezza del flusso di lavoro in più fasi.</p>
<p>Infine, esportiamo le incorporazioni degli utenti e degli elementi in file di parquet, che possono essere successivamente ricaricati per creare un indice vettoriale Milvus.</p>
<h3 id="Building-and-querying-the-Milvus-index" class="common-anchor-header">Creazione e interrogazione dell'indice Milvus</h3><p>Milvus facilita l'indicizzazione vettoriale e la ricerca di similarità attraverso un "server" lanciato sulla macchina di inferenza. Nel nostro quaderno n. 2, lo configuriamo installando con pip il server Milvus e Pymilvus, quindi avviando il server con la sua porta di ascolto predefinita. Successivamente, dimostriamo la costruzione di un semplice indice (IVF_FLAT) e l'esecuzione di query su di esso utilizzando le funzioni <code translate="no">setup_milvus</code> e <code translate="no">query_milvus</code>, rispettivamente.</p>
<h2 id="Benchmarking" class="common-anchor-header">Benchmarking<button data-href="#Benchmarking" class="anchor-icon" translate="no">
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
    </button></h2><p>Abbiamo progettato due benchmark per dimostrare l'opportunità di utilizzare una libreria di indicizzazione/ricerca vettoriale veloce ed efficiente come Milvus.</p>
<ol>
<li><p>Utilizzando Milvus per costruire indici vettoriali con i due set di incorporazioni che abbiamo generato: 1) embeddings di utenti per 7,3 milioni di utenti unici, suddivisi in un 85% di train set (per l'indicizzazione) e un 15% di test set (per l'interrogazione), e 2) embeddings di articoli per 49.000 prodotti (con una suddivisione train-test 50-50). Questo benchmark viene eseguito indipendentemente per ciascun set di dati vettoriali e i risultati vengono riportati separatamente.</p></li>
<li><p>Utilizzando Milvus per costruire un indice vettoriale per il set di dati di 49K item embeddings e interrogando i 7,3M utenti unici su questo indice per la ricerca di similarità.</p></li>
</ol>
<p>In questi benchmark abbiamo utilizzato gli algoritmi di indicizzazione IVFPQ e HNSW eseguiti su GPU e CPU, con varie combinazioni di parametri. I dettagli sono disponibili <a href="https://github.com/bbozkaya/merlin-milvus/tree/main/results">qui</a>.</p>
<p>Il compromesso tra qualità e produttività della ricerca è un aspetto importante per le prestazioni, soprattutto in un ambiente di produzione. Milvus permette di controllare completamente i parametri di indicizzazione per esplorare questo compromesso per un determinato caso d'uso e ottenere risultati di ricerca migliori con la verità di base. Ciò può comportare un aumento del costo computazionale sotto forma di riduzione del tasso di throughput o delle query al secondo (QPS). Misuriamo la qualità della ricerca ANN con una metrica di richiamo e forniamo curve QPS-recall che dimostrano il compromesso. Si può quindi decidere un livello accettabile di qualità della ricerca in base alle risorse di calcolo o ai requisiti di latenza/throughput del caso aziendale.</p>
<p>Si noti anche la dimensione del batch di query (nq) utilizzata nei nostri benchmark. Questo è utile nei flussi di lavoro in cui più richieste simultanee vengono inviate all'inferenza (ad esempio, raccomandazioni offline richieste e inviate a un elenco di destinatari di e-mail o raccomandazioni online create raggruppando le richieste simultanee in arrivo ed elaborandole tutte in una volta). A seconda del caso d'uso, TIS può anche aiutare a elaborare queste richieste in batch.</p>
<h3 id="Results" class="common-anchor-header">I risultati</h3><p>Riportiamo ora i risultati delle tre serie di benchmark su CPU e GPU, utilizzando i tipi di indice HNSW (solo CPU) e IVF_PQ (CPU e GPU) implementati da Milvus.</p>
<h4 id="Items-vs-Items-vector-similarity-search" class="common-anchor-header">Ricerca di similarità vettoriale Items vs Items</h4><p>Con questo set di dati di dimensioni ridotte, ogni esecuzione per una determinata combinazione di parametri prende il 50% dei vettori item come vettori di interrogazione e interroga i primi 100 vettori simili dal resto. HNSW e IVF_PQ producono un richiamo elevato con le impostazioni dei parametri testati, rispettivamente nell'intervallo 0,958-1,0 e 0,665-0,997. Questo risultato suggerisce che HNSW ha prestazioni migliori per quanto riguarda il richiamo, ma IVF_PQ con impostazioni di nlist piccole produce un richiamo altamente comparabile. Occorre inoltre notare che i valori di richiamo possono variare notevolmente a seconda dei parametri di indicizzazione e interrogazione. I valori che riportiamo sono stati ottenuti dopo una sperimentazione preliminare con intervalli di parametri generali e un ulteriore zoom su un sottoinsieme selezionato.</p>
<p>Il tempo totale di esecuzione di tutte le query su CPU con HNSW per una data combinazione di parametri varia tra 5,22 e 5,33 sec.s (più veloce quando m diventa più grande, relativamente invariato con ef) e con IVF_PQ tra 13,67 e 14,67 sec.s (più lento quando nlist e nprobe diventano più grandi). L'accelerazione della GPU ha un effetto notevole, come si può vedere nella Figura 3.</p>
<p>La Figura 3 mostra il compromesso richiamo-throughput su tutte le esecuzioni completate su CPU e GPU con questo piccolo set di dati utilizzando IVF_PQ. Abbiamo riscontrato che la GPU fornisce un incremento di velocità compreso tra 4 e 15 volte in tutte le combinazioni di parametri testate (incremento di velocità maggiore con l'aumentare di nprobe). Questo risultato è calcolato considerando il rapporto tra i QPS ottenuti dalla GPU e quelli ottenuti dalla CPU per ogni combinazione di parametri. Nel complesso, questo set rappresenta una sfida minima per la CPU o la GPU e mostra prospettive di ulteriore accelerazione con i set di dati più grandi, come discusso di seguito.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_item_item_d32de8443d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 3. Accelerazione su GPU con l'algoritmo Milvus IVF_PQ in esecuzione su GPU NVIDIA A100 (ricerca di similarità item-item)</em></p>
<h4 id="Users-vs-Users-vector-similarity-search" class="common-anchor-header">Utenti vs. Utenti ricerca di similarità vettoriale</h4><p>Con il secondo set di dati molto più grande (7,3 milioni di utenti), abbiamo messo da parte l'85% (~6,2 milioni) dei vettori come "addestramento" (l'insieme dei vettori da indicizzare) e il restante 15% (~1,1 milioni) come "test" o set di vettori di query. HNSW e IVF_PQ si comportano eccezionalmente bene in questo caso, con valori di richiamo rispettivamente di 0,884-1,0 e 0,922-0,999. Tuttavia, sono molto più impegnativi dal punto di vista computazionale, soprattutto con IVF_PQ sulla CPU. Il tempo totale di esecuzione di tutte le query sulla CPU con HNSW varia da 279,89 a 295,56 sec.s e con IVF_PQ da 3082,67 a 10932,33 sec.s. Si noti che questi tempi di interrogazione sono cumulativi per 1,1 milioni di vettori interrogati, per cui si può dire che una singola query contro l'indice è ancora molto veloce.</p>
<p>Tuttavia, l'interrogazione basata sulla CPU potrebbe non essere praticabile se il server di inferenza prevede molte migliaia di richieste simultanee per eseguire interrogazioni su un inventario di milioni di elementi.</p>
<p>La GPU A100 offre un'incredibile velocità da 37 a 91 volte (con una media di 76,1 volte) su tutte le combinazioni di parametri con IVF_PQ in termini di throughput (QPS), come mostrato nella Figura 4. Questo è coerente con quanto osservato con IVF_PQ. Questo dato è coerente con quanto osservato con il piccolo set di dati, il che suggerisce che le prestazioni della GPU si adattano ragionevolmente bene all'uso di Milvus con milioni di vettori di incorporamento.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_algorithm_user_user_c91f4e4164.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 4. Accelerazione della GPU con l'algoritmo Milvus IVF_PQ in esecuzione su GPU NVIDIA A100 (ricerca di similarità utente-utente)</em></p>
<p>La seguente figura 5 mostra il compromesso recall-QPS per tutte le combinazioni di parametri testate su CPU e GPU con IVF_PQ. Ciascuna serie di punti (in alto per la GPU, in basso per la CPU) di questo grafico illustra il compromesso affrontato quando si modificano i parametri di indicizzazione/query vettoriale per ottenere un richiamo più elevato a scapito di un throughput inferiore. Si noti la notevole perdita di QPS nel caso della GPU quando si cerca di ottenere livelli di richiamo più elevati.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Recall_Throughput_tradeoff_519b2289e5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 5. Tradeoff tra richiamo e throughput per tutte le combinazioni di parametri testate su CPU e GPU con IVF_PQ (utenti vs. utenti)</em></p>
<h4 id="Users-vs-Items-vector-similarity-search" class="common-anchor-header">Utenti vs. Items ricerca di similarità vettoriale</h4><p>Infine, consideriamo un altro caso d'uso realistico in cui i vettori degli utenti vengono interrogati rispetto ai vettori degli articoli (come dimostrato nel precedente Quaderno 01). In questo caso, vengono indicizzati 49K vettori di elementi e 7,3M vettori di utenti vengono interrogati per i primi 100 elementi più simili.</p>
<p>Questo è il punto in cui le cose si fanno interessanti, perché l'interrogazione di 7,3M in lotti di 1000 rispetto a un indice di 49K elementi sembra richiedere molto tempo alla CPU sia per HNSW che per IVF_PQ. La GPU sembra gestire meglio questo caso (vedere la Figura 6). I livelli di accuratezza più elevati ottenuti da IVF_PQ su CPU quando nlist = 100 sono calcolati in media in circa 86 minuti, ma variano significativamente all'aumentare del valore di nprobe (51 min. quando nprobe = 5 vs. 128 min. quando nprobe = 20). La GPU NVIDIA A100 accelera notevolmente le prestazioni con un fattore da 4x a 17x (accelerazioni maggiori con l'aumentare di nprobe). Ricordiamo che l'algoritmo IVF_PQ, grazie alla sua tecnica di quantizzazione, riduce anche l'ingombro della memoria e fornisce una soluzione di ricerca ANN computazionalmente valida combinata con l'accelerazione della GPU.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_algorithm_user_item_504462fcc0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 6. Accelerazione della GPU con l'algoritmo Milvus IVF_PQ in esecuzione su GPU NVIDIA A100 (ricerca di similarità utente-voce)</em></p>
<p>Analogamente alla Figura 5, il compromesso richiamo-throughput è mostrato nella Figura 7 per tutte le combinazioni di parametri testate con IVF_PQ. In questo caso, si può ancora notare come sia necessario rinunciare a una certa accuratezza nella ricerca di RNA a favore di un maggiore throughput, anche se le differenze sono molto meno evidenti, soprattutto nel caso delle esecuzioni su GPU. Ciò suggerisce che con la GPU ci si può aspettare livelli di prestazioni computazionali relativamente elevati, pur ottenendo un richiamo elevato.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Recall_Throughput_tradeoff_user_items_0abce91c5e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figura 7. Rapporto tra richiamo e throughput per tutte le combinazioni di parametri testate su CPU e GPU con IVF_PQ (utenti vs. oggetti).</em></p>
<h2 id="Conclusion" class="common-anchor-header">Conclusioni<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Se siete arrivati fin qui, saremmo lieti di condividere alcune osservazioni conclusive. Vogliamo ricordarvi che la complessità e la natura multi-stadio del moderno Recsys richiedono prestazioni ed efficienza in ogni fase. Ci auguriamo che questo blog vi abbia fornito validi motivi per prendere in considerazione l'utilizzo di due funzionalità fondamentali nelle vostre pipeline RecSys:</p>
<ul>
<li><p>La libreria Merlin Systems di NVIDIA Merlin permette di integrare facilmente <a href="https://github.com/milvus-io/milvus/tree/2.3.0">Milvus</a>, un efficiente motore di ricerca vettoriale accelerato dalle GPU.</p></li>
<li><p>Usate le GPU per accelerare i calcoli per l'indicizzazione dei database vettoriali e la ricerca di RNA con tecnologie come <a href="https://github.com/rapidsai/raft">RAPIDS RAFT</a>.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/summary_benchmark_results_ae33fbe514.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Questi risultati suggeriscono che l'integrazione Merlin-Milvus presentata è altamente performante e molto meno complessa di altre opzioni per l'addestramento e l'inferenza. Inoltre, entrambi i framework sono attivamente sviluppati e molte nuove funzionalità (ad esempio, i nuovi indici di database vettoriali accelerati da GPU di Milvus) vengono aggiunte in ogni release. Il fatto che la ricerca di similarità vettoriale sia una componente cruciale in diversi flussi di lavoro, come la computer vision, la modellazione di grandi lingue e i sistemi di raccomandazione, rende questo sforzo ancora più utile.</p>
<p>Per concludere, vorremmo ringraziare tutti coloro che da Zilliz/Milvus e Merlin e dai team di RAFT hanno contribuito allo sforzo di produrre questo lavoro e il post sul blog. Saremo lieti di ascoltarvi se avrete la possibilità di implementare Merlin e Milvus nei vostri recsys o in altri flussi di lavoro.</p>
