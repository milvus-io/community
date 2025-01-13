---
id: Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing.md
title: >-
  Accelerazione della ricerca di similarità su dati veramente grandi con
  l'indicizzazione vettoriale
author: milvus
date: 2019-12-05T08:33:04.230Z
desc: >-
  Senza l'indicizzazione vettoriale, molte applicazioni moderne di IA sarebbero
  incredibilmente lente. Scoprite come selezionare l'indice giusto per la vostra
  prossima applicazione di apprendimento automatico.
cover: assets.zilliz.com/4_1143e443aa.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing
---
<custom-h1>Accelerazione della ricerca per similarità su dati veramente grandi con l'indicizzazione vettoriale</custom-h1><p>Dalla computer vision alla scoperta di nuovi farmaci, i motori di ricerca per similarità vettoriale sono alla base di molte applicazioni di intelligenza artificiale (AI) molto diffuse. Una componente importante di ciò che rende possibile interrogare in modo efficiente i dataset di milioni, miliardi o addirittura trilioni di vettori su cui si basano i motori di ricerca per similarità è l'indicizzazione, un processo di organizzazione dei dati che accelera drasticamente la ricerca sui big data. Questo articolo illustra il ruolo dell'indicizzazione nel rendere efficiente la ricerca per similarità vettoriale, i diversi tipi di indici di file invertiti vettoriali (IVF) e i consigli su quale indice utilizzare in diversi scenari.</p>
<p><strong>Vai a:</strong></p>
<ul>
<li><a href="#accelerating-similarity-search-on-really-big-data-with-vector-indexing">Accelerazione della ricerca per similarità su dati molto grandi con l'indicizzazione vettoriale</a><ul>
<li><a href="#how-does-vector-indexing-accelerate-similarity-search-and-machine-learning">In che modo l'indicizzazione vettoriale accelera la ricerca per similarità e l'apprendimento automatico?</a></li>
<li><a href="#what-are-different-types-of-ivf-indexes-and-which-scenarios-are-they-best-suited-for">Quali sono i diversi tipi di indici FIV e per quali scenari sono più adatti?</a></li>
<li><a href="#flat-good-for-searching-relatively-small-million-scale-datasets-when-100-recall-is-required">FLAT: Ottimo per la ricerca di insiemi di dati relativamente piccoli (su scala milionaria) quando è richiesto un richiamo del 100%.</a><ul>
<li><a href="#flat-performance-test-results">Risultati dei test sulle prestazioni di FLAT:</a><ul>
<li><a href="#query-time-test-results-for-the-flat-index-in-milvus"><em>Risultati dei test sui tempi di interrogazione per l'indice FLAT in Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways">Principali risultati:</a></li>
</ul></li>
<li><a href="#ivf_flat-improves-speed-at-the-expense-of-accuracy-and-vice-versa">IVF_FLAT: Migliora la velocità a scapito della precisione (e viceversa).</a><ul>
<li><a href="#ivf_flat-performance-test-results">Risultati del test delle prestazioni IVF_FLAT:</a><ul>
<li><a href="#query-time-test-results-for-ivf_flat-index-in-milvus"><em>Risultati del test sui tempi di interrogazione per l'indice IVF_FLAT in Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-1">Aspetti salienti:</a><ul>
<li><a href="#recall-rate-test-results-for-the-ivf_flat-index-in-milvus"><em>Risultati del test del tasso di richiamo per l'indice IVF_FLAT in Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-2">Aspetti salienti:</a></li>
</ul></li>
<li><a href="#ivf_sq8-faster-and-less-resource-hungry-than-ivf_flat-but-also-less-accurate">IVF_SQ8: più veloce e meno avido di risorse di IVF_FLAT, ma anche meno accurato.</a><ul>
<li><a href="#ivf_sq8-performance-test-results">Risultati dei test sulle prestazioni di IVF_SQ8:</a><ul>
<li><a href="#query-time-test-results-for-ivf_sq8-index-in-milvus"><em>Risultati dei test sui tempi di interrogazione per l'indice IVF_SQ8 in Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-3">Aspetti salienti:</a><ul>
<li><a href="#recall-rate-test-results-for-ivf_sq8-index-in-milvus"><em>Risultati del test del tasso di richiamo per l'indice IVF_SQ8 in Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-4">Aspetti salienti:</a></li>
</ul></li>
<li><a href="#ivf_sq8h-new-hybrid-gpucpu-approach-that-is-even-faster-than-ivf_sq8">IVF_SQ8H: nuovo approccio ibrido GPU/CPU ancora più veloce di IVF_SQ8.</a><ul>
<li><a href="#ivf_sq8h-performance-test-results">Risultati dei test sulle prestazioni di IVF_SQ8H:</a><ul>
<li><a href="#query-time-test-results-for-ivf_sq8h-index-in-milvus"><em>Risultati dei test sui tempi di interrogazione per l'indice IVF_SQ8H in Milvus.</em></a></li>
</ul></li>
<li><a href="#key-takeaways-5">Aspetti salienti:</a></li>
</ul></li>
<li><a href="#learn-more-about-milvus-a-massive-scale-vector-data-management-platform">Per saperne di più su Milvus, una piattaforma di gestione dei dati vettoriali su larga scala.</a></li>
<li><a href="#methodology">Metodologia</a><ul>
<li><a href="#performance-testing-environment">Ambiente di test delle prestazioni</a></li>
<li><a href="#relevant-technical-concepts">Concetti tecnici rilevanti</a></li>
<li><a href="#resources">Le risorse</a></li>
</ul></li>
</ul></li>
</ul>
<h3 id="How-does-vector-indexing-accelerate-similarity-search-and-machine-learning" class="common-anchor-header">In che modo l'indicizzazione vettoriale accelera la ricerca per similarità e l'apprendimento automatico?</h3><p>I motori di ricerca per similarità funzionano confrontando un input con un database per trovare gli oggetti più simili all'input. L'indicizzazione è il processo di organizzazione efficiente dei dati e svolge un ruolo fondamentale nel rendere utile la ricerca per similarità, accelerando drasticamente le interrogazioni che richiedono molto tempo su grandi insiemi di dati. Una volta indicizzato un enorme insieme di dati vettoriali, le query possono essere indirizzate verso i cluster, o sottoinsiemi di dati, che hanno maggiori probabilità di contenere vettori simili alla query di input. In pratica, questo significa sacrificare un certo grado di accuratezza per velocizzare le interrogazioni su dati vettoriali molto grandi.</p>
<p>Si può fare un'analogia con un dizionario, dove le parole sono ordinate alfabeticamente. Quando si cerca una parola, è possibile navigare rapidamente verso una sezione che contiene solo parole con la stessa iniziale, accelerando drasticamente la ricerca della definizione della parola inserita.</p>
<h3 id="What-are-different-types-of-IVF-indexes-and-which-scenarios-are-they-best-suited-for" class="common-anchor-header">Quali sono i diversi tipi di indici FIV e per quali scenari sono più adatti?</h3><p>Esistono numerosi indici progettati per la ricerca di similarità vettoriali ad alta dimensione, e ognuno di essi comporta dei compromessi in termini di prestazioni, precisione e requisiti di archiviazione. Questo articolo tratta di diversi tipi di indici FIV comuni, dei loro punti di forza e di debolezza e dei risultati dei test sulle prestazioni per ciascun tipo di indice. I test sulle prestazioni quantificano i tempi di interrogazione e i tassi di richiamo per ciascun tipo di indice in <a href="https://milvus.io/">Milvus</a>, una piattaforma open source per la gestione dei dati vettoriali. Per ulteriori informazioni sull'ambiente di test, consultare la sezione metodologia in fondo a questo articolo.</p>
<h3 id="FLAT-Good-for-searching-relatively-small-million-scale-datasets-when-100-recall-is-required" class="common-anchor-header">FLAT: Ottimo per la ricerca di insiemi di dati relativamente piccoli (su scala milionaria) quando è richiesto un richiamo del 100%.</h3><p>Per le applicazioni di ricerca per similarità vettoriale che richiedono una precisione perfetta e dipendono da insiemi di dati relativamente piccoli (su scala milionaria), l'indice FLAT è una buona scelta. FLAT non comprime i vettori ed è l'unico indice in grado di garantire risultati di ricerca esatti. I risultati di FLAT possono anche essere utilizzati come punto di confronto per i risultati prodotti da altri indici che hanno un richiamo inferiore al 100%.</p>
<p>FLAT è accurato perché adotta un approccio esaustivo alla ricerca, il che significa che per ogni query l'input di destinazione viene confrontato con ogni vettore di un set di dati. Per questo motivo FLAT è l'indice più lento del nostro elenco e non è adatto all'interrogazione di dati vettoriali massicci. Non ci sono parametri per l'indice FLAT in Milvus e il suo utilizzo non richiede la formazione dei dati o la memorizzazione aggiuntiva.</p>
<h4 id="FLAT-performance-test-results" class="common-anchor-header">Risultati dei test sulle prestazioni di FLAT:</h4><p>Il test delle prestazioni del tempo di interrogazione FLAT è stato condotto in Milvus utilizzando un set di dati composto da 2 milioni di vettori a 128 dimensioni.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_2_f34fb95d65.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_2.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_2.png" />
   </span> <span class="img-wrapper"> <span>Blog_Accelerazione della ricerca di similarità su dati veramente grandi con l'indicizzazione vettoriale_2.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Principali risultati:</h4><ul>
