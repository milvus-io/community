---
id: >-
  how-to-cut-vector-database-costs-by-up-to-80-a-practical-milvus-optimization-guide.md
title: >-
  Wie Sie die Kosten für Vektordatenbanken um bis zu 80 % senken können: Ein
  praktischer Milvus-Optimierungsleitfaden
author: Jack Li
date: 2026-3-20
cover: assets.zilliz.com/cover_reduce_vdb_cost_by_80_56ed2fe3ae.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus cost optimization, vector database cost reduction, RAG cost
  optimization, HNSW vs IVF_SQ8, vector search cost
meta_title: |
  Milvus Cost Optimization Guide: Cut Vector Database Costs by Up to 80%
desc: >-
  Milvus ist kostenlos, aber die Infrastruktur ist es nicht. Erfahren Sie, wie
  Sie die Speicherkosten für Vektordatenbanken durch bessere Indizes, MMap und
  Tiered Storage um 60-80 % senken können.
origin: >-
  https://milvus.io/blog/how-to-cut-vector-database-costs-by-up-to-80-a-practical-milvus-optimization-guide.md
---
<p>Ihr RAG-Prototyp hat großartig funktioniert. Dann ging er in Produktion, der Datenverkehr nahm zu, und nun ist die Rechnung für Ihre Vektordatenbank von 500 auf 5.000 Dollar pro Monat gestiegen. Kommt Ihnen das bekannt vor?</p>
<p>Dies ist eines der häufigsten Skalierungsprobleme bei KI-Anwendungen im Moment. Sie haben etwas entwickelt, das einen echten Mehrwert schafft, aber die Infrastrukturkosten wachsen schneller als Ihre Nutzerbasis. Und wenn man sich die Rechnung ansieht, ist die Vektordatenbank oft die größte Überraschung - bei den Implementierungen, die wir gesehen haben, kann sie etwa 40-50 % der Gesamtkosten der Anwendung ausmachen, gleich nach den LLM-API-Aufrufen.</p>
<p>In diesem Leitfaden gehe ich darauf ein, wo das Geld tatsächlich hingeht und was Sie konkret tun können, um die Kosten zu senken - in vielen Fällen um 60-80 %. Ich werde <a href="https://milvus.io/">Milvus</a>, die beliebteste Open-Source-Vektordatenbank, als primäres Beispiel verwenden, da ich mich damit am besten auskenne, aber die Prinzipien gelten für die meisten Vektordatenbanken.</p>
<p><em>Um es klarzustellen:</em> <em><a href="https://milvus.io/">Milvus</a></em> <em>selbst ist kostenlos und quelloffen - Sie zahlen nie für die Software. Die Kosten entstehen ausschließlich durch die Infrastruktur, auf der es läuft: Cloud-Instanzen, Speicher, Storage und Netzwerk. Die gute Nachricht ist, dass der größte Teil dieser Infrastrukturkosten reduzierbar ist.</em></p>
<h2 id="Where-Does-the-Money-Actually-Go-When-Using-a-VectorDB" class="common-anchor-header">Wohin fließt das Geld bei der Verwendung einer VectorDB?<button data-href="#Where-Does-the-Money-Actually-Go-When-Using-a-VectorDB" class="anchor-icon" translate="no">
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
    </button></h2><p>Lassen Sie uns mit einem konkreten Beispiel beginnen. Nehmen wir an, Sie haben 100 Millionen Vektoren mit 768 Dimensionen, die als float32 gespeichert sind - eine ziemlich typische RAG-Konfiguration. Das sind die ungefähren monatlichen Kosten bei AWS:</p>
