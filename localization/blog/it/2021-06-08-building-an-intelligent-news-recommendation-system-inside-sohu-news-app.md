---
id: building-an-intelligent-news-recommendation-system-inside-sohu-news-app.md
title: Raccomandare contenuti utilizzando la ricerca vettoriale semantica
author: milvus
date: 2021-06-08T01:42:53.489Z
desc: >-
  Scoprite come Milvus è stato utilizzato per costruire un sistema di
  raccomandazione intelligente di notizie all'interno di un'app.
cover: assets.zilliz.com/blog_Sohu_News_dec53d0814.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/building-an-intelligent-news-recommendation-system-inside-sohu-news-app
---
<custom-h1>Creazione di un sistema intelligente di raccomandazione delle notizie all'interno dell'app Sohu News</custom-h1><p>Con il <a href="https://www.socialmediatoday.com/news/new-research-shows-that-71-of-americans-now-get-news-content-via-social-pl/593255/">71% degli americani</a> che ricevono le raccomandazioni di notizie dalle piattaforme sociali, i contenuti personalizzati sono diventati rapidamente il modo in cui vengono scoperti i nuovi media. Sia che le persone cerchino argomenti specifici, sia che interagiscano con i contenuti consigliati, tutto ciò che gli utenti vedono è ottimizzato dagli algoritmi per migliorare il tasso di clic (CTR), il coinvolgimento e la pertinenza. Sohu è un gruppo cinese di media, video, ricerca e giochi online quotato al NASDAQ. Ha sfruttato <a href="https://milvus.io/">Milvus</a>, un database vettoriale open-source realizzato da <a href="https://zilliz.com/">Zilliz</a>, per costruire un motore di ricerca vettoriale semantico all'interno della sua app di notizie. Questo articolo spiega come l'azienda ha utilizzato i profili degli utenti per affinare nel tempo le raccomandazioni di contenuti personalizzati, migliorando l'esperienza e il coinvolgimento degli utenti.</p>
<h2 id="Recommending-content-using-semantic-vector-search" class="common-anchor-header">Raccomandare contenuti utilizzando la ricerca vettoriale semantica<button data-href="#Recommending-content-using-semantic-vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p>I profili degli utenti di Sohu News sono costruiti a partire dalla cronologia di navigazione e vengono modificati man mano che gli utenti cercano e interagiscono con i contenuti di notizie. Il sistema di raccomandazione di Sohu utilizza la ricerca vettoriale semantica per trovare articoli di notizie rilevanti. Il sistema funziona identificando una serie di tag che dovrebbero essere di interesse per ogni utente in base alla cronologia di navigazione. Quindi cerca rapidamente gli articoli pertinenti e ordina i risultati in base alla popolarità (misurata dal CTR medio), prima di servirli agli utenti.</p>
<p>Solo il New York Times pubblica <a href="https://www.theatlantic.com/technology/archive/2016/05/how-many-stories-do-newspapers-publish-per-day/483845/">230 contenuti</a> al giorno, il che dà un'idea dell'entità dei nuovi contenuti che un sistema di raccomandazione efficace deve essere in grado di elaborare. L'acquisizione di grandi volumi di notizie richiede una ricerca di similarità al millisecondo e una corrispondenza oraria dei tag ai nuovi contenuti. Sohu ha scelto Milvus perché elabora in modo efficiente e accurato enormi insiemi di dati, riduce l'uso della memoria durante la ricerca e supporta implementazioni ad alte prestazioni.</p>
<h2 id="Understanding-a-news-recommendation-system-workflow" class="common-anchor-header">Comprendere il flusso di lavoro di un sistema di raccomandazione delle notizie<button data-href="#Understanding-a-news-recommendation-system-workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>La raccomandazione di contenuti basata sulla ricerca semantica vettoriale di Sohu si basa sul Deep Structured Semantic Model (DSSM), che utilizza due reti neurali per rappresentare le query degli utenti e gli articoli di notizie come vettori. Il modello calcola la somiglianza del coseno dei due vettori semantici, quindi il gruppo di notizie più simile viene inviato al pool di candidati alla raccomandazione. Successivamente, gli articoli di notizie vengono classificati in base al loro CTR stimato e quelli con il più alto tasso di click-through previsto vengono mostrati agli utenti.</p>
<h3 id="Encoding-news-articles-into-semantic-vectors-with-BERT-as-service" class="common-anchor-header">Codifica degli articoli di notizie in vettori semantici con BERT-as-service</h3><p>Per codificare gli articoli di notizie in vettori semantici, il sistema utilizza lo strumento <a href="https://github.com/hanxiao/bert-as-service.git">BERT-as-service</a>. Se il numero di parole di un contenuto supera i 512 durante l'utilizzo di questo modello, si verifica una perdita di informazioni durante il processo di incorporazione. Per ovviare a questo problema, il sistema estrae prima un riassunto e lo codifica in un vettore semantico a 768 dimensioni. Quindi vengono estratti i due argomenti più rilevanti da ogni articolo di cronaca e vengono identificati i corrispondenti vettori di argomenti pre-addestrati (200 dimensioni) in base all'ID dell'argomento. Successivamente, i vettori argomento vengono uniti al vettore semantico a 768 dimensioni estratto dal sommario dell'articolo, formando un vettore semantico a 968 dimensioni.</p>
<p>I nuovi contenuti arrivano continuamente attraverso Kafta e vengono convertiti in vettori semantici prima di essere inseriti nel database Milvus.</p>
<h3 id="Extracting-semantically-similar-tags-from-user-profiles-with-BERT-as-service" class="common-anchor-header">Estrazione di tag semanticamente simili dai profili degli utenti con BERT-as-service</h3><p>L'altra rete neurale del modello è il vettore semantico degli utenti. I tag semanticamente simili (ad esempio, coronavirus, covid, COVID-19, pandemia, nuovo ceppo, polmonite) vengono estratti dai profili degli utenti in base agli interessi, alle query di ricerca e alla cronologia di navigazione. L'elenco dei tag acquisiti viene ordinato per peso e i primi 200 vengono suddivisi in diversi gruppi semantici. Le permutazioni dei tag all'interno di ciascun gruppo semantico vengono utilizzate per generare nuove frasi di tag, che vengono poi codificate in vettori semantici attraverso il servizio BERT-as-service.</p>
<p>Per ogni profilo utente, gli insiemi di frasi tag hanno un <a href="https://github.com/baidu/Familia">corrispondente insieme di argomenti</a>, contrassegnati da un peso che indica il livello di interesse dell'utente. I primi due argomenti di tutti gli argomenti rilevanti vengono selezionati e codificati dal modello di apprendimento automatico (ML) per essere inseriti nel vettore semantico dei tag corrispondente, formando un vettore semantico utente a 968 dimensioni. Anche se il sistema genera gli stessi tag per utenti diversi, i diversi pesi per i tag e gli argomenti corrispondenti, così come la varianza esplicita tra i vettori di argomenti di ciascun utente, assicurano che le raccomandazioni siano uniche.</p>
<p>Il sistema è in grado di fornire raccomandazioni personalizzate sulle notizie calcolando la similarità del coseno dei vettori semantici estratti sia dai profili degli utenti sia dagli articoli di notizie.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sohu01_1e466fe0c3.jpg" alt="Sohu01.jpg" class="doc-image" id="sohu01.jpg" />
   </span> <span class="img-wrapper"> <span>Sohu01.jpg</span> </span></p>
