---
id: >-
  generate-more-creative-and-curated-ghibli-style-images-with-gpt-4o-and-milvus.md
title: GPT-4oとMilvusで、よりクリエイティブでキュレーションされたジブリ風の画像を生成する
author: Lumina Wang
date: 2025-04-01T00:00:00.000Z
desc: GPT-4oでプライベートデータをつなぐ Milvusを活用し、よりキュレーションされた画像出力を実現
cover: assets.zilliz.com/GPT_4opagephoto_5e934b89e5.png
tag: Engineering
tags: 'GPT-4o, Database, Milvus, Artificial Intelligence, Image Generation'
canonicalUrl: >-
  https://milvus.io/blog/generate-more-creative-and-curated-ghibli-style-images-with-gpt-4o-and-milvus.md
---
<h2 id="Everyone-Became-an-Artist-Overnight-with-GPT-4o" class="common-anchor-header">GPT-4oで誰もが一夜にしてアーティストになった<button data-href="#Everyone-Became-an-Artist-Overnight-with-GPT-4o" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/four_panel_1788f825e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>信じられないかもしれないが、今あなたが見た画像はAIが生成したものである！</em></p>
<p>OpenAIが3月26日にGPT-4oのネイティブ画像生成機能をリリースしたとき、その後に続くクリエイティブな津波を誰も予想できなかっただろう。有名人、政治家、ペット、そしてユーザー自身までもが、いくつかの簡単なプロンプトを入力するだけで、魅力的なスタジオジブリのキャラクターに変身したのだ。あまりの需要の多さに、サム・アルトマン自身が、OpenAIの "GPUが溶けている "とツイートして、ユーザーにスピードを落とすよう "懇願 "しなければならなかったほどだ。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ghibli_32e739c2ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>GPT-4oが生成した画像の例（クレジット X@Jason Reid）</p>
<h2 id="Why-GPT-4o-Changes-Everything" class="common-anchor-header">GPT-4oがすべてを変える理由<button data-href="#Why-GPT-4o-Changes-Everything" class="anchor-icon" translate="no">
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
    </button></h2><p>クリエイティブ業界にとって、これはパラダイムシフトを意味する。かつてはデザインチーム全体で丸一日を要した作業が、今ではわずか数分で完了する。GPT-4oがこれまでのイメージジェネレーターと異なるのは、<strong>その驚くべきビジュアルの一貫性と直感的なインターフェイス</strong>です。マルチターンカンバセーションに対応しており、要素の追加、比率の調整、スタイルの変更、さらには2Dから3Dへの変換など、画像を洗練させることができます。</p>
<p>GPT-4oの優れたパフォーマンスの秘密は？それは自己回帰型アーキテクチャです。画像を再構成する前にノイズに分解する拡散モデル（安定拡散など）とは異なり、GPT-4oは画像を1トークンずつ順次生成し、プロセス全体を通して文脈を認識します。この基本的なアーキテクチャの違いが、GPT-4oがよりわかりやすく、より自然なプロンプトで、より首尾一貫した結果を生成する理由を説明している。</p>
<p>しかし、開発者にとって興味深いのはここからだ：<strong>AIモデル自体が製品になりつつあるのだ。簡単に言えば、パブリック・ドメインのデータに大規模なAIモデルを巻き付けただけの製品は、ほとんど時代に取り残される危険性があるということだ。</strong></p>
<p>このような進歩の真の力は、汎用的な大規模モデルと、<strong>プライベートな、ドメインに特化したデータを</strong>組み合わせることから生まれる。この組み合わせは、大規模言語モデルの時代において、ほとんどの企業にとって最適な生存戦略かもしれない。基本モデルが進化し続ける中、持続的な競争優位性は、自社独自のデータセットをこれらの強力なAIシステムと効果的に統合できる企業に属するだろう。</p>
<p>オープンソースの高性能ベクトル・データベースであるMilvusを使って、GPT-4oとプライベート・データを接続する方法を探ってみよう。</p>
<h2 id="Connecting-Your-Private-Data-with-GPT-4o-Using-Milvus-for-More-Curated-Image-Outputs" class="common-anchor-header">Milvusを使ってGPT-4oとプライベートデータを接続し、よりキュレーションされた画像出力を実現する。<button data-href="#Connecting-Your-Private-Data-with-GPT-4o-Using-Milvus-for-More-Curated-Image-Outputs" class="anchor-icon" translate="no">
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
    </button></h2><p>ベクターデータベースは、プライベートデータとAIモデルの橋渡しをするキーテクノロジーです。ベクターデータベースは、画像、テキスト、音声などのコンテンツを、その意味や特徴を捉えた数学的表現（ベクター）に変換することで機能します。これにより、キーワードだけでなく、類似性に基づくセマンティック検索が可能になります。</p>
