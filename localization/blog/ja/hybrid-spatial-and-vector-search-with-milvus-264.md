---
id: hybrid-spatial-and-vector-search-with-milvus-264.md
title: Milvusを使ったハイブリッド空間検索とベクトル検索の使い方
author: Alden
date: 2026-3-18
cover: assets.zilliz.com/cover_8b550decfe.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  Milvus 2.6.4, hybrid spatial vector search, Milvus Geometry, R-Tree index,
  vector database geospatial search
meta_title: |
  Hybrid Spatial and Vector Search with Milvus 2.6.4 (Geometry & R-Tree)
desc: >-
  Milvus
  2.6.4でGeometryとR-Treeを使用したハイブリッド空間検索とベクトル検索がどのように可能になったかを、パフォーマンスに関する洞察と実践例を交えてご紹介します。
origin: 'https://milvus.io/blog/hybrid-spatial-and-vector-search-with-milvus-264.md'
---
<p>3キロ以内のロマンチックなレストランを探す」というようなクエリは単純に聞こえる。なぜなら、これはロケーションフィルタリングとセマンティック検索を組み合わせたものだからだ。ほとんどのシステムでは、このクエリを2つのデータベースに分割する必要があり、データの同期、コード内での結果のマージ、そして余分な待ち時間を意味する。</p>
<p><a href="https://milvus.io">Milvus</a>2.6.4は、この分割を排除します。ネイティブの<strong>GEOMETRY</strong>データ型と<strong>R-Tree</strong>インデックスにより、Milvusは1つのクエリでロケーション制約とセマンティック制約を一緒に適用することができます。これにより、空間とセマンティックのハイブリッド検索がより簡単で効率的になりました。</p>
<p>この記事では、なぜこの変更が必要だったのか、Milvus内部でGEOMETRYとR-Treeがどのように機能するのか、どのようなパフォーマンス向上が期待できるのか、Python SDKを使った設定方法について説明します。</p>
<h2 id="The-Limitations-of-Traditional-Geo-and-Semantic-Search" class="common-anchor-header">従来の地理検索とセマンティック検索の限界<button data-href="#The-Limitations-of-Traditional-Geo-and-Semantic-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>3km以内にあるロマンチックなレストラン "のようなクエリは、2つの理由から扱いにくい：</p>
<ul>
<li><strong>「ロマンチック "はセマンティック検索を必要とする。</strong>システムはレストランのレビューとタグをベクトル化し、埋め込み空間の類似性によってマッチを見つけなければならない。これはベクトルデータベースでしか機能しない。</li>
<li><strong>「3km以内 "は空間フィルタリングが必要である。</strong>検索結果は、"ユーザーから3km以内"、場合によっては "特定の配達多角形や行政境界の内側 "に制限されなければならない。</li>
</ul>
<p>従来のアーキテクチャでは、両方のニーズを満たすには、通常2つのシステムを並行して稼働させる必要がありました：</p>
<ul>
<li>ジオフェンシング、距離計算、空間フィルタリングのための<strong>PostGIS / Elasticsearch</strong>。</li>
<li>埋め込みに対する近似最近傍（ANN）検索用の<strong>ベクトルデータベース</strong>。</li>
</ul>
<p>この "2データベース "デザインは、3つの現実的な問題を引き起こす：</p>
<ul>
<li><strong>データの同期。</strong>レストランが住所を変更した場合、ジオシステムとベクトルデータベースの両方を更新しなければならない。1つの更新を逃すと、結果に一貫性がなくなる。</li>
<li><strong>待ち時間の増加。</strong>アプリケーションは2つのシステムを呼び出して出力をマージする必要があり、ネットワークの往復と処理時間が増える。</li>
<li><strong>非効率的なフィルタリング。</strong>システムが最初にベクトル検索を実行した場合、多くの場合、ユーザーから遠く離れた結果が返され、後で破棄しなければならなかった。最初に位置フィルタリングを適用した場合、残りのセットはまだ大きいため、ベクトル検索ステップはまだ高価であった。</li>
</ul>
<p>Milvus 2.6.4では、ベクトルデータベースに直接空間ジオメトリサポートを追加することで、これを解決した。セマンティック検索とロケーションフィルタリングが同じクエリーで実行されるようになった。1つのシステムですべてが完結するため、ハイブリッド検索はより速く、管理しやすくなりました。</p>
<h2 id="What-GEOMETRY-Adds-to-Milvus" class="common-anchor-header">GEOMETRYがMilvusに追加したもの<button data-href="#What-GEOMETRY-Adds-to-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6では、DataType.GEOMETRYというスカラーフィールド型が導入されました。Milvusは、位置を経度と緯度の数値として別々に保存する代わりに、点、線、多角形といった幾何学的なオブジェクトを保存するようになりました。この点は地域内にあるか」、「Xメートル以内にあるか」といったクエリはネイティブな操作になります。生の座標上で回避策を構築する必要はありません。</p>
<p>実装は<a href="https://www.ogc.org/standard/sfa/"></a><strong>OpenGIS Simple Features Access標準に従って</strong>いるため、既存のほとんどの地理空間ツールで動作する。ジオメトリデータは、<strong>WKT（Well-Known Text）を</strong>使用して保存および照会されます。<strong>WKT</strong> は、人間が読むことができ、プログラムが解析可能な標準テキスト形式です。</p>
<p>サポートされているジオメトリタイプ</p>
<ul>
<li><strong>POINT</strong>: 店舗の住所や車両のリアルタイム位置などの単一位置</li>
<li><strong>LINESTRING</strong>: 道路のセンターラインや移動経路などのライン</li>
<li><strong>ポリゴン</strong>：行政境界やジオフェンスなどのエリア</li>
<li><strong>収集タイプ</strong>：MULTIPOINT、MULTILINESTRING、MULTIPOLYGON、GEOMETRYCOLLECTION。</li>
</ul>
<p>また、以下のような標準的な空間演算子もサポートしています：</p>
<ul>
<li><strong>空間関係</strong>：包含（ST_CONTAINS、ST_WITHIN）、交差（ST_INTERSECTS、ST_CROSSES）、接触（ST_TOUCHES）</li>
<li><strong>距離演算</strong>：ジオメトリ間の距離の計算（ST_DISTANCE）、指定された距離内のオブジェクトのフィルタリング（ST_DWITHIN）</li>
</ul>
<h2 id="How-R-Tree-Indexing-Works-Inside-Milvus" class="common-anchor-header">MilvusにおけるR-Treeインデックスの仕組み<button data-href="#How-R-Tree-Indexing-Works-Inside-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>GEOMETRYのサポートはMilvusのクエリーエンジンに組み込まれており、API機能として公開されているだけではありません。ISpatial データは R-Tree (Rectangle Tree) インデックスを使用してエンジン内部で直接インデックス付けされ処理されます。</p>
<p><strong>R-Treeは</strong> <strong>最小境界矩形(MBR)を使って</strong>近くのオブジェクトをグループ化します。クエリ中、エンジンはクエリジオメトリと重ならない大きな領域をスキップし、小さな候補セットに対してのみ詳細なチェックを実行します。これは、すべてのオブジェクトをスキャンするよりもはるかに高速です。</p>
<h3 id="How-Milvus-Builds-the-R-Tree" class="common-anchor-header">MilvusのRツリー構築方法</h3><p>R-Treeの構築は階層的に行われます：</p>
<table>
<thead>
<tr><th><strong>レベル</strong></th><th><strong>Milvusの機能</strong></th><th><strong>直感的な例え</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>リーフレベル</strong></td><td>各ジオメトリオブジェクト（点、線、多角形）に対して、Milvusは最小外接矩形（MBR）を計算し、リーフノードとして保存します。</td><td>各アイテムを正確にフィットする透明なボックスで包みます。</td></tr>
<tr><td><strong>中間レベル</strong></td><td>近隣のリーフノードがグループ化され（通常一度に50-100）、それらすべてをカバーするためにより大きな親MBRが作成されます。</td><td>同じ近隣からの荷物を1つの配送箱に入れる。</td></tr>
<tr><td><strong>ルート・レベル</strong></td><td>このグループ化は、すべてのデータが単一のルートMBRでカバーされるまで、上へ上へと続きます。</td><td>すべての木箱を1台の長距離トラックに積み込む。</td></tr>
</tbody>
</table>
<p>この構造により、空間クエリの複雑さはフルスキャン<strong>O(n)</strong>から<strong>O(log n)</strong>に低下します。実際には、数百万レコードのクエリを、精度を落とすことなく、数百ミリ秒から数ミリ秒に短縮することができます。</p>
<h3 id="How-Queries-are-Executed-Two-Phase-Filtering" class="common-anchor-header">クエリの実行方法二相フィルタリング</h3><p>スピードと正確さのバランスをとるため、Milvusは<strong>2段階のフィルタリング</strong>戦略を採用している：</p>
<ul>
<li><strong>ラフフィルター：</strong>R-Treeインデックスはまず、クエリの境界矩形がインデックス内の他の境界矩形と重なるかどうかをチェックします。これにより、ほとんどの無関係なデータが素早く取り除かれ、候補の小さなセットだけが保持される。これらの矩形は単純な形状であるため、チェックは非常に高速ですが、実際には一致しない結果も含まれる可能性があります。</li>
<li><strong>ファインフィルタ</strong>：残りの候補は、PostGISのようなシステムで使用されているジオメトリライブラリである<strong>GEOSを</strong>使用してチェックされます。GEOSは、形状が交差しているか、ある形状が別の形状を含んでいるかなど、正確なジオメトリ計算を実行し、正しい最終結果を生成します。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Hybrid_Spatialand_Vector_Searchwith_Milvus2_6_1_978d62cb30.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Milvusはジオメトリデータを<strong>WKT（Well-Known Text）</strong>フォーマットで受け付けるが、内部的には<strong>WKB（Well-Known Binary</strong>）として保存する<strong>。</strong>WKBはよりコンパクトで、ストレージを削減し、I/Oを改善します。GEOMETRYフィールドはメモリマップド（mmap）ストレージもサポートしているため、大規模な空間データセットがRAMに完全に収まる必要はありません。</p>
<h2 id="Performance-Improvements-with-R-Tree" class="common-anchor-header">R-Treeによるパフォーマンスの向上<button data-href="#Performance-Improvements-with-R-Tree" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Query-Latency-Stays-Flat-as-Data-Grows" class="common-anchor-header">データが増えてもクエリ待ち時間は横ばい。</h3><p>R-Treeインデックスがない場合、クエリにかかる時間はデータサイズに比例し、10倍以上のデータがあれば、クエリにかかる時間はおよそ10倍遅くなります。</p>
<p>R-Treeを使用すると、クエリ時間は対数的に増加します。数百万レコードのデータセットでは、空間フィルタリングはフルスキャンの数十倍から数百倍速くなります。</p>
<h3 id="Accuracy-is-Not-Sacrificed-For-Speed" class="common-anchor-header">スピードのために精度を犠牲にしない</h3><p>R-Treeはバウンディングボックスで候補を絞り込み、GEOSは正確なジオメトリー計算で各候補をチェックします。一致するように見えても、実際にはクエリーエリアの外側にあるものは、2回目のパスで削除されます。</p>
<h3 id="Hybrid-Search-Throughput-Improves" class="common-anchor-header">ハイブリッド検索のスループット向上</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog_Hybrid_Spatialand_Vector_Searchwith_Milvus2_6_2_b458b24bf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>R-Treeは、まずターゲット領域外のレコードを削除する。milvusは次に、残った候補に対してのみベクトル類似度（L2、IP、コサイン）を実行する。候補が少ないということは、検索コストが削減され、1秒あたりのクエリー数（QPS）が向上することを意味します。</p>
<h2 id="Getting-Started-GEOMETRY-with-the-Python-SDK" class="common-anchor-header">はじめにPython SDKを使用したGEOMETRY<button data-href="#Getting-Started-GEOMETRY-with-the-Python-SDK" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Define-the-Collection-and-Create-Indexes" class="common-anchor-header">コレクションの定義とインデックスの作成</h3><p>まず、コレクションスキーマにDataType.GEOMETRYフィールドを定義します。これにより、Milvusは幾何学的データを格納し、クエリできるようになります。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient, DataType  
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np  
<span class="hljs-comment"># Connect to Milvus  </span>
milvus_client = MilvusClient(<span class="hljs-string">&quot;[http://localhost:19530](http://localhost:19530)&quot;</span>)  
collection_name = <span class="hljs-string">&quot;lb_service_demo&quot;</span>  
dim = <span class="hljs-number">128</span>  
<span class="hljs-comment"># 1. Define schema  </span>
schema = milvus_client.create_schema(enable_dynamic_field=<span class="hljs-literal">True</span>)  
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)  
schema.add_field(<span class="hljs-string">&quot;vector&quot;</span>, DataType.FLOAT_VECTOR, dim=dim)  
schema.add_field(<span class="hljs-string">&quot;location&quot;</span>, DataType.GEOMETRY)  <span class="hljs-comment"># Define geometry field  </span>
schema.add_field(<span class="hljs-string">&quot;poi_name&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">128</span>)  
<span class="hljs-comment"># 2. Create index parameters  </span>
index_params = milvus_client.prepare_index_params()  
<span class="hljs-comment"># Create an index for the vector field (e.g., IVF_FLAT)  </span>
index_params.add_index(  
   field_name=<span class="hljs-string">&quot;vector&quot;</span>,  
   index_type=<span class="hljs-string">&quot;IVF_FLAT&quot;</span>,  
   metric_type=<span class="hljs-string">&quot;L2&quot;</span>,  
   params={<span class="hljs-string">&quot;nlist&quot;</span>: <span class="hljs-number">128</span>}  
)  
<span class="hljs-comment"># Create an R-Tree index for the geometry field (key step)  </span>
index_params.add_index(  
   field_name=<span class="hljs-string">&quot;location&quot;</span>,  
   index_type=<span class="hljs-string">&quot;RTREE&quot;</span>  <span class="hljs-comment"># Specify the index type as RTREE  </span>
)  
<span class="hljs-comment"># 3. Create collection  </span>
<span class="hljs-keyword">if</span> milvus_client.has_collection(collection_name):  
   milvus_client.drop_collection(collection_name)  
milvus_client.create_collection(  
   collection_name=collection_name,  
   schema=schema,  
   index_params=index_params,  <span class="hljs-comment"># Create the collection with indexes attached  </span>
   consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>  
)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection <span class="hljs-subst">{collection_name}</span> created with R-Tree index.&quot;</span>)  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Insert-Data" class="common-anchor-header">データの挿入</h3><p>データを挿入する場合、ジオメトリ値はWKT（Well-Known Text）形式でなければなりません。各レコードにはジオメトリ、ベクトル、その他のフィールドが含まれます。</p>
<pre><code translate="no"><span class="hljs-comment"># Mock data: random POIs in a region of Beijing  </span>
data = []  
<span class="hljs-comment"># Example WKT: POINT(longitude latitude)  </span>
geo_points = [  
   <span class="hljs-string">&quot;POINT(116.4074 39.9042)&quot;</span>,  <span class="hljs-comment"># Near the Forbidden City  </span>
   <span class="hljs-string">&quot;POINT(116.4600 39.9140)&quot;</span>,  <span class="hljs-comment"># Near Guomao  </span>
   <span class="hljs-string">&quot;POINT(116.3200 39.9900)&quot;</span>,  <span class="hljs-comment"># Near Tsinghua University  </span>
]  
<span class="hljs-keyword">for</span> i, wkt <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(geo_points):  
   vec = np.random.random(dim).tolist()  
   data.append({  
       <span class="hljs-string">&quot;id&quot;</span>: i,  
       <span class="hljs-string">&quot;vector&quot;</span>: vec,  
       <span class="hljs-string">&quot;location&quot;</span>: wkt,  
       <span class="hljs-string">&quot;poi_name&quot;</span>: <span class="hljs-string">f&quot;POI_<span class="hljs-subst">{i}</span>&quot;</span>  
   })  
res = milvus_client.insert(collection_name=collection_name, data=data)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{res[<span class="hljs-string">&#x27;insert_count&#x27;</span>]}</span> entities.&quot;</span>)  
<button class="copy-code-btn"></button></code></pre>
<h3 id="Run-a-Hybrid-Spatial-Vector-Query-Example" class="common-anchor-header">空間とベクトルのハイブリッドクエリの実行（例）</h3><p><strong>シナリオ：</strong>ベクトル空間で最も類似しており、ユーザーの位置など、指定されたポイントから2キロメートル以内に位置する上位3つのPOIを検索します。</p>
<p>ST_DWITHIN演算子を使用して、距離フィルタを適用します。距離の値は<strong>メートルで</strong>指定します<strong>。</strong></p>
<pre><code translate="no"><span class="hljs-comment"># Load the collection into memory  </span>
milvus_client.load_collection(collection_name)  
<span class="hljs-comment"># User location (WKT)  </span>
user_loc_wkt = <span class="hljs-string">&quot;POINT(116.4070 39.9040)&quot;</span>  
search_vec = np.random.random(dim).tolist()  
<span class="hljs-comment"># Build the filter expression: use ST_DWITHIN for a 2000-meter radius filter  </span>
filter_expr = <span class="hljs-string">f&quot;ST_DWITHIN(location, &#x27;<span class="hljs-subst">{user_loc_wkt}</span>&#x27;, 2000)&quot;</span>  
<span class="hljs-comment"># Execute the search  </span>
search_res = milvus_client.search(  
   collection_name=collection_name,  
   data=[search_vec],  
   <span class="hljs-built_in">filter</span>=filter_expr,  <span class="hljs-comment"># Inject geometry filter  </span>
   limit=<span class="hljs-number">3</span>,  
   output_fields=[<span class="hljs-string">&quot;poi_name&quot;</span>, <span class="hljs-string">&quot;location&quot;</span>]  
)  
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Search Results:&quot;</span>)  
<span class="hljs-keyword">for</span> hits <span class="hljs-keyword">in</span> search_res:  
   <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> hits:  
       <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;ID: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, Score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>, Name: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;poi_name&#x27;</span>]}</span>&quot;</span>)  
<button class="copy-code-btn"></button></code></pre>
<h2 id="Tips-for-Production-Use" class="common-anchor-header">実運用でのヒント<button data-href="#Tips-for-Production-Use" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li><strong>GEOMETRY フィールドには常に R-Tree インデックスを作成してください。</strong>10,000 エンティティを超えるデータセットでは、RTREE インデックスのない空間フィルタはフル スキャンに戻り、パフォーマンスが急激に低下します。</li>
<li><strong>一貫した座標系を使用する。</strong>すべての位置データは、同じ座標系（例<a href="https://en.wikipedia.org/wiki/World_Geodetic_System">：</a> <a href="https://en.wikipedia.org/wiki/World_Geodetic_System"></a><a href="https://en.wikipedia.org/wiki/World_Geodetic_System"></a> WGS<a href="https://en.wikipedia.org/wiki/World_Geodetic_System">84</a>）を使用する必要があります。座標系が混在していると、距離や封じ込めの計算が破綻します。</li>
<li><strong>クエリに適した空間演算子を選択する。</strong>ST_DWITHINは「Xメートル以内」の検索に使用します。ジオフェンシングと封じ込めチェックには ST_CONTAINS または ST_WITHIN を使用します。</li>
<li><strong>NULL ジオメトリ値は自動的に処理されます。</strong>GEOMETRYフィールドがNULL可能な場合（NULLABLE=True）、Milvusは空間クエリ中にNULL値をスキップします。追加のフィルタリングロジックは必要ありません。</li>
</ul>
<h2 id="Deployment-Requirements" class="common-anchor-header">展開要件<button data-href="#Deployment-Requirements" class="anchor-icon" translate="no">
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
    </button></h2><p>本番環境でこれらの機能を使用するには、お使いの環境が以下の要件を満たしていることを確認してください。</p>
<p><strong>1.Milvusのバージョン</strong></p>
<p><strong>Milvus 2.6.4以降が</strong>必要です。それ以前のバージョンはDataType.GEOMETRYまたは<strong>RTREE</strong>インデックスタイプをサポートしていません。</p>
<p><strong>2.SDKバージョン</strong></p>
<ul>
<li><strong>PyMilvus</strong>: 最新バージョンにアップグレードしてください。これは、適切な WKT シリアライズと、RTREE インデッ クスパラメータを渡すために必要です。</li>
<li><strong>Java / Go / Node SDK</strong>：各SDKのリリースノートを確認し、<strong>2.6.4</strong>proto定義と一致していることを確認してください。</li>
</ul>
<p><strong>3.組み込みジオメトリライブラリ</strong></p>
<p>Milvusサーバーには、Boost.GeometryとGEOSが既に組み込まれているため、これらのライブラリを自分でインストールする必要はありません。</p>
<p><strong>4.メモリ使用量と容量計画</strong></p>
<p>R-Treeインデックスは余分なメモリを使用します。容量を計画する際には、HNSW や IVF のようなベクトル・インデックスだけでなく、ジオメトリ・インデックスにも予算を割くことを忘れないでください。GEOMETRY フィールドは、メモリマップド（mmap）ストレージをサポートしており、データの一部をディスク上に保持することで、メモリ使用量を削減することができます。</p>
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
    </button></h2><p>ロケーションベースのセマンティック検索は、ベクトル検索にジオフィルターを追加するだけでは不十分です。組み込みの空間データ型、適切なインデックス、位置情報とベクトルを一緒に扱えるクエリーエンジンが必要です。</p>
<p><strong>Milvus 2.6.4は</strong>ネイティブの<strong>GEOMETRY</strong>フィールドと<strong>R-Tree</strong>インデックスでこれを解決します。空間フィルタリングとベクトル検索は単一のクエリで、単一のデータストアに対して実行されます。R-Treeは高速な空間プルーニングを処理し、GEOSは正確な結果を保証します。</p>
<p>位置を認識した検索が必要なアプリケーションでは、2つの別々のシステムを実行し、同期させる複雑さがなくなります。</p>
<p>位置認識、または空間とベクトルのハイブリッド検索に取り組んでいる方は、ぜひその経験をお聞かせください。</p>
<p><strong>Milvusについてご質問がありますか？</strong> <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slackチャンネルに</a>ご参加いただくか、20分間の<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvusオフィスアワーを</a>ご予約ください。</p>
