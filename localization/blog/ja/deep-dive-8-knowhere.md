---
id: deep-dive-8-knowhere.md
title: Milvusベクターデータベースの類似性検索とは？
author: Yudong Cai
date: 2022-05-10T00:00:00.000Z
desc: それにフェイスじゃない。
cover: assets.zilliz.com/Deep_Dive_8_6919720d59.png
tag: Engineering
tags: 'Data science, Database, Tech, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-8-knowhere.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Deep_Dive_8_6919720d59.png" alt="cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>カバー画像</span> </span></p>
<blockquote>
<p>この記事は<a href="https://github.com/cydrain">蔡佑東が</a>執筆し、<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">アンジェラ・ニーが</a>翻訳した。</p>
</blockquote>
<p>中核となるベクトル実行エンジンとして、MilvusにとってのKnowhereは、スポーツカーにとってのエンジンのようなものだ。この記事では、Knowhereとは何か、Faissとどう違うのか、Knowhereのコードはどのような構造になっているのかを紹介する。</p>
<p><strong>ジャンプ</strong></p>
<ul>
<li><a href="#The-concept-of-Knowhere">Knowhereのコンセプト</a></li>
<li><a href="#Knowhere-in-the-Milvus-architecture">MilvusアーキテクチャにおけるKnowhere</a></li>
<li><a href="#Knowhere-Vs-Faiss">KnowhereとFaissの比較</a></li>
<li><a href="#Understanding-the-Knowhere-code">Knowhere のコードを理解する</a></li>
<li><a href="#Adding-indexes-to-Knowhere">Knowhereへのインデックスの追加</a></li>
</ul>
<h2 id="The-concept-of-Knowhere" class="common-anchor-header">Knowhereの概念<button data-href="#The-concept-of-Knowhere" class="anchor-icon" translate="no">
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
    </button></h2><p>Knowhereは狭義には、システムの上位層でサービスにアクセスするための操作インターフェースであり、システムの下位層で<a href="https://github.com/facebookresearch/faiss">Faiss</a>、<a href="https://github.com/nmslib/hnswlib">Hnswlib</a>、<a href="https://github.com/spotify/annoy">Annoyの</a>ようなベクトル類似検索ライブラリにアクセスするためのものである。さらに、Knowhereはヘテロジニアス・コンピューティングも担当している。具体的には、Knowhereはインデックス構築や検索要求をどのハードウェア（CPUやGPUなど）で実行するかを制御する。これがKnowhereの名前の由来である、どこで処理を実行するかを知っているということです。将来のリリースでは、DPUやTPUを含むより多くの種類のハードウェアがサポートされる予定です。</p>
<p>より広い意味では、KnowhereはFaissのようなサードパーティのインデックス・ライブラリも組み込んでいます。したがって全体として、KnowhereはMilvusベクトル・データベースの中核となるベクトル計算エンジンとして認識されています。</p>
<p>Knowhereのコンセプトから、Knowhereはデータ計算タスクのみを処理し、シャーディング、ロードバランス、ディザスタリカバリなどのタスクはKnowhereの作業範囲外であることがわかります。</p>
<p>Milvus 2.0.1以降、<a href="https://github.com/milvus-io/knowhere">Knowhereは</a>Milvusプロジェクトから独立しました。</p>
<h2 id="Knowhere-in-the-Milvus-architecture" class="common-anchor-header">MilvusアーキテクチャにおけるKnowhere<button data-href="#Knowhere-in-the-Milvus-architecture" class="anchor-icon" translate="no">
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
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/ec63d1e9_86e1_48e3_9d75_8fed305bbcb5_26b842e9f6.png" alt="knowhere architecture" class="doc-image" id="knowhere-architecture" />
   </span> <span class="img-wrapper"> <span>Knowhereアーキテクチャ</span> </span></p>
<p>Milvusの計算には主にベクトル演算とスカラー演算が含まれます。KnowhereはMilvusのベクトル演算のみを扱います。上の図はMilvusにおけるKnowhereアーキテクチャを示しています。</p>
<p>一番下の層はシステム・ハードウェアです。サードパーティのインデックス・ライブラリはハードウェアの上にあります。そして、KnowhereはCGOを介して最上層のインデックス・ノードやクエリ・ノードとやり取りします。</p>
<p>本記事では、アーキテクチャ図の青枠で囲んだ、より広い意味でのKnowhereについて説明します。</p>
<h2 id="Knowhere-Vs-Faiss" class="common-anchor-header">KnowhereとFaissの比較<button data-href="#Knowhere-Vs-Faiss" class="anchor-icon" translate="no">
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
    </button></h2><p>KnowhereはFaissの機能をさらに拡張するだけでなく、パフォーマンスも最適化します。具体的には、Knowhereには次のような利点があります。</p>
