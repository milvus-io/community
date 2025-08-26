---
id: >-
  why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md
title: なぜ私はクロード・コードのGrepのみの検索に反対なのか？トークンを消費しすぎる
author: Cheney Zhang
date: 2025-08-25T00:00:00.000Z
desc: >-
  ベクターベースのコード検索でクロードコードトークンの消費を40%削減する方法をご覧ください。MCPに簡単に統合できるオープンソースのソリューション。今すぐ
  claude-context をお試しください。
cover: >-
  assets.zilliz.com/why_im_against_claude_codes_grep_only_retrieval_it_just_burns_too_many_tokens_milvus_cover_2928b4b72d.png
tag: Engineering
recommend: false
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Claude Code, vector search, AI IDE, code retrieval, token optimization'
meta_title: >
  Why I’m Against Claude Code’s Grep-Only Retrieval? It Just Burns Too Many
  Tokens
origin: >
  https://milvus.io/blog/why-im-against-claude-codes-grep-only-retrieval-it-just-burns-too-many-tokens.md
---
<p>AIコーディングアシスタントが爆発的に普及している。このわずか2年間で、Cursor、Claude Code、Gemini CLI、Qwen Codeのようなツールは、何百万人もの開発者にとって、珍品から日常のお供になった。しかし、この急速な台頭の裏には、「<strong>AIコーディング・アシスタントは、実際にどのようにコードベースの文脈を検索すべきか</strong>」という、見かけによらず単純なことをめぐる戦いがある。</p>
<p>現在、2つのアプローチがある：</p>
<ul>
<li><p><strong>ベクトル検索によるRAG</strong>（意味検索）。</p></li>
<li><p><strong>grep</strong>（リテラル文字列マッチング<strong>）によるキーワード検索</strong>。</p></li>
</ul>
<p>クロード・コードとジェミニは後者を選択した。実際、クロード・コードのエンジニアはHacker Newsで、クロード・コードはRAGをまったく使っていないと公言している。その代わりに、彼らは "agentic search"（エージェント検索）と呼んでいる。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_2b03e89759.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>この暴露はコミュニティを二分した：</p>
<ul>
<li><p><strong>支持者は</strong>grepのシンプルさを擁護する。支持者はgrepのシンプルさを擁護し、高速で正確、そして最も重要なのは予測可能であることだ。プログラミングでは精度がすべてであり、今日の埋め込みはまだあいまいで信用できないと彼らは主張する。</p></li>
<li><p><strong>批評家たちは</strong>、grepは行き止まりだと見ている。無関係なマッチに溺れ、トークンを燃やし、ワークフローを停滞させる。意味理解がなければ、AIに目隠ししてデバッグを頼むようなものだ。</p></li>
</ul>
<p>どちらの意見にも一理ある。ベクター検索ベースのRAGアプローチはゲームを変えます。<strong>検索が劇的に速く、正確になるだけでなく、トークンの使用量を40％以上削減できる。(私のアプローチについては、クロード・コンテキストの部分まで飛ばしてください）。</strong></p>
<p>では、なぜgrepはこれほど制限的なのだろうか？また、実際にベクター検索はどのようにしてより良い結果をもたらすのだろうか？それを分解してみよう。</p>
<h2 id="What’s-Wrong-with-Claude-Code’s-Grep-Only-Code-Search" class="common-anchor-header">クロード・コードのグレップのみのコード検索は何が問題なのか？<button data-href="#What’s-Wrong-with-Claude-Code’s-Grep-Only-Code-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>ある厄介な問題をデバッグしているときに、この問題に遭遇した。Claude Codeは私のレポ全体にgrepクエリを発行し、無関係なテキストの巨大な塊を私に返してきた。1分経っても関連ファイルは見つからなかった。5分後、ようやく正しい10行が見つかったが、それは500行のノイズに埋もれていた。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_299eeeaea5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>これはエッジケースではない。Claude CodeのGitHubのissueをざっと読んでみると、同じ壁にぶつかってイライラしている開発者がたくさんいることがわかる：</p>
<ul>
<li><p>issue1:<a href="https://github.com/anthropics/claude-code/issues/1315"> https://github.com/anthropics/claude-code/issues/1315</a></p></li>
<li><p>issue2:<a href="https://github.com/anthropics/claude-code/issues/4556"> https://github.com/anthropics/claude-code/issues/4556</a></p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_938c7244da.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>コミュニティのフラストレーションは、3つのペインポイントに集約される：</p>
<ol>
<li><p><strong>トークンの肥大化。</strong>grep dump のたびに大量の無関係なコードが LLM に書き込まれ、レポジトリのサイズに比例してコストが増大する。</p></li>
<li><p><strong>時間税。</strong>AIがあなたのコードベースに20の質問を投げかけている間、あなたは待ちぼうけを食らうことになり、集中力とフローが失われる。</p></li>
<li><p><strong>コンテキストゼロ。</strong>Grepはリテラル文字列にマッチする。意味も関係もわからないので、事実上、盲目的に検索することになる。</p></li>
</ol>
<p>グレップは単に「古い」だけでなく、AI支援プログラミングを積極的に妨げているのだ。</p>
<h2 id="Claude-Code-vs-Cursor-Why-the-Latter-Has-Better-Code-Context" class="common-anchor-header">クロード・コード対カーソル：なぜ後者の方がコードコンテキストが優れているのか<button data-href="#Claude-Code-vs-Cursor-Why-the-Latter-Has-Better-Code-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>コードコンテキストに関しては、Cursorの方が良い仕事をしている。初日から、Cursorは<strong>コードベースのインデックス作成に</strong>傾注してきた。レポを意味のあるチャンクに分割し、それらのチャンクをベクトルに埋め込み、AIがコンテキストを必要とするときはいつでもそれらを意味的に取り出す。これは、教科書的なRAG（Retrieval-Augmented Generation）をコードに適用したもので、その結果は、より緊密なコンテキスト、無駄なトークンの減少、より高速な検索を物語っている。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_a9f5beb01d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>対照的に、クロード・コードはシンプルさを倍増させている。インデックスも埋め込みもない。つまり、検索はすべて文字列のマッチングであり、構造も意味も理解しない。理論的には高速だが、実際には、開発者はしばしば、実際に必要な1本の針を見つける前に、無関係なマッチの干し草の山をふるいにかけることになる。</p>
<table>
<thead>
<tr><th></th><th><strong>クロード・コード</strong></th><th><strong>カーソル</strong></th></tr>
</thead>
<tbody>
<tr><td>検索精度</td><td>完全に一致するものだけを表示します。</td><td>キーワードが完全に一致しない場合でも、意味的に関連するコードを検索します。</td></tr>
<tr><td>効率性</td><td>Grepは大量のコードをモデルにダンプし、トークンのコストを増加させます。</td><td>より小さく、よりシグナルの高いチャンクは、トークンの負荷を30-40%削減します。</td></tr>
<tr><td>スケーラビリティ</td><td>毎回レポを再グリップするため、プロジェクトが大きくなるにつれて遅くなります。</td><td>インデックスを一度作成すれば、最小限のタイムラグで大規模な検索が可能。</td></tr>
<tr><td>哲学</td><td>余分なインフラは不要。</td><td>すべてをインデックス化し、インテリジェントに検索する。</td></tr>
</tbody>
</table>
<p>では、なぜClaude（あるいはGemini、Cline）はCursorに追随しないのだろうか？その理由の一部は技術的なものであり、一部は文化的なものである。<strong>ベクター検索は些細なことではない。チャンキング、インクリメンタルアップデート、大規模なインデックス作成などを解決する必要がある。</strong>しかしもっと重要なのは、Claude Codeはミニマリズムを中心に構築されているということだ。エンベッディングやベクトルDBは、この設計思想には合わない。</p>
<p>このシンプルさは魅力的だが、Claude Codeが提供できるものの上限を決めてしまうことにもなる。Cursorは本物のインデックス・インフラに投資する意欲があるからこそ、今日より強力に感じられるのだ。</p>
<h2 id="Claude-Context-an-Open-Source-Project-for-Adding-Semantic-Code-Search-to-Claude-Code" class="common-anchor-header">クロード・コンテキスト：クロード・コードにセマンティック・コード検索を追加するオープンソース・プロジェクト<button data-href="#Claude-Context-an-Open-Source-Project-for-Adding-Semantic-Code-Search-to-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Codeは強力なツールだが、コードコンテキストが貧弱だ。Cursorはコードベースの索引付けによってこれを解決したが、Cursorはクローズドソースであり、サブスクリプションの後ろにロックされ、個人や小さなチームにとっては高価である。</p>
<p>このギャップが、私たちが独自のオープンソース・ソリューションを作り始めた理由です：<a href="https://github.com/zilliztech/claude-context"><strong>Claude Context</strong></a>です。</p>
<p><a href="https://github.com/zilliztech/claude-context"><strong>Claude Contextは</strong></a>オープンソースのMCPプラグインで、Claude Code（およびMCPを話す他のAIコーディングエージェント）に<strong>セマンティックコード検索を</strong>もたらします。grepを使ったブルートフォースではなく、ベクターデータベースと埋め込みモデルを統合し、コードベース全体から<em>深く的を絞ったコンテキストを</em>LLMに与えます。その結果、検索がよりシャープになり、トークンの無駄が減り、開発者のエクスペリエンスが格段に向上します。</p>
<p>以下はその構築方法です：</p>
<h3 id="Technologies-We-Use" class="common-anchor-header">使用技術</h3><p><strong>ᔌ インターフェースレイヤー：ユニバーサル・コネクタとしてのMCP</strong></p>
<p>クロードだけでなく、あらゆる場所で使えるようにしたかった。MCP（Model Context Protocol）はLLMのUSB標準のように機能し、外部ツールをシームレスにプラグインすることができます。Claude ContextをMCPサーバーとしてパッケージ化することで、Claude Codeだけでなく、Gemini CLI、Qwen Code、Cline、そしてCursorでも動作します。</p>
<p><strong>🗄️ ベクターデータベース：Zillizクラウド</strong></p>
<p>バックボーンには<a href="https://zilliz.com/cloud">Zilliz Cloud</a>（<a href="https://milvus.io/">milvus</a>上に構築されたフルマネージドサービス）を選んだ。高性能で、クラウドネイティブで、伸縮性があり、コードベースのインデックス作成のようなAIワークロード用に設計されている。つまり、低レイテンシーの検索、無限に近いスケール、揺るぎない信頼性です。</p>
<p><strong>🧩 組み込みモデル：設計による柔軟性</strong>チームによってニーズが異なるため、Claude Context は複数のエンベッディングプロバイダをすぐにサポートします：</p>
<ul>
<li><p><strong>OpenAIのエンベッディングは</strong>、安定性と幅広い採用が可能です。</p></li>
<li><p><strong>Voyageエンベッディング</strong>：コードに特化したパフォーマンス。</p></li>
<li><p><strong>Ollamaは</strong>、プライバシーを第一に考えたローカルデプロイメント用です。</p></li>
</ul>
<p>要件が進化するにつれて、モデルを追加することができます。</p>
<p><strong>言語選択：TypeScript</strong></p>
<p>我々はPythonとTypeScriptについて議論した。アプリケーションレベルの互換性（VSCodeプラグイン、ウェブツール）だけでなく、Claude CodeとGemini CLI自体がTypeScriptベースであるためです。これにより、統合がシームレスになり、エコシステムの一貫性が保たれる。</p>
<h3 id="System-Architecture" class="common-anchor-header">システムアーキテクチャ</h3><p>Claude Contextは、クリーンでレイヤー化されたデザインに従っている：</p>
<ul>
<li><p><strong>コアモジュールは</strong>、コードの解析、チャンキング、インデックス作成、検索、同期といった重労働を処理する。</p></li>
<li><p><strong>ユーザーインターフェースは</strong>、MCPサーバー、VSCodeプラグイン、その他のアダプターなどの統合を処理します。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_0c70864d6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>このように分離することで、コア・エンジンは異なる環境でも再利用可能なまま、新しいAIコーディング・アシスタントの登場に合わせて統合を迅速に進化させることができます。</p>
<h3 id="Core-Module-Implementation" class="common-anchor-header">コアモジュールの実装</h3><p>コア・モジュールは、システム全体の基盤を形成します。ベクターデータベース、エンベッディングモデル、その他のコンポーネントを、Contextオブジェクトを作成するコンポーザブルモジュールに抽象化し、シナリオごとに異なるベクターデータベースとエンベッディングモデルを可能にします。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> { <span class="hljs-title class_">Context</span>, <span class="hljs-title class_">MilvusVectorDatabase</span>, <span class="hljs-title class_">OpenAIEmbedding</span> } <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;@zilliz/claude-context-core&#x27;</span>;
<span class="hljs-comment">// Initialize embedding provider</span>
<span class="hljs-keyword">const</span> embedding = <span class="hljs-keyword">new</span> <span class="hljs-title class_">OpenAIEmbedding</span>(...);
<span class="hljs-comment">// Initialize vector database</span>
<span class="hljs-keyword">const</span> vectorDatabase = <span class="hljs-keyword">new</span> <span class="hljs-title class_">MilvusVectorDatabase</span>(...);
<span class="hljs-comment">// Create context instance</span>
<span class="hljs-keyword">const</span> context = <span class="hljs-keyword">new</span> <span class="hljs-title class_">Context</span>({embedding, vectorDatabase});
<span class="hljs-comment">// Index your codebase with progress tracking</span>
<span class="hljs-keyword">const</span> stats = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">indexCodebase</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>);
<span class="hljs-comment">// Perform semantic search</span>
<span class="hljs-keyword">const</span> results = <span class="hljs-keyword">await</span> context.<span class="hljs-title function_">semanticSearch</span>(<span class="hljs-string">&#x27;./your-project&#x27;</span>, <span class="hljs-string">&#x27;vector database operations&#x27;</span>);
<button class="copy-code-btn"></button></code></pre>
<h2 id="Solving-Key-Technical-Challenges" class="common-anchor-header">主要な技術的課題の解決<button data-href="#Solving-Key-Technical-Challenges" class="anchor-icon" translate="no">
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
    </button></h2><p>クロード・コンテキストの構築は、エンベッディングとベクターDBの配線だけではありませんでした。本当の仕事は、大規模なコード索引付けを左右する難しい問題を解決することでした。ここでは、3つの大きな課題にどのように取り組んだかを紹介する：</p>
<h3 id="Challenge-1-Intelligent-Code-Chunking" class="common-anchor-header">課題1：インテリジェントなコード・チャンキング</h3><p>コードは単に行や文字で分割することはできません。それでは、乱雑で不完全な断片が生まれ、コードを理解しやすくするロジックが削ぎ落とされてしまいます。</p>
<p>私たちは、<strong>2つの補完的な戦略で</strong>これを解決しました：</p>
<h4 id="AST-Based-Chunking-Primary-Strategy" class="common-anchor-header">ASTベースのチャンキング（主要戦略）</h4><p>これはデフォルトのアプローチで、ツリー・シッター・パーサーを使ってコードの構文構造を理解し、意味的な境界（関数、クラス、メソッド）に沿って分割します。これにより次のことが実現される：</p>
<ul>
<li><p><strong>構文の完全性</strong>- 関数の欠落や宣言の破綻がない。</p></li>
<li><p><strong>論理的な一貫性</strong>- 関連するロジックは、より良いセマンティック検索のために一緒に維持されます。</p></li>
<li><p><strong>多言語サポート</strong>- ツリーシッター文法により、JS、Python、Java、Goなどで動作します。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_e976593d7e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="LangChain-Text-Splitting-Fallback-Strategy" class="common-anchor-header">LangChainテキスト分割（フォールバック戦略）</h4><p>ASTが解析できない言語や解析に失敗した場合、LangChainの<code translate="no">RecursiveCharacterTextSplitter</code> は信頼できるバックアップを提供します。</p>
<pre><code translate="no"><span class="hljs-comment">// Use recursive character splitting to maintain code structure</span>
<span class="hljs-keyword">const</span> splitter = <span class="hljs-title class_">RecursiveCharacterTextSplitter</span>.<span class="hljs-title function_">fromLanguage</span>(language, { 
  <span class="hljs-attr">chunkSize</span>: <span class="hljs-number">1000</span>, 
  <span class="hljs-attr">chunkOverlap</span>: <span class="hljs-number">200</span>,
});
<button class="copy-code-btn"></button></code></pre>
<p>ASTより "インテリジェント "ではありませんが、信頼性が高く、開発者が取り残されることはありません。この2つの戦略を組み合わせることで、セマンティックな豊かさと普遍的な適用性のバランスをとることができます。</p>
<h3 id="Challenge-2-Handling-Code-Changes-Efficiently" class="common-anchor-header">課題2：コード変更の効率的な処理</h3><p>コード変更を管理することは、コード索引システムにおける最大の課題の一つである。些細なファイルの変更のためにプロジェクト全体のインデックスを作り直すことは、まったく現実的ではありません。</p>
<p>この問題を解決するために、私たちはMerkle Treeベースの同期メカニズムを構築しました。</p>
<h4 id="Merkle-Trees-The-Foundation-of-Change-Detection" class="common-anchor-header">Merkleツリー：変更検出の基礎</h4><p>Merkle Treesは階層的な「フィンガープリント」システムを作成し、各ファイルは独自のハッシュ・フィンガープリントを持ち、フォルダはそのコンテンツに基づいたフィンガープリントを持ち、すべてがコードベース全体のユニークなルート・ノード・フィンガープリントに集約されます。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_79adb21c84.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>ファイルのコンテンツが変更されると、ハッシュフィンガープリントは各レイヤーを経由してルートノードへとカスケードアップします。これにより、ルートから下へレイヤーごとにハッシュフィンガープリントを比較することで迅速な変更検出が可能になり、プロジェクトの完全な再インデックス化なしにファイルの変更を素早く特定しローカライズします。</p>
<p>システムは合理化された3段階のプロセスを使用して、5分ごとにハンドシェイク同期チェックを実行します：</p>
<p><strong>フェーズ 1: Lightning-Fast Detection は</strong>、コードベース全体の Merkle ルートハッシュを計算し、前回のスナップショットと比較します。ルートハッシュが同一であれば、変更がないことを意味し、システムはミリ秒単位ですべての処理をスキップします。</p>
<p><strong>フェーズ2：正確な比較は</strong>、ルートハッシュが異なる場合にトリガーされ、詳細なファイルレベルの分析を実行して、どのファイルが追加、削除、または変更されたかを正確に特定します。</p>
<p><strong>フェーズ 3: インクリメンタル アップデート</strong>変更されたファイルに対してのみベクトルを再計算し、それに応じてベクトル データベースを更新することで、効率を最大化します。</p>
<h4 id="Local-Snapshot-Management" class="common-anchor-header">ローカル・スナップショット管理</h4><p>すべての同期状態は、ユーザーの<code translate="no">~/.context/merkle/</code> ディレクトリにローカルに保存されます。各コードベースは、ファイル・ハッシュ・テーブルとシリアライズされたMerkleツリー・データを含む独自の独立したスナップショット・ファイルを維持し、プログラムの再起動後でも正確な状態復元を保証します。</p>
<p>この設計には明らかな利点がある。変更がない場合、ほとんどのチェックは数ミリ秒で完了し、純粋に変更されたファイルだけが再処理のトリガーとなり（膨大な計算の無駄を回避）、プログラムのセッションをまたいで状態回復が完璧に機能する。</p>
<p>ユーザー・エクスペリエンスの観点からは、1つの関数を変更するだけで、プロジェクト全体ではなく、そのファイルだけの再インデックスがトリガーされるため、開発効率が劇的に向上します。</p>
<h3 id="Challenge-3-Designing-the-MCP-Interface" class="common-anchor-header">課題3：MCPインターフェースの設計</h3><p>どんなにスマートなインデックス作成エンジンでも、開発者向けのクリーンなインターフェイスがなければ意味がありません。MCPは当然の選択でしたが、ユニークな課題がありました：</p>
<h4 id="🔹-Tool-Design-Keep-It-Simple" class="common-anchor-header"><strong>🔹 ツールの設計：ツールの設計：シンプルに保つ</strong></h4><p>MCPモジュールはユーザー向けのインターフェースとして機能し、ユーザーエクスペリエンスを最優先します。</p>
<p>ツールの設計は、標準的なコードベースの索引付けと検索操作を、コードベースの索引付けのための<code translate="no">index_codebase</code> 、コード検索のための<code translate="no">search_code</code> 、2つのコアツールに抽象化することから始まります。</p>
<p>これは、どのような追加ツールが必要かという重要な問題を提起する。</p>
<p>ツールの数が多すぎると、認知的なオーバーヘッドが発生し、LLMツールの選択が混乱する。</p>
<p>実際のユースケースから逆算することは、この問いに答えるのに役立つ。</p>
<h4 id="Addressing-Background-Processing-Challenges" class="common-anchor-header">バックグラウンド処理の課題に対処する</h4><p>大規模なコードベースでは、インデックス作成にかなりの時間がかかる。同期的に完了を待つという素朴なアプローチは、ユーザーに数分の待ち時間を強いることになるが、これは単純に容認できない。非同期のバックグラウンド処理が不可欠になりますが、MCPはこのパターンをネイティブでサポートしていません。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/8_e1f0aa290f.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>私たちのMCPサーバーは、MCPサーバー内でバックグラウンド・プロセスを実行し、インデックス作成を処理すると同時に、起動メッセージを即座にユーザーに返し、ユーザーが作業を継続できるようにしています。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/9_1cb37d15f3.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>これは新たな課題を生み出します：ユーザはどのようにインデックス作成の進捗を追跡するのでしょうか？</p>
<p>インデックス作成の進捗状況やステータスを問い合わせるための専用ツールが、これをエレガントに解決します。バックグラウンド・インデックス作成プロセスは、進捗情報を非同期でキャッシュし、ユーザーはいつでも完了率、成功ステータス、または失敗条件をチェックすることができます。さらに、手動インデックスクリアツールは、ユーザーが不正確なインデックスをリセットしたり、インデックス作成プロセスを再開したりする必要がある状況に対応します。</p>
<p><strong>最終的なツールデザイン</strong></p>
<p><code translate="no">index_codebase</code> - インデックス・コードベース - 検索コード - クエリ・インデクシング・ステータス - クリア・インデックス<code translate="no">search_code</code><code translate="no">get_indexing_status</code><code translate="no">clear_index</code> </p>
<p>シンプルさと機能性の完璧なバランスを取る4つのツール。</p>
<h4 id="🔹-Environment-Variable-Management" class="common-anchor-header">環境変数の管理</h4><p>環境変数の管理は、ユーザーエクスペリエンスに大きな影響を与えるにもかかわらず、見過ごされがちである。すべてのMCPクライアントに個別のAPIキー設定を要求することは、クロードコードとGemini CLIを切り替える際に、ユーザーに何度も認証情報を設定することを強いることになる。</p>
<p>グローバルコンフィギュレーションアプローチは、ユーザーのホームディレクトリに<code translate="no">~/.context/.env</code> ファイルを作成することで、この摩擦を排除します：</p>
<pre><code translate="no"><span class="hljs-comment"># ~/.context/.env</span>
OPENAI_API_KEY=your-api-key-here
MILVUS_TOKEN=your-milvus-token
<button class="copy-code-btn"></button></code></pre>
<p><strong>このアプローチには明確な利点があります。</strong>ユーザーは一度設定すればすべてのMCPクライアントでどこでも使用でき、すべての設定は1つの場所に集中されるためメンテナンスが容易で、機密性の高いAPIキーが複数の設定ファイルに散らばることがありません。</p>
<p>プロセス環境変数が最優先、グローバル・コンフィギュレーション・ファイルが中優先、デフォルト値がフォールバックとして機能します。</p>
<p>開発者は、一時的なテストのオーバーライドに環境変数を使用することができ、本番環境では、セキュリティを強化するためにシステム環境変数を通じて機密設定を注入することができ、ユーザーは、Claude Code、Gemini CLI、およびその他のツール間でシームレスに動作するように一度設定することができます。</p>
<p>この時点で、MCPサーバーのコアアーキテクチャは、インテリジェントな検索とコンフィギュレーション管理を通じて、コード解析とベクターストレージにまたがる完全なものとなっている。すべてのコンポーネントは、パワフルでユーザーフレンドリーなシステムを構築するために、慎重に設計され、最適化されています。</p>
<h2 id="Hands-on-Testing" class="common-anchor-header">実地テスト<button data-href="#Hands-on-Testing" class="anchor-icon" translate="no">
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
    </button></h2><p>では、Claude Contextは実際にどのように機能するのだろうか？最初に挫折したバグ探しとまったく同じシナリオでテストしてみた。</p>
<p>インストールは、Claude Codeを起動する前の1つのコマンドだけだった：</p>
<pre><code translate="no">claude mcp add claude-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx <span class="hljs-meta">@zilliz</span>/claude-context-mcp<span class="hljs-meta">@latest</span>
<button class="copy-code-btn"></button></code></pre>
<p>コードベースがインデックスされると、私はClaude Codeに、以前<strong>grepを駆使して5分間バグ追跡を</strong>させたのと同じバグの説明を与えた。今回は、<code translate="no">claude-context</code> MCPの呼び出しによって、<strong>すぐに正確なファイルと行番号が特定され</strong>、問題の説明も表示された。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/claude_context_gif_e04d07cd00.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>その違いは微妙なものではなく、昼夜を問わないものだった。</p>
<p>しかも、バグ探しだけではなかった。Claude Contextが統合されたことで、Claude Codeは一貫してより質の高い結果を生み出しました：</p>
<ul>
<li><p><strong>問題の解決</strong></p></li>
<li><p><strong>コードのリファクタリング</strong></p></li>
<li><p><strong>重複コードの検出</strong></p></li>
<li><p><strong>包括的なテスト</strong></p></li>
</ul>
<p>パフォーマンスの向上は数字にも表れています。サイド・バイ・サイド・テストでは</p>
<ul>
<li><p>トークンの使用量は40%以上減少し、リコールも減少しませんでした。</p></li>
<li><p>これはAPIコストの削減とレスポンスの高速化に直結します。</p></li>
<li><p>あるいは、同じ予算で、Claude Contextははるかに正確な検索を提供した。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/11_2659dd3429.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>私たちはGitHubでClaude Contextをオープンソース化し、すでに2.6K以上のスターを獲得しています。ご支援と「いいね！」をありがとうございます。</p>
<p>ぜひお試しください：</p>
<ul>
<li><p>GitHub:<a href="https://github.com/zilliztech/claude-context"> github.com/zilliztech/claude-context</a></p></li>
<li><p>npm：<a href="https://www.npmjs.com/package/@zilliz/claude-context-mcp"> zilliz/claude-context-mcp</a></p></li>
</ul>
<p>詳細なベンチマークとテスト方法はレポにありますので、フィードバックをお待ちしています。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/12_88bf595b15.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Looking-Forward" class="common-anchor-header">今後に向けて<button data-href="#Looking-Forward" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Codeのgrepに対する不満から始まったものが、確かなソリューションに成長した：<a href="https://github.com/zilliztech/claude-context"><strong>Claude Context-</strong></a>オープンソースのMCPプラグインで、Claude Codeや他のコーディングアシスタントにセマンティックなベクトル検索をもたらします。開発者は非効率的なAIツールに満足する必要はない。RAGとベクトル検索を使えば、デバッグを高速化し、トークンのコストを40％削減し、最終的にコードベースを真に理解するAI支援を得ることができる。</p>
<p>そして、これはClaude Codeに限ったことではありません。Claude Contextはオープンスタンダードに基づいて構築されているため、同じアプローチがGemini CLI、Qwen Code、Cursor、Cline、そしてそれ以降でもシームレスに機能します。もう、パフォーマンスよりもシンプルさを優先するベンダーのトレードオフに縛られる必要はありません。</p>
<p>私たちは、あなたがその未来の一部になることを望んでいます：</p>
<ul>
<li><p><a href="https://github.com/zilliztech/claude-context"><strong>Claude Contextを</strong></a><strong>お試し</strong><strong>ください：</strong>オープンソースで完全に無料です。</p></li>
<li><p><strong>開発に貢献する</strong></p></li>
<li><p><strong>または、</strong>Claude Contextを使用して<strong>独自のソリューションを構築する</strong>。</p></li>
</ul>
<p>👉 私たちの<a href="https://discord.com/invite/8uyFbECzPX"><strong>Discord コミュニティに</strong></a>参加して、フィードバックを共有したり、質問したり、助けを得たりしてください。</p>
