---
id: how-milvus-26-upgrades-multilingual-full-text-search-at-scale.md
title: Wie Milvus 2.6 die mehrsprachige Volltextsuche in großem Maßstab verbessert
author: Zayne Yue
date: 2025-07-30T00:00:00.000Z
desc: >-
  Milvus 2.6 führt eine komplett überarbeitete Textanalyse-Pipeline mit
  umfassender mehrsprachiger Unterstützung für die Volltextsuche ein.
cover: >-
  assets.zilliz.com/How_Milvus_2_6_Upgrades_Multilingual_Full_Text_Search_at_Scale_final_cover_7656abfbd6.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, multilingual search, hybrid search, vector search, full text search'
meta_title: |
  How Milvus How Milvus 2.6 Upgrades Multilingual Full-Text Search at Scale
origin: >-
  https://milvus.io/blog/how-milvus-26-upgrades-multilingual-full-text-search-at-scale.md
---
<h2 id="Introduction" class="common-anchor-header">Einführung<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Moderne KI-Anwendungen werden immer komplexer. Man kann nicht einfach eine Suchmethode auf ein Problem anwenden und es als erledigt betrachten.</p>
<p>Empfehlungssysteme zum Beispiel benötigen eine <strong>Vektorsuche</strong>, um die Bedeutung von Text und Bildern zu verstehen, eine <strong>Metadatenfilterung</strong>, um die Ergebnisse nach Preis, Kategorie oder Standort einzugrenzen, und eine <strong>Schlüsselwortsuche</strong> für direkte Anfragen wie "Nike Air Max". Jede Methode löst einen anderen Teil des Problems, und in realen Systemen müssen alle zusammenarbeiten.</p>
<p>Die Zukunft der Suche liegt nicht in der Wahl zwischen Vektor- und Stichwortsuche. Es geht um die Kombination von Vektor- UND Stichwortsuche UND Filterung, zusammen mit anderen Sucharten - alles an einem Ort. Aus diesem Grund haben wir vor einem Jahr mit der Veröffentlichung von Milvus 2.5 begonnen, <a href="https://milvus.io/docs/hybrid_search_with_milvus.md">die hybride Suche</a> in Milvus zu integrieren.</p>
<h2 id="But-Full-Text-Search-Works-Differently" class="common-anchor-header">Aber Volltextsuche funktioniert anders<button data-href="#But-Full-Text-Search-Works-Differently" class="anchor-icon" translate="no">
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
    </button></h2><p>Es ist nicht einfach, eine Volltextsuche in ein vektor-natives System zu integrieren. Die Volltextsuche hat ihre eigenen Herausforderungen.</p>
