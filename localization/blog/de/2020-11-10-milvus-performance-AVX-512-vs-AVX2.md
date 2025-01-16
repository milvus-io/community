---
id: milvus-performance-AVX-512-vs-AVX2.md
title: Was sind erweiterte Vektorerweiterungen?
author: milvus
date: 2020-11-10T22:15:39.156Z
desc: >-
  Entdecken Sie, wie Milvus auf AVX-512 im Vergleich zu AVX2 unter Verwendung
  verschiedener Vektorindizes abschneidet.
cover: assets.zilliz.com/header_milvus_performance_avx_512_vs_avx2_2c9f14ef96.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/milvus-performance-AVX-512-vs-AVX2'
---
<custom-h1>Milvus-Leistung auf AVX-512 vs. AVX2</custom-h1><p>Bewusste intelligente Maschinen, die die Welt übernehmen wollen, sind ein fester Bestandteil der Science-Fiction, aber in Wirklichkeit sind moderne Computer sehr gehorsam. Ohne dass man es ihnen sagt, wissen sie selten, was sie mit sich selbst anfangen sollen. Computer führen Aufgaben auf der Grundlage von Anweisungen oder Befehlen aus, die von einem Programm an einen Prozessor gesendet werden. Auf der untersten Ebene ist jede Anweisung eine Folge von Einsen und Nullen, die eine Operation beschreibt, die der Computer ausführen soll. In den Assemblersprachen von Computern entspricht jede Anweisung in der Maschinensprache in der Regel einer Prozessoranweisung. Die Zentraleinheit (CPU) stützt sich auf Anweisungen, um Berechnungen durchzuführen und Systeme zu steuern. Darüber hinaus wird die CPU-Leistung häufig anhand der Fähigkeit zur Befehlsausführung (z. B. Ausführungszeit) gemessen.</p>
<h2 id="What-are-Advanced-Vector-Extensions" class="common-anchor-header">Was sind erweiterte Vektorerweiterungen?<button data-href="#What-are-Advanced-Vector-Extensions" class="anchor-icon" translate="no">
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
    </button></h2><p>Advanced Vector Extensions (AVX) sind ein Befehlssatz für Mikroprozessoren, die auf der x86-Familie von Befehlssatzarchitekturen basieren. Erstmals von Intel im März 2008 vorgeschlagen, fand AVX drei Jahre später mit der Einführung von Sandy Bridge - einer Mikroarchitektur, die in der zweiten Generation von Intel Core-Prozessoren (z. B. Core i7, i5, i3) verwendet wird - und der konkurrierenden Mikroarchitektur von AMD, die ebenfalls 2011 veröffentlicht wurde, Bulldozer, breite Unterstützung.</p>
