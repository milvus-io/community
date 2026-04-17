---
id: data-addressing-storage-systems.md
title: ストレージ・システムにおけるデータ・アドレッシングの深層：HashMapからHDFS、Kafka、milvus、Icebergまで
author: Bill Chen
date: 2026-3-25
cover: >-
  assets.zilliz.com/cover_A_Deep_Dive_into_Data_Addressing_in_Storage_Systems_6b436abeae.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  data addressing, distributed storage architecture, Milvus storage design,
  vector database internals, Apache Iceberg
meta_title: |
  Data Addressing Deep Dive: From HashMap to Milvus
desc: >-
  HashMapからHDFS、Kafka、milvus、Icebergまで、データアドレッシングがどのように機能するのか、そしてなぜロケーションの計算があらゆるスケールで検索に勝るのかを追跡する。
origin: 'https://milvus.io/blog/data-addressing-storage-systems.md'
---
<p>ネットワークが飽和しているわけでもなく、マシンが過負荷になっているわけでもないのに、単純なルックアップで何千ものディスクI/Oやオブジェクト・ストレージAPIコールが発生し、それでもクエリに数秒かかる。</p>
<p>ボトルネックは帯域幅やコンピュートではありません。システムがデータを読み込む前に、どこにデータがあるかを<em>把握</em>するために行う作業だ。<strong>データ・アドレッシングとは</strong>、論理的識別子（キー、ファイル・パス、オフセット、クエリ述語）をストレージ上のデータの物理的位置に変換するプロセスである。規模が大きくなると、実際のデータ転送ではなく、このプロセスがレイテンシを支配する。</p>
<p>ストレージ性能は単純なモデルに還元できる：</p>
<blockquote>
<p><strong>総アドレスコスト＝メタデータアクセス＋データアクセス</strong></p>
</blockquote>
<p>ハッシュテーブルからレイクハウスのメタデータレイヤーまで、ほとんどすべてのストレージ最適化はこの方程式をターゲットにしている。テクニックは様々だが、ゴールは常に同じだ：高レイテンシのオペレーションを可能な限り少なくしてデータを見つけることだ。</p>
<p>この記事では、HashMapのようなインメモリデータ構造から、HDFSやApache Kafkaのような分散システム、そして<a href="https://milvus.io/">Milvus</a>（<a href="https://zilliz.com/learn/what-is-a-vector-database">ベクトルデータベース</a>）やApache Icebergのようなオブジェクトストレージで動作する最新のエンジンまで、規模が大きくなるにつれてその考えをたどっていく。違いはあっても、これらはすべて同じ方程式を最適化している。</p>
<h2 id="Three-Core-Addressing-Techniques" class="common-anchor-header">3つのコア・アドレス指定テクニック<button data-href="#Three-Core-Addressing-Techniques" class="anchor-icon" translate="no">
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
    </button></h2><p>ストレージシステムや分散エンジン全体を通して、アドレス最適化のほとんどは3つのテクニックに分類される：</p>
<ul>
<li><strong>計算</strong>- データを見つけるために構造体をスキャンしたりトラバースしたりするのではなく、式から直接データの場所を導き出す。</li>
<li><strong>キャッシュ</strong>- 頻繁にアクセスされるメタデータやインデックスをメモリ内に保持し、ディスクやリモートストレージからのレイテンシの高い読み込みを繰り返さないようにする。</li>
<li><strong>プルーニング</strong>- 範囲情報またはパーティション境界を使用して、結果を含むことができないファイル、シャード、またはノードを除外します。</li>
</ul>
<p>この記事を通して、<em>アクセスとは</em>、実際のシステムレベルのコストを伴うあらゆる操作（ディスク読み取り、ネットワーク呼び出し、オブジェクト・ストレージAPIリクエスト）を意味する。ナノ秒レベルのCPU計算はカウントしない。重要なのは、I/O操作の回数を減らすこと、つまり高価なランダムI/Oを安価なシーケンシャルリードに変えることだ。</p>
<h2 id="How-Addressing-Works-The-Two-Sum-Problem" class="common-anchor-header">アドレッシングの仕組み2つの和の問題<button data-href="#How-Addressing-Works-The-Two-Sum-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>アドレッシングを具体的にするために、古典的なアルゴリズム問題を考えてみよう。整数の配列<code translate="no">nums</code> とターゲット値<code translate="no">target</code> が与えられたとき、和が<code translate="no">target</code> になる2つの数値のインデックスを返す。</p>
<p>例えば<code translate="no">nums = [2, 7, 11, 15]</code> <code translate="no">target = 9</code> → 結果<code translate="no">[0, 1]</code>.</p>
<p>この問題は、データを探すことと、データがどこにあるかを計算することの違いを明確に示している。</p>
<h3 id="Solution-1-Brute-Force-Search" class="common-anchor-header">解決策1：総当たり検索</h3><p>ブルートフォース・アプローチは、すべてのペアをチェックする。各要素について、配列の残りの部分をスキャンし、一致するものを探します。単純だが、O(n²)である。</p>
<pre><code translate="no" class="language-java"><span class="hljs-function"><span class="hljs-keyword">public</span> <span class="hljs-built_in">int</span>[] <span class="hljs-title">twoSum</span>(<span class="hljs-params"><span class="hljs-built_in">int</span>[] nums, <span class="hljs-built_in">int</span> target</span>)</span> {
    <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> i = <span class="hljs-number">0</span>; i &lt; nums.length; i++) {
        <span class="hljs-keyword">for</span> (<span class="hljs-built_in">int</span> j = i + <span class="hljs-number">1</span>; j &lt; nums.length; j++) {
            <span class="hljs-keyword">if</span> (nums[i] + nums[j] == target) <span class="hljs-keyword">return</span> <span class="hljs-keyword">new</span> <span class="hljs-built_in">int</span>[]{i, j};
        }
    }
    <span class="hljs-keyword">return</span> <span class="hljs-literal">null</span>;
}
<button class="copy-code-btn"></button></code></pre>
<p>答えがどこにあるかという概念はない。それぞれの検索はゼロから始まり、やみくもに配列を走査する。ボトルネックは演算ではなく、繰り返されるスキャンなのだ。</p>
<h3 id="Solution-2-Direct-Addressing-via-Computation" class="common-anchor-header">解決策2：計算による直接アドレス指定</h3><p>最適化されたソリューションは、スキャンをHashMapに置き換えます。マッチする値を検索する代わりに、どの値が必要かを計算し、それを直接検索する。時間の複雑さはO(n)に低下する。</p>
<pre><code translate="no" class="language-java">public <span class="hljs-type">int</span>[] twoSum(<span class="hljs-type">int</span>[] nums, <span class="hljs-type">int</span> target) {
    Map&lt;Integer, Integer&gt; <span class="hljs-keyword">map</span> = <span class="hljs-built_in">new</span> HashMap&lt;&gt;();
    <span class="hljs-keyword">for</span> (<span class="hljs-type">int</span> i = <span class="hljs-number">0</span>; i &lt; nums.length; i++) {
        <span class="hljs-type">int</span> complement = target - nums[i]; <span class="hljs-comment">// compute what we need</span>
        <span class="hljs-keyword">if</span> (<span class="hljs-keyword">map</span>.containsKey(complement)) { <span class="hljs-comment">// direct lookup, no scan</span>
            <span class="hljs-keyword">return</span> <span class="hljs-built_in">new</span> <span class="hljs-type">int</span>[]{<span class="hljs-keyword">map</span>.get(complement), i};
        }
        <span class="hljs-keyword">map</span>.put(nums[i], i);
    }
    <span class="hljs-keyword">return</span> null;
}
<button class="copy-code-btn"></button></code></pre>
<p>シフト：一致する値を見つけるために配列をスキャンする代わりに、必要な値を計算し、その場所に直接行く。一旦場所が導き出されれば、探索は必要なくなる。</p>
<p>スキャンを計算で置き換え、間接的な検索パスを直接アドレス指定で置き換えるのだ。</p>
<h2 id="HashMap-How-Computed-Addresses-Replace-Scans" class="common-anchor-header">ハッシュマップ：計算アドレスがスキャンを置き換える方法<button data-href="#HashMap-How-Computed-Addresses-Replace-Scans" class="anchor-icon" translate="no">
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
    </button></h2><p>HashMapはキーと値のペアを格納し、キーからアドレスを計算することで値を見つける。キーが与えられると、ハッシュ関数を適用し、配列のインデックスを計算し、その場所に直接ジャンプします。スキャンは必要ない。</p>
