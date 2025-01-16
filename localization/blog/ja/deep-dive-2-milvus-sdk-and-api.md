---
id: deep-dive-2-milvus-sdk-and-api.md
title: Milvus Python SDKとAPIの紹介
author: Xuan Yang
date: 2022-03-21T00:00:00.000Z
desc: SDKがMilvusとどのように相互作用するのか、なぜORMスタイルのAPIがMilvusをより良く管理するのに役立つのかを学びましょう。
cover: assets.zilliz.com/20220322_175856_e8e7bea7dc.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220322_175856_e8e7bea7dc.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>カバー画像</span> </span></p>
<p><a href="https://github.com/XuanYang-cn">スアン・ヤン</a></p>
<h2 id="Background" class="common-anchor-header">背景<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>以下の図は、gRPCを介したSDKとMilvusの相互作用を表しています。Milvusはブラックボックスであると想像してください。プロトコル・バッファーは、サーバーのインターフェースと、それらが伝送する情報の構造を定義するために使用されます。従って、ブラックボックスであるMilvusの全ての操作はプロトコルAPIによって定義されます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/SDK_10c9673111.png" alt="Interaction" class="doc-image" id="interaction" />
   </span> <span class="img-wrapper"> <span>インタラクション</span> </span></p>
<h2 id="Milvus-Protocol-API" class="common-anchor-header">MilvusプロトコルAPI<button data-href="#Milvus-Protocol-API" class="anchor-icon" translate="no">
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
    </button></h2><p>MilvusプロトコルAPIは、<code translate="no">milvus.proto</code> 、<code translate="no">common.proto</code> 、<code translate="no">schema.proto</code> 、<code translate="no">.proto</code> で終わるプロトコルバッファファイルで構成されています。適切な動作を保証するために、SDKはこれらのProtocol Buffersファイルを用いてMilvusと対話する必要があります。</p>
<h3 id="milvusproto" class="common-anchor-header">milvus.proto</h3><p><code translate="no">milvus.proto</code> <code translate="no">MilvusService</code>を定義しているため、Milvus プロトコル API の重要なコンポーネントです。</p>
<p>以下のコードサンプルはインターフェース<code translate="no">CreatePartitionRequest</code> を示しています。これには2つの主要な文字列型パラメータ<code translate="no">collection_name</code> と<code translate="no">partition_name</code> があり、これに基づいてパーティション作成リクエストを開始することができます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/code_d5f034d58d.png" alt="CreatePartitionRequest" class="doc-image" id="createpartitionrequest" />
   </span> <span class="img-wrapper"> <span>CreatePartitionRequest</span> </span></p>
<p>19行目の<a href="https://github.com/milvus-io/milvus-proto/blob/44f59db22b27cc55e4168c8e53b6e781c010a713/proto/milvus.proto">PyMilvus GitHub Repositoryの</a>Protocolの例を確認してください。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/create_partition_938691f07f.png" alt="Example" class="doc-image" id="example" />
   </span> <span class="img-wrapper"> <span>例</span> </span></p>
<p><code translate="no">CreatePartitionRequest</code> の定義はここにあります。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112254_4ec4f35bd3.png" alt="Definition" class="doc-image" id="definition" />
   </span> <span class="img-wrapper"> <span>定義</span> </span></p>
<p>Milvusの機能またはSDKを異なるプログラミング言語で開発したいコントリビューターは、MilvusがRPC経由で提供する全てのインターフェースを見つけることができます。</p>
<h3 id="commonproto" class="common-anchor-header">common.proto</h3><p><code translate="no">common.proto</code> は、 や を含む、共通の情報タイプを定義します。<code translate="no">ErrorCode</code> <code translate="no">Status</code></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112303_eaafc432a8.png" alt="common.proto" class="doc-image" id="common.proto" />
   </span> <span class="img-wrapper"> <span>common.proto</span> </span></p>
