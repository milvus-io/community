---
id: AI-applications-with-Milvus.md
title: Come creare 4 applicazioni AI popolari con Milvus
author: milvus
date: 2021-04-08T04:14:03.700Z
desc: >-
  Milvus accelera lo sviluppo di applicazioni di apprendimento automatico e le
  operazioni di apprendimento automatico (MLOps). Con Milvus è possibile
  sviluppare rapidamente un prodotto minimo realizzabile (MVP) mantenendo i
  costi al minimo.
cover: assets.zilliz.com/blog_cover_4a9807b9e0.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/AI-applications-with-Milvus'
---
<custom-h1>Come creare 4 applicazioni AI popolari con Milvus</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/blog_cover_4a9807b9e0.png" alt="blog cover.png" class="doc-image" id="blog-cover.png" />
   </span> <span class="img-wrapper"> <span>copertina del blog.png</span> </span></p>
<p><a href="https://milvus.io/">Milvus</a> è un database vettoriale open source. Supporta l'aggiunta, la cancellazione, l'aggiornamento e la ricerca quasi in tempo reale di enormi insiemi di dati vettoriali creati estraendo vettori di caratteristiche da dati non strutturati utilizzando modelli di intelligenza artificiale. Grazie a una serie completa di API intuitive e al supporto di diverse librerie di indici ampiamente adottate (ad esempio, Faiss, NMSLIB e Annoy), Milvus accelera lo sviluppo di applicazioni di apprendimento automatico e le operazioni di apprendimento automatico (MLOps). Con Milvus, è possibile sviluppare rapidamente un prodotto minimo realizzabile (MVP) mantenendo i costi al minimo.</p>
<p>&quot;Quali sono le risorse disponibili per lo sviluppo di un'applicazione AI con Milvus?&quot; è una domanda frequente nella comunità Milvus. Zilliz, l'<a href="https://zilliz.com/">azienda</a> che sta dietro a Milvus, ha sviluppato una serie di demo che sfruttano Milvus per condurre una ricerca di similarità fulminea che alimenta le applicazioni intelligenti. Il codice sorgente delle soluzioni Milvus è disponibile su <a href="https://github.com/zilliz-bootcamp">zilliz-bootcamp</a>. I seguenti scenari interattivi dimostrano l'elaborazione del linguaggio naturale (NLP), la ricerca inversa di immagini, la ricerca audio e la computer vision.</p>
<p>Sentitevi liberi di provare le soluzioni per acquisire esperienza pratica con scenari specifici! Condividete i vostri scenari applicativi tramite:</p>
<ul>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a></li>
<li><a href="https://github.com/milvus-io/milvus/discussions">GitHub</a></li>
</ul>
<p><br/></p>
<p><strong>Vai a:</strong></p>
<ul>
<li><a href="#natural-language-processing-chatbots">Elaborazione del linguaggio naturale (chatbot)</a></li>
<li><a href="#reverse-image-search-systems">Ricerca inversa di immagini</a></li>
<li><a href="#audio-search-systems">Ricerca audio</a></li>
<li><a href="#video-object-detection-computer-vision">Rilevamento di oggetti video (computer vision)</a></li>
</ul>
<p><br/></p>
<h3 id="Natural-language-processing-chatbots" class="common-anchor-header">Elaborazione del linguaggio naturale (chatbot)</h3><p>Milvus può essere utilizzato per costruire chatbot che utilizzano l'elaborazione del linguaggio naturale per simulare un operatore in carne e ossa, rispondere alle domande, indirizzare gli utenti verso informazioni pertinenti e ridurre i costi di lavoro. Per dimostrare questo scenario applicativo, Zilliz ha costruito un chatbot dotato di intelligenza artificiale che comprende il linguaggio semantico combinando Milvus con <a href="https://en.wikipedia.org/wiki/BERT_(language_model)">BERT</a>, un modello di apprendimento automatico (ML) sviluppato per il pre-training NLP.</p>
<p>👉Codice <a href="https://github.com/zilliz-bootcamp/intelligent_question_answering_v2">sorgente：zilliz-bootcamp/intelligent_question_answering_v2</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_c301a9e4bd.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">Come utilizzare</h4><ol>
<li><p>Caricare un set di dati che includa coppie domanda-risposta. Formattare le domande e le risposte in due colonne separate. In alternativa, è possibile scaricare un <a href="https://zilliz.com/solutions/qa">set di dati di esempio</a>.</p></li>
<li><p>Dopo aver digitato la domanda, verrà recuperato un elenco di domande simili dal set di dati caricato.</p></li>
<li><p>Rivelare la risposta selezionando la domanda più simile alla propria.</p></li>
</ol>
<p>👉Video：<a href="https://www.youtube.com/watch?v=ANgoyvgAxgU">[Demo] Sistema QA alimentato da Milvus</a></p>
<h4 id="How-it-works" class="common-anchor-header">Come funziona</h4><p>Le domande vengono convertite in vettori di caratteristiche utilizzando il modello BERT di Google, quindi Milvus viene utilizzato per gestire e interrogare il set di dati.</p>
<p><strong>Elaborazione dei dati:</strong></p>
<ol>
<li>BERT viene utilizzato per convertire le coppie domanda-risposta caricate in vettori di caratteristiche a 768 dimensioni. I vettori vengono poi importati in Milvus e assegnati a ID individuali.</li>
<li>Gli ID dei vettori delle domande e delle corrispondenti risposte sono memorizzati in PostgreSQL.</li>
</ol>
<p><strong>Ricerca di domande simili:</strong></p>
<ol>
<li>BERT viene utilizzato per estrarre i vettori di caratteristiche dalla domanda inserita dall'utente.</li>
<li>Milvus recupera gli ID dei vettori per le domande più simili a quella in ingresso.</li>
<li>Il sistema cerca le risposte corrispondenti in PostgreSQL.</li>
</ol>
<p><br/></p>
<h3 id="Reverse-image-search-systems" class="common-anchor-header">Sistemi di ricerca inversa di immagini</h3><p>La ricerca inversa di immagini sta trasformando il commercio elettronico attraverso raccomandazioni personalizzate di prodotti e strumenti di ricerca di prodotti simili che possono incrementare le vendite. In questo scenario applicativo, Zilliz ha costruito un sistema di ricerca inversa di immagini combinando Milvus con <a href="https://towardsdatascience.com/how-to-use-a-pre-trained-model-vgg-for-image-classification-8dd7c4a4a517">VGG</a>, un modello ML in grado di estrarre le caratteristiche delle immagini.</p>
<p>👉Codice <a href="https://github.com/zilliz-bootcamp/image_search">sorgente：zilliz-bootcamp/image_search</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_09000e2e2e.jpeg" alt="2.jpeg" class="doc-image" id="2.jpeg" />
   </span> <span class="img-wrapper"> <span>2.jpeg</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">Come si usa</h4><ol>