<li>All'aumentare di nq (il numero di vettori target per una query), aumenta il tempo di interrogazione.</li>
<li>Utilizzando l'indice FLAT in Milvus, si può notare che il tempo di interrogazione aumenta bruscamente una volta che nq supera 200.</li>
<li>In generale, l'indice FLAT è più veloce e coerente quando Milvus viene eseguito su GPU rispetto alla CPU. Tuttavia, le query FLAT su CPU sono più veloci quando nq è inferiore a 20.</li>
</ul>
<h3 id="IVFFLAT-Improves-speed-at-the-expense-of-accuracy-and-vice-versa" class="common-anchor-header">IVF_FLAT: Migliora la velocità a scapito della precisione (e viceversa).</h3><p>Un modo comune per accelerare il processo di ricerca delle somiglianze a scapito dell'accuratezza è quello di condurre una ricerca approssimativa dei vicini (ANN). Gli algoritmi RNA riducono i requisiti di memorizzazione e il carico di calcolo raggruppando i vettori simili, rendendo più veloce la ricerca vettoriale. IVF_FLAT è il tipo di indice di file invertito più semplice e si basa su una forma di ricerca ANN.</p>
<p>IVF_FLAT divide i dati vettoriali in un certo numero di unità di cluster (nlist), quindi confronta le distanze tra il vettore di input target e il centro di ciascun cluster. A seconda del numero di cluster che il sistema è impostato per interrogare (nprobe), i risultati della ricerca di similarità vengono restituiti in base al confronto tra l'input di destinazione e i vettori nei cluster più simili, riducendo drasticamente il tempo di interrogazione.</p>
<p>Regolando nprobe, è possibile trovare un equilibrio ideale tra precisione e velocità per un determinato scenario. I risultati del nostro test sulle prestazioni di IVF_FLAT dimostrano che il tempo di interrogazione aumenta drasticamente all'aumentare del numero di vettori di input target (nq) e del numero di cluster da ricercare (nprobe). IVF_FLAT non comprime i dati vettoriali, tuttavia i file di indice includono metadati che aumentano marginalmente i requisiti di archiviazione rispetto al set di dati vettoriali grezzi non indicizzati.</p>
<h4 id="IVFFLAT-performance-test-results" class="common-anchor-header">Risultati dei test sulle prestazioni di IVF_FLAT:</h4><p>I test sulle prestazioni dei tempi di interrogazione di IVF_FLAT sono stati condotti in Milvus utilizzando il dataset pubblico 1B SIFT, che contiene 1 miliardo di vettori a 128 dimensioni.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_3_92055190d7.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_3.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_3.png" />
   </span> <span class="img-wrapper"> <span>Blog_Accelerazione della ricerca di similarità su dati veramente grandi con l'indicizzazione vettoriale_3.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Aspetti salienti:</h4><ul>
