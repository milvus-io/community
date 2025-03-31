---
id: deepseek-v3-0324-minor-update-thats-crushing-top-ai-models.md
title: DeepSeek V3-0324：トップAIモデルを粉砕する "マイナー・アップデート"
author: Lumina Wang
date: 2025-03-25T00:00:00.000Z
desc: >-
  DeepSeek
  v3-0324は、より大きなパラメータで学習され、より長いコンテキストウィンドウを持ち、推論、コーディング、および数学の機能が強化されています。
cover: >-
  assets.zilliz.com/Deep_Seek_V3_0324_The_Minor_Update_That_s_Crushing_Top_AI_Models_391585994c.png
tag: Engineering
tags: 'DeepSeek V3-0324, DeepSeek V3, Milvus, RAG'
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/deepseek-v3-0324-minor-update-thats-crushing-top-ai-models.md
---
<p>DeepSeekは昨晩、ひっそりと爆弾発言をした。彼らの最新リリースである<a href="https://huggingface.co/deepseek-ai/DeepSeek-V3-0324"> DeepSeek v3-0324は</a>、公式発表ではAPIに変更のない単なる<strong>「マイナー・アップグレード」</strong>であると軽視されていた。このアップデートは、特に論理的推論、プログラミング、数学的問題解決におけるパフォーマンスの飛躍的な向上を意味する。</p>
<p>このアップデートは、特に論理的推論、プログラミング、数学的問題解決におけるパフォーマンスの飛躍的な向上を意味します。しかもオープンソースです。</p>
<p><strong>このリリースは、AIを搭載したアプリケーションを構築する開発者や企業にとって、早急な注目に値するものです。</strong></p>
<h2 id="Whats-New-in-DeepSeek-v3-0324-and-How-Good-Is-It-Really" class="common-anchor-header">DeepSeek v3-0324の新機能とその実力は？<button data-href="#Whats-New-in-DeepSeek-v3-0324-and-How-Good-Is-It-Really" class="anchor-icon" translate="no">
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
    </button></h2><p>DeepSeek v3-0324は、その前身である<a href="https://zilliz.com/blog/why-deepseek-v3-is-taking-the-ai-world-by-storm">DeepSeek v</a>3と比較して、3つの大きな改善を導入しています：</p>