<p>これは、この記事のすべてのシステムを動かしている原理の最も単純な形である。計算によって場所を導き出すことでスキャンを回避するのだ。分散メタデータ・ルックアップから<a href="https://zilliz.com/learn/vector-index">ベクトル・インデックスまで</a>、あらゆるものを支える同じ考え方が、あらゆるスケールで現れている。</p>
<h3 id="The-Core-Data-Structure" class="common-anchor-header">核となるデータ構造</h3><p>HashMapの核となるのは、配列という単一の構造体だ。ハッシュ関数はキーを配列のインデックスにマッピングする。キーの空間は配列よりはるかに大きいので、衝突は避けられない。異なるキーが同じインデックスにハッシュする可能性がある。これらは、リンクリストや赤黒木を使って、各スロット内で局所的に処理される。</p>
<p>配列はインデックスによる定時アクセスを提供する。この性質、つまり直接的で予測可能なアドレス指定は、HashMapの性能の基礎であり、大規模ストレージシステムにおける効率的なデータアクセスの根底にある原理と同じである。</p>
<pre><code translate="no" class="language-java"><span class="hljs-keyword">public</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">HashMap</span>&lt;K,V&gt; {

    <span class="hljs-comment">// Core structure: an array that supports O(1) random access</span>
    <span class="hljs-keyword">transient</span> Node&lt;K,V&gt;[] table;

    <span class="hljs-comment">// Node structure</span>
    <span class="hljs-keyword">static</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">Node</span>&lt;K,V&gt; {
        <span class="hljs-keyword">final</span> <span class="hljs-type">int</span> hash;      <span class="hljs-comment">// hash value (cached to avoid recomputation)</span>
        <span class="hljs-keyword">final</span> K key;         <span class="hljs-comment">// key</span>
        V value;             <span class="hljs-comment">// value</span>
        Node&lt;K,V&gt; next;      <span class="hljs-comment">// next node (for handling collision)</span>
    }

    <span class="hljs-comment">// Hash function：key → integer</span>
    <span class="hljs-keyword">static</span> <span class="hljs-keyword">final</span> <span class="hljs-type">int</span> <span class="hljs-title function_">hash</span><span class="hljs-params">(Object key)</span> {
        <span class="hljs-type">int</span> h;
        <span class="hljs-keyword">return</span> (key == <span class="hljs-literal">null</span>) ? <span class="hljs-number">0</span> : (h = key.hashCode()) ^ (h &gt;&gt;&gt; <span class="hljs-number">16</span>);
    }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Does-a-HashMap-Locate-Data" class="common-anchor-header">HashMapはどのようにデータを探すのか？</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_2_4ada70fe33.png" alt="Step-by-step HashMap addressing: hash the key, compute the array index, jump directly to the bucket, and resolve locally — achieving O(1) lookup without traversal" class="doc-image" id="step-by-step-hashmap-addressing:-hash-the-key,-compute-the-array-index,-jump-directly-to-the-bucket,-and-resolve-locally-—-achieving-o(1)-lookup-without-traversal" />
   </span> <span class="img-wrapper"> <span>ステップバイステップのHashMapアドレッシング：キーのハッシュ化、配列インデックスの計算、バケットへの直接ジャンプ、ローカルでの解決。</span> </span></p>
