---
id: >-
  stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md
title: SlackでOpenClaw（旧Clawdbot/Moltbot）をセットアップするためのステップバイステップガイド
author: 'Min Yin, Lumina Wang'
date: 2026-02-04T00:00:00.000Z
cover: assets.zilliz.com/Open_Claw_Slack_Setup_Guide_Cover_1_11zon_3a995858a8.png
tag: Tutorial
recommend: true
publishToMedium: true
tags: 'OpenClaw, Clawdbot, Moltbot, Slack, Tutorial'
meta_keywords: 'OpenClaw, Clawdbot, Moltbot, Milvus, AI Agent'
meta_title: |
  OpenClaw Tutorial: Connect to Slack for Local AI Assistant
desc: >-
  SlackでOpenClawをセットアップするためのステップバイステップガイド。クラウド不要のセルフホスト型AIアシスタントをMacやLinuxマシンで実行。
origin: 'https://milvus.io/blog/openclaw-slack-setup-guide.md'
---
<p>今週、テック系Twitter、Hacker News、Discordを利用している人なら、目にしたことがあるだろう。ロブスターの絵文字🦞、タスク完了のスクリーンショット、そして大胆な主張。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_1_567975a33f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>週末、さらに奇妙なことが起こった。起業家のマット・シュリヒトは、AIエージェントだけが投稿でき、人間は見ることしかできないRedditスタイルのソーシャルネットワーク<a href="https://moltbook.com">、Moltbookを</a>立ち上げた。数日のうちに、150万人以上のエージェントが登録した。彼らはコミュニティを形成し、哲学を議論し、人間のオペレーターに文句を言い、さらには "Crustafarianism "と呼ばれる独自の宗教を設立した。そう、本当に。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_2_b570b3e59b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>OpenClawブームへようこそ。</p>
<p>クラウドフレアの株価が14％も急上昇したのは、開発者が同社のインフラを使ってアプリケーションを走らせているからだ。Mac Miniの売上は、新しいAI従業員のために専用のハードウェアを購入する人々によって急増したと伝えられている。GitHubのレポは？わずか数週間で<a href="https://github.com/openclaw/openclaw">15万スターを</a>超えた。</p>
<p>というわけで、OpenClawインスタンスをセットアップし、Slackに接続して、お気に入りのメッセージングアプリからAIアシスタントを使いこなす方法を紹介しなければならない。</p>
<h2 id="What-Is-OpenClaw" class="common-anchor-header">OpenClawとは？<button data-href="#What-Is-OpenClaw" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://openclaw.ai/">OpenClaw</a>（以前はClawdbot/Moltbotとして知られていた）はオープンソースの自律型AIエージェントで、ユーザーのマシン上でローカルに動作し、WhatsApp、Telegram、Discordなどのメッセージングアプリを介して実世界のタスクを実行する。ClaudeやChatGPTのようなLLMに接続することで、電子メールの管理、ウェブの閲覧、ミーティングのスケジュールといったデジタルワークフローを自動化する。</p>
<p>要するに、考え、反応し、実際に何かを成し遂げることができる24時間365日のデジタル・アシスタントを持つようなものだ。</p>
<h2 id="Setting-Up-OpenClaw-as-a-Slack-Based-AI-Assistant" class="common-anchor-header">OpenClawをSlackベースのAIアシスタントとして設定する<button data-href="#Setting-Up-OpenClaw-as-a-Slack-Based-AI-Assistant" class="anchor-icon" translate="no">
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
    </button></h2><p>Slackのワークスペースにボットがいて、製品に関する質問に即座に答えたり、ユーザーの問題をデバッグしたり、チームメイトに適切なドキュメントを教えたりできることを想像してみてください。よくある質問（「コレクションを作成するにはどうすればよいですか」）に答えたり、エラーのトラブルシューティングを支援したり、リリースノートをオンデマンドで要約したりするボットです。あなたのチームにとっては、新しいエンジニアのオンボーディング、社内FAQの処理、または反復的なDevOpsタスクの自動化かもしれません。ユースケースは多岐にわたります。</p>
