---
id: 2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md
title: Verwendung
author: Lichen Wang
date: 2022-02-07T00:00:00.000Z
desc: >-
  Der Grundgedanke hinter der Löschfunktion in Milvus 2.0, der weltweit
  fortschrittlichsten Vektordatenbank.
cover: assets.zilliz.com/Delete_9f40bbfa94.png
tag: Engineering
---
<custom-h1>Wie Milvus Streaming-Daten in einem verteilten Cluster löscht</custom-h1><p>Mit der vereinheitlichten Batch- und Stream-Verarbeitung und der Cloud-nativen Architektur stellt Milvus 2.0 eine größere Herausforderung dar als sein Vorgänger bei der Entwicklung der DELETE-Funktion. Dank des fortschrittlichen Disaggregationsdesigns für die Speicherberechnung und des flexiblen Veröffentlichungs-/Abonnement-Mechanismus können wir mit Stolz verkünden, dass wir es geschafft haben. In Milvus 2.0 können Sie eine Entität in einer bestimmten Sammlung mit ihrem Primärschlüssel löschen, so dass die gelöschte Entität nicht mehr im Ergebnis einer Suche oder einer Abfrage aufgeführt wird.</p>
<p>Bitte beachten Sie, dass sich die DELETE-Operation in Milvus auf die logische Löschung bezieht, während die physische Datenbereinigung während der Datenverdichtung stattfindet. Logisches Löschen erhöht nicht nur die durch die E/A-Geschwindigkeit eingeschränkte Suchleistung, sondern erleichtert auch die Datenwiederherstellung. Logisch gelöschte Daten können mit Hilfe der Zeitreisefunktion wiederhergestellt werden.</p>
<h2 id="Usage" class="common-anchor-header">Verwendung<button data-href="#Usage" class="anchor-icon" translate="no">
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
    </button></h2><p>Lassen Sie uns zunächst die DELETE-Funktion in Milvus 2.0 ausprobieren. (Das folgende Beispiel verwendet PyMilvus 2.0.0 auf Milvus 2.0.0).</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, utility, Collection, DataType, FieldSchema, CollectionSchema
