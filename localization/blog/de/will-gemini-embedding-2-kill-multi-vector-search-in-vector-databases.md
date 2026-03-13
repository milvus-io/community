---
id: will-gemini-embedding-2-kill-multi-vector-search-in-vector-databases.md
title: Wird Gemini Embedding 2 die Multi-Vektorsuche in Vektordatenbanken beenden?
author: Jack Li
date: 2026-3-13
cover: assets.zilliz.com/blog_Gemini_Embedding2_1_05194e6859.png
tag: Engineering
recommend: false
publishToMedium: true
tags: >-
  multi-vector search, gemini embedding 2, multimodal embeddings, milvus, vector
  database
meta_keywords: >-
  multi-vector search, gemini embedding 2, multimodal embeddings,  milvus,
  vector database
meta_title: |
  Gemini Embedding 2 vs Multi-Vector Search in Milvus
desc: >-
  Mit Gemini Embedding 2 von Google werden Text, Bilder, Video und Audio in
  einem Vektor zusammengefasst. Macht das die Suche in mehreren Vektoren
  überflüssig? Wir zeigen auf, wo jeder Ansatz passt.
origin: >-
  https://milvus.io/blog/will-gemini-embedding-2-kill-multi-vector-search-in-vector-databases.md
---
<p>Google hat <a href="https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-embedding-2/">Gemini Embedding 2</a> veröffentlicht - das erste multimodale Einbettungsmodell, das Text, Bilder, Video, Audio und Dokumente in einen einzigen Vektorraum einbettet.</p>
<p>Sie können einen Videoclip, ein Produktfoto und einen Textabsatz mit einem einzigen API-Aufruf einbetten, und sie landen alle in derselben semantischen Umgebung.</p>
<p>Vor dieser Art von Modellen hatten Sie keine andere Wahl, als jede Modalität durch ein eigenes spezialisiertes Modell laufen zu lassen und jede Ausgabe in einer separaten Vektorspalte zu speichern. Multi-Vektor-Spalten in Vektor-Datenbanken wie <a href="https://milvus.io/docs/multi-vector-search.md">Milvus</a> wurden genau für diese Welt entwickelt.</p>
<p>Die Frage ist nun: Wie viel von dieser Komplexität kann Gemini Embedding 2 ersetzen - und wo ist es unzureichend? In diesem Beitrag wird erläutert, wo jeder Ansatz passt und wie sie zusammenarbeiten.</p>
<h2 id="What’s-Different-About-Gemini-Embedding-2-When-Compared-to-CLIPCLAP" class="common-anchor-header">Was ist anders an Gemini Embedding 2 im Vergleich zu CLIP/CLAP?<button data-href="#What’s-Different-About-Gemini-Embedding-2-When-Compared-to-CLIPCLAP" class="anchor-icon" translate="no">
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
    </button></h2><p>Embedding-Modelle konvertieren unstrukturierte Daten in dichte Vektoren, so dass semantisch ähnliche Elemente im Vektorraum geclustert werden. Das Besondere an Gemini Embedding 2 ist, dass es dies nativ und modalitätsübergreifend tut, ohne separate Modelle und ohne Stitching-Pipelines.</p>
