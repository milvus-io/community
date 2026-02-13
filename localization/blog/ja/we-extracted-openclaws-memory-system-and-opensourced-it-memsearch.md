---
id: we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md
title: OpenClawのメモリシステムを抽出し、オープンソース化した（memsearch）
author: Cheney Zhang
date: 2026-02-13T00:00:00.000Z
cover: assets.zilliz.com/memsearch_openclaw_memory_11zon_b2a6b4cbb9.jpg
tag: Engineering
recommend: true
publishToMedium: true
tags: 'OpenClaw, AI agent memory, vector search, Milvus'
meta_keywords: >-
  OpenClaw, AI agent memory, persistent memory, Python, vector search, Milvus,
  memsearch
meta_title: |
  We Extracted OpenClaw’s Memory System and Open-Sourced It (memsearch)
desc: >-
  私たちはOpenClawのAIメモリー・アーキテクチャを、Markdownログ、ハイブリッド・ベクトル検索、Gitサポートを備えたスタンドアローンのPythonライブラリーであるmemsearchに抽出しました。
origin: >-
  https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md
---
<p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClaw</a>（以前のclawdbotとmoltbot）はバイラルになりつつある - 2週間足らずで<a href="https://github.com/openclaw/openclaw">189k以上のGitHubスター。</a>これは正気の沙汰ではない。話題のほとんどは、iMessages、WhatsApp、Slack、Telegramなど、日常的なチャット・チャンネルにおける自律的なエージェント機能に関するものだ。</p>
<p>しかし、ベクター・データベース・システムに取り組むエンジニアとして、私たちが本当に注目したのは、<strong>OpenClawの長期記憶へのアプローチ</strong>だった。世の中にある多くの記憶システムとは異なり、OpenClawはAIに日々のログをMarkdownファイルとして自動的に書き込ませている。これらのファイルは真実のソースであり、モデルはディスクに書き込まれたものだけを「記憶」する。人間の開発者は、これらのマークダウン・ファイルを開き、直接編集し、長期的な原則を抽出し、AIがどの時点で何を記憶しているかを正確に見ることができる。ブラックボックスもない。正直なところ、これは我々が見た中で最もクリーンで開発者に優しいメモリー・アーキテクチャのひとつだ。</p>
<p><strong><em>なぜOpenClawの中でしか使えないのか？どのエージェントでもこのようなメモリを持つことができるとしたらどうでしょう？</em></strong>私たちはOpenClawから正確なメモリアーキテクチャを取り出し、<a href="https://github.com/zilliztech/memsearch">memsearchを</a>構築しました。<a href="https://github.com/zilliztech/memsearch">memsearchは</a>スタンドアロンでプラグアンドプレイの長期メモリライブラリで、どのエージェントにも永続的で透過的な、人間が編集可能なメモリを提供します。OpenClawの他の部分への依存はありません。memsearchを入れるだけで、エージェントはMilvus/Zilliz Cloudによる検索と、Markdownのログによる永続的な記憶を手に入れることができます。</p>
<iframe width="997" height="561" src="https://www.youtube.com/embed/VRzqRVFm39s" title="MemSearch: OpenClaw's long-term memory" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<ul>
<li><p><strong>GitHub Repo:</strong> <a href="https://github.com/zilliztech/memsearch">github.com/zilliztech/memsearch</a>(オープンソース、MITライセンス)</p></li>
<li><p><strong>ドキュメント</strong> <a href="https://zilliztech.github.io/memsearch/">: https://zilliztech.github.io/memsearch/</a></p></li>
<li><p><strong>クロードコードプラグイン</strong> <a href="https://zilliztech.github.io/memsearch/claude-plugin/">：https://zilliztech.github.io/memsearch/claude-plugin/</a></p></li>
</ul>
<h2 id="What-Makes-OpenClaws-Memory-Different" class="common-anchor-header">OpenClaw のメモリの特徴<button data-href="#What-Makes-OpenClaws-Memory-Different" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenClawのメモリアーキテクチャに飛び込む前に、<strong>コンテキストと</strong> <strong>メモリという</strong>2つの概念を整理しておこう。この2つは似ているように聞こえますが、実際の動作は大きく異なります。</p>
<ul>
<li><p><strong>コンテキストとは</strong>、エージェントが1つのリクエストで見るすべてのもの、つまりシステムプロンプト、<code translate="no">AGENTS.md</code> や<code translate="no">SOUL.md</code> のようなプロジェクトレベルのガイダンスファイル、会話履歴（メッセージ、ツールコール、圧縮されたサマリー）、そしてユーザーの現在のメッセージです。これは1つのセッションにスコープされ、比較的コンパクトです。</p></li>
<li><p><strong>メモリーは</strong>、セッションをまたいで持続するものです。過去の会話履歴、エージェントが扱ったファイル、ユーザー設定などです。要約されていません。圧縮されていません。生のものです。</p></li>
</ul>
<p>ここで、OpenClawのアプローチを特別なものにしている設計上の決定があります：<strong>すべてのメモリは、ローカルファイルシステム上のプレーンなMarkdownファイルとして保存されます。</strong>各セッションの後、AIは自動的にこれらのMarkdownログに更新を書き込む。あなたは、そしてどんな開発者でも、それらを開き、編集し、再編成し、削除し、洗練させることができる。一方、ベクター・データベースはこのシステムと並行して、検索のためのインデックスを作成し、維持する。Markdownファイルが変更されると、システムはその変更を検出し、自動的にインデックスを作成し直します。</p>
<p>Mem0やZepのようなツールを使ったことがある人なら、すぐに違いに気づくだろう。これらのシステムは、記憶をエンベッディングとして保存します。エージェントが記憶しているものを読むことはできない。行を編集することで悪い記憶を修正することもできない。OpenClawのアプローチは、プレーンなファイルの透明<strong>性と、</strong>ベクターデータベースを使ったベクター検索の検索力の両方を提供します。読むことも、<code translate="no">git diff</code> 、grepすることもできる。単なるファイルだ。</p>
<p>唯一の欠点は？今現在、このMarkdownファーストのメモリシステムはOpenClawのエコシステム（Gatewayプロセス、プラットフォームコネクタ、ワークスペース設定、メッセージングインフラストラクチャ）と密接に絡み合っています。メモリモデルだけが欲しいのであれば、それは多くの機械を引きずり込むことになる。</p>
<p><a href="http://github.com/zilliztech/memsearch"><strong>memsearchを</strong></a>開発した理由はまさにそこにあります。真実のソースとしてのMarkdown、自動ベクターインデキシング、完全に人間が編集可能という同じ哲学を持ちながら、軽量でスタンドアローンのライブラリとして提供され、どんなエージェントアーキテクチャにもドロップすることができます。</p>
<h2 id="How-Memsearch-Works" class="common-anchor-header">memsearchの仕組み<button data-href="#How-Memsearch-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>前述したように、<a href="https://github.com/zilliztech/memsearch">memsearchは</a>完全に独立した長期メモリライブラリで、OpenClawで使用されているのと同じメモリアーキテクチャを実装しています。どんなエージェントフレームワーク（Claude、GPT、Llama、カスタムエージェント、ワークフローエンジン）にもプラグインすることができます。</p>
<p>memsearchの全てのエージェントメモリは、ローカルディレクトリにプレーンテキストのMarkdownとして保存されます。開発者が一目で理解できるように、意図的にシンプルな構造になっています：</p>
<pre><code translate="no">~/your-project/
└── memory/
    ├── MEMORY.md              <span class="hljs-comment"># Hand-written long-term memory</span>
    ├── 2026-02-09.md          <span class="hljs-comment"># Today&#x27;s work log</span>
    ├── 2026-02-08.md
    └── 2026-02-07.md