<span class="hljs-comment"># Connect to Milvus</span>
connections.connect(
    alias=<span class="hljs-string">&quot;default&quot;</span>, 
    host=<span class="hljs-string">&#x27;x.x.x.x&#x27;</span>, 
    port=<span class="hljs-string">&#x27;19530&#x27;</span>
)
<span class="hljs-comment"># Create a collection with Strong Consistency level</span>
pk_field = FieldSchema(
    name=<span class="hljs-string">&quot;id&quot;</span>, 
    dtype=DataType.INT64, 
    is_primary=<span class="hljs-literal">True</span>, 
)
vector_field = FieldSchema(
    name=<span class="hljs-string">&quot;vector&quot;</span>, 
    dtype=DataType.FLOAT_VECTOR, 
    dim=<span class="hljs-number">2</span>
)
schema = CollectionSchema(
    fields=[pk_field, vector_field], 
    description=<span class="hljs-string">&quot;Test delete&quot;</span>
)
collection_name = <span class="hljs-string">&quot;test_delete&quot;</span>
collection = Collection(
    name=collection_name, 
    schema=schema, 
    using=<span class="hljs-string">&#x27;default&#x27;</span>, 
    shards_num=<span class="hljs-number">2</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
<span class="hljs-comment"># Insert randomly generated vectors</span>
<span class="hljs-keyword">import</span> random
data = [
    [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">100</span>)],
    [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">100</span>)],
]
collection.insert(data)
<span class="hljs-comment"># Query to make sure the entities to delete exist</span>
collection.load()
expr = <span class="hljs-string">&quot;id in [2,4,6,8,10]&quot;</span>
pre_del_res = collection.query(
    expr,
    output_fields = [<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>]
)
<span class="hljs-built_in">print</span>(pre_del_res)
<span class="hljs-comment"># Delete the entities with the previous expression</span>
collection.delete(expr)
<span class="hljs-comment"># Query again to check if the deleted entities exist</span>
post_del_res = collection.query(
    expr,
    output_fields = [<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>]
)
<span class="hljs-built_in">print</span>(post_del_res)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Implementation" class="common-anchor-header">Implementierung<button data-href="#Implementation" class="anchor-icon" translate="no">
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
    </button></h2><p>In einer Milvus-Instanz ist ein Datenknoten hauptsächlich dafür verantwortlich, Streaming-Daten (Logs im Log-Broker) als historische Daten (Log-Snapshots) zu packen und automatisch in den Objektspeicher zu flushen. Ein Abfrageknoten führt Suchanfragen auf vollständigen Daten aus, d. h. sowohl auf Streaming-Daten als auch auf historischen Daten.</p>
<p>Um die Datenschreibkapazitäten der parallelen Knoten in einem Cluster optimal zu nutzen, verwendet Milvus eine Sharding-Strategie, die auf Primärschlüssel-Hashing basiert, um die Schreibvorgänge gleichmäßig auf verschiedene Arbeitsknoten zu verteilen. Das heißt, dass der Proxy die DML-Nachrichten (d.h. Anfragen) einer Entität an denselben Daten- und Abfrageknoten weiterleitet. Diese Nachrichten werden über den DML-Kanal veröffentlicht und von dem Datenknoten und dem Abfrageknoten getrennt konsumiert, um Such- und Abfragedienste gemeinsam bereitzustellen.</p>
<h3 id="Data-node" class="common-anchor-header">Datenknoten</h3><p>Nach dem Empfang von INSERT-Nachrichten fügt der Datenknoten die Daten in ein wachsendes Segment ein, d. h. in ein neues Segment, das für den Empfang von Streaming-Daten im Speicher erstellt wird. Wenn entweder die Anzahl der Datenzeilen oder die Dauer des wachsenden Segments den Schwellenwert erreicht, versiegelt der Datenknoten es, um weitere eingehende Daten zu verhindern. Der Datenknoten spült dann das versiegelte Segment, das die historischen Daten enthält, in den Objektspeicher. In der Zwischenzeit generiert der Datenknoten einen Bloomfilter auf der Grundlage der Primärschlüssel der neuen Daten und spült ihn zusammen mit dem versiegelten Segment in den Objektspeicher, wobei er den Bloomfilter als Teil des binären Statistikprotokolls (binlog) speichert, das die statistischen Informationen des Segments enthält.</p>
<blockquote>
<p>Ein Bloomfilter ist eine probabilistische Datenstruktur, die aus einem langen binären Vektor und einer Reihe von Zufallsabbildungsfunktionen besteht. Er kann verwendet werden, um zu testen, ob ein Element Mitglied einer Menge ist, kann aber auch falsch positive Treffer liefern.           -- Wikipedia</p>
</blockquote>
<p>Wenn Daten-DELETE-Nachrichten eingehen, puffert der Datenknoten alle Bloom-Filter im entsprechenden Shard und gleicht sie mit den in den Nachrichten angegebenen Primärschlüsseln ab, um alle Segmente (sowohl die wachsenden als auch die versiegelten) abzurufen, die möglicherweise die zu löschenden Entitäten enthalten. Nachdem die entsprechenden Segmente lokalisiert wurden, puffert der Datenknoten sie im Speicher, um die Delta-Binlogs zur Aufzeichnung der Löschvorgänge zu erzeugen, und spült diese Binlogs dann zusammen mit den Segmenten zurück in den Objektspeicher.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_node_2397ad70c3.png" alt="Data Node" class="doc-image" id="data-node" />
   </span> <span class="img-wrapper"> <span>Datenknoten</span> </span></p>
<p>Da einem Shard nur ein DML-Kanal zugewiesen ist, können zusätzliche Abfrageknoten, die dem Cluster hinzugefügt werden, den DML-Kanal nicht abonnieren. Um sicherzustellen, dass alle Abfrageknoten die DELETE-Nachrichten empfangen können, filtern die Datenknoten die DELETE-Nachrichten aus dem DML-Kanal und leiten sie an den Delta-Kanal weiter, um alle Abfrageknoten über die Löschvorgänge zu informieren.</p>
<h3 id="Query-node" class="common-anchor-header">Abfrageknoten</h3><p>Beim Laden einer Sammlung aus dem Objektspeicher holt sich der Abfrageknoten zunächst den Prüfpunkt jedes Shards, der die DML-Vorgänge seit dem letzten Flush-Vorgang markiert. Auf der Grundlage des Prüfpunkts lädt der Abfrageknoten alle versiegelten Segmente zusammen mit ihren Delta-Binlog- und Bloom-Filtern. Wenn alle Daten geladen sind, abonniert der Abfrageknoten DML-Channel, Delta-Channel und Query-Channel.</p>
<p>Wenn weitere INSERT-Nachrichten eintreffen, nachdem die Sammlung in den Speicher geladen wurde, bestimmt der Abfrageknoten zunächst die wachsenden Segmente entsprechend den Nachrichten und aktualisiert die entsprechenden Bloomfilter im Speicher nur für Abfragezwecke. Diese für die Abfrage bestimmten Bloomfilter werden nach Abschluss der Abfrage nicht in den Objektspeicher gespült.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/query_node_a78b1d664f.png" alt="Query Node" class="doc-image" id="query-node" />
   </span> <span class="img-wrapper"> <span>Abfrageknoten</span> </span></p>
<p>Wie oben erwähnt, kann nur eine bestimmte Anzahl von Abfrageknoten DELETE-Nachrichten vom DML-Kanal empfangen, d.h. nur sie können die DELETE-Anfragen in wachsenden Segmenten ausführen. Diejenigen Abfrageknoten, die den DML-Kanal abonniert haben, filtern zunächst die DELETE-Nachrichten in den wachsenden Segmenten, suchen die Entitäten, indem sie die bereitgestellten Primärschlüssel mit den abfragespezifischen Bloomfiltern der wachsenden Segmente abgleichen, und zeichnen dann die Löschvorgänge in den entsprechenden Segmenten auf.</p>
<p>Abfrageknoten, die den DML-Kanal nicht abonnieren können, dürfen nur Such- oder Abfrageanfragen auf versiegelten Segmenten verarbeiten, da sie nur den Delta-Kanal abonnieren und die von Datenknoten weitergeleiteten DELETE-Nachrichten empfangen können. Nachdem die Abfrageknoten alle DELETE-Nachrichten in den versiegelten Segmenten des Delta-Kanals gesammelt haben, lokalisieren sie die Entitäten, indem sie die angegebenen Primärschlüssel mit den Bloom-Filtern der versiegelten Segmente abgleichen, und zeichnen dann die Löschvorgänge in den entsprechenden Segmenten auf.</p>
<p>Schließlich generieren die Abfrageknoten bei einer Suche oder Abfrage ein Bitset auf der Grundlage der Löschaufzeichnungen, um die gelöschten Entitäten auszulassen, und suchen unter den verbleibenden Entitäten aus allen Segmenten, unabhängig vom Segmentstatus. Nicht zuletzt beeinflusst die Konsistenzstufe die Sichtbarkeit der gelöschten Daten. Unter Strong Consistency Level (wie im vorherigen Codebeispiel gezeigt) sind die gelöschten Entitäten sofort nach dem Löschen unsichtbar. Bei Bounded Consistency Level dauert es mehrere Sekunden, bis die gelöschten Objekte unsichtbar werden.</p>
<h2 id="Whats-next" class="common-anchor-header">Was kommt als Nächstes?<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>In der Blogserie zu den neuen Funktionen 2.0 wollen wir das Design der neuen Funktionen erklären. Lesen Sie mehr in dieser Blogserie!</p>
<ul>
<li><a href="https://milvus.io/blog/2022-02-07-how-milvus-deletes-streaming-data-in-distributed-cluster.md">Wie Milvus Streaming-Daten in einem verteilten Cluster löscht</a></li>
<li><a href="https://milvus.io/blog/2022-2-21-compact.md">Wie verdichtet man Daten in Milvus?</a></li>
<li><a href="https://milvus.io/blog/2022-02-28-how-milvus-balances-query-load-across-nodes.md">Wie gleicht Milvus die Abfragelast über die Knoten aus?</a></li>
<li><a href="https://milvus.io/blog/2022-2-14-bitset.md">Wie Bitset die Vielseitigkeit der Vektorähnlichkeitssuche ermöglicht</a></li>
</ul>
