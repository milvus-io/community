---
id: why-and-when-you-need-a-purpose-built-vector-database.md
title: Warum und wann brauchen Sie eine zweckgebundene Vektordatenbank?
author: James Luan
date: 2023-08-29T00:00:00.000Z
cover: >-
  assets.zilliz.com/Why_you_need_a_real_vector_database2_20230830_075505_1_4b32582c87.png
tag: Engineering
tags: >-
  Vector Database, AI, Artificial Intelligence, Machine Learning, Milvus, LLM,
  Large Language Models, Embeddings, Vector search, Vector similarity search
desc: >-
  Dieser Beitrag gibt einen Überblick über die Vektorsuche und ihre
  Funktionsweise, vergleicht verschiedene Vektorsuchtechnologien und erläutert,
  warum die Entscheidung für eine speziell entwickelte Vektordatenbank
  entscheidend ist.
recommend: true
canonicalUrl: >-
  https://www.aiacceleratorinstitute.com/why-and-when-do-you-need-a-purpose-built-vector-database/
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Why_you_need_a_real_vector_database2_20230830_075505_1_4b32582c87.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Dieser Artikel wurde ursprünglich auf <a href="https://www.aiacceleratorinstitute.com/why-and-when-do-you-need-a-purpose-built-vector-database/">AIAI</a> veröffentlicht und wird hier mit Genehmigung wiederveröffentlicht.</em></p>
<p>Die zunehmende Beliebtheit von <a href="https://zilliz.com/learn/ChatGPT-Vector-Database-Prompt-as-code">ChatGPT</a> und anderen großen Sprachmodellen (LLMs) hat den Aufstieg von Vektorsuchtechnologien vorangetrieben, darunter speziell entwickelte Vektordatenbanken wie <a href="https://milvus.io/docs/overview.md">Milvus</a> und <a href="https://zilliz.com/cloud">Zilliz Cloud</a>, Vektorsuchbibliotheken wie <a href="https://zilliz.com/blog/set-up-with-facebook-ai-similarity-search-faiss">FAISS</a> und in herkömmliche Datenbanken integrierte Vektorsuch-Plugins. Die Wahl der besten Lösung für Ihre Anforderungen kann jedoch eine Herausforderung sein. Wie bei der Wahl zwischen einem Spitzenrestaurant und einer Fast-Food-Kette hängt die Auswahl der richtigen Vektorsuchtechnologie von Ihren Bedürfnissen und Erwartungen ab.</p>
<p>In diesem Beitrag gebe ich einen Überblick über die Vektorsuche und ihre Funktionsweise, vergleiche verschiedene Vektorsuchtechnologien und erkläre, warum die Entscheidung für eine speziell entwickelte Vektordatenbank entscheidend ist.</p>
<h2 id="What-is-vector-search-and-how-does-it-work" class="common-anchor-header">Was ist die Vektorsuche, und wie funktioniert sie?<button data-href="#What-is-vector-search-and-how-does-it-work" class="anchor-icon" translate="no">
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
    </button></h2><p>Die<a href="https://zilliz.com/blog/vector-similarity-search">Vektorsuche</a>, auch bekannt als Vektorähnlichkeitssuche, ist eine Technik zum Abrufen der Top-k-Ergebnisse, die einem gegebenen Abfragevektor am ähnlichsten oder semantisch verwandt sind, aus einer umfangreichen Sammlung dichter Vektordaten.</p>
<p>Bevor wir eine Ähnlichkeitssuche durchführen, nutzen wir neuronale Netze, um <a href="https://zilliz.com/blog/introduction-to-unstructured-data">unstrukturierte Daten</a> wie Text, Bilder, Videos und Audio in hochdimensionale numerische Vektoren umzuwandeln, die als Einbettungsvektoren bezeichnet werden. So können wir beispielsweise das vortrainierte neuronale Faltungsnetzwerk ResNet-50 verwenden, um ein Vogelbild in eine Sammlung von Einbettungsvektoren mit 2.048 Dimensionen umzuwandeln. Hier werden die ersten drei und die letzten drei Vektorelemente aufgeführt: <code translate="no">[0.1392, 0.3572, 0.1988, ..., 0.2888, 0.6611, 0.2909]</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/bird_image_4a1be18f99.png" alt="A bird image by Patrice Bouchard" class="doc-image" id="a-bird-image-by-patrice-bouchard" />
   </span> <span class="img-wrapper"> <span>Ein Vogelbild von Patrice Bouchard</span> </span></p>
