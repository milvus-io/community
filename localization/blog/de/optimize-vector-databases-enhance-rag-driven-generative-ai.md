---
id: optimize-vector-databases-enhance-rag-driven-generative-ai.md
title: >-
  Optimierung von Vektordatenbanken, Verbesserung der RAG-gesteuerten
  generativen KI
author: 'Cathy Zhang, Dr. Malini Bhandaru'
date: 2024-05-13T00:00:00.000Z
desc: >-
  In diesem Artikel erfahren Sie mehr über Vektordatenbanken und ihre
  Benchmarking-Frameworks, Datensätze für verschiedene Aspekte und die für die
  Leistungsanalyse verwendeten Tools - alles, was Sie brauchen, um mit der
  Optimierung von Vektordatenbanken zu beginnen.
cover: >-
  assets.zilliz.com/Optimize_Vector_Databases_Enhance_RAG_Driven_Generative_AI_6e3b370f25.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, RAG, Generative AI
recommend: true
canonicalUrl: >-
  https://medium.com/intel-tech/optimize-vector-databases-enhance-rag-driven-generative-ai-90c10416cb9c
---
<p><em>Dieser Beitrag wurde ursprünglich auf dem <a href="https://medium.com/intel-tech/optimize-vector-databases-enhance-rag-driven-generative-ai-90c10416cb9c">Medium-Kanal von Intel</a> veröffentlicht und wird hier mit Genehmigung wiederveröffentlicht.</em></p>
<p><br></p>
<p>Zwei Methoden zur Optimierung Ihrer Vektordatenbank bei Verwendung von RAG</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*FRWBVwOHPYFDIVTp_ylZNQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Foto von <a href="https://unsplash.com/@ilyapavlov?utm_content=creditCopyText&amp;utm_medium=referral&amp;utm_source=unsplash">Ilya Pavlov</a> auf <a href="https://unsplash.com/photos/monitor-showing-java-programming-OqtafYT5kTw?utm_content=creditCopyText&amp;utm_medium=referral&amp;utm_source=unsplash">Unsplash</a></p>
<p>Von Cathy Zhang und Dr. Malini Bhandaru Mitwirkende: Lin Yang und Changyan Liu</p>
<p>Generative KI-Modelle (GenAI), die sich in unserem täglichen Leben exponentiell verbreiten, werden durch <a href="https://www.techtarget.com/searchenterpriseai/definition/retrieval-augmented-generation">Retrieval-Augmented Generation (RAG)</a> verbessert, eine Technik, die zur Verbesserung der Antwortgenauigkeit und -zuverlässigkeit verwendet wird, indem Fakten aus externen Quellen abgerufen werden. RAG hilft einem regulären <a href="https://www.techtarget.com/whatis/definition/large-language-model-LLM">großen Sprachmodell (LLM)</a>, Kontext zu verstehen und <a href="https://en.wikipedia.org/wiki/Hallucination_(artificial_intelligence)">Halluzinationen</a> zu reduzieren, indem es eine riesige Datenbank mit unstrukturierten Daten nutzt, die als Vektoren gespeichert sind - eine mathematische Darstellung, die hilft, Kontext und Beziehungen zwischen Daten zu erfassen.</p>
<p>RAG hilft dabei, mehr kontextbezogene Informationen abzurufen und somit bessere Antworten zu generieren, aber die Vektordatenbanken, auf die sie sich stützen, werden immer größer, um reichhaltige Inhalte zu liefern, auf die sie zurückgreifen können. So wie LLMs mit Billionen von Parametern am Horizont auftauchen, sind Vektordatenbanken mit Milliarden von Vektoren nicht mehr weit entfernt. Als Optimierungsingenieure waren wir neugierig, ob wir Vektordatenbanken leistungsfähiger machen, Daten schneller laden und Indizes schneller erstellen könnten, um die Abrufgeschwindigkeit zu gewährleisten, auch wenn neue Daten hinzugefügt werden. Dies würde nicht nur die Wartezeit der Benutzer verkürzen, sondern auch die Nachhaltigkeit von RAG-basierten KI-Lösungen erhöhen.</p>
<p>In diesem Artikel erfahren Sie mehr über Vektordatenbanken und ihre Benchmarking-Frameworks, Datensätze zur Untersuchung verschiedener Aspekte und die für die Leistungsanalyse verwendeten Tools - alles, was Sie für die Optimierung von Vektordatenbanken benötigen. Wir werden auch unsere Optimierungserfolge bei zwei beliebten Vektordatenbanklösungen vorstellen, um Sie auf Ihrer Optimierungsreise zu Leistung und Nachhaltigkeit zu inspirieren.</p>
<h2 id="Understanding-Vector-Databases" class="common-anchor-header">Verständnis von Vektordatenbanken<button data-href="#Understanding-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Im Gegensatz zu herkömmlichen relationalen oder nicht-relationalen Datenbanken, in denen Daten strukturiert gespeichert werden, enthält eine Vektordatenbank eine mathematische Darstellung einzelner Datenelemente, einen so genannten Vektor, der mithilfe einer Einbettungs- oder Transformationsfunktion erstellt wird. Der Vektor stellt in der Regel Merkmale oder semantische Bedeutungen dar und kann kurz oder lang sein. In Vektordatenbanken erfolgt die Suche nach Vektoren durch eine Ähnlichkeitssuche unter Verwendung einer Abstandsmetrik (wobei näher bedeutet, dass die Ergebnisse ähnlicher sind), z. B. <a href="https://www.pinecone.io/learn/vector-similarity/">euklidische Ähnlichkeit, Punktprodukt oder Kosinus</a>.</p>
<p>Um den Suchprozess zu beschleunigen, werden die Vektordaten mit Hilfe eines Indexierungsmechanismus organisiert. Beispiele für diese Organisationsmethoden sind u. a. flache Strukturen, <a href="https://arxiv.org/abs/2002.09094">invertierte Dateien (IVF),</a> <a href="https://arxiv.org/abs/1603.09320">hierarchische navigierbare kleine Welten (HNSW)</a> und <a href="https://en.wikipedia.org/wiki/Locality-sensitive_hashing">ortsabhängiges Hashing (LSH)</a>. Jede dieser Methoden trägt dazu bei, ähnliche Vektoren bei Bedarf effizient und effektiv abzurufen.</p>
<p>Untersuchen wir nun, wie eine Vektordatenbank in einem GenAI-System verwendet werden kann. Abbildung 1 veranschaulicht sowohl das Laden von Daten in eine Vektordatenbank als auch deren Verwendung im Rahmen einer GenAI-Anwendung. Wenn Sie Ihren Prompt eingeben, durchläuft er einen Transformationsprozess, der identisch mit dem ist, der zur Erzeugung von Vektoren in der Datenbank verwendet wird. Dieser transformierte Vektorprompt wird dann verwendet, um ähnliche Vektoren aus der Vektordatenbank abzurufen. Diese abgerufenen Elemente dienen im Wesentlichen als Gesprächsgedächtnis und liefern eine kontextbezogene Historie für Prompts, ähnlich wie LLMs funktionieren. Diese Funktion erweist sich als besonders vorteilhaft bei der Verarbeitung natürlicher Sprache, beim Computer-Vision, bei Empfehlungssystemen und in anderen Bereichen, die semantisches Verständnis und Datenabgleich erfordern. Ihre ursprüngliche Eingabeaufforderung wird anschließend mit den abgerufenen Elementen "verschmolzen", wodurch der Kontext geliefert wird und der LLM bei der Formulierung von Antworten auf der Grundlage des bereitgestellten Kontexts unterstützt wird, anstatt sich ausschließlich auf seine ursprünglichen Trainingsdaten zu verlassen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*zQj_YJdWc2xKB6Vv89lzDQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Abbildung 1. Eine RAG-Anwendungsarchitektur.</p>
<p>Vektoren werden gespeichert und für einen schnellen Abruf indiziert. Es gibt zwei Arten von Vektordatenbanken: traditionelle Datenbanken, die für die Speicherung von Vektoren erweitert wurden, und speziell entwickelte Vektordatenbanken. Einige Beispiele für herkömmliche Datenbanken, die Vektoren unterstützen, sind <a href="https://redis.io/">Redis</a>, <a href="https://github.com/pgvector/pgvector">pgvector</a>, <a href="https://www.elastic.co/elasticsearch">Elasticsearch</a> und <a href="https://opensearch.org/">OpenSearch</a>. Beispiele für speziell entwickelte Vektordatenbanken sind die proprietären Lösungen <a href="https://zilliz.com/">Zilliz</a> und <a href="https://www.pinecone.io/">Pinecone</a> sowie die Open-Source-Projekte <a href="https://milvus.io/">Milvus</a>, <a href="https://weaviate.io/">Weaviate</a>, <a href="https://qdrant.tech/">Qdrant</a>, <a href="https://github.com/facebookresearch/faiss">Faiss</a> und <a href="https://www.trychroma.com/">Chroma</a>. Sie können mehr über Vektordatenbanken auf GitHub über <a href="https://github.com/langchain-ai/langchain/tree/master/libs/langchain/langchain/vectorstores">LangChain </a>und <a href="https://github.com/openai/openai-cookbook/tree/main/examples/vector_databases">OpenAI Cookbook</a> erfahren.</p>
<p>Wir werden uns eine aus jeder Kategorie, Milvus und Redis, genauer ansehen.</p>
<h2 id="Improving-Performance" class="common-anchor-header">Verbesserung der Leistung<button data-href="#Improving-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>Bevor wir uns mit den Optimierungen befassen, wollen wir uns ansehen, wie Vektordatenbanken bewertet werden, einige Bewertungs-Frameworks und verfügbare Tools zur Leistungsanalyse.</p>
<h3 id="Performance-Metrics" class="common-anchor-header">Leistungsmetriken</h3><p>Schauen wir uns die wichtigsten Metriken an, mit denen Sie die Leistung von Vektordatenbanken messen können.</p>
<ul>
<li>Die<strong>Ladelatenz</strong> misst die Zeit, die benötigt wird, um Daten in den Speicher der Vektordatenbank zu laden und einen Index aufzubauen. Ein Index ist eine Datenstruktur, mit der Vektordaten auf der Grundlage ihrer Ähnlichkeit oder Entfernung effizient organisiert und abgerufen werden können. Zu den Arten von <a href="https://milvus.io/docs/index.md#In-memory-Index">speicherinternen Indizes</a> gehören <a href="https://thedataquarry.com/posts/vector-db-3/#flat-indexes">Flat Index</a>, <a href="https://supabase.com/docs/guides/ai/vector-indexes/ivf-indexes">IVF_FLAT</a>, <a href="https://towardsdatascience.com/ivfpq-hnsw-for-billion-scale-similarity-search-89ff2f89d90e">IVF_PQ, HNSW</a>, <a href="https://github.com/google-research/google-research/tree/master/scann">Scalable Nearest Neighbors (ScaNN)</a>und <a href="https://milvus.io/docs/disk_index.md">DiskANN</a>.</li>
<li><strong>Recall</strong> ist der Anteil der wahren Übereinstimmungen oder relevanten Elemente, die in den <a href="https://redis.io/docs/data-types/probabilistic/top-k/">Top-K-Ergebnissen</a> gefunden werden, die der Suchalgorithmus abruft. Höhere Recall-Werte deuten auf eine bessere Suche nach relevanten Elementen hin.</li>
<li><strong>Abfragen pro Sekunde (QPS)</strong> ist die Rate, mit der die Vektordatenbank eingehende Abfragen verarbeiten kann. Höhere QPS-Werte bedeuten eine bessere Abfrageverarbeitungsfähigkeit und einen höheren Systemdurchsatz.</li>
</ul>
<h3 id="Benchmarking-Frameworks" class="common-anchor-header">Benchmarking-Rahmenwerke</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:920/1*mssEjZAuXg6nf-pad67rHA.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Abbildung 2. Der Rahmen für das Benchmarking von Vektordatenbanken.</p>
<p>Für das Benchmarking einer Vektordatenbank sind ein Vektordatenbankserver und Clients erforderlich. Für unsere Leistungstests haben wir zwei beliebte Open-Source-Tools verwendet.</p>
<ul>
<li><a href="https://github.com/zilliztech/VectorDBBench/tree/main"><strong>VectorDBBench</strong></a><strong>:</strong> VectorDBBench wurde von Zilliz entwickelt und ist als Open Source verfügbar. Es hilft beim Testen verschiedener Vektordatenbanken mit unterschiedlichen Indextypen und bietet eine komfortable Webschnittstelle.</li>
<li><a href="https://github.com/qdrant/vector-db-benchmark/tree/master"><strong>vector-db-benchmark</strong></a><strong>:</strong> vector-db-benchmark wurde von Qdrant entwickelt und ist als Open Source verfügbar. Es hilft beim Testen verschiedener typischer Vektordatenbanken für den <a href="https://www.datastax.com/guides/hierarchical-navigable-small-worlds">HNSW-Indextyp</a>. Es führt die Tests über die Befehlszeile aus und bietet eine <a href="https://docs.docker.com/compose/">Docker Compose</a> __Datei, um das Starten von Serverkomponenten zu vereinfachen.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*NpHHEFV0TxRMse83hK6H1A.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Abbildung 3. Ein Beispiel für einen vector-db-benchmark-Befehl, der zur Ausführung des Benchmark-Tests verwendet wird.</p>
<p>Der Benchmark-Rahmen ist jedoch nur ein Teil der Gleichung. Wir benötigen Daten, mit denen verschiedene Aspekte der Vektordatenbanklösung selbst getestet werden können, z. B. ihre Fähigkeit, große Datenmengen zu verarbeiten, verschiedene Vektorgrößen und die Geschwindigkeit des Abrufs.1 Sehen wir uns daher einige verfügbare öffentliche Datensätze an.</p>
<h3 id="Open-Datasets-to-Exercise-Vector-Databases" class="common-anchor-header">Offene Datensätze zum Testen von Vektordatenbanken</h3><p>Große Datensätze eignen sich gut, um die Latenzzeit und die Ressourcenzuweisung zu testen. Einige Datensätze haben hochdimensionale Daten und eignen sich gut, um die Geschwindigkeit der Ähnlichkeitsberechnung zu testen.</p>
<p>Die Datensätze reichen von einer Dimension von 25 bis zu einer Dimension von 2048. Der <a href="https://laion.ai/">LAION-Datensatz</a>, eine offene Bildsammlung, wurde für das Training sehr großer visueller und sprachlicher tief-neuronaler Modelle wie stabile generative Diffusionsmodelle verwendet. Der OpenAI-Datensatz mit 5 Mio. Vektoren, jeder mit einer Dimension von 1536, wurde von VectorDBBench erstellt, indem OpenAI auf <a href="https://huggingface.co/datasets/allenai/c4">Rohdaten</a> ausgeführt wurde. Da jedes Vektorelement vom Typ FLOAT ist, werden allein für die Speicherung der Vektoren ca. 29 GB (5M * 1536 * 4) Speicherplatz benötigt, plus eine ähnliche Menge zusätzlicher Speicher für Indizes und andere Metadaten, was insgesamt 58 GB Speicherplatz für die Tests ergibt. Wenn Sie das Tool vector-db-benchmark verwenden, sorgen Sie für ausreichenden Plattenspeicher zum Speichern der Ergebnisse.</p>
<p>Um die Latenzzeit zu testen, benötigten wir eine große Sammlung von Vektoren, die <a href="https://docs.hippo.transwarp.io/docs/performance-dataset">deep-image-96-angular</a> bietet. Um die Leistung der Indexerstellung und der Ähnlichkeitsberechnung zu testen, bieten hochdimensionale Vektoren mehr Stress. Zu diesem Zweck wählten wir den 500K-Datensatz mit Vektoren der Dimension 1536.</p>
<h3 id="Performance-Tools" class="common-anchor-header">Leistungstools</h3><p>Wir haben uns damit beschäftigt, wie das System belastet werden kann, um interessante Metriken zu ermitteln, aber lassen Sie uns nun untersuchen, was auf einer niedrigeren Ebene passiert: Wie stark ist die Recheneinheit ausgelastet, wie hoch ist der Speicherverbrauch, wie lange wird auf Sperren gewartet und vieles mehr? Diese Informationen geben Aufschluss über das Datenbankverhalten und sind besonders nützlich, um Problembereiche zu identifizieren.</p>
<p>Das Linux-Dienstprogramm <a href="https://www.redhat.com/sysadmin/interpret-top-output">top</a> liefert Informationen zur Systemleistung. Das <a href="https://perf.wiki.kernel.org/index.php/Main_Page">Perf-Tool</a> in Linux bietet jedoch eine Reihe von tieferen Einblicken. Um mehr darüber zu erfahren, empfehlen wir die Lektüre von <a href="https://www.brendangregg.com/perf.html">Linux-Perf-Beispielen</a> und der <a href="https://www.intel.com/content/www/us/en/docs/vtune-profiler/cookbook/2023-0/top-down-microarchitecture-analysis-method.html">Intel Top-Down-Mikroarchitektur-Analysemethode</a>. Ein weiteres Tool ist der <a href="https://www.intel.com/content/www/us/en/developer/tools/oneapi/vtune-profiler.html">Intel® vTune™ Profiler</a>, der nicht nur bei der Optimierung von Anwendungen, sondern auch bei der Optimierung der Systemleistung und -konfiguration für eine Vielzahl von Workloads in den Bereichen HPC, Cloud, IoT, Medien, Speicher und mehr nützlich ist.</p>
<h2 id="Milvus-Vector-Database-Optimizations" class="common-anchor-header">Milvus Vector Datenbank-Optimierungen<button data-href="#Milvus-Vector-Database-Optimizations" class="anchor-icon" translate="no">
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
    </button></h2><p>Gehen wir einige Beispiele durch, wie wir versucht haben, die Leistung der Milvus-Vektordatenbank zu verbessern.</p>
