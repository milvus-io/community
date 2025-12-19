---
id: >-
  langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md
title: LangChain 1.0とmilvus：本物の長期記憶を持つプロダクション対応エージェントを構築する方法
author: Min Yin
date: 2025-12-19T00:00:00.000Z
cover: assets.zilliz.com/langchain1_0_cover_8c4bc608af.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, LangChain 1.0, AI Agent, vector database, LangGraph'
meta_title: >
  LangChain 1.0 and Milvus: Build Production-Ready AI Agents with Long-Term
  Memory
desc: >-
  LangChain
  1.0がいかにエージェント・アーキテクチャを簡素化し、milvusがいかにスケーラブルで量産可能なAIアプリケーションのために長期メモリを追加したかをご覧ください。
origin: >-
  https://milvus.io/blog/langchain-and-milvus-build-production-ready-agents-with-real-long-term-memory.md
---
<p>LangChainは、大規模な言語モデル（LLM）を利用したアプリケーションを開発するためのオープンソースのフレームワークです。推論やツールを使うエージェントを構築し、モデルを外部データに接続し、インタラクションフローを管理するためのモジュラーツールキットを提供します。</p>
<p><strong>LangChain 1.0の</strong>リリースにより、このフレームワークは、より生産に適したアーキテクチャへの一歩を踏み出しました。新バージョンでは、以前のチェーンベースの設計を標準化されたReActループ（Reason → Tool Call → Observe → Decide）に置き換え、実行、制御、安全性を管理するミドルウェアを導入しました。</p>
<p>しかし、推論だけでは十分ではない。エージェントには、情報を保存し、呼び出し、再利用する機能も必要だ。そこで、オープンソースのベクトルデータベースである<a href="https://milvus.io/"><strong>Milvusが</strong></a>重要な役割を果たすことができる。Milvusはスケーラブルで高性能なメモリレイヤーを提供し、エージェントが意味的類似性によって効率的に情報を保存、検索、取得できるようにします。</p>
<p>この投稿では、LangChain 1.0がエージェントアーキテクチャをどのように更新し、Milvusを統合することでエージェントが推論を超えること、つまり実世界のユースケースのための永続的でインテリジェントなメモリをどのように実現するかを探ります。</p>
<h2 id="Why-the-Chain-based-Design-Falls-Short" class="common-anchor-header">なぜチェーンベースの設計では不十分なのか<button data-href="#Why-the-Chain-based-Design-Falls-Short" class="anchor-icon" translate="no">
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
    </button></h2><p>初期の頃（バージョン0.x）、LangChainのアーキテクチャはChainが中心でした。各チェーンは固定されたシーケンスを定義し、LLMオーケストレーションをシンプルかつ高速にするテンプレートがあらかじめ用意されていました。このデザインは、素早くプロトタイプを作るには最適でした。しかし、LLMエコシステムが進化し、実際のユースケースがより複雑になるにつれ、このアーキテクチャに亀裂が入り始めた。</p>
<p><strong>1.柔軟性の欠如</strong></p>
<p>LangChainの初期バージョンは、SimpleSequentialChainやLLMChainのようなモジュラー・パイプラインを提供し、それぞれが固定された直線的なフロー（プロンプト作成→モデル呼び出し→出力処理）に従っていました。この設計は、単純で予測可能なタスクではうまく機能し、迅速にプロトタイプを作成しやすかった。</p>
<p>しかし、アプリケーションがよりダイナミックになるにつれ、このような硬直したテンプレートは制限的に感じられるようになりました。ビジネスロジックが定義済みのシーケンスにうまく収まらなくなると、2つの不満足な選択肢が残ります。</p>
<p><strong>2.プロダクション・グレードのコントロールの欠如</strong></p>
<p>デモではうまくいっていたことが、本番では壊れてしまうことがよくある。チェーンには、大規模で、永続的で、機密性の高いアプリケーションに必要なセーフガードは含まれていなかった。よくある問題は以下の通り：</p>
<ul>
<li><p><strong>コンテキストのオーバーフロー：</strong>長い会話はトークンの制限を超え、クラッシュやサイレント・トランケーションを引き起こす。</p></li>
<li><p><strong>機密データの漏洩：</strong>個人を特定できる情報（電子メールやIDなど）が、不注意でサードパーティのモデルに送信される可能性がある。</p></li>
<li><p><strong>監視されていない操作：</strong>エージェントが人間の承認なしにデータを削除したり、メールを送信したりする可能性がある。</p></li>
</ul>
<p><strong>3.モデル間の互換性の欠如</strong></p>
<p>各LLMプロバイダー（OpenAI、Anthropic、多くの中国モデル）は、推論とツール呼び出しのための独自のプロトコルを実装しています。プロバイダーを切り替えるたびに、統合レイヤー（プロンプトテンプレート、アダプター、レスポンスパーサー）を書き直す必要がありました。この繰り返しの作業は開発を遅らせ、実験を苦痛なものにしていた。</p>
<h2 id="LangChain-10-All-in-ReAct-Agent" class="common-anchor-header">LangChain 1.0：オールインReActエージェント<button data-href="#LangChain-10-All-in-ReAct-Agent" class="anchor-icon" translate="no">
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
    </button></h2><p>LangChainチームが何百ものプロダクショングレードのエージェント実装を分析したとき、一つの洞察が際立ちました。</p>