<p>Während die Vektorsuche die <em>semantische</em> Bedeutung des Textes erfasst, indem sie ihn in hochdimensionale Vektoren umwandelt, hängt die Volltextsuche davon ab, <strong>die Struktur der Sprache</strong> zu verstehen: wie Wörter gebildet werden, wo sie beginnen und enden und wie sie sich zueinander verhalten. Wenn ein Benutzer zum Beispiel nach "running shoes" auf Englisch sucht, durchläuft der Text mehrere Verarbeitungsschritte:</p>
<p><em>Trennung von Leerzeichen → Kleinschreibung → Entfernen von Stoppwörtern → Umwandlung von &quot;running&quot; in &quot;run&quot;.</em></p>
<p>Um dies korrekt zu handhaben, benötigen wir einen robusten <strong>Sprachanalysator,</strong>der Splitting, Stemming, Filterung und vieles mehr beherrscht.</p>
<p>Als wir die <a href="https://milvus.io/docs/full-text-search.md#Full-Text-Search">BM25-Volltextsuche</a> in Milvus 2.5 eingeführt haben, haben wir einen anpassbaren Analyzer eingebaut, der für seine Zwecke gut funktioniert hat. Sie konnten eine Pipeline mit Tokenizern, Tokenfiltern und Zeichenfiltern definieren, um den Text für die Indizierung und Suche vorzubereiten.</p>
<p>Für Englisch war diese Einrichtung relativ einfach. Aber die Dinge werden komplexer, wenn man es mit mehreren Sprachen zu tun hat.</p>
<h2 id="The-Challenge-of-Multilingual-Full-Text-Search" class="common-anchor-header">Die Herausforderung der mehrsprachigen Volltextsuche<button data-href="#The-Challenge-of-Multilingual-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Die mehrsprachige Volltextsuche bringt eine Reihe von Herausforderungen mit sich:</p>
<ul>
<li><p><strong>Komplexe Sprachen erfordern eine besondere Behandlung</strong>: Sprachen wie Chinesisch, Japanisch und Koreanisch verwenden keine Leerzeichen zwischen den Wörtern. Sie benötigen fortgeschrittene Tokenizer, um Zeichen in sinnvolle Wörter zu segmentieren. Diese Tools mögen für eine einzelne Sprache gut funktionieren, unterstützen aber selten mehrere komplexe Sprachen gleichzeitig.</p></li>
<li><p><strong>Selbst ähnliche Sprachen können in Konflikt geraten</strong>: Englisch und Französisch verwenden zwar beide Leerzeichen zur Trennung von Wörtern, aber sobald Sie sprachspezifische Verarbeitungen wie Stemming oder Lemmatisierung anwenden, können sich die Regeln der einen Sprache mit denen der anderen überschneiden. Was die Genauigkeit für Englisch verbessert, kann französische Suchanfragen verzerren - und andersherum.</p></li>
</ul>
<p>Kurz gesagt, <strong>unterschiedliche Sprachen erfordern unterschiedliche Analysatoren</strong>. Der Versuch, chinesischen Text mit einem englischen Analysator zu verarbeiten, führt zum Scheitern - es gibt keine Leerzeichen zum Trennen, und englische Stemming-Regeln können chinesische Zeichen verfälschen.</p>
<p>Die Quintessenz? Die Verwendung eines einzigen Tokenisierers und Analysators für mehrsprachige Datensätze macht es nahezu unmöglich, eine konsistente, qualitativ hochwertige Tokenisierung für alle Sprachen zu gewährleisten. Und das führt direkt zu einer verminderten Suchleistung.</p>
<p>Als die Teams begannen, die Volltextsuche in Milvus 2.5 einzuführen, hörten wir immer wieder das gleiche Feedback:</p>
<p><em>"Das ist perfekt für unsere englischsprachigen Suchanfragen, aber was ist mit unseren mehrsprachigen Kundensupport-Tickets? "Wir lieben die Vektor- und BM25-Suche, aber unser Datensatz umfasst chinesische, japanische und englische Inhalte. "Können wir die gleiche Suchpräzision für alle unsere Sprachen erzielen?"</em></p>
<p>Diese Fragen bestätigten, was wir in der Praxis bereits gesehen hatten: Die Volltextsuche unterscheidet sich grundlegend von der Vektorsuche. Semantische Ähnlichkeit funktioniert gut über alle Sprachen hinweg, aber eine genaue Textsuche erfordert ein tiefes Verständnis der Struktur jeder Sprache.</p>
<p>Aus diesem Grund führt <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6</a> eine komplett überarbeitete Textanalyse-Pipeline mit umfassender Mehrsprachenunterstützung ein. Dieses neue System wendet automatisch den richtigen Analyzer für jede Sprache an und ermöglicht eine genaue und skalierbare Volltextsuche in mehrsprachigen Datensätzen, ohne manuelle Konfiguration oder Qualitätseinbußen.</p>
<h2 id="How-Milvus-26-Enables-Robust-Multilingual-Full-Text-Search" class="common-anchor-header">Wie Milvus 2.6 eine robuste mehrsprachige Volltextsuche ermöglicht<button data-href="#How-Milvus-26-Enables-Robust-Multilingual-Full-Text-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Nach umfangreichen Forschungs- und Entwicklungsarbeiten haben wir eine Reihe von Funktionen entwickelt, die verschiedene mehrsprachige Szenarien abdecken. Jeder Ansatz löst das Problem der Sprachabhängigkeit auf seine eigene Weise.</p>
<h3 id="1-Multi-Language-Analyzer-Precision-Through-Control" class="common-anchor-header">1. Mehrsprachiger Analyzer: Präzision durch Kontrolle</h3><p>Mit dem <a href="https://milvus.io/docs/multi-language-analyzers.md#Multi-language-Analyzers"><strong>Multi-Language Analyzer</strong></a> können Sie unterschiedliche Textverarbeitungsregeln für verschiedene Sprachen innerhalb derselben Sammlung definieren, anstatt alle Sprachen durch dieselbe Analysepipeline zu zwingen.</p>
<p>Und<strong>so funktioniert es:</strong> Sie konfigurieren sprachspezifische Analyzer und kennzeichnen jedes Dokument beim Einfügen mit der jeweiligen Sprache. Wenn Sie eine BM25-Suche durchführen, geben Sie an, welcher Sprachanalysator für die Abfrageverarbeitung verwendet werden soll. Dadurch wird sichergestellt, dass sowohl Ihre indizierten Inhalte als auch Ihre Suchanfragen mit den optimalen Regeln für die jeweilige Sprache verarbeitet werden.</p>
<p><strong>Perfekt für:</strong> Anwendungen, bei denen Sie die Sprache Ihrer Inhalte kennen und maximale Suchpräzision wünschen. Denken Sie an multinationale Wissensdatenbanken, lokalisierte Produktkataloge oder regionalspezifische Content-Management-Systeme.</p>
<p><strong>Die Anforderung:</strong> Sie müssen für jedes Dokument sprachliche Metadaten bereitstellen. Derzeit nur für BM25-Suchvorgänge verfügbar.</p>
<h3 id="2-Language-Identifier-Tokenizer-Automatic-Language-Detection" class="common-anchor-header">2. Sprachidentifikator Tokenizer: Automatische Erkennung der Sprache</h3><p>Wir wissen, dass es nicht immer praktikabel ist, jeden Inhalt manuell zu taggen. Mit dem <a href="https://milvus.io/docs/multi-language-analyzers.md#Overview"><strong>Language Identifier Tokenizer</strong></a> wird die automatische Spracherkennung direkt in die Textanalyse-Pipeline integriert.</p>
<p><strong>Und so funktioniert's:</strong> Dieser intelligente Tokenizer analysiert den eingehenden Text, erkennt die Sprache mithilfe hochentwickelter Erkennungsalgorithmen und wendet automatisch die entsprechenden sprachspezifischen Verarbeitungsregeln an. Sie konfigurieren ihn mit mehreren Analysatordefinitionen - eine für jede Sprache, die Sie unterstützen möchten, sowie einen Standard-Fallback-Analysator.</p>
<p>Wir unterstützen zwei Erkennungsmodule: <code translate="no">whatlang</code> für eine schnellere Verarbeitung und <code translate="no">lingua</code> für eine höhere Genauigkeit. Das System unterstützt 71-75 Sprachen, je nach dem von Ihnen gewählten Detektor. Sowohl bei der Indizierung als auch bei der Suche wählt der Tokenizer automatisch den richtigen Analysator auf der Grundlage der erkannten Sprache aus und greift auf Ihre Standardkonfiguration zurück, wenn die Erkennung unsicher ist.</p>
<p><strong>Perfekt für:</strong> Dynamische Umgebungen mit unvorhersehbaren Sprachmischungen, Plattformen mit benutzergenerierten Inhalten oder Anwendungen, bei denen eine manuelle Sprachkennzeichnung nicht möglich ist.</p>
<p><strong>Der Nachteil:</strong> Die automatische Erkennung führt zu einer längeren Verarbeitungszeit und kann bei sehr kurzen Texten oder gemischtsprachigen Inhalten Probleme bereiten. Aber für die meisten realen Anwendungen überwiegt der Komfort diese Einschränkungen bei weitem.</p>
<h3 id="3-ICU-Tokenizer-Universal-Foundation" class="common-anchor-header">3. ICU Tokenizer: Universelle Grundlage</h3><p>Wenn Ihnen die ersten beiden Optionen zu aufwendig erscheinen, haben wir etwas Einfacheres für Sie. Wir haben den<a href="https://milvus.io/docs/icu-tokenizer.md#ICU"> ICU (International Components for Unicode) Tokenizer</a> neu in Milvus 2.6 integriert. ICU gibt es schon ewig - es ist eine ausgereifte, weit verbreitete Sammlung von Bibliotheken, die die Textverarbeitung für eine Vielzahl von Sprachen und Skripten übernimmt. Das Tolle daran ist, dass es verschiedene komplexe und einfache Sprachen auf einmal verarbeiten kann.</p>
<p>Der ICU-Tokenizer ist wirklich eine gute Standardwahl. Er verwendet Unicode-Standardregeln für die Zerlegung von Wörtern, was ihn für Dutzende von Sprachen, die keine eigenen speziellen Tokenizer haben, zuverlässig macht. Wenn Sie einfach nur ein leistungsfähiges und universell einsetzbares Programm brauchen, das in mehreren Sprachen funktioniert, ist ICU die richtige Wahl.</p>
<p><strong>Einschränkung:</strong> ICU arbeitet immer noch mit einem einzigen Analysator, so dass alle Ihre Sprachen dieselben Filter verwenden. Möchten Sie sprachspezifische Dinge wie Stemming oder Lemmatisierung durchführen? Dann stoßen Sie auf die gleichen Konflikte, über die wir bereits gesprochen haben.</p>
<p><strong>Wo es wirklich glänzt:</strong> Wir haben ICU so entwickelt, dass es als Standard-Analysator innerhalb von Mehrsprachen- oder Sprachidentifizierungskonfigurationen funktioniert. Es ist im Grunde Ihr intelligentes Sicherheitsnetz für den Umgang mit Sprachen, die Sie nicht explizit konfiguriert haben.</p>
<h2 id="See-It-in-Action-Hands-On-Demo" class="common-anchor-header">Sehen Sie es in Aktion: Hands-On-Demo<button data-href="#See-It-in-Action-Hands-On-Demo" class="anchor-icon" translate="no">
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
    </button></h2><p>Genug der Theorie - jetzt geht es an den Code! Im Folgenden erfahren Sie, wie Sie die neuen mehrsprachigen Funktionen in <strong>pymilvus</strong> nutzen können, um eine mehrsprachige Suchkollektion zu erstellen.</p>
