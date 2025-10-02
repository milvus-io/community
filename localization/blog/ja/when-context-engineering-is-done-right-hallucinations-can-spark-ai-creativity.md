---
id: >-
  when-context-engineering-is-done-right-hallucinations-can-spark-ai-creativity.md
title: コンテキスト・エンジニアリングが正しく行われれば、幻覚はAIの創造性の火種となり得る
author: James Luan
date: 2025-09-30T00:00:00.000Z
desc: AIの幻覚が単なるエラーではなく、創造性の火花である理由と、コンテキスト・エンジニアリングがそれらを信頼できる現実世界の成果に変える方法を発見してください。
cover: assets.zilliz.com/Chat_GPT_Image_Oct_1_2025_10_42_15_AM_101639b3bf.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, AI Agents, Context Engineering'
meta_keywords: 'Milvus, vector database, AI Agents, Context Engineering'
meta_title: |
  If Context Engineering Done Right, Hallucinations Can Spark AI Creativity
origin: >-
  https://milvus.io/blog/when-context-engineering-is-done-right-hallucinations-can-spark-ai-creativity.md
---
<p>長い間、私も含め、私たちの多くはLLMの幻覚を単なる欠陥として扱ってきた。検索システム、ガードレール、微調整などなど。これらの安全策は今でも貴重なものだ。しかし、モデルが実際にどのように反応を生成するのか、そして<a href="https://milvus.io/"><strong>Milvusの</strong></a>ようなシステムがより広範なAIパイプラインにどのように適合するのかを研究すればするほど、幻覚が単なる失敗だとは思えなくなってきた。実際、幻覚はAIの創造性の火種にもなりうる。</p>
<p>人間の創造性を見てみると、同じパターンがある。すべてのブレークスルーは想像力の飛躍に依存している。しかし、そのような飛躍は決して突然やってくるものではない。詩人はルールを破る前に、まずリズムとメーターをマスターする。科学者は未知の領域に踏み込む前に、確立された理論に頼る。確かな知識と理解に基づいている限り、進歩はこうした飛躍にかかっている。</p>
<p>LLMもこれと同じである。いわゆる「幻覚」や「飛躍」-類推、連想、外挿-は、モデルがつながりを作り、知識を拡張し、明示的に訓練された以上のアイデアを表面化させるのと同じ生成プロセスから生まれる。すべての飛躍が成功するわけではないが、成功した場合、その結果は説得力のあるものになる。</p>
<p>だからこそ、私は<strong>コンテキスト・エンジニアリングを</strong>次のステップとして重要視しているのだ。すべての幻覚を排除しようとするのではなく、幻覚を<em>導く</em>ことに焦点を当てるべきなのだ。適切なコンテクストを設計することで、私たちはバランスを取ることができる。つまり、新境地を開拓するのに十分な想像力を保ちつつ、信頼されるに十分な固定性を確保するのだ。</p>
<h2 id="What-is-Context-Engineering" class="common-anchor-header">コンテキスト・エンジニアリングとは何か？<button data-href="#What-is-Context-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>では、<em>コンテキスト・エンジニアリングとは</em>いったい何を意味するのだろうか？この言葉は新しいかもしれないが、その実践は何年も進化し続けている。RAG、プロンプト、関数呼び出し、MCPなどのテクニックは、すべて同じ問題を解決するための初期の試みである。コンテキストエンジニアリングとは、これらのアプローチを首尾一貫したフレームワークに統一することである。</p>
<h2 id="The-Three-Pillars-of-Context-Engineering" class="common-anchor-header">コンテキストエンジニアリングの3つの柱<button data-href="#The-Three-Pillars-of-Context-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>効果的なコンテキストエンジニアリングは、相互に関連する3つの層の上に成り立っている：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/context_engineering_1_8f2b39c5e7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="1-The-Instructions-Layer--Defining-Direction" class="common-anchor-header">1.指示層 - 方向性の定義</h3><p>この層には、プロンプト、数少ない例、デモンストレーションが含まれる。これはモデルのナビゲーションシステムであり、ただ漠然と「北へ行け」ではなく、ウェイポイントのある明確なルートを示す。うまく構成された指示は、境界線を設定し、目標を定義し、モデルの動作のあいまいさを減らします。</p>
<h3 id="2-The-Knowledge-Layer--Supplying-Ground-Truth" class="common-anchor-header">2.知識層 - グラウンド・トゥルースの提供</h3><p>ここでは、モデルが効果的に推論するために必要な事実、コード、文書、状態を配置します。このレイヤーがないと、システムは不完全な記憶から即興的に推論します。この層があれば、モデルはその出力をドメイン固有のデータに基づかせることができる。より正確で関連性の高い知識であればあるほど、推論の信頼性は高まります。</p>
<h3 id="3-The-Tools-Layer--Enabling-Action-and-Feedback" class="common-anchor-header">3.ツール層 - アクションとフィードバックを可能にする</h3><p>このレイヤーはAPI、関数呼び出し、外部統合をカバーする。これは、システムが推論を越えて実行に移ること、つまりデータを検索したり、計算を実行したり、ワークフローをトリガーしたりすることを可能にするものである。同様に重要なこととして、これらのツールは、モデルの推論にループバックできるリアルタイムのフィードバックを提供する。このフィードバックこそが、修正、適応、継続的改善を可能にする。実際には、これこそがLLMを受動的な応答者から、システムにおける能動的な参加者に変えるものなのだ。</p>
<p>これらのレイヤーはサイロではない。指示は目的地を設定し、知識は作業するための情報を提供し、ツールは決定を行動に移し、結果をループにフィードバックする。これらの層がうまく調和することで、モデルが創造的であると同時に信頼できる環境を作り出すことができるのだ。</p>
<h2 id="The-Long-Context-Challenges-When-More-Becomes-Less" class="common-anchor-header">長いコンテクストへの挑戦より多くがより少なくなるとき<button data-href="#The-Long-Context-Challenges-When-More-Becomes-Less" class="anchor-icon" translate="no">
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
    </button></h2><p>多くのAIモデルは現在、100万トークンのウィンドウを宣伝している。しかし、コンテキストが多ければ自動的に良い結果が得られるわけではない。実際には、非常に長いコンテキストは、推論と信頼性を低下させる可能性のある明確な失敗モードをもたらす。</p>
