---
id: how-to-build-productionready-ai-agents-with-deep-agents-and-milvus.md
title: ディープエージェントとmilvusを使った生産準備の整ったAIエージェントの構築方法
author: Min Yin
date: 2026-03-02T00:00:00.000Z
cover: assets.zilliz.com/cover_deepagents_b45edd5f94.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Deep Agents, AI agents, Milvus vector database, LangChain agents, persistent
  agent memory
meta_title: |
  How to Build Production-Ready AI Agents with Deep Agents
desc: Deep AgentsとMilvusを使用したスケーラブルなAIエージェントの構築方法をご紹介します。
origin: >-
  https://milvus.io/blog/how-to-build-productionready-ai-agents-with-deep-agents-and-milvus.md
---
<p>より多くのチームがAIエージェントを構築しており、彼らに割り当てるタスクはより複雑になっている。実世界のワークフローの多くは、複数のステップと多くのツールコールを伴う長時間ジョブを含んでいる。このようなタスクが増えるにつれて、トークンのコスト上昇とモデルのコンテキストウィンドウの限界という2つの問題がすぐに現れます。エージェントはまた、過去の研究結果やユーザーの好み、以前の会話など、セッションをまたいで情報を記憶する必要があることも多い。</p>
<p>LangChainがリリースした<a href="https://docs.langchain.com/oss/python/deepagents/overview"><strong>Deep Agentsの</strong></a>ようなフレームワークは、これらのワークフローを整理するのに役立つ。タスクプランニング、ファイルアクセス、サブエージェントの委譲をサポートし、構造化されたエージェントの実行方法を提供する。これにより、長いマルチステップのタスクをより確実に処理できるエージェントの構築が容易になる。</p>
<p>しかし、ワークフローだけでは十分ではありません。エージェントは、以前のセッションから有用な情報を取り出すことができるように、<strong>長期記憶も</strong>必要とする。そこで、オープンソースのベクトルデータベースである<a href="https://milvus.io/"><strong>Milvusの</strong></a>出番となる。Milvusは、会話、ドキュメント、ツールの結果を埋め込んで保存することで、エージェントが過去の知識を検索して呼び出すことを可能にします。</p>
<p>この記事では、Deep Agentsの仕組みを説明し、Milvusと組み合わせて、構造化されたワークフローと長期記憶を持つAIエージェントを構築する方法を紹介する。</p>
<h2 id="What-Is-Deep-Agents" class="common-anchor-header">Deep Agentsとは？<button data-href="#What-Is-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Deep Agentsは</strong>LangChainチームによって構築されたオープンソースのエージェントフレームワークです。このフレームワークは、エージェントが長期にわたるマルチステップタスクをより確実に処理できるように設計されています。3つの主要な機能に焦点を当てています：</p>
<p><strong>1.タスクプランニング</strong></p>
<p>Deep Agents には<code translate="no">write_todos</code> や<code translate="no">read_todos</code> のようなビルトインツールが含まれています。エージェントは、複雑なタスクを明確な ToDo リストに分割し、各項目をステップバイステップで処理し、完了したタスクをマークします。</p>
<p><strong>2.ファイルシステムへのアクセス</strong></p>
<p><code translate="no">ls</code> 、<code translate="no">read_file</code> 、<code translate="no">write_file</code> のようなツールを提供し、エージェントはファイルの表示、読み込み、書き込みができる。ツールが大きな出力を生成する場合、その結果はモデルのコンテキスト・ウィンドウに留まるのではなく、自動的にファイルに保存されます。これは、コンテキスト・ウィンドウがいっぱいになるのを防ぐのに役立ちます。</p>
<p><strong>3.サブエージェントの委任</strong></p>
<p><code translate="no">task</code> ツールを使って、メインエージェントはサブタスクを専門のサブエージェントに委譲することができます。各サブエージェントは、独自のコンテキストウィンドウとツールを持ち、作業の整理整頓に役立ちます。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_59401bc198.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>技術的には、<code translate="no">create_deep_agent</code> で作成されたエージェントは、コンパイルされた<strong>LangGraph StateGraph</strong> です。(LangGraphはLangChainチームによって開発されたワークフローライブラリであり、StateGraphはその中核となる状態構造である)。このため、ディープエージェントは、ストリーミング出力、チェックポイント、ヒューマン・イン・ザ・ループ・インタラクションといったLangGraphの機能を直接使用することができます。</p>
<p><strong>では、ディープエージェントが実際に役立つのはなぜでしょうか？</strong></p>
<p>長時間実行されるエージェントタスクは、しばしばコンテキストの制限、高いトークンコスト、信頼性の低い実行といった問題に直面します。Deep Agentsは、エージェントのワークフローをより構造化し、管理しやすくすることで、これらの問題の解決を支援します。不要なコンテキストの増加を抑えることで、トークンの使用量を減らし、長時間実行するタスクのコスト効率を維持します。</p>
<p>また、複雑な複数ステップのタスクを整理しやすくします。サブタスクは互いに干渉することなく独立して実行できるため、信頼性が向上する。同時に、システムは柔軟であり、開発者はエージェントが単純な実験から本番アプリケーションに成長するのに合わせてカスタマイズし、拡張することができます。</p>
<h2 id="Customization-in-Deep-Agents" class="common-anchor-header">ディープエージェントにおけるカスタマイズ<button data-href="#Customization-in-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>一般的なフレームワークでは、あらゆる業界やビジネスのニーズをカバーすることはできません。Deep Agentsは柔軟に設計されているため、開発者は独自のユースケースに合わせて調整できます。</p>
<p>カスタマイズにより、次のことが可能になります：</p>
<ul>
<li><p>独自の社内ツールとAPIを接続する</p></li>
<li><p>ドメイン固有のワークフローを定義する</p></li>
<li><p>エージェントがビジネスルールに従うことを確認する</p></li>
<li><p>セッション間の記憶とナレッジ共有をサポートする</p></li>
</ul>
<p>Deep Agentをカスタマイズする主な方法は次のとおりです：</p>
<h3 id="System-Prompt-Customization" class="common-anchor-header">システムプロンプトのカスタマイズ</h3><p>ミドルウェアが提供するデフォルトの指示に、独自のシステムプロンプトを追加できます。これは、ドメイン・ルールおよびワークフローを定義するのに便利です。</p>
<p>優れたカスタムプロンプトには、以下が含まれます：</p>
<ul>
<li><strong>ドメイン・ワークフロー・ルール</strong></li>
</ul>
<p>例「データ分析タスクでは、モデルを構築する前に必ず探索的分析を実行する。</p>
<ul>
<li><strong>具体例</strong></li>
</ul>
<p>例"類似文献の検索依頼を1つのTodo項目にまとめる"</p>
<ul>
<li><strong>停止ルール</strong></li>
</ul>
<p>具体例"100以上のツールコールが使用されたら停止する"</p>
<ul>
<li><strong>ツール調整ガイダンス</strong></li>
</ul>
<p>例"<code translate="no">grep</code> 、コードの場所を見つけ、<code translate="no">read_file</code> 、詳細を見る。"</p>
<p>ミドルウェアがすでに処理している命令の繰り返しは避け、デフォルトの動作と矛盾するルールの追加は避ける。</p>
<h3 id="Tools" class="common-anchor-header">ツール</h3><p>組み込みのツールセットに独自のツールを追加することができます。ツールは通常の Python 関数として定義され、その docstrings に何を行うかが記述されています。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">def</span> <span class="hljs-title function_">internet_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Run a web search&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> tavily_client.search(query)
agent = create_deep_agent(tools=[internet_search])
<button class="copy-code-btn"></button></code></pre>
<p>Deep Agents は、<code translate="no">langchain-mcp-adapters</code> を介してモデル・コンテキスト・プロトコル (MCP) 標準に従うツールもサポートしています。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_mcp_adapters.client <span class="hljs-keyword">import</span> MultiServerMCPClient
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">main</span>():
    mcp_client = MultiServerMCPClient(...)
    mcp_tools = <span class="hljs-keyword">await</span> mcp_client.get_tools()
    agent = create_deep_agent(tools=mcp_tools)
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">for</span> chunk <span class="hljs-keyword">in</span> agent.astream({<span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;...&quot;</span>}]}):
        chunk[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>].pretty_print()
