---
id: >-
  minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md
title: >-
  MinHash LSH in Milvus: Die Geheimwaffe zur Bekämpfung von Duplikaten in
  LLM-Trainingsdaten
author: 'Li Liu, Yaya Cheng'
date: 2025-05-16T00:00:00.000Z
desc: >-
  MinHash LSH in Milvus 2.6 bietet eine effiziente Lösung für die Deduplizierung
  massiver LLM-Trainingsdatensätze, mit 2x schnellerer Verarbeitung und 3-fachen
  Kosteneinsparungen im Vergleich zu traditionellen Methoden.
cover: assets.zilliz.com/Chat_GPT_Image_May_16_2025_09_46_39_PM_1f3290ce5e.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'MinHash LSH, Locality Sensitive Hashing, Milvus, LLM training data'
meta_title: >
  MinHash LSH in Milvus: The Secret Weapon for Fighting Duplicates in LLM
  Training Data
origin: >-
  https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md
---
<p>Große Sprachmodelle (Large Language Models, LLMs) haben die KI-Landschaft durch ihre Fähigkeit, Code zu schreiben, Inhalte zu erstellen und komplexe Probleme zu lösen, verändert. Diese leistungsstarken Modelle benötigen jedoch enorme Mengen an hochwertigen Daten für ihr Training.</p>
<p>Die Herausforderung besteht darin, dass die Rohdaten für das Training oft erhebliche Redundanzen enthalten. Das ist so, als würde man ein Kind unterrichten, indem man die gleichen Lektionen immer wieder wiederholt und dabei andere wichtige Themen auslässt. Ein großes KI-Unternehmen trat mit genau diesem Problem an uns heran: Es wollte ein ehrgeiziges neues Sprachmodell entwickeln, hatte aber Probleme mit der Deduplizierung von mehreren Milliarden Dokumenten. Herkömmliche Abgleichsmethoden waren für dieses Volumen nicht geeignet, und spezialisierte Deduplizierungstools erforderten enorme Rechenressourcen, was sie wirtschaftlich unrentabel machte.</p>
<p>Um dieses Problem zu lösen, haben wir eine Lösung entwickelt: MinHash LSH (Locality Sensitive Hashing) Indexierung, die in Milvus 2.6 verfügbar sein wird. In diesem Artikel wird untersucht, wie MinHash LSH das Problem der Datendeduplizierung für LLM-Training effizient löst.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Chat_GPT_Image_May_16_2025_09_46_39_PM_1f3290ce5e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Data-Deduplication-Why-It-Matters-for-LLM-Training" class="common-anchor-header">Daten-Deduplizierung: Warum sie für die LLM-Ausbildung wichtig ist<button data-href="#Data-Deduplication-Why-It-Matters-for-LLM-Training" class="anchor-icon" translate="no">
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
    </button></h2><p>Qualitativ hochwertige, vielfältige Daten sind für das Training leistungsstarker LLMs unerlässlich. Wenn doppelte Inhalte in den Trainingsdaten auftauchen, führt dies zu mehreren erheblichen Problemen:</p>