<h3 id="1-Support-for-BitsetView" class="common-anchor-header">1.BitsetViewのサポート</h3><p>当初、milvusでは「ソフト削除」の目的でビットセットが導入されました。ソフト削除されたベクトルはまだデータベースに存在しますが、ベクトルの類似性検索やクエリの際に計算されることはありません。ビットセットの各ビットはインデックス付きベクトルに対応する。あるベクトルがビットセットで "1 "とマークされた場合、このベクトルはソフト削除され、ベクトル検索に関与しないことを意味する。</p>
<p>bitset パラメータは、CPU および GPU インデックスを含む、Knowhere で公開されているすべての Faiss インデックス照会 API に追加されます。</p>
<p><a href="https://milvus.io/blog/2022-2-14-bitset.md">bitsetがどのようにベクトル検索の汎用性を実現しているかについては</a>、こちらをご覧ください。</p>
<h3 id="2-Support-for-more-similarity-metrics-for-indexing-binary-vectors" class="common-anchor-header">2.バイナリ・ベクトルのインデックス作成におけるより多くの類似性メトリクスのサポート</h3><p>Knowhereは<a href="https://milvus.io/docs/v2.0.x/metric.md#Hamming-distance">ハミング</a>以外にも、<a href="https://milvus.io/docs/v2.0.x/metric.md#Jaccard-distance">Jaccard</a>、<a href="https://milvus.io/docs/v2.0.x/metric.md#Tanimoto-distance">Tanimoto</a>、<a href="https://milvus.io/docs/v2.0.x/metric.md#Superstructure">Superstructure</a>、<a href="https://milvus.io/docs/v2.0.x/metric.md#Substructure">Substructureを</a>サポートしています。JaccardとTanimotoは2つのサンプルセット間の類似性を測定するために使用でき、SuperstructureとSubstructureは化学構造の類似性を測定するために使用できます。</p>
<h3 id="3-Support-for-AVX512-instruction-set" class="common-anchor-header">3.AVX512命令セットのサポート</h3><p>Faiss自体は、<a href="https://en.wikipedia.org/wiki/AArch64">AArch64</a>、<a href="https://en.wikipedia.org/wiki/SSE4#SSE4.2">SSE4.2</a>、<a href="https://en.wikipedia.org/wiki/Advanced_Vector_Extensions">AVX</a>2を含む複数の命令セットをサポートしています。Knowhereは<a href="https://en.wikipedia.org/wiki/AVX-512">AVX512を</a>追加することでサポートする命令セットをさらに拡張し、AVX2と比較して<a href="https://milvus.io/blog/milvus-performance-AVX-512-vs-AVX2.md">インデックス構築とクエリの性能を20%から30%向上させる</a>ことができます。</p>
<h3 id="4-Automatic-SIMD-instruction-selection" class="common-anchor-header">4.SIMD 命令の自動選択</h3><p>Knowhere は、さまざまな SIMD 命令（SIMD SSE、AVX、AVX2、AVX512 など）を持つ幅広い CPU プロセッサー（オンプレミ スとクラウドの両方のプラットフォーム）で動作するように設計されています。したがって、1つのソフトウェアバイナリ（すなわちMilvus）が与えられた場合、どのCPUプロセッサ上でも適切なSIMD命令を自動的に呼び出すようにするにはどうすればよいかという課題があります。FaissはSIMD命令の自動選択をサポートしておらず、ユーザーはコンパイル時にSIMDフラグ（例えば"-msse4"）を手動で指定する必要があります。ただし、Knowhere は Faiss のコードベースをリファクタリングして構築されています。SIMDアクセラレーションに依存する一般的な関数（類似度計算など）はファクタアウトされます。次に、各関数について4つのバージョン（すなわち、SSE、AVX、AVX2、AVX512）が実装され、それぞれが別々のソースファイルに入れられます。その後、ソースファイルは対応する SIMD フラグで個別にコンパイルされます。したがって、Knowhere は実行時に現在の CPU フラグに基づいて最適な SIMD 命令を自動的に選択し、フッキングを使用して適切な関数ポインタをリンクします。</p>
<h3 id="5-Other-performance-optimization" class="common-anchor-header">5.その他の性能最適化</h3><p>Knowhereのパフォーマンス最適化については、<a href="https://www.cs.purdue.edu/homes/csjgwang/pubs/SIGMOD21_Milvus.pdf">Milvus: A Purpose-Built Vector Data Management Systemを</a>参照してください。</p>
<h2 id="Understanding-the-Knowhere-code" class="common-anchor-header">Knowhereコードを理解する<button data-href="#Understanding-the-Knowhere-code" class="anchor-icon" translate="no">
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
    </button></h2><p>最初のセクションで述べたように、Knowhere はベクトル検索処理のみを行います。そのため、Knowhere はエンティティのベクトルフィールドのみを処理します（現在、コレクション内のエンティティのベクトルフィールドは 1 つしかサポートされていません）。インデックス構築とベクトル類似性検索も、セグメント内のベクトルフィールドを対象とします。データモデルについての理解を深めるには、<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Data-Model">こちらの</a>ブログをご覧ください。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Entity_fields_6aa517cc4c.png" alt="entity fields" class="doc-image" id="entity-fields" />
   </span> <span class="img-wrapper"> <span>エンティティフィールド</span> </span></p>
