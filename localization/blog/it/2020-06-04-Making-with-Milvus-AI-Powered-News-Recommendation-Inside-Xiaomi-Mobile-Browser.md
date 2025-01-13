---
id: >-
  Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser.md
title: >-
  Realizzare con Milvus una raccomandazione di notizie alimentata
  dall'intelligenza artificiale all'interno del browser mobile di Xiaomi
author: milvus
date: 2020-06-04T02:30:34.750Z
desc: >-
  Scoprite come Xiaomi ha sfruttato l'intelligenza artificiale e Milvus per
  costruire un sistema intelligente di raccomandazione delle notizie in grado di
  trovare i contenuti più rilevanti per gli utenti del suo browser web mobile.
cover: assets.zilliz.com/blog_Sohu_News_dec53d0814.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Making-with-Milvus-AI-Powered-News-Recommendation-Inside-Xiaomi-Mobile-Browser
---
<custom-h1>Making with Milvus: raccomandazione di notizie alimentata dall'intelligenza artificiale all'interno del browser mobile di Xiaomi</custom-h1><p>Dai feed dei social media alle raccomandazioni di playlist su Spotify, l'<a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">intelligenza artificiale</a> svolge già un ruolo importante nei contenuti che vediamo e con cui interagiamo ogni giorno. Nel tentativo di differenziare il proprio browser mobile, la multinazionale dell'elettronica Xiaomi ha creato un motore di raccomandazione di notizie alimentato dall'intelligenza artificiale. <a href="https://milvus.io/">Milvus</a>, un database vettoriale open-source costruito appositamente per la ricerca di similarità e l'intelligenza artificiale, è stato utilizzato come piattaforma di gestione dei dati di base dell'applicazione. Questo articolo spiega come Xiaomi ha costruito il suo motore di raccomandazione di notizie alimentato dall'intelligenza artificiale e come sono stati utilizzati Milvus e altri algoritmi di intelligenza artificiale.</p>
<p><br/></p>
<h3 id="Using-AI-to-suggest-personalized-content-and-cut-through-news-noise" class="common-anchor-header">Usare l'intelligenza artificiale per suggerire contenuti personalizzati e tagliare il rumore delle notizie</h3><p>Con il New York Times che da solo pubblica oltre <a href="https://www.theatlantic.com/technology/archive/2016/05/how-many-stories-do-newspapers-publish-per-day/483845/">230</a> contenuti al giorno, la mole di articoli prodotti rende impossibile una visione completa di tutte le notizie. Per aiutarci a vagliare i grandi volumi di contenuti e a consigliare i pezzi più rilevanti o interessanti, ci rivolgiamo sempre più spesso all'intelligenza artificiale. Sebbene le raccomandazioni siano ancora lontane dall'essere perfette, l'apprendimento automatico è sempre più necessario per tagliare il flusso costante di nuove informazioni che si riversano nel nostro mondo sempre più complesso e interconnesso.</p>
<p>Xiaomi produce e investe in smartphone, applicazioni mobili, computer portatili, elettrodomestici e molti altri prodotti. Nel tentativo di differenziare il browser mobile preinstallato su molti degli oltre 40 milioni di smartphone che l'azienda vende ogni trimestre, Xiaomi ha integrato un sistema di raccomandazione delle notizie. Quando gli utenti avviano il browser mobile di Xiaomi, l'intelligenza artificiale viene utilizzata per raccomandare contenuti simili in base alla cronologia delle ricerche dell'utente, agli interessi e altro ancora. Milvus è un database di ricerca vettoriale di similarità open-source utilizzato per accelerare il recupero di articoli correlati.</p>
<p><br/></p>
<h3 id="How-does-AI-powered-content-recommendation-work" class="common-anchor-header">Come funziona la raccomandazione di contenuti basata sull'intelligenza artificiale?</h3><p>La raccomandazione di notizie (o qualsiasi altro tipo di sistema di raccomandazione di contenuti) consiste nel confrontare i dati in ingresso con un enorme database per trovare informazioni simili. Per avere successo nella raccomandazione di contenuti è necessario bilanciare la pertinenza con la tempestività e incorporare in modo efficiente enormi volumi di nuovi dati, spesso in tempo reale.</p>
<p>Per far fronte a enormi insiemi di dati, i sistemi di raccomandazione sono tipicamente divisi in due fasi:</p>
<ol>
<li><strong>Recupero</strong>: Durante il recupero, il contenuto viene ristretto dalla libreria più ampia in base agli interessi e al comportamento dell'utente. Nel browser mobile di Xiaomi, migliaia di contenuti vengono selezionati da un enorme set di dati che contiene milioni di articoli di notizie.</li>
<li><strong>Ordinamento</strong>: Successivamente, i contenuti selezionati durante il recupero vengono ordinati in base a determinati indicatori prima di essere inviati all'utente. Man mano che gli utenti interagiscono con i contenuti raccomandati, il sistema si adatta in tempo reale per fornire suggerimenti più pertinenti.</li>
</ol>
<p>Le raccomandazioni di contenuti di notizie devono essere fatte in tempo reale, in base al comportamento dell'utente e ai contenuti pubblicati di recente. Inoltre, i contenuti suggeriti devono corrispondere il più possibile agli interessi dell'utente e all'intento di ricerca.</p>
<p><br/></p>
<h3 id="Milvus-+-BERT--intelligent-content-suggestions" class="common-anchor-header">Milvus + BERT = suggerimenti intelligenti di contenuti</h3><p>Milvus è un database open-source per la ricerca di similarità vettoriali che può essere integrato con modelli di deep learning per alimentare applicazioni che spaziano dall'elaborazione del linguaggio naturale alla verifica dell'identità e molto altro. Milvus indicizza grandi insiemi di dati vettoriali per rendere la ricerca più efficiente e supporta una serie di framework di IA popolari per semplificare il processo di sviluppo di applicazioni di apprendimento automatico. Queste caratteristiche rendono la piattaforma ideale per l'archiviazione e l'interrogazione di dati vettoriali, una componente critica di molte applicazioni di apprendimento automatico.</p>
<p>Xiaomi ha scelto Milvus per gestire i dati vettoriali per il suo sistema di raccomandazione intelligente di notizie perché è veloce, affidabile e richiede una configurazione e una manutenzione minime. Tuttavia, Milvus deve essere abbinato a un algoritmo di intelligenza artificiale per creare applicazioni implementabili. Xiaomi ha scelto BERT, acronimo di Bidirectional Encoder Representation Transformers, come modello di rappresentazione del linguaggio nel suo motore di raccomandazione. BERT può essere utilizzato come modello NLU (Natural Language Understanding) generale, in grado di gestire diverse attività NLP (Natural Language Processing). Le sue caratteristiche principali sono:</p>
<ul>
<li>Il trasformatore di BERT è utilizzato come struttura principale dell'algoritmo ed è in grado di catturare relazioni esplicite e implicite all'interno e tra le frasi.</li>
<li>Obiettivi di apprendimento multi-task, modellazione del linguaggio mascherato (MLM) e previsione della frase successiva (NSP).</li>
<li>BERT si comporta meglio con grandi quantità di dati e può migliorare altre tecniche di elaborazione del linguaggio naturale, come Word2Vec, agendo come matrice di conversione.</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_1_6301344312.jpeg" alt="Blog_Xiaomi_1.jpeg" class="doc-image" id="blog_xiaomi_1.jpeg" />
   </span> <span class="img-wrapper"> <span>Blog_Xiaomi_1.jpeg</span> </span></p>
