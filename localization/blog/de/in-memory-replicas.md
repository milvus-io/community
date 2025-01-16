---
id: in-memory-replicas.md
title: Steigern Sie den Lesedurchsatz Ihrer Vektordatenbank mit In-Memory-Replikaten
author: Congqi Xia
date: 2022-08-22T00:00:00.000Z
desc: >-
  Verwenden Sie speicherinterne Replikate, um den Lesedurchsatz und die Nutzung
  der Hardwareressourcen zu verbessern.
cover: assets.zilliz.com/in_memory_replica_af1fa21d61.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/in-memory-replicas.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/in_memory_replica_af1fa21d61.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>Cover_Bild</span> </span></p>
<blockquote>
<p>Dieser Artikel wurde gemeinsam von <a href="https://github.com/congqixia">Congqi Xia</a> und <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Ni</a> verfasst.</p>
</blockquote>
<p>Mit der offiziellen Freigabe von Milvus 2.1 werden viele neue Funktionen eingeführt, die für mehr Komfort und eine bessere Benutzererfahrung sorgen. Obwohl das Konzept der In-Memory-Replik in der Welt der verteilten Datenbanken nichts Neues ist, handelt es sich dabei um eine wichtige Funktion, mit der Sie die Systemleistung steigern und die Systemverfügbarkeit mühelos verbessern können. In diesem Beitrag wird daher erklärt, was eine In-Memory-Replik ist und warum sie wichtig ist. Außerdem wird erläutert, wie diese neue Funktion in Milvus, einer Vektordatenbank für KI, aktiviert werden kann.</p>
<p><strong>Springe zu:</strong></p>
<ul>
<li><p><a href="#Concepts-related-to-in-memory-replica">Konzepte im Zusammenhang mit In-Memory-Replik</a></p></li>
<li><p><a href="#What-is-in-memory-replica">Was ist eine In-Memory-Replik?</a></p></li>
<li><p><a href="#Why-are-in-memory-replicas-important">Warum sind In-Memory-Replikate wichtig?</a></p></li>
<li><p><a href="#Enable-in-memory-replicas-in-the-Milvus-vector-database">Aktivieren von In-Memory-Replikaten in der Vektordatenbank Milvus</a></p></li>
</ul>
<h2 id="Concepts-related-to-in-memory-replica" class="common-anchor-header">Konzepte im Zusammenhang mit In-Memory-Replikaten<button data-href="#Concepts-related-to-in-memory-replica" class="anchor-icon" translate="no">
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
    </button></h2><p>Bevor wir erfahren, was ein In-Memory-Replikat ist und warum es wichtig ist, müssen wir zunächst einige relevante Konzepte verstehen, darunter Replikatgruppe, Shard-Replikat, Streaming-Replikat, historisches Replikat und Shard-Leader. Die folgende Abbildung veranschaulicht diese Konzepte.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/diagram_1_525afc706a.jpg" alt="Replica_concepts" class="doc-image" id="replica_concepts" />
   </span> <span class="img-wrapper"> <span>Replikat_Konzepte</span> </span></p>
