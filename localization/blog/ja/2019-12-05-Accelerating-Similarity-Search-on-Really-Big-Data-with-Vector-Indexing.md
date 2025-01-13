---
id: Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing.md
title: ベクトル・インデックスによるビッグデータの類似性検索の高速化
author: milvus
date: 2019-12-05T08:33:04.230Z
desc: >-
  ベクトル・インデックスがなければ、AIの最新のアプリケーションの多くは、どうしようもないほど遅くなってしまうだろう。次の機械学習アプリケーションのために適切なインデックスを選択する方法を学びましょう。
cover: assets.zilliz.com/4_1143e443aa.jpg
tag: Engineering
canonicalUrl: >-
  https://zilliz.com/blog/Accelerating-Similarity-Search-on-Really-Big-Data-with-Vector-Indexing
---
<custom-h1>ベクトル・インデックスでビッグデータの類似性検索を高速化</custom-h1><p>コンピュータビジョンから新薬の発見に至るまで、ベクトル類似性検索エンジンは、多くの一般的な人工知能（AI）アプリケーションに力を与えている。類似性検索エンジンが依存する100万、10億、あるいは1兆のベクトルデータセットへの効率的なクエリを可能にする大きな要素は、ビッグデータ検索を劇的に加速するデータ整理のプロセスであるインデックス化です。この記事では、ベクトル類似検索の効率化においてインデックス作成が果たす役割、さまざまなベクトル転置ファイル（IVF）インデックスタイプ、さまざまなシナリオでどのインデックスを使用すべきかについてのアドバイスを取り上げます。</p>
<p><strong>戻る</strong></p>
<ul>
<li><a href="#accelerating-similarity-search-on-really-big-data-with-vector-indexing">ベクトルインデックスによるビッグデータの類似検索の高速化</a><ul>
<li><a href="#how-does-vector-indexing-accelerate-similarity-search-and-machine-learning">ベクターインデックスはどのように類似検索と機械学習を加速するのか？</a></li>
<li><a href="#what-are-different-types-of-ivf-indexes-and-which-scenarios-are-they-best-suited-for">IVFインデックスにはどのような種類があり、どのようなシナリオに最適なのでしょうか？</a></li>
<li><a href="#flat-good-for-searching-relatively-small-million-scale-datasets-when-100-recall-is-required">フラット：100%の再現性が求められる比較的小規模な（100万件規模の）データセットの検索に適している。</a><ul>
<li><a href="#flat-performance-test-results">FLATのパフォーマンステスト結果</a><ul>
<li><a href="#query-time-test-results-for-the-flat-index-in-milvus"><em>MilvusにおけるFLATインデックスのクエリータイムテスト結果。</em></a></li>
</ul></li>
<li><a href="#key-takeaways">主な要点</a></li>
</ul></li>
<li><a href="#ivf_flat-improves-speed-at-the-expense-of-accuracy-and-vice-versa">IVF_FLAT：IVF</a>_<a href="#ivf_flat-improves-speed-at-the-expense-of-accuracy-and-vice-versa">FLAT：精度を犠牲にして速度を向上させる（逆も同様）。</a><ul>
<li><a href="#ivf_flat-performance-test-results">IVF_FLATのパフォーマンステスト結果：</a><ul>
<li><a href="#query-time-test-results-for-ivf_flat-index-in-milvus"><em>MilvusにおけるIVF_FLATインデックスのクエリ時間テスト結果。</em></a></li>
</ul></li>
<li><a href="#key-takeaways-1">主な要点</a><ul>
<li><a href="#recall-rate-test-results-for-the-ivf_flat-index-in-milvus"><em>MilvusにおけるIVF_FLATインデックスの再現率テスト結果。</em></a></li>
</ul></li>
<li><a href="#key-takeaways-2">主な結果</a></li>
</ul></li>
<li><a href="#ivf_sq8-faster-and-less-resource-hungry-than-ivf_flat-but-also-less-accurate">IVF_SQ8：IVF_FLATより高速で、リソースを消費しないが、精度も低い。</a><ul>
<li><a href="#ivf_sq8-performance-test-results">IVF_SQ8のパフォーマンステスト結果：</a><ul>
<li><a href="#query-time-test-results-for-ivf_sq8-index-in-milvus"><em>MilvusにおけるIVF_SQ8インデックスのクエリータイムテスト結果。</em></a></li>
</ul></li>
<li><a href="#key-takeaways-3">主な要点：</a><ul>
<li><a href="#recall-rate-test-results-for-ivf_sq8-index-in-milvus"><em>MilvusにおけるIVF_SQ8インデックスの再現率テスト結果。</em></a></li>
</ul></li>
<li><a href="#key-takeaways-4">主な要点：</a></li>
</ul></li>
<li><a href="#ivf_sq8h-new-hybrid-gpucpu-approach-that-is-even-faster-than-ivf_sq8">IVF_SQ8H：IVF_SQ8よりもさらに高速な新しいGPU/CPUハイブリッドアプローチ。</a><ul>
<li><a href="#ivf_sq8h-performance-test-results">IVF_SQ8Hのパフォーマンステスト結果：</a><ul>
<li><a href="#query-time-test-results-for-ivf_sq8h-index-in-milvus"><em>MilvusにおけるIVF_SQ8Hインデックスのクエリタイムテスト結果。</em></a></li>
</ul></li>
<li><a href="#key-takeaways-5">キーポイント</a></li>
</ul></li>
<li><a href="#learn-more-about-milvus-a-massive-scale-vector-data-management-platform">大規模ベクトルデータ管理プラットフォームMilvusの詳細をご覧ください。</a></li>
<li><a href="#methodology">メソドロジ</a><ul>
<li><a href="#performance-testing-environment">パフォーマンステスト環境</a></li>
<li><a href="#relevant-technical-concepts">関連する技術概念</a></li>
<li><a href="#resources">リソース</a></li>
</ul></li>
</ul></li>
</ul>
<h3 id="How-does-vector-indexing-accelerate-similarity-search-and-machine-learning" class="common-anchor-header">ベクトルインデックスは類似検索と機械学習をどのように加速するのか？</h3><p>類似検索エンジンは、入力とデータベースを比較し、入力に最も似ているオブジェクトを見つけることで動作します。インデクシングはデータを効率的に整理するプロセスであり、大規模なデータセットに対する時間のかかるクエリを劇的に高速化することで、類似性検索を有用なものにする上で大きな役割を果たしている。膨大なベクトルデータセットがインデックス化された後、クエリは入力クエリと類似したベクトルを含む可能性が最も高いクラスタ、つまりデータのサブセットにルーティングすることができる。実際には、本当に大きなベクトルデータのクエリを高速化するために、ある程度の精度が犠牲になることを意味する。</p>
<p>単語がアルファベット順に並べられた辞書に例えることができる。単語を調べる際、同じ頭文字を持つ単語のみを含むセクションに素早く移動することができ、入力単語の定義検索を劇的に高速化することができます。</p>
<h3 id="What-are-different-types-of-IVF-indexes-and-which-scenarios-are-they-best-suited-for" class="common-anchor-header">IVFインデックスにはどのような種類があり、どのようなシナリオに最適ですか？</h3><p>高次元のベクトル類似検索のために設計されたインデックスは数多くあり、それぞれパフォーマンス、精度、ストレージ要件においてトレードオフの関係にあります。この記事では、いくつかの一般的なIVFインデックスタイプ、その長所と短所、そして各インデックスタイプのパフォーマンステスト結果について説明します。パフォーマンステストでは、オープンソースのベクトルデータ管理プラットフォームである<a href="https://milvus.io/">Milvusにおいて</a>、各インデックスタイプのクエリー時間とリコール率を定量化しています。テスト環境の詳細については、本記事末尾の方法論セクションを参照のこと。</p>
<h3 id="FLAT-Good-for-searching-relatively-small-million-scale-datasets-when-100-recall-is-required" class="common-anchor-header">FLAT：100%の再現率が求められる比較的小規模な（100万件規模の）データセットの検索に適している。</h3><p>完璧な精度が要求され、比較的小規模（100万スケール）のデータセットに依存するベクトル類似検索アプリケーションには、FLATインデックスが適している。FLATはベクトルを圧縮せず、正確な検索結果を保証できる唯一のインデックスである。FLATの結果は、再現率が100%に満たない他のインデックスが生成した結果の比較対象としても使用できる。</p>
<p>FLATが正確なのは、検索に網羅的なアプローチをとるからである。つまり、クエリごとに、対象となる入力がデータセット内のすべてのベクトルと比較される。このため、FLATは我々のリストの中で最も遅いインデックスであり、膨大なベクトルデータのクエリには適していない。MilvusにはFLATインデックス用のパラメータはなく、FLATインデックスを使用するためにデータトレーニングや追加ストレージを必要としない。</p>
<h4 id="FLAT-performance-test-results" class="common-anchor-header">FLATパフォーマンステスト結果</h4><p>Milvusにおいて、200万個の128次元ベクトルからなるデータセットを使用し、FLATクエリ時間のパフォーマンステストを実施しました。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_2_f34fb95d65.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_2.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_2.png" />
   </span> <span class="img-wrapper"> <span>ブログ_ベクトルインデックスによるビッグデータの類似検索の高速化_2.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">重要なポイント</h4><ul>
