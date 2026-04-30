---
id: how-robobrain-builds-longterm-robot-memory-with-milvus.md
title: ロボブレインがmilvusでロボットの長期記憶を構築する方法
author: Song Zhi
date: 2026-4-30
cover: assets.zilliz.com/robobrain_cover_a96f93fbce.jpg
tag: Use Cases
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'robot agent, robot memory, task execution, vector database, Milvus'
meta_title: |
  How RoboBrain Builds Long-Term Robot Memory with Milvus
desc: >-
  ロボット・モジュールは単独でも動作するが、連鎖させると故障する。Senqi
  AIのCEOが、RoboBrainがどのようにタスクの状態、フィードバック、Milvusメモリーを使用しているかを説明する。
origin: >-
  https://milvus.io/blog/how-robobrain-builds-longterm-robot-memory-with-milvus.md
---
<p><em>この投稿は、ロボットのタスク実行インフラを構築する具現化AI企業、Senqi AIのCEO、宋志氏によるものです。RoboBrainはSenqi AIの主力製品のひとつです。</em></p>
<p>ほとんどのロボットの機能は、それ自体で問題なく動作します。ナビゲーション・モデルはルートを計画することができる。知覚モデルは物体を識別する。発話モジュールは指示を受け付けることができる。生産上の失敗は、これらの機能が1つの連続したタスクとして実行されなければならないときに現れる。</p>
<p>ロボットにとって、「あの辺りを調べて、異常があれば写真に撮って私に知らせて」というような単純な指示は、タスクが始まる前に計画を立て、タスクが実行される間に適応し、タスクが終了したときに有用な結果を生み出す必要がある。障害物の陰でナビゲーションがフリーズしたり、不鮮明な写真を最終的なものとして受け取ったり、5分前に処理した例外を忘れてしまったり。</p>
<p>これが、物理的世界で活動する<a href="https://zilliz.com/glossary/ai-agents">AIエージェントの</a>核となる課題だ。デジタル・エージェントとは異なり、ロボットはブロックされた経路、変化する光、バッテリーの限界、センサーのノイズ、オペレーターのルールなど、連続した<a href="https://zilliz.com/learn/introduction-to-unstructured-data">非構造化データに対して</a>実行する。</p>
<p>RoboBrainは、ロボットのタスク実行のためのSenqi AIの具現化された知能オペレーティングシステムです。タスクレイヤーに位置し、知覚、計画、実行制御、データフィードバックを接続することで、自然言語による命令が構造化され、回復可能なロボットワークフローとなります。</p>
<table>
<thead>
<tr><th>ブレークポイント</th><th>本番で失敗すること</th><th>ロボブレインが解決する方法</th></tr>
</thead>
<tbody>
<tr><td>タスク計画</td><td>曖昧な指示は、下流のモジュールに具体的な実行フィールドを残さない。</td><td>タスクのオブジェクト化で意図を共有状態に</td></tr>
<tr><td>コンテキスト・ルーティング</td><td>正しい情報が存在するにもかかわらず、間違った判断段階に到達してしまう。</td><td>階層化されたメモリは、リアルタイム、短期、長期のコンテキストを別々にルーティングする。</td></tr>
<tr><td>データ・フィードバック</td><td>次の実行を改善することなく、1回のパスが完了したり失敗したりする。</td><td>フィードバック・ライトバックはタスクの状態と長期メモリを更新する。</td></tr>
</tbody>
</table>
<h2 id="Three-Breakpoints-in-Robot-Task-Execution" class="common-anchor-header">ロボットタスク実行における3つのブレークポイント<button data-href="#Three-Breakpoints-in-Robot-Task-Execution" class="anchor-icon" translate="no">
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
    </button></h2><p>ソフトウェアタスクは、多くの場合、入力、プロセス、結果というように区切ることができる。ロボットのタスクは、ブロックされた経路、変化する光、バッテリーの限界、センサーのノイズ、オペレーターのルールなど、動く物理的な状態に対して実行される。</p>