<p>Wir beginnen mit der Definition einiger wiederverwendbarer Analyzer-Konfigurationen und gehen dann durch <strong>zwei vollständige Beispiele</strong>:</p>
<ul>
<li><p>Verwendung des <strong>Multi-Language Analyzers</strong></p></li>
<li><p>Verwendung des <strong>Language Identifier Tokenizers</strong></p></li>
</ul>
<h3 id="Step-1-Set-up-the-Milvus-Client" class="common-anchor-header">Schritt 1: Einrichten des Milvus-Clients</h3><p><em>Zunächst stellen wir eine Verbindung zu Milvus her, legen einen Sammlungsnamen fest und bereinigen alle vorhandenen Sammlungen, um neu zu beginnen.</em></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType, Function, FunctionType

<span class="hljs-comment"># 1. Setup Milvus Client</span>
client = MilvusClient(<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
COLLECTION_NAME = <span class="hljs-string">&quot;multilingual_test&quot;</span>
<span class="hljs-keyword">if</span> client.has_collection(collection_name=COLLECTION_NAME):
    client.drop_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Define-Analyzers-for-Multiple-Languages" class="common-anchor-header">Schritt 2: Definieren von Analysatoren für mehrere Sprachen</h3><p>Als nächstes definieren wir ein <code translate="no">analyzers</code> Wörterbuch mit sprachspezifischen Konfigurationen. Diese werden in den beiden später vorgestellten mehrsprachigen Suchmethoden verwendet.</p>
<pre><code translate="no"><span class="hljs-comment"># 2. Define analyzers for multiple languages</span>
<span class="hljs-comment"># These individual analyzer definitions will be reused by both methods.</span>
analyzers = {
    <span class="hljs-string">&quot;Japanese&quot;</span>: { 
        <span class="hljs-comment"># Use lindera with japanese dict &#x27;ipadic&#x27; </span>
        <span class="hljs-comment"># and remove punctuation beacuse lindera tokenizer will remain punctuation</span>
        <span class="hljs-string">&quot;tokenizer&quot;</span>:{
            <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;lindera&quot;</span>,
            <span class="hljs-string">&quot;dict_kind&quot;</span>: <span class="hljs-string">&quot;ipadic&quot;</span>
        },
        <span class="hljs-string">&quot;filter&quot;</span>: [<span class="hljs-string">&quot;removepunct&quot;</span>]
    },
    <span class="hljs-string">&quot;English&quot;</span>: {
        <span class="hljs-comment"># Use build-in english analyzer</span>
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;english&quot;</span>,
    },
    <span class="hljs-string">&quot;default&quot;</span>: {
        <span class="hljs-comment"># use icu tokenizer as a fallback.</span>
        <span class="hljs-string">&quot;tokenizer&quot;</span>: <span class="hljs-string">&quot;icu&quot;</span>,
    }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Option-A-Using-The-Multi-Language-Analyzer" class="common-anchor-header">Option A: Verwendung des Multi-Language Analyzers</h3><p>Dieser Ansatz ist am besten geeignet, wenn Sie <strong>die Sprache jedes Dokuments bereits im Voraus kennen</strong>. Sie übergeben diese Informationen während des Einfügens der Daten über ein spezielles <code translate="no">language</code> Feld.</p>
<h4 id="Create-a-Collection-with-Multi-Language-Analyzer" class="common-anchor-header">Erstellen einer Sammlung mit dem Multi-Language Analyzer</h4><p>Wir erstellen eine Sammlung, in der das Feld <code translate="no">&quot;text&quot;</code> je nach dem Wert des Feldes <code translate="no">language</code> verschiedene Analysatoren verwendet.</p>
<pre><code translate="no"><span class="hljs-comment"># --- Option A: Using Multi-Language Analyzer ---</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Demonstrating Multi-Language Analyzer ---&quot;</span>)

<span class="hljs-comment"># 3A. reate a collection with the Multi Analyzer</span>

mutil_analyzer_params = {
    <span class="hljs-string">&quot;by_field&quot;</span>: <span class="hljs-string">&quot;language&quot;</span>,
    <span class="hljs-string">&quot;analyzers&quot;</span>: analyzers,
}

schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">True</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)<span class="hljs-comment"># Apply our multi-language analyzer to the &#x27;title&#x27; field</span>
schema.add_field(field_name=<span class="hljs-string">&quot;language&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">255</span>, nullable = <span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">25565</span>, enable_analyzer=<span class="hljs-literal">True</span>, multi_analyzer_params = mutil_analyzer_params)
schema.add_field(field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR) <span class="hljs-comment"># Bm25 Sparse Vector</span>

<span class="hljs-comment"># add bm25 function</span>
text_bm25_function = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;text_sparse&quot;</span>],
)
schema.add_function(text_bm25_function)

