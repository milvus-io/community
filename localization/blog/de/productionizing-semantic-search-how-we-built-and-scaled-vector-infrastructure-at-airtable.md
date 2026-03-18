---
id: >-
  productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable.md
title: >-
  Produktion der semantischen Suche: Wie wir die Vektorinfrastruktur bei
  Airtable aufgebaut und skaliert haben
author: Aria Malkani and Cole Dearmon-Moore
date: 2026-3-18
cover: assets.zilliz.com/cover_airtable_milvus_3c77b22ee2.jpg
tag: Use Cases
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Airtable semantic search, Milvus vector database, vector infrastructure,
  multi-tenant vector search, scalable AI retrieval
meta_title: |
  How Airtable Built and Scaled Vector Infrastructure with Milvus
desc: >-
  Erfahren Sie, wie Airtable eine skalierbare Milvus-basierte
  Vektorinfrastruktur für semantische Suche, mandantenfähiges Retrieval und
  KI-Erlebnisse mit niedriger Latenz aufgebaut hat.
origin: >-
  https://milvus.io/blog/productionizing-semantic-search-how-we-built-and-scaled-vector-infrastructure-at-airtable.md
---
<p><em>Dieser Beitrag wurde ursprünglich auf dem</em> <em>Airtable-Medium-Kanal</em><em>veröffentlicht</em> <em>und wird hier mit Genehmigung wiederveröffentlicht.</em></p>
<p>Als sich die semantische Suche bei Airtable von einem Konzept zu einer Kernfunktion des Produkts entwickelte, stand das Dateninfrastrukturteam vor der Herausforderung, sie zu skalieren. Wie in unserem <a href="https://medium.com/airtable-eng/building-a-resilient-embedding-system-for-semantic-search-at-airtable-d5fdf27807e2">vorherigen Beitrag über den Aufbau des Einbettungssystems</a> beschrieben, hatten wir bereits eine robuste, letztendlich konsistente Anwendungsschicht entwickelt, um den Einbettungslebenszyklus zu handhaben. Aber ein entscheidendes Element fehlte noch in unserem Architekturdiagramm: die Vektordatenbank selbst.</p>
<p>Wir brauchten eine Speicher-Engine, die in der Lage war, Milliarden von Einbettungen zu indizieren und bereitzustellen, massive Mandantenfähigkeit zu unterstützen und die Leistungs- und Verfügbarkeitsziele in einer verteilten Cloud-Umgebung einzuhalten. Dies ist die Geschichte, wie wir unsere Vektorsuchplattform entwickelt, gehärtet und weiterentwickelt haben, so dass sie zu einer tragenden Säule der Infrastruktur von Airtable wurde.</p>
<h2 id="Background" class="common-anchor-header">Hintergrund<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>Unser Ziel bei Airtable ist es, Kunden bei der Arbeit mit ihren Daten auf leistungsstarke und intuitive Weise zu unterstützen. Mit dem Aufkommen von immer leistungsfähigeren und genaueren LLMs sind Funktionen, die die semantische Bedeutung Ihrer Daten nutzen, zum Kern unseres Produkts geworden.</p>
<h2 id="How-We-Use-Semantic-Search" class="common-anchor-header">Wie wir die semantische Suche nutzen<button data-href="#How-We-Use-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Omni-Airtable’s-AI-Chat-answering-real-questions-from-large-datasets" class="common-anchor-header">Omni (der KI-Chat von Airtable) bei der Beantwortung echter Fragen aus großen Datenbeständen</h3><p>Stellen Sie sich vor, Sie stellen eine Frage in natürlicher Sprache an Ihre Datenbank mit einer halben Million Zeilen und erhalten eine korrekte, kontextreiche Antwort. Zum Beispiel:</p>
<p>"Was sagen die Kunden in letzter Zeit über die Akkulaufzeit?"</p>
<p>Bei kleinen Datensätzen ist es möglich, alle Zeilen direkt an einen LLM zu senden. Bei großen Datenmengen wird dies jedoch schnell unpraktikabel. Stattdessen brauchten wir ein System, das Folgendes kann:</p>
<ul>
<li>Verstehen der semantischen Absicht einer Abfrage</li>
<li>Abrufen der relevantesten Zeilen über eine Vektorähnlichkeitssuche</li>
<li>Bereitstellung dieser Zeilen als Kontext für ein LLM</li>
</ul>
<p>Diese Anforderung prägte fast jede nachfolgende Designentscheidung: Omni musste sich sofort und intelligent anfühlen, selbst bei sehr großen Datenbanken.</p>
<h3 id="Linked-record-recommendations-Meaning-over-exact-matches" class="common-anchor-header">Verknüpfte Datensatzempfehlungen: Bedeutung statt exakter Übereinstimmungen</h3><p>Die semantische Suche verbessert auch eine Kernfunktion von Airtable: verknüpfte Datensätze. Benutzer benötigen Beziehungsvorschläge, die auf dem Kontext und nicht auf exakten Textübereinstimmungen basieren. Eine Projektbeschreibung könnte beispielsweise eine Beziehung zu "Team Infrastructure" andeuten, ohne dass dieser spezifische Ausdruck jemals verwendet wird.</p>
<p>Die Bereitstellung dieser On-Demand-Vorschläge erfordert eine qualitativ hochwertige semantische Suche mit konsistenter, vorhersehbarer Latenzzeit.</p>
<h2 id="Our-Design-Priorities" class="common-anchor-header">Unsere Design-Prioritäten<button data-href="#Our-Design-Priorities" class="anchor-icon" translate="no">
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
    </button></h2><p>Um diese und weitere Funktionen zu unterstützen, haben wir das System auf 4 Ziele ausgerichtet:</p>