<li>Quando viene eseguito su CPU, il tempo di interrogazione per l'indice IVF_FLAT in Milvus aumenta con nprobe e nq. Ciò significa che più vettori di input contiene una query o più cluster ricerca, più lungo sarà il tempo di interrogazione.</li>
<li>Su GPU, l'indice mostra una minore variazione di tempo rispetto alle variazioni di nq e nprobe. Questo perché i dati dell'indice sono di grandi dimensioni e la copia dei dati dalla memoria della CPU a quella della GPU rappresenta la maggior parte del tempo totale della query.</li>
<li>In tutti gli scenari, tranne quando nq = 1.000 e nprobe = 32, l'indice IVF_FLAT è più efficiente se eseguito su CPU.</li>
</ul>
<p>Il test delle prestazioni di richiamo di IVF_FLAT è stato condotto in Milvus utilizzando sia il dataset pubblico 1M SIFT, che contiene 1 milione di vettori a 128 dimensioni, sia il dataset glove-200-angular, che contiene 1+ milione di vettori a 200 dimensioni, per la costruzione dell'indice (nlist = 16.384).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_4_8c8a6b628e.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_4.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_4.png" />
   </span> <span class="img-wrapper"> <span>Blog_Accelerazione della ricerca di similarità su dati veramente grandi con l'indicizzazione vettoriale_4.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Aspetti salienti:</h4><ul>
