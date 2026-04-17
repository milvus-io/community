---
id: milvus-boost-ranker-business-aware-vector-search.md
title: Wie man Milvus Boost Ranker für die geschäftsorientierte Vektorsuche verwendet
author: Wei Zang
date: 2026-3-24
cover: >-
  assets.zilliz.com/How_to_Use_Milvus_Boost_Ranker_to_Improve_Vector_Search_Ranking_4f47a2a8c6_c3ed6feec6.jpg
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus Boost Ranker, vector search ranking, metadata reranking, Milvus 2.6'
meta_title: |
  Milvus Boost Ranker: Add Business Rules to Vector Search
desc: >-
  Erfahren Sie, wie Sie mit Milvus Boost Ranker Geschäftsregeln auf die
  Vektorähnlichkeit aufsetzen können - offizielle Dokumente aufwerten, veraltete
  Inhalte zurückstufen, mehr Vielfalt schaffen.
origin: 'https://milvus.io/blog/milvus-boost-ranker-business-aware-vector-search.md'
---
<p>Die Vektorsuche ordnet die Ergebnisse nach der Ähnlichkeit der Einbettung - je näher die Vektoren beieinander liegen, desto höher das Ergebnis. Einige Systeme fügen einen modellbasierten Reranker hinzu (BGE, Voyage, Cohere), um die Reihenfolge zu verbessern. Keiner der beiden Ansätze wird jedoch einer grundlegenden Anforderung in der Produktion gerecht: <strong>Der Geschäftskontext ist genauso wichtig wie die semantische Relevanz, manchmal sogar wichtiger.</strong></p>
<p>Eine E-Commerce-Website muss zuerst die Produkte anzeigen, die in den offiziellen Geschäften vorrätig sind. Eine Content-Plattform möchte aktuelle Ankündigungen anzeigen. Eine Unternehmens-Wissensdatenbank benötigt maßgebliche Dokumente an der Spitze. Wenn sich das Ranking ausschließlich auf den Vektorabstand stützt, werden diese Regeln ignoriert. Die Ergebnisse mögen relevant sein, aber sie sind nicht angemessen.</p>
<p><strong><a href="https://milvus.io/docs/reranking.md">Der Boost Ranker</a></strong>, der in <a href="https://milvus.io/intro">Milvus</a> 2.6 eingeführt wurde, löst dieses Problem. Mit ihm können Sie die Rangfolge der Suchergebnisse anhand von Metadatenregeln anpassen - ohne Neuaufbau des Index und ohne Änderung des Modells. Dieser Artikel beschreibt, wie er funktioniert, wann er eingesetzt werden sollte und wie er mit Code implementiert werden kann.</p>
<h2 id="What-Is-Boost-Ranker" class="common-anchor-header">Was ist Boost Ranker?<button data-href="#What-Is-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Boost Ranker ist eine leichtgewichtige, regelbasierte Reranking-Funktion in Milvus 2.6.2</strong>, die <a href="https://zilliz.com/learn/vector-similarity-search">Vektorsuchergebnisse</a> mithilfe skalarer Metadatenfelder anpasst. Im Gegensatz zu modellbasierten Rerankern, die externe LLMs oder Einbettungsdienste aufrufen, arbeitet Boost Ranker vollständig innerhalb von Milvus mit einfachen Filter- und Gewichtungsregeln. Keine externen Abhängigkeiten, minimaler Latenz-Overhead - geeignet für den Einsatz in Echtzeit.</p>
<p>Sie konfigurieren ihn über die <a href="https://milvus.io/docs/manage-functions.md">Funktions-API</a>. Nachdem die Vektorsuche eine Reihe von Kandidaten liefert, wendet Boost Ranker drei Operationen an:</p>
<ol>
<li><strong>Filter:</strong> Identifizierung von Ergebnissen, die bestimmten Bedingungen entsprechen (z. B. <code translate="no">is_official == true</code>)</li>
<li><strong>Verstärken:</strong> Multiplizieren der Ergebnisse mit einer konfigurierten Gewichtung</li>
<li><strong>Shuffle:</strong> optionales Hinzufügen eines kleinen Zufallsfaktors (0-1), um Vielfalt einzuführen</li>
</ol>
<h3 id="How-It-Works-Under-the-Hood" class="common-anchor-header">Wie es unter der Haube funktioniert</h3><p>Boost Ranker läuft innerhalb von Milvus als Nachbearbeitungsschritt:</p>
<ol>
<li><strong>Vektorsuche</strong> - jedes Segment gibt Kandidaten mit IDs, Ähnlichkeitswerten und Metadaten zurück.</li>
<li><strong>Anwenden von Regeln</strong> - das System filtert übereinstimmende Datensätze und passt ihre Punktzahlen unter Verwendung der konfigurierten Gewichtung und der optionalen <code translate="no">random_score</code> an.</li>
<li><strong>Zusammenführen und sortieren</strong> - alle Kandidaten werden kombiniert und nach aktualisierten Punktzahlen neu sortiert, um die endgültigen Top-K-Ergebnisse zu erhalten.</li>
</ol>
<p>Da Boost Ranker nur mit bereits abgerufenen Kandidaten und nicht mit dem gesamten Datensatz arbeitet, sind die zusätzlichen Rechenkosten vernachlässigbar.</p>
<h2 id="When-Should-You-Use-Boost-Ranker" class="common-anchor-header">Wann sollten Sie Boost Ranker verwenden?<button data-href="#When-Should-You-Use-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Boosting-Important-Results" class="common-anchor-header">Boosten wichtiger Ergebnisse</h3><p>Der häufigste Anwendungsfall: Überlagern Sie die semantische Suche mit einfachen Geschäftsregeln.</p>
<ul>
<li><strong>E-Commerce:</strong> Boosten Sie Produkte aus Flagship-Stores, von offiziellen Verkäufern oder aus bezahlten Werbeaktionen. Schieben Sie Artikel mit hohen aktuellen Verkäufen oder Klickraten nach oben.</li>
<li><strong>Content-Plattformen:</strong> Priorisieren Sie kürzlich veröffentlichte Inhalte über ein <code translate="no">publish_time</code> -Feld, oder heben Sie Beiträge von verifizierten Accounts hervor.</li>
<li><strong>Unternehmenssuche:</strong> Geben Sie Dokumenten mit <code translate="no">doctype == &quot;policy&quot;</code> oder <code translate="no">is_canonical == true</code> höhere Priorität.</li>
</ul>
<p>Alles konfigurierbar mit einem Filter + Gewichtung. Keine Änderungen des Einbettungsmodells, keine Index-Neuaufbauten.</p>
<h3 id="Demoting-Without-Removing" class="common-anchor-header">Herabstufung ohne Entfernung</h3><p>Boost Ranker kann auch das Ranking für bestimmte Ergebnisse herabsetzen - eine sanftere Alternative zur harten Filterung.</p>
<ul>
<li><strong>Produkte mit geringem Lagerbestand:</strong> Wenn <code translate="no">stock &lt; 10</code>, wird ihr Gewicht leicht reduziert. Sie sind immer noch auffindbar, dominieren aber nicht mehr die Top-Positionen.</li>
<li><strong>Sensible Inhalte:</strong> Senken Sie die Gewichtung von gekennzeichneten Inhalten, anstatt sie ganz zu entfernen. Begrenzt die Auffindbarkeit ohne harte Zensur.</li>
<li><strong>Veraltete Dokumente:</strong> Dokumente mit <code translate="no">year &lt; 2020</code> werden niedriger eingestuft, damit neuere Inhalte zuerst auftauchen.</li>
</ul>
<p>Die Nutzer können die zurückgestuften Ergebnisse immer noch finden, indem sie scrollen oder genauer suchen, aber sie verdrängen nicht die relevanteren Inhalte.</p>
<h3 id="Adding-Diversity-with-Controlled-Randomness" class="common-anchor-header">Mehr Vielfalt durch kontrollierte Zufälligkeit</h3><p>Wenn viele Ergebnisse ähnliche Punktzahlen haben, kann das Top-K bei allen Abfragen identisch aussehen. Der Parameter <code translate="no">random_score</code> von Boost Ranker sorgt für leichte Variationen:</p>
<pre><code translate="no" class="language-json"><span class="hljs-string">&quot;random_score&quot;</span>: {
  <span class="hljs-string">&quot;seed&quot;</span>: <span class="hljs-number">126</span>,
  <span class="hljs-string">&quot;field&quot;</span>: <span class="hljs-string">&quot;id&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><code translate="no">seed</code>: steuert die allgemeine Zufälligkeit für die Reproduzierbarkeit</li>
<li><code translate="no">field</code>Normalerweise der Primärschlüssel <code translate="no">id</code>, damit derselbe Datensatz jedes Mal denselben Zufallswert erhält.</li>
</ul>
<p>Dies ist nützlich für die <strong>Diversifizierung von Empfehlungen</strong> (um zu verhindern, dass dieselben Elemente immer zuerst erscheinen) und für die <strong>Erkundung</strong> (Kombination fester Geschäftsgewichte mit kleinen Zufallsstörungen).</p>
<h3 id="Combining-Boost-Ranker-with-Other-Rankers" class="common-anchor-header">Kombinieren von Boost Ranker mit anderen Rankern</h3><p>Boost Ranker wird über die Funktions-API mit <code translate="no">params.reranker = &quot;boost&quot;</code> eingestellt. Zwei Dinge sind bei der Kombination zu beachten:</p>
<ul>
<li><strong>Einschränkung:</strong> Bei der hybriden (multivektoralen) Suche kann der Boost Ranker nicht als oberstes Ranglistenprogramm verwendet werden. Er kann jedoch innerhalb jedes einzelnen <code translate="no">AnnSearchRequest</code> verwendet werden, um die Ergebnisse anzupassen, bevor sie zusammengeführt werden.</li>
<li><strong>Übliche Kombinationen:</strong><ul>
<li><strong>RRF + Boost:</strong> Verwendung von RRF zum Zusammenführen multimodaler Ergebnisse, dann Anwendung von Boost zur metadatenbasierten Feinabstimmung.</li>
<li><strong>Model Ranker + Boost:</strong> Verwenden Sie einen modellbasierten Ranker für die semantische Qualität und anschließend Boost für die Geschäftsregeln.</li>
</ul></li>
</ul>
<h2 id="How-to-Configure-Boost-Ranker" class="common-anchor-header">So konfigurieren Sie Boost Ranker<button data-href="#How-to-Configure-Boost-Ranker" class="anchor-icon" translate="no">
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
    </button></h2><p>Boost Ranker wird über die Funktions-API konfiguriert. Für komplexere Logik kombinieren Sie ihn mit <code translate="no">FunctionScore</code>, um mehrere Regeln gemeinsam anzuwenden.</p>
<h3 id="Required-Fields" class="common-anchor-header">Erforderliche Felder</h3><p>Beim Erstellen eines <code translate="no">Function</code> Objekts:</p>
<ul>
<li><code translate="no">name</code>: beliebiger benutzerdefinierter Name</li>
<li><code translate="no">input_field_names</code>: muss eine leere Liste sein <code translate="no">[]</code></li>
<li><code translate="no">function_type</code>: festgelegt auf <code translate="no">FunctionType.RERANK</code></li>
<li><code translate="no">params.reranker</code>: muss sein <code translate="no">&quot;boost&quot;</code></li>
</ul>
<h3 id="Key-Parameters" class="common-anchor-header">Schlüssel-Parameter</h3><p><strong><code translate="no">params.weight</code> (erforderlich)</strong></p>
<p>Der Multiplikator, der auf die Bewertungen der übereinstimmenden Datensätze angewendet wird. Wie Sie ihn festlegen, hängt von der Metrik ab:</p>
<table>
<thead>
<tr><th>Metrik-Typ</th><th>Um Ergebnisse zu erhöhen</th><th>Um Ergebnisse herabzustufen</th></tr>
</thead>
<tbody>
<tr><td>Höher-ist-besser (COSINE, IP)</td><td><code translate="no">weight &gt; 1</code></td><td><code translate="no">weight &lt; 1</code></td></tr>
<tr><td>Niedriger-ist-besser (L2/Euklidisch)</td><td><code translate="no">weight &lt; 1</code></td><td><code translate="no">weight &gt; 1</code></td></tr>
</tbody>
</table>
<p><strong><code translate="no">params.filter</code> (optional)</strong></p>
<p>Eine Bedingung, die auswählt, für welche Datensätze die Punktzahlen angepasst werden:</p>
<ul>
<li><code translate="no">&quot;doctype == 'abstract'&quot;</code></li>
<li><code translate="no">&quot;is_premium == true&quot;</code></li>
<li><code translate="no">&quot;views &gt; 1000 and category == 'tech'&quot;</code></li>
</ul>
<p>Nur übereinstimmende Datensätze sind betroffen. Alle anderen behalten ihre ursprüngliche Punktzahl.</p>
<p><strong><code translate="no">params.random_score</code> (optional)</strong></p>
<p>Fügt einen Zufallswert zwischen 0 und 1 für die Vielfalt hinzu. Weitere Informationen finden Sie im Abschnitt Zufälligkeit oben.</p>
<h3 id="Single-vs-Multiple-Rules" class="common-anchor-header">Einzelne vs. mehrere Regeln</h3><p><strong>Einzelne Regel</strong> - wenn Sie eine geschäftliche Einschränkung haben (z. B. offizielle Dokumente fördern), übergeben Sie den Ranker direkt an <code translate="no">search(..., ranker=ranker)</code>.</p>
<p><strong>Mehrere Regeln</strong> - wenn Sie mehrere Einschränkungen benötigen (vorrätige Artikel priorisieren + niedrig bewertete Produkte zurückstufen + Zufälligkeit hinzufügen), erstellen Sie mehrere <code translate="no">Function</code> Objekte und kombinieren sie mit <code translate="no">FunctionScore</code>. Sie konfigurieren:</p>
<ul>
<li><code translate="no">boost_mode</code>: wie jede Regel mit der ursprünglichen Bewertung kombiniert wird (<code translate="no">multiply</code> oder <code translate="no">add</code>)</li>
<li><code translate="no">function_mode</code>: wie mehrere Regeln miteinander kombiniert werden (<code translate="no">multiply</code> oder <code translate="no">add</code>)</li>
</ul>
<h2 id="Hands-On-Prioritizing-Official-Documents" class="common-anchor-header">Praktische Anwendung: Priorisierung von offiziellen Dokumenten<button data-href="#Hands-On-Prioritizing-Official-Documents" class="anchor-icon" translate="no">
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
    </button></h2><p>Lassen Sie uns ein konkretes Beispiel durchgehen: Offizielle Dokumente werden in einem Dokumentensuchsystem höher eingestuft.</p>
<h3 id="Schema" class="common-anchor-header">Schema</h3><p>Eine Sammlung namens <code translate="no">milvus_collection</code> mit diesen Feldern:</p>
<table>
<thead>
<tr><th>Feld</th><th>Typ</th><th>Zweck</th></tr>
</thead>
<tbody>
<tr><td><code translate="no">id</code></td><td>INT64</td><td>Primärschlüssel</td></tr>
<tr><td><code translate="no">content</code></td><td>VARCHAR</td><td>Text des Dokuments</td></tr>
<tr><td><code translate="no">embedding</code></td><td>FLIESSEND_VEKTOR (3072)</td><td>Semantischer Vektor</td></tr>
<tr><td><code translate="no">source</code></td><td>VARCHAR</td><td>Herkunft: &quot;offiziell&quot;, &quot;Gemeinschaft&quot; oder &quot;Ticket&quot;</td></tr>
<tr><td><code translate="no">is_official</code></td><td>BOOL</td><td><code translate="no">True</code> wenn <code translate="no">source == &quot;official&quot;</code></td></tr>
</tbody>
</table>
<p>Die Felder <code translate="no">source</code> und <code translate="no">is_official</code> sind die Metadaten, die Boost Ranker zur Anpassung der Rangliste verwendet.</p>
<h3 id="Setup-Code" class="common-anchor-header">Einrichtungscode</h3><pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> (
    MilvusClient,
    DataType,
    Function,
    FunctionType,
)

<span class="hljs-comment"># 1. Connect to Milvus</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
collection_name = <span class="hljs-string">&quot;milvus_collection&quot;</span>

<span class="hljs-comment"># If it already exists, drop it first for repeated testing</span>
<span class="hljs-keyword">if</span> collection_name <span class="hljs-keyword">in</span> client.list_collections():
    client.drop_collection(collection_name)

<span class="hljs-comment"># 2. Define schema</span>
schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)

