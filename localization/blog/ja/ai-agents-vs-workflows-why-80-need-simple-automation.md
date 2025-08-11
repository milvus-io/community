---
id: ai-agents-vs-workflows-why-80-need-simple-automation.md
title: AIエージェントかワークフローか？自動化タスクの80%でエージェントをスキップすべき理由
author: Min Yin
date: 2025-08-11T00:00:00.000Z
desc: MilvusとReflyの統合は、不必要な複雑さよりも信頼性と使いやすさを重視した、実用的な自動化へのアプローチを提供します。
cover: >-
  assets.zilliz.com/AI_Agents_or_Workflows_Why_You_Should_Skip_Agents_for_80_of_Automation_Tasks_9f54386e8a.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, AI Agent, workflow, Refly, vector database'
meta_title: |
  AI Agents or Workflows? Why Skip Agents for 80% of Automation
origin: 'https://milvus.io/blog/ai-agents-vs-workflows-why-80-need-simple-automation.md'
---
<p>AIエージェントは、コーディングのコパイロットからカスタマー・サービスのボットまで、今どこにでもいる。皆さんの多くがそうであるように、私もエージェントが大好きだ。しかし、エージェントと自動化ワークフローの両方を構築した後、私は単純な真実を学んだ：<strong>エージェントはすべての問題に対する最良のソリューションではないという</strong>ことだ。</p>
<p>例えば、MLを解読するためにCrewAIでマルチエージェントシステムを構築したとき、物事はすぐに厄介なことになった。リサーチエージェントはウェブクローラーを70％無視した。要約エージェントは引用を落とした。タスクが明確でないときはいつも、調整がバラバラになった。</p>
<p>これは実験に限ったことではない。私たちの多くは、ブレインストーミングのためのChatGPT、コーディングのためのClaude、データ処理のための6つのAPIの間を行き来しながら、静かにこう考えて<em>いる</em>。</p>
<p>その答えがエージェントであることもある。より多くの場合、それは<strong>よく設計されたAIワークフロー</strong>であり、予測不可能な複雑さを伴わずに、既存のツールを強力なものに縫い合わせる。</p>
<h2 id="Building-Smarter-AI-Workflows-with-Refly-and-Milvus" class="common-anchor-header">ReflyとmilvusでよりスマートなAIワークフローを構築する<button data-href="#Building-Smarter-AI-Workflows-with-Refly-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>すでに首をかしげている方もいらっしゃると思います：「ワークフロー？ワークフロー？ワークフローは硬直的で、本当のAI自動化には不十分だ "と。ほとんどのワークフローが硬直的なのは、旧態依然とした組み立てラインをモデルにしているからだ。</p>
<p>しかし、本当の問題はワークフローの<em>アイデアではなく</em>、その<em>実行</em>なのだ。もろく直線的なパイプラインに甘んじる必要はない。よりスマートなワークフローを設計することで、文脈に適応し、創造性を発揮しながら、予測可能な結果を出すことができる。</p>
<p>このガイドでは、ReflyとMilvusを使用して完全なコンテンツ作成システムを構築し、AIワークフローが複雑なマルチエージェントアーキテクチャを凌駕する理由を、特にスピード、信頼性、保守性を重視する場合に説明します。</p>
<h3 id="The-Tools-We’re-Using" class="common-anchor-header">使用するツール</h3><p><a href="https://refly.ai/"><strong>Refly</strong></a>オープンソースのAIネイティブコンテンツ作成プラットフォームで、「フリーキャンバス」のコンセプトに基づいて構築されています。</p>
<ul>
<li><p><strong>主な機能：</strong>インテリジェント・キャンバス、ナレッジ管理、マルチスレッド対話、プロフェッショナルな作成ツール。</p></li>
<li><p><strong>なぜ便利なのか？</strong>ドラッグ＆ドロップでワークフローを構築できるため、硬直した単一パスの実行に縛られることなく、ツールを連鎖させてまとまりのある自動化シーケンスを構築できる。</p></li>
</ul>
<p><a href="https://milvus.io/"><strong>Milvus</strong></a>: データレイヤーを扱うオープンソースのベクターデータベース。</p>
<ul>
<li><p><strong>なぜ重要なのか？</strong>コンテンツ作成は、既存の情報を見つけて組み替えることがほとんどだ。従来のデータベースは構造化されたデータをうまく扱うが、クリエイティブな作業のほとんどは、非構造化フォーマット（文書、画像、動画）を扱う。</p></li>
<li><p><strong>何が追加されるのか？</strong>Milvusは、非構造化データをベクトルとしてエンコードする統合エンベッディングモデルを活用することで、セマンティック検索を可能にし、ワークフローがミリ秒単位のレイテンシーで関連するコンテキストを取得できるようにします。MCPのようなプロトコルを介して、AIフレームワークとシームレスに統合し、データベースの構文と格闘する代わりに自然言語でデータを照会できます。</p></li>
</ul>
<h3 id="Setting-Up-Your-Environment" class="common-anchor-header">環境のセットアップ</h3><p>このワークフローをローカルでセットアップする手順を説明しよう。</p>
<p><strong>簡単なセットアップ・チェックリスト</strong></p>
<ul>
<li><p>Ubuntu 20.04+（または同様のLinux）</p></li>
<li><p>Docker + Docker Compose</p></li>
<li><p>関数呼び出しをサポートしているLLMのAPIキー。このガイドでは、<a href="https://platform.moonshot.ai/docs/introduction#text-generation-model">Moonshotの</a>LLMを使う。</p></li>
</ul>
<p><strong>システム要件</strong></p>
<ul>
<li><p>CPU：最低8コア（16コア推奨）</p></li>
<li><p>メモリー：最低16GB（32GB推奨）</p></li>
<li><p>ストレージ最小100GB SSD（500GB推奨）</p></li>
<li><p>ネットワーク安定したインターネット接続が必要</p></li>
</ul>
<p><strong>ソフトウェアの依存性</strong></p>
<ul>
<li><p>オペレーティング・システムLinux (Ubuntu 20.04+ 推奨)</p></li>
<li><p>コンテナ化Docker + Docker Compose</p></li>
<li><p>Pythonバージョン3.11以上</p></li>
<li><p>言語モデル関数呼び出しをサポートする任意のモデル（オンラインサービスまたはOllamaオフラインデプロイの両方が動作します）</p></li>
</ul>
<h3 id="Step-1-Deploy-the-Milvus-Vector-Database" class="common-anchor-header">ステップ1: Milvus Vectorデータベースのデプロイ</h3><p><strong>1.1 Milvusのダウンロード</strong></p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus/releases/download/v2.5.12/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p><strong>1.2 Milvusサービスの起動</strong></p>
<pre><code translate="no">docker-compose up -d
docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_b93ce78614.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Deploy-the-Refly-Platform" class="common-anchor-header">ステップ2: Reflyプラットフォームのデプロイ</h3><p><strong>2.1 リポジトリのクローン</strong></p>
<p>特定の要件がない限り、すべての環境変数にデフォルト値を使用できます：</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/refly-ai/refly.git
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-built_in">cd</span> deploy/docker
<span class="hljs-built_in">cp</span> ../../apps/api/.env.example .<span class="hljs-built_in">env</span> <span class="hljs-comment"># copy the example api env file</span>
docker compose up -d
<button class="copy-code-btn"></button></code></pre>
<p><strong>2.2 サービスの状態を確認する</strong></p>
<pre><code translate="no">docker ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_cfcde2c570.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Set-Up-MCP-Services" class="common-anchor-header">ステップ3: MCPサービスのセットアップ</h3><p><strong>3.1 Milvus MCPサーバーのダウンロード</strong></p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/zilliztech/mcp-server-milvus.git
<span class="hljs-built_in">cd</span> mcp-server-milvus
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.2 MCPサービスを開始する</strong></p>
<p>この例ではSSEモードを使用しています。URIを利用可能なMilvusサービスのエンドポイントに置き換えてください：</p>
<pre><code translate="no">uv run src/mcp_server_milvus/server.py --sse --milvus-uri http://localhost:19530 --port 8000
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.3 MCPサービスが実行されていることを確認する</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_b755922c41.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configuration-and-Setup" class="common-anchor-header">ステップ 4: 構成とセットアップ</h3><p>インフラストラクチャが実行されたので、すべてがシームレスに連携するように設定しましょう。</p>
<p><strong>4.1 Refly プラットフォームにアクセスする</strong></p>
<p>ローカルの Refly インスタンスに移動します：</p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//192.168.7.148:5700</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_c1e421fece.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.2 アカウントを作成します</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/42_4b8af22fe3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/422_e8cd8439f0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.3 言語モデルを設定する</strong></p>
<p>このガイドでは、<a href="https://platform.moonshot.ai/docs/introduction#text-generation-model">Moonshotを</a>使用します。まず、登録してAPIキーを取得します。</p>
<p><strong>4.4 モデルプロバイダの追加</strong></p>
<p>前のステップで取得したAPIキーを入力します：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/44_b085f9a263.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.5 LLMモデルの設定</strong></p>
<p>関数の呼び出し機能をサポートするモデルを選択することを確認してください：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/45_a05213d0fa.pngQ" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.6 Milvus-CPサービスの統合</strong></p>
<p>Webバージョンはstdioタイプの接続をサポートしていないので、先に設定したHTTPエンドポイントを使用する：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/46_027e21e479.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/462_959ee44a78.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>素晴らしい！すべての設定が完了したので、いくつかの実例を通してこのシステムを実際に動かして見ましょう。</p>
<p><strong>4.7 例MCP-Milvus-Serverによる効率的なベクトル検索</strong></p>
<p>この例では、<strong>MCP-Milvus-Serverが</strong>AIモデルとMilvusベクトルデータベースインスタンス間のミドルウェアとしてどのように機能するかを示します。MCP-Milvus-Server は、AI モデルからの自然言語要求を受け付け、適切なデータベースクエリに変換し、結果を返すトランスレータのような役割を果たしますので、モデルはデータベースの構文を知らなくてもベクトルデータを扱うことができます。</p>
<p><strong>4.7.1 新しいキャンバスを作成する</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/471_a684e275ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.7.2 会話の開始</strong></p>
<p>対話インターフェースを開き、モデルを選択し、質問を入力して送信します。</p>
<p><strong>4.7.3 結果を確認する</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/473_7c24a28999.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><a href="https://milvus.io/blog/talk-to-vector-db-manage-milvus-via-natural-language.md">MCP-Milvus-Server を</a>統合レイヤーとして使用し、Milvus ベクターデータベースを自然言語で制御することを示しました。MCP-Milvus-Server を統合レイヤとして使用することで、Milvus ベクトルデータベースを自然言語で制御することができます。</p>
<p><strong>4.8 例 2: ワークフローを使用した Refly 配備ガイドの構築</strong></p>
<p>この 2 番目の例では、ワークフローオーケストレーションの真の力を示します。複数の AI ツールとデータソースを 1 つの首尾一貫したプロセスに組み合わせることで、完全なデプロイメントガイドを作成します。</p>
<p><strong>4.8.1 ソースを集める</strong></p>
<p>Reflyの強みは、さまざまな入力フォーマットに柔軟に対応できることです。文書、画像、構造化データなど、複数の形式のリソースをインポートできます。</p>
<p><strong>4.8.2 タスクの作成とリソースカードのリンク</strong></p>
<p>次に、タスクを定義し、それらをソース素材に接続することで、ワークフローを作成します。</p>
<p><strong>4.8.3 3つの処理タスクを設定する</strong></p>
<p>ワークフローアプローチは、ここで真価を発揮します。すべてを1つの複雑なプロセスで処理しようとするのではなく、アップロードされた素材を統合し、体系的に洗練させる3つの集中タスクに作業を分割します。</p>
<ul>
<li><p><strong>コンテンツ統合タスク</strong>素材を組み合わせ、構成する。</p></li>
<li><p><strong>コンテンツの洗練タスク</strong>：明快さと流れを改善します。</p></li>
<li><p><strong>最終原稿の編集</strong>：出版可能なアウトプットの作成</p></li>
</ul>
<p>その結果が物語っている。複数のツールにまたがる手作業で何時間もかかっていた調整が、各ステップが前のステップを論理的に構築しながら、自動的に処理されるようになりました。</p>
<p><strong>マルチモーダルワークフロー機能</strong></p>
<ul>
<li><p><strong>画像生成と処理</strong>flux-schnell、flux-pro、SDXLなどの高品質モデルとの統合。</p></li>
<li><p><strong>ビデオ生成と理解</strong>：Seedance、Kling、Veoなど、さまざまな様式化されたビデオモデルをサポート。</p></li>
<li><p><strong>音声生成ツール</strong>：Lyria-2などのモデルによる音楽生成、Chatterboxなどのモデルによる音声合成</p></li>
<li><p><strong>統合処理</strong>：すべてのマルチモーダル出力は、システム内で参照、分析、再処理が可能。</p></li>
</ul>
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
    </button></h2><p><strong>Reflyと</strong> <strong>Milvusの</strong>統合は、不必要な複雑さよりも信頼性と使いやすさを重視する、自動化への実用的なアプローチを提供します。ワークフロー・オーケストレーションとマルチモーダル処理を組み合わせることで、チームはコンセプトから出版まで、すべての段階で完全なコントロールを維持しながら、より迅速に進めることができます。</p>
<p>これはAIエージェントを否定するものではない。AIエージェントは、本当に複雑で予測不可能な問題に取り組むには貴重な存在だ。しかし、多くの自動化ニーズ、特にコンテンツ制作やデータ処理においては、うまく設計されたワークフローによって、より少ないオーバーヘッドでより良い結果を出すことができる。</p>
<p>AI技術が進化するにつれ、最も効果的なシステムは両方の戦略を融合したものになるだろう：</p>
<ul>
<li><p>予測可能性、保守性、再現性が鍵となる<strong>ワークフロー</strong>。</p></li>
<li><p>予測可能性、保守性、再現性が鍵となるワーク<strong>フローと</strong>、真の推論、適応性、オープンエンドな問題解決が求められる<strong>エージェント</strong>。</p></li>
</ul>
<p>目標は、最も派手なAIを構築することではなく、最も<em>有用な</em>AIを構築することである。そして多くの場合、最も有用な解決策は最も単純なものでもある。</p>
