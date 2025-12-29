---
id: >-
  keeping-ai-agents-grounded-context-engineering-strategies-that-prevent-context-rot-using-milvus.md
title: AIエージェントを地に足をつけた状態に保つ：Milvusを用いたコンテキスト腐敗を防ぐコンテキストエンジニアリング戦略
author: Min Yin
date: 2025-12-23T00:00:00.000Z
cover: assets.zilliz.com/context_rot_cover_804387e7c9.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'context engineering, context rot, vector database, Milvus, vector search'
meta_title: |
  Context Engineering Strategies to Prevent LLM Context Rot with Milvus
desc: >-
  長時間のLLMワークフローでコンテキストの腐敗が起こる理由と、コンテキストエンジニアリング、検索ストラテジー、Milvusベクトル検索が、複雑なマルチステップタスクにおいてAIエージェントの正確性、集中力、信頼性を維持するのに役立つことを学ぶ。
origin: >-
  https://milvus.io/blog/keeping-ai-agents-grounded-context-engineering-strategies-that-prevent-context-rot-using-milvus.md
---
<p>長いスレッドの途中で、モデルが漂流し始めるのだ。答えが曖昧になり、推論が弱まり、重要な詳細が不思議と消えてしまうのだ。しかし、まったく同じプロンプトを新しいチャットに投下すると、モデルは突然、集中し、正確で、地に足のついた行動をとるようになる。</p>
<p>これはモデルが「疲れている」のではなく、<strong>文脈が腐っているの</strong>だ。会話が大きくなるにつれ、モデルはより多くの情報を扱わなければならなくなり、優先順位をつける能力が徐々に低下していく。<a href="https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents">Antropicの研究に</a>よると、コンテキストウィンドウが約8Kトークンから128Kに伸びると、検索精度は15～30％低下する。モデルにはまだ余裕があるが、何が重要かを見失う。コンテキスト・ウィンドウを大きくすることで、問題を遅らせることはできるが、解消することはできない。</p>
<p>そこで、<strong>コンテキスト・エンジニアリングの</strong>出番となる。重要な部分のみを取り出し、冗長になる必要のない部分は圧縮し、プロンプトやツールはモデルが推論できる程度にクリーンな状態に保つ。ゴールはシンプルで、重要な情報を適切なタイミングで利用可能にし、それ以外は無視することだ。</p>
<p>ここで中心的な役割を果たすのが検索であり、特に長時間稼働するエージェントにとっては重要である。<a href="https://milvus.io/"><strong>Milvusの</strong></a>ようなベクターデータベースは、関連する知識を効率的にコンテキストに引き戻すための基盤を提供し、タスクが深く複雑になっても、システムが地に足をつけた状態を維持できるようにします。</p>
<p>このブログでは、コンテキストの回転がどのように起こるのか、それを管理するためにチームが用いる戦略、そして、検索からプロンプトの設計に至るまで、長い、マルチステップのワークフローにおいてAIエージェントをシャープに保つアーキテクチャパターンを見ていきます。</p>
<h2 id="Why-Context-Rot-Happens" class="common-anchor-header">コンテキストの腐敗が起こる理由<button data-href="#Why-Context-Rot-Happens" class="anchor-icon" translate="no">
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
    </button></h2><p>AIモデルに多くのコンテキストを与えれば、より良い答えが得られると思われがちだ。しかし、実際はそうではない。認知科学によれば、人間のワーキングメモリーはおよそ<strong>7±2個の</strong>情報の<strong>塊を</strong>保持している。それを超えると、詳細を忘れたり、ぼやけたり、誤解したりし始める。</p>
