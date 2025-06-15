---
id: why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md
title: MilvusのMCPで、あなたのVibeコーディングが古いコードを生成する理由とそれを修正する方法
author: Cheney Zhang
date: 2025-06-13T00:00:00.000Z
cover: assets.zilliz.com/milvus_mcp_b1dab2a00c.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, mcp, AI Agents, LLM'
meta_keywords: 'Vibe coding, mcp, Milvus, model context protocol'
meta_title: |
  Why Your Vibe Coding Generates Outdated Code and How to Fix It with Milvus MCP
desc: >-
  Vibe
  Codingにおける幻覚の問題は生産性を低下させる。MilvusのMCPサーバーは、最新のドキュメントへのリアルタイムアクセスを提供することで、これを解決する方法を示しています。
origin: >-
  https://milvus.io/blog/why-vibe-coding-generate-outdated-code-and-how-to-fix-it-with-milvus-mcp.md
---
<h2 id="The-One-Thing-Breaking-Your-Vibe-Coding-Flow" class="common-anchor-header">バイブ・コーディングの流れを壊すもの<button data-href="#The-One-Thing-Breaking-Your-Vibe-Coding-Flow" class="anchor-icon" translate="no">
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
    </button></h2><p>バイブ・コーディングは、今まさに旬を迎えている。CursorやWindsurfのようなツールは、ソフトウェアの書き方を再定義し、開発を楽で直感的なものにしている。関数を尋ねれば、スニペットが返ってくる。APIコールが必要ですか？入力が終わる前に生成される。</p>
