---
id: Making-With-Milvus-AI-Infused-Proptech-for-Personalized-Real-Estate-Search.md
title: Con Milvus AI-Infused Proptech per una ricerca immobiliare personalizzata
author: milvus
date: 2021-03-18T03:53:54.736Z
desc: >-
  L'intelligenza artificiale sta trasformando il settore immobiliare, scoprite
  come il proptech intelligente accelera il processo di ricerca e acquisto di
  una casa.
cover: assets.zilliz.com/blog_realistate_search_da4e8ee01d.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-With-Milvus-AI-Infused-Proptech-for-Personalized-Real-Estate-Search
---
<custom-h1>Con Milvus: l'intelligenza artificiale per una ricerca immobiliare personalizzata</custom-h1><p>L'intelligenza artificiale (AI) ha <a href="https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f#d62b">potenti applicazioni</a> nel settore immobiliare che stanno trasformando il processo di ricerca della casa. Da anni i professionisti del settore immobiliare, esperti di tecnologia, sfruttano l'IA, riconoscendo la sua capacità di aiutare i clienti a trovare più velocemente la casa giusta e a semplificare il processo di acquisto di una proprietà. La pandemia di coronavirus ha <a href="https://www.pwc.com/ca/en/industries/real-estate/emerging-trends-in-real-estate-2021/shifting-landscape-proptech.html">accelerato l'</a> interesse, l'adozione e gli investimenti nella tecnologia immobiliare (o proptech) in tutto il mondo, suggerendo che essa giocherà un ruolo sempre più importante nel settore immobiliare.</p>
<p>Questo articolo analizza il modo in cui <a href="https://bj.ke.com/">Beike</a> ha utilizzato la ricerca per similarità vettoriale per costruire una piattaforma per la ricerca di case che fornisce risultati personalizzati e consiglia annunci in tempo quasi reale.</p>
<h3 id="What-is-vector-similarity-search" class="common-anchor-header">Che cos'è la ricerca per similarità vettoriale?</h3><p>La<a href="https://medium.com/unstructured-data-service/vector-similarity-search-hides-in-plain-view-654f8152f8ab">ricerca per similarità vettoriale</a> trova applicazione in un'ampia gamma di scenari di intelligenza artificiale, deep learning e calcolo vettoriale tradizionale. La proliferazione della tecnologia AI è in parte attribuita alla ricerca vettoriale e alla sua capacità di dare un senso ai dati non strutturati, che comprendono immagini, video, audio, dati comportamentali, documenti e molto altro.</p>
<p>Si stima che i dati non strutturati costituiscano l'80-90% di tutti i dati e l'estrazione di informazioni da essi sta rapidamente diventando un requisito per le aziende che vogliono rimanere competitive in un mondo in continua evoluzione. La crescente domanda di analisi dei dati non strutturati, l'aumento della potenza di calcolo e la diminuzione dei costi di calcolo hanno reso la ricerca vettoriale abilitata dall'AI più accessibile che mai.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_blog_img1_2dc95cac08.jpg" alt="beike-blog-img1.jpg" class="doc-image" id="beike-blog-img1.jpg" />
   </span> <span class="img-wrapper"> <span>beike-blog-img1.jpg</span> </span></p>
<p>Tradizionalmente, i dati non strutturati rappresentano una sfida da elaborare e analizzare su scala perché non seguono un modello o una struttura organizzativa predefinita. Le reti neurali (ad esempio, CNN, RNN e BERT) consentono di convertire i dati non strutturati in vettori di caratteristiche, un formato numerico facilmente interpretabile dai computer. Gli algoritmi vengono quindi utilizzati per calcolare la somiglianza tra i vettori utilizzando metriche come la somiglianza del coseno o la distanza euclidea.</p>
<p>In definitiva, la ricerca della somiglianza vettoriale è un termine ampio che descrive le tecniche per identificare le cose simili in enormi insiemi di dati. Beike utilizza questa tecnologia per alimentare un motore di ricerca intelligente che consiglia automaticamente gli annunci in base alle preferenze individuali dell'utente, alla cronologia delle ricerche e ai criteri di proprietà, accelerando il processo di ricerca e acquisto di immobili. Milvus è un database vettoriale open-source che collega le informazioni agli algoritmi, consentendo a Beike di sviluppare e gestire la sua piattaforma immobiliare AI.</p>
<p><br/></p>
<h3 id="How-does-Milvus-manage-vector-data" class="common-anchor-header">Come fa Milvus a gestire i dati vettoriali?</h3><p>Milvus è stato costruito specificamente per la gestione di dati vettoriali su larga scala e ha applicazioni che spaziano dalla ricerca di immagini e video all'analisi della somiglianza chimica, dai sistemi di raccomandazione personalizzati all'IA conversazionale e molto altro ancora. Gli insiemi di dati vettoriali memorizzati in Milvus possono essere interrogati in modo efficiente e la maggior parte delle implementazioni segue questo processo generale:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_blog_img2_d5abb58f95.jpg" alt="beike-blog-img2.jpg" class="doc-image" id="beike-blog-img2.jpg" />
   </span> <span class="img-wrapper"> <span>beike-blog-img2.jpg</span> </span></p>