<h3 id="Context-Poisoning--When-Bad-Information-Spreads" class="common-anchor-header">コンテキスト・ポイズニング - 悪い情報が広まるとき</h3><p>いったん誤った情報が作業コンテキストに入ると、それがゴールであれ、要約であれ、中間状態であれ、推論プロセス全体を脱線させる可能性がある。<a href="https://arxiv.org/pdf/2507.06261">DeepMindのGemini 2.5レポートが</a>明確な例を示している。ポケモンをプレイしているLLMエージェントが、ゲームの状態を読み間違えて、"捕まえられない伝説のポケモンを捕まえる "ことを使命と判断した。その間違ったゴールは事実として記録され、エージェントは精巧だが不可能な戦略を生み出すことになった。</p>
<p>下の抜粋に示すように、毒されたコンテキストはモデルをループに閉じ込め、推論プロセス全体が崩壊するまで、エラーを繰り返し、常識を無視し、同じ間違いを強化した。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_1_Excerpt_from_Gemini_2_5_Tech_Paper_e89adf9eed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>図1：<a href="https://arxiv.org/pdf/2507.06261">Gemini 2.5技術論文からの</a>抜粋</p>
<h3 id="Context-Distraction--Lost-in-the-Details" class="common-anchor-header">コンテキストに気を取られる - 細部に気を取られる</h3><p>コンテキストウィンドウが拡大するにつれて、モデルはトランスクリプトを過大評価し始め、トレーニング中に学習したことを十分に使用しなくなる可能性がある。例えば、DeepMindのGemini 2.5 Proは、100万トークンのウィンドウをサポートしているが、<a href="https://arxiv.org/pdf/2507.06261">10万トークンあたりでドリフトし始める。</a> <a href="https://www.databricks.com/blog/long-context-rag-performance-llms">Databricksの調査に</a>よると、Llama 3.1-405Bのような小さなモデルは、およそ〜32,000トークンで、はるかに早くその限界に達する。背景を読みすぎると、筋書きがわからなくなってしまうのだ。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_2_Excerpt_from_Gemini_2_5_Tech_Paper_56d775c59d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>図2：<a href="https://arxiv.org/pdf/2507.06261">Gemini 2.5技術論文からの</a>抜粋</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_3_Long_context_performance_of_GPT_Claude_Llama_Mistral_and_DBRX_models_on_4_curated_RAG_datasets_Databricks_Docs_QA_Finance_Bench_Hot_Pot_QA_and_Natural_Questions_Source_Databricks_99086246b9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図3：4つのRAGデータセット（Databricks DocsQA、FinanceBench、HotPotQA、Natural Questions）に対するGPT、Claude、Llama、Mistral、DBRXモデルのロングコンテキストパフォーマンス [出典：</em> <a href="https://www.databricks.com/blog/long-context-rag-performance-llms"><em>Databricks</em></a><em>]</em><em>.</em></p>
<h3 id="Context-Confusion--Too-Many-Tools-in-the-Kitchen" class="common-anchor-header">コンテキストの混乱 - キッチンにツールが多すぎる</h3><p>ツールを増やしても、必ずしも役立つとは限らない。<a href="https://gorilla.cs.berkeley.edu/leaderboard.html">Berkeley Function-Calling Leaderboardは</a>、コンテキストに多くのツールメニューが表示され、多くの場合無関係なオプションがある場合、モデルの信頼性が低下し、必要でない場合でもツールが呼び出されることを示しています。明確な例として、量子化されたLlama 3.1-8Bは、46個のツールが利用可能な状態では失敗したが、19個に減らすと成功した。これはAIシステムにとっての選択のパラドックスであり、選択肢が多すぎると判断が悪くなる。</p>
<h3 id="Context-Clash--When-Information-Conflicts" class="common-anchor-header">文脈の衝突 - 情報が衝突するとき</h3><p>対話が分岐するにつれて、初期の誤解が複雑化する。<a href="https://arxiv.org/pdf/2505.06120v1">マイクロソフトとセールスフォースの実験では</a>、オープンウェイトLLMとクローズドウェイトLLMの両方が、マルチターン設定とシングルターン設定とで著しくパフォーマンスが低下した。一旦間違った仮定が会話状態に入ると、後続のターンでもその仮定が継承され、エラーが増幅される。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_4_LL_Ms_get_lost_in_multi_turn_conversations_in_experiments_21f194b02d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図4：LLMはマルチターン会話で失われる</em></p>
<p>この影響はフロンティアモデルでも現れる。ベンチマークタスクがターンに分散された場合、OpenAIのo3モデルのパフォーマンススコアは<strong>98.</strong>1から<strong>64.</strong>1に低下した。最初の誤読は事実上、世界モデルを「設定」してしまう。各返信はその上に構築されるため、明示的に修正しない限り、小さな矛盾は強固な盲点に変わってしまう。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_4_The_performance_scores_in_LLM_multi_turn_conversation_experiments_414d3a0b3f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>図4：LLMマルチターン会話実験におけるパフォーマンススコア</em></p>
<h2 id="Six-Strategies-to-Tame-Long-Context" class="common-anchor-header">長い文脈を使いこなすための6つの戦略<button data-href="#Six-Strategies-to-Tame-Long-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>ロングコンテキストの課題に対する答えは、能力を放棄することではない。以下は、私たちが実践してきた6つの戦略である：</p>
<h3 id="Context-Isolation" class="common-anchor-header">コンテキストの分離</h3><p>複雑なワークフローを、コンテキストを分離した特殊なエージェントに分割する。各エージェントは干渉を受けることなく、独自のドメインに集中し、エラーが伝播するリスクを低減する。これにより、精度が向上するだけでなく、構造化されたエンジニアリングチームのような並列実行が可能になります。</p>
<h3 id="Context-Pruning" class="common-anchor-header">コンテキストの刈り込み</h3><p>コンテキストを定期的に監査し、刈り込みます。冗長な詳細、古くなった情報、無関係な痕跡を取り除く。これはリファクタリングと同じだと考えてほしい。無駄なコードや依存関係を一掃し、必要なものだけを残すのだ。効果的な刈り込みには、何が属し、何が属さないかの明確な基準が必要である。</p>
<h3 id="Context-Summarization" class="common-anchor-header">コンテキストの要約</h3><p>長い歴史を全部持ち運ぶ必要はない。その代わり、次のステップに必要なことだけを簡潔に要約する。優れた要約は、重要な事実、決定、制約を保持する一方で、繰り返しや不必要な詳細を排除する。それは、200ページの仕様書を1ページの設計概要書に置き換えるようなもので、それでも前進するために必要なものはすべて得られる。</p>
<h3 id="Context-Offloading" class="common-anchor-header">コンテキストのオフロード</h3><p>すべての詳細がライブコンテキストの一部である必要はない。重要でないデータは、外部システム（ナレッジベース、ドキュメントストア、Milvusのようなベクターデータベース）に保持し、必要なときだけ取り出す。これにより、モデルの認識負荷が軽減される一方で、背景情報へのアクセスが維持される。</p>
<h3 id="Strategic-RAG" class="common-anchor-header">戦略的RAG</h3><p>情報検索は、選択的であってこそ力を発揮する。厳格なフィルタリングと品質管理を通じて外部知識を導入し、モデルが適切かつ正確な入力を消費するようにします。どのようなデータ・パイプラインでもそうであるように、ガベージ・イン、ガベージ・アウトであるが、高品質の検索によって、コンテキストは負債ではなく資産となる。</p>
<h3 id="Optimized-Tool-Loading" class="common-anchor-header">最適化されたツールロード</h3><p>ツールの数が多ければ多いほどパフォーマンスが向上するわけではありません。研究によれば、利用可能なツールが30を超えると信頼性は急激に低下する。与えられたタスクに必要な機能だけをロードし、残りの機能にはアクセスできないようにする。無駄のないツールボックスは精度を高め、意思決定を圧倒するノイズを減らす。</p>
<h2 id="The-Infrastructure-Challenge-of-Context-Engineering" class="common-anchor-header">コンテキスト・エンジニアリングのインフラへの挑戦<button data-href="#The-Infrastructure-Challenge-of-Context-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>コンテキスト・エンジニアリングは、それが実行されるインフラストラクチャーがあって初めて効果を発揮する。そして今日の企業は、データに関する課題のパーフェクト・ストームに見舞われている：</p>
<h3 id="Scale-Explosion--From-Terabytes-to-Petabytes" class="common-anchor-header">規模の爆発 - テラバイトからペタバイトへ</h3><p>今日、データの増加はベースラインを再定義している。かつては1つのデータベースに快適に収まっていたワークロードは、今やペタバイトに及び、分散ストレージとコンピューティングを要求している。かつては1行のSQL更新で済んでいたスキーマの変更も、クラスタ、パイプライン、サービスにまたがる完全なオーケストレーション作業へと連鎖する可能性がある。スケーリングとは、単にハードウェアを追加することではなく、あらゆる仮定がストレステストされる規模での協調性、弾力性、伸縮性をエンジニアリングすることなのだ。</p>
<h3 id="Consumption-Revolution--Systems-That-Speak-AI" class="common-anchor-header">消費革命 - AIを話すシステム</h3><p>AIエージェントは単にデータを照会するだけでなく、マシンスピードで継続的にデータを生成、変換、消費する。人間向けのアプリケーションのためだけに設計されたインフラでは追いつけません。エージェントをサポートするためには、システムは低レイテンシーでの検索、ストリーミング更新、書き込みの多いワークロードを破綻なく提供しなければならない。言い換えれば、インフラ・スタックは、後付けではなく、本来のワークロードとして「AIを話す」ように構築されなければならない。</p>
<h3 id="Multimodal-Complexity--Many-Data-Types-One-System" class="common-anchor-header">マルチモーダルな複雑性 - 多くのデータタイプ、1つのシステム</h3><p>AIのワークロードは、テキスト、画像、音声、動画、高次元埋め込みデータを融合し、それぞれに豊富なメタデータが付加されている。この異種性を管理することが、実用的なコンテキストエンジニアリングの核心である。課題は、単に多様なオブジェクトを保存することではなく、それらをインデックス化し、効率的に検索し、モダリティ間でセマンティックな一貫性を保つことである。真にAIに対応したインフラは、マルチモーダリティをボルトオン機能ではなく、第一級の設計原理として扱わなければならない。</p>
<h2 id="Milvus-+-Loon-Purpose-Built-Data-Infrastructure-for-AI" class="common-anchor-header">Milvus + Loon：AIのための目的別データ基盤<button data-href="#Milvus-+-Loon-Purpose-Built-Data-Infrastructure-for-AI" class="anchor-icon" translate="no">
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
    </button></h2><p>スケール、消費、マルチモダリティの課題は、理論だけでは解決できない。<strong>Milvusと</strong> <strong>Loonを</strong>連携させ、実行時の高性能検索と上流での大規模データ処理という両側面の問題に対応できるように設計したのは<a href="https://zilliz.com/">その</a>ためです。</p>
