---
id: introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md
title: 'Einführung von Milvus 2.6: Erschwingliche Vektorsuche in Milliardenhöhe'
author: Fendy Feng
date: 2025-06-12T00:00:00.000Z
desc: >-
  Wir freuen uns, ankündigen zu können, dass Milvus 2.6 jetzt verfügbar ist.
  Diese Version führt Dutzende von Funktionen ein, die sich direkt mit den
  dringendsten Herausforderungen der Vektorsuche befassen - effiziente
  Skalierung bei gleichzeitiger Kostenkontrolle.
cover: assets.zilliz.com/Introducing_Milvus_2_6_2593452384.png
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, vector database, vector search, AI search, Milvus 2.6'
meta_title: |
  Introducing Milvus 2.6: Affordable Vector Search at Billion Scale
origin: >-
  https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md
---
<p>Da sich die KI-gestützte Suche von experimentellen Projekten zu einer unternehmenskritischen Infrastruktur entwickelt hat, sind die Anforderungen an <a href="https://milvus.io/blog/what-is-a-vector-database.md">Vektordatenbanken</a> gestiegen. Unternehmen müssen Milliarden von Vektoren verarbeiten und gleichzeitig die Infrastrukturkosten verwalten, die Dateneingabe in Echtzeit unterstützen und eine anspruchsvolle Suche bieten, die über eine einfache <a href="https://zilliz.com/learn/vector-similarity-search">Ähnlichkeitssuche</a> hinausgeht. Um diese neuen Herausforderungen zu meistern, haben wir hart an der Entwicklung und Verfeinerung von Milvus gearbeitet. Die Reaktion der Community war unglaublich ermutigend, und das wertvolle Feedback hat uns geholfen, unsere Richtung zu bestimmen.</p>
<p>Nach Monaten intensiver Entwicklungsarbeit freuen wir uns, bekannt geben zu können, dass <strong>Milvus 2.6 jetzt verfügbar ist</strong>. Diese Version ist eine direkte Antwort auf die drängendsten Herausforderungen der Vektorsuche von heute: <strong><em>effiziente Skalierung bei gleichzeitiger Kostenkontrolle.</em></strong></p>
<p>Milvus 2.6 bietet bahnbrechende Innovationen in drei entscheidenden Bereichen: <strong>Kostenreduzierung, erweiterte Suchfunktionen und architektonische Verbesserungen für massive Skalierung</strong>. Die Ergebnisse sprechen für sich selbst:</p>
<ul>
<li><p><strong>72 % Speicherreduzierung</strong> mit RaBitQ 1-Bit-Quantisierung bei gleichzeitig 4x schnelleren Abfragen</p></li>
<li><p><strong>50 % Kosteneinsparungen</strong> durch intelligenten Tiered Storage</p></li>
<li><p><strong>4x schnellere Volltextsuche</strong> als Elasticsearch mit unserer verbesserten BM25-Implementierung</p></li>
<li><p><strong>100x schnellere</strong> JSON-Filterung mit dem neu eingeführten Path Index</p></li>
<li><p>Die neue Zero-Disk-Architektur<strong>sorgt für eine ökonomische Frische der Suche</strong> </p></li>
<li><p><strong>Optimierter Einbettungs-Workflow</strong> mit dem neuen "Daten rein und Daten raus"-Erlebnis</p></li>
<li><p><strong>Bis zu 100K Sammlungen in einem einzigen Cluster</strong> für zukunftssichere Multi-Tenancy</p></li>
</ul>
<h2 id="Innovations-for-Cost-Reduction-Making-Vector-Search-Affordable" class="common-anchor-header">Innovationen zur Kostenreduzierung: Die Vektorsuche wird erschwinglich<button data-href="#Innovations-for-Cost-Reduction-Making-Vector-Search-Affordable" class="anchor-icon" translate="no">
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
    </button></h2><p>Der Speicherverbrauch stellt eine der größten Herausforderungen bei der Skalierung der Vektorsuche auf Milliarden von Datensätzen dar. Milvus 2.6 führt mehrere wichtige Optimierungen ein, die Ihre Infrastrukturkosten erheblich senken und gleichzeitig die Leistung verbessern.</p>
