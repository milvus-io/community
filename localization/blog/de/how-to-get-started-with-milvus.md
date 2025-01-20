---
id: how-to-get-started-with-milvus.md
title: Wie Sie mit Milvus beginnen
author: Ruben Winastwan
date: 2025-01-17T00:00:00.000Z
cover: >-
  assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: false
canonicalUrl: 'https://milvus.io/blog/how-to-get-started-with-milvus.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_To_Get_Started_With_Milvus_20230517_084248_28560b1efc.png" alt="How to get started with Milvus" class="doc-image" id="how-to-get-started-with-milvus" />
   </span> <span class="img-wrapper"> <span>Wie man mit Milvus anfängt</span> </span></p>
<p><strong><em>Letzte Aktualisierung Januar 2025</em></strong></p>
<p>Die Fortschritte im Bereich der Large Language Models<a href="https://zilliz.com/glossary/large-language-models-(llms)">(LLMs</a>) und das wachsende Datenvolumen erfordern eine flexible und skalierbare Infrastruktur zur Speicherung riesiger Informationsmengen, beispielsweise eine Datenbank. <a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">Herkömmliche Datenbanken</a> sind jedoch für die Speicherung von tabellarischen und strukturierten Daten ausgelegt, während die Informationen, die für die Nutzung der Leistung von hochentwickelten LLMs und Algorithmen zur Informationsgewinnung nützlich sind, <a href="https://zilliz.com/learn/introduction-to-unstructured-data">unstrukturiert</a> sind, wie z. B. Text, Bilder, Videos oder Audio.</p>
<p><a href="https://zilliz.com/learn/what-is-vector-database">Vektordatenbanken</a> sind Datenbanksysteme, die speziell für unstrukturierte Daten entwickelt wurden. Mit Vektordatenbanken können nicht nur riesige Mengen unstrukturierter Daten gespeichert werden, sondern es können auch <a href="https://zilliz.com/learn/vector-similarity-search">Vektorsuchen</a> durchgeführt werden. Vektordatenbanken verfügen über fortschrittliche Indizierungsmethoden wie Inverted File Index (IVFFlat) oder Hierarchical Navigable Small World<a href="https://zilliz.com/learn/hierarchical-navigable-small-worlds-HNSW">(HNSW</a>), um schnelle und effiziente Vektorsuch- und Informationsgewinnungsprozesse durchzuführen.</p>
<p><strong>Milvus</strong> ist eine Open-Source-Vektordatenbank, mit der wir alle vorteilhaften Funktionen einer Vektordatenbank nutzen können. Das werden wir in diesem Beitrag behandeln:</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#What-is-Milvus">Ein Überblick über Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Milvus-Deployment-Options">Einsatzmöglichkeiten von Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Getting-Started-with-Milvus-Lite">Erste Schritte mit Milvus Lite</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Getting-Started-with-Milvus-Standalone">Erste Schritte mit Milvus Standalone</a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-get-started-with-milvus.md#Fully-Managed-Milvus">Vollständig verwaltetes Milvus </a></p></li>
</ul>
<h2 id="What-is-Milvus" class="common-anchor-header">Was ist Milvus?<button data-href="#What-is-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/docs/overview.md"><strong>Milvus</strong> ist </a>eine Open-Source-Vektordatenbank, die es uns ermöglicht, große Mengen unstrukturierter Daten zu speichern und schnelle und effiziente Vektorsuchen durchzuführen. Milvus ist sehr nützlich für viele populäre GenAI-Anwendungen, wie z.B. Empfehlungssysteme, personalisierte Chatbots, Anomalieerkennung, Bildsuche, natürliche Sprachverarbeitung und Retrieval Augmented Generation<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">(RAG</a>).</p>
<p>Die Verwendung von Milvus als Vektordatenbank bietet mehrere Vorteile:</p>
<ul>
<li><p>Milvus bietet mehrere Bereitstellungsoptionen, aus denen Sie je nach Ihrem Anwendungsfall und der Größe der zu erstellenden Anwendungen wählen können.</p></li>
<li><p>Milvus unterstützt eine Vielzahl von Indizierungsmethoden, um verschiedenen Daten- und Leistungsanforderungen gerecht zu werden, darunter In-Memory-Optionen wie FLAT, IVFFlat, HNSW und <a href="https://zilliz.com/learn/what-is-scann-scalable-nearest-neighbors-google">SCANN</a>, quantisierte Varianten für Speichereffizienz, <a href="https://zilliz.com/learn/DiskANN-and-the-Vamana-Algorithm">On-Disk-ANN</a> für große Datensätze und GPU-optimierte Indizes wie GPU_CAGRA, GPU_IVF_FLAT und GPU_IVF_PQ für beschleunigte, speichereffiziente Suchen.</p></li>
<li><p>Milvus bietet auch eine hybride Suche, bei der wir eine Kombination aus dichten Einbettungen, spärlichen Einbettungen und Metadatenfilterung während der Vektorsuche verwenden können, was zu genaueren Suchergebnissen führt. Darüber hinaus unterstützt <a href="https://milvus.io/blog/introduce-milvus-2-5-full-text-search-powerful-metadata-filtering-and-more.md">Milvus 2.5</a> jetzt eine hybride <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">Volltextsuche</a> und eine Vektorsuche, die Ihre Suche noch genauer macht.</p></li>
<li><p>Milvus kann über die <a href="https://zilliz.com/cloud">Zilliz Cloud</a> vollständig in der Cloud genutzt werden, wo Sie die Betriebskosten und die Geschwindigkeit der Vektorsuche dank vier fortschrittlicher Funktionen optimieren können: logische Cluster, Disaggregation von Streaming- und historischen Daten, Tiered Storage, Autoscaling und Hot-Cold-Trennung mit mehreren Mandanten.</p></li>
</ul>
<p>Wenn Sie Milvus als Vektordatenbank verwenden, können Sie zwischen drei verschiedenen Bereitstellungsoptionen wählen, die jeweils ihre Stärken und Vorteile haben. Wir werden im nächsten Abschnitt auf jede dieser Optionen eingehen.</p>
<h2 id="Milvus-Deployment-Options" class="common-anchor-header">Milvus-Bereitstellungsoptionen<button data-href="#Milvus-Deployment-Options" class="anchor-icon" translate="no">
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
    </button></h2><p>Für den Start mit Milvus stehen vier Bereitstellungsoptionen zur Verfügung: <strong>Milvus Lite, Milvus Standalone, Milvus Distributed und Zilliz Cloud (verwaltetes Milvus).</strong> Jede Bereitstellungsoption ist auf verschiedene Szenarien in unserem Anwendungsfall zugeschnitten, wie z. B. die Größe unserer Daten, den Zweck unserer Anwendung und den Umfang unserer Anwendung.</p>