<p>LLMも似たような挙動を示すが、規模がはるかに大きく、より劇的な故障モードがある。</p>
<p>根本的な問題は、<a href="https://zilliz.com/learn/decoding-transformer-models-a-study-of-their-architecture-and-underlying-principles">トランスフォーマーのアーキテクチャ</a>そのものにある。すべてのトークンは、他のすべてのトークンと比較し、シーケンス全体にわたってペアワイズ・アテンションを形成しなければならない。つまり、計算量はコンテキストの長さとともに<strong>O(n²)</strong>倍になる。プロンプトを1Kトークンから100Kに拡張しても、モデルは「よりハードに働く」ようにはならない。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/contextual_dilution_622033db72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>次に学習データの問題がある。</strong>モデルは長いシーケンスよりも短いシーケンスをはるかに多く見る。そのため、LLMに非常に大きなコンテクストにまたがって動作するよう求めると、LLMはそれ用に十分に訓練されていない領域に押し込まれることになる。実際には、非常に長いコンテキストの推論は、ほとんどのモデルにとって<strong>分布外で</strong>あることが多い。</p>
<p>このような限界にもかかわらず、長いコンテキストは今や避けられない。初期のLLMアプリケーションは、分類、要約、または単純な生成といったシングルターンのタスクがほとんどだった。今日、企業のAIシステムの70％以上は、分岐するマルチステップワークフローを管理し、多くの場合、何時間もの対話のラウンドにわたってアクティブな状態を維持するエージェントに依存している。長時間のセッションは、例外からデフォルトへと移行した。</p>
<p>次の問題は、<strong>いかにしてモデルを圧倒することなく、注意を鋭敏に保つかということ</strong>だ。</p>
<h2 id="Context-Retrieval-Approaches-to-Solving-Context-Rot" class="common-anchor-header">コンテキストの腐敗を解決するためのコンテキスト検索アプローチ<button data-href="#Context-Retrieval-Approaches-to-Solving-Context-Rot" class="anchor-icon" translate="no">
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
    </button></h2><p>検索は、コンテキストの腐敗に対抗するための最も効果的な手段のひとつであり、実際には、異なる角度からコンテキストの腐敗に対処する補完的なパターンで現れる傾向がある。</p>
