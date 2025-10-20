---
id: >-
  vllm-semantic-router-milvus-how-semantic-routing-and-caching-scale-ai-systems-the-smart-way.md
title: 'vLLM Semantic Router + Milvus: セマンティックルーティングとキャッシングでスケーラブルなAIシステムをスマートに構築する方法'
author: Min Yin
date: 2025-10-17T00:00:00.000Z
cover: assets.zilliz.com/Chat_GPT_Image_Oct_19_2025_04_30_18_PM_af7fda1170.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, semantic routing, cache layer, vector database, vllm semantic router'
meta_title: Scale Your AI Apps the Smart Way with vLLM Semantic Router and Milvus
desc: >-
  vLLM、Milvus、およびセマンティック・ルーティングが、大規模モデルの推論を最適化し、計算コストを削減し、スケーラブルなデプロイメントでAIのパフォーマンスをどのように向上させるかをご覧ください。
origin: >-
  https://milvus.io/blog/vllm-semantic-router-milvus-how-semantic-routing-and-caching-scale-ai-systems-the-smart-way.md
---
<p>ほとんどのAIアプリは、すべてのリクエストに対して単一のモデルに依存している。しかし、このアプローチはすぐに限界に直面する。大規模なモデルは、単純なクエリに使用する場合でも、強力だが高価だ。小型のモデルはより安価で高速だが、複雑な推論には対応できない。トラフィックが急増したとき、例えばあなたのAIアプリが一晩で1,000万人のユーザーを集めて突然流行したとき、この1モデル・フォー・オールのセットアップの非効率性が痛いほど明らかになる。レイテンシーが急増し、GPUのコストが爆発的に上昇し、昨日まで問題なく動作していたモデルが息も絶え絶えになり始める。</p>
<p>そして、このアプリのエンジニアである<em>あなたは</em>、それを素早く修正しなければならない。</p>
<p>サイズの異なる複数のモデルをデプロイし、システムがリクエストごとに最適なものを自動的に選択することを想像してみてほしい。単純なプロンプトはより小さなモデルへ、複雑なクエリはより大きなモデルへ。<a href="https://github.com/vllm-project/semantic-router"><strong>vLLMセマンティック・ルーターは、</strong></a>エンドポイントではなく、意味に基づいてリクエストを誘導するルーティングメカニズムです。vLLMセマンティック・ルーターは、各入力の意味内容、複雑さ、意図を分析して最適な言語モデルを選択し、すべてのクエリが最適なモデルによって処理されるようにします。</p>
<p>これをさらに効率的にするために、セマンティックルーターは、<strong>セマンティックキャッシュレイヤーとして</strong>機能するオープンソースのベクトルデータベース<a href="https://milvus.io/"><strong>Milvusと</strong></a>ペアになっている。レスポンスを再計算する前に、セマンティックに類似したクエリがすでに処理されていないかチェックし、見つかった場合は即座にキャッシュされた結果を取得する。その結果、レスポンスの高速化、コストの削減、無駄を省きインテリジェントに拡張する検索システムが実現する。</p>
<p>この投稿では、<strong>vLLMセマンティックルーターが</strong>どのように機能するのか、<strong>Milvusが</strong>どのようにキャッシュレイヤーを強化するのか、そしてこのアーキテクチャが実際のAIアプリケーションにどのように適用できるのかについて深く掘り下げていく。</p>
<h2 id="What-is-a-Semantic-Router" class="common-anchor-header">セマンティック・ルーターとは？<button data-href="#What-is-a-Semantic-Router" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>セマンティック・ルーターとは</strong>、リクエストの意味、複雑さ、意図に基づいて、<em>どのモデルが</em>リクエストを処理すべきかを決定するシステムである。全てを1つのモデルにルーティングするのではなく、複数のモデルにリクエストをインテリジェントに分散し、精度、レイテンシー、コストのバランスをとる。</p>
<p>アーキテクチャ的には、3つの主要なレイヤーの上に構築されている：<strong>セマンティック・ルーティング</strong>、<strong>ミクスチャー・オブ・モデル（MoM）</strong>、<strong>キャッシュ・レイヤー</strong>です。</p>
<h3 id="Semantic-Routing-Layer" class="common-anchor-header">セマンティック・ルーティング層</h3><p><strong>セマンティック・ルーティング層は</strong>システムの頭脳である。各入力を分析し、それが何を尋ねているのか、どの程度複雑なのか、どのような推論が必要なのかを判断し、その作業に最適なモデルを選択する。例えば、単純な事実の検索は軽量なモデルに、多段階の推論クエリはより大きなモデルにルーティングされる。この動的なルーティングにより、トラフィックやクエリの多様性が増大しても、システムの応答性が維持される。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/modern_approach_714403b61c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Mixture-of-Models-MoM-Layer" class="common-anchor-header">モデルの混合（MoM）レイヤー</h3><p>2つ目のレイヤーである<strong>MoM（Mixture of Models</strong>）は、サイズや能力の異なる複数のモデルを1つの統合されたシステムに統合します。これは<a href="https://zilliz.com/learn/what-is-mixture-of-experts"><strong>ミクスチャー・オブ・エキスパート</strong></a> <strong>（MoE）</strong>アーキテクチャにヒントを得たものだが、単一の大きなモデル内で「エキスパート」を選ぶのではなく、複数の独立したモデルで動作する。この設計により、待ち時間が短縮され、コストが削減され、単一のモデル・プロバイダに縛られることがなくなります。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/MOM_0a3eb61985.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="The-Cache-Layer-Where-Milvus-Makes-the-Difference" class="common-anchor-header">キャッシュレイヤー：Milvusが違いを生むところ</h3><p>最後に、<a href="https://milvus.io/">Milvus Vector Databaseを</a> <strong>搭載したキャッシュレイヤーは</strong>、システムのメモリとして<a href="https://milvus.io/">機能</a>します。新しいクエリを実行する前に、意味的に類似したリクエストが以前に処理されたかどうかをチェックする。もしそうであれば、キャッシュされた結果を即座に取得し、計算時間を節約し、スループットを向上させる。</p>
<p>従来のキャッシュシステムは、インメモリーのキーバリューストアに依存しており、正確な文字列またはテンプレートによってリクエストをマッチングする。クエリが反復的で予測可能な場合、これはうまく機能する。しかし、実際のユーザーが同じことを2度入力することはめったにありません。言い回しが少しでも変わると、キャッシュはそれを同じ意図として認識できない。時間が経つにつれて、キャッシュのヒット率は低下し、言語が自然にドリフトするにつれてパフォーマンスの向上は消えていく。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/semantic_caching_for_vllm_routing_df889058c9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>これを解決するには、単語のマッチングだけでなく、<em>意味を</em>理解するキャッシュが必要だ。そこで<strong>セマンティック検索が</strong>登場する。文字列を比較する代わりに、埋め込みを比較する。埋め込みとは、意味の類似性をとらえる高次元のベクトル表現である。しかし、課題は規模である。1台のマシンで数百万、数十億のベクトルを総当たりで検索するのは（時間の複雑さがO(N-d)であるため）計算量的に不可能である。メモリコストは爆発的に増大し、水平方向のスケーラビリティは崩壊し、システムは突然のトラフィックの急増やロングテールのクエリの処理に苦労する。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_routing_system_5837b93074.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Milvusは</strong>大規模な意味検索のために作られた分散ベクトルデータベースとして、このキャッシュレイヤーに必要な水平方向のスケーラビリティと耐障害性をもたらす。Milvusは埋め込みデータをノード間で効率的に保存し、大規模な検索でも最小限のレイテンシで<a href="https://zilliz.com/blog/ANN-machine-learning">近似最近傍</a>（ANN）検索を実行します。適切な類似度の閾値とフォールバック戦略により、Milvusは安定した予測可能なパフォーマンスを保証し、キャッシュレイヤーをルーティングシステム全体の回復力のあるセマンティックメモリーに変えます。</p>
<h2 id="How-Developers-Are-Using-Semantic-Router-+-Milvus-in-Production" class="common-anchor-header">セマンティックルーターとMilvusを本番環境でどのように使用しているか<button data-href="#How-Developers-Are-Using-Semantic-Router-+-Milvus-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>vLLM Semantic Routerと</strong> <strong>Milvusの</strong>組み合わせは、スピード、コスト、再利用性のすべてが重要な実運用環境で威力を発揮します。</p>
<p>3つの一般的なシナリオが目立つ：</p>
<h3 id="1-Customer-Service-QA" class="common-anchor-header">1.カスタマーサービスQ&amp;A</h3><p>顧客対応ボットは、パスワードのリセット、アカウントの更新、配送状況など、毎日大量の繰り返しクエリを処理しています。この領域はコストとレイテンシの両方に敏感で、セマンティックルーティングに理想的です。ルーターは、定型的な質問をより小さな、より高速なモデルに送り、複雑なものや曖昧なものは、より深い推論のために、より大きなモデルにエスカレーションする。一方、Milvusは過去のQ&amp;Aのペアをキャッシュするため、類似のクエリが出現した場合、システムは過去の回答を再生成するのではなく、即座に再利用することができる。</p>
<h3 id="2-Code-Assistance" class="common-anchor-header">2.コードアシスト</h3><p>開発者ツールやIDEアシスタントでは、構文ヘルプ、APIルックアップ、小さなデバッグヒントなど、多くのクエリが重複している。それぞれのプロンプトの意味構造を分析することで、ルータは適切なモデルサイズを動的に選択します。単純なタスクには軽量なモデルを、マルチステップの推論にはより高性能なモデルを使用します。Milvusは、類似のコーディング問題とその解決策をキャッシュし、過去のユーザーとのやり取りを再利用可能な知識ベースにすることで、応答性をさらに高めている。</p>
<h3 id="3-Enterprise-Knowledge-Base" class="common-anchor-header">3.エンタープライズ知識ベース</h3><p>企業のクエリは、ポリシー検索、コンプライアンス参照、製品FAQなど、時間の経過とともに繰り返される傾向があります。Milvusをセマンティックキャッシュレイヤーとして使用することで、よくある質問とその回答を効率的に保存し、検索することができます。これにより冗長な計算を最小限に抑えながら、部門や地域間で一貫した回答を維持することができる。</p>
<p><strong>セマンティックルーター＋Milvus</strong>パイプラインは、<strong>Goと</strong> <strong>Rustで</strong>実装され、高いパフォーマンスと低レイテンシーを実現しています。ゲートウェイ層に統合され、ヒット率、ルーティングレイテンシー、モデルパフォーマンスなどの主要メトリクスを継続的に監視し、ルーティング戦略をリアルタイムで微調整します。</p>
<h2 id="How-to-Quickly-Test-the-Semantic-Caching-in-the-Semantic-Router" class="common-anchor-header">セマンティック・ルーターでセマンティック・キャッシングを素早くテストする方法<button data-href="#How-to-Quickly-Test-the-Semantic-Caching-in-the-Semantic-Router" class="anchor-icon" translate="no">
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
    </button></h2><p>セマンティックキャッシングを大規模にデプロイする前に、コントロールされたセットアップでどのように動作するかを検証することは有益です。このセクションでは、セマンティックルーターがどのように<strong>Milvusを</strong>セマンティックキャッシュとして使用しているかを示す、簡単なローカルテストを説明します。似たようなクエリが即座にキャッシュにヒットする一方で、新しいクエリや異なるクエリがモデル生成のトリガーとなり、キャッシュロジックが動作していることがわかります。</p>
