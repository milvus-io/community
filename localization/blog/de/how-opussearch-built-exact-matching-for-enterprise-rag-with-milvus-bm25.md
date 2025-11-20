---
id: how-opussearch-built-exact-matching-for-enterprise-rag-with-milvus-bm25.md
title: Wie OpusSearch Exact Matching für Enterprise RAG mit Milvus BM25 aufbaute
author: Chronos Kou
date: 2025-10-17T00:00:00.000Z
cover: assets.zilliz.com/opus_cover_new_1505263938.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, enterprise RAG, vector database, semantic search'
meta_title: How OpusSearch Built Exact Matching for Enterprise RAG with Milvus
desc: >-
  Erfahren Sie, wie OpusSearch Milvus BM25 für den exakten Abgleich in
  RAG-Systemen von Unternehmen einsetzt und dabei die semantische Suche mit der
  präzisen Abfrage von Schlüsselwörtern kombiniert.
origin: >-
  https://medium.com/opus-engineering/how-opussearch-built-exact-matching-for-enterprise-rag-with-milvus-bm25-aa1098a9888b
---
<p>Dieser Beitrag wurde ursprünglich auf <a href="https://medium.com/opus-engineering/how-opussearch-built-exact-matching-for-enterprise-rag-with-milvus-bm25-aa1098a9888b">Medium</a> veröffentlicht und wird hier mit Genehmigung wiederveröffentlicht.</p>
<h2 id="The-Semantic-Search-Blind-Spot" class="common-anchor-header">Der blinde Fleck der semantischen Suche<button data-href="#The-Semantic-Search-Blind-Spot" class="anchor-icon" translate="no">
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
    </button></h2><p>Stellen Sie sich Folgendes vor: Sie sind ein Video-Editor unter Zeitdruck. Sie brauchen Clips aus "Folge 281" Ihres Podcasts. Sie geben den Begriff in unsere Suche ein. Unsere KI-gesteuerte semantische Suche, die auf ihre Intelligenz stolz ist, liefert Clips aus 280, 282 und schlägt sogar Folge 218 vor, weil die Nummern ähnlich sind, richtig?</p>
<p><strong>Falsch</strong>.</p>
<p>Als wir <a href="https://www.opus.pro/opussearch">OpusSearch</a> im Januar 2025 für Unternehmen einführten, dachten wir, die semantische Suche würde ausreichen. Natürlichsprachliche Abfragen wie "Finde lustige Momente über Dating" funktionierten wunderbar. Unser <a href="https://milvus.io/">Milvus-gestütztes</a> RAG-System war ein Volltreffer.</p>
<p><strong>Doch dann schlug uns die Realität mit dem Feedback der Nutzer ins Gesicht:</strong></p>
<p>"Ich will nur Clips aus Folge 281. Warum ist das so schwer?"</p>
<p>"Wenn ich 'Das hat sie gesagt' suche, will ich genau diesen Satz, nicht 'Das hat er gemeint'.</p>
<p>Es hat sich herausgestellt, dass Video-Editoren und Clipper nicht immer wollen, dass KI clever ist. Manchmal wollen sie, dass die Software <strong>einfach und korrekt</strong> ist.</p>
<h2 id="Why-do-we-care-about-Search" class="common-anchor-header">Warum ist uns die Suche wichtig?<button data-href="#Why-do-we-care-about-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir haben eine <a href="https://www.opus.pro/opussearch">Suchfunktion für Unternehmen</a> entwickelt, weil wir erkannt haben, dass die <strong>Monetarisierung</strong> großer Videokataloge die größte Herausforderung für Unternehmen darstellt. Unsere von RAG betriebene Plattform dient als <strong>Wachstumsfaktor</strong>, der es Unternehmen ermöglicht, <strong>ihre gesamten Videobibliotheken zu durchsuchen, wiederzuverwenden und zu vermarkten</strong>. Lesen Sie <a href="https://www.opus.pro/blog/growing-a-new-youtube-channel-in-90-days-without-creating-new-videos">hier</a> über die Erfolgsgeschichten von <strong>All The Smoke</strong>, <strong>KFC Radio</strong> und <strong>TFTC</strong>.</p>
<h2 id="Why-We-Doubled-Down-on-Milvus-Instead-of-Adding-Another-Database" class="common-anchor-header">Warum wir uns für Milvus entschieden haben (anstatt eine weitere Datenbank hinzuzufügen)<button data-href="#Why-We-Doubled-Down-on-Milvus-Instead-of-Adding-Another-Database" class="anchor-icon" translate="no">
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
    </button></h2><p>Die naheliegende Lösung war, Elasticsearch oder MongoDB für den exakten Abgleich hinzuzufügen. Für ein Startup-Unternehmen bedeutet die Verwaltung mehrerer Suchsysteme jedoch einen erheblichen betrieblichen Aufwand und eine hohe Komplexität.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Strong_community_adoption_with_35k_Git_Hub_stars_fbf773dcdb.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvus hatte vor kurzem seine Volltextsuchfunktion auf den Markt gebracht, und eine Evaluierung mit unserem eigenen Datensatz <strong>ohne jegliche Anpassung</strong> zeigte überzeugende Vorteile:</p>