<p>Bis jetzt bedeuteten multimodale Einbettungen Dual-Encoder-Modelle, die mit kontrastivem Lernen trainiert wurden: <a href="https://openai.com/index/clip/">CLIP</a> für Bild-Text, <a href="https://arxiv.org/abs/2211.06687">CLAP</a> für Audio-Text, die jeweils genau zwei Modalitäten verarbeiten. Wenn man alle drei Modalitäten benötigte, führte man mehrere Modelle aus und koordinierte deren Einbettungsräume selbst.</p>
<p>Die Indizierung eines Podcasts mit Titelbild bedeutete beispielsweise, dass man CLIP für das Bild, CLAP für den Ton und einen Textencoder für das Transkript laufen ließ - drei Modelle, drei Vektorräume und eine benutzerdefinierte Fusionslogik, um ihre Ergebnisse bei der Abfrage vergleichbar zu machen.</p>
<p>Im Gegensatz dazu unterstützt Gemini Embedding 2 laut <a href="https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-embedding-2/">Googles offizieller Ankündigung</a> folgendes:</p>
<ul>
<li><strong>Text</strong> mit bis zu 8.192 Token pro Anfrage</li>
<li><strong>Bilder</strong> bis zu 6 pro Anfrage (PNG, JPEG)</li>
<li><strong>Videos</strong> bis zu 120 Sekunden (MP4, MOV)</li>
<li><strong>Audio</strong> bis zu 80 Sekunden, nativ eingebettet ohne ASR-Transkription</li>
<li><strong>Dokumente</strong> PDF-Eingabe, bis zu 6 Seiten</li>
</ul>
<p><strong>Gemischte Eingabe</strong> von Bild und Text in einem einzigen Einbettungsaufruf</p>
<h3 id="Gemini-Embedding-2-vs-CLIPCLAP-One-Model-vs-Many-for-Multimodal-Embeddings" class="common-anchor-header">Gemini Embedding 2 vs. CLIP/CLAP Ein Modell vs. viele für multimodale Einbettungen</h3><table>
<thead>
<tr><th></th><th><strong>Zweifach-Encoder (CLIP, CLAP)</strong></th><th><strong>Gemini Einbettung 2</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>Modalitäten pro Modell</strong></td><td>2 (z. B. Bild + Text)</td><td>5 (Text, Bild, Video, Audio, PDF)</td></tr>
<tr><td><strong>Hinzufügen einer neuen Modalität</strong></td><td>Sie bringen ein weiteres Modell ein und richten die Bereiche manuell aus</td><td>Bereits enthalten - ein API-Aufruf</td></tr>
<tr><td><strong>Modalitätsübergreifende Eingabe</strong></td><td>Separate Kodierer, separate Aufrufe</td><td>Verschachtelte Eingabe (z. B. Bild + Text in einer Anfrage)</td></tr>
<tr><td><strong>Architektur</strong></td><td>Getrennte Bild- und Textcodierer, die durch Kontrastverluste aufeinander abgestimmt sind</td><td>Ein einziges Modell, das das multimodale Verständnis von Gemini übernimmt</td></tr>
</tbody>
</table>
<h2 id="Gemini-Embedding-2’s-Advantage-Pipeline-Simplification" class="common-anchor-header">Der Vorteil von Gemini Embedding 2: Vereinfachung der Pipeline<button data-href="#Gemini-Embedding-2’s-Advantage-Pipeline-Simplification" class="anchor-icon" translate="no">
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
    </button></h2><p>Nehmen wir ein gängiges Szenario: Aufbau einer semantischen Suchmaschine über eine kurze Videobibliothek. Jeder Clip hat visuelle Frames, gesprochenes Audio und Untertiteltext - alle beschreiben denselben Inhalt.</p>
