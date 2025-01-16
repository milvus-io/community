---
id: 2022-08-05-whats-new-in-milvus-2-1.md
title: Was ist neu in Milvus 2.1 - Mehr Einfachheit und Geschwindigkeit
author: Xiaofan Luan
date: 2022-08-05T00:00:00.000Z
desc: >-
  Milvus, die Open-Source-Vektordatenbank, bietet jetzt Verbesserungen in Bezug
  auf Leistung und Benutzerfreundlichkeit, auf die die Benutzer schon lange
  gewartet haben.
cover: assets.zilliz.com/What_s_New_in_2_1_2_a0660df2a5.png
tag: News
canonicalUrl: 'https://milvus.io/blog/2022-08-05-whats-new-in-milvus-2-1.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_1_2_a0660df2a5.png" alt="What's new in Milvus 2.1 - Towards simplicity and speed" class="doc-image" id="what's-new-in-milvus-2.1---towards-simplicity-and-speed" />
   </span> <span class="img-wrapper"> <span>Was ist neu in Milvus 2.1 - In Richtung Einfachheit und Geschwindigkeit</span> </span></p>
<p>Wir freuen uns sehr, die<a href="https://milvus.io/docs/v2.1.x/release_notes.md">Veröffentlichung</a> von Milvus 2.1 nach sechs Monaten harter Arbeit aller Mitarbeiter der Milvus-Community bekannt geben zu können. Diese große Iteration der beliebten Vektordatenbank legt den Schwerpunkt auf <strong>Leistung</strong> und <strong>Benutzerfreundlichkeit</strong>, zwei der wichtigsten Schlüsselwörter unseres Fokus. Wir haben Unterstützung für Strings, Kafka Message Queue und eingebettetes Milvus hinzugefügt, sowie eine Reihe von Verbesserungen in Bezug auf Leistung, Skalierbarkeit, Sicherheit und Beobachtbarkeit. Milvus 2.1 ist ein aufregendes Update, das die "letzte Meile" vom Laptop des Algorithmus-Ingenieurs zu den produktiven Vektorähnlichkeitssuchdiensten überbrückt.</p>
<custom-h1>Leistung - Mehr als eine 3,2-fache Steigerung</custom-h1><h2 id="5ms-level-latency" class="common-anchor-header">Latenzzeit auf 5ms-Niveau<button data-href="#5ms-level-latency" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus unterstützt bereits die ANN-Suche (Approximate Nearest Neighbour), was einen erheblichen Sprung gegenüber der traditionellen KNN-Methode darstellt. Allerdings stellen Durchsatz- und Latenzprobleme nach wie vor eine Herausforderung für Benutzer dar, die Vektordaten in Milliardenhöhe abrufen müssen.</p>
<p>In Milvus 2.1 gibt es ein neues Routing-Protokoll, das sich nicht mehr auf Nachrichtenwarteschlangen in der Abrufverbindung stützt, wodurch die Abruflatenz für kleine Datensätze erheblich reduziert wird. Unsere Testergebnisse zeigen, dass Milvus seine Latenzzeit jetzt auf 5 ms senkt, was den Anforderungen kritischer Online-Verbindungen wie Ähnlichkeitssuche und Empfehlung entspricht.</p>
<h2 id="Concurrency-control" class="common-anchor-header">Gleichzeitigkeitskontrolle<button data-href="#Concurrency-control" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 verfeinert sein Gleichzeitigkeitsmodell durch die Einführung eines neuen Kostenbewertungsmodells und eines Gleichzeitigkeitsplaners. Es bietet nun eine Gleichzeitigkeitskontrolle, die sicherstellt, dass weder eine große Anzahl gleichzeitiger Anfragen um CPU- und Cache-Ressourcen konkurriert, noch die CPU zu wenig ausgelastet wird, weil es nicht genügend Anfragen gibt. Die neue, intelligente Scheduler-Schicht in Milvus 2.1 führt auch Small-nq-Abfragen mit konsistenten Abfrageparametern zusammen und sorgt so für eine erstaunliche 3,2-fache Leistungssteigerung in Szenarien mit Small-nq und hoher Gleichzeitigkeit der Abfragen.</p>
<h2 id="In-memory-replicas" class="common-anchor-header">In-Memory-Replikate<button data-href="#In-memory-replicas" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 bietet In-Memory-Replikate, die die Skalierbarkeit und Verfügbarkeit für kleine Datensätze verbessern. Ähnlich wie die Nur-Lese-Replikate in herkömmlichen Datenbanken können die In-Memory-Replikate horizontal skaliert werden, indem Maschinen hinzugefügt werden, wenn die Lese-QPS hoch ist. Beim Vektor-Retrieval für kleine Datenmengen muss ein Empfehlungssystem oft eine QPS bieten, die die Leistungsgrenze eines einzelnen Rechners überschreitet. In diesen Szenarien kann der Durchsatz des Systems durch das Laden mehrerer Replikate in den Speicher erheblich verbessert werden. In Zukunft werden wir auch einen abgesicherten Lesemechanismus einführen, der auf speicherinternen Replikaten basiert und der schnell andere funktionale Kopien anfordert, falls das System sich von Ausfällen erholen muss, und der die Speicherredundanz vollständig nutzt, um die Gesamtverfügbarkeit des Systems zu verbessern.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_1_Figure_1_excalidraw_1f7fe3c998.png" alt="In-memory replicas allow query services to be based on separate
copies of the same data." class="doc-image" id="in-memory-replicas-allow-query-services-to-be-based-on-separate-copies-of-the-same-data." />
   </span> <span class="img-wrapper"> <span>In-Memory-Replikate ermöglichen Abfragedienste, die auf separaten Kopien derselben Daten basieren</span>. </span></p>