<p>そのため、タスクループは孤立したモデル以上のものを必要とする。計画、実行、フィードバックにわたってコンテキストを保持する方法が必要なのだ。</p>
<h3 id="1-Task-Planning-Vague-Instructions-Produce-Vague-Execution" class="common-anchor-header">1.タスク計画：曖昧な指示が曖昧な実行を生む</h3><p>見てこい」というようなフレーズには、多くの決定が隠されている。どのエリアか？ロボットは何を撮るべきか？何を異常とみなすのか？撮影に失敗したらどうすべきか？どんな結果をオペレーターに返すべきか？</p>
<p>タスクレイヤーがこれらの詳細を具体的なフィールド（対象エリア、検査対象、完了条件、失敗ポリシー、リターンフォーマット）に解決できない場合、タスクは最初から方向性なく実行され、下流でコンテキストを回復することはない。</p>
<h3 id="2-Context-Routing-The-Right-Data-Reaches-the-Wrong-Stage" class="common-anchor-header">2.コンテキスト・ルーティング：正しいデータが間違ったステージに届く</h3><p>ロボットスタックにはすでに正しい情報が含まれているかもしれないが、タスクの実行は正しい段階でそれを取り出すかどうかにかかっている。</p>
<p>スタートアップ段階では、マップ、エリア定義、動作ルールが必要である。実行の途中では、ライブのセンサー状態が必要である。例外処理には、以前のデプロイメントで似たようなケースが必要だ。これらのソースが混在していると、システムは間違ったコンテキストで正しい判断を下してしまう。</p>
<p>ルーティングが失敗すると、スタートアップはエリアルールの代わりに古くなった経験を引っ張り出し、例外処理は必要なケースに到達できず、実行途中はライブの読み取りの代わりに昨日のマップを取得する。誰かに辞書を渡しても、エッセイを書く助けにはならない。データは適切な意思決定ポイントに、適切な段階で、適切な形で届かなければならない。</p>
<h3 id="3-Data-Feedback-Single-Pass-Execution-Does-Not-Improve" class="common-anchor-header">3.データのフィードバック：シングルパス実行では改善しない</h3><p>ライトバックがなければ、ロボットは次の行動を改善することなく実行を終えることができる。完了したアクションにはまだ品質チェックが必要である：画像は十分にシャープか、ロボットは撮り直すべきか？経路はまだ明確か、それとも迂回すべきか？バッテリーは閾値を超えているか、それともタスクを終了すべきか？</p>
<p>シングルパス・システムには、このような呼び出しのメカニズムがない。実行し、停止し、次回も同じ失敗を繰り返す。</p>
<h2 id="How-RoboBrain-Closes-the-Robot-Task-Loop" class="common-anchor-header">ロボットのタスクループを閉じる方法<button data-href="#How-RoboBrain-Closes-the-Robot-Task-Loop" class="anchor-icon" translate="no">
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
    </button></h2><p>RoboBrainは、環境理解、タスク計画、実行制御、データフィードバックを一つの動作ループにまとめます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/how_robobrain_builds_longterm_robot_memory_with_milvus_2_660d1c90e3.png" alt="RoboBrain core middleware architecture showing how user intent flows through task objects, stage-aware memory powered by Milvus, and a policy engine before reaching embodied capabilities" class="doc-image" id="robobrain-core-middleware-architecture-showing-how-user-intent-flows-through-task-objects,-stage-aware-memory-powered-by-milvus,-and-a-policy-engine-before-reaching-embodied-capabilities" />
   </span> <span class="img-wrapper"> <span>RoboBrainのコアミドルウェアアーキテクチャは、ユーザーの意図がタスクオブジェクト、Milvusによるステージ認識メモリ、ポリシーエンジンを経て、具現化された能力に到達する様子を示している。</span> </span></p>
