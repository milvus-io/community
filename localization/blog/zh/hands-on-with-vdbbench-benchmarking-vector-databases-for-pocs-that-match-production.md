---
id: >-
  hands-on-with-vdbbench-benchmarking-vector-databases-for-pocs-that-match-production.md
title: 亲身体验 VDBBench：为向量数据库设定基准，使 POC 与生产相匹配
author: Yifan Cai
date: 2025-08-15T00:00:00.000Z
desc: 了解如何使用 VDBBench 使用真实生产数据测试向量数据库。预测实际性能的自定义数据集 POC 分步指南。
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
<p>向量数据库现已成为人工智能基础设施的核心部分，为客户服务、内容生成、搜索、推荐等各种由 LLM 驱动的应用提供动力。</p>
<p>市场上有如此多的选择，从 Milvus 和 Zilliz Cloud 等专门构建的向量数据库到将向量搜索作为附加功能的传统数据库，<strong>选择合适的</strong>数据库<strong>并不像阅读基准图那么简单。</strong></p>
<p>大多数团队在承诺之前都会进行概念验证 (POC)，这在理论上是明智之举，但在实践中，许多在纸面上看起来令人印象深刻的供应商基准在实际条件下都会崩溃。</p>
<p>其中一个主要原因是，大多数性能声称都是基于 2006-2012 年的过时数据集（SIFT、GloVe、LAION），这些数据集的行为与现代嵌入式数据集截然不同。例如，SIFT 使用的是 128 维向量，而当今的人工智能模型所产生的维数要高得多--OpenAI 最新的模型是 3,072 维，Cohere 的模型是 1,024 维--这是一个影响性能、成本和可扩展性的重大转变。</p>
<h2 id="The-Fix-Test-with-Your-Data-Not-Canned-Benchmarks" class="common-anchor-header">解决之道：用你的数据测试，而不是照本宣科的基准测试<button data-href="#The-Fix-Test-with-Your-Data-Not-Canned-Benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>最简单有效的解决方案是：使用应用程序实际生成的向量进行 POC 评估。这意味着要使用您的 Embeddings 模型、真实查询和实际数据分布。</p>
<p>这正是开源向量数据库基准测试工具<a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md"><strong>VDBBench</strong></a>的功能所在。它支持对任何向量数据库（包括 Milvus、Elasticsearch、pgvector 等）进行评估和比较，并模拟真实的生产工作负载。</p>
<p><a href="https://github.com/zilliztech/VectorDBBench">下载 VDBBench 1.0 →</a>|<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch&amp;__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1755165753372.1755169827021.775&amp;__hssc=175614333.3.1755169827021&amp;__hsfp=1940526538"> 查看排行榜 →</a>|<a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md">什么是 VDBBench</a></p>
<p>VDBbench 可让您</p>
<ul>
<li><p><strong>使用</strong>嵌入模型中<strong>自己的数据进行测试</strong></p></li>
<li><p>模拟<strong>并发插入、查询和流式摄取</strong></p></li>
<li><p>测量<strong>P95/P99 延迟、持续吞吐量和召回准确性</strong></p></li>
<li><p>在相同条件下对多个数据库进行基准测试</p></li>
<li><p>允许<strong>自定义数据集测试</strong>，使结果与生产实际相匹配</p></li>
</ul>
<p>接下来，我们将指导你如何使用VDBBench和你的真实数据运行生产级POC--这样你就可以做出一个自信的、面向未来的选择。</p>
<h2 id="How-to-Evaluate-VectorDBs-with-Your-Custom-Datasets-with-VDBBench" class="common-anchor-header">如何使用VDBBench用自定义数据集评估VectorDB<button data-href="#How-to-Evaluate-VectorDBs-with-Your-Custom-Datasets-with-VDBBench" class="anchor-icon" translate="no">
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
    </button></h2><p>在开始之前，请确保您已安装 Python 3.11 或更高版本。您需要 CSV 或 NPY 格式的向量数据、大约 2-3 个小时的完整设置和测试时间，以及必要时排除故障所需的 Python 中级知识。</p>
