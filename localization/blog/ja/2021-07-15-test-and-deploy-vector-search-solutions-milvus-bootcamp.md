---
id: test-and-deploy-vector-search-solutions-milvus-bootcamp.md
title: milvus2.0ブートキャンプでベクトル検索ソリューションを素早くテスト・展開
author: milvus
date: 2021-07-15T03:05:45.742Z
desc: オープンソースのベクトルデータベースMilvusを使って、ベクトル類似性検索ソリューションを構築、テスト、カスタマイズできます。
cover: assets.zilliz.com/cover_80db9ee49c.png
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/test-and-deploy-vector-search-solutions-milvus-bootcamp
---
<custom-h1>Milvus 2.0ブートキャンプでベクトル検索ソリューションを素早くテスト・展開</custom-h1><p>Milvus 2.0のリリースに伴い、チームはMilvus<a href="https://github.com/milvus-io/bootcamp">ブートキャンプを</a>刷新しました。新しく改良されたブートキャンプでは、様々なユースケースやデプロイメントに対応した最新のガイドと、より分かりやすいコード例を提供しています。さらに、この新しいバージョンは、世界で最も先進的なベクターデータベースの新バージョンである<a href="https://milvus.io/blog/milvus2.0-redefining-vector-database.md">Milvus 2.0</a>用にアップデートされています。</p>
<h3 id="Stress-test-your-system-against-1M-and-100M-dataset-benchmarks" class="common-anchor-header">1Mおよび100Mデータセットベンチマークに対するシステムのストレステスト</h3><p><a href="https://github.com/milvus-io/bootcamp/tree/master/benchmark_test">ベンチマークディレクトリには</a>100万と1億のベクトルベンチマークテストが含まれており、異なるサイズのデータセットに対してシステムがどのように反応するかを示します。</p>
<p><br/></p>
<h3 id="Explore-and-build-popular-vector-similarity-search-solutions" class="common-anchor-header">一般的なベクトル類似検索ソリューションの検索と構築</h3><p><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions">ソリューションディレクトリには</a>、最も一般的なベクトル類似検索のユースケースが含まれています。各ユースケースにはノートブックソリューションとDockerデプロイ可能なソリューションが含まれています。ユースケースには以下が含まれます：</p>
<ul>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/reverse_image_search">画像類似検索</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/video_similarity_search">動画類似検索</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/audio_similarity_search">音声類似検索</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/recommendation_system">推薦システム</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/molecular_similarity_search">分子検索</a></li>
<li><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/question_answering_system">質問応答システム</a></li>
</ul>
<p><br/></p>
<h3 id="Quickly-deploy-a-fully-built-application-on-any-system" class="common-anchor-header">完全に構築されたアプリケーションをあらゆるシステムに素早くデプロイ</h3><p>クイックデプロイ・ソリューションはドッカー化されたソリューションで、ユーザーはあらゆるシステム上に完全にビルドされたアプリケーションをデプロイすることができます。これらのソリューションは簡単なデモには理想的ですが、ノートブックと比較するとカスタマイズや理解するための作業が増えます。</p>
<p><br/></p>
<h3 id="Use-scenario-specific-notebooks-to-easily-deploy-pre-configured-applications" class="common-anchor-header">シナリオ固有のノートブックを使用して、設定済みのアプリケーションを簡単にデプロイできます。</h3><p>ノートブックには、与えられたユースケースにおける問題を解決するためにMilvusをデプロイする簡単な例が含まれています。それぞれの例は、ファイルや設定を管理することなく、最初から最後まで実行することができます。また、各ノートブックは簡単に従うことができ、変更可能であるため、他のプロジェクトのための理想的なベースファイルとなります。</p>
<p><br/></p>
<h3 id="Image-similarity-search-notebook-example" class="common-anchor-header">画像類似検索ノートブックの例</h3><p>画像の類似性検索は、物体を認識する自律走行車など、さまざまな技術の中核となるアイデアの1つです。この例では、Milvusを使ってコンピュータビジョンプログラムを簡単に構築する方法を説明します。</p>
<p>このノートブックは以下の3つを中心に構成されています：</p>
<ul>
<li>Milvusサーバー</li>
<li>Redisサーバー（メタデータ保存用）</li>
<li>事前訓練されたResnet-18モデル</li>
</ul>
<h4 id="Step-1-Download-required-packages" class="common-anchor-header">ステップ1: 必要なパッケージのダウンロード</h4><p>このプロジェクトに必要なパッケージをすべてダウンロードすることから始めます。このノートブックには、使用するパッケージの一覧表が含まれています。</p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-2-Server-startup" class="common-anchor-header">ステップ2：サーバーの起動</h4><p>パッケージがインストールされたら、サーバーを起動し、両方が正しく動作していることを確認します。<a href="https://milvus.io/docs/v2.0.x/install_standalone-docker.md">Milvus</a>サーバと<a href="https://hub.docker.com/_/redis">Redis</a>サーバを起動するための正しい手順に従ってください。</p>
<h4 id="Step-3-Download-project-data" class="common-anchor-header">ステップ 3: プロジェクトデータのダウンロード</h4><p>デフォルトでは、このノートブックは例として使用するためにVOCImageデータのスニペットを取り出しますが、ノートブックの上部に表示されているファイル構造に従っていれば、画像のあるディレクトリであればどのディレクトリでも動作するはずです。</p>
<pre><code translate="no">! gdown <span class="hljs-string">&quot;https://drive.google.com/u/1/uc?id=1jdudBiUu41kL-U5lhH3ari_WBRXyedWo&amp;export=download&quot;</span>
! tar -xf <span class="hljs-string">&#x27;VOCdevkit.zip&#x27;</span>
! <span class="hljs-built_in">rm</span> <span class="hljs-string">&#x27;VOCdevkit.zip&#x27;</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-4-Connect-to-the-servers" class="common-anchor-header">ステップ4：サーバーへの接続</h4><p>この例では、サーバーはlocalhost上のデフォルトポートで動作しています。</p>
<pre><code translate="no">connections.<span class="hljs-title function_">connect</span>(host=<span class="hljs-string">&quot;127.0.0.1&quot;</span>, port=<span class="hljs-number">19537</span>)
red = redis.<span class="hljs-title class_">Redis</span>(host = <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>, port=<span class="hljs-number">6379</span>, db=<span class="hljs-number">0</span>)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-5-Create-a-collection" class="common-anchor-header">ステップ 5: コレクションの作成</h4><p>サーバを起動したら、Milvusにすべてのベクトルを格納するコレクションを作成します。この例では、次元サイズをresnet-18の出力サイズである512に設定し、類似度メトリックをユークリッド距離（L2）に設定します。Milvusは様々な<a href="https://milvus.io/docs/v2.0.x/metric.md">類似度メトリックを</a>サポートしています。</p>
<pre><code translate="no">collection_name = <span class="hljs-string">&quot;image_similarity_search&quot;</span>
dim = <span class="hljs-number">512</span>
default_fields = [
    schema.FieldSchema(name=<span class="hljs-string">&quot;id&quot;</span>, dtype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>),
    schema.FieldSchema(name=<span class="hljs-string">&quot;vector&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=dim)
]
default_schema = schema.CollectionSchema(fields=default_fields, description=<span class="hljs-string">&quot;Image test collection&quot;</span>)
collection = Collection(name=collection_name, schema=default_schema)
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-6-Build-an-index-for-the-collection" class="common-anchor-header">ステップ6：コレクションのインデックスを構築する</h4><p>コレクションが作成されたら、そのインデックスを作成する。この場合、IVF_SQ8インデックスを使用する。このインデックスには'nlist'パラメータが必要で、これはmilvusに各データファイル（セグメント）内にいくつのクラスタを作るかを指示する。<a href="https://milvus.io/docs/v2.0.x/index.md">インデックスによって</a>必要なパラメータは異なります。</p>
<pre><code translate="no">default_index = {<span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;IVF_SQ8&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">2048</span>}, <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>}
collection.<span class="hljs-title function_">create_index</span>(field_name=<span class="hljs-string">&quot;vector&quot;</span>, index_params=default_index)
collection.<span class="hljs-title function_">load</span>()
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-7-Set-up-model-and-data-loader" class="common-anchor-header">ステップ7：モデルとデータローダーのセットアップ</h4><p>IVF_SQ8 インデックスが構築されたら、ニューラルネットワークとデータローダーをセットアップする。この例で使用する事前学習済みの pytorch resnet-18 は、分類のためにベクトルを圧縮し、貴重な情報を失う可能性のある最後のレイヤーがない。</p>
<pre><code translate="no">model = torch.hub.load(<span class="hljs-string">&#x27;pytorch/vision:v0.9.0&#x27;</span>, <span class="hljs-string">&#x27;resnet18&#x27;</span>, pretrained=<span class="hljs-literal">True</span>)
encoder = torch.nn.Sequential(*(<span class="hljs-built_in">list</span>(model.children())[:-<span class="hljs-number">1</span>]))
<button class="copy-code-btn"></button></code></pre>
<p>データセットとデータローダーは、画像のファイルパスを提供しながら、画像の前処理とバッチ処理ができるように修正する必要があります。これは、torchvision dataloaderを少し修正することで可能です。前処理では、resnet-18モデルが特定のサイズと値の範囲でトレーニングされているため、画像をトリミングして正規化する必要があります。</p>
<pre><code translate="no">dataset = ImageFolderWithPaths(data_dir, transform=transforms.Compose([
                                                transforms.Resize(256),
                                                transforms.CenterCrop(224),
                                                transforms.ToTensor(),
                                                transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])]))