<ul>
<li><strong>Abfragen mit geringer Latenz (500ms p99):</strong> Vorhersagbare Leistung ist entscheidend für das Vertrauen der Nutzer</li>
<li><strong>Hoher Schreibdurchsatz:</strong> Basen ändern sich ständig, und die Einbettungen müssen synchron bleiben</li>
<li><strong>Horizontale Skalierbarkeit:</strong> Das System muss Millionen von unabhängigen Datenbanken unterstützen</li>
<li><strong>Selbst-Hosting:</strong> Alle Kundendaten müssen innerhalb der von Airtable kontrollierten Infrastruktur bleiben.</li>
</ul>
<p>Diese Ziele beeinflussten jede nachfolgende architektonische Entscheidung.</p>
<h2 id="Vector-Database-Vendor-Evaluation" class="common-anchor-header">Bewertung von Vektordatenbankanbietern<button data-href="#Vector-Database-Vendor-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>Ende 2024 bewerteten wir mehrere Vektordatenbankoptionen und entschieden uns schließlich für <a href="https://milvus.io/">Milvus</a> auf der Grundlage von drei Hauptanforderungen.</p>
<ul>
<li>Erstens legten wir Wert auf eine selbst gehostete Lösung, um den Datenschutz zu gewährleisten und die Kontrolle über unsere Infrastruktur zu behalten.</li>
<li>Zweitens erforderten unsere schreibintensive Arbeitslast und die stoßweisen Abfragemuster ein System, das elastisch skaliert werden kann und gleichzeitig eine niedrige, vorhersehbare Latenz aufweist.</li>
<li>Schließlich erforderte unsere Architektur eine starke Isolierung über Millionen von Kundenmietern hinweg.</li>
</ul>
<p><strong>Milvus</strong> erwies sich als die beste Lösung: Sein verteilter Charakter unterstützt eine massive Mandantenfähigkeit und ermöglicht es uns, Ingestion, Indizierung und Abfrageausführung unabhängig voneinander zu skalieren, um die Leistung zu steigern und gleichzeitig die Kosten kalkulierbar zu halten.</p>
<h2 id="Architecture-Design" class="common-anchor-header">Entwurf der Architektur<button data-href="#Architecture-Design" class="anchor-icon" translate="no">
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
    </button></h2><p>Nachdem wir uns für eine Technologie entschieden hatten, mussten wir eine Architektur festlegen, die die einzigartige Datenform von Airtable abbildet: Millionen von unterschiedlichen "Basen", die verschiedenen Kunden gehören.</p>
