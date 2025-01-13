---
id: molecular-structure-similarity-with-milvus.md
title: Einleitung
author: Shiyu Chen
date: 2020-02-06T19:08:18.815Z
desc: So führen Sie eine Ähnlichkeitsanalyse der Molekularstruktur in Milvus durch
cover: assets.zilliz.com/header_44d6b6aacd.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/molecular-structure-similarity-with-milvus'
---
<custom-h1>Beschleunigung der Entdeckung neuer Wirkstoffe</custom-h1><h2 id="Introduction" class="common-anchor-header">Einleitung<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Entdeckung von Arzneimitteln ist ein wichtiger Bestandteil der Forschung und Entwicklung neuer Medikamente, denn sie ist die Quelle medizinischer Innovationen. Die Entdeckung von Arzneimitteln erfolgt durch die Auswahl und Bestätigung von Zielen. Wenn Fragmente oder Leitverbindungen entdeckt werden, werden in der Regel ähnliche Verbindungen in internen oder kommerziellen Substanzbibliotheken gesucht, um die Struktur-Aktivitäts-Beziehung (SAR) und die Verfügbarkeit von Verbindungen zu ermitteln und so das Potenzial der Leitverbindungen zu bewerten, die zu Kandidatenverbindungen optimiert werden können.</p>
<p>Um verfügbare Verbindungen im Fragmentraum von milliardenschweren Substanzbibliotheken zu entdecken, wird normalerweise ein chemischer Fingerabdruck für die Substruktursuche und die Ähnlichkeitssuche abgerufen. Die herkömmliche Lösung ist jedoch zeitaufwändig und fehleranfällig, wenn es um hochdimensionale chemische Fingerabdrücke in Milliardenhöhe geht. Außerdem können dabei einige potenzielle Verbindungen verloren gehen. In diesem Artikel wird die Verwendung von Milvus, einer Ähnlichkeitssuchmaschine für hochdimensionale Vektoren, mit RDKit erörtert, um ein System für eine leistungsstarke chemische Strukturähnlichkeitssuche aufzubauen.</p>
<p>Im Vergleich zu herkömmlichen Methoden bietet Milvus eine schnellere Suchgeschwindigkeit und eine breitere Abdeckung. Durch die Verarbeitung chemischer Fingerabdrücke kann Milvus eine Substruktursuche, Ähnlichkeitssuche und exakte Suche in chemischen Strukturbibliotheken durchführen, um potenziell verfügbare Arzneimittel zu entdecken.</p>
<h2 id="System-overview" class="common-anchor-header">Überblick über das System<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Das System verwendet RDKit, um chemische Fingerabdrücke zu erzeugen, und Milvus, um eine Ähnlichkeitssuche nach chemischen Strukturen durchzuführen. Unter https://github.com/milvus-io/bootcamp/tree/master/solutions/molecular_similarity_search erfahren Sie mehr über das System.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_system_overview_4b7c2de377.png" alt="1-system-overview.png" class="doc-image" id="1-system-overview.png" />
   </span> <span class="img-wrapper"> <span>1-system-uebersicht.png</span> </span></p>
<h2 id="1-Generating-chemical-fingerprints" class="common-anchor-header">1. Generierung chemischer Fingerabdrücke<button data-href="#1-Generating-chemical-fingerprints" class="anchor-icon" translate="no">
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
    </button></h2><p>Chemische Fingerabdrücke werden normalerweise für die Substruktursuche und die Ähnlichkeitssuche verwendet. Das folgende Bild zeigt eine sequentielle Liste, die durch Bits dargestellt wird. Jede Ziffer steht für ein Element, ein Atompaar oder eine funktionelle Gruppe. Die chemische Struktur ist <code translate="no">C1C(=O)NCO1</code>.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_identifying_patterns_molecules_2aeef349c8.png" alt="2-identifying-patterns-molecules.png" class="doc-image" id="2-identifying-patterns-molecules.png" />
   </span> <span class="img-wrapper"> <span>2-identifizierende-Muster-Moleküle.png</span> </span></p>