<table>
<thead>
<tr><th><strong>Kostenkomponente</strong></th><th><strong>Anteil</strong></th><th><strong>~Monatliche Kosten</strong></th><th><strong>Anmerkungen</strong></th></tr>
</thead>
<tbody>
<tr><td>Datenverarbeitung (CPU + Speicher)</td><td>85-90%</td><td>$2,800</td><td>Der große Brocken - hauptsächlich durch den Arbeitsspeicher bestimmt</td></tr>
<tr><td>Netzwerk</td><td>5-10%</td><td>$250</td><td>AZ-übergreifender Datenverkehr, große Ergebnis-Nutzlasten</td></tr>
<tr><td>Speicher</td><td>2-5%</td><td>$100</td><td>Günstig - Objektspeicher (S3/MinIO) ist ~$0,03/GB</td></tr>
</tbody>
</table>
<p>Die Schlussfolgerung ist einfach: 85-90 % Ihres Geldes fließen in den Speicher. Netzwerk und Speicher spielen nur am Rande eine Rolle, aber wenn Sie die Kosten spürbar senken wollen, ist der Speicher der Hebel. Alles in diesem Leitfaden konzentriert sich auf dieses Thema.</p>
<p><strong>Kurzer Hinweis zu Netzwerk und Speicher:</strong> Sie können die Netzwerkkosten senken, indem Sie nur die Felder zurückgeben, die Sie benötigen (ID, Punktzahl, wichtige Metadaten) und regionsübergreifende Abfragen vermeiden. Was die Speicherung angeht, so trennt Milvus bereits die Speicherung von der Berechnung - Ihre Vektoren befinden sich in einem billigen Objektspeicher wie S3, so dass selbst bei 100 Mio. Vektoren die Speicherkosten in der Regel unter 50 $/Monat liegen. Keines dieser Elemente wird die Nadel so bewegen wie die Speicheroptimierung.</p>
<h2 id="Why-Memory-Is-So-Expensive-for-Vector-Search" class="common-anchor-header">Warum der Speicher für die Vektorsuche so kostspielig ist<button data-href="#Why-Memory-Is-So-Expensive-for-Vector-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn Sie von traditionellen Datenbanken kommen, kann der Speicherbedarf für die Vektorsuche überraschend sein. Eine relationale Datenbank kann plattenbasierte B-Tree-Indizes und den Seitencache des Betriebssystems nutzen. Die Vektorsuche ist anders - sie erfordert massive Fließkommaberechnungen, und Indizes wie HNSW oder IVF müssen im Speicher geladen bleiben, um eine Latenzzeit im Millisekundenbereich zu erreichen.</p>
<p>Mit der folgenden Formel können Sie Ihren Speicherbedarf schnell abschätzen:</p>
<p><strong>Erforderlicher Speicher = (Vektoren × Dimensionen × 4 Byte) × Indexmultiplikator</strong></p>
<p>Für unser 100M × 768 × float32 Beispiel mit HNSW (Multiplikator ~1,8x):</p>
<ul>
<li>Rohdaten: 100M × 768 × 4 Bytes ≈ 307 GB</li>
<li>Mit HNSW-Index: 307 GB × 1,8 ≈ 553 GB</li>
<li>Mit OS-Overhead, Cache und Headroom: ~768 GB insgesamt</li>
<li>Auf AWS: 3× r6i.8xlarge (je 256 GB) ≈ $2.800/Monat</li>
</ul>
<p><strong>Das ist die Ausgangsbasis. Schauen wir uns nun an, wie man es reduzieren kann.</strong></p>
<h2 id="1-Pick-the-Right-Index-to-Get-4x-Less-Memory-Usage" class="common-anchor-header">1. Wählen Sie den richtigen Index, um die Speichernutzung um das Vierfache zu reduzieren<button data-href="#1-Pick-the-Right-Index-to-Get-4x-Less-Memory-Usage" class="anchor-icon" translate="no">
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
    </button></h2><p>Dies ist die wichtigste Änderung, die Sie vornehmen können. Bei demselben 100-Meter-Vektordatensatz kann die Speichernutzung je nach Wahl des Index um das 4-6fache variieren.</p>
