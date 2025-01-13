---
id: milvus-2-4-nvidia-cagra-gpu-index-multivector-search-sparse-vector-support.md
title: >-
  Enthüllung von Milvus 2.4: Multivektorsuche, Sparse Vector, CAGRA Index und
  mehr!
author: Fendy Feng
date: 2024-3-20
desc: >-
  Wir freuen uns, die Einführung von Milvus 2.4 ankündigen zu können, eine
  bedeutende Verbesserung der Suchfunktionen für große Datensätze.
metaTitle: 'Milvus 2.4 Supports Multi-vector Search, Sparse Vector, CAGRA, and More!'
cover: assets.zilliz.com/What_is_new_in_Milvus_2_4_1_c580220be3.png
tag: Engineering
tags: >-
  Data science, Database, Tech, Artificial Intelligence, Vector Management,
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-4-nvidia-cagra-gpu-index-multivector-search-sparse-vector-support.md
---
<p>Wir freuen uns, die Einführung von Milvus 2.4 ankündigen zu können, eine bedeutende Weiterentwicklung der Suchfunktionen für große Datensätze. Diese neueste Version bietet neue Funktionen wie Unterstützung für den GPU-basierten CAGRA-Index, Beta-Unterstützung für <a href="https://zilliz.com/learn/sparse-and-dense-embeddings">Sparse Embeddings</a>, Gruppensuche und verschiedene andere Verbesserungen der Suchfunktionen. Mit diesen Entwicklungen unterstreichen wir unser Engagement für die Community, indem wir Entwicklern wie Ihnen ein leistungsstarkes und effizientes Tool für die Verarbeitung und Abfrage von Vektordaten bieten. Lassen Sie uns gemeinsam einen Blick auf die wichtigsten Vorteile von Milvus 2.4 werfen.</p>
<h2 id="Enabled-Multi-vector-Search-for-Simplified-Multimodal-Searches" class="common-anchor-header">Aktivierte Multivektorsuche für vereinfachte multimodale Suchvorgänge<button data-href="#Enabled-Multi-vector-Search-for-Simplified-Multimodal-Searches" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.4 bietet die Möglichkeit der Multivektorsuche, die die gleichzeitige Suche und Neuordnung verschiedener Vektortypen innerhalb desselben Milvus-Systems ermöglicht. Diese Funktion rationalisiert die multimodale Suche, verbessert die Wiederfindungsrate erheblich und ermöglicht es Entwicklern, komplexe KI-Anwendungen mit unterschiedlichen Datentypen mühelos zu verwalten. Darüber hinaus vereinfacht diese Funktionalität die Integration und Feinabstimmung von benutzerdefinierten Reranking-Modellen und hilft bei der Erstellung von fortschrittlichen Suchfunktionen wie präzisen <a href="https://zilliz.com/vector-database-use-cases/recommender-system">Empfehlungssystemen</a>, die Erkenntnisse aus mehrdimensionalen Daten nutzen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_the_multi_vector_search_feature_works_6c85961349.png" alt="How the Milti-Vector Search Feature Works" class="doc-image" id="how-the-milti-vector-search-feature-works" />
   </span> <span class="img-wrapper"> <span>So funktioniert die Milti-Vector-Suchfunktion</span> </span></p>
