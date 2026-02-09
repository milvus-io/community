---
id: how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md
title: Agnoとmilvusで生産に適したマルチエージェントシステムを構築する方法
author: Min Yin
date: 2026-02-10T00:00:00.000Z
cover: assets.zilliz.com/cover_b5fc8a3c48.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  production-ready multi-agent systems, Agno framework, Milvus vector database,
  AgentOS deployment, LLM agent architecture
meta_title: |
  How to Build Production-Ready Multi-Agent Systems with Agno and Milvus
desc: >-
  Agno、AgentOS、およびMilvusを使用して、実稼働環境に対応したマルチエージェントシステムを構築、デプロイ、およびスケーリングする方法を学びます。
origin: >-
  https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md
---
<p>もしあなたがAIエージェントを作っているなら、おそらくこの壁にぶつかったことがあるでしょう。</p>
<p>以前の投稿でエージェントのメモリ管理とリランキングについて説明しました。それでは、より大きな課題である、本番環境に耐えうるエージェントの構築に取り組んでみましょう。</p>
<p>本番環境は厄介です。そのため、マルチエージェントシステムはどこにでもある。しかし、今日利用可能なフレームワークは、2つの陣営に分類される傾向がある：デモはうまくできても実際の負荷では壊れてしまう軽量なものと、学習と構築に時間がかかる強力なものだ。</p>
<p>私は最近<a href="https://github.com/agno-agi/agno">Agnoを試して</a>いるが、過度な複雑さを伴わずに生産性を重視した、妥当な中間点を突いているように思える。このプロジェクトは、数ヶ月で37,000以上のGitHubスターを獲得しており、他の開発者にとっても有用であることを示唆している。</p>
<p>この投稿では、<a href="https://milvus.io/">Milvusを</a>メモリレイヤーとしてAgnoを使ってマルチエージェントシステムを構築する際に学んだことを共有する。AgnoがLangGraphのような代替とどのように比較されるかを見て、あなた自身で試せる完全な実装を紹介します。</p>
<h2 id="What-Is-Agno" class="common-anchor-header">Agnoとは？<button data-href="#What-Is-Agno" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/agno-agi/agno">Agnoは</a>、プロダクション用に特別に作られたマルチエージェントフレームワークです。Agnoには2つのレイヤーがあります：</p>
<ul>
<li><p><strong>Agnoフレームワークレイヤー</strong>：エージェントロジックを定義する場所</p></li>
<li><p><strong>AgentOSランタイムレイヤ</strong>：そのロジックを実際にデプロイできるHTTPサービスに変換します。</p></li>
</ul>
<p>このように考えてください: フレームワーク層は、エージェントが<em>何を</em>すべきかを定義し、AgentOS は、その作業が<em>どのように</em>実行され、提供さ<em>れるかを</em>処理します。</p>
<h3 id="The-Framework-Layer" class="common-anchor-header">フレームワーク層</h3><p>これは、直接作業するものです。3つのコアコンセプトがあります：</p>
<ul>
<li><p><strong>エージェント</strong>: 特定のタイプのタスクを処理します。</p></li>
<li><p><strong>チーム</strong>：複雑な問題を解決するために複数のエージェントを調整する</p></li>
<li><p><strong>ワークフロー</strong>：実行順序と構造の定義</p></li>
</ul>
<p>私が高く評価する点は、新しいDSLを学んだり、フローチャートを描いたりする必要がないことです。エージェントの動作は、標準的なPython関数呼び出しを使って定義されます。フレームワークは、LLMの呼び出し、ツールの実行、メモリ管理を処理します。</p>
<h3 id="The-AgentOS-Runtime-Layer" class="common-anchor-header">AgentOSランタイムレイヤ</h3><p>AgentOSは、非同期実行による大量のリクエストのために設計されており、そのステートレスアーキテクチャは、スケーリングを容易にします。</p>
<p>主な機能は以下のとおりです：</p>
<ul>
<li><p>エージェントをHTTPエンドポイントとして公開するための組み込みFastAPI統合</p></li>
<li><p>セッション管理とストリーミング応答</p></li>
<li><p>エンドポイントの監視</p></li>
<li><p>水平スケーリングサポート</p></li>
</ul>
<p>実際には、AgentOS がほとんどのインフラストラクチャ作業を処理するため、エージェントロジック自体に集中することができます。</p>
<p>Agno のアーキテクチャのハイレベルビューを以下に示します。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_dfbf444ee6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Agno-vs-LangGraph" class="common-anchor-header">AgnoとLangGraphの比較<button data-href="#Agno-vs-LangGraph" class="anchor-icon" translate="no">
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
    </button></h2><p>Agnoの特徴を理解するために、最も広く使われているマルチエージェントフレームワークの一つであるLangGraphと比較してみましょう。</p>