<h3 id="Computing-new-semantic-user-profile-vectors-and-inserting-them-to-Milvus" class="common-anchor-header">Calcolo di nuovi vettori semantici del profilo utente e loro inserimento in Milvus</h3><p>I vettori del profilo semantico degli utenti vengono calcolati ogni giorno, con i dati del periodo precedente di 24 ore elaborati la sera successiva. I vettori vengono inseriti singolarmente in Milvus e sottoposti al processo di interrogazione per fornire agli utenti risultati rilevanti sulle notizie. Il contenuto delle notizie è intrinsecamente attuale, per cui il calcolo deve essere eseguito ogni ora per generare un newsfeed attuale che contenga contenuti con un alto tasso di clic previsto e rilevanti per gli utenti. I contenuti delle notizie sono inoltre ordinati in partizioni per data e le notizie vecchie vengono eliminate ogni giorno.</p>
<h3 id="Decreasing-semantic-vector-extraction-time-from-days-to-hours" class="common-anchor-header">Riduzione del tempo di estrazione dei vettori semantici da giorni a ore</h3><p>Il recupero dei contenuti utilizzando i vettori semantici richiede la conversione di decine di milioni di frasi di tag in vettori semantici ogni giorno. Si tratta di un processo lungo che richiederebbe giorni per essere completato anche se eseguito con unità di elaborazione grafica (GPU), che accelerano questo tipo di calcolo. Per superare questo problema tecnico, i vettori semantici dell'incorporazione precedente devono essere ottimizzati in modo che, quando emergono frasi di tag simili, i vettori semantici corrispondenti vengano recuperati direttamente.</p>
<p>Il vettore semantico dell'insieme di frasi tag esistente viene memorizzato e un nuovo insieme di frasi tag generato giornalmente viene codificato in vettori MinHash. La <a href="https://milvus.io/docs/v1.1.1/metric.md">distanza di Jaccard</a> viene utilizzata per calcolare la somiglianza tra il vettore MinHash della nuova frase tag e il vettore della frase tag salvata. Se la distanza di Jaccard supera una soglia predefinita, i due set sono considerati simili. Se la soglia di somiglianza è soddisfatta, le nuove frasi possono sfruttare le informazioni semantiche delle incorporazioni precedenti. Secondo i test, una distanza superiore a 0,8 dovrebbe garantire un'accuratezza sufficiente per la maggior parte delle situazioni.</p>
<p>Grazie a questo processo, la conversione giornaliera delle decine di milioni di vettori di cui sopra si riduce da giorni a circa due ore. Anche se altri metodi di memorizzazione dei vettori semantici potrebbero essere più appropriati a seconda dei requisiti specifici del progetto, il calcolo della somiglianza tra due frasi tag utilizzando la distanza di Jaccard in un database Milvus rimane un metodo efficiente e accurato in un'ampia varietà di scenari.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Sohu02_d50fccc538.jpg" alt="Sohu02.jpg" class="doc-image" id="sohu02.jpg" />
   </span> <span class="img-wrapper"> <span>Sohu02.jpg</span> </span></p>
