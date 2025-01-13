---
id: audio-retrieval-based-on-milvus.md
title: Verarbeitungstechnologien
author: Shiyu Chen
date: 2021-07-27T03:05:57.524Z
desc: >-
  Audio-Retrieval mit Milvus ermöglicht die Klassifizierung und Analyse von
  Klangdaten in Echtzeit.
cover: assets.zilliz.com/blog_audio_search_56b990cee5.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/audio-retrieval-based-on-milvus'
---
<custom-h1>Audio-Retrieval auf der Grundlage von Milvus</custom-h1><p>Ton ist ein sehr informationsreicher Datentyp. Auch wenn er im Zeitalter von Videoinhalten veraltet erscheinen mag, bleibt Audio für viele Menschen eine primäre Informationsquelle. Trotz des langfristigen Rückgangs der Hörerzahlen haben 83 % der Amerikaner ab 12 Jahren in einer bestimmten Woche im Jahr 2020 terrestrisches Radio (AM/FM) gehört (gegenüber 89 % im Jahr 2019). Im Gegensatz dazu hat die Zahl der Online-Audiohörer in den letzten zwei Jahrzehnten stetig zugenommen, wobei 62 % der Amerikaner laut derselben <a href="https://www.journalism.org/fact-sheet/audio-and-podcasting/">Studie des Pew Research Centers</a> wöchentlich irgendeine Form von Radio hören.</p>
<p>Als Welle hat der Schall vier Eigenschaften: Frequenz, Amplitude, Wellenform und Dauer. In der musikalischen Terminologie werden diese Eigenschaften als Tonhöhe, Dynamik, Klang und Dauer bezeichnet. Geräusche helfen auch Menschen und anderen Tieren, ihre Umwelt wahrzunehmen und zu verstehen, indem sie Hinweise auf den Standort und die Bewegung von Objekten in unserer Umgebung liefern.</p>
<p>Als Informationsträger kann Audio in drei Kategorien eingeteilt werden:</p>
<ol>
<li><strong>Sprache:</strong> Ein Kommunikationsmedium, das aus Wörtern und Grammatik besteht. Mit Spracherkennungsalgorithmen kann Sprache in Text umgewandelt werden.</li>
<li><strong>Musik:</strong> Gesangs- und/oder Instrumentalklänge, die zu einer Komposition aus Melodie, Harmonie, Rhythmus und Klangfarbe kombiniert werden. Musik kann durch eine Partitur dargestellt werden.</li>
<li><strong>Wellenform:</strong> Ein digitales Audiosignal, das durch die Digitalisierung von analogen Klängen gewonnen wird. Wellenformen können Sprache, Musik und natürliche oder synthetische Klänge darstellen.</li>
</ol>
<p>Audio-Retrieval kann zum Durchsuchen und Überwachen von Online-Medien in Echtzeit verwendet werden, um gegen Verstöße gegen Rechte an geistigem Eigentum vorzugehen. Sie spielt auch eine wichtige Rolle bei der Klassifizierung und statistischen Analyse von Audiodaten.</p>
<h2 id="Processing-Technologies" class="common-anchor-header">Verarbeitungstechnologien<button data-href="#Processing-Technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>Sprache, Musik und andere generische Klänge haben jeweils einzigartige Merkmale und erfordern unterschiedliche Verarbeitungsmethoden. In der Regel werden Audiodaten in Gruppen unterteilt, die Sprache enthalten, und in Gruppen, die keine Sprache enthalten:</p>
<ul>
<li>Gesprochene Audiodaten werden durch automatische Spracherkennung verarbeitet.</li>
<li>Nicht-sprachliche Audiodaten, wie Musik, Soundeffekte und digitalisierte Sprachsignale, werden mit Hilfe von Audio-Retrieval-Systemen verarbeitet.</li>
</ul>
<p>Dieser Artikel befasst sich mit der Verwendung eines Audio-Retrieval-Systems zur Verarbeitung von Nicht-Sprach-Audiodaten. Die Spracherkennung wird in diesem Artikel nicht behandelt.</p>
<h3 id="Audio-feature-extraction" class="common-anchor-header">Audio-Merkmalsextraktion</h3><p>Die Merkmalsextraktion ist die wichtigste Technologie in Audio-Retrieval-Systemen, da sie die Ähnlichkeitssuche von Audiodaten ermöglicht. Methoden zur Extraktion von Audiomerkmalen werden in zwei Kategorien unterteilt:</p>
<ul>
<li>Traditionelle Modelle zur Extraktion von Audiomerkmalen wie Gaussian Mixture Models (GMMs) und Hidden Markov Models (HMMs);</li>
<li>Modelle zur Extraktion von Audiomerkmalen, die auf Deep Learning basieren, wie z. B. rekurrente neuronale Netze (RNN), Netze mit Langzeitgedächtnis (LSTM), Kodierungs-Dekodierungs-Frameworks, Aufmerksamkeitsmechanismen usw.</li>
</ul>
<p>Auf Deep Learning basierende Modelle haben eine um eine Größenordnung niedrigere Fehlerrate als herkömmliche Modelle und gewinnen daher als Kerntechnologie im Bereich der Audiosignalverarbeitung an Bedeutung.</p>
<p>Audiodaten werden normalerweise durch die extrahierten Audiomerkmale dargestellt. Bei der Suche werden diese Merkmale und Attribute und nicht die Audiodaten selbst gesucht und verglichen. Daher hängt die Effektivität der Audio-Ähnlichkeitssuche weitgehend von der Qualität der Merkmalsextraktion ab.</p>
<p>In diesem Artikel werden <a href="https://github.com/qiuqiangkong/audioset_tagging_cnn">groß angelegte, vortrainierte neuronale Audionetzwerke für die Audio-Mustererkennung (PANNs)</a> verwendet, um Merkmalsvektoren zu extrahieren, die eine mittlere durchschnittliche Genauigkeit (mAP) von 0,439 erreichen (Hershey et al., 2017).</p>
<p>Nach der Extraktion der Merkmalsvektoren der Audiodaten können wir mit Milvus eine leistungsstarke Merkmalsvektoranalyse durchführen.</p>
<h3 id="Vector-similarity-search" class="common-anchor-header">Vektorielle Ähnlichkeitssuche</h3><p><a href="https://milvus.io/">Milvus</a> ist eine Cloud-native Open-Source-Vektordatenbank, die für die Verwaltung von Einbettungsvektoren entwickelt wurde, die von maschinellen Lernmodellen und neuronalen Netzen generiert werden. Sie wird häufig in Szenarien wie Computer Vision, natürliche Sprachverarbeitung, computergestützte Chemie, personalisierte Empfehlungssysteme und mehr eingesetzt.</p>
<p>Das folgende Diagramm zeigt den allgemeinen Prozess der Ähnlichkeitssuche mit Milvus: <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_does_milvus_work_6926180543.png" alt="how-does-milvus-work.png" class="doc-image" id="how-does-milvus-work.png" /><span>how-does-milvus-work.png</span> </span></p>
<ol>
<li>Unstrukturierte Daten werden von Deep Learning-Modellen in Merkmalsvektoren umgewandelt und in Milvus eingefügt.</li>
<li>Milvus speichert und indiziert diese Merkmalsvektoren.</li>
<li>Auf Anfrage sucht Milvus die Vektoren, die dem Abfragevektor am ähnlichsten sind, und gibt sie zurück.</li>
</ol>
<h2 id="System-overview" class="common-anchor-header">Überblick über das System<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Das Audio-Retrieval-System besteht hauptsächlich aus zwei Teilen: Einfügen (schwarze Linie) und Suchen (rote Linie).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/audio_retrieval_system_663a911c95.png" alt="audio-retrieval-system.png" class="doc-image" id="audio-retrieval-system.png" />
   </span> <span class="img-wrapper"> <span>audio-retrieval-system.png</span> </span></p>
