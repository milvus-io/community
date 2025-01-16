---
id: >-
  unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md
title: >-
  Enthüllung von Milvus 2.3: Ein Meilenstein-Release mit Unterstützung für GPU,
  Arm64, CDC und vielen anderen, mit Spannung erwarteten Funktionen
author: 'Owen Jiao, Fendy Feng'
date: 2023-08-28T00:00:00.000Z
desc: >-
  Milvus 2.3 ist eine Meilensteinversion mit zahlreichen, mit Spannung
  erwarteten Funktionen, darunter Unterstützung für GPU, Arm64, Upsert,
  Erfassung von Änderungsdaten, ScaNN-Index und Bereichssuche. Darüber hinaus
  bietet sie eine verbesserte Abfrageleistung, eine robustere Lastverteilung und
  Planung sowie eine bessere Beobachtbarkeit und Bedienbarkeit.
cover: assets.zilliz.com/Milvus_2_3_Milvus_io_2e3b0eb55c.jpeg
tag: News
tags: >-
  Vector Database, AI, Artificial Intelligence, Machine Learning, Milvus, LLM,
  Large Language Models, Embeddings, Vector search, Vector similarity search
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/unveiling-milvus-2-3-milestone-release-offering-support-for-gpu-arm64-cdc-and-other-features.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_2_3_Milvus_io_2e3b0eb55c.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Aufregende Neuigkeiten! Nach acht Monaten konzertierter Bemühungen freuen wir uns, die Veröffentlichung von Milvus 2.3 bekannt zu geben, einer Meilensteinversion, die zahlreiche, mit Spannung erwartete Funktionen mit sich bringt, darunter Unterstützung für GPU, Arm64, Upsert, Änderungsdatenerfassung, ScaNN-Index und MMap-Technologie. Milvus 2.3 bietet außerdem eine verbesserte Abfrageleistung, eine robustere Lastverteilung und Zeitplanung sowie eine bessere Beobachtbarkeit und Bedienbarkeit.</p>
<p>Sehen Sie sich mit mir diese neuen Funktionen und Verbesserungen an und erfahren Sie, wie Sie von dieser Version profitieren können.</p>
<h2 id="Support-for-GPU-index-that-leads-to-3-10-times-faster-in-QPS" class="common-anchor-header">Unterstützung für GPU-Index, der zu einer 3-10-fachen Beschleunigung in QPS führt<button data-href="#Support-for-GPU-index-that-leads-to-3-10-times-faster-in-QPS" class="anchor-icon" translate="no">
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
    </button></h2><p>GPU-Index ist eine von der Milvus-Gemeinschaft mit Spannung erwartete Funktion. Dank einer großartigen Zusammenarbeit mit den Nvidia-Ingenieuren unterstützt Milvus 2.3 die GPU-Indizierung mit dem robusten RAFT-Algorithmus, der zu Knowhere, der Milvus-Index-Engine, hinzugefügt wurde. Mit der GPU-Unterstützung ist Milvus 2.3 in QPS mehr als dreimal schneller als ältere Versionen, die den CPU-HNSW-Index verwenden, und fast zehnmal schneller für bestimmte Datensätze, die umfangreiche Berechnungen erfordern.</p>
<h2 id="Arm64-support-to-accommodate-growing-user-demand" class="common-anchor-header">Arm64-Unterstützung, um die wachsende Nachfrage der Benutzer zu befriedigen<button data-href="#Arm64-support-to-accommodate-growing-user-demand" class="anchor-icon" translate="no">
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
    </button></h2><p>Arm-CPUs werden bei Cloud-Anbietern und Entwicklern immer beliebter. Um dieser wachsenden Nachfrage gerecht zu werden, bietet Milvus jetzt Docker-Images für die ARM64-Architektur an. Mit dieser neuen CPU-Unterstützung können MacOS-Benutzer ihre Anwendungen mit Milvus nahtloser erstellen.</p>
