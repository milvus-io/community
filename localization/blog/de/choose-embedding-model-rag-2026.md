---
id: choose-embedding-model-rag-2026.md
title: >-
  Wie man das beste Einbettungsmodell für die RAG im Jahr 2026 auswählt: 10
  Modelle im Benchmarking
author: Cheney Zhang
date: 2026-3-26
cover: assets.zilliz.com/embedding_model_cover_ab72ccd651.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, Gemini Embedding 2, Embedding Model, RAG'
meta_keywords: >-
  best embedding model for RAG, embedding model comparison, multimodal embedding
  benchmark, MRL dimension compression, Gemini Embedding 2
meta_title: |
  Best Embedding Model for RAG 2026: 10 Models Compared
desc: >-
  Wir haben 10 Einbettungsmodelle für die Komprimierung von langen Dokumenten
  und Dimensionen sowie für verschiedene Modi und Sprachen getestet. Finden Sie
  heraus, welches Modell zu Ihrer RAG-Pipeline passt.
origin: 'https://milvus.io/blog/choose-embedding-model-rag-2026.md'
---
<p><strong>TL;DR:</strong> Wir haben 10 <a href="https://zilliz.com/ai-models">Einbettungsmodelle</a> in vier Produktionsszenarien getestet, die in öffentlichen Benchmarks nicht berücksichtigt werden: Modalübergreifende Suche, sprachübergreifende Suche, Suche nach Schlüsselinformationen und Dimensionskompression. Kein einzelnes Modell gewinnt alles. Gemini Embedding 2 ist der beste Allrounder. Das Open-Source-Modell Qwen3-VL-2B schlägt die Closed-Source-APIs bei modusübergreifenden Aufgaben. Wenn Sie Dimensionen komprimieren müssen, um Speicherplatz zu sparen, wählen Sie Voyage Multimodal 3.5 oder Jina Embeddings v4.</p>
<h2 id="Why-MTEB-Isnt-Enough-for-Choosing-an-Embedding-Model" class="common-anchor-header">Warum MTEB nicht ausreicht, um ein Einbettungsmodell auszuwählen<button data-href="#Why-MTEB-Isnt-Enough-for-Choosing-an-Embedding-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>Die meisten <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG-Prototypen</a> beginnen mit OpenAIs text-embedding-3-small. Es ist billig, einfach zu integrieren und funktioniert für die Suche nach englischen Texten gut genug. Aber die Produktions-RAG wächst schnell über sich hinaus. Ihre Pipeline nimmt Bilder, PDFs, mehrsprachige Dokumente auf - und ein reines <a href="https://zilliz.com/ai-models">Text-Einbettungsmodell</a> reicht nicht mehr aus.</p>
<p>Die <a href="https://huggingface.co/spaces/mteb/leaderboard">MTEB-Bestenliste</a> zeigt Ihnen, dass es bessere Optionen gibt. Das Problem dabei? MTEB testet nur die Abfrage von einsprachigem Text. Es deckt nicht das cross-modale Retrieval (Textabfragen gegen Bildsammlungen), die cross-linguale Suche (eine chinesische Abfrage findet ein englisches Dokument), die Genauigkeit bei langen Dokumenten oder den Qualitätsverlust ab, der entsteht, wenn Sie die <a href="https://zilliz.com/glossary/dimension">Einbettungsdimensionen</a> abschneiden, um Speicherplatz in Ihrer <a href="https://zilliz.com/learn/what-is-a-vector-database">Vektordatenbank</a> zu sparen.</p>
<p>Welches Einbettungsmodell sollten Sie also verwenden? Das hängt von Ihren Datentypen, Ihren Sprachen, Ihren Dokumentenlängen und davon ab, ob Sie eine Dimensionskomprimierung benötigen. Wir haben einen Benchmark namens <strong>CCKM</strong> erstellt und 10 Modelle, die zwischen 2025 und 2026 veröffentlicht wurden, auf genau diese Dimensionen hin getestet.</p>
<h2 id="What-Is-the-CCKM-Benchmark" class="common-anchor-header">Was ist der CCKM-Benchmark?<button data-href="#What-Is-the-CCKM-Benchmark" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>CCKM</strong> (Cross-modal, Cross-lingual, Key information, MRL) testet vier Fähigkeiten, die bei Standard-Benchmarks fehlen:</p>
<table>
<thead>
<tr><th>Dimension</th><th>Was wird getestet</th><th>Warum es wichtig ist</th></tr>
</thead>
<tbody>
<tr><td><strong>Modalübergreifender Abruf</strong></td><td>Zuordnung von Textbeschreibungen zum richtigen Bild, wenn nahezu identische Ablenkungen vorhanden sind</td><td><a href="https://zilliz.com/learn/multimodal-rag">Multimodale RAG-Pipelines</a> benötigen Text- und Bildeinbettungen im gleichen Vektorraum</td></tr>
<tr><td><strong>Sprachübergreifende Suche</strong></td><td>Finden des richtigen englischen Dokuments aus einer chinesischen Abfrage und umgekehrt</td><td>Produktions-Wissensdatenbanken sind oft mehrsprachig</td></tr>
<tr><td><strong>Abrufen von Schlüsselinformationen</strong></td><td>Auffinden eines bestimmten Sachverhalts in einem Dokument mit 4K-32K Zeichen (needle-in-a-haystack)</td><td>RAG-Systeme verarbeiten häufig lange Dokumente wie Verträge und Forschungsarbeiten</td></tr>
<tr><td><strong>MRL-Dimensionskompression</strong></td><td>Messung, wie viel Qualität das Modell verliert, wenn man die Einbettungen auf 256 Dimensionen abschneidet</td><td>Weniger Dimensionen = geringere Speicherkosten in Ihrer Vektordatenbank, aber auf Kosten welcher Qualität?</td></tr>
</tbody>
</table>
<p>MTEB deckt keines dieser Probleme ab. MMEB fügt multimodale Merkmale hinzu, lässt aber harte Negative aus, so dass Modelle eine hohe Punktzahl erreichen, ohne zu beweisen, dass sie subtile Unterscheidungen beherrschen. CCKM wurde entwickelt, um das abzudecken, was sie nicht abdecken.</p>
<h2 id="Which-Embedding-Models-Did-We-Test-Gemini-Embedding-2-Jina-Embeddings-v4-and-More" class="common-anchor-header">Welche Einbettungsmodelle haben wir getestet? Gemini Embedding 2, Jina Embeddings v4 und mehr<button data-href="#Which-Embedding-Models-Did-We-Test-Gemini-Embedding-2-Jina-Embeddings-v4-and-More" class="anchor-icon" translate="no">
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
    </button></h2><p>Wir haben 10 Modelle getestet, die sowohl API-Dienste als auch Open-Source-Optionen abdecken, sowie CLIP ViT-L-14 als Basis für 2021.</p>
