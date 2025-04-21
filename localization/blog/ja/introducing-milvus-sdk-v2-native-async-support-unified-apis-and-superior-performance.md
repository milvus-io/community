---
id: >-
  introducing-milvus-sdk-v2-native-async-support-unified-apis-and-superior-performance.md
title: Milvus SDK v2のご紹介：ネイティブ非同期サポート、統合API、優れたパフォーマンス
author: Ken Zhang
date: 2025-04-16T00:00:00.000Z
desc: Milvus SDK v2を体験してください！統一されたAPI、ネイティブの非同期サポート、ベクター検索プロジェクトのパフォーマンス向上をお楽しみください。
cover: assets.zilliz.com/Introducing_Milvus_SDK_v2_05c9e5e8b2.png
tag: Engineering
tags: 'Milvus SDK v2, Async Support, Milvus vector database'
canonicalUrl: >-
  https://milvus.io/blog/introducing-milvus-sdk-v2-native-async-support-unified-apis-and-superior-performance.md
---
<h2 id="TLDR" class="common-anchor-header">TL;DR<button data-href="#TLDR" class="anchor-icon" translate="no">
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
    </button></h2><p>皆様の声に耳を傾けました！Milvus SDK v2は、皆様からのフィードバックから直接構築された、開発者エクスペリエンスの完全な再構築です。Python、Java、Go、Node.jsで統一されたAPI、皆様からご要望の多かったネイティブの非同期サポート、パフォーマンスを向上させるスキーマキャッシュ、そしてシンプルになったMilvusClientインターフェイスにより、Milvus SDK v2は<a href="https://zilliz.com/learn/vector-similarity-search">ベクトル検索</a>開発をこれまで以上に迅速かつ直感的にします。<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>アプリケーション、レコメンデーションシステム、または<a href="https://zilliz.com/learn/what-is-computer-vision">コンピュータビジョンソリューションを</a>構築しているかに関わらず、このコミュニティ主導のアップデートは、Milvusを使用した作業方法を変革するでしょう。</p>
<h2 id="Why-We-Built-It-Addressing-Community-Pain-Points" class="common-anchor-header">なぜ作ったのかコミュニティのペインポイントへの対応<button data-href="#Why-We-Built-It-Addressing-Community-Pain-Points" class="anchor-icon" translate="no">
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
    </button></h2><p>長年にわたり、Milvusは何千ものAIアプリケーションに選ばれる<a href="https://milvus.io/blog/what-is-a-vector-database.md">ベクターデータベースと</a>なりました。しかし、コミュニティが成長するにつれ、SDK v1にはいくつかの制限があることを常に耳にするようになりました：</p>
