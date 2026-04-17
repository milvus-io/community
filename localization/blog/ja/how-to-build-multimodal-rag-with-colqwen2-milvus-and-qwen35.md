---
id: how-to-build-multimodal-rag-with-colqwen2-milvus-and-qwen35.md
title: ColQwen2、Milvus、Qwen3.5を使ったマルチモーダルRAGの構築方法
author: Lumina Wang
date: 2026-3-6
cover: assets.zilliz.com/download_11zon_1862455eb4.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'multimodal RAG, RAG, Milvus, Qwen3.5, vector database'
meta_keywords: 'multimodal RAG, RAG, Milvus, Qwen3.5, vector database'
meta_title: |
  How to Build Multimodal RAG with ColQwen2, Milvus, Qwen3.5
desc: >-
  ColQwen2、Milvus、Qwen3.5を使用して、抽出テキストの代わりにPDFページ画像を検索するマルチモーダルRAGパイプラインを構築します。ステップバイステップのチュートリアル。
origin: >-
  https://milvus.io/blog/how-to-build-multimodal-rag-with-colqwen2-milvus-and-qwen35.md
---
<p>今どきのLLMなら、PDFをアップロードして質問することができる。ほんの一握りの文書なら、それで十分だ。しかし、ほとんどのLLMは数百ページの文脈を上限としているため、大規模なコーパスは単純に収まらない。コーパスが適合する場合でも、すべてのクエリですべてのページを処理することになります。同じ500ページの文書セットについて100の質問をすれば、500ページ分の料金を100回支払うことになる。これはすぐに高くつく。</p>
<p>検索拡張世代（RAG）は、インデックス作成と回答を分離することでこれを解決する。文書を一度エンコードし、その表現をベクターデータベースに格納し、クエリー時に最も関連性の高いページだけを取り出してLLMに送る。このモデルは、コーパス全体ではなく、クエリごとに3ページを読み込む。そのため、増え続けるコレクションに対してドキュメントQ&amp;Aを構築するのに実用的です。</p>
<p>このチュートリアルでは、3つのオープンライセンスのコンポーネントを使ってマルチモーダルRAGパイプラインを構築する手順を説明する：</p>
<ul>
<li><strong><a href="https://huggingface.co/vidore/colqwen2-v1.0-merged">ColQwen2</a></strong> <a href="https://huggingface.co/vidore/colqwen2-v1.0-merged"></a>各PDFページを画像としてマルチベクトル埋め込みにエンコードし、従来のOCRとテキストチャンキングのステップを置き換えます。</li>
<li><strong><a href="http://milvus.io">milvusは</a></strong>これらのベクトルを保存し、クエリ時に類似性検索を行い、最も関連性の高いページのみを取得します。</li>
<li><strong><a href="https://qwen.ai/blog?id=qwen3.5">Qwen3.5-397B-A17Bは</a></strong>、検索されたページ画像を読み取り、その内容に基づいて回答を生成する。</li>
</ul>
<p>最後には、PDFと質問を受け取り、最も関連性の高いページを見つけ、モデルが見たものに基づいた答えを返す、実用的なシステムが完成します。</p>
<h2 id="What-is-Multimodal-RAG" class="common-anchor-header">マルチモーダルRAGとは？<button data-href="#What-is-Multimodal-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>イントロダクションでは、なぜRAGがスケールにおいて重要なのかを説明しました。次の問題は、どのようなRAGが必要かということだ。なぜなら、従来のアプローチには盲点があるからだ。</p>
<p>従来のRAGは、ドキュメントからテキストを抽出し、それをベクトルとして埋め込み、クエリー時に最も近いマッチを検索し、それらのテキストチャンクをLLMに渡す。これは、きれいなフォーマットでテキストが多いコンテンツには効果的だ。しかし、文書に次のようなものが含まれていると、うまくいかない：</p>
<ul>
<li>行、列、ヘッダー間の関係によって意味が決まる表。</li>
<li>図表。情報が完全に視覚的で、テキストに相当するものがない場合。</li>
<li>OCR出力が信頼できない、または不完全なスキャン文書や手書きメモ。</li>
</ul>
<p>マルチモーダルRAGは、テキスト抽出を画像エンコーディングに置き換えます。各ページを画像としてレンダリングし、それを視覚言語モデルでエンコードし、クエリ時にページ画像を取得する。LLMは元のページ（表、図、書式などすべて）を見て、その内容に基づいて回答する。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_5_2f55d33896.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Structure-of-Multimodal-RAG-Pipeline-ColQwen2-for-Encoding-Milvus-for-Search-Qwen35-for-Generation" class="common-anchor-header">マルチモーダルRAGパイプラインの構造：ColQwen2（エンコード）、Milvus（検索）、Qwen3.5（生成<button data-href="#Structure-of-Multimodal-RAG-Pipeline-ColQwen2-for-Encoding-Milvus-for-Search-Qwen35-for-Generation" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-the-Pipeline-Works-httpsassetszillizcomblogColQwen2MilvusQwen35397BA17B284c822b9efpng" class="common-anchor-header">パイプラインの仕組み  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_2_84c822b9ef.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</h3><h3 id="Tech-Stack" class="common-anchor-header">技術スタック</h3><table>
<thead>
<tr><th><strong>コンポーネント</strong></th><th><strong>選択肢</strong></th><th><strong>役割</strong></th></tr>
</thead>
<tbody>
<tr><td>PDF処理</td><td>pdf2image + poppler</td><td>PDFページを高解像度画像としてレンダリング</td></tr>
<tr><td>埋め込みモデル</td><td><a href="https://huggingface.co/vidore/colqwen2-v1.0-merged">colqwen2-v1.0</a></td><td>視覚言語モデル。各ページを755個の128次元パッチベクトルにエンコードする。</td></tr>
<tr><td>ベクトルデータベース</td><td><a href="https://milvus.io/">Milvus Lite</a></td><td>パッチベクタを格納し、類似性検索を行う。</td></tr>
<tr><td>生成モデル</td><td><a href="https://qwen.ai/blog?id=qwen3.5">Qwen3.5-397B-A17B</a></td><td>OpenRouter API経由で呼び出されるマルチモーダルLLM; 取得したページ画像を読み込んで回答を生成する</td></tr>
</tbody>
</table>
<h2 id="Step-by-Step-Implementation-for-Multi-Modal-RAG-with-ColQwen2+-Milvus+-Qwen35-397B-A17B" class="common-anchor-header">ColQwen2+ Milvus+ Qwen3.5-397B-A17BによるマルチモーダルRAGのステップバイステップ実装<button data-href="#Step-by-Step-Implementation-for-Multi-Modal-RAG-with-ColQwen2+-Milvus+-Qwen35-397B-A17B" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Environment-Setup" class="common-anchor-header">環境セットアップ</h3><ol>
<li>Pythonのインストール</li>
</ol>
<pre><code translate="no">pip install colpali-engine pymilvus openai pdf2image torch pillow tqdm
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>PDFレンダリングエンジンPopplerのインストール</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># macOS</span>
brew install poppler

