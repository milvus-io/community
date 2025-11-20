---
id: >-
  is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md
title: MCPはすでに時代遅れ？Anthropicがスキルを出荷した本当の理由とmilvusとの組み合わせ方
author: Min Yin
date: 2025-11-19T00:00:00.000Z
cover: assets.zilliz.com/skill_mcp_cover_0b12d0d95d.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Claude, Skills, MCP, Milvus, AI workflow'
meta_title: 'Exploring Skills, MCP, and Milvus for Smarter AI Workflows'
desc: トークンの消費を削減するSkillsの仕組みや、AIワークフローを強化するMilvusとSkillsおよびMCPの連携についてご紹介します。
origin: >-
  https://milvus.io/blog/is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md
---
<p>ここ数週間、XとHacker Newsで驚くほど白熱した議論が勃発している：<em>MCPサーバーはもう必要ないのか？</em>一部の開発者は、MCPは過剰に設計され、トークンを大量に消費し、エージェントがツールを使用する方法とは根本的にずれていると主張している。また、言語モデルに実世界の機能を公開する信頼できる方法として、MCPを擁護する人もいます。どのスレッドを読むかによって、MCPはツール使用の未来であるか、あるいは到着する前に死んでしまうかのどちらかである。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/hackernews_c3236cca2c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>その不満は理解できる。MCPは外部システムへの強固なアクセスを提供するが、長いスキーマ、冗長な記述、膨大なツールリストの読み込みをモデルに強いる。これにはコストがかかる。会議の記録をダウンロードし、それを後で別のツールに入力する場合、モデルは同じテキストを何度も再処理する可能性があり、トークンの使用量が増えるだけで、明らかなメリットはありません。規模が大きいチームにとって、これは不便なことではなく、請求書なのだ。</p>
<p>しかし、MCPの時代遅れ宣言は時期尚早だ。MCPを発明したAnthropicは、ひっそりと新しいものを導入した。スキルは軽量なMarkdown/YAML定義で、<em>いつ</em> <em>どのように</em>ツールを使うべきかを記述する。完全なスキーマをコンテキストウィンドウにダンプする代わりに、このモデルはまずコンパクトなメタデータを読み込み、それを使って計画を立てる。実際には、Skillsはトークンのオーバーヘッドを劇的に削減し、開発者がツールのオーケストレーションをよりコントロールできるようにする。</p>
<p>では、SkillsがMCPに取って代わるということだろうか？そうとも言えない。Skillsはプランニングを効率化するが、MCPは実際の機能を提供する。ファイルの読み込み、APIの呼び出し、ストレージシステムとのやりとり、あるいは<a href="https://milvus.io/"><strong>Milvusの</strong></a>ような外部インフラへの接続などだ。<a href="https://milvus.io/"><strong>Milvusは</strong></a>オープンソースのベクターデータベースで、大規模で高速なセマンティック検索を支えており、Skillsが実際のデータアクセスを必要とする場合には重要なバックエンドとなる。</p>
<p>この投稿では、スキルが得意とすること、MCPが依然として重要であること、Anthropicの進化するエージェントアーキテクチャに両者がどのように適合するかを説明します。そして、Milvusとうまく統合した独自のスキルを構築する方法を説明します。</p>
<h2 id="What-Are-Anthropic-Agent-Skills-and-How-Do-They-Work" class="common-anchor-header">Anthropicエージェントスキルとは？<button data-href="#What-Are-Anthropic-Agent-Skills-and-How-Do-They-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>従来のAIエージェントの長年の悩みの種は、会話が大きくなるにつれて指示が消えてしまうことでした。</p>
<p>最も注意深く作られたシステムプロンプトであっても、モデルの行動は会話の過程で徐々に変化します。何度か会話を繰り返すうちに、クロードは元の指示を忘れたり、集中力を失ったりし始める。</p>
<p>問題は、システムプロンプトの構造にある。プロンプトは1回限りの静的なインジェクションで、会話履歴、ドキュメント、その他のインプットと並んで、モデルのコンテキストウィンドウのスペースを奪い合う。コンテキストウィンドウがいっぱいになるにつれて、システムプロンプトに対するモデルの注意はますます希薄になり、時間の経過とともに一貫性が失われていきます。</p>
<p>スキルは、この問題に対処するために設計されました。スキルは、命令、スクリプト、およびリソースを含むフォルダです。静的なシステムプロンプトに依存するのではなく、スキルは専門知識をモジュール化し、再利用可能で永続的な命令バンドルに分解し、クロードがタスクに必要なときに発見し、動的にロードできるようにする。</p>
<p>Claudeはタスクを開始すると、まずYAMLメタデータ（わずか数十個のトークン）だけを読み込んで、利用可能なすべてのスキルの軽量スキャンを実行する。このメタデータは、Claude がスキルが現在のタスクに関連するかどうかを判断するのに十分な情報を提供します。もしそうなら、Claude は命令の完全なセット (通常は 5k トークン以下) に展開し、必要な場合にのみ追加のリソースやスクリプトがロードされます。</p>
<p>この漸進的な開示により、Claudeはわずか30～50トークンでスキルを初期化することができ、効率を大幅に改善し、不必要なコンテキストのオーバーヘッドを削減します。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/how_skills_works_a8563f346c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="How-Skills-Compares-to-Prompts-Projects-MCP-and-Subagents" class="common-anchor-header">スキルとプロンプト、プロジェクト、MCP、サブエージェントとの比較<button data-href="#How-Skills-Compares-to-Prompts-Projects-MCP-and-Subagents" class="anchor-icon" translate="no">
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
    </button></h2><p>今日のモデルツールランドスケープは混雑しているように感じられるかもしれません。クロードのエージェントエコシステムだけでも、いくつかの異なるコンポーネントがあります：スキル、プロンプト、プロジェクト、サブエージェント、そしてMCPです。</p>
