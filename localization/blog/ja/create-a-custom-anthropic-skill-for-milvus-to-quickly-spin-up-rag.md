---
id: create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md
title: 人間性スキルがエージェント・ツールを変える - MilvusがRAGを素早くスピンアップさせるカスタムスキルの作り方
author: Min Yin
date: 2026-01-23T00:00:00.000Z
cover: assets.zilliz.com/skills_cover_new_8caa774cc5.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude Code, Anthropic Skills, MCP, RAG, Milvus'
meta_title: |
  Create a Custom Anthropic Skill for Milvus to Quickly Spin Up RAG
desc: >-
  スキルとは何か、そして再利用可能なワークフローを使用して自然言語命令からMilvusに裏打ちされたRAGシステムを構築するClaude
  Codeのカスタムスキルの作成方法を学びます。
origin: >-
  https://milvus.io/blog/create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md
---
<p>ツールの使い方は、エージェントを機能させる大きな要素である。エージェントは適切なツールを選択し、それを呼び出すタイミングを決定し、入力を正しくフォーマットする必要がある。紙の上では簡単なことのように聞こえますが、実際のシステムを構築し始めると、多くのエッジケースや失敗モードが見つかります。</p>
<p>多くのチームは、これを整理するためにMCPスタイルのツール定義を使っているが、MCPには荒削りな部分がある。モデルはすべてのツールを一度に推論しなければならず、その決定を導くための構造はあまりない。その上、すべてのツール定義はコンテキストウィンドウの中に置かなければならない。これらのいくつかは大きく、GitHubのMCPは約26kトークンで、エージェントが実際の作業を始める前にコンテキストを食いつぶしてしまいます。</p>
<p>Anthropicはこの状況を改善するために<a href="https://github.com/anthropics/skills?tab=readme-ov-file"><strong>スキルを</strong></a>導入しました。スキルはより小さく、より集中的で、オンデマンドでロードするのが簡単です。全てをコンテキストにダンプする代わりに、ドメインロジック、ワークフロー、スクリプトをコンパクトなユニットにパッケージ化し、エージェントは必要な時だけ取り込むことができます。</p>
<p>この投稿では、Anthropic Skillsがどのように機能するのかを説明し、Claude Codeで自然言語を<a href="https://milvus.io/">milvusに裏付けされた</a>ナレッジベースに変換するシンプルなSkillを構築する方法を説明します。</p>
<h2 id="What-Are-Anthropic-Skills" class="common-anchor-header">人間性スキルとは？<button data-href="#What-Are-Anthropic-Skills" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://milvus.io/blog/is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md">Anthropicスキル</a>（またはエージェントスキル）は、エージェントが特定のタスクを処理するために必要な命令、スクリプト、リファレンスファイルをバンドルしたフォルダです。小さな自己完結型の能力パックと考えてください。スキルは、レポートの生成、分析の実行、特定のワークフローやルールに従う方法などを定義します。</p>
<p>重要なのは、スキルはモジュール化されており、オンデマンドでロードできるということです。巨大なツール定義をコンテキストウィンドウに詰め込む代わりに、エージェントは必要なスキルのみを取り込みます。これにより、コンテキストの使用量を抑えながら、どのようなツールが存在し、いつそれらを呼び出すか、そして各ステップをどのように実行するかについて、モデルに明確なガイダンスを与えることができる。</p>
<p>フォーマットは意図的にシンプルで、そのため、Claude Code、Cursor、VS Code拡張、GitHub統合、Codexスタイルのセットアップなど、多くの開発者ツールですでにサポートされているか、簡単に適応できます。</p>
<p>スキルは一貫したフォルダ構造に従います：</p>
<pre><code translate="no">skill-name/

├── SKILL.md       <span class="hljs-comment"># Required: Skill instructions and metadata</span>

├── scripts/         <span class="hljs-comment"># Optional: helper scripts</span>

├── templates/       <span class="hljs-comment"># Optional: document templates</span>