<p><code translate="no">put(&quot;apple&quot;, 100)</code> 。全探索は4つのステップで完了する：</p>
<ol>
<li><strong>キーをハッシュする：</strong>キーをハッシュ関数に通す<code translate="no">hash(&quot;apple&quot;) = 93029210</code></li>
<li><strong>配列のインデックスにマップする：</strong> <code translate="no">93029210 &amp; (arrayLength - 1)</code> → 例えば<code translate="no">93029210 &amp; 15 = 10</code></li>
<li><strong>バケツにジャンプする：</strong> <code translate="no">table[10]</code> に直接アクセスする。トラバーサルではなく、シングルメモリアクセス。</li>
<li><strong>ローカルで解決：</strong>衝突がなければ、すぐに読み書き。衝突があれば、そのバケツ内の小さなリンクリストか赤黒木をチェックする。</li>
</ol>
<h3 id="Why-Is-HashMap-Lookup-O1" class="common-anchor-header">なぜハッシュマップ検索はO(1)なのか？</h3><p>配列へのアクセスがO(1)なのは、単純なアドレス計算式による：</p>
<pre><code translate="no">element_address = base_address + index × element_size
<button class="copy-code-btn"></button></code></pre>
<p>インデックスが与えられれば、メモリアドレスは1回の乗算と1回の加算で計算される。このコストは配列のサイズに関係なく固定であり、1回の計算と1回のメモリ読み込みである。対照的に、リンクリストは、別々のメモリー位置を通るポインターをたどって、ノードごとにトラバースしなければならない：最悪の場合O(n)である。</p>
<p>HashMapはキーを配列のインデックスにハッシュし、トラバーサルが計算されたアドレスに変わる。データを探す代わりに、データがどこにあるかを正確に計算し、そこにジャンプする。</p>
<h2 id="How-Does-Addressing-Change-in-Distributed-Systems" class="common-anchor-header">分散システムではアドレス指定はどう変わるのか？<button data-href="#How-Does-Addressing-Change-in-Distributed-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>HashMapは、データがメモリ上に存在し、アクセスコストが些細な1台のマシン内でのアドレス指定を解決する。スケールが大きくなると、制約は劇的に変化する：</p>
<table>
<thead>
<tr><th>スケールファクター</th><th>影響</th></tr>
</thead>
<tbody>
<tr><td>データサイズ</td><td>メガバイト → クラスタ全体でテラバイトまたはペタバイト</td></tr>
<tr><td>ストレージ媒体</td><td>メモリ → ディスク → ネットワーク → オブジェクトストレージ</td></tr>
<tr><td>アクセスレイテンシ</td><td>メモリ~100 ns / ディスク: 10-20 ms / 同一DCネットワーク：～0.5ミリ秒 / クロスリージョン~150ミリ秒</td></tr>
</tbody>
</table>
<p>アドレス問題は変わらない。すべてのルックアップはネットワークホップとディスクI/Oを含む可能性があるため、アクセス回数を減らすことはメモリよりもはるかに重要である。</p>
<p>実際のシステムがこれをどのように処理しているかを見るために、2つの典型的な例を見てみよう。HDFSは、大きなブロックベースのファイルに計算ベースのアドレッシングを適用する。Kafkaは、アペンドのみのメッセージストリームに適用する。どちらも同じ原理に従っている。データを探す代わりに、どこにデータがあるかを計算するのだ。</p>
<h2 id="HDFS-Addressing-Large-Files-with-In-Memory-Metadata" class="common-anchor-header">HDFS：インメモリメタデータによる大容量ファイルのアドレス指定<button data-href="#HDFS-Addressing-Large-Files-with-In-Memory-Metadata" class="anchor-icon" translate="no">
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
    </button></h2><p>HDFSは、マシンのクラスタにまたがる非常に大きなファイル用に設計された<a href="https://milvus.io/docs/architecture_overview.md">分散ストレージ</a>システムです。ファイルパスとバイトオフセットが与えられると、正しいデータブロックとそれを格納するDataNodeを見つける必要があります。</p>
<p>HDFSは、すべてのファイルシステムのメタデータをメモリ内に保持するという、意図的な設計上の選択によってこれを解決しています。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_1_26ff6257b1.png" alt="HDFS data organization showing logical view of a 300MB file mapped to physical storage as three blocks distributed across DataNodes with replication" class="doc-image" id="hdfs-data-organization-showing-logical-view-of-a-300mb-file-mapped-to-physical-storage-as-three-blocks-distributed-across-datanodes-with-replication" />
   </span> <span class="img-wrapper"> <span>HDFSのデータ構成は、物理ストレージにマッピングされた300MBのファイルを、レプリケーションを使用してDataNodeに分散された3つのブロックとして論理的に表示します。</span> </span></p>
<p>中心はNameNodeだ。ディレクトリ構造、ファイルからブロックへのマッピング、ブロックからDataNodeへのマッピングなど、ファイルシステムツリー全体をメモリにロードする。読み込み中にメタデータがディスクに触れることはないため、HDFSはメモリ内のルックアップのみを通じてすべてのアドレスに関する疑問を解決します。</p>
<p>概念的には、これはクラスタスケールでのHashMapです。インメモリデータ構造を使って、遅い検索を高速な計算ルックアップに変えます。違いは、HDFSが同じ原理を何千台ものマシンにまたがるデータセットに適用していることだ。</p>
<pre><code translate="no" class="language-java"><span class="hljs-comment">// Data structures stored in the NameNode&#x27;s memory</span>

<span class="hljs-comment">// 1. Filesystem directory tree</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">FSDirectory</span> {
    INodeDirectory rootDir;           <span class="hljs-comment">// root directory &quot;/&quot;</span>
    INodeMap inodeMap;                <span class="hljs-comment">// path → INode (HashMap!)</span>
}

<span class="hljs-comment">// 2. INode：file / directory node</span>
<span class="hljs-keyword">abstract</span> <span class="hljs-keyword">class</span> <span class="hljs-title class_">INode</span> {
    <span class="hljs-type">long</span> id;                          <span class="hljs-comment">// unique identifier</span>
    String name;                      <span class="hljs-comment">// name</span>
    INode parent;                     <span class="hljs-comment">// parent node</span>
    <span class="hljs-type">long</span> modificationTime;            <span class="hljs-comment">// last modification time</span>
}

<span class="hljs-keyword">class</span> <span class="hljs-title class_">INodeFile</span> <span class="hljs-keyword">extends</span> <span class="hljs-title class_">INode</span> {
    BlockInfo[] blocks;               <span class="hljs-comment">// list of blocks that make up the file</span>
}

<span class="hljs-comment">// 3. Block metadata mapping</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">BlocksMap</span> {
    GSet&lt;Block, BlockInfo&gt; blocks;    <span class="hljs-comment">// Block → location info (HashMap!)</span>
}

