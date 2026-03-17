---
id: >-
  from-pdfs-to-answers-building-a-rag-knowledge-base-with-paddleocr-milvus-and-ernie.md
title: >-
  Von PDFs zu Antworten: Aufbau einer RAG-Wissensdatenbank mit PaddleOCR, Milvus
  und ERNIE
author: LiaoYF and Jing Zhang
date: 2026-3-17
cover: assets.zilliz.com/cover_747a1385ed.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'RAG, Milvus, vector database, hybrid search, knowledge base Q&A'
meta_title: |
  Build a RAG Knowledge Base with PaddleOCR, Milvus, and ERNIE
desc: >-
  Lernen Sie, wie Sie mit Milvus, hybrider Suche, Reranking und multimodalen
  Fragen und Antworten eine hochpräzise RAG-Wissensdatenbank aufbauen können, um
  Dokumente zu verstehen.
origin: >-
  https://milvus.io/blog/from-pdfs-to-answers-building-a-rag-knowledge-base-with-paddleocr-milvus-and-ernie.md
---
<p>Große Sprachmodelle sind weitaus leistungsfähiger als im Jahr 2023, aber sie halluzinieren immer noch im Vertrauen und greifen oft auf veraltete Informationen zurück. RAG (Retrieval-Augmented Generation) behebt beide Probleme, indem relevanter Kontext aus einer Vektordatenbank wie <a href="https://milvus.io/">Milvus</a> abgerufen wird, bevor das Modell eine Antwort erzeugt. Dieser zusätzliche Kontext verankert die Antwort in realen Quellen und macht sie aktueller.</p>
<p>Einer der häufigsten Anwendungsfälle für RAG ist eine Wissensdatenbank eines Unternehmens. Ein Benutzer lädt PDFs, Word-Dateien oder andere interne Dokumente hoch, stellt eine Frage in natürlicher Sprache und erhält eine Antwort, die auf diesen Materialien basiert und nicht nur auf dem Vortraining des Modells.</p>
<p>Die Verwendung desselben LLM und derselben Vektordatenbank garantiert jedoch nicht dasselbe Ergebnis. Zwei Teams können auf der gleichen Grundlage aufbauen und dennoch eine sehr unterschiedliche Systemqualität erzielen. Der Unterschied ergibt sich in der Regel aus den vorgelagerten Bereichen: <strong>wie Dokumente geparst, gechunked und eingebettet werden, wie die Daten indiziert werden, wie die Suchergebnisse eingestuft werden und wie die endgültige Antwort zusammengestellt wird.</strong></p>
<p>In diesem Artikel wird am Beispiel von <a href="https://github.com/LiaoYFBH/Paddle-ERNIE-RAG/blob/main/README_EN.md">Paddle-ERNIE-RAG</a> erläutert, wie eine RAG-basierte Wissensbasis mit <a href="https://github.com/PADDLEPADDLE/PADDLEOCR">PaddleOCR</a>, <a href="https://milvus.io/">Milvus</a> und ERNIE-4.5-Turbo aufgebaut wird.</p>
<h2 id="Paddle-ERNIE-RAG-System-Architecture" class="common-anchor-header">Paddle-ERNIE-RAG Systemarchitektur<button data-href="#Paddle-ERNIE-RAG-System-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Paddle-ERNIE-RAG-Architektur besteht aus vier Kernschichten:</p>
<ul>
<li><strong>Datenextraktionsschicht.</strong> <a href="https://github.com/PaddlePaddle/PaddleOCR">PP-StructureV3</a>, die Dokumenten-Parsing-Pipeline in PaddleOCR, liest PDFs und Bilder mit Layout-bewusster OCR. Sie bewahrt die Dokumentstruktur - Überschriften, Tabellen, Lesereihenfolge - und gibt saubere Markdown-Dateien aus, die in sich überschneidende Abschnitte aufgeteilt sind.</li>
<li><strong>Vektorielle Speicherebene.</strong> Jeder Chunk wird in einen 384-dimensionalen Vektor eingebettet und in <a href="https://milvus.io"></a><a href="https://milvus.io">Milvus</a> zusammen mit Metadaten (Dateiname, Seitenzahl, Chunk-ID) gespeichert. Ein paralleler invertierter Index unterstützt die Stichwortsuche.</li>
<li><strong>Abfrage- und Beantwortungsschicht.</strong> Jede Abfrage wird sowohl mit dem Vektorindex als auch mit dem Schlüsselwortindex abgeglichen. Die Ergebnisse werden über RRF (Reciprocal Rank Fusion) zusammengeführt, neu eingestuft und an das <a href="https://github.com/LiaoYFBH/Paddle-ERNIE-RAG">ERNIE-Modell</a> zur Generierung von Antworten weitergeleitet.</li>
<li><strong>Anwendungsschicht.</strong> Über die<a href="https://www.gradio.app/">Gradio-Schnittstelle</a> <a href="https://www.gradio.app/"></a><a href="https://www.gradio.app/"></a> können Sie Dokumente hochladen, Fragen stellen und die Antworten mit Quellenangaben und Vertrauensbewertungen anzeigen.  <span class="img-wrapper">
    <img translate="no" src="blob:https://septemberfd.github.io/9043a059-de46-49b1-9399-f915aed555dc" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ul>
