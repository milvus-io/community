---
id: >-
  openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md
title: 'OpenAgents x Milvus: メモリを共有する、よりスマートなマルチエージェントシステムを構築する方法'
author: Min Yin
date: 2025-11-24T00:00:00.000Z
cover: assets.zilliz.com/openagents_cover_b60b987944.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'multi-agent, Milvus, vector database, distributed AI architecture, OpenAgents'
meta_title: Build Smarter Multi-Agent Systems with OpenAgents and Milvus
desc: >-
  OpenAgentsがどのように分散マルチエージェントコラボレーションを可能にするのか、なぜMilvusがスケーラブルなメモリを追加するために不可欠なのか、そして完全なシステムを構築する方法について説明します。
origin: >-
  https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md
---
<p>ほとんどの開発者は、エージェント・システムを単一のエージェントから始め、後になって、基本的に非常に高価なチャットボットを構築してしまったことに気づきます。単純なタスクの場合、ReActスタイルのエージェントは問題なく動作するが、すぐに限界に達する。並行してステップを実行することができず、長い推論チェーンを見失い、ミックスに多くのツールを追加するとバラバラになる傾向がある。マルチエージェントのセットアップは、これを解決することを約束するが、協調のオーバーヘッド、もろいハンドオフ、モデルの品質を静かに侵食する共有コンテキストの膨張といった、独自の問題をもたらす。</p>
<p><a href="https://github.com/OpenAgentsInc">OpenAgentsは</a>、マルチエージェントシステムを構築するためのオープンソースのフレームワークであり、AIエージェントが協力し、リソースを共有し、永続的なコミュニティ内で長期的なプロジェクトに取り組む。単一の中央オーケストレーターの代わりに、OpenAgentsはエージェントがより分散された方法でコラボレーションすることを可能にします。</p>
<p><a href="https://milvus.io/">Milvus</a>ベクトルデータベースと組み合わせることで、このパイプラインはスケーラブルで高性能な長期メモリレイヤーを獲得します。Milvusは、高速なセマンティック検索、HNSWやIVFのような柔軟なインデックス作成、パーティショニングによるクリーンな分離でエージェントのメモリを強化し、エージェントがコンテキストに溺れたり、お互いのデータを踏んだりすることなく、知識を保存、検索、再利用できるようにします。</p>
<p>この投稿では、OpenAgentsがどのように分散マルチエージェントコラボレーションを可能にするのか、なぜMilvusがスケーラブルなエージェントメモリの重要な基盤なのか、そして、どのようにそのようなシステムを構築するのか、順を追って説明します。</p>
<h2 id="Challenges-in-Building-Real-World-Agent-Systems" class="common-anchor-header">実世界のエージェントシステム構築における課題<button data-href="#Challenges-in-Building-Real-World-Agent-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>現在主流のエージェントフレームワークの多く（LangChain、AutoGen、CrewAIなど）は、<strong>タスク中心の</strong>モデルで構築されています。エージェントのセットを立ち上げ、彼らに仕事を与え、ワークフローを定義し、実行させます。これは、狭い範囲や短期間のユースケースではうまく機能するが、実際の生産環境では、3つの構造的な限界を露呈する：</p>
<ul>
<li><p><strong>知識はサイロ化されたまま。</strong>エージェントの経験は、そのエージェント自身のデプロイメントに限定される。エンジニアリングのコードレビューエージェントは、実現可能性を評価するプロダクトチームのエージェントと学んだことを共有しません。すべてのチームがゼロから知識を再構築することになり、非効率でもろい。</p></li>
<li><p><strong>コラボレーションは硬直的である。</strong>マルチエージェントフレームワークであっても、協力は通常、事前に定義されたワークフローに依存する。コラボレーションが変化する必要があるとき、これらの静的なルールは適応できず、システム全体の柔軟性を低下させる。</p></li>
<li><p><strong>永続的な状態の欠如。</strong>ほとんどのエージェントは、<em>開始→実行→シャットダウンという</em>シンプルなライフサイクルに従う。エージェントは、コンテキスト、関係、決定、インタラクションの履歴など、実行の間にすべてを忘れてしまう。永続的な状態がなければ、エージェントは長期的な記憶を構築することも、行動を進化させることもできない。</p></li>
</ul>
<p>これらの構造的な問題は、エージェントをより広範な協調的ネットワークの参加者としてではなく、孤立したタスク実行者として扱うことから生じる。</p>
<p>OpenAgentsチームは、将来のエージェントシステムには、より強力な推論以上のものが必要だと考えています。エージェントがお互いを発見し、関係を構築し、知識を共有し、ダイナミックに協働できるメカニズムが必要なのです。そして決定的に重要なのは、これは単一の中央コントローラに依存すべきではないということです。インターネットが機能するのは、それが分散型だからであり、単一のノードがすべてを決定することはなく、システムは成長するにつれてより強固でスケーラブルになる。マルチエージェントシステムは、同じ設計原理から恩恵を受けています。これが、OpenAgentsが万能のオーケストレーターという考えを取り除き、代わりに分散化されたネットワーク主導の協力を可能にする理由です。</p>
<h2 id="What’s-OpenAgents" class="common-anchor-header">OpenAgentsとは？<button data-href="#What’s-OpenAgents" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAgentsは、AIエージェントネットワークを構築するためのオープンソースのフレームワークであり、AIエージェントが協力してリソースを共有し、長期的なプロジェクトに取り組むオープンなコラボレーションを可能にします。エージェントが何百万もの他のエージェントとオープンにコラボレーションし、永続的に成長するコミュニティを形成する、エージェントのインターネットのインフラを提供します。技術レベルでは、システムは3つのコア・コンポーネントを中心に構成されている：<strong>エージェントネットワーク、ネットワークモッズ、トランスポートです。</strong></p>
<h3 id="1-Agent-Network-A-Shared-Environment-for-Collaboration" class="common-anchor-header">1.エージェントネットワークコラボレーションのための共有環境</h3><p>エージェントネットワークは、複雑なタスクを解決するために、複数のエージェントが接続、通信、共同作業ができる共有環境です。主な特徴は以下の通りです：</p>
<ul>
<li><p><strong>永続的な運用：</strong>一度作成されたネットワークは、単一のタスクやワークフローから独立してオンライン状態を維持します。</p></li>
<li><p><strong>動的エージェント：</strong>エージェントは、ネットワークIDを使用していつでも参加できます。</p></li>
<li><p><strong>マルチプロトコルのサポート：</strong>統一された抽象化レイヤーは、WebSocket、gRPC、HTTP、libp2p による通信をサポートします。</p></li>
<li><p><strong>自律的な設定：</strong>各ネットワークは、独自の権限、ガバナンス、およびリソースを維持します。</p></li>
</ul>
<p>たった 1 行のコードで Network を立ち上げることができ、どのエージェントも標準インタフェースからすぐに参加できます。</p>
<h3 id="2-Network-Mods-Pluggable-Extensions-for-Collaboration" class="common-anchor-header">2.ネットワークモッズ：コラボレーションのためのプラグイン可能な拡張機能</h3><p>Mods は、コアシステムから切り離されたコラボレーション機能のモジュールレイヤーを提供します。各ユースケースに合わせたコラボレーションパターンを可能にします。</p>
<table>
<thead>
<tr><th><strong>Mod</strong></th><th><strong>目的</strong></th><th><strong>ユースケース</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>ワークスペースメッセージング</strong></td><td>リアルタイムのメッセージコミュニケーション</td><td>ストリーミング応答、インスタントフィードバック</td></tr>
<tr><td><strong>フォーラム</strong></td><td>非同期ディスカッション</td><td>プロポーザルレビュー、複数ラウンドの審議</td></tr>
<tr><td><strong>ウィキ</strong></td><td>共有知識ベース</td><td>知識集約、文書コラボレーション</td></tr>
<tr><td><strong>ソーシャル</strong></td><td>関係グラフ</td><td>エキスパートルーティング、トラストネットワーク</td></tr>
</tbody>
</table>
<p>すべてのModは統一されたイベントシステム上で動作するため、必要なときにいつでもフレームワークを拡張したり、カスタムビヘイビアを導入したりすることが容易です。</p>
<h3 id="3-Transports-A-Protocol-Agnostic-Channel-for-Communication" class="common-anchor-header">3.トランスポートプロトコルに依存しない通信チャネル</h3><p>トランスポートは、異種エージェントが OpenAgents ネットワーク内で接続し、メッセージを交換するための通信プロトコルです。OpenAgents は、同じネットワーク内で同時に実行できる複数のトランスポートプロトコルをサポートしています：</p>
<ul>
<li><p><strong>HTTP/REST</strong>（幅広い、言語横断的な統合のために</p></li>
<li><p>低レイテンシ、双方向通信のための<strong>WebSocket</strong></p></li>
<li><p>大規模クラスタに適した高性能 RPC 用<strong>gRPC</strong></p></li>
<li><p>分散型ピアツーピアネットワーキングのための<strong>libp2p</strong></p></li>
<li><p><strong>A2A</strong>: エージェント間通信のために特別に設計された新しいプロトコル。</p></li>
</ul>
<p>すべてのトランスポートは、統一されたイベントベースのメッセージフォーマットで動作し、プロトコル間のシームレスな変換を可能にします。ピアエージェントがどのプロトコルを使用するか心配する必要はありません-フレームワークが自動的に処理します。どんな言語やフレームワークで構築されたエージェントでも、既存のコードを書き換えることなく、OpenAgents ネットワークに参加することができます。</p>
<h2 id="Integrating-OpenAgents-with-Milvus-for-Long-Term-Agentic-Memory" class="common-anchor-header">OpenAgentsとMilvusの統合によるエージェントの長期記憶<button data-href="#Integrating-OpenAgents-with-Milvus-for-Long-Term-Agentic-Memory" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAgentsはエージェントがどのように<strong>コミュニケーションし、お互いを発見し、コラボレーション</strong>するかという課題を解決<strong>しますが、</strong>コラボレーションだけでは十分ではありません。エージェントは、洞察、意思決定、会話履歴、ツールの結果、ドメイン固有の知識を生成します。永続的なメモリレイヤーがなければ、エージェントがシャットダウンした瞬間にそのすべてが蒸発してしまう。</p>
<p>そこで<strong>Milvusが</strong>不可欠となる。Milvusは、エージェントとの対話を耐久性があり再利用可能なメモリに変えるために必要な、高性能なベクトルストレージとセマンティック検索を提供します。OpenAgentsネットワークに統合されると、3つの大きな利点があります：</p>
<h4 id="1-Semantic-Search" class="common-anchor-header"><strong>1.セマンティック検索</strong></h4><p>Milvusは、HNSWやIVF_FLATのようなインデックスアルゴリズムを使用して、高速なセマンティック検索を提供します。エージェントはキーワードではなく、意味に基づいて最も関連性の高い過去の記録を検索することができ、以下のことが可能になります：</p>
<ul>
<li><p>以前の決定や計画を思い出す、</p></li>
<li><p>作業の繰り返しを避ける、</p></li>
<li><p>セッションをまたいだ長期的なコンテキストの維持。</p></li>
</ul>
<p>これは、<em>エージェントの記憶の</em>バックボーンである、高速で、関連性のある、文脈に沿った検索である。</p>
<h4 id="2-Billion-Scale-Horizontal-Scalability" class="common-anchor-header"><strong>2.億スケールの水平スケーラビリティ</strong></h4><p>実際のエージェントネットワークは大量のデータを生成します。Milvusは、このスケールで快適に動作するように構築されており、以下のものを提供します：</p>
<ul>
<li><p>数十億のベクトルに対する保存と検索、</p></li>
<li><p>&lt; 高スループットのTop-K検索でも30ミリ秒以下のレイテンシ、</p></li>
<li><p>需要の増加に応じてリニアにスケールする完全分散アーキテクチャ。</p></li>
</ul>
<p>数十人のエージェントでも、数千人のエージェントでも、Milvusは高速で一貫性のある検索を実現します。</p>
<h4 id="3-Multi-Tenant-Isolation" class="common-anchor-header"><strong>3.マルチテナント分離</strong></h4><p>Milvusは、単一のコレクション内のメモリをセグメント化する軽量なパーティショニングメカニズムである<strong>パーティションキーにより</strong>、きめ細かなマルチテナント分離を提供します。これにより</p>
<ul>
<li><p>異なるチーム、プロジェクト、またはエージェントコミュニティが独立したメモリ空間を維持することができます、</p></li>
<li><p>複数のコレクションを管理するのに比べ、オーバーヘッドを劇的に削減、</p></li>
<li><p>共有ナレッジが必要な場合、オプションでパーティションをまたいだ検索が可能。</p></li>
</ul>
<p>この分離は、検索速度を犠牲にすることなくデータの境界を尊重しなければならない大規模なマルチエージェント展開において極めて重要です。</p>
<p>OpenAgentsは、Milvus APIを直接呼び出す<strong>カスタムModを通して</strong>Milvusに接続します。エージェントメッセージ、ツール出力、インタラクションログは自動的にベクターに埋め込まれ、Milvusに保存されます。開発者はカスタマイズすることができます：</p>
<ul>
<li><p>埋め込みモデル</p></li>
<li><p>保存スキーマとメタデータ</p></li>
<li><p>そして検索戦略（ハイブリッド検索、分割検索など）をカスタマイズすることができます。</p></li>
</ul>
<p>これにより、各エージェントコミュニティは、スケーラブルで、永続的で、セマンティック推論に最適化されたメモリレイヤーを得ることができます。</p>
<h2 id="How-to-Build-a-Multi-Agent-Chatbot-with-OpenAgent-and-Milvus" class="common-anchor-header">OpenAgentとmilvusでマルチエージェントチャットボットを構築する方法<button data-href="#How-to-Build-a-Multi-Agent-Chatbot-with-OpenAgent-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>具体的にするために、Python の専門家、データベースの専門家、DevOps エンジニアなど、複数の専門家エージェントが協力して技術的な質問に回答する<strong>開発者サポートコミュニティを</strong>構築するデモを見てみましょう。単一の過重労働のジェネラリストエージェントに依存する代わりに、各エキスパートはドメイン固有の推論に貢献し、システムは自動的に最適なエージェントにクエリをルーティングします。</p>
<p>この例では、<strong>Milvusを</strong>OpenAgentsのデプロイメントに統合し、技術的なQ&amp;Aのための長期記憶を提供する方法を示します。エージェントとの会話、過去の解決策、トラブルシューティングのログ、ユーザーからの問い合わせはすべてベクトル埋め込みに変換され、Milvusに保存されます：</p>
<ul>
<li><p>以前の回答を記憶</p></li>
<li><p>以前の技術的な説明を再利用</p></li>
<li><p>セッション間の一貫性の維持</p></li>
<li><p>より多くのインタラクションが蓄積されるにつれて改善されます。</p></li>
</ul>
<h3 id="Prerequisite" class="common-anchor-header">前提条件</h3><ul>
<li><p>python3.11+</p></li>
<li><p>conda</p></li>
<li><p>Openai-key</p></li>
</ul>
<h3 id="1-Define-Dependencies" class="common-anchor-header">1.依存関係の定義</h3><p>プロジェクトに必要なPythonパッケージを定義します：</p>
<pre><code translate="no"><span class="hljs-comment"># Core framework</span>
openagents&gt;=<span class="hljs-number">0.6</span><span class="hljs-number">.11</span>
<span class="hljs-comment"># Vector database</span>
pymilvus&gt;=<span class="hljs-number">2.5</span><span class="hljs-number">.1</span>
<span class="hljs-comment"># Embedding model</span>
sentence-transformers&gt;=<span class="hljs-number">2.2</span><span class="hljs-number">.0</span>
<span class="hljs-comment"># LLM integration</span>
openai&gt;=<span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
<span class="hljs-comment"># Environment config</span>
python-dotenv&gt;=<span class="hljs-number">1.0</span><span class="hljs-number">.0</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Environment-Variables" class="common-anchor-header">2.環境変数</h3><p>環境設定のテンプレートです：</p>
<pre><code translate="no"><span class="hljs-comment"># LLM configuration (required)</span>
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o
<span class="hljs-comment"># Milvus configuration</span>
MILVUS_URI=./multi_agent_memory.db
<span class="hljs-comment"># Embedding model configuration</span>
EMBEDDING_MODEL=text-embedding-3-large
EMBEDDING_DIMENSION=3072
<span class="hljs-comment"># Network configuration</span>
NETWORK_HOST=localhost
NETWORK_PORT=8700
STUDIO_PORT=8050
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Configure-Your-OpenAgents-Network" class="common-anchor-header">3.OpenAgents ネットワークの設定</h3><p>エージェントネットワークの構造と通信設定を定義します：</p>
<pre><code translate="no"><span class="hljs-comment"># Network transport protocol (HTTP on port 8700)</span>
<span class="hljs-comment"># Multi-channel messaging system (general, coordination, expert channels)</span>
<span class="hljs-comment"># Agent role definitions (coordinator, python_expert, etc.)</span>
<span class="hljs-comment"># Milvus integration settings</span>
network:
  name: <span class="hljs-string">&quot;Multi-Agent Collaboration Demo&quot;</span>
  transports:
    - <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;http&quot;</span>
      config:
        port: <span class="hljs-number">8700</span>
        host: <span class="hljs-string">&quot;localhost&quot;</span>
  mods:
    - name: <span class="hljs-string">&quot;openagents.mods.workspace.messaging&quot;</span>
      config:
        channels:
          - name: <span class="hljs-string">&quot;general&quot;</span>          <span class="hljs-comment"># User question channel</span>
          - name: <span class="hljs-string">&quot;coordination&quot;</span>     <span class="hljs-comment"># Coordinator channel</span>
          - name: <span class="hljs-string">&quot;python_channel&quot;</span>   <span class="hljs-comment"># Python expert channel</span>
          - name: <span class="hljs-string">&quot;milvus_channel&quot;</span>   <span class="hljs-comment"># Milvus expert channel</span>
          - name: <span class="hljs-string">&quot;devops_channel&quot;</span>   <span class="hljs-comment"># DevOps expert channel</span>
  agents:
    coordinator:
      <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;coordinator&quot;</span>
      description: <span class="hljs-string">&quot;Coordinator Agent, responsible for analyzing queries and dispatching tasks to expert agents&quot;</span>
      channels: [<span class="hljs-string">&quot;general&quot;</span>, <span class="hljs-string">&quot;coordination&quot;</span>]
    python_expert:
      <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;expert&quot;</span>
      domain: <span class="hljs-string">&quot;python&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Implement-Multi-Agent-Collaboration" class="common-anchor-header">4.マルチエージェントコラボレーションの実装</h3><p>以下は、コアのコードスニペットです（完全な実装ではありません）。</p>
