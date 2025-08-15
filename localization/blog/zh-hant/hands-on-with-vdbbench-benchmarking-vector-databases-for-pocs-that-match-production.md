---
id: >-
  hands-on-with-vdbbench-benchmarking-vector-databases-for-pocs-that-match-production.md
title: 上手使用 VDBBench：為向量資料庫建立與生產相匹配的 POC 基準
author: Yifan Cai
date: 2025-08-15T00:00:00.000Z
desc: 瞭解如何使用 VDBBench 以真實生產資料測試向量資料庫。預測實際效能的自訂資料集 POC 分步指南。
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
<p>向量資料庫現在已成為 AI 基礎架構的核心部分，為客戶服務、內容產生、搜尋、推薦等各種由 LLM 驅動的應用程式提供動力。</p>
<p>市場上有許多選擇，從 Milvus 和 Zilliz Cloud 等專門打造的向量資料庫，到將向量搜尋作為附加元件的傳統資料庫，<strong>要選擇一個合適的資料庫並不如閱讀基準圖那麼簡單。</strong></p>
<p>大多數團隊在承諾之前都會先執行概念驗證 (POC)，理論上這是明智的做法 - 但實際上，許多廠商的基準在紙上看來令人印象深刻，但在實際情況下卻會崩潰。</p>
<p>其中一個主要原因是，大多數的效能聲稱都是基於 2006-2012 年的過時資料集（SIFT、GloVe、LAION），這些資料集的行為與現代的嵌入式資料集大相逕庭。舉例來說，SIFT 採用 128 維向量，而現今的 AI 模型則採用更高的維度 - OpenAI 最新的模型採用 3,072 維，Cohere 則採用 1,024 維 - 這是影響效能、成本和擴充性的重大轉變。</p>
<h2 id="The-Fix-Test-with-Your-Data-Not-Canned-Benchmarks" class="common-anchor-header">解決方案：使用您的資料進行測試，而非預先設定好的基準<button data-href="#The-Fix-Test-with-Your-Data-Not-Canned-Benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>最簡單有效的解決方案：使用應用程式實際產生的向量來執行 POC 評估。這表示使用您的嵌入模型、真實查詢和實際資料分佈。</p>
<p>這正是<a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md"><strong>VDBBench</strong></a>- 開放原始碼向量資料庫基準工具 - 的目的。它支援任何向量資料庫的評估與比較，包括 Milvus、Elasticsearch、pgvector 等，並可模擬真實的生產工作負載。</p>
<p><a href="https://github.com/zilliztech/VectorDBBench">下載 VDBBench 1.0 →</a>|<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch&amp;__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1755165753372.1755169827021.775&amp;__hssc=175614333.3.1755169827021&amp;__hsfp=1940526538"> 查看排行榜 →</a>|<a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md">什麼是 VDBBench</a></p>
<p>VDBbench 可讓您</p>
<ul>
<li><p><strong>使用</strong>嵌入模型中<strong>自己的資料進行測試</strong></p></li>
<li><p>模擬<strong>並發插入、查詢和串流擷取</strong></p></li>
<li><p>測量<strong>P95/P99 延遲、持續吞吐量和召回精確度</strong></p></li>
<li><p>在相同條件下針對多個資料庫進行基準測試</p></li>
<li><p>允許<strong>自訂資料集測試</strong>，使結果與生產實際相符</p></li>
</ul>
<p>接下來，我們將教您如何使用 VDBBench 和您的真實資料來執行生產級的 POC，讓您可以做出有信心、經得起未來考驗的選擇。</p>
<h2 id="How-to-Evaluate-VectorDBs-with-Your-Custom-Datasets-with-VDBBench" class="common-anchor-header">如何使用VDBBench用您的定制数据集评估VectorDBs<button data-href="#How-to-Evaluate-VectorDBs-with-Your-Custom-Datasets-with-VDBBench" class="anchor-icon" translate="no">
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
    </button></h2><p>在開始之前，請確保您已安裝 Python 3.11 或更高版本。您需要 CSV 或 NPY 格式的向量資料、約 2-3 小時的完整設定與測試時間，以及中階 Python 知識，以便在需要時排除故障。</p>