schema.add_field(
    field_name=<span class="hljs-string">&quot;id&quot;</span>,
    datatype=DataType.INT64,
    is_primary=<span class="hljs-literal">True</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;content&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">512</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;source&quot;</span>,
    datatype=DataType.VARCHAR,
    max_length=<span class="hljs-number">32</span>,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;is_official&quot;</span>,
    datatype=DataType.BOOL,
)
schema.add_field(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    datatype=DataType.FLOAT_VECTOR,
    dim=<span class="hljs-number">3072</span>,
)

text_embedding_function = Function(
    name=<span class="hljs-string">&quot;openai_embedding&quot;</span>,
    function_type=FunctionType.TEXTEMBEDDING,
    input_field_names=[<span class="hljs-string">&quot;content&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;embedding&quot;</span>],
    params={
        <span class="hljs-string">&quot;provider&quot;</span>: <span class="hljs-string">&quot;openai&quot;</span>,
        <span class="hljs-string">&quot;model_name&quot;</span>: <span class="hljs-string">&quot;text-embedding-3-large&quot;</span>
    }
)

schema.add_function(text_embedding_function)

<span class="hljs-comment"># 3. Create Collection</span>
client.create_collection(
    collection_name=collection_name,
    schema=schema,
)

<span class="hljs-comment"># 4. Create index</span>
index_params = client.prepare_index_params()

