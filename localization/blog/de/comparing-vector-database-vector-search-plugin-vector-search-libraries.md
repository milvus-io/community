---
id: comparing-vector-database-vector-search-plugin-vector-search-libraries.md
title: 'Vergleich von Vektordatenbanken, Vektorsuchbibliotheken und Vektorsuch-Plugins'
author: Frank Liu
date: 2023-11-9
desc: >-
  In diesem Beitrag werden wir das komplexe Gebiet der Vektorsuche weiter
  erkunden und Vektordatenbanken, Vektorsuch-Plugins und Vektorsuchbibliotheken
  vergleichen.
cover: >-
  assets.zilliz.com/Vector_Databases_vs_Vector_Search_Plugins_vs_Vector_Search_Libraries_74def521ad.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  vector search
recommend: true
canonicalUrl: >-
  https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Vector_Databases_vs_Vector_Search_Plugins_vs_Vector_Search_Libraries_74def521ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Hallo - willkommen zurück zu Vektordatenbank 101!</p>
<p>Die Zunahme von <a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a> und anderen großen Sprachmodellen (LLMs) hat das Wachstum von Vektorsuchtechnologien vorangetrieben, die spezialisierte Vektordatenbanken wie <a href="https://zilliz.com/what-is-milvus">Milvus</a> und <a href="https://zilliz.com/cloud">Zilliz Cloud</a> neben Bibliotheken wie <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a> und integrierten Vektorsuch-Plugins in herkömmlichen Datenbanken umfassen.</p>
<p>In unserem <a href="https://zilliz.com/learn/what-is-vector-database">letzten Beitrag der Serie</a> haben wir uns mit den Grundlagen von Vektordatenbanken beschäftigt. In diesem Beitrag setzen wir die Erforschung des komplexen Bereichs der Vektorsuche fort und vergleichen Vektordatenbanken, Vektorsuch-Plugins und Vektorsuchbibliotheken.</p>
<h2 id="What-is-vector-search" class="common-anchor-header">Was ist Vektorsuche?<button data-href="#What-is-vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Die<a href="https://zilliz.com/learn/vector-similarity-search">Vektorsuche</a>, auch bekannt als Vektorähnlichkeitssuche, ist eine Technik zum Abrufen der Top-k-Ergebnisse, die einem gegebenen Abfragevektor am ähnlichsten sind oder semantisch mit ihm verwandt sind, aus einer umfangreichen Sammlung von dichten Vektordaten. Bevor wir eine Ähnlichkeitssuche durchführen, nutzen wir neuronale Netze, um <a href="https://zilliz.com/learn/introduction-to-unstructured-data">unstrukturierte Daten</a> wie Texte, Bilder, Videos und Audiodaten in hochdimensionale numerische Vektoren, die sogenannten Einbettungsvektoren, umzuwandeln. Nach der Erzeugung von Einbettungsvektoren vergleichen Vektorsuchmaschinen den räumlichen Abstand zwischen dem Eingabeabfragevektor und den Vektoren in den Vektorspeichern. Je näher sie sich im Raum befinden, desto ähnlicher sind sie sich.</p>
<p>Auf dem Markt sind mehrere Vektorsuchtechnologien verfügbar, darunter Bibliotheken für maschinelles Lernen wie NumPy von Python, Vektorsuchbibliotheken wie FAISS, Vektorsuch-Plugins, die auf herkömmlichen Datenbanken aufbauen, und spezialisierte Vektordatenbanken wie Milvus und Zilliz Cloud.</p>
<h2 id="Vector-databases-vs-vector-search-libraries" class="common-anchor-header">Vektordatenbanken vs. Vektorsuchbibliotheken<button data-href="#Vector-databases-vs-vector-search-libraries" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/blog/what-is-a-real-vector-database">Spezialisierte Vektordatenbanken</a> sind nicht der einzige Stack für Ähnlichkeitssuchen. Vor dem Aufkommen von Vektordatenbanken wurden viele Vektorsuchbibliotheken, wie FAISS, ScaNN und HNSW, für die Vektorsuche verwendet.</p>
<p>Vektorsuchbibliotheken können Ihnen dabei helfen, schnell einen leistungsstarken Prototyp für ein Vektorsuchsystem zu erstellen. FAISS zum Beispiel ist ein Open-Source-Programm, das von Meta für eine effiziente Ähnlichkeitssuche und ein dichtes Vektorclustering entwickelt wurde. FAISS kann Vektorsammlungen beliebiger Größe verarbeiten, auch solche, die nicht vollständig in den Speicher geladen werden können. Darüber hinaus bietet FAISS Werkzeuge für die Auswertung und die Abstimmung der Parameter. Obwohl in C++ geschrieben, bietet FAISS eine Python/NumPy-Schnittstelle.</p>
<p>Vektorsuchbibliotheken sind jedoch lediglich leichtgewichtige ANN-Bibliotheken und keine verwalteten Lösungen, und sie haben nur eine begrenzte Funktionalität. Wenn Ihr Datensatz klein und begrenzt ist, können diese Bibliotheken für die Verarbeitung unstrukturierter Daten ausreichen, sogar für Systeme, die in der Produktion laufen. Wenn die Datenmengen jedoch größer werden und mehr Benutzer hinzukommen, wird das Skalierungsproblem immer schwieriger zu lösen. Außerdem lassen sie keine Änderungen an ihren Indexdaten zu und können beim Datenimport nicht abgefragt werden.</p>
<p>Im Gegensatz dazu sind Vektordatenbanken eine optimale Lösung für die Speicherung und Abfrage unstrukturierter Daten. Sie können Millionen oder sogar Milliarden von Vektoren speichern und abfragen und gleichzeitig Antworten in Echtzeit liefern; sie sind hoch skalierbar, um den wachsenden Geschäftsanforderungen der Benutzer gerecht zu werden.</p>
<p>Darüber hinaus verfügen Vektordatenbanken wie Milvus über wesentlich benutzerfreundlichere Funktionen für strukturierte/halbstrukturierte Daten: Cloud-Nativität, Mandantenfähigkeit, Skalierbarkeit usw. Diese Funktionen werden im weiteren Verlauf dieses Tutorials deutlich werden.</p>
<p>Außerdem arbeiten sie auf einer völlig anderen Abstraktionsebene als Vektorsuchbibliotheken - Vektordatenbanken sind vollwertige Dienste, während ANN-Bibliotheken dazu gedacht sind, in die von Ihnen entwickelte Anwendung integriert zu werden. In diesem Sinne sind ANN-Bibliotheken eine der vielen Komponenten, auf denen Vektordatenbanken aufgebaut sind, ähnlich wie Elasticsearch auf Apache Lucene aufgebaut ist.</p>
<p>Ein Beispiel dafür, warum diese Abstraktion so wichtig ist, ist das Einfügen eines neuen unstrukturierten Datenelements in eine Vektordatenbank. Das ist in Milvus super einfach:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collectioncollection</span> = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&#x27;book&#x27;</span>)mr = collection.<span class="hljs-title function_">insert</span>(data)
<button class="copy-code-btn"></button></code></pre>
<p>Es ist wirklich so einfach wie das - 3 Zeilen Code. Mit einer Bibliothek wie FAISS oder ScaNN gibt es leider keine einfache Möglichkeit, dies zu tun, ohne den gesamten Index an bestimmten Kontrollpunkten manuell neu zu erstellen. Selbst wenn dies möglich wäre, fehlt es den Vektorsuchbibliotheken immer noch an Skalierbarkeit und Mandantenfähigkeit, zwei der wichtigsten Eigenschaften von Vektordatenbanken.</p>
<h2 id="Vector-databases-vs-vector-search-plugins-for-traditional-databases" class="common-anchor-header">Vektordatenbanken vs. Vektorsuch-Plugins für traditionelle Datenbanken<button data-href="#Vector-databases-vs-vector-search-plugins-for-traditional-databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Gut, nachdem wir nun den Unterschied zwischen Vektorsuchbibliotheken und Vektordatenbanken festgestellt haben, lassen Sie uns einen Blick darauf werfen, wie sich Vektordatenbanken von <strong>Vektorsuch-Plugins</strong> unterscheiden.</p>
<p>Eine zunehmende Anzahl traditioneller relationaler Datenbanken und Suchsysteme wie Clickhouse und <a href="https://zilliz.com/blog/elasticsearch-cloud-vs-zilliz">Elasticsearch</a> enthalten integrierte Vektorsuch-Plugins. Elasticsearch 8.0 enthält zum Beispiel Vektoreingabe- und ANN-Suchfunktionen, die über Restful-API-Endpunkte aufgerufen werden können. Das Problem mit den Vektorsuch-Plugins sollte klar sein: <strong>Diese Lösungen verfolgen keinen ganzheitlichen Ansatz für das Einbettungsmanagement und die Vektorsuche</strong>. Stattdessen sind diese Plugins als Erweiterungen bestehender Architekturen gedacht, wodurch sie begrenzt und nicht optimiert sind. Die Entwicklung einer Anwendung für unstrukturierte Daten auf der Grundlage einer herkömmlichen Datenbank wäre so, als würde man versuchen, Lithiumbatterien und Elektromotoren in den Rahmen eines benzinbetriebenen Autos einzubauen - keine gute Idee!</p>
<p>Um zu verdeutlichen, warum das so ist, lassen Sie uns noch einmal die Liste der Funktionen durchgehen, die eine Vektordatenbank implementieren sollte (aus dem ersten Abschnitt). Den Vektorsuch-Plugins fehlen zwei dieser Eigenschaften - Abstimmbarkeit und benutzerfreundliche APIs/SDKs. Ich werde weiterhin die ANN-Engine von Elasticsearch als Beispiel verwenden; andere Vektorsuch-Plugins funktionieren sehr ähnlich, so dass ich nicht weiter ins Detail gehen werde. Elasticsearch unterstützt die Speicherung von Vektoren über den Datenfeldtyp <code translate="no">dense_vector</code> und ermöglicht die Abfrage über <code translate="no">knnsearch endpoint</code>:</p>
<pre><code translate="no" class="language-json">PUT index
{
<span class="hljs-string">&quot;mappings&quot;</span>: {
  <span class="hljs-string">&quot;properties&quot;</span>: {
    <span class="hljs-string">&quot;image-vector&quot;</span>: {
      <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;dense_vector&quot;</span>,
      <span class="hljs-string">&quot;dims&quot;</span>: 128,
      <span class="hljs-string">&quot;index&quot;</span>: <span class="hljs-literal">true</span>,
      <span class="hljs-string">&quot;similarity&quot;</span>: <span class="hljs-string">&quot;l2_norm&quot;</span>
    }
  }
}
}