<p>Nach der Erzeugung von Einbettungsvektoren vergleichen Vektorsuchmaschinen den räumlichen Abstand zwischen dem Eingabeabfragevektor und den Vektoren in den Vektorspeichern. Je näher sie sich im Raum befinden, desto ähnlicher sind sie sich.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Frame_3732_20230510_073643_25f985523e.png" alt="Embedding arithmetic" class="doc-image" id="embedding-arithmetic" />
   </span> <span class="img-wrapper"> <span>Arithmetik der Einbettung</span> </span></p>
<h2 id="Popular-vector-search-technologies" class="common-anchor-header">Beliebte Vektorsuchtechnologien<button data-href="#Popular-vector-search-technologies" class="anchor-icon" translate="no">
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
    </button></h2><p>Auf dem Markt sind mehrere Vektorsuchtechnologien erhältlich, darunter Bibliotheken für maschinelles Lernen wie NumPy von Python, Vektorsuchbibliotheken wie FAISS, Vektorsuch-Plugins, die auf herkömmlichen Datenbanken aufbauen, und spezialisierte Vektordatenbanken wie Milvus und Zilliz Cloud.</p>
<h3 id="Machine-learning-libraries" class="common-anchor-header">Bibliotheken für maschinelles Lernen</h3><p>Die Verwendung von Bibliotheken für maschinelles Lernen ist der einfachste Weg, um Vektorsuchen zu implementieren. Zum Beispiel können wir mit NumPy von Python einen Nearest Neighbor-Algorithmus in weniger als 20 Zeilen Code implementieren.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np

<span class="hljs-comment"># Function to calculate euclidean distance</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">euclidean_distance</span>(<span class="hljs-params">a, b</span>):
<span class="hljs-keyword">return</span> np.linalg.norm(a - b)

<span class="hljs-comment"># Function to perform knn</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">knn</span>(<span class="hljs-params">data, target, k</span>):
<span class="hljs-comment"># Calculate distances between target and all points in the data</span>
distances = [euclidean_distance(d, target) <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> data]
<span class="hljs-comment"># Combine distances with data indices</span>
distances = np.array(<span class="hljs-built_in">list</span>(<span class="hljs-built_in">zip</span>(distances, np.arange(<span class="hljs-built_in">len</span>(data)))))

<span class="hljs-comment"># Sort by distance</span>
sorted_distances = distances[distances[:, <span class="hljs-number">0</span>].argsort()]

<span class="hljs-comment"># Get the top k closest indices</span>
closest_k_indices = sorted_distances[:k, <span class="hljs-number">1</span>].astype(<span class="hljs-built_in">int</span>)

<span class="hljs-comment"># Return the top k closest vectors</span>
<span class="hljs-keyword">return</span> data[closest_k_indices]
<button class="copy-code-btn"></button></code></pre>
<p>Wir können 100 zweidimensionale Vektoren erzeugen und den nächsten Nachbarn des Vektors [0.5, 0.5] finden.</p>
<pre><code translate="no"><span class="hljs-comment"># Define some 2D vectors</span>
data = np.random.rand(<span class="hljs-number">100</span>, <span class="hljs-number">2</span>)

<span class="hljs-comment"># Define a target vector</span>
target = np.array([<span class="hljs-number">0.5</span>, <span class="hljs-number">0.5</span>])

<span class="hljs-comment"># Define k</span>
k = <span class="hljs-number">3</span>

<span class="hljs-comment"># Perform knn</span>
closest_vectors = knn(data, target, k)