<p><strong>"高い並行性を扱うのは複雑すぎる"</strong>一部の言語SDKではネイティブの非同期サポートがないため、開発者はスレッドやコールバックに頼らざるを得ず、特にバッチデータローディングや並列クエリなどのシナリオでは、コードの管理やデバッグが難しくなっていました。</p>
<p><strong>"規模が大きくなるとパフォーマンスが低下する"</strong>スキーマ・キャッシュがなければ、v1は操作中にスキーマの検証を繰り返し、大量のワークロードのボトルネックになっていた。大規模なベクトル処理を必要とするユースケースでは、この問題は待ち時間の増加とスループットの低下を招いた。</p>
<p><strong>"言語間の一貫性のないインターフェースが、急な学習曲線を生む"</strong>異なる言語のSDKは、独自の方法でインターフェースを実装しており、言語間の開発を複雑にしていた。</p>
<p><strong>「RESTful APIに必要な機能が欠けている。</strong>パーティション管理やインデックス構築のような重要な機能が利用できず、開発者は異なるSDK間で切り替えることを余儀なくされていた。</p>
<p>これらは単なる機能要望ではなく、開発ワークフローにおける現実的な障害でした。SDK v2は、このような障壁を取り除き、お客様が重要なこと、つまり素晴らしいAIアプリケーションの構築に集中できるようにすることをお約束します。</p>
<h2 id="The-Solution-Milvus-SDK-v2" class="common-anchor-header">ソリューションMilvus SDK v2<button data-href="#The-Solution-Milvus-SDK-v2" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus SDK v2は、開発者のエクスペリエンスに焦点を当てた完全な再設計の結果であり、複数の言語で利用可能です：</p>
<ul>
<li><p><a href="https://milvus.io/api-reference/pymilvus/v2.5.x/About.md">Python SDK v2 (pymilvus.MilvusClient)</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-sdk-java">Java v2</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus/tree/client/v2.5.1/client">Go v2</a></p></li>
<li><p><a href="https://github.com/milvus-io/milvus-sdk-node">NodeJS</a></p></li>
<li><p><a href="https://milvus.io/api-reference/restful/v2.5.x/About.md">RESTful v2</a></p></li>
</ul>
<h3 id="1-Native-Asynchronous-Support-From-Complex-to-Concurrent" class="common-anchor-header">1.ネイティブ非同期サポート：複雑なものから並行処理へ</h3><p>従来の並行処理の方法は、面倒なFutureオブジェクトとコールバックパターンを含んでいました。SDK v2では、特にPythonの<code translate="no">AsyncMilvusClient</code> （v2.5.3以降）において、真の非同期/待機機能が導入されました。同期的なMilvusClientと同じパラメータを使用することで、挿入、クエリ、検索などの操作を簡単に並列実行することができます。</p>
<p>この簡素化されたアプローチは、旧来の煩雑なフューチャーやコールバックのパターンに取って代わり、よりクリーンで効率的なコードにつながります。ベクトル一括挿入や複数クエリの並列実行のような複雑な並列ロジックも、<code translate="no">asyncio.gather</code> のようなツールを使って簡単に実装できるようになりました。</p>
<h3 id="2-Schema-Cache-Boosting-Performance-Where-It-Counts" class="common-anchor-header">2.スキーマキャッシュ：重要な部分のパフォーマンス向上</h3><p>SDK v2では、最初のフェッチ後にコレクション・スキーマをローカルに保存するスキーマ・キャッシュを導入し、操作中に繰り返されるネットワーク要求とCPUオーバーヘッドを排除しています。</p>
<p>挿入やクエリの頻度が高いシナリオでは、この更新は次のことにつながります：</p>
<ul>
<li><p>クライアントとサーバー間のネットワークトラフィックの削減</p></li>
<li><p>操作の待ち時間の短縮</p></li>
<li><p>サーバー側のCPU使用率の減少</p></li>
<li><p>高い同時実行性下でのスケーリング向上</p></li>
</ul>
<p>これは、リアルタイム・レコメンデーション・システムやライブ検索機能など、ミリ秒単位が重要なアプリケーションでは特に価値がある。</p>
<h3 id="3-A-Unified-and-Streamlined-API-Experience" class="common-anchor-header">3.統一され合理化されたAPIエクスペリエンス</h3><p>Milvus SDK v2では、サポートされているすべてのプログラミング言語において、統一されたより完全なAPIエクスペリエンスを導入しています。特にRESTful APIが大幅に強化され、gRPCインターフェースとほぼ同等の機能を提供します。</p>
<p>以前のバージョンでは、RESTful API は gRPC に遅れをとり、開発者がインターフェースを切り替えることなくできることが制限されていました。もはやそのようなことはありません。現在、開発者はRESTful APIを使用して、コレクションの作成、パーティションの管理、インデックスの構築、クエリの実行など、事実上すべてのコア操作を実行できます。</p>
<p>この統一されたアプローチにより、さまざまな環境やユースケースで一貫した開発者エクスペリエンスが保証されます。学習曲線が短縮され、統合が簡素化され、全体的な使い勝手が向上します。</p>
<p>注：ほとんどのユーザーにとって、RESTful APIはMilvusをより早く簡単に使い始める方法を提供します。しかし、アプリケーションに高いパフォーマンスやイテレータのような高度な機能が要求される場合、gRPCクライアントが最大限の柔軟性と制御性を提供します。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RES_Tful_8520a80a8e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="4-Aligned-SDK-Design-Across-All-Languages" class="common-anchor-header">4.全言語で一直線になったSDK設計</h3><p>Milvus SDK v2では、より一貫した開発者体験を提供するために、サポートされるすべてのプログラミング言語にわたってSDKの設計を標準化しました。</p>
<p>Python、Java、Go、Node.jsのいずれで開発する場合でも、各SDKはMilvusClientクラスを中心とした統一された構造に従っています。この再設計により、メソッドの命名、パラメータのフォーマット、および全体的な使用パターンが、私たちがサポートするすべての言語で一貫したものになりました。(参照:<a href="https://github.com/milvus-io/milvus/discussions/33979">MilvusClient SDK コード例の更新 - GitHub Discussion #33979</a>)</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_Client_9a4a6da9e3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>これにより、ある言語でMilvusに慣れ親しんだ後でも、SDKの動作を学び直すことなく、簡単に他の言語に切り替えることができます。この連携により、オンボーディングが簡素化されるだけでなく、多言語開発がよりスムーズで直感的になります。</p>
<h3 id="5-A-Simpler-Smarter-PyMilvus-Python-SDK-with-MilvusClient" class="common-anchor-header">5.よりシンプルでスマートなPyMilvus（Python SDK）。<code translate="no">MilvusClient</code></h3><p>以前のバージョンでは、PyMilvusはオブジェクト指向と手続き型アプローチの混合を導入したORMスタイルの設計に依存していました。開発者は<code translate="no">FieldSchema</code> オブジェクトを定義し、<code translate="no">CollectionSchema</code> を構築し、<code translate="no">Collection</code> クラスをインスタンス化しなければなりませんでした。このプロセスは冗長であるだけでなく、新しいユーザーにとって学習曲線がより険しいものであった。</p>
<p>新しい<code translate="no">MilvusClient</code> インターフェースでは、はるかにシンプルになりました。<code translate="no">create_collection()</code> メソッドを使用して、1ステップでコレクションを作成できるようになりました。<code translate="no">dimension</code> や<code translate="no">metric_type</code> のようなパラメータを渡すことで、スキーマを素早く定義することができますし、必要に応じてカスタムスキーマオブジェクトを使用することもできます。</p>
<p>さらに良いことに、<code translate="no">create_collection()</code> は同じ呼び出しの一部としてインデックス作成をサポートしています。<code translate="no">create_index()</code> <code translate="no">load()</code> インデックスパラメータが与えられると、Milvusは自動的にインデックスを作成し、データをメモリにロードします。1つのメソッドで、<em>コレクションの作成 → インデックスの作成 → コレクションのロードの</em>すべてを行うことができます。</p>
<p>この合理的なアプローチにより、セットアップの複雑さが軽減され、Milvusを使い始めることが非常に容易になります。特に、プロトタイピングや製品化への迅速で効率的なパスを求めている開発者にとってはそうです。</p>
<p>新しい<code translate="no">MilvusClient</code> モジュールは、ユーザビリティ、一貫性、パフォーマンスにおいて明確な利点を提供します。レガシーORMインターフェースは今のところ利用可能ですが、将来的には段階的に廃止していく予定です（<a href="https://docs.zilliz.com/reference/python/ORM#:~:text=About%20to%20Deprecate">リファレンス</a>参照）。改良点をフルに活用するために、新しいSDKにアップグレードすることを強くお勧めします。</p>
<h3 id="6-Clearer-and-More-Comprehensive-Documentation" class="common-anchor-header">6.より明確で包括的なドキュメント</h3><p>より完全で明確な<a href="https://milvus.io/docs">APIリファレンスを</a>提供するために、製品ドキュメントを再構築しました。ユーザーガイドには多言語のサンプルコードが含まれており、Milvusの機能を簡単に理解し、すぐに使い始めることができます。さらに、ドキュメントサイトで利用可能なAsk AIアシスタントは、新機能の紹介、内部メカニズムの説明、サンプルコードの生成や修正までサポートし、ドキュメントの旅をよりスムーズで楽しいものにします。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Ask_AI_Assistant_b044d4621a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="7-Milvus-MCP-Server-Designed-for-the-Future-of-AI-Integration" class="common-anchor-header">7.Milvus MCPサーバー：AIインテグレーションの未来のために設計</h3><p><a href="https://github.com/zilliztech/mcp-server-milvus">Milvusの</a>SDKの上に構築された<a href="https://github.com/zilliztech/mcp-server-milvus">MCPサーバーは</a>、AIエコシステムで高まっているニーズ、すなわち大規模言語モデル<a href="https://zilliz.com/glossary/large-language-models-(llms)">（LLM</a>）、<a href="https://milvus.io/blog/what-is-a-vector-database.md">ベクトルデータベース</a>、外部ツールやデータソース間のシームレスな統合に対する私たちの答えです。このSDKはモデルコンテキストプロトコル（MCP）を実装し、Milvusのオペレーションをオーケストレーションするための統一されたインテリジェントなインターフェースを提供します。</p>
<p><a href="https://zilliz.com/blog/top-10-ai-agents-to-watch-in-2025">AIエージェントが</a>単にコードを生成するだけでなく、バックエンドのサービスを自律的に管理できるようになるにつれ、よりスマートでAPI駆動型のインフラストラクチャに対する需要が高まっています。MCPサーバーは、このような未来を念頭に置いて設計されました。MCPサーバーは、Milvusクラスタとのインテリジェントで自動化されたインタラクションを可能にし、デプロイメント、メンテナンス、データ管理などのタスクを合理化します。</p>
<p>さらに重要なのは、MCPサーバーは新しい種類のマシン間コラボレーションの基礎を築くということです。MCPサーバーを使えば、AIエージェントはAPIを呼び出して動的にコレクションを作成したり、クエリーを実行したり、インデックスを構築したりすることができます。</p>
<p>つまり、MCP ServerはMilvusを単なるデータベースではなく、完全にプログラマブルでAIに対応したバックエンドに変え、インテリジェントで自律的かつスケーラブルなアプリケーションへの道を開きます。</p>
<h2 id="Getting-Started-with-Milvus-SDK-v2-Sample-Code" class="common-anchor-header">Milvus SDK v2を使い始める：サンプルコード<button data-href="#Getting-Started-with-Milvus-SDK-v2-Sample-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>以下の例では、新しいPyMilvus (Python SDK v2)インターフェースを使用してコレクションを作成し、非同期操作を実行する方法を示します。前バージョンのORMスタイルのアプローチと比較して、このコードはよりクリーンで一貫性があり、作業しやすくなっています。</p>
<h3 id="1-Creating-a-Collection-Defining-Schemas-Building-Indexes-and-Loading-Data-with-MilvusClient" class="common-anchor-header">1.コレクションを作成し、スキーマを定義し、インデックスを構築し、データをロードする<code translate="no">MilvusClient</code></h3><p>以下のPythonコードスニペットは、コレクションの作成、スキーマの定義、インデックスの構築、データのロードをすべて1回の呼び出しで行う方法を示しています：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType

<span class="hljs-comment"># 1. Connect to Milvus (initialize the client)</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># 2. Define the collection schema</span>
schema = MilvusClient.create_schema(auto_id=<span class="hljs-literal">False</span>, description=<span class="hljs-string">&quot;schema for example collection&quot;</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)  <span class="hljs-comment"># Primary key field</span>
schema.add_field(<span class="hljs-string">&quot;embedding&quot;</span>, DataType.FLOAT_VECTOR, dim=<span class="hljs-number">128</span>)  <span class="hljs-comment"># Vector field</span>

<span class="hljs-comment"># 3. Prepare index parameters (optional if indexing at creation time)</span>
index_params = client.prepare_index_params()
index_params.add_index(
    field_name=<span class="hljs-string">&quot;embedding&quot;</span>,
    index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
    metric_type=<span class="hljs-string">&quot;L2&quot;</span>
)

<span class="hljs-comment"># 4. Create the collection with indexes and load it into memory automatically</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;example_collection&quot;</span>,
    schema=schema,
    index_params=index_params
)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Collection created and loaded with index!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">create_collection</code> メソッドの<code translate="no">index_params</code> パラメータを使用すると、<code translate="no">create_index</code> と<code translate="no">load_collection</code>を個別に呼び出す必要がなくなります。</p>
<p>さらに、<code translate="no">MilvusClient</code> はクイックテーブル作成モードをサポートしています。例えば、必要なパラメータのみを指定することで、1行のコードでコレクションを作成することができます：</p>
<pre><code translate="no">client.<span class="hljs-title function_">create_collection</span>(
    collection_name=<span class="hljs-string">&quot;test_collection&quot;</span>,
    dimension=<span class="hljs-number">128</span>
)
<button class="copy-code-btn"></button></code></pre>
<p><em>(比較メモ: 古いORMアプローチでは、<code translate="no">Collection(schema)</code> を作成し、<code translate="no">collection.create_index()</code> と<code translate="no">collection.load()</code> を別々に呼び出す必要がありました。）</em></p>
<h3 id="2-Performing-High-Concurrency-Asynchronous-Inserts-with-AsyncMilvusClient" class="common-anchor-header">2.による高同期インサートの実行<code translate="no">AsyncMilvusClient</code></h3><p>次の例では、<code translate="no">AsyncMilvusClient</code> を使用して、<code translate="no">async/await</code> を使用して同時挿入操作を実行する方法を示します：</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> asyncio
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> AsyncMilvusClient

<span class="hljs-keyword">async</span> <span class="hljs-keyword">def</span> <span class="hljs-title function_">insert_vectors_concurrently</span>():
    client = AsyncMilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)
    
    vectors_to_insert = [[...], [...], ...]  <span class="hljs-comment"># Assume 100,000 vectors</span>
    batch_size = <span class="hljs-number">1000</span>  <span class="hljs-comment"># Recommended batch size</span>
    tasks = []

    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(vectors_to_insert), batch_size):
        batch_vectors = vectors_to_insert[i:i+batch_size]

        <span class="hljs-comment"># Construct batch data</span>
        data = [
            <span class="hljs-built_in">list</span>(<span class="hljs-built_in">range</span>(i, i + <span class="hljs-built_in">len</span>(batch_vectors))),  <span class="hljs-comment"># Batch IDs</span>
            batch_vectors  <span class="hljs-comment"># Batch vectors</span>
        ]

        <span class="hljs-comment"># Add an asynchronous task for inserting each batch</span>
        tasks.append(client.insert(<span class="hljs-string">&quot;example_collection&quot;</span>, data=data))

    <span class="hljs-comment"># Concurrently execute batch inserts</span>
    insert_results = <span class="hljs-keyword">await</span> asyncio.gather(*tasks)
    <span class="hljs-keyword">await</span> client.close()

