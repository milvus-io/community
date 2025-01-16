---
id: understanding-consistency-levels-in-the-milvus-vector-database-2.md
title: Milvusベクターデータベースの一貫性レベルを理解する - 後編
author: Jiquan Long
date: 2022-09-13T00:00:00.000Z
desc: Milvusベクトルデータベースにおける調整可能な一貫性レベルの背後にあるメカニズムの解剖。
cover: assets.zilliz.com/1280_X1280_0e0d4bc107.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_0e0d4bc107.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>表紙画像</span> </span></p>
<blockquote>
<p>この記事は<a href="https://github.com/longjiquan">Jiquan Longが</a>執筆し、<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Niが</a>翻訳したものです。</p>
</blockquote>
<p><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">前回の</a>一貫性に関する<a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">ブログでは</a>、分散ベクトルデータベースにおける一貫性とは何かを説明し、Milvusベクトルデータベースでサポートされている4つの一貫性レベル（strong、bounded staleness、session、eventual）を取り上げ、それぞれの一貫性レベルに最適なアプリケーションシナリオを説明しました。</p>
<p>今回の投稿では、Milvusベクトルデータベースのユーザが様々なアプリケーションシナリオに対して理想的な一貫性レベルを柔軟に選択することを可能にする背後にあるメカニズムについて引き続き考察します。また、Milvusベクトルデータベースの一貫性レベルを調整する方法についての基本的なチュートリアルも提供します。</p>
<p><strong>ジャンプ</strong></p>
<ul>
<li><a href="#The-underlying-time-tick-mechanism">基礎となる時間刻みメカニズム</a></li>
<li><a href="#Guarantee-timestamp">タイムスタンプの保証</a></li>
<li><a href="#Consistency-levels">一貫性レベル</a></li>
<li><a href="#How-to-tune-consistency-level-in-Milvus">Milvusで一貫性レベルを調整するには？</a></li>
</ul>
<h2 id="The-underlying-time-tick-mechanism" class="common-anchor-header">基礎となるタイムティック機構<button data-href="#The-underlying-time-tick-mechanism" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusでは、ベクトル検索やクエリを実行する際に、タイムティックメカニズムを使用して様々なレベルの一貫性を保証しています。タイムティックはMilvusの透かしであり、Milvusの時計のような役割を果たし、Milvusシステムがどの時点にあるかを示します。Milvusベクトルデータベースにデータ操作言語(DML)リクエストが送信されると、そのリクエストにタイムスタンプが割り当てられます。下図に示すように、例えば新しいデータがメッセージキューに挿入されると、Milvusは挿入されたデータにタイムスタンプを付けるだけでなく、一定の間隔でタイムティックを挿入します。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/timetick_b395df9804.png" alt="timetick" class="doc-image" id="timetick" />
   </span> <span class="img-wrapper"> <span>タイムティック</span> </span></p>
<p>上図の<code translate="no">syncTs1</code> 。クエリ・ノードのようなダウンストリームのコンシューマーが<code translate="no">syncTs1</code> を見ると、コンシューマー・コンポーネントは、<code translate="no">syncTs1</code> より前に挿入されたすべてのデータが消費されたことを理解する。言い換えると、タイムスタンプ値が<code translate="no">syncTs1</code> より小さいデータ挿入リクエストは、メッセージキューに表示されなくなる。</p>
<h2 id="Guarantee-Timestamp" class="common-anchor-header">タイムスタンプの保証<button data-href="#Guarantee-Timestamp" class="anchor-icon" translate="no">
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
    </button></h2><p>前のセクションで述べたように、クエリーノードのような下流のコンシューマーコンポーネントは、メッセージキューからデータ挿入要求とタイムティックのメッセージを継続的に取得します。タイム・ティックが消費されるたびに、クエリ・ノードはこの消費されたタイム・ティックをサービス可能時間としてマークする。<code translate="no">ServiceTime</code> 、<code translate="no">ServiceTime</code> より前に挿入されたすべてのデータがクエリ・ノードから見えるようになる。</p>
