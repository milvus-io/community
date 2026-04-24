---
id: hermes-agent-learning-loop-milvus-hybrid-search.md
title: Behebung der Lernschleife des Hermes-Agenten mit Milvus 2.6 Hybrid Search
author: Min Yin
date: 2026-4-24
cover: >-
  assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_2_e0b44ee562.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Hermes Agent, Milvus 2.6, hybrid search, agent memory, skill learning loop'
meta_title: |
  How to Fix Hermes Agent's Learning Loop with Milvus 2.6 Hybrid Search
desc: >-
  Die Lernschleife des Hermes-Agenten schreibt Fähigkeiten aus dem Gebrauch,
  aber sein FTS5-Retriever verpasst umformulierte Abfragen. Die hybride Suche
  von Milvus 2.6 behebt den sitzungsübergreifenden Rückruf.
origin: 'https://milvus.io/blog/hermes-agent-learning-loop-milvus-hybrid-search.md'
---
<p><a href="https://github.com/NousResearch/hermes-agent"><strong>Hermes Agent</strong></a> <strong>war in letzter Zeit überall zu sehen.</strong> Hermes wurde von Nous Research entwickelt und ist ein selbst gehosteter persönlicher KI-Agent, der auf Ihrer eigenen Hardware läuft (ein VPS für 5 US-Dollar reicht aus) und mit Ihnen über bestehende Chat-Kanäle wie Telegram kommuniziert.</p>
<p><strong>Sein größtes Highlight ist eine integrierte Lernschleife:</strong> Die Schleife erstellt Skills aus Erfahrung, verbessert sie während der Nutzung und durchsucht vergangene Konversationen, um wiederverwendbare Muster zu finden. Andere Agenten-Frameworks kodieren Skills vor dem Einsatz von Hand. Die Skills von Hermes wachsen mit der Nutzung, und wiederholte Arbeitsabläufe werden ohne Codeänderung wiederverwendbar.</p>
<p><strong>Der Haken an der Sache ist, dass Hermes nur Schlüsselwörter abruft.</strong> Es werden exakte Wörter gefunden, aber nicht die Bedeutung, die der Benutzer sucht. Wenn Benutzer in verschiedenen Sitzungen unterschiedliche Formulierungen verwenden, kann die Schleife sie nicht miteinander verbinden, und es wird keine neue Fertigkeit geschrieben. Wenn es nur ein paar hundert Dokumente gibt, ist die Lücke tolerierbar. <strong>Danach hört die Schleife auf zu lernen, weil sie ihre eigene Geschichte nicht mehr finden kann.</strong></p>
<p><strong>Die Lösung ist Milvus 2.6.</strong> Seine <a href="https://milvus.io/docs/multi-vector-search.md">hybride Suche</a> deckt sowohl die Bedeutung als auch exakte Schlüsselwörter in einer einzigen Abfrage ab, so dass die Schleife endlich umformulierte Informationen über mehrere Sitzungen hinweg verbinden kann. Es ist leicht genug, um auf einen kleinen Cloud-Server zu passen (auf einem VPS für 5 $/Monat läuft es). Der Austausch erfordert keine Änderung von Hermes - Milvus wird hinter die Abrufschicht geschoben, so dass die Lernschleife intakt bleibt. Hermes wählt immer noch aus, welcher Skill ausgeführt werden soll, und Milvus kümmert sich darum, was abgerufen werden soll.</p>
<p>Aber der tiefere Nutzen geht über eine bessere Erinnerung hinaus: Sobald der Abruf funktioniert, kann die Lernschleife die Abrufstrategie selbst als Fähigkeit speichern - nicht nur den Inhalt, den sie abruft. Auf diese Weise wird das Wissen des Agenten sitzungsübergreifend zusammengeführt.</p>
<h2 id="Hermes-Agent-Architecture-How-Four-Layer-Memory-Powers-the-Skill-Learning-Loop" class="common-anchor-header">Hermes-Agent-Architektur: Wie der vierschichtige Speicher die Skill-Lernschleife antreibt<button data-href="#Hermes-Agent-Architecture-How-Four-Layer-Memory-Powers-the-Skill-Learning-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/NousResearch/hermes-agent"><strong>Hermes</strong></a> <strong>hat vier Speicherschichten, und L4 Skills ist diejenige, die ihn auszeichnet.</strong></p>
<ul>
<li><strong>L1</strong> - Sitzungskontext, der bei Beendigung der Sitzung gelöscht wird</li>
<li><strong>L2</strong> - persistierte Fakten: Projektstapel, Teamkonventionen, getroffene Entscheidungen</li>
<li><strong>L3</strong> - SQLite FTS5 Schlüsselwortsuche über lokale Dateien</li>
<li><strong>L4</strong> - speichert Arbeitsabläufe als Markdown-Dateien. Im Gegensatz zu LangChain-Tools oder AutoGPT-Plugins, die von den Entwicklern vor der Bereitstellung in Code verfasst werden, sind die L4-Fähigkeiten selbst geschrieben: Sie entstehen aus dem, was der Agent tatsächlich ausführt, ohne dass der Entwickler sie verfasst.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_3_3653368e99.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-Hermess-FTS5-Keyword-Retrieval-Breaks-the-Learning-Loop" class="common-anchor-header">Warum das FTS5-Schlüsselwort-Retrieval von Hermes die Lernschleife durchbricht<button data-href="#Why-Hermess-FTS5-Keyword-Retrieval-Breaks-the-Learning-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hermes benötigt das Retrieval, um sitzungsübergreifende Workflows auszulösen.</strong> Die eingebaute L3-Schicht verwendet jedoch SQLite FTS5, das nur wörtliche Token abgleicht, nicht aber die Bedeutung.</p>
<p><strong>Wenn Benutzer dieselbe Absicht in verschiedenen Sitzungen unterschiedlich formulieren, verfehlt FTS5 die Übereinstimmung.</strong> Die Lernschleife wird nicht ausgelöst. Es wird kein neuer Skill geschrieben, und beim nächsten Mal, wenn die Absicht auftaucht, muss der Benutzer wieder von Hand routen.</p>
<p>Beispiel: Die Wissensbasis speichert "asyncio event loop, async task scheduling, non-blocking I/O". Ein Benutzer sucht nach "Python Gleichzeitigkeit". FTS5 liefert null Treffer - keine wörtliche Wortüberschneidung, und FTS5 hat keine Möglichkeit zu erkennen, dass es sich um dieselbe Frage handelt.</p>
<p>Bei weniger als ein paar hundert Dokumenten ist die Lücke tolerierbar. Darüber hinaus wird in der Dokumentation ein Vokabular verwendet, während die Benutzer in einem anderen Vokabular fragen, und FTS5 hat keine Möglichkeit, eine Brücke zwischen beiden zu schlagen. <strong>Unauffindbare Inhalte könnten genauso gut gar nicht in der Wissensbasis vorhanden sein, und die Lernschleife hat nichts, woraus sie lernen könnte.</strong></p>
<h2 id="How-Milvus-26-Fixes-the-Retrieval-Gap-with-Hybrid-Search-and-Tiered-Storage" class="common-anchor-header">Wie Milvus 2.6 die Abfragelücke mit hybrider Suche und abgestufter Speicherung behebt<button data-href="#How-Milvus-26-Fixes-the-Retrieval-Gap-with-Hybrid-Search-and-Tiered-Storage" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Milvus 2.6 bringt zwei Upgrades, die die Schwachstellen von Hermes beheben.</strong> Die <strong>hybride Suche</strong> entblockiert die Lernschleife, indem sie sowohl die semantische Suche als auch die Suche nach Schlüsselwörtern in einem Aufruf abdeckt. <strong>Tiered Storage</strong> hält das gesamte Retrieval-Backend klein genug, um auf demselben VPS für $5/Monat zu laufen, für den Hermes entwickelt wurde.</p>
<h3 id="What-Hybrid-Search-Solves-Finding-Relevant-Information" class="common-anchor-header">Was Hybrid Search löst: Auffinden relevanter Informationen</h3><p>Milvus 2.6 unterstützt die Ausführung von Vektor-Retrieval (semantisch) und <a href="https://milvus.io/docs/full-text-search.md">BM25-Volltextsuche</a> (Stichwort) in einer einzigen Abfrage und führt dann die beiden Ranglisten mit <a href="https://milvus.io/docs/multi-vector-search.md">Reciprocal Rank Fusion (RRF)</a> zusammen.</p>
<p>Beispiel: Fragen Sie &quot;Was ist das Prinzip von asyncio&quot;, und Vektorretrieval findet semantisch verwandte Inhalte. Fragen Sie &quot;Wo ist die Funktion <code translate="no">find_similar_task</code> definiert?&quot;, und BM25 findet genau den Funktionsnamen im Code. Bei Fragen, die eine Funktion innerhalb eines bestimmten Aufgabentyps betreffen, liefert die hybride Suche mit einem einzigen Aufruf das richtige Ergebnis, ohne dass die Routing-Logik von Hand geschrieben werden muss.</p>
<p>Für Hermes ist dies der Grund, warum die Lernschleife nicht mehr blockiert ist. Wenn eine zweite Sitzung die Absicht neu formuliert, findet die Vektorsuche die semantische Übereinstimmung, die FTS5 übersehen hat. Die Schleife wird ausgelöst, und ein neuer Skill wird geschrieben.</p>
<h3 id="What-Tiered-Storage-Solves-Cost" class="common-anchor-header">Was Tiered Storage löst: Kosten</h3><p>Eine naive Vektordatenbank würde den gesamten Einbettungsindex im Arbeitsspeicher benötigen, was dazu führt, dass persönliche Implementierungen eine größere, teurere Infrastruktur benötigen. Milvus 2.6 vermeidet dies durch eine dreistufige Speicherung, bei der die Einträge je nach Zugriffshäufigkeit zwischen den Schichten verschoben werden:</p>
<ul>
<li><strong>Hot</strong> - im Speicher</li>
<li><strong>Warm</strong> - auf SSD</li>
<li><strong>Kalt</strong> - auf Objektspeicher</li>
</ul>
<p>Nur heiße Daten bleiben resident. Eine Wissensdatenbank mit 500 Dokumenten passt unter 2 GB RAM. Der gesamte Retrieval-Stack läuft auf demselben VPS für 5 $/Monat, auf den Hermes abzielt, ohne dass ein Upgrade der Infrastruktur erforderlich ist.</p>
<h2 id="Hermes-+-Milvus-System-Architecture" class="common-anchor-header">Hermes + Milvus: Systemarchitektur<button data-href="#Hermes-+-Milvus-System-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hermes wählt aus, welcher Skill ausgeführt werden soll. Milvus kümmert sich darum, was abgerufen werden soll.</strong> Die beiden Systeme bleiben getrennt, und die Hermes-Schnittstelle ändert sich nicht.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_4_1794304940.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Der Ablauf:</strong></p>
<ol>
<li>Hermes identifiziert die Absicht des Benutzers und leitet ihn zu einem Skill weiter.</li>
<li>Der Skill ruft ein Abfrageskript über das Terminal-Tool auf.</li>
<li>Das Skript greift auf Milvus zu, führt eine hybride Suche durch und liefert gerankte Chunks mit Quellmetadaten zurück.</li>
<li>Hermes komponiert die Antwort. Der Speicher zeichnet den Arbeitsablauf auf.</li>
<li>Wenn sich dasselbe Muster über mehrere Sitzungen hinweg wiederholt, schreibt die Lernschleife einen neuen Skill.</li>
</ol>
<h2 id="How-to-Install-Hermes-and-Milvus-26" class="common-anchor-header">So installieren Sie Hermes und Milvus 2.6<button data-href="#How-to-Install-Hermes-and-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Installieren Sie Hermes und</strong> <a href="https://milvus.io/docs/install_standalone-docker.md"><strong>Milvus 2.6 Standalone</strong></a><strong> und erstellen Sie dann eine Sammlung mit dichten und BM25-Feldern.</strong> Das ist die vollständige Einrichtung, bevor die Lernschleife feuern kann.</p>
<h3 id="Install-Hermes" class="common-anchor-header">Hermes installieren</h3><pre><code translate="no" class="language-bash">curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
<button class="copy-code-btn"></button></code></pre>
<p>Führen Sie <code translate="no">hermes</code> aus, um den interaktiven Startassistenten zu starten:</p>
<ul>
<li><strong>LLM-Anbieter</strong> - OpenAI, Anthropic, OpenRouter (OpenRouter hat kostenlose Modelle)</li>
<li><strong>Kanal</strong> - dieses Walkthrough verwendet einen FLark-Bot</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_5_dceeae1519.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Run-Milvus-26-Standalone" class="common-anchor-header">Milvus 2.6 Standalone ausführen</h3><p>Für einen persönlichen Agenten reicht ein Einzelknotenstandalone aus:</p>
<pre><code translate="no" class="language-bash">curl -sfL https://raw.githubusercontent.com/milvus-io/milvus/master/scripts/standalone_embed.sh \
-o standalone_embed.sh
bash standalone_embed.sh start
<span class="hljs-comment"># Verify service status</span>
docker ps | grep milvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Create-the-Collection" class="common-anchor-header">Erstellen Sie die Sammlung</h3><p>Das Schema-Design begrenzt, was die Abfrage tun kann. Dieses Schema führt dichte Vektoren und spärliche BM25-Vektoren nebeneinander aus:</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType
client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>,
)
schema = client.create_schema(auto_id=<span class="hljs-literal">True</span>, enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-comment"># Raw text (for BM25 full-text search)</span>
schema.add_field(
    <span class="hljs-string">&quot;text&quot;</span>,
    DataType.VARCHAR,
    max_length=<span class="hljs-number">8192</span>,
    enable_analyzer=<span class="hljs-literal">True</span>,
    enable_match=<span class="hljs-literal">True</span>
)
<span class="hljs-comment"># Dense vector (semantic search)</span>
schema.add_field(<span class="hljs-string">&quot;dense_vector&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>)
<span class="hljs-comment"># Sparse vector (BM25 auto-generated, Milvus 2.6 feature)</span>
schema.add_field(<span class="hljs-string">&quot;sparse_vector&quot;</span>, DataType.SPARSE_FLOAT_VECTOR)
schema.add_field(<span class="hljs-string">&quot;source&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">512</span>)
schema.add_field(<span class="hljs-string">&quot;chunk_index&quot;</span>, DataType.INT32)
<span class="hljs-comment"># Tell Milvus to auto-convert text to sparse_vector via BM25</span>
bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;sparse_vector&quot;</span>],
)
schema.add_function(bm25_function)
index_params = client.prepare_index_params()
<span class="hljs-comment"># HNSW graph index (dense vector)</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;dense_vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;HNSW&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    params={<span class="hljs-string">&quot;M&quot;</span>: <span class="hljs-number">16</span>, <span class="hljs-string">&quot;efConstruction&quot;</span>: <span class="hljs-number">256</span>}
)
<span class="hljs-comment"># BM25 inverted index (sparse vector)</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;SPARSE_INVERTED_INDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>
)
client.create_collection(
    collection_name=<span class="hljs-string">&quot;hermes_milvus&quot;</span>,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_6_0646f46d36.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Hybrid-Search-Script" class="common-anchor-header">Hybrid Search Script</h3><pre><code translate="no" class="language-python"><span class="hljs-keyword">import</span> sys, json
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, AnnSearchRequest, RRFRanker

client = MilvusClient(<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>)
oai    = OpenAI()
COLLECTION = <span class="hljs-string">&quot;hermes_milvus&quot;</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">hybrid_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">dict</span>]:
    <span class="hljs-comment"># 1. Vectorize query</span>
    dense_vec = oai.embeddings.create(
        model=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>,
        <span class="hljs-built_in">input</span>=query
    ).data[<span class="hljs-number">0</span>].embedding

    <span class="hljs-comment"># 2. Dense vector retrieval (semantic relevance)</span>
    dense_req = AnnSearchRequest(
        data=[dense_vec],
        anns_field=<span class="hljs-string">&quot;dense_vector&quot;</span>,
        param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;ef&quot;</span>: <span class="hljs-number">128</span>}},
        limit=top_k * <span class="hljs-number">2</span>       <span class="hljs-comment"># Widen candidate set, let RRF do final ranking</span>
    )

    <span class="hljs-comment"># 3. BM25 sparse vector retrieval (exact term matching)</span>
    bm25_req = AnnSearchRequest(
        data=[query],
        anns_field=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
        param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>},
        limit=top_k * <span class="hljs-number">2</span>
    )

    <span class="hljs-comment"># 4. RRF fusion ranking</span>
    results = client.hybrid_search(
        collection_name=COLLECTION,
        reqs=[dense_req, bm25_req],
        ranker=RRFRanker(k=<span class="hljs-number">60</span>),
        limit=top_k,
        output_fields=[<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;doc_type&quot;</span>]
    )

    <span class="hljs-keyword">return</span> [
        {
            <span class="hljs-string">&quot;text&quot;</span>:     r.entity.get(<span class="hljs-string">&quot;text&quot;</span>),
            <span class="hljs-string">&quot;source&quot;</span>:   r.entity.get(<span class="hljs-string">&quot;source&quot;</span>),
            <span class="hljs-string">&quot;doc_type&quot;</span>: r.entity.get(<span class="hljs-string">&quot;doc_type&quot;</span>),
            <span class="hljs-string">&quot;score&quot;</span>:    <span class="hljs-built_in">round</span>(r.distance, <span class="hljs-number">4</span>)
        }
        <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]
    ]

