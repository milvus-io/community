---
id: >-
  efficient-vector-similarity-search-recommender-workflows-using-milvus-nvidia-merlin.md
title: >-
  Effiziente Vektorähnlichkeitssuche in Empfehlungsworkflows mit Milvus und
  NVIDIA Merlin
author: Burcin Bozkaya
date: 2023-12-15T00:00:00.000Z
desc: >-
  Eine Einführung in die Integration von NVIDIA Merlin und Milvus beim Aufbau
  von Empfehlungssystemen und Benchmarking der Leistung in verschiedenen
  Szenarien.
cover: assets.zilliz.com/nvidia_4921837ca6.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, NVIDIA, Merlin
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/efficient-vector-similarity-search-recommender-workflows-using-milvus-nvidia-merlin
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/nvidia_4921837ca6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Dieser Beitrag wurde zuerst auf dem <a href="https://medium.com/nvidia-merlin/efficient-vector-similarity-search-in-recommender-workflows-using-milvus-with-nvidia-merlin-84d568290ee4">Medium-Kanal von NVIDIA Merlin</a> veröffentlicht und mit Erlaubnis bearbeitet und hier erneut veröffentlicht. Er wurde gemeinsam von <a href="https://medium.com/u/743df9db1666?source=post_page-----84d568290ee4--------------------------------">Burcin Bozkaya</a> und <a href="https://medium.com/u/279d4c25a145?source=post_page-----84d568290ee4--------------------------------">William Hicks</a> von NVIDIA und <a href="https://medium.com/u/3e8a3c67a8a5?source=post_page-----84d568290ee4--------------------------------">Filip Haltmayer</a> und <a href="https://github.com/liliu-z">Li Liu</a> von Zilliz verfasst.</em></p>
<h2 id="Introduction" class="common-anchor-header">Einführung<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Moderne Empfehlungssysteme (Recsys) bestehen aus Trainings-/Inferenz-Pipelines, die mehrere Stufen der Datenaufnahme, der Datenvorverarbeitung, des Modelltrainings und des Hyperparameter-Tunings für die Suche, das Filtern, das Ranking und die Bewertung relevanter Artikel umfassen. Ein wesentlicher Bestandteil einer Empfehlungssystem-Pipeline ist das Auffinden von Dingen, die für einen Benutzer am relevantesten sind, insbesondere bei großen Objektkatalogen. Dieser Schritt beinhaltet in der Regel eine <a href="https://zilliz.com/glossary/anns">ANN-Suche (Approximate Nearest Neighbour)</a> über eine indizierte Datenbank mit niedrigdimensionalen Vektordarstellungen (d. h. Einbettungen) von Produkt- und Benutzerattributen, die mit Hilfe von Deep-Learning-Modellen erstellt wurden, die auf Interaktionen zwischen Benutzern und Produkten/Dienstleistungen trainiert wurden.</p>
<p><a href="https://github.com/NVIDIA-Merlin">NVIDIA Merlin</a>, ein Open-Source-Framework, das für das Training von End-to-End-Modellen zur Erstellung von Empfehlungen in beliebigem Umfang entwickelt wurde, ist mit einem effizienten Index- und Such-Framework <a href="https://zilliz.com/learn/what-is-vector-database">für Vektordatenbanken</a> integriert. Ein solches Framework, das in letzter Zeit viel Aufmerksamkeit erregt hat, ist <a href="https://zilliz.com/what-is-milvus">Milvus</a>, eine Open-Source-Vektordatenbank, die von <a href="https://zilliz.com/">Zilliz</a> entwickelt wurde. Sie bietet schnelle Index- und Abfragefunktionen. Milvus hat kürzlich <a href="https://zilliz.com/blog/getting-started-with-gpu-powered-milvus-unlocking-10x-higher-performance">die Unterstützung für GPU-Beschleunigung</a> hinzugefügt, die NVIDIA-GPUs zur Unterstützung von KI-Workflows nutzt. Die Unterstützung der GPU-Beschleunigung ist eine gute Nachricht, da eine beschleunigte Vektorsuchbibliothek schnelle gleichzeitige Abfragen ermöglicht, was sich positiv auf die Latenzanforderungen in den heutigen Empfehlungssystemen auswirkt, bei denen Entwickler viele gleichzeitige Anfragen erwarten. Milvus hat über 5 Millionen Docker-Pulls, ~23.000 Sterne auf GitHub (Stand: September 2023), über 5.000 Unternehmenskunden und ist eine Kernkomponente vieler Anwendungen (siehe <a href="https://medium.com/vector-database/tagged/use-cases-of-milvus">Anwendungsfälle</a>).</p>
<p>Dieser Blog demonstriert, wie Milvus mit dem Merlin Recsys-Framework beim Training und bei der Inferenz arbeitet. Wir zeigen, wie Milvus Merlin in der Phase des Item Retrieval durch eine hocheffiziente Top-k-Vektoreinbettungssuche ergänzt und wie es mit NVIDIA Triton Inference Server (TIS) zur Inferenzzeit verwendet werden kann (siehe Abbildung 1). <strong>Unsere Benchmark-Ergebnisse zeigen eine beeindruckende Beschleunigung um das 37- bis 91-fache mit GPU-beschleunigtem Milvus, das NVIDIA RAFT mit den von Merlin Models generierten Vektoreinbettungen verwendet.</strong> Der Code, mit dem wir die Merlin-Milvus-Integration und die detaillierten Benchmark-Ergebnisse zeigen, sowie die <a href="https://github.com/zilliztech/VectorDBBench">Bibliothek</a>, die unsere Benchmark-Studie ermöglicht hat, sind hier verfügbar.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Multistage_recommender_system_with_Milvus_ee891c4ad5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung 1. Mehrstufiges Empfehlungssystem mit dem Milvus-Framework, das zur Abfragephase beiträgt. Quelle für die ursprüngliche mehrstufige Abbildung: dieser <a href="https://medium.com/nvidia-merlin/recommender-systems-not-just-recommender-models-485c161c755e">Blogbeitrag</a>.</em></p>
<h2 id="The-challenges-facing-recommenders" class="common-anchor-header">Die Herausforderungen für Empfehlungssysteme<button data-href="#The-challenges-facing-recommenders" class="anchor-icon" translate="no">
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
    </button></h2><p>Angesichts der mehrstufigen Natur von Empfehlungssystemen und der Verfügbarkeit verschiedener Komponenten und Bibliotheken, die sie integrieren, besteht eine große Herausforderung darin, alle Komponenten nahtlos in eine End-to-End-Pipeline zu integrieren. In unseren Beispiel-Notebooks wollen wir zeigen, dass die Integration mit weniger Aufwand möglich ist.</p>
