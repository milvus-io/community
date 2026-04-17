---
id: data-addressing-storage-systems.md
title: >-
  Ein tiefes Eintauchen in die Datenadressierung in Speichersystemen: Von
  HashMap zu HDFS, Kafka, Milvus und Iceberg
author: Bill Chen
date: 2026-3-25
cover: >-
  assets.zilliz.com/cover_A_Deep_Dive_into_Data_Addressing_in_Storage_Systems_6b436abeae.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  data addressing, distributed storage architecture, Milvus storage design,
  vector database internals, Apache Iceberg
meta_title: |
  Data Addressing Deep Dive: From HashMap to Milvus
desc: >-
  Verfolgen Sie, wie die Datenadressierung von HashMap bis HDFS, Kafka, Milvus
  und Iceberg funktioniert - und warum das Berechnen von Standorten die Suche in
  jedem Maßstab schlägt.
origin: 'https://milvus.io/blog/data-addressing-storage-systems.md'
---
<p>Wenn Sie an Backend-Systemen oder verteilten Speichern arbeiten, haben Sie das sicher schon einmal erlebt: Das Netzwerk ist nicht gesättigt, die Rechner sind nicht überlastet, und doch löst eine einfache Abfrage Tausende von Festplatten-E/As oder Objektspeicher-API-Aufrufe aus - und die Abfrage dauert immer noch Sekunden.</p>
<p>Der Engpass ist selten die Bandbreite oder die Rechenleistung. Es ist die <em>Adressierung</em> - die Arbeit, die ein System leistet, um herauszufinden, wo sich die Daten befinden, bevor es sie lesen kann. Bei <strong>der Datenadressierung</strong> wird ein logischer Bezeichner (ein Schlüssel, ein Dateipfad, ein Offset, ein Abfrageprädikat) in den physischen Speicherort der Daten übersetzt. In großem Maßstab dominiert dieser Prozess - und nicht die eigentliche Datenübertragung - die Latenzzeit.</p>
<p>Die Speicherleistung lässt sich auf ein einfaches Modell reduzieren:</p>
<blockquote>
<p><strong>Gesamtadressierungskosten = Metadatenzugriffe + Datenzugriffe</strong></p>
</blockquote>
<p>Nahezu jede Speicheroptimierung - von Hash-Tabellen bis hin zu Lakehouse-Metadatenschichten - zielt auf diese Gleichung ab. Die Techniken variieren, aber das Ziel ist immer dasselbe: Daten mit so wenig Operationen mit hoher Latenz wie möglich zu finden.</p>
<p>In diesem Artikel wird diese Idee in Systemen mit zunehmendem Umfang verfolgt - von In-Memory-Datenstrukturen wie HashMap über verteilte Systeme wie HDFS und Apache Kafka bis hin zu modernen Engines wie <a href="https://milvus.io/">Milvus</a> (eine <a href="https://zilliz.com/learn/what-is-a-vector-database">Vektordatenbank</a>) und Apache Iceberg, die mit Objektspeicher arbeiten. Trotz ihrer Unterschiede optimieren sie alle die gleiche Gleichung.</p>
<h2 id="Three-Core-Addressing-Techniques" class="common-anchor-header">Drei grundlegende Adressierungstechniken<button data-href="#Three-Core-Addressing-Techniques" class="anchor-icon" translate="no">
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
    </button></h2><p>Bei allen Speichersystemen und verteilten Engines lassen sich die meisten Adressierungsoptimierungen in drei Techniken unterteilen:</p>
<ul>
<li><strong>Berechnung</strong> - Der Speicherort der Daten wird direkt aus einer Formel abgeleitet, anstatt Strukturen zu durchsuchen oder zu durchlaufen, um ihn zu finden.</li>
<li><strong>Caching</strong> - Speicherung von Metadaten oder Indizes, auf die häufig zugegriffen wird, im Speicher, um wiederholte Lesevorgänge mit hoher Latenz von der Festplatte oder einem entfernten Speicher zu vermeiden.</li>
<li><strong>Pruning</strong> - Verwendung von Bereichsinformationen oder Partitionsgrenzen, um Dateien, Shards oder Knoten auszuschließen, die das Ergebnis nicht enthalten können.</li>
</ul>
<p>In diesem Artikel wird unter einem <em>Zugriff</em> jede Operation mit realen Kosten auf Systemebene verstanden: ein Festplattenlesevorgang, ein Netzwerkaufruf oder eine Objektspeicher-API-Anforderung. CPU-Berechnungen auf Nanosekundenebene zählen nicht. Worauf es ankommt, ist die Verringerung der Anzahl von E/A-Operationen - oder die Umwandlung von teuren zufälligen E/A in billigere sequenzielle Lesevorgänge.</p>
<h2 id="How-Addressing-Works-The-Two-Sum-Problem" class="common-anchor-header">Wie die Adressierung funktioniert: Das Zwei-Summen-Problem<button data-href="#How-Addressing-Works-The-Two-Sum-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>Um die Adressierung zu verdeutlichen, betrachten wir ein klassisches Algorithmusproblem. Bei einem Array mit ganzen Zahlen <code translate="no">nums</code> und einem Zielwert <code translate="no">target</code> sollen die Indizes von zwei Zahlen zurückgegeben werden, deren Summe <code translate="no">target</code> ergibt.</p>
<p>Zum Beispiel: <code translate="no">nums = [2, 7, 11, 15]</code>, <code translate="no">target = 9</code> → Ergebnis <code translate="no">[0, 1]</code>.</p>
<p>Dieses Problem veranschaulicht deutlich den Unterschied zwischen der Suche nach Daten und der Berechnung, wo sie sich befinden.</p>
<h3 id="Solution-1-Brute-Force-Search" class="common-anchor-header">Lösung 1: Brute-Force-Suche</h3><p>Bei der Brute-Force-Suche wird jedes Paar überprüft. Für jedes Element wird der Rest des Arrays nach einer Übereinstimmung durchsucht. Einfach, aber O(n²).</p>
<pre><code translate="no" class="language-java"><span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-built_in">int</span>[] <span class="hljs-title">twoSum</span>(<span class="hljs-params"><span class="hljs-built_in">int</span>[] nums, <span class="hljs-built_in">int</span> target</span>)</span> {
    <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> i = <span class="hljs-number">0</span>; i &lt; nums.length; i++) {
        <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> j = i + <span class="hljs-number">1</span>; j &lt; nums.length; j++) {
            <span class="hljs-keyword">if</span> (nums[i] + nums[j] == target) <span class="hljs-keyword">return</span> <span class="hljs-keyword">new</span> <span class="hljs-built_in">int</span>[]{i, j};
        }
    }
    <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>;
}
<button class="copy-code-btn"></button></code></pre>
<p>Es gibt keine Vorstellung davon, wo die Antwort liegen könnte. Jeder Suchvorgang beginnt bei Null und durchläuft das Array blindlings. Der Engpass ist nicht die Arithmetik, sondern das wiederholte Scannen.</p>
<h3 id="Solution-2-Direct-Addressing-via-Computation" class="common-anchor-header">Lösung 2: Direkte Adressierung durch Berechnung</h3><p>Bei der optimierten Lösung wird das Scannen durch eine HashMap ersetzt. Anstatt nach einem passenden Wert zu suchen, wird der benötigte Wert berechnet und direkt nachgeschlagen. Die Zeitkomplexität sinkt auf O(n).</p>
<pre><code translate="no" class="language-java">public <span class="hljs-type">int</span>[] twoSum(<span class="hljs-type">int</span>[] nums, <span class="hljs-type">int</span> target) {
    Map&lt;Integer, Integer&gt; <span class="hljs-keyword">map</span> = <span class="hljs-built_in">new</span> HashMap&lt;&gt;();
    <span class="hljs-keyword">for</span> (<span class="hljs-type">int</span> i = <span class="hljs-number">0</span>; i &lt; nums.length; i++) {
        <span class="hljs-type">int</span> complement = target - nums[i]; <span class="hljs-comment">// compute what we need</span>
        <span class="hljs-keyword">if</span> (<span class="hljs-keyword">map</span>.containsKey(complement)) { <span class="hljs-comment">// direct lookup, no scan</span>
            <span class="hljs-keyword">return</span> <span class="hljs-built_in">new</span> <span class="hljs-type">int</span>[]{<span class="hljs-keyword">map</span>.get(complement), i};
        }
        <span class="hljs-keyword">map</span>.put(nums[i], i);
    }
    <span class="hljs-keyword">return</span> null;
}
<button class="copy-code-btn"></button></code></pre>
<p>Die Umstellung: Anstatt das Array zu durchsuchen, um eine Übereinstimmung zu finden, berechnen Sie den benötigten Wert und gehen direkt zu seiner Position. Sobald der Ort abgeleitet werden kann, entfällt das Traversieren.</p>
<p>Dies ist die gleiche Idee, die hinter jedem Hochleistungsspeichersystem steht, das wir untersuchen werden: Ersetzen Sie Scans durch Berechnungen und indirekte Suchpfade durch direkte Adressierung.</p>
<h2 id="HashMap-How-Computed-Addresses-Replace-Scans" class="common-anchor-header">HashMap: Wie berechnete Adressen Scans ersetzen<button data-href="#HashMap-How-Computed-Addresses-Replace-Scans" class="anchor-icon" translate="no">
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
    </button></h2><p>Eine HashMap speichert Schlüssel-Wert-Paare und findet Werte, indem sie eine Adresse aus dem Schlüssel berechnet - und nicht, indem sie Einträge durchsucht. Bei einem Schlüssel wendet sie eine Hash-Funktion an, berechnet einen Array-Index und springt direkt zu dieser Stelle. Kein Scannen erforderlich.</p>