<p><a href="https://www.langchain.com/langgraph"><strong>LangGraphは</strong></a>、グラフベースのステートマシンを使用しています。ステップをノード、実行パスをエッジとして、エージェントのワークフロー全体をグラフとしてモデル化します。ステップがノードで、実行パスがエッジです。しかし、オープンエンドや会話型のシナリオでは、制限的に感じるかもしれません。インタラクションがよりダイナミックになればなるほど、きれいなグラフを維持することは難しくなります。</p>
<p><strong>Agnoは</strong>異なるアプローチをとります。純粋なオーケストレーションレイヤーではなく、エンドツーエンドのシステムです。エージェントの動作を定義すると、AgentOSは、モニタリング、スケーラビリティ、マルチターン会話のサポートが組み込まれた、プロダクション対応のHTTPサービスとして自動的にそれを公開します。別個のAPIゲートウェイ、カスタムセッション管理、余分な運用ツールは必要ありません。</p>
<p>簡単な比較です：</p>
<table>
<thead>
<tr><th>ディメンション</th><th>LangGraph</th><th>アグノ</th></tr>
</thead>
<tbody>
<tr><td>オーケストレーションモデル</td><td>ノードとエッジを使った明示的なグラフ定義</td><td>Pythonで定義された宣言的ワークフロー</td></tr>
<tr><td>状態管理</td><td>開発者によって定義、管理されるカスタムステートクラス</td><td>内蔵メモリシステム</td></tr>
<tr><td>デバッグと可観測性</td><td>LangSmith（有料）</td><td>AgentOS UI（オープンソース）</td></tr>
<tr><td>ランタイムモデル</td><td>既存のランタイムに統合</td><td>スタンドアロン FastAPIベースのサービス</td></tr>
<tr><td>展開の複雑さ</td><td>LangServe経由での追加設定が必要</td><td>すぐに使える</td></tr>
</tbody>
</table>
<p>LangGraphは、より柔軟できめ細かいコントロールを提供します。Agnoは、製品化までの時間を短縮するために最適化されます。適切な選択は、プロジェクトの段階、既存のインフラ、必要なカスタマイズのレベルによって異なります。判断に迷う場合は、両方を使って小規模な概念実証を行うことが、おそらく最も確実な方法でしょう。</p>
<h2 id="Choosing-Milvus-for-the-Agent-Memory-Layer" class="common-anchor-header">エージェントメモリーレイヤーにMilvusを選択する<button data-href="#Choosing-Milvus-for-the-Agent-Memory-Layer" class="anchor-icon" translate="no">
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
    </button></h2><p>フレームワークを選択したら、次の決定はメモリと知識をどのように保存するかです。これにはMilvusを使います。<a href="https://milvus.io/">Milvusは</a>、AIワークロード用に構築された最も人気のあるオープンソースのベクトルデータベースで、<a href="https://github.com/milvus-io/milvus">42,000以上のGitHub</a>スターがあります。</p>