index_params.add_index(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;IVF_FLAT&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    params={<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">16</span>},
)

client.create_index(
    collection_name=collection_name,
    index_params=index_params,
)

<span class="hljs-comment"># 5. Load Collection into memory</span>
client.load_collection(collection_name=collection_name)

docs = [
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">1</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;How to deploy Milvus on Kubernetes (Official Guide)&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;official&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">True</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">2</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Quick deployment of Milvus with Docker Compose (Official Tutorial)&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;official&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">True</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">3</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Community experience: Lessons learned from deploying Milvus&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;community&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">False</span>
    },
    {
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-number">4</span>,
        <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Ticket record: Milvus deployment issue&quot;</span>,
        <span class="hljs-string">&quot;source&quot;</span>: <span class="hljs-string">&quot;ticket&quot;</span>,
        <span class="hljs-string">&quot;is_official&quot;</span>: <span class="hljs-literal">False</span>
    },
]

client.insert(
    collection_name=collection_name,
    data=docs,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Comparing-Results-With-and-Without-Boost-Ranker" class="common-anchor-header">Vergleichen der Ergebnisse: Mit und ohne Boost Ranker</h3><p>Führen Sie zunächst eine Basissuche ohne Boost Ranker aus. Fügen Sie dann Boost Ranker mit <code translate="no">filter: is_official == true</code> und <code translate="no">weight: 1.2</code> hinzu, und vergleichen Sie.</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># 6. Baseline search (without Boost Ranker)</span>
query_vector = <span class="hljs-string">&quot;how to deploy milvus&quot;</span>

search_params = {
    <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
    <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">2</span>},
}

results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_params=search_params,
    limit=<span class="hljs-number">4</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;is_official&quot;</span>],
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=== Baseline search (no Boost Ranker) ===&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;id=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, &quot;</span>
        <span class="hljs-string">f&quot;source=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;source&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;is_official=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;is_official&#x27;</span>]}</span>&quot;</span>
    )

