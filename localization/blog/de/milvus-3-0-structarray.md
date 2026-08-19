---
id: milvus-3-0-structarray.md
title: >-
  Eine Entität, viele Vektoren: Suche auf Entitäts- und Elementebene mit Milvus
  3.0 StructArray
author: Chenjie Tang
date: 2026-8-19
cover: assets.zilliz.com/milvus_3_0_entity_and_element_level_search_28bba6d843.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus 3.0, StructArray, multi-vector search, EmbeddingList search,
  element-level search
meta_title: |
  Milvus 3.0 StructArray: Multi-Vector Search Within One Entity
desc: >-
  Eine Entität kann mehrere ausgerichtete Vektoren und Metadatenfelder
  enthalten, und Milvus kann entweder die gesamte Entität oder ein einzelnes
  Element durchsuchen, ohne die Daten in separate Zeilen zu zerlegen.
origin: 'https://milvus.io/blog/milvus-3-0-structarray.md'
---
Die meisten Schemata für Vektor-Datenbanken gehen von einer einfachen Annahme aus: eine Entität, ein Embedding. Ein Produkt erhält einen Vektor, ebenso ein Dokument. Eine Benutzerabfrage wird eingebettet und über eine Suche nach ungefähren nächsten Nachbarn (ANN) mit diesen Vektoren verglichen. Dieses Modell funktioniert für die erste Generation von Vektorsuch-Anwendungsfällen, darunter RAG, semantische Suche und Empfehlungssysteme.</p>
<p><strong>Reale KI-Daten passen jedoch selten in diese Annahme.</strong> Ein Video enthält Clips, Einstellungen oder Einzelbilder (Keyframes), jeweils mit eigenem Embedding, Zeitbereich, Bildunterschrift, Szenenlabel und Konfidenzwert. Ein Produkt kann mehrere Bilder und Blickwinkel haben. Ein langes Dokument enthält Passagen oder Abschnitte, deren lokale Bedeutung wichtiger sein kann als ein einzelnes Embedding des gesamten Dokuments. Beliebte Late-Interaction-Modelle zeigen dieselbe Einschränkung in noch feinerer Granularität: ColBERT erzeugt einen Vektor pro Token, ColPali einen Vektor pro visuellem Patch.</p>
<p>In jedem Fall bleibt die übergeordnete Entität die Einheit, die die Anwendung speichert, anzeigt, absichert und zurückgibt. Doch Relevanz, Filterung und Ergebnis-Erklärung hängen oft von Elementen innerhalb dieser Entität ab.</p>
<p><strong>Mit dem neuen StructArray-Feature erhält Milvus ein natives Datenmodell für diese Form: Eine Entität enthält ein geordnetes Array von schema-definierten Struct-Elementen, und jedes Element kann skalare Metadaten, Vektor-Embeddings oder beides tragen.</strong> Milvus kann Felder filtern, die zum selben Element gehören, zwei Embedding-Listen auf Entitätsebene vergleichen oder einzelne Elemente durchsuchen und den passenden Offset zurückgeben.</p>
<p>Dieser Artikel verwendet ein Video-Suchbeispiel, um das Datenmodell zu erklären, und führt es dann durch Schema-Design, Filterung, Granularitäten der Vektorsuche, EmbeddingList-Indexstrategien, Hybrid-Ergebnis-Kollaps und das physische Layout, das das Feature ausführbar macht.</p>
<h2 id="Why-one-vector-and-one-flat-row-model-are-no-longer-enough" class="common-anchor-header">Warum ein Modell mit einem Vektor und einer flachen Zeile nicht mehr ausreicht<button data-href="#Why-one-vector-and-one-flat-row-model-are-no-longer-enough" class="anchor-icon" translate="no">
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
    </button></h2><p>Stellen Sie sich eine Benutzerin vor, die in einem Videokatalog nach „eine Person, die in einer Küche Gemüse schneidet“ sucht. Das relevante Signal kann in einem acht Sekunden langen Clip liegen, nicht in einem Embedding des gesamten Videos. <strong>Jeden Clip, jedes Objekt und jede Aktion in einen einzigen Vektor zu komprimieren, kann zwar das allgemeine Thema bewahren, verwischt aber lokale Details.</strong></p>
<p>Dieselbe Diskrepanz tritt auch in anderen Workloads auf:</p>
<ul>
<li>Die Relevanz eines Produkts kann von einem von mehreren Bildern oder Blickwinkeln abhängen.</li>
<li>Ein Dokument kann wegen einer einzigen Passage übereinstimmen, nicht wegen seines Gesamtthemas.</li>
<li>Ein Agent-Speicher kann mehrere Beobachtungen enthalten, von denen nur eine für die aktuelle Aufgabe relevant ist.</li>
<li>Ein ColBERT- oder ColPali-Datensatz enthält eine Liste variabler Länge mit Token- bzw. Patch-Vektoren statt eines einzelnen dichten Vektors.</li>
</ul>
<p>Eine Alternative besteht darin, jeden Clip, jedes Bild oder jede Passage in eine separate Datenbankzeile zu zerlegen. Das ermöglicht lokale Suche, trennt aber jedes Fragment von seiner übergeordneten Entität. Die Metadaten der übergeordneten Entität können über mehrere Zeilen hinweg wiederholt werden, und das Abrufen auf Entitätsebene erfordert dann Gruppierung, Deduplizierung und erneutes Ranking nach der Fragmentsuche.</p>
<p>Verschachtelte Speicherung allein löst das Abfrageproblem nicht. JSON kann Objekte speichern, gibt Milvus aber kein vordefiniertes Unterfeld-Schema für Vektor- und Skalar-Indizierung. Parallele Arrays können Bildunterschriften, Szenenlabels und Konfidenzwerte speichern, aber die Anwendung muss die Offset-Ausrichtung selbst aufrechterhalten. Die Datenbank kann nicht sicher ableiten, dass <code translate="no">scene_type[3]</code> und <code translate="no">label_confidence[3]</code> denselben Clip beschreiben, wenn diese Beziehung nicht Teil des Datenmodells ist.</p>
<p>StructArray kodiert diese Beziehung direkt. Es hält lokale Elemente innerhalb der übergeordneten Entität und macht ihre ausgerichteten Unterfelder für Schema-Validierung, Indizierung, Filterung und Vektorsuche zugänglich.</p>
<h2 id="What-is-StructArray-and-its-data-model" class="common-anchor-header">Was ist StructArray und wie sieht sein Datenmodell aus?<button data-href="#What-is-StructArray-and-its-data-model" class="anchor-icon" translate="no">
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
    </button></h2><p>Ein StructArray – auch bekannt als Array von Structs – speichert in jeder Entität eine geordnete Menge von Struct-Elementen. Ein StructArray-Feld ist ein <code translate="no">Array</code>, dessen Elemente alle einem vordefinierten <code translate="no">Struct</code>-Schema folgen. Für eine Video-Collection könnte die logische Form so aussehen:</p>
