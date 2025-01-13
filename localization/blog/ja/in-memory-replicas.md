---
id: in-memory-replicas.md
title: インメモリ・レプリカによるベクター・データベースの読み取りスループットの向上
author: Congqi Xia
date: 2022-08-22T00:00:00.000Z
desc: インメモリーレプリカを使用して、読み取りスループットとハードウェアリソースの利用率を向上させる。
cover: assets.zilliz.com/in_memory_replica_af1fa21d61.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/in-memory-replicas.md'
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/in_memory_replica_af1fa21d61.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>表紙画像</span> </span></p>
<blockquote>
<p>この記事は<a href="https://github.com/congqixia">Congqi Xiaと</a> <a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Niの</a>共著です。</p>
</blockquote>
<p>Milvus2.1が正式リリースされ、利便性とユーザーエクスペリエンスの向上のために多くの新機能が追加されました。インメモリレプリカという概念は分散データベースの世界では目新しいものではありませんが、システムパフォーマンスを向上させ、システムの可用性を簡単に高めることができる重要な機能です。そこで本記事では、インメモリレプリカとは何か、なぜ重要なのかを説明し、AI向けベクトルデータベースMilvusでこの新機能を有効にする方法を紹介する。</p>
<p><strong>ジャンプ</strong></p>
<ul>
<li><p><a href="#Concepts-related-to-in-memory-replica">インメモリ・レプリカに関連する概念</a></p></li>
<li><p><a href="#What-is-in-memory-replica">インメモリ・レプリカとは？</a></p></li>
<li><p><a href="#Why-are-in-memory-replicas-important">なぜインメモリ・レプリカが重要なのか？</a></p></li>
<li><p><a href="#Enable-in-memory-replicas-in-the-Milvus-vector-database">Milvusベクトル・データベースでインメモリ・レプリカを有効にする</a></p></li>
</ul>
<h2 id="Concepts-related-to-in-memory-replica" class="common-anchor-header">インメモリレプリカの概念<button data-href="#Concepts-related-to-in-memory-replica" class="anchor-icon" translate="no">
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
    </button></h2><p>インメモリ・レプリカとは何か、なぜ重要なのかを知る前に、まずレプリカ・グループ、シャード・レプリカ、ストリーミング・レプリカ、ヒストリカル・レプリカ、シャード・リーダーなど、いくつかの関連する概念を理解する必要があります。以下の画像は、これらの概念の説明図である。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/diagram_1_525afc706a.jpg" alt="Replica_concepts" class="doc-image" id="replica_concepts" />
   </span> <span class="img-wrapper"> <span>レプリカの概念</span> </span></p>
<h3 id="Replica-group" class="common-anchor-header">レプリカグループ</h3><p>レプリカグループは、ヒストリカルデータとレプリカの処理を担当する複数の<a href="https://milvus.io/docs/v2.1.x/four_layers.md#Query-node">クエリノードで</a>構成されます。</p>
<h3 id="Shard-replica" class="common-anchor-header">シャード・レプリカ</h3><p>シャードレプリカはストリーミングレプリカとヒストリカルレプリカで構成され、どちらも同じ<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md#Shard">シャード</a>（つまりDMLチャネル）に属します。複数のシャードレプリカがレプリカグループを構成します。レプリカグループ内のシャードレプリカの正確な数は、指定されたコレクション内のシャードの数によって決まります。</p>
<h3 id="Streaming-replica" class="common-anchor-header">ストリーミング・レプリカ</h3><p>ストリーミング・レプリカは、同じDMLチャネルからのすべての<a href="https://milvus.io/docs/v2.1.x/glossary.md#Segment">成長セグメントを</a>含みます。技術的に言えば、ストリーミング・レプリカは1つのレプリカに1つのクエリ・ノードだけが対応する必要があります。</p>
<h3 id="Historical-replica" class="common-anchor-header">履歴レプリカ</h3><p>ヒストリカルレプリカは、同じ DML チャンネルに含まれるすべてのセグメントを保持します。1つのヒストリカルレプリカの封印されたセグメントは、同じレプリカグループ内の複数のクエリノードに分散させることができます。</p>
<h3 id="Shard-leader" class="common-anchor-header">シャードリーダー</h3><p>シャードリーダーとは、シャードレプリカ内のストリーミングレプリカを扱うクエリノードのことです。</p>
<h2 id="What-is-in-memory-replica" class="common-anchor-header">インメモリーレプリカとは何ですか？<button data-href="#What-is-in-memory-replica" class="anchor-icon" translate="no">
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
    </button></h2><p>インメモリーレプリカを有効にすると、複数のクエリノードでコレクション内のデータをロードできるため、CPUとメモリーのリソースを余すことなく活用できます。この機能は、データセットが比較的小さいが、読み取りスループットを向上させ、ハードウェアリソースの利用率を高めたい場合に非常に便利です。</p>