<li>L'indice IVF_FLAT può essere ottimizzato per l'accuratezza, raggiungendo un tasso di richiamo superiore a 0,99 sul set di dati SIFT da 1M quando nprobe = 256.</li>
</ul>
<h3 id="IVFSQ8-Faster-and-less-resource-hungry-than-IVFFLAT-but-also-less-accurate" class="common-anchor-header">IVF_SQ8: più veloce e meno avido di risorse di IVF_FLAT, ma anche meno accurato.</h3><p>IVF_FLAT non esegue alcuna compressione, quindi i file di indice che produce hanno all'incirca le stesse dimensioni dei dati vettoriali originali non indicizzati. Ad esempio, se il set di dati SIFT 1B originale è di 476 GB, i file di indice IVF_FLAT saranno leggermente più grandi (~470 GB). Il caricamento di tutti i file di indice in memoria consumerà 470 GB di memoria.</p>
<p>Quando le risorse di memoria del disco, della CPU o della GPU sono limitate, IVF_SQ8 è un'opzione migliore di IVF_FLAT. Questo tipo di indice può convertire ogni FLOAT (4 byte) in UINT8 (1 byte) eseguendo una quantizzazione scalare. Questo riduce il consumo di memoria su disco, CPU e GPU del 70-75%. Per il set di dati 1B SIFT, i file di indice IVF_SQ8 richiedono solo 140 GB di memoria.</p>
<h4 id="IVFSQ8-performance-test-results" class="common-anchor-header">Risultati dei test sulle prestazioni di IVF_SQ8:</h4><p>I test sui tempi di interrogazione di IVF_SQ8 sono stati condotti in Milvus utilizzando il dataset pubblico 1B SIFT, che contiene 1 miliardo di vettori a 128 dimensioni, per la costruzione dell'indice.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_5_467fafbec4.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_5.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_5.png" />
   </span> <span class="img-wrapper"> <span>Blog_Accelerazione della ricerca di similarità su dati veramente grandi con l'indicizzazione vettoriale_5.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Aspetti salienti:</h4><ul>
<li>Riducendo le dimensioni dei file di indice, IVF_SQ8 offre notevoli miglioramenti delle prestazioni rispetto a IVF_FLAT. IVF_SQ8 segue una curva di prestazioni simile a IVF_FLAT, con tempi di interrogazione che aumentano con nq e nprobe.</li>
<li>Analogamente a IVF_FLAT, IVF_SQ8 registra prestazioni più elevate quando viene eseguito sulla CPU e quando nq e nprobe sono più piccoli.</li>
</ul>
<p>Il test delle prestazioni di richiamo di IVF_SQ8 è stato condotto in Milvus utilizzando sia il dataset pubblico 1M SIFT, che contiene 1 milione di vettori a 128 dimensioni, sia il dataset glove-200-angular, che contiene 1+ milione di vettori a 200 dimensioni, per la costruzione dell'indice (nlist = 16.384).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_6_b1e0e5b6a5.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_6.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_6.png" />
   </span> <span class="img-wrapper"> <span>Blog_Accelerazione della ricerca di similarità su dati veramente grandi con l'indicizzazione vettoriale_6.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Aspetti salienti:</h4><ul>
