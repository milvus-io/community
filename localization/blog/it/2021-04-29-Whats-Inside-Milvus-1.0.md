---
id: Whats-Inside-Milvus-1.0.md
title: Cosa contiene Milvus 1.0?
author: milvus
date: 2021-04-29T08:46:04.019Z
desc: >-
  Milvus v1.0 è ora disponibile. Scoprite i fondamenti di Milvus e le
  caratteristiche principali di Milvus v1.0.
cover: assets.zilliz.com/Milvus_510cf50aee.jpeg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/Whats-Inside-Milvus-1.0'
---
<custom-h1>Cosa c'è dentro Milvus 1.0?</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_510cf50aee.jpeg" alt="Milvus.jpeg" class="doc-image" id="milvus.jpeg" />
   </span> <span class="img-wrapper"> <span>Milvus.jpeg</span> </span></p>
<p>Milvus è un database vettoriale open-source progettato per gestire enormi insiemi di dati vettoriali da milioni, miliardi o addirittura trilioni. Milvus ha ampie applicazioni che spaziano dalla scoperta di nuovi farmaci, alla computer vision, alla guida autonoma, ai motori di raccomandazione, ai chatbot e molto altro ancora.</p>
<p>Nel marzo 2021 Zilliz, l'azienda che sta dietro a Milvus, ha rilasciato la prima versione della piattaforma con supporto a lungo termine: Milvus v1.0. Dopo mesi di test approfonditi, una versione stabile e pronta per la produzione del database vettoriale più famoso al mondo è pronta per il primo giorno. Questo articolo del blog illustra alcuni fondamenti di Milvus e le caratteristiche principali della versione v1.0.</p>
<p><br/></p>
<h3 id="Milvus-distributions" class="common-anchor-header">Distribuzioni di Milvus</h3><p>Milvus è disponibile nelle distribuzioni per sola CPU e per GPU. La prima si affida esclusivamente alla CPU per la creazione di indici e la ricerca; la seconda consente la ricerca ibrida con CPU e GPU e la creazione di indici che accelerano ulteriormente Milvus. Ad esempio, utilizzando la distribuzione ibrida, la CPU può essere utilizzata per la ricerca e la GPU per la creazione dell'indice, migliorando ulteriormente l'efficienza delle query.</p>
<p>Entrambe le distribuzioni di Milvus sono disponibili in Docker. È possibile compilare Milvus da Docker (se il sistema operativo lo supporta) o compilare Milvus dal codice sorgente su Linux (altri sistemi operativi non sono supportati).</p>
<p><br/></p>
<h3 id="Embedding-vectors" class="common-anchor-header">Incorporare i vettori</h3><p>I vettori sono memorizzati in Milvus come entità. Ogni entità ha un campo ID vettore e un campo vettore. Milvus v1.0 supporta solo ID vettoriali interi. Quando si crea una collezione in Milvus, gli ID dei vettori possono essere generati automaticamente o definiti manualmente. Milvus garantisce che gli ID vettoriali generati automaticamente siano unici, tuttavia gli ID definiti manualmente possono essere duplicati all'interno di Milvus. Se si definiscono manualmente gli ID, è responsabilità dell'utente assicurarsi che tutti gli ID siano unici.</p>
<p><br/></p>
<h3 id="Partitions" class="common-anchor-header">Partizioni</h3><p>Milvus supporta la creazione di partizioni in una raccolta. In situazioni in cui i dati vengono inseriti regolarmente e i dati storici non sono significativi (ad esempio, dati in streaming), le partizioni possono essere utilizzate per accelerare la ricerca di similarità vettoriale. Una raccolta può avere fino a 4.096 partizioni. Specificando una ricerca vettoriale all'interno di una specifica partizione, si restringe la ricerca e si può ridurre significativamente il tempo di interrogazione, in particolare per le raccolte che contengono più di un trilione di vettori.</p>
<p><br/></p>
<h3 id="Index-algorithm-optimizations" class="common-anchor-header">Ottimizzazione dell'algoritmo dell'indice</h3><p>Milvus si basa su numerose librerie di indici ampiamente diffuse, tra cui Faiss, NMSLIB e Annoy. Milvus è molto più di un wrapper di base per queste librerie di indici. Ecco alcuni dei principali miglioramenti apportati alle librerie sottostanti:</p>
<ul>
<li>Ottimizzazione delle prestazioni degli indici IVF utilizzando l'algoritmo k-means di Elkan.</li>
<li>Ottimizzazione della ricerca FLAT.</li>
<li>Supporto dell'indice ibrido IVF_SQ8H, che può ridurre le dimensioni dei file di indice fino al 75% senza sacrificare la precisione dei dati. IVF_SQ8H si basa su IVF_SQ8, con un richiamo identico ma una velocità di interrogazione molto maggiore. È stato progettato specificamente per Milvus per sfruttare la capacità di elaborazione parallela delle GPU e il potenziale di sinergia tra la co-processazione CPU/GPU.</li>
<li>Compatibilità dinamica del set di istruzioni.</li>
</ul>
<p><br/></p>
<h3 id="Search-index-building-and-other-Milvus-optimizations" class="common-anchor-header">Ricerca, creazione di indici e altre ottimizzazioni di Milvus</h3><p>Le seguenti ottimizzazioni sono state apportate a Milvus per migliorare le prestazioni di ricerca e creazione di indici.</p>
<ul>
<li>Le prestazioni di ricerca sono ottimizzate quando il numero di query (nq) è inferiore al numero di thread della CPU.</li>
<li>Milvus combina le richieste di ricerca di un client che hanno lo stesso topK e gli stessi parametri di ricerca.</li>
<li>La costruzione dell'indice viene sospesa quando arrivano le richieste di ricerca.</li>
<li>Milvus precarica automaticamente le collezioni in memoria all'avvio.</li>
<li>È possibile assegnare più dispositivi GPU per accelerare la ricerca di similarità vettoriale.</li>
</ul>
<p><br/></p>
<h3 id="Distance-metrics" class="common-anchor-header">Metriche di distanza</h3><p>Milvus è un database vettoriale costruito per alimentare la ricerca di similarità vettoriale. La piattaforma è stata costruita pensando alle applicazioni MLOps e AI di livello produttivo. Milvus supporta un'ampia gamma di metriche di distanza per il calcolo della somiglianza, come la distanza euclidea (L2), il prodotto interno (IP), la distanza di Jaccard, Tanimoto, la distanza di Hamming, la sovrastruttura e la sottostruttura. Le ultime due metriche sono comunemente utilizzate nella ricerca molecolare e nella scoperta di nuovi farmaci da parte dell'intelligenza artificiale.</p>
<p><br/></p>
<h3 id="Logging" class="common-anchor-header">Registrazione</h3><p>Milvus supporta la rotazione dei log. Nel file di configurazione del sistema, milvus.yaml, è possibile impostare la dimensione di un singolo file di log, il numero di file di log e l'output del log su stdout.</p>
<p><br/></p>
<h3 id="Distributed-solution" class="common-anchor-header">Soluzione distribuita</h3><p>Mishards, un middleware di sharding di Milvus, è la soluzione distribuita per Milvus. Con un nodo di scrittura e un numero illimitato di nodi di lettura, Mishards libera il potenziale computazionale del cluster di server. Le sue caratteristiche includono l'inoltro delle richieste, la suddivisione lettura/scrittura, lo scaling dinamico/orizzontale e altro ancora.</p>
<p><br/></p>
<h3 id="Monitoring" class="common-anchor-header">Monitoraggio</h3><p>Milvus è compatibile con Prometheus, un toolkit open-source per il monitoraggio e gli avvisi di sistema. Milvus aggiunge il supporto per Pushgateway in Prometheus, rendendo possibile a Prometheus l'acquisizione di metriche batch di breve durata. Il sistema di monitoraggio e di avvisi funziona come segue:</p>
<ul>
<li>Il server Milvus invia dati metrici personalizzati a Pushgateway.</li>
<li>Pushgateway assicura che i dati metrici effimeri siano inviati in modo sicuro a Prometheus.</li>
<li>Prometheus continua a prelevare i dati da Pushgateway.</li>
<li>Alertmanager è utilizzato per impostare la soglia di allarme per i diversi indicatori e inviare avvisi via e-mail o messaggio.</li>
</ul>
<p><br/></p>
<h3 id="Metadata-management" class="common-anchor-header">Gestione dei metadati</h3><p>Milvus utilizza SQLite per la gestione dei metadati per impostazione predefinita. SQLite è implementato in Milvus e non richiede alcuna configurazione. In un ambiente di produzione, si consiglia di utilizzare MySQL per la gestione dei metadati.</p>
<p><br/></p>
<h3 id="Engage-with-our-open-source-community" class="common-anchor-header">Impegnatevi con la nostra comunità open-source:</h3><ul>
<li>Trovate o contribuite a Milvus su <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Interagite con la comunità tramite <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Collegatevi con noi su <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