<h3 id="Index" class="common-anchor-header">インデックス</h3><p>インデックスは、元のベクトルデータから独立したデータ構造の一種です。インデックスの作成には、インデックスの作成、データの学習、データの挿入、インデックスの構築という4つのステップが必要である。</p>
<p>AIアプリケーションの一部では、データセットのトレーニングはベクトル検索とは別のプロセスである。この種のアプリケーションでは、まずデータセットのデータが学習され、類似検索のためにMilvusのようなベクトルデータベースに挿入される。sift1Mやsift1Bのようなオープンデータセットは、トレーニングとテストのためのデータを提供する。しかし、Knowhereでは学習用データと検索用データが混在しています。つまり、Knowhereはセグメント内のすべてのデータを学習し、学習したすべてのデータを挿入してインデックスを作成します。</p>
<h3 id="Knowhere-code-structure" class="common-anchor-header">Knowhere のコード構造</h3><p>DataObjはKnowhereのすべてのデータ構造の基本クラスです。<code translate="no">Size()</code> はDataObjの唯一の仮想メソッドです。Index クラスは DataObj を継承し、&quot;size_&quot; というフィールドを持ちます。また、Index クラスには<code translate="no">Serialize()</code> と<code translate="no">Load()</code> の 2 つの仮想メソッドがあります。Indexから派生したVecIndexクラスは、全てのベクトル・インデックスの仮想基底クラスです。VecIndex は<code translate="no">Train()</code>,<code translate="no">Query()</code>,<code translate="no">GetStatistics()</code>,<code translate="no">ClearStatistics()</code> などのメソッドを提供します。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Knowhere_base_classes_9d610618d9.png" alt="base clase" class="doc-image" id="base-clase" />
   </span> <span class="img-wrapper"> <span>基底クラス</span> </span></p>
<p>他のインデックス・タイプは上図の右側にリストされている。</p>
<ul>
<li>Faissインデックスには2つのサブクラスがあります：FaissBaseIndexは浮動小数点ベクトル上のすべてのインデックス用で、FaissBaseBinaryIndexはバイナリベクトル上のすべてのインデックス用です。</li>
<li>GPUIndexはすべてのFaiss GPUインデックスの基本クラスです。</li>
<li>OffsetBaseIndex はすべての自己開発インデックスの基本クラスです。インデックスファイルにはベクトルIDのみが格納されます。その結果、128 次元ベクトル用のインデックス・ファイル・サイズを 2 桁小さくすることができます。このタイプのインデックスをベクトルの類似性検索に使用する場合は、元のベクトルも考慮することを推奨する。</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IDMAP_8773a4511c.png" alt="IDMAP" class="doc-image" id="idmap" />
   </span> <span class="img-wrapper"> <span>IDMAP</span> </span></p>