<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    query= sys.argv[<span class="hljs-number">1</span>] <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(sys.argv) &gt; <span class="hljs-number">1</span> <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>
    top_k  = <span class="hljs-built_in">int</span>(sys.argv[<span class="hljs-number">2</span>]) <span class="hljs-keyword">if</span> <span class="hljs-built_in">len</span>(sys.argv) &gt; <span class="hljs-number">2</span> <span class="hljs-keyword">else</span> <span class="hljs-number">5</span>
    output = hybrid_search(query, top_k)
    <span class="hljs-built_in">print</span>(json.dumps(output, ensure_ascii=<span class="hljs-literal">False</span>, indent=<span class="hljs-number">2</span>))
<button class="copy-code-btn"></button></code></pre>
<p><strong>Die dichte Abfrage erweitert den Kandidatenpool um das Zweifache, so dass RRF genug zum Einordnen hat.</strong> <code translate="no">text-embedding-3-small</code> ist die billigste OpenAI-Einbettung, die immer noch Suchqualität bietet; tauschen Sie <code translate="no">text-embedding-3-large</code> aus, wenn es das Budget erlaubt.</p>
<p>Nachdem die Umgebung und die Wissensbasis fertig sind, wird im nächsten Abschnitt die Lernschleife auf die Probe gestellt.</p>
<h2 id="Hermes-Skill-Auto-Generation-in-Practice" class="common-anchor-header">Automatische Generierung von Hermes-Fähigkeiten in der Praxis<button data-href="#Hermes-Skill-Auto-Generation-in-Practice" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Zwei Sitzungen zeigen die Lernschleife in Aktion.</strong> In der ersten benennt der Benutzer das Skript von Hand. In der zweiten Sitzung wird die gleiche Frage gestellt, ohne das Skript zu benennen. Hermes greift das Muster auf und schreibt drei Skills.</p>
<h3 id="Session-1-Call-the-Script-by-Hand" class="common-anchor-header">Sitzung 1: Aufruf des Skripts von Hand</h3><p>Öffnen Sie Hermes in Lark. Geben Sie ihm den Skriptpfad und das Abrufziel. Hermes ruft das Terminal-Tool auf, führt das Skript aus und gibt die Antwort mit Quellenangabe zurück. <strong>Es existiert noch kein Skill. Dies ist ein einfacher Werkzeugaufruf.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_7_1c2d9261f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Session-2-Ask-Without-Naming-the-Script" class="common-anchor-header">Sitzung 2: Fragen ohne Nennung des Skripts</h3><p>Löschen Sie die Konversation. Beginnen Sie neu. Stellen Sie die gleiche Art von Frage, ohne das Skript oder den Pfad zu erwähnen.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_8_27253eda82.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Memory-Writes-First-Skill-Follows" class="common-anchor-header">Das Gedächtnis schreibt zuerst, die Fertigkeit folgt</h3><p><strong>Die Lernschleife zeichnet den Arbeitsablauf auf (Skript, Argumente, Rückgabeform) und gibt die Antwort zurück.</strong> Der Speicher hält die Spur fest; es gibt noch keine Fertigkeit.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_9_a0768f84bd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Die Übereinstimmung der zweiten Sitzung teilt der Schleife mit, dass das Muster beibehalten werden soll.</strong> Wenn sie ausgelöst wird, werden drei Skills geschrieben:</p>
<table>
<thead>
<tr><th>Skill</th><th>Rolle</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">hybrid-search-doc-qa</code></td><td>Durchführen einer hybriden semantischen + Schlüsselwortsuche im Speicher und Zusammenstellen der Antwort</td></tr>
<tr><td><code translate="no">milvus-docs-ingest-verification</code></td><td>Überprüfen, ob die Dokumente in die Wissensdatenbank aufgenommen wurden</td></tr>
<tr><td><code translate="no">terminal</code></td><td>Shell-Befehle ausführen: Skripte, Einrichten der Umgebung, Überprüfung</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_10_b68e35bc46.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Von diesem Punkt an <strong>hören die Benutzer auf, Skills zu benennen.</strong> Hermes erkennt die Absicht, leitet zum Skill weiter, holt die relevanten Chunks aus dem Speicher und schreibt die Antwort. In der Eingabeaufforderung gibt es keinen Skill-Selektor.</p>
<p>Die meisten RAG-Systeme (retrieval-augmented generation) lösen das Problem des Speicherns und Abrufens, aber die Abruflogik selbst ist im Anwendungscode fest kodiert. Fragt man auf eine andere Weise oder in einem neuen Szenario, bricht der Abruf ab. Hermes speichert die Abrufstrategie als Skill, d. h. <strong>der Abrufpfad wird zu einem Dokument, das Sie lesen, bearbeiten und versionieren können.</strong> Die Zeile <code translate="no">💾 Memory updated · Skill 'hybrid-search-doc-qa' created</code> ist keine Markierung für die vollständige Einrichtung. Es ist <strong>der Agent, der ein Verhaltensmuster im Langzeitgedächtnis festhält.</strong></p>
<h2 id="Hermes-vs-OpenClaw-Accumulation-vs-Orchestration" class="common-anchor-header">Hermes vs. OpenClaw: Akkumulation vs. Orchestrierung<button data-href="#Hermes-vs-OpenClaw-Accumulation-vs-Orchestration" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Hermes und OpenClaw lösen unterschiedliche Probleme.</strong> Hermes wurde für einen einzelnen Agenten entwickelt, der über mehrere Sitzungen hinweg Speicher und Fähigkeiten akkumuliert. OpenClaw wurde entwickelt, um eine komplexe Aufgabe in Stücke zu zerlegen und jedes Stück an einen spezialisierten Agenten zu übergeben.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hermes_agent_learning_loop_milvus_hybrid_search_md_11_afcb575d50.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Die Stärke von OpenClaw ist die Orchestrierung. Es optimiert, wie viel von einer Aufgabe automatisch erledigt wird. Die Stärke von Hermes ist die Akkumulation: ein einziger Agent, der sich über mehrere Sitzungen hinweg erinnert, mit Fähigkeiten, die durch die Nutzung wachsen. Hermes optimiert für den langfristigen Kontext und die Erfahrung in der Domäne.</p>
<p><strong>Die beiden Frameworks sind aufeinander abgestimmt.</strong> Hermes bietet einen einstufigen Migrationspfad, der <code translate="no">~/.openclaw</code> Speicher und Fähigkeiten in die Hermes-Speicherschichten zieht. Darüber kann ein Orchestrierungsstapel liegen, unter dem sich ein Akkumulationsagent befindet.</p>
<p>Für die OpenClaw-Seite der Aufteilung, siehe <a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">Was ist OpenClaw? Vollständiger Leitfaden für den Open-Source-KI-Agenten</a> im Milvus-Blog.</p>
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
    </button></h2><p>Die Lernschleife von Hermes verwandelt wiederholte Arbeitsabläufe in wiederverwendbare Fertigkeiten, aber nur, wenn die Abfrage sie über Sitzungen hinweg verbinden kann. Die FTS5-Schlüsselwortsuche kann das nicht. Die <a href="https://milvus.io/docs/multi-vector-search.md"><strong>hybride Suche von Milvus 2.6</strong></a> kann das: dichte Vektoren behandeln die Bedeutung, BM25 behandelt exakte Schlüsselwörter, RRF führt beides zusammen, und der <a href="https://milvus.io/docs/tiered-storage-overview.md">gestaffelte Speicher</a> hält den ganzen Stapel auf einem VPS für 5 $/Monat.</p>