<span class="hljs-comment"># Print the result</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;The closest vectors are:&quot;</span>)
<span class="hljs-built_in">print</span>(closest_vectors)
<button class="copy-code-btn"></button></code></pre>
<p>Bibliotheken für maschinelles Lernen, wie z. B. NumPy von Python, bieten große Flexibilität zu geringen Kosten. Allerdings haben sie auch einige Einschränkungen. Zum Beispiel können sie nur eine kleine Datenmenge verarbeiten und gewährleisten keine Datenpersistenz.</p>
<p>Ich empfehle die Verwendung von NumPy oder anderen Bibliotheken für maschinelles Lernen für die Vektorsuche nur, wenn:</p>
<ul>
<li>Sie schnelles Prototyping benötigen.</li>
<li>Sie sich nicht um die Datenpersistenz kümmern.</li>
<li>Ihre Datengröße unter einer Million liegt und Sie keine skalare Filterung benötigen.</li>
<li>Sie keine hohe Leistung benötigen.</li>
</ul>
<h3 id="Vector-search-libraries" class="common-anchor-header">Vektorsuchbibliotheken</h3><p>Mit Hilfe von Vektorsuchbibliotheken können Sie schnell einen leistungsstarken Prototyp für ein Vektorsuchsystem erstellen. FAISS ist ein typisches Beispiel. Es ist Open-Source und wurde von Meta für effiziente Ähnlichkeitssuche und dichtes Vektorclustering entwickelt. FAISS kann Vektorsammlungen beliebiger Größe verarbeiten, auch solche, die nicht vollständig in den Speicher geladen werden können. Darüber hinaus bietet FAISS Werkzeuge für die Auswertung und Parameterabstimmung. Obwohl in C++ geschrieben, bietet FAISS eine Python/NumPy-Schnittstelle.</p>
<p>Nachfolgend finden Sie den Code für eine beispielhafte Vektorsuche auf der Grundlage von FAISS:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> faiss

<span class="hljs-comment"># Generate some example data</span>
dimension = <span class="hljs-number">64</span> <span class="hljs-comment"># dimension of the vector space</span>
database_size = <span class="hljs-number">10000</span> <span class="hljs-comment"># size of the database</span>
query_size = <span class="hljs-number">100</span> <span class="hljs-comment"># number of queries to perform</span>
np.random.seed(<span class="hljs-number">123</span>) <span class="hljs-comment"># make the random numbers predictable</span>

