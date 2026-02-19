---
id: debugging-rag-in-3d-with-projectgolem-and-milvus.md
title: RAGが失敗する理由がわかったら？Project_GolemとmilvusでRAGを3Dデバッグする
author: Min Yin
date: 2026-02-18T00:00:00.000Z
cover: assets.zilliz.com/Debugging_RAG_in_3_D_f1b45f9a99_5f98979c06.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, RAG'
meta_keywords: 'Project_Golem, milvus, RAG'
meta_title: |
  Debugging RAG in 3D with Project_Golem and Milvus
desc: >-
  Project_GolemとMilvusが、ベクトル空間の可視化、検索エラーのデバッグ、リアルタイムベクトル検索のスケーリングによって、どのようにRAGシステムを観測可能にするかを学ぶ。
origin: 'https://milvus.io/blog/debugging-rag-in-3d-with-projectgolem-and-milvus.md'
---
<p>RAG検索がうまくいかないとき、通常はそれが壊れていることがわかります。関連文書が表示されなかったり、無関係な文書が表示されたりするのです。しかし、その原因を突き止めるのは別の話だ。あなたが扱わなければならないのは、類似度スコアと結果のフラットなリストだけだ。ドキュメントがベクトル空間で実際にどのように配置されているのか、チャンク同士がどのように関連しているのか、クエリがマッチするはずのコンテンツと相対的にどの位置にあるのかを確認する方法はない。実際には、RAGのデバッグはほとんど試行錯誤であることを意味する：チャンキング戦略を微調整し、埋め込みモデルを入れ替え、top-kを調整し、結果が改善することを願う。</p>
<p><a href="https://github.com/CyberMagician/Project_Golem">Project_Golemは</a>、ベクトル空間を可視化するオープンソースのツールである。UMAPを使って高次元の埋め込みを3Dに投影し、Three.jsを使ってブラウザ上でインタラクティブにレンダリングする。検索に失敗した理由を推測する代わりに、チャンクが意味的にどのようにクラスタリングされているのか、クエリがどこに到達したのか、どのドキュメントが検索されたのか、すべてをひとつの視覚的なインターフェイスで見ることができる。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_1_01de566e04.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>これは驚きだ。しかし、オリジナルのProject_Golemは小規模なデモ用に設計されたもので、実世界のシステムではない。フラットファイル、ブルートフォース検索、全データセットの再構築に依存しているため、データが数千文書以上になると、すぐに破綻してしまいます。</p>
<p>このギャップを埋めるために、Project_Golemは<a href="https://milvus.io/docs/release_notes.md#v268">Milvus</a>（具体的にはバージョン2.6.8）をベクターバックボーンとして統合した。Milvusは、リアルタイムの取り込み、スケーラブルなインデックス作成、ミリ秒レベルの検索を処理するオープンソースの高性能ベクトルデータベースであり、一方、Project_Golemは、ベクトル検索動作の可視化という最も得意とすることに集中します。Project_Golemは、ベクトル検索動作の可視化という最も得意とすることに専念している。両者が一緒になることで、3D可視化は、おもちゃのデモから、プロダクションRAGシステムのための実用的なデバッグ・ツールへと変わる。</p>
<p>この投稿では、Project_Golemについて説明し、どのようにMilvusと統合し、ベクター検索の動作を観察可能にし、スケーラブルにし、プロダクションに対応できるようにしたかを紹介する。</p>
<h2 id="What-Is-ProjectGolem" class="common-anchor-header">Project_Golemとは？<button data-href="#What-Is-ProjectGolem" class="anchor-icon" translate="no">
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
    </button></h2><p>ベクトル空間は高次元であり、人間はそれを見ることができないからです。</p>
