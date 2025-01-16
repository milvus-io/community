---
id: understanding-consistency-levels-in-the-milvus-vector-database.md
title: Milvusベクターデータベースの一貫性レベルの理解
author: Chenglong Li
date: 2022-08-29T00:00:00.000Z
desc: >-
  Milvusベクトルデータベースでサポートされている4つの整合性レベル（strong、bounded
  staleness、session、eventual）について学ぶ。
cover: assets.zilliz.com/1280_X1280_0e0d4bc107.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: >-
  https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1280_X1280_0e0d4bc107.png" alt="Cover_image" class="doc-image" id="cover_image" />
   </span> <span class="img-wrapper"> <span>表紙画像</span> </span></p>
<blockquote>
<p>この記事は<a href="https://github.com/JackLCL">Chenglong Liによって</a>書かれ、<a href="https://www.linkedin.com/in/yiyun-n-2aa713163/">Angela Niによって</a>翻訳されました。</p>
</blockquote>
<p>Mlivusのベクターデータベースから削除したデータが検索結果に表示されることがあるのを不思議に思ったことはありませんか？</p>
<p>それは、アプリケーションに適切な一貫性レベルを設定していないからです。分散ベクターデータベースの一貫性レベルは、特定のデータの書き込みがどの時点でシステムによって読み取られるかを決定するため、非常に重要です。</p>
<p>そこで、この記事では一貫性の概念を解明し、Milvusベクトルデータベースがサポートする一貫性のレベルについて掘り下げていきます。</p>
<p><strong>ジャンプ</strong></p>
<ul>
<li><a href="#What-is-consistency">一貫性とは</a></li>
<li><a href="#Four-levels-of-consistency-in-the-Milvus-vector-database">Milvusベクトル・データベースにおける4つの一貫性レベル</a><ul>
<li><a href="#Strong">強い</a></li>
<li><a href="#Bounded-staleness">陳腐化</a></li>
<li><a href="#Session">セッション</a></li>
<li><a href="#Eventual">最終的</a></li>
</ul></li>
</ul>
<h2 id="What-is-consistency" class="common-anchor-header">一貫性とは何か<button data-href="#What-is-consistency" class="anchor-icon" translate="no">
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
    </button></h2><p>一貫性 "という言葉はコンピューティング業界では使い古された言葉なので、この記事を始める前にまず一貫性の意味合いを明確にする必要があります。分散データベースにおける一貫性とは、特に、ある時点でデータを書き込んだり読み込んだりする際に、すべてのノードやレプリカが同じデータビューを持つことを保証する性質を指します。したがって、ここでは<a href="https://en.wikipedia.org/wiki/CAP_theorem">CAPの定理で</a>いう一貫性について話している。</p>
<p>現代の世界では、大規模なオンラインビジネスに対応するため、複数のレプリカが一般的に採用されている。例えば、オンライン電子商取引大手のアマゾンは、システム・クラッシュや障害発生時にシステムの高い可用性を確保するために、複数のデータ・センター、ゾーン、あるいは国にまたがって注文やSKUデータを複製している。このため、システムには複数のレプリカ間でのデータの一貫性という課題が生じる。一貫性がないと、アマゾンのカートで削除された商品が再び表示される可能性が非常に高く、非常に悪いユーザー体験を引き起こします。</p>
<p>したがって、アプリケーションごとに異なるデータ一貫性レベルが必要になる。そして幸運なことに、AIのためのデータベースであるMilvusは、一貫性レベルに柔軟性を提供しており、あなたのアプリケーションに最適な一貫性レベルを設定することができます。</p>
<h3 id="Consistency-in-the-Milvus-vector-database" class="common-anchor-header">Milvusベクトル・データベースにおける一貫性</h3><p>整合性レベルの概念は、Milvus 2.0のリリースで初めて導入されました。Milvusの1.0バージョンは分散ベクタデータベースではなかったため、一貫性のレベルを調整することはできませんでした。Milvus1.0は毎秒データをフラッシュしていたため、新しいデータが挿入されるとほぼ即座に表示され、Milvusはベクトルの類似性検索やクエリ要求が来た時点で最新のデータビューを読み込む。</p>
<p>しかし、Milvusは2.0バージョンでリファクタリングされ、<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus 2.0は</a>pub-subメカニズムに基づく<a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">分散ベクトルデータベースである</a>。<a href="https://en.wikipedia.org/wiki/PACELC_theorem">PACELCの</a>定理は、分散システムは一貫性、可用性、待ち時間の間でトレードオフしなければならないことを指摘している。さらに、異なる一貫性レベルは異なるシナリオに対応する。そのため、<a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">Milvus 2.0では</a>一貫性の概念が導入され、一貫性のレベルを調整できるようになった。</p>
<h2 id="Four-levels-of-consistency-in-the-Milvus-vector-database" class="common-anchor-header">Milvusベクトルデータベースの4つの一貫性レベル<button data-href="#Four-levels-of-consistency-in-the-Milvus-vector-database" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusは、strong、bounded staleness、session、eventualの4つの一貫性レベルをサポートしています。そして、Milvusのユーザは、<a href="https://milvus.io/docs/v2.1.x/create_collection.md">コレクションを作成する</a>とき、または<a href="https://milvus.io/docs/v2.1.x/search.md">ベクトル類似検索や</a> <a href="https://milvus.io/docs/v2.1.x/query.md">クエリを</a>行うときに、一貫性レベルを指定することができます。このセクションでは、これら4つの一貫性レベルがどのように異なり、どのシナリオに最適であるかを説明します。</p>
<h3 id="Strong" class="common-anchor-header">強い</h3><p>Strongは最も高く、最も厳格な一貫性レベルです。ユーザが最新バージョンのデータを読めるようにします。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Strong_5d791eb8b2.png" alt="Strong" class="doc-image" id="strong" />
   </span> <span class="img-wrapper"> <span>強い</span> </span></p>
