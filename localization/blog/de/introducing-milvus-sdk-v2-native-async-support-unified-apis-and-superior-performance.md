---
id: >-
  introducing-milvus-sdk-v2-native-async-support-unified-apis-and-superior-performance.md
title: >-
  Einführung des Milvus SDK v2: Native Async-Unterstützung, einheitliche APIs
  und überragende Leistung
author: Ken Zhang
date: 2025-04-16T00:00:00.000Z
desc: >-
  Erleben Sie das Milvus SDK v2, das für Entwickler neu konzipiert wurde!
  Genießen Sie eine vereinheitlichte API, native async-Unterstützung und
  verbesserte Leistung für Ihre Vektorsuchprojekte.
cover: assets.zilliz.com/Introducing_Milvus_SDK_v2_05c9e5e8b2.png
tag: Engineering
tags: 'Milvus SDK v2, Async Support, Milvus vector database'
canonicalUrl: >-
  https://milvus.io/blog/introducing-milvus-sdk-v2-native-async-support-unified-apis-and-superior-performance.md
---
<h2 id="TLDR" class="common-anchor-header">TL;DR<button data-href="#TLDR" class="anchor-icon" translate="no">
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
    </button></h2><p>Sie haben gesprochen, und wir haben zugehört! Milvus SDK v2 ist eine komplette Neugestaltung unserer Entwicklererfahrung, die direkt aus Ihrem Feedback entstanden ist. Mit einer einheitlichen API für Python, Java, Go und Node.js, nativer asynchroner Unterstützung, die Sie sich gewünscht haben, einem leistungssteigernden Schema-Cache und einer vereinfachten MilvusClient-Schnittstelle macht Milvus SDK v2 die Entwicklung von <a href="https://zilliz.com/learn/vector-similarity-search">Vektorsuchen</a> schneller und intuitiver als je zuvor. Egal, ob Sie <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG-Anwendungen</a>, Empfehlungssysteme oder <a href="https://zilliz.com/learn/what-is-computer-vision">Computer-Vision-Lösungen</a> entwickeln, dieses von der Community betriebene Update wird Ihre Arbeit mit Milvus verändern.</p>
<h2 id="Why-We-Built-It-Addressing-Community-Pain-Points" class="common-anchor-header">Warum wir es entwickelt haben: Schmerzpunkte der Community adressieren<button data-href="#Why-We-Built-It-Addressing-Community-Pain-Points" class="anchor-icon" translate="no">
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
    </button></h2><p>Im Laufe der Jahre hat sich Milvus zur <a href="https://milvus.io/blog/what-is-a-vector-database.md">Vektordatenbank</a> der Wahl für Tausende von KI-Anwendungen entwickelt. Als unsere Community jedoch wuchs, hörten wir immer wieder von verschiedenen Einschränkungen mit unserem SDK v1:</p>
