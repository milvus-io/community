---
id: fix-rag-retrieval-errors-crag-langgraph-milvus.md
title: CRAG、LangGraph、milvusによるRAG検索エラーの修正
author: Min Yin
date: 2026-3-23
cover: assets.zilliz.com/cover_CRAG_a05dddbaa2_aafaad6bc0.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'CRAG, RAG retrieval, LangGraph, Milvus, hybrid retrieval'
meta_title: |
  Fix RAG Retrieval Errors with CRAG, LangGraph, and Milvus
desc: >-
  類似度は高いが不正解？CRAGがRAGパイプラインにどのように評価と修正を加えるかを学ぶ。LangGraph +
  Milvusでプロダクションに使えるシステムを構築。
origin: 'https://milvus.io/blog/fix-rag-retrieval-errors-crag-langgraph-milvus.md'
---
<p>LLMアプリケーションが本番稼動するにつれ、チームはますます、プライベートデータやリアルタイムの情報に基づいた質問に答えるモデルを必要としている。<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">検索補強型生成</a>（RAG）-クエリ時にモデルが外部の知識ベースから引き出す-は、標準的なアプローチである。これは幻覚を減らし、答えを最新のものに保つ。</p>
<p>しかし、実際にすぐに表面化する問題がある。それは、<strong>類似性で高いスコアを獲得しても、質問に対して完全に間違っている文書があるということだ。</strong>従来のRAGパイプラインは類似性と関連性を同一視している。本番ではその仮定は崩れる。上位にランクされた結果は、古かったり、関連性が薄かったり、ユーザーが必要とする詳細が欠けていたりする可能性がある。</p>
<p>CRAG（Corrective Retrieval-Augmented Generation）は、検索と生成の間に評価と修正を加えることで、この問題に対処する。類似度スコアを盲目的に信頼する代わりに、システムは検索されたコンテンツが実際に質問に答えているかどうかをチェックし、答えていない場合はその状況を修正する。</p>
<p>この記事では、LangChain、LangGraph、<a href="https://milvus.io/intro">milvusを</a>使ったCRAGシステムの構築について説明する。</p>
<h2 id="Three-Retrieval-Problems-Traditional-RAG-Doesnt-Solve" class="common-anchor-header">従来のRAGでは解決できない3つの検索問題<button data-href="#Three-Retrieval-Problems-Traditional-RAG-Doesnt-Solve" class="anchor-icon" translate="no">
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
    </button></h2><p>実運用におけるRAGの失敗のほとんどは、3つの問題のうちの1つに起因する：</p>
<p><strong>検索ミスマッチ。</strong>この文書は局所的には似ているが、実際には質問に答えていない。NginxでHTTPS証明書を設定する方法を尋ねると、システムはApacheのセットアップガイド、2019年のウォークスルー、またはTLSがどのように機能するかについての一般的な説明を返すかもしれません。意味的には近いが、実質的には役に立たない。</p>
<p><strong>古いコンテンツ。</strong> <a href="https://zilliz.com/learn/vector-similarity-search">ベクトル検索には</a>新しさという概念がない。Python async best practices "とクエリすると、2018年のパターンと2024年のパターンが混在し、純粋に埋め込み距離によってランク付けされる。システムは、ユーザーが実際に必要としているものを区別できない。</p>
<p><strong>メモリ汚染。</strong>これは時間の経過とともに深刻化するもので、修正するのが最も難しい場合が多い。システムが古いAPIリファレンスを取得し、間違ったコードを生成したとする。その間違った出力はメモリに保存される。次に同じようなクエリを実行する際、システムはそれを再び取得し、間違いを強化してしまう。古い情報と新しい情報が徐々に混ざり合い、システムの信頼性はサイクルごとに損なわれていく。</p>
<p>これはコーナーケースではない。RAGシステムが実際のトラフィックを処理すれば、このようなケースは定期的に発生する。それこそが、検索品質チェックを「あったらいいな」ではなく「必要条件」にしている理由である。</p>
<h2 id="What-Is-CRAG-Evaluate-First-Then-Generate" class="common-anchor-header">CRAGとは？まず評価し、次に生成する<button data-href="#What-Is-CRAG-Evaluate-First-Then-Generate" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Corrective Retrieval-Augmented Generation（CRAG</strong>）は、RAGパイプラインの検索と生成の間に、評価と修正のステップを追加する手法である。<a href="https://openreview.net/forum?id=JnWJbrnaUE"><em>Corrective Retrieval Augmented Generation</em></a>(Yan et al., 2024)という論文で紹介された。CRAGは、従来のRAGとは異なり、文書を使用するか破棄するかという二者択一の決定を行う。CRAGは、検索された各結果の関連性をスコア化し、言語モデルに到達する前に3つの修正パスのいずれかを経由させる。</p>
<p>従来のRAGは、検索結果がグレーゾーン（部分的に関連性がある、やや古い、重要な部分が欠けている）にある場合に苦労する。単純なYES/NOゲートは、有用な部分的情報を破棄するか、ノイズの多いコンテンツを通過させるかのどちらかである。CRAGは、<strong>検索→生成から</strong>、<strong>検索→評価→修正→生成へと</strong>パイプラインを再構築し、生成開始前に検索品質を修正するチャンスをシステムに与える。</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/fix_rag_retrieval_errors_crag_langgraph_milvus_1_11a820f454.png" alt="CRAG four-step workflow: Retrieval → Evaluation → Correction → Generation, showing how documents are scored and routed" class="doc-image" id="crag-four-step-workflow:-retrieval-→-evaluation-→-correction-→-generation,-showing-how-documents-are-scored-and-routed" />
   <span>CRAGの4段階のワークフロー：検索 → 評価 → 訂正 → 生成。文書がどのようにスコアリングされ、ルーティングされるかを示す。</span> </span></p>
