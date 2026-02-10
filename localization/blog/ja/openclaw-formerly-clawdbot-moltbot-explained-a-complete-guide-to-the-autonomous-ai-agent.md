---
id: >-
  openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md
title: OpenClaw（旧Clawdbot &amp; Moltbot）解説：自律型AIエージェントの完全ガイド
author: 'Julie Xia, Fendy Feng'
date: 2026-02-10T00:00:00.000Z
cover: assets.zilliz.com/Open_Claw_Autonomous_Agent_Cover_11zon_1_8124f1b98b.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'OpenClaw, Clawdbot, Moltbot, Moltbook, Tutorial'
meta_keywords: 'OpenClaw, Clawdbot, Moltbot, AI agent, autonomous AI agent'
meta_title: |
  What Is OpenClaw? Complete Guide to the Open-Source AI Agent
desc: >-
  OpenClaw（Clawdbot/Moltbot）の完全ガイド -
  動作方法、セットアップのチュートリアル、ユースケース、Moltbook、セキュリティ警告。
origin: 'https://milvus.io/blog/openclaw-clawdbot-ai-agent-explained.md'
---
<p><a href="https://openclaw.ai/">OpenClaw</a>（旧称：Moltbot、Clawdbot）はオープンソースのAIエージェントで、あなたのマシン上で動作し、あなたが既に使用しているメッセージングアプリ（WhatsApp、Telegram、Slack、Signalなど）を介して接続し、シェルコマンド、ブラウザの自動化、メール、カレンダー、ファイル操作などのアクションをあなたに代わって実行する。ハートビート・スケジューラーが設定可能な間隔で起動するので、プロンプトが表示されなくても実行できる。2026年1月下旬のローンチから1週間足らずで<a href="https://github.com/openclaw/openclaw">10万以上の</a>GitHubスターを獲得し、GitHub史上最も急速に成長したオープンソース・リポジトリのひとつとなった。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_1_e9bc8881bc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>OpenClawの特徴は、その組み合わせにある：MITライセンス、オープンソース、ローカルファースト（メモリとデータはディスク上のMarkdownファイルとして保存される）、そしてポータブルスキルフォーマットによるコミュニティの拡張性だ。ある開発者のエージェントは、彼が寝ている間にEメールで車の購入を4,200ドル値引きするよう交渉し、別の開発者は、頼まれもしないのに保険の拒否に対して法的な反論を提出した。</p>
<p>このガイドでは、OpenClawとは何か、どのように動作するのか、実生活で何ができるのか、Moltbookとの関連性、それに関連するセキュリティリスクなど、知っておくべきことをすべて説明します。</p>
<h2 id="What-is-OpenClaw" class="common-anchor-header">OpenClawとは？<button data-href="#What-is-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://openclawd.ai/">OpenClaw</a>（以前のClawdbotとMoltbot）は、あなたのマシン上で動作し、あなたのチャットアプリに住み着く自律的なオープンソースのAIアシスタントです。WhatsApp、Telegram、<a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Slack</a>、Discord、iMessage、Signalなど、あなたがすでに使っているものを使って話しかけると、AIが話し返してくれる。しかし、ChatGPTやClaudeのウェブインターフェイスとは異なり、OpenClawは質問に答えるだけではない。シェルコマンドの実行、ブラウザの制御、ファイルの読み書き、カレンダーの管理、Eメールの送信など、すべてテキストメッセージをトリガーに行うことができる。</p>
<p>データのコントロールを犠牲にすることなく、またホストされたサービスに依存することなく、どこからでもメッセージ可能なパーソナルAIアシスタントを求める開発者やパワーユーザー向けに構築されています。</p>
<h3 id="Key-Capabilities-of-OpenClaw" class="common-anchor-header">OpenClawの主な機能</h3><ul>
<li><p><strong>マルチチャネルゲートウェイ</strong>- WhatsApp、Telegram、Discord、iMessage を単一のゲートウェイプロセスで。拡張パッケージで Mattermost などを追加できます。</p></li>
<li><p><strong>マルチエージェントルーティング</strong>- エージェント、ワークスペース、送信者ごとにセッションを分離。</p></li>
<li><p><strong>メディアサポート</strong>- 画像、音声、ドキュメントの送受信。</p></li>
<li><p><strong>ウェブコントロール UI</strong>- チャット、設定、セッション、ノードのブラウザダッシュボード。</p></li>
<li><p><strong>モバイルノード</strong>- CanvasをサポートしたiOSとAndroidノードのペアリング。</p></li>
</ul>
<h3 id="What-Makes-OpenClaw-Different" class="common-anchor-header">OpenClaw の特徴</h3><p><strong>OpenClaw はセルフホストです。</strong></p>
<p>OpenClaw のゲートウェイ、ツール、メモリは、ベンダーがホストする SaaS ではなく、お客様のマシン上にあります。OpenClaw は、会話、長期記憶、スキルをプレーンな Markdown や YAML ファイルとして、あなたのワークスペースと<code translate="no">~/.openclaw</code> の下に保存します。 あなたは、それらをテキストエディタで閲覧したり、Git でバックアップしたり、grep で検索したり、削除したりすることができます。AIモデルは、クラウドホスト（Anthropic、OpenAI、Google）でもローカル（Ollama、LM Studio、その他のOpenAI互換サーバー経由）でも、モデルブロックの設定次第で利用できる。すべての推論を自分のハードウェアに留めたい場合は、OpenClawをローカルモデルだけに向ける。</p>
<p><strong>OpenClawは完全に自律的です</strong></p>
<p>ゲートウェイはバックグラウンドデーモン ( Linux では<code translate="no">systemd</code>, macOS では<code translate="no">LaunchAgent</code> ) として動作し、設定可能なハートビート ( デフォルトでは30分毎、Anthropic OAuth では1時間毎 ) で動作します。各ハートビートで、エージェントはワークスペースの<code translate="no">HEARTBEAT.md</code> からチェックリストを読み込み、アクションが必要な項目があるかどうかを判断し、あなたにメッセージを送るか、<code translate="no">HEARTBEAT_OK</code> （ゲートウェイは黙ってドロップする）に応答します。外部イベント（ウェブフック、cronジョブ、チームメイトメッセージ）もエージェントのループをトリガーします。</p>
<p>エージェントがどの程度の自律性を持つかは、コンフィギュレーションの選択です。ツールポリシーと実行者承認は、リスクの高いアクションを管理します：電子メールの読み取りは許可するが、送信前に承認が必要、ファイルの読み取りは許可するが、削除はブロックする、などです。これらのガードレールを無効にすれば、何も聞かずに実行されます。</p>
<p><strong>OpenClawはオープンソースです。</strong></p>
<p>コアのGatewayはMITライセンスです。完全に読み取り可能で、フォーク可能で、監査可能だ。これは文脈上重要である：Anthropicは、Claude Codeのクライアントの難読化を解除した開発者に対してDMCAによるテイクダウンを行った。</p>
<p>エコシステムはオープン性を反映している。<a href="https://github.com/openclaw/openclaw">何百人ものコントリビューターが</a>スキル（YAMLフロントマターと自然言語命令を含むモジュール化された<code translate="no">SKILL.md</code> ファイル）を構築しており、ClawHub（エージェントが自動的に検索できるスキルレジストリ）、コミュニティリポジトリ、または直接URLを通じて共有されている。フォーマットはポータブルで、クロードコードやカーソルの規約と互換性があります。スキルが存在しない場合は、エージェントにタスクを記述し、ドラフトを作成させることができます。</p>
<p>このローカルオーナーシップ、コミュニティ主導の進化、自律的な運用の組み合わせが、開発者が興奮する理由だ。AIツールの完全なコントロールを望む開発者にとって、これは重要なことなのだ。</p>
<h2 id="How-OpenClaw-Works-Under-the-Hood" class="common-anchor-header">OpenClawの仕組み<button data-href="#How-OpenClaw-Works-Under-the-Hood" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>1つのプロセス、すべての内部</strong></p>
<p><code translate="no">openclaw gateway</code> を実行すると、ゲートウェイと呼ばれる長寿命のNode.jsプロセスが1つ起動する。このプロセスは、チャネル接続、セッションの状態、エージェントのループ、モデルの呼び出し、ツールの実行、メモリーの永続性など、システム全体だ。管理する個別のサービスはない。</p>
<p>一つのプロセスの中に5つのサブシステムがある：</p>
<ol>
<li><p><strong>チャネルアダプタ</strong>- プラットフォームごとに1つ（WhatsApp用のBaileys、Telegram用のgrammYなど）。インバウンドメッセージを共通のフォーマットに正規化し、返信をシリアライズして送り返す。</p></li>
<li><p><strong>セッション・マネージャー</strong>- 送信者のアイデンティティと会話のコンテキストを解決する。DMはメインのセッションにまとまり、グループチャットは独自のセッションになる。</p></li>
<li><p><strong>キュー</strong>- セッションごとに実行をシリアライズします。実行中にメッセージが到着した場合、次の実行のためにそれを保持、注入、または収集します。</p></li>
<li><p><strong>エージェントランタイム</strong>- コンテキスト（AGENTS.md、SOUL.md、TOOLS.md、MEMORY.md、デイリーログ、会話履歴）をアセンブルし、エージェントループを実行する。</p></li>
<li><p><strong>コントロールプレーン</strong>- WebSocket API<code translate="no">:18789</code> 。CLI、macOSアプリ、ウェブUI、iOS/Androidノードはすべてここに接続する。</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_2_07a24c0492.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>モデルは外部API呼び出しで、ローカルで実行されるかどうかはわからない。ルーティング、ツール、メモリ、ステートなど、他のすべてはあなたのマシン上の1つのプロセス内に存在する。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_3_0206219c02.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>単純なリクエストであれば、このループは数秒で完了する。マルチステップツールチェーンはもっと時間がかかる。モデルは外部API呼び出しであり、ローカルで実行されるかどうかはわからないが、ルーティング、ツール、メモリー、ステートなど、他のすべてはあなたのマシン上の1つのプロセス内に存在する。</p>
<p><strong>クロードコードと同じループ、異なるシェル</strong></p>
<p>エージェントのループ - 入力 → コンテキスト → モデル → ツール → 繰り返し → 返信 - は、クロードコードが使っているのと同じパターンです。すべての本格的なエージェントフレームワークは、このパターンのいくつかのバージョンを実行しています。異なるのは、それを包むものです。</p>
<p>Claude Code はそれを<strong>CLI で</strong>ラップしている。OpenClawは、12以上のメッセージングプラットフォームに接続され、ハートビートスケジューラ、チャンネルをまたいだセッション管理、そして実行時に持続するメモリを備えた<strong>、永続的なデーモンで</strong>ラップしています。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_4_9c481b1ce7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>モデルルーティングとフェイルオーバー</strong></p>
<p>OpenClaw はモデルを選びません。<code translate="no">openclaw.json</code> でプロバイダを設定すると、ゲートウェイはそれに応じて、認証プロファイルのローテーションや、プロバイダがダウンしたときに指数関数的バックオフを使用するフォールバック・チェーンをルーティングします。しかし、OpenClawは、システム命令、会話履歴、ツールスキーマ、スキル、メモリといった大規模なプロンプトを組み立てるため、モデルの選択は重要です。このようなコンテキストの負荷が、ほとんどのデプロイメントがフロンティアモデルを主要なオーケストレーターとして使用し、より安価なモデルがハートビートとサブエージェントタスクを処理する理由である。</p>
<p><strong>クラウドとローカルのトレードオフ</strong></p>
<p>ゲートウェイから見ると、クラウドとローカルのモデルは同じように見える。トレードオフが異なる点です。</p>
<p>クラウドモデル（Anthropic、OpenAI、Google）は、強力な推論、大きなコンテキストウィンドウ、信頼性の高いツールの使用を提供します。これらは、プライマリオーケストレーターのデフォルトの選択だ。ライトユーザーは$5-20/月、頻繁なハートビートと大きなプロンプトを伴うアクティブエージェントは通常$50-150/月、最適化されていないパワーユーザーは数千ドルという報告もある。</p>
<p>Ollamaや他のOpenAI互換サーバーを介したローカルモデルは、トークン毎のコストを削減するが、ハードウェアが必要であり、OpenClawは少なくとも64Kトークンのコンテキストを必要とするため、実行可能な選択肢が狭まる。14Bのパラメータでは、モデルは単純な自動化を扱うことができますが、マルチステップエージェントタスクには限界があります。コミュニティの経験では、信頼できる閾値は32B以上であり、少なくとも24GBのVRAMが必要です。推論や拡張コンテキストではフロンティアクラウドモデルに及ばないが、完全なデータローカリティと予測可能なコストを得ることができる。</p>
<p><strong>このアーキテクチャで得られるもの</strong></p>
<p>すべてが1つのプロセスで実行されるため、ゲートウェイは単一のコントロール・サーフェスとなる。どのモデルを呼び出すか、どのツールを許可するか、どの程度のコンテキストを含めるか、どの程度の自律性を与えるか、これらすべてを一箇所で設定できる。チャンネルはモデルから切り離されている。TelegramをSlackに、ClaudeをGeminiに交換しても、他は何も変わらない。チャネルの配線、ツール、メモリはあなたのインフラに留まり、モデルはあなたが外側に向ける依存関係である。</p>
<h3 id="What-Hardware-Do-You-Actually-Need-to-Run-OpenClaw" class="common-anchor-header">OpenClawを動かすために必要なハードウェアは？</h3><p>1月下旬、開発者たちが複数の Mac Minis を箱から出している様子を示す投稿が出回りました。Google DeepMindのLogan Kilpatrickでさえ、Mac Minisを注文したことを投稿した。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_5_896f6a05f6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>公式ドキュメントによると、基本的なチャットに必要な最小要件は2GBのRAMと2つのCPUコア。月額5ドルのVPSでも十分対応できる。Pulumiを使ってAWSやHetznerにデプロイしたり、小さなVPS上でDockerで動かしたり、埃をかぶっている古いラップトップを使うこともできる。Mac Miniのトレンドは、技術的な要件ではなく、社会的な証明によってもたらされた。</p>
<p><strong>では、なぜ人々は専用のハードウェアを購入したのだろうか？理由は2つある。</strong>自律的なエージェントにシェルアクセスを与える場合、何か問題が発生したときに物理的にプラグを抜くことができるマシンが必要になる。また、OpenClawはハートビートで動作するため、設定可能なスケジュールで起動し、あなたの代わりに動作します。クラウドサービスの可用性に依存することなく、コンピュータを物理的に分離して利用できることが魅力です。</p>
<h2 id="How-to-Install-OpenClaw-and-Quickly-Get-Started" class="common-anchor-header">OpenClaw のインストールと迅速な開始方法<button data-href="#How-to-Install-OpenClaw-and-Quickly-Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Node 22+が</strong>必要です。わからない場合は<code translate="no">node --version</code> に確認してください。</p>
<p><strong>CLIをインストールします：</strong></p>
<p>macOS/Linux の場合：</p>
<pre><code translate="no">curl -fsSL <span class="hljs-attr">https</span>:<span class="hljs-comment">//openclaw.ai/install.sh | bash</span>
<button class="copy-code-btn"></button></code></pre>
<p>Windows (PowerShell) の場合：</p>
<pre><code translate="no">iwr -useb <span class="hljs-attr">https</span>:<span class="hljs-comment">//openclaw.ai/install.ps1 | iex</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>オンボーディングウィザードを実行します：</strong></p>
<pre><code translate="no">openclaw onboard --install-daemon
<button class="copy-code-btn"></button></code></pre>
<p>認証、ゲートウェイ設定、オプションでメッセージングチャンネル（WhatsApp、Telegramなど）の接続を行います。<code translate="no">--install-daemon</code> フラグはゲートウェイをバックグラウンドサービスとして登録し、自動的に起動します。</p>
<p><strong>ゲートウェイが起動していることを確認する：</strong></p>
<pre><code translate="no">openclaw gateway status
<button class="copy-code-btn"></button></code></pre>
<p><strong>ダッシュボードを開く：</strong></p>
<pre><code translate="no">openclaw dashboard
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">http://127.0.0.1:18789/</code> でコントロール UI を開きます。ここでエージェントとのチャットを開始することができます - チャネルの設定は必要ありません。</p>
<p><strong>早い段階で知っておくべきことがいくつかあります。</strong>デーモンとしてではなく、フォアグラウンドでゲートウェイを実行したい場合（デバッグに便利）、実行できます：</p>
<pre><code translate="no">openclaw gateway --port 18789
<button class="copy-code-btn"></button></code></pre>
<p>また、OpenClaw の設定や状態を保存する場所をカスタマイズする必要がある場合、例えばサービスアカウントやコンテナで実行する場合、重要な env vars が3つあります：</p>
<ul>
<li><p><code translate="no">OPENCLAW_HOME</code> - 内部パス解決用のベースディレクトリ</p></li>
<li><p><code translate="no">OPENCLAW_STATE_DIR</code> - 状態ファイルの保存場所の上書き</p></li>
<li><p><code translate="no">OPENCLAW_CONFIG_PATH</code> - 特定の設定ファイルを指す</p></li>
</ul>
<p>ゲートウェイを起動し、ダッシュボードをロードしたら、設定は完了だ。ここから、メッセージングチャネルを接続し、スキル承認を設定したいと思うでしょう。</p>
<h2 id="How-Does-OpenClaw-Compare-to-Other-AI-Agents" class="common-anchor-header">OpenClawは他のAIエージェントと比べてどうなのか？<button data-href="#How-Does-OpenClaw-Compare-to-Other-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>テック・コミュニティーはOpenClawを "Claude, but with hands "と呼んでいる。鮮やかな表現だが、アーキテクチャーの違いを見逃している。Anthropicには<a href="https://claude.com/blog/claude-code">Claude Codeと</a> <a href="https://claude.com/blog/cowork-research-preview">Coworkが</a>あり、OpenAIには<a href="https://openai.com/codex/">Codexと</a> <a href="https://openai.com/index/introducing-chatgpt-agent/">ChatGPTエージェントが</a>あり、<a href="https://manus.im/">Manusも</a>存在する。実際に重要なのは次のような違いだ：</p>
<ul>
<li><p><strong>エージェントが実行される場所</strong>（あなたのマシン対プロバイダーのクラウド）</p></li>
<li><p><strong>どのようにエージェントとやりとりするか</strong>（メッセージングアプリ、ターミナル、IDE、ウェブUI）</p></li>
<li><p><strong>状態と長期メモリの所有者</strong>（ローカルファイル vs プロバイダーアカウント）</p></li>
</ul>
<p>高いレベルで言えば、OpenClaw はローカルファーストのゲートウェイで、あなたのハードウェアに常駐し、チャットアプリを通じて対話します。</p>
<table>
<thead>
<tr><th></th><th>OpenClaw</th><th>クロードコード</th><th>OpenAI コーデックス</th><th>ChatGPT エージェント</th><th>Manus</th></tr>
</thead>
<tbody>
<tr><td>オープンソース</td><td>はい。MITライセンスのコアゲートウェイ</td><td>いいえ</td><td>いいえ</td><td>いいえ。</td><td>クローズドソースSaaS</td></tr>
<tr><td>インターフェース</td><td>メッセージングアプリ（WhatsApp、Telegram、Slack、Discord、Signal、iMessageなど）</td><td>ターミナル、IDE統合、ウェブおよびモバイルアプリ</td><td>ターミナルCLI、IDE統合、Codex Web UI</td><td>ChatGPTウェブおよびデスクトップアプリ（macOSエージェントモードを含む）</td><td>ウェブダッシュボード、ブラウザオペレータ、Slack、アプリの統合</td></tr>
<tr><td>主な焦点</td><td>ツールやサービスを横断した個人＋開発者の自動化</td><td>ソフトウェア開発とDevOpsワークフロー</td><td>ソフトウェア開発とコード編集</td><td>汎用的なウェブタスク、リサーチ、生産性ワークフロー</td><td>ビジネスユーザーのためのリサーチ、コンテンツ、ウェブの自動化</td></tr>
<tr><td>セッションメモリ</td><td>ディスク上のファイルベースのメモリ（Markdown + ログ）、オプションのプラグインはセマンティック/長期メモリを追加します。</td><td>履歴を持つプロジェクト単位のセッションと、オプションでアカウント上のクロードメモリ</td><td>CLI / エディタでのセッションごとの状態; 組み込みの長期ユーザーメモリはない</td><td>ChatGPTのアカウントレベルメモリ機能（有効な場合）にバックアップされたタスク単位の "エージェントラン"</td><td>定期的なワークフロー用に調整された、クラウド側、実行中のアカウントスコープのメモリ</td></tr>
<tr><td>展開</td><td>マシンまたは VPS 上でゲートウェイ/デーモンを常時実行; LLM プロバイダを呼び出す</td><td>開発者のマシンでCLI/IDEプラグインとして実行；全てのモデル呼び出しはAnthropicのAPIへ</td><td>CLIはローカルで実行され、モデルはOpenAIのAPIまたはCodex Web経由で実行されます。</td><td>エージェントはChatGPTクライアントから仮想ワークスペースをスピンアップします。</td><td>エージェントはManusのクラウド環境で実行されます。</td></tr>
<tr><td>対象者</td><td>独自のインフラストラクチャの運用に慣れている開発者とパワーユーザー</td><td>ターミナルやIDEで作業する開発者やDevOpsエンジニア</td><td>ターミナル/IDEでのコーディングエージェントを求める開発者</td><td>ChatGPTをエンドユーザタスクに使用しているナレッジワーカーやチーム</td><td>ウェブ中心のワークフローを自動化するビジネスユーザーとチーム</td></tr>
<tr><td>費用</td><td>無料 + 利用状況に応じたAPIコール</td><td>20-200ドル/月</td><td>20-200ドル/月</td><td>20-200ドル/月</td><td>39-199ドル/月（クレジット）</td></tr>
</tbody>
</table>
<h2 id="Real-World-Applications-of-OpenClaw" class="common-anchor-header">OpenClaw の実際のアプリケーション<button data-href="#Real-World-Applications-of-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenClawの実用的な価値は、その範囲から生まれます。ここでは、Milvus コミュニティに導入したサポートボットから始まり、人々がOpenClaw を使って構築した興味深いものを紹介します。</p>
<p><strong>ZillizサポートチームはMilvusコミュニティのためにSlack上でAIサポートボットを構築しました。</strong></p>
<p>Zillizチームは、OpenClawを<a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">Milvusコミュニティのアシスタントとして</a>Slackワークスペースに接続しました。セットアップは20分で完了した。今では、Milvusに関するよくある質問に答えたり、エラーのトラブルシューティングを手伝ったり、関連ドキュメントを紹介したりしている。もし同じようなことを試してみたいのであれば、OpenClawをSlackに接続する方法についての完全な<a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">ステップバイステップのチュートリアルを</a>書きました。</p>
<ul>
<li><strong>OpenClaw チュートリアル：</strong> <a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">OpenClaw を Slack に接続するためのステップバイステップガイド</a></li>
</ul>
<p><strong>AJ Stuyvenberg氏は、寝ている間に車の購入を4,200ドル値引き交渉するためのエージェントを構築した。</strong></p>
<p>ソフトウェアエンジニアのAJ Stuyvenberg氏は、2026年式のHyundai Palisadeを購入することをOpenClawに課した。エージェントは地元のディーラー在庫を調べ、彼の電話番号とEメールを使ってコンタクトフォームに記入し、数日かけてディーラー同士を戦わせた。最終的な結果は、定価より<a href="https://aaronstuyvenberg.com/posts/clawd-bought-a-car">4,200ドル</a>安く、スタイブンバーグは書類にサインするためだけに現れた。「車購入の面倒な面をAIにアウトソーシングするのは新鮮でよかった」と彼は書いている。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_6_b147a5e824.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Hormoldの代理店は、以前解決した保険紛争を迅速に解決した。</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_6_5_b1a9f37495.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Hormoldというユーザーは、Lemonade Insuranceに保険金請求を拒否されました。彼のOpenClawは拒絶のメールを発見し、保険約款の文言を引用した反論を作成し、明確な許可なくそれを送信しました。レモネードは調査を再開した。「私の@openclawが偶然レモネード保険と喧嘩を始めた」と彼はツイートした。</p>
<h2 id="Moltbook-A-Social-Network-Built-with-OpenClaw-for-AI-Agents" class="common-anchor-header">モルトブック：AIエージェントのためにOpenClawで構築されたソーシャルネットワーク<button data-href="#Moltbook-A-Social-Network-Built-with-OpenClaw-for-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>上記の例は、OpenClawが個々のユーザーのタスクを自動化していることを示している。しかし、このようなエージェントが何千人も相互作用するとどうなるのだろうか？</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_7_2dd1b06c04.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>2026年1月28日、OpenClawにインスパイアされ、OpenClawで構築された起業家マット・シュリヒトは、AIエージェントだけが投稿できるRedditスタイルのプラットフォーム、<a href="https://moltbook.com/">Moltbookを</a>立ち上げた。成長は早かった。72時間以内に32,000人のエージェントが登録した。1週間後には150万人を突破した。最初の1週間で100万人以上の人間が閲覧に訪れた。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/OC_8_ce2b911259.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>セキュリティー問題も同様に早くやってきた。ローンチから4日後の1月31日、<a href="https://www.404media.co/exposed-moltbook-database-let-anyone-take-control-of-any-ai-agent-on-the-site/">404 Mediaは</a>、Supabaseデータベースの設定ミスにより、プラットフォームのバックエンド全体がインターネット上に公開されてしまったと<a href="https://www.404media.co/exposed-moltbook-database-let-anyone-take-control-of-any-ai-agent-on-the-site/">報じた</a>。セキュリティ研究者のJameson O'Reillyがこの欠陥を発見し、<a href="https://www.wiz.io/blog/exposed-moltbook-database-reveals-millions-of-api-keys">Wizは独自に</a>それを<a href="https://www.wiz.io/blog/exposed-moltbook-database-reveals-millions-of-api-keys">確認</a>し、150万エージェントのAPIキー、35,000以上のメールアドレス、数千のプライベートメッセージを含むすべてのテーブルへの認証されていない読み取りと書き込みアクセスを文書化した。</p>
<p>Moltbookがマシンの創発的な行動を表しているのか、それともエージェントが学習データからSF的な表現を再現しているのかは、未解決の問題である。より曖昧でないのは、技術的なデモンストレーションである。自律エージェントが永続的なコンテキストを維持し、共有プラットフォーム上で協調し、明示的な指示なしに構造化された出力を生成する。OpenClawや類似のフレームワークで構築するエンジニアにとって、これはエージェント型AIの機能とセキュリティ上の課題の両方をスケールアップするライブプレビューとなる。</p>
<h2 id="Technical-Risks-and-Production-Considerations-for-OpenClaw" class="common-anchor-header">OpenClawの技術的リスクと生産上の注意点<button data-href="#Technical-Risks-and-Production-Considerations-for-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenClawを重要な場所にデプロイする前に、実際に実行しているものを理解する必要があります。OpenClawは、シェルアクセス、ブラウザコントロール、そしてあなたに代わって電子メールを送信する機能を持つエージェントです。それは強力だが、攻撃対象は膨大で、プロジェクトはまだ若い。</p>
<p><strong>認証モデルには重大な穴があった。</strong>2026年1月30日、depthfirstのMav Levinが<a href="https://thehackernews.com/2026/02/openclaw-bug-enables-one-click-remote.html">CVE-2026-25253</a>(CVSS 8.8)を公開した。クロスサイトWebSocketハイジャックのバグで、どのウェブサイトもあなたの認証トークンを盗み、悪意のあるリンク1つであなたのマシンをRCEすることができる。ワンクリックでフルアクセス。このバグは<code translate="no">2026.1.29</code> で修正されましたが、Censys は当時、21,000 以上の OpenClaw インスタンスが公衆インターネットに公開されていることを発見しました。<strong>もし古いバージョンを使っていたり、ネットワーク設定をロックダウンしていなかったりしたら、まずそれをチェックしてください。</strong></p>
<p><strong>スキルは見知らぬ人のコードに過ぎず、サンドボックスは存在しない。</strong> <a href="https://blogs.cisco.com/ai/personal-ai-agents-like-openclaw-are-a-security-nightmare">Ciscoのセキュリティチームは</a>、"What Would Elon Do? "と呼ばれる、リポジトリで1位になるようゲーム化されたスキルをバラバラにした。このスキルは、プロンプト・インジェクションを使って安全性チェックを回避し、攻撃者が管理するサーバーにユーザーデータを流出させるという、れっきとしたマルウェアだった。彼らはこの1つのスキルに9つの脆弱性を発見し、そのうちの2つはクリティカルだった。複数のプラットフォーム（Claude、Copilot、一般的なAgentSkillsリポジトリ）にまたがる31,000のエージェントスキルを監査したところ、26%に少なくとも1つの脆弱性がありました。2月の最初の週だけで、230以上の悪意のあるスキルがClawHubにアップロードされました。<strong>自分で書いていないスキルは、信頼できない依存関係のように扱いましょう。</strong></p>
<p><strong>ハートビートループは、あなたが頼んでもいないことをする。</strong>イントロで出てきたホーモルドの話（代理人が保険の否認を見つけ、判例を調べ、法的な反論を自律的に送る）は、機能のデモではなく、責任リスクなのだ。代理店は人間の承認なしに法的対応にコミットした。その時はうまくいった。いつもそうとは限らない。<strong>支払い、削除、社外とのコミュニケーションに関わるものは全て、人間がゲートを通す必要がある。</strong></p>
<p><strong>APIのコストは、見ていないとすぐにかさむ。</strong>大雑把な数字ですが、1日に数回のハートビートで軽いセットアップの場合、Sonnet 4.5で月18-36ドルです。これをOpusで毎日12回以上チェックすると、月270-540ドルになる。HNのある人は、冗長なAPIコールと冗長なロギングに月70ドルも費やしていることに気づいた。<strong>プロバイダー・レベルで支出アラートを設定する。</strong>ハートビート間隔を誤って設定すると、API予算を一晩で使い果たす可能性がある。</p>
<p>デプロイする前に、これを確認することを強く推奨する：</p>
<ul>
<li><p>普段使っているドライバではなく、専用のVMやコンテナなど、隔離された環境で実行する。</p></li>
<li><p>インストールする前に、すべてのスキルをフォークして監査する。ソースを読む。全部。</p></li>
<li><p>エージェント設定だけでなく、プロバイダーレベルでAPI使用制限を厳しく設定する。</p></li>
<li><p>支払い、削除、メール送信、外部からのものなど、すべての不可逆的なアクションを人間の承認に従うようにする。</p></li>
<li><p>2026.1.29以降にピン止めし、セキュリティパッチを常に適用すること。</p></li>
</ul>
<p>ネットワーク設定を正確に把握していない限り、パブリック・インターネットに公開しない。</p>
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
    </button></h2><p>OpenClawは、2週間足らずでGitHubのスターが175,000を超え、GitHub史上最も急速に成長しているオープンソースリポジトリのひとつとなりました。これはGitHub史上最も急速に成長しているオープンソースのレポの一つである。</p>
