---
id: >-
  we-benchmarked-20-embedding-apis-with-milvus-7-insights-that-will-surprise-you.md
title: 'Milvusで20以上のエンベッディングAPIをベンチマーク: 驚くべき7つのインサイト'
author: Jeremy Zhu
date: 2025-05-23T00:00:00.000Z
desc: >-
  最も人気のあるエンベデッドAPIは最速ではないモデル・アーキテクチャよりも地理が重要だ。そして、月20ドルのCPUが月200ドルのAPIコールに勝ることもある。
cover: >-
  assets.zilliz.com/We_Benchmarked_20_Embedding_AP_Is_with_Milvus_7_Insights_That_Will_Surprise_You_12268622f0.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, Embedding API, RAG, latency, vector search'
meta_title: >
  We Benchmarked 20+ Embedding APIs with Milvus: 7 Insights That Will Surprise
  You
origin: >-
  https://milvus.io/blog/we-benchmarked-20-embedding-apis-with-milvus-7-insights-that-will-surprise-you.md
---
<p><strong>おそらくすべてのAI開発者は、自分のローカル環境で完璧に動作するRAGシステムを構築したことがあるだろう。</strong></p>
<p>検索精度に釘付けになり、ベクター・データベースを最適化し、デモはまるでバターのように動く。そして本番環境にデプロイすると、突然こうなる：</p>
<ul>
<li><p>200msのローカルクエリが、実際のユーザーには3秒かかる。</p></li>
<li><p>異なる地域の同僚が、まったく異なるパフォーマンスを報告</p></li>
<li><p>最高の精度」のために選んだエンベッディング・プロバイダが最大のボトルネックになる</p></li>
</ul>
<p>何が起こったのか？<strong>エンベッディングAPIのレイテンシー</strong>です。</p>
<p>MTEBランキングは、リコールスコアやモデルサイズにこだわる一方で、ユーザーが実際に感じている、レスポンスが表示されるまでの待ち時間という指標を無視しています。私たちは、主要なエンベッディングプロバイダーを実環境でテストし、プロバイダー選択戦略全体を疑わせるほど極端なレイテンシの違いを発見しました。</p>
<p><strong><em>ネタバレ最も人気のあるエンベッディングAPIは最速ではないモデル・アーキテクチャよりも地理が重要。そして、<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>月</mn><mi>20</mi><mn>CPUが月20CPUに</mn></mrow><annotation encoding="application/x-tex">勝る</annotation></semantics></math></span></span>こともある。<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="mord">月20CPUが月</span><span class="mord mathnormal">200</span></span></span></span>APIコールに<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">勝る</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">こともある</span></span></span></span>。</em></strong></p>
<h2 id="Why-Embedding-API-Latency-Is-the-Hidden-Bottleneck-in-RAG" class="common-anchor-header">APIレイテンシーの埋め込みがRAGの隠れたボトルネックである理由<button data-href="#Why-Embedding-API-Latency-Is-the-Hidden-Bottleneck-in-RAG" class="anchor-icon" translate="no">
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
    </button></h2><p>RAGシステム、電子商取引検索、または推薦エンジンを構築する際、埋め込みモデルはテキストをベクトルに変換するコアコンポーネントとして機能し、機械がセマンティクスを理解し、効率的な類似検索を実行できるようにする。通常、文書ライブラリのエンベッディングは事前に計算されますが、ユーザークエリは、検索前に質問をベクトルに変換するためにリアルタイムエンベッディングAPIコールを必要とし、このリアルタイムレイテンシがアプリケーションチェーン全体のパフォーマンスボトルネックになることがよくあります。</p>
