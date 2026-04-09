---
id: harness-engineering-ai-agents.md
title: ハーネスエンジニアリングAIエージェントが実際に必要とする実行レイヤー
author: Min Yin
date: 2026-4-9
cover: assets.zilliz.com/05842e3a_b21b_41c9_9d29_13b8d7afa211_428ab449a7.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  harness engineering, AI agent infrastructure, hybrid search, Milvus 2.6,
  Sparse-BM25
meta_title: |
  What Is Harness Engineering for AI Agents? | Milvus
desc: >-
  ハーネス・エンジニアリングは自律型AIエージェントの実行環境を構築します。それが何であるか、OpenAIがそれをどのように使用したか、そしてなぜハイブリッド検索が必要なのかを学ぶ。
origin: 'https://milvus.io/blog/harness-engineering-ai-agents.md'
---
<p>ミッチェル・ハシモトはHashiCorpを設立し、Terraformを共同開発した。2026年2月、彼はAIエージェントと働く中で身につけた習慣を<a href="https://mitchellh.com/writing/my-ai-adoption-journey">ブログで</a>発表した。エージェントがミスを犯すたびに、彼はエージェントの環境に恒久的な修正を加えるというものだ。彼はこれを "エンジニアリング・ザ・ハーネス "と呼んだ。数週間のうちに、<a href="https://openai.com/index/harness-engineering/">OpenAIと</a> <a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">Anthropicは</a>このアイデアを発展させたエンジニアリング記事を発表した。<em>ハーネス・エンジニアリングという</em>言葉が登場したのだ。</p>
<p>ハーネス・エンジニアリングという言葉は、<a href="https://zilliz.com/glossary/ai-agents">AIエージェントを</a>開発するすべてのエンジニアがすでにぶつかっている問題であるため、反響を呼んだ。<a href="https://zilliz.com/glossary/prompt-as-code-(prompt-engineering)">プロンプト・エンジニアリングは</a>、シングルターンのアウトプットを向上させる。コンテキスト・エンジニアリングは、モデルが見ているものを管理する。しかしどちらも、エージェントが何時間も自律的に動作し、監視なしに何百もの決断を下した場合に何が起こるかには対応していない。ハーネス・エンジニアリングは、このギャップを埋めるものであり、ほとんどの場合、ハイブリッド検索（全文検索とセマンティック検索のハイブリッド）に依存している。</p>
<h2 id="What-Is-Harness-Engineering" class="common-anchor-header">ハーネス・エンジニアリングとは？<button data-href="#What-Is-Harness-Engineering" class="anchor-icon" translate="no">
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
    </button></h2><p>ハーネス・エンジニアリングとは、自律型AIエージェントの実行環境を設計する学問である。エージェントがどのツールを呼び出し、どこで情報を取得し、どのように自身の決定を検証し、いつ停止すべきかを定義する。</p>
