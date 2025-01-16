---
id: molecular-structure-similarity-with-milvus.md
title: はじめに
author: Shiyu Chen
date: 2020-02-06T19:08:18.815Z
desc: Milvusでの分子構造類似性解析の実行方法
cover: assets.zilliz.com/header_44d6b6aacd.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/molecular-structure-similarity-with-milvus'
---
<custom-h1>新薬創製の加速</custom-h1><h2 id="Introduction" class="common-anchor-header">はじめに<button data-href="#Introduction" class="anchor-icon" translate="no">
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
    </button></h2><p>創薬は医薬品イノベーションの源泉として、新薬研究開発の重要な部分を占めている。創薬はターゲットの選択と確認によって実施される。フラグメントやリード化合物が発見された場合、構造活性相関（SAR）や化合物の利用可能性を発見するために、通常、社内または市販の化合物ライブラリーから類似化合物を検索し、リード化合物が候補化合物に最適化される可能性を評価する。</p>
<p>億単位の化合物ライブラリーからフラグメント空間内で利用可能な化合物を発見するためには、通常、化学的フィンガープリントを検索して部分構造検索と類似性検索を行う。しかし、10億スケールの高次元化学フィンガープリントを検索する場合、従来の方法では時間がかかり、エラーも発生しやすい。また、その過程で失われる可能性のある化合物もある。本稿では、Milvus（大規模ベクトル用類似性検索エンジン）をRDKitと組み合わせて使用し、高性能な化学構造類似性検索システムを構築する方法について述べる。</p>
<p>Milvusは従来の手法と比較して、検索速度が速く、対象範囲が広い。Milvusは化学フィンガープリントを処理することで、化学構造ライブラリの部分構造検索、類似性検索、完全検索を実行し、潜在的な医薬品を発見することができる。</p>
<h2 id="System-overview" class="common-anchor-header">システム概要<button data-href="#System-overview" class="anchor-icon" translate="no">
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
    </button></h2><p>本システムでは、RDKitを用いて化学フィンガープリントを生成し、Milvusを用いて化学構造の類似性検索を行います。システムの詳細については https://github.com/milvus-io/bootcamp/tree/master/solutions/molecular_similarity_search を参照してください。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_system_overview_4b7c2de377.png" alt="1-system-overview.png" class="doc-image" id="1-system-overview.png" />
   </span> <span class="img-wrapper"> <span>1-システム概要.png</span> </span></p>
<h2 id="1-Generating-chemical-fingerprints" class="common-anchor-header">1.化学フィンガープリントの生成<button data-href="#1-Generating-chemical-fingerprints" class="anchor-icon" translate="no">
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
    </button></h2><p>化学フィンガープリントは通常、部分構造検索と類似性検索に使用される。以下の画像はビットで表現された連続リストを示している。各桁は元素、原子ペア、または官能基を表す。化学構造は<code translate="no">C1C(=O)NCO1</code> 。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_identifying_patterns_molecules_2aeef349c8.png" alt="2-identifying-patterns-molecules.png" class="doc-image" id="2-identifying-patterns-molecules.png" />
   </span> <span class="img-wrapper"> <span>2-識別パターン-分子.png</span> </span></p>
<p>RDKitを使ってモーガンフィンガープリントを生成することができます。これは特定の原子から半径を定義し、半径の範囲内にある化学構造の数を計算して化学フィンガープリントを生成します。異なる化学構造の化学指紋を取得するために、半径とビットに異なる値を指定します。化学構造はSMILES形式で表現される。</p>
<pre><code translate="no">from rdkit import Chem
mols = Chem.MolFromSmiles(smiles)
mbfp = AllChem.GetMorganFingerprintAsBitVect(mols, radius=2, bits=512)
mvec = DataStructs.BitVectToFPSText(mbfp)
</code></pre>
<h2 id="2-Searching-chemical-structures" class="common-anchor-header">2.化学構造の検索<button data-href="#2-Searching-chemical-structures" class="anchor-icon" translate="no">
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
    </button></h2><p>次に、Milvusにモーガンフィンガープリントをインポートし、化学構造データベースを構築します。異なる化学フィンガープリントを用いて、Milvusは部分構造検索、類似性検索、厳密検索を行うことができる。</p>