<h3 id="Prerequisites" class="common-anchor-header">前提条件</h3><ul>
<li>コンテナ環境：Docker + Docker Compose</li>
<li>ベクターデータベース：Milvusサービス</li>
<li>LLM + エンベッディング：ローカルにダウンロードしたプロジェクト</li>
</ul>
<h3 id="1Deploy-the-Milvus-Vector-Database" class="common-anchor-header">1.Milvus Vector Databaseのデプロイ</h3><p>展開ファイルのダウンロード</p>
<pre><code translate="no">wget https://github.com/Milvus-io/Milvus/releases/download/v2.5.12/Milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>Milvusサービスを起動する。</p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Start_the_Milvus_service_211f8b11f1.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="2-Clone-the-project" class="common-anchor-header">2.プロジェクトのクローン</h3><pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/vllm-project/semantic-router.git
<button class="copy-code-btn"></button></code></pre>
<h3 id="3-Download-local-models" class="common-anchor-header">3.ローカルモデルのダウンロード</h3><pre><code translate="no"><span class="hljs-built_in">cd</span> semantic-router
make download-models
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Download_local_models_6243011fa5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="4-Configuration-Modifications" class="common-anchor-header">4.設定の修正</h3><p>注: semantic_cacheタイプをmilvusに変更する。</p>
<pre><code translate="no">vim config.yaml
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">semantic_cache:
  enabled: true
  backend_type: <span class="hljs-string">&quot;milvus&quot;</span>  <span class="hljs-comment"># Options: &quot;memory&quot; or &quot;milvus&quot;</span>
  backend_config_path: <span class="hljs-string">&quot;config/cache/milvus.yaml&quot;</span>
  similarity_threshold: <span class="hljs-number">0.8</span>
  max_entries: <span class="hljs-number">1000</span>  <span class="hljs-comment"># Only applies to memory backend</span>
  ttl_seconds: <span class="hljs-number">3600</span>
  eviction_policy: <span class="hljs-string">&quot;fifo&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>Mmilvus設定の修正 Note: 配備されたばかりのMilvusmilvusサービスを記入する。</p>
