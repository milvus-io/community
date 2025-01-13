---
id: inside-milvus-1.1.0.md
title: Neue Funktionen
author: milvus
date: 2021-05-20T08:35:42.700Z
desc: >-
  Milvus v1.1.0 ist da! Neue Funktionen, Verbesserungen und Fehlerbehebungen
  sind jetzt verfügbar.
cover: assets.zilliz.com/v1_1_cover_487e70971a.jpeg
tag: News
canonicalUrl: 'https://zilliz.com/blog/inside-milvus-1.1.0'
---
<custom-h1>Innerhalb von Milvus 1.1.0</custom-h1><p><a href="https://github.com/milvus-io">Milvus</a> ist ein fortlaufendes Open-Source-Software (OSS)-Projekt mit dem Ziel, die schnellste und zuverlässigste Vektordatenbank der Welt zu entwickeln. Die neuen Funktionen in Milvus v1.1.0 sind das erste von vielen Updates, die dank der langjährigen Unterstützung der Open-Source-Community und des Sponsorings von Zilliz kommen werden. Dieser Blog-Artikel behandelt die neuen Funktionen, Verbesserungen und Fehlerbehebungen in Milvus v1.1.0.</p>
<p><strong>Springe zu:</strong></p>
<ul>
<li><a href="#new-features">Neue Funktionen</a></li>
<li><a href="#improvements">Verbesserungen</a></li>
<li><a href="#bug-fixes">Fehlerkorrekturen</a></li>
</ul>
<p><br/></p>
<h2 id="New-features" class="common-anchor-header">Neue Funktionen<button data-href="#New-features" class="anchor-icon" translate="no">
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
    </button></h2><p>Wie jedes OSS-Projekt ist auch Milvus ein ständiges Projekt. Wir bemühen uns, auf unsere Benutzer und die Open-Source-Gemeinschaft zu hören, um die wichtigsten Funktionen zu priorisieren. Das neueste Update, Milvus v1.1.0, bietet die folgenden neuen Funktionen:</p>
<h3 id="Specify-partitions-with-getentitybyid-method-calls" class="common-anchor-header">Partitionen mit <code translate="no">get_entity_by_id()</code> Methodenaufrufen spezifizieren</h3><p>Um die Suche nach Vektorähnlichkeit weiter zu beschleunigen, unterstützt Milvus 1.1.0 nun die Abfrage von Vektoren aus einer bestimmten Partition. Im Allgemeinen unterstützt Milvus die Abfrage von Vektoren durch angegebene Vektor-IDs. In Milvus 1.0 wird durch den Aufruf der Methode <code translate="no">get_entity_by_id()</code> die gesamte Sammlung durchsucht, was bei großen Datensätzen zeitaufwändig sein kann. Wie aus dem nachstehenden Code hervorgeht, verwendet <code translate="no">GetVectorsByIdHelper</code> eine <code translate="no">FileHolder</code> Struktur, um eine Schleife zu durchlaufen und einen bestimmten Vektor zu finden.</p>
<pre><code translate="no">std::vector&lt;meta::CollectionSchema&gt; collection_array; 
 <span class="hljs-type">auto</span> <span class="hljs-variable">status</span> <span class="hljs-operator">=</span> meta_ptr_-&gt;ShowPartitions(collection.collection_id_, collection_array); 
  
 collection_array.push_back(collection); 
 status = meta_ptr_-&gt;FilesByTypeEx(collection_array, file_types, files_holder); 
 <span class="hljs-keyword">if</span> (!status.ok()) { 
     std::<span class="hljs-type">string</span> <span class="hljs-variable">err_msg</span> <span class="hljs-operator">=</span> <span class="hljs-string">&quot;Failed to get files for GetVectorByID: &quot;</span> + status.message(); 
     LOG_ENGINE_ERROR_ &lt;&lt; err_msg; 
     <span class="hljs-keyword">return</span> status; 
 } 
  
 <span class="hljs-keyword">if</span> (files_holder.HoldFiles().empty()) { 
     LOG_ENGINE_DEBUG_ &lt;&lt; <span class="hljs-string">&quot;No files to get vector by id from&quot;</span>; 
     <span class="hljs-keyword">return</span> Status(DB_NOT_FOUND, <span class="hljs-string">&quot;Collection is empty&quot;</span>); 
 } 
  
 cache::CpuCacheMgr::GetInstance()-&gt;PrintInfo(); 
 status = GetVectorsByIdHelper(id_array, vectors, files_holder); 
