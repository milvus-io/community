---
id: >-
  generate-more-creative-and-curated-ghibli-style-images-with-gpt-4o-and-milvus.md
title: Generare immagini più creative e curate in stile Ghibli con GPT-4o e Milvus
author: Lumina Wang
date: 2025-04-01T00:00:00.000Z
desc: >-
  Connettere i dati privati con GPT-4o Usare Milvus per ottenere output di
  immagini più curati
cover: assets.zilliz.com/GPT_4opagephoto_5e934b89e5.png
tag: Engineering
tags: 'GPT-4o, Database, Milvus, Artificial Intelligence, Image Generation'
canonicalUrl: >-
  https://milvus.io/blog/generate-more-creative-and-curated-ghibli-style-images-with-gpt-4o-and-milvus.md
---
<h2 id="Everyone-Became-an-Artist-Overnight-with-GPT-4o" class="common-anchor-header">Tutti sono diventati artisti in una notte con GPT-4o<button data-href="#Everyone-Became-an-Artist-Overnight-with-GPT-4o" class="anchor-icon" translate="no">
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
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/four_panel_1788f825e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Che ci crediate o no, l'immagine che avete appena visto è stata generata dall'intelligenza artificiale, in particolare dal nuovo GPT-4o!</em></p>
<p>Quando OpenAI ha lanciato la funzione nativa di generazione di immagini di GPT-4o il 26 marzo, nessuno avrebbe potuto prevedere lo tsunami creativo che ne è seguito. Nel giro di una notte, internet è esploso con ritratti generati dall'intelligenza artificiale in stile Ghibli: celebrità, politici, animali domestici e persino gli stessi utenti sono stati trasformati in affascinanti personaggi dello Studio Ghibli con poche semplici richieste. La richiesta è stata così travolgente che lo stesso Sam Altman ha dovuto "supplicare" gli utenti di rallentare, twittando che le "GPU di OpenAI si stanno sciogliendo".</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ghibli_32e739c2ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Esempio di immagini generate da GPT-4o (credito X@Jason Reid)</p>
<h2 id="Why-GPT-4o-Changes-Everything" class="common-anchor-header">Perché GPT-4o cambia tutto<button data-href="#Why-GPT-4o-Changes-Everything" class="anchor-icon" translate="no">
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
    </button></h2><p>Per le industrie creative, questo rappresenta un cambiamento di paradigma. Compiti che un tempo richiedevano a un intero team di progettazione un'intera giornata possono ora essere completati in pochi minuti. Ciò che rende GPT-4o diverso dai precedenti generatori di immagini è la <strong>sua notevole coerenza visiva e l'interfaccia intuitiva</strong>. Supporta conversazioni a più turni che consentono di perfezionare le immagini aggiungendo elementi, regolando le proporzioni, modificando gli stili o addirittura trasformando il 2D in 3D: in pratica, un designer professionista in tasca.</p>
<p>Il segreto delle prestazioni superiori di GPT-4o? L'architettura autoregressiva. A differenza dei modelli di diffusione (come la Diffusione stabile) che degradano le immagini in rumore prima di ricostruirle, GPT-4o genera immagini in sequenza, un token alla volta, mantenendo la consapevolezza del contesto durante tutto il processo. Questa differenza architettonica fondamentale spiega perché GPT-4o produce risultati più coerenti con richieste più semplici e naturali.</p>
<p>Ma è qui che le cose si fanno interessanti per gli sviluppatori: <strong>Un numero crescente di segnali indica una tendenza importante: gli stessi modelli di IA stanno diventando prodotti. In poche parole, la maggior parte dei prodotti che si limitano ad avvolgere grandi modelli di intelligenza artificiale su dati di dominio pubblico rischiano di rimanere indietro.</strong></p>
<p>La vera potenza di questi progressi deriva dalla combinazione di modelli di grandi dimensioni di uso generale con <strong>dati privati e specifici del settore</strong>. Questa combinazione potrebbe essere la strategia di sopravvivenza ottimale per la maggior parte delle aziende nell'era dei modelli linguistici di grandi dimensioni. Con la continua evoluzione dei modelli di base, il vantaggio competitivo duraturo spetterà a chi saprà integrare efficacemente i propri set di dati proprietari con questi potenti sistemi di intelligenza artificiale.</p>
<p>Vediamo come collegare i vostri dati privati con GPT-4o utilizzando Milvus, un database vettoriale open-source ad alte prestazioni.</p>
<h2 id="Connecting-Your-Private-Data-with-GPT-4o-Using-Milvus-for-More-Curated-Image-Outputs" class="common-anchor-header">Collegare i dati privati con GPT-4o utilizzando Milvus per ottenere risultati di immagini più curati<button data-href="#Connecting-Your-Private-Data-with-GPT-4o-Using-Milvus-for-More-Curated-Image-Outputs" class="anchor-icon" translate="no">
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
    </button></h2><p>I database vettoriali sono la tecnologia chiave per collegare i dati privati ai modelli di intelligenza artificiale. Funzionano convertendo i contenuti, siano essi immagini, testi o audio, in rappresentazioni matematiche (vettori) che ne catturano il significato e le caratteristiche. Ciò consente una ricerca semantica basata sulla somiglianza piuttosto che sulle sole parole chiave.</p>