<p><a href="https://github.com/CyberMagician/Project_Golem">Project_Golemは</a>ブラウザベースのツールで、RAGシステムが動作するベクトル空間を見ることができます。通常768次元または1536次元の高次元埋め込みデータを、直接探索できるインタラクティブな3Dシーンに投影します。</p>
<p>その仕組みは以下の通りです：</p>
<ul>
<li>UMAPによる次元削減Project_Golemは、UMAPを使用して、高次元のベクトルを3次元に圧縮し、相対的な距離を保持します。元の空間で意味的に類似しているチャンクは、3D投影でも近くに留まり、無関係なチャンクは離れてしまいます。</li>
<li>Three.jsによる3Dレンダリング。各ドキュメントチャンクは、ブラウザでレンダリングされる3Dシーンのノードとして表示されます。回転、ズーム、空間の探索が可能で、ドキュメントがどのように集まっているか、どのトピックが密に集まっているか、どのトピックが重なっているか、境界線はどこにあるかを確認できます。</li>
<li>クエリ時のハイライト。クエリを実行すると、コサイン類似度を使用して元の高次元空間で検索が行われます。しかし、結果が戻ってくると、検索された塊が3Dビューに表示されます。クエリが結果に対してどの位置にあるのか、そして同様に重要なこととして、検索されなかった文書に対してどの位置にあるのかを即座に確認することができる。</li>
</ul>
<p>これがProject_Golemをデバッグに役立たせている。ランク付けされた検索結果のリストを見つめて、なぜ関連文書が検索されなかったのかを推測する代わりに、その文書が遠くのクラスターにあるのか（埋め込みの問題）、無関係なコンテンツと重なっているのか（チャンキングの問題）、検索しきい値のぎりぎり外側にあるのか（設定の問題）を見ることができる。3Dビューは、抽象的な類似性スコアを推論可能な空間的関係に変える。</p>
<h2 id="Why-ProjectGolem-Isnt-Production-Ready" class="common-anchor-header">Project_Golemが本番に対応できない理由<button data-href="#Why-ProjectGolem-Isnt-Production-Ready" class="anchor-icon" translate="no">
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
    </button></h2><p>Project_Golemは視覚化のプロトタイプとして設計された。しかし、そのアーキテクチャーは、実際のRAGデバッグに使いたい場合に問題となるような、規模が大きくなるとすぐに破綻するような前提を置いている。</p>
<h3 id="Every-Update-Requires-a-Full-Rebuild" class="common-anchor-header">アップデートのたびに完全な再構築が必要</h3><p>これは最も基本的な制限だ。エンベッディングは再生成され、.npyファイルに書き込まれ、UMAPはデータセット全体で再実行され、3D座標はJSONとして再エクスポートされます。</p>
<p>10万ドキュメントでも、シングルコアのUMAP実行には5-10分かかる。100万ドキュメント規模になると、まったく実用的でなくなる。ニュースフィード、ドキュメント、ユーザーの会話など、継続的に変化するデータセットには使えない。更新のたびに、完全な再処理サイクルを待つことになるからだ。</p>
<h3 id="Brute-Force-Search-Doesnt-Scale" class="common-anchor-header">強引な検索はスケールしない</h3><p>検索側にも上限がある。オリジナルの実装では、NumPyを使ってブルートフォース・コサイン類似度検索を行っている。100万ドキュメントのデータセットでは、一つのクエリに1秒以上かかることもある。これでは、インタラクティブなシステムやオンラインシステムには使えない。</p>
<p>メモリの圧迫が問題をさらに深刻にしている。768次元のfloat32ベクトルはそれぞれおよそ3KBなので、100万個のベクトルデータセットは3GB以上のメモリを必要とします。</p>
<h3 id="No-Metadata-Filtering-No-Multi-Tenancy" class="common-anchor-header">メタデータのフィルタリングなし、マルチテナンシーなし</h3><p>実際のRAGシステムでは、ベクトルの類似性だけが検索基準になることはほとんどありません。ほとんどの場合、ドキュメントの種類、タイムスタンプ、ユーザー権限、アプリケーションレベルの境界などのメタデータによるフィルタリングが必要です。例えば、カスタマーサポートのRAGシステムでは、検索対象を特定のテナントの文書に限定する必要があります。</p>
<p>Project_Golemは、このどれもサポートしません。HNSWやIVFのような）ANNインデックスも、スカラーフィルタリングも、テナントの分離も、ハイブリッド検索もない。Project_Golemは、検索エンジンのない可視化レイヤなのだ。</p>
<h2 id="How-Milvus-Powers-ProjectGolem’s-Retrieval-Layer" class="common-anchor-header">MilvusはどのようにProject_Golemの検索レイヤーを強化しているか？<button data-href="#How-Milvus-Powers-ProjectGolem’s-Retrieval-Layer" class="anchor-icon" translate="no">
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
    </button></h2><p>前節では、更新のたびに完全な再構築を行うこと、総当り検索を行うこと、メタデータを意識した検索を行わないことの3つのギャップを指摘しました。Project_Golemにはデータベースレイヤーがない。Project_Golemにはデータベースレイヤーがないため、検索、保存、視覚化がひとつのパイプラインにまとめられており、どの部分を変更しても、すべてをリビルドしなければならない。</p>