<p>Der in diesem Projekt verwendete Beispieldatensatz enthält Open-Source-Spielesounds, und der Code ist im <a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/audio_similarity_search">Milvus-Bootcamp</a> ausführlich beschrieben.</p>
<h3 id="Step-1-Insert-data" class="common-anchor-header">Schritt 1: Daten einfügen</h3><p>Nachfolgend finden Sie den Beispielcode zur Erzeugung von Audioeinbettungen mit dem vortrainierten PANNs-Inferenzmodell und zum Einfügen in Milvus, das jeder Vektoreinbettung eine eindeutige ID zuweist.</p>
<pre><code translate="no"><span class="hljs-number">1</span> wav_name, vectors_audio = get_audio_embedding(audio_path)  
<span class="hljs-number">2</span> <span class="hljs-keyword">if</span> vectors_audio:    
<span class="hljs-number">3</span>     embeddings.<span class="hljs-built_in">append</span>(vectors_audio)  
<span class="hljs-number">4</span>     wav_names.<span class="hljs-built_in">append</span>(wav_name)  
<span class="hljs-number">5</span> ids_milvus = insert_vectors(milvus_client, table_name, embeddings)  
<span class="hljs-number">6</span> 
<button class="copy-code-btn"></button></code></pre>
<p>Die zurückgegebenen <strong>ids_milvus</strong> werden dann zusammen mit anderen relevanten Informationen (z.B. <strong>wav_name</strong>) für die Audiodaten in einer MySQL-Datenbank zur weiteren Verarbeitung gespeichert.</p>
<pre><code translate="no">1 get_ids_correlation(ids_milvus, wav_name)  
2 load_data_to_mysql(conn, cursor, table_name)    
3  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Audio-search" class="common-anchor-header">Schritt 2: Audio-Suche</h3><p>Milvus berechnet die innere Produktdistanz zwischen den vorgespeicherten Merkmalsvektoren und den Eingabe-Merkmalsvektoren, die aus den abgefragten Audiodaten mit Hilfe des PANNs-Inferenzmodells extrahiert wurden, und gibt die <strong>ids_milvus</strong> ähnlicher Merkmalsvektoren zurück, die den gesuchten Audiodaten entsprechen.</p>
<pre><code translate="no"><span class="hljs-number">1</span> _, vectors_audio = get_audio_embedding(audio_filename)    
<span class="hljs-number">2</span> results = search_vectors(milvus_client, table_name, [vectors_audio], METRIC_TYPE, TOP_K)  
<span class="hljs-number">3</span> ids_milvus = [x.<span class="hljs-built_in">id</span> <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]  
<span class="hljs-number">4</span> audio_name = search_by_milvus_ids(conn, cursor, ids_milvus, table_name)    
<span class="hljs-number">5</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="API-reference-and-demo" class="common-anchor-header">API-Referenz und Demo<button data-href="#API-reference-and-demo" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="API" class="common-anchor-header">API</h3><p>Dieses Audio-Retrieval-System wurde mit Open-Source-Code entwickelt. Seine Hauptfunktionen sind das Einfügen und Löschen von Audiodaten. Alle APIs können durch Eingabe von <strong>127.0.0.1:<port></strong> /docs in den Browser eingesehen werden.</p>
<h3 id="Demo" class="common-anchor-header">Demo</h3><p>Wir stellen eine <a href="https://zilliz.com/solutions">Live-Demo</a> des Milvus-basierten Audio-Retrieval-Systems online, die Sie mit Ihren eigenen Audiodaten ausprobieren können.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/audio_search_demo_cae60625db.png" alt="audio-search-demo.png" class="doc-image" id="audio-search-demo.png" />
   </span> <span class="img-wrapper"> <span>audio-suche-demo.png</span> </span></p>
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
    </button></h2><p>Im Zeitalter von Big Data ist das Leben der Menschen voll von Informationen aller Art. Um diese besser zu verstehen, reicht die traditionelle Textsuche nicht mehr aus. Die heutige Information Retrieval Technologie benötigt dringend die Abfrage verschiedener unstrukturierter Datentypen, wie Videos, Bilder und Audio.</p>
