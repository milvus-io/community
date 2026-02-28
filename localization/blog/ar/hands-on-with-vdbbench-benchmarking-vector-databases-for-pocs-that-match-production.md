---
id: >-
  hands-on-with-vdbbench-benchmarking-vector-databases-for-pocs-that-match-production.md
title: >
  Hands-On with VDBBench: Benchmarking Vector Databases for POCs That Match
  Production
author: Yifan Cai
date: 2025-08-15T00:00:00.000Z
desc: >-
  Learn how to test vector databases with real production data using VDBBench.
  Step-by-step guide to custom dataset POCs that predict actual performance.
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
<p>Vector databases are now a core part of AI infrastructure, powering various LLM-powered applications for customer service, content generation, search, recommendations, and more.</p>
<p>With so many options in the market, from purpose-built vector databases like Milvus and Zilliz Cloud to traditional databases with vector search as an add-on, <strong>choosing the right one isn’t as simple as reading benchmark charts.</strong></p>
<p>Most teams run a Proof of Concept (POC) before committing, which is smart in theory — but in practice, many vendor benchmarks that look impressive on paper collapse under real-world conditions.</p>
<p>One of the main reasons is that most performance claims are based on outdated datasets from 2006–2012 (SIFT, GloVe, LAION) that behave very differently from modern embeddings. For example, SIFT uses 128-dimensional vectors, while today’s AI models produce far higher dimensions — 3,072 for OpenAI’s latest, 1,024 for Cohere’s —  a big shift that impacts performance, cost, and scalability.</p>
<h2 id="The-Fix-Test-with-Your-Data-Not-Canned-Benchmarks" class="common-anchor-header">The Fix: Test with Your Data, Not Canned Benchmarks<button data-href="#The-Fix-Test-with-Your-Data-Not-Canned-Benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>The simplest and most effective solution: run your POC evaluation with the vectors your application actually generates. That means using your embedding models, your real queries, and your actual data distribution.</p>
<p>This is exactly what <a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md"><strong>VDBBench</strong></a> — an open-source vector database benchmarking tool — is built for. It supports the evaluation and comparison of any vector database, including Milvus, Elasticsearch, pgvector, and more, and simulates real production workloads.</p>
<p><a href="https://github.com/zilliztech/VectorDBBench">Download VDBBench 1.0 →</a> |<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch&amp;__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1755165753372.1755169827021.775&amp;__hssc=175614333.3.1755169827021&amp;__hsfp=1940526538"> View Leaderboard →</a> | <a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md">What is VDBBench</a></p>
<p>VDBbench lets you:</p>
<ul>
<li><p><strong>Test with your own data</strong> from your embedding models</p></li>
<li><p>Simulate <strong>concurrent inserts, queries, and streaming ingestion</strong></p></li>
<li><p>Measure <strong>P95/P99 latency, sustained throughput, and recall accuracy</strong></p></li>
<li><p>Benchmark across multiple databases under identical conditions</p></li>
<li><p>Allows <strong>custom dataset testing</strong> so results actually match production</p></li>
</ul>
<p>Next, we’ll walk you through how to run a production-grade POC with VDBBench and your real data — so you can make a confident, future-proof choice.</p>
<h2 id="How-to-Evaluate-VectorDBs-with-Your-Custom-Datasets-with-VDBBench" class="common-anchor-header">How to Evaluate VectorDBs with Your Custom Datasets with VDBBench<button data-href="#How-to-Evaluate-VectorDBs-with-Your-Custom-Datasets-with-VDBBench" class="anchor-icon" translate="no">
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
    </button></h2><p>Before getting started, ensure you have Python 3.11 or higher installed. You’ll need vector data in CSV or NPY format, approximately 2-3 hours for complete setup and testing, and intermediate Python knowledge for troubleshooting if needed.</p>