<h3 id="schemaproto" class="common-anchor-header">スキーマ.プロト</h3><p><code translate="no">schema.proto</code> はパラメータにスキーマを定義します。以下のコード・サンプルは の例である。<code translate="no">CollectionSchema</code></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112313_df4ebe36e7.png" alt="schema.proto" class="doc-image" id="schema.proto" />
   </span> <span class="img-wrapper"> <span>schema.proto</span> </span></p>
<p><code translate="no">milvus.proto</code>、<code translate="no">common.proto</code> 、<code translate="no">schema.proto</code> を合わせてmilvusのAPIを構成し、RPCで呼び出せる全ての操作を表しています。</p>
<p>ソース・コードを掘り下げて注意深く観察すると、<code translate="no">create_index</code> のようなインタフェースが呼び出されるとき、実際には<code translate="no">describe_collection</code> や<code translate="no">describe_index</code> のような複数の RPC インタフェースを呼び出していることがわかります。Milvusの外側のインターフェースの多くは、複数のRPCインターフェースの組み合わせです。</p>
<p>RPCの動作を理解した上で、Milvusの新機能を組み合わせて開発することができます。あなたの想像力と創造力でMilvusコミュニティに貢献してください。</p>
<h2 id="PyMilvus-20" class="common-anchor-header">PyMilvus 2.0<button data-href="#PyMilvus-20" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Object-relational-mapping-ORM" class="common-anchor-header">オブジェクトリレーショナルマッピング (ORM)</h3><p>一言で言うと、オブジェクトリレーショナルマッピング(ORM)とは、ローカルのオブジェクトを操作したときに、その操作がサーバ上の対応するオブジェクトに影響を与えることを指します。PyMilvus の ORM スタイルの API には次のような特徴があります：</p>
<ol>
<li>オブジェクトを直接操作する。</li>
<li>サービスロジックとデータアクセスの詳細を分離します。</li>
<li>実装の複雑さを隠すことができ、異なるMilvusインスタンス間で、配置のアプローチや実装に関係なく同じスクリプトを実行することができます。</li>
</ol>
<h3 id="ORM-style-API" class="common-anchor-header">ORMスタイルのAPI</h3><p>ORMスタイルAPIの本質の一つは、Milvus接続の制御にあります。例えば、複数のMilvusサーバにエイリアスを指定し、そのエイリアスだけで接続したり切断したりすることができます。また、ローカルサーバのアドレスを削除することもでき、特定の接続を介して特定のオブジェクトを正確に制御することができます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/20220321_112320_d5ff08a582.png" alt="Control Connection" class="doc-image" id="control-connection" />
   </span> <span class="img-wrapper"> <span>接続の制御</span> </span></p>
<p>ORM型APIのもう一つの特徴は、抽象化した後、コレクション、パーティション、インデックスを含むすべての操作をオブジェクトに対して直接実行できることです。</p>
<p>コレクションオブジェクトを抽象化するには、既存のオブジェクトを取得するか、新しいオブジェクトを作成します。また、Milvusのコネクションをコネクションエイリアスを用いて特定のオブジェクトに割り当てることで、これらのオブジェクトをローカルに操作することができます。</p>
<p>パーティションオブジェクトを作成するには、親コレクションオブジェクトと一緒に作成するか、コレクションオブジェクトを作成するときと同じように作成します。これらの方法は、インデックス・オブジェクトにも適用できます。</p>
<p>これらのパーティション・オブジェクトやインデックス・オブジェクトが存在する場合、親コレクション・オブジェクトを通して取得することができます。</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">ディープ・ダイブ・シリーズについて<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.0の<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">一般提供の正式発表に</a>伴い、Milvusのアーキテクチャとソースコードの詳細な解釈を提供するために、このMilvus Deep Diveブログシリーズを企画しました。このブログシリーズで扱うトピックは以下の通りです：</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvusアーキテクチャの概要</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">APIとPython SDK</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">データ処理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">データ管理</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">リアルタイムクエリ</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">スカラー実行エンジン</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">QAシステム</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">ベクトル実行エンジン</a></li>
</ul>
