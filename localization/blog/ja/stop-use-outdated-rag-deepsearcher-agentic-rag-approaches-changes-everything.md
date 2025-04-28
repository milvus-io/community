---
id: >-
  stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md
title: バニラRAGの構築はもうやめよう：DeepSearcherによるエージェントRAGの採用
author: Cheney Zhang
date: 2025-03-23T00:00:00.000Z
cover: >-
  assets.zilliz.com/Stop_Using_Outdated_RAG_Deep_Searcher_s_Agentic_RAG_Approach_Changes_Everything_b2eaa644cf.png
tag: Engineering
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/stop-use-outdated-rag-deepsearcher-agentic-rag-approaches-changes-everything.md
---
<h2 id="The-Shift-to-AI-Powered-Search-with-LLMs-and-Deep-Research" class="common-anchor-header">LLMとディープリサーチによるAI検索へのシフト<button data-href="#The-Shift-to-AI-Powered-Search-with-LLMs-and-Deep-Research" class="anchor-icon" translate="no">
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
    </button></h2><p>検索技術の進化は、2000年代以前のキーワードベースの検索から、2010年代のパーソナライズされた検索体験まで、数十年にわたって劇的に進歩してきた。我々は、詳細で専門的な分析を必要とする複雑なクエリを処理できるAIを搭載したソリューションの出現を目の当たりにしている。</p>
<p>OpenAIのDeep Researchは、このシフトを例証するもので、推論機能を使って大量の情報を合成し、複数段階の調査レポートを生成する。例えば、"テスラの妥当な時価総額は？"という質問に対して、Deep Research は企業の財務を包括的に分析することができる。ディープリサーチは、企業の財務、ビジネスの成長軌道、および市場価値の推定を包括的に分析することができます。</p>
<p>Deep Research は、そのコアに RAG (Retrieval-Augmented Generation) フレームワークの高度なフォームを実装しています。従来の RAG は、関連する外部情報を検索して組み込むことによって言語モデルの出力を強化します。OpenAIのアプローチは、反復的な検索と推論サイクルを実装することで、これをさらに進めている。単一の検索ステップの代わりに、Deep Research は動的に複数のクエリを生成し、中間結果を評価し、検索戦略を改良します。これは、高度なまたはエージェント型の RAG 技術が、単純な質問応答よりも専門的な研究のように感じられる、高品質でエンタープライズレベルのコンテンツを提供できることを示しています。</p>
<h2 id="DeepSearcher-A-Local-Deep-Research-Bringing-Agentic-RAG-to-Everyone" class="common-anchor-header">DeepSearcher：エージェント型RAGを誰にでも提供するローカル・ディープ・リサーチ<button data-href="#DeepSearcher-A-Local-Deep-Research-Bringing-Agentic-RAG-to-Everyone" class="anchor-icon" translate="no">
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
    </button></h2><p>これらの進歩に触発され、世界中の開発者が独自の実装を作成しています。Zillizのエンジニアは、ローカルでオープンソースのDeep Researchとも言える<a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>プロジェクトを構築し、オープンソース化しました。このプロジェクトは、1カ月足らずで4,900以上のGitHubスターを集めた。</p>
<p>DeepSearcherは、高度な推論モデル、洗練された検索機能、統合されたリサーチ・アシスタントの力を組み合わせることで、AIを活用したエンタープライズ検索を再定義する。<a href="https://milvus.io/docs/overview.md">Milvus</a>（高性能でオープンソースのベクトル・データベース）を介してローカル・データを統合することで、DeepSearcherはより高速で関連性の高い検索結果を提供すると同時に、ユーザーがカスタマイズされたエクスペリエンスのためにコア・モデルを簡単に交換できるようにします。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_1_Deep_Searcher_s_star_history_9c1a064ed8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図1：</em> <em>DeepSearcherの星の歴史（</em><em>出典）</em></p>
<p>この記事では、従来のRAGからAgentic RAGへの進化を探求し、技術的なレベルでこれらのアプローチの違いを具体的に探ります。そして、DeepSearcherの実装について説明し、インテリジェントエージェントの機能を活用して、動的なマルチターン推論を実現する方法と、エンタープライズレベルの検索ソリューションを構築する開発者にとって、これが重要である理由を示します。</p>
<h2 id="From-Traditional-RAG-to-Agentic-RAG-The-Power-of-Iterative-Reasoning" class="common-anchor-header">従来のRAGからエージェント型RAGへ：反復推論のパワー<button data-href="#From-Traditional-RAG-to-Agentic-RAG-The-Power-of-Iterative-Reasoning" class="anchor-icon" translate="no">
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
    </button></h2><p>エージェント型RAGは、インテリジェントエージェントの機能を組み込むことで、従来のRAGフレームワークを強化します。DeepSearcherは、エージェント型RAGフレームワークの代表例です。動的計画、多段階推論、自律的意思決定を通じて、複雑な問題を解決するためにデータを検索、処理、検証、最適化する閉ループプロセスを確立する。</p>