<button class="copy-code-btn"></button></code></pre>
<h3 id="Middleware" class="common-anchor-header">ミドルウェア</h3><p>以下のカスタム・ミドルウェアを記述できます：</p>
<ul>
<li><p>ツールの追加または変更</p></li>
<li><p>プロンプトの調整</p></li>
<li><p>エージェントの実行のさまざまな段階にフックする</p></li>
</ul>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_core.tools <span class="hljs-keyword">import</span> tool
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> deepagents.middleware <span class="hljs-keyword">import</span> AgentMiddleware
<span class="hljs-meta">@tool</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_weather</span>(<span class="hljs-params">city: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Get the weather in a city.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;The weather in <span class="hljs-subst">{city}</span> is sunny.&quot;</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">WeatherMiddleware</span>(<span class="hljs-title class_ inherited__">AgentMiddleware</span>):
    tools = [get_weather]
agent = create_deep_agent(middleware=[WeatherMiddleware()])
<button class="copy-code-btn"></button></code></pre>
<p>Deep Agents には、計画、サブエージェント管理、および実行制御のための組み込みミドルウェアも含まれています。</p>
<table>
<thead>
<tr><th>ミドルウェア</th><th>機能</th></tr>
</thead>
<tbody>
<tr><td>TodoList ミドルウェア</td><td>タスクリストを管理するための write_todos と read_todos ツールを提供します。</td></tr>
<tr><td>ファイルシステムミドルウェア</td><td>ファイル操作ツールを提供し、大きなツール出力を自動保存する。</td></tr>
<tr><td>サブエージェントミドルウェア</td><td>サブエージェントに作業を委任するタスクツールを提供</td></tr>
<tr><td>要約ミドルウェア</td><td>コンテキストが170kトークンを超えると自動的に要約する</td></tr>
<tr><td>AnthropicPromptCachingミドルウェア</td><td>Anthropicモデルのプロンプトキャッシングを有効にする</td></tr>
<tr><td>PatchToolCallsミドルウェア</td><td>中断による不完全なツールコールを修正</td></tr>
<tr><td>HumanInTheLoopミドルウェア</td><td>人間の承認が必要なツールの設定</td></tr>
</tbody>
</table>
<h3 id="Sub-agents" class="common-anchor-header">サブエージェント</h3><p>メインエージェントは、<code translate="no">task</code> ツールを使用してサブエージェントにサブタスクを委任することができます。各サブエージェントは、独自のコンテキストウィンドウで実行され、独自のツールとシステムプロンプトを持ちます。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
research_subagent = {
    <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;research-agent&quot;</span>,
    <span class="hljs-string">&quot;description&quot;</span>: <span class="hljs-string">&quot;Used to research in-depth questions&quot;</span>,
    <span class="hljs-string">&quot;prompt&quot;</span>: <span class="hljs-string">&quot;You are an expert researcher&quot;</span>,
    <span class="hljs-string">&quot;tools&quot;</span>: [internet_search],
    <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,  <span class="hljs-comment"># Optional, defaults to main agent model</span>
}
agent = create_deep_agent(subagents=[research_subagent])
<button class="copy-code-btn"></button></code></pre>
<p>高度な使用例では、サブエージェントとして事前に構築されたLangGraphワークフローを渡すこともできます。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> <span class="hljs-title class_">CompiledSubAgent</span>, create_deep_agent
custom_graph = <span class="hljs-title function_">create_agent</span>(model=..., tools=..., prompt=...)
agent = <span class="hljs-title function_">create_deep_agent</span>(
    subagents=[<span class="hljs-title class_">CompiledSubAgent</span>(
        name=<span class="hljs-string">&quot;data-analyzer&quot;</span>,
        description=<span class="hljs-string">&quot;Specialized agent for data analysis&quot;</span>,
        runnable=custom_graph
    )]
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="interrupton-Human-Approval-Control" class="common-anchor-header"><code translate="no">interrupt_on</code> (人間の承認コントロール）</h3><p><code translate="no">interrupt_on</code> パラメータを使って、人間の承認を必要とする特定のツールを指定することができます。エージェントがこれらのツールを呼び出すと、人がレビューして承認するまで実行は一時停止します。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain_core.tools <span class="hljs-keyword">import</span> tool
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> langgraph.checkpoint.memory <span class="hljs-keyword">import</span> MemorySaver
<span class="hljs-meta">@tool</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">delete_file</span>(<span class="hljs-params">path: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Delete a file from the filesystem.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;Deleted <span class="hljs-subst">{path}</span>&quot;</span>
agent = create_deep_agent(
    tools=[delete_file],
    interrupt_on={
        <span class="hljs-string">&quot;delete_file&quot;</span>: {
            <span class="hljs-string">&quot;allowed_decisions&quot;</span>: [<span class="hljs-string">&quot;approve&quot;</span>, <span class="hljs-string">&quot;edit&quot;</span>, <span class="hljs-string">&quot;reject&quot;</span>]
        }
    },
    checkpointer=MemorySaver()
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Backend-Customization-Storage" class="common-anchor-header">バックエンドのカスタマイズ（ストレージ）</h3><p>ファイルの処理方法を制御するために、異なるストレージバックエンドを選択できます。現在のオプションは以下の通りです：</p>
<ul>
<li><p><strong>StateBackend</strong>（一時ストレージ）</p></li>
<li><p><strong>FilesystemBackend</strong>(ローカルディスクストレージ)</p></li>
</ul>
<pre><code translate="no"><span class="hljs-title class_">StoreBackend</span>(persistent storage)、<span class="hljs-title class_">CompositeBackend</span>(hybrid routing)。
<span class="hljs-keyword">from</span> deepagents <span class="hljs-keyword">import</span> create_deep_agent
<span class="hljs-keyword">from</span> deepagents.<span class="hljs-property">backends</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">FilesystemBackend</span>
agent = <span class="hljs-title function_">create_deep_agent</span>(
    backend=<span class="hljs-title class_">FilesystemBackend</span>(root_dir=<span class="hljs-string">&quot;/path/to/project&quot;</span>)
)
<button class="copy-code-btn"></button></code></pre>
<p>バックエンドを変更することで、システム全体の設計を変更することなく、ファイルストレージの動作を調整できます。</p>
<h2 id="Why-Use-Deep-Agents-with-Milvus-for-AI-Agents" class="common-anchor-header">なぜAIエージェントにMilvusのDeep Agentを使うのか？<button data-href="#Why-Use-Deep-Agents-with-Milvus-for-AI-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>実際のアプリケーションでは、エージェントはしばしばセッションをまたいで持続するメモリを必要とします。例えば、ユーザの好みを記憶したり、時間をかけてドメイン知識を蓄積したり、行動を調整するためにフィードバックを記録したり、長期的な調査タスクを追跡したりする必要があるかもしれません。</p>
<p>デフォルトでは、Deep Agents は<code translate="no">StateBackend</code> を使用し、単一セッション中のデータのみを保存します。セッションが終了すると、すべてクリアされます。つまり、長期的なクロス・セッション・メモリをサポートすることはできません。</p>
<p>永続的な記憶を可能にするために、<a href="https://milvus.io/"><strong>Milvus を</strong></a> <code translate="no">StoreBackend</code> と共にベクトル・データベースとして使用する。その仕組みは以下の通り：重要な会話内容やツールの結果はエンベッディング（意味を表す数値ベクトル）に変換され、Milvus に保存される。新しいタスクが始まると、エージェントは関連する過去の記憶を取り出すために意味検索を行う。これによりエージェントは以前のセッションの関連情報を「記憶」することができる。</p>
<p>Milvusは、計算機とストレージを分離したアーキテクチャのため、このユースケースに適しています。Milvusは以下をサポートしている：</p>
<ul>
<li><p>数百億ベクトルへの水平スケーリング</p></li>
<li><p>高同期クエリ</p></li>
<li><p>リアルタイムのデータ更新</p></li>
<li><p>大規模システム向けのプロダクション対応デプロイメント</p></li>
</ul>
<p>技術的には、Deep Agentsは<code translate="no">CompositeBackend</code> 、異なるストレージバックエンドに異なるパスをルーティングします：</p>
<table>
<thead>
<tr><th>パス</th><th>バックエンド</th><th>目的</th></tr>
</thead>
<tbody>
<tr><td>/ワークスペース/, /temp/</td><td>ステートバックエンド</td><td>セッション終了後に消去される一時的なデータ</td></tr>
<tr><td>/メモリー/、/ナレッジ</td><td>StoreBackend + milvus</td><td>セッションをまたいで検索可能な永続データ</td></tr>
</tbody>
</table>
<p>このセットアップでは、開発者は長期的なデータを<code translate="no">/memories/</code> のようなパスに保存するだけでよい。システムは自動的にクロス・セッション・メモリを処理する。詳細な設定手順は以下のセクションで説明する。</p>
<h2 id="Hands-on-Build-an-AI-Agent-with-Long-Term-Memory-Using-Milvus-and-Deep-Agents" class="common-anchor-header">ハンズオンMilvusとDeep Agentsを使用した長期メモリ付きAIエージェントの構築<button data-href="#Hands-on-Build-an-AI-Agent-with-Long-Term-Memory-Using-Milvus-and-Deep-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>この例では、Milvusを使用してDeepAgentsベースのエージェントに永続的なメモリを与える方法を示します。</p>
<h3 id="Step-1-Install-dependencies" class="common-anchor-header">ステップ1: 依存関係のインストール</h3><pre><code translate="no">pip install deepagents tavily-python langchain-milvus
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Set-up-the-memory-backend" class="common-anchor-header">ステップ2: メモリバックエンドのセットアップ</h3><pre><code translate="no"><span class="hljs-keyword">from</span> deepagents.backends <span class="hljs-keyword">import</span> CompositeBackend, StateBackend, StoreBackend
<span class="hljs-keyword">from</span> langchain_milvus.storage <span class="hljs-keyword">import</span> MilvusStore
<span class="hljs-comment"># from langgraph.store.memory import InMemoryStore # for testing only</span>
<span class="hljs-comment"># Configure Milvus storage</span>
milvus_store = MilvusStore(
    collection_name=<span class="hljs-string">&quot;agent_memories&quot;</span>,
    embedding_service=... <span class="hljs-comment"># embedding is required here, or use MilvusStore default configuration</span>
)
backend = CompositeBackend(
    default=StateBackend(),
    routes={<span class="hljs-string">&quot;/memories/&quot;</span>: StoreBackend(store=InMemoryStore())} 
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Create-the-agent" class="common-anchor-header">ステップ 3: エージェントの作成</h3><pre><code translate="no"><span class="hljs-keyword">from</span> tavily <span class="hljs-keyword">import</span> TavilyClient
<span class="hljs-keyword">import</span> os
tavily_client = TavilyClient(api_key=os.environ[<span class="hljs-string">&quot;TAVILY_API_KEY&quot;</span>])
<span class="hljs-keyword">def</span> <span class="hljs-title function_">internet_search</span>(<span class="hljs-params">query: <span class="hljs-built_in">str</span>, max_results: <span class="hljs-built_in">int</span> = <span class="hljs-number">5</span></span>) -&gt; <span class="hljs-built_in">str</span>:
    <span class="hljs-string">&quot;&quot;&quot;Perform an internet search&quot;&quot;&quot;</span>
    results = tavily_client.search(query, max_results=max_results)
    <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n&quot;</span>.join([<span class="hljs-string">f&quot;<span class="hljs-subst">{r[<span class="hljs-string">&#x27;title&#x27;</span>]}</span>: <span class="hljs-subst">{r[<span class="hljs-string">&#x27;content&#x27;</span>]}</span>&quot;</span> <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-string">&quot;results&quot;</span>]])
agent = create_deep_agent(
    tools=[internet_search],
    system_prompt=<span class="hljs-string">&quot;You are a research expert. Write important findings to the /memories/ directory for cross-session reuse.&quot;</span>,
    backend=backend
)
<span class="hljs-comment"># Run the agent</span>
result = agent.invoke({
    <span class="hljs-string">&quot;messages&quot;</span>: [{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Research the technical features of the Milvus vector database&quot;</span>}]
})
<button class="copy-code-btn"></button></code></pre>
<p><strong>キーポイント</strong></p>
<ul>
<li><strong>永続パス</strong></li>
</ul>
<p><code translate="no">/memories/</code> の下に保存されたファイルは永続的に保存され、異なるセッションでもアクセスできます。</p>
<ul>
<li><strong>本番用セットアップ</strong></li>
</ul>
<p>この例では、テスト用に<code translate="no">InMemoryStore()</code> を使用しています。本番環境では、スケーラブルなセマンティック検索を可能にするために、Milvusアダプターに置き換えてください。</p>
<ul>
<li><strong>自動メモリ</strong></li>
</ul>
<p>エージェントは、調査結果と重要なアウトプットを自動的に<code translate="no">/memories/</code> フォルダに保存します。後のタスクでは、関連する過去の情報を検索して取り出すことができます。</p>
<h2 id="Built-in-Tools-Overview" class="common-anchor-header">組み込みツールの概要<button data-href="#Built-in-Tools-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>Deep Agents には、ミドルウェアを通じて提供されるいくつかの組み込みツールがあります。これらは主に 3 つのグループに分類されます：</p>
<h3 id="Task-Management-TodoListMiddleware" class="common-anchor-header">タスク管理 (<code translate="no">TodoListMiddleware</code>)</h3><ul>
<li><code translate="no">write_todos</code></li>
</ul>
<p>構造化されたTodoリストを作成します。各タスクには、説明、優先度、および依存関係を含めることができます。</p>
<ul>
<li><code translate="no">read_todos</code></li>
</ul>
<p>完了したタスクと保留中のタスクを含む、現在のTodoリストを表示します。</p>
<h3 id="File-System-Tools-FilesystemMiddleware" class="common-anchor-header">ファイルシステムツール (<code translate="no">FilesystemMiddleware</code>)</h3><ul>
<li><code translate="no">ls</code></li>
</ul>
<p>ディレクトリ内のファイルを一覧表示します。絶対パス（<code translate="no">/</code> で始まる）を使用する必要があります。</p>
<ul>
<li><code translate="no">read_file</code></li>
</ul>
<p>ファイルの内容を読み取ります。大容量ファイル用に<code translate="no">offset</code> と<code translate="no">limit</code> をサポート。</p>
<ul>
<li><code translate="no">write_file</code></li>
</ul>
<p>ファイルの作成または上書き。</p>
<ul>
<li><code translate="no">edit_file</code></li>
</ul>
<p>ファイル内の特定のテキストを置換します。</p>
<ul>
<li><code translate="no">glob</code></li>
</ul>
<p>すべての Python ファイルを検索する<code translate="no">**/*.py</code> のように、パターンを使用してファイルを検索します。</p>
<ul>
<li><code translate="no">grep</code></li>
</ul>
<p>ファイル内のテキストを検索します。</p>
<ul>
<li><code translate="no">execute</code></li>
</ul>
<p>サンドボックス環境でシェルコマンドを実行します。バックエンドが<code translate="no">SandboxBackendProtocol</code> をサポートしている必要があります。</p>
<h3 id="Sub-agent-Delegation-SubAgentMiddleware" class="common-anchor-header">サブエージェント委任 (<code translate="no">SubAgentMiddleware</code>)</h3><ul>
<li><code translate="no">task</code></li>
</ul>
<p>サブタスクを特定のサブエージェントに送る。サブエージェント名とタスクの説明を指定する。</p>
<h3 id="How-Tool-Outputs-Are-Handled" class="common-anchor-header">ツール出力の処理方法</h3><p>ツールが大きな結果を生成した場合、Deep Agents はそれを自動的にファイルに保存します。</p>
<p>例えば、<code translate="no">internet_search</code> が 100KB のコンテンツを返す場合、システムはそれを<code translate="no">/tool_results/internet_search_1.txt</code> のように保存します。エージェントは、コンテキスト内のファイル・パスのみを保持します。これにより、トークンの使用量が減り、コンテキスト・ウィンドウが小さくなります。</p>
<h2 id="DeepAgents-vs-Agent-Builder-When-Should-You-Use-Each" class="common-anchor-header">DeepAgent とエージェント・ビルダーの比較：それぞれを使用する必要があるのはどのような場合ですか?<button data-href="#DeepAgents-vs-Agent-Builder-When-Should-You-Use-Each" class="anchor-icon" translate="no">
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
    </button></h2><p><em>この記事はDeepAgentsに焦点を当てているので、</em><em>LangChainエコシステムのもう一つのエージェント構築オプションである</em> <a href="https://www.langchain.com/langsmith/agent-builder"><em>Agent Builderとの</em></a><em>比較も理解しておくと便利です。</em></p>
<p>LangChainはAIエージェントを構築するためのいくつかの方法を提供しており、最適な選択は通常、あなたがシステムをどの程度コントロールしたいかによって決まります。</p>
<p><strong>DeepAgentsは</strong>、長時間のマルチステップタスクを処理する自律型エージェントを構築するために設計されています。開発者は、エージェントがどのようにタスクを計画し、ツールを使用し、メモリを管理するかを完全に制御することができます。LangGraph上に構築されているため、コンポーネントをカスタマイズし、Pythonツールを統合し、ストレージバックエンドを変更することができます。このため、DeepAgentsは、信頼性と柔軟性が重要な複雑なワークフローや生産システムに適しています。</p>
<p>対照的に、<strong>Agent Builderは</strong>使いやすさに重点を置いています。技術的な詳細はほとんど隠されているため、エージェントを記述し、ツールを追加し、迅速に実行できます。メモリ、ツールの使用、人間の承認ステップは自動的に処理されます。このため、Agent Builderは、迅速なプロトタイプ、内部ツール、または初期の実験に便利です。</p>
<p><strong>Agent BuilderとDeepAgentsは別個のシステムではなく、同じスタックの一部です。</strong>Agent Builderは、DeepAgentsの上に構築されています。多くのチームは、まずAgent Builderでアイデアをテストし、さらに制御が必要になったらDeepAgentsに切り替えます。DeepAgentsで作成したワークフローは、Agent Builderのテンプレートに変換できるため、他のチームが簡単に再利用できます。</p>
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
    </button></h2><p>Deep Agents は、タスク計画、ファイルストレージ、およびサブエージェントの委任という 3 つの主要なアイデアを使用することで、複雑なエージェントのワークフローを管理しやすくします。これらのメカニズムは、面倒なマルチステッププロセスを構造化されたワークフローに変えます。Milvusと組み合わせてベクトル検索を行うことで、エージェントはセッションをまたいで長期記憶を保持することができます。</p>
<p>開発者にとっては、トークンのコストが下がり、シンプルなデモから本番環境までスケールできる、より信頼性の高いシステムができることを意味します。</p>
<p>構造化されたワークフローと実際の長期記憶を必要とするAIエージェントを構築している場合、ぜひご連絡ください。</p>
<p>ディープエージェントやMilvusを永続メモリバックエンドとして使用することについてご質問がありますか？<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slackチャンネルに</a>ご参加いただくか、<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvusオフィスアワーの</a>20分セッションをご予約ください。</p>