index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>, <span class="hljs-comment"># Use auto index for BM25</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>,
)

client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema,
    index_params=index_params
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created successfully.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-Multilingual-Data-and-Load-Collection" class="common-anchor-header">Mehrsprachige Daten einfügen und Sammlung laden</h4><p>Fügen Sie nun Dokumente in Englisch und Japanisch ein. Das Feld <code translate="no">language</code> teilt Milvus mit, welcher Analyzer verwendet werden soll.</p>
<pre><code translate="no"><span class="hljs-comment"># 4A. Insert data for Multi-Language Analyzer and load collection# Insert English and Japanese movie titles, explicitly setting the &#x27;language&#x27; field</span>
client.insert(
    collection_name=COLLECTION_NAME,
    data=[
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;The Lord of the Rings&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Spirited Away&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;千と千尋の神隠し&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># This is &quot;Spirited Away&quot; in Japanese</span>
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;君の名は。&quot;</span>, <span class="hljs-string">&quot;language&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># This is &quot;Your Name.&quot; in Japanese</span>
    ]
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted multilingual data into &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;.&quot;</span>)

<span class="hljs-comment"># Load the collection into memory before searching</span>
client.load_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Run-Full-Text-Search" class="common-anchor-header">Volltextsuche durchführen</h4><p>Geben Sie für die Suche an, welcher Analyzer für die Abfrage basierend auf der Sprache verwendet werden soll.</p>
<pre><code translate="no"><span class="hljs-comment"># 5A. Perform a full-text search with Multi-Language Analyzer# When searching, explicitly specify the analyzer to use for the query string.</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Search results for Multi-Language Analyzer ---&quot;</span>)
results_multi_jp = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;神隠し&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>, <span class="hljs-string">&quot;analyzer_name&quot;</span>: <span class="hljs-string">&quot;Japanese&quot;</span>}, <span class="hljs-comment"># Specify Japanese analyzer for query</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;神隠し&#x27; (Multi-Language Analyzer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_multi_jp[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