<p>Eine weitere Herausforderung bei Empfehlungsworkflows ist die Beschleunigung bestimmter Teile der Pipeline. Während GPUs bekanntermaßen eine große Rolle beim Training großer neuronaler Netze spielen, sind sie bei Vektordatenbanken und der ANN-Suche erst seit kurzem im Einsatz. Angesichts der zunehmenden Größe von E-Commerce-Produktbeständen oder Streaming-Media-Datenbanken und der Anzahl der Nutzer, die diese Dienste nutzen, müssen CPUs die erforderliche Leistung erbringen, um Millionen von Nutzern in leistungsfähigen Recsys-Workflows zu bedienen. Die GPU-Beschleunigung in anderen Teilen der Pipeline ist notwendig geworden, um diese Herausforderung zu bewältigen. Die Lösung in diesem Blog befasst sich mit dieser Herausforderung, indem sie zeigt, dass die ANN-Suche bei Verwendung von GPUs effizient ist.</p>
<h2 id="Tech-stacks-for-the-solution" class="common-anchor-header">Tech Stacks für die Lösung<button data-href="#Tech-stacks-for-the-solution" class="anchor-icon" translate="no">
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
    </button></h2><p>Beginnen wir mit einem Überblick über einige der Grundlagen, die für unsere Arbeit erforderlich sind.</p>