<span class="hljs-keyword">class</span> <span class="hljs-title class_">BlockInfo</span> {
    <span class="hljs-type">long</span> blockId;
    DatanodeDescriptor[] storages;    <span class="hljs-comment">// list of DataNodes storing this block</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Does-HDFS-Locate-Data" class="common-anchor-header">HDFSはどのようにデータを探すのか？</h3><p>デフォルトのブロックサイズが128 MBの<code translate="no">/user/data/bigfile.txt</code> 、200 MBのオフセットでデータを読み込むことを考えてみましょう：</p>
<ol>
<li>クライアントはNameNodeに1つのRPCを送信します。</li>
<li>NameNodeはファイルパスを解決し、オフセット200 MBが2番目のブロック（128-256 MBの範囲）に含まれることを計算します。</li>
<li>NameNodeはそのブロックを格納しているDataNodeを返します（例えば、DN2とDN3）。</li>
<li>クライアントは最も近いDataNode（DN2）から直接読み取ります。</li>
</ol>
<p>総コスト：1回のRPC、数回のメモリ内ルックアップ、1回のデータ読み取り。このプロセスの間、メタデータがディスクにヒットすることはなく、各ルックアップは一定時間です。HDFSは、データが大規模クラスタ間でスケールしても、高価なメタデータのスキャンを回避します。</p>
<h2 id="Apache-Kafka-How-Sparse-Indexing-Avoids-Random-IO" class="common-anchor-header">Apache Kafka：スパースインデキシングがランダムI/Oを回避する方法<button data-href="#Apache-Kafka-How-Sparse-Indexing-Avoids-Random-IO" class="anchor-icon" translate="no">
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
    </button></h2><p>Apache Kafkaは高スループットのメッセージストリーム用に設計されている。メッセージのオフセットが与えられると、読み取りをランダムI/Oにすることなく、ディスク上の正確なバイト位置を特定する必要があります。</p>
<p>Kafkaは、シーケンシャル・ストレージとスパース・イン・メモリー・インデックスを組み合わせている。データを検索する代わりに、おおよその位置を計算し、小さく制限されたスキャンを実行する。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_4_6af2d2cf97.png" alt="Kafka data organization showing logical view with topics and partitions mapped to physical storage as partition directories containing .log, .index, and .timeindex segment files" class="doc-image" id="kafka-data-organization-showing-logical-view-with-topics-and-partitions-mapped-to-physical-storage-as-partition-directories-containing-.log,-.index,-and-.timeindex-segment-files" />
   </span> <span class="img-wrapper"> <span>トピックとパーティションが、.log、.index、.timeindexセグメントファイルを含むパーティションディレクトリとして物理ストレージにマッピングされた論理ビューを示すKafkaデータ構成。</span> </span></p>
<p>メッセージは、トピック→パーティション→セグメントとして構成される。各パーティションは、各セグメントに分割された追記型ログである：</p>
<ul>
<li><code translate="no">.log</code> ディスク上にメッセージを順番に格納するファイル</li>
<li>ログのスパースインデックスとして機能する<code translate="no">.index</code> ファイル。</li>
</ul>
<p><code translate="no">.index</code> ファイルはメモリマップ（mmap）されているため、インデックス検索はディスクI/Oなしでメモリから直接行われる。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_3_0e4e99b226.png" alt="Kafka sparse index design showing one index entry per 4KB of data, with memory comparison: dense index at 800MB versus sparse index at just 2MB resident in memory" class="doc-image" id="kafka-sparse-index-design-showing-one-index-entry-per-4kb-of-data,-with-memory-comparison:-dense-index-at-800mb-versus-sparse-index-at-just-2mb-resident-in-memory" />
   </span> <span class="img-wrapper"> <span>Kafkaのスパースインデックスの設計では、4KBのデータにつき1つのインデックスエントリーが表示され、メモリの比較では、密なインデックスが800MBであるのに対し、スパースインデックスはわずか2MBしかメモリに常駐していません。</span> </span></p>
<pre><code translate="no" class="language-java"><span class="hljs-comment">// A Partition manages all its Segments</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">LocalLog</span> {
    <span class="hljs-comment">// Core structure: TreeMap, ordered by baseOffset</span>
    ConcurrentNavigableMap&lt;Long, LogSegment&gt; segments;

    <span class="hljs-comment">// Locate the target Segment</span>
    LogSegment <span class="hljs-title function_">floorEntry</span><span class="hljs-params">(<span class="hljs-type">long</span> offset)</span> {
        <span class="hljs-keyword">return</span> segments.floorEntry(offset);  <span class="hljs-comment">// O(log N)</span>
    }
}

<span class="hljs-comment">// A single Segment</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">LogSegment</span> {
    FileRecords log;           <span class="hljs-comment">// .log file (message data)</span>
    LazyIndex&lt;OffsetIndex&gt; offsetIndex;  <span class="hljs-comment">// .index file (sparse index)</span>
    <span class="hljs-type">long</span> baseOffset;           <span class="hljs-comment">// starting Offset</span>
}

<span class="hljs-comment">// Sparse index entry (8 bytes per entry)</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">OffsetPosition</span> {
    <span class="hljs-type">int</span> relativeOffset;        <span class="hljs-comment">// offset relative to baseOffset (4 bytes)</span>
    <span class="hljs-type">int</span> position;              <span class="hljs-comment">// physical position in the .log file (4 bytes)</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Does-Kafka-Locate-Data" class="common-anchor-header">Kafkaはどのようにデータを見つけるのか？</h3><p>コンシューマーがオフセット500,000のメッセージを読んだとする。Kafkaはこれを3つのステップで解決する：</p>
