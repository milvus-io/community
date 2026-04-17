---
id: milvus-2025-roadmap-tell-us-what-you-think.md
title: 'Milvus 2025 Roadmap - Sagen Sie uns, was Sie denken'
author: 'Fendy Feng, Field Zhang'
date: 2025-03-27T00:00:00.000Z
desc: >-
  Im Jahr 2025 werden wir zwei neue Versionen von Milvus, Milvus 2.6 und Milvus
  3.0, sowie viele weitere technische Funktionen einführen. Wir laden Sie ein,
  uns Ihre Gedanken mitzuteilen.
cover: assets.zilliz.com/2025_roadmap_04e6c5d1c3.png
tag: Announcements
recommend: true
canonicalUrl: 'https://milvus.io/blog/milvus-2025-roadmap-tell-us-what-you-think.md'
---
<p>Hallo, Milvus-Nutzer und -Mitwirkende!</p>
<p>Wir freuen uns, Ihnen unseren <a href="https://milvus.io/docs/roadmap.md"><strong>Fahrplan für Milvus 2025</strong></a> vorstellen zu können. 🚀 Dieser technische Plan hebt die wichtigsten Funktionen und Verbesserungen hervor, die wir entwickeln, um Milvus noch leistungsfähiger für Ihre Vektorsuchanforderungen zu machen.</p>
<p>Aber das ist erst der Anfang - wir wollen Ihre Erkenntnisse! Ihr Feedback trägt dazu bei, Milvus zu formen und sicherzustellen, dass es sich weiterentwickelt, um realen Herausforderungen zu begegnen. Lassen Sie uns wissen, was Sie denken, und helfen Sie uns, die Roadmap zu verfeinern, während wir vorankommen.</p>
<h2 id="The-Current-Landscape" class="common-anchor-header">Die aktuelle Landschaft<button data-href="#The-Current-Landscape" class="anchor-icon" translate="no">
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
    </button></h2><p>Im Laufe des letzten Jahres haben viele von Ihnen beeindruckende RAG- und Agentenanwendungen mit Milvus erstellt und dabei viele unserer beliebten Funktionen genutzt, wie z. B. unsere Modellintegration, Volltextsuche und hybride Suche. Ihre Implementierungen haben uns wertvolle Einblicke in die realen Anforderungen der Vektorsuche gegeben.</p>
<p>Mit der Weiterentwicklung der KI-Technologien werden Ihre Anwendungsfälle immer anspruchsvoller - von der einfachen Vektorsuche bis hin zu komplexen multimodalen Anwendungen, die intelligente Agenten, autonome Systeme und verkörperte KI umfassen. Diese technischen Herausforderungen bilden die Grundlage für unsere Roadmap, mit der wir Milvus weiterentwickeln, um Ihre Anforderungen zu erfüllen.</p>
<h2 id="Two-Major-Releases-in-2025-Milvus-26-and-Milvus-30" class="common-anchor-header">Zwei große Releases im Jahr 2025: Milvus 2.6 und Milvus 3.0<button data-href="#Two-Major-Releases-in-2025-Milvus-26-and-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>Im Jahr 2025 werden wir zwei Hauptversionen auf den Markt bringen: Milvus 2.6 (Mitte von CY25) und Milvus 3.0 (Ende 2025).</p>
<p><strong>Milvus 2.6</strong> konzentriert sich auf die wichtigsten Architekturverbesserungen, die Sie sich gewünscht haben:</p>
<ul>
<li><p>Einfachere Bereitstellung mit weniger Abhängigkeiten (Auf Wiedersehen, Kopfschmerzen bei der Bereitstellung!)</p></li>
<li><p>Schnellere Dateneingabe-Pipelines</p></li>
<li><p>Niedrigere Speicherkosten (wir kennen Ihre Bedenken hinsichtlich der Produktionskosten)</p></li>
<li><p>Bessere Handhabung umfangreicher Datenoperationen (Löschen/Ändern)</p></li>
<li><p>Effizientere Skalar- und Volltextsuche</p></li>
<li><p>Unterstützung für die neuesten Einbettungsmodelle, mit denen Sie arbeiten</p></li>
</ul>
<p><strong>Milvus 3.0</strong> ist unsere größere architektonische Weiterentwicklung, die ein Vector Data Lake System für folgende Zwecke einführt</p>
<ul>
<li><p>Nahtlose Integration von KI-Diensten</p></li>
<li><p>Suchfunktionen der nächsten Stufe</p></li>
<li><p>Stabileres Datenmanagement</p></li>
<li><p>Bessere Handhabung der riesigen Offline-Datensätze, mit denen Sie arbeiten</p></li>
</ul>
<h2 id="Technical-Features-Were-Planning---We-Need-Your-Feedback" class="common-anchor-header">Geplante technische Funktionen - Wir brauchen Ihr Feedback<button data-href="#Technical-Features-Were-Planning---We-Need-Your-Feedback" class="anchor-icon" translate="no">
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
    </button></h2><p>Nachfolgend finden Sie die wichtigsten technischen Funktionen, die wir in Milvus integrieren möchten.</p>