<p>Milvusベクトルデータベースは、今のところ各セグメントに対して1つのレプリカをメモリ上に保持している。しかし、インメモリレプリカを使えば、異なるクエリノード上にセグメントの複数のレプリカを持つことができます。つまり、あるクエリノードがあるセグメントを検索しているときに、新しい検索要求が来た場合、このクエリノードはまったく同じセグメントのレプリカを持っているので、別のアイドルクエリノードに割り当てることができる。</p>
<p>さらに、複数のインメモリーレプリカがあれば、クエリーノードがクラッシュした場合にも対応できる。以前は、別のクエリノードで検索を続けるためには、セグメントの再読み込みを待たなければなりませんでした。しかし、インメモリーレプリケーションを使えば、データを再読み込みすることなく、すぐに新しいクエリーノードに検索リクエストを再送信することができる。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/replication_3_1_2c25513cb9.jpg" alt="Replication" class="doc-image" id="replication" />
   </span> <span class="img-wrapper"> <span>レプリケーション</span> </span></p>
<h2 id="Why-are-in-memory-replicas-important" class="common-anchor-header">なぜインメモリーレプリカが重要なのか？<button data-href="#Why-are-in-memory-replicas-important" class="anchor-icon" translate="no">
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
    </button></h2><p>インメモリーレプリカを有効にする最も大きなメリットの一つは、全体のQPS（クエリー/秒）とスループットが向上することです。さらに、複数のセグメント・レプリカを維持することができ、フェイルオーバーに直面した場合のシステムの回復力も高まります。</p>
<h2 id="Enable-in-memory-replicas-in-the-Milvus-vector-database" class="common-anchor-header">Milvusベクトルデータベースのインメモリーレプリカの有効化<button data-href="#Enable-in-memory-replicas-in-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusベクトルデータベースでは、インメモリレプリカの新機能を有効にするのは簡単です。コレクションをロードする際（つまり、<code translate="no">collection.load()</code> を呼び出す際）に必要なレプリカの数を指定するだけです。</p>
<p>以下のチュートリアルの例では、すでに "book "という名前の<a href="https://milvus.io/docs/v2.1.x/create_collection.md">コレクションを作成</a>し、<a href="https://milvus.io/docs/v2.1.x/insert_data.md">データを挿入</a>したとします。次のコマンドを実行すると、bookコレクションを<a href="https://milvus.io/docs/v2.1.x/load_collection.md">ロードする</a>ときに2つのレプリカを作成できます。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> Collection
collection = Collection(<span class="hljs-string">&quot;book&quot;</span>)      <span class="hljs-comment"># Get an existing collection.</span>
collection.load(replica_number=<span class="hljs-number">2</span>) <span class="hljs-comment"># load collection as 2 replicas</span>
<button class="copy-code-btn"></button></code></pre>
<p>上のコード例では、アプリケーションのシナリオに合わせて、レプリカの数を柔軟に変更できます。そうすれば、余計なコマンドを実行することなく、複数のレプリカに対して直接ベクトル類似<a href="https://milvus.io/docs/v2.1.x/search.md">検索や</a> <a href="https://milvus.io/docs/v2.1.x/query.md">クエリを</a>実行することができます。ただし、許容されるレプリカの最大数は、クエリ・ノードを実行するために使用可能なメモリの総量によって制限されることに注意する必要があります。指定したレプリカの数が使用可能なメモリの制限を超えると、データのロード中にエラーが返されます。</p>
<p><code translate="no">collection.get_replicas()</code> を実行して、作成したインメモリ・レプリカの情報を確認することもできます。レプリカ・グループと対応するクエリ・ノードとシャードの情報が返されます。以下は出力の例です。</p>
<pre><code translate="no">Replica <span class="hljs-built_in">groups</span>:
- Group: &lt;group_id:435309823872729305&gt;, &lt;group_nodes:(21, 20)&gt;, &lt;shards:[Shard: &lt;channel_name:milvus-zong-rootcoord-dml_27_435367661874184193v0&gt;, &lt;shard_leader:21&gt;, &lt;shard_nodes:[21]&gt;, Shard: &lt;channel_name:milvus-zong-rootcoord-dml_28_435367661874184193v1&gt;, &lt;shard_leader:20&gt;, &lt;shard_nodes:[20, 21]&gt;]&gt;
- Group: &lt;group_id:435309823872729304&gt;, &lt;group_nodes:(25,)&gt;, &lt;shards:[Shard: &lt;channel_name:milvus-zong-rootcoord-dml_28_435367661874184193v1&gt;, &lt;shard_leader:25&gt;, &lt;shard_nodes:[25]&gt;, Shard: &lt;channel_name:milvus-zong-rootcoord-dml_27_435367661874184193v0&gt;, &lt;shard_leader:25&gt;, &lt;shard_nodes:[25]&gt;]&gt;
<button class="copy-code-btn"></button></code></pre>
<h2 id="Whats-next" class="common-anchor-header">今後の予定<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1の正式リリースに伴い、新機能を紹介する一連のブログを用意しました。このブログシリーズの続きを読む</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">類似検索アプリケーションを強化する文字列データの使用方法</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">組み込みMilvusを使用したPythonによるMilvusのインストールと実行</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">インメモリレプリカによるベクターデータベースの読み取りスループットの向上</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Milvusベクトルデータベースの一貫性レベルを理解する</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Milvusベクタデータベースのコンシステンシーレベルを理解する(後編)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Milvus Vector Databaseはどのようにデータのセキュリティを確保しているのか？</a></li>
</ul>
