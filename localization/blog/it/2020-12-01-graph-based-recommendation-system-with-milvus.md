---
id: graph-based-recommendation-system-with-milvus.md
title: Come funzionano i sistemi di raccomandazione?
author: Shiyu Chen
date: 2020-12-01T21:41:08.582Z
desc: >-
  I sistemi di raccomandazione possono generare ricavi, ridurre i costi e
  offrire un vantaggio competitivo. Scoprite come costruirne uno gratuitamente
  con strumenti open-source.
cover: >-
  assets.zilliz.com/thisisengineering_raeng_z3c_Mj_I6k_P_I_unsplash_2228b9411c.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/graph-based-recommendation-system-with-milvus'
---
<custom-h1>Costruire un sistema di raccomandazione basato su grafi con i dataset di Milvus, PinSage, DGL e MovieLens</custom-h1><p>I sistemi di raccomandazione sono alimentati da algoritmi che hanno avuto <a href="https://www.npr.org/2021/06/03/1002772749/the-rise-of-recommendation-systems-how-machines-figure-out-the-things-we-want">inizi umili per</a> aiutare gli esseri umani a setacciare le e-mail indesiderate. Nel 1990, l'inventore Doug Terry utilizzò un algoritmo di filtraggio collaborativo per separare le e-mail desiderabili da quelle indesiderate. Semplicemente "apprezzando" o "odiando" un'e-mail, in collaborazione con altri che facevano la stessa cosa con contenuti simili, gli utenti potevano addestrare rapidamente i computer a determinare cosa far passare nella casella di posta dell'utente e cosa sequestrare nella cartella della posta indesiderata.</p>
<p>In senso generale, i sistemi di raccomandazione sono algoritmi che forniscono suggerimenti pertinenti agli utenti. I suggerimenti possono essere film da guardare, libri da leggere, prodotti da acquistare o qualsiasi altra cosa, a seconda dello scenario o del settore. Questi algoritmi sono ovunque intorno a noi e influenzano i contenuti che consumiamo e i prodotti che acquistiamo da grandi aziende tecnologiche come Youtube, Amazon, Netflix e molte altre.</p>
<p>I sistemi di raccomandazione ben progettati possono essere essenziali generatori di reddito, riduttori di costi e differenziatori della concorrenza. Grazie alla tecnologia open-source e alla diminuzione dei costi di calcolo, i sistemi di raccomandazione personalizzati non sono mai stati così accessibili. Questo articolo spiega come utilizzare Milvus, un database vettoriale open-source; PinSage, una rete neurale convoluzionale a grafo (GCN); Deep Graph Library (DGL), un pacchetto python scalabile per l'apprendimento profondo sui grafi; e i dataset di MovieLens per costruire un sistema di raccomandazione a grafo.</p>
<p><strong>Vai a:</strong></p>
<ul>
<li><a href="#how-do-recommendation-systems-work">Come funzionano i sistemi di raccomandazione?</a></li>
<li><a href="#tools-for-building-a-recommender-system">Strumenti per costruire un sistema di raccomandazione</a></li>
<li><a href="#building-a-graph-based-recommender-system-with-milvus">Costruire un sistema di raccomandazione basato su grafi con Milvus</a></li>
</ul>
<h2 id="How-do-recommendation-systems-work" class="common-anchor-header">Come funzionano i sistemi di raccomandazione?<button data-href="#How-do-recommendation-systems-work" class="anchor-icon" translate="no">
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
    </button></h2><p>Esistono due approcci comuni alla costruzione di sistemi di raccomandazione: il filtraggio collaborativo e il filtraggio basato sui contenuti. La maggior parte degli sviluppatori utilizza uno o entrambi i metodi e, anche se i sistemi di raccomandazione possono variare in termini di complessità e costruzione, in genere includono tre elementi fondamentali:</p>
