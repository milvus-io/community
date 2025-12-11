---
id: >-
  gemini-3-pro-milvus-building-a-more-robust-rag-with-advanced-reasoning-and-multimodal-power.md
title: Gemini 3 Pro + Milvus：高度な推論とマルチモーダルパワーでより堅牢なRAGを構築する
author: Lumina Wang
date: 2025-11-20T00:00:00.000Z
cover: assets.zilliz.com/gemini3pro_cover_2f88fb0fe6.png
tag: Tutorial
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Gemini 3 Pro, vibe coding, Milvus, RAG'
meta_title: |
  Gemini 3 Pro + Milvus: Robust RAG With Advanced Reasoning and Multimodal Power
desc: >-
  Gemini 3
  Proのコアアップデートについて学び、主要ベンチマークでのパフォーマンスを確認し、Milvusを使用した高性能RAGパイプラインの構築ガイドに従う。
origin: >-
  https://milvus.io/blog/gemini-3-pro-milvus-building-a-more-robust-rag-with-advanced-reasoning-and-multimodal-power.md
---
<p>GoogleのGemini 3 Proは、単なる誇大広告ではなく、自然言語インターフェイスにできることを実質的に拡張する機能という、開発者の期待を純粋にシフトさせる稀有なリリースで上陸した。動的なツールルーティング、マルチステッププランニング、APIオーケストレーション、インタラクティブなUX生成のすべてをシームレスにつなぎ合わせる。動的なツールルーティング、マルチステップのプランニング、APIオーケストレーション、そしてインタラクティブなUX生成。</p>
<p>そして、数字がその物語を裏付けている。Gemini 3 Proは、ほぼすべての主要なベンチマークで傑出した結果を出しています：</p>
<ul>
<li><p><strong>人類最後の試験：</strong>ツールなしで37.5%、ツールありで45.8% - 最も近い競合製品は26.5%。</p></li>
<li><p><strong>MathArena Apex：</strong>23.4％、ほとんどのモデルは2％を切ることができなかった。</p></li>
<li><p><strong>ScreenSpot-Pro：</strong>72.7％の精度で、次点の36.2％のほぼ2倍。</p></li>
<li><p><strong>Vending-Bench 2:</strong>平均純額<strong>5,478.16ドル</strong>、2位を<strong>約1.4倍</strong>上回る。</p></li>
</ul>
<p>その他のベンチマーク結果は以下の表をご覧ください。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gemini_3_table_final_HLE_Tools_on_1s_X_Rb4o_f50f42dd67.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>深い推論、強力なツールの使用、そしてマルチモーダルな流暢さのこの組み合わせは、Gemini 3 Proを検索支援型ジェネレーション（RAG）に自然に適合させている。億規模のセマンティック検索用に構築された高性能なオープンソースベクターデータベースである<a href="https://milvus.io/"><strong>Milvusと</strong></a>組み合わせることで、レスポンスの根拠となる検索レイヤーを得ることができる。</p>
<p>この投稿では、Gemini 3 Proの新機能、RAGワークフローを向上させる理由、Milvusを検索バックボーンとして使用したクリーンで効率的なRAGパイプラインの構築方法について説明する。</p>
<h2 id="Major-Upgrades-in-Gemini-3-Pro" class="common-anchor-header">Gemini 3 Proの主なアップグレード<button data-href="#Major-Upgrades-in-Gemini-3-Pro" class="anchor-icon" translate="no">
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
    </button></h2><p>Gemini 3 Proは、モデルの理由付け、作成、タスクの実行、およびユーザーとのインタラクションの方法を再構築する一連の実質的なアップグレードを導入しています。これらの改善は、4つの主要な機能分野に分類される：</p>