results_multi_en = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;Rings&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>, <span class="hljs-string">&quot;analyzer_name&quot;</span>: <span class="hljs-string">&quot;English&quot;</span>}, <span class="hljs-comment"># Specify English analyzer for query</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;Rings&#x27; (Multi-Language Analyzer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_multi_en[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

client.drop_collection(collection_name=COLLECTION_NAME)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; dropped.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Results" class="common-anchor-header">Ergebnisse:</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_results_561f628de3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Option-B-Using-the-Language-Identifier-Tokenizer" class="common-anchor-header">Option B: Verwendung des Sprachidentifikators Tokenizer</h3><p>Dieser Ansatz nimmt Ihnen die manuelle Sprachverarbeitung aus den Händen. Der <strong>Language Identifier Tokenizer</strong> erkennt automatisch die Sprache jedes Dokuments und wendet den richtigen Analyzer an, ohne dass Sie ein Feld <code translate="no">language</code> angeben müssen.</p>
<h4 id="Create-a-Collection-with-Language-Identifier-Tokenizer" class="common-anchor-header">Erstellen einer Sammlung mit Language Identifier Tokenizer</h4><p>Hier erstellen wir eine Sammlung, bei der das Feld <code translate="no">&quot;text&quot;</code> die automatische Spracherkennung nutzt, um den richtigen Analysator auszuwählen.</p>
<pre><code translate="no"><span class="hljs-comment"># --- Option B: Using Language Identifier Tokenizer ---</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Demonstrating Language Identifier Tokenizer ---&quot;</span>)

