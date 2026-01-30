---
id: >-
  why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md
title: クロード・コードが安定した理由：開発者がローカル・ストレージの設計を深く掘り下げる
author: Bill chen
date: 2026-01-30T00:00:00.000Z
cover: assets.zilliz.com/cover_Claudecode_storage_81155960ef.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Claude, Claude Code, Vector Database, Retreival Augmented Generation, Milvus'
meta_keywords: 'Claude Code, AI agent, AI coding assistant, Agent memory'
meta_title: |
  How Claude Code Manages Local Storage for AI Agents
desc: Claude Codeのストレージをディープダイブ：JSONLセッションログ、プロジェクト分離、レイヤー設定、ファイルスナップショット。
origin: >-
  https://milvus.io/blog/why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md
---
<p>最近、クロード・コードがあちこちで見かけるようになった。開発者は、より速く機能を出荷し、ワークフローを自動化し、実際のプロジェクトで実際に機能するエージェントのプロトタイプを作成するためにコードを使っている。さらに驚きなのは、多くの非コーディング技術者が、ツールを構築し、タスクを配線し、ほとんど何も設定することなく有用な結果を得ていることだ。AIコーディング・ツールがこれほど早く、さまざまなスキル・レベルに普及するのは珍しいことだ。</p>
<p>しかし、本当に際立っているのは、その<em>安定</em>感だ。Claude Codeは、セッションをまたいでも何が起こったかを覚えていて、進行状況を失うことなくクラッシュを生き延び、チャット・インターフェースというよりローカル開発ツールのように動作する。その信頼性は、ローカルストレージの扱い方に由来する。</p>
<p>コーディングセッションを一時的なチャットとして扱う代わりに、Claude Code は実際のファイルを読み書きし、プロジェクトの状態をディスクに保存し、エージェントの作業のすべてのステップを記録します。セッションは推測なしに再開、検査、ロールバックすることができ、各プロジェクトはきれいに分離されたままです。</p>
<p>この記事では、その安定性の背後にあるストレージ・アーキテクチャと、Claude Codeが日常的な開発に実用的であると感じさせる大きな役割を担っている理由を詳しく見ていきます。</p>
<h2 id="Challenges-Every-Local-AI-Coding-Assistant-Faces" class="common-anchor-header">ローカルAIコーディングアシスタントが直面する課題<button data-href="#Challenges-Every-Local-AI-Coding-Assistant-Faces" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Codeがストレージにどのようにアプローチしているかを説明する前に、ローカルAIコーディングツールがぶつかりがちな一般的な問題を見てみよう。これらは、アシスタントがあなたのファイルシステム上で直接作業し、時間をかけて状態を保持するときに自然に出てくるものです。</p>
<p><strong>1.プロジェクトデータがワークスペース間で混在してしまう。</strong></p>
<p>ほとんどの開発者は、1日中複数のレポを切り替えている。アシスタントが1つのプロジェクトから別のプロジェクトへ状態を引き継ぐと、その動作を理解するのが難しくなり、間違った仮定をしやすくなります。各プロジェクトには、状態と履歴のための、クリーンで隔離された独自のスペースが必要です。</p>
<p><strong>2.クラッシュはデータ損失の原因になります。</strong></p>
<p>コーディングセッション中、アシスタントは有用なデータ-ファイルの編集、ツールの呼び出し、中間ステップ-を着実に生成する。このデータがすぐに保存されないと、クラッシュや強制再起動で消えてしまうことがあります。信頼できるシステムは、重要な状態が作成されるとすぐにディスクに書き込むので、作業が予期せず失われることはありません。</p>
<p><strong>3.エージェントが実際に何をしたかは、必ずしも明らかではありません。</strong></p>
<p>典型的なセッションには多くの小さなアクションが含まれます。これらのアクションの明確で整然とした記録がなければ、アシスタントがどのように特定の出力に到達したかを辿ったり、何かが間違ったステップを見つけることは困難です。完全な履歴は、デバッグとレビューをより管理しやすくします。</p>
<p><strong>4.ミスの取り消しに手間がかかりすぎる。</strong></p>
<p>アシスタントがうまくいかない変更をすることがあります。そのような変更をロールバックする組み込みの方法がない場合、結局は手動でリポジトリ全体の編集を探すことになります。システムは自動的に何が変更されたかを追跡し、余分な作業をせずにきれいに元に戻せるようにすべきです。</p>
<p><strong>5.プロジェクトによって異なる設定が必要。</strong></p>
<p>ローカル環境はさまざまです。特定のパーミッション、ツール、ディレクトリルールを必要とするプロジェクトもあれば、カスタムスクリプトやワークフローを持つプロジェクトもあります。アシスタントは、このような違いを尊重し、プロジェクトごとの設定を可能にしながら、コアの動作を一貫したものにする必要があります。</p>
<h2 id="The-Storage-Design-Principles-Behind-Claude-Code" class="common-anchor-header">Claude Codeを支えるストレージ設計の原則<button data-href="#The-Storage-Design-Principles-Behind-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Codeのストレージ設計は、4つの分かりやすいアイデアを中心に構築されている。これらは単純に見えるかもしれないが、一緒になることで、AIアシスタントがあなたのマシンで、複数のプロジェクトにまたがって直接作業するときに出てくる現実的な問題に対処する。</p>
<h3 id="1-Each-project-gets-its-own-storage" class="common-anchor-header">1.各プロジェクトは独自のストレージを持つ。</h3><p>Claude Codeは、すべてのセッションデータを、それが属するプロジェクトディレクトリに結びつけます。つまり、会話、編集、ログはそのプロジェクトに残り、他のプロジェクトに漏れることはありません。ストレージを別にすることで、アシスタントの動作が理解しやすくなり、特定のレポのデータを検査したり削除したりするのが簡単になります。</p>
<h3 id="2-Data-is-saved-to-disk-right-away" class="common-anchor-header">2.データはすぐにディスクに保存されます。</h3><p>インタラクションデータをメモリに保持する代わりに、Claude Codeはデータが作成されるとすぐにディスクに書き込みます。各イベント（メッセージ、ツールの呼び出し、状態の更新）は新しいエントリとして追加されます。プログラムがクラッシュしたり、不意に終了したりしても、ほとんどすべてが残っている。このアプローチは、それほど複雑さを増すことなく、セッションの耐久性を保つ。</p>
<h3 id="3-Every-action-has-a-clear-place-in-history" class="common-anchor-header">3.すべてのアクションは、履歴の中で明確な場所を持つ。</h3><p>Claude Codeは、各メッセージやツールのアクションをその前のものとリンクさせ、完全なシーケンスを形成します。この順番に並んだ履歴によって、セッションがどのように展開したかをレビューし、特定の結果に至ったステップをトレースすることが可能になる。開発者にとっては、このようなトレースがあることで、エージェントの動作のデバッグや理解が非常に容易になります。</p>
<h3 id="4-Code-edits-are-easy-to-roll-back" class="common-anchor-header">4.コード編集のロールバックが簡単</h3><p>アシスタントがファイルを更新する前に、Claude Codeは以前の状態のスナップショットを保存します。変更が間違っていることが判明した場合、レポを調べたり、何が変更されたかを推測したりすることなく、以前のバージョンを復元することができます。このシンプルなセーフティネットにより、AIによる編集のリスクは大幅に軽減される。</p>
<h2 id="Claude-Code-Local-Storage-Layout" class="common-anchor-header">クロード・コードのローカル・ストレージ・レイアウト<button data-href="#Claude-Code-Local-Storage-Layout" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Codeは、すべてのローカルデータをホームディレクトリという単一の場所に保存します。これはシステムを予測可能な状態に保ち、必要なときに検査、デバッグ、クリーンアップを容易にします。ストレージ・レイアウトは、2つの主要なコンポーネントを中心に構築されています：小さなグローバル設定ファイルと、すべてのプロジェクト・レベルの状態が存在する大きなデータ・ディレクトリです。</p>
<p><strong>2つのコア・コンポーネント</strong></p>
<ul>
<li><p><code translate="no">~/.claude.json</code>プロジェクトマッピング、MCPサーバー設定、最近使用したプロンプトを含む、グローバル設定とショートカットを保存します。</p></li>
<li><p><code translate="no">~/.claude/</code>メインのデータディレクトリには、Claude Code の会話、プロジェクトセッション、パーミッション、プラグイン、スキル、履歴、および関連するランタイムデータが保存されます。</p></li>
</ul>
<p>次に、これら2つのコアコンポーネントについて詳しく見ていきましょう。</p>
<p><strong>(1) グローバル・コンフィギュレーション</strong>：<code translate="no">~/.claude.json</code></p>
<p>このファイルは、データストアというよりインデックスとして機能する。どのプロジェクトで作業したか、各プロジェクトにどのツールが付属しているか、最近どのプロンプトを使用したかが記録される。会話データ自体はここには保存されない。</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;projects&quot;</span>: {
    <span class="hljs-string">&quot;/Users/xxx/my-project&quot;</span>: {
      <span class="hljs-string">&quot;mcpServers&quot;</span>: {
        <span class="hljs-string">&quot;jarvis-tasks&quot;</span>: {
          <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stdio&quot;</span>,
          <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;python&quot;</span>,
          <span class="hljs-string">&quot;args&quot;</span>: [<span class="hljs-string">&quot;/path/to/run_mcp.py&quot;</span>]
        }
      }
    }
  },
  <span class="hljs-string">&quot;recentPrompts&quot;</span>: [
    <span class="hljs-string">&quot;Fix the bug in auth module&quot;</span>,
    <span class="hljs-string">&quot;Add unit tests&quot;</span>
  ]
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) メインデータディレクトリ</strong>：<code translate="no">~/.claude/</code></p>
<p><code translate="no">~/.claude/</code> ディレクトリには、クロードコードのほとんどのローカル状態が保存されます。このディレクトリの構造は、プロジェクトの分離、即時の永続化、ミスからの安全なリカバリという、設計の核となるアイデアを反映しています。</p>
<pre><code translate="no">~/.claude/
├── settings.json                    <span class="hljs-comment"># Global settings (permissions, plugins, cleanup intervals)</span>
├── settings.local.json              <span class="hljs-comment"># Local settings (machine-specific, not committed to Git)</span>
├── history.jsonl                    <span class="hljs-comment"># Command history</span>
│
├── projects/                        <span class="hljs-comment"># 📁 Session data (organized by project, core directory)</span>
│   └── -Users-xxx-project/          <span class="hljs-comment"># Path-encoded project directory</span>
│       ├── {session-<span class="hljs-built_in">id</span>}.jsonl       <span class="hljs-comment"># Primary session data (JSONL format)</span>
│       └── agent-{agentId}.jsonl    <span class="hljs-comment"># Sub-agent session data</span>
│
├── session-env/                     <span class="hljs-comment"># Session environment variables</span>
│   └── {session-<span class="hljs-built_in">id</span>}/                <span class="hljs-comment"># Isolated by session ID</span>
│
├── skills/                          <span class="hljs-comment"># 📁 User-level skills (globally available)</span>
│   └── mac-mail/
│       └── SKILL.md
│
├── plugins/                         <span class="hljs-comment"># 📁 Plugin management</span>
│   ├── config.json                  <span class="hljs-comment"># Global plugin configuration</span>
│   ├── installed_plugins.json       <span class="hljs-comment"># List of installed plugins</span>
│   ├── known_marketplaces.json      <span class="hljs-comment"># Marketplace source configuration</span>
│   ├── cache/                       <span class="hljs-comment"># Plugin cache</span>
│   └── marketplaces/
│       └── anthropic-agent-skills/
│           ├── .claude-plugin/
│           │   └── marketplace.json
│           └── skills/
│               ├── pdf/
│               ├── docx/
│               └── frontend-design/
│
├── todos/                           <span class="hljs-comment"># Task list storage</span>
│   └── {session-<span class="hljs-built_in">id</span>}-*.json          <span class="hljs-comment"># Session-linked task files</span>
│
├── file-history/                    <span class="hljs-comment"># File edit history (stored by content hash)</span>
│   └── {content-<span class="hljs-built_in">hash</span>}/              <span class="hljs-comment"># Hash-named backup directory</span>
│
├── shell-snapshots/                 <span class="hljs-comment"># Shell state snapshots</span>
├── plans/                           <span class="hljs-comment"># Plan Mode storage</span>
├── local/                           <span class="hljs-comment"># Local tools / node_modules</span>
│   └── claude                       <span class="hljs-comment"># Claude CLI executable</span>
│   └── node_modules/                <span class="hljs-comment"># Local dependencies</span>
│
├── statsig/                         <span class="hljs-comment"># Feature flag cache</span>
├── telemetry/                       <span class="hljs-comment"># Telemetry data</span>
└── debug/                           <span class="hljs-comment"># Debug logs</span>
<button class="copy-code-btn"></button></code></pre>
<p>このレイアウトは意図的にシンプルにしています。Claude Codeが生成するものはすべて、プロジェクトとセッションごとに整理された1つのディレクトリの下にあります。システム上に隠された状態が散乱することはなく、必要なときに検査したりクリーンアップしたりするのも簡単です。</p>
<h2 id="How-Claude-Code-Manages-Configuration" class="common-anchor-header">Claude Codeの設定管理方法<button data-href="#How-Claude-Code-Manages-Configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Codeのコンフィギュレーションシステムは、シンプルなアイデアに基づいて設計されています。デフォルトの動作はマシン間で一貫性を保ちつつ、個々の環境やプロジェクトが必要なものをカスタマイズできるようにしています。これを実現するために、Claude Codeは3層の設定モデルを使用しています。同じ設定が複数の場所に現れる場合、より具体的なレイヤーが常に優先されます。</p>
<h3 id="The-three-configuration-levels" class="common-anchor-header">3つの設定レベル</h3><p>Claude Codeは、優先順位の低いものから高いものへと、以下の順序で設定を読み込みます：</p>
<pre><code translate="no">┌─────────────────────────────────────────┐
│    <span class="hljs-title class_">Project</span>-level configuration          │  <span class="hljs-title class_">Highest</span> priority
│    project/.<span class="hljs-property">claude</span>/settings.<span class="hljs-property">json</span>        │  <span class="hljs-title class_">Project</span>-specific, overrides other configs
├─────────────────────────────────────────┤
│    <span class="hljs-title class_">Local</span> configuration                  │  <span class="hljs-title class_">Machine</span>-specific, not version-controlled
│    ~<span class="hljs-regexp">/.claude/</span>settings.<span class="hljs-property">local</span>.<span class="hljs-property">json</span>        │  <span class="hljs-title class_">Overrides</span> <span class="hljs-variable language_">global</span> configuration
├─────────────────────────────────────────┤
│    <span class="hljs-title class_">Global</span> configuration                 │  <span class="hljs-title class_">Lowest</span> priority
│    ~<span class="hljs-regexp">/.claude/</span>settings.<span class="hljs-property">json</span>              │  <span class="hljs-title class_">Base</span> <span class="hljs-keyword">default</span> configuration
└─────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>これは、グローバルなデフォルトから始まり、マシン固有の調整を適用し、最後にプロジェクト固有のルールを適用すると考えることができます。</p>
<p>次に、それぞれの設定レベルについて詳しく説明します。</p>
<p><strong>(1) グローバル・コンフィギュレーション</strong>：<code translate="no">~/.claude/settings.json</code></p>
<p>グローバル設定は、すべてのプロジェクトにおけるクロードコードのデフォルトの動作を定義します。ここでベースラインのパーミッションを設定し、プラグインを有効にし、クリーンアップの動作を設定します。</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;<span class="hljs-variable">$schema</span>&quot;</span>: <span class="hljs-string">&quot;https://json.schemastore.org/claude-code-settings.json&quot;</span>,
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Read(**)&quot;</span>, <span class="hljs-string">&quot;Bash(npm:*)&quot;</span>],
    <span class="hljs-string">&quot;deny&quot;</span>: [<span class="hljs-string">&quot;Bash(rm -rf:*)&quot;</span>],
    <span class="hljs-string">&quot;ask&quot;</span>: [<span class="hljs-string">&quot;Edit&quot;</span>, <span class="hljs-string">&quot;Write&quot;</span>]
  },
  <span class="hljs-string">&quot;enabledPlugins&quot;</span>: {
    <span class="hljs-string">&quot;document-skills@anthropic-agent-skills&quot;</span>: <span class="hljs-literal">true</span>
  },
  <span class="hljs-string">&quot;cleanupPeriodDays&quot;</span>: 30
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) ローカル設定</strong>：<code translate="no">~/.claude/settings.local.json</code></p>
<p>ローカルコンフィギュレーションは単一のマシンに固有のものです。共有されたりバージョン管理でチェックされたりするものではありません。そのため、APIキーやローカルツール、環境固有のパーミッションを設定するのに適しています。</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Bash(git:*)&quot;</span>, <span class="hljs-string">&quot;Bash(docker:*)&quot;</span>]
  },
  <span class="hljs-string">&quot;env&quot;</span>: {
    <span class="hljs-string">&quot;ANTHROPIC_API_KEY&quot;</span>: <span class="hljs-string">&quot;sk-ant-xxx&quot;</span>
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(3) プロジェクトレベルの設定</strong>：<code translate="no">project/.claude/settings.json</code></p>
<p>プロジェクトレベルのコンフィギュレーションは単一のプロジェクトにのみ適用され、最も優先度が高い。ここでは、そのリポジトリで作業するときに常に適用されるルールを定義します。</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Bash(pytest:*)&quot;</span>]
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>設定レイヤーが定義されたので、次の問題は<strong>Claude Codeが実行時にどのように設定と権限を実際に解決するか</strong>です。</p>
<p><strong>Claude Codeは</strong>3つのレイヤーで設定を適用します。グローバルデフォルトから始まり、マシン固有のオーバーライドを適用し、最後にプロジェクト固有のルールを適用します。同じ設定が複数の場所に現れる場合、最も具体的な設定が優先されます。</p>
<p>パーミッションは固定された評価順序に従います：</p>
<ol>
<li><p><strong>deny</strong>- 常にブロック</p></li>
<li><p><strong>ask</strong>- 確認が必要</p></li>
<li><p><strong>allow</strong>- 自動的に実行されます。</p></li>
<li><p><strong>default</strong>- 一致するルールがない場合にのみ適用されます。</p></li>
</ol>
<p>これにより、デフォルトでシステムを安全に保ちつつ、プロジェクトや個々のマシンに必要な柔軟性を与えることができます。</p>
<h2 id="Session-Storage-How-Claude-Code-Persists-Core-Interaction-Data" class="common-anchor-header">セッションストレージ：Claude Codeがインタラクションのコアデータを永続化する方法<button data-href="#Session-Storage-How-Claude-Code-Persists-Core-Interaction-Data" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Claude Codeでは</strong>、セッションがデータのコア単位です。セッションは、会話そのもの、ツールの呼び出し、ファイルの変更、関連するコンテキストを含む、ユーザーとAI間のインタラクション全体をキャプチャします。セッションをどのように保存するかは、システムの信頼性、デバッグ性、全体的な安全性に直接影響します。</p>
<h3 id="Keep-session-data-separate-for-each-project" class="common-anchor-header">プロジェクトごとにセッションデータを分ける</h3><p>セッションが定義されたら、次の問題は、<strong>Claude Codeが</strong>データを整理して分離した状態でどのように保存するかです。</p>
<p><strong>Claude Codeは</strong>セッションデータをプロジェクトごとに分離します。各プロジェクトのセッションは、プロジェクトのファイルパスから派生したディレクトリの下に保存されます。</p>
<p>保存パスはこのパターンに従います：</p>
<p><code translate="no">~/.claude/projects/ + path-encoded project directory</code></p>
<p>有効なディレクトリ名を作成するために、<code translate="no">/</code> 、スペース、<code translate="no">~</code> などの特殊文字は、<code translate="no">-</code> に置き換えられます。</p>
<p>例えば</p>
<p><code translate="no">/Users/bill/My Project → -Users-bill-My-Project</code></p>
<p>この方法によって、異なるプロジェクトのセッションデータが混在することがなく、プロジェクトごとに 管理や削除ができるようになります。</p>
<h3 id="Why-sessions-are-stored-in-JSONL-format" class="common-anchor-header">セッションがJSONL形式で保存される理由</h3><p><strong>Claude Code は</strong>セッションデータを標準的な JSON ではなく JSONL (JSON Lines) を使って保存します。</p>
<p>従来のJSONファイルでは、すべてのメッセージが1つの大きな構造体の中にまとめられているため、変更があるたびにファイル全体を読み取って書き直す必要がありました。対照的に、JSONLは、各メッセージをファイル内の独自の行として保存します。1行は1メッセージに等しく、外側のラッパーはありません。</p>
<table>
<thead>
<tr><th>アスペクト</th><th>標準的なJSON</th><th>JSONL（JSON行）</th></tr>
</thead>
<tbody>
<tr><td>データの格納方法</td><td>1つの大きな構造体</td><td>1行に1メッセージ</td></tr>
<tr><td>データが保存されるタイミング</td><td>通常は最後</td><td>メッセージごとに即時</td></tr>
<tr><td>クラッシュの影響</td><td>ファイル全体が壊れる</td><td>最後の行のみ影響</td></tr>
<tr><td>新しいデータの書き込み</td><td>ファイル全体を書き換える</td><td>1行の追加</td></tr>
<tr><td>メモリ使用量</td><td>すべてを読み込む</td><td>1行ずつ読み込む</td></tr>
</tbody>
</table>
<p>JSONLはいくつかの点で優れている：</p>
<ul>
<li><p><strong>即時保存：</strong>各メッセージは、セッションの終了を待つのではなく、生成されるとすぐにディスクに書き込まれます。</p></li>
<li><p><strong>クラッシュに強い:</strong>プログラムがクラッシュした場合、最後の未完成のメッセージだけが失われる可能性があります。それ以前に書かれたものはすべてそのまま残ります。</p></li>
<li><p><strong>高速な追加：</strong>新しいメッセージは、既存のデータを読んだり書き換えたりすることなく、ファイルの最後に追加されます。</p></li>
<li><p><strong>メモリ使用量が少ない：</strong>セッションファイルは一度に1行ずつ読み込むことができるので、ファイル全体をメモリに読み込む必要はありません。</p></li>
</ul>
<p>簡略化したJSONLセッションファイルは次のようになります：</p>
<pre><code translate="no">{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:<span class="hljs-string">&quot;Hello&quot;</span>},<span class="hljs-string">&quot;timestamp&quot;</span>:<span class="hljs-string">&quot;2026-01-05T10:00:00Z&quot;</span>}
{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;assistant&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;assistant&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:[{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;text&quot;</span>,<span class="hljs-string">&quot;text&quot;</span>:<span class="hljs-string">&quot;Hi!&quot;</span>}]}}
{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:<span class="hljs-string">&quot;Help me fix this bug&quot;</span>}}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Session-message-types" class="common-anchor-header">セッション・メッセージ・タイプ</h3><p>セッションファイルは、Claude Code とのインタラクション中に発生するすべてのことを記録します。これを明確にするために、イベントの種類ごとに異なるメッセージタイプを使用します。</p>
<ul>
<li><p><strong>ユーザーメッセージは</strong>システムに入ってくる新しい入力を表します。これにはユーザーが入力したものだけでなく、シェルコマンドの出力のようなツールによって返された結果も含まれます。AIから見れば、どちらも応答する必要のある入力です。</p></li>
<li><p><strong>アシスタント・メッセージは</strong>、それに対してクロードが何をするかを捉えます。これらのメッセージには、AIの推論、AIが生成したテキスト、AIが使用を決定したツールなどが含まれる。また、トークン数などの使用状況の詳細も記録し、インタラクションの全体像を提供する。</p></li>
<li><p><strong>ファイル履歴スナップショットは</strong>、クロードがファイルを変更する前に作成される安全性のチェックポイントである。オリジナルのファイル状態を最初に保存することで、Claude Codeは何か問題が発生した場合に変更を取り消すことができます。</p></li>
<li><p><strong>要約は</strong>、セッションの簡潔な概要を提供し、最終的な結果にリンクされています。すべてのステップを再生することなく、セッションの内容を簡単に理解することができます。</p></li>
</ul>
<p>これらのメッセージタイプは、一緒になって、会話だけでなく、セッション中に起こるアクションとエ フェクトの完全なシーケンスを記録します。</p>
<p>これをより具体的にするために、ユーザーメッセージとアシスタントメッセージの具体例を見てみましょう。</p>
<p><strong>(1) ユーザーメッセージの例：</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
  <span class="hljs-string">&quot;uuid&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;parentUuid&quot;</span>: <span class="hljs-literal">null</span>,
  <span class="hljs-string">&quot;sessionId&quot;</span>: <span class="hljs-string">&quot;e5d52290-e2c1-41d6-8e97-371401502fdf&quot;</span>,
  <span class="hljs-string">&quot;timestamp&quot;</span>: <span class="hljs-string">&quot;2026-01-05T10:00:00.000Z&quot;</span>,
  <span class="hljs-string">&quot;message&quot;</span>: {
    <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
    <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Analyze the architecture of this project&quot;</span>
  },
  <span class="hljs-string">&quot;cwd&quot;</span>: <span class="hljs-string">&quot;/Users/xxx/project&quot;</span>,
  <span class="hljs-string">&quot;gitBranch&quot;</span>: <span class="hljs-string">&quot;main&quot;</span>,
  <span class="hljs-string">&quot;version&quot;</span>: <span class="hljs-string">&quot;2.0.76&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) アシスタントメッセージの例：</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;assistant&quot;</span>,
  <span class="hljs-string">&quot;uuid&quot;</span>: <span class="hljs-string">&quot;e684816e-f476-424d-92e3-1fe404f13212&quot;</span>,
  <span class="hljs-string">&quot;parentUuid&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;message&quot;</span>: {
    <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;assistant&quot;</span>,
    <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-string">&quot;claude-opus-4-5-20251101&quot;</span>,
    <span class="hljs-string">&quot;content&quot;</span>: [
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;thinking&quot;</span>,
        <span class="hljs-string">&quot;thinking&quot;</span>: <span class="hljs-string">&quot;The user wants to understand the project architecture, so I need to check the directory structure first...&quot;</span>
      },
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>,
        <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Let me take a look at the project structure first.&quot;</span>
      },
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;tool_use&quot;</span>,
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-string">&quot;toolu_01ABC&quot;</span>,
        <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;Bash&quot;</span>,
        <span class="hljs-string">&quot;input&quot;</span>: {<span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;ls -la&quot;</span>}
      }
    ],
    <span class="hljs-string">&quot;usage&quot;</span>: {
      <span class="hljs-string">&quot;input_tokens&quot;</span>: <span class="hljs-number">1500</span>,
      <span class="hljs-string">&quot;output_tokens&quot;</span>: <span class="hljs-number">200</span>,
      <span class="hljs-string">&quot;cache_read_input_tokens&quot;</span>: <span class="hljs-number">50000</span>
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Session-Messages-Are-Linked" class="common-anchor-header">セッションメッセージのリンク方法</h3><p>Claude Code はセッションメッセージを孤立したエントリとして保存しません。その代わりに、それらをリンクして、イベントの明確な連鎖を形成します。各メッセージには一意の識別子(<code translate="no">uuid</code>)と、その前に来たメッセージへの参照(<code translate="no">parentUuid</code>)が含まれています。これにより、何が起こったかだけでなく、なぜそれが起こったかを見ることができる。</p>
<p>セッションはユーザーメッセージから始まり、それが連鎖を始める。クロードからの各返信は、その原因となったメッセージを指し返します。ツールの呼び出しとその出力は同じように追加され、すべてのステップはその前のステップにリンクしている。セッションが終了すると、最後のメッセージに要約が添付される。</p>
<p>すべてのステップがリンクされているため、Claude Codeはアクションの完全なシーケンスを再生し、結果がどのように生成されたかを理解することができます。</p>
<h2 id="Making-Code-Changes-Easy-to-Undo-with-File-Snapshots" class="common-anchor-header">ファイルスナップショットでコード変更を簡単に元に戻す<button data-href="#Making-Code-Changes-Easy-to-Undo-with-File-Snapshots" class="anchor-icon" translate="no">
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
    </button></h2><p>AIが生成した編集は常に正しいとは限らず、時には完全に間違った方向に進むこともあります。このような変更を安全に実験できるようにするため、Claude Codeはシンプルなスナップショットシステムを採用しており、差分を調べたりファイルを手動でクリーンアップしたりすることなく、編集を取り消すことができます。</p>
<p><strong>Claude Codeがファイルを変更する前に、元のコンテンツのコピーを保存します。</strong>編集が間違いであることが判明した場合、システムは即座に以前のバージョンを復元することができます。</p>
<h3 id="What-is-a-file-history-snapshot" class="common-anchor-header"><em>ファイル履歴スナップショットとは</em>何ですか？</h3><p><em>ファイル履歴スナップショットは</em>、ファイルが変更される前に作成されるチェックポイントです。<strong>クロードが</strong>編集しようとしているすべてのファイルのオリジナルの内容を記録します。これらのスナップショットは、アンドゥやロールバック操作のデータソースとして機能します。</p>
<p>ユーザがファイルを変更する可能性のあるメッセージを送信すると、<strong>Claude Codeは</strong>そのメッセージに対して空のスナップショットを作成します。編集の前に、システムは各ターゲットファイルのオリジナルコンテンツをスナップショットにバックアップし、その後、編集をディスクに直接適用します。ユーザーが<em>アンドゥを</em>トリガーした場合、<strong>Claude Codeは</strong>保存された内容を復元し、変更されたファイルを上書きします。</p>
<p>実際には、アンドゥ可能な編集のライフサイクルは次のようになります：</p>
<ol>
<li><p><strong>ユーザーがメッセージを送信するClaude</strong>Codeが新しい空の<code translate="no">file-history-snapshot</code> レコードを作成する。</p></li>
<li><p><strong>Claudeはファイルを変更する準備をする。</strong>システムはどのファイルが編集されるかを特定し、元の内容を<code translate="no">trackedFileBackups</code> にバックアップする。</p></li>
<li><p><strong>クロードが編集を実行する編集と</strong>書き込みが実行され、変更された内容がディスクに書き込まれる。</p></li>
<li><p><strong>ユーザーがアンドゥをトリガー</strong>ユーザーが<strong>Esc + Escを押して</strong>、変更を取り消すことを知らせる。</p></li>
<li><p><strong>元のコンテンツが復元されるClaude</strong>Codeが<code translate="no">trackedFileBackups</code> 、保存されたコンテンツを読み込み、現在のファイルを上書きし、アンドゥが完了する。</p></li>
</ol>
<h3 id="Why-Undo-Works-Snapshots-Save-the-Old-Version" class="common-anchor-header">元に戻すが機能する理由スナップショットは旧バージョンを保存する</h3><p>Claude CodeのUndoが機能するのは、編集が行われる前に<em>元の</em>ファイルの内容が保存されるからです。</p>
<p>後から変更を元に戻そうとするのではなく、Claude Codeはよりシンプルなアプローチをとります。変更<em>前の</em>ファイルをコピーし、そのコピーを<code translate="no">trackedFileBackups</code> 。ユーザーがアンドゥをトリガーすると、システムはこの保存されたバージョンを復元し、編集されたファイルを上書きする。</p>
<p>下の図は、この流れをステップごとに示しています：</p>
<pre><code translate="no">┌─────────────────────────┐
│    before edit,  app.py │
│    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;old&quot;</span>)         │───────→  Backed up into snapshot trackedFileBackups
└─────────────────────────┘

