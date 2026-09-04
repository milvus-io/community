---
id: what-is-vector-database-and-how-it-works.md
title: Was genau ist eine Vektordatenbank und wie funktioniert sie?
author: Zilliz
date: 2025-03-24T00:00:00.000Z
desc: >-
  Eine Vektordatenbank speichert, indiziert und durchsucht Vektor-Embeddings,
  die von Machine-Learning-Modellen erzeugt werden, für schnelle
  Informationsabfrage und Ähnlichkeitssuche.
cover: assets.zilliz.com/What_s_a_Vector_Database_and_How_Does_It_Work_cac0875415.png
tag: Engineering
canonicalUrl: 'https://milvus.io/blog/what-is-a-vector-database.md'
---
<p>Eine Vektordatenbank indexiert und speichert Vektor-Embeddings für schnelle Abfragen und Ähnlichkeitssuche, mit Funktionen wie CRUD-Operationen, Metadaten-Filterung und horizontaler Skalierung, die speziell für KI-Anwendungen entwickelt wurden.</p>
<iframe width="100%" height="315" src="https://www.youtube.com/embed/4yQjsY5iD9Q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
<h2 id="Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="common-anchor-header">Einleitung: Der Aufstieg der Vektordatenbanken im KI-Zeitalter<button data-href="#Introduction-The-Rise-of-Vector-Databases-in-the-AI-Era" class="anchor-icon" translate="no">
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
    </button></h2><p>In den frühen Tagen von ImageNet brauchte es 25.000 menschliche Kuratoren, um den Datensatz manuell zu kennzeichnen. Diese erstaunliche Zahl verdeutlicht eine grundlegende Herausforderung in der KI: Die manuelle Kategorisierung unstrukturierter Daten lässt sich einfach nicht skalieren. Da täglich Milliarden von Bildern, Videos, Dokumenten und Audiodateien erzeugt werden, war ein Paradigmenwechsel erforderlich, wie Computer Inhalte verstehen und mit ihnen interagieren.</p>