<ul>
<li><strong>FLAT / IVF_FLAT</strong>: fast keine Komprimierung, so dass die Speichernutzung nahe an der Rohdatengröße bleibt, etwa <strong>300 GB</strong></li>
<li><strong>HNSW</strong>: speichert eine zusätzliche Graphenstruktur, so dass der Speicherbedarf in der Regel das <strong>1,5- bis 2,0-fache</strong> der Rohdatengröße beträgt, also etwa <strong>450 bis 600 GB</strong></li>
<li><strong>IVF_SQ8</strong>: komprimiert float32-Werte in uint8, was eine etwa <strong>4-fache Komprimierung</strong> ergibt, so dass der Speicherbedarf auf etwa <strong>75 bis 100 GB</strong> sinken kann</li>
<li><strong>IVF_PQ / DiskANN</strong>: verwendet eine stärkere Komprimierung oder einen plattenbasierten Index, so dass der Speicherbedarf weiter auf etwa <strong>30 bis 60 GB</strong> sinken kann.</li>
</ul>
<p>Viele Teams beginnen mit HNSW, weil er die beste Abfragegeschwindigkeit hat, aber am Ende zahlen sie 3-5 mal mehr als nötig.</p>
<p>Hier ein Vergleich der wichtigsten Indexarten:</p>
<table>
<thead>
<tr><th><strong>Index</strong></th><th><strong>Speicher Multiplikator</strong></th><th><strong>Abfragegeschwindigkeit</strong></th><th><strong>Rückruf</strong></th><th><strong>Am besten für</strong></th></tr>
</thead>
<tbody>
<tr><td>FLAT</td><td>~1.0x</td><td>Langsam</td><td>100%</td><td>Kleine Datensätze (&lt;1M), Tests</td></tr>
<tr><td>IVF_FLAT</td><td>~1.05x</td><td>Mittel</td><td>95-99%</td><td>Allgemeine Verwendung</td></tr>
<tr><td>IVF_SQ8</td><td>~0.30x</td><td>Mittel</td><td>93-97%</td><td>Kostensensitive Produktion (empfohlen)</td></tr>
<tr><td>IVF_PQ</td><td>~0.12x</td><td>Schnell</td><td>70-80%</td><td>Sehr große Datensätze, grober Abruf</td></tr>
<tr><td>HNSW</td><td>~1.8x</td><td>Sehr schnell</td><td>98-99%</td><td>Nur wenn die Latenzzeit wichtiger ist als die Kosten</td></tr>
<tr><td>DiskANN</td><td>~0.08x</td><td>Mittel</td><td>95-98%</td><td>Sehr großer Maßstab mit NVMe-SSDs</td></tr>
</tbody>
</table>
<p><strong>Die Quintessenz:</strong> Der Wechsel von HNSW oder IVF_FLAT zu IVF_SQ8 führt in der Regel zu einer Verringerung des Rückrufs um nur 2-3 % (z. B. von 97 % auf 94-95 %), während die Speicherkosten um etwa 70 % sinken. Für die meisten RAG-Workloads ist dieser Kompromiss absolut lohnenswert. Wenn Sie eine grobe Abfrage durchführen oder Ihr Genauigkeitsanspruch niedriger ist, können IVF_PQ oder IVF_RABITQ die Einsparungen weiter erhöhen.</p>
<p><strong>Meine Empfehlung:</strong> Wenn Sie HNSW in der Produktion einsetzen und die Kosten eine Rolle spielen, sollten Sie IVF_SQ8 zunächst mit einer Testsammlung ausprobieren. Messen Sie den Rückruf bei Ihren tatsächlichen Abfragen. Die meisten Teams sind überrascht, wie gering der Genauigkeitsverlust ist.</p>
<h2 id="2-Stop-Loading-Everything-into-Memory-for-60-80-Cost-Reduction" class="common-anchor-header">2. Nicht mehr alles in den Speicher laden, um die Kosten um 60-80 % zu senken<button data-href="#2-Stop-Loading-Everything-into-Memory-for-60-80-Cost-Reduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Selbst wenn Sie einen effizienteren Index ausgewählt haben, kann es sein, dass Sie immer noch mehr Daten im Speicher haben als nötig. Milvus bietet zwei Möglichkeiten, dies zu beheben: <strong>MMap (verfügbar seit 2.3) und Tiered Storage (verfügbar seit 2.6). Beide können die Speichernutzung um 60-80% reduzieren.</strong></p>
<p>Der Grundgedanke ist bei beiden derselbe: Nicht alle Daten müssen ständig im Speicher liegen. Der Unterschied besteht darin, wie sie mit den Daten umgehen, die sich nicht im Speicher befinden.</p>
<h3 id="MMap-Memory-Mapped-Files" class="common-anchor-header">MMap (Memory-Mapped Files)</h3><p>MMap bildet Ihre Datendateien von der lokalen Festplatte in den Adressraum des Prozesses ab. Der gesamte Datensatz verbleibt auf der lokalen Festplatte des Knotens, und das Betriebssystem lädt Seiten nur bei Bedarf in den Speicher, wenn auf sie zugegriffen wird. Vor der Verwendung von MMap werden alle Daten vom Objektspeicher (S3/MinIO) auf die lokale Festplatte des QueryNode heruntergeladen.</p>
<ul>
<li>Die Speichernutzung sinkt auf ~10-30 % des Volllastmodus</li>
<li>Die Latenz bleibt stabil und vorhersehbar (Daten befinden sich auf der lokalen Festplatte, kein Netzwerkabruf)</li>
<li>Nachteil: Die lokale Festplatte muss groß genug sein, um den gesamten Datensatz zu speichern.</li>
</ul>
<h3 id="Tiered-Storage" class="common-anchor-header">Tiered Storage</h3><p>Tiered Storage geht noch einen Schritt weiter. Anstatt alles auf die lokale Festplatte herunterzuladen, wird die lokale Festplatte als Cache für heiße Daten verwendet und der Objektspeicher als primäre Schicht beibehalten. Die Daten werden nur bei Bedarf aus dem Objektspeicher abgerufen.</p>
<ul>
<li>Die Speichernutzung sinkt auf &lt;10 % des Volllastmodus.</li>
<li>Die Nutzung der lokalen Festplatte sinkt ebenfalls - nur heiße Daten werden zwischengespeichert (normalerweise 10-30 % der Gesamtmenge).</li>
<li>Nachteil: Cache-Fehlversuche führen zu einer zusätzlichen Latenz von 50-200 ms (Abruf aus dem Objektspeicher)</li>
</ul>
<h3 id="Data-flow-and-resource-usage" class="common-anchor-header">Datenfluss und Ressourcennutzung</h3><table>
<thead>
<tr><th><strong>Modus</strong></th><th><strong>Datenfluss</strong></th><th><strong>Speicherauslastung</strong></th><th><strong>Lokale Festplattenverwendung</strong></th><th><strong>Latenz</strong></th></tr>
</thead>
<tbody>
<tr><td>Traditionelle Volllast</td><td>Objektspeicher → Arbeitsspeicher (100%)</td><td>Sehr hoch (100 %)</td><td>Niedrig (nur vorübergehend)</td><td>Sehr niedrig und stabil</td></tr>
<tr><td>MMap</td><td>Objektspeicher → lokale Festplatte (100%) → Arbeitsspeicher (bei Bedarf)</td><td>Niedrig (10-30%)</td><td>Hoch (100%)</td><td>Niedrig und stabil</td></tr>
<tr><td>Tiered Storage</td><td>Objektspeicher ↔ lokaler Cache (heiße Daten) → Arbeitsspeicher (bei Bedarf)</td><td>Sehr niedrig (&lt;10%)</td><td>Niedrig (nur heiße Daten)</td><td>Geringer Cache-Hit, höherer Cache-Miss</td></tr>
</tbody>
</table>
<p><strong>Hardware-Empfehlung:</strong> Beide Methoden hängen stark von lokalen Festplatten-E/A ab, daher werden <strong>NVMe-SSDs</strong> dringend empfohlen, idealerweise mit <strong>IOPS über 10.000</strong>.</p>
<h3 id="MMap-vs-Tiered-Storage-Which-One-Should-You-Use" class="common-anchor-header">MMap vs. Tiered Storage: Welche Methode sollten Sie verwenden?</h3><table>
<thead>
<tr><th><strong>Ihre Situation</strong></th><th><strong>Verwenden Sie dies</strong></th><th><strong>Warum</strong></th></tr>
</thead>
<tbody>
<tr><td>Latenzempfindlich (P99 &lt; 20ms)</td><td>MMap</td><td>Daten befinden sich bereits auf der lokalen Festplatte - kein Netzwerkabruf, stabile Latenz</td></tr>
<tr><td>Gleichmäßiger Zugriff (keine klare Aufteilung in heiß und kalt)</td><td>MMap</td><td>Tiered Storage benötigt Hot/Cold Skew, um effektiv zu sein; ohne diesen ist die Cache-Trefferquote niedrig</td></tr>
<tr><td>Kosten stehen im Vordergrund (gelegentliche Latenzspitzen sind OK)</td><td>Tiered Storage</td><td>Spart sowohl Speicher als auch lokale Festplatte (70-90% weniger Festplatte)</td></tr>
<tr><td>Klares Hot/Cold-Muster (80/20-Regel)</td><td>Tiered Storage</td><td>Heiße Daten bleiben im Cache, kalte Daten bleiben günstig im Objektspeicher</td></tr>
<tr><td>Sehr großer Maßstab (&gt;500M Vektoren)</td><td>Tiered Storage</td><td>Die lokale Festplatte eines Knotens kann bei dieser Größenordnung oft nicht den gesamten Datensatz aufnehmen</td></tr>
</tbody>
</table>
<p><strong>Hinweis:</strong> MMap erfordert Milvus 2.3+. Tiered Storage erfordert Milvus 2.6+. Beide funktionieren am besten mit NVMe-SSDs (10.000+ IOPS empfohlen).</p>
<h3 id="How-to-Configure-MMap" class="common-anchor-header">So konfigurieren Sie MMap</h3><p><strong>Option 1: YAML-Konfiguration (empfohlen für neue Bereitstellungen)</strong></p>
<p>Bearbeiten Sie die Milvus-Konfigurationsdatei milvus.yaml und fügen Sie die folgenden Einstellungen unter dem Abschnitt queryNode hinzu:</p>
<pre><code translate="no">queryNode:
  mmap:
    vectorField: <span class="hljs-literal">true</span>      <span class="hljs-comment"># vector data</span>
    vectorIndex: <span class="hljs-literal">true</span>      <span class="hljs-comment"># vector index (largest source of savings!)</span>
    scalarField: <span class="hljs-literal">true</span>      <span class="hljs-comment"># scalar data (recommended for RAG workloads)</span>
    scalarIndex: <span class="hljs-literal">true</span>      <span class="hljs-comment"># scalar index</span>
    growingMmapEnabled: <span class="hljs-literal">false</span>  <span class="hljs-comment"># incremental data stays in memory</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Option 2: Python SDK-Konfiguration (für bestehende Sammlungen)</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># You must release the collection before changing the mmap setting</span>