<p>技術的な観点から見ると、OpenClawはほとんどのAIエージェントにはない3つの特徴を持っている：完全なオープンソース（MIT）、ローカルファースト（あなたのマシン上のMarkdownファイルとして保存されたメモリ）、自律的にスケジュールされる（プロンプトなしで動作するハートビートデーモン）。Slack、Telegram、WhatsAppのようなメッセージングプラットフォームとすぐに統合でき、シンプルなSKILL.mdシステムを通じてコミュニティが構築したスキルをサポートする。この組み合わせは、常時稼働のアシスタントを構築するのに非常に適している：24時間365日質問に答えてくれるSlackボット、あなたが寝ている間にメールをトリアージしてくれる受信トレイモニター、あるいはベンダーロックインなしで独自のハードウェア上で動作する自動化ワークフローなどだ。</p>
<p>とはいえ、OpenClawを強力にしているアーキテクチャは、不用意に導入すると危険でもある。注意すべき点がいくつかある：</p>
<ul>
<li><p><strong>分離して実行すること。</strong>プライマリ・マシンではなく、専用のデバイスかVMを使うこと。何か問題が発生した場合、物理的に到達できるキルスイッチが必要です。</p></li>
<li><p><strong>インストール前にスキルの監査を行う。</strong>Ciscoが分析したコミュニティ・スキルの26%に、少なくとも1つの脆弱性が含まれていた。信頼できないものはフォークしてレビューする。</p></li>
<li><p><strong>プロバイダー・レベルでAPI使用制限を設定する。</strong>ハートビートを誤って設定すると、一晩で数百ドルを使い果たす可能性がある。デプロイする前にアラートを設定する。</p></li>
<li><p><strong>不可逆的なアクションをゲートする。</strong>支払い、削除、外部とのコミュニケーション：これらは自律的な実行ではなく、人間の承認が必要。</p></li>
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
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">SlackでOpenClawをセットアップするためのステップバイステップガイド</a>- OpenClawを使ってSlackワークスペースにmilvusを搭載したAIサポートボットを構築する。</p></li>
<li><p><a href="https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md">LangChain1.0とMilvus: 長期記憶を持つプロダクション対応AIエージェントの構築</a>- Milvusを使ってエージェントに永続的なセマンティック記憶を与える方法。</p></li>
<li><p><a href="https://milvus.io/blog/stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md">DeepSearcherとエージェントRAG</a>- なぜエージェントRAGは従来の検索を凌駕するのか？</p></li>
<li><p><a href="https://milvus.io/docs/agentic_rag_with_milvus_and_langgraph.md">MilvusとLangGraphによるエージェント型RAG</a>- チュートリアル：検索のタイミングを決定し、ドキュメントの関連性を評価し、クエリを書き換えるエージェントを構築する。</p></li>
<li><p><a href="https://milvus.io/blog/building-a-production-ready-ai-assistant-with-spring-boot-and-milvus.md">SpringBootとMilvusを使ったプロダクション対応のAIアシスタントの構築</a>- 意味検索と会話記憶を備えたエンタープライズAIアシスタントを構築するためのフルスタックガイド</p></li>
</ul>
