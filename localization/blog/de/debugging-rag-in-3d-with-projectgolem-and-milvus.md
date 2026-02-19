---
id: debugging-rag-in-3d-with-projectgolem-and-milvus.md
title: >-
  Was wäre, wenn Sie sehen könnten, warum RAG scheitert? Fehlersuche in RAG in
  3D mit Project_Golem und Milvus
author: Min Yin
date: 2026-02-18T00:00:00.000Z
cover: assets.zilliz.com/Debugging_RAG_in_3_D_f1b45f9a99_5f98979c06.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, RAG'
meta_keywords: 'Project_Golem, milvus, RAG'
meta_title: |
  Debugging RAG in 3D with Project_Golem and Milvus
desc: >-
  Erfahren Sie, wie Project_Golem und Milvus RAG-Systeme durch die
  Visualisierung des Vektorraums, das Debuggen von Abfragefehlern und die
  Skalierung der Echtzeit-Vektorsuche beobachtbar machen.
origin: 'https://milvus.io/blog/debugging-rag-in-3d-with-projectgolem-and-milvus.md'
---
<p>Wenn der RAG-Abruf schief geht, weiß man in der Regel, dass er fehlerhaft ist - relevante Dokumente werden nicht angezeigt oder irrelevante schon. Aber herauszufinden, warum, ist eine andere Geschichte. Alles, womit Sie arbeiten können, sind Ähnlichkeitsbewertungen und eine flache Ergebnisliste. Es gibt keine Möglichkeit zu sehen, wie die Dokumente tatsächlich im Vektorraum positioniert sind, wie sich die Chunks zueinander verhalten oder wo Ihre Abfrage relativ zu den Inhalten gelandet ist, mit denen sie übereinstimmen sollte. In der Praxis bedeutet dies, dass die Fehlersuche in RAG hauptsächlich aus Versuch und Irrtum besteht: Man ändert die Chunking-Strategie, tauscht das Einbettungsmodell aus, passt das Top-k an und hofft, dass die Ergebnisse besser werden.</p>
<p><a href="https://github.com/CyberMagician/Project_Golem">Project_Golem</a> ist ein Open-Source-Tool, das den Vektorraum sichtbar macht. Es verwendet UMAP, um hochdimensionale Einbettungen in 3D zu projizieren, und Three.js, um sie interaktiv im Browser darzustellen. Anstatt zu raten, warum der Abruf fehlgeschlagen ist, können Sie sehen, wie die Chunks semantisch geclustert sind, wo Ihre Abfrage landet und welche Dokumente abgerufen wurden - alles auf einer einzigen visuellen Oberfläche.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_1_01de566e04.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Das ist erstaunlich. Das ursprüngliche Project_Golem wurde jedoch für kleine Demos entwickelt, nicht für reale Systeme. Es verlässt sich auf Flat Files, Brute-Force-Suche und Rebuilds des gesamten Datenbestands - was bedeutet, dass es schnell zusammenbricht, wenn Ihre Daten über ein paar tausend Dokumente hinaus wachsen.</p>
<p>Um diese Lücke zu schließen, haben wir Project_Golem mit <a href="https://milvus.io/docs/release_notes.md#v268">Milvus</a> (insbesondere Version 2.6.8) als Vektor-Backbone integriert. Milvus ist eine Open-Source-Hochleistungs-Vektordatenbank, die Echtzeit-Ingestion, skalierbare Indizierung und Abrufe im Millisekundenbereich ermöglicht, während Project_Golem sich auf das konzentriert, was es am besten kann: das Abrufverhalten von Vektoren sichtbar machen. Zusammen verwandeln sie die 3D-Visualisierung von einer Spielzeug-Demo in ein praktisches Debugging-Tool für produktive RAG-Systeme.</p>
<p>In diesem Beitrag stellen wir Ihnen Project_Golem vor und zeigen, wie wir es in Milvus integriert haben, um das Verhalten der Vektorsuche beobachtbar, skalierbar und produktionsreif zu machen.</p>
<h2 id="What-Is-ProjectGolem" class="common-anchor-header">Was ist Project_Golem?<button data-href="#What-Is-ProjectGolem" class="anchor-icon" translate="no">
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
    </button></h2><p>RAG-Debugging ist aus einem einfachen Grund schwierig: Vektorräume sind hochdimensional, und Menschen können sie nicht sehen.</p>