<h3 id="Reducing-Memory-Movement-Overhead-in-Datanode-Buffer-Write" class="common-anchor-header">Verringerung des Overheads für Speicherbewegungen beim Schreiben in den Datenknotenpuffer</h3><p>Die Schreibpfad-Proxys von Milvus schreiben Daten über <em>MsgStream</em> in einen Log-Broker. Die Datenknoten verbrauchen dann die Daten, konvertieren und speichern sie in Segmente. Die Segmente fügen die neu eingefügten Daten zusammen. Die Zusammenführungslogik weist einen neuen Puffer zu, um sowohl die alten als auch die neu einzufügenden Daten aufzunehmen/zu verschieben, und gibt dann den neuen Puffer als alte Daten für die nächste Datenzusammenführung zurück. Dies führt dazu, dass die alten Daten sukzessive größer werden, was wiederum die Datenbewegung langsamer macht. Die Leistungsprofile zeigten einen hohen Overhead für diese Logik.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*Az4dMVBcGmdeyKNrwpR19g.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Abbildung 4. Das Zusammenführen und Verschieben von Daten in der Vektordatenbank verursacht einen hohen Leistungsaufwand.</p>
<p>Wir änderten die Logik des <em>Zusammenführungspuffers</em> so, dass die neuen Daten direkt an die alten Daten angehängt werden, wodurch die Zuweisung eines neuen Puffers und das Verschieben der großen alten Daten vermieden wird. Perf-Profile bestätigen, dass diese Logik keinen Overhead verursacht. Die Microcode-Metriken <em>metric_CPU operating frequency</em> und <em>metric_CPU utilization</em> zeigen eine Verbesserung an, die darauf zurückzuführen ist, dass das System nicht mehr auf die langen Speicherbewegungen warten muss. Die Ladelatenz verbesserte sich um mehr als 60 Prozent. Die Verbesserung ist auf <a href="https://github.com/milvus-io/milvus/pull/26839">GitHub</a> festgehalten.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://miro.medium.com/v2/resize:fit:1400/1*MmaUtBTdqmMvC5MlQ8V0wQ.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Abbildung 5. Mit weniger Kopiervorgängen sehen wir eine Leistungsverbesserung von mehr als 50 Prozent bei der Ladelatenz.</p>
<h3 id="Inverted-Index-Building-with-Reduced-Memory-Allocation-Overhead" class="common-anchor-header">Invertierter Indexaufbau mit reduziertem Speicherzuweisungs-Overhead</h3><p>Die Milvus-Suchmaschine <a href="https://milvus.io/docs/knowhere.md">Knowhere</a> verwendet den <a href="https://www.vlfeat.org/api/kmeans-fundamentals.html#kmeans-elkan">Elkan k-means-Algorithmus</a> zum Trainieren von Clusterdaten für die Erstellung von <a href="https://milvus.io/docs/v1.1.1/index.md">invertierten Dateiindizes (IVF)</a>. Jede Runde des Datentrainings definiert eine Iterationszahl. Je größer die Anzahl ist, desto besser sind die Trainingsergebnisse. Dies bedeutet jedoch auch, dass der Elkan-Algorithmus häufiger aufgerufen wird.</p>
<p>Der Elkan-Algorithmus führt bei jeder Ausführung Speicherzuweisungen und -freigaben durch. Insbesondere weist er Speicher zu, um die Hälfte der Größe der symmetrischen Matrixdaten zu speichern, wobei die Diagonalelemente ausgeschlossen werden. In Knowhere ist die vom Elkan-Algorithmus verwendete Dimension der symmetrischen Matrix auf 1024 festgelegt, was zu einer Speichergröße von etwa 2 MB führt. Das bedeutet, dass Elkan für jede Trainingsrunde wiederholt 2 MB Speicher zuweist und freigibt.</p>
<p>Die Perf-Profiling-Daten zeigten, dass häufig große Speicherzuweisungen vorgenommen wurden. Sie lösten die Zuweisung eines <a href="https://www.oreilly.com/library/view/linux-device-drivers/9781785280009/4759692f-43fb-4066-86b2-76a90f0707a2.xhtml">virtuellen Speicherbereichs (VMA)</a>, die Zuweisung einer physischen Seite, die Einrichtung einer Seitenübersicht und die Aktualisierung der Speicher-C-Gruppen-Statistik im Kernel aus. Dieses Muster großer Speicherzuweisungs- und -freigabeaktivitäten kann in manchen Situationen auch die Speicherfragmentierung verschlimmern. Dies ist eine erhebliche Steuer.</p>
<p>Die <em>IndexFlatElkan-Struktur</em> wurde speziell für die Unterstützung des Elkan-Algorithmus entwickelt und aufgebaut. Bei jedem Datentrainingsprozess wird eine <em>IndexFlatElkan-Instanz</em> initialisiert. Um die Auswirkungen der häufigen Speicherzuweisung und -freigabe im Elkan-Algorithmus auf die Leistung zu verringern, haben wir die Codelogik überarbeitet und die Speicherverwaltung außerhalb der Elkan-Algorithmusfunktion in den Konstruktionsprozess von <em>IndexFlatElkan</em> verlagert. Dadurch kann die Speicherzuweisung nur einmal während der Initialisierungsphase erfolgen, während alle nachfolgenden Funktionsaufrufe des Elkan-Algorithmus aus dem aktuellen Datentrainingsprozess heraus bedient werden, was zu einer Verbesserung der Ladelatenz um etwa 3 Prozent führt. Den <a href="https://github.com/zilliztech/knowhere/pull/280">Knowhere-Patch</a> finden Sie <a href="https://github.com/zilliztech/knowhere/pull/280">hier</a>.</p>
<h2 id="Redis-Vector-Search-Acceleration-through-Software-Prefetch" class="common-anchor-header">Beschleunigung der Vektorsuche in Redis durch Software Prefetch<button data-href="#Redis-Vector-Search-Acceleration-through-Software-Prefetch" class="anchor-icon" translate="no">
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
    </button></h2><p>Redis, ein beliebter traditioneller In-Memory-Schlüsselwert-Datenspeicher, unterstützt seit kurzem die Vektorsuche. Um über einen typischen Key-Value-Speicher hinauszugehen, bietet er Erweiterungsmodule; das <a href="https://github.com/RediSearch/RediSearch">RediSearch-Modul</a> ermöglicht die Speicherung und Suche von Vektoren direkt in Redis.</p>