<p>Milvus, in quanto database vettoriale open-source leader del settore, è particolarmente adatto a collegarsi con strumenti di IA generativa come GPT-4o. Ecco come l'ho utilizzato per risolvere una sfida personale.</p>
<h3 id="Background" class="common-anchor-header">Il contesto</h3><p>Un giorno ho avuto un'idea brillante: trasformare tutte le marachelle del mio cane Cola in un fumetto. Ma c'era un problema: Come potevo passare al setaccio decine di migliaia di foto scattate durante il lavoro, i viaggi e le avventure gastronomiche per trovare i momenti più birichini di Cola?</p>
<p>La risposta? Importare tutte le mie foto in Milvus e fare una ricerca per immagini.</p>
<p>Vediamo l'implementazione passo dopo passo.</p>
<h4 id="Dependencies-and-Environment" class="common-anchor-header">Dipendenze e ambiente</h4><p>Per prima cosa, è necessario preparare l'ambiente con i pacchetti giusti:</p>
<pre><code translate="no">pip install pymilvus --upgrade
pip install torch numpy scikit-learn pillow
<button class="copy-code-btn"></button></code></pre>
<h4 id="Prepare-the-Data" class="common-anchor-header">Preparare i dati</h4><p>In questa guida utilizzerò la mia libreria fotografica, che contiene circa 30.000 foto, come set di dati. Se non avete un set di dati a portata di mano, scaricate un set di dati di esempio da Milvus e decomprimetelo:</p>
<pre><code translate="no">!wget https://github.com/milvus-io/pymilvus-assets/releases/download/imagedata/reverse_image_search.<span class="hljs-built_in">zip</span>
!unzip -q -o reverse_image_search.<span class="hljs-built_in">zip</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Define-the-Feature-Extractor" class="common-anchor-header">Definire l'estrattore di funzioni</h4><p>Utilizzeremo la modalità ResNet-50 della libreria <code translate="no">timm</code> per estrarre i vettori di incorporazione dalle nostre immagini. Questo modello è stato addestrato su milioni di immagini e può estrarre caratteristiche significative che rappresentano il contenuto visivo.</p>
<pre><code translate="no">    <span class="hljs-keyword">import</span> torch
    <span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image
    <span class="hljs-keyword">import</span> timm
    <span class="hljs-keyword">from</span> sklearn.preprocessing <span class="hljs-keyword">import</span> normalize
    <span class="hljs-keyword">from</span> timm.data <span class="hljs-keyword">import</span> resolve_data_config
    <span class="hljs-keyword">from</span> timm.data.transforms_factory <span class="hljs-keyword">import</span> create_transform
    <span class="hljs-keyword">class</span> <span class="hljs-title class_">FeatureExtractor</span>:
        <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, modelname</span>):
            <span class="hljs-comment"># Load the pre-trained model</span>
            <span class="hljs-variable language_">self</span>.model = timm.create_model(
                modelname, pretrained=<span class="hljs-literal">True</span>, num_classes=<span class="hljs-number">0</span>, global_pool=<span class="hljs-string">&quot;avg&quot;</span>
            )
            <span class="hljs-variable language_">self</span>.model.<span class="hljs-built_in">eval</span>()
            <span class="hljs-comment"># Get the input size required by the model</span>
            <span class="hljs-variable language_">self</span>.input_size = <span class="hljs-variable language_">self</span>.model.default_cfg[<span class="hljs-string">&quot;input_size&quot;</span>]
            config = resolve_data_config({}, model=modelname)
            <span class="hljs-comment"># Get the preprocessing function provided by TIMM for the model</span>
            <span class="hljs-variable language_">self</span>.preprocess = create_transform(**config)
        <span class="hljs-keyword">def</span> <span class="hljs-title function_">__call__</span>(<span class="hljs-params">self, imagepath</span>):
            <span class="hljs-comment"># Preprocess the input image</span>
            input_image = Image.<span class="hljs-built_in">open</span>(imagepath).convert(<span class="hljs-string">&quot;RGB&quot;</span>)  <span class="hljs-comment"># Convert to RGB if needed</span>
            input_image = <span class="hljs-variable language_">self</span>.preprocess(input_image)
            <span class="hljs-comment"># Convert the image to a PyTorch tensor and add a batch dimension</span>
            input_tensor = input_image.unsqueeze(<span class="hljs-number">0</span>)
            <span class="hljs-comment"># Perform inference</span>
            <span class="hljs-keyword">with</span> torch.no_grad():
                output = <span class="hljs-variable language_">self</span>.model(input_tensor)
            <span class="hljs-comment"># Extract the feature vector</span>
            feature_vector = output.squeeze().numpy()
            <span class="hljs-keyword">return</span> normalize(feature_vector.reshape(<span class="hljs-number">1</span>, -<span class="hljs-number">1</span>), norm=<span class="hljs-string">&quot;l2&quot;</span>).flatten()