<span class="hljs-comment"># 7. Define Boost Ranker: apply weight to documents where is_official == true</span>
boost_official_ranker = Function(
    name=<span class="hljs-string">&quot;boost_official&quot;</span>,
    input_field_names=[],               <span class="hljs-comment"># Boost Ranker requires this to be an empty list</span>
    function_type=FunctionType.RERANK,
    params={
        <span class="hljs-string">&quot;reranker&quot;</span>: <span class="hljs-string">&quot;boost&quot;</span>,            <span class="hljs-comment"># Specify Boost Ranker</span>
        <span class="hljs-string">&quot;filter&quot;</span>: <span class="hljs-string">&quot;is_official==true&quot;</span>,
        <span class="hljs-comment"># For COSINE / IP (higher score is better), use weight &gt; 1 to boost</span>
        <span class="hljs-string">&quot;weight&quot;</span>: <span class="hljs-number">1.2</span>
    },
)

boosted_results = client.search(
    collection_name=collection_name,
    data=[query_vector],
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    search_params=search_params,
    limit=<span class="hljs-number">4</span>,
    output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;source&quot;</span>, <span class="hljs-string">&quot;is_official&quot;</span>],
    ranker=boost_official_ranker,
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Search with Boost Ranker (official boosted) ===&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> boosted_results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    <span class="hljs-built_in">print</span>(
        <span class="hljs-string">f&quot;id=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, &quot;</span>
        <span class="hljs-string">f&quot;source=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;source&#x27;</span>]}</span>, &quot;</span>
        <span class="hljs-string">f&quot;is_official=<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;is_official&#x27;</span>]}</span>&quot;</span>
    )