<h3 id="Multimodal-Understanding-and-Reasoning" class="common-anchor-header">マルチモーダル理解と推論</h3><p>Gemini 3 Proは、視覚的推論のARC-AGI-2、クロスモーダル理解のMMMU-Pro、ビデオ理解と知識習得のVideo-MMMUなど、重要なマルチモーダルベンチマークで新記録を樹立しています。また、構造化されたマルチステップの論理処理を可能にする拡張推論モード「Deep Think」も導入されている。これにより、従来の思考連鎖モデルが失敗しがちな複雑な問題でも、精度が大幅に向上する。</p>
<h3 id="Code-Generation" class="common-anchor-header">コード生成</h3><p>このモデルは、ジェネレーティブコーディングを新しいレベルに引き上げます。Gemini 3 Proは、インタラクティブなSVG、完全なWebアプリケーション、3Dシーン、さらには、Minecraftのような環境やブラウザベースのビリヤードを含む機能的なゲームを、すべて1つの自然言語のプロンプトから生成することができます。フロントエンド開発には特に利点があります。このモデルでは、既存のUIデザインを忠実に再現したり、スクリーンショットをそのまま制作可能なコードに変換したりできるため、UIの反復作業が劇的に速くなります。</p>
<h3 id="AI-Agents-and-Tool-Use" class="common-anchor-header">AIエージェントとツールの使用</h3><p>ユーザーの許可があれば、Gemini 3 Proは、ユーザーのGoogleデバイスからデータにアクセスし、旅行の計画やレンタカーの予約など、長期的で複数ステップのタスクを実行することができる。このエージェント機能は、<strong>Vending-Bench 2</strong>（ロングホライズンツール使用のストレステスト用に特別に設計されたベンチマーク）での強力なパフォーマンスに反映されている。このモデルはまた、端末コマンドの実行や、明確に定義されたAPIを通じた外部ツールとのやり取りを含む、プロフェッショナルグレードのエージェントワークフローをサポートしています。</p>
<h3 id="Generative-UI" class="common-anchor-header">ジェネレーティブUI</h3><p>Gemini 3 Proは、従来の一問一答モデルを超えて、<strong>ジェネレーティブUIを</strong>導入しています。ジェネレーティブ<strong>UIでは</strong>、インタラクティブな体験全体を動的に構築することができます。静的なテキストを返す代わりに、完全にカスタマイズされたインターフェース（例えば、リッチで調整可能なトラベルプランナー）を、ユーザーの指示に直接反応して生成することができる。これにより、LLMは受動的な応答者から能動的なインターフェース生成者へとシフトする。</p>
<h2 id="Putting-Gemini-3-Pro-to-the-Test" class="common-anchor-header">Gemini 3 Proをテストする<button data-href="#Putting-Gemini-3-Pro-to-the-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>ベンチマークの結果だけでなく、Gemini 3 Proが実際のワークフローでどのように動作するかを理解するために、一連の実地テストを実施した。その結果、Gemini 3 Proのマルチモーダルな推論、ジェネレーティブな機能、および長期的なプランニングが、開発者にとってどのように実用的な価値につながるかが明らかになった。</p>
<h3 id="Multimodal-understanding" class="common-anchor-header">マルチモーダルな理解</h3><p>Gemini 3 Proは、テキスト、画像、ビデオ、コードに渡って、印象的な多機能性を示す。テストでは、YouTubeからZillizのビデオを直接アップロードした。このモデルは、ナレーション、トランジション、画面上のテキストを含むクリップ全体を<strong>約40</strong>秒で処理し、長尺のマルチモーダルコンテンツとしては異例の速さで処理した。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ytb1_39f31b728a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ytb2_bb4688e829.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Googleの内部評価でも同様の結果が得られている：Gemini 3 Proは、複数の言語にまたがる手書きのレシピを扱い、それぞれを書き起こして翻訳し、共有可能な家族のレシピブックにまとめた。</p>
<iframe class="video-player" src="https://www.youtube.com/embed/nfX__7p8J8E" title="Gemini 3 Pro: recipe" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h3 id="Zero-Shot-Tasks" class="common-anchor-header">ゼロショットタスク</h3><p>Gemini 3 Proは、事前のサンプルや足場がなくても、完全にインタラクティブなWeb UIを生成することができます。洗練されたレトロフューチャーな<strong>3D宇宙船のWeb</strong>ゲームを作成するように指示されたとき、このモデルは、ネオンパープルのグリッド、サイバーパンクスタイルの船、光るパーティクル効果、スムーズなカメラコントロールなど、完全なインタラクティブシーンを作成しました。</p>
<iframe class="video-player" src="https://www.youtube.com/embed/JxX_TAyy0Kg" title="" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h3 id="Complex-Task-Planning" class="common-anchor-header">複雑なタスクプランニング</h3><p>このモデルはまた、他の多くのモデルよりも強力な長期的タスクプランニングを示す。私たちの受信箱整理テストでは、Gemini 3 ProはAIの事務アシスタントのように振る舞った：乱雑なメールをプロジェクトのバケツに分類し、実行可能な提案（返信、フォローアップ、アーカイブ）を起草し、きれいで構造化された要約を提示する。このモデルの計画では、受信箱全体を1回の確認クリックで片付けることができる。</p>
<iframe class="video-player" src="https://www.youtube.com/embed/O5CUkblZm0Y" title="Gemini 3 Pro: inbox-organization" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<h2 id="How-to-Build-a-RAG-System-with-Gemini-3-Pro-and-Milvus" class="common-anchor-header">Gemini 3 ProとmilvusでRAGシステムを構築する方法<button data-href="#How-to-Build-a-RAG-System-with-Gemini-3-Pro-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Gemini 3 Proのアップグレードされた推論、マルチモーダル理解、および強力なツール使用機能は、高性能RAGシステムの優れた基盤となっている。</p>
<p>大規模なセマンティック検索用に構築された高性能なオープンソースベクターデータベースである<a href="https://milvus.io/"><strong>Milvusと</strong></a>組み合わせることで、責任の明確な分担が可能になる：Gemini 3 Proが<strong>解釈、推論、生成を</strong>行い、Milvusが<strong>高速でスケーラブルな検索レイヤーを</strong>提供することで、企業データに基づいた応答が維持される。この組み合わせは、社内のナレッジベース、ドキュメントアシスタント、カスタマーサポートのコパイロット、ドメイン固有のエキスパートシステムなどのプロダクショングレードのアプリケーションに適しています。</p>
<h3 id="Prerequisites" class="common-anchor-header">前提条件</h3><p>RAGパイプラインを構築する前に、これらのコアPythonライブラリがインストールされているか、最新バージョンにアップグレードされていることを確認してください：</p>
<ul>
<li><p><strong>pymilvus</strong>- milvus公式Python SDK</p></li>
<li><p><strong>google-generativeai</strong>- Gemini 3 Proクライアントライブラリ</p></li>
<li><p><strong>requests</strong>- 必要に応じてHTTPコールを処理する</p></li>
<li><p><strong>tqdm</strong>- データセットの取り込み中にプログレスバーを表示する。</p></li>
</ul>
<pre><code translate="no">! pip install --upgrade pymilvus google-generativeai requests tqdm
<button class="copy-code-btn"></button></code></pre>
<p>次に、<a href="https://aistudio.google.com/api-keys"><strong>Google AI Studioに</strong></a>ログインし、APIキーを取得します。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;GEMINI_API_KEY&quot;</span>] = <span class="hljs-string">&quot;**********&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Preparing-the-Dataset" class="common-anchor-header">データセットの準備</h3><p>このチュートリアルでは、Milvus 2.4.xドキュメントのFAQセクションをRAGシステムのプライベートナレッジベースとして使用します。</p>
<p>ドキュメントのアーカイブをダウンロードし、<code translate="no">milvus_docs</code> という名前のフォルダに解凍してください。</p>
<pre><code translate="no">! wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
! unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p>パス<code translate="no">milvus_docs/en/faq</code> からすべてのMarkdownファイルをロードします。各ドキュメントについて、<code translate="no">#</code> の見出しに基づく単純な分割を適用し、各Markdownファイル内の主要セクションを大まかに分ける。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="LLM-and-Embedding-Model-Setup" class="common-anchor-header">LLMと埋め込みモデルのセットアップ</h3><p>このチュートリアルでは、<code translate="no">gemini-3-pro-preview</code> をLLMとして、<code translate="no">text-embedding-004</code> を埋め込みモデルとして使用します。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> google.generativeai <span class="hljs-keyword">as</span> genai
genai.configure(api_key=os.environ[<span class="hljs-string">&quot;GEMINI_API_KEY&quot;</span>])
gemini_model = genai.GenerativeModel(<span class="hljs-string">&quot;gemini-3-pro-preview&quot;</span>)
response = gemini_model.generate_content(<span class="hljs-string">&quot;who are you&quot;</span>)
<span class="hljs-built_in">print</span>(response.text)
<button class="copy-code-btn"></button></code></pre>
<p>モデルの応答私はGoogleによって構築された大規模な言語モデルであるGeminiです。</p>
<p>テスト埋め込みを生成し、その次元数を最初のいくつかの値とともに出力することで、簡単なチェックを行うことができます：</p>
<pre><code translate="no">test_embeddings = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=[<span class="hljs-string">&quot;This is a test1&quot;</span>, <span class="hljs-string">&quot;This is a test2&quot;</span>]
)[<span class="hljs-string">&quot;embedding&quot;</span>]
embedding_dim = <span class="hljs-built_in">len</span>(test_embeddings[<span class="hljs-number">0</span>])
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embeddings[<span class="hljs-number">0</span>][:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>テストベクトル出力：</p>
<p>768</p>
<p>[0.013588584, -0.004361838, -0.08481652, -0.039724775, 0.04723794, -0.0051557426, 0.026071774, 0.045514572, -0.016867816, 0.039378334]</p>
<h3 id="Loading-Data-into-Milvus" class="common-anchor-header">Milvusへのデータのロード</h3><p><strong>コレクションの作成</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">MilvusClient</code> を作成する際、規模や環境に応じて3つの設定オプションから選択することができます：</p>
<ul>
<li><p><strong>ローカルモード（Milvus Lite）：</strong>ローカルモード(Milvus Lite): URIをローカルのファイルパスに設定する(例:<code translate="no">./milvus.db</code>)。<a href="https://milvus.io/docs/milvus_lite.md">Milvus Liteは</a>自動的にすべてのデータをそのファイルに保存します。</p></li>
<li><p><strong>セルフホストMilvus（DockerまたはKubernetes）：</strong>より大きなデータセットやプロダクションワークロードの場合は、DockerまたはKubernetes上でMilvusを実行します。MilvusサーバーのエンドポイントにURIを設定します（<code translate="no">http://localhost:19530</code> など）。</p></li>
<li><p><strong>Zilliz Cloud (フルマネージドMilvusサービス)：</strong>マネージドソリューションをご希望の場合は、Zilliz Cloudをご利用ください。URIをパブリックエンドポイントに設定し、認証トークンとしてAPIキーを指定します。</p></li>
</ul>
<p>新しいコレクションを作成する前に、まずそのコレクションが既に存在するかどうかを確認します。存在する場合は、それを削除し、クリーンなセットアップを確実にするために再作成します。</p>
<pre><code translate="no">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>指定されたパラメータで新しいコレクションを作成します。</p>
<p>スキーマが指定されていない場合、Milvusは自動的にプライマリキーとしてデフォルトのIDフィールドを生成し、エンベッディングを格納するためのベクターフィールドを生成します。また、スキーマで定義されていない追加フィールドをキャプチャする予約JSONダイナミックフィールドも提供します。</p>
<pre><code translate="no">milvus_client.create_collection(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,  <span class="hljs-comment"># Strong consistency level</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><strong>データの挿入</strong></p>
<p>各テキストエントリーを繰り返し、埋め込みベクトルを生成し、Milvusにデータを挿入します。この例では、<code translate="no">text</code> というフィールドを追加しています。これはスキーマで定義されていないため、Milvusは自動的にダイナミックJSONフィールドを使用して格納します。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm
data = []
doc_embeddings = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=text_lines
)[<span class="hljs-string">&quot;embedding&quot;</span>]
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>サンプル出力</p>
<pre><code translate="no">Creating embeddings: 100%|█████████████████████████| 72/72 [00:00&lt;00:00, 431414.13it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-the-RAG-Workflow" class="common-anchor-header">RAGワークフローの構築</h3><p><strong>関連データの取得</strong></p>
<p>検索をテストするために、Milvusに関する一般的な質問をします。</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>クエリに対してコレクションを検索し、最も関連性の高い上位3つの結果を返します。</p>
<pre><code translate="no">question_embedding = genai.embed_content(
    model=<span class="hljs-string">&quot;models/text-embedding-004&quot;</span>, content=question
)[<span class="hljs-string">&quot;embedding&quot;</span>]
search_res = milvus_client.search(
    collection_name=collection_name,
    data=[question_embedding],
    limit=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Return top 3 results</span>
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},  <span class="hljs-comment"># Inner product distance</span>
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],  <span class="hljs-comment"># Return the text field</span>
)
<span class="hljs-keyword">import</span> json
retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))
<button class="copy-code-btn"></button></code></pre>
<p>結果は似ているものから似ていないものの順に返される。</p>
<pre><code translate="no">[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including [MinIO](
https://min.io/
), [AWS S3](
https://aws.amazon.com/s3/?nc1=h_ls
), [Google Cloud Storage](
https://cloud.google.com/storage?hl=en#object-storage-for-companies-of-all-sizes
) (GCS), [Azure Blob Storage](
https://azure.microsoft.com/en-us/products/storage/blobs
), [Alibaba Cloud OSS](
https://www.alibabacloud.com/product/object-storage-service
), and [Tencent Cloud Object Storage](
https://www.tencentcloud.com/products/cos
) (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        0.8048489093780518
    ],
    [
        <span class="hljs-string">&quot;Does the query perform in memory? What are incremental data and historical data?\n\nYes. When a query request comes, Milvus searches both incremental data and historical data by loading them into memory. Incremental data are in the growing segments, which are buffered in memory before they reach the threshold to be persisted in storage engine, while historical data are from the sealed segments that are stored in the object storage. Incremental data and historical data together constitute the whole dataset to search.\n\n###&quot;</span>,
        0.757495105266571
    ],
    [
        <span class="hljs-string">&quot;What is the maximum dataset size Milvus can handle?\n\n  \nTheoretically, the maximum dataset size Milvus can handle is determined by the hardware it is run on, specifically system memory and storage:\n\n- Milvus loads all specified collections and partitions into memory before running queries. Therefore, memory size determines the maximum amount of data Milvus can query.\n- When new entities and and collection-related schema (currently only MinIO is supported for data persistence) are added to Milvus, system storage determines the maximum allowable size of inserted data.\n\n###&quot;</span>,
        0.7453694343566895
    ]
]
<button class="copy-code-btn"></button></code></pre>
<p><strong>LLMでRAGレスポンスを生成する</strong></p>
<p>文書を取得した後、文字列形式に変換する。</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>LLMにシステムプロンプトとユーザープロンプトを提供し、どちらもMilvusから取得した文書から作成する。</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You are able to find answers to the questions from the contextual passage snippets provided.
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
<button class="copy-code-btn"></button></code></pre>
<p>これらのプロンプトとともに<code translate="no">gemini-3-pro-preview</code> モデルを使用し、最終的な応答を生成する。</p>
<pre><code translate="no">gemini_model = genai.GenerativeModel(
    <span class="hljs-string">&quot;gemini-3-pro-preview&quot;</span>, system_instruction=SYSTEM_PROMPT
)
response = gemini_model.generate_content(USER_PROMPT)
<span class="hljs-built_in">print</span>(response.text)
<button class="copy-code-btn"></button></code></pre>
<p>出力から、Gemini 3 Proが検索された情報に基づいて、明確で構造化された回答を生成していることがわかります。</p>
<pre><code translate="no">Based <span class="hljs-keyword">on</span> the provided documents, Milvus stores data <span class="hljs-keyword">in</span> the following ways:
*   **Inserted Data:** Vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema are stored <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> an incremental log. Milvus supports multiple <span class="hljs-built_in">object</span> storage backends <span class="hljs-keyword">for</span> <span class="hljs-keyword">this</span> purpose, including:
    *   MinIO
    *   AWS S3
    *   <span class="hljs-function">Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>)
    *   Azure Blob Storage
    *   Alibaba Cloud OSS
    *   Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>)