<ul>
<li><p>NVIDIA <a href="https://github.com/NVIDIA-Merlin/Merlin">Merlin</a>: eine Open-Source-Bibliothek mit High-Level-APIs zur Beschleunigung von Empfehlungsprogrammen auf NVIDIA-GPUs.</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/NVTabular">NVTabular</a>: für die Vorverarbeitung der tabellarischen Eingabedaten und das Feature-Engineering.</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/models">Merlin Models</a>: zum Trainieren von Deep-Learning-Modellen und in diesem Fall zum Lernen von Vektoren zur Einbettung von Nutzern und Artikeln aus Nutzerinteraktionsdaten.</p></li>
<li><p><a href="https://github.com/NVIDIA-Merlin/systems">Merlin Systems</a>: für die Kombination eines TensorFlow-basierten Empfehlungsmodells mit anderen Elementen (z.B. Feature Store, ANN-Suche mit Milvus), die mit TIS bedient werden.</p></li>
<li><p><a href="https://github.com/triton-inference-server/server">Triton Inference Server</a>: für die Inferenzphase, in der ein Benutzer-Merkmalsvektor übergeben wird und Produktempfehlungen generiert werden.</p></li>
<li><p>Containerisierung: Alle oben genannten Funktionen sind über Container verfügbar, die NVIDIA im <a href="https://catalog.ngc.nvidia.com/">NGC-Katalog</a> bereitstellt. Wir haben den Merlin TensorFlow 23.06 Container verwendet, der <a href="https://catalog.ngc.nvidia.com/orgs/nvidia/teams/merlin/containers/merlin-tensorflow">hier</a> verfügbar ist.</p></li>
<li><p><a href="https://github.com/milvus-io/milvus/releases/tag/v2.3.0">Milvus 2.3</a>: für die Durchführung von GPU-beschleunigter Vektorindizierung und -abfrage.</p></li>
<li><p><a href="https://github.com/milvus-io/milvus/releases">Milvus 2.2.11</a>: wie oben, aber für die Ausführung auf der CPU.</p></li>
<li><p><a href="https://zilliz.com/product/integrations/python">Pymilvus SDK</a>: für die Verbindung mit dem Milvus-Server, die Erstellung von Vektor-Datenbank-Indizes und die Ausführung von Abfragen über eine Python-Schnittstelle.</p></li>
<li><p><a href="https://github.com/feast-dev/feast">Feast</a>: für das Speichern und Abrufen von Benutzer- und Elementattributen in einem (Open-Source-)Feature-Store als Teil unserer End-to-End-RecSys-Pipeline.</p></li>
</ul>
<p>Mehrere zugrunde liegende Bibliotheken und Frameworks werden auch unter der Haube verwendet. Merlin stützt sich beispielsweise auf andere NVIDIA-Bibliotheken, wie cuDF und Dask, die beide unter <a href="https://github.com/rapidsai/cudf">RAPIDS cuDF</a> verfügbar sind. Ebenso stützt sich Milvus auf <a href="https://github.com/rapidsai/raft">NVIDIA RAFT</a> für Primitive bei der GPU-Beschleunigung und modifizierte Bibliotheken wie <a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">HNSW</a> und <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a> für die Suche.</p>
<h2 id="Understanding-vector-databases-and-Milvus" class="common-anchor-header">Verständnis von Vektordatenbanken und Milvus<button data-href="#Understanding-vector-databases-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/glossary/anns">Approximate Nearest Neighbour (ANN)</a> ist eine Funktionalität, die relationale Datenbanken nicht beherrschen. Relationale Datenbanken sind für den Umgang mit tabellarischen Daten mit vordefinierten Strukturen und direkt vergleichbaren Werten konzipiert. Relationale Datenbankindizes nutzen dies, um Daten zu vergleichen und Strukturen zu erstellen, die den Vorteil haben, zu wissen, ob ein Wert kleiner oder größer als der andere ist. Einbettungsvektoren können auf diese Weise nicht direkt miteinander verglichen werden, da wir wissen müssen, was jeder Wert im Vektor darstellt. Sie können nicht sagen, ob ein Vektor notwendigerweise kleiner ist als der andere. Das Einzige, was wir tun können, ist, den Abstand zwischen den beiden Vektoren zu berechnen. Wenn der Abstand zwischen zwei Vektoren klein ist, können wir davon ausgehen, dass die Merkmale, die sie repräsentieren, ähnlich sind, und wenn er groß ist, können wir davon ausgehen, dass die Daten, die sie repräsentieren, eher unterschiedlich sind. Diese effizienten Indizes haben jedoch ihren Preis: Die Berechnung des Abstands zwischen zwei Vektoren ist sehr rechenintensiv, und die Vektorindizes sind nicht ohne Weiteres anpassbar und manchmal auch nicht änderbar. Aufgrund dieser beiden Einschränkungen ist die Integration dieser Indizes in relationalen Datenbanken komplexer, weshalb <a href="https://zilliz.com/blog/what-is-a-real-vector-database">speziell entwickelte Vektordatenbanken</a> erforderlich sind.</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvus</a> wurde entwickelt, um die Probleme zu lösen, auf die relationale Datenbanken mit Vektoren stoßen, und wurde von Grund auf so konzipiert, dass es diese einbettenden Vektoren und ihre Indizes in großem Maßstab verarbeiten kann. Um das Cloud-Native-Zeichen zu erfüllen, trennt Milvus Rechen- und Speicherfunktionen sowie verschiedene Rechenaufgaben - Abfragen, Datenverarbeitung und Indizierung. Die Benutzer können jeden Teil der Datenbank skalieren, um andere Anwendungsfälle zu bewältigen, egal ob es sich um Dateneinfügung oder Suche handelt. Bei einem großen Zustrom von Einfügeanforderungen kann der Benutzer die Indexknoten vorübergehend horizontal und vertikal skalieren, um die Einfügung zu bewältigen. Wenn keine Daten eingegeben, aber viele Suchanfragen gestellt werden, kann der Benutzer die Indexknoten reduzieren und stattdessen die Abfrageknoten vergrößern, um den Durchsatz zu erhöhen. Dieses Systemdesign (siehe Abbildung 2) erforderte eine parallele Denkweise, was zu einem rechenoptimierten System führte, dem viele Türen für weitere Optimierungen offen stehen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_system_design_bb3a44c9cc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung 2. Milvus-Systementwurf</em></p>
<p>Milvus verwendet auch viele hochmoderne Indizierungsbibliotheken, um den Benutzern so viel Anpassungsmöglichkeiten für ihr System wie möglich zu bieten. Es verbessert diese Bibliotheken, indem es die Fähigkeit hinzufügt, CRUD-Operationen, Datenströme und Filterung zu verarbeiten. Später werden wir erörtern, wie sich diese Indizes unterscheiden und welche Vor- und Nachteile sie jeweils haben.</p>
<h2 id="Example-solution-integration-of-Milvus-and-Merlin" class="common-anchor-header">Beispiellösung: Integration von Milvus und Merlin<button data-href="#Example-solution-integration-of-Milvus-and-Merlin" class="anchor-icon" translate="no">
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
    </button></h2><p>Die hier vorgestellte Beispiellösung demonstriert die Integration von Milvus mit Merlin in der Phase des Item Retrievals (wenn die k relevantesten Items durch eine ANN-Suche abgerufen werden). Wir verwenden einen realen Datensatz aus einem <a href="https://www.kaggle.com/datasets/chadgostopp/recsys-challenge-2015">RecSys-Wettbewerb</a>, der im Folgenden beschrieben wird. Wir trainieren ein Two-Tower Deep Learning-Modell, das Vektoreinbettungen für Benutzer und Artikel lernt. Dieser Abschnitt enthält auch den Entwurf unserer Benchmarking-Arbeit, einschließlich der Metriken, die wir sammeln, und der Bandbreite der Parameter, die wir verwenden.</p>