<pre><code translate="no">Plaintext
clips: ARRAY&lt;STRUCT&lt;
    clip_embedding_list: FLOAT_VECTOR,
    clip_embedding: FLOAT_VECTOR,
    start_sec: DOUBLE,
    end_sec: DOUBLE,
    caption: VARCHAR,
    scene_type: VARCHAR,
    label_confidence: FLOAT
&gt;&gt;
<button class="copy-code-btn"></button></code></pre>
<p>Hier gilt:</p>
<ul>
<li><code translate="no">clips</code> ist das übergeordnete StructArray-Feld.</li>
<li><code translate="no">clip_embedding_list</code>, <code translate="no">clip_embedding</code>, <code translate="no">start_sec</code> und die anderen Attribute sind Unterfelder.</li>
<li><code translate="no">clips[0]</code> ist der erste Clip.</li>
<li>Jedes Unterfeld bei Offset <code translate="no">0</code> gehört zu demselben Clip.</li>
<li>Jedes Unterfeld bei Offset <code translate="no">3</code> gehört zu einem anderen Clip.</li>
</ul>
<p>Die beiden Vektor-Unterfelder dienen unterschiedlichen Suchmodi. <code translate="no">clips[clip_embedding_list]</code> wird mit einer <code translate="no">MAX_SIM*</code>-Metrik für die EmbeddingList-Suche auf Entitätsebene indiziert, während <code translate="no">clips[clip_embedding]</code> mit einer regulären Vektor-Metrik für die Suche auf Elementebene indiziert wird. Da ein Vektorfeld oder Vektor-Unterfeld nur einen Index akzeptiert, muss eine Collection, die beide Modi benötigt, die beiden Unterfelder getrennt definieren und indizieren.</p>
<p>Dieses Modell unterstützt drei unterschiedliche Abfragesemantiken.</p>
<h3 id="1-EmbeddingList-search-returns-parent-entities" class="common-anchor-header">1. EmbeddingList-Suche gibt übergeordnete Entitäten zurück</h3><p>Die Vektoren in <code translate="no">clips[clip_embedding_list]</code> bilden eine Embedding-Liste für das Video. Auch die Abfrage ist eine <code translate="no">EmbeddingList</code>. Milvus vergleicht die Abfrageliste mit jeder gespeicherten Liste über eine <code translate="no">MAX_SIM*</code>-Metrik und liefert ein Ergebnis auf Entitätsebene.</p>
<pre><code translate="no">Plaintext
clips[clip_embedding_list] = [
    embedding_0,
    embedding_1,
    embedding_2,
    ...
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-The-MATCH-family-filters-parent-entities" class="common-anchor-header">2. Die <code translate="no">MATCH_*</code>-Familie filtert übergeordnete Entitäten</h3><p><code translate="no">MATCH_ANY</code>, <code translate="no">MATCH_ALL</code>, <code translate="no">MATCH_LEAST</code>, <code translate="no">MATCH_MOST</code> und <code translate="no">MATCH_EXACT</code> werten ein Prädikat gegen Struct-Elemente aus, zählen, wie viele Elemente es erfüllen, und entscheiden, ob die übergeordnete Entität den Filter passiert.</p>
<p>Zum Beispiel:</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">MATCH_ANY</span><span class="hljs-params">(clips, $[scene_type] == <span class="hljs-string">&quot;kitchen&quot;</span> &amp;&amp; $[label_confidence] &gt; <span class="hljs-number">0.8</span>)</span>
<button class="copy-code-btn"></button></code></pre>
<p>Beide Skalarbedingungen müssen beim selben Clip-Offset erfüllt sein. Milvus kombiniert nicht ein Küchenlabel aus einem Clip mit einem hohen Konfidenzwert aus einem anderen.</p>
<h3 id="3-Element-level-search-returns-the-matching-element-offset" class="common-anchor-header">3. Suche auf Elementebene gibt den Offset des passenden Elements zurück</h3><p>Ein regulärer Abfragevektor kann jeden Vektor in <code translate="no">clips[clip_embedding]</code> unabhängig durchsuchen. Jeder Treffer identifiziert die übergeordnete Entität und den nullbasierten Offset des passenden Struct-Elements. Ein <code translate="no">element_filter</code> kann einschränken, welche Elemente an dieser Vektorsuche teilnehmen.</p>
<p>Diese Operationen teilen eine gemeinsame Grundannahme: Milvus weiß, welche Vektor- und Skalarwerte zum selben Element gehören und welche Elemente zur selben Entität gehören.</p>
<p>StructArray ist kein allgemeines System für beliebige Verschachtelungen. Das aktuelle Modell ist ein <code translate="no">Array</code> aus <code translate="no">Struct</code>-Elementen mit unterstützten Skalar- und Vektor-Unterfeldern. Diese Grenze macht Unterfeld-Indizierung und elementbewusste Ausführung praktikabel.</p>
<h2 id="Build-the-schema-indexes-and-insert-path" class="common-anchor-header">Schema, Indizes und Insert-Pfad aufbauen<button data-href="#Build-the-schema-indexes-and-insert-path" class="anchor-icon" translate="no">
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
    </button></h2><p>Das folgende vereinfachte PyMilvus-Beispiel erstellt eine Video-Collection mit einem Top-Level-Vektor und einem StructArray für Clips. Es verwendet getrennte Clip-Vektor-Unterfelder, damit dieselbe Collection beide Suchmodi demonstrieren kann.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> DataType, MilvusClient

client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

schema = client.create_schema(auto_id=<span class="hljs-literal">False</span>, enable_dynamic_field=<span class="hljs-literal">False</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;title&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;video_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)

<span class="hljs-comment"># Define the Struct schema explicitly.</span>
clip_schema = client.create_struct_field_schema()
clip_schema.add_field(<span class="hljs-string">&quot;clip_embedding_list&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)
clip_schema.add_field(<span class="hljs-string">&quot;clip_embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">768</span>)
clip_schema.add_field(<span class="hljs-string">&quot;start_sec&quot;</span>, DataType.DOUBLE)
clip_schema.add_field(<span class="hljs-string">&quot;end_sec&quot;</span>, DataType.DOUBLE)
clip_schema.add_field(<span class="hljs-string">&quot;caption&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">2048</span>)
clip_schema.add_field(<span class="hljs-string">&quot;scene_type&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">128</span>)
clip_schema.add_field(<span class="hljs-string">&quot;label_confidence&quot;</span>, DataType.FLOAT)

schema.add_field(
    <span class="hljs-string">&quot;clips&quot;</span>,
    datatype=DataType.ARRAY,
    element_type=DataType.STRUCT,
    struct_schema=clip_schema,
    max_capacity=<span class="hljs-number">1024</span>,
)

client.create_collection(<span class="hljs-string">&quot;videos&quot;</span>, schema=schema)
<button class="copy-code-btn"></button></code></pre>
<p>Vektor-Unterfelder müssen vor der Suche indiziert werden. Da die Metrik-Familie den Suchmodus bestimmt, erhält jedes Vektor-Unterfeld seinen eigenen Index:</p>
<pre><code translate="no" class="language-python">index_params = client.prepare_index_params()

<span class="hljs-meta"># EmbeddingList search.</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;clips[clip_embedding_list]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>,
    index_name=<span class="hljs-string">&quot;clips_clip_embedding_list_maxsim_idx&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>},
)

<span class="hljs-meta"># Element-level search.</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    index_name=<span class="hljs-string">&quot;clips_clip_embedding_cosine_idx&quot;</span>,
    <span class="hljs-keyword">params</span>={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">200</span>},
)

client.create_index(<span class="hljs-string">&quot;videos&quot;</span>, index_params=index_params)
<button class="copy-code-btn"></button></code></pre>
<p>Skalar-Indizes sind optional, aber Unterfelder, die häufig in Filterung auf großer Skala vorkommen, sollten einen kompatiblen Skalar-Index verwenden. Zum Beispiel kann <code translate="no">clips[scene_type]</code> einen invertierten Index verwenden, während ein numerisches Unterfeld wie <code translate="no">clips[label_confidence]</code> einen für numerische Filterung geeigneten Index nutzen kann.</p>
<p>Fügen Sie Daten in ihrer natürlichen Entitätsform ein: eine Videzeile mit einem Array aus Clip-Objekten. Um das Beispiel kompakt zu halten, schreibt es denselben Clip-Vektor in beide Vektor-Unterfelder.</p>
<pre><code translate="no" class="language-python">rows = [
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;title&quot;</span>: <span class="hljs-string">&quot;cooking tutorial&quot;</span>,
        <span class="hljs-string">&quot;video_embedding&quot;</span>: video_vec,
        <span class="hljs-string">&quot;clips&quot;</span>: [
            {
                <span class="hljs-string">&quot;clip_embedding_list&quot;</span>: clip_vec_1,
                <span class="hljs-string">&quot;clip_embedding&quot;</span>: clip_vec_1,
                <span class="hljs-string">&quot;start_sec&quot;</span>: <span class="hljs-number">0.0</span>,
                <span class="hljs-string">&quot;end_sec&quot;</span>: <span class="hljs-number">8.0</span>,
                <span class="hljs-string">&quot;caption&quot;</span>: <span class="hljs-string">&quot;A person washes vegetables.&quot;</span>,
                <span class="hljs-string">&quot;scene_type&quot;</span>: <span class="hljs-string">&quot;kitchen&quot;</span>,
                <span class="hljs-string">&quot;label_confidence&quot;</span>: <span class="hljs-number">0.92</span>,
            },
            {
                <span class="hljs-string">&quot;clip_embedding_list&quot;</span>: clip_vec_2,
                <span class="hljs-string">&quot;clip_embedding&quot;</span>: clip_vec_2,
                <span class="hljs-string">&quot;start_sec&quot;</span>: <span class="hljs-number">8.0</span>,
                <span class="hljs-string">&quot;end_sec&quot;</span>: <span class="hljs-number">16.0</span>,
                <span class="hljs-string">&quot;caption&quot;</span>: <span class="hljs-string">&quot;A person cuts carrots on a board.&quot;</span>,
                <span class="hljs-string">&quot;scene_type&quot;</span>: <span class="hljs-string">&quot;kitchen&quot;</span>,
                <span class="hljs-string">&quot;label_confidence&quot;</span>: <span class="hljs-number">0.96</span>,
            },
        ],
    }
]

client.<span class="hljs-title function_">insert</span>(<span class="hljs-string">&quot;videos&quot;</span>, rows)
client.<span class="hljs-title function_">flush</span>(<span class="hljs-string">&quot;videos&quot;</span>)
client.<span class="hljs-title function_">load_collection</span>(<span class="hljs-string">&quot;videos&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>An der API-Grenze bleibt <code translate="no">clips</code> ein Array aus strukturierten Objekten. Innerhalb von Milvus folgt jedes Unterfeld dem typisierten Pfad, der für seinen eigenen Index, seine Filterung und sein Ausgabeverhalten erforderlich ist. Dieser Unterschied ist beim Einfügen transparent, aber für alles Weitere fundamental.</p>
<h2 id="Same-element-filtering-is-the-difference-between-structure-and-parallel-arrays" class="common-anchor-header">Gleich-Element-Filterung ist der Unterschied zwischen Struktur und parallelen Arrays<button data-href="#Same-element-filtering-is-the-difference-between-structure-and-parallel-arrays" class="anchor-icon" translate="no">
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
    </button></h2><p>Der Hauptvorteil der Filterung liegt nicht in kürzerer Syntax für verschachtelte Felder. Es geht um die korrekte Korrelation zwischen Skalar-Unterfeldern.</p>
<p>Angenommen, die Anwendung benötigt Videos, die einen Küchenclip mit Label-Konfidenz über <code translate="no">0.8</code> enthalten. Es reicht nicht, dass ein Video irgendeinen Küchenclip und irgendeinen Clip mit hoher Konfidenz enthält; derselbe Clip muss beide Bedingungen erfüllen.</p>
<p>Die StructArray-<code translate="no">MATCH_*</code>-Familie drückt das direkt aus:</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">MATCH_ANY</span><span class="hljs-params">(clips, $[scene_type] == <span class="hljs-string">&quot;kitchen&quot;</span> &amp;&amp; $[label_confidence] &gt; <span class="hljs-number">0.8</span>)</span>
MATCH_ALL(clips, $[label_confidence] &gt; <span class="hljs-number">0.5</span>)
MATCH_LEAST(clips, $[scene_type] == <span class="hljs-string">&quot;sports&quot;</span>, threshold=<span class="hljs-number">3</span>)
MATCH_MOST(clips, $[label_confidence] &lt; <span class="hljs-number">0.2</span>, threshold=<span class="hljs-number">1</span>)
MATCH_EXACT(clips, $[scene_type] == <span class="hljs-string">&quot;intro&quot;</span>, threshold=<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Milvus wertet das Prädikat bei jedem Element-Offset aus und wendet dann den Quantor des Operators an, um zu entscheiden, ob die übergeordnete Entität den Filter passiert:</p>
<ul>
<li><code translate="no">MATCH_ANY</code>: Mindestens ein Element erfüllt die Bedingung.</li>
<li><code translate="no">MATCH_ALL</code>: Jedes Element erfüllt die Bedingung.</li>
<li><code translate="no">MATCH_LEAST</code>: Mindestens <code translate="no">threshold</code> Elemente erfüllen die Bedingung.</li>
<li><code translate="no">MATCH_MOST</code>: Höchstens <code translate="no">threshold</code> Elemente erfüllen die Bedingung.</li>
<li><code translate="no">MATCH_EXACT</code>: Genau <code translate="no">threshold</code> Elemente erfüllen die Bedingung.</li>
</ul>
<p>Wären dieselben Daten als zwei unabhängige Arrays gespeichert, würde der folgende Ausdruck diese Korrelation nicht bewahren:</p>
<pre><code translate="no">Plaintext
<span class="hljs-title function_">array_contains</span><span class="hljs-params">(clips[scene_type], <span class="hljs-string">&quot;kitchen&quot;</span>)</span>
AND
<span class="hljs-title function_">array_contains</span><span class="hljs-params">(clips[label_confidence], <span class="hljs-number">0.9</span>)</span>
<button class="copy-code-btn"></button></code></pre>
<p>Die beiden Werte könnten bei unterschiedlichen Offsets liegen. Das kann für unabhängige Attribute zulässig sein, ist aber falsch, wenn beide Bedingungen denselben Clip, dasselbe Produktbild oder dieselbe Dokumentpassage beschreiben.</p>
<p>StructArray macht die Elementidentität zu einem Teil des Datenbank-Prädikats statt zu einer Konvention, die die Anwendung durchsetzen muss.</p>
<h2 id="Two-vector-search-granularities-two-result-identities" class="common-anchor-header">Zwei Granularitäten der Vektorsuche, zwei Ergebnisidentitäten<button data-href="#Two-vector-search-granularities-two-result-identities" class="anchor-icon" translate="no">
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
    </button></h2><p>Sobald eine Entität mehrere Vektoren speichert, muss das Abrufsystem eine Modellierungsfrage klären, bevor die ANN-Suche beginnt:</p>
<p><strong>Sollen die Vektoren gemeinsam als eine Repräsentation der übergeordneten Entität bewertet werden, oder soll jeder Elementvektor unabhängig konkurrieren?</strong></p>
<p>StructArray unterstützt beide Modelle, aber sie verwenden unterschiedliche Abfrageformen, Metrik-Familien, Vektor-Unterfelder und Ergebnisidentitäten.</p>
<h3 id="EmbeddingList-search-a-list-of-query-vectors-finds-an-entity" class="common-anchor-header">EmbeddingList-Suche: Eine Liste von Abfragevektoren findet eine Entität</h3><p>Eine <code translate="no">EmbeddingList</code>-Abfrage enthält mehrere Vektoren. Ein Abfragevideo kann in mehrere Clips unterteilt sein; eine Produktabfrage kann mehrere Referenzbilder enthalten; eine ColBERT-Abfrage enthält einen Vektor pro Abfrage-Token.</p>
<p>Für jede Entität vergleicht Milvus die Abfrageliste mit der gespeicherten Embedding-Liste der Entität. Bei der MaxSim-basierten Bewertung wählt jeder Abfragevektor seine beste Übereinstimmung in der Entitätsliste, und Milvus aggregiert diese besten Übereinstimmungswerte zu einem Entitäts-Score. Der endgültige Treffer repräsentiert die übergeordnete Entität, nicht ein bestimmtes Struct-Element.</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus.client.embedding_list import EmbeddingList

query = EmbeddingList()
query.<span class="hljs-keyword">add</span>(query_clip_vec_1)
query.<span class="hljs-keyword">add</span>(query_clip_vec_2)

client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding_list]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;MAX_SIM_COSINE&quot;</span>},
    limit=<span class="hljs-number">10</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Diese Suche beantwortet: <strong>Welche Videos sind die beste Gesamtübereinstimmung für diese Menge von Abfrage-Clips?</strong></p>
<p>Sie passt zu Video-zu-Video-Retrieval, Multi-Bild-Produktsuche, ColBERT- und ColPali-basiertem Retrieval sowie anderen Fällen, in denen sowohl die Abfrage als auch die gespeicherte Entität durch mehrere Vektoren repräsentiert werden.</p>
<h3 id="Element-level-search-one-query-vector-finds-a-clip-inside-an-entity" class="common-anchor-header">Suche auf Elementebene: Ein Abfragevektor findet einen Clip innerhalb einer Entität</h3><p>Die Suche auf Elementebene verwendet einen regulären Abfragevektor. Jeder Vektor in <code translate="no">clips[clip_embedding]</code> nimmt als unabhängiger Kandidat an der ANN-Suche teil. Jeder Treffer identifiziert die übergeordnete Entität und den Offset des passenden Elements.</p>
<pre><code translate="no" class="language-python">client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    <span class="hljs-built_in">limit</span>=10,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;clips&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Um nur ausgewählte Clips zu durchsuchen, hängen Sie einen <code translate="no">element_filter</code> an, dessen Skalarbedingungen auf denselben Clip angewendet werden:</p>
<pre><code translate="no" class="language-python">client.search(
    collection_name=<span class="hljs-string">&quot;videos&quot;</span>,
    data=[query_vec],
    anns_field=<span class="hljs-string">&quot;clips[clip_embedding]&quot;</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    <span class="hljs-built_in">filter</span>=<span class="hljs-string">&#x27;element_filter(clips, $[scene_type] == &quot;kitchen&quot; &amp;&amp; $[label_confidence] &gt; 0.8)&#x27;</span>,
    limit=<span class="hljs-number">10</span>,
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>, <span class="hljs-string">&quot;title&quot;</span>, <span class="hljs-string">&quot;clips&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>Der Filter wählt nicht zuerst einen Küchenclip aus und durchsucht dann einen anderen Clip mit hoher Konfidenz. Sowohl die Prädikate als auch der Vektorkandidat beziehen sich auf dasselbe Struct-Element.</p>
<p>Eine nicht gruppierte Antwort kann so aussehen:</p>
<pre><code translate="no">Plaintext
<span class="hljs-built_in">id</span> = <span class="hljs-number">1</span>, offset = <span class="hljs-number">1</span>, distance = <span class="hljs-number">0.91</span>
<span class="hljs-built_in">id</span> = <span class="hljs-number">8</span>, offset = <span class="hljs-number">4</span>, distance = <span class="hljs-number">0.88</span>
<span class="hljs-built_in">id</span> = <span class="hljs-number">1</span>, offset = <span class="hljs-number">3</span>, distance = <span class="hljs-number">0.84</span>
<button class="copy-code-btn"></button></code></pre>
<p>Dieselbe Entität kann mehrfach erscheinen, weil mehrere Clips übereinstimmen können. Das ist nützlich, wenn die Anwendung nicht nur zeigen muss, welches Video oder Dokument relevant ist, sondern auch, welcher Clip oder welche Passage den Treffer erzeugt hat.</p>
<table>
<thead>
<tr><th>Aspekt</th><th>EmbeddingList-Suche</th><th>Suche auf Elementebene</th></tr>
</thead>
<tbody>
<tr><td>Abfrageeingabe</td><td>Ein oder mehrere Abfragevektoren in einer <code translate="no">EmbeddingList</code></td><td>Ein regulärer Abfragevektor</td></tr>
<tr><td>Beispiel-Ziel</td><td><code translate="no">clips[clip_embedding_list]</code></td><td><code translate="no">clips[clip_embedding]</code></td></tr>
<tr><td>Metrik-Familie</td><td><code translate="no">MAX_SIM*</code></td><td>Reguläre Metriken wie <code translate="no">COSINE</code>, <code translate="no">IP</code> oder <code translate="no">L2</code></td></tr>
<tr><td>ANN-Kandidateneinheit</td><td>Die Embedding-Liste der übergeordneten Entität</td><td>Jeder Struct-Elementvektor</td></tr>
<tr><td>Ergebnisidentität</td><td>Übergeordnete Entität</td><td>Übergeordnete Entität plus Element-Offset</td></tr>
<tr><td>Typischer Anwendungsfall</td><td>Eine Multi-Vektor-Abfrage gegen eine Multi-Vektor-Entität abgleichen</td><td>Den relevantesten Clip, das relevanteste Bild, die relevanteste Passage, den relevantesten Patch oder Fakt finden</td></tr>
</tbody>
</table>
<p>Um beide Modi in einer Collection zu unterstützen, definieren und indizieren Sie getrennte Vektor-Unterfelder. Abfrageform, Metrik-Familie und Zielindex müssen übereinstimmen.</p>
<h2 id="EmbeddingList-indexing-is-a-quality-cost-decision" class="common-anchor-header">EmbeddingList-Indizierung ist eine Qualitäts-Kosten-Entscheidung<button data-href="#EmbeddingList-indexing-is-a-quality-cost-decision" class="anchor-icon" translate="no">
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
    </button></h2><p>Mit einem Embedding pro Entität findet ein ANN-Index Entitäten in der Nähe eines Abfragevektors. Die EmbeddingList-Suche ist teurer, weil die Relevanz von paarweisen Interaktionen zwischen zwei Vektorlisten abhängt.</p>
<p>Die Berechnung von exaktem MaxSim gegen jeden Vektor in jeder Entität erzeugt das sauberste Referenz-Ranking, aber ein vollständiger Scan ist für Online-Retrieval meist zu teuer. Milvus verwendet daher ein zweistufiges Modell:</p>
<ol>
<li>Eine approximative Strategie gewinnt Kandidaten-Entitäten auf übergeordneter Ebene.</li>
<li>Wenn <code translate="no">emb_list_rerank</code> aktiviert ist, berechnet Milvus MaxSim über diese Kandidaten neu, um das endgültige Ranking zu erzeugen.</li>
</ol>
<p>Mehr Kandidaten in der ersten Stufe abzurufen erhöht in der Regel die Chance, dass die wahren Top-Ergebnisse den Reranker erreichen, erhöht aber auch Latenz und Rechenaufwand. Die drei Strategien unterscheiden sich hauptsächlich darin, wie sie diese Kandidatenmenge erzeugen.</p>
<table>
<thead>
<tr><th>Strategie</th><th>Kandidatenrepräsentation in der ersten Stufe</th><th>Guter Ausgangspunkt, wenn</th><th>Hauptabwägung</th></tr>
</thead>
<tbody>
<tr><td>TokenANN</td><td>Jeder Vektor in jeder Embedding-Liste wird indiziert. Abfragevektoren führen ANN unabhängig aus; Treffer werden vor dem MaxSim-Reranking wieder zu übergeordneten Entitäten aggregiert.</td><td>Qualität Priorität hat, die Listen kurz oder mittellang sind und einzelne Vektoren diskriminativ sind.</td><td>Indexgröße und Suchaufwand in der ersten Stufe wachsen mit der Listengröße und der Anzahl der Abfragevektoren.</td></tr>
<tr><td>MUVERA</td><td>Jede Embedding-Liste wird durch Zufallsprojektionen in einen festdimensionalen Vektor kodiert, dann wird gewöhnliche ANN ausgeführt.</td><td>TokenANN zu schwer ist und Kompression ohne Trainingspipeline bevorzugt wird.</td><td>Die Kodierung verliert Informationen; stärkere Projektionseinstellungen erhöhen die kodierte Dimensionalität und die ANN-Kosten.</td></tr>
<tr><td>LEMUR</td><td>Ein Modell wird trainiert, das eine Embedding-Liste auf einen festdimensionalen Vektor der übergeordneten Entität abbildet.</td><td>Embeddings weniger diskriminativ sind, Listen groß sind oder der Workload visuell oder multimodal ist.</td><td>Es erfordert Training und kann empfindlich auf Korpusverteilung und Dokumentlängen-Bias reagieren.</td></tr>
</tbody>
</table>
<p>Keine Strategie ist für jeden Workload am besten. Beginnen Sie mit der Zieldaten- und Abfrageverteilung:</p>
<ul>
<li>Verwenden Sie TokenANN als qualitätsorientierte Baseline, wenn die Datensatzgröße es erlaubt.</li>
<li>Probieren Sie MUVERA aus, wenn TokenANNs Index oder Kandidatengewinnung mit wachsender Listengröße zu teuer wird und Sie eine Trainingspipeline vermeiden möchten.</li>
<li>Bewerten Sie LEMUR, wenn der Embedding-Raum verrauscht oder schwach diskriminativ ist oder wenn der Workload visuell oder multimodal ist.</li>
<li>Messen Sie Recall oder nDCG zusammen mit Latenz und Indexgröße. Eine Strategie, die für kurze Texte funktioniert, kann sich bei langen Dokumentlängen oder Tausenden visueller Patches anders verhalten.</li>
</ul>
<p>StructArray löst ein Problem: wie man ausgerichtete, filterbare, vektortragende Elemente innerhalb einer einzelnen Entität darstellt. Die EmbeddingList-Strategie löst ein anderes: wie man MaxSim zu akzeptablen Kosten für ein bestimmtes Modell und einen bestimmten Korpus approximiert.</p>
<h2 id="Hybrid-search-makes-result-identity-explicit" class="common-anchor-header">Hybrid-Suche macht die Ergebnisidentität explizit<button data-href="#Hybrid-search-makes-result-identity-explicit" class="anchor-icon" translate="no">
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
    </button></h2><p>Produktionsnahes Retrieval folgt selten einem einzigen Vektorpfad. Eine Videoanfrage kann ein Top-Level-Video-Embedding, ein oder mehrere Clip-Level-Embeddings, ein Bildunterschriften- oder Transkriptsignal und einen Reranker kombinieren.</p>
<p>Sobald Kandidaten auf Elementebene in diese Pipeline gelangen, muss die Engine entscheiden, was einen endgültigen Kandidaten identifiziert.</p>
<table>
<thead>
<tr><th>Zusammensetzung der Hybrid-Anfrage</th><th>Bereich des endgültigen Kandidaten</th><th>Ergebnisidentität</th></tr>
</thead>
<tbody>
<tr><td>Alle Teil-Suchen sind auf Elementebene und zielen auf Vektor-Unterfelder unter demselben StructArray</td><td>Elementebene</td><td>Primärschlüssel plus StructArray-Feld plus Element-Offset</td></tr>
<tr><td>Ein Top-Level-Vektorfeld ist enthalten</td><td>Entitätsebene</td><td>Primärschlüssel</td></tr>
<tr><td>Eine EmbeddingList-Anfrage ist enthalten</td><td>Entitätsebene</td><td>Primärschlüssel</td></tr>
<tr><td>Element-Level-Anfragen zielen auf verschiedene StructArray-Felder</td><td>Entitätsebene</td><td>Primärschlüssel</td></tr>
</tbody>
</table>
<p>Die erste Konfiguration bewahrt die Elementidentität, weil Offset <code translate="no">3</code> für jede Teil-Suche unter einem gegebenen übergeordneten StructArray auf dasselbe Struct-Element verweist. Das passt zu einer Anwendung, die nach der Fusion mehrerer Element-Level-Signale den relevantesten Clip oder die relevanteste Passage zurückgeben möchte.</p>
<p>Die anderen Konfigurationen mischen Kandidatengranularitäten oder Element-Namensräume. Ein Element-Treffer muss daher vor dem endgültigen Reranking zu einem Score auf Entitätsebene kollabiert werden. Milvus unterstützt mehrere Kollaps-Strategien:</p>
<table>
<thead>
<tr><th>Kollaps-Strategie</th><th>Entitäts-Score aus den zurückgegebenen Element-Treffern</th><th>Wichtige Bedingung</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">max</code></td><td>Bester Element-Score</td><td>Funktioniert mit unterstützten regulären Vektor-Metriken</td></tr>
<tr><td><code translate="no">sum</code></td><td>Summe aller zurückgegebenen Element-Scores</td><td>Mit positiv korrelierten Metriken wie <code translate="no">IP</code> oder <code translate="no">COSINE</code> verwenden</td></tr>
<tr><td><code translate="no">avg</code></td><td>Durchschnitt der zurückgegebenen Element-Scores</td><td>Funktioniert mit unterstützten regulären Vektor-Metriken</td></tr>
<tr><td><code translate="no">topk_sum</code></td><td>Summe der besten <code translate="no">K</code> zurückgegebenen Element-Scores</td><td>Erfordert ein positives <code translate="no">topk</code>; mit <code translate="no">IP</code> oder <code translate="no">COSINE</code> verwenden</td></tr>
<tr><td><code translate="no">topk_avg</code></td><td>Durchschnitt der besten <code translate="no">K</code> zurückgegebenen Element-Scores</td><td>Erfordert ein positives <code translate="no">topk</code></td></tr>
</tbody>
</table>
<p>Der Kollaps arbeitet nur auf den Element-Treffern, die von dieser ANN-Teil-Suche zurückgegeben werden; er scannt nicht jedes Element in der Entität nach dem Abruf. Das <code translate="no">limit</code> der Anfrage steuert daher, welche Element-Treffer der Kollaps-Funktion zur Verfügung stehen.</p>
<p>Diese Wahl prägt die Retrieval-Semantik, nicht nur die Ausgabeformatierung. Wenn die Anwendung einen Clip oder eine Passage präsentiert, ist es natürlich, den Offset durch die Fusion zu bewahren. Wenn sie ein Video, Produkt oder Dokument präsentiert, ist der Kollaps auf Entitätsebene natürlich. Wenn Signale auf unterschiedlichen Granularitätsebenen arbeiten, benötigt das System eine explizite Element-zu-Entität-Bewertungsregel.</p>
<p>StructArray verschiebt dieses Identitäts- und Kollaps-Problem von ad hoc Nachbearbeitung in das Suchausführungsmodell.</p>
<h2 id="How-Milvus-executes-StructArray-without-treating-it-as-a-blob" class="common-anchor-header">Wie Milvus StructArray ausführt, ohne es als Blob zu behandeln<button data-href="#How-Milvus-executes-StructArray-without-treating-it-as-a-blob" class="anchor-icon" translate="no">
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
    </button></h2><p>Das benutzerseitige Modell ist <code translate="no">ARRAY&lt;STRUCT&gt;</code>. Den gesamten Wert jedoch als einen undurchsichtigen Blob zu speichern, würde Unterfeld-Indizes, Filterung und selektive Ausgabe ineffizient machen.</p>
<p>Milvus verwendet ein Design mit logischem Elternfeld und physischen Kind-Spalten.</p>
<p>Auf Schemaebene ist <code translate="no">clips</code> das logische Elternfeld. Es definiert Eigenschaften wie das Struct-Schema, die maximale Kapazität und die Nullbarkeit. Seine Unterfelder werden in Pfade wie <code translate="no">clips[clip_embedding_list]</code>, <code translate="no">clips[clip_embedding]</code>, <code translate="no">clips[scene_type]</code> und <code translate="no">clips[label_confidence]</code> normalisiert.</p>
<p>Skalar-Unterfelder folgen pro Entität den Speicherpfaden für Skalar-Arrays, während Vektor-Unterfelder den Pfaden für Vektor-Arrays folgen. Jedes Unterfeld kann dann den für seinen Typ geeigneten Datenpfad nutzen: Skalar-Filterung und Skalar-Indizes für Metadaten, Vektor-Indizes und ANN-Suche für Embeddings.</p>
<p>Beim Ingest expandiert der Proxy die verschachtelte Struct-Liste in typisierte Kind-Spalten. Während der Ausführung hält Milvus die Beziehung zwischen jedem physischen Element und seiner übergeordneten Entität aufrecht. Konzeptionell sieht diese Beziehung so aus:</p>
<pre><code translate="no">Plaintext
entity 0 -&gt; elements [0, 1, 2]
entity 1 -&gt; elements [3]
entity 2 -&gt; elements []
entity 3 -&gt; elements [4, 5, 6, 7]
<button class="copy-code-btn"></button></code></pre>
<p>Wenn die Suche auf Elementebene eine physische Element-ID zurückgibt, bildet Milvus sie auf die übergeordnete Entität und den Element-Offset ab. Wenn <code translate="no">element_filter</code> eine Bitmap auf Elementebene erzeugt, richtet die Engine sie mit Sichtbarkeit der übergeordneten Entität, Löschungen und anderen Filtern ab.</p>
<p>Beim Zurückgeben von Ergebnissen verwendet Milvus das logische Schema und gemeinsame Offsets, um die StructArray-Form zu rekonstruieren, die die Anwendung eingefügt hat. Das System kann über typisierte Kind-Spalten ausführen, während die Benutzerin weiterhin natürliche verschachtelte Objekte liest und schreibt. Dieses physische Layout macht StructArray zu mehr als typisiertem JSON: Die verschachtelte Beziehung nimmt am Index- und Ausführungsmodell teil.</p>
<h2 id="Where-StructArray-fits-and-where-it-does-not" class="common-anchor-header">Wo StructArray passt – und wo nicht<button data-href="#Where-StructArray-fits-and-where-it-does-not" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArray ist eine gute Wahl, wenn alle folgenden Punkte zutreffen:</p>
<ul>
<li>Die Anwendung hat eine bedeutungsvolle übergeordnete Entität, wie ein Video, Produkt, Dokument, eine visuelle Seite oder einen Speichereintrag.</li>
<li>Jede übergeordnete Entität enthält eine geordnete Menge variabler Länge von lokalen Elementen.</li>
<li>Diese Elemente benötigen eigene skalare Metadaten, Vektoren oder beides.</li>
<li>Suche oder Filterung muss die Beziehung zwischen Unterfeldern beim selben Element-Offset bewahren.</li>
<li>Die Anwendung benötigt Multi-Vektor-Retrieval auf Entitätsebene, Treffer auf Elementebene oder beides.</li>
</ul>
<p>StructArray ist nicht automatisch für jede Collection besser. Ein kurzes Dokument oder eine einfache Abfrage kann mit einem einzigen dichten Embedding gut bedient sein. Multi-Vektor-Indizierung fügt Speicher- und Suchkosten hinzu, daher sollte die zusätzliche Repräsentation ihren Platz durch verbesserte Retrieval-Qualität oder nützlichere Ergebnisgranularität verdienen.</p>
<p>Auch die aktuellen Schema- und Ausführungsgrenzen sind wichtig:</p>
<ul>
<li><code translate="no">Struct</code> wird als Elementtyp eines <code translate="no">Array</code> unterstützt, nicht als Top-Level-Collection-Feld.</li>
<li>Alle Elemente in einem StructArray teilen sich ein vordefiniertes Schema.</li>
<li><code translate="no">max_capacity</code> ist erforderlich und begrenzt die Anzahl der Elemente pro Entität.</li>
<li>Verschachtelte <code translate="no">Struct</code>-, <code translate="no">Array</code>-, <code translate="no">ArrayOfStruct</code>- und <code translate="no">JSON</code>-Unterfelder werden innerhalb eines StructArray nicht unterstützt.</li>
<li>Ein Vektor-Unterfeld akzeptiert einen Index. Verwenden Sie getrennte Vektor-Unterfelder für EmbeddingList- und Element-Level-Suche, wenn beide benötigt werden.</li>
<li>Vektor-Unterfelder müssen vor der Suche indiziert werden. Skalar-Unterfelder, die stark in Filtern verwendet werden, sollten angemessen indiziert werden.</li>
<li>Das Unterfeld-Schema ist nach der Erstellung des StructArray-Felds festgelegt. Planen Sie die Elementattribute daher vor dem Produktions-Rollout.</li>
</ul>
<p>Diese Einschränkungen machen das Modell enger als die beliebige Verschachtelung einer Dokumentdatenbank, geben Milvus aber genug Struktur, um über Elementidentität zu argumentieren, jedes Unterfeld zu indizieren und auf zwei Suchgranularitäten auszuführen.</p>
<h2 id="StructArray-keeps-local-evidence-first-class-without-losing-the-entity" class="common-anchor-header">StructArray macht lokale Evidenz erstklassig, ohne die Entität zu verlieren<button data-href="#StructArray-keeps-local-evidence-first-class-without-losing-the-entity" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArray gibt Milvus ein Retrieval-Objekt, das flache Schemata nur schwer darstellen können: eine übergeordnete Entität mit einer geordneten Menge strukturierter Elemente. Die Beziehungen zwischen diesen Elementen nehmen an Filterung, Indizierung und Suche teil, statt nur im Speicher zu existieren.</p>
<p>Jedes Element behält seine eigenen Metadaten und Embeddings. Die Elemente können Skalar-Prädikate auf demselben Element erfüllen, gemeinsam an der EmbeddingList-Suche auf Entitätsebene teilnehmen oder unabhängig in der Suche auf Elementebene konkurrieren. Gleichzeitig bleiben sie an die übergeordnete Entität gebunden, deren Metadaten, Berechtigungen und Anwendungsidentität ihnen Kontext geben.</p>
<p>Für Video-Clips, Produktbilder, Dokumentpassagen, visuelle Patches und Speicherfragmente kann lokale Evidenz durchsucht und gefiltert werden, ohne die Entität zu verlieren, zu der sie gehört. Die verbleibenden Designentscheidungen sind explizit: Wählen Sie die Suchgranularität, geben Sie jedem Vektor-Unterfeld die passende Metrik und den passenden Index, und entscheiden Sie, ob Hybrid-Ergebnisse Element-Offsets bewahren oder zu Entitäten kollabieren sollen.</p>
<h2 id="Try-StructArray-in-Milvus-30" class="common-anchor-header">StructArray in Milvus 3.0 ausprobieren<button data-href="#Try-StructArray-in-Milvus-30" class="anchor-icon" translate="no">
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
    </button></h2><p>StructArray ist in Milvus 3.0 verfügbar. Beginnen Sie mit der <a href="https://milvus.io/docs/array-of-structs.md">StructArray-Übersicht</a>. Wenn Sie Multi-Vektor-Retrieval auf Entitätsebene evaluieren, lesen Sie den <a href="https://milvus.io/docs/choose-an-embeddinglist-search-strategy.md">EmbeddingList-Strategieleitfaden</a>. Für Ergebnisgranularität und Kollaps-Verhalten siehe <a href="https://milvus.io/docs/hybrid-search-with-structarray.md">Hybrid Search mit StructArray</a>.</p>
<p>Für den breiteren Release-Kontext siehe den <a href="https://milvus.io/blog/announcing-milvus-3-lake-native-vector-search-and-a-more-powerful-retrieval-engine.md">Milvus-3.0-Launch-Blog</a>, die <a href="https://milvus.io/docs/release_notes.md">Release Notes</a> und das <a href="https://github.com/milvus-io/milvus">milvus-io/milvus-Repository</a>.</p>
<p><a href="https://zilliz.com/">Zilliz Cloud</a> unterstützt ebenfalls StructArray- und EmbeddingList-Suche für verwaltete Deployments. Prüfen Sie den <a href="https://docs.zilliz.com/docs/use-array-of-structs">Zilliz-Cloud-StructArray-Leitfaden</a> für dienstspezifische Grenzen. In Zilliz Cloud sind Skalar-Operatoren auf StructArray derzeit für On-Demand-Cluster dokumentiert.</p>
<p>Um ein Schema- oder Retrieval-Design mit dem Team zu besprechen, treten Sie der <a href="https://discord.com/invite/8uyFbECzPX">Milvus-Discord-Community</a> bei oder buchen Sie eine <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting">Milvus-Office-Hours</a>-Sitzung.</p>
