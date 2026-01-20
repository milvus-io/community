---
id: semantic-highlighting-model-for-rag-context-pruning-and-token-saving.md
title: RAGコンテキストの刈り込みとトークン保存のためのセマンティックハイライトモデルの構築方法
author: 'Cheney Zhang, Jiang Chen'
date: 2026-1-19
cover: assets.zilliz.com/semantic_highlight2_cover_1406d8b11e.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: >-
  semantic highlighting, RAG, context pruning, RAG noise filtering, context
  engineering
meta_title: |
  Semantic Highlighting for RAG Context Pruning and Token Saving
desc: >-
  Zillizが、エンコーダのみのアーキテクチャ、LLM推論、大規模なバイリンガルトレーニングデータを使用して、RAGノイズフィルタリング、コンテキスト刈り込み、トークン保存のためのセマンティックハイライトモデルを構築した方法を学びます。
origin: >-
  https://milvus.io/blog/semantic-highlighting-model-for-rag-context-pruning-and-token-saving.md
---
<h2 id="The-Problem-RAG-Noise-and-Token-Waste" class="common-anchor-header">問題：RAGのノイズとトークンの無駄<button data-href="#The-Problem-RAG-Noise-and-Token-Waste" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>ベクトル検索は</strong>、エンタープライズアシスタント、AIエージェント、カスタマーサポートボットなどのRAGシステムの強固な基盤です。重要な文書を確実に見つけることができる。しかし、検索だけではコンテキストの問題を解決することはできない。よくチューニングされたインデックスでさえ、広範囲に関連するチャンクを返すが、そのチャンクの中にある文章のうち、実際にクエリに答えるものはごく一部である。</p>
<p>本番システムでは、このギャップはすぐに現れる。一つのクエリで何十ものドキュメントが取り込まれるかもしれない。実際のシグナルを含む文章はほんの一握りで、残りはトークンの使用量を増大させ、推論を遅らせ、LLMの気を散らせるコンテキストである。エージェントワークフローでは、クエリ自体が多段階推論の出力であり、検索されたテキストのごく一部にしかマッチしないため、問題はさらに明白になる。</p>
<p>このため、<em>有用な文章を</em> <em><strong>識別してハイライト</strong></em> <em>し、残りを無視する</em>ことができるモデルの明確な必要性が生じる<em>。基本的には</em>、文章レベルの関連性フィルタリング、または多くのチームが<a href="https://milvus.io/blog/llm-context-pruning-a-developers-guide-to-better-rag-and-agentic-ai-results.md"><strong>コンテキストの刈り込みと</strong></a>呼ぶものである。目的は単純で、重要な部分を残し、LLMに到達する前にノイズを取り除くことです。</p>
<p>従来のキーワードベースのハイライトでは、この問題は解決できない。例えば、ユーザーが "Pythonコードの実行効率を上げるには？"と質問した場合、キーワードハイライターは "Python "と "efficiency "を選び出しますが、質問の答えである "Use NumPy vectorized operations instead of loops "は見逃してしまいます。代わりに必要なのは、文字列のマッチングではなく、意味の理解なのです。</p>
<h2 id="A-Semantic-Highlighting-Model-for-RAG-Noise-Filtering-and-Context-Pruning" class="common-anchor-header">RAGノイズフィルタとコンテキスト刈り込みのためのセマンティックハイライトモデル<button data-href="#A-Semantic-Highlighting-Model-for-RAG-Noise-Filtering-and-Context-Pruning" class="anchor-icon" translate="no">
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
    </button></h2><p>RAGビルダーがこれを簡単に行えるように、私たちは、検索されたドキュメントの中でクエリと意味的に一致する文章を特定し、ハイライトする<a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1"><strong>セマンティックハイライティングモデルを</strong></a>トレーニングし、オープンソース化しました。このモデルは現在、英語と中国語の両方で最先端の性能を発揮し、既存のRAGパイプラインに直接組み込むことができるように設計されています。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/context_pruning_80f7b16280.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>モデルの詳細</strong></p>
