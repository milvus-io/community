---
id: 2021-10-10-milvus-helps-analyze-videos.md
title: Objekt-Erkennung
author: Shiyu Chen
date: 2021-10-11T00:00:00.000Z
desc: 'Erfahren Sie, wie Milvus die KI-Analyse von Videoinhalten unterstützt.'
cover: assets.zilliz.com/Who_is_it_e9d4510ace.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/milvus-helps-analyze-videos-intelligently'
---
<custom-h1>Aufbau eines Videoanalysesystems mit der Milvus-Vektordatenbank</custom-h1><p><em>Shiyu Chen, eine Dateningenieurin bei Zilliz, hat an der Xidian Universität einen Abschluss in Informatik gemacht. Seit sie bei Zilliz ist, hat sie Lösungen für Milvus in verschiedenen Bereichen erforscht, wie z.B. Audio- und Videoanalyse, Molekülformelabfrage usw., was die Anwendungsszenarien der Gemeinschaft sehr bereichert hat. Derzeit erforscht sie weitere interessante Lösungen. In ihrer Freizeit treibt sie gerne Sport und liest.</em></p>
<p>Als ich letztes Wochenende <em>Free Guy</em> sah, hatte ich das Gefühl, den Schauspieler, der Buddy, den Wachmann, spielt, schon einmal gesehen zu haben, konnte mich aber an keine seiner Arbeiten erinnern. In meinem Kopf schwirrte die Frage: "Wer ist dieser Typ?" Ich war mir sicher, dieses Gesicht schon einmal gesehen zu haben, und versuchte so sehr, mich an seinen Namen zu erinnern. Ein ähnlicher Fall ist, dass ich einmal den Hauptdarsteller in einem Video sah, der ein Getränk trank, das ich früher sehr mochte, aber ich konnte mich nicht an den Markennamen erinnern.</p>
<p>Die Antwort lag mir auf der Zunge, aber mein Gehirn war völlig blockiert.</p>
<p>Das Phänomen der Zungenspitze (TOT) macht mich verrückt, wenn ich Filme sehe. Wenn es doch nur eine umgekehrte Bildsuchmaschine für Videos gäbe, die es mir ermöglicht, Videos zu finden und Videoinhalte zu analysieren. Früher habe ich <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search/quick_deploy">mit Milvus</a> eine <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search/quick_deploy">umgekehrte Bildsuchmaschine</a> gebaut. In Anbetracht der Tatsache, dass die Analyse von Videoinhalten in gewisser Weise der Bildanalyse ähnelt, beschloss ich, eine Maschine zur Analyse von Videoinhalten auf der Grundlage von Milvus zu entwickeln.</p>
<h2 id="Object-detection" class="common-anchor-header">Objekt-Erkennung<button data-href="#Object-detection" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Overview" class="common-anchor-header">Übersicht</h3><p>Bevor ein Video analysiert werden kann, müssen die Objekte in einem Video zunächst erkannt werden. Die effektive und genaue Erkennung von Objekten in einem Video ist die größte Herausforderung bei dieser Aufgabe. Sie ist auch eine wichtige Aufgabe für Anwendungen wie Autopilot, tragbare Geräte und IoT.</p>
<p>Zu den heute gängigen Modellen für die Objekterkennung gehören R-CNN, FRCNN, SSD und YOLO, die von traditionellen Bildverarbeitungsalgorithmen zu tiefen neuronalen Netzen (DNN) weiterentwickelt wurden. Das in diesem Thema vorgestellte Milvus-basierte Deep-Learning-Videoanalysesystem kann Objekte auf intelligente und schnelle Weise erkennen.</p>
<h3 id="Implementation" class="common-anchor-header">Implementierung</h3><p>Zur Erkennung und Erkennung von Objekten in einem Video sollte das System zunächst Frames aus einem Video extrahieren und Objekte in den Frame-Bildern mithilfe der Objekterkennung erkennen, dann Merkmalsvektoren aus den erkannten Objekten extrahieren und schließlich das Objekt anhand der Merkmalsvektoren analysieren.</p>
<ul>
<li>Extraktion von Bildern</li>
</ul>
<p>Die Videoanalyse wird mithilfe der Bildextraktion in eine Bildanalyse umgewandelt. Derzeit ist die Technologie der Bildextraktion sehr ausgereift. Programme wie FFmpeg und OpenCV unterstützen die Extraktion von Frames in bestimmten Intervallen. In diesem Artikel wird erläutert, wie man mit OpenCV jede Sekunde Bilder aus einem Video extrahiert.</p>
<ul>
<li>Objekterkennung</li>
</ul>
<p>Bei der Objekterkennung geht es darum, Objekte in extrahierten Frames zu finden und Screenshots der Objekte entsprechend ihrer Position zu extrahieren. Wie in den folgenden Abbildungen gezeigt, wurden ein Fahrrad, ein Hund und ein Auto erkannt. In diesem Thema wird die Erkennung von Objekten mit YOLOv3 vorgestellt, das üblicherweise für die Objekterkennung verwendet wird.</p>
<ul>
<li>Merkmalsextraktion</li>
</ul>
<p>Unter Merkmalsextraktion versteht man die Umwandlung unstrukturierter Daten, die für Maschinen schwer zu erkennen sind, in Merkmalsvektoren. So können beispielsweise Bilder mithilfe von Deep-Learning-Modellen in mehrdimensionale Merkmalsvektoren umgewandelt werden. Zu den derzeit beliebtesten KI-Modellen für die Bilderkennung gehören VGG, GNN und ResNet. In diesem Thema wird erläutert, wie man mit ResNet-50 Merkmale aus erkannten Objekten extrahiert.</p>
<ul>
<li>Vektoranalyse</li>
</ul>
<p>Die extrahierten Merkmalsvektoren werden mit Bibliotheksvektoren verglichen, und die entsprechenden Informationen zu den ähnlichsten Vektoren werden zurückgegeben. Bei großen Merkmalsvektor-Datensätzen stellt die Berechnung eine große Herausforderung dar. In diesem Thema wird die Analyse von Merkmalsvektoren mit Milvus vorgestellt.</p>
<h2 id="Key-technologies" class="common-anchor-header">Schlüsseltechnologien<button data-href="#Key-technologies" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="OpenCV" class="common-anchor-header">OpenCV</h3><p>Die Open Source Computer Vision Library (OpenCV) ist eine plattformübergreifende Bildverarbeitungsbibliothek, die viele universelle Algorithmen für die Bildverarbeitung und die Computer Vision bereitstellt. OpenCV wird häufig im Bereich der Computer Vision eingesetzt.</p>
<p>Das folgende Beispiel zeigt, wie man mit OpenCV und Python Videobilder in bestimmten Intervallen erfasst und als Bilder speichert.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> cv2 
<span class="hljs-built_in">cap</span> = cv2.VideoCapture(file_path)   
framerate = <span class="hljs-built_in">cap</span>.get(cv2.CAP_PROP_FPS)   
allframes = <span class="hljs-type">int</span>(cv2.VideoCapture.get(<span class="hljs-built_in">cap</span>, <span class="hljs-type">int</span>(cv2.CAP_PROP_FRAME_COUNT)))  
success, image = <span class="hljs-built_in">cap</span>.read() 
cv2.imwrite(file_name, image)
<button class="copy-code-btn"></button></code></pre>
<h3 id="YOLOv3" class="common-anchor-header">YOLOv3</h3><p>You Only Look Once, Version 3 (YOLOv3 [5]) ist ein einstufiger Algorithmus zur Objekterkennung, der in den letzten Jahren vorgeschlagen wurde. Im Vergleich zu den traditionellen Objekterkennungsalgorithmen mit derselben Genauigkeit ist YOLOv3 doppelt so schnell. YOLOv3, das in diesem Thema erwähnt wird, ist die verbesserte Version von PaddlePaddle [6]. Es verwendet mehrere Optimierungsmethoden mit einer höheren Inferenzgeschwindigkeit.</p>
<h3 id="ResNet-50" class="common-anchor-header">ResNet-50</h3><p>ResNet [7] ist aufgrund seiner Einfachheit und Praktikabilität der Gewinner des ILSVRC 2015 im Bereich Bildklassifikation. Als Grundlage vieler Bildanalysemethoden erweist sich ResNet als ein beliebtes Modell, das auf Bilderkennung, -segmentierung und -erkennung spezialisiert ist.</p>
<h3 id="Milvus" class="common-anchor-header">Milvus</h3><p><a href="https://milvus.io/">Milvus</a> ist eine Cloud-native, quelloffene Vektordatenbank zur Verwaltung von Einbettungsvektoren, die von maschinellen Lernmodellen und neuronalen Netzen erzeugt werden. Sie wird häufig in Szenarien wie Computer Vision, Verarbeitung natürlicher Sprache, computergestützte Chemie, personalisierte Empfehlungssysteme und mehr eingesetzt.</p>
<p>Die folgenden Verfahren beschreiben, wie Milvus funktioniert.</p>
<ol>
<li>Unstrukturierte Daten werden mit Hilfe von Deep-Learning-Modellen in Merkmalsvektoren umgewandelt und in Milvus importiert.</li>
<li>Milvus speichert und indiziert die Merkmalsvektoren.</li>
<li>Milvus gibt die Vektoren zurück, die den vom Benutzer abgefragten Vektoren am ähnlichsten sind.</li>
</ol>
<h2 id="Deployment" class="common-anchor-header">Einsatz<button data-href="#Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>Jetzt haben Sie ein gewisses Verständnis für Milvus-basierte Videoanalysesysteme. Das System besteht hauptsächlich aus zwei Teilen, wie in der folgenden Abbildung dargestellt.</p>
<ul>
<li><p>Die roten Pfeile zeigen den Prozess des Datenimports an. Verwenden Sie ResNet-50, um Merkmalsvektoren aus dem Bilddatensatz zu extrahieren, und importieren Sie die Merkmalsvektoren in Milvus.</p></li>
<li><p>Die schwarzen Pfeile zeigen den Prozess der Videoanalyse an. Zunächst werden Frames aus einem Video extrahiert und als Bilder gespeichert. Zweitens: Erkennen und Extrahieren von Objekten in den Bildern mit YOLOv3. Anschließend werden mit ResNet-50 Merkmalsvektoren aus den Bildern extrahiert. Schließlich sucht Milvus die Informationen zu den Objekten mit den entsprechenden Merkmalsvektoren und gibt sie zurück.</p></li>
</ul>
<p>Weitere Informationen finden Sie unter <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/video_similarity_search/object_detection">Milvus Bootcamp: Video-Objekt-Erkennungssystem</a>.</p>
<p><strong>Datenimport</strong></p>
<p>Der Prozess des Datenimports ist einfach. Konvertieren Sie die Daten in 2.048-dimensionale Vektoren und importieren Sie die Vektoren in Milvus.</p>
<pre><code translate="no" class="language-python">vector = image_encoder.execute(filename)
entities = [vector]
collection.insert(data=entities)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Video-Analyse</strong></p>
<p>Wie oben beschrieben, umfasst der Videoanalyseprozess die Erfassung von Videobildern, die Erkennung von Objekten in jedem Bild, die Extraktion von Vektoren aus den Objekten, die Berechnung der Vektorähnlichkeit mit der euklidischen Distanz (L2) und die Suche nach Ergebnissen mit Milvus.</p>
<pre><code translate="no" class="language-python">images = extract_frame(filename, 1, prefix)   
detector = Detector()   
run(detector, DATA_PATH)       
vectors = get_object_vector(image_encoder, DATA_PATH)
search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: 10}}
results = collection.search(vectors, param=search_params, <span class="hljs-built_in">limit</span>=10)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Conclusion" class="common-anchor-header">Schlussfolgerung<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Derzeit sind mehr als 80 % der Daten unstrukturiert. Mit der rasanten Entwicklung der KI wurden immer mehr Deep-Learning-Modelle für die Analyse unstrukturierter Daten entwickelt. Technologien wie die Objekterkennung und die Bildverarbeitung haben sowohl in der Wissenschaft als auch in der Industrie große Durchbrüche erzielt. Mit Hilfe dieser Technologien haben immer mehr KI-Plattformen die praktischen Anforderungen erfüllt.</p>
<p>Das in diesem Thema behandelte Videoanalysesystem wurde mit Milvus entwickelt, das eine schnelle Analyse von Videoinhalten ermöglicht.</p>
<p>Als Open-Source-Vektordatenbank unterstützt Milvus Feature-Vektoren, die mit verschiedenen Deep-Learning-Modellen extrahiert werden. Durch die Integration von Bibliotheken wie Faiss, NMSLIB und Annoy bietet Milvus eine Reihe intuitiver APIs, die das Umschalten von Indextypen je nach Szenario unterstützen. Darüber hinaus unterstützt Milvus die skalare Filterung, die die Wiederfindungsrate und die Suchflexibilität erhöht. Milvus wurde bereits in vielen Bereichen eingesetzt, wie z.B. Bildverarbeitung, Computer Vision, Verarbeitung natürlicher Sprache, Spracherkennung, Empfehlungssysteme und Entdeckung neuer Medikamente.</p>
<h2 id="References" class="common-anchor-header">Referenzen<button data-href="#References" class="anchor-icon" translate="no">
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
    </button></h2><p>[1] A. D. Bagdanov, L. Ballan, M. Bertini, A. Del Bimbo. "Trademark matching and retrieval in sports video databases". Proceedings of the international workshop on Workshop on multimedia information retrieval, ACM, 2007. https://www.researchgate.net/publication/210113141_Trademark_matching_and_retrieval_in_sports_video_databases</p>
<p>[2] J. Kleban, X. Xie, W.-Y. Ma. "Spatial pyramid mining for logo detection in natural scenes". IEEE International Conference, 2008. https://ieeexplore.ieee.org/document/4607625</p>
<p>[3] R. Boia, C. Florea, L. Florea, R. Dogaru. "Logo-Lokalisierung und -Erkennung in natürlichen Bildern unter Verwendung homographischer Klassendiagramme". Machine Vision and Applications 27 (2), 2016. https://link.springer.com/article/10.1007/s00138-015-0741-7</p>
<p>[4] R. Boia, C. Florea, L. Florea. "Elliptical asift agglomeration in class prototype for logo detection." BMVC, 2015. http://citeseerx.ist.psu.edu/viewdoc/download;jsessionid=5C87F52DE38AB0C90F8340DFEBB841F7?doi=10.1.1.707.9371&amp;rep=rep1&amp;type=pdf</p>
<p>[5] https://arxiv.org/abs/1804.02767</p>
<p>[6] https://paddlepaddle.org.cn/modelbasedetail/yolov3</p>
<p>[7] https://arxiv.org/abs/1512.03385</p>