<pre><code translate="no">vim milvus.yaml
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-comment"># Milvus connection settings</span>
connection:
  <span class="hljs-comment"># Milvus server host (change for production deployment)</span>
  host: <span class="hljs-string">&quot;192.168.7.xxx&quot;</span>  <span class="hljs-comment"># For production: use your Milvus cluster endpoint</span>
  <span class="hljs-comment"># Milvus server port</span>
  port: <span class="hljs-number">19530</span>  <span class="hljs-comment"># Standard Milvus port</span>
  <span class="hljs-comment"># Database name (optional, defaults to &quot;default&quot;)</span>
  database: <span class="hljs-string">&quot;default&quot;</span>
  <span class="hljs-comment"># Connection timeout in seconds</span>
  timeout: <span class="hljs-number">30</span>
  <span class="hljs-comment"># Authentication (enable for production)</span>
  auth:
    enabled: false  <span class="hljs-comment"># Set to true for production</span>
    username: <span class="hljs-string">&quot;&quot;</span>    <span class="hljs-comment"># Your Milvus username</span>
    password: <span class="hljs-string">&quot;&quot;</span>    <span class="hljs-comment"># Your Milvus password</span>
  <span class="hljs-comment"># TLS/SSL configuration (recommended for production)</span>
  tls:
    enabled: false      <span class="hljs-comment"># Set to true for secure connections</span>
    cert_file: <span class="hljs-string">&quot;&quot;</span>       <span class="hljs-comment"># Path to client certificate</span>
    key_file: <span class="hljs-string">&quot;&quot;</span>        <span class="hljs-comment"># Path to client private key</span>
    ca_file: <span class="hljs-string">&quot;&quot;</span>         <span class="hljs-comment"># Path to CA certificate</span>