<p>Wir können RDKit verwenden, um Morgan-Fingerabdrücke zu erzeugen. Dabei wird ein Radius von einem bestimmten Atom definiert und die Anzahl der chemischen Strukturen im Bereich des Radius berechnet, um einen chemischen Fingerabdruck zu erzeugen. Geben Sie verschiedene Werte für den Radius und die Bits an, um die chemischen Fingerabdrücke verschiedener chemischer Strukturen zu erhalten. Die chemischen Strukturen werden im SMILES-Format dargestellt.</p>
<pre><code translate="no">from rdkit import Chem
mols = Chem.MolFromSmiles(smiles)
mbfp = AllChem.GetMorganFingerprintAsBitVect(mols, radius=2, bits=512)
mvec = DataStructs.BitVectToFPSText(mbfp)
</code></pre>
<h2 id="2-Searching-chemical-structures" class="common-anchor-header">2. Suche nach chemischen Strukturen<button data-href="#2-Searching-chemical-structures" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Morgan-Fingerabdrücke können dann in Milvus importiert werden, um eine Datenbank mit chemischen Strukturen aufzubauen. Mit verschiedenen chemischen Fingerabdrücken kann Milvus eine Substruktursuche, eine Ähnlichkeitssuche und eine exakte Suche durchführen.</p>
<pre><code translate="no">from milvus import Milvus
Milvus.add_vectors(table_name=MILVUS_TABLE, records=mvecs)
Milvus.search_vectors(table_name=MILVUS_TABLE, query_records=query_mvec, top_k=topk)
</code></pre>
<h3 id="Substructure-search" class="common-anchor-header">Substruktursuche</h3><p>Prüft, ob eine chemische Struktur eine andere chemische Struktur enthält.</p>
<h3 id="Similarity-search" class="common-anchor-header">Ähnlichkeitssuche</h3><p>Sucht nach ähnlichen chemischen Strukturen. Standardmäßig wird die Tanimoto-Distanz als Metrik verwendet.</p>
<h3 id="Exact-search" class="common-anchor-header">Exakte Suche</h3><p>Prüft, ob eine bestimmte chemische Struktur existiert. Diese Art der Suche erfordert eine exakte Übereinstimmung.</p>
<h2 id="Computing-chemical-fingerprints" class="common-anchor-header">Berechnung von chemischen Fingerabdrücken<button data-href="#Computing-chemical-fingerprints" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Tanimoto-Distanz wird häufig als Metrik für chemische Fingerabdrücke verwendet. In Milvus entspricht die Jaccard-Distanz der Tanimoto-Distanz.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_computing_chem_fingerprings_table_1_3814744fce.png" alt="3-computing-chem-fingerprings-table-1.png" class="doc-image" id="3-computing-chem-fingerprings-table-1.png" />
   </span> <span class="img-wrapper"> <span>3-berechnung-chemischer-fingerabdrücke-tabelle-1.png</span> </span></p>
<p>Auf der Grundlage der oben genannten Parameter kann die Berechnung chemischer Fingerabdrücke wie folgt beschrieben werden:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_computing_chem_fingerprings_table_2_7d16075836.png" alt="4-computing-chem-fingerprings-table-2.png" class="doc-image" id="4-computing-chem-fingerprings-table-2.png" />
   </span> <span class="img-wrapper"> <span>4-computing-chem-fingerprings-table-2.png</span> </span></p>
<p>Wir können sehen, dass <code translate="no">1- Jaccard = Tanimoto</code>. Hier verwenden wir Jaccard in Milvus, um den chemischen Fingerabdruck zu berechnen, was eigentlich mit dem Tanimoto-Abstand übereinstimmt.</p>
<h2 id="System-demo" class="common-anchor-header">System-Demo<button data-href="#System-demo" class="anchor-icon" translate="no">
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
    </button></h2><p>Um besser zu demonstrieren, wie das System funktioniert, haben wir eine Demo erstellt, die Milvus verwendet, um mehr als 90 Millionen chemische Fingerabdrücke zu suchen. Die verwendeten Daten stammen von ftp://ftp.ncbi.nlm.nih.gov/pubchem/Compound/CURRENT-Full/SDF. Die ursprüngliche Schnittstelle sieht wie folgt aus:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_system_demo_1_46c6e6cd96.jpg" alt="5-system-demo-1.jpg" class="doc-image" id="5-system-demo-1.jpg" />
   </span> <span class="img-wrapper"> <span>5-system-demo-1.jpg</span> </span></p>
<p>Wir können bestimmte chemische Strukturen im System suchen und erhalten ähnliche chemische Strukturen zurück:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_system_demo_2_19d6cd8f92.gif" alt="6-system-demo-2.gif" class="doc-image" id="6-system-demo-2.gif" />
   </span> <span class="img-wrapper"> <span>6-system-demo-2.gif</span> </span></p>
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
    </button></h2><p>Die Ähnlichkeitssuche ist in vielen Bereichen unverzichtbar, z. B. bei Bildern und Videos. Bei der Entdeckung von Arzneimitteln kann die Ähnlichkeitssuche auf Datenbanken mit chemischen Strukturen angewendet werden, um potenziell verfügbare Verbindungen zu entdecken, die dann in Seeds für die praktische Synthese und Point-of-Care-Tests umgewandelt werden. Milvus ist eine Open-Source-Suchmaschine für die Ähnlichkeitssuche in großen Merkmalsvektoren, die auf einer heterogenen Rechnerarchitektur basiert, um eine optimale Kosteneffizienz zu gewährleisten. Die Suche in Milliarden von Vektoren dauert nur wenige Millisekunden und erfordert nur ein Minimum an Rechenressourcen. So kann Milvus helfen, eine genaue und schnelle Suche nach chemischen Strukturen in Bereichen wie Biologie und Chemie zu implementieren.</p>
<p>Sie können auf die Demo zugreifen, indem Sie http://40.117.75.127:8002/ besuchen, und vergessen Sie nicht, auch unserem GitHub https://github.com/milvus-io/milvus einen Besuch abzustatten, um mehr zu erfahren!</p>