<table>
<thead>
<tr><th>Modell</th><th>Quelle</th><th>Parameter</th><th>Abmessungen</th><th>Modalität</th><th>Schlüsselmerkmal</th></tr>
</thead>
<tbody>
<tr><td>Zwillinge Einbettung 2</td><td>Google</td><td>Unbekannt</td><td>3072</td><td>Text / Bild / Video / Audio / PDF</td><td>Alle Modalitäten, breiteste Abdeckung</td></tr>
<tr><td>Jina Einbettungen v4</td><td>Jina AI</td><td>3.8B</td><td>2048</td><td>Text / Bild / PDF</td><td>MRL + LoRA-Adapter</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>Voyage AI (MongoDB)</td><td>Unbekannt</td><td>1024</td><td>Text / Bild / Video</td><td>Ausgewogen über Aufgaben</td></tr>
<tr><td>Qwen3-VL-Embedding-2B</td><td>Alibaba Qwen</td><td>2B</td><td>2048</td><td>Text / Bild / Video</td><td>Open-Source, leichtgewichtig multimodal</td></tr>
<tr><td>Jina CLIP v2</td><td>Jina AI</td><td>~1B</td><td>1024</td><td>Text/Bild</td><td>Modernisierte CLIP-Architektur</td></tr>
<tr><td>Cohere Embed v4</td><td>Cohere</td><td>Unveröffentlicht</td><td>Festgelegt</td><td>Text</td><td>Abruf für Unternehmen</td></tr>
<tr><td>OpenAI Texteinbettung-3-groß</td><td>OpenAI</td><td>Unveröffentlicht</td><td>3072</td><td>Text</td><td>Am weitesten verbreitet</td></tr>
<tr><td><a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">BGE-M3</a></td><td>BAAI</td><td>568M</td><td>1024</td><td>Text</td><td>Open-Source, 100+ Sprachen</td></tr>
<tr><td>mxbai-embed-groß</td><td>Mixedbread AI</td><td>335M</td><td>1024</td><td>Text</td><td>Leichtgewichtig, mit Schwerpunkt auf Englisch</td></tr>
<tr><td>nomic-embed-text</td><td>Nomische KI</td><td>137M</td><td>768</td><td>Text</td><td>Ultraleichtes</td></tr>
<tr><td>CLIP ViT-L-14</td><td>OpenAI (2021)</td><td>428M</td><td>768</td><td>Text/Bild</td><td>Grundlinie</td></tr>
</tbody>
</table>
<h2 id="Cross-Modal-Retrieval-Which-Models-Handle-Text-to-Image-Search" class="common-anchor-header">Modalübergreifendes Retrieval: Welche Modelle beherrschen die Text-zu-Bild-Suche?<button data-href="#Cross-Modal-Retrieval-Which-Models-Handle-Text-to-Image-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>Wenn Ihre RAG-Pipeline neben Text auch Bilder verarbeitet, muss das Einbettungsmodell beide Modalitäten in denselben <a href="https://zilliz.com/glossary/vector-embeddings">Vektorraum</a> einbetten. Denken Sie an die E-Commerce-Bildersuche, gemischte Bild-Text-Wissensdatenbanken oder jedes System, bei dem eine Textanfrage das richtige Bild finden muss.</p>
<h3 id="Method" class="common-anchor-header">Verfahren</h3><p>Wir nahmen 200 Bild-Text-Paare aus COCO val2017. Für jedes Bild wurde mit GPT-4o-mini eine detaillierte Beschreibung erstellt. Dann schrieben wir 3 harte Negative pro Bild - Beschreibungen, die sich nur durch ein oder zwei Details von der korrekten Beschreibung unterscheiden. Das Modell muss in einem Pool von 200 Bildern und 600 Ablenkern die richtige Übereinstimmung finden.</p>
<p>Ein Beispiel aus dem Datensatz:</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_9_3965746e33.png" alt="Vintage brown leather suitcases with travel stickers including California and Cuba, placed on a metal luggage rack against a blue sky — used as a test image in the cross-modal retrieval benchmark" class="doc-image" id="vintage-brown-leather-suitcases-with-travel-stickers-including-california-and-cuba,-placed-on-a-metal-luggage-rack-against-a-blue-sky-—-used-as-a-test-image-in-the-cross-modal-retrieval-benchmark" />
   </span> <span class="img-wrapper"> <span>Alte braune Lederkoffer mit Reiseaufklebern, darunter Kalifornien und Kuba, auf einem Metallgepäckträger vor einem blauen Himmel - verwendet als Testbild im cross-modalen Retrieval-Benchmark</span> </span></p>