dataloader = torch.utils.data.DataLoader(dataset, num_workers=0, batch_si
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-8-Insert-vectors-into-the-collection" class="common-anchor-header">ステップ8：コレクションへのベクトルの挿入</h4><p>コレクションがセットアップされると、画像を処理し、作成されたコレクションにロードできます。まず、画像がdataloaderによって取り込まれ、resnet-18モデルにかけられます。その結果、ベクトル埋め込みがMilvusに挿入され、Milvusは各ベクトルに一意のIDを返す。ベクトルIDと画像ファイルのパスは、キーと値のペアとしてRedisサーバーに挿入されます。</p>
<pre><code translate="no">steps = <span class="hljs-built_in">len</span>(dataloader)
step = <span class="hljs-number">0</span>
<span class="hljs-keyword">for</span> inputs, labels, paths <span class="hljs-keyword">in</span> dataloader:
    <span class="hljs-keyword">with</span> torch.no_grad():
        output = encoder(inputs).squeeze()
        output = output.numpy()

    mr = collection.insert([output.tolist()])
    ids = mr.primary_keys
    <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(ids)):
        red.<span class="hljs-built_in">set</span>(<span class="hljs-built_in">str</span>(ids[x]), paths[x])
    <span class="hljs-keyword">if</span> step%<span class="hljs-number">5</span> == <span class="hljs-number">0</span>:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Insert Step: &quot;</span> + <span class="hljs-built_in">str</span>(step) + <span class="hljs-string">&quot;/&quot;</span> + <span class="hljs-built_in">str</span>(steps))
    step += <span class="hljs-number">1</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-9-Conduct-a-vector-similarity-search" class="common-anchor-header">ステップ9：ベクトル類似度検索の実行</h4><p>すべてのデータがMilvusとRedisに挿入されると、実際のベクトル類似性検索を実行することができます。この例では、ランダムに選んだ3つの画像をRedisサーバーから取り出し、ベクトル類似性検索を行います。</p>