<p><a href="https://github.com/CyberMagician/Project_Golem">Project_Golem</a> ist ein browserbasiertes Werkzeug, mit dem Sie den Vektorraum sehen können, in dem Ihr RAG-System arbeitet. Es nimmt die hochdimensionalen Einbettungen, die den Abruf steuern - typischerweise 768 oder 1536 Dimensionen - und projiziert sie in eine interaktive 3D-Szene, die Sie direkt erkunden können.</p>
<p>Und so funktioniert es im Detail:</p>
<ul>
<li>Dimensionalitätsreduktion mit UMAP. Project_Golem verwendet UMAP, um hochdimensionale Vektoren auf drei Dimensionen zu komprimieren, wobei ihre relativen Abstände beibehalten werden. Teile, die im ursprünglichen Raum semantisch ähnlich sind, bleiben in der 3D-Projektion nahe beieinander; nicht verwandte Teile landen weit auseinander.</li>
<li>3D-Rendering mit Three.js. Jedes Dokumentstück erscheint als Knoten in einer 3D-Szene, die im Browser gerendert wird. Du kannst den Raum drehen, zoomen und erkunden, um zu sehen, wie sich deine Dokumente gruppieren - welche Themen eng beieinander liegen, welche sich überschneiden und wo die Grenzen sind.</li>
<li>Hervorhebung zur Abfragezeit. Wenn Sie eine Abfrage ausführen, erfolgt der Abruf weiterhin im ursprünglichen hochdimensionalen Raum unter Verwendung der Kosinusähnlichkeit. Sobald jedoch Ergebnisse zurückkommen, werden die abgerufenen Teile in der 3D-Ansicht hervorgehoben. Sie können sofort sehen, wo Ihre Abfrage im Verhältnis zu den Ergebnissen gelandet ist - und, was ebenso wichtig ist, im Verhältnis zu den Dokumenten, die nicht gefunden wurden.</li>
</ul>
<p>Das ist es, was Project_Golem für die Fehlersuche so nützlich macht. Anstatt auf eine geordnete Ergebnisliste zu starren und zu raten, warum ein relevantes Dokument nicht gefunden wurde, können Sie sehen, ob es sich in einem weit entfernten Cluster befindet (ein Einbettungsproblem), sich mit irrelevantem Inhalt überschneidet (ein Chunking-Problem) oder nur knapp außerhalb der Abrufschwelle liegt (ein Konfigurationsproblem). Die 3D-Ansicht verwandelt abstrakte Ähnlichkeitswerte in räumliche Beziehungen, über die man nachdenken kann.</p>
<h2 id="Why-ProjectGolem-Isnt-Production-Ready" class="common-anchor-header">Warum Project_Golem nicht produktionstauglich ist<button data-href="#Why-ProjectGolem-Isnt-Production-Ready" class="anchor-icon" translate="no">
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
    </button></h2><p>Project_Golem wurde als Visualisierungsprototyp entwickelt, und dafür funktioniert es gut. Aber seine Architektur geht von Annahmen aus, die im großen Maßstab schnell zusammenbrechen - und zwar auf eine Art und Weise, die wichtig ist, wenn Sie es für das Debugging von RAG in der realen Welt verwenden wollen.</p>
<h3 id="Every-Update-Requires-a-Full-Rebuild" class="common-anchor-header">Jede Aktualisierung erfordert einen vollständigen Rebuild</h3><p>Dies ist die grundlegendste Einschränkung. Im ursprünglichen Design löst das Hinzufügen neuer Dokumente einen kompletten Neuaufbau der Pipeline aus: Einbettungen werden neu generiert und in .npy-Dateien geschrieben, UMAP wird erneut über den gesamten Datensatz ausgeführt und 3D-Koordinaten werden erneut als JSON exportiert.</p>
<p>Selbst bei 100.000 Dokumenten dauert ein Single-Core-UMAP-Lauf 5-10 Minuten. Bei einer Million Dokumente wird es völlig unpraktisch. Sie können dies nicht für Datensätze verwenden, die sich ständig ändern - Newsfeeds, Dokumentationen, Benutzerunterhaltungen -, da jede Aktualisierung bedeutet, dass Sie auf einen vollständigen Neuverarbeitungszyklus warten müssen.</p>
<h3 id="Brute-Force-Search-Doesnt-Scale" class="common-anchor-header">Brute-Force-Suche ist nicht skalierbar</h3><p>Die Abfrageseite hat ihre eigene Obergrenze. Die ursprüngliche Implementierung verwendet NumPy für die Brute-Force-Cosinus-Ähnlichkeitssuche - lineare Zeitkomplexität, keine Indizierung. Bei einem Datensatz mit einer Million Dokumenten kann eine einzige Abfrage über eine Sekunde dauern. Das ist für jedes interaktive oder Online-System unbrauchbar.</p>
<p>Der hohe Speicherbedarf verschärft das Problem. Jeder 768-dimensionale float32-Vektor benötigt etwa 3 KB, so dass ein Datensatz mit einer Million Vektoren über 3 GB Speicherplatz benötigt - und das alles in einem flachen NumPy-Array ohne Indexstruktur, um die Suche effizient zu gestalten.</p>
<h3 id="No-Metadata-Filtering-No-Multi-Tenancy" class="common-anchor-header">Keine Metadaten-Filterung, keine Multi-Tenancy</h3><p>In einem echten RAG-System ist die Vektorähnlichkeit selten das einzige Suchkriterium. Fast immer muss nach Metadaten gefiltert werden, z. B. nach Dokumenttyp, Zeitstempeln, Benutzerrechten oder Grenzen auf Anwendungsebene. Ein RAG-System für den Kundensupport muss beispielsweise die Suche auf die Dokumente eines bestimmten Mandanten beschränken und nicht alle Daten durchsuchen.</p>
<p>Project_Golem unterstützt nichts davon. Es gibt keine ANN-Indizes (wie HNSW oder IVF), keine skalare Filterung, keine Mandantenisolierung und keine hybride Suche. Es handelt sich um eine Visualisierungsschicht ohne eine darunter liegende Suchmaschine für die Produktion.</p>
<h2 id="How-Milvus-Powers-ProjectGolem’s-Retrieval-Layer" class="common-anchor-header">Wie Milvus die Retrieval-Schicht von Project_Golem antreibt<button data-href="#How-Milvus-Powers-ProjectGolem’s-Retrieval-Layer" class="anchor-icon" translate="no">
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
    </button></h2><p>Im vorangegangenen Abschnitt wurden drei Lücken identifiziert: Vollständige Rebuilds bei jeder Aktualisierung, Brute-Force-Suche und keine metadatenbasierte Abfrage. Alle drei haben die gleiche Ursache - Project_Golem hat keine Datenbankschicht. Abruf, Speicherung und Visualisierung sind in einer einzigen Pipeline verwoben, so dass die Änderung eines beliebigen Teils einen Neuaufbau von allem erzwingt.</p>