<pre><code translate="no">from milvus import Milvus
Milvus.add_vectors(table_name=MILVUS_TABLE, records=mvecs)
Milvus.search_vectors(table_name=MILVUS_TABLE, query_records=query_mvec, top_k=topk)
</code></pre>
<h3 id="Substructure-search" class="common-anchor-header">部分構造検索</h3><p>化学構造が他の化学構造を含むかどうかをチェックします。</p>
<h3 id="Similarity-search" class="common-anchor-header">類似性検索</h3><p>類似した化学構造を検索します。デフォルトでは谷本距離が使用されます。</p>
<h3 id="Exact-search" class="common-anchor-header">厳密検索</h3><p>指定した化学構造が存在するかどうかを調べる。この種の検索には完全一致が必要。</p>
<h2 id="Computing-chemical-fingerprints" class="common-anchor-header">化学フィンガープリントの計算<button data-href="#Computing-chemical-fingerprints" class="anchor-icon" translate="no">
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
    </button></h2><p>谷本距離は化学指紋の指標としてよく使用される。MilvusではJaccard距離が谷本距離に相当する。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_computing_chem_fingerprings_table_1_3814744fce.png" alt="3-computing-chem-fingerprings-table-1.png" class="doc-image" id="3-computing-chem-fingerprings-table-1.png" />
   </span> <span class="img-wrapper"> <span>3-化学フィンガープリントの計算-表-1.png</span> </span></p>
<p>前述のパラメータに基づき、化学指紋の計算は次のように記述できる：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_computing_chem_fingerprings_table_2_7d16075836.png" alt="4-computing-chem-fingerprings-table-2.png" class="doc-image" id="4-computing-chem-fingerprings-table-2.png" />
   </span> <span class="img-wrapper"> <span>4-計算-化学指紋-表-2.png</span> </span></p>
<p><code translate="no">1- Jaccard = Tanimoto</code> であることがわかる。ここではmilvusのJaccardを使って化学指紋を計算しているが、実際には谷本距離と一致している。</p>
<h2 id="System-demo" class="common-anchor-header">システムのデモ<button data-href="#System-demo" class="anchor-icon" translate="no">
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
    </button></h2><p>システムがどのように機能するかをよりよく示すために、我々はMilvusを使って9000万以上の化学フィンガープリントを検索するデモを作成しました。使用されたデータは ftp://ftp.ncbi.nlm.nih.gov/pubchem/Compound/CURRENT-Full/SDF からのものです。初期インターフェースは以下のようになる：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_system_demo_1_46c6e6cd96.jpg" alt="5-system-demo-1.jpg" class="doc-image" id="5-system-demo-1.jpg" />
   </span> <span class="img-wrapper"> <span>5-system-demo-1.jpg</span> </span></p>
<p>システム内で指定した化学構造を検索し、類似した化学構造を返す：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_system_demo_2_19d6cd8f92.gif" alt="6-system-demo-2.gif" class="doc-image" id="6-system-demo-2.gif" />
   </span> <span class="img-wrapper"> <span>6-system-demo-2.gif</span> </span></p>
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
    </button></h2><p>類似性検索は、画像や映像など様々な分野で必要不可欠である。創薬においては、類似性検索を化学構造データベースに適用することで、潜在的に利用可能な化合物を発見することができる。Milvusは、大規模特徴ベクトルのためのオープンソースの類似性検索エンジンとして、最高のコスト効率を実現するためにヘテロジニアスコンピューティングアーキテクチャで構築されている。億スケールのベクトルに対する検索は、最小限の計算資源でわずか数ミリ秒しかかかりません。このように、Milvusは生物学や化学などの分野で正確で高速な化学構造検索を実現するのに役立ちます。</p>
<p>Milvusのデモは、http://40.117.75.127:8002/。また、GitHub https://github.com/milvus-io/milvus！</p>
