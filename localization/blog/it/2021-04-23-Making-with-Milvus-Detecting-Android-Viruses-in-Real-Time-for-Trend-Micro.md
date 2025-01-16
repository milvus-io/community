---
id: Making-with-Milvus-Detecting-Android-Viruses-in-Real-Time-for-Trend-Micro.md
title: >-
  Realizzazione con Milvus Rilevamento di virus Android in tempo reale per Trend
  Micro
author: milvus
date: 2021-04-23T06:46:13.732Z
desc: >-
  Scoprite come Milvus viene utilizzato per mitigare le minacce ai dati critici
  e rafforzare la sicurezza informatica con il rilevamento dei virus in tempo
  reale.
cover: assets.zilliz.com/blog_Trend_Micro_5c8ba3e2ce.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-with-Milvus-Detecting-Android-Viruses-in-Real-Time-for-Trend-Micro
---
<custom-h1>Realizzazione con Milvus: rilevamento di virus Android in tempo reale per Trend Micro</custom-h1><p>La sicurezza informatica rimane una minaccia persistente sia per i privati che per le aziende, con l'aumento delle preoccupazioni sulla privacy dei dati per l'<a href="https://www.getapp.com/resources/annual-data-security-report/">86% delle aziende</a> nel 2020 e solo <a href="https://merchants.fiserv.com/content/dam/firstdata/us/en/documents/pdf/digital-commerce-cybersecurity-ebook.pdf">il 23% dei consumatori</a> che ritiene che i propri dati personali siano molto sicuri. Poiché le minacce informatiche diventano sempre più onnipresenti e sofisticate, un approccio proattivo al rilevamento delle minacce è diventato essenziale. <a href="https://www.trendmicro.com/en_us/business.html">Trend Micro</a> è leader mondiale nella sicurezza del cloud ibrido, nella difesa della rete, nella sicurezza delle piccole imprese e nella sicurezza degli endpoint. Per proteggere i dispositivi Android dai virus, l'azienda ha creato Trend Micro Mobile Security, un'applicazione mobile che confronta gli APK (Android Application Package) del Google Play Store con un database di malware noti. Il sistema di rilevamento dei virus funziona come segue:</p>
<ul>
<li>Gli APK (pacchetti di applicazioni Android) esterni del Google Play Store vengono scansionati.</li>
<li>Il malware noto viene convertito in vettori e memorizzato in <a href="https://www.milvus.io/docs/v1.0.0/overview.md">Milvus</a>.</li>
<li>Anche i nuovi APK vengono convertiti in vettori e poi confrontati con il database del malware utilizzando la ricerca di similarità.</li>
<li>Se un vettore APK è simile a uno qualsiasi dei vettori di malware, l'applicazione fornisce agli utenti informazioni dettagliate sul virus e sul suo livello di minaccia.</li>
</ul>
<p>Per funzionare, il sistema deve eseguire una ricerca di similarità altamente efficiente su enormi set di dati di vettori in tempo reale. Inizialmente, Trend Micro utilizzava <a href="https://www.mysql.com/">MySQL</a>. Tuttavia, con l'espandersi dell'attività, è cresciuto anche il numero di APK con codice nocivo memorizzati nel database. Il team di algoritmi dell'azienda ha iniziato a cercare soluzioni alternative per la ricerca di somiglianze vettoriali dopo aver rapidamente superato MySQL.</p>
<p><br/></p>
<h3 id="Comparing-vector-similarity-search-solutions" class="common-anchor-header">Soluzioni di ricerca per similarità vettoriale a confronto</h3><p>Esistono diverse soluzioni di ricerca per similarità vettoriale, molte delle quali sono open source. Anche se le circostanze variano da progetto a progetto, la maggior parte degli utenti trae vantaggio dall'utilizzo di un database vettoriale costruito per l'elaborazione e l'analisi dei dati non strutturati, piuttosto che da una semplice libreria che richiede una configurazione estesa. Di seguito mettiamo a confronto alcune popolari soluzioni di ricerca per similarità vettoriale e spieghiamo perché Trend Micro ha scelto Milvus.</p>
<h4 id="Faiss" class="common-anchor-header">Faiss</h4><p><a href="https://ai.facebook.com/tools/faiss/">Faiss</a> è una libreria sviluppata da Facebook AI Research che consente una ricerca efficiente della somiglianza e il raggruppamento di vettori densi. Gli algoritmi in essa contenuti cercano vettori di qualsiasi dimensione in insiemi. Faiss è scritta in C++ con wrapper per Python/numpy e supporta una serie di indici, tra cui IndexFlatL2, IndexFlatIP, HNSW e IVF.</p>
<p>Sebbene Faiss sia uno strumento incredibilmente utile, ha dei limiti. Funziona solo come libreria di algoritmi di base, non come database per la gestione di insiemi di dati vettoriali. Inoltre, non offre una versione distribuita, servizi di monitoraggio, SDK o alta disponibilità, che sono le caratteristiche principali della maggior parte dei servizi basati su cloud.</p>
<h4 id="Plug-ins-based-on-Faiss--other-ANN-search-libraries" class="common-anchor-header">Plug-in basati su Faiss e altre librerie di ricerca ANN</h4><p>Esistono diversi plug-in costruiti sulla base di Faiss, NMSLIB e altre librerie di ricerca ANN, progettati per migliorare le funzionalità di base dello strumento che li alimenta. Elasticsearch (ES) è un motore di ricerca basato sulla libreria Lucene con una serie di plugin di questo tipo. Di seguito è riportato un diagramma dell'architettura di un plug-in ES:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_3ce4e516c3.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>Il supporto integrato per i sistemi distribuiti è uno dei principali vantaggi di una soluzione ES. Ciò fa risparmiare tempo agli sviluppatori e denaro alle aziende, grazie al codice che non deve essere scritto. I plug-in ES sono tecnicamente avanzati e molto diffusi. Elasticsearch fornisce un QueryDSL (linguaggio specifico per il dominio), che definisce le query basate su JSON ed è di facile comprensione. Un set completo di servizi ES consente di effettuare ricerche vettoriali/testuali e di filtrare contemporaneamente dati scalari.</p>
<p>Amazon, Alibaba e Netease sono alcune grandi aziende tecnologiche che attualmente si affidano ai plug-in Elasticsearch per la ricerca di similarità vettoriali. I principali svantaggi di questa soluzione sono l'elevato consumo di memoria e l'assenza di supporto per la regolazione delle prestazioni. <a href="http://jd.com/">JD.com</a> ha invece sviluppato una propria soluzione distribuita basata su Faiss, chiamata <a href="https://github.com/vearch/vearch">Vearch</a>. Tuttavia, Vearch è ancora un progetto in fase di incubazione e la sua comunità open-source è relativamente poco attiva.</p>
<h4 id="Milvus" class="common-anchor-header">Milvus</h4><p><a href="https://www.milvus.io/">Milvus</a> è un database vettoriale open-source creato da <a href="https://zilliz.com">Zilliz</a>. È altamente flessibile, affidabile e velocissimo. Incapsulando diverse librerie di indici ampiamente adottate, come Faiss, NMSLIB e Annoy, Milvus fornisce una serie completa di API intuitive, che consentono agli sviluppatori di scegliere il tipo di indice ideale per il loro scenario. Offre inoltre soluzioni distribuite e servizi di monitoraggio. Milvus ha una comunità open-source molto attiva e oltre 5.5K stelle su <a href="https://github.com/milvus-io/milvus">Github</a>.</p>
<h4 id="Milvus-bests-the-competition" class="common-anchor-header">Milvus batte la concorrenza</h4><p>Abbiamo raccolto una serie di risultati di test diversi dalle varie soluzioni di ricerca per similarità vettoriale menzionate in precedenza. Come si può vedere nella seguente tabella di confronto, Milvus è risultato significativamente più veloce della concorrenza, nonostante sia stato testato su un set di dati di 1 miliardo di vettori a 128 dimensioni.</p>
<table>
<thead>
<tr><th style="text-align:left"><strong>Motore</strong></th><th style="text-align:left"><strong>Prestazioni (ms)</strong></th><th style="text-align:left"><strong>Dimensione del set di dati (milioni)</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:left">ES</td><td style="text-align:left">600</td><td style="text-align:left">1</td></tr>
<tr><td style="text-align:left">ES + Alibaba Cloud</td><td style="text-align:left">900</td><td style="text-align:left">20</td></tr>
<tr><td style="text-align:left">Milvus</td><td style="text-align:left">27</td><td style="text-align:left">1000+</td></tr>
<tr><td style="text-align:left">SPTAG</td><td style="text-align:left">Non buono</td><td style="text-align:left"></td></tr>
<tr><td style="text-align:left">ES + nmslib, faiss</td><td style="text-align:left">90</td><td style="text-align:left">150</td></tr>
</tbody>
</table>
<h6 id="A-comparison-of-vector-similarity-search-solutions" class="common-anchor-header"><em>Un confronto tra le soluzioni di ricerca per similarità vettoriale.</em></h6><p>Dopo aver valutato i pro e i contro di ogni soluzione, Trend Micro ha scelto Milvus per il suo modello di ricerca vettoriale. Grazie alle prestazioni eccezionali su insiemi di dati massicci e su scala miliardaria, è ovvio che l'azienda abbia scelto Milvus per un servizio di sicurezza mobile che richiede una ricerca di similarità vettoriale in tempo reale.</p>
<p><br/></p>
<h3 id="Designing-a-system-for-real-time-virus-detection" class="common-anchor-header">Progettazione di un sistema per il rilevamento dei virus in tempo reale</h3><p>Trend Micro ha più di 10 milioni di APK dannosi memorizzati nel suo database MySQL, con 100.000 nuovi APK aggiunti ogni giorno. Il sistema funziona estraendo e calcolando i valori Thash dei diversi componenti di un file APK, quindi utilizza l'algoritmo Sha256 per trasformarlo in file binari e generare valori Sha256 a 256 bit che differenziano l'APK dagli altri. Poiché i valori Sha256 variano con i file APK, un APK può avere un valore Thash combinato e un valore Sha256 unico.</p>
<p>I valori Sha256 sono utilizzati solo per differenziare gli APK, mentre i valori Thash sono utilizzati per il recupero della somiglianza vettoriale. APK simili possono avere gli stessi valori Thash ma valori Sha256 diversi.</p>
<p>Per rilevare gli APK con codice nocivo, Trend Micro ha sviluppato un proprio sistema per recuperare i valori Thash simili e i corrispondenti valori Sha256. Trend Micro ha scelto Milvus per condurre una ricerca di somiglianza vettoriale istantanea su enormi set di dati vettoriali convertiti da valori Thash. Dopo l'esecuzione della ricerca di similarità, i valori Sha256 corrispondenti vengono interrogati in MySQL. All'architettura è stato aggiunto anche un livello di caching Redis per mappare i valori Thash in valori Sha256, riducendo in modo significativo i tempi di interrogazione.</p>
<p>Di seguito è riportato il diagramma dell'architettura del sistema di sicurezza mobile di Trend Micro.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_20210118_022039_ae824b663c.png" alt="image-20210118-022039.png" class="doc-image" id="image-20210118-022039.png" />
   </span> <span class="img-wrapper"> <span>image-20210118-022039.png</span> </span></p>