<span class="hljs-comment"># Ubuntu/Debian</span>
sudo apt-get install poppler-utils

<span class="hljs-comment"># Windows: download from https://github.com/oschwartz10612/poppler-windows</span>

<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>埋め込みモデルColQwen2のダウンロード</li>
</ol>
<p>HuggingFaceからvidore/colqwen2-v1.0-mergedをダウンロードし（~4.4GB）、ローカルに保存する：</p>
<pre><code translate="no"><span class="hljs-built_in">mkdir</span> -p ~/models/colqwen2-v1.0-merged
<span class="hljs-comment"># Download all model files to this directory</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>OpenRouter API キーを取得する</li>
</ol>
<p><a href="https://openrouter.ai/settings/keys"></a><a href="https://openrouter.ai/settings/keys">https://openrouter.ai/settings/keys</a> でサインアップしてキーを生成する<a href="https://openrouter.ai/settings/keys">。</a></p>
<h3 id="Step-1-Import-Dependencies-and-Configure" class="common-anchor-header">ステップ 1: 依存関係のインポートと設定</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os, io, base64
<span class="hljs-keyword">import</span> torch
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image
<span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm
<span class="hljs-keyword">from</span> pdf2image <span class="hljs-keyword">import</span> convert_from_path

<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType
<span class="hljs-keyword">from</span> colpali_engine.models <span class="hljs-keyword">import</span> ColQwen2, ColQwen2Processor