<p>MTEBのような一般的なエンベッディングベンチマークは、リコール精度やモデルサイズに重点を置いており、重要なパフォーマンス指標であるAPIレイテンシを見落としています。Milvusの<code translate="no">TextEmbedding</code> 関数を使用して、北米とアジアの主要なエンベッディング・サービス・プロバイダで包括的な実環境テストを実施しました。</p>
<p>エンベッディングの待ち時間は2つの重要な段階で現れます：</p>
<h3 id="Query-Time-Impact" class="common-anchor-header">クエリ時間の影響</h3><p>典型的なRAGのワークフローでは、ユーザーが質問をすると、システムは次のことをしなければならない：</p>
<ul>
<li><p>エンベッディングAPIコールを介してクエリをベクトルに変換する。</p></li>
<li><p>Milvusで類似したベクトルを検索する。</p></li>
<li><p>結果と元の質問をLLMに送る</p></li>
<li><p>答えを生成して返す</p></li>
</ul>
<p>多くの開発者は、LLMの回答生成が最も遅い部分だと考えています。しかし、多くのLLMのストリーミング出力機能は、最初のトークンがすぐに表示され、スピードが速いように錯覚させます。実際には、エンベッディングAPIの呼び出しに数百ミリ秒から数秒かかる場合、レスポンスチェーンの最初の、そして最も顕著なボトルネックになります。</p>
<h3 id="Data-Ingestion-Impact" class="common-anchor-header">データ取り込みの影響</h3><p>ゼロからインデックスを構築するにしても、定期的な更新を行うにしても、一括取り込みには何千、何百万ものテキストチャンクをベクトル化する必要があります。各エンベッディングコールが高いレイテンシーを経験すると、データパイプライン全体が劇的に遅くなり、製品リリースやナレッジベースの更新が遅れます。</p>
<p>どちらのシナリオでも、エンベッディングAPIのレイテンシは、プロダクションRAGシステムにとって譲れないパフォーマンス指標となります。</p>
<h2 id="Measuring-Real-World-Embedding-API-Latency-with-Milvus" class="common-anchor-header">Milvusによる実世界のエンベッディングAPIレイテンシの測定<button data-href="#Measuring-Real-World-Embedding-API-Latency-with-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvusはオープンソースの高性能ベクトルデータベースで、新しい<code translate="no">TextEmbedding</code> 関数インターフェースを提供します。この機能は、OpenAI、Cohere、AWS Bedrock、Google Vertex AI、Voyage AI、その他多くのプロバイダから人気のあるエンベッディングモデルをデータパイプラインに直接統合し、1回の呼び出しでベクトル検索パイプラインを効率化します。</p>
<p>この新しい関数インターフェイスを使用して、OpenAIやCohereのようなアメリカのモデルプロバイダーや、AliCloudやSiliconFlowのようなアジアのプロバイダーから、様々な一般的な埋め込みAPIをテストし、ベンチマークを行い、現実的なデプロイシナリオでエンドツーエンドのレイテンシを測定しました。</p>
<p>私たちの包括的なテストスイートは、様々なモデル構成をカバーしています：</p>
<table>
<thead>
<tr><th><strong>プロバイダー</strong></th><th><strong>モデル</strong></th><th><strong>ディメンション</strong></th></tr>
</thead>
<tbody>
<tr><td>OpenAI</td><td>テキスト埋め込み</td><td>1536</td></tr>
<tr><td>オープンAI</td><td>テキスト埋め込み-3-小</td><td>1536</td></tr>
<tr><td>OpenAI</td><td>テキスト埋め込み-3-大</td><td>3072</td></tr>
<tr><td>AWSベッドロック</td><td>amazon.titan-embed-text-v2:0</td><td>1024</td></tr>
<tr><td>グーグル・バーテックスAI</td><td>テキスト埋め込み-005</td><td>768</td></tr>
<tr><td>グーグル バーテックスAI</td><td>テキスト多言語埋め込み-002</td><td>768</td></tr>
<tr><td>ボヤージュAI</td><td>ボヤージュ-3-ラージ</td><td>1024</td></tr>
<tr><td>ボヤージュAI</td><td>ボヤージュ3</td><td>1024</td></tr>
<tr><td>ボヤージュAI</td><td>ボヤージュ3ライト</td><td>512</td></tr>
<tr><td>ボヤージュ-AI</td><td>ボヤージュ-コード-3</td><td>1024</td></tr>
<tr><td>コヒーレ</td><td>英語埋め込み-v3.0</td><td>1024</td></tr>
<tr><td>Cohere</td><td>多言語埋め込み-v3.0</td><td>1024</td></tr>
<tr><td>Cohere</td><td>エンベッド英語-ライト-v3.0</td><td>384</td></tr>
<tr><td>Cohere</td><td>埋め込み多言語ライト-v3.0</td><td>384</td></tr>
<tr><td>アリユン・ダッシュスコープ</td><td>テキスト埋め込み-v1</td><td>1536</td></tr>
<tr><td>阿里雲ダッシュスコープ</td><td>テキスト埋め込み-v2</td><td>1536</td></tr>
<tr><td>アリユン・ダッシュスコープ</td><td>テキスト埋め込み-v3</td><td>1024</td></tr>
<tr><td>シリコンフロー</td><td>BAAI/bge-large-zh-v1.5</td><td>1024</td></tr>
<tr><td>シリコンフロー</td><td>BAAI/bge-large-ja-v1.5</td><td>1024</td></tr>
<tr><td>シリコンフロー</td><td>網易用度/bce-embedding-base_v1</td><td>768</td></tr>
<tr><td>シリコンフロー</td><td>BAAI/bge-m3</td><td>1024</td></tr>
<tr><td>シリコンフロー</td><td>プロ/BAAI/bge-m3</td><td>1024</td></tr>
<tr><td>TEI</td><td>BAAI/bge-base-ja-v1.5</td><td>768</td></tr>
</tbody>
</table>
<h2 id="7-Key-Findings-from-Our-Benchmarking-Results" class="common-anchor-header">7 ベンチマーキング結果から得られた主な結果<button data-href="#7-Key-Findings-from-Our-Benchmarking-Results" class="anchor-icon" translate="no">
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
    </button></h2><p>北米とアジアの有名なエンベッディング・モデルを、異なるバッチサイズ、トークン長、ネットワーク条件下でテストし、すべてのシナリオにおける遅延の中央値を測定しました。その結果、エンベッディングAPIの選択と最適化についての考え方を変える重要な洞察が明らかになりました。それでは見てみよう。</p>