client.release_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)

<span class="hljs-comment"># Enable MMap</span>
client.alter_collection_properties(
    collection_name=<span class="hljs-string">&quot;my_collection&quot;</span>,
    properties={<span class="hljs-string">&quot;mmap.enabled&quot;</span>: <span class="hljs-literal">True</span>}
)

<span class="hljs-comment"># Load the collection again to apply the MMap setting</span>
client.load_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)

<span class="hljs-comment"># Verify that the setting has taken effect</span>
<span class="hljs-built_in">print</span>(client.describe_collection(<span class="hljs-string">&quot;my_collection&quot;</span>)[<span class="hljs-string">&quot;properties&quot;</span>])
<span class="hljs-comment"># Output: {&#x27;mmap.enabled&#x27;: &#x27;True&#x27;}</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-to-Configure-Tiered-Storage-Milvus-26+" class="common-anchor-header">So konfigurieren Sie den abgestuften Speicher (Milvus 2.6+)</h3><p>Bearbeiten Sie die Milvus-Konfigurationsdatei milvus.yaml und fügen Sie die folgenden Einstellungen unter dem Abschnitt queryNode hinzu:</p>
<pre><code translate="no">queryNode:
  segcore:
    tieredStorage:
      warmup:                                                                                                                                                      
          <span class="hljs-comment"># Options: sync, async, disable                      </span>
          <span class="hljs-comment"># Specifies when tiered storage cache warm-up happens.                                                                                                                             </span>
          <span class="hljs-comment"># - &quot;sync&quot;: data is loaded into the cache before the segment is considered fully loaded.                                                                                    </span>
          <span class="hljs-comment"># - &quot;disable&quot;: data is not proactively loaded into the cache, and is loaded only when needed by Search/Query tasks.                                                                            </span>
          <span class="hljs-comment"># The default is &quot;sync&quot;, but vector fields default to &quot;disable&quot;.                                                                                                            </span>
          scalarField: sync                                                                                                                                          
          scalarIndex: sync                                                                                                                                          
          vectorField: disable <span class="hljs-comment"># Cache warm-up for raw vector field data is disabled by default.</span>
          vectorIndex: sync
      memoryHighWatermarkRatio: <span class="hljs-number">0.85</span>   <span class="hljs-comment"># Start eviction when memory usage exceeds 85%</span>
      memoryLowWatermarkRatio: <span class="hljs-number">0.70</span>    <span class="hljs-comment"># Stop eviction when memory usage drops to 70%</span>
      diskHighWatermarkRatio: <span class="hljs-number">0.80</span>     <span class="hljs-comment"># High watermark for disk eviction</span>
      diskLowWatermarkRatio: <span class="hljs-number">0.75</span>      <span class="hljs-comment"># Low watermark for disk eviction</span>
      evictionEnabled: true            <span class="hljs-comment"># Must be enabled!</span>
      backgroundEvictionEnabled: true  <span class="hljs-comment"># Background eviction thread</span>
      cacheTtl: <span class="hljs-number">3600</span>                   <span class="hljs-comment"># Automatically evict if not accessed for 1 hour</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Use-Lower-Dimensional-Embeddings" class="common-anchor-header">Use Lower-Dimensional Embeddings<button data-href="#Use-Lower-Dimensional-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p>Diese Einstellung ist leicht zu übersehen, aber die Dimension skaliert direkt Ihre Kosten. Arbeitsspeicher, Speicherplatz und Rechenleistung wachsen linear mit der Anzahl der Dimensionen. Ein Modell mit 1536 Dimensionen kostet etwa 4x mehr Infrastruktur als ein Modell mit 384 Dimensionen für dieselben Daten.</p>