<button class="copy-code-btn"></button></code></pre>
<h4 id="Create-a-Milvus-Collection" class="common-anchor-header">Creare una raccolta Milvus</h4><p>Successivamente, creeremo una collezione Milvus per memorizzare le nostre incorporazioni di immagini. Si tratta di un database specializzato, progettato esplicitamente per la ricerca di somiglianze vettoriali:</p>
<pre><code translate="no">    <span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
    client = MilvusClient(uri=<span class="hljs-string">&quot;example.db&quot;</span>)
    <span class="hljs-keyword">if</span> client.has_collection(collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>):
        client.drop_collection(collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>)

    client.create_collection(
        collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>,
        vector_field_name=<span class="hljs-string">&quot;vector&quot;</span>,
        dimension=<span class="hljs-number">2048</span>,
        auto_id=<span class="hljs-literal">True</span>,
        enable_dynamic_field=<span class="hljs-literal">True</span>,
        metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    )
<button class="copy-code-btn"></button></code></pre>
<p><strong>Note sui parametri di MilvusClient:</strong></p>
<ul>
<li><p><strong>Impostazione locale:</strong> L'uso di un file locale (ad esempio, <code translate="no">./milvus.db</code>) è il modo più semplice per iniziare: Milvus Lite gestirà tutti i dati.</p></li>
<li><p><strong>Scalare:</strong> per grandi insiemi di dati, configurare un server Milvus robusto usando Docker o Kubernetes e usare il suo URI (ad esempio, <code translate="no">http://localhost:19530</code>).</p></li>
<li><p><strong>Opzione cloud:</strong> Se si utilizza Zilliz Cloud (il servizio completamente gestito di Milvus), regolare l'URI e il token in modo che corrispondano all'endpoint pubblico e alla chiave API.</p></li>
</ul>
<h4 id="Insert-Image-Embeddings-into-Milvus" class="common-anchor-header">Inserire le incorporazioni di immagini in Milvus</h4><p>Ora si passa all'analisi di ogni immagine e alla memorizzazione della sua rappresentazione vettoriale. Questa fase potrebbe richiedere un po' di tempo, a seconda delle dimensioni del set di dati, ma si tratta di un processo unico:</p>
<pre><code translate="no">    <span class="hljs-keyword">import</span> os
    <span class="hljs-keyword">from</span> some_module <span class="hljs-keyword">import</span> FeatureExtractor  <span class="hljs-comment"># Replace with your feature extraction module</span>
    extractor = FeatureExtractor(<span class="hljs-string">&quot;resnet50&quot;</span>)
    root = <span class="hljs-string">&quot;./train&quot;</span>  <span class="hljs-comment"># Path to your dataset</span>
    insert = <span class="hljs-literal">True</span>
    <span class="hljs-keyword">if</span> insert:
        <span class="hljs-keyword">for</span> dirpath, _, filenames <span class="hljs-keyword">in</span> os.walk(root):
            <span class="hljs-keyword">for</span> filename <span class="hljs-keyword">in</span> filenames:
                <span class="hljs-keyword">if</span> filename.endswith(<span class="hljs-string">&quot;.jpeg&quot;</span>):
                    filepath = os.path.join(dirpath, filename)
                    image_embedding = extractor(filepath)
                    client.insert(
                        <span class="hljs-string">&quot;image_embeddings&quot;</span>,
                        {<span class="hljs-string">&quot;vector&quot;</span>: image_embedding, <span class="hljs-string">&quot;filename&quot;</span>: filepath},
                    )
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conduct-an-Image-Search" class="common-anchor-header">Eseguire una ricerca di immagini</h4><p>Con il nostro database popolato, possiamo ora cercare immagini simili. È qui che avviene la magia: possiamo trovare foto visivamente simili utilizzando la somiglianza vettoriale:</p>
<pre><code translate="no">    <span class="hljs-keyword">from</span> IPython.display <span class="hljs-keyword">import</span> display
    <span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image
    query_image = <span class="hljs-string">&quot;./search-image.jpeg&quot;</span>  <span class="hljs-comment"># The image you want to search with</span>
    results = client.search(
        <span class="hljs-string">&quot;image_embeddings&quot;</span>,
        data=[extractor(query_image)],
        output_fields=[<span class="hljs-string">&quot;filename&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
        limit=<span class="hljs-number">6</span>,  <span class="hljs-comment"># Top-k results</span>
    )
    images = []
    <span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results:
        <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> result[:<span class="hljs-number">10</span>]:
            filename = hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;filename&quot;</span>]
            img = Image.<span class="hljs-built_in">open</span>(filename)
            img = img.resize((<span class="hljs-number">150</span>, <span class="hljs-number">150</span>))
            images.append(img)
    width = <span class="hljs-number">150</span> * <span class="hljs-number">3</span>
    height = <span class="hljs-number">150</span> * <span class="hljs-number">2</span>
    concatenated_image = Image.new(<span class="hljs-string">&quot;RGB&quot;</span>, (width, height))
    <span class="hljs-keyword">for</span> idx, img <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(images):
        x = idx % <span class="hljs-number">5</span>
        y = idx // <span class="hljs-number">5</span>
        concatenated_image.paste(img, (x * <span class="hljs-number">150</span>, y * <span class="hljs-number">150</span>))

    display(<span class="hljs-string">&quot;query&quot;</span>)
    display(Image.<span class="hljs-built_in">open</span>(query_image).resize((<span class="hljs-number">150</span>, <span class="hljs-number">150</span>)))
    display(<span class="hljs-string">&quot;results&quot;</span>)
    display(concatenated_image)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Le immagini restituite sono mostrate di seguito:</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_1_8d4e88c6dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Combine-Vector-Search-with-GPT-4o-Generating-Ghibli-Style-Images-with-Images-Returned-by-Milvus" class="common-anchor-header">Combinare la ricerca vettoriale con GPT-4o: Generazione di immagini in stile Ghibli con le immagini restituite da Milvus</h3><p>Ora viene la parte più interessante: utilizzare i risultati della ricerca di immagini come input per GPT-4o per generare contenuti creativi. Nel mio caso, volevo creare delle strisce a fumetti con protagonista il mio cane Cola, basate su foto che avevo scattato.</p>
<p>Il flusso di lavoro è semplice ma potente:</p>
<ol>
<li><p>Usare la ricerca vettoriale per trovare immagini rilevanti di Cola dalla mia collezione.</p></li>
<li><p>Alimentare queste immagini a GPT-4o con suggerimenti creativi</p></li>
<li><p>Generare fumetti unici basati sull'ispirazione visiva</p></li>
</ol>
<p>Ecco alcuni esempi di ciò che questa combinazione può produrre:</p>
<p><strong>I suggerimenti che uso:</strong></p>
<ul>
<li><p><em>"Crea un fumetto esilarante a quattro pannelli, a colori, con un Border Collie sorpreso a rosicchiare un topo, con un momento di imbarazzo quando il padrone lo scopre".<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2025_04_02_at_11_34_43_1d7141eef3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
<li><p><em>"Disegnate un fumetto in cui questo cane sfoggia un vestito carino".<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cutedog_6fdb1e9c79.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
<li><p><em>"Usando questo cane come modello, create un fumetto in cui frequenta la Scuola di Magia e Stregoneria di Hogwarts".<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2025_04_02_at_11_44_00_ce932cd035.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
</ul>
<h3 id="A-Few-Quick-Tips-from-My-Experience-of-Image-Generation" class="common-anchor-header">Alcuni suggerimenti rapidi tratti dalla mia esperienza di generazione di immagini:</h3><ol>
<li><p><strong>Mantenete le cose semplici</strong>: A differenza di quei pignoli modelli di diffusione, GPT-4o funziona meglio con suggerimenti semplici. Mi sono ritrovato a scrivere richieste sempre più brevi, ottenendo risultati migliori.</p></li>
<li><p><strong>L'inglese funziona meglio</strong>: Ho provato a scrivere in cinese per alcuni fumetti, ma i risultati non sono stati buoni. Ho finito per scrivere i miei suggerimenti in inglese e poi tradurre i fumetti finiti quando necessario.</p></li>
<li><p><strong>Non va bene per la Video Generation</strong>: Non sperate ancora troppo in Sora: i video generati dall'IA hanno ancora molta strada da fare quando si tratta di movimenti fluidi e trame coerenti.</p></li>
</ol>
<h2 id="Whats-Next-My-Perspective-and-Open-for-Discussion" class="common-anchor-header">Cosa ci aspetta? Il mio punto di vista e aperto alla discussione<button data-href="#Whats-Next-My-Perspective-and-Open-for-Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>Con le immagini generate dall'intelligenza artificiale in testa, una rapida occhiata ai principali rilasci di OpenAI negli ultimi sei mesi mostra un chiaro schema: che si tratti di GPT per i marketplace di app, di DeepResearch per la generazione di report, di GPT-4o per la creazione di immagini conversazionali o di Sora per la magia dei video, i grandi modelli di intelligenza artificiale stanno uscendo da dietro il sipario per andare sotto i riflettori. Quella che era una tecnologia sperimentale sta ora maturando in prodotti reali e utilizzabili.</p>
<p>Man mano che GPT-4o e modelli simili si diffondono, la maggior parte dei flussi di lavoro e degli agenti intelligenti basati sulla Diffusione Stabile si avvia verso l'obsolescenza. Tuttavia, il valore insostituibile dei dati privati e dell'intuizione umana rimane forte. Ad esempio, anche se l'intelligenza artificiale non sostituirà completamente le agenzie creative, l'integrazione di un database vettoriale Milvus con i modelli GPT consente alle agenzie di generare rapidamente idee creative fresche, ispirate ai loro successi passati. Le piattaforme di e-commerce possono progettare abbigliamento personalizzato in base alle tendenze di acquisto e le istituzioni accademiche possono creare istantaneamente immagini per i documenti di ricerca.</p>
<p>L'era dei prodotti alimentati da modelli di intelligenza artificiale è arrivata e la corsa all'estrazione della miniera d'oro dei dati è appena iniziata. Per gli sviluppatori e le aziende, il messaggio è chiaro: combinate i vostri dati unici con questi potenti modelli o rischiate di rimanere indietro.</p>