<li>nq（クエリの対象ベクトル数）が増加すると、クエリ時間が増加する。</li>
<li>MilvusのFLATインデックスを使用すると、nqが200を超えるとクエリ時間が急激に増加することがわかります。</li>
<li>一般的に、MilvusをGPUで実行した場合とCPUで実行した場合では、FLATインデックスの方が高速で一貫性があります。しかし、nqが20以下の場合、CPUでのFLATクエリの方が高速です。</li>
</ul>
<h3 id="IVFFLAT-Improves-speed-at-the-expense-of-accuracy-and-vice-versa" class="common-anchor-header">IVF_FLAT：IVF_FLAT：精度を犠牲にして速度を向上させる（逆も同様）。</h3><p>精度を犠牲にして類似検索プロセスを高速化する一般的な方法は、近似最近傍（ANN）検索を行うことである。ANN アルゴリズムは、類似したベクトルをクラスタリングすることで、ストレージ要件と計算負荷を削減し、ベクトル検索を高速化します。IVF_FLATは最も基本的な転置ファイルインデックスタイプで、ANN検索の一形態に依存しています。</p>
<p>IVF_FLATはベクトルデータをいくつかのクラスタ単位（nlist）に分割し、対象となる入力ベクトルと各クラスタの中心との距離を比較します。システムがクエリに設定するクラスタ数(nprobe)に応じて、ターゲット入力と最も類似したクラスタ(複数可)内のベクトルとの比較に基づく類似性検索結果が返され、クエリ時間が大幅に短縮されます。</p>
<p>nprobeを調整することで、シナリオに応じた精度と速度の理想的なバランスを見つけることができます。IVF_FLATの性能テストの結果は、ターゲット入力ベクトルの数(nq)と検索するクラスタの数(nprobe)の両方が増加すると、クエリ時間が急激に増加することを示しています。IVF_FLATはベクトルデータを圧縮しませんが、インデックスファイルにはメタデータが含まれるため、インデックスを持たない生のベクトルデータセットと比較すると、ストレージ要件はわずかに増加します。</p>
<h4 id="IVFFLAT-performance-test-results" class="common-anchor-header">IVF_FLATのパフォーマンステスト結果</h4><p>10億個の128次元ベクトルを含む公開1B SIFTデータセットを用いて、milvusでIVF_FLATのクエリ時間性能テストを実施しました。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_3_92055190d7.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_3.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_3.png" />
   </span> <span class="img-wrapper"> <span>ブログ_ベクトルインデックスによるビッグデータの類似検索の高速化_3.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">主な要点</h4><ul>