<h3 id="1-Just-in-Time-Retrieval-Reducing-Unnecessary-Context" class="common-anchor-header">1.ジャストインタイム検索：不要なコンテキストの削減</h3><p>コンテキストの腐敗の主な原因のひとつは、まだ必要のない情報でモデルに<em>負荷をかける</em>ことである。Claude Code-Anthropicのコーディングアシスタントは、<strong>ジャストインタイム（JIT）検索で</strong>この問題を解決する。</p>
<p>コードベースやデータセット全体をコンテキストに詰め込むのではなく（これはドリフトや忘却の可能性を大きくする）、Claude Codeはファイルパス、コマンド、ドキュメントリンクといった小さなインデックスを維持する。モデルが情報の一部を必要とするとき、その特定の項目を検索し、<strong>重要な瞬間に</strong>コンテキストに挿入する。</p>
<p>例えば、クロード・コードに10GBのデータベースを分析するよう依頼しても、全体を読み込もうとはしない。エンジニアのように働くのだ：</p>
<ol>
<li><p>SQLクエリーを実行し、データセットのハイレベルなサマリーを引き出す。</p></li>
<li><p><code translate="no">head</code> 、<code translate="no">tail</code> のようなコマンドを使ってサンプルデータを表示し、その構造を理解する。</p></li>
<li><p>重要な統計やサンプル行など、最も重要な情報だけをコンテキスト内に保持する。</p></li>
</ol>
<p>コンテキスト内に保持する情報を最小限にすることで、JIT検索は腐敗の原因となる無関係なトークンの蓄積を防ぐ。モデルは、現在の推論ステップに必要な情報だけを見るので、集中し続ける。</p>
<h3 id="2-Pre-retrieval-Vector-Search-Preventing-Context-Drift-Before-It-Starts" class="common-anchor-header">2.事前検索（ベクトル検索）：文脈ドリフトを事前に防ぐ</h3><p>顧客サポート、Q&amp;Aシステム、エージェントのワークフローでは、生成開始<em>前に</em>適切な知識が必要になることがよくあります。そこで<strong>事前検索が</strong>重要になる。</p>
<p>コンテキストの腐敗は、モデルが大量の生テキストの山を手渡され、何が重要かを選別することを期待されるために、しばしば起こります。<a href="https://milvus.io/">Milvusや</a> <a href="https://zilliz.com/cloud">Zilliz Cloudの</a>ような）ベクトル・データベースは、推論の<em>前に</em>最も関連性の高い部分を特定し、価値の高いコンテキストのみがモデルに到達するようにする。</p>
<p>典型的なRAGのセットアップでは</p>
<ul>
<li><p>ドキュメントはMilvusのようなベクトルデータベースに埋め込まれ、保存される。</p></li>
<li><p>クエリ時に、システムは類似性検索によって関連性の高いチャンクの小さなセットを検索する。</p></li>
<li><p>これらのチャンクのみがモデルのコンテキストに入る。</p></li>
</ul>
<p>これにより、2つの方法で腐敗を防ぐことができる：</p>
<ul>
<li><p><strong>ノイズの削減：</strong>無関係なテキストや関連性の低いテキストは、そもそもコンテキストに入らない。</p></li>
<li><p><strong>効率性:</strong>モデルが処理するトークンの数がはるかに少ないため、重要な詳細を見失う可能性が低くなる。</p></li>
</ul>
<p>Milvusは何百万ものドキュメントをミリ秒単位で検索できるため、このアプローチはレイテンシーが重要なライブシステムに最適である。</p>
<h3 id="3-Hybrid-JIT-and-Vector-Retrieval" class="common-anchor-header">3.ハイブリッドJITとベクトル検索</h3><p>ベクトル検索ベースの事前検索は、モデルが生の特大テキストではなく、シグナル性の高い情報から開始することを保証することで、コンテキストの腐敗の重要な部分に対処する。しかし、Anthropicは、チームが見落としがちな2つの真の課題を浮き彫りにしている：</p>
<ul>
<li><p><strong>適時性：</strong>適時性：知識ベースがベクトルインデックスの再構築よりも早く更新される場合、モデルは古い情報に依存する可能性がある。</p></li>
<li><p><strong>正確性：</strong>タスクの開始前に、モデルが必要とするものを正確に予測することは困難である。</p></li>
</ul>
<p>そのため、実世界のワークロードでは、ハイブリッド・アパローチが最適なソリューションとなる。</p>
<ul>
<li><p>安定した、信頼性の高い知識のためのベクトル探索</p></li>
<li><p>進化する情報、またはタスクの途中で初めて関連する情報には、エージェント駆動型のJIT探索</p></li>
</ul>
<p>これら2つのアプローチをブレンドすることで、既知の情報に対するベクトル検索のスピードと効率性を得ることができ、新しいデータが関連するようになったときにはいつでも、モデルが新しいデータを発見して読み込む柔軟性を得ることができる。</p>
<p>これが実際のシステムでどのように機能するか見てみよう。例えば、プロダクション・ドキュメンテーションのアシスタントを考えてみよう。ほとんどのチームは最終的に2段階のパイプラインに落ち着く：milvusを使ったベクトル検索＋エージェントベースのJIT検索である。</p>
<p><strong>1.Milvus搭載ベクトル検索（事前検索）</strong></p>
<ul>
<li><p>ドキュメント、APIリファレンス、変更履歴、既知の問題をエンベッディングに変換します。</p></li>
<li><p>Milvusベクターデータベースに、製品エリア、バージョン、更新時間などのメタデータとともに格納します。</p></li>
<li><p>ユーザーから質問があった場合、セマンティック検索を実行し、関連する上位K個のセグメントを取得します。</p></li>
</ul>
<p>これにより、定型的なクエリの約80%を500ミリ秒以内に解決し、強力で文脈に左右されない出発点をモデルに与える。</p>
<p><strong>2.エージェントベースの探索</strong></p>
<p>最初の検索が十分でない場合、例えば、ユーザが非常に具体的なものを要求したり、時間的な制約がある場合、エージェントは新しい情報を取得するためにツールを呼び出すことができる：</p>
<ul>
<li><p><code translate="no">search_code</code> を使って、コードベースの特定の関数やファイルを見つける。</p></li>
<li><p><code translate="no">run_query</code> を使って、データベースからリアルタイムのデータを取り出します。</p></li>
<li><p><code translate="no">fetch_api</code> を使用して、最新のシステムステータスを取得します。</p></li>
</ul>
<p>これらの呼び出しには通常<strong>3～5秒</strong>かかりますが、システムが事前に予測できなかった質問に対しても、常に新鮮で正確、かつ関連性のあるデータでモデルが動作することを保証します。</p>
<p>このハイブリッド構造により、コンテキストがタイムリーで、正しく、タスクに特化したままであることが保証され、長く続くエージェントワークフローでコンテキストが腐敗するリスクが劇的に減少します。</p>
<p>Milvusは、このようなハイブリッドシナリオにおいて特に効果的です：</p>
<ul>
<li><p>意味的関連性と構造化された制約を組み合わせた<strong>ベクトル検索＋スカラーフィルタリング</strong></p></li>
<li><p>エンベッディングをダウンタイムなしに<strong>更新できるインクリメンタルアップデート</strong></p></li>
</ul>
<p>このため、Milvusは、意味的な理解と検索対象の正確な制御の両方を必要とするシステムにとって理想的なバックボーンとなります。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/milvus_in_hybrid_architecture_7d4e391aa4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>例えば、次のようなクエリを実行する：</p>
<pre><code translate="no"><span class="hljs-comment"># You can combine queries like this in Milvus</span>
collection.search(
    data=[query_embedding],  <span class="hljs-comment"># Semantic similarity</span>
    anns_field=<span class="hljs-string">&quot;embedding&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {<span class="hljs-string">&quot;nprobe&quot;</span>: <span class="hljs-number">10</span>}},
    expr=<span class="hljs-string">&quot;doc_type == &#x27;API&#x27; and update_time &gt; &#x27;2025-01-01&#x27;&quot;</span>,  <span class="hljs-comment"># Structured filtering</span>
    limit=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<h2 id="How-to-Choose-the-Right-Approach-for-Dealing-With-Context-Rot" class="common-anchor-header">コンテキストロットを扱うための正しいアプローチの選択方法<button data-href="#How-to-Choose-the-Right-Approach-for-Dealing-With-Context-Rot" class="anchor-icon" translate="no">
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
    </button></h2><p>ベクトル検索の事前検索、ジャストインタイム検索、そしてハイブリッド検索がすべて利用可能であり、当然の疑問は、<strong>どれを使うべきか</strong>、ということである。</p>
