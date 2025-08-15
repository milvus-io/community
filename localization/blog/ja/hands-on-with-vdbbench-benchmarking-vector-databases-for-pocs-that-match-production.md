---
id: >-
  hands-on-with-vdbbench-benchmarking-vector-databases-for-pocs-that-match-production.md
title: VDBBenchのハンズオン：ベクターデータベースのベンチマークで本番と同じPOCを実現
author: Yifan Cai
date: 2025-08-15T00:00:00.000Z
desc: >-
  VDBBenchを使用して、実際のプロダクションデータでベクターデータベースをテストする方法を学びます。実際のパフォーマンスを予測するカスタムデータセットPOCのステップバイステップガイド。
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
<p>ベクターデータベースは今やAIインフラストラクチャの中核であり、カスタマーサービス、コンテンツ生成、検索、レコメンデーションなど、様々なLLM搭載アプリケーションを強力にサポートしている。</p>
<p>MilvusやZilliz Cloudのような専用に構築されたベクターデータベースから、ベクター検索をアドオンとして備えた従来のデータベースまで、市場には非常に多くの選択肢があるため、<strong>適切なものを選ぶのはベンチマークチャートを読むほど単純ではない。</strong></p>
<p>ほとんどのチームは、契約する前に概念実証（POC）を実行する。これは理論的には賢明なことだが、実際には、紙の上では印象的に見えるベンダーのベンチマークの多くが、実際の条件下では破綻する。</p>
<p>主な理由の1つは、性能の主張のほとんどが、2006年から2012年の古いデータセット（SIFT、GloVe、LAION）に基づいていることです。例えば、SIFTは128次元のベクトルを使用しているが、今日のAIモデルははるかに高い次元（OpenAIの最新モデルでは3,072、Cohereのモデルでは1,024）を生成する。</p>
<h2 id="The-Fix-Test-with-Your-Data-Not-Canned-Benchmarks" class="common-anchor-header">解決策：定型のベンチマークではなく、自社のデータでテストする<button data-href="#The-Fix-Test-with-Your-Data-Not-Canned-Benchmarks" class="anchor-icon" translate="no">
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
    </button></h2><p>最もシンプルで効果的な解決策は、アプリケーションが実際に生成したベクトルでPOC評価を実行することです。つまり、組み込みモデル、実際のクエリー、実際のデータ分布を使用することです。</p>
<p>オープンソースのベクトルデータベースベンチマークツールである<a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md"><strong>VDBBenchは</strong></a>、まさにこのために構築されました。Milvus、Elasticsearch、pgvectorなどを含むあらゆるベクトルデータベースの評価と比較をサポートし、実際のプロダクションワークロードをシミュレートします。</p>
<p><a href="https://github.com/zilliztech/VectorDBBench">VDBBench 1.0 をダウンロード →</a>｜<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch&amp;__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1755165753372.1755169827021.775&amp;__hssc=175614333.3.1755169827021&amp;__hsfp=1940526538"> リーダーボードを見る →</a>｜<a href="https://milvus.io/blog/vdbbench-1-0-benchmarking-with-your-real-world-production-workloads.md">VDBBenchとは</a>？</p>
<p>VDBbenchは以下を可能にします：</p>
<ul>
<li><p>エンベッディングモデルから<strong>独自のデータでテスト</strong></p></li>
<li><p><strong>コンカレントインサート、クエリ、ストリーミングインジェストの</strong>シミュレーション</p></li>
<li><p><strong>P95/P99のレイテンシ、持続的なスループット、およびリコール精度の</strong>測定</p></li>
<li><p>複数のデータベースを同一条件でベンチマーク</p></li>
<li><p><strong>カスタムデータセットのテストが</strong>可能なため、実運用に近い結果を得ることができます。</p></li>
</ul>
<p>次に、VDBBenchと実データを使用して本番レベルのPOCを実行する方法を説明します。</p>
<h2 id="How-to-Evaluate-VectorDBs-with-Your-Custom-Datasets-with-VDBBench" class="common-anchor-header">VDBBenchでカスタムデータセットを使ってVectorDBを評価する方法<button data-href="#How-to-Evaluate-VectorDBs-with-Your-Custom-Datasets-with-VDBBench" class="anchor-icon" translate="no">
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
    </button></h2><p>始める前に、Python 3.11以上がインストールされていることを確認してください。CSVまたはNPY形式のベクトルデータ、セットアップとテストに約2-3時間、必要に応じてトラブルシューティングのための中級Python知識が必要です。</p>