<p><strong>1.セグメントを見つける</strong>（TreeMap検索）</p>
<ul>
<li>セグメントのベースオフセット<code translate="no">[0, 367834, 735668, 1103502]</code></li>
<li><code translate="no">floorEntry(500000)</code> →<code translate="no">baseOffset = 367834</code></li>
<li>対象ファイル<code translate="no">00000000000000367834.log</code></li>
<li>時間の複雑さO(log S)、ここで S はセグメントの数 (通常は &lt; 100)</li>
</ul>
<p><strong>2.スパースインデックス</strong>(.index)<strong>から位置を探す</strong>。</p>
<ul>
<li>相対オフセット：<code translate="no">500000 − 367834 = 132166</code></li>
<li><code translate="no">.index</code> のバイナリサーチ: 最大のエントリを見つける ≤ 132166 →。<code translate="no">[132100 → position 20500000]</code></li>
<li>時間の複雑さ：O(log N)、Nはインデックス・エントリーの数。</li>
</ul>
<p><strong>3.ログ</strong>(.log)<strong>からの逐次読み出し</strong></p>
<ul>
<li>20,500,000の位置から読み込みを開始</li>
<li>オフセット500,000に達するまで継続</li>
<li>最大で1つのインデックス区間（～4KB）がスキャンされる。</li>
</ul>
<p>合計: 1回のメモリ内セグメント検索、1回のインデックス検索、1回の短いシーケンシャル読み取り。ランダムなディスクアクセスはない。</p>
<h2 id="HDFS-vs-Apache-Kafka" class="common-anchor-header">HDFSとApache Kafkaの比較<button data-href="#HDFS-vs-Apache-Kafka" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>ディメンション</th><th>HDFS</th><th>Kafka</th></tr>
</thead>
<tbody>
<tr><td>設計目標</td><td>巨大ファイルの効率的な保存と読み込み</td><td>メッセージストリームの高スループット逐次読み書き</td></tr>
<tr><td>アドレスモデル</td><td>パス → ブロック → メモリ内HashMap経由DataNode</td><td>スパースインデックス＋シーケンシャルスキャンによるオフセット → セグメント → 位置</td></tr>
<tr><td>メタデータ・ストレージ</td><td>NameNodeメモリに集中</td><td>mmap経由でメモリマップされたローカルファイル</td></tr>
<tr><td>検索あたりのアクセスコスト</td><td>1 RPC + Nブロックリード</td><td>1インデックス検索+1データ読み取り</td></tr>
<tr><td>主な最適化</td><td>すべてのメタデータをメモリ上に配置 - 検索パスにディスクを使用しない</td><td>疎インデックス＋シーケンシャル・レイアウトによりランダムI/Oを回避</td></tr>
</tbody>
</table>
<h2 id="Why-Object-Storage-Changes-the-Addressing-Problem" class="common-anchor-header">オブジェクトストレージがアドレス問題を変える理由<button data-href="#Why-Object-Storage-Changes-the-Addressing-Problem" class="anchor-icon" translate="no">
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
    </button></h2><p>HashMapからHDFS、Kafkaに至るまで、私たちはメモリ内や古典的な分散ストレージでのアドレス指定を見てきた。ワークロードが進化するにつれて、要件は増え続けている：</p>
<ul>
<li><strong>よりリッチなクエリ。</strong>最新のシステムは、単純なキーとオフセットだけでなく、マルチフィールドフィルター、<a href="https://zilliz.com/glossary/similarity-search">類似検索</a>、複雑な述語を扱う。</li>
<li><strong>オブジェクト・ストレージがデフォルトに。</strong>データはますますS3互換のストアに置かれるようになっている。ファイルはバケットに分散され、各アクセスは、数キロバイトでも数十ミリ秒オーダーの固定レイテンシーのAPIコールとなる。</li>
</ul>
<p>この時点で、帯域幅ではなくレイテンシがボトルネックとなる。1回のS3 GETリクエストは、それがどれだけのデータを返すかに関わらず、～50ミリ秒かかる。クエリが何千ものリクエストをトリガーする場合、レイテンシーの合計は膨れ上がる。APIのファンアウトを最小化することが、設計上の中心的な制約となる。</p>
<p><a href="https://zilliz.com/learn/what-is-a-vector-database">ベクターデータベースの</a> <a href="https://milvus.io/">milvusと</a>、レイクハウステーブルフォーマットのApache Icebergの2つの最新システムを見て、これらの課題にどのように対処しているかを見てみよう。違いはあるが、どちらも同じコア・アイデアを適用している。すなわち、高レイテンシ・アクセスを最小化し、ファンアウトを早期に削減し、トラバーサルよりも計算を優先している。</p>
<h2 id="Milvus-V1-When-Field-Level-Storage-Creates-Too-Many-Files" class="common-anchor-header">Milvus V1：フィールドレベルストレージでファイルが増えすぎた場合<button data-href="#Milvus-V1-When-Field-Level-Storage-Creates-Too-Many-Files" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusは、<a href="https://zilliz.com/glossary/vector-embeddings">ベクトル埋め込みに対する</a> <a href="https://zilliz.com/glossary/similarity-search">類似検索</a>用に設計された、広く使われているベクトルデータベースです。その初期のストレージ設計は、オブジェクトストレージを構築するための一般的な最初のアプローチを反映している。</p>
<p>V1では、<a href="https://milvus.io/docs/manage-collections.md">コレクション</a>内の各フィールドは<a href="https://milvus.io/docs/glossary.md">セグメントを</a>またいで別々のbinlogファイルに格納される。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_5_08cf1c8ec1.png" alt="Milvus V1 storage layout showing a collection split into segments, with each segment storing fields like id, vector, and scalar data in separate binlog files, plus separate stats_log files for file statistics" class="doc-image" id="milvus-v1-storage-layout-showing-a-collection-split-into-segments,-with-each-segment-storing-fields-like-id,-vector,-and-scalar-data-in-separate-binlog-files,-plus-separate-stats_log-files-for-file-statistics" />
   </span> <span class="img-wrapper"> <span>Milvus V1のストレージレイアウトは、コレクションをセグメントに分割し、各セグメントにid、vector、scalarデータなどのフィールドを別々のbinlogファイルに格納し、さらにファイル統計用に別々のstats_logファイルを格納している。</span> </span></p>
<h3 id="How-Does-Milvus-V1-Locate-Data" class="common-anchor-header">Milvus V1はどのようにデータを探すのか？</h3><p><code translate="no">SELECT id, vector FROM collection WHERE id = 123</code> 。</p>
<ol>
<li><strong>メタデータ検索</strong>- etcd/MySQLにセグメントリストを問い合わせる。<code translate="no">[Segment 12345, 12346, 12347, …]</code></li>
<li><strong>セグメント全体のidフィールドを読み込む</strong>- 各セグメントについて、idのbinlogファイルを読み込む</li>
<li><strong>対象の行を探す</strong>- 読み込まれたidデータをスキャンして探す<code translate="no">id = 123</code></li>
<li><strong>ベクトルフィールドを読み込む</strong>- 該当するセグメントの対応するベクトルビンログファイルを読み込む</li>
</ol>
<p>総ファイルアクセス数<strong>N × (F₁ + F₂ + ...)</strong>ここで、N = セグメントの数、F = フィールドごとのbinlogファイル。</p>
<p>計算が速くなる。100のフィールド、1,000のセグメント、フィールドあたり5つのbinlogファイルを持つコレクションの場合：</p>
<blockquote>
<p><strong>1,000 × 100 × 5 = 500,000ファイル</strong></p>
</blockquote>
<p>クエリが3つのフィールドにしか触れなかったとしても、オブジェクトストレージAPIを15,000回呼び出すことになる。S3リクエストあたり50ミリ秒とすると、シリアライズされたレイテンシは<strong>750秒に</strong>達し、1回のクエリーで12分以上かかることになる。</p>
<h2 id="Milvus-V2-How-Segment-Level-Parquet-Cuts-API-Calls-by-10x" class="common-anchor-header">Milvus V2：セグメントレベルのパーケットでAPIコールを10倍削減する方法<button data-href="#Milvus-V2-How-Segment-Level-Parquet-Cuts-API-Calls-by-10x" class="anchor-icon" translate="no">
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
    </button></h2><p>V1でのスケーラビリティの限界を解決するために、Milvus V2では根本的な変更を行いました。多くの小さなbinlogファイルではなく、V2はセグメントベースのParquetファイルにデータを統合します。</p>