<p>また、Milvusでは、<code translate="no">ServiceTime</code> に加え、保証タイムスタンプ(<code translate="no">GuaranteeTS</code>)というタイムスタンプも採用しており、様々なユーザーによる様々なレベルの一貫性と可用性のニーズを満たしています。つまり、Milvusベクトルデータベースのユーザは、検索やクエリを実行する際に、<code translate="no">GuaranteeTs</code> 以前の全てのデータが表示され、関与していることをクエリノードに通知するために、<code translate="no">GuaranteeTs</code> を指定することができる。</p>
<p>Milvusベクトルデータベースで検索ノードが検索要求を実行する場合、通常2つのシナリオがある。</p>
<h3 id="Scenario-1-Execute-search-request-immediately" class="common-anchor-header">シナリオ1：検索要求を即座に実行する</h3><p>下図に示すように、<code translate="no">GuaranteeTs</code> が<code translate="no">ServiceTime</code> よりも小さい場合、クエリ・ノードは検索要求を直ちに実行することができる。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/execute_immediately_dd1913775d.png" alt="execute_immediately" class="doc-image" id="execute_immediately" />
   </span> <span class="img-wrapper"> <span>実行_即時</span> </span></p>
<h3 id="Scenario-2-Wait-till-ServiceTime--GuaranteeTs" class="common-anchor-header">シナリオ2："ServiceTime &gt; GuaranteeTs "まで待つ。</h3><p><code translate="no">GuaranteeTs</code> が<code translate="no">ServiceTime</code> より大きい場合、クエリ・ノードはメッセージ・ キューからタイム・ティックを消費し続けなければならない。<code translate="no">ServiceTime</code> が<code translate="no">GuaranteeTs</code> より大きくなるまで、検索リクエストは実行できない。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/wait_search_f09a2f6cf9.png" alt="wait_search" class="doc-image" id="wait_search" />
   </span> <span class="img-wrapper"> <span>wait_search</span> </span></p>
<h2 id="Consistency-Levels" class="common-anchor-header">一貫性レベル<button data-href="#Consistency-Levels" class="anchor-icon" translate="no">
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
    </button></h2><p>したがって、<code translate="no">GuaranteeTs</code> は、指定した一貫性レベルを達成するために、検索リクエストで設定可能です。大きな値を持つ<code translate="no">GuaranteeTs</code> は、高い検索レイテンシを犠牲にして、<a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md#Strong">強力な一貫性を</a>保証します。また、<code translate="no">GuaranteeTs</code> の値を小さくすると、検索待ち時間は短縮されますが、データの可視性は損なわれます。</p>
<p><code translate="no">GuaranteeTs</code> Milvusはハイブリッドタイムスタンプフォーマットです。そして、ユーザーはMilvus内部の<a href="https://github.com/milvus-io/milvus/blob/master/docs/design_docs/20211214-milvus_hybrid_ts.md">TSOを</a>知らない。従って、 の値を指定することは、ユーザーにとってあまりにも複雑な作業である。ユーザーの手間を省き、最適なユーザーエクスペリエンスを提供するために、Milvusはユーザーが特定の一貫性レベルを選択するだけで、Milvusベクトルデータベースが自動的に 。つまり、Milvusユーザは4つの整合性レベルから選択するだけでよい： , , .そして、それぞれの整合性レベルは、ある 値に対応している。<code translate="no">GuaranteeTs</code> <code translate="no">GuaranteeTs</code> <code translate="no">Strong</code> <code translate="no">Bounded</code> <code translate="no">Session</code> <code translate="no">Eventually</code> <code translate="no">GuaranteeTs</code> </p>
<p>下図は、Milvusベクトル・データベースにおける4つの一貫性レベルのそれぞれについて、<code translate="no">GuaranteeTs</code> 。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/guarantee_ts_f4b3e119d3.png" alt="guarantee_ts" class="doc-image" id="guarantee_ts" />
   </span> <span class="img-wrapper"> <span>ギャランティー</span> </span></p>