*   **Metadata:** Metadata generated within Milvus modules <span class="hljs-keyword">is</span> stored <span class="hljs-keyword">in</span> **etcd**.
*   **Memory Buffering:** Incremental <span class="hljs-title">data</span> (<span class="hljs-params">growing segments</span>) are buffered <span class="hljs-keyword">in</span> memory before being persisted, <span class="hljs-keyword">while</span> historical <span class="hljs-title">data</span> (<span class="hljs-params"><span class="hljs-keyword">sealed</span> segments</span>) resides <span class="hljs-keyword">in</span> <span class="hljs-built_in">object</span> storage but <span class="hljs-keyword">is</span> loaded <span class="hljs-keyword">into</span> memory <span class="hljs-keyword">for</span> querying.
</span><button class="copy-code-btn"></button></code></pre>
<p><strong>注</strong>：Gemini 3 Proは、現在、フリーティアユーザーはご利用いただけません。詳細は<a href="https://ai.google.dev/gemini-api/docs/rate-limits#tier-1">こちらを</a>クリックしてください。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Gemini_3_Pro1_095925d461.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Gemini_3_Pro2_71ae286cf9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>代わりに<a href="https://openrouter.ai/google/gemini-3-pro-preview/api">OpenRouterから</a>アクセスすることができます：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
client = OpenAI(
  base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
  api_key=<span class="hljs-string">&quot;&lt;OPENROUTER_API_KEY&gt;&quot;</span>,
)
response2 = client.chat.completions.create(
  model=<span class="hljs-string">&quot;google/gemini-3-pro-preview&quot;</span>,
  messages=[
        {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>,
            <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT
        },
        {
            <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, 
            <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT
        }
    ],
  extra_body={<span class="hljs-string">&quot;reasoning&quot;</span>: {<span class="hljs-string">&quot;enabled&quot;</span>: <span class="hljs-literal">True</span>}}
)
response_message = response2.choices[<span class="hljs-number">0</span>].message
<span class="hljs-built_in">print</span>(response_message.content)
<button class="copy-code-btn"></button></code></pre>
<h2 id="One-More-Thing-Vibe-Coding-with-Google-Antigravity" class="common-anchor-header">One More Thing: Google Antigravityを使ったバイブコーディング<button data-href="#One-More-Thing-Vibe-Coding-with-Google-Antigravity" class="anchor-icon" translate="no">
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
    </button></h2><p>Gemini 3 Proと同時に、Googleはエディタ、ターミナル、ブラウザと自律的に対話するバイブコーディングプラットフォーム、<a href="https://antigravity.google/"><strong>Google Antigravityを</strong></a>発表した。単発の命令を扱う以前のAI支援ツールとは異なり、Antigravityはタスク指向のレベルで動作する。開発者が<em>何を</em>作りたいかを指定すると、システムがその<em>方法を</em>管理し、完全なワークフローをエンドツーエンドで編成する。</p>