<p>Mit AVX wurden ein neues Kodierungsschema, neue Funktionen und neue Anweisungen eingeführt. AVX2 erweitert die meisten Ganzzahloperationen auf 256 Bit und führt FMA-Operationen (Fused Multiply-Accumulate) ein. AVX-512 erweitert AVX auf 512-Bit-Operationen unter Verwendung einer neuen EVEX-Präfixkodierung (Enhanced Vector Extension).</p>
<p><a href="https://milvus.io/docs">Milvus</a> ist eine Open-Source-Vektordatenbank, die für die Ähnlichkeitssuche und Anwendungen der künstlichen Intelligenz (KI) entwickelt wurde. Die Plattform unterstützt den AVX-512-Befehlssatz, d. h. sie kann mit allen CPUs verwendet werden, die AVX-512-Befehle enthalten. Milvus hat ein breites Anwendungsspektrum, das Empfehlungssysteme, Computer Vision, natürliche Sprachverarbeitung (NLP) und mehr umfasst. In diesem Artikel werden Leistungsergebnisse und Analysen einer Milvus-Vektor-Datenbank auf AVX-512 und AVX2 vorgestellt.</p>
<h2 id="Milvus-performance-on-AVX-512-vs-AVX2" class="common-anchor-header">Milvus-Leistung auf AVX-512 vs. AVX2<button data-href="#Milvus-performance-on-AVX-512-vs-AVX2" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="System-configuration" class="common-anchor-header">System-Konfiguration</h3><ul>
<li>CPU: Intel® Platinum 8163 CPU @ 2.50GHz24 Kerne 48 Threads</li>
<li>Anzahl der CPUs: 2</li>
<li>Grafikkarte, GeForce RTX 2080Ti 11GB 4 Karten</li>
<li>Arbeitsspeicher: 768 GB</li>
<li>Festplatte: 2TB SSD</li>
</ul>
<h3 id="Milvus-parameters" class="common-anchor-header">Milvus-Parameter</h3><ul>
<li>cahce.cahe_size: 25, Die Größe des CPU-Speichers, der zum Zwischenspeichern von Daten für schnellere Abfragen verwendet wird.</li>
<li>nlist: 4096</li>
<li>nprobe: 128</li>
</ul>
<p>Hinweis: <code translate="no">nlist</code> ist der Indizierungsparameter, der vom Client erstellt wird; <code translate="no">nprobe</code> ist der Suchparameter. Sowohl IVF_FLAT als auch IVF_SQ8 verwenden einen Clustering-Algorithmus, um eine große Anzahl von Vektoren in Buckets zu partitionieren, wobei <code translate="no">nlist</code> die Gesamtzahl der Buckets ist, die während des Clustering partitioniert werden. Der erste Schritt bei einer Abfrage besteht darin, die Anzahl der Buckets zu finden, die dem Zielvektor am nächsten liegen, und der zweite Schritt besteht darin, die Top-k-Vektoren in diesen Buckets zu finden, indem der Abstand der Vektoren verglichen wird. <code translate="no">nprobe</code> bezieht sich auf die Anzahl der Buckets im ersten Schritt.</p>
<h3 id="Dataset-SIFT10M-dataset" class="common-anchor-header">Datensatz: SIFT10M-Datensatz</h3><p>Für diese Tests wird der <a href="https://archive.ics.uci.edu/ml/datasets/SIFT10M">SIFT10M-Datensatz</a> verwendet, der eine Million 128-dimensionale Vektoren enthält und häufig für die Analyse der Leistung entsprechender Nearest-Neighbor-Suchmethoden verwendet wird. Die Top-1-Suchzeit für nq = [1, 10, 100, 500, 1000] wird zwischen den beiden Befehlssätzen verglichen.</p>
<h3 id="Results-by-vector-index-type" class="common-anchor-header">Ergebnisse nach Vektorindex-Typ</h3><p><a href="https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing">Vektorindizes</a> sind zeit- und platzsparende Datenstrukturen, die auf dem Vektorfeld einer Sammlung unter Verwendung verschiedener mathematischer Modelle aufgebaut sind. Mit Hilfe der Vektorindizierung können große Datensätze effizient durchsucht werden, wenn versucht wird, ähnliche Vektoren wie ein Eingangsvektor zu identifizieren. Da eine genaue Suche sehr zeitaufwändig ist, verwenden die meisten <a href="https://milvus.io/docs/v2.0.x/index.md#CPU">von Milvus unterstützten</a> Indexarten die ANN-Suche (approximate nearest neighbor).</p>
<p>Für diese Tests wurden drei Indizes mit AVX-512 und AVX2 verwendet: IVF_FLAT, IVF_SQ8 und HNSW.</p>
<h3 id="IVFFLAT" class="common-anchor-header">IVF_FLAT</h3><p>Invertierte Datei (IVF_FLAT) ist ein auf Quantisierung basierender Indextyp. Er ist der einfachste IVF-Index, und die kodierten Daten, die in jeder Einheit gespeichert sind, stimmen mit den Originaldaten überein. Der Index unterteilt die Vektordaten in eine Anzahl von Cluster-Einheiten (nlist) und vergleicht dann die Abstände zwischen dem Zieleingangsvektor und dem Zentrum jedes Clusters. Je nach der Anzahl der Cluster, die das System abfragen soll (nprobe), werden die Ergebnisse der Ähnlichkeitssuche nur auf der Grundlage von Vergleichen zwischen der Zieleingabe und den Vektoren in den ähnlichsten Clustern zurückgegeben, was die Abfragezeit drastisch verkürzt. Durch die Anpassung von nprobe kann ein ideales Gleichgewicht zwischen Genauigkeit und Geschwindigkeit für ein bestimmtes Szenario gefunden werden.</p>
<p><strong>Leistungsergebnisse</strong> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IVF_FLAT_3688377fc8.png" alt="IVF_FLAT.png" class="doc-image" id="ivf_flat.png" /><span>IVF_FLAT.png</span> </span></p>
<h3 id="IVFSQ8" class="common-anchor-header">IVF_SQ8</h3><p>IVF_FLAT führt keine Komprimierung durch, so dass die erzeugten Indexdateien ungefähr die gleiche Größe haben wie die ursprünglichen, nicht indizierten Vektordaten. Wenn Festplatten-, CPU- oder GPU-Speicherressourcen begrenzt sind, ist IVF_SQ8 eine bessere Option als IVF_FLAT. Dieser Indextyp kann jede Dimension des ursprünglichen Vektors von einer Vier-Byte-Gleitkommazahl in eine vorzeichenlose Ein-Byte-Ganzzahl konvertieren, indem er eine skalare Quantisierung durchführt. Dies reduziert den Festplatten-, CPU- und GPU-Speicherverbrauch um 70-75 %.</p>
<p><strong>Leistungsergebnisse</strong> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IVF_SQ_8_bed28307f7.png" alt="IVF_SQ8.png" class="doc-image" id="ivf_sq8.png" /><span>IVF_SQ8.png</span> </span></p>
<h3 id="HNSW" class="common-anchor-header">HNSW</h3><p>Hierarchical Small World Graph (HNSW) ist ein graphbasierter Indizierungsalgorithmus. Abfragen beginnen in der obersten Ebene mit der Suche nach dem Knoten, der dem Ziel am nächsten liegt, und gehen dann in die nächste Ebene für eine weitere Suchrunde. Nach mehreren Iterationen kann er sich schnell der Zielposition nähern.</p>
<p><strong>Leistungsergebnisse</strong> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/HNSW_52aba39214.png" alt="HNSW.png" class="doc-image" id="hnsw.png" /><span>HNSW.png</span> </span></p>
<h2 id="Comparing-vector-indexes" class="common-anchor-header">Vergleich der Vektorindizes<button data-href="#Comparing-vector-indexes" class="anchor-icon" translate="no">
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
    </button></h2><p>Der Vektorabruf ist mit dem AVX-512-Befehlssatz durchweg schneller als mit AVX2. Das liegt daran, dass AVX-512 512-Bit-Berechnungen unterstützt, während AVX2 nur 256-Bit-Berechnungen unterstützt. Theoretisch sollte AVX-512 doppelt so schnell sein wie AVX2, allerdings führt Milvus neben den Vektorähnlichkeitsberechnungen auch andere zeitaufwändige Aufgaben durch. Es ist unwahrscheinlich, dass die Gesamtabrufzeit von AVX-512 in realen Szenarien doppelt so kurz ist wie die von AVX2. <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/comparison_a64b92f1dd.png" alt="comparison.png" class="doc-image" id="comparison.png" /><span>comparison.png</span> </span></p>
