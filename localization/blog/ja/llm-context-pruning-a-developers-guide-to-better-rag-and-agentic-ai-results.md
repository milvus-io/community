---
id: llm-context-pruning-a-developers-guide-to-better-rag-and-agentic-ai-results.md
title: LLMコンテキストの刈り込み：より良いRAGとエージェントAIの結果を得るための開発者ガイド
author: Cheney Zhang
date: 2026-01-15T00:00:00.000Z
cover: assets.zilliz.com/context_pruning_cover_d1b034ba67.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Context Pruning, RAG, long context LLMs, context engineering'
meta_title: |
  LLM Context Pruning: Improving RAG and Agentic AI Systems
desc: >-
  長いコンテキストのRAGシステムにおいて、コンテキストの刈り込みがどのように機能するのか、なぜ重要なのか、また、Provenceのようなモデルがセマンティックフィルタリングを可能にし、実際にどのように機能するのかを学ぶ。
origin: >-
  https://milvus.io/blog/llm-context-pruning-a-developers-guide-to-better-rag-and-agentic-ai-results.md
---
<p>LLMのコンテキストウィンドウは最近巨大化している。モデルによっては1回のパスで100万個以上のトークンを扱えるものもあり、新しいリリースが出るたびにその数はさらに増えているようだ。それはエキサイティングなことだが、実際に長いコンテキストを使うものを作ったことがある人なら、<em>可能な</em>ことと<em>有用な</em>ことの間にギャップがあることを知っているだろう。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/LLM_Leaderboard_7c64e4a18c.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>モデルが1回のプロンプトで本全体を<em>読めるからといって</em>、それを与えるべきだということにはならない。ほとんどの長い入力は、モデルが必要としないものでいっぱいだ。1つのプロンプトに何十万ものトークンを入力し始めると、通常、応答が遅くなり、計算コストが高くなり、時には質の低い回答になります。</p>
<p>そのため、コンテキストウィンドウが大きくなり続けても、本当の問題は、<strong>そこに何を入れるべきか</strong>、ということになる。そこで<strong>コンテキスト・プルーニングの</strong>出番だ。コンテキスト刈り込みとは、基本的に、検索された、あるいは組み立てられたコンテキストのうち、モデルが質問に答えるのに役立たない部分を切り捨てる処理のことである。正しく行うことで、システムは高速で安定し、より予測しやすくなります。</p>
<p>この記事では、長いコンテキストがしばしば予想と異なる振る舞いをする理由、プルーニングがどのように物事をコントロールするのに役立つか、そして<strong>Provenceの</strong>ようなプルーニングツールがどのように実際のRAGパイプラインに適合し、セットアップを複雑にしないかについて説明する。</p>
<h2 id="Four-Common-Failure-Modes-in-Long-Context-Systems" class="common-anchor-header">ロングコンテキストシステムにおける4つの一般的な失敗モード<button data-href="#Four-Common-Failure-Modes-in-Long-Context-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>コンテキストウィンドウを大きくしたからといって、魔法のようにモデルが賢くなるわけではない。むしろ、いったん大量の情報をプロンプトに詰め込み始めると、物事がうまくいかなくなる可能性のある全く新しいセットの鍵を開けることになる。ここでは、ロングコンテキストシステムやRAGシステムを構築する際によく見られる4つの問題を紹介する。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Four_Failure_Modes_e9b9bcb3b2.PNG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="1-Context-Clash" class="common-anchor-header">1.コンテキストの衝突</h3><p>コンテキストの衝突は、複数のターンにわたって蓄積された情報が内部的に矛盾するようになったときに起こる。</p>
<p>例えば、あるユーザーが会話の早い段階で "リンゴが好き "と言い、後に "果物は嫌い "と言ったとする。両方の発言がコンテキストに残っている場合、モデルには矛盾を解決する信頼できる方法がないため、一貫性のない、またはためらった回答につながります。</p>
<h3 id="2-Context-Confusion" class="common-anchor-header">2.文脈の混乱</h3><p>コンテキストの混乱は、コンテキストの中に無関係な情報や関連性の弱い情報が大量に含まれてい る場合に生じ、モデルが正しい行動やツールを選択することを困難にする。</p>
<p>この問題は、特にツール拡張システムで顕著に現れる。コンテキストが無関係な詳細で乱雑になると、モデルはユーザーの意図を誤って解釈し、間違ったツールやアクションを選択することがあります。正しい選択肢がないからではなく、信号がノイズに埋もれているからです。</p>
<h3 id="3-Context-Distraction" class="common-anchor-header">3.コンテキストディストラクション</h3><p>コンテキストディストラクションは、過剰なコンテキスト情報がモデルの注意を支配し、事前に学習された知識や一般的な推論への依存を低下させる場合に起こります。</p>
<p>広範に学習されたパターンに依存する代わりに、モデルは、たとえそれが不完全であったり信頼性に欠けるものであっても、文脈の中の最近の詳細を過度に重視する。これは、より高いレベルの理解を適用するのではなく、コンテクストをあまりにも忠実に反映する、浅い、またはもろい推論につながる可能性がある。</p>
<h3 id="4-Context-Poisoning" class="common-anchor-header">4.文脈毒</h3><p>文脈毒は、誤った情報が文脈に入り込み、複数のターンにわたって繰り返し参照され、強化されることで発生する。</p>
<p>会話の初期に導入された1つの誤った発言が、その後の推論の基礎になることがある。対話が続くにつれて、モデルはこの欠陥のある仮定を基礎とし、誤りを複雑化し、正しい答えからさらに遠ざかる。</p>
<h2 id="What-Is-Context-Pruning-and-Why-It-Matters" class="common-anchor-header">コンテキストの刈り込みとは何か、なぜ重要なのか<button data-href="#What-Is-Context-Pruning-and-Why-It-Matters" class="anchor-icon" translate="no">
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
    </button></h2><p>長いコンテクストを扱い始めると、物事をコントロールし続けるためには、1つ以上のトリックが必要であることにすぐに気づく。RAG、ツールのロードアウト、要約、特定のメッセージの隔離、古い履歴のオフロードなどだ。これらはすべて、さまざまな方法で役立っている。しかし、<strong>Context Pruningは</strong>、<em>実際に何がモデルに供給されるかを</em>直接決定するものである。</p>