<span class="hljs-comment"># --- Configuration ---</span>
EMBED_MODEL = os.path.expanduser(<span class="hljs-string">&quot;~/models/colqwen2-v1.0-merged&quot;</span>)
EMBED_DIM = <span class="hljs-number">128</span>              <span class="hljs-comment"># ColQwen2 output vector dimension</span>
MILVUS_URI = <span class="hljs-string">&quot;./milvus_demo.db&quot;</span>  <span class="hljs-comment"># Milvus Lite local file</span>
COLLECTION = <span class="hljs-string">&quot;doc_patches&quot;</span>
TOP_K = <span class="hljs-number">3</span>                    <span class="hljs-comment"># Number of pages to retrieve</span>
CANDIDATE_PATCHES = <span class="hljs-number">300</span>      <span class="hljs-comment"># Candidate patches per query token</span>

<span class="hljs-comment"># OpenRouter LLM config</span>
OPENROUTER_API_KEY = os.environ.get(
    <span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>,
    <span class="hljs-string">&quot;&lt;your-api-key-here&gt;&quot;</span>,
)
GENERATION_MODEL = <span class="hljs-string">&quot;qwen/qwen3.5-397b-a17b&quot;</span>

<span class="hljs-comment"># Device selection</span>
DEVICE = <span class="hljs-string">&quot;cuda&quot;</span> <span class="hljs-keyword">if</span> torch.cuda.is_available() <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;cpu&quot;</span>
DTYPE = torch.bfloat16 <span class="hljs-keyword">if</span> DEVICE == <span class="hljs-string">&quot;cuda&quot;</span> <span class="hljs-keyword">else</span> torch.float32
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Device: <span class="hljs-subst">{DEVICE}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>出力します：デバイス: cpu</p>
<h3 id="Step-2-Load-the-Embedding-Model" class="common-anchor-header">ステップ2：埋め込みモデルのロード</h3><p><strong>ColQwen</strong>2はビジョン言語モデルであり、文書画像をColBERTスタイルのマルチベクトル表現にエンコードする。各ページは数百の128次元パッチベクトルを生成する。</p>
<pre><code translate="no"><span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Loading embedding model: <span class="hljs-subst">{EMBED_MODEL}</span>&quot;</span>)
emb_model = ColQwen2.from_pretrained(
    EMBED_MODEL,
    torch_dtype=DTYPE,
    attn_implementation=<span class="hljs-string">&quot;flash_attention_2&quot;</span> <span class="hljs-keyword">if</span> DEVICE == <span class="hljs-string">&quot;cuda&quot;</span> <span class="hljs-keyword">else</span> <span class="hljs-literal">None</span>,
    device_map=DEVICE,
).<span class="hljs-built_in">eval</span>()
emb_processor = ColQwen2Processor.from_pretrained(EMBED_MODEL)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Embedding model ready on <span class="hljs-subst">{DEVICE}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>出力：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_1_1fbbeba04e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Initialize-Milvus" class="common-anchor-header">ステップ3: Milvusの初期化</h3><p>このチュートリアルでは、Milvus Liteを使用します。Milvus Liteはローカルファイルとして動作し、設定は不要です。</p>
<p><strong>データベーススキーマ</strong></p>
<p><strong>id</strong>：INT64, オートインクリメント主キー</p>
<p><strong>doc_id</strong>：INT64、ページ番号（PDFのどのページか）</p>
<p><strong>patch_idx</strong>：INT64, そのページ内のパッチインデックス</p>
<p><strong>vector</strong>：FLOAT_VECTOR(128), パッチの 128 次元埋め込み。</p>
<pre><code translate="no">milvus_client = MilvusClient(uri=MILVUS_URI)

