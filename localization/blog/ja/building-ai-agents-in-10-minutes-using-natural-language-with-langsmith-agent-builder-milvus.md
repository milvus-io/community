---
id: >-
  building-ai-agents-in-10-minutes-using-natural-language-with-langsmith-agent-builder-milvus.md
title: LangSmithエージェントビルダー＋milvusで自然言語を使って10分でAIエージェントを構築する
author: Min Yin
date: 2026-01-22T00:00:00.000Z
desc: LangSmithエージェントビルダーとmilvusを使用して、数分でメモリ対応AIエージェントを構築する方法をご紹介します。
cover: assets.zilliz.com/cover_LS_MVS_ab8af19bfa.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: >-
  LangSmith Agent Builder, Milvus vector database, AI agent memory, no-code AI
  agents, building AI assistants
meta_title: |
  Build AI Agents in 10 Minutes with LangSmith Agent Builder & Milvus
origin: >-
  https://milvus.io/blog/building-ai-agents-in-10-minutes-using-natural-language-with-langsmith-agent-builder-milvus.md
---
<p>AI開発が加速するにつれ、AIアシスタントの構築に必ずしもソフトウェア・エンジニアリングのバックグラウンドが必要でないことを発見するチームが増えている。製品チーム、オペレーション、サポート、研究者など、アシスタントを最も必要としている人々は、多くの場合、エージェントが何をすべきかを正確に知っているが、それをコードで実装する方法は知らない。従来の "コードなし "ツールは、ドラッグ＆ドロップのキャンバスでそのギャップを埋めようとしていましたが、実際のエージェントの動作（マルチステップの推論、ツールの使用、永続メモリなど）が必要になった瞬間に崩れてしまいます。</p>
<p>新しくリリースされた<a href="https://www.langchain.com/langsmith/agent-builder"><strong>LangSmith Agent Builderは</strong></a>異なるアプローチをとります。ワークフローを設計する代わりに、エージェントのゴールと利用可能なツールを平易な言葉で記述します。フローチャートもスクリプトもなく、ただ明確な意図があるだけです。</p>
<p>しかし、意図だけではインテリジェントなアシスタントは生まれない。<strong>記憶が</strong>そうさせるのだ。そこで、広く採用されているオープンソースのベクターデータベースである<a href="https://milvus.io/"><strong>Milvusが</strong></a>基盤となる。Milvusは、文書や会話の履歴を埋め込みとして保存することで、エージェントがコンテキストを呼び出し、関連する情報を取得し、スケールで正確に応答することを可能にします。</p>
<p>このガイドでは、<strong>LangSmith Agent Builder + Milvus を</strong>使用して、コードを一行も書くことなく、本番環境に対応したメモリ対応AIアシスタントを構築する方法を説明します。</p>
<h2 id="What-is-LangSmith-Agent-Builder-and-How-It-Works" class="common-anchor-header">LangSmith Agent Builderとは？<button data-href="#What-is-LangSmith-Agent-Builder-and-How-It-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>その名の通り、<a href="https://www.google.com/search?q=LangSmith+Agent+Builder&amp;oq=what+is+LangSmith+Agent+Builder&amp;gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQABiABDIHCAIQABiABDIHCAMQABiABDIHCAQQABiABDIHCAUQABiABDIHCAYQABiABDIHCAcQABiABDIGCAgQABgDMggICRAAGBYYHtIBCTI1OTJqMGoxNagCCLACAfEF2Mylr_IuXLk&amp;sourceid=chrome&amp;ie=UTF-8&amp;ved=2ahUKEwjV1LfvxZ6SAxVFsFYBHYzTJAsQgK4QegQIARAB">LangSmith Agent Builderは</a>LangChainが提供するコード不要のツールで、平易な言語を使ってAIエージェントを構築、デプロイ、管理することができます。ロジックを書いたり、ビジュアルフローをデザインする代わりに、エージェントが何をすべきか、どんなツールを使えるか、どのように振る舞うべきかを説明します。プロンプトの生成、ツールの選択、コンポーネントの配線、メモリの有効化など、難しい部分はシステムが処理します。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_57c5cee35b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>従来のノーコードツールやワークフローツールとは異なり、Agent Builderにはドラッグアンドドロップキャンバスもノードライブラリもありません。ChatGPT と同じように操作します。作りたいものを説明し、いくつかの明確な質問に答えると、ビルダーはあなたの意図に基づいて完全に機能するエージェントを作成します。</p>
<p>舞台裏では、エージェントは4つのコアビルディングブロックから構築されます。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_05b90b1f3d.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ul>
<li><strong>プロンプト：</strong>プロンプトはエージェントの頭脳であり、目標、制約、意思決定ロジックを定義します。LangSmithエージェントビルダは、メタプロンプトを使用してこれを自動的に構築します。あなたが欲しいものを説明すると、明確な質問をし、あなたの答えが詳細で本番に対応したシステムプロンプトに合成されます。ロジックを手書きする代わりに、単に意図を表現するだけです。</li>
<li><strong>ツール：</strong>メール送信、Slackへの投稿、カレンダーイベントの作成、データ検索、APIの呼び出しなどです。エージェントビルダは、機能を公開する安全で拡張可能な方法を提供するモデルコンテキストプロトコル（MCP）を介して、これらのツールを統合します。ユーザは、ビルトイン統合を利用することも、ベクター検索や長期記憶用の<a href="https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md">Milvus MCPサーバを</a>含むカスタムMCPサーバを追加することもできます。</li>
<li><strong>トリガー：</strong>トリガーは、エージェントの実行タイミングを定義します。手動で実行するだけでなく、エージェントをスケジュールや外部イベントにアタッチして、メッセージ、メール、Webhookアクティビティに自動的に応答させることもできます。トリガが実行されると、Agent Builderは新しい実行スレッドを開始し、エージェントのロジックを実行します。</li>
<li><strong>サブエージェント</strong>サブエージェントは、複雑なタスクをより小さく、特化した単位に分割します。プライマリエージェントは、サブエージェント（それぞれが独自のプロンプトとツールセットを持つ）に作業を委任することができ、データ検索、要約、フォーマットのようなタスクは、専用のヘルパーによって処理されます。これにより、1つのプロンプトが過負荷になることを避け、よりモジュール化されたスケーラブルなエージェントアーキテクチャを構築することができます。</li>
</ul>
<h2 id="How-Does-an-Agent-Remember-Your-Preferences" class="common-anchor-header">エージェントはどのようにお客様の設定を記憶しますか？<button data-href="#How-Does-an-Agent-Remember-Your-Preferences" class="anchor-icon" translate="no">
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
    </button></h2><p>エージェントビルダーのユニークな点は、<em>メモリの</em>扱い方です。プリファレンスをチャット履歴に詰め込む代わりに、エージェントは実行中に自身の動作ルールを更新することができます。今後、すべてのSlackメッセージの最後をポエムで終わるように」と言った場合、エージェントはそれを1回限りのリクエストとして扱わず、今後の実行に適用される永続的なプリファレンスとして保存します。</p>