└── resources/       <span class="hljs-comment"># Optional: reference materials</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>1.</strong> <code translate="no">SKILL.md</code> <strong>(コアファイル)</strong></p>
<p>これはエージェントの実行ガイドで、タスクの実行方法をエージェントに正確に伝えるドキュメントです。スキルのメタデータ(名前、説明、トリガーキーワードなど)、実行フロー、およびデフォルト設定を定義します。このファイルでは、以下を明確に記述する必要があります：</p>
<ul>
<li><p><strong>スキルの実行タイミング：</strong>たとえば、ユーザー入力に "Python で CSV ファイルを処理する" というようなフレーズが含まれる場合にスキルをトリガーします。</p></li>
<li><p><strong>タスクの実行方法：</strong>ユーザーのリクエストを解釈する →<code translate="no">scripts/</code> ディレクトリから前処理スクリプトを呼び出す → 必要なコードを生成する →<code translate="no">templates/</code> のテンプレートを使用して出力をフォーマットする。</p></li>
<li><p><strong>ルールと制約：</strong>ルールと制約：コーディング規約、出力フォーマット、エラーの処理方法などの詳細を指定する。</p></li>
</ul>
<p><strong>2.</strong> <code translate="no">scripts/</code> <strong>(実行スクリプト)</strong></p>
<p>このディレクトリには、Python、Shell、Node.js などの言語で事前に書き込まれたスクリプトが含まれます。エージェントは、実行時に同じコードを繰り返し生成する代わりに、これらのスクリプトを直接呼び出すことができます。典型的な例は、<code translate="no">create_collection.py</code> と<code translate="no">check_env.py</code> です。</p>
<p><strong>3.</strong> <code translate="no">templates/</code> <strong>(ドキュメントテンプレート)</strong></p>
<p>エージェントがカスタマイズされたコンテンツを生成するために使用できる再利用可能なテンプレートファイル。一般的な例として、レポートテンプレートや設定テンプレートがあります。</p>
<p><strong>4.</strong> <code translate="no">resources/</code> <strong>(参考資料)</strong></p>
<p>API ドキュメント、技術仕様書、ベストプラクティスガイドなど、エージェントが実行中に参照できるドキュメント。</p>
<p>全体として、この構成は、新しいチームメイトに仕事を引き継ぐ方法を反映しています。<code translate="no">SKILL.md</code> は仕事を説明し、<code translate="no">scripts/</code> はすぐに使えるツールを提供し、<code translate="no">templates/</code> は標準フォーマットを定義し、<code translate="no">resources/</code> は背景情報を提供します。これらすべてが揃うことで、エージェントは推測を最小限に抑えながら、確実にタスクを実行することができます。</p>
<h2 id="Hands-on-Tutorial-Creating-a-Custom-Skill-for-a-Milvus-Powered-RAG-System" class="common-anchor-header">ハンズオンチュートリアルmilvusを搭載したRAGシステムのカスタムスキルの作成<button data-href="#Hands-on-Tutorial-Creating-a-Custom-Skill-for-a-Milvus-Powered-RAG-System" class="anchor-icon" translate="no">
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
    </button></h2><p>このセクションでは、Milvusコレクションをセットアップし、自然言語の命令から完全なRAGパイプラインを組み立てることができるカスタムスキルの作成について説明します。スキーマの設計、インデックスの設定、定型的なコードなど、通常のセットアップ作業をすべて省略することが目標です。スキーマ設計、インデックス設定、定型的なコードなど、通常の設定作業をすべて省略することです。</p>