<p>PACELCの定理によると、一貫性レベルをStrongに設定すると、待ち時間が長くなります。したがって、テスト結果の正確性を保証するために、機能テストでは強い一貫性を選択することを推奨します。また、強い一貫性は、検索速度を犠牲にしてデータの一貫性を厳しく要求するアプリケーションにも最適です。例えば、注文の支払いや請求書を扱うオンライン金融システムなどが挙げられます。</p>
<h3 id="Bounded-staleness" class="common-anchor-header">境界的陳腐性</h3><p>Bounded stalenessは、その名が示すように、ある一定期間のデータの一貫性のなさを許容する。しかし一般的には、その期間外ではデータは常にグローバルに一貫している。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Bounded_c034bc6e51.png" alt="Bounded_staleness" class="doc-image" id="bounded_staleness" />
   </span> <span class="img-wrapper"> <span>Bounded_staleness</span> </span></p>
<p>Bounded_stalenessは、検索レイテンシを制御する必要があり、散発的なデータの不可視性を許容できるシナリオに適している。例えば、ビデオ推薦エンジンのような推薦システムでは、たまにデータが見えなくなることは、全体的な想起率に与える影響は本当に小さいですが、推薦システムのパフォーマンスを大幅に向上させることができます。例としては、オンライン注文のステータスを追跡するアプリがある。</p>
<h3 id="Session" class="common-anchor-header">セッション</h3><p>セッションは、すべてのデータの書き込みが、同じセッション中の読み込みで即座に認識できることを保証します。言い換えれば、あるクライアントを介してデータを書き込むと、新しく挿入されたデータは即座に検索可能になります。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Session_6dc4782212.png" alt="Session" class="doc-image" id="session" />
   </span> <span class="img-wrapper"> <span>セッション</span> </span></p>
<p>同一セッション内でのデータの一貫性の要求が高いシナリオでは、一貫性レベルとしてセッションを選択することをお勧めします。例えば、図書館システムから本のエントリーのデータを削除し、削除を確認してページを更新（別のセッション）すると、その本は検索結果に表示されなくなります。</p>
<h3 id="Eventual" class="common-anchor-header">最終的な</h3><p>読み込みと書き込みの順序は保証されておらず、書き込み操作が行われない限り、レプリカは最終的に同じ状態に収束します。偶発的一貫性の下では、レプリカは最新の更新された値で読み取り要求の処理を開始する。最終的一貫性は、4つの中で最も弱いレベルである。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Consistency_Eventual_7c66dd5b6f.png" alt="Eventual" class="doc-image" id="eventual" />
   </span> <span class="img-wrapper"> <span>最終的一貫性</span> </span></p>
<p>しかし、PACELCの定理によれば、一貫性を犠牲にすることで、検索レイテンシを大幅に短縮することができる。従って、偶発的一貫性は、データの一貫性に対する要求は高くないが、高速な検索性能が要求されるシナリオに最適である。例えば、アマゾンの商品のレビューや評価を偶発的一貫性で検索するような場合である。</p>
<h2 id="Endnote" class="common-anchor-header">おわりに<button data-href="#Endnote" class="anchor-icon" translate="no">
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
    </button></h2><p>冒頭の質問に戻りますが、削除されたデータが検索結果として返されるのは、ユーザーが適切な一貫性レベルを選択していないためです。milvusベクトル・データベースでは、一貫性レベルのデフォルト値はbounded staleness (<code translate="no">Bounded</code>)である。そのため、データの読み込みが遅れ、類似検索やクエリー中に削除操作を行う前にMilvusがデータビューを読み込んでしまうことがあります。しかし、この問題は簡単に解決できます。コレクションを作成するとき、またはベクトル類似検索やクエリを実行するときに<a href="https://milvus.io/docs/v2.1.x/tune_consistency.md">一貫性レベルを調整</a>するだけです。簡単です！</p>
<p>次回は、Milvusベクトルデータベースがどのようにして様々な一貫性レベルを実現しているのか、そのメカニズムを明らかにし、解説します。ご期待ください！</p>
<h2 id="Whats-next" class="common-anchor-header">次の記事<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">類似検索アプリケーションを強化する文字列データの使い方</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">組み込みMilvusを使用したPythonによるMilvusのインストールと実行</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">インメモリレプリカによるベクターデータベースの読み取りスループットの向上</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Milvusベクトルデータベースの一貫性レベルを理解する</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Milvusベクタデータベースのコンシステンシーレベルを理解する(後編)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">Milvus Vector Databaseはどのようにデータのセキュリティを確保しているのか？</a></li>
</ul>