<h3 id="RaBitQ-1-bit-Quantization-72-Memory-Reduction-with-4×-Performance" class="common-anchor-header">RaBitQ 1-Bit-Quantisierung: 72% Speicherreduzierung bei 4× Leistung</h3><p>Herkömmliche Quantisierungsmethoden zwingen Sie dazu, die Suchqualität gegen Speichereinsparungen einzutauschen. Milvus 2.6 ändert dies mit der <a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">RaBitQ 1-Bit-Quantisierung</a> in Kombination mit einem intelligenten Verfeinerungsmechanismus.</p>
<p>Der neue IVF_RABITQ-Index komprimiert den Hauptindex durch 1-Bit-Quantisierung auf 1/32 seiner ursprünglichen Größe. In Verbindung mit einer optionalen SQ8-Verfeinerung sorgt dieser Ansatz für eine hohe Suchqualität (95% Recall) bei nur 1/4 des ursprünglichen Speicherplatzes.</p>
<p>Unsere vorläufigen Benchmarks zeigen vielversprechende Ergebnisse:</p>
<table>
<thead>
<tr><th><strong>Leistungsmetrik</strong></th><th><strong>Traditionell IVF_FLAT</strong></th><th><strong>Nur RaBitQ (1-Bit)</strong></th><th><strong>RaBitQ (1-Bit) + SQ8 Verfeinern</strong></th></tr>
</thead>
<tbody>
<tr><td>Speicher-Footprint</td><td>100% (Grundlinie)</td><td>3% (97% Reduktion)</td><td>28% (72% Verringerung)</td></tr>
<tr><td>Abruf</td><td>95.2%</td><td>76.3%</td><td>94.9%</td></tr>
<tr><td>Suchdurchsatz (QPS)</td><td>236</td><td>648 (2,7× schneller)</td><td>946 (4× schneller)</td></tr>
</tbody>
</table>
<p><em>Tabelle: VectorDBBench-Bewertung mit 1 Mio. Vektoren mit 768 Dimensionen, getestet auf AWS m6id.2xlarge</em></p>
<p>Der wirkliche Durchbruch ist hier nicht nur die 72%ige Speicherreduzierung, sondern auch die gleichzeitige Verbesserung des Durchsatzes um das 4fache. Das bedeutet, dass Sie dieselbe Arbeitslast mit 75 % weniger Servern bedienen oder 4 x mehr Datenverkehr auf Ihrer bestehenden Infrastruktur bewältigen können, und das alles ohne Einbußen beim Abruf.</p>
<p>Für Unternehmensanwender, die Milvus auf der<a href="https://zilliz.com/cloud"> Zilliz Cloud</a> vollständig verwalten, entwickeln wir eine automatisierte Strategie, die die RaBitQ-Parameter dynamisch an Ihre spezifischen Workload-Merkmale und Präzisionsanforderungen anpasst. Sie werden einfach eine größere Kosteneffizienz über alle Zilliz Cloud CU-Typen hinweg genießen.</p>
<h3 id="Hot-Cold-Tiered-Storage-50-Cost-Reduction-Through-Intelligent-Data-Placement" class="common-anchor-header">Hot-Cold Tiered Storage: 50 % Kostenreduzierung durch intelligente Datenplatzierung</h3><p>Reale Vektorsuch-Workloads enthalten Daten mit sehr unterschiedlichen Zugriffsmustern. Daten, auf die häufig zugegriffen wird, benötigen sofortige Verfügbarkeit, während Archivdaten im Austausch für drastisch niedrigere Speicherkosten eine etwas höhere Latenz tolerieren können.</p>
<p>Milvus 2.6 führt eine Tiered-Storage-Architektur ein, die Daten automatisch auf der Grundlage von Zugriffsmustern klassifiziert und in den entsprechenden Storage-Tiers platziert:</p>
<ul>
<li><p><strong>Intelligente Datenklassifizierung</strong>: Milvus identifiziert automatisch heiße (häufig genutzte) und kalte (selten genutzte) Datensegmente auf der Grundlage von Zugriffsmustern</p></li>
<li><p><strong>Optimierte Speicherplatzierung</strong>: Heiße Daten verbleiben im Hochleistungsspeicher/SSD, während kalte Daten in den kostengünstigeren Objektspeicher verschoben werden</p></li>
<li><p><strong>Dynamische Datenverschiebung</strong>: Wenn sich die Nutzungsmuster ändern, werden die Daten automatisch zwischen den Ebenen verschoben.</p></li>
<li><p><strong>Transparente Abfrage</strong>: Wenn Abfragen kalte Daten berühren, werden diese bei Bedarf automatisch geladen.</p></li>
</ul>
<p>Das Ergebnis ist eine Senkung der Speicherkosten um bis zu 50 % bei gleichbleibender Abfrageleistung für aktive Daten.</p>
<h3 id="Additional-Cost-Optimizations" class="common-anchor-header">Zusätzliche Kostenoptimierungen</h3><p>Milvus 2.6 bietet außerdem Int8-Vektor-Unterstützung für HNSW-Indizes, das Storage v2-Format für eine optimierte Struktur, die die IOPS- und Speicheranforderungen reduziert, sowie eine einfachere Installation direkt über APT/YUM-Paketmanager.</p>
<h2 id="Advanced-Search-Capabilities-Beyond-Basic-Vector-Similarity" class="common-anchor-header">Erweiterte Suchfähigkeiten: Mehr als einfache Vektorähnlichkeit<button data-href="#Advanced-Search-Capabilities-Beyond-Basic-Vector-Similarity" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Vektorsuche allein ist für moderne KI-Anwendungen nicht ausreichend. Die Benutzer verlangen die Präzision der traditionellen Informationssuche kombiniert mit dem semantischen Verständnis von Vektoreinbettungen. Milvus 2.6 führt eine Reihe von erweiterten Suchfunktionen ein, die diese Lücke schließen.</p>
<h3 id="Turbocharged-BM25-400-Faster-Full-Text-Search-Than-Elasticsearch" class="common-anchor-header">Turbolader BM25: 400% schnellere Volltextsuche als Elasticsearch</h3><p>Die<a href="https://milvus.io/blog/full-text-search-in-milvus-what-is-under-the-hood.md">Volltextsuche</a> ist für den Aufbau hybrider Retrievalsysteme in Vektordatenbanken unerlässlich geworden. In Milvus 2.6 wurden erhebliche Leistungsverbesserungen an der Volltextsuche vorgenommen, die auf der BM25-Implementierung aufbauen, die seit Version 2.5 eingeführt wurde. In dieser Version werden beispielsweise neue Parameter wie <code translate="no">drop_ratio_search</code> und <code translate="no">dim_max_score_ratio</code> eingeführt, die die Genauigkeit und Geschwindigkeit verbessern und eine feinere Steuerung der Suche ermöglichen.</p>
<p>Unsere Benchmarks mit dem branchenüblichen BEIR-Datensatz zeigen, dass Milvus 2.6 einen 3-4-fach höheren Durchsatz als Elasticsearch bei vergleichbaren Recall-Raten erzielt. Bei bestimmten Workloads erreicht die Verbesserung eine 7-fach höhere QPS.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_vs_ES_when_QPS_with_top_K1000_cadd1ac921.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="JSON-Path-Index-100x-Faster-Filtering" class="common-anchor-header">JSON-Pfad-Index: 100x schnelleres Filtern</h3><p>Milvus unterstützt JSON-Datentypen schon seit langem, aber das Filtern auf JSON-Feldern war aufgrund der fehlenden Indexunterstützung langsam. Milvus 2.6 fügt Unterstützung für JSON-Pfadindex hinzu, um die Leistung erheblich zu steigern.</p>
<p>Nehmen wir eine Benutzerprofildatenbank, in der jeder Datensatz verschachtelte Metadaten enthält:</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;user&quot;</span>: {
    <span class="hljs-string">&quot;location&quot;</span>: {
      <span class="hljs-string">&quot;city&quot;</span>: <span class="hljs-string">&quot;San Francisco&quot;</span>,
      <span class="hljs-string">&quot;country&quot;</span>: <span class="hljs-string">&quot;USA&quot;</span>
    },
    <span class="hljs-string">&quot;interests&quot;</span>: [<span class="hljs-string">&quot;AI&quot;</span>, <span class="hljs-string">&quot;Databases&quot;</span>, <span class="hljs-string">&quot;Cloud Computing&quot;</span>]
  },
  <span class="hljs-string">&quot;subscription&quot;</span>: {
    <span class="hljs-string">&quot;plan&quot;</span>: <span class="hljs-string">&quot;enterprise&quot;</span>,
    <span class="hljs-string">&quot;status&quot;</span>: <span class="hljs-string">&quot;active&quot;</span>
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>Für eine semantische Suche "Benutzer, die sich für KI interessieren", die nur auf San Francisco beschränkt ist, musste Milvus bisher das gesamte JSON-Objekt für jeden Datensatz analysieren und auswerten, was die Abfrage sehr teuer und langsam machte.</p>
<p>Jetzt ermöglicht Milvus die Erstellung von Indizes für bestimmte Pfade in JSON-Feldern, um die Suche zu beschleunigen:</p>
<pre><code translate="no">index_params.add_index(
    field_name=<span class="hljs-string">&quot;metadata&quot;</span>,
    index_type=<span class="hljs-string">&quot;INVERTED&quot;</span>,
    index_name=<span class="hljs-string">&quot;json_index&quot;</span>,
    <span class="hljs-keyword">params</span>={
        <span class="hljs-string">&quot;json_path&quot;</span>: <span class="hljs-string">&quot;metadata[\&quot;user\&quot;][\&quot;location\&quot;][\&quot;city\&quot;]&quot;</span>,  
        <span class="hljs-string">&quot;json_cast_type&quot;</span>: <span class="hljs-string">&quot;varchar&quot;</span>
    }
<button class="copy-code-btn"></button></code></pre>
<p>In unseren Leistungstests mit mehr als 100 Mio. Datensätzen reduzierte JSON Path Index die Filterlatenz von <strong>140 ms</strong> (P99: 480 ms) auf nur <strong>1,5 ms</strong> (P99: 10 ms) - eine Reduzierung der Latenz um 99 %, die solche Suchen in der Produktion praktikabel macht.</p>
<p>Diese Funktion ist besonders wertvoll für:</p>
<ul>
<li><p>Empfehlungssysteme mit komplexer Filterung von Benutzerattributen</p></li>
<li><p>RAG-Anwendungen, die Dokumente nach Metadaten filtern</p></li>
<li><p>Mandantenfähige Systeme, bei denen die Datensegmentierung entscheidend ist</p></li>
</ul>
<h3 id="Enhanced-Text-Processing-and-Time-Aware-Search" class="common-anchor-header">Verbesserte Textverarbeitung und zeitabhängige Suche</h3><p>Milvus 2.6 führt eine komplett überarbeitete Textanalyse-Pipeline mit ausgefeilter Sprachverarbeitung ein, einschließlich des Lindera-Tokenizers für Japanisch und Koreanisch, des ICU-Tokenizers für umfassende mehrsprachige Unterstützung und des erweiterten Jieba mit benutzerdefinierter Wörterbuchintegration.</p>
<p><strong>Phrase Match Intelligence</strong> erfasst semantische Nuancen in der Wortreihenfolge und unterscheidet dabei zwischen &quot;maschinellen Lerntechniken&quot; und &quot;maschinellen Lerntechniken&quot;:</p>
<pre><code translate="no"><span class="hljs-title function_">PHRASE_MATCH</span>(document_text, <span class="hljs-string">&quot;artificial intelligence research&quot;</span>, slop=<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Zeitabhängige Abklingfunktionen</strong> priorisieren automatisch neue Inhalte, indem sie die Relevanzbewertung auf der Grundlage des Alters der Dokumente anpassen, mit konfigurierbaren Abklingraten und Funktionstypen (exponentiell, gaußförmig oder linear).</p>
<h3 id="Streamlined-Search-Data-in-Data-Out-Experience" class="common-anchor-header">Optimierte Suche: Daten rein, Daten raus Erfahrung</h3><p>Die Trennung zwischen Rohdaten und Vektoreinbettungen ist ein weiterer Schmerzpunkt für Entwickler, die Vektordatenbanken verwenden. Bevor die Daten Milvus für die Indizierung und die Vektorsuche erreichen, werden sie oft mit externen Modellen vorverarbeitet, die Rohtext, Bilder oder Audio in Vektordarstellungen umwandeln. Nach dem Abruf sind weitere nachgelagerte Verarbeitungen erforderlich, z. B. die Rückführung von Ergebnis-IDs auf den ursprünglichen Inhalt.</p>
<p>Milvus 2.6 vereinfacht diese Einbettungsworkflows mit der neuen <strong>Funktionsschnittstelle</strong>, die Einbettungsmodelle von Drittanbietern direkt in Ihre Suchpipeline integriert. Anstatt Einbettungen im Voraus zu berechnen, können Sie jetzt:</p>
<ol>
<li><p><strong>Rohdaten direkt einfügen</strong>: Übermitteln Sie Text, Bilder oder andere Inhalte an Milvus</p></li>
<li><p><strong>Konfigurieren Sie Einbettungsanbieter</strong>: Verbinden Sie sich mit Einbettungs-API-Diensten von OpenAI, AWS Bedrock, Google Vertex AI, Hugging Face und anderen.</p></li>
<li><p><strong>Abfrage mit natürlicher Sprache</strong>: Suchen Sie direkt mit Rohtextabfragen.</p></li>
</ol>
<p>Dies schafft eine "Data-In, Data-Out"-Erfahrung, bei der Milvus alle Vektorumwandlungen hinter den Kulissen für Sie optimiert.</p>
<h2 id="Architectural-Evolution-Scaling-to-Tens-of-Billions-of-Vectors" class="common-anchor-header">Architektonische Entwicklung: Skalierung auf mehrere zehn Milliarden Vektoren<button data-href="#Architectural-Evolution-Scaling-to-Tens-of-Billions-of-Vectors" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 führt grundlegende architektonische Innovationen ein, die eine kosteneffiziente Skalierung auf Dutzende von Milliarden Vektoren ermöglichen.</p>
<h3 id="Replacing-Kafka-and-Pulsar-with-a-New-Woodpecker-WAL" class="common-anchor-header">Ersetzen von Kafka und Pulsar durch ein neues Woodpecker WAL</h3><p>Frühere Milvus-Implementierungen stützten sich auf externe Nachrichten-Warteschlangen wie Kafka oder Pulsar als Write-Ahead-Log-System (WAL). Obwohl diese Systeme anfangs gut funktionierten, brachten sie eine erhebliche betriebliche Komplexität und einen Ressourcen-Overhead mit sich.</p>
<p>Mit Milvus 2.6 wird <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md"><strong>Woodpecker</strong></a> eingeführt, ein speziell entwickeltes, Cloud-natives WAL-System, das diese externen Abhängigkeiten durch ein revolutionäres Zero-Disk-Design eliminiert:</p>
<ul>
<li><p><strong>Alles auf Objektspeicher</strong>: Alle Protokolldaten werden in einem Objektspeicher wie S3, Google Cloud Storage oder MinIO gespeichert.</p></li>
<li><p><strong>Verteilte Metadaten</strong>: Metadaten werden weiterhin vom etcd-Schlüsselwertspeicher verwaltet</p></li>
<li><p><strong>Keine Abhängigkeiten von lokalen Festplatten</strong>: Eine Entscheidung, um die komplexe Architektur und den betrieblichen Overhead zu eliminieren, die mit einem verteilten lokalen permanenten Zustand verbunden sind.</p></li>
</ul>
<p>Wir haben umfassende Benchmarks durchgeführt, um die Leistung von Woodpecker zu vergleichen:</p>
<table>
<thead>
<tr><th><strong>System</strong></th><th><strong>Kafka</strong></th><th><strong>Pulsar</strong></th><th><strong>WP MinIO</strong></th><th><strong>WP Lokal</strong></th><th><strong>WP S3</strong></th></tr>
</thead>
<tbody>
<tr><td>Durchsatz</td><td>129,96 MB/s</td><td>107 MB/s</td><td>71 MB/s</td><td>450 MB/s</td><td>750 MB/s</td></tr>
<tr><td>Latenzzeit</td><td>58 ms</td><td>35 ms</td><td>184 ms</td><td>1,8 ms</td><td>166 ms</td></tr>
</tbody>
</table>
<p>Woodpecker erreicht durchgängig 60-80% des theoretischen Maximaldurchsatzes für jedes Speicher-Backend, wobei der lokale Dateisystemmodus 450 MB/s erreicht - 3,5× schneller als Kafka - und der S3-Modus 750 MB/s erreicht, 5,8× höher als Kafka.</p>
<p>Weitere Einzelheiten zu Woodpecker finden Sie in diesem Blog: <a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Wir haben Kafka/Pulsar durch einen Woodpecker für Milvus ersetzt</a>.</p>
<h3 id="Search-Freshness-Achieved-Economically" class="common-anchor-header">Suchfrische auf wirtschaftliche Weise erreicht</h3><p>Die unternehmenskritische Suche erfordert in der Regel, dass neu eingelesene Daten sofort durchsuchbar sind. Milvus 2.6 ersetzt die Abhängigkeit von Nachrichtenwarteschlangen, um die Handhabung frischer Aktualisierungen grundlegend zu verbessern und die Frische der Suche bei geringerem Ressourcen-Overhead zu gewährleisten. Die neue Architektur fügt den neuen <strong>Streaming Node</strong> hinzu, eine dedizierte Komponente, die in enger Abstimmung mit anderen Milvus-Komponenten wie dem Query Node und dem Data Node arbeitet. Der Streaming Node baut auf Woodpecker auf, unserem leichtgewichtigen, cloud-nativen Write-Ahead Log (WAL) System.</p>
<p>Diese neue Komponente ermöglicht:</p>
<ul>
<li><p><strong>Große Kompatibilität</strong>: Funktioniert sowohl mit dem neuen Woodpecker WAL als auch rückwärtskompatibel mit Kafka, Pulsar und anderen Streaming-Plattformen</p></li>
<li><p><strong>Inkrementelle Indizierung</strong>: Neue Daten werden sofort durchsuchbar, ohne Batch-Verzögerungen</p></li>
<li><p><strong>Kontinuierliches Query Serving</strong>: Gleichzeitige Ingestion mit hohem Durchsatz und Abfragen mit niedriger Latenz</p></li>
</ul>
<p>Durch die Trennung von Streaming und Batch-Verarbeitung sorgt der Streaming Node dafür, dass Milvus auch bei hohem Datenaufkommen eine stabile Leistung und die Aktualität der Suchergebnisse gewährleistet. Er ist auf horizontale Skalierbarkeit ausgelegt und skaliert die Knotenkapazität dynamisch auf Basis des Datendurchsatzes.</p>
<h3 id="Enhanced-Multi-tenancy-Capability-Scaling-to-100k-Collections-Per-Cluster" class="common-anchor-header">Verbesserte Mandantenfähigkeit: Skalierung auf 100k Sammlungen pro Cluster</h3><p>Unternehmensimplementierungen erfordern häufig eine Isolierung auf Mandantenebene. Mit Milvus 2.6 wird die Unterstützung von Mandantenfähigkeit drastisch erhöht, indem bis zu <strong>100.000 Sammlungen</strong> pro Cluster möglich sind. Dies ist eine entscheidende Verbesserung für Unternehmen, die einen großen monolithischen Cluster betreiben, der viele Mandanten bedient.</p>
<p>Ermöglicht wird diese Verbesserung durch zahlreiche technische Optimierungen bei der Metadatenverwaltung, der Ressourcenzuweisung und der Abfrageplanung. Milvus-Benutzer können nun auch bei Zehntausenden von Sammlungen eine stabile Leistung genießen.</p>
<h3 id="Other-Improvements" class="common-anchor-header">Weitere Verbesserungen</h3><p>Milvus 2.6 bietet weitere architektonische Verbesserungen, wie z.B. CDC + BulkInsert für eine vereinfachte Datenreplikation über geografische Regionen hinweg und Coord Merge für eine bessere Cluster-Koordination in groß angelegten Implementierungen.</p>
<h2 id="Getting-Started-with-Milvus-26" class="common-anchor-header">Erste Schritte mit Milvus 2.6<button data-href="#Getting-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6 stellt einen massiven technischen Aufwand mit Dutzenden von neuen Funktionen und Leistungsoptimierungen dar, die gemeinsam von Zilliz-Ingenieuren und unseren fantastischen Community-Mitarbeitern entwickelt wurden. Während wir hier die wichtigsten Funktionen vorgestellt haben, gibt es noch mehr zu entdecken. Wir empfehlen Ihnen, unsere umfassenden <a href="https://milvus.io/docs/release_notes.md">Versionshinweise</a> zu lesen, um alles zu entdecken, was diese Version zu bieten hat!</p>
<p>Die vollständige Dokumentation, Migrationsleitfäden und Tutorials finden Sie auf der<a href="https://milvus.io/"> Milvus-Website</a>. Für Fragen und Community-Support können Sie unserem<a href="https://discord.com/invite/8uyFbECzPX"> Discord-Kanal</a> beitreten oder Probleme auf<a href="https://github.com/milvus-io/milvus"> GitHub</a> melden.</p>