<span class="hljs-keyword">if</span> milvus_client.has_collection(COLLECTION):
    milvus_client.drop_collection(COLLECTION)

schema = milvus_client.create_schema(auto_id=<span class="hljs-literal">True</span>, enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;doc_id&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;patch_idx&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;vector&quot;</span>, DataType.FLOAT_VECTOR, dim=EMBED_DIM)

index = milvus_client.prepare_index_params()
index.add_index(field_name=<span class="hljs-string">&quot;vector&quot;</span>, index_type=<span class="hljs-string">&quot;FLAT&quot;</span>, metric_type=<span class="hljs-string">&quot;IP&quot;</span>)
milvus_client.create_collection(COLLECTION, schema=schema, index_params=index)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Milvus collection created.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>出力：作成されたmilvusコレクション。</p>
<h3 id="Step-4-Convert-PDF-Pages-to-Images" class="common-anchor-header">ステップ4：PDFページを画像に変換</h3><p>各ページを150 DPIでレンダリングします。パイプラインはすべてのページを純粋に画像として扱います。</p>
<pre><code translate="no">PDF_PATH = <span class="hljs-string">&quot;Milvus vs Zilliz.pdf&quot;</span>  <span class="hljs-comment"># Replace with your own PDF</span>
images = [p.convert(<span class="hljs-string">&quot;RGB&quot;</span>) <span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> convert_from_path(PDF_PATH, dpi=<span class="hljs-number">150</span>)]
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{<span class="hljs-built_in">len</span>(images)}</span> pages loaded.&quot;</span>)

<span class="hljs-comment"># Preview the first page</span>
images[<span class="hljs-number">0</span>].resize((<span class="hljs-number">400</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">400</span> * images[<span class="hljs-number">0</span>].height / images[<span class="hljs-number">0</span>].width)))
<button class="copy-code-btn"></button></code></pre>
<p>出力されます：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_4_8720da8494.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-5-Encode-Images-and-Insert-into-Milvus" class="common-anchor-header">ステップ5：画像をエンコードしてMilvusに挿入する</h3><p>ColQwen2は各ページをマルチベクターパッチ埋め込みにエンコードします。そして、Milvusに各パッチを個別の行として挿入します。</p>
<pre><code translate="no"><span class="hljs-comment"># Encode all pages</span>
all_page_embs = []
<span class="hljs-keyword">with</span> torch.no_grad():
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> tqdm(<span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(images), <span class="hljs-number">2</span>), desc=<span class="hljs-string">&quot;Encoding pages&quot;</span>):
        batch = images[i : i + <span class="hljs-number">2</span>]
        inputs = emb_processor.process_images(batch).to(emb_model.device)
        embs = emb_model(**inputs)
        <span class="hljs-keyword">for</span> e <span class="hljs-keyword">in</span> embs:
            all_page_embs.append(e.cpu().<span class="hljs-built_in">float</span>().numpy())

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Encoded <span class="hljs-subst">{<span class="hljs-built_in">len</span>(all_page_embs)}</span> pages, ~<span class="hljs-subst">{all_page_embs[<span class="hljs-number">0</span>].shape[<span class="hljs-number">0</span>]}</span> patches per page, dim=<span class="hljs-subst">{all_page_embs[<span class="hljs-number">0</span>].shape[<span class="hljs-number">1</span>]}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>出力：エンコードされた17ページ、~755パッチ/ページ、dim=128</p>
<pre><code translate="no"><span class="hljs-comment"># Insert into Milvus</span>
<span class="hljs-keyword">for</span> doc_id, patch_vecs <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(all_page_embs):
    rows = [
        {<span class="hljs-string">&quot;doc_id&quot;</span>: doc_id, <span class="hljs-string">&quot;patch_idx&quot;</span>: j, <span class="hljs-string">&quot;vector&quot;</span>: v.tolist()}
        <span class="hljs-keyword">for</span> j, v <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(patch_vecs)
    ]
    milvus_client.insert(COLLECTION, rows)

total = milvus_client.get_collection_stats(COLLECTION)[<span class="hljs-string">&quot;row_count&quot;</span>]
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Indexed <span class="hljs-subst">{<span class="hljs-built_in">len</span>(all_page_embs)}</span> pages, <span class="hljs-subst">{total}</span> patches total.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>出力：インデックス化された17ページ、合計12835パッチ。</p>
<p>17ページのPDFは12,835のパッチベクターレコードを生成します。</p>
<h3 id="Step-6-Retrieve--Query-Encoding-+-MaxSim-Reranking" class="common-anchor-header">ステップ6：検索 - クエリーエンコーディング + MaxSim再ランク付け</h3><p>これがコアとなる検索ロジックである。これは3つの段階で動作する：</p>
<p><strong>クエリを</strong>複数のトークンベクターに<strong>エンコード</strong>する。</p>
<p><strong>Milvusで</strong>各トークンベクトルに最も近いパッチを<strong>検索</strong>。</p>
<p>MaxSimを使って<strong>ページごとに集計する</strong>：各クエリトークンについて、各ページで最もスコアの高いパッチを選び、すべてのトークンでそのスコアを合計する。合計スコアが最も高いページをベストマッチとする。</p>
<p><strong>MaxSimの仕組み</strong>各クエリトークンのベクトルに対して、最も高い内積（MaxSimでは "max"）を持つドキュメントパッチを見つけます。そして、すべてのクエリトークンの最大スコアを合計し、ページごとの関連性スコアの合計を求めます。スコアが高い＝クエリとページのビジュアルコンテンツの意味的一致が強い。</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;What is the difference between Milvus and Zilliz Cloud?&quot;</span>

<span class="hljs-comment"># 1. Encode the query</span>
<span class="hljs-keyword">with</span> torch.no_grad():
    query_inputs = emb_processor.process_queries([question]).to(emb_model.device)
    query_vecs = emb_model(**query_inputs)[<span class="hljs-number">0</span>].cpu().<span class="hljs-built_in">float</span>().numpy()
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Query encoded: <span class="hljs-subst">{query_vecs.shape[<span class="hljs-number">0</span>]}</span> token vectors&quot;</span>)