<p>コンテキスト・プルーニングとは、簡単に言えば、モデルのコンテキスト・ウィンドウに入る前に、無関係な情報、価値の低い情報、矛盾する情報を自動的に取り除くプロセスのことだ。基本的には、現在のタスクにとって最も重要と思われるテキスト部分のみを保持するフィルターである。</p>
<p>他のストラテジーは、コンテキストを再編成したり、圧縮したり、ある部分を後回しにしたりする。プルーニングはより直接的である。<strong>"この情報の一部をプロンプトに入れるべきか "という問いに答えるものである。</strong></p>
<p>これが、RAGシステムでプルーニングが特に重要になる理由である。ベクトル検索は素晴らしいが、完璧ではない。有用なもの、関連性の薄いもの、完全に的外れなものなど、候補の大きな福袋が返されることがよくある。それらをすべてプロンプトに放り込むと、先に説明したような失敗モードにぶつかることになる。プルーニングは検索とモデルの間に位置し、どのチャンクを残すかを決めるゲートキーパーの役割を果たす。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/RAG_Pipeline_with_Context_Pruning_01a0d40819.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>プルーニングがうまく機能すると、コンテキストがすっきりし、答えがより一貫し、トークンの使用量が減り、無関係なテキストが紛れ込むことによる奇妙な副作用が減るというメリットがすぐに現れます。検索セットアップを何も変えなくても、しっかりとしたプルーニングのステップを追加することで、システム全体のパフォーマンスを顕著に向上させることができる。</p>
<p>実際には、プルーニングはロングコンテキストやRAGパイプラインで最も活用度の高い最適化のひとつである。</p>
<h2 id="Provence-A-Practical-Context-Pruning-Model" class="common-anchor-header">Provence：実用的なコンテキスト・プルーニング・モデル<button data-href="#Provence-A-Practical-Context-Pruning-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>コンテキスト・プルーニングのアプローチを模索しているとき、私は<strong>Naver Labs Europeで</strong>開発された2つの魅力的なオープンソースモデルに出会った：<a href="https://huggingface.co/naver/provence-reranker-debertav3-v1"><strong>Provenceと</strong></a>その多言語版である<a href="https://huggingface.co/naver/xprovence-reranker-bgem3-v1"><strong>XProvence</strong></a>だ。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/provence1_b9d2c43276.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Provenceは、特に質問に答えることに焦点を当てた、検索補強された生成のための軽量なコンテキスト・プルーニング・モデルをトレーニングする方法である。ユーザーからの質問と検索された文章が与えられた場合、最終的な回答に寄与する情報のみを残し、無関係な文章を識別して削除する。</p>
<p>生成の前に価値の低いコンテンツを刈り込むことで、Provenceはモデルの入力のノイズを減らし、プロンプトを短くし、LLM推論の待ち時間を短縮します。また、プラグアンドプレイであるため、緊密な統合やアーキテクチャの変更を必要とせず、どのようなLLMや検索システムでも動作する。</p>
<p>Provenceは、実世界のRAGパイプラインにいくつかの実用的な機能を提供する。</p>
<p><strong>1.ドキュメントレベルの理解</strong></p>
<p>Provenceは、センテンスを単独でスコアリングするのではなく、ドキュメント全体について推論する。実世界の文書には、"it"、"this"、"the method above "といった参照が頻繁に含まれるため、これは重要である。単独では、これらの文章は曖昧であったり、無意味であったりする。文脈の中で見れば、それらの関連性が明らかになる。文書を全体的にモデル化することで、Provenceはより正確で首尾一貫した刈り込み決定を行う。</p>
<p><strong>2.適応的な文の選択</strong></p>
<p>Provenceは、検索された文書からどれだけのセンテンスを残すかを自動的に決定する。上位5文を残す」というような固定されたルールに頼るのではなく、クエリとコンテンツに適応する。</p>
<p>一つの文章で答えられる質問もあれば、複数の補足が必要な質問もある。Provenceはこの変化を動的に処理し、ドメイン間でうまく機能し、必要なときに調整できる関連性のしきい値を使用します。</p>
<p><strong>3.統合リランキングによる高効率</strong></p>
<p>Provenceは効率的に設計されている。コンパクトで軽量なモデルであるため、LLMベースの刈り込みアプローチよりも大幅に高速かつ安価に実行できる。</p>
<p>さらに重要なことは、Provenceはリランキングとコンテキストの刈り込みを1つのステップに統合できることである。リランキングはすでに最新のRAGパイプラインの標準的な段階であるため、この時点でプルーニングを統合することで、言語モデルに渡されるコンテキストの質を向上させながら、コンテキストのプルーニングの追加コストをゼロに近づけることができる。</p>
<p><strong>4.XProvenceによる多言語サポート</strong></p>
<p>ProvenceにはXProvenceという亜種もあり、同じアーキテクチャを使用するが、多言語データで学習される。これにより、中国語、英語、韓国語などの言語をまたいだクエリーやドキュメントの評価が可能となり、多言語やクロスリンガルのRAGシステムに適している。</p>
<h3 id="How-Provence-Is-Trained" class="common-anchor-header">Provenceの学習方法</h3><p>Provenceはクロスエンコーダーアーキテクチャに基づいたクリーンで効果的な学習設計を採用している。学習中、クエリーと検索された各パッセージは1つの入力に連結され、一緒にエンコードされる。これにより、モデルは質問と文章両方の完全な文脈を一度に観察し、それらの関連性を直接推論することができる。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/provence2_80523f7a9e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>この結合エンコーディングにより、Provenceはきめ細かい関連性シグナルから学習することができる。このモデルは軽量エンコーダとして<a href="https://zilliz.com/ai-faq/what-is-the-difference-between-bert-roberta-and-deberta-for-embeddings"><strong>DeBERTa</strong></a>上で微調整され、2つのタスクを同時に実行するように最適化されている：</p>
<ol>
<li><p><strong>文書レベルの関連性スコアリング（再ランクスコア）：</strong>このモデルは文書全体の関連性スコアを予測し、クエリとの一致度を示す。例えば、スコア0.8は強い関連性を表す。</p></li>
<li><p><strong>トークンレベルの関連性ラベリング（バイナリマスク）：</strong>並行して、モデルは各トークンにバイナリラベルを割り当て、クエリに関連（<code translate="no">1</code> ）か無関係（<code translate="no">0</code> ）かをマークする。</p></li>
</ol>
<p>その結果、訓練されたモデルは文書全体の関連性を評価し、どの部分を残すべきか削除すべきかを特定することができる。</p>
<p>推論時に、Provenceは関連性ラベルをトークン単位で予測する。これらの予測は文レベルで集約され、関連性の高いトークンが関連性の低いトークンより多ければ文は保持され、そうでなければ削除される。このモデルは文レベルの監視で学習されるため、同じ文内のトークン予測は一貫している傾向があり、この集約戦略は実際に信頼できる。プルーニングの動作は、より保守的またはより積極的なプルーニングを達成するために、集約しきい値を調整することによって調整することもできる。</p>
<p>Provenceは、ほとんどのRAGパイプラインが既に含んでいるリランキングステップを再利用する。つまり、コンテキスト刈り込みは、ほとんどオーバーヘッドを追加することなく追加することができ、Provenceを実世界のRAGシステムにとって特に実用的なものにしている。</p>
<h2 id="Evaluating-Context-Pruning-Performance-Across-Models" class="common-anchor-header">モデル間のコンテキスト刈り込み性能の評価<button data-href="#Evaluating-Context-Pruning-Performance-Across-Models" class="anchor-icon" translate="no">
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
    </button></h2><p>ここまで、Provenceの設計とトレーニングに焦点を当ててきた。次のステップは、Provenceが実際にどのように動作するかを評価することである。すなわち、Provenceがどの程度うまくコンテキストを刈り込んでいるか、他のアプローチと比較してどうか、実世界の条件下でどのように動作するか、である。</p>
