---
id: >-
  announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md
title: >-
  Ankündigung von Milvus 3.0: Lake-native Vektorsuche und eine leistungsstärkere
  Retrieval-Engine
author: Fendy Feng and Li Liu
date: 2026-7-27
cover: assets.zilliz.com/cover_of_milvus_3_0_6fab4ba929.jpg
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus 3.0, lake-native vector search, vector database, External Collections,
  AI retrieval engine
meta_title: |
  Milvus 3.0: Lake-Native Vector Search & Retrieval Engine
desc: >-
  Entdecken Sie die lake-native Vektorsuche von Milvus 3.0,
  Zero-Copy-External-Collections, schnelleren Sparse-Retrieval, Snapshots,
  Spark-Integration und erweiterte Ranking-Funktionen.
origin: >-
  https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md
---
<p>Heute veröffentlichen wir Milvus 3.0, einen wichtigen architektonischen Meilenstein für das Projekt. Es verändert sowohl, wo Milvus Indizes erstellen und bereitstellen kann, als auch, wie viel Retrieval-Arbeit direkt innerhalb der Engine erledigt werden kann.</p>
<ul>
<li>Milvus 3.0 führt <strong>einen lake-nativen Pfad</strong> für die Indizierung von Vektordaten ein, die in Objektspeichern und offenen Tabellenformaten liegen, darunter Parquet, Lance, Iceberg und Vortex. Teams können im Lake gespeicherte Daten durchsuchbar machen, ohne eine weitere Kopie in einer Vektordatenbank zu pflegen.</li>
<li><strong>Diese Version erweitert Milvus außerdem über das initiale Abrufen von Kandidaten hinaus.</strong> Serverseitiges Sortieren, Aggregation, facettierte Suche, StructArray für verschachtelte Dokument-/Chunk-Strukturen und ColBERT-Vektoren sowie ein neu gestalteter Sparse-Index verlagern mehr Ranking, Gruppierung und Ergebnisverarbeitung aus dem Anwendungscode in die Retrieval-Engine.</li>
</ul>
<p>Zusammen machen diese Fortschritte Milvus zur Open-Source-Grundlage für produktionsreifes KI-Retrieval und für <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Vector-Lakebase</a>-Architekturen, die lake-nativen Speicher mit leistungsstarkem Vektor-Retrieval kombinieren.</p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/SAm4YfrO1ok?si=xzgw5RjRTwaHWYxO" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="A-quick-glance-at-the-Milvus-30-feature-set" class="common-anchor-header">Ein kurzer Überblick über den Funktionsumfang von Milvus 3.0<button data-href="#A-quick-glance-at-the-Milvus-30-feature-set" class="anchor-icon" translate="no">
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
<tr><th><strong>Bereich</strong></th><th><strong>Funktionen</strong></th><th><strong>Warum es wichtig ist</strong></th></tr>
</thead>
<tbody>
<tr><td>Lake-natives Retrieval</td><td>External Collections über Parquet, Lance, Iceberg und Vortex</td><td>Durchsuchen von im Lake gespeicherten Daten, ohne eine zweite Serving-Kopie zu pflegen</td></tr>
<tr><td>S3-basierter Speicher</td><td>Loon (Storage v3)</td><td>Reduzierung der Point-Read-Amplification für Serving-artige Zugriffe und Unterstützung von Schema-Evolution</td></tr>
<tr><td>Offline-/Batch-Workflows und Wiederherstellung</td><td>Snapshots, Spark DataSource V2 und Online-Schema-Evolution</td><td>Stabile Collection-Ansichten in Evaluierung, Deduplizierung, Clustering und Feature-Pipelines bringen</td></tr>
<tr><td>Retrieval-Engine</td><td>ORDER BY, Aggregation, Facets, StructArray und verbessertes Sparse Retrieval</td><td>Mehr Ergebnisverarbeitung und Multi-Vektor-Scoring in Milvus verlagern</td></tr>
<tr><td>Datenmodell &amp; Betrieb</td><td>Nullable Vectors, TEXT LOB, TTL, MinHash, Woodpecker und ForceMerge</td><td>Umfangreichere Datenmodelle und produktionsreife Betriebsmuster unterstützen</td></tr>
</tbody>
</table>
<h2 id="The-lake-native-infrastructure-index-and-serve-data-where-it-already-lives" class="common-anchor-header">Die lake-native Infrastruktur: Daten dort indizieren und bereitstellen, wo sie bereits liegen<button data-href="#The-lake-native-infrastructure-index-and-serve-data-where-it-already-lives" class="anchor-icon" translate="no">
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
    </button></h2><p>Die größte architektonische Änderung in Milvus 3.0 betrifft den Ort, an dem das System Indizes erstellen und bereitstellen kann. Vektordaten können in offenen Formaten im Objektspeicher verbleiben, während Milvus produktionsreife Indizierung, Retrieval und APIs bereitstellt.</p>