<p>スキルがどのようなもので、モジュラー命令バンドルとダイナミックローディングを通じてどのように機能するかを理解したところで、スキルがクロードエコシステムの他の部分、特にMCPとどのように関係するかを知る必要があります。以下はその要約である：</p>
<h3 id="1-Skills" class="common-anchor-header">1.スキル</h3><p>スキルは命令、スクリプト、リソースを含むフォルダです。Claudeはそれらを発見し、プログレッシブな情報開示を使って動的にロードします：最初にメタデータ、次に完全な命令、最後に必要なファイル。</p>
<p><strong>最適な用途</strong></p>
<ul>
<li><p>組織のワークフロー（ブランドガイドライン、コンプライアンス手順）</p></li>
<li><p>専門分野（Excel数式、データ分析）</p></li>
<li><p>個人的な好み（メモの取り方、コーディングパターン）</p></li>
<li><p>会話全体で再利用する必要がある専門的なタスク（OWASPベースのコードセキュリティレビュー）</p></li>
</ul>
<h3 id="2-Prompts" class="common-anchor-header">2.プロンプト</h3><p>プロンプトは、会話の中でクロードに与える自然言語の指示です。プロンプトは一時的なもので、現在の会話にのみ存在します。</p>
<p><strong>最適な用途</strong></p>
<ul>
<li><p>単発のリクエスト（記事を要約する、リストをフォーマットする）</p></li>
<li><p>会話の洗練（トーンの調整、詳細の追加）</p></li>
<li><p>即時の文脈（特定のデータの分析、内容の解釈）</p></li>
<li><p>アドホックな指示</p></li>
</ul>
<h3 id="3-Projects" class="common-anchor-header">3.プロジェクト</h3><p>プロジェクトは、独自のチャット履歴とナレッジベースを持つ自己完結型のワークスペースです。各プロジェクトは 200K コンテキストウィンドウを提供します。プロジェクトの知識がコンテキストの限界に近づくと、クロードはシームレスに RAG モードに移行し、有効容量を最大 10 倍まで拡張できます。</p>
<p><strong>最適な用途</strong></p>
<ul>
<li><p>永続的なコンテキスト（製品発表に関連するすべての会話など）</p></li>
<li><p>ワークスペースの整理（異なるイニシアティブごとにコンテキストを分ける）</p></li>
<li><p>チームコラボレーション（チームプランとエンタープライズプラン）</p></li>
<li><p>カスタム指示（プロジェクト特有のトーンや視点）</p></li>
</ul>
<h3 id="4-Subagents" class="common-anchor-header">4.サブエージェント</h3><p>サブエージェントは、独自のコンテキストウィンドウ、カスタムシステムプロンプト、特定のツールパーミッションを持つ特別なAIアシスタントです。サブエージェントは独立して作業し、結果をメインエージェントに返すことができます。</p>
<p><strong>最適な用途</strong></p>
<ul>
<li><p>タスクの特化（コードレビュー、テスト生成、セキュリティ監査）</p></li>
<li><p>コンテキスト管理（メインの会話に集中させる）</p></li>
<li><p>並列処理（複数のサブエージェントが異なる局面で同時に作業する）</p></li>
<li><p>ツールの制限（例えば、読み取り専用アクセス）</p></li>
</ul>
<h3 id="5-MCP-Model-Context-Protocol" class="common-anchor-header">5.MCP（モデルコンテキストプロトコル）</h3><p>モデルコンテキストプロトコル（MCP）は、AIモデルを外部ツールやデータソースに接続するオープンスタンダードです。</p>
<p><strong>以下の用途に最適です：</strong></p>
<ul>
<li><p>外部データへのアクセス（Google Drive、Slack、GitHub、データベース）</p></li>
<li><p>ビジネスツールの使用（CRMシステム、プロジェクト管理プラットフォーム）</p></li>
<li><p>開発環境への接続（ローカルファイル、IDE、バージョン管理）</p></li>
<li><p>カスタムシステムとの統合（独自のツールやデータソース）</p></li>
</ul>
<p>以上のことから、スキルとMCPはそれぞれ異なる課題に対応し、互いに補完し合うように連携していることがわかる。</p>
<table>
<thead>
<tr><th><strong>ディメンション</strong></th><th><strong>MCP</strong></th><th><strong>スキル</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>コア・バリュー</strong></td><td>外部システム（データベース、API、SaaSプラットフォーム）への接続</td><td>動作仕様（データの処理方法と表示方法）を定義する</td></tr>
<tr><td><strong>答えられる質問</strong></td><td>「クロードは何にアクセスできるのか？</td><td>「クロードは何をすべきか？</td></tr>
<tr><td><strong>実装</strong></td><td>クライアントサーバプロトコル + JSONスキーマ</td><td>マークダウンファイル + YAMLメタデータ</td></tr>
<tr><td><strong>コンテキストの消費</strong></td><td>数万トークン（複数サーバーの蓄積）</td><td>1回の操作につき30～50トークン</td></tr>
<tr><td><strong>使用例</strong></td><td>大規模データベースへのクエリ、GitHub API の呼び出し</td><td>検索ストラテジーの定義、フィルタリングルールの適用、出力フォーマット</td></tr>
</tbody>
</table>
<p>コード検索を例にとって説明しよう。</p>
<ul>
<li><p><strong>MCP (例: claude-context)：</strong>Milvusベクターデータベースにアクセスする機能を提供する。</p></li>
<li><p><strong>スキル：</strong>最近更新されたコードに優先順位をつけたり、結果を関連性でソートしたり、データをMarkdownテーブルで表示したりといったワークフローを定義する。</p></li>
</ul>
<p>MCPは機能を提供し、スキルはプロセスを定義します。両者は補完し合うペアを形成します。</p>
<h2 id="How-to-Build-Custom-Skills-with-Claude-Context-and-Milvus" class="common-anchor-header">Claude-Contextとmilvusでカスタムスキルを構築する方法<button data-href="#How-to-Build-Custom-Skills-with-Claude-Context-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/claude-context">Claude-Contextは</a>、Claude Codeにセマンティックコード検索機能を追加し、コードベース全体をClaudeのコンテキストに変えるMCPプラグインです。</p>
<h3 id="Prerequisite" class="common-anchor-header">前提条件</h3><p>システム要件</p>
<ul>
<li><p><strong>Node.js</strong>：バージョン &gt;= 20.0.0 および &lt; 24.0.0</p></li>
<li><p><strong>OpenAI API Key</strong>(モデルの埋め込み用)</p></li>
<li><p><a href="https://zilliz.com.cn/"><strong>Zilliz Cloud</strong></a> <strong>API Key</strong>(マネージドMilvusサービス)</p></li>
</ul>
<h3 id="Step-1-Configure-the-MCP-Service-claude-context" class="common-anchor-header">ステップ1: MCPサービス（claude-context）の設定</h3><p>ターミナルで以下のコマンドを実行する：</p>
<pre><code translate="no">claude mcp add claude-context \
  -e OPENAI_API_KEY=sk-your-openai-api-key \
  -e MILVUS_ADDRESS=https:<span class="hljs-comment">//xxxxxxxxx-cn-hangzhou.cloud.zilliz.com.cn \</span>
  -e MILVUS_TOKEN=your-zilliz-cloud-api-key \
  -e COLLECTION_NAME=medium_articles \
  -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>設定を確認します：</p>
