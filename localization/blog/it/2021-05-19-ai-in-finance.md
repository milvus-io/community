---
id: ai-in-.md
title: >-
  Accelerare l'intelligenza artificiale nella finanza con Milvus, un database
  vettoriale open source
author: milvus
date: 2021-05-19T03:41:20.776Z
desc: >-
  Milvus può essere utilizzato per costruire applicazioni di intelligenza
  artificiale per il settore finanziario, tra cui chatbot, sistemi di
  raccomandazione e altro ancora.
cover: assets.zilliz.com/03_1_1e5aaf7dd1.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/ai-in-finance'
---
<custom-h1>Accelerare l'intelligenza artificiale nella finanza con Milvus, un database vettoriale open-source</custom-h1><p>Le banche e le altre istituzioni finanziarie hanno da tempo adottato il software open-source per l'elaborazione e l'analisi dei big data. Nel 2010, Morgan Stanley ha <a href="https://www.forbes.com/sites/tomgroenfeldt/2012/05/30/morgan-stanley-takes-on-big-data-with-hadoop/?sh=19f4f8cd16db">iniziato a utilizzare</a> il framework open-source Apache Hadoop come parte di un piccolo esperimento. L'azienda aveva difficoltà a scalare i database tradizionali per far fronte agli enormi volumi di dati che i suoi scienziati volevano sfruttare, così ha deciso di esplorare soluzioni alternative. Oggi Hadoop è un punto fermo di Morgan Stanley, e aiuta a gestire qualsiasi cosa, dalla gestione dei dati CRM all'analisi del portafoglio. Altri software di database relazionali open-source come MySQL, MongoDB e PostgreSQL sono stati strumenti indispensabili per dare un senso ai big data nel settore finanziario.</p>
<p>La tecnologia è ciò che dà al settore dei servizi finanziari un vantaggio competitivo e l'intelligenza artificiale (AI) sta rapidamente diventando l'approccio standard per estrarre preziose intuizioni dai big data e analizzare le attività in tempo reale nei settori bancario, della gestione patrimoniale e assicurativo. Utilizzando algoritmi di intelligenza artificiale per convertire dati non strutturati come immagini, audio o video in vettori, un formato di dati numerici leggibili dalla macchina, è possibile eseguire ricerche di somiglianza su enormi set di dati vettoriali da milioni, miliardi o addirittura trilioni. I dati vettoriali sono memorizzati in uno spazio ad alta dimensionalità e i vettori simili vengono trovati utilizzando la ricerca di similarità, che richiede un'infrastruttura dedicata chiamata database vettoriale.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/01_1_cb99f15886.jpg" alt="01 (1).jpg" class="doc-image" id="01-(1).jpg" />
   </span> <span class="img-wrapper"> <span>01 (1).jpg</span> </span></p>