<p>Unser Ansatz umfasst:</p>
<ul>
<li><p>Dateneingabe und Vorverarbeitung</p></li>
<li><p>Training des Two-Tower Deep Learning Modells</p></li>
<li><p>Aufbau des Milvus-Index</p></li>
<li><p>Milvus-Ähnlichkeitssuche</p></li>
</ul>
<p>Wir beschreiben jeden Schritt kurz und verweisen den Leser für Details auf unsere <a href="https://github.com/bbozkaya/merlin-milvus/tree/main/notebooks">Notebooks</a>.</p>
<h3 id="Dataset" class="common-anchor-header">Datensatz</h3><p>Die YOOCHOOSE GmbH stellt den Datensatz, den wir in dieser Integrations- und Benchmarkstudie verwenden, für die <a href="https://www.kaggle.com/datasets/chadgostopp/recsys-challenge-2015">RecSys 2015 Challenge</a> zur Verfügung und ist auf Kaggle verfügbar. Er enthält Klick/Kauf-Ereignisse von Nutzern eines europäischen Online-Händlers mit Attributen wie Sitzungs-ID, Zeitstempel, Artikel-ID, die mit dem Klick/Kauf verbunden sind, und Artikelkategorie, die in der Datei yoochoose-clicks.dat verfügbar sind. Die Sitzungen sind unabhängig, und es gibt keinen Hinweis auf wiederkehrende Benutzer, so dass wir jede Sitzung als zu einem bestimmten Benutzer gehörend behandeln. Der Datensatz umfasst 9.249.729 eindeutige Sitzungen (Benutzer) und 52.739 eindeutige Elemente.</p>
<h3 id="Data-ingestion-and-preprocessing" class="common-anchor-header">Dateneingabe und Vorverarbeitung</h3><p>Das Tool, das wir für die Datenvorverarbeitung verwenden, ist <a href="https://github.com/NVIDIA-Merlin/NVTabular">NVTabular</a>, eine GPU-beschleunigte, hoch skalierbare Feature-Engineering- und Vorverarbeitungskomponente von Merlin. Wir verwenden NVTabular, um Daten in den GPU-Speicher einzulesen, Merkmale nach Bedarf neu anzuordnen, in Parkettdateien zu exportieren und einen Train-Validation-Split für das Training zu erstellen. Das Ergebnis sind 7.305.761 eindeutige Benutzer und 49.008 eindeutige Elemente für das Training. Wir kategorisieren auch jede Spalte und ihre Werte in ganzzahlige Werte. Der Datensatz ist nun bereit für das Training mit dem Two-Tower-Modell.</p>
<h3 id="Model-training" class="common-anchor-header">Modell-Training</h3><p>Wir verwenden das Deep-Learning-Modell <a href="https://github.com/NVIDIA-Merlin/models/blob/main/examples/05-Retrieval-Model.ipynb">Two-Tower</a> zum Trainieren und Generieren von Benutzer- und Objekteinbettungen, die später bei der Vektorindizierung und Abfrage verwendet werden. Nach dem Training des Modells können wir die gelernten Benutzer- und Objekteinbettungen extrahieren.</p>
<p>Die folgenden beiden Schritte sind optional: ein <a href="https://arxiv.org/abs/1906.00091">DLRM-Modell</a>, das trainiert wird, um die abgerufenen Elemente für Empfehlungen zu bewerten, und ein Merkmalsspeicher (in diesem Fall <a href="https://github.com/feast-dev/feast">Feast</a>), der zum Speichern und Abrufen von Benutzer- und Elementmerkmalen verwendet wird. Wir fügen sie der Vollständigkeit halber in den mehrstufigen Arbeitsablauf ein.</p>
<p>Abschließend exportieren wir die Benutzer- und Objekteinbettungen in Parkettdateien, die später wieder geladen werden können, um einen Milvus-Vektorindex zu erstellen.</p>
<h3 id="Building-and-querying-the-Milvus-index" class="common-anchor-header">Aufbau und Abfrage des Milvus-Index</h3><p>Milvus erleichtert die Vektorindizierung und Ähnlichkeitssuche über einen "Server", der auf der Inferenzmaschine gestartet wird. In unserem Notizbuch #2 richten wir diesen ein, indem wir den Milvus-Server und Pymilvus per Pip installieren und den Server mit seinem Standard-Listening-Port starten. Als nächstes demonstrieren wir die Erstellung eines einfachen Index (IVF_FLAT) und die Abfrage mit den Funktionen <code translate="no">setup_milvus</code> bzw. <code translate="no">query_milvus</code>.</p>
<h2 id="Benchmarking" class="common-anchor-header">Benchmarking<button data-href="#Benchmarking" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir haben zwei Benchmarks entwickelt, um den Einsatz einer schnellen und effizienten Vektorindexierungs-/Suchbibliothek wie Milvus zu demonstrieren.</p>
<ol>
<li><p>Wir verwenden Milvus, um Vektorindizes mit den beiden von uns generierten Einbettungen zu erstellen: 1) Benutzer-Embeddings für 7,3 Millionen eindeutige Benutzer, aufgeteilt in 85% Trainingsmenge (für die Indizierung) und 15% Testmenge (für die Abfrage), und 2) Item-Embeddings für 49.000 Produkte (mit einer 50-50 Trainings-/Testaufteilung). Dieser Benchmark wird unabhängig für jeden Vektordatensatz durchgeführt, und die Ergebnisse werden getrennt ausgewiesen.</p></li>
<li><p>Verwendung von Milvus zur Erstellung eines Vektorindexes für den 49K Item Embeddings-Datensatz und Abfrage der 7,3M eindeutigen Benutzer gegen diesen Index für die Ähnlichkeitssuche.</p></li>
</ol>
<p>Bei diesen Benchmarks wurden IVFPQ- und HNSW-Indizierungsalgorithmen auf GPU und CPU sowie verschiedene Parameterkombinationen verwendet. Details sind <a href="https://github.com/bbozkaya/merlin-milvus/tree/main/results">hier</a> verfügbar.</p>
<p>Der Kompromiss zwischen Suchqualität und Durchsatz ist ein wichtiger Leistungsaspekt, insbesondere in einer Produktionsumgebung. Milvus ermöglicht die vollständige Kontrolle über die Indizierungsparameter, um diesen Kompromiss für einen bestimmten Anwendungsfall zu untersuchen und bessere Suchergebnisse mit Ground Truth zu erzielen. Dies kann zu höheren Rechenkosten in Form einer geringeren Durchsatzrate oder Abfragen pro Sekunde (QPS) führen. Wir messen die Qualität der ANN-Suche mit einer Recall-Metrik und stellen QPS-Recall-Kurven bereit, die den Kompromiss aufzeigen. Man kann dann entscheiden, welches Niveau der Suchqualität angesichts der Rechenressourcen oder Latenz-/Durchsatzanforderungen des Geschäftsfalls akzeptabel ist.</p>
<p>Beachten Sie auch die Abfragestapelgröße (nq), die in unseren Benchmarks verwendet wird. Dies ist in Arbeitsabläufen nützlich, bei denen mehrere gleichzeitige Anfragen an die Inferenz gesendet werden (z. B. Offline-Empfehlungen, die angefordert und an eine Liste von E-Mail-Empfängern gesendet werden, oder Online-Empfehlungen, die durch das Zusammenfassen gleichzeitiger Anfragen erstellt werden, die alle auf einmal verarbeitet werden). Je nach Anwendungsfall kann TIS auch dabei helfen, diese Anfragen in Stapeln zu verarbeiten.</p>
<h3 id="Results" class="common-anchor-header">Ergebnisse</h3><p>Wir berichten nun über die Ergebnisse für die drei Benchmark-Sets auf CPU und GPU unter Verwendung der von Milvus implementierten Index-Typen HNSW (nur CPU) und IVF_PQ (CPU und GPU).</p>
<h4 id="Items-vs-Items-vector-similarity-search" class="common-anchor-header">Items vs. Items Vektorähnlichkeitssuche</h4><p>Bei diesem kleinsten Datensatz werden bei jedem Durchlauf für eine bestimmte Parameterkombination 50 % der Item-Vektoren als Abfragevektoren verwendet und die 100 ähnlichsten Vektoren vom Rest abgefragt. HNSW und IVF_PQ erzielen mit den getesteten Parametereinstellungen eine hohe Trefferquote, die im Bereich von 0,958-1,0 bzw. 0,665-0,997 liegt. Dieses Ergebnis deutet darauf hin, dass HNSW in Bezug auf den Recall besser abschneidet, während IVF_PQ mit kleinen nlist-Einstellungen einen sehr vergleichbaren Recall erzielt. Wir sollten auch beachten, dass die Recall-Werte je nach den Indizierungs- und Abfrageparametern stark variieren können. Die von uns angegebenen Werte wurden nach vorläufigen Experimenten mit allgemeinen Parameterbereichen und weiterem Zoomen in eine ausgewählte Teilmenge ermittelt.</p>
<p>Die Gesamtzeit für die Ausführung aller Abfragen auf der CPU mit HNSW für eine bestimmte Parameterkombination liegt zwischen 5,22 und 5,33 Sekunden (schneller, wenn m größer wird, relativ unverändert mit ef) und mit IVF_PQ zwischen 13,67 und 14,67 Sekunden (langsamer, wenn nlist und nprobe größer werden). Die GPU-Beschleunigung hat einen spürbaren Effekt, wie in Abbildung 3 zu sehen ist.</p>
<p>Abbildung 3 zeigt den Kompromiss zwischen Abruf und Durchsatz für alle auf CPU und GPU durchgeführten Läufe mit diesem kleinen Datensatz unter Verwendung von IVF_PQ. Wir stellen fest, dass die GPU bei allen getesteten Parameterkombinationen einen Geschwindigkeitszuwachs von 4x bis 15x bietet (größerer Geschwindigkeitszuwachs, wenn nprobe größer wird). Dies wird berechnet, indem man das Verhältnis von QPS von GPU zu QPS von CPU-Läufen für jede Parameterkombination nimmt. Insgesamt stellt dieser Satz eine kleine Herausforderung für CPU oder GPU dar und bietet Aussichten auf eine weitere Beschleunigung bei größeren Datensätzen, wie unten beschrieben.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_item_item_d32de8443d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung 3. GPU-Beschleunigung mit dem Milvus IVF_PQ-Algorithmus auf dem NVIDIA A100-GPU (Element-Element-Ähnlichkeitssuche)</em></p>
<h4 id="Users-vs-Users-vector-similarity-search" class="common-anchor-header">Benutzer vs. Benutzer Vektorähnlichkeitssuche</h4><p>Mit dem viel größeren zweiten Datensatz (7,3 Mio. Benutzer) haben wir 85 % (~6,2 Mio.) der Vektoren als "train" (die Menge der zu indizierenden Vektoren) und die verbleibenden 15 % (~1,1 Mio.) als "test" oder Abfragevektormenge beiseite gelegt. HNSW und IVF_PQ schneiden in diesem Fall außergewöhnlich gut ab, mit Recall-Werten von 0,884-1,0 bzw. 0,922-0,999. Sie sind jedoch rechnerisch wesentlich anspruchsvoller, insbesondere IVF_PQ auf der CPU. Die Gesamtzeit für die Ausführung aller Abfragen auf der CPU mit HNSW liegt zwischen 279,89 und 295,56 s und mit IVF_PQ zwischen 3082,67 und 10932,33 s. Beachten Sie, dass diese Abfragezeiten für 1,1 Mio. abgefragte Vektoren kumulativ sind, so dass man sagen kann, dass eine einzelne Abfrage gegen den Index immer noch sehr schnell ist.</p>
<p>CPU-basierte Abfragen sind jedoch möglicherweise nicht praktikabel, wenn der Inferenzserver viele Tausend gleichzeitige Anfragen erwartet, um Abfragen gegen einen Bestand von Millionen von Elementen durchzuführen.</p>
<p>Der A100-Grafikprozessor liefert über alle Parameterkombinationen hinweg mit IVF_PQ einen enormen Geschwindigkeitszuwachs von 37x bis 91x (im Durchschnitt 76,1x) in Bezug auf den Durchsatz (QPS), wie in Abbildung 4 dargestellt. Dies entspricht dem, was wir mit dem kleinen Datensatz beobachtet haben, was darauf hindeutet, dass die GPU-Leistung bei der Verwendung von Milvus mit Millionen von Einbettungsvektoren recht gut skaliert.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_algorithm_user_user_c91f4e4164.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung 4. GPU-Beschleunigung mit dem Milvus IVF_PQ-Algorithmus auf dem NVIDIA A100-GPU (Ähnlichkeitssuche zwischen Benutzern)</em></p>
<p>Die folgende detaillierte Abbildung 5 zeigt den Recall-QPS-Tradeoff für alle Parameterkombinationen, die mit IVF_PQ auf CPU und GPU getestet wurden. Jeder Punktsatz (oben für GPU, unten für CPU) in diesem Diagramm zeigt den Kompromiss, der beim Ändern von Vektorindizierungs-/Abfrageparametern zum Erreichen eines höheren Recalls auf Kosten eines geringeren Durchsatzes besteht. Man beachte den beträchtlichen Verlust an QPS im GPU-Fall, wenn man versucht, eine höhere Wiederauffindbarkeit zu erreichen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Recall_Throughput_tradeoff_519b2289e5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung 5. Kompromiss zwischen Recall und Durchsatz für alle auf CPU und GPU getesteten Parameterkombinationen mit IVF_PQ (Benutzer vs. Benutzer)</em></p>
<h4 id="Users-vs-Items-vector-similarity-search" class="common-anchor-header">Benutzer vs. Items Vektorähnlichkeitssuche</h4><p>Abschließend betrachten wir einen weiteren realistischen Anwendungsfall, bei dem Benutzervektoren gegen Item-Vektoren abgefragt werden (wie in Notebook 01 oben demonstriert). In diesem Fall werden 49K Objektvektoren indiziert und 7,3M Benutzervektoren werden jeweils nach den 100 ähnlichsten Objekten abgefragt.</p>
<p>An dieser Stelle wird es interessant, denn die Abfrage von 7,3M in Stapeln von 1000 gegen einen Index von 49K Elementen scheint auf der CPU sowohl für HNSW als auch für IVF_PQ zeitaufwändig zu sein. Die GPU scheint diesen Fall besser zu bewältigen (siehe Abbildung 6). Die höchsten Genauigkeitsniveaus von IVF_PQ auf der CPU bei nlist = 100 werden im Durchschnitt in etwa 86 Minuten berechnet, variieren jedoch erheblich, wenn der nprobe-Wert steigt (51 Min. bei nprobe = 5 vs. 128 Min. bei nprobe = 20). Der NVIDIA A100-Grafikprozessor beschleunigt die Leistung beträchtlich, und zwar um den Faktor 4 bis 17 (höhere Geschwindigkeitssteigerungen, wenn nprobe größer wird). Es sei daran erinnert, dass der IVF_PQ-Algorithmus durch seine Quantisierungstechnik auch den Speicherbedarf reduziert und in Kombination mit der GPU-Beschleunigung eine rechnerisch praktikable ANN-Suchlösung bietet.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/GPU_speedup_with_Milvus_IVF_PQ_algorithm_user_item_504462fcc0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung 6. GPU-Beschleunigung mit dem Milvus-IVF_PQ-Algorithmus auf dem NVIDIA A100-GPU (Ähnlichkeitssuche nach Benutzer-Elementen)</em></p>
<p>Ähnlich wie in Abbildung 5 ist in Abbildung 7 der Kompromiss zwischen Rückruf und Durchsatz für alle mit IVF_PQ getesteten Parameterkombinationen dargestellt. Hier ist immer noch zu erkennen, dass man bei der ANN-Suche zugunsten eines höheren Durchsatzes etwas an Genauigkeit einbüßen muss, obwohl die Unterschiede viel weniger auffällig sind, insbesondere bei GPU-Läufen. Dies deutet darauf hin, dass man mit der GPU eine relativ gleichbleibend hohe Rechenleistung erwarten kann, während man dennoch eine hohe Trefferquote erzielt.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Recall_Throughput_tradeoff_user_items_0abce91c5e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung 7. Kompromiss zwischen Rückruf und Durchsatz für alle auf CPU und GPU getesteten Parameterkombinationen mit IVF_PQ (Benutzer vs. Elemente)</em></p>
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
    </button></h2><p>Wenn Sie es bis hierher geschafft haben, würden wir Ihnen gerne ein paar abschließende Bemerkungen mitteilen. Wir möchten Sie daran erinnern, dass die Komplexität und der mehrstufige Charakter des modernen Recsys bei jedem Schritt Leistung und Effizienz erfordern. Wir hoffen, dass Sie in diesem Blog überzeugende Gründe gefunden haben, die Verwendung zweier wichtiger Funktionen in Ihren RecSys-Pipelines in Betracht zu ziehen:</p>