<blockquote>
<p><strong>Korrekte Beschreibung:</strong> "Das Bild zeigt alte braune Lederkoffer mit verschiedenen Reiseaufklebern, darunter 'Kalifornien', 'Kuba' und 'New York', die auf einem Metallgepäckträger vor einem klaren blauen Himmel stehen."</p>
<p><strong>Harte Verneinung:</strong> Derselbe Satz, aber "Kalifornien" wird zu "Florida" und "blauer Himmel" wird zu "bedeckter Himmel". Das Modell muss die Bilddetails verstehen, um sie zu unterscheiden.</p>
</blockquote>
<p><strong>Scoring:</strong></p>
<ul>
<li>Erzeugen Sie <a href="https://zilliz.com/glossary/vector-embeddings">Einbettungen</a> für alle Bilder und den gesamten Text (200 richtige Beschreibungen + 600 harte Negative).</li>
<li><strong>Text-zu-Bild (t2i):</strong> Für jede Beschreibung werden 200 Bilder nach der nächstliegenden Übereinstimmung durchsucht. Es gibt einen Punkt, wenn das beste Ergebnis korrekt ist.</li>
<li><strong>Bild-zu-Text (i2t):</strong> Für jedes Bild werden alle 800 Texte nach der nächstgelegenen Übereinstimmung durchsucht. Einen Punkt gibt es nur, wenn das oberste Ergebnis die korrekte Beschreibung ist, nicht ein hartes Negativ.</li>
<li><strong>Endgültige Punktzahl:</strong> hard_avg_R@1 = (t2i Genauigkeit + i2t Genauigkeit) / 2</li>
</ul>
<h3 id="Results" class="common-anchor-header">Ergebnisse</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_1_6f1fddae56.png" alt="Horizontal bar chart showing Cross-Modal Retrieval Ranking: Qwen3-VL-2B leads at 0.945, followed by Gemini Embed 2 at 0.928, Voyage MM-3.5 at 0.900, Jina CLIP v2 at 0.873, and CLIP ViT-L-14 at 0.768" class="doc-image" id="horizontal-bar-chart-showing-cross-modal-retrieval-ranking:-qwen3-vl-2b-leads-at-0.945,-followed-by-gemini-embed-2-at-0.928,-voyage-mm-3.5-at-0.900,-jina-clip-v2-at-0.873,-and-clip-vit-l-14-at-0.768" />
   <span>Horizontales Balkendiagramm, das das Cross-Modal Retrieval Ranking zeigt: Qwen3-VL-2B führt mit 0,945, gefolgt von Gemini Embed 2 mit 0,928, Voyage MM-3,5 mit 0,900, Jina CLIP v2 mit 0,873, und CLIP ViT-L-14 mit 0,768</span> </span></p>
<p>Qwen3-VL-2B, ein quelloffenes 2B-Parameter-Modell des Qwen-Teams von Alibaba, belegte den ersten Platz - vor allen Closed-Source-APIs.</p>
<p><strong>Die Modalitätslücke</strong> erklärt den größten Teil des Unterschieds. Einbettungsmodelle bilden Text und Bilder im selben Vektorraum ab, aber in der Praxis neigen die beiden Modalitäten dazu, sich in verschiedenen Regionen zu gruppieren. Die Modalitätslücke misst den L2-Abstand zwischen diesen beiden Clustern. Kleinere Lücke = leichteres cross-modales Abrufen.</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_8_c5067a3434.png" alt="Visualization comparing large modality gap (0.73, text and image embedding clusters far apart) versus small modality gap (0.25, clusters overlapping) — smaller gap makes cross-modal matching easier" class="doc-image" id="visualization-comparing-large-modality-gap-(0.73,-text-and-image-embedding-clusters-far-apart)-versus-small-modality-gap-(0.25,-clusters-overlapping)-—-smaller-gap-makes-cross-modal-matching-easier" />
   </span> <span class="img-wrapper"> <span>Visualisierung eines Vergleichs zwischen einer großen Modalitätslücke (0,73, Text- und Bildeinbettungscluster liegen weit auseinander) und einer kleinen Modalitätslücke (0,25, Cluster überlappen sich) - eine kleinere Lücke erleichtert das cross-modale Matching</span> </span></p>
<table>
<thead>
<tr><th>Modell</th><th>Punktzahl (R@1)</th><th>Modalitätslücke</th><th>Parameter</th></tr>
</thead>
<tbody>
<tr><td>Qwen3-VL-2B</td><td>0.945</td><td>0.25</td><td>2B (Open-Source)</td></tr>
<tr><td>Gemini Einbettung 2</td><td>0.928</td><td>0.73</td><td>Unbekannt (geschlossen)</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>0.900</td><td>0.59</td><td>Unbekannt (geschlossen)</td></tr>
<tr><td>Jina CLIP v2</td><td>0.873</td><td>0.87</td><td>~1B</td></tr>
<tr><td>CLIP ViT-L-14</td><td>0.768</td><td>0.83</td><td>428M</td></tr>
</tbody>
</table>
<p>Qwens Modalitätslücke beträgt 0,25 - etwa ein Drittel von Geminis 0,73. In einer <a href="https://zilliz.com/learn/what-is-a-vector-database">Vektordatenbank</a> wie <a href="https://milvus.io/">Milvus</a> bedeutet eine kleine Modalitätslücke, dass Sie Text- und Bildeinbettungen in derselben <a href="https://milvus.io/docs/manage-collections.md">Sammlung</a> speichern und direkt in beiden <a href="https://milvus.io/docs/single-vector-search.md">suchen</a> können. Bei einer großen Lücke ist die modalitätsübergreifende <a href="https://zilliz.com/glossary/similarity-search">Ähnlichkeitssuche</a> weniger zuverlässig, und es kann ein Schritt zur Neueinstufung erforderlich sein, um dies auszugleichen.</p>
<h2 id="Cross-Lingual-Retrieval-Which-Models-Align-Meaning-Across-Languages" class="common-anchor-header">Sprachübergreifendes Retrieval: Welche Modelle gleichen die Bedeutung sprachübergreifend ab?<button data-href="#Cross-Lingual-Retrieval-Which-Models-Align-Meaning-Across-Languages" class="anchor-icon" translate="no">
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
    </button></h2><p>Mehrsprachige Wissensdatenbanken sind in der Produktion üblich. Ein Benutzer stellt eine Frage auf Chinesisch, aber die Antwort befindet sich in einem englischen Dokument - oder andersherum. Das Einbettungsmodell muss die Bedeutung zwischen den Sprachen abgleichen, nicht nur innerhalb einer Sprache.</p>
<h3 id="Method" class="common-anchor-header">Verfahren</h3><p>Wir haben 166 parallele Satzpaare in Chinesisch und Englisch in drei Schwierigkeitsstufen erstellt:</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_6_75caab66a7.png" alt="Cross-lingual difficulty tiers: Easy tier maps literal translations like 我爱你 to I love you; Medium tier maps paraphrased sentences like 这道菜太咸了 to This dish is too salty with hard negatives; Hard tier maps Chinese idioms like 画蛇添足 to gilding the lily with semantically different hard negatives" class="doc-image" id="cross-lingual-difficulty-tiers:-easy-tier-maps-literal-translations-like-我爱你-to-i-love-you;-medium-tier-maps-paraphrased-sentences-like-这道菜太咸了-to-this-dish-is-too-salty-with-hard-negatives;-hard-tier-maps-chinese-idioms-like-画蛇添足-to-gilding-the-lily-with-semantically-different-hard-negatives" />
   <span>Sprachübergreifende Schwierigkeitsstufen: Leichte Stufe bildet wörtliche Übersetzungen wie 我爱你 auf I love you ab; Mittlere Stufe bildet paraphrasierte Sätze wie 这道菜太咸了 auf This dish is too salty mit harten Negativen ab; Harte Stufe bildet chinesische Idiome wie 画蛇添足 auf gilding the lily mit semantisch unterschiedlichen harten Negativen ab</span> </span></p>