<span class="hljs-comment"># 3A. create a collection with language identifier</span>
analyzer_params_langid = {
    <span class="hljs-string">&quot;tokenizer&quot;</span>: {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;language_identifier&quot;</span>,
        <span class="hljs-string">&quot;analyzers&quot;</span>: analyzers <span class="hljs-comment"># Referencing the analyzers defined in Step 2</span>
    },
}

schema_langid = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">True</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)
schema_langid.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
<span class="hljs-comment"># The &#x27;language&#x27; field is not strictly needed by the analyzer itself here, as detection is automatic.# However, you might keep it for metadata purposes.</span>
schema_langid.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">25565</span>, enable_analyzer=<span class="hljs-literal">True</span>, analyzer_params = analyzer_params_langid)
schema_langid.add_field(field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR) <span class="hljs-comment"># BM25 Sparse Vector# add bm25 function</span>
text_bm25_function_langid = Function(
    name=<span class="hljs-string">&quot;text_bm25&quot;</span>,
    function_type=FunctionType.BM25,
    input_field_names=[<span class="hljs-string">&quot;text&quot;</span>],
    output_field_names=[<span class="hljs-string">&quot;text_sparse&quot;</span>],
)
schema_langid.add_function(text_bm25_function_langid)

index_params_langid = client.prepare_index_params()
index_params_langid.add_index(
    field_name=<span class="hljs-string">&quot;text_sparse&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>, <span class="hljs-comment"># Use auto index for BM25</span>
    metric_type=<span class="hljs-string">&quot;BM25&quot;</span>,
)

client.create_collection(
    collection_name=COLLECTION_NAME,
    schema=schema_langid,
    index_params=index_params_langid
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created successfully with Language Identifier Tokenizer.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Insert-Data-and-Load-Collection" class="common-anchor-header">Daten einfügen und Sammlung laden</h4><p>Fügen Sie Text in verschiedenen Sprachen ein - Sie müssen ihn nicht beschriften. Milvus erkennt und wendet den richtigen Analysator automatisch an.</p>
<pre><code translate="no"><span class="hljs-comment"># 4B. Insert Data for Language Identifier Tokenizer and Load Collection</span>
<span class="hljs-comment"># Insert English and Japanese movie titles. The language_identifier will detect the language.</span>
client.insert(
    collection_name=COLLECTION_NAME,
    data=[
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;The Lord of the Rings&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Spirited Away&quot;</span>},
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;千と千尋の神隠し&quot;</span>}, 
        {<span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;君の名は。&quot;</span>},
    ]
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted multilingual data into &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;.&quot;</span>)

