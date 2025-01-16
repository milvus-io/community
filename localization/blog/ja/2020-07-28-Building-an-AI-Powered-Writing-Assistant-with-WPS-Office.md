---
id: Building-an-AI-Powered-Writing-Assistant-with-WPS-Office.md
title: WPS OfficeにAIを搭載したライティング・アシスタントを構築
author: milvus
date: 2020-07-28T03:35:40.105Z
desc: >-
  キングソフトがオープンソースの類似検索エンジンMilvusを活用して、WPS
  OfficeのAI搭載ライティング・アシスタント用のレコメンデーション・エンジンを構築した方法をご紹介します。
cover: assets.zilliz.com/wps_thumbnail_6cb7876963.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/Building-an-AI-Powered-Writing-Assistant-with-WPS-Office
---
<custom-h1>WPS Office用AIライティング・アシスタントの構築</custom-h1><p>WPS Officeは、世界中で1億5000万人以上のユーザーを持つキングソフトが開発した生産性ツールである。同社の人工知能（AI）部門は、意図認識やテキストクラスタリングなどのセマンティックマッチングアルゴリズムを使用して、スマートなライティングアシスタントをゼロから構築した。このツールはウェブアプリケーションと<a href="https://walkthechat.com/wechat-mini-programs-simple-introduction/">WeChatのミニプログラムの</a>両方があり、タイトルを入力し、最大5つのキーワードを選択するだけで、アウトライン、個々の段落、文書全体を素早く作成することができる。</p>
<p>このライティング・アシスタントのレコメンデーション・エンジンは、オープンソースの類似検索エンジンであるMilvusをコア・ベクトル処理モジュールに使用している。以下では、非構造化データからどのように特徴を抽出するか、Milvusがデータの保存とツールのレコメンデーションエンジンに果たす役割など、WPSオフィスのスマート・ライティング・アシスタントの構築プロセスを紹介する。</p>
<p>戻る</p>
<ul>
<li><a href="#building-an-ai-powered-writing-assistant-for-wps-office">WPS OfficeのAIライティング・アシスタントの構築</a><ul>
<li><a href="#making-sense-of-unstructured-textual-data">非構造化テキストデータの意味を理解する</a></li>
<li><a href="#using-the-tfidf-model-to-maximize-feature-extraction">TFIDFモデルを使用して特徴抽出を最大化する</a></li>
<li><a href="#extracting-features-with-the-bi-directional-lstm-cnns-crf-deep-learning-model">双方向LSTM-CNNs-CRFディープラーニングモデルによる特徴抽出</a></li>
<li><a href="#creating-sentence-embeddings-using-infersent">Infersentを使用した文埋め込み作成</a></li>
<li><a href="#storing-and-querying-vectors-with-milvus">Milvusを使ったベクトルの保存とクエリ</a></li>
<li><a href="#ai-isnt-replacing-writers-its-helping-them-write">AIは書き手を置き換えるのではなく、書き手を支援する</a></li>
</ul></li>
</ul>
<h3 id="Making-sense-of-unstructured-textual-data" class="common-anchor-header">非構造化テキストデータの意味を理解する</h3><p>WPSライティング・アシスタントの構築は、解決する価値のある現代的な問題と同様、厄介なデータから始まる。正確には、意味のある特徴を抽出しなければならない何千万もの高密度テキスト文書だ。この問題の複雑さを理解するために、異なる報道機関の2人のジャーナリストが同じトピックについてどのように報道するかを考えてみよう。</p>
<p>両者とも、文章構造を支配するルール、原則、プロセスを遵守する一方で、異なる単語を選択し、様々な長さの文章を作成し、独自の記事構造を使って、類似した（あるいはおそらくは異なる）ストーリーを伝えるだろう。固定された次元数を持つ構造化されたデータセットとは異なり、テキスト本文は、それらを支配する構文が非常に柔軟であるため、本質的に構造を欠いている。意味を見つけるためには、構造化されていない文書コーパスから機械可読な特徴を抽出しなければならない。しかしその前に、データをクリーニングしなければならない。</p>
<p>テキストデータのクリーニングには様々な方法があるが、この記事ではどれも深く取り上げない。タグの除去、アクセント記号の除去、短縮形の展開、特殊文字の除去、ストップワードの除去などが含まれる。テキストデータの前処理とクリーニングの方法については、<a href="https://towardsdatascience.com/understanding-feature-engineering-part-3-traditional-methods-for-text-data-f6f7d70acd41">こちらで</a>詳しく説明されている。</p>
<h3 id="Using-the-TFIDF-model-to-maximize-feature-extraction" class="common-anchor-header">TFIDFモデルを使用して特徴抽出を最大化する</h3><p>構造化されていないテキストデータの意味を理解し始めるために、用語頻度-逆文書頻度（TFIDF）モデルをWPSライティングアシスタントが取り出すコーパスに適用した。このモデルは、用語頻度と逆文書頻度という2つのメトリクスの組み合わせを使用して、文書内の各単語にTFIDF値を与える。用語頻度(TF)は、文書内の用語数を文書内の用語総数で割ったもので、逆文書頻度(IDF)は、コーパス内の文書数を用語が出現する文書数で割ったものである。</p>
<p>TFとIDFの積は、ある用語が文書に出現する頻度に、その単語がコーパス内でどの程度ユニークであるかを掛け合わせた指標となる。最終的にTFIDF値は、ある単語が文書の集まりの中でどれだけ文書に関連しているかの尺度である。用語はTFIDF値によってソートされ、値が低いもの（つまり一般的な単語）は、コーパスから特徴を抽出するためにディープラーニングを使用する際に、あまり重要視されない。</p>
<h3 id="Extracting-features-with-the-bi-directional-LSTM-CNNs-CRF-deep-learning-model" class="common-anchor-header">双方向LSTM-CNNs-CRF深層学習モデルによる特徴抽出</h3><p>双方向長短期記憶（BLSTM）、畳み込みニューラルネットワーク（CNN）、条件付き確率場（CRF）の組み合わせを使って、コーパスから単語レベルと文字レベルの表現を抽出することができる。WPS Officeライティングアシスタントの構築に使用された<a href="https://arxiv.org/pdf/1603.01354.pdf">BLSTM-CNNs-CRFモデルは</a>以下のように動作する：</p>
<ol>
<li><strong>CNN：</strong>文字埋め込みはCNNへの入力として使用され、次に意味的に関連する単語構造（接頭辞や接尾辞など）が抽出され、文字レベルの表現ベクトルに符号化される。</li>
<li><strong>BLSTM:</strong>文字レベルベクトルは単語埋め込みベクトルと連結され、BLSTM ネットワークに入力される。各シーケンスは、過去と未来の情報を捕捉するために、2つの別々の隠れ状態に前後して提示される。</li>
<li><strong>CRF：</strong>BLSTMからの出力ベクトルはCRF層に供給され、最適なラベル列を共同で解読する。</li>
</ol>
<p>これでニューラルネットワークは、構造化されていないテキストから名前付きエンティティを抽出して分類できるようになった。このプロセスは<a href="https://en.wikipedia.org/wiki/Named-entity_recognition">名前付きエンティティ認識（NER</a>）と呼ばれ、人名、機関、地理的位置などのカテゴリを探し、分類する。これらのエンティティは、データの並べ替えや想起に重要な役割を果たす。ここから、コーパスから重要な文章、段落、要約を抽出することができる。</p>
<h3 id="Creating-sentence-embeddings-using-Infersent" class="common-anchor-header">Infersentを使った文埋め込み作成</h3><p><a href="https://github.com/facebookresearch/InferSent">Infersentは</a>Facebookによって設計された教師付き文埋め込み手法で、完全な文をベクトル空間に埋め込み、Milvusデータベースに入力されるベクトルを作成するために使用される。Infersentは、スタンフォード自然言語推論（SNLI）コーパスを使用して訓練された。SNLIコーパスには、人間によって書かれ、ラベル付けされた570k文のペアが含まれている。Infersentがどのように機能するかについての詳細は、<a href="https://medium.com/analytics-vidhya/sentence-embeddings-facebooks-infersent-6ac4a9fc2001">こちらを</a>ご覧ください。</p>
<h3 id="Storing-and-querying-vectors-with-Milvus" class="common-anchor-header">Milvusによるベクトルの保存とクエリ</h3><p><a href="https://www.milvus.io/">Milvusは</a>オープンソースの類似検索エンジンで、1兆バイト規模の埋め込みデータの追加、削除、更新、ほぼリアルタイムの検索をサポートしています。クエリのパフォーマンスを向上させるため、Milvusでは各ベクトルフィールドにインデックスタイプを指定することができます。WPS OfficeスマートアシスタントはIVF_FLATインデックスを使用します。IVF_FLATは最も基本的なInverted File (IVF)インデックスタイプで、"Flat "はベクトルが圧縮や量子化されずに保存されていることを意味します。クラスタリングは、L2距離の正確な探索を使用するIndexFlat2に基づいています。</p>
<p>IVF_FLATは100%のクエリ想起率を持つが、圧縮がないためクエリ速度は比較的遅い。Milvusの<a href="https://milvus.io/docs/manage-partitions.md">パーティショニング機能は</a>、事前に定義されたルールに基づいてデータを物理ストレージの複数の部分に分割するために使用され、クエリをより高速かつ正確にする。Milvusにベクトルが追加されると、タグによってどのパーティションにデータを追加すべきかが指定される。ベクターデータに対するクエリは、タグを使ってクエリを実行するパーティションを指定する。データを各パーティション内のセグメントに分割することで、速度をさらに向上させることができる。</p>
<p>インテリジェント・ライティング・アシスタントはまた、Kubernetesクラスタを使用し、アプリケーション・コンテナを複数のマシンや環境で実行できるようにし、メタデータ管理にはMySQLを使用する。</p>
<h3 id="AI-isn’t-replacing-writers-it’s-helping-them-write" class="common-anchor-header">AIはライターに取って代わるのではなく、ライティングを支援する</h3><p>キングソフトのWPS Office向けライティング・アシスタントは、Milvusを利用して200万以上の文書のデータベースを管理し、クエリを実行している。このシステムは非常に柔軟で、1兆スケールのデータセットをほぼリアルタイムで検索できる。クエリーは平均0.2秒で完了するため、タイトルや数個のキーワードだけで文書全体をほぼ瞬時に生成できる。AIがプロのライターに取って代わるわけではないが、現在存在するテクノロジーは、斬新で興味深い方法で執筆プロセスを補強することができる。未来は未知数だが、少なくともライターは、より生産的で、ある種の困難さを軽減した "紙にペンを置く "方法を期待することができるだろう。</p>
<p>この記事には以下の情報源を使用した：</p>
<ul>
<li>"<a href="https://arxiv.org/pdf/1603.01354.pdf">End-to-end Sequence Labeling via Bi-directional LSTM-CNNs-CRF</a>", Xuezhe Ma and Eduard Hovy.</li>
<li><a href="https://towardsdatascience.com/understanding-feature-engineering-part-3-traditional-methods-for-text-data-f6f7d70acd41">「テキストデータに対する伝統的手法</a>」Dipanjan (DJ) Sarkar。</li>
<li><a href="https://ieeexplore.ieee.org/document/8780663">「TF-IDF連想意味に基づくテキスト特徴抽出</a>」Qing Liu, Jing Wang, Dehai Zhang, Yun Yang, NaiYao Wang.</li>
<li><a href="https://medium.com/analytics-vidhya/sentence-embeddings-facebooks-infersent-6ac4a9fc2001">「FacebookのInfersentを利用した文の埋め込みの理解</a>" Rehan Ahmad</li>
<li>"<a href="https://arxiv.org/pdf/1705.02364.pdf">自然言語推論データからの普遍文表現の教師あり学習</a>," Alexis Conneau, Douwe Kiela, Holger Schwenk, LoÏc Barrault, Antoine Bordes.V1</li>
</ul>
<p>Milvusを使ったものづくりについては、他の<a href="https://zilliz.com/user-stories">ユーザーストーリーを</a>お読みください。</p>