<p>Die Abfragekosten skalieren auf die gleiche Weise - Kosinusähnlichkeit ist O(D), so dass 768-Dim-Vektoren pro Abfrage etwa doppelt so viel Rechenaufwand erfordern wie 384-Dim-Vektoren. Bei Workloads mit hoher QPS bedeutet dieser Unterschied, dass weniger Knoten benötigt werden.</p>
<p>Im Folgenden werden die gängigen Einbettungsmodelle verglichen (unter Verwendung von 384-Dim als 1,0x-Basiswert):</p>
<table>
<thead>
<tr><th><strong>Modell</strong></th><th><strong>Abmessungen</strong></th><th><strong>Relative Kosten</strong></th><th><strong>Rückruf</strong></th><th><strong>Am besten für</strong></th></tr>
</thead>
<tbody>
<tr><td>text-einbettung-3-groß</td><td>3072</td><td>8.0x</td><td>98%+</td><td>Wenn Genauigkeit nicht verhandelbar ist (Forschung, Gesundheitswesen)</td></tr>
<tr><td>text-einbettung-3-klein</td><td>1536</td><td>4.0x</td><td>95-97%</td><td>Allgemeine RAG-Workloads</td></tr>
<tr><td>DistilBERT</td><td>768</td><td>2.0x</td><td>92-95%</td><td>Gutes Kosten-Nutzen-Verhältnis</td></tr>
<tr><td>all-MiniLM-L6-v2</td><td>384</td><td>1.0x</td><td>88-92%</td><td>Kostenempfindliche Arbeitslasten</td></tr>
</tbody>
</table>
<p><strong>Praktische Ratschläge:</strong> Gehen Sie nicht davon aus, dass Sie das größte Modell benötigen. Testen Sie eine repräsentative Stichprobe Ihrer tatsächlichen Abfragen (1 Mio. Vektoren sind in der Regel ausreichend) und finden Sie das Modell mit der niedrigsten Dimension, das Ihren Anforderungen an die Genauigkeit entspricht. Viele Teams stellen fest, dass 768 Dimensionen genauso gut funktionieren wie 1536 für ihren Anwendungsfall.</p>
<p><strong>Sie haben sich bereits für ein hochdimensionales Modell entschieden?</strong> Sie können die Dimensionen auch nachträglich reduzieren. PCA (Principal Component Analysis) kann redundante Merkmale entfernen, und mit <a href="https://milvus.io/blog/matryoshka-embeddings-detail-at-multiple-scales.md">Matryoshka-Einbettungen</a> können Sie die ersten N Dimensionen abschneiden und dabei den Großteil der Qualität beibehalten. Beide Verfahren sind einen Versuch wert, bevor Sie Ihren gesamten Datensatz neu einbetten.</p>
<h2 id="Manage-Data-Lifecycle-with-Compaction-and-TTL" class="common-anchor-header">Verwalten des Datenlebenszyklus mit Verdichtung und TTL<button data-href="#Manage-Data-Lifecycle-with-Compaction-and-TTL" class="anchor-icon" translate="no">
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
    </button></h2><p>Dieser Punkt ist weniger glamourös, aber dennoch wichtig, insbesondere für langlaufende Produktionssysteme. Milvus verwendet ein "append-only"-Speichermodell: Wenn Sie Daten löschen, werden sie als gelöscht markiert, aber nicht sofort entfernt. Mit der Zeit sammeln sich diese toten Daten an, verschwenden Speicherplatz und führen dazu, dass Abfragen mehr Zeilen als nötig durchsuchen müssen.</p>
