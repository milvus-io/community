---
id: AI-applications-with-Milvus.md
title: Wie man 4 beliebte KI-Anwendungen mit Milvus erstellt
author: milvus
date: 2021-04-08T04:14:03.700Z
desc: >-
  Milvus beschleunigt die Entwicklung von Anwendungen für maschinelles Lernen
  und den Betrieb von maschinellem Lernen (MLOps). Mit Milvus können Sie schnell
  ein Minimum Viable Product (MVP) entwickeln und dabei die Kosten in Grenzen
  halten.
cover: assets.zilliz.com/blog_cover_4a9807b9e0.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/AI-applications-with-Milvus'
---
<custom-h1>Wie man 4 beliebte KI-Anwendungen mit Milvus erstellt</custom-h1><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/blog_cover_4a9807b9e0.png" alt="blog cover.png" class="doc-image" id="blog-cover.png" />
   </span> <span class="img-wrapper"> <span>blog cover.png</span> </span></p>
<p><a href="https://milvus.io/">Milvus</a> ist eine Open-Source-Vektordatenbank. Sie unterstützt das Hinzufügen, Löschen, Aktualisieren und Durchsuchen riesiger Vektordatensätze in nahezu Echtzeit, die durch Extraktion von Merkmalsvektoren aus unstrukturierten Daten mithilfe von KI-Modellen erstellt wurden. Mit einem umfassenden Satz intuitiver APIs und der Unterstützung mehrerer weit verbreiteter Indexbibliotheken (z. B. Faiss, NMSLIB und Annoy) beschleunigt Milvus die Entwicklung von Anwendungen für maschinelles Lernen und maschinelle Lernvorgänge (MLOps). Mit Milvus können Sie schnell ein Minimum Viable Product (MVP) entwickeln und dabei die Kosten in Grenzen halten.</p>
<p>&quot;Welche Ressourcen stehen für die Entwicklung einer KI-Anwendung mit Milvus zur Verfügung?&quot; wird in der Milvus-Community häufig gefragt. Zilliz, das <a href="https://zilliz.com/">Unternehmen</a> hinter Milvus, hat eine Reihe von Demos entwickelt, die Milvus für die blitzschnelle Ähnlichkeitssuche nutzen, die intelligente Anwendungen ermöglicht. Der Quellcode der Milvus-Lösungen ist unter <a href="https://github.com/zilliz-bootcamp">zilliz-bootcamp</a> zu finden. Die folgenden interaktiven Szenarien demonstrieren natürliche Sprachverarbeitung (NLP), umgekehrte Bildsuche, Audiosuche und Computer Vision.</p>
<p>Probieren Sie die Lösungen aus, um praktische Erfahrungen mit bestimmten Szenarien zu sammeln! Teilen Sie Ihre eigenen Anwendungsszenarien über:</p>
<ul>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a></li>
<li><a href="https://github.com/milvus-io/milvus/discussions">GitHub</a></li>
</ul>
<p><br/></p>
<p><strong>Springen Sie zu:</strong></p>
<ul>
<li><a href="#natural-language-processing-chatbots">Verarbeitung natürlicher Sprache (Chatbots)</a></li>
<li><a href="#reverse-image-search-systems">Umgekehrte Bildsuche</a></li>
<li><a href="#audio-search-systems">Audio-Suche</a></li>
<li><a href="#video-object-detection-computer-vision">Video-Objekterkennung (Computer Vision)</a></li>
</ul>
<p><br/></p>
<h3 id="Natural-language-processing-chatbots" class="common-anchor-header">Verarbeitung natürlicher Sprache (Chatbots)</h3><p>Mit Milvus können Chatbots erstellt werden, die natürliche Sprachverarbeitung nutzen, um einen Live-Operator zu simulieren, Fragen zu beantworten, Benutzer zu relevanten Informationen zu leiten und Arbeitskosten zu reduzieren. Um dieses Anwendungsszenario zu demonstrieren, hat Zilliz einen KI-gesteuerten Chatbot gebaut, der semantische Sprache versteht, indem Milvus mit <a href="https://en.wikipedia.org/wiki/BERT_(language_model)">BERT</a>, einem Modell für maschinelles Lernen (ML), das für das NLP-Pre-Training entwickelt wurde, kombiniert wurde.</p>
<p><a href="https://github.com/zilliz-bootcamp/intelligent_question_answering_v2">👉Quellcode：zilliz-bootcamp/intelligent_question_answering_v2</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_c301a9e4bd.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">Wie man es benutzt</h4><ol>
<li><p>Laden Sie einen Datensatz hoch, der Frage-Antwort-Paare enthält. Formatieren Sie Fragen und Antworten in zwei getrennten Spalten. Alternativ steht ein <a href="https://zilliz.com/solutions/qa">Beispieldatensatz</a> zum Download bereit.</p></li>
<li><p>Nachdem Sie Ihre Frage eingegeben haben, wird eine Liste ähnlicher Fragen aus dem hochgeladenen Datensatz abgerufen.</p></li>
<li><p>Zeigen Sie die Antwort an, indem Sie die Frage auswählen, die Ihrer eigenen am ähnlichsten ist.</p></li>
</ol>
<p>👉Video<a href="https://www.youtube.com/watch?v=ANgoyvgAxgU">：[Demo] QA System Powered by Milvus</a></p>
<h4 id="How-it-works" class="common-anchor-header">Wie es funktioniert</h4><p>Die Fragen werden mithilfe des BERT-Modells von Google in Merkmalsvektoren umgewandelt, dann wird Milvus zur Verwaltung und Abfrage des Datensatzes verwendet.</p>
<p><strong>Datenverarbeitung:</strong></p>
<ol>
<li>BERT wird verwendet, um die hochgeladenen Frage-Antwort-Paare in 768-dimensionale Merkmalsvektoren zu konvertieren. Die Vektoren werden dann in Milvus importiert und mit individuellen IDs versehen.</li>
<li>Die Vektor-IDs der Fragen und der entsprechenden Antworten werden in PostgreSQL gespeichert.</li>
</ol>
<p><strong>Suche nach ähnlichen Fragen:</strong></p>
<ol>
<li>BERT wird verwendet, um Merkmalsvektoren aus der Eingabefrage eines Benutzers zu extrahieren.</li>
<li>Milvus ruft die Vektor-IDs für Fragen ab, die der Eingabefrage am ähnlichsten sind.</li>
<li>Das System schlägt die entsprechenden Antworten in PostgreSQL nach.</li>
</ol>
<p><br/></p>
<h3 id="Reverse-image-search-systems" class="common-anchor-header">Systeme für die umgekehrte Bildsuche</h3><p>Die umgekehrte Bildersuche verändert den E-Commerce durch personalisierte Produktempfehlungen und ähnliche Produktnachschlagetools, die den Umsatz steigern können. Für dieses Anwendungsszenario hat Zilliz ein System zur umgekehrten Bildersuche entwickelt, das Milvus mit <a href="https://towardsdatascience.com/how-to-use-a-pre-trained-model-vgg-for-image-classification-8dd7c4a4a517">VGG</a> kombiniert, einem ML-Modell, das Bildmerkmale extrahieren kann.</p>
<p><a href="https://github.com/zilliz-bootcamp/image_search">👉Quellcode：zilliz-bootcamp/image_search</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_09000e2e2e.jpeg" alt="2.jpeg" class="doc-image" id="2.jpeg" />
   </span> <span class="img-wrapper"> <span>2.jpeg</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">Wie man es benutzt</h4><ol>
