---
id: >-
  2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md
title: >-
  Verwendung von Zeichenkettendaten zur Verbesserung Ihrer Anwendungen für die
  Ähnlichkeitssuche
author: Xi Ge
date: 2022-08-08T00:00:00.000Z
desc: >-
  Verwenden Sie String-Daten, um den Prozess der Erstellung Ihrer eigenen
  Anwendungen für die Ähnlichkeitssuche zu rationalisieren.
cover: assets.zilliz.com/string_6129ce83e6.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/string_6129ce83e6.png" alt="Cover" class="doc-image" id="cover" />
   </span> <span class="img-wrapper"> <span>Umschlag</span> </span></p>
<p>Milvus 2.1 kommt mit <a href="https://milvus.io/blog/2022-08-05-whats-new-in-milvus-2-1.md">einigen bedeutenden Aktualisierungen</a>, die die Arbeit mit Milvus wesentlich erleichtern. Eine davon ist die Unterstützung von String-Datentypen. Im Moment <a href="https://milvus.io/docs/v2.1.x/schema.md#Supported-data-type">unterstützt</a> Milvus <a href="https://milvus.io/docs/v2.1.x/schema.md#Supported-data-type">Datentypen</a> wie Strings, Vektoren, Boolesche, Ganzzahlen, Gleitkommazahlen und mehr.</p>
<p>Dieser Artikel bietet eine Einführung in die Unterstützung von String-Datentypen. Lesen Sie ihn und erfahren Sie, was Sie damit machen können und wie Sie ihn verwenden.</p>
<p><strong>Springen Sie zu:</strong></p>
<ul>
<li><a href="#What-can-you-do-with-string-data">Was können Sie mit String-Daten tun?</a></li>
<li><a href="#How-to-manage-string-data-in-Milvus-21">Wie verwaltet man String-Daten in Milvus 2.1?</a><ul>
<li><a href="#Create-a-collection">Eine Sammlung erstellen</a></li>
<li><a href="#Insert-data">Einfügen und Löschen von Daten</a></li>
<li><a href="#Build-an-index">Einen Index erstellen</a></li>
<li><a href="#Hybrid-search">Hybride Suche</a></li>
<li><a href="#String-expressions">String-Ausdrücke</a></li>
</ul></li>
</ul>
<custom-h1>Was kann man mit String-Daten machen?</custom-h1><p>Die Unterstützung des Datentyps String war eine der von den Benutzern am meisten erwarteten Funktionen. Sie rationalisiert sowohl den Prozess der Erstellung einer Anwendung mit der Milvus-Vektordatenbank als auch die Geschwindigkeit der Ähnlichkeitssuche und der Vektorabfrage, wodurch die Effizienz erheblich gesteigert und die Wartungskosten der Anwendung, an der Sie arbeiten, reduziert werden.</p>
<p>Milvus 2.1 unterstützt insbesondere den VARCHAR-Datentyp, der Zeichenketten unterschiedlicher Länge speichert. Mit der Unterstützung des VARCHAR-Datentyps können Sie:</p>
<ol>
<li>Direkte Verwaltung von Zeichenkettendaten ohne die Hilfe einer externen relationalen Datenbank.</li>
</ol>
<p>Die Unterstützung des VARCHAR-Datentyps ermöglicht es Ihnen, beim Einfügen von Daten in Milvus den Schritt der Konvertierung von Zeichenketten in andere Datentypen zu überspringen. Nehmen wir an, Sie arbeiten an einem Buchsuchsystem für Ihren eigenen Online-Buchladen. Sie erstellen einen Buchdatensatz und möchten die Bücher mit ihren Namen identifizieren. Während Milvus in früheren Versionen den String-Datentyp nicht unterstützt, müssen Sie vor dem Einfügen von Daten in Milvus die Strings (die Namen der Bücher) mit Hilfe einer relationalen Datenbank wie MySQL in Buch-IDs umwandeln. Da jetzt der Datentyp String unterstützt wird, können Sie einfach ein Stringfeld erstellen und die Buchnamen anstelle der ID-Nummern direkt eingeben.</p>
<p>Die Bequemlichkeit gilt auch für den Such- und Abfrageprozess. Stellen Sie sich vor, es gibt einen Kunden, dessen Lieblingsbuch <em>"Hallo Milvus"</em> ist. Sie möchten im System nach ähnlichen Büchern suchen und sie dem Kunden empfehlen. In früheren Versionen von Milvus liefert Ihnen das System nur Buch-IDs, und Sie müssen einen zusätzlichen Schritt unternehmen, um die entsprechenden Buchinformationen in einer relationalen Datenbank zu überprüfen. In Milvus 2.1 können Sie jedoch die Buchnamen direkt abrufen, da Sie bereits ein String-Feld mit den Buchnamen darin erstellt haben.</p>
<p>Mit einem Wort, die Unterstützung des String-Datentyps erspart Ihnen den Aufwand, sich an andere Tools zu wenden, um String-Daten zu verwalten, was den Entwicklungsprozess erheblich vereinfacht.</p>
<ol start="2">
<li>Beschleunigen Sie die Geschwindigkeit der <a href="https://milvus.io/docs/v2.1.x/hybridsearch.md">hybriden Suche</a> und der <a href="https://milvus.io/docs/v2.1.x/query.md">Vektorabfrage</a> durch Attributfilterung.</li>
</ol>
<p>Wie andere skalare Datentypen kann VARCHAR für die Attributfilterung in der hybriden Suche und Vektorabfrage durch boolesche Ausdrücke verwendet werden. Besonders erwähnenswert ist, dass Milvus 2.1 den Operator <code translate="no">like</code> hinzufügt, der es Ihnen ermöglicht, ein Präfix-Matching durchzuführen. Außerdem können Sie mit dem Operator <code translate="no">==</code> ein exaktes Matching durchführen.</p>
<p>Außerdem wird ein MARISA-trie-basierter invertierter Index unterstützt, um die hybride Suche und Abfrage zu beschleunigen. Lesen Sie weiter und erfahren Sie alles über die String-Ausdrücke, die Sie kennen sollten, um die Attributfilterung mit String-Daten durchzuführen.</p>
<custom-h1>Wie verwaltet man String-Daten in Milvus 2.1?</custom-h1><p>Wir wissen jetzt, dass der String-Datentyp extrem nützlich ist, aber wann genau müssen wir diesen Datentyp bei der Erstellung unserer eigenen Anwendungen verwenden? Im Folgenden sehen Sie einige Code-Beispiele für Szenarien, die String-Daten beinhalten können, die Ihnen ein besseres Verständnis für die Verwaltung von VARCHAR-Daten in Milvus 2.1 vermitteln.</p>
<h2 id="Create-a-collection" class="common-anchor-header">Erstellen Sie eine Sammlung<button data-href="#Create-a-collection" class="anchor-icon" translate="no">
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
    </button></h2><p>Lassen Sie uns dem vorherigen Beispiel folgen. Sie arbeiten immer noch an dem Buchempfehlungssystem und möchten eine Buchsammlung mit einem Primärschlüsselfeld namens <code translate="no">book_name</code> erstellen, in das Sie Zeichenkettendaten einfügen werden. In diesem Fall können Sie den Datentyp als <code translate="no">DataType.VARCHAR</code>festlegen, wenn Sie das Feldschema einstellen, wie im folgenden Beispiel gezeigt.</p>