<ul>
<li><p>Mit der Merlin Systems-Bibliothek von NVIDIA Merlin können Sie <a href="https://github.com/milvus-io/milvus/tree/2.3.0">Milvus</a>, eine effiziente, GPU-beschleunigte Vektorsuchmaschine, einfach einbinden.</p></li>
<li><p>Nutzen Sie GPU zur Beschleunigung von Berechnungen für die Indizierung von Vektordatenbanken und die ANN-Suche mit Technologien wie <a href="https://github.com/rapidsai/raft">RAPIDS RAFT</a>.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/summary_benchmark_results_ae33fbe514.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Diese Ergebnisse deuten darauf hin, dass die vorgestellte Merlin-Milvus-Integration sehr leistungsfähig und viel weniger komplex ist als andere Optionen für Training und Inferenz. Außerdem werden beide Frameworks aktiv weiterentwickelt, und viele neue Funktionen (z. B. neue GPU-beschleunigte Vektordatenbankindizes von Milvus) werden in jeder Version hinzugefügt. Die Tatsache, dass die vektorielle Ähnlichkeitssuche eine entscheidende Komponente in verschiedenen Arbeitsabläufen ist, wie z.B. Computer Vision, Large Language Modeling und Recommender Systems, macht diese Bemühungen umso lohnender.</p>
<p>Abschließend möchten wir uns bei allen Mitarbeitern von Zilliz/Milvus und Merlin sowie den RAFT-Teams bedanken, die an der Erstellung dieser Arbeit und des Blogbeitrags beteiligt waren. Wir freuen uns darauf, von Ihnen zu hören, wenn Sie die Möglichkeit haben, Merlin und Milvus in Ihren Recsys oder anderen Arbeitsabläufen einzusetzen.</p>
