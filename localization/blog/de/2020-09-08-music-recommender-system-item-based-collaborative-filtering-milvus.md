---
id: music-recommender-system-item-based-collaborative-filtering-milvus.md
title: "\U0001F50E Auswahl einer Suchmaschine für Einbettungsähnlichkeit"
author: milvus
date: 2020-09-08T00:01:59.064Z
desc: Eine Fallstudie mit WANYIN APP
cover: assets.zilliz.com/header_f8cea596d2.png
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/music-recommender-system-item-based-collaborative-filtering-milvus
---
<custom-h1>Item-basierte kollaborative Filterung für Musikempfehlungssysteme</custom-h1><p>Die Wanyin App ist eine KI-basierte Musik-Community, die den Austausch von Musik fördern und Musikliebhabern das Komponieren erleichtern soll.</p>
<p>Die Bibliothek von Wanyin enthält eine riesige Menge an Musik, die von Benutzern hochgeladen wurde. Die Hauptaufgabe besteht darin, die Musik, die für den Nutzer von Interesse ist, auf der Grundlage seines bisherigen Verhaltens auszusortieren. Wir haben zwei klassische Modelle evaluiert: benutzerbasierte kollaborative Filterung (User-based CF) und artikelbasierte kollaborative Filterung (Item-based CF) als mögliche Modelle für Empfehlungssysteme.</p>
<ul>
<li>Benutzerbasierte CF verwendet Ähnlichkeitsstatistiken, um benachbarte Benutzer mit ähnlichen Vorlieben oder Interessen zu ermitteln. Anhand der ermittelten nächsten Nachbarn kann das System die Interessen des Zielbenutzers vorhersagen und Empfehlungen generieren.</li>
<li>Die von Amazon eingeführte artikelbasierte CF, oder Item-to-Item (I2I) CF, ist ein bekanntes kollaboratives Filtermodell für Empfehlungssysteme. Es berechnet Ähnlichkeiten zwischen Elementen und nicht zwischen Benutzern, basierend auf der Annahme, dass Elemente von Interesse den Elementen mit hoher Punktzahl ähnlich sein müssen.</li>
</ul>
<p>Nutzerbasierter CF kann ab einer bestimmten Anzahl von Nutzern zu einer unverhältnismäßig langen Berechnungszeit führen. In Anbetracht der Eigenschaften unseres Produkts haben wir uns bei der Implementierung des Musikempfehlungssystems für I2I CF entschieden. Da wir nicht viele Metadaten über die Lieder besitzen, müssen wir uns mit den Liedern an sich befassen und Merkmalsvektoren (Einbettungen) aus ihnen extrahieren. Unser Ansatz besteht darin, diese Lieder in ein Mel-Frequenz-Cepstrum (MFC) zu konvertieren, ein Faltungsneuronales Netzwerk (CNN) zu entwickeln, um die Merkmalseinbettungen der Lieder zu extrahieren, und dann durch eine Ähnlichkeitssuche nach Einbettungen Musikempfehlungen zu geben.</p>
<h2 id="🔎-Select-an-embedding-similarity-search-engine" class="common-anchor-header">🔎 Auswahl einer Suchmaschine für Einbettungsähnlichkeit<button data-href="#🔎-Select-an-embedding-similarity-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Nachdem wir nun die Merkmalsvektoren haben, bleibt die Frage, wie wir aus der großen Menge von Vektoren diejenigen herausfinden, die dem Zielvektor ähnlich sind. Was die Suchmaschine für Einbettungen betrifft, so haben wir zwischen Faiss und Milvus abgewogen. Ich bin auf Milvus aufmerksam geworden, als ich im November 2019 die Trending Repositories von GitHub durchging. Ich warf einen Blick auf das Projekt und es gefiel mir mit seinen abstrakten APIs. (Damals war es auf v0.5.x und jetzt auf v0.10.2.)</p>
<p>Wir bevorzugen Milvus gegenüber Faiss. Einerseits haben wir Faiss schon früher benutzt und wollten daher etwas Neues ausprobieren. Andererseits ist Faiss im Vergleich zu Milvus eher eine zugrundeliegende Bibliothek und daher nicht ganz so bequem zu benutzen. Als wir mehr über Milvus erfuhren, entschieden wir uns schließlich für Milvus wegen seiner beiden Hauptmerkmale:</p>
<ul>
<li>Milvus ist sehr einfach zu benutzen. Alles, was Sie tun müssen, ist, sein Docker-Image zu ziehen und die Parameter auf der Grundlage Ihres eigenen Szenarios zu aktualisieren.</li>
<li>Milvus unterstützt mehrere Indizes und verfügt über eine ausführliche Dokumentation.</li>
</ul>
<p>Kurz gesagt, Milvus ist sehr benutzerfreundlich und die Dokumentation ist sehr ausführlich. Wenn Sie auf ein Problem stoßen, können Sie in der Regel Lösungen in der Dokumentation finden; andernfalls können Sie jederzeit Unterstützung von der Milvus-Community erhalten.</p>
<h2 id="Milvus-cluster-service-☸️-⏩" class="common-anchor-header">Milvus-Clusterdienst ☸️ ⏩<button data-href="#Milvus-cluster-service-☸️-⏩" class="anchor-icon" translate="no">
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
    </button></h2><p>Nachdem wir uns entschieden hatten, Milvus als Feature-Vektor-Suchmaschine zu verwenden, konfigurierten wir einen eigenständigen Knoten in einer Entwicklungsumgebung (DEV). Er lief einige Tage lang gut, so dass wir planten, die Tests in einer FAT-Umgebung (Factory Acceptance Test) durchzuführen. Wenn ein Standalone-Knoten in der Produktionsumgebung ausfiele, würde der gesamte Dienst nicht mehr verfügbar sein. Wir mussten also einen hochverfügbaren Suchdienst einrichten.</p>
