---
id: 2019-11-08-data-management.md
title: Milvusにおけるデータ管理の仕組み
author: Yihua Mo
date: 2019-11-08T00:00:00.000Z
desc: Milvusのデータ管理戦略について紹介する。
cover: null
tag: Engineering
origin: null
---
<custom-h1>大規模ベクトル検索エンジンにおけるデータ管理</custom-h1><blockquote>
<p>著者イーファ・モ</p>
<p>日付: 2019-11-08</p>
</blockquote>
<h2 id="How-data-management-is-done-in-Milvus" class="common-anchor-header">Milvusにおけるデータ管理の仕組み<button data-href="#How-data-management-is-done-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>まず、Milvusの基本的な概念について：</p>
<ul>
<li>テーブル：テーブルとはベクトルのデータセットであり、各ベクトルは一意のIDを持つ。各ベクターとそのIDはテーブルの1行を表します。テーブル内のすべてのベクトルは同じ次元でなければなりません。以下は10次元のベクトルを持つテーブルの例です：</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/table.png" alt="table" class="doc-image" id="table" />
   </span> <span class="img-wrapper"> <span>テーブル</span> </span></p>
<ul>
<li>インデックス：インデックスの構築は、特定のアルゴリズムによるベクトル・クラスタリングのプロセスであり、追加のディスク・スペースを必要とする。インデックスの種類によっては、ベクトルを単純化して圧縮するため、より少ないスペースで済むものもあれば、生のベクトルよりも多くのスペースを必要とするものもあります。</li>
</ul>
<p>Milvusでは、テーブルの作成、ベクタの挿入、インデックスの構築、ベクタの検索、テーブル情報の検索、テーブルの削除、テーブル内の部分的なデータの削除、インデックスの削除などのタスクを実行することができる。</p>
<p>512次元のベクトルが1億個あり、ベクトル検索を効率的に行うために、Milvusにベクトルを挿入し、管理する必要があると仮定する。</p>
<p><strong>(1) ベクトル挿入</strong></p>
<p>Milvusへのベクトルの挿入方法を見てみよう。</p>
<p>各ベクトルは2KBの容量を必要とするため、1億個のベクトルを格納するための最小容量は約200GBとなり、1回ですべてのベクトルを挿入することは現実的ではありません。データファイルは1つではなく、複数用意する必要がある。挿入性能は重要な性能指標の一つである。Milvusは数百から数万のベクターの1回限りの挿入をサポートしています。例えば、3万個の512次元ベクトルを一度に挿入する場合、通常1秒しかかかりません。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/insert.png" alt="insert" class="doc-image" id="insert" />
   </span> <span class="img-wrapper"> <span>挿入</span> </span></p>
<p>すべてのベクトル挿入がディスクにロードされるわけではありません。Milvusは、作成されたテーブルごとにCPUメモリ内にミュータブルバッファを確保し、そこに挿入されたデータを素早く書き込むことができる。そして、ミュータブル・バッファのデータがある一定のサイズに達すると、このスペースはイミュータブルとしてラベル付けされる。その間に、新しいミュータブル・バッファが確保される。不変バッファのデータは定期的にディスクに書き込まれ、対応するCPUメモリが解放される。ディスクへの定期的な書き込みは、バッファリングされたデータを1秒ごとにディスクに書き込むElasticsearchで使われている仕組みと似ている。また、LevelDB/RocksDBに慣れているユーザーであれば、MemTableに似ている部分があることがわかるだろう。</p>
<p>データ挿入メカニズムの目標は以下の通りです：</p>
<ul>
<li>データ挿入は効率的でなければならない。</li>
<li>挿入されたデータは即座に使用できること。</li>
<li>データファイルが断片化しすぎないこと。</li>
</ul>
<p><strong>(2) 生データ・ファイル</strong></p>
<p>ベクターがディスクに書き込まれるとき、生のベクターを含むRaw Data Fileに保存される。前述したように、大規模なベクターは複数のデータファイルで保存・管理する必要がある。一度に挿入できるベクターの数は10個から100万個までと様々です。しかし、ディスクへの書き込みは1秒に1回行われる。そのため、異なるサイズのデータファイルが生成される。</p>
<p>断片化されたデータファイルは、管理するにも、ベクトル検索にアクセスするにも不便です。Milvusは、マージされたファイルサイズが特定のサイズ、例えば1GBに達するまで、これらの小さなデータファイルを常にマージする。この特定のサイズはテーブル作成のAPIパラメータ<code translate="no">index_file_size</code> で設定できます。したがって、1億個の512次元ベクトルが約200個のデータファイルに分散保存されることになる。</p>
<p>ベクターが挿入され、同時に検索されるインクリメンタルな計算シナリオを考慮すると、ベクターがディスクに書き込まれた後、検索に利用できるようにする必要がある。したがって、小データファイルがマージされる前に、それらにアクセスし、検索することができる。マージが完了すると、スモール・データ・ファイルは削除され、代わりに新しくマージされたファイルが検索に使用される。</p>
<p>これが、マージ前のクエリーされたファイルの様子である：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/rawdata1.png" alt="rawdata1" class="doc-image" id="rawdata1" />
   </span> <span class="img-wrapper"> <span>rawdata1</span> </span></p>
