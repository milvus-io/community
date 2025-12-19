---
id: >-
  milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md
title: >-
  Hören Sie auf, für kalte Daten zu bezahlen: 80 % Kostenreduzierung mit
  On-Demand Hot-Cold Data Loading in Milvus Tiered Storage
author: Buqian Zheng
date: 2025-12-15T00:00:00.000Z
cover: assets.zilliz.com/tiered_storage_cover_38237a3bda.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Tiered Storage, vector search, hot data, cold data'
meta_title: >
  Milvus Tiered Storage: 80% Less Vector Search Cost with On-Demand Hot–Cold
  Data Loading
desc: >-
  Erfahren Sie, wie Tiered Storage in Milvus das bedarfsgesteuerte Laden von
  heißen und kalten Daten ermöglicht und so eine Kostenreduzierung von bis zu 80
  % und schnellere Ladezeiten im großen Maßstab ermöglicht.
origin: >-
  https://milvus.io/blog/milvus-tiered-storage-80-less-vector-search-cost-with-on-demand-hot–cold-data-loading.md
---
<p><strong>Wie viele von Ihnen zahlen immer noch hohe Infrastrukturrechnungen für Daten, die Ihr System kaum berührt? Seien Sie ehrlich - die meisten Teams tun das.</strong></p>
<p>Wenn Sie die Vektorsuche in der Produktion betreiben, haben Sie das wahrscheinlich schon selbst erlebt. Sie stellen große Mengen an Arbeitsspeicher und SSDs bereit, damit alles "abfragebereit" bleibt, obwohl nur ein kleiner Teil Ihres Datensatzes tatsächlich aktiv ist. Und Sie sind nicht allein. Wir haben schon viele ähnliche Fälle erlebt:</p>
<ul>
<li><p><strong>SaaS-Plattformen mit mehreren Mandanten:</strong> Hunderte von Teilnehmern, aber nur 10-15 % sind an einem bestimmten Tag aktiv. Der Rest liegt brach, belegt aber weiterhin Ressourcen.</p></li>
<li><p><strong>E-Commerce-Empfehlungssysteme:</strong> Eine Million SKUs, doch die obersten 8 % der Produkte generieren den größten Teil der Empfehlungen und des Suchverkehrs.</p></li>
<li><p><strong>KI-Suche:</strong> Riesige Archive mit Einbettungen, obwohl 90 % der Nutzeranfragen auf Artikel der letzten Woche treffen.</p></li>
</ul>
<p>Die Geschichte ist in allen Branchen gleich: <strong>Weniger als 10 % Ihrer Daten werden häufig abgefragt, aber sie verbrauchen oft 80 % Ihres Speicherplatzes und Ihrer Speicherkapazität.</strong> Jeder weiß, dass dieses Ungleichgewicht besteht - aber bis vor kurzem gab es keine saubere architektonische Lösung, um es zu beheben.</p>
<p><strong>Das ändert sich mit</strong> <a href="https://milvus.io/docs/release_notes.md">Milvus 2.6</a><strong>.</strong></p>
<p>Vor dieser Version basierte Milvus (wie die meisten Vektordatenbanken) auf <strong>einem Full-Load-Modell</strong>: Wenn Daten durchsuchbar sein sollten, mussten sie auf lokale Knoten geladen werden. Dabei spielte es keine Rolle, ob die Daten tausendmal pro Minute oder einmal im Quartal abgefragt wurden - <strong>sie mussten alle heiß bleiben.</strong> Diese Design-Entscheidung sorgte für eine vorhersehbare Leistung, bedeutete aber auch, dass Cluster überdimensioniert wurden und für Ressourcen bezahlt werden musste, die kalte Daten einfach nicht verdienten.</p>
<p><a href="https://milvus.io/docs/tiered-storage-overview.md">Tiered Storage</a> <strong>ist unsere Antwort.</strong></p>
<p>Milvus 2.6 führt eine neue Tiered-Storage-Architektur mit <strong>echtem On-Demand-Laden</strong> ein, die es dem System ermöglicht, automatisch zwischen heißen und kalten Daten zu unterscheiden:</p>
<ul>
<li><p>Heiße Segmente bleiben in der Nähe des Rechners zwischengespeichert.</p></li>
<li><p>Kalte Segmente leben kostengünstig in einem entfernten Objektspeicher</p></li>
<li><p>Daten werden <strong>nur dann</strong> auf lokale Knoten gezogen <strong>, wenn eine Abfrage sie tatsächlich benötigt</strong>.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://milvus.io/docs/v2.6.x/assets/full-load-mode-vs-tiered-storage-mode.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Dadurch verschiebt sich die Kostenstruktur von "wie viele Daten Sie haben" zu <strong>"wie viele Daten Sie tatsächlich nutzen".</strong> Und in frühen Produktionsimplementierungen führt diese einfache Umstellung zu einer <strong>Senkung der Speicher- und Arbeitsspeicherkosten um bis zu 80 %</strong>.</p>
<p>Im weiteren Verlauf dieses Beitrags werden wir die Funktionsweise von Tiered Storage erläutern, echte Leistungsergebnisse vorstellen und zeigen, wo diese Änderung die größten Auswirkungen hat.</p>
<h2 id="Why-Full-Loading-Breaks-Down-at-Scale" class="common-anchor-header">Warum Full Loading bei der Skalierung zusammenbricht<button data-href="#Why-Full-Loading-Breaks-Down-at-Scale" class="anchor-icon" translate="no">
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
    </button></h2><p>Bevor wir uns mit der Lösung befassen, lohnt es sich, einen genaueren Blick darauf zu werfen, warum der <strong>Volllastmodus</strong>, der in Milvus 2.5 und früheren Versionen verwendet wurde, bei der Skalierung von Workloads zu einem limitierenden Faktor wurde.</p>