<p>ここでは、知識がどれだけ<em>安定して</em>いるか、モデルの情報ニーズがどれだけ<em>予測可能で</em>あるかに基づいて選択する、シンプルだが実用的な方法を紹介する。</p>
<h3 id="1-Vector-Search-→-Best-for-Stable-Domains" class="common-anchor-header">1.ベクトル探索 → 安定した領域に最適</h3><p>金融、法務、コンプライアンス、医療文書など、変化のスピードは遅いが、正確さが要求される分野であれば、Milvusの<strong>事前検索</strong>機能付き知識ベースが適している。</p>
<p>情報は明確に定義されており、更新頻度は低く、ほとんどの質問は、意味的に関連する文書を前もって検索することで回答できる。</p>
<p><strong>予測可能なタスク＋安定した知識→事前検索。</strong></p>
<h3 id="2-Just-in-Time-Retrieval-→-Best-for-Dynamic-Exploratory-Workflows" class="common-anchor-header">2.ジャストインタイム検索 → 動的で探索的なワークフローに最適</h3><p>ソフトウェアエンジニアリング、デバッグ、アナリティクス、データサイエンスのような分野では、新しいファイル、新しいデータ、新しいデプロイメント状態など、環境が急速に変化する。新しいファイル、新しいデータ、新しいデプロイメントの状態などです。モデルは、タスクが始まる前に何が必要かを予測することはできません。</p>
<p><strong>予測不可能なタスク＋急速に変化する知識→ジャストインタイム検索。</strong></p>
<h3 id="3-Hybrid-Approach-→-When-Both-Conditions-Are-True" class="common-anchor-header">3.ハイブリッドアプローチ → 両方の条件が当てはまる場合</h3><p>多くの現実のシステムは、純粋に安定しているわけでも、純粋に動的なわけでもない。例えば、開発者のドキュメントはゆっくりと変化するが、本番環境の状態は刻々と変化する。ハイブリッド・アプローチでは次のことができる：</p>
<ul>
<li><p>ベクトル検索（高速、低レイテンシ）を使用して、既知の安定した知識をロードする。</p></li>
<li><p>オンデマンドでエージェントツールを使って動的な情報を取得（正確、最新）</p></li>
</ul>
<p><strong>混合知識＋混合タスク構造→ハイブリッド検索アプローチ。</strong></p>
<h2 id="What-if-the-Context-Window-Still-Isn’t-Enough" class="common-anchor-header">コンテキストウィンドウがまだ十分でない場合は？<button data-href="#What-if-the-Context-Window-Still-Isn’t-Enough" class="anchor-icon" translate="no">
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
    </button></h2><p>コンテキストエンジニアリングは過負荷を減らすのに役立つが、時にはもっと根本的な問題がある。</p>