<p>マージ後の照会ファイル</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/rawdata2.png" alt="rawdata2" class="doc-image" id="rawdata2" />
   </span> <span class="img-wrapper"> <span>rawdata2</span> </span></p>
<p><strong>(3) インデックスファイル</strong></p>
<p>Raw Data Fileに基づく検索は、クエリーベクトルと原点ベクトル間の距離を比較し、最も近いk個のベクトルを計算するブルートフォースサーチである。ブルートフォースサーチは効率が悪い。ベクトルがインデックス化されたインデックスファイルに基づいて検索を行えば、検索効率は大幅に向上します。インデックスの構築には追加のディスクスペースが必要で、通常時間がかかります。</p>
<p>では、生データファイルとインデックスファイルの違いは何でしょうか？簡単に言うと、Raw Data Fileは全てのベクトルを一意のIDと共に記録し、Index Fileはインデックスタイプ、クラスタの中心、各クラスタ内のベクトルなどのベクトルクラスタリングの結果を記録します。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexfile.png" alt="indexfile" class="doc-image" id="indexfile" />
   </span> <span class="img-wrapper"> <span>インデックスファイル</span> </span></p>
<p>一般的に言って、インデックス・ファイルはRawデータ・ファイルよりも多くの情報を含んでいますが、（特定のインデックス・タイプについては）インデックス構築の過程でベクトルが単純化され、量子化されるため、ファイルサイズははるかに小さくなります。</p>
<p>新しく作成されたテーブルは、デフォルトではブルート計算によって検索される。インデックスがシステム内に作成されると、Milvusは自動的にスタンドアロンスレッドでサイズが1GBに達するマージファイルのインデックスを構築する。インデックス構築が完了すると、新しいインデックスファイルが生成される。未加工のデータファイルは、他のインデックスタイプに基づくインデックス構築のためにアーカイブされます。</p>
<p>Milvusは自動的に1GBに達したファイルのインデックスを構築します：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/buildindex.png" alt="buildindex" class="doc-image" id="buildindex" />
   </span> <span class="img-wrapper"> <span>ビルドインデックス</span> </span></p>
<p>インデックス構築完了</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexcomplete.png" alt="indexcomplete" class="doc-image" id="indexcomplete" />
   </span> <span class="img-wrapper"> <span>インデックス構築完了</span> </span></p>
<p>1GBに達しない生データファイルに対してはインデックスが自動的に構築されないため、検索速度が低下する可能性があります。この状況を回避するには、このテーブルに対して手動で強制的にインデックスを構築する必要があります。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/forcebuild.png" alt="forcebuild" class="doc-image" id="forcebuild" />
   </span> <span class="img-wrapper"> <span>強制構築</span> </span></p>
<p>強制的にインデックスが構築されると、検索パフォーマンスが大幅に向上します。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/indexfinal.png" alt="indexfinal" class="doc-image" id="indexfinal" />
   </span> <span class="img-wrapper"> <span>indexfinal</span> </span></p>
