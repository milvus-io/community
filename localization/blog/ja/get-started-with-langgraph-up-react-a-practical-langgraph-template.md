---
id: get-started-with-langgraph-up-react-a-practical-langgraph-template.md
title: langgraph-up-reactを始めよう：実用的なLangGraphテンプレート
author: Min Yin
date: 2025-09-11T00:00:00.000Z
desc: ReActエージェント用のLangGraph + ReActテンプレート、langgraph-up-reactを紹介します。
cover: assets.zilliz.com/Chat_GPT_Image_Sep_12_2025_12_09_04_PM_804305620a.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LangGraph, ReAct'
meta_keywords: 'Milvus, AI Agents, LangGraph, ReAct, langchain'
meta_title: |
  Getting Started with langgraph-up-react: A LangGraph Template
origin: >-
  https://milvus.io/blog/get-started-with-langgraph-up-react-a-practical-langgraph-template.md
---
<p>AIエージェントは、応用AIにおける中核的なパターンになりつつある。より多くのプロジェクトが、単一のプロンプトを越えて、意思決定ループにモデルを配線している。それはとてもエキサイティングなことですが、ステートの管理、ツールの調整、分岐の処理、人間によるハンドオフの追加など、すぐにはわからないことを意味します。</p>
<p><a href="https://github.com/langchain-ai/langgraph"><strong>LangGraphは</strong></a>このレイヤーの有力な選択肢だ。LangGraphはAIフレームワークで、ループ、条件分岐、永続性、人間がループの中でコントロールする機能、ストリーミングなど、アイデアを実際のマルチエージェント・アプリにするのに十分な構造を備えている。しかし、LangGraphの学習曲線は険しい。ドキュメントの動きは速く、抽象化された機能に慣れるには時間がかかり、簡単なデモから製品のようなものにジャンプするのはフラストレーションが溜まります。</p>
<p>最近、私は<a href="https://github.com/webup/langgraph-up-react"><strong>langgraph-up-reactという</strong></a>ReActエージェント用のLangGraph + ReActテンプレートを使い始めました。このテンプレートは、セットアップの手間を省き、まともなデフォルトが同梱されており、定型文の代わりに動作に集中することができます。この投稿では、このテンプレートを使ってLangGraphを始める方法を説明します。</p>
<h2 id="Understanding-ReAct-Agents" class="common-anchor-header">ReActエージェントを理解する<button data-href="#Understanding-ReAct-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>テンプレート自体に飛び込む前に、これから作るエージェントの種類を見ておきましょう。現在最も一般的なパターンの一つは<strong>ReAct（Reason + Act）</strong>フレームワークで、Googleの2022年の論文<em>"</em><a href="https://arxiv.org/abs/2210.03629"><em>ReAct：ReAct: Synergizing Reasoning and Acting in Language Models</em></a><em>"</em>で初めて紹介<a href="https://arxiv.org/abs/2210.03629"><em>された。</em></a></p>
<p>ReActは、推論と行動を別々に扱うのではなく、人間の問題解決によく似たフィードバックループに統合する。エージェントは問題について<strong>推論し</strong>、ツールやAPIを呼び出して<strong>行動</strong>し、結果を<strong>観察してから</strong>次の行動を決定する。このシンプルなサイクル-理由→行動→観察-により、エージェントは固定されたスクリプトに従うのではなく、動的に適応することができる。</p>
<p>以下は、このシンプルなサイクルがどのように組み合わされているかを示している：</p>
<ul>
<li><p><strong>理由</strong>：このモデルは問題をステップに分け、戦略を立て、途中で間違いを修正することもできる。</p></li>
<li><p><strong>行動</strong>：推論に基づき、エージェントはツールを呼び出します-それが検索エンジンであれ、計算機であれ、独自のカスタムAPIであれ。</p></li>
<li><p><strong>観察する</strong>：エージェントはツールの出力を見て、結果をフィルタリングし、次の推論にフィードバックする。</p></li>
</ul>
<p>このループは、すぐに現代のAIエージェントのバックボーンとなった。ChatGPTプラグイン、RAGパイプライン、知的アシスタント、そしてロボット工学でさえ、その痕跡を見ることができる。私たちの場合は、<code translate="no">langgraph-up-react</code> テンプレートがその上に構築される基盤となっている。</p>
<h2 id="Understanding-LangGraph" class="common-anchor-header">LangGraphを理解する<button data-href="#Understanding-LangGraph" class="anchor-icon" translate="no">
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
    </button></h2><p>さて、ReActパターンを見てきましたが、次の疑問は、そのようなものを実際にどのように実装するかということです。ほとんどの言語モデルはマルチステップ推論をうまく扱うことができません。各呼び出しはステートレスである。モデルは答えを生成し、それが終わるとすぐにすべてを忘れてしまう。そのため、中間的な結果を持ち越したり、前のステップに基づいて後のステップを調整することが難しいのです。</p>