<p>エージェント型RAGの人気が高まっているのは、大規模言語モデル（LLM）推論機能の著しい進歩、特に複雑な問題を分解し、複数のステップにわたって首尾一貫した思考の連鎖を維持する能力の向上によるものである。</p>
<table>
<thead>
<tr><th></th><th></th><th></th></tr>
</thead>
<tbody>
<tr><td><strong>比較次元</strong></td><td><strong>従来のRAG</strong></td><td><strong>エージェント型RAG</strong></td></tr>
<tr><td>コアアプローチ</td><td>受動的、反応的</td><td>プロアクティブ・エージェント主導型</td></tr>
<tr><td>プロセスの流れ</td><td>シングルステップの検索と生成（1回限りの処理）</td><td>動的な複数ステップの検索と生成（反復的な改良）</td></tr>
<tr><td>検索戦略</td><td>固定キーワード検索（最初のクエリに依存</td><td>適応検索（キーワードの絞り込み、データソースの切り替えなど）</td></tr>
<tr><td>複雑なクエリ処理</td><td>直接生成；矛盾するデータでエラーを起こしやすい</td><td>タスク分解 → ターゲット検索 → 答えの合成</td></tr>
<tr><td>対話能力</td><td>ユーザーの入力に完全に依存。</td><td>積極的な関与（例：あいまいな点を明確にする、詳細を要求する）</td></tr>
<tr><td>エラー訂正とフィードバック</td><td>自己修正なし。</td><td>反復的な検証→正確さのための自己トリガーによる再検索</td></tr>
<tr><td>理想的な使用例</td><td>簡単なQ&amp;A、事実の検索</td><td>複雑な推論、多段階の問題解決、オープンエンドタスク</td></tr>
<tr><td>例</td><td>ユーザーからの質問「量子コンピューティングとは何ですか？→ システムが教科書的な定義を返す</td><td>ユーザーからの質問"量子コンピューティングはどのように物流を最適化できるか？"→ 量子力学の原理とロジスティクスのアルゴリズムを検索し、実用的な洞察を合成する。</td></tr>
</tbody>
</table>
<p>単一のクエリベースの検索に依存する従来のRAGとは異なり、Agentic RAGは、クエリを複数のサブクエリに分解し、満足のいく答えに達するまで検索を反復する。この進化は3つの主な利点を提供する：</p>
<ul>
<li><p><strong>プロアクティブな問題解決：</strong>システムは受動的な反応から能動的な問題解決へと移行する。</p></li>
<li><p><strong>ダイナミックなマルチターン検索：</strong>一回限りの検索ではなく、システムは継続的にクエリを調整し、継続的なフィードバックに基づいて自己修正する。</p></li>
<li><p><strong>幅広い適用性：</strong>基本的なファクトチェックにとどまらず、複雑な推論タスクを処理し、包括的なレポートを生成します。</p></li>
</ul>
<p>これらの機能を活用することで、DeepSearcherのようなAgentic RAGアプリは、最終的な答えだけでなく、推論プロセスや実行の詳細の完全で透明性のある内訳も提供する、人間の専門家のように動作します。</p>
<p>長期的には、Agentic RAGはベースラインのRAGシステムを追い越すことになるだろう。従来のアプローチは、反復的な推論、内省、継続的な最適化を必要とするユーザクエリの基本的なロジックに対処するのに苦労することが多い。</p>
<h2 id="What-Does-an-Agentic-RAG-Architecture-Look-Like-DeepSearcher-as-an-Example" class="common-anchor-header">エージェント型RAGアーキテクチャとはどのようなものか？例としてのDeepSearcher<button data-href="#What-Does-an-Agentic-RAG-Architecture-Look-Like-DeepSearcher-as-an-Example" class="anchor-icon" translate="no">
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
    </button></h2><p>エージェント型RAGシステムのパワーを理解したところで、そのアーキテクチャはどのようなものだろうか。DeepSearcherを例にとって説明しよう。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_2_Two_Modules_Within_Deep_Searcher_baf5ca5952.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図2：DeepSearcher内の2つのモジュール</em></p>