<p>ファイル数は、<code translate="no">N × fields × binlogs</code> から約<code translate="no">N</code> に減少します（セグメントごとに1ファイルグループ）。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_7_95db65a6e0.png" alt="Milvus V2 storage layout showing a segment stored as Parquet files with row groups containing column chunks for id, vector, and timestamp, plus a footer with schema and column statistics" class="doc-image" id="milvus-v2-storage-layout-showing-a-segment-stored-as-parquet-files-with-row-groups-containing-column-chunks-for-id,-vector,-and-timestamp,-plus-a-footer-with-schema-and-column-statistics" />
   </span> <span class="img-wrapper"> <span>Milvus V2のストレージレイアウトは、id、vector、timestampのカラムチャンクを含む行グループと、スキーマとカラムの統計情報を含むフッターを持つParquetファイルとして保存されたセグメントを示している。</span> </span></p>
<p>しかし、V2はすべてのフィールドを1つのファイルに格納しているわけではない。サイズ別にフィールドをグループ化するのだ：</p>
<ul>
<li><strong>小さな<a href="https://milvus.io/docs/scalar_index.md">スカラーフィールド</a></strong>（idやタイムスタンプなど）は一緒に保存される。</li>
<li><strong>大きなフィールド</strong>（<a href="https://zilliz.com/learn/sparse-and-dense-embeddings">密なベクトルなど</a>）は専用のファイルに分割される。</li>
</ul>
<p>すべてのファイルは同じセグメントに属し、行はファイル間のインデックスによって整列される。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_9_fe4f57a1e0.png" alt="Parquet file structure showing row groups with column chunks and compressed data pages, plus a footer containing file metadata, row group metadata, and column statistics like min/max values" class="doc-image" id="parquet-file-structure-showing-row-groups-with-column-chunks-and-compressed-data-pages,-plus-a-footer-containing-file-metadata,-row-group-metadata,-and-column-statistics-like-min/max-values" />
   </span> <span class="img-wrapper"> <span>列チャンクと圧縮されたデータページを持つ行グループと、ファイルのメタデータ、行グループのメタデータ、最小/最大値などの列統計を含むフッターを示すパーケットファイル構造</span> </span></p>
<h3 id="How-Does-Milvus-V2-Locate-Data" class="common-anchor-header">Milvus V2はどのようにデータを検索するのか？</h3><p>同じクエリに対して -<code translate="no">SELECT id, vector FROM collection WHERE id = 123</code> ：</p>
<ol>
<li><strong>メタデータの検索</strong>- セグメントリストの取得<code translate="no">[12345, 12346, …]</code></li>
<li><strong>Parquetフッターの読み込み</strong>- 行グループの統計情報の抽出。<code translate="no">id = 123</code> 、行グループ0（min=1, max=1000）に該当。</li>
<li><strong>必要なものだけを読み込む</strong>- Parquetの列プルーニングにより、スモールフィールドファイルからはid列だけを、ラージフィールドファイルからは<a href="https://milvus.io/docs/index-vector-fields.md">vector</a>列だけを読み込む。一致する行グループのみがアクセスされます。</li>
</ol>
<p>ラージフィールドを分割することで、2つの重要な利点が得られます：</p>
<ul>
<li><strong>より効率的な読み取り。</strong> <a href="https://zilliz.com/glossary/vector-embeddings">ベクトル埋め込みは</a>ストレージサイズを支配する。スモールフィールドと混在すると、1つの行グループに収まる行数が制限され、ファイルアクセスが増加します。それらを分離することで、小さなフィールドの行グループにははるかに多くの行を保持することができ、大きなフィールドにはそのサイズに最適化されたレイアウトを使用することができます。</li>
<li><strong>柔軟な<a href="https://milvus.io/docs/schema.md">スキーマの</a>進化。</strong>カラムを追加することは、新しいファイルを作成することを意味する。カラムの削除は、読み取り時にそのカラムをスキップすることを意味する。履歴データの書き換えは不要。</li>
</ul>
<p>その結果、ファイル数は10倍以上、API呼び出しは10倍以上減少し、クエリの待ち時間は数分から数秒に短縮されました。</p>
<h2 id="Milvus-V1-vs-V2" class="common-anchor-header">Milvus V1とV2の比較<button data-href="#Milvus-V1-vs-V2" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>アスペクト</th><th>V1</th><th>V2</th></tr>
</thead>
<tbody>
<tr><td>ファイル構成</td><td>フィールドごとに分割</td><td>セグメントごとに統合</td></tr>
<tr><td>コレクションごとのファイル</td><td>N × フィールド × ビンログ</td><td>~N × カラムグループ</td></tr>
<tr><td>保存形式</td><td>カスタムビンログ</td><td>Parquet (LanceとVortexもサポート)</td></tr>
<tr><td>カラム・プルーニング</td><td>ナチュラル（フィールドレベルのファイル）</td><td>Parquetカラム・プルーニング</td></tr>
<tr><td>統計</td><td>独立したstats_logファイル</td><td>Parquetフッターへの埋め込み</td></tr>
<tr><td>クエリごとのS3 APIコール</td><td>10,000+</td><td>~1,000</td></tr>
<tr><td>クエリーレイテンシー</td><td>分</td><td>秒</td></tr>
</tbody>
</table>
<h2 id="Apache-Iceberg-Metadata-Driven-File-Pruning" class="common-anchor-header">Apache Iceberg：メタデータ駆動型ファイル・プルーニング<button data-href="#Apache-Iceberg-Metadata-Driven-File-Pruning" class="anchor-icon" translate="no">
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
    </button></h2><p>Apache Icebergは、レイクハウス・システムにおける膨大なデータセットの分析テーブルを管理します。テーブルが何千ものデータファイルにまたがっている場合、すべてをスキャンすることなく、関連するファイルだけにクエリを絞り込むことが課題となります。</p>