<p>マルチエージェントシステムであろうと、深い推論を行う単一のエージェントであろうと、同じ制御ループが浮かび上がります：短い推論ステップとターゲットとなるツールの呼び出しを交互に行い、エージェントが最終的な答えを出せるようになるまで、観察結果をその後の決定に反映させます。</p>
<p>この実績のある構造を基に、LangChain 1.0はReActループをアーキテクチャの中核に置き、信頼性が高く、解釈可能で、生産可能なエージェントを構築するためのデフォルトの構造としています。</p>
<p>単純なエージェントから複雑なオーケストレーションまでをサポートするために、LangChain 1.0は、使いやすさと正確な制御を兼ね備えたレイヤデザインを採用しています：</p>
<ul>
<li><p><strong>標準シナリオ</strong>標準シナリオ： create_agent()関数から始めましょう - 推論とツールコールをすぐに処理する、クリーンで標準化されたReActループです。</p></li>
<li><p><strong>拡張シナリオ：</strong>ミドルウェアを追加することで、きめ細かい制御が可能になります。ミドルウェアは、エージェント内部で起こることを検査または変更することができます - 例えば、PII検出、人間承認チェックポイント、自動再試行、または監視フックを追加します。</p></li>
<li><p><strong>複雑なシナリオ：</strong>ステートフルなワークフローや複数エージェントのオーケストレーションには、グラフベースの実行エンジンであるLangGraphを使用します。LangGraphは、ロジックフロー、依存関係、実行状態を正確に制御することができます。</p></li>
</ul>
<p>それでは、エージェント開発をよりシンプルに、より安全に、そしてモデル間でより一貫したものにする3つの主要なコンポーネントを分解してみましょう。</p>
<h3 id="1-The-createagent-A-Simpler-Way-to-Build-Agents" class="common-anchor-header">1.create_agent()：よりシンプルなエージェント構築方法</h3><p>LangChain 1.0での重要なブレークスルーは、エージェントを構築する複雑さを一つの関数 - create_agent()- に集約したことです。状態管理、エラー処理、ストリーミング出力を手動で処理する必要がなくなりました。これらのプロダクションレベルの機能は、LangGraphランタイムが自動的に管理します。</p>
<p>たった3つのパラメータで、完全に機能するエージェントを起動することができます：</p>
<ul>
<li><p><strong>model</strong>- モデル識別子（文字列）またはインスタンス化されたモデルオブジェクト。</p></li>
<li><p><strong>tools</strong>- エージェントに能力を与える関数のリスト。</p></li>
<li><p><strong>system_prompt</strong>- エージェントの役割、トーン、動作を定義する命令。</p></li>
</ul>
<p>create_agent()は、標準的なエージェントのループで実行されます - モデルを呼び出し、実行するツールを選択させ、ツールが不要になったら終了します：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/langchain_chain_1_1192c31ce3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>また、状態の永続化、中断の回復、ストリーミングといったLangGraphの組み込み機能も継承しています。かつては何百行ものオーケストレーションコードが必要だったタスクが、今では単一の宣言的APIで処理されます。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.<span class="hljs-property">agents</span> <span class="hljs-keyword">import</span> create_agent
agent = <span class="hljs-title function_">create_agent</span>(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[get_weather, query_database],
    system_prompt=<span class="hljs-string">&quot;You are a customer service assistant who helps users check the weather and order information.&quot;</span>
)
result = agent.<span class="hljs-title function_">invoke</span>({
    <span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;What’s the weather like in Shanghai today?&quot;</span>}]
})
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-The-Middleware-A-Composable-Layer-for-Production-Ready-Control" class="common-anchor-header">2.ミドルウェア：プロダクション・レディな制御のためのコンポーザブル・レイヤー</h3><p>ミドルウェアは、LangChainをプロトタイプからプロダクションに移行させる重要な橋渡し役です。エージェントの実行ループの戦略的なポイントでフックを公開し、コアとなるReActプロセスを書き換えることなくカスタムロジックを追加できるようにします。</p>
<p>エージェントのメインループは、モデル→ツール→終了という3段階の決定プロセスに従います：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/langchain_1_0_chain_902054bde2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>LangChain 1.0は、一般的なパターンに対応するいくつかの<a href="https://docs.langchain.com/oss/python/langchain/middleware#built-in-middleware">ミドルウェアをあらかじめ</a>用意しています。以下に4つの例を挙げます。</p>
<ul>
<li><strong>PII検出：機密性の高いユーザーデータを扱うアプリケーション</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> PIIMiddleware


agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[],  <span class="hljs-comment"># Add tools as needed</span>
    middleware=[
        <span class="hljs-comment"># Redact emails in user input</span>
        PIIMiddleware(<span class="hljs-string">&quot;email&quot;</span>, strategy=<span class="hljs-string">&quot;redact&quot;</span>, apply_to_input=<span class="hljs-literal">True</span>),
        <span class="hljs-comment"># Mask credit cards (show last 4 digits)</span>
        PIIMiddleware(<span class="hljs-string">&quot;credit_card&quot;</span>, strategy=<span class="hljs-string">&quot;mask&quot;</span>, apply_to_input=<span class="hljs-literal">True</span>),
        <span class="hljs-comment"># Custom PII type with regex</span>
        PIIMiddleware(
            <span class="hljs-string">&quot;api_key&quot;</span>,
            detector=<span class="hljs-string">r&quot;sk-[a-zA-Z0-9]{32}&quot;</span>,
            strategy=<span class="hljs-string">&quot;block&quot;</span>,  <span class="hljs-comment"># Raise error if detected</span>
        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>要約：トークン制限に近づいた時に、会話履歴を自動的に要約する。</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> SummarizationMiddleware


agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[weather_tool, calculator_tool],
    middleware=[
        SummarizationMiddleware(
            model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>,  <span class="hljs-comment">#Summarize using a cheaper model  </span>
            max_tokens_before_summary=<span class="hljs-number">4000</span>,  <span class="hljs-comment"># Trigger summarization at 4000 tokens</span>
            messages_to_keep=<span class="hljs-number">20</span>,  <span class="hljs-comment"># Keep last 20 messages after summary</span>
        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>ツールの再試行：設定可能な指数バックオフを使用して、失敗したツールコールを自動的に再試行します。</strong></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> ToolRetryMiddleware
agent = create_agent(
    model=<span class="hljs-string">&quot;gpt-4o&quot;</span>,
    tools=[search_tool, database_tool],
    middleware=[
        ToolRetryMiddleware(
            max_retries=<span class="hljs-number">3</span>,  <span class="hljs-comment"># Retry up to 3 times</span>
            backoff_factor=<span class="hljs-number">2.0</span>,  <span class="hljs-comment"># Exponential backoff multiplier</span>
            initial_delay=<span class="hljs-number">1.0</span>,  <span class="hljs-comment"># Start with 1 second delay</span>
            max_delay=<span class="hljs-number">60.0</span>,  <span class="hljs-comment"># Cap delays at 60 seconds</span>
            jitter=<span class="hljs-literal">True</span>,  <span class="hljs-comment"># Add random jitter to avoid thundering herd (±25%)</span>

        ),
    ],
)
<button class="copy-code-btn"></button></code></pre>
<ul>
<li><strong>カスタムミドルウェア</strong></li>
</ul>
<p>公式のビルド済みミドルウェアオプションに加えて、デコレータベースまたはクラスベースの方法でカスタムミドルウェアを作成することもできます。</p>
<p>例えば、以下のスニペットは、実行前にモデルコールをログに記録する方法を示しています：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> before_model
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> AgentState
<span class="hljs-keyword">from</span> langgraph.runtime <span class="hljs-keyword">import</span> Runtime
<span class="hljs-meta">@before_model</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">log_before_model</span>(<span class="hljs-params">state: AgentState, runtime: Runtime</span>) -&gt; <span class="hljs-built_in">dict</span> | <span class="hljs-literal">None</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;About to call model with <span class="hljs-subst">{<span class="hljs-built_in">len</span>(state[<span class="hljs-string">&#x27;messages&#x27;</span>])}</span> messages&quot;</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-literal">None</span>  <span class="hljs-comment"># Returning None means the normal flow continues</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[...],
    middleware=[log_before_model],
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Structured-Output-A-Standardized-Way-to-Handle-Data" class="common-anchor-header">3.構造化出力：データを扱う標準化された方法</h3><p>従来のエージェント開発では、構造化出力の管理は常に困難でした。例えば、OpenAIはネイティブの構造化出力APIを提供していますが、他のプロバイダはツールコールを通して間接的に構造化応答をサポートしているだけです。これはしばしば、各プロバイダ用にカスタムアダプタを書くことを意味し、余分な作業を増やし、メンテナンスに必要以上に手間をかけます。</p>
<p>LangChain 1.0では、構造化出力はcreate_agent()のresponse_formatパラメータを通して直接扱われます。  データスキーマを一度定義するだけです。LangChainは、あなたが使っているモデルに基づいて、自動的に最適な実施戦略を選びます。余分なセットアップやベンダー固有のコードは必要ありません。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> pydantic <span class="hljs-keyword">import</span> BaseModel, Field
<span class="hljs-keyword">class</span> <span class="hljs-title class_">WeatherReport</span>(<span class="hljs-title class_ inherited__">BaseModel</span>):
    location: <span class="hljs-built_in">str</span> = Field(description=<span class="hljs-string">&quot;City name&quot;</span>)
    temperature: <span class="hljs-built_in">float</span> = Field(description=<span class="hljs-string">&quot;Temperature (°C)&quot;</span>)
    condition: <span class="hljs-built_in">str</span> = Field(description=<span class="hljs-string">&quot;Weather condition&quot;</span>)
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[get_weather],
    response_format=WeatherReport  <span class="hljs-comment"># Use the Pydantic model as the response schema</span>
)
result = agent.invoke({<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;What’s the weather like in Shanghai today??&quot;</span>})
weather_data = result[<span class="hljs-string">&#x27;structured_response&#x27;</span>]  <span class="hljs-comment"># Retrieve the structured response</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{weather_data.location}</span>: <span class="hljs-subst">{weather_data.temperature}</span>°C, <span class="hljs-subst">{weather_data.condition}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>LangChainは構造化出力のために2つの戦略をサポートします：</p>
<p><strong>1.プロバイダ戦略：</strong>一部のモデルプロバイダは、APIを通じて構造化出力をネイティブにサポートしています（OpenAIやGrokなど）。そのようなサポートが利用可能な場合、LangChainはプロバイダの組み込みスキーマ強制を直接利用します。このアプローチは、モデル自身が出力フォーマットを保証するため、最高レベルの信頼性と一貫性を提供します。</p>
<p><strong>2.ツール呼び出し戦略：</strong>ネイティブの構造化出力をサポートしないモデルの場合、LangChainはツール呼び出しを使って同じ結果を得ます。</p>
<p>フレームワークがモデルの能力を検出し、自動的に適応します。この抽象化により、ビジネスロジックを変更することなく、モデルプロバイダを自由に切り替えることができます。</p>
<h2 id="How-Milvus-Enhances-Agent-Memory" class="common-anchor-header">Milvusがエージェントのメモリを強化する方法<button data-href="#How-Milvus-Enhances-Agent-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>プロダクショングレードのエージェントにとって、パフォーマンスのボトルネックは推論エンジンではなく、メモリシステムです。LangChain 1.0では、ベクトルデータベースがエージェントの外部メモリとして機能し、意味検索による長期的な記憶を提供します。</p>
<p><a href="https://milvus.io/">Milvusは</a>現在利用可能なオープンソースのベクトルデータベースの中で最も成熟したものの一つで、AIアプリケーションにおける大規模なベクトル検索のために構築されています。LangChainとネイティブに統合されているため、ベクトル化、インデックス管理、類似検索を手動で処理する必要がありません。langchain_milvusパッケージは、Milvusを標準的なVectorStoreインターフェイスとしてラップし、わずか数行のコードでエージェントに接続できるようにします。</p>
<p>そうすることで、Milvusはスケーラブルで信頼性の高いエージェントメモリシステムを構築する上での3つの重要な課題に対処します：</p>
<h4 id="1-Fast-Retrieval-from-Massive-Knowledge-Bases" class="common-anchor-header"><strong>1.膨大な知識ベースからの高速検索</strong></h4><p>エージェントが何千もの文書、過去の会話、製品マニュアルを処理する必要がある場合、単純なキーワード検索では不十分です。Milvusはベクトル類似性検索を使用し、クエリの文言が異なっていても、意味的に関連する情報を数ミリ秒で検索します。これにより、エージェントはテキストの完全一致だけでなく、意味に基づいて知識を呼び出すことができます。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain_openai <span class="hljs-keyword">import</span> OpenAIEmbeddings
<span class="hljs-comment"># Initialize the vector database as a knowledge base</span>
vectorstore = Milvus(
    embedding=OpenAIEmbeddings(),  
    collection_name=<span class="hljs-string">&quot;company_knowledge&quot;</span>,
    connection_args={<span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;http://localhost:19530&quot;</span>}  <span class="hljs-comment">#</span>
)
<span class="hljs-comment"># Convert the retriever into a Tool for the Agent</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[vectorstore.as_retriever().as_tool(
        name=<span class="hljs-string">&quot;knowledge_search&quot;</span>,
        description=<span class="hljs-string">&quot;Search the company knowledge base to answer professional questions&quot;</span>
    )],
    system_prompt=<span class="hljs-string">&quot;You can retrieve information from the knowledge base to answer questions.&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="2-Persistent-Long-Term-Memory" class="common-anchor-header"><strong>2.永続的な長期記憶</strong></h4><p>LangChainのSummarizationMiddlewareは、会話履歴が長くなりすぎた場合、それを要約することができます。milvusはそれらを保持する。すべての会話、ツールコール、推論ステップはベクトル化され、長期参照用に保存されます。必要なとき、エージェントはセマンティック検索によって関連する記憶を素早く取り出すことができ、セッションを超えた真の継続性を可能にする。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> SummarizationMiddleware
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> InMemorySaver
<span class="hljs-comment"># Long-term memory storage(Milvus)</span>
long_term_memory = Milvus.from_documents(
    documents=[],  <span class="hljs-comment"># Initially empty; dynamically updated at runtime</span>
    embedding=OpenAIEmbeddings(),
    connection_args={<span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;./agent_memory.db&quot;</span>}
)
<span class="hljs-comment"># Short-term memory management(LangGraph Checkpointer + Summarization)</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[long_term_memory.as_retriever().as_tool(
        name=<span class="hljs-string">&quot;recall_memory&quot;</span>,
        description=<span class="hljs-string">&quot;Retrieve the agent’s historical memories and past experiences&quot;</span>
    )],
    checkpointer=InMemorySaver(),  <span class="hljs-comment"># Short-term memory</span>
    middleware=[
        SummarizationMiddleware(
            model=<span class="hljs-string">&quot;openai:gpt-4o-mini&quot;</span>,
            max_tokens_before_summary=<span class="hljs-number">4000</span>  <span class="hljs-comment"># When the threshold is exceeded, summarize and store it in Milvus</span>
        )
    ]
)
<button class="copy-code-btn"></button></code></pre>
<h4 id="3-Unified-Management-of-Multimodal-Content" class="common-anchor-header"><strong>3.マルチモーダルコンテンツの統合管理</strong></h4><p>最新のエージェントはテキストだけでなく、画像、音声、ビデオも扱います。Milvusはマルチベクターストレージとダイナミックスキーマをサポートしており、複数のモダリティのエンベッディングを一つのシステムで管理することができます。これにより、マルチモーダルエージェントに統一されたメモリ基盤を提供し、異なるタイプのデータ間で一貫した検索を可能にします。</p>
<pre><code translate="no"><span class="hljs-comment"># Filter retrievals by source (e.g., search only medical reports)</span>
vectorstore.similarity_search(
    query=<span class="hljs-string">&quot;What is the patient&#x27;s blood pressure reading?&quot;</span>,
    k=<span class="hljs-number">3</span>,
    expr=<span class="hljs-string">&quot;source == &#x27;medical_reports&#x27; AND modality == &#x27;text&#x27;&quot;</span>  <span class="hljs-comment"># Milvus scalar filtering</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="LangChain-vs-LangGraph-How-to-Choose-the-One-That-Fits-for-Your-Agents" class="common-anchor-header">LangChainとLangGraphの比較：エージェントに合ったものを選ぶ方法<button data-href="#LangChain-vs-LangGraph-How-to-Choose-the-One-That-Fits-for-Your-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>LangChain 1.0へのアップグレードは、プロダクショングレードのエージェントを構築するための重要なステップです。適切なフレームワークを選択することで、これらの機能をいかに早く、実用的で保守可能なシステムに組み込めるかが決まります。</p>
<p>実際、LangChain 1.0とLangGraph 1.0は同じレイヤースタックの一部であり、お互いを置き換えるのではなく、一緒に働くように設計されています：LangChainは標準的なエージェントを素早く構築するのに役立ち、LangGraphは複雑なワークフローをきめ細かく制御します。言い換えれば、LangChainは高速化を支援し、LangGraphは深化を支援します。</p>
<p>以下に、両者の技術的な位置づけの違いを簡単に比較します：</p>
<table>
<thead>
<tr><th><strong>寸法</strong></th><th><strong>LangChain 1.0</strong></th><th><strong>LangChain 1.0</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>抽象度</strong></td><td>高レベルの抽象化、標準的なエージェントシナリオ向けに設計</td><td>複雑なワークフロー用に設計された低レベルのオーケストレーションフレームワーク</td></tr>
<tr><td><strong>コア機能</strong></td><td>標準的なReActループ（Reason → Tool Call → Observation → Response）</td><td>カスタムステートマシンと複雑な分岐ロジック（StateGraph + 条件ルーティング）</td></tr>
<tr><td><strong>拡張メカニズム</strong></td><td>プロダクショングレードの機能のためのミドルウェア</td><td>ノード、エッジ、状態遷移の手動管理</td></tr>
<tr><td><strong>基盤となる実装</strong></td><td>ノード、エッジ、状態遷移の手動管理</td><td>永続性とリカバリを組み込んだネイティブランタイム</td></tr>
<tr><td><strong>典型的な使用例</strong></td><td>標準的なエージェントシナリオの80</td><td>マルチエージェントコラボレーションと長期ワークフローオーケストレーション</td></tr>
<tr><td><strong>学習曲線</strong></td><td>10行程度のコードでエージェントを構築</td><td>ステートグラフとノードオーケストレーションの理解が必要</td></tr>
</tbody>
</table>
<p>エージェントを構築するのが初めての方や、プロジェクトを素早く立ち上げたい方は、LangChainから始めましょう。複雑なオーケストレーション、複数エージェントの連携、長期的なワークフローを必要とするユースケースであれば、LangGraphから始めましょう。</p>
<p>LangChainでシンプルに始めて、システムがよりコントロールと柔軟性を必要とするときにLangGraphを導入すればいいのです。重要なのは、ワークフローの各部分に適したツールを選ぶことです。</p>
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
    </button></h2><p>年前、LangChainはLLMを呼び出すための軽量ラッパーとして始まりました。現在では、完全なプロダクショングレードのフレームワークに成長した。</p>
<p>コアとなるミドルウェア層は、安全性、コンプライアンス、観測性を提供します。LangGraphは永続的な実行、制御フロー、状態管理を提供する。<a href="https://milvus.io/">Milvusは</a>、スケーラブルで信頼性の高い長期メモリを提供し、エージェントがコンテキストを取得し、履歴を推論し、時間の経過とともに改善することを可能にします。</p>
<p>LangChain、LangGraph、そしてMilvusは、信頼性やパフォーマンスを犠牲にすることなく、ラピッドプロトタイピングとエンタープライズスケールのデプロイメントの橋渡しをします。</p>
<p>🚀 エージェントに信頼性の高い長期的なメモリを持たせる準備はできていますか？LangChainエージェントのインテリジェントな長期記憶をどのように実現するか、<a href="https://milvus.io">Milvusを</a>ご覧ください。</p>
<p>ご質問がある場合、または機能について深く知りたい場合は、Discordチャンネルにご参加ください。私たちの<a href="https://discord.com/invite/8uyFbECzPX">Discordチャンネルに</a>参加するか、<a href="https://github.com/milvus-io/milvus">GitHubに</a>課題を提出してください。また、<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvusオフィスアワーを通して</a>、20分間の1対1のセッションを予約し、洞察やガイダンス、質問への回答を得ることもできます。</p>