<pre><code translate="no"><span class="hljs-comment"># SharedMemory: Milvus’s SharedMemory system</span>
<span class="hljs-comment"># CoordinatorAgent: Coordinator Agent, responsible for analyzing queries and dispatching tasks to expert agents</span>
<span class="hljs-comment"># PythonExpertAgent: Python Expert</span>
<span class="hljs-comment"># MilvusExpertAgent: Milvus Expert</span>
<span class="hljs-comment"># DevOpsExpertAgent: DevOps Expert</span>
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">List</span>, <span class="hljs-type">Dict</span>
<span class="hljs-keyword">from</span> dotenv <span class="hljs-keyword">import</span> load_dotenv
<span class="hljs-keyword">from</span> openagents.agents.worker_agent <span class="hljs-keyword">import</span> WorkerAgent
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections, Collection, FieldSchema, CollectionSchema, DataType
<span class="hljs-keyword">import</span> openai
load_dotenv()
<span class="hljs-keyword">class</span> <span class="hljs-title class_">SharedMemory</span>:
    <span class="hljs-string">&quot;&quot;&quot;SharedMemory in Milvus for all Agents&quot;&quot;&quot;</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        connections.connect(uri=<span class="hljs-string">&quot;./multi_agent_memory.db&quot;</span>)
        <span class="hljs-variable language_">self</span>.setup_collections()
        <span class="hljs-variable language_">self</span>.openai_client = openai.OpenAI(
            api_key=os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>),
            base_url=os.getenv(<span class="hljs-string">&quot;OPENAI_BASE_URL&quot;</span>)
        )
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">setup_collections</span>(<span class="hljs-params">self</span>):
        <span class="hljs-string">&quot;&quot;&quot;Create memory collections: expert knowledge, collaboration history, problem solutions&quot;&quot;&quot;</span>
        collections = {
            <span class="hljs-string">&quot;expert_knowledge&quot;</span>: <span class="hljs-string">&quot;expert knowledge&quot;</span>,
            <span class="hljs-string">&quot;collaboration_history&quot;</span>: <span class="hljs-string">&quot;collaboration history&quot;</span>, 
            <span class="hljs-string">&quot;problem_solutions&quot;</span>: <span class="hljs-string">&quot;problem solutions&quot;</span>
        }
        <span class="hljs-comment"># Code to create vector collections...</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">search_knowledge</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, collection_name: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Search for relevant knowledge&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Vector search implementation...</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">store_knowledge</span>(<span class="hljs-params">self, agent_id: <span class="hljs-built_in">str</span>, content: <span class="hljs-built_in">str</span>, metadata: <span class="hljs-built_in">dict</span>, collection_name: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Store knowledge&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Store into the vector database...</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">CoordinatorAgent</span>(<span class="hljs-title class_ inherited__">WorkerAgent</span>):
    <span class="hljs-string">&quot;&quot;&quot;Coordinator Agent - analyzes questions and coordinates other Agent&quot;&quot;&quot;</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self</span>):
        <span class="hljs-built_in">super</span>().__init__(agent_id=<span class="hljs-string">&quot;coordinator&quot;</span>)
        <span class="hljs-variable language_">self</span>.expert_agents = {
            <span class="hljs-string">&quot;python&quot;</span>: <span class="hljs-string">&quot;python_expert&quot;</span>,
            <span class="hljs-string">&quot;milvus&quot;</span>: <span class="hljs-string">&quot;milvus_expert&quot;</span>, 
            <span class="hljs-string">&quot;devops&quot;</span>: <span class="hljs-string">&quot;devops_expert&quot;</span>
        }
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">analyze_question</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]:
        <span class="hljs-string">&quot;&quot;&quot;Determine which experts are needed for the question&quot;&quot;&quot;</span>
        keywords = {
            <span class="hljs-string">&quot;python&quot;</span>: [<span class="hljs-string">&quot;python&quot;</span>, <span class="hljs-string">&quot;django&quot;</span>, <span class="hljs-string">&quot;flask&quot;</span>, <span class="hljs-string">&quot;async&quot;</span>],
            <span class="hljs-string">&quot;milvus&quot;</span>: [<span class="hljs-string">&quot;milvus&quot;</span>, <span class="hljs-string">&quot;vector&quot;</span>, <span class="hljs-string">&quot;index&quot;</span>, <span class="hljs-string">&quot;performance&quot;</span>],
            <span class="hljs-string">&quot;devops&quot;</span>: [<span class="hljs-string">&quot;deployment&quot;</span>, <span class="hljs-string">&quot;docker&quot;</span>, <span class="hljs-string">&quot;kubernetes&quot;</span>, <span class="hljs-string">&quot;operations&quot;</span>]
        }
        <span class="hljs-comment"># Keyword matching logic...</span>
        <span class="hljs-keyword">return</span> needed_experts
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">coordinate_experts</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span>, needed_experts: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>]</span>):
        <span class="hljs-string">&quot;&quot;&quot;Coordinate collaboration among expert Agent&quot;&quot;&quot;</span>
        <span class="hljs-comment"># 1. Notify experts to begin collaborating</span>
        <span class="hljs-comment"># 2. Dispatch tasks to each expert</span>
        <span class="hljs-comment"># 3. Collect expert responses</span>
        <span class="hljs-comment"># 4. Return expert opinions</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">on_channel_post</span>(<span class="hljs-params">self, context</span>):
        <span class="hljs-string">&quot;&quot;&quot;Main logic for handling user questions&quot;&quot;&quot;</span>
        content = context.incoming_event.payload.get(<span class="hljs-string">&#x27;content&#x27;</span>, {}).get(<span class="hljs-string">&#x27;text&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
        <span class="hljs-keyword">if</span> content <span class="hljs-keyword">and</span> <span class="hljs-keyword">not</span> content.startswith(<span class="hljs-string">&#x27;🎯&#x27;</span>):
            <span class="hljs-comment"># 1. Analyze question → 2. Coordinate experts → 3. Merge answers → 4. Reply to user</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">PythonExpertAgent</span>(<span class="hljs-title class_ inherited__">WorkerAgent</span>):
    <span class="hljs-string">&quot;&quot;&quot;Python Expert Agent&quot;&quot;&quot;</span>
    <span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">analyze_python_question</span>(<span class="hljs-params">self, question: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Analyze Python-related questions and provide expert advice&quot;&quot;&quot;</span>
        <span class="hljs-comment"># 1. Search for relevant experience</span>
        <span class="hljs-comment"># 2. Use LLM to generate expert response</span>
        <span class="hljs-comment"># 3. Store result in collaboration history</span>
        <span class="hljs-keyword">return</span> answer
<span class="hljs-comment"># Start all Agens</span>
<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">run_multi_agent_demo</span>():
    coordinator = CoordinatorAgent()
    python_expert = PythonExpertAgent()
    milvus_expert = MilvusExpertAgent()
    devops_expert = DevOpsExpertAgent()
    <span class="hljs-comment"># Connect to the OpenAgents network</span>
    <span class="hljs-keyword">await</span> coordinator.async_start(network_host=<span class="hljs-string">&quot;localhost&quot;</span>, network_port=<span class="hljs-number">8700</span>)
    <span class="hljs-comment"># ... Start other Agent</span>
    <span class="hljs-keyword">while</span> <span class="hljs-literal">True</span>:
        <span class="hljs-keyword">await</span> asyncio.sleep(<span class="hljs-number">1</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    asyncio.run(run_multi_agent_demo())
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Create-and-Activate-a-Virtual-Environment" class="common-anchor-header">5.仮想環境の作成と起動</h3><pre><code translate="no">conda create -n openagents
conda activate openagents
<button class="copy-code-btn"></button></code></pre>
<p><strong>依存関係のインストール</strong></p>
<pre><code translate="no">pip install -r requirements.txt
<button class="copy-code-btn"></button></code></pre>
<p><strong>API キーの設定</strong></p>
<pre><code translate="no"><span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>OpenAgents ネットワークの開始</strong></p>
<pre><code translate="no">openagents network start .
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/network_169812ab94.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>マルチエージェント・サービスの開始</strong></p>
<pre><code translate="no">python multi_agent_demo.py
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/multiagent_service_1661d4b91b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>OpenAgents Studio を起動する</strong></p>
<pre><code translate="no">openagents studio -s
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/start_studio_4cd126fea2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>スタジオにアクセス</strong></p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:8050</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio1_a33709914b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio3_293604c79e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/access_studio_3_8d98a4cfe8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>エージェントとネットワークのステータスを確認する</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/check_state_bba1a4fe16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Conclusion" class="common-anchor-header">まとめ<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAgentsは、エージェント同士の発見、コミュニケーション、コラボレーションを可能にするコーディネーションレイヤーを提供し、Milvusは知識をどのように保存、共有、再利用するかという同様に重要な問題を解決します。Milvusは、高性能なベクトル記憶レイヤーを提供することで、エージェントが永続的なコンテキストを構築し、過去のやりとりを思い出し、時間をかけて専門知識を蓄積することを可能にする。この2つを組み合わせることで、AIシステムは孤立したモデルの限界を超え、真のマルチエージェントネットワークのより深い協調の可能性へと押し上げられる。</p>
<p>もちろん、トレードオフのないマルチエージェントアーキテクチャはありません。エージェントを並列に実行すると、トークンの消費量が増え、エージェント間でエラーが連鎖し、同時の意思決定が時として衝突を引き起こす可能性がある。これらは現在研究中の分野であり、現在も改善中であるが、協調し、記憶し、進化できるシステムを構築することの価値を減じるものではない。</p>
<p>🚀 エージェントに長期記憶を持たせる準備はできていますか？</p>
<p><a href="https://milvus.io/">Milvusを</a>探求し、ご自身のワークフローと統合してみてください。</p>
<p>ご質問がある場合、または機能について詳しく知りたい場合は、Discordチャンネルにご参加ください。私たちの<a href="https://discord.com/invite/8uyFbECzPX"> Discordチャンネルに</a>参加するか、<a href="https://github.com/milvus-io/milvus"> GitHubに</a>課題を提出してください。また、<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvusオフィスアワーを通して</a>、20分間の1対1のセッションを予約し、洞察やガイダンス、質問への回答を得ることもできます。</p>