<p>Milvus bietet sowohl Mishards, eine Cluster-Sharding-Middleware, als auch Milvus-Helm für die Konfiguration. Der Prozess der Bereitstellung eines Milvus-Clusterdienstes ist einfach. Wir müssen nur einige Parameter aktualisieren und sie für die Bereitstellung in Kubernetes packen. Das folgende Diagramm aus der Milvus-Dokumentation zeigt, wie Mishards funktioniert:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_how_mishards_works_in_milvus_documentation_43a73076bf.png" alt="1-how-mishards-works-in-milvus-documentation.png" class="doc-image" id="1-how-mishards-works-in-milvus-documentation.png" />
   </span> <span class="img-wrapper"> <span>1-how-mishards-works-in-milvus-documentation.png</span> </span></p>
<p>Mishards kaskadiert eine Anfrage vom Upstream bis hinunter zu seinen Untermodulen, die die Upstream-Anfrage aufteilen, und sammelt dann die Ergebnisse der Unterdienste und gibt sie an den Upstream zurück. Die Gesamtarchitektur der Mishards-basierten Clusterlösung ist unten dargestellt:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_mishards_based_cluster_solution_architecture_3ad89cf269.jpg" alt="2-mishards-based-cluster-solution-architecture.jpg" class="doc-image" id="2-mishards-based-cluster-solution-architecture.jpg" />
   </span> <span class="img-wrapper"> <span>2-mishards-based-cluster-solution-architecture.jpg</span> </span></p>
<p>Die offizielle Dokumentation bietet eine klare Einführung in Mishards. Sie können sich bei Interesse auf <a href="https://milvus.io/cn/docs/v0.10.2/mishards.md">Mishards</a> beziehen.</p>
<p>In unserem Musik-Empfehlungssystem haben wir einen beschreibbaren Knoten, zwei schreibgeschützte Knoten und eine Mishards-Middleware-Instanz in Kubernetes unter Verwendung von Milvus-Helm implementiert. Nachdem der Dienst eine Zeit lang stabil in einer FAT-Umgebung lief, haben wir ihn in die Produktion überführt. Bis jetzt läuft er stabil.</p>
<h2 id="🎧-I2I-music-recommendation-🎶" class="common-anchor-header">🎧 I2I-Musikempfehlung 🎶<button data-href="#🎧-I2I-music-recommendation-🎶" class="anchor-icon" translate="no">
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
    </button></h2><p>Wie bereits erwähnt, haben wir das I2I-Musikempfehlungssystem von Wanyin mit Hilfe der extrahierten Einbettungen der vorhandenen Lieder aufgebaut. Zunächst trennten wir den Gesang und die BGM (Spurtrennung) eines neuen, vom Nutzer hochgeladenen Liedes und extrahierten die BGM-Einbettungen als Merkmalsdarstellung des Liedes. Dies hilft auch dabei, Coverversionen von Originalsongs auszusortieren. Anschließend speicherten wir diese Einbettungen in Milvus, suchten nach ähnlichen Liedern auf der Grundlage der Lieder, die der Benutzer gehört hatte, und sortierten und ordneten die gefundenen Lieder neu an, um Musikempfehlungen zu erstellen. Der Implementierungsprozess ist unten dargestellt:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_music_recommender_system_implementation_c52a333eb8.png" alt="3-music-recommender-system-implementation.png" class="doc-image" id="3-music-recommender-system-implementation.png" />
   </span> <span class="img-wrapper"> <span>3-music-recommender-system-implementation.png</span> </span></p>