<p><a href="https://zilliz.com/blog/relational-databases-vs-vector-databases">Traditionelle relationale Datenbanksysteme</a> zeichnen sich durch die Verwaltung strukturierter Daten mit vordefinierten Formaten und die Ausführung präziser Suchoperationen aus. Im Gegensatz dazu sind Vektordatenbanken auf die Speicherung und den Abruf <a href="https://zilliz.com/learn/introduction-to-unstructured-data">unstrukturierter Daten</a> spezialisiert, wie Bilder, Audio, Videos und Textinhalte, mithilfe hochdimensionaler numerischer Darstellungen, die als Vektor-Embeddings bezeichnet werden. Vektordatenbanken unterstützen <a href="https://zilliz.com/glossary/large-language-models-(llms)">große Sprachmodelle</a>, indem sie eine effiziente Datenabfrage und -verwaltung ermöglichen. Moderne Vektordatenbanken übertreffen traditionelle Systeme um das 2- bis 10-fache durch hardwarebewusste Optimierung (AVX512, SIMD, GPUs, NVMe-SSDs), hochoptimierte Suchalgorithmen (HNSW, IVF, DiskANN) und spaltenorientiertes Speicherdesign. Ihre cloud-native, entkoppelte Architektur ermöglicht die unabhängige Skalierung von Such-, Dateneinfügungs- und Indexierungskomponenten, sodass Systeme Milliarden von Vektoren effizient verarbeiten können, während sie die Leistung für Unternehmens-KI-Anwendungen bei Unternehmen wie Salesforce, PayPal, eBay und NVIDIA aufrechterhalten.</p>
<p>Dies stellt das dar, was Experten eine „semantische Lücke“ nennen – traditionelle Datenbanken arbeiten mit exakten Übereinstimmungen und vordefinierten Beziehungen, während das menschliche Verständnis von Inhalten nuanciert, kontextuell und mehrdimensional ist. Diese Lücke wird zunehmend problematisch, da KI-Anwendungen Folgendes verlangen:</p>
<ul>
<li><p>Konzeptuelle Ähnlichkeiten finden statt exakter Übereinstimmungen</p></li>
<li><p>Kontextuelle Beziehungen zwischen verschiedenen Inhalten verstehen</p></li>
<li><p>Das semantische Wesen von Informationen über Schlüsselwörter hinaus erfassen</p></li>
<li><p>Multimodale Daten in einem einheitlichen Rahmen verarbeiten</p></li>
</ul>
<p>Vektordatenbanken haben sich als die entscheidende Technologie zur Überbrückung dieser Lücke erwiesen und sind zu einem wesentlichen Bestandteil der modernen KI-Infrastruktur geworden. Sie verbessern die Leistung von Machine-Learning-Modellen, indem sie Aufgaben wie Clustering und Klassifikation erleichtern.</p>
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/episode/1T6K6wlZuryLbETUrafO9f?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
<h2 id="Understanding-Vector-Embeddings-The-Foundation" class="common-anchor-header">Vektor-Embeddings verstehen: Die Grundlage<button data-href="#Understanding-Vector-Embeddings-The-Foundation" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/glossary/vector-embeddings">Vektor-Embeddings</a> dienen als kritische Brücke über die semantische Lücke. Diese hochdimensionalen numerischen Darstellungen erfassen das semantische Wesen unstrukturierter Daten in einer Form, die Computer effizient verarbeiten können. Moderne Embedding-Modelle transformieren rohe Inhalte – ob Text, Bilder oder Audio – in dichte Vektoren, bei denen ähnliche Konzepte im Vektorraum gruppiert werden, unabhängig von oberflächlichen Unterschieden.</p>
<p>Beispielsweise würden korrekt konstruierte Embeddings Konzepte wie „Automobil“, „Auto“ und „Fahrzeug“ im Vektorraum nahe beieinander positionieren, obwohl sie unterschiedliche lexikalische Formen haben. Diese Eigenschaft ermöglicht <a href="https://zilliz.com/glossary/semantic-search">semantische Suche</a>, <a href="https://zilliz.com/vector-database-use-cases/recommender-system">Empfehlungssysteme</a> und KI-Anwendungen, Inhalte über einfaches Musterabgleichen hinaus zu verstehen.</p>
<p>Die Leistungsfähigkeit von Embeddings erstreckt sich über verschiedene Modalitäten. Fortschrittliche Vektordatenbanken unterstützen verschiedene unstrukturierte Datentypen – Text, Bilder, Audio – in einem einheitlichen System und ermöglichen so modalitätsübergreifende Suchen und Beziehungen, die zuvor nicht effizient modelliert werden konnten. Diese Fähigkeiten von Vektordatenbanken sind entscheidend für KI-gesteuerte Technologien wie Chatbots und Bilderkennungssysteme und unterstützen fortgeschrittene Anwendungen wie semantische Suche und Empfehlungssysteme.</p>
<p>Die Speicherung, Indexierung und der Abruf von Embeddings im großen Maßstab stellen jedoch einzigartige rechnerische Herausforderungen dar, für die traditionelle Datenbanken nicht ausgelegt waren.</p>
<h2 id="Vector-Databases-Core-Concepts" class="common-anchor-header">Vektordatenbanken: Kernkonzepte<button data-href="#Vector-Databases-Core-Concepts" class="anchor-icon" translate="no">
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
    </button></h2><p>Vektordatenbanken stellen einen Paradigmenwechsel dar, wie wir unstrukturierte Daten speichern und abfragen. Im Gegensatz zu traditionellen relationalen Datenbanksystemen, die sich durch die Verwaltung strukturierter Daten mit vordefinierten Formaten auszeichnen, sind Vektordatenbanken auf die Verarbeitung unstrukturierter Daten durch numerische Vektordarstellungen spezialisiert.</p>
