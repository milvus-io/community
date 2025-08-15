---
id: >-
  hands-on-with-vdbbench-benchmarking-vector-databases-for-pocs-that-match-production.md
title: >-
  Esperienza diretta con VDBBench: Benchmarking dei database vettoriali per POC
  che corrispondono alla produzione
author: Yifan Cai
date: 2025-08-15T00:00:00.000Z
desc: >-
  Imparate a testare i database vettoriali con dati di produzione reali
  utilizzando VDBBench. Guida passo-passo ai POC su set di dati personalizzati
  che predicono le prestazioni effettive.
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
<p>I database vettoriali sono ormai parte integrante dell'infrastruttura di intelligenza artificiale e alimentano diverse applicazioni basate su LLM per il servizio clienti, la generazione di contenuti, la ricerca, le raccomandazioni e altro ancora.</p>
<p>Con così tante opzioni sul mercato, dai database vettoriali appositamente costruiti come Milvus e Zilliz Cloud ai database tradizionali con ricerca vettoriale come componente aggiuntiva, <strong>scegliere quello giusto non è semplice come leggere le tabelle di benchmark.</strong></p>
<p>La maggior parte dei team esegue una prova di concetto (POC) prima di impegnarsi, il che è intelligente in teoria, ma in pratica molti benchmark dei fornitori che sembrano impressionanti sulla carta crollano in condizioni reali.</p>
<p>Uno dei motivi principali è che la maggior parte delle prestazioni dichiarate si basa su dataset obsoleti del 2006-2012 (SIFT, GloVe, LAION) che si comportano in modo molto diverso dalle moderne incorporazioni. Ad esempio, SIFT utilizza vettori a 128 dimensioni, mentre i modelli di intelligenza artificiale di oggi producono dimensioni molto più elevate (3.072 per l'ultimo di OpenAI, 1.024 per quello di Cohere), un cambiamento importante che influisce su prestazioni, costi e scalabilità.</p>
<h2 id="The-Fix-Test-with-Your-Data-Not-Canned-Benchmarks" class="common-anchor-header">La soluzione: test con i vostri dati, non con i benchmark predefiniti<button data-href="#The-Fix-Test-with-Your-Data-Not-Canned-Benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>La soluzione più semplice ed efficace: eseguire la valutazione POC con i vettori effettivamente generati dall'applicazione. Ciò significa utilizzare i vostri modelli di incorporazione, le vostre query reali e la vostra effettiva distribuzione dei dati.</p>
<p><a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md"><strong>VDBBench</strong></a>, uno strumento di benchmarking per database vettoriali open-source, è stato creato proprio per questo. Supporta la valutazione e il confronto di qualsiasi database vettoriale, compresi Milvus, Elasticsearch, pgvector e altri, e simula carichi di lavoro reali di produzione.</p>
<p><a href="https://github.com/zilliztech/VectorDBBench">Scarica VDBBench 1.0 →</a> |<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch&amp;__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1755165753372.1755169827021.775&amp;__hssc=175614333.3.1755169827021&amp;__hsfp=1940526538"> Visualizza classifica →</a> | <a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md">Cos'è VDBBench</a></p>
<p>VDBbench consente di:</p>
<ul>
<li><p>Effettuare<strong>test con i propri dati</strong> dai propri modelli di embedding</p></li>
<li><p>Simulare <strong>inserti, query e ingestioni di streaming in simultanea</strong></p></li>
<li><p>Misurare la <strong>latenza P95/P99, il throughput sostenuto e l'accuratezza del recall</strong></p></li>
<li><p>Esecuzione di benchmark su più database in condizioni identiche</p></li>
<li><p>Consente di <strong>testare set di dati personalizzati</strong> in modo che i risultati corrispondano effettivamente alla produzione.</p></li>
</ul>
<p>A seguire vi illustreremo come eseguire un POC di livello produttivo con VDBBench e i vostri dati reali, in modo che possiate fare una scelta sicura e a prova di futuro.</p>
<h2 id="How-to-Evaluate-VectorDBs-with-Your-Custom-Datasets-with-VDBBench" class="common-anchor-header">Come valutare VectorDB con i vostri set di dati personalizzati con VDBBench<button data-href="#How-to-Evaluate-VectorDBs-with-Your-Custom-Datasets-with-VDBBench" class="anchor-icon" translate="no">
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
    </button></h2><p>Prima di iniziare, assicuratevi di avere installato Python 3.11 o superiore. Avrete bisogno di dati vettoriali in formato CSV o NPY, di circa 2-3 ore per la configurazione completa e il test e di conoscenze intermedie di Python per la risoluzione dei problemi, se necessario.</p>
<h3 id="Installation-and-Configuration" class="common-anchor-header">Installazione e configurazione</h3><p>Se si sta valutando un solo database, eseguire questo comando:</p>
<pre><code translate="no">pip install vectordb-bench
<button class="copy-code-btn"></button></code></pre>
<p>Se si vogliono confrontare tutti i database supportati, eseguire il comando:</p>
<pre><code translate="no">pip install vectordb-bench[<span class="hljs-built_in">all</span>]
<button class="copy-code-btn"></button></code></pre>
<p>Per client di database specifici (es. Elasticsearch):</p>
<pre><code translate="no">pip install vectordb-bench[elastic]
<button class="copy-code-btn"></button></code></pre>
<p>Controllate questa <a href="https://github.com/zilliztech/VectorDBBench">pagina GitHub</a> per tutti i database supportati e i relativi comandi di installazione.</p>
<h3 id="Launching-VDBBench" class="common-anchor-header">Avvio di VDBBench</h3><p>Avviare <strong>VDBBench</strong> con:</p>
<pre><code translate="no">init_bench
<button class="copy-code-btn"></button></code></pre>
<p>Output di console previsto: 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_expected_console_output_66e1a218b7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>L'interfaccia web sarà disponibile localmente:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_2e4dd7ea69.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Data-Preparation-and-Format-Conversion" class="common-anchor-header">Preparazione dei dati e conversione del formato</h3><p>VDBBench richiede file Parquet strutturati con schemi specifici per garantire test coerenti tra diversi database e set di dati.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Nome del file</strong></th><th style="text-align:center"><strong>Scopo</strong></th><th style="text-align:center"><strong>Richiesto</strong></th><th style="text-align:center"><strong>Contenuto Esempio</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">train.parquet</td><td style="text-align:center">Raccolta di vettori per l'inserimento nel database</td><td style="text-align:center">✅</td><td style="text-align:center">ID vettore + dati del vettore (lista[float])</td></tr>
<tr><td style="text-align:center">parquet.test</td><td style="text-align:center">Raccolta di vettori per le interrogazioni</td><td style="text-align:center">✅</td><td style="text-align:center">ID vettore + dati del vettore (elenco[float])</td></tr>
<tr><td style="text-align:center">vicini.parquet</td><td style="text-align:center">Ground Truth per i vettori delle interrogazioni (elenco degli ID dei vicini effettivi)</td><td style="text-align:center">✅</td><td style="text-align:center">query_id -&gt; [lista di ID simili top_k]</td></tr>
<tr><td style="text-align:center">scalar_labels.parquet</td><td style="text-align:center">Etichette (metadati che descrivono entità diverse dai vettori)</td><td style="text-align:center">❌</td><td style="text-align:center">id -&gt; etichetta</td></tr>
</tbody>
</table>
<p>Specifiche dei file richieste:</p>
<ul>
<li><p>Il<strong>file del vettore di addestramento (train.parquet)</strong> deve contenere una colonna ID con numeri interi incrementali e una colonna vettore contenente array di float32. I nomi delle colonne sono configurabili, ma la colonna ID deve utilizzare tipi interi per una corretta indicizzazione.</p></li>
<li><p>Il<strong>file vettoriale di prova (test.parquet)</strong> segue la stessa struttura dei dati di addestramento. Il nome della colonna ID deve essere "id", mentre i nomi delle colonne del vettore possono essere personalizzati per adattarsi allo schema dei dati.</p></li>
<li><p><strong>Ground Truth File (neighbors.parquet)</strong> contiene i vicini di riferimento per ogni query di test. Richiede una colonna ID corrispondente agli ID dei vettori di test e una colonna dell'array neighbors contenente gli ID dei vicini corretti del set di addestramento.</p></li>
<li><p>Il<strong>file delle etichette scalari (scalar_labels.parquet)</strong> è opzionale e contiene le etichette dei metadati associate ai vettori di addestramento, utili per i test di ricerca filtrati.</p></li>
</ul>
<h3 id="Data-Format-Challenges" class="common-anchor-header">Sfide del formato dei dati</h3><p>La maggior parte dei dati vettoriali di produzione esiste in formati che non corrispondono direttamente ai requisiti di VDBBench. I file CSV in genere memorizzano gli embeddings come rappresentazioni di stringhe di array, i file NPY contengono matrici numeriche grezze senza metadati e le esportazioni di database spesso utilizzano JSON o altri formati strutturati.</p>
<p>La conversione manuale di questi formati comporta diverse fasi complesse: analizzare le rappresentazioni di stringhe in matrici numeriche, calcolare i vicini esatti utilizzando librerie come FAISS, dividere correttamente i set di dati mantenendo la coerenza degli ID e garantire che tutti i tipi di dati corrispondano alle specifiche Parquet.</p>
<h3 id="Automated-Format-Conversion" class="common-anchor-header">Conversione automatica dei formati</h3><p>Per semplificare il processo di conversione, abbiamo sviluppato uno script Python che gestisce automaticamente la conversione del formato, il calcolo della verità di base e la corretta strutturazione dei dati.</p>
<p><strong>Formato di ingresso CSV:</strong></p>
<pre><code translate="no"><span class="hljs-built_in">id</span>,emb,label
<span class="hljs-number">1</span>,<span class="hljs-string">&quot;[0.12,0.56,0.89,...]&quot;</span>,A
<span class="hljs-number">2</span>,<span class="hljs-string">&quot;[0.33,0.48,0.90,...]&quot;</span>,B
<button class="copy-code-btn"></button></code></pre>
<p><strong>Formato di ingresso NPY:</strong></p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
vectors = np.<span class="hljs-property">random</span>.<span class="hljs-title function_">rand</span>(<span class="hljs-number">10000</span>, <span class="hljs-number">768</span>).<span class="hljs-title function_">astype</span>(<span class="hljs-string">&#x27;float32&#x27;</span>)
np.<span class="hljs-title function_">save</span>(<span class="hljs-string">&quot;vectors.npy&quot;</span>, vectors)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Conversion-Script-Implementation" class="common-anchor-header">Implementazione dello script di conversione</h3><p><strong>Installare le dipendenze necessarie:</strong></p>
<pre><code translate="no">pip install numpy pandas faiss-cpu
<button class="copy-code-btn"></button></code></pre>
<p><strong>Eseguire la conversione:</strong></p>
<pre><code translate="no">python convert_to_vdb_format.py \
  --train data/train.csv \
  --<span class="hljs-built_in">test</span> data/test.csv \
  --out datasets/custom \
  --topk 10
<button class="copy-code-btn"></button></code></pre>
<p><strong>Riferimento ai parametri:</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Nome del parametro</strong></th><th style="text-align:center"><strong>Richiesto</strong></th><th style="text-align:center"><strong>Tipo</strong></th><th style="text-align:center"><strong>Descrizione</strong></th><th style="text-align:center"><strong>Valore predefinito</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><code translate="no">--train</code></td><td style="text-align:center">Si</td><td style="text-align:center">Stringa</td><td style="text-align:center">Percorso dei dati di allenamento, supporta il formato CSV o NPY. Il CSV deve contenere la colonna emb, se non c'è la colonna id verrà generata automaticamente.</td><td style="text-align:center">Non c'è</td></tr>
<tr><td style="text-align:center"><code translate="no">--test</code></td><td style="text-align:center">Sì</td><td style="text-align:center">Stringa</td><td style="text-align:center">Percorso dei dati di interrogazione, supporta il formato CSV o NPY. Formato uguale a quello dei dati di allenamento</td><td style="text-align:center">Nessuno</td></tr>
<tr><td style="text-align:center"><code translate="no">--out</code></td><td style="text-align:center">Sì</td><td style="text-align:center">Stringa</td><td style="text-align:center">Percorso della directory di output, salva i file di parquet convertiti e i file di indice dei vicini</td><td style="text-align:center">Nessuno</td></tr>
<tr><td style="text-align:center"><code translate="no">--labels</code></td><td style="text-align:center">No</td><td style="text-align:center">Stringa</td><td style="text-align:center">Percorso CSV delle etichette, deve contenere la colonna labels (formattata come array di stringhe), utilizzata per salvare le etichette</td><td style="text-align:center">No</td></tr>
<tr><td style="text-align:center"><code translate="no">--topk</code></td><td style="text-align:center">No</td><td style="text-align:center">Intero</td><td style="text-align:center">Numero di vicini più prossimi da restituire durante il calcolo</td><td style="text-align:center">10</td></tr>
</tbody>
</table>
<p><strong>Struttura della directory di output:</strong></p>
<pre><code translate="no">datasets/custom/
├── train.parquet        <span class="hljs-comment"># Training vectors</span>
├── test.parquet         <span class="hljs-comment"># Query vectors  </span>
├── neighbors.parquet    <span class="hljs-comment"># Ground Truth</span>
└── scalar_labels.parquet <span class="hljs-comment"># Optional scalar labels</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Complete-Conversion-Script" class="common-anchor-header">Script di conversione completo</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os
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
<p><strong>Output del processo di conversione:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_conversion_process_output_0827ba75c9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>File generati Verifica:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_f02cd2964e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Custom-Dataset-Configuration" class="common-anchor-header">Configurazione del set di dati personalizzato</h3><p>Passare alla sezione di configurazione del set di dati personalizzato nell'interfaccia web:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_aa14b75b5d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>L'interfaccia di configurazione fornisce campi per i metadati del dataset e per la specifica del percorso del file:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_1b64832990.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Parametri di configurazione:</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Nome del parametro</strong></th><th style="text-align:center"><strong>Significato</strong></th><th style="text-align:center"><strong>Suggerimenti per la configurazione</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Nome</td><td style="text-align:center">Nome del set di dati (identificatore univoco)</td><td style="text-align:center">Qualsiasi nome, ad es, <code translate="no">my_custom_dataset</code></td></tr>
<tr><td style="text-align:center">Percorso cartella</td><td style="text-align:center">Percorso della cartella del file del set di dati</td><td style="text-align:center">ad esempio, <code translate="no">/data/datasets/custom</code></td></tr>
<tr><td style="text-align:center">dim</td><td style="text-align:center">Dimensioni del vettore</td><td style="text-align:center">Deve corrispondere ai file di dati, ad esempio, 768</td></tr>
<tr><td style="text-align:center">dimensione</td><td style="text-align:center">Numero di vettori (opzionale)</td><td style="text-align:center">Può essere lasciato vuoto, il sistema lo rileverà automaticamente.</td></tr>
<tr><td style="text-align:center">tipo di metrica</td><td style="text-align:center">Metodo di misurazione della somiglianza</td><td style="text-align:center">Comunemente si usa L2 (distanza euclidea) o IP (prodotto interno).</td></tr>
<tr><td style="text-align:center">nome del file di addestramento</td><td style="text-align:center">Nome del file del set di allenamento (senza estensione .parquet)</td><td style="text-align:center">Se <code translate="no">train.parquet</code>, compilare <code translate="no">train</code>. Per file multipli utilizzare la separazione con virgola, ad es, <code translate="no">train1,train2</code></td></tr>
<tr><td style="text-align:center">nome del file test</td><td style="text-align:center">Nome del file del set di interrogazione (senza estensione .parquet)</td><td style="text-align:center">Se <code translate="no">test.parquet</code>, compilare <code translate="no">test</code></td></tr>
<tr><td style="text-align:center">nome del file di verità a terra</td><td style="text-align:center">Nome del file della verità a terra (senza estensione .parquet)</td><td style="text-align:center">Se <code translate="no">neighbors.parquet</code>, riempire <code translate="no">neighbors</code></td></tr>
<tr><td style="text-align:center">nome id addestramento</td><td style="text-align:center">Nome della colonna ID dei dati di addestramento</td><td style="text-align:center">Di solito <code translate="no">id</code></td></tr>
<tr><td style="text-align:center">nome del vettore di addestramento</td><td style="text-align:center">Nome della colonna del vettore dei dati di addestramento</td><td style="text-align:center">Se il nome della colonna generato dallo script è <code translate="no">emb</code>, riempire il nome della colonna test. <code translate="no">emb</code></td></tr>
<tr><td style="text-align:center">Nome colonna test</td><td style="text-align:center">Nome della colonna del vettore dei dati di test</td><td style="text-align:center">Di solito è uguale al nome del vettore train, ad es, <code translate="no">emb</code></td></tr>
<tr><td style="text-align:center">nome emb verità terrena</td><td style="text-align:center">Nome della colonna Nearest neighbor in Ground Truth</td><td style="text-align:center">Se il nome della colonna è <code translate="no">neighbors_id</code>, riempire <code translate="no">neighbors_id</code></td></tr>
<tr><td style="text-align:center">etichette scalari nome del file</td><td style="text-align:center">(Facoltativo) Nome del file delle etichette (senza estensione .parquet)</td><td style="text-align:center">Se è stato generato <code translate="no">scalar_labels.parquet</code>, riempire <code translate="no">scalar_labels</code>, altrimenti lasciare vuoto</td></tr>
<tr><td style="text-align:center">percentuali delle etichette</td><td style="text-align:center">(Facoltativo) Rapporto di filtraggio delle etichette</td><td style="text-align:center">ad esempio, <code translate="no">0.001</code>,<code translate="no">0.02</code>,<code translate="no">0.5</code>, lasciare vuoto se non è necessario filtrare le etichette</td></tr>
<tr><td style="text-align:center">descrizione</td><td style="text-align:center">Descrizione del set di dati</td><td style="text-align:center">Non è possibile annotare il contesto aziendale o il metodo di generazione</td></tr>
</tbody>
</table>
<p>Salvare la configurazione per procedere con l'impostazione del test.</p>
<h3 id="Test-Execution-and-Database-Configuration" class="common-anchor-header">Esecuzione del test e configurazione del database</h3><p>Accedere all'interfaccia di configurazione del test:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_3ecdcb1034.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Selezione e configurazione del database (Milvus come esempio):</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_356a2d8c39.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Assegnazione del set di dati:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/9_dataset_assignment_85ba7b24ca.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Metadati di prova ed etichettatura:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/10_test_metadata_and_labeling_293f6f2b99.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Esecuzione dei test:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_test_execution_76acb42c98.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Results-Analysis-and-Performance-Evaluation" class="common-anchor-header">Analisi dei risultati e valutazione delle prestazioni<button data-href="#Results-Analysis-and-Performance-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>L'interfaccia dei risultati fornisce un'analisi completa delle prestazioni:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_993c536c20.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Test-Configuration-Summary" class="common-anchor-header">Riepilogo della configurazione del test</h3><p>La valutazione ha testato livelli di concorrenza di 1, 5 e 10 operazioni simultanee (limitati dalle risorse hardware disponibili), dimensioni dei vettori di 768, dimensioni del set di dati di 3.000 vettori di addestramento e 3.000 query di test, con il filtraggio delle etichette scalari disattivato per questa esecuzione di test.</p>
<h3 id="Critical-Implementation-Considerations" class="common-anchor-header">Considerazioni critiche sull'implementazione</h3><ul>
<li><p><strong>Coerenza dimensionale:</strong> Le discrepanze di dimensione dei vettori tra i set di dati di addestramento e di test causano l'immediato fallimento del test. Verificare l'allineamento dimensionale durante la preparazione dei dati per evitare errori in fase di esecuzione.</p></li>
<li><p><strong>Accuratezza della verità a terra:</strong> calcoli errati della verità a terra invalidano le misurazioni del tasso di richiamo. Lo script di conversione fornito utilizza FAISS con distanza L2 per il calcolo esatto dei vicini, garantendo risultati di riferimento accurati.</p></li>
<li><p><strong>Requisiti di scala del set di dati:</strong> I dataset di piccole dimensioni (inferiori a 10.000 vettori) possono produrre misurazioni QPS incoerenti a causa di una generazione di carico insufficiente. Considerare la possibilità di scalare le dimensioni del set di dati per ottenere test di throughput più affidabili.</p></li>
<li><p><strong>Allocazione delle risorse:</strong> I vincoli di memoria e CPU dei container Docker possono limitare artificialmente le prestazioni del database durante i test. Monitorate l'utilizzo delle risorse e regolate i limiti dei container come necessario per ottenere una misurazione accurata delle prestazioni.</p></li>
<li><p><strong>Monitoraggio degli errori:</strong> <strong>VDBBench</strong> può registrare errori nell'output della console che non appaiono nell'interfaccia web. Monitorate i log del terminale durante l'esecuzione dei test per ottenere informazioni diagnostiche complete.</p></li>
</ul>
<h2 id="Supplemental-Tools-Test-Data-Generation" class="common-anchor-header">Strumenti supplementari: Generazione di dati di test<button data-href="#Supplemental-Tools-Test-Data-Generation" class="anchor-icon" translate="no">
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
    </button></h2><p>Per gli scenari di sviluppo e di test standardizzati, è possibile generare insiemi di dati sintetici con caratteristiche controllate:</p>
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
<p>Questa utility genera insiemi di dati con dimensioni e numero di record specificati per scenari di prototipazione e test di base.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusione<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Avete appena imparato a liberarvi dal "teatro dei benchmark" che ha fuorviato innumerevoli decisioni sui database vettoriali. Con VDBBench e il vostro set di dati, potete generare metriche di QPS, latenza e richiamo di livello produttivo, senza più tirare a indovinare da dati accademici vecchi di decenni.</p>
<p>Smettete di affidarvi a benchmark in scatola che non hanno nulla a che fare con i vostri carichi di lavoro reali. In poche ore, e non in settimane, potrete vedere esattamente come si comporta un database con <em>i vostri</em> vettori, le <em>vostre</em> query e i <em>vostri</em> vincoli. Questo significa che potete decidere in tutta tranquillità, evitare dolorose riscritture in un secondo momento e distribuire sistemi che funzionano davvero in produzione.</p>
<ul>
<li><p>Provate VDBBench con i vostri carichi di lavoro: <a href="https://github.com/zilliztech/VectorDBBench">https://github.com/zilliztech/VectorDBBench</a></p></li>
<li><p>Visualizza i risultati dei test dei principali database vettoriali: <a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch&amp;__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1755165753372.1755169827021.775&amp;__hssc=175614333.3.1755169827021&amp;__hsfp=1940526538">Classifica VDBBench</a></p></li>
</ul>
<p>Avete domande o volete condividere i vostri risultati? Unitevi alla conversazione su<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a> o connettetevi con la nostra comunità su <a href="https://discord.com/invite/FG6hMJStWu">Discord</a>.</p>
<hr>
<p><em>Questo è il primo post della nostra serie VectorDB POC Guide: metodi pratici e testati dagli sviluppatori per costruire infrastrutture di intelligenza artificiale che funzionino sotto la pressione del mondo reale. Restate sintonizzati per saperne di più!</em></p>