<h2 id="Upsert-support-for-better-user-experience" class="common-anchor-header">Upsert-Unterstützung für eine bessere Benutzererfahrung<button data-href="#Upsert-support-for-better-user-experience" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 führt eine bemerkenswerte Verbesserung ein, indem es den Upsert-Vorgang unterstützt. Diese neue Funktionalität ermöglicht es den Benutzern, Daten nahtlos zu aktualisieren oder einzufügen und beide Vorgänge in einer einzigen Anfrage über die Upsert-Schnittstelle durchzuführen. Diese Funktion rationalisiert die Datenverwaltung und sorgt für mehr Effizienz.</p>
<p><strong>Anmerkung</strong>:</p>
<ul>
<li>Die Upsert-Funktion gilt nicht für automatisch inkrementierende IDs.</li>
<li>Upsert ist als Kombination von <code translate="no">delete</code> und <code translate="no">insert</code> implementiert, was zu einem gewissen Leistungsverlust führen kann. Wir empfehlen die Verwendung von <code translate="no">insert</code>, wenn Sie Milvus in schreibintensiven Szenarien verwenden.</li>
</ul>
<h2 id="Range-search-for-more-accurate-results" class="common-anchor-header">Bereichssuche für genauere Ergebnisse<button data-href="#Range-search-for-more-accurate-results" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 ermöglicht es den Benutzern, während einer Abfrage den Abstand zwischen dem Eingabevektor und den in Milvus gespeicherten Vektoren anzugeben. Milvus gibt dann alle übereinstimmenden Ergebnisse innerhalb des festgelegten Bereichs zurück. Nachfolgend ein Beispiel für die Angabe des Suchabstands unter Verwendung der Bereichssuchfunktion.</p>
<pre><code translate="no"><span class="hljs-comment">// add radius and range_filter to params in search_params</span>
search_params = {<span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>, <span class="hljs-string">&quot;radius&quot;</span>: <span class="hljs-number">10</span>, <span class="hljs-string">&quot;range_filter&quot;</span> : <span class="hljs-number">20</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>}
res = collection.<span class="hljs-title function_">search</span>(
vectors, <span class="hljs-string">&quot;float_vector&quot;</span>, search_params, topK,
<span class="hljs-string">&quot;int64 &gt; 100&quot;</span>, output_fields=[<span class="hljs-string">&quot;int64&quot;</span>, <span class="hljs-string">&quot;float&quot;</span>]
)
<button class="copy-code-btn"></button></code></pre>
<p>In diesem Beispiel möchte der Benutzer, dass Milvus Vektoren innerhalb eines Abstands von 10 bis 20 Einheiten vom Eingabevektor zurückgibt.</p>
<p><strong>Hinweis</strong>: Verschiedene Abstandsmetriken unterscheiden sich in der Art und Weise, wie sie Abstände berechnen, was zu unterschiedlichen Wertebereichen und Sortierstrategien führt. Daher ist es unerlässlich, ihre Eigenschaften zu verstehen, bevor man die Funktion der Abstandssuche verwendet.</p>
<h2 id="ScaNN-index-for-faster-query-speed" class="common-anchor-header">ScaNN-Index für höhere Abfragegeschwindigkeit<button data-href="#ScaNN-index-for-faster-query-speed" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 unterstützt jetzt den ScaNN-Index, einen von Google entwickelten Open-Source-Index für <a href="https://zilliz.com/glossary/anns">approximative nächste Nachbarn (ANN)</a>. Der ScaNN-Index hat in verschiedenen Benchmarks eine überragende Leistung gezeigt, die HNSW um etwa 20 % übertrifft und etwa siebenmal schneller ist als IVFFlat. Mit der Unterstützung des ScaNN-Index erreicht Milvus im Vergleich zu älteren Versionen eine wesentlich höhere Abfragegeschwindigkeit.</p>
<h2 id="Growing-index-for-stable-and-better-query-performance" class="common-anchor-header">Wachsender Index für stabile und bessere Abfrageleistung<button data-href="#Growing-index-for-stable-and-better-query-performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus umfasst zwei Kategorien von Daten: indizierte Daten und Streaming-Daten. Milvus kann Indizes verwenden, um indizierte Daten schnell zu durchsuchen, kann aber Streaming-Daten nur brutal Zeile für Zeile durchsuchen, was die Leistung beeinträchtigen kann. Milvus 2.3 führt den Growing Index ein, der automatisch Echtzeit-Indizes für Streaming-Daten erstellt, um die Abfrageleistung zu verbessern.</p>
<h2 id="Iterator-for-data-retrieval-in-batches" class="common-anchor-header">Iterator für den Datenabruf in Stapeln<button data-href="#Iterator-for-data-retrieval-in-batches" class="anchor-icon" translate="no">
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
    </button></h2><p>In Milvus 2.3 hat Pymilvus eine Iterator-Schnittstelle eingeführt, die es den Benutzern ermöglicht, mehr als 16.384 Entitäten in einer Suche oder Bereichssuche abzurufen. Diese Funktion ist praktisch, wenn Benutzer Zehntausende oder noch mehr Vektoren in Stapeln exportieren müssen.</p>
