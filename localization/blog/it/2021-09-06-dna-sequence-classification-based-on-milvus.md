---
id: dna-sequence-classification-based-on-milvus.md
title: Classificazione delle sequenze di DNA in base a Milvus
author: Jael Gu
date: 2021-09-06T06:02:27.431Z
desc: >-
  Utilizzate Milvus, un database vettoriale open source, per riconoscere le
  famiglie di geni delle sequenze di DNA. Meno spazio ma maggiore precisione.
cover: assets.zilliz.com/11111_5d089adf08.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/dna-sequence-classification-based-on-milvus'
---
<custom-h1>Classificazione delle sequenze di DNA basata su Milvus</custom-h1><blockquote>
<p>Autore: Mengjia Gu, ingegnere dei dati presso Zilliz, si è laureata presso la McGill University con un master in Scienze dell'informazione. I suoi interessi includono le applicazioni dell'intelligenza artificiale e la ricerca di similarità con i database vettoriali. Come membro della comunità del progetto open-source Milvus, ha fornito e migliorato diverse soluzioni, come il sistema di raccomandazione e il modello di classificazione delle sequenze di DNA. Le piacciono le sfide e non si arrende mai!</p>
</blockquote>
<custom-h1>Introduzione</custom-h1><p>La sequenza del DNA è un concetto popolare sia nella ricerca accademica che nelle applicazioni pratiche, come la tracciabilità dei geni, l'identificazione delle specie e la diagnosi delle malattie. Mentre tutti i settori sono alla ricerca di un metodo di ricerca più intelligente ed efficiente, l'intelligenza artificiale ha attirato molta attenzione, soprattutto nel settore biologico e medico. Sempre più scienziati e ricercatori contribuiscono all'apprendimento automatico e all'apprendimento profondo in bioinformatica. Per rendere i risultati sperimentali più convincenti, un'opzione comune è quella di aumentare la dimensione del campione. La collaborazione con i big data nel campo della genomica offre ulteriori possibilità di utilizzo nella realtà. Tuttavia, l'allineamento tradizionale delle sequenze ha dei limiti che lo rendono <a href="https://www.frontiersin.org/articles/10.3389/fbioe.2020.01032/full#h5">inadatto a dati di grandi dimensioni</a>. Per ridurre il compromesso, la vettorializzazione è una buona scelta per un grande insieme di sequenze di DNA.</p>
<p>Il database vettoriale open source <a href="https://milvus.io/docs/v2.0.x/overview.md">Milvus</a> è adatto a dati massicci. È in grado di memorizzare vettori di sequenze di acidi nucleici e di eseguire un recupero ad alta efficienza. Può anche contribuire a ridurre i costi di produzione o di ricerca. Il sistema di classificazione delle sequenze di DNA basato su Milvus richiede solo millisecondi per la classificazione dei geni. Inoltre, mostra un'accuratezza maggiore rispetto ad altri classificatori comuni nell'apprendimento automatico.</p>
<custom-h1>Elaborazione dei dati</custom-h1><p>Un gene che codifica informazioni genetiche è costituito da una piccola sezione di sequenze di DNA, che consiste di 4 basi nucleotidiche [A, C, G, T]. Nel genoma umano ci sono circa 30.000 geni, quasi 3 miliardi di coppie di basi di DNA, e ogni coppia di basi ha 2 basi corrispondenti. Per supportare diversi usi, le sequenze di DNA possono essere classificate in varie categorie. Per ridurre i costi e facilitare l'uso dei dati di lunghe sequenze di DNA, è stato introdotto il <a href="https://en.wikipedia.org/wiki/K-mer#:~:text=Usually%2C%20the%20term%20k%2Dmer,total%20possible%20k%2Dmers%2C%20where">k-mer </a>nella preelaborazione dei dati. Nel frattempo, rende i dati delle sequenze di DNA più simili al testo normale. Inoltre, i dati vettoriali possono accelerare i calcoli nell'analisi dei dati o nell'apprendimento automatico.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_a7469e9eac.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p><strong>k-mer</strong></p>
<p>Il metodo k-mer è comunemente utilizzato nella preelaborazione delle sequenze di DNA. Estrae una piccola sezione di lunghezza k a partire da ogni base della sequenza originale, convertendo così una sequenza lunga di lunghezza s in (s-k+1) sequenze corte di lunghezza k. Regolando il valore di k si migliorano le prestazioni del modello. Gli elenchi di sequenze brevi sono più semplici per la lettura dei dati, l'estrazione delle caratteristiche e la vettorizzazione.</p>
<p><strong>Vettorizzazione</strong></p>
<p>Le sequenze di DNA vengono vettorizzate sotto forma di testo. Una sequenza trasformata da k-mer diventa un elenco di sequenze brevi, che assomiglia a un elenco di singole parole in una frase. Pertanto, la maggior parte dei modelli di elaborazione del linguaggio naturale dovrebbe funzionare anche per i dati delle sequenze di DNA. Metodologie simili possono essere applicate all'addestramento dei modelli, all'estrazione delle caratteristiche e alla codifica. Poiché ogni modello presenta vantaggi e svantaggi, la scelta dei modelli dipende dalle caratteristiche dei dati e dallo scopo della ricerca. Ad esempio, CountVectorizer, un modello di bag-of-words, implementa l'estrazione di caratteristiche attraverso una semplice tokenizzazione. Non pone limiti alla lunghezza dei dati, ma il risultato restituito è meno evidente in termini di confronto di similarità.</p>
<custom-h1>Dimostrazione di Milvus</custom-h1><p>Milvus è in grado di gestire facilmente dati non strutturati e di richiamare i risultati più simili tra trilioni di vettori con un ritardo medio di millisecondi. La sua ricerca di similarità si basa sull'algoritmo di ricerca Approximate Nearest Neighbor (ANN). Queste caratteristiche rendono Milvus un'ottima opzione per la gestione di vettori di sequenze di DNA, promuovendo così lo sviluppo e le applicazioni della bioinformatica.</p>
<p>Ecco una demo che mostra come costruire un sistema di classificazione di sequenze di DNA con Milvus. Il <a href="https://www.kaggle.com/nageshsingh/dna-sequence-dataset">set di dati sperimentali </a>comprende 3 organismi e 7 famiglie di geni. Tutti i dati sono convertiti in elenchi di sequenze brevi da k-mers. Con un modello CountVectorizer pre-addestrato, il sistema codifica i dati di sequenza in vettori. Il diagramma di flusso sottostante illustra la struttura del sistema e i processi di inserimento e ricerca.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_ebd89660f6.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>Provate questa demo al <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/dna_sequence_classification">bootcamp di Milvus</a>.</p>
<p>In Milvus, il sistema crea una collezione e inserisce i vettori corrispondenti di sequenze di DNA nella collezione (o nella partizione, se abilitata). Quando riceve una richiesta di interrogazione, Milvus restituisce le distanze tra il vettore della sequenza di DNA in ingresso e i risultati più simili presenti nel database. La classe della sequenza in ingresso e la somiglianza tra le sequenze di DNA possono essere determinate dalle distanze tra i vettori nei risultati.</p>
<pre><code translate="no"><span class="hljs-comment"># Insert vectors to Milvus collection (partition &quot;human&quot;)</span>
DNA_human = collection.insert([human_ids, human_vectors], partition_name=<span class="hljs-string">&#x27;human&#x27;</span>)
<span class="hljs-comment"># Search topK results (in partition &quot;human&quot;) for test vectors</span>
res = collection.search(test_vectors, <span class="hljs-string">&quot;vector_field&quot;</span>, search_params, limit=topK, partition_names=[<span class="hljs-string">&#x27;human&#x27;</span>])
<span class="hljs-keyword">for</span> results <span class="hljs-keyword">in</span> res:
    res_ids = results.ids <span class="hljs-comment"># primary keys of topK results</span>
    res_distances = results.distances <span class="hljs-comment"># distances between topK results &amp; search input</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Classificazione delle sequenze di DNA</strong>La ricerca delle sequenze di DNA più simili in Milvus può indicare la famiglia di geni di un campione sconosciuto e quindi conoscere la sua possibile funzionalità.<a href="https://www.nature.com/scitable/topicpage/gpcr-14047471/"> Se una sequenza è classificata come GPCRs, allora probabilmente ha un'influenza sulle funzioni del corpo. </a>In questa dimostrazione, Milvus ha permesso al sistema di identificare con successo le famiglie geniche delle sequenze di DNA umano ricercate.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_1616da5bb0.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_d719b22fc7.png" alt="4.png" class="doc-image" id="4.png" /><span>4.png</span> </span></p>
<p><strong>Somiglianza genetica</strong></p>
<p>La somiglianza media delle sequenze di DNA tra organismi illustra la vicinanza tra i loro genomi. La demo cerca nei dati umani le sequenze di DNA più simili a quelle dello scimpanzé e del cane. Quindi calcola e confronta le distanze medie del prodotto interno (0,97 per lo scimpanzé e 0,70 per il cane), dimostrando che lo scimpanzé condivide con l'uomo più geni simili di quelli del cane. Con una maggiore complessità dei dati e della progettazione del sistema, Milvus è in grado di supportare la ricerca genetica anche a un livello superiore.</p>
<pre><code translate="no">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">20</span>}}
<button class="copy-code-btn"></button></code></pre>
<p><strong>Prestazioni</strong></p>
<p>La demo addestra il modello di classificazione con l'80% di dati di campioni umani (3629 in totale) e utilizza i restanti come dati di prova. Il modello di classificazione delle sequenze di DNA che utilizza Milvus viene confrontato con quello basato su Mysql e con 5 popolari classificatori di apprendimento automatico. Il modello basato su Milvus supera le sue controparti in termini di accuratezza.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sklearn.<span class="hljs-property">model_selection</span> <span class="hljs-keyword">import</span> train_test_split
X, y = human_sequence_kmers, human_labels
X_train, X_test, y_train, y_test = <span class="hljs-title function_">train_test_split</span>(X, y, test_size=<span class="hljs-number">0.2</span>, random_state=<span class="hljs-number">42</span>)
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_6541a7dec6.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<custom-h1>Ulteriori esplorazioni</custom-h1><p>Con lo sviluppo della tecnologia dei big data, la vettorizzazione della sequenza di DNA svolgerà un ruolo sempre più importante nella ricerca e nella pratica genetica. In combinazione con le conoscenze professionali in bioinformatica, gli studi correlati possono trarre ulteriori vantaggi dal coinvolgimento della vettorizzazione delle sequenze di DNA. Pertanto, Milvus può presentare risultati migliori nella pratica. In base ai diversi scenari e alle esigenze degli utenti, la ricerca di similarità e il calcolo della distanza alimentati da Milvus mostrano un grande potenziale e molte possibilità.</p>
<ul>
<li><strong>Studio di sequenze sconosciute</strong>: <a href="https://iopscience.iop.org/article/10.1088/1742-6596/1453/1/012071/pdf">Secondo alcuni ricercatori, la vettorizzazione può comprimere i dati delle sequenze di DNA.</a> Allo stesso tempo, richiede uno sforzo minore per studiare la struttura, la funzione e l'evoluzione di sequenze di DNA sconosciute. Milvus può memorizzare e recuperare un numero enorme di vettori di sequenze di DNA senza perdere in precisione.</li>
<li><strong>Adattare i dispositivi</strong>: Limitata dai tradizionali algoritmi di allineamento delle sequenze, la ricerca di similarità può a malapena beneficiare del miglioramento dei dispositivi<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7884812/">(</a><a href="https://mjeer.journals.ekb.eg/article_146090.html">CPU/GPU</a>). Milvus, che supporta sia il normale calcolo della CPU che l'accelerazione della GPU, risolve questo problema con l'algoritmo di nearest neighbor approssimato.</li>
<li><strong>Rilevamento di virus e tracciamento delle origini</strong>: <a href="https://www.nature.com/articles/s41586-020-2012-7?fbclid=IwAR2hxnXb9nLWgA8xexEoNrCNH8WHqvHhhbN38aSm48AaH6fTzGMB1BLljf4">Gli scienziati hanno confrontato le sequenze del genoma e hanno riferito che il virus COVID19, di probabile origine pipistrello, appartiene alla SARS-COV</a>. Sulla base di questa conclusione, i ricercatori possono ampliare la dimensione del campione per ottenere ulteriori prove e modelli.</li>
<li><strong>Diagnosticare le malattie</strong>: Dal punto di vista clinico, i medici potrebbero confrontare le sequenze di DNA tra pazienti e gruppi sani per identificare le varianti dei geni che causano le malattie. È possibile estrarre le caratteristiche e codificare questi dati utilizzando algoritmi adeguati. Milvus è in grado di restituire le distanze tra i vettori, che possono essere correlate ai dati delle malattie. Oltre ad aiutare la diagnosi delle malattie, questa applicazione può anche contribuire a ispirare lo studio di <a href="https://www.frontiersin.org/articles/10.3389/fgene.2021.680117/full">terapie mirate</a>.</li>
</ul>
<custom-h1>Per saperne di più su Milvus</custom-h1><p>Milvus è un potente strumento in grado di alimentare una vasta gamma di applicazioni di intelligenza artificiale e di ricerca di similarità vettoriale. Per saperne di più sul progetto, consultate le seguenti risorse:</p>
<ul>
<li>Leggete il nostro <a href="https://milvus.io/blog">blog</a>.</li>
<li>Interagire con la nostra comunità open-source su <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/shared-invite/email">Slack</a>.</li>
<li>Utilizzate o contribuite al database vettoriale più diffuso al mondo su <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Testate e distribuite rapidamente le applicazioni AI con il nostro nuovo <a href="https://github.com/milvus-io/bootcamp">bootcamp</a>.</li>
</ul>