<p><strong>(4) メタ・データ</strong></p>
<p>前述のように、1億個の512次元ベクトルが200個のディスクファイルに保存されている。これらのベクトルに対してインデックスを作成すると、さらに200個のインデックスファイルが追加されることになり、ディスクファイルとインデックスファイルの合計で400個のファイルが存在することになる。ファイルの状態を確認したり、ファイルを削除したり、作成したりするためには、これらのファイルのメタデータ（ファイルの状態やその他の情報）を管理する効率的なメカニズムが必要である。</p>
<p>これらの情報を管理するためにOLTPデータベースを使用するのは良い選択です。スタンドアロンのMilvusではメタデータの管理にSQLiteを使用しますが、分散配置のMilvusではMySQLを使用します。Milvusサーバが起動すると、SQLite/MySQLにそれぞれ2つのテーブル（'Tables'と'TableFiles'）が作成されます。Tables'にはテーブル情報が記録され、'TableFiles'にはデータファイルとインデックスファイルの情報が記録される。</p>
<p>下のフローチャートに示すように、'Tables'には、テーブル名(table_id)、ベクトル次元(dimension)、テーブル作成日(created_on)、テーブル状態(state)、インデックスタイプ(engine_type)、ベクトルクラスタ数(nlist)、距離計算方法(metric_type)などのメタデータ情報が格納される。</p>
<p>また、'TableFiles' には、ファイルが属するテーブル名（table_id）、ファイルのインデックスタイプ（engine_type）、ファイル名（file_id）、ファイルタイプ（file_type）、ファイルサイズ（file_size）、行数（row_count）、ファイル作成日（created_on）が含まれる。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/Metadata.png" alt="metadata" class="doc-image" id="metadata" />
   </span> <span class="img-wrapper"> <span>メタデータ</span> </span></p>