<p>Dies ist die einfachste Form des Prinzips, das allen Systemen in diesem Artikel zugrunde liegt: Vermeidung von Scans durch Ableitung von Speicherorten durch Berechnung. Dieselbe Idee - die allem zugrunde liegt, von verteilten Metadatensuchen bis hin zu <a href="https://zilliz.com/learn/vector-index">Vektorindizes</a> - taucht in jedem Maßstab auf.</p>
<h3 id="The-Core-Data-Structure" class="common-anchor-header">Die Kerndatenstruktur</h3><p>Im Kern besteht eine HashMap aus einer einzigen Struktur: einem Array. Eine Hash-Funktion bildet Schlüssel auf Array-Indizes ab. Da der Schlüsselraum viel größer ist als das Array, sind Kollisionen unvermeidlich - verschiedene Schlüssel können auf denselben Index verschlüsselt werden. Diese werden lokal in jedem Slot mit einer verknüpften Liste oder einem Rot-Schwarz-Baum behandelt.</p>
<p>Arrays bieten einen zeitlich konstanten Zugriff über den Index. Diese Eigenschaft - direkte, vorhersehbare Adressierung - ist die Grundlage für die Leistung der HashMap und das gleiche Prinzip, das dem effizienten Datenzugriff in großen Speichersystemen zugrunde liegt.</p>
<pre><code translate="no" class="language-java"><span class="hljs-keyword">public</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">HashMap</span>&lt;K,V&gt; {

    <span class="hljs-comment">// Core structure: an array that supports O(1) random access</span>
    <span class="hljs-keyword">transient</span> Node&lt;K,V&gt;[] table;

    <span class="hljs-comment">// Node structure</span>
    <span class="hljs-keyword">static</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">Node</span>&lt;K,V&gt; {
        <span class="hljs-keyword">final</span> <span class="hljs-type">int</span> hash;      <span class="hljs-comment">// hash value (cached to avoid recomputation)</span>
        <span class="hljs-keyword">final</span> K key;         <span class="hljs-comment">// key</span>
        V value;             <span class="hljs-comment">// value</span>
        Node&lt;K,V&gt; next;      <span class="hljs-comment">// next node (for handling collision)</span>
    }

    <span class="hljs-comment">// Hash function：key → integer</span>
    <span class="hljs-keyword">static</span> <span class="hljs-keyword">final</span> <span class="hljs-type">int</span> <span class="hljs-title function_">hash</span><span class="hljs-params">(Object key)</span> {
        <span class="hljs-type">int</span> h;
        <span class="hljs-keyword">return</span> (key == <span class="hljs-literal">null</span>) ? <span class="hljs-number">0</span> : (h = key.hashCode()) ^ (h &gt;&gt;&gt; <span class="hljs-number">16</span>);
    }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Does-a-HashMap-Locate-Data" class="common-anchor-header">Wie lokalisiert eine HashMap Daten?</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_2_4ada70fe33.png" alt="Step-by-step HashMap addressing: hash the key, compute the array index, jump directly to the bucket, and resolve locally — achieving O(1) lookup without traversal" class="doc-image" id="step-by-step-hashmap-addressing:-hash-the-key,-compute-the-array-index,-jump-directly-to-the-bucket,-and-resolve-locally-—-achieving-o(1)-lookup-without-traversal" />
   </span> <span class="img-wrapper"> <span>Schrittweise HashMap-Adressierung: Hash des Schlüssels, Berechnung des Array-Indexes, direkter Sprung zum Bucket und lokale Auflösung - dadurch wird O(1) Lookup ohne Traversal erreicht</span> </span></p>