<h2 id="Overcoming-bad-cases-of-short-text-classification" class="common-anchor-header">Superare i "casi negativi" della classificazione dei testi brevi<button data-href="#Overcoming-bad-cases-of-short-text-classification" class="anchor-icon" translate="no">
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
    </button></h2><p>Quando si classifica un testo di notizie, gli articoli brevi hanno meno caratteristiche da estrarre rispetto a quelli più lunghi. Per questo motivo, gli algoritmi di classificazione falliscono quando contenuti di lunghezza diversa vengono sottoposti allo stesso classificatore. Milvus aiuta a risolvere questo problema cercando più informazioni di classificazione di testi lunghi con semantica simile e punteggi affidabili, quindi utilizzando un meccanismo di voto per modificare la classificazione dei testi brevi.</p>
<h3 id="Identifying-and-resolving-misclassified-short-text" class="common-anchor-header">Identificare e risolvere gli errori di classificazione del testo breve</h3><p>La classificazione precisa di ogni articolo di cronaca è fondamentale per fornire raccomandazioni utili sui contenuti. Poiché gli articoli brevi hanno meno caratteristiche, l'applicazione dello stesso classificatore a notizie di lunghezza diversa comporta un tasso di errore più elevato per la classificazione dei testi brevi. L'etichettatura umana è troppo lenta e imprecisa per questo compito, quindi BERT-as-service e Milvus vengono utilizzati per identificare rapidamente i testi brevi mal classificati in lotti, riclassificarli correttamente e utilizzare i lotti di dati come corpus per l'addestramento contro questo problema.</p>
<p>BERT-as-service viene utilizzato per codificare in vettori semantici un numero totale di cinque milioni di articoli di notizie lunghe con un punteggio del classificatore superiore a 0,9. Dopo aver inserito gli articoli di testo lunghi in Milvus, le notizie di testo brevi vengono codificate in vettori semantici. Ogni vettore semantico di notizie brevi viene utilizzato per interrogare il database Milvus e ottenere i primi 20 articoli di notizie lunghe con la più alta somiglianza di coseno con le notizie brevi di destinazione. Se 18 delle 20 notizie lunghe più simili dal punto di vista semantico sembrano rientrare nella stessa classificazione e questa differisce da quella delle notizie brevi interrogate, la classificazione delle notizie brevi è considerata errata e deve essere corretta per allinearsi ai 18 articoli di notizie lunghe.</p>
<p>Questo processo identifica e corregge rapidamente le classificazioni imprecise dei testi brevi. Le statistiche di campionamento casuale mostrano che dopo la correzione delle classificazioni dei testi brevi, l'accuratezza complessiva della classificazione del testo supera il 95%. Sfruttando la classificazione di testi lunghi ad alta affidabilità per correggere la classificazione di testi brevi, la maggior parte dei casi di cattiva classificazione viene corretta in breve tempo. Questo offre anche un buon corpus per l'addestramento di un classificatore di testi brevi.</p>
<p>![Sohu03.jpg](https://assets.zilliz.com/Sohu03_a43074cf5f.jpg "Flowchart of discovery of "bad cases" of short text classification").</p>
<h2 id="Milvus-can-power-real-time-news-content-recommendation-and-more" class="common-anchor-header">Milvus è in grado di fornire raccomandazioni di contenuti giornalistici in tempo reale e altro ancora<button data-href="#Milvus-can-power-real-time-news-content-recommendation-and-more" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus ha migliorato notevolmente le prestazioni in tempo reale del sistema di raccomandazione delle notizie di Sohu e ha anche rafforzato l'efficienza dell'identificazione dei testi brevi mal classificati. Se siete interessati a saperne di più su Milvus e sulle sue varie applicazioni, leggete il nostro blog:</p>
<ul>
<li>Leggete il nostro <a href="https://zilliz.com/blog">blog</a>.</li>
<li>Interagite con la nostra comunità open-source su <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Utilizzate o contribuite al database vettoriale più diffuso al mondo su <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Testate e distribuite rapidamente le applicazioni di intelligenza artificiale con il nostro nuovo <a href="https://github.com/milvus-io/bootcamp">bootcamp</a>.</li>
</ul>
