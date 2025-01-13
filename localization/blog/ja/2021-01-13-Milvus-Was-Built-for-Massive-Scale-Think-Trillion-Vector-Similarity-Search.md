---
id: Milvus-Was-Built-for-Massive-Scale-Think-Trillion-Vector-Similarity-Search.md
title: Milvusは大規模（1兆倍）ベクトル類似検索のために作られた
author: milvus
date: 2021-01-13T08:56:00.480Z
desc: 次のAIや機械学習プロジェクトでオープンソースの力を試してみませんか。Milvusで大規模なベクトルデータを管理し、類似検索を強化しましょう。
cover: assets.zilliz.com/1_9a6be0b54f.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Milvus-Was-Built-for-Massive-Scale-Think-Trillion-Vector-Similarity-Search
---
<custom-h1>Milvusは大規模（数兆）ベクトル類似検索のために構築されました。</custom-h1><p>毎日、計り知れない数のビジネス・クリティカルな洞察が、企業が自社のデータの意味を理解できないために浪費されている。テキスト、画像、動画、音声などの非構造化データは、全データの80％を占めると推定されているが、分析されているのはそのわずか1％に過ぎない。幸いなことに、<a href="https://medium.com/unstructured-data-service/the-easiest-way-to-search-among-1-billion-image-vectors-d6faf72e361f">人工知能（AI）</a>、オープンソースソフトウェア、ムーアの法則により、機械規模の分析がかつてないほど身近になりつつある。ベクトル類似性検索を使えば、膨大な非構造化データセットから価値を引き出すことができる。この技術には、非構造化データを特徴ベクトル（リアルタイムで処理・分析できる機械に優しい数値データ形式）に変換することが含まれる。</p>
<p>ベクトル類似性検索は、電子商取引、セキュリティ、新薬開発などに応用されている。これらのソリューションは、数百万、数十億、あるいは数兆のベクトルを含むダイナミックなデータセットに依存しており、その有用性は、多くの場合、ほぼ瞬時に結果を返すことに依存しています。<a href="https://milvus.io/">Milvusは</a>、大規模なベクターデータセットを効率的に管理・検索するためにゼロから構築されたオープンソースのベクターデータ管理ソリューションです。この記事では、Milvusのベクトルデータ管理へのアプローチと、ベクトル類似検索のために最適化されたプラットフォームについて説明します。</p>
<p><strong>戻る</strong></p>
<ul>
<li><a href="#milvus-was-built-for-massive-scale-think-trillion-vector-similarity-search">Milvusは大規模（1兆倍）ベクトル類似検索のために構築された</a><ul>
<li><a href="#lsm-trees-keep-dynamic-data-management-efficient-at-massive-scales">LSMツリーにより、大規模でも効率的な動的データ管理が可能</a>-<a href="#a-segment-of-10-dimensional-vectors-in-milvus"><em>Milvusにおける10次元ベクトルのセグメント。</em></a></li>
<li><a href="#queried-data-files-before-the-merge"><em>Milvusにおける</em></a>10次元<a href="#an-illustration-of-inserting-vectors-in-milvus"><em>ベクトルの</em></a>セグメント<a href="#queried-data-files-after-the-merge"><em>。</em></a></li>
<li><a href="#similarity-searched-is-accelerated-by-indexing-vector-data">ベクトルデータのインデックス化により、類似検索が高速化。</a></li>
<li><a href="#learn-more-about-milvus">Milvusの詳細はこちら</a></li>
</ul></li>
</ul>
<h3 id="LSM-trees-keep-dynamic-data-management-efficient-at-massive-scales" class="common-anchor-header">LSMツリーにより大規模な動的データ管理を効率化</h3><p>効率的な動的データ管理を実現するために、Milvusはログ構造化マージツリー（LSMツリー）データ構造を採用しています。LSMツリーは、挿入や削除の多いデータへのアクセスに適しています。高性能な動的データ管理に役立つLSMツリーの具体的な属性については、発明者が発表した<a href="http://paperhub.s3.amazonaws.com/18e91eb4db2114a06ea614f0384f2784.pdf">オリジナル研究を</a>参照してください。LSMツリーは、<a href="https://cloud.google.com/bigtable">BigTable</a>、<a href="https://cassandra.apache.org/">Cassandra</a>、<a href="https://rocksdb.org/">RocksDBなど</a>、多くの一般的なデータベースで使用されているデータ構造です。</p>
<p>Milvusではベクトルはエンティティとして存在し、セグメントに格納される。各セグメントには1つから最大800万個のエンティティが含まれる。各エンティティには一意のIDとベクトル入力用のフィールドがあり、後者は1から32768次元を表す。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_Was_Built_for_Massive_Scale_Think_Trillion_Vector_Similarity_Search_2_492d31c7a0.png" alt="Blog_Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search_2.png" class="doc-image" id="blog_milvus-was-built-for-massive-scale-(think-trillion)-vector-similarity-search_2.png" />
   </span> <span class="img-wrapper"> <span>ブログ_Milvusは大規模(Think Trillion)ベクトル類似検索用に構築されました_2.png</span> </span></p>
