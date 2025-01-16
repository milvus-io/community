---
id: dynamic-data-update-and-query-milvus.md
title: 準備
author: milvus
date: 2020-04-13T21:02:08.632Z
desc: ベクター検索がより直感的で便利に
cover: assets.zilliz.com/header_62d7b8c823.png
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/dynamic-data-update-and-query-milvus'
---
<custom-h1>Milvusの動的なデータ更新とクエリの実装方法</custom-h1><p>この記事では、主にMilvusのメモリにベクターデータがどのように記録され、その記録がどのように維持されるかについて説明する。</p>
<p>主な設計目標は以下の通りである：</p>
<ol>
<li>データのインポート効率が高いこと。</li>
<li>データインポートの効率が良いこと。</li>
<li>データファイルの断片化を避ける。</li>
</ol>
<p>そのため、データを挿入するためのメモリ・バッファ（挿入バッファ）を設け、ディスクやオペレーティング・システムでのランダムIOのコンテキスト・スイッチの回数を減らし、データ挿入のパフォーマンスを向上させました。MemTableとMemTableFileをベースとしたメモリストレージアーキテクチャにより、より便利にデータを管理しシリアライズすることができる。バッファの状態はMutableとImmutableに分かれており、外部サービスを利用可能な状態に保ちながら、データをディスクに永続化することができる。</p>
<h2 id="Preparation" class="common-anchor-header">準備<button data-href="#Preparation" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusにベクトルを挿入する準備ができたら、まずCollectionを作成する必要がある（※Milvusは0.7.0バージョンでTableをCollectionに改名している）。コレクションはMilvusでベクトルを記録・検索するための最も基本的な単位です。</p>
<p>各コレクションには固有の名前と設定可能なプロパティがあり、コレクション名に基づいてベクターの挿入や検索が行われます。新しいコレクションを作成すると、Milvusはそのコレクションの情報をメタデータに記録します。</p>
<h2 id="Data-Insertion" class="common-anchor-header">データ挿入<button data-href="#Data-Insertion" class="anchor-icon" translate="no">
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
    </button></h2><p>ユーザがデータを挿入するリクエストを送信すると、データはシリアライズされ、デシリアライズされてMilvusサーバに到達します。データはメモリに書き込まれます。メモリへの書き込みは以下のステップに大別される：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_data_insertion_milvus_99448bae50.png" alt="2-data-insertion-milvus.png" class="doc-image" id="2-data-insertion-milvus.png" />
   </span> <span class="img-wrapper"> <span>2-データ挿入-milvus.png</span> </span></p>
<ol>
<li>MemManagerで、コレクションの名前に対応する新しいMemTableを見つけるか作成する。各 MemTable は、メモリ内の Collection バッファに対応します。</li>
<li>MemTable には、1 つ以上の MemTableFile が含まれます。新しい MemTableFile を作成するたびに、この情報を同時に Meta に記録します。MemTableFileを2つの状態に分ける：MutableとImmutableである。MemTableFileのサイズが閾値に達すると、Immutableになる。各MemTableは、常に1つのMutable MemTableFileしか書き込むことができない。</li>
<li>各MemTableFileのデータは、最終的にセット・インデックス・タイプのフォーマットでメモリに記録される。MemTableFileは、メモリ上のデータを管理するための最も基本的な単位である。</li>
<li>いつでも、挿入されたデータのメモリ使用量が、あらかじめ設定された値（insert_buffer_size）を超えることはない。これは、データの挿入要求が来るたびに、MemManagerが各MemTableに含まれるMemTableFileが占有するメモリを簡単に計算し、現在のメモリに応じて挿入要求を調整できるからである。</li>
</ol>
<p>MemManager、MemTable、MemTableFileのマルチレベルアーキテクチャにより、データ挿入をより適切に管理・維持することができる。もちろん、それ以上のこともできる。</p>
<h2 id="Near-Real-time-Query" class="common-anchor-header">ほぼリアルタイムのクエリー<button data-href="#Near-Real-time-Query" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusでは、挿入されたデータがメモリからディスクに移動するまで、長くても1秒待つだけでよい。このプロセス全体を大まかにまとめると次のようになる：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_near_real_time_query_milvus_f3cfdd00fb.png" alt="2-near-real-time-query-milvus.png" class="doc-image" id="2-near-real-time-query-milvus.png" />
   </span> <span class="img-wrapper"> <span>2-near-real-time-query-milvus.png</span> </span></p>
