---
id: scheduling-query-tasks-milvus.md
title: 背景
author: milvus
date: 2020-03-03T22:38:17.829Z
desc: 舞台裏の仕事
cover: assets.zilliz.com/eric_rothermel_Fo_KO_4_Dp_Xam_Q_unsplash_469fe12aeb.jpg
tag: Engineering
canonicalUrl: 'https://zilliz.com/blog/scheduling-query-tasks-milvus'
---
<custom-h1>Milvusはどのようにクエリタスクをスケジュールするのか</custom-h1><p>この記事では、Milvusがどのように問い合わせタスクをスケジューリングするかについて説明します。また、Milvusスケジューリングの問題点、解決策、今後の方向性についても説明します。</p>
<h2 id="Background" class="common-anchor-header">背景<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>大規模ベクトル検索エンジンにおけるデータ管理から、ベクトル類似性検索は高次元空間における2つのベクトル間の距離によって実行されることが知られている。ベクトル検索の目的は、ターゲットベクトルに最も近いK個のベクトルを見つけることである。</p>
<p>ユークリッド距離のように、ベクトル距離を測定する多くの方法があります：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_euclidean_distance_156037c939.png" alt="1-euclidean-distance.png" class="doc-image" id="1-euclidean-distance.png" />
   </span> <span class="img-wrapper"> <span>1-euclidean-distance.png</span> </span></p>
<p>ここでxとyは2つのベクトルであり、nはベクトルの次元である。</p>
<p>データセット内のK個の最近接ベクトルを見つけるには、ターゲットベクトルと検索対象のデータセット内のすべてのベクトルとの間のユークリッド距離を計算する必要がある。そして、K個の最近接ベクトルを求めるために、ベクトルを距離でソートする。計算量はデータセットのサイズに比例する。データセットが大きければ大きいほど、クエリに必要な計算量は多くなる。グラフ処理に特化したGPUは、必要な計算能力を提供するために多くのコアを持っている。そのため、Milvusの実装ではマルチGPUのサポートも考慮されている。</p>
<h2 id="Basic-concepts" class="common-anchor-header">基本概念<button data-href="#Basic-concepts" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Data-blockTableFile" class="common-anchor-header">データブロック（TableFile）</h3><p>Milvusでは、大規模データ検索への対応を強化するため、データ保存の最適化を行った。Milvusはテーブル内のデータをサイズごとに複数のデータブロックに分割する。ベクトル検索では、Milvusは各データブロック内のベクトルを検索し、その結果をマージする。1回のベクトル検索操作は、N個の独立したベクトル検索操作(Nはデータブロック数)とN-1個の結果のマージ操作から構成される。</p>
<h3 id="Task-queueTaskTable" class="common-anchor-header">タスクキュー（TaskTable）</h3><p>各Resourceは、そのResourceに属するタスクを記録するタスクアレイを持つ。各タスクには、開始、ロード、ロード済み、実行、実行済みなどの状態があります。コンピューティングデバイスのローダーとエクゼキュータは同じタスクキューを共有する。</p>
<h3 id="Query-scheduling" class="common-anchor-header">クエリスケジューリング</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_query_scheduling_5798178be2.png" alt="2-query-scheduling.png" class="doc-image" id="2-query-scheduling.png" />
   </span> <span class="img-wrapper"> <span>2-query-scheduling.png</span> </span></p>
<ol>
<li>Milvusサーバーが起動すると、Milvusは<code translate="no">server_config.yaml</code> 設定ファイルの<code translate="no">gpu_resource_config</code> パラメータを介して対応するGpuResourceを起動します。DiskResource と CpuResource はまだ<code translate="no">server_config.yaml</code> で編集できません。GpuResourceは<code translate="no">search_resources</code> と<code translate="no">build_index_resources</code> の組み合わせであり、以下の例では<code translate="no">{gpu0, gpu1}</code> と呼ぶ：</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_sample_code_ffee1c290f.png" alt="3-sample-code.png" class="doc-image" id="3-sample-code.png" />
   </span> <span class="img-wrapper"> <span>3-サンプルコード.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_example_0eeb85da71.png" alt="3-example.png" class="doc-image" id="3-example.png" />
   </span> <span class="img-wrapper"> <span>3-example.png</span> </span></p>