<p>なぜハーネスエンジニアリングが重要なのかを理解するために、AIエージェント開発の3つのレイヤーを考えてみよう：</p>
<table>
<thead>
<tr><th>レイヤー</th><th>何を最適化するか</th><th>スコープ</th><th>例</th></tr>
</thead>
<tbody>
<tr><td><strong>プロンプトエンジニアリング</strong></td><td>モデルに対して言うこと</td><td>単一のやりとり</td><td>少数の例、思考連鎖のプロンプト</td></tr>
<tr><td><strong>コンテキスト・エンジニアリング</strong></td><td>モデルから見えるもの</td><td><a href="https://zilliz.com/glossary/context-window">コンテキストウィンドウ</a></td><td>ドキュメント検索、履歴圧縮</td></tr>
<tr><td><strong>ハーネスエンジニアリング</strong></td><td>エージェントが動作する世界</td><td>複数時間の自律実行</td><td>ツール、検証ロジック、アーキテクチャ制約</td></tr>
</tbody>
</table>
<p><strong>プロンプトエンジニアリングは</strong>、1回のやり取りの品質を最適化する。一つの会話、一つのアウトプット。</p>
<p><strong>コンテキスト・エンジニアリングは</strong>、モデルが一度に見ることができる情報の量を管理する。どの文書を検索するか、履歴を圧縮するか、何がコンテキスト・ウィンドウに収まり、何が削除されるか。</p>
<p><strong>ハーネスエンジニアリングは</strong>、エージェントが操作する世界を構築する。ツール、ナレッジソース、検証ロジック、アーキテクチャ上の制約など、エージェントが人間の監視なしに何百もの意思決定にわたって確実に実行できるかどうかを決定するあらゆるものが含まれる。</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_4_2f4bc35890.png" alt="Three layers of AI agent development: Prompt Engineering optimizes what you say, Context Engineering manages what the model sees, and Harness Engineering designs the execution environment" class="doc-image" id="three-layers-of-ai-agent-development:-prompt-engineering-optimizes-what-you-say,-context-engineering-manages-what-the-model-sees,-and-harness-engineering-designs-the-execution-environment" />
   <span>AIエージェント開発の3つのレイヤープロンプトエンジニアリングは発言内容を最適化し、コンテキストエンジニアリングはモデルが見る内容を管理し、ハーネスエンジニアリングは実行環境を設計する。</span> </span></p>
<p>最初の2つのレイヤーは、1回のターンの質を形成する。3つ目のレイヤーは、エージェントがあなたの監視なしに何時間も操作できるかどうかを決定する。</p>
<p>これらは競合するアプローチではない。これらは進歩の過程なのだ。エージェントの能力が向上するにつれて、同じチームが3つのレイヤーを通過していく。</p>
<h2 id="How-OpenAI-Used-Harness-Engineering-to-Build-a-Million-Line-Codebase-and-Lessons-They-Learnt" class="common-anchor-header">OpenAIがHarness Engineeringを使って100万行のコードベースを構築した方法とその教訓<button data-href="#How-OpenAI-Used-Harness-Engineering-to-Build-a-Million-Line-Codebase-and-Lessons-They-Learnt" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAIは、Harness Engineeringを具体的に示す社内実験を行った。その様子は、エンジニアリングブログの投稿<a href="https://openai.com/index/harness-engineering/">「Harness Engineering</a>」で紹介されている：Harness Engineering:<a href="https://openai.com/index/harness-engineering/">Leveraging Codex in an Agent-First World "という</a>ブログ記事で紹介<a href="https://openai.com/index/harness-engineering/">されています。</a>3人のチームが2025年8月下旬に空のリポジトリからスタートした。OpenAIのAIを搭載したコーディングエージェントであるCodexがすべての行を生成した。その結果、100万行のプロダクションコードと1,500のプルリクエストがマージされた。</p>
<p>興味深いのは成果物ではない。彼らが突き当たった4つの問題と、彼らが構築したハーネスレイヤーのソリューションだ。</p>
<h3 id="Problem-1-No-Shared-Understanding-of-the-Codebase" class="common-anchor-header">問題1：コードベースの共通理解がない</h3><p>エージェントはどの抽象化レイヤーを使うべきか？命名規則は？先週のアーキテクチャの議論はどこへ行ったのか？答えがないまま、エージェントは推測し、そして間違った推測を繰り返した。</p>
<p>最初の直感は、すべての規約、ルール、歴史的な決定を含む<code translate="no">AGENTS.md</code> 。それは4つの理由で失敗した。コンテキストは希少であり、肥大化した指示ファイルは実際のタスクを混雑させる。すべてが重要だとマークされると、何も重要でなくなる。文書は腐敗する-2週目のルールが8週目には間違っている。また、平坦な文書は機械的に検証することができない。</p>
<p>対策：<code translate="no">AGENTS.md</code> を100行に縮める。ルールではなくマップ。これは、設計決定、実行計画、製品仕様、参照ドキュメントを含む構造化された<code translate="no">docs/</code> ディレクトリを指す。リンターとCIは、クロスリンクが無傷であることを検証する。エージェントは必要なものに正確にナビゲートする。</p>
<p>基本原則：実行時にコンテキストにないものは、エージェントにとって存在しない。</p>
<h3 id="Problem-2-Human-QA-Couldnt-Keep-Pace-with-Agent-Output" class="common-anchor-header">問題2：人間のQAがエージェントの出力に追いつけない</h3><p>チームはChrome DevTools ProtocolをCodexにプラグインした。エージェントはUIパスのスクリーンショット、ランタイムイベントの観察、LogQLによるログのクエリ、PromQLによるメトリクスのクエリを行うことができました。彼らは具体的なしきい値を設定しました：タスクが完了したとみなされる前に、サービスが800ミリ秒未満で開始されなければなりませんでした。Codexのタスクは、エンジニアが寝ている間に、一度に6時間以上実行された。</p>
<h3 id="Problem-3-Architectural-Drift-Without-Constraints" class="common-anchor-header">問題3：制約のないアーキテクチャのドリフト</h3><p>ガードレールがないため、エージェントはレポで見つけたパターンを何でも再現した。</p>
<p>解決策：タイプ → コンフィグ → レポ → サービス → ランタイム → UI という単一の依存性の方向性を強制する厳密なレイヤーアーキテクチャ。カスタムのリンターは、インラインで修正命令を含むエラーメッセージを表示して、これらのルールを機械的に実施しました。</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_3_f0fc3c9e92.png" alt="Strict layered architecture with one-way dependency validation: Types at the base, UI at the top, custom linters enforce rules with inline fix suggestions" class="doc-image" id="strict-layered-architecture-with-one-way-dependency-validation:-types-at-the-base,-ui-at-the-top,-custom-linters-enforce-rules-with-inline-fix-suggestions" />
   <span>一方向の依存性検証を行う厳格なレイヤーアーキテクチャ：型がベース、UIがトップ、カスタムリンターがインライン修正提案でルールを実施</span> </span></p>