<p>In den folgenden Abschnitten wird jede Phase der Reihe nach durchlaufen, beginnend damit, wie aus Rohdokumenten durchsuchbarer Text wird.</p>
<h2 id="How-to-Build-RAG-Pipeline-Step-by-Step" class="common-anchor-header">Aufbau der RAG-Pipeline Schritt für Schritt<button data-href="#How-to-Build-RAG-Pipeline-Step-by-Step" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Step-1-Parse-Documents-with-PP-StructureV3" class="common-anchor-header">Schritt 1: Parsen von Dokumenten mit PP-StructureV3</h3><p>Bei Rohdokumenten beginnen die meisten Genauigkeitsprobleme. Forschungspapiere und technische Berichte enthalten zweispaltige Layouts, Formeln, Tabellen und Bilder. Beim Extrahieren von Text mit einer einfachen Bibliothek wie PyPDF2 wird die Ausgabe in der Regel verstümmelt: Absätze erscheinen durcheinander, Tabellen fallen zusammen, und Formeln verschwinden.</p>
<p>Um diese Probleme zu vermeiden, erstellt das Projekt eine OnlinePDFParser-Klasse in backend.py. Diese Klasse ruft die PP-StructureV3 Online-API auf, um das Layout-Parsing durchzuführen. Anstatt den Rohtext zu extrahieren, identifiziert sie die Struktur des Dokuments und wandelt es dann in das Markdown-Format um.</p>
<p>Diese Methode hat drei klare Vorteile:</p>
<ul>
<li><strong>Saubere Markdown-Ausgabe</strong></li>
</ul>
<p>Die Ausgabe wird als Markdown mit korrekten Überschriften und Absätzen formatiert. Dadurch ist der Inhalt für das Modell leichter zu verstehen.</p>
<ul>
<li><strong>Separate Bildextraktion</strong></li>
</ul>
<p>Das System extrahiert und speichert Bilder während des Parsens. Dadurch geht keine wichtige visuelle Information verloren.</p>
<ul>
<li><strong>Bessere Kontextbehandlung</strong></li>
</ul>
<p>Der Text wird mithilfe eines gleitenden Fensters mit Überlappung aufgeteilt. Dadurch wird vermieden, dass Sätze oder Formeln in der Mitte abgeschnitten werden, was dazu beiträgt, dass der Sinn klar bleibt und die Suchgenauigkeit verbessert wird.</p>
<p><strong>Grundlegender Parsing-Fluss</strong></p>
<p>In backend.py erfolgt das Parsing in drei einfachen Schritten:</p>
<ol>
<li>Senden Sie die PDF-Datei an die PP-StructureV3-API.</li>
<li>Lesen der zurückgegebenen layoutParsingResults.</li>
<li>Extrahieren des bereinigten Markdown-Textes und aller Bilder.</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># backend.py (Core logic summary of the OnlinePDFParser class)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">predict</span>(<span class="hljs-params">self, file_path</span>):
    <span class="hljs-comment"># 1. Convert file to Base64</span>
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;rb&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_data = base64.b64encode(file.read()).decode(<span class="hljs-string">&quot;ascii&quot;</span>)
    <span class="hljs-comment"># 2. Build request payload</span>
    payload = {
        <span class="hljs-string">&quot;file&quot;</span>: file_data,
        <span class="hljs-string">&quot;fileType&quot;</span>: <span class="hljs-number">1</span>, <span class="hljs-comment"># PDF type</span>
        <span class="hljs-string">&quot;useChartRecognition&quot;</span>: <span class="hljs-literal">False</span>, <span class="hljs-comment"># Configure based on requirements</span>
        <span class="hljs-string">&quot;useDocOrientationClassify&quot;</span>: <span class="hljs-literal">False</span>
    }
    <span class="hljs-comment"># 3. Send request to get Layout Parsing results</span>
    response = requests.post(<span class="hljs-variable language_">self</span>.api_url, json=payload, headers=headers)
    res_json = response.json()
    <span class="hljs-comment"># 4. Extract Markdown text and images</span>
    parsing_results = res_json.get(<span class="hljs-string">&quot;result&quot;</span>, {}).get(<span class="hljs-string">&quot;layoutParsingResults&quot;</span>, [])
    mock_outputs = []
    <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> parsing_results:
        md_text = item.get(<span class="hljs-string">&quot;markdown&quot;</span>, {}).get(<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
        images = item.get(<span class="hljs-string">&quot;markdown&quot;</span>, {}).get(<span class="hljs-string">&quot;images&quot;</span>, {})
        <span class="hljs-comment"># ... (subsequent image downloading and text cleaning logic)</span>
        mock_outputs.append(MockResult(md_text, images))
    <span class="hljs-keyword">return</span> mock_outputs, <span class="hljs-string">&quot;Success&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Chunk-Text-with-Sliding-Window-Overlap" class="common-anchor-header">Schritt 2: Chunk Text mit Sliding Window Overlap</h3><p>Nach dem Parsen muss der Markdown-Text für die Suche in kleinere Stücke (Chunks) aufgeteilt werden. Wenn der Text in festen Längen geschnitten wird, können Sätze oder Formeln in zwei Hälften geteilt werden.</p>
<p>Um dies zu verhindern, verwendet das System Sliding Window Chunking mit Überlappung. Jedes Chunk teilt sich einen Teil des Endes mit dem nächsten, so dass Grenzinhalte in beiden Fenstern erscheinen. Dadurch bleibt die Bedeutung an den Rändern des Chunks erhalten und die Wiederauffindbarkeit wird verbessert.</p>
<pre><code translate="no"><span class="hljs-comment"># backend.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">split_text_into_chunks</span>(<span class="hljs-params">text: <span class="hljs-built_in">str</span>, chunk_size: <span class="hljs-built_in">int</span> = <span class="hljs-number">300</span>, overlap: <span class="hljs-built_in">int</span> = <span class="hljs-number">120</span></span>) -&gt; <span class="hljs-built_in">list</span>:
    <span class="hljs-string">&quot;&quot;&quot;Sliding window-based text chunking that preserves overlap-length contextual overlap&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> text: <span class="hljs-keyword">return</span> []
    lines = [line.strip() <span class="hljs-keyword">for</span> line <span class="hljs-keyword">in</span> text.split(<span class="hljs-string">&quot;\n&quot;</span>) <span class="hljs-keyword">if</span> line.strip()]
    chunks = []
    current_chunk = []
    current_length = <span class="hljs-number">0</span>
    <span class="hljs-keyword">for</span> line <span class="hljs-keyword">in</span> lines:
        <span class="hljs-keyword">while</span> <span class="hljs-built_in">len</span>(line) &gt; chunk_size:
            <span class="hljs-comment"># Handle overly long single line</span>
            part = line[:chunk_size]
            line = line[chunk_size:]
            current_chunk.append(part)
            <span class="hljs-comment"># ... (chunking logic) ...</span>
        current_chunk.append(line)
        current_length += <span class="hljs-built_in">len</span>(line)
        <span class="hljs-comment"># When accumulated length exceeds the threshold, generate a chunk</span>
        <span class="hljs-keyword">if</span> current_length &gt; chunk_size:
            chunks.append(<span class="hljs-string">&quot;\n&quot;</span>.join(current_chunk))
            <span class="hljs-comment"># Roll back: keep the last overlap-length text as the start of the next chunk</span>
            overlap_text = current_chunk[-<span class="hljs-number">1</span>][-overlap:] <span class="hljs-keyword">if</span> current_chunk <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;&quot;</span>
            current_chunk = [overlap_text] <span class="hljs-keyword">if</span> overlap_text <span class="hljs-keyword">else</span> []
            current_length = <span class="hljs-built_in">len</span>(overlap_text)
    <span class="hljs-keyword">if</span> current_chunk:
        chunks.append(<span class="hljs-string">&quot;\n&quot;</span>.join(current_chunk).strip())
    <span class="hljs-keyword">return</span> chunks
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Store-Vectors-and-Metadata-in-Milvus" class="common-anchor-header">Schritt 3: Speichern von Vektoren und Metadaten in Milvus</h3><p>Nachdem die sauberen Chunks fertig sind, müssen sie in einem nächsten Schritt so gespeichert werden, dass sie schnell und präzise abgerufen werden können.</p>
<p><strong>Vektorspeicherung und Metadaten</strong></p>
<p>Milvus wendet strenge Regeln für Sammlungsnamen an - nur ASCII-Buchstaben, Zahlen und Unterstriche. Enthält ein Wissensbasis-Name Nicht-ASCII-Zeichen, wird er vom Backend vor der Erstellung der Sammlung mit einem kb_-Präfix hexkodiert und für die Anzeige dekodiert. Ein kleines Detail, aber eines, das kryptische Fehler verhindert.</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> binascii
<span class="hljs-keyword">import</span> re

<span class="hljs-keyword">def</span> <span class="hljs-title function_">encode_name</span>(<span class="hljs-params">ui_name</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert a foreign name into a Milvus-valid hexadecimal string&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> ui_name: <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;&quot;</span>
    <span class="hljs-comment"># If it only contains English letters, numbers, or underscores, return it directly</span>
    <span class="hljs-keyword">if</span> re.<span class="hljs-keyword">match</span>(<span class="hljs-string">r&#x27;^[a-zA-Z_][a-zA-Z0-9_]*$&#x27;</span>, ui_name):
        <span class="hljs-keyword">return</span> ui_name
    <span class="hljs-comment"># Encode to Hex and add the kb_ prefix</span>
    hex_str = binascii.hexlify(ui_name.encode(<span class="hljs-string">&#x27;utf-8&#x27;</span>)).decode(<span class="hljs-string">&#x27;utf-8&#x27;</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;kb_<span class="hljs-subst">{hex_str}</span>&quot;</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">decode_name</span>(<span class="hljs-params">real_name</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert a hexadecimal string back to original language&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> real_name.startswith(<span class="hljs-string">&quot;kb_&quot;</span>):
        <span class="hljs-keyword">try</span>:
            hex_str = real_name[<span class="hljs-number">3</span>:]
            <span class="hljs-keyword">return</span> binascii.unhexlify(hex_str).decode(<span class="hljs-string">&#x27;utf-8&#x27;</span>)
        <span class="hljs-keyword">except</span>:
            <span class="hljs-keyword">return</span> real_name
    <span class="hljs-keyword">return</span> real_name
<button class="copy-code-btn"></button></code></pre>
<p>Neben der Namensgebung durchläuft jeder Chunk vor dem Einfügen zwei Schritte: die Erzeugung einer Einbettung und das Anhängen von Metadaten.</p>
<ul>
<li><strong>Was gespeichert wird:</strong></li>
</ul>
<p>Jeder Chunk wird in einen 384-dimensionalen dichten Vektor umgewandelt. Gleichzeitig speichert das Milvus-Schema zusätzliche Felder wie den Dateinamen, die Seitenzahl und die Chunk-ID.</p>
<ul>
<li><strong>Warum dies wichtig ist:</strong></li>
</ul>
<p>So kann eine Antwort genau zu der Seite zurückverfolgt werden, von der sie stammt. Außerdem bereitet es das System auf künftige multimodale Q&amp;A-Anwendungen vor.</p>
<ul>
<li><strong>Optimierung der Leistung:</strong></li>
</ul>
<p>In vector_store.py verwendet die Methode insert_documents die Batch-Einbettung. Dies reduziert die Anzahl der Netzwerkanfragen und macht den Prozess effizienter.</p>
<pre><code translate="no"><span class="hljs-comment"># vector_store.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">insert_documents</span>(<span class="hljs-params">self, documents</span>):
    <span class="hljs-string">&quot;&quot;&quot;Batch vectorization and insertion into Milvus&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> documents: <span class="hljs-keyword">return</span>
    <span class="hljs-comment"># 1. Extract plain text list and request the embedding model in batch</span>
    texts = [doc[<span class="hljs-string">&#x27;content&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> documents]
    embeddings = <span class="hljs-variable language_">self</span>.get_embeddings(texts)
    <span class="hljs-comment"># 2. Data cleaning: filter out invalid data where embedding failed</span>
    valid_docs, valid_vectors = [], []
    <span class="hljs-keyword">for</span> i, emb <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(embeddings):
        <span class="hljs-keyword">if</span> emb <span class="hljs-keyword">and</span> <span class="hljs-built_in">len</span>(emb) == <span class="hljs-number">384</span>: <span class="hljs-comment"># Ensure the vector dimension is correct</span>
            valid_docs.append(documents[i])
            valid_vectors.append(emb)
    <span class="hljs-comment"># 3. Assemble columnar data (Columnar Format)</span>
    <span class="hljs-comment"># Milvus insert API requires each field to be passed in list format</span>
    data = [
        [doc[<span class="hljs-string">&#x27;filename&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],  <span class="hljs-comment"># Scalar: file name</span>
        [doc[<span class="hljs-string">&#x27;page&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],      <span class="hljs-comment"># Scalar: page number (for traceability)</span>
        [doc[<span class="hljs-string">&#x27;chunk_id&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],  <span class="hljs-comment"># Scalar: chunk ID</span>
        [doc[<span class="hljs-string">&#x27;content&#x27;</span>] <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> valid_docs],   <span class="hljs-comment"># Scalar: original content (for keyword search)</span>
        valid_vectors                             <span class="hljs-comment"># Vector: semantic vector</span>
    ]
    <span class="hljs-comment"># 4. Execute insertion and persistence</span>
    <span class="hljs-variable language_">self</span>.collection.insert(data)
    <span class="hljs-variable language_">self</span>.collection.flush()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Retrieve-with-Hybrid-Search-and-RRF-Fusion" class="common-anchor-header">Schritt 4: Abrufen mit hybrider Suche und RRF-Fusion</h3><p>Eine einzelne Suchmethode ist selten ausreichend. Die Vektorsuche findet semantisch ähnliche Inhalte, kann aber exakte Begriffe übersehen; die Schlagwortsuche findet spezifische Begriffe, lässt aber Umschreibungen außer Acht. Die parallele Ausführung beider Methoden und die Zusammenführung der Ergebnisse führt zu besseren Ergebnissen als jede Methode für sich.</p>
<p>Wenn die Abfragesprache von der Sprache des Dokuments abweicht, übersetzt das System die Abfrage zunächst mit einem LLM, so dass beide Suchpfade in der Sprache des Dokuments arbeiten können. Dann laufen zwei Suchvorgänge parallel:</p>
<ul>
<li><strong>Vektorsuche (dicht):</strong> Findet Inhalte mit ähnlicher Bedeutung, sogar in verschiedenen Sprachen, kann aber auch verwandte Passagen finden, die die Frage nicht direkt beantworten.</li>
<li><strong>Schlüsselwortsuche (sparse):</strong> Findet exakte Übereinstimmungen mit Fachbegriffen, Zahlen oder Formelvariablen - die Art von Tokens, über die Vektoreinbettungen oft hinweggehen.</li>
</ul>
<p>Das System führt beide Ergebnislisten mithilfe von RRF (Reciprocal Rank Fusion) zusammen. Jeder Kandidat erhält eine Punktzahl, die auf seinem Rang in jeder Liste basiert, so dass ein Chunk, der in <em>beiden</em> Listen ganz oben steht, die höchste Punktzahl erhält. Die Vektorsuche trägt zur semantischen Abdeckung bei, die Schlagwortsuche zur Genauigkeit der Begriffe.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_From_PD_Fsto_Answers_Buildinga_RAG_Knowledge_Bas_1_d241e95fc2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<pre><code translate="no"><span class="hljs-comment"># Summary of retrieval logic in vector_store.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">search</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">10</span>, **kwargs</span>):
    <span class="hljs-string">&#x27;&#x27;&#x27;Vector search (Dense + Keyword) + RRF fusion&#x27;&#x27;&#x27;</span>
    <span class="hljs-comment"># 1. Vector search (Dense)</span>
    dense_results = []
    query_vector = <span class="hljs-variable language_">self</span>.embedding_client.get_embedding(query)  <span class="hljs-comment"># ... (Milvus search code) ...</span>
    <span class="hljs-comment"># 2. Keyword search</span>
    <span class="hljs-comment"># Perform jieba tokenization and build like &quot;%keyword%&quot; queries</span>
    keyword_results = <span class="hljs-variable language_">self</span>._keyword_search(query, top_k=top_k * <span class="hljs-number">5</span>, expr=expr)
    <span class="hljs-comment"># 3. RRF fusion</span>
    rank_dict = {}
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">apply_rrf</span>(<span class="hljs-params">results_list, k=<span class="hljs-number">60</span>, weight=<span class="hljs-number">1.0</span></span>):
        <span class="hljs-keyword">for</span> rank, item <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results_list):
            doc_id = item.get(<span class="hljs-string">&#x27;id&#x27;</span>) <span class="hljs-keyword">or</span> item.get(<span class="hljs-string">&#x27;chunk_id&#x27;</span>)
            <span class="hljs-keyword">if</span> doc_id <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> rank_dict:
                rank_dict[doc_id] = {<span class="hljs-string">&quot;data&quot;</span>: item, <span class="hljs-string">&quot;score&quot;</span>: <span class="hljs-number">0.0</span>}
            <span class="hljs-comment"># Core RRF formula</span>
            rank_dict[doc_id][<span class="hljs-string">&quot;score&quot;</span>] += weight * (<span class="hljs-number">1.0</span> / (k + rank))
    apply_rrf(dense_results, weight=<span class="hljs-number">4.0</span>)
    apply_rrf(keyword_results, weight=<span class="hljs-number">1.0</span>)
    <span class="hljs-comment"># 4. Sort and return results</span>
    sorted_docs = <span class="hljs-built_in">sorted</span>(rank_dict.values(), key=<span class="hljs-keyword">lambda</span> x: x[<span class="hljs-string">&#x27;score&#x27;</span>], reverse=<span class="hljs-literal">True</span>)
    <span class="hljs-keyword">return</span> [item[<span class="hljs-string">&#x27;data&#x27;</span>] <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> sorted_docs[:top_k * <span class="hljs-number">2</span>]]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Rerank-Results-Before-Answer-Generation" class="common-anchor-header">Schritt 5: Neuordnung der Ergebnisse vor der Antwortgenerierung</h3><p>Die vom Suchschritt zurückgegebenen Chunks sind nicht gleichermaßen relevant. Bevor die endgültige Antwort generiert wird, werden sie daher in einem Reranking-Schritt neu bewertet.</p>
<p>In reranker_v2.py bewertet eine kombinierte Scoring-Methode jeden Chunk, der unter fünf Aspekten bewertet wird:</p>
<ul>
<li><strong>Fuzzy-Matching</strong></li>
</ul>
<p>Mit fuzzywuzzy wird geprüft, wie ähnlich der Wortlaut des Chunks der Anfrage ist. Damit wird die direkte Textüberschneidung gemessen.</p>
<ul>
<li><strong>Schlüsselwort-Abdeckung</strong></li>
</ul>
<p>Es wird geprüft, wie viele wichtige Wörter der Suchanfrage im Chunk vorkommen. Je mehr Schlüsselwortübereinstimmungen, desto höher die Punktzahl.</p>
<ul>
<li><strong>Semantische Ähnlichkeit</strong></li>
</ul>
<p>Wir verwenden die von Milvus zurückgegebene Vektorähnlichkeitsbewertung. Dieser gibt an, wie nahe die Bedeutungen beieinander liegen.</p>
<ul>
<li><strong>Länge und ursprünglicher Rang</strong></li>
</ul>
<p>Sehr kurze Chunks werden benachteiligt, da ihnen oft der Kontext fehlt. Chunks, die in den ursprünglichen Milvus-Ergebnissen einen höheren Rang hatten, erhalten einen kleinen Bonus.</p>
<ul>
<li><strong>Erkennung benannter Entitäten</strong></li>
</ul>
<p>Das System erkennt großgeschriebene Begriffe wie "Milvus" oder "RAG" als wahrscheinliche Eigennamen und identifiziert Mehrwort-Fachbegriffe als mögliche Schlüsselsätze.</p>
<p>Jeder Faktor hat ein Gewicht in der Endbewertung (siehe Abbildung unten).</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_From_PD_Fsto_Answers_Buildinga_RAG_Knowledge_Bas_2_2bce5d382a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Es werden keine Trainingsdaten benötigt, und der Beitrag jedes Faktors ist sichtbar. Wenn ein Chunk unerwartet hoch oder niedrig rangiert, erklären die Bewertungen, warum. Bei einem vollständigen Blackbox-Ranker ist das nicht möglich.</p>
<pre><code translate="no"><span class="hljs-comment"># reranker_v2.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">_calculate_composite_score</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, chunk: <span class="hljs-type">Dict</span>[<span class="hljs-built_in">str</span>, <span class="hljs-type">Any</span>]</span>) -&gt; <span class="hljs-built_in">float</span>:
    content = chunk.get(<span class="hljs-string">&#x27;content&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
    <span class="hljs-comment"># 1. Surface text similarity (FuzzyWuzzy)</span>
    fuzzy_score = fuzz.partial_ratio(query, content)
    <span class="hljs-comment"># 2. Keyword coverage</span>
    query_keywords = <span class="hljs-variable language_">self</span>._extract_keywords(query)
    content_keywords = <span class="hljs-variable language_">self</span>._extract_keywords(content)
    keyword_coverage = (<span class="hljs-built_in">len</span>(query_keywords &amp; content_keywords) / <span class="hljs-built_in">len</span>(query_keywords)) * <span class="hljs-number">100</span> <span class="hljs-keyword">if</span> query_keywords <span class="hljs-keyword">else</span> <span class="hljs-number">0</span>
    <span class="hljs-comment"># 3. Vector semantic score (normalized)</span>
    milvus_distance = chunk.get(<span class="hljs-string">&#x27;semantic_score&#x27;</span>, <span class="hljs-number">0</span>)
    milvus_similarity = <span class="hljs-number">100</span> / (<span class="hljs-number">1</span> + milvus_distance * <span class="hljs-number">0.1</span>)
    <span class="hljs-comment"># 4. Length penalty (prefer paragraphs between 200–600 characters)</span>
    content_len = <span class="hljs-built_in">len</span>(content)
    <span class="hljs-keyword">if</span> <span class="hljs-number">200</span> &lt;= content_len &lt;= <span class="hljs-number">600</span>:
        length_score = <span class="hljs-number">100</span>
    <span class="hljs-keyword">else</span>:
        <span class="hljs-comment"># ... (penalty logic)</span>
        length_score = <span class="hljs-number">100</span> - <span class="hljs-built_in">min</span>(<span class="hljs-number">50</span>, <span class="hljs-built_in">abs</span>(content_len - <span class="hljs-number">400</span>) / <span class="hljs-number">20</span>)
    <span class="hljs-comment"># Weighted sum</span>
    base_score = (
        fuzzy_score * <span class="hljs-number">0.25</span> +
        keyword_coverage * <span class="hljs-number">0.25</span> +
        milvus_similarity * <span class="hljs-number">0.35</span> +
        length_score * <span class="hljs-number">0.15</span>
    )
    <span class="hljs-comment"># Position weight</span>
    position_bonus = <span class="hljs-number">0</span>
    <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;milvus_rank&#x27;</span> <span class="hljs-keyword">in</span> chunk:
        rank = chunk[<span class="hljs-string">&#x27;milvus_rank&#x27;</span>]
        position_bonus = <span class="hljs-built_in">max</span>(<span class="hljs-number">0</span>, <span class="hljs-number">20</span> - rank)
    <span class="hljs-comment"># Extra bonus for proper noun detection</span>
    proper_noun_bonus = <span class="hljs-number">30</span> <span class="hljs-keyword">if</span> <span class="hljs-variable language_">self</span>._check_proper_nouns(query, content) <span class="hljs-keyword">else</span> <span class="hljs-number">0</span>
    <span class="hljs-keyword">return</span> base_score + proper_noun_bonus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Add-Multimodal-QA-for-Charts-and-Diagrams" class="common-anchor-header">Schritt 6: Hinzufügen von multimodalen Fragen und Antworten für Diagramme und Grafiken</h3><p>Forschungsarbeiten enthalten oft wichtige Grafiken und Diagramme, die Informationen enthalten, die der Text nicht enthält. Eine reine Text-RAG-Pipeline würde diese Signale völlig übersehen.  Deshalb haben wir eine einfache bildbasierte Frage- und Antwortfunktion mit drei Teilen hinzugefügt:</p>
<p><strong>1. Hinzufügen von mehr Kontext zur Eingabeaufforderung</strong></p>
<p>Wenn ein Bild an das Modell gesendet wird, erhält das System auch den OCR-Text von derselben Seite.<br>
Die Eingabeaufforderung enthält: das Bild, den Text der Seite und die Frage des Benutzers.<br>
Dies hilft dem Modell, den gesamten Kontext zu verstehen und reduziert Fehler beim Lesen des Bildes.</p>
<pre><code translate="no"><span class="hljs-comment"># backend.py - Core logic for multimodal Q&amp;A</span>
<span class="hljs-comment"># 1. Retrieve OCR text from the current page as background context</span>
<span class="hljs-comment"># The system pulls the full page text where the image appears from Milvus,</span>
<span class="hljs-comment"># based on the document name and page number.</span>
<span class="hljs-comment"># page_num is parsed from the image file name sent by the frontend (e.g., &quot;p3_figure.jpg&quot; -&gt; Page 3)</span>
page_text_context = milvus_store.get_page_content(doc_name, page_num)[:<span class="hljs-number">800</span>]
<span class="hljs-comment"># 2. Dynamically build a context-enhanced prompt</span>
<span class="hljs-comment"># Key idea: explicitly align visual information with textual background</span>
<span class="hljs-comment"># to prevent hallucinations caused by answering from the image alone</span>
final_prompt = <span class="hljs-string">f&quot;&quot;&quot;
[Task] Answer the question using both the image and the background information.
[Image Metadata] Source: <span class="hljs-subst">{doc_name}</span> (P<span class="hljs-subst">{page_num}</span>)
[Background Text] <span class="hljs-subst">{page_text_context}</span> ... (long text omitted here)
[User Question] <span class="hljs-subst">{user_question}</span>
&quot;&quot;&quot;</span>
<span class="hljs-comment"># 3. Send multimodal request (Vision API)</span>
<span class="hljs-comment"># The underlying layer converts the image to Base64 and sends it</span>
<span class="hljs-comment"># together with final_prompt to the ERNIE-VL model</span>
answer = ernie_client.chat_with_image(query=final_prompt, image_path=img_path)
<button class="copy-code-btn"></button></code></pre>
<p><strong>2. Unterstützung der Vision API</strong></p>
<p>Der Client (ernie_client.py) unterstützt das OpenAI-Vision-Format. Bilder werden in Base64 konvertiert und im Format image_url gesendet, so dass das Modell Bild und Text gemeinsam verarbeiten kann.</p>
<pre><code translate="no"><span class="hljs-comment"># ernie_client.py</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">chat_with_image</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, image_path: <span class="hljs-built_in">str</span></span>):
   base64_image = <span class="hljs-variable language_">self</span>._encode_image(image_path)
   <span class="hljs-comment"># Build Vision message format</span>
   messages = [
      {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
            <span class="hljs-string">&quot;content&quot;</span>: [
               {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: query},
               {
                  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>,
                  <span class="hljs-string">&quot;image_url&quot;</span>: {
                        <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">f&quot;data:image/jpeg;base64,<span class="hljs-subst">{base64_image}</span>&quot;</span>
                  }
               }
            ]
      }
   ]
   <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.chat(messages)
<button class="copy-code-btn"></button></code></pre>
<p><strong>3. Fallback-Plan</strong></p>
<p>Wenn die Bild-API fehlschlägt (z. B. aufgrund von Netzwerkproblemen oder Modellgrenzen), schaltet das System auf die normale textbasierte RAG zurück.<br>
Es verwendet den OCR-Text zur Beantwortung der Frage, so dass das System ohne Unterbrechung weiterarbeitet.</p>
<pre><code translate="no"><span class="hljs-comment"># Fallback logic in backend.py</span>
<span class="hljs-keyword">try</span>:
   answer = ernie.chat_with_image(final_prompt, img_path)
   <span class="hljs-comment"># ...</span>
<span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
   <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;⚠️ Model does not support images. Switching to text mode.&quot;</span>)
   <span class="hljs-comment"># Fallback: use the extracted text as context to continue answering</span>
   answer, metric = ask_question_logic(final_prompt, collection_name)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Key-UI-Features-and-Implementation-for-Pipeline" class="common-anchor-header">Wichtige UI-Funktionen und Implementierung für Pipeline<button data-href="#Key-UI-Features-and-Implementation-for-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-to-Handle-API-Rate-Limiting-and-Protection" class="common-anchor-header">Umgang mit API-Ratenbegrenzung und Schutz</h3><p>Beim Aufruf von LLM oder der Einbettung von APIs kann das System manchmal den Fehler <strong>429 Too Many Requests</strong> erhalten. Dies geschieht in der Regel, wenn zu viele Anfragen in kurzer Zeit gesendet werden.</p>
<p>Um dies zu bewältigen, fügt das Projekt einen adaptiven Verlangsamungsmechanismus in ernie_client.py ein. Wenn ein Fehler bei der Ratenbegrenzung auftritt, reduziert das System automatisch die Geschwindigkeit der Anfragen und versucht es erneut, anstatt abzubrechen.</p>
<pre><code translate="no"><span class="hljs-comment"># Logic for handling rate limiting</span>
<span class="hljs-keyword">if</span> is_rate_limit:
    <span class="hljs-variable language_">self</span>._adaptive_slow_down()  <span class="hljs-comment"># Permanently increase the request interval</span>
    wait_time = (<span class="hljs-number">2</span> ** attempt) + random.uniform(<span class="hljs-number">1.0</span>, <span class="hljs-number">3.0</span>)  <span class="hljs-comment"># Exponential backoff</span>
    time.sleep(wait_time)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">_adaptive_slow_down</span>(<span class="hljs-params">self</span>):
    <span class="hljs-string">&quot;&quot;&quot;Trigger adaptive downgrade: when rate limiting occurs, permanently increase the global request interval&quot;&quot;&quot;</span>
    <span class="hljs-variable language_">self</span>.current_delay = <span class="hljs-built_in">min</span>(<span class="hljs-variable language_">self</span>.current_delay * <span class="hljs-number">2.0</span>, <span class="hljs-number">15.0</span>)
    logger.warning(<span class="hljs-string">f&quot;📉 Rate limit triggered (429), system automatically slowing down: new interval <span class="hljs-subst">{self.current_delay:<span class="hljs-number">.2</span>f}</span>s&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Dies trägt dazu bei, das System stabil zu halten, insbesondere bei der Verarbeitung und Einbettung einer großen Anzahl von Dokumenten.</p>
<h3 id="Custom-Styling" class="common-anchor-header">Benutzerdefiniertes Styling</h3><p>Das Frontend verwendet Gradio (main.py). Wir haben benutzerdefiniertes CSS (modern_css) hinzugefügt, um die Schnittstelle sauberer und einfacher zu gestalten.</p>
<ul>
<li><strong>Eingabefeld</strong></li>
</ul>
<p>Das graue Standarddesign wurde durch ein weißes, abgerundetes Design ersetzt. Es sieht einfacher und moderner aus.</p>
<ul>
<li><strong>Schaltfläche Senden</strong></li>
</ul>
<p>Es wurde ein Farbverlauf und ein Hover-Effekt hinzugefügt, damit sie besser zur Geltung kommt.</p>
<pre><code translate="no"><span class="hljs-comment">/* main.py - modern_css snippet */</span>
<span class="hljs-comment">/* Force the input box to use a white background with rounded corners, simulating a modern chat app */</span>
.custom-textbox textarea {
    background-color: 
<span class="hljs-meta">#ffffff</span>
 !important;
    border: <span class="hljs-number">1</span>px solid 
<span class="hljs-meta">#e5e7eb</span>
 !important;
    border-radius: <span class="hljs-number">12</span>px !important;
    box-shadow: <span class="hljs-number">0</span> <span class="hljs-number">4</span>px <span class="hljs-number">12</span><span class="hljs-function">px <span class="hljs-title">rgba</span>(<span class="hljs-params"><span class="hljs-number">0</span>,<span class="hljs-number">0</span>,<span class="hljs-number">0</span>,<span class="hljs-number">0.05</span></span>) !important</span>;
    padding: <span class="hljs-number">14</span>px !important;
}
<span class="hljs-comment">/* Gradient send button */</span>
.send-btn {
    background: linear-gradient(<span class="hljs-number">135</span>deg, 
<span class="hljs-meta">#6366f1</span>
 <span class="hljs-number">0</span>%, 
<span class="hljs-meta">#4f46e5</span>
 <span class="hljs-number">100</span>%) !important;
    color: white !important;
    box-shadow: <span class="hljs-number">0</span> <span class="hljs-number">4</span>px <span class="hljs-number">10</span><span class="hljs-function">px <span class="hljs-title">rgba</span>(<span class="hljs-params"><span class="hljs-number">99</span>, <span class="hljs-number">102</span>, <span class="hljs-number">241</span>, <span class="hljs-number">0.3</span></span>) !important</span>;
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="LaTeX-Formula-Rendering" class="common-anchor-header">LaTeX-Formel-Rendering</h3><p>Viele Forschungsdokumente enthalten mathematische Formeln, weshalb eine korrekte Darstellung wichtig ist. Wir haben vollständige LaTeX-Unterstützung für Inline- und Blockformeln hinzugefügt.</p>
<ul>
<li><strong>Anwendungsbereich</strong>Die Konfiguration funktioniert sowohl im Chatfenster (Chatbot) als auch im Zusammenfassungsbereich (Markdown).</li>
<li><strong>Praktisches Ergebnis:</strong>Unabhängig davon, ob die Formeln in der Antwort des Modells oder in den Zusammenfassungen der Dokumente erscheinen, werden sie auf der Seite korrekt wiedergegeben.</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Configure LaTeX rules in main.py</span>
latex_config = [
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;$$&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;$$&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">True</span>},    <span class="hljs-comment"># Recognize block equations</span>
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;$&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;$&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">False</span>},     <span class="hljs-comment"># Recognize inline equations</span>
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;\(&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;\)&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">False</span>}, <span class="hljs-comment"># Standard LaTeX inline</span>
    {<span class="hljs-string">&quot;left&quot;</span>: <span class="hljs-string">&quot;\[&quot;</span>, <span class="hljs-string">&quot;right&quot;</span>: <span class="hljs-string">&quot;\]&quot;</span>, <span class="hljs-string">&quot;display&quot;</span>: <span class="hljs-literal">True</span>}   <span class="hljs-comment"># Standard LaTeX block</span>
]
<span class="hljs-comment"># Then inject this configuration when initializing components:</span>
<span class="hljs-comment"># Enable LaTeX in Chatbot</span>
chatbot = gr.Chatbot(
    label=<span class="hljs-string">&quot;Conversation&quot;</span>,
    <span class="hljs-comment"># ... other parameters ...</span>
    latex_delimiters=latex_config  <span class="hljs-comment"># Key configuration: enable formula rendering</span>
)
<span class="hljs-comment"># Enable LaTeX in the document summary area</span>
doc_summary = gr.Markdown(
    value=<span class="hljs-string">&quot;*No summary available*&quot;</span>,
    latex_delimiters=latex_config
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Explainability-Relevance-Scores-and-Confidence" class="common-anchor-header">Erklärbarkeit: Relevanz-Scores und Konfidenz</h3><p>Um eine "Blackbox"-Erfahrung zu vermeiden, zeigt das System zwei einfache Indikatoren an:</p>
<ul>
<li><p><strong>Relevanz</strong></p></li>
<li><p>Wird unter jeder Antwort im Abschnitt "Referenzen" angezeigt.</p></li>
<li><p>Zeigt den Reranker-Score für jedes zitierte Stück an.</p></li>
<li><p>Hilft dem Benutzer zu erkennen, warum eine bestimmte Seite oder Passage verwendet wurde.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># backend.py - Build reference source list</span>
sources = <span class="hljs-string">&quot;\n\n📚 **References:**\n&quot;</span>
<span class="hljs-keyword">for</span> c <span class="hljs-keyword">in</span> final:
    <span class="hljs-comment"># ... (deduplication logic) ...</span>
    <span class="hljs-comment"># Directly pass through the per-chunk score calculated by the Reranker</span>
    sources += <span class="hljs-string">f&quot;- <span class="hljs-subst">{key}</span> [Relevance:<span class="hljs-subst">{c.get(<span class="hljs-string">&#x27;composite_score&#x27;</span>,<span class="hljs-number">0</span>):<span class="hljs-number">.0</span>f}</span>%]\n&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><p><strong>Vertrauenswürdigkeit</strong></p></li>
<li><p>Wird im Bereich "Analysedetails" angezeigt.</p></li>
<li><p>Basiert auf der Bewertung des obersten Chunks (skaliert auf 100%).</p></li>
<li><p>Zeigt an, wie zuversichtlich das System bezüglich der Antwort ist.</p></li>
<li><p>Liegt der Wert unter 60 %, ist die Antwort möglicherweise weniger zuverlässig.</p></li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># backend.py - Calculate overall confidence</span>
<span class="hljs-comment"># 1. Get the top-ranked chunk after reranking</span>
final = processed[:<span class="hljs-number">22</span>]
top_score = final[<span class="hljs-number">0</span>].get(<span class="hljs-string">&#x27;composite_score&#x27;</span>, <span class="hljs-number">0</span>) <span class="hljs-keyword">if</span> final <span class="hljs-keyword">else</span> <span class="hljs-number">0</span>
<span class="hljs-comment"># 2. Normalize the score (capped at 100%) as the overall &quot;confidence&quot; for this Q&amp;A</span>
metric = <span class="hljs-string">f&quot;<span class="hljs-subst">{<span class="hljs-built_in">min</span>(<span class="hljs-number">100</span>, top_score):<span class="hljs-number">.1</span>f}</span>%&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Die Benutzeroberfläche ist unten abgebildet. In der Schnittstelle zeigt jede Antwort die Seitenzahl der Quelle und ihre Relevanzbewertung an.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_ec01986414.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_98d526ce64.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_99e9d19162.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_a82aaa6ddd.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>Die Genauigkeit von RAG ist abhängig von der Technik zwischen einem LLM und einer Vektordatenbank. Dieser Artikel führte durch einen <a href="https://github.com/LiaoYFBH/Paddle-ERNIE-RAG/blob/main/README_EN.md">Paddle-ERNIE-RAG-Aufbau</a> mit <a href="https://milvus.io"></a><a href="https://milvus.io">Milvus</a>, der jede Phase dieser Entwicklung abdeckt:</p>
<ul>
<li><strong>Dokument-Parsing.</strong> PP-StructureV3 (über <a href="https://github.com/PaddlePaddle/PaddleOCR"></a><a href="https://github.com/PaddlePaddle/PaddleOCR">PaddleOCR</a>) konvertiert PDFs in sauberes Markdown mit layoutfähiger OCR, wobei Überschriften, Tabellen und Bilder erhalten bleiben, die bei einfachen Extraktoren verloren gehen.</li>
<li><strong>Chunking.</strong> Sliding-Window-Splits mit Überlappung sorgen dafür, dass der Kontext an den Chunk-Grenzen intakt bleibt, und verhindern so die gebrochenen Fragmente, die die Wiederauffindbarkeit beeinträchtigen.</li>
<li><strong>Speichern von Vektoren in Milvus.</strong> Speichern Sie Vektoren so, dass sie schnell und präzise abgerufen werden können.</li>
<li><strong>Hybride Suche.</strong> Durch die parallele Ausführung von Vektorsuche und Schlagwortsuche und die anschließende Zusammenführung der Ergebnisse mit RRF (Reciprocal Rank Fusion) werden sowohl semantische Übereinstimmungen als auch exakte Treffer erfasst, die bei einer der beiden Methoden allein nicht gefunden würden.</li>
<li><strong>Reranking.</strong> Ein transparenter, regelbasierter Reranker bewertet jeden Chunk nach Fuzzy-Match, Keyword-Coverage, semantischer Ähnlichkeit, Länge und Erkennung des richtigen Substantivs - es sind keine Trainingsdaten erforderlich, und jede Bewertung ist debuggingfähig.</li>
<li><strong>Multimodale Fragen und Antworten.</strong> Durch die Verknüpfung von Bildern mit OCR-Seitentext in der Eingabeaufforderung erhält das Bildverarbeitungsmodell genügend Kontext, um Fragen zu Diagrammen und Schaubildern zu beantworten, mit einem Fallback nur für Text, falls die Bild-API versagt.</li>
</ul>
<p>Wenn Sie ein RAG-System für Dokumenten-Fragen und -Antworten aufbauen und eine bessere Genauigkeit wünschen, würden wir gerne erfahren, wie Sie dabei vorgehen.</p>
<p>Haben Sie Fragen zu <a href="https://milvus.io/">Milvus</a>, hybrider Suche oder dem Aufbau von Wissensdatenbanken? Treten Sie unserem <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack-Kanal</a> bei oder buchen Sie eine 20-minütige <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus-Sprechstunde</a>, um Ihren Anwendungsfall zu besprechen.</p>