<h3 id="Installation-and-Configuration" class="common-anchor-header">Installation and Configuration</h3><p>If you’re evaluating one database, run this command:</p>
<pre><code translate="no">pip install vectordb-bench
<button class="copy-code-btn"></button></code></pre>
<p>If you’re to compare all supported databases, run the command:</p>
<pre><code translate="no">pip install vectordb-bench[<span class="hljs-built_in">all</span>]
<button class="copy-code-btn"></button></code></pre>
<p>For specific database clients (eg: Elasticsearch):</p>
<pre><code translate="no">pip install vectordb-bench[elastic]
<button class="copy-code-btn"></button></code></pre>
<p>Check this <a href="https://github.com/zilliztech/VectorDBBench">GitHub page</a> for all the supported databases and their install commands.</p>
<h3 id="Launching-VDBBench" class="common-anchor-header">Launching VDBBench</h3><p>Start <strong>VDBBench</strong> with:</p>
<pre><code translate="no">init_bench
<button class="copy-code-btn"></button></code></pre>
<p>Expected console output: 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_expected_console_output_66e1a218b7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>The web interface will be available locally:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_2e4dd7ea69.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Data-Preparation-and-Format-Conversion" class="common-anchor-header">Data Preparation and Format Conversion</h3><p>VDBBench requires structured Parquet files with specific schemas to ensure consistent testing across different databases and datasets.</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>File Name</strong></th><th style="text-align:center"><strong>Purpose</strong></th><th style="text-align:center"><strong>Required</strong></th><th style="text-align:center"><strong>Content Example</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">train.parquet</td><td style="text-align:center">Vector collection for database insertion</td><td style="text-align:center">✅</td><td style="text-align:center">Vector ID + Vector data (list[float])</td></tr>
<tr><td style="text-align:center">test.parquet</td><td style="text-align:center">Vector collection for queries</td><td style="text-align:center">✅</td><td style="text-align:center">Vector ID + Vector data (list[float])</td></tr>
<tr><td style="text-align:center">neighbors.parquet</td><td style="text-align:center">Ground Truth for query vectors (actual nearest neighbor ID list)</td><td style="text-align:center">✅</td><td style="text-align:center">query_id -&gt; [top_k similar ID list]</td></tr>
<tr><td style="text-align:center">scalar_labels.parquet</td><td style="text-align:center">Labels (metadata describing entities other than vectors)</td><td style="text-align:center">❌</td><td style="text-align:center">id -&gt; label</td></tr>
</tbody>
</table>
<p>Required File Specifications:</p>
<ul>
<li><p><strong>Training Vector File (train.parquet)</strong> must contain an ID column with incremental integers and a vector column containing float32 arrays. Column names are configurable, but the ID column must use integer types for proper indexing.</p></li>
<li><p><strong>Test Vector File (test.parquet)</strong> follows the same structure as the training data. The ID column name must be “id” while vector column names can be customized to match your data schema.</p></li>
<li><p><strong>Ground Truth File (neighbors.parquet)</strong> contains the reference nearest neighbors for each test query. It requires an ID column corresponding to test vector IDs and a neighbors array column containing the correct nearest neighbor IDs from the training set.</p></li>
<li><p><strong>Scalar Labels File (scalar_labels.parquet)</strong> is optional and contains metadata labels associated with training vectors, useful for filtered search testing.</p></li>
</ul>
<h3 id="Data-Format-Challenges" class="common-anchor-header">Data Format Challenges</h3><p>Most production vector data exists in formats that don’t directly match VDBBench requirements. CSV files typically store embeddings as string representations of arrays, NPY files contain raw numerical matrices without metadata, and database exports often use JSON or other structured formats.</p>
<p>Converting these formats manually involves several complex steps: parsing string representations into numerical arrays, computing exact nearest neighbors using libraries like FAISS, properly splitting datasets while maintaining ID consistency, and ensuring all data types match Parquet specifications.</p>
<h3 id="Automated-Format-Conversion" class="common-anchor-header">Automated Format Conversion</h3><p>To streamline the conversion process, we’ve developed a Python script that handles format conversion, ground truth computation, and proper data structuring automatically.</p>
<p><strong>CSV Input Format:</strong></p>
<pre><code translate="no"><span class="hljs-built_in">id</span>,emb,label
<span class="hljs-number">1</span>,<span class="hljs-string">&quot;[0.12,0.56,0.89,...]&quot;</span>,A
<span class="hljs-number">2</span>,<span class="hljs-string">&quot;[0.33,0.48,0.90,...]&quot;</span>,B
<button class="copy-code-btn"></button></code></pre>
<p><strong>NPY Input Format:</strong></p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
vectors = np.<span class="hljs-property">random</span>.<span class="hljs-title function_">rand</span>(<span class="hljs-number">10000</span>, <span class="hljs-number">768</span>).<span class="hljs-title function_">astype</span>(<span class="hljs-string">&#x27;float32&#x27;</span>)
np.<span class="hljs-title function_">save</span>(<span class="hljs-string">&quot;vectors.npy&quot;</span>, vectors)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Conversion-Script-Implementation" class="common-anchor-header">Conversion Script Implementation</h3><p><strong>Install required dependencies:</strong></p>
<pre><code translate="no">pip install numpy pandas faiss-cpu
<button class="copy-code-btn"></button></code></pre>
<p><strong>Execute the conversion:</strong></p>
<pre><code translate="no">python convert_to_vdb_format.py \
  --train data/train.csv \
  --<span class="hljs-built_in">test</span> data/test.csv \
  --out datasets/custom \
  --topk 10
<button class="copy-code-btn"></button></code></pre>
<p><strong>Parameter Reference:</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Parameter Name</strong></th><th style="text-align:center"><strong>Required</strong></th><th style="text-align:center"><strong>Type</strong></th><th style="text-align:center"><strong>Description</strong></th><th style="text-align:center"><strong>Default Value</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><code translate="no">--train</code></td><td style="text-align:center">Yes</td><td style="text-align:center">String</td><td style="text-align:center">Training data path, supports CSV or NPY format. CSV must contain emb column, if no id column will auto-generate</td><td style="text-align:center">None</td></tr>
<tr><td style="text-align:center"><code translate="no">--test</code></td><td style="text-align:center">Yes</td><td style="text-align:center">String</td><td style="text-align:center">Query data path, supports CSV or NPY format. Format same as training data</td><td style="text-align:center">None</td></tr>
<tr><td style="text-align:center"><code translate="no">--out</code></td><td style="text-align:center">Yes</td><td style="text-align:center">String</td><td style="text-align:center">Output directory path, saves converted parquet files and neighbor index files</td><td style="text-align:center">None</td></tr>
<tr><td style="text-align:center"><code translate="no">--labels</code></td><td style="text-align:center">No</td><td style="text-align:center">String</td><td style="text-align:center">Label CSV path, must contain labels column (formatted as string array), used for saving labels</td><td style="text-align:center">None</td></tr>
<tr><td style="text-align:center"><code translate="no">--topk</code></td><td style="text-align:center">No</td><td style="text-align:center">Integer</td><td style="text-align:center">Number of nearest neighbors to return when computing</td><td style="text-align:center">10</td></tr>
</tbody>
</table>
<p><strong>Output Directory Structure:</strong></p>
<pre><code translate="no">datasets/custom/
├── train.parquet        <span class="hljs-comment"># Training vectors</span>
├── test.parquet         <span class="hljs-comment"># Query vectors  </span>
├── neighbors.parquet    <span class="hljs-comment"># Ground Truth</span>
└── scalar_labels.parquet <span class="hljs-comment"># Optional scalar labels</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Complete-Conversion-Script" class="common-anchor-header">Complete Conversion Script</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os
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
<p><strong>Conversion Process Output:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_conversion_process_output_0827ba75c9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Generated Files Verification:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_f02cd2964e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Custom-Dataset-Configuration" class="common-anchor-header">Custom Dataset Configuration</h3><p>Navigate to the Custom Dataset configuration section in the web interface:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_aa14b75b5d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>The configuration interface provides fields for dataset metadata and file path specification:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_1b64832990.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Configuration Parameters:</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>Parameter Name</strong></th><th style="text-align:center"><strong>Meaning</strong></th><th style="text-align:center"><strong>Configuration Suggestions</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">Name</td><td style="text-align:center">Dataset name (unique identifier)</td><td style="text-align:center">Any name, e.g., <code translate="no">my_custom_dataset</code></td></tr>
<tr><td style="text-align:center">Folder Path</td><td style="text-align:center">Dataset file directory path</td><td style="text-align:center">e.g., <code translate="no">/data/datasets/custom</code></td></tr>
<tr><td style="text-align:center">dim</td><td style="text-align:center">Vector dimensions</td><td style="text-align:center">Must match data files, e.g., 768</td></tr>
<tr><td style="text-align:center">size</td><td style="text-align:center">Vector count (optional)</td><td style="text-align:center">Can be left empty, system will auto-detect</td></tr>
<tr><td style="text-align:center">metric type</td><td style="text-align:center">Similarity measurement method</td><td style="text-align:center">Commonly use L2 (Euclidean distance) or IP (inner product)</td></tr>
<tr><td style="text-align:center">train file name</td><td style="text-align:center">Training set filename (without .parquet extension)</td><td style="text-align:center">If <code translate="no">train.parquet</code>, fill <code translate="no">train</code>. Multiple files use comma separation, e.g., <code translate="no">train1,train2</code></td></tr>
<tr><td style="text-align:center">test file name</td><td style="text-align:center">Query set filename (without .parquet extension)</td><td style="text-align:center">If <code translate="no">test.parquet</code>, fill <code translate="no">test</code></td></tr>
<tr><td style="text-align:center">ground truth file name</td><td style="text-align:center">Ground Truth filename (without .parquet extension)</td><td style="text-align:center">If <code translate="no">neighbors.parquet</code>, fill <code translate="no">neighbors</code></td></tr>
<tr><td style="text-align:center">train id name</td><td style="text-align:center">Training data ID column name</td><td style="text-align:center">Usually <code translate="no">id</code></td></tr>
<tr><td style="text-align:center">train emb name</td><td style="text-align:center">Training data vector column name</td><td style="text-align:center">If script-generated column name is <code translate="no">emb</code>, fill <code translate="no">emb</code></td></tr>
<tr><td style="text-align:center">test emb name</td><td style="text-align:center">Test data vector column name</td><td style="text-align:center">Usually same as train emb name, e.g., <code translate="no">emb</code></td></tr>
<tr><td style="text-align:center">ground truth emb name</td><td style="text-align:center">Nearest neighbor column name in Ground Truth</td><td style="text-align:center">If column name is <code translate="no">neighbors_id</code>, fill <code translate="no">neighbors_id</code></td></tr>
<tr><td style="text-align:center">scalar labels file name</td><td style="text-align:center">(Optional) Label filename (without .parquet extension)</td><td style="text-align:center">If <code translate="no">scalar_labels.parquet</code> was generated, fill <code translate="no">scalar_labels</code>, otherwise leave empty</td></tr>
<tr><td style="text-align:center">label percentages</td><td style="text-align:center">(Optional) Label filter ratio</td><td style="text-align:center">e.g., <code translate="no">0.001</code>,<code translate="no">0.02</code>,<code translate="no">0.5</code>, leave empty if no label filtering needed</td></tr>
<tr><td style="text-align:center">description</td><td style="text-align:center">Dataset description</td><td style="text-align:center">Cannot note business context or generation method</td></tr>
</tbody>
</table>
<p>Save the configuration to proceed with the test setup.</p>
<h3 id="Test-Execution-and-Database-Configuration" class="common-anchor-header">Test Execution and Database Configuration</h3><p>Access the test configuration interface:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_3ecdcb1034.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Database Selection and Configuration (Milvus as an Example):</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_356a2d8c39.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Dataset Assignment:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/9_dataset_assignment_85ba7b24ca.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Test Metadata and Labeling:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/10_test_metadata_and_labeling_293f6f2b99.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Test Execution:</strong> 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_test_execution_76acb42c98.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Results-Analysis-and-Performance-Evaluation" class="common-anchor-header">Results Analysis and Performance Evaluation<button data-href="#Results-Analysis-and-Performance-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>The results interface provides comprehensive performance analytics:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_993c536c20.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Test-Configuration-Summary" class="common-anchor-header">Test Configuration Summary</h3><p>The evaluation tested concurrency levels of 1, 5, and 10 concurrent operations (constrained by available hardware resources), vector dimensions of 768, dataset size of 3,000 training vectors and 3,000 test queries, with scalar label filtering disabled for this test run.</p>
<h3 id="Critical-Implementation-Considerations" class="common-anchor-header">Critical Implementation Considerations</h3><ul>
<li><p><strong>Dimensional Consistency:</strong> Vector dimension mismatches between training and test datasets will cause immediate test failures. Verify dimensional alignment during data preparation to avoid runtime errors.</p></li>
<li><p><strong>Ground Truth Accuracy:</strong> Incorrect ground truth calculations invalidate recall rate measurements. The provided conversion script uses FAISS with L2 distance for exact nearest neighbor computation, ensuring accurate reference results.</p></li>
<li><p><strong>Dataset Scale Requirements:</strong> Small datasets (below 10,000 vectors) may produce inconsistent QPS measurements due to insufficient load generation. Consider scaling the dataset size for more reliable throughput testing.</p></li>
<li><p><strong>Resource Allocation:</strong> Docker container memory and CPU constraints can artificially limit database performance during testing. Monitor resource utilization and adjust container limits as needed for accurate performance measurement.</p></li>
<li><p><strong>Error Monitoring:</strong> <strong>VDBBench</strong> may log errors to console output that don’t appear in the web interface. Monitor terminal logs during test execution for complete diagnostic information.</p></li>
</ul>
<h2 id="Supplemental-Tools-Test-Data-Generation" class="common-anchor-header">Supplemental Tools: Test Data Generation<button data-href="#Supplemental-Tools-Test-Data-Generation" class="anchor-icon" translate="no">
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
    </button></h2><p>For development and standardized testing scenarios, you can generate synthetic datasets with controlled characteristics:</p>
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
<p>This utility generates datasets with specified dimensions and record counts for prototyping and baseline testing scenarios.</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusion<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>You’ve just learned how to break free from the “benchmark theater” that’s misled countless vector database decisions. With VDBBench and your own dataset, you can generate production-grade QPS, latency, and recall metrics—no more guesswork from decades-old academic data.</p>
<p>Stop relying on canned benchmarks that have nothing to do with your real workloads. In just hours—not weeks—you’ll see precisely how a database performs with <em>your</em> vectors, <em>your</em> queries, and <em>your</em> constraints. That means you can make the call with confidence, avoid painful rewrites later, and ship systems that actually work in production.</p>
<ul>
<li><p>Try VDBBench with your workloads: <a href="https://github.com/zilliztech/VectorDBBench">https://github.com/zilliztech/VectorDBBench</a></p></li>
<li><p>View testing results of major vector databases: <a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch&amp;__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1755165753372.1755169827021.775&amp;__hssc=175614333.3.1755169827021&amp;__hsfp=1940526538">VDBBench Leaderboard</a></p></li>
</ul>
<p>Have questions or want to share your results? Join the conversation on<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a> or connect with our community on <a href="https://discord.com/invite/FG6hMJStWu">Discord</a>.</p>
<hr>
<p><em>This is the first post in our VectorDB POC Guide series—hands-on, developer-tested methods for building AI infrastructure that performs under real-world pressure. Stay tuned for more!</em></p>