<p>その下で、エージェントは内部メモリ・ファイル（基本的には進化したシステム・プロンプト）を保持する。起動するたびにこのファイルを読み込んで、どのように振る舞うかを決定する。あなたが修正や制約を与えると、エージェントはファイルを編集し、"ブリーフィングの最後には必ず気分を高揚させる短い詩を歌う "というような構造化されたルールを追加する。このアプローチは、会話履歴に頼るよりもはるかに安定している。なぜならエージェントは、あなたの好みをトランスクリプトの中に埋めてしまうのではなく、能動的に操作指示を書き換えるからだ。</p>
<p>この設計はDeepAgentsのFilesystemMiddlewareに由来していますが、Agent Builderでは完全に抽象化されています。あなたが直接ファイルに触れることはありません。あなたが自然言語で更新を表現すると、システムが舞台裏で編集を処理します。さらに制御が必要な場合は、カスタムMCPサーバをプラグインするか、DeepAgentsレイヤにドロップして、高度なメモリのカスタマイズを行うことができます。</p>
<h2 id="Hands-on-Demo-Building-a-Milvus-Assistant-in-10-Minutes-using-Agent-Builder" class="common-anchor-header">ハンズオン・デモエージェントビルダを使用して10分でMilvusアシスタントを構築する<button data-href="#Hands-on-Demo-Building-a-Milvus-Assistant-in-10-Minutes-using-Agent-Builder" class="anchor-icon" translate="no">
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
    </button></h2><p>Agent Builderの背後にある設計思想について説明したところで、ハンズオンの例でビルドプロセスの全容を説明しましょう。我々の目標は、Milvus関連の技術的な質問に答えたり、公式ドキュメントを検索したり、ユーザの好みを長期的に記憶したりできるインテリジェントなアシスタントを作成することです。</p>