<span class="hljs-comment"># Execute asynchronous tasks</span>
asyncio.run(insert_vectors_concurrently())
<button class="copy-code-btn"></button></code></pre>
<p>この例では、<code translate="no">AsyncMilvusClient</code> を使用して、<code translate="no">asyncio.gather</code> で複数の挿入タスクをスケジューリングし、データを同時挿入している。この方法はmilvusのバックエンド並行処理機能をフルに活用しています。v1の同期的な行単位の挿入とは異なり、このネイティブな非同期サポートはスループットを劇的に向上させます。</p>
<p>同様に、insertコールを<code translate="no">client.search(&quot;example_collection&quot;, data=[query_vec], limit=5)</code> に置き換えるなどして、並行クエリや検索を実行するようにコードを変更することもできます。Milvus SDK v2の非同期インターフェースは、各リクエストがノンブロッキングで実行されることを保証し、クライアントとサーバーの両方のリソースをフルに活用します。</p>
<h2 id="Migration-Made-Easy" class="common-anchor-header">容易な移行<button data-href="#Migration-Made-Easy" class="anchor-icon" translate="no">
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
    </button></h2><p>お客様がSDK v1に時間を投資してきたことを理解しているため、SDK v2はお客様の既存アプリケーションを念頭に置いて設計されています。SDK v2には後方互換性が含まれているため、既存のv1/ORMスタイルのインターフェイスはしばらくの間動作し続けます。v1のサポートはMilvus3.0のリリース（2025年末）で終了します。</p>