<h3 id="1-External-Collections-indexing-directly-on-lake-resident-data" class="common-anchor-header">1. External Collections: direktes Indizieren von im Lake gespeicherten Daten</h3><p>Viele Teams speichern Embeddings bereits in einem Data Lake — Lance-Tabellen, Iceberg-Tabellen, Parquet-Dateien oder anderen Datensätzen in offenen Formaten auf S3, GCS oder Azure Blob Storage. Vor Milvus 3.0 gab es in der Regel zwei Optionen, um diese Daten zu durchsuchen.</p>
<ul>
<li>Die Embeddings in eine Vektordatenbank kopieren. Das bietet Suche mit niedriger Latenz, erzeugt aber eine zweite Kopie und eine ETL-Pipeline, die synchron bleiben muss.</li>
<li>Den Lake direkt abfragen. Das vermeidet Duplikation, aber ohne ANN-Indizes wird die Vektorsuche zu einem Brute-Force-Scan, der Produktionslatenzen nicht erfüllen kann.</li>
</ul>
<p><strong>External Collections führen einen dritten Weg ein.</strong> Sie definieren eine Milvus-Collection über Daten, die im Objektspeicher verbleiben, ordnen externe Felder einem Milvus-Schema zu und nutzen dieselben Such- und Abfrage-APIs wie bei einer nativen Collection. Die Quelldateien werden nicht verschoben; Milvus erstellt und stellt Vektor-, BM25-Inverted-, JSON- und skalare Indizes über den externen Daten bereit.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_1_c1fb7ab16e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>External Collections sind read-only und zero-copy</strong>, was sie nützlich macht, wenn Governance, Eigentumsgrenzen oder Betriebskosten erfordern, dass der Quelldatensatz im Lake verbleibt.</p>
<p>Wenn sich der externe Datensatz ändert, liest Milvus sein Speicher-Manifest und indiziert neu hinzugefügte Fragmente, anstatt die gesamte Collection neu aufzubauen.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> time

<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> DataType, MilvusClient

client = MilvusClient(uri=<span class="hljs-string">&quot;&quot;</span>)

<span class="hljs-comment"># Register an Iceberg table as a zero-copy collection.</span>
schema = client.create_schema(
    external_source=<span class="hljs-string">&quot;s3://lake/docs/metadata/v1.metadata.json&quot;</span>,
    external_spec=json.dumps(
        {
            <span class="hljs-string">&quot;format&quot;</span>: <span class="hljs-string">&quot;iceberg-table&quot;</span>,
            <span class="hljs-string">&quot;snapshot_id&quot;</span>: <span class="hljs-number">123456789</span>,
            <span class="hljs-string">&quot;extfs&quot;</span>: {
                <span class="hljs-string">&quot;cloud_provider&quot;</span>: <span class="hljs-string">&quot;aws&quot;</span>,
                <span class="hljs-string">&quot;region&quot;</span>: <span class="hljs-string">&quot;us-east-1&quot;</span>,
                <span class="hljs-string">&quot;access_key_id&quot;</span>: os.environ[<span class="hljs-string">&quot;AWS_ACCESS_KEY_ID&quot;</span>],
                <span class="hljs-string">&quot;access_key_value&quot;</span>: os.environ[<span class="hljs-string">&quot;AWS_SECRET_ACCESS_KEY&quot;</span>],
            },
        }
    ),
)

schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, external_field=<span class="hljs-string">&quot;doc_id&quot;</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;emb&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1024</span>, external_field=<span class="hljs-string">&quot;embedding&quot;</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;title&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">1024</span>, external_field=<span class="hljs-string">&quot;title&quot;</span>)

client.create_collection(collection_name=<span class="hljs-string">&quot;docs&quot;</span>, schema=schema)

<span class="hljs-comment"># Import the external table snapshot.</span>
job_id = client.refresh_external_collection(collection_name=<span class="hljs-string">&quot;docs&quot;</span>)
<span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
    progress = client.get_refresh_external_collection_progress(job_id=job_id)
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshCompleted&quot;</span>:
        <span class="hljs-keyword">break</span>
    <span class="hljs-keyword">if</span> progress.state == <span class="hljs-string">&quot;RefreshFailed&quot;</span>:
        <span class="hljs-keyword">raise</span> RuntimeError(progress.reason)
    time.sleep(<span class="hljs-number">1</span>)

index_params = client.prepare_index_params()
index_params.add_index(field_name=<span class="hljs-string">&quot;emb&quot;</span>, index_type=<span class="hljs-string">&quot;HNSW&quot;</span>, metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>)
client.create_index(collection_name=<span class="hljs-string">&quot;docs&quot;</span>, index_params=index_params)