<pre><code translate="no">claude mcp list
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Check_the_Configuration_5d2abd5ee8.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>MCPのセットアップは完了です。ClaudeはMilvusベクターデータベースにアクセスできるようになりました。</p>
<h3 id="Step-2-Create-the-Skill" class="common-anchor-header">ステップ2: スキルの作成</h3><p>Skillsディレクトリを作成します：</p>
<pre><code translate="no"><span class="hljs-built_in">mkdir</span> -p ~/.claude/skills/milvus-code-search
<span class="hljs-built_in">cd</span> ~/.claude/skills/milvus-code-search
<button class="copy-code-btn"></button></code></pre>
<p>SKILL.md ファイルを作成します：</p>
<pre><code translate="no">---
name: milvus-code-search
description: A semantic code search <span class="hljs-keyword">and</span> architecture analysis skill designed <span class="hljs-keyword">for</span> the Milvus codebase
---

<span class="hljs-meta">## Instructions</span>
When the user asks questions related to the Milvus codebase, I will:

<span class="hljs-number">1.</span> **Code Search** : Use semantic search to locate relevant code snippets across the Milvus repository  
<span class="hljs-number">2.</span> **Architecture Analysis** : Analyze Milvus’s module structure, component relationships, <span class="hljs-keyword">and</span> design patterns  
<span class="hljs-number">3.</span> **Feature Explanation** : Explain how specific features are implemented <span class="hljs-keyword">and</span> how the corresponding logic works  
<span class="hljs-number">4.</span> **Development Guidance** : Provide suggestions, best practices, <span class="hljs-keyword">and</span> improvement ideas <span class="hljs-keyword">for</span> modifying the code  