<p><br/></p>
<p>L'architettura della rete BERT utilizza una struttura multistrato a trasformatori che abbandona le tradizionali reti neurali RNN e CNN. Funziona convertendo la distanza tra due parole in qualsiasi posizione in una sola attraverso il suo meccanismo di attenzione e risolve il problema della dipendenza che persiste da tempo nell'NLP.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_2_fe5cf2e401.jpeg" alt="Blog-Xiaomi-2.jpeg" class="doc-image" id="blog-xiaomi-2.jpeg" />
   </span> <span class="img-wrapper"> <span>Blog-Xiaomi-2.jpeg</span> </span></p>
<p><br/></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_3_5d10b51440.jpeg" alt="Blog-Xiaomi-3.jpeg" class="doc-image" id="blog-xiaomi-3.jpeg" />
   </span> <span class="img-wrapper"> <span>Blog-Xiaomi-3.jpeg</span> </span></p>
<p><br/></p>
<p>BERT fornisce un modello semplice e uno complesso. Gli iperparametri corrispondenti sono i seguenti: BERT BASE: L = 12, H = 768, A = 12, parametro totale 110M; BERT LARGE: L = 24, H = 1024, A = 16, il numero totale di parametri è 340M.</p>
<p>Nei suddetti iperparametri, L rappresenta il numero di strati della rete (ovvero il numero di blocchi Transformer), A rappresenta il numero di auto-attenzioni in Multi-Head Attention e la dimensione del filtro è 4H.</p>
<p><br/></p>
<h3 id="Xiaomi’s-content-recommendation-system" class="common-anchor-header">Il sistema di raccomandazione dei contenuti di Xiaomi</h3><p>Il sistema di raccomandazione delle notizie basato sul browser di Xiaomi si basa su tre componenti chiave: la vettorizzazione, la mappatura degli ID e il servizio approximate nearest neighbor (ANN).</p>
<p>La vettorizzazione è un processo in cui i titoli degli articoli vengono convertiti in vettori di frasi generali. Il modello SimBert, basato su BERT, è utilizzato nel sistema di raccomandazione di Xiaomi. SimBert è un modello a 12 strati con una dimensione nascosta di 768. Simbert utilizza il modello di addestramento cinese L-12_H-768_A-12 per l'addestramento continuo (il compito di addestramento è "metric learning +UniLM", e ha addestrato 1,17 milioni di passi su un signle TITAN RTX con l'ottimizzatore Adam (tasso di apprendimento 2e-6, dimensione del batch 128). In poche parole, si tratta di un modello BERT ottimizzato.</p>
<p>Gli algoritmi ANN confrontano i titoli degli articoli vettorializzati con l'intera libreria di notizie archiviata in Milvus, quindi restituiscono agli utenti contenuti simili. La mappatura degli ID viene utilizzata per ottenere informazioni rilevanti come le visualizzazioni di pagina e i clic per gli articoli corrispondenti.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Xiaomi_N1_f4749b3131.jpeg" alt="Blog-Xiaomi-N1.jpeg" class="doc-image" id="blog-xiaomi-n1.jpeg" />
   </span> <span class="img-wrapper"> <span>Blog-Xiaomi-N1.jpeg</span> </span></p>