<p>検索結果は3つのカテゴリーに分類される：</p>
<ul>
<li><strong>正しい：</strong>クエリに直接答えている。</li>
<li><strong>あいまい：</strong>部分的に関連性がある。</li>
<li><strong>不適切：</strong>無関係、破棄して代替ソースに戻る</li>
</ul>
<table>
<thead>
<tr><th>決定</th><th>確信</th><th>アクション</th></tr>
</thead>
<tbody>
<tr><td>正しい</td><td>&gt; 0.9</td><td>文書内容を絞り込む</td></tr>
<tr><td>あいまい</td><td>0.5-0.9</td><td>文書内容の絞り込み＋ウェブ検索による補足</td></tr>
<tr><td>不正確</td><td>&lt; 0.5</td><td>検索結果を破棄し、ウェブ検索に完全にフォールバックする</td></tr>
</tbody>
</table>
<h3 id="Content-Refinement" class="common-anchor-header">コンテンツの絞り込み</h3><p>CRAGは標準的なRAGの微妙な問題にも対処している。これはトークンを無駄にし、シグナルを希釈する。モデルは実際に重要な一文を見つけるために、無関係な段落をかき分けなければならない。CRAGは検索されたコンテンツをまず絞り込み、関連する部分を抽出して残りを取り除く。</p>
<p>元の論文では、このために知識ストリップと発見的ルールを使用している。実際には、キーワードマッチは多くのユースケースで有効であり、生産システムはより高い品質を得るためにLLMベースの要約や構造化抽出を重ねることができる。</p>
<p>洗練プロセスには3つの部分がある：</p>
<ul>
<li><strong>文書の分解：</strong>長い文書から重要な箇所を抽出する。</li>
<li><strong>クエリの書き換え：</strong>あいまいなクエリや曖昧なクエリを、より的を絞ったクエリに変換する。</li>
<li><strong>知識の選択：</strong>重複を排除し、ランク付けし、最も有用なコンテンツのみを保持する。</li>
</ul>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/fix_rag_retrieval_errors_crag_langgraph_milvus_2_9ec4b6aa81.png" alt="The three-step document refinement process: Document Decomposition (2000 → 500 tokens), Query Rewriting (improved search precision), and Knowledge Selection (filter, rank, and trim)" class="doc-image" id="the-three-step-document-refinement-process:-document-decomposition-(2000-→-500-tokens),-query-rewriting-(improved-search-precision),-and-knowledge-selection-(filter,-rank,-and-trim)" />
   <span>3段階の文書洗練プロセス文書分解（2000→500トークン）、クエリ書き換え（検索精度の向上）、知識選択（フィルター、ランク付け、トリム）</span> </span></p>
