---
id: 2021-10-10-milvus-helps-analyze-videos.md
title: Rilevamento degli oggetti
author: Shiyu Chen
date: 2021-10-11T00:00:00.000Z
desc: Scoprite come Milvus alimenta l'analisi AI dei contenuti video.
cover: assets.zilliz.com/Who_is_it_e9d4510ace.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/milvus-helps-analyze-videos-intelligently'
---
<custom-h1>Costruire un sistema di analisi video con il database vettoriale Milvus</custom-h1><p><em>Shiyu Chen, ingegnere dei dati presso Zilliz, si è laureata in informatica all'Università di Xidian. Da quando è entrata a far parte di Zilliz, ha esplorato soluzioni per Milvus in vari campi, come l'analisi audio e video, il reperimento di formule molecolari, ecc. Attualmente sta esplorando altre soluzioni interessanti. Nel tempo libero, ama lo sport e la lettura.</em></p>
<p>Mentre guardavo <em>Free Guy</em> lo scorso fine settimana, mi è sembrato di aver già visto da qualche parte l'attore che interpreta Buddy, la guardia giurata, ma non riuscivo a ricordare nessuno dei suoi lavori. La mia testa era piena di "chi è questo tizio?". Ero sicuro di aver visto quel volto e mi sforzavo di ricordare il suo nome. Un caso simile è quello di una volta in cui ho visto l'attore protagonista di un video che beveva una bevanda che mi piaceva molto, ma alla fine non sono riuscito a ricordare il nome della marca.</p>
<p>La risposta era sulla punta della lingua, ma il mio cervello era completamente bloccato.</p>
<p>Il fenomeno della punta della lingua (TOT) mi fa impazzire quando guardo i film. Se solo esistesse un motore di ricerca inversa di immagini per i video che mi permettesse di trovare i video e di analizzarne il contenuto. In precedenza, ho costruito un <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search/quick_deploy">motore di ricerca inverso per immagini utilizzando Milvus</a>. Considerando che l'analisi dei contenuti video assomiglia in qualche modo all'analisi delle immagini, ho deciso di costruire un motore di analisi dei contenuti video basato su Milvus.</p>
<h2 id="Object-detection" class="common-anchor-header">Rilevamento degli oggetti<button data-href="#Object-detection" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Overview" class="common-anchor-header">Panoramica</h3><p>Prima di essere analizzati, gli oggetti in un video devono essere rilevati. Rilevare gli oggetti in un video in modo efficace e accurato è la sfida principale del compito. È anche un compito importante per applicazioni come il pilota automatico, i dispositivi indossabili e l'IoT.</p>
<p>Sviluppati dai tradizionali algoritmi di elaborazione delle immagini alle reti neurali profonde (DNN), gli attuali modelli mainstream per il rilevamento degli oggetti includono R-CNN, FRCNN, SSD e YOLO. Il sistema di analisi video deep learning basato su Milvus introdotto in questo argomento è in grado di rilevare gli oggetti in modo intelligente e rapido.</p>
<h3 id="Implementation" class="common-anchor-header">Implementazione</h3><p>Per rilevare e riconoscere gli oggetti in un video, il sistema deve innanzitutto estrarre i fotogrammi da un video e rilevare gli oggetti nelle immagini dei fotogrammi utilizzando il rilevamento degli oggetti, in secondo luogo, estrarre i vettori di caratteristiche dagli oggetti rilevati e, infine, analizzare l'oggetto in base ai vettori di caratteristiche.</p>
<ul>
<li>Estrazione dei fotogrammi</li>
</ul>
<p>L'analisi dei video viene convertita in analisi delle immagini mediante l'estrazione dei fotogrammi. Attualmente la tecnologia di estrazione dei fotogrammi è molto matura. Programmi come FFmpeg e OpenCV supportano l'estrazione di fotogrammi a intervalli specifici. Questo articolo illustra come estrarre fotogrammi da un video ogni secondo utilizzando OpenCV.</p>
<ul>
<li>Rilevamento degli oggetti</li>
</ul>
<p>Il rilevamento degli oggetti consiste nel trovare gli oggetti nei fotogrammi estratti e nell'estrarre le schermate degli oggetti in base alla loro posizione. Come mostrato nelle figure seguenti, sono stati rilevati una bicicletta, un cane e un'automobile. Questo argomento illustra come rilevare gli oggetti utilizzando YOLOv3, comunemente usato per il rilevamento degli oggetti.</p>
<ul>
<li>Estrazione delle caratteristiche</li>
</ul>
<p>L'estrazione delle caratteristiche si riferisce alla conversione di dati non strutturati, difficili da riconoscere per le macchine, in vettori di caratteristiche. Ad esempio, le immagini possono essere convertite in vettori di caratteristiche multidimensionali utilizzando modelli di deep learning. Attualmente, i modelli di intelligenza artificiale per il riconoscimento delle immagini più diffusi sono VGG, GNN e ResNet. Questo argomento presenta come estrarre le caratteristiche dagli oggetti rilevati utilizzando ResNet-50.</p>
<ul>
<li>Analisi dei vettori</li>
</ul>
<p>I vettori di caratteristiche estratti vengono confrontati con i vettori di libreria e vengono restituite le informazioni corrispondenti ai vettori più simili. Per gli insiemi di vettori di caratteristiche su larga scala, il calcolo è una sfida enorme. Questo argomento presenta come analizzare i vettori di caratteristiche utilizzando Milvus.</p>
<h2 id="Key-technologies" class="common-anchor-header">Tecnologie chiave<button data-href="#Key-technologies" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="OpenCV" class="common-anchor-header">OpenCV</h3><p>Open Source Computer Vision Library (OpenCV) è una libreria di computer vision multipiattaforma, che fornisce molti algoritmi universali per l'elaborazione delle immagini e la computer vision. OpenCV è comunemente utilizzato nel campo della computer vision.</p>
<p>L'esempio seguente mostra come catturare fotogrammi video a intervalli specifici e salvarli come immagini utilizzando OpenCV con Python.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> cv2 
<span class="hljs-built_in">cap</span> = cv2.VideoCapture(file_path)   
framerate = <span class="hljs-built_in">cap</span>.get(cv2.CAP_PROP_FPS)   
allframes = <span class="hljs-type">int</span>(cv2.VideoCapture.get(<span class="hljs-built_in">cap</span>, <span class="hljs-type">int</span>(cv2.CAP_PROP_FRAME_COUNT)))  
success, image = <span class="hljs-built_in">cap</span>.read() 
cv2.imwrite(file_name, image)
<button class="copy-code-btn"></button></code></pre>
<h3 id="YOLOv3" class="common-anchor-header">YOLOv3</h3><p>You Only Look Once, Version 3 (YOLOv3 [5]) è un algoritmo di rilevamento degli oggetti a una fase proposto negli ultimi anni. Rispetto ai tradizionali algoritmi di rilevamento degli oggetti con la stessa precisione, YOLOv3 è due volte più veloce. YOLOv3 citato in questo argomento è la versione migliorata di PaddlePaddle [6]. Utilizza più metodi di ottimizzazione con una maggiore velocità di inferenza.</p>
<h3 id="ResNet-50" class="common-anchor-header">ResNet-50</h3><p>ResNet [7] è il vincitore dell'ILSVRC 2015 nella classificazione delle immagini per la sua semplicità e praticità. Come base di molti metodi di analisi delle immagini, ResNet si dimostra un modello popolare specializzato nel rilevamento, nella segmentazione e nel riconoscimento delle immagini.</p>
<h3 id="Milvus" class="common-anchor-header">Milvus</h3><p><a href="https://milvus.io/">Milvus</a> è un database vettoriale cloud-native e open-source costruito per gestire vettori di incorporamento generati da modelli di apprendimento automatico e reti neurali. È ampiamente utilizzato in scenari quali la computer vision, l'elaborazione del linguaggio naturale, la chimica computazionale, i sistemi di raccomandazione personalizzati e altro ancora.</p>
<p>Le seguenti procedure descrivono il funzionamento di Milvus.</p>
<ol>
<li>I dati non strutturati vengono convertiti in vettori di caratteristiche utilizzando modelli di deep learning e importati in Milvus.</li>
<li>Milvus memorizza e indicizza i vettori di caratteristiche.</li>
<li>Milvus restituisce i vettori più simili a quelli interrogati dagli utenti.</li>
</ol>
<h2 id="Deployment" class="common-anchor-header">Distribuzione<button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>Ora avete una certa conoscenza dei sistemi di analisi video basati su Milvus. Il sistema è composto principalmente da due parti, come mostrato nella figura seguente.</p>
<ul>
<li><p>Le frecce rosse indicano il processo di importazione dei dati. Utilizziamo ResNet-50 per estrarre i vettori di caratteristiche dal dataset di immagini e importiamo i vettori di caratteristiche in Milvus.</p></li>
<li><p>Le frecce nere indicano il processo di analisi video. Innanzitutto, si estraggono i fotogrammi da un video e si salvano come immagini. In secondo luogo, si individuano ed estraggono gli oggetti nelle immagini utilizzando YOLOv3. Quindi, si utilizza ResNet-50 per estrarre vettori di caratteristiche dalle immagini. Infine, Milvus cerca e restituisce le informazioni sugli oggetti con i vettori di caratteristiche corrispondenti.</p></li>
</ul>
<p>Per ulteriori informazioni, vedere <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/video_similarity_search/object_detection">Milvus Bootcamp: Sistema di rilevamento di oggetti video</a>.</p>
<p><strong>Importazione dei dati</strong></p>
<p>Il processo di importazione dei dati è semplice. Convertire i dati in vettori a 2.048 dimensioni e importare i vettori in Milvus.</p>
<pre><code translate="no" class="language-python">vector = image_encoder.execute(filename)
entities = [vector]
collection.insert(data=entities)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Analisi video</strong></p>
<p>Come già detto, il processo di analisi video comprende l'acquisizione di fotogrammi video, il rilevamento di oggetti in ogni fotogramma, l'estrazione di vettori dagli oggetti, il calcolo della similarità vettoriale con la metrica della distanza euclidea (L2) e la ricerca dei risultati con Milvus.</p>
<pre><code translate="no" class="language-python">images = extract_frame(filename, 1, prefix)   
detector = Detector()   
run(detector, DATA_PATH)       
vectors = get_object_vector(image_encoder, DATA_PATH)
search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: 10}}
results = collection.search(vectors, param=search_params, <span class="hljs-built_in">limit</span>=10)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Conclusion" class="common-anchor-header">Conclusione<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Attualmente, oltre l'80% dei dati non è strutturato. Con il rapido sviluppo dell'intelligenza artificiale, è stato sviluppato un numero crescente di modelli di deep learning per l'analisi dei dati non strutturati. Tecnologie come il rilevamento degli oggetti e l'elaborazione delle immagini hanno fatto grandi progressi sia in ambito accademico che industriale. Grazie a queste tecnologie, sempre più piattaforme di IA hanno soddisfatto le esigenze pratiche.</p>
<p>Il sistema di analisi video discusso in questo argomento è costruito con Milvus, che può analizzare rapidamente i contenuti video.</p>
<p>Come database vettoriale open-source, Milvus supporta vettori di caratteristiche estratti con diversi modelli di deep learning. Integrato con librerie come Faiss, NMSLIB e Annoy, Milvus fornisce una serie di API intuitive, che supportano la commutazione dei tipi di indice a seconda degli scenari. Inoltre, Milvus supporta il filtraggio scalare, che aumenta il tasso di richiamo e la flessibilità della ricerca. Milvus è stato applicato a molti campi come l'elaborazione delle immagini, la computer vision, l'elaborazione del linguaggio naturale, il riconoscimento vocale, i sistemi di raccomandazione e la scoperta di nuovi farmaci.</p>
<h2 id="References" class="common-anchor-header">Riferimenti<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><p>[1] A. D. Bagdanov, L. Ballan, M. Bertini, A. Del Bimbo. "Corrispondenza e recupero di marchi in database di video sportivi". Atti del workshop internazionale sul Workshop on multimedia information retrieval, ACM, 2007. https://www.researchgate.net/publication/210113141_Trademark_matching_and_retrieval_in_sports_video_databases</p>
<p>[2] J. Kleban, X. Xie, W.-Y. Ma. "Estrazione di piramidi spaziali per il rilevamento di loghi in scene naturali". Conferenza internazionale IEEE, 2008. https://ieeexplore.ieee.org/document/4607625</p>
<p>[3] R. Boia, C. Florea, L. Florea, R. Dogaru. "Localizzazione e riconoscimento di logo in immagini naturali mediante grafi di classe omografici". Machine Vision and Applications 27 (2), 2016. https://link.springer.com/article/10.1007/s00138-015-0741-7</p>
<p>[4] R. Boia, C. Florea, L. Florea. "Agglomerazione di aste ellittiche in prototipi di classi per il rilevamento di loghi". BMVC, 2015. http://citeseerx.ist.psu.edu/viewdoc/download;jsessionid=5C87F52DE38AB0C90F8340DFEBB841F7?doi=10.1.1.707.9371&amp;rep=rep1&amp;type=pdf</p>
<p>[5] https://arxiv.org/abs/1804.02767</p>
<p>[6] https://paddlepaddle.org.cn/modelbasedetail/yolov3</p>
<p>[7] https://arxiv.org/abs/1512.03385</p>
