---
id: data-in-and-data-out-in-milvus-2-6.md
title: >-
  Einführung in die Einbettungsfunktion: Wie Milvus 2.6 die Vektorisierung und
  semantische Suche rationalisiert
author: Xuqi Yang
date: 2025-12-03T00:00:00.000Z
cover: assets.zilliz.com/data_in_data_out_cover_0783504ea4.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, vector database, embedding, vector search'
meta_title: >
  Introducing the Embedding Function: How Milvus 2.6 Streamlines Vectorization
  and Semantic Search
desc: >-
  Entdecken Sie, wie Milvus 2.6 den Einbettungsprozess und die Vektorsuche mit
  Data-in, Data-out vereinfacht. Automatisches Einbetten und Reranking - keine
  externe Vorverarbeitung erforderlich.
origin: 'https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md'
---
<p>Wenn Sie schon einmal eine Vektorsuchanwendung entwickelt haben, kennen Sie den Arbeitsablauf nur zu gut. Bevor Daten gespeichert werden können, müssen sie zunächst mithilfe eines Einbettungsmodells in Vektoren umgewandelt, bereinigt und formatiert und schließlich in Ihre Vektordatenbank aufgenommen werden. Jede Abfrage durchläuft denselben Prozess: Einbetten der Eingabe, Durchführen einer Ähnlichkeitssuche und anschließendes Zuordnen der resultierenden IDs zu den ursprünglichen Dokumenten oder Datensätzen. Das funktioniert - aber es entsteht ein verteiltes Gewirr von Vorverarbeitungsskripten, Einbettungspipelines und Glue-Code, den Sie pflegen müssen.</p>
<p><a href="https://milvus.io/">Milvus</a>, eine hochleistungsfähige Open-Source-Vektordatenbank, macht jetzt einen großen Schritt in Richtung Vereinfachung all dessen. <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a> führt die <strong>Funktion Data-in, Data-out (auch bekannt als</strong> <a href="https://milvus.io/docs/embedding-function-overview.md#Embedding-Function-Overview"><strong>Embedding Function</strong></a><strong>)</strong> ein, eine integrierte Einbettungsfunktion, die eine direkte Verbindung zu den wichtigsten Modellanbietern wie OpenAI, AWS Bedrock, Google Vertex AI und Hugging Face herstellt. Anstatt Ihre eigene Einbettungsinfrastruktur zu verwalten, kann Milvus diese Modelle nun für Sie aufrufen. Sie können auch Rohtext - und bald auch andere Datentypen - einfügen und abfragen, während Milvus automatisch die Vektorisierung beim Schreiben und Abfragen übernimmt.</p>
<p>Im weiteren Verlauf dieses Beitrags werden wir einen genaueren Blick darauf werfen, wie Data-in, Data-out unter der Haube funktioniert, wie Anbieter und Einbettungsfunktionen konfiguriert werden und wie Sie sie nutzen können, um Ihre Vektorsuch-Workflows durchgängig zu rationalisieren.</p>
<h2 id="What-is-Data-in-Data-out" class="common-anchor-header">Was ist Data-in, Data-out?<button data-href="#What-is-Data-in-Data-out" class="anchor-icon" translate="no">
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
    </button></h2><p>Data-in, Data-out in Milvus 2.6 basiert auf dem neuen Funktionsmodul - einem Framework, das Milvus in die Lage versetzt, die Datentransformation und die Erzeugung von Einbettungsfunktionen intern zu handhaben, ohne externe Vorverarbeitungsdienste. (Sie können den Designvorschlag in <a href="https://github.com/milvus-io/milvus/issues/35856">GitHub issue #35856</a> verfolgen.) Mit diesem Modul kann Milvus rohe Eingabedaten nehmen, einen Einbettungsanbieter direkt aufrufen und die resultierenden Vektoren automatisch in Ihre Sammlung schreiben.</p>
<p>Auf einer hohen Ebene macht das <strong>Funktionsmodul</strong> die Erzeugung von Einbettungen zu einer nativen Datenbankfunktion. Anstatt separate Einbettungspipelines, Hintergrundarbeiten oder Reranker-Dienste auszuführen, sendet Milvus nun Anfragen an Ihren konfigurierten Anbieter, ruft Einbettungen ab und speichert sie zusammen mit Ihren Daten - alles innerhalb des Ingestion-Pfads. Damit entfällt der operative Aufwand für die Verwaltung Ihrer eigenen Einbettungsinfrastruktur.</p>
<p>Data-in, Data-out führt drei wichtige Verbesserungen in den Milvus-Workflow ein:</p>
<ul>
<li><p><strong>Direktes Einfügen von Rohdaten</strong> - Sie können jetzt unbearbeiteten Text, Bilder oder andere Datentypen direkt in Milvus einfügen. Sie müssen sie nicht mehr vorher in Vektoren umwandeln.</p></li>
<li><p><strong>Konfigurieren Sie eine Einbettungsfunktion</strong> - Sobald Sie ein Einbettungsmodell in Milvus konfigurieren, verwaltet es automatisch den gesamten Einbettungsprozess. Milvus lässt sich nahtlos in eine Reihe von Modellanbietern integrieren, darunter OpenAI, AWS Bedrock, Google Vertex AI, Cohere und Hugging Face.</p></li>
<li><p><strong>Abfrage mit rohen Eingaben</strong> - Sie können jetzt eine semantische Suche mit rohem Text oder anderen inhaltsbasierten Abfragen durchführen. Milvus verwendet das gleiche konfigurierte Modell, um Einbettungen im laufenden Betrieb zu generieren, eine Ähnlichkeitssuche durchzuführen und relevante Ergebnisse zu liefern.</p></li>
</ul>
<p>Kurz gesagt, Milvus bettet Ihre Daten nun automatisch ein - und ordnet sie optional neu. Die Vektorisierung wird zu einer integrierten Datenbankfunktion, so dass keine externen Einbettungsdienste oder benutzerdefinierte Vorverarbeitungslogik mehr erforderlich sind.</p>
<h2 id="How-Data-in-Data-out-Works" class="common-anchor-header">Wie Data-in, Data-out funktioniert<button data-href="#How-Data-in-Data-out-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Das folgende Diagramm veranschaulicht, wie Data-in, Data-out innerhalb von Milvus funktioniert.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/diagram_data_in_data_out_4c9e06c884.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Der Arbeitsablauf von Data-in, Data-out kann in sechs Hauptschritte unterteilt werden:</p>
<ol>
<li><p><strong>Eingabe von Daten</strong> - Der Benutzer fügt Rohdaten - wie Text, Bilder oder andere Inhaltstypen - direkt in Milvus ein, ohne eine externe Vorverarbeitung durchzuführen.</p></li>
<li><p><strong>Einbettungen generieren</strong> - Das Funktionsmodul ruft automatisch das konfigurierte Einbettungsmodell über die API eines Drittanbieters auf und konvertiert die Rohdaten in Echtzeit in Vektoreinbettungen.</p></li>
<li><p><strong>Einbettungen speichern</strong> - Milvus schreibt die generierten Einbettungen in das vorgesehene Vektorfeld innerhalb Ihrer Sammlung, wo sie für Ähnlichkeitssuchoperationen zur Verfügung stehen.</p></li>
<li><p><strong>Anfrage stellen</strong> - Der Benutzer stellt eine Rohtext- oder inhaltsbasierte Anfrage an Milvus, genau wie in der Eingabephase.</p></li>
<li><p><strong>Semantische Suche</strong> - Milvus bettet die Abfrage unter Verwendung des gleichen konfigurierten Modells ein, führt eine Ähnlichkeitssuche über die gespeicherten Vektoren durch und ermittelt die engsten semantischen Übereinstimmungen.</p></li>
<li><p><strong>Rückgabe der Ergebnisse</strong> - Milvus gibt die ähnlichsten Top-k-Ergebnisse - die auf ihre ursprünglichen Daten zurückgeführt werden - direkt an die Anwendung zurück.</p></li>
</ol>
<h2 id="How-to-Configure-Data-in-Data-out" class="common-anchor-header">So konfigurieren Sie Data-in, Data-out<button data-href="#How-to-Configure-Data-in-Data-out" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Prerequisites" class="common-anchor-header">Voraussetzungen</h3><ul>
<li><p>Installieren Sie die neueste Version von <strong>Milvus 2.6</strong>.</p></li>
<li><p>Bereiten Sie Ihren Einbettungs-API-Schlüssel von einem unterstützten Anbieter (z. B. OpenAI, AWS Bedrock oder Cohere) vor. In diesem Beispiel werden wir <strong>Cohere</strong> als Einbettungsanbieter verwenden.</p></li>
</ul>
<h3 id="Modify-the-milvusyaml-Configuration" class="common-anchor-header">Ändern Sie die <code translate="no">milvus.yaml</code> Konfiguration</h3><p>Wenn Sie Milvus mit <strong>Docker Compose</strong> ausführen, müssen Sie die Datei <code translate="no">milvus.yaml</code> ändern, um das Funktionsmodul zu aktivieren. Sie können die offizielle Dokumentation für eine Anleitung heranziehen: <a href="https://milvus.io/docs/configure-docker.md?tab=component#Download-a-configuration-file">Konfigurieren Sie Milvus mit Docker Compose</a> (Anleitungen für andere Bereitstellungsmethoden finden Sie ebenfalls hier).</p>
<p>Suchen Sie in der Konfigurationsdatei die Abschnitte <code translate="no">credential</code> und <code translate="no">function</code>.</p>
<p>Aktualisieren Sie dann die Felder <code translate="no">apikey1.apikey</code> und <code translate="no">providers.cohere</code>.</p>
<pre><code translate="no">...
credential:
  aksk1:
    access_key_id:  <span class="hljs-comment"># Your access_key_id</span>
    secret_access_key:  <span class="hljs-comment"># Your secret_access_key</span>
  apikey1:
    apikey: <span class="hljs-string">&quot;***********************&quot;</span> <span class="hljs-comment"># Edit this section</span>
  gcp1:
    credential_json:  <span class="hljs-comment"># base64 based gcp credential data</span>
<span class="hljs-comment"># Any configuration related to functions</span>
function:
  textEmbedding:
    providers:
                        ...
      cohere: <span class="hljs-comment"># Edit the section below</span>
        credential:  apikey1 <span class="hljs-comment"># The name in the crendential configuration item</span>
        enable: true <span class="hljs-comment"># Whether to enable cohere model service</span>
        url:  <span class="hljs-string">&quot;https://api.cohere.com/v2/embed&quot;</span> <span class="hljs-comment"># Your cohere embedding url, Default is the official embedding url</span>
      ...
...
<button class="copy-code-btn"></button></code></pre>
<p>Sobald Sie diese Änderungen vorgenommen haben, starten Sie Milvus neu, um die aktualisierte Konfiguration anzuwenden.</p>
<h2 id="How-to-Use-the-Data-in-Data-out-Feature" class="common-anchor-header">Verwendung der Funktion Dateneingabe, Datenausgabe<button data-href="#How-to-Use-the-Data-in-Data-out-Feature" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Define-the-Schema-for-the-Collection" class="common-anchor-header">1. Definieren Sie das Schema für die Sammlung</h3><p>Um die Einbettungsfunktion zu aktivieren, muss Ihr <strong>Sammlungsschema</strong> mindestens drei Felder enthalten:</p>
<ul>
<li><p><strong>Primärschlüsselfeld (</strong><code translate="no">id</code> ) - identifiziert jede Entität in der Sammlung eindeutig.</p></li>
<li><p><strong>Skalarfeld (</strong><code translate="no">document</code> ) - Speichert die ursprünglichen Rohdaten.</p></li>
<li><p><strong>Vektorfeld (</strong><code translate="no">dense</code> ) - Speichert die generierten Vektoreinbettungen.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType
<span class="hljs-comment"># Initialize Milvus client</span>
client = MilvusClient(
    uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>,
)
<span class="hljs-comment"># Create a new schema for the collection</span>
schema = client.create_schema()
<span class="hljs-comment"># Add primary field &quot;id&quot;</span>
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">False</span>)
<span class="hljs-comment"># Add scalar field &quot;document&quot; for storing textual data</span>
schema.add_field(<span class="hljs-string">&quot;document&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">9000</span>)
<span class="hljs-comment"># Add vector field &quot;dense&quot; for storing embeddings.</span>
<span class="hljs-comment"># IMPORTANT: Set `dim` to match the exact output dimension of the embedding model.</span>
<span class="hljs-comment"># For instance, OpenAI&#x27;s text-embedding-3-small model outputs 1536-dimensional vectors.</span>
<span class="hljs-comment"># For dense vector, data type can be FLOAT_VECTOR or INT8_VECTOR</span>
schema.add_field(<span class="hljs-string">&quot;dense&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>) <span class="hljs-comment"># Set dim according to the embedding model you use.</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Define-the-Embedding-Function" class="common-anchor-header">2. Definieren Sie die Einbettungsfunktion</h3><p>Als Nächstes wird die <strong>Einbettungsfunktion</strong> im Schema definiert.</p>
<ul>
<li><p><code translate="no">name</code> - Ein eindeutiger Bezeichner für die Funktion.</p></li>
<li><p><code translate="no">function_type</code> - Für Texteinbettungen auf <code translate="no">FunctionType.TEXTEMBEDDING</code> setzen. Milvus unterstützt auch andere Funktionstypen wie <code translate="no">FunctionType.BM25</code> und <code translate="no">FunctionType.RERANK</code>. Siehe <a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">Volltextsuche</a> und <a href="https://milvus.io/docs/decay-ranker-overview.md#Decay-Ranker-Overview">Decay Ranker Übersicht</a> für weitere Details.</p></li>
<li><p><code translate="no">input_field_names</code> - Definiert das Eingabefeld für Rohdaten (<code translate="no">document</code>).</p></li>
<li><p><code translate="no">output_field_names</code> - Definiert das Ausgabefeld, in dem die Vektoreinbettungen gespeichert werden (<code translate="no">dense</code>).</p></li>
<li><p><code translate="no">params</code> - Enthält Konfigurationsparameter für die Einbettungsfunktion. Die Werte für <code translate="no">provider</code> und <code translate="no">model_name</code> müssen mit den entsprechenden Einträgen in Ihrer Konfigurationsdatei <code translate="no">milvus.yaml</code> übereinstimmen.</p></li>
</ul>
<p><strong>Hinweis:</strong> Jede Funktion muss eine eindeutige <code translate="no">name</code> und <code translate="no">output_field_names</code> haben, um verschiedene Transformationslogiken zu unterscheiden und Konflikte zu vermeiden.</p>
<pre><code translate="no"><span class="hljs-comment"># Define embedding function (example: OpenAI provider)</span>
text_embedding_function = Function(
    name=<span class="hljs-string">&quot;cohere_embedding&quot;</span>,                  <span class="hljs-comment"># Unique identifier for this embedding function</span>
    function_type=FunctionType.TEXTEMBEDDING, <span class="hljs-comment"># Type of embedding function</span>
    input_field_names=[<span class="hljs-string">&quot;document&quot;</span>],           <span class="hljs-comment"># Scalar field to embed</span>
    output_field_names=[<span class="hljs-string">&quot;dense&quot;</span>],             <span class="hljs-comment"># Vector field to store embeddings</span>
    params={                                  <span class="hljs-comment"># Provider-specific configuration (highest priority)</span>
        <span class="hljs-string">&quot;provider&quot;</span>: <span class="hljs-string">&quot;cohere&quot;</span>,                 <span class="hljs-comment"># Embedding model provider</span>
        <span class="hljs-string">&quot;model_name&quot;</span>: <span class="hljs-string">&quot;embed-v4.0&quot;</span>,     <span class="hljs-comment"># Embedding model</span>
        <span class="hljs-comment"># &quot;credential&quot;: &quot;apikey1&quot;,            # Optional: Credential label</span>
        <span class="hljs-comment"># Optional parameters:</span>
        <span class="hljs-comment"># &quot;dim&quot;: &quot;1536&quot;,       # Optionally shorten the vector dimension</span>
        <span class="hljs-comment"># &quot;user&quot;: &quot;user123&quot;    # Optional: identifier for API tracking</span>
    }
)
<span class="hljs-comment"># Add the embedding function to your schema</span>
schema.add_function(text_embedding_function)
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Configure-the-Index" class="common-anchor-header">3. Konfigurieren Sie den Index</h3><p>Sobald die Felder und Funktionen definiert sind, erstellen Sie einen Index für die Sammlung. Der Einfachheit halber wird hier als Beispiel der Typ AUTOINDEX verwendet.</p>
<pre><code translate="no"><span class="hljs-comment"># Prepare index parameters</span>
index_params = client.prepare_index_params()
<span class="hljs-comment"># Add AUTOINDEX to automatically select optimal indexing method</span>
index_params.add_index(
    field_name=<span class="hljs-string">&quot;dense&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span> 
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Create-the-Collection" class="common-anchor-header">4. Erstellen Sie die Sammlung</h3><p>Verwenden Sie das definierte Schema und den Index, um eine neue Sammlung zu erstellen. In diesem Beispiel erstellen wir eine Sammlung namens Demo.</p>
<pre><code translate="no"><span class="hljs-comment"># Create collection named &quot;demo&quot;</span>
client.create_collection(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>, 
    schema=schema, 
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Insert-Data" class="common-anchor-header">5. Daten einfügen</h3><p>Jetzt können Sie die Rohdaten direkt in Milvus einfügen - es ist nicht nötig, Einbettungen manuell zu erzeugen.</p>
<pre><code translate="no"><span class="hljs-comment"># Insert sample documents</span>
client.insert(<span class="hljs-string">&#x27;demo&#x27;</span>, [
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">1</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Milvus simplifies semantic search through embeddings.&#x27;</span>},
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">2</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Vector embeddings convert text into searchable numeric data.&#x27;</span>},
    {<span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-number">3</span>, <span class="hljs-string">&#x27;document&#x27;</span>: <span class="hljs-string">&#x27;Semantic search helps users find relevant information quickly.&#x27;</span>},
])
<button class="copy-code-btn"></button></code></pre>
<h3 id="6-Perform-Vector-Search" class="common-anchor-header">6. Vektorsuche durchführen</h3><p>Nachdem Sie Daten eingefügt haben, können Sie direkt mit Rohtextabfragen suchen. Milvus wandelt Ihre Abfrage automatisch in eine Einbettung um, führt eine Ähnlichkeitssuche mit gespeicherten Vektoren durch und gibt die besten Übereinstimmungen zurück.</p>
<pre><code translate="no"><span class="hljs-comment"># Perform semantic search</span>
results = client.search(
    collection_name=<span class="hljs-string">&#x27;demo&#x27;</span>, 
    data=[<span class="hljs-string">&#x27;How does Milvus handle semantic search?&#x27;</span>], <span class="hljs-comment"># Use text query rather than query vector</span>
    anns_field=<span class="hljs-string">&#x27;dense&#x27;</span>,   <span class="hljs-comment"># Use the vector field that stores embeddings</span>
    limit=<span class="hljs-number">1</span>,
    output_fields=[<span class="hljs-string">&#x27;document&#x27;</span>],
)
<span class="hljs-built_in">print</span>(results)
<span class="hljs-comment"># Example output:</span>
<span class="hljs-comment"># data: [&quot;[{&#x27;id&#x27;: 1, &#x27;distance&#x27;: 0.8821347951889038, &#x27;entity&#x27;: {&#x27;document&#x27;: &#x27;Milvus simplifies semantic search through embeddings.&#x27;}}]&quot;]</span>
<button class="copy-code-btn"></button></code></pre>
<p>Für weitere Details zur Vektorsuche siehe: <a href="https://milvus.io/docs/single-vector-search.md">Grundlegende Vektorsuche </a>und <a href="https://milvus.io/docs/get-and-scalar-query.md">Abfrage-API</a>.</p>
<h2 id="Get-Started-with-Milvus-26" class="common-anchor-header">Erste Schritte mit Milvus 2.6<button data-href="#Get-Started-with-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Mit Data-in, Data-out hebt Milvus 2.6 die Einfachheit der Vektorsuche auf die nächste Stufe. Durch die Integration von Einbettungs- und Reranking-Funktionen direkt in Milvus müssen Sie keine externe Vorverarbeitung mehr durchführen oder separate Einbettungsdienste verwalten.</p>
<p>Sind Sie bereit, es auszuprobieren? Installieren Sie <a href="https://milvus.io/docs">Milvus</a> 2.6 noch heute und überzeugen Sie sich selbst von der Leistungsfähigkeit von Data-in, Data-out.</p>
<p>Haben Sie Fragen oder möchten Sie eine Funktion genauer kennenlernen? Treten Sie unserem<a href="https://discord.com/invite/8uyFbECzPX"> Discord-Kanal</a> bei oder stellen Sie Fragen auf<a href="https://github.com/milvus-io/milvus"> GitHub</a>. Sie können auch eine 20-minütige Einzelsitzung buchen, um Einblicke, Anleitung und Antworten auf Ihre Fragen in den<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a> zu erhalten.</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Erfahren Sie mehr über die Funktionen von Milvus 2.6<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Einführung von Milvus 2.6: Erschwingliche Vektorsuche im Milliardenmaßstab</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">JSON Shredding in Milvus: 88,9x schnellere JSON-Filterung mit Flexibilität</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">Echte Abfrage auf Entity-Ebene: Neue Array-of-Structs und MAX_SIM-Fähigkeiten in Milvus</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MinHash LSH in Milvus: Die Geheimwaffe zur Bekämpfung von Duplikaten in LLM-Trainingsdaten </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">Vektorkomprimierung auf die Spitze getrieben: Wie Milvus mit RaBitQ 3× mehr Abfragen bedient</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">Benchmarks lügen - Vektor-DBs verdienen einen echten Test </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">Wir haben Kafka/Pulsar durch einen Woodpecker für Milvus ersetzt </a></p></li>
<li><p><a href="https://milvus.io/blog/how-to-filter-efficiently-without-killing-recall.md">Vektorsuche in der realen Welt: Wie man effizient filtert, ohne den Rückruf zu töten </a></p></li>
</ul>