<h2 id="The-Partitioning-Challenge" class="common-anchor-header">Die Herausforderung der Partitionierung<button data-href="#The-Partitioning-Challenge" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir evaluierten zwei primäre Strategien zur Datenpartitionierung:</p>
<h3 id="Option-1-Shared-Partitions" class="common-anchor-header">Option 1: Gemeinsam genutzte Partitionen</h3><p>Mehrere Basen teilen sich eine Partition, und die Abfragen werden durch Filterung auf eine Basis-ID eingeschränkt. Dies verbessert die Ressourcennutzung, führt aber zu zusätzlichem Filter-Overhead und macht das Löschen von Datenbanken komplexer.</p>
<h3 id="Option-2-One-Base-per-Partition" class="common-anchor-header">Option 2: Eine Basis pro Partition</h3><p>Jede Airtable-Basis wird in Milvus auf eine eigene physische Partition abgebildet. Dies bietet eine starke Isolierung, ermöglicht ein schnelles und einfaches Löschen von Basen und vermeidet die Leistungsauswirkungen der Filterung nach der Abfrage.</p>
<h3 id="Final-Strategy" class="common-anchor-header">Endgültige Strategie</h3><p>Wir haben uns für Option 2 entschieden, weil sie so einfach ist und eine starke Isolierung bietet. Erste Tests zeigten jedoch, dass die Erstellung von 100k Partitionen in einer einzigen Milvus-Sammlung zu einer erheblichen Leistungsverschlechterung führte:</p>
<ul>
<li>Die Latenzzeit bei der Partitionserstellung stieg von ~20 ms auf ~250 ms.</li>
<li>Die Ladezeiten für Partitionen überstiegen 30 Sekunden.</li>
</ul>
<p>Um dieses Problem zu lösen, haben wir die Anzahl der Partitionen pro Sammlung begrenzt. Für jeden Milvus-Cluster erstellen wir 400 Sammlungen mit jeweils höchstens 1.000 Partitionen. Dadurch wird die Gesamtzahl der Basen pro Cluster auf 400k begrenzt, und neue Cluster werden bereitgestellt, wenn zusätzliche Kunden hinzukommen.</p>
<h2 id="Indexing--Recall" class="common-anchor-header">Indizierung und Abruf<button data-href="#Indexing--Recall" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Wahl des Indexes erwies sich als einer der folgenreichsten Kompromisse in unserem System. Wenn eine Partition geladen wird, wird ihr Index im Speicher oder auf der Festplatte zwischengespeichert. Um ein Gleichgewicht zwischen Abrufrate, Indexgröße und Leistung zu finden, haben wir verschiedene Indexarten getestet.</p>
<ul>
<li><strong>IVF-SQ8:</strong> Bietet einen kleinen Speicherplatzbedarf, aber eine geringere Abrufrate.</li>
<li><strong>HNSW:</strong> Liefert den besten Abruf (99 %-100 %), ist aber sehr speicherintensiv.</li>
<li><strong>DiskANN:</strong> Bietet eine ähnliche Auffindbarkeit wie HNSW, jedoch mit höherer Abfragelatenz.</li>
</ul>
<p>Letztendlich haben wir uns für HNSW entschieden, weil es die besten Abruf- und Leistungsmerkmale aufweist.</p>
<h2 id="The-Application-layer" class="common-anchor-header">Die Anwendungsschicht<button data-href="#The-Application-layer" class="anchor-icon" translate="no">
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
    </button></h2><p>Die semantische Suchpipeline von Airtable besteht im Wesentlichen aus zwei Abläufen:</p>
<ol>
<li><strong>Ingestion-Flow:</strong> Konvertierung von Airtable-Zeilen in Einbettungen und Speicherung in Milvus</li>
<li><strong>Abfrage-Fluss:</strong> Einbettung von Benutzerabfragen, Abruf relevanter Zeilen-IDs und Bereitstellung von Kontext für den LLM</li>
</ol>
<p>Beide Ströme müssen kontinuierlich und zuverlässig in großem Umfang funktionieren und werden im Folgenden beschrieben. Im Folgenden werden beide Abläufe erläutert.</p>
<h2 id="Ingestion-Flow-Keeping-Milvus-in-Sync-with-Airtable" class="common-anchor-header">Ingestion Flow: Synchronisierung von Milvus mit Airtable<button data-href="#Ingestion-Flow-Keeping-Milvus-in-Sync-with-Airtable" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn ein Benutzer Omni öffnet, beginnt Airtable mit der Synchronisierung seiner Basis mit Milvus. Wir erstellen eine Partition, verarbeiten dann die Zeilen in Chunks, erzeugen Einbettungen und fügen sie in Milvus ein. Von da an erfassen wir alle an der Datenbank vorgenommenen Änderungen und fügen diese Zeilen erneut ein, um die Daten konsistent zu halten.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Airtable_Milvusblog_1_aac199ae50.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Query-Flow-How-we-use-the-Data" class="common-anchor-header">Abfragefluss: Wie wir die Daten verwenden<button data-href="#Query-Flow-How-we-use-the-Data" class="anchor-icon" translate="no">
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
    </button></h2><p>Auf der Abfrageseite betten wir die Anfrage des Benutzers ein und senden sie an Milvus, um die wichtigsten Zeilen-IDs abzurufen. Anschließend rufen wir die neuesten Versionen dieser Zeilen ab und fügen sie als Kontext in die Anfrage an den LLM ein.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Airtable_Milvusblog_2_6e9067b16d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Operational-Challenges--How-We-Solved-Them" class="common-anchor-header">Betriebliche Herausforderungen und deren Lösung<button data-href="#Operational-Challenges--How-We-Solved-Them" class="anchor-icon" translate="no">
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
    </button></h2><p>Der Aufbau einer semantischen Sucharchitektur ist eine Herausforderung; sie zuverlässig für Hunderttausende von Datenbanken zu betreiben, ist eine andere. Nachfolgend finden Sie einige wichtige betriebliche Lektionen, die wir auf diesem Weg gelernt haben.</p>