<h3 id="The-Evaluator" class="common-anchor-header">評価ツール</h3><p>評価器はCRAGの中核である。深い推論をするためのものではなく、高速なトリアージゲートである。クエリと検索された文書が与えられたとき、そのコンテンツが使用するのに十分かどうかを判断する。</p>
<p>元の論文では、汎用のLLMではなく、微調整されたT5-Largeモデルを選択している。その理由は、この特定のタスクでは柔軟性よりもスピードと精度が重要だからである。</p>
<table>
<thead>
<tr><th>属性</th><th>微調整されたT5-Large</th><th>GPT-4</th></tr>
</thead>
<tbody>
<tr><td>レイテンシ</td><td>10-20ミリ秒</td><td>200ミリ秒以上</td></tr>
<tr><td>精度</td><td>92%（論文実験）</td><td>未定</td></tr>
<tr><td>タスク適合性</td><td>高 - 単一タスクの微調整、高精度</td><td>中 - 汎用的、より柔軟だが専門性は低い</td></tr>
</tbody>
</table>
<h3 id="Web-Search-Fallback" class="common-anchor-header">ウェブ検索フォールバック</h3><p>内部検索が不正確または曖昧であるとフラグが立った場合、CRAGはウェブ検索をトリガーし、より新鮮な情報や補足情報を取り込むことができます。これは、一刻を争うクエリや、社内の知識ベースにギャップがあるトピックに対するセーフティネットとして機能します。</p>
<h2 id="Why-Milvus-Is-a-Good-Fit-for-CRAG-in-Production" class="common-anchor-header">Milvusが本番環境でCRAGに適している理由<button data-href="#Why-Milvus-Is-a-Good-Fit-for-CRAG-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>CRAGの有効性は、その下に位置するものによって決まる。<a href="https://zilliz.com/learn/what-is-vector-database">ベクトルデータベースは</a>、基本的な類似検索以上のことを行う必要があります。それは、本番CRAGシステムが要求するマルチテナント分離、ハイブリッド検索、スキーマの柔軟性をサポートする必要があります。</p>
<p>いくつかの選択肢を評価した結果、私たちは3つの理由から<a href="https://zilliz.com/what-is-milvus">milvusを</a>選びました。</p>
<h3 id="Multi-Tenant-Isolation" class="common-anchor-header">マルチテナント分離</h3><p>エージェントベースのシステムでは、各ユーザやセッションは独自のメモリ空間を必要とします。テナントごとに1つのコレクションという素朴なアプローチは、特に規模が大きくなると、すぐに運用上の頭痛の種になります。</p>
<p>Milvusは<a href="https://milvus.io/docs/use-partition-key.md">パーティションキーで</a>これを処理します。<code translate="no">agent_id</code> フィールドに<code translate="no">is_partition_key=True</code> を設定すると、Milvusは自動的に適切なパーティションにクエリをルーティングします。コレクションが乱立することもなく、手動のルーティングコードもありません。</p>
<p>100テナントで1,000万ベクトルを使用したベンチマークでは、クラスタリングコンパクションを使用したMilvusは、最適化されていないベースラインと比較して<strong>3-5倍のQPSを</strong>達成しました。</p>
<h3 id="Hybrid-Retrieval" class="common-anchor-header">ハイブリッド検索</h3><p>純粋なベクトル検索では、<code translate="no">SKU-2024-X5</code> 、バージョン文字列、または特定の用語のような完全一致のコンテンツ-製品SKUには不十分です。</p>
<p>milvus2.5は<a href="https://milvus.io/docs/multi-vector-search.md">ハイブリッド検索を</a>ネイティブでサポートします。意味的類似性のための密なベクトル、BM25スタイルのキーワードマッチングのための疎なベクトル、そしてスカラーメタデータフィルタリング、これら全てを1つのクエリで実現します。結果はRRF（Reciprocal Rank Fusion）を使って融合されるので、別々の検索パイプラインを構築してマージする必要はありません。</p>
<p>Milvus Sparse-BM25の100万ベクトルデータセットでの検索レイテンシは<strong>6ミリ秒</strong>であり、エンドツーエンドのCRAGパフォーマンスへの影響はごくわずかです。</p>
<h3 id="Flexible-Schema-for-Evolving-Memory" class="common-anchor-header">進化するメモリに対応する柔軟なスキーマ</h3><p>CRAGパイプラインが成熟するにつれ、データモデルもそれに合わせて進化します。評価ロジックを繰り返しながら、<code translate="no">confidence</code> 、<code translate="no">verified</code> 、<code translate="no">source</code> のようなフィールドを追加する必要がありました。ほとんどのデータベースでは、これはマイグレーションスクリプトとダウンタイムを意味する。</p>
<p>Milvusは動的なJSONフィールドをサポートしているため、サービスを中断することなく、メタデータをその場で拡張することができる。</p>
<p>これが典型的なスキーマです：</p>
<pre><code translate="no" class="language-python">fields = [
    FieldSchema(name=<span class="hljs-string">&quot;agent_id&quot;</span>, dtype=DataType.VARCHAR, is_partition_key=<span class="hljs-literal">True</span>),  <span class="hljs-comment"># multi-tenancy</span>
    FieldSchema(name=<span class="hljs-string">&quot;dense_embedding&quot;</span>, dtype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">1536</span>),   <span class="hljs-comment"># semantic retrieval</span>
    FieldSchema(name=<span class="hljs-string">&quot;sparse_embedding&quot;</span>, dtype=DataType.SPARSE_FLOAT_VECTOR),<span class="hljs-comment"># BM25</span>
    FieldSchema(name=<span class="hljs-string">&quot;metadata&quot;</span>, dtype=DataType.JSON),<span class="hljs-comment"># dynamic schema</span>
]

<span class="hljs-comment"># hybrid retrieval + metadata filtering</span>
results = collection.hybrid_search(
    reqs=[
        AnnSearchRequest(data=[dense_vec], anns_field=<span class="hljs-string">&quot;dense_embedding&quot;</span>, limit=<span class="hljs-number">20</span>),
        AnnSearchRequest(data=[sparse_vec], anns_field=<span class="hljs-string">&quot;sparse_embedding&quot;</span>, limit=<span class="hljs-number">20</span>)
    ],
    rerank=RRFRanker(),
    output_fields=[<span class="hljs-string">&quot;metadata&quot;</span>],
    expr=<span class="hljs-string">&#x27;metadata[&quot;confidence&quot;] &gt; 0.9&#x27;</span>,<span class="hljs-comment"># CRAG confidence filtering</span>
    limit=<span class="hljs-number">5</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>Milvusはデプロイのスケーリングも簡素化します。<a href="https://milvus.io/docs/install-overview.md">Lite、Standalone、およびDistributedモードが</a>あり、コード互換性があるため、ローカル開発から本番クラスタへの切り替えは接続文字列を変更するだけで済みます。</p>
<h2 id="Hands-On-Build-a-CRAG-System-with-LangGraph-Middleware-and-Milvus" class="common-anchor-header">ハンズオン：LangGraphミドルウェアとmilvusによるCRAGシステムの構築<button data-href="#Hands-On-Build-a-CRAG-System-with-LangGraph-Middleware-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Why-the-Middleware-Approach" class="common-anchor-header">なぜミドルウェアアプローチなのか？</h3><p>LangGraphでCRAGを構築する一般的な方法は、各ステップを制御するノードとエッジを持つステートグラフを配線することです。これはうまくいくのですが、複雑になるとグラフがもつれ、デバッグが頭痛の種になります。</p>
<p>そこで、LangGraph 1.0では<strong>Middlewareパターンを</strong>採用した。これは、モデル呼び出しの前にリクエストをインターセプトするので、検索、評価、修正が一つのまとまった場所で処理される。ステートグラフのアプローチと比較すると</p>
<ul>
<li><strong>より少ないコード：</strong>ロジックはグラフノードに散在せず、一元化される。</li>
<li><strong>追跡が容易：</strong>制御フローが直線的に読み込まれる。</li>
<li><strong>デバッグが容易:</strong>グラフのトラバーサルではなく、1つの場所を指す障害</li>
</ul>
<h3 id="Core-Workflow" class="common-anchor-header">コア・ワークフロー</h3><p>パイプラインは4つのステップで実行される：</p>
<ol>
<li><strong>検索：</strong>Milvusから現在のテナントにスコープされた上位3つの関連ドキュメントを取得する。</li>
<li><strong>評価：</strong>軽量モデルで文書の品質を評価する。</li>
<li><strong>修正:</strong>判定結果に基づいて、絞り込むか、ウェブ検索で補完するか、完全に後退させる。</li>
<li><strong>インジェクション：</strong>動的なシステムプロンプトを通じて、最終的なコンテキストをモデルに渡す。</li>
</ol>
<h3 id="Environment-Setup-and-Data-Preparation" class="common-anchor-header">環境のセットアップとデータの準備</h3><p><strong>環境変数</strong></p>
<pre><code translate="no" class="language-bash"><span class="hljs-keyword">export</span> <span class="hljs-variable constant_">OPENAI_API_KEY</span>=<span class="hljs-string">&quot;your-api-key&quot;</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">TAVILY_API_KEY</span>=<span class="hljs-string">&quot;your-tavily-key&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Milvusコレクションの作成</strong></p>
<p>コードを実行する前に、Milvusで検索ロジックに一致するスキーマを持つコレクションを作成する。</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># filename: crag_agent.py</span>

<span class="hljs-comment"># ============ Import dependencies ============</span>
<span class="hljs-keyword">from</span> typing <span class="hljs-keyword">import</span> <span class="hljs-type">Literal</span>, <span class="hljs-type">List</span>
<span class="hljs-keyword">from</span> langchain.agents <span class="hljs-keyword">import</span> create_agent
<span class="hljs-keyword">from</span> langchain.agents.middleware <span class="hljs-keyword">import</span> AgentMiddleware, before_model, dynamic_prompt
<span class="hljs-keyword">from</span> langchain.chat_models <span class="hljs-keyword">import</span> init_chat_model
<span class="hljs-keyword">from</span> langchain_milvus <span class="hljs-keyword">import</span> Milvus
<span class="hljs-keyword">from</span> langchain_openai <span class="hljs-keyword">import</span> OpenAIEmbeddings
<span class="hljs-keyword">from</span> langchain_core.documents <span class="hljs-keyword">import</span> Document
<span class="hljs-keyword">from</span> langchain_core.messages <span class="hljs-keyword">import</span> SystemMessage, HumanMessage
<span class="hljs-keyword">from</span> langchain_community.tools.tavily_search <span class="hljs-keyword">import</span> TavilySearchResults


<span class="hljs-comment"># ============ CRAG Middleware (minimal-change version) ============</span>
<span class="hljs-keyword">class</span> <span class="hljs-title class_">CRAGMiddleware</span>(<span class="hljs-title class_ inherited__">AgentMiddleware</span>):
    <span class="hljs-string">&quot;&quot;&quot;CRAG evaluation and correction middleware (uses official decorator-based hooks to avoid permanently polluting the message stack)&quot;&quot;&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">__init__</span>(<span class="hljs-params">self, vector_store: Milvus, agent_id: <span class="hljs-built_in">str</span></span>):
        <span class="hljs-built_in">super</span>().__init__()
        <span class="hljs-variable language_">self</span>.vector_store = vector_store
        <span class="hljs-variable language_">self</span>.agent_id = agent_id  <span class="hljs-comment"># multi-tenant isolation</span>
        <span class="hljs-comment"># Lightweight evaluator: used for relevance judgment (can be replaced with the structured version introduced later)</span>
        <span class="hljs-variable language_">self</span>.evaluator = init_chat_model(<span class="hljs-string">&quot;openai:gpt-4o-mini&quot;</span>, temperature=<span class="hljs-number">0</span>)
        <span class="hljs-comment"># Web search fallback</span>
        <span class="hljs-variable language_">self</span>.web_search = TavilySearchResults(max_results=<span class="hljs-number">3</span>)

<span class="hljs-meta">    @before_model</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">run_crag</span>(<span class="hljs-params">self, state</span>):
        <span class="hljs-string">&quot;&quot;&quot;Run retrieval -&gt; evaluation -&gt; correction before model invocation and prepare the final context&quot;&quot;&quot;</span>
        <span class="hljs-comment"># Get the last user message</span>
        last_msg = state[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>]
        query = <span class="hljs-built_in">getattr</span>(last_msg, <span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>) <span class="hljs-keyword">if</span> <span class="hljs-built_in">hasattr</span>(last_msg, <span class="hljs-string">&quot;content&quot;</span>) <span class="hljs-keyword">else</span> last_msg.get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)

        <span class="hljs-comment"># 1. Retrieval: get documents from Milvus (PartitionKey + confidence filtering)</span>
        docs = <span class="hljs-variable language_">self</span>._retrieve_from_milvus(query)

        <span class="hljs-comment"># 2. Evaluation: three-way decision</span>
        verdict = <span class="hljs-variable language_">self</span>._evaluate_relevance(query, docs)

        <span class="hljs-comment"># 3. Correction: choose the handling strategy based on the verdict</span>
        <span class="hljs-keyword">if</span> verdict == <span class="hljs-string">&quot;incorrect&quot;</span>:
            <span class="hljs-comment"># Retrieval failed, rely entirely on Web search</span>
            web_results = <span class="hljs-variable language_">self</span>._web_search_fallback(query)
            final_context = <span class="hljs-variable language_">self</span>._format_web_results(web_results)
        <span class="hljs-keyword">elif</span> verdict == <span class="hljs-string">&quot;ambiguous&quot;</span>:
            <span class="hljs-comment"># Retrieval is ambiguous, refine documents + supplement with Web search</span>
            refined_docs = <span class="hljs-variable language_">self</span>._refine_documents(docs, query)
            web_results = <span class="hljs-variable language_">self</span>._web_search_fallback(query)
            final_context = <span class="hljs-variable language_">self</span>._merge_context(refined_docs, web_results)
        <span class="hljs-keyword">else</span>:
            <span class="hljs-comment"># Retrieval quality is good, only refine the documents</span>
            refined_docs = <span class="hljs-variable language_">self</span>._refine_documents(docs, query)
            final_context = <span class="hljs-variable language_">self</span>._format_internal_docs(refined_docs)

        <span class="hljs-comment"># 4. Put the context into a temporary key, used only for dynamic prompt assembly in the current model call</span>
        state[<span class="hljs-string">&quot;_crag_context&quot;</span>] = final_context
        <span class="hljs-keyword">return</span> state

<span class="hljs-meta">    @dynamic_prompt</span>
    <span class="hljs-keyword">def</span> <span class="hljs-title function_">attach_context</span>(<span class="hljs-params">self, state, prompt_messages: <span class="hljs-type">List</span></span>):
        <span class="hljs-string">&quot;&quot;&quot;Inject the CRAG-generated context as a SystemMessage before the prompt for the current model call&quot;&quot;&quot;</span>
        final_context = state.get(<span class="hljs-string">&quot;_crag_context&quot;</span>)
        <span class="hljs-keyword">if</span> final_context:
            sys_msg = SystemMessage(
                content=<span class="hljs-string">f&quot;Here is some relevant background information. Please answer the user&#x27;s question based on this information:\n\n<span class="hljs-subst">{final_context}</span>&quot;</span>
            )
            <span class="hljs-comment"># Applies only to the current call and is not permanently written into state[&quot;messages&quot;]</span>
            prompt_messages = [sys_msg] + prompt_messages
        <span class="hljs-keyword">return</span> prompt_messages

    <span class="hljs-comment"># ======== Internal methods: retrieval / evaluation / refinement / formatting ========</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_retrieve_from_milvus</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Retrieve documents from Milvus (Partition Key + confidence filtering)&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            <span class="hljs-comment"># Note: different adapter versions may place filter parameters differently; here expr is passed through search_kwargs</span>
            docs = <span class="hljs-variable language_">self</span>.vector_store.similarity_search(
                query,
                k=<span class="hljs-number">3</span>,
                search_kwargs={<span class="hljs-string">&quot;expr&quot;</span>: <span class="hljs-string">f&#x27;agent_id == &quot;<span class="hljs-subst">{self.agent_id}</span>&quot;&#x27;</span>}
            )
            <span class="hljs-comment"># Confidence filtering (to avoid low-quality memory contamination)</span>
            filtered_docs = [
                doc <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs
                <span class="hljs-keyword">if</span> (doc.metadata <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;confidence&quot;</span>, <span class="hljs-number">0.0</span>) &gt; <span class="hljs-number">0.7</span>
            ]
            <span class="hljs-keyword">return</span> filtered_docs <span class="hljs-keyword">or</span> docs  <span class="hljs-comment"># If there are no high-confidence results, fall back to the original results for evaluator judgment</span>
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Retrieval failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> []

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_evaluate_relevance</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]:
        <span class="hljs-string">&quot;&quot;&quot;Evaluate document relevance (three-way decision), simplified version: the LLM returns the verdict directly&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;incorrect&quot;</span>

        <span class="hljs-comment"># Evaluate only the Top-3 documents, taking the first 500 characters of each</span>
        doc_content = <span class="hljs-string">&quot;\n\n&quot;</span>.join([
            <span class="hljs-string">f&quot;[Document <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>] <span class="hljs-subst">{(doc.page_content <span class="hljs-keyword">or</span> <span class="hljs-string">&#x27;&#x27;</span>)[:<span class="hljs-number">500</span>]}</span>...&quot;</span>
            <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs[:<span class="hljs-number">3</span>])
        ])

        prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an expert in document relevance evaluation. Assess whether the following documents can answer the query.

Query: <span class="hljs-subst">{query}</span>

Document content:
<span class="hljs-subst">{doc_content}</span>

Evaluation criteria:
- relevant: the document directly contains the answer and is highly relevant
- ambiguous: the document is partially relevant and needs external knowledge
- incorrect: the document is irrelevant and cannot answer the query

Return only one word: relevant or ambiguous or incorrect
&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            result = <span class="hljs-variable language_">self</span>.evaluator.invoke(prompt)
            verdict = (<span class="hljs-built_in">getattr</span>(result, <span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>) <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;&quot;</span>).strip().lower()
            <span class="hljs-keyword">if</span> verdict <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> {<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>}:
                verdict = <span class="hljs-string">&quot;ambiguous&quot;</span>
            <span class="hljs-keyword">return</span> verdict
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Evaluation failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;ambiguous&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_refine_documents</span>(<span class="hljs-params">self, docs: <span class="hljs-built_in">list</span>, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Refine documents (simplified strips: sentence filtering based on keywords)&quot;&quot;&quot;</span>
        refined = []
        <span class="hljs-comment"># Simple Chinese-period replacement + rough English sentence splitting</span>
        keywords = [kw.strip() <span class="hljs-keyword">for</span> kw <span class="hljs-keyword">in</span> query.split() <span class="hljs-keyword">if</span> kw.strip()]

        <span class="hljs-keyword">for</span> doc <span class="hljs-keyword">in</span> docs:
            text = doc.page_content <span class="hljs-keyword">or</span> <span class="hljs-string">&quot;&quot;</span>
            sentences = (
                text.replace(<span class="hljs-string">&quot;。&quot;</span>, <span class="hljs-string">&quot;。\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;. &quot;</span>, <span class="hljs-string">&quot;.\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;! &quot;</span>, <span class="hljs-string">&quot;!\n&quot;</span>)
                    .replace(<span class="hljs-string">&quot;? &quot;</span>, <span class="hljs-string">&quot;?\n&quot;</span>)
                    .split(<span class="hljs-string">&quot;\n&quot;</span>)
            )
            sentences = [s.strip() <span class="hljs-keyword">for</span> s <span class="hljs-keyword">in</span> sentences <span class="hljs-keyword">if</span> s.strip()]

            <span class="hljs-comment"># Match any keyword</span>
            relevant_sentences = [
                s <span class="hljs-keyword">for</span> s <span class="hljs-keyword">in</span> sentences
                <span class="hljs-keyword">if</span> <span class="hljs-built_in">any</span>(keyword <span class="hljs-keyword">in</span> s <span class="hljs-keyword">for</span> keyword <span class="hljs-keyword">in</span> keywords)
            ]

            <span class="hljs-keyword">if</span> relevant_sentences:
                refined_text = <span class="hljs-string">&quot;。&quot;</span>.join(relevant_sentences[:<span class="hljs-number">3</span>])
                refined.append(Document(page_content=refined_text, metadata=doc.metadata <span class="hljs-keyword">or</span> {}))

        <span class="hljs-keyword">return</span> refined <span class="hljs-keyword">if</span> refined <span class="hljs-keyword">else</span> docs  <span class="hljs-comment"># If nothing is extracted, fall back to the original documents</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_web_search_fallback</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span></span>) -&gt; <span class="hljs-built_in">list</span>:
        <span class="hljs-string">&quot;&quot;&quot;Web search fallback&quot;&quot;&quot;</span>
        <span class="hljs-keyword">try</span>:
            <span class="hljs-keyword">return</span> <span class="hljs-variable language_">self</span>.web_search.invoke(query) <span class="hljs-keyword">or</span> []
        <span class="hljs-keyword">except</span> Exception <span class="hljs-keyword">as</span> e:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG] Web search failed: <span class="hljs-subst">{e}</span>&quot;</span>)
            <span class="hljs-keyword">return</span> []

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_merge_context</span>(<span class="hljs-params">self, internal_docs: <span class="hljs-built_in">list</span>, web_results: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Merge internal memory and external knowledge into the final context&quot;&quot;&quot;</span>
        parts = []
        <span class="hljs-keyword">if</span> internal_docs:
            parts.append(<span class="hljs-string">&quot;[Internal Memory]&quot;</span>)
            <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(internal_docs, <span class="hljs-number">1</span>):
                parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{doc.page_content}</span>&quot;</span>)
        <span class="hljs-keyword">if</span> web_results:
            parts.append(<span class="hljs-string">&quot;[External Knowledge]&quot;</span>)
            <span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(web_results, <span class="hljs-number">1</span>):
                content = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
                url = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;url&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
                parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{content}</span>\n   Source: <span class="hljs-subst">{url}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts) <span class="hljs-keyword">if</span> parts <span class="hljs-keyword">else</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_format_internal_docs</span>(<span class="hljs-params">self, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Format internal documents&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>
        parts = [<span class="hljs-string">&quot;[Internal Memory]&quot;</span>]
        <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs, <span class="hljs-number">1</span>):
            parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{doc.page_content}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts)

    <span class="hljs-keyword">def</span> <span class="hljs-title function_">_format_web_results</span>(<span class="hljs-params">self, results: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-built_in">str</span>:
        <span class="hljs-string">&quot;&quot;&quot;Format Web search results&quot;&quot;&quot;</span>
        <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> results:
            <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;No relevant information found&quot;</span>
        parts = [<span class="hljs-string">&quot;[External Knowledge]&quot;</span>]
        <span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results, <span class="hljs-number">1</span>):
            content = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;content&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
            url = (result <span class="hljs-keyword">or</span> {}).get(<span class="hljs-string">&quot;url&quot;</span>, <span class="hljs-string">&quot;&quot;</span>)
            parts.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{i}</span>. <span class="hljs-subst">{content}</span>\n   Source: <span class="hljs-subst">{url}</span>&quot;</span>)
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(parts)


