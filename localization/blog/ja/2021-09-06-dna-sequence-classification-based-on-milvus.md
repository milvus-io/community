---
id: dna-sequence-classification-based-on-milvus.md
title: Milvusに基づくDNA配列の分類
author: Jael Gu
date: 2021-09-06T06:02:27.431Z
desc: オープンソースのベクターデータベースMilvusを使ってDNA配列の遺伝子ファミリーを認識する。容量は少ないが精度は高い。
cover: assets.zilliz.com/11111_5d089adf08.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/dna-sequence-classification-based-on-milvus'
---
<custom-h1>Milvusに基づくDNA配列分類</custom-h1><blockquote>
<p>McGill大学情報学修士課程卒業。AIアプリケーションとベクトルデータベースによる類似性検索に関心を持つ。オープンソースプロジェクトMilvusのコミュニティメンバーとして、推薦システムやDNA配列分類モデルのような様々なソリューションを提供し、改良してきた。挑戦を楽しみ、決してあきらめない！</p>
</blockquote>
<custom-h1>はじめに</custom-h1><p>DNA配列は、遺伝子のトレーサビリティ、種の同定、病気の診断など、学術研究と実用的なアプリケーションの両方で人気のある概念である。あらゆる産業がより知的で効率的な研究手法に飢えている中、人工知能は特に生物学と医学の領域から大きな注目を集めている。ますます多くの科学者や研究者が、バイオインフォマティクスにおける機械学習や深層学習に貢献している。実験結果をより説得力のあるものにするために、一般的な選択肢の一つはサンプルサイズを増やすことである。ゲノミクスにおけるビッグデータとの連携は、現実のユースケースにさらなる可能性をもたらしている。しかし、従来の配列アライメントには限界があり、<a href="https://www.frontiersin.org/articles/10.3389/fbioe.2020.01032/full#h5">大規模データには適さない</a>。現実的にトレードオフを少なくするために、ベクター化はDNA配列の大規模データセットに適した選択である。</p>
<p>オープンソースのベクターデータベース<a href="https://milvus.io/docs/v2.0.x/overview.md">Milvusは</a>大規模データに適している。核酸配列のベクターを保存し、高効率の検索を行うことができる。また、生産や研究のコスト削減にも役立つ。Milvusに基づくDNA配列分類システムは、遺伝子分類にわずか数ミリ秒しかかからない。さらに、機械学習における他の一般的な分類器よりも高い精度を示している。</p>
<custom-h1>データ処理</custom-h1><p>遺伝情報をコードする遺伝子は、4塩基[A, C, G, T]からなるDNA配列の小さな部分からできている。ヒトゲノムには約30,000の遺伝子、約30億のDNA塩基対が存在し、各塩基対には2つの対応する塩基が存在する。多様な用途をサポートするために、DNA配列は様々なカテゴリーに分類することができる。長いDNA塩基配列のデータを利用しやすくするために、データの前処理に<a href="https://en.wikipedia.org/wiki/K-mer#:~:text=Usually%2C%20the%20term%20k%2Dmer,total%20possible%20k%2Dmers%2C%20where">k-merが </a>導入されている。これにより、DNA塩基配列データをプレーンテキストに近づけることができる。また、ベクトル化されたデータは、データ解析や機械学習における計算を高速化することができる。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_a7469e9eac.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p><strong>k-mer</strong></p>
<p>k-mer法はDNA配列の前処理によく用いられる。元の塩基配列の各塩基から長さkの小さな部分を抽出し、長さsの長い塩基配列を長さkの(s-k+1)短い塩基配列に変換する。kの値を調整することで、モデルの性能が向上する。短い配列のリストは、データの読み取り、特徴抽出、ベクトル化が容易である。</p>
<p><strong>ベクトル化</strong></p>
<p>DNA配列はテキストの形でベクトル化される。k-merによって変換された配列は、短い配列のリストとなり、文章中の個々の単語のリストのように見える。したがって、ほとんどの自然言語処理モデルは、DNA配列データに対しても同様に機能するはずである。モデルのトレーニング、特徴抽出、符号化にも同様の方法論が適用できる。各モデルにはそれぞれ利点と欠点があるため、モデルの選択はデータの特徴や研究目的によって異なる。例えば、CountVectorizerはBag-of-Wordsモデルであり、単純なトークン化によって特徴抽出を行う。これはデータの長さに制限を設けませんが、返される結果は類似性の比較という点ではあまり明白ではありません。</p>
<custom-h1>Milvusデモ</custom-h1><p>Milvusは非構造化データを容易に管理し、数兆のベクトルの中から最も類似した結果を平均数ミリ秒の遅延で呼び出すことができる。その類似検索は近似最近傍（ANN）検索アルゴリズムに基づいています。MilvusはDNA配列のベクトルを管理するための優れた選択肢であり、バイオインフォマティクスの発展と応用を促進する。</p>
<p>以下はMilvusを用いたDNA配列分類システムの構築方法を示すデモである。<a href="https://www.kaggle.com/nageshsingh/dna-sequence-dataset">実験データセットには </a>3つの生物と7つの遺伝子ファミリーが含まれています。全てのデータはk-mersによって短い配列のリストに変換されている。事前にトレーニングされたCountVectorizerモデルにより、システムは配列データをベクトルにエンコードする。以下のフローチャートは、システムの構造と、挿入と検索のプロセスを示している。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_ebd89660f6.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<p><a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/dna_sequence_classification">Milvusブートキャンプで</a>このデモをお試しください。</p>
<p>Milvusでは、システムがコレクションを作成し、対応するDNA配列のベクターをコレクション（有効な場合はパーティション）に挿入する。Milvusはクエリーリクエストを受信すると、入力DNA配列のベクトルとデータベース内の最も類似した結果との間の距離を返す。入力配列のクラスと DNA 配列間の類似性は、結果のベクトル距離から判断することができる。</p>
<pre><code translate="no"><span class="hljs-comment"># Insert vectors to Milvus collection (partition &quot;human&quot;)</span>
DNA_human = collection.insert([human_ids, human_vectors], partition_name=<span class="hljs-string">&#x27;human&#x27;</span>)
<span class="hljs-comment"># Search topK results (in partition &quot;human&quot;) for test vectors</span>
res = collection.search(test_vectors, <span class="hljs-string">&quot;vector_field&quot;</span>, search_params, limit=topK, partition_names=[<span class="hljs-string">&#x27;human&#x27;</span>])
<span class="hljs-keyword">for</span> results <span class="hljs-keyword">in</span> res:
    res_ids = results.ids <span class="hljs-comment"># primary keys of topK results</span>
    res_distances = results.distances <span class="hljs-comment"># distances between topK results &amp; search input</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>DNA 配列の分類</strong>Milvus で最も類似した DNA 配列を検索することで、未知のサンプルの遺伝子ファミリーを示唆し、その可能 性ある機能を知ることができる。<a href="https://www.nature.com/scitable/topicpage/gpcr-14047471/"> ある配列がGPCRに分類された場合、その配列はおそらく身体機能に影響を与えていると考えられる。 </a>このデモでは、Milvusは検索されたヒトDNA配列の遺伝子ファミリーを同定することに成功している。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_1616da5bb0.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span> <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_d719b22fc7.png" alt="4.png" class="doc-image" id="4.png" /><span>4.png</span> </span></p>
<p><strong>遺伝子の類似性</strong></p>
<p>生物間の平均DNA配列類似度は、そのゲノムがいかに近いかを示している。このデモでは、ヒトのデータから、チンパンジーとイヌそれぞれのDNA配列と最も類似したDNA配列を検索する。そして、平均内積距離（チンパンジーは0.97、イヌは0.70）を計算し、比較することで、チンパンジーはイヌよりもヒトと類似した遺伝子を共有していることを証明している。Milvusは、より複雑なデータとシステム設計により、より高いレベルでの遺伝子研究をサポートすることができる。</p>
<pre><code translate="no">search_params = {<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">20</span>}}
<button class="copy-code-btn"></button></code></pre>
<p><strong>パフォーマンス</strong></p>
<p>このデモでは、80％のヒトサンプルデータ（合計3629件）で分類モデルを学習し、残りをテストデータとして使用している。Milvusを使用したDNA配列分類モデルと、Mysqlを使用した分類モデルおよび5つの一般的な機械学習分類器の性能を比較している。Milvusを使ったモデルは、精度で他のモデルを上回っている。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> sklearn.<span class="hljs-property">model_selection</span> <span class="hljs-keyword">import</span> train_test_split
X, y = human_sequence_kmers, human_labels
X_train, X_test, y_train, y_test = <span class="hljs-title function_">train_test_split</span>(X, y, test_size=<span class="hljs-number">0.2</span>, random_state=<span class="hljs-number">42</span>)
<button class="copy-code-btn"></button></code></pre>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_6541a7dec6.png" alt="1.png" class="doc-image" id="1.png" />
   </span> <span class="img-wrapper"> <span>1.png</span> </span></p>
<custom-h1>さらなる探求</custom-h1><p>ビッグデータ技術の発展に伴い、DNA配列のベクトル化は遺伝学的研究と実践においてより重要な役割を果たすだろう。バイオインフォマティクスの専門的知識と組み合わせることで、DNA配列のベクトル化の関与から関連研究がさらに恩恵を受けることができる。従って、Milvusはより良い結果を実践の場で示すことができる。Milvusを利用した類似性検索と距離計算は、様々なシナリオやユーザーのニーズに応じ、大きな可能性と多くの可能性を示します。</p>
<ul>
<li><strong>未知の配列の研究</strong> <a href="https://iopscience.iop.org/article/10.1088/1742-6596/1453/1/012071/pdf">一部の研究者によれば、ベクトル化はDNA配列データを圧縮することができる。</a>同時に、未知のDNA配列の構造、機能、進化を研究するための労力も少なくて済む。milvusは、精度を落とすことなく、膨大な数のDNA配列ベクターを保存し、取り出すことができる。</li>
<li><strong>デバイスを適応させる</strong>：従来の配列アライメントのアルゴリズムに制限され、類似性検索はデバイス<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7884812/">（CPU</a><a href="https://mjeer.journals.ekb.eg/article_146090.html">/</a><a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7884812/">GPU</a>）の改良の恩恵をほとんど受けることができない。通常のCPU計算とGPUアクセラレーションの両方をサポートするMilvusは、近似最近傍アルゴリズムによりこの問題を解決する。</li>
<li><strong>ウイルスを検出し、起源を追跡する</strong>：<a href="https://www.nature.com/articles/s41586-020-2012-7?fbclid=IwAR2hxnXb9nLWgA8xexEoNrCNH8WHqvHhhbN38aSm48AaH6fTzGMB1BLljf4">科学者たちはゲノム配列を比較し、コウモリ由来の可能性が高いCOVID19ウイルスがSARS-COVに属することを報告</a>した。この結論に基づき、研究者はより多くの証拠とパターンを得るためにサンプルサイズを拡大することができる。</li>
<li><strong>病気の診断</strong>臨床的には、医師は病気の原因となる変異遺伝子を特定するために、患者と健康なグループのDNA配列を比較することができる。適切なアルゴリズムを用いて特徴を抽出し、これらのデータを符号化することが可能である。Milvusはベクトル間の距離を返すことができ、それは病気のデータと関連づけることができる。このアプリケーションは、病気の診断に役立つだけでなく、<a href="https://www.frontiersin.org/articles/10.3389/fgene.2021.680117/full">標的</a>治療の研究にも役立つ。</li>
</ul>
<custom-h1>Milvusについてもっと知る</custom-h1><p>Milvusは、膨大な数の人工知能およびベクトル類似性検索アプリケーションを強化できる強力なツールです。プロジェクトの詳細については、以下のリソースをご覧ください：</p>
<ul>
<li><a href="https://milvus.io/blog">ブログを</a>読む</li>
<li><a href="https://milvusio.slack.com/join/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ#/shared-invite/email">Slackで</a>オープンソースコミュニティと交流する。</li>
<li><a href="https://github.com/milvus-io/milvus/">GitHubで</a>世界で最も人気のあるベクトル・データベースを利用したり、貢献する。</li>
<li>新しい<a href="https://github.com/milvus-io/bootcamp">ブートキャンプで</a>AIアプリケーションを素早くテストし、デプロイする。</li>
</ul>