<p>Im Kern sind Vektordatenbanken darauf ausgelegt, ein grundlegendes Problem zu lösen: die Ermöglichung effizienter Ähnlichkeitssuchen über massive Datensätze unstrukturierter Daten. Sie erreichen dies durch drei Schlüsselkomponenten:</p>
<p><strong>Vektor-Embeddings</strong>: Hochdimensionale numerische Darstellungen, die die semantische Bedeutung unstrukturierter Daten (Text, Bilder, Audio usw.) erfassen.</p>
<p><strong>Spezialisierte Indexierung</strong>: Algorithmen, die für hochdimensionale Vektorräume optimiert sind und schnelle approximative Suchen ermöglichen. Vektordatenbanken indexieren Vektoren, um die Geschwindigkeit und Effizienz von Ähnlichkeitssuchen zu verbessern, und nutzen dabei verschiedene ML-Algorithmen zur Erstellung von Indizes auf Vektor-Embeddings.</p>
<p><a href="https://zilliz.com/blog/similarity-metrics-for-vector-search"><strong>Distanzmetriken</strong></a>: Mathematische Funktionen, die die Ähnlichkeit zwischen Vektoren quantifizieren.</p>
<p>Die primäre Operation in einer Vektordatenbank ist die <a href="https://zilliz.com/blog/k-nearest-neighbor-algorithm-for-machine-learning">k-nächste-Nachbarn</a>-Abfrage (KNN), die die k Vektoren findet, die einem gegebenen Abfragevektor am ähnlichsten sind. Für groß angelegte Anwendungen implementieren diese Datenbanken typischerweise <a href="https://zilliz.com/glossary/anns">Approximate-Nearest-Neighbor</a>-Algorithmen (ANN), die eine kleine Menge an Genauigkeit gegen erhebliche Gewinne bei der Suchgeschwindigkeit eintauschen.</p>
<h3 id="Mathematical-Foundations-of-Vector-Similarity" class="common-anchor-header">Mathematische Grundlagen der Vektorähnlichkeit</h3><p>Um Vektordatenbanken zu verstehen, muss man die mathematischen Prinzipien hinter der Vektorähnlichkeit erfassen. Hier sind die grundlegenden Konzepte:</p>
<h3 id="Vector-Spaces-and-Embeddings" class="common-anchor-header">Vektorräume und Embeddings</h3><p>Ein <a href="https://zilliz.com/learn/everything-you-should-know-about-vector-embeddings">Vektor-Embedding</a> ist ein Array fester Länge von Gleitkommazahlen (sie können zwischen 100 und 32.768 Dimensionen haben!), das unstrukturierte Daten in einem numerischen Format darstellt. Diese Embeddings positionieren ähnliche Elemente in einem hochdimensionalen Vektorraum näher beieinander.</p>
<p>Zum Beispiel hätten die Wörter „König“ und „Königin“ in einem gut trainierten Wort-Embedding-Raum Vektordarstellungen, die näher beieinander liegen als jedes von ihnen zu „Automobil“.</p>
<h3 id="Distance-Metrics" class="common-anchor-header">Distanzmetriken</h3><p>Die Wahl der Distanzmetrik beeinflusst grundlegend, wie Ähnlichkeit berechnet wird. Übliche Distanzmetriken sind:</p>
<ol>
<li><p><strong>Euklidische Distanz</strong>: Die geradlinige Entfernung zwischen zwei Punkten im euklidischen Raum.</p></li>
<li><p><strong>Kosinus-Ähnlichkeit</strong>: Misst den Kosinus des Winkels zwischen zwei Vektoren und konzentriert sich auf die Ausrichtung statt auf die Größe.</p></li>
<li><p><strong>Skalarprodukt</strong>: Für normalisierte Vektoren gibt es an, wie stark zwei Vektoren ausgerichtet sind.</p></li>
<li><p><strong>Manhattan-Distanz (L1-Norm)</strong>: Summe der absoluten Differenzen zwischen Koordinaten.</p></li>
</ol>
<p>Verschiedene Anwendungsfälle können unterschiedliche Distanzmetriken erfordern. Zum Beispiel funktioniert die Kosinus-Ähnlichkeit oft gut für Text-Embeddings, während die euklidische Distanz für bestimmte Arten von <a href="https://zilliz.com/learn/image-embeddings-for-enhanced-image-search">Bild-Embeddings</a> besser geeignet sein kann.</p>
<p><a href="https://zilliz.com/glossary/semantic-similarity">Semantische Ähnlichkeit</a> zwischen Vektoren in einem Vektorraum</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Semantic_similarity_between_vectors_in_a_vector_space_ee6fb35909.png" alt="Semantic similarity between vectors in a vector space" class="doc-image" id="semantic-similarity-between-vectors-in-a-vector-space" />
    <span>Semantische Ähnlichkeit zwischen Vektoren in einem Vektorraum</span>
  </span>
</p>
<p>Das Verständnis dieser mathematischen Grundlagen führt zu einer wichtigen Frage zur Implementierung: Also einfach einen V
