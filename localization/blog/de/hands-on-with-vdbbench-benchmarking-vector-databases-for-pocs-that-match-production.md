---
id: >-
  hands-on-with-vdbbench-benchmarking-vector-databases-for-pocs-that-match-production.md
title: >-
  Praktische Erfahrung mit VDBBench: Benchmarking von Vektordatenbanken für
  POCs, die der Produktion entsprechen
author: Yifan Cai
date: 2025-08-15T00:00:00.000Z
desc: >-
  Erfahren Sie, wie Sie mit VDBBench Vektordatenbanken mit echten
  Produktionsdaten testen können. Schritt-für-Schritt-Anleitung für
  benutzerdefinierte Datensatz-POCs, die die tatsächliche Leistung vorhersagen.
cover: assets.zilliz.com/vdbbench_cover_min_2f86466839.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: >-
  VectorDBBench, POC, vector database, VDBBench, benchmarking vector database,
  how to choose a vector database
meta_title: |
  Tutorial | How to Evaluate VectorDBs that Match Production via VDBBench
origin: >-
  https://milvus.io/blog/hands-on-with-vdbbench-benchmarking-vector-databases-for-pocs-that-match-production.md
---
<p>Vektordatenbanken sind heute ein zentraler Bestandteil der KI-Infrastruktur und treiben verschiedene LLM-gestützte Anwendungen für Kundenservice, Inhaltserstellung, Suche, Empfehlungen und mehr an.</p>
<p>Bei so vielen Optionen auf dem Markt, von speziell entwickelten Vektordatenbanken wie Milvus und Zilliz Cloud bis hin zu herkömmlichen Datenbanken mit Vektorsuche als Zusatz, <strong>ist die Wahl der richtigen nicht so einfach wie das Lesen von Benchmark-Tabellen.</strong></p>
<p>Die meisten Teams führen einen Proof of Concept (POC) durch, bevor sie sich festlegen, was in der Theorie klug ist - aber in der Praxis brechen viele Anbieter-Benchmarks, die auf dem Papier beeindruckend aussehen, unter realen Bedingungen zusammen.</p>
<p>Einer der Hauptgründe dafür ist, dass die meisten Leistungsangaben auf veralteten Datensätzen aus den Jahren 2006-2012 (SIFT, GloVe, LAION) basieren, die sich ganz anders verhalten als moderne Embeddings. So verwendet SIFT beispielsweise 128-dimensionale Vektoren, während die heutigen KI-Modelle weitaus mehr Dimensionen aufweisen - 3.072 für das neueste Modell von OpenAI, 1.024 für das von Cohere - eine große Veränderung, die sich auf Leistung, Kosten und Skalierbarkeit auswirkt.</p>
<h2 id="The-Fix-Test-with-Your-Data-Not-Canned-Benchmarks" class="common-anchor-header">Die Lösung: Testen Sie mit Ihren Daten, nicht mit vorgefertigten Benchmarks<button data-href="#The-Fix-Test-with-Your-Data-Not-Canned-Benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>Die einfachste und effektivste Lösung: Führen Sie Ihre POC-Evaluierung mit den Vektoren durch, die Ihre Anwendung tatsächlich erzeugt. Das heißt, Sie verwenden Ihre Einbettungsmodelle, Ihre echten Abfragen und Ihre tatsächliche Datenverteilung.</p>
<p>Genau dafür ist <a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md"><strong>VDBBench</strong></a> - ein Open-Source-Benchmarking-Tool für Vektordatenbanken - konzipiert. Es unterstützt die Evaluierung und den Vergleich beliebiger Vektordatenbanken, einschließlich Milvus, Elasticsearch, pgvector und anderer, und simuliert reale Produktionsarbeitslasten.</p>
<p><a href="https://github.com/zilliztech/VectorDBBench">VDBBench 1.0 herunterladen →</a> |<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch&amp;__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1755165753372.1755169827021.775&amp;__hssc=175614333.3.1755169827021&amp;__hsfp=1940526538"> Leaderboard anzeigen →</a> | <a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md">Was ist VDBBench</a></p>
<p>Mit VDBbench können Sie:</p>
<ul>
<li><p><strong>Testen mit Ihren eigenen Daten</strong> aus Ihren Einbettungsmodellen</p></li>
<li><p>Simulieren Sie <strong>gleichzeitige Einfügungen, Abfragen und Streaming-Ingestion</strong></p></li>
<li><p>Messung von <strong>P95/P99-Latenz, anhaltendem Durchsatz und Abrufgenauigkeit</strong></p></li>
<li><p>Benchmarking über mehrere Datenbanken hinweg unter identischen Bedingungen</p></li>
<li><p>Ermöglicht das <strong>Testen benutzerdefinierter Datensätze</strong>, sodass die Ergebnisse tatsächlich der Produktion entsprechen</p></li>
</ul>
<p>Als Nächstes zeigen wir Ihnen, wie Sie mit VDBBench und Ihren echten Daten einen produktiven POC durchführen können, damit Sie eine sichere, zukunftsfähige Entscheidung treffen können.</p>
<h2 id="How-to-Evaluate-VectorDBs-with-Your-Custom-Datasets-with-VDBBench" class="common-anchor-header">Evaluierung von VectorDBs mit Ihren eigenen Datensätzen mit VDBBench<button data-href="#How-to-Evaluate-VectorDBs-with-Your-Custom-Datasets-with-VDBBench" class="anchor-icon" translate="no">
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
    </button></h2><p>Bevor Sie beginnen, stellen Sie sicher, dass Sie Python 3.11 oder höher installiert haben. Sie benötigen Vektordaten im CSV- oder NPY-Format, ca. 2-3 Stunden Zeit für die vollständige Einrichtung und den Test sowie fortgeschrittene Python-Kenntnisse für eine eventuelle Fehlerbehebung.</p>