<p>この投稿で説明するアーキテクチャでは、このループは3つのメカニズムによって実装されている：</p>
<ol>
<li><strong>タスク・オブジェクト化は</strong>、エントリー・ポイントを構造化する。</li>
<li><strong>階層化されたメモリは</strong>、適切な情報を適切な段階にルーティングする。</li>
<li><strong>フィードバック・ループが</strong>結果を書き戻し、次の動きを決定する。</li>
</ol>
<p>これらはセットとしてのみ機能する。他を無視して1つを修正しても、連鎖は次のポイントで途切れる。</p>
<h3 id="1-Task-Objectification-Turning-Intent-into-Shared-State" class="common-anchor-header">1.タスクのオブジェクト化：意図を共有状態に変える</h3><p>実行が始まる前に、RoboBrainは各命令をタスク・オブジェクトに変換する。タスク・タイプ、ターゲット領域、検査オブジェクト、制約、期待出力、現在のステージ、失敗ポリシーなどである。</p>
<p>重要なのは、言語の解析だけではない。ポイントは、すべての下流モジュールにタスクの同じ状態ビューを与えることである。この変換がなければ、タスクは方向性を持たない。</p>
<p>パトロールの例では、タスクオブジェクトは、検査タイプ、指定ゾーン、チェックオブジェクトとしての異常項目、制約としてのバッテリ &gt;= 20%、期待される出力としての明確な異常写真とオペレータ警告、失敗ポリシーとしての基地への帰還を記入する。</p>
<p>ステージフィールドは、ランの変更に応じて更新される。障害物があると、タスクはナビゲートから迂回または救助要請へと移動する。画像が不鮮明な場合は、検査から再撮影に移る。バッテリ残量が少なくなると、タスクは終了して基地に戻る。</p>
<p>ダウンストリームモジュールは、もはや孤立したコマンドを受け取らない。現在のタスクステージ、その制約、ステージが変更された理由を受け取ります。</p>
<h3 id="2-Tiered-Memory-Routing-Context-to-the-Right-Stage" class="common-anchor-header">2.階層化メモリ：適切なステージへのコンテキストのルーティング</h3><p>RoboBrainは、タスクに関連する情報を3つの階層に分け、適切なデータが適切なステージに届くようにしています。</p>
<p><strong>リアルタイムの状態は</strong>、姿勢、バッテリー、センサーの読み取り値、環境観測値を保持する。あらゆる制御ステップでの判断をサポートする。</p>
<p><strong>2</strong>分前にロボットが避けた障害物、撮り直した写真、最初のトライで開けられなかったドアなど。この記憶により、ロボットは今何が起こったのかを見失うことがない。</p>
<p><strong>長期セマンティックメモリは</strong>、シーン知識、過去の経験、例外ケース、タスク後の書き戻しを保存する。特定の駐車場では、反射面があるため、夜間はカメラの角度調整が必要かもしれない。特定の異常タイプは誤検知の履歴があり、自動アラートではなく人間によるレビューのトリガーとなる。</p>
<p>この長期階層は、<a href="https://milvus.io/">Milvusベクトルデータベースを</a>介した<a href="https://zilliz.com/learn/vector-similarity-search">ベクトル類似性検索で</a>実行される。なぜなら、正しい記憶を検索するということは、IDやキーワードではなく、意味によるマッチングを意味するからである。シーンの説明と処理記録は<a href="https://zilliz.com/glossary/vector-embeddings">ベクトル埋め込みとして</a>保存され、最も近い意味での一致を見つけるために<a href="https://zilliz.com/glossary/anns">近似最近傍探索で</a>検索される。</p>
<p>スタートアップは、長期記憶からエリアルールと過去のパトロールサマリーを引き出す。実行の途中では、リアルタイムの状態と短期的なコンテキストに依存する。例外処理は、長期記憶から類似のケースを見つけるために<a href="https://zilliz.com/glossary/semantic-search">意味的検索を</a>使用する。</p>
<h3 id="3-Feedback-Loop-Writing-Results-Back-into-the-System" class="common-anchor-header">3.フィードバックループ：結果をシステムに書き戻す</h3><p>RoboBrainは、ナビゲーション、知覚、行動の結果を各ステップの後にタスクオブジェクトに書き戻し、ステージフィールドを更新します。システムはこれらの観察結果を読み、次の行動を決定する。例えば、道にたどり着けない場合は迂回し、画像が不鮮明な場合は再撮影し、ドアが開かない場合は再試行し、バッテリーの残量が少ない場合は終了する。</p>
<p>実行は、実行、観察、調整、再び実行というサイクルになる。チェーンは、予期せぬことが起こったときに初めて切れるのではなく、環境の変化に適応し続ける。</p>
<h2 id="How-Milvus-Powers-RoboBrains-Long-Term-Robot-Memory" class="common-anchor-header">Milvusはどのようにロボブレインの長期的なロボットメモリを強化しているのか？<button data-href="#How-Milvus-Powers-RoboBrains-Long-Term-Robot-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>ロボットの記憶には、タスクIDやタイムスタンプ、セッションのメタデータで照会できるものもある。しかし、長期的な運用経験は通常、照会できない。</p>
<p>有用な記録は、タスクID、場所名、言い回しが異なっていても、現在のシーンと意味的に類似しているケースであることが多い。そのため、<a href="https://zilliz.com/learn/what-is-vector-database">ベクトルデータベースの</a>問題となり、milvusは長期記憶層に適している。</p>
<p>この階層には以下のような情報が保存されている：</p>
<ul>
<li>エリアルールの記述とポイントロケーションセマンティクス</li>
<li>アノマリー・タイプの定義と例のサマリー</li>
<li>過去の処理記録とタスク終了後のレビュー結論</li>
<li>タスク完了時に書かれるパトロールサマリー</li>
<li>人間による引き継ぎ後のエクスペリエンス・ライトバック</li>
<li>類似のシナリオから得られた失敗の原因と修正戦略</li>
</ul>
<p>そのどれもが、構造化されたフィールドによって自然にキー設定されるものではない。すべて意味によって思い出す必要がある。</p>
<p>具体例：ロボットは夜間、駐車場の入り口を巡回する。頭上の照明がまぶしく、異常検知が不安定になる。反射で異常フラグが立ち続ける。</p>
<p>システムは、夜間の強い照り返しの下で機能した再撮影戦略、類似エリアからのカメラアングル補正、および以前の検出を誤検出としてマークした人間のレビュー結論を呼び出す必要がある。完全一致のクエリは、既知のタスクIDや時間ウィンドウを見つけることができる。しかし、その関係がすでにラベル付けされていない限り、「このケースと同じような動作をした以前のグレアケース」を確実に検索することはできない。</p>
<p>意味的類似性は、機能する検索パターンである。<a href="https://zilliz.com/blog/similarity-metrics-for-vector-search">類似性メトリクスは</a>保存された記憶を関連性でランク付けし、<a href="https://milvus.io/docs/filtered-search.md">メタデータフィルタリングは</a>エリア、タスクタイプ、タイムウィンドウで検索スペースを狭めることができる。実際には、これはしばしば<a href="https://zilliz.com/learn/hybrid-search-combining-text-and-image">ハイブリッド検索に</a>なる。意味のためのセマンティックマッチングと、操作上の制約のための構造化フィルターである。</p>
<p>実装上、フィルターレイヤーはしばしばセマンティックメモリが運用可能になる場所である。<a href="https://milvus.io/docs/boolean.md">Milvusのフィルター式は</a>スカラー制約を定義し、<a href="https://milvus.io/docs/get-and-scalar-query.md?file=query.md">Milvusのスカラークエリーは</a>、システムが類似性ではなくメタデータによってレコードを必要とする場合、正確な検索をサポートする。</p>
<p>この検索パターンは、テキスト生成ではなく、物理世界の意思決定に適応した<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">検索拡張生成に似て</a>いる。ロボットは質問に答えるために文書を検索しているのではなく、次の安全な行動を選択するために過去の経験を検索しているのである。</p>
<p>Milvusにはすべてが入るわけではない。タスクID、タイムスタンプ、セッションメタデータはリレーショナルデータベースに保存される。生のランタイムログはロギングシステムに保存される。各ストレージシステムはそのために構築されたクエリーパターンを処理する。</p>
<table>
<thead>
<tr><th>データの種類</th><th>保存場所</th><th>クエリー方法</th></tr>
</thead>
<tbody>
<tr><td>タスクID、タイムスタンプ、セッションメタデータ</td><td>リレーショナルデータベース</td><td>正確な検索、結合</td></tr>
<tr><td>生のランタイムログとイベントストリーム</td><td>ロギングシステム</td><td>全文検索、時間範囲フィルタ</td></tr>
<tr><td>シーンルール、ハンドリングケース、経験ライトバック</td><td>milvus</td><td>意味によるベクトル類似性検索</td></tr>
</tbody>
</table>
<p>タスクが実行され、シーンが蓄積されると、長期記憶レイヤーは、モデルの微調整のためのサンプルのキュレーション、より広範なデータ分析、およびクロスデプロイメントの知識移転といった下流のプロセスに供給される。メモリは、将来のすべてのデプロイメントに、より高い出発点を与えるデータ資産に変化する。</p>
<h2 id="What-This-Architecture-Changes-in-Deployment" class="common-anchor-header">このアーキテクチャがデプロイメントで変えるもの<button data-href="#What-This-Architecture-Changes-in-Deployment" class="anchor-icon" translate="no">
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
    </button></h2><p>タスクのオブジェクト化、階層化されたメモリ、フィードバック・ループは、RoboBrainのタスク・ループをデプロイメント・パターンに変える。</p>