<button class="copy-code-btn"></button></code></pre>
<p>memsearchは<a href="https://milvus.io/"><strong>Milvusを</strong></a>ベクトルデータベースとして使用し、これらのMarkdownファイルにインデックスを付け、高速な意味検索を行います。MemsearchはMilvusをベクトル・データベースとして使用し、Markdownファイルのインデックスを作成します。Milvusインデックスを完全に削除しても、<strong>何も失うものはない。</strong>Memsearchは単純にMarkdownファイルを再インデックス化し、数分で完全な検索レイヤーを再構築する。これは、エージェントのメモリが透過的で、耐久性があり、完全に再構築可能であることを意味します。</p>
<p>以下はmemsearchのコア機能です：</p>
<h3 id="Readable-Markdown-Makes-Debugging-as-Simple-as-Editing-a-File" class="common-anchor-header">読み取り可能なマークダウンにより、デバッグはファイルを編集するのと同じくらい簡単になります。</h3><p>AIの記憶のデバッグは、通常痛みを伴います。エージェントが間違った答えを出したとき、ほとんどの記憶システムでは、実際に<em>何が</em>記憶されているのかを確認する明確な方法がありません。典型的なワークフローは、メモリAPIをクエリするためにカスタムコードを書き、不透明なエンベッディングや冗長なJSONブロブをふるいにかけることです。</p>
<p><strong>memsearchは、このような問題をすべて解決してくれる。</strong>すべての記憶は、プレーンなMarkdownとしてmemory/フォルダに保存される：</p>
<pre><code translate="no" class="language-markdown"><span class="hljs-meta">## Morning</span>
- Fixed N+<span class="hljs-number">1</span> query issue — <span class="hljs-function">switched to <span class="hljs-title">selectinload</span>()
- Query count dropped <span class="hljs-keyword">from</span> 152 to 3
</span><button class="copy-code-btn"></button></code></pre>
<p>AIが何か間違いを犯した場合、それを修正するのはファイルを編集するのと同じくらい簡単だ。エントリーを更新し、保存すれば、memsearchは自動的にその変更を再インデックス化する。5秒。API呼び出しなし。ツールもない。謎もない。AIメモリのデバッグは、ドキュメントのデバッグと同じように、ファイルを編集することで行う。</p>
<h3 id="Git-Backed-Memory-Means-Teams-Can-Track-Review-and-Roll-Back-Changes" class="common-anchor-header">Gitでバックアップされたメモリは、チームによる変更の追跡、レビュー、ロールバックを可能にします。</h3><p>データベースに保存されたAIメモリは、共同作業が難しい。誰がいつ何を変更したかを把握するには、監査ログを調べなければならず、多くのソリューションでは監査ログすら提供されていない。変更は無言で行われ、AIが記憶すべき内容についての意見の相違は、明確な解決策を持たない。チームは結局、Slackのメッセージや推測に頼ることになる。</p>
<p>Memsearchは、メモリーを単なるMarkdownファイルにすることで、この問題を解決する。つまり、Gitが自動的にバージョン管理を行うのだ：</p>
<pre><code translate="no" class="language-bash">git <span class="hljs-built_in">log</span> memory/MEMORY.md
git diff HEAD~1 memory/2026-02-09.md
<button class="copy-code-btn"></button></code></pre>
<p>今やAIメモリはコードと同じワークフローに参加している。アーキテクチャの決定、設定の更新、環境設定の変更はすべて差分として表示され、誰でもコメント、承認、差し戻しができる：</p>
<pre><code translate="no" class="language-diff">+ <span class="hljs-meta">## Architecture Decision</span>
+ - Use Kafka <span class="hljs-keyword">for</span> <span class="hljs-keyword">event</span> bus instead of RabbitMQ
+ - Reason: better horizontal scaling
<button class="copy-code-btn"></button></code></pre>
<h3 id="Plaintext-Memory-Makes-Migration-Nearly-Effortless" class="common-anchor-header">プレーンテキスト・メモリーにより、移行がほぼ容易に</h3><p>移行は、メモリフレームワークの隠れた最大のコストの1つである。あるツールから別のツールへの移行は通常、データのエクスポート、フォーマットの変換、再インポート、フィールドの互換性を期待することを意味する。このような作業は半日を費やすこともあり、結果は保証されていない。</p>
<p>memsearchは、メモリがプレーンテキストのMarkdownであるため、この問題を完全に回避することができる。独自のフォーマットも、翻訳するスキーマも、移行するものもない：</p>
<ul>
<li><p><strong>マシンを切り替える：</strong> <code translate="no">rsync</code> メモリフォルダ。完了。</p></li>
<li><p><strong>埋め込みモデルを切り替える：</strong>indexコマンドを再実行。5分かかるが、マークダウンファイルはそのまま。</p></li>
<li><p><strong>ベクターデータベースのデプロイを切り替える：</strong>設定値を1つ変更する。例えば、開発環境のMilvus Liteから本番環境のZilliz Cloudへ：</p></li>
</ul>
<pre><code translate="no" class="language-python"><span class="hljs-meta"># Development</span>
ms = MemSearch(milvus_uri=<span class="hljs-string">&quot;~/.memsearch/milvus.db&quot;</span>)