<p>大規模なコードベースのマイグレーション、マルチ・リポジトリ・アーキテクチャのレビュー、深いリサーチ・レポートの作成など、特定のワークフローでは、モデルがタスクの最後に到達するまでに、200K以上のコンテキスト・ウィンドウを超えることがある。ベクトル検索が重労働であっても、より永続的で構造化されたメモリを必要とするタスクもあります。</p>
<p>最近、Anthropicは3つの実用的な戦略を提供しました。</p>
<h3 id="1-Compression-Preserve-Signal-Drop-Noise" class="common-anchor-header">1.圧縮：信号を保存し、ノイズを取り除く</h3><p>コンテキストウィンドウが限界に近づくと、モデルは<strong>以前のやりとりを</strong>簡潔な要約に<strong>圧縮する</strong>ことができる。良い圧縮は</p>
<ul>
<li><p>重要な決定</p></li>
<li><p>制約と要件</p></li>
<li><p>未解決の問題</p></li>
<li><p>関連するサンプルや例</p></li>
</ul>
<p>そして削除</p>
<ul>
<li><p>冗長なツール出力</p></li>
<li><p>無関係なログ</p></li>
<li><p>冗長なステップ</p></li>
</ul>
<p>課題はバランスだ。積極的に圧縮し過ぎると、モデルは重要な情報を失い、軽く圧縮し過ぎると、スペースはほとんど得られない。効果的な圧縮は、"なぜ "と "何を "を維持する一方で、"どうやってここまで来たか "を捨ててしまう。</p>
<h3 id="2-Structured-Note-Taking-Move-Stable-Information-Outside-Context" class="common-anchor-header">2.構造化されたノートテイキング：安定した情報をコンテキストの外に出す</h3><p>モデルのウィンドウ内にすべてを保持する代わりに、システムは重要な事実を<strong>外部メモリに</strong>保存することができます<strong>。</strong></p>
<p>例えば、クロードのポケモンエージェントのプロトタイプは、次のような耐久性のある事実を保存します：</p>
<ul>
<li><p><code translate="no">Pikachu leveled up to 8</code></p></li>
<li><p><code translate="no">Trained 1234 steps on Route 1</code></p></li>
<li><p><code translate="no">Goal: reach level 10</code></p></li>
</ul>
<p>一方、一時的な詳細（バトルログや長いツールの出力など）は、アクティブなコンテキストの外に置かれる。これは、人間がどのようにノートを使うかを反映している。私たちは、すべての詳細をワーキングメモリに保存するのではなく、参照点を外部に保存し、必要なときにそれらを調べる。</p>
<p>構造化されたノートテイキングは、繰り返される不要な詳細によるコンテキストの腐敗を防ぐと同時に、モデルに信頼できる真実のソースを与える。</p>
<h3 id="3-Sub-Agent-Architecture-Divide-and-Conquer-Large-Tasks" class="common-anchor-header">3.サブエージェントアーキテクチャ：大規模タスクの分割と克服</h3><p>複雑なタスクの場合、マルチエージェントアーキテクチャを設計することができ、そこでは、リードエージェントが作業全体を監督し、いくつかの専門化されたサブエージェントがタスクの特定の側面を処理する。これらのサブエージェントは、サブタスクに関連する大量のデータに深く潜り込みますが、簡潔で本質的な結果のみを返します。このアプローチは、研究レポートやデータ分析のようなシナリオでよく使われます。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/longduration_task_cbbc07b9ca.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>実際には、圧縮と組み合わせた単一のエージェントでタスクを処理することから始めるのがベストだ。外部ストレージは、セッションをまたいでメモリを保持する必要がある場合にのみ導入すべきである。マルチエージェントアーキテクチャは、複雑で特殊なサブタスクの並列処理を本当に必要とするタスクのために確保されるべきである。</p>
<p>各アプローチは、コンテキストのウィンドウを吹き飛ばすことなく、またコンテキストの腐敗を引き起こすことなく、システムの有効な「ワーキングメモリ」を拡張する。</p>
<h2 id="Best-Practices-for-Designing-Context-That-Actually-Works" class="common-anchor-header">実際に機能するコンテキストを設計するためのベストプラクティス<button data-href="#Best-Practices-for-Designing-Context-That-Actually-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>コンテキストのオーバーフローを処理した後、もうひとつ同様に重要な部分がある。圧縮、外部ノート、サブエージェントがあっても、プロンプトやツール自体が長く複雑な推論をサポートするように設計されていなければ、システムは苦労するだろう。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/System_Prompts_cf655dcd0d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Anthropicは、プロンプトを書く練習としてではなく、3つのレイヤーにわたってコンテキストを構築する方法として、このことを考えるのに役立つ方法を提供する。</p>
<h3 id="System-Prompts-Find-the-Goldilocks-Zone" class="common-anchor-header"><strong>システムのプロンプトゴルディロックスゾーンを見つける</strong></h3><p>ほとんどのシステム・プロンプトは両極端で失敗する。詳細すぎるルールリスト、入れ子になった条件、ハードコードされた例外などは、プロンプトをもろくし、維持することを難しくする。構造が少なすぎると、モデルは何をすべきかを推測することになる。</p>
<p>最良のプロンプトはその中間に位置します。行動を導くのに十分な構造を持っており、モデルが推論するのに十分な柔軟性を持っています。実際には、これはモデルに明確な役割、一般的なワークフロー、軽いツールガイダンスを与えることを意味します。</p>
<p>例えば</p>
<pre><code translate="no">You are a technical documentation assistant serving developers.
<span class="hljs-number">1.</span> Start <span class="hljs-keyword">by</span> retrieving relevant documents <span class="hljs-keyword">from</span> the Milvus knowledge <span class="hljs-keyword">base</span>.  
<span class="hljs-number">2.</span> If the retrieval results are insufficient, use the `search_code` tool to perform a deeper search <span class="hljs-keyword">in</span> the codebase.  
<span class="hljs-number">3.</span> When answering, cite specific documentation sections <span class="hljs-keyword">or</span> code line numbers.