<ul>
<li><p><a href="https://milvus.io/"><strong>Milvus</strong></a>：高性能なベクトル検索と保存のために最適化された、最も広く採用されているオープンソースのベクトルデータベース。</p></li>
<li><p><strong>Loon</strong>：大規模なマルチモーダルデータをデータベースに到達する前に処理・整理するために設計された、クラウドネイティブなマルチモーダルデータレイクサービスです。ご期待ください。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/multimodal_data_lake_min_ddc3de6ea4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Lightning-Fast-Vector-Search" class="common-anchor-header">高速ベクトル検索</h3><p><strong>Milvusは</strong>ベクターワークロードのためにゼロから構築されています。サービングレイヤーとして、テキスト、画像、音声、動画のいずれに由来するものであっても、数億、あるいは数十億のベクトルに対して10ms以下の検索を実現します。AIアプリケーションにとって、検索速度は「あればいい」ものではない。エージェントが反応するのか鈍いのか、検索結果が適切なのかズレているのかを決定するものだ。ここでのパフォーマンスは、エンドユーザー・エクスペリエンスに直接現れます。</p>
<h3 id="Multimodal-Data-Lake-Service-at-Scale" class="common-anchor-header">大規模なマルチモーダルデータレイクサービス</h3><p><strong>Loonは</strong>、非構造化データの大規模なオフライン処理と分析のために設計された、私たちの今後のマルチモーダルデータレイクサービスです。Milvusをパイプライン面で補完し、データベースに到達する前にデータを準備します。テキスト、画像、音声、動画にまたがる実世界のマルチモーダルデータセットは、重複、ノイズ、一貫性のないフォーマットなど、しばしば乱雑になりがちだ。Loonは、RayやDaftのような分散フレームワークを使ってこのような重い作業を行い、データを圧縮、重複排除、クラスタリングしてから、Milvusに直接ストリーミングします。その結果、ステージングのボトルネックもなく、フォーマット変換の手間もかかりません。</p>
<h3 id="Cloud-Native-Elasticity" class="common-anchor-header">クラウドネイティブの柔軟性</h3><p>どちらのシステムもクラウドネイティブに構築されており、ストレージとコンピュートは独立してスケーリングされます。つまり、ワークロードがギガバイトからペタバイトに増大しても、どちらか一方を過剰にプロビジョニングしたり、もう一方を過小評価したりすることなく、リアルタイムの配信とオフラインのトレーニングの間でリソースのバランスを取ることができます。</p>
<h3 id="Future-Proof-Architecture" class="common-anchor-header">将来性のあるアーキテクチャ</h3><p>最も重要なのは、このアーキテクチャがお客様とともに成長するように設計されていることです。コンテキスト・エンジニアリングはまだ進化を続けている。現在、ほとんどのチームはセマンティック検索とRAGパイプラインに集中している。しかし、次の波は、複数のデータタイプを統合し、それらを横断して推論し、エージェント駆動型のワークフローをパワーアップする、より多くのことを要求するようになるだろう。</p>
<p>MilvusとLoonを使えば、その移行に基盤を取り払う必要はない。今日のユースケースをサポートする同じスタックは、明日のユースケースにも自然に拡張できる。最初からやり直すことなく新たな機能を追加できるため、リスクやコストが軽減され、AIワークロードが複雑化してもスムーズに移行できます。</p>
<h2 id="Your-Next-Move" class="common-anchor-header">次の一手<button data-href="#Your-Next-Move" class="anchor-icon" translate="no">
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
    </button></h2><p>コンテキスト・エンジニアリングは単なる技術的な専門分野ではなく、AIの創造的な可能性を引き出しながら、地に足のついた信頼性を維持する方法です。これらのアイデアを実践する準備ができたら、最も重要なところから始めましょう。</p>
<ul>
<li><p><a href="https://milvus.io/docs/overview.md"><strong>Milvusを使って実験し</strong></a>、ベクトル・データベースが実世界での検索をどのように支えるかをご覧ください。</p></li>
<li><p><a href="https://www.linkedin.com/company/the-milvus-project/"><strong>Milvusをフォローして</strong></a>、Loonのリリースの最新情報や大規模なマルチモーダルデータの管理に関する洞察を得ましょう。</p></li>
<li><p><a href="https://discord.com/invite/8uyFbECzPX"><strong>DiscordのZillizコミュニティに</strong></a>参加して、戦略を共有し、アーキテクチャを比較し、ベストプラクティスを形成する手助けをしましょう。</p></li>
</ul>
<p>今日、コンテキスト・エンジニアリングをマスターした企業が、明日のAIの展望を形作るだろう。インフラを制約にせず、AIの創造性にふさわしい基盤を構築しましょう。</p>