<span class="hljs-meta"># Production (change only this <span class="hljs-keyword">line</span>)</span>
ms = MemSearch(milvus_uri=<span class="hljs-string">&quot;https://xxx.zillizcloud.com&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>メモリファイルは全く同じままです。周りのインフラは自由に進化させることができます。その結果、AIシステムには珍しい長期的な移植性が実現します。</p>
<h3 id="Shared-Markdown-Files-Let-Humans-and-Agents-Co-Author-Memory" class="common-anchor-header">共有されたMarkdownファイルにより、人間とエージェントが共同でメモリーを作成できます。</h3><p>ほとんどのメモリ・ソリューションでは、AIが記憶する内容を編集するには、APIに対してコードを書く必要がある。つまり、開発者だけがAIのメモリを管理することができ、開発者にとっても面倒なのだ。</p>
<p>Memsearchは、より自然な責任分担を可能にする：</p>
<ul>
<li><p><strong>AIが処理する：</strong>デプロイされたv2.3.1、12％のパフォーマンス向上 "のような実行の詳細を含む自動デイリーログ(<code translate="no">YYYY-MM-DD.md</code>)。</p></li>
<li><p><strong>人間が処理する：</strong> <code translate="no">MEMORY.md</code> 、「チームスタック」のような長期的な原則：Python + FastAPI + PostgreSQL"。</p></li>
</ul>
<p>双方が同じMarkdownファイルを、すでに使っているツールで編集する。APIコールも、特別なツールも、ゲートキーパーもない。メモリがデータベース内にロックされている場合、このような共有オーサーシップは不可能である。</p>
<h2 id="Under-the-Hood-memsearch-Runs-on-Four-Workflows-That-Keep-Memory-Fast-Fresh-and-Lean" class="common-anchor-header">アンダー・ザ・フッド：memsearchは4つのワークフローで実行され、メモリを速く、新鮮で、無駄のない状態に保つ。<button data-href="#Under-the-Hood-memsearch-Runs-on-Four-Workflows-That-Keep-Memory-Fast-Fresh-and-Lean" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ms1_c855cb19a5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>memsearch には4つのコアワークフローがある：<strong>ウォッチ</strong>（監視）→<strong>インデックス</strong>（チャンクと埋め込み）→<strong>サーチ</strong>（検索）→<strong>コンパクト</strong>（要約）。それぞれが何をするのかを説明しよう。</p>
<h3 id="1-Watch-Automatically-Re-Index-on-Every-File-Save" class="common-anchor-header">1.ウォッチ：ファイル保存のたびに自動的に再インデックス</h3><p><strong>Watch</strong>ワークフローはメモリ/ディレクトリ内のすべてのMarkdownファイルを監視し、ファイルが変更され保存されるたびに再インデックスをトリガーします。<strong>1500msのデバウンスにより</strong>、無駄な計算をすることなく更新を確実に検出します：複数の保存が連続して発生した場合、タイマーはリセットされ、編集が安定したときにのみ起動します。</p>
<p>この遅延は経験的に調整されている：</p>
<ul>
<li><p><strong>100ミリ秒</strong>→ 敏感すぎる。キー入力のたびに作動し、エンベッディングコールを燃やす。</p></li>
<li><p><strong>10s</strong>→ 遅すぎる。開発者がタイムラグに気づく。</p></li>
<li><p><strong>1500ms</strong>→ 応答性とリソース効率の理想的なバランス</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ms2_92fdb7f1f8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>実際には、開発者は1つのウィンドウでコードを書き、別のウィンドウで<code translate="no">MEMORY.md</code> 、APIドキュメントのURLを追加したり、古いエントリーを修正したりすることができる。ファイルを保存すると、次のAIクエリーが新しいメモリをピックアップする。再起動も、手動での再インデックスも必要ない。</p>
<h3 id="2-Index-Smart-Chunking-Deduplication-and-Version-Aware-Embeddings" class="common-anchor-header">2.インデックススマート・チャンキング、重複排除、バージョンを意識した埋め込み</h3><p>インデックスはパフォーマンスが重要なワークフローである。<strong>チャンキング、重複排除、バージョン管理されたチャンクIDの</strong>3つを扱います。</p>
<p><strong>チャンキングは</strong>意味的な境界（見出しと本文）に沿ってテキストを分割するので、関連するコンテンツは一緒に残る。これにより、"Redis configuration "のようなフレーズがチャンク間で分割されるようなケースを避けることができる。</p>
<p>例えば、このMarkdown：</p>
<pre><code translate="no" class="language-markdown"><span class="hljs-comment">## Redis Caching</span>
We use Redis <span class="hljs-keyword">for</span> L1 cache <span class="hljs-keyword">with</span> 5<span class="hljs-built_in">min</span> TTL.
The connection pool <span class="hljs-keyword">is</span> configured <span class="hljs-keyword">with</span> <span class="hljs-built_in">max</span> <span class="hljs-number">100</span> connections.

<span class="hljs-comment">## Database</span>
PostgreSQL <span class="hljs-number">16</span> <span class="hljs-keyword">is</span> the primary database.
<button class="copy-code-btn"></button></code></pre>
<p>つのチャンクになります：</p>
<ul>
<li><p>チャンク1：<code translate="no">## Redis Caching\nWe use Redis for L1 cache...</code></p></li>
<li><p>チャンク2<code translate="no">## Database\nPostgreSQL 16 is the primary database.</code></p></li>
</ul>
<p><strong>重複排除は</strong>各チャンクのSHA-256ハッシュを使用し、同じテキストが2度埋め込まれるのを防ぎます。複数のファイルが "PostgreSQL 16 "と言及している場合、埋め込みAPIは1ファイルにつき1回ではなく、1回呼び出されます。500KB程度のテキストであれば、<strong>月額$0.15程度の</strong>節約になります。規模が大きくなれば、数百ドルになります。</p>
<p><strong>チャンクIDの設計は</strong>、チャンクが古いかどうかを知るために必要なすべてをエンコードします。フォーマットは<code translate="no">hash(source_path:start_line:end_line:content_hash:model_version)</code> 。<code translate="no">model_version</code> 埋め込みモデルが<code translate="no">text-embedding-3-small</code> から<code translate="no">text-embedding-3-large</code> にアップグレードされると、古い埋め込みは無効になります。モデルのバージョンはIDに組み込まれているので、システムは自動的にどのチャンクに再埋め込みが必要かを識別します。手動でのクリーンアップは必要ありません。</p>
<h3 id="3-Search-Hybrid-Vector-+-BM25-Retrieval-for-Maximum-Accuracy" class="common-anchor-header">3.検索：最大精度のためのハイブリッド・ベクトル＋BM25検索</h3><p>検索はハイブリッド検索アプローチを採用している。70%の重み付けをしたベクトル検索と、30%の重み付けをしたBM25キーワード検索である。これは、実際に頻繁に発生する2つの異なるニーズのバランスをとるものである。</p>
<ul>
<li><p><strong>ベクトル検索は</strong>セマンティックマッチングを扱う。Redis cache config "のクエリは、表現が異なっていても "Redis L1 cache with 5min TTL "を含むチャンクを返す。これは、開発者がコンセプトは覚えているが正確な言い回しは覚えていない場合に便利です。</p></li>
<li><p><strong>BM25は</strong>完全一致を扱います。PostgreSQL 16 "の問い合わせは "PostgreSQL 15 "の結果を返しません。これは、エラーコード、関数名、バージョン固有の動作において重要です。</p></li>
</ul>
<p>デフォルトの70/30分割はほとんどの使用例でうまく機能します。完全一致に大きく傾いたワークフローでは、BM25の重みを50%に上げることは1行の設定変更で済みます。</p>
<p>結果はトップKチャンク（デフォルト3）として返され、それぞれ200文字に切り詰められます。完全なコンテンツが必要になると、<code translate="no">memsearch expand &lt;chunk_hash&gt;</code> 。この漸進的な開示により、詳細へのアクセスを犠牲にすることなく、LLMのコンテキスト・ウィンドウの使用量を無駄なく保つことができる。</p>
<h3 id="4-Compact-Summarize-Historical-Memory-to-Keep-Context-Clean" class="common-anchor-header">4.コンパクトに：履歴メモリを要約してコンテキストをクリーンに保つ</h3><p>蓄積されたメモリはやがて問題になる。古いエントリはコンテキスト・ウィンドウを埋め尽くし、トークンのコストを増加させ、回答の質を低下させるノイズを加えます。Compactは、LLMを呼び出して過去のメモリを要約し、オリジナルを削除またはアーカイブすることで、この問題に対処します。手動でトリガーすることも、定期的に実行するようにスケジュールすることもできます。</p>
<h2 id="How-to-get-started-with-memsearch" class="common-anchor-header">memsearchの始め方<button data-href="#How-to-get-started-with-memsearch" class="anchor-icon" translate="no">
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
    </button></h2><p>Memsearch は<strong>Python API</strong>と<strong>CLI の</strong>両方を提供しているので、エージェントフレームワークの内部やスタンドアロンのデバッグツールとして使用することができる。セットアップは最小限であり、ローカルの開発環境と本番環境はほとんど同じに見えるように設計されています。</p>
<p>Memsearchは3つのMilvus互換バックエンドをサポートしており、全て<strong>同じAPIを通して</strong>公開されています：</p>
<ul>
<li><p><a href="https://milvus.io/docs/milvus_lite.md"><strong>Milvus Lite（デフォルト）</strong></a><strong>：</strong>Milvus Lite（デフォルト）：ローカルの<code translate="no">.db</code> ファイル、設定不要、個人での使用に適しています。</p></li>
<li><p><strong>Milvus Standalone / Cluster：</strong>セルフホスト型、複数のエージェントによるデータ共有をサポート。</p></li>
<li><p><a href="https://zilliz.com/cloud"><strong>Zillizクラウド</strong></a><strong>：</strong>自動スケーリング、バックアップ、高可用性、分離を備えたフルマネージド。本番環境のワークロードに最適です。</p></li>
</ul>
<p>ローカル開発環境から本番環境への切り替えは、通常<strong>1行の設定変更で済みます</strong>。あなたのコードはそのままです。</p>
<h3 id="Install" class="common-anchor-header">インストール</h3><pre><code translate="no" class="language-bash">pip install memsearch
<button class="copy-code-btn"></button></code></pre>
<p>memsearchは、OpenAI、Google、Voyage、Ollama、ローカルモデルを含む複数のエンベッディングプロバイダもサポートしています。これにより、メモリアーキテクチャの移植性とベンダーにとらわれないことが保証されます。</p>
<h3 id="Option-1-Python-API-integrated-into-your-agent-framework" class="common-anchor-header">オプション 1: Python API (エージェントフレームワークに統合)</h3><p>以下は、memsearchを使ったエージェントループの最小例です。必要に応じてコピー＆ペーストして変更してください：</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> memsearch <span class="hljs-keyword">import</span> MemSearch

llm = OpenAI()
ms = MemSearch(paths=[<span class="hljs-string">&quot;./memory/&quot;</span>])

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">agent_chat</span>(<span class="hljs-params">user_input: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-comment"># 1. Recall — search relevant memories</span>
    memories = <span class="hljs-keyword">await</span> ms.search(user_input, top_k=<span class="hljs-number">3</span>)
    context = <span class="hljs-string">&quot;\n&quot;</span>.join(<span class="hljs-string">f&quot;- <span class="hljs-subst">{m[<span class="hljs-string">&#x27;content&#x27;</span>][:<span class="hljs-number">200</span>]}</span>&quot;</span> <span class="hljs-keyword">for</span> m <span class="hljs-keyword">in</span> memories)

    <span class="hljs-comment"># 2. Think — call LLM</span>
    resp = llm.chat.completions.create(
        model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>,
        messages=[
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">f&quot;Memories:\n<span class="hljs-subst">{context}</span>&quot;</span>},
            {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: user_input},
        ],
    )

    <span class="hljs-comment"># 3. Remember — write to markdown, update index</span>
    save_memory(<span class="hljs-string">f&quot;## <span class="hljs-subst">{user_input}</span>\n<span class="hljs-subst">{resp.choices[<span class="hljs-number">0</span>].message.content}</span>&quot;</span>)
    <span class="hljs-keyword">await</span> ms.index()
    <span class="hljs-keyword">return</span> resp.choices[<span class="hljs-number">0</span>].message.content
<button class="copy-code-btn"></button></code></pre>
<p>これはコアループを示しています：</p>
<ul>
<li><p><strong>思い出してください</strong>: memsearch はハイブリッドベクトル + BM25 検索を行います。</p></li>
<li><p>あなたの LLM は、ユーザ入力と検索されたメモリを処理します<strong>。</strong></p></li>
<li><p><strong>思い出してください</strong>：エージェントは新しいメモリをMarkdownに書き込み、memsearchはインデックスを更新します。</p></li>
</ul>
<p>このパターンはどのエージェントシステムにも自然に適合します-LangChain、AutoGPT、セマンティックルータ、LangGraph、カスタムエージェントループなど。フレームワークにとらわれない設計になっています。</p>
<h3 id="Option-2-CLI-quick-operations-good-for-debugging" class="common-anchor-header">オプション2：CLI（素早い操作、デバッグに最適）</h3><p>CLIはスタンドアローンのワークフロー、クイックチェック、開発中のメモリ検査に最適です：</p>
<pre><code translate="no" class="language-bash">memsearch index ./docs/              <span class="hljs-comment"># Index files</span>
memsearch search <span class="hljs-string">&quot;Redis caching&quot;</span>     <span class="hljs-comment"># Search</span>
memsearch watch ./docs/              <span class="hljs-comment"># Watch for file changes</span>
memsearch compact                    <span class="hljs-comment"># Compact old memory</span>
<button class="copy-code-btn"></button></code></pre>
<p>CLIはPython APIの機能を反映していますが、コードを書くことなく動作するので、デバッグ、検査、マイグレーション、メモリフォルダ構造の検証に最適です。</p>
<h2 id="How-memsearch-Compares-to-Other-Memory-Solutions" class="common-anchor-header">memsearchと他のメモリーソリューションとの比較<button data-href="#How-memsearch-Compares-to-Other-Memory-Solutions" class="anchor-icon" translate="no">
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
    </button></h2><p>開発者からの最も一般的な質問は、すでに確立された選択肢があるのに、なぜ memsearch を使うのかということです。簡単に言うと、memsearch は一時的なナレッジグラフのような高度な機能を、透明性、移植性、シンプルさと引き換えに使っているのです。ほとんどのエージェントメモリのユースケースにとって、これは正しいトレードオフです。</p>
<table>
<thead>
<tr><th>ソリューション</th><th>長所</th><th>制限事項</th><th>最適</th></tr>
</thead>
<tbody>
<tr><td>memsearch</td><td>透過的なプレーンテキストメモリ、人間とAIの共同オーサリング、マイグレーション摩擦ゼロ、簡単なデバッグ、Gitネイティブ</td><td>時系列グラフや複雑なマルチエージェントメモリー構造を内蔵していない</td><td>長期記憶におけるコントロール、シンプルさ、移植性を重視するチーム</td></tr>
<tr><td>Mem0</td><td>完全に管理され、インフラストラクチャの運用や保守が不要</td><td>不透明-メモリの検査や手動での編集ができない。</td><td>手を煩わせないマネージドサービスを希望し、可視性が低くても構わないチーム</td></tr>
<tr><td>ゼップ</td><td>豊富な機能セット：一時記憶、マルチペルソナモデリング、複雑な知識グラフ</td><td>アーキテクチャが重く、可動部分が多く、学習と運用が難しい</td><td>本当に高度なメモリ構造や時間認識推論を必要とするエージェント</td></tr>
<tr><td>LangMem / Letta</td><td>独自のエコシステム内に深くシームレスに統合</td><td>他のエージェントスタックへの移植が困難</td><td>チームが既に特定のフレームワークにコミットしている</td></tr>
</tbody>
</table>
<h2 id="Start-Using-memsearch-and-Join-the-Project" class="common-anchor-header">memsearchを使い始め、プロジェクトに参加する<button data-href="#Start-Using-memsearch-and-Join-the-Project" class="anchor-icon" translate="no">
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
    </button></h2><p>memsearchはMITライセンスの下で完全にオープンソースであり、リポジトリは今日から本番環境での実験が可能です。</p>
<ul>
<li><p><strong>リポジトリ:</strong> <a href="https://github.com/zilliztech/memsearch">github.com/zilliztech/memsearch</a></p></li>
<li><p><strong>ドキュメント:</strong> <a href="https://zilliztech.github.io/memsearch">zilliztech.github.io/memsearch</a></p></li>
</ul>
<p>セッションをまたいで記憶する必要があるエージェントを構築していて、記憶する内容を完全にコントロールしたいのであれば、memsearch は一見の価値がある。このライブラリは<code translate="no">pip install</code> でインストールでき、どのエージェントフレームワークでも動作し、すべてをMarkdownとして保存し、Gitで読み込み、編集し、バージョン管理することができます。</p>
<p>私たちはmemsearchを積極的に開発しており、コミュニティからの意見をお待ちしています。</p>
<ul>
<li><p>何か問題があれば、issueを発行してください。</p></li>
<li><p>ライブラリを拡張したい場合はPRを提出してください。</p></li>
<li><p>Markdown-as-source-of-truthの理念に共感したら、レポにスターを付けてください。</p></li>
</ul>
<p>OpenClaw のメモリシステムは、もはや OpenClaw 内に閉じ込められていません。誰でも使えるようになりました。</p>
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
<li><p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClawとは？オープンソースAIエージェントの完全ガイド</a></p></li>
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">OpenClawチュートリアル：ローカルAIアシスタントのためのSlackへの接続</a></p></li>
<li><p><a href="https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md">LangGraphとmilvusでClawdbotスタイルのAIエージェントを作る</a></p></li>
<li><p><a href="https://milvus.io/blog/is-rag-become-outdated-now-long-running-agents-like-claude-cowork-are-emerging.md">RAGとロングランエージェントの比較：RAGは時代遅れか？</a></p></li>
<li><p><a href="https://milvus.io/blog/create-a-custom-anthropic-skill-for-milvus-to-quickly-spin-up-rag.md">RAGを素早くスピンアップさせるためのMilvus用カスタムアントロピックスキルの作成</a></p></li>
</ul>