<p><br/></p>
<p>La scelta di una metrica di distanza appropriata aiuta a migliorare le prestazioni di classificazione e clustering dei vettori. La tabella seguente mostra le <a href="https://www.milvus.io/docs/v1.0.0/metric.md#binary">metriche di distanza</a> e gli indici corrispondenti che funzionano con vettori binari.</p>
<table>
<thead>
<tr><th><strong>Metriche di distanza</strong></th><th><strong>Tipi di indici</strong></th></tr>
</thead>
<tbody>
<tr><td>- Jaccard <br/> - Tanimoto <br/> - Hamming</td><td>- PIATTO <br/> - IVF_FLAT</td></tr>
<tr><td>- Sovrastruttura <br/> - Sottostruttura</td><td>PIATTO</td></tr>
</tbody>
</table>
<h6 id="Distance-metrics-and-indexes-for-binary-vectors" class="common-anchor-header"><em>Metriche di distanza e indici per vettori binari.</em></h6><p><br/></p>
<p>Trend Micro converte i valori Thash in vettori binari e li archivia in Milvus. Per questo scenario, Trend Micro utilizza la distanza di Hamming per confrontare i vettori.</p>
<p>Milvus supporterà presto l'ID del vettore in stringa e gli ID interi non dovranno essere mappati al nome corrispondente in formato stringa. Ciò rende superfluo il livello di caching Redis e l'architettura del sistema meno ingombrante.</p>
<p>Trend Micro adotta una soluzione basata sul cloud e distribuisce molte attività su <a href="https://kubernetes.io/">Kubernetes</a>. Per ottenere l'alta disponibilità, Trend Micro utilizza <a href="https://www.milvus.io/docs/v1.0.0/mishards.md">Mishards</a>, un middleware di sharding per cluster Milvus sviluppato in Python.</p>
<p>![image-20210118-022104.png](https://assets.zilliz.com/image_20210118_022104_3001950ee8.png &quot;Mishards architecture in Milvus.)</p>
<p><br/></p>
<p>Trend Micro separa l'archiviazione e il calcolo della distanza memorizzando tutti i vettori nell'<a href="https://aws.amazon.com/efs/">EFS</a> (Elastic File System) fornito da <a href="https://aws.amazon.com/">AWS</a>. Questa pratica è una tendenza popolare nel settore. Kubernetes viene utilizzato per avviare più nodi di lettura e sviluppa servizi LoadBalancer su questi nodi di lettura per garantire un'elevata disponibilità.</p>
<p>Per mantenere la coerenza dei dati, Mishards supporta un solo nodo di scrittura. Tuttavia, nei prossimi mesi sarà disponibile una versione distribuita di Milvus con supporto per più nodi di scrittura.</p>
<p><br/></p>
<h3 id="Monitoring-and-Alert-Functions" class="common-anchor-header">Funzioni di monitoraggio e di allarme</h3><p>Milvus è compatibile con i sistemi di monitoraggio basati su <a href="https://prometheus.io/">Prometheus</a> e utilizza <a href="https://grafana.com/">Grafana</a>, una piattaforma open-source per l'analisi delle serie temporali, per visualizzare varie metriche delle prestazioni.</p>
<p>Prometheus monitora e memorizza le seguenti metriche:</p>
<ul>
<li>Metriche delle prestazioni di Milvus, tra cui velocità di inserimento, velocità di interrogazione e tempo di attività di Milvus.</li>
<li>Metriche delle prestazioni del sistema, tra cui l'utilizzo della CPU/GPU, il traffico di rete e la velocità di accesso al disco.</li>
<li>Metriche di archiviazione hardware, tra cui la dimensione dei dati e il numero totale di file.</li>
</ul>
<p>Il sistema di monitoraggio e di allarme funziona come segue:</p>
<ul>
<li>Un client Milvus invia dati metrici personalizzati a Pushgateway.</li>
<li>Pushgateway assicura che i dati metrici effimeri e di breve durata siano inviati in modo sicuro a Prometheus.</li>
<li>Prometheus continua a prelevare i dati da Pushgateway.</li>
<li>Alertmanager imposta la soglia di allarme per diverse metriche e lancia allarmi tramite e-mail o messaggi.</li>
</ul>
<p><br/></p>
<h3 id="System-Performance" class="common-anchor-header">Prestazioni del sistema</h3><p>Sono passati un paio di mesi dal lancio del servizio ThashSearch costruito su Milvus. Il grafico sottostante mostra che la latenza delle query end-to-end è inferiore a 95 millisecondi.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_20210118_022116_a0c735ce20.png" alt="image-20210118-022116.png" class="doc-image" id="image-20210118-022116.png" />
   </span> <span class="img-wrapper"> <span>image-20210118-022116.png</span> </span></p>
<p><br/></p>
<p>Anche l'inserimento è veloce. Ci vogliono circa 10 secondi per inserire 3 milioni di vettori a 192 dimensioni. Con l'aiuto di Milvus, le prestazioni del sistema sono riuscite a soddisfare i criteri di performance stabiliti da Trend Micro.</p>
<p><br/></p>
<h3 id="Don’t-be-a-stranger" class="common-anchor-header">Non essere un estraneo</h3><ul>
<li>Trovate o contribuite a Milvus su <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
<li>Interagite con la comunità via <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Collegatevi con noi su <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
