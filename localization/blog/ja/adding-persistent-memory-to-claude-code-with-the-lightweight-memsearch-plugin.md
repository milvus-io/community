---
id: >-
  adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md
title: Lightweight memsearchプラグインでクロードコードに永続メモリを追加する
author: Cheney Zhang
date: 2026-02-13T00:00:00.000Z
cover: assets.zilliz.com/blog_cover_memsearch_ccplugin_43b5ecfd6f.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'OpenClaw, vector search, Milvus, Claude Code'
meta_keywords: >-
  Claude Code memory, Claude Code plugin, persistent memory, ccplugin, long-term
  memory AI
meta_title: |
  Persistent Memory for Claude Code: memsearch ccplugin
desc: >-
  memsearch ccpluginでClaude
  Codeに長期記憶を。軽量で透過的なMarkdownストレージ、自動セマンティック検索、ゼロトークンオーバーヘッド。
origin: >-
  https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md
---
<p><a href="https://github.com/zilliztech/memsearch">memsearchは</a>スタンドアローンでプラグアンドプレイの長期メモリライブラリで、どんなエージェントにも永続的で透過的で人間が編集可能なメモリを提供します。このライブラリは、OpenClawと同じメモリアーキテクチャを使用しています。つまり、どのようなエージェントフレームワーク（Claude、GPT、Llama、カスタムエージェント、ワークフローエンジン）にもドロップすることができ、耐久性があり、クエリ可能なメモリを即座に追加することができます。<em>(memsearchがどのように機能するか深く知りたい場合は、</em> <a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md"><em>別の投稿をこちらに書いて</em></a><em>います)。</em></p>
<p>ほとんどのエージェントワークフローでは、memsearchは意図したとおりに動作します。しかし、<strong>エージェントのコーディングは</strong>別の話だ。コーディングセッションは長く、コンテキストの切り替えは絶えず、保持する価値のある情報は数日から数週間にわたって蓄積される。その膨大な量と揮発性は、典型的なエージェントの記憶システム（memsearchを含む）の弱点を露呈する。コーディングのシナリオでは、検索パターンが十分に異なるため、既存のツールをそのまま再利用することはできませんでした。</p>
<p>これに対処するために、私たちは<strong>Claude Codeのために特別に設計された永続メモリプラグインを</strong>構築した。これは memsearch CLI の上に乗るもので、<strong>memsearch ccplugin</strong> と呼んでいる。</p>
<ul>
<li>GitHub Repo:<a href="https://github.com/zilliztech/memsearch"></a><a href="https://zilliztech.github.io/memsearch/claude-plugin/">https://zilliztech.github.io/memsearch/claude-plugin/</a> <em>(オープンソース、MITライセンス)</em></li>
</ul>
<p>軽量な<strong>memsearch ccpluginが</strong>裏でメモリを管理することで、Claude Codeは全ての会話、全ての決定、全てのスタイルの好み、全ての複数日のスレッドを記憶する能力を得る。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_plugin_diagram_41563f84dd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>この投稿では、わかりやすくするために「ccplugin」は上位レイヤー、つまりClaude Codeプラグインそのものを指す。「memsearch」は下位レイヤー、つまりその下のスタンドアロンCLIツールを指す。</em></p>
<p>では、なぜコーディングに独自のプラグインが必要なのだろうか？それは、あなたがほぼ間違いなくぶつかったことのある2つの問題に行き着く：Claude Codeには永続的なメモリがないこと、そしてclaude-memのような既存のソリューションの不便さと複雑さだ。</p>
<p>では、なぜ専用のプラグインを作るのでしょうか？なぜなら、コーディングエージェントは、ほぼ間違いなくあなた自身が経験したことのある2つの痛みにぶつかるからです：</p>
<ul>
<li><p>クロードコードには永続的なメモリがない。</p></li>
<li><p><em>claude-memの</em>ような既存のコミュニティ・ソリューションの多くは強力ですが、日々のコーディング作業には重く、不便で、複雑すぎます。</p></li>
</ul>
<p>ccプラグインは、memsearchの上に最小限の透明で開発者に優しいレイヤーを置くことで、両方の問題を解決することを目指しています。</p>
<h2 id="Claude-Codes-Memory-Problem-It-Forgets-Everything-When-a-Session-Ends" class="common-anchor-header">クロード・コードのメモリ問題：セッションが終了するとすべてを忘れてしまう<button data-href="#Claude-Codes-Memory-Problem-It-Forgets-Everything-When-a-Session-Ends" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Codeユーザーが間違いなく遭遇するシナリオから始めましょう。</p>
<p>朝、Claude Codeを開きます。「昨日の認証のリファクタリングを続けてください。クロードは答える："昨日は何をやっていたんですか？"あなたはそれから10分間、昨日のログをコピーペーストしていた。大した問題ではないが、あまりに頻繁に現れるのですぐにイライラする。</p>
<p>クロードコードには独自のメモリーメカニズムがあるとはいえ、満足のいくものにはほど遠い。<code translate="no">CLAUDE.md</code> ファイルはプロジェクトのディレクティブとプリファレンスを保存できるが、静的なルールと短いコマンドに適しており、長期的な知識を蓄積するのには適していない。</p>
<p>Claude Codeは<code translate="no">resume</code> と<code translate="no">fork</code> コマンドを提供しているが、使いやすいとは言い難い。フォークコマンドの場合、セッションIDを記憶し、手動でコマンドを入力し、分岐する会話履歴のツリーを管理する必要がある。<code translate="no">/resume</code> を実行すると、セッションのタイトルが壁一面に表示される。数日以上前のことで、何をしたかの詳細を少ししか覚えていない場合、正しいものを見つけるのは難しいでしょう。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_snippet_82ec01cc5e.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>長期にわたる、プロジェクト横断的な知識の蓄積のためには、このアプローチ全体が不可能なのだ。</p>
<p>この考えを実現するために、claude-memは3層の記憶システムを使う。第一階層は高レベルの要約を検索する。第2階層は、より詳細なタイムラインを検索する。第3層は、生の会話のために完全な観察を引き出す。その上、プライバシー・ラベル、コスト追跡、ウェブ視覚化インターフェイスがある。</p>
<p>以下はその仕組みである：</p>
<ul>
<li><p><strong>ランタイム層。</strong>Node.jsのWorkerサービスがポート37777で実行される。セッション・メタデータは軽量のSQLiteデータベースに保存される。ベクター・データベースは、メモリ・コンテンツに対する正確な意味検索を処理する。</p></li>
<li><p><strong>インタラクションレイヤー。</strong>ReactベースのウェブUIにより、キャプチャされた記憶をリアルタイムで見ることができる：サマリー、タイムライン、生の記録。</p></li>
<li><p><strong>インターフェースレイヤー。</strong>MCP（Model Context Protocol）サーバーは、標準化されたツールインターフェースを公開します。クロードは、<code translate="no">search</code> （ハイレベルのサマリーを照会）、<code translate="no">timeline</code> （詳細なタイムラインを表示）、<code translate="no">get_observations</code> （生のインタラクション記録を取得）を呼び出して、記憶を直接取得し、使用することができる。</p></li>
</ul>
<p>公正を期すために、これはクロード・コードのメモリー問題を解決する堅実な製品である。しかし、毎日使うには不便で複雑だ。</p>
<table>
<thead>
<tr><th>レイヤー</th><th>テクノロジー</th></tr>
</thead>
<tbody>
<tr><td>言語</td><td>TypeScript (ES2022、ESNextモジュール)</td></tr>
<tr><td>ランタイム</td><td>Node.js 18+</td></tr>
<tr><td>データベース</td><td>SQLite 3とbun:sqliteドライバ</td></tr>
<tr><td>ベクターストア</td><td>ChromaDB（オプション、セマンティック検索用）</td></tr>
<tr><td>HTTPサーバー</td><td>Express.js 4.18</td></tr>
<tr><td>リアルタイム</td><td>サーバー送信イベント（SSE）</td></tr>
<tr><td>UIフレームワーク</td><td>リアクト＋タイプスクリプト</td></tr>
<tr><td>AI SDK</td><td>anthropic-ai/claude-エージェント-SDK</td></tr>
<tr><td>ビルドツール</td><td>esbuild（TypeScriptをバンドル）</td></tr>
<tr><td>プロセスマネージャ</td><td>Bun</td></tr>
<tr><td>テスト</td><td>Node.js組み込みテスト・ランナー</td></tr>
</tbody>
</table>
<p><strong>まず、セットアップが大変だ。</strong>claude-memを動かすには、Node.js、Bun、MCPランタイムをインストールし、その上にWorkerサービス、Expressサーバー、React UI、SQLite、ベクターストアを立ち上げる必要がある。デプロイし、メンテナンスし、何かが壊れたときにデバッグするには、多くの可動部品が必要だ。</p>
<p><strong>これらのコンポーネントはすべて、あなたが使うように頼んでいないトークンも消費する。</strong>MCPのツール定義はクロードのコンテキストウィンドウに永久にロードされ、ツールの呼び出しはリクエストとレスポンスでトークンを消費する。長時間のセッションになると、このオーバーヘッドはすぐに蓄積され、トークンのコストを制御できなくなります。</p>
<p><strong>メモリーリコールが信頼できないのは、クロードが検索を選ぶかどうかに完全に依存しているからだ。</strong>クロードは、検索のトリガーとなる<code translate="no">search</code> のようなツールを呼び出すことを自分で決めなければならない。もしメモリーが必要だと気づかなければ、関連するコンテンツは表示されない。また、3つのメモリ階層はそれぞれ、明示的なツールの呼び出しを必要とするため、クロードが検索を思いつかなかった場合のフォールバックがない。</p>
<p><strong>最後に、データストレージは不透明で、デバッグやマイグレーションを不愉快なものにする。</strong>メモリはセッション・メタデータ用のSQLiteとバイナリー・ベクター・データ用のChromaに分かれており、それらを結びつけるオープン・フォーマットはない。マイグレーションは、エクスポートスクリプトを書くことを意味する。AIが実際に何を記憶しているかを見るには、ウェブUIか専用のクエリーインターフェースを使うことになる。生のデータを見る方法はない。</p>
<h2 id="Why-the-memsearch-Plugin-for-Claude-Code-is-Better" class="common-anchor-header">クロード・コードのmemsearchプラグインが優れている理由<button data-href="#Why-the-memsearch-Plugin-for-Claude-Code-is-Better" class="anchor-icon" translate="no">
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
    </button></h2><p>私たちは、余分なサービスや複雑なアーキテクチャ、運用上のオーバーヘッドがない、真に軽量なメモリーレイヤーを求めていました。それが<strong>memsearch ccpluginを</strong>作ろうと思った動機だ。その核心は、<em>コーディングに特化したメモリー・システムを根本的にシンプルにできるかという</em>実験だった。</p>
<p>我々はそれを証明した。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_icon_d68365006a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>ccplugin全体は4つのシェル・フックとバックグラウンドのウォッチ・プロセスだ。Node.jsもMCPサーバーもウェブUIもない。シェルスクリプトがmemsearch CLIを呼び出すだけなので、セットアップやメンテナンスのハードルは劇的に下がる。</p>
<p>ccpluginがここまで薄くできるのは、厳格な責任の境界があるからだ。メモリ・ストレージ、ベクター検索、テキスト埋め込みは扱わない。それらはすべてmemsearch CLIの下に委ねられている。ccpluginの仕事はただ一つ、Claude Codeのライフサイクルイベント（セッション開始、プロンプト送信、レスポンス停止、セッション終了）を対応するmemsearch CLI関数に橋渡しすることだ。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_2_6b2dbeaaf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>この分離された設計により、システムはClaude Codeを超える柔軟性を持っています。memsearch CLIは、他のIDEや他のエージェントフレームワーク、あるいは単なる手動呼び出しとも独立して動作します。単一のユースケースに縛られることはない。</p>
<p>実際には、この設計は3つの重要な利点をもたらします。</p>
<h3 id="1-All-Memories-Live-in-Plain-Markdown-Files" class="common-anchor-header">1.すべてのメモリはプレーンなMarkdownファイルに保存される</h3><p>ccpluginが作成するすべてのメモリは、<code translate="no">.memsearch/memory/</code> 、Markdownファイルとして保存されます。</p>
<pre><code translate="no">.memsearch/memory/
├── 2026-02-09.md
├── 2026-02-10.md
└── 2026-02-11.md
<button class="copy-code-btn"></button></code></pre>
<p>1日1ファイルです。各ファイルには、その日のセッションの要約が、人間が完全に読めるプレーンテキストで含まれています。以下は、memsearchプロジェクトにある毎日の記憶ファイルのスクリーンショットである：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/markdown_file_d0ab53e13b.jpeg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>タイムスタンプ、セッションID、ターンID、そしてセッションの要約である。何も隠されていない。</p>
<p>AIが何を記憶しているか知りたい？Markdownファイルを開いてください。メモリーを編集したい？テキストエディタを使ってください。データを移行したいですか？<code translate="no">.memsearch/memory/</code> フォルダーをコピーしてください。</p>
<p><a href="https://milvus.io/">Milvus</a>ベクトルインデックスはセマンティック検索を高速化するためのキャッシュです。いつでもMarkdownから再構築されます。不透明なデータベースやバイナリーブラックボックスはありません。すべてのデータは追跡可能で、完全に再構築可能です。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_index_workflow_e8de4628da.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Automatic-Context-Injection-Costs-Zero-Extra-Tokens" class="common-anchor-header">2.自動コンテキスト・インジェクションはトークンの追加コストゼロ</h3><p>透明なストレージは、このシステムの基盤です。そしてccpluginでは、記憶の呼び出しは完全に自動化されている。</p>
<p>プロンプトが送信されるたびに、<code translate="no">UserPromptSubmit</code> フックが意味検索を行い、関連する上位3つの記憶をコンテキストに注入します。クロードは検索するかどうかを決めない。ただ文脈を得るだけだ。</p>
<p>このプロセスの間、クロードはMCPツール定義を見ることはないので、余計なものは何もコンテキストウィンドウを占めない。フックはCLIレイヤーで実行され、プレーンテキストの検索結果を注入する。IPCのオーバーヘッドも、ツールコール・トークンのコストもない。MCPツール定義につきもののコンテキスト・ウィンドウの肥大化は完全に解消された。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/diagram_3_b9e8391c2a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>自動トップ3だけでは十分でない場合のために、3段階のプログレッシブ検索も構築した。この3つはすべてCLIコマンドであり、MCPツールではない。</p>
<ul>
<li><p><strong>L1（自動）：</strong>すべてのプロンプトは、<code translate="no">chunk_hash</code> 、200文字のプレビュー付きで、セマンティック検索結果のトップ3を返す。日常的な使用はほとんどこれでカバーできる。</p></li>
<li><p><strong>L2（オンデマンド）：</strong>完全な文脈が必要な場合、<code translate="no">memsearch expand &lt;chunk_hash&gt;</code> 、完全なMarkdownセクションとメタデータを返します。</p></li>
<li><p><strong>L3（ディープ）：</strong>オリジナルの会話が必要な場合、<code translate="no">memsearch transcript &lt;jsonl_path&gt; --turn &lt;uuid&gt;</code> 、Claude Codeから生のJSONLレコードを取り出します。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_4_ccc495d5ac.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/memsearch_diagram_5_0333650103.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Session-Summaries-Are-Generated-in-the-Background-at-Near-Zero-Cost" class="common-anchor-header">3.セッション要約はバックグラウンドでほぼゼロコストで生成される</h3><p>検索は、記憶がどのように使われるかをカバーする。しかし、記憶は最初に書かれなければならない。これらのMarkdownファイルはどのようにして作成されるのでしょうか？</p>
<p>ccpluginは、非同期で実行されるバックグラウンド・パイプラインを通してそれらを生成し、コストはほとんどかかりません。Claudeのレスポンスを停止するたびに、<code translate="no">Stop</code> フックが起動します。会話のトランスクリプトを解析し、Claude Haiku (<code translate="no">claude -p --model haiku</code>) を呼び出して要約を生成し、その日のMarkdownファイルに追加します。HaikuのAPIコールは非常に安価で、1回の呼び出しはほとんど無視できる。</p>
<p>そこから、ウォッチ・プロセスがファイルの変更を検出し、自動的に新しいコンテンツをMilvusにインデックス付けし、すぐに検索できるようにする。すべてのフローはバックグラウンドで実行されるため、作業を中断することなく、コストを抑えることができる。</p>
<h2 id="Quickstart-memsearch-plugin-with-Claude-Code" class="common-anchor-header">Claude Codeを使ったmemsearchプラグインのクイックスタート<button data-href="#Quickstart-memsearch-plugin-with-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="First-install-from-the-Claude-Code-plugin-marketplace" class="common-anchor-header">まず、Claude Codeプラグインマーケットプレイスからインストールします：</h3><pre><code translate="no">
bash
<span class="hljs-comment"># Run in Claude Code terminal</span>
/plugin marketplace add zilliztech/memsearch
/plugin install memsearch
<button class="copy-code-btn"></button></code></pre>
<h3 id="Second-restart-Claude-Code" class="common-anchor-header">次に、Claude Code を再起動します。</h3><p>プラグインは自動的に設定を初期化します。</p>
<h3 id="Third-after-a-conversation-check-the-days-memory-file" class="common-anchor-header">第三に、会話の後、その日のメモリーファイルをチェックします：</h3><pre><code translate="no">bash
<span class="hljs-built_in">cat</span> .memsearch/memory/$(<span class="hljs-built_in">date</span> +%Y-%m-%d).md
<button class="copy-code-btn"></button></code></pre>
<h3 id="Fourth-enjoy" class="common-anchor-header">第四に、楽しむ。</h3><p>次にClaude Codeを起動すると、システムが自動的に関連する記憶を検索し、注入します。余計な手順は必要ありません。</p>
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
    </button></h2><p>元の質問に戻ろう：AIに永続的な記憶を与えるにはどうすればいいか？ claude-memとmemsearch ccpluginはそれぞれ異なるアプローチをとり、それぞれ異なる強みを持つ。私たちは、両者を選択するための簡単なガイドをまとめた：</p>
<table>
<thead>
<tr><th>カテゴリー</th><th>memsearch</th><th>クロード・メム</th></tr>
</thead>
<tbody>
<tr><td>アーキテクチャ</td><td>4つのシェルフック + 1つのウォッチプロセス</td><td>Node.js Worker + Express + React UI</td></tr>
<tr><td>統合方法</td><td>ネイティブフック + CLI</td><td>MCPサーバー（stdio）</td></tr>
<tr><td>リコール</td><td>自動（フックインジェクション）</td><td>エージェント駆動（ツールの起動が必要）</td></tr>
<tr><td>コンテキスト消費</td><td>ゼロ（結果テキストのみ注入）</td><td>MCPツール定義の持続</td></tr>
<tr><td>セッション要約</td><td>1回の非同期Haiku CLI呼び出し</td><td>複数のAPI呼び出し＋観測圧縮</td></tr>
<tr><td>保存形式</td><td>プレーンなMarkdownファイル</td><td>SQLite + Chromaエンベッディング</td></tr>
<tr><td>データ移行</td><td>プレーンなMarkdownファイル</td><td>SQLite + Chromaエンベッディング</td></tr>
<tr><td>移行方法</td><td>.mdファイルのコピー</td><td>データベースからのエクスポート</td></tr>
<tr><td>ランタイム</td><td>Python + Claude CLI</td><td>Node.js + Bun + MCPランタイム</td></tr>
</tbody>
</table>
<p>claude-memはより豊富な機能、洗練されたUI、より細かい制御を提供する。コラボレーション、ウェブ可視化、詳細なメモリ管理を必要とするチームにとって、強力な選択肢となるだろう。</p>
<p>memsearch ccpluginは、最小限のデザイン、コンテキストウィンドウのオーバーヘッドゼロ、完全に透過的なストレージを提供する。複雑な機能を追加することなく、軽量なメモリレイヤーを求めるエンジニアにとっては、こちらの方が適している。どちらが優れているかは、あなたが何を必要としているかによって異なります。</p>
<p>memsearchやmilvusをもっと深く知りたいですか？</p>
<ul>
<li><p><a href="https://milvus.io/slack">MilvusのSlackコミュニティに</a>参加して、他の開発者とつながり、あなたが作っているものを共有しましょう。</p></li>
<li><p><a href="https://milvus.io/office-hours">Milvusオフィスアワーを予約して、</a>ライブQ&amp;Aやチームからの直接サポートを受けましょう。</p></li>
</ul>
<h2 id="Resources" class="common-anchor-header">リソース<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p><strong>memsearch ccplugin ドキュメント</strong> <a href="https://zilliztech.github.io/memsearch/claude-plugin/">: https://zilliztech.github.io/memsearch/claude-plugin/</a></p></li>
<li><p><strong>GitHub:</strong> <a href="https://github.com/zilliztech/memsearch/tree/main/ccplugin">https://github.com/zilliztech/memsearch/tree/main/ccplugin</a></p></li>
<li><p><strong>memsearch プロジェクト</strong> <a href="https://github.com/zilliztech/memsearch">: https://github.com/zilliztech/memsearch</a></p></li>
<li><p>ブログ<a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">OpenClaw のメモリシステムを抽出してオープンソース化した (memsearch)</a></p></li>
<li><p>ブログ<a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw とは？オープンソースAIエージェントの完全ガイド</a></p></li>
<li><p>ブログ<a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">OpenClawチュートリアル：ローカルAIアシスタントのためのSlackへの接続</a></p></li>
</ul>