<h3 id="1-Global-Network-Effects-Are-More-Significant-Than-You-Think" class="common-anchor-header">1.グローバル・ネットワークの影響は思っている以上に大きい</h3><p>ネットワーク環境は、おそらくエンベッディングAPIのパフォーマンスに影響を与える最も重要な要因です。同じエンベッディングAPIサービス・プロバイダでも、ネットワーク環境によってパフォーマンスが劇的に異なることがあります。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/latency_in_Asia_vs_in_US_cb4b5a425a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>あなたのアプリケーションがアジアにデプロイされ、北米にデプロイされたOpenAI、Cohere、VoyageAIのようなサービスにアクセスする場合、ネットワーク遅延は大幅に増加します。私たちの実際のテストでは、APIコールのレイテンシは普遍的に<strong>3〜4倍</strong>増加しました！</p>
<p>逆に、アプリケーションが北米にデプロイされ、AliCloud DashscopeやSiliconFlowのようなアジアのサービスにアクセスする場合、パフォーマンスの低下はさらに深刻になります。特にSiliconFlowでは、クロスリージョンシナリオでレイテンシが<strong>100倍近く</strong>増加しました！</p>
<p>つまり、エンベッディング・プロバイダーは、常に展開場所とユーザーの地理に基づいて選択する必要があります。ネットワークのコンテキストを伴わないパフォーマンスの主張は無意味です。</p>
<h3 id="2-Model-Performance-Rankings-Reveal-Surprising-Results" class="common-anchor-header">2.モデル・パフォーマンス・ランキングの驚くべき結果</h3><p>包括的なレイテンシ・テストにより、明確なパフォーマンス・ヒエラルキーが明らかになりました：</p>
<ul>
<li><p><strong>北米モデル（レイテンシーの中央値）</strong>：Cohere &gt; Google Vertex AI &gt; VoyageAI &gt; OpenAI &gt; AWS Bedrock</p></li>
<li><p><strong>アジアモデル（レイテンシ中央値）</strong>：SiliconFlow &gt; AliCloud Dashscope</p></li>
</ul>
<p>これらのランキングは、プロバイダー選択に関する従来の常識を覆すものである。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/median_latency_with_batch_size_1_ef83bec9c8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/median_latency_with_batch_size_10_0d4e52566f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/all_model_latency_vs_token_length_when_batch_size_is_10_537516cc1c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/all_model_latency_vstoken_lengthwhen_batch_size_is_10_4dcf0d549a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>注：リアルタイムエンベッディングAPIのレイテンシーには、ネットワーク環境とサーバーの地域が大きく影響するため、北米とアジアのモデルのレイテンシーを別々に比較した。</p>
<h3 id="3-Model-Size-Impact-Varies-Dramatically-by-Provider" class="common-anchor-header">3.モデルサイズの影響はプロバイダによって大きく異なる</h3><p>一般的な傾向として、大きなモデルは標準的なモデルよりもレイテンシが高く、小さなモデルやライトモデルよりもレイテンシが高いことが確認されました。しかし、このパターンは普遍的なものではなく、バックエンドアーキテクチャに関する重要な洞察が明らかになりました。例えば</p>
<ul>
<li><p><strong>CohereとOpenAIは</strong>、モデルサイズ間のパフォーマンスギャップを最小限に抑えた。</p></li>
<li><p><strong>VoyageAIは</strong>、モデルサイズによって明確なパフォーマンスの違いを示した。</p></li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Model_Size_Impact_Varies_Dramatically_by_Provider_1_f9eaf2be26.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Model_Size_Impact_Varies_Dramatically_by_Provider_2_cf4d72d1ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Model_Size_Impact_Varies_Dramatically_by_Provider_3_5e0c8d890b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>このことから、APIのレスポンスタイムは、バックエンドのバッチ戦略、リクエスト処理の最適化、プロバイダ固有のインフラストラクチャなど、モデルアーキテクチャ以外の複数の要因に依存することがわかる。教訓は明確です：<em>信頼できるパフォーマンス指標としてモデルサイズやリリース日を信用してはいけません-常にあなた自身のデプロイ環境でテストしてください。</em></p>
<h3 id="4-Token-Length-and-Batch-Size-Create-Complex-Trade-offs" class="common-anchor-header">4.トークンの長さとバッチサイズが複雑なトレードオフを生む</h3><p>バックエンドの実装、特にバッチ戦略によっては、バッチサイズが大きくなるまで、トークンの長さがレイテンシに大きな影響を与えない場合があります。我々のテストでは、明確なパターンが明らかになった：</p>
<ul>
<li><p><strong>OpenAIのレイテンシは</strong>小さいバッチと大きいバッチの間でかなり一貫しており、バックエンドのバッチ処理能力に余裕があることを示唆している<strong>。</strong></p></li>
<li><p><strong>VoyageAIは</strong>トークンの長さによる影響を明確に示しており、バックエンドのバッチ最適化が最小限であることを示唆している。</p></li>
</ul>
<p>バッチサイズを大きくすると、絶対的なレイテンシは増加するが、全体的なスループットは向上する。我々のテストでは、batch=1からbatch=10に移行することで、レイテンシは2×-5×増加したが、総スループットは大幅に向上した。これは、個々のリクエストのレイテンシと引き換えにシステム全体のスループットを劇的に向上させることができる、バルク処理ワークフローの重要な最適化の機会を示している。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Going_from_batch_1_to_10_latency_increased_2_5_9811536a3c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>バッチ=1から10にすることで、レイテンシは2×-5×増加した。</p>
<h3 id="5-API-Reliability-Introduces-Production-Risk" class="common-anchor-header">5.APIの信頼性が生産リスクをもたらす</h3><p>特にOpenAIとVoyageAIでは、レイテンシに大きなばらつきが見られ、本番システムに予測不可能性をもたらしています。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Latency_variance_when_batch_1_d9cd88fb73.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>バッチ=1でのレイテンシのばらつき</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Latency_variance_when_batch_10_5efc33bf4e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>バッチ=10時のレイテンシのばらつき</p>
<p>我々のテストは主にレイテンシーに焦点を当てたが、外部APIに依存することは、ネットワークの変動、プロバイダのレート制限、サービス停止を含む固有の障害リスクをもたらす。プロバイダーからの明確なSLAがなければ、開発者は本番環境でシステムの信頼性を維持するために、リトライ、タイムアウト、サーキットブレーカーを含む強固なエラー処理戦略を実装すべきである。</p>
<h3 id="6-Local-Inference-Can-Be-Surprisingly-Competitive" class="common-anchor-header">6.ローカル推論は驚くほど競争力がある</h3><p>我々のテストでは、中規模のエンベッディング・モデルをローカルにデプロイすることで、クラウドAPIに匹敵するパフォーマンスを提供できることも明らかになった。</p>
<p>例えば、4c8gのCPUでTEI（Text Embeddings Inference）を介してオープンソースの<code translate="no">bge-base-en-v1.5</code> をデプロイすると、SiliconFlowのレイテンシパフォーマンスに匹敵し、手頃な価格のローカル推論代替手段を提供しました。この発見は、エンタープライズグレードのGPUリソースがなくても高性能なエンベッディング機能を必要とする個人開発者や小規模チームにとって特に重要です。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/TEI_Latency_2f09be1ef0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>TEIのレイテンシ</p>
<h3 id="7-Milvus-Overhead-Is-Negligible" class="common-anchor-header">7.Milvusのオーバーヘッドはごくわずか</h3><p>エンベッディングAPIのレイテンシをテストするためにMilvusを使用したので、MilvusのTextEmbedding関数によってもたらされる追加のオーバーヘッドは、非常に小さく、事実上無視できることを検証しました。我々の測定によると、<strong>Milvusの</strong>操作は合計20-40msしか追加されませんが、エンベッディングAPIの呼び出しは数百ミリ秒から数秒かかります。パフォーマンスのボトルネックは、Milvusサーバーレイヤーではなく、主にネットワーク伝送とエンベッディングAPIサービスプロバイダー自身の処理能力にあります。</p>
<h2 id="Tips-How-to-Optimize-Your-RAG-Embedding-Performance" class="common-anchor-header">ヒントRAGエンベッディングのパフォーマンスを最適化する方法<button data-href="#Tips-How-to-Optimize-Your-RAG-Embedding-Performance" class="anchor-icon" translate="no">
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
    </button></h2><p>包括的なベンチマークに基づき、RAGシステムのエンベッディングパフォーマンスを最適化するために以下の戦略をお勧めします：</p>