client.load_collection(collection_name=<span class="hljs-string">&quot;docs&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>In regulierten Umgebungen kann Retrieval dort ausgeführt werden, wo die Daten liegen dürfen. Für große KI-Systeme kann ein im Lake gespeicherter Datensatz mehrere Retrieval-Deployments unterstützen, ohne dass zwischen ihnen ein Migrationsjob erforderlich ist.</p>
<p>External Collections sind eine additive Fähigkeit. Native Milvus-Collections bleiben der primäre Weg für schreibintensives Serving mit niedriger Latenz, während External Collections für Datensätze konzipiert sind, deren führendes System außerhalb von Milvus bleibt.</p>
<p>Weitere Details finden Sie unter <a href="https://milvus.io/docs/create-an-external-collection.md">Eine External Collection erstellen</a>.</p>
<h3 id="2-Loon-Storage-v3-Efficient-Point-Reads-for-Lake-Native-Retrieval" class="common-anchor-header">2. Loon (Storage v3): effiziente Point Reads für lake-natives Retrieval</h3><p>External Collections werfen eine offensichtliche Frage auf: Objektspeicher ist auf Skalierung und Dauerhaftigkeit ausgelegt, aber kann er die engen Point Reads unterstützen, die auf eine ANN-Suche folgen?</p>
<p><strong>Die Herausforderung ist Read Amplification.</strong> Vektorsuche läuft üblicherweise in zwei Phasen ab: Ein ANN-Index liefert Kandidaten-IDs zurück, und das System ruft ausgewählte Felder für diese Kandidaten ab. Formate, die für analytische Scans optimiert sind, können einen engen logischen Lookup in einen deutlich größeren physischen Read verwandeln.</p>
<p><strong>Milvus 3.0 begegnet diesem Problem mit Loon, auch bekannt als Storage v3, einer manifestbasierten spaltenorientierten Storage-Engine für S3-kompatiblen Objektspeicher.</strong> Loon organisiert Felder in <code translate="no">ColumnGroups</code> mit ausgerichteten Zeilen-IDs, sodass skalare Felder Filterung und Scans begünstigen können, während Vektoren und Point-Read-intensive Felder Layouts verwenden, die für engere Lookups ausgelegt sind.</p>
<p>Loon hält Vektor- und Inverted-Indizes vom Dateiformat getrennt, anstatt sie darin einzubetten. Jede Datensatzversion wird durch ein unveränderliches Manifest beschrieben, das ihre <code translate="no">ColumnGroups</code> erfasst, sodass dieselbe Indizierungs-Engine über Lance, Parquet, Iceberg und Vortex hinweg arbeiten kann.</p>
<p>Das Manifest-Design macht Schema-Evolution ebenfalls weniger disruptiv. Das Hinzufügen oder Entfernen eines Felds kann Metadaten aktualisieren, ohne bestehende Spalten neu zu schreiben. Das Befüllen eines neuen Felds schreibt eine neue <code translate="no">ColumnGroup</code>, während bestehende <code translate="no">ColumnGroups</code> unverändert bleiben.</p>
<p><a href="https://github.com/vortex-data/vortex"><strong>Vortex</strong></a> ist das Standardformat für diesen Pfad. Es ist ein offenes, Arrow-kompatibles spaltenorientiertes Format mit flexiblen Layouts und verschachtelten Kodierungen, die besser zu Point-Query-intensiven KI-Daten passen. In einem internen Benchmark mit 3 Millionen Zeilen, 128-dimensionalen Vektoren, S3 und 256 parallelen Lesern sank der gemessene I/O pro Point Read von etwa 9,4 MB für die Parquet-Baseline auf 0,07 MB für Vortex mit Loon, also ungefähr 135-mal weniger.</p>
<p>Milvus 3.0 lässt Objektspeicher nicht wie lokalen Speicher agieren. Es reduziert die Read Amplification, die Objektspeicher sonst für Serving-artige Point Lookups unpraktisch macht. Predicate Pushdown in das Format und eine lokale Vortex-Variante stehen als Nächstes auf der Roadmap.</p>
<p><em>Weitere Details finden Sie in unserem Blog:</em> <a href="https://milvus.io/blog/why-we-built-loon-a-storage-engine-for-ai-data-that-never-stops-changing.md"><em>Warum wir Loon entwickelt haben</em></a> <em>und im</em> <a href="https://github.com/vortex-data/vortex"><em>Vortex-Projekt</em></a><em>.</em></p>
<h3 id="3-Snapshots-point-in-time-view-without-data-copy" class="common-anchor-header">3. Snapshots: Point-in-Time-Ansicht ohne Datenkopie</h3><p>Offline-Jobs benötigen eine konsistente Sicht auf Daten, auch während Produktions-Collections weiterhin Schreibvorgänge erhalten. Ein Milvus-Snapshot ist eine zeitpunktbezogene, schreibgeschützte Ansicht, die Verweise auf bestehende Daten-, Index- und Metadatendateien aufzeichnet, anstatt den vollständigen Datensatz zu kopieren.</p>
<p>Dadurch sind Snapshots kostengünstig genug, um sie vor riskanten Vorgängen wie einem Modellwechsel, einem Re-Embedding-Job oder einer Schema-Migration zu erstellen. Die Wiederherstellung eines Snapshots kann bestehende Daten- und Indexdateien durch serverseitiges Kopieren im Objektspeicher wiederverwenden, anstatt jede Zeile erneut zu importieren und jeden Index neu aufzubauen. Diese Funktion ist besonders nützlich für schnelllebige Workloads wie KI-Agenten, bei denen sich Daten ständig ändern und man häufige, günstige Wiederherstellungspunkte statt gelegentlicher schwergewichtiger Backups wünscht.</p>
<p>Dieselbe eingefrorene Ansicht kann Evaluierung, Deduplizierung, Backfill-Validierung und isolierte Tests unterstützen, während die Live-Collection weiterhin Schreibvorgänge akzeptiert. Der Snapshot stabilisiert die logische Eingabe, auch wenn die Workloads weiterhin Infrastruktur wie Objektspeicher und Netzwerkbandbreite gemeinsam nutzen können.</p>
<p>Snapshots ersetzen keine Backups. Ein Snapshot referenziert Dateien, die der Live-Collection gehören, und eignet sich am besten für logische Wiederherstellung, Klonen und kurzlebige stabile Ansichten. Ein Backup erstellt eine unabhängige Kopie für langfristige Aufbewahrung und Disaster Recovery.</p>
<p>Weitere Informationen finden Sie unter <a href="https://milvus.io/docs/snapshots.md">Snapshots</a>, <a href="https://milvus.io/docs/manage-snapshots.md">Snapshots verwalten</a> und <a href="https://milvus.io/docs/snapshot-use-cases.md">Snapshot-Anwendungsfälle</a>.</p>
<h3 id="4-Spark-connector-connect-Milvus-to-batch-workflows" class="common-anchor-header">4. Spark-Connector: Milvus mit Batch-Workflows verbinden</h3><p>Ein stabiler Snapshot ist nur dann nützlich, wenn Batch-Engines ihn lesen können. Milvus 3.0 stellt Milvus als Spark DataSource V2 bereit, sodass Spark-, Databricks- und EMR-Jobs im Rahmen standardmäßiger Batch-Pipelines aus Milvus lesen und nach Milvus schreiben können.</p>
<p>Diese Funktion ist wichtig, weil KI-Daten-Workflows iterativ sind: Deduplizierung speist Re-Embedding, Clustering speist Evaluierung, und Evaluierung erzeugt kuratierte Trainings- oder Serving-Sets. Ein stabiler Snapshot liefert diesen Jobs konsistente Eingaben, während die Live-Collection weiter bereitstellt. Mit dem Spark-Connector wird die Senke eines Jobs zur Quelle des nächsten, ohne jedes Mal eine vollständige Collection aus Milvus zu exportieren.</p>
<p>Milvus 3.0 führt außerdem vektornative Batch-Operatoren für Aufgaben wie Deduplizierung, Anomalieerkennung und Clustering ein, sodass rechenintensive Arbeit außerhalb des Online-Abfragepfads bleibt und direkt auf Vektordaten operiert.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_3_cd37cad0c3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="5-Online-schema-changes-and-backfill" class="common-anchor-header">5. Online-Schemaänderungen und Backfill</h3><p>Ein Schema bleibt in der Produktion selten statisch — Teams fügen im Laufe der Zeit neue Embedding-Modelle, Sparse-Vektoren, Labels, Metadatenfelder und Aufbewahrungsrichtlinien hinzu. Milvus 3.0 ermöglicht es ihnen, Spalten hinzuzufügen, zu befüllen und zu entfernen, während das Serving weiterläuft, anstatt der disruptiven Neuaufbauten, die dafür früher erforderlich waren.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_4_51c9b4e2c1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Das Hinzufügen oder Entfernen einer Spalte erfordert kein Neuschreiben bestehender Daten. <code translate="no">client.add_collection_field(...)</code> legt eine neue nullable Spalte an, ohne die Collection offline zu nehmen, und <code translate="no">client.drop_collection_field(...)</code> entfernt ein veraltetes oder experimentelles Feld zur Laufzeit. Keines davon schreibt die bestehenden Daten neu — beides ist eine Änderung am Manifest der Collection statt an den Datendateien, weshalb kein Neuaufbau erforderlich ist.</p>
<p>Milvus 3.0 unterstützt zwei Backfill-Pfade:</p>
<ul>
<li><strong>Inner Backfill</strong> (in 3.0) ist für Werte gedacht, die aus bestehenden Feldern abgeleitet werden. Milvus kann innerhalb des Kernels einen BM25-Sparse-Vektor aus einer Textspalte erzeugen und damit beim Aufbau von Dense-plus-Sparse-Hybrid-Retrieval den Bedarf an einem clientseitigen Encoder eliminieren.</li>
<li><strong>External Backfill</strong>(auf der Roadmap) wird für Werte gedacht sein, die außerhalb von Milvus berechnet werden: einen Snapshot erstellen, Spark gegen die konsistente Ansicht ausführen, eine neue Spalte berechnen, die Werte zurückschreiben und Milvus den Index inkrementell aktualisieren lassen. Dies ist der vorgesehene Weg für große Re-Embedding-Jobs — zum Beispiel das Hinzufügen einer neuen Embedding-Spalte über Hunderte Millionen Zeilen hinweg, während Schreibvorgänge weiterlaufen.</li>
</ul>
<p>Zusammen erleichtern Online-Schemaänderungen und Backfill die Weiterentwicklung von Retrieval-Pipelines, ohne jedes Mal eine gesamte Collection neu aufzubauen, wenn sich das Datenmodell ändert.</p>
<h2 id="A-More-Powerful-Engine-for-End-to-End-Retrieval" class="common-anchor-header">Eine leistungsstärkere Engine für End-to-End-Retrieval<button data-href="#A-More-Powerful-Engine-for-End-to-End-Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus unterstützt seit Langem mehr als Dense-ANN-Suche, einschließlich BM25-basiertem Sparse Retrieval und Hybrid Search. Milvus 3.0 erweitert die Engine entlang einer anderen Achse: Es bringt mehr der mehrstufigen Retrieval-Pipeline in Milvus selbst und reduziert Over-Fetching, duplizierte Anwendungslogik und die Abhängigkeit von separaten Post-Processing-Diensten.</p>
<h3 id="1-Server-side-ORDER-BY-sort-inside-the-engine-per-segment" class="common-anchor-header">1. Serverseitiges ORDER BY: Sortieren innerhalb der Engine, pro Segment</h3><p>Das Sortieren erforderte bisher, dass Anwendungen Kandidaten im Übermaß abrufen, sie zum Client übertragen und dort sortieren. Das verbrauchte Bandbreite und machte das Endergebnis davon abhängig, wo die clientseitige Kürzung stattfand.</p>
<p><strong>Milvus 3.0 fügt serverseitiges ORDER BY hinzu</strong>, wodurch Query-Workloads gefilterte Zeilen nach skalaren Feldern wie Bewertung, Preis, Aktualität, Lagerbestand oder Zeitstempel sortieren können.</p>
<ul>
<li>Auf dem Query-Pfad sortiert jedes Segment seine gefilterte Ergebnismenge, Query-Nodes führen diese Streams zusammen, und der Proxy gibt den angeforderten Ausschnitt zurück.</li>
<li>Auf dem Search-Pfad sortiert ORDER BY die ANN-Kandidatenmenge innerhalb von Milvus und reduziert so clientseitiges Over-Fetching und doppelte Nachverarbeitung. Es verändert nicht die Recall-Grenze, die durch die ANN-Kandidaten festgelegt wird.</li>
</ul>
<pre><code translate="no" class="language-sql">client.query(
    collection_name=<span class="hljs-string">&quot;products&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;category == &#x27;shoes&#x27;&quot;</span>,
    output_fields=[<span class="hljs-string">&quot;price&quot;</span>, <span class="hljs-string">&quot;rating&quot;</span>],
    limit=<span class="hljs-number">10</span>,
    order_by=[<span class="hljs-string">&quot;rating:desc&quot;</span>, <span class="hljs-string">&quot;price:asc&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Dies ist besonders nützlich für Suchen, die Relevanz mit geschäftlichen oder benutzerorientierten Einschränkungen wie Bewertung, Preis, Aktualität, Lagerbestand oder Zeitstempel kombinieren.</p>
<p>Weitere Informationen finden Sie unter <a href="https://milvus.io/docs/single-vector-search.md#Sort-Search-Results-by-Scalar-Fields--Milvus-30x">Suchergebnisse nach skalaren Feldern sortieren</a> und <a href="https://milvus.io/docs/get-and-scalar-query.md#Sort-Query-Results--Milvus-30x">Abfrageergebnisse sortieren</a>.</p>
<h3 id="2-Aggregation-and-faceted-search" class="common-anchor-header">2. Aggregation und facettierte Suche</h3><p>Milvus 3.0 fügt query-seitige Aggregation mit Operationen wie Count, Summe, Durchschnitt, Minimum und Maximum hinzu, gruppiert nach einem oder mehreren skalaren Feldern. Dadurch entfällt ein häufiges Muster, bei dem Teams gefilterte Zeilen nur deshalb in Client-Code ziehen, um zu zählen, zu gruppieren oder einfache Statistiken zu berechnen.</p>
<pre><code translate="no" class="language-sql">client.query(
    collection_name=<span class="hljs-string">&quot;orders&quot;</span>,
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&quot;in_stock == true&quot;</span>,
    group_by_fields=[<span class="hljs-string">&quot;category&quot;</span>],
    output_fields=[<span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;count(*)&quot;</span>, <span class="hljs-string">&quot;avg(price)&quot;</span>, <span class="hljs-string">&quot;max(rating)&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus 3.0 fügt außerdem <strong>Search Aggregation</strong> für facettierte Suche hinzu. Nach einer ANN-Suche gruppiert Milvus die abgerufenen Treffer nach einem Feld und gibt Bucket-Zählungen, aggregierte Statistiken und Top-N-Beispieltreffer pro Bucket zurück — das Muster hinter Gruppierungen nach Marke, Preisspanne, Farbe, Mandant oder Dokumenttyp. Eine Einschränkung: Search Aggregation arbeitet über der durch ANN abgerufenen Ergebnismenge, nicht über der gesamten Collection, daher sind Facet-Zählungen näherungsweise. Wenn exakte Zählungen benötigt werden, verwenden Sie query-seitige Aggregation.</p>
<p>Weitere Informationen finden Sie unter <a href="https://milvus.io/docs/get-and-scalar-query.md#Aggregate-Query-Results--Milvus-30x">Abfrageergebnisse aggregieren</a>.</p>
<h3 id="3-StructArray-for-Nested-Vectors-and-Late-Interaction-Model" class="common-anchor-header">3. StructArray für verschachtelte Vektoren und Late-Interaction-Modelle</h3><p>Viele Entitäten werden natürlich durch mehrere Vektoren repräsentiert. Ein langes Dokument ist eine Reihe von Chunks; ein Video ist eine Sequenz von Frames, die man lieber in einer Zeile zusammenhält, als sie über viele zu verteilen; ein Produkt hat mehrere Bilder oder Perspektiven. Late-Interaction-Modelle treiben dies noch weiter — ColBERT erzeugt einen Vektor pro Token, ColPali einen pro visuellem Patch. In jedem Fall ist die Einheit, die Sie tatsächlich speichern und durchsuchen möchten, die gesamte Entität, nicht jedes Fragment für sich.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_5_e15816e38b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>StructArray</strong> ermöglicht es einer Milvus-Zeile, ein Array variabler Länge aus strukturierten Elementen einschließlich mehrerer Vektoren zu enthalten, während eine einzelne Entitäts-ID und ein einziger Satz Metadaten beibehalten werden. Dadurch wird vermieden, ein Dokument in mehrere Zeilen aufzuteilen und Labels, Berechtigungen oder andere Felder über Fragmente hinweg zu duplizieren.</p>
<p>Milvus unterstützt zwei Suchgranularitäten.</p>
<ul>
<li><strong>Element-Level-Suche</strong> gleicht einen Query-Vektor mit jedem Element in der Liste ab und gibt das spezifische passende Element mit seinem Offset zurück. Das ist nützlich, wenn man wissen möchte, welcher Chunk, welches Token, welcher Patch oder welches Bild getroffen hat. Eine Zeile kann mehr als einmal erscheinen, wenn mehrere Elemente passen.</li>
<li><strong>Entity-Level-Suche</strong> vergleicht die vollständige Vektorliste einer Query mit der Vektorliste der Zeile mithilfe von <code translate="no">MAX_SIM</code> und der Metrik <code translate="no">MAX_SIM_COSINE</code>. Jedes Query-Token nimmt seinen besten Treffer im Dokument, und diese besten Scores werden summiert. Dadurch erhält Milvus native Unterstützung für Late-Interaction-Retrieval-Muster wie ColBERT und ColPali, während eine Zeile pro Dokument beibehalten wird.</li>
</ul>
<p>Jeden Token-Vektor zu indizieren kann teuer sein; deshalb fügt Milvus 3.0 mehrere Beschleunigungspfade hinzu, darunter TokenANN, Muvera und Lemur, die Indexgröße, Trainingskosten und Recall gegeneinander abwägen.</p>
<table>
<thead>
<tr><th>Strategie</th><th>Stage-One-Repräsentation</th><th>Kostenprofil</th><th>Am besten geeignet für</th></tr>
</thead>
<tbody>
<tr><td>TokenANN</td><td>Jeder Token-Vektor wird indiziert.</td><td>Am höchsten, exakt</td><td>Modelle mit hoher Diskriminationsfähigkeit und kurze Dokumente</td></tr>
<tr><td>Muvera</td><td>Ein Vektor pro Dokument mit Random-Projection FDE.</td><td>Mittel, kein Training</td><td>Lange Dokumente</td></tr>
<tr><td>Lemur</td><td>Ein Vektor pro Dokument mit gelernter MLP-Kompression</td><td>Am niedrigsten, erfordert Training</td><td>Modelle mit geringer Diskriminationsfähigkeit und visuelle oder Patch-Vektoren</td></tr>
</tbody>
</table>
<p>In unseren Benchmarks erreicht oder übertrifft Lemur den TokenANN-Recall auf den meisten Datensätzen, während jedes Dokument auf einen einzigen Vektor komprimiert wird; die Ausnahme sind Korpora mit hoher Längenvarianz, bei denen TokenANN oder eine andere Strategie sicherer ist.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_7_8ff1ab957e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Für Korpora, die größer als der Arbeitsspeicher sind, unterstützt Milvus außerdem einen <code translate="no">DISKANN</code>-Index, der Embedding-Listen auf der Festplatte hält, um den RAM-Druck zu reduzieren.</p>
<p>Element-Level-Suche ist bereits in Milvus 2.6 angekommen. Filtering für Muvera, Lemur und StructList ist neu in 3.0.</p>
<h3 id="4-BM25-Index-Compression-and-SINDI" class="common-anchor-header">4. BM25-Indexkomprimierung und SINDI</h3><p>Milvus hat Sparse-Vektorsuche bereits in früheren Versionen unterstützt. Milvus 3.0 reduziert den Platzbedarf des Sparse-Index durch blockkomprimierte Postings (VByte-verwandte Algorithmen plus SIMD-Dekodierung) und Quantisierung (fp16 für innere Produkte, u16 für BM25).</p>
<p>In einer Reihe interner BM25-Benchmarks war die neue Implementierung bei vergleichbarem Recall ungefähr 3-mal kleiner als der Sparse-Index von Milvus 2.6. Ein kleinerer Index reduziert Speicher- und Bandbreitendruck und kann die Geschwindigkeit in Workloads verbessern, die durch Datenbewegung begrenzt sind.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_8_2e62fc9573.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus 3.0 führt außerdem <a href="https://arxiv.org/abs/2509.08395">SINDI</a> ein, einen neuen Sparse-Retrieval-Algorithmus, der für gelernte Sparse Embeddings wie SPLADE optimiert ist. Da diese Embeddings dichtere Posting-Listen erzeugen als BM25, können pruning-intensive Suchalgorithmen erhebliche CPU-Zeit damit verbringen, zu entscheiden, was übersprungen werden soll. SINDI organisiert Postings stattdessen in kompakten Fenstern und verwendet SIMD-freundliche Score-Akkumulation, um sie effizient zu verarbeiten, während die Retrieval-Genauigkeit durch verlustfreies Pruning erhalten bleibt.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_9_c7de29a223.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Wir haben SINDI außerdem über sein ursprüngliches Design hinaus erweitert und native BM25-Unterstützung hinzugefügt, sodass Milvus denselben optimierten Sparse-Retrieval-Pfad sowohl für gelernte Sparse Embeddings als auch für traditionelle Volltextsuche verwenden kann.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_10_e94a903bcd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>In unseren Benchmarks über 4 SPLADE-Sparse-Vektordatensätze hinweg erreicht SINDI auf Learned-Sparse-Vektoren bis zu etwa das 10-Fache der QPS von MaxScore, mit einem Worst Case von etwa dem 5-Fachen.</p>
<p>SINDI ist in Milvus 3.0 der Standard für Sparse-Inner-Product-Suche.</p>
<h2 id="Other-Enhancements" class="common-anchor-header">Weitere Verbesserungen<button data-href="#Other-Enhancements" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><strong>TEXT LOB:</strong> Speichert langen Quelltext neben Vektoren. Text unter 64 KB bleibt inline; größere Werte verwenden eine Vortex-LOB-Referenz.</li>
<li><strong>Erweiterte Unterstützung für Dense-Indizes:</strong> Fügt innerhalb der Faiss-Familie weitere Indexoptionen hinzu, darunter SVS, Panorama, PQ, IVFPQ und ScaNN, für unterschiedliche Anforderungen an Skalierung, Speicher und Recall.</li>
<li><strong>MinHash und Suche nach nahezu Duplikaten:</strong> Erzeugt MinHash-Signaturen serverseitig und ruft nahezu doppelte Kandidaten mithilfe von MINHASH_LSH ab.</li>
<li><strong>Nullable Vectors und neue Typen:</strong> Ermöglicht, dass Vektorfelder NULL sind, und fügt TIMESTAMPTZ für zeitbewusste Filterung und Aufbewahrungsrichtlinien hinzu.</li>
<li><strong>Benutzerdefinierte Volltext-Wörterbücher:</strong> Registriert Wörterbücher, Synonyme und Stoppwort-Ressourcen im Cluster für mehrsprachige und domänenspezifische Tokenisierung.</li>
<li><strong>Standalone Woodpecker:</strong> Führt das Milvus Write-Ahead Log als unabhängig skalierbaren und beobachtbaren Dienst aus.</li>
<li><strong>Entity</strong> <strong>TTL****:</strong> Lässt einzelne Datensätze über ein TIMESTAMPTZ-Feld ablaufen, mit MVCC-Filterung, gefolgt von Garbage Collection während der Kompaktierung.</li>
<li><strong>ForceMerge:</strong> Kompaktiert kleine Segmente auf eine Zielgröße und baut Indizes neu auf, um Read Amplification vor dauerhaft leseintensivem Serving zu reduzieren.</li>
<li>Und mehr</li>
</ul>
<h2 id="Get-started-with-Milvus-30" class="common-anchor-header">Erste Schritte mit Milvus 3.0<button data-href="#Get-started-with-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 ist ab heute unter der Apache-2.0-Lizenz verfügbar und bleibt ein LF AI &amp; Data-Projekt. So legen Sie los:</p>
<ul>
<li>Lesen Sie die <a href="https://milvus.io/docs/release_notes.md">Release Notes</a> und den <a href="https://milvus.io/docs/quickstart.md">Quickstart</a>, und beziehen Sie den Quellcode unter <a href="https://github.com/milvus-io/milvus">github.com/milvus-io/milvus</a>.</li>
<li>Treten Sie der <a href="https://discord.com/invite/8uyFbECzPX">Milvus-Discord-Community</a> bei oder buchen Sie eine <a href="https://milvus.io/office-hours">Milvus Office Hours</a>-Session, um Ihren Anwendungsfall mit den Maintainers zu besprechen.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_11_78476298b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Milvus-30-and-Zilliz-Vector-Lakebase" class="common-anchor-header">Milvus 3.0 und Zilliz Vector Lakebase<button data-href="#Milvus-30-and-Zilliz-Vector-Lakebase" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 3.0 legt die Open-Source-Grundlage für produktionsreifes KI-Retrieval und die entstehende <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Vector-Lakebase</a>-Architektur, die lake-nativen Speicher mit leistungsstarkem Vektor-Retrieval auf einer einzigen Source of Truth kombiniert, jeweils zu den passenden Kosten.</p>
<p><a href="https://zilliz.com/">Zilliz Cloud</a> ist eine vollständig verwaltete Vector Lakebase, entwickelt vom Team hinter Milvus. Sie teilt dieselbe verteilte, lake-native Architektur wie Milvus und ist vollständig mit der Milvus-API kompatibel. Angetrieben von ihrer proprietären Cardinal-Indizierungs-Engine liefert Zilliz Cloud eine bis zu 10× bessere Preis-Leistung als standardmäßige Open-Source-Indizierungsansätze und eliminiert zugleich die operative Komplexität des Infrastrukturmanagements. Enterprise-Funktionen umfassen Scale-to-Zero-Compute, regionsübergreifende Disaster Recovery, BYOC-Deployment, Sicherheit und Compliance auf Enterprise-Niveau (SOC 2, HIPAA, ISO 27001 und GDPR) sowie eine SLA von bis zu 99,99 %.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/announcing_milvus_30_lake_native_vector_search_and_a_more_powerful_retrieval_engine_md_12_08d1c21d25.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Entwickler können Milvus als Open-Source-Vektordatenbank bereitstellen oder <a href="https://zilliz.com/">Zilliz Cloud</a> als verwaltete Plattform für mehrere Workloads über den gesamten KI-Datenlebenszyklus hinweg nutzen.</p>
<h2 id="What-comes-next" class="common-anchor-header">Was als Nächstes kommt<button data-href="#What-comes-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Milvus-Roadmap baut auf der 3.0-Architektur auf, mit Predicate Pushdown für External Collections, External Backfill, zusätzlichen Spark-Operatoren und Unterstützung für weitere Tabellenformate, darunter Delta Lake und Apache Paimon.</p>
<p>Die größere Richtung ist klar: KI-Datensysteme brauchen eine engere Schleife zwischen Online-Retrieval und Offline-Datenverbesserung. Vektordaten sollten nicht jedes Mal in separate Systeme kopiert werden müssen, wenn Teams sie durchsuchen, analysieren, verbessern oder bereitstellen möchten.</p>