<span class="hljs-meta">## Tool guidance</span>
- search_docs: Used <span class="hljs-keyword">for</span> semantic retrieval, best <span class="hljs-keyword">for</span> conceptual questions.  
- search_code: Used <span class="hljs-keyword">for</span> precise lookup <span class="hljs-keyword">in</span> the codebase, best <span class="hljs-keyword">for</span> implementation-detail questions.  
…
<button class="copy-code-btn"></button></code></pre>
<p>このプロンプトは、モデルを圧倒したり、ここにふさわしくない動的な情報を無理に扱わせたりすることなく、方向性を示している。</p>
<h3 id="Tool-Design-Less-Is-More" class="common-anchor-header">ツールデザイン：少ないことは多いこと</h3><p>システムプロンプトが高レベルの動作を設定したら、ツールは実際の操作ロジックを実行します。ツールを使ったシステムで意外と多い失敗モードは、単にツールが多すぎる、あるいは目的が重複するツールがある、というものだ。</p>
<p>経験則では</p>
<ul>
<li><p><strong>ツールは1つ、目的は1つ</strong></p></li>
<li><p><strong>明確で曖昧さのないパラメータ</strong></p></li>
<li><p><strong>責任の重複なし</strong></p></li>
</ul>
<p>人間のエンジニアがどのツールを使うか迷うなら、モデルも迷うだろう。クリーンなツールデザインは曖昧さを減らし、認知的負荷を下げ、不必要なツールの試行でコンテキストが乱雑になるのを防ぐ。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/tooling_complexity_7d2bb60c54.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Dynamic-Information-Should-Be-Retrieved-Not-Hardcoded" class="common-anchor-header">動的な情報はハードコードされるのではなく、取得されるべきである</h3><p>最後のレイヤーは、最も見落としやすいものだ。ステータスの値、最近の更新、ユーザー固有の状態など、動的な情報や時間的な影響を受けやすい情報は、システムプロンプトにまったく表示されるべきではない。これをプロンプトに埋め込んでしまうと、長いタスクの間に陳腐化したり、肥大化したり、矛盾が生じたりすることになる。</p>
<p>代わりに、これらの情報は、検索またはエージェントツールによって、必要なときだけ取得されるべきである。システムプロンプトから動的なコンテンツを排除することで、コンテキストの腐敗を防ぎ、モデルの推論空間をクリーンに保つことができる。</p>
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
    </button></h2><p>AIエージェントがさまざまな業界の生産環境に移行するにつれて、これまで以上に長いワークフローと複雑なタスクを担うようになっている。このような環境では、コンテキストを管理することが現実的に必要になってくる。</p>