<button class="copy-code-btn"></button></code></pre>
<h3 id="Results" class="common-anchor-header">Ergebnisse</h3><pre><code translate="no">=== Baseline search (no Boost Ranker) ===
<span class="hljs-built_in">id</span>=<span class="hljs-number">1</span>, score=<span class="hljs-number">0.7351</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">4</span>, score=<span class="hljs-number">0.7017</span>, source=ticket, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">3</span>, score=<span class="hljs-number">0.6706</span>, source=community, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">2</span>, score=<span class="hljs-number">0.6435</span>, source=official, is_official=<span class="hljs-literal">True</span>

=== Search <span class="hljs-keyword">with</span> Boost Ranker (official boosted) ===
<span class="hljs-built_in">id</span>=<span class="hljs-number">1</span>, score=<span class="hljs-number">0.8821</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">2</span>, score=<span class="hljs-number">0.7722</span>, source=official, is_official=<span class="hljs-literal">True</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">4</span>, score=<span class="hljs-number">0.7017</span>, source=ticket, is_official=<span class="hljs-literal">False</span>
<span class="hljs-built_in">id</span>=<span class="hljs-number">3</span>, score=<span class="hljs-number">0.6706</span>, source=community, is_official=<span class="hljs-literal">False</span>
<button class="copy-code-btn"></button></code></pre>
<p>Die wichtigste Änderung: Das Dokument <code translate="no">id=2</code> (offiziell) sprang von Platz 4 auf Platz 2, da seine Punktzahl mit 1,2 multipliziert wurde. Community-Beiträge und Ticket-Einträge werden nicht entfernt - sie werden nur niedriger eingestuft. Das ist der Sinn von Boost Ranker: die semantische Suche als Grundlage beibehalten und dann Geschäftsregeln darüber legen.</p>
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
    </button></h2><p>Mit<a href="https://milvus.io/docs/reranking.md">Boost Ranker</a> können Sie Geschäftslogik in die Vektorsuchergebnisse einbauen, ohne Ihre Einbettungen zu verändern oder Indizes neu zu erstellen. Steigern Sie offizielle Inhalte, degradieren Sie veraltete Ergebnisse, fügen Sie kontrollierte Vielfalt hinzu - alles durch einfache Filter- und Gewichtungskonfiguration in der <a href="https://milvus.io/docs/manage-functions.md">Milvus Function API</a>.</p>