<span class="hljs-comment"># ============ Initialize the Milvus vector database ============</span>
vector_store = Milvus(
    embedding_function=OpenAIEmbeddings(),
    connection_args={<span class="hljs-string">&quot;host&quot;</span>: <span class="hljs-string">&quot;localhost&quot;</span>, <span class="hljs-string">&quot;port&quot;</span>: <span class="hljs-string">&quot;19530&quot;</span>},
    collection_name=<span class="hljs-string">&quot;agent_memory&quot;</span>
)

<span class="hljs-comment"># ============ Create Agent ============</span>
agent = create_agent(
    model=<span class="hljs-string">&quot;openai:gpt-4o&quot;</span>,
    tools=[TavilySearchResults(max_results=<span class="hljs-number">3</span>)],  <span class="hljs-comment"># Web search tool</span>
    middleware=[
        CRAGMiddleware(
            vector_store=vector_store,
            agent_id=<span class="hljs-string">&quot;user_123_session_456&quot;</span>  <span class="hljs-comment"># multi-tenant isolation: each Agent instance uses its own ID</span>
        )
    ]
)

<span class="hljs-comment"># ============ Example run ============</span>
<span class="hljs-keyword">if</span> __name__ == <span class="hljs-string">&quot;__main__&quot;</span>:
    <span class="hljs-comment"># Example query: use HumanMessage to ensure compatibility</span>
    response = agent.invoke({
        <span class="hljs-string">&quot;messages&quot;</span>: [
            HumanMessage(content=<span class="hljs-string">&quot;What were the operating expenses in Nike&#x27;s latest quarterly earnings report?&quot;</span>)
        ]
    })
    <span class="hljs-built_in">print</span>(response[<span class="hljs-string">&quot;messages&quot;</span>][-<span class="hljs-number">1</span>].content)
<button class="copy-code-btn"></button></code></pre>
<blockquote>
<p><strong>Version Note:</strong>このコードはLangGraphとLangChainの最新のミドルウェア機能を使用しています。これらのAPIはフレームワークの進化に伴い変更される可能性があります。</p>
</blockquote>
<h3 id="Key-Modules" class="common-anchor-header">主要モジュール</h3><p><strong>1.プロダクショングレード・エバリュエータの設計</strong></p>
<p>上のコードの<code translate="no">_evaluate_relevance()</code> メソッドは、迅速なテストのために意図的に簡略化されています。本番用には、信頼性のスコアリングと説明可能な構造化されたアウトプットが必要です：</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">from</span> pydantic <span class="hljs-keyword">import</span> BaseModel
<span class="hljs-keyword">from</span> langchain.prompts <span class="hljs-keyword">import</span> PromptTemplate

<span class="hljs-keyword">class</span> <span class="hljs-title class_">RelevanceVerdict</span>(<span class="hljs-title class_ inherited__">BaseModel</span>):
    <span class="hljs-string">&quot;&quot;&quot;Structured output for the evaluation result&quot;&quot;&quot;</span>
    verdict: <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]
    confidence: <span class="hljs-built_in">float</span>  <span class="hljs-comment"># confidence score (used for memory quality monitoring)</span>
    reasoning: <span class="hljs-built_in">str</span>     <span class="hljs-comment"># reason for the judgment (used for debugging and review)</span>