<h3 id="Deployment" class="common-anchor-header">Bereitstellung</h3><p>Wir stellen Milvus über die Kubernetes-CRD mit dem <a href="https://github.com/zilliztech/milvus-operator">Milvus-Operator</a> bereit, was uns die deklarative Definition und Verwaltung von Clustern ermöglicht. Jede Änderung, egal ob es sich um eine Konfigurationsaktualisierung, eine Client-Verbesserung oder ein Milvus-Upgrade handelt, durchläuft Unit-Tests und einen On-Demand-Lasttest, der den Produktionsverkehr simuliert, bevor er an die Benutzer ausgerollt wird.</p>
<p>In Version 2.5 besteht der Milvus-Cluster aus diesen Kernkomponenten:</p>
<ul>
<li>Abfrageknoten halten die Vektorindizes im Speicher und führen Vektorsuchen aus</li>
<li>Datenknoten verarbeiten die Datenaufnahme und -verdichtung und halten neue Daten im Speicher vor.</li>
<li>Indexknoten erstellen und pflegen Vektorindizes, um die Suche bei wachsenden Daten schnell zu halten</li>
<li>Der Koordinationsknoten koordiniert alle Clusteraktivitäten und die Shard-Zuweisung</li>
<li>Proxy-Knoten leiten den API-Verkehr und verteilen die Last auf die Knoten</li>
<li>Kafka liefert das Protokoll-/Streaming-Backbone für den internen Nachrichten- und Datenfluss</li>
<li>Etcd speichert Cluster-Metadaten und Koordinationsstatus</li>
</ul>
<p>Mit CRD-gesteuerter Automatisierung und einer rigorosen Testpipeline können wir Aktualisierungen schnell und sicher einführen.</p>
<h2 id="Observability-Understanding-System-Health-End-to-End" class="common-anchor-header">Beobachtbarkeit: End-to-End-Verständnis des Systemzustands<button data-href="#Observability-Understanding-System-Health-End-to-End" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir überwachen das System auf zwei Ebenen, um sicherzustellen, dass die semantische Suche schnell und vorhersehbar bleibt.</p>
<p>Auf der Infrastrukturebene verfolgen wir die CPU- und Speichernutzung sowie den Zustand der Pods in allen Milvus-Komponenten. Diese Signale zeigen uns, ob der Cluster innerhalb sicherer Grenzen arbeitet und helfen uns, Probleme wie Ressourcensättigung oder kranke Knoten zu erkennen, bevor sie sich auf die Benutzer auswirken.</p>
<p>Auf der Service-Ebene konzentrieren wir uns darauf, wie gut die einzelnen Basen mit unseren Ingestion- und Query-Workloads mithalten können. Metriken wie Verdichtungs- und Indizierungsdurchsatz geben uns Aufschluss darüber, wie effizient die Daten übernommen werden. Abfrageerfolgsraten und Latenzzeiten vermitteln uns ein Verständnis für die Benutzererfahrung bei der Abfrage der Daten, und das Partitionswachstum lässt uns wissen, wie unsere Daten wachsen, sodass wir gewarnt werden, wenn wir skalieren müssen.</p>
<h2 id="Node-Rotation" class="common-anchor-header">Knotenrotation<button data-href="#Node-Rotation" class="anchor-icon" translate="no">
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
    </button></h2><p>Aus Sicherheits- und Compliance-Gründen rotieren wir regelmäßig die Kubernetes-Knoten. In einem Vektorsuchcluster ist dies nicht trivial:</p>