<ul>
<li><p><strong>HuggingFace:</strong> <a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p><strong>ライセンス</strong>MIT (商用フレンドリー)</p></li>
<li><p><strong>アーキテクチャ</strong>BGE-M3 Reranker v2に基づく0.6Bエンコーダのみのモデル</p></li>
<li><p><strong>コンテキストウィンドウ</strong>8192トークン</p></li>
<li><p><strong>対応言語</strong>英語と中国語</p></li>
</ul>
<p>セマンティックハイライトは、長い検索文書の有用な部分のみを選択するために必要な関連性シグナルを提供する。実際には、このモデルによって以下のことが可能になります：</p>
<ul>
<li><p>文書のどの部分が実際に重要であるかを示す、<strong>解釈可能性の向上</strong></p></li>
<li><p>ハイライトされた文章のみをLLMに送ることで、<strong>トークンのコストを70～80%削減</strong></p></li>
<li><p>無関係な文脈を見ずに済むため、<strong>回答の質が向上する</strong>。</p></li>
<li><p>エンジニアが文レベルのマッチを直接検査できるため、<strong>デバッグが容易</strong></p></li>
</ul>
<h3 id="Evaluation-Results-Achieving-SOTA-Performance" class="common-anchor-header">評価結果SOTAパフォーマンスの達成</h3><p>英語と中国語にまたがる複数のデータセットで、セマンティックハイライティングモデルをドメイン内とドメイン外の両方の条件で評価しました。</p>
<p>ベンチマークスイートは以下の通りです：</p>
<ul>
<li><p><strong>英語マルチスパンQA:</strong>multispanqa</p></li>
<li><p><strong>英語圏外ウィキペディア：</strong>wikitext2</p></li>
<li><p><strong>中国語マルチスパンQA:</strong>multispanqa_zh</p></li>
<li><p><strong>中国語のアウトオブドメイン・ウィキペディア：</strong>wikitext2_zh</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmarking_results_25545c952f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>評価モデルは以下の通り：</p>
<ul>
<li><p>オープンプロヴァンスシリーズ</p></li>
<li><p>ネイバーのProvence/XProvenceシリーズ</p></li>
<li><p>OpenSearchのセマンティックハイライト</p></li>
<li><p>学習済みバイリンガルモデル：<a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
</ul>
<p>4つのデータセットすべてにおいて、私たちのモデルはトップランキングを達成しています。さらに重要なことは、英語と中国語の両方で一貫して優れた結果を出す<em>唯一の</em>モデルであるということです。競合モデルは、英語だけに焦点を当てるか、中国語テキストで明らかなパフォーマンス低下を示しています。</p>
<h2 id="How-We-Built-This-Semantic-Highlighting-Model" class="common-anchor-header">セマンティックハイライティングモデルの構築方法<button data-href="#How-We-Built-This-Semantic-Highlighting-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>このタスクのためのモデルをトレーニングすることは難しいことではありません。初期の問題を処理し、SOTAに近いパフォーマンスを提供する<em>優れた</em>モデルをトレーニングすることが、本当の仕事になります。私たちのアプローチは次の2点に重点を置いています：</p>
<ul>
<li><p><strong>モデル・アーキテクチャ：</strong>高速推論のためにエンコーダのみの設計を使用する。</p></li>
<li><p><strong>トレーニングデータ：</strong>推論可能なLLMを使用して高品質の関連性ラベルを生成し、ローカル推論フレームワークでデータ生成をスケールする。</p></li>
</ul>
<h3 id="Model-Architecture" class="common-anchor-header">モデルアーキテクチャ</h3><p>コンテキスト刈り込みを<strong>トークンレベルの関連性スコアリングタスクとして</strong>扱う、軽量な<strong>エンコーダのみの</strong>ネットワークとしてモデルを構築した。この設計は、ICLR 2025でNaverによって紹介されたコンテキスト・プルーニング・アプローチである<a href="https://arxiv.org/html/2501.16214v1">Provenceに</a>触発されたもので、プルーニングを "正しいチャンクを選択する "から "すべてのトークンをスコアリングする "ことに置き換える。この枠組みは、きめ細かなシグナルが不可欠なセマンティック・ハイライトと自然に合致する。</p>
<p>エンコーダのみのモデルは最新のアーキテクチャではないが、ここでは非常に実用的である。本番のRAGシステムでは、このスピードの優位性は、より大きなデコーダーモデルを使うよりもはるかに重要である。</p>
<p>トークン・レベルの関連性スコアを計算したら、それを<strong>文レベルの</strong>スコアに集約する。このステップにより、ノイズの多いトークン信号が安定した解釈可能な関連性メトリックに変わる。設定可能な閾値以上の文はハイライトされ、それ以外はフィルタリングされる。これにより、クエリにとって実際に重要なセンテンスを選択するためのシンプルで信頼性の高いメカニズムが出来上がる。</p>
<h3 id="Inference-Process" class="common-anchor-header">推論プロセス</h3><p>実行時、我々のセマンティックハイライティングモデルはシンプルなパイプラインに従う：</p>
<ol>
<li><p><strong>入力-</strong>プロセスはユーザーのクエリーから始まる。取得された文書は関連性評価のためのコンテキスト候補として扱われる。</p></li>
<li><p><strong>モデル処理-</strong>クエリとコンテキストは1つのシーケンスに連結される：[BOS] + クエリ + コンテキスト</p></li>
<li><p><strong>トークンのスコアリング -</strong>コンテキスト内の各トークンは、クエリとの関連性の強さを反映する0から1の間の関連性スコアが割り当てられる。</p></li>
<li><p><strong>文の集約 -</strong>トークンのスコアは文レベルで集約され、通常は平均化され、各文の関連性スコアが生成されます。</p></li>
<li><p><strong>しきい値フィルタリング -</strong>設定可能なしきい値以上のスコアを持つ文はハイライトされ保持され、スコアの低い文は下流のLLMに渡される前にフィルタリングされる。</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/semantic_highlighting_workflows_db3d12a666.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Base-Model-BGE-M3-Reranker-v2" class="common-anchor-header">ベースモデルBGE-M3 Reranker v2</h3><p>ベースモデルとしてBGE-M3 Reranker v2を選択した理由はいくつかある：</p>
<ol>
<li><p>トークンや文のスコアリングに適したエンコーダアーキテクチャを採用している。</p></li>
<li><p>英語と中国語の両方に最適化された多言語をサポート</p></li>
<li><p>長いRAG文書に適した8192個のトークンコンテキストウィンドウを提供</p></li>
<li><p>0.6Bのパラメータを維持し、計算量を増やすことなく十分な強度を確保</p></li>
<li><p>ベースモデルに十分な世界知識を確保</p></li>
<li><p>関連性判定タスクと密接に連携するリランキング用に学習済み</p></li>
</ol>
<h2 id="Training-Data-LLM-Annotation-with-Reasoning" class="common-anchor-header">トレーニングデータ推論を伴うLLMアノテーション<button data-href="#Training-Data-LLM-Annotation-with-Reasoning" class="anchor-icon" translate="no">
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
    </button></h2><p>モデル・アーキテクチャが完成したら、次の課題は、実際に信頼できるモデルを訓練するためのデータセットを構築することだった。私たちはまず、Open Provenceがどのようにこれを処理しているかを見ることから始めた。彼らのアプローチは、公開されたQAデータセットと小さなLLMを使って、どの文が関連性があるかをラベル付けする。スケールもよく、自動化も簡単なので、私たちにとって良いベースラインとなった。</p>