<li>Nonostante la compressione dei dati originali, IVF_SQ8 non registra una diminuzione significativa dell'accuratezza delle query. Con diverse impostazioni di nprobe, IVF_SQ8 ha al massimo un tasso di richiamo inferiore dell'1% rispetto a IVF_FLAT.</li>
</ul>
<h3 id="IVFSQ8H-New-hybrid-GPUCPU-approach-that-is-even-faster-than-IVFSQ8" class="common-anchor-header">IVF_SQ8H: nuovo approccio ibrido GPU/CPU ancora più veloce di IVF_SQ8.</h3><p>IVF_SQ8H è un nuovo tipo di indice che migliora le prestazioni delle query rispetto a IVF_SQ8. Quando un indice IVF_SQ8 eseguito su CPU viene interrogato, la maggior parte del tempo totale di interrogazione viene impiegato per trovare i cluster nprobe più vicini al vettore di input di destinazione. Per ridurre il tempo di interrogazione, IVF_SQ8 copia i dati per le operazioni di quantizzazione grossolana, che sono più piccoli dei file dell'indice, nella memoria della GPU, accelerando notevolmente le operazioni di quantizzazione grossolana. Quindi gpu_search_threshold determina quale dispositivo esegue la query. Quando nq &gt;= gpu_search_threshold, la GPU esegue la query; altrimenti, la CPU esegue la query.</p>
<p>IVF_SQ8H è un tipo di indice ibrido che richiede la collaborazione di CPU e GPU. Può essere utilizzato solo con Milvus abilitato alle GPU.</p>
<h4 id="IVFSQ8H-performance-test-results" class="common-anchor-header">Risultati dei test sulle prestazioni di IVF_SQ8H:</h4><p>Il test delle prestazioni del tempo di interrogazione IVF_SQ8H è stato condotto in Milvus utilizzando il dataset pubblico 1B SIFT, che contiene 1 miliardo di vettori a 128 dimensioni, per la costruzione dell'indice.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_7_b70bfe8bce.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_7.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_7.png" />
   </span> <span class="img-wrapper"> <span>Blog_Accelerazione della ricerca di similarità su dati veramente grandi con l'indicizzazione vettoriale_7.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">Aspetti salienti:</h4><ul>
<li>Quando nq è inferiore o uguale a 1.000, IVF_SQ8H registra tempi di interrogazione quasi doppi rispetto a IVFSQ8.</li>
<li>Quando nq = 2000, i tempi di interrogazione per IVFSQ8H e IVF_SQ8 sono uguali. Tuttavia, se il parametro gpu_search_threshold è inferiore a 2000, IVF_SQ8H supera IVF_SQ8.</li>
<li>Il tasso di richiamo delle query di IVF_SQ8H è identico a quello di IVF_SQ8, il che significa che si ottiene un minor tempo di interrogazione senza alcuna perdita in termini di accuratezza della ricerca.</li>
</ul>
<h3 id="Learn-more-about-Milvus-a-massive-scale-vector-data-management-platform" class="common-anchor-header">Per saperne di più su Milvus, una piattaforma di gestione dei dati vettoriali su larga scala.</h3><p>Milvus è una piattaforma di gestione dei dati vettoriali in grado di alimentare applicazioni di ricerca per similarità in campi che spaziano dall'intelligenza artificiale all'apprendimento profondo, ai calcoli vettoriali tradizionali e altro ancora. Per ulteriori informazioni su Milvus, consultate le seguenti risorse:</p>
<ul>
<li>Milvus è disponibile con licenza open-source su <a href="https://github.com/milvus-io/milvus">GitHub</a>.</li>
<li>In Milvus sono supportati altri tipi di indici, compresi quelli a grafo e ad albero. Per un elenco completo dei tipi di indice supportati, vedere la <a href="https://milvus.io/docs/v0.11.0/index.md">documentazione sugli indici vettoriali</a> in Milvus.</li>
<li>Per saperne di più sull'azienda che ha lanciato Milvus, visitate <a href="https://zilliz.com/">Zilliz.com</a>.</li>
<li>Chiacchierate con la comunità di Milvus o chiedete aiuto per un problema su <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
</ul>
<h3 id="Methodology" class="common-anchor-header">Metodologia</h3><h4 id="Performance-testing-environment" class="common-anchor-header">Ambiente di test delle prestazioni</h4><p>La configurazione del server utilizzata per i test delle prestazioni citati in questo articolo è la seguente:</p>
<ul>
<li>Intel ® Xeon ® Platinum 8163 @ 2,50GHz, 24 core</li>
<li>GeForce GTX 2080Ti x 4</li>
<li>768 GB di memoria</li>
</ul>
<h4 id="Relevant-technical-concepts" class="common-anchor-header">Concetti tecnici rilevanti</h4><p>Sebbene non siano necessari per la comprensione di questo articolo, ecco alcuni concetti tecnici utili per interpretare i risultati dei nostri test sulle prestazioni degli indici:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_8_a6c1de937f.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_8.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_8.png" />
   </span> <span class="img-wrapper"> <span>Blog_Accelerazione della ricerca di similarità su dati veramente grandi con l'indicizzazione vettoriale_8.png</span> </span></p>
<h4 id="Resources" class="common-anchor-header">Risorse</h4><p>Per questo articolo sono state utilizzate le seguenti fonti:</p>
<ul>
<li>"<a href="https://books.google.com/books/about/Encyclopedia_of_Database_Systems.html?id=YdT3wQEACAAJ">Enciclopedia dei sistemi di database</a>", Ling Liu e M. Tamer Özsu.</li>
</ul>
