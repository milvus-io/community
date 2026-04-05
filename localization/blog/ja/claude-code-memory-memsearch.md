---
id: claude-code-memory-memsearch.md
title: クロード・コードの流出ソースを読んだ。メモリーの実際の仕組みはこうだ
author: Cheney Zhang
date: 2026-4-3
cover: assets.zilliz.com/claude_memory_845a789ee8.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Claude Code memory, AI agent memory, memsearch, Claude Code source leak,
  cross-agent memory
meta_title: |
  Claude Code Memory System Explained: 4 Layers, 5 Limits, and a Fix
desc: >-
  クロード・コードがリークしたソースから、grepのみの検索で200行を上限とする4層のメモリが明らかになった。各レイヤーの動作とmemsearchが修正する内容は以下の通りだ。
origin: 'https://milvus.io/blog/claude-code-memory-memsearch.md'
---
<p>クロード・コードのソースコードが誤って公開されてしまった。バージョン2.1.88には59.8MBのソースマップファイルが含まれていた。その1つのファイルには、完全で読みやすいTypeScriptコードベース（512,000行）が含まれており、現在はGitHub全体でミラーリングされている。</p>
<p><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">メモリ・</a>システムは私たちの注意を引いた。クロード・コードは、市場で最も人気のあるAIコーディング・エージェントであり、メモリは、ほとんどのユーザーがボンネットの中でどのように動作しているのかを理解せずに操作している部分である。そこで、私たちは掘り下げてみた。</p>
<p>簡単に説明しよう：クロード・コードのメモリは、想像以上に基本的なものだ。メモの上限は200行。もし「ポートの競合」について質問しても、メモに「docker-compose mapping」と書かれていれば、何も得られない。そしてクロード・コードから何も出てこない。別のエージェントに切り替えると、ゼロからのスタートとなる。</p>
<p>ここに4つのレイヤーがある：</p>
<ul>
<li><strong>CLAUDE.md</strong>- クロードが従うべきルールを自分で書いたファイル。手動で、静的で、事前に書き留めようと思う量によって制限される。</li>
<li><strong>Auto Memory</strong>- セッション中にクロードが自分でメモを取る。便利だが、200行のインデックスが上限。</li>
<li><strong>オートドリーム</strong>- あなたがアイドルである間、乱雑な記憶を統合するバックグラウンドクリーンアッププロセス。数日前の雑然とした記憶を整理するのに役立つ。</li>
<li><strong>KAIROS</strong>- リークされたコードにあった未発表の常時稼働デーモンモード。公開ビルドにはまだない。</li>
</ul>
<p>以下では、各レイヤーを紐解き、アーキテクチャが破綻している部分と、そのギャップに対処するために構築したものを取り上げる。</p>
<h2 id="How-Does-CLAUDEmd-Work" class="common-anchor-header">CLAUDE.mdはどのように機能するのか？<button data-href="#How-Does-CLAUDEmd-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>CLAUDE.mdはMarkdownファイルで、プロジェクトフォルダーに作成します。コードスタイルのルール、プロジェクトの構造、テストコマンド、デプロイ手順など、クロードに覚えておいてほしいことを何でも書き込むことができます。Claudeはセッションの開始時にこのファイルを読み込みます。</p>
<p>プロジェクトレベル（リポジトリルート）、個人用（<code translate="no">~/.claude/CLAUDE.md</code> ）、組織用（enterprise config）の3つのスコープがあります。短いファイルほど、より確実に追跡される。</p>
<p>CLAUDE.mdは、あなたが事前に書き留めたものだけを保持します。デバッグの決定事項、会話の途中で触れた環境設定、一緒に発見したエッジケースなど、あなたが立ち止まって手動で追加しない限り、どれも捕捉されません。ほとんどの人はそうしない。</p>
<h2 id="How-Does-Auto-Memory-Work" class="common-anchor-header">オートメモリーの仕組み<button data-href="#How-Does-Auto-Memory-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Auto Memoryは、作業中に表面化したものをキャプチャします。クロードが保存する価値のあるものを判断し、ユーザー（役割と好み）、フィードバック（あなたの修正）、プロジェクト（決定とコンテキスト）、リファレンス（物事の保存場所）の4つのカテゴリーに整理して、あなたのマシン上のメモリー・フォルダーに書き込みます。</p>
<p>各ノートは個別のMarkdownファイルです。エントリーポイントは<code translate="no">MEMORY.md</code> 、各行が詳細ファイルを指す短いラベル（150文字以下）であるインデックスです。クロードはインデックスを読み、関連すると思われる特定のファイルを引っ張ってくる。</p>
<pre><code translate="no">~<span class="hljs-regexp">/.claude/</span>projects/-<span class="hljs-title class_">Users</span>-me-myproject/memory/
├── <span class="hljs-variable constant_">MEMORY</span>.<span class="hljs-property">md</span>                  ← index file, one pointer per line
├── user_role.<span class="hljs-property">md</span>               ← <span class="hljs-string">&quot;Backend engineer, fluent in Go, new to React&quot;</span>
├── feedback_testing.<span class="hljs-property">md</span>        ← <span class="hljs-string">&quot;Integration tests must use real DB, no mocking&quot;</span>
├── project_auth_rewrite.<span class="hljs-property">md</span>    ← <span class="hljs-string">&quot;Auth rewrite driven by compliance, not tech debt&quot;</span>
└── reference_linear.<span class="hljs-property">md</span>        ← <span class="hljs-string">&quot;Pipeline bugs tracked in Linear INGEST project&quot;</span>

