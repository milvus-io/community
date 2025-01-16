---
id: >-
  milvus-2-3-4-faster-searches-expanded-data-support-improved-monitoring-and-more.md
title: >-
  Milvus 2.3.4: Schnellere Suchvorgänge, erweiterte Datenunterstützung,
  verbesserte Überwachung und mehr
author: 'Ken Zhang, Fendy Feng'
date: 2024-01-12T00:00:00.000Z
cover: assets.zilliz.com/What_is_new_in_Milvus_2_3_4_1847b0fa8a.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
desc: Einführung von Milvus 2.3.4 neue Funktionen und Verbesserungen
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-3-4-faster-searches-expanded-data-support-improved-monitoring-and-more.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_is_new_in_Milvus_2_3_4_1847b0fa8a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Wir freuen uns, die neueste Version von Milvus 2.3.4 vorstellen zu können. Dieses Update führt eine Reihe von Funktionen und Verbesserungen ein, die sorgfältig ausgearbeitet wurden, um die Leistung zu optimieren, die Effizienz zu steigern und eine nahtlose Benutzererfahrung zu bieten. In diesem Blogbeitrag stellen wir Ihnen die Highlights von Milvus 2.3.4 vor.</p>
<h2 id="Access-logs-for-improved-monitoring" class="common-anchor-header">Zugriffsprotokolle für verbesserte Überwachung<button data-href="#Access-logs-for-improved-monitoring" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus unterstützt jetzt Zugriffsprotokolle, die unschätzbare Einblicke in die Interaktionen mit externen Schnittstellen bieten. Diese Protokolle zeichnen Methodennamen, Benutzeranfragen, Antwortzeiten, Fehlercodes und andere Interaktionsinformationen auf und ermöglichen Entwicklern und Systemadministratoren die Durchführung von Leistungsanalysen, Sicherheitsüberprüfungen und eine effiziente Fehlerbehebung.</p>
<p><strong><em>Hinweis:</em></strong> <em>Derzeit unterstützen die Zugriffsprotokolle nur gRPC-Interaktionen. Wir bemühen uns jedoch weiterhin um Verbesserungen und werden diese Funktion in zukünftigen Versionen auf RESTful-Anfrageprotokolle ausweiten.</em></p>
<p>Ausführlichere Informationen finden Sie unter <a href="https://milvus.io/docs/configure_access_logs.md">Konfigurieren von Zugriffsprotokollen</a>.</p>
<h2 id="Parquet-file-imports-for-enhanced-data-processing-efficiency" class="common-anchor-header">Parquet-Dateiimporte für eine effizientere Datenverarbeitung<button data-href="#Parquet-file-imports-for-enhanced-data-processing-efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3.4 unterstützt jetzt den Import von Parquet-Dateien, einem weit verbreiteten spaltenförmigen Speicherformat, das die Effizienz der Speicherung und Verarbeitung großer Datensätze verbessern soll. Diese Erweiterung bietet den Benutzern mehr Flexibilität und Effizienz bei der Datenverarbeitung. Da die mühsame Konvertierung von Datenformaten entfällt, können Benutzer, die umfangreiche Datensätze im Parquet-Format verwalten, einen rationalisierten Datenimportprozess erleben, der die Zeit von der anfänglichen Datenvorbereitung bis zur anschließenden Vektorabfrage erheblich verkürzt.</p>
<p>Darüber hinaus hat unser Datenformat-Konvertierungstool, BulkWriter, jetzt Parquet als Standard-Ausgabeformat übernommen, was eine intuitivere Erfahrung für Entwickler gewährleistet.</p>
<h2 id="Binlog-index-on-growing-segments-for-faster-searches" class="common-anchor-header">Binlog-Index auf wachsenden Segmenten für schnellere Suche<button data-href="#Binlog-index-on-growing-segments-for-faster-searches" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus nutzt jetzt einen Binlog-Index für wachsende Segmente, was zu einer bis zu zehnmal schnelleren Suche in wachsenden Segmenten führt. Diese Verbesserung steigert die Sucheffizienz erheblich und unterstützt fortgeschrittene Indizes wie IVF oder Fast Scan, was die Benutzerfreundlichkeit insgesamt verbessert.</p>
<h2 id="Support-for-up-to-10000-collectionspartitions" class="common-anchor-header">Unterstützung für bis zu 10.000 Sammlungen/Partitionen<button data-href="#Support-for-up-to-10000-collectionspartitions" class="anchor-icon" translate="no">
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
    </button></h2><p>Wie Tabellen und Partitionen in relationalen Datenbanken sind Sammlungen und Partitionen die zentralen Einheiten für die Speicherung und Verwaltung von Vektordaten in Milvus. Milvus 2.3.4 unterstützt jetzt bis zu 10.000 Sammlungen/Partitionen in einem Cluster, ein deutlicher Sprung von der vorherigen Grenze von 4.096. Diese Verbesserung kommt verschiedenen Anwendungsfällen zugute, wie z. B. der Verwaltung von Wissensdatenbanken und mandantenfähigen Umgebungen. Die erweiterte Unterstützung für Sammlungen/Partitionen resultiert aus der Verfeinerung des Zeittick-Mechanismus, der Goroutine-Verwaltung und der Speichernutzung.</p>
<p><strong><em>Hinweis:</em></strong> <em>Die empfohlene Grenze für die Anzahl der Sammlungen/Partitionen liegt bei 10.000, da ein Überschreiten dieser Grenze Auswirkungen auf die Fehlerbehebung und die Ressourcennutzung haben kann.</em></p>
<h2 id="Other-enhancements" class="common-anchor-header">Andere Erweiterungen<button data-href="#Other-enhancements" class="anchor-icon" translate="no">
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
    </button></h2><p>Zusätzlich zu den oben genannten Funktionen enthält Milvus 2.3.4 verschiedene Verbesserungen und Fehlerbehebungen. Dazu gehören eine verringerte Speichernutzung während des Datenabrufs und der Handhabung von Daten variabler Länge, eine verfeinerte Fehlermeldung, eine beschleunigte Ladegeschwindigkeit und eine verbesserte Abfrage-Shard-Balance. Diese kollektiven Verbesserungen tragen zu einer reibungsloseren und effizienteren Gesamtbenutzererfahrung bei.</p>
<p>Einen umfassenden Überblick über alle Änderungen, die in Milvus 2.3.4 eingeführt wurden, finden Sie in unseren <a href="https://milvus.io/docs/release_notes.md#v234">Release Notes</a>.</p>
<h2 id="Stay-connected" class="common-anchor-header">Bleiben Sie in Verbindung!<button data-href="#Stay-connected" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn Sie Fragen oder Feedback zu Milvus haben, treten Sie unserem <a href="https://discord.com/invite/8uyFbECzPX">Discord-Kanal</a> bei, um sich direkt mit unseren Ingenieuren und der Community auszutauschen, oder nehmen Sie an unserem <a href="https://discord.com/invite/RjNbk8RR4f">Milvus Community Lunch and Learn</a> teil, das jeden Dienstag von 12-12:30 PM PST stattfindet. Sie können uns auch gerne auf <a href="https://twitter.com/milvusio">Twitter</a> oder <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> folgen, um die neuesten Nachrichten und Updates über Milvus zu erhalten.</p>