<p><strong>Vor Gemini Embedding 2</strong> brauchten Sie drei separate Einbettungsmodelle (Bild, Audio, Text), drei Vektorsäulen und eine Abrufpipeline, die einen mehrseitigen Abruf, eine Ergebnisfusion und eine Deduplizierung durchführt. Das ist eine Menge an beweglichen Teilen, die aufgebaut und gewartet werden müssen.</p>
<p><strong>Jetzt</strong> geben Sie die Bilder, den Ton und die Untertitel des Videos in einen einzigen API-Aufruf ein und erhalten einen einheitlichen Vektor, der das gesamte semantische Bild erfasst.</p>
<p>Natürlich ist die Versuchung groß, daraus zu schließen, dass Spalten mit mehreren Vektoren tot sind. Aber diese Schlussfolgerung verwechselt "multimodale einheitliche Darstellung" mit "multidimensionalem Vektorabruf". Sie lösen unterschiedliche Probleme, und es ist wichtig, den Unterschied zu verstehen, um den richtigen Ansatz zu wählen.</p>
<h2 id="What-is-Multi-Vector-Search-in-Milvus" class="common-anchor-header">Was ist die Multivektorsuche in Milvus?<button data-href="#What-is-Multi-Vector-Search-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>In <a href="http://milvus.io">Milvus</a> bedeutet Multi-Vektorsuche, dass ein und dasselbe Objekt in mehreren Vektorfeldern gleichzeitig gesucht wird und diese Ergebnisse dann mit einem Reranking kombiniert werden.</p>
<p>Der Kerngedanke: Ein einzelnes Objekt hat oft mehr als eine Bedeutung. Ein Produkt hat einen Titel <em>und eine</em> Beschreibung. Ein Beitrag in sozialen Medien hat eine Überschrift <em>und ein</em> Bild. Jeder Blickwinkel sagt etwas anderes aus, also erhält jeder sein eigenes Vektorfeld.</p>
<p>Milvus durchsucht jedes Vektorfeld unabhängig und führt dann die Kandidatengruppen mithilfe eines Rerankers zusammen. In der API wird jede Anfrage einem anderen Feld und einer anderen Suchkonfiguration zugeordnet, und hybrid_search() gibt das kombinierte Ergebnis zurück.</p>
<p>Zwei gängige Muster hängen davon ab:</p>
<ul>
<li><strong>Sparse+Dense Vector Search.</strong> Sie haben einen Produktkatalog, in den Benutzer Suchanfragen wie "rote Nike Air Max Größe 10" eingeben. Dichte Vektoren erfassen die semantische Absicht ("Laufschuhe, rot, Nike"), aber nicht die genaue Größe. Spärliche Vektoren über <a href="https://milvus.io/docs/full-text-search.md">BM25</a> oder Modelle wie <a href="https://milvus.io/docs/full_text_search_with_milvus.md">BGE-M3</a> treffen die Schlüsselwortübereinstimmung. Sie müssen beide parallel laufen lassen und dann neu ranken - denn keines von beiden liefert gute Ergebnisse für Abfragen, die natürliche Sprache mit spezifischen Identifikatoren wie SKUs, Dateinamen oder Fehlercodes kombinieren.</li>
<li><strong>Multimodale Vektorsuche.</strong> Ein Nutzer lädt ein Foto eines Kleides hoch und gibt ein: "So ähnlich, aber in blau". Sie suchen gleichzeitig in der Spalte für die Bildeinbettung nach visueller Ähnlichkeit und in der Spalte für die Texteinbettung nach der Farbbeschränkung. Jede Spalte hat ihren eigenen Index und ihr eigenes Modell - <a href="https://openai.com/index/clip/">CLIP</a> für das Bild, ein Text-Encoder für die Beschreibung - und die Ergebnisse werden zusammengeführt.</li>
</ul>
<p><a href="https://milvus.io/">Milvus</a> führt beide Muster als parallele <a href="https://milvus.io/docs/multi-vector-search.md">ANN-Suchen</a> mit nativem Reranking über RRFRanker aus. Schemadefinition, Multi-Index-Konfiguration, integriertes BM25 - alles in einem System.</p>
<p>Um dies zu verdeutlichen, betrachten Sie einen Produktkatalog, in dem jeder Artikel eine Textbeschreibung und ein Bild enthält. Sie können drei Suchvorgänge für diese Daten parallel durchführen:</p>
<ul>
<li><strong>Semantische Textsuche.</strong> Abfrage der Textbeschreibung mit dichten Vektoren, die von Modellen wie <a href="https://zilliz.com/learn/explore-colbert-token-level-embedding-and-ranking-model-for-similarity-search?_gl=1*d243m9*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#A-Quick-Recap-of-BERT">BERT</a>, <a href="https://zilliz.com/learn/NLP-essentials-understanding-transformers-in-AI?_gl=1*d243m9*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.">Transformers</a> oder der <a href="https://zilliz.com/learn/guide-to-using-openai-text-embedding-models">OpenAI</a> Embeddings API generiert wurden.</li>
<li><strong>Volltextsuche.</strong> Abfrage der Textbeschreibung mit spärlichen Vektoren mit <a href="https://zilliz.com/learn/mastering-bm25-a-deep-dive-into-the-algorithm-and-application-in-milvus">BM25</a> oder spärlichen Einbettungsmodellen wie <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings?_gl=1*1cde1oq*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#BGE-M3">BGE-M3</a> oder <a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings?_gl=1*ov2die*_gcl_au*MjcyNTAwMzUyLjE3NDMxMzE1MjY.*_ga*MTQ3OTI4MDc5My4xNzQzMTMxNTI2*_ga_KKMVYG8YF2*MTc0NTkwODU0Mi45NC4xLjE3NDU5MDg4MzcuMC4wLjA.#SPLADE">SPLADE</a>.</li>
<li><strong>Modalübergreifende Bildsuche.</strong> Abfrage von Produktbildern anhand einer Textabfrage mit dichten Vektoren aus einem Modell wie <a href="https://zilliz.com/learn/exploring-openai-clip-the-future-of-multimodal-ai-learning">CLIP</a>.</li>
</ul>
<h2 id="Now-with-Gemini-Embedding-2-Does-Multi-Vector-Search-Still-Matter" class="common-anchor-header">Ist die Multi-Vektorsuche mit Gemini Embedding 2 noch von Bedeutung?<button data-href="#Now-with-Gemini-Embedding-2-Does-Multi-Vector-Search-Still-Matter" class="anchor-icon" translate="no">
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
    </button></h2><p>Gemini Embedding 2 verarbeitet mehr Modalitäten in einem einzigen Aufruf, was die Pipelines erheblich vereinfacht. Aber eine einheitliche multimodale Einbettung ist nicht dasselbe wie eine Multi-Vektor-Suche. Mit anderen Worten: Die Multivektorsuche wird nicht überflüssig.</p>