<p><strong>しかし、コンテキスト・ウィンドウを大きくすれば、自動的に良い結果が得られるというわけではなく</strong>、多くの場合、逆の結果になる。モデルに過負荷がかかったり、古い情報を与えられたり、大量のプロンプトを強制されたりすると、精度は静かに落ちていく。このゆっくりとした微妙な低下は、現在では<strong>コンテキストの腐敗と</strong>呼ばれている。</p>
<p>JIT検索、事前検索、ハイブリッドパイプライン、ベクターデータベースを利用したセマンティック検索などの技術は、すべて同じゴールを目指している。<strong>モデルが適切な情報を適切な瞬間に、それ以上でもそれ以下でもなく、確実に見ることができるようにする</strong>ことだ。</p>
<p>オープンソースの高性能ベクトルデータベースである<a href="https://milvus.io/"><strong>milvusは</strong></a>、このワークフローの中核に位置する。Milvusは、知識を効率的に保存し、最も関連性の高い部分を低レイテンシーで検索するためのインフラを提供します。Milvusは、JIT検索やその他の補完的な戦略と組み合わせることで、AIエージェントのタスクがより深く、よりダイナミックになっても、精度を維持できるよう支援する。</p>
<p>しかし、検索はパズルの1ピースに過ぎません。優れたプロンプトの設計、クリーンで最小限のツールセット、そして圧縮、構造化ノート、サブエージェントなど、賢明なオーバーフロー戦略、これらすべてが連動して、長期にわたるセッションでモデルの集中力を維持する。これが本当のコンテキストエンジニアリングの姿である。賢いハックではなく、思慮深いアーキテクチャである。</p>
<p>数時間、数日、あるいはワークフロー全体にわたって正確さを維持するAIエージェントをお望みなら、コンテキストは、スタックの他のコア部分と同じ注意を払う価値があります。</p>
<p>ご質問や機能についてのディープダイブをご希望ですか？私たちの<a href="https://discord.com/invite/8uyFbECzPX"> Discordチャンネルに</a>参加するか、<a href="https://github.com/milvus-io/milvus"> GitHubに</a>課題を提出してください。また、<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvusオフィスアワーを通して</a>、20分間の1対1のセッションを予約し、洞察、ガイダンス、質問への回答を得ることもできます。</p>