<h2 id="Support-for-MMap-for-increased-capacity" class="common-anchor-header">Unterstützung für MMap zur Erhöhung der Kapazität<button data-href="#Support-for-MMap-for-increased-capacity" class="anchor-icon" translate="no">
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
    </button></h2><p>MMap ist ein UNIX-Systemaufruf, der verwendet wird, um Dateien und andere Objekte im Speicher abzubilden. Milvus 2.3 unterstützt MMap, das es dem Benutzer ermöglicht, Daten auf lokale Festplatten zu laden und sie im Speicher abzubilden, wodurch die Kapazität einer einzelnen Maschine erhöht wird.</p>
<p>Unsere Testergebnisse zeigen, dass Milvus mit der MMap-Technologie seine Datenkapazität verdoppeln und gleichzeitig die Leistungseinbußen auf maximal 20 % begrenzen kann. Dieser Ansatz senkt die Gesamtkosten erheblich, so dass er besonders für Benutzer mit knappem Budget, die keine Kompromisse bei der Leistung eingehen wollen, von Vorteil ist.</p>
<h2 id="CDC-support-for-higher-system-availability" class="common-anchor-header">CDC-Unterstützung für höhere Systemverfügbarkeit<button data-href="#CDC-support-for-higher-system-availability" class="anchor-icon" translate="no">
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
    </button></h2><p>Change Data Capture (CDC) ist eine häufig verwendete Funktion in Datenbanksystemen, die Datenänderungen erfasst und an ein bestimmtes Ziel repliziert. Mit der CDC-Funktion ermöglicht Milvus 2.3 den Anwendern die Synchronisierung von Daten über Rechenzentren hinweg, die Sicherung inkrementeller Daten und die nahtlose Migration von Daten, wodurch die Verfügbarkeit des Systems erhöht wird.</p>
<p>Zusätzlich zu den oben genannten Funktionen führt Milvus 2.3 eine Zählschnittstelle ein, um die Anzahl der in einer Sammlung gespeicherten Datenzeilen in Echtzeit genau zu berechnen, unterstützt die Cosinus-Metrik zur Messung der Vektordistanz und bietet mehr Operationen für JSON-Arrays. Weitere Funktionen und detaillierte Informationen finden Sie in den <a href="https://milvus.io/docs/release_notes.md">Versionshinweisen zu Milvus 2.3</a>.</p>
<h2 id="Enhancements-and-bug-fixes" class="common-anchor-header">Erweiterungen und Fehlerbehebungen<button data-href="#Enhancements-and-bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>Zusätzlich zu den neuen Funktionen enthält Milvus 2.3 viele Verbesserungen und Fehlerkorrekturen für ältere Versionen.</p>
<h3 id="Improved-performance-for-data-filtering" class="common-anchor-header">Verbesserte Leistung beim Filtern von Daten</h3><p>Milvus führt eine skalare Filterung vor der Vektorsuche in hybriden skalaren und vektoriellen Datenabfragen durch, um genauere Ergebnisse zu erzielen. Die Indizierungsleistung kann jedoch abnehmen, wenn der Benutzer zu viele Daten nach der skalaren Filterung herausgefiltert hat. In Milvus 2.3 haben wir die Filterstrategie von HNSW optimiert, um dieses Problem zu lösen, was zu einer verbesserten Abfrageleistung führt.</p>
<h3 id="Increased-multi-core-CPU-usage" class="common-anchor-header">Erhöhte Multi-Core-CPU-Nutzung</h3><p>Approximate Nearest Search (ANN) ist eine rechenintensive Aufgabe, die massive CPU-Ressourcen erfordert. In früheren Versionen konnte Milvus nur etwa 70 % der verfügbaren Multi-Core-CPU-Ressourcen nutzen. Mit der neuesten Version hat Milvus diese Einschränkung jedoch überwunden und kann alle verfügbaren Multi-Core-CPU-Ressourcen vollständig nutzen, was zu einer verbesserten Abfrageleistung und einer geringeren Ressourcenverschwendung führt.</p>
<h3 id="Refactored-QueryNode" class="common-anchor-header">Überarbeiteter QueryNode</h3><p>QueryNode ist eine wichtige Komponente in Milvus, die für die Vektorsuche verantwortlich ist. In älteren Versionen hatte QueryNode jedoch komplexe Zustände, doppelte Nachrichtenwarteschlangen, eine unorganisierte Codestruktur und nicht intuitive Fehlermeldungen.</p>
<p>In Milvus 2.3 haben wir QueryNode verbessert, indem wir eine zustandslose Codestruktur eingeführt und die Nachrichtenwarteschlange zum Löschen von Daten entfernt haben. Diese Aktualisierungen führen zu einer geringeren Ressourcenverschwendung und einer schnelleren und stabileren Vektorsuche.</p>
<h3 id="Enhanced-message-queues-based-on-NATS" class="common-anchor-header">Verbesserte Nachrichten-Warteschlangen auf der Grundlage von NATS</h3><p>Wir haben Milvus auf einer protokollbasierten Architektur aufgebaut und in früheren Versionen Pulsar und Kafka als zentrale Protokollbroker verwendet. Diese Kombination stand jedoch vor drei großen Herausforderungen:</p>
<ul>
<li>Sie war in Situationen mit mehreren Themen instabil.</li>
<li>Sie verbrauchte Ressourcen, wenn sie nicht genutzt wurde, und hatte Schwierigkeiten, Nachrichten zu deduplizieren.</li>
<li>Pulsar und Kafka sind eng mit dem Java-Ökosystem verbunden, so dass ihre Go-SDKs von der Community selten gewartet und aktualisiert werden.</li>
</ul>
<p>Um diese Probleme zu lösen, haben wir NATS und Bookeeper zu unserem neuen Log-Broker für Milvus kombiniert, der den Bedürfnissen der Benutzer besser entspricht.</p>
<h3 id="Optimized-load-balancer" class="common-anchor-header">Optimierter Lastverteiler</h3><p>Milvus 2.3 hat einen flexibleren Lastausgleichsalgorithmus eingeführt, der auf der tatsächlichen Systemlast basiert. Mit diesem optimierten Algorithmus können Benutzer Knotenausfälle und unausgewogene Lasten schnell erkennen und die Planungen entsprechend anpassen. Unseren Testergebnissen zufolge kann Milvus 2.3 Fehler, unausgewogene Last, anormale Knotenzustände und andere Ereignisse innerhalb von Sekunden erkennen und umgehend Anpassungen vornehmen.</p>
<p>Weitere Informationen über Milvus 2.3 finden Sie in den <a href="https://milvus.io/docs/release_notes.md">Milvus 2.3 Release Notes</a>.</p>
<h2 id="Tool-upgrades" class="common-anchor-header">Tool-Upgrades<button data-href="#Tool-upgrades" class="anchor-icon" translate="no">
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
    </button></h2><p>Zusammen mit Milvus 2.3 haben wir auch Birdwatcher und Attu, zwei wertvolle Tools für den Betrieb und die Wartung von Milvus, aktualisiert.</p>
