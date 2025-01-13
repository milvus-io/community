---
id: Extracting-Events-Highlights-Using-iYUNDONG-Sports-App.md
title: Estrazione dei momenti salienti di un evento con l'app iYUNDONG Sports
author: milvus
date: 2021-03-16T03:41:30.983Z
desc: >-
  Realizzazione con Milvus Sistema di recupero intelligente di immagini per lo
  sport App iYUNDONG
cover: assets.zilliz.com/blog_iyundong_6db0f70ef4.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/Extracting-Events-Highlights-Using-iYUNDONG-Sports-App'
---
<custom-h1>Estrazione dei momenti salienti di un evento con l'applicazione sportiva iYUNDONG</custom-h1><p>iYUNDONG è un'azienda Internet che mira a coinvolgere un maggior numero di amanti dello sport e di partecipanti a eventi come le maratone. Costruisce strumenti <a href="https://en.wikipedia.org/wiki/Artificial_intelligence">di intelligenza artificiale (AI)</a> in grado di analizzare i media catturati durante gli eventi sportivi per generare automaticamente i momenti salienti. Ad esempio, caricando un selfie, un utente dell'app sportiva di iYUNDONG che ha partecipato a un evento sportivo può recuperare istantaneamente le proprie foto o i propri video da un enorme set di dati multimediali dell'evento.</p>
<p>Una delle caratteristiche principali dell'App iYUNDONG si chiama "Trovami in movimento".  I fotografi di solito scattano enormi volumi di foto o video durante un evento sportivo come una maratona, e caricano le foto e i video in tempo reale nel database dei media di iYUNDONG. I maratoneti che vogliono rivedere i loro momenti salienti possono recuperare le immagini che li riguardano semplicemente caricando uno dei loro selfie. In questo modo risparmiano molto tempo, perché un sistema di recupero delle immagini nell'app iYUNDONG si occupa della corrispondenza delle immagini. <a href="https://milvus.io/">Milvus</a> è stato adottato da iYUNDONG per alimentare questo sistema, in quanto Milvus è in grado di accelerare notevolmente il processo di recupero e di restituire risultati altamente accurati.</p>
<p><br/></p>
<p><strong>Vai a:</strong></p>
<ul>
<li><a href="#extracting-event-highlights-using-iyundong-sports-app">Estrazione dei momenti salienti di un evento con l'app iYUNDONG Sports</a><ul>
<li><a href="#difficulties-and-solutions">Difficoltà e soluzioni</a></li>
<li><a href="#what-is-milvus">Cos'è Milvus</a>- <a href="#an-overview-of-milvus"><em>Una panoramica di Milvus.</em></a></li>
<li><a href="#why-milvus">Perché Milvus</a></li>
<li><a href="#system-and-workflow">Sistema e flusso di lavoro</a></li>
<li><a href="#iyundong-app-interface">Interfaccia dell'app iYUNDONG</a>- <a href="#iyundong-app-interface-1"><em>Interfaccia dell'app iYUNDONG.</em></a></li>
<li><a href="#conclusion">Conclusione</a></li>
</ul></li>
</ul>
<p><br/></p>
<h3 id="Difficulties-and-solutions" class="common-anchor-header">Difficoltà e soluzioni</h3><p>Nella realizzazione del suo sistema di recupero delle immagini, iYUNDONG ha affrontato i seguenti problemi e ha trovato le relative soluzioni.</p>
<ul>
<li>Le foto degli eventi devono essere immediatamente disponibili per la ricerca.</li>
</ul>
<p>iYUNDONG ha sviluppato una funzione chiamata InstantUpload per garantire che le foto degli eventi siano disponibili per la ricerca subito dopo il loro caricamento.</p>
<ul>
<li>Memorizzazione di insiemi di dati enormi</li>
</ul>
<p>Dati enormi come foto e video vengono caricati sul backend di iYUNDONG ogni millisecondo. Per questo motivo iYUNDONG ha deciso di migrare su sistemi di archiviazione cloud, tra cui <a href="https://aws.amazon.com/">AWS</a>, <a href="https://aws.amazon.com/s3/?nc1=h_ls">S3</a> e <a href="https://www.alibabacloud.com/product/oss">Alibaba Cloud Object Storage Service (OSS),</a> per gestire volumi enormi di dati non strutturati in modo sicuro, veloce e affidabile.</p>
<ul>
<li>Lettura immediata</li>
</ul>
<p>Per ottenere la lettura istantanea, iYUNDONG ha sviluppato il proprio middleware di sharding per ottenere facilmente la scalabilità orizzontale e mitigare l'impatto sul sistema della lettura su disco. Inoltre, <a href="https://redis.io/">Redis</a> viene utilizzato come livello di caching per garantire prestazioni costanti in situazioni di elevata concomitanza.</p>
<ul>
<li>Estrazione istantanea dei tratti del viso</li>
</ul>
<p>Per estrarre in modo accurato ed efficiente i tratti del viso dalle foto caricate dagli utenti, iYUNDONG ha sviluppato un algoritmo proprietario di conversione delle immagini in vettori di caratteristiche a 128 dimensioni. Un altro problema riscontrato è che spesso molti utenti e fotografi caricano immagini o video contemporaneamente. Gli ingegneri del sistema dovevano quindi prendere in considerazione la scalabilità dinamica durante l'implementazione del sistema. In particolare, iYUNDONG ha sfruttato appieno il servizio di calcolo elastico (ECS) sul cloud per ottenere una scalabilità dinamica.</p>
<ul>
<li>Ricerca vettoriale rapida e su larga scala</li>
</ul>
<p>iYUNDONG aveva bisogno di un database vettoriale per archiviare il gran numero di vettori di caratteristiche estratti dai modelli AI. In base al suo scenario applicativo unico, iYUNDONG si aspettava che il database vettoriale fosse in grado di:</p>
<ol>
<li>Eseguire un rapidissimo recupero di vettori su insiemi di dati ultra-grandi.</li>
<li>di ottenere un'archiviazione di massa a costi inferiori.</li>
</ol>
<p>Inizialmente veniva elaborata una media di 1 milione di immagini all'anno, quindi iYUNDONG memorizzava tutti i dati per la ricerca nella RAM. Tuttavia, negli ultimi due anni, la sua attività ha registrato un boom e una crescita esponenziale dei dati non strutturati: il numero di immagini presenti nel database di iYUNDONG ha superato i 60 milioni nel 2019, il che significa che era necessario memorizzare più di 1 miliardo di feature vectors. Un'enorme quantità di dati ha inevitabilmente reso il sistema di iYUNDONG pesantemente costruito e con un elevato consumo di risorse. Per questo ha dovuto investire continuamente in strutture hardware per garantire prestazioni elevate. In particolare, iYUNDONG ha implementato più server di ricerca, una RAM più grande e una CPU più performante per ottenere una maggiore efficienza e scalabilità orizzontale. Tuttavia, uno dei difetti di questa soluzione era che faceva lievitare in modo proibitivo i costi operativi. Pertanto, iYUNDONG ha iniziato a cercare una soluzione migliore a questo problema e ha pensato di sfruttare librerie di indici vettoriali come Faiss per risparmiare sui costi e orientare meglio la propria attività. Alla fine iYUNDONG ha scelto il database vettoriale open-source Milvus.</p>
<p><br/></p>
<h3 id="What-is-Milvus" class="common-anchor-header">Cos'è Milvus</h3><p>Milvus è un database vettoriale open-source facile da usare, altamente flessibile, affidabile e velocissimo. Combinato con vari modelli di deep learning, come il riconoscimento di foto e voce, l'elaborazione video e l'elaborazione del linguaggio naturale, Milvus è in grado di elaborare e analizzare dati non strutturati che vengono convertiti in vettori utilizzando vari algoritmi di intelligenza artificiale. Di seguito è riportato il flusso di lavoro di come Milvus elabora tutti i dati non strutturati:</p>
<p>I dati non strutturati vengono convertiti in vettori di incorporamento da modelli di deep learning o altri algoritmi di IA.</p>
<p>Poi i vettori di incorporamento vengono inseriti in Milvus per l'archiviazione. Milvus costruisce anche indici per questi vettori.</p>
<p>Milvus esegue la ricerca per similarità e restituisce risultati di ricerca accurati in base alle varie esigenze aziendali.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/i_YUNDONG_Blog_1_d8abe065ae.png" alt="iYUNDONG Blog 1.png" class="doc-image" id="iyundong-blog-1.png" />
   </span> <span class="img-wrapper"> <span>Blog iYUNDONG 1.png</span> </span></p>