<h3 id="Milvus-Lite" class="common-anchor-header">Milvus Lite</h3><p><a href="https://milvus.io/docs/quickstart.md"><strong>Milvus Lite</strong></a> ist eine leichtgewichtige Version von Milvus und der einfachste Weg für uns, um loszulegen. Im nächsten Abschnitt werden wir sehen, wie wir Milvus Lite in Aktion ausführen können. Alles, was wir dafür tun müssen, ist die Installation der Pymilvus-Bibliothek mit pip. Danach können wir die meisten Kernfunktionalitäten von Milvus als Vektordatenbank ausführen.</p>
<p>Milvus Lite eignet sich perfekt für schnelles Prototyping oder zu Lernzwecken und kann ohne komplizierte Einrichtung in einem Jupyter-Notebook ausgeführt werden. Was die Vektorspeicherung angeht, so ist Milvus Lite für die Speicherung von bis zu einer Million Vektoreinbettungen geeignet. Aufgrund seines geringen Gewichts und seiner Speicherkapazität ist Milvus Lite eine perfekte Einsatzoption für die Arbeit mit Edge-Geräten, z. B. als Suchmaschine für private Dokumente, On-Device-Objekterkennung usw.</p>
<h3 id="Milvus-Standalone" class="common-anchor-header">Milvus Standalone</h3><p>Milvus Standalone ist eine Serverbereitstellung für eine einzelne Maschine, die in einem Docker-Image verpackt ist. Alles, was wir tun müssen, um loszulegen, ist die Installation von Milvus in Docker und der anschließende Start des Docker-Containers. Im nächsten Abschnitt sehen wir uns die detaillierte Implementierung von Milvus Standalone an.</p>
<p>Milvus Standalone ist ideal für die Entwicklung und Produktion von kleinen bis mittelgroßen Anwendungen, da es bis zu 10 Millionen Vektoreinbettungen speichern kann. Darüber hinaus bietet Milvus Standalone eine hohe Verfügbarkeit durch einen primären Backup-Modus, was es für den Einsatz in produktionsreifen Anwendungen äußerst zuverlässig macht.</p>
<p>Wir können Milvus Standalone zum Beispiel auch nach einem schnellen Prototyping und dem Erlernen der Milvus-Funktionalitäten mit Milvus Lite verwenden, da sowohl Milvus Standalone als auch Milvus Lite dieselbe clientseitige API nutzen.</p>
<h3 id="Milvus-Distributed" class="common-anchor-header">Milvus Verteilt</h3><p>Milvus Distributed ist eine Bereitstellungsoption, die eine Cloud-basierte Architektur nutzt, bei der Dateneingabe und -abruf separat gehandhabt werden, was eine hoch skalierbare und effiziente Anwendung ermöglicht.</p>
<p>Für die Ausführung von Milvus Distributed ist in der Regel ein Kubernetes-Cluster erforderlich, damit der Container auf mehreren Maschinen und Umgebungen ausgeführt werden kann. Der Einsatz eines Kubernetes-Clusters gewährleistet die Skalierbarkeit und Flexibilität von Milvus Distributed, indem die zugewiesenen Ressourcen je nach Bedarf und Arbeitslast angepasst werden können. Das bedeutet auch, dass bei einem Ausfall eines Teils die anderen Teile übernehmen können, so dass das gesamte System unterbrechungsfrei bleibt.</p>
<p>Milvus Distributed ist in der Lage, bis zu zehn Milliarden Vektoreinbettungen zu verarbeiten und wurde speziell für Anwendungsfälle entwickelt, in denen die Daten zu groß sind, um auf einem einzelnen Server gespeichert zu werden. Daher ist diese Bereitstellungsoption ideal für Unternehmensclients, die eine große Benutzerbasis bedienen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Vector_embedding_storage_capability_of_different_Milvus_deployment_options_e3959ccfcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung: Speicherkapazität für die Vektoreinbettung bei verschiedenen Milvus-Bereitstellungsoptionen.</em></p>
<p>In diesem Artikel zeigen wir Ihnen, wie Sie sowohl mit Milvus Lite als auch mit Milvus Standalone beginnen können, da Sie mit beiden Methoden ohne komplizierte Einrichtung schnell loslegen können. Milvus Distributed hingegen ist komplizierter einzurichten. Sobald wir Milvus Distributed eingerichtet haben, sind der Code und der logische Prozess zur Erstellung von Sammlungen, zur Aufnahme von Daten, zur Durchführung von Vektorsuchen usw. ähnlich wie bei Milvus Lite und Milvus Standalone, da sie dieselbe clientseitige API verwenden.</p>
<p>Zusätzlich zu den drei oben genannten Bereitstellungsoptionen können Sie auch das verwaltete Milvus auf der <a href="https://zilliz.com/cloud">Zilliz Cloud</a> ausprobieren, um eine problemlose Erfahrung zu machen. Wir werden auch über Zilliz Cloud später in diesem Artikel sprechen.</p>
<h2 id="Getting-Started-with-Milvus-Lite" class="common-anchor-header">Erste Schritte mit Milvus Lite<button data-href="#Getting-Started-with-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Lite kann direkt mit Python implementiert werden, indem eine Bibliothek namens Pymilvus mit pip importiert wird. Bevor Sie Pymilvus installieren, stellen Sie sicher, dass Ihre Umgebung die folgenden Anforderungen erfüllt:</p>
<ul>
<li><p>Ubuntu &gt;= 20.04 (x86_64 und arm64)</p></li>
<li><p>MacOS &gt;= 11.0 (Apple Silicon M1/M2 und x86_64)</p></li>
<li><p>Python 3.7 oder höher</p></li>
</ul>
<p>Sobald diese Voraussetzungen erfüllt sind, können Sie Milvus Lite und die notwendigen Abhängigkeiten für die Demonstration mit dem folgenden Befehl installieren:</p>
<pre><code translate="no">!pip install -U pymilvus
!pip install <span class="hljs-string">&quot;pymilvus[model]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p><code translate="no">!pip install -U pymilvus</code>: Dieser Befehl installiert oder aktualisiert die <code translate="no">pymilvus</code> Bibliothek, das Python SDK von Milvus. Milvus Lite ist mit PyMilvus gebündelt, so dass diese einzige Codezeile alles ist, was Sie brauchen, um Milvus Lite zu installieren.</p></li>
<li><p><code translate="no">!pip install &quot;pymilvus[model]&quot;</code>: Dieser Befehl fügt erweiterte Funktionen und zusätzliche Tools hinzu, die bereits in Milvus integriert sind, darunter Machine-Learning-Modelle wie Hugging Face Transformers, Jina AI Embedding Models und Reranking Models.</p></li>
</ul>
<p>Hier sind die Schritte, die wir mit Milvus Lite durchführen werden:</p>
<ol>
<li><p>Umwandlung von Textdaten in ihre Einbettungsrepräsentation mithilfe eines Einbettungsmodells.</p></li>
<li><p>Erstellen eines Schemas in unserer Milvus-Datenbank, um unsere Textdaten und deren Einbettungsrepräsentationen zu speichern.</p></li>
<li><p>Speichern und indizieren Sie unsere Daten in unserem Schema.</p></li>
<li><p>Durchführen einer einfachen Vektorsuche auf den gespeicherten Daten.</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Workflow_of_vector_search_operation_3e38ccc1f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung: Arbeitsablauf einer Vektorsuche.</em></p>
<p>Um Textdaten in Vektoreinbettungen umzuwandeln, verwenden wir ein <a href="https://zilliz.com/ai-models">Einbettungsmodell</a> von SentenceTransformers namens "all-MiniLM-L6-v2". Dieses Einbettungsmodell wandelt unseren Text in eine 384-dimensionale Vektoreinbettung um. Laden wir das Modell, transformieren wir unsere Textdaten und packen wir alles zusammen.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model