<li>MilvusのIVF_FLATインデックスのクエリ時間は、CPU上で実行する場合、nprobeとnqの両方で増加する。つまり、クエリに含まれる入力ベクトルが多ければ多いほど、あるいはクエリが検索するクラスタ数が多ければ多いほど、クエリ時間は長くなります。</li>
<li>GPUの場合、nqとnprobeの変化に対するインデックスの時間変動は少ない。これは、インデックスデータが大きく、CPUメモリからGPUメモリへのデータコピーがクエリ時間全体の大半を占めるためです。</li>
<li>nq = 1,000、nprobe = 32を除くすべてのシナリオにおいて、IVF_FLATインデックスはCPU上で実行された方が効率的である。</li>
</ul>
<p>100万個の128次元ベクトルを含む1M SIFTデータセットと、100万個以上の200次元ベクトルを含むglove-200-angularデータセットの両方をインデックス構築に使用し、MilvusでIVF_FLATの想起性能テストを実施した（nlist = 16,384）。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_4_8c8a6b628e.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_4.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_4.png" />
   </span> <span class="img-wrapper"> <span>ブログ_ベクトル・インデックスによるビッグデータ上の類似検索の高速化_4.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">重要なポイント</h4><ul>
<li>IVF_FLATインデックスは精度を最適化でき、nprobe = 256の場合、1M SIFTデータセットで0.99を超える再現率を達成。</li>
</ul>
<h3 id="IVFSQ8-Faster-and-less-resource-hungry-than-IVFFLAT-but-also-less-accurate" class="common-anchor-header">IVF_SQ8：IVF_FLATよりも高速でリソースを消費しないが、精度も劣る。</h3><p>IVF_FLATは圧縮を行わないため、生成されるインデックスファイルは、インデックスを持たない生のベクトルデータとほぼ同じサイズになります。例えば、元の 1B SIFT データセットが 476 GB の場合、IVF_FLAT のインデックスファイルは若干大きくなります（~470 GB）。すべてのインデックスファイルをメモリにロードすると、470GBのストレージを消費します。</p>
<p>ディスク、CPU、GPU のメモリリソースが限られている場合は、IVF_FLAT よりも IVF_SQ8 の方が適しています。このインデックスタイプは、スカラー量子化を行うことで、各FLOAT（4バイト）をUINT8（1バイト）に変換することができます。これにより、ディスク、CPU、GPUのメモリ消費量が70～75%削減される。1B SIFT データセットでは、IVF_SQ8 インデックスファイルに必要なストレージはわずか 140 GB です。</p>
<h4 id="IVFSQ8-performance-test-results" class="common-anchor-header">IVF_SQ8のパフォーマンステスト結果：</h4><p>10億個の128次元ベクトルを含む1B SIFTデータセットをインデックス構築に使用し、MilvusでIVF_SQ8のクエリ時間テストを実施。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_5_467fafbec4.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_5.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_5.png" />
   </span> <span class="img-wrapper"> <span>ブログ_ベクトルインデックスによるビッグデータの類似検索の高速化_5.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">主な要点</h4><ul>