<ol>
<li><strong>Modello dell'utente:</strong> I sistemi di raccomandazione richiedono la modellazione delle caratteristiche, delle preferenze e delle esigenze dell'utente. Molti sistemi di raccomandazione basano i loro suggerimenti su input impliciti o espliciti a livello di articolo da parte degli utenti.</li>
<li><strong>Modello degli oggetti:</strong> I sistemi di raccomandazione modellano anche gli oggetti per poterli raccomandare in base alle caratteristiche dell'utente.</li>
<li><strong>Algoritmo di raccomandazione:</strong> Il componente centrale di ogni sistema di raccomandazione è l'algoritmo che ne alimenta le raccomandazioni. Gli algoritmi comunemente utilizzati includono il filtraggio collaborativo, la modellazione semantica implicita, la modellazione basata su grafi, la raccomandazione combinata e altri ancora.</li>
</ol>
<p>Ad alto livello, i sistemi di raccomandazione che si basano sul filtraggio collaborativo costruiscono un modello a partire dal comportamento passato dell'utente (compresi gli input del comportamento di utenti simili) per prevedere ciò a cui un utente potrebbe essere interessato. I sistemi che si basano sul filtraggio dei contenuti utilizzano tag discreti e predefiniti basati sulle caratteristiche degli articoli per raccomandare articoli simili.</p>
<p>Un esempio di filtraggio collaborativo è una stazione radio personalizzata su Spotify, basata sulla cronologia degli ascolti dell'utente, sui suoi interessi, sulla sua libreria musicale e altro ancora. La stazione riproduce musica che l'utente non ha salvato o per la quale non ha espresso interesse, ma che altri utenti con gusti simili hanno spesso ascoltato. Un esempio di filtraggio basato sui contenuti potrebbe essere una stazione radio basata su una canzone o un artista specifico che utilizza gli attributi dell'input per raccomandare musica simile.</p>
<h2 id="Tools-for-building-a-recommender-system" class="common-anchor-header">Strumenti per costruire un sistema di raccomandazione<button data-href="#Tools-for-building-a-recommender-system" class="anchor-icon" translate="no">
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
    </button></h2><p>In questo esempio, la costruzione di un sistema di raccomandazione a grafo da zero dipende dai seguenti strumenti:</p>
<h3 id="Pinsage-A-graph-convolutional-network" class="common-anchor-header">Pinsage: Una rete convoluzionale a grafo</h3><p><a href="https://medium.com/pinterest-engineering/pinsage-a-new-graph-convolutional-neural-network-for-web-scale-recommender-systems-88795a107f48">PinSage</a> è una rete convoluzionale a grafo random-walk in grado di apprendere embeddings per i nodi di grafi su scala web contenenti miliardi di oggetti. La rete è stata sviluppata da <a href="https://www.pinterest.com/">Pinterest</a>, un'azienda di bacheche online, per offrire raccomandazioni visive tematiche ai suoi utenti.</p>
<p>Gli utenti di Pinterest possono "appuntare" i contenuti di loro interesse nelle "bacheche", che sono raccolte di contenuti appuntati. Con oltre <a href="https://business.pinterest.com/audience/">478 milioni di</a> utenti attivi mensili (MAU) e più di <a href="https://newsroom.pinterest.com/en/company">240 miliardi di</a> oggetti salvati, l'azienda dispone di un'immensa quantità di dati degli utenti, che deve gestire con una nuova tecnologia.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_742d28f7a9.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p>PinSage utilizza grafi bipartiti pins-boards per generare embeddings di alta qualità dai pins, utilizzati per raccomandare agli utenti contenuti visivamente simili. A differenza degli algoritmi GCN tradizionali, che eseguono convoluzioni sulle matrici di caratteristiche e sull'intero grafo, PinSage campiona i nodi/pin vicini ed esegue convoluzioni locali più efficienti attraverso la costruzione dinamica di grafi computazionali.</p>
<p>L'esecuzione di convoluzioni sull'intero vicinato di un nodo comporta un grafo computazionale enorme. Per ridurre i requisiti di risorse, gli algoritmi GCN tradizionali aggiornano la rappresentazione di un nodo aggregando le informazioni dei suoi k-hop vicini. PinSage simula il random-walk per impostare i contenuti visitati di frequente come quartiere chiave e poi costruisce una convoluzione basata su di essi.</p>
<p>Poiché spesso si verificano sovrapposizioni nei quartieri k-hop, la convoluzione locale sui nodi comporta calcoli ripetuti. Per evitare questo problema, in ogni fase aggregata PinSage mappa tutti i nodi senza ripetere i calcoli, quindi li collega ai corrispondenti nodi di livello superiore e infine recupera gli embeddings dei nodi di livello superiore.</p>
<h3 id="Deep-Graph-Library-A-scalable-python-package-for-deep-learning-on-graphs" class="common-anchor-header">Libreria per grafi profondi: Un pacchetto scalabile in python per il deep learning sui grafi</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/dgl_framework_building_graph_based_recommender_milvus_af62de6dd4.png" alt="dgl-framework-building-graph-based-recommender-milvus.png" class="doc-image" id="dgl-framework-building-graph-based-recommender-milvus.png" />
   </span> <span class="img-wrapper"> <span>dgl-framework-building-graph-based-recommender-milvus.png</span> </span></p>