<ul>
<li><p><strong>Vergeudete Ressourcen:</strong> Redundante Daten erhöhen die Trainingszeit, die Kosten und den Energieverbrauch.</p></li>
<li><p><strong>Geringere Leistung:</strong> Modelle können sich zu stark an wiederholte Inhalte anpassen, was ihre Fähigkeit zur Generalisierung auf neue Informationen einschränkt.</p></li>
<li><p><strong>Gedächtniseffekt:</strong> Doppelte Inhalte erhöhen die Wahrscheinlichkeit, dass sich Modelle einen bestimmten Text merken und ihn wortwörtlich wiedergeben. Dies könnte auch zu Datenschutzlücken oder Urheberrechtsproblemen führen.</p></li>
<li><p><strong>Irreführende Auswertungen:</strong> Duplikate zwischen Trainings- und Testsätzen können die Leistungskennzahlen unbeabsichtigt in die Höhe treiben.</p></li>
</ul>
<p>Es gibt drei Hauptansätze zum Auffinden und Entfernen von Duplikaten:</p>
<ul>
<li><p><strong>Exakter Abgleich:</strong> Identifiziert identische Duplikate durch Hashing.</p></li>
<li><p><strong>Approximate Matching:</strong> Findet Beinahe-Duplikate mit Algorithmen wie MinHash LSH und Jaccard-Ähnlichkeit.</p></li>
<li><p><strong>Semantisches Matching:</strong> Identifiziert Inhalte mit ähnlicher Bedeutung mithilfe von Vektoreinbettungen.</p></li>
</ul>
<p>Bei Pre-Training-Korpora, die Terabytes oder sogar Petabytes umfassen, sind herkömmliche exakte Matching-Methoden wie paarweise Vergleiche rechnerisch nicht durchführbar. Die semantische Deduplizierung fügt durch die Verwendung von Einbettungsmodellen zur Erzeugung von Vektoren einen erheblichen Overhead hinzu. Wir brauchen innovativere Näherungsmethoden - wie <strong>MinHash LSH - die</strong>ein Gleichgewicht zwischen Recall und Präzision herstellen und gleichzeitig die Kosten überschaubar halten, so dass Deduplizierung in großem Maßstab praktikabel ist.</p>
<h2 id="MinHash-LSH-Efficiently-Detecting-Near-Duplicates-in-Massive-Datasets" class="common-anchor-header">MinHash LSH: Effiziente Erkennung von Beinahe-Duplikaten in riesigen Datensätzen<button data-href="#MinHash-LSH-Efficiently-Detecting-Near-Duplicates-in-Massive-Datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>Um Beinahe-Duplikate in einem Meer von Trainingsdaten zu finden, benötigen wir einen annähernden Abgleichsalgorithmus, der sowohl effizient als auch genau ist. MinHash LSH (Locality Sensitive Hashing) ist ein hervorragendes Werkzeug für dieses Ziel. Lassen Sie uns diesen scheinbar komplexen Begriff Schritt für Schritt aufschlüsseln.</p>
<h3 id="Step-1-Representing-Documents-with-MinHash" class="common-anchor-header">Schritt 1: Darstellung von Dokumenten mit MinHash</h3><p>Zunächst benötigen wir eine Möglichkeit, die Ähnlichkeit von Dokumenten zu messen. Der Standardansatz verwendet die Jaccard-Ähnlichkeit:</p>
<p><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mi>J</mi><mo stretchy="false">(</mo><mi>A</mi><mo separator="true">,</mo><mi>B</mi><mo stretchy="false">)</mo><mo>=</mo></mrow><annotation encoding="application/x-tex">∣A∩B∣∣A∪B∣J(A,B) = \frac{|A\cap B|}{|A \cup B|}</annotation></semantics></math></span></span></span><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="katex-display"><span class="katex">J<span class="katex-html" aria-hidden="true"><span class="base"><span class="mopen">(</span><span class="mord mathnormal">A</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span></span></span> B<span class="katex-html" aria-hidden="true"><span class="base"><span class="mclose">)</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span> =</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="katex-display"><span class="katex"></span></span><span class="strut" style="height:2.363em;vertical-align:-0.936em;"></span> <span class="katex-display"><span class="katex"></span></span><span class="mopen nulldelimiter"></span> <span class="katex-display"><span class="katex"></span></span><span class="pstrut" style="height:3em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-2.314em;"><span class="mord"><span class="mord mathnormal">∣A</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∪</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord">B∣</span></span></span></span></span></span></span></span></span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span class="katex-display"><span class="katex"></span></span><span class="pstrut" style="height:3em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-3.677em;"><span class="mord"><span class="mord mathnormal">∣A</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∩</span><span class="mspace" style="margin-right:0.2222em;"></span></span></span></span><span class="vlist-s">B∣</span></span></span></span></span></span></span></span></span><span class="vlist-r"><span class="vlist" style="height:0.936em;"><span></span></span></span><span class="mclose nulldelimiter"></span></p>
<p>Mit dieser Formel wird die Überschneidung zwischen Dokument A und Dokument B gemessen, d. h. das Verhältnis der gemeinsamen Elemente zu den gesamten eindeutigen Elementen. Ein höherer Wert bedeutet, dass sich die Dokumente ähnlicher sind.</p>
<p>Die direkte Berechnung dieses Wertes für Milliarden von Dokumentenpaaren ist jedoch ressourcenintensiv und würde Jahre dauern. MinHash erstellt kompakte "Fingerabdrücke" (Signaturen), die Ähnlichkeitsbeziehungen bewahren und Vergleiche viel schneller machen.</p>
<ol>
<li><strong>Shingling:</strong> Zerlegen Sie jedes Dokument in sich überschneidende Wort- oder Zeichenfolgen (k-shingles). Zum Beispiel ergibt der Satz "Ich liebe Vektorsuche" mit k=3 (nach Wort): {"Ich liebe Vektor", "liebe Vektorsuche"}</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/shingling_858ad58efa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li><strong>MinHashing:</strong> Wenden Sie mehrere Hash-Funktionen auf jeden Satz von Schindeln an und zeichnen Sie den minimalen Hash-Wert von jeder Funktion auf. Daraus ergibt sich ein Signaturvektor für jedes Dokument.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minhash_041003210a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Bei der Berechnung der Ähnlichkeit liefert die Wahrscheinlichkeit, dass die Hash-Werte an denselben Positionen in den MinHash-Signaturen zweier Dokumente übereinstimmen (was dem Jaccard-Abstand dieser Signaturen entspricht), eine gute Annäherung an die Jaccard-Ähnlichkeit ihrer ursprünglichen Schindelsätze. Auf diese Weise können wir die Ähnlichkeit von Dokumenten effektiv schätzen, ohne die größeren Originaltexte direkt zu vergleichen; stattdessen können wir ihre kompakten MinHash-Signaturen analysieren.</p>
<p>Beim MinHash-Prinzip wird das Wort mit dem kleinsten Hash-Wert verwendet, um das gesamte Dokument zu repräsentieren, wobei die Genauigkeit durch die Einbeziehung zusätzlicher Hash-Funktionen verbessert wird. Geringfügige Wortänderungen werden wahrscheinlich übersehen, da sie in der Regel keine Auswirkungen auf den minimalen Hash-Wert haben. Im Gegensatz dazu verändern größere Änderungen den Hashwert und werden leichter erkannt. Diese Methode kann als ein Min-Pooling von Hash-Werten über verschiedene Wörter hinweg betrachtet werden. Neben MinHash gibt es auch Alternativen wie SimHash zur Generierung von Dokumentensignaturen, die hier jedoch nicht behandelt werden.</p>
<h3 id="Step-2-Identifying-Similar-Documents-via-LSH" class="common-anchor-header">Schritt 2: Identifizierung ähnlicher Dokumente über LSH</h3><p>Selbst mit kompakten MinHash-Signaturen bleibt der Vergleich jedes Paares über Millionen oder Milliarden von Dokumenten hinweg rechenintensiv. An dieser Stelle kommt <strong>Locality Sensitive Hashing (LSH)</strong> ins Spiel.</p>
<p>Der Kerngedanke von LSH ist die Verwendung von Hash-Funktionen, die <strong>absichtlich Kollisionen verursachen - ähnliche</strong>Elemente werden mit größerer Wahrscheinlichkeit in denselben Bucket gehasht, unähnliche hingegen nicht. Dies ist das Gegenteil von traditionellem Hashing, bei dem Kollisionen vermieden werden sollen.</p>
<p>Eine beliebte LSH-Strategie für MinHash ist die <strong>Banding-Technik</strong>:</p>
<ol>
<li><p><strong>Banding</strong>: Jede MinHash-Signatur (ein Vektor der Länge <em>N</em>) wird in <em>b</em> Bänder mit jeweils <em>r</em> Zeilen<em>(N = b × r</em>) unterteilt.</p></li>
<li><p><strong>Hashing der Bänder:</strong> Jedes Band (ein Untervektor mit <em>r</em> Werten) wird mit Hilfe einer Standard-Hash-Funktion in einen Bucket gehasht.</p></li>
<li><p><strong>Kandidatenpaare:</strong> Wenn zwei Dokumente in einem <strong>beliebigen</strong> Band einen Bucket gemeinsam haben, werden sie als potenzielle Übereinstimmungen gekennzeichnet.</p></li>
</ol>
<p>Indem Sie die Anzahl der Bereiche (b) und die Anzahl der Zeilen pro Bereich ® anpassen, können Sie den Kompromiss zwischen Recall, Präzision und Sucheffizienz steuern.</p>
<p>Der Grundgedanke ist folgender: Sehr ähnliche Dokumente haben viele übereinstimmende Hash-Werte in ihren MinHash-Signaturen. Wenn diese Signaturen in Bänder aufgeteilt werden, reicht bereits ein Band mit allen übereinstimmenden Werten aus, um zwei Dokumente in denselben Bucket zu legen. Je ähnlicher die Dokumente sind, desto höher ist die Wahrscheinlichkeit, dass dies in mindestens einem Band der Fall ist, so dass LSH effizient Kandidatenpaare aufdecken kann, ohne alle Signaturen erschöpfend zu vergleichen.</p>
<p>Kurz gesagt, <strong>MinHash + LSH</strong> ermöglicht eine skalierbare approximative Deduplizierung: MinHash komprimiert Dokumente in kompakte Signaturen, und LSH grenzt den Suchraum durch Gruppierung wahrscheinlicher Übereinstimmungen effizient ein. Es ist so, als würde man Zwillinge in einer Menschenmenge entdecken: Zuerst macht man einen schnellen Schnappschuss von allen (MinHash), gruppiert die Ähnlichen (LSH) und untersucht dann die kleineren Gruppen genau auf tatsächliche Duplikate.</p>
<h2 id="Integrating-MinHash-LSH-in-Milvus-26" class="common-anchor-header">Integration von MinHash LSH in Milvus 2.6<button data-href="#Integrating-MinHash-LSH-in-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Integration von MinHash LSH in Milvus 2.6 erfolgte aus einer realen Notwendigkeit heraus. Wie bereits erwähnt, trat ein Milvus-Anwender - eines der führenden LLM-Unternehmen - mit einer Herausforderung an uns heran: die effiziente Deduplizierung großer Mengen von Textdaten für das LLM-Pre-Training.</p>
<p>Herkömmliche Deduplizierungspipelines beruhen in der Regel auf externen Tools, die von den Speicher- und Abfragesystemen entkoppelt sind und kostspielige Datentransfers zwischen den Komponenten erfordern. Dieser fragmentierte Arbeitsablauf erhöht den betrieblichen Aufwand und verhindert die volle Ausnutzung der verteilten Computerressourcen.</p>
<p>In Anbetracht der Stärken von Milvus bei der Verarbeitung von Vektordaten mit hohem Durchsatz entstand eine natürliche Idee: <strong><em>Wie wäre es, wenn MinHash LSH nativ in Milvus integriert wäre, so dass die annähernde Deduplizierung eine erstklassige Datenbankfunktion wäre?</em></strong></p>
<p>Dieser Ansatz ermöglicht einen kompletten Workflow von der Deduplizierung bis zum semantischen Abruf innerhalb von Milvus, vereinfacht MLOps und nutzt gleichzeitig dessen Skalierbarkeit und einheitliche API. Gemeinsam mit unserem Partner haben wir MinHash LSH für die Cloud-native Architektur von Milvus optimiert, was zu einer schnellen und skalierbaren Lösung für die Deduplizierung in großem Maßstab führt.</p>
<h3 id="Core-capabilities-in-Milvus-26-include" class="common-anchor-header">Zu den Kernfunktionen von Milvus 2.6 gehören:</h3><ul>
<li><p><strong>Native MinHash LSH-Indizierung:</strong> Implementiert die Standard-Banding-Technik für LSH und unterstützt optionales Jaccard-Re-Ranking zur Verbesserung der Wiederauffindbarkeit. Bietet sowohl In-Memory- als auch mmap-basierte Implementierungen für Flexibilität bei unterschiedlichen Arbeitslasten.</p></li>
<li><p><strong>Nahtlose API-Integration:</strong> Benutzer können MinHash-Vektorfelder definieren, <code translate="no">MINHASH_LSH</code> -Indizes erstellen, Signaturdaten einfügen und ungefähre Ähnlichkeitssuchen mit dem Standard-SDK von Milvus und deklarativen APIs durchführen.</p></li>
<li><p><strong>Verteilt und skalierbar:</strong> Die Funktion basiert auf der Cloud-nativen Architektur von Milvus und unterstützt die horizontale Skalierung für große Datensätze und die Verarbeitung mit hohem Durchsatz.</p></li>
</ul>
<p>Diese Integration lieferte beeindruckende Ergebnisse. Durch die Ausführung von MinHash LSH auf vollständig verwaltetem Milvus<a href="https://zilliz.com/cloud">(Zilliz Cloud</a>) konnten wir diesem Benutzer helfen, <strong>10 Milliarden Dokumente</strong> effizient zu deduplizieren. Im Vergleich zum vorherigen MapReduce-basierten Ansatz konnte die neue Lösung <strong>die Verarbeitungsgeschwindigkeit mehr als verdoppeln</strong> und dank der optimierten Indizierung und Abfrageausführung von Milvus eine <strong>3-5-fache Kosteneinsparung</strong> erzielen.</p>
<h2 id="Hands-On-Deduplicating-LLM-Datasets-Using-Milvus" class="common-anchor-header">Praktische Anwendung: Deduplizierung von LLM-Datensätzen mit Milvus<button data-href="#Hands-On-Deduplicating-LLM-Datasets-Using-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Lassen Sie uns die Ärmel hochkrempeln und MinHash LSH in Milvus 2.6 verwenden, um eine annähernde Deduplizierung im großen Maßstab durchzuführen.</p>
<h3 id="Prerequisite-Generating-MinHash-Signatures" class="common-anchor-header">Voraussetzung ist: Erzeugen von MinHash-Signaturen</h3><p>Milvus übernimmt die Indizierung und Suche von <strong>vorgenerierten</strong> MinHash-Signaturen. Sie müssen diese während der Vorverarbeitung mit Tools wie <code translate="no">datasketch</code> in Python oder einer eigenen Implementierung erzeugen. Die typischen Schritte sind:</p>
<ol>
<li><p>Lesen von Rohdokumenten</p></li>
<li><p>Shingle (Tokenisierung oder Chunking) jedes Dokuments</p></li>
<li><p>Anwendung mehrerer Hash-Funktionen zur Erzeugung einer MinHash-Signatur (z. B. ein uint64-Array der Größe 128)</p></li>
</ol>
<pre><code translate="no"><span class="hljs-keyword">from</span> datasketch <span class="hljs-keyword">import</span> MinHash