<p>LLMに文レベルのラベルを直接出力させると、結果は必ずしも安定しない。LLMに文レベルのラベルを直接出力させると、結果が常に安定しないのだ。あるラベルは正しくても、あるラベルは疑わしい。完全に手作業でアノテーションを行うという選択肢もなかった。手作業でラベル付けできる量をはるかに超えるデータが必要だったのだ。</p>
<p>スケーラビリティを犠牲にすることなく安定性を向上させるために、LLMは出力するラベルごとに短い推論スニペットを提供しなければならない。各トレーニング例には、クエリ、ドキュメント、センテンススパン、センテンスが関連または無関係である理由の簡単な説明が含まれる。この小さな調整により、アノテーションの一貫性が高まり、データセットの検証やデバッグの際に参照できる具体的な情報が得られた。</p>
<p>理由を含めることは、驚くほど価値があることがわかった：</p>
<ul>
<li><p><strong>アノテーションの質の向上：</strong>理由を書き出すことでセルフチェックができ、ランダムなラベルや一貫性のないラベルを減らすことができる。</p></li>
<li><p><strong>観察可能性の向上：</strong>ラベルをブラックボックスとして扱うのではなく、<em>なぜ</em>その文章が選択されたかを見ることができる。</p></li>
<li><p><strong>より簡単なデバッグ：</strong>何かが間違っているように見えるとき、プロンプト、ドメイン、アノテーションロジックのどれが問題かを簡単に見つけることができます。</p></li>
<li><p><strong>再利用可能なデータ：</strong>将来的に異なるラベリングモデルに切り替えたとしても、推論トレースは再ラベリングや監査に役立ちます。</p></li>
</ul>
<p>アノテーションのワークフローは以下のようになる：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/annotation_data_generation_ff93eb18f4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Qwen3-8B-for-Annotation" class="common-anchor-header">Qwen3 8Bによるアノテーション</h3><p>アノテーションのためにQwen3 8Bを選択した理由は、Qwen3 8Bが出力による「思考モード」をネイティブにサポートしており、一貫性のある推論トレースの抽出が非常に容易だからである。小さなモデルでは安定したラベルが得られず、大きなモデルはこの種のパイプラインには遅く、不必要に高価でした。Qwen3 8Bは、品質、スピード、コストの間で適切なバランスを保っている。</p>
<p>我々は、クラウドAPIではなく、<strong>ローカルのvLLMサービスを使って</strong>全てのアノテーションを実行した。これにより、高いスループット、予測可能なパフォーマンス、より低いコスト、つまりGPU時間とAPIトークン料金を交換することができ、何百万ものサンプルを生成する場合、より良い取引となった。</p>
<h3 id="Dataset-Scale" class="common-anchor-header">データセットのスケール</h3><p>合計で<strong>500万以上のバイリンガルのトレーニングサンプルを</strong>構築し、英語と中国語でほぼ均等に分けた。</p>
<ul>
<li><p><strong>英語のソース</strong>MS MARCO、Natural Questions、GooAQ</p></li>
<li><p><strong>中国語ソース</strong>DuReader、中国語ウィキペディア、mmarco_chinese</p></li>
</ul>
<p>データセットの一部は、Open Provenceのようなプロジェクトで使われている既存のデータを再注釈したものである。残りは、まずクエリとコンテキストのペアを作成し、推論ベースのパイプラインでラベル付けすることで、生のコーパスから生成されました。</p>
<p>すべての注釈付きトレーニングデータは、コミュニティの発展とトレーニングの参考のためにHuggingFaceでも利用可能です：<a href="https://huggingface.co/zilliz/datasets">Zillizデータセット</a></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zilliz_datasets_dd91330d4d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Training-Method" class="common-anchor-header">トレーニング方法</h3><p>モデルのアーキテクチャとデータセットの準備ができたら、<strong>8×A100 GPUで</strong>モデルを3エポック訓練しました。</p>
<p><strong>注：</strong>訓練は、セマンティックハイライトタスクを担当する<strong>Pruning Headのみを</strong>対象とした。<strong>Rerankヘッドを</strong>トレーニングしなかったのは、プルーニングの目的のみに集中することで、文レベルの関連性スコアリングでより良い結果が得られたからである。</p>
<h2 id="Real-World-Case-Study" class="common-anchor-header">実際のケーススタディ<button data-href="#Real-World-Case-Study" class="anchor-icon" translate="no">
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
    </button></h2><p>ベンチマークはストーリーの一部しか語らないので、よくあるエッジケース、つまり検索されたテキストに正解と非常に魅力的なディストラクターの両方が含まれている場合にモデルがどのように振る舞うかを示す実際の例を紹介します。</p>