<span class="hljs-comment"># Note: the CRAG paper uses a fine-tuned T5-Large evaluator (10-20 ms latency)</span>
<span class="hljs-comment"># Here, gpt-4o-mini is used as the engineering implementation option (easier to deploy, but with slightly higher latency)</span>
grader_llm = ChatOpenAI(model=<span class="hljs-string">&quot;gpt-4o-mini&quot;</span>, temperature=<span class="hljs-number">0</span>)

grader_prompt = PromptTemplate(
    template=<span class="hljs-string">&quot;&quot;&quot;You are an expert in document relevance evaluation. Assess whether the following documents can answer the query.

Query: {query}

Document content:
{document}

Evaluation criteria:
- relevant: the document directly contains the answer, confidence &gt; 0.9
- ambiguous: the document is partially relevant, confidence 0.5-0.9
- incorrect: the document is irrelevant, confidence &lt; 0.5

Return in JSON format: {{&quot;verdict&quot;: &quot;...&quot;, &quot;confidence&quot;: 0.xx, &quot;reasoning&quot;: &quot;...&quot;}}
&quot;&quot;&quot;</span>,
    input_variables=[<span class="hljs-string">&quot;query&quot;</span>, <span class="hljs-string">&quot;document&quot;</span>]
)

grader_chain = grader_prompt | grader_llm.with_structured_output(RelevanceVerdict)