<ul>
<li><p><strong>Hervorragende Genauigkeit beim partiellen Abgleich</strong>. Zum Beispiel "drinking story" und "jumping high", andere Vektor-DBs geben manchmal "dining story" und "getting high" zurück, was die Bedeutung verfälscht.</p></li>
<li><p>Milvus <strong>liefert</strong> bei allgemeinen Abfragen <strong>längere, umfassendere Ergebnisse</strong> als andere Datenbanken, was für unseren Anwendungsfall natürlich idealer ist.</p></li>
</ul>
<h2 id="Architecture-from-5000-feet" class="common-anchor-header">Architektur aus 5000 Fuß Höhe<button data-href="#Architecture-from-5000-feet" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_is_the_foundational_vector_database_for_our_Enterprise_RAG_architecture_b3c8ebf39c.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="BM25-+-Filtering--Exact-Match-Magic" class="common-anchor-header">BM25 + Filterung = exakte Treffer-Magie<button data-href="#BM25-+-Filtering--Exact-Match-Magic" class="anchor-icon" translate="no">
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
    </button></h2><p>Bei der Volltextsuche von Milvus geht es nicht wirklich um exakten Abgleich, sondern um Relevanzbewertung mit BM25<a href="https://en.wikipedia.org/wiki/Okapi_BM25">(Best Matching 25</a>), die berechnet, wie relevant ein Dokument für Ihre Anfrage ist. Das ist großartig für "Finde etwas, das mir ähnlich ist", aber schrecklich für "Finde genau das".</p>