<p>Jede Sprache erhält außerdem 152 harte negative Distraktoren.</p>
<p><strong>Auswertung:</strong></p>
<ul>
<li>Erzeugen Sie Einbettungen für den gesamten chinesischen Text (166 richtige + 152 Distraktoren) und den gesamten englischen Text (166 richtige + 152 Distraktoren).</li>
<li><strong>Chinesisch → Englisch:</strong> Jeder chinesische Satz sucht in 318 englischen Texten nach seiner korrekten Übersetzung.</li>
<li><strong>Englisch → Chinesisch:</strong> Dasselbe in umgekehrter Reihenfolge.</li>
<li><strong>Endgültige Punktzahl:</strong> hard_avg_R@1 = (zh→en Genauigkeit + en→zh Genauigkeit) / 2</li>
</ul>
<h3 id="Results" class="common-anchor-header">Ergebnisse</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_2_d1c3500423.png" alt="Horizontal bar chart showing Cross-Lingual Retrieval Ranking: Gemini Embed 2 leads at 0.997, followed by Qwen3-VL-2B at 0.988, Jina v4 at 0.985, Voyage MM-3.5 at 0.982, down to mxbai at 0.120" class="doc-image" id="horizontal-bar-chart-showing-cross-lingual-retrieval-ranking:-gemini-embed-2-leads-at-0.997,-followed-by-qwen3-vl-2b-at-0.988,-jina-v4-at-0.985,-voyage-mm-3.5-at-0.982,-down-to-mxbai-at-0.120" />
   <span>Horizontales Balkendiagramm mit der Rangfolge der sprachübergreifenden Suche: Gemini Embed 2 führt mit 0,997, gefolgt von Qwen3-VL-2B mit 0,988, Jina v4 mit 0,985, Voyage MM-3.5 mit 0,982, bis hin zu mxbai mit 0,120</span> </span></p>
<p>Gemini Embedding 2 erzielte mit 0,997 den höchsten Wert aller getesteten Modelle. Es war das einzige Modell, das eine perfekte 1,000 auf der harten Stufe erreichte, wo Paare wie "画蛇添足" → "gilding the lily" ein echtes <a href="https://zilliz.com/glossary/semantic-search">semantisches</a> Verständnis über mehrere Sprachen hinweg erfordern, nicht aber einen Mustervergleich.</p>
<table>
<thead>
<tr><th>Modell</th><th>Punktzahl (R@1)</th><th>Leicht</th><th>Mittel</th><th>Schwer (Idiome)</th></tr>
</thead>
<tbody>
<tr><td>Zwillingseinbettung 2</td><td>0.997</td><td>1.000</td><td>1.000</td><td>1.000</td></tr>
<tr><td>Qwen3-VL-2B</td><td>0.988</td><td>1.000</td><td>1.000</td><td>0.969</td></tr>
<tr><td>Jina Einbettungen v4</td><td>0.985</td><td>1.000</td><td>1.000</td><td>0.969</td></tr>
<tr><td>Voyage Multimodal 3.5</td><td>0.982</td><td>1.000</td><td>1.000</td><td>0.938</td></tr>
<tr><td>OpenAI 3-groß</td><td>0.967</td><td>1.000</td><td>1.000</td><td>0.906</td></tr>
<tr><td>Cohere Embed v4</td><td>0.955</td><td>1.000</td><td>0.980</td><td>0.875</td></tr>
<tr><td>BGE-M3 (568M)</td><td>0.940</td><td>1.000</td><td>0.960</td><td>0.844</td></tr>
<tr><td>nomic-embed-text (137M)</td><td>0.154</td><td>0.300</td><td>0.120</td><td>0.031</td></tr>
<tr><td>mxbai-embed-groß (335M)</td><td>0.120</td><td>0.220</td><td>0.080</td><td>0.031</td></tr>
</tbody>
</table>
<p>Die 7 besten Modelle erreichen alle einen Gesamtwert von 0,93 - die wirkliche Differenzierung findet auf der harten Ebene (chinesische Idiome) statt. nomic-embed-text und mxbai-embed-large, beides leichtgewichtige Modelle mit Fokus auf Englisch, erreichen bei sprachübergreifenden Aufgaben nahezu Null.</p>
<h2 id="Key-Information-Retrieval-Can-Models-Find-a-Needle-in-a-32K-Token-Document" class="common-anchor-header">Schlüssel-Informationsbeschaffung: Können Modelle eine Nadel in einem 32K-Token-Dokument finden?<button data-href="#Key-Information-Retrieval-Can-Models-Find-a-Needle-in-a-32K-Token-Document" class="anchor-icon" translate="no">
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
    </button></h2><p>RAG-Systeme verarbeiten oft lange Dokumente - juristische Verträge, Forschungspapiere, interne Berichte mit <a href="https://zilliz.com/learn/introduction-to-unstructured-data">unstrukturierten Daten</a>. Die Frage ist, ob ein Einbettungsmodell eine bestimmte Tatsache finden kann, die in Tausenden von Zeichen des umgebenden Textes verborgen ist.</p>