↓

┌──────────────────────────┐
│   After Claude edits     │
│    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;new&quot;</span>)          │───────→  Written to disk (overwrites the original file)
└──────────────────────────┘

↓

┌──────────────────────────┐
│    User triggers undo    │
│    Press   Esc + Esc     │───────→ Restore <span class="hljs-string">&quot;old&quot;</span> content to disk <span class="hljs-keyword">from</span> snapshot
└──────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<h3 id="What-a-file-History-snapshot-Looks-Like-Internally" class="common-anchor-header"><em>ファイル履歴スナップショットは</em>内部的にどのように見えるか</h3><p>スナップショット自体は構造化レコードとして保存されます。これは、ユーザーメッセージ、スナップショットの時間、そして最も重要な、元のコンテンツへのファイルのマップに関するメタデータをキャプチャします。</p>
<p>以下の例は、クロードがファイルを編集する前に作成された<code translate="no">file-history-snapshot</code> レコードを示しています。<code translate="no">trackedFileBackups</code> の各エントリには、<em>編集前の</em>ファイルの内容が保存されており、この内容は後でアンドゥを行う際にファイルを復元するために使用されます。</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;file-history-snapshot&quot;</span>,
  <span class="hljs-string">&quot;messageId&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;snapshot&quot;</span>: {
    <span class="hljs-string">&quot;messageId&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
    <span class="hljs-string">&quot;trackedFileBackups&quot;</span>: {
      <span class="hljs-string">&quot;/path/to/file1.py&quot;</span>: <span class="hljs-string">&quot;Original file content\ndef hello():\n    print(&#x27;old&#x27;)&quot;</span>,
      <span class="hljs-string">&quot;/path/to/file2.js&quot;</span>: <span class="hljs-string">&quot;// Original content...&quot;</span>
    },
    <span class="hljs-string">&quot;timestamp&quot;</span>: <span class="hljs-string">&quot;2026-01-05T10:00:00.000Z&quot;</span>
  },
  <span class="hljs-string">&quot;isSnapshotUpdate&quot;</span>: <span class="hljs-literal">false</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Where-Snapshots-Are-Stored-and-How-Long-They-Are-Kept" class="common-anchor-header">スナップショットの保存場所と保存期間</h3><ul>
<li><p><strong>スナップショットのメタデータが保存される場所</strong>：スナップショットレコードは特定のセッションにバインドされ、<code translate="no">~/.claude/projects/-path-to-project/{session-id}.jsonl</code> の下にJSONLファイルとして保存されます。</p></li>
<li><p><strong>元のファイルの内容がバックアップされる場所</strong>：各ファイルの編集前のコンテンツは、<code translate="no">~/.claude/file-history/{content-hash}/</code> のコンテンツハッシュによって個別に保存されます。</p></li>
<li><p><strong>スナップショットのデフォルト保存期間</strong>：スナップショット・データは、グローバルな<code translate="no">cleanupPeriodDays</code> の設定と同様に、30日間保持されます。</p></li>
<li><p><strong>保持期間の変更方法</strong>：保持日数は<code translate="no">~/.claude/settings.json</code> の<code translate="no">cleanupPeriodDays</code> フィールドで調整できます。</p></li>
</ul>
<h3 id="Related-Commands" class="common-anchor-header">関連コマンド</h3><table>
<thead>
<tr><th>コマンド/アクション</th><th>説明</th></tr>
</thead>
<tbody>
<tr><td>Esc + Esc</td><td>直近のファイル編集を元に戻す（最も一般的に使用される）</td></tr>
<tr><td>/巻き戻し</td><td>以前に指定したチェックポイント（スナップショット）に戻す。</td></tr>
<tr><td>/diff</td><td>現在のファイルとスナップショットバックアップの差分を表示する。</td></tr>
</tbody>
</table>
<h2 id="Other-Important-Directories" class="common-anchor-header">その他の重要なディレクトリ<button data-href="#Other-Important-Directories" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>(1) plugins/ - プラグイン管理</strong></p>
<p><code translate="no">plugins/</code> ディレクトリはクロードコードに追加機能を与えるアドオンを保存します。</p>
<p>このディレクトリにはどの<em>プラグインが</em>インストールされているか、そのプラグインはどこから来たのか、そしてそれらのプラグインが提供する追加スキルが保存されます。また、ダウンロードしたプラグインのローカルコピーも保存されるので、再度取得する必要はありません。</p>
<pre><code translate="no">~/.claude/plugins/
├── config.json
│   Global plugin configuration (e.g., <span class="hljs-built_in">enable</span>/disable rules)
├── installed_plugins.json
│   List of installed plugins (including version and status)
├── known_marketplaces.json
│   Plugin marketplace <span class="hljs-built_in">source</span> configuration (e.g., Anthropic official marketplace)
├── cache/
│   Plugin download cache (avoids repeated downloads)
└── marketplaces/
    Marketplace <span class="hljs-built_in">source</span> storage
    └── anthropic-agent-skills/
        Official plugin marketplace
        ├── .claude-plugin/
        │   └── marketplace.json
        │       Marketplace metadata
        └── skills/
            Skills provided by the marketplace
            ├── pdf/
            │   PDF-related skills
            ├── docx/
            │   Word document processing skills
            └── frontend-design/
                Frontend design skills
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) skills/ - スキルが保存され適用される場所</strong></p>
<p>クロードコードでは、スキルとは、クロードが特定のタスクを実行するのに役立つ、再利用可能な小さな能力です。</p>
<p>すべてのスキルがどこでも使えるわけではありません。グローバルに適用されるものもあれば、単一のプロジェクトに限定されたり、プラグインによって提供されるものもあります。Claude Code では、各スキルを使用できる場所を制御するために、さまざまな場所にスキルを保存します。</p>
<p>以下の階層は、グローバルに利用可能なスキルから、プロジェクト固有のスキルやプラグインによって提供されるスキルまで、スキルがどのように範囲ごとに階層化されているかを示しています。</p>
<table>
<thead>
<tr><th>レベル</th><th>保存場所</th><th>説明</th></tr>
</thead>
<tbody>
<tr><td>ユーザー</td><td>~/.claude/skills/</td><td>グローバルに利用可能、すべてのプロジェクトからアクセス可能</td></tr>
<tr><td>プロジェクト</td><td>プロジェクト/.claude/スキル</td><td>現在のプロジェクトでのみ利用可能、プロジェクトごとにカスタマイズ可能</td></tr>
<tr><td>プラグイン</td><td>~/.claude/plugins/marketplaces/*/skills/ プラグインと一緒にインストールされます。</td><td>プラグインと一緒にインストールされ、プラグインの有効化ステータスに依存する</td></tr>
</tbody>
</table>
<p><strong>(3) todos/ - タスクリストストレージ</strong></p>
<p><code translate="no">todos/</code> ディレクトリは、クロードが会話中の作業を追跡するために作成する、完了するステップ、進行中のアイテム、完了したタスクなどのタスクリストを保存します。</p>
<p>タスクリストは<code translate="no">~/.claude/todos/{session-id}-*.json</code> の下に JSON ファイルとして保存されます。各ファイル名はタスクリストを特定の会話に結びつけるセッション ID を含みます。</p>
<p>これらのファイルの内容は、<code translate="no">TodoWrite</code> ツールに由来し、タスクの説明、現在のステータス、優先度、関連するメタデータなどの基本的なタスク情報を含む。</p>
<p><strong>(4) local/ - ローカルランタイムとツール</strong></p>
<p><code translate="no">local/</code> ディレクトリには、クロードコードがあなたのマシンで実行するために必要なコアファイルがあります。</p>
<p>これには、<code translate="no">claude</code> コマンドライン実行ファイルと、ランタイムの依存関係を含む<code translate="no">node_modules/</code> ディレクトリが含まれます。これらのコンポーネントをローカルに保つことで、クロードコードは外部サービスやシステム全体のインストールに依存することなく、独立して実行することができます。</p>
<p><strong>（5）その他のサポートディレクトリ</strong></p>
<ul>
<li><p><strong>shell-snapshots/：</strong>シェルセッションの状態スナップショット（カレントディレクトリや環境変数など）を保存し、シェル操作のロールバックを可能にします。</p></li>
<li><p><strong>plans/：</strong>プランモードで生成された実行計画（複数ステップのプログラミングタスクのステップごとの内訳など）を格納する。</p></li>
<li><p><strong>statsig/：</strong>機能フラグの設定（新機能が有効かどうかなど）をキャッシュし、繰り返しリクエストを減らす。</p></li>
<li><p><strong>telemetry/：</strong>製品の最適化のために、匿名の遠隔測定データ（機能の使用頻度など）を保存します。</p></li>
<li><p><strong>debug/：</strong>トラブルシューティングのためのデバッグログ（エラースタックや実行トレースを含む）を保存します。</p></li>
</ul>
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
    </button></h2><p>Claude Codeがどのようにすべてをローカルに保存し、管理しているのかを調べてみると、かなりはっきりしたことがわかる。派手さはない。各プロジェクトには独自のスペースがあり、すべてのアクションは書き留められ、ファイルの編集は何かが変更される前にバックアップされる。黙々と仕事をこなし、自分の仕事に集中できるようなデザインだ。</p>
<p>私が最も気に入っているのは、ここには神秘的なものが何もないことだ。クロード・コードがうまく機能しているのは、基本がきちんとできているからだ。実際のファイルに触れるエージェントを作ろうとしたことがある人なら、状態が混ざってしまったり、クラッシュで進捗が消えてしまったり、アンドゥが当てずっぽうになってしまったりと、物事がどれだけ簡単に崩れてしまうか知っているはずだ。Claude Codeは、シンプルで一貫性があり、壊れにくいストレージモデルによって、そのような事態を回避します。</p>
<p>ローカルまたはオンプレミスでAIエージェントを構築するチームにとって、特にセキュアな環境では、このアプローチは、強力なストレージと永続性がAIツールをいかに信頼性の高い、日常的な開発に実用的なものにするかを示している。</p>
<p>ローカルまたはオンプレミスのAIエージェントを設計していて、ストレージアーキテクチャ、セッション設計、または安全なロールバックについてより詳しく議論したい場合は、お気軽に<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slackチャンネルに</a>ご参加ください。</p>