<p><strong>クエリ</strong> <em>The Killing of a Sacred Deer（聖なる鹿殺し）を書いたのは誰ですか？</em></p>
<p><strong>コンテキスト（5文）：</strong></p>
<pre><code translate="no">1\. The Killing of a Sacred Deer is a 2017 psychological horror film directed by Yorgos Lanthimos,

   with a screenplay by Lanthimos and Efthymis Filippou.

2\. The film stars Colin Farrell, Nicole Kidman, Barry Keoghan, Raffey Cassidy,

   Sunny Suljic, Alicia Silverstone, and Bill Camp.

3\. The story is based on the ancient Greek playwright Euripides&#x27; play Iphigenia in Aulis.

4\. The film tells the story of a cardiac surgeon (Farrell) who secretly

   befriends a teenager (Keoghan) connected to his past.

5\. He introduces the boy to his family, who then mysteriously fall ill.
<button class="copy-code-btn"></button></code></pre>
<p>正解：文1（「脚本：ランティモスとエフティミス・フィリッポウ」と明示されている）</p>
<p>この例文には罠がある：文3は「エウリピデス」が原作を書いたと述べている。しかし、設問は「誰が映画『聖なる鹿殺し』を書いたか」を尋ねており、答えは映画の脚本家であって、数千年前のギリシャの劇作家ではないはずだ。</p>
<h3 id="Model-results" class="common-anchor-header">模範解答結果</h3><table>
<thead>
<tr><th>模範解答</th><th>正しい答えを見つけたか？</th><th>予測</th></tr>
</thead>
<tbody>
<tr><td>我々のモデル</td><td>✓</td><td>文1（正解）と文3を選択</td></tr>
<tr><td>XProvence v1</td><td>✗</td><td>文3のみを選択、正解を逃す</td></tr>
<tr><td>XProvence v2</td><td>✗</td><td>センテンス3のみ選択、正解を逃す</td></tr>
</tbody>
</table>
<p><strong>キーセンテンスのスコア比較</strong></p>
<table>
<thead>
<tr><th>文</th><th>モデル</th><th>XProvence v1</th><th>XProvence v2</th></tr>
</thead>
<tbody>
<tr><td>センテンス1（映画脚本、正解）</td><td>0.915</td><td>0.133</td><td>0.081</td></tr>
<tr><td>センテンス3（オリジナル劇、ディストラクター）</td><td>0.719</td><td>0.947</td><td>0.802</td></tr>
</tbody>
</table>
<p>XProvenceモデル：</p>
<ul>
<li><p>エウリピデス」と「戯曲」に強く惹かれ、センテンス3に満点に近いスコア（0.947と0.802）を与える。</p></li>
<li><p>実際の回答（文1）を完全に無視し、極端に低いスコア（0.133と0.081）を与える。</p></li>
<li><p>しきい値を0.5から0.2に下げても、正解を見つけることができない。</p></li>
</ul>
<p>我々のモデル</p>
<ul>
<li><p>文1に最も高いスコアを与える (0.915)</p></li>
<li><p>文3は背景と関連しているため、まだある程度の関連性を付与 (0.719)</p></li>
<li><p>0.2程度のマージンで2つを明確に分離</p></li>
</ul>
<p>この例は、表面的なキーワードのマッチングではなく、<strong>クエリの意図を</strong>理解するというモデルの核となる強みを示しています。この文脈では、"Who wrote<em>The Killing of a Sacred Deer</em>"は古代ギリシャの戯曲ではなく映画を指しています。私たちのモデルは、他のモデルが強い語彙的な手がかりに気を取られている間に、それを拾う。</p>
<h2 id="Try-It-Out-and-Tell-Us-What-You-Think" class="common-anchor-header">使ってみて感想をお聞かせください<button data-href="#Try-It-Out-and-Tell-Us-What-You-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>私たちの<a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a>モデルは、現在MITライセンスの下で完全にオープンソース化されており、実運用に使用する準備ができています。あなたのRAGパイプラインに組み込んだり、あなた自身のドメイン用に微調整したり、この上に新しいツールを構築することができます。コミュニティからの貢献やフィードバックも歓迎します。</p>
<ul>
<li><p><strong>HuggingFaceからダウンロード</strong>：<a href="https://huggingface.co/zilliz/semantic-highlight-bilingual-v1">zilliz/semantic-highlight-bilingual-v1</a></p></li>
<li><p><strong>全ての注釈付き学習データ</strong> <a href="https://huggingface.co/zilliz/datasets">: https://huggingface.co/zilliz/datasets</a></p></li>
</ul>
<h3 id="Semantic-Highlighting-Available-in-Milvus-and-Zilliz-Cloud" class="common-anchor-header">MilvusとZilliz Cloudで利用可能なセマンティックハイライト</h3><p>セマンティックハイライトは<a href="https://milvus.io/">Milvusと</a> <a href="https://zilliz.com/cloud">Zilliz Cloud</a>(フルマネージドMilvus)にも直接組み込まれており、各文書が<em>なぜ</em>検索されたかを明確に表示します。チャンク全体をスキャンする代わりに、クエリに関連する特定の文章を即座に見ることができます。これによって、検索が理解しやすくなり、デバッグが非常に速くなります。また、RAGパイプラインでは、下流のLLMが何を重視するかが明確になり、迅速な設計と品質チェックに役立ちます。</p>
<p><a href="https://cloud.zilliz.com/signup?utm_source=milvusio&amp;utm_page=semantic-highlighting-blog"><strong>フルマネージドZilliz Cloudのセマンティックハイライトを無料でお試しください。</strong></a></p>
<p>バグレポート、改善アイデア、ワークフローへの統合中に発見したことなど、ぜひお聞かせください。</p>
<p>より詳しくお聞きになりたい場合は、お気軽に<a href="https://discord.com/invite/8uyFbECzPX">Discordチャンネルに</a>ご参加いただくか、20分間の<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvusオフィスアワーを</a>ご予約ください。他のビルダーとおしゃべりしたり、メモを交換したりするのはいつでも大歓迎です。</p>
<h2 id="Acknowledgements" class="common-anchor-header">謝辞<button data-href="#Acknowledgements" class="anchor-icon" translate="no">
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
    </button></h2><p>この作品は、多くの素晴らしいアイデアとオープンソースの貢献の上に成り立っており、このモデルを可能にしたプロジェクトに注目したい。</p>