<p>Nehmen Sie <code translate="no">put(&quot;apple&quot;, 100)</code> als Beispiel. Die gesamte Suche erfolgt in vier Schritten - kein Full-Table-Scan:</p>
<ol>
<li><strong>Hash des Schlüssels:</strong> Übergeben Sie den Schlüssel durch eine Hash-Funktion →. <code translate="no">hash(&quot;apple&quot;) = 93029210</code></li>
<li><strong>Abbildung auf einen Array-Index:</strong> <code translate="no">93029210 &amp; (arrayLength - 1)</code> → z.B., <code translate="no">93029210 &amp; 15 = 10</code></li>
<li><strong>Sprung zum Bucket:</strong> Direkter Zugriff auf <code translate="no">table[10]</code> - ein einzelner Speicherzugriff, kein Traversal</li>
<li><strong>Lokal auflösen:</strong> Wenn keine Kollision, sofort lesen oder schreiben. Wenn es eine Kollision gibt, eine kleine verknüpfte Liste oder einen rot-schwarzen Baum innerhalb des Buckets überprüfen.</li>
</ol>
<h3 id="Why-Is-HashMap-Lookup-O1" class="common-anchor-header">Warum ist HashMap Lookup O(1)?</h3><p>Der Array-Zugriff ist aufgrund einer einfachen Adressierungsformel O(1):</p>
<pre><code translate="no">element_address = base_address + index × element_size
<button class="copy-code-btn"></button></code></pre>
<p>Bei einem Index wird die Speicheradresse mit einer Multiplikation und einer Addition berechnet. Die Kosten sind unabhängig von der Größe des Arrays gleich - eine Berechnung, ein Speicherzugriff. Eine verknüpfte Liste hingegen muss Knoten für Knoten durchlaufen werden, wobei Zeigern durch einzelne Speicherstellen gefolgt wird: O(n) im schlimmsten Fall.</p>
<p>Bei einer HashMap wird ein Schlüssel in einen Array-Index gehasht, was eine Durchquerung in eine berechnete Adresse verwandeln würde. Anstatt nach Daten zu suchen, wird genau berechnet, wo sich die Daten befinden und dorthin gesprungen.</p>
<h2 id="How-Does-Addressing-Change-in-Distributed-Systems" class="common-anchor-header">Wie ändert sich die Adressierung in verteilten Systemen?<button data-href="#How-Does-Addressing-Change-in-Distributed-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>HashMap löst die Adressierung innerhalb einer einzelnen Maschine, wo die Daten im Speicher liegen und die Zugriffskosten trivial sind. Bei größeren Systemen ändern sich die Bedingungen drastisch:</p>
<table>
<thead>
<tr><th>Skalierungsfaktor</th><th>Auswirkung</th></tr>
</thead>
<tbody>
<tr><td>Größe der Daten</td><td>Megabytes → Terabytes oder Petabytes in Clustern</td></tr>
<tr><td>Speichermedium</td><td>Speicher → Festplatte → Netzwerk → Objektspeicher</td></tr>
<tr><td>Zugriffslatenz</td><td>Speicher: ~100 ns / Festplatte: 10-20 ms / Same-DC-Netzwerk: ~0,5 ms / Regionsübergreifend: ~150 ms</td></tr>
</tbody>
</table>
<p>Das Adressierungsproblem ändert sich nicht - es wird nur teurer. Jede Suche kann Netzwerksprünge und Festplatten-E/A beinhalten, so dass die Verringerung der Anzahl von Zugriffen viel wichtiger ist als im Speicher.</p>
<p>Um zu sehen, wie reale Systeme damit umgehen, schauen wir uns zwei klassische Beispiele an. HDFS wendet die rechnungsbasierte Adressierung auf große, blockbasierte Dateien an. Kafka wendet sie auf reine Append-Nachrichtenströme an. Beide folgen dem gleichen Prinzip: Berechnen, wo sich die Daten befinden, anstatt sie zu suchen.</p>
<h2 id="HDFS-Addressing-Large-Files-with-In-Memory-Metadata" class="common-anchor-header">HDFS: Adressierung großer Dateien mit In-Memory-Metadaten<button data-href="#HDFS-Addressing-Large-Files-with-In-Memory-Metadata" class="anchor-icon" translate="no">
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
    </button></h2><p>HDFS ist ein <a href="https://milvus.io/docs/architecture_overview.md">verteiltes Speichersystem</a>, das für sehr große Dateien auf mehreren Rechnern ausgelegt ist. Anhand eines Dateipfads und eines Byte-Offsets muss es den richtigen Datenblock und den DataNode finden, der ihn speichert.</p>
<p>HDFS löst dieses Problem mit einer bewussten Designentscheidung: alle Dateisystem-Metadaten werden im Speicher gehalten.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_1_26ff6257b1.png" alt="HDFS data organization showing logical view of a 300MB file mapped to physical storage as three blocks distributed across DataNodes with replication" class="doc-image" id="hdfs-data-organization-showing-logical-view-of-a-300mb-file-mapped-to-physical-storage-as-three-blocks-distributed-across-datanodes-with-replication" />
   </span> <span class="img-wrapper"> <span>Die HDFS-Datenorganisation zeigt die logische Ansicht einer 300 MB großen Datei, die auf dem physischen Speicher als drei Blöcke verteilt auf DataNodes mit Replikation abgebildet ist</span> </span></p>
<p>Im Zentrum steht der NameNode. Er lädt den gesamten Dateisystembaum - Verzeichnisstruktur, Datei-zu-Block-Zuordnungen und Block-zu-DataNode-Zuordnungen - in den Speicher. Da die Metadaten beim Lesen niemals die Festplatte berühren, löst HDFS alle Adressierungsfragen ausschließlich durch Nachschlagen im Speicher.</p>
<p>Vom Konzept her ist dies eine HashMap im Cluster-Maßstab: Verwendung von In-Memory-Datenstrukturen, um langsame Suchvorgänge in schnelle, berechnete Lookups zu verwandeln. Der Unterschied besteht darin, dass HDFS das gleiche Prinzip auf Datensätze anwendet, die über Tausende von Rechnern verteilt sind.</p>
<pre><code translate="no" class="language-java"><span class="hljs-comment">// Data structures stored in the NameNode&#x27;s memory</span>

<span class="hljs-comment">// 1. Filesystem directory tree</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">FSDirectory</span> {
    INodeDirectory rootDir;           <span class="hljs-comment">// root directory &quot;/&quot;</span>
    INodeMap inodeMap;                <span class="hljs-comment">// path → INode (HashMap!)</span>
}

<span class="hljs-comment">// 2. INode：file / directory node</span>
<span class="hljs-keyword">abstract</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">INode</span> {
    <span class="hljs-type">long</span> id;                          <span class="hljs-comment">// unique identifier</span>
    String name;                      <span class="hljs-comment">// name</span>
    INode parent;                     <span class="hljs-comment">// parent node</span>
    <span class="hljs-type">long</span> modificationTime;            <span class="hljs-comment">// last modification time</span>
}

<span class="hljs-keyword">class</span> <span class="hljs-title class_">INodeFile</span> <span class="hljs-keyword">extends</span> <span class="hljs-title class_">INode</span> {
    BlockInfo[] blocks;               <span class="hljs-comment">// list of blocks that make up the file</span>
}

<span class="hljs-comment">// 3. Block metadata mapping</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">BlocksMap</span> {
    GSet&lt;Block, BlockInfo&gt; blocks;    <span class="hljs-comment">// Block → location info (HashMap!)</span>
}