<p>人間のチームでは、この制約は通常、会社が何百人ものエンジニアにスケールしたときにやってくる。コーディング・エージェントにとっては、初日から必須条件です。エージェントが制約なしに速く動けば動くほど、アーキテクチャのドリフトは悪化する。</p>
<h3 id="Problem-4-Silent-Technical-Debt" class="common-anchor-header">問題4：無言の技術的負債</h3><p>解決策：プロジェクトのコアとなる原則をリポジトリにエンコードし、バックグラウンドでCodexタスクをスケジュール通りに実行し、逸脱をスキャンしてリファクタリングPRを提出する。定期的な精算ではなく、少額の継続的な支払い。</p>
<h2 id="Why-AI-Agents-Cant-Grade-Their-Own-Work" class="common-anchor-header">AIエージェントが自分の仕事を採点できない理由<button data-href="#Why-AI-Agents-Cant-Grade-Their-Own-Work" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAIの実験は、Harness Engineeringが機能することを証明した。しかし、別の研究により、AIエージェントは自分自身のアウトプットを評価するのがシステム的に苦手であるという、AIエージェントの内部での失敗モードが明らかになった。</p>
<p>この問題は2つの形で現れる。</p>
<p><strong>コンテキスト不安。</strong>コンテキストウィンドウがいっぱいになると、エージェントは早々にタスクを終了し始める。仕事が終わったからではなく、ウィンドウの限界が近づいているのを感じるからだ。AIコーディングエージェントDevinの開発チームであるCognitionは、Claude Sonnet 4.5のためにDevinを再構築している間に<a href="https://cognition.ai/blog/devin-sonnet-4-5-lessons-and-challenges">この挙動を記録した</a>。</p>
<p>彼らの修正は純粋なハーネス・エンジニアリングだった。彼らは1Mトークンのコンテキスト・ベータを有効にしたが、実際の使用量は20万トークンに制限した。不安は消えた。モデルを変更する必要はなく、よりスマートな環境になっただけだ。</p>
<p>最も一般的な緩和策はコンパクションである。履歴を要約し、同じエージェントに圧縮されたコンテキストで継続させる。これは継続性を維持するが、根本的な行動を排除するものではない。別の方法は、コンテキストのリセットである。ウィンドウをクリアし、新しいインスタンスをスピンアップし、構造化されたアーティファクトを通して状態を引き渡す。これは、不安の引き金を完全に取り除きますが、完全なハンドオフドキュメントを要求します - アーティファクトのギャップは、新しいエージェントの理解のギャップを意味します。</p>
<p><strong>自己評価バイアス。</strong>エージェントは自分のアウトプットを評価するとき、それを高く評価する。客観的な合否基準があるタスクでさえ、エージェントは問題を発見し、それが深刻な問題ではないと自分に言い聞かせ、失敗すべき仕事を承認してしまう。</p>
<p>この問題は、GAN（Generative Adversarial Networks：生成機能と評価機能を完全に分離したもの）から解決される。GANでは、2つのニューラルネットワークが競合し、一方が生成し、一方が判断する。同じ力学が<a href="https://milvus.io/blog/openagents-milvus-how-to-build-smarter-multi-agent-systems-that-share-memory.md">マルチエージェントシステムにも</a>当てはまる。</p>
<p>Anthropicは、3エージェントのハーネス（プランナー、ジェネレーター、エバリュエーター）を使って、2Dレトロゲームエンジンを構築するタスクについて、単独エージェントと対戦させる実験を行った。彼らはその実験の全容を<a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">"Harness Design for Long-Running Application Development"</a>(Anthropic, 2026)に記述している。プランナーは、短いプロンプトを完全な製品仕様に展開し、意図的に実装の詳細を特定しないままにする。ジェネレーターはスプリントで機能を実装するが、コードを書く前に、評価者とスプリント契約を結ぶ。EvaluatorはPlaywright（Microsoftのオープンソースのブラウザ自動化フレームワーク）を使って、実際のユーザーのようにアプリケーションをクリックし、UI、API、データベースの動作をテストする。何か失敗があれば、そのスプリントは失敗となる。</p>
<p>単独のエージェントは、技術的には起動するゲームを作成したが、エンティティからランタイムへの接続がコードレベルで壊れていた。3エージェントハーネスでは、AIによるレベル生成、スプライトアニメーション、効果音でプレイ可能なゲームを作成した。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_1_38a13120a7.png" alt="Comparison of solo agent versus three-agent harness: solo agent ran 20 minutes at nine dollars with broken core functionality, while the full harness ran 6 hours at two hundred dollars producing a fully functional game with AI-assisted features" class="doc-image" id="comparison-of-solo-agent-versus-three-agent-harness:-solo-agent-ran-20-minutes-at-nine-dollars-with-broken-core-functionality,-while-the-full-harness-ran-6-hours-at-two-hundred-dollars-producing-a-fully-functional-game-with-ai-assisted-features" />
   </span> <span class="img-wrapper"> <span>ソロエージェントと3エージェントハーネスの比較: ソロエージェントは20分、9ドルで動作し、コア機能は壊れていた。</span> </span></p>