<ul>
<li><p><strong>より大規模なモデル、より強力なパワー:</strong>パラメータ数が6710億から6850億に増加し、モデルがより複雑な推論を処理し、より微妙な応答を生成できるようになりました。</p></li>
<li><p><strong>膨大なコンテキスト・ウィンドウ：</strong>128K トークンのコンテキスト長がアップグレードされた DeepSeek v3-0324 は、1 回のクエリで大幅に多くの情報を保持および処理できるため、長文の会話、文書分析、検索ベースの AI アプリケーションに最適です。</p></li>
<li><p><strong>推論、コーディング、数学の強化：</strong>今回のアップデートにより、ロジック、プログラミング、数学的能力が顕著に向上し、AIによるコーディング、科学研究、企業レベルの問題解決において強力な候補となる。</p></li>
</ul>
<p>しかし、生の数字がすべてを物語っているわけではない。真に印象的なのは、ディープシークが推論能力と生成効率を同時に高めることに成功したことである。</p>
<h3 id="The-Secret-Sauce-Architectural-Innovation" class="common-anchor-header">秘密のソース：アーキテクチャの革新</h3><p>DeepSeek v3-0324は、推論中のメモリ使用量と計算オーバーヘッドを削減するために、潜在ベクトルを使用してキー・バリュー（KV）キャッシュを圧縮する効率的なメカニズムである<a href="https://arxiv.org/abs/2502.07864">Multi-head Latent Attention（MLA） </a>アーキテクチャを維持しています。さらに、従来の<a href="https://zilliz.com/glossary/feedforward-neural-networks-(fnn)">Feed-Forward Networks（FFN</a>）をMixture of Experts<a href="https://zilliz.com/learn/what-is-mixture-of-experts">（MoE</a>）レイヤーに置き換え、各トークンに対して最適なエキスパートを動的にアクティブにすることで、計算効率を最適化している。</p>
<p>しかし、最もエキサイティングなアップグレードは<strong>マルチトークン予測（MTP）</strong>であり、各トークンが将来の複数のトークンを同時に予測できるようになりました。これは従来の自己回帰モデルにおける重要なボトルネックを克服し、精度と推論速度の両方を向上させる。</p>
<p>これらの技術革新により、単に拡張性が高いだけでなく、インテリジェントに拡張できるモデルが生まれ、より多くの開発チームがプロ級のAI機能を利用できるようになりました。</p>
<h2 id="Build-a-RAG-System-with-Milvus-and-DeepSeek-v3-0324-in-5-Minutes" class="common-anchor-header">MilvusとDeepSeek v3-0324でRAGシステムを5分で構築<button data-href="#Build-a-RAG-System-with-Milvus-and-DeepSeek-v3-0324-in-5-Minutes" class="anchor-icon" translate="no">
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
    </button></h2><p>DeepSeek v3-0324の強力な推論機能は、RAG (Retrieval-Augmented Generation) システムに最適です。このチュートリアルでは、DeepSeek v3-0324と<a href="https://zilliz.com/what-is-milvus">Milvus</a>ベクトルデータベースを使用して、完全なRAGパイプラインをわずか5分で構築する方法を紹介します。最小限のセットアップで効率的に知識を取得し、合成する方法を学びます。</p>
<h3 id="Setting-Up-Your-Environment" class="common-anchor-header">環境のセットアップ</h3><p>まず、必要な依存関係をインストールしましょう：</p>
<pre><code translate="no">! pip install --upgrade pymilvus[model] openai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p><strong>注：</strong>Google Colabを使用している場合、これらのパッケージをインストールした後、ランタイムを再起動する必要があります。画面上部の "Runtime" メニューをクリックし、ドロップダウンメニューから "Restart session" を選択します。</p>
<p>DeepSeek は OpenAI 互換の API を提供しているため、API キーが必要です。API キーは、<a href="https://platform.deepseek.com/api_keys"> DeepSeek プラットフォームに</a>サインアップすることで取得できます：</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os

os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;DEEPSEEK_API_KEY&quot;</span>] = <span class="hljs-string">&quot;***********&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-Your-Data" class="common-anchor-header">データの準備</h3><p>このチュートリアルでは、<a href="https://github.com/milvus-io/milvus-docs/releases/download/v2.4.6-preview/milvus_docs_2.4.x_en.zip">Milvus ドキュメント 2.4.x</a>の FAQ ページをナレッジソースとして使用します：</p>
<pre><code translate="no">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>それでは、マークダウン・ファイルから FAQ コンテンツをロードして準備します：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob

<span class="hljs-comment"># Load all markdown files from the FAQ directory</span>
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
        <span class="hljs-comment"># Split on headings to separate content sections</span>
        text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Setting-Up-the-Language-and-Embedding-Models" class="common-anchor-header">言語の設定とモデルの埋め込み</h3><p><a href="https://openrouter.ai/">OpenRouter を</a>使用して DeepSeek v3-0324 にアクセスします。OpenRouterは、DeepSeekやClaudeなどの複数のAIモデル用の統一されたAPIを提供します。OpenRouterで無料のDeepSeek V3 APIキーを作成することで、簡単にDeepSeek V3 0324を試すことができます。</p>
<p>https://assets.zilliz.com/Setting_Up_the_Language_and_Embedding_Models_8b00595a6b.png</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>