<h3 id="Data-management-is-optimized-for-rapid-access-and-limited-fragmentation" class="common-anchor-header">データ管理は迅速なアクセスと断片化の抑制に最適化されている。</h3><p>Milvusはインサートリクエストを受け取ると、新しいデータを<a href="https://milvus.io/docs/v0.11.0/write_ahead_log.md">WAL(Write ahead log)</a>に書き込む。リクエストが正常にログファイルに記録された後、データはミュータブルバッファに書き込まれる。最後に、3つのトリガーのうちの1つにより、バッファは不変となり、ディスクにフラッシュされます：</p>
<ol>
<li><strong>時間間隔：</strong>時間間隔: 定められた間隔（デフォルトでは1秒）で、定期的にデータがディスクにフラッ シュされる。</li>
<li><strong>バッファサイズ：</strong>累積データがミュータブル・バッファの上限（128MB）に達したとき。</li>
<li><strong>手動トリガー：</strong>クライアントがフラッシュ関数を呼び出すと、データは手動でディスクにフラッシュされます。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_Was_Built_for_Massive_Scale_Think_Trillion_Vector_Similarity_Search_3_852dc2c9bb.png" alt="Blog_Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search_3.png" class="doc-image" id="blog_milvus-was-built-for-massive-scale-(think-trillion)-vector-similarity-search_3.png" />
   </span> <span class="img-wrapper"> <span>Blog_Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search_3.png</span> </span></p>
<p>ユーザは一度に数千から数百万のベクトルを追加することができ、新しいベクトルが挿入されるたびに異なるサイズのデータファイルが生成されます。その結果、データの断片化が生じ、データ管理が複雑になり、ベクトル類似検索の速度が低下します。過剰なデータ断片化を防ぐため、Milvusは、結合されたファイルサイズがユーザー設定可能な上限（例えば、1GB）に達するまで、データセグメントを常にマージします。例えば、上限が1GBの場合、512次元のベクトルを1億個挿入しても、データファイルは200個にしかなりません。</p>
<p>ベクターの挿入と検索が同時に行われるインクリメンタルな計算シナリオでは、Milvusは新しく挿入されたベクターデータを他のデータとマージする前にすぐに検索できるようにします。データマージ後、元のデータファイルは削除され、代わりに新しく作成されたマージファイルが検索に使用されます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_Was_Built_for_Massive_Scale_Think_Trillion_Vector_Similarity_Search_4_6bef3d914c.png" alt="Blog_Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search_4.png" class="doc-image" id="blog_milvus-was-built-for-massive-scale-(think-trillion)-vector-similarity-search_4.png" />
   </span> <span class="img-wrapper"> <span>ブログ_Milvusは大規模(Think Trillion)ベクトル類似検索用に構築されました_4.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Milvus_Was_Built_for_Massive_Scale_Think_Trillion_Vector_Similarity_Search_5_3851c2d789.png" alt="Blog_Milvus Was Built for Massive-Scale (Think Trillion) Vector Similarity Search_5.png" class="doc-image" id="blog_milvus-was-built-for-massive-scale-(think-trillion)-vector-similarity-search_5.png" />
   </span> <span class="img-wrapper"> <span>ブログ_Milvusは大規模(Think Trillion)ベクトル類似検索のために構築されました_5.png</span> </span></p>
<h3 id="Similarity-searched-is-accelerated-by-indexing-vector-data" class="common-anchor-header">類似検索はベクトルデータのインデックス化によって高速化される</h3><p>デフォルトでは、Milvusはベクトルデータを検索する際、総当たり検索に頼っています。網羅的検索とも呼ばれるこのアプローチは、クエリを実行するたびにすべてのベクトルデータをチェックします。数百万から数十億の多次元ベクトルを含むデータセットでは、このプロセスは遅すぎて、ほとんどの類似検索シナリオでは役に立ちません。クエリー時間を短縮するために、アルゴリズムを用いてベクトルインデックスを構築する。インデックス化されたデータは、類似したベクトルがより近くにあるようにクラスタ化され、類似検索エンジンが全データの一部だけをクエリすることを可能にし、精度を犠牲にする一方でクエリ時間を大幅に短縮する。</p>
<p>Milvusがサポートするベクトルインデックスタイプのほとんどは、近似最近傍（ANN）検索アルゴリズムを使用しています。多数のANNインデックスがあり、各インデックスは性能、精度、ストレージ要件のトレードオフを伴います。Milvusは量子化ベース、グラフベース、ツリーベースのインデックスをサポートしており、これらは全て異なるアプリケーションシナリオに対応しています。Milvusのインデックス構築に関する詳細や、Milvusがサポートするベクトルインデックスの種類については、Milvusの<a href="https://milvus.io/docs/v0.11.0/index.md#CPU">技術文書を</a>参照してください。</p>
<p>インデックス構築は多くのメタデータを生成する。例えば、200個のデータファイルに保存された1億個の512次元ベクトルにインデックスを作成すると、さらに200個のインデックスファイルが作成されます。ファイルの状態を効率的にチェックし、新しいファイルを削除または挿入するためには、効率的なメタデータ管理システムが必要です。Milvusはオンライントランザクション処理(OLTP)を採用しており、これはデータベース内の少量のデータの更新や削除に適したデータ処理手法である。MilvusはSQLiteまたはMySQLを使用してメタデータを管理します。</p>
<h3 id="Learn-more-about-Milvus" class="common-anchor-header">Milvusについてもっと知る</h3><p>Milvusは、Linux Foundationの傘下組織である<a href="https://lfaidata.foundation/">LF AI &amp; Dataで</a>現在インキュベーション中のオープンソースのベクトルデータ管理プラットフォームです。Milvusは、プロジェクトを開始したデータサイエンス・ソフトウェア企業である<a href="https://zilliz.com">Zillizによって</a>2019年にオープンソース化された。Milvusの詳細については、<a href="https://milvus.io/">ウェブサイトで</a>確認できる。ベクトル類似検索や、AIを使って非構造化データの可能性を引き出すことに興味がある方は、GitHubの<a href="https://github.com/milvus-io">オープンソースコミュニティに</a>ご参加ください。</p>