<h3 id="Step-1-Sign-In-to-the-LangChain-Website" class="common-anchor-header">ステップ1.LangChainウェブサイトにサインイン</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_1_b3c461d39b.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Set-Up-Your-Anthropic-API-Key" class="common-anchor-header">ステップ2.Anthropic APIキーのセットアップ</h3><p><strong>注：</strong>Anthropicはデフォルトでサポートされています。また、LangChainが公式にサポートするリストにその型が含まれている限り、カスタムモデルを使用することもできます。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_2_c04400695e.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>1.APIキーを追加</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_3_11db4b3824.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>2.APIキーを入力し、保存する。</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_4_abfc27d796.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Create-a-New-Agent" class="common-anchor-header">ステップ 3.新しいエージェントを作成する</h3><p><strong>注意:</strong>使い方ドキュメントを表示するには、<strong>[詳細]</strong>をクリックします。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_5_e90bf254f2.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_6_7c839d96f3.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol>
<li><strong>カスタムモデルの設定（オプション）</strong></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_7_0dfd5ff561.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(1) パラメータを入力し、保存する</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_8_85f9e3008f.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_9_0d5d0c062c.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Describe-Your-Requirements-to-Create-the-Agent" class="common-anchor-header">ステップ 4.エージェントを作成するための要件を記述する</h3><p><strong>注：</strong>自然言語を使用してエージェントを作成します。</p>
<pre><code translate="no">
I need a Milvus technical consultant to <span class="hljs-built_in">help</span> me answer technical questions about vector databases. 

Search the official documentation <span class="hljs-keyword">and</span> remember my preference <span class="hljs-keyword">for</span> the index <span class="hljs-built_in">type</span> I use. 

<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_10_0e033a5200.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol>
<li><strong>システムは要件を絞り込むためにフォローアップの質問をします。</strong></li>
</ol>
<p>質問1: エージェントに記憶させたいMilvusインデックスタイプを選択します。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_11_050ac891f0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>質問2: エージェントが技術的な質問を処理する方法を選択します。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_12_d1d6d4f2ed.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>質問3: エージェントが特定のMilvusバージョンのガイダンスに焦点を当てるかどうかを指定します。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_13_5d60df75e9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-5-Review-and-Confirm-the-Generated-Agent" class="common-anchor-header">ステップ 5.生成されたエージェントの確認</h3><p><strong>注意:</strong>システムは自動的にエージェント設定を生成します。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_14_8a596ae853.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>エージェントを作成する前に、メタデータ、ツール、プロンプトを確認することができます。すべてが正しく表示されたら、[<strong>作成]</strong>をクリックして次に進みます。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_15_5c0b27aca7.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_16_998921b071.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Explore-the-Interface-and-Feature-Areas" class="common-anchor-header">ステップ 6.インタフェースと機能エリアの探索</h3><p>エージェントが作成されると、インターフェースの左下に3つの機能エリアが表示されます：</p>
<p><strong>(1) トリガー</strong></p>
<p>(1)トリガー トリガーは、外部イベントまたはスケジュールに応じてエージェントを実行するタイミングを定義します：</p>
<ul>
<li><strong>Slack：</strong>Slack: 特定のチャンネルにメッセージが届いたときにエージェントを起動する。</li>
<li><strong>Gmail：</strong>新しいメールを受信したときにエージェントを起動する</li>
<li><strong>Cron：</strong>スケジュールされた間隔でエージェントを実行</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_17_b77c603413.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(2) ツールボックス</strong></p>
<p>これは、エージェントが呼び出すことができるツールのセットです。図の例では、3つのツールが作成時に自動的に生成されます。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_18_94637d4548.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>もしエージェントがベクター検索機能を必要とする場合（例えば、大量の技術文書のセマンティック検索など）、MilvusのMCPサーバを導入</strong>し、<strong>MCP</strong>ボタンを使用してここに追加することができます。MCPサーバが<strong>到達可能なネットワークエンドポイントで</strong>動作していることを確認してください。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_19_94fe99a3b8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_20_f887a8fbda.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(3) サブエージェント</strong></p>
<p>特定のサブタスクに特化した独立したエージェントモジュールを作成し、モジュール化されたシステム設計を可能にします。</p>
<h3 id="Step-7-Test-the-Agent" class="common-anchor-header">ステップ 7.エージェントのテスト</h3><p>右上の[<strong>テスト]</strong>をクリックして、テストモードに入ります。以下は、テスト結果のサンプルです。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_22_527619519b.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_23_639d40c40d.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_24_42a71d2592.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/640_25_8ab35e15f8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Agent-Builder-vs-DeepAgents-Which-One-Should-You-Choose" class="common-anchor-header">エージェントビルダとDeepAgentsの比較：どちらを選ぶべきか？<button data-href="#Agent-Builder-vs-DeepAgents-Which-One-Should-You-Choose" class="anchor-icon" translate="no">
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
    </button></h2><p>LangChainは、複数のエージェントフレームワークを提供しています。<a href="https://www.google.com/search?q=DeepAgents&amp;newwindow=1&amp;sca_esv=0e7ec9ce2aa7d5b4&amp;sxsrf=ANbL-n5pe1KqjmJVjQCqmc3jneYhmGGOUg%3A1769066335766&amp;ei=X89xab21Lp3a1e8Ppam06Ag&amp;ved=2ahUKEwio15nYzZ6SAxU_mq8BHcf3BqUQgK4QegQIARAB&amp;uact=5&amp;oq=what+is+DeepAgents&amp;gs_lp=Egxnd3Mtd2l6LXNlcnAiEndoYXQgaXMgRGVlcEFnZW50czIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzIKEAAYsAMY1gQYRzINEAAYgAQYsAMYQxiKBTINEAAYgAQYsAMYQxiKBUi8BlAYWL8FcAF4AZABAJgBqgKgAbAKqgEFMC4yLjS4AQPIAQD4AQGYAgGgAgyYAwCIBgGQBgqSBwExoAehHrIHALgHAMIHAzMtMcgHCYAIAA&amp;sclient=gws-wiz-serp">DeepAgentsは</a>エージェント構築ツールです。複雑なマルチステップタスクを処理する、自律的で長時間動作するAIエージェントを構築するために使用されます。LangGraph上に構築されており、高度なプランニング、ファイルベースのコンテキスト管理、サブエージェントのオーケストレーションをサポートしているため、長期的な見通しのプロジェクトやプロダクショングレードのプロジェクトに最適です。</p>