<p>DeepSearcherのアーキテクチャは、主に2つのモジュールで構成されている：</p>
<h3 id="1-Data-Ingestion-Module" class="common-anchor-header">1.データ取り込みモジュール</h3><p>このモジュールは、Milvusベクターデータベースを介して、様々なサードパーティ独自のデータソースを接続する。独自のデータセットに依存している企業環境では特に有用です。このモジュールは以下の処理を行います：</p>
<ul>
<li><p>ドキュメントの解析とチャンキング</p></li>
<li><p>埋め込み生成</p></li>
<li><p>ベクトルの保存とインデックス作成</p></li>
<li><p>効率的な検索のためのメタデータ管理</p></li>
</ul>
<h3 id="2-Online-Reasoning-and-Query-Module" class="common-anchor-header">2.オンライン推論とクエリーモジュール</h3><p>このコンポーネントは、RAGフレームワーク内で多様なエージェント戦略を実装し、的確で洞察に満ちた応答を提供する。各データ検索後、システムは蓄積された情報が元のクエリに十分答えているかどうかを検討する。もしそうでなければ、別の反復が開始され、もしそうであれば、最終レポートが作成される。</p>
<p>この "フォローアップ "と "リフレクション "の継続的なサイクルは、他の基本的なRAGアプローチを根本的に改善するものである。従来のRAGが一発勝負の検索と生成プロセスを実行するのに対し、DeepSearcherの反復的アプローチは、人間の研究者がどのように作業するかを反映したものです。つまり、最初の質問を行い、受け取った情報を評価し、ギャップを特定し、新たな調査ラインを追求します。</p>
<h2 id="How-Effective-is-DeepSearcher-and-What-Use-Cases-is-It-Best-Suited-For" class="common-anchor-header">DeepSearcherの効果と最適な使用例<button data-href="#How-Effective-is-DeepSearcher-and-What-Use-Cases-is-It-Best-Suited-For" class="anchor-icon" translate="no">
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
    </button></h2><p>DeepSearcherをインストールして設定すると、Milvusベクトルデータベースを通じてローカルファイルのインデックスが作成されます。クエリを送信すると、インデックス化されたコンテンツを包括的かつ詳細に検索します。開発者にとっての主な利点は、システムが検索と推論プロセスのすべてのステップをログに記録し、どのように結論に至ったかを透明化することです。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_3_Accelerated_Playback_of_Deep_Searcher_Iteration_0c36baea2f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図3: DeepSearcher反復処理の高速再生</em></p>