<h3 id="Method" class="common-anchor-header">Verfahren</h3><p>Wir nahmen Wikipedia-Artikel unterschiedlicher Länge (4K bis 32K Zeichen) als Heuhaufen und fügten eine einzelne erfundene Tatsache - die Nadel - an verschiedenen Positionen ein: Anfang, 25%, 50%, 75% und Ende. Das Modell muss auf der Grundlage einer Abfrageeinbettung bestimmen, welche Version des Dokuments die Nadel enthält.</p>
<p><strong>Beispiel:</strong></p>
<ul>
<li><strong>Needle:</strong> "Die Meridian Corporation meldete im dritten Quartal 2025 einen Quartalsumsatz von 847,3 Millionen US-Dollar."</li>
<li><strong>Abfrage:</strong> "Wie hoch war der vierteljährliche Umsatz der Meridian Corporation?"</li>
<li><strong>Heuhaufen:</strong> Ein Wikipedia-Artikel mit 32.000 Zeichen über Photosynthese, in dem die Nadel versteckt ist.</li>
</ul>
<p><strong>Auswertung:</strong></p>
<ul>
<li>Erzeugen Sie Einbettungen für die Abfrage, das Dokument mit der Nadel und das Dokument ohne Nadel.</li>
<li>Wenn die Abfrage dem Dokument mit der Nadel ähnlicher ist, wird es als Treffer gewertet.</li>
<li>Durchschnittliche Genauigkeit über alle Dokumentenlängen und Nadelpositionen.</li>
<li><strong>Endgültige Metriken:</strong> overall_accuracy und degradation_rate (wie stark die Genauigkeit vom kürzesten zum längsten Dokument abnimmt).</li>
</ul>
<h3 id="Results" class="common-anchor-header">Ergebnisse</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_5_2bdc89516a.png" alt="Heatmap showing Needle-in-a-Haystack accuracy by document length: Gemini Embed 2 scores 1.000 across all lengths up to 32K; top 7 models score perfectly within their context windows; mxbai and nomic degrade sharply at 4K+" class="doc-image" id="heatmap-showing-needle-in-a-haystack-accuracy-by-document-length:-gemini-embed-2-scores-1.000-across-all-lengths-up-to-32k;-top-7-models-score-perfectly-within-their-context-windows;-mxbai-and-nomic-degrade-sharply-at-4k+" />
   <span>Heatmap zeigt die Needle-in-a-Haystack-Genauigkeit nach Dokumentlänge: Gemini Embed 2 erreicht 1.000 über alle Längen bis 32K; die 7 besten Modelle erreichen perfekte Ergebnisse innerhalb ihrer Kontextfenster; mxbai und nomic verschlechtern sich stark bei 4K+</span> </span></p>
<p>Gemini Embedding 2 ist das einzige Modell, das über den gesamten Bereich von 4K-32K getestet wurde, und es erzielte bei jeder Länge eine perfekte Bewertung. Kein anderes Modell in diesem Test hat ein Kontextfenster, das 32K erreicht.</p>
<table>
<thead>
<tr><th>Modell</th><th>1K</th><th>4K</th><th>8K</th><th>16K</th><th>32K</th><th>Insgesamt</th><th>Verschlechterung</th></tr>
</thead>
<tbody>
<tr><td>Gemini Einbettung 2</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>0%</td></tr>
<tr><td>OpenAI 3-groß</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Jina Einbettungen v4</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Cohere Embed v4</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Qwen3-VL-2B</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Reise Multimodal 3,5</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Jina CLIP v2</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>BGE-M3 (568M)</td><td>1.000</td><td>1.000</td><td>0.920</td><td>-</td><td>-</td><td>0.973</td><td>8%</td></tr>
<tr><td>mxbai-embed-groß (335M)</td><td>0.980</td><td>0.600</td><td>0.400</td><td>-</td><td>-</td><td>0.660</td><td>58%</td></tr>
<tr><td>nomic-embed-text (137M)</td><td>1.000</td><td>0.460</td><td>0.440</td><td>-</td><td>-</td><td>0.633</td><td>56%</td></tr>
</tbody>
</table>
<p>"-" bedeutet, dass die Dokumentlänge das Kontextfenster des Modells überschreitet.</p>
<p>Die 7 besten Modelle schneiden innerhalb ihres Kontextfensters perfekt ab. BGE-M3 beginnt bei 8K zu rutschen (0,920). Die leichtgewichtigen Modelle (mxbai und nomic) fallen auf 0,4-0,6 bei nur 4K Zeichen - etwa 1.000 Token. Bei mxbai spiegelt dieser Rückgang teilweise das 512-Token-Kontextfenster wider, das den größten Teil des Dokuments abschneidet.</p>
<h2 id="MRL-Dimension-Compression-How-Much-Quality-Do-You-Lose-at-256-Dimensions" class="common-anchor-header">MRL-Dimensionskomprimierung: Wie viel Qualität geht bei 256 Dimensionen verloren?<button data-href="#MRL-Dimension-Compression-How-Much-Quality-Do-You-Lose-at-256-Dimensions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Matryoshka Representation Learning (MRL)</strong> ist eine Trainingstechnik, bei der die ersten N Dimensionen eines Vektors für sich genommen sinnvoll sind. Wenn man einen Vektor mit 3072 Dimensionen auf 256 abschneidet, bleibt ein Großteil seiner semantischen Qualität erhalten. Weniger Dimensionen bedeuten geringere Speicher- und Speicherkosten in Ihrer <a href="https://zilliz.com/learn/what-is-a-vector-database">Vektordatenbank</a> - eine Reduzierung von 3072 auf 256 Dimensionen bedeutet eine 12-fache Speicherreduzierung.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_10_aef8755877.png" alt="Illustration showing MRL dimension truncation: 3072 dimensions at full quality, 1024 at 95%, 512 at 90%, 256 at 85% — with 12x storage savings at 256 dimensions" class="doc-image" id="illustration-showing-mrl-dimension-truncation:-3072-dimensions-at-full-quality,-1024-at-95%,-512-at-90%,-256-at-85%-—-with-12x-storage-savings-at-256-dimensions" />
   <span>Illustration der MRL-Dimensionskürzung: 3072 Dimensionen bei voller Qualität, 1024 bei 95 %, 512 bei 90 %, 256 bei 85 % - mit 12-facher Speicherplatzeinsparung bei 256 Dimensionen</span> </span></p>