<li>インデックスファイルのサイズを小さくすることで、IVF_SQ8はIVF_FLATと比較してパフォーマンスが大幅に向上します。IVF_SQ8はIVF_FLATと同様のパフォーマンスカーブを描いており、nqとnprobeによってクエリ時間が増加します。</li>
<li>IVF_FLATと同様に、IVF_SQ8はCPU上で実行され、nqとnprobeが小さいほど高速になります。</li>
</ul>
<p>IVF_SQ8の想起性能テストは、100万個の128次元ベクトルを含む公開1M SIFTデータセットと、100万個以上の200次元ベクトルを含むglove-200-angularデータセットの両方をインデックス構築に使用し、Milvusで実施された（nlist = 16,384）。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_6_b1e0e5b6a5.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_6.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_6.png" />
   </span> <span class="img-wrapper"> <span>ブログ_ベクトル・インデックスによるビッグデータ上の類似検索の高速化_6.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">重要なポイント</h4><ul>
<li>元データを圧縮したにもかかわらず、IVF_SQ8はクエリの精度を大きく低下させない。様々なnprobe設定において、IVF_SQ8はIVF_FLATよりも最大でも1%低い再現率。</li>
</ul>
<h3 id="IVFSQ8H-New-hybrid-GPUCPU-approach-that-is-even-faster-than-IVFSQ8" class="common-anchor-header">IVF_SQ8H：IVF_SQ8よりもさらに高速な新しいGPU/CPUハイブリッドアプローチ。</h3><p>IVF_SQ8Hは、IVF_SQ8よりもクエリ性能を向上させる新しいインデックスタイプです。CPU上で動作するIVF_SQ8インデックスをクエリする場合、クエリ時間の大半はターゲット入力ベクトルに最も近いnprobeクラスタを見つけることに費やされます。クエリ時間を短縮するために、IVF_SQ8は、インデックスファイルよりも小さい粗量子化器演算用のデータをGPUメモリにコピーし、粗量子化器演算を大幅に高速化します。次にgpu_search_thresholdが、どのデバイスがクエリを実行するかを決定します。nq &gt;= gpu_search_thresholdの場合、GPUがクエリーを実行し、そうでない場合はCPUがクエリーを実行します。</p>
<p>IVF_SQ8Hはハイブリッド・インデックス・タイプで、CPUとGPUが一緒に動作する必要があります。GPU対応のMilvusでのみ使用可能です。</p>
<h4 id="IVFSQ8H-performance-test-results" class="common-anchor-header">IVF_SQ8Hパフォーマンステスト結果：</h4><p>10億個の128次元ベクトルを含む公開1B SIFTデータセットをインデックス構築に使用し、MilvusでIVF_SQ8Hのクエリ時間性能テストを実施しました。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_7_b70bfe8bce.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_7.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_7.png" />
   </span> <span class="img-wrapper"> <span>ブログ_ベクトルインデックスによるビッグデータの類似検索の高速化_7.png</span> </span></p>
