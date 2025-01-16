---
id: build-semantic-search-at-speed-milvus-lucidworks.md
title: Creare una ricerca semantica in velocità
author: Elizabeth Edmiston
date: 2021-04-19T07:32:50.416Z
desc: >-
  Per saperne di più sull'utilizzo delle metodologie di apprendimento automatico
  semantico per ottenere risultati di ricerca più pertinenti in tutta
  l'organizzazione.
cover: assets.zilliz.com/lucidworks_4753c98727.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/build-semantic-search-at-speed-milvus-lucidworks'
---
<custom-h1>Creare una ricerca semantica veloce</custom-h1><p>La<a href="https://lucidworks.com/post/what-is-semantic-search/">ricerca semantica</a> è un ottimo strumento per aiutare i clienti o i dipendenti a trovare i prodotti o le informazioni giuste. Può anche far emergere informazioni difficili da indicizzare per ottenere risultati migliori. Tuttavia, se le metodologie semantiche non vengono impiegate in modo rapido, non serviranno a nulla. Il cliente o il dipendente non se ne starà con le mani in mano mentre il sistema impiega il suo tempo a rispondere alla sua domanda, e probabilmente ne verranno ingerite altre mille nello stesso momento.</p>
<p>Come si può rendere veloce la ricerca semantica? Una ricerca semantica lenta non è sufficiente.</p>
<p>Fortunatamente, questo è il tipo di problema che Lucidworks ama risolvere. Di recente abbiamo testato un cluster di dimensioni modeste - continuate a leggere per maggiori dettagli - che ha ottenuto 1500 RPS (richieste al secondo) su una raccolta di oltre un milione di documenti, con un tempo medio di risposta di circa 40 millisecondi. Questa sì che è velocità.</p>
<p><br/></p>
<h3 id="Implementing-Semantic-Search" class="common-anchor-header">Implementazione della ricerca semantica</h3><p>Per realizzare la magia dell'apprendimento automatico alla velocità della luce, Lucidworks ha implementato la ricerca semantica utilizzando l'approccio della ricerca vettoriale semantica. Ci sono due parti fondamentali.</p>
<p><br/></p>
<h4 id="Part-One-The-Machine-Learning-Model" class="common-anchor-header">Prima parte: il modello di apprendimento automatico</h4><p>Innanzitutto, è necessario un modo per codificare il testo in un vettore numerico. Il testo può essere una descrizione di un prodotto, una query di ricerca dell'utente, una domanda o persino una risposta a una domanda. Un modello di ricerca semantica viene addestrato a codificare il testo in modo che il testo semanticamente simile ad altri sia codificato in vettori numericamente "vicini". Questa fase di codifica deve essere veloce per supportare le migliaia e più di possibili ricerche di clienti o di utenti che arrivano ogni secondo.</p>
<p><br/></p>
<h4 id="Part-Two-The-Vector-Search-Engine" class="common-anchor-header">Parte seconda: il motore di ricerca vettoriale</h4><p>In secondo luogo, è necessario un modo per trovare rapidamente le migliori corrispondenze alla ricerca del cliente o alla query dell'utente. Il modello avrà codificato il testo in un vettore numerico. A questo punto, è necessario confrontarlo con tutti i vettori numerici presenti nel catalogo o negli elenchi di domande e risposte per trovare le migliori corrispondenze, ovvero i vettori più "vicini" al vettore della domanda. A tal fine, è necessario un motore vettoriale in grado di gestire tutte queste informazioni in modo efficace e alla velocità della luce. Il motore potrebbe contenere milioni di vettori e voi volete solo le migliori venti corrispondenze con la vostra domanda. E naturalmente deve gestire un migliaio di query di questo tipo al secondo.</p>
<p>Per affrontare queste sfide, nella <a href="https://lucidworks.com/post/enhance-personalization-efforts-with-new-features-in-fusion/">release Fusion 5.3</a> abbiamo aggiunto il motore di ricerca vettoriale <a href="https://doc.lucidworks.com/fusion/5.3/8821/milvus">Milvus</a>. Milvus è un software open-source ed è veloce. Milvus utilizza FAISS<a href="https://ai.facebook.com/tools/faiss/">(Facebook AI Similarity Search</a>), la stessa tecnologia che Facebook utilizza in produzione per le proprie iniziative di apprendimento automatico. Se necessario, può essere eseguito ancora più velocemente su <a href="https://en.wikipedia.org/wiki/Graphics_processing_unit">GPU</a>. Quando Fusion 5.3 (o superiore) è installato con il componente di apprendimento automatico, Milvus viene automaticamente installato come parte di tale componente, in modo da poter attivare tutte queste funzionalità con facilità.</p>
<p>La dimensione dei vettori in una determinata raccolta, specificata al momento della creazione della raccolta, dipende dal modello che produce tali vettori. Ad esempio, una data collezione potrebbe contenere i vettori creati dalla codifica (tramite un modello) di tutte le descrizioni dei prodotti di un catalogo. Senza un motore di ricerca vettoriale come Milvus, non sarebbe possibile effettuare ricerche di similarità sull'intero spazio vettoriale. Pertanto, le ricerche di similarità dovrebbero essere limitate a candidati preselezionati dallo spazio vettoriale (ad esempio, 500) e avrebbero prestazioni più lente e risultati di qualità inferiore. Milvus è in grado di memorizzare centinaia di miliardi di vettori in più collezioni di vettori per garantire una ricerca veloce e risultati pertinenti.</p>
<p><br/></p>
<h3 id="Using-Semantic-Search" class="common-anchor-header">Uso della ricerca semantica</h3><p>Torniamo al flusso di lavoro della ricerca semantica, ora che abbiamo capito perché Milvus è così importante. La ricerca semantica si articola in tre fasi. Nella prima fase, il modello di apprendimento automatico viene caricato e/o addestrato. Successivamente, i dati vengono indicizzati in Milvus e Solr. La fase finale è quella dell'interrogazione, quando avviene la ricerca vera e propria. Di seguito ci concentreremo su queste ultime due fasi.</p>
<p><br/></p>
<h3 id="Indexing-into-Milvus" class="common-anchor-header">Indicizzazione in Milvus</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_1_47a9221723.png" alt="Lucidworks-1.png" class="doc-image" id="lucidworks-1.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-1.png</span> </span></p>
<p>Come mostrato nel diagramma precedente, la fase di interrogazione inizia in modo simile a quella di indicizzazione, solo che le query arrivano al posto dei documenti. Per ogni interrogazione:</p>
<ol>
<li>La query viene inviata alla pipeline di indicizzazione di <a href="https://lucidworks.com/products/smart-answers/">Smart Answers</a>.</li>
<li>La query viene poi inviata al modello ML.</li>
<li>Il modello ML restituisce un vettore numerico (criptato dalla query). Anche in questo caso, il tipo di modello determina la dimensione del vettore.</li>
<li>Il vettore viene inviato a Milvus, che determina quali vettori, nella collezione Milvus specificata, corrispondono meglio al vettore fornito.</li>
<li>Milvus restituisce un elenco di ID e distanze univoche corrispondenti ai vettori determinati al punto quattro.</li>
<li>Una query contenente tali ID e distanze viene inviata a Solr.</li>
<li>Solr restituisce quindi un elenco ordinato dei documenti associati a tali ID.</li>
</ol>
<p><br/></p>
<h3 id="Scale-Testing" class="common-anchor-header">Test di scala</h3><p>Per dimostrare che i nostri flussi di ricerca semantica funzionano con l'efficienza richiesta dai nostri clienti, abbiamo eseguito dei test di scala utilizzando gli script Gatling su Google Cloud Platform, utilizzando un cluster Fusion con otto repliche del modello ML, otto repliche del servizio di query e una singola istanza di Milvus. I test sono stati eseguiti utilizzando gli indici Milvus FLAT e HNSW. L'indice FLAT ha un richiamo del 100%, ma è meno efficiente, tranne quando i set di dati sono piccoli. L'indice HNSW (Hierarchical Small World Graph) offre ancora risultati di alta qualità e migliora le prestazioni su insiemi di dati più grandi.</p>
<p>Vediamo alcuni numeri di un esempio recente:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_2_3162113560.png" alt="Lucidworks-2.png" class="doc-image" id="lucidworks-2.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-2.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_3_3dc17f0ed8.png" alt="Lucidworks-3.png" class="doc-image" id="lucidworks-3.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-3.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Lucidworks_4_8a6edd2f59.png" alt="Lucidworks-4.png" class="doc-image" id="lucidworks-4.png" />
   </span> <span class="img-wrapper"> <span>Lucidworks-4.png</span> </span></p>
<p><br/></p>
<h3 id="Getting-Started" class="common-anchor-header">Come iniziare</h3><p>Le pipeline di <a href="https://lucidworks.com/products/smart-answers/">Smart Answers</a> sono progettate per essere facili da usare. Lucidworks dispone di <a href="https://doc.lucidworks.com/how-to/734/set-up-a-pre-trained-cold-start-model-for-smart-answers">modelli pre-addestrati che sono facili da implementare</a> e che generalmente danno buoni risultati, anche se l'addestramento dei propri modelli, in combinazione con quelli pre-addestrati, offrirà i migliori risultati. Contattateci oggi stesso per sapere come potete implementare queste iniziative nei vostri strumenti di ricerca per ottenere risultati più efficaci e piacevoli.</p>
<blockquote>
<p>Questo blog è stato ripostato da: https://lucidworks.com/post/how-to-build-fast-semantic-search/?utm_campaign=Oktopost-Blog+Posts&amp;utm_medium=organic_social&amp;utm_source=linkedin</p>
</blockquote>