<p>Unstrukturierte Daten, die für Computer nur schwer zu verarbeiten sind, können mithilfe von Deep-Learning-Modellen in Merkmalsvektoren umgewandelt werden. Diese umgewandelten Daten können problemlos von Maschinen verarbeitet werden, so dass wir unstrukturierte Daten auf eine Weise analysieren können, die unseren Vorgängern nicht möglich war. Milvus, eine Open-Source-Vektordatenbank, kann die von KI-Modellen extrahierten Merkmalsvektoren effizient verarbeiten und bietet eine Reihe von gängigen Vektorähnlichkeitsberechnungen.</p>
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
    </button></h2><p>Hershey, S., Chaudhuri, S., Ellis, D.P., Gemmeke, J.F., Jansen, A., Moore, R.C., Plakal, M., Platt, D., Saurous, R.A., Seybold, B. und Slaney, M., 2017, March. CNN-Architekturen für groß angelegte Audioklassifikation. In 2017 IEEE International Conference on Acoustics, Speech and Signal Processing (ICASSP), pp. 131-135, 2017</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">Don't be a stranger<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><p>Finden Sie Milvus auf <a href="https://github.com/milvus-io/milvus/">GitHub</a> oder tragen Sie dazu bei.</p></li>
<li><p>Interagieren Sie mit der Community über <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</p></li>
<li><p>Verbinden Sie sich mit uns auf <a href="https://twitter.com/milvusio">Twitter</a>.</p></li>
</ul>