<h3 id="Method" class="common-anchor-header">Methode</h3><p>Wir haben 150 Satzpaare aus dem STS-B-Benchmark verwendet, jedes mit einer von Menschen kommentierten Ähnlichkeitsbewertung (0-5). Für jedes Modell wurden die Einbettungen in der vollen Dimension generiert und dann auf 1024, 512 und 256 abgeschnitten.</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_4_44266e5456.png" alt="STS-B data examples showing sentence pairs with human similarity scores: A girl is styling her hair vs A girl is brushing her hair scores 2.5; A group of men play soccer on the beach vs A group of boys are playing soccer on the beach scores 3.6" class="doc-image" id="sts-b-data-examples-showing-sentence-pairs-with-human-similarity-scores:-a-girl-is-styling-her-hair-vs-a-girl-is-brushing-her-hair-scores-2.5;-a-group-of-men-play-soccer-on-the-beach-vs-a-group-of-boys-are-playing-soccer-on-the-beach-scores-3.6" />
   <span>STS-B-Datenbeispiele zeigen Satzpaare mit menschlichen Ähnlichkeitsbewertungen: Ein Mädchen frisiert sich die Haare im Vergleich zu Ein Mädchen bürstet sich die Haare mit einem Score von 2,5; Eine Gruppe von Männern spielt Fußball am Strand im Vergleich zu Eine Gruppe von Jungen spielt Fußball am Strand mit einem Score von 3,6</span> </span></p>
<p><strong>Punktevergabe:</strong></p>
<ul>
<li>Berechnen Sie auf jeder Dimensionsebene die <a href="https://zilliz.com/glossary/cosine-similarity">Kosinusähnlichkeit</a> zwischen den Einbettungen der einzelnen Satzpaare.</li>
<li>Vergleichen Sie das Ähnlichkeitsranking des Modells mit dem menschlichen Ranking unter Verwendung von <strong>Spearman's ρ</strong> (Rangkorrelation).</li>
</ul>
<blockquote>
<p><strong>Was ist Spearman's ρ?</strong> Es misst, wie gut zwei Einstufungen übereinstimmen. Wenn Menschen das Paar A als am ähnlichsten, B als am zweitähnlichsten und C als am wenigsten ähnlich einstufen - und die Kosinus-Ähnlichkeiten des Modells die gleiche Reihenfolge A &gt; B &gt; C ergeben - dann nähert sich ρ dem Wert 1,0. Ein ρ von 1,0 bedeutet perfekte Übereinstimmung. Ein ρ von 0 bedeutet keine Korrelation.</p>
</blockquote>
<p><strong>Endgültige Metriken:</strong> spearman_rho (höher ist besser) und min_viable_dim (die kleinste Dimension, bei der die Qualität innerhalb von 5 % der Leistung der vollen Dimension bleibt).</p>
<h3 id="Results" class="common-anchor-header">Ergebnisse</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_3_7192725ed6.png" alt="Dot plot showing MRL Full Dimension vs 256 Dimension Quality: Voyage MM-3.5 leads with +0.6% change, Jina v4 +0.5%, while Gemini Embed 2 shows -0.6% at the bottom" class="doc-image" id="dot-plot-showing-mrl-full-dimension-vs-256-dimension-quality:-voyage-mm-3.5-leads-with-+0.6%-change,-jina-v4-+0.5%,-while-gemini-embed-2-shows--0.6%-at-the-bottom" />
   <span>Punktdiagramm mit MRL Full Dimension vs. 256 Dimension Quality: Voyage MM-3.5 führt mit +0,6 % Veränderung, Jina v4 +0,5 %, während Gemini Embed 2 mit -0,6 % am unteren Ende liegt.</span> </span></p>
<p>Wenn Sie planen, die Speicherkosten in <a href="https://milvus.io/">Milvus</a> oder einer anderen Vektordatenbank durch Abschneiden von Dimensionen zu reduzieren, ist dieses Ergebnis von Bedeutung.</p>
<table>
<thead>
<tr><th>Modell</th><th>ρ (volle Abmessung)</th><th>ρ (256 dim)</th><th>Zerfall</th></tr>
</thead>
<tbody>
<tr><td>Voyage Multimodal 3.5</td><td>0.880</td><td>0.874</td><td>0.7%</td></tr>
<tr><td>Jina Einbettungen v4</td><td>0.833</td><td>0.828</td><td>0.6%</td></tr>
<tr><td>mxbai-embed-large (335M)</td><td>0.815</td><td>0.795</td><td>2.5%</td></tr>
<tr><td>nomic-embed-text (137M)</td><td>0.781</td><td>0.774</td><td>0.8%</td></tr>
<tr><td>OpenAI 3-groß</td><td>0.767</td><td>0.762</td><td>0.6%</td></tr>
<tr><td>Gemini Einbettung 2</td><td>0.683</td><td>0.689</td><td>-0.8%</td></tr>
</tbody>
</table>
<p>Voyage und Jina v4 sind führend, weil beide ausdrücklich mit MRL als Ziel trainiert wurden. Die Dimensionskompression hat wenig mit der Modellgröße zu tun - es kommt darauf an, ob das Modell dafür trainiert wurde.</p>
<p>Eine Anmerkung zum Ergebnis von Gemini: Das MRL-Ranking spiegelt wider, wie gut ein Modell die Qualität nach der Trunkierung beibehält, und nicht, wie gut sein Retrieval in allen Dimensionen ist. Geminis volldimensionales Retrieval ist stark - die sprachübergreifenden Ergebnisse und die Ergebnisse der Schlüsselinformationen haben das bereits bewiesen. Es wurde nur nicht für die Komprimierung optimiert. Wenn Sie keine Dimensionskomprimierung benötigen, ist diese Metrik für Sie nicht relevant.</p>
<h2 id="Which-Embedding-Model-Should-You-Use" class="common-anchor-header">Welches Einbettungsmodell sollten Sie verwenden?<button data-href="#Which-Embedding-Model-Should-You-Use" class="anchor-icon" translate="no">
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
    </button></h2><p>Es gibt kein Modell, das alles gewinnt. Hier ist die vollständige Scorecard:</p>