<p>では、<strong>Agent Builderと</strong>比較してどうなのでしょうか？</p>
<p><strong>Agent Builder は</strong>、シンプルさとスピードに重点を置いています。ほとんどの実装の詳細を抽象化し、自然言語でエージェントを記述し、ツールを設定し、すぐに実行することができます。メモリ、ツールの使用、および人間によるワークフローは、あなたに代わって処理されます。このため、Agent Builderは、ラピッドプロトタイピング、内部ツール、初期段階の検証など、きめ細かい制御よりも使いやすさを重視する場合に最適です。</p>
<p>対照的に、<strong>DeepAgents</strong> は、メモリ、実行、およびインフラストラクチャを完全に制御する必要があるシナリオ向けに設計されています。ミドルウェアをカスタマイズし、任意のPythonツールを統合し、ストレージバックエンドを変更し（<a href="https://milvus.io/blog">Milvusで</a>メモリを永続化することを含む）、エージェントのステートグラフを明示的に管理することができます。トレードオフはエンジニアリングの労力であり、コードを書き、依存関係を管理し、障害モードを自分で処理しなければなりませんが、完全にカスタマイズ可能なエージェントスタックを得ることができます。</p>
<p>重要なことは、<strong>Agent BuilderとDeepAgentsは別々のエコシステムではなく、一つの連続体を形成して</strong>いるということです。Agent Builderは、DeepAgentsの上に構築されています。つまり、Agent Builderで簡単なプロトタイプから始めて、より柔軟性が必要なときにDeepAgentsにドロップすることができます。その逆も可能です。DeepAgentsで構築したパターンは、Agent Builderのテンプレートとしてパッケージ化できるため、技術者でないユーザでも再利用できます。</p>
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
    </button></h2><p>AIの発展により、AIエージェントの構築は複雑なワークフローや重厚なエンジニアリングを必要としなくなりました。LangSmithエージェントビルダを使えば、自然言語だけでステートフルで長時間動作するアシスタントを作成できます。あなたはエージェントが何をすべきかを記述することに集中し、システムは計画、ツールの実行、継続的なメモリの更新を処理します。</p>
<p><a href="https://milvus.io/blog">Milvusと</a>組み合わせることで、これらのエージェントは、セマンティック検索、嗜好追跡、セッションをまたいだ長期的なコンテキストのための信頼性の高い持続的なメモリを得ることができます。LangSmithエージェントビルダとMilvusは、アイデアの検証であれ、スケーラブルなシステムの展開であれ、単に応答するだけでなく、時間とともに記憶し、改善するエージェントのためのシンプルで柔軟な基盤を提供します。</p>
<p>ご不明な点がある場合や、より深いウォークスルーをご希望ですか？LangSmithの<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slackチャンネルに</a>参加するか、<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvusオフィスアワー（</a>20分）をご予約ください。</p>