<p>Wir haben dann <strong>die Leistung von BM25 mit der TEXT_MATCH-Filterung von Milvus kombiniert</strong>. Und so funktioniert es:</p>
<ol>
<li><p><strong>Zuerst filtern</strong>: TEXT_MATCH findet Dokumente, die Ihre exakten Schlüsselwörter enthalten</p></li>
<li><p><strong>Zweiter Rang</strong>: BM25 sortiert diese exakten Übereinstimmungen nach Relevanz</p></li>
<li><p><strong>Sieg</strong>: Sie erhalten exakte Treffer, die intelligent geordnet sind.</p></li>
</ol>
<p>Stellen Sie sich das so vor: "Gib mir alles, was 'Folge 281' enthält, und zeige mir dann die besten zuerst.</p>
<h2 id="The-Code-That-Made-It-Work" class="common-anchor-header">Der Code, mit dem es funktioniert<button data-href="#The-Code-That-Made-It-Work" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Schema-Design" class="common-anchor-header">Schema-Entwurf</h3><p><strong>Wichtig</strong>: Wir haben Stoppwörter vollständig deaktiviert, da Begriffe wie "The Office" und "Office" unterschiedliche Entitäten in unserem Inhaltsbereich darstellen.</p>
<pre><code translate="no"><span class="hljs-built_in">export</span> <span class="hljs-keyword">function</span> getExactMatchFields(): FieldType[] {
 <span class="hljs-built_in">return</span> [
   {
     name: <span class="hljs-string">&quot;id&quot;</span>,
     data_type: DataType.VarChar,
     is_primary_key: <span class="hljs-literal">true</span>,
     max_length: 100,
   },
   {
     name: <span class="hljs-string">&quot;text&quot;</span>,
     data_type: DataType.VarChar,
     max_length: 1000,
     enable_analyzer: <span class="hljs-literal">true</span>,
     enable_match: <span class="hljs-literal">true</span>,  // This is the magic flag
     analyzer_params: {
       tokenizer: <span class="hljs-string">&#x27;standard&#x27;</span>,
       filter: [
         <span class="hljs-string">&#x27;lowercase&#x27;</span>,
         {
           <span class="hljs-built_in">type</span>: <span class="hljs-string">&#x27;stemmer&#x27;</span>,
           language: <span class="hljs-string">&#x27;english&#x27;</span>,  // <span class="hljs-string">&quot;running&quot;</span> matches <span class="hljs-string">&quot;run&quot;</span>
         },
         {
           <span class="hljs-built_in">type</span>: <span class="hljs-string">&#x27;stop&#x27;</span>,
           stop_words: [],  // Keep ALL words (even <span class="hljs-string">&quot;the&quot;</span>, <span class="hljs-string">&quot;a&quot;</span>)
         },
       ],
     },
   },
   {
     name: <span class="hljs-string">&quot;sparse_vector&quot;</span>,
     data_type: DataType.SparseFloatVector,
   },
 ]
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="BM25-Function-Setup" class="common-anchor-header">Einrichtung der BM25-Funktion</h3><pre><code translate="no"><span class="hljs-keyword">export</span> <span class="hljs-keyword">const</span> <span class="hljs-attr">FUNCTIONS</span>: <span class="hljs-title class_">FunctionObject</span>[] = [
 {
   <span class="hljs-attr">name</span>: <span class="hljs-string">&#x27;text_bm25_embedding&#x27;</span>,
   <span class="hljs-attr">type</span>: <span class="hljs-title class_">FunctionType</span>.<span class="hljs-property">BM25</span>,
   <span class="hljs-attr">input_field_names</span>: [<span class="hljs-string">&#x27;text&#x27;</span>],
   <span class="hljs-attr">output_field_names</span>: [<span class="hljs-string">&#x27;sparse_vector&#x27;</span>],
   <span class="hljs-attr">params</span>: {},
 },
]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Index-Config" class="common-anchor-header">Index-Konfiguration</h3><p>Die Parameter bm25_k1 und bm25_b wurden anhand unseres Produktionsdatensatzes auf optimale Leistung abgestimmt.</p>
<p><strong>bm25_k1</strong>: Höhere Werte (bis zu ~2,0) geben wiederholtem Auftreten von Begriffen mehr Gewicht, während niedrigere Werte den Einfluss der Begriffshäufigkeit nach den ersten paar Vorkommnissen verringern.</p>
<p><strong>bm25_b</strong>: Werte, die näher bei 1,0 liegen, benachteiligen längere Dokumente stark, während Werte, die näher bei 0 liegen, die Dokumentlänge völlig ignorieren.</p>
<pre><code translate="no">index_params: [
 {
   field_name: <span class="hljs-string">&#x27;sparse_vector&#x27;</span>,
   index_type: <span class="hljs-string">&#x27;SPARSE_INVERTED_INDEX&#x27;</span>,
   metric_type: <span class="hljs-string">&#x27;BM25&#x27;</span>,
   <span class="hljs-keyword">params</span>: {
     inverted_index_algo: <span class="hljs-string">&#x27;DAAT_MAXSCORE&#x27;</span>,
     bm25_k1: <span class="hljs-number">1.2</span>,  <span class="hljs-comment">// How much does term frequency matter?</span>
     bm25_b: <span class="hljs-number">0.75</span>,  <span class="hljs-comment">// How much does document length matter?</span>
   },
 },
],
<button class="copy-code-btn"></button></code></pre>
<h3 id="The-Search-Query-That-Started-Working" class="common-anchor-header">Die Suchabfrage, die zu funktionieren begann</h3><pre><code translate="no"><span class="hljs-keyword">await</span> <span class="hljs-variable language_">this</span>.<span class="hljs-property">milvusClient</span>.<span class="hljs-title function_">search</span>({
 <span class="hljs-attr">collection_name</span>: <span class="hljs-string">&#x27;my_collection&#x27;</span>,
 <span class="hljs-attr">limit</span>: <span class="hljs-number">30</span>,
 <span class="hljs-attr">output_fields</span>: [<span class="hljs-string">&#x27;id&#x27;</span>, <span class="hljs-string">&#x27;text&#x27;</span>],
 <span class="hljs-attr">filter</span>: <span class="hljs-string">`TEXT_MATCH(text, &quot;episode 281&quot;)`</span>,  <span class="hljs-comment">// Exact match filter</span>
 <span class="hljs-attr">anns_field</span>: <span class="hljs-string">&#x27;sparse_vector&#x27;</span>,
 <span class="hljs-attr">data</span>: <span class="hljs-string">&#x27;episode 281&#x27;</span>,  <span class="hljs-comment">// BM25 ranking query</span>
})
<button class="copy-code-btn"></button></code></pre>
<p>Für exakte Übereinstimmungen mehrerer Begriffe:</p>
<pre><code translate="no"><span class="hljs-built_in">filter</span>: `TEXT_MATCH(text, <span class="hljs-string">&quot;foo&quot;</span>) <span class="hljs-keyword">and</span> TEXT_MATCH(text, <span class="hljs-string">&quot;bar&quot;</span>)`
<button class="copy-code-btn"></button></code></pre>
<h2 id="The-Mistakes-We-Made-So-You-Don’t-Have-To" class="common-anchor-header">Die Fehler, die wir gemacht haben (damit Sie sie nicht machen müssen)<button data-href="#The-Mistakes-We-Made-So-You-Don’t-Have-To" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Dynamic-Fields-Critical-for-Production-Flexibility" class="common-anchor-header">Dynamische Felder: Entscheidend für die Produktionsflexibilität</h3><p>Ursprünglich hatten wir keine dynamischen Felder aktiviert, was problematisch war. Schemaänderungen erforderten das Löschen und Neuanlegen von Sammlungen in Produktionsumgebungen.</p>
<pre><code translate="no"><span class="hljs-keyword">await</span> <span class="hljs-variable language_">this</span>.<span class="hljs-property">milvusClient</span>.<span class="hljs-title function_">createCollection</span>({
 <span class="hljs-attr">collection_name</span>: collectionName,
 <span class="hljs-attr">fields</span>: fields,
 <span class="hljs-attr">enable_dynamic_field</span>: <span class="hljs-literal">true</span>,  <span class="hljs-comment">// DO THIS</span>
 <span class="hljs-comment">// ... rest of config</span>
})
<button class="copy-code-btn"></button></code></pre>
<h3 id="Collection-Design-Maintain-Clear-Separation-of-Concerns" class="common-anchor-header">Sammlungsdesign: Klare Trennung der Bereiche beibehalten</h3><p>Unsere Architektur verwendet dedizierte Sammlungen pro Funktionsbereich. Dieser modulare Ansatz minimiert die Auswirkungen von Schemaänderungen und verbessert die Wartungsfreundlichkeit.</p>
<h3 id="Memory-Usage-Optimize-with-MMAP" class="common-anchor-header">Speicherverwendung: Optimieren mit MMAP</h3><p>Spärliche Indizes erfordern eine erhebliche Speicherzuweisung. Für große Textdatensätze empfehlen wir, MMAP so zu konfigurieren, dass Plattenspeicher verwendet wird. Dieser Ansatz erfordert eine angemessene E/A-Kapazität, um die Leistungsmerkmale beizubehalten.</p>
<pre><code translate="no"><span class="hljs-comment">// In your Milvus configuration</span>
<span class="hljs-attr">use_mmap</span>: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<h2 id="Production-Impact-and-Results" class="common-anchor-header">Auswirkungen auf die Produktion und Ergebnisse<button data-href="#Production-Impact-and-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>Nach der Einführung der exakten Übereinstimmungsfunktionalität im Juni 2025 konnten wir messbare Verbesserungen bei der Benutzerzufriedenheit und eine Verringerung des Supportvolumens für suchbezogene Probleme feststellen. Unser Dual-Mode-Ansatz ermöglicht die semantische Suche für explorative Abfragen und bietet gleichzeitig einen präzisen Abgleich für die Suche nach bestimmten Inhalten.</p>
<p>Der wichtigste architektonische Vorteil ist die Beibehaltung eines einzigen Datenbanksystems, das beide Suchparadigmen unterstützt, was die betriebliche Komplexität reduziert und gleichzeitig die Funktionalität erweitert.</p>
<h2 id="What’s-Next" class="common-anchor-header">Was steht als Nächstes an?<button data-href="#What’s-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir experimentieren mit <strong>hybriden</strong> <strong>Abfragen, die semantische und exakte Übereinstimmungen in einer einzigen Suche kombinieren</strong>. Stellen Sie sich vor: "Finde lustige Clips aus Folge 281", wobei "lustig" die semantische Suche und "Folge 281" die exakte Übereinstimmung verwendet.</p>
<p>Die Zukunft der Suche liegt nicht darin, sich zwischen semantischer KI und exakter Übereinstimmung zu entscheiden. Es geht darum, <strong>beides</strong> auf intelligente Weise im selben System zu nutzen.</p>