<p><a href="https://github.com/langchain-ai/langgraph"><strong>LangGraphは</strong></a>このギャップを埋める。すべてのプロンプトを一回限りのものとして扱うのではなく、複雑なタスクをステップに分け、各ポイントで何が起こったかを記憶し、現在の状態に基づいて次に何をすべきかを決定する方法を提供します。言い換えれば、エージェントの推論プロセスを、その場限りのプロンプトの連鎖ではなく、構造化された反復可能なものに変えるのです。</p>
<p><strong>AIの推論のフローチャートの</strong>ように考えることができる：</p>
<ul>
<li><p>ユーザーからの問い合わせを<strong>分析する</strong></p></li>
<li><p>作業に適したツールを<strong>選択</strong>する。</p></li>
<li><p>ツールを呼び出してタスクを<strong>実行する</strong></p></li>
<li><p>結果を<strong>処理する</strong></p></li>
<li><p>タスクが完了したかどうかを<strong>チェック</strong>し、完了していない場合はループバックして推論を続ける</p></li>
<li><p>最終的な答えを<strong>出力</strong></p></li>
</ul>
<p>その過程で、LangGraphは以前のステップの結果が失われないように<strong>メモリストレージを</strong>処理し、<strong>外部ツールライブラリ</strong>（API、データベース、検索、計算機、ファイルシステム等）と統合します。</p>
<p>これが<em>LangGraphと</em>呼ばれる理由だ：<strong>Lang（言語）＋Graph（グラフ）-</strong>言語モデルが時間とともにどのように考え、どのように行動するかを整理するためのフレームワークです。</p>
<h2 id="Understanding-langgraph-up-react" class="common-anchor-header">ランググラフ・アップリアクトを理解する<button data-href="#Understanding-langgraph-up-react" class="anchor-icon" translate="no">
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
    </button></h2><p>LangGraphは強力ですが、オーバーヘッドを伴います。状態管理の設定、ノードとエッジの設計、エラーの処理、モデルとツールの配線など、すべてに時間がかかります。また、マルチステップフローのデバッグも大変です。何かが壊れたとき、問題はどのノードやトランジションにあるかもしれません。プロジェクトが成長するにつれ、小さな変更であってもコードベースに波及し、すべてが遅くなる可能性がある。</p>
<p>そこで、成熟したテンプレートが大きな違いを生む。ゼロから始める代わりに、テンプレートを使えば、実績のある構造、あらかじめ構築されたツール、そしてただ動くスクリプトが手に入る。定型文をスキップして、エージェントロジックに直接集中することができます。</p>
<p><a href="https://github.com/webup/langgraph-up-react"><strong>langgraph-up-reactは</strong></a>、そのようなテンプレートの一つです。このテンプレートは、LangGraph ReActエージェントを素早く立ち上げるために設計されています：</p>
<ul>
<li><p>🔧<strong>組み込みツールエコシステム</strong>： アダプタやユーティリティがすぐに使えます。</p></li>
<li><p>⚡<strong>クイックスタート</strong>：簡単な設定で、数分でエージェントが動作します。</p></li>
<li><p>🧪<strong>テスト</strong>機能: ユニットテストと統合テストにより、拡張の信頼性を確保</p></li>
<li><p>📦<strong>プロダクション対応セットアップ</strong>: デプロイ時の時間を節約するアーキテクチャパターンとスクリプト</p></li>
</ul>
<p>要するに、ビジネス上の問題を実際に解決するエージェントの構築に集中できるように、定型的なことはすべて行います。</p>
<h2 id="Getting-Started-with-the-langgraph-up-react-Template" class="common-anchor-header">langgraph-up-reactテンプレートで始める<button data-href="#Getting-Started-with-the-langgraph-up-react-Template" class="anchor-icon" translate="no">
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
    </button></h2><p>テンプレートを実行するのは簡単です。ここではセットアップの手順を説明します：</p>