<p>Für die Vektorähnlichkeitssuche unterstützt Redis zwei Algorithmen, nämlich Brute-Force und HNSW. Der HNSW-Algorithmus wurde speziell für die effiziente Suche nach ungefähren nächsten Nachbarn in hochdimensionalen Räumen entwickelt. Er verwendet eine Prioritätswarteschlange namens <em>candidate_set</em>, um alle Vektorkandidaten für die Abstandsberechnung zu verwalten.</p>
<p>Jeder Vektorkandidat enthält zusätzlich zu den Vektordaten umfangreiche Metadaten. Wenn ein Kandidat aus dem Speicher geladen wird, kann dies zu Fehlern im Datencache führen, was Verzögerungen bei der Verarbeitung zur Folge hat. Unsere Optimierung führt ein Software-Prefetching ein, um proaktiv den nächsten Kandidaten zu laden, während der aktuelle verarbeitet wird. Diese Verbesserung hat zu einer Durchsatzsteigerung von 2 bis 3 Prozent bei der Suche nach Vektorähnlichkeit in einer Redis-Einzelinstanz geführt. Der Patch wird derzeit in den Upstream eingespielt.</p>
<h2 id="GCC-Default-Behavior-Change-to-Prevent-Mixed-Assembly-Code-Penalties" class="common-anchor-header">GCC-Standardverhaltensänderung zur Vermeidung von Strafen für gemischten Assemblercode<button data-href="#GCC-Default-Behavior-Change-to-Prevent-Mixed-Assembly-Code-Penalties" class="anchor-icon" translate="no">
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
    </button></h2><p>Um eine maximale Leistung zu erzielen, werden häufig verwendete Codeabschnitte oft von Hand in Assembler geschrieben. Wenn jedoch verschiedene Codesegmente entweder von verschiedenen Personen oder zu verschiedenen Zeitpunkten geschrieben werden, können die verwendeten Anweisungen aus inkompatiblen Assembler-Befehlssätzen wie <a href="https://www.intel.com/content/www/us/en/architecture-and-technology/avx-512-overview.html">Intel® Advanced Vector Extensions 512 (Intel® AVX-512)</a> und <a href="https://en.wikipedia.org/wiki/Streaming_SIMD_Extensions">Streaming SIMD Extensions (SSE)</a> stammen. Wenn der gemischte Code nicht entsprechend kompiliert wird, führt dies zu einer Leistungseinbuße. <a href="https://www.intel.com/content/dam/develop/external/us/en/documents/11mc12-avoiding-2bavx-sse-2btransition-2bpenalties-2brh-2bfinal-809104.pdf">Weitere Informationen zum Mischen von Intel AVX- und SSE-Anweisungen finden Sie hier</a>.</p>