DBImpl::GetVectorsByIdHelper(const IDNumbers&amp; id_array, std::vector&lt;engine::VectorsData&gt;&amp; vectors, 
                              meta::FilesHolder&amp; files_holder) { 
     <span class="hljs-comment">// attention: this is a copy, not a reference, since the files_holder.UnMarkFile will change the array internal </span>
     milvus::engine::meta::<span class="hljs-type">SegmentsSchema</span> <span class="hljs-variable">files</span> <span class="hljs-operator">=</span> files_holder.HoldFiles(); 
     LOG_ENGINE_DEBUG_ &lt;&lt; <span class="hljs-string">&quot;Getting vector by id in &quot;</span> &lt;&lt; files.size() &lt;&lt; <span class="hljs-string">&quot; files, id count = &quot;</span> &lt;&lt; id_array.size(); 
  
     <span class="hljs-comment">// sometimes not all of id_array can be found, we need to return empty vector for id not found </span>
     <span class="hljs-comment">// for example: </span>
     <span class="hljs-comment">// id_array = [1, -1, 2, -1, 3] </span>
     <span class="hljs-comment">// vectors should return [valid_vector, empty_vector, valid_vector, empty_vector, valid_vector] </span>
     <span class="hljs-comment">// the ID2RAW is to ensure returned vector sequence is consist with id_array </span>
     <span class="hljs-type">using</span> <span class="hljs-variable">ID2VECTOR</span> <span class="hljs-operator">=</span> std::map&lt;int64_t, VectorsData&gt;; 
     ID2VECTOR map_id2vector; 
  
     vectors.clear(); 
  
     <span class="hljs-type">IDNumbers</span> <span class="hljs-variable">temp_ids</span> <span class="hljs-operator">=</span> id_array; 
     <span class="hljs-keyword">for</span> (auto&amp; file : files) { 
<button class="copy-code-btn"></button></code></pre>
<p>Diese Struktur wird jedoch nicht nach Partitionen in <code translate="no">FilesByTypeEx()</code> gefiltert. In Milvus v1.1.0 ist es möglich, dass das System Partitionsnamen an die <code translate="no">GetVectorsIdHelper</code> -Schleife weitergibt, so dass <code translate="no">FileHolder</code> nur Segmente aus bestimmten Partitionen enthält. Anders ausgedrückt: Wenn Sie genau wissen, zu welcher Partition der zu suchende Vektor gehört, können Sie den Partitionsnamen in einem <code translate="no">get_entity_by_id()</code> Methodenaufruf angeben, um den Suchprozess zu beschleunigen.</p>
<p>Wir haben nicht nur Änderungen am Code zur Steuerung von Systemabfragen auf der Milvus-Servereinheit vorgenommen, sondern auch alle unsere SDKs (Python, Go, C++, Java und RESTful) aktualisiert, indem wir einen Parameter zur Angabe von Partitionsnamen hinzugefügt haben. Zum Beispiel wird in pymilvus die Definition von <code translate="no">get_entity_by_id</code> <code translate="no">def get_entity_by_id(self, collection_name, ids, timeout=None)</code> in <code translate="no">def get_entity_by_id(self, collection_name, partition_tags=None, ids, timeout=None)</code> geändert.</p>
<p><br/></p>
<h3 id="Specify-partitions-with-deleteentitybyid-method-calls" class="common-anchor-header">Partitionen mit <code translate="no">delete_entity_by_id()</code> Methodenaufrufen spezifizieren</h3><p>Um die Vektorverwaltung effizienter zu gestalten, unterstützt Milvus v1.1.0 nun die Angabe von Partitionsnamen beim Löschen eines Vektors in einer Sammlung. In Milvus 1.0 können Vektoren in einer Sammlung nur nach ID gelöscht werden. Beim Aufruf der Löschmethode durchsucht Milvus alle Vektoren in der Sammlung. Es ist jedoch weitaus effizienter, nur die relevanten Partitionen zu scannen, wenn man mit massiven Millionen-, Milliarden- oder sogar Billionen-Vektordatensätzen arbeitet. Ähnlich wie bei der neuen Funktion zur Angabe von Partitionen mit den Methodenaufrufen von <code translate="no">get_entity_by_id()</code> wurden am Milvus-Code Änderungen vorgenommen, die auf derselben Logik beruhen.</p>
<p><br/></p>
<h3 id="New-method-releasecollection" class="common-anchor-header">Neue Methode <code translate="no">release_collection()</code></h3><p>Um Speicher freizugeben, den Milvus zum Laden von Sammlungen zur Laufzeit verwendet, wurde in Milvus v1.1.0 eine neue Methode <code translate="no">release_collection()</code> hinzugefügt, um bestimmte Sammlungen manuell aus dem Cache zu entladen.</p>
<p><br/></p>
<h2 id="Improvements" class="common-anchor-header">Verbesserungen<button data-href="#Improvements" class="anchor-icon" translate="no">
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
    </button></h2><p>Obwohl neue Funktionen normalerweise der letzte Schrei sind, ist es auch wichtig, das zu verbessern, was wir bereits haben. Im Folgenden finden Sie Upgrades und andere allgemeine Verbesserungen gegenüber Milvus v1.0.</p>
<p><br/></p>
<h3 id="Improved-performance-of-getentitybyid-method-call" class="common-anchor-header">Verbesserte Leistung von <code translate="no">get_entity_by_id()</code> Methodenaufrufen</h3><p>Das folgende Diagramm ist ein Vergleich der Vektorsuchleistung zwischen Milvus v1.0 und Milvus v1.1.0:</p>
<blockquote>
<p>CPU: Intel® Core™ i7-8550U CPU @ 1.80GHz * 8 <br/>Segmentdateigröße = 1024 MB <br/>Zeilenanzahl = 1.000.000 <br/>Dim = 128</p>
</blockquote>
<table>
<thead>
<tr><th style="text-align:center">Abfrage-ID Nr.</th><th style="text-align:center">v 1.0.0</th><th style="text-align:center">v1.1.0</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">10</td><td style="text-align:center">9 ms</td><td style="text-align:center">2 ms</td></tr>
<tr><td style="text-align:center">100</td><td style="text-align:center">149 ms</td><td style="text-align:center">19 ms</td></tr>
</tbody>
</table>
<p><br/></p>
<h3 id="Hnswlib-upgraded-to-v050" class="common-anchor-header">Hnswlib wurde auf v0.5.0 aktualisiert</h3><p>Milvus übernimmt mehrere weit verbreitete Indexbibliotheken, darunter Faiss, NMSLIB, Hnswlib und Annoy, um den Prozess der Auswahl des richtigen Indextyps für ein bestimmtes Szenario zu vereinfachen.</p>
<p>Hnswlib wurde von v0.3.0 auf v0.5.0 in Milvus 1.1.0 aktualisiert, da in der früheren Version ein Fehler entdeckt wurde. Außerdem verbessert das Upgrade der Hnswlib die Leistung von <code translate="no">addPoint()</code> bei der Indexerstellung.</p>
<p>Ein Zilliz-Entwickler hat einen Pull Request (PR) erstellt, um die Leistung der Hnswlib beim Aufbau von Indizes in Milvus zu verbessern. Siehe <a href="https://github.com/nmslib/hnswlib/pull/298">PR #298</a> für Details.</p>
<p>Das folgende Diagramm ist ein Vergleich der <code translate="no">addPoint()</code> Leistung zwischen Hnswlib 0.5.0 und dem vorgeschlagenen PR:</p>
<blockquote>
<p>CPU: Intel® Core™ i7-8550U CPU @ 1.80GHz * 8 <br/>Dataset: sift_1M (row count = 1000000, dim = 128, space = L2)</p>
</blockquote>
<table>
<thead>
<tr><th style="text-align:center"></th><th style="text-align:center">0.5.0</th><th style="text-align:center">PR-298</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">M = 16, ef_construction = 100</td><td style="text-align:center">274406 ms</td><td style="text-align:center">265631 ms</td></tr>
<tr><td style="text-align:center">M = 16, ef_construction = 200</td><td style="text-align:center">522411 ms</td><td style="text-align:center">499639 ms</td></tr>
</tbody>
</table>
<p><br/></p>
<h3 id="Improved-IVF-index-training-performance" class="common-anchor-header">Verbesserte IVF-Indextrainingsleistung</h3><p>Das Erstellen eines Indexes umfasst das Trainieren, Einfügen und Schreiben von Daten auf die Festplatte. Milvus 1.1.0 verbessert die Trainingskomponente der Indexerstellung. Das folgende Diagramm ist ein Vergleich der IVF-Indextrainingsleistung zwischen Milvus 1.0 und Milvus 1.1.0:</p>
<blockquote>
<p>CPU: Intel® Core™ i7-8550U CPU @ 1.80GHz * 8 <br/>Datensatz: sift_1m (row_count = 1000000, dim = 128, metric_type = L2)</p>
</blockquote>
<table>
<thead>
<tr><th style="text-align:center"></th><th style="text-align:center">v1.0.0 (ms)</th><th style="text-align:center">v1.1.0 (ms)</th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">ivf_flat (nlist = 2048)</td><td style="text-align:center">90079</td><td style="text-align:center">81544</td></tr>
<tr><td style="text-align:center">ivf_pq (nListe = 2048, m=16)</td><td style="text-align:center">103535</td><td style="text-align:center">97115</td></tr>
<tr><td style="text-align:center">ivf_pq (nListe = 2048, m=32)</td><td style="text-align:center">108638</td><td style="text-align:center">104558</td></tr>
<tr><td style="text-align:center">ivf_flach (nListe = 4096)</td><td style="text-align:center">340643</td><td style="text-align:center">310685</td></tr>
<tr><td style="text-align:center">ivf_pq (nListe = 4096, m=16)</td><td style="text-align:center">351982</td><td style="text-align:center">323758</td></tr>
<tr><td style="text-align:center">ivf_pq (nListe = 4096, m=32)</td><td style="text-align:center">357359</td><td style="text-align:center">330887</td></tr>
</tbody>
</table>
<p><br/></p>
<h2 id="Bug-fixes" class="common-anchor-header">Fehlerbehebungen<button data-href="#Bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir haben auch einige Fehler behoben, um Milvus stabiler und effizienter bei der Verwaltung von Vektordatensätzen zu machen. Siehe <a href="https://milvus.io/docs/v1.1.0/release_notes.md#Fixed-issues">Behobene Probleme</a> für weitere Details.</p>