<span class="hljs-comment"># Collection settings</span>
collection:
  <span class="hljs-comment"># Name of the collection to store cache entries</span>
  name: <span class="hljs-string">&quot;semantic_cache&quot;</span>
  <span class="hljs-comment"># Description of the collection</span>
  description: <span class="hljs-string">&quot;Semantic cache for LLM request-response pairs&quot;</span>
  <span class="hljs-comment"># Vector field configuration</span>
  vector_field:
    <span class="hljs-comment"># Name of the vector field</span>
    name: <span class="hljs-string">&quot;embedding&quot;</span>
    <span class="hljs-comment"># Dimension of the embeddings (auto-detected from model at runtime)</span>
    dimension: <span class="hljs-number">384</span>  <span class="hljs-comment"># This value is ignored - dimension is auto-detected from the embedding model</span>
    <span class="hljs-comment"># Metric type for similarity calculation</span>
    metric_type: <span class="hljs-string">&quot;IP&quot;</span>  <span class="hljs-comment"># Inner Product (cosine similarity for normalized vectors)</span>
  <span class="hljs-comment"># Index configuration for the vector field</span>
  index:
    <span class="hljs-comment"># Index type (HNSW is recommended for most use cases)</span>
    <span class="hljs-built_in">type</span>: <span class="hljs-string">&quot;HNSW&quot;</span>
    <span class="hljs-comment"># Index parameters</span>
    params:
      M: <span class="hljs-number">16</span>              <span class="hljs-comment"># Number of bi-directional links for each node</span>
      efConstruction: <span class="hljs-number">64</span>  <span class="hljs-comment"># Search scope during index construction</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="5-Start-the-project" class="common-anchor-header">5.プロジェクトの開始</h3><p>注: いくつかのDockerfileの依存関係を国内ソースに修正することをお勧めします。</p>