<ol>
<li>環境依存のインストール</li>
</ol>
<pre><code translate="no">curl -<span class="hljs-title class_">LsSf</span> <span class="hljs-attr">https</span>:<span class="hljs-comment">//astral.sh/uv/install.sh | sh</span>
<button class="copy-code-btn"></button></code></pre>
<ol start="2">
<li>プロジェクトのクローン</li>
</ol>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/webup/langgraph-up-react.git
<span class="hljs-built_in">cd</span> langgraph-up-react
<button class="copy-code-btn"></button></code></pre>
<ol start="3">
<li>依存関係のインストール</li>
</ol>
<pre><code translate="no">uv <span class="hljs-built_in">sync</span> --dev
<button class="copy-code-btn"></button></code></pre>
<ol start="4">
<li>環境を設定する</li>
</ol>
<p>サンプルの設定をコピーし、キーを追加します：</p>
<pre><code translate="no"><span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p>.envを編集し、少なくとも1つのモデルプロバイダとTavily APIキーを設定します：</p>
<pre><code translate="no">TAVILY_API_KEY=your-tavily-api-key      <span class="hljs-comment"># Required for web search  </span>
DASHSCOPE_API_KEY=your-dashscope-api-key  <span class="hljs-comment"># Qwen (default recommended)  </span>
OPENAI_API_KEY=your-openai-api-key        <span class="hljs-comment"># OpenAI or compatible platforms  </span>
<span class="hljs-comment"># OPENAI_API_BASE=https://your-api-endpoint  # If using OpenAI-compatible API  </span>
REGION=us                <span class="hljs-comment"># Optional: region flag  </span>
ENABLE_DEEPWIKI=true      <span class="hljs-comment"># Optional: enable document tools  </span>
<button class="copy-code-btn"></button></code></pre>
<ol start="5">
<li>プロジェクトを開始する</li>
</ol>
<pre><code translate="no"><span class="hljs-comment"># Start development server (without UI)</span>
make dev

<span class="hljs-comment"># Start development server with LangGraph Studio UI</span>
make dev_ui
<button class="copy-code-btn"></button></code></pre>
<p>これで開発サーバーが立ち上がり、テストの準備が整いました。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/template_set_up_a42d1819ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="What-Can-You-Build-with-langgraph-up-react" class="common-anchor-header">langgraph-up-reactで何ができますか？<button data-href="#What-Can-You-Build-with-langgraph-up-react" class="anchor-icon" translate="no">
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
    </button></h2><p>では、テンプレートが稼働したら実際に何ができるのでしょうか？ここでは、実際のプロジェクトでどのように適用できるかを示す2つの具体例を示します。</p>
<h3 id="Enterprise-Knowledge-Base-QA-Agentic-RAG" class="common-anchor-header">企業内ナレッジベースQ&amp;A（Agentic RAG）</h3><p>一般的なユースケースは、企業知識のための社内Q&amp;Aアシスタントです。製品マニュアル、テクニカルドキュメント、FAQ-有用だが散在している情報-を考えてみてください。<code translate="no">langgraph-up-react</code> を使えば、<a href="https://milvus.io/"><strong>Milvusの</strong></a>ベクトルデータベースにこれらのドキュメントをインデックス化し、最も関連性の高い文章を検索し、文脈に基づいた正確な回答を生成するエージェントを作成することができます。</p>
<p>Milvusは柔軟なオプションを提供しています：迅速なプロトタイピングのための<strong>Lite</strong>、中規模のプロダクションワークロードのための<strong>Standalone</strong>、そしてエンタープライズ規模のシステムのための<strong>Distributed</strong>です。また、速度と精度のバランスを取るためにインデックス・パラメータ（HNSWなど）を調整し、負荷がかかってもシステムが信頼性を維持できるように、待ち時間やリコールに関するモニタリングを設定する必要がある。</p>
<h3 id="Multi-Agent-Collaboration" class="common-anchor-header">マルチエージェントコラボレーション</h3><p>もう一つの強力なユースケースはマルチエージェントコラボレーションです。1つのエージェントがすべてを行うのではなく、複数の専門エージェントを定義し、それらを連携させます。例えばソフトウェア開発のワークフローでは、プロダクトマネージャエージェントが要件を分解し、アーキテクトエージェントが設計を立案し、デベロッパエージェントがコードを書き、テスティングエージェントが結果を検証します。</p>
<p>このオーケストレーションは、LangGraphの強みである状態管理、分岐、エージェント間の協調を際立たせます。このセットアップについては後の記事で詳しく説明しますが、重要なポイントは、<code translate="no">langgraph-up-react</code> を使えば、何週間も雛形作りに費やすことなく、これらのパターンを試すことができるということです。</p>
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
    </button></h2><p>信頼性の高いエージェントを構築することは、単に賢いプロンプトのためだけではありません。LangGraphはそのためのフレームワークを提供し、<code translate="no">langgraph-up-react</code> は、エージェントの動作に集中できるように、定型文を処理することで障壁を低くします。</p>
<p>このテンプレートを使えば、ナレッジベースのQ&amp;Aシステムやマルチエージェントワークフローのようなプロジェクトを、セットアップに迷うことなく立ち上げることができます。時間を節約し、ありがちな落とし穴を避け、LangGraphの実験をはるかにスムーズにする出発点です。</p>
<p>次回は、このテンプレートを拡張し、LangGraph、<code translate="no">langgraph-up-react</code> 、Milvusベクトルデータベースを使って、実際のユースケースに対応したエージェントを構築する方法をステップ・バイ・ステップで紹介します。ご期待ください。</p>