<table>
<thead>
<tr><th>Modell</th><th>Parameter</th><th>Modalübergreifend</th><th>Sprachübergreifend</th><th>Wichtige Infos</th><th>MRL ρ</th></tr>
</thead>
<tbody>
<tr><td>Zwillingseinbettung 2</td><td>Unveröffentlicht</td><td>0.928</td><td>0.997</td><td>1.000</td><td>0.668</td></tr>
<tr><td>Reise Multimodal 3,5</td><td>Nicht offengelegt</td><td>0.900</td><td>0.982</td><td>1.000</td><td>0.880</td></tr>
<tr><td>Jina Einbettungen v4</td><td>3.8B</td><td>-</td><td>0.985</td><td>1.000</td><td>0.833</td></tr>
<tr><td>Qwen3-VL-2B</td><td>2B</td><td>0.945</td><td>0.988</td><td>1.000</td><td>0.774</td></tr>
<tr><td>OpenAI 3-groß</td><td>Unveröffentlicht</td><td>-</td><td>0.967</td><td>1.000</td><td>0.760</td></tr>
<tr><td>Cohere Embed v4</td><td>Unveröffentlicht</td><td>-</td><td>0.955</td><td>1.000</td><td>-</td></tr>
<tr><td>Jina CLIP v2</td><td>~1B</td><td>0.873</td><td>0.934</td><td>1.000</td><td>-</td></tr>
<tr><td>BGE-M3</td><td>568M</td><td>-</td><td>0.940</td><td>0.973</td><td>0.744</td></tr>
<tr><td>mxbai-embed-groß</td><td>335M</td><td>-</td><td>0.120</td><td>0.660</td><td>0.815</td></tr>
<tr><td>nomic-embed-text</td><td>137M</td><td>-</td><td>0.154</td><td>0.633</td><td>0.780</td></tr>
<tr><td>CLIP ViT-L-14</td><td>428M</td><td>0.768</td><td>0.030</td><td>-</td><td>-</td></tr>
</tbody>
</table>
<p>"-" bedeutet, dass das Modell diese Modalität oder Fähigkeit nicht unterstützt. CLIP ist ein Referenzwert für das Jahr 2021.</p>
<p>Hier ist, was auffällt:</p>
<ul>
<li><strong>Modalitätsübergreifend:</strong> Qwen3-VL-2B (0,945) auf Platz eins, Gemini (0,928) auf Platz zwei, Voyage (0,900) auf Platz drei. Ein Open-Source-2B-Modell schlug jede Closed-Source-API. Der entscheidende Faktor war die Modalitätslücke, nicht die Anzahl der Parameter.</li>
<li><strong>Sprachübergreifend:</strong> Gemini (0,997) führt - das einzige Modell, das beim Idiom-Level-Alignment perfekt abschneidet. Die 8 besten Modelle erreichen alle einen Wert von 0,93. Leichtgewichtige Modelle, die nur auf Englisch basieren, erreichen fast Null.</li>
<li><strong>Wichtige Informationen:</strong> API- und große Open-Source-Modelle schneiden bis zu 8K perfekt ab. Modelle unter 335M fangen bei 4K an, sich zu verschlechtern. Gemini ist das einzige Modell, das 32K mit einer perfekten Punktzahl bewältigt.</li>
<li><strong>MRL-Komprimierung:</strong> Voyage (0,880) und Jina v4 (0,833) liegen vorn und verlieren weniger als 1 % bei 256 Dimensionen. Gemini (0,668) bildet das Schlusslicht - stark bei voller Dimension, nicht für Trunkierung optimiert.</li>
</ul>
<h3 id="How-to-Pick-A-Decision-Flowchart" class="common-anchor-header">Wie man auswählt: Ein Entscheidungsflussdiagramm</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_7_b2bd48bdcc.png" alt="Embedding model selection flowchart: Start → Need images or video? → Yes: Need to self-host? → Yes: Qwen3-VL-2B, No: Gemini Embedding 2. No images → Need to save storage? → Yes: Jina v4 or Voyage, No: Need multilingual? → Yes: Gemini Embedding 2, No: OpenAI 3-large" class="doc-image" id="embedding-model-selection-flowchart:-start-→-need-images-or-video?-→-yes:-need-to-self-host?-→-yes:-qwen3-vl-2b,-no:-gemini-embedding-2.-no-images-→-need-to-save-storage?-→-yes:-jina-v4-or-voyage,-no:-need-multilingual?-→-yes:-gemini-embedding-2,-no:-openai-3-large" />
   <span>Flussdiagramm zur Auswahl eines Einbettungsmodells: Start → Brauchen Sie Bilder oder Videos? → Ja: Sollen sie selbst gehostet werden? → Ja: Qwen3-VL-2B, Nein: Gemini Embedding 2. Keine Bilder → Müssen Sie Speicherplatz sparen? → Ja: Jina v4 oder Voyage, Nein: Mehrsprachigkeit erforderlich? → Ja: Gemini Embedding 2, Nein: OpenAI 3-large</span> </span></p>
