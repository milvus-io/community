---
id: milvus-at-its-best-exploring-2-2-to-2-2-6.md
title: 'Milvus von seiner besten Seite: Erforschung von v2.2 bis v2.2.6'
author: Fendy Feng
date: 2023-04-22T00:00:00.000Z
cover: assets.zilliz.com/explore_milvus_latest_versions_48a4138d02.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
desc: Was ist neu bei Milvus 2.2 bis 2.2.6
recommend: true
canonicalUrl: 'https://milvus.io/blog/milvus-at-its-best-exploring-2-2-to-2-2-6.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/exploring_milvus_latest_versions_4fa890533e.png" alt="Milvus at Its Best" class="doc-image" id="milvus-at-its-best" />
   </span> <span class="img-wrapper"> <span>Milvus von seiner besten Seite</span> </span></p>
<p>Willkommen zurück, liebe Milvus-Fans! Wir wissen, dass es schon eine Weile her ist, seit wir das letzte Mal über diese innovative Open-Source-Vektordatenbank berichtet haben. Aber keine Sorge, wir sind hier, um Sie über alle aufregenden Entwicklungen zu informieren, die seit August letzten Jahres stattgefunden haben.</p>
<p>In diesem Blogbeitrag stellen wir Ihnen die neuesten Milvus-Versionen vor, von Version 2.2 bis Version 2.2.6. Wir haben viel zu berichten, darunter neue Funktionen, Verbesserungen, Fehlerbehebungen und Optimierungen. Also, schnallen Sie sich an, und lassen Sie uns eintauchen!</p>
<h2 id="Milvus-v22-a-major-release-with-enhanced-stability-faster-search-speed-and-flexible-scalability" class="common-anchor-header">Milvus v2.2: eine größere Version mit verbesserter Stabilität, schnellerer Suchgeschwindigkeit und flexibler Skalierbarkeit<button data-href="#Milvus-v22-a-major-release-with-enhanced-stability-faster-search-speed-and-flexible-scalability" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2 ist ein bedeutendes Release, das sieben brandneue Funktionen und zahlreiche bahnbrechende Verbesserungen gegenüber früheren Versionen einführt. Werfen wir einen genaueren Blick auf einige der Highlights:</p>
<ul>
<li><strong>Bulk-Inserts von Entitäten aus Dateien</strong>: Mit dieser Funktion können Sie einen Stapel von Entitäten in einer oder mehreren Dateien mit nur wenigen Zeilen Code direkt in Milvus hochladen, was Ihnen Zeit und Mühe spart.</li>
<li><strong>Paginierung von Abfrageergebnissen</strong>: Um zu vermeiden, dass eine Vielzahl von Such- und Abfrageergebnissen in einem einzigen Remote-Procedure-Call (RPC) zurückgegeben werden, ermöglicht Milvus v2.2 die Konfiguration von Offsets und die Filterung von Ergebnissen mit Schlüsselwörtern in Suchen und Abfragen.</li>
<li><strong>Rollenbasierte Zugriffskontrolle (RBAC)</strong>: Milvus v2.2 unterstützt jetzt RBAC, so dass Sie den Zugriff auf Ihre Milvus-Instanz durch die Verwaltung von Benutzern, Rollen und Berechtigungen steuern können.</li>
<li><strong>Kontingente und Limits</strong>: Quotas und Limits sind ein neuer Mechanismus in Milvus v2.2, der das Datenbanksystem vor OOM-Fehlern (Out-of-Memory) und Abstürzen bei plötzlichen Datenverkehrsspitzen schützt. Mit dieser Funktion können Sie die Ingestion, die Suche und die Speichernutzung kontrollieren.</li>
<li><strong>Time to Live (TTL) auf Sammlungsebene</strong>: In früheren Versionen von Milvus konnten Sie nur die TTL für Ihre Cluster konfigurieren. Milvus v2.2 unterstützt jetzt jedoch die Konfiguration der TTL auf Sammlungsebene. Wenn Sie die TTL für eine bestimmte Sammlung konfigurieren, laufen die Entitäten in dieser Sammlung automatisch ab, nachdem die TTL abgelaufen ist. Diese Konfiguration bietet eine feinere Kontrolle über die Datenaufbewahrung.</li>
<li><strong>Festplattenbasierte Approximate Nearest Neighbor Search (ANNS) Indizes (Beta)</strong>: Milvus v2.2 führt Unterstützung für DiskANN ein, einen SSD-residenten und Vamana-Graph-basierten ANNS-Algorithmus. Diese Unterstützung ermöglicht die direkte Suche in großen Datensätzen, was die Speichernutzung um bis zu 10 Mal reduzieren kann.</li>
<li><strong>Datensicherung (Beta)</strong>: Milvus v2.2 bietet <a href="https://github.com/zilliztech/milvus-backup">ein brandneues Tool</a> für die ordnungsgemäße Sicherung und Wiederherstellung Ihrer Milvus-Daten, entweder über eine Befehlszeile oder einen API-Server.</li>
</ul>
<p>Zusätzlich zu den oben erwähnten neuen Funktionen enthält Milvus v2.2 Korrekturen für fünf Fehler und mehrere Verbesserungen, um die Stabilität, Beobachtbarkeit und Leistung von Milvus zu verbessern. Weitere Details finden Sie in den <a href="https://milvus.io/docs/release_notes.md#v220">Milvus v2.2 Release Notes</a>.</p>
<h2 id="Milvus-v221--v222-minor-releases-with-issues-fixed" class="common-anchor-header">Milvus v2.2.1 &amp; v2.2.2: kleinere Versionen mit behobenen Problemen<button data-href="#Milvus-v221--v222-minor-releases-with-issues-fixed" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.1 und v2.2.2 sind kleinere Releases, die sich auf die Behebung kritischer Probleme in älteren Versionen und die Einführung neuer Funktionen konzentrieren. Hier sind einige Highlights:</p>
<h3 id="Milvus-v221" class="common-anchor-header">Milvus v2.2.1</h3><ul>
<li>Unterstützt Pulsa-Mieter und -Authentifizierung</li>
<li>Unterstützt Transport Layer Security (TLS) in der etcd-Konfigurationsquelle</li>
<li>Verbessert die Suchleistung um über 30%</li>
<li>Optimiert den Scheduler und erhöht die Wahrscheinlichkeit von Merge-Tasks</li>
<li>Behebt mehrere Fehler, einschließlich Term-Filtering-Fehlern bei indizierten skalaren Feldern und IndexNode-Panik bei Fehlern bei der Erstellung eines Index</li>
</ul>
<h3 id="Milvus-v222" class="common-anchor-header">Milvus v2.2.2</h3><ul>
<li>Behebt das Problem, dass der Proxy den Cache der Shard-Leader nicht aktualisiert</li>
<li>Behebt das Problem, dass die geladenen Informationen für freigegebene Sammlungen/Partitionen nicht bereinigt werden</li>
<li>Behebt das Problem, dass der Ladezähler nicht rechtzeitig geleert wird</li>
</ul>
<p>Weitere Details finden Sie in den <a href="https://milvus.io/docs/release_notes.md#v221">Milvus v2.2.1 Release Notes</a> und <a href="https://milvus.io/docs/release_notes.md#v222">Milvus v2.2.2 Release Notes</a>.</p>
<h2 id="Milvus-v223-more-secure-stable-and-available" class="common-anchor-header">Milvus v2.2.3: sicherer, stabiler und verfügbarer<button data-href="#Milvus-v223-more-secure-stable-and-available" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.3 ist eine Version, die sich auf die Verbesserung der Sicherheit, Stabilität und Verfügbarkeit des Systems konzentriert. Darüber hinaus führt sie zwei wichtige Funktionen ein:</p>
<ul>
<li><p><strong>Rolling Upgrade</strong>: Diese Funktion ermöglicht es Milvus, auf eingehende Anfragen während des Upgrade-Prozesses zu reagieren, was in früheren Versionen nicht möglich war. Rolling Upgrades stellen sicher, dass das System auch während des Upgrades verfügbar bleibt und auf Benutzeranfragen reagieren kann.</p></li>
<li><p><strong>Hohe Verfügbarkeit des Koordinators (HA)</strong>: Diese Funktion ermöglicht es den Milvus-Koordinatoren, in einem Aktiv-Standby-Modus zu arbeiten, wodurch das Risiko von Einzelausfällen verringert wird. Selbst bei unerwarteten Katastrophen wird die Wiederherstellungszeit auf höchstens 30 Sekunden reduziert.</p></li>
</ul>
<p>Zusätzlich zu diesen neuen Funktionen enthält Milvus v2.2.3 zahlreiche Verbesserungen und Fehlerkorrekturen, einschließlich verbesserter Bulk-Insert-Leistung, reduzierter Speichernutzung, optimierter Überwachungsmetriken und verbesserter Meta-Storage-Leistung. Weitere Details finden Sie in den <a href="https://milvus.io/docs/release_notes.md#v223">Milvus v2.2.3 Release Notes</a>.</p>
<h2 id="Milvus-v224-faster-more-reliable-and-resource-saving" class="common-anchor-header">Milvus v2.2.4: schneller, zuverlässiger und ressourcenschonend<button data-href="#Milvus-v224-faster-more-reliable-and-resource-saving" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.4 ist ein kleines Update zu Milvus v2.2. Es führt vier neue Funktionen und mehrere Verbesserungen ein, die zu einer schnelleren Leistung, verbesserter Zuverlässigkeit und einem geringeren Ressourcenverbrauch führen. Zu den Highlights dieser Version gehören:</p>
<ul>
<li><strong>Ressourcengruppierung</strong>: Milvus unterstützt jetzt die Gruppierung von QueryNodes in andere Ressourcengruppen, was eine vollständige Isolierung des Zugriffs auf physische Ressourcen in verschiedenen Gruppen ermöglicht.</li>
<li><strong>Umbenennung von Sammlungen</strong>: Die API für die Umbenennung von Sammlungen ermöglicht es Benutzern, den Namen einer Sammlung zu ändern, was mehr Flexibilität bei der Verwaltung von Sammlungen und eine bessere Benutzerfreundlichkeit bietet.</li>
<li><strong>Unterstützung für Google Cloud Storage</strong></li>
<li><strong>Neue Option in den Such- und Abfrage-APIs</strong>: Diese neue Funktion ermöglicht es Benutzern, die Suche in allen wachsenden Segmenten zu überspringen und bietet eine bessere Suchleistung in Szenarien, in denen die Suche gleichzeitig mit dem Einfügen von Daten durchgeführt wird.</li>
</ul>
<p>Weitere Informationen finden Sie in den <a href="https://milvus.io/docs/release_notes.md#v224">Milvus v2.2.4 Release Notes</a>.</p>
<h2 id="Milvus-v225-NOT-RECOMMENDED" class="common-anchor-header">Milvus v2.2.5: NICHT EMPFOHLEN<button data-href="#Milvus-v225-NOT-RECOMMENDED" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.5 weist mehrere kritische Probleme auf, weshalb wir die Verwendung dieser Version nicht empfehlen.  Wir entschuldigen uns aufrichtig für etwaige Unannehmlichkeiten, die dadurch entstanden sind. Diese Probleme sind jedoch in Milvus v2.2.6 behoben worden.</p>
<h2 id="Milvus-v226-resolves-critical-issues-from-v225" class="common-anchor-header">Milvus v2.2.6: Behebt kritische Probleme von v2.2.5<button data-href="#Milvus-v226-resolves-critical-issues-from-v225" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.6 hat erfolgreich die kritischen Probleme behoben, die in v2.2.5 entdeckt wurden, einschließlich der Probleme mit der Wiederverwendung von schmutzigen Binlog-Daten und dem DataCoord GC-Fehler. Wenn Sie derzeit v2.2.5 verwenden, sollten Sie ein Upgrade durchführen, um optimale Leistung und Stabilität zu gewährleisten.</p>
<p>Zu den behobenen kritischen Problemen gehören:</p>
<ul>
<li>DataCoord GC-Fehler</li>
<li>Überschreiben von übergebenen Indexparametern</li>
<li>Systemverzögerung durch RootCoord-Nachrichtenrückstau</li>
<li>Ungenauigkeit der Metrik RootCoordInsertChannelTimeTick</li>
<li>Möglicher Stopp des Zeitstempels</li>
<li>Gelegentliche Selbstzerstörung der Koordinatorrolle während des Neustartvorgangs</li>
<li>Zurückfallen von Checkpoints aufgrund eines anormalen Beendens der Garbage Collection</li>
</ul>
<p>Weitere Details finden Sie in den <a href="https://milvus.io/docs/release_notes.md#v226">Milvus v2.2.6 Release Notes</a>.</p>
<h2 id="Summary" class="common-anchor-header">Zusammenfassung<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>Zusammenfassend lässt sich sagen, dass die letzten Milvus-Releases von v2.2 bis v2.2.6 viele spannende Updates und Verbesserungen gebracht haben. Von neuen Funktionen bis hin zu Fehlerkorrekturen und Optimierungen, Milvus erfüllt weiterhin seine Verpflichtungen, innovative Lösungen anzubieten und Anwendungen in verschiedenen Bereichen zu unterstützen. Bleiben Sie dran für weitere spannende Updates und Innovationen aus der Milvus-Community.</p>
