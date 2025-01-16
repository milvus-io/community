---
id: >-
  milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability.md
title: >-
  Milvus stellt MMap für neu definiertes Datenmanagement und erhöhte
  Speicherkapazität vor
author: Yang Cen
date: 2023-11-15T00:00:00.000Z
desc: >-
  Die MMap-Funktion von Milvus ermöglicht es den Benutzern, mehr Daten in einem
  begrenzten Speicher zu verarbeiten, wobei ein empfindliches Gleichgewicht
  zwischen Leistung, Kosten und Systemgrenzen erreicht wird.
cover: assets.zilliz.com/Exploring_M_Map_5086d652bd.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, MMap, Data Management, Vector Embeddings
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/milvus-introduced-mmap-for-redefined-data-management-increased-storage-capability
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Exploring_M_Map_5086d652bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://zilliz.com/what-is-milvus">Milvus</a> ist die schnellste Lösung unter den <a href="https://zilliz.com/blog/what-is-a-real-vector-database">Open-Source-Vektordatenbanken</a> und richtet sich an Benutzer mit hohen Leistungsanforderungen. Die unterschiedlichen Bedürfnisse der Nutzer spiegeln jedoch die Daten wider, mit denen sie arbeiten. Einige legen mehr Wert auf budgetfreundliche Lösungen und umfangreichen Speicherplatz als auf reine Geschwindigkeit. Milvus hat dieses Spektrum an Anforderungen verstanden und führt die MMap-Funktion ein, die den Umgang mit großen Datenmengen neu definiert und Kosteneffizienz ohne Einbußen bei der Funktionalität verspricht.</p>
<h2 id="What-is-MMap" class="common-anchor-header">Was ist MMap?<button data-href="#What-is-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>MMap, kurz für memory-mapped files, überbrückt die Lücke zwischen Dateien und Speicher in Betriebssystemen. Mit dieser Technologie kann Milvus große Dateien direkt in den Speicherbereich des Systems abbilden und Dateien in zusammenhängende Speicherblöcke umwandeln. Diese Integration macht explizite Lese- oder Schreibvorgänge überflüssig und verändert die Art und Weise, wie Milvus Daten verwaltet, grundlegend. Sie sorgt für einen nahtlosen Zugriff und eine effiziente Speicherung großer Dateien oder für Situationen, in denen Benutzer nach dem Zufallsprinzip auf Dateien zugreifen müssen.</p>
<h2 id="Who-benefits-from-MMap" class="common-anchor-header">Wer profitiert von MMap?<button data-href="#Who-benefits-from-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>Vektordatenbanken erfordern aufgrund der Speicheranforderungen von Vektordaten eine erhebliche Speicherkapazität. Mit der MMap-Funktion wird die Verarbeitung von mehr Daten bei begrenztem Speicherplatz möglich. Diese erhöhte Kapazität geht jedoch zu Lasten der Leistung. Das System verwaltet den Speicher auf intelligente Weise, indem es einige Daten je nach Auslastung und Verwendung verdrängt. Durch diese Verdrängung kann Milvus mehr Daten in der gleichen Speicherkapazität verarbeiten.</p>
<p>Bei unseren Tests haben wir festgestellt, dass bei ausreichender Speicherkapazität alle Daten nach einer Aufwärmphase im Speicher verbleiben und die Systemleistung erhalten bleibt. Wenn jedoch das Datenvolumen wächst, nimmt die Leistung allmählich ab. <strong>Daher empfehlen wir die MMap-Funktion für Benutzer, die weniger empfindlich auf Leistungsschwankungen reagieren.</strong></p>
<h2 id="Enabling-MMap-in-Milvus-a-simple-configuration" class="common-anchor-header">Aktivieren von MMap in Milvus: eine einfache Konfiguration<button data-href="#Enabling-MMap-in-Milvus-a-simple-configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Aktivierung von MMap in Milvus ist denkbar einfach. Alles, was Sie tun müssen, ist, die Datei <code translate="no">milvus.yaml</code> zu ändern: Fügen Sie das Element <code translate="no">mmapDirPath</code> unter der Konfiguration <code translate="no">queryNode</code> hinzu und geben Sie einen gültigen Pfad als Wert an.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/enabling_mmap_a2df88276b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Striking-the-balance-performance-storage-and-system-limits" class="common-anchor-header">Das Gleichgewicht finden: Leistung, Speicherplatz und Systemgrenzen<button data-href="#Striking-the-balance-performance-storage-and-system-limits" class="anchor-icon" translate="no">
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
    </button></h2><p>Datenzugriffsmuster wirken sich erheblich auf die Leistung aus. Die MMap-Funktion von Milvus optimiert den Datenzugriff auf der Grundlage der Lokalität. MMap ermöglicht es Milvus, skalare Daten für Datensegmente mit sequentiellem Zugriff direkt auf die Festplatte zu schreiben. Daten mit variabler Länge, wie z. B. Strings, werden abgeflacht und mit einem Offset-Array im Speicher indiziert. Dieser Ansatz gewährleistet die Lokalität des Datenzugriffs und eliminiert den Overhead, der durch die separate Speicherung der Daten variabler Länge entsteht. Die Optimierungen für Vektorindizes sind sehr sorgfältig. MMap wird selektiv für Vektordaten eingesetzt, während die Adjazenzlisten im Speicher verbleiben, wodurch viel Speicherplatz eingespart wird, ohne die Leistung zu beeinträchtigen.</p>
