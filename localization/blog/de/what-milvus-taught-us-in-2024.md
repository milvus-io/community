---
id: what-milvus-taught-us-in-2024.md
title: Was uns die Milvus-Benutzer im Jahr 2024 gelehrt haben
author: Stefan Webb
date: 2025-02-18T00:00:00.000Z
desc: >-
  Schaut euch die am häufigsten gestellten Fragen über Milvus in unserem Discord
  an.
cover: assets.zilliz.com/What_Milvus_Users_Taught_Us_in_2024_db63863725.png
tag: Engineering
tags: null
recommend: true
canonicalUrl: 'https://milvus.io/blog/what-milvus-taught-us-in-2024.md'
---
<h2 id="Overview" class="common-anchor-header">Überblick<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Während Milvus im Jahr 2024 mit wichtigen Veröffentlichungen und einem florierenden Open-Source-Ökosystem florierte, bildete sich in unserer Community auf <a href="https://discord.gg/xwqmFDURcz">Discord</a> im Stillen ein verborgener Schatz an Nutzererkenntnissen. Diese Zusammenstellung von Community-Diskussionen bot eine einzigartige Gelegenheit, die Herausforderungen unserer Benutzer aus erster Hand zu verstehen. Fasziniert von dieser ungenutzten Ressource begann ich mit einer umfassenden Analyse aller Diskussionsstränge des Jahres, um nach Mustern zu suchen, die uns bei der Zusammenstellung einer Ressource für häufig gestellte Fragen für Milvus-Nutzer helfen könnten.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/top_image_6bbdbe8caa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Meine Analyse ergab drei Hauptbereiche, in denen die Benutzer immer wieder nach Rat suchten: <strong>Leistungsoptimierung</strong>, <strong>Bereitstellungsstrategien</strong> und <strong>Datenmanagement</strong>. Die Benutzer diskutierten häufig darüber, wie sie Milvus für Produktionsumgebungen feinabstimmen und Leistungsmetriken effektiv verfolgen können. Was die Bereitstellung anbelangt, so befasste sich die Community mit der Auswahl geeigneter Bereitstellungen, der Auswahl optimaler Suchindizes und der Lösung von Problemen in verteilten Konfigurationen. Bei der Datenverwaltung ging es um Strategien für die Datenmigration von Dienst zu Dienst und um die Auswahl von Einbettungsmodellen.</p>
<p>Lassen Sie uns jeden dieser Bereiche genauer untersuchen.</p>
<h2 id="Deployment" class="common-anchor-header">Bereitstellung<button data-href="#Deployment" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/deployment_c951c46339.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus bietet flexible Bereitstellungsmodi, die für verschiedene Anwendungsfälle geeignet sind. Einige Benutzer finden es jedoch schwierig, die richtige Wahl zu treffen, und möchten sich sicher sein, dass sie dies "richtig" tun.</p>
<h3 id="Which-deployment-type-should-I-choose" class="common-anchor-header">Welche Bereitstellungsart soll ich wählen?</h3><p>Eine sehr häufig gestellte Frage ist die nach dem richtigen Einsatz von Milvus <a href="https://milvus.io/docs/milvus_lite.md">Lite</a>, <a href="https://milvus.io/docs/prerequisite-docker.md">Standalone</a> und <a href="https://milvus.io/docs/prerequisite-helm.md">Distributed</a>. Die Antwort hängt in erster Linie davon ab, wie groß Ihre Vektordatenbank sein muss und wie viel Datenverkehr sie bedienen wird:</p>
<h4 id="Milvus-Lite" class="common-anchor-header">Milvus Lite</h4><p>Wenn Sie auf Ihrem lokalen System Prototypen mit bis zu ein paar Millionen Vektoren erstellen oder eine eingebettete Vektordatenbank für Unit-Tests und CI/CD suchen, können Sie Milvus Lite verwenden. Beachten Sie, dass einige fortgeschrittene Funktionen wie die Volltextsuche in Milvus Lite noch nicht verfügbar sind, aber in Kürze verfügbar sein werden.</p>
<h4 id="Milvus-Standalone" class="common-anchor-header">Milvus Eigenständig</h4><p>Wenn Ihr System den Produktionsverkehr bedienen muss und/oder Sie zwischen ein paar Millionen und hundert Millionen Vektoren speichern müssen, sollten Sie Milvus Standalone verwenden, das alle Komponenten von Milvus in ein einziges Docker-Image packt. Es gibt eine Variante, die lediglich die Abhängigkeiten von persistentem Speicher (minio) und Metadatenspeicher (etcd) als separate Images auslagert.</p>
<h4 id="Milvus-Distributed" class="common-anchor-header">Milvus Verteilt</h4><p>Für größere Implementierungen, die den Produktionsverkehr bedienen, wie die Bereitstellung von Milliarden von Vektoren bei Tausenden von QPS, sollten Sie Milvus Distributed verwenden. Einige Benutzer möchten vielleicht eine Offline-Stapelverarbeitung im großen Maßstab durchführen, z. B. für die Datendeduplizierung oder die Verknüpfung von Datensätzen. Die künftige Version von Milvus 3.0 wird eine effizientere Möglichkeit bieten, dies mit Hilfe eines so genannten Vektorsees zu tun.</p>
<h4 id="Fully-Managed-Service" class="common-anchor-header">Vollständig verwalteter Service</h4><p>Für Entwickler, die sich auf die Anwendungsentwicklung konzentrieren möchten, ohne sich um DevOps zu kümmern, bietet <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> das vollständig verwaltete Milvus mit einem kostenlosen Tier.</p>
<p>Weitere Informationen finden Sie unter <a href="https://milvus.io/docs/install-overview.md#Choose-the-Right-Deployment-for-Your-Use-Case">"Überblick über Milvus-Bereitstellungen"</a>.</p>
<h3 id="How-much-memory-storage-and-compute-will-I-require" class="common-anchor-header">Wie viel Arbeitsspeicher, Speicher und Rechenleistung benötige ich?</h3><p>Diese Frage stellt sich häufig, nicht nur für bestehende Milvus-Nutzer, sondern auch für diejenigen, die überlegen, ob Milvus für ihre Anwendung geeignet ist. Die genaue Kombination von Arbeitsspeicher, Speicherplatz und Rechenleistung, die für eine Anwendung benötigt wird, hängt von einer komplexen Interaktion von Faktoren ab.</p>
<p>Vektoreinbettungen unterscheiden sich in ihrer Dimensionalität aufgrund des verwendeten Modells. Und einige Vektorsuchindizes werden vollständig im Speicher abgelegt, während andere die Daten auf der Festplatte speichern. Außerdem sind viele Suchindizes in der Lage, eine komprimierte (quantisierte) Kopie der Einbettungen zu speichern und benötigen zusätzlichen Speicher für Graphdatenstrukturen. Dies sind nur einige der Faktoren, die sich auf den Speicher und die Speicherung auswirken.</p>
<h4 id="Milvus-Resource-Sizing-Tool" class="common-anchor-header">Milvus Tool zur Größenbestimmung der Ressourcen</h4><p>Glücklicherweise hat Zilliz (das Team, das Milvus pflegt) <a href="https://milvus.io/tools/sizing">ein Tool zur Größenbestimmung der Ressourcen</a> entwickelt, das diese Frage hervorragend beantwortet. Geben Sie die Dimensionalität Ihres Vektors, den Index-Typ, die Bereitstellungsoptionen usw. ein, und das Tool schätzt den CPU-, Arbeitsspeicher- und Speicherbedarf für die verschiedenen Arten von Milvus-Knoten und deren Abhängigkeiten. Ein echter Belastungstest mit Ihren Daten und einem Beispielverkehr ist daher immer eine gute Idee.</p>
<h3 id="Which-vector-index-or-distance-metric-should-I-choose" class="common-anchor-header">Welchen Vektorindex oder welche Distanzmetrik soll ich wählen?</h3><p>Viele Benutzer sind unsicher, welchen Index sie wählen sollen und wie sie die Hyperparameter einstellen sollen. Zunächst ist es immer möglich, die Wahl des Index-Typs an Milvus zu delegieren, indem Sie AUTOINDEX auswählen. Wenn Sie jedoch einen bestimmten Indextyp wählen möchten, können Sie sich an einigen Faustregeln orientieren.</p>
<h4 id="In-Memory-Indexes" class="common-anchor-header">In-Memory-Indizes</h4><p>Möchten Sie die Kosten tragen, um Ihren Index vollständig im Speicher unterzubringen? Ein In-Memory-Index ist in der Regel der schnellste, aber auch der teuerste. Unter <a href="https://milvus.io/docs/index.md?tab=floating">"In-Memory-Indizes"</a> finden Sie eine Liste der von Milvus unterstützten Indizes und die Kompromisse, die sie in Bezug auf Latenz, Speicher und Abruf eingehen.</p>
<p>Denken Sie daran, dass Ihre Indexgröße nicht einfach die Anzahl der Vektoren mal deren Dimensionalität und Fließkommagröße ist. Die meisten Indizes quantisieren die Vektoren, um den Speicherbedarf zu verringern, benötigen aber Speicher für zusätzliche Datenstrukturen. Andere Nicht-Vektordaten (skalar) und ihr Index benötigen ebenfalls Speicherplatz.</p>
<h4 id="On-Disk-Indexes" class="common-anchor-header">On-Disk-Indizes</h4><p>Wenn Ihr Index nicht in den Speicher passt, können Sie einen der von Milvus bereitgestellten <a href="https://milvus.io/docs/disk_index.md">"On-Disk-Indizes</a> " verwenden. Zwei Möglichkeiten mit sehr unterschiedlichen Latenz/Ressourcen-Verhältnissen sind <a href="https://milvus.io/docs/disk_index.md">DiskANN</a> und <a href="https://milvus.io/docs/mmap.md#MMap-enabled-Data-Storage">MMap</a>.</p>
<p>DiskANN speichert eine stark komprimierte Kopie der Vektoren im Speicher und die unkomprimierten Vektoren und Graphsuchstrukturen auf der Festplatte. Es verwendet einige clevere Ideen, um den Vektorraum zu durchsuchen und gleichzeitig die Lesevorgänge auf der Festplatte zu minimieren, und nutzt die schnelle Zufallszugriffsgeschwindigkeit von SSDs. Um die Latenzzeit zu minimieren, muss die SSD für eine optimale E/A-Leistung über NVMe und nicht über SATA angeschlossen sein.</p>
<p>Technisch gesehen ist MMap kein Indextyp, sondern bezieht sich auf die Verwendung von virtuellem Speicher mit einem speicherinternen Index. Mit virtuellem Speicher können Seiten je nach Bedarf zwischen Festplatte und RAM ausgetauscht werden, wodurch ein viel größerer Index effizient genutzt werden kann, wenn die Zugriffsmuster so sind, dass jeweils nur ein kleiner Teil der Daten verwendet wird.</p>
<p>DiskANN hat eine ausgezeichnete und konstante Latenzzeit. MMap hat sogar eine noch bessere Latenz, wenn es auf eine Seite im Speicher zugreift, aber häufiges Page-Swapping verursacht Latenzspitzen. Daher kann die Latenz von MMap je nach Speicherzugriffsmuster stärker schwanken.</p>
<h4 id="GPU-Indexes" class="common-anchor-header">GPU-Indizes</h4><p>Eine dritte Möglichkeit besteht darin, <a href="https://milvus.io/docs/gpu_index.md">einen Index unter Verwendung von GPU-Speicher und -Rechenleistung</a> zu erstellen. Die GPU-Unterstützung von Milvus wird vom Nvidia <a href="https://rapids.ai/">RAPIDS-Team</a> beigesteuert. Die GPU-Vektorsuche kann eine geringere Latenz aufweisen als eine entsprechende CPU-Suche, obwohl normalerweise Hunderte oder Tausende von Such-QPS erforderlich sind, um die Parallelität der GPU voll auszunutzen. Außerdem verfügen GPUs in der Regel über weniger Speicher als der CPU-RAM und sind in der Ausführung teurer.</p>
<h4 id="Distance-Metrics" class="common-anchor-header">Abstandsmetriken</h4><p>Eine einfacher zu beantwortende Frage ist, welche Abstandsmetrik Sie zur Messung der Ähnlichkeit zwischen Vektoren wählen sollten. Es wird empfohlen, die gleiche Abstandsmetrik zu wählen, mit der Ihr Einbettungsmodell trainiert wurde, d. h. in der Regel COSINE (oder IP, wenn die Eingaben normalisiert sind). Die Quelle Ihres Modells (z. B. die Modellseite auf HuggingFace) gibt Aufschluss darüber, welche Distanzmetrik verwendet wurde. Zilliz hat auch eine praktische <a href="https://zilliz.com/ai-models">Tabelle</a> zusammengestellt, in der man das nachschlagen kann.</p>
<p>Zusammenfassend lässt sich sagen, dass meiner Meinung nach ein Großteil der Unsicherheit bei der Wahl des Index auf die Unsicherheit darüber zurückzuführen ist, wie sich diese Entscheidungen auf den Kompromiss zwischen Latenz, Ressourcennutzung und Rückruf bei Ihrer Bereitstellung auswirken. Ich empfehle, die oben genannten Faustregeln zu verwenden, um zwischen In-Memory-, On-Disk- oder GPU-Indizes zu entscheiden, und dann die in der Milvus-Dokumentation angegebenen Tradeoff-Richtlinien zu verwenden, um einen bestimmten Index auszuwählen.</p>
<h3 id="Can-you-fix-my-broken-Milvus-Distributed-deployment" class="common-anchor-header">Können Sie meinen fehlerhaften Milvus Distributed Einsatz reparieren?</h3><p>Viele Fragen drehen sich um Probleme bei der Inbetriebnahme einer Milvus Distributed-Installation, mit Fragen zur Konfiguration, zum Tooling und zu Debugging-Protokollen. Es ist schwer, eine einzige Lösung zu geben, da sich jede Frage von der vorherigen zu unterscheiden scheint. Glücklicherweise hat Milvus <a href="https://milvus.io/discord">einen lebhaften Discord</a>, in dem Sie Hilfe suchen können, und wir bieten auch <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">1-on-1 Sprechstunden mit einem Experten</a> an.</p>
<h3 id="How-do-I-deploy-Milvus-on-Windows" class="common-anchor-header">Wie kann ich Milvus unter Windows einsetzen?</h3><p>Eine Frage, die immer wieder auftaucht, ist, wie man Milvus auf Windows-Rechnern einsetzt. Auf der Grundlage Ihrer Rückmeldungen haben wir die Dokumentation dazu neu geschrieben: siehe <a href="https://milvus.io/docs/install_standalone-windows.md">Ausführen von Milvus in Docker (Windows)</a> für die Verwendung von <a href="https://learn.microsoft.com/en-us/windows/wsl/about#what-is-wsl-2">Windows Subsystem for Linux 2 (WSL2)</a>.</p>
<h2 id="Performance-and-Profiling" class="common-anchor-header">Leistung und Profiling<button data-href="#Performance-and-Profiling" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/Performance_and_Profiling_481975ea1d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nachdem sie sich für einen Bereitstellungstyp entschieden und ihn zum Laufen gebracht haben, möchten die Benutzer sicher sein, dass sie optimale Entscheidungen getroffen haben, und möchten ein Profil der Leistung und des Zustands ihrer Bereitstellung erstellen. Viele Fragen beziehen sich darauf, wie man ein Leistungsprofil erstellt, den Zustand beobachtet und einen Einblick in die Ursachen erhält.</p>
<h3 id="How-do-I-measure-performance" class="common-anchor-header">Wie kann ich die Leistung messen?</h3><p>Die Benutzer möchten die Kennzahlen zur Leistung ihrer Bereitstellung überprüfen, um Engpässe zu verstehen und zu beheben. Zu den genannten Metriken gehören die durchschnittliche Abfragelatenz, die Verteilung der Latenzen, das Abfragevolumen, die Speichernutzung, der Festplattenspeicher und so weiter. Diese Metriken können über das <a href="https://milvus.io/docs/monitor_overview.md">Überwachungssystem</a> beobachtet werden. Darüber hinaus führt Milvus 2.5 ein neues Tool namens <a href="https://milvus.io/docs/milvus-webui.md#Milvus-WebUI">WebUI</a> ein (Feedback willkommen!), mit dem Sie über eine benutzerfreundliche Weboberfläche auf weitere systeminterne Informationen wie den Segmentverdichtungsstatus zugreifen können.</p>
<h3 id="What’s-happening-inside-Milvus-right-now-ie-observe-state" class="common-anchor-header">Was passiert gerade in Milvus (d.h. Status beobachten)?</h3><p>In diesem Zusammenhang möchten die Benutzer den internen Zustand ihres Einsatzes beobachten. Zu den aufgeworfenen Fragen gehört, warum der Aufbau eines Suchindexes so lange dauert, wie man feststellen kann, ob der Cluster gesund ist, und wie eine Abfrage über die Knoten hinweg ausgeführt wird. Viele dieser Fragen können mit der neuen <a href="https://milvus.io/docs/milvus-webui.md#Milvus-WebUI">WebUI</a> beantwortet werden, die Transparenz darüber schafft, was das System intern tut.</p>
<h3 id="How-does-some-complex-aspect-of-the-internals-work" class="common-anchor-header">Wie funktioniert ein (komplexer) Aspekt der Interna?</h3><p>Fortgeschrittene Benutzer möchten oft ein gewisses Verständnis für die Interna von Milvus haben, zum Beispiel ein Verständnis für die Versiegelung von Segmenten oder die Speicherverwaltung. Das zugrundeliegende Ziel ist in der Regel, die Leistung zu verbessern und manchmal auch, Probleme zu beheben. Die Dokumentation, insbesondere in den Abschnitten &quot;Konzepte&quot; und &quot;Administrationshandbuch&quot;, ist hier hilfreich, siehe z.B. die Seiten <a href="https://milvus.io/docs/architecture_overview.md">&quot;Milvus Architecture Overview&quot;</a> und <a href="https://milvus.io/docs/clustering-compaction.md">&quot;Clustering Compaction&quot;.</a> Wir werden die Dokumentation zu den Interna von Milvus weiter verbessern und verständlicher machen und freuen uns über jede Rückmeldung oder Anfrage über <a href="https://milvus.io/discord">Discord</a>.</p>
<h3 id="Which-embedding-model-should-I-choose" class="common-anchor-header">Welches Einbettungsmodell sollte ich wählen?</h3><p>Eine Frage im Zusammenhang mit der Leistung, die mehrfach in Meetings, Sprechstunden und auf Discord aufkam, ist die Wahl eines Einbettungsmodells. Es ist schwierig, eine endgültige Antwort auf diese Frage zu geben, obwohl wir empfehlen, mit Standardmodellen wie <a href="https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2">all-MiniLM-L6-v2</a> zu beginnen.</p>
<p>Ähnlich wie bei der Wahl des Suchindexes gibt es auch hier Kompromisse zwischen Rechenleistung, Speicherplatz und Rückruf. Ein Einbettungsmodell mit größerer Ausgabedimension benötigt bei sonst gleichen Bedingungen mehr Speicherplatz, führt aber wahrscheinlich zu einer höheren Wiederauffindbarkeit relevanter Elemente. Größere Einbettungsmodelle übertreffen bei einer festen Dimension in der Regel kleinere Modelle in Bezug auf die Wiederauffindbarkeit, allerdings auf Kosten von mehr Rechenaufwand und Zeit. Ranglisten, die die Leistung von Einbettungsmodellen wie <a href="https://huggingface.co/spaces/mteb/leaderboard">MTEB</a> bewerten, basieren auf Benchmarks, die möglicherweise nicht mit Ihren spezifischen Daten und Aufgaben übereinstimmen.</p>
<p>Es ist also nicht sinnvoll, von einem "besten" Einbettungsmodell auszugehen. Beginnen Sie mit einem Modell, das eine annehmbare Trefferquote aufweist und Ihr Rechen- und Zeitbudget für die Berechnung von Einbettungen einhält. Weitere Optimierungen, wie z. B. die Feinabstimmung an Ihren Daten oder die empirische Untersuchung des Kompromisses zwischen Rechenleistung und Wiederaufruf, können Sie aufschieben, wenn Sie ein funktionierendes System in Produktion haben.</p>
<h2 id="Data-Management" class="common-anchor-header">Datenverwaltung<button data-href="#Data-Management" class="anchor-icon" translate="no">
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
    <img translate="no" src="https://assets.zilliz.com/Data_Management_aa2d1159bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Ein weiteres Hauptthema in den Discord-Diskussionen ist das Verschieben von Daten in und aus einem Milvus-Einsatz, was nicht überrascht, wenn man bedenkt, wie zentral diese Aufgabe für den Produktionseinsatz einer Anwendung ist.</p>