<p>新しいビルをパトロールするロボットは、他の場所で同じような照明、障害物、異常の種類、あるいはオペレータのルールをすでに処理していれば、ゼロから始めるべきではありません。それこそが、ロボットのタスク実行をシーン間でより再現性のあるものにし、長期的な展開コストをよりコントロールしやすくするのだ。</p>
<p>ロボットチームにとって、より深い教訓は、メモリは単なる記憶層ではないということだ。実行制御の一部なのだ。システムは、今何をしているのか、何が変化したのか、以前にも似たようなケースがあったのか、次の実行のために何を書き戻すべきなのかを知る必要がある。</p>
<h2 id="Further-Reading" class="common-anchor-header">さらなる読み物<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
    </button></h2><p>もしあなたがロボットの記憶、タスクの実行、具現化されたAIの意味検索に関する同様の問題に取り組んでいるのであれば、これらのリソースは次のステップとして有用である：</p>
<ul>
<li><a href="https://milvus.io/docs">Milvusのドキュメントを</a>読むか、<a href="https://milvus.io/docs/quickstart.md">Milvusのクイック</a>スタートを試して、ベクトル検索が実際にどのように機能するかを確認する。</li>
<li>プロダクションメモリレイヤーを計画している場合は、<a href="https://milvus.io/docs/architecture_overview.md">Milvusアーキテクチャの概要を</a>ご覧ください。</li>
<li><a href="https://zilliz.com/vector-database-use-cases">ベクターデータベースのユースケースを</a>閲覧し、プロダクションシステムにおけるセマンティック検索の例を確認する。</li>
<li><a href="https://milvus.io/community">Milvusコミュニティに</a>参加し、質問したり、構築しているものを共有する。</li>
<li>独自のインフラストラクチャを運用する代わりにマネージドMilvusをお望みなら、<a href="https://zilliz.com/cloud">Zilliz Cloudの</a>詳細をご覧ください。</li>
</ul>