<h2 id="🚫-Duplicate-song-filter" class="common-anchor-header">🚫 Filter für doppelte Lieder<button data-href="#🚫-Duplicate-song-filter" class="anchor-icon" translate="no">
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
    </button></h2><p>Ein weiteres Szenario, in dem wir Milvus verwenden, ist die Filterung von doppelten Songs. Einige Nutzer laden denselben Song oder Clip mehrmals hoch, und diese doppelten Songs können in ihrer Empfehlungsliste erscheinen. Das bedeutet, dass es die Nutzererfahrung beeinträchtigen würde, wenn die Empfehlungen ohne Vorverarbeitung erstellt würden. Daher müssen wir die doppelten Songs herausfinden und sicherstellen, dass sie nicht in der gleichen Liste erscheinen, indem wir sie vorverarbeiten.</p>
<p>Ein weiteres Szenario, in dem wir Milvus verwenden, ist die Filterung von doppelten Songs. Einige Nutzer laden denselben Song oder Clip mehrmals hoch, und diese doppelten Songs können in ihrer Empfehlungsliste erscheinen. Das bedeutet, dass es die Benutzerfreundlichkeit beeinträchtigen würde, wenn die Empfehlungen ohne Vorverarbeitung erstellt würden. Daher müssen wir die doppelten Songs herausfinden und sicherstellen, dass sie nicht in der gleichen Liste erscheinen, indem wir sie vorverarbeiten.</p>
<p>Genau wie im vorherigen Szenario haben wir die Filterung doppelter Songs durch die Suche nach ähnlichen Merkmalsvektoren implementiert. Zunächst trennten wir den Gesang und die BGM und suchten mit Milvus eine Reihe ähnlicher Songs. Um doppelte Songs genau herauszufiltern, extrahierten wir die Audio-Fingerabdrücke des Zielsongs und der ähnlichen Songs (mit Technologien wie Echoprint, Chromaprint usw.) und berechneten die Ähnlichkeit zwischen dem Audio-Fingerabdruck des Zielsongs und jedem der Fingerabdrücke der ähnlichen Songs. Wenn die Ähnlichkeit den Schwellenwert überschreitet, definieren wir einen Titel als Duplikat des Zieltitels. Der Prozess des Audio-Fingerabdruck-Abgleichs macht die Filterung doppelter Songs genauer, ist aber auch zeitaufwändig. Wenn es darum geht, Lieder in einer umfangreichen Musikbibliothek zu filtern, verwenden wir daher Milvus, um unsere Kandidaten für doppelte Lieder in einem ersten Schritt zu filtern.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_using_milvus_filter_songs_music_recommender_duplicates_0ff68d3e67.png" alt="4-using-milvus-filter-songs-music-recommender-duplicates.png" class="doc-image" id="4-using-milvus-filter-songs-music-recommender-duplicates.png" />
   </span> <span class="img-wrapper"> <span>4-benutzen-milvus-filtern-songs-musik-empfehlungsgeber-duplikate.png</span> </span></p>
<p>Um das I2I-Empfehlungssystem für die riesige Musikbibliothek von Wanyin zu implementieren, extrahieren wir die Einbettungen von Liedern als deren Merkmal, rufen ähnliche Einbettungen wie die Einbettung des Ziellieds ab und sortieren und ordnen die Ergebnisse neu, um Empfehlungslisten für den Benutzer zu erstellen. Um Echtzeit-Empfehlungen zu erhalten, haben wir uns für Milvus und nicht für Faiss als Suchmaschine für die Ähnlichkeit von Feature-Vektoren entschieden, da sich Milvus als benutzerfreundlicher und ausgereifter erweist. Aus demselben Grund haben wir Milvus auch für unseren Filter für doppelte Songs eingesetzt, was die Benutzerfreundlichkeit und Effizienz verbessert.</p>
<p>Sie können die <a href="https://enjoymusic.ai/wanyin">Wanyin App</a> 🎶 herunterladen und ausprobieren. (Hinweis: ist möglicherweise nicht in allen App-Stores verfügbar).</p>
<h3 id="📝-Authors" class="common-anchor-header">📝 Autoren:</h3><p>Jason, Algorithmusingenieur bei Stepbeats Shiyu Chen, Dateningenieur bei Zilliz</p>
<h3 id="📚-References" class="common-anchor-header">📚 Referenzen:</h3><p>Mishards Docs: https://milvus.io/docs/v0.10.2/mishards.md Mishards: https://github.com/milvus-io/milvus/tree/master/shards Milvus-Helm: https://github.com/milvus-io/milvus-helm/tree/master/charts/milvus</p>
<p><strong>🤗 Seien Sie kein Fremder, folgen Sie uns auf <a href="https://twitter.com/milvusio/">Twitter</a> oder schließen Sie sich uns auf <a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/">Slack</a> an! 👇🏻</strong></p>