<h3 id="Installation-and-Configuration" class="common-anchor-header">安裝與設定</h3><p>如果您要評估一個資料庫，請執行此指令：</p>
<pre><code translate="no">pip install vectordb-bench
<button class="copy-code-btn"></button></code></pre>
<p>如果您要比較所有支援的資料庫，請執行此指令：</p>
<pre><code translate="no">pip install vectordb-bench[<span class="hljs-built_in">all</span>]
<button class="copy-code-btn"></button></code></pre>
<p>針對特定的資料庫用戶端 (例如：Elasticsearch)：</p>
<pre><code translate="no">pip install vectordb-bench[elastic]
<button class="copy-code-btn"></button></code></pre>
<p>查看此<a href="https://github.com/zilliztech/VectorDBBench">GitHub 頁面</a>，瞭解所有支援的資料庫及其安裝指令。</p>
<h3 id="Launching-VDBBench" class="common-anchor-header">啟動 VDBBench</h3><p>啟動<strong>VDBBench</strong>：</p>
<pre><code translate="no">init_bench
<button class="copy-code-btn"></button></code></pre>
<p>預期的主控台輸出： 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_expected_console_output_66e1a218b7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>網頁介面將可在本機使用：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_2e4dd7ea69.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Data-Preparation-and-Format-Conversion" class="common-anchor-header">資料準備與格式轉換</h3><p>VDBBench 需要具有特定模式的結構化 Parquet 檔案，以確保在不同資料庫和資料集間進行一致的測試。</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>檔案名稱</strong></th><th style="text-align:center"><strong>檔案名稱</strong></th><th style="text-align:center"><strong>必須</strong></th><th style="text-align:center"><strong>內容範例</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">train.parquet</td><td style="text-align:center">用於插入資料庫的向量集合</td><td style="text-align:center">✅</td><td style="text-align:center">向量 ID + 向量資料 (list[float])</td></tr>
<tr><td style="text-align:center">test.parquet</td><td style="text-align:center">用於查詢的向量集合</td><td style="text-align:center">✅</td><td style="text-align:center">向量 ID + 向量資料 (list[float])</td></tr>
<tr><td style="text-align:center">鄰居</td><td style="text-align:center">查詢向量的 Ground Truth (實際最近鄰居 ID 清單)</td><td style="text-align:center">✅</td><td style="text-align:center">query_id -&gt; [top_k 類似 ID 清單］</td></tr>
<tr><td style="text-align:center">標量標籤</td><td style="text-align:center">標籤 (描述向量以外的實體的元資料)</td><td style="text-align:center">❌</td><td style="text-align:center">id -&gt; 標籤</td></tr>
</tbody>
</table>
<p>所需的檔案規格：</p>
<ul>
<li><p><strong>訓練向量檔案 (train.parquet)</strong>必須包含增量整數的 ID 欄，以及包含 float32 陣列的向量欄。欄名稱可設定，但 ID 欄必須使用整數類型以進行適當的索引。</p></li>
<li><p><strong>測試向量檔案 (test.parquet)</strong>遵循與訓練資料相同的結構。ID 列名稱必須是 "id"，而向量列名稱則可以自訂，以符合您的資料模式。</p></li>
<li><p><strong>Ground Truth 檔案 (neighbors.parquet)</strong>包含每個測試查詢的參考近鄰。它需要與測試向量 ID 對應的 ID 列，以及包含訓練集中正確近鄰 ID 的 neighbors 陣列。</p></li>
<li><p><strong>標量標籤檔案 (scalar_labels.parquet)</strong>是可選的，它包含與訓練向量相關的元資料標籤，對於篩選搜尋測試非常有用。</p></li>
</ul>
<h3 id="Data-Format-Challenges" class="common-anchor-header">資料格式的挑戰</h3><p>大多數生產向量資料的格式並不直接符合 VDBBench 的需求。CSV 檔案通常會將嵌入資料儲存為陣列的字串表示，NPY 檔案包含沒有元資料的原始數值矩陣，而資料庫匯出則通常使用 JSON 或其他結構化格式。</p>
<p>手動轉換這些格式涉及數個複雜的步驟：將字串表示解析為數值陣列、使用 FAISS 等函式庫計算精確的近鄰、在維持 ID 一致性的同時適當分割資料集、確保所有資料類型符合 Parquet 規格。</p>
<h3 id="Automated-Format-Conversion" class="common-anchor-header">自動格式轉換</h3><p>為了簡化轉換流程，我們開發了一個 Python 腳本，可自動處理格式轉換、地面真值計算和適當的資料結構。</p>
<p><strong>CSV 輸入格式：</strong></p>
<pre><code translate="no"><span class="hljs-built_in">id</span>,emb,label
<span class="hljs-number">1</span>,<span class="hljs-string">&quot;[0.12,0.56,0.89,...]&quot;</span>,A
<span class="hljs-number">2</span>,<span class="hljs-string">&quot;[0.33,0.48,0.90,...]&quot;</span>,B
<button class="copy-code-btn"></button></code></pre>
<p><strong>NPY 輸入格式：</strong></p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
vectors = np.<span class="hljs-property">random</span>.<span class="hljs-title function_">rand</span>(<span class="hljs-number">10000</span>, <span class="hljs-number">768</span>).<span class="hljs-title function_">astype</span>(<span class="hljs-string">&#x27;float32&#x27;</span>)
np.<span class="hljs-title function_">save</span>(<span class="hljs-string">&quot;vectors.npy&quot;</span>, vectors)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Conversion-Script-Implementation" class="common-anchor-header">轉換腳本實作</h3><p><strong>安裝所需的相依性：</strong></p>
<pre><code translate="no">pip install numpy pandas faiss-cpu
<button class="copy-code-btn"></button></code></pre>
<p><strong>執行轉換：</strong></p>
<pre><code translate="no">python convert_to_vdb_format.py \
  --train data/train.csv \
  --<span class="hljs-built_in">test</span> data/test.csv \
  --out datasets/custom \
  --topk 10
<button class="copy-code-btn"></button></code></pre>
<p><strong>參數參考：</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>參數名稱</strong></th><th style="text-align:center"><strong>必須</strong></th><th style="text-align:center"><strong>類型</strong></th><th style="text-align:center"><strong>說明</strong></th><th style="text-align:center"><strong>預設值</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><code translate="no">--train</code></td><td style="text-align:center">是</td><td style="text-align:center">字串</td><td style="text-align:center">訓練資料路徑，支援 CSV 或 NPY 格式。CSV 必須包含 emb 欄，如果沒有 id 欄會自動產生</td><td style="text-align:center">無</td></tr>
<tr><td style="text-align:center"><code translate="no">--test</code></td><td style="text-align:center">有</td><td style="text-align:center">字串</td><td style="text-align:center">查詢資料路徑，支援 CSV 或 NPY 格式。格式與訓練資料相同</td><td style="text-align:center">無</td></tr>
<tr><td style="text-align:center"><code translate="no">--out</code></td><td style="text-align:center">有</td><td style="text-align:center">字串</td><td style="text-align:center">輸出目錄路徑，儲存轉換後的 Parquet 檔案和鄰居索引檔案</td><td style="text-align:center">無</td></tr>
<tr><td style="text-align:center"><code translate="no">--labels</code></td><td style="text-align:center">無</td><td style="text-align:center">字串</td><td style="text-align:center">標籤 CSV 路徑，必須包含標籤列 (格式化為字串陣列)，用於儲存標籤</td><td style="text-align:center">無</td></tr>
<tr><td style="text-align:center"><code translate="no">--topk</code></td><td style="text-align:center">無</td><td style="text-align:center">整數</td><td style="text-align:center">計算時返回的最近鄰居數</td><td style="text-align:center">10</td></tr>
</tbody>
</table>
<p><strong>輸出目錄結構：</strong></p>
<pre><code translate="no">datasets/custom/
├── train.parquet        <span class="hljs-comment"># Training vectors</span>
├── test.parquet         <span class="hljs-comment"># Query vectors  </span>
├── neighbors.parquet    <span class="hljs-comment"># Ground Truth</span>
└── scalar_labels.parquet <span class="hljs-comment"># Optional scalar labels</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Complete-Conversion-Script" class="common-anchor-header">完整的轉換腳本</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os
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
<p><strong>轉換過程輸出：</strong>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_conversion_process_output_0827ba75c9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>生成的檔案驗證：</strong>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_f02cd2964e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Custom-Dataset-Configuration" class="common-anchor-header">自訂資料集組態</h3><p>導覽到 Web 介面中的 Custom Dataset Configuration（自訂資料集組態）區段：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_aa14b75b5d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>設定介面提供資料集元資料和檔案路徑規格的欄位：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_1b64832990.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>組態參數：</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>參數名稱</strong></th><th style="text-align:center"><strong>意義</strong></th><th style="text-align:center"><strong>配置建議</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">名稱</td><td style="text-align:center">資料集名稱（唯一識別碼）</td><td style="text-align:center">任何名稱，例如<code translate="no">my_custom_dataset</code></td></tr>
<tr><td style="text-align:center">資料夾路徑</td><td style="text-align:center">資料集檔案目錄路徑</td><td style="text-align:center">例如<code translate="no">/data/datasets/custom</code></td></tr>
<tr><td style="text-align:center">尺寸</td><td style="text-align:center">向量尺寸</td><td style="text-align:center">必須與資料檔案相符，例如：768</td></tr>
<tr><td style="text-align:center">大小</td><td style="text-align:center">向量數量（可選）</td><td style="text-align:center">可以留空，系統會自動偵測</td></tr>
<tr><td style="text-align:center">度量類型</td><td style="text-align:center">相似度量測方法</td><td style="text-align:center">一般使用 L2 (歐氏距離) 或 IP (內積)</td></tr>
<tr><td style="text-align:center">訓練檔案名稱</td><td style="text-align:center">訓練集檔案名稱 (不含 .parquet 副檔名)</td><td style="text-align:center">如果<code translate="no">train.parquet</code> ，請填入<code translate="no">train</code> 。多個檔案使用逗號分隔，例如、<code translate="no">train1,train2</code></td></tr>
<tr><td style="text-align:center">測試檔案名稱</td><td style="text-align:center">查詢集檔案名稱 (不含 .parquet 副檔名)</td><td style="text-align:center">如果<code translate="no">test.parquet</code> ，填入<code translate="no">test</code></td></tr>
<tr><td style="text-align:center">地面真值檔案名稱</td><td style="text-align:center">地面真值檔案名稱（不含 .parquet 副檔名）</td><td style="text-align:center">如果<code translate="no">neighbors.parquet</code>, 填入<code translate="no">neighbors</code></td></tr>
<tr><td style="text-align:center">訓練 ID 名稱</td><td style="text-align:center">訓練資料 ID 欄名稱</td><td style="text-align:center">通常為<code translate="no">id</code></td></tr>
<tr><td style="text-align:center">訓練資料向量名稱</td><td style="text-align:center">訓練資料向量列名稱</td><td style="text-align:center">如果腳本產生的列名稱為<code translate="no">emb</code> ，則填寫<code translate="no">emb</code></td></tr>
<tr><td style="text-align:center">測試嵌入名稱</td><td style="text-align:center">測試資料向量列名稱</td><td style="text-align:center">通常與 train emb 名稱相同，例如<code translate="no">emb</code></td></tr>
<tr><td style="text-align:center">ground truth emb name</td><td style="text-align:center">Ground Truth 中的最近鄰列名稱</td><td style="text-align:center">若列名為<code translate="no">neighbors_id</code> ，則填寫<code translate="no">neighbors_id</code></td></tr>
<tr><td style="text-align:center">標量標籤檔案名稱</td><td style="text-align:center">(可選）標籤檔名（不含 .parquet 副檔名）</td><td style="text-align:center">如果產生<code translate="no">scalar_labels.parquet</code> ，則填寫<code translate="no">scalar_labels</code> ，否則留空</td></tr>
<tr><td style="text-align:center">標籤百分比</td><td style="text-align:center">(可選）標籤篩選比率</td><td style="text-align:center">例如，<code translate="no">0.001</code>,<code translate="no">0.02</code>,<code translate="no">0.5</code>, 如果不需要標籤過濾，則留空</td></tr>
<tr><td style="text-align:center">描述</td><td style="text-align:center">資料集描述</td><td style="text-align:center">無法註明業務內容或產生方法</td></tr>
</tbody>
</table>
<p>儲存設定以繼續進行測試設定。</p>
<h3 id="Test-Execution-and-Database-Configuration" class="common-anchor-header">測試執行與資料庫組態</h3><p>存取測試設定介面：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_3ecdcb1034.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>資料庫選擇與組態（以 Milvus 為例）：</strong>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_356a2d8c39.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>資料集指定：</strong>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/9_dataset_assignment_85ba7b24ca.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>測試元資料與標籤：</strong>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/10_test_metadata_and_labeling_293f6f2b99.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>測試執行：</strong>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_test_execution_76acb42c98.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Results-Analysis-and-Performance-Evaluation" class="common-anchor-header">結果分析與效能評估<button data-href="#Results-Analysis-and-Performance-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>結果介面提供全面的效能分析：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_993c536c20.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Test-Configuration-Summary" class="common-anchor-header">測試組態摘要</h3><p>評估測試的並發等級為 1、5 及 10 個並發作業 (受可用硬體資源限制)，向量尺寸為 768，資料集大小為 3,000 個訓練向量及 3,000 個測試查詢，此測試執行中停用標量標籤過濾功能。</p>
<h3 id="Critical-Implementation-Considerations" class="common-anchor-header">重要的實作考量</h3><ul>
<li><p><strong>維度一致性：</strong>訓練與測試資料集之間的向量維度不一致會導致測試立即失敗。在資料準備過程中驗證尺寸對齊，以避免執行時出錯。</p></li>
<li><p><strong>地面真值的準確性：</strong>不正確的地面真值計算會使召回率的測量失效。所提供的轉換腳本使用 FAISS 與 L2 距離進行精確的近鄰計算，可確保準確的參考結果。</p></li>
<li><p><strong>資料集規模要求：</strong>小型資料集（低於 10,000 個向量）可能會因為負載產生不足而產生不一致的 QPS 測量結果。請考慮調整資料集大小，以進行更可靠的吞吐量測試。</p></li>
<li><p><strong>資源分配：</strong>Docker 容器的記憶體和 CPU 限制可能會在測試期間人為地限制資料庫效能。監控資源利用率，並視需要調整容器限制，以進行精確的效能測量。</p></li>
<li><p><strong>錯誤監控：</strong> <strong>VDBBench</strong>可能會將錯誤記錄到控制台輸出，但不會顯示在 Web 介面中。在測試執行期間監控終端日誌，以獲得完整的診斷資訊。</p></li>
</ul>
<h2 id="Supplemental-Tools-Test-Data-Generation" class="common-anchor-header">補充工具：測試資料產生<button data-href="#Supplemental-Tools-Test-Data-Generation" class="anchor-icon" translate="no">
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
    </button></h2><p>針對開發和標準測試情境，您可以產生具有受控特性的合成資料集：</p>
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
<p>此公用程式會產生具有指定尺寸和記錄數的資料集，用於原型和基線測試情境。</p>
<h2 id="Conclusion" class="common-anchor-header">結論<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>您剛剛學會了如何擺脫「基準劇場」的束縛，它誤導了無數向量資料庫的決策。有了 VDBBench 和您自己的資料集，您就可以產生生產級的 QPS、延遲和召回指標 - 不再需要從數十年前的學術資料中猜測。</p>
<p>不要再依賴與您的實際工作負載毫無關係的罐頭基準。只需數小時（而非數週），您就能精確瞭解資料庫在使用<em>您的</em>向量、查詢和限制條件時<em>的</em>表現。這表示您可以有信心地作出決定，避免日後痛苦的重寫，並發送真正能在生產中運作的系統。</p>
<ul>
<li><p>使用您的工作負載試用 VDBBench<a href="https://github.com/zilliztech/VectorDBBench">：https://github.com/zilliztech/VectorDBBench</a></p></li>
<li><p>檢視主要向量資料庫的測試結果：<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch&amp;__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1755165753372.1755169827021.775&amp;__hssc=175614333.3.1755169827021&amp;__hsfp=1940526538">VDBBench 排行榜</a></p></li>
</ul>
<p>有問題或想分享您的結果？加入<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a>上的對話或在<a href="https://discord.com/invite/FG6hMJStWu">Discord</a> 上與我們的社群連線。</p>
<hr>
<p><em>這是我們 VectorDB POC 指南系列的第一篇文章 - 經開發人員測試的實作方法，用來建立在真實世界壓力下運作的 AI 基礎架構。更多精彩，敬請期待！</em></p>