<span class="hljs-meta">## Target Repository</span>
- **Core Modules**:  
  - `<span class="hljs-keyword">internal</span>/` — Core <span class="hljs-keyword">internal</span> components  
  - `pkg/` — Public packages <span class="hljs-keyword">and</span> utilities  
  - `client/` — Go client implementation  
  - `cmd/` — Command-line tools  

<span class="hljs-meta">## Usage Examples</span>

<span class="hljs-meta">### Architecture Query</span>
User: How does Milvus’s query coordinator work?  
Assistant: *(searching <span class="hljs-keyword">for</span> `querycoordv2`)* Let me walk you through how the query coordinator operates <span class="hljs-keyword">in</span> Milvus…

<span class="hljs-meta">### Feature Implementation</span>
User: How does Milvus implement vector indexing?  
Assistant: *(searching <span class="hljs-keyword">for</span> `index` code)* The vector indexing logic <span class="hljs-keyword">in</span> Milvus <span class="hljs-keyword">is</span> mainly implemented <span class="hljs-keyword">in</span> the following modules…

<span class="hljs-meta">### Code Understanding</span>
User: What does <span class="hljs-keyword">this</span> function <span class="hljs-keyword">do</span>? *(points to a specific <span class="hljs-keyword">file</span>)*  
Assistant: *(analyzing the surrounding code)* Based <span class="hljs-keyword">on</span> the context of the Milvus codebase, <span class="hljs-keyword">this</span> function <span class="hljs-keyword">is</span> responsible <span class="hljs-keyword">for</span>…