<h3 id="Installation-and-Configuration" class="common-anchor-header">インストールと設定</h3><p>1つのデータベースを評価する場合は、このコマンドを実行します：</p>
<pre><code translate="no">pip install vectordb-bench
<button class="copy-code-btn"></button></code></pre>
<p>サポートされているすべてのデータベースを比較する場合は、このコマンドを実行してください：</p>
<pre><code translate="no">pip install vectordb-bench[<span class="hljs-built_in">all</span>]
<button class="copy-code-btn"></button></code></pre>
<p>特定のデータベースクライアント（例：Elasticsearch）の場合：</p>
<pre><code translate="no">pip install vectordb-bench[elastic]
<button class="copy-code-btn"></button></code></pre>
<p>サポートされているすべてのデータベースとそのインストールコマンドについては、こちらの<a href="https://github.com/zilliztech/VectorDBBench">GitHub ページを</a>確認してください。</p>
<h3 id="Launching-VDBBench" class="common-anchor-header">VDBBenchの起動</h3><p>で<strong>VDBBench を</strong>起動する：</p>
<pre><code translate="no">init_bench
<button class="copy-code-btn"></button></code></pre>
<p>期待されるコンソール出力 
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_expected_console_output_66e1a218b7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Webインターフェースはローカルで利用可能になります：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_2e4dd7ea69.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Data-Preparation-and-Format-Conversion" class="common-anchor-header">データの準備とフォーマット変換</h3><p>VDBBench は，異なるデータベースやデータセット間で一貫したテストを行うために，特定のスキーマを持つ構造化 Parquet ファイルを必要とします．</p>
<table>
<thead>
<tr><th style="text-align:center"><strong>ファイル名</strong></th><th style="text-align:center"><strong>目的</strong></th><th style="text-align:center"><strong>必須</strong></th><th style="text-align:center"><strong>内容 例</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">train.parquet</td><td style="text-align:center">データベース挿入用のベクトルコレクション</td><td style="text-align:center">✅</td><td style="text-align:center">ベクトルID + ベクトルデータ (list[float])</td></tr>
<tr><td style="text-align:center">test.parquet</td><td style="text-align:center">クエリ用ベクターコレクション</td><td style="text-align:center">✅</td><td style="text-align:center">ベクトルID + ベクトルデータ (list[float])</td></tr>
<tr><td style="text-align:center">ネイバーズ.parquet</td><td style="text-align:center">クエリベクトルのグランドトゥルース（実際の最近傍IDリスト）</td><td style="text-align:center">✅</td><td style="text-align:center">query_id -&gt; [top_k 近似IDリスト].</td></tr>
<tr><td style="text-align:center">scalar_labels.parquet</td><td style="text-align:center">ラベル（ベクトル以外のエンティティを記述するメタデータ）</td><td style="text-align:center">❌</td><td style="text-align:center">id -&gt; ラベル</td></tr>
</tbody>
</table>
<p>必須ファイル仕様：</p>
<ul>
<li><p><strong>トレーニングベクターファイル（train.parquet）には</strong>、インクリメンタルな整数を含むID列と、float32配列を含むvector列が必要です。カラム名は設定可能ですが、IDカラムは適切なインデックスのために整数型を使用する必要があります。</p></li>
<li><p><strong>テストベクターファイル（test.parquet）は</strong>トレーニングデータと同じ構造に従います。ID列名は "id "でなければなりませんが、ベクトル列名はデータスキーマに合わせてカスタマイズすることができます。</p></li>
<li><p><strong>Ground Truth File (neighbers.parquet)</strong>には各テストクエリの参照最近傍データが含まれます。テストベクターIDに対応するIDカラムと、トレーニングセットからの正しい最近傍IDを含む近傍配列カラムが必要です。</p></li>
<li><p><strong>スカラーラベルファイル（scalar_labels.parquet</strong>）はオプションで、トレーニングベクトルに関連するメタデータのラベルが含まれています。</p></li>
</ul>
<h3 id="Data-Format-Challenges" class="common-anchor-header">データフォーマットの課題</h3><p>ほとんどのプロダクションベクターデータはVDBBenchの要件に直接マッチしないフォーマットで存在します。CSVファイルは一般的にエンベッディングを配列の文字列表現として保存し、NPYファイルはメタデータのない生の数値行列を含み、データベースエクスポートはしばしばJSONや他の構造化フォーマットを使用します。</p>
<p>これらのフォーマットを手動で変換するには、文字列表現を数値配列にパースする、FAISSのようなライブラリを使用して正確な最近傍を計算する、IDの一貫性を維持しながらデータセットを適切に分割する、すべてのデータ型がParquetの仕様に適合していることを確認するなど、いくつかの複雑なステップが必要です。</p>
<h3 id="Automated-Format-Conversion" class="common-anchor-header">フォーマット変換の自動化</h3><p>変換プロセスを効率化するために、フォーマット変換、グランドトゥルース計算、適切なデータ構造化を自動的に行うPythonスクリプトを開発しました。</p>
<p><strong>CSV入力フォーマット</strong></p>
<pre><code translate="no"><span class="hljs-built_in">id</span>,emb,label
<span class="hljs-number">1</span>,<span class="hljs-string">&quot;[0.12,0.56,0.89,...]&quot;</span>,A
<span class="hljs-number">2</span>,<span class="hljs-string">&quot;[0.33,0.48,0.90,...]&quot;</span>,B
<button class="copy-code-btn"></button></code></pre>
<p><strong>NPY入力フォーマット</strong></p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
vectors = np.<span class="hljs-property">random</span>.<span class="hljs-title function_">rand</span>(<span class="hljs-number">10000</span>, <span class="hljs-number">768</span>).<span class="hljs-title function_">astype</span>(<span class="hljs-string">&#x27;float32&#x27;</span>)
np.<span class="hljs-title function_">save</span>(<span class="hljs-string">&quot;vectors.npy&quot;</span>, vectors)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Conversion-Script-Implementation" class="common-anchor-header">変換スクリプトの実装</h3><p><strong>必要な依存関係をインストールする：</strong></p>
<pre><code translate="no">pip install numpy pandas faiss-cpu
<button class="copy-code-btn"></button></code></pre>
<p><strong>変換を実行する：</strong></p>
<pre><code translate="no">python convert_to_vdb_format.py \
  --train data/train.csv \
  --<span class="hljs-built_in">test</span> data/test.csv \
  --out datasets/custom \
  --topk 10
<button class="copy-code-btn"></button></code></pre>
<p><strong>パラメータ参照：</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>パラメータ名</strong></th><th style="text-align:center"><strong>必須</strong></th><th style="text-align:center"><strong>タイプ</strong></th><th style="text-align:center"><strong>説明</strong></th><th style="text-align:center"><strong>デフォルト値</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><code translate="no">--train</code></td><td style="text-align:center">はい</td><td style="text-align:center">文字列</td><td style="text-align:center">CSVまたはNPY形式をサポートするトレーニングデータのパス。CSVはembカラムを含む必要があり、idカラムがない場合は自動生成される。</td><td style="text-align:center">なし</td></tr>
<tr><td style="text-align:center"><code translate="no">--test</code></td><td style="text-align:center">なし</td><td style="text-align:center">文字列</td><td style="text-align:center">クエリデータパス、CSVまたはNPY形式をサポート。トレーニングデータと同じ形式</td><td style="text-align:center">なし</td></tr>
<tr><td style="text-align:center"><code translate="no">--out</code></td><td style="text-align:center">なし</td><td style="text-align:center">文字列</td><td style="text-align:center">出力ディレクトリパス、変換されたパーケットファイルと近傍インデックスファイルを保存</td><td style="text-align:center">なし</td></tr>
<tr><td style="text-align:center"><code translate="no">--labels</code></td><td style="text-align:center">なし</td><td style="text-align:center">文字列</td><td style="text-align:center">ラベルCSVパス、ラベル列（文字列配列としてフォーマット）を含む必要がある。</td><td style="text-align:center">なし</td></tr>
<tr><td style="text-align:center"><code translate="no">--topk</code></td><td style="text-align:center">なし</td><td style="text-align:center">整数</td><td style="text-align:center">計算時に返す最近傍の数</td><td style="text-align:center">10</td></tr>
</tbody>
</table>
<p><strong>出力ディレクトリ構造：</strong></p>
<pre><code translate="no">datasets/custom/
├── train.parquet        <span class="hljs-comment"># Training vectors</span>
├── test.parquet         <span class="hljs-comment"># Query vectors  </span>
├── neighbors.parquet    <span class="hljs-comment"># Ground Truth</span>
└── scalar_labels.parquet <span class="hljs-comment"># Optional scalar labels</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Complete-Conversion-Script" class="common-anchor-header">完全な変換スクリプト</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os
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
<p><strong>変換処理の出力</strong>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_conversion_process_output_0827ba75c9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>生成ファイルの検証</strong>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_f02cd2964e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Custom-Dataset-Configuration" class="common-anchor-header">カスタム・データセットの構成</h3><p>Webインタフェースのカスタム・データセット設定セクションに移動します：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_aa14b75b5d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>この設定インターフェイスには、データセットのメタデータとファイル・パス指定のためのフィールドがあります：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_1b64832990.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>設定パラメータ</strong></p>
<table>
<thead>
<tr><th style="text-align:center"><strong>パラメータ名</strong></th><th style="text-align:center"><strong>意味</strong></th><th style="text-align:center"><strong>構成に関する提案</strong></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center">名前</td><td style="text-align:center">データセット名（一意識別子）</td><td style="text-align:center">任意の名前、<code translate="no">my_custom_dataset</code></td></tr>
<tr><td style="text-align:center">フォルダパス</td><td style="text-align:center">データセット・ファイルのディレクトリ・パス</td><td style="text-align:center">例<code translate="no">/data/datasets/custom</code></td></tr>
<tr><td style="text-align:center">次元</td><td style="text-align:center">ベクトル寸法</td><td style="text-align:center">データファイルと一致しなければならない。</td></tr>
<tr><td style="text-align:center">サイズ</td><td style="text-align:center">ベクトル数（オプション）</td><td style="text-align:center">空のままでも可、システムが自動検出する</td></tr>
<tr><td style="text-align:center">メトリックタイプ</td><td style="text-align:center">類似度の測定方法</td><td style="text-align:center">一般的にはL2（ユークリッド距離）またはIP（内積）を使用</td></tr>
<tr><td style="text-align:center">訓練ファイル名</td><td style="text-align:center">トレーニングセットのファイル名（拡張子.parquetなし）</td><td style="text-align:center"><code translate="no">train.parquet</code> の場合，<code translate="no">train</code> を埋める．複数のファイルを使用する場合は，カンマで区切る．<code translate="no">train1,train2</code></td></tr>
<tr><td style="text-align:center">test ファイル名</td><td style="text-align:center">クエリセットのファイル名（.parquet拡張子なし）</td><td style="text-align:center"><code translate="no">test.parquet</code> の場合<code translate="no">test</code></td></tr>
<tr><td style="text-align:center">グランドトゥルースファイル名</td><td style="text-align:center">グランドトゥルースファイル名（.parquet拡張子なし）</td><td style="text-align:center"><code translate="no">neighbors.parquet</code> の場合<code translate="no">neighbors</code></td></tr>
<tr><td style="text-align:center">トレーニングID名</td><td style="text-align:center">トレーニングデータID列名</td><td style="text-align:center">通常は<code translate="no">id</code></td></tr>
<tr><td style="text-align:center">訓練エンベロープ名</td><td style="text-align:center">トレーニングデータのベクトル列名</td><td style="text-align:center">スクリプトが生成したカラム名が<code translate="no">emb</code> の場合<code translate="no">emb</code></td></tr>
<tr><td style="text-align:center">test emb name</td><td style="text-align:center">テストデータ・ベクトルの列名</td><td style="text-align:center">通常はtrain emb nameと同じ、<code translate="no">emb</code></td></tr>
<tr><td style="text-align:center">グランドトゥルースemb name</td><td style="text-align:center">グラウンドトゥルースの最近傍列名</td><td style="text-align:center">カラム名が<code translate="no">neighbors_id</code> の場合<code translate="no">neighbors_id</code></td></tr>
<tr><td style="text-align:center">スカラーラベルファイル名</td><td style="text-align:center">(オプション) ラベルファイル名 (拡張子 .parquet なし)</td><td style="text-align:center"><code translate="no">scalar_labels.parquet</code> が生成された場合、<code translate="no">scalar_labels</code> を埋める。</td></tr>
<tr><td style="text-align:center">ラベルパーセンテージ</td><td style="text-align:center">(オプション) ラベルフィルター比率</td><td style="text-align:center">例：<code translate="no">0.001</code>,<code translate="no">0.02</code>,<code translate="no">0.5</code>, ラベルフィルターが必要ない場合は空白のまま</td></tr>
<tr><td style="text-align:center">説明</td><td style="text-align:center">データセットの説明</td><td style="text-align:center">ビジネス・コンテキストまたは生成方法を注記できない</td></tr>
</tbody>
</table>
<p>設定を保存して、テストのセットアップを続行します。</p>
<h3 id="Test-Execution-and-Database-Configuration" class="common-anchor-header">テストの実行とデータベース構成</h3><p>テスト設定インターフェイスにアクセスします：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_3ecdcb1034.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>データベースの選択と構成（例として milvus）：</strong>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_356a2d8c39.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>データセットの割り当て</strong>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/9_dataset_assignment_85ba7b24ca.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>メタデータとラベリングのテスト：</strong>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/10_test_metadata_and_labeling_293f6f2b99.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>テストの実行</strong>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_test_execution_76acb42c98.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Results-Analysis-and-Performance-Evaluation" class="common-anchor-header">結果分析とパフォーマンス評価<button data-href="#Results-Analysis-and-Performance-Evaluation" class="anchor-icon" translate="no">
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
    </button></h2><p>結果インターフェースは、包括的なパフォーマンス分析を提供します：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_993c536c20.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Test-Configuration-Summary" class="common-anchor-header">テスト構成の概要</h3><p>評価では、同時実行レベル1、5、10（利用可能なハードウェアリソースによる制約）、ベクトル次元768、データセットサイズ3,000トレーニングベクトル、3,000テストクエリをテストし、このテスト実行ではスカラーラベルフィルタリングを無効にした。</p>
<h3 id="Critical-Implementation-Considerations" class="common-anchor-header">実装上の重要な考慮事項</h3><ul>
<li><p><strong>次元の整合性：</strong>トレーニング・データセットとテスト・データセット間のベクトル次元の不一致は、即座にテスト失敗の原因となる。ランタイムエラーを避けるため、データ準備時に次元の整合を検証する。</p></li>
<li><p><strong>グランド・トゥルースの精度：</strong>グランド・トゥルースの計算が正しくないと、再現率の測定が無効になります。提供される変換スクリプトは、正確な最近傍計算のためにL2距離を持つFAISSを使用し、正確な参照結果を保証します。</p></li>
<li><p><strong>データセット規模の要件：</strong>小さなデータセット（10,000ベクトル以下）では、負荷生成が不十分なため、一貫性のないQPS測定が行われることがあります。より信頼性の高いスループット・テストを行うには、データセット・サイズの拡張を検討してください。</p></li>
<li><p><strong>リソース割り当て：</strong>DockerコンテナのメモリとCPUの制約により、テスト中にデータベースのパフォーマンスが人為的に制限されることがあります。リソースの利用状況を監視し、必要に応じてコンテナの制限を調整することで、正確なパフォーマンス計測が可能になります。</p></li>
<li><p><strong>エラーモニタリング：</strong> <strong>VDBBenchは</strong>ウェブインタフェースには表示されないエラーをコンソール出力に記録することがあります。テスト実行中のターミナルログを監視し、完全な診断情報を得ることができます。</p></li>
</ul>
<h2 id="Supplemental-Tools-Test-Data-Generation" class="common-anchor-header">補足ツールテストデータ生成<button data-href="#Supplemental-Tools-Test-Data-Generation" class="anchor-icon" translate="no">
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
    </button></h2><p>開発および標準化されたテストシナリオのために、制御された特性を持つ合成データセットを生成することができます：</p>
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
<p>このユーティリティは、プロトタイピングおよびベースライン テスト シナリオ用に、指定された寸法とレコード数を持つデータセットを生成します。</p>
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
    </button></h2><p>ベクターデータベースの決定を惑わす "ベンチマーク劇場 "から解放される方法を学びました。VDBBenchとあなた自身のデータセットがあれば、プロダクショングレードのQPS、レイテンシ、リコールメトリックスを生成することができます。</p>
<p>実際のワークロードとは全く関係のない定型のベンチマークに頼る必要はありません。数週間ではなくわずか数時間で、<em>お客様の</em>ベクトル、クエリ、<em>制約を</em>使用してデータベースがどのように動作するかを正確に確認できます。つまり、自信を持って決断を下し、後で手間のかかる書き換えを回避し、本番で実際に動作するシステムを出荷することができるのです。</p>
<ul>
<li><p>あなたのワークロードでVDBBenchをお試し<a href="https://github.com/zilliztech/VectorDBBench">ください: https://github.com/zilliztech/VectorDBBench</a></p></li>
<li><p>主要なベクトルデータベースのテスト結果を見る：<a href="https://zilliz.com/vdbbench-leaderboard?dataset=vectorSearch&amp;__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1755165753372.1755169827021.775&amp;__hssc=175614333.3.1755169827021&amp;__hsfp=1940526538">VDBBench Leaderboard</a></p></li>
</ul>
<p>ご質問や結果を共有したいですか？<a href="https://github.com/zilliztech/VectorDBBench"> GitHub</a>で会話に参加するか、<a href="https://discord.com/invite/FG6hMJStWu">Discord</a> で私たちのコミュニティに接続してください。</p>
<hr>
<p><em>これは、VectorDB POCガイドシリーズの最初の投稿です-実世界のプレッシャーの下でパフォーマンスを発揮するAIインフラストラクチャを構築するための、開発者がテストしたハンズオン手法です。今後もお楽しみに！</em></p>