<p>これらの質問に答えるために、我々は、現実的な評価設定において、複数のモデル間でコンテキスト刈り込みの品質を比較する一連の定量的実験を設計した。</p>
<p>実験では、次の2つの主要な目標に焦点を当てる：</p>
<ul>
<li><p><strong>刈り込みの有効性：</strong>Precision、Recall、F1スコアなどの標準的な測定基準を用いて、各モデルが関連性のない情報を除去しながら、関連性のあるコンテンツをどれだけ正確に保持しているかを測定する。</p></li>
<li><p><strong>ドメイン外汎化：</strong>各モデルが、学習データとは異なるデータ分布に対してどの程度のパフォーマンスを発揮するかを評価し、領域外のシナリオにおける頑健性を評価します。</p></li>
</ul>
<h3 id="Models-Compared" class="common-anchor-header">比較モデル</h3><ul>
<li><p><a href="https://huggingface.co/naver/provence-reranker-debertav3-v1"><strong>プロヴァンス</strong></a></p></li>
<li><p><a href="https://huggingface.co/naver/xprovence-reranker-bgem3-v1"><strong>XProvence</strong></a></p></li>
<li><p><a href="https://huggingface.co/opensearch-project/opensearch-semantic-highlighter-v1"><strong>OpenSearchセマンティックハイライター</strong></a>（セマンティックハイライティングタスクのために特別に設計された、BERTアーキテクチャに基づく刈り込みモデル）</p></li>
</ul>
<h3 id="Dataset" class="common-anchor-header">データセット</h3><p>WikiText-2を評価データセットとして使用する。WikiText-2はウィキペディアの記事から派生したもので、多様な文書構造を含み、関連する情報がしばしば複数の文にまたがり、意味的な関係が自明でない場合がある。</p>
<p>重要なことは、WikiText-2は、コンテキスト・プルーニング・モデルの学習に一般的に使用されるデータとは大きく異なるということである。このため、私たちの実験の主な焦点であるアウトオブドメインの評価に適しています。</p>
<h3 id="Query-Generation-and-Annotation" class="common-anchor-header">クエリー生成とアノテーション</h3><p>領域外刈り込みタスクを構築するために、<strong>GPT-4o-miniを用いて</strong>生のWikiText-2コーパスから質問と回答のペアを自動的に生成する。各評価サンプルは3つの要素から構成される：</p>
<ul>
<li><p><strong>質問：</strong>文書から生成された自然言語による質問。</p></li>
<li><p><strong>コンテキスト：</strong>変更されていない完全な文書。</p></li>
<li><p><strong>グランドトゥルース：</strong>どの文が答えを含み（保持され）、どれが無関係か（刈り込まれる）を示す文レベルの注釈。</p></li>
</ul>
<p>クエリと完全な文書が与えられた場合、モデルは実際に重要な文を特定しなければならない。答えを含む文は関連文としてラベル付けされ、保持されるべきであり、それ以外の文は無関係として扱われ、刈り込まれるべきである。この定式化により、Precision、Recall、F1スコアを用いて、刈り込みの品質を定量的に測定することができる。</p>
<p>重要なことは、生成された質問はどの評価モデルのトレーニングデータにも現れないということである。その結果、性能は暗記ではなく真の汎化を反映する。実世界の使用パターンをよりよく反映するために、単純な事実に基づく質問、マルチホップ推論タスク、およびより複雑な分析プロンプトにまたがる、合計300のサンプルを生成します。</p>
<h3 id="Evaluation-Pipeline" class="common-anchor-header">評価パイプライン</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/pipeline_77e52002fc.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>ハイパーパラメータの最適化：各モデルについて、事前に定義されたハイパーパラメータ空間上でグリッド探索を行い、F1スコアを最大化する構成を選択する。</p>
<h3 id="Results-and-Analysis" class="common-anchor-header">結果と分析</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/result_0df098152a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>結果は、3つのモデル間で明確な性能差があることを明らかにした。</p>
<p><strong>Provenceは</strong>、<strong>F1スコア66.76%という</strong>最強の総合性能を達成した。Precision<strong>（69.53</strong>%）とRecall<strong>（64.19</strong>%）はバランスが取れており、領域外の汎化が強固であることを示している。最適な構成は<strong>0.</strong>6の刈り込み閾値とα<strong>=0.051を</strong>使用しており、モデルの関連性スコアがよく較正されていること、刈り込み動作が直感的で実際に調整しやすいことを示唆している。</p>
<p><strong>XProvenceの</strong> <strong>F1スコアは58.97%で</strong>、<strong>高い再現率(75.52%)</strong>と<strong>低い精度(48.37%)が</strong>特徴である。これは、積極的にノイズを除去するよりも、潜在的に関連性のある情報を保持することを優先する、より保守的な刈り込み戦略を反映している。このような動作は、ヘルスケアや法的アプリケーションのような偽陰性がコストのかかる領域では望ましいが、偽陽性を増加させ、精度を低下させる。このトレードオフにもかかわらず、XProvenceの多言語機能は、非英語またはクロスリンガルな環境での強力な選択肢となる。</p>
<p>対照的に、<strong>OpenSearch Semantic Highlighterは</strong> <strong>46.37%のF1スコア</strong>（Precision<strong>62.35</strong>%、Recall<strong>36.98</strong>%）と大幅にパフォーマンスが悪い。ProvenceとXProvenceとの相対的なギャップは、スコアのキャリブレーションとドメイン外での汎化の両方、特にドメイン外の条件下での限界を示しています。</p>
<h2 id="Semantic-Highlighting-Another-Way-to-Find-What-Actually-Matters-in-Text" class="common-anchor-header">セマンティックハイライト：テキストで実際に重要なことを見つけるもう一つの方法<button data-href="#Semantic-Highlighting-Another-Way-to-Find-What-Actually-Matters-in-Text" class="anchor-icon" translate="no">
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
    </button></h2><p>さて、コンテキストの刈り込みについて話してきたが、パズルの関連する部分、つまり<a href="https://milvus.io/blog/zilliz-trained-and-open-sourced-bilingual-semantic-highlighting-model-for-production-ai.md"><strong>セマンティック・ハイライトを見て</strong></a>みる価値がある。技術的には、どちらの機能も、クエリとの関連性に基づいてテキストの断片をスコアリングするという、基本的な仕事はほとんど同じです。違いは、その結果がパイプラインでどのように使われるかである。</p>
