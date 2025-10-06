---
id: how-to-debug-slow-requests-in-milvus.md
title: Wie man langsame Suchanfragen in Milvus behebt
author: Jael Gu
date: 2025-10-02T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Oct_2_2025_10_52_33_AM_min_fdb227d8c6.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database, slow requests, debug Milvus'
meta_title: |
  How to Debug Slow Search Requests in Milvus
desc: >-
  In diesem Beitrag erfahren Sie, wie Sie langsame Anfragen in Milvus einordnen
  können und welche praktischen Schritte Sie unternehmen können, um die
  Latenzzeit vorhersehbar, stabil und konstant niedrig zu halten.
origin: 'https://milvus.io/blog/how-to-debug-slow-requests-in-milvus.md'
---
<p>Die Leistung ist das Herzstück von Milvus. Unter normalen Bedingungen wird eine Suchanfrage in Milvus in nur wenigen Millisekunden abgeschlossen. Aber was passiert, wenn Ihr Cluster langsamer wird - wenn sich die Suchlatenz stattdessen auf ganze Sekunden ausdehnt?</p>
<p>Langsame Suchvorgänge kommen nicht oft vor, aber sie können in großem Umfang oder bei komplexen Workloads auftreten. Und wenn dies der Fall ist, sind sie von Bedeutung: Sie stören die Benutzererfahrung, beeinträchtigen die Anwendungsleistung und offenbaren oft versteckte Ineffizienzen in Ihrer Einrichtung.</p>
<p>In diesem Beitrag zeigen wir Ihnen, wie Sie langsame Anfragen in Milvus einordnen und welche praktischen Schritte Sie unternehmen können, um die Latenzzeit vorhersehbar, stabil und konstant niedrig zu halten.</p>
<h2 id="Identifying-Slow-Searches" class="common-anchor-header">Identifizierung langsamer Suchanfragen<button data-href="#Identifying-Slow-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Diagnose einer langsamen Anfrage beginnt mit zwei Fragen: <strong>Wie oft tritt sie auf, und wohin geht die Zeit?</strong> Milvus liefert Ihnen beide Antworten anhand von Metriken und Protokollen.</p>
<h3 id="Milvus-Metrics" class="common-anchor-header">Milvus-Metriken</h3><p>Milvus exportiert detaillierte Metriken, die Sie in Grafana Dashboards überwachen können.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_2_64a5881bf2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_3_b7b8b369ec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Zu den wichtigsten Panels gehören:</p>
<ul>
<li><p><strong>Service Quality → Slow Query</strong>: Markiert jede Anfrage, die proxy.slowQuerySpanInSeconds überschreitet (Standard: 5s). Diese werden auch in Prometheus markiert.</p></li>
<li><p><strong>Servicequalität → Suchlatenz</strong>: Zeigt die Gesamtverteilung der Latenz an. Wenn dies normal aussieht, aber Endbenutzer trotzdem Verzögerungen feststellen, liegt das Problem wahrscheinlich außerhalb von Milvus - im Netzwerk oder in der Anwendungsschicht.</p></li>
<li><p><strong>Abfrageknoten → Suchlatenz nach Phase</strong>: Unterteilt die Latenz in Warteschlangen-, Abfrage- und Reduzierungsphasen. Für eine genauere Zuordnung zeigen Panels wie <em>Scalar</em> <em>Filter Latency</em>, <em>Vector Search Latency</em> und <em>Wait tSafe Latency</em>, welche Phase dominiert.</p></li>
</ul>
<h3 id="Milvus-Logs" class="common-anchor-header">Milvus-Protokolle</h3><p>Milvus protokolliert auch jede Anfrage, die länger als eine Sekunde dauert, und versieht sie mit Markierungen wie [Search slow]. Diese Protokolle zeigen, <em>welche</em> Abfragen langsam sind und ergänzen die Erkenntnisse aus den Metriken <em>.</em> Als Faustregel gilt:</p>
<ul>
<li><p><strong>&lt; 30 ms</strong> → gesunde Suchlatenz in den meisten Szenarien</p></li>
<li><p><strong>&gt; 100 ms</strong> → eine Untersuchung wert</p></li>
<li><p><strong>&gt; 1 s</strong> → definitiv langsam und erfordert Aufmerksamkeit</p></li>
</ul>
<p>Beispielprotokoll:</p>
<pre><code translate="no">[<span class="hljs-number">2025</span>/<span class="hljs-number">08</span>/<span class="hljs-number">23</span> <span class="hljs-number">19</span>:<span class="hljs-number">22</span>:<span class="hljs-number">19.900</span> +<span class="hljs-number">00</span>:<span class="hljs-number">00</span>] [INFO] [proxy/impl.<span class="hljs-keyword">go</span>:<span class="hljs-number">3141</span>] [<span class="hljs-string">&quot;Search slow&quot;</span>] [traceID=<span class="hljs-number">9100</span>b3092108604716f1472e4c7d54e4] [role=proxy] [db=<span class="hljs-keyword">default</span>] [collection=my_repos] [partitions=<span class="hljs-string">&quot;[]&quot;</span>] [dsl=<span class="hljs-string">&quot;user == \&quot;milvus-io\&quot; &amp;&amp; repo == \&quot;proxy.slowQuerySpanInSeconds\&quot;&quot;</span>] [<span class="hljs-built_in">len</span>(PlaceholderGroup)=<span class="hljs-number">8204</span>] [OutputFields=<span class="hljs-string">&quot;[user,repo,path,descripion]&quot;</span>] [search_params=<span class="hljs-string">&quot;[{\&quot;key\&quot;:\&quot;topk\&quot;,\&quot;value\&quot;:\&quot;10\&quot;},{\&quot;key\&quot;:\&quot;metric_type\&quot;,\&quot;value\&quot;:\&quot;COSINE\&quot;},{\&quot;key\&quot;:\&quot;anns_field\&quot;,\&quot;value\&quot;:\&quot;vector\&quot;},{\&quot;key\&quot;:\&quot;params\&quot;,\&quot;value\&quot;:\&quot;{\\\&quot;nprobe\\\&quot;:256,\\\&quot;metric_type\\\&quot;:\\\&quot;COSINE\\\&quot;}\&quot;}]&quot;</span>] [ConsistencyLevel=Strong] [useDefaultConsistency=<span class="hljs-literal">true</span>] [guarantee_timestamp=<span class="hljs-number">460318735832711168</span>] [nq=<span class="hljs-number">1</span>] [duration=<span class="hljs-number">5</span>m12<span class="hljs-number">.002784545</span>s] [durationPerNq=<span class="hljs-number">5</span>m12<span class="hljs-number">.002784545</span>s]
<button class="copy-code-btn"></button></code></pre>
<p>Kurz gesagt, <strong>Metriken sagen Ihnen, wohin die Zeit geht; Protokolle sagen Ihnen, welche Abfragen getroffen werden.</strong></p>
<h2 id="Analyzing-Root-Cause" class="common-anchor-header">Analyse der Grundursache<button data-href="#Analyzing-Root-Cause" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Heavy-Workload" class="common-anchor-header">Hohe Arbeitslast</h3><p>Eine häufige Ursache für langsame Anfragen ist eine übermäßige Arbeitslast. Wenn eine Anfrage eine sehr große <strong>NQ</strong> (Anzahl der Abfragen pro Anfrage) hat, kann sie über einen längeren Zeitraum laufen und die Ressourcen des Abfrageknotens monopolisieren. Andere Anfragen stapeln sich hinter ihr, was zu einer steigenden Warteschlangenlatenz führt. Auch wenn jede Anfrage eine kleine NQ hat, kann ein sehr hoher Gesamtdurchsatz (QPS) denselben Effekt verursachen, da Milvus möglicherweise gleichzeitige Suchanfragen intern zusammenführt.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/high_workload_cf9c75e24c.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>Signale, auf die man achten sollte:</strong></p>
<ul>
<li><p>Alle Abfragen zeigen unerwartet hohe Latenzzeiten.</p></li>
<li><p>Abfrageknoten-Metriken melden eine hohe <strong>Latenz in der Warteschlange</strong>.</p></li>
<li><p>Die Protokolle zeigen eine Anfrage mit einer großen NQ und einer langen Gesamtdauer, aber einer relativ kleinen DauerPerNQ, was darauf hinweist, dass eine übergroße Anfrage die Ressourcen dominiert.</p></li>
</ul>
<p><strong>Behebung des Problems:</strong></p>
<ul>
<li><p><strong>Stapelabfragen</strong>: Halten Sie die NQ bescheiden, um eine Überlastung einer einzelnen Anfrage zu vermeiden.</p></li>
<li><p><strong>Verkleinern Sie Abfrageknoten</strong>: Wenn hohe Gleichzeitigkeit ein regelmäßiger Teil Ihrer Arbeitslast ist, fügen Sie Abfrageknoten hinzu, um die Last zu verteilen und eine niedrige Latenz aufrechtzuerhalten.</p></li>
</ul>
<h3 id="Inefficient-Filtering" class="common-anchor-header">Ineffiziente Filterung</h3><p>Ein weiterer häufiger Engpass entsteht durch ineffiziente Filter. Wenn Filterausdrücke schlecht ausgeführt werden oder Feldern skalare Indizes fehlen, greift Milvus möglicherweise auf einen <strong>vollständigen Scan</strong> zurück, anstatt eine kleine, gezielte Teilmenge zu scannen. JSON-Filter und strenge Konsistenzeinstellungen können den Overhead weiter erhöhen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/inefficient_filtering_e524615d63.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>Signale, auf die Sie achten sollten:</strong></p>
<ul>
<li><p>Hohe <strong>Skalarfilter-Latenz</strong> in Abfrageknoten-Metriken.</p></li>
<li><p>Spürbare Latenzspitzen nur bei Anwendung von Filtern.</p></li>
<li><p>Lange <strong>Wait tSafe-Latenz</strong>, wenn Strict Consistency aktiviert ist.</p></li>
</ul>
<p><strong>Wie man das Problem behebt:</strong></p>
<ul>
<li><strong>Vereinfachen Sie die Filterausdrücke</strong>: Reduzieren Sie die Komplexität des Abfrageplans durch Optimierung der Filter. Ersetzen Sie zum Beispiel lange OR-Ketten durch einen IN-Ausdruck:</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Replace chains of OR conditions with IN</span>
tag = {<span class="hljs-string">&quot;tag&quot;</span>: [<span class="hljs-string">&quot;A&quot;</span>, <span class="hljs-string">&quot;B&quot;</span>, <span class="hljs-string">&quot;C&quot;</span>, <span class="hljs-string">&quot;D&quot;</span>]}
filter_expr = <span class="hljs-string">&quot;tag IN {tag}&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p>Milvus führt auch einen Mechanismus zur Erstellung von Vorlagen für Filterausdrücke ein, der die Effizienz verbessern soll, indem er die Zeit für das Parsen komplexer Ausdrücke reduziert. Siehe <a href="https://milvus.io/docs/filtering-templating.md">dieses Dokument</a> für weitere Details.</p></li>
<li><p><strong>Hinzufügen geeigneter Indizes</strong>: Vermeiden Sie vollständige Scans, indem Sie skalare Indizes für in Filtern verwendete Felder erstellen.</p></li>
<li><p><strong>Effizienter Umgang mit JSON</strong>: Mit Milvus 2.6 wurden Pfad- und flache Indizes für JSON-Felder eingeführt, die eine effiziente Verarbeitung von JSON-Daten ermöglichen. JSON Shredding ist ebenfalls auf der <a href="https://milvus.io/docs/roadmap.md">Roadmap</a>, um die Leistung weiter zu verbessern. Weitere Informationen finden Sie im <a href="https://milvus.io/docs/use-json-fields.md#JSON-Field">JSON-Feld-Dokument</a>.</p></li>
<li><p><strong>Abstimmen der Konsistenzstufe</strong>: Verwenden Sie <em>Bounded</em> oder <em>Eventually</em> Consistent Reads, wenn keine strengen Garantien erforderlich sind, um die Wartezeit <em>von tSafe</em> zu reduzieren.</p></li>
</ul>
<h3 id="Improper-Choice-of-Vector-Index" class="common-anchor-header">Falsche Wahl des Vektorindexes</h3><p><a href="https://milvus.io/docs/index-explained.md">Vektorindizes</a> sind keine Einheitsgröße. Die Auswahl des falschen Index kann die Latenzzeit erheblich beeinflussen. In-Memory-Indizes liefern die schnellste Leistung, verbrauchen aber mehr Speicher, während On-Disk-Indizes auf Kosten der Geschwindigkeit Speicherplatz sparen. Binäre Vektoren erfordern ebenfalls spezielle Indizierungsstrategien.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_4_25fa1b9c13.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>Signale, auf die Sie achten sollten:</strong></p>
<ul>
<li><p>Hohe Vektorsuchlatenz in den Metriken der Abfrageknoten.</p></li>
<li><p>Festplatten-E/A-Sättigung bei Verwendung von DiskANN oder MMAP.</p></li>
<li><p>Langsamere Abfragen unmittelbar nach dem Neustart aufgrund eines Cache-Kaltstarts.</p></li>
</ul>
<p><strong>Wie man das Problem behebt:</strong></p>
<ul>
<li><p><strong>Passen Sie den Index an die Arbeitslast an (Float-Vektoren):</strong></p>
<ul>
<li><p><strong>HNSW</strong> - am besten für In-Memory-Anwendungsfälle mit hohem Abruf und geringer Latenz.</p></li>
<li><p><strong>IVF-Familie</strong> - flexible Kompromisse zwischen Abruf und Geschwindigkeit.</p></li>
<li><p><strong>DiskANN</strong> - unterstützt Datensätze in Milliardenhöhe, erfordert jedoch eine hohe Festplattenbandbreite.</p></li>
</ul></li>
<li><p><strong>Für binäre Vektoren:</strong> Verwenden Sie den <a href="https://milvus.io/docs/minhash-lsh.md">MINHASH_LSH-Index</a> (eingeführt in Milvus 2.6) mit der MHJACCARD-Metrik, um die Jaccard-Ähnlichkeit effizient zu approximieren.</p></li>
<li><p><strong>Aktivieren</strong> <a href="https://milvus.io/docs/mmap.md"><strong>Sie MMAP</strong></a>: Indexdateien werden in den Speicher gemappt, anstatt sie vollständig resident zu halten, um ein Gleichgewicht zwischen Latenz und Speichernutzung herzustellen.</p></li>
<li><p><strong>Abstimmen der Index-/Suchparameter</strong>: Passen Sie die Einstellungen an, um Abruf und Latenz für Ihre Arbeitslast auszugleichen.</p></li>
<li><p><strong>Verringern Sie Kaltstarts</strong>: Wärmen Sie häufig genutzte Segmente nach einem Neustart auf, um eine anfängliche Verlangsamung der Abfrage zu vermeiden.</p></li>
</ul>
<h3 id="Runtime--Environment-Conditions" class="common-anchor-header">Laufzeit- und Umgebungsbedingungen</h3><p>Nicht alle langsamen Abfragen werden durch die Abfrage selbst verursacht. Abfrageknoten teilen sich oft Ressourcen mit Hintergrundaufgaben, wie z. B. Verdichtung, Datenmigration oder Indexaufbau. Häufige Upserts können viele kleine, nicht indizierte Segmente erzeugen, so dass die Abfragen gezwungen sind, Rohdaten zu durchsuchen. In einigen Fällen können auch versionsspezifische Ineffizienzen zu Latenzzeiten führen, bis sie behoben sind.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/img_v3_02q5_4dd2e545_93dc_4c58_b609_d76d50c2013g_aad0a89208.png" alt=" " class="doc-image" id="-" />
    <span> </span>
  </span>