<p>Die Multivektor-Unterstützung in Milvus hat zwei Komponenten:</p>
<ol>
<li><p>Die Fähigkeit, mehrere Vektoren für eine einzelne Entität innerhalb einer Sammlung zu speichern/abzufragen, was eine natürlichere Art ist, Daten zu organisieren</p></li>
<li><p>Die Möglichkeit, einen Reranking-Algorithmus zu erstellen/optimieren, indem man die vorgefertigten Reranking-Algorithmen in Milvus nutzt.</p></li>
</ol>
<p>Abgesehen davon, dass es sich um eine stark <a href="https://github.com/milvus-io/milvus/issues/25639">nachgefragte Funktion</a> handelt, haben wir diese Fähigkeit entwickelt, weil sich die Branche mit der Veröffentlichung von GPT-4 und Claude 3 in Richtung multimodaler Modelle bewegt. Reranking ist eine weit verbreitete Technik, um die Leistung von Suchanfragen weiter zu verbessern. Wir wollten es den Entwicklern leicht machen, ihre Reranker innerhalb des Milvus-Ökosystems zu erstellen und zu optimieren.</p>
<h2 id="Grouping-Search-Support-for-Enhanced-Compute-Efficiency" class="common-anchor-header">Unterstützung der gruppierten Suche für verbesserte Rechenleistung<button data-href="#Grouping-Search-Support-for-Enhanced-Compute-Efficiency" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Gruppierungssuche ist eine weitere häufig <a href="https://github.com/milvus-io/milvus/issues/25343">gewünschte Funktion</a>, die wir zu Milvus 2.4 hinzugefügt haben. Sie integriert eine Group-by-Operation für Felder der Typen BOOL, INT oder VARCHAR und schließt damit eine entscheidende Effizienzlücke bei der Ausführung umfangreicher Gruppierungsabfragen.</p>
<p>Traditionell verließen sich Entwickler auf umfangreiche Top-K-Suchen, gefolgt von manueller Nachbearbeitung, um gruppenspezifische Ergebnisse zu destillieren - eine rechenintensive und codelastige Methode. Grouping Search verfeinert diesen Prozess durch die effiziente Verknüpfung von Abfrageergebnissen mit aggregierten Gruppenkennungen wie Dokument- oder Videonamen, was die Handhabung von segmentierten Entitäten innerhalb größerer Datensätze vereinfacht.</p>
<p>Milvus zeichnet sich bei der Grouping Search durch eine Iterator-basierte Implementierung aus, die im Vergleich zu ähnlichen Technologien eine deutliche Verbesserung der Berechnungseffizienz bietet. Diese Wahl gewährleistet eine überragende Skalierbarkeit der Leistung, insbesondere in Produktionsumgebungen, in denen die Optimierung der Rechenressourcen von größter Bedeutung ist. Durch die Reduzierung der Datenüberquerung und des Berechnungs-Overheads unterstützt Milvus eine effizientere Abfrageverarbeitung, wodurch die Antwortzeiten und Betriebskosten im Vergleich zu anderen Vektordatenbanken erheblich reduziert werden.</p>
<p>Grouping Search verbessert die Fähigkeit von Milvus, große Mengen komplexer Abfragen zu verwalten, und entspricht den Praktiken des High-Performance-Computing für robuste Datenverwaltungslösungen.</p>
<h2 id="Beta-Support-for-Sparse-Vector-Embeddings" class="common-anchor-header">Beta-Unterstützung für Sparse-Vektor-Embeddings<button data-href="#Beta-Support-for-Sparse-Vector-Embeddings" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/learn/sparse-and-dense-embeddings">Sparse Embeddings</a> stellen einen Paradigmenwechsel gegenüber den traditionellen Dense-Vector-Ansätzen dar, da sie die Nuancen der semantischen Ähnlichkeit und nicht nur die Häufigkeit der Schlüsselwörter berücksichtigen. Diese Unterscheidung ermöglicht eine nuanciertere Suche, die sich eng an den semantischen Inhalt der Abfrage und der Dokumente anlehnt. Dünne Vektormodelle, die vor allem im Information Retrieval und in der Verarbeitung natürlicher Sprache nützlich sind, bieten im Vergleich zu ihren dichten Gegenstücken leistungsstarke Suchmöglichkeiten außerhalb des Bereichs und eine bessere Interpretierbarkeit.</p>
<p>In Milvus 2.4 haben wir die hybride Suche erweitert, um spärliche Einbettungen einzubeziehen, die von fortgeschrittenen neuronalen Modellen wie SPLADEv2 oder statistischen Modellen wie BM25 erzeugt werden. In Milvus werden spärliche Vektoren gleichberechtigt mit dichten Vektoren behandelt, was die Erstellung von Sammlungen mit spärlichen Vektorfeldern, das Einfügen von Daten, die Indexerstellung und die Durchführung von Ähnlichkeitssuchen ermöglicht. Insbesondere unterstützen spärliche Einbettungen in Milvus die Distanzmetrik <a href="https://zilliz.com/blog/similarity-metrics-for-vector-search#Inner-Product">Inneres Produkt</a> (IP), was angesichts ihrer hochdimensionalen Natur von Vorteil ist, da andere Metriken weniger effektiv sind. Diese Funktionalität unterstützt auch Datentypen mit einer Dimension als vorzeichenlose 32-Bit-Ganzzahl und einer 32-Bit-Fließkommazahl für den Wert, was ein breites Spektrum von Anwendungen ermöglicht, von differenzierten Textsuchen bis hin zu ausgefeilten <a href="https://zilliz.com/learn/information-retrieval-metrics">Information Retrieval</a> Systemen.</p>
<p>Mit dieser neuen Funktion ermöglicht Milvus hybride Suchmethoden, die Schlüsselwort- und Einbettungstechniken miteinander verbinden, und bietet einen nahtlosen Übergang für Benutzer, die von Schlüsselwort-zentrierten Such-Frameworks zu einer umfassenden, wartungsarmen Lösung wechseln.</p>
<p>Wir bezeichnen diese Funktion als "Beta", um unsere Leistungstests der Funktion fortzusetzen und Feedback von der Community zu sammeln. Die allgemeine Verfügbarkeit (GA) der Sparse-Vector-Unterstützung wird mit der Veröffentlichung von Milvus 3.0 erwartet.</p>
<h2 id="CAGRA-Index-Support-for-Advanced-GPU-Accelerated-Graph-Indexing" class="common-anchor-header">CAGRA-Index-Unterstützung für erweiterte GPU-beschleunigte Graph-Indizierung<button data-href="#CAGRA-Index-Support-for-Advanced-GPU-Accelerated-Graph-Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>Die von NVIDIA entwickelte <a href="https://arxiv.org/abs/2308.15136">CAGRA</a> (Cuda Anns GRAph-based) ist eine GPU-basierte Graph-Indexierungstechnologie, die herkömmliche CPU-basierte Methoden wie den HNSW-Index an Effizienz und Leistung deutlich übertrifft, insbesondere in Umgebungen mit hohem Durchsatz.</p>
<p>Mit der Einführung des CAGRA-Index bietet Milvus 2.4 eine verbesserte GPU-beschleunigte Graph-Indizierung. Diese Verbesserung ist ideal für die Entwicklung von Ähnlichkeitssuchanwendungen, die eine minimale Latenzzeit erfordern. Darüber hinaus integriert Milvus 2.4 eine Brute-Force-Suche mit dem CAGRA-Index, um maximale Recall-Raten in Anwendungen zu erzielen. Detaillierte Einblicke finden Sie im <a href="https://zilliz.com/blog/Milvus-introduces-GPU-index-CAGRA">Einführungsblog zu CAGRA</a>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Milvus_raft_cagra_vs_milvus_hnsw_ffe0415ff5.png" alt="Milvus Raft CAGRA vs. Milvus HNSW" class="doc-image" id="milvus-raft-cagra-vs.-milvus-hnsw" />
   </span> <span class="img-wrapper"> <span>Milvus Raft CAGRA vs. Milvus HNSW</span> </span></p>