<p>このチュートリアルでは、OpenClaw をあなたのマシンにインストールし、Slack に接続するという基本的なことを説明します。これが終われば、必要なものは何でもカスタマイズできるAIアシスタントの完成です。</p>
<h3 id="Prerequisites" class="common-anchor-header">前提条件</h3><ul>
<li><p>MacまたはLinuxマシン</p></li>
<li><p><a href="https://console.anthropic.com/">Anthropic APIキー</a>（またはClaude Code CLIアクセス権）</p></li>
<li><p>アプリをインストールできるSlackワークスペース</p></li>
</ul>
<p>以上です。さっそく始めましょう。</p>
<h3 id="Step-1-Install-OpenClaw" class="common-anchor-header">ステップ 1: OpenClaw のインストール</h3><p>インストーラーを実行する：</p>
<p>curl -fsSL https://molt.bot/install.sh | bash  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_3_fc80684811.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>プロンプトが表示されたら、<strong>Yes を</strong>選択して続行する。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_4_8004e87516.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>次に、<strong>QuickStart</strong>モードを選択します。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_5_b5803c1d89.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Choose-Your-LLM" class="common-anchor-header">ステップ2：LLMの選択</h3><p>インストーラーがモデルプロバイダーを選択するように尋ねます。ここではAnthropicとClaude Code CLIを認証に使用します。</p>
<ol>
<li>プロバイダーとして<strong>Anthropicを</strong>選択します。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_6_a593124f6c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="2">
<li>プロンプトが表示されたら、ブラウザで認証を完了します。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_7_410c1a39d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="3">
<li>デフォルトモデルとして<strong>Anthropic/claude-opus-4-5-20251101</strong>を選択します。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_8_0c22bf5a16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<h3 id="Step-3-Set-Up-Slack" class="common-anchor-header">ステップ3：Slackをセットアップする</h3><p>チャンネルの選択を求められたら、<strong>Slackを</strong>選択する<strong>。</strong><span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_9_cd4dfa5053.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>ボットに名前を付けます。私たちは "Clawdbot_Milvus "と名付けた。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_10_89c79ccd0d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>次に、Slackアプリを作成し、2つのトークンを取得する必要があります。方法は以下の通り：  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_11_50df3aec5d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.1 Slackアプリを作成する</strong></p>
<p><a href="https://api.slack.com/apps?new_app=1">Slack APIウェブサイトに</a>アクセスし、ゼロから新しいアプリを作成する。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_12_21987505d5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>名前をつけ、使用するワークスペースを選択する。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_13_7fce24b5c7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.2 ボットの権限を設定する</strong></p>
<p>サイドバーで、<strong>OAuth &amp; Permissionsを</strong>クリックします。<strong>Bot Token Scopesまで</strong>スクロールダウンし、ボットに必要なパーミッションを追加します。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_14_b08d66b55a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.3 ソケットモードを有効にする</strong></p>
<p>サイドバーの<strong>「Socket Mode</strong>」をクリックし、オンに切り替えます。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_15_11545f95f8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>App-Level Token</strong>（<code translate="no">xapp-</code> で始まる）が生成されます。これを安全な場所にコピーしてください。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_16_c446eefd7d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.4 イベント・サブスクリプションを有効にする</strong></p>
<p><strong>Event Subscriptionsに</strong>移動し、オンに切り替えます。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_17_98387d6226.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>次に、ボットが購読するイベントを選択します。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_18_b2a16d7786.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>3.5 アプリのインストール</strong></p>
<p>サイドバーの<strong>「Install App」を</strong>クリックし、<strong>「Request to Install」を</strong>クリックします（ワークスペースの管理者であれば、直接インストールすることもできます）。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_19_a5e76d0d33.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>承認されると、<strong>Bot User OAuth Token</strong>（<code translate="no">xoxb-</code> で始まる）が表示されます。これもコピーしてください。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_20_a4a6878dbf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configure-OpenClaw" class="common-anchor-header">ステップ 4: OpenClaw を設定する</h3><p>OpenClaw CLI に戻ります：</p>
<ol>
<li><p><strong>Bot User OAuth Token</strong>(<code translate="no">xoxb-...</code>) を入力します。</p></li>
<li><p><strong>アプリレベルのトークンを</strong>入力する (<code translate="no">xapp-...</code>) <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_21_bd1629fb6a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p></li>
</ol>
<ol start="3">
<li>ボットがアクセスできる Slack チャンネルを選択します。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_22_a1b682fa84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="4">
<li>スキルの設定はスキップしてください。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_23_cc4855ecfd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="5">
<li><strong>再起動を</strong>選択して変更を適用します。</li>
</ol>
<h3 id="Step-5-Try-It-Out" class="common-anchor-header">ステップ5：試してみる</h3><p>Slack にアクセスして、ボットにメッセージを送ってみましょう。すべてが正しく設定されていれば、OpenClaw が応答し、あなたのマシンでタスクを実行できるようになります。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_24_2864a88ce9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Tips" class="common-anchor-header">ヒント</h3><ol>
<li><code translate="no">clawdbot dashboard</code> を実行して、ウェブインターフェイスで設定を管理する。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_25_67b337b1d9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<ol start="2">
<li>何か問題が発生したら、エラーの詳細をログで確認してください。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ST_26_a62b5669ee.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</li>
</ol>
<h2 id="A-Word-of-Caution" class="common-anchor-header">注意事項<button data-href="#A-Word-of-Caution" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenClawは強力であり、だからこそ注意しなければならない。「実際に実行する」ということは、あなたのマシン上で実際にコマンドを実行できるということです。しかしそれにはリスクが伴う。</p>
<p><strong>良いニュースもある：</strong></p>
<ul>
<li><p>オープンソースなので、コードは監査可能。</p></li>
<li><p>ローカルで実行されるため、あなたのデータは他人のサーバー上にない。</p></li>
<li><p>権限をコントロールできる</p></li>
</ul>
<p><strong>良くないニュース</strong></p>
<ul>
<li><p>プロンプト・インジェクションは本当に危険で、悪意のあるメッセージはボットを騙して意図しないコマンドを実行させる可能性がある。</p></li>
<li><p>詐欺師はすでに偽のOpenClawリポジトリとトークンを作成しているので、ダウンロードするものには注意してください。</p></li>
</ul>
<p><strong>私たちのアドバイス</strong></p>
<ul>
<li><p>プライマリマシンでは実行しないでください。VM、予備のラップトップ、または専用サーバーを使いましょう。</p></li>
<li><p>必要以上の権限を与えないでください。</p></li>
<li><p>まだ本番では使わないでください。これは新しい。実験のように扱ってください。</p></li>
<li><p>公式ソースに従うこと：Xの<a href="https://x.com/openclaw">@openclawと</a> <a href="https://github.com/openclaw">OpenClaw</a>。</p></li>
</ul>
<p>いったん LLM にコマンドを実行する能力を与えてしまったら、100% 安全ということはありえない。それはOpenClawの問題ではなく、エージェントAIの性質だ。ただ、賢くやればいいのです。</p>
<h2 id="Whats-Next" class="common-anchor-header">次は？<button data-href="#Whats-Next" class="anchor-icon" translate="no">
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
    </button></h2><p>おめでとうございます！これで、Slackからアクセス可能な、独自のインフラ上で動作するローカルAIアシスタントを手に入れたことになります。あなたのデータはあなたのものであり、繰り返し作業を自動化するための疲れ知らずのヘルパーを手に入れたのです。</p>
<p>ここから次のことができる：</p>
<ul>
<li><p>OpenClawにできることを増やすために、さらに<a href="https://docs.molt.bot/skills">スキルを</a>インストールする<a href="https://docs.molt.bot/skills">。</a></p></li>
<li><p>スケジュールされたタスクを設定し、プロアクティブに機能させる。</p></li>
<li><p>TelegramやDiscordのような他のメッセージングプラットフォームとの接続</p></li>
<li><p><a href="https://milvus.io/">Milvus</a>エコシステムのAI検索機能の探索</p></li>
</ul>
<p><strong>ご質問がある場合、または構築しているものを共有したい場合は、Milvus Slackコミュニティにご参加ください。</strong></p>
<ul>
<li><p><a href="https://milvus.io/slack">MilvusのSlackコミュニティに</a>参加して他の開発者とつながりましょう。</p></li>
<li><p><a href="https://milvus.io/office-hours">Milvusオフィスアワーを</a>予約して、チームとのライブQ&amp;Aをお楽しみください。</p></li>
</ul>
<p>ハッピーハッキング🦞</p>