<p>Die Lösung besteht nicht darin, diese Pipeline zu optimieren. Man muss sie aufspalten.</p>
<p>Durch die Integration von Milvus 2.6.8 als Vektor-Backbone wird das Retrieval zu einer eigenen, produktionsfähigen Schicht, die unabhängig von der Visualisierung arbeitet. Milvus kümmert sich um Vektorspeicherung, Indizierung und Suche. Project_Golem konzentriert sich ausschließlich auf das Rendering, d. h. die Übernahme von Dokument-IDs aus Milvus und deren Hervorhebung in der 3D-Ansicht.</p>
<p>Durch diese Trennung entstehen zwei saubere, unabhängige Abläufe:</p>
<p>Retrieval Flow (Online, Millisekunden-Ebene)</p>
<ul>
<li>Ihre Anfrage wird mithilfe von OpenAI-Einbettungen in einen Vektor umgewandelt.</li>
<li>Der Abfragevektor wird an eine Milvus-Sammlung gesendet.</li>
<li>Milvus AUTOINDEX wählt den passenden Index aus und optimiert ihn.</li>
<li>Eine Echtzeit-Cosinus-Ähnlichkeitssuche liefert die relevanten Dokument-IDs.</li>
</ul>
<p>Visualisierungsablauf (Offline, Demo-Skala)</p>
<ul>
<li>UMAP generiert 3D-Koordinaten während der Dateneingabe (n_neighbors=30, min_dist=0.1).</li>
<li>Die Koordinaten werden in golem_cortex.json gespeichert.</li>
<li>Das Frontend hebt die entsprechenden 3D-Knoten anhand der von Milvus zurückgegebenen Dokument-IDs hervor.</li>
</ul>
<p>Der kritische Punkt ist, dass die Abfrage nicht mehr auf die Visualisierung wartet. Sie können neue Dokumente einlesen und sie sofort durchsuchen - die 3D-Ansicht holt das nach ihrem eigenen Zeitplan nach.</p>
<h3 id="What-Streaming-Nodes-Change" class="common-anchor-header">Was Streaming Nodes ändern</h3><p>Diese Echtzeit-Ingestion wird durch eine neue Funktion in Milvus 2.6.8 ermöglicht: <a href="https://milvus.io/docs/configure_streamingnode.md#streamingNode-related-Configurations">Streaming Nodes</a>. In früheren Versionen war für die Echtzeit-Ingestion eine externe Nachrichtenwarteschlange wie Kafka oder Pulsar erforderlich. Streaming Nodes verlagern diese Koordination in Milvus selbst - neue Vektoren werden kontinuierlich aufgenommen, Indizes werden inkrementell aktualisiert, und neu hinzugefügte Dokumente werden sofort durchsuchbar, ohne dass ein kompletter Neuaufbau erforderlich ist und ohne externe Abhängigkeiten.</p>
<p>Für Project_Golem ist es das, was die Architektur praktisch macht. Sie können Ihrem RAG-System immer wieder neue Dokumente hinzufügen - neue Artikel, aktualisierte Dokumente, benutzergenerierte Inhalte - und die Suche bleibt aktuell, ohne den teuren Zyklus UMAP → JSON → Reload auszulösen.</p>
<h3 id="Extending-Visualization-to-Million-Scale-Future-Path" class="common-anchor-header">Ausweitung der Visualisierung auf den Millionen-Maßstab (Zukunftspfad)</h3><p>Mit dieser von Milvus unterstützten Einrichtung unterstützt Project_Golem derzeit interaktive Demos mit etwa 10.000 Dokumenten. Das Retrieval lässt sich weit darüber hinaus skalieren - Milvus verarbeitet Millionen von Dokumenten -, aber die Visualisierungspipeline ist immer noch auf Batch-UMAP-Läufe angewiesen. Um diese Lücke zu schließen, kann die Architektur um eine inkrementelle Visualisierungspipeline erweitert werden:</p>
<ul>
<li><p>Update-Trigger: Das System lauscht auf Einfügeereignisse in der Milvus-Sammlung. Sobald neu hinzugefügte Dokumente einen bestimmten Schwellenwert erreichen (z. B. 1.000 Elemente), wird eine inkrementelle Aktualisierung ausgelöst.</p></li>
<li><p>Inkrementelle Projektion: Anstatt UMAP erneut über den gesamten Datensatz laufen zu lassen, werden neue Vektoren mit der UMAP-Methode transform() in den bestehenden 3D-Raum projiziert. Auf diese Weise bleibt die globale Struktur erhalten, während die Berechnungskosten drastisch reduziert werden.</p></li>
<li><p>Frontend-Synchronisierung: Aktualisierte Koordinatenfragmente werden über WebSocket an das Frontend gestreamt, so dass neue Knoten dynamisch erscheinen können, ohne dass die gesamte Szene neu geladen werden muss.</p></li>
</ul>
<p>Über die Skalierbarkeit hinaus ermöglicht Milvus 2.6.8 eine hybride Suche durch die Kombination von Vektorähnlichkeit mit Volltextsuche und skalarer Filterung. Dies öffnet die Tür zu reichhaltigeren 3D-Interaktionen, wie z.B. Schlüsselwort-Hervorhebung, Kategorie-Filterung und zeitbasiertes Slicing, und gibt Entwicklern leistungsfähigere Möglichkeiten, das Verhalten von RAG zu untersuchen, zu debuggen und zu verstehen.</p>
<h2 id="How-to-Deploy-and-Explore-ProjectGolem-with-Milvus" class="common-anchor-header">Wie man Project_Golem mit Milvus einsetzt und untersucht<button data-href="#How-to-Deploy-and-Explore-ProjectGolem-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Das aktualisierte Project_Golem ist jetzt Open Source auf <a href="https://github.com/yinmin2020/Project_Golem_Milvus">GitHub</a>. Unter Verwendung der offiziellen Milvus-Dokumentation als Datensatz gehen wir durch den gesamten Prozess der Visualisierung des RAG-Abrufs in 3D. Das Setup verwendet Docker und Python und ist leicht nachzuvollziehen, auch wenn Sie von Null anfangen.</p>
<h3 id="Prerequisites" class="common-anchor-header">Voraussetzungen</h3><ul>
<li>Docker ≥ 20.10</li>
<li>Docker Compose ≥ 2.0</li>
<li>Python ≥ 3.11</li>
<li>Ein OpenAI-API-Schlüssel</li>
<li>Ein Datensatz (Milvus-Dokumentation im Markdown-Format)</li>
</ul>
<h3 id="1-Deploy-Milvus" class="common-anchor-header">1. Milvus bereitstellen</h3><pre><code translate="no">Download docker-compose.yml
wget https://github.com/milvus-io/milvus/releases/download/v2.6.8/milvus-standalone-docker-compose.yml -O docker-compose.yml
Start Milvus（verify port mapping：19530:19530）
docker-compose up -d
Verify that the services are running
docker ps | grep milvus
You should see three containers：milvus-standalone, milvus-etcd, milvus-minio
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Core-Implementation" class="common-anchor-header">2. Kern-Implementierung</h3><p>Milvus-Integration (ingest.py)</p>
<p>Hinweis: Die Implementierung unterstützt bis zu acht Dokumentenkategorien. Wenn die Anzahl der Kategorien diese Grenze überschreitet, werden die Farben in einem Round-Robin-Verfahren wiederverwendet.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> pymilvus.milvus_client.index <span class="hljs-keyword">import</span> IndexParams
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> langchain_text_splitters <span class="hljs-keyword">import</span> RecursiveCharacterTextSplitter
<span class="hljs-keyword">import</span> umap
<span class="hljs-keyword">from</span> sklearn.neighbors <span class="hljs-keyword">import</span> NearestNeighbors
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> glob
--- CONFIG ---
MILVUS_URI = <span class="hljs-string">&quot;http://localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;golem_memories&quot;</span>
JSON_OUTPUT_PATH = <span class="hljs-string">&quot;./golem_cortex.json&quot;</span>
Data directory (users place .md files <span class="hljs-keyword">in</span> this folder)
DATA_DIR = <span class="hljs-string">&quot;./data&quot;</span>
OpenAI Embedding Config
OPENAI_API_KEY = os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)
OPENAI_BASE_URL = <span class="hljs-string">&quot;https://api.openai.com/v1&quot;</span>  <span class="hljs-comment">#</span>
OPENAI_EMBEDDING_MODEL = <span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
<span class="hljs-number">1536</span> dimensions
EMBEDDING_DIM = <span class="hljs-number">1536</span>
Color mapping: colors are assigned automatically <span class="hljs-keyword">and</span> reused <span class="hljs-keyword">in</span> a <span class="hljs-built_in">round</span>-robin manner
COLORS = [
[<span class="hljs-number">0.29</span>, <span class="hljs-number">0.87</span>, <span class="hljs-number">0.50</span>],
Green
[<span class="hljs-number">0.22</span>, <span class="hljs-number">0.74</span>, <span class="hljs-number">0.97</span>],
Blue
[<span class="hljs-number">0.60</span>, <span class="hljs-number">0.20</span>, <span class="hljs-number">0.80</span>],
Purple
[<span class="hljs-number">0.94</span>, <span class="hljs-number">0.94</span>, <span class="hljs-number">0.20</span>],
Gold
[<span class="hljs-number">0.98</span>, <span class="hljs-number">0.55</span>, <span class="hljs-number">0.00</span>],
Orange
[<span class="hljs-number">0.90</span>, <span class="hljs-number">0.30</span>, <span class="hljs-number">0.40</span>],
Red
[<span class="hljs-number">0.40</span>, <span class="hljs-number">0.90</span>, <span class="hljs-number">0.90</span>],
Cyan
[<span class="hljs-number">0.95</span>, <span class="hljs-number">0.50</span>, <span class="hljs-number">0.90</span>],
Magenta
]
<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_embeddings</span>(<span class="hljs-params">texts</span>):
<span class="hljs-string">&quot;&quot;&quot;Batch embedding using OpenAI API&quot;&quot;&quot;</span>
client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)
embeddings = []
batch_size = <span class="hljs-number">100</span>
OpenAI allows multiple texts per request
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(texts), batch_size):
batch = texts[i:i + batch_size]
response = client.embeddings.create(
model=OPENAI_EMBEDDING_MODEL,
<span class="hljs-built_in">input</span>=batch
)
embeddings.extend([item.embedding <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> response.data])
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Embedded <span class="hljs-subst">{<span class="hljs-built_in">min</span>(i + batch_size, <span class="hljs-built_in">len</span>(texts))}</span>/<span class="hljs-subst">{<span class="hljs-built_in">len</span>(texts)}</span>...&quot;</span>)
<span class="hljs-keyword">return</span> np.array(embeddings)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_markdown_files</span>(<span class="hljs-params">data_dir</span>):
<span class="hljs-string">&quot;&quot;&quot;Load all markdown files from the data directory&quot;&quot;&quot;</span>
md_files = glob.glob(os.path.join(data_dir, <span class="hljs-string">&quot;**/*.md&quot;</span>), recursive=<span class="hljs-literal">True</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> md_files:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ ERROR: No .md files found in &#x27;<span class="hljs-subst">{data_dir}</span>&#x27;&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   👉 Create a &#x27;<span class="hljs-subst">{data_dir}</span>&#x27; folder and put your markdown files there.&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   👉 Example: <span class="hljs-subst">{data_dir}</span>/doc1.md, <span class="hljs-subst">{data_dir}</span>/docs/doc2.md&quot;</span>)
<span class="hljs-keyword">return</span> <span class="hljs-literal">None</span>
docs = []
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n📚 FOUND <span class="hljs-subst">{<span class="hljs-built_in">len</span>(md_files)}</span> MARKDOWN FILES:&quot;</span>)
<span class="hljs-keyword">for</span> i, file_path <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(md_files):
filename = os.path.basename(file_path)
Categories are derived <span class="hljs-keyword">from</span> the file’s path relative to data_dir
rel_path = os.path.relpath(file_path, data_dir)
category = os.path.dirname(rel_path) <span class="hljs-keyword">if</span> os.path.dirname(rel_path) <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;default&quot;</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&#x27;r&#x27;</span>, encoding=<span class="hljs-string">&#x27;utf-8&#x27;</span>) <span class="hljs-keyword">as</span> f:
content = f.read()
docs.append({
<span class="hljs-string">&quot;title&quot;</span>: filename,
<span class="hljs-string">&quot;text&quot;</span>: content,
<span class="hljs-string">&quot;cat&quot;</span>: category,
<span class="hljs-string">&quot;path&quot;</span>: file_path
})
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>. [<span class="hljs-subst">{category}</span>] <span class="hljs-subst">{filename}</span>&quot;</span>)
<span class="hljs-keyword">return</span> docs
<span class="hljs-keyword">def</span> <span class="hljs-title function_">ingest_dense</span>():
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;🧠 PROJECT GOLEM - NEURAL MEMORY BUILDER&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;=&quot;</span> * <span class="hljs-number">50</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> OPENAI_API_KEY:
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ❌ ERROR: OPENAI_API_KEY environment variable not set!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Run: export OPENAI_API_KEY=&#x27;your-key-here&#x27;&quot;</span>)
<span class="hljs-keyword">return</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Using OpenAI Embedding: <span class="hljs-subst">{OPENAI_EMBEDDING_MODEL}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Embedding Dimension: <span class="hljs-subst">{EMBEDDING_DIM}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Data Directory: <span class="hljs-subst">{DATA_DIR}</span>&quot;</span>)
<span class="hljs-number">1.</span> Load local markdown files
docs = load_markdown_files(DATA_DIR)
<span class="hljs-keyword">if</span> docs <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
<span class="hljs-keyword">return</span>
<span class="hljs-number">2.</span> Split documents into chunks
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n📦 PROCESSING DOCUMENTS...&quot;</span>)
splitter = RecursiveCharacterTextSplitter(chunk_size=<span class="hljs-number">800</span>, chunk_overlap=<span class="hljs-number">50</span>)
chunks = []
raw_texts = []
colors = []
chunk_titles = []
categories = []
<span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs:
doc_chunks = splitter.create_documents([doc[<span class="hljs-string">&#x27;text&#x27;</span>]])
cat_index = <span class="hljs-built_in">hash</span>(doc[<span class="hljs-string">&#x27;cat&#x27;</span>]) % <span class="hljs-built_in">len</span>(COLORS)
<span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(doc_chunks):
chunks.append({
<span class="hljs-string">&quot;text&quot;</span>: chunk.page_content,
<span class="hljs-string">&quot;title&quot;</span>: doc[<span class="hljs-string">&#x27;title&#x27;</span>],
<span class="hljs-string">&quot;cat&quot;</span>: doc[<span class="hljs-string">&#x27;cat&#x27;</span>]
})
raw_texts.append(chunk.page_content)
colors.append(COLORS[cat_index])
chunk_titles.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{doc[<span class="hljs-string">&#x27;title&#x27;</span>]}</span> (chunk <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>)&quot;</span>)
categories.append(doc[<span class="hljs-string">&#x27;cat&#x27;</span>])
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Created <span class="hljs-subst">{<span class="hljs-built_in">len</span>(chunks)}</span> text chunks from <span class="hljs-subst">{<span class="hljs-built_in">len</span>(docs)}</span> documents&quot;</span>)
<span class="hljs-number">3.</span> Generate embeddings
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n🔮 GENERATING EMBEDDINGS...&quot;</span>)
vectors = get_embeddings(raw_texts)
<span class="hljs-number">4.</span> 3D Projection (UMAP)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n🎨 CALCULATING 3D MANIFOLD...&quot;</span>)
reducer = umap.UMAP(n_components=<span class="hljs-number">3</span>, n_neighbors=<span class="hljs-number">30</span>, min_dist=<span class="hljs-number">0.1</span>, metric=<span class="hljs-string">&#x27;cosine&#x27;</span>)
embeddings_3d = reducer.fit_transform(vectors)
<span class="hljs-number">5.</span> Wiring (KNN)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ↳ Wiring Synapses (finding connections)...&quot;</span>)
nbrs = NearestNeighbors(n_neighbors=<span class="hljs-number">8</span>, metric=<span class="hljs-string">&#x27;cosine&#x27;</span>).fit(vectors)
distances, indices = nbrs.kneighbors(vectors)
<span class="hljs-number">6.</span> Prepare output data
cortex_data = []
milvus_data = []
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(chunks)):
cortex_data.append({
<span class="hljs-string">&quot;id&quot;</span>: i,
<span class="hljs-string">&quot;title&quot;</span>: chunk_titles[i],
<span class="hljs-string">&quot;cat&quot;</span>: categories[i],
<span class="hljs-string">&quot;pos&quot;</span>: embeddings_3d[i].tolist(),
<span class="hljs-string">&quot;col&quot;</span>: colors[i],
<span class="hljs-string">&quot;nbs&quot;</span>: indices[i][<span class="hljs-number">1</span>:].tolist()
})
milvus_data.append({
<span class="hljs-string">&quot;id&quot;</span>: i,
<span class="hljs-string">&quot;text&quot;</span>: chunks[i][<span class="hljs-string">&#x27;text&#x27;</span>],
<span class="hljs-string">&quot;title&quot;</span>: chunk_titles[i],
<span class="hljs-string">&quot;category&quot;</span>: categories[i],
<span class="hljs-string">&quot;vector&quot;</span>: vectors[i].tolist()
})
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(JSON_OUTPUT_PATH, <span class="hljs-string">&#x27;w&#x27;</span>) <span class="hljs-keyword">as</span> f:
json.dump(cortex_data, f)
<span class="hljs-number">7.</span> Store vectors <span class="hljs-keyword">in</span> Milvus
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n💾 STORING IN MILVUS...&quot;</span>)
client = MilvusClient(uri=MILVUS_URI)
Drop existing collection <span class="hljs-keyword">if</span> it exists
<span class="hljs-keyword">if</span> client.has_collection(COLLECTION_NAME):
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Dropping existing collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;...&quot;</span>)
client.drop_collection(COLLECTION_NAME)
Create new collection
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Creating collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; (dim=<span class="hljs-subst">{EMBEDDING_DIM}</span>)...&quot;</span>)
client.create_collection(
collection_name=COLLECTION_NAME,
dimension=EMBEDDING_DIM
)
Insert data
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Inserting <span class="hljs-subst">{<span class="hljs-built_in">len</span>(milvus_data)}</span> vectors...&quot;</span>)
client.insert(
collection_name=COLLECTION_NAME,
data=milvus_data
)
Create index <span class="hljs-keyword">for</span> faster search
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ↳ Creating index...&quot;</span>)
index_params = IndexParams()
index_params.add_index(
field_name=<span class="hljs-string">&quot;vector&quot;</span>,
index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)
client.create_index(
collection_name=COLLECTION_NAME,
index_params=index_params
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n✅ CORTEX GENERATED SUCCESSFULLY!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   📊 <span class="hljs-subst">{<span class="hljs-built_in">len</span>(chunks)}</span> memory nodes stored in Milvus&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   📁 Cortex data saved to: <span class="hljs-subst">{JSON_OUTPUT_PATH}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   🚀 Run &#x27;python GolemServer.py&#x27; to start the server&quot;</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
ingest_dense()
<button class="copy-code-btn"></button></code></pre>
<p>Frontend-Visualisierung (GolemServer.py)</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> flask <span class="hljs-keyword">import</span> Flask, request, jsonify, send_from_directory
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> sys
--- CONFIG ---
Explicitly <span class="hljs-built_in">set</span> the folder to where this script <span class="hljs-keyword">is</span> located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OpenAI Embedding Config
OPENAI_API_KEY = os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)
OPENAI_BASE_URL = <span class="hljs-string">&quot;https://api.openai.com/v1&quot;</span>
OPENAI_EMBEDDING_MODEL = <span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
Milvus Config
MILVUS_URI = <span class="hljs-string">&quot;http://localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;golem_memories&quot;</span>
These <span class="hljs-keyword">match</span> the files generated by ingest.py
JSON_FILE = <span class="hljs-string">&quot;golem_cortex.json&quot;</span>
UPDATED: Matches your new repo filename
HTML_FILE = <span class="hljs-string">&quot;index.html&quot;</span>
app = Flask(__name__, static_folder=BASE_DIR)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n🧠 PROJECT GOLEM SERVER&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   📂 Serving from: <span class="hljs-subst">{BASE_DIR}</span>&quot;</span>)
--- DIAGNOSTICS ---
Check <span class="hljs-keyword">if</span> files exist before starting
missing_files = []
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> os.path.exists(os.path.join(BASE_DIR, JSON_FILE)):
missing_files.append(JSON_FILE)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> os.path.exists(os.path.join(BASE_DIR, HTML_FILE)):
missing_files.append(HTML_FILE)
<span class="hljs-keyword">if</span> missing_files:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ CRITICAL ERROR: Missing files in this folder:&quot;</span>)
<span class="hljs-keyword">for</span> f <span class="hljs-keyword">in</span> missing_files:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;      - <span class="hljs-subst">{f}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Did you run &#x27;python ingest.py&#x27; successfully?&quot;</span>)
sys.exit(<span class="hljs-number">1</span>)
<span class="hljs-keyword">else</span>:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ✅ Files Verified: Cortex Map found.&quot;</span>)
Check API Key
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> OPENAI_API_KEY:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ CRITICAL ERROR: OPENAI_API_KEY environment variable not set!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Run: export OPENAI_API_KEY=&#x27;your-key-here&#x27;&quot;</span>)
sys.exit(<span class="hljs-number">1</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Using OpenAI Embedding: <span class="hljs-subst">{OPENAI_EMBEDDING_MODEL}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ↳ Connecting to Milvus...&quot;</span>)
milvus_client = MilvusClient(uri=MILVUS_URI)
Verify collection exists
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> milvus_client.has_collection(COLLECTION_NAME):
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ CRITICAL ERROR: Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; not found in Milvus.&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Did you run &#x27;python ingest.py&#x27; successfully?&quot;</span>)
sys.exit(<span class="hljs-number">1</span>)
Initialize OpenAI client
openai_client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)
--- ROUTES ---
<span class="hljs-meta">@app.route(<span class="hljs-params"><span class="hljs-string">&#x27;/&#x27;</span></span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">root</span>():
Force serve the specific HTML file
<span class="hljs-keyword">return</span> send_from_directory(BASE_DIR, HTML_FILE)
<span class="hljs-meta">@app.route(<span class="hljs-params"><span class="hljs-string">&#x27;/&#x27;</span></span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">serve_static</span>(<span class="hljs-params">filename</span>):
<span class="hljs-keyword">return</span> send_from_directory(BASE_DIR, filename)
<span class="hljs-meta">@app.route(<span class="hljs-params"><span class="hljs-string">&#x27;/query&#x27;</span>, methods=[<span class="hljs-string">&#x27;POST&#x27;</span>]</span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">query_brain</span>():
data = request.json
text = data.get(<span class="hljs-string">&#x27;query&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> text: <span class="hljs-keyword">return</span> jsonify({<span class="hljs-string">&quot;indices&quot;</span>: []})
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;🔎 Query: <span class="hljs-subst">{text}</span>&quot;</span>)
Get query embedding <span class="hljs-keyword">from</span> OpenAI
response = openai_client.embeddings.create(
model=OPENAI_EMBEDDING_MODEL,
<span class="hljs-built_in">input</span>=text
)
query_vec = response.data[<span class="hljs-number">0</span>].embedding
Search <span class="hljs-keyword">in</span> Milvus
results = milvus_client.search(
collection_name=COLLECTION_NAME,
data=[query_vec],
limit=<span class="hljs-number">50</span>,
output_fields=[<span class="hljs-string">&quot;id&quot;</span>]
)
Extract indices <span class="hljs-keyword">and</span> scores
indices = [r[<span class="hljs-string">&#x27;id&#x27;</span>] <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]
scores = [r[<span class="hljs-string">&#x27;distance&#x27;</span>] <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]
<span class="hljs-keyword">return</span> jsonify({
<span class="hljs-string">&quot;indices&quot;</span>: indices,
<span class="hljs-string">&quot;scores&quot;</span>: scores
})
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&#x27;__main__&#x27;</span>:
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ✅ SYSTEM ONLINE: http://localhost:8000&quot;</span>)
app.run(port=<span class="hljs-number">8000</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Laden Sie den Datensatz herunter und legen Sie ihn im angegebenen Verzeichnis ab.</p>
<pre><code translate="no">https://github.com/milvus-io/milvus-docs/tree/v2.6.x/site/en
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_4_3d17b01fec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Start-the-project" class="common-anchor-header">3. Starten Sie das Projekt</h3><p>Konvertierung von Texteinbettungen in den 3D-Raum</p>
<pre><code translate="no">python ingest.py
<button class="copy-code-btn"></button></code></pre>
<p>[Bild]</p>
<p>Starten Sie den Frontend-Dienst</p>
<pre><code translate="no">python GolemServer.py
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Visualization-and-Interaction" class="common-anchor-header">4. Visualisierung und Interaktion</h3><p>Nachdem das Frontend die Suchergebnisse erhalten hat, wird die Helligkeit der Knoten auf der Grundlage der Cosinus-Ähnlichkeitswerte skaliert, während die ursprünglichen Knotenfarben beibehalten werden, um eindeutige Kategorie-Cluster zu erhalten. Es werden halbtransparente Linien vom Abfragepunkt zu jedem übereinstimmenden Knoten gezogen, und die Kamera schwenkt und zoomt sanft, um den Fokus auf den aktivierten Cluster zu legen.</p>
<h4 id="Example-1-In-Domain-Match" class="common-anchor-header">Beispiel 1: In-Domain Match</h4><p>Abfrage: "Welche Indexarten unterstützt Milvus?"</p>
<p>Visualisierungsverhalten:</p>
<ul>
<li><p>Im 3D-Raum zeigen etwa 15 Knoten innerhalb des roten Clusters mit der Bezeichnung INDEXES einen deutlichen Helligkeitsanstieg (etwa das 2-3fache).</p></li>
<li><p>Zu den übereinstimmenden Knoten gehören Abschnitte aus Dokumenten wie index_types.md, hnsw_index.md und ivf_index.md.</p></li>
<li><p>Es werden halbtransparente Linien vom Abfragevektor zu jedem übereinstimmenden Knoten gerendert, und die Kamera fokussiert gleichmäßig auf den roten Cluster.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_2_c2522b6a67.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="Example-2-Out-of-Domain-Query-Rejection" class="common-anchor-header">Beispiel 2: Ablehnung von Abfragen außerhalb der Domäne</h4><p>Abfrage: "Wie viel kostet das KFC Value Meal?"</p>
<p>Visualisierungsverhalten:</p>
<ul>
<li><p>Alle Knoten behalten ihre ursprünglichen Farben bei, mit nur geringen Größenänderungen (weniger als 1,1×).</p></li>
<li><p>Übereinstimmende Knoten sind über mehrere Cluster mit unterschiedlichen Farben verstreut und zeigen keine klare semantische Konzentration.</p></li>
<li><p>Die Kamera löst keine Fokussierungsaktion aus, da die Ähnlichkeitsschwelle (0,5) nicht erreicht wird.</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_3_39b9383771.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>Project_Golem in Verbindung mit Milvus wird Ihre bestehende RAG-Evaluierungspipeline nicht ersetzen - aber es fügt etwas hinzu, was den meisten Pipelines völlig fehlt: die Möglichkeit zu sehen, was im Vektorraum passiert.</p>
<p>Mit diesem Setup können Sie den Unterschied zwischen einem Abruffehler, der durch eine schlechte Einbettung verursacht wurde, einem, der durch schlechtes Chunking verursacht wurde, und einem, der durch einen Schwellenwert verursacht wurde, der nur etwas zu eng ist, erkennen. Früher musste man für diese Art der Diagnose raten und iterieren. Jetzt können Sie es sehen.</p>
<p>Die aktuelle Integration unterstützt interaktives Debugging im Demo-Maßstab (~10.000 Dokumente), wobei die Milvus-Vektordatenbank im Hintergrund die Abfrage in Produktionsqualität übernimmt. Der Weg zu einer Visualisierung im Millionen-Maßstab ist vorgezeichnet, aber noch nicht realisiert - ein guter Zeitpunkt also, um sich zu beteiligen.</p>
<p>Schauen Sie sich <a href="https://github.com/CyberMagician/Project_Golem">Project_Golem</a> auf GitHub an, probieren Sie es mit Ihrem eigenen Datensatz aus, und sehen Sie, wie Ihr Vektorraum tatsächlich aussieht.</p>
<p>Wenn Sie Fragen haben oder Ihre Ergebnisse mit anderen teilen möchten, treten Sie unserem <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack-Kanal</a> bei oder buchen Sie eine <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus-Sprechstunde</a> für eine praktische Anleitung zu Ihrem Setup.</p>