<h2 id="Additional-Enhancements-and-Features" class="common-anchor-header">Zusätzliche Erweiterungen und Funktionen<button data-href="#Additional-Enhancements-and-Features" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.4 enthält auch andere wichtige Verbesserungen, wie z. B. die Unterstützung von regulären Ausdrücken für ein verbessertes Substring-Matching bei der <a href="https://zilliz.com/blog/metadata-filtering-with-zilliz-cloud-pipelines">Filterung von Metadaten</a>, einen neuen skalaren invertierten Index für eine effiziente Filterung skalarer Datentypen und ein Change Data Capture-Tool zur Überwachung und Replikation von Änderungen in Milvus-Sammlungen. Diese Aktualisierungen verbessern zusammen die Leistung und Vielseitigkeit von Milvus und machen es zu einer umfassenden Lösung für komplexe Datenoperationen.</p>
<p>Weitere Einzelheiten finden Sie in der <a href="https://milvus.io/docs/release_notes.md">Milvus 2.4-Dokumentation</a>.</p>
<h2 id="Stay-Connected" class="common-anchor-header">Bleiben Sie in Verbindung!<button data-href="#Stay-Connected" class="anchor-icon" translate="no">
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
    </button></h2><p>Möchten Sie mehr über Milvus 2.4 erfahren? <a href="https://zilliz.com/event/unlocking-advanced-search-capabilities-milvus">Nehmen Sie an unserem bevorstehenden Webinar</a> mit James Luan, VP of Engineering bei Zilliz, <a href="https://zilliz.com/event/unlocking-advanced-search-capabilities-milvus">teil</a> und diskutieren Sie ausführlich über die Möglichkeiten dieser neuesten Version. Wenn Sie Fragen oder Feedback haben, treten Sie unserem <a href="https://discord.com/invite/8uyFbECzPX">Discord-Kanal</a> bei, um sich mit unseren Ingenieuren und Community-Mitgliedern auszutauschen. Vergessen Sie nicht, uns auf <a href="https://twitter.com/milvusio">Twitter</a> oder <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> zu folgen, um die neuesten Nachrichten und Updates über Milvus zu erhalten.</p>