<h3 id="1-Always-Localize-Your-Testing" class="common-anchor-header">1.常にテストをローカライズする</h3><p>一般的なベンチマークレポート（このレポートを含む！）を盲目的に信用しないでください。公開されているベンチマークだけに頼るのではなく、常に実際の展開環境でモデルをテストする必要があります。ネットワークの状態、地理的な近さ、インフラの違いは、実際のパフォーマンスに劇的な影響を与える可能性があります。</p>
<h3 id="2-Geo-Match-Your-Providers-Strategically" class="common-anchor-header">2.プロバイダーを戦略的に地理的にマッチさせる</h3><ul>
<li><p><strong>北米での展開の場合</strong>Cohere、VoyageAI、OpenAI/Azure、またはGCP Vertex AIを検討し、常に独自のパフォーマンス検証を行います。</p></li>
<li><p><strong>アジアのデプロイメント</strong>：AliCloud DashscopeやSiliconFlowのようなアジアのモデルプロバイダーを真剣に検討してください。</p></li>
<li><p><strong>グローバル向け</strong>：マルチリージョン・ルーティングを実装するか、グローバルに分散されたインフラを持つプロバイダーを選択することで、クロスリージョンのレイテンシ・ペナルティを最小限に抑えることができます。</p></li>
</ul>
<h3 id="3-Question-Default-Provider-Choices" class="common-anchor-header">3.デフォルトのプロバイダーの選択を疑う</h3><p>OpenAIのエンベッディングモデルは非常に人気があり、多くの企業や開発者がデフォルトのオプションとして選択しています。しかし、私たちのテストでは、OpenAIのレイテンシと安定性は、市場での人気にもかかわらず、せいぜい平均的であることが明らかになりました。独自の厳密なベンチマークで「最高の」プロバイダーについての仮定に挑戦してください-人気は、あなたの特定のユースケースに最適なパフォーマンスと必ずしも相関しません。</p>
<h3 id="4-Optimize-Batch-and-Chunk-Configurations" class="common-anchor-header">4.バッチ構成とチャンク構成の最適化</h3><p>1つの構成がすべてのモデルやユースケースに適合するわけではありません。最適なバッチサイズとチャンクの長さは、バックエンドアーキテクチャやバッチ戦略の違いにより、プロバイダーによって大きく異なります。さまざまな構成で体系的に実験し、特定のアプリケーション要件のスループット対レイテンシのトレードオフを考慮しながら、最適なパフォーマンスポイントを見つけましょう。</p>
<h3 id="5-Implement-Strategic-Caching" class="common-anchor-header">5.戦略的キャッシュの実装</h3><p>頻度の高いクエリについては、クエリテキストと生成されたエンベッディングの両方をキャッシュする（Redisなどのソリューションを使用）。後続の同一のクエリは、直接キャッシュをヒットすることができ、レイテンシをミリ秒に短縮することができます。これは、最も費用対効果が高く、インパクトのあるクエリレイテンシ最適化テクニックの1つです。</p>
<h3 id="6-Consider-Local-Inference-Deployment" class="common-anchor-header">6.ローカル推論の導入を検討する</h3><p>データ取り込みレイテンシ、クエリレイテンシ、データプライバシーの要件が極めて高い場合、あるいはAPIコールのコストが法外な場合、推論のために埋め込みモデルをローカルに展開することを検討する。標準的なAPIプランには、QPSの制限、不安定なレイテンシ、SLA保証の欠如がしばしば付きまとう。</p>
<p>多くの個人開発者や小規模チームにとって、エンタープライズ・グレードのGPUがないことは、高性能エンベッディング・モデルをローカルにデプロイする障壁のように思えるかもしれません。しかし、これはローカル推論を完全に放棄することを意味しません。<a href="https://github.com/huggingface/text-embeddings-inference">Hugging Faceのtext-embeddings-inferenceの</a>ような高性能推論エンジンと組み合わせることで、CPU上で小規模から中規模のエンベッディングモデルを実行することでさえ、特に大規模なオフラインエンベッディング生成の場合、高レイテンシのAPIコールを凌駕するかもしれない、適切なパフォーマンスを達成することができます。</p>
<p>このアプローチでは、コスト、パフォーマンス、メンテナンスの複雑さのトレードオフを慎重に考慮する必要があります。</p>
<h2 id="How-Milvus-Simplifies-Your-Embedding-Workflow" class="common-anchor-header">Milvusがエンベッディングワークフローを簡素化する方法<button data-href="#How-Milvus-Simplifies-Your-Embedding-Workflow" class="anchor-icon" translate="no">
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
    </button></h2><p>前述の通り、Milvusは単なる高性能なベクトルデータベースではなく、OpenAI、Cohere、AWS Bedrock、Google Vertex AI、Voyage AIなど、世界中の様々なプロバイダーから提供されている一般的なエンベッディングモデルをベクトル検索パイプラインにシームレスに統合する便利なエンベッディング機能インターフェイスも提供しています。</p>