<h4 id="Key-takeaways" class="common-anchor-header">主な要点</h4><ul>
<li>nqが1,000以下の場合、IVF_SQ8HはIVFSQ8の約2倍のクエリ時間を実現。</li>
<li>nq = 2000 の場合、IVFSQ8H と IVF_SQ8 のクエリ時間は同じです。しかし、gpu_search_threshold パラメータが 2000 より低い場合、IVF_SQ8H は IVF_SQ8 を上回ります。</li>
<li>IVF_SQ8Hのクエリリコール率はIVF_SQ8と同じであり、検索精度を落とすことなくクエリ時間を短縮することができます。</li>
</ul>
<h3 id="Learn-more-about-Milvus-a-massive-scale-vector-data-management-platform" class="common-anchor-header">大規模ベクトルデータ管理プラットフォームMilvusの詳細はこちら。</h3><p>Milvusは、人工知能、ディープラーニング、伝統的なベクトル計算などの分野における類似検索アプリケーションを強力にサポートするベクトルデータ管理プラットフォームです。Milvusに関する追加情報については、以下のリソースをご覧ください：</p>
<ul>
<li>Milvusは<a href="https://github.com/milvus-io/milvus">GitHubの</a>オープンソースライセンスで利用可能です。</li>
<li>Milvusでは、グラフおよびツリーベースのインデックスを含む、追加のインデックスタイプがサポートされています。サポートされているインデックスタイプの包括的なリストについては、Milvusの<a href="https://milvus.io/docs/v0.11.0/index.md">ベクトルインデックスに関するドキュメントを</a>ご覧ください。</li>
<li>Milvusを立ち上げた会社についての詳細は、<a href="https://zilliz.com/">Zilliz.comを</a>ご覧ください。</li>
<li>Milvusコミュニティとチャットしたり、<a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slackで</a>問題を解決することができます。</li>
</ul>
<h3 id="Methodology" class="common-anchor-header">方法論</h3><h4 id="Performance-testing-environment" class="common-anchor-header">パフォーマンステスト環境</h4><p>本記事で参照したパフォーマンステストで使用したサーバー構成は以下の通り：</p>
<ul>
<li>Intel ® Xeon ® Platinum 8163 @ 2.50GHz、24コア</li>
<li>GeForce GTX 2080Ti x 4</li>
<li>768 GBメモリ</li>
</ul>
<h4 id="Relevant-technical-concepts" class="common-anchor-header">関連する技術概念</h4><p>この記事を理解するのに必要ではありませんが、インデックス・パフォーマンス・テストの結果を解釈するのに役立つ技術的概念をいくつか紹介します：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Blog_Accelerating_Similarity_Search_on_Really_Big_Data_with_Vector_Indexing_8_a6c1de937f.png" alt="Blog_Accelerating Similarity Search on Really Big Data with Vector Indexing_8.png" class="doc-image" id="blog_accelerating-similarity-search-on-really-big-data-with-vector-indexing_8.png" />
   </span> <span class="img-wrapper"> <span>ブログ_ベクターインデクシングによるビッグデータでの類似検索の高速化_8.png</span> </span></p>
<h4 id="Resources" class="common-anchor-header">リソース</h4><p>本記事では以下のソースを使用した：</p>
<ul>
<li><a href="https://books.google.com/books/about/Encyclopedia_of_Database_Systems.html?id=YdT3wQEACAAJ">「データベースシステム百科事典</a>」、Ling Liu、M. Tamer Özsu.</li>
</ul>