<span class="hljs-keyword">class</span> <span class="hljs-title class_">BlockInfo</span> {
    <span class="hljs-type">long</span> blockId;
    DatanodeDescriptor[] storages;    <span class="hljs-comment">// list of DataNodes storing this block</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Does-HDFS-Locate-Data" class="common-anchor-header">Wie lokalisiert HDFS Daten?</h3><p>Stellen Sie sich vor, Sie lesen Daten im 200-MB-Offset von <code translate="no">/user/data/bigfile.txt</code>, mit einer Standard-Blockgröße von 128 MB:</p>
<ol>
<li>Der Client sendet einen einzigen RPC an den NameNode</li>
<li>Der NameNode löst den Dateipfad auf und berechnet, dass der Offset 200 MB in den zweiten Block (Bereich 128-256 MB) fällt - vollständig im Speicher</li>
<li>Der NameNode gibt die DataNodes zurück, die diesen Block speichern (z. B. DN2 und DN3)</li>
<li>Der Client liest direkt vom nächstgelegenen DataNode (DN2)</li>
</ol>
<p>Gesamtkosten: ein RPC, ein paar Suchvorgänge im Speicher, ein Datenlesevorgang. Die Metadaten werden während dieses Prozesses nie auf die Festplatte übertragen, und jeder Suchvorgang ist zeitlich konstant. HDFS vermeidet teure Metadatenscans, selbst wenn die Daten über große Cluster skaliert werden.</p>
<h2 id="Apache-Kafka-How-Sparse-Indexing-Avoids-Random-IO" class="common-anchor-header">Apache Kafka: Wie Sparse Indexing zufällige E/A vermeidet<button data-href="#Apache-Kafka-How-Sparse-Indexing-Avoids-Random-IO" class="anchor-icon" translate="no">
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
    </button></h2><p>Apache Kafka ist für Nachrichtenströme mit hohem Durchsatz konzipiert. Bei einem Nachrichtenoffset muss die exakte Byteposition auf der Festplatte gefunden werden, ohne dass Lesevorgänge zu zufälligen E/A werden.</p>
<p>Kafka kombiniert sequenzielle Speicherung mit einem spärlichen, speicherinternen Index. Anstatt die Daten zu durchsuchen, wird eine ungefähre Position berechnet und ein kleiner, begrenzter Scan durchgeführt.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_4_6af2d2cf97.png" alt="Kafka data organization showing logical view with topics and partitions mapped to physical storage as partition directories containing .log, .index, and .timeindex segment files" class="doc-image" id="kafka-data-organization-showing-logical-view-with-topics-and-partitions-mapped-to-physical-storage-as-partition-directories-containing-.log,-.index,-and-.timeindex-segment-files" />
   </span> <span class="img-wrapper"> <span>Die Kafka-Datenorganisation zeigt eine logische Ansicht mit Themen und Partitionen, die dem physischen Speicher als Partitionsverzeichnisse mit .log-, .index- und .timeindex-Segmentdateien zugeordnet sind</span> </span></p>
<p>Nachrichten sind organisiert als Topic → Partition → Segment. Jede Partition ist ein reines Anhangsprotokoll, das in Segmente unterteilt ist, die jeweils aus folgenden Elementen bestehen:</p>
<ul>
<li>einer <code translate="no">.log</code> Datei, die Nachrichten sequentiell auf der Festplatte speichert</li>
<li>einer <code translate="no">.index</code> Datei, die als spärlicher Index für das Protokoll dient</li>
</ul>
<p>Die Datei <code translate="no">.index</code> ist memory-mapped (mmap), so dass Indexabfragen direkt aus dem Speicher ohne Festplatten-E/A durchgeführt werden.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_3_0e4e99b226.png" alt="Kafka sparse index design showing one index entry per 4KB of data, with memory comparison: dense index at 800MB versus sparse index at just 2MB resident in memory" class="doc-image" id="kafka-sparse-index-design-showing-one-index-entry-per-4kb-of-data,-with-memory-comparison:-dense-index-at-800mb-versus-sparse-index-at-just-2mb-resident-in-memory" />
   </span> <span class="img-wrapper"> <span>Kafka-Sparse-Index-Design mit einem Indexeintrag pro 4 KB Daten, mit Speichervergleich: Dense-Index mit 800 MB gegenüber Sparse-Index mit nur 2 MB im Speicher</span> </span></p>
<pre><code translate="no" class="language-java"><span class="hljs-comment">// A Partition manages all its Segments</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">LocalLog</span> {
    <span class="hljs-comment">// Core structure: TreeMap, ordered by baseOffset</span>
    ConcurrentNavigableMap&lt;Long, LogSegment&gt; segments;

    <span class="hljs-comment">// Locate the target Segment</span>
    LogSegment <span class="hljs-title function_">floorEntry</span><span class="hljs-params">(<span class="hljs-type">long</span> offset)</span> {
        <span class="hljs-keyword">return</span> segments.floorEntry(offset);  <span class="hljs-comment">// O(log N)</span>
    }
}

<span class="hljs-comment">// A single Segment</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">LogSegment</span> {
    FileRecords log;           <span class="hljs-comment">// .log file (message data)</span>
    LazyIndex&lt;OffsetIndex&gt; offsetIndex;  <span class="hljs-comment">// .index file (sparse index)</span>
    <span class="hljs-type">long</span> baseOffset;           <span class="hljs-comment">// starting Offset</span>
}

<span class="hljs-comment">// Sparse index entry (8 bytes per entry)</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">OffsetPosition</span> {
    <span class="hljs-type">int</span> relativeOffset;        <span class="hljs-comment">// offset relative to baseOffset (4 bytes)</span>
    <span class="hljs-type">int</span> position;              <span class="hljs-comment">// physical position in the .log file (4 bytes)</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Does-Kafka-Locate-Data" class="common-anchor-header">Wie lokalisiert Kafka Daten?</h3><p>Nehmen wir an, ein Verbraucher liest die Nachricht am Offset 500.000. Kafka löst dies in drei Schritten auf:</p>