<h2 id="Faster-data-loading" class="common-anchor-header">Schnelleres Laden von Daten<button data-href="#Faster-data-loading" class="anchor-icon" translate="no">
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
    </button></h2><p>Die letzte Leistungssteigerung betrifft das Laden von Daten. Milvus 2.1 komprimiert nun <a href="https://milvus.io/docs/v2.1.x/glossary.md#Log-snapshot">Binärprotokolle</a> mit Zstandard (zstd), was die Datengröße in den Objekt- und Nachrichtenspeichern sowie den Netzwerk-Overhead während des Datenladens erheblich reduziert. Darüber hinaus wurden Goroutine-Pools eingeführt, so dass Milvus Segmente gleichzeitig laden kann, wobei der Speicherbedarf kontrolliert wird und die Zeit für die Wiederherstellung nach Fehlern und das Laden von Daten minimiert wird.</p>
<p>Die vollständigen Benchmark-Ergebnisse von Milvus 2.1 werden demnächst auf unserer Website veröffentlicht. Bleiben Sie dran.</p>
<h2 id="String-and-scalar-index-support" class="common-anchor-header">Unterstützung von String- und Skalar-Indizes<button data-href="#String-and-scalar-index-support" class="anchor-icon" translate="no">
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
    </button></h2><p>Mit der Version 2.1 unterstützt Milvus nun Strings mit variabler Länge (VARCHAR) als skalaren Datentyp. VARCHAR kann als Primärschlüssel verwendet werden, der als Ausgabe zurückgegeben werden kann, und kann auch als Attributfilter dienen. Das <a href="https://milvus.io/docs/v2.1.x/hybridsearch.md">Filtern von Attributen</a> ist eine der beliebtesten Funktionen, die Milvus-Benutzer benötigen. Wenn Sie oft nach &quot;Produkten suchen, die einem Benutzer in einer Preisspanne <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>von</mn><mo>200-200</mo></mrow><annotation encoding="application/x-tex">-</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">200-300</span></span></span></span>am ähnlichsten sind&quot;, oder &quot;Artikel finden, die das Schlüsselwort 'Vektordatenbank' enthalten und mit cloud-nativen Themen in Verbindung stehen&quot;, werden Sie Milvus 2.1 lieben.</p>
<p>Milvus 2.1 unterstützt auch den skalaren invertierten Index, um die Filtergeschwindigkeit auf der Grundlage der<a href="https://www.cs.le.ac.uk/people/ond1/XMLcomp/confersWEA06_LOUDS.pdf">prägnanten</a><a href="https://github.com/s-yata/marisa-trie">MARISA-Tries</a> als Datenstruktur zu verbessern. Alle Daten können nun mit einem sehr geringen Platzbedarf in den Speicher geladen werden, was einen viel schnelleren Vergleich, eine schnellere Filterung und ein schnelleres Präfix-Matching bei Zeichenketten ermöglicht. Unsere Testergebnisse zeigen, dass der Speicherbedarf von MARISA-trie nur 10% des Speicherbedarfs von Python-Wörterbüchern beträgt, um alle Daten in den Speicher zu laden und Abfragefunktionen bereitzustellen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/What_s_new_in_Milvus_Figure_2_excalidraw_a1149aca96.png" alt="Milvus 2.1 combines MARISA-Trie with inverted index to significantly improve filtering speed." class="doc-image" id="milvus-2.1-combines-marisa-trie-with-inverted-index-to-significantly-improve-filtering-speed." />
   </span> <span class="img-wrapper"> <span>Milvus 2.1 kombiniert MARISA-Trie mit einem invertierten Index, um die Filtergeschwindigkeit erheblich zu verbessern.</span> </span></p>