<p>多くの人は「ハイライト」と聞いて、ElasticsearchやSolrで見かける古典的なキーワードハイライターを思い浮かべるだろう。これらのツールは基本的に、文字通りのキーワードのマッチを探し、<code translate="no">&lt;em&gt;</code> のようなもので包みます。これらは安価で予測可能ですが、クエリと<em>全く</em>同じ単語が使われている場合にのみ機能します。文書が言い換えたり、同義語を使ったり、異なる言い回しをしたりすると、従来の蛍光ペンは完全に見逃してしまいます。</p>
<p><strong>セマンティック・ハイライトは別の方法をとります。</strong>文字列の完全一致をチェックする代わりに、クエリと異なるテキストスパンとの意味的類似性を推定するモデルを使用します。これにより、文言が全く異なっていても、関連するコンテンツをハイライトすることができる。RAGパイプライン、エージェントワークフロー、あるいはトークンよりも意味が重要なAI検索システムにとって、セマンティックハイライトは、文書が検索された<em>理由を</em>はるかに明確に把握することができる。</p>
<p>問題は、既存のセマンティックハイライティングソリューションのほとんどが、本番のAIワークロード用に構築されていないことだ。私たちは利用可能なものをすべてテストしましたが、どれも実際のRAGやエージェントシステムに必要なレベルの精度、待ち時間、多言語の信頼性を提供するものではありませんでした。そのため、私たちは、<a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1という</a>独自のモデルをトレーニングし、オープンソース化することにしました。</p>
<p>高レベルでは、<strong>コンテキストの刈り込みとセマンティックハイライトは同じコアタスクを解決する</strong>。唯一の違いは、次に何が起こるかである。</p>
<ul>
<li><p><strong>コンテキストの刈り込みは</strong>、生成前に無関係な部分を削除する。</p></li>
<li><p><strong>セマンティックハイライトは</strong>テキスト全体を保持しながら、重要な部分を視覚的に浮かび上がらせる。</p></li>
</ul>
<p>基本的な操作は非常に似ているため、同じモデルで両方の機能を動かすことができる。そのため、スタック全体のコンポーネントの再利用が容易になり、RAGシステムは全体的にシンプルで効率的になります。</p>
<h3 id="Semantic-Highlighting-in-Milvus-and-Zilliz-Cloud" class="common-anchor-header">MilvusとZilliz Cloudのセマンティックハイライト機能</h3><p>セマンティックハイライトは、<a href="https://milvus.io">Milvusと</a> <a href="https://zilliz.com/cloud"><strong>Zilliz Cloud</strong></a>（Milvusのフルマネージドサービス）で完全にサポートされ、RAGやAI主導の検索に携わる人にとってすでに有用であることが証明されています。ベクトル検索が大量のチャンクを返すとき、<em>そのチャンク内のどの文章が実際に重要な</em>のかを素早く把握するにはどうすればいいのか？</p>
<p>ハイライトがなければ、ユーザーは検索された理由を理解するためだけに文書全体を読むことになる。MilvusとZilliz Cloudは、セマンティックハイライト機能により、たとえ文言が異なっていても、クエリにセマンティックに関連する特定のスパンを自動的にマークします。キーワードの一致を探したり、チャンクが表示された理由を推測する必要はもうありません。</p>
<p>これにより、検索の透明性が格段に向上します。Milvusは単に「関連文書」を返すのではなく、関連性が<em>どこにあるかを</em>示す。RAGパイプラインにとって、これは特に有用である。なぜなら、モデルが何に注目すべきかが即座にわかるので、デバッグやプロンプトの作成がずっと簡単になるからだ。</p>
<p>このサポートをMilvusとZilliz Cloudに直接組み込んだので、使えるアトリビューションを得るために外部モデルを追加したり、別のサービスを実行したりする必要はありません。ベクトル検索→関連性スコアリング→ハイライトされたスパン。また、<a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a>モデルで多言語ワークロードをサポートします。</p>
<h2 id="Looking-Ahead" class="common-anchor-header">今後の展望<button data-href="#Looking-Ahead" class="anchor-icon" translate="no">
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
    </button></h2><p>コンテキスト・エンジニアリングはまだかなり新しく、解明すべきことがたくさん残っている。<a href="https://milvus.io">Milvusと</a> <a href="https://zilliz.com/cloud"><strong>Zilliz Cloudの</strong></a>内部でプルーニングとセマンティック・ハイライトがうまく機能しているとしても<strong>、</strong>物語の終わりには程遠い。物事を遅くすることなくプルーニング・モデルをより正確にすること、奇妙なクエリやドメイン外のクエリをよりうまく処理すること、検索→再ランク→プルーニング→ハイライトが、ハックの集合を接着剤でくっつけたようなものではなく、1つのクリーンなパイプラインのように感じられるように、すべてのピースを配線することなどです。</p>
<p>コンテキスト・ウィンドウが増え続けるにつれ、こうした判断の重要性は増すばかりだ。優れたコンテキスト管理は、もはや「素敵なおまけ」ではなく、ロングコンテキストやRAGシステムを確実に動作させるための核となる部分になりつつある。</p>
<p>私たちは、実験を続け、ベンチマークを行い、開発者にとって実際に違いをもたらすものを出荷していくつもりです。ゴールは単純明快で、乱雑なデータ、予測不可能なクエリー、大規模なワークロードの下でも壊れないシステムを簡単に構築できるようにすることです。</p>
<p><a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvusオフィスアワーでは</a>、20分間の1対1のセッションを予約することができます。</p>
<p>他のビルダーとのチャットやメモ交換はいつでも大歓迎です。</p>