<p>従来のAIコーディング・ワークフローでは、開発者が手作業でレビュー、統合、デバッグ、実行しなければならない孤立したスニペットが生成されるのが一般的だった。Antigravityは、そのような動きを変えます。例えば、<em>「シンプルなペットとのインタラクションゲームを作成する</em>」といったタスクを記述するだけで、システムはリクエストを分解し、コードを生成し、ターミナルコマンドを実行し、結果をテストするためにブラウザを開き、動作するまで繰り返し実行する。これはAIを受動的なオートコンプリート・エンジンから能動的なエンジニアリング・パートナーへと昇華させる。</p>
<p>将来的には、エージェントが直接データベースと連携するというアイデアは、遠い未来の話ではない。MCP経由でツールを呼び出すことで、AIは最終的にMilvusデータベースから読み出し、ナレッジベースを構築し、さらには自律的に独自の検索パイプラインを維持することができるだろう。AIが製品レベルの記述を受け取り、それを実行可能なタスクのシーケンスに変換できるようになれば、人間の労力は、目的、制約、そして「正しさ」とはどのようなものかを定義することに自然とシフトする。</p>
<h2 id="Ready-to-Build" class="common-anchor-header">構築の準備はできていますか？<button data-href="#Ready-to-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>ステップバイステップのチュートリアルに従って、<strong>Gemini 3 Pro + Milvusで</strong>RAGシステムを構築してください。</p>
<p>ご質問がある場合、またはどの機能についても深く知りたい場合は、Discordチャンネルにご参加ください。私たちの<a href="https://discord.com/invite/8uyFbECzPX"> Discordチャンネルに</a>参加するか、<a href="https://github.com/milvus-io/milvus"> GitHubに</a>課題を提出してください。また、<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvusオフィスアワーを通して</a>、20分間の1対1のセッションを予約し、洞察、ガイダンス、質問への回答を得ることもできます。</p>