<span class="hljs-variable constant_">MEMORY</span>.<span class="hljs-property">md</span> <span class="hljs-title function_">sample</span> (each line ≤<span class="hljs-number">150</span> chars):
- [<span class="hljs-title class_">User</span> role](user_role.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Backend</span> engineer, strong <span class="hljs-title class_">Go</span>, <span class="hljs-keyword">new</span> to <span class="hljs-title class_">React</span>
- [<span class="hljs-title class_">Testing</span> rule](feedback_testing.<span class="hljs-property">md</span>) — <span class="hljs-title class_">No</span> mocking the database <span class="hljs-keyword">in</span> integration tests
- [<span class="hljs-title class_">Auth</span> rewrite](project_auth_rewrite.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Compliance</span>-driven, not tech debt
- [<span class="hljs-title class_">Bug</span> tracker](reference_linear.<span class="hljs-property">md</span>) — <span class="hljs-title class_">Pipeline</span> bugs → <span class="hljs-title class_">Linear</span> <span class="hljs-variable constant_">INGEST</span>
<button class="copy-code-btn"></button></code></pre>
<p>MEMORY.mdの最初の200行がすべてのセッションに読み込まれる。それ以上は見えない。</p>
<p>一つの賢い設計の選択：リークされたシステム・プロンプトは、クロードに自分自身のメモリーを事実ではなくヒントとして扱うように指示する。これは、他の<a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">AIエージェントフレームワークが</a>採用し始めているパターンである。</p>
<h2 id="How-Does-Auto-Dream-Consolidate-Stale-Memories" class="common-anchor-header">オート・ドリームはどのようにして古くなった記憶を統合するのか？<button data-href="#How-Does-Auto-Dream-Consolidate-Stale-Memories" class="anchor-icon" translate="no">
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
    </button></h2><p>Auto Memoryはメモを取り込むが、何週間も使っているとそのメモは古くなる。昨日のデプロイのバグ」というエントリーは、1週間後には無意味になる。あるメモにはPostgreSQLを使っていると書いてあるが、新しいメモにはMySQLに移行したと書いてある。削除されたファイルにはまだメモリーが残っている。インデックスは矛盾と古い参照でいっぱいになる。</p>
<p>オート・ドリームはクリーンアップ・プロセスである。バックグラウンドで実行され</p>
<ul>
<li>曖昧な時間参照を正確な日付に置き換えます。"昨日のデプロイ問題" → "2026-03-28のデプロイ問題"。</li>
<li>矛盾を解決します。PostgreSQL note + MySQL note → 現在の真実を保持します。</li>
<li>古いエントリを削除。削除されたファイルや完了したタスクを参照しているノートは削除されます。</li>
<li><code translate="no">MEMORY.md</code> を200行以下に保つ。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_1_7973e94494.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>トリガー条件：</strong>最後のクリーンアップから24時間以上経過しており、かつ新しいセッションが5つ以上蓄積されている。dream "と入力して手動で実行することもできる。このプロセスは、バックグラウンドのサブエージェントで実行されます - 実際のスリープのように、アクティブな作業を中断することはありません。</p>
<p>ドリームエージェントのシステムプロンプトはこう始まる：<em>"あなたは夢を見ています-あなたのメモリーファイルに対する反射的なパスです。"</em></p>
<h2 id="What-Is-KAIROS-Claude-Codes-Unreleased-Always-On-Mode" class="common-anchor-header">KAIROSとは？クロード・コードの未発表常時稼働モード<button data-href="#What-Is-KAIROS-Claude-Codes-Unreleased-Always-On-Mode" class="anchor-icon" translate="no">
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
    </button></h2><p>最初の3つのレイヤーはライブまたはロールアウトしている。リークされたコードには、出荷されていないものも含まれている：KAIROSだ。</p>
<p>KAIROSはギリシャ語で「正しい瞬間」を意味する言葉から名付けられたようだが、ソースには150回以上登場する。KAIROSは、Claude Codeをあなたが積極的に使用するツールから、あなたのプロジェクトを継続的に監視するバックグラウンド・アシスタントに変えるだろう。</p>
<p>リークされたコードに基づくと、KAIROSは以下のようになる：</p>
<ul>
<li>一日中、観察、決定、行動の実行ログを保持する。</li>
<li>タイマーでチェックイン。一定間隔でシグナルを受信し、行動するか静観するかを決定する。</li>
<li>あなたの邪魔をしない。15秒以上あなたの邪魔になる行動はすべて延期される。</li>
<li>ドリームクリーンアップを内部で実行し、さらにバックグラウンドで完全なobserve-think-actループを実行する。</li>
<li>通常のClaude Codeにはない特別なツールがある：ファイルをプッシュしたり、通知を送ったり、GitHubのプルリクエストを監視したり。</li>
</ul>
<p>KAIROSはコンパイル時の機能フラグに隠れています。公開ビルドにはありません。Anthropicは、<a href="https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md">エージェントのメモリが</a>セッション単位でなくなり、常時オンになったときに何が起こるかを探っているのだと考えてください。</p>
<h2 id="Where-Does-Claude-Codes-Memory-Architecture-Break-Down" class="common-anchor-header">クロードコードのメモリアーキテクチャはどこで破綻するのか？<button data-href="#Where-Does-Claude-Codes-Memory-Architecture-Break-Down" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Codeのメモリは実際に動作する。しかし、5つの構造的な制限によって、プロジェクトが大きくなるにつれて処理できることが制限される。</p>
<table>
<thead>
<tr><th>制限</th><th>何が起こるか</th></tr>
</thead>
<tbody>
<tr><td><strong>200行インデックス上限</strong></td><td><code translate="no">MEMORY.md</code> 25KBを保持。何ヶ月もプロジェクトを運営すると、古いエントリーが新しいエントリーに押されてしまう。"先週はどんなRedis設定にしたっけ？"- がなくなる。</td></tr>
<tr><td><strong>Grepのみの検索</strong></td><td>メモリー検索では、リテラルな<a href="https://milvus.io/docs/full-text-search.md">キーワードマッチを</a>使う。あなたは "デプロイ時のポートの競合 "を覚えているが、メモには "docker-composeのポートマッピング "と書かれている。Grepはそのギャップを埋められない。</td></tr>
<tr><td><strong>要約のみ、推論なし</strong></td><td>Auto Memoryはハイレベルなメモを保存し、デバッグの手順やそこに至った理由は保存しません。<em>どのようにしたかが</em>失われる。</td></tr>
<tr><td><strong>基礎を修正せずに複雑さを積み重ねる</strong></td><td>CLAUDE.md → Auto Memory → Auto Dream → KAIROS。各層が存在するのは、最後の層が十分でなかったからだ。しかし、いくらレイヤーを重ねても、その下にあるものは変わらない：1つのツール、ローカルファイル、セッションごとのキャプチャ。</td></tr>
<tr><td><strong>メモリーはクロード・コードの中に閉じ込められている</strong></td><td>OpenCode、Codex CLI、その他のエージェントに切り替えると、ゼロからのスタートとなる。エクスポートも、共有フォーマットも、移植性もありません。</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_2_b006110116.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>これらはバグではありません。シングルツール、ローカルファイルアーキテクチャの自然な限界なのです。毎月新しいエージェントが出荷され、ワークフローは変化しますが、プロジェクトで蓄積した知識は、それらと一緒に消えてはいけません。それが、<a href="https://github.com/zilliztech/memsearch">memsearchを</a>開発した理由です。</p>
<h2 id="What-Is-memsearch-Persistent-Memory-for-Any-AI-Coding-Agent" class="common-anchor-header">memsearchとは？あらゆるAIコーディング・エージェントのための永続的なメモリ<button data-href="#What-Is-memsearch-Persistent-Memory-for-Any-AI-Coding-Agent" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/memsearch">memsearch</a>はエージェントからメモリを取り出し、独自のレイヤーに格納します。エージェントは行ったり来たりします。メモリは残ります。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_3_4151da0414.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="How-to-Install-memsearch" class="common-anchor-header">memsearchのインストール方法</h3><p>Claude Codeユーザーはマーケットプレイスからインストールします：</p>
<pre><code translate="no">/plugin marketplace add zilliztech/memsearch
/plugin install memsearch
<button class="copy-code-btn"></button></code></pre>
<p>完了。設定不要。</p>
<p>他のプラットフォームも同様に簡単。OpenClaw:<code translate="no">openclaw plugins install clawhub:memsearch</code>.uv または pip 経由の Python API：</p>
<pre><code translate="no">uv tool install <span class="hljs-string">&quot;memsearch[onnx]&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="What-Does-memsearch-Capture" class="common-anchor-header">memsearch は何を捕捉するのか？</h3><p>一度インストールすると、memsearch はエージェントのライフサイクルにフックします。すべての会話は自動的に要約され、インデックス化されます。履歴が必要な質問をすると、リコールが勝手にトリガーされます。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_4_13b257186e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>メモリーファイルは、日付付きMarkdownとして保存されます：</p>
<pre><code translate="no">.memsearch/
└── memory/
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-28.</span>md    ← one <span class="hljs-keyword">file</span> per day
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-29.</span>md
    ├── <span class="hljs-number">2026</span><span class="hljs-number">-03</span><span class="hljs-number">-30.</span>md
    └── <span class="hljs-number">2026</span><span class="hljs-number">-04</span><span class="hljs-number">-01.</span>md
<button class="copy-code-btn"></button></code></pre>
<p>どのテキストエディタでもメモリーファイルを開き、読み、編集することができます。移行したい場合は、フォルダをコピーする。バージョン管理が必要な場合は、gitがネイティブで動作する。</p>
<p><a href="https://milvus.io/docs/overview.md">Milvusに</a>保存されている<a href="https://milvus.io/docs/index-explained.md">ベクターインデックスは</a>キャッシュレイヤーであり、万が一失われた場合は、Markdownファイルから再構築します。あなたのデータはインデックスではなく、ファイルに保存されています。</p>
<h2 id="How-Does-memsearch-Find-Memories-Semantic-Search-vs-Grep" class="common-anchor-header">memsearchはどうやってメモリーを見つけるのか？セマンティック検索とGrepの比較<button data-href="#How-Does-memsearch-Find-Memories-Semantic-Search-vs-Grep" class="anchor-icon" translate="no">
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
    </button></h2><p>クロード・コードの記憶検索では、grep（リテラル・キーワード・マッチング）を使っています。これは数十のメモがあるときには有効ですが、数ヶ月の履歴があり、正確な表現を思い出せないときには破綻します。</p>
<p>memsearchは代わりに<a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">ハイブリッド検索を</a>使う。<a href="https://zilliz.com/glossary/semantic-search">セマンティック・ベクトルは</a>言い回しが異なっていてもクエリに関連するコンテンツを見つけ、BM25は正確なキーワードにマッチする。<a href="https://milvus.io/docs/rrf-ranker.md">RRF（Reciprocal Rank Fusion）は</a>、両方の結果セットをマージし、一緒にランク付けします。</p>
<p>例えば、"先週のRedisのタイムアウトはどのように修正されましたか？"と質問したとします。- セマンティック検索は意図を理解し、それを見つける。例えば、&quot;search for<code translate="no">handleTimeout</code>&quot; - BM25は正確な関数名をヒットします。この2つの経路はお互いの死角をカバーする。</p>
<p>リコールがトリガーされると、サブエージェントは3段階で検索を行い、必要なときだけさらに深く検索を行う：</p>
<h3 id="L1-Semantic-Search--Short-Previews" class="common-anchor-header">L1: 意味検索 - 短いプレビュー</h3><p>サブエージェントはmilvusインデックスに対して<code translate="no">memsearch search</code> 、最も関連性の高い結果を引き出す：</p>
<pre><code translate="no">┌─ L1 search results ────────────────────────────┐
│                                                 │
│  <span class="hljs-meta">#a3f8c1 [score: 0.85] memory/2026-03-28.md    │</span>
│  &gt; Redis port conflict during deploy, <span class="hljs-literal">default</span>   │
│    <span class="hljs-number">6379</span> occupied, switched to <span class="hljs-number">6380</span>, updated     │
│    docker-compose...                            │
│                                                 │
│  <span class="hljs-meta">#b7e2d4 [score: 0.72] memory/2026-03-25.md    │</span>
│  &gt; Auth module rewrite complete, JWT replaced   │
│    <span class="hljs-keyword">with</span> session tokens, mobile token refresh    │
│    was unreliable...                            │
│                                                 │
│  <span class="hljs-meta">#c9f1a6 [score: 0.68] memory/2026-03-20.md    │</span>
│  &gt; DB index optimization, added composite       │
│    index <span class="hljs-keyword">on</span> users table, query time dropped     │
│    <span class="hljs-keyword">from</span> <span class="hljs-number">800</span>ms to <span class="hljs-number">50</span>ms...                        │
│                                                 │
└─────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>各結果は関連性スコア、ソースファイル、200文字のプレビューを表示する。ほとんどのクエリはここで終了する。</p>
<h3 id="L2-Full-Context--Expand-a-Specific-Result" class="common-anchor-header">L2:フルコンテキスト - 特定の結果を展開する</h3><p>L1のプレビューだけでは不十分な場合、サブエージェントは<code translate="no">memsearch expand a3f8c1</code> 、完全なエントリーを引き出します：</p>
<pre><code translate="no">┌─ L2 expanded result ───────────────────────────┐
│                                                 │
│  <span class="hljs-comment">## 2026-03-28 Deploy troubleshooting           │</span>
│                                                 │
│  Redis port conflict resolution:                │
│  1. docker-compose up → Redis container failed  │
│  2. Host port 6379 occupied by another instance │
│  3. Changed docker-compose.yml: <span class="hljs-string">&quot;6380:6379&quot;</span>     │
│  4. Updated .<span class="hljs-built_in">env</span>: REDIS_PORT=6380               │
│  5. Updated config/database.py connection       │
│                                                 │
│  Note: Only affects <span class="hljs-built_in">local</span> dev. Prod unaffected. │
│                                                 │
│  [<span class="hljs-built_in">source</span>: memory/2026-03-28.md  lines: 42-55]  │
└─────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<h3 id="L3-Raw-Conversation-Transcript" class="common-anchor-header">L3: 生の会話記録</h3><p>何を言われたかを正確に確認する必要がある場合、サブエージェントはオリジナルのやり取りを取り出します：</p>
<pre><code translate="no">┌─ L3 raw transcript ───────────────────────────┐
│                                                │
│  [user] docker-compose up won&#x27;t start, Redis   │
│         port conflict — can you take a look?   │
│                                                │
│  [agent] Checking host port usage...           │
│          Running lsof -i :6379...              │
│          Suggest remapping to port 6380...     │
│          (tool_call: Bash &quot;lsof -i :6379&quot;)     │
│          (tool_call: Edit &quot;docker-compose.yml&quot;)│
│                                                │
│  [user] Done. Anything else to update?         │
│                                                │
│  [agent] Also need to update .env and          │
│          database.py...                        │
│                                                │
└────────────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>トランスクリプトは、あなたの正確な言葉、エージェントの正確な応答、すべてのツールコールのすべてを保存します。3つの段階は、軽いものから重いものまであり、サブエージェントがどの程度深く掘り下げるかを決定し、整理された結果をメインセッションに返します。</p>
<h2 id="How-Does-memsearch-Share-Memory-Across-AI-Coding-Agents" class="common-anchor-header">memsearchはどのようにAIコーディングエージェント間でメモリを共有するのか？<button data-href="#How-Does-memsearch-Share-Memory-Across-AI-Coding-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>これがmemsearchとClaude Codeのメモリの最も根本的なギャップだ。</p>
<p>クロードコードのメモリは一つのツールの中に閉じ込められている。OpenCode、OpenClaw、Codex CLIを使えば、ゼロから始めることになる。MEMORY.mdはローカルで、一人のユーザーと一人のエージェントに縛られています。</p>
<p>memsearchは4つのコーディングエージェントをサポートしている：Claude Code、OpenClaw、OpenCode、Codex CLIです。これらは同じMarkdownメモリーフォーマットと同じ<a href="https://milvus.io/docs/manage-collections.md">milvusコレクションを</a>共有しています。どのエージェントから書き込まれたメモリも、他のすべてのエージェントから検索可能です。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_code_memory_memsearch_md_5_6ed2e386b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>つの実際のシナリオ</strong></p>
<p><strong>ツールの切り替え</strong>あなたは、デプロイパイプラインを理解するためにクロードコードで午後を過ごし、いくつかの問題にぶつかりました。会話は自動要約され、インデックス化されます。翌日、OpenCodeに切り替えて、"昨日のポートの衝突はどうやって解決したんだっけ？"と質問する。OpenCodeはmemsearchを検索し、昨日のClaude Codeの記憶を見つけ、正しい答えを教えてくれる。</p>
<p><strong>チームコラボレーション。</strong>Milvusのバックエンドを<a href="https://cloud.zilliz.com/signup">Zilliz Cloudに</a>向けると、複数の開発者が異なるマシンで異なるエージェントを使い、同じプロジェクトのメモリを読み書きします。新しいチームメンバーが加わっても、Slackやドキュメントを何ヶ月も読み込む必要はありません。</p>
<h2 id="Developer-API" class="common-anchor-header">開発者API<button data-href="#Developer-API" class="anchor-icon" translate="no">
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
    </button></h2><p>独自の<a href="https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md">エージェントツールを</a>構築する場合、memsearch は CLI と Python API を提供します。</p>
<p><strong>CLI</strong></p>
<pre><code translate="no" class="language-bash"><span class="hljs-comment"># Index markdown files</span>
memsearch index ./memory

<span class="hljs-comment"># Search memories</span>
memsearch search <span class="hljs-string">&quot;Redis port conflict&quot;</span>

<span class="hljs-comment"># Expand a specific memory&#x27;s full content</span>
memsearch <span class="hljs-built_in">expand</span> a3f8c1

<span class="hljs-comment"># Watch for file changes, auto-index</span>
memsearch watch ./memory

<span class="hljs-comment"># Compact old memories</span>
memsearch compact
<button class="copy-code-btn"></button></code></pre>
<p><strong>Python API：</strong></p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> memsearch <span class="hljs-keyword">import</span> MemSearch

mem = MemSearch(paths=[<span class="hljs-string">&quot;./memory&quot;</span>])
<span class="hljs-keyword">await</span> mem.index()                          <span class="hljs-comment"># index markdown</span>
results = <span class="hljs-keyword">await</span> mem.search(<span class="hljs-string">&quot;Redis config&quot;</span>) <span class="hljs-comment"># hybrid search</span>
<span class="hljs-keyword">await</span> mem.compact()                        <span class="hljs-comment"># compact old memories</span>
<span class="hljs-keyword">await</span> mem.watch()                          <span class="hljs-comment"># auto-index on file change</span>
<button class="copy-code-btn"></button></code></pre>
<p>milvusはベクター検索を扱います。<a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>(設定不要)でローカルに実行するか、<a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>(無料ティアあり)を使ってコラボレーションするか、Dockerを使ってセルフホストする。<a href="https://milvus.io/docs/embeddings.md">エンベッディングの</a>デフォルトはONNX - CPUで動作し、GPUは不要。OpenAIやOllamaといつでも交換可能。</p>
<h2 id="Claude-Code-Memory-vs-memsearch-Full-Comparison" class="common-anchor-header">クロード・コード・メモリとmemsearchの比較：完全比較<button data-href="#Claude-Code-Memory-vs-memsearch-Full-Comparison" class="anchor-icon" translate="no">
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
<tr><th>特徴</th><th>クロードコードメモリ</th><th>memsearch</th></tr>
</thead>
<tbody>
<tr><td>何が保存されるか</td><td>クロードが重要視するもの</td><td>すべての会話を自動要約</td></tr>
<tr><td>ストレージの制限</td><td>~200行インデックス (~25 KB)</td><td>無制限（毎日のファイル＋ベクターインデックス）</td></tr>
<tr><td>古い記憶の検索</td><td>Grepキーワードマッチ</td><td>意味ベース＋キーワードのハイブリッド検索 (Milvus)</td></tr>
<tr><td>読めるか？</td><td>メモリフォルダを手動でチェック</td><td>任意の.mdファイルを開く</td></tr>
<tr><td>編集できるか？</td><td>手動でファイルを編集</td><td>同じ - 保存時に自動再インデックス</td></tr>
<tr><td>バージョン管理</td><td>設計されていない</td><td>gitはネイティブに動作する</td></tr>
<tr><td>クロスツールサポート</td><td>クロードコードのみ</td><td>4エージェント、共有メモリ</td></tr>
<tr><td>長期リコール</td><td>数週間で劣化</td><td>数ヶ月間持続</td></tr>
</tbody>
</table>
<h2 id="Get-Started-with-memsearch" class="common-anchor-header">memsearchを始めよう<button data-href="#Get-Started-with-memsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>クロード・コードの記憶には、自己懐疑的なデザイン、夢の統合コンセプト、KAIROSの15秒間のブロック予算など、本当の強みがある。Anthropicはこの問題について懸命に考えている。</p>
<p>しかし、単一ツールのメモリーには限界がある。ワークフローが複数のエージェント、複数の人々、あるいは数週間以上の履歴にまたがると、それ自体が存在するメモリが必要になる。</p>
<ul>
<li><a href="https://github.com/zilliztech/memsearch">memsearchを試して</a>みよう - オープンソース、MITライセンス。クロードコードに2つのコマンドでインストールできます。</li>
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">memsearchがどのように動作するかは</a>、<a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">Claude Codeプラグインガイドを</a>参照してください。</li>
<li>質問がありますか？<a href="https://discord.com/invite/8uyFbECzPX">MilvusのDiscordコミュニティーに</a>参加するか、<a href="https://milvus.io/office-hours">無料のオフィスアワーセッションをご予約</a>ください。</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">よくある質問<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="How-does-Claude-Codes-memory-system-work-under-the-hood" class="common-anchor-header">Claude Codeのメモリシステムはどのように動作しますか？</h3><p>Claude Codeは4層のメモリアーキテクチャを使用しており、全てローカルのMarkdownファイルとして保存されています。CLAUDE.mdはあなたが手動で書く静的ルールファイルです。Auto Memoryは、セッション中にClaude自身のメモを保存し、ユーザーの好み、フィードバック、プロジェクトのコンテキスト、参照ポインタの4つのカテゴリーに整理します。Auto Dreamは、バックグラウンドで古くなった記憶を統合する。KAIROSは、流出したソースコードから見つかった未発表の常時稼働デーモンである。システム全体の上限は200行のインデックスで、検索可能なのはキーワードの完全一致のみである。</p>
<h3 id="Can-AI-coding-agents-share-memory-across-different-tools" class="common-anchor-header">AIコーディング・エージェントは、異なるツール間でメモリを共有できるのか？</h3><p>ネイティブではない。クロード・コードのメモリはクロード・コードにロックされており、エクスポート・フォーマットやエージェント間のプロトコルはありません。memsearchは、<a href="https://zilliz.com/learn/what-is-vector-database">ベクターデータベース</a>（milvus）にインデックスされた日付入りのMarkdownファイルとしてメモリを保存することで、この問題を解決しています。サポートされている4つのエージェントは全て同じメモリストアを読み書きするため、ツールを切り替えてもコンテキストは自動的に移行します。</p>
<h3 id="What-is-the-difference-between-keyword-search-and-semantic-search-for-agent-memory" class="common-anchor-header">エージェントメモリのキーワード検索とセマンティック検索の違いは何ですか？</h3><p>キーワード検索(grep)は正確な文字列にマッチします - メモリに "docker-compose port mapping "と書かれていても、"port conflicts "と検索すると何も返されません。memsearchはハイブリッド検索で両方のアプローチを組み合わせ、1つのクエリで意味ベースのリコールと正確なキーワード精度を提供する。</p>
<h3 id="What-was-leaked-in-the-Claude-Code-source-code-incident" class="common-anchor-header">クロード・コードのソースコード流出事件で何が流出したのか？</h3><p>クロードコードのバージョン2.1.88は、59.8MBのソースマップファイルと共に出荷されました。このファイルには、完全なメモリシステムの実装、Auto Dreamのコンソリデーション処理、未発表の常時稼働エージェントモードであるKAIROSへのリファレンスを含む、約512,000行に及ぶ可読のTypeScriptコードベースが含まれていた。このコードは、削除される前にすぐにGitHubにミラーされた。</p>