<p>まず、挿入されたデータはメモリ内の挿入バッファに入る。バッファは、シリアライゼーションの準備のために、定期的に最初のMutable状態からImmutable状態へと変化する。そして、これらのImmutableバッファは、バックグラウンドのシリアライズスレッドによって定期的にディスクにシリアライズされる。データが配置された後、順序情報がメタデータに記録される。この時点で、データを検索することができる！</p>
<p>では、図のステップを詳しく説明しよう。</p>
<p>データをミュータブル・バッファーに挿入するプロセスはすでに知っている。次のステップは、ミュータブル・バッファからイミュータブル・バッファへの切り替えです：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_mutable_buffer_immutable_buffer_milvus_282b66c5fe.png" alt="3-mutable-buffer-immutable-buffer-milvus.png" class="doc-image" id="3-mutable-buffer-immutable-buffer-milvus.png" />
   </span> <span class="img-wrapper"> <span>3-mutable-buffer-immutable-buffer-milvus.png</span> </span></p>
<p>イミュータブル・キューは、バックグラウンドのシリアライゼーション・スレッドに、イミュータブルな状態とシリアライゼーションの準備が整ったMemTableFileを提供します。各MemTableは、それ自身のイミュータブル・キューを管理し、MemTableの唯一の変更可能なMemTableFileのサイズが閾値に達すると、イミュータブル・キューに入ります。ToImmutableを担当するバックグラウンド・スレッドは、MemTableが管理するイミュータブル・キュー内のすべてのMemTableFileを定期的に取り出し、それらをトータルのイミュータブル・キューに送信する。注意しなければならないのは、データをメモリに書き込む操作と、メモリ内のデータを書き込めない状態に変更する操作の2つは、同時に発生することはなく、共通のロックが必要であることだ。しかし、ToImmutableの操作は非常に単純で、ほとんど遅延が発生しないため、挿入されたデータに対するパフォーマンスへの影響は最小限である。</p>
<p>次のステップは、シリアライズキュー内のMemTableFileをディスクにシリアライズすることである。これは主に3つのステップに分かれる：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_serialize_memtablefile_milvus_95766abdfb.png" alt="4-serialize-memtablefile-milvus.png" class="doc-image" id="4-serialize-memtablefile-milvus.png" />
   </span> <span class="img-wrapper"> <span>4-シリアライズ-Memtablefile-milvus.png</span> </span></p>
<p>まず、バックグラウンドのシリアライズ・スレッドが、不変キューからMemTableFileを定期的に取り出します。その後、固定サイズのRawファイル（Raw TableFiles）にシリアライズされる。最後に、この情報をメタデータに記録する。ベクトル検索を行う際には、メタデータ内の対応するTableFileにクエリーをかける。ここから、これらのデータを検索することができる！</p>
<p>また、設定されたindex_file_sizeに従って、直列化スレッドが直列化サイクルを完了した後、いくつかの固定サイズのTableFileをTableFileにマージし、これらの情報もメタデータに記録する。この時点で、TableFileにインデックスを付けることができる。インデックス構築も非同期である。インデックス構築を担当する別のバックグラウンド・スレッドは、メタデータのToIndex状態のTableFileを定期的に読み込み、対応するインデックス構築を実行する。</p>
<h2 id="Vector-search" class="common-anchor-header">ベクトル検索<button data-href="#Vector-search" class="anchor-icon" translate="no">
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
    </button></h2><p>実際、TableFileとメタデータの助けを借りれば、ベクトル検索がより直感的で便利になることがわかるだろう。一般的には、メタデータからクエリ対象のCollectionに対応するTableFileを取得し、それぞれのTableFileを検索し、最後にマージする必要がある。今回は、検索の具体的な実装については触れない。</p>
<p>もっと詳しくお知りになりたい方は、ソースコードをお読みいただくか、Milvusに関する他の技術記事をお読みください！</p>