<p><strong>"Die Handhabung hoher Gleichzeitigkeit ist zu komplex."</strong> Das Fehlen einer nativen asynchronen Unterstützung in einigen Sprach-SDKs zwang die Entwickler, sich auf Threads oder Callbacks zu verlassen, was die Verwaltung und das Debugging des Codes erschwerte, insbesondere in Szenarien wie dem Laden von Batch-Daten und parallelen Abfragen.</p>
<p><strong>"Die Leistung verschlechtert sich mit der Größe.</strong> Ohne einen Schema-Cache validierte v1 wiederholt Schemata während der Operationen, was zu Engpässen bei hochvolumigen Workloads führte. In Anwendungsfällen, die eine massive Vektorverarbeitung erfordern, führte dieses Problem zu erhöhten Latenzzeiten und verringertem Durchsatz.</p>
<p><strong>"Inkonsistente Schnittstellen zwischen den Sprachen verursachen eine steile Lernkurve.</strong> Verschiedene Sprach-SDKs implementierten Schnittstellen auf ihre eigene Weise, was die sprachübergreifende Entwicklung erschwerte.</p>
<p><strong>"Der RESTful-API fehlen wesentliche Funktionen.</strong> Kritische Funktionen wie Partitionsmanagement und Indexerstellung waren nicht verfügbar und zwangen die Entwickler, zwischen verschiedenen SDKs zu wechseln.</p>
<p>Dies waren nicht nur Funktionswünsche - es waren echte Hindernisse in Ihrem Entwicklungsworkflow. SDK v2 ist unser Versprechen, diese Hindernisse zu beseitigen und Ihnen die Möglichkeit zu geben, sich auf das Wesentliche zu konzentrieren: die Entwicklung von beeindruckenden KI-Anwendungen.</p>
<h2 id="The-Solution-Milvus-SDK-v2" class="common-anchor-header">Die Lösung: Milvus SDK v2<button data-href="#The-Solution-Milvus-SDK-v2" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus SDK v2 ist das Ergebnis einer kompletten Neugestaltung, die sich auf die Erfahrung der Entwickler konzentriert und in mehreren Sprachen verfügbar ist:</p>
<ul>
<li><p><a href="https://milvus.io/api-reference/pymilvus/v2.5.x/About.md">Python SDK v2 (pymilvus.MilvusClient)</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-sdk-java">Java v2</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus/tree/client/v2.5.1/client">Go v2</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-sdk-node">NodeJS</a></p></li>
<li><p><a href="https://milvus.io/api-reference/restful/v2.5.x/About.md">RESTful v2</a></p></li>
</ul>
<h3 id="1-Native-Asynchronous-Support-From-Complex-to-Concurrent" class="common-anchor-header">1. Native asynchrone Unterstützung: Von komplex zu nebenläufig</h3><p>Die alte Art der Handhabung von Gleichzeitigkeit beinhaltete umständliche Future-Objekte und Callback-Muster. SDK v2 führt echte async/await-Funktionalität ein, insbesondere in Python mit <code translate="no">AsyncMilvusClient</code> (seit v2.5.3). Mit den gleichen Parametern wie der synchrone MilvusClient können Sie Operationen wie Einfügen, Abfragen und Suchen einfach parallel ausführen.</p>
<p>Dieser vereinfachte Ansatz ersetzt die alten umständlichen Future- und Callback-Muster, was zu sauberem und effizientem Code führt. Komplexe nebenläufige Logik, wie Batch-Vektor-Inserts oder parallele Multi-Abfragen, können nun mühelos mit Tools wie <code translate="no">asyncio.gather</code> implementiert werden.</p>
<h3 id="2-Schema-Cache-Boosting-Performance-Where-It-Counts" class="common-anchor-header">2. Schema-Cache: Steigerung der Leistung an den entscheidenden Stellen</h3><p>SDK v2 führt einen Schema-Cache ein, der Sammlungsschemata nach dem ersten Abruf lokal speichert, wodurch wiederholte Netzwerkanfragen und CPU-Overhead bei Operationen vermieden werden.</p>
<p>Für hochfrequente Einfüge- und Abfrageszenarien bedeutet diese Aktualisierung Folgendes:</p>
<ul>
<li><p>Geringerer Netzwerkverkehr zwischen Client und Server</p></li>
<li><p>Geringere Latenzzeit für Operationen</p></li>
<li><p>Geringere serverseitige CPU-Auslastung</p></li>
<li><p>Bessere Skalierung bei hoher Gleichzeitigkeit</p></li>
</ul>
<p>Dies ist besonders wertvoll für Anwendungen wie Echtzeit-Empfehlungssysteme oder Live-Suchfunktionen, bei denen es auf Millisekunden ankommt.</p>
<h3 id="3-A-Unified-and-Streamlined-API-Experience" class="common-anchor-header">3. Eine einheitliche und optimierte API-Erfahrung</h3><p>Milvus SDK v2 führt eine einheitliche und umfassendere API-Erfahrung in allen unterstützten Programmiersprachen ein. Insbesondere die RESTful-API wurde erheblich verbessert und bietet nun nahezu gleiche Funktionen wie die gRPC-Schnittstelle.</p>
<p>In früheren Versionen blieb die RESTful-API hinter gRPC zurück und schränkte die Möglichkeiten der Entwickler ein, ohne die Schnittstelle zu wechseln. Das ist jetzt nicht mehr der Fall. Jetzt können Entwickler die RESTful-API verwenden, um praktisch alle Kernoperationen durchzuführen, wie z. B. das Erstellen von Sammlungen, das Verwalten von Partitionen, das Erstellen von Indizes und das Ausführen von Abfragen, ohne auf gRPC oder andere Methoden zurückgreifen zu müssen.</p>
<p>Dieser einheitliche Ansatz gewährleistet eine konsistente Entwicklererfahrung in verschiedenen Umgebungen und Anwendungsfällen. Er reduziert die Lernkurve, vereinfacht die Integration und verbessert die allgemeine Benutzerfreundlichkeit.</p>
<p>Hinweis: Für die meisten Benutzer bietet die RESTful-API eine schnellere und einfachere Möglichkeit, mit Milvus zu beginnen. Wenn Ihre Anwendung jedoch eine hohe Leistung oder fortgeschrittene Funktionen wie Iteratoren erfordert, bleibt der gRPC-Client die erste Wahl für maximale Flexibilität und Kontrolle.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RES_Tful_8520a80a8e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="4-Aligned-SDK-Design-Across-All-Languages" class="common-anchor-header">4. Abgestimmtes SDK-Design über alle Sprachen hinweg</h3><p>Mit Milvus SDK v2 haben wir das Design unserer SDKs für alle unterstützten Programmiersprachen standardisiert, um eine konsistentere Entwicklererfahrung zu gewährleisten.</p>
<p>Unabhängig davon, ob Sie mit Python, Java, Go oder Node.js arbeiten, folgt jedes SDK jetzt einer einheitlichen Struktur, in deren Mittelpunkt die Klasse MilvusClient steht. Dieses Redesign sorgt für eine einheitliche Benennung von Methoden, eine einheitliche Formatierung von Parametern und einheitliche Verwendungsmuster für alle von uns unterstützten Sprachen. (Siehe: <a href="https://github.com/milvus-io/milvus/discussions/33979">Update des MilvusClient SDK-Codebeispiels - GitHub Discussion #33979</a>)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_Client_9a4a6da9e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Sobald Sie mit Milvus in einer Sprache vertraut sind, können Sie problemlos zu einer anderen wechseln, ohne die Funktionsweise des SDK neu erlernen zu müssen. Diese Anpassung vereinfacht nicht nur das Onboarding, sondern macht auch die Entwicklung in mehreren Sprachen viel reibungsloser und intuitiver.</p>
<h3 id="5-A-Simpler-Smarter-PyMilvus-Python-SDK-with-MilvusClient" class="common-anchor-header">5. Ein einfacheres, intelligenteres PyMilvus (Python SDK) mit <code translate="no">MilvusClient</code></h3><p>In der vorherigen Version basierte PyMilvus auf einem ORM-ähnlichen Design, das eine Mischung aus objektorientierten und prozeduralen Ansätzen beinhaltete. Entwickler mussten <code translate="no">FieldSchema</code> Objekte definieren, eine <code translate="no">CollectionSchema</code> erstellen und dann eine <code translate="no">Collection</code> Klasse instanziieren - alles nur, um eine Sammlung zu erstellen. Dieser Prozess war nicht nur umständlich, sondern führte auch zu einer steileren Lernkurve für neue Benutzer.</p>
<p>Mit der neuen Schnittstelle <code translate="no">MilvusClient</code> sind die Dinge viel einfacher. Sie können jetzt eine Sammlung in einem einzigen Schritt mit der Methode <code translate="no">create_collection()</code> erstellen. Sie ermöglicht eine schnelle Definition des Schemas durch die Übergabe von Parametern wie <code translate="no">dimension</code> und <code translate="no">metric_type</code>. Bei Bedarf können Sie auch ein benutzerdefiniertes Schemaobjekt verwenden.</p>
<p>Noch besser: <code translate="no">create_collection()</code> unterstützt die Indexerstellung als Teil desselben Aufrufs. Wenn Index-Parameter übergeben werden, erstellt Milvus automatisch den Index und lädt die Daten in den Speicher - separate Aufrufe von <code translate="no">create_index()</code> oder <code translate="no">load()</code> sind nicht erforderlich. Eine Methode erledigt alles: <em>Sammlung erstellen → Index erstellen → Sammlung laden.</em></p>
<p>Dieser schlanke Ansatz reduziert die Komplexität der Einrichtung und erleichtert den Einstieg in Milvus, insbesondere für Entwickler, die einen schnellen und effizienten Weg zum Prototyping oder zur Produktion suchen.</p>
<p>Das neue Modul <code translate="no">MilvusClient</code> bietet klare Vorteile in Bezug auf Benutzerfreundlichkeit, Konsistenz und Leistung. Während die alte ORM-Schnittstelle vorerst noch verfügbar bleibt, planen wir, sie in Zukunft auslaufen zu lassen (siehe <a href="https://docs.zilliz.com/reference/python/ORM#:~:text=About%20to%20Deprecate">Referenz</a>). Wir empfehlen dringend ein Upgrade auf das neue SDK, um die Vorteile der Verbesserungen voll auszuschöpfen.</p>
<h3 id="6-Clearer-and-More-Comprehensive-Documentation" class="common-anchor-header">6. Übersichtlichere und umfassendere Dokumentation</h3><p>Wir haben die Produktdokumentation neu strukturiert, um eine vollständigere und klarere <a href="https://milvus.io/docs">API-Referenz</a> zu bieten. Unsere Benutzerhandbücher enthalten jetzt mehrsprachigen Beispielcode, damit Sie schnell loslegen und die Funktionen von Milvus leicht verstehen können. Darüber hinaus kann der Ask AI-Assistent, der auf unserer Dokumentations-Website verfügbar ist, neue Funktionen vorstellen, interne Mechanismen erklären und sogar dabei helfen, Beispielcode zu generieren oder zu modifizieren, was Ihre Reise durch die Dokumentation reibungsloser und angenehmer macht.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ask_AI_Assistant_b044d4621a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="7-Milvus-MCP-Server-Designed-for-the-Future-of-AI-Integration" class="common-anchor-header">7. Milvus MCP-Server: Entwickelt für die Zukunft der KI-Integration</h3><p>Der <a href="https://github.com/zilliztech/mcp-server-milvus">MCP Server</a>, der auf dem Milvus SDK aufbaut, ist unsere Antwort auf einen wachsenden Bedarf im KI-Ökosystem: nahtlose Integration zwischen großen Sprachmodellen<a href="https://zilliz.com/glossary/large-language-models-(llms)">(LLMs</a>), <a href="https://milvus.io/blog/what-is-a-vector-database.md">Vektordatenbanken</a> und externen Tools oder Datenquellen. Es implementiert das Model Context Protocol (MCP) und bietet eine einheitliche und intelligente Schnittstelle für die Orchestrierung von Milvus-Operationen und darüber hinaus.</p>
<p>Da <a href="https://zilliz.com/blog/top-10-ai-agents-to-watch-in-2025">KI-Agenten</a> immer leistungsfähiger werden - nicht nur bei der Codegenerierung, sondern auch bei der autonomen Verwaltung von Backend-Diensten - steigt der Bedarf an einer intelligenteren, API-gesteuerten Infrastruktur. Der MCP Server wurde mit Blick auf diese Zukunft entwickelt. Er ermöglicht intelligente und automatisierte Interaktionen mit Milvus-Clustern und rationalisiert Aufgaben wie Bereitstellung, Wartung und Datenverwaltung.</p>
<p>Vor allem aber legt er den Grundstein für eine neue Art der Zusammenarbeit von Maschine zu Maschine. Mit dem MCP-Server können KI-Agenten APIs aufrufen, um dynamisch Sammlungen zu erstellen, Abfragen auszuführen, Indizes zu erstellen und vieles mehr - alles ohne menschliches Zutun.</p>
<p>Kurz gesagt, der MCP Server verwandelt Milvus nicht nur in eine Datenbank, sondern in ein vollständig programmierbares, KI-fähiges Backend, das den Weg für intelligente, autonome und skalierbare Anwendungen ebnet.</p>
<h2 id="Getting-Started-with-Milvus-SDK-v2-Sample-Code" class="common-anchor-header">Erste Schritte mit Milvus SDK v2: Beispiel-Code<button data-href="#Getting-Started-with-Milvus-SDK-v2-Sample-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Die folgenden Beispiele zeigen, wie die neue PyMilvus-Schnittstelle (Python SDK v2) verwendet wird, um eine Sammlung zu erstellen und asynchrone Operationen durchzuführen. Verglichen mit dem ORM-ähnlichen Ansatz der Vorgängerversion ist dieser Code sauberer, konsistenter und einfacher zu handhaben.</p>
<h3 id="1-Creating-a-Collection-Defining-Schemas-Building-Indexes-and-Loading-Data-with-MilvusClient" class="common-anchor-header">1. Erstellen einer Sammlung, Definieren von Schemata, Erstellen von Indizes und Laden von Daten mit <code translate="no">MilvusClient</code></h3><p>Der folgende Python-Codeausschnitt zeigt, wie man eine Sammlung erstellt, ihr Schema definiert, Indizes erstellt und Daten lädt - alles in einem Aufruf:</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

<span class="hljs-comment"># 1. Connect to Milvus (initialize the client)</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># 2. Define the collection schema</span>
schema = MilvusClient.create_schema(auto_id=<span class="hljs-literal">False</span>, description=<span class="hljs-string">&quot;schema for example collection&quot;</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)  <span class="hljs-comment"># Primary key field</span>
schema.add_field(<span class="hljs-string">&quot;embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">128</span>)  <span class="hljs-comment"># Vector field</span>

<span class="hljs-comment"># 3. Prepare index parameters (optional if indexing at creation time)</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;L2&quot;</span>
)

<span class="hljs-comment"># 4. Create the collection with indexes and load it into memory automatically</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;example_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Collection created and loaded with index!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Der Parameter <code translate="no">index_params</code> der Methode <code translate="no">create_collection</code> macht separate Aufrufe für <code translate="no">create_index</code> und <code translate="no">load_collection</code>überflüssig - alles geschieht automatisch.</p>
<p>Darüber hinaus unterstützt <code translate="no">MilvusClient</code> einen Modus zur schnellen Tabellenerstellung. So kann beispielsweise eine Sammlung in einer einzigen Codezeile erstellt werden, indem nur die erforderlichen Parameter angegeben werden:</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_collection</span>(
    collection_name=<span class="hljs-string">&quot;test_collection&quot;</span>,
    dimension=<span class="hljs-number">128</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><em>(Vergleichsanmerkung: Im alten ORM-Ansatz mussten Sie eine <code translate="no">Collection(schema)</code> erstellen und dann separat <code translate="no">collection.create_index()</code> und <code translate="no">collection.load()</code> aufrufen; jetzt rationalisiert MilvusClient den gesamten Prozess).</em></p>
<h3 id="2-Performing-High-Concurrency-Asynchronous-Inserts-with-AsyncMilvusClient" class="common-anchor-header">2. Durchführen von asynchronen Einfügungen mit hoher Gleichzeitigkeit <code translate="no">AsyncMilvusClient</code></h3><p>Das folgende Beispiel zeigt, wie <code translate="no">AsyncMilvusClient</code> verwendet werden kann, um gleichzeitige Einfügeoperationen mit <code translate="no">async/await</code> durchzuführen:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> AsyncMilvusClient

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">insert_vectors_concurrently</span>():
    client = AsyncMilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
    
    vectors_to_insert = [[...], [...], ...]  <span class="hljs-comment"># Assume 100,000 vectors</span>
    batch_size = <span class="hljs-number">1000</span>  <span class="hljs-comment"># Recommended batch size</span>
    tasks = []

    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(vectors_to_insert), batch_size):
        batch_vectors = vectors_to_insert[i:i+batch_size]

        <span class="hljs-comment"># Construct batch data</span>
        data = [
            <span class="hljs-built_in">list</span>(<span class="hljs-built_in">range</span>(i, i + <span class="hljs-built_in">len</span>(batch_vectors))),  <span class="hljs-comment"># Batch IDs</span>
            batch_vectors  <span class="hljs-comment"># Batch vectors</span>
        ]

        <span class="hljs-comment"># Add an asynchronous task for inserting each batch</span>
        tasks.append(client.insert(<span class="hljs-string">&quot;example_collection&quot;</span>, data=data))

    <span class="hljs-comment"># Concurrently execute batch inserts</span>
    insert_results = <span class="hljs-keyword">await</span> asyncio.gather(*tasks)
    <span class="hljs-keyword">await</span> client.close()

<span class="hljs-comment"># Execute asynchronous tasks</span>
asyncio.run(insert_vectors_concurrently())
<button class="copy-code-btn"></button></code></pre>
<p>In diesem Beispiel wird <code translate="no">AsyncMilvusClient</code> zum gleichzeitigen Einfügen von Daten verwendet, indem mehrere Einfügeaufgaben mit <code translate="no">asyncio.gather</code> geplant werden. Dieser Ansatz nutzt die Vorteile der Fähigkeiten von Milvus zur gleichzeitigen Verarbeitung im Backend voll aus. Im Gegensatz zu den synchronen, zeilenweisen Einfügungen in v1 erhöht diese native asynchrone Unterstützung den Durchsatz erheblich.</p>
<p>Ebenso können Sie den Code modifizieren, um gleichzeitige Abfragen oder Suchen durchzuführen, indem Sie beispielsweise den Einfügeaufruf durch <code translate="no">client.search(&quot;example_collection&quot;, data=[query_vec], limit=5)</code> ersetzen. Die asynchrone Schnittstelle von Milvus SDK v2 stellt sicher, dass jede Anfrage nicht blockierend ausgeführt wird und sowohl die Client- als auch die Server-Ressourcen vollständig genutzt werden.</p>
<h2 id="Migration-Made-Easy" class="common-anchor-header">Migration leicht gemacht<button data-href="#Migration-Made-Easy" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir wissen, dass Sie viel Zeit in SDK v1 investiert haben, daher haben wir SDK v2 mit Blick auf Ihre bestehenden Anwendungen entwickelt. SDK v2 bietet Abwärtskompatibilität, so dass vorhandene Schnittstellen im Stil von v1/ORM noch eine Weile funktionieren werden. Wir empfehlen jedoch dringend, so bald wie möglich auf SDK v2 umzusteigen - der Support für v1 wird mit der Veröffentlichung von Milvus 3.0 (Ende 2025) enden.</p>
<p>Der Umstieg auf SDK v2 bietet eine konsistentere, moderne Entwicklererfahrung mit vereinfachter Syntax, besserer asynchroner Unterstützung und verbesserter Leistung. Außerdem werden alle neuen Funktionen und der Community-Support in Zukunft darauf ausgerichtet sein. Wenn Sie jetzt upgraden, sind Sie bereit für das, was als Nächstes kommt, und erhalten Zugang zum Besten, was Milvus zu bieten hat.</p>
<h2 id="Conclusion" class="common-anchor-header">Fazit<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus SDK v2 bringt erhebliche Verbesserungen gegenüber v1: verbesserte Leistung, eine einheitliche und konsistente Schnittstelle für mehrere Programmiersprachen und native asynchrone Unterstützung, die Operationen mit hoher Gleichzeitigkeit vereinfacht. Mit einer übersichtlicheren Dokumentation und intuitiveren Code-Beispielen soll Milvus SDK v2 Ihren Entwicklungsprozess rationalisieren und die Erstellung und Bereitstellung von KI-Anwendungen einfacher und schneller machen.</p>
<p>Ausführlichere Informationen finden Sie in unserer neuesten offiziellen <a href="https://milvus.io/docs/install-pymilvus.md#Install-Milvus-Python-SDK">API-Referenz und den Benutzerhandbüchern</a>. Wenn Sie Fragen oder Anregungen zum neuen SDK haben, können Sie uns gerne auf <a href="https://github.com/milvus-io/milvus/discussions">GitHub</a> und <a href="https://discord.com/invite/8uyFbECzPX">Discord</a> Feedback geben. Wir freuen uns auf Ihren Input, um Milvus weiter zu verbessern.</p>