<p>Milvusは、主要なオープンソースのベクトル・データベースとして、GPT-4oのような生成AIツールとの接続に特に適している。ここでは、私が個人的な課題を解決するためにどのように使用したかを紹介する。</p>
<h3 id="Background" class="common-anchor-header">背景</h3><p>ある日、愛犬コーラのいたずらを漫画にするという素晴らしいアイデアを思いついた。しかし、問題があった：仕事や旅行、食べ物の冒険で撮った何万枚もの写真の中から、どうやってコーラのやんちゃな瞬間を探せばいいのだろう？</p>
<p>答えは？Milvusにすべての写真をインポートし、画像検索をするのだ。</p>
<p>それでは、実装を順を追って見ていこう。</p>
<h4 id="Dependencies-and-Environment" class="common-anchor-header">依存関係と環境</h4><p>まず、適切なパッケージで環境を整える必要がある：</p>
<pre><code translate="no">pip install pymilvus --upgrade
pip install torch numpy scikit-learn pillow
<button class="copy-code-btn"></button></code></pre>
<h4 id="Prepare-the-Data" class="common-anchor-header">データの準備</h4><p>このガイドでは、約30,000枚の写真がある私のフォト・ライブラリをデータセットとして使うことにする。手元にデータセットがない場合は、Milvusからサンプルデータセットをダウンロードして解凍してください：</p>
<pre><code translate="no">!wget https://github.com/milvus-io/pymilvus-assets/releases/download/imagedata/reverse_image_search.<span class="hljs-built_in">zip</span>
!unzip -q -o reverse_image_search.<span class="hljs-built_in">zip</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Define-the-Feature-Extractor" class="common-anchor-header">特徴抽出器の定義</h4><p>画像から埋め込みベクトルを抽出するために、<code translate="no">timm</code> ライブラリの ResNet-50 モードを使います。このモデルは何百万もの画像でトレーニングされており、視覚的内容を表す意味のある特徴を抽出することができます。</p>
<pre><code translate="no">    <span class="hljs-keyword">import</span> torch
    <span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image
    <span class="hljs-keyword">import</span> timm
    <span class="hljs-keyword">from</span> sklearn.preprocessing <span class="hljs-keyword">import</span> normalize
    <span class="hljs-keyword">from</span> timm.data <span class="hljs-keyword">import</span> resolve_data_config
    <span class="hljs-keyword">from</span> timm.data.transforms_factory <span class="hljs-keyword">import</span> create_transform
    <span class="hljs-keyword">class</span> <span class="hljs-title class_">FeatureExtractor</span>:
        <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, modelname</span>):
            <span class="hljs-comment"># Load the pre-trained model</span>
            <span class="hljs-variable language_">self</span>.model = timm.create_model(
                modelname, pretrained=<span class="hljs-literal">True</span>, num_classes=<span class="hljs-number">0</span>, global_pool=<span class="hljs-string">&quot;avg&quot;</span>
            )
            <span class="hljs-variable language_">self</span>.model.<span class="hljs-built_in">eval</span>()
            <span class="hljs-comment"># Get the input size required by the model</span>
            <span class="hljs-variable language_">self</span>.input_size = <span class="hljs-variable language_">self</span>.model.default_cfg[<span class="hljs-string">&quot;input_size&quot;</span>]
            config = resolve_data_config({}, model=modelname)
            <span class="hljs-comment"># Get the preprocessing function provided by TIMM for the model</span>
            <span class="hljs-variable language_">self</span>.preprocess = create_transform(**config)
        <span class="hljs-keyword">def</span> <span class="hljs-title function_">__call__</span>(<span class="hljs-params">self, imagepath</span>):
            <span class="hljs-comment"># Preprocess the input image</span>
            input_image = Image.<span class="hljs-built_in">open</span>(imagepath).convert(<span class="hljs-string">&quot;RGB&quot;</span>)  <span class="hljs-comment"># Convert to RGB if needed</span>
            input_image = <span class="hljs-variable language_">self</span>.preprocess(input_image)
            <span class="hljs-comment"># Convert the image to a PyTorch tensor and add a batch dimension</span>
            input_tensor = input_image.unsqueeze(<span class="hljs-number">0</span>)
            <span class="hljs-comment"># Perform inference</span>
            <span class="hljs-keyword">with</span> torch.no_grad():
                output = <span class="hljs-variable language_">self</span>.model(input_tensor)
            <span class="hljs-comment"># Extract the feature vector</span>
            feature_vector = output.squeeze().numpy()
            <span class="hljs-keyword">return</span> normalize(feature_vector.reshape(<span class="hljs-number">1</span>, -<span class="hljs-number">1</span>), norm=<span class="hljs-string">&quot;l2&quot;</span>).flatten()