docs = [
    <span class="hljs-string">&quot;Artificial intelligence was founded as an academic discipline in 1956.&quot;</span>,
    <span class="hljs-string">&quot;Alan Turing was the first person to conduct substantial research in AI.&quot;</span>,
    <span class="hljs-string">&quot;Born in Maida Vale, London, Turing was raised in southern England.&quot;</span>,
]

sentence_transformer_ef = model.dense.SentenceTransformerEmbeddingFunction(
    model_name=<span class="hljs-string">&#x27;all-MiniLM-L6-v2&#x27;</span>, 
    device=<span class="hljs-string">&#x27;cpu&#x27;</span> 
)

vectors  = sentence_transformer_ef.encode_documents(docs)
data = [ {<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: vectors[i], <span class="hljs-string">&quot;text&quot;</span>: docs[i]} <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(vectors)) ]
<button class="copy-code-btn"></button></code></pre>
<p>Als Nächstes erstellen wir ein Schema, um alle oben genannten Daten in Milvus zu speichern. Wie Sie oben sehen können, bestehen unsere Daten aus drei Feldern: ID, Vektor und Text. Daher werden wir ein Schema mit diesen drei Feldern erstellen.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, db, connections

schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">True</span>,
)

<span class="hljs-comment"># Add fields to schema</span>
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;vector&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">384</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Mit Milvus Lite können wir ganz einfach eine Sammlung in einer bestimmten Datenbank auf der Grundlage des oben definierten Schemas erstellen und die Daten mit nur wenigen Zeilen Code in die Sammlung einfügen und indizieren.</p>
<pre><code translate="no">client = MilvusClient(<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)

