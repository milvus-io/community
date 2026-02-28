---
id: why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md
title: OpenClawのようなAIエージェントがトークンを使い果たす理由とコスト削減方法
author: Min Yin
date: 2026-2-28
cover: assets.zilliz.com/Blog_Open_Claw_Burning_Through_Tokens_1_39b7ee4fdf.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'OpenClaw, Token Optimization, Vector Search, AI Agents, Milvus'
meta_keywords: >-
  OpenClaw token costs, OpenClaw token optimization, reduce OpenClaw API costs,
  hybrid search BM25 vector, AI agent memory, memsearch, Milvus
meta_title: |
  Why AI Agents like OpenClaw Burn Through Tokens and How to Cut Costs
desc: >-
  OpenClawや他のAIエージェントのトークン課金が急増する理由と、BM25 +
  ベクトル検索（index1、QMD、milvus）とMarkdown-firstメモリ（memsearch）でそれを解決する方法。
origin: >-
  https://milvus.io/blog/why-ai-agents-like-openclaw-burn-through-tokens-and-how-to-cut-costs.md
---
<custom-h1>OpenClawのようなAIエージェントがトークンを消費する理由とコスト削減方法</custom-h1><p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a>（旧ClawdbotとMoltbot）を使ったことがある人なら、このAIエージェントがどれだけ優れているか、もうご存知だろう。高速で、ローカルで、柔軟性があり、Slack、Discord、コードベース、その他あなたが接続したもの全てにおいて驚くほど複雑なワークフローを実行することができる。しかし、本格的に使い始めると、<strong>トークンの使用量が増え始めるという</strong>1つのパターンがすぐに浮かび上がってくる。</p>
<p>これは特にOpenClawのせいではなく、今日のほとんどのAIエージェントの振る舞いなのだ。ファイルの検索、タスクの計画、メモの作成、ツールの実行、フォローアップの質問など、ほとんどすべてのことに対してLLMコールをトリガーする。そして、トークンはこれらの呼び出しの共通通貨であるため、すべてのアクションにはコストがかかる。</p>
<p>そのコストがどこから来るのかを理解するために、2つの大きな貢献者のフードの下を見る必要がある：</p>
<ul>
<li><strong>検索：</strong>不適切に構築された検索は、ファイル全体、ログ、メッセージ、コード領域など、モデルが実際には必要としない膨大なコンテキストのペイロードを引き込む。</li>
<li><strong>メモリ：</strong>重要でない情報を保存することで、エージェントは将来の呼び出し時に再読み込みと再処理を強いられ、時間の経過とともにトークンの使用量が増加する。</li>
</ul>
<p>この2つの問題は、能力を向上させることなく、運用コストを静かに増加させる。</p>
<h2 id="How-AI-Agents-Like-OpenClaw-Actually-Perform-Searches--and-Why-That-Burns-Tokens" class="common-anchor-header">OpenClawのようなAIエージェントが実際にどのように検索を行うか - そしてそれがトークンを消費する理由<button data-href="#How-AI-Agents-Like-OpenClaw-Actually-Perform-Searches--and-Why-That-Burns-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>エージェントがコードベースやドキュメント・ライブラリから情報を必要とする場合、通常はプロジェクト全体の<strong>Ctrl+Fに</strong>相当する操作を行います。一致するすべての行が、ランク付けもフィルタリングも優先順位付けもされずに返されます。Claude Codeはripgrepをベースにした専用のGrepツールでこれを実装しています。OpenClawには組み込みのコードベース検索ツールはありませんが、そのexecツールにより、基礎となるモデルはどんなコマンドでも実行することができ、ロードされたスキルはrgのようなツールを使うようにエージェントを導くことができます。どちらの場合も、コードベース検索はキーワードのマッチをランク付けもフィルターもせずに返します。</p>
<p>このブルートフォース・アプローチは、小規模なプロジェクトでは問題なく機能する。しかし、リポジトリが大きくなるにつれて、その代償は大きくなる。無関係なマッチがLLMのコンテキスト・ウィンドウに山積みになり、モデルは実際には必要のない何千ものトークンを読み込んで処理することを余儀なくされる。1回のスコープなし検索で、完全なファイル、巨大なコメントブロック、キーワードは共有しているが根本的な意図は共有していないログが引きずり込まれるかもしれない。このパターンを長いデバッグ・セッションやリサーチ・セッションで繰り返すと、あっという間に肥大化してしまう。</p>
<p>OpenClawもClaude Codeも、この肥大化を管理しようとしている。一方、Claude Codeはファイル読み込み出力を制限し、コンテキストのコンパクションをサポートする。これらの緩和策は機能するが、それは肥大化したクエリがすでに実行された後である。ランク付けされていない検索結果はまだトークンを消費しており、あなたはまだトークンの代金を支払っている。コンテキスト管理は、無駄を発生させた元の呼び出しではなく、将来のターンを支援する。</p>
<h2 id="How-AI-Agent-Memory-Works-and-Why-It-Also-Costs-Tokens" class="common-anchor-header">AIエージェントのメモリーの仕組みとトークンを消費する理由<button data-href="#How-AI-Agent-Memory-Works-and-Why-It-Also-Costs-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>トークンのオーバーヘッドの原因は検索だけではない。エージェントがメモリから呼び出すコンテキストの断片はすべて、LLMのコンテキスト・ウィンドウにも読み込まれなければならず、これにもトークンのコストがかかる。</p>
<p>今日ほとんどのエージェントが依存しているLLM APIはステートレスです：AnthropicのMessages APIはリクエストごとに完全な会話履歴を必要とし、OpenAIのChat Completions APIも同じように動作する。OpenAIの新しいステートフルなResponses APIでさえ、会話の状態をサーバーサイドで管理するため、すべてのコールで完全なコンテキストウィンドウを要求します。コンテキストにロードされたメモリは、それがそこに到達する方法に関係なく、トークンの費用がかかります。</p>
<p>これを回避するために、エージェントフレームワークは、ディスク上のファイルにメモを書き込み、エージェントがそれらを必要とするときにコンテキストウィンドウに関連するメモをロードバックする。例えば、OpenClaw はキュレーションされたノートを MEMORY.md に保存し、日々のログをタイムスタンプ付きの Markdown ファイルに追加し、ハイブリッド BM25 とベクトル検索でインデックスを作成し、エージェントが必要に応じて関連するコンテキストを呼び出せるようにしています。</p>
<p>OpenClawのメモリデザインはうまく機能していますが、OpenClawのエコシステム全体（ゲートウェイプロセス、メッセージングプラットフォーム接続、その他のスタック）が必要です。Claude Code のメモリも同様で、CLI と結びついている。これらのプラットフォーム以外でカスタムエージェントを構築する場合は、スタンドアロンのソリューションが必要です。次のセクションでは、両方の問題に対して利用可能なツールについて説明します。</p>
<h2 id="How-to-Stop-OpenClaw-From-Burning-Through-Tokens" class="common-anchor-header">OpenClaw がトークンを消費するのを止める方法<button data-href="#How-to-Stop-OpenClaw-From-Burning-Through-Tokens" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenClaw が消費するトークンの数を減らしたい場合、引けるレバーは2つあります。</p>
<ul>
<li>1つ目は、<strong>より良い検索</strong>です。grepスタイルのキーワードダンプを、ランク付けされた関連性主導の検索ツールに置き換えることで、モデルが実際に重要な情報だけを見るようにします。</li>
<li>もう1つは、<strong>より良いメモリ</strong>だ。不透明でフレームワークに依存したストレージから、理解し、検査し、制御できるストレージに移行することだ。</li>
</ul>
<h3 id="Replacing-grep-with-Better-Retrieval-index1-QMD-and-Milvus" class="common-anchor-header">より良い検索でgrepを置き換える：index1、QMD、milvus</h3><p>多くのAIコーディングエージェントは、grepやripgrepを使ってコードベースを検索する。Claude Codeには、ripgrepをベースに構築された専用のGrepツールがある。OpenClawはコードベース検索ツールを内蔵していないが、そのexecツールは基礎となるモデルに任意のコマンドを実行させることができ、ripgrepやQMDのようなスキルをエージェントの検索方法をガイドするためにロードすることができる。検索に特化したスキルがなければ、エージェントは基礎となるモデルが選択するどんなアプローチにも戻ってしまう。ランク付けされた検索がなければ、キーワードのマッチはフィルタリングされずにコンテキストウィンドウに入る。</p>
<p>これは、プロジェクトが十分に小さく、すべてのマッチがコンテキストウィンドウに快適に収まる場合に機能する。問題は、コードベースやドキュメントライブラリが大きくなり、キーワードが何十、何百ものヒットを返し、エージェントがそれらをすべてプロンプトに読み込まなければならなくなったときに始まります。そのような規模になると、単に一致度でフィルタリングするだけでなく、関連性でランク付けされた結果が必要になる。</p>
<p>標準的な修正は、2つの補完的なランキング方法を組み合わせたハイブリッド検索です：</p>
<ul>
<li>BM25は、与えられた文書にどれだけ頻繁に、どれだけユニークに用語が出現するかによって、各結果をスコアリングする。BM25は、与えられた文書にどれだけの頻度で、どれだけのユニークな用語が登場するかによって、各検索結果をスコア化する。「認証」に15回言及したフォーカスされたファイルは、1回言及した広大なファイルよりも上位にランクされる。</li>
<li>ベクトル検索は、テキストを意味の数値表現に変換するので、「認証」は、キーワードを共有していなくても、「ログインフロー」や「セッション管理」と一致することがある。</li>
</ul>
<p>どちらの方法も単独では十分ではない：BM25は言い換えられた用語を見逃し、ベクトル検索はエラーコードのような正確な用語を見逃す。両方を組み合わせ、フュージョン・アルゴリズムによってランク付けされたリストをマージすることで、両方のギャップをカバーすることができる。</p>
<p>以下のツールは、異なるスケールでこのパターンを実装している。index1、QMD、milvusは、それぞれ容量を増やしながらハイブリッド検索を追加している。</p>
<h4 id="index1-fast-hybrid-search-on-a-single-machine" class="common-anchor-header">index1: シングルマシンでの高速ハイブリッド検索</h4><p><a href="https://github.com/gladego/index1">index</a>1はハイブリッド検索を一つのSQLiteデータベースファイルにパッケージするCLIツールである。FTS5がBM25を処理し、sqlite-vecがベクトル類似度を処理し、RRFがランク付けされたリストを融合する。エンベッディングはOllamaによってローカルに生成されるので、あなたのマシンからは何も出ない。</p>
<p>index1は行数ではなく構造でコードをチャンクする：Markdownファイルは見出しによって、PythonファイルはASTによって、JavaScriptとTypeScriptは正規表現パターンによって分割される。つまり、検索結果は、ブロックの途中で切れてしまうような恣意的な行範囲ではなく、関数全体やドキュメントセクション全体のようなまとまった単位を返します。レスポンスタイムはハイブリッドクエリで40～180ms。Ollamaがない場合、BM25-onlyに戻るが、これはすべてのマッチをコンテキストウィンドウにダンプするのではなく、結果をランク付けする。</p>
<p>index1には、教訓、バグの根本原因、アーキテクチャの決定を保存するためのエピソード記憶モジュールも含まれている。これらの記憶は、独立したファイルとしてではなく、コードインデックスと同じSQLiteデータベース内に格納される。</p>
<p>注：index1は初期段階のプロジェクトです（2026年2月現在、星0つ、コミット数4）。コミットする前に、自分のコードベースと照らし合わせて評価してください。</p>
<ul>
<li>最適な<strong>人</strong>: 一人の開発者や小規模チームで、コードベースが一台のマシンに収まるような場合。</li>
<li>同じインデックスに複数ユーザーでアクセスする必要がある場合や、SQLiteファイル1つで快適に扱える範囲を超えるデータが<strong>ある場合</strong>。</li>
</ul>
<h4 id="QMD-higher-accuracy-through-local-LLM-re-ranking" class="common-anchor-header">QMD: ローカルLLM再順位付けによる高精度化</h4><p>Shopifyの創設者であるTobi Lütkeによって構築された<a href="https://github.com/tobi/qmd">QMD</a>（Query Markup Documents）は、第3のステージを追加します：LLM再ランキングだ。BM25とベクトル検索がそれぞれ候補を返した後、ローカルの言語モデルが上位の結果を再読み込みし、クエリとの実際の関連性で並び替える。これにより、キーワードと意味的一致の両方が、もっともらしいが間違った結果を返すケースを捕らえることができる。</p>
<p>QMDは、エンベッディングモデル(embeddinggemma-300M)、クロスエンコーダーリランカー(Qwen3-Reranker-0.6B)、クエリ展開モデル(qmd-query-expansion-1.7B)の3つのGGUFモデル(合計約2GB)を使って、あなたのマシン上で動作します。3つとも初回実行時に自動的にダウンロードされる。クラウドAPIコールもAPIキーもない。</p>
<p>トレードオフはコールドスタート時間です：ディスクから3つのモデルをロードするのにおよそ15秒から16秒かかります。QMDは永続サーバーモード(qmd mcp)をサポートしており、リクエスト間でモデルをメモリに保持し、繰り返しクエリーを行った場合のコールドスタートのペナルティを排除する。</p>
<ul>
<li><strong>最適</strong>な<strong>環境：</strong>データがマシンを離れることができず、レスポンスタイムよりも検索精度が重要なプライバシークリティカルな環境。</li>
<li>秒以下のレスポンスが必要な場合、チームで共有する場合、データセットがシングルマシンの容量を超える<strong>場合</strong>。</li>
</ul>
<h4 id="Milvus-hybrid-search-at-team-and-enterprise-scale" class="common-anchor-header">Milvus：チームやエンタープライズ規模でのハイブリッド検索</h4><p>上記のシングルマシンツールは、個々の開発者には有効ですが、複数の人やエージェントが同じナレッジベースにアクセスする必要がある場合には、限界に達します。<a href="https://github.com/milvus-io/milvus"></a></p>
<p><a href="https://github.com/milvus-io/milvus">Milvusは</a>、そのような次の段階のために構築されたオープンソースのベクトルデータベースである：分散、マルチユーザー、数十億のベクトルを扱うことができる。</p>
<p>Milvus 2.5から利用可能で、2.6では大幅に高速化された。生テキストを提供すると、Milvusはtantivyをベースに構築されたアナライザを使って内部的にトークン化し、その結果をスパースベクトルに変換します。</p>
<p>BM25表現はすでに保存されているため、検索時にその場でスコアを再計算する必要はない。これらの疎なベクトルは、同じコレクション内で密なベクトル（セマンティック埋め込み）と共存します。クエリ時には、Milvusがすぐに提供するRRFRankerのようなランカーを使って両方のシグナルを融合させる。index1やQMDと同じハイブリッド検索パターンだが、水平方向にスケールするインフラ上で動作する。</p>
<p>Milvusはまた、マルチテナント分離（チーム毎に独立したデータベースやコレクション）、自動フェイルオーバーによるデータレプリケーション、コスト効率に優れたストレージのためのホット/コールドデータティアリングなど、シングルマシンのツールにはない機能を提供します。エージェントの場合、これは複数の開発者や複数のエージェントインスタンスが、お互いのデータを踏むことなく、同じナレッジベースを同時に照会できることを意味します。</p>
<ul>
<li>複数の開発者やエージェントがナレッジベースを共有する場合、大規模または急成長するドキュメントセット、レプリケーション、フェイルオーバー、アクセス制御が必要な本番環境などに<strong>最適</strong>です。</li>
</ul>
<p>まとめると</p>
<table>
<thead>
<tr><th>ツール</th><th>ステージ</th><th>デプロイメント</th><th>移行シグナル</th></tr>
</thead>
<tbody>
<tr><td>クロード・ネイティブGrep</td><td>プロトタイピング</td><td>ビルトイン、ゼロセットアップ</td><td>請求書の増加やクエリの速度低下</td></tr>
<tr><td>インデックス1</td><td>シングルマシン（スピード）</td><td>ローカルSQLite + Ollama</td><td>マルチユーザーアクセスが必要、またはデータが1台のマシンを超える</td></tr>
<tr><td>QMD</td><td>シングルマシン（精度）</td><td>3つのローカルGGUFモデル</td><td>チーム共有インデックスが必要</td></tr>
<tr><td>Milvus</td><td>チームまたはプロダクション</td><td>分散クラスタ</td><td>大規模なドキュメントセットまたはマルチテナント要件</td></tr>
</tbody>
</table>
<h3 id="Reducing-AI-Agent-Token-Costs-by-Giving-Them-Persistent-Editable-Memory-with-memsearch" class="common-anchor-header">memsearchで永続的で編集可能なメモリを与えることでAIエージェントのトークンコストを削減</h3><p>検索の最適化はクエリごとのトークンの無駄を減らしますが、エージェントがセッション間で保持するものについては役に立ちません。</p>
<p>エージェントがメモリから呼び出すコンテキストのすべてのピースは、プロンプトにロードされなければならない。問題は、メモリーを保存するかどうかではなく、どのように保存するかだ。保存方法によって、エージェントが記憶しているものを見ることができるかどうか、間違っているときに修正できるかどうか、ツールを変更したときにそれを持ち出せるかどうかが決まります。</p>
<p>ほとんどのフレームワークは、この3つの点で失敗している。Mem0とZepはすべてをベクター・データベースに保存する：</p>
<ul>
<li><strong>不透明。</strong>APIに問い合わせなければ、エージェントが何を記憶しているのか見ることができない。</li>
<li><strong>編集が難しい。</strong>メモリの修正や削除は、ファイルを開くのではなく、APIコールを意味する。</li>
<li><strong>ロックされる。</strong>フレームワークの切り替えは、データのエクスポート、変換、再インポートを意味する。</li>
</ul>
<p>OpenClawは異なるアプローチをとります。すべてのメモリはディスク上のプレーンなMarkdownファイルに保存されます。エージェントは毎日のログを自動的に書き込み、人間はどのメモリファイルも直接開いて編集することができます。これは3つの問題をすべて解決します：メモリは読み取り可能で、編集可能で、設計上ポータブルです。</p>
<p>トレードオフはデプロイのオーバーヘッドだ。OpenClaw のメモリを実行するということは、OpenClaw のエコシステム全体を実行するということです：ゲートウェイ・プロセス、メッセージング・プラットフォーム接続、その他のスタック。すでにOpenClawを使用しているチームにとっては、それは問題ありません。<strong>memsearchは</strong>このギャップを埋めるために作られました：OpenClawのMarkdownファーストのメモリパターンを抽出し、どのエージェントでも動作するスタンドアロンライブラリにしました。</p>
<p><strong><a href="https://github.com/zilliztech/memsearch">memsearchは</a></strong>Zilliz（milvusの開発チーム）によって作られ、Markdownファイルを単一の真実のソースとして扱います。MEMORY.mdは、あなたが手で書いた長期的な事実や決定を保持する。デイリーログ（2026-02-26.md）はセッションサマリーから自動的に生成される。Milvusに保存されているベクターインデックスは、いつでもMarkdownから再構築できる派生レイヤーである。</p>
<p>実際には、テキストエディタで任意のメモリファイルを開き、エージェントが知っていることを正確に読み取り、変更することができるということです。ファイルを保存すると、memsearchのファイルウォッチャーが変更を検知し、自動的にインデックスを再作成する。Gitでメモリを管理したり、プルリクエストでAIが生成したメモリをレビューしたり、フォルダをコピーして新しいマシンに移動したりすることができる。Milvusのインデックスが失われた場合は、ファイルからインデックスを再構築します。ファイルが危険にさらされることはない。</p>
<p>memsearchは、前述のハイブリッド検索パターンを採用している。見出し構造と段落境界によって分割されたチャンク、BM25 + ベクトル検索、ログが大きくなった場合に古い記憶を要約するLLMを搭載したコンパクトコマンドなどだ。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_Open_Claw_Burning_Through_Tokens_3_d9df026b47.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>エージェントが何を記憶しているかを完全に可視化したいチーム、メモリのバージョン管理が必要なチーム、単一のエージェントフレームワークに縛られないメモリシステムが必要なチームに最適です。</p>
<p>まとめると</p>
<table>
<thead>
<tr><th>能力</th><th>Mem0 / Zep</th><th>メムサーチ</th></tr>
</thead>
<tbody>
<tr><td>真実のソース</td><td>ベクターデータベース（唯一のデータソース）</td><td>Markdownファイル（プライマリ） + Milvus（インデックス）</td></tr>
<tr><td>透明性</td><td>ブラックボックス、検査にはAPIが必要</td><td>任意の.mdファイルを開いて読む</td></tr>
<tr><td>編集性</td><td>APIコールによる修正</td><td>テキストエディタで直接編集可能。</td></tr>
<tr><td>バージョン管理</td><td>別途監査ロギングが必要</td><td>Gitがネイティブに動作</td></tr>
<tr><td>移行コスト</td><td>エクスポート→フォーマット変換→再インポート</td><td>Markdownフォルダをコピー</td></tr>
<tr><td>人間とAIのコラボレーション</td><td>AIが書き、人間が観察する</td><td>人間は編集、補足、レビューが可能</td></tr>
</tbody>
</table>
<h2 id="Which-setup-fits-your-scale" class="common-anchor-header">どの設定があなたの規模に合うか<button data-href="#Which-setup-fits-your-scale" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>シナリオ</th><th>検索</th><th>メモリー</th><th>次に進むタイミング</th></tr>
</thead>
<tbody>
<tr><td>初期のプロトタイプ</td><td>Grep（組み込み）</td><td>-</td><td>課金額が上がるか、クエリが遅くなる</td></tr>
<tr><td>単一の開発者、検索のみ</td><td><a href="https://github.com/gladego/index1">index1</a>(スピード) または<a href="https://github.com/tobi/qmd">QMD</a>(精度)</td><td>-</td><td>マルチユーザーアクセスが必要、またはデータが1台のマシンを超える</td></tr>
<tr><td>シングル開発者、両方</td><td><a href="https://github.com/gladego/index1">インデックス1</a></td><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>マルチユーザアクセスが必要、またはデータが1台のマシンを超える</td></tr>
<tr><td>チームまたはプロダクション、両方</td><td><a href="https://github.com/milvus-io/milvus">milvus</a></td><td><a href="https://github.com/zilliztech/memsearch">memsearch</a></td><td>-</td></tr>
<tr><td>迅速な統合、メモリのみ</td><td>-</td><td>Mem0またはZep</td><td>メモリの検査、編集、移行が必要</td></tr>
</tbody>
</table>
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
    </button></h2><p>AIエージェントの常時稼働に伴うトークンのコストは避けられないものではない。このガイドでは、より良いツールが無駄を省くことができる2つの領域、検索とメモリを取り上げた。</p>