<p>Icebergの答えは、レイヤー化されたメタデータを使って、データI/Oが発生する<em>前に</em>読み込むファイルを決定することだ。これは、ベクターデータベースにおける<a href="https://zilliz.com/learn/metadata-filtering-with-milvus">メタデータフィルタリングの</a>原理と同じで、事前に計算された統計を使って、無関係なデータをスキップする。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_8_a9b063bdbe.png" alt="Iceberg data organization showing a metadata directory with metadata.json, manifest lists, and manifest files alongside a data directory with date-partitioned Parquet files" class="doc-image" id="iceberg-data-organization-showing-a-metadata-directory-with-metadata.json,-manifest-lists,-and-manifest-files-alongside-a-data-directory-with-date-partitioned-parquet-files" />
   </span> <span class="img-wrapper"> <span>Icebergのデータ構成。metadata.json、マニフェスト・リスト、マニフェスト・ファイルを含むメタデータ・ディレクトリと、日付でパーティショニングされたParquetファイルを含むデータ・ディレクトリが並んでいる。</span> </span></p>
<p>Icebergはメタデータのレイヤー構造を採用している。各レイヤーは、次のレイヤーが参照される前に無関係なデータをフィルタリングします。これは、<a href="https://milvus.io/docs/architecture_overview.md">分散データベースが</a>効率的なアクセスのためにメタデータをデータから分離するのと同様の精神です。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/data_addressing_storage_systems_6_afc159ea22.png" alt="Iceberg four-layer architecture: metadata.json points to manifest lists, which reference manifest files containing file-level statistics, which point to actual Parquet data files" class="doc-image" id="iceberg-four-layer-architecture:-metadata.json-points-to-manifest-lists,-which-reference-manifest-files-containing-file-level-statistics,-which-point-to-actual-parquet-data-files" />
   </span> <span class="img-wrapper"> <span>Icebergの4層構造：metadata.jsonはマニフェストリストを指し、マニフェストリストはファイルレベルの統計情報を含むマニフェストファイルを参照し、マニフェストファイルは実際のParquetデータファイルを指す。</span> </span></p>
<h3 id="How-Does-Iceberg-Locate-Data" class="common-anchor-header">Icebergはどのようにデータを探すのか？</h3><p>考えてみましょう：<code translate="no">SELECT * FROM orders WHERE date='2024-01-15' AND amount&gt;1000</code>.</p>
<ol>
<li><strong>metadata.json を読み込む</strong>（1 I/O） - 現在のスナップショットとそのマニフェスト・リストを読み込む。</li>
<li><strong>マニフェスト・リストを読み込む</strong>（1 I/O） -<a href="https://milvus.io/docs/use-partition-key.md">パーティション・レベルの</a>フィルタを適用してパーティション全体をスキップする（たとえば、2023年のデータはすべて除外される）。</li>
<li><strong>マニフェスト・ファイルの読み取り</strong>（2 I/O） - ファイル・レベルの統計（最小/最大日付、最小/最大量）を使用して、クエリに一致しないファイルを除外する。</li>
<li><strong>データファイルの読み取り</strong>（3 I/O） - 3つのファイルだけが残り、実際に読み取られる。</li>
</ol>
<p>1,000個のデータファイルをスキャンする代わりに、Icebergは<strong>7回のI/Oオペレーションで</strong>検索を完了。</p>
<h2 id="How-Different-Systems-Address-Data" class="common-anchor-header">異なるシステムによるデータの扱い方<button data-href="#How-Different-Systems-Address-Data" class="anchor-icon" translate="no">
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
    </button></h2><table>
<thead>
<tr><th>システム</th><th>データ構成</th><th>コア・アドレス指定メカニズム</th><th>アクセス・コスト</th></tr>
</thead>
<tbody>
<tr><td>ハッシュマップ</td><td>キー → 配列スロット</td><td>ハッシュ関数 → 直接インデックス</td><td>O(1) メモリアクセス</td></tr>
<tr><td>HDFS</td><td>パス → ブロック → データノード</td><td>インメモリハッシュマップ + ブロック計算</td><td>1 RPC + Nブロックリード</td></tr>
<tr><td>カフカ</td><td>トピック → パーティション → セグメント</td><td>TreeMap + スパースインデックス + シーケンシャルスキャン</td><td>1インデックスルックアップ + 1データリード</td></tr>
<tr><td><a href="https://milvus.io/">Milvus</a>V2</td><td><a href="https://milvus.io/docs/manage-collections.md">コレクション</a>→ セグメント → パーケットカラム</td><td>メタデータ検索 + 列のプルーニング</td><td>N回の読み取り (N = セグメント)</td></tr>
<tr><td>アイスバーグ</td><td>テーブル → スナップショット → マニフェスト → データファイル</td><td>メタデータの階層化 + 統計的プルーニング</td><td>3メタデータリード＋Mデータリード</td></tr>
</tbody>
</table>
<h2 id="Three-Principles-Behind-Efficient-Data-Addressing" class="common-anchor-header">効率的なデータ・アドレッシングを支える3つの原則<button data-href="#Three-Principles-Behind-Efficient-Data-Addressing" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="1-Computation-Always-Beats-Search" class="common-anchor-header">1.計算は常に検索に勝る</h3><p>これまで検証してきたすべてのシステムにおいて、最も効果的な最適化は同じルールに従っている。</p>
<ul>
<li>HashMapはスキャンする代わりに、<code translate="no">hash(key)</code> から配列インデックスを計算する。</li>
<li>HDFSは、ファイルシステムのメタデータを走査する代わりに、ファイルオフセットからターゲットブロックを計算する。</li>
<li>Kafkaは、ログをスキャンする代わりに、関連するセグメントとインデックスの位置を計算する。</li>
<li>Icebergは、述語とファイルレベルの統計を使って、どのファイルが読む価値があるかを計算する。</li>
</ul>
<p>計算は固定コストの算術演算。検索は、比較、ポインタ追跡、I/Oなどのトラバーサルであり、そのコストはデータサイズとともに増大する。システムが場所を直接導き出せるようになれば、スキャンは不要になる。</p>
<h3 id="2-Minimize-High-Latency-Accesses" class="common-anchor-header">2.高レイテンシ・アクセスの最小化</h3><p>ここで、核となる公式に戻る：<strong>総アドレス・コスト＝メタデータ・アクセス＋データ・アクセス。</strong>すべての最適化は、最終的にこれらの高レイテンシ操作を減らすことを目的としている。</p>
<table>
<thead>
<tr><th>パターン</th><th>例</th></tr>
</thead>
<tbody>
<tr><td>APIファンアウトを制限するためにファイル数を減らす</td><td>Milvus V2セグメント統合</td></tr>
<tr><td>統計を使用してデータを早期に除外する</td><td>アイスバーグ・マニフェストの刈り込み</td></tr>
<tr><td>メタデータをメモリにキャッシュ</td><td>HDFS NameNode、Kafka mmapインデックス</td></tr>
<tr><td>少ないシーケンシャルスキャンと少ないランダムリードのトレード</td><td>Kafkaスパースインデックス</td></tr>
</tbody>
</table>
<h3 id="3-Statistics-Enable-Early-Decisions" class="common-anchor-header">3.統計が早期決定を可能にする</h3><p>最小/最大値、パーティション境界、行数など、単純な情報を書き込み時に記録することで、システムは読み取り時に、どのファイルが読む価値があり、どれが完全にスキップできるかを判断できる。</p>
<p>これは大きな見返りを伴う小さな投資である。統計は、ファイル・アクセスをブラインド・リードから意図的な選択へと変える。Icebergのマニフェストレベル・プルーニングであれ、Milvus V2のParquetフッター統計であれ、原理は同じである。書き込み時に数バイトのメタデータを使用することで、読み取り時に何千ものI/Oオペレーションを排除することができる。</p>
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
    </button></h2><p>Two SumからHashMapへ、そしてHDFSとKafkaからMilvusとApache Icebergへ、一つのパターンが繰り返されている。</p>