<span class="hljs-comment"># 2. Search Milvus for each query token vector</span>
doc_patch_scores = {}
<span class="hljs-keyword">for</span> qv <span class="hljs-keyword">in</span> query_vecs:
    hits = milvus_client.search(
        COLLECTION, data=[qv.tolist()], limit=CANDIDATE_PATCHES,
        output_fields=[<span class="hljs-string">&quot;doc_id&quot;</span>, <span class="hljs-string">&quot;patch_idx&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>},
    )[<span class="hljs-number">0</span>]
    <span class="hljs-keyword">for</span> h <span class="hljs-keyword">in</span> hits:
        did = h[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;doc_id&quot;</span>]
        pid = h[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;patch_idx&quot;</span>]
        score = h[<span class="hljs-string">&quot;distance&quot;</span>]
        doc_patch_scores.setdefault(did, {})[pid] = <span class="hljs-built_in">max</span>(
            doc_patch_scores.get(did, {}).get(pid, <span class="hljs-number">0</span>), score
        )

<span class="hljs-comment"># 3. MaxSim aggregation: total score per page = sum of all matched patch scores</span>
doc_scores = {d: <span class="hljs-built_in">sum</span>(ps.values()) <span class="hljs-keyword">for</span> d, ps <span class="hljs-keyword">in</span> doc_patch_scores.items()}
ranked = <span class="hljs-built_in">sorted</span>(doc_scores.items(), key=<span class="hljs-keyword">lambda</span> x: x[<span class="hljs-number">1</span>], reverse=<span class="hljs-literal">True</span>)[:TOP_K]
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Top-<span class="hljs-subst">{TOP_K}</span> retrieved pages: <span class="hljs-subst">{[(d, <span class="hljs-built_in">round</span>(s, <span class="hljs-number">2</span>)) <span class="hljs-keyword">for</span> d, s <span class="hljs-keyword">in</span> ranked]}</span>&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<p>アウトプット</p>
<pre><code translate="no">Query encoded: 24 token vectors
Top-3 retrieved pages: [(16, 161.16), (12, 135.73), (7, 122.58)]
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Display the retrieved pages</span>
context_images = [images[d] <span class="hljs-keyword">for</span> d, _ <span class="hljs-keyword">in</span> ranked <span class="hljs-keyword">if</span> d &lt; <span class="hljs-built_in">len</span>(images)]
<span class="hljs-keyword">for</span> i, img <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(context_images):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;--- Retrieved page <span class="hljs-subst">{ranked[i][<span class="hljs-number">0</span>]}</span> (score: <span class="hljs-subst">{ranked[i][<span class="hljs-number">1</span>]:<span class="hljs-number">.2</span>f}</span>) ---&quot;</span>)
    display(img.resize((<span class="hljs-number">500</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">500</span> * img.height / img.width))))
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_6_2842a54af8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-7-Generate-an-Answer-with-the-Multimodal-LLM" class="common-anchor-header">ステップ7：マルチモーダルLLMで回答を生成する</h3><p>Qwen3.5に、検索されたページ画像（抽出されたテキストではない）をユーザーの質問と共に送信します。LLMは画像を直接読み取り、回答を生成します。</p>
<pre><code translate="no"><span class="hljs-keyword">def</span> <span class="hljs-title function_">image_to_uri</span>(<span class="hljs-params">img</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert an image to a base64 data URI for sending to the LLM.&quot;&quot;&quot;</span>
    img = img.copy()
    w, h = img.size
    <span class="hljs-keyword">if</span> <span class="hljs-built_in">max</span>(w, h) &gt; <span class="hljs-number">1600</span>:
        r = <span class="hljs-number">1600</span> / <span class="hljs-built_in">max</span>(w, h)
        img = img.resize((<span class="hljs-built_in">int</span>(w * r), <span class="hljs-built_in">int</span>(h * r)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, <span class="hljs-built_in">format</span>=<span class="hljs-string">&quot;PNG&quot;</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;data:image/png;base64,<span class="hljs-subst">{base64.b64encode(buf.getvalue()).decode()}</span>&quot;</span>

<span class="hljs-comment"># Build the multimodal prompt</span>
context_images = [images[d] <span class="hljs-keyword">for</span> d, _ <span class="hljs-keyword">in</span> ranked <span class="hljs-keyword">if</span> d &lt; <span class="hljs-built_in">len</span>(images)]
content = [
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(img)}}
    <span class="hljs-keyword">for</span> img <span class="hljs-keyword">in</span> context_images
]
content.append({
    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>,
    <span class="hljs-string">&quot;text&quot;</span>: (
        <span class="hljs-string">f&quot;Above are <span class="hljs-subst">{<span class="hljs-built_in">len</span>(context_images)}</span> retrieved document pages.\n&quot;</span>
        <span class="hljs-string">f&quot;Read them carefully and answer the following question:\n\n&quot;</span>
        <span class="hljs-string">f&quot;Question: <span class="hljs-subst">{question}</span>\n\n&quot;</span>
        <span class="hljs-string">f&quot;Be concise and accurate. If the documents don&#x27;t contain &quot;</span>
        <span class="hljs-string">f&quot;relevant information, say so.&quot;</span>
    ),
})

<span class="hljs-comment"># Call the LLM</span>
llm = OpenAI(api_key=OPENROUTER_API_KEY, base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>)
response = llm.chat.completions.create(
    model=GENERATION_MODEL,
    messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: content}],
    max_tokens=<span class="hljs-number">1024</span>,
    temperature=<span class="hljs-number">0.7</span>,
)
answer = response.choices[<span class="hljs-number">0</span>].message.content.strip()
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Question: <span class="hljs-subst">{question}</span>\n&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Answer: <span class="hljs-subst">{answer}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>結果<br>

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Col_Qwen2_Milvus_Qwen3_5397_BA_17_B_3_33fa5d551d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>このチュートリアルでは、PDFを受け取り、各ページを画像に変換し、それらの画像をColQwen2でマルチベクターパッチ埋め込みに符号化し、Milvusに格納し、MaxSimスコアリングを用いてクエリ時に最も関連性の高いページを検索する、マルチモーダルRAGパイプラインを構築した。テキストを抽出し、OCRがレイアウトを保持することを期待する代わりに、パイプラインはオリジナルのページ画像をQwen3.5に送り、Qwen3.5はそれらを視覚的に読み取り、答えを生成する。</p>
<p>このチュートリアルは出発点であり、本番配備ではありません。このチュートリアルを進めるにあたって、いくつか留意すべき点があります。</p>
<p>トレードオフについて：</p>
<ul>
<li><strong>ストレージはページ数に応じてスケールします。</strong>各ページは~755ベクトルを生成するので、1,000ページのコーパスはmilvusではおよそ755,000行を意味する。ここで使われているFLATインデックスはデモには有効だが、より大きなコレクションにはIVFかHNSWが必要だろう。</li>
<li><strong>エンコードはテキスト埋め込みよりも遅い。</strong>ColQwen2は4.4GBのビジョンモデルです。画像をエンコードするのは、テキストチャンクを埋め込むよりもページあたり時間がかかります。一度だけ実行するバッチインデキシングジョブの場合、これは通常問題ありません。リアルタイムの取り込みには、ベンチマークを取る価値がある。</li>
<li><strong>このアプローチは、視覚的にリッチな文書に最適です。</strong>PDFのほとんどが、表や図のない、きれいな1段組のテキストであれば、従来のテキストベースのRAGの方が、より正確に検索でき、実行コストも少なくて済むかもしれません。</li>
</ul>
<p>次に何を試すべきか</p>
<ul>
<li><strong>別のマルチモーダルLLMに入れ替える。</strong>このチュートリアルでは、OpenRouter経由でQwen3.5を使用していますが、検索パイプラインはモデルに依存しません。生成ステップをGPT-4oやGemini、あるいは画像入力を受け付けるマルチモーダルモデルに向けることができます。</li>
<li><strong> <a href="http://milvus.io">Milvusの</a>スケールアップ。</strong>Milvus Liteはローカルファイルとして動作するため、プロトタイピングに最適です。本番ワークロードの場合、Docker/Kubernetes上のMilvusまたはZilliz Cloud（フルマネージドMilvus）は、インフラストラクチャを管理することなく、より大きなコーパスに対応します。</li>
<li><strong>様々なドキュメントタイプで実験してみましょう。</strong>ここでのパイプラインは比較用のPDFを使用していますが、スキャンした契約書、エンジニアリングの図面、財務諸表、図が密集した研究論文でも同じように動作します。</li>
</ul>
<p>始めるには、pip install pymilvusで<a href="https://github.com/milvus-io/milvus-lite">milvus Liteを</a>インストールし、HuggingFaceからColQwen2の重みを入手してください。</p>
<p>質問がある、あるいは作ったものを見せびらかしたい？<a href="https://milvus.io/slack">MilvusのSlackは</a>、コミュニティやチームから助けを得る最速の方法です。一対一の会話をご希望の場合は、<a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?uuid=4cb203e5-482a-47e0-90a6-7acc511d61f4">オフィスアワーを</a>ご予約ください。</p>
<h2 id="Keep-Reading" class="common-anchor-header">続きを読む<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/debugging-rag-in-3d-with-projectgolem-and-milvus.md">RAGが失敗する理由がわかるとしたら？Project_GolemとmilvusによるRAGの3Dデバッグ</a></p></li>
<li><p><a href="https://milvus.io/blog/is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md">RAGは時代遅れになりつつあるのか？</a></p></li>
<li><p><a href="https://milvus.io/blog/semantic-highlighting-model-for-rag-context-pruning-and-token-saving.md">RAGのコンテキスト刈り込みとトークン保存のためのセマンティックハイライトモデルを構築した方法</a></p></li>
<li><p><a href="https://milvus.io/blog/ai-code-review-gets-better-when-models-debate-claude-vs-gemini-vs-codex-vs-qwen-vs-minimax.md">AIコードレビューは、モデルが議論することで良くなる：クロード vs ジェミニ vs コーデックス vs Qwen vs ミニマックス</a></p></li>
</ul>