<span class="hljs-meta">### Development Guidance</span>
User: How can I <span class="hljs-keyword">add</span> a <span class="hljs-keyword">new</span> vector distance metric to Milvus?  
Assistant: *(searching <span class="hljs-keyword">for</span> `distance` implementations)* Following the existing pattern, you can <span class="hljs-keyword">add</span> a <span class="hljs-keyword">new</span> distance method <span class="hljs-keyword">by</span>…

<span class="hljs-meta">## Best Practices</span>
<span class="hljs-number">1.</span> **Precise Search** : Use specific technical terms <span class="hljs-keyword">and</span> module names  
<span class="hljs-number">2.</span> **Contextual Understanding** : Interpret code within Milvus’s overall system architecture  
<span class="hljs-number">3.</span> **Actionable Advice** : Provide practical, implementation-ready suggestions  
<span class="hljs-number">4.</span> **Performance Awareness** : Consider Milvus’s requirements <span class="hljs-keyword">as</span> a high-performance vector database  

---

*A custom code-search Skill tailored <span class="hljs-keyword">for</span> the open-source Milvus vector database project.*

---
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Restart-Claude-to-Apply-Skills" class="common-anchor-header">ステップ 3: クロードを再起動してスキルを適用する</h3><p>以下のコマンドを実行してClaudeを再起動します：</p>
<pre><code translate="no">claude
<button class="copy-code-btn"></button></code></pre>
<p><strong>Note:</strong>設定完了後、すぐにMilvusコードベースへの問い合わせにスキルを使用することができます。</p>
<p>以下はその例です。</p>
<p>クエリーMilvus QueryCoordの動作は？</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_a95429ddb0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code2_d58a942777.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code3_6c9f835c65.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>スキルは、専門的な知識をカプセル化し、伝達するメカニズムとして機能します。スキルを使用することで、AIはチームの経験を継承し、業界のベストプラクティス（コードレビューのチェックリストやドキュメンテーションの標準など）に従うことができる。この暗黙知がMarkdownファイルを通じて明示化されると、AIが生成するアウトプットの品質は大幅に向上する。</p>
<p>将来的には、スキルを効果的に活用する能力が、チームや個人がAIをどのように活用するかにおける重要な差別化要因になる可能性がある。</p>
<p>Milvusは、大規模なベクターデータを管理・検索するための重要なツールです。Milvusの強力なベクターデータベースをSkillsのようなAIツールと組み合わせることで、ワークフローだけでなく、データに基づく洞察の深さとスピードも向上させることができます。</p>
<p>ご質問や機能の詳細をお知りになりたいですか？私たちの<a href="https://discord.com/invite/8uyFbECzPX"> Discordチャンネルに</a>参加して、私たちのエンジニアやコミュニティの他のAIエンジニアとチャットしましょう。また、<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvusオフィスアワーを通して</a>、20分間の1対1のセッションを予約し、洞察やガイダンス、質問への回答を得ることもできます。</p>
