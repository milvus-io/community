---
id: select-index-parameters-ivf-index.md
title: 1.index_file_size
author: milvus
date: 2020-02-26T22:57:02.071Z
desc: 体外受精指標のベストプラクティス
cover: assets.zilliz.com/header_4d3fc44879.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/select-index-parameters-ivf-index'
---
<custom-h1>IVFインデックスのパラメータ選択方法</custom-h1><p><a href="https://medium.com/@milvusio/best-practices-for-milvus-configuration-f38f1e922418">Milvus設定のベストプラクティスでは</a>、Milvus 0.6.0設定のベストプラクティスを紹介しました。今回は、Milvusクライアントにおいて、テーブルの作成、インデックスの作成、検索などの操作を行う際の主要なパラメータを設定する際のベストプラクティスについても紹介します。これらのパラメータは検索性能に影響を与えます。</p>
<h2 id="1-codeindexfilesizecode" class="common-anchor-header">1.<code translate="no">index_file_size</code><button data-href="#1-codeindexfilesizecode" class="anchor-icon" translate="no">
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
    </button></h2><p>テーブルを作成する際、index_file_sizeパラメータを使用して、データ格納用の単一ファイルのサイズをMB単位で指定します。デフォルトは1024です。ベクターデータをインポートする際、Milvusはデータをインクリメンタルにファイルに結合します。ファイルサイズがindex_file_sizeに達すると、このファイルは新しいデータを受け付けず、Milvusは新しいデータを別のファイルに保存します。これらはすべて生データファイルである。インデックスが作成されると、Milvusは各rawデータファイルに対してインデックスファイルを生成します。IVFLATインデックスタイプの場合、インデックスファイルのサイズは対応する生データファイルのサイズにほぼ等しくなります。SQ8インデックスの場合、インデックスファイルのサイズは対応する生データファイルの約30%である。</p>
<p>検索中、Milvusは各インデックスファイルを1つずつ検索します。我々の経験では、index_file_sizeを1024から2048に変更すると、検索性能は30%から50%向上する。しかし、この値が大きすぎると、大きなファイルをGPUメモリ（あるいはCPUメモリ）にロードできないことがあります。たとえば、GPU メモリが 2 GB で index_file_size が 3 GB の場合、インデックス・ファイルは GPU メモリにロードできません。通常、index_file_size を 1024 MB または 2048 MB に設定します。</p>
<p>次の表は、index_file_size に sift50m を使用したテストです。インデックス・タイプはSQ8です。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_sift50m_test_results_milvus_74f60de4aa.png" alt="1-sift50m-test-results-milvus.png" class="doc-image" id="1-sift50m-test-results-milvus.png" />
   </span> <span class="img-wrapper"> <span>1-sift50m-テスト結果-milvus.png</span> </span></p>
<p>CPUモードでもGPUモードでも、index_file_sizeが1024 MBの代わりに2048 MBになると、検索パフォーマンスが大幅に向上することがわかる。</p>
<h2 id="2-codenlistcode-and-codenprobecode" class="common-anchor-header">2.<code translate="no">nlist</code> <strong>と</strong> <code translate="no">nprobe</code><button data-href="#2-codenlistcode-and-codenprobecode" class="anchor-icon" translate="no">
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
    </button></h2><p><code translate="no">nlist</code> パラメーターはインデックス作成に使用され、<code translate="no">nprobe</code> パラメーターは検索に使用されます。IVFLATとSQ8はどちらもクラスタリング・アルゴリズムを使って大量のベクトルをクラスタ（バケット）に分割します。<code translate="no">nlist</code> はクラスタリング中のバケットの数です。</p>
<p>インデックスを使って検索する場合、最初のステップはターゲット・ベクトルに最も近いバケットを一定数見つけることであり、2番目のステップはバケットからベクトル距離によって最も類似したk個のベクトルを見つけることである。<code translate="no">nprobe</code> はステップ1におけるバケット数である。</p>
<p>一般的に、<code translate="no">nlist</code> を増やすとバケット数が増え、クラスタリング中のバケット内のベクトル数が少なくなる。その結果、計算負荷が減少し、検索性能が向上する。しかし、類似度比較のためのベクトルが少なくなると、正しい結果が見落とされる可能性があります。</p>
<p><code translate="no">nprobe</code> を増やすと、検索するバケットが増える。その結果、計算負荷は増加し、検索性能は悪化するが、検索精度は向上する。分布の異なるデータセットごとに状況は異なるかもしれない。<code translate="no">nlist</code> と<code translate="no">nprobe</code> を設定する際には，データセットのサイズも考慮する必要がある．一般に，<code translate="no">nlist</code> は<code translate="no">4 * sqrt(n)</code> とすることが推奨される．ここで n はベクトルの総数である．<code translate="no">nprobe</code> については、精度と効率のトレードオフを行う必要があり、試行錯誤を繰り返して値を決定するのが最良の方法である。</p>
<p>次の表は、<code translate="no">nlist</code> と<code translate="no">nprobe</code> に対して sift50m を使用したテストです。インデックス・タイプはSQ8である。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/sq8_index_test_sift50m_b5daa9f7b5.png" alt="sq8-index-test-sift50m.png" class="doc-image" id="sq8-index-test-sift50m.png" />
   </span> <span class="img-wrapper"> <span>sq8-index-test-sift50m.png</span> </span></p>
<p>この表は、<code translate="no">nlist</code>/<code translate="no">nprobe</code> の異なる値を使用して、検索性能と精度を比較したものです。 CPU と GPU のテストが同様の結果を示したため、GPU の結果のみが表示されています。このテストでは、<code translate="no">nlist</code>/<code translate="no">nprobe</code> の値が同じ割合で増加すると、検索精度も増加します。<code translate="no">nlist</code> = 4096、<code translate="no">nprobe</code> が 128 のとき、Milvus は最高の検索性能を発揮します。結論として、<code translate="no">nlist</code> と<code translate="no">nprobe</code> の値を決定する際には、異なるデータセットと要件を考慮して、性能と精度のトレードオフを行う必要がある。</p>
<h2 id="Summary" class="common-anchor-header">まとめ<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p><code translate="no">index_file_size</code>:データサイズが<code translate="no">index_file_size</code> より大きい場合、<code translate="no">index_file_size</code> の値が大きいほど、検索性能は向上する。<code translate="no">nlist</code> と<code translate="no">nprobe</code>：性能と精度のトレードオフを行う必要がある。</p>