<p><a href="https://www.dgl.ai/">Deep Graph Library (DGL)</a> è un pacchetto Python progettato per la costruzione di modelli di reti neurali basati su grafi in aggiunta ai framework di deep learning esistenti (ad esempio, PyTorch, MXNet, Gluon e altri). DGL include un'interfaccia di backend facile da usare, che facilita l'impianto in framework basati su tensori e che supportano la generazione automatica. L'algoritmo PinSage citato in precedenza è ottimizzato per l'uso con DGL e PyTorch.</p>
<h3 id="Milvus-An-open-source-vector-database-built-for-AI-and-similarity-search" class="common-anchor-header">Milvus: un database vettoriale open-source costruito per l'IA e la ricerca di similarità</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_does_milvus_work_6926180543.png" alt="how-does-milvus-work.png" class="doc-image" id="how-does-milvus-work.png" />
   </span> <span class="img-wrapper"> <span>come funziona-milvus.png</span> </span></p>
<p>Milvus è un database vettoriale open-source costruito per alimentare la ricerca di similarità vettoriale e le applicazioni di intelligenza artificiale (AI). Ad alto livello, l'uso di Milvus per la ricerca di somiglianze funziona come segue:</p>
<ol>
<li>I modelli di apprendimento profondo vengono utilizzati per convertire i dati non strutturati in vettori di caratteristiche, che vengono importati in Milvus.</li>
<li>Milvus memorizza e indicizza i vettori di caratteristiche.</li>
<li>Su richiesta, Milvus cerca e restituisce i vettori più simili a un vettore di input.</li>
</ol>
<h2 id="Building-a-graph-based-recommendation-system-with-Milvus" class="common-anchor-header">Costruire un sistema di raccomandazione a grafo con Milvus<button data-href="#Building-a-graph-based-recommendation-system-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/beike_intelligent_house_platform_diagram_6e278da118.jpg" alt="beike-intelligent-house-platform-diagram.jpg" class="doc-image" id="beike-intelligent-house-platform-diagram.jpg" />
   </span> <span class="img-wrapper"> <span>beike-intelligent-house-platform-diagram.jpg</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_building_graph_based_recommender_system_bf89770634.png" alt="3-building-graph-based-recommender-system.png" class="doc-image" id="3-building-graph-based-recommender-system.png" />
   </span> <span class="img-wrapper"> <span>3-costruzione di un sistema di raccomandazione a grafo.png</span> </span></p>