<p><strong>1. Lokalisieren des Segments</strong> (TreeMap-Lookup)</p>
<ul>
<li>Segment-Basis-Offsets: <code translate="no">[0, 367834, 735668, 1103502]</code></li>
<li><code translate="no">floorEntry(500000)</code> → <code translate="no">baseOffset = 367834</code></li>
<li>Zieldatei: <code translate="no">00000000000000367834.log</code></li>
<li>Zeitkomplexität: O(log S), wobei S die Anzahl der Segmente ist (normalerweise &lt; 100)</li>
</ul>
<p><strong>2. Nachschlagen der Position im Sparse-Index</strong> (.index)</p>
<ul>
<li>Relativer Versatz: <code translate="no">500000 − 367834 = 132166</code></li>
<li>Binäre Suche in <code translate="no">.index</code>: Suche nach dem größten Eintrag ≤ 132166 → <code translate="no">[132100 → position 20500000]</code></li>
<li>Zeitliche Komplexität: O(log N), wobei N die Anzahl der Indexeinträge ist</li>
</ul>
<p><strong>3. Sequentielles Lesen aus dem Protokoll</strong> (.log)</p>
<ul>
<li>Beginn des Lesens ab Position 20.500.000</li>
<li>Fortsetzen, bis der Offset 500.000 erreicht ist</li>
<li>Höchstens ein Indexintervall (~4 KB) wird gescannt</li>
</ul>
<p>Insgesamt: ein In-Memory-Segment-Lookup, ein Index-Lookup, ein kurzes sequenzielles Lesen. Kein zufälliger Plattenzugriff.</p>
<h2 id="HDFS-vs-Apache-Kafka" class="common-anchor-header">HDFS vs. Apache Kafka<button data-href="#HDFS-vs-Apache-Kafka" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>Dimension</th><th>HDFS</th><th>Kafka</th></tr>
</thead>
<tbody>
<tr><td>Ziel der Entwicklung</td><td>Effizientes Speichern und Lesen von großen Dateien</td><td>Sequentielles Lesen/Schreiben von Nachrichtenströmen mit hohem Durchsatz</td></tr>
<tr><td>Adressierungsmodell</td><td>Pfad → Block → DataNode über speicherinterne HashMaps</td><td>Offset → Segment → Position über Sparse-Index + sequentielle Suche</td></tr>
<tr><td>Speicherung von Metadaten</td><td>Zentralisiert im NameNode-Speicher</td><td>Lokale Dateien, Speicherabbildung über mmap</td></tr>
<tr><td>Zugriffskosten pro Lookup</td><td>1 RPC + N Blocklesungen</td><td>1 Indexabfrage + 1 Datenlesung</td></tr>
<tr><td>Optimierung der Schlüssel</td><td>Alle Metadaten im Speicher - keine Festplatte im Suchpfad</td><td>Lückenhafte Indizierung + sequentielles Layout vermeidet zufällige E/A</td></tr>
</tbody>
</table>
<h2 id="Why-Object-Storage-Changes-the-Addressing-Problem" class="common-anchor-header">Warum Objektspeicher das Adressierungsproblem verändern<button data-href="#Why-Object-Storage-Changes-the-Addressing-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>Von HashMap bis HDFS und Kafka haben wir die Adressierung im Speicher und in klassischer verteilter Speicherung gesehen. Mit der Entwicklung der Arbeitslasten steigen auch die Anforderungen:</p>
<ul>
<li><strong>Umfangreichere Abfragen.</strong> Moderne Systeme beherrschen Mehrfeldfilter, <a href="https://zilliz.com/glossary/similarity-search">Ähnlichkeitssuche</a> und komplexe Prädikate - nicht nur einfache Schlüssel und Offsets.</li>
<li><strong>Objektspeicher als Standard.</strong> Daten werden zunehmend in S3-kompatiblen Speichern gespeichert. Dateien sind über Buckets verteilt, und jeder Zugriff ist ein API-Aufruf mit einer festen Latenzzeit in der Größenordnung von zehn Millisekunden - selbst für einige Kilobytes.</li>
</ul>
<p>An diesem Punkt ist die Latenz - nicht die Bandbreite - der Engpass. Eine einzelne S3-GET-Anfrage kostet ~50 ms, unabhängig davon, wie viele Daten sie zurückgibt. Wenn eine Abfrage Tausende solcher Anfragen auslöst, steigt die Gesamtlatenz in die Höhe. Die Minimierung des API-Fan-outs wird zur zentralen Design-Bedingung.</p>
<p>Wir werden uns zwei moderne Systeme ansehen - <a href="https://milvus.io/">Milvus</a>, eine <a href="https://zilliz.com/learn/what-is-a-vector-database">Vektordatenbank</a>, und Apache Iceberg, ein Lakehouse-Tabellenformat - um zu sehen, wie sie mit diesen Herausforderungen umgehen. Trotz ihrer Unterschiede gelten für beide Systeme dieselben Kerngedanken: Minimierung von Zugriffen mit hoher Latenz, frühzeitige Reduzierung des Fan-Out und Bevorzugung von Berechnungen gegenüber Traversierungen.</p>
<h2 id="Milvus-V1-When-Field-Level-Storage-Creates-Too-Many-Files" class="common-anchor-header">Milvus V1: Wenn Field-Level-Storage zu viele Dateien erzeugt<button data-href="#Milvus-V1-When-Field-Level-Storage-Creates-Too-Many-Files" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus ist eine weit verbreitete Vektordatenbank, die für die <a href="https://zilliz.com/glossary/similarity-search">Ähnlichkeitssuche</a> über <a href="https://zilliz.com/glossary/vector-embeddings">Vektoreinbettungen</a> entwickelt wurde. Das frühe Speicherdesign spiegelt einen üblichen ersten Ansatz für den Aufbau eines Objektspeichers wider: jedes Feld wird separat gespeichert.</p>
<p>In V1 wird jedes Feld in einer <a href="https://milvus.io/docs/manage-collections.md">Sammlung</a> in separaten binlog-Dateien <a href="https://milvus.io/docs/glossary.md">segmentübergreifend</a> gespeichert.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_5_08cf1c8ec1.png" alt="Milvus V1 storage layout showing a collection split into segments, with each segment storing fields like id, vector, and scalar data in separate binlog files, plus separate stats_log files for file statistics" class="doc-image" id="milvus-v1-storage-layout-showing-a-collection-split-into-segments,-with-each-segment-storing-fields-like-id,-vector,-and-scalar-data-in-separate-binlog-files,-plus-separate-stats_log-files-for-file-statistics" />
   </span> <span class="img-wrapper"> <span>Das Speicherlayout von Milvus V1 zeigt eine in Segmente aufgeteilte Sammlung, wobei jedes Segment Felder wie id-, Vektor- und Skalardaten in separaten binlog-Dateien speichert, sowie separate stats_log-Dateien für Dateistatistiken</span> </span></p>
<h3 id="How-Does-Milvus-V1-Locate-Data" class="common-anchor-header">Wie findet Milvus V1 die Daten?</h3><p>Betrachten Sie eine einfache Abfrage: <code translate="no">SELECT id, vector FROM collection WHERE id = 123</code>.</p>
<ol>
<li><strong>Metadaten-Lookup</strong> - Abfrage von etcd/MySQL für die Segmentliste → Lesen des id-Feldes über die Segmente <code translate="no">[Segment 12345, 12346, 12347, …]</code></li>
<li><strong>Lesen des id-Feldes in allen Segmenten</strong> - Für jedes Segment die id-Binlog-Dateien lesen</li>
<li><strong>Suche nach der Zielzeile</strong> - Scannen der geladenen id-Daten, um zu finden <code translate="no">id = 123</code></li>
<li><strong>Lesen des Vektorfeldes</strong> - Lesen der entsprechenden Vektor-Binlogdateien für das passende Segment</li>
</ol>
<p>Dateizugriffe insgesamt: <strong>N × (F₁ + F₂ + ...)</strong> wobei N = Anzahl der Segmente, F = binlog-Dateien pro Feld.</p>
<p>Die Rechnung wird schnell hässlich. Für eine Sammlung mit 100 Feldern, 1.000 Segmenten und 5 binlog-Dateien pro Feld:</p>
<blockquote>
<p><strong>1.000 × 100 × 5 = 500.000 Dateien</strong></p>
</blockquote>
<p>Selbst wenn eine Abfrage nur drei Felder berührt, sind das 15.000 Aufrufe der Objektspeicher-API. Bei 50 ms pro S3-Anfrage erreicht die serialisierte Latenz <strong>750 Sekunden</strong> - über 12 Minuten für eine einzige Abfrage.</p>
<h2 id="Milvus-V2-How-Segment-Level-Parquet-Cuts-API-Calls-by-10x" class="common-anchor-header">Milvus V2: Wie Segment-Level Parquet die API-Aufrufe um das 10-fache reduziert<button data-href="#Milvus-V2-How-Segment-Level-Parquet-Cuts-API-Calls-by-10x" class="anchor-icon" translate="no">
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
    </button></h2><p>Um die Grenzen der Skalierbarkeit in V1 zu beheben, nimmt Milvus V2 eine grundlegende Änderung vor: Die Daten werden nach <a href="https://milvus.io/docs/glossary.md">Segmenten</a> statt nach Feldern organisiert. Anstatt vieler kleiner binlog-Dateien werden in V2 die Daten in segmentbasierten Parquet-Dateien konsolidiert.</p>