<p>技術的に言えば、<a href="https://github.com/facebookresearch/faiss/wiki/Guidelines-to-choose-an-index#then-flat">IDMAPは</a>インデックスではなく、ブルートフォース検索に使用される。ベクトルがベクトル・データベースに挿入されると、データの学習とインデックスの構築は必要ない。検索は挿入されたベクトルデータに対して直接行われる。</p>
<p>しかし、コードの一貫性を保つために、IDMAPはVecIndexクラスとそのすべての仮想インターフェースを継承している。IDMAPの使い方は他のインデックスと同じです。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/IVF_42b0f123d1.png" alt="IVF" class="doc-image" id="ivf" />
   </span> <span class="img-wrapper"> <span>IVF</span> </span></p>
<p>IVF（転置ファイル）インデックスは最も頻繁に使用されるインデックスです。IVFクラスはVecIndexとFaissBaseIndexから派生し、さらにIVFSQとIVFPQに拡張されています。GPUIVFはGPUIndexとIVFから派生したものです。GPUIVFはGPUIndexとIVFから派生し、さらにGPUIVFSQとGPUIVFPQに拡張されます。</p>
<p>IVFSQHybridはGPU上で粗い量子化によって実行されるハイブリッドインデックスを独自に開発したクラスです。バケット内の検索はCPUで実行されます。GPUの計算能力を活用することで、CPUとGPU間のメモリコピーの発生を抑えることができます。IVFSQHybridはGPUIVFSQと同じ再現率を持つが、性能は向上している。</p>
<p>バイナリ・インデックスの基本クラス構造は比較的単純です。BinaryIDMAPとBinaryIVFはFaissBaseBinaryIndexとVecIndexから派生している。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/third_party_index_34ad029848.png" alt="third-party index" class="doc-image" id="third-party-index" />
   </span> <span class="img-wrapper"> <span>サードパーティインデックス</span> </span></p>
<p>現在、Faiss以外のサードパーティインデックスは、ツリーベースのインデックスAnnoyとグラフベースのインデックスHNSWの2種類のみがサポートされています。これら 2 つの一般的でよく使用されるサードパーティ・インデックスは、どちらも VecIndex から派生したものです。</p>
<h2 id="Adding-indexes-to-Knowhere" class="common-anchor-header">Knowhere へのインデックスの追加<button data-href="#Adding-indexes-to-Knowhere" class="anchor-icon" translate="no">
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
    </button></h2><p>Knowhere に新しいインデックスを追加する場合は、まず既存のインデックスを参照します：</p>
<ul>
<li>量子化ベースのインデックスを追加するには、IVF_FLAT を参照してください。</li>
<li>グラフベースのインデックスを追加するには、HNSW を参照してください。</li>
<li>ツリーベースのインデックスを追加するには、Annoyを参照してください。</li>
</ul>
<p>既存のインデックスを参照した後、以下の手順に従って新しいインデックスを Knowhere に追加できます。</p>
<ol>
<li><code translate="no">IndexEnum</code> に新しいインデックスの名前を追加します。データ型は文字列です。</li>
<li>ファイル<code translate="no">ConfAdapter.cpp</code> で、新しいインデックスにデータ検証チェックを追加します。検証チェックは、主にデータ学習とクエリのパラメータを検証するためのものです。</li>
<li>新しいインデックス用に新しいファイルを作成します。新しいインデックスの基底クラスには、<code translate="no">VecIndex</code> と<code translate="no">VecIndex</code> の必要な仮想インタフェースを含める。</li>
<li>新しいインデックスのインデックス構築ロジックを<code translate="no">VecIndexFactory::CreateVecIndex()</code> に追加する。</li>
<li><code translate="no">unittest</code> ディレクトリの下に単体テストを追加します。</li>
</ol>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">ディープ・ダイブ・シリーズについて<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.0の<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">一般提供の正式発表に</a>伴い、Milvusのアーキテクチャとソースコードの詳細な解釈を提供するために、このMilvus Deep Diveブログシリーズを企画しました。このブログシリーズで扱うトピックは以下の通りです：</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvusアーキテクチャの概要</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">APIとPython SDK</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">データ処理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">データ管理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">リアルタイムクエリ</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">スカラー実行エンジン</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">QAシステム</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">ベクトル実行エンジン</a></li>
</ul>