index_params = client.prepare_index_params()

<span class="hljs-comment">#  Add indexes</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>, 
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-comment"># Insert data into collection</span>
res = client.insert(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=data
)
<button class="copy-code-btn"></button></code></pre>
<p>Im obigen Code erstellen wir eine Sammlung namens &quot;demo_collection&quot; in einer Milvus-Datenbank namens &quot;milvus_demo&quot;. Als Nächstes indexieren wir alle unsere Daten in die gerade erstellte "demo_collection".</p>
<p>Jetzt, wo wir unsere Daten in der Datenbank haben, können wir für jede beliebige Abfrage eine Vektorsuche durchführen. Nehmen wir an, wir haben eine Abfrage: &quot;<em>Wer ist Alan Turing?</em>&quot;. Wir können die am besten geeignete Antwort auf die Abfrage erhalten, indem wir die folgenden Schritte durchführen:</p>
<ol>
<li><p>Umwandlung unserer Abfrage in eine Vektoreinbettung unter Verwendung desselben Einbettungsmodells, das wir zur Umwandlung unserer Daten in der Datenbank in Einbettungen verwendet haben.</p></li>
<li><p>Berechnung der Ähnlichkeit zwischen der Einbettung unserer Anfrage und der Einbettung jedes Eintrags in der Datenbank unter Verwendung von Metriken wie Cosinus-Ähnlichkeit oder Euklidischer Abstand.</p></li>
<li><p>Abrufen des ähnlichsten Eintrags als passende Antwort auf unsere Anfrage.</p></li>
</ol>
<p>Nachfolgend sehen Sie die Implementierung der oben genannten Schritte mit Milvus:</p>
<pre><code translate="no">query = [<span class="hljs-string">&quot;Who is Alan Turing&quot;</span>]
query_embedding = sentence_transformer_ef.encode_queries(query)