<p>スリーエージェントアーキテクチャは約20倍のコストがかかった。出力は、使えないものから使えるものへと変化した。これが、ハーネス・エンジニアリングの核となる取引である。信頼性と引き換えに、構造的なオーバーヘッドが発生するのだ。</p>
<h2 id="The-Retrieval-Problem-Inside-Every-Agent-Harness" class="common-anchor-header">すべてのエージェント・ハーネスの内部にある検索問題<button data-href="#The-Retrieval-Problem-Inside-Every-Agent-Harness" class="anchor-icon" translate="no">
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
    </button></h2><p>構造化された<code translate="no">docs/</code> システムとジェネレーター/エバリュエーター スプリントサイクルの両パターンは、無言の依存関係を共有している：エージェントは、必要なときに、ライブで進化する知識ベースから正しい情報を見つけなければならない。</p>
<p>これは見た目よりも難しい。具体的な例を挙げよう：ジェネレーターはスプリント3を実行しており、ユーザー認証を実装している。コードを書く前に、ジェネレーターは2種類の情報を必要とする。</p>
<p>まず、<a href="https://zilliz.com/glossary/semantic-search">セマンティック検索</a>クエリ：<em>ユーザーセッションに関するこの製品の設計原則は何か？</em>関連文書は "ユーザー認証 "ではなく、"セッション管理 "や "アクセス制御 "を使うかもしれない。意味的な理解がなければ、検索はそれを見逃してしまう。</p>
<p>次に、完全一致クエリです。<em>どの文書が<code translate="no">validateToken</code> 関数を参照していますか？</em>関数名は意味的な意味を持たない任意の文字列です。<a href="https://zilliz.com/glossary/vector-embeddings">埋め込みベースの検索では</a>確実に見つけることはできない。キーワードマッチのみが有効です。</p>
<p>この2つのクエリは同時に発生する。連続したステップに分けることはできない。</p>
<p>純粋な<a href="https://zilliz.com/learn/vector-similarity-search">ベクトル検索は</a>完全一致では失敗する。従来の<a href="https://milvus.io/docs/embed-with-bm25.md">BM25は</a>セマンティッククエリで失敗し、文書がどの語彙を使うか予測できない。Milvus 2.5以前の唯一の選択肢は、2つの並列検索システム-ベクトルインデックスと<a href="https://milvus.io/docs/full-text-search.md">フルテキストインデックス</a>-をカスタム結果融合ロジックでクエリ時に同時に実行することでした。継続的に更新される<code translate="no">docs/</code> リポジトリでは、両方のインデックスを同期させる必要があり、文書が変更されるたびに2箇所でインデックスが再作成され、常に不整合のリスクがありました。</p>
<h2 id="How-Milvus-26-Solves-Agent-Retrieval-with-a-Single-Hybrid-Pipeline" class="common-anchor-header">Milvus 2.6が単一のハイブリッドパイプラインでエージェント検索を解決する方法<button data-href="#How-Milvus-26-Solves-Agent-Retrieval-with-a-Single-Hybrid-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusは、AIワークロードのために設計されたオープンソースの<a href="https://zilliz.com/learn/what-is-vector-database">ベクトルデータベース</a>です。Milvus 2.6のSparse-BM25は、デュアルパイプラインの検索問題を単一のシステムに統合します。</p>
<p>Milvusはインジェスト時に、意味検索用の<a href="https://zilliz.com/learn/sparse-and-dense-embeddings">密な埋め込みと</a>、BM25スコアリング用の<a href="https://milvus.io/docs/sparse_vector.md">TFエンコードされたスパースベクトルの</a>2つの表現を同時に生成する。グローバル<a href="https://zilliz.com/learn/tf-idf-understanding-term-frequency-inverse-document-frequency-in-nlp">IDF統計は</a>文書の追加や削除に応じて自動的に更新される。クエリ時には、自然言語入力によって両方のクエリベクタが内部的に生成される。<a href="https://milvus.io/docs/rrf-ranker.md">レシプロランクフュージョン(RRF)は</a>ランク付けされた結果をマージし、呼び出し元は単一の統一された結果セットを受け取る。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/harness_engineering_ai_agents_2_8504a6ee08.png" alt="Before and after: two separate systems with manual sync, fragmented results, and custom fusion logic versus Milvus 2.6 single pipeline with dense embedding, Sparse BM25, RRF fusion, and automatic IDF maintenance producing unified results" class="doc-image" id="before-and-after:-two-separate-systems-with-manual-sync,-fragmented-results,-and-custom-fusion-logic-versus-milvus-2.6-single-pipeline-with-dense-embedding,-sparse-bm25,-rrf-fusion,-and-automatic-idf-maintenance-producing-unified-results" />
   </span> <span class="img-wrapper"> <span>ビフォーアフター：手動同期、断片化された結果、カスタムフュージョンロジックを持つ2つの別々のシステムと、密な埋め込み、スパースBM25、RRFフュージョン、自動IDFメンテナンスを持つMilvus 2.6シングルパイプラインの比較。</span> </span></p>