<h3 id="Compaction-Reclaim-Storage-from-Deleted-Data" class="common-anchor-header">Verdichtung: Speicherplatz von gelöschten Daten zurückgewinnen</h3><p>Die Verdichtung ist der Hintergrundprozess von Milvus zum Aufräumen. Er führt kleine Segmente zusammen, entfernt physisch gelöschte Daten und schreibt komprimierte Dateien neu. Dies ist sinnvoll, wenn:</p>
<ul>
<li>Sie häufige Schreib- und Löschvorgänge haben (Produktkataloge, Inhaltsaktualisierungen, Echtzeitprotokolle)</li>
<li>Die Anzahl Ihrer Segmente wächst (dies erhöht den Overhead pro Abfrage)</li>
<li>Die Speichernutzung wächst viel schneller als Ihre tatsächlich gültigen Daten</li>
</ul>
<p><strong>Achtung!</strong> Die Verdichtung ist I/O-intensiv. Planen Sie sie in Zeiten mit geringem Datenverkehr (z. B. nachts) oder stimmen Sie die Trigger sorgfältig ab, damit sie nicht mit Produktionsabfragen konkurriert.</p>
<h3 id="TTLTime-to-Live-Automatically-Expire-Old-Vector-Data" class="common-anchor-header">TTL(Time to Live): Automatisches Auslaufen alter Vektordaten</h3><p>Für Daten, die auf natürliche Weise ablaufen, ist TTL sauberer als eine manuelle Löschung. Legen Sie eine Lebensdauer für Ihre Daten fest, und Milvus markiert sie automatisch zum Löschen, wenn sie ablaufen. Die eigentliche Bereinigung wird durch die Verdichtung durchgeführt.</p>
<p>Dies ist nützlich für:</p>
<ul>
<li>Protokolle und Sitzungsdaten - behalten Sie nur die letzten 7 oder 30 Tage</li>
<li>Zeitabhängige RAG - bevorzugt aktuelles Wissen, alte Dokumente verfallen lassen</li>
<li>Echtzeit-Empfehlungen - nur das jüngste Nutzerverhalten abrufen</li>
</ul>
<p>Zusammen verhindern Verdichtung und TTL, dass Ihr System stillschweigend Abfall ansammelt. Das ist nicht der größte Kostenhebel, aber es verhindert die Art von schleichendem Speicherwachstum, das Teams unvorbereitet trifft.</p>
<h2 id="One-More-Option-Zilliz-Cloud-Fully-Managed-Milvus" class="common-anchor-header">Eine weitere Option: Zilliz Cloud (Vollständig verwaltetes Milvus)<button data-href="#One-More-Option-Zilliz-Cloud-Fully-Managed-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Umfassende Offenlegung: <a href="https://zilliz.com/">Zilliz Cloud</a> wird von demselben Team entwickelt, das auch hinter Milvus steht.</p>
<p>Aber jetzt kommt der kontraintuitive Teil: Obwohl Milvus kostenlos und quelloffen ist, kann ein verwalteter Dienst tatsächlich weniger kosten als das Selbst-Hosten. Der Grund dafür ist einfach: Die Software ist kostenlos, aber die Cloud-Infrastruktur für den Betrieb ist es nicht, und Sie brauchen Techniker, um sie zu betreiben und zu warten. Wenn ein verwalteter Dienst die gleiche Arbeit mit weniger Maschinen und weniger Technikerstunden erledigen kann, sinkt Ihre Gesamtrechnung, selbst wenn Sie für den Dienst selbst bezahlen.</p>
<p><a href="https://zilliz.com/">Zilliz Cloud</a> ist ein vollständig verwalteter Dienst, der auf Milvus aufbaut und mit diesem API-kompatibel ist. Zwei Dinge sind für die Kosten relevant:</p>
<ul>
<li><strong>Bessere Leistung pro Knoten.</strong> Zilliz Cloud läuft auf Cardinal, unserer optimierten Suchmaschine. Basierend auf den <a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch">Ergebnissen von VectorDBBench</a> liefert sie einen 3-5x höheren Durchsatz als Open-Source Milvus und ist 10x schneller. In der Praxis bedeutet das, dass Sie für dieselbe Arbeitslast etwa ein Drittel bis ein Fünftel so viele Rechenknoten benötigen.</li>
<li><strong>Eingebaute Optimierungen.</strong> Die in diesem Leitfaden behandelten Funktionen - MMap, Tiered Storage und Indexquantisierung - sind bereits integriert und werden automatisch angepasst. Die automatische Skalierung passt die Kapazität an die tatsächliche Auslastung an, so dass Sie nicht für Spielraum bezahlen, den Sie nicht benötigen.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Howto_Cut_Vector_Database_Costsby_Upto80_A_Pract_1_5230ab94bf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Die<a href="https://zilliz.com/zilliz-migration-service">Migration</a> ist unkompliziert, da die APIs und Datenformate kompatibel sind. Zilliz bietet auch Migrations-Tools zur Unterstützung an. Für einen detaillierten Vergleich siehe: <a href="https://zilliz.com/zilliz-vs-milvus">Zilliz Cloud vs. Milvus</a></p>
<h2 id="Summary-A-Step-by-Step-Plan-to-Cut-Vector-Database-Costs" class="common-anchor-header">Zusammenfassung: Ein Schritt-für-Schritt-Plan zur Senkung der Vektordatenbankkosten<button data-href="#Summary-A-Step-by-Step-Plan-to-Cut-Vector-Database-Costs" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Wenn Sie nur eine Sache tun, dann dies: Überprüfen Sie Ihren Indextyp.</strong></p>
<p>Wenn Sie HNSW für eine kostenempfindliche Arbeitslast verwenden, wechseln Sie zu IVF_SQ8. Dies allein kann die Speicherkosten um ~70 % bei minimalem Abrufverlust senken.</p>
<p>Wenn Sie noch weiter gehen wollen, ist hier die Reihenfolge der Prioritäten:</p>
<ul>
<li><strong>Wechseln Sie Ihren Index</strong> - HNSW → IVF_SQ8 für die meisten Workloads. Der größte Knall für null Architekturänderung.</li>
<li><strong>Aktivieren Sie MMap oder Tiered Storage</strong> - Hören Sie auf, alles im Speicher zu halten. Dies ist eine Konfigurationsänderung, kein Redesign.</li>
<li><strong>Evaluieren Sie Ihre Einbettungsdimensionen</strong> - Testen Sie, ob ein kleineres Modell Ihren Genauigkeitsanforderungen entspricht. Dies erfordert eine erneute Einbettung, aber die Einsparungen summieren sich.</li>
<li><strong>Richten Sie Verdichtung und TTL ein</strong> - Verhindern Sie die stille Aufblähung von Daten, insbesondere bei häufigen Schreib-/Löschvorgängen.</li>
</ul>
<p>Zusammengenommen können diese Strategien die Kosten für Ihre Vektordatenbank um 60-80 % senken. Nicht jedes Team benötigt alle vier Strategien - fangen Sie mit der Indexänderung an, messen Sie die Auswirkungen und arbeiten Sie sich in der Liste nach unten vor.</p>
<p>Für Teams, die den operativen Aufwand reduzieren und die Kosteneffizienz verbessern möchten, ist <a href="https://zilliz.com/">Zilliz Cloud</a> (managed Milvus) eine weitere Option.</p>
<p>Wenn Sie an einer dieser Optimierungen arbeiten und sich austauschen möchten, ist die <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Milvus-Community Slack</a> ein guter Ort, um Fragen zu stellen. Sie können auch an den <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus-Sprechstunden</a> teilnehmen, um sich mit dem technischen Team über Ihr spezielles Setup zu unterhalten.</p>