<p><br/></p>
<h3 id="Why-Milvus" class="common-anchor-header">Perché Milvus</h3><p>Dalla fine del 2019, iYUNDONG ha condotto una serie di test sull'utilizzo di Milvus per alimentare il suo sistema di recupero delle immagini. Dai risultati dei test è emerso che Milvus supera gli altri database vettoriali mainstream in quanto supporta indici multipli e può ridurre in modo efficiente l'utilizzo della RAM, comprimendo in modo significativo la tempistica della ricerca di similarità vettoriale.</p>
<p>Inoltre, le nuove versioni di Milvus vengono rilasciate regolarmente. Nel corso del periodo di test, Milvus è stato sottoposto a diversi aggiornamenti di versione, dalla v0.6.0 alla v0.10.1.</p>
<p>Inoltre, grazie alla sua attiva comunità open-source e alle potenti funzionalità già pronte, Milvus consente a iYUNDONG di operare con un budget di sviluppo limitato.</p>
<p><br/></p>
<h3 id="System-and-Workflow" class="common-anchor-header">Sistema e flusso di lavoro</h3><p>Il sistema di iYUNDONG estrae le caratteristiche facciali rilevando i volti nelle foto degli eventi caricate dai fotografi. Poi i tratti del viso vengono convertiti in vettori a 128 dimensioni e memorizzati nella libreria Milvus. Milvus crea indici per questi vettori e può restituire istantaneamente risultati molto accurati.</p>
<p>Altre informazioni aggiuntive, come gli ID delle foto e le coordinate che indicano la posizione di un volto in una foto, sono memorizzate in un database di terze parti.</p>
<p>Ogni vettore di caratteristiche ha un ID univoco nella libreria Milvus. iYUNDONG ha adottato l'<a href="https://github.com/Meituan-Dianping/Leaf">algoritmo Leaf</a>, un servizio di generazione di ID distribuiti sviluppato dalla piattaforma di ricerca e sviluppo di base <a href="https://about.meituan.com/en">Meituan</a>, per associare l'ID del vettore in Milvus con le informazioni aggiuntive corrispondenti memorizzate in un altro database. Combinando il vettore di caratteristiche e le informazioni aggiuntive, il sistema iYUNDONG può restituire risultati simili alla ricerca dell'utente.</p>
<p><br/></p>
<h3 id="iYUNDONG-App-Interface" class="common-anchor-header">Interfaccia dell'app iYUNDONG</h3><p>Nella homepage sono elencati una serie di eventi sportivi recenti. Toccando uno degli eventi, gli utenti possono vederne i dettagli completi.</p>
<p>Dopo aver toccato il pulsante in cima alla pagina della galleria fotografica, gli utenti possono caricare una loro foto per recuperare le immagini dei loro momenti salienti.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/iyundong_interface_3da684d206.jpg" alt="iyundong-interface.jpg" class="doc-image" id="iyundong-interface.jpg" />
   </span> <span class="img-wrapper"> <span>iyundong-interfaccia.jpg</span> </span></p>
<p><br/></p>
<h3 id="Conclusion" class="common-anchor-header">Conclusione</h3><p>Questo articolo presenta come l'app iYUNDONG costruisce un sistema intelligente di recupero delle immagini in grado di restituire risultati di ricerca accurati in base alle foto caricate dagli utenti che variano per risoluzione, dimensioni, chiarezza, angolazione e altri aspetti che complicano la ricerca di somiglianze. Con l'aiuto di Milvus, iYUNDONG App è in grado di eseguire con successo query di livello millisecondo su un database di oltre 60 milioni di immagini. Il tasso di accuratezza del recupero delle foto è costantemente superiore al 92%. Milvus rende più facile per iYUNDONG creare un sistema di recupero immagini potente e di livello aziendale in poco tempo e con risorse limitate.</p>
<p>Leggete le altre <a href="https://zilliz.com/user-stories">storie degli utenti per</a> saperne di più sulla creazione di oggetti con Milvus.</p>
