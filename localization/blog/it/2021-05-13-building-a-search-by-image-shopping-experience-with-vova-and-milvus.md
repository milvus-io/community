---
id: building-a-search-by-image-shopping-experience-with-vova-and-milvus.md
title: >-
  Creazione di un'esperienza di shopping basata sulla ricerca per immagini con
  VOVA e Milvus
author: milvus
date: 2021-05-13T08:44:05.528Z
desc: >-
  Scoprite come Milvus, un database vettoriale open-source, è stato utilizzato
  dalla piattaforma di e-commerce VOVA per alimentare lo shopping per immagini.
cover: assets.zilliz.com/vova_thumbnail_db2d6c0c9c.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-a-search-by-image-shopping-experience-with-vova-and-milvus
---
<custom-h1>Creazione di un'esperienza di ricerca per immagine con VOVA e Milvus</custom-h1><p>Vai a:</p>
<ul>
<li><a href="#building-a-search-by-image-shopping-experience-with-vova-and-milvus">Creazione di un'esperienza di ricerca per immagini con VOVA e Milvus</a><ul>
<li><a href="#how-does-image-search-work">Come funziona la ricerca per immagini?</a>- <a href="#system-process-of-vovas-search-by-image-functionality"><em>Processo di sistema della funzionalità di ricerca per immagini di VOVA.</em></a></li>
<li><a href="#target-detection-using-the-yolo-model">Rilevamento del target utilizzando il modello YOLO</a>- <a href="#yolo-network-architecture"><em>Architettura della rete YOLO.</em></a></li>
<li><a href="#image-feature-vector-extraction-with-resnet">Estrazione di vettori di caratteristiche dell'immagine con ResNet</a>- <a href="#resnet-structure"><em>Struttura di ResNet.</em></a></li>
<li><a href="#vector-similarity-search-powered-by-milvus">Ricerca per somiglianza vettoriale con Milvus</a>- <a href="#mishards-architecture-in-milvus"><em>Architettura di Mishards in Milvus.</em></a></li>
<li><a href="#vovas-shop-by-image-tool">Strumento di ricerca per immagini di VOVA</a>- <a href="#screenshots-of-vovas-search-by-image-shopping-tool"><em>Schermate dello strumento di ricerca per immagini di VOVA.</em></a></li>
<li><a href="#reference">Riferimento</a></li>
</ul></li>
</ul>
<p>Lo shopping online ha registrato un'impennata nel 2020, con un <a href="https://www.digitalcommerce360.com/2021/02/15/ecommerce-during-coronavirus-pandemic-in-charts/">aumento del 44%</a>, in gran parte dovuto alla pandemia di coronavirus. Poiché le persone cercano di prendere le distanze sociali e di evitare il contatto con gli estranei, la consegna senza contatto è diventata un'opzione incredibilmente desiderabile per molti consumatori. Questa popolarità ha anche portato le persone ad acquistare una maggiore varietà di prodotti online, compresi articoli di nicchia che possono essere difficili da descrivere utilizzando una tradizionale ricerca per parole chiave.</p>
<p>Per aiutare gli utenti a superare i limiti delle ricerche basate su parole chiave, le aziende possono creare motori di ricerca per immagini che consentono agli utenti di utilizzare le immagini invece delle parole per la ricerca. Questo non solo permette agli utenti di trovare articoli difficili da descrivere, ma li aiuta anche a fare acquisti per cose che incontrano nella vita reale. Questa funzionalità contribuisce a creare un'esperienza utente unica e offre una comodità generale che i clienti apprezzano.</p>
<p>VOVA è una piattaforma di e-commerce emergente che si concentra sulla convenienza e sull'offerta di un'esperienza d'acquisto positiva ai suoi utenti, con annunci che coprono milioni di prodotti e il supporto di 20 lingue e 35 valute principali. Per migliorare l'esperienza di acquisto dei suoi utenti, l'azienda ha utilizzato Milvus per integrare la funzionalità di ricerca delle immagini nella sua piattaforma di e-commerce. L'articolo analizza come VOVA sia riuscita a creare un motore di ricerca per immagini con Milvus.</p>
<p><br/></p>
<h3 id="How-does-image-search-work" class="common-anchor-header">Come funziona la ricerca per immagini?</h3><p>Il sistema di ricerca per immagini di VOVA cerca nell'inventario dell'azienda le immagini dei prodotti simili a quelle caricate dagli utenti. Il grafico seguente mostra le due fasi del processo del sistema: la fase di importazione dei dati (blu) e la fase di interrogazione (arancione):</p>
<ol>
<li>Utilizzare il modello YOLO per rilevare gli obiettivi dalle foto caricate;</li>
<li>Utilizzare ResNet per estrarre vettori di caratteristiche dai target rilevati;</li>
<li>Utilizzare Milvus per la ricerca della similarità vettoriale.</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Vova_1_47ee6f2da9.png" alt="Vova-1.png" class="doc-image" id="vova-1.png" />
   </span> <span class="img-wrapper"> <span>Vova-1.png</span> </span></p>