<h3 id="Replica-group" class="common-anchor-header">Replikatgruppe</h3><p>Eine Replikatgruppe besteht aus mehreren <a href="https://milvus.io/docs/v2.1.x/four_layers.md#Query-node">Abfrageknoten</a>, die für die Verarbeitung historischer Daten und Replikate zuständig sind.</p>
<h3 id="Shard-replica" class="common-anchor-header">Shard-Replikat</h3><p>Ein Shard-Replikat besteht aus einem Streaming-Replikat und einem historischen Replikat, die beide zum selben <a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Shard">Shard</a> gehören (d. h. DML-Kanal). Mehrere Shard-Replikate bilden eine Replikatgruppe. Die genaue Anzahl der Shard-Replikate in einer Replikatgruppe wird durch die Anzahl der Shards in einer bestimmten Sammlung bestimmt.</p>
<h3 id="Streaming-replica" class="common-anchor-header">Streaming-Replikat</h3><p>Ein Streaming-Replikat enthält alle <a href="https://milvus.io/docs/v2.1.x/glossary.md#Segment">wachsenden Segmente</a> desselben DML-Kanals. Technisch gesehen sollte ein Streaming-Replikat nur von einem Abfrageknoten in einem Replikat bedient werden.</p>
<h3 id="Historical-replica" class="common-anchor-header">Historisches Replikat</h3><p>Ein historisches Replikat enthält alle versiegelten Segmente aus demselben DML-Kanal. Die versiegelten Segmente eines historischen Replikats können auf mehrere Abfrageknoten innerhalb derselben Replikatgruppe verteilt werden.</p>
<h3 id="Shard-leader" class="common-anchor-header">Shard-Leader</h3><p>Ein Shard-Leader ist der Abfrageknoten, der das Streaming-Replikat in einem Shard-Replikat bedient.</p>
<h2 id="What-is-in-memory-replica" class="common-anchor-header">Was ist eine In-Memory-Replik?<button data-href="#What-is-in-memory-replica" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Aktivierung von In-Memory-Replikaten ermöglicht es Ihnen, Daten in einer Sammlung auf mehrere Abfrageknoten zu laden, so dass Sie zusätzliche CPU- und Speicherressourcen nutzen können. Diese Funktion ist sehr nützlich, wenn Sie einen relativ kleinen Datensatz haben, aber den Lesedurchsatz erhöhen und die Nutzung der Hardwareressourcen verbessern möchten.</p>
<p>Die Milvus-Vektordatenbank hält derzeit eine Replik für jedes Segment im Speicher. Mit speicherinternen Replikaten können Sie jedoch mehrere Replikationen eines Segments auf verschiedenen Abfrageknoten haben. Das heißt, wenn ein Abfrageknoten eine Suche in einem Segment durchführt, kann eine eingehende neue Suchanfrage einem anderen, nicht aktiven Abfrageknoten zugewiesen werden, da dieser Abfrageknoten eine Replikation genau desselben Segments besitzt.</p>
<p>Wenn wir außerdem mehrere speicherinterne Replikationen haben, können wir besser mit der Situation umgehen, dass ein Abfrageknoten ausfällt. Früher musste man warten, bis das Segment neu geladen war, um die Suche auf einem anderen Abfrageknoten fortzusetzen. Mit der In-Memory-Replikation kann die Suchanfrage jedoch sofort an einen neuen Abfrageknoten gesendet werden, ohne dass die Daten erneut geladen werden müssen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/replication_3_1_2c25513cb9.jpg" alt="Replication" class="doc-image" id="replication" />
   </span> <span class="img-wrapper"> <span>Replikation</span> </span></p>
<h2 id="Why-are-in-memory-replicas-important" class="common-anchor-header">Warum sind In-Memory-Replikationen wichtig?<button data-href="#Why-are-in-memory-replicas-important" class="anchor-icon" translate="no">
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
    </button></h2><p>Einer der wichtigsten Vorteile der Aktivierung von In-Memory-Replikationen ist die Steigerung der Gesamt-QPS (Abfrage pro Sekunde) und des Durchsatzes. Außerdem können mehrere Segmentreplikate verwaltet werden, und das System ist bei einem Failover widerstandsfähiger.</p>