<h3 id="Design-Overview" class="common-anchor-header">設計の概要</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/design_overview_d4c886291b.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Prerequisites" class="common-anchor-header">前提条件</h3><table>
<thead>
<tr><th>コンポーネント</th><th>要件</th></tr>
</thead>
<tbody>
<tr><td>CLI</td><td><code translate="no">claude-code</code></td></tr>
<tr><td>モデル</td><td>GLM 4.7、OpenAI</td></tr>
<tr><td>コンテナ</td><td>ドッカー</td></tr>
<tr><td>Milvus</td><td>2.6.8</td></tr>
<tr><td>モデル構成プラットフォーム</td><td>CC-スイッチ</td></tr>
<tr><td>パッケージ・マネージャー</td><td>npm</td></tr>
<tr><td>開発言語</td><td>Python</td></tr>
</tbody>
</table>
<h3 id="Step-1-Environment-Setup" class="common-anchor-header">ステップ1: 環境のセットアップ</h3><p><strong>インストール</strong> <code translate="no">claude-code</code></p>
<pre><code translate="no">npm install -g <span class="hljs-meta">@anthropic</span>-ai/claude-code
<button class="copy-code-btn"></button></code></pre>
<p><strong>CC-Switchのインストール</strong></p>
<p><strong>注：</strong>CC-Switchは、AIモデルをローカルで実行する際に、異なるモデルAPIを簡単に切り替えることができるモデル切り替えツールです。</p>
<p>プロジェクト・リポジトリ<a href="https://github.com/farion1231/cc-switch">：https://github.com/farion1231/cc-switch</a></p>
<p><strong>Claudeを選択し、APIキーを追加する</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_0cdfab2e54.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_615ee13649.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>現在のステータスを確認する</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_f1c13da1fe.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Milvusのデプロイと起動</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Download docker-compose.yml</span>

wget https://github.com/milvus-io/milvus/releases/download/v2<span class="hljs-number">.6</span><span class="hljs-number">.8</span>/milvus-standalone-docker-compose.yml -O docker-compose.yml

  

<span class="hljs-comment"># Start Milvus (check port mapping: 19530:19530)</span>

docker-compose up -d

  

<span class="hljs-comment"># Verify that the services are running</span>

docker ps | grep milvus

<span class="hljs-comment"># You should see three containers: milvus-standalone, milvus-etcd, milvus-minio</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code1_9c6a1a7f93.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>OpenAI API キーを設定する</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Add this to ~/.bashrc or ~/.zshrc</span>

OPENAI_API_KEY=your_openai_api_key_here
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-the-Custom-Skill-for-Milvus" class="common-anchor-header">ステップ 2: Milvusのカスタムスキルの作成</h3><p><strong>ディレクトリ構造を作成する</strong></p>
<pre><code translate="no"><span class="hljs-built_in">cd</span> ~/.claude/skills/

<span class="hljs-built_in">mkdir</span> -p milvus-skills/example milvus-skills/scripts
<button class="copy-code-btn"></button></code></pre>
<p><strong>初期化</strong> <code translate="no">SKILL.md</code></p>
<p><strong>注意:</strong>SKILL.mdはエージェントの実行ガイドの役割を果たします。SKILL.mdはエージェントの実行ガイドとなり、スキルが何を行い、どのようにトリガーされるかを定義します。</p>
<pre><code translate="no"><span class="hljs-attr">name</span>: milvus-collection-builder