<p>このアプローチは、従来のRAGよりも多くの計算リソースを消費しますが、複雑なクエリに対してより良い結果をもたらします。DeepSearcherが最も適している2つの具体的な使用例について説明します。</p>
<h3 id="1-Overview-Type-Queries" class="common-anchor-header">1.概要型クエリ</h3><p>概要タイプのクエリ (レポートの作成、ドキュメントの作成、傾向の要約など) は、簡単なトピックを提供しますが、網羅的で詳細な出力を必要とします。</p>
<p>たとえば、「The Simpsonsは時間の経過とともにどのように変化したか」というクエリを実行する場合、DeepSearcherは最初にサブクエリの初期セットを生成します：</p>
<pre><code translate="no">_Break down the original query <span class="hljs-keyword">into</span> <span class="hljs-keyword">new</span> sub queries: [_

_<span class="hljs-string">&#x27;How has the cultural impact and societal relevance of The Simpsons evolved from its debut to the present?&#x27;</span>,_

_<span class="hljs-string">&#x27;What changes in character development, humor, and storytelling styles have occurred across different seasons of The Simpsons?&#x27;</span>,_

_<span class="hljs-string">&#x27;How has the animation style and production technology of The Simpsons changed over time?&#x27;</span>,_

_<span class="hljs-string">&#x27;How have audience demographics, reception, and ratings of The Simpsons shifted throughout its run?&#x27;</span>]_
<button class="copy-code-btn"></button></code></pre>
<p>関連する情報を取得し、フィードバックを繰り返しながら検索を絞り込み、次のサブクエリーを生成する：</p>
<pre><code translate="no">_New search queries <span class="hljs-keyword">for</span> <span class="hljs-built_in">next</span> iteration: [_

_<span class="hljs-string">&quot;How have changes in The Simpsons&#x27; voice cast and production team influenced the show&#x27;s evolution over different seasons?&quot;</span>,_

_<span class="hljs-string">&quot;What role has The Simpsons&#x27; satire and social commentary played in its adaptation to contemporary issues across decades?&quot;</span>,_

_<span class="hljs-string">&#x27;How has The Simpsons addressed and incorporated shifts in media consumption, such as streaming services, into its distribution and content strategies?&#x27;</span>]_
<button class="copy-code-btn"></button></code></pre>
<p>各反復は、前の反復を基に構築され、最終的には、以下のようなセクションで構成された、主題の多面性をカバーする包括的なレポートに仕上がります：</p>
<pre><code translate="no">**<span class="hljs-title class_">Report</span>: <span class="hljs-title class_">The</span> <span class="hljs-title class_">Evolution</span> <span class="hljs-keyword">of</span> _The <span class="hljs-title class_">Simpsons</span>_ (<span class="hljs-number">1989</span>–<span class="hljs-title class_">Present</span>)**
**<span class="hljs-number">1.</span> <span class="hljs-title class_">Cultural</span> <span class="hljs-title class_">Impact</span> and <span class="hljs-title class_">Societal</span> <span class="hljs-title class_">Relevance</span>** 
_The <span class="hljs-title class_">Simpsons</span>_ debuted <span class="hljs-keyword">as</span> a subversive critique <span class="hljs-keyword">of</span> <span class="hljs-title class_">American</span> middle-<span class="hljs-keyword">class</span> <span class="hljs-title class_">life</span>, gaining notoriety <span class="hljs-keyword">for</span> its bold satire <span class="hljs-keyword">in</span> the 1990s. <span class="hljs-title class_">Initially</span> a countercultural phenomenon, it challenged norms <span class="hljs-keyword">with</span> episodes tackling religion, politics, and consumerism. <span class="hljs-title class_">Over</span> time, its cultural dominance waned <span class="hljs-keyword">as</span> competitors like _South <span class="hljs-title class_">Park</span>_ and _Family <span class="hljs-title class_">Guy</span>_ pushed boundaries further. <span class="hljs-title class_">By</span> the 2010s, the show transitioned <span class="hljs-keyword">from</span> trendsetter to nostalgic institution, balancing legacy appeal <span class="hljs-keyword">with</span> attempts to address modern issues like climate change and <span class="hljs-variable constant_">LGBTQ</span>+ rights, albeit <span class="hljs-keyword">with</span> less societal resonance.
**<span class="hljs-number">2.</span> <span class="hljs-title class_">Character</span> <span class="hljs-title class_">Development</span> and <span class="hljs-title class_">Storytelling</span> <span class="hljs-title class_">Shifts</span>** 
<span class="hljs-title class_">Early</span> seasons featured nuanced character <span class="hljs-title function_">arcs</span> (e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Lisa</span>’s activism, <span class="hljs-title class_">Marge</span>’s resilience), but later seasons saw <span class="hljs-string">&quot;Flanderization&quot;</span> (exaggerating traits, e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Homer</span>’s stupidity, <span class="hljs-title class_">Ned</span> <span class="hljs-title class_">Flanders</span>’ piety). <span class="hljs-title class_">Humor</span> evolved <span class="hljs-keyword">from</span> witty, character-driven satire to reliance on pop culture references and meta-humor. <span class="hljs-title class_">Serialized</span> storytelling <span class="hljs-keyword">in</span> early episodes gave way to episodic, gag-focused plots, often sacrificing emotional depth <span class="hljs-keyword">for</span> absurdity.
[...]
**<span class="hljs-number">12.</span> <span class="hljs-title class_">Merchandising</span> and <span class="hljs-title class_">Global</span> <span class="hljs-title class_">Reach</span>** 
<span class="hljs-title class_">The</span> 1990s merchandise <span class="hljs-title function_">boom</span> (action figures, _Simpsons_-themed cereals) faded, but the franchise persists via <span class="hljs-title function_">collaborations</span> (e.<span class="hljs-property">g</span>., _Fortnite_ skins, <span class="hljs-title class_">Lego</span> sets). <span class="hljs-title class_">International</span> adaptations include localized dubbing and culturally tailored <span class="hljs-title function_">episodes</span> (e.<span class="hljs-property">g</span>., <span class="hljs-title class_">Japanese</span> _Itchy &amp; <span class="hljs-title class_">Scratchy</span>_ variants).
**<span class="hljs-title class_">Conclusion</span>** 
_The <span class="hljs-title class_">Simpsons</span>_ evolved <span class="hljs-keyword">from</span> a radical satire to a television institution, navigating shifts <span class="hljs-keyword">in</span> technology, politics, and audience expectations. <span class="hljs-title class_">While</span> its golden-age brilliance remains unmatched, its adaptability—through streaming, updated humor, and <span class="hljs-variable language_">global</span> outreach—secures its place <span class="hljs-keyword">as</span> a cultural touchstone. <span class="hljs-title class_">The</span> show’s longevity reflects both nostalgia and a pragmatic embrace <span class="hljs-keyword">of</span> change, even <span class="hljs-keyword">as</span> it grapples <span class="hljs-keyword">with</span> the challenges <span class="hljs-keyword">of</span> relevance <span class="hljs-keyword">in</span> a fragmented media landscape.
<button class="copy-code-btn"></button></code></pre>
<p><em>(簡潔にするため、プロセスと最終レポートの抜粋のみを示す）</em></p>
<p>最終報告書は、適切な引用と構造化された構成で、徹底的な分析を提供する。</p>
<h3 id="2-Complex-Reasoning-Queries" class="common-anchor-header">2.複雑な推論クエリー</h3><p>複雑なクエリには、何層ものロジックと相互接続されたエンティティが含まれます。</p>
<p>次のクエリを考えてみよう："God's Gift To Women "と "Aldri annet enn bråk "では、どちらが監督の年齢が高いか？</p>
<p>これは人間にとっては簡単なことに思えるかもしれないが、単純なRAGシステムでは、答えが知識ベースに直接保存されていないため、苦戦を強いられる。DeepSearcherは、クエリをより小さなサブクエスチョンに分解することで、この課題に取り組んでいる：</p>
<pre><code translate="no">[<span class="hljs-string">&quot;Who is the director of God&#x27;S Gift To Women?&quot;</span>, <span class="hljs-string">&#x27;Who is the director of Aldri annet enn bråk?&#x27;</span>, <span class="hljs-string">&#x27;What are the ages of the respective directors?&#x27;</span>, <span class="hljs-string">&#x27;Which director is older?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>まず、両映画の監督に関する情報を検索します、</p>
<pre><code translate="no">The director of <span class="hljs-string">&quot;God&#x27;s Gift To Women&quot;</span> <span class="hljs-keyword">is</span> Michael Curtiz, the director of <span class="hljs-string">&quot;Aldri annet enn bråk&quot;</span> <span class="hljs-keyword">is</span> Edith Carlmar
<button class="copy-code-btn"></button></code></pre>
<p>次にサブクエリを生成します：</p>
<pre><code translate="no">[<span class="hljs-string">&quot;Find the birthdate of Michael Curtiz, the director of God&#x27;s Gift To Women&quot;</span>, <span class="hljs-string">&#x27;Find the birthdate of Edith Carlmar, the director of Aldri annet enn bråk&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>まず両映画の監督に関する情報を取得し、次にサブクエリを生成し、次に両監督の生年月日を抽出し、最後にそれらを比較して正解を決定する：</p>
<pre><code translate="no">The director of <span class="hljs-string">&quot;God&#x27;s Gift To Women&quot;</span> <span class="hljs-keyword">is</span> Michael Curtiz, who was born <span class="hljs-keyword">on</span> December <span class="hljs-number">24</span>, <span class="hljs-number">1886</span> <span class="hljs-keyword">and</span> passed away <span class="hljs-keyword">on</span> April <span class="hljs-number">11</span>, <span class="hljs-number">1962.</span> He was a Hungarian-born American film director known <span class="hljs-keyword">for</span> his prolific career <span class="hljs-keyword">in</span> Hollywood.
On the other hand, the director of <span class="hljs-string">&quot;Aldri annet enn bråk&quot;</span> <span class="hljs-keyword">is</span> Edith Carlmar, who was born <span class="hljs-keyword">on</span> November <span class="hljs-number">15</span>, <span class="hljs-number">1911</span> <span class="hljs-keyword">and</span> passed away <span class="hljs-keyword">on</span> May <span class="hljs-number">17</span>, <span class="hljs-number">2003.</span>
Therefore, Michael Curtiz <span class="hljs-keyword">is</span> older than Edith Carlmar.
<button class="copy-code-btn"></button></code></pre>
<p>対照的に、従来のRAGシステムでは、1回の検索に限界があるため、重要な詳細を見逃す可能性があり、その結果、<a href="https://zilliz.com/blog/decoding-llm-hallucinations-deep-dive-into-llm-errors">幻覚や</a>不正確な回答が生じる可能性があります：</p>
<pre><code translate="no"><span class="hljs-number">1.</span> **Aldri annet enn bråk** (<span class="hljs-number">1954</span>) <span class="hljs-keyword">is</span> directed <span class="hljs-keyword">by</span> **Edith Carlmar**, who was born <span class="hljs-keyword">on</span> November <span class="hljs-number">15</span>, <span class="hljs-number">1911.</span>
<span class="hljs-number">2.</span> The related chunks did <span class="hljs-keyword">not</span> provide specific details about the director of <span class="hljs-string">&quot;God&#x27;s Gift to Women.&quot;</span> However, <span class="hljs-keyword">if</span> we look at external sources <span class="hljs-keyword">for</span> <span class="hljs-string">&quot;God&#x27;s Gift to Women,&quot;</span> the film was directed <span class="hljs-keyword">by</span> **L. M. (Lyman) Steinberg**, who was born <span class="hljs-keyword">on</span> December <span class="hljs-number">19</span>, <span class="hljs-number">1905.</span>
By comparing their birth dates:
- Edith Carlmar: November <span class="hljs-number">15</span>, <span class="hljs-number">1911</span>
- L. M. Steinberg: December <span class="hljs-number">19</span>, <span class="hljs-number">1905</span>
**Conclusion**: L. M. Steinberg, the director of <span class="hljs-string">&quot;God&#x27;s Gift to Women,&quot;</span> <span class="hljs-keyword">is</span> older than Edith Carlmar, the director of <span class="hljs-string">&quot;Aldri annet enn bråk.&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>DeepSearcherは、インポートされたローカルデータに対して深く反復的な検索を実行することで、際立った存在となっている。DeepSearcherは、インポートされたローカルデータに対して深い検索を繰り返し実行することで、推論プロセスの各ステップをログに記録し、最終的に包括的で統一されたレポートを提供します。このため、詳細レポートの作成や傾向の要約など、概要タイプのクエリや、質問をより小さなサブクエスチに分解し、複数のフィードバックループを通じてデータを集約する必要がある複雑な推論クエリに特に効果的です。</p>
<p>次のセクションでは、DeepSearcherを他のRAGシステムと比較し、その反復的なアプローチと柔軟なモデル統合が従来の手法と比較してどのように優れているかを探ります。</p>
<h2 id="Quantitative-Comparison-DeepSearcher-vs-Traditional-RAG" class="common-anchor-header">定量的比較：DeepSearcher と従来の RAG の比較<button data-href="#Quantitative-Comparison-DeepSearcher-vs-Traditional-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>DeepSearcher の GitHub リポジトリでは、定量テスト用のコードを公開しています。この分析では、人気のある2WikiMultiHopQAデータセットを使用しました。(注：APIトークンの消費を管理するため、最初の50エントリのみを評価しましたが、全体的な傾向は明らかです)</p>
<h3 id="Recall-Rate-Comparison" class="common-anchor-header">再現率の比較</h3><p>図4に示すように、最大反復数が増加するにつれて、想起率は大幅に改善する：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_4_Max_Iterations_vs_Recall_18a8d6e9bf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図4：最大反復回数と再現率の比較</em></p>
<p>あるポイントを超えると、限界的な改善は先細りになるため、通常デフォルトを3反復に設定するが、これは特定のニーズに基づいて調整することができる。</p>
<h3 id="Token-Consumption-Analysis" class="common-anchor-header">トークン消費分析</h3><p>また、異なる反復回数における50のクエリーのトークン使用量も測定しました：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_5_Max_Iterations_vs_Token_Usage_6d1d44b114.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図5：最大反復回数とトークン使用量</em></p>
<p>この結果から、トークンの消費量は反復回数が増えるにつれて直線的に増加することがわかります。例えば、4回の反復では、DeepSearcherはおよそ0.3Mトークンを消費します。OpenAIのgpt-4o-miniの価格設定に基づく概算値<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0.60</mn><mi>/</mi><mn>1Moutputtokensを</mn></mrow></semantics></math></span></span>使用すると<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo separator="true">、</mo><mi>これは平均コスト</mi></mrow><annotation encoding="application/x-tex">約0.60/1</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">Moutputtokensに</span></span></span><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">相当し</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base">、<span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord"></span></span></span></span>0<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.60/</span><span class="mord mathnormal">1</span><span class="mord">Moutputtokens</span><span class="mpunct">、</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal"></span><span class="mord mathnormal">これは</span></span></span></span>クエリあたりの<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">平均</span><span class="mord mathnormal">コスト</span><span class="mord mathnormal">約0</span></span></span></span>.0036（または50クエリで約0.18ドル）に<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord mathnormal">相当</span></span></span></span>します。</p>
<p>よりリソース集約的な推論モデルの場合、トークン単価が高くなり、トークン出力が大きくなるため、コストは数倍になります。</p>
<h3 id="Model-Performance-Comparison" class="common-anchor-header">モデル性能の比較</h3><p>DeepSearcherの大きな利点は、異なるモデルを柔軟に切り替えられることです。様々な推論モデルと非推論モデル（gpt-4o-miniなど）をテストしました。全体的に、推論モデル、特にクロード3.7ソネットが、劇的な差はないものの、最も良いパフォーマンスを示す傾向がありました。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_6_Average_Recall_by_Model_153c93f616.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図6：モデル別平均リコール</em></p>
<p>注目すべきは、いくつかの小さな非推論モデルは、指示に従う能力が限られているため、完全なエージェントクエリプロセスを完了できないことがありました。</p>
<h2 id="DeepSearcher-Agentic-RAG-vs-Graph-RAG" class="common-anchor-header">DeepSearcher（エージェント型RAG）とグラフRAGの比較<button data-href="#DeepSearcher-Agentic-RAG-vs-Graph-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://zilliz.com/blog/graphrag-explained-enhance-rag-with-knowledge-graphs">グラフRAGも</a>複雑なクエリ、特にマルチホップクエリを処理することができます。では、DeepSearcher（Agentic RAG）とGraph RAGの違いは何でしょうか？</p>
<p>Graph RAGは、明示的な関係リンクに基づいて文書をクエリするように設計されているため、特にマルチホップクエリに強い。例えば、長い小説を処理する場合、グラフRAGは登場人物間の複雑な関係を正確に抽出することができる。しかし、この方法は、これらの関係をマップするためにデータインポート時にトークンを大量に使用する必要があり、クエリーモードが硬直的になりがちで、典型的には単一関係のクエリーにのみ有効である。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_7_Graph_RAG_vs_Deep_Searcher_a5c7130374.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図7：グラフRAGとDeepSearcherの比較</em></p>
<p>対照的に、DeepSearcherに代表されるAgentic RAGは、根本的に異なるアプローチを取っている。データインポート時のトークン消費を最小限に抑え、代わりにクエリ処理時に計算リソースを投入する。この設計上の選択により、重要な技術的トレードオフが生じる：</p>
<ol>
<li><p>初期コストの削減：DeepSearcherでは、ドキュメントの前処理が少なくて済むため、初期設定が迅速かつ低コストで済みます。</p></li>
<li><p>動的なクエリ処理：中間的な発見に基づいて、検索戦略をその場で調整できる。</p></li>
<li><p>クエリごとのコストが高い：各クエリはグラフRAGよりも多くの計算を必要とするが、より柔軟な結果を得ることができる。</p></li>
</ol>
<p>開発者にとって、この違いは異なる使用パターンを持つシステムを設計する際に非常に重要である。グラフRAGは、予測可能なクエリパターンとクエリ量が多いアプリケーションでは効率的かもしれないが、DeepSearcherのアプローチは、柔軟性を必要とするシナリオや予測不可能な複雑なクエリの処理に優れている。</p>
<p>今後、LLMのコストが低下し、推論性能が向上し続けるにつれて、DeepSearcherのようなエージェント型RAGシステムが普及する可能性が高い。計算コストのデメリットは減少し、柔軟性のメリットは残るだろう。</p>
<h2 id="DeepSearcher-vs-Deep-Research" class="common-anchor-header">DeepSearcher と Deep Research の比較<button data-href="#DeepSearcher-vs-Deep-Research" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAIのDeep Researchとは異なり、DeepSearcherはプライベートデータの深い検索と分析に特化している。ベクターデータベースを活用することで、DeepSearcher は多様なデータソースを取り込み、様々なデータタイプを統合し、ベクターベースのナレッジリポジトリに一様に保存することができる。堅牢なセマンティック検索機能により、膨大な量のオフラインデータを効率的に検索できる。</p>
<p>さらに、DeepSearcherは完全にオープンソースである。ディープリサーチは、コンテンツ生成の品質ではリーダーであり続けているが、月額料金が必要であり、クローズドソース製品として運営されているため、その内部プロセスはユーザーから隠されている。これとは対照的に、DeepSearcherは完全な透明性を提供しており、ユーザーはコードを調べたり、ニーズに合わせてカスタマイズしたり、あるいは自分の本番環境に導入したりすることができる。</p>
<h2 id="Technical-Insights" class="common-anchor-header">技術的な洞察<button data-href="#Technical-Insights" class="anchor-icon" translate="no">
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
    </button></h2><p>DeepSearcherの開発とその後の反復を通じて、いくつかの重要な技術的洞察を得ました：</p>
<h3 id="Inference-Models-Effective-but-Not-Infallible" class="common-anchor-header">推論モデル：推論モデル: 効果的だが無謬ではない</h3><p>私たちの実験から、推論モデルはエージェントとして優れた性能を発揮する一方で、時として単純な命令を過剰に分析し、トークンの過剰消費とレスポンスタイムの低下を招くことが明らかになりました。この観察は、もはや推論モデルと非推論モデルを区別しないOpenAIのような主要なAIプロバイダーのアプローチと一致している。その代わりに、モデル・サービスはトークンを節約するための特定の要件に基づいて、推論の必要性を自動的に判断する必要がある。</p>
<h3 id="The-Imminent-Rise-of-Agentic-RAG" class="common-anchor-header">エージェント型RAGの台頭</h3><p>技術的には、RAGの有効性を高めることも重要である。長期的には、コストがエージェント型RAGの普及を阻む最大の障壁である。しかし、DeepSeek-R1のような費用対効果の高い高品質のLLMの出現と、ムーアの法則によるコスト削減により、推論サービスに関連する費用は減少すると予想される。</p>
<h3 id="The-Hidden-Scaling-Limit-of-Agentic-RAG" class="common-anchor-header">エージェント型RAGの隠れたスケーリング限界</h3><p>我々の研究から得られた重要な発見は、パフォーマンスと計算リソースの関係に関するものである。当初、単純に反復回数とトークンの割り当てを増やせば、複雑なクエリの結果が比例して向上するという仮説を立てた。</p>
<p>我々の実験では、より微妙な現実が明らかになった。性能は反復回数を増やすことで向上するが、明らかに収穫が減少することが観察された。具体的には</p>
<ul>
<li><p>1回から3回の反復でパフォーマンスは急激に向上した。</p></li>
<li><p>3回から5回の反復では、パフォーマンスは小幅に改善した。</p></li>
<li><p>反復回数が5回を超えると、トークンの消費量が大幅に増加するにもかかわらず、パフォーマンスはほとんど向上しない。</p></li>
</ul>
<p>この発見は、開発者にとって重要な意味を持つ。RAGシステムに単に多くの計算資源を投入することは、最も効率的なアプローチではない。検索戦略、分解ロジック、合成プロセスの質は、生の反復回数よりも重要であることが多い。このことから、開発者はトークン予算を増やすことよりも、これらのコンポーネントを最適化することに重点を置くべきであることがわかる。</p>
<h3 id="The-Evolution-Beyond-Traditional-RAG" class="common-anchor-header">従来のRAGを超える進化</h3><p>従来のRAGは、低コスト、単一検索アプローチにより、貴重な効率性を提供し、簡単な質問応答シナリオに適している。しかし、複雑な暗黙のロジックを含むクエリを扱う場合、その限界は明らかになる。</p>
<p>"1年で1億稼ぐ方法 "のようなユーザークエリを考えてみよう。従来のRAGシステムであれば、高収入のキャリアや投資戦略に関するコンテンツを検索できるかもしれないが、以下のようなことには苦労するだろう：</p>
<ol>
<li><p>クエリに含まれる非現実的な期待を特定する</p></li>
<li><p>問題を実現可能なサブゴールに分解する。</p></li>
<li><p>複数のドメイン（ビジネス、金融、起業家精神）からの情報を統合する。</p></li>
<li><p>現実的なスケジュールで、構造化されたマルチパスアプローチを提示する。</p></li>
</ol>
<p>ここでDeepSearcherのようなエージェント型RAGシステムの強みが発揮される。複雑なクエリを分解し、マルチステップの推論を適用することで、ユーザーの基本的な情報ニーズによりよく対応する、ニュアンスのある包括的な応答を提供することができる。これらのシステムがより効率的になるにつれて、エンタープライズ・アプリケーションでの採用が加速するものと思われる。</p>
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
    </button></h2><p>DeepSearcherは、RAGシステム設計における重要な進化を象徴するものであり、より洗練された検索およびリサーチ機能を構築するための強力なフレームワークを開発者に提供します。その主な技術的利点は以下の通りである：</p>
<ol>
<li><p>反復的推論：複雑なクエリを論理的なサブステップに分解し、包括的な回答に向けて段階的に構築する機能。</p></li>
<li><p>柔軟なアーキテクチャ：基礎となるモデルの入れ替えや、特定のアプリケーションのニーズに合わせた推論プロセスのカスタマイズをサポートします。</p></li>
<li><p>ベクトルデータベースとの統合：Milvusとのシームレスな接続により、プライベートなデータソースからベクトル埋め込みデータを効率的に保存、検索することができます。</p></li>
<li><p>透過的な実行：各推論ステップの詳細なロギングにより、開発者はシステムの動作をデバッグし、最適化することができます。</p></li>
</ol>
<p>私たちの性能テストでは、DeepSearcherが従来のRAGアプローチと比較して複雑なクエリに対して優れた結果を提供することが確認されていますが、計算効率のトレードオフは明らかです。最適なコンフィギュレーション（通常は約3回の反復）は、精度とリソース消費のバランスを取っています。</p>
<p>LLMのコストが下がり続け、推論機能が向上するにつれて、DeepSearcherに実装されているエージェント型RAGアプローチは、実運用アプリケーションでますます実用的になるでしょう。エンタープライズ検索、リサーチアシスタント、ナレッジマネジメントシステムに取り組む開発者にとって、DeepSearcherは、特定のドメイン要件に合わせてカスタマイズ可能な強力なオープンソース基盤を提供します。</p>
<p>私たちは、開発者コミュニティからの貢献を歓迎し、<a href="https://github.com/zilliztech/deep-searcher">GitHub</a>リポジトリをチェックして、RAG実装におけるこの新しいパラダイムを探求することをお勧めします。</p>