<table>
<thead>
<tr><th><strong>Bereich der Schlüsselfunktionen</strong></th><th><strong>Technische Merkmale</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>AI-gesteuerte Verarbeitung unstrukturierter Daten</strong></td><td>- Daten-Eingang/Ausgang: Native Integration mit den wichtigsten Modelldiensten zur Aufnahme von Rohtext<br>- Verarbeitung von Originaldaten: Unterstützung von Text/URL-Referenzen für die Verarbeitung von Rohdaten<br>- Tensor-Unterstützung: Implementierung von Vektorlisten (für ColBERT/CoPali/Video-Szenarien)<br>- Erweiterte Datentypen: DateTime, Map, GIS-Unterstützung je nach Anforderung<br>- Iterative Suche: Verfeinerung des Abfragevektors durch Benutzer-Feedback</td></tr>
<tr><td><strong>Suchqualität und Leistungsverbesserungen</strong></td><td>- Advanced Matching: phrase_match &amp; multi_match Fähigkeiten<br>- Analyzer Upgrade: Verbesserung des Analyzers mit erweiterter Tokenizer-Unterstützung und verbesserter Beobachtbarkeit<br>- JSON-Optimierung: Schnellere Filterung durch verbesserte Indizierung<br>- Ausführungssortierung: Skalare feldbasierte Ergebnissortierung<br>- Erweiterter Reranker: Modellbasiertes Reranking und benutzerdefinierte Scoring-Funktionen<br>- Iterative Suche: Verfeinerung von Abfragevektoren durch Benutzerfeedback</td></tr>
<tr><td><strong>Flexibilität bei der Datenverwaltung</strong></td><td>- Schema-Änderung: Hinzufügen/Löschen von Feldern, Ändern der Varchar-Länge<br>- Skalare Aggregationen: count/distinct/min/max-Operationen<br>- UDF-Unterstützung: Unterstützung von benutzerdefinierten Funktionen<br>- Datenversionierung: Snapshot-basiertes Rollback-System<br>- Daten-Clustering: Co-Location durch Konfiguration<br>- Daten-Sampling: Schnelles Abrufen von Ergebnissen auf der Grundlage von Stichprobendaten</td></tr>
<tr><td><strong>Architektonische Verbesserungen</strong></td><td>- Stream-Knoten: Vereinfachte inkrementelle Dateneingabe<br>- MixCoord: Vereinheitlichte Koordinator-Architektur<br>- Logstore-Unabhängigkeit: Reduzierte externe Abhängigkeiten wie Pulsar<br>- PK-Deduplizierung: Globale Primärschlüssel-Deduplizierung</td></tr>
<tr><td><strong>Kosteneffizienz und Architekturverbesserungen</strong></td><td>- Gestufte Speicherung: Trennung von heißen und kalten Daten für niedrigere Speicherkosten<br>- Datenlöschungsrichtlinie: Benutzer können ihre eigene Datenlöschungsrichtlinie definieren<br>- Massenhafte Aktualisierungen: Unterstützt feldspezifische Wertänderungen, ETL, etc.<br>- Large TopK: Liefert große Datensätze<br>- VTS GA: Verbindung zu verschiedenen Datenquellen<br>- Erweiterte Quantisierung: Optimierung von Speicherverbrauch und Leistung auf der Grundlage von Quantisierungstechniken<br>- Elastizität der Ressourcen: Dynamische Skalierung der Ressourcen zur Anpassung an unterschiedliche Schreib- und Leselasten sowie Hintergrundaufgaben</td></tr>
</tbody>
</table>
<p>Bei der Umsetzung dieser Roadmap würden wir uns über Ihre Meinung und Ihr Feedback zu den folgenden Punkten freuen:</p>
<ol>
<li><p><strong>Funktionsprioritäten:</strong> Welche Funktionen in unserer Roadmap haben die größten Auswirkungen auf Ihre Arbeit?</p></li>
<li><p><strong>Ideen für die Umsetzung:</strong> Gibt es spezifische Ansätze, die Ihrer Meinung nach für diese Funktionen gut funktionieren würden?</p></li>
<li><p><strong>Ausrichtung auf Anwendungsfälle:</strong> Wie passen diese geplanten Funktionen zu Ihren aktuellen und zukünftigen Anwendungsfällen?</p></li>
<li><p><strong>Leistungsüberlegungen:</strong> Gibt es Leistungsaspekte, auf die wir uns für Ihre speziellen Bedürfnisse konzentrieren sollten?</p></li>
</ol>
<p><strong>Ihre Erkenntnisse helfen uns, Milvus für alle besser zu machen. Sie können Ihre Gedanken gerne in unserem<a href="https://github.com/milvus-io/milvus/discussions/40263"> Milvus-Diskussionsforum</a> oder in unserem <a href="https://discord.com/invite/8uyFbECzPX">Discord-Kanal</a> äußern.</strong></p>
<h2 id="Welcome-to-Contribute-to-Milvus" class="common-anchor-header">Willkommen zur Mitarbeit an Milvus<button data-href="#Welcome-to-Contribute-to-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Als Open-Source-Projekt ist Milvus immer offen für Ihre Beiträge:</p>
<ul>
<li><p><strong>Teilen Sie uns Ihr Feedback mit:</strong> Melden Sie Probleme oder schlagen Sie Funktionen über unsere <a href="https://github.com/milvus-io/milvus/issues">GitHub-Problemseite</a> vor.</p></li>
<li><p><strong>Code-Beiträge:</strong> Reichen Sie Pull Requests ein (siehe unseren <a href="https://github.com/milvus-io/milvus/blob/82915a9630ab0ff40d7891b97c367ede5726ff7c/CONTRIBUTING.md">Contributor's Guide</a>)</p></li>
<li><p><strong>Verbreiten Sie die Nachricht:</strong> Teilen Sie Ihre Milvus-Erfahrungen mit und <a href="https://github.com/milvus-io/milvus">geben Sie unserem GitHub-Repository einen Stern</a>.</p></li>
</ul>
<p>Wir freuen uns darauf, dieses nächste Kapitel von Milvus gemeinsam mit Ihnen aufzubauen. Ihr Code, Ihre Ideen und Ihr Feedback treiben dieses Projekt voran!</p>
<p>- Das Milvus-Team</p>