text = <span class="hljs-string">&quot;example text for minhash signature&quot;</span>
tokens = text.lower().split()  <span class="hljs-comment"># Step 1 &amp; 2: preprocess + tokenize/shingle</span>
mh = MinHash(num_perm=<span class="hljs-number">128</span>)     <span class="hljs-comment"># Step 3: initialize MinHash</span>
<span class="hljs-keyword">for</span> token <span class="hljs-keyword">in</span> tokens:
    mh.update(token.encode(<span class="hljs-string">&#x27;utf-8&#x27;</span>))  <span class="hljs-comment"># Add shingles to MinHash</span>
signature = mh.hashvalues  <span class="hljs-comment"># This is your MinHash signature (128-dimensional)</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-1-Create-a-Schema-in-Milvus" class="common-anchor-header">Schritt 1: Erstellen eines Schemas in Milvus</h3><p>Wir müssen eine Milvus-Sammlung erstellen, um die MinHash-Signaturen und ihre entsprechenden Dokument-IDs zu speichern.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> DataType
MILVUS_URI = <span class="hljs-string">&quot;localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;llm_data_dedup_minhash&quot;</span>
MINHASH_DIM = <span class="hljs-number">128</span>
MINHASH_BIT_WIDTH = <span class="hljs-number">64</span> <span class="hljs-comment"># Assuming 64-bit hash values</span>

<span class="hljs-comment"># Load data from NPY file</span>
base = np.load(<span class="hljs-string">&#x27;minhash_vectors.npy&#x27;</span>)
ids = [<span class="hljs-built_in">str</span>(i) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(base.shape[<span class="hljs-number">0</span>])]  <span class="hljs-comment"># Generate string IDs</span>

client = MilvusClient(uri=MILVUS_URI)
<span class="hljs-comment"># Check and drop existing collection if needed</span>
<span class="hljs-keyword">if</span> collection_name <span class="hljs-keyword">in</span> client.list_collections():
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection <span class="hljs-subst">{collection_name}</span> exists, dropping it...&quot;</span>)
    client.drop_collection(collection_name)
<span class="hljs-comment"># Create collection schema</span>
schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)

schema.add_field(field_name=<span class="hljs-string">&quot;input_id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;minhash&quot;</span>, datatype=DataType.BINARY_VECTOR, dim=MINHASH_DIM * MINHASH_BIT_WIDTH)
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">200</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-the-MINHASHLSH-Index-and-Collection" class="common-anchor-header"><strong>Schritt 2: Erstellen des MINHASH_LSH-Index und der Sammlung</strong></h3><p>Dies ist der wichtigste Schritt. Wir müssen JACCARD als Metrik-Typ festlegen und LSH-bezogene Parameter konfigurieren.</p>
<pre><code translate="no">INDEX_FIELD_NAME = <span class="hljs-string">&quot;minhash_signature&quot;</span>
<span class="hljs-comment"># Metric type, should be JACCARD for MinHash LSH</span>
METRIC_TYPE = <span class="hljs-string">&quot;MHJACCARD&quot;</span>
INDEX_TYPE = <span class="hljs-string">&quot;MINHASH_LSH&quot;</span>
MINHASH_DIM = <span class="hljs-number">128</span>
MINHASH_BIT_WIDTH = <span class="hljs-number">64</span> <span class="hljs-comment"># Assuming 64-bit hash values</span>

index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name=INDEX_FIELD_NAME,
    index_type=INDEX_TYPE,
    metric_type=METRIC_TYPE,
    params={
        <span class="hljs-comment"># LSH-specific parameters might be configured here, e.g.:</span>
        <span class="hljs-comment"># &quot;band&quot;: 32, # Hypothetical parameter: number of bands</span>
        <span class="hljs-comment"># &quot;element_bit_width&quot;: 64 # Bit width of minhash values</span>
    }
)
<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=collection_name,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>Ein Hinweis zur Parameterabstimmung: Die Effektivität von MinHash LSH hängt stark von der Wahl der Parameter ab. Zum Beispiel beeinflusst die Anzahl der Hash-Funktionen, die während der MinHash-Signaturerstellung verwendet werden (d.h. <code translate="no">MINHASH_DIM</code>), die Genauigkeit und Größe der Signatur. In der LSH-Phase bestimmen die Anzahl der Bänder (<code translate="no">num_bands</code>) und die Zeilen pro Band zusammen den Empfindlichkeitsbereich der Ähnlichkeitsschwelle und das Gleichgewicht zwischen Recall und Präzision. Die Benutzer müssen experimentieren und die Feinabstimmung auf der Grundlage ihrer Datensatzmerkmale und Deduplizierungsanforderungen vornehmen. Dies ist oft ein iterativer Prozess.</p>
<h3 id="Step-3-Insert-MinHash-Signatures" class="common-anchor-header"><strong>Schritt 3: MinHash-Signaturen einfügen</strong></h3><p>Nehmen wir an, Sie haben einen Stapel von Dokumenten und die entsprechenden MinHash-Signaturen.</p>
<pre><code translate="no"><span class="hljs-comment"># Insert data in batches</span>
batch_size = <span class="hljs-number">2000</span>
total_records = base.shape[<span class="hljs-number">0</span>]
num_batches = (total_records + batch_size - <span class="hljs-number">1</span>) // batch_size