<button class="copy-code-btn"></button></code></pre>
<h4 id="Create-a-Milvus-Collection" class="common-anchor-header">Milvusコレクションの作成</h4><p>次に、埋め込み画像を保存するMilvusコレクションを作成します。これはベクトル類似検索のために特別に設計されたデータベースと考えてください：</p>
<pre><code translate="no">    <span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
    client = MilvusClient(uri=<span class="hljs-string">&quot;example.db&quot;</span>)
    <span class="hljs-keyword">if</span> client.has_collection(collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>):
        client.drop_collection(collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>)

    client.create_collection(
        collection_name=<span class="hljs-string">&quot;image_embeddings&quot;</span>,
        vector_field_name=<span class="hljs-string">&quot;vector&quot;</span>,
        dimension=<span class="hljs-number">2048</span>,
        auto_id=<span class="hljs-literal">True</span>,
        enable_dynamic_field=<span class="hljs-literal">True</span>,
        metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    )
<button class="copy-code-btn"></button></code></pre>
<p><strong>MilvusClientパラメータの注意事項：</strong></p>
<ul>
<li><p><strong>ローカル設定：</strong>ローカルファイル（例えば、<code translate="no">./milvus.db</code> ）を使用するのが最も簡単な方法です-Milvus Liteが全てのデータを処理します。</p></li>
<li><p><strong>スケールアップ:</strong>大きなデータセットの場合、DockerまたはKubernetesを使用して堅牢なMilvusサーバをセットアップし、そのURI (例:<code translate="no">http://localhost:19530</code>)を使用する。</p></li>
<li><p><strong>クラウドオプション：</strong>Zillizクラウド（Milvusのフルマネージドサービス）を利用する場合は、URIとトークンをパブリックエンドポイントとAPIキーに合わせてください。</p></li>
</ul>
<h4 id="Insert-Image-Embeddings-into-Milvus" class="common-anchor-header">Milvusに画像を埋め込む</h4><p>各画像を分析し、そのベクトル表現を保存するプロセスが始まります。このステップはデータセットのサイズによっては時間がかかるかもしれませんが、1回限りのプロセスです：</p>
<pre><code translate="no">    <span class="hljs-keyword">import</span> os
    <span class="hljs-keyword">from</span> some_module <span class="hljs-keyword">import</span> FeatureExtractor  <span class="hljs-comment"># Replace with your feature extraction module</span>
    extractor = FeatureExtractor(<span class="hljs-string">&quot;resnet50&quot;</span>)
    root = <span class="hljs-string">&quot;./train&quot;</span>  <span class="hljs-comment"># Path to your dataset</span>
    insert = <span class="hljs-literal">True</span>
    <span class="hljs-keyword">if</span> insert:
        <span class="hljs-keyword">for</span> dirpath, _, filenames <span class="hljs-keyword">in</span> os.walk(root):
            <span class="hljs-keyword">for</span> filename <span class="hljs-keyword">in</span> filenames:
                <span class="hljs-keyword">if</span> filename.endswith(<span class="hljs-string">&quot;.jpeg&quot;</span>):
                    filepath = os.path.join(dirpath, filename)
                    image_embedding = extractor(filepath)
                    client.insert(
                        <span class="hljs-string">&quot;image_embeddings&quot;</span>,
                        {<span class="hljs-string">&quot;vector&quot;</span>: image_embedding, <span class="hljs-string">&quot;filename&quot;</span>: filepath},
                    )
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conduct-an-Image-Search" class="common-anchor-header">画像検索を行う</h4><p>データベースが構築されたので、次は類似画像を検索します。ここでマジックが起こります。ベクトルの類似性を使って、視覚的に似ている写真を見つけることができるのです：</p>
<pre><code translate="no">    <span class="hljs-keyword">from</span> IPython.display <span class="hljs-keyword">import</span> display
    <span class="hljs-keyword">from</span> PIL <span class="hljs-keyword">import</span> Image
    query_image = <span class="hljs-string">&quot;./search-image.jpeg&quot;</span>  <span class="hljs-comment"># The image you want to search with</span>
    results = client.search(
        <span class="hljs-string">&quot;image_embeddings&quot;</span>,
        data=[extractor(query_image)],
        output_fields=[<span class="hljs-string">&quot;filename&quot;</span>],
        search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
        limit=<span class="hljs-number">6</span>,  <span class="hljs-comment"># Top-k results</span>
    )
    images = []
    <span class="hljs-keyword">for</span> result <span class="hljs-keyword">in</span> results:
        <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> result[:<span class="hljs-number">10</span>]:
            filename = hit[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;filename&quot;</span>]
            img = Image.<span class="hljs-built_in">open</span>(filename)
            img = img.resize((<span class="hljs-number">150</span>, <span class="hljs-number">150</span>))
            images.append(img)
    width = <span class="hljs-number">150</span> * <span class="hljs-number">3</span>
    height = <span class="hljs-number">150</span> * <span class="hljs-number">2</span>
    concatenated_image = Image.new(<span class="hljs-string">&quot;RGB&quot;</span>, (width, height))
    <span class="hljs-keyword">for</span> idx, img <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(images):
        x = idx % <span class="hljs-number">5</span>
        y = idx // <span class="hljs-number">5</span>
        concatenated_image.paste(img, (x * <span class="hljs-number">150</span>, y * <span class="hljs-number">150</span>))

    display(<span class="hljs-string">&quot;query&quot;</span>)
    display(Image.<span class="hljs-built_in">open</span>(query_image).resize((<span class="hljs-number">150</span>, <span class="hljs-number">150</span>)))
    display(<span class="hljs-string">&quot;results&quot;</span>)
    display(concatenated_image)
<button class="copy-code-btn"></button></code></pre>
<p><strong>返された画像は以下の通りです：</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_1_8d4e88c6dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Combine-Vector-Search-with-GPT-4o-Generating-Ghibli-Style-Images-with-Images-Returned-by-Milvus" class="common-anchor-header">ベクトル検索とGPT-4oの組み合わせ：milvusが返す画像でジブリ風の画像を生成する</h3><p>GPT-4oのインプットとして画像検索結果を使い、クリエイティブなコンテンツを生成するのです。私の場合、撮影した写真をもとに、愛犬コーラを主人公にしたマンガを作りたかった。</p>
<p>ワークフローはシンプルだが強力だ：</p>
<ol>
<li><p>ベクトル検索を使って、私のコレクションからコーラの関連画像を見つける。</p></li>
<li><p>これらの画像をクリエイティブなプロンプトとともにGPT-4oにフィードする。</p></li>
<li><p>視覚的インスピレーションに基づいてユニークなコミックを生成</p></li>
</ol>
<p>この組み合わせでできることの例をいくつか紹介しよう：</p>
<p><strong>私が使っているプロンプト</strong></p>
<ul>
<li><p><em>「ネズミをかじるボーダー・コリーを主人公にした、4コマ、フルカラー、愉快なマンガを描いてください-飼い主に見つかると気まずくなります。"<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2025_04_02_at_11_34_43_1d7141eef3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
<li><p><em>「この犬がかわいい服を着ている漫画を描いてください。"<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/cutedog_6fdb1e9c79.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
<li><p><em>「この犬をモデルにして、この犬がホグワーツ魔法魔術学校に通う漫画を描く。"<br><em>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Screenshot_2025_04_02_at_11_44_00_ce932cd035.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</em></em></p></li>
</ul>
<h3 id="A-Few-Quick-Tips-from-My-Experience-of-Image-Generation" class="common-anchor-header">イメージ・ジェネレーションの経験から得たいくつかの簡単なヒント：</h3><ol>
<li><p><strong>シンプルに</strong>：気難しい拡散モデルとは違って、GPT-4oはわかりやすいプロンプトが一番効果的です。私はプロンプトをどんどん短く書いていくうちに、より良い結果が得られるようになりました。</p></li>
<li><p><strong>英語が最も効果的</strong>だ：中国語のプロンプトも試したが、結果は芳しくなかった。結局、英語でプロンプトを書き、必要に応じて完成したマンガを翻訳することにした。</p></li>
<li><p><strong>ビデオ・ジェネレーションには向かない</strong>：AIが生成する動画は、流れるような動きや一貫性のあるストーリーラインに関しては、まだ道半ばだ。</p></li>
</ol>
<h2 id="Whats-Next-My-Perspective-and-Open-for-Discussion" class="common-anchor-header">次はどうなる？私の見解と議論の余地<button data-href="#Whats-Next-My-Perspective-and-Open-for-Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>アプリマーケットプレイスのGPT、レポート生成のDeepResearch、会話型画像作成のGPT-4o、ビデオマジックのSoraなど、大型AIモデルはカーテンの陰からスポットライトを浴びている。かつては実験的な技術だったものが、今では実際に使える製品へと成熟しつつある。</p>
<p>GPT-4oや同様のモデルが広く受け入れられるようになると、安定拡散に基づくワークフローやインテリジェント・エージェントのほとんどは陳腐化に向かっている。しかし、プライベート・データと人間の洞察のかけがえのない価値は依然として強い。例えば、AIがクリエイティブエージェンシーに完全に取って代わることはないだろうが、MilvusのベクトルデータベースとGPTモデルを統合することで、エージェンシーは過去の成功例からインスピレーションを得た新鮮でクリエイティブなアイデアを素早く生み出すことができる。Eコマース・プラットフォームは、ショッピングのトレンドに基づいてパーソナライズされた服をデザインすることができ、学術機関は研究論文のビジュアルを即座に作成することができる。</p>
<p>AIモデルによる製品の時代が到来し、データの金鉱を掘り当てる競争は始まったばかりだ。開発者にとっても企業にとっても、メッセージは明確だ。独自のデータをこれらの強力なモデルと組み合わせなければ、取り残される危険性がある。</p>