<span class="hljs-comment"># Replace the _evaluate_relevance() method in CRAGMiddleware</span>
<span class="hljs-keyword">def</span> <span class="hljs-title function_">_evaluate_relevance</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, docs: <span class="hljs-built_in">list</span></span>) -&gt; <span class="hljs-type">Literal</span>[<span class="hljs-string">&quot;relevant&quot;</span>, <span class="hljs-string">&quot;ambiguous&quot;</span>, <span class="hljs-string">&quot;incorrect&quot;</span>]:
    <span class="hljs-string">&quot;&quot;&quot;Evaluate document relevance (returns structured result)&quot;&quot;&quot;</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> docs:
        <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;incorrect&quot;</span>

    <span class="hljs-comment"># Evaluate only the Top-3 documents, taking the first 500 characters of each</span>
    doc_content = <span class="hljs-string">&quot;\n\n&quot;</span>.join([
        <span class="hljs-string">f&quot;[Document <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>] <span class="hljs-subst">{doc.page_content[:<span class="hljs-number">500</span>]}</span>...&quot;</span>
        <span class="hljs-keyword">for</span> i, doc <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(docs[:<span class="hljs-number">3</span>])
    ])

    result = grader_chain.invoke({
        <span class="hljs-string">&quot;query&quot;</span>: query,
        <span class="hljs-string">&quot;document&quot;</span>: doc_content
    })

    <span class="hljs-comment"># Store the confidence score in logs or a monitoring system</span>
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG Evaluation] verdict=<span class="hljs-subst">{result.verdict}</span>, confidence=<span class="hljs-subst">{result.confidence:<span class="hljs-number">.2</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;[CRAG Reasoning] <span class="hljs-subst">{result.reasoning}</span>&quot;</span>)

    <span class="hljs-comment"># Optional: store the evaluation result in Milvus for memory quality analysis</span>
    <span class="hljs-variable language_">self</span>._store_evaluation_metrics(query, result)

    <span class="hljs-keyword">return</span> result.verdict