<span class="hljs-attr">description</span>: <span class="hljs-title class_">Create</span> <span class="hljs-title class_">Milvus</span> collections <span class="hljs-keyword">using</span> natural language, supporting both <span class="hljs-variable constant_">RAG</span> and text search scenarios
<button class="copy-code-btn"></button></code></pre>
<p><strong>コアスクリプトの作成</strong></p>
<table>
<thead>
<tr><th>スクリプトの種類</th><th>ファイル名</th><th>目的</th></tr>
</thead>
<tbody>
<tr><td>環境チェック</td><td><code translate="no">check_env.py</code></td><td>Pythonのバージョン、必要な依存関係、milvusの接続をチェックする。</td></tr>
<tr><td>インテント解析</td><td><code translate="no">intent_parser.py</code></td><td>"RAGデータベースを構築する "のようなリクエストを次のような構造化されたインテントに変換する。<code translate="no">scene=rag</code></td></tr>
<tr><td>コレクションの作成</td><td><code translate="no">milvus_builder.py</code></td><td>コレクションスキーマとインデックス構成を生成するコアビルダー</td></tr>
<tr><td>データ取り込み</td><td><code translate="no">insert_milvus_data.py</code></td><td>ドキュメントを読み込み、チャンクし、エンベッディングを生成し、Milvusにデータを書き込む。</td></tr>
<tr><td>例1</td><td><code translate="no">basic_text_search.py</code></td><td>ドキュメント検索システムの作成方法のデモンストレーション</td></tr>
<tr><td>例2</td><td><code translate="no">rag_knowledge_base.py</code></td><td>完全なRAG知識ベースを構築する方法を示す</td></tr>
</tbody>
</table>
<p>これらのスクリプトは、Milvusにフォーカスしたスキルを実用的なもの、つまりドキュメント検索システムとインテリジェントQ&amp;A（RAG）のセットアップに変える方法を示しています。</p>
<h3 id="Step-3-Enable-the-Skill-and-Run-a-Test" class="common-anchor-header">ステップ3: スキルを有効にしてテストを実行する</h3><p><strong>自然言語でリクエストを記述する</strong></p>
<pre><code translate="no"><span class="hljs-string">&quot;I want to build an RAG system.&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test1_64fd549573.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>RAGシステムの作成</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test2_80656d59b1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>サンプルデータの挿入</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test3_392753eb73.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>クエリを実行する</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test4_75e23c6a3a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Conclusion" class="common-anchor-header">まとめ<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>このチュートリアルでは、カスタムスキルを使用してMilvusを利用したRAGシステムを構築しました。その目的は、単にMilvusを呼び出す別の方法を紹介することではなく、通常であれば複数ステップの設定が必要となるものを、Skillを使用することで再利用や反復が可能なものに変えることができることを紹介することでした。手作業でスキーマを定義したり、インデックスを調整したり、ワークフローのコードをつなぎ合わせたりする代わりに、スキルが定型的なことのほとんどを処理してくれるので、RAGの実際に重要な部分に集中することができます。</p>
<p>これは始まりに過ぎません。完全なRAGパイプラインには、前処理、チャンキング、ハイブリッド検索設定、リランキング、評価など、多くの可動部分があります。これら全てを別々のスキルとしてパッケージ化し、ユースケースに応じて構成することができる。ベクターのディメンション、インデックスパラメータ、プロンプトテンプレート、検索ロジックの社内標準がある場合、スキルはその知識をエンコードし、繰り返し使用できるようにするためのクリーンな方法です。</p>
<p>新しい開発者にとっては、Milvusを使いこなすまでの障壁を低くすることができます。経験豊富なチームにとっては、繰り返しのセットアップを削減し、環境間で一貫したプロジェクトを維持するのに役立ちます。スキルは熟考されたシステム設計の代わりにはならないが、不必要な摩擦の多くを取り除くことができる。</p>
<p>👉 完全な実装は<a href="https://github.com/yinmin2020/open-milvus-skills">オープンソースリポジトリで</a>入手可能で、<a href="https://skillsmp.com/">Skillマーケットプレイスでは</a>コミュニティが構築したより多くの例を調べることができます。</p>
<h2 id="Stay-tuned" class="common-anchor-header">ご期待ください！<button data-href="#Stay-tuned" class="anchor-icon" translate="no">
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
    </button></h2><p>また、一般的なRAGパターンやプロダクションのベストプラクティスをカバーするMilvusとZillizの公式クラウドスキルの導入にも取り組んでいます。アイデアやサポートしてほしい特定のワークフローがある場合は、<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack Channelに</a>参加してエンジニアとチャットしてください。また、ご自身のセットアップについてガイダンスが必要な場合は、いつでも<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvusオフィスアワーの</a>セッションをご予約いただけます。</p>