<p>解決策はパイプラインを最適化することではない。分割することだ。</p>
<p>Milvus2.6.8をベクターのバックボーンとして統合することで、検索は可視化とは独立したプロダクショングレードの専用レイヤーとなる。Milvusは、ベクターのストレージ、インデックス、検索を処理する。Project_Golemは純粋にレンダリングに焦点を当て、MilvusからドキュメントIDを消費し、3Dビューでハイライトします。</p>
<p>この分離により、2つのクリーンで独立したフローが生まれる：</p>
<p>検索フロー（オンライン、ミリ秒レベル）</p>
<ul>
<li>クエリはOpenAIのエンベッディングを使ってベクトルに変換されます。</li>
<li>クエリーベクターはMilvusコレクションに送られます。</li>
<li>Milvus AUTOINDEXが適切なインデックスを選択し、最適化します。</li>
<li>リアルタイムのコサイン類似度検索により、関連するドキュメントIDが返されます。</li>
</ul>
<p>可視化フロー（オフライン、デモスケール）</p>
<ul>
<li>UMAPはデータ取り込み時に3D座標を生成する（n_neighbors=30, min_dist=0.1）。</li>
<li>座標はgolem_cortex.jsonに格納される。</li>
<li>フロントエンドはMilvusが返すドキュメントIDを使って対応する3Dノードをハイライトする。</li>
</ul>
<p>重要な点は、検索が可視化されるのを待たなくなったことです。新しいドキュメントをインジェストし、すぐに検索することができます。</p>
<h3 id="What-Streaming-Nodes-Change" class="common-anchor-header">ストリーミング・ノードが変えるもの</h3><p>このリアルタイムインジェストは、Milvus 2.6.8の新機能である<a href="https://milvus.io/docs/configure_streamingnode.md#streamingNode-related-Configurations">ストリーミングノードによって</a>実現されています。以前のバージョンでは、リアルタイム・インジェストにはKafkaやPulsarのような外部メッセージ・キューが必要でした。Streaming Nodesはその調整をMilvus自体に移し、新しいベクターは継続的にインジェストされ、インデックスはインクリメンタルに更新され、新しく追加されたドキュメントは完全な再構築や外部依存なしに即座に検索可能になります。</p>
<p>Project_Golemにとって、これがこのアーキテクチャを実用的なものにしている。新しい記事、更新されたドキュメント、ユーザーが作成したコンテンツなど、RAGシステムにドキュメントを追加し続けることができ、高価なUMAP→JSON→リロードのサイクルを引き起こすことなく、検索を最新の状態に保つことができる。</p>
<h3 id="Extending-Visualization-to-Million-Scale-Future-Path" class="common-anchor-header">100万スケールへの視覚化の拡張（将来の道）</h3><p>このMilvusに支えられたセットアップにより、Project_Golemは現在、約10,000ドキュメントのインタラクティブなデモをサポートしている。Milvusは数百万を処理するが、可視化パイプラインは依然としてバッチUMAP実行に依存している。このギャップを埋めるために、インクリメンタルな可視化パイプラインでアーキテクチャを拡張することができる：</p>
<ul>
<li><p>更新トリガー：システムは、Milvusコレクションの挿入イベントをリッスンする。新しく追加されたドキュメントが定義されたしきい値（例えば1,000アイテム）に達すると、インクリメンタルアップデートがトリガーされる。</p></li>
<li><p>インクリメンタルプロジェクション：データセット全体にわたってUMAPを再実行する代わりに、UMAPのtransform()メソッドを使用して新しいベクトルを既存の3D空間に投影する。これにより、大域的な構造を維持しながら計算コストを劇的に削減することができる。</p></li>
<li><p>フロントエンドの同期：更新された座標フラグメントは、WebSocketを介してフロントエンドにストリーミングされ、シーン全体をリロードすることなく、新しいノードを動的に出現させることができます。</p></li>
</ul>
<p>Milvus 2.6.8では、スケーラビリティだけでなく、ベクトル類似度と全文検索およびスカラーフィルタリングを組み合わせたハイブリッド検索が可能になりました。これにより、キーワードのハイライト、カテゴリフィルタリング、時間ベースのスライスなど、よりリッチな3Dインタラクションへの扉が開かれ、開発者はRAGの動作について探求、デバッグ、推論するためのより強力な方法を得ることができます。</p>
<h2 id="How-to-Deploy-and-Explore-ProjectGolem-with-Milvus" class="common-anchor-header">Milvusを使ったProject_Golemのデプロイと探索方法<button data-href="#How-to-Deploy-and-Explore-ProjectGolem-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>アップグレードされたProject_Golemは、現在<a href="https://github.com/yinmin2020/Project_Golem_Milvus">GitHubで</a>オープンソースとして公開されています。Milvusの公式ドキュメントをデータセットとして使用し、RAG検索を3Dで可視化する完全なプロセスを説明します。セットアップにはDockerとPythonを使用し、ゼロから始めても簡単に実行できます。</p>
<h3 id="Prerequisites" class="common-anchor-header">前提条件</h3><ul>
<li>Docker ≥ 20.10</li>
<li>Docker Compose ≥ 2.0</li>
<li>Python ≥ 3.11</li>
<li>OpenAI APIキー</li>
<li>データセット (MilvusドキュメントのMarkdown形式)</li>
</ul>
<h3 id="1-Deploy-Milvus" class="common-anchor-header">1.Milvusをデプロイする。</h3><pre><code translate="no">Download docker-compose.yml
wget https://github.com/milvus-io/milvus/releases/download/v2.6.8/milvus-standalone-docker-compose.yml -O docker-compose.yml
Start Milvus（verify port mapping：19530:19530）
docker-compose up -d
Verify that the services are running
docker ps | grep milvus
You should see three containers：milvus-standalone, milvus-etcd, milvus-minio
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Core-Implementation" class="common-anchor-header">2.コア実装</h3><p>Milvusインテグレーション (ingest.py)</p>
<p>注意: この実装は最大8つのドキュメントカテゴリをサポートします。カテゴリ数がこの制限を超えた場合、色はラウンドロビン方式で再利用されます。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> pymilvus.milvus_client.index <span class="hljs-keyword">import</span> IndexParams
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> langchain_text_splitters <span class="hljs-keyword">import</span> RecursiveCharacterTextSplitter
<span class="hljs-keyword">import</span> umap
<span class="hljs-keyword">from</span> sklearn.neighbors <span class="hljs-keyword">import</span> NearestNeighbors
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> glob
--- CONFIG ---
MILVUS_URI = <span class="hljs-string">&quot;http://localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;golem_memories&quot;</span>
JSON_OUTPUT_PATH = <span class="hljs-string">&quot;./golem_cortex.json&quot;</span>
Data directory (users place .md files <span class="hljs-keyword">in</span> this folder)
DATA_DIR = <span class="hljs-string">&quot;./data&quot;</span>
OpenAI Embedding Config
OPENAI_API_KEY = os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)
OPENAI_BASE_URL = <span class="hljs-string">&quot;https://api.openai.com/v1&quot;</span>  <span class="hljs-comment">#</span>
OPENAI_EMBEDDING_MODEL = <span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
<span class="hljs-number">1536</span> dimensions
EMBEDDING_DIM = <span class="hljs-number">1536</span>
Color mapping: colors are assigned automatically <span class="hljs-keyword">and</span> reused <span class="hljs-keyword">in</span> a <span class="hljs-built_in">round</span>-robin manner
COLORS = [
[<span class="hljs-number">0.29</span>, <span class="hljs-number">0.87</span>, <span class="hljs-number">0.50</span>],
Green
[<span class="hljs-number">0.22</span>, <span class="hljs-number">0.74</span>, <span class="hljs-number">0.97</span>],
Blue
[<span class="hljs-number">0.60</span>, <span class="hljs-number">0.20</span>, <span class="hljs-number">0.80</span>],
Purple
[<span class="hljs-number">0.94</span>, <span class="hljs-number">0.94</span>, <span class="hljs-number">0.20</span>],
Gold
[<span class="hljs-number">0.98</span>, <span class="hljs-number">0.55</span>, <span class="hljs-number">0.00</span>],
Orange
[<span class="hljs-number">0.90</span>, <span class="hljs-number">0.30</span>, <span class="hljs-number">0.40</span>],
Red
[<span class="hljs-number">0.40</span>, <span class="hljs-number">0.90</span>, <span class="hljs-number">0.90</span>],
Cyan
[<span class="hljs-number">0.95</span>, <span class="hljs-number">0.50</span>, <span class="hljs-number">0.90</span>],
Magenta
]
<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_embeddings</span>(<span class="hljs-params">texts</span>):
<span class="hljs-string">&quot;&quot;&quot;Batch embedding using OpenAI API&quot;&quot;&quot;</span>
client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)
embeddings = []
batch_size = <span class="hljs-number">100</span>
OpenAI allows multiple texts per request
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(texts), batch_size):
batch = texts[i:i + batch_size]
response = client.embeddings.create(
model=OPENAI_EMBEDDING_MODEL,
<span class="hljs-built_in">input</span>=batch
)
embeddings.extend([item.embedding <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> response.data])
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Embedded <span class="hljs-subst">{<span class="hljs-built_in">min</span>(i + batch_size, <span class="hljs-built_in">len</span>(texts))}</span>/<span class="hljs-subst">{<span class="hljs-built_in">len</span>(texts)}</span>...&quot;</span>)
<span class="hljs-keyword">return</span> np.array(embeddings)
<span class="hljs-keyword">def</span> <span class="hljs-title function_">load_markdown_files</span>(<span class="hljs-params">data_dir</span>):
<span class="hljs-string">&quot;&quot;&quot;Load all markdown files from the data directory&quot;&quot;&quot;</span>
md_files = glob.glob(os.path.join(data_dir, <span class="hljs-string">&quot;**/*.md&quot;</span>), recursive=<span class="hljs-literal">True</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> md_files:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ ERROR: No .md files found in &#x27;<span class="hljs-subst">{data_dir}</span>&#x27;&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   👉 Create a &#x27;<span class="hljs-subst">{data_dir}</span>&#x27; folder and put your markdown files there.&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   👉 Example: <span class="hljs-subst">{data_dir}</span>/doc1.md, <span class="hljs-subst">{data_dir}</span>/docs/doc2.md&quot;</span>)
<span class="hljs-keyword">return</span> <span class="hljs-literal">None</span>
docs = []
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n📚 FOUND <span class="hljs-subst">{<span class="hljs-built_in">len</span>(md_files)}</span> MARKDOWN FILES:&quot;</span>)
<span class="hljs-keyword">for</span> i, file_path <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(md_files):
filename = os.path.basename(file_path)
Categories are derived <span class="hljs-keyword">from</span> the file’s path relative to data_dir
rel_path = os.path.relpath(file_path, data_dir)
category = os.path.dirname(rel_path) <span class="hljs-keyword">if</span> os.path.dirname(rel_path) <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;default&quot;</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&#x27;r&#x27;</span>, encoding=<span class="hljs-string">&#x27;utf-8&#x27;</span>) <span class="hljs-keyword">as</span> f:
content = f.read()
docs.append({
<span class="hljs-string">&quot;title&quot;</span>: filename,
<span class="hljs-string">&quot;text&quot;</span>: content,
<span class="hljs-string">&quot;cat&quot;</span>: category,
<span class="hljs-string">&quot;path&quot;</span>: file_path
})
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>. [<span class="hljs-subst">{category}</span>] <span class="hljs-subst">{filename}</span>&quot;</span>)
<span class="hljs-keyword">return</span> docs
<span class="hljs-keyword">def</span> <span class="hljs-title function_">ingest_dense</span>():
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;🧠 PROJECT GOLEM - NEURAL MEMORY BUILDER&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;=&quot;</span> * <span class="hljs-number">50</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> OPENAI_API_KEY:
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ❌ ERROR: OPENAI_API_KEY environment variable not set!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Run: export OPENAI_API_KEY=&#x27;your-key-here&#x27;&quot;</span>)
<span class="hljs-keyword">return</span>
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Using OpenAI Embedding: <span class="hljs-subst">{OPENAI_EMBEDDING_MODEL}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Embedding Dimension: <span class="hljs-subst">{EMBEDDING_DIM}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Data Directory: <span class="hljs-subst">{DATA_DIR}</span>&quot;</span>)
<span class="hljs-number">1.</span> Load local markdown files
docs = load_markdown_files(DATA_DIR)
<span class="hljs-keyword">if</span> docs <span class="hljs-keyword">is</span> <span class="hljs-literal">None</span>:
<span class="hljs-keyword">return</span>
<span class="hljs-number">2.</span> Split documents into chunks
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n📦 PROCESSING DOCUMENTS...&quot;</span>)
splitter = RecursiveCharacterTextSplitter(chunk_size=<span class="hljs-number">800</span>, chunk_overlap=<span class="hljs-number">50</span>)
chunks = []
raw_texts = []
colors = []
chunk_titles = []
categories = []
<span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs:
doc_chunks = splitter.create_documents([doc[<span class="hljs-string">&#x27;text&#x27;</span>]])
cat_index = <span class="hljs-built_in">hash</span>(doc[<span class="hljs-string">&#x27;cat&#x27;</span>]) % <span class="hljs-built_in">len</span>(COLORS)
<span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(doc_chunks):
chunks.append({
<span class="hljs-string">&quot;text&quot;</span>: chunk.page_content,
<span class="hljs-string">&quot;title&quot;</span>: doc[<span class="hljs-string">&#x27;title&#x27;</span>],
<span class="hljs-string">&quot;cat&quot;</span>: doc[<span class="hljs-string">&#x27;cat&#x27;</span>]
})
raw_texts.append(chunk.page_content)
colors.append(COLORS[cat_index])
chunk_titles.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{doc[<span class="hljs-string">&#x27;title&#x27;</span>]}</span> (chunk <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>)&quot;</span>)
categories.append(doc[<span class="hljs-string">&#x27;cat&#x27;</span>])
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Created <span class="hljs-subst">{<span class="hljs-built_in">len</span>(chunks)}</span> text chunks from <span class="hljs-subst">{<span class="hljs-built_in">len</span>(docs)}</span> documents&quot;</span>)
<span class="hljs-number">3.</span> Generate embeddings
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n🔮 GENERATING EMBEDDINGS...&quot;</span>)
vectors = get_embeddings(raw_texts)
<span class="hljs-number">4.</span> 3D Projection (UMAP)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n🎨 CALCULATING 3D MANIFOLD...&quot;</span>)
reducer = umap.UMAP(n_components=<span class="hljs-number">3</span>, n_neighbors=<span class="hljs-number">30</span>, min_dist=<span class="hljs-number">0.1</span>, metric=<span class="hljs-string">&#x27;cosine&#x27;</span>)
embeddings_3d = reducer.fit_transform(vectors)
<span class="hljs-number">5.</span> Wiring (KNN)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ↳ Wiring Synapses (finding connections)...&quot;</span>)
nbrs = NearestNeighbors(n_neighbors=<span class="hljs-number">8</span>, metric=<span class="hljs-string">&#x27;cosine&#x27;</span>).fit(vectors)
distances, indices = nbrs.kneighbors(vectors)
<span class="hljs-number">6.</span> Prepare output data
cortex_data = []
milvus_data = []
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(chunks)):
cortex_data.append({
<span class="hljs-string">&quot;id&quot;</span>: i,
<span class="hljs-string">&quot;title&quot;</span>: chunk_titles[i],
<span class="hljs-string">&quot;cat&quot;</span>: categories[i],
<span class="hljs-string">&quot;pos&quot;</span>: embeddings_3d[i].tolist(),
<span class="hljs-string">&quot;col&quot;</span>: colors[i],
<span class="hljs-string">&quot;nbs&quot;</span>: indices[i][<span class="hljs-number">1</span>:].tolist()
})
milvus_data.append({
<span class="hljs-string">&quot;id&quot;</span>: i,
<span class="hljs-string">&quot;text&quot;</span>: chunks[i][<span class="hljs-string">&#x27;text&#x27;</span>],
<span class="hljs-string">&quot;title&quot;</span>: chunk_titles[i],
<span class="hljs-string">&quot;category&quot;</span>: categories[i],
<span class="hljs-string">&quot;vector&quot;</span>: vectors[i].tolist()
})
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(JSON_OUTPUT_PATH, <span class="hljs-string">&#x27;w&#x27;</span>) <span class="hljs-keyword">as</span> f:
json.dump(cortex_data, f)
<span class="hljs-number">7.</span> Store vectors <span class="hljs-keyword">in</span> Milvus
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\n💾 STORING IN MILVUS...&quot;</span>)
client = MilvusClient(uri=MILVUS_URI)
Drop existing collection <span class="hljs-keyword">if</span> it exists
<span class="hljs-keyword">if</span> client.has_collection(COLLECTION_NAME):
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Dropping existing collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27;...&quot;</span>)
client.drop_collection(COLLECTION_NAME)
Create new collection
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Creating collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; (dim=<span class="hljs-subst">{EMBEDDING_DIM}</span>)...&quot;</span>)
client.create_collection(
collection_name=COLLECTION_NAME,
dimension=EMBEDDING_DIM
)
Insert data
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Inserting <span class="hljs-subst">{<span class="hljs-built_in">len</span>(milvus_data)}</span> vectors...&quot;</span>)
client.insert(
collection_name=COLLECTION_NAME,
data=milvus_data
)
Create index <span class="hljs-keyword">for</span> faster search
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ↳ Creating index...&quot;</span>)
index_params = IndexParams()
index_params.add_index(
field_name=<span class="hljs-string">&quot;vector&quot;</span>,
index_type=<span class="hljs-string">&quot;AUTOINDEX&quot;</span>,
metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>
)
client.create_index(
collection_name=COLLECTION_NAME,
index_params=index_params
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n✅ CORTEX GENERATED SUCCESSFULLY!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   📊 <span class="hljs-subst">{<span class="hljs-built_in">len</span>(chunks)}</span> memory nodes stored in Milvus&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   📁 Cortex data saved to: <span class="hljs-subst">{JSON_OUTPUT_PATH}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   🚀 Run &#x27;python GolemServer.py&#x27; to start the server&quot;</span>)
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
ingest_dense()
<button class="copy-code-btn"></button></code></pre>
<p>フロントエンドの可視化 (GolemServer.py)</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> flask <span class="hljs-keyword">import</span> Flask, request, jsonify, send_from_directory
<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> OpenAI
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">import</span> json
<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">import</span> sys
--- CONFIG ---
Explicitly <span class="hljs-built_in">set</span> the folder to where this script <span class="hljs-keyword">is</span> located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OpenAI Embedding Config
OPENAI_API_KEY = os.getenv(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)
OPENAI_BASE_URL = <span class="hljs-string">&quot;https://api.openai.com/v1&quot;</span>
OPENAI_EMBEDDING_MODEL = <span class="hljs-string">&quot;text-embedding-3-small&quot;</span>
Milvus Config
MILVUS_URI = <span class="hljs-string">&quot;http://localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;golem_memories&quot;</span>
These <span class="hljs-keyword">match</span> the files generated by ingest.py
JSON_FILE = <span class="hljs-string">&quot;golem_cortex.json&quot;</span>
UPDATED: Matches your new repo filename
HTML_FILE = <span class="hljs-string">&quot;index.html&quot;</span>
app = Flask(__name__, static_folder=BASE_DIR)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\n🧠 PROJECT GOLEM SERVER&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   📂 Serving from: <span class="hljs-subst">{BASE_DIR}</span>&quot;</span>)
--- DIAGNOSTICS ---
Check <span class="hljs-keyword">if</span> files exist before starting
missing_files = []
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> os.path.exists(os.path.join(BASE_DIR, JSON_FILE)):
missing_files.append(JSON_FILE)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> os.path.exists(os.path.join(BASE_DIR, HTML_FILE)):
missing_files.append(HTML_FILE)
<span class="hljs-keyword">if</span> missing_files:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ CRITICAL ERROR: Missing files in this folder:&quot;</span>)
<span class="hljs-keyword">for</span> f <span class="hljs-keyword">in</span> missing_files:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;      - <span class="hljs-subst">{f}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Did you run &#x27;python ingest.py&#x27; successfully?&quot;</span>)
sys.exit(<span class="hljs-number">1</span>)
<span class="hljs-keyword">else</span>:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ✅ Files Verified: Cortex Map found.&quot;</span>)
Check API Key
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> OPENAI_API_KEY:
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ CRITICAL ERROR: OPENAI_API_KEY environment variable not set!&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Run: export OPENAI_API_KEY=&#x27;your-key-here&#x27;&quot;</span>)
sys.exit(<span class="hljs-number">1</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ↳ Using OpenAI Embedding: <span class="hljs-subst">{OPENAI_EMBEDDING_MODEL}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ↳ Connecting to Milvus...&quot;</span>)
milvus_client = MilvusClient(uri=MILVUS_URI)
Verify collection exists
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> milvus_client.has_collection(COLLECTION_NAME):
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;   ❌ CRITICAL ERROR: Collection &#x27;<span class="hljs-subst">{COLLECTION_NAME}</span>&#x27; not found in Milvus.&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   👉 Did you run &#x27;python ingest.py&#x27; successfully?&quot;</span>)
sys.exit(<span class="hljs-number">1</span>)
Initialize OpenAI client
openai_client = OpenAI(api_key=OPENAI_API_KEY, base_url=OPENAI_BASE_URL)
--- ROUTES ---
<span class="hljs-meta">@app.route(<span class="hljs-params"><span class="hljs-string">&#x27;/&#x27;</span></span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">root</span>():
Force serve the specific HTML file
<span class="hljs-keyword">return</span> send_from_directory(BASE_DIR, HTML_FILE)
<span class="hljs-meta">@app.route(<span class="hljs-params"><span class="hljs-string">&#x27;/&#x27;</span></span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">serve_static</span>(<span class="hljs-params">filename</span>):
<span class="hljs-keyword">return</span> send_from_directory(BASE_DIR, filename)
<span class="hljs-meta">@app.route(<span class="hljs-params"><span class="hljs-string">&#x27;/query&#x27;</span>, methods=[<span class="hljs-string">&#x27;POST&#x27;</span>]</span>)</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">query_brain</span>():
data = request.json
text = data.get(<span class="hljs-string">&#x27;query&#x27;</span>, <span class="hljs-string">&#x27;&#x27;</span>)
<span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> text: <span class="hljs-keyword">return</span> jsonify({<span class="hljs-string">&quot;indices&quot;</span>: []})
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;🔎 Query: <span class="hljs-subst">{text}</span>&quot;</span>)
Get query embedding <span class="hljs-keyword">from</span> OpenAI
response = openai_client.embeddings.create(
model=OPENAI_EMBEDDING_MODEL,
<span class="hljs-built_in">input</span>=text
)
query_vec = response.data[<span class="hljs-number">0</span>].embedding
Search <span class="hljs-keyword">in</span> Milvus
results = milvus_client.search(
collection_name=COLLECTION_NAME,
data=[query_vec],
limit=<span class="hljs-number">50</span>,
output_fields=[<span class="hljs-string">&quot;id&quot;</span>]
)
Extract indices <span class="hljs-keyword">and</span> scores
indices = [r[<span class="hljs-string">&#x27;id&#x27;</span>] <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]
scores = [r[<span class="hljs-string">&#x27;distance&#x27;</span>] <span class="hljs-keyword">for</span> r <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]]
<span class="hljs-keyword">return</span> jsonify({
<span class="hljs-string">&quot;indices&quot;</span>: indices,
<span class="hljs-string">&quot;scores&quot;</span>: scores
})
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&#x27;__main__&#x27;</span>:
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;   ✅ SYSTEM ONLINE: http://localhost:8000&quot;</span>)
app.run(port=<span class="hljs-number">8000</span>)
<button class="copy-code-btn"></button></code></pre>
<p>データセットをダウンロードし、指定されたディレクトリに置く。</p>
<pre><code translate="no">https://github.com/milvus-io/milvus-docs/tree/v2.6.x/site/en
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_4_3d17b01fec.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="3-Start-the-project" class="common-anchor-header">3.プロジェクトの開始</h3><p>テキスト埋め込みを3D空間に変換する</p>
<pre><code translate="no">python ingest.py
<button class="copy-code-btn"></button></code></pre>
<p>[イメージ］</p>
<p>フロントエンドサービスを開始する</p>
<pre><code translate="no">python GolemServer.py
<button class="copy-code-btn"></button></code></pre>
<h3 id="4-Visualization-and-Interaction" class="common-anchor-header">4.可視化とインタラクション</h3><p>フロントエンドが検索結果を受け取った後、ノードの明るさはコサイン類似度スコアに基づいてスケーリングされるが、元のノードの色は維持され、明確なカテゴリ・クラスタが維持される。クエリーポイントからマッチした各ノードまで半透明の線が引かれ、カメラはスムーズにパンやズームしてアクティブ化されたクラスタに焦点を合わせる。</p>
<h4 id="Example-1-In-Domain-Match" class="common-anchor-header">例1：ドメイン内マッチ</h4><p>クエリー"Milvusはどのインデックスタイプをサポートしていますか？"</p>
<p>可視化の動作：</p>
<ul>
<li><p>3D空間では、INDEXESとラベル付けされた赤いクラスタ内の約15のノードが顕著な輝度の増加（約2-3倍）を示す。</p></li>
<li><p>マッチしたノードには、index_types.md、hnsw_index.md、ivf_index.mdなどのドキュメントからのチャンクが含まれる。</p></li>
<li><p>クエリーベクトルから各マッチしたノードまで半透明の線がレンダリングされ、カメラはスムーズに赤いクラスタに焦点を合わせる。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_2_c2522b6a67.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="Example-2-Out-of-Domain-Query-Rejection" class="common-anchor-header">例2：ドメイン外クエリの拒否</h4><p>クエリ"KFCのバリューミールはいくらですか？"</p>
<p>可視化の動作．</p>
<ul>
<li><p>すべてのノードは元の色を保持し、わずかなサイズ変更（1.1×未満）しかない。</p></li>
<li><p>一致したノードは、色が異なる複数のクラスターに散在し、明確な意味の集中は見られない。</p></li>
<li><p>類似度のしきい値（0.5）を満たさないため、カメラはフォーカス・アクションをトリガしない。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/debugging_rag_in_3d_with_projectgolem_and_milvus_3_39b9383771.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
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
    </button></h2><p>Project_GolemとMilvusの組み合わせは、既存のRAG評価パイプラインを置き換えるものではないが、ほとんどのパイプラインに全く欠けているものを追加する。</p>
<p>このセットアップを使えば、エンベッディングが悪くて検索に失敗したのか、チャンキングが悪くて失敗したのか、閾値がちょっときつかっただけなのかの違いを見分けることができる。このような診断には、以前は推測と反復が必要でした。今は、それを見ることができる。</p>
<p>現在の統合は、Milvusベクトル・データベースが裏で本番レベルの検索を処理することで、デモ・スケール（〜10,000文書）でのインタラクティブなデバッグをサポートしている。100万スケールの可視化への道筋は描かれているが、まだ構築されていない。</p>
<p>GitHubで<a href="https://github.com/CyberMagician/Project_Golem">Project_Golemを</a>チェックし、自分のデータセットで試してみて、ベクトル空間が実際にどのように見えるか見てみよう。</p>
<p>質問があったり、見つけたものを共有したい場合は、<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slackチャンネルに</a>参加するか、<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">milvusオフィスアワーに</a>予約して、セットアップのハンズオン指導を受けてください。</p>