<p>Milvusは、エンベッディングの統合を効率化する機能により、ベクターの保存と検索にとどまりません：</p>
<ul>
<li><p><strong>効率的なベクトル管理</strong>：Milvusは、膨大なベクターコレクションのために構築された高性能データベースとして、信頼性の高いストレージ、柔軟なインデックスオプション（HNSW、IVF、RaBitQ、DiskANNなど）、高速で正確な検索機能を提供します。</p></li>
<li><p><strong>プロバイダ切り替えの合理化</strong>: Milvusは、<code translate="no">TextEmbedding</code> 関数インターフェースを提供しており、複雑なSDKの統合なしに、APIキーで関数を設定し、プロバイダやモデルを即座に切り替え、実際のパフォーマンスを測定することができます。</p></li>
<li><p><strong>エンドツーエンドのデータパイプライン</strong>：<code translate="no">insert()</code> Milvusは1回の操作で自動的にベクトルを埋め込み、保存します。これにより、データパイプラインのコードを劇的に簡素化します。</p></li>
<li><p><strong>1回の呼び出しでテキストから結果へ</strong>：テキストクエリで<code translate="no">search()</code> を呼び出すと、Milvus は埋め込み、検索、結果の返送をすべて 1 回の API 呼び出しで処理します。</p></li>
<li><p><strong>プロバイダに依存しない統合</strong>：Milvusはプロバイダの実装の詳細を抽象化します。ファンクションとAPIキーを一度設定するだけで準備は完了です。</p></li>
<li><p><strong>オープンソースエコシステムとの互換性</strong>：Milvusは、組み込みの<code translate="no">TextEmbedding</code> 関数、ローカル推論、またはその他の方法を使用して埋め込みデータを生成する場合でも、統一されたストレージと検索機能を提供します。</p></li>
</ul>
<p>これにより、Milvusがベクトル生成を内部で処理することで、合理化された "Data-In, Insight-Out "を実現し、アプリケーションコードをより分かりやすく、保守しやすくします。</p>
<h2 id="Conclusion-The-Performance-Truth-Your-RAG-System-Needs" class="common-anchor-header">結論RAGシステムに必要なパフォーマンスの真実<button data-href="#Conclusion-The-Performance-Truth-Your-RAG-System-Needs" class="anchor-icon" translate="no">
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
    </button></h2><p>RAG パフォーマンスのサイレントキラーは、ほとんどの開発者が見ているところではありません。チームがプロンプトエンジニアリングとLLM最適化にリソースを注ぐ一方で、APIレイテンシを埋め込むことは、予想よりも100倍も悪い遅延でユーザーエクスペリエンスを静かに妨害します。我々の包括的なベンチマークは、厳しい現実を露呈している：人気があるからといってパフォーマンスが高いわけではなく、多くの場合アルゴリズムの選択よりも地理的な問題の方が重要であり、ローカル推論が高価なクラウドAPIに勝ることもある。</p>
<p>これらの発見は、RAG最適化における重要な盲点を浮き彫りにしている。リージョンをまたぐレイテンシ・ペナルティ、予想外のプロバイダ・パフォーマンス・ランキング、そしてローカル推論の驚くべき競争力は、エッジケースではなく、実際のアプリケーションに影響を与えるプロダクションの現実なのだ。エンベッディング API のパフォーマンスを理解し測定することは、応答性の高いユーザー体験を提供するために不可欠です。</p>
<p>エンベッディング・プロバイダの選択は、RAG パフォーマンス・パズルの重要なピースのひとつです。実際のデプロイメント環境でテストし、地理的に適切なプロバイダーを選択し、ローカル推論のような代替案を検討することで、ユーザー対応の遅延の主な原因を排除し、真に応答性の高いAIアプリケーションを構築することができます。</p>