<p>Milvusベクトル・データベースは4つの整合性レベルをサポートしています：</p>
<ul>
<li><p><code translate="no">CONSISTENCY_STRONG</code> <code translate="no">GuaranteeTs</code> は最新のシステム・タイムスタンプと同じ値に設定され、クエリ・ノードはサービス時間が最新のシステム・タイムスタンプに進むまで、検索またはクエリ要求を処理するのを待ちます。</p></li>
<li><p><code translate="no">CONSISTENCY_EVENTUALLY</code>:<code translate="no">GuaranteeTs</code> は、一貫性チェックをスキップするために、最新のシステム・タイムスタンプよりも有意に小さい値に設定される。クエリ・ノードは既存のデータ・ビューを即座に検索します。</p></li>
<li><p><code translate="no">CONSISTENCY_BOUNDED</code>:<code translate="no">GuaranteeTs</code> は最新のシステム・タイムスタンプよりも比較的小さい値に設定され、クエリ・ノードは許容範囲内で更新されたデータ・ビューを検索する。</p></li>
<li><p><code translate="no">CONSISTENCY_SESSION</code>:クライアントは最後の書き込み操作のタイムスタンプを<code translate="no">GuaranteeTs</code> として使用し、各クライアントが少なくとも自分自身で挿入されたデータを取得できるようにする。</p></li>
</ul>
<h2 id="How-to-tune-consistency-level-in-Milvus" class="common-anchor-header">Milvusで一貫性レベルを調整するには？<button data-href="#How-to-tune-consistency-level-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusは<a href="https://milvus.io/docs/v2.1.x/create_collection.md">コレクション作成</a>時、<a href="https://milvus.io/docs/v2.1.x/search.md">検索</a>時、<a href="https://milvus.io/docs/v2.1.x/query.md">クエリ</a>時の一貫性レベルのチューニングをサポートしています。</p>
<h3 id="Conduct-a-vector-similarity-search" class="common-anchor-header">ベクトル類似検索の実行</h3><p>希望する一貫性レベルでベクトル類似性検索を行うには、パラメータ<code translate="no">consistency_level</code> の値を<code translate="no">Strong</code>,<code translate="no">Bounded</code>,<code translate="no">Session</code>,<code translate="no">Eventually</code> のいずれかに設定するだけです。パラメータ<code translate="no">consistency_level</code> の値を設定しない場合、一貫性レベルはデフォルトで<code translate="no">Bounded</code> になります。この例では、<code translate="no">Strong</code> の一貫性でベクトル類似性検索を実行します。</p>
<pre><code translate="no">results = collection.search(
        data=[[0.1, 0.2]], 
        anns_field=<span class="hljs-string">&quot;book_intro&quot;</span>, 
        param=search_params, 
        <span class="hljs-built_in">limit</span>=10, 
        <span class="hljs-built_in">expr</span>=None,
        consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Conduct-a-vector-query" class="common-anchor-header">ベクトル・クエリの実行</h3><p>ベクトル類似検索の実行と同様に、ベクトル検索を実行するときに、パラメータ<code translate="no">consistency_level</code> の値を指定できます。この例では、<code translate="no">Strong</code> の一貫性でベクトル検索を行います。</p>
<pre><code translate="no">res = collection.query(
  <span class="hljs-built_in">expr</span> = <span class="hljs-string">&quot;book_id in [2,4,6,8]&quot;</span>, 
  output_fields = [<span class="hljs-string">&quot;book_id&quot;</span>, <span class="hljs-string">&quot;book_intro&quot;</span>],
  consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>
)
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
    </button></h2><p>Milvus 2.1の正式リリースに伴い、新機能を紹介するブログシリーズを用意しました。このブログシリーズの続きを読む：</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">類似検索アプリケーションを強化する文字列データの使い方</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">組み込みMilvusを使用したPythonによるMilvusのインストールと実行</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">インメモリレプリカによるベクターデータベースの読み取りスループットの向上</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Milvusベクターデータベースの一貫性レベルを理解する</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Milvusベクタデータベースのコンシステンシーレベルを理解する(後編)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Milvus Vector Databaseはどのようにデータのセキュリティを確保しているのか？</a></li>
</ul>