<p>Beachten Sie, dass Sie bei der Erstellung eines VARCHAR-Feldes die maximale Zeichenlänge über den Parameter <code translate="no">max_length</code> angeben müssen, dessen Wert zwischen 1 und 65.535 liegen kann.  In diesem Beispiel haben wir die maximale Länge auf 200 festgelegt.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> CollectionSchema, FieldSchema, DataType
book_id = FieldSchema(
  name=<span class="hljs-string">&quot;book_id&quot;</span>, 
  dtype=DataType.INT64, 
)
book_name = FieldSchema( 
  name=<span class="hljs-string">&quot;book_name&quot;</span>, 
  dtype=DataType.VARCHAR, 
  max_length=<span class="hljs-number">200</span>, 
  is_primary=<span class="hljs-literal">True</span>, 
)
word_count = FieldSchema(
  name=<span class="hljs-string">&quot;word_count&quot;</span>, 
  dtype=DataType.INT64,  
)
book_intro = FieldSchema(
  name=<span class="hljs-string">&quot;book_intro&quot;</span>, 
  dtype=DataType.FLOAT_VECTOR, 
  dim=<span class="hljs-number">2</span>
)
schema = CollectionSchema(
  fields=[book_id, word_count, book_intro], 
  description=<span class="hljs-string">&quot;Test book search&quot;</span>
)
collection_name = <span class="hljs-string">&quot;book&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Insert-data" class="common-anchor-header">Daten einfügen<button data-href="#Insert-data" class="anchor-icon" translate="no">
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
    </button></h2><p>Nun, da die Sammlung erstellt ist, können wir Daten in sie einfügen. Im folgenden Beispiel fügen wir 2.000 Zeilen mit zufällig generierten Zeichenketten ein.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">import</span> random