<span class="hljs-comment"># Load collection</span>
client.load_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>
)

<span class="hljs-comment"># Vector search</span>
res = client.search(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=query_embedding,
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<span class="hljs-built_in">print</span>(res)
<span class="hljs-string">&quot;&quot;&quot;
Output:
data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.7199002504348755, &#x27;entity&#x27;: {&#x27;text&#x27;: &#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;}}]&quot;] 
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Und das war's! In der <a href="https://milvus.io/docs/">Milvus-Dokumentation</a> können Sie auch mehr über andere Funktionen erfahren, die Milvus bietet, wie z. B. die Verwaltung von Datenbanken, das Einfügen und Löschen von Sammlungen, die Wahl der richtigen Indizierungsmethode und die Durchführung erweiterter Vektorsuchen mit Metadatenfilterung und hybrider Suche.</p>
<h2 id="Getting-Started-with-Milvus-Standalone" class="common-anchor-header">Erste Schritte mit Milvus Standalone<button data-href="#Getting-Started-with-Milvus-Standalone" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Standalone ist eine Bereitstellungsoption, bei der alles in einen Docker-Container gepackt ist. Daher müssen wir Milvus in Docker installieren und dann den Docker-Container starten, um mit Milvus Standalone beginnen zu können.</p>
<p>Bevor Sie Milvus Standalone installieren, stellen Sie sicher, dass sowohl Ihre Hardware als auch Ihre Software die auf <a href="https://milvus.io/docs/prerequisite-docker.md">dieser Seite</a> beschriebenen Anforderungen erfüllen. Stellen Sie außerdem sicher, dass Sie Docker installiert haben. Um Docker zu installieren, lesen Sie bitte <a href="https://docs.docker.com/get-started/get-docker/">diese Seite</a>.</p>
<p>Sobald unser System die Anforderungen erfüllt und wir Docker installiert haben, können wir mit der Milvus-Installation in Docker mit dem folgenden Befehl fortfahren:</p>
<pre><code translate="no"><span class="hljs-comment"># Download the installation script</span>
$ curl -sfL &lt;https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh&gt; -o standalone_embed.sh

<span class="hljs-comment"># Start the Docker container</span>
$ bash standalone_embed.sh start
<button class="copy-code-btn"></button></code></pre>
<p>Im obigen Code starten wir auch den Docker-Container und sobald er gestartet ist, erhalten Sie eine ähnliche Ausgabe wie unten:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Message_after_successful_starting_of_the_Docker_container_5c60fa15dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung: Meldung nach erfolgreichem Start des Docker-Containers.</em></p>
<p>Nach der Ausführung des obigen Installationsskripts "standalone_embed.sh" wird ein Docker-Container namens "milvus" an Port 19530 gestartet. Daher können wir eine neue Datenbank erstellen und auf alles zugreifen, was mit der Milvus-Datenbank zu tun hat, indem wir beim Erstellen von Verbindungen auf diesen Port verweisen.</p>
<p>Nehmen wir an, wir wollen eine Datenbank mit dem Namen "milvus_demo" erstellen, ähnlich wie wir es oben in Milvus Lite getan haben. Wir können dies wie folgt tun:</p>
<pre><code translate="no">conn = connections.<span class="hljs-title function_">connect</span>(host=<span class="hljs-string">&quot;127.0.0.1&quot;</span>, port=<span class="hljs-number">19530</span>)
database = db.<span class="hljs-title function_">create_database</span>(<span class="hljs-string">&quot;milvus_demo&quot;</span>)

client = <span class="hljs-title class_">MilvusClient</span>(
    uri=<span class="hljs-string">&quot;&lt;http://localhost:19530&gt;&quot;</span>,
    token=<span class="hljs-string">&quot;root:Milvus&quot;</span>,
    db_name=<span class="hljs-string">&quot;milvus_demo&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Als nächstes können Sie überprüfen, ob die neu erstellte Datenbank mit dem Namen "milvus_demo" wirklich in Ihrer Milvus-Instanz existiert, indem Sie auf die <a href="https://milvus.io/docs/milvus-webui.md">Milvus-Web-UI</a> zugreifen. Wie der Name schon sagt, ist Milvus Web UI eine grafische Benutzeroberfläche, die von Milvus zur Verfügung gestellt wird, um die Statistiken und Metriken der Komponenten zu beobachten und die Liste und Details der Datenbanken, Sammlungen und Konfigurationen zu überprüfen. Sie können auf Milvus Web UI zugreifen, sobald Sie den oben genannten Docker-Container unter http://127.0.0.1:9091/webui/ gestartet haben.</p>
<p>Wenn Sie auf den oben genannten Link zugreifen, sehen Sie eine Landing Page wie diese:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Landing_page_UI_187a40e935.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Unter der Registerkarte "Collections" sehen Sie, dass unsere Datenbank "milvus_demo" erfolgreich erstellt wurde. Wie Sie sehen, können Sie mit dieser Web-UI auch andere Dinge wie die Liste der Sammlungen, Konfigurationen, die durchgeführten Abfragen usw. überprüfen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Web_Ui_2_666eae57b1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Jetzt können wir alles genau so durchführen, wie wir es im obigen Abschnitt über Milvus Lite gesehen haben. Erstellen wir eine Sammlung mit dem Namen "demo_collection" in der Datenbank "milvus_demo", die aus drei Feldern besteht, genau wie im Abschnitt "Milvus Lite" zuvor. Dann werden wir unsere Daten in die Sammlung einfügen.</p>
<pre><code translate="no">index_params = client.prepare_index_params()

<span class="hljs-comment">#  Add indexes</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>, 
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)

<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-comment"># Insert data into collection</span>
res = client.insert(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=data
)
<button class="copy-code-btn"></button></code></pre>
<p>Der Code zur Durchführung einer Vektorsuche ist ebenfalls derselbe wie bei Milvus Lite, wie Sie im folgenden Code sehen können:</p>
<pre><code translate="no">query = [<span class="hljs-string">&quot;Who is Alan Turing&quot;</span>]
query_embedding = sentence_transformer_ef.encode_queries(query)

<span class="hljs-comment"># Load collection</span>
client.load_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>
)