<p>Gemini Embedding 2 bildet Text, Bilder, Video, Audio und Dokumente in einem gemeinsamen Vektorraum ab. Google <a href="https://developers.googleblog.com/en/gemini-embedding-model-now-available/">positioniert es</a> für die multimodale semantische Suche, das Abrufen von Dokumenten und Empfehlungen - Szenarien, in denen alle Modalitäten denselben Inhalt beschreiben und eine hohe cross-modale Überlappung einen einzigen Vektor sinnvoll macht.</p>
<p>Die Multivektorsuche<a href="https://milvus.io/docs/multi-vector-search.md">von Milvus</a> löst ein anderes Problem. Es handelt sich um eine Möglichkeit, ein und dasselbe Objekt über <strong>mehrere Vektorfelder</strong>zu durchsuchen <strong>-</strong>z. B. einen Titel plus Beschreibung oder Text plus Bild - und diese Signale dann bei der Suche zu kombinieren. Mit anderen Worten: Es geht darum, <strong>mehrere semantische Ansichten</strong> desselben Objekts zu erhalten und abzufragen, und nicht darum, alles in eine einzige Darstellung zu komprimieren.</p>
<p>Daten aus der realen Welt lassen sich jedoch nur selten in eine einzige Darstellung einbetten. Biometrische Systeme, agentengestützte Werkzeugsuche und E-Commerce mit gemischten Absichten hängen alle von Vektoren ab, die in völlig unterschiedlichen semantischen Räumen leben. Genau an dieser Stelle hört eine einheitliche Einbettung auf zu funktionieren.</p>
<h3 id="Why-One-Embedding-Isnt-Enough-Multi-Vector-Retrieval-in-Practice" class="common-anchor-header">Warum eine Einbettung nicht ausreicht: Multi-Vektor-Retrieval in der Praxis</h3><p>Gemini Embedding 2 ist für den Fall gedacht, dass alle Modalitäten dieselbe Sache beschreiben. Die Multi-Vektor-Suche behandelt alles andere - und "alles andere" deckt die meisten Produktions-Retrievalsysteme ab.</p>
<p><strong>Biometrische Daten.</strong> Ein einzelner Benutzer hat Vektoren für Gesicht, Stimme, Fingerabdruck und Iris. Diese beschreiben völlig unabhängige biologische Merkmale mit keinerlei semantischen Überschneidungen. Sie lassen sich nicht in einem Vektor zusammenfassen - jeder benötigt eine eigene Spalte, einen eigenen Index und eine eigene Ähnlichkeitsmetrik.</p>
<p><strong>Agentische Werkzeuge.</strong> Ein Programmierassistent wie OpenClaw speichert dichte semantische Vektoren für die Konversationshistorie ("das Bereitstellungsproblem von letzter Woche") neben spärlichen BM25-Vektoren für den genauen Abgleich von Dateinamen, CLI-Befehlen und Konfigurationsparametern. Unterschiedliche Abrufziele, unterschiedliche Vektortypen, unabhängige Suchpfade, dann Neueinstufung.</p>
<p><strong>E-Commerce mit gemischten Absichten.</strong> Das Promovideo und die Detailbilder eines Produkts funktionieren gut als einheitliche Gemini-Einbettung. Wenn ein Benutzer jedoch nach "Kleidern, die so aussehen" <em>und</em> "gleicher Stoff, Größe M" sucht, benötigen Sie eine Spalte für visuelle Ähnlichkeit und eine Spalte für strukturierte Attribute mit separaten Indizes und einer hybriden Abrufschicht.</p>
<h2 id="When-to-Use-Gemini-Embedding-2-vs-Multi-vector-Columns" class="common-anchor-header">Wann sollte man Gemini Embedding 2 vs. Multi-Vektor-Spalten verwenden?<button data-href="#When-to-Use-Gemini-Embedding-2-vs-Multi-vector-Columns" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th><strong>Szenario</strong></th><th><strong>Was ist zu verwenden?</strong></th><th><strong>Warum</strong></th></tr>
</thead>
<tbody>
<tr><td>Alle Modalitäten beschreiben denselben Inhalt (Videobilder + Audio + Untertitel)</td><td>Gemini Embedding 2 einheitlicher Vektor</td><td>Hohe semantische Überlappung bedeutet, dass ein Vektor das gesamte Bild erfasst - keine Fusion erforderlich</td></tr>
<tr><td>Sie benötigen neben dem semantischen Recall auch die Präzision der Schlüsselwörter (BM25 + Dense)</td><td>Spalten mit mehreren Vektoren mit hybrid_search()</td><td>Sparsame und dichte Vektoren dienen unterschiedlichen Suchzielen, die nicht in einer Einbettung zusammengefasst werden können</td></tr>
<tr><td>Cross-modale Suche ist der primäre Anwendungsfall (Textabfrage → Bildergebnisse)</td><td>Gemini Embedding 2 einheitlicher Vektor</td><td>Ein einziger gemeinsamer Raum macht cross-modale Ähnlichkeit nativ</td></tr>
<tr><td>Vektoren leben in grundlegend unterschiedlichen semantischen Räumen (Biometrie, strukturierte Attribute)</td><td>Spalten mit mehreren Vektoren mit Indizes pro Feld</td><td>Unabhängige Ähnlichkeitsmetriken und Indextypen pro Vektorfeld</td></tr>
<tr><td>Sie wollen eine einfache Pipeline <em>und einen</em> feinkörnigen Abruf</td><td>Beides - vereinheitlichter Gemini-Vektor + zusätzliche Sparse- oder Attributspalten in derselben Sammlung</td><td>Gemini handhabt die multimodale Spalte; Milvus handhabt die hybride Abrufschicht um sie herum</td></tr>
</tbody>
</table>
<p>Diese beiden Ansätze schließen sich nicht gegenseitig aus. Sie können Gemini Embedding 2 für die einheitliche multimodale Spalte verwenden und dennoch zusätzliche sparse oder attributspezifische Vektoren in separaten Spalten innerhalb derselben <a href="https://milvus.io/"></a><a href="https://milvus.io/">Milvus-Sammlung</a> speichern.</p>
<h2 id="Quick-Start-Set-Up-Gemini-Embedding-2-+-Milvus" class="common-anchor-header">Schnellstart: Einrichten von Gemini Embedding 2 + Milvus<button data-href="#Quick-Start-Set-Up-Gemini-Embedding-2-+-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Hier ist eine funktionierende Demo. Sie benötigen eine laufende <a href="https://milvus.io/docs/install-overview.md"></a><a href="https://milvus.io/docs/install-overview.md">Milvus oder Zilliz Cloud Instanz</a> und einen GOOGLE_API_KEY.</p>
<h3 id="Setup" class="common-anchor-header">Einrichten</h3><pre><code translate="no">pip install google-genai pymilvus
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">GOOGLE_API_KEY</span>=<span class="hljs-string">&quot;your-api-key&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Full-Example" class="common-anchor-header">Vollständiges Beispiel</h3><pre><code translate="no"><span class="hljs-string">&quot;&quot;&quot;
Prerequisites:
    pip install google-genai pymilvus