</p>
<p><strong>Signale, auf die Sie achten sollten:</strong></p>
<ul>
<li><p>Spitzen bei der CPU-Nutzung während Hintergrundaufgaben (Verdichtung, Migration, Indexerstellung).</p></li>
<li><p>Festplatten-E/A-Sättigung, die die Abfrageleistung beeinträchtigt.</p></li>
<li><p>Sehr langsames Aufwärmen des Cache nach einem Neustart.</p></li>
<li><p>Große Anzahl kleiner, nicht indizierter Segmente (durch häufige Upserts).</p></li>
<li><p>Latenz-Regressionen in Verbindung mit bestimmten Milvus-Versionen.</p></li>
</ul>
<p><strong>Wie man das Problem behebt:</strong></p>
<ul>
<li><p><strong>Verschieben Sie Hintergrundaufgaben</strong> (z. B. Verdichtung) auf Zeiten außerhalb der Hauptverkehrszeiten.</p></li>
<li><p><strong>Geben Sie ungenutzte Sammlungen frei</strong>, um Speicher freizugeben.</p></li>
<li><p><strong>Berücksichtigen Sie die Aufwärmzeit</strong> nach Neustarts; wärmen Sie Caches bei Bedarf vor.</p></li>
<li><p><strong>Batch-Upserts</strong>, um die Erstellung kleiner Segmente zu reduzieren und die Verdichtung aufrechtzuerhalten.</p></li>
<li><p><strong>Bleiben Sie auf dem neuesten Stand</strong>: Aktualisieren Sie auf neuere Milvus-Versionen, um Fehler zu beheben und Optimierungen vorzunehmen.</p></li>
<li><p><strong>Ressourcen bereitstellen</strong>: zusätzliche CPU-/Speicherressourcen für latenzanfällige Arbeitslasten bereitstellen.</p></li>
</ul>
<p>Indem Sie jedem Signal die richtige Aktion zuordnen, können die meisten langsamen Abfragen schnell und vorhersehbar gelöst werden.</p>
<h2 id="Best-Practices-to-Prevent-Slow-Searches" class="common-anchor-header">Best Practices zur Vermeidung langsamer Suchvorgänge<button data-href="#Best-Practices-to-Prevent-Slow-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>Die beste Debugging-Sitzung ist die, die Sie nie durchführen müssen. Unserer Erfahrung nach tragen ein paar einfache Gewohnheiten wesentlich dazu bei, langsame Abfragen in Milvus zu verhindern:</p>
<ul>
<li><p><strong>Planen Sie die Ressourcenzuweisung</strong>, um CPU- und Festplattenkonflikte zu vermeiden.</p></li>
<li><p><strong>Richten Sie proaktive Warnungen</strong> für Ausfälle und Latenzspitzen<strong>ein</strong>.</p></li>
<li><p><strong>Halten Sie Filterausdrücke</strong> kurz, einfach und effizient.</p></li>
<li><p><strong>Stapeln Sie Upserts</strong> und halten Sie NQ/QPS auf einem nachhaltigen Niveau.</p></li>
<li><p><strong>Indizieren Sie alle Felder</strong>, die in Filtern verwendet werden.</p></li>
</ul>
<p>Langsame Abfragen in Milvus sind selten, und wenn sie auftreten, haben sie in der Regel klare, diagnostizierbare Ursachen. Mit Metriken, Protokollen und einem strukturierten Ansatz können Sie Probleme schnell identifizieren und beheben. Dies ist das gleiche Handbuch, das unser Support-Team täglich verwendet - und jetzt auch Sie.</p>
<p>Wir hoffen, dass dieser Leitfaden nicht nur einen Rahmen für die Fehlersuche bietet, sondern auch das Vertrauen, dass Ihre Milvus-Workloads reibungslos und effizient laufen.</p>
<h2 id="💡-Want-to-dive-deeper" class="common-anchor-header">💡 Möchten Sie tiefer eintauchen?<button data-href="#💡-Want-to-dive-deeper" class="anchor-icon" translate="no">
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
<li><p>Treten Sie dem <a href="https://discord.com/invite/8uyFbECzPX"><strong>Milvus Discord</strong></a> bei, um Fragen zu stellen, Erfahrungen auszutauschen und von der Community zu lernen.</p></li>
<li><p>Melden Sie sich für unsere <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>Milvus-Sprechstunden</strong></a> an, um direkt mit dem Team zu sprechen und praktische Unterstützung bei Ihren Workloads zu erhalten.</p></li>
</ul>