<ul>
<li>Wenn die Abfrageknoten rotiert werden, gleicht der Koordinator die In-Memory-Daten zwischen den Abfrageknoten neu aus.</li>
<li>Kafka und Etcd speichern zustandsbehaftete Informationen und erfordern Quorum und kontinuierliche Verfügbarkeit.</li>
</ul>
<p>Wir begegnen diesem Problem mit strengen Störungsbudgets und einer Rotationspolitik für jeweils einen Knoten. Der Milvus-Koordinator erhält Zeit, um das Gleichgewicht wiederherzustellen, bevor der nächste Knoten rotiert wird. Durch diese sorgfältige Orchestrierung wird die Zuverlässigkeit gewahrt, ohne die Geschwindigkeit zu verlangsamen.</p>
<h2 id="Cold-Partition-Offloading" class="common-anchor-header">Cold Partition Offloading<button data-href="#Cold-Partition-Offloading" class="anchor-icon" translate="no">
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
    </button></h2><p>Einer unserer größten betrieblichen Erfolge war die Erkenntnis, dass unsere Daten klare Hot/Cold-Zugriffsmuster aufweisen. Bei der Analyse der Nutzung haben wir festgestellt, dass in einer bestimmten Woche nur ~25 % der Daten in Milvus geschrieben oder ausgelesen werden. Mit Milvus können wir ganze Partitionen auslagern und so Speicher auf den Abfrageknoten freigeben. Wenn diese Daten später benötigt werden, können wir sie innerhalb von Sekunden neu laden. Auf diese Weise können wir heiße Daten im Speicher behalten und den Rest auslagern, was die Kosten senkt und uns eine effizientere Skalierung im Laufe der Zeit ermöglicht.</p>
<h2 id="Data-Recovery" class="common-anchor-header">Datenwiederherstellung<button data-href="#Data-Recovery" class="anchor-icon" translate="no">
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
    </button></h2><p>Bevor wir Milvus auf breiter Basis einführen konnten, mussten wir uns darauf verlassen können, dass wir uns von jedem Fehlerszenario schnell erholen können. Während die meisten Probleme durch die eingebaute Fehlertoleranz des Clusters abgedeckt sind, haben wir auch für seltene Fälle vorgesorgt, in denen Daten beschädigt werden oder das System in einen nicht wiederherstellbaren Zustand geraten könnte.</p>
<p>In solchen Situationen ist unser Wiederherstellungspfad unkompliziert. Wir richten zunächst einen neuen Milvus-Cluster ein, damit wir den Datenverkehr fast sofort wieder aufnehmen können. Sobald der neue Cluster in Betrieb ist, werden die am häufigsten genutzten Basen proaktiv neu eingebettet und die übrigen Basen nach und nach verarbeitet, sobald auf sie zugegriffen wird. Auf diese Weise wird die Ausfallzeit für die am häufigsten genutzten Daten minimiert, während das System nach und nach einen konsistenten semantischen Index aufbaut.</p>
<h2 id="What’s-Next" class="common-anchor-header">Was kommt als Nächstes?<button data-href="#What’s-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Unsere Arbeit mit <a href="https://milvus.io/">Milvus</a> hat eine solide Grundlage für die semantische Suche bei Airtable geschaffen: schnelle, aussagekräftige KI-Erlebnisse in großem Maßstab. Mit diesem System erforschen wir nun umfangreichere Abfrage-Pipelines und tiefere KI-Integrationen im gesamten Produkt. Es liegt eine Menge aufregender Arbeit vor uns, und wir stehen erst am Anfang.</p>
<p><em>Vielen Dank an alle ehemaligen und aktuellen Airtablets bei Data Infrastructure und im gesamten Unternehmen, die zu diesem Projekt beigetragen haben: Alex Sorokin, Andrew Wang, Aria Malkani, Cole Dearmon-Moore, Nabeel Farooqui, Will Powelson, Xiaobing Xia.</em></p>
<h2 id="About-Airtable" class="common-anchor-header">Über Airtable<button data-href="#About-Airtable" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://www.airtable.com/">Airtable</a> ist eine führende Plattform für digitale Abläufe, die es Unternehmen ermöglicht, benutzerdefinierte Anwendungen zu erstellen, Workflows zu automatisieren und gemeinsam genutzte Daten auf Unternehmensebene zu verwalten. Airtable wurde entwickelt, um komplexe, funktionsübergreifende Prozesse zu unterstützen, und hilft Teams, flexible Systeme für die Planung, Koordination und Ausführung auf Basis einer gemeinsamen Quelle der Wahrheit aufzubauen. Während Airtable seine KI-gestützte Plattform ausbaut, spielen Technologien wie Milvus eine wichtige Rolle bei der Stärkung der Retrieval-Infrastruktur, die für die Bereitstellung schnellerer, intelligenterer Produkterlebnisse erforderlich ist.</p>