PUT index/_doc
{
<span class="hljs-string">&quot;image-vector&quot;</span>: [0.12, 1.34, ...]
}
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-json">GET index/_knn_search
{
<span class="hljs-string">&quot;knn&quot;</span>: {
  <span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;image-vector&quot;</span>,
  <span class="hljs-string">&quot;query_vector&quot;</span>: [-0.5, 9.4, ...],
  <span class="hljs-string">&quot;k&quot;</span>: 10,
  <span class="hljs-string">&quot;num_candidates&quot;</span>: 100
}
}
<button class="copy-code-btn"></button></code></pre>
<p>Das ANN-Plugin von Elasticsearch unterstützt nur einen Indizierungsalgorithmus: Hierarchical Navigable Small Worlds, auch bekannt als HNSW (ich denke gerne, dass der Schöpfer Marvel voraus war, als es um die Popularisierung des Multiversums ging). Darüber hinaus wird nur die L2/Euklidische Distanz als Distanzmetrik unterstützt. Das ist ein guter Anfang, aber vergleichen wir es mal mit Milvus, einer vollwertigen Vektordatenbank. Verwendung von <code translate="no">pymilvus</code>:</p>
<pre><code translate="no" class="language-python"><span class="hljs-meta">&gt;&gt;&gt; </span>field1 = FieldSchema(name=<span class="hljs-string">&#x27;id&#x27;</span>, dtype=DataType.INT64, description=<span class="hljs-string">&#x27;int64&#x27;</span>, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>field2 = FieldSchema(name=<span class="hljs-string">&#x27;embedding&#x27;</span>, dtype=DataType.FLOAT_VECTOR, description=<span class="hljs-string">&#x27;embedding&#x27;</span>, dim=<span class="hljs-number">128</span>, is_primary=<span class="hljs-literal">False</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>schema = CollectionSchema(fields=[field1, field2], description=<span class="hljs-string">&#x27;hello world collection&#x27;</span>)
<span class="hljs-meta">&gt;&gt;&gt; </span>collection = Collection(name=<span class="hljs-string">&#x27;my_collection&#x27;</span>, data=<span class="hljs-literal">None</span>, schema=schema)
<span class="hljs-meta">&gt;&gt;&gt; </span>index_params = {
       <span class="hljs-string">&#x27;index_type&#x27;</span>: <span class="hljs-string">&#x27;IVF_FLAT&#x27;</span>,
       <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;nlist&#x27;</span>: <span class="hljs-number">1024</span>},
       <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&#x27;L2&#x27;</span>}
<span class="hljs-meta">&gt;&gt;&gt; </span>collection.create_index(<span class="hljs-string">&#x27;embedding&#x27;</span>, index_params)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no" class="language-python"><span class="hljs-meta">&gt;&gt;&gt; </span>search_param = {
       <span class="hljs-string">&#x27;data&#x27;</span>: vector,
       <span class="hljs-string">&#x27;anns_field&#x27;</span>: <span class="hljs-string">&#x27;embedding&#x27;</span>,
       <span class="hljs-string">&#x27;param&#x27;</span>: {<span class="hljs-string">&#x27;metric_type&#x27;</span>: <span class="hljs-string">&#x27;L2&#x27;</span>, <span class="hljs-string">&#x27;params&#x27;</span>: {<span class="hljs-string">&#x27;nprobe&#x27;</span>: <span class="hljs-number">16</span>}},
       <span class="hljs-string">&#x27;limit&#x27;</span>: <span class="hljs-number">10</span>,
       <span class="hljs-string">&#x27;expr&#x27;</span>: <span class="hljs-string">&#x27;id_field &gt; 0&#x27;</span>
   }
<span class="hljs-meta">&gt;&gt;&gt; </span>results = collection.search(**search_param)
<button class="copy-code-btn"></button></code></pre>
<p>Während sowohl <a href="https://zilliz.com/comparison/elastic-vs-milvus">Elasticsearch als auch Milvus</a> über Methoden zur Erstellung von Indizes, zum Einfügen von Einbettungsvektoren und zur Durchführung von Nearest-Neighbour-Suchen verfügen, geht aus diesen Beispielen klar hervor, dass Milvus eine intuitivere Vektorsuch-API (bessere benutzerorientierte API) und eine breitere Unterstützung von Vektorindizes und Distanzmetriken (bessere Abstimmbarkeit) bietet. Milvus plant außerdem, in Zukunft mehr Vektorindizes zu unterstützen und Abfragen über SQL-ähnliche Anweisungen zu ermöglichen, was sowohl die Abstimmbarkeit als auch die Benutzerfreundlichkeit weiter verbessert.</p>
<p>Wir haben soeben eine ganze Reihe von Inhalten durchgenommen. Dieser Abschnitt war zugegebenermaßen ziemlich lang. Für diejenigen, die ihn überflogen haben, hier eine kurze Zusammenfassung: Milvus ist besser als Vektorsuch-Plugins, weil Milvus von Grund auf als Vektordatenbank entwickelt wurde, was einen größeren Funktionsumfang und eine Architektur ermöglicht, die besser für unstrukturierte Daten geeignet ist.</p>
<h2 id="How-to-choose-from-different-vector-search-technologies" class="common-anchor-header">Wie entscheidet man sich für eine der verschiedenen Vektorsuchtechnologien?<button data-href="#How-to-choose-from-different-vector-search-technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>Vektordatenbanken sind nicht gleich Vektordatenbanken; jede besitzt einzigartige Eigenschaften, die auf bestimmte Anwendungen zugeschnitten sind. Vektorsuchbibliotheken und -plugins sind benutzerfreundlich und ideal für die Handhabung kleiner Produktionsumgebungen mit Millionen von Vektoren. Wenn Ihr Datenumfang gering ist und Sie nur grundlegende Vektorsuchfunktionen benötigen, sind diese Technologien für Ihr Unternehmen ausreichend.</p>
<p>Für datenintensive Unternehmen, die mit Hunderten von Millionen von Vektoren arbeiten und Antworten in Echtzeit benötigen, sollte jedoch eine spezialisierte Vektordatenbank Ihre erste Wahl sein. Milvus zum Beispiel verwaltet mühelos Milliarden von Vektoren und bietet blitzschnelle Abfragegeschwindigkeiten und umfangreiche Funktionen. Darüber hinaus erweisen sich vollständig verwaltete Lösungen wie Zilliz als noch vorteilhafter, da sie Sie von operativen Herausforderungen befreien und Ihnen die ausschließliche Konzentration auf Ihre Kerntätigkeiten ermöglichen.</p>
<h2 id="Take-another-look-at-the-Vector-Database-101-courses" class="common-anchor-header">Werfen Sie noch einen Blick auf die Vector Database 101 Kurse<button data-href="#Take-another-look-at-the-Vector-Database-101-courses" class="anchor-icon" translate="no">
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
    </button></h2><ol>
<li><a href="https://zilliz.com/blog/introduction-to-unstructured-data">Einführung in unstrukturierte Daten</a></li>
<li><a href="https://zilliz.com/learn/what-is-vector-database">Was ist eine Vektordatenbank?</a></li>
<li><a href="https://zilliz.com/learn/comparing-vector-database-vector-search-library-and-vector-search-plugin">Vergleich von Vektordatenbanken, Vektorsuchbibliotheken und Vektorsuch-Plugins</a></li>
<li><a href="https://zilliz.com/blog/introduction-to-milvus-vector-database">Einführung in Milvus</a></li>
<li><a href="https://zilliz.com/blog/milvus-vector-database-quickstart">Milvus Schnellstart</a></li>
<li><a href="https://zilliz.com/blog/vector-similarity-search">Einführung in die Vektorähnlichkeitssuche</a></li>
<li><a href="https://zilliz.com/blog/vector-index">Vektorindex-Grundlagen und der invertierte Dateiindex</a></li>
<li><a href="https://zilliz.com/blog/scalar-quantization-and-product-quantization">Skalarquantisierung und Produktquantisierung</a></li>
<li><a href="https://zilliz.com/blog/hierarchical-navigable-small-worlds-HNSW">Hierarchische navigierbare kleine Welten (HNSW)</a></li>
<li><a href="https://zilliz.com/learn/approximate-nearest-neighbor-oh-yeah-ANNOY">Approximate Nearest Neighbors Oh Yeah (ANNOY)</a></li>
<li><a href="https://zilliz.com/learn/choosing-right-vector-index-for-your-project">Auswahl des richtigen Vektorindex für Ihr Projekt</a></li>
<li><a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">DiskANN und der Vamana-Algorithmus</a></li>
</ol>