<p>In Zukunft wird sich Milvus weiterhin auf Entwicklungen im Zusammenhang mit skalaren Abfragen konzentrieren, mehr skalare Indextypen und Abfrageoperatoren unterstützen und plattenbasierte skalare Abfragefunktionen bereitstellen, alles als Teil der laufenden Bemühungen, die Speicher- und Nutzungskosten skalarer Daten zu reduzieren.</p>
<custom-h1>Verbesserungen der Benutzerfreundlichkeit</custom-h1><h2 id="Kafka-support" class="common-anchor-header">Kafka-Unterstützung<button data-href="#Kafka-support" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 bietet Ihnen nun die Möglichkeit,<a href="https://pulsar.apache.org">Pulsar</a> oder <a href="https://kafka.apache.org">Kafka</a> als <a href="https://milvus.io/docs/v2.1.x/deploy_pulsar.md">Nachrichtenspeicher</a> zu verwenden, je nach Konfiguration des Benutzers, dank der Abstraktion und Kapselung von Milvus und dem Go Kafka SDK von Confluent.</p>
<h2 id="Production-ready-Java-SDK" class="common-anchor-header">Produktionsfähiges Java-SDK<button data-href="#Production-ready-Java-SDK" class="anchor-icon" translate="no">
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
    </button></h2><p>Mit Milvus 2.1 ist unser <a href="https://github.com/milvus-io/milvus-sdk-java">Java SDK</a> nun offiziell freigegeben. Das Java-SDK verfügt über genau dieselben Funktionen wie das Python-SDK, mit einer noch besseren Gleichzeitigkeitsleistung. Im nächsten Schritt werden unsere Community-Mitarbeiter schrittweise die Dokumentation und die Anwendungsfälle für das Java-SDK verbessern und dazu beitragen, dass auch die Go- und RESTful-SDKs in die Produktionsreife gebracht werden.</p>
<h2 id="Observability-and-maintainability" class="common-anchor-header">Beobachtbarkeit und Wartbarkeit<button data-href="#Observability-and-maintainability" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 fügt wichtige<a href="https://milvus.io/docs/v2.1.x/metrics_dashboard.md">Überwachungsmetriken</a> hinzu, wie z. B. die Anzahl der Vektoreinfügungen, Suchlatenz/Durchsatz, Knotenspeicher-Overhead und CPU-Overhead. Außerdem optimiert die neue Version die Protokollierung erheblich, indem sie die Protokollebenen anpasst und unnötige Protokolldrucke reduziert.</p>
<h2 id="Embedded-Milvus" class="common-anchor-header">Eingebettetes Milvus<button data-href="#Embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus hat die Bereitstellung von groß angelegten massiven Vektordatensuchdiensten erheblich vereinfacht, aber für Wissenschaftler, die Algorithmen in kleinerem Maßstab validieren wollen, ist Docker oder K8s immer noch zu kompliziert. Mit der Einführung von <a href="https://github.com/milvus-io/embd-milvus">Embedded Milvus</a> können Sie Milvus jetzt mit pip installieren, genau wie Pyrocksb und Pysqlite. Embedded Milvus unterstützt alle Funktionalitäten der Cluster- und der Standalone-Version, so dass Sie problemlos von Ihrem Laptop zu einer verteilten Produktionsumgebung wechseln können, ohne eine einzige Zeile Code zu ändern. Algorithmus-Ingenieure werden bei der Erstellung eines Prototyps mit Milvus eine viel bessere Erfahrung machen.</p>
<custom-h1>Testen Sie jetzt die sofort einsatzbereite Vektorsuche</custom-h1><p>Darüber hinaus bietet Milvus 2.1 auch einige große Verbesserungen in Bezug auf Stabilität und Skalierbarkeit, und wir freuen uns auf Ihre Nutzung und Ihr Feedback.</p>
<h2 id="Whats-next" class="common-anchor-header">Was kommt als nächstes?<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
<li>Lesen Sie die detaillierten <a href="https://milvus.io/docs/v2.1.x/release_notes.md">Release Notes</a> für alle Änderungen in Milvus 2.1</li>
<li><a href="https://milvus.io/docs/v2.1.x/install_standalone-docker.md">Installieren</a>Sie Milvus 2.1 und probieren Sie die neuen Funktionen aus</li>
<li>Treten Sie unserer <a href="https://slack.milvus.io/">Slack-Community</a> bei und diskutieren Sie die neuen Funktionen mit Tausenden von Milvus-Nutzern auf der ganzen Welt</li>
<li>Folgen Sie uns auf <a href="https://twitter.com/milvusio">Twitter</a> und<a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>, um Updates zu erhalten, sobald unsere Blogs zu bestimmten neuen Funktionen veröffentlicht werden</li>
</ul>
<blockquote>
<p>Bearbeitet von <a href="https://github.com/songxianj">Songxian Jiang</a></p>
</blockquote>