data = [
  [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
  [<span class="hljs-string">&quot;book_&quot;</span> + <span class="hljs-built_in">str</span>(i) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
  [i <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">10000</span>, <span class="hljs-number">12000</span>)],
  [[random.random() <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2</span>)] <span class="hljs-keyword">for</span> _ <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">2000</span>)],
]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Delete-data" class="common-anchor-header">Daten löschen<button data-href="#Delete-data" class="anchor-icon" translate="no">
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
    </button></h2><p>Angenommen, zwei Bücher mit den Namen <code translate="no">book_0</code> und <code translate="no">book_1</code> sind in Ihrem Shop nicht mehr verfügbar, so dass Sie die entsprechenden Informationen aus Ihrer Datenbank löschen möchten. In diesem Fall können Sie den Termausdruck <code translate="no">in</code> verwenden, um die zu löschenden Entitäten zu filtern, wie im folgenden Beispiel gezeigt.</p>
<p>Denken Sie daran, dass Milvus nur das Löschen von Entitäten mit eindeutig spezifizierten Primärschlüsseln unterstützt. Bevor Sie also den folgenden Code ausführen, stellen Sie sicher, dass Sie das Feld <code translate="no">book_name</code> als Primärschlüsselfeld festgelegt haben.</p>
<pre><code translate="no" class="language-Python">expr = <span class="hljs-string">&quot;book_name in [\&quot;book_0\&quot;, \&quot;book_1\&quot;]&quot;</span> 
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collection</span>
collection = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&quot;book&quot;</span>)     
collection.<span class="hljs-title function_">delete</span>(expr)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Build-an-Index" class="common-anchor-header">Einen Index erstellen<button data-href="#Build-an-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 unterstützt den Aufbau von skalaren Indizes, was die Filterung von String-Feldern erheblich beschleunigt. Im Gegensatz zur Erstellung eines Vektorindexes müssen Sie vor der Erstellung eines skalaren Indexes keine Parameter vorbereiten. Milvus unterstützt vorübergehend nur den Dictionary Tree (MARISA-trie) Index, so dass der Indextyp eines VARCHAR-Feldes standardmäßig MARISA-trie ist.</p>
<p>Sie können den Indexnamen beim Erstellen des Indexes angeben. Wenn er nicht angegeben wird, lautet der Standardwert von <code translate="no">index_name</code> <code translate="no">&quot;_default_idx_&quot;</code> . Im folgenden Beispiel haben wir den Index <code translate="no">scalar_index</code> genannt.</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">Collection</span>
collection = <span class="hljs-title class_">Collection</span>(<span class="hljs-string">&quot;book&quot;</span>)   
collection.<span class="hljs-title function_">create_index</span>(
  field_name=<span class="hljs-string">&quot;book_name&quot;</span>, 
  index_name=<span class="hljs-string">&quot;scalar_index&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Hybrid-search" class="common-anchor-header">Hybride Suche<button data-href="#Hybrid-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Durch die Angabe von booleschen Ausdrücken können Sie die String-Felder während einer Vektorähnlichkeitssuche filtern.</p>
<p>Wenn Sie beispielsweise nach Büchern suchen, deren Intro Hello Milvus am ähnlichsten ist, aber nur die Bücher erhalten möchten, deren Namen mit "book_2" beginnen, können Sie den Operator <code translate="no">like</code>verwenden, um eine Präfix-Übereinstimmung durchzuführen und die gewünschten Bücher zu erhalten, wie im folgenden Beispiel gezeigt.</p>
<pre><code translate="no" class="language-Python">search_param = {
  <span class="hljs-string">&quot;data&quot;</span>: [[<span class="hljs-number">0.1</span>, <span class="hljs-number">0.2</span>]],
  <span class="hljs-string">&quot;anns_field&quot;</span>: <span class="hljs-string">&quot;book_intro&quot;</span>,
  <span class="hljs-string">&quot;param&quot;</span>: {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
  <span class="hljs-string">&quot;limit&quot;</span>: <span class="hljs-number">2</span>,
  <span class="hljs-string">&quot;expr&quot;</span>: <span class="hljs-string">&quot;book_name like \&quot;Hello%\&quot;&quot;</span>,
}
res = collection.<span class="hljs-title function_">search</span>(**search_param)
<button class="copy-code-btn"></button></code></pre>
<h2 id="String-expressions" class="common-anchor-header">String-Ausdrücke<button data-href="#String-expressions" class="anchor-icon" translate="no">
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
    </button></h2><p>Neben dem neu hinzugefügten Operator <code translate="no">like</code> können auch andere Operatoren, die bereits in früheren Versionen von Milvus unterstützt wurden, für die Filterung von Stringfeldern verwendet werden. Im Folgenden finden Sie einige Beispiele für häufig verwendete <a href="https://milvus.io/docs/v2.1.x/boolean.md">String-Ausdrücke</a>, wobei <code translate="no">A</code> ein Feld vom Typ VARCHAR darstellt. Denken Sie daran, dass alle unten aufgeführten String-Ausdrücke mit logischen Operatoren wie AND, OR und NOT logisch kombiniert werden können.</p>
<h3 id="Set-operations" class="common-anchor-header">Mengenoperationen</h3><p>Sie können <code translate="no">in</code> und <code translate="no">not in</code> verwenden, um Mengenoperationen zu realisieren, wie z. B. <code translate="no">A in [&quot;str1&quot;, &quot;str2&quot;]</code>.</p>
<h3 id="Compare-two-string-fields" class="common-anchor-header">Vergleich zweier Stringfelder</h3><p>Sie können relationale Operatoren verwenden, um die Werte von zwei Stringfeldern zu vergleichen. Solche relationalen Operatoren sind <code translate="no">==</code>, <code translate="no">!=</code>, <code translate="no">&gt;</code>, <code translate="no">&gt;=</code>, <code translate="no">&lt;</code>, <code translate="no">&lt;=</code>. Weitere Informationen finden Sie unter <a href="https://milvus.io/docs/v2.1.x/boolean.md#Relational-operators">Relationale Operatoren</a>.</p>
<p>Beachten Sie, dass Zeichenfolgenfelder nur mit anderen Zeichenfolgenfeldern und nicht mit Feldern anderer Datentypen verglichen werden können. Zum Beispiel kann ein Feld vom Typ VARCHAR nicht mit einem Feld vom Typ Boolean oder vom Typ Integer verglichen werden.</p>
<h3 id="Compare-a-field-with-a-constant-value" class="common-anchor-header">Vergleich eines Felds mit einem konstanten Wert</h3><p>Sie können <code translate="no">==</code> oder <code translate="no">!=</code> verwenden, um zu überprüfen, ob der Wert eines Felds gleich einem konstanten Wert ist.</p>
<h3 id="Filter-fields-with-a-single-range" class="common-anchor-header">Filtern von Feldern mit einem einzigen Bereich</h3><p>Sie können <code translate="no">&gt;</code>, <code translate="no">&gt;=</code>, <code translate="no">&lt;</code>, <code translate="no">&lt;=</code> verwenden, um Zeichenkettenfelder mit einem einzigen Bereich zu filtern, z. B. <code translate="no">A &gt; &quot;str1&quot;</code>.</p>
<h3 id="Prefix-matching" class="common-anchor-header">Präfix-Abgleich</h3><p>Wie bereits erwähnt, fügt Milvus 2.1 den Operator <code translate="no">like</code> für den Präfixabgleich hinzu, z. B. <code translate="no">A like &quot;prefix%&quot;</code>.</p>
<h2 id="Whats-next" class="common-anchor-header">Was kommt als Nächstes?<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Mit der offiziellen Freigabe von Milvus 2.1 haben wir eine Reihe von Blogs vorbereitet, in denen die neuen Funktionen vorgestellt werden. Lesen Sie mehr in dieser Blogserie:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">Wie Sie String-Daten nutzen, um Ihre Anwendungen für die Ähnlichkeitssuche zu verbessern</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Verwendung von Embedded Milvus zur sofortigen Installation und Ausführung von Milvus mit Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Erhöhen Sie den Lesedurchsatz Ihrer Vektordatenbank mit In-Memory-Replikaten</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Verständnis der Konsistenzebene in der Milvus-Vektordatenbank</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Verständnis der Konsistenzstufe in der Milvus-Vektordatenbank (Teil II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Wie gewährleistet die Milvus-Vektor-Datenbank die Datensicherheit?</a></li>
</ul>