<span class="hljs-keyword">def</span> <span class="hljs-title function_">_store_evaluation_metrics</span>(<span class="hljs-params">self, query: <span class="hljs-built_in">str</span>, verdict_result: RelevanceVerdict</span>):
    <span class="hljs-string">&quot;&quot;&quot;Store evaluation metrics in Milvus (for memory quality monitoring)&quot;&quot;&quot;</span>
    <span class="hljs-comment"># Example: store the evaluation result in a separate Collection for analysis</span>
    <span class="hljs-comment"># In actual use, you need to create the evaluation_metrics Collection</span>
    <span class="hljs-keyword">pass</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>2.知識の洗練とフォールバック</strong></p>
<p>モデルのコンテキストを高品質に保つために、3つのメカニズムが連携します：</p>
<ul>
<li><strong>知識絞り込みは</strong>、最もクエリに関連するセンテンスを抽出し、ノイズを取り除く。</li>
<li><strong>フォールバック検索は</strong>、ローカル検索が不十分な場合にトリガーされ、Tavilyを介して外部の知識を取り込む。</li>
<li><strong>コンテキストマージは</strong>、モデルに到達する前に、内部メモリと外部結果を単一の重複排除されたコンテキストブロックに結合します。</li>
</ul>
<h2 id="Tips-for-Running-CRAG-in-Production" class="common-anchor-header">本番環境でCRAGを実行するためのヒント<button data-href="#Tips-for-Running-CRAG-in-Production" class="anchor-icon" translate="no">
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
    </button></h2><p>プロトタイピングを超えると、3つの領域が最も重要になります。</p>