Set environment variable:
    export GOOGLE_API_KEY=&quot;your-api-key&quot;
&quot;&quot;&quot;</span>

<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> struct
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> google <span class="hljs-keyword">import</span> genai
<span class="hljs-keyword">from</span> google.genai <span class="hljs-keyword">import</span> types
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

<span class="hljs-comment"># ── Config ───────────────────────────────────────────────────────────────</span>
COLLECTION_NAME = <span class="hljs-string">&quot;gemini_multimodal_demo&quot;</span>
MILVUS_URI = <span class="hljs-string">&quot;http://localhost:19530&quot;</span>  <span class="hljs-comment"># Change to your Milvus address</span>
DIM = <span class="hljs-number">3072</span>  <span class="hljs-comment"># gemini-embedding-2-preview output dimension</span>
GEMINI_MODEL = <span class="hljs-string">&quot;gemini-embedding-2-preview&quot;</span>

<span class="hljs-comment"># ── Initialize clients ──────────────────────────────────────────────────</span>
gemini_client = genai.Client()  <span class="hljs-comment"># Uses GOOGLE_API_KEY env var</span>
milvus_client = MilvusClient(MILVUS_URI)

<span class="hljs-comment"># ── Helper: generate embedding ──────────────────────────────────────────</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_texts</span>(<span class="hljs-params">texts: <span class="hljs-built_in">list</span>[<span class="hljs-built_in">str</span>], task_type: <span class="hljs-built_in">str</span> = <span class="hljs-string">&quot;SEMANTIC_SIMILARITY&quot;</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]]:
    <span class="hljs-string">&quot;&quot;&quot;Embed a list of text strings.&quot;&quot;&quot;</span>
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=texts,
        config=types.EmbedContentConfig(task_type=task_type),
    )
    <span class="hljs-keyword">return</span> [e.values <span class="hljs-keyword">for</span> e <span class="hljs-keyword">in</span> result.embeddings]

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_image</span>(<span class="hljs-params">image_path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Embed an image file.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(image_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> f:
        image_bytes = f.read()
    mime = <span class="hljs-string">&quot;image/png&quot;</span> <span class="hljs-keyword">if</span> image_path.endswith(<span class="hljs-string">&quot;.png&quot;</span>) <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;image/jpeg&quot;</span>
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=types.Part.from_bytes(data=image_bytes, mime_type=mime),
    )
    <span class="hljs-keyword">return</span> result.embeddings[<span class="hljs-number">0</span>].values

<span class="hljs-keyword">def</span> <span class="hljs-title function_">embed_audio</span>(<span class="hljs-params">audio_path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>[<span class="hljs-built_in">float</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Embed an audio file.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(audio_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> f:
        audio_bytes = f.read()
    mime_map = {<span class="hljs-string">&quot;.mp3&quot;</span>: <span class="hljs-string">&quot;audio/mpeg&quot;</span>, <span class="hljs-string">&quot;.wav&quot;</span>: <span class="hljs-string">&quot;audio/wav&quot;</span>, <span class="hljs-string">&quot;.flac&quot;</span>: <span class="hljs-string">&quot;audio/flac&quot;</span>}
    ext = os.path.splitext(audio_path)[<span class="hljs-number">1</span>].lower()
    mime = mime_map.get(ext, <span class="hljs-string">&quot;audio/mpeg&quot;</span>)
    result = gemini_client.models.embed_content(
        model=GEMINI_MODEL,
        contents=types.Part.from_bytes(data=audio_bytes, mime_type=mime),
    )
    <span class="hljs-keyword">return</span> result.embeddings[<span class="hljs-number">0</span>].values

<span class="hljs-comment"># ── 1. Create Milvus collection ─────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;=== Creating collection ===&quot;</span>)
<span class="hljs-keyword">if</span> milvus_client.has_collection(COLLECTION_NAME):
    milvus_client.drop_collection(COLLECTION_NAME)

schema = milvus_client.create_schema()
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;content&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">2000</span>)   <span class="hljs-comment"># description of the content</span>
schema.add_field(<span class="hljs-string">&quot;modality&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">20</span>)    <span class="hljs-comment"># &quot;text&quot;, &quot;image&quot;, &quot;audio&quot;</span>
schema.add_field(<span class="hljs-string">&quot;vector&quot;</span>, DataType.FLOAT_VECTOR, dim=DIM)

index_params = milvus_client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;vector&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
)

milvus_client.create_collection(
    COLLECTION_NAME,
    schema=schema,
    index_params=index_params,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; created (dim=<span class="hljs-subst">{DIM}</span>, metric=COSINE)&quot;</span>)

<span class="hljs-comment"># ── 2. Insert text embeddings ───────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Inserting text embeddings ===&quot;</span>)
documents = [
    <span class="hljs-string">&quot;Artificial intelligence was founded as an academic discipline in 1956.&quot;</span>,
    <span class="hljs-string">&quot;The Mona Lisa is a half-length portrait painting by Leonardo da Vinci.&quot;</span>,
    <span class="hljs-string">&quot;Beethoven&#x27;s Symphony No. 9 premiered in Vienna on May 7, 1824.&quot;</span>,
    <span class="hljs-string">&quot;The Great Wall of China stretches over 13,000 miles across northern China.&quot;</span>,
    <span class="hljs-string">&quot;Jazz music originated in the African-American communities of New Orleans.&quot;</span>,
    <span class="hljs-string">&quot;The Hubble Space Telescope was launched into orbit on April 24, 1990.&quot;</span>,
    <span class="hljs-string">&quot;Vincent van Gogh painted The Starry Night while in an asylum in Saint-Rémy.&quot;</span>,
    <span class="hljs-string">&quot;Machine learning is a subset of AI focused on learning from data.&quot;</span>,
]

text_vectors = embed_texts(documents)
text_rows = [
    {<span class="hljs-string">&quot;content&quot;</span>: doc, <span class="hljs-string">&quot;modality&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>: vec}
    <span class="hljs-keyword">for</span> doc, vec <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(documents, text_vectors)
]
milvus_client.insert(COLLECTION_NAME, text_rows)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{<span class="hljs-built_in">len</span>(text_rows)}</span> text documents&quot;</span>)

<span class="hljs-comment"># ── 3. (Optional) Insert image embeddings ───────────────────────────────</span>
<span class="hljs-comment"># Uncomment and provide real image paths to test multimodal search</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># image_files = [</span>
<span class="hljs-comment">#     (&quot;photo of the Mona Lisa painting&quot;, &quot;mona_lisa.jpg&quot;),</span>
<span class="hljs-comment">#     (&quot;satellite photo of the Great Wall of China&quot;, &quot;great_wall.png&quot;),</span>
<span class="hljs-comment"># ]</span>
<span class="hljs-comment"># for desc, path in image_files:</span>
<span class="hljs-comment">#     if os.path.exists(path):</span>
<span class="hljs-comment">#         vec = embed_image(path)</span>
<span class="hljs-comment">#         milvus_client.insert(COLLECTION_NAME, [</span>
<span class="hljs-comment">#             {&quot;content&quot;: desc, &quot;modality&quot;: &quot;image&quot;, &quot;vector&quot;: vec}</span>
<span class="hljs-comment">#         ])</span>
<span class="hljs-comment">#         print(f&quot;Inserted image: {desc}&quot;)</span>

<span class="hljs-comment"># ── 4. (Optional) Insert audio embeddings ───────────────────────────────</span>
<span class="hljs-comment"># Uncomment and provide real audio paths to test multimodal search</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># audio_files = [</span>
<span class="hljs-comment">#     (&quot;Beethoven Symphony No.9 excerpt&quot;, &quot;beethoven_9.mp3&quot;),</span>
<span class="hljs-comment">#     (&quot;jazz piano improvisation&quot;, &quot;jazz_piano.mp3&quot;),</span>
<span class="hljs-comment"># ]</span>
<span class="hljs-comment"># for desc, path in audio_files:</span>
<span class="hljs-comment">#     if os.path.exists(path):</span>
<span class="hljs-comment">#         vec = embed_audio(path)</span>
<span class="hljs-comment">#         milvus_client.insert(COLLECTION_NAME, [</span>
<span class="hljs-comment">#             {&quot;content&quot;: desc, &quot;modality&quot;: &quot;audio&quot;, &quot;vector&quot;: vec}</span>
<span class="hljs-comment">#         ])</span>
<span class="hljs-comment">#         print(f&quot;Inserted audio: {desc}&quot;)</span>

<span class="hljs-comment"># ── 5. Search ────────────────────────────────────────────────────────────</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n=== Searching ===&quot;</span>)

queries = [
    <span class="hljs-string">&quot;history of artificial intelligence&quot;</span>,
    <span class="hljs-string">&quot;famous Renaissance paintings&quot;</span>,
    <span class="hljs-string">&quot;classical music concerts&quot;</span>,
]

query_vectors = embed_texts(queries, task_type=<span class="hljs-string">&quot;SEMANTIC_SIMILARITY&quot;</span>)

<span class="hljs-keyword">for</span> query_text, query_vec <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(queries, query_vectors):
    results = milvus_client.search(
        COLLECTION_NAME,
        data=[query_vec],
        limit=<span class="hljs-number">3</span>,
        output_fields=[<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;modality&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    )
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nQuery: &#x27;<span class="hljs-subst">{query_text}</span>&#x27;&quot;</span>)
    <span class="hljs-keyword">for</span> hits <span class="hljs-keyword">in</span> results:
        <span class="hljs-keyword">for</span> rank, hit <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(hits, <span class="hljs-number">1</span>):
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  [<span class="hljs-subst">{rank}</span>] (score=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, modality=<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;modality&#x27;</span>]}</span>) &quot;</span>
                  <span class="hljs-string">f&quot;<span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">80</span>]}</span>&quot;</span>)

<span class="hljs-comment"># ── 6. Cross-modal search example (image query -&gt; text results) ─────────</span>
<span class="hljs-comment"># Uncomment to search text collection using an image as query</span>
<span class="hljs-comment">#</span>
<span class="hljs-comment"># print(&quot;\n=== Cross-modal search: image -&gt; text ===&quot;)</span>
<span class="hljs-comment"># query_image_vec = embed_image(&quot;query_image.jpg&quot;)</span>
<span class="hljs-comment"># results = milvus_client.search(</span>
<span class="hljs-comment">#     COLLECTION_NAME,</span>
<span class="hljs-comment">#     data=[query_image_vec],</span>
<span class="hljs-comment">#     limit=3,</span>
<span class="hljs-comment">#     output_fields=[&quot;content&quot;, &quot;modality&quot;],</span>
<span class="hljs-comment">#     search_params={&quot;metric_type&quot;: &quot;COSINE&quot;},</span>
<span class="hljs-comment"># )</span>
<span class="hljs-comment"># for hits in results:</span>
<span class="hljs-comment">#     for rank, hit in enumerate(hits, 1):</span>
<span class="hljs-comment">#         print(f&quot;  [{rank}] (score={hit[&#x27;distance&#x27;]:.4f}) {hit[&#x27;entity&#x27;][&#x27;content&#x27;][:80]}&quot;)</span>

<span class="hljs-comment"># ── Cleanup ──────────────────────────────────────────────────────────────</span>
<span class="hljs-comment"># milvus_client.drop_collection(COLLECTION_NAME)</span>
<span class="hljs-comment"># print(f&quot;\nCollection &#x27;{COLLECTION_NAME}&#x27; dropped&quot;)</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nDone!&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<p>Für Bild- und Audioeinbettungen verwenden Sie embed_image() und embed_audio() auf die gleiche Weise - die Vektoren landen in der gleichen Kollektion und im gleichen Vektorraum, was eine echte cross-modale Suche ermöglicht.</p>
<h2 id="Gemini-Embedding-2-Will-be-Available-in-MilvusZilliz-Cloud-Soon" class="common-anchor-header">Gemini Embedding 2 wird bald in der Milvus/Zilliz Cloud verfügbar sein<button data-href="#Gemini-Embedding-2-Will-be-Available-in-MilvusZilliz-Cloud-Soon" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/">Milvus</a> liefert eine tiefe Integration mit Gemini Embedding 2 durch seine <a href="https://milvus.io/docs/embeddings.md">Einbettungsfunktion</a>. Sobald die Funktion verfügbar ist, müssen Sie die Einbettungs-APIs nicht mehr manuell aufrufen. Milvus wird das Modell (das OpenAI, AWS Bedrock, Google Vertex AI und andere unterstützt) automatisch aufrufen, um Rohdaten beim Einfügen und Abfragen bei der Suche zu vektorisieren.</p>
<p>Das bedeutet, dass Sie eine einheitliche multimodale Einbettung von Gemini erhalten, wo es passt, und das vollständige Multi-Vektor-Toolkit von Milvus - sparse-dense Hybrid-Suche, Multi-Index-Schemata, Reranking - wo Sie eine feinkörnige Kontrolle benötigen.</p>
<p>Möchten Sie es ausprobieren? Beginnen Sie mit dem <a href="https://milvus.io/docs/quickstart.md">Milvus-Schnellstart</a> und führen Sie die obige Demo aus, oder sehen Sie sich den <a href="https://milvus.io/docs/hybrid_search_with_milvus.md">Leitfaden zur hybriden Suche</a> an, um das vollständige Multi-Vektor-Setup mit BGE-M3 zu erhalten. Stellen Sie Ihre Fragen auf <a href="https://milvus.io/discord">Discord</a> oder in den <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour">Milvus-Sprechstunden</a>.</p>
<h2 id="Keep-Reading" class="common-anchor-header">Lesen Sie weiter<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">Einführung in die Einbettungsfunktion: Wie Milvus 2.6 die Vektorisierung und semantische Suche rationalisiert - Milvus Blog</a></li>
<li><a href="https://milvus.io/docs/multi-vector-search.md">Hybride Suche mit mehreren Vektoren</a></li>
<li><a href="https://milvus.io/docs/embeddings.md">Milvus Einbettungsfunktion Docs</a></li>
</ul>