<p>Der springende Punkt: Sobald die Suche funktioniert, speichert der Agent nicht nur bessere Antworten, sondern auch bessere Suchstrategien als Skills. Der Abrufpfad wird zu einem versionierbaren Dokument, das sich mit der Nutzung verbessert. Das unterscheidet einen Agenten, der Fachwissen anhäuft, von einem Agenten, der jede Sitzung neu beginnt. Einen Vergleich, wie andere Agenten mit diesem Problem umgehen (bzw. nicht damit umgehen), finden Sie unter <a href="https://milvus.io/blog/claude-code-memory-memsearch.md">Claude Code's Memory System Explained.</a></p>
<h2 id="Get-Started" class="common-anchor-header">Anfangen<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Probieren Sie die Werkzeuge in diesem Artikel aus:</strong></p>
<ul>
<li><a href="https://github.com/NousResearch/hermes-agent">Hermes Agent auf GitHub</a> - Installationsskript, Provider-Setup und die oben verwendete Kanalkonfiguration.</li>
<li><a href="https://milvus.io/docs/install_standalone-docker.md">Milvus 2.6 Standalone Quickstart</a> - Single-Node Docker Deployment für das Wissensdatenbank-Backend.</li>
<li><a href="https://milvus.io/docs/multi-vector-search.md">Milvus Hybrid Search Tutorial</a> - vollständiges Dense + BM25 + RRF Beispiel, das dem Skript in diesem Beitrag entspricht.</li>
</ul>
<p><strong>Haben Sie Fragen zu Hermes + Milvus Hybrid Search?</strong></p>
<ul>
<li>Treten Sie dem <a href="https://discord.gg/milvus">Milvus Discord</a> bei und fragen Sie nach hybrider Suche, Tiered Storage oder Skill-Routing-Mustern - andere Entwickler bauen ähnliche Stacks.</li>
<li><a href="https://milvus.io/community#office-hours">Buchen Sie eine Milvus-Sprechstunde</a>, um mit dem Milvus-Team Ihr eigenes Agent- und Wissensdatenbank-Setup durchzugehen.</li>
</ul>
<p><strong>Möchten Sie den Selbst-Host überspringen?</strong></p>
<ul>
<li><a href="https://cloud.zilliz.com/signup">Melden Sie sich bei</a> Zilliz Cloud<a href="https://cloud.zilliz.com/signup">an</a> oder <a href="https://cloud.zilliz.com/login">registrieren Sie sich dort</a> - verwaltetes Milvus mit hybrider Suche und abgestuftem Speicher. Neue Work-E-Mail-Konten erhalten ein <strong> kostenloses Guthaben in Höhe von 100 $</strong>.</li>
</ul>
<h2 id="Further-Reading" class="common-anchor-header">Weitere Informationen<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/docs/release_notes.md">Milvus 2.6 Release Notes</a> - Tiered Storage, hybride Suche, Schemaänderungen</li>
<li><a href="https://zilliz.com/blog">Zilliz Cloud &amp; Milvus CLI + Official Skills</a> - operative Werkzeuge für Milvus-native Agenten</li>
<li><a href="https://zilliz.com/blog">Warum Wissensmanagement im RAG-Stil für Agenten nicht funktioniert</a> - Argumente für agentenspezifisches Speicherdesign</li>
<li><a href="https://zilliz.com/blog">Das Speichersystem von Claude Code ist primitiver als erwartet</a> - ein Vergleich über den Speicherstapel eines anderen Agenten</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">Häufig gestellte Fragen<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-does-Hermes-Agents-Skill-Learning-Loop-actually-work" class="common-anchor-header">Wie funktioniert der Skill Learning Loop von Hermes Agent eigentlich?</h3><p>Hermes zeichnet jeden Arbeitsablauf, den es ausführt - das aufgerufene Skript, die übergebenen Argumente und die Rückgabeform - als Speicherprotokoll auf. Wenn dasselbe Muster in zwei oder mehr Sitzungen auftaucht, wird die Lernschleife ausgelöst und schreibt einen wiederverwendbaren Skill: eine Markdown-Datei, die den Workflow als wiederholbare Prozedur festhält. Von diesem Zeitpunkt an leitet Hermes allein aufgrund der Absicht zu dem Skill weiter, ohne dass der Benutzer ihn benennt. Die kritische Abhängigkeit ist der Abruf - die Schleife wird nur ausgelöst, wenn sie den Trace der früheren Sitzung finden kann, weshalb die reine Schlüsselwortsuche im großen Maßstab zum Engpass wird.</p>
<h3 id="Whats-the-difference-between-hybrid-search-and-vector-only-search-for-agent-memory" class="common-anchor-header">Was ist der Unterschied zwischen hybrider Suche und reiner Vektorsuche für den Agentenspeicher?</h3><p>Die reine Vektorsuche kommt mit Bedeutungen gut zurecht, verpasst aber exakte Übereinstimmungen. Wenn ein Entwickler einen Fehlerstring wie ConnectionResetError oder einen Funktionsnamen wie find_similar_task einfügt, könnte eine reine Vektorsuche semantisch verwandte, aber falsche Ergebnisse liefern. Die hybride Suche kombiniert dichte Vektoren (semantisch) mit BM25 (Stichwort) und führt die beiden Ergebnismengen mit Reciprocal Rank Fusion zusammen. Für den Agentenspeicher - wo Abfragen von vagen Absichten ("Python concurrency") bis hin zu exakten Symbolen reichen - deckt die hybride Suche beide Enden in einem einzigen Aufruf ohne Routing-Logik in Ihrer Anwendungsschicht ab.</p>
<h3 id="Can-I-use-Milvus-hybrid-search-with-AI-agents-other-than-Hermes" class="common-anchor-header">Kann ich die hybride Suche von Milvus auch mit anderen KI-Agenten als Hermes verwenden?</h3><p>Ja. Das Integrationsmuster ist generisch: Der Agent ruft ein Abfrageskript auf, das Skript fragt Milvus ab, und die Ergebnisse werden als gerankte Chunks mit Quellmetadaten zurückgegeben. Jedes Agenten-Framework, das Tool-Aufrufe oder Shell-Ausführung unterstützt, kann denselben Ansatz verwenden. Hermes eignet sich besonders gut, da seine Lernschleife speziell von der sitzungsübergreifenden Abfrage abhängt, aber die Milvus-Seite ist agentenunabhängig - sie weiß nicht, welcher Agent sie aufruft und kümmert sich nicht darum.</p>
<h3 id="How-much-does-a-self-hosted-Milvus-+-Hermes-setup-cost-per-month" class="common-anchor-header">Wie viel kostet ein selbstgehostetes Milvus + Hermes Setup pro Monat?</h3><p>Ein Single-Node Milvus 2.6 Standalone auf einem 2-Core / 4 GB VPS mit Tiered Storage kostet etwa <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>5/Monat</mi><mi mathvariant="normal">.</mi><mi>OpenAItext-embedding-3-smallcosts5/Monat</mi></mrow><annotation encoding="application/x-tex">.</annotation><annotation encoding="application/x-tex">OpenAI text-embedding-3-small kostet</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord mathnormal">5/Monat</span><span class="mord">.</span><span class="mord mathnormal">OpenAItext</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord mathnormal" style="margin-right:0.03588em;">embedding</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span> 3</span></span></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">-</span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span> <span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.6944em;"></span><span class="mord mathnormal">smallcosts0</span></span></span></span>.02 per 1M tokens - ein paar Cent pro Monat für eine persönliche Wissensbasis. Die LLM-Inferenz dominiert die Gesamtkosten und skaliert mit der Nutzung, nicht mit dem Abfragestapel.</p>