<p>一つのインターフェース。維持するインデックスは1つ。</p>
<p><a href="https://zilliz.com/glossary/beir">BEIRベンチマーク</a>（18の異種検索データセットをカバーする標準評価スイート）において、MilvusはElasticsearchと同等のリコールで3-4倍のスループットを達成し、特定のワークロードでは最大7倍のQPSを改善しました。スプリントシナリオでは、1つのクエリでセッション設計の原則（セマンティックパス）と<code translate="no">validateToken</code> （正確なパス）に言及している全てのドキュメントの両方を検索します。<code translate="no">docs/</code> リポジトリは継続的に更新される。BM25 IDFメンテナンスは、新しく書かれた文書がバッチ再構築なしで次のクエリのスコアリングに参加することを意味する。</p>
<p>これはまさにこのクラスの問題のために構築された検索レイヤである。エージェントハーネスが生きた知識ベース（コード文書、設計決定、スプリント履歴など）を検索する必要がある場合、シングルパイプラインのハイブリッド検索は便利な機能ではありません。それはハーネスの残りの部分を機能させるものです。</p>
<h2 id="The-Best-Harness-Components-Are-Designed-to-Be-Deleted" class="common-anchor-header">最高のハーネスコンポーネントは削除されることを前提に設計されている<button data-href="#The-Best-Harness-Components-Are-Designed-to-Be-Deleted" class="anchor-icon" translate="no">
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
    </button></h2><p>ハーネスのすべてのコンポーネントは、モデルの限界に関する仮定を内包している。スプリントの分解は、モデルが長いタスクで一貫性を失ったときに必要だった。コンテキストのリセットは、モデルがウインドウの限界近くで不安を感じたときに必要だった。評価エージェントは、自己評価のバイアスが手に負えないときに必要になる。</p>