<h3 id="How-do-I-migrate-data-from-X-to-Milvus-How-do-I-migrate-data-from-Standalone-to-Distributed-How-do-I-migrate-from-24x-to-25x" class="common-anchor-header">Wie migriere ich Daten von X nach Milvus? Wie migriere ich Daten von Standalone zu Distributed? Wie migriere ich von 2.4.x zu 2.5.x?</h3><p>Ein neuer Benutzer möchte in der Regel bestehende Daten von einer anderen Plattform in Milvus übernehmen, einschließlich traditioneller Suchmaschinen wie <a href="https://docs.zilliz.com/docs/migrate-from-elasticsearch">Elasticsearch</a> und anderer Vektordatenbanken wie <a href="https://docs.zilliz.com/docs/migrate-from-pinecone">Pinecone</a> oder <a href="https://docs.zilliz.com/docs/migrate-from-qdrant">Qdrant</a>. Bestehende Benutzer möchten vielleicht auch ihre Daten von einer Milvus-Installation zu einer anderen oder <a href="https://docs.zilliz.com/docs/migrate-from-milvus">von selbst gehostetem Milvus zur vollständig verwalteten Zilliz Cloud</a> migrieren.</p>
<p>Der <a href="https://github.com/zilliztech/vts">Vector Transport Service (VTS)</a> und der Managed <a href="https://docs.zilliz.com/docs/migrations">Migration</a> Service auf Zilliz Cloud sind für diesen Zweck konzipiert.</p>
<h3 id="How-do-I-save-and-load-data-backups-How-do-I-export-data-from-Milvus" class="common-anchor-header">Wie kann ich Datensicherungen speichern und laden? Wie kann ich Daten aus Milvus exportieren?</h3><p>Milvus verfügt über ein spezielles Tool, <a href="https://github.com/zilliztech/milvus-backup">milvus-backup</a>, um Snapshots auf einem permanenten Speicher zu erstellen und diese wiederherzustellen.</p>
<h2 id="Next-Steps" class="common-anchor-header">Nächste Schritte<button data-href="#Next-Steps" class="anchor-icon" translate="no">
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
    </button></h2><p>Ich hoffe, dass ich Ihnen einige Hinweise geben konnte, wie Sie häufige Herausforderungen bei der Erstellung einer Vektordatenbank bewältigen können. Dies hat uns auf jeden Fall geholfen, einen weiteren Blick auf unsere Dokumentation und unsere Funktions-Roadmap zu werfen, um weiter an Dingen zu arbeiten, die unserer Community helfen können, mit Milvus erfolgreich zu sein. Eine wichtige Erkenntnis, die ich mitnehmen möchte, ist, dass Sie sich mit Ihren Entscheidungen in einem Spannungsfeld zwischen Rechenleistung, Speicherplatz, Latenz und Abruf bewegen. <em>Sie können nicht alle diese Leistungskriterien gleichzeitig maximieren - es gibt keinen "optimalen" Einsatz. Wenn Sie jedoch mehr über die Funktionsweise von Vektorsuche und verteilten Datenbanksystemen wissen, können Sie eine fundierte Entscheidung treffen.</em></p>
<p>Nachdem ich mich durch die vielen Beiträge von 2024 gewühlt hatte, kam ich ins Grübeln: Warum sollte ein Mensch das tun? Hat die generative KI nicht versprochen, eine solche Aufgabe der Verarbeitung großer Textmengen und der Gewinnung von Erkenntnissen zu lösen? Begleiten Sie mich im zweiten Teil dieses Blogbeitrags (folgt in Kürze), in dem ich den Entwurf und die Implementierung <em>eines Multiagentensystems zur Gewinnung von Erkenntnissen aus Diskussionsforen</em> untersuche <em>.</em></p>
<p>Nochmals vielen Dank und ich hoffe, wir sehen uns im Community <a href="https://milvus.io/discord">Discord</a> und bei unseren nächsten <a href="https://lu.ma/unstructured-data-meetup">Unstructured Data</a> Meetings. Wenn Sie mehr praktische Unterstützung benötigen, können Sie gerne eine <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">1-on-1 Sprech</a>stunde buchen. <em>Ihr Feedback ist wichtig für die Verbesserung von Milvus!</em></p>