<p>Darüber hinaus maximiert MMap die Datenverarbeitung durch Minimierung der Speichernutzung. Im Gegensatz zu früheren Milvus-Versionen, bei denen QueryNode ganze Datensätze kopiert hat, verwendet MMap während der Entwicklung einen optimierten, kopierfreien Streaming-Prozess. Diese Optimierung reduziert den Speicher-Overhead drastisch.</p>
<p><strong>Unsere internen Testergebnisse zeigen, dass Milvus die doppelte Datenmenge effizient verarbeiten kann, wenn MMap aktiviert ist.</strong></p>
<h2 id="The-road-ahead-continuous-innovation-and-user-centric-enhancements" class="common-anchor-header">Der Weg in die Zukunft: kontinuierliche Innovation und benutzerorientierte Erweiterungen<button data-href="#The-road-ahead-continuous-innovation-and-user-centric-enhancements" class="anchor-icon" translate="no">
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
    </button></h2><p>Während sich die MMap-Funktion noch in der Beta-Phase befindet, arbeitet das Milvus-Team an einer kontinuierlichen Verbesserung. Zukünftige Updates werden die Speichernutzung des Systems verfeinern und Milvus in die Lage versetzen, noch umfangreichere Datenmengen auf einem einzigen Knoten zu unterstützen. Die Benutzer können eine genauere Kontrolle über die MMap-Funktion erwarten, die dynamische Änderungen an Sammlungen und erweiterte Feldlademodi ermöglicht. Diese Verbesserungen bieten eine noch nie dagewesene Flexibilität, die es den Anwendern ermöglicht, ihre Datenverarbeitungsstrategien an die jeweiligen Anforderungen anzupassen.</p>
<h2 id="Conclusion-redefining-data-processing-excellence-with-Milvus-MMap" class="common-anchor-header">Fazit: Neudefinition der Datenverarbeitungsqualität mit Milvus MMap<button data-href="#Conclusion-redefining-data-processing-excellence-with-Milvus-MMap" class="anchor-icon" translate="no">
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
    </button></h2><p>Die MMap-Funktion von Milvus 2.3 stellt einen bedeutenden Sprung in der Datenverarbeitungstechnologie dar. Durch ein ausgewogenes Verhältnis zwischen Leistung, Kosten und Systemgrenzen ermöglicht Milvus den Anwendern, große Datenmengen effizient und kostengünstig zu verarbeiten. Mit seiner kontinuierlichen Weiterentwicklung bleibt Milvus an der Spitze innovativer Lösungen und definiert die Grenzen des Erreichbaren im Datenmanagement neu.</p>
<p>Bleiben Sie dran für weitere bahnbrechende Entwicklungen, denn Milvus setzt seine Reise in Richtung einer beispiellosen Datenverarbeitungsexzellenz fort.</p>
