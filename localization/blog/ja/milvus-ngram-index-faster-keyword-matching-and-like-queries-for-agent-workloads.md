---
id: >-
  milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md
title: Milvus Ngram Indexのご紹介：エージェントワークロードのためのキーワードマッチングとLIKEクエリの高速化
author: Chenjie Tang
date: 2025-12-16T00:00:00.000Z
cover: assets.zilliz.com/Ngram_Index_cover_9e6063c638.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Milvus, Ngram Index, n-gram search, LIKE queries, full-text search'
meta_title: >
  Milvus Ngram Index: Faster Keyword Matching and LIKE Queries for Agent
  Workloads
desc: >-
  MilvusのNgram
  Indexが、部分文字列マッチングを効率的なN-gram検索に変換することで、LIKEクエリを高速化し、100倍高速なパフォーマンスを実現する方法をご紹介します。
origin: >-
  https://milvus.io/blog/milvus-ngram-index-faster-keyword-matching-and-like-queries-for-agent-workloads.md
---
<p>エージェントシステムにおいて、<strong>コンテキスト検索は</strong>パイプライン全体にわたる基礎的なビルディングブロックであり、下流の推論、計画、行動の基礎を提供する。ベクトル検索は、エージェントが大規模で構造化されていないデータセット全体の意図と意味を捉える、意味的に関連するコンテキストを検索するのに役立つ。しかし、意味的な関連性だけでは十分でないことが多い。エージェントパイプラインは、製品名、関数呼び出し、エラーコード、または法的に重要な用語など、正確なキーワード制約を強制するために全文検索にも依存しています。このサポートレイヤーは、検索されたコンテキストが関連性があるだけでなく、明確なテキスト要件を満たすことを保証します。</p>
<p>実際の作業負荷は一貫してこのニーズを反映している：</p>
<ul>
<li><p>カスタマーサポートのアシスタントは、特定の製品や成分について言及している会話を見つけなければならない。</p></li>
<li><p>コーディングのコパイロットは、正確な関数名、APIコール、エラー文字列を含むスニペットを探します。</p></li>
<li><p>法律、医療、学術分野のエージェントは、逐語的に表示されなければならない条項や引用をドキュメントにフィルタリングします。</p></li>
</ul>
<p>従来、システムはこれをSQLの<code translate="no">LIKE</code> 演算子で処理してきた。<code translate="no">name LIKE '%rod%'</code> のようなクエリはシンプルで広くサポートされていますが、高い同時実行性と大量のデータでは、このシンプルさが大きなパフォーマンス・コストになります。</p>
<ul>
<li><p><strong>インデックスがない</strong>場合、<code translate="no">LIKE</code> クエリはコンテキストストア全体をスキャンし、行ごとにパターンマッチングを適用します。数百万レコードの場合、1つのクエリでさえ数秒かかり、リアルタイムのエージェントインタラクションには遅すぎる。</p></li>
<li><p><strong>従来の転置インデックスを使用した</strong>場合でも、<code translate="no">%rod%</code> のようなワイルドカードパターンの最適化は困難なままです。これは、エンジンが辞書全体をトラバースし、各エントリでパターンマッチングを実行する必要があるためです。この操作は行スキャンを回避するが、基本的には線形であるため、わずかな改善しかもたらさない。</p></li>
</ul>
<p>ベクトル検索は意味的関連性を効率的に処理するが、正確なキーワードフィルタリングはパイプラインの中で最も遅いステップになることが多い。</p>
<p>Milvusは、メタデータフィルタリングを伴うハイブリッドベクター検索とフルテキスト検索をネイティブにサポートしている。キーワードマッチングの限界に対処するため、Milvusは<a href="https://milvus.io/docs/ngram.md"><strong>Ngram Indexを</strong></a>導入しています。これは、テキストを小さな部分文字列に分割し、効率的な検索のためにインデックス化することで、<code translate="no">LIKE</code> パフォーマンスを向上させます。これにより、クエリ実行中に検査されるデータ量が劇的に削減され、実際のエージェントのワークロードにおいて、<code translate="no">LIKE</code> クエリを<strong>数十倍から数百倍高速化する</strong>ことができます。</p>
<p>この投稿の残りの部分では、MilvusにおけるNgram Indexの仕組みについて説明し、実際のシナリオにおけるパフォーマンスを評価します。</p>
<h2 id="What-Is-the-Ngram-Index" class="common-anchor-header">Ngramインデックスとは？<button data-href="#What-Is-the-Ngram-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>データベースでは、テキストフィルタリングは一般的にデータの取得と管理に使用される標準的なクエリ言語である<strong>SQLを</strong>使用して表現されます。その中で最も広く使われているテキスト演算子の一つが<code translate="no">LIKE</code> であり、パターンベースの文字列マッチングをサポートしている。</p>
<p>LIKE式は、ワイルドカードの使われ方によって、4つの一般的なパターン・タイプに大別することができます：</p>
<ul>
<li><p><strong>Infixマッチ</strong>(<code translate="no">name LIKE '%rod%'</code>)：部分文字列ロッドがテキスト内の任意の場所に現れるレコードにマッチする。</p></li>
<li><p><strong>接頭辞マッチ</strong>(<code translate="no">name LIKE 'rod%'</code>)：テキストがrodで始まるレコードにマッチします。</p></li>
<li><p><strong>接尾辞マッチ</strong>(<code translate="no">name LIKE '%rod'</code>)：テキストがrodで終わるレコードにマッチします。</p></li>
<li><p><strong>ワイルドカード一致</strong>(<code translate="no">name LIKE '%rod%aab%bc_de'</code>)：複数の部分文字列条件(<code translate="no">%</code>)と1文字のワイルドカード(<code translate="no">_</code>)を1つのパターンで組み合わせます。</p></li>
</ul>
<p>これらのパターンは見た目も表現力も異なりますが、Milvusの<strong>Ngram</strong>インデックスは同じ基本的なアプローチを用いて全てのパターンを高速化します。</p>
<p>インデックスを構築する前に、Milvusは各テキスト値を<em>n-gramと</em>呼ばれる一定の長さの短く重なり合った部分文字列に分割する。例えば、n = 3の場合、<strong>"Milvus "という</strong>単語は以下の3-gramに分解される：<strong>「Mil"、</strong> <strong>"ilv"、</strong> <strong>"lvu"、</strong> <strong>"vus "である。</strong>そして、各n-gramは、その部分文字列をそれが出現する文書IDの集合に対応付ける転置インデックスに格納される。クエリー時、<code translate="no">LIKE</code> の条件はn-gramのルックアップの組み合わせに変換され、milvusはほとんどのマッチしないレコードを素早くフィルタリングし、より少ない候補セットに対してパターンを評価することができる。これが、高価な文字列スキャンを効率的なインデックスベースのクエリに変えるものである。</p>
<p>Ngramインデックスの構築方法を制御する2つのパラメータ：<code translate="no">min_gram</code> と<code translate="no">max_gram</code> 。これらはMilvusが生成する部分文字列の長さの範囲を定義し、インデックスを作成します。</p>
<ul>
<li><p><strong><code translate="no">min_gram</code></strong>:インデックスを作成する最も短い部分文字列の長さ。実際には、これは Ngram インデックスの恩恵を受けることができる最小のクエリ文字列長を設定します。</p></li>
<li><p><strong><code translate="no">max_gram</code></strong>:インデックスを作成する最も長い部分文字列長。クエリ時には、さらに、長いクエリ文字列をn-gramに分割する際に使用される最大ウィンドウサイズを決定します。</p></li>
</ul>
<p>Milvusは、長さが<code translate="no">min_gram</code> から<code translate="no">max_gram</code> の間にあるすべての連続した部分文字列をインデックス化することにより、サポートされているすべての<code translate="no">LIKE</code> パターンタイプを高速化するための一貫した効率的な基盤を確立します。</p>
<h2 id="How-Does-the-Ngram-Index-Work" class="common-anchor-header">Ngramインデックスの仕組み<button data-href="#How-Does-the-Ngram-Index-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusは2段階のプロセスでNgram Indexを実装します：</p>
<ul>
<li><p><strong>インデックスの構築</strong>各文書のN-gramを生成し、データ取り込み時に転置インデックスを構築します。</p></li>
<li><p><strong>クエリの高速化</strong>インデックスを使用して検索を小さな候補セットに絞り込み、それらの候補について<code translate="no">LIKE</code> の完全一致を検証する。</p></li>
</ul>
<p>具体的な例を挙げると、このプロセスが理解しやすくなる。</p>
<h3 id="Phase-1-Build-the-index" class="common-anchor-header">フェーズ1：インデックスの構築</h3><p><strong>テキストをn-gramに分解する：</strong></p>
<p>以下の設定でテキスト<strong>"Apple "</strong>にインデックスを作成すると仮定する：</p>
<ul>
<li><p><code translate="no">min_gram = 2</code></p></li>
<li><p><code translate="no">max_gram = 3</code></p></li>
</ul>
<p>この設定では、milvusは長さ2と3の連続した部分文字列を全て生成する：</p>
<ul>
<li><p>2-gram：<code translate="no">Ap</code> <code translate="no">pp</code>,<code translate="no">pl</code> 、<code translate="no">le</code></p></li>
<li><p>3-grams：<code translate="no">App</code> <code translate="no">ppl</code> 、<code translate="no">ple</code></p></li>
</ul>
<p><strong>転置インデックスを構築する：</strong></p>
<p>ここで、5つのレコードからなる小さなデータセットを考える：</p>
<ul>
<li><p><strong>文書0</strong>：<code translate="no">Apple</code></p></li>
<li><p><strong>文書0: 文書1：</strong> <code translate="no">Pineapple</code></p></li>
<li><p><strong>文書2</strong> <code translate="no">Maple</code></p></li>
<li><p><strong>文書3</strong> <code translate="no">Apply</code></p></li>
<li><p><strong>文書4</strong>：<code translate="no">Snapple</code></p></li>
</ul>
<p>インジェスト中、Milvusは各レコードに対してn-gramを生成し、それを転置インデックスに挿入する。このインデックスでは</p>
<ul>
<li><p><strong>キーは</strong>n-gram(部分文字列)</p></li>
<li><p><strong>値は</strong>n-gramが出現する文書IDのリスト</p></li>
</ul>
<pre><code translate="no"><span class="hljs-string">&quot;Ap&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">3</span>]
<span class="hljs-string">&quot;App&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">3</span>]
<span class="hljs-string">&quot;Ma&quot;</span>  -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;Map&quot;</span> -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;Pi&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;Pin&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;Sn&quot;</span>  -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;Sna&quot;</span> -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ap&quot;</span>  -&gt; [<span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;apl&quot;</span> -&gt; [<span class="hljs-number">2</span>]
<span class="hljs-string">&quot;app&quot;</span> -&gt; [<span class="hljs-number">1</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ea&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;eap&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;in&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;ine&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;le&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ly&quot;</span>  -&gt; [<span class="hljs-number">3</span>]
<span class="hljs-string">&quot;na&quot;</span>  -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;nap&quot;</span> -&gt; [<span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ne&quot;</span>  -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;nea&quot;</span> -&gt; [<span class="hljs-number">1</span>]
<span class="hljs-string">&quot;pl&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ple&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">2</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ply&quot;</span> -&gt; [<span class="hljs-number">3</span>]
<span class="hljs-string">&quot;pp&quot;</span>  -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<span class="hljs-string">&quot;ppl&quot;</span> -&gt; [<span class="hljs-number">0</span>, <span class="hljs-number">1</span>, <span class="hljs-number">3</span>, <span class="hljs-number">4</span>]
<button class="copy-code-btn"></button></code></pre>
<p>これでインデックスは完全に構築された。</p>
<h3 id="Phase-2-Accelerate-queries" class="common-anchor-header">第2段階：クエリーの高速化</h3><p><code translate="no">LIKE</code> フィルタが実行されると、MilvusはNgramインデックスを使い、以下のステップでクエリの評価を高速化する：</p>
<p><strong>1.クエリー用語を抽出する：</strong>ワイルドカードを含まない連続した部分文字列が<code translate="no">LIKE</code> 式から抽出される（例えば、<code translate="no">'%apple%'</code> は<code translate="no">apple</code> になる）。</p>
<p><strong>2.クエリ語の分解：</strong>クエリ語は、その長さ（<code translate="no">L</code> ）と、構成された<code translate="no">min_gram</code> と<code translate="no">max_gram</code> に基づいて、n-gramに分解される。</p>
<p><strong>3.各グラムを検索し、交差させる:</strong>Milvusは転置インデックスでクエリーn-gramを検索し、それらの文書IDリストを交差させ、小さな候補セットを生成する。</p>
<p><strong>4.検証して結果を返す：</strong>元の<code translate="no">LIKE</code> 条件がこの候補セットにのみ適用され、最終結果が決定される。</p>
<p>実際には、クエリをn-gramに分割する方法は、パターン自体の形状に依存する。これがどのように機能するかを見るために、2つの一般的なケース、すなわち、接尾辞マッチとワイルドカードマッチに焦点を当てます。接頭辞マッチと接尾辞マッチは infix マッチと同じ挙動をするので、ここでは別々に説明しません。</p>
<p><strong>infix マッチ</strong></p>
<p>infix マッチの場合、実行はリテラル部分文字列 (<code translate="no">L</code>) の<code translate="no">min_gram</code> と<code translate="no">max_gram</code> からの相対的な長さに依存します。</p>
<p><strong>1.<code translate="no">min_gram ≤ L ≤ max_gram</code></strong>(例:<code translate="no">strField LIKE '%ppl%'</code>)</p>
<p>リテラル部分文字列<code translate="no">ppl</code> は、設定されたn-gramの範囲内にあります。milvusは直接、転置インデックスでn-gram<code translate="no">&quot;ppl&quot;</code> を検索し、候補文書ID<code translate="no">[0, 1, 3, 4]</code> を生成します。</p>
<p>リテラル自体がインデックス付きn-gramであるため、すべての候補はすでにinfix条件を満たしている。最後の検証ステップではレコードは削除されず、結果は<code translate="no">[0, 1, 3, 4]</code> のままとなる。</p>
<p><strong>2.<code translate="no">L &gt; max_gram</code></strong>(例:<code translate="no">strField LIKE '%pple%'</code>)</p>
<p>リテラル部分文字列<code translate="no">pple</code> は<code translate="no">max_gram</code> より長いため、<code translate="no">max_gram</code> のウィンドウ・サイズを使用して重複するn-gramに分解される。<code translate="no">max_gram = 3</code> を使用すると、<code translate="no">&quot;ppl&quot;</code> と<code translate="no">&quot;ple&quot;</code> のn-gramが生成される。</p>
<p>milvusは各n-gramを転置インデックスで検索する：</p>
<ul>
<li><p><code translate="no">&quot;ppl&quot;</code> →<code translate="no">[0, 1, 3, 4]</code></p></li>
<li><p><code translate="no">&quot;ple&quot;</code> →<code translate="no">[0, 1, 2, 4]</code></p></li>
</ul>
<p>これらのリストを交差させると、候補セット<code translate="no">[0, 1, 4]</code> が得られる。そして、これらの候補に元の<code translate="no">LIKE '%pple%'</code> フィルタが適用される。3つとも条件を満たすので、最終結果は<code translate="no">[0, 1, 4]</code> のままである。</p>
<p><strong>3.<code translate="no">L &lt; min_gram</code></strong>(例:<code translate="no">strField LIKE '%pp%'</code>)</p>
<p>リテラル部分文字列は<code translate="no">min_gram</code> より短いため、インデックス付き n-gram に分解できない。この場合、Nグラムインデックスは使用できず、Milvusはデフォルトの実行パスに戻り、パターンマッチによるフルスキャンで<code translate="no">LIKE</code> 条件を評価します。</p>
<p><strong>ワイルドカード一致</strong>(例:<code translate="no">strField LIKE '%Ap%pple%'</code>)</p>
<p>このパターンには複数のワイルドカードが含まれているため、Milvusはまず、<code translate="no">&quot;Ap&quot;</code> と<code translate="no">&quot;pple&quot;</code> という連続したリテラルに分割します。</p>
<p>その後、Milvusは各リテラルを個別に処理します：</p>
<ul>
<li><p><code translate="no">&quot;Ap&quot;</code> は長さ2でn-gramの範囲に入る。</p></li>
<li><p><code translate="no">&quot;pple&quot;</code> は<code translate="no">max_gram</code> より長く、<code translate="no">&quot;ppl&quot;</code> と<code translate="no">&quot;ple&quot;</code> に分解されます。</p></li>
</ul>
<p>これにより、クエリは以下のn-gramに縮小される：</p>
<ul>
<li><p><code translate="no">&quot;Ap&quot;</code> →<code translate="no">[0, 3]</code></p></li>
<li><p><code translate="no">&quot;ppl&quot;</code> →<code translate="no">[0, 1, 3, 4]</code></p></li>
<li><p><code translate="no">&quot;ple&quot;</code> →<code translate="no">[0, 1, 2, 4]</code></p></li>
</ul>
<p>これらのリストを交差させると、<code translate="no">[0]</code> という一つの候補ができる。</p>
<p>最後に、元の<code translate="no">LIKE '%Ap%pple%'</code> フィルタを文書0（<code translate="no">&quot;Apple&quot;</code> ）に適用する。これは完全なパターンを満たさないので、最終的な結果セットは空になる。</p>
<h2 id="Limitations-and-Trade-offs-of-the-Ngram-Index" class="common-anchor-header">Ngramインデックスの限界とトレードオフ<button data-href="#Limitations-and-Trade-offs-of-the-Ngram-Index" class="anchor-icon" translate="no">
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
    </button></h2><p>Ngram インデックスは、<code translate="no">LIKE</code> クエリー性能を大幅に向上させることができるが、実世界での展開において考慮すべきトレードオフをもたらす。</p>
<ul>
<li><strong>インデックスサイズの増大</strong></li>
</ul>
<p>Ngram インデックスの主なコストは、より高いストレージオーバーヘッドである。インデックスには、長さが<code translate="no">min_gram</code> から<code translate="no">max_gram</code> の間にある連続した部分文字列がすべて格納されるため、この範囲が拡大するにつれて生成されるn-gramの数が急速に増加します。n-gramの長さが増えるごとに、テキスト値ごとに重複する部分文字列の完全なセットが追加され、インデックスキーの数も投稿リストの数も増える。実際には、たった1文字範囲を拡張するだけで、標準的な転置インデックスと比較して、インデックスサイズはおよそ2倍になる。</p>
<ul>
<li><strong>すべてのワークロードに有効ではない</strong></li>
</ul>
<p>Ngramインデックスは全ての作業負荷を高速化するわけではない。クエリーパターンが非常に不規則であったり、非常に短いリテラルを含んでいたり、フィルタリングの段階でデータセットを小さな候補セットまで減らすことができなかったりする場合、パフォーマンスの利点は制限される可能性があります。このような場合、インデックスが存在しても、クエリの実行はフルスキャンのコストに近づく可能性がある。</p>
<h2 id="Evaluating-Ngram-Index-Performance-on-LIKE-Queries" class="common-anchor-header">LIKEクエリにおけるNgramインデックスの性能評価<button data-href="#Evaluating-Ngram-Index-Performance-on-LIKE-Queries" class="anchor-icon" translate="no">
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
    </button></h2><p>このベンチマークの目的は、Ngramインデックスが実際に<code translate="no">LIKE</code> クエリをどれだけ効果的に高速化するかを評価することである。</p>
<h3 id="Test-Methodology" class="common-anchor-header">テスト方法</h3><p>Ngramインデックスの性能の背景を理解するために、2つのベースライン実行モードと比較する：</p>
<ul>
<li><p><strong>マスター</strong>：マスター：インデックスを使用しない強引な実行。</p></li>
<li><p><strong>マスター反転</strong>：従来の転置インデックスを用いた実行。</p></li>
</ul>
<p>異なるデータ特性をカバーするために2つのテストシナリオを設計した：</p>
<ul>
<li><p><strong>Wikiテキストデータセット</strong>：100,000行、各テキストフィールドは1KBに切り捨て。</p></li>
<li><p><strong>単一単語データセット</strong>：1,000,000行、各行が1単語を含む。</p></li>
</ul>
<p>どちらのシナリオでも、以下の設定が一貫して適用される：</p>
<ul>
<li><p>クエリーは<strong>infixマッチパターン</strong>(<code translate="no">%xxx%</code>)を使用。</p></li>
<li><p>Ngram インデックスは、<code translate="no">min_gram = 2</code> で設定されています。<code translate="no">max_gram = 4</code></p></li>
<li><p>クエリの実行コストを分離し、結果の実体化のオーバーヘッドを避けるため、すべてのクエリは完全な結果セットではなく<code translate="no">count(*)</code> を返す。</p></li>
</ul>
<h3 id="Results" class="common-anchor-header">結果</h3><p><strong>wikiのテスト、各行は1000で切り捨てられた内容のwikiテキスト、100K行</strong></p>
<table>
<thead>
<tr><th></th><th>リテラル</th><th>時間(ms)</th><th>スピードアップ</th><th>カウント</th></tr>
</thead>
<tbody>
<tr><td>マスター</td><td>スタジアム</td><td>207.8</td><td></td><td>335</td></tr>
<tr><td>マスター逆転</td><td></td><td>2095</td><td></td><td>335</td></tr>
<tr><td>Nグラム</td><td></td><td>1.09</td><td>190 / 1922</td><td>335</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>マスター</td><td>中等学校</td><td>204.8</td><td></td><td>340</td></tr>
<tr><td>逆修士</td><td></td><td>2000</td><td></td><td>340</td></tr>
<tr><td>Nグラム</td><td></td><td>1.26</td><td>162.5 / 1587</td><td>340</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>マスター</td><td>男女共学の中等教育機関。</td><td>223.9</td><td></td><td>1</td></tr>
<tr><td>マスター反転</td><td></td><td>2100</td><td></td><td>1</td></tr>
<tr><td>Ngram</td><td></td><td>1.69</td><td>132.5 / 1242.6</td><td>1</td></tr>
</tbody>
</table>
<p><strong>単一単語のテスト、1M行</strong></p>
<table>
<thead>
<tr><th></th><th>リテラル</th><th>時間(ms)</th><th>スピードアップ</th><th>カウント</th></tr>
</thead>
<tbody>
<tr><td>マスター</td><td>マスター</td><td>128.6</td><td></td><td>40430</td></tr>
<tr><td>マスター反転</td><td></td><td>66.5</td><td></td><td>40430</td></tr>
<tr><td>Nグラム</td><td></td><td>1.38</td><td>93.2 / 48.2</td><td>40430</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>マスター</td><td>ナット</td><td>122</td><td></td><td>5200</td></tr>
<tr><td>マスター反転</td><td></td><td>65.1</td><td></td><td>5200</td></tr>
<tr><td>Nグラム</td><td></td><td>1.27</td><td>96 / 51.3</td><td>5200</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>マスター</td><td>ナティ</td><td>118.8</td><td></td><td>1630</td></tr>
<tr><td>マスター反転</td><td></td><td>66.9</td><td></td><td>1630</td></tr>
<tr><td>Nグラム</td><td></td><td>1.21</td><td>98.2 / 55.3</td><td>1630</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>マスター</td><td>ネイティオ</td><td>118.4</td><td></td><td>1100</td></tr>
<tr><td>マスターインバーテッド</td><td></td><td>65.1</td><td></td><td>1100</td></tr>
<tr><td>エヌグラム</td><td></td><td>1.33</td><td>89 / 48.9</td><td>1100</td></tr>
<tr><td></td><td></td><td></td><td></td><td></td></tr>
<tr><td>マスター</td><td>国家</td><td>118</td><td></td><td>1100</td></tr>
<tr><td>マスター国</td><td></td><td>63.3</td><td></td><td>1100</td></tr>
<tr><td>Nグラム</td><td></td><td>1.4</td><td>84.3 / 45.2</td><td>1100</td></tr>
</tbody>
</table>
<p><strong>注：</strong>これらの結果は5月に実施されたベンチマークに基づく。それ以降、Masterブランチでは性能の最適化が行われたため、ここで観測された性能差は現在のバージョンでは小さくなっていると予想される。</p>
<p>ベンチマークの結果は、明確なパターンを浮き彫りにしている。Ngramインデックスは、すべてのケースでLIKEクエリを大幅に高速化し、クエリの実行速度がどの程度速くなるかは、基礎となるテキストデータの構造と長さに強く依存する。</p>
<ul>
<li><p>1,000バイトに切り詰められたWikiスタイルのドキュメントのような<strong>長いテキストフィールドの</strong>場合、パフォーマンスの向上は特に顕著です。インデックスなしの総当り実行と比較すると、Ngramインデックスはおよそ<strong>100～200倍の</strong>スピードアップを達成する。従来の転置インデックスと比較すると、さらに劇的な改善が見られ、<strong>1,200-1,900倍に</strong>達する。これは、長いテキストに対するLIKEクエリが従来のインデックス作成アプローチにとって特に高価であるのに対し、N-gramルックアップは検索空間を非常に小さな候補セットに素早く絞り込むことができるためである。</p></li>
<li><p><strong>単一単語で</strong>構成されるデータセットでは、利益は小さくなるが、それでも相当なものである。このシナリオでは、Ngramインデックスはブルートフォース実行よりも<strong>約80～100倍</strong>、従来の転置インデックスよりも<strong>45～55倍</strong>高速に動作する。短いテキストは本質的にスキャンコストが低いが、それでもN-gramベースのアプローチは不必要な比較を回避し、一貫してクエリーコストを削減する。</p></li>
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
    </button></h2><p>Ngramインデックスは、テキストを固定長のN-gramに分割し、転置構造を用いてインデックスを作成することで、<code translate="no">LIKE</code> クエリを高速化する。この設計は、高価な部分文字列マッチングを効率的なn-gramルックアップに変え、その後に最小限の検証を行う。その結果、<code translate="no">LIKE</code> の正確なセマンティクスが保たれたまま、全文スキャンが回避される。</p>
<p>実際には、このアプローチは幅広い作業負荷に有効であり、特に長いテキストフィールドのファジィマッチングに強い結果をもたらす。したがって、Ngramインデックスは、コード検索、カスタマーサポートエージェント、法律・医療文書検索、企業知識ベース、学術検索など、正確なキーワードマッチングが不可欠なリアルタイムシナリオに適している。</p>
<p>同時に、Ngram インデックスは慎重な設定によって恩恵を受ける。適切な<code translate="no">min_gram</code> 、<code translate="no">max_gram</code> 値を選択することは、インデックスサイズとクエリパフォーマンスのバランスをとる上で非常に重要である。実際のクエリーパターンを反映するようにチューニングすれば、Ngram Indexは、本番システムにおけるハイパフォーマンスな<code translate="no">LIKE</code> クエリーのための、実用的でスケーラブルなソリューションを提供します。</p>
<p>Ngram Indexの詳細については、以下のドキュメントを参照して下さい：</p>
<ul>
<li><a href="https://milvus.io/docs/ngram.md">Ngram Index｜Milvusドキュメント</a></li>
</ul>
<p>Milvusの最新機能に関するご質問やディープダイブをご希望ですか？私たちの<a href="https://discord.com/invite/8uyFbECzPX"> Discordチャンネルに</a>参加するか、<a href="https://github.com/milvus-io/milvus"> GitHubに</a>課題を提出してください。また、<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvusオフィスアワーを通して</a>、20分間の1対1のセッションを予約し、洞察やガイダンス、質問への回答を得ることもできます。</p>
<h2 id="Learn-More-about-Milvus-26-Features" class="common-anchor-header">Milvus 2.6の機能についてもっと知る<button data-href="#Learn-More-about-Milvus-26-Features" class="anchor-icon" translate="no">
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
<li><p><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md">Milvus 2.6のご紹介: 10億スケールの手頃な価格のベクトル検索</a></p></li>
<li><p><a href="https://milvus.io/blog/data-in-and-data-out-in-milvus-2-6.md">エンベッディング機能のご紹介Milvus 2.6によるベクトル化とセマンティック検索の効率化</a></p></li>
<li><p><a href="https://milvus.io/blog/json-shredding-in-milvus-faster-json-filtering-with-flexibility.md">MilvusのJSONシュレッダー: 88.9倍高速なJSONフィルタリングと柔軟性</a></p></li>
<li><p><a href="https://milvus.io/blog/unlocking-true-entity-level-retrieval-new-array-of-structs-and-max-sim-capabilities-in-milvus.md">真のエンティティレベルの検索：Milvusの新しいArray-of-StructsとMAX_SIM機能</a></p></li>
<li><p><a href="https://milvus.io/blog/unlock-geo-vector-search-with-geometry-fields-and-rtree-index-in-milvus.md">Milvus 2.6におけるジオメトリフィールドとRTREEによる地理空間フィルタリングとベクトル検索の統合</a></p></li>
<li><p><a href="https://milvus.io/blog/introducing-aisaq-in-milvus-billion-scale-vector-search-got-3200-cheaper-on-memory.md">MilvusにおけるAISAQの導入: 10億スケールのベクトル検索がメモリ上で3,200倍安くなった</a></p></li>
<li><p><a href="https://milvus.io/blog/faster-index-builds-and-scalable-queries-with-gpu-cagra-in-milvus.md">MilvusにおけるNVIDIA CAGRAの最適化：GPUとCPUのハイブリッドアプローチによるインデックス作成の高速化とクエリの低コスト化</a></p></li>
<li><p><a href="https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md">MilvusにおけるMinHash LSH：LLMトレーニングデータの重複と戦うための秘密兵器 </a></p></li>
<li><p><a href="https://milvus.io/blog/bring-vector-compression-to-the-extreme-how-milvus-serves-3%C3%97-more-queries-with-rabitq.md">ベクトル圧縮を極限まで高める：MilvusがRaBitQで3倍以上のクエリに対応する方法</a></p></li>
<li><p><a href="https://milvus.io/blog/benchmarks-lie-vector-dbs-deserve-a-real-test.md">ベンチマークは嘘をつく - ベクトルDBは真のテストに値する </a></p></li>
<li><p><a href="https://milvus.io/blog/we-replaced-kafka-pulsar-with-a-woodpecker-for-milvus.md">MilvusのためにKafka/PulsarをWoodpeckerに置き換えた </a></p></li>
</ul>