<p><strong>AgnoはMilvusをネイティブサポートしています。</strong> <code translate="no">agno.vectordb.milvus</code> モジュールは、接続管理、自動再試行、バッチ書き込み、埋め込み生成などの生産機能をラップしている。Pythonの数行でベクターメモリレイヤーを利用することができます。</p>
<p><strong>Milvusはニーズに合わせて拡張できます。</strong>Milvusは3つの<a href="https://milvus.io/docs/install-overview.md">導入モードを</a>サポートしています<a href="https://milvus.io/docs/install-overview.md">：</a></p>
<ul>
<li><p><strong>Milvus Lite</strong>：軽量、ファイルベース-ローカル開発やテストに最適</p></li>
<li><p><strong>スタンドアロン</strong>：シングルサーバでの運用ワークロード</p></li>
<li><p><strong>分散型</strong>：大規模シナリオ向けフルクラスタ</p></li>
</ul>
<p>Milvus Liteを使用してローカルでエージェントメモリの検証を開始し、トラフィックの増加に応じてアプリケーションコードを変更することなくスタンドアロンまたは分散型に移行することができます。このような柔軟性は、初期段階では迅速な反復作業を行うが、後にスケールするための明確なパスが必要な場合に特に有用です。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_1_1en_e0294d0ffa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Step-by-Step-Building-a-Production-Ready-Agno-Agent-with-Milvus" class="common-anchor-header">ステップバイステップMilvusを使った本番環境対応のAgnoエージェントの構築<button data-href="#Step-by-Step-Building-a-Production-Ready-Agno-Agent-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>本番環境に対応したエージェントをゼロから構築してみましょう。</p>
<p>ワークフロー全体を示すためにシンプルなシングルエージェントの例から始めます。その後、マルチエージェントシステムに拡張します。AgentOSは、すべてを呼び出し可能なHTTPサービスとして自動的にパッケージ化します。</p>
<h3 id="1-Deploying-Milvus-Standalone-with-Docker" class="common-anchor-header">1.DockerによるMilvusスタンドアロンのデプロイ</h3><p><strong>(1)デプロファイルのダウンロード</strong></p>
<pre><code translate="no">**wget** **
&lt;https://github.com/Milvus-io/Milvus/releases/download/v2.****5****.****12****/Milvus-standalone-docker-compose.yml&gt; -O docker-compose.yml**
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Milvusサービスの起動</strong></p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_80575354d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Core-Implementation" class="common-anchor-header">2.コアの実装</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os
<span class="hljs-keyword">from</span> pathlib <span class="hljs-keyword">import</span> Path
<span class="hljs-keyword">from</span> agno.os <span class="hljs-keyword">import</span> AgentOS
<span class="hljs-keyword">from</span> agno.agent <span class="hljs-keyword">import</span> Agent
<span class="hljs-keyword">from</span> agno.models.openai <span class="hljs-keyword">import</span> OpenAIChat
<span class="hljs-keyword">from</span> agno.knowledge.knowledge <span class="hljs-keyword">import</span> Knowledge
<span class="hljs-keyword">from</span> agno.vectordb.milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> agno.knowledge.embedder.openai <span class="hljs-keyword">import</span> OpenAIEmbedder
<span class="hljs-keyword">from</span> agno.db.sqlite <span class="hljs-keyword">import</span> SqliteDb
os.environ\[<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>\] = <span class="hljs-string">&quot;you-key-here&quot;</span>
data_dir = Path(<span class="hljs-string">&quot;./data&quot;</span>)
data_dir.mkdir(exist_ok=<span class="hljs-literal">True</span>)
knowledge_base = Knowledge(
    contents_db=SqliteDb(
        db_file=<span class="hljs-built_in">str</span>(data_dir / <span class="hljs-string">&quot;knowledge_contents.db&quot;</span>),
        knowledge_table=<span class="hljs-string">&quot;knowledge_contents&quot;</span>,
    ),
    vector_db=Milvus(
        collection=<span class="hljs-string">&quot;agno_knowledge&quot;</span>,
        uri=<span class="hljs-string">&quot;http://192.168.x.x:19530&quot;</span>,
        embedder=OpenAIEmbedder(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;text-embedding-3-small&quot;</span>),
    ),
)
*<span class="hljs-comment"># Create Agent*</span>
agent = Agent(
    name=<span class="hljs-string">&quot;Knowledge Assistant&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    instructions=\[
        <span class="hljs-string">&quot;You are a knowledge base assistant that helps users query and manage knowledge base content.&quot;</span>,
        <span class="hljs-string">&quot;Answer questions in English.&quot;</span>,
        <span class="hljs-string">&quot;Always search the knowledge base before answering questions.&quot;</span>,
        <span class="hljs-string">&quot;If the knowledge base is empty, kindly prompt the user to upload documents.&quot;</span>
    \],
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    db=SqliteDb(
        db_file=<span class="hljs-built_in">str</span>(data_dir / <span class="hljs-string">&quot;agent.db&quot;</span>),
        session_table=<span class="hljs-string">&quot;agent_sessions&quot;</span>,
    ),
    add_history_to_context=<span class="hljs-literal">True</span>,
    markdown=<span class="hljs-literal">True</span>,
)
agent_os = AgentOS(agents=\[agent\])
app = agent_os.get_app()
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n🚀 Starting service...&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;📍 http://localhost:7777&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;💡 Please upload documents to the knowledge base in the UI\n&quot;</span>)
    agent_os.serve(app=<span class="hljs-string">&quot;knowledge_agent:app&quot;</span>, port=<span class="hljs-number">7777</span>, reload=<span class="hljs-literal">False</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>(1) エージェントの実行</strong></p>
<pre><code translate="no">**python** **knowledge_agent.py**
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_df885706cf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Connecting-to-the-AgentOS-Console" class="common-anchor-header">3.AgentOSコンソールへの接続</h3><p>https://os.agno.com/</p>
<p><strong>(1) アカウントの作成とサインイン</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_db0af51e58.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(2) エージェントを AgentOS に接続する</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_0a8c6f9436.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(3) 公開ポートとエージェント名の設定</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_3844011799.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(4) Milvusへのドキュメントの追加とインデックス作成</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/5_776ea7ca11.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/6_90b97c4660.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/7_a98262d8c5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/8_58b7d77eea.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>(5) エージェントのエンドツーエンドのテスト</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/_6e61038ba5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>このセットアップでは、Milvusは高性能な意味検索を処理します。ナレッジベースアシスタントは技術的な質問を受けると、<code translate="no">search_knowledge</code> ツールを起動してクエリを埋め込み、Milvusから最も関連性の高いドキュメントチャンクを取得し、その結果をレスポンスのベースとして使用します。</p>
<p>Milvusは3つのデプロイメントオプションを提供しており、すべてのデプロイメントモードでアプリケーションレベルのAPIを一貫させながら、お客様の運用要件に合ったアーキテクチャを選択することができます。</p>
<p>上のデモは、コアとなる検索と生成のフローを示しています。しかし、この設計を本番環境に移行するには、いくつかのアーキテクチャ面についてより詳細に説明する必要がある。</p>
<h2 id="How-Retrieval-Results-Are-Shared-Across-Agents" class="common-anchor-header">エージェント間で検索結果を共有する方法<button data-href="#How-Retrieval-Results-Are-Shared-Across-Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>Agnoのチームモードには、<code translate="no">share_member_interactions=True</code> オプションがあり、後のエージェントが前のエージェントの全インタラクション履歴を継承することができます。実際には、最初のエージェントがMilvusから情報を取得した場合、後続のエージェントは同じ検索を再度実行することなく、その結果を再利用することができます。</p>
<ul>
<li><p><strong>利点：</strong>検索コストがチーム全体で償却される。1つのベクトル検索が複数のエージェントをサポートし、冗長なクエリを削減します。</p></li>
<li><p><strong>マイナス面</strong>検索品質が増幅される。最初の検索が不完全または不正確な結果を返すと、そのエラーはそれに依存する全てのエージェントに伝播する。</p></li>
</ul>
<p>これが、マルチエージェントシステムにおいて検索精度がより重要になる理由である。悪い検索は、1つのエージェントのレスポンスを低下させるだけでなく、チーム全体に影響を与える。</p>
<p>これがチーム設定の例です：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> agno.team <span class="hljs-keyword">import</span> Team
analyst = Agent(
    name=<span class="hljs-string">&quot;Data Analyst&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    instructions=\[<span class="hljs-string">&quot;Analyze data and extract key metrics&quot;</span>\]
)
writer = Agent(
    name=<span class="hljs-string">&quot;Report Writer&quot;</span>,
    model=OpenAIChat(<span class="hljs-built_in">id</span>=<span class="hljs-string">&quot;gpt-4o&quot;</span>),
    knowledge=knowledge_base,
    search_knowledge=<span class="hljs-literal">True</span>,
    instructions=\[<span class="hljs-string">&quot;Write reports based on the analysis results&quot;</span>\]
)
team = Team(
    agents=\[analyst, writer\],
    share_member_interactions=<span class="hljs-literal">True</span>,  *<span class="hljs-comment"># Share knowledge retrieval results*</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="Why-Agno-and-Milvus-Are-Layered-Separately" class="common-anchor-header">AgnoとMilvusが別々にレイヤー化されている理由<button data-href="#Why-Agno-and-Milvus-Are-Layered-Separately" class="anchor-icon" translate="no">
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
    </button></h2><p>このアーキテクチャでは、<strong>Agnoは</strong>会話とオーケストレーションレイヤーに位置します。Agnoは、ダイアログフローを管理し、エージェントを調整し、セッション履歴をリレーショナルデータベースに保存し、会話の状態を維持する。システムの実際のドメイン知識（製品ドキュメントや技術レポートなど）は別に扱われ、<strong>Milvusの</strong>ベクトル埋め込みとして保存されます。このように明確に分割することで、会話ロジックと知識ストレージは完全に切り離されている。</p>
<p>これが運用上重要な理由</p>
<ul>
<li><p><strong>独立したスケーリング</strong>：Agnoの需要が増加すれば、Agnoインスタンスを追加します。クエリの量が増えれば、クエリノードを追加してMilvusを拡張します。各レイヤーは独立してスケールします。</p></li>
<li><p><strong>異なるハードウェアニーズ</strong>：AgnoはCPUとメモリに縛られます（LLM推論、ワークフロー実行）。Milvusは高スループットのベクトル検索（ディスクI/O、場合によってはGPUアクセラレーション）に最適化されています。両者を分離することで、リソースの競合を防ぐことができます。</p></li>
<li><p><strong>コストの最適化</strong>：各レイヤーのリソースを独立して調整し、割り当てることができます。</p></li>
</ul>
<p>このレイヤーアプローチにより、より効率的で、弾力性があり、本番稼動可能なアーキテクチャが得られます。</p>
<h2 id="What-to-Monitor-When-Using-Agno-with-Milvus" class="common-anchor-header">MilvusでAgnoを使用する際にモニターすべきこと<button data-href="#What-to-Monitor-When-Using-Agno-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Agnoにはビルトインの評価機能がありますが、Milvusを追加することで、監視すべき対象が広がります。私たちの経験に基づき、3つの分野に注目してください：</p>
<ul>
<li><p><strong>検索品質</strong>：Milvusが返す文書は、実際にクエリに関連しているのか、それともベクトルレベルで表面的に似ているだけなのか？</p></li>
<li><p><strong>回答の忠実さ</strong>：最終的な回答は検索された内容に基づいたものなのか、それともLLMは裏付けのない主張を生成しているのか？</p></li>
<li><p><strong>エンド・ツー・エンドの待ち時間の内訳</strong>：総レスポンス時間を追跡するだけではない。エンベッディングの生成、ベクトルの検索、コンテキストの組み立て、LLMの推論など、ステージごとに分解することで、どこで遅延が発生したかを特定することができます。</p></li>
</ul>
<p><strong>実際の例：</strong>Milvusコレクションが100万から1,000万ベクターに増えたとき、検索レイテンシが増加していることに気づくかもしれません。これは通常、インデックスのパラメータ（<code translate="no">nlist</code> や<code translate="no">nprobe</code> など）を調整するか、スタンドアロンから分散配置への移行を検討するシグナルです。</p>
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
    </button></h2><p>運用可能なエージェントシステムを構築するには、LLMコールや検索デモをまとめるだけでは不十分です。明確なアーキテクチャの境界、独立してスケールするインフラ、そして問題を早期に発見するための観測可能性が必要です。</p>
<p>この投稿では、Agnoとmilvusがどのように連携できるかを説明しました：Agnoはマルチエージェントオーケストレーションのために、Milvusはスケーラブルなメモリとセマンティック検索のために。これらのレイヤーを分離しておくことで、コアロジックを書き換えることなくプロトタイプからプロダクションに移行することができ、必要に応じて各コンポーネントを拡張することができます。</p>
<p>もしあなたが同じようなセットアップを試しているなら、何がうまくいっているのか聞いてみたい。</p>
<p><strong>Milvusに関する質問は？</strong> <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slackチャンネルに</a>参加するか、20分間の<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvusオフィスアワーを</a>ご予約ください。</p>