<p>Die Anzahl der Dateien sinkt von <code translate="no">N × fields × binlogs</code> auf etwa <code translate="no">N</code> (eine Dateigruppe pro Segment).</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_7_95db65a6e0.png" alt="Milvus V2 storage layout showing a segment stored as Parquet files with row groups containing column chunks for id, vector, and timestamp, plus a footer with schema and column statistics" class="doc-image" id="milvus-v2-storage-layout-showing-a-segment-stored-as-parquet-files-with-row-groups-containing-column-chunks-for-id,-vector,-and-timestamp,-plus-a-footer-with-schema-and-column-statistics" />
   </span> <span class="img-wrapper"> <span>Das Milvus-V2-Speicherlayout zeigt ein als Parquet-Dateien gespeichertes Segment mit Zeilengruppen, die Spaltenblöcke für ID, Vektor und Zeitstempel enthalten, sowie eine Fußzeile mit Schema- und Spaltenstatistiken</span> </span></p>
<p>V2 speichert jedoch nicht alle Felder in einer einzigen Datei. Es gruppiert die Felder nach Größe:</p>
<ul>
<li><strong>Kleine <a href="https://milvus.io/docs/scalar_index.md">skalare Felder</a></strong> (wie id, timestamp) werden zusammen gespeichert.</li>
<li><strong>Große Felder</strong> (wie <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">dichte Vektoren</a>) werden in eigene Dateien aufgeteilt</li>
</ul>
<p>Alle Dateien gehören zu demselben Segment, und die Zeilen werden nach dem Index über die Dateien hinweg ausgerichtet.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_9_fe4f57a1e0.png" alt="Parquet file structure showing row groups with column chunks and compressed data pages, plus a footer containing file metadata, row group metadata, and column statistics like min/max values" class="doc-image" id="parquet-file-structure-showing-row-groups-with-column-chunks-and-compressed-data-pages,-plus-a-footer-containing-file-metadata,-row-group-metadata,-and-column-statistics-like-min/max-values" />
   </span> <span class="img-wrapper"> <span>Parquet-Dateistruktur mit Zeilengruppen mit Spaltenblöcken und komprimierten Datenseiten sowie einer Fußzeile mit Dateimetadaten, Zeilengruppen-Metadaten und Spaltenstatistiken wie Min/Max-Werten</span> </span></p>
<h3 id="How-Does-Milvus-V2-Locate-Data" class="common-anchor-header">Wie findet Milvus V2 die Daten?</h3><p>Für dieselbe Abfrage - <code translate="no">SELECT id, vector FROM collection WHERE id = 123</code>:</p>
<ol>
<li><strong>Metadaten-Lookup</strong> - Abrufen der Segmentliste → Lesen von Parquet-Fußzeilen <code translate="no">[12345, 12346, …]</code></li>
<li><strong>Parquet-Fußzeilen lesen</strong> - Zeilengruppenstatistiken extrahieren. Prüfen Sie das Minimum/Maximum der id-Spalte pro Zeilengruppe. <code translate="no">id = 123</code> fällt in die Zeilengruppe 0 (min=1, max=1000).</li>
<li><strong>Nur lesen, was gebraucht wird</strong> - Die Spaltenbeschneidung von Parquet liest nur die id-Spalte aus der Small-Field-Datei und nur die <a href="https://milvus.io/docs/index-vector-fields.md">Vektorspalte</a> aus der Large-Field-Datei. Es wird nur auf passende Zeilengruppen zugegriffen.</li>
</ol>
<p>Die Aufteilung großer Felder bietet zwei wesentliche Vorteile:</p>
<ul>
<li><strong>Effizientere Lesevorgänge.</strong> <a href="https://zilliz.com/glossary/vector-embeddings">Vektoreinbettungen</a> dominieren die Speichergröße. Zusammen mit kleinen Feldern begrenzen sie die Anzahl der Zeilen, die in eine Zeilengruppe passen, was die Dateizugriffe erhöht. Durch ihre Isolierung können Zeilengruppen mit kleinen Feldern viel mehr Zeilen aufnehmen, während große Felder Layouts verwenden, die für ihre Größe optimiert sind.</li>
<li><strong>Flexible <a href="https://milvus.io/docs/schema.md">Schema-Entwicklung</a>.</strong> Das Hinzufügen einer Spalte bedeutet das Erstellen einer neuen Datei. Das Entfernen einer Spalte bedeutet, dass sie zur Lesezeit übersprungen wird. Es müssen keine historischen Daten neu geschrieben werden.</li>
</ul>
<p>Das Ergebnis: Die Anzahl der Dateien sinkt um mehr als das Zehnfache, die API-Aufrufe um mehr als das Zehnfache und die Abfragelatenz sinkt von Minuten auf Sekunden.</p>
<h2 id="Milvus-V1-vs-V2" class="common-anchor-header">Milvus V1 vs. V2<button data-href="#Milvus-V1-vs-V2" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>Aspekt</th><th>V1</th><th>V2</th></tr>
</thead>
<tbody>
<tr><td>Dateiorganisation</td><td>Aufgeteilt nach Feldern</td><td>Integriert nach Segmenten</td></tr>
<tr><td>Dateien pro Sammlung</td><td>N × Felder × binlogs</td><td>~N × Spaltengruppen</td></tr>
<tr><td>Speicherformat</td><td>Benutzerdefiniertes Binlog</td><td>Parquet (unterstützt auch Lance und Vortex)</td></tr>
<tr><td>Säulenbeschneidung</td><td>Natürlich (Dateien auf Feldebene)</td><td>Parquet-Spaltenbeschneidung</td></tr>
<tr><td>Statistik</td><td>Separate stats_log-Dateien</td><td>Eingebettet in Parquet-Fußzeile</td></tr>
<tr><td>S3-API-Aufrufe pro Abfrage</td><td>10,000+</td><td>~1,000</td></tr>
<tr><td>Abfrage-Latenzzeit</td><td>Minuten</td><td>Sekunden</td></tr>
</tbody>
</table>
<h2 id="Apache-Iceberg-Metadata-Driven-File-Pruning" class="common-anchor-header">Apache Iceberg: Metadaten-gesteuertes File Pruning<button data-href="#Apache-Iceberg-Metadata-Driven-File-Pruning" class="anchor-icon" translate="no">
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
    </button></h2><p>Apache Iceberg verwaltet analytische Tabellen über umfangreiche Datensätze in Lakehouse-Systemen. Wenn sich eine Tabelle über Tausende von Dateien erstreckt, besteht die Herausforderung darin, eine Abfrage auf die relevanten Dateien einzugrenzen - ohne alle Dateien zu scannen.</p>
<p>Die Antwort von Iceberg: Die Entscheidung, welche Dateien gelesen werden sollen <em>, bevor</em> eine Datenein- oder -ausgabe erfolgt, wird mit Hilfe von mehrschichtigen Metadaten getroffen. Dies ist das gleiche Prinzip wie bei der <a href="https://zilliz.com/learn/metadata-filtering-with-milvus">Filterung von Metadaten</a> in Vektordatenbanken - vorberechnete Statistiken werden verwendet, um irrelevante Daten zu überspringen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_8_a9b063bdbe.png" alt="Iceberg data organization showing a metadata directory with metadata.json, manifest lists, and manifest files alongside a data directory with date-partitioned Parquet files" class="doc-image" id="iceberg-data-organization-showing-a-metadata-directory-with-metadata.json,-manifest-lists,-and-manifest-files-alongside-a-data-directory-with-date-partitioned-parquet-files" />
   </span> <span class="img-wrapper"> <span>Die Iceberg-Datenorganisation zeigt ein Metadatenverzeichnis mit metadata.json, Manifestlisten und Manifestdateien neben einem Datenverzeichnis mit datumsseparierten Parquet-Dateien</span> </span></p>
<p>Iceberg verwendet eine mehrschichtige Metadatenstruktur. Jede Schicht filtert irrelevante Daten heraus, bevor die nächste konsultiert wird - ähnlich wie bei <a href="https://milvus.io/docs/architecture_overview.md">verteilten Datenbanken</a>, die Metadaten von den Daten trennen, um einen effizienten Zugriff zu ermöglichen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_6_afc159ea22.png" alt="Iceberg four-layer architecture: metadata.json points to manifest lists, which reference manifest files containing file-level statistics, which point to actual Parquet data files" class="doc-image" id="iceberg-four-layer-architecture:-metadata.json-points-to-manifest-lists,-which-reference-manifest-files-containing-file-level-statistics,-which-point-to-actual-parquet-data-files" />
   </span> <span class="img-wrapper"> <span>Icebergs vierschichtige Architektur: metadata.json verweist auf Manifestlisten, die auf Manifestdateien verweisen, welche Statistiken auf Dateiebene enthalten, die wiederum auf die eigentlichen Parquet-Datendateien verweisen</span> </span></p>
<h3 id="How-Does-Iceberg-Locate-Data" class="common-anchor-header">Wie findet Iceberg die Daten?</h3><p>Überlegen Sie: <code translate="no">SELECT * FROM orders WHERE date='2024-01-15' AND amount&gt;1000</code>.</p>
<ol>
<li><strong>Lesen von metadata.json</strong> (1 I/O) - Laden des aktuellen Snapshots und seiner Manifestlisten</li>
<li><strong>Lesen der Manifestliste</strong> (1 E/A) - Anwenden von Filtern <a href="https://milvus.io/docs/use-partition-key.md">auf Partitionsebene</a>, um ganze Partitionen zu überspringen (z. B. werden alle 2023-Daten eliminiert)</li>
<li><strong>Lesen der Manifestdateien</strong> (2 E/A) - Verwendung von Statistiken auf Dateiebene (Mindest-/Maximaldatum, Mindest-/Maximalmenge) zur Eliminierung von Dateien, die der Abfrage nicht entsprechen können</li>
<li><strong>Lesen von Datendateien</strong> (3 E/A) - Nur drei Dateien bleiben übrig und werden tatsächlich gelesen.</li>
</ol>
<p>Anstatt alle 1.000 Datendateien zu scannen, schließt Iceberg die Suche in <strong>7 E/A-Operationen</strong> ab und vermeidet so über 94 % der unnötigen Lesevorgänge.</p>
<h2 id="How-Different-Systems-Address-Data" class="common-anchor-header">Wie verschiedene Systeme Daten adressieren<button data-href="#How-Different-Systems-Address-Data" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>System</th><th>Organisation der Daten</th><th>Kern-Adressierungsmechanismus</th><th>Zugriffskosten</th></tr>
</thead>
<tbody>
<tr><td>HashMap</td><td>Schlüssel → Array-Slot</td><td>Hash-Funktion → direkter Index</td><td>O(1) Speicherzugriff</td></tr>
<tr><td>HDFS</td><td>Pfad → Block → DataNode</td><td>In-Memory HashMaps + Blockberechnung</td><td>1 RPC + N Blocklesungen</td></tr>
<tr><td>Kafka</td><td>Thema → Partition → Segment</td><td>TreeMap + spärlicher Index + sequentieller Scan</td><td>1 Indexnachschlag + 1 Datenlesung</td></tr>
<tr><td><a href="https://milvus.io/">Milvus</a> V2</td><td><a href="https://milvus.io/docs/manage-collections.md">Sammlung</a> → Segment → Parquet-Spalten</td><td>Nachschlagen von Metadaten + Spaltenbeschneidung</td><td>N Lesevorgänge (N = Segmente)</td></tr>
<tr><td>Eisberg</td><td>Tabelle → Schnappschuss → Manifest → Datendateien</td><td>Schichtweise Metadaten + statistisches Pruning</td><td>3 Metadatenlesungen + M Datenlesungen</td></tr>
</tbody>
</table>
<h2 id="Three-Principles-Behind-Efficient-Data-Addressing" class="common-anchor-header">Drei Prinzipien der effizienten Datenadressierung<button data-href="#Three-Principles-Behind-Efficient-Data-Addressing" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Computation-Always-Beats-Search" class="common-anchor-header">1. Berechnung ist immer besser als Suche</h3><p>Bei allen von uns untersuchten Systemen folgt die effektivste Optimierung derselben Regel: Berechnen Sie, wo sich die Daten befinden, anstatt sie zu suchen.</p>
<ul>
<li>HashMap berechnet einen Array-Index von <code translate="no">hash(key)</code>, anstatt zu scannen.</li>
<li>HDFS berechnet den Zielblock aus einem Dateiversatz, anstatt die Metadaten des Dateisystems zu durchsuchen</li>
<li>Kafka berechnet das relevante Segment und die Indexposition, anstatt das Protokoll zu scannen</li>
<li>Iceberg verwendet Prädikate und Statistiken auf Dateiebene, um zu berechnen, welche Dateien lesenswert sind.</li>
</ul>
<p>Berechnung ist Arithmetik mit festen Kosten. Die Suche ist eine Durchquerung - Vergleiche, Zeigerjagd oder E/A - und die Kosten wachsen mit der Datengröße. Wenn ein System einen Ort direkt ableiten kann, wird das Scannen überflüssig.</p>
<h3 id="2-Minimize-High-Latency-Accesses" class="common-anchor-header">2. Minimierung von Zugriffen mit hoher Latenz</h3><p>Damit sind wir wieder bei der Kernformel angelangt: <strong>Gesamtadressierungskosten = Metadatenzugriffe + Datenzugriffe.</strong> Jede Optimierung zielt letztlich darauf ab, diese Operationen mit hoher Latenzzeit zu reduzieren.</p>
<table>
<thead>
<tr><th>Muster</th><th>Beispiel</th></tr>
</thead>
<tbody>
<tr><td>Verringern der Dateianzahl zur Begrenzung des API-Fan-Outs</td><td>Milvus V2 Segment-Konsolidierung</td></tr>
<tr><td>Verwendung von Statistiken, um Daten frühzeitig auszuschließen</td><td>Eisberg-Manifest-Bereinigung</td></tr>
<tr><td>Cache-Metadaten im Speicher</td><td>HDFS NameNode, Kafka mmap-Indizes</td></tr>
<tr><td>Kleine sequenzielle Scans gegen weniger zufällige Lesevorgänge tauschen</td><td>Kafka Sparse-Index</td></tr>
</tbody>
</table>
<h3 id="3-Statistics-Enable-Early-Decisions" class="common-anchor-header">3. Statistiken ermöglichen frühe Entscheidungen</h3><p>Durch die Aufzeichnung einfacher Informationen zum Zeitpunkt des Schreibens - Minimal-/Maximalwerte, Partitionsgrenzen, Zeilenzahl - können Systeme zum Zeitpunkt des Lesens entscheiden, welche Dateien lesenswert sind und welche vollständig übersprungen werden können.</p>
<p>Dies ist eine kleine Investition mit großem Nutzen. Statistiken machen den Dateizugriff von einem blinden Lesen zu einer bewussten Entscheidung. Ob Icebergs Pruning auf Manifest-Ebene oder die Parquet-Footer-Statistiken von Milvus V2, das Prinzip ist dasselbe: Ein paar Bytes Metadaten beim Schreiben können Tausende von E/A-Operationen beim Lesen vermeiden.</p>
<h2 id="Conclusion" class="common-anchor-header">Schlussfolgerung<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Von Two Sum zu HashMap und von HDFS und Kafka zu Milvus und Apache Iceberg, ein Muster wiederholt sich immer wieder: Die Leistung hängt davon ab, wie effizient ein System Daten lokalisiert.</p>
<p>Mit dem Wachstum der Daten und der Verlagerung der Speicherung vom Arbeitsspeicher über die Festplatte zum Objektspeicher ändern sich die Mechanismen, nicht aber die Kerngedanken. Die besten Systeme berechnen Speicherorte, anstatt sie zu durchsuchen, halten Metadaten in der Nähe und verwenden Statistiken, um Daten zu vermeiden, die nicht wichtig sind. Alle von uns untersuchten Leistungssteigerungen beruhen auf der Reduzierung von Zugriffen mit hoher Latenz und der frühestmöglichen Eingrenzung des Suchraums.</p>
<p>Unabhängig davon, ob Sie eine <a href="https://zilliz.com/learn/what-is-vector-search">Vektorsuchpipeline</a> entwickeln, Systeme für <a href="https://zilliz.com/learn/introduction-to-unstructured-data">unstrukturierte Daten</a> aufbauen oder eine Lakehouse-Abfrage-Engine optimieren, gilt die gleiche Gleichung. Zu verstehen, wie Ihr System Daten anspricht, ist der erste Schritt, um es schneller zu machen.</p>
<hr>
<p>Wenn Sie mit Milvus arbeiten und Ihre Speicher- oder Abfrageleistung optimieren möchten, helfen wir Ihnen gerne:</p>
<ul>
<li>Treten Sie der <a href="https://slack.milvus.io/">Milvus-Slack-Community</a> bei, um Fragen zu stellen, Ihre Architektur zu teilen und von anderen Ingenieuren zu lernen, die an ähnlichen Problemen arbeiten.</li>
<li><a href="https://milvus.io/office-hours">Buchen Sie eine kostenlose 20-minütige Milvus-Sprechstunde</a>, um Ihren Anwendungsfall zu besprechen - egal, ob es sich um Speicherlayout, Abfrageoptimierung oder Skalierung auf Produktion handelt.</li>
<li>Wenn Sie die Einrichtung der Infrastruktur lieber überspringen möchten, bietet <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (managed Milvus) ein kostenloses Tier für den Einstieg.</li>
</ul>
<hr>
<p>Ein paar Fragen, die auftauchen, wenn Ingenieure über Datenadressierung und Speicherdesign nachdenken:</p>
<p><strong>F: Warum hat Milvus von der Feld- zur Segmentebene gewechselt?</strong></p>
<p>In Milvus V1 wurde jedes Feld segmentübergreifend in separaten binlog-Dateien gespeichert. Bei einer Sammlung mit 100 Feldern und 1.000 Segmenten entstanden so Hunderttausende kleiner Dateien, die jeweils einen eigenen S3-API-Aufruf erforderten. V2 konsolidiert Daten in segmentbasierten Parquet-Dateien, wodurch die Anzahl der Dateien um mehr als das Zehnfache reduziert und die Abfragelatenz von Minuten auf Sekunden gesenkt werden konnte. Die wichtigste Erkenntnis: Bei Objektspeichern ist die Anzahl der API-Aufrufe wichtiger als das Gesamtdatenvolumen.</p>
<p><strong>F: Wie kann Milvus sowohl die Vektorsuche als auch die skalare Filterung effizient handhaben?</strong></p>
<p>Milvus V2 speichert <a href="https://milvus.io/docs/scalar_index.md">skalare Felder</a> und <a href="https://milvus.io/docs/index-vector-fields.md">Vektorfelder</a> in separaten Dateigruppen innerhalb desselben Segments. Skalare Abfragen verwenden Parquet-Spaltenbeschneidung und Zeilengruppenstatistiken, um irrelevante Daten zu überspringen. Die <a href="https://zilliz.com/learn/what-is-vector-search">Vektorsuche</a> verwendet spezielle <a href="https://zilliz.com/learn/vector-index">Vektorindizes</a>. Beide nutzen dieselbe Segmentstruktur, so dass <a href="https://zilliz.com/learn/hybrid-search-a-practical-guide">hybride Abfragen</a> - die skalare Filter mit vektorieller Ähnlichkeit kombinieren - auf denselben Daten ohne Duplizierung arbeiten können.</p>
<p><strong>F: Gilt für Vektordatenbanken der Grundsatz "Rechnen vor Suchen"?</strong></p>
<p>Ja. <a href="https://zilliz.com/learn/vector-index">Vektorindizes</a> wie HNSW und IVF basieren auf der gleichen Idee. Anstatt einen Abfragevektor mit jedem gespeicherten Vektor zu vergleichen (Brute-Force-Suche), verwenden sie Graphenstrukturen oder Clusterschwerpunkte, um ungefähre Nachbarschaften zu berechnen und direkt zu relevanten Regionen des Vektorraums zu springen. Der Kompromiss - ein kleiner Genauigkeitsverlust für eine um Größenordnungen geringere Anzahl von Abstandsberechnungen - ist das gleiche Muster "Berechnung vor Suche", das bei hochdimensionalen <a href="https://zilliz.com/glossary/vector-embeddings">Einbettungsdaten</a> angewandt wird.</p>
<p><strong>F: Was ist der größte Leistungsfehler, den Teams bei der Objektspeicherung machen?</strong></p>
<p>Die Erstellung zu vieler kleiner Dateien. Jede S3-GET-Anfrage hat eine feste Latenzzeit (~50 ms), unabhängig davon, wie viele Daten sie zurückgibt. Ein System, das 10.000 kleine Dateien liest, hat eine Latenz von 500 Sekunden - selbst wenn das Gesamtdatenvolumen bescheiden ist. Die Lösung liegt in der Konsolidierung: kleine Dateien in größere zusammenführen, kolumnare Formate wie Parquet für selektive Lesevorgänge verwenden und Metadaten pflegen, die das Überspringen von Dateien ermöglichen.</p>