<p>La costruzione di un sistema di raccomandazione a grafo con Milvus prevede le seguenti fasi:</p>
<h3 id="Step-1-Preprocess-data" class="common-anchor-header">Passo 1: Preelaborazione dei dati</h3><p>La preelaborazione dei dati consiste nel trasformare i dati grezzi in un formato più facilmente comprensibile. Questo esempio utilizza i set di dati aperti MovieLens[5] (m1-1m), che contengono 1.000.000 di valutazioni di 4.000 film fornite da 6.000 utenti. Questi dati sono stati raccolti da GroupLens e comprendono le descrizioni dei film, le valutazioni dei film e le caratteristiche degli utenti.</p>
<p>Si noti che i set di dati MovieLens utilizzati in questo esempio richiedono una pulizia o un'organizzazione minima dei dati. Tuttavia, se si utilizzano set di dati diversi, il chilometraggio può variare.</p>
<p>Per iniziare a costruire un sistema di raccomandazione, costruire un grafo bipartito utente-film per scopi di classificazione utilizzando i dati storici degli utenti-film dal set di dati MovieLens.</p>
<pre><code translate="no">graph_builder = PandasGraphBuilder()
graph_builder.add_entities(users, 'user_id', 'user')
graph_builder.add_entities(movies_categorical, 'movie_id', 'movie')
graph_builder.add_binary_relations(ratings, 'user_id', 'movie_id', 'watched')
graph_builder.add_binary_relations(ratings, 'movie_id', 'user_id', 'watched-by')
g = graph_builder.build()
</code></pre>
<h3 id="Step-2-Train-model-with-PinSage" class="common-anchor-header">Fase 2: addestramento del modello con PinSage</h3><p>I vettori di incorporamento dei pin generati con il modello PinSage sono vettori di caratteristiche delle informazioni sui film acquisite. Creare un modello PinSage basato sul grafo bipartito g e sulle dimensioni personalizzate dei vettori delle caratteristiche dei film (256-d per impostazione predefinita). Quindi, addestrare il modello con PyTorch per ottenere le incorporazioni h_item di 4.000 film.</p>
<pre><code translate="no"># Define the model
model = PinSAGEModel(g, item_ntype, textset, args.hidden_dims, args.num_layers).to(device)
opt = torch.optim.Adam(model.parameters(), lr=args.lr)
# Get the item embeddings
for blocks in dataloader_test:
   for i in range(len(blocks)):
   blocks[i] = blocks[i].to(device)
   h_item_batches.append(model.get_repr(blocks))
h_item = torch.cat(h_item_batches, 0)
</code></pre>
<h3 id="Step-3-Load-data" class="common-anchor-header">Fase 3: caricamento dei dati</h3><p>Caricare le incorporazioni h_item dei film generate dal modello PinSage in Milvus, che restituirà gli ID corrispondenti. Importare gli ID e le informazioni sui film corrispondenti in MySQL.</p>
<pre><code translate="no"># Load data to Milvus and MySQL
status, ids = milvus.insert(milvus_table, h_item)
load_movies_to_mysql(milvus_table, ids_info)
</code></pre>
<h3 id="Step-4-Conduct-vector-similarity-search" class="common-anchor-header">Fase 4: condurre una ricerca di similarità vettoriale</h3><p>Ottenere gli embeddings corrispondenti in Milvus in base agli ID dei film, quindi utilizzare Milvus per eseguire una ricerca di similarità con questi embeddings. Quindi, identificare le informazioni sui film corrispondenti in un database MySQL.</p>
<pre><code translate="no"># Get embeddings that users like
_, user_like_vectors = milvus.get_entity_by_id(milvus_table, ids)
# Get the information with similar movies
_, ids = milvus.search(param = {milvus_table, user_like_vectors, top_k})
sql = &quot;select * from &quot; + movies_table + &quot; where milvus_id=&quot; + ids + &quot;;&quot;
results = cursor.execute(sql).fetchall()
</code></pre>
<h3 id="Step-5-Get-recommendations" class="common-anchor-header">Passo 5: ottenere raccomandazioni</h3><p>Il sistema raccomanderà ora i film più simili alle query di ricerca dell'utente. Questo è il flusso di lavoro generale per costruire un sistema di raccomandazione. Per testare e implementare rapidamente sistemi di raccomandazione e altre applicazioni di intelligenza artificiale, provate il <a href="https://github.com/milvus-io/bootcamp">bootcamp</a> di Milvus.</p>
<h2 id="Milvus-can-power-more-than-recommender-systems" class="common-anchor-header">Milvus può aiutare molto di più dei sistemi di raccomandazione<button data-href="#Milvus-can-power-more-than-recommender-systems" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus è un potente strumento in grado di alimentare una vasta gamma di applicazioni di intelligenza artificiale e di ricerca per similarità vettoriale. Per saperne di più sul progetto, consultate le seguenti risorse:</p>
<ul>
<li>Leggete il nostro <a href="https://zilliz.com/blog">blog</a>.</li>
<li>Interagire con la nostra comunità open-source su <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Utilizzate o contribuite al database vettoriale più diffuso al mondo su <a href="https://github.com/milvus-io/milvus/">GitHub</a>.</li>
</ul>