deepseek_client = <span class="hljs-title class_">OpenAI</span>(
   api_key=<span class="hljs-string">&quot;&lt;OPENROUTER_API_KEY&gt;&quot;</span>,
   base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>テキスト埋め込みには、軽量で効果的なMilvusの<a href="https://milvus.io/docs/embeddings.md">組み込み埋め込みモデルを</a>使用します：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> model <span class="hljs-keyword">as</span> milvus_model

<span class="hljs-comment"># Initialize the embedding model</span>
embedding_model = milvus_model.DefaultEmbeddingFunction()

<span class="hljs-comment"># Test the embedding model</span>
test_embedding = embedding_model.encode_queries([<span class="hljs-string">&quot;This is a test&quot;</span>])[<span class="hljs-number">0</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embedding)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Embedding dimension: <span class="hljs-subst">{embedding_dim}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;First 10 values: <span class="hljs-subst">{test_embedding[:<span class="hljs-number">10</span>]}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Creating-a-Milvus-Collection" class="common-anchor-header">Milvusコレクションの作成</h3><p>それでは、Milvusを使ってベクターデータベースをセットアップしましょう：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Initialize Milvus client (using Milvus Lite for simplicity)</span>
milvus_client = MilvusClient(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>

<span class="hljs-comment"># Remove existing collection if it exists</span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)

<span class="hljs-comment"># Create a new collection</span>
milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;IP&quot;</span>,  <span class="hljs-comment"># Inner product distance</span>
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># See https://milvus.io/docs/consistency.md for details</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>Pro Tip</strong>：Pro Tip: 異なるデプロイシナリオのために、Milvusのセットアップを調整することができます：</p>
<ul>
<li><p>ローカル開発の場合：<a href="https://milvus.io/docs/milvus_lite.md">Milvus Liteで</a> <code translate="no">uri=&quot;./milvus.db&quot;</code> 。</p></li>
<li><p>より大きなデータセットの場合：<a href="https://milvus.io/docs/quickstart.md">Docker/Kubernetes</a>経由でMilvusサーバをセットアップして使用する。<code translate="no">uri=&quot;http://localhost:19530&quot;</code></p></li>
<li><p>本番用：クラウドエンドポイントとAPIキーを使用して<a href="https://zilliz.com/cloud"> Zilliz Cloudを</a>使用します。</p></li>
</ul>
<h3 id="Loading-Data-into-Milvus" class="common-anchor-header">Milvusへのデータロード</h3><p>テキストデータを埋め込みデータに変換し、Milvusに保存しましょう：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm

<span class="hljs-comment"># Create embeddings for all text chunks</span>
data = []
doc_embeddings = embedding_model.encode_documents(text_lines)

<span class="hljs-comment"># Create records with IDs, vectors, and text</span>
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})

<span class="hljs-comment"># Insert data into Milvus</span>
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">Creating embeddings:   0%|          | 0/72 [00:00&lt;?, ?it/s]huggingface/tokenizers: The current process just got forked, after parallelism has already been used. Disabling parallelism to avoid deadlocks...
To <span class="hljs-built_in">disable</span> this warning, you can either:
    - Avoid using `tokenizers` before the fork <span class="hljs-keyword">if</span> possible
    - Explicitly <span class="hljs-built_in">set</span> the environment variable TOKENIZERS_PARALLELISM=(<span class="hljs-literal">true</span> | <span class="hljs-literal">false</span>)
Creating embeddings: 100%|██████████| 72/72 [00:00&lt;00:00, 246522.36it/s]