<p>これらのメタデータを使って、さまざまな操作を実行することができる。以下に例を挙げる：</p>
<ul>
<li>テーブルを作成するには、Meta ManagerはSQLステートメント<code translate="no">INSERT INTO TABLES VALUES(1, 'table_2, 512, xxx, xxx, ...)</code> を実行するだけでよい。</li>
<li>table_2のベクトル検索を実行するために、Meta ManagerはSQLite/MySQLでクエリを実行します。これは事実上のSQL文です。<code translate="no">SELECT * FROM TableFiles WHERE table_id='table_2'</code> 、table_2のファイル情報を取得します。そして、これらのファイルは検索計算のためにQuery Schedulerによってメモリにロードされる。</li>
<li>テーブルを即座に削除することは許されない。そのため、テーブルにはソフト削除とハード削除があります。テーブルを削除すると、"ソフト削除 "と表示され、それ以降のクエリ実行や変更はできなくなります。しかし、削除前に実行されていたクエリはそのまま継続されます。削除前のクエリがすべて完了した時点で、そのテーブルはメタデータと関連ファイルとともに永久にハード削除されます。</li>
</ul>
<p><strong>(5) クエリースケジューラー</strong></p>
<p>下図は、CPUとGPUの両方で、ディスク、CPUメモリ、GPUメモリにコピー・保存されたファイル（生データ・ファイルとインデックス・ファイル）に対して、最も類似している上位k個のベクトルに対するクエリを実行し、ベクトル検索を行う様子を示しています。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/topkresult.png" alt="topkresult" class="doc-image" id="topkresult" />
   </span> <span class="img-wrapper"> <span>トップクラスの結果</span> </span></p>
<p>クエリスケジューリングアルゴリズムは、システムパフォーマンスを大幅に向上させる。基本的な設計思想は、ハードウェアリソースを最大限に活用することで最高の検索性能を達成することです。以下はクエリスケジューラーの簡単な説明であり、このトピックについては今後専用の記事を掲載する予定である。</p>
<p>与えられたテーブルに対する最初のクエリを「コールド」クエリ、それ以降のクエリを「ウォーム」クエリと呼ぶ。与えられたテーブルに対して最初のクエリを実行する際、MilvusはデータをCPUメモリに、また一部のデータをGPUメモリにロードするために多くの作業を行いますが、これには時間がかかります。それ以降のクエリでは、データの一部またはすべてがすでにCPUメモリにあるため、ディスクから読み込む時間が節約され、検索がはるかに高速になります。</p>
<p>最初のクエリの検索時間を短縮するために、Milvusはプリロードテーブル(<code translate="no">preload_table</code>)コンフィギュレーションを提供しており、サーバー起動時にテーブルをCPUメモリに自動的にプリロードすることができる。200GBの512次元ベクトルを1億個含むテーブルの場合、これらすべてのデータを格納するのに十分なCPUメモリがあれば、検索速度は最も速くなります。しかし、億単位のベクトルを含むテーブルの場合、クエリされない新しいデータを追加するためにCPU/GPUメモリを解放することが避けられない場合がある。現在、LRU(Latest Recently Used)をデータ置換戦略として使用しています。</p>
<p>下図に示すように、ディスク上に6つのインデックスファイルを持つテーブルがあるとします。CPUメモリには3つのインデックスファイルしか格納できず、GPUメモリには1つのインデックスファイルしか格納できません。</p>
<p>検索が開始されると、3つのインデックスファイルがクエリ用にCPUメモリにロードされます。最初のファイルはクエリーされるとすぐに CPU メモリから解放されます。一方、4番目のファイルはCPUメモリにロードされます。同様に、GPUメモリにあるファイルがクエリされると、そのファイルは即座に解放され、新しいファイルに置き換えられます。</p>
<p>クエリスケジューラは主に2組のタスクキューを処理します。1つのキューはデータロードに関するもので、もう1つのキューは検索実行に関するものです。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/queryschedule.png" alt="queryschedule" class="doc-image" id="queryschedule" />
   </span> <span class="img-wrapper"> <span>クエリスケジュール</span> </span></p>
<p><strong>(6) 結果削減器</strong></p>
<p>ベクトル検索には2つの重要なパラメータがある。1つは対象となるベクトルの数nを意味する'n'、もう1つは最も類似している上位k個のベクトルを意味する'k'である。検索結果は実際にはn組のKVP（キーと値のペア）であり、それぞれがk組のキーと値のペアを持ちます。クエリーは個々のファイルに対して実行される必要があるため、それが生データ・ファイルであろうとインデックス・ファイルであろうと、n組の上位k個の結果セットが各ファイルに対して検索される。これらの結果セットは、テーブルの上位k個の結果セットを得るためにマージされる。</p>
<p>以下の例は、4つのインデックスファイル(n=2, k=3)を持つテーブルに対するベクトル検索で、結果セットがどのようにマージされ、削減されるかを示している。各結果セットには2つのカラムがあることに注意してください。左の列はベクトルIDを表し、右の列はユークリッド距離を表す。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://raw.githubusercontent.com/milvus-io/community/master/blog/assets/data_manage/resultreduce.png" alt="result" class="doc-image" id="result" />
   </span> <span class="img-wrapper"> <span>結果</span> </span></p>
<p><strong>(7) 今後の最適化</strong></p>
<p>以下は、データ管理の最適化について考えられることである。</p>
<ul>
<li>イミュータブル・バッファ、あるいはミュータブル・バッファのデータも即座に照会できるようになったらどうだろうか？現在、イミュータブル・バッファのデータは、ディスクに書き込まれるまでは照会できない。ユーザーによっては、挿入後のデータに瞬時にアクセスすることに関心があります。</li>
<li>非常に大きなテーブルを小さなパーティションに分割し、指定したパーティションに対してベクトル検索を実行できるような、テーブル・パーティショニング機能を提供する。</li>
<li>ベクターにフィルタリング可能な属性を追加する。例えば、ある属性を持つベクトルだけを検索したいユーザがいる。ベクトル属性や生のベクトルも検索する必要がある。RocksDB のような KV データベースを使用するのも一つの方法である。</li>
<li>古くなったデータを他の記憶領域に自動的に移行できるデータ移行機能を提供する。常にデータが流れ込んでくるようなシナリオでは、データが古くなっていく可能性がある。ユーザーによっては直近の月のデータにしか関心がなく、検索を実行しないため、古いデータはあまり役に立たなくなり、多くのディスク容量を消費するようになる。データ移行メカニズムがあれば、新しいデータのためにディスク容量を確保することができる。</li>
</ul>
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
    </button></h2><p>本記事では主にMilvusのデータ管理戦略について紹介する。Milvusの分散展開、ベクトルインデックス作成手法の選択、クエリスケジューラに関する記事は近日中に公開予定です。ご期待ください！</p>
<h2 id="Related-blogs" class="common-anchor-header">関連ブログ<button data-href="#Related-blogs" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-1-6b9e05c06fb0">Milvusのメタデータ管理(1)：メタデータの見方</a></li>
<li><a href="https://medium.com/@milvusio/milvus-metadata-management-2-fields-in-the-metadata-table-3bf0d296ca6d">Milvusメタデータ管理(2)：メタデータテーブルのフィールド</a></li>
</ul>