<pre><code translate="no">docker compose --profile testing up --build
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Start_the_project_4e7c2a8332.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="6-Test-Requests" class="common-anchor-header">6.リクエストのテスト</h3><p>Note: 合計2つのリクエスト（キャッシュなし、キャッシュヒットあり）：</p>
<pre><code translate="no"><span class="hljs-built_in">echo</span> <span class="hljs-string">&quot;=== 第一次请求（无缓存状态） ===&quot;</span> &amp;&amp; \
<span class="hljs-keyword">time</span> curl -X POST http://localhost:8801/v1/chat/completions \
  -H <span class="hljs-string">&quot;Content-Type: application/json&quot;</span> \
  -H <span class="hljs-string">&quot;Authorization: Bearer test-token&quot;</span> \
  -d <span class="hljs-string">&#x27;{
    &quot;model&quot;: &quot;auto&quot;,
    &quot;messages&quot;: [
      {&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;You are a helpful assistant.&quot;},
      {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;What are the main renewable energy sources?&quot;}
    ],
    &quot;temperature&quot;: 0.7
  }&#x27;</span> | jq .
<button class="copy-code-btn"></button></code></pre>
<p>出力：</p>
<pre><code translate="no"><span class="hljs-built_in">real</span>    <span class="hljs-number">0</span>m16<span class="hljs-number">.546</span>s
user    <span class="hljs-number">0</span>m0<span class="hljs-number">.116</span>s
sys     <span class="hljs-number">0</span>m0<span class="hljs-number">.033</span>s
<button class="copy-code-btn"></button></code></pre>
<p>2回目のリクエスト</p>
<pre><code translate="no"><span class="hljs-built_in">echo</span> <span class="hljs-string">&quot;=== 第二次请求（缓存状态） ===&quot;</span> &amp;&amp; \
<span class="hljs-keyword">time</span> curl -X POST http://localhost:8801/v1/chat/completions \
  -H <span class="hljs-string">&quot;Content-Type: application/json&quot;</span> \
  -H <span class="hljs-string">&quot;Authorization: Bearer test-token&quot;</span> \
  -d <span class="hljs-string">&#x27;{
    &quot;model&quot;: &quot;auto&quot;,
    &quot;messages&quot;: [
      {&quot;role&quot;: &quot;system&quot;, &quot;content&quot;: &quot;You are a helpful assistant.&quot;},
      {&quot;role&quot;: &quot;user&quot;, &quot;content&quot;: &quot;What are the main renewable energy sources?&quot;}
    ],
    &quot;temperature&quot;: 0.7
  }&#x27;</span> | jq .
<button class="copy-code-btn"></button></code></pre>
<p>出力</p>
<pre><code translate="no"><span class="hljs-built_in">real</span>    <span class="hljs-number">0</span>m2<span class="hljs-number">.393</span>s
user    <span class="hljs-number">0</span>m0<span class="hljs-number">.116</span>s
sys     <span class="hljs-number">0</span>m0<span class="hljs-number">.021</span>s
<button class="copy-code-btn"></button></code></pre>
<p>このテストは、セマンティック・ルーターのセマンティック・キャッシングの動作を示している。Milvusをベクトルデータベースとして活用することで、意味的に類似したクエリを効率的にマッチングさせ、ユーザーが同じまたは類似した質問をした際のレスポンスタイムを改善している。</p>
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
    </button></h2><p>AIワークロードが増大し、コストの最適化が不可欠になる中、vLLMセマンティックルーターと<a href="https://milvus.io/">Milvusの</a>組み合わせは、インテリジェントにスケールする実用的な方法を提供します。各クエリを適切なモデルにルーティングし、セマンティックに類似した結果を分散ベクターデータベースでキャッシュすることで、このセットアップは、ユースケース全体でレスポンスを高速かつ一貫したものに保ちながら、計算オーバーヘッドを削減します。</p>
<p>つまり、よりスマートなスケーリングが可能になるのです。</p>
<p>もし、これをさらに探求したいのであれば、<a href="https://discord.com/invite/8uyFbECzPX">Milvus Discordで</a>会話に参加するか、<a href="https://github.com/milvus-io/milvus"> GitHubで</a>課題を開いてください。また、<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hoursの</a>20分の<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> セッションを</a>予約して、Milvusの開発チームからマンツーマンのガイダンス、洞察、技術的なディープダイブを受けることもできます。</p>