<span class="hljs-keyword">for</span> batch_idx <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(num_batches):
    start = batch_idx * batch_size
    end = <span class="hljs-built_in">min</span>((batch_idx + <span class="hljs-number">1</span>) * batch_size, total_records)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserting batch <span class="hljs-subst">{batch_idx + <span class="hljs-number">1</span>}</span>/<span class="hljs-subst">{num_batches}</span> (records <span class="hljs-subst">{start}</span>-<span class="hljs-subst">{end}</span>)&quot;</span>)
    
    <span class="hljs-comment"># Prepare batch data</span>
    batch_data = [{
        <span class="hljs-string">&quot;input_id&quot;</span>: i,
        <span class="hljs-string">&quot;minhash&quot;</span>: base[i].tobytes(),
        <span class="hljs-string">&quot;id&quot;</span>: ids[i]
    } <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(start, end)]
    
    <span class="hljs-comment"># Insert batch</span>
    client.insert(collection_name, batch_data)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Data insertion complete&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Search-for-Near-Duplicates" class="common-anchor-header">Schritt 5: Suche nach Fast-Duplikaten</h3><p>Verwenden Sie die MinHash-Signatur eines Dokuments, um nach ähnlichen Dokumenten in der Sammlung zu suchen.</p>
<pre><code translate="no"><span class="hljs-comment"># Perform search</span>
search_vectors = [vec.tobytes() <span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> base[:<span class="hljs-number">10</span>]]
results = client.search(
    collection_name, 
    data=search_vectors, 
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: METRIC_TYPE, <span class="hljs-string">&quot;params&quot;</span>: search_params_lsh},
    limit=<span class="hljs-number">1</span>, 
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>])

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results:&quot;</span>)
<span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Query <span class="hljs-subst">{i}</span>:&quot;</span>)
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> result:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  - ID: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, Distance: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Post-Processing-and-Clustering" class="common-anchor-header">Schritt 6: Nachbearbeitung und Clustering</h3><p>Die zurückgegebenen Ergebnisse sind <strong>Kandidaten für Beinahe-Duplikate</strong>. Um vollständige Deduplizierungsgruppen zu bilden, können Sie Clustering-Techniken wie <strong>Union-Find</strong> auf die Kandidatenpaare anwenden. Jede daraus resultierende Gruppe stellt eine Gruppe von Duplikaten dar; behalten Sie ein repräsentatives Dokument und archivieren oder entfernen Sie den Rest.</p>
<h2 id="Conclusion" class="common-anchor-header"><strong>Fazit</strong><button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>MinHash LSH in Milvus 2.6 ist ein großer Schritt nach vorn in der KI-Datenverarbeitung. Was als Lösung für die Deduplizierung von LLM-Daten begann, öffnet nun die Türen zu breiteren Anwendungsfällen - Bereinigung von Webinhalten, Katalogmanagement, Plagiatserkennung und mehr.</p>
<p>Wenn Sie einen ähnlichen Anwendungsfall haben, kontaktieren Sie uns bitte auf dem <a href="https://discord.com/invite/8uyFbECzPX">Milvus Discord</a>, um sich für eine <a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour">Sprechstunde</a> anzumelden.</p>