<h3 id="Installation-and-Configuration" class="common-anchor-header">安装和配置</h3><p>如果要评估一个数据库，请运行此命令：</p>
<pre><code translate="no">pip install vectordb-bench
<button class="copy-code-btn"></button></code></pre>
<p>如果要比较所有支持的数据库，请运行该命令：</p>
<pre><code translate="no">pip install vectordb-bench[<span class="hljs-built_in">all</span>]
<button class="copy-code-btn"></button></code></pre>
<p>对于特定的数据库客户端（例如：Elasticsearch），请执行以下命令</p>
<pre><code translate="no">pip install vectordb-bench[elastic]
<button class="copy-code-btn"></button></code></pre>
<p>查看此<a href="https://github.com/zilliztech/VectorDBBench">GitHub 页面</a>，了解所有支持的数据库及其安装命令。</p>
<h3 id="Launching-VDBBench" class="common-anchor-header">启动 VDBBench</h3><p>用以下命令启动<strong>VDBBench</strong></p>
<pre><code translate="no">init_bench
<button class="copy-code-btn"></button></code></pre>
<p>预期控制台输出： 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_expected_console_output_66e1a218b7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>网络界面将在本地可用：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_2e4dd7ea69.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Data-Preparation-and-Format-Conversion" class="common-anchor-header">数据准备和格式转换</h3><p>VDBBench 需要具有特定 Schema 的结构化 Parquet 文件，以确保在不同数据库和数据集之间进行一致的测试。</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>文件名</strong></th><th style="text-align:center"><strong>目的</strong></th><th style="text-align:center"><strong>要求</strong></th><th style="text-align:center"><strong>内容 示例</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">train.parquet</td><td style="text-align:center">用于插入数据库的向量 Collections</td><td style="text-align:center">✅</td><td style="text-align:center">向量 ID + 向量数据 (list[float])</td></tr>
<tr><td style="text-align:center">test.parquet</td><td style="text-align:center">用于查询的向量 Collections</td><td style="text-align:center">✅</td><td style="text-align:center">向量 ID + 向量数据 (list[float])</td></tr>
<tr><td style="text-align:center">neighbors.parquet</td><td style="text-align:center">查询向量的地面实况（实际近邻 ID 列表）</td><td style="text-align:center">✅</td><td style="text-align:center">query_id -&gt; [top_k 类似 ID 列表］</td></tr>
<tr><td style="text-align:center">标量标签</td><td style="text-align:center">标签（描述向量以外实体的元数据）</td><td style="text-align:center">❌</td><td style="text-align:center">id -&gt; 标签</td></tr>
</tbody>
</table>
<p>所需文件规格：</p>
<ul>
<li><p><strong>训练矢量文件 (train.parquet)</strong>必须包含一个带有增量整数的 ID 列和一个包含 float32 数组的向量列。列名可配置，但 ID 列必须使用整数类型，以便正确索引。</p></li>
<li><p><strong>测试向量文件 (test.parquet)</strong>采用与训练数据相同的结构。ID 列名必须为 "id"，而向量列名可根据数据 Schema 定制。</p></li>
<li><p><strong>地面实况文件（neakers.parquet）</strong>包含每个测试查询的参考近邻。它需要一个与测试向量 ID 相对应的 ID 列和一个包含训练集中正确近邻 ID 的 neighbors 数组列。</p></li>
<li><p><strong>标量标签文件（scalar_labels.parquet）</strong>是可选的，它包含与训练向量相关的元数据标签，对筛选搜索测试很有用。</p></li>
</ul>
<h3 id="Data-Format-Challenges" class="common-anchor-header">数据格式挑战</h3><p>大多数生产向量数据的格式并不直接符合 VDBBench 的要求。CSV 文件通常以数组的字符串形式存储 Embeddings，NPY 文件包含没有元数据的原始数值矩阵，而数据库导出通常使用 JSON 或其他结构化格式。</p>
<p>手动转换这些格式涉及多个复杂步骤：将字符串表示解析为数字数组，使用 FAISS 等库计算精确近邻，在保持 ID 一致的同时适当拆分数据集，以及确保所有数据类型符合 Parquet 规范。</p>
<h3 id="Automated-Format-Conversion" class="common-anchor-header">自动格式转换</h3><p>为了简化转换过程，我们开发了一个 Python 脚本，可以自动处理格式转换、地面实况计算和适当的数据结构。</p>
<p><strong>CSV 输入格式：</strong></p>
<pre><code translate="no"><span class="hljs-built_in">id</span>,emb,label
<span class="hljs-number">1</span>,<span class="hljs-string">&quot;[0.12,0.56,0.89,...]&quot;</span>,A
<span class="hljs-number">2</span>,<span class="hljs-string">&quot;[0.33,0.48,0.90,...]&quot;</span>,B
<button class="copy-code-btn"></button></code></pre>
<p><strong>NPY 输入格式</strong></p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
vectors = np.<span class="hljs-property">random</span>.<span class="hljs-title function_">rand</span>(<span class="hljs-number">10000</span>, <span class="hljs-number">768</span>).<span class="hljs-title function_">astype</span>(<span class="hljs-string">&#x27;float32&#x27;</span>)
np.<span class="hljs-title function_">save</span>(<span class="hljs-string">&quot;vectors.npy&quot;</span>, vectors)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Conversion-Script-Implementation" class="common-anchor-header">转换脚本实现</h3><p><strong>安装所需的依赖项：</strong></p>
<pre><code translate="no">pip install numpy pandas faiss-cpu
<button class="copy-code-btn"></button></code></pre>
<p><strong>执行转换：</strong></p>
<pre><code translate="no">python convert_to_vdb_format.py \
  --train data/train.csv \
  --<span class="hljs-built_in">test</span> data/test.csv \
  --out datasets/custom \
  --topk 10
<button class="copy-code-btn"></button></code></pre>
<p><strong>参数参考：</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>参数名称</strong></th><th style="text-align:center"><strong>需要</strong></th><th style="text-align:center"><strong>类型</strong></th><th style="text-align:center"><strong>说明</strong></th><th style="text-align:center"><strong>默认值</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><code translate="no">--train</code></td><td style="text-align:center">是</td><td style="text-align:center">字符串</td><td style="text-align:center">训练数据路径，支持 CSV 或 NPY 格式。CSV 必须包含 emb 列，如果没有 id 列将自动生成</td><td style="text-align:center">无</td></tr>
<tr><td style="text-align:center"><code translate="no">--test</code></td><td style="text-align:center">有</td><td style="text-align:center">字符串</td><td style="text-align:center">查询数据路径，支持 CSV 或 NPY 格式。格式与训练数据相同</td><td style="text-align:center">无</td></tr>
<tr><td style="text-align:center"><code translate="no">--out</code></td><td style="text-align:center">有</td><td style="text-align:center">字符串</td><td style="text-align:center">输出目录路径，保存转换后的 parquet 文件和邻接索引文件</td><td style="text-align:center">无</td></tr>
<tr><td style="text-align:center"><code translate="no">--labels</code></td><td style="text-align:center">无</td><td style="text-align:center">字符串</td><td style="text-align:center">标签 CSV 路径，必须包含标签列（格式为字符串数组），用于保存标签</td><td style="text-align:center">无</td></tr>
<tr><td style="text-align:center"><code translate="no">--topk</code></td><td style="text-align:center">无</td><td style="text-align:center">整数</td><td style="text-align:center">计算时返回的最近邻数</td><td style="text-align:center">10</td></tr>
</tbody>
</table>
<p><strong>输出目录结构：</strong></p>
<pre><code translate="no">datasets/custom/
├── train.parquet        <span class="hljs-comment"># Training vectors</span>
├── test.parquet         <span class="hljs-comment"># Query vectors  </span>
├── neighbors.parquet    <span class="hljs-comment"># Ground Truth</span>
└── scalar_labels.parquet <span class="hljs-comment"># Optional scalar labels</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Complete-Conversion-Script" class="common-anchor-header">完整转换脚本</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os
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
<p><strong>转换过程输出：</strong>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_conversion_process_output_0827ba75c9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>生成的文件 验证：</strong>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_f02cd2964e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Custom-Dataset-Configuration" class="common-anchor-header">自定义数据集配置</h3><p>导航至 Web 界面中的自定义数据集配置部分：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_aa14b75b5d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>配置界面提供了数据集元数据和文件路径规范字段：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_1b64832990.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>配置参数：</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>参数名称</strong></th><th style="text-align:center"><strong>参数名称</strong></th><th style="text-align:center"><strong>配置建议</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">数据集名称</td><td style="text-align:center">数据集名称（唯一标识符）</td><td style="text-align:center">任何名称，例如<code translate="no">my_custom_dataset</code></td></tr>
<tr><td style="text-align:center">文件夹路径</td><td style="text-align:center">数据集文件目录路径</td><td style="text-align:center">例如<code translate="no">/data/datasets/custom</code></td></tr>
<tr><td style="text-align:center">尺寸</td><td style="text-align:center">向量尺寸</td><td style="text-align:center">必须与数据文件匹配，例如 768</td></tr>
<tr><td style="text-align:center">大小</td><td style="text-align:center">向量数量（可选）</td><td style="text-align:center">可留空，系统将自动检测</td></tr>
<tr><td style="text-align:center">度量类型</td><td style="text-align:center">相似度测量方法</td><td style="text-align:center">常用 L2（欧氏距离）或 IP（内积）</td></tr>
<tr><td style="text-align:center">训练文件名</td><td style="text-align:center">训练集文件名（不带 .parquet 扩展名）</td><td style="text-align:center">如果<code translate="no">train.parquet</code> ，则填写<code translate="no">train</code> 。多个文件使用逗号分隔，如<code translate="no">train1,train2</code></td></tr>
<tr><td style="text-align:center">测试文件名</td><td style="text-align:center">查询集文件名（不带 .parquet 扩展名）</td><td style="text-align:center">如果<code translate="no">test.parquet</code> ，则填写<code translate="no">test</code></td></tr>
<tr><td style="text-align:center">地面实况文件名</td><td style="text-align:center">地面实况文件名（不带 .parquet 扩展名）</td><td style="text-align:center">如果<code translate="no">neighbors.parquet</code> ，请填写<code translate="no">neighbors</code></td></tr>
<tr><td style="text-align:center">训练 ID 名称</td><td style="text-align:center">训练数据 ID 列名称</td><td style="text-align:center">通常<code translate="no">id</code></td></tr>
<tr><td style="text-align:center">train emb 名称</td><td style="text-align:center">训练数据向量列名</td><td style="text-align:center">如果脚本生成的列名为<code translate="no">emb</code> ，则填写<code translate="no">emb</code></td></tr>
<tr><td style="text-align:center">test emb 名称</td><td style="text-align:center">测试数据向量列名</td><td style="text-align:center">通常与 train emb 名称相同，例如<code translate="no">emb</code></td></tr>
<tr><td style="text-align:center">地面实况 emb 名称</td><td style="text-align:center">地面实况中的最近邻列名</td><td style="text-align:center">如果列名为<code translate="no">neighbors_id</code> ，则填写<code translate="no">neighbors_id</code></td></tr>
<tr><td style="text-align:center">标量标签文件名</td><td style="text-align:center">(可选）标签文件名（不带 .parquet 扩展名）</td><td style="text-align:center">如果生成了<code translate="no">scalar_labels.parquet</code> ，则填写<code translate="no">scalar_labels</code> ，否则留空</td></tr>
<tr><td style="text-align:center">标签百分比</td><td style="text-align:center">(可选） 标签过滤比率</td><td style="text-align:center">例如，<code translate="no">0.001</code>,<code translate="no">0.02</code>,<code translate="no">0.5</code>, 如果不需要标签过滤，则留空</td></tr>
<tr><td style="text-align:center">描述</td><td style="text-align:center">数据集描述</td><td style="text-align:center">不能注明业务上下文或生成方法</td></tr>
</tbody>
</table>
<p>保存配置，继续进行测试设置。</p>
<h3 id="Test-Execution-and-Database-Configuration" class="common-anchor-header">测试执行和数据库配置</h3><p>访问测试配置界面：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_3ecdcb1034.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>数据库选择和配置（以 Milvus 为例）：</strong>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_356a2d8c39.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>数据集分配：</strong>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/9_dataset_assignment_85ba7b24ca.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>测试元数据和标签</strong>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/10_test_metadata_and_labeling_293f6f2b99.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>测试执行</strong>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_test_execution_76acb42c98.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Results-Analysis-and-Performance-Evaluation" class="common-anchor-header">结果分析和性能评估<button data-href="#Results-Analysis-and-Performance-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>结果界面提供全面的性能分析：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_993c536c20.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Test-Configuration-Summary" class="common-anchor-header">测试配置摘要</h3><p>评估测试了 1、5 和 10 个并发操作的并发级别（受可用硬件资源限制）、768 个向量维度、3,000 个训练向量和 3,000 次测试查询的数据集大小，本次测试运行禁用了标量标签过滤。</p>
<h3 id="Critical-Implementation-Considerations" class="common-anchor-header">关键实施考虑因素</h3><ul>
<li><p><strong>维度一致性：</strong>训练数据集和测试数据集之间的向量维度不匹配会导致测试立即失败。请在数据准备过程中验证维度一致性，以避免运行时出错。</p></li>
<li><p><strong>地面实况准确性：</strong>不正确的地面实况计算会使召回率测量失效。提供的转换脚本使用带有 L2 距离的 FAISS 进行精确近邻计算，确保参考结果的准确性。</p></li>
<li><p><strong>数据集规模要求：</strong>小数据集（低于 10,000 个向量）可能会因负载生成不足而产生不一致的 QPS 测量结果。请考虑扩大数据集规模，以进行更可靠的吞吐量测试。</p></li>
<li><p><strong>资源分配：</strong>Docker 容器的内存和 CPU 限制会在测试过程中人为限制数据库性能。监控资源利用率，并根据需要调整容器限制，以实现准确的性能测量。</p></li>
<li><p><strong>错误监控：</strong> <strong>VDBBench</strong>可能会将错误记录到控制台输出中，而这些错误不会出现在 Web 界面中。请在测试执行期间监控终端日志，以获取完整的诊断信息。</p></li>
</ul>
<h2 id="Supplemental-Tools-Test-Data-Generation" class="common-anchor-header">补充工具：测试数据生成<button data-href="#Supplemental-Tools-Test-Data-Generation" class="anchor-icon" translate="no">
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
    </button></h2><p>对于开发和标准化测试场景，您可以生成具有受控特征的合成数据集：</p>
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
<p>该实用程序可生成具有指定尺寸和记录数的数据集，用于原型开发和基线测试场景。</p>
<h2 id="Conclusion" class="common-anchor-header">结论<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>您刚刚了解了如何摆脱 "基准剧场 "的束缚，这种束缚曾误导了无数的向量数据库决策。有了 VDBBench 和您自己的数据集，您就可以生成生产级的 QPS、延迟和召回指标，而不再需要从几十年前的学术数据中进行猜测。</p>
<p>不再依赖与实际工作负载毫无关系的罐装基准。只需几小时，而不是几周，您就能准确了解数据库在使用<em>您的</em>向量、查询和约束条件时<em>的</em>性能。这意味着您可以自信地做出决定，避免日后痛苦的重写，并开发出能在生产中实际运行的系统。</p>
<ul>
<li><p>使用您的工作负载试用 VDBBench<a href="https://github.com/zilliztech/VectorDBBench">：https://github.com/zilliztech/VectorDBBench</a></p></li>
<li><p>查看主要向量数据库的测试结果：<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch&amp;__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1755165753372.1755169827021.775&amp;__hssc=175614333.3.1755169827021&amp;__hsfp=1940526538">VDBBench 排行榜</a></p></li>
</ul>
<p>有问题或想分享您的结果？加入<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a>上的对话或在<a href="https://discord.com/invite/FG6hMJStWu">Discord</a> 上与我们的社区联系。</p>
<hr>
<p><em>这是我们的《VectorDB POC 指南》系列的第一篇文章--经过开发人员亲身测试的方法，用于构建在真实世界压力下运行的人工智能基础架构。更多内容，敬请期待！</em></p>