<p><br/></p>
<p>I dati memorizzati in Milvus che alimentano il motore di raccomandazione delle notizie di Xiaomi vengono costantemente aggiornati, includendo ulteriori articoli e informazioni sulle attività. Quando il sistema incorpora nuovi dati, quelli vecchi devono essere eliminati. In questo sistema, gli aggiornamenti completi dei dati vengono effettuati per i primi T-1 giorni e gli aggiornamenti incrementali vengono effettuati nei successivi T giorni.</p>
<p>A intervalli definiti, i vecchi dati vengono cancellati e i dati elaborati dei T-1 giorni vengono inseriti nella raccolta. In questo caso, i nuovi dati generati vengono incorporati in tempo reale. Una volta inseriti i nuovi dati, viene condotta una ricerca di similarità in Milvus. Gli articoli recuperati vengono nuovamente ordinati in base al tasso di clic e ad altri fattori e i contenuti migliori vengono mostrati agli utenti. In uno scenario come questo, in cui i dati vengono aggiornati frequentemente e i risultati devono essere forniti in tempo reale, la capacità di Milvus di incorporare e ricercare rapidamente nuovi dati consente di accelerare drasticamente la raccomandazione di contenuti giornalistici nel browser mobile di Xiaomi.</p>
<p><br/></p>
<h3 id="Milvus-makes-vector-similarity-search-better" class="common-anchor-header">Milvus migliora la ricerca per similarità vettoriale</h3><p>La vettorializzazione dei dati e il successivo calcolo della somiglianza tra vettori è la tecnologia di recupero più comunemente utilizzata. L'ascesa dei motori di ricerca di similarità vettoriale basati su RNA ha migliorato notevolmente l'efficienza dei calcoli di similarità vettoriale. Rispetto a soluzioni simili, Milvus offre una memorizzazione ottimizzata dei dati, numerosi SDK e una versione distribuita che riduce notevolmente il carico di lavoro per la creazione di un livello di recupero. Inoltre, l'attiva comunità open-source di Milvus è una risorsa potente che può aiutare a rispondere alle domande e a risolvere i problemi che si presentano.</p>
<p>Se volete saperne di più sulla ricerca per similarità vettoriale e su Milvus, consultate le seguenti risorse:</p>
<ul>
<li>Scoprite <a href="https://github.com/milvus-io/milvus">Milvus</a> su Github.</li>
<li><a href="https://zilliz.com/blog/Vector-Similarity-Search-Hides-in-Plain-View">La ricerca per similarità vettoriale si nasconde in bella vista</a></li>
<li><a href="https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing">Accelerazione della ricerca per similarità su dati molto grandi con l'indicizzazione vettoriale</a></li>
</ul>
<p>Leggete altre <a href="https://zilliz.com/user-stories">storie di utenti per</a> saperne di più sulla creazione di oggetti con Milvus.</p>