<h3 id="The-Best-All-Rounder-Gemini-Embedding-2" class="common-anchor-header">Der beste Allrounder: Gemini Embedding 2</h3><p>Alles in allem ist Gemini Embedding 2 das stärkste Modell in diesem Benchmark.</p>
<p><strong>Stärken:</strong> Erster bei der sprachübergreifenden (0,997) und der Suche nach Schlüsselinformationen (1,000 über alle Längen bis 32K). Zweiter bei der modalitätsübergreifenden Suche (0,928). Größte Modalitätsabdeckung - fünf Modalitäten (Text, Bild, Video, Audio, PDF), während die meisten Modelle bei drei Modalitäten enden.</p>
<p><strong>Schwachstellen:</strong> Schlusslicht bei der MRL-Kompression (ρ = 0,668). Geschlagen vom quelloffenen Qwen3-VL-2B bei der modalitätsübergreifenden Kompression.</p>
<p>Wenn Sie keine Dimensionskomprimierung benötigen, hat Gemini keinen wirklichen Konkurrenten bei der Kombination aus sprachübergreifender Suche und Abrufen langer Dokumente. Wenn es jedoch um modalübergreifende Präzision oder Speicheroptimierung geht, schneiden spezialisierte Modelle besser ab.</p>
<h2 id="Limitations" class="common-anchor-header">Beschränkungen<button data-href="#Limitations" class="anchor-icon" translate="no">
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
<li>Wir haben nicht alle Modelle berücksichtigt, die in Frage kommen - NVIDIAs NV-Embed-v2 und Jinas v5-text waren auf der Liste, haben es aber nicht in diese Runde geschafft.</li>
<li>Wir haben uns auf Text- und Bildmodalitäten konzentriert; Video-, Audio- und PDF-Einbettung (trotz der Behauptung einiger Modelle, diese zu unterstützen) wurden nicht berücksichtigt.</li>
<li>Die Abfrage von Code und andere domänenspezifische Szenarien wurden nicht berücksichtigt.</li>
<li>Die Stichprobengröße war relativ klein, so dass enge Unterschiede in der Rangfolge zwischen den Modellen möglicherweise unter das statistische Rauschen fallen.</li>
</ul>
<p>Die Ergebnisse dieses Artikels werden in einem Jahr überholt sein. Es werden ständig neue Modelle auf den Markt gebracht, und die Rangliste wird mit jeder neuen Version neu gemischt. Die dauerhafteste Investition ist der Aufbau einer eigenen Evaluierungspipeline - definieren Sie Ihre Datentypen, Ihre Abfragemuster, Ihre Dokumentenlängen und testen Sie neue Modelle, sobald sie verfügbar sind. Öffentliche Benchmarks wie MTEB, MMTEB und MMEB sind eine Beobachtung wert, aber die endgültige Entscheidung sollten Sie immer anhand Ihrer eigenen Daten treffen.</p>
<p><a href="https://github.com/zc277584121/mm-embedding-bench">Unser Benchmark-Code ist auf GitHub als Open-Source</a> verfügbar - Sie können ihn abzweigen und an Ihren Anwendungsfall anpassen.</p>
<hr>
<p>Sobald Sie sich für ein Einbettungsmodell entschieden haben, benötigen Sie einen Ort, an dem Sie diese Vektoren speichern und in großem Umfang durchsuchen können. <a href="https://milvus.io/">Milvus</a> ist die weltweit am weitesten verbreitete Open-Source-Vektordatenbank mit <a href="https://github.com/milvus-io/milvus">mehr als 43.000 GitHub-Sternen</a>, die genau für diesen Zweck entwickelt wurde. Sie unterstützt MRL-abgeschnittene Dimensionen, gemischte multimodale Sammlungen, eine hybride Suche, die dichte und spärliche Vektoren kombiniert, und <a href="https://milvus.io/docs/architecture_overview.md">skaliert von einem Laptop bis zu Milliarden von Vektoren</a>.</p>
<ul>
<li>Starten Sie mit dem <a href="https://milvus.io/docs/quickstart.md">Milvus Quickstart Guide</a> oder installieren Sie mit <code translate="no">pip install pymilvus</code>.</li>
<li>Treten Sie dem <a href="https://milvusio.slack.com/">Milvus Slack</a> oder <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord</a> bei, um Fragen zur Integration von Einbettungsmodellen, Vektorindizierungsstrategien oder Produktionsskalierung zu stellen.</li>
<li><a href="https://milvus.io/office-hours">Buchen Sie eine kostenlose Milvus-Sprechstunde</a>, um Ihre RAG-Architektur zu besprechen - wir können Ihnen bei der Modellauswahl, dem Entwurf von Sammelschemata und der Leistungsoptimierung helfen.</li>
<li>Wenn Sie sich die Arbeit mit der Infrastruktur sparen möchten, bietet <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a> (managed Milvus) ein kostenloses Tier für den Einstieg.</li>
</ul>
<hr>
<p>Einige Fragen, die auftauchen, wenn Ingenieure ein Einbettungsmodell für die Produktions-RAG auswählen:</p>
<p><strong>F: Sollte ich ein multimodales Einbettungsmodell verwenden, auch wenn ich im Moment nur Textdaten habe?</strong></p>
<p>Das hängt von Ihrer Roadmap ab. Wenn Ihre Pipeline in den nächsten 6-12 Monaten wahrscheinlich Bilder, PDFs oder andere Modalitäten hinzufügen wird, können Sie mit einem multimodalen Modell wie Gemini Embedding 2 oder Voyage Multimodal 3.5 beginnen, um eine spätere schmerzhafte Migration zu vermeiden - Sie müssen nicht Ihren gesamten Datensatz neu einbetten. Wenn Sie sich sicher sind, dass Ihr Datensatz in absehbarer Zukunft nur aus Text besteht, bietet Ihnen ein textorientiertes Modell wie OpenAI 3-large oder Cohere Embed v4 ein besseres Preis-Leistungs-Verhältnis.</p>
<p><strong>F: Wie viel Speicherplatz spart die MRL-Dimensionskomprimierung tatsächlich in einer Vektordatenbank?</strong></p>
<p>Der Wechsel von 3072 Dimensionen auf 256 Dimensionen bedeutet eine 12-fache Reduzierung des Speichers pro Vektor. Für eine <a href="https://milvus.io/">Milvus-Sammlung</a> mit 100 Millionen Vektoren bei float32 sind das etwa 1,14 TB → 95 GB. Voyage Multimodal 3.5 und Jina Embeddings v4 verlieren bei 256 Dimensionen weniger als 1 % an Qualität, während andere Modelle deutlich schlechter abschneiden.</p>
<p><strong>F: Ist Qwen3-VL-2B wirklich besser als Gemini Embedding 2 für die cross-modale Suche?</strong></p>
<p>In unserem Benchmark, ja - Qwen3-VL-2B erzielte 0,945 gegenüber Geminis 0,928 bei der harten cross-modalen Suche mit nahezu identischen Distraktoren. Der Hauptgrund dafür ist die viel geringere Modalitätslücke von Qwen (0,25 gegenüber 0,73), was bedeutet, dass Text- und <a href="https://zilliz.com/glossary/vector-embeddings">Bildeinbettungen</a> im Vektorraum näher beieinander liegen. Dennoch deckt Gemini fünf Modalitäten ab, während Qwen drei abdeckt. Wenn Sie also Audio- oder PDF-Einbettungen benötigen, ist Gemini die einzige Option.</p>
<p><strong>F: Kann ich diese Einbettungsmodelle direkt mit Milvus verwenden?</strong></p>
<p>Ja. Alle diese Modelle geben Standard-Float-Vektoren aus, die Sie <a href="https://milvus.io/docs/insert-update-delete.md">in Milvus einfügen</a> und mit <a href="https://zilliz.com/glossary/cosine-similarity">Kosinusähnlichkeit</a>, L2-Distanz oder innerem Produkt suchen können. <a href="https://milvus.io/docs/install-pymilvus.md">PyMilvus</a> funktioniert mit jedem Einbettungsmodell - erzeugen Sie Ihre Vektoren mit dem SDK des Modells und speichern und suchen Sie sie dann in Milvus. Für MRL-geschnittene Vektoren setzen Sie einfach die Dimension der Sammlung auf Ihr Ziel (z. B. 256), wenn <a href="https://milvus.io/docs/manage-collections.md">Sie die Sammlung erstellen</a>.</p>