<span class="hljs-comment"># Load the collection into memory before searching</span>
client.load_collection(collection_name=COLLECTION_NAME)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Run-Full-Text-Search" class="common-anchor-header">Volltextsuche durchführen</h4><p>Und jetzt kommt das Beste: Sie müssen bei der Suche <strong>keinen Analyzer angeben</strong>. Der Tokenizer erkennt automatisch die Abfragesprache und wendet die richtige Logik an.</p>
<pre><code translate="no"><span class="hljs-comment"># 5B. Perform a full-text search with Language Identifier Tokenizer# No need to specify analyzer_name in search_params; it&#x27;s detected automatically for the query.</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n--- Search results for Language Identifier Tokenizer ---&quot;</span>)
results_langid_jp = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;神隠し&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>}, <span class="hljs-comment"># Analyzer automatically determined by language_identifier</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;神隠し&#x27; (Language Identifier Tokenizer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_langid_jp[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

results_langid_en = client.search(
    collection_name=COLLECTION_NAME,
    data=[<span class="hljs-string">&quot;the Rings&quot;</span>],
    limit=<span class="hljs-number">2</span>,
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;BM25&quot;</span>}, <span class="hljs-comment"># Analyzer automatically determined by language_identifier</span>
    consistency_level = <span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results for &#x27;the Rings&#x27; (Language Identifier Tokenizer):&quot;</span>)
<span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results_langid_en[<span class="hljs-number">0</span>]:
    <span class="hljs-built_in">print</span>(result)

client.drop_collection(collection_name=COLLECTION_NAME)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; dropped.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Results" class="common-anchor-header">Ergebnisse</h4><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_results_486712c3f6.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>Milvus 2.6 macht einen großen Schritt nach vorn, um die <strong>hybride Suche</strong> leistungsfähiger und zugänglicher zu machen, indem es die Vektorsuche mit der Schlüsselwortsuche kombiniert, jetzt auch in mehreren Sprachen. Mit der verbesserten mehrsprachigen Unterstützung können Sie Anwendungen erstellen, die verstehen <em>, was die Benutzer meinen</em> und <em>was sie sagen</em>, unabhängig von der Sprache, die sie verwenden.</p>
<p>Aber das ist nur ein Teil des Updates. Milvus 2.6 bringt auch mehrere andere Funktionen, die die Suche schneller, intelligenter und einfacher machen:</p>
<ul>
<li><p><strong>Besseres Query Matching</strong> - Verwenden Sie <code translate="no">phrase_match</code> und <code translate="no">multi_match</code> für eine genauere Suche</p></li>
<li><p><strong>Schnellere JSON-Filterung</strong> - dank eines neuen, speziellen Index für JSON-Felder</p></li>
<li><p><strong>Skalarbasierte Sortierung</strong> - Sortieren Sie die Ergebnisse nach einem beliebigen numerischen Feld</p></li>
<li><p><strong>Erweitertes Reranking</strong> - Neuordnung der Ergebnisse anhand von Modellen oder benutzerdefinierter Bewertungslogik</p></li>
</ul>
<p>Möchten Sie die vollständige Aufschlüsselung von Milvus 2.6? Sehen Sie sich unseren letzten Beitrag an: <a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Einführung von Milvus 2.6: Erschwingliche Vektorsuche im Milliardenmaßstab</strong></a><strong>.</strong></p>
<p>Haben Sie Fragen oder möchten Sie eine Funktion genauer kennenlernen? Treten Sie unserem<a href="https://discord.com/invite/8uyFbECzPX"> Discord-Kanal</a> bei oder melden Sie Probleme auf<a href="https://github.com/milvus-io/milvus"> GitHub</a>.</p>