<p>Der Abruf ist mit dem HNSW-Index deutlich schneller als mit den beiden anderen Indizes, während der Abruf mit IVF_SQ8 bei beiden Befehlssätzen etwas schneller ist als mit IVF_FLAT. Dies liegt wahrscheinlich daran, dass IVF_SQ8 nur 25 % des Speicherbedarfs von IVF_FLAT benötigt. IVF_SQ8 lädt 1 Byte für jede Vektordimension, während IVF_FLAT 4 Byte pro Vektordimension lädt. Die für die Berechnung benötigte Zeit wird höchstwahrscheinlich durch die Speicherbandbreite begrenzt. Infolgedessen benötigt IVF_SQ8 nicht nur weniger Platz, sondern auch weniger Zeit zum Abrufen von Vektoren.</p>
<h2 id="Milvus-is-a-versatile-high-performance-vector-database" class="common-anchor-header">Milvus ist eine vielseitige, leistungsstarke Vektordatenbank<button data-href="#Milvus-is-a-versatile-high-performance-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Die in diesem Artikel vorgestellten Tests zeigen, dass Milvus sowohl auf dem AVX-512- als auch auf dem AVX2-Befehlssatz unter Verwendung verschiedener Indizes eine hervorragende Leistung bietet. Unabhängig vom Index-Typ schneidet Milvus auf AVX-512 besser ab.</p>
<p>Milvus ist mit einer Vielzahl von Deep-Learning-Plattformen kompatibel und wird in verschiedenen KI-Anwendungen eingesetzt. <a href="https://zilliz.com/news/lfaidata-launches-milvus-2.0-an-advanced-cloud-native-vector-database-built-for-ai">Milvus 2.0</a>, eine überarbeitete Version der beliebtesten Vektordatenbank der Welt, wurde im Juli 2021 unter einer Open-Source-Lizenz veröffentlicht. Weitere Informationen über das Projekt finden Sie in den folgenden Ressourcen:</p>
<ul>
<li>Finden Sie Milvus auf <a href="https://github.com/milvus-io/milvus/">GitHub</a> oder tragen Sie dazu bei.</li>
<li>Interagieren Sie mit der Community über <a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slack</a>.</li>
<li>Verbinden Sie sich mit uns auf <a href="https://twitter.com/milvusio">Twitter</a>.</li>
</ul>