<p>Sie können leicht feststellen, ob Sie Mixed-Mode-Assemblercode verwenden und den Code nicht mit <em>VZEROUPPER</em> kompiliert haben, was zu Leistungseinbußen führt. Sie können dies mit einem Perf-Befehl wie <em>sudo perf stat -e 'assists.sse_avx_mix/event/event=0xc1,umask=0x10/' &lt;workload&gt;</em> feststellen <em>.</em> Wenn Ihr Betriebssystem keine Unterstützung für das Ereignis bietet, verwenden Sie <em>cpu/event=0xc1,umask=0x10,name=assists_sse_avx_mix/</em>.</p>
<p>Der Clang-Compiler fügt standardmäßig <em>VZEROUPPER</em> ein und vermeidet so jegliche Mixed-Mode-Strafe. Der GCC-Compiler fügt <em>VZEROUPPER</em> jedoch nur ein, wenn die Compilerflags -O2 oder -O3 angegeben wurden. Wir haben uns mit dem GCC-Team in Verbindung gesetzt und das Problem erläutert, und nun wird Assembler-Code im gemischten Modus standardmäßig korrekt behandelt.</p>
<h2 id="Start-Optimizing-Your-Vector-Databases" class="common-anchor-header">Optimieren Sie Ihre Vektordatenbanken<button data-href="#Start-Optimizing-Your-Vector-Databases" class="anchor-icon" translate="no">
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
    </button></h2><p>Vektordatenbanken spielen eine wesentliche Rolle in GenAI, und sie werden immer größer, um qualitativ hochwertigere Antworten zu erzeugen. Im Hinblick auf die Optimierung unterscheiden sich KI-Anwendungen nicht von anderen Softwareanwendungen, da sie ihre Geheimnisse preisgeben, wenn man Standardwerkzeuge zur Leistungsanalyse zusammen mit Benchmark-Frameworks und Stress-Input einsetzt.</p>
<p>Mit diesen Tools haben wir Leistungsfallen aufgedeckt, die mit unnötiger Speicherzuweisung, fehlenden Prefetch-Anweisungen und der Verwendung falscher Compiler-Optionen zusammenhängen. Auf der Grundlage unserer Erkenntnisse haben wir Verbesserungen an Milvus, Knowhere, Redis und dem GCC-Compiler vorgenommen, um KI ein wenig leistungsfähiger und nachhaltiger zu machen. Vektordatenbanken sind eine wichtige Anwendungsklasse, die es wert ist, dass Sie sich um ihre Optimierung bemühen. Wir hoffen, dass dieser Artikel Ihnen bei den ersten Schritten hilft.</p>
