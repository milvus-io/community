---
id: test-and-deploy-vector-search-solutions-milvus-bootcamp.md
title: >-
  Testate e distribuite rapidamente le soluzioni di ricerca vettoriale con il
  Bootcamp Milvus 2.0
author: milvus
date: 2021-07-15T03:05:45.742Z
desc: >-
  Costruite, testate e personalizzate soluzioni di ricerca di similarità
  vettoriale con Milvus, un database vettoriale open-source.
cover: assets.zilliz.com/cover_80db9ee49c.png
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/test-and-deploy-vector-search-solutions-milvus-bootcamp
---
<custom-h1>Test e implementazione rapida di soluzioni di ricerca vettoriale con il Milvus 2.0 Bootcamp</custom-h1><p>Con il rilascio di Milvus 2.0, il team ha rinnovato il <a href="https://github.com/milvus-io/bootcamp">bootcamp</a> di Milvus. Il nuovo e migliorato bootcamp offre guide aggiornate ed esempi di codice più facili da seguire per una varietà di casi d'uso e di implementazioni. Inoltre, questa nuova versione è aggiornata per <a href="https://milvus.io/blog/milvus2.0-redefining-vector-database.md">Milvus 2.0</a>, una nuova versione del database vettoriale più avanzato al mondo.</p>
<h3 id="Stress-test-your-system-against-1M-and-100M-dataset-benchmarks" class="common-anchor-header">Stress test del sistema con benchmark da 1 milione e 100 milioni di dati</h3><p>La <a href="https://github.com/milvus-io/bootcamp/tree/master/benchmark_test">directory dei benchmark</a> contiene test di benchmark vettoriali da 1 milione e 100 milioni che indicano la reazione del sistema a insiemi di dati di dimensioni diverse.</p>
<p><br/></p>
<h3 id="Explore-and-build-popular-vector-similarity-search-solutions" class="common-anchor-header">Esplora e costruisci le soluzioni più diffuse per la ricerca di similarità vettoriale</h3><p>L'<a href="https://github.com/milvus-io/bootcamp/tree/master/solutions">elenco delle soluzioni</a> comprende i casi d'uso più diffusi di ricerca per similarità vettoriale. Ogni caso d'uso contiene una soluzione notebook e una soluzione distribuibile tramite docker. I casi d'uso includono:</p>
<ul>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search">Ricerca per similarità di immagini</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/video_similarity_search">Ricerca per somiglianza di video</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/audio_similarity_search">Ricerca di similarità audio</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/recommendation_system">Sistema di raccomandazione</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/molecular_similarity_search">Ricerca molecolare</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/question_answering_system">Sistema di risposta alle domande</a></li>
</ul>
<p><br/></p>
<h3 id="Quickly-deploy-a-fully-built-application-on-any-system" class="common-anchor-header">Distribuire rapidamente un'applicazione completamente costruita su qualsiasi sistema</h3><p>Le soluzioni di distribuzione rapida sono soluzioni dockerizzate che consentono agli utenti di distribuire applicazioni completamente costruite su qualsiasi sistema. Queste soluzioni sono ideali per brevi dimostrazioni, ma richiedono un lavoro supplementare di personalizzazione e comprensione rispetto ai notebook.</p>
<p><br/></p>
<h3 id="Use-scenario-specific-notebooks-to-easily-deploy-pre-configured-applications" class="common-anchor-header">Utilizzate i notebook specifici per lo scenario per distribuire facilmente le applicazioni preconfigurate.</h3><p>I notebook contengono un semplice esempio di implementazione di Milvus per risolvere il problema in un determinato caso d'uso. Ogni esempio può essere eseguito dall'inizio alla fine senza dover gestire file o configurazioni. Ogni quaderno è inoltre facile da seguire e modificabile, il che li rende file di base ideali per altri progetti.</p>
<p><br/></p>
<h3 id="Image-similarity-search-notebook-example" class="common-anchor-header">Esempio di notebook per la ricerca della somiglianza delle immagini</h3><p>La ricerca per somiglianza di immagini è una delle idee alla base di molte tecnologie diverse, tra cui il riconoscimento di oggetti da parte di automobili autonome. Questo esempio spiega come costruire facilmente programmi di computer vision con Milvus.</p>
<p>Questo quaderno ruota attorno a tre elementi:</p>
<ul>
<li>server Milvus</li>
<li>server Redis (per l'archiviazione dei metadati)</li>
<li>Modello Resnet-18 pre-addestrato.</li>
</ul>
<h4 id="Step-1-Download-required-packages" class="common-anchor-header">Passo 1: Scaricare i pacchetti necessari</h4><p>Iniziare a scaricare tutti i pacchetti necessari per questo progetto. Questo quaderno include una tabella che elenca i pacchetti da utilizzare.</p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-2-Server-startup" class="common-anchor-header">Passo 2: avvio del server</h4><p>Dopo aver installato i pacchetti, avviare i server e assicurarsi che entrambi funzionino correttamente. Assicurarsi di seguire le istruzioni corrette per l'avvio dei server <a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">Milvus</a> e <a href="https://hub.docker.com/_/redis">Redis</a>.</p>
<h4 id="Step-3-Download-project-data" class="common-anchor-header">Passo 3: Scaricare i dati del progetto</h4><p>Per impostazione predefinita, questo blocco note estrae un frammento dei dati di VOCImage da usare come esempio, ma qualsiasi directory con immagini dovrebbe funzionare, purché segua la struttura dei file visibile all'inizio del blocco note.</p>
<pre><code translate="no">! gdown <span class="hljs-string">&quot;https://drive.google.com/u/1/uc?id=1jdudBiUu41kL-U5lhH3ari_WBRXyedWo&amp;export=download&quot;</span>
! tar -xf <span class="hljs-string">&#x27;VOCdevkit.zip&#x27;</span>
! <span class="hljs-built_in">rm</span> <span class="hljs-string">&#x27;VOCdevkit.zip&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-4-Connect-to-the-servers" class="common-anchor-header">Fase 4: connessione ai server</h4><p>In questo esempio, i server sono in esecuzione sulle porte predefinite su localhost.</p>
<pre><code translate="no">connections.<span class="hljs-title function_">connect</span>(host=<span class="hljs-string">&quot;127.0.0.1&quot;</span>, port=<span class="hljs-number">19537</span>)
red = redis.<span class="hljs-title class_">Redis</span>(host = <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=<span class="hljs-number">6379</span>, db=<span class="hljs-number">0</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-5-Create-a-collection" class="common-anchor-header">Passo 5: Creare una raccolta</h4><p>Dopo aver avviato i server, creare una collezione in Milvus per memorizzare tutti i vettori. In questo esempio, la dimensione è impostata a 512, la dimensione dell'output di resnet-18, e la metrica di similarità è impostata sulla distanza euclidea (L2). Milvus supporta diverse <a href="https://milvus.io/docs/v2.0.x/metric.md">metriche di somiglianza</a>.</p>
<pre><code translate="no">collection_name = <span class="hljs-string">&quot;image_similarity_search&quot;</span>
dim = <span class="hljs-number">512</span>
default_fields = [
    schema.FieldSchema(name=<span class="hljs-string">&quot;id&quot;</span>, dtype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>),
    schema.FieldSchema(name=<span class="hljs-string">&quot;vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=dim)
]
default_schema = schema.CollectionSchema(fields=default_fields, description=<span class="hljs-string">&quot;Image test collection&quot;</span>)
collection = Collection(name=collection_name, schema=default_schema)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-6-Build-an-index-for-the-collection" class="common-anchor-header">Fase 6: Creare un indice per la raccolta</h4><p>Una volta creata la raccolta, è necessario creare un indice per essa. In questo caso, viene utilizzato l'indice IVF_SQ8. Questo indice richiede il parametro "nlist", che indica a Milvus quanti cluster creare all'interno di ciascun file di dati (segmento). <a href="https://milvus.io/docs/v2.0.x/index.md">Indici</a> diversi richiedono parametri diversi.</p>
<pre><code translate="no">default_index = {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_SQ8&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">2048</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>}
collection.<span class="hljs-title function_">create_index</span>(field_name=<span class="hljs-string">&quot;vector&quot;</span>, index_params=default_index)
collection.<span class="hljs-title function_">load</span>()
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-7-Set-up-model-and-data-loader" class="common-anchor-header">Fase 7: Impostazione del modello e del caricatore di dati</h4><p>Dopo aver costruito l'indice IVF_SQ8, impostare la rete neurale e il caricatore di dati. La rete preaddestrata pytorch resnet-18 utilizzata in questo esempio è priva dell'ultimo strato, che comprime i vettori per la classificazione e può perdere informazioni preziose.</p>
<pre><code translate="no">model = torch.hub.load(<span class="hljs-string">&#x27;pytorch/vision:v0.9.0&#x27;</span>, <span class="hljs-string">&#x27;resnet18&#x27;</span>, pretrained=<span class="hljs-literal">True</span>)
encoder = torch.nn.Sequential(*(<span class="hljs-built_in">list</span>(model.children())[:-<span class="hljs-number">1</span>]))
<button class="copy-code-btn"></button></code></pre>
<p>Il dataset e il caricatore di dati devono essere modificati in modo che siano in grado di preelaborare e raggruppare le immagini, fornendo anche i percorsi dei file delle immagini. Questo può essere fatto con un dataloader torchvision leggermente modificato. Per la preelaborazione, le immagini devono essere ritagliate e normalizzate, poiché il modello resnet-18 è stato addestrato su un intervallo di dimensioni e valori specifici.</p>
<pre><code translate="no">dataset = ImageFolderWithPaths(data_dir, transform=transforms.Compose([
                                                transforms.Resize(256),
                                                transforms.CenterCrop(224),
                                                transforms.ToTensor(),
                                                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])]))

dataloader = torch.utils.data.DataLoader(dataset, num_workers=0, batch_si
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-8-Insert-vectors-into-the-collection" class="common-anchor-header">Fase 8: inserimento dei vettori nella raccolta</h4><p>Una volta impostata la raccolta, le immagini possono essere elaborate e caricate nella raccolta creata. Per prima cosa le immagini vengono prelevate dal dataloader e passate attraverso il modello resnet-18. I vettori risultanti vengono inseriti nella collezione. Le incorporazioni vettoriali risultanti vengono poi inserite in Milvus, che restituisce un ID univoco per ogni vettore. Gli ID dei vettori e i percorsi dei file immagine vengono quindi inseriti come coppie chiave-valore nel server Redis.</p>
<pre><code translate="no">steps = <span class="hljs-built_in">len</span>(dataloader)
step = <span class="hljs-number">0</span>
<span class="hljs-keyword">for</span> inputs, labels, paths <span class="hljs-keyword">in</span> dataloader:
    <span class="hljs-keyword">with</span> torch.no_grad():
        output = encoder(inputs).squeeze()
        output = output.numpy()

    mr = collection.insert([output.tolist()])
    ids = mr.primary_keys
    <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(ids)):
        red.<span class="hljs-built_in">set</span>(<span class="hljs-built_in">str</span>(ids[x]), paths[x])
    <span class="hljs-keyword">if</span> step%<span class="hljs-number">5</span> == <span class="hljs-number">0</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Insert Step: &quot;</span> + <span class="hljs-built_in">str</span>(step) + <span class="hljs-string">&quot;/&quot;</span> + <span class="hljs-built_in">str</span>(steps))
    step += <span class="hljs-number">1</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-9-Conduct-a-vector-similarity-search" class="common-anchor-header">Fase 9: condurre una ricerca di somiglianza tra i vettori</h4><p>Una volta inseriti tutti i dati in Milvus e Redis, è possibile eseguire la ricerca di similarità vettoriale vera e propria. In questo esempio, tre immagini selezionate a caso vengono estratte dal server Redis per una ricerca di similarità vettoriale.</p>
<pre><code translate="no">random_ids = [<span class="hljs-built_in">int</span>(red.randomkey()) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">3</span>)]
search_images = [x.decode(<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> red.mget(random_ids)]
<button class="copy-code-btn"></button></code></pre>
<p>Queste immagini vengono prima sottoposte alla stessa pre-elaborazione descritta nel passaggio 7 e poi passate attraverso il modello resnet-18.</p>
<pre><code translate="no">transform_ops = transforms.Compose([
                transforms.Resize(<span class="hljs-number">256</span>),
                transforms.CenterCrop(<span class="hljs-number">224</span>),
                transforms.ToTensor(),
                transforms.Normalize(mean=[<span class="hljs-number">0.485</span>, <span class="hljs-number">0.456</span>, <span class="hljs-number">0.406</span>], std=[<span class="hljs-number">0.229</span>, <span class="hljs-number">0.224</span>, <span class="hljs-number">0.225</span>])])

embeddings = [transform_ops(Image.<span class="hljs-built_in">open</span>(x)) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> search_images]
embeddings = torch.stack(embeddings, dim=<span class="hljs-number">0</span>)

<span class="hljs-keyword">with</span> torch.no_grad():
    embeddings = encoder(embeddings).squeeze().numpy()
<button class="copy-code-btn"></button></code></pre>
<p>Quindi le incorporazioni vettoriali risultanti vengono utilizzate per eseguire una ricerca. Per prima cosa, si impostano i parametri di ricerca, tra cui il nome della raccolta da cercare, nprobe (il numero di cluster da cercare) e top_k (il numero di vettori restituiti). In questo esempio, la ricerca dovrebbe essere molto veloce.</p>
<pre><code translate="no">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: 32}}
start = time.time()
results = collection.search(embeddings, <span class="hljs-string">&quot;vector&quot;</span>, param=search_params, <span class="hljs-built_in">limit</span>=3, <span class="hljs-built_in">expr</span>=None)
end = time.time() - start
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-10-Image-search-results" class="common-anchor-header">Passo 10: Risultati della ricerca di immagini</h4><p>Gli ID dei vettori restituiti dalle query vengono utilizzati per trovare le immagini corrispondenti. Matplotlib viene quindi utilizzato per visualizzare i risultati della ricerca di immagini.<br/></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic1_c8652c7fae.png" alt="pic1.png" class="doc-image" id="pic1.png" />
   </span> <span class="img-wrapper"> <span>pic1.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic2_355b054161.png" alt="pic2.png" class="doc-image" id="pic2.png" /><span>pic2.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic3_01780c6aac.png" alt="pic3.png" class="doc-image" id="pic3.png" /><span>pic3.png</span> </span></p>
<p><br/></p>
<h3 id="Learn-how-to-deploy-Milvus-in-different-enviroments" class="common-anchor-header">Imparare a distribuire Milvus in ambienti diversi</h3><p>La <a href="https://github.com/milvus-io/bootcamp/tree/master/deployments">sezione "Deployments"</a> del nuovo bootcamp contiene tutte le informazioni per utilizzare Milvus in diversi ambienti e configurazioni. Include la distribuzione di Mishard, l'uso di Kubernetes con Milvus, il bilanciamento del carico e altro ancora. Ogni ambiente ha una guida dettagliata che spiega passo dopo passo come far funzionare Milvus in esso.</p>
<p><br/></p>
<h3 id="Dont-be-a-stranger" class="common-anchor-header">Non siate estranei</h3><ul>
<li>Leggete il nostro <a href="https://zilliz.com/blog">blog</a>.</li>
<li>Interagite con la nostra comunità open-source su <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Utilizzate o contribuite a Milvus, il database vettoriale più diffuso al mondo, su <a href="https://github.com/milvus-io/milvus">Github</a>.</li>
</ul>