<p>これらの仮定は期限切れになる。モデルが本物の長いコンテキストのスタミナを身につけるにつれて、認知のコンテクスト・ウィンドウのトリックは不要になるかもしれない。モデルの改良が進むにつれて、他のコンポーネントは、信頼性を高めることなくエージェントの速度を低下させる不要なオーバーヘッドとなるだろう。</p>
<p>ハーネス・エンジニアリングは、固定されたアーキテクチャではない。新しいモデルがリリースされるたびに再調整されるシステムなのだ。メジャーアップグレード後の最初の質問は、"何を追加できるか "ではない。それは "何を削除できるか？"だ。</p>
<p>同じ論理が検索にも当てはまる。モデルがより長いコンテクストをより確実に扱うようになれば、チャンキング戦略と検索のタイミングは変化する。今日は注意深く断片化する必要がある情報でも、明日は全ページとして取り込むことができるかもしれない。検索インフラはモデルと共に適応する。</p>
<p>うまく構築されたハーネスのあらゆるコンポーネントは、よりスマートなモデルによって冗長化されるのを待っている。それは問題ではない。それがゴールなのだ。</p>
<h2 id="Get-Started-with-Milvus" class="common-anchor-header">Milvusを始めよう<button data-href="#Get-Started-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>セマンティック検索とキーワード検索を1つのパイプラインで行うハイブリッド検索を必要とするエージェントインフラストラクチャを構築する場合、ここから始めましょう：</p>
<ul>
<li><a href="https://milvus.io/blog/introduce-milvus-2-6-built-for-scale-designed-to-reduce-costs.md"><strong>Milvus2.6のリリースノートでは</strong></a>、Sparse-BM25、IDFの自動メンテナンス、パフォーマンスベンチマークについて詳しく説明しています。</li>
<li><a href="https://milvus.io/community"><strong>Milvusコミュニティに</strong></a>参加し、質問したり、あなたが作っているものを共有しましょう。</li>
<li><a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"><strong>Milvusオフィスアワー(無料)を予約</strong></a>し、ベクターデータベースのエキスパートとあなたのユースケースについて話し合いましょう。</li>
<li>インフラストラクチャのセットアップを省きたい場合は、<a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloud</strong></a>(フルマネージドMilvus)の無料ティアをご利用ください。</li>
<li>GitHubのスター:<a href="https://github.com/milvus-io/milvus"><strong>milvus-io/milvus</strong></a>- 43k+ stars and growing.</li>
</ul>
<h2 id="Frequently-Asked-Questions" class="common-anchor-header">よくある質問<button data-href="#Frequently-Asked-Questions" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="What-is-harness-engineering-and-how-is-it-different-from-prompt-engineering" class="common-anchor-header">ハーネスエンジニアリングとは何ですか？</h3><p>プロンプトエンジニアリングは、1回のやり取りでモデルに対して話す内容（言い回し、構成、例）を最適化します。ハーネス・エンジニアリングは、自律的なAIエージェントの周囲に実行環境を構築します：AIエージェントが呼び出せるツール、アクセスできる知識、作業をチェックする検証ロジック、アーキテクチャのドリフトを防ぐ制約などです。プロンプトエンジニアリングは、1つの会話ターンを形成する。ハーネスエンジニアリングは、エージェントが人間の監督なしに何百もの意思決定にわたって何時間も確実に動作できるかどうかを形作ります。</p>
<h3 id="Why-do-AI-agents-need-both-vector-search-and-BM25-at-the-same-time" class="common-anchor-header">なぜAIエージェントはベクトル検索とBM25の両方を同時に必要とするのか？</h3><p>エージェントは、根本的に異なる2つの検索クエリに同時に答えなければならない。セマンティッククエリ -<em>ユーザーセッションに関する設計原則とは？</em>- は、語彙に関係なく、概念的に関連するコンテンツをマッチさせるために、高密度のベクトル埋め込みを必要とする。完全一致クエリ-<em>どの文書が<code translate="no">validateToken</code> 関数を参照しているか？</em>- 関数名は意味的な意味を持たない任意の文字列であるため、BM25キーワードスコアリングが必要。どちらか一方しか扱わない検索システムは、もう一方のタイプのクエリを系統的に見逃すことになる。</p>
<h3 id="How-does-Milvus-Sparse-BM25-work-for-agent-knowledge-retrieval" class="common-anchor-header">Milvus Sparse-BM25はどのようにエージェントの知識検索を行うのか？</h3><p>Milvusはインジェスト時に、各文書に対して密な埋め込みとTFエンコードされたスパースベクトルを同時に生成する。グローバルIDF統計は、知識ベースの変化に応じてリアルタイムに更新されるため、手動によるインデックス再作成は不要です。クエリ時には、両方のベクトルタイプが内部的に生成され、Reciprocal Rank Fusionがランク付けされた結果をマージし、エージェントは単一の統一された結果セットを受け取ります。パイプライン全体は、1つのインターフェースと1つのインデックスを通して実行されます。これは、コード・ドキュメンテーション・リポジトリのような継続的に更新されるナレッジベースにとって重要です。</p>
<h3 id="When-should-I-add-an-evaluator-agent-to-my-agent-harness" class="common-anchor-header">エージェントハーネスに評価エージェントを追加するタイミングは？</h3><p>ジェネレータの出力品質が自動テストだけでは検証できない場合や、自己評価バイアスによって欠陥の見逃しが発生した場合に、別の評価エージェントを追加します。重要な原則は、Evaluator は Generator からアーキテクチャ的に分離されていることです。評価者は、コードをレビューするだけでなく、動作をテストするためのランタイムツール（ブラウザ自動化、APIコール、データベースクエリ）にアクセスできる必要があります。Anthropicの<a href="https://www.anthropic.com/engineering/harness-design-long-running-apps">研究では</a>、このGANにインスパイアされた分離が、アウトプットの品質を "技術的には起動するが、壊れている "から "ソロエージェントが試さなかった機能で完全に機能する "に移行させることを発見した。</p>