<p>Grepは小規模では機能するが、コードベースが大きくなるにつれて、ランク付けされていないキーワードのマッチは、モデルが必要としなかったコンテンツでコンテキストウィンドウを溢れさせる。<a href="https://github.com/gladego/index1"></a><a href="https://github.com/gladego/index1">index</a>1と<a href="https://github.com/tobi/qmd"></a><a href="https://github.com/tobi/qmd"></a>QMDは、BM25キーワードスコアリングとベクトル検索を組み合わせ、最も関連性の高い結果のみを返すことで、1台のマシンでこれを解決する。チーム、マルチエージェントのセットアップ、またはプロダクションワークロードのために、<a href="https://milvus.io"></a><a href="https://milvus.io">Milvusは</a>、水平方向にスケールするインフラストラクチャ上で同じハイブリッド検索パターンを提供する。</p>
<p><a href="https://github.com/zilliztech/memsearch">memsearchは</a>異なるアプローチを取る。メモリは、あなたが読み、編集し、Gitでバージョン管理できるプレーンなMarkdownファイルに保存される。milvusは、それらのファイルからいつでも再構築できる派生インデックスとして機能する。あなたはエージェントが何を知っているかをコントロールし続けることができる。</p>
<p><a href="https://github.com/zilliztech/memsearch"></a><a href="https://github.com/zilliztech/memsearch">memsearchと</a> <a href="https://github.com/milvus-io/milvus"></a><a href="https://github.com/milvus-io/milvus">Milvusは</a>どちらもオープンソースです。私たちはmemsearchを積極的に開発しており、実運用で使用している方からのフィードバックをお待ちしています。issueを発行したり、PRを提出したり、何がうまくいっていて何がうまくいっていないかを教えてください。</p>
<p>このガイドで言及しているプロジェクト</p>
<ul>
<li><a href="https://github.com/zilliztech/memsearch">memsearch</a>：Milvusが支援するAIエージェントのためのMarkdown-firstメモリ。</li>
<li><a href="https://github.com/milvus-io/milvus">Milvus</a>：スケーラブルなハイブリッド検索のためのオープンソースのベクトルデータベース。</li>
<li><a href="https://github.com/gladego/index1">index1</a>: AIコーディングエージェントのためのBM25 + ベクトルハイブリッド検索。</li>
<li><a href="https://github.com/tobi/qmd">QMD</a>: LLM再順位付けによるローカルハイブリッド検索。</li>
</ul>
<h2 id="Keep-Reading" class="common-anchor-header">続きを読む<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">OpenClawのメモリシステムを抽出し、オープンソース化しました。</a></li>
<li><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">クロードコードのための永続メモリ： memsearch ccplugin</a></li>
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw とは？オープンソースAIエージェントの完全ガイド</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">OpenClawチュートリアルローカルAIアシスタントのためのSlackへの接続</a></li>
</ul>