<ol start="2">
<li>milvusはリクエストを受け取る。テーブルメタデータは外部データベースに格納され、シングルホストではSQLiteまたはMySQl、分散ホストではMySQLが使用される。検索要求を受け取ると、Milvusはテーブルが存在し、ディメンションが整合しているかどうかを検証します。その後、MilvusはテーブルのTableFileリストを読み込みます。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_milvus_reads_tablefile_list_1e9d851543.png" alt="4-milvus-reads-tablefile-list.png" class="doc-image" id="4-milvus-reads-tablefile-list.png" />
   </span> <span class="img-wrapper"> <span>4-milvus-reads-tablefile-list.png</span> </span></p>
<ol start="3">
<li>milvusはSearchTaskを作成する。各TableFileの計算は独立して行われるため、Milvusは各TableFileに対してSearchTaskを作成する。タスクスケジューリングの基本単位であるSearchTaskには、ターゲットベクトル、検索パラメータ、TableFileのファイル名が含まれる。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_table_file_list_task_creator_36262593e4.png" alt="5-table-file-list-task-creator.png" class="doc-image" id="5-table-file-list-task-creator.png" />
   </span> <span class="img-wrapper"> <span>5-table-file-list-task-creator.png</span> </span></p>
<ol start="4">
<li>Milvusは計算デバイスを選択する。SearchTaskが計算を行うデバイスは、各デバイスの<strong>推定完了</strong>時間に依存する。<strong>完了予想</strong>時刻とは、現在時刻から計算が完了すると予想される時刻までの推定間隔を示す。</li>
</ol>
<p>たとえば、SearchTaskのデータ・ブロックがCPUメモリにロードされたとき、次のSearchTaskはCPUの計算タスク・キューで待機しており、GPUの計算タスク・キューはアイドル状態です。CPUの<strong>推定完了時間は</strong>、前のSearchTaskと現在のSearchTaskの推定時間コストの合計に等しい。GPUの<strong>推定完了</strong>時間は、データ・ブロックがGPUにロードされる時間と、現在のSearchTaskの推定時間コストの合計に等しい。リソース内のSearchTaskの<strong>推定完了時間は</strong>、リソース内のすべてのSearchTaskの平均実行時間に等しくなります。そして、Milvusは、<strong>推定完了時間が</strong>最も短いデバイスを選択し、そのデバイスにSearchTaskを割り当てる。</p>
<p>ここでは、GPU1の<strong>推定完了時間の</strong>方が短いと仮定します。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/6_GPU_1_shorter_estimated_completion_time_42c7639b87.png" alt="6-GPU1-shorter-estimated-completion-time.png" class="doc-image" id="6-gpu1-shorter-estimated-completion-time.png" />
   </span> <span class="img-wrapper"> <span>6-GPU1-shorter-estimated-completion-time.png</span> </span></p>
<ol start="5">
<li><p>MilvusはSearchTaskをDiskResourceのタスクキューに追加します。</p></li>
<li><p>MilvusはSearchTaskをCpuResourceのタスクキューに移動。CpuResourceのロードスレッドがタスクキューから各タスクを順次ロードする。CpuResourceが対応するデータブロックをCPUメモリに読み込む。</p></li>
<li><p>MilvusはSearchTaskをGpuResourceに移す。GpuResourceのロードスレッドがCPUメモリからGPUメモリにデータをコピーする。GpuResourceが対応するデータブロックをGPUメモリに読み込む。</p></li>
<li><p>milvusはGpuResourceでSearchTaskを実行します。SearchTaskの結果は比較的小さいため、結果は直接CPUメモリに返されます。</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/7_scheduler_53f1fbbaba.png" alt="7-scheduler.png" class="doc-image" id="7-scheduler.png" />
   </span> <span class="img-wrapper"> <span>7-scheduler.png</span> </span></p>
<ol start="9">
<li>MilvusはSearchTaskの結果を検索結果全体にマージする。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_milvus_merges_searchtast_result_9f3446e65a.png" alt="8-milvus-merges-searchtast-result.png" class="doc-image" id="8-milvus-merges-searchtast-result.png" />
   </span> <span class="img-wrapper"> <span>8-milvus-merges-searchtast-result.png</span> </span></p>
<p>すべてのSearchTaskが終了すると、Milvusは検索結果全体をクライアントに返します。</p>
<h2 id="Index-building" class="common-anchor-header">インデックス作成<button data-href="#Index-building" class="anchor-icon" translate="no">
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
    </button></h2><p>インデックス構築は基本的にマージ処理を除いた検索処理と同じです。これについては詳しく触れません。</p>