<h3 id="Installation-and-Configuration" class="common-anchor-header">Installation und Konfiguration</h3><p>Wenn Sie nur eine Datenbank auswerten wollen, führen Sie diesen Befehl aus:</p>
<pre><code translate="no">pip install vectordb-bench
<button class="copy-code-btn"></button></code></pre>
<p>Wenn Sie alle unterstützten Datenbanken vergleichen wollen, führen Sie den Befehl aus:</p>
<pre><code translate="no">pip install vectordb-bench[<span class="hljs-built_in">all</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Für bestimmte Datenbank-Clients (z. B. Elasticsearch):</p>
<pre><code translate="no">pip install vectordb-bench[elastic]
<button class="copy-code-btn"></button></code></pre>
<p>Auf dieser <a href="https://github.com/zilliztech/VectorDBBench">GitHub-Seite</a> finden Sie alle unterstützten Datenbanken und ihre Installationsbefehle.</p>
<h3 id="Launching-VDBBench" class="common-anchor-header">Starten von VDBBench</h3><p>Starten Sie <strong>VDBBench</strong> mit:</p>
<pre><code translate="no">init_bench
<button class="copy-code-btn"></button></code></pre>
<p>Erwartete Konsolenausgabe: 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_expected_console_output_66e1a218b7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Die Weboberfläche wird lokal verfügbar sein:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_2e4dd7ea69.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Data-Preparation-and-Format-Conversion" class="common-anchor-header">Datenaufbereitung und Formatkonvertierung</h3><p>VDBBench benötigt strukturierte Parquet-Dateien mit spezifischen Schemata, um konsistente Tests über verschiedene Datenbanken und Datensätze hinweg zu gewährleisten.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Datei Name</strong></th><th style="text-align:center"><strong>Zweck</strong></th><th style="text-align:center"><strong>Erforderlich</strong></th><th style="text-align:center"><strong>Inhalt Beispiel</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">train.parquet</td><td style="text-align:center">Vektorsammlung für das Einfügen in die Datenbank</td><td style="text-align:center">✅</td><td style="text-align:center">Vektor-ID + Vektordaten (Liste[float])</td></tr>
<tr><td style="text-align:center">test.parquet</td><td style="text-align:center">Vektorsammlung für Abfragen</td><td style="text-align:center">✅</td><td style="text-align:center">Vektor-ID + Vektordaten (Liste[Float])</td></tr>
<tr><td style="text-align:center">nachbarn.parquet</td><td style="text-align:center">Ground Truth für Abfragevektoren (aktuelle Liste der nächstgelegenen Nachbarn ID)</td><td style="text-align:center">✅</td><td style="text-align:center">query_id -&gt; [top_k ähnliche ID-Liste]</td></tr>
<tr><td style="text-align:center">scalar_labels.parquet</td><td style="text-align:center">Labels (Metadaten, die andere Einheiten als Vektoren beschreiben)</td><td style="text-align:center">❌</td><td style="text-align:center">id -&gt; label</td></tr>
</tbody>
</table>
<p>Erforderliche Dateispezifikationen:</p>
<ul>
<li><p><strong>Die Trainingsvektordatei (train.parquet)</strong> muss eine ID-Spalte mit inkrementellen Ganzzahlen und eine Vektorspalte mit float32-Arrays enthalten. Die Spaltennamen sind konfigurierbar, aber die ID-Spalte muss Integer-Typen für eine korrekte Indizierung verwenden.</p></li>
<li><p>Die<strong>Testvektordatei (test.parquet)</strong> hat die gleiche Struktur wie die Trainingsdaten. Der Name der ID-Spalte muss "id" lauten, während die Namen der Vektorspalten an Ihr Datenschema angepasst werden können.</p></li>
<li><p><strong>Ground Truth File (neighbors.parquet)</strong> enthält die Referenz der nächstgelegenen Nachbarn für jede Testabfrage. Sie benötigt eine ID-Spalte, die den Testvektor-IDs entspricht, und eine neighbors-Array-Spalte, die die korrekten IDs der nächsten Nachbarn aus dem Trainingssatz enthält.</p></li>
<li><p><strong>Die Datei mit den Skalar-Labels (scalar_labels.parquet)</strong> ist optional und enthält Metadaten-Labels, die mit den Trainingsvektoren assoziiert sind und für gefilterte Suchtests nützlich sind.</p></li>
</ul>
<h3 id="Data-Format-Challenges" class="common-anchor-header">Herausforderungen an das Datenformat</h3><p>Die meisten Produktionsvektordaten liegen in Formaten vor, die nicht direkt den Anforderungen der VDBBench entsprechen. CSV-Dateien speichern Einbettungen typischerweise als String-Repräsentationen von Arrays, NPY-Dateien enthalten rohe numerische Matrizen ohne Metadaten, und Datenbankexporte verwenden oft JSON oder andere strukturierte Formate.</p>
<p>Die manuelle Konvertierung dieser Formate umfasst mehrere komplexe Schritte: das Parsen von String-Darstellungen in numerische Arrays, die Berechnung exakter nächstgelegener Nachbarn mithilfe von Bibliotheken wie FAISS, die korrekte Aufteilung von Datensätzen unter Wahrung der ID-Konsistenz und die Sicherstellung, dass alle Datentypen den Parquet-Spezifikationen entsprechen.</p>
<h3 id="Automated-Format-Conversion" class="common-anchor-header">Automatisierte Formatkonvertierung</h3><p>Um den Konvertierungsprozess zu optimieren, haben wir ein Python-Skript entwickelt, das die Formatkonvertierung, die Berechnung der Grundwahrheit und die richtige Datenstrukturierung automatisch durchführt.</p>
<p><strong>CSV-Eingabeformat:</strong></p>
<pre><code translate="no"><span class="hljs-built_in">id</span>,emb,label
<span class="hljs-number">1</span>,<span class="hljs-string">&quot;[0.12,0.56,0.89,...]&quot;</span>,A
<span class="hljs-number">2</span>,<span class="hljs-string">&quot;[0.33,0.48,0.90,...]&quot;</span>,B
<button class="copy-code-btn"></button></code></pre>
<p><strong>NPY-Eingabeformat:</strong></p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
vectors = np.<span class="hljs-property">random</span>.<span class="hljs-title function_">rand</span>(<span class="hljs-number">10000</span>, <span class="hljs-number">768</span>).<span class="hljs-title function_">astype</span>(<span class="hljs-string">&#x27;float32&#x27;</span>)
np.<span class="hljs-title function_">save</span>(<span class="hljs-string">&quot;vectors.npy&quot;</span>, vectors)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Conversion-Script-Implementation" class="common-anchor-header">Konvertierung Skript-Implementierung</h3><p><strong>Installation der erforderlichen Abhängigkeiten:</strong></p>
<pre><code translate="no">pip install numpy pandas faiss-cpu
<button class="copy-code-btn"></button></code></pre>
<p><strong>Führen Sie die Konvertierung aus:</strong></p>
<pre><code translate="no">python convert_to_vdb_format.py \
  --train data/train.csv \
  --<span class="hljs-built_in">test</span> data/test.csv \
  --out datasets/custom \
  --topk 10
<button class="copy-code-btn"></button></code></pre>
<p><strong>Parameter-Referenz:</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Name des Parameters</strong></th><th style="text-align:center"><strong>Erforderlich</strong></th><th style="text-align:center"><strong>Typ</strong></th><th style="text-align:center"><strong>Beschreibung</strong></th><th style="text-align:center"><strong>Standardwert</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><code translate="no">--train</code></td><td style="text-align:center">Ja</td><td style="text-align:center">Zeichenfolge</td><td style="text-align:center">Trainingsdatenpfad, unterstützt CSV- oder NPY-Format. CSV muss die Spalte emb enthalten, andernfalls wird die Spalte id automatisch generiert.</td><td style="text-align:center">Keine</td></tr>
<tr><td style="text-align:center"><code translate="no">--test</code></td><td style="text-align:center">Ja</td><td style="text-align:center">Zeichenfolge</td><td style="text-align:center">Pfad für Abfragedaten, unterstützt CSV- oder NPY-Format. Format wie bei den Trainingsdaten</td><td style="text-align:center">Keine</td></tr>
<tr><td style="text-align:center"><code translate="no">--out</code></td><td style="text-align:center">Ja</td><td style="text-align:center">Zeichenfolge</td><td style="text-align:center">Ausgabeverzeichnispfad, speichert konvertierte Parkettdateien und Nachbarindexdateien</td><td style="text-align:center">Keine</td></tr>
<tr><td style="text-align:center"><code translate="no">--labels</code></td><td style="text-align:center">Nein</td><td style="text-align:center">Zeichenfolge</td><td style="text-align:center">Label-CSV-Pfad, muss die Spalte labels enthalten (als String-Array formatiert), wird zum Speichern von Labels verwendet</td><td style="text-align:center">Keine</td></tr>
<tr><td style="text-align:center"><code translate="no">--topk</code></td><td style="text-align:center">Nein</td><td style="text-align:center">Ganzzahl</td><td style="text-align:center">Anzahl der nächstgelegenen Nachbarn, die bei der Berechnung zurückgegeben werden</td><td style="text-align:center">10</td></tr>
</tbody>
</table>
<p><strong>Struktur des Ausgabeverzeichnisses:</strong></p>
<pre><code translate="no">datasets/custom/
├── train.parquet        <span class="hljs-comment"># Training vectors</span>
├── test.parquet         <span class="hljs-comment"># Query vectors  </span>
├── neighbors.parquet    <span class="hljs-comment"># Ground Truth</span>
└── scalar_labels.parquet <span class="hljs-comment"># Optional scalar labels</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Complete-Conversion-Script" class="common-anchor-header">Vollständiges Konvertierungsskript</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> argparse
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> pandas <span class="hljs-keyword">as</span> pd
<span class="hljs-keyword">import</span> faiss
<span class="hljs-keyword">from</span> ast <span class="hljs-keyword">import</span> literal_eval
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">Optional</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_csv</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>):
    df = pd.read_csv(path)
    <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;emb&#x27;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> df.columns:
        <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">f&quot;CSV file missing &#x27;emb&#x27; column: <span class="hljs-subst">{path}</span>&quot;</span>)
   df[<span class="hljs-string">&#x27;emb&#x27;</span>] = df[<span class="hljs-string">&#x27;emb&#x27;</span>].apply(literal_eval)
    <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;id&#x27;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> df.columns:
        df.insert(<span class="hljs-number">0</span>, <span class="hljs-string">&#x27;id&#x27;</span>, <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(df)))
    <span class="hljs-keyword">return</span> df
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_npy</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>):
    arr = np.load(path)
    df = pd.DataFrame({
        <span class="hljs-string">&#x27;id&#x27;</span>: <span class="hljs-built_in">range</span>(arr.shape[<span class="hljs-number">0</span>]),
        <span class="hljs-string">&#x27;emb&#x27;</span>: arr.tolist()
    })
    <span class="hljs-keyword">return</span> df
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_vectors</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>) -&gt; pd.DataFrame:
    <span class="hljs-keyword">if</span> path.endswith(<span class="hljs-string">&#x27;.csv&#x27;</span>):
        <span class="hljs-keyword">return</span> load_csv(path)
    <span class="hljs-keyword">elif</span> path.endswith(<span class="hljs-string">&#x27;.npy&#x27;</span>):
        <span class="hljs-keyword">return</span> load_npy(path)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">f&quot;Unsupported file format: <span class="hljs-subst">{path}</span>&quot;</span>)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">compute_ground_truth</span>(<span class="hljs-params">train_vectors: np.ndarray, test_vectors: np.ndarray, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">10</span></span>):
    dim = train_vectors.shape[<span class="hljs-number">1</span>]
    index = faiss.IndexFlatL2(dim)
    index.add(train_vectors)
    _, indices = index.search(test_vectors, top_k)
    <span class="hljs-keyword">return</span> indices
<span class="hljs-keyword">def</span> <span class="hljs-title function_">save_ground_truth</span>(<span class="hljs-params">df_path: <span class="hljs-built_in">str</span>, indices: np.ndarray</span>):
    df = pd.DataFrame({
        <span class="hljs-string">&quot;id&quot;</span>: np.arange(indices.shape[<span class="hljs-number">0</span>]),
        <span class="hljs-string">&quot;neighbors_id&quot;</span>: indices.tolist()
    })
    df.to_parquet(df_path, index=<span class="hljs-literal">False</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✅ Ground truth saved successfully: <span class="hljs-subst">{df_path}</span>&quot;</span>)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>(<span class="hljs-params">train_path: <span class="hljs-built_in">str</span>, test_path: <span class="hljs-built_in">str</span>, output_dir: <span class="hljs-built_in">str</span>,
         label_path: <span class="hljs-type">Optional</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">10</span></span>):
    os.makedirs(output_dir, exist_ok=<span class="hljs-literal">True</span>)
    <span class="hljs-comment"># Load training and query data</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📥 Loading training data...&quot;</span>)
    train_df = load_vectors(train_path)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📥 Loading query data...&quot;</span>)
    test_df = load_vectors(test_path)
    <span class="hljs-comment"># Extract vectors and convert to numpy</span>
    train_vectors = np.array(train_df[<span class="hljs-string">&#x27;emb&#x27;</span>].to_list(), dtype=<span class="hljs-string">&#x27;float32&#x27;</span>)
    test_vectors = np.array(test_df[<span class="hljs-string">&#x27;emb&#x27;</span>].to_list(), dtype=<span class="hljs-string">&#x27;float32&#x27;</span>)
    <span class="hljs-comment"># Save parquet files retaining all fields</span>
    train_df.to_parquet(os.path.join(output_dir, <span class="hljs-string">&#x27;train.parquet&#x27;</span>), index=<span class="hljs-literal">False</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✅ train.parquet saved successfully, <span class="hljs-subst">{<span class="hljs-built_in">len</span>(train_df)}</span> records total&quot;</span>)
    test_df.to_parquet(os.path.join(output_dir, <span class="hljs-string">&#x27;test.parquet&#x27;</span>), index=<span class="hljs-literal">False</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;✅ test.parquet saved successfully, <span class="hljs-subst">{<span class="hljs-built_in">len</span>(test_df)}</span> records total&quot;</span>)
    <span class="hljs-comment"># Compute ground truth</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;🔍 Computing Ground Truth (nearest neighbors)...&quot;</span>)
    gt_indices = compute_ground_truth(train_vectors, test_vectors, top_k=top_k)
    save_ground_truth(os.path.join(output_dir, <span class="hljs-string">&#x27;neighbors.parquet&#x27;</span>), gt_indices)
    <span class="hljs-comment"># Load and save label file (if provided)</span>
    <span class="hljs-keyword">if</span> label_path:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📥 Loading label file...&quot;</span>)
        label_df = pd.read_csv(label_path)
        <span class="hljs-keyword">if</span> <span class="hljs-string">&#x27;labels&#x27;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> label_df.columns:
            <span class="hljs-keyword">raise</span> ValueError(<span class="hljs-string">&quot;Label file must contain &#x27;labels&#x27; column&quot;</span>)
        label_df[<span class="hljs-string">&#x27;labels&#x27;</span>] = label_df[<span class="hljs-string">&#x27;labels&#x27;</span>].apply(literal_eval)
        label_df.to_parquet(os.path.join(output_dir, <span class="hljs-string">&#x27;scalar_labels.parquet&#x27;</span>), index=<span class="hljs-literal">False</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;✅ Label file saved as scalar_labels.parquet&quot;</span>)

<span class="hljs-keyword">if</span> 
name
 == <span class="hljs-string">&quot;__main__&quot;</span>:
    parser = argparse.ArgumentParser(description=<span class="hljs-string">&quot;Convert CSV/NPY vectors to VectorDBBench data format (retaining all columns)&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--train&quot;</span>, required=<span class="hljs-literal">True</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Training data path (CSV or NPY)&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--test&quot;</span>, required=<span class="hljs-literal">True</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Query data path (CSV or NPY)&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--out&quot;</span>, required=<span class="hljs-literal">True</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Output directory&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--labels&quot;</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Label CSV path (optional)&quot;</span>)
    parser.add_argument(<span class="hljs-string">&quot;--topk&quot;</span>, <span class="hljs-built_in">type</span>=<span class="hljs-built_in">int</span>, default=<span class="hljs-number">10</span>, <span class="hljs-built_in">help</span>=<span class="hljs-string">&quot;Ground truth&quot;</span>)
    args = parser.parse_args()
    main(args.train, args.test, args.out, args.labels, args.topk)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Ausgabe des Konvertierungsprozesses:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_conversion_process_output_0827ba75c9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Generierte Dateien Verifizierung:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_f02cd2964e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Custom-Dataset-Configuration" class="common-anchor-header">Konfiguration des benutzerdefinierten Datensatzes</h3><p>Navigieren Sie zum Abschnitt Konfiguration des benutzerdefinierten Datensatzes in der Weboberfläche:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_aa14b75b5d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Die Konfigurationsschnittstelle bietet Felder für Metadaten des Datensatzes und die Angabe des Dateipfads:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_1b64832990.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Konfigurationsparameter:</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Parameter Name</strong></th><th style="text-align:center"><strong>Bedeutung</strong></th><th style="text-align:center"><strong>Konfiguration Vorschläge</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Name</td><td style="text-align:center">Name des Datensatzes (eindeutiger Bezeichner)</td><td style="text-align:center">Beliebiger Name, z.B, <code translate="no">my_custom_dataset</code></td></tr>
<tr><td style="text-align:center">Ordner Pfad</td><td style="text-align:center">Verzeichnispfad der Datensatzdatei</td><td style="text-align:center">z. B., <code translate="no">/data/datasets/custom</code></td></tr>
<tr><td style="text-align:center">dim</td><td style="text-align:center">Abmessungen des Vektors</td><td style="text-align:center">Muss mit den Datendateien übereinstimmen, z. B. 768</td></tr>
<tr><td style="text-align:center">Größe</td><td style="text-align:center">Anzahl der Vektoren (optional)</td><td style="text-align:center">Kann leer gelassen werden, das System erkennt automatisch</td></tr>
<tr><td style="text-align:center">metrischer Typ</td><td style="text-align:center">Methode der Ähnlichkeitsmessung</td><td style="text-align:center">Üblicherweise wird L2 (euklidischer Abstand) oder IP (inneres Produkt) verwendet.</td></tr>
<tr><td style="text-align:center">train file name</td><td style="text-align:center">Dateiname des Trainingssets (ohne .parquet-Erweiterung)</td><td style="text-align:center">Falls <code translate="no">train.parquet</code>, geben Sie <code translate="no">train</code> ein. Mehrere Dateien durch Komma trennen, z.B, <code translate="no">train1,train2</code></td></tr>
<tr><td style="text-align:center">Name der Testdatei</td><td style="text-align:center">Dateiname des Abfragesatzes (ohne die Erweiterung .parquet)</td><td style="text-align:center">Falls <code translate="no">test.parquet</code>, füllen Sie <code translate="no">test</code></td></tr>
<tr><td style="text-align:center">Ground Truth Dateiname</td><td style="text-align:center">Ground Truth Dateiname (ohne .parquet-Erweiterung)</td><td style="text-align:center">Falls <code translate="no">neighbors.parquet</code>, füllen Sie <code translate="no">neighbors</code></td></tr>
<tr><td style="text-align:center">train id name</td><td style="text-align:center">Name der Trainingsdaten-ID-Spalte</td><td style="text-align:center">Normalerweise <code translate="no">id</code></td></tr>
<tr><td style="text-align:center">train emb name</td><td style="text-align:center">Name der Trainingsdatenvektor-Spalte</td><td style="text-align:center">Wenn der vom Skript generierte Spaltenname <code translate="no">emb</code> lautet, füllen Sie <code translate="no">emb</code></td></tr>
<tr><td style="text-align:center">test emb name</td><td style="text-align:center">Spaltenname des Testdatenvektors</td><td style="text-align:center">Normalerweise gleich wie train emb name, z.B., <code translate="no">emb</code></td></tr>
<tr><td style="text-align:center">ground truth emb name</td><td style="text-align:center">Name der Spalte "Nächster Nachbar" in Ground Truth</td><td style="text-align:center">Wenn der Spaltenname <code translate="no">neighbors_id</code> lautet, füllen Sie <code translate="no">neighbors_id</code></td></tr>
<tr><td style="text-align:center">scalar labels Dateiname</td><td style="text-align:center">(Optional) Dateiname der Labels (ohne .parquet-Erweiterung)</td><td style="text-align:center">Wenn <code translate="no">scalar_labels.parquet</code> generiert wurde, füllen Sie <code translate="no">scalar_labels</code> aus, andernfalls lassen Sie die Datei leer.</td></tr>
<tr><td style="text-align:center">Label-Prozentsätze</td><td style="text-align:center">(Optional) Filterverhältnis der Etiketten</td><td style="text-align:center">z. B. <code translate="no">0.001</code>,<code translate="no">0.02</code>,<code translate="no">0.5</code>, leer lassen, wenn keine Etikettenfilterung erforderlich ist</td></tr>
<tr><td style="text-align:center">Beschreibung</td><td style="text-align:center">Beschreibung des Datensatzes</td><td style="text-align:center">Kann keinen Geschäftskontext oder eine Erzeugungsmethode angeben</td></tr>
</tbody>
</table>
<p>Speichern Sie die Konfiguration, um mit der Testeinrichtung fortzufahren.</p>
<h3 id="Test-Execution-and-Database-Configuration" class="common-anchor-header">Testdurchführung und Datenbankkonfiguration</h3><p>Rufen Sie die Schnittstelle zur Testkonfiguration auf:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_3ecdcb1034.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Datenbankauswahl und -konfiguration (Milvus als Beispiel):</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_356a2d8c39.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Dataset-Zuordnung:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/9_dataset_assignment_85ba7b24ca.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Test Metadaten und Beschriftung:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/10_test_metadata_and_labeling_293f6f2b99.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Testdurchführung:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_test_execution_76acb42c98.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Results-Analysis-and-Performance-Evaluation" class="common-anchor-header">Ergebnisanalyse und Leistungsbewertung<button data-href="#Results-Analysis-and-Performance-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>Die Ergebnisschnittstelle bietet umfassende Leistungsanalysen:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_993c536c20.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Test-Configuration-Summary" class="common-anchor-header">Zusammenfassung der Testkonfiguration</h3><p>Bei der Evaluierung wurden Gleichzeitigkeitsgrade von 1, 5 und 10 gleichzeitigen Operationen (eingeschränkt durch die verfügbaren Hardwareressourcen), Vektorabmessungen von 768, eine Datensatzgröße von 3.000 Trainingsvektoren und 3.000 Testabfragen getestet, wobei die skalare Filterung von Bezeichnungen für diesen Testlauf deaktiviert wurde.</p>
<h3 id="Critical-Implementation-Considerations" class="common-anchor-header">Kritische Überlegungen zur Implementierung</h3><ul>
<li><p><strong>Dimensionale Konsistenz:</strong> Wenn die Vektordimensionen zwischen Trainings- und Testdatensätzen nicht übereinstimmen, führt dies zu sofortigen Testfehlern. Überprüfen Sie die dimensionale Ausrichtung während der Datenvorbereitung, um Laufzeitfehler zu vermeiden.</p></li>
<li><p><strong>Genauigkeit der Grundwahrheit:</strong> Falsche Berechnungen der Grundwahrheit machen die Messungen der Wiedererkennungsrate ungültig. Das mitgelieferte Konvertierungsskript verwendet FAISS mit L2-Distanz für die exakte Berechnung der nächsten Nachbarn und gewährleistet so genaue Referenzergebnisse.</p></li>
<li><p><strong>Anforderungen an die Datensatzgröße:</strong> Kleine Datensätze (unter 10.000 Vektoren) können aufgrund einer unzureichenden Lastgenerierung zu inkonsistenten QPS-Messungen führen. Ziehen Sie eine Skalierung der Datensatzgröße in Betracht, um zuverlässigere Durchsatztests durchzuführen.</p></li>
<li><p><strong>Ressourcenzuweisung:</strong> Speicher- und CPU-Beschränkungen für Docker-Container können die Datenbankleistung während der Tests künstlich einschränken. Überwachen Sie die Ressourcenauslastung und passen Sie die Containergrenzen bei Bedarf an, um eine genaue Leistungsmessung zu ermöglichen.</p></li>
<li><p><strong>Fehlerüberwachung:</strong> <strong>VDBBench</strong> kann Fehler in der Konsolenausgabe protokollieren, die nicht in der Weboberfläche angezeigt werden. Überwachen Sie die Terminalprotokolle während der Testausführung, um vollständige Diagnoseinformationen zu erhalten.</p></li>
</ul>
<h2 id="Supplemental-Tools-Test-Data-Generation" class="common-anchor-header">Ergänzende Tools: Erzeugung von Testdaten<button data-href="#Supplemental-Tools-Test-Data-Generation" class="anchor-icon" translate="no">
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
    </button></h2><p>Für Entwicklungs- und standardisierte Testszenarien können Sie synthetische Datensätze mit kontrollierten Merkmalen erzeugen:</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> pandas <span class="hljs-keyword">as</span> pd
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">def</span> <span class="hljs-title function_">generate_csv</span>(<span class="hljs-params">num_records: <span class="hljs-built_in">int</span>, dim: <span class="hljs-built_in">int</span>, filename: <span class="hljs-built_in">str</span></span>):
    ids = <span class="hljs-built_in">range</span>(num_records)
    vectors = np.random.rand(num_records, dim).<span class="hljs-built_in">round</span>(<span class="hljs-number">6</span>) 
    emb_str = [<span class="hljs-built_in">str</span>(<span class="hljs-built_in">list</span>(vec)) <span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> vectors]
    df = pd.DataFrame({
        <span class="hljs-string">&#x27;id&#x27;</span>: ids,
        <span class="hljs-string">&#x27;emb&#x27;</span>: emb_str
    })
    df.to_csv(filename, index=<span class="hljs-literal">False</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Generated file <span class="hljs-subst">{filename}</span>, <span class="hljs-subst">{num_records}</span> records total, vector dimension <span class="hljs-subst">{dim}</span>&quot;</span>)
<span class="hljs-keyword">if</span>
name
 == <span class="hljs-string">&quot;__main__&quot;</span>:
    num_records = <span class="hljs-number">3000</span>  <span class="hljs-comment"># Number of records to generate</span>
    dim = <span class="hljs-number">768</span>  <span class="hljs-comment"># Vector dimension</span>

    generate_csv(num_records, dim, <span class="hljs-string">&quot;train.csv&quot;</span>)
    generate_csv(num_records, dim, <span class="hljs-string">&quot;test.csv&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Dieses Dienstprogramm generiert Datensätze mit bestimmten Abmessungen und Datensatzzahlen für Prototyping- und Basistestszenarien.</p>
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
    </button></h2><p>Sie haben soeben gelernt, wie Sie sich aus dem "Benchmark-Theater" befreien können, das unzählige Entscheidungen über Vektordatenbanken in die Irre geführt hat. Mit VDBBench und Ihrem eigenen Datensatz können Sie produktionsreife QPS-, Latenz- und Recall-Metriken generieren - kein Rätselraten mehr anhand jahrzehntealter akademischer Daten.</p>
<p>Verlassen Sie sich nicht länger auf vorgefertigte Benchmarks, die nichts mit Ihren realen Workloads zu tun haben. In nur wenigen Stunden - und nicht Wochen - sehen Sie genau, wie eine Datenbank mit <em>Ihren</em> Vektoren, Abfragen und Einschränkungen funktioniert. Das bedeutet, dass Sie Ihre Entscheidung mit Zuversicht treffen können, spätere schmerzhafte Umschreibungen vermeiden und Systeme bereitstellen können, die in der Produktion tatsächlich funktionieren.</p>
<ul>
<li><p>Testen Sie VDBBench mit Ihren Workloads: <a href="https://github.com/zilliztech/VectorDBBench">https://github.com/zilliztech/VectorDBBench</a></p></li>
<li><p>Sehen Sie sich die Testergebnisse der wichtigsten Vektordatenbanken an: <a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch&amp;__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1755165753372.1755169827021.775&amp;__hssc=175614333.3.1755169827021&amp;__hsfp=1940526538">VDBBench-Rangliste</a></p></li>
</ul>
<p>Haben Sie Fragen oder möchten Sie Ihre Ergebnisse mitteilen? Beteiligen Sie sich an der Diskussion auf<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a> oder verbinden Sie sich mit unserer Community auf <a href="https://discord.com/invite/FG6hMJStWu">Discord</a>.</p>
<hr>
<p><em>Dies ist der erste Beitrag in unserer VectorDB POC Guide-Serie mit praktischen, von Entwicklern getesteten Methoden zum Aufbau einer KI-Infrastruktur, die unter realen Bedingungen funktioniert. Bleiben Sie dran für mehr!</em></p>