<p><br/></p>
<h3 id="Target-detection-using-the-YOLO-model" class="common-anchor-header">Rilevamento dei bersagli con il modello YOLO</h3><p>Le applicazioni mobili di VOVA su Android e iOS supportano attualmente la ricerca di immagini. L'azienda utilizza un sistema all'avanguardia di rilevamento degli oggetti in tempo reale chiamato YOLO (You only look once) per rilevare gli oggetti nelle immagini caricate dagli utenti. Il modello YOLO è attualmente alla sua quinta iterazione.</p>
<p>YOLO è un modello a uno stadio, che utilizza una sola rete neurale convoluzionale (CNN) per prevedere le categorie e le posizioni di diversi bersagli. È piccolo, compatto e adatto all'uso mobile.</p>
<p>YOLO utilizza strati convoluzionali per estrarre le caratteristiche e strati completamente connessi per ottenere i valori previsti. Ispirandosi al modello GooLeNet, la CNN di YOLO comprende 24 strati convoluzionali e due strati completamente connessi.</p>
<p>Come mostra l'illustrazione seguente, un'immagine di ingresso 448 × 448 viene convertita da una serie di livelli convoluzionali e di pooling layers in un tensore 7 × 7 × 1024-dimensionale (raffigurato nel terzultimo cubo in basso), quindi convertito da due livelli completamente connessi in un tensore di uscita 7 × 7 × 30-dimensionale.</p>
<p>L'output previsto di YOLO P è un tensore bidimensionale, la cui forma è [batch,7 ×7 ×30]. Utilizzando l'affettatura, P[:,0:7×7×20] è la probabilità della categoria, P[:,7×7×20:7×7×(20+2)] è la confidenza e P[:,7×7×(20+2)]:] è il risultato previsto del rettangolo di selezione.</p>
<p>![vova-2.png](https://assets.zilliz.com/vova_2_1ccf38f721.png &quot;Architettura di rete YOLO&quot;).</p>
<p><br/></p>
<h3 id="Image-feature-vector-extraction-with-ResNet" class="common-anchor-header">Estrazione del vettore di caratteristiche dell'immagine con ResNet</h3><p>VOVA ha adottato il modello della rete neurale residua (ResNet) per estrarre vettori di caratteristiche da un'ampia libreria di immagini di prodotti e dalle foto caricate dagli utenti. ResNet è limitata perché all'aumentare della profondità di una rete di apprendimento, la precisione della rete diminuisce. L'immagine seguente mostra ResNet che esegue il modello VGG19 (una variante del modello VGG) modificato per includere un'unità residua attraverso il meccanismo del cortocircuito. VGG è stato proposto nel 2014 e comprende solo 14 strati, mentre ResNet è uscito un anno dopo e può arrivare fino a 152.</p>
<p>La struttura di ResNet è facile da modificare e scalare. Cambiando il numero di canali nel blocco e il numero di blocchi impilati, la larghezza e la profondità della rete possono essere facilmente regolate per ottenere reti con diverse capacità espressive. In questo modo si risolve efficacemente l'effetto di degenerazione della rete, in cui l'accuratezza diminuisce all'aumentare della profondità di apprendimento. Con un numero sufficiente di dati di addestramento, è possibile ottenere un modello con prestazioni espressive migliori, approfondendo gradualmente la rete. Attraverso l'addestramento del modello, le caratteristiche vengono estratte per ogni immagine e convertite in vettori a 256 dimensioni in virgola mobile.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vova_3_df4b810281.png" alt="vova-3.png" class="doc-image" id="vova-3.png" />
   </span> <span class="img-wrapper"> <span>vova-3.png</span> </span></p>
<p><br/></p>
<h3 id="Vector-similarity-search-powered-by-Milvus" class="common-anchor-header">Ricerca per somiglianza vettoriale alimentata da Milvus</h3><p>Il database delle immagini dei prodotti di VOVA comprende 30 milioni di immagini e sta crescendo rapidamente. Per recuperare rapidamente le immagini di prodotto più simili da questo enorme insieme di dati, Milvus viene utilizzato per condurre una ricerca di similarità vettoriale. Grazie a una serie di ottimizzazioni, Milvus offre un approccio rapido e semplificato alla gestione dei dati vettoriali e alla creazione di applicazioni di apprendimento automatico. Milvus si integra con le librerie di indici più diffuse (ad esempio, Faiss, Annoy), supporta diversi tipi di indici e metriche di distanza, dispone di SDK in diverse lingue e fornisce ricche API per la gestione dei dati vettoriali.</p>
<p>Milvus è in grado di effettuare ricerche di similarità su dataset di miliardi di vettori in pochi millisecondi, con un tempo di interrogazione inferiore a 1,5 secondi quando nq=1 e un tempo medio di interrogazione in batch inferiore a 0,08 secondi. Per costruire il suo motore di ricerca di immagini, VOVA ha fatto riferimento al design di Mishards, la soluzione middleware di sharding di Milvus (si veda il grafico sottostante per il design del sistema), per implementare un cluster di server ad alta disponibilità. Sfruttando la scalabilità orizzontale di un cluster Milvus, è stato possibile soddisfare i requisiti del progetto per ottenere elevate prestazioni di interrogazione su enormi insiemi di dati.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vova_4_e305f1955c.png" alt="vova-4.png" class="doc-image" id="vova-4.png" />
   </span> <span class="img-wrapper"> <span>vova-4.png</span> </span></p>
<h3 id="VOVAs-shop-by-image-tool" class="common-anchor-header">Lo strumento "shop by image" di VOVA</h3><p>Le schermate seguenti mostrano lo strumento di ricerca per immagini di VOVA sull'app Android dell'azienda.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vova_5_c4c25a3bae.png" alt="vova-5.png" class="doc-image" id="vova-5.png" />
   </span> <span class="img-wrapper"> <span>vova-5.png</span> </span></p>
<p>Con l'aumentare degli utenti che cercano prodotti e caricano foto, VOVA continuerà a ottimizzare i modelli che alimentano il sistema. Inoltre, l'azienda incorporerà nuove funzionalità di Milvus in grado di migliorare ulteriormente l'esperienza di acquisto online dei suoi utenti.</p>
<h3 id="Reference" class="common-anchor-header">Riferimento</h3><p><strong>YOLO:</strong></p>
<p>https://arxiv.org/pdf/1506.02640.pdf</p>
<p>https://arxiv.org/pdf/1612.08242.pdf</p>
<p><strong>ResNet:</strong></p>
<p>https://arxiv.org/abs/1512.03385</p>
<p><strong>Milvus:</strong></p>
<p>https://milvus.io/docs</p>