<h2 id="Performance-optimization" class="common-anchor-header">パフォーマンスの最適化<button data-href="#Performance-optimization" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Cache" class="common-anchor-header">キャッシュ</h3><p>前述したように、データブロックは計算前にCPUメモリやGPUメモリなどの対応するストレージデバイスにロードされる必要があります。データロードの繰り返しを避けるため、MilvusはLRU（Least Recently Used）キャッシュを導入しています。キャッシュがいっぱいになると、新しいデータ・ブロックが古いデータ・ブロックを押しのけます。キャッシュのサイズは、現在のメモリサイズに基づいて設定ファイルによってカスタマイズすることができます。データのロード時間を効果的に節約し、検索パフォーマンスを向上させるには、検索データを保存するための大きなキャッシュを推奨します。</p>
<h3 id="Data-loading-and-computation-overlap" class="common-anchor-header">データの読み込みと計算の重複</h3><p>キャッシュは検索パフォーマンスを向上させるニーズを満たすことはできません。メモリが不足したり、データセットのサイズが大きすぎる場合、データを再ロードする必要がある。データロードが検索性能に与える影響を減らす必要がある。ディスクからCPUメモリへ、あるいはCPUメモリからGPUメモリへのデータロードは、IOオペレーションに属し、プロセッサによる計算作業はほとんど必要ありません。そこで、データロードと計算を並列に実行することで、リソースの有効利用を図ります。</p>
<p>データブロックの計算を3ステージ（ディスクからCPUメモリへのロード、CPU計算、結果マージ）または4ステージ（ディスクからCPUメモリへのロード、CPUメモリからGPUメモリへのロード、GPU計算と結果検索、結果マージ）に分割します。3ステージの計算を例にとると、3つのステージを担当する3つのスレッドを起動し、命令パイプラインとして機能させることができます。結果セットはほとんど小さいので、結果のマージにはそれほど時間がかからない。場合によっては、データロードと計算のオーバーラップにより、検索時間を1/2に短縮できる。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_sequential_overlapping_load_milvus_1af809b29e.png" alt="9-sequential-overlapping-load-milvus.png" class="doc-image" id="9-sequential-overlapping-load-milvus.png" />
   </span> <span class="img-wrapper"> <span>9-sequential-overlapping-load-milvus.png</span> </span></p>
<h2 id="Problems-and-solutions" class="common-anchor-header">問題点と解決策<button data-href="#Problems-and-solutions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Different-transmission-speeds" class="common-anchor-header">伝送速度の違い</h3><p>以前、MilvusはマルチGPUタスクのスケジューリングにラウンドロビン戦略を使用していました。この戦略は我々の4GPUサーバーでは完璧に機能し、検索性能は4倍向上した。しかし、2GPUのホストでは2倍の性能向上には至りませんでした。私たちはいくつかの実験を行い、あるGPUのデータコピー速度が11GB/秒であることを発見しました。しかし、別のGPUでは3GB/秒でした。メインボードのドキュメントを参照した結果、メインボードがPCIe x16経由で1つのGPUに、PCIe x4経由でもう1つのGPUに接続されていることを確認した。つまり、これらのGPUはコピー速度が異なる。その後、各SearchTaskに最適なデバイスを測定するため、コピー時間を追加した。</p>
<h2 id="Future-work" class="common-anchor-header">今後の課題<button data-href="#Future-work" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Hardware-environment-with-increased-complexity" class="common-anchor-header">複雑化するハードウェア環境</h3><p>実際の環境では、ハードウェア環境がより複雑になる可能性がある。複数のCPU、NUMAアーキテクチャのメモリ、NVLink、NVSwitchを持つハードウェア環境では、CPU/GPU間の通信が最適化の機会を多くもたらします。</p>
<p>クエリの最適化</p>
<p>実験中に、パフォーマンス向上の機会をいくつか発見しました。例えば、サーバーが同じテーブルに対する複数のクエリを受信した場合、条件によってはクエリをマージすることができます。データの局所性を利用することで、パフォーマンスを向上させることができる。現在、シングルホスト、マルチGPUのシナリオにおいて、クエリがどのようにスケジューリングされ、実行されるかは既に分かっています。今後もMilvusの内部メカニズムを紹介していく予定である。</p>
