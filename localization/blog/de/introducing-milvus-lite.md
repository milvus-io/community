---
id: introducing-milvus-lite.md
title: >-
  Wir stellen vor: Milvus Lite: Erstellen Sie in Sekundenschnelle eine
  GenAI-Anwendung
author: Jiang Chen
date: 2024-05-30T00:00:00.000Z
cover: assets.zilliz.com/introducing_Milvus_Lite_76ed4baf75.jpeg
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  GenAI developers, Retrieval Augmented Generation, RAG
recommend: true
canonicalUrl: 'https://milvus.io/blog/introducing-milvus-lite.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_72e444c8dc.JPG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Wir freuen uns, <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> vorstellen zu können, eine leichtgewichtige Vektordatenbank, die lokal in Ihrer Python-Anwendung läuft. Basierend auf der beliebten Open-Source-Vektordatenbank <a href="https://milvus.io/intro">Milvus</a> verwendet Milvus Lite die Kernkomponenten für die Vektorindizierung und das Parsen von Abfragen wieder, entfernt aber Elemente, die für eine hohe Skalierbarkeit in verteilten Systemen ausgelegt sind. Dieses Design macht aus Milvus Lite eine kompakte und effiziente Lösung, die sich ideal für Umgebungen mit begrenzten Rechenressourcen eignet, wie z. B. Laptops, Jupyter Notebooks und mobile oder Edge-Geräte.</p>
<p>Milvus Lite lässt sich in verschiedene KI-Entwicklungsstacks wie LangChain und LlamaIndex integrieren und kann so als Vektorspeicher in Retrieval Augmented Generation (RAG)-Pipelines verwendet werden, ohne dass ein Server eingerichtet werden muss. Führen Sie einfach <code translate="no">pip install pymilvus</code> (Version 2.4.3 oder höher) aus, um es als Python-Bibliothek in Ihre KI-Anwendung einzubinden.</p>
<p>Milvus Lite nutzt die Milvus-API und stellt sicher, dass Ihr clientseitiger Code sowohl für kleine lokale Implementierungen als auch für Milvus-Server, die auf Docker oder Kubernetes mit Milliarden von Vektoren bereitgestellt werden, funktioniert.</p>
<h2 id="Why-We-Built-Milvus-Lite" class="common-anchor-header">Warum wir Milvus Lite entwickelt haben<button data-href="#Why-We-Built-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Viele KI-Anwendungen benötigen eine vektorielle Ähnlichkeitssuche für unstrukturierte Daten, einschließlich Text, Bilder, Stimmen und Videos, für Anwendungen wie Chatbots und Einkaufsassistenten. Vektordatenbanken werden zum Speichern und Durchsuchen von Vektoreinbettungen entwickelt und sind ein wichtiger Teil des KI-Entwicklungsstapels, insbesondere für generative KI-Anwendungsfälle wie <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval Augmented Generation (RAG)</a>.</p>
<p>Trotz der Verfügbarkeit zahlreicher Lösungen für die Vektorsuche fehlte eine einfach zu startende Option, die auch für groß angelegte Produktionseinsätze geeignet ist. Als Entwickler von Milvus haben wir Milvus Lite entwickelt, um KI-Entwicklern zu helfen, Anwendungen schneller zu erstellen und gleichzeitig eine konsistente Erfahrung über verschiedene Bereitstellungsoptionen hinweg zu gewährleisten, einschließlich Milvus auf Kubernetes, Docker und verwalteten Cloud-Diensten.</p>
<p>Milvus Lite ist eine wichtige Ergänzung unserer Angebotspalette innerhalb des Milvus-Ökosystems. Es bietet Entwicklern ein vielseitiges Tool, das jede Phase ihrer Entwicklungsreise unterstützt. Vom Prototyping bis hin zu Produktionsumgebungen und vom Edge Computing bis hin zu groß angelegten Implementierungen ist Milvus jetzt die einzige Vektordatenbank, die Anwendungsfälle jeder Größe und aller Entwicklungsphasen abdeckt.</p>
<h2 id="How-Milvus-Lite-Works" class="common-anchor-header">Wie Milvus Lite funktioniert<button data-href="#How-Milvus-Lite-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Lite unterstützt alle in Milvus verfügbaren grundlegenden Operationen wie das Erstellen von Sammlungen und das Einfügen, Suchen und Löschen von Vektoren. In Kürze wird es auch erweiterte Funktionen wie die hybride Suche unterstützen. Milvus Lite lädt Daten in den Speicher, um eine effiziente Suche zu ermöglichen, und speichert sie in einer SQLite-Datei.</p>
<p>Milvus Lite ist im <a href="https://github.com/milvus-io/pymilvus">Python-SDK von Milvus</a> enthalten und kann mit einem einfachen <code translate="no">pip install pymilvus</code> bereitgestellt werden. Das folgende Codeschnipsel zeigt, wie man eine Vektordatenbank mit Milvus Lite einrichtet, indem man einen lokalen Dateinamen angibt und dann eine neue Sammlung erstellt. Für diejenigen, die mit der Milvus-API vertraut sind, besteht der einzige Unterschied darin, dass <code translate="no">uri</code> sich auf einen lokalen Dateinamen statt auf einen Netzwerkendpunkt bezieht, z. B. <code translate="no">&quot;milvus_demo.db&quot;</code> statt <code translate="no">&quot;http://localhost:19530&quot;</code> für einen Milvus-Server. Alles andere bleibt gleich. Milvus Lite unterstützt auch die Speicherung von Rohtext und anderen Bezeichnungen als Metadaten, wobei ein dynamisches oder explizit definiertes Schema verwendet wird, wie unten gezeigt.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(<span class="hljs-string">&quot;milvus_demo.db&quot;</span>)
<span class="hljs-comment"># This collection can take input with mandatory fields named &quot;id&quot;, &quot;vector&quot; and</span>
<span class="hljs-comment"># any other fields as &quot;dynamic schema&quot;. You can also define the schema explicitly.</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    dimension=<span class="hljs-number">384</span>  <span class="hljs-comment"># Dimension for vectors.</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Um die Skalierbarkeit zu gewährleisten, kann eine mit Milvus Lite entwickelte KI-Anwendung problemlos auf Milvus umgestellt werden, das auf Docker oder Kubernetes bereitgestellt wird, indem einfach die <code translate="no">uri</code> mit dem Server-Endpunkt angegeben wird.</p>
<h2 id="Integration-with-AI-Development-Stack" class="common-anchor-header">Integration in den KI-Entwicklungsstapel<button data-href="#Integration-with-AI-Development-Stack" class="anchor-icon" translate="no">
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
    </button></h2><p>Zusätzlich zur Einführung von Milvus Lite, um den Einstieg in die Vektorsuche zu erleichtern, integriert sich Milvus auch mit vielen Frameworks und Anbietern des KI-Entwicklungsstacks, darunter <a href="https://python.langchain.com/v0.2/docs/integrations/vectorstores/milvus/">LangChain</a>, <a href="https://docs.llamaindex.ai/en/stable/examples/vector_stores/MilvusIndexDemo/">LlamaIndex</a>, <a href="https://haystack.deepset.ai/integrations/milvus-document-store">Haystack</a>, <a href="https://blog.voyageai.com/2024/05/30/semantic-search-with-milvus-lite-and-voyage-ai/">Voyage AI</a>, <a href="https://milvus.io/docs/integrate_with_ragas.md">Ragas</a>, <a href="https://jina.ai/news/implementing-a-chat-history-rag-with-jina-ai-and-milvus-lite/">Jina AI</a>, <a href="https://dspy-docs.vercel.app/docs/deep-dive/retrieval_models_clients/MilvusRM">DSPy</a>, <a href="https://www.bentoml.com/blog/building-a-rag-app-with-bentocloud-and-milvus-lite">BentoML</a>, <a href="https://chiajy.medium.com/70873c7576f1">WhyHow</a>, <a href="https://blog.relari.ai/case-study-using-synthetic-data-to-benchmark-rag-systems-be324904ace1">Relari AI</a>, <a href="https://docs.airbyte.com/integrations/destinations/milvus">Airbyte</a>, <a href="https://milvus.io/docs/integrate_with_hugging-face.md">HuggingFace</a> und <a href="https://memgpt.readme.io/docs/storage#milvus">MemGPT</a>. Dank ihrer umfangreichen Tools und Dienste vereinfachen diese Integrationen die Entwicklung von KI-Anwendungen mit Vektorsuchfunktionen.</p>
<p>Und das ist erst der Anfang - viele weitere spannende Integrationen werden in Kürze folgen! Bleiben Sie dran!</p>
<h2 id="More-Resources-and-Examples" class="common-anchor-header">Weitere Ressourcen und Beispiele<button data-href="#More-Resources-and-Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>In der <a href="https://milvus.io/docs/quickstart.md">Milvus-Schnellstartdokumentation</a> finden Sie ausführliche Anleitungen und Code-Beispiele zur Verwendung von Milvus Lite für die Entwicklung von KI-Anwendungen wie Retrieval-Augmented Generation<a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/build_RAG_with_milvus.ipynb">(RAG</a>) und <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/image_search_with_milvus.ipynb">Bildsuche</a>.</p>
<p>Milvus Lite ist ein Open-Source-Projekt, und wir freuen uns über Ihre Beiträge. Schauen Sie sich unseren <a href="https://github.com/milvus-io/milvus-lite/blob/main/CONTRIBUTING.md">Contributing Guide</a> an, um loszulegen. Sie können auch Fehler melden oder neue Funktionen anfordern, indem Sie im <a href="https://github.com/milvus-io/milvus-lite">GitHub-Repository von Milvus Lite</a> einen Fehler melden.</p>