<ul>
<li><p><strong>Provenceは</strong>、軽量エンコーダーモデルを使ったコンテキスト刈り込みのための、クリーンで実用的なフレームを導入した。</p></li>
<li><p><strong>Open Provenceは</strong>、寛容なライセンスの下で、トレーニングパイプライン、データ処理、モデルヘッドなど、堅実でよく設計されたコードベースを提供した。これは私たちに実験のための強力な出発点を与えてくれた。</p></li>
</ul>
<p>その基盤の上に、私たちはいくつかの貢献を加えた：</p>
<ul>
<li><p><strong>LLM推論を用いて</strong>、より質の高い関連性ラベルを生成する<strong>。</strong></p></li>
<li><p>実際のRAGワークロードに合わせた<strong>約500万個の</strong>バイリンガルトレーニングサンプルの作成</p></li>
<li><p>ロングコンテキストの関連性スコアリングに適したベースモデルの選択<strong>（BGE-M3 Reranker v2）</strong></p></li>
<li><p>セマンティックハイライト用にモデルを特化させるために<strong>Pruning Headのみを</strong>トレーニングする</p></li>
</ul>
<p>ProvenceとOpen Provenceのチームが、自分たちの仕事をオープンに公開してくれたことに感謝する。彼らの貢献は我々の開発を大幅に加速させ、このプロジェクトを可能にした。</p>