<p><strong>しかし、この雰囲気を台無しにするキャッチボールがここにある：AIアシスタントは、しばしば本番で壊れる時代遅れのコードを生成する。</strong>というのも、これらのツールを動かすLLMは、古いトレーニングデータに依存していることが多いからだ。最も巧妙なAI副操縦士でさえ、1年か3年遅れたコードを提案することがある。もはや機能しない構文や、非推奨のAPIコール、あるいは今日のフレームワークが積極的に推奨していないプラクティスを使ってしまうかもしれない。</p>
<p>この例を考えてみよう：CursorにMilvusの接続コードを生成するように頼んだら、こんなものができた：</p>
<pre><code translate="no">connections.<span class="hljs-title function_">connect</span>(<span class="hljs-string">&quot;default&quot;</span>, host=<span class="hljs-string">&quot;localhost&quot;</span>, port=<span class="hljs-string">&quot;19530&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>これは完璧に動作していましたが、現在のpymilvus SDKはすべての接続と操作に<code translate="no">MilvusClient</code> を使用することを推奨しています。この古い方法はもはやベストプラクティスとはみなされませんが、AIアシスタントはそれを推奨し続けています。なぜなら、彼らのトレーニングデータは数ヶ月から数年前のものであることが多いからです。</p>
<p>さらに悪いことに、私がOpenAIのAPIコードを要求したとき、Cursorは<code translate="no">gpt-3.5-turbo</code>を使ったスニペットを生成した。このモデルは現在OpenAIによって<em>レガシーと</em>マークされており、劣った結果をもたらす一方で、後継モデルの3倍の価格を要する。このコードはまた、<code translate="no">openai.ChatCompletion</code> 、2024年3月時点で非推奨のAPIに依存していた。</p>
<p><span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt_pricing_6bfa92d83b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>これは<strong>壊れた</strong>コードだけの問題ではない。Vibe Codingの約束は、開発がスムーズで直感的に感じられることだ。しかし、AIアシスタントが非推奨のAPIや時代遅れのパターンを生成すると、バイブは死んでしまう。あなたはStack Overflowに戻り、ドキュメント探しに戻り、古いやり方に戻る。</p>
<p>Vibe Codingツールのすべての進歩にもかかわらず、開発者は生成されたコードと生産可能なソリューションの間の「ラスト・マイル」の橋渡しに多大な時間を費やしている。雰囲気はあるが、正確さがないのだ。</p>
<p><strong>これまでは。</strong></p>
<h2 id="Meet-Milvus-MCP-Vibe-Coding-with-Always-Up-to-Date-Docs" class="common-anchor-header">MilvusのMCPとの出会い：常に最新のドキュメントを使ったMilvusコーディング<button data-href="#Meet-Milvus-MCP-Vibe-Coding-with-Always-Up-to-Date-Docs" class="anchor-icon" translate="no">
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
    </button></h2><p>では、Cursorのようなツールのパワフルな<em>コードジェネと</em>新鮮なドキュメントを組み合わせることで、IDE内で正確なコードを生成する方法はあるのでしょうか？</p>
<p>もちろんあります。モデルコンテキストプロトコル(MCP)とRAG(Retrieval-Augmented Generation)を組み合わせることで、<strong>Milvus MCPと</strong>呼ばれる強化されたソリューションを作成しました。これは、Milvus SDKを使用している開発者が最新のドキュメントに自動的にアクセスし、IDEが正しいコードを生成できるようにするものです。このサービスは間もなく利用可能になる予定です。</p>
<h3 id="How-It-Works" class="common-anchor-header">仕組み</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/The_Architecture_Behind_MCP_c9093162b6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>上の図は、MCP（モデル・コンテキスト・プロトコル）とRAG（検索-拡張生成）アーキテクチャを組み合わせたハイブリッド・システムを示しており、開発者が正確なコードを生成できるよう支援する。</p>
<p>左側では、CursorやWindsurfのようなAIを搭載したIDEで作業している開発者がチャット・インターフェースを介して対話し、MCPツールの呼び出しをトリガーします。これらのリクエストは右側のMCPサーバーに送られ、MCPサーバーはコード生成やリファクタリングのような日常的なコーディングタスクに特化したツールをホストする。</p>
<p>RAGコンポーネントはMCPサーバー側で動作し、Milvusドキュメントが前処理され、Milvusデータベースにベクターとして格納されている。ツールはクエリを受け取ると、セマンティック検索を実行し、最も関連性の高いドキュメントのスニペットとコード例を取得する。このコンテキスト情報はクライアントに返され、LLMがそれを使って正確で最新のコード提案を生成します。</p>
<h3 id="MCP-transport-mechanism" class="common-anchor-header">MCPトランスポートメカニズム</h3><p>MCPは2つのトランスポート・メカニズムをサポートしています：<code translate="no">stdio</code> と<code translate="no">SSE</code> ：</p>
<ul>
<li><p>標準入出力（stdio）：標準入出力(stdio):<code translate="no">stdio</code> トランスポートは、標準入出力ストリーム上での通信を可能にします。標準入出力(stdio):  トランスポートは、標準入出力ストリームを介した通信を可能にします。 ローカルツールやコマンドラインの統合に特に便利です。</p></li>
<li><p>Server-Sent Events (SSE)：SSE は、クライアントからサーバーへの通信に HTTP POST リクエストを使用して、サーバーからクライアントへのストリーミングをサポートします。</p></li>
</ul>
<p><code translate="no">stdio</code> はローカルのインフラに依存しているため、ユーザーはドキュメントの取り込みを自分で管理しなければならない。私たちの場合、<strong>SSEの方が適している。</strong>サーバーがすべての文書の処理と更新を自動的に行うからだ。例えば、ドキュメントは毎日再インデックスすることができる。ユーザーは、このJSON設定をMCPのセットアップに追加するだけでよい：</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;mcpServers&quot;</span>: {
    <span class="hljs-string">&quot;milvus-code-generate-helper&quot;</span>: {
      <span class="hljs-string">&quot;url&quot;</span>: <span class="hljs-string">&quot;http://&lt;SERVER_ADDRESS&gt;:23333/milvus-code-helper/sse&quot;</span>
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>この設定が完了すると、IDE（CursorやWindsurfなど）はサーバー側ツールと通信を開始し、Milvusの最新ドキュメントを自動的に取得して、よりスマートで最新のコード生成を行うことができます。</p>
<h2 id="Milvus-MCP-in-Action" class="common-anchor-header">Milvus MCPの実際<button data-href="#Milvus-MCP-in-Action" class="anchor-icon" translate="no">
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
    </button></h2><p>このシステムが実際にどのように機能するかを示すために、Milvus MCPサーバー上に3つのすぐに使えるツールを作成し、IDEから直接アクセスできるようにしました。各ツールはMilvusを使用する際に開発者が直面する一般的な問題を解決するものです：</p>
<ul>
<li><p><strong>pymilvus-code-generator</strong>：pymilvus-code-generator: pymilvus SDKを使用して、コレクションの作成、データの挿入、検索の実行など、Milvusの一般的な操作を実行する必要がある場合にPythonコードを記述します。</p></li>
<li><p><strong>orm-client-code-convertor</strong>：時代遅れのORM(Object Relational Mapping)パターンをよりシンプルで新しいMilvusClient構文に置き換えることで、既存のPythonコードを近代化します。</p></li>
<li><p><strong>言語トランスレータ</strong>プログラミング言語間でMilvus SDKコードを変換します。例えば、Python SDKのコードがTypeScript SDKで必要な場合、このツールで変換することができます。</p></li>
</ul>
<p>では、どのように動作するのか見てみましょう。</p>
<h3 id="pymilvus-code-generator" class="common-anchor-header">pymilvus-code-generator</h3><div style="padding:66.98% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1093504910?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="pymilvus-code-generator"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>
<p>このデモでは、<code translate="no">pymilvus</code> を使って全文検索コードを生成するようCursorに依頼した。Cursorは正しいMCPツールを正常に起動し、仕様に準拠したコードを出力する。ほとんどの<code translate="no">pymilvus</code> のユースケースは、このツールでシームレスに動作する。</p>
<p>以下は、このツールを使用した場合と使用しなかった場合の比較です。</p>
<p><strong>MCP MCPあり：</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/With_Milvus_MCP_f72ad4cfb6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>→Milvus付きカーソル MCPは最新の<code translate="no">MilvusClient</code> インタフェースを使用してコレクションを作成します。</p>
<p><strong>MCPなし</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Without_Milvus_MCP_3336d956a4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>→ Milvus MCPサーバーなしのCursorは、古いORM構文を使用しています。</p>
<h3 id="orm-client-code-convertor" class="common-anchor-header">ORMクライアントコードコンバータ</h3><div style="padding:66.98% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1093504859?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="orm-client-code-convertor"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>
<p>この例では、ユーザがORMスタイルのコードをハイライトし、変換を要求しています。このツールは、<code translate="no">MilvusClient</code> インスタンスを使用して、接続とスキーマのロジックを正しく書き換えます。ユーザーはワンクリックですべての変更を受け入れることができます。</p>
<h3 id="language-translator" class="common-anchor-header"><strong>言語トランスレータ</strong></h3><div style="padding:66.98% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/1093504885?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" style="position:absolute;top:0;left:0;width:100%;height:100%;" title="tool3 ts-1"></iframe></div><script src="https://player.vimeo.com/api/player.js"></script>
<p>ここでは、<code translate="no">.py</code> ファイルを選択し、TypeScript の翻訳を依頼する。このツールは適切なMCPエンドポイントを呼び出し、最新のTypeScript SDKドキュメントを取得し、同じビジネスロジックを持つ同等の<code translate="no">.ts</code> 。これは言語横断的なマイグレーションに理想的です。</p>
<h2 id="Comparing-Milvus-MCP-with-Context7-DeepWiki-and-Other-Tools" class="common-anchor-header">Milvus MCPとContext7、DeepWiki、その他のツールの比較<button data-href="#Comparing-Milvus-MCP-with-Context7-DeepWiki-and-Other-Tools" class="anchor-icon" translate="no">
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
    </button></h2><p>Vibe Codingで「ラストワンマイル」の幻覚問題について説明しました。私たちのMilvus MCP以外にも、Context7やDeepWikiなど、多くのツールがこの問題の解決を目指しています。これらのツールは、しばしばMCPやRAGによって駆動され、モデルのコンテキストウィンドウに最新のドキュメントやコードサンプルを注入するのに役立ちます。</p>
<h3 id="Context7" class="common-anchor-header">Context7</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Context7_fc32b53a0e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>図Context7のMilvusページでは、ユーザがドキュメントスニペットを検索したりカスタマイズしたりできる<a href="https://context7.com/milvus-io/milvus">(https://context7.com/milvus-io/milvus)</a></p>
<p>Context7は、LLMとAIコードエディタに、バージョンに応じた最新のドキュメントとコードサンプルを提供する。Context7は、LLMやAIコードエディタ向けに、バージョンに応じた最新のドキュメントとコード例を提供する。LLMは、使用するライブラリに関する古い情報や一般的な情報に依存しており、古いコード例や1年前のトレーニングデータに基づくコード例を提供している。</p>
<p>Context7 MCPは、最新の、バージョン固有のドキュメントとコード例をソースから直接取得し、あなたのプロンプトに直接配置します。GitHubレポのインポートや、<code translate="no">.md</code> 、<code translate="no">.mdx</code> 、<code translate="no">.txt</code> 、<code translate="no">.rst</code> 、<code translate="no">.ipynb</code> のような形式を含む<code translate="no">llms.txt</code> ファイルをサポートしています（<code translate="no">.py</code> ファイルはサポートしていません）。</p>
<p>ユーザーは、サイトからコンテンツを手動でコピーするか、Context7のMCP統合を使用して自動取得することができます。</p>
<h3 id="DeepWiki" class="common-anchor-header"><strong>DeepWiki</strong></h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Deep_Wiki_bebe01aa6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>図DeepWikiは、ロジックやアーキテクチャを含むMilvusの要約を自動生成します<a href="https://deepwiki.com/milvus-io/milvus">（https://deepwiki.com/milvus-io/milvus）。</a></p>
<p>DeepWikiはオープンソースのGitHubプロジェクトを自動解析し、読みやすい技術文書、ダイアグラム、フローチャートを作成する。自然言語によるQ&amp;Aのためのチャット・インターフェースも含まれている。しかし、ドキュメントよりもコードファイルを優先するため、ドキュメントに関する重要な洞察を見落とす可能性がある。現在のところ、MCPとの統合はありません。</p>
<h3 id="Cursor-Agent-Mode" class="common-anchor-header">Cursorエージェントモード</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Cursor_Agent_Mode_fba8ef66af.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Cursorのエージェントモードは、ウェブ検索、MCP呼び出し、プラグイントグルを可能にします。パワフルな反面、一貫性に欠けることがあります。<code translate="no">@</code> 、手動でドキュメントを挿入することができますが、その場合、最初にコンテンツを検索して添付する必要があります。</p>
<h3 id="llmstxt" class="common-anchor-header">llms.txt</h3><p><code translate="no">llms.txt</code> LLMに構造化されたウェブサイトのコンテンツを提供するために提案された標準です。通常、Markdownで、サイトのルートディレクトリに置かれ、タイトル、ドキュメントツリー、チュートリアル、APIリンクなどを整理する。</p>
<p>Markdownはそれ単体のツールではないが、Markdownをサポートするツールとは相性が良い。</p>
<h3 id="Side-by-Side-Feature-Comparison-Milvus-MCP-vs-Context7-vs-DeepWiki-vs-Cursor-Agent-Mode-vs-llmstxt" class="common-anchor-header">横並びの機能比較：Milvus MCP vs. Context7 vs. DeepWiki vs. Cursor Agent Mode vs llms.txt</h3><table>
<thead>
<tr><th style="text-align:center"></th><th style="text-align:center"></th><th style="text-align:center"></th><th style="text-align:center"></th><th style="text-align:center"></th><th style="text-align:center"></th></tr>
</thead>
<tbody>
<tr><td style="text-align:center"><strong>機能</strong></td><td style="text-align:center"><strong>Context7</strong></td><td style="text-align:center"><strong>DeepWiki</strong></td><td style="text-align:center"><strong>カーソルエージェントモード</strong></td><td style="text-align:center"><strong>llms.txt</strong></td><td style="text-align:center"><strong>Milvus MCP</strong></td></tr>
<tr><td style="text-align:center"><strong>ドキュメントハンドリング</strong></td><td style="text-align:center">ドキュメントのみ、コードなし</td><td style="text-align:center">コード重視、ドキュメントを見逃す可能性あり</td><td style="text-align:center">ユーザー選択</td><td style="text-align:center">構造化マークダウン</td><td style="text-align:center">Milvus公式ドキュメントのみ</td></tr>
<tr><td style="text-align:center"><strong>コンテキスト検索</strong></td><td style="text-align:center">自動インジェクト</td><td style="text-align:center">手動コピー/ペースト</td><td style="text-align:center">混在、精度が低い</td><td style="text-align:center">構造化された事前ラベル付け</td><td style="text-align:center">ベクターストアからの自動取得</td></tr>
<tr><td style="text-align:center"><strong>カスタムインポート</strong></td><td style="text-align:center">✅ GitHub, llms.txt</td><td style="text-align:center">GitHub (プライベートも含む)</td><td style="text-align:center">❌ 手動選択のみ</td><td style="text-align:center">手動でオーサリング ✅ 手動でオーサリング</td><td style="text-align:center">サーバーで管理 ❌ サーバーで管理</td></tr>
<tr><td style="text-align:center"><strong>手作業の努力</strong></td><td style="text-align:center">部分的（MCP対手動）</td><td style="text-align:center">手動コピー</td><td style="text-align:center">セミマニュアル</td><td style="text-align:center">管理者のみ</td><td style="text-align:center">ユーザー操作不要</td></tr>
<tr><td style="text-align:center"><strong>MCP統合</strong></td><td style="text-align:center">はい</td><td style="text-align:center">いいえ</td><td style="text-align:center">はい(セットアップが必要)</td><td style="text-align:center">❌ ツールではない</td><td style="text-align:center">必須</td></tr>
<tr><td style="text-align:center"><strong>利点</strong></td><td style="text-align:center">ライブアップデート、IDE対応</td><td style="text-align:center">ビジュアルダイアグラム、QAサポート</td><td style="text-align:center">カスタムワークフロー</td><td style="text-align:center">AI用構造化データ</td><td style="text-align:center">Milvus/Zillizによるメンテナンス</td></tr>
<tr><td style="text-align:center"><strong>制限事項</strong></td><td style="text-align:center">コードファイルのサポートなし</td><td style="text-align:center">ドキュメントをスキップ</td><td style="text-align:center">ウェブの精度に依存</td><td style="text-align:center">他のツールが必要</td><td style="text-align:center">Milvusのみに特化</td></tr>
</tbody>
</table>
<p>Milvus MCPはMilvusデータベース開発専用に開発されています。最新の公式ドキュメントを自動的に取得し、あなたのコーディング環境とシームレスに連携します。Milvusを使用するのであれば、これが最良の選択肢です。</p>
<p>Context7、DeepWiki、Cursor Agent Modeのような他のツールは様々な技術に対応していますが、Milvusに特化した作業には特化しておらず、精度も高くありません。</p>
<p>必要なものに応じて選択してください。良いニュースは、これらのツールは相性が良いということです。プロジェクトのさまざまな部分で最良の結果を得るために、複数のツールを同時に使用することができます。</p>
<h2 id="Milvus-MCP-is-Coming-Soon" class="common-anchor-header">Milvus MCPは近日公開予定です！<button data-href="#Milvus-MCP-is-Coming-Soon" class="anchor-icon" translate="no">
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
    </button></h2><p>Vibe Codingにおける幻覚の問題は、単なる些細な不便さではなく、開発者を手作業による検証ワークフローに逆戻りさせる生産性キラーです。MilvusのMCPサーバーは、最新のドキュメントへのリアルタイムアクセスを提供することで、この問題を解決することができます。</p>
<p>Milvusの開発者にとって、これはもう非推奨の<code translate="no">connections.connect()</code> 呼び出しをデバッグしたり、時代遅れのORMパターンと格闘する必要がないことを意味します。3つのツール-pymilvus-code-generator、orm-client-code-convertor、language-translatorは、最も一般的なペインポイントを自動的に処理します。</p>
<p>試す準備はできていますか？このサービスは間もなくアーリーアクセステストを開始する予定です。ご期待ください。</p>