<h3 id="Birdwatcher-update" class="common-anchor-header">Birdwatcher-Aktualisierung</h3><p>Wir haben <a href="https://github.com/milvus-io/birdwatcher">Birdwatcher</a>, das Debug-Tool von Milvus, aktualisiert und zahlreiche Funktionen und Verbesserungen eingeführt, darunter:</p>
<ul>
<li>RESTful API für die nahtlose Integration mit anderen Diagnosesystemen.</li>
<li>PProf-Befehlsunterstützung, um die Integration mit dem Go pprof-Tool zu erleichtern.</li>
<li>Funktionen zur Analyse der Speichernutzung.</li>
<li>Effiziente Funktionen zur Protokollanalyse.</li>
<li>Unterstützung für das Anzeigen und Ändern von Konfigurationen in etcd.</li>
</ul>
<h3 id="Attu-update" class="common-anchor-header">Attu-Aktualisierung</h3><p>Wir haben eine brandneue Oberfläche für <a href="https://zilliz.com/attu">Attu</a> eingeführt, ein All-in-One-Tool zur Verwaltung von Vektordatenbanken. Die neue Oberfläche ist übersichtlicher gestaltet und leichter zu verstehen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Attu_s_new_interface_e24dd0d670.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Weitere Details finden Sie in den <a href="https://milvus.io/docs/release_notes.md">Milvus 2.3 Release Notes</a>.</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">Lassen Sie uns in Kontakt bleiben!<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn Sie Fragen oder Feedback zu Milvus haben, zögern Sie bitte nicht, uns über <a href="https://twitter.com/milvusio">Twitter</a> oder <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> zu kontaktieren. Sie können auch gerne unserem <a href="https://milvus.io/slack/">Slack-Kanal</a> beitreten, um sich direkt mit unseren Ingenieuren und der Community auszutauschen, oder besuchen Sie unsere <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">Dienstagssprechstunde</a>!</p>