<p><br/></p>
<h3 id="How-does-Beike-use-Milvus-to-make-house-hunting-smarter" class="common-anchor-header">In che modo Beike utilizza Milvus per rendere più intelligente la ricerca di una casa?</h3><p>Descritta comunemente come la risposta cinese a Zillow, Beike è una piattaforma online che consente agli agenti immobiliari di elencare le proprietà in affitto o in vendita. Per migliorare l'esperienza di ricerca della casa per i cacciatori di case e per aiutare gli agenti a concludere più velocemente gli affari, l'azienda ha costruito un motore di ricerca alimentato dall'intelligenza artificiale per il suo database di annunci. Il database degli annunci immobiliari di Beike è stato convertito in vettori di caratteristiche e poi inserito in Milvus per l'indicizzazione e l'archiviazione. Milvus viene quindi utilizzato per condurre una ricerca per similarità in base a un annuncio, ai criteri di ricerca, al profilo dell'utente o ad altri criteri.</p>
<p>Ad esempio, quando si cercano altre case simili a un determinato annuncio, vengono estratte caratteristiche come la pianta, le dimensioni, l'orientamento, le finiture interne, i colori della vernice e altro ancora. Poiché il database originale degli annunci immobiliari è stato <a href="https://medium.com/unstructured-data-service/how-to-choose-an-index-in-milvus-4f3d15259212">indicizzato</a>, le ricerche possono essere effettuate in pochi millisecondi. Il prodotto finale di Beike ha registrato un tempo medio di interrogazione di 113 millisecondi su un set di dati contenente oltre 3 milioni di vettori. Tuttavia, Milvus è in grado di mantenere velocità efficienti su set di dati di dimensioni trilionarie, facendo un lavoro leggero su questo database immobiliare relativamente piccolo. In generale, il sistema segue il seguente processo:</p>
<ol>
<li><p>I modelli di apprendimento profondo (ad esempio, CNN, RNN o BERT) convertono i dati non strutturati in vettori di caratteristiche, che vengono poi importati in Milvus.</p></li>
<li><p>Milvus memorizza e indicizza i vettori di caratteristiche.</p></li>
<li><p>Milvus restituisce risultati di ricerca per similarità basati su query dell'utente.</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_overview_diagram_d17cda0e47.png" alt="milvus-overview-diagram.png" class="doc-image" id="milvus-overview-diagram.png" />
   </span> <span class="img-wrapper"> <span>milvus-overview-diagram.png</span> </span></p>
<p><br/></p>
<p>La piattaforma di ricerca immobiliare intelligente di Beike si basa su un algoritmo di raccomandazione che calcola la somiglianza dei vettori utilizzando la distanza del coseno. Il sistema trova case simili in base agli annunci preferiti e ai criteri di ricerca. Ad alto livello, funziona come segue:</p>
<ol>
<li><p>Sulla base di un annuncio di input, caratteristiche come la pianta, la dimensione e l'orientamento vengono utilizzate per estrarre 4 collezioni di vettori di caratteristiche.</p></li>
<li><p>Le collezioni di caratteristiche estratte vengono utilizzate per eseguire una ricerca di similarità in Milvus. I risultati della ricerca per ogni collezione di vettori sono una misura della somiglianza tra l'annuncio di ingresso e altri annunci simili.</p></li>
<li><p>I risultati della ricerca di ciascuna delle 4 raccolte di vettori vengono confrontati e poi utilizzati per raccomandare case simili.</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_intelligent_house_platform_diagram_6e278da118.jpg" alt="beike-intelligent-house-platform-diagram.jpg" class="doc-image" id="beike-intelligent-house-platform-diagram.jpg" />
   </span> <span class="img-wrapper"> <span>beike-intelligent-house-platform-diagram.jpg</span> </span></p>
<p><br/></p>
<p>Come mostra la figura precedente, il sistema implementa un meccanismo di commutazione della tabella A/B per l'aggiornamento dei dati. Milvus memorizza i dati per i primi T giorni nella tabella A, il giorno T+1 inizia a memorizzare i dati nella tabella B, il giorno 2T+1 inizia a riscrivere la tabella A e così via.</p>
<p><br/></p>
<h3 id="To-learn-more-about-making-things-with-Milvus-check-out-the-following-resources" class="common-anchor-header">Per saperne di più sulla creazione di oggetti con Milvus, consultate le seguenti risorse:</h3><ul>
<li><p><a href="https://zilliz.com/blog/Building-an-AI-Powered-Writing-Assistant-with-WPS-Office">Costruire un assistente di scrittura dotato di intelligenza artificiale per WPS Office</a></p></li>
<li><p><a href="https://zilliz.com/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser">Creare con Milvus: raccomandazione di notizie alimentata dall'intelligenza artificiale all'interno del browser mobile di Xiaomi</a></p></li>
</ul>