<span class="hljs-comment"># Generating vectors to index in the database (db_vectors)</span>
db_vectors = np.random.random((database_size, dimension)).astype(<span class="hljs-string">&#x27;float32&#x27;</span>)

<span class="hljs-comment"># Generating vectors for query (query_vectors)</span>
query_vectors = np.random.random((query_size, dimension)).astype(<span class="hljs-string">&#x27;float32&#x27;</span>)

<span class="hljs-comment"># Building the index</span>
index = faiss.IndexFlatL2(dimension) <span class="hljs-comment"># using the L2 distance metric</span>
<span class="hljs-built_in">print</span>(index.is_trained) <span class="hljs-comment"># should return True</span>

<span class="hljs-comment"># Adding vectors to the index</span>
index.add(db_vectors)
<span class="hljs-built_in">print</span>(index.ntotal) <span class="hljs-comment"># should return database_size (10000)</span>

<span class="hljs-comment"># Perform a search</span>
k = <span class="hljs-number">4</span> <span class="hljs-comment"># we want to see 4 nearest neighbors</span>
distances, indices = index.search(query_vectors, k)

<span class="hljs-comment"># Print the results</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Indices of nearest neighbors: \n&quot;</span>, indices)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nL2 distances to the nearest neighbors: \n&quot;</span>, distances)
<button class="copy-code-btn"></button></code></pre>
<p>Vektorsuchbibliotheken wie FAISS sind einfach zu verwenden und schnell genug, um kleine Produktionsumgebungen mit Millionen von Vektoren zu verarbeiten. Sie können ihre Abfrageleistung verbessern, indem Sie Quantisierung und GPUs nutzen und die Datenabmessungen reduzieren.</p>
<p>Diese Bibliotheken haben jedoch einige Einschränkungen, wenn sie in der Produktion eingesetzt werden. So unterstützt FAISS beispielsweise nicht das Hinzufügen und Löschen von Daten in Echtzeit, Remote-Aufrufe, mehrere Sprachen, skalare Filterung, Skalierbarkeit oder Notfallwiederherstellung.</p>
<h3 id="Different-types-of-vector-databases" class="common-anchor-header">Verschiedene Arten von Vektordatenbanken</h3><p>Vektordatenbanken wurden entwickelt, um die Einschränkungen der oben genannten Bibliotheken zu überwinden und eine umfassendere und praktischere Lösung für Produktionsanwendungen zu bieten.</p>
<p>Vier Arten von Vektordatenbanken sind auf dem Schlachtfeld verfügbar:</p>
<ul>
<li>Vorhandene relationale oder spaltenbasierte Datenbanken, die ein Vektorsuch-Plugin enthalten. PG Vector ist ein Beispiel dafür.</li>
<li>Herkömmliche Suchmaschinen mit invertiertem Index und Unterstützung für dichte Vektorindizierung. <a href="https://zilliz.com/comparison/elastic-vs-milvus">ElasticSearch</a> ist ein Beispiel dafür.</li>
<li>Leichtgewichtige Vektordatenbanken, die auf Vektorsuchbibliotheken aufbauen. Chroma ist ein Beispiel dafür.</li>
<li><strong>Speziell angefertigte Vektordatenbanken</strong>. Dieser Datenbanktyp ist speziell für die Vektorsuche von Grund auf konzipiert und optimiert. Speziell entwickelte Vektordatenbanken bieten in der Regel erweiterte Funktionen, einschließlich verteilter Datenverarbeitung, Notfallwiederherstellung und Datenpersistenz. <a href="https://zilliz.com/what-is-milvus">Milvus</a> ist ein gutes Beispiel dafür.</li>
</ul>
<p>Nicht alle Vektordatenbanken sind gleich. Jeder Stack hat einzigartige Vorteile und Einschränkungen, die sie für verschiedene Anwendungen mehr oder weniger geeignet machen.</p>
<p>Ich bevorzuge spezialisierte Vektordatenbanken gegenüber anderen Lösungen, weil sie die effizienteste und bequemste Option sind und zahlreiche einzigartige Vorteile bieten. In den folgenden Abschnitten werde ich am Beispiel von Milvus die Gründe für meine Bevorzugung erläutern.</p>
<h2 id="Key-benefits-of-purpose-built-vector-databases" class="common-anchor-header">Hauptvorteile speziell entwickelter Vektordatenbanken<button data-href="#Key-benefits-of-purpose-built-vector-databases" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a> ist eine verteilte, zweckbestimmte Open-Source-Vektordatenbank, die Milliarden von Einbettungsvektoren speichern, indizieren, verwalten und abrufen kann. Sie ist auch eine der beliebtesten Vektordatenbanken für die <a href="https://zilliz.com/use-cases/llm-retrieval-augmented-generation">LLM-Augmented-Generierung</a>. Als beispielhaftes Beispiel für zweckbestimmte Vektordatenbanken hat Milvus viele einzigartige Vorteile mit seinen Gegenstücken gemeinsam.</p>
<h3 id="Data-Persistence-and-Cost-Effective-Storage" class="common-anchor-header">Datenpersistenz und kosteneffiziente Speicherung</h3><p>Die Vermeidung von Datenverlusten ist zwar die Mindestanforderung an eine Datenbank, aber bei vielen Ein-Maschinen- und leichtgewichtigen Vektordatenbanken steht die Zuverlässigkeit der Daten nicht im Vordergrund. Im Gegensatz dazu legen speziell entwickelte verteilte Vektordatenbanken wie <a href="https://zilliz.com/what-is-milvus">Milvus</a> durch die Trennung von Speicherung und Berechnung den Schwerpunkt auf Systemstabilität, Skalierbarkeit und Datenpersistenz.</p>
<p>Darüber hinaus benötigen die meisten Vektordatenbanken, die ANN-Indizes (Approximate Nearest Neighbour) verwenden, viel Speicher für die Vektorsuche, da sie ANN-Indizes nur in den Speicher laden. Milvus unterstützt jedoch Festplattenindizes, wodurch die Speicherung mehr als zehnmal kostengünstiger ist als bei In-Memory-Indizes.</p>
<h3 id="Optimal-Query-Performance" class="common-anchor-header">Optimale Abfrageleistung</h3><p>Eine spezialisierte Vektordatenbank bietet eine optimale Abfrageleistung im Vergleich zu anderen Vektorsuchoptionen. So ist Milvus beispielsweise zehnmal schneller bei der Bearbeitung von Abfragen als Vektorsuch-Plugins. Milvus verwendet den <a href="https://zilliz.com/glossary/anns">ANN-Algorithmus</a> anstelle des brutalen KNN-Suchalgorithmus für eine schnellere Vektorsuche. Darüber hinaus werden die Indizes gesplittet, wodurch die Zeit für den Aufbau eines Indexes bei zunehmendem Datenvolumen reduziert wird. Dank dieses Ansatzes kann Milvus problemlos Milliarden von Vektoren verarbeiten, wobei Daten in Echtzeit hinzugefügt und gelöscht werden. Im Gegensatz dazu eignen sich andere Add-ons für die Vektorsuche nur für Szenarien mit weniger als zehn Millionen Daten und seltenen Hinzufügungen und Löschungen.</p>
<p>Milvus unterstützt auch GPU-Beschleunigung. Interne Tests zeigen, dass die GPU-beschleunigte Vektorindizierung bei der Suche nach zehn Millionen Daten mehr als 10.000 QPS erreichen kann, was mindestens zehnmal schneller ist als die herkömmliche CPU-Indizierung bei der Abfrageleistung auf einer Maschine.</p>
<h3 id="System-Reliability" class="common-anchor-header">System-Zuverlässigkeit</h3><p>Viele Anwendungen nutzen Vektordatenbanken für Online-Abfragen, die eine geringe Abfragelatenz und einen hohen Durchsatz erfordern. Diese Anwendungen erfordern ein Single-Machine-Failover auf Minutenebene, und einige erfordern sogar eine regionsübergreifende Disaster Recovery für kritische Szenarien. Herkömmliche Replikationsstrategien auf der Grundlage von Raft/Paxos sind sehr ressourcenintensiv und benötigen Hilfe bei der Vorverteilung der Daten, was zu einer geringen Zuverlässigkeit führt. Im Gegensatz dazu verfügt Milvus über eine verteilte Architektur, die K8s Message Queues für eine hohe Verfügbarkeit nutzt, wodurch die Wiederherstellungszeit verkürzt und Ressourcen gespart werden.</p>
<h3 id="Operability-and-Observability" class="common-anchor-header">Bedienbarkeit und Beobachtbarkeit</h3><p>Um Unternehmensanwender besser bedienen zu können, müssen Vektordatenbanken eine Reihe von Funktionen auf Unternehmensebene für eine bessere Bedienbarkeit und Beobachtbarkeit bieten. Milvus unterstützt mehrere Bereitstellungsmethoden, darunter K8s Operator und Helm chart, docker-compose und pip install, wodurch es für Benutzer mit unterschiedlichen Anforderungen zugänglich ist. Milvus bietet auch ein Überwachungs- und Alarmsystem, das auf Grafana, Prometheus und Loki basiert und die Beobachtbarkeit verbessert. Mit einer verteilten Cloud-nativen Architektur ist Milvus die branchenweit erste Vektordatenbank, die Multi-Tenant-Isolation, RBAC, Quotenbegrenzung und rollierende Upgrades unterstützt. All diese Ansätze machen die Verwaltung und Überwachung von Milvus wesentlich einfacher.</p>
<h2 id="Getting-started-with-Milvus-in-3-simple-steps-within-10-minutes" class="common-anchor-header">Die ersten Schritte mit Milvus in 3 einfachen Schritten innerhalb von 10 Minuten<button data-href="#Getting-started-with-Milvus-in-3-simple-steps-within-10-minutes" class="anchor-icon" translate="no">
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
    </button></h2><p>Der Aufbau einer Vektordatenbank ist eine komplexe Aufgabe, aber die Verwendung einer solchen ist so einfach wie die Verwendung von Numpy und FAISS. Selbst Studenten, die mit KI nicht vertraut sind, können eine Vektorsuche auf der Grundlage von Milvus in nur zehn Minuten implementieren. Um hoch skalierbare und leistungsstarke Vektorsuchdienste zu nutzen, folgen Sie diesen drei Schritten:</p>
<ul>
<li>Installieren Sie Milvus auf Ihrem Server mit Hilfe des <a href="https://milvus.io/docs/install_standalone-docker.md">Milvus Deployment Dokuments</a>.</li>
<li>Implementieren Sie die Vektorsuche mit nur 50 Zeilen Code, indem Sie das <a href="https://milvus.io/docs/example_code.md">Hello Milvus-Dokument</a> zu Rate ziehen.</li>
<li>Schauen Sie sich die <a href="https://github.com/towhee-io/examples/">Beispieldokumente von Towhee</a> an, um einen Einblick in beliebte <a href="https://zilliz.com/use-cases">Anwendungsfälle von Vektordatenbanken</a> zu erhalten.</li>
</ul>