<h3 id="1-Cost-Pick-the-Right-Evaluator" class="common-anchor-header">1.コスト：正しい評価器を選ぶ</h3><p>エバリュエータは全てのクエリで実行されるため、レイテンシとコストの両面で最大の影響を及ぼします。</p>
<ul>
<li><strong>高同時実行ワークロード：</strong>T5-Largeのような微調整された軽量モデルであれば、レイテンシは10-20msに抑えられ、コストも予測可能です。</li>
<li><strong>低トラフィックまたはプロトタイピング：</strong> <code translate="no">gpt-4o-mini</code> のようなホスト型モデルは、セットアップが早く、運用作業も少なくて済みますが、レイテンシとコールごとのコストは高くなります。</li>
</ul>
<h3 id="2-Observability-Instrument-from-Day-One" class="common-anchor-header">2.観測可能性：初日から計測</h3><p>最も困難な生産上の問題は、回答の品質がすでに低下するまで見えないものである。</p>
<ul>
<li><strong>インフラ監視：</strong>Milvusは<a href="https://milvus.io/docs/monitor_overview.md">Prometheusと</a>統合しています。3つのメトリクスから始めましょう：<code translate="no">milvus_query_latency_seconds</code> <code translate="no">milvus_search_qps</code> と<code translate="no">milvus_insert_throughput</code> 。</li>
<li><strong>アプリケーションのモニタリング：</strong>CRAG評決分布、ウェブ検索トリガー率、信頼度スコア分布を追跡する。これらのシグナルがなければ、品質が低下した原因が検索不良によるものなのか、評価者の判断ミスによるものなのかを見分けることができません。</li>
</ul>
<h3 id="3-Long-Term-Maintenance-Prevent-Memory-Contamination" class="common-anchor-header">3.長期メンテナンス：メモリの汚染を防ぐ</h3><p>エージェントが長く稼働すればするほど、古く低品質なデータがメモリに蓄積されます。早めにガードレールを設置しましょう：</p>
<ul>
<li><strong>事前フィルタリング：</strong> <code translate="no">confidence &gt; 0.7</code> 、低品質なコンテンツが評価者に到達する前にブロックされるように、メモリのみを表面化させる。</li>
<li><strong>時間減衰：</strong>古いメモリの重みを徐々に減らす。デフォルトでは30日が妥当で、ユースケースごとに調整可能。</li>
<li><strong>定期的なクリーンアップ：</strong>毎週ジョブを実行して、古い、信頼性の低い、検証されていない記憶をパージする。これにより、古いデータが検索され、使用され、再保存されるというフィードバックループを防ぐことができる。</li>
</ul>
<h2 id="Wrapping-Up--and-a-Few-Common-Questions" class="common-anchor-header">まとめ - そしてよくある質問<button data-href="#Wrapping-Up--and-a-Few-Common-Questions" class="anchor-icon" translate="no">
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
    </button></h2><p>CRAGは、プロダクションRAGにおける最も根強い問題の一つである、関連性があるように見えてそうでない検索結果に対処する。検索と生成の間に評価と修正のステップを挿入することで、悪い結果をフィルタリングし、外部検索でギャップを埋め、モデルにクリーンなコンテキストを与えます。</p>
<p>CRAGを本番で確実に機能させるには、優れた検索ロジック以上のものが必要だ。マルチテナント分離、ハイブリッド検索、進化するスキーマに対応するベクターデータベースが必要であり、<a href="https://milvus.io/intro">milvusは</a>そこに適している。アプリケーション側では、適切なエバリュエータを選択し、早期に観測可能性をインストルメント化し、積極的にメモリ品質を管理することが、デモと信頼できるシステムを分ける。</p>
<p>もし、あなたがRAGやエージェントシステムを構築していて、検索品質の問題にぶつかっているのであれば、ぜひお手伝いさせてください：</p>
<ul>
<li><a href="https://slack.milvus.io/">MilvusのSlackコミュニティに</a>参加して、質問をしたり、アーキテクチャを共有したり、同じような問題に取り組んでいる他の開発者から学んだりしましょう。</li>
<li><a href="https://milvus.io/office-hours">Milvusオフィスアワー（20分無料）をご予約</a>いただき、CRAG設計、ハイブリッド検索、マルチテナント型スケーリングなど、お客様のユースケースをチームと一緒に検討しましょう。</li>
<li>インフラストラクチャのセットアップをスキップして、すぐに構築に取りかかりたい場合は、Milvusのマネージドである<a href="https://cloud.zilliz.com/signup">Zilliz Cloudが</a>無料ティアを提供しています。</li>
</ul>
<hr>
<p>チームがCRAGを導入し始めると、よく出てくる質問がいくつかある：</p>
<p><strong>CRAGはRAGにリランカーを追加するのとどう違うのですか？</strong></p>
<p>CRAGはRAGにリランカーを追加するのとどう違うのですか？リランカーは検索結果を関連性で並べ替えますが、それでも検索された文書が使用可能であることを前提にしています。CRAGはさらに進んでおり、検索されたコンテンツが実際にクエリにまったく答えているかどうかを評価し、そうでない場合は修正措置を取る。つまり、部分一致の絞り込み、ウェブ検索による補足、あるいは結果を完全に破棄する。これは品質管理のループであり、単なるソートの改善ではない。</p>
<p><strong>なぜ高い類似度スコアが間違った文書を返すことがあるのでしょうか？</strong></p>
<p>埋め込み類似度はベクトル空間における意味的な近さを測定するが、それは質問に答えることとは違う。ApacheのHTTPS設定に関する文書は、NginxのHTTPSに関する質問と意味的に近いですが、それは役に立ちません。CRAGはベクトル距離だけでなく、実際のクエリとの関連性を評価することでこれをキャッチします。</p>
<p><strong>CRAG用のベクトルデータベースには何を求めるべきか？</strong></p>
<p>ハイブリッド検索（セマンティック検索とキーワードマッチを組み合わせて正確な用語を検索できる）、マルチテナント分離（各ユーザーやエージェントセッションが独自のメモリ空間を持つ）、柔軟なスキーマ（パイプラインが進化してもダウンタイムなしに<code translate="no">confidence</code> や<code translate="no">verified</code> のようなフィールドを追加できる）の3つが最も重要です。</p>
<p><strong>検索された文書がどれも関連性がない場合はどうなるのでしょうか？</strong></p>
<p>CRAGはただ諦めるわけではありません。信頼度が0.5を下回ると、ウェブ検索に戻ります。結果が曖昧な場合（0.5-0.9）、改良された内部文書を外部検索結果とマージする。知識ベースにギャップがある場合でも、モデルは常に何らかのコンテキストを得ることができる。</p>