<h2 id="Enable-in-memory-replicas-in-the-Milvus-vector-database" class="common-anchor-header">Aktivieren von In-Memory-Replikaten in der Milvus-Vektordatenbank<button data-href="#Enable-in-memory-replicas-in-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Aktivierung der neuen Funktion der In-Memory-Replikate ist in der Milvus-Vektordatenbank mühelos möglich. Alles, was Sie tun müssen, ist, die Anzahl der gewünschten Replikate beim Laden einer Sammlung anzugeben (d.h. <code translate="no">collection.load()</code> aufrufen).</p>
<p>Im folgenden Beispiel-Tutorial gehen wir davon aus, dass Sie bereits <a href="https://milvus.io/docs/v2.1.x/create_collection.md">eine Sammlung</a> mit dem Namen "Buch" <a href="https://milvus.io/docs/v2.1.x/create_collection.md">erstellt</a> und <a href="https://milvus.io/docs/v2.1.x/insert_data.md">Daten</a> in diese <a href="https://milvus.io/docs/v2.1.x/insert_data.md">eingefügt</a> haben. Dann können Sie den folgenden Befehl ausführen, um beim <a href="https://milvus.io/docs/v2.1.x/load_collection.md">Laden</a> einer Buchsammlung zwei Replikate zu erstellen.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> Collection
collection = Collection(<span class="hljs-string">&quot;book&quot;</span>)      <span class="hljs-comment"># Get an existing collection.</span>
collection.load(replica_number=<span class="hljs-number">2</span>) <span class="hljs-comment"># load collection as 2 replicas</span>
<button class="copy-code-btn"></button></code></pre>
<p>Sie können die Anzahl der Replikate im obigen Beispielcode flexibel ändern, um sie an Ihr Anwendungsszenario anzupassen. Dann können Sie direkt eine <a href="https://milvus.io/docs/v2.1.x/search.md">Vektorähnlichkeitssuche</a> oder <a href="https://milvus.io/docs/v2.1.x/query.md">-abfrage</a> auf mehreren Replikaten durchführen, ohne zusätzliche Befehle ausführen zu müssen. Es ist jedoch zu beachten, dass die maximal zulässige Anzahl von Replikaten durch die Gesamtmenge des nutzbaren Speichers für die Abfrageknoten begrenzt ist. Wenn die Anzahl der Replikate, die Sie angeben, die Grenzen des nutzbaren Speichers überschreitet, wird beim Laden der Daten ein Fehler ausgegeben.</p>
<p>Sie können auch die Informationen der von Ihnen erstellten speicherinternen Replikate überprüfen, indem Sie <code translate="no">collection.get_replicas()</code> ausführen. Es werden die Informationen der Replikatgruppen und der entsprechenden Abfrageknoten und Shards zurückgegeben. Im Folgenden finden Sie ein Beispiel für die Ausgabe.</p>
<pre><code translate="no">Replica <span class="hljs-built_in">groups</span>:
- Group: &lt;group_id:435309823872729305&gt;, &lt;group_nodes:(21, 20)&gt;, &lt;shards:[Shard: &lt;channel_name:milvus-zong-rootcoord-dml_27_435367661874184193v0&gt;, &lt;shard_leader:21&gt;, &lt;shard_nodes:[21]&gt;, Shard: &lt;channel_name:milvus-zong-rootcoord-dml_28_435367661874184193v1&gt;, &lt;shard_leader:20&gt;, &lt;shard_nodes:[20, 21]&gt;]&gt;
- Group: &lt;group_id:435309823872729304&gt;, &lt;group_nodes:(25,)&gt;, &lt;shards:[Shard: &lt;channel_name:milvus-zong-rootcoord-dml_28_435367661874184193v1&gt;, &lt;shard_leader:25&gt;, &lt;shard_nodes:[25]&gt;, Shard: &lt;channel_name:milvus-zong-rootcoord-dml_27_435367661874184193v0&gt;, &lt;shard_leader:25&gt;, &lt;shard_nodes:[25]&gt;]&gt;
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>Mit der offiziellen Veröffentlichung von Milvus 2.1 haben wir eine Reihe von Blogs vorbereitet, in denen die neuen Funktionen vorgestellt werden. Lesen Sie mehr in dieser Blogserie:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Wie Sie String-Daten für Ihre Anwendungen zur Ähnlichkeitssuche nutzen können</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Verwendung von Embedded Milvus zur sofortigen Installation und Ausführung von Milvus mit Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Erhöhen Sie den Lesedurchsatz Ihrer Vektordatenbank mit In-Memory-Replikaten</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Verständnis der Konsistenzebene in der Milvus-Vektordatenbank</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Verständnis des Konsistenzlevels in der Milvus-Vektordatenbank (Teil II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Wie gewährleistet die Milvus-Vektor-Datenbank die Datensicherheit?</a></li>
</ul>
