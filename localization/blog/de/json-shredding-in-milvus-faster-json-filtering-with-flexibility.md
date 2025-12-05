---
id: json-shredding-in-milvus-faster-json-filtering-with-flexibility.md
title: 'JSON Shredding in Milvus: 88,9x schnellere JSON-Filterung mit Flexibilität'
author: Jack Zhang
date: 2025-12-04T00:00:00.000Z
cover: assets.zilliz.com/json_shredding_cover_new_a678c3731f.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, JSON Shredding, JSON performance, columnar storage'
meta_title: |
  Milvus JSON Shredding: Faster JSON Filtering With Flexibility
desc: >-
  Entdecken Sie, wie Milvus JSON Shredding einen optimierten spaltenbasierten
  Speicher verwendet, um JSON-Abfragen um das 89-fache zu beschleunigen und
  gleichzeitig die volle Schemaflexibilität zu erhalten.
origin: >-
  https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md
---
<p>Moderne KI-Systeme produzieren mehr halbstrukturierte JSON-Daten als je zuvor. Kunden- und Produktinformationen werden zu einem JSON-Objekt verdichtet, Microservices geben bei jeder Anfrage JSON-Protokolle aus, IoT-Geräte streamen Sensormesswerte in leichtgewichtigen JSON-Payloads, und die heutigen KI-Anwendungen standardisieren zunehmend JSON für strukturierte Ausgaben. Das Ergebnis ist eine Flut von JSON-ähnlichen Daten, die in Vektordatenbanken fließen.</p>
<p>Traditionell gibt es zwei Möglichkeiten, JSON-Dokumente zu verarbeiten:</p>
<ul>
<li><p><strong>Jedes JSON-Feld wird in einem festen Schema vordefiniert und ein Index erstellt:</strong> Dieser Ansatz liefert eine solide Abfrageleistung, ist aber starr. Sobald sich das Datenformat ändert, löst jedes neue oder geänderte Feld eine weitere Runde mühsamer DDL-Aktualisierungen und Schemamigrationen aus.</p></li>
<li><p><strong>Speichern Sie das gesamte JSON-Objekt als eine einzige Spalte (sowohl der JSON-Typ als auch das dynamische Schema in Milvus verwenden diesen Ansatz):</strong> Diese Option bietet eine ausgezeichnete Flexibilität, allerdings auf Kosten der Abfrageleistung. Jede Abfrage erfordert ein JSON-Parsing zur Laufzeit und oft einen vollständigen Tabellenscan, was zu einer Latenz führt, die mit dem Wachstum des Datensatzes in die Höhe schießt.</p></li>
</ul>
<p>Früher war dies ein Dilemma zwischen Flexibilität und Leistung.</p>
<p>Mit der neu eingeführten JSON Shredding-Funktion in <a href="https://milvus.io/">Milvus</a> ist dies nicht mehr der Fall.</p>
<p>Mit der Einführung von <a href="https://milvus.io/docs/json-shredding.md">JSON Shredding</a> erreicht Milvus jetzt eine schemafreie Flexibilität mit der Leistung einer spaltenbasierten Speicherung, wodurch große semi-strukturierte Daten endlich sowohl flexibel als auch abfragefreundlich werden.</p>
<h2 id="How-JSON-Shredding-Works" class="common-anchor-header">Wie JSON Shredding funktioniert<button data-href="#How-JSON-Shredding-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>JSON Shredding beschleunigt JSON-Abfragen durch die Umwandlung von zeilenbasierten JSON-Dokumenten in einen hochoptimierten spaltenbasierten Speicher. Milvus bewahrt die Flexibilität von JSON für die Datenmodellierung und optimiert gleichzeitig automatisch die spaltenbasierte Speicherung, was den Datenzugriff und die Abfrageleistung erheblich verbessert.</p>
<p>Um spärliche oder seltene JSON-Felder effizient zu handhaben, verfügt Milvus auch über einen invertierten Index für gemeinsame Schlüssel. All dies geschieht für die Benutzer transparent: Sie können JSON-Dokumente wie gewohnt einfügen und es Milvus überlassen, die optimale Speicher- und Indexierungsstrategie intern zu verwalten.</p>
<p>Wenn Milvus JSON-Rohdatensätze mit unterschiedlichen Formen und Strukturen empfängt, analysiert es jeden JSON-Schlüssel auf sein Vorkommensverhältnis und seine Typstabilität (ob sein Datentyp in allen Dokumenten konsistent ist). Auf der Grundlage dieser Analyse wird jeder Schlüssel in eine von drei Kategorien eingeteilt:</p>
<ul>
<li><p><strong>Getippte Schlüssel:</strong> Schlüssel, die in den meisten Dokumenten vorkommen und immer den gleichen Datentyp haben (z. B. alle Ganzzahlen oder alle Zeichenketten).</p></li>
<li><p><strong>Dynamische Schlüssel</strong>: Schlüssel, die häufig vorkommen, aber unterschiedliche Datentypen haben (z. B. manchmal eine Zeichenkette, manchmal eine ganze Zahl).</p></li>
<li><p><strong>Gemeinsame Schlüssel:</strong> Schlüssel, die selten, spärlich oder verschachtelt sind und unter einen konfigurierbaren Häufigkeitsschwellenwert fallen.</p></li>
</ul>
<p>Milvus behandelt jede Kategorie anders, um die Effizienz zu maximieren:</p>
<ul>
<li><p><strong>Typisierte Schlüssel</strong> werden in speziellen, stark typisierten Spalten gespeichert.</p></li>
<li><p><strong>Dynamische Schlüssel</strong> werden auf der Grundlage des tatsächlichen Werttyps, der zur Laufzeit beobachtet wird, in dynamische Spalten eingeordnet.</p></li>
<li><p>Sowohl typisierte als auch dynamische Spalten werden in Arrow/Parquet-Spaltenformaten gespeichert, um ein schnelles Scannen und eine hochgradig optimierte Abfrageausführung zu ermöglichen.</p></li>
<li><p><strong>Gemeinsam genutzte Schlüssel</strong> werden in einer kompakten binären JSON-Spalte zusammengefasst, die von einem invertierten Index für gemeinsam genutzte Schlüssel begleitet wird. Dieser Index beschleunigt die Abfrage von Feldern mit geringer Häufigkeit, indem er irrelevante Zeilen frühzeitig ausschneidet und die Suche auf die Dokumente beschränkt, die den abgefragten Schlüssel enthalten.</p></li>
</ul>
<p>Diese Kombination aus adaptiver spaltenförmiger Speicherung und invertierter Indexierung bildet den Kern des JSON-Shredding-Mechanismus von Milvus und ermöglicht sowohl Flexibilität als auch hohe Leistung im großen Maßstab.</p>
<p>Der gesamte Arbeitsablauf ist unten dargestellt:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/json_shredding_79a62a9661.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Nachdem wir nun die Grundlagen der Funktionsweise von JSON Shredding kennengelernt haben, wollen wir uns die Schlüsselfunktionen genauer ansehen, die diesen Ansatz sowohl flexibel als auch leistungsstark machen.</p>
<h3 id="Shredding-and-Columnarization" class="common-anchor-header">Shredding und Kolumnarisierung</h3><p>Wenn ein neues JSON-Dokument geschrieben wird, zerlegt Milvus es und reorganisiert es in eine optimierte spaltenförmige Speicherung:</p>
<ul>
<li><p>Typisierte und dynamische Schlüssel werden automatisch identifiziert und in speziellen Spalten gespeichert.</p></li>
<li><p>Wenn das JSON verschachtelte Objekte enthält, generiert Milvus automatisch pfadbasierte Spaltennamen. Zum Beispiel kann ein <code translate="no">name</code> Feld innerhalb eines <code translate="no">user</code> Objekts mit dem Spaltennamen <code translate="no">/user/name</code> gespeichert werden.</p></li>
<li><p>Gemeinsam genutzte Schlüssel werden zusammen in einer einzigen, kompakten binären JSON-Spalte gespeichert. Da diese Schlüssel nur selten vorkommen, erstellt Milvus für sie einen invertierten Index, der eine schnelle Filterung ermöglicht und es dem System erlaubt, schnell die Zeilen zu finden, die den angegebenen Schlüssel enthalten.</p></li>
</ul>
<h3 id="Intelligent-Column-Management" class="common-anchor-header">Intelligentes Spaltenmanagement</h3><p>Milvus zerlegt JSON nicht nur in Spalten, sondern fügt durch dynamisches Spaltenmanagement eine zusätzliche Intelligenzschicht hinzu, die sicherstellt, dass JSON Shredding flexibel bleibt, wenn sich die Daten weiterentwickeln.</p>
<ul>
<li><p><strong>Spalten werden nach Bedarf erstellt:</strong> Wenn neue Schlüssel in eingehenden JSON-Dokumenten auftauchen, gruppiert Milvus automatisch Werte mit demselben Schlüssel in einer eigenen Spalte. Dadurch bleiben die Leistungsvorteile der spaltenbasierten Speicherung erhalten, ohne dass die Benutzer im Voraus Schemata entwerfen müssen. Milvus ermittelt auch den Datentyp neuer Felder (z. B. INTEGER, DOUBLE, VARCHAR) und wählt ein effizientes Spaltenformat für sie aus.</p></li>
<li><p><strong>Jeder Schlüssel wird automatisch verarbeitet:</strong> Milvus analysiert und verarbeitet jeden Schlüssel im JSON-Dokument. Dies gewährleistet eine breite Abfrageabdeckung, ohne dass die Benutzer gezwungen sind, Felder im Voraus zu definieren oder Indizes zu erstellen.</p></li>
</ul>
<h3 id="Query-Optimization" class="common-anchor-header">Abfrage-Optimierung</h3><p>Sobald die Daten in den richtigen Spalten reorganisiert sind, wählt Milvus den effizientesten Ausführungspfad für jede Abfrage:</p>
<ul>
<li><p><strong>Direkte Spaltenscans für getippte und dynamische Schlüssel:</strong> Wenn eine Abfrage auf ein Feld abzielt, das bereits in eine eigene Spalte aufgeteilt wurde, kann Milvus diese Spalte direkt scannen. Dadurch wird die Gesamtmenge der zu verarbeitenden Daten reduziert und die SIMD-beschleunigte Spaltenberechnung für eine noch schnellere Ausführung genutzt.</p></li>
<li><p><strong>Indizierte Suche für gemeinsame Schlüssel:</strong> Wenn die Abfrage ein Feld umfasst, das nicht in eine eigene Spalte verschoben wurde - typischerweise ein seltener Schlüssel - wertet Milvus sie anhand der Spalte mit dem gemeinsamen Schlüssel aus. Der auf dieser Spalte aufgebaute invertierte Index ermöglicht es Milvus, schnell zu erkennen, welche Zeilen den angegebenen Schlüssel enthalten, und den Rest zu überspringen, was die Leistung für Felder mit geringer Häufigkeit erheblich verbessert.</p></li>
<li><p><strong>Automatische Metadatenverwaltung:</strong> Milvus verwaltet kontinuierlich globale Metadaten und Wörterbücher, so dass Abfragen auch dann genau und effizient bleiben, wenn sich die Struktur der eingehenden JSON-Dokumente im Laufe der Zeit verändert.</p></li>
</ul>
<h2 id="Performance-benchmarks" class="common-anchor-header">Leistungsvergleiche<button data-href="#Performance-benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir haben einen Benchmark entwickelt, um die Abfrageleistung der Speicherung des gesamten JSON-Dokuments als einzelnes Rohfeld mit der Verwendung der neu veröffentlichten JSON Shredding-Funktion zu vergleichen.</p>
<h3 id="Test-environment-and-methodology" class="common-anchor-header">Testumgebung und Methodik</h3><ul>
<li><p>Hardware: 1-Kern/8-GB-Cluster</p></li>
<li><p>Datensatz: 1 Million Dokumente aus <a href="https://github.com/ClickHouse/JSONBench.git">JSONBench</a></p></li>
<li><p>Methodik: Messung von QPS und Latenz über verschiedene Abfragemuster hinweg</p></li>
</ul>
<h3 id="Results-typed-keys" class="common-anchor-header">Ergebnisse: Eingetippte Schlüssel</h3><p>Bei diesem Test wurde die Leistung bei der Abfrage eines in den meisten Dokumenten vorhandenen Schlüssels gemessen.</p>
<table>
<thead>
<tr><th>Abfrageausdruck</th><th>QPS (ohne Schreddern)</th><th>QPS (mit Zerkleinerung)</th><th>Leistungssteigerung</th></tr>
</thead>
<tbody>
<tr><td>json['time_us'] &gt; 0</td><td>8.69</td><td>287.5</td><td><strong>33x</strong></td></tr>
<tr><td>json['kind'] == 'commit'</td><td>8.42</td><td>126.1</td><td><strong>14.9x</strong></td></tr>
</tbody>
</table>
<h3 id="Results-shared-keys" class="common-anchor-header">Ergebnisse: gemeinsam genutzte Schlüssel</h3><p>Dieser Test konzentrierte sich auf die Abfrage von spärlichen, verschachtelten Schlüsseln, die in die Kategorie "shared" fallen.</p>
<table>
<thead>
<tr><th>Abfrage Ausdruck</th><th>QPS (ohne Schreddern)</th><th>QPS (mit Zerkleinerung)</th><th>Leistungssteigerung</th></tr>
</thead>
<tbody>
<tr><td>json['identity']['seq'] &gt; 0</td><td>4.33</td><td>385</td><td><strong>88.9x</strong></td></tr>
<tr><td>json['identity']['did'] == 'xxxxx'</td><td>7.6</td><td>352</td><td><strong>46.3x</strong></td></tr>
</tbody>
</table>
<p>Abfragen mit geteilten Schlüsseln zeigen die dramatischsten Verbesserungen (bis zu 89× schneller), während Abfragen mit getippten Schlüsseln konsistente 15-30× Geschwindigkeitssteigerungen liefern. Insgesamt profitiert jeder Abfragetyp von JSON Shredding, mit deutlichen Leistungssteigerungen in allen Bereichen.</p>
<h2 id="Try-It-Now" class="common-anchor-header">Testen Sie es jetzt<button data-href="#Try-It-Now" class="anchor-icon" translate="no">
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
    </button></h2><p>Ganz gleich, ob Sie mit API-Protokollen, IoT-Sensordaten oder sich schnell entwickelnden Anwendungs-Payloads arbeiten, JSON Shredding bietet Ihnen die seltene Möglichkeit, sowohl Flexibilität als auch hohe Leistung zu erhalten.</p>
<p>Die Funktion ist ab sofort verfügbar und Sie sind herzlich eingeladen, sie jetzt auszuprobieren. Weitere Details finden Sie <a href="https://milvus.io/docs/json-shredding.md">in diesem Dokument</a>.</p>
<p>Haben Sie Fragen oder möchten Sie eine Funktion des neuesten Milvus genauer kennenlernen? Treten Sie unserem<a href="https://discord.com/invite/8uyFbECzPX"> Discord-Kanal</a> bei oder stellen Sie Fragen auf<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Sie können auch eine 20-minütige Einzelsitzung buchen, um Einblicke, Anleitung und Antworten auf Ihre Fragen über die<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> zu erhalten.</p>