<p>SDK v2に移行することで、よりシンプルな構文、より優れた非同期サポート、パフォーマンスの向上など、より一貫性のある最新の開発者体験が得られます。また、今後すべての新機能とコミュニティ・サポートがSDK v2に集中します。今すぐアップグレードすることで、次への準備が整い、milvusが提供する最高のものにアクセスできるようになります。</p>
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
    </button></h2><p>Milvus SDK v2は、v1に比べ、パフォーマンスの向上、複数のプログラミング言語間での統一された一貫性のあるインターフェース、そして高同期処理を簡素化するネイティブの非同期サポートなど、大幅な改善をもたらしました。より明確なドキュメントとより直感的なコード例により、Milvus SDK v2は開発プロセスを合理化し、AIアプリケーションをより簡単かつ迅速に構築・展開できるように設計されています。</p>
<p>より詳細な情報については、最新の公式<a href="https://milvus.io/docs/install-pymilvus.md#Install-Milvus-Python-SDK">APIリファレンスおよびユーザーガイドを</a>ご参照ください。新しいSDKに関するご質問やご提案がございましたら、<a href="https://github.com/milvus-io/milvus/discussions">GitHubや</a> <a href="https://discord.com/invite/8uyFbECzPX">Discordで</a>お気軽にフィードバックをお寄せください。Milvusの更なる強化に向け、皆様のご意見をお待ちしております。</p>