<p>In Milvus 2.5 und früheren Versionen hat jeder QueryNode bei einer <code translate="no">Collection.load()</code> -Anfrage die gesamte Sammlung lokal zwischengespeichert, einschließlich Metadaten, Felddaten und Indizes. Diese Komponenten werden aus dem Objektspeicher heruntergeladen und entweder vollständig im Speicher oder als Memory-Mapping (mmap) auf der lokalen Festplatte abgelegt. Erst wenn <em>alle</em> diese Daten lokal verfügbar sind, wird die Sammlung als geladen und abfragebereit markiert.</p>
<p>Mit anderen Worten, die Sammlung ist erst abfragbar, wenn der vollständige Datensatz - warm oder kalt - auf dem Knoten vorhanden ist.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_5_en_3adca38b7e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Hinweis:</strong> Bei Indextypen, die Rohvektordaten einbetten, lädt Milvus nur die Indexdateien und nicht das Vektorfeld separat. Trotzdem muss der Index vollständig geladen werden, um Abfragen zu bedienen, unabhängig davon, auf wie viele der Daten tatsächlich zugegriffen wird.</p>
<p>Um zu sehen, warum dies problematisch wird, betrachten Sie ein konkretes Beispiel:</p>
<p>Angenommen, Sie haben einen mittelgroßen Vektordatensatz mit:</p>
<ul>
<li><p><strong>100 Millionen Vektoren</strong></p></li>
<li><p><strong>768 Dimensionen</strong> (BERT-Einbettungen)</p></li>
<li><p><strong>Float32-Präzision</strong> (4 Byte pro Dimension)</p></li>
<li><p>Ein <strong>HNSW-Index</strong></p></li>
</ul>
<p>In diesem Fall benötigt allein der HNSW-Index - einschließlich der eingebetteten Rohvektoren - etwa 430 GB Speicherplatz. Nach dem Hinzufügen allgemeiner skalarer Felder wie Benutzer-IDs, Zeitstempel oder Kategoriebezeichnungen übersteigt die gesamte lokale Ressourcennutzung leicht 500 GB.</p>
<p>Das bedeutet, dass das System selbst dann, wenn 80 % der Daten selten oder nie abgefragt werden, mehr als 500 GB an lokalem Speicher oder Festplatte bereitstellen und vorhalten muss, nur um die Sammlung online zu halten.</p>
<p>Für einige Arbeitslasten ist dieses Verhalten akzeptabel:</p>
<ul>
<li><p>Wenn auf fast alle Daten häufig zugegriffen wird, liefert das vollständige Laden aller Daten die geringstmögliche Abfragelatenz - zu den höchsten Kosten.</p></li>
<li><p>Wenn die Daten in heiße und warme Teilmengen unterteilt werden können, kann die Speicherzuordnung warmer Daten auf die Festplatte den Speicherdruck teilweise reduzieren.</p></li>
</ul>
<p>Bei Arbeitslasten, bei denen sich 80 % oder mehr der Daten im Long Tail befinden, werden die Nachteile des vollständigen Ladens jedoch schnell deutlich, und zwar sowohl bei der <strong>Leistung</strong> als auch bei den <strong>Kosten</strong>.</p>
<h3 id="Performance-bottlenecks" class="common-anchor-header">Engpässe bei der Leistung</h3><p>In der Praxis wirkt sich das vollständige Laden nicht nur auf die Abfrageleistung aus, sondern verlangsamt häufig auch die routinemäßigen Arbeitsabläufe:</p>
<ul>
<li><p><strong>Längere Rolling Upgrades:</strong> In großen Clustern können Rolling Upgrades Stunden oder sogar einen ganzen Tag dauern, da jeder Knoten den gesamten Datensatz neu laden muss, bevor er wieder verfügbar ist.</p></li>
<li><p><strong>Langsamere Wiederherstellung nach Ausfällen:</strong> Wenn ein QueryNode neu startet, kann er den Datenverkehr nicht bedienen, bis alle Daten neu geladen sind, was die Wiederherstellungszeit erheblich verlängert und die Auswirkungen von Knotenausfällen verstärkt.</p></li>
<li><p><strong>Langsamere Iterationen und Experimente:</strong> Das vollständige Laden verlangsamt die Entwicklungsabläufe und zwingt KI-Teams dazu, beim Testen neuer Datensätze oder Indexkonfigurationen stundenlang auf das Laden der Daten zu warten.</p></li>
</ul>
<h3 id="Cost-inefficiencies" class="common-anchor-header">Kostenineffizienzen</h3><p>Vollständiges Laden treibt auch die Infrastrukturkosten in die Höhe. Bei speicheroptimierten Mainstream-Cloud-Instanzen kostet die lokale Speicherung von 1 TB Daten beispielsweise etwa<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>**70</mn><mo separator="true">.</mo><mn>000 pro</mn><mi>Jahr</mi><mo separator="true">∗∗,</mo><mi>basierend auf</mi><mi>konservativer</mi><mi>Preisgestaltung</mi><mo stretchy="false">(</mo><mi>AWSr6i</mi><mo>:</mo></mrow></semantics></math></span></span><mtext> </mtext><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">70.000 pro Jahr**, basierend auf konservativer Preisgestaltung (AWS r6i: ~</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8389em;vertical-align:-0.1944em;"></span><span class="mord">70</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord">000</span><span class="mord mathnormal" style="margin-right:0.02778em;">pro</span><span class="mord">Jahr</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∗</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mpunct"> ∗,</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">basierend</span><span class="mord mathnormal">auf konservativer Preisgestaltung</span><span class="mopen">(</span><span class="mord mathnormal">AWSr6i</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span></span>:<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace nobreak"> </span> 5.74 / GB / Monat; GCP n4-highmem: ~5</span></span></span><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>,</mn><mi>68/GB/Monat</mi><mo separator="true">;</mo><mi>AzureE-series</mi><mo>:</mo></mrow></semantics></math></span></span><mtext> </mtext> 5<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">,68 / GB / Monat; Azure E-series: ~</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span></span></span></span>5<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">,</span><span class="mord mathnormal">68/GB/Monat</span><span class="mpunct">;</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal" style="margin-right:0.05764em;">AzureE</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6595em;"></span><span class="mord mathnormal">series</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span></span>:<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace nobreak"> </span> 5,67 / GB / Monat).</span></span></span></p>
<p>Betrachten wir nun ein realistischeres Zugriffsmuster, bei dem 80 % dieser Daten "kalt" sind und stattdessen in einem Objektspeicher gespeichert werden könnten (zu etwa 0,023 $ / GB / Monat):</p>
<ul>
<li><p>200 GB heiße Daten × $5,68</p></li>
<li><p>800 GB kalte Daten × $0,023</p></li>
</ul>
<p>Jährliche Kosten: (200×5,68+800×0,023)×12≈$14<strong>.000</strong></p>
<p>Das bedeutet eine <strong>Senkung</strong> der Gesamtspeicherkosten <strong>um 80 %</strong>, ohne Einbußen bei der Leistung in den Bereichen, auf die es wirklich ankommt.</p>
<h2 id="What-Is-the-Tiered-Storage-and-How-Does-It-Work" class="common-anchor-header">Was ist der Tiered Storage und wie funktioniert er?<button data-href="#What-Is-the-Tiered-Storage-and-How-Does-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Um diesen Zielkonflikt zu beseitigen, wurde mit Milvus 2.6 <strong>Tiered Storage</strong> eingeführt, das ein Gleichgewicht zwischen Leistung und Kosten herstellt, indem der lokale Speicher als Cache und nicht als Container für den gesamten Datensatz behandelt wird.</p>
<p>In diesem Modell laden die QueryNodes beim Start nur leichte Metadaten. Felddaten und Indizes werden bei Bedarf aus dem entfernten Objektspeicher abgerufen, wenn eine Abfrage sie benötigt, und lokal zwischengespeichert, wenn häufig auf sie zugegriffen wird. Inaktive Daten können verdrängt werden, um Speicherplatz freizugeben.</p>
<p>Dadurch bleiben heiße Daten für Abfragen mit geringer Latenz in der Nähe der Berechnungsschicht, während kalte Daten im Objektspeicher verbleiben, bis sie benötigt werden. Dies verkürzt die Ladezeit, verbessert die Ressourceneffizienz und ermöglicht QueryNodes die Abfrage von Datensätzen, die weit größer sind als ihre lokale Speicher- oder Festplattenkapazität.</p>
<p>In der Praxis funktioniert Tiered Storage wie folgt:</p>
<ul>
<li><p><strong>Halten Sie heiße Daten lokal:</strong> Etwa 20 % der Daten, auf die häufig zugegriffen wird, verbleiben auf den lokalen Knoten, wodurch eine geringe Latenz für die 80 % der wichtigsten Abfragen gewährleistet wird.</p></li>
<li><p><strong>Laden Sie kalte Daten bei Bedarf:</strong> Die verbleibenden 80 % der Daten, auf die nur selten zugegriffen wird, werden nur bei Bedarf abgerufen, wodurch ein Großteil der lokalen Speicher- und Festplattenressourcen frei wird.</p></li>
<li><p><strong>Dynamische Anpassung mit LRU-basierter Auslagerung:</strong> Milvus verwendet eine LRU (Least Recently Used) Verdrängungsstrategie, um kontinuierlich anzupassen, welche Daten als heiß oder kalt eingestuft werden. Inaktive Daten werden automatisch verdrängt, um Platz für neu zugreifende Daten zu schaffen.</p></li>
</ul>
<p>Mit diesem Design ist Milvus nicht mehr an die feste Kapazität des lokalen Speichers und der Festplatte gebunden. Stattdessen fungieren die lokalen Ressourcen als dynamisch verwalteter Cache, in dem kontinuierlich Platz von inaktiven Daten zurückgewonnen und aktiven Arbeitslasten neu zugewiesen wird.</p>
<p>Dieses Verhalten wird durch drei technische Kernmechanismen ermöglicht:</p>
<h3 id="1-Lazy-Load" class="common-anchor-header">1. Lazy Load</h3><p>Bei der Initialisierung lädt Milvus nur minimale Metadaten auf Segmentebene, so dass die Sammlungen fast sofort nach dem Start abfragbar werden. Felddaten und Indexdateien verbleiben im entfernten Speicher und werden bei Bedarf während der Abfrageausführung abgerufen, wodurch der lokale Speicher- und Festplattenverbrauch niedrig gehalten wird.</p>
<p><strong>Wie das Laden von Sammlungen in Milvus 2.5 funktioniert</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_5_en_aa89de3570.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Wie das träge Laden in Milvus 2.6 und später funktioniert</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_6_en_049fa45540.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Die während der Initialisierung geladenen Metadaten fallen in vier Hauptkategorien:</p>
<ul>
<li><p><strong>Segmentstatistiken</strong> (grundlegende Informationen wie Zeilenzahl, Segmentgröße und Schema-Metadaten)</p></li>
<li><p><strong>Zeitstempel</strong> (werden zur Unterstützung von Zeitreiseabfragen verwendet)</p></li>
<li><p><strong>Einfüge- und Löschdatensätze</strong> (erforderlich, um die Datenkonsistenz während der Ausführung von Abfragen aufrechtzuerhalten)</p></li>
<li><p><strong>Bloom-Filter</strong> (für eine schnelle Vorfilterung zur schnellen Eliminierung irrelevanter Segmente)</p></li>
</ul>
<h3 id="2-Partial-Load" class="common-anchor-header">2. Partielles Laden</h3><p>Während Lazy Loading steuert, <em>wann</em> Daten geladen werden, steuert Partial Loading, <em>wie viele</em> Daten geladen werden. Sobald Abfragen oder Suchvorgänge beginnen, führt der QueryNode ein partielles Laden durch, wobei er nur die erforderlichen Datenchunks oder Indexdateien aus dem Objektspeicher abruft.</p>
<p><strong>Vektor-Indizes: Mieterorientiertes Laden</strong></p>
<p>Eine der wichtigsten Funktionen, die in Milvus 2.6+ eingeführt wurden, ist das mandantenfähige Laden von Vektorindizes, das speziell für mandantenfähige Arbeitslasten entwickelt wurde.</p>
<p>Wenn eine Abfrage auf Daten eines einzelnen Mandanten zugreift, lädt Milvus nur den Teil des Vektorindexes, der zu diesem Mandanten gehört, und überspringt die Indexdaten für alle anderen Mandanten. Dadurch bleiben die lokalen Ressourcen auf die aktiven Mandanten konzentriert.</p>
<p>Dieses Design bietet mehrere Vorteile:</p>
<ul>
<li><p>Vektorindizes für inaktive Tenants verbrauchen keinen lokalen Speicher oder Festplatte</p></li>
<li><p>Indexdaten für aktive Tenants bleiben im Cache für einen Zugriff mit geringer Latenz</p></li>
<li><p>Eine LRU-Räumungsrichtlinie auf Mandantenebene gewährleistet eine faire Cache-Nutzung über alle Mandanten hinweg.</p></li>
</ul>
<p><strong>Skalare Felder: Partielles Laden auf Spaltenebene</strong></p>
<p>Partielles Laden gilt auch für <strong>skalare Felder</strong>, wodurch Milvus nur die Spalten laden kann, auf die eine Abfrage explizit verweist.</p>
<p>Stellen Sie sich eine Sammlung mit <strong>50 Schemafeldern</strong> vor, wie <code translate="no">id</code>, <code translate="no">vector</code>, <code translate="no">title</code>, <code translate="no">description</code>, <code translate="no">category</code>, <code translate="no">price</code>, <code translate="no">stock</code> und <code translate="no">tags</code>, und Sie müssen nur drei Felder zurückgeben -<code translate="no">id</code>, <code translate="no">title</code> und <code translate="no">price</code>.</p>
<ul>
<li><p>In <strong>Milvus 2.5</strong> werden alle 50 skalaren Felder unabhängig von den Abfrageanforderungen geladen.</p></li>
<li><p>In <strong>Milvus 2.6+</strong> werden nur die drei angeforderten Felder geladen. Die restlichen 47 Felder bleiben ungeladen und werden nur dann abgerufen, wenn später auf sie zugegriffen wird.</p></li>
</ul>
<p>Die Ressourceneinsparungen können erheblich sein. Wenn jedes skalare Feld 20 GB belegt:</p>
<ul>
<li><p>Das Laden aller Felder erfordert <strong>1.000 GB</strong> (50 × 20 GB)</p></li>
<li><p>Das Laden nur der drei benötigten Felder benötigt <strong>60 GB</strong></p></li>
</ul>
<p>Dies entspricht einer <strong>Reduzierung des</strong> Ladens skalarer Daten <strong>um 94 %</strong>, ohne die Korrektheit der Abfrage oder die Ergebnisse zu beeinträchtigen.</p>
<p><strong>Hinweis:</strong> Tenant-aware partielles Laden für skalare Felder und Vektorindizes wird offiziell in einer der nächsten Versionen eingeführt. Sobald diese verfügbar ist, wird sie die Ladelatenz weiter reduzieren und die Leistung von Cold-Queries in großen mandantenfähigen Implementierungen verbessern.</p>
<h3 id="3-LRU-Based-Cache-Eviction" class="common-anchor-header">3. LRU-basierte Cache-Evakuierung</h3><p>Durch Lazy Loading und Partial Loading wird die Menge der Daten, die in den lokalen Speicher und auf die Festplatte gebracht werden, erheblich reduziert. In Systemen, die lange laufen, wächst der Cache jedoch weiter an, da im Laufe der Zeit auf neue Daten zugegriffen wird. Wenn die lokale Kapazität erreicht ist, tritt die LRU-basierte Cache-Evakuierung in Kraft.</p>
<p>Die LRU-Auslagerung (Least Recently Used) folgt einer einfachen Regel: Daten, auf die in letzter Zeit nicht zugegriffen wurde, werden zuerst ausgelagert. Dadurch wird lokaler Speicherplatz für neu aufgerufene Daten frei, während häufig verwendete Daten im Cache verbleiben.</p>
<h2 id="Performance-Evaluation-Tiered-Storage-vs-Full-Loading" class="common-anchor-header">Leistungsbewertung: Tiered Storage vs. Full Loading<button data-href="#Performance-Evaluation-Tiered-Storage-vs-Full-Loading" class="anchor-icon" translate="no">
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
    </button></h2><p>Um die Auswirkungen von <strong>Tiered Storage</strong> in der Praxis zu bewerten, haben wir eine Testumgebung eingerichtet, die den Arbeitslasten in der Produktion sehr ähnlich ist. Wir verglichen Milvus mit und ohne Tiered Storage in fünf Dimensionen: Ladezeit, Ressourcenverbrauch, Abfrageleistung, effektive Kapazität und Kosteneffizienz.</p>
<h3 id="Experimental-setup" class="common-anchor-header">Experimenteller Aufbau</h3><p><strong>Datensatz</strong></p>
<ul>
<li><p>100 Millionen Vektoren mit 768 Dimensionen (BERT-Einbettungen)</p></li>
<li><p>Vektorindexgröße: ca. 430 GB</p></li>
<li><p>10 skalare Felder, einschließlich ID, Zeitstempel und Kategorie</p></li>
</ul>
<p><strong>Hardware-Konfiguration</strong></p>
<ul>
<li><p>1 QueryNode mit 4 vCPUs, 32 GB Speicher und 1 TB NVMe SSD</p></li>
<li><p>10 Gbps Netzwerk</p></li>
<li><p>MinIO-Objektspeichercluster als entferntes Speicher-Backend</p></li>
</ul>
<p><strong>Zugriffsmuster</strong></p>
<p>Abfragen folgen einer realistischen Hot-Cold-Zugriffsverteilung:</p>
<ul>
<li><p>80% der Abfragen zielen auf Daten der letzten 30 Tage (≈20% der Gesamtdaten)</p></li>
<li><p>15% zielen auf Daten aus 30-90 Tagen (≈30% der Gesamtdaten)</p></li>
<li><p>5% zielen auf Daten, die älter als 90 Tage sind (≈50% der Gesamtdaten)</p></li>
</ul>
<h3 id="Key-results" class="common-anchor-header">Wichtigste Ergebnisse</h3><p><strong>1. 33× schnellere Ladezeit</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Stufe</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+ (gestaffelter Speicher)</strong></th><th style="text-align:center"><strong>Beschleunigung</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Herunterladen von Daten</td><td style="text-align:center">22 Minuten</td><td style="text-align:center">28 Sekunden</td><td style="text-align:center">47×</td></tr>
<tr><td style="text-align:center">Laden des Index</td><td style="text-align:center">3 Minuten</td><td style="text-align:center">17 Sekunden</td><td style="text-align:center">10.5×</td></tr>
<tr><td style="text-align:center"><strong>Insgesamt</strong></td><td style="text-align:center"><strong>25 Minuten</strong></td><td style="text-align:center"><strong>45 Sekunden</strong></td><td style="text-align:center"><strong>33×</strong></td></tr>
</tbody>
</table>
<p>In Milvus 2.5 dauerte das Laden der Sammlung <strong>25 Minuten</strong>. Mit Tiered Storage in Milvus 2.6+ wird dieselbe Arbeitslast in nur <strong>45 Sekunden</strong> abgeschlossen, was eine deutliche Verbesserung der Ladeeffizienz darstellt.</p>
<p><strong>2. 80%ige Reduzierung des lokalen Ressourcenverbrauchs</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Stufe</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+ (Tiered Storage)</strong></th><th style="text-align:center"><strong>Reduktion</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Nach Belastung</td><td style="text-align:center">430 GB</td><td style="text-align:center">12 GB</td><td style="text-align:center">-97%</td></tr>
<tr><td style="text-align:center">Nach 1 Stunde</td><td style="text-align:center">430 GB</td><td style="text-align:center">68 GB</td><td style="text-align:center">-84%</td></tr>
<tr><td style="text-align:center">Nach 24 Stunden</td><td style="text-align:center">430 GB</td><td style="text-align:center">85 GB</td><td style="text-align:center">-80%</td></tr>
<tr><td style="text-align:center">Ständiger Zustand</td><td style="text-align:center">430 GB</td><td style="text-align:center">85-95 GB</td><td style="text-align:center">~80%</td></tr>
</tbody>
</table>
<p>In Milvus 2.5 bleibt die lokale Ressourcennutzung konstant bei <strong>430 GB</strong>, unabhängig von Arbeitslast oder Laufzeit. Im Gegensatz dazu startet Milvus 2.6+ mit nur <strong>12 GB</strong> direkt nach dem Laden.</p>
<p>Während der Ausführung von Abfragen werden häufig abgerufene Daten lokal zwischengespeichert, und die Ressourcennutzung steigt allmählich an. Nach etwa 24 Stunden stabilisiert sich das System bei <strong>85-95 GB</strong>, was den Arbeitsbestand an heißen Daten widerspiegelt. Langfristig führt dies zu einer <strong> Verringerung des</strong> lokalen Arbeitsspeichers und der Festplattennutzung <strong> um ca. 80 %</strong>, ohne die Verfügbarkeit der Abfragen zu beeinträchtigen.</p>
<p><strong>3. Nahezu keine Auswirkungen auf die Hot-Data-Leistung</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Abfragetyp</strong></th><th style="text-align:center"><strong>Milvus 2.5 P99 Latenzzeit</strong></th><th style="text-align:center"><strong>Milvus 2.6+ P99-Latenzzeit</strong></th><th style="text-align:center"><strong>Änderung</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Hot-Data-Abfragen</td><td style="text-align:center">15 ms</td><td style="text-align:center">16 ms</td><td style="text-align:center">+6.7%</td></tr>
<tr><td style="text-align:center">Warme Datenabfragen</td><td style="text-align:center">15 ms</td><td style="text-align:center">28 ms</td><td style="text-align:center">+86%</td></tr>
<tr><td style="text-align:center">Kalte Datenabfragen (erster Zugriff)</td><td style="text-align:center">15 ms</td><td style="text-align:center">120 ms</td><td style="text-align:center">+700%</td></tr>
<tr><td style="text-align:center">Abfragen von kalten Daten (im Cache)</td><td style="text-align:center">15 ms</td><td style="text-align:center">18 ms</td><td style="text-align:center">+20%</td></tr>
</tbody>
</table>
<p>Bei Hot Data, die etwa 80 % aller Abfragen ausmachen, erhöht sich die P99-Latenz nur um 6,7 %, was in der Produktion praktisch keine spürbaren Auswirkungen hat.</p>
<p>Abfragen von kalten Daten weisen aufgrund des bedarfsgesteuerten Ladens aus dem Objektspeicher beim ersten Zugriff eine höhere Latenz auf. Nach dem Zwischenspeichern steigt die Latenz jedoch nur noch um 20 %. Angesichts der geringen Zugriffshäufigkeit von Cold Data ist dieser Kompromiss für die meisten realen Arbeitslasten akzeptabel.</p>
<p><strong>4. 4,3× größere effektive Kapazität</strong></p>
<p>Bei gleichem Hardware-Budget - acht Server mit je 64 GB Speicher (insgesamt 512 GB) - kann Milvus 2.5 maximal 512 GB Daten laden, was etwa 136 Millionen Vektoren entspricht.</p>
<p>Mit der in Milvus 2.6+ aktivierten Tiered Storage-Funktion kann dieselbe Hardware 2,2 TB an Daten oder etwa 590 Millionen Vektoren unterstützen. Dies stellt eine 4,3-fache Steigerung der effektiven Kapazität dar und ermöglicht es, wesentlich größere Datensätze zu verarbeiten, ohne den lokalen Speicher zu erweitern.</p>
<p><strong>5. 80,1 % Kostenreduzierung</strong></p>
<p>Am Beispiel eines 2-TB-Vektordatensatzes in einer AWS-Umgebung und unter der Annahme, dass 20 % der Daten heiß sind (400 GB), ergibt sich der folgende Kostenvergleich:</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Artikel</strong></th><th style="text-align:center"><strong>Milvus 2.5</strong></th><th style="text-align:center"><strong>Milvus 2.6+ (gestaffelter Speicher)</strong></th><th style="text-align:center"><strong>Einsparungen</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Monatliche Kosten</td><td style="text-align:center">$11,802</td><td style="text-align:center">$2,343</td><td style="text-align:center">$9,459</td></tr>
<tr><td style="text-align:center">Jährliche Kosten</td><td style="text-align:center">$141,624</td><td style="text-align:center">$28,116</td><td style="text-align:center">$113,508</td></tr>
<tr><td style="text-align:center">Ersparnis</td><td style="text-align:center">-</td><td style="text-align:center">-</td><td style="text-align:center"><strong>80.1%</strong></td></tr>
</tbody>
</table>
<h3 id="Benchmark-Summary" class="common-anchor-header">Benchmark-Zusammenfassung</h3><p>Über alle Tests hinweg liefert Tiered Storage konsistente und messbare Verbesserungen:</p>
<ul>
<li><p><strong>33× schnellere Ladezeiten:</strong> Die Ladezeit der Sammlung wurde von <strong>25 Minuten auf 45 Sekunden</strong> reduziert.</p></li>
<li><p><strong>80% geringere lokale Ressourcennutzung:</strong> Im Dauerbetrieb sinken Arbeitsspeicher und lokale Festplattennutzung um etwa <strong>80 %</strong>.</p></li>
<li><p><strong>Nahezu keine Auswirkungen auf die Leistung bei heißen Daten:</strong> Die P99-Latenz für heiße Daten erhöht sich um <strong>weniger als 10 %</strong>, so dass die Abfrageleistung mit niedriger Latenz erhalten bleibt.</p></li>
<li><p><strong>Kontrollierte Latenz für kalte Daten:</strong> Bei kalten Daten entsteht beim ersten Zugriff eine höhere Latenz, die jedoch angesichts der geringen Zugriffshäufigkeit akzeptabel ist.</p></li>
<li><p><strong>4,3× höhere effektive Kapazität:</strong> Dieselbe Hardware kann ohne zusätzlichen Speicher <strong>4-5x mehr Daten</strong> verarbeiten.</p></li>
<li><p><strong>Über 80 % Kostenreduzierung:</strong> Die jährlichen Infrastrukturkosten werden um <strong>mehr als 80 %</strong> gesenkt.</p></li>
</ul>
<h2 id="When-to-Use-Tiered-Storage-in-Milvus" class="common-anchor-header">Wann wird Tiered Storage in Milvus verwendet?<button data-href="#When-to-Use-Tiered-Storage-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Auf der Grundlage von Benchmark-Ergebnissen und realen Produktionsfällen haben wir Tiered-Storage-Anwendungsfälle in drei Kategorien eingeteilt, um Ihnen die Entscheidung zu erleichtern, ob es für Ihre Arbeitslast geeignet ist.</p>
<h3 id="Best-Fit-Use-Cases" class="common-anchor-header">Best-Fit-Anwendungsfälle</h3><p><strong>1. Multimandanten-Vektorsuchplattformen</strong></p>
<ul>
<li><p><strong>Merkmale:</strong> Große Anzahl von Mandanten mit sehr ungleichmäßiger Aktivität; Vektorsuche ist die Hauptarbeitslast.</p></li>
<li><p><strong>Zugriffsmuster:</strong> Weniger als 20 % der Mieter generieren mehr als 80 % der Vektorsuchanfragen.</p></li>
<li><p><strong>Erwartete Vorteile:</strong> 70-80%ige Kostensenkung; 3-5fache Kapazitätserweiterung.</p></li>
</ul>
<p><strong>2. Empfehlungssysteme für den elektronischen Handel (Vektorsuchlasten)</strong></p>
<ul>
<li><p><strong>Merkmale:</strong> Starke Beliebtheitsskala zwischen Top-Produkten und dem Long Tail.</p></li>
<li><p><strong>Zugriffsmuster:</strong> Die obersten 10% der Produkte machen ~80% des Vektorsuchverkehrs aus.</p></li>
<li><p><strong>Erwartete Vorteile:</strong> Kein Bedarf an zusätzlicher Kapazität bei Spitzenereignissen; 60-70 % Kostenreduzierung</p></li>
</ul>
<p><strong>3. Große Datensätze mit klarer Heiß-Kalt-Trennung (vektordominant)</strong></p>
<ul>
<li><p><strong>Merkmale:</strong> TB-große oder größere Datensätze, bei denen der Zugriff stark auf aktuelle Daten ausgerichtet ist.</p></li>
<li><p><strong>Zugriffsmuster:</strong> Eine klassische 80/20-Verteilung: 20 % der Daten dienen 80 % der Abfragen</p></li>
<li><p><strong>Erwartete Vorteile:</strong> 75-85 % Kostenreduzierung</p></li>
</ul>
<h3 id="Good-Fit-Use-Cases" class="common-anchor-header">Gut geeignete Anwendungsfälle</h3><p><strong>1. Kostenempfindliche Arbeitslasten</strong></p>
<ul>
<li><p><strong>Merkmale:</strong> Knappe Budgets mit einer gewissen Toleranz für geringfügige Leistungsabstriche.</p></li>
<li><p><strong>Zugriffsmuster:</strong> Vektorielle Abfragen sind relativ konzentriert.</p></li>
<li><p><strong>Erwartete Vorteile:</strong> 50-70 % Kostenreduzierung; bei kalten Daten kann beim ersten Zugriff eine Latenz von ~500 ms auftreten, die anhand der SLA-Anforderungen bewertet werden sollte.</p></li>
</ul>
<p><strong>2. Historische Datenspeicherung und Archivierungssuche</strong></p>
<ul>
<li><p><strong>Merkmale:</strong> Große Mengen an historischen Vektoren mit sehr geringer Abfragehäufigkeit.</p></li>
<li><p><strong>Zugriffsmuster:</strong> Etwa 90 % der Abfragen zielen auf aktuelle Daten ab.</p></li>
<li><p><strong>Erwartete Vorteile:</strong> Beibehaltung vollständiger historischer Datensätze; Vorhersehbarkeit und Kontrolle der Infrastrukturkosten</p></li>
</ul>
<h3 id="Poor-Fit-Use-Cases" class="common-anchor-header">Schlecht geeignete Anwendungsfälle</h3><p><strong>1. Gleichmäßig heiße Daten-Workloads</strong></p>
<ul>
<li><p><strong>Merkmale:</strong> Auf alle Daten wird mit ähnlicher Häufigkeit zugegriffen, ohne klare Unterscheidung zwischen heiß und kalt.</p></li>
<li><p><strong>Warum ungeeignet:</strong> Begrenzter Cache-Nutzen; zusätzliche Systemkomplexität ohne nennenswerte Vorteile</p></li>
</ul>
<p><strong>2. Workloads mit extrem niedriger Latenz</strong></p>
<ul>
<li><p><strong>Merkmale:</strong> Extrem latenzempfindliche Systeme, z. B. Finanzhandel oder Bieterverfahren in Echtzeit</p></li>
<li><p><strong>Warum ungeeignet:</strong> Selbst kleine Latenzschwankungen sind inakzeptabel; Volllast bietet besser vorhersehbare Leistung</p></li>
</ul>
<h2 id="Quick-Start-Try-Tiered-Storage-in-Milvus-26+" class="common-anchor-header">Schnellstart: Testen Sie Tiered Storage in Milvus 2.6+<button data-href="#Quick-Start-Try-Tiered-Storage-in-Milvus-26+" class="anchor-icon" translate="no">
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
    </button></h2><pre><code translate="no"><span class="hljs-comment"># Download Milvus 2.6.1+</span>
$ wget https://github.com/milvus-io/milvus/releases/latest
<span class="hljs-comment"># Configure Tiered Storage</span>
$ vi milvus.yaml
queryNode.segcore.tieredStorage:
  warmup:
    scalarField: <span class="hljs-built_in">disable</span>
    scalarIndex: <span class="hljs-built_in">disable</span>
    vectorField: <span class="hljs-built_in">disable</span>
    vectorIndex: <span class="hljs-built_in">disable</span>
  evictionEnabled: <span class="hljs-literal">true</span>
<span class="hljs-comment"># Launch Milvus</span>
$ docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<h2 id="Conclusion" class="common-anchor-header">Schlussfolgerung:<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Tiered Storage in Milvus 2.6 behebt eine häufige Diskrepanz zwischen der Art und Weise, wie Vektordaten gespeichert werden und wie auf sie tatsächlich zugegriffen wird. In den meisten Produktionssystemen wird nur ein kleiner Teil der Daten häufig abgefragt, doch die traditionellen Lademodelle behandeln alle Daten als gleich heiß. Durch die Umstellung auf bedarfsgesteuertes Laden und die Verwaltung des lokalen Speichers und der Festplatte als Cache passt Milvus den Ressourcenverbrauch an das tatsächliche Abfrageverhalten an und nicht an Worst-Case-Annahmen.</p>
<p>Mit diesem Ansatz können Systeme auf größere Datensätze skaliert werden, ohne dass die lokalen Ressourcen proportional ansteigen, während die Leistung bei heißen Abfragen weitgehend unverändert bleibt. Kalte Daten bleiben bei Bedarf zugänglich, mit vorhersehbaren und begrenzten Latenzzeiten, so dass der Kompromiss eindeutig und kontrollierbar ist. Da die Vektorsuche immer mehr in kostensensitive, mandantenfähige und langlaufende Produktionsumgebungen vordringt, bietet Tiered Storage eine praktische Grundlage für einen effizienten Betrieb in großem Maßstab.</p>
<p>Weitere Informationen über Tiered Storage finden Sie in der unten stehenden Dokumentation:</p>
<ul>
<li><a href="https://milvus.io/docs/tiered-storage-overview.md">Tiered Storage | Milvus-Dokumentation</a></li>
</ul>
<p>Haben Sie Fragen oder möchten Sie einen tieferen Einblick in eine Funktion des neuesten Milvus? Treten Sie unserem<a href="https://discord.com/invite/8uyFbECzPX"> Discord-Kanal</a> bei oder stellen Sie Fragen auf<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Sie können auch eine 20-minütige Einzelsitzung buchen, um Einblicke, Anleitung und Antworten auf Ihre Fragen über die<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> zu erhalten.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Erfahren Sie mehr über die Funktionen von Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Einführung in Milvus 2.6: Erschwingliche Vektorsuche im Milliardenmaßstab</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Einführung in die Einbettungsfunktion: Wie Milvus 2.6 die Vektorisierung und semantische Suche rationalisiert</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">JSON Shredding in Milvus: 88,9x schnellere JSON-Filterung mit Flexibilität</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Echte Suche auf Entity-Ebene ermöglichen: Neue Array-of-Structs und MAX_SIM-Fähigkeiten in Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Zusammenführung von Geofilterung und Vektorsuche mit Geometriefeldern und RTREE in Milvus 2.6</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">Einführung von AISAQ in Milvus: Milliardenschwere Vektorsuche ist jetzt 3.200x billiger im Speicher</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">Optimierung von NVIDIA CAGRA in Milvus: Ein hybrider GPU-CPU-Ansatz für schnellere Indizierung und günstigere Abfragen</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH in Milvus: Die Geheimwaffe zur Bekämpfung von Duplikaten in LLM-Trainingsdaten </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Vektorkomprimierung auf die Spitze getrieben: Wie Milvus mit RaBitQ 3× mehr Abfragen bedient</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Benchmarks lügen - Vektor-DBs verdienen einen echten Test </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Wir haben Kafka/Pulsar durch einen Woodpecker für Milvus ersetzt</a></p></li>
</ul>