{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-the-RAG-Pipeline" class="common-anchor-header">RAGパイプラインの構築</h3><h4 id="Step-1-Retrieve-Relevant-Information" class="common-anchor-header">ステップ 1: 関連情報の取得</h4><p>一般的な質問でRAGシステムをテストしてみましょう：</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>

<span class="hljs-comment"># Search for relevant information</span>
search_res = milvus_client.search(
    collection_name=collection_name,
    data=embedding_model.encode_queries([question]),  <span class="hljs-comment"># Convert question to embedding</span>
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)

<span class="hljs-comment"># Examine search results</span>
<span class="hljs-keyword">import</span> json
retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](https://min.io/), [AWS S3](https://aws.amazon.com/s3/?nc1=h_ls), [Google Cloud Storage](https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes) (GCS), [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs), [Alibaba Cloud OSS](https://www.alibabacloud.com/product/object-storage-service), and [Tencent Cloud Object Storage](https://www.tencentcloud.com/products/cos) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.6572665572166443</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus flush data?\n\nMilvus returns success when inserted data are loaded to the message queue. However, the data are not yet flushed to the disk. Then Milvus&#x27; data node writes the data in the message queue to persistent storage as incremental logs. If `flush()` is called, the data node is forced to write all data in the message queue to persistent storage immediately.\n\n###&quot;</span>,
        <span class="hljs-number">0.6312146186828613</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6115777492523193</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-2-Generate-a-Response-with-DeepSeek" class="common-anchor-header">ステップ2：DeepSeekで回答を生成する</h4><p>次に、DeepSeekを使用して、取得した情報に基づいてレスポンスを生成します：</p>
<pre><code translate="no"><span class="hljs-comment"># Combine retrieved text chunks</span>
context = <span class="hljs-string">&quot;\n&quot;</span>.join(
    [line_with_distance[<span class="hljs-number">0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)

<span class="hljs-comment"># Define prompts for the language model</span>
SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
&quot;&quot;&quot;</span>

USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.

&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;

&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>

<span class="hljs-comment"># Generate response with DeepSeek</span>
response = deepseek_client.chat.completions.create(
    model=<span class="hljs-string">&quot;deepseek-chat&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)

<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">In Milvus, data <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> two main categories: inserted data <span class="hljs-keyword">and</span> metadata.

<span class="hljs-number">1.</span> **Inserted Data**: This includes vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema. The inserted data <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> incremental logs. Milvus supports various <span class="hljs-built_in">object</span> storage backends <span class="hljs-keyword">for</span> <span class="hljs-keyword">this</span> purpose, such <span class="hljs-keyword">as</span> MinIO, AWS S3, <span class="hljs-function">Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>), Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>).

2. **Metadata**: Metadata <span class="hljs-keyword">is</span> generated within Milvus <span class="hljs-keyword">and</span> <span class="hljs-keyword">is</span> specific to each Milvus module. This metadata <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> etcd, a distributed key-<span class="hljs-keyword">value</span> store.

Additionally, <span class="hljs-keyword">when</span> data <span class="hljs-keyword">is</span> inserted, it <span class="hljs-keyword">is</span> first loaded <span class="hljs-keyword">into</span> a message queue, <span class="hljs-keyword">and</span> Milvus returns success at <span class="hljs-keyword">this</span> stage. The data <span class="hljs-keyword">is</span> then written to persistent storage <span class="hljs-keyword">as</span> incremental logs <span class="hljs-keyword">by</span> the data node. If the `<span class="hljs-title">flush</span>()` function <span class="hljs-keyword">is</span> called, the data node <span class="hljs-keyword">is</span> forced to write all data <span class="hljs-keyword">in</span> the message queue to persistent storage immediately.
</span><button class="copy-code-btn"></button></code></pre>
<p>これで完了です！これで、DeepSeek v3-0324とMilvusを使用した完全なRAGパイプラインの構築が完了しました。このシステムでは、Milvusのドキュメントに基づく質問に、高い精度とコンテキスト認識で回答できるようになりました。</p>
<h2 id="Comparing-DeepSeek-V3-0324-Original-vs-RAG-Enhanced-Version" class="common-anchor-header">DeepSeek-V3-0324の比較：オリジナルとRAG強化バージョンの比較<button data-href="#Comparing-DeepSeek-V3-0324-Original-vs-RAG-Enhanced-Version" class="anchor-icon" translate="no">
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
    </button></h2><p>理論も重要ですが、実際のパフォーマンスが重要です。同じプロンプトで、標準の DeepSeek v3-0324 (「Deep Thinking」は無効) と RAG 拡張バージョンの両方をテストしました：<em>Milvusに関する豪華なウェブサイトを作成するためにHTMLコードを記述してください。</em></p>
<h3 id="Website-Built-with-The-Standard-Models-Output-Code" class="common-anchor-header">標準モデルの出力コードで作られたウェブサイト</h3><p>ウェブサイトはこんな感じだ：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Website_Built_with_The_Standard_Model_s_Output_Code_695902b18a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>ビジュアル的には魅力的だが、内容は一般的な説明に頼っており、Milvusの核となる技術的特徴の多くが欠けている。</p>
<h3 id="Website-Built-with-Code-Generated-by-the-RAG-Enhanced-Version" class="common-anchor-header">RAG強化版で生成されたコードで作られたウェブサイト</h3><p>Milvusをナレッジベースとして統合すると、結果は劇的に変わった：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Website_2_01341c647c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>後者のウェブサイトは、単に見栄えが良くなっただけでなく、Milvusのアーキテクチャ、使用例、技術的優位性を真に理解していることがわかります。</p>
<h2 id="Can-DeepSeek-v3-0324-Replace-Dedicated-Reasoning-Models" class="common-anchor-header">DeepSeek v3-0324は専用の推論モデルを置き換えることができるか？<button data-href="#Can-DeepSeek-v3-0324-Replace-Dedicated-Reasoning-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>DeepSeek v3-0324を、Claude 3.7 SonnetやGPT-4 Turboのような専用の推論モデルと、数学的、論理的、およびコード推論タスクにわたって比較したとき、私たちは最も驚くべき発見をしました。</p>
<p>専用の推論モデルは、マルチステップの問題解決に優れていますが、多くの場合、効率を犠牲にしています。私たちのベンチマークは、推論を多用するモデルが単純なプロンプトを頻繁に過剰分析し、必要以上に2～3倍のトークンを生成し、レイテンシとAPIコストを大幅に増加させることを示しました。</p>
<p>DeepSeek v3-0324 は異なるアプローチを採用しています。論理的な一貫性は同等ですが、簡潔性が著しく高く、多くの場合、40～60%少ないトークンで正しいソリューションを生成します。この効率性は、正確さを犠牲にするものではありません。コード生成テストでは、DeepSeek のソリューションは、推論に特化した競合他社のソリューションと同等またはそれ以上の機能を備えていました。</p>
<p>パフォーマンスと予算制約のバランスを取る開発者にとって、この効率性の優位性は、APIコストの削減と応答時間の短縮に直接つながります。</p>
<h2 id="The-Future-of-AI-Models-Blurring-the-Reasoning-Divide" class="common-anchor-header">AIモデルの未来：推論の溝を埋める<button data-href="#The-Future-of-AI-Models-Blurring-the-Reasoning-Divide" class="anchor-icon" translate="no">
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
    </button></h2><p>DeepSeek v3-0324の性能は、AI業界における中核的な仮定、すなわち推論と効率性は避けられないトレードオフであるという仮定に挑戦しています。このことは、推論モデルと非推論モデルの区別が曖昧になり始める変曲点に近づいている可能性を示唆している。</p>
<p>主要なAIプロバイダーは、最終的にはこの区別を完全になくし、タスクの複雑さに基づいて推論の深さを動的に調整するモデルを開発するかもしれない。このような適応型推論は、計算効率と応答品質の両方を最適化し、AIアプリケーションの構築と展開方法に革命をもたらす可能性がある。</p>
<p>RAGシステムを構築する開発者にとって、この進化は、計算オーバーヘッドなしにプレミアムモデルの推論の深さを提供する、より費用対効果の高いソリューションを約束する。</p>