<li>Caricare un set di dati immagine zippato composto solo da immagini .jpg (altri tipi di file immagine non sono accettati). In alternativa, è possibile scaricare un <a href="https://zilliz.com/solutions/image-search">set di dati di esempio</a>.</li>
<li>Caricare un'immagine da usare come input di ricerca per trovare immagini simili.</li>
</ol>
<p>👉Video: <a href="https://www.youtube.com/watch?v=mTO8YdQObKY">[Demo] Ricerca di immagini alimentata da Milvus</a></p>
<h4 id="How-it-works" class="common-anchor-header">Come funziona</h4><p>Le immagini vengono convertite in vettori di caratteristiche a 512 dimensioni utilizzando il modello VGG, quindi Milvus viene utilizzato per gestire e interrogare il set di dati.</p>
<p><strong>Elaborazione dei dati:</strong></p>
<ol>
<li>Il modello VGG viene utilizzato per convertire il set di immagini caricate in vettori di caratteristiche. I vettori vengono poi importati in Milvus e assegnati a ID individuali.</li>
<li>I vettori di caratteristiche dell'immagine e i corrispondenti percorsi dei file di immagine sono memorizzati in CacheDB.</li>
</ol>
<p><strong>Ricerca di immagini simili:</strong></p>
<ol>
<li>VGG viene utilizzato per convertire l'immagine caricata da un utente in vettori di caratteristiche.</li>
<li>Gli ID dei vettori delle immagini più simili all'immagine in ingresso vengono recuperati da Milvus.</li>
<li>Il sistema cerca i percorsi dei file immagine corrispondenti in CacheDB.</li>
</ol>
<p><br/></p>
<h3 id="Audio-search-systems" class="common-anchor-header">Sistemi di ricerca audio</h3><p>La ricerca di parlato, musica, effetti sonori e altri tipi di audio permette di interrogare rapidamente volumi enormi di dati audio e di far emergere suoni simili. Le applicazioni includono l'identificazione di effetti sonori simili, la riduzione al minimo delle violazioni della proprietà intellettuale e altro ancora. Per dimostrare questo scenario applicativo, Zilliz ha realizzato un sistema di ricerca di somiglianze audio altamente efficiente combinando Milvus con <a href="https://arxiv.org/abs/1912.10211">PANN, una</a>rete neurale audio preaddestrata su larga scala costruita per il riconoscimento di pattern audio.</p>
<p>👉Codice <a href="https://github.com/zilliz-bootcamp/audio_search">sorgente：zilliz-bootcamp/audio_search</a> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_419bac3dd2.png" alt="3.png" class="doc-image" id="3.png" /><span>3.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">Come si usa</h4><ol>
<li>Caricare un set di dati audio zippato composto esclusivamente da file .wav (altri tipi di file audio non sono accettati). In alternativa, è possibile scaricare un <a href="https://zilliz.com/solutions/audio-search">set di dati di esempio</a>.</li>
<li>Caricare un file .wav da utilizzare come input di ricerca per trovare audio simili.</li>
</ol>
<p>👉Video: <a href="https://www.youtube.com/watch?v=0eQHeqriCXw">[Demo] Ricerca audio alimentata da Milvus</a></p>
<h4 id="How-it-works" class="common-anchor-header">Come funziona</h4><p>L'audio viene convertito in vettori di caratteristiche utilizzando le PANN, reti neurali audio pre-addestrate su larga scala costruite per il riconoscimento di pattern audio. Poi viene utilizzato Milvus per gestire e interrogare il set di dati.</p>
<p><strong>Elaborazione dei dati:</strong></p>
<ol>
<li>PANNs converte l'audio del dataset caricato in vettori di caratteristiche. I vettori vengono poi importati in Milvus e assegnati a ID individuali.</li>
<li>Gli ID dei vettori di caratteristiche audio e i corrispondenti percorsi dei file .wav sono memorizzati in PostgreSQL.</li>
</ol>
<p><strong>Ricerca di audio simili:</strong></p>
<ol>
<li>PANNs viene utilizzato per convertire il file audio caricato da un utente in vettori di caratteristiche.</li>
<li>Gli ID dei vettori audio più simili al file caricato vengono recuperati da Milvus calcolando la distanza del prodotto interno (IP).</li>
<li>Il sistema cerca i percorsi dei file audio corrispondenti in MySQL.</li>
</ol>
<p><br/></p>
<h3 id="Video-object-detection-computer-vision" class="common-anchor-header">Rilevamento di oggetti video (computer vision)</h3><p>Il rilevamento di oggetti video trova applicazione nella computer vision, nel recupero di immagini, nella guida autonoma e altro ancora. Per dimostrare questo scenario applicativo, Zilliz ha costruito un sistema di rilevamento di oggetti video combinando Milvus con tecnologie e algoritmi quali <a href="https://en.wikipedia.org/wiki/OpenCV">OpenCV</a>, <a href="https://towardsdatascience.com/yolo-v3-object-detection-53fb7d3bfe6b">YOLOv3</a> e <a href="https://www.mathworks.com/help/deeplearning/ref/resnet50.html">ResNet50</a>.</p>
<p>👉 Codice sorgente: <a href="https://github.com/zilliz-bootcamp/video_analysis">zilliz-bootcamp/video_analisi</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_54b4ceb2ad.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">Come si usa</h4><ol>
<li>Caricare un set di immagini zippate composto esclusivamente da file .jpg (altri tipi di file immagine non sono accettati). Assicurarsi che ogni file immagine abbia il nome dell'oggetto che rappresenta. In alternativa, è possibile scaricare un <a href="https://zilliz.com/solutions/video-obj-analysis">set di dati di esempio</a>.</li>
<li>Caricare un video da utilizzare per l'analisi.</li>
<li>Fare clic sul pulsante play per visualizzare il video caricato con i risultati del rilevamento degli oggetti in tempo reale.</li>
</ol>
<p>👉Video: <a href="https://www.youtube.com/watch?v=m9rosLClByc">[Sistema di rilevamento degli oggetti video alimentato da Milvus</a></p>
<h4 id="How-it-works" class="common-anchor-header">Come funziona</h4><p>Le immagini degli oggetti vengono convertite in vettori di caratteristiche a 2048 dimensioni utilizzando ResNet50. Poi viene utilizzato Milvus per gestire e interrogare il set di dati.</p>
<p><strong>Elaborazione dei dati:</strong></p>
<ol>
<li>ResNet50 converte le immagini degli oggetti in vettori di caratteristiche a 2048 dimensioni. I vettori vengono poi importati in Milvus e assegnati a ID individuali.</li>
<li>Gli ID dei vettori di caratteristiche audio e i percorsi dei file immagine corrispondenti sono memorizzati in MySQL.</li>
</ol>
<p><strong>Rilevamento degli oggetti nel video:</strong></p>
<ol>
<li>OpenCV viene utilizzato per tagliare il video.</li>
<li>YOLOv3 viene utilizzato per rilevare gli oggetti nel video.</li>
<li>ResNet50 converte le immagini degli oggetti rilevati in vettori di caratteristiche a 2048 dimensioni.</li>
</ol>
<p>Milvus cerca le immagini di oggetti più simili nel set di dati caricato. I nomi degli oggetti e i percorsi dei file immagine corrispondenti vengono recuperati da MySQL.</p>