<li>Laden Sie einen gezippten Bilddatensatz hoch, der nur aus .jpg-Bildern besteht (andere Bilddateitypen werden nicht akzeptiert). Alternativ steht ein <a href="https://zilliz.com/solutions/image-search">Beispieldatensatz</a> zum Download bereit.</li>
<li>Laden Sie ein Bild hoch, das als Sucheingabe für die Suche nach ähnlichen Bildern verwendet werden soll.</li>
</ol>
<p>👉Video: <a href="https://www.youtube.com/watch?v=mTO8YdQObKY">[Demo] Bildsuche Powered by Milvus</a></p>
<h4 id="How-it-works" class="common-anchor-header">Wie funktioniert es?</h4><p>Bilder werden mit Hilfe des VGG-Modells in 512-dimensionale Merkmalsvektoren umgewandelt, dann wird Milvus zur Verwaltung und Abfrage des Datensatzes verwendet.</p>
<p><strong>Datenverarbeitung:</strong></p>
<ol>
<li>Das VGG-Modell wird verwendet, um den hochgeladenen Bilddatensatz in Merkmalsvektoren umzuwandeln. Die Vektoren werden dann in Milvus importiert und mit individuellen IDs versehen.</li>
<li>Die Bildmerkmalsvektoren und die entsprechenden Pfade zu den Bilddateien werden in der CacheDB gespeichert.</li>
</ol>
<p><strong>Suche nach ähnlichen Bildern:</strong></p>
<ol>
<li>VGG wird verwendet, um das von einem Benutzer hochgeladene Bild in Merkmalsvektoren umzuwandeln.</li>
<li>Die Vektor-IDs der Bilder, die dem Eingabebild am ähnlichsten sind, werden von Milvus abgerufen.</li>
<li>Das System sucht die entsprechenden Pfade der Bilddateien in der CacheDB.</li>
</ol>
<p><br/></p>
<h3 id="Audio-search-systems" class="common-anchor-header">Audio-Suchsysteme</h3><p>Die Suche nach Sprache, Musik, Soundeffekten und anderen Arten von Audiodaten ermöglicht die schnelle Abfrage großer Mengen von Audiodaten und das Auffinden ähnlicher Klänge. Zu den Anwendungen gehören die Identifizierung ähnlicher Soundeffekte, die Minimierung von Verletzungen des geistigen Eigentums und vieles mehr. Um dieses Anwendungsszenario zu demonstrieren, hat Zilliz ein hocheffizientes Audio-Ähnlichkeitssuchsystem entwickelt, indem es Milvus mit <a href="https://arxiv.org/abs/1912.10211">PANNs</a>kombiniert hat <a href="https://arxiv.org/abs/1912.10211">- einem</a>groß angelegten, vortrainierten neuronalen Audionetzwerk, das für die Audio-Mustererkennung entwickelt wurde.</p>
<p><a href="https://github.com/zilliz-bootcamp/audio_search">👉Quellcode：zilliz-bootcamp/audio_search</a> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_419bac3dd2.png" alt="3.png" class="doc-image" id="3.png" /><span>3.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">Wie man es benutzt</h4><ol>
<li>Laden Sie einen gezippten Audiodatensatz hoch, der nur aus .wav-Dateien besteht (andere Audiodateitypen werden nicht akzeptiert). Alternativ steht ein <a href="https://zilliz.com/solutions/audio-search">Beispieldatensatz</a> zum Download zur Verfügung.</li>
<li>Laden Sie eine .wav-Datei hoch, die als Sucheingabe für die Suche nach ähnlichen Audiodaten verwendet werden soll.</li>
</ol>
<p>👉Video: <a href="https://www.youtube.com/watch?v=0eQHeqriCXw">[Demo] Audio-Suche powered by Milvus</a></p>
<h4 id="How-it-works" class="common-anchor-header">Wie funktioniert es?</h4><p>Die Audiodaten werden mit Hilfe von PANNs, groß angelegten, vortrainierten neuronalen Audionetzwerken, die für die Erkennung von Audiomustern entwickelt wurden, in Merkmalsvektoren umgewandelt. Anschließend wird Milvus zur Verwaltung und Abfrage des Datensatzes verwendet.</p>
<p><strong>Verarbeitung der Daten:</strong></p>
<ol>
<li>PANNs konvertiert Audio aus dem hochgeladenen Datensatz in Merkmalsvektoren. Die Vektoren werden dann in Milvus importiert und mit individuellen IDs versehen.</li>
<li>Die IDs der Audio-Feature-Vektoren und die entsprechenden Pfade der .wav-Dateien werden in PostgreSQL gespeichert.</li>
</ol>
<p><strong>Suche nach ähnlichen Audiodaten:</strong></p>
<ol>
<li>PANNs wird verwendet, um die von einem Benutzer hochgeladene Audiodatei in Feature-Vektoren zu konvertieren.</li>
<li>Die Vektor-IDs der Audiodateien, die der hochgeladenen Datei am ähnlichsten sind, werden von Milvus durch Berechnung des inneren Produktabstands (IP) abgerufen.</li>
<li>Das System sucht die entsprechenden Pfade zu den Audiodateien in MySQL.</li>
</ol>
<p><br/></p>
<h3 id="Video-object-detection-computer-vision" class="common-anchor-header">Video-Objekterkennung (Computer Vision)</h3><p>Die Erkennung von Videoobjekten wird unter anderem in den Bereichen Computer Vision, Bildabfrage und autonomes Fahren eingesetzt. Um dieses Anwendungsszenario zu demonstrieren, hat Zilliz ein System zur Video-Objekterkennung entwickelt, das Milvus mit Technologien und Algorithmen wie <a href="https://en.wikipedia.org/wiki/OpenCV">OpenCV</a>, <a href="https://towardsdatascience.com/yolo-v3-object-detection-53fb7d3bfe6b">YOLOv3</a> und <a href="https://www.mathworks.com/help/deeplearning/ref/resnet50.html">ResNet50</a> kombiniert.</p>
<p>👉Quellcode: <a href="https://github.com/zilliz-bootcamp/video_analysis">zilliz-bootcamp/video_analysis</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_54b4ceb2ad.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<h4 id="How-to-use" class="common-anchor-header">Wie man es benutzt</h4><ol>
<li>Laden Sie einen gezippten Bilddatensatz hoch, der nur aus .jpg-Dateien besteht (andere Bilddateitypen werden nicht akzeptiert). Stellen Sie sicher, dass jede Bilddatei nach dem abgebildeten Objekt benannt ist. Alternativ steht ein <a href="https://zilliz.com/solutions/video-obj-analysis">Beispieldatensatz</a> zum Download bereit.</li>
<li>Laden Sie ein Video hoch, das Sie für die Analyse verwenden möchten.</li>
<li>Klicken Sie auf die Schaltfläche Abspielen, um das hochgeladene Video mit den Objekterkennungsergebnissen in Echtzeit anzuzeigen.</li>
</ol>
<p>👉Video: <a href="https://www.youtube.com/watch?v=m9rosLClByc">[Demo] Video Object Detection System Powered by Milvus</a></p>
<h4 id="How-it-works" class="common-anchor-header">Wie funktioniert es?</h4><p>Objektbilder werden mit ResNet50 in 2048-dimensionale Merkmalsvektoren umgewandelt. Dann wird Milvus zur Verwaltung und Abfrage des Datensatzes verwendet.</p>
<p><strong>Datenverarbeitung:</strong></p>
<ol>
<li>ResNet50 konvertiert Objektbilder in 2048-dimensionale Merkmalsvektoren. Die Vektoren werden dann in Milvus importiert und mit individuellen IDs versehen.</li>
<li>Die IDs der Audio-Feature-Vektoren und die entsprechenden Pfade zu den Bilddateien werden in MySQL gespeichert.</li>
</ol>
<p><strong>Erkennung von Objekten im Video:</strong></p>
<ol>
<li>OpenCV wird zum Trimmen des Videos verwendet.</li>
<li>YOLOv3 wird verwendet, um Objekte im Video zu erkennen.</li>
<li>ResNet50 wandelt die erkannten Objektbilder in 2048-dimensionale Merkmalsvektoren um.</li>
</ol>
<p>Milvus sucht nach den ähnlichsten Objektbildern in dem hochgeladenen Datensatz. Entsprechende Objektnamen und Bilddateipfade werden aus MySQL abgerufen.</p>