<span class="hljs-comment"># Vector search</span>
res = client.search(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    data=query_embedding,
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<span class="hljs-built_in">print</span>(res)
<span class="hljs-string">&quot;&quot;&quot;
Output:
data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.7199004292488098, &#x27;entity&#x27;: {&#x27;text&#x27;: &#x27;Alan Turing was the first person to conduct substantial research in AI.&#x27;}}]&quot;] 
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Abgesehen von der Verwendung von Docker können Sie Milvus Standalone auch mit <a href="https://milvus.io/docs/install_standalone-docker-compose.md">Docker Compose</a> (für Linux) und <a href="https://milvus.io/docs/install_standalone-windows.md">Docker Desktop</a> (für Windows) verwenden.</p>
<p>Wenn wir unsere Milvus-Instanz nicht mehr verwenden, können wir Milvus Standalone mit dem folgenden Befehl beenden:</p>
<pre><code translate="no">$ bash standalone_embed.sh stop
<button class="copy-code-btn"></button></code></pre>
<h2 id="Fully-Managed-Milvus" class="common-anchor-header">Vollständig verwaltetes Milvus<button data-href="#Fully-Managed-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Ein alternativer Weg, um mit Milvus zu beginnen, ist über eine native Cloud-basierte Infrastruktur in <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, wo Sie eine problemlose, 10x schnellere Erfahrung machen können.</p>
<p>Zilliz Cloud bietet dedizierte Cluster mit dedizierten Umgebungen und Ressourcen zur Unterstützung Ihrer KI-Anwendung. Da es sich um eine Cloud-basierte Datenbank handelt, die auf Milvus aufbaut, müssen wir keine lokale Infrastruktur einrichten und verwalten. Zilliz Cloud bietet auch fortschrittlichere Funktionen, wie z. B. die Trennung zwischen Vektorspeicherung und Berechnung, Datensicherung in gängigen Objektspeichersystemen wie S3 und Datencaching zur Beschleunigung von Vektorsuch- und -abrufvorgängen.</p>
<p>Ein Punkt, den man bei Cloud-basierten Diensten beachten sollte, sind jedoch die Betriebskosten. In den meisten Fällen fallen auch dann Kosten an, wenn der Cluster im Leerlauf ist und keine Dateneingabe oder Vektorsuche stattfindet. Wenn Sie die Betriebskosten und die Leistung Ihrer Anwendung weiter optimieren möchten, wäre Zilliz Cloud Serverless eine hervorragende Option.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Key_benefits_of_using_Zilliz_Cloud_Serverless_20f68e0fff.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung: Hauptvorteile der Nutzung von Zilliz Cloud Serverless.</em></p>
<p>Zilliz Cloud Serverless ist bei großen Cloud-Anbietern wie AWS, Azure und GCP verfügbar. Sie bietet Funktionen wie Pay-as-you-go-Preise, d. h. Sie zahlen nur, wenn Sie den Cluster nutzen.</p>
<p>Zilliz Cloud Serverless implementiert auch fortschrittliche Technologien wie logische Cluster, automatische Skalierung, Tiered Storage, Disaggregation von Streaming- und historischen Daten und Hot-Cold-Datentrennung. Diese Funktionen ermöglichen Zilliz Cloud Serverless bis zu 50-fache Kosteneinsparungen und etwa 10-fach schnellere Vektorsuchoperationen im Vergleich zu In-Memory Milvus.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_Illustration_of_tiered_storage_and_hot_cold_data_separation_c634dfd211.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Abbildung: Illustration von Tiered Storage und Hot-Cold-Datentrennung.</em></p>
<p>Wenn Sie mit Zilliz Cloud Serverless beginnen möchten, finden Sie auf <a href="https://zilliz.com/serverless">dieser Seite</a> weitere Informationen.</p>
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
    </button></h2><p>Milvus zeichnet sich als vielseitige und leistungsstarke Vektordatenbank aus, die für die Herausforderungen der Verwaltung unstrukturierter Daten und der Durchführung schneller, effizienter Vektorsuchvorgänge in modernen KI-Anwendungen entwickelt wurde. Mit Bereitstellungsoptionen wie Milvus Lite für schnelles Prototyping, Milvus Standalone für kleine bis mittelgroße Anwendungen und Milvus Distributed für Skalierbarkeit auf Unternehmensebene bietet es Flexibilität für die Größe und Komplexität eines jeden Projekts.</p>
<p>Zusätzlich erweitert Zilliz Cloud Serverless die Fähigkeiten von Milvus in die Cloud und bietet ein kosteneffizientes Pay-as-you-go-Modell, das die Notwendigkeit einer lokalen Infrastruktur eliminiert. Mit fortschrittlichen Funktionen wie Tiered Storage und Auto-Scaling sorgt Zilliz Cloud Serverless für schnellere Vektorsuchvorgänge bei gleichzeitiger Kostenoptimierung.</p>