<p>Ganz gleich, ob Sie RAG-Pipelines, Empfehlungssysteme oder eine Unternehmenssuche aufbauen, Boost Ranker hilft Ihnen, die Lücke zwischen semantisch ähnlichen Inhalten und dem, was für Ihre Benutzer tatsächlich nützlich ist, zu schließen.</p>
<p>Wenn Sie an einem Suchranking arbeiten und Ihren Anwendungsfall diskutieren möchten:</p>
<ul>
<li>Treten Sie der <a href="https://slack.milvus.io/">Milvus-Slack-Community</a> bei, um sich mit anderen Entwicklern auszutauschen, die Such- und Retrievalsysteme entwickeln.</li>
<li><a href="https://milvus.io/office-hours">Buchen Sie eine kostenlose 20-minütige Milvus-Sprechstunde</a>, um Ihre Ranking-Logik mit dem Team durchzugehen.</li>
<li>Wenn Sie die Einrichtung der Infrastruktur lieber überspringen möchten, bietet die <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (verwaltet von Milvus) eine kostenlose Stufe für den Einstieg.</li>
</ul>
<hr>
<p>Einige Fragen, die auftauchen, wenn Teams beginnen, Boost Ranker zu verwenden:</p>
<p><strong>Kann Boost Ranker einen modellbasierten Reranker wie Cohere oder BGE ersetzen?</strong>Sie lösen unterschiedliche Probleme. Modellbasierte Reranker bewerten die Ergebnisse nach semantischer Qualität - sie sind gut darin zu entscheiden, "welches Dokument die Frage tatsächlich beantwortet". Boost Ranker passt die Ergebnisse anhand von Geschäftsregeln an - er entscheidet, "welches relevante Dokument zuerst erscheinen sollte". In der Praxis wollen Sie oft beides: einen Model Ranker für die semantische Relevanz, und dann Boost Ranker für die Geschäftslogik obendrauf.</p>
<p>Erhöht<strong>Boost Ranker die Latenzzeit erheblich?</strong>Nein. Er arbeitet mit der bereits abgerufenen Kandidatengruppe (in der Regel die Top-K aus der Vektorsuche), nicht mit dem gesamten Datensatz. Die Operationen sind einfaches Filtern und Multiplizieren, so dass der Overhead im Vergleich zur Vektorsuche selbst vernachlässigbar ist.</p>
<p><strong>Wie lege ich den Gewichtungswert fest?</strong>Beginnen Sie mit kleinen Anpassungen. Bei der COSINE-Ähnlichkeit (höher ist besser) reicht in der Regel eine Gewichtung von 1,1-1,3 aus, um die Rangfolge merklich zu verändern, ohne die semantische Relevanz völlig außer Kraft zu setzen. Testen Sie mit Ihren aktuellen Daten - wenn geboostete Ergebnisse mit geringer Ähnlichkeit zu dominieren beginnen, verringern Sie die Gewichtung.</p>
<p><strong>Kann ich mehrere Boost Ranker-Regeln kombinieren?</strong>Ja. Erstellen Sie mehrere <code translate="no">Function</code> Objekte und kombinieren Sie sie mit <code translate="no">FunctionScore</code>. Sie steuern die Interaktion der Regeln über <code translate="no">boost_mode</code> (wie jede Regel mit dem ursprünglichen Ergebnis kombiniert wird) und <code translate="no">function_mode</code> (wie Regeln miteinander kombiniert werden) - beide unterstützen <code translate="no">multiply</code> und <code translate="no">add</code>.</p>