<p><a href="https://github.com/milvus-io/milvus">Milvus</a> è un database vettoriale open-source costruito specificamente per la gestione dei dati vettoriali, il che significa che gli ingegneri e i data scientist possono concentrarsi sulla creazione di applicazioni di IA o sulla conduzione di analisi, invece che sull'infrastruttura di dati sottostante. La piattaforma è stata costruita intorno ai flussi di lavoro per lo sviluppo di applicazioni di IA ed è ottimizzata per semplificare le operazioni di apprendimento automatico (MLOps). Per maggiori informazioni su Milvus e sulla sua tecnologia di base, consultate il nostro <a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">blog</a>.</p>
<p>Le applicazioni più comuni dell'IA nel settore dei servizi finanziari comprendono il trading algoritmico, la composizione e l'ottimizzazione del portafoglio, la convalida dei modelli, il backtesting, la consulenza robotizzata, gli assistenti virtuali ai clienti, l'analisi dell'impatto del mercato, la conformità normativa e gli stress test. Questo articolo tratta di tre aree specifiche in cui i dati vettoriali vengono sfruttati come una delle risorse più preziose per le società bancarie e finanziarie:</p>
<ol>
<li>Migliorare l'esperienza dei clienti con i chatbot bancari</li>
<li>Aumentare le vendite di servizi finanziari e altro ancora con i sistemi di raccomandazione</li>
<li>Analizzare le relazioni sugli utili e altri dati finanziari non strutturati con il text mining semantico.</li>
</ol>
<p><br/></p>
<h3 id="Enhancing-customer-experience-with-banking-chatbots" class="common-anchor-header">Migliorare l'esperienza dei clienti con i chatbot bancari</h3><p>I chatbot bancari possono migliorare l'esperienza dei clienti aiutandoli a scegliere investimenti, prodotti bancari e polizze assicurative. I servizi digitali stanno aumentando rapidamente di popolarità, in parte a causa delle tendenze accelerate dalla pandemia di coronavirus. I chatbot funzionano utilizzando l'elaborazione del linguaggio naturale (NLP) per convertire le domande inviate dagli utenti in vettori semantici per la ricerca di risposte corrispondenti. I moderni chatbot bancari offrono un'esperienza naturale e personalizzata agli utenti e parlano con un tono colloquiale. Milvus offre un data fabric adatto alla creazione di chatbot che utilizzano la ricerca di similarità vettoriale in tempo reale.</p>
<p>Per saperne di più, consultate la nostra demo che illustra la creazione di <a href="https://zilliz.com/blog/building-intelligent-chatbot-with-nlp-and-milvus">chatbot con Milvus</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/02_1_8c298c45e5.jpg" alt="02 (1).jpg" class="doc-image" id="02-(1).jpg" />
   </span> <span class="img-wrapper"> <span>02 (1).jpg</span> </span></p>
<p><br/></p>
<h4 id="Boosting-financial-services-sales-and-more-with-recommender-systems" class="common-anchor-header">Aumentare le vendite di servizi finanziari e altro con i sistemi di raccomandazione:</h4><p>Il settore del private banking utilizza i sistemi di raccomandazione per aumentare le vendite di prodotti finanziari attraverso raccomandazioni personalizzate basate sui profili dei clienti. I sistemi di raccomandazione possono essere utilizzati anche nella ricerca finanziaria, nelle notizie economiche, nella selezione dei titoli e nei sistemi di supporto al trading. Grazie ai modelli di deep learning, ogni utente e articolo è descritto come un vettore incorporato. Un database vettoriale offre uno spazio di incorporamento in cui è possibile calcolare le somiglianze tra utenti e articoli.</p>
<p>Per saperne di più, consultate la nostra <a href="https://zilliz.com/blog/graph-based-recommendation-system-with-milvus">demo</a> sui sistemi di raccomandazione a grafo con Milvus.</p>
<p><br/></p>
<h4 id="Analyzing-earnings-reports-and-other-unstructured-financial-data-with-semantic-text-mining" class="common-anchor-header">Analizzare le relazioni sugli utili e altri dati finanziari non strutturati con il text mining semantico:</h4><p>Le tecniche di text mining hanno avuto un impatto sostanziale sul settore finanziario. Con la crescita esponenziale dei dati finanziari, il text mining è emerso come un importante campo di ricerca nel settore della finanza.</p>
<p>I modelli di apprendimento profondo sono attualmente applicati per rappresentare i rapporti finanziari attraverso vettori di parole in grado di catturare numerosi aspetti semantici. Un database vettoriale come Milvus è in grado di memorizzare enormi vettori di parole semantiche da milioni di rapporti e di condurre ricerche di similarità su di essi in millisecondi.</p>
<p>Per saperne di più su come <a href="https://medium.com/deepset-ai/semantic-search-with-milvus-knowledge-graph-qa-web-crawlers-and-more-837451eae9fa">utilizzare Haystack di deepset con Milvus</a>.</p>
<p><br/></p>
<h3 id="Don’t-be-a-stranger" class="common-anchor-header">Non essere un estraneo</h3><ul>
<li>Trovate o contribuite a Milvus su <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Interagite con la comunità via <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Connettetevi con noi su <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