<p>データが増大し、ストレージがメモリからディスク、オブジェクト・ストレージへと移行するにつれ、仕組みは変わるが、核となる考え方は変わらない。最高のシステムは、検索する代わりに場所を計算し、メタデータを近くに置き、統計を使って重要でないデータに触れないようにしている。私たちがこれまで検証してきたパフォーマンス向上の秘訣は、高レイテンシ・アクセスを減らし、可能な限り早い段階で検索領域を絞り込むことにある。</p>
<p><a href="https://zilliz.com/learn/what-is-vector-search">ベクター検索</a>パイプラインの設計、<a href="https://zilliz.com/learn/introduction-to-unstructured-data">非構造化データ</a>上のシステム構築、レイクハウスクエリーエンジンの最適化、いずれにおいても、同じ方程式が適用される。システムがデータをどのように扱うかを理解することが、高速化への第一歩です。</p>
<hr>
<p>Milvusをご利用のお客様で、ストレージやクエリのパフォーマンスを最適化したいとお考えでしたら、ぜひお手伝いさせてください：</p>
<ul>
<li><a href="https://slack.milvus.io/">MilvusのSlackコミュニティに</a>参加して、質問をしたり、アーキテクチャを共有したり、同じような問題に取り組んでいる他のエンジニアから学んだりしましょう。</li>
<li>ストレージレイアウト、クエリチューニング、本番環境へのスケーリングなど、お客様のユースケースを説明する<a href="https://milvus.io/office-hours">20分間のMilvusオフィスアワー（無料）をご予約</a>ください。</li>
<li>インフラストラクチャのセットアップを省きたい場合は、Milvusのマネージドサービスである<a href="https://cloud.zilliz.com/signup">Zilliz Cloudを</a>ご利用ください。</li>
</ul>
<hr>
<p>エンジニアがデータアドレスとストレージ設計について考え始めると出てくるいくつかの質問：</p>
<p><strong>Q: Milvusはなぜフィールドレベルからセグメントレベルのストレージに切り替えたのですか？</strong></p>
<p>Milvus V1では、各フィールドはセグメントをまたいで別々のbinlogファイルに保存されていました。100のフィールドと1,000のセグメントを持つコレクションでは、数十万の小さなファイルが作成され、それぞれにS3のAPIコールが必要でした。V2はデータをセグメントベースのParquetファイルに統合し、ファイル数を10倍以上削減し、クエリのレイテンシを数分から数秒に短縮しました。核心的な洞察：オブジェクトストレージでは、APIコールの数はデータ総量よりも重要です。</p>
<p><strong>Q: Milvusはどのようにベクトル検索とスカラーフィルタリングの両方を効率的に処理しているのですか？</strong></p>
<p>Milvus V2は<a href="https://milvus.io/docs/scalar_index.md">スカラーフィールドと</a> <a href="https://milvus.io/docs/index-vector-fields.md">ベクトルフィールドを</a>同じセグメント内の別々のファイルグループに格納します。スカラ検索では、Parquetのカラム・プルーニングと行グループ統計を使って無関係なデータをスキップします。<a href="https://zilliz.com/learn/what-is-vector-search">ベクター検索では</a>、専用の<a href="https://zilliz.com/learn/vector-index">ベクターインデックスを</a>使用します。どちらも同じセグメント構造を共有しているため、スカラー・フィルターとベクトル類似性を組み合わせた<a href="https://zilliz.com/learn/hybrid-search-a-practical-guide">ハイブリッド・クエリーは</a>、重複することなく同じデータを操作することができます。</p>
<p><strong>Q: 「検索より計算」の原則はベクトル・データベースにも適用されますか？</strong></p>
<p>はい。HNSWやIVFのような<a href="https://zilliz.com/learn/vector-index">ベクトルインデックスも</a>同じ考え方に基づいています。クエリ・ベクトルと保存されているすべてのベクトルを比較する（総当たり検索）のではなく、グラフ構造やクラスタ・セントロイドを使って近似近傍を計算し、ベクトル空間の関連領域に直接ジャンプします。トレードオフとして、距離計算が桁違いに少なくなる代わりに精度が少し落ちますが、これは高次<a href="https://zilliz.com/glossary/vector-embeddings">元埋め込み</a>データに適用される「検索より計算」というパターンと同じです。</p>
<p><strong>Q: チームがオブジェクト・ストレージで犯す最大のパフォーマンスミスは何ですか？</strong></p>
<p>小さなファイルを作りすぎることです。S3の各GETリクエストは、返されるデータの量に関係なく、一定のレイテンシー（～50ミリ秒）があります。10,000個の小さなファイルを読み込むシステムは、500秒のレイテンシを発生させる。小さなファイルを大きなファイルにマージし、Parquetのようなカラム形式を使用して選択的に読み込み、ファイルを完全にスキップできるようにメタデータを管理する。</p>