<pre><code translate="no">random_ids = [<span class="hljs-built_in">int</span>(red.randomkey()) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">3</span>)]
search_images = [x.decode(<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> red.mget(random_ids)]
<button class="copy-code-btn"></button></code></pre>
<p>これらの画像はまずステップ7で見つかったのと同じ前処理を経て、resnet-18モデルを通してプッシュされます。</p>
<pre><code translate="no">transform_ops = transforms.Compose([
                transforms.Resize(<span class="hljs-number">256</span>),
                transforms.CenterCrop(<span class="hljs-number">224</span>),
                transforms.ToTensor(),
                transforms.Normalize(mean=[<span class="hljs-number">0.485</span>, <span class="hljs-number">0.456</span>, <span class="hljs-number">0.406</span>], std=[<span class="hljs-number">0.229</span>, <span class="hljs-number">0.224</span>, <span class="hljs-number">0.225</span>])])

embeddings = [transform_ops(Image.<span class="hljs-built_in">open</span>(x)) <span class="hljs-keyword">for</span> x <span class="hljs-keyword">in</span> search_images]
embeddings = torch.stack(embeddings, dim=<span class="hljs-number">0</span>)

<span class="hljs-keyword">with</span> torch.no_grad():
    embeddings = encoder(embeddings).squeeze().numpy()
<button class="copy-code-btn"></button></code></pre>
<p>次に、結果として得られたベクトル埋め込みを使用して検索を実行する。最初に、検索するコレクションの名前、nprobe（検索するクラスタの数）、top_k（返されるベクトルの数）を含む検索パラメータを設定する。この例では、検索はとても速いはずです。</p>
<pre><code translate="no">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;L2&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: 32}}
start = time.time()
results = collection.search(embeddings, <span class="hljs-string">&quot;vector&quot;</span>, param=search_params, <span class="hljs-built_in">limit</span>=3, <span class="hljs-built_in">expr</span>=None)
end = time.time() - start
<button class="copy-code-btn"></button></code></pre>
<h4 id="Step-10-Image-search-results" class="common-anchor-header">ステップ 10：画像検索結果</h4><p>クエリから返されたベクトルIDは、対応する画像を見つけるために使用されます。そして、Matplotlibが画像検索結果の表示に使われます。<br/></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic1_c8652c7fae.png" alt="pic1.png" class="doc-image" id="pic1.png" />
   </span> <span class="img-wrapper"> <span>pic1.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic2_355b054161.png" alt="pic2.png" class="doc-image" id="pic2.png" /><span>pic2.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/pic3_01780c6aac.png" alt="pic3.png" class="doc-image" id="pic3.png" /><span>pic3.png</span> </span></p>
<p><br/></p>
<h3 id="Learn-how-to-deploy-Milvus-in-different-enviroments" class="common-anchor-header">Milvusを様々な環境にデプロイする方法を学びます。</h3><p>新しいブートキャンプの<a href="https://github.com/milvus-io/bootcamp/tree/master/deployments">デプロイメントセクションには</a>、様々な環境やセットアップでMilvusを使用するためのすべての情報が含まれています。Mishardsのデプロイ、KubernetesとMilvusの併用、ロードバランシングなどが含まれます。各環境には、Milvusをその環境で動作させる方法を説明する詳細なステップバイステップのガイドがあります。</p>
<p><br/></p>
<h3 id="Dont-be-a-stranger" class="common-anchor-header">知らない人にならないために</h3><ul>
<li><a href="https://zilliz.com/blog">ブログを</a>お読みください。</li>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slackで</a>オープンソースコミュニティと交流する。</li>
<li><a href="https://github.com/milvus-io/milvus">Githubで</a>、世界で最も人気のあるベクトルデータベースMilvusを使用したり、貢献する。</li>
</ul>
