---
id: >-
  minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md
title: MilvusのMinHash LSH：LLMトレーニングデータの重複を防ぐ秘密兵器
author: 'Li Liu, Yaya Cheng'
date: 2025-05-16T00:00:00.000Z
desc: >-
  Milvus 2.6のMinHash
  LSHは、膨大なLLMトレーニングデータセットの重複排除のための効率的なソリューションを提供し、従来の方法と比較して2倍の処理速度と3-5倍のコスト削減を実現します。
cover: assets.zilliz.com/Chat_GPT_Image_May_16_2025_09_46_39_PM_1f3290ce5e.png
tag: Engineering
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'MinHash LSH, Locality Sensitive Hashing, Milvus, LLM training data'
meta_title: >
  MinHash LSH in Milvus: The Secret Weapon for Fighting Duplicates in LLM
  Training Data
origin: >-
  https://milvus.io/blog/minhash-lsh-in-milvus-the-secret-weapon-for-fighting-duplicates-in-llm-training-data.md
---
<p>大規模言語モデル（LLM）は、コードを書き、コンテンツを作成し、複雑な問題を解決する能力によって、AIの状況を一変させた。しかし、これらの強力なモデルの学習には、膨大な量の高品質データが必要です。</p>
<p>課題は、生のトレーニング・データにはしばしば大きな冗長性が含まれることだ。それは、他の重要なトピックを飛ばして同じレッスンを何度も繰り返して子供に教えるようなものだ。ある大手AI企業がまさにこの問題を抱え、私たちに相談してきました。彼らは野心的な新しい言語モデルを構築していましたが、何百億ものドキュメントの重複排除に苦労していました。従来のマッチング手法ではこのボリュームに対応できず、専用の重複排除ツールには膨大な計算リソースが必要で、経済的に成り立たなかった。</p>
<p>この問題を解決するために、我々のソリューションはMinHash LSH (Locality Sensitive Hashing)インデックス作成であり、Milvus 2.6で利用可能になる。この記事では、MinHash LSHがLLMトレーニングのデータ重複排除問題をどのように効率的に解決するのかを探る。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Chat_GPT_Image_May_16_2025_09_46_39_PM_1f3290ce5e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Data-Deduplication-Why-It-Matters-for-LLM-Training" class="common-anchor-header">データ重複排除：LLMトレーニングに重要な理由<button data-href="#Data-Deduplication-Why-It-Matters-for-LLM-Training" class="anchor-icon" translate="no">
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
    </button></h2><p>強力なLLMをトレーニングするためには、高品質で多様なデータが不可欠である。トレーニングデータに重複コンテンツがあると、いくつかの重大な問題が発生する：</p>
<ul>
<li><p><strong>リソースの無駄：</strong>冗長なデータはトレーニング時間、コスト、エネルギー消費を増加させます。</p></li>
<li><p><strong>パフォーマンスの低下：</strong>モデルは繰り返されるコンテンツに過剰に適合する可能性があり、新しい情報への汎化能力が制限される。</p></li>
<li><p><strong>暗記効果：</strong>重複したコンテンツは、モデルが特定のテキストを記憶し、そのまま再現する可能性を高めます。また、プライバシーの漏洩や著作権の問題につながる可能性もある。</p></li>
<li><p><strong>誤解を招く評価：</strong>トレーニング・セットとテスト・セットで重複があると、パフォーマンス測定基準が誤って高くなる可能性があります。</p></li>
</ul>
<p>重複の発見と削除には、主に3つのアプローチがあります：</p>
<ul>
<li><p><strong>完全マッチング：</strong>ハッシュ化によって同一の重複を特定する。</p></li>
<li><p><strong>近似マッチング：</strong>MinHash LSHやJaccard類似度などのアルゴリズムを使用して、重複に近いものを見つけます。</p></li>
<li><p><strong>意味的マッチング：</strong>ベクトル埋め込みを使用して、類似した意味を持つコンテンツを識別します。</p></li>
</ul>
<p>事前学習コーパスがテラバイトからペタバイトに達すると、ペアワイズ比較のような従来の厳密なマッチング手法は計算不可能になる。セマンティック重複排除では、埋め込みモデルを使ってベクトルを生成するため、多大なオーバーヘッドが発生する。<strong>MinHash LSH の</strong>ような、よりスマートな近似手法が必要で<strong>ある。これは、</strong>大規模な重複排除を実用的なものにするために、コストを管理しつつ、再現率と精度のバランスを<strong>とるものである</strong>。</p>
<h2 id="MinHash-LSH-Efficiently-Detecting-Near-Duplicates-in-Massive-Datasets" class="common-anchor-header">MinHash LSH：大規模データセット内の重複に近いデータを効率的に検出<button data-href="#MinHash-LSH-Efficiently-Detecting-Near-Duplicates-in-Massive-Datasets" class="anchor-icon" translate="no">
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
    </button></h2><p>膨大なトレーニングデータから重複に近いものを見つけるには、効率的で正確な近似マッチングアルゴリズムが必要です。MinHash LSH (Locality Sensitive Hashing)は、この目的に最適なツールです。この一見複雑な用語をステップごとに分解してみよう。</p>
<h3 id="Step-1-Representing-Documents-with-MinHash" class="common-anchor-header">ステップ1：MinHashによるドキュメントの表現</h3><p>まず、文書の類似性を測定する方法が必要だ。標準的な手法では、Jaccard 類似度を用いる：</p>
<p><span class="katex-display"><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML" display="block"><semantics><mrow><mi>J</mi><mo stretchy="false">(</mo><mi>A</mi><mo separator="true">,</mo><mi>B</mi><mo stretchy="false">)</mo><mfrac><mrow><mi mathvariant="normal">=∣A∩B∣A∪B∣J</mi></mrow></mfrac></mrow><annotation encoding="application/x-tex">(A,B)= \frac{|Acap B|}{|A \cup B|}</annotation></semantics></math></span></span></span><span class="strut" style="height:1em;vertical-align:-0.25em;"></span><span class="katex-display"><span class="katex">J<span class="katex-html" aria-hidden="true"><span class="base"><span class="mopen">(</span><span class="mord mathnormal">A</span><span class="mpunct">,</span><span class="mspace" style="margin-right:0.1667em;"></span></span></span>B<span class="katex-html" aria-hidden="true"><span class="base"><span class="mclose">)</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span>=</span></span><span class="mspace" style="margin-right:0.2778em;"></span><span class="katex-display"><span class="katex"></span></span><span class="strut" style="height:2.363em;vertical-align:-0.936em;"></span> <span class="katex-display"><span class="katex"></span></span><span class="mopen nulldelimiter"></span> <span class="katex-display"><span class="katex"></span></span><span class="pstrut" style="height:3em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-2.314em;"><span class="mord"><span class="mord mathnormal">∣A</span></span></span></span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-2.314em;"><span class="mord"><span class="mbin">∪</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord">B∣</span></span></span></span></span></span></span></span></span></span></span></span><span style="top:-3.23em;"><span class="pstrut" style="height:3em;"></span><span class="frac-line" style="border-bottom-width:0.04em;"></span></span><span class="katex-display"><span class="katex"></span></span><span class="pstrut" style="height:3em;"></span> <span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-3.677em;"><span class="mord"><span class="mord mathnormal">∣A</span></span></span></span></span></span></span></span></span></span></span></span><span class="mspace" style="margin-right:0.2222em;"></span><span class="katex-display"><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mfrac"><span class="vlist-t vlist-t2"><span class="vlist-r"><span class="vlist" style="height:1.427em;"><span style="top:-3.677em;"><span class="mord"><span class="mord mathnormal" style="margin-right:0.05017em;">∩</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mord mathnormal" style="margin-right:0.05017em;"></span></span></span></span><span class="vlist-s">B∣</span></span></span></span></span></span></span>∣ ∣B</span></span><span class="vlist-r"><span class="vlist" style="height:0.936em;"><span></span></span></span><span class="mclose nulldelimiter"></span></p>
<p>この式は、文書 A と文書 B の重複度、具体的には固有要素総数に対す る共有要素の比率を測定している。値が高いほど、文書が類似していることを意味する。</p>
<p>しかし、何十億もの文書ペアに対してこれを直接計算するのはリソースを大量に消費し、何年もかかる。MinHashはコンパクトな「フィンガープリント」（署名）を作成し、類似性の関係を保持しながら、比較をはるかに高速化します。</p>
<ol>
<li><strong>シングリング：</strong>各文書を重複する単語または文字のシーケンス（k-シングル）に分割する。例えば、"I love vector search "という文章をk=3（単語別）にすると、次のようになる：{"ベクトル大好き", "ベクトル検索大好き"}。</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/shingling_858ad58efa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<ol start="2">
<li><strong>MinHashing:</strong>複数のハッシュ関数をシングルの各セットに適用し、各関数からの最小ハッシュ値を記録する。この結果、各文書の署名ベクトルが得られる。</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/minhash_041003210a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>類似度を計算する際、2つの文書のMinHash署名の同じ位置にハッシュ値が揃う確率（これはこれらの署名のJaccard距離に相当する）は、元の帯状疱疹セットのJaccard類似度の近似値を提供する。このため、大きな原文を直接比較する必要なく、コンパクトな MinHash署名を分析することで、文書の類似性を効果的に推定することができる。</p>
<p>MinHashの原理は、最小のハッシュ値を持つ単語を使って文書全体を表現し、追加のハッシュ関数を組み込むことで精度を高めるというものである。小さな単語の変更は、一般的に最小のハッシュ値に影響を与えないため、見過ごされる可能性が高いが、より大きな変更はハッシュ値を変更する傾向があり、より簡単に検出される。この方法は、さまざまな単語にわたるハッシュ値の最小プールと見なすことができる。MinHashに加えて、SimHashのような代替手法も文書署名の生成に利用できるが、ここではそれについては説明しない。</p>
<h3 id="Step-2-Identifying-Similar-Documents-via-LSH" class="common-anchor-header">ステップ2：LSHによる類似文書の特定</h3><p>コンパクトなMinHash署名であっても、数百万、数十億の文書間ですべてのペアを比較するのは計算コストがかかる。そこで、<strong>Locality Sensitive Hashing（LSH）が</strong>登場する。</p>
<p>LSHの重要なアイデアは、<strong>意図的に衝突を引き起こす</strong>ハッシュ関数を使用することです<strong>。つまり、類似の</strong>アイテムは同じバケツにハッシュされる可能性が高くなり、非類似のアイテムはハッシュされません。これは、衝突を避けることを目的とする従来のハッシュとは正反対である。</p>
<p>MinHashでは、一般的なLSH戦略は<strong>バンディング技術</strong>である：</p>
<ol>
<li><p><strong>バンディング</strong>：バンディング：各MinHash署名（長さ<em>Nの</em>ベクトル）を、<em>r</em>行<em>（N = b × r</em>）を持つ<em>b個の</em>バンドに分割する。</p></li>
<li><p><strong>バンドをハッシュする：</strong>各バンド（<em>r個の</em>値のサブベクトル）を、標準的なハッシュ関数を使用してバケットにハッ シュする。</p></li>
<li><p><strong>候補ペア：</strong>2つの文書が<strong>いずれかの</strong>バンドでバケットを共有している場合、それらはマッチの可能性があるものとしてフラグが立てられる。</p></li>
</ol>
<p>バンドの数(b)とバンドごとの行数®を調整することで、想起、精度、検索効率のトレードオフを制御することができる。</p>
<p>重要な考え方は、類似性の高いドキュメントは、MinHash署名に多くの一致するハッシュ値を持つということです。これらの署名がバンドに分割される場合、すべての一致する値を持つバンドが1 つでもあれば、2つのドキュメントを同じバケツに入れるのに十分です。文書が類似していればいるほど、少なくとも1つのバンドでこの現象が起こる確率が高くなり、LSHはすべての署名を網羅的に比較することなく、候補となるペアを効率的に浮かび上がらせることができる。</p>
<p>つまり、<strong>MinHash + LSHは</strong>スケーラブルな近似重複排除を可能にする：MinHashはドキュメントをコンパクトな署名に圧縮し、LSHはマッチしそうなものをグループ化することで検索空間を効率的に狭める。これは、群衆の中から双子を見つけるようなものだ。まず、全員の特徴を素早くスナップショットし（MinHash）、似ているものをグループ化し（LSH）、次に小さなグループから実際の重複を精査する。</p>
<h2 id="Integrating-MinHash-LSH-in-Milvus-26" class="common-anchor-header">Milvus 2.6でのMinHash LSHの統合<button data-href="#Integrating-MinHash-LSH-in-Milvus-26" class="anchor-icon" translate="no">
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
    </button></h2><p>MinHash LSHをMilvus 2.6に統合したのは、実際のニーズによるものである。前述したように、LLMのリーディングカンパニーであるMilvusのユーザーから、LLMのプリトレーニングのために大量のテキストデータを効率的に重複排除するという課題が持ち込まれました。</p>
<p>従来の重複排除パイプラインは通常、ストレージや検索システムから切り離された外部ツールに依存しており、コンポーネント間でコストのかかるデータ転送が必要であった。このような断片的なワークフローは、運用上のオーバーヘッドを増大させ、分散コンピューティングリソースのフル活用を妨げる。</p>
<p>Milvusが高スループットのベクターデータを扱うことに長けていることを認識し、自然なアイデアが浮かびました：<strong><em>MilvusにMinHash LSHをネイティブに組み込み、近似重複排除をファーストクラスのデータベース機能にしたらどうだろうか？</em></strong></p>
<p>このアプローチにより、Milvus内で重複排除からセマンティック検索までの完全なワークフローを実現し、Milvusのスケーラビリティと統一APIを活用しながらMLOpsを簡素化することができる。私たちはパートナーとともに、MinHash LSHをMilvusのクラウドネイティブアーキテクチャに最適化し、大規模重複排除のための高速でスケーラブルなソリューションを実現しました。</p>
<h3 id="Core-capabilities-in-Milvus-26-include" class="common-anchor-header">Milvus 2.6のコア機能は以下の通りです：</h3><ul>
<li><p><strong>ネイティブMinHash LSHインデキシング：</strong>LSHの標準的なバンディング技術を実装し、リコールを向上させるためにオプションでJaccard再順位をサポート。様々なワークロードに柔軟に対応できるよう、インメモリとmmapベースの両方の実装を提供します。</p></li>
<li><p><strong>シームレスなAPI統合：</strong>ユーザーは、Milvusの標準SDKと宣言型APIを使用して、MinHashベクトルフィールドの定義、<code translate="no">MINHASH_LSH</code> インデックスの構築、署名データの挿入、近似類似検索の実行が可能です。</p></li>
<li><p><strong>分散性と拡張性：</strong>Milvusのクラウドネイティブアーキテクチャ上に構築されたこの機能は、大規模なデータセットや高スループット処理のための水平スケーリングをサポートしています。</p></li>
</ul>
<p>この統合は素晴らしい結果をもたらした。フルマネージドMilvus（Zilliz Cloud）上でMinHash LSHを実行することで、このユーザーは<strong>100億のドキュメントを</strong>効率的に重複排除することができました。以前のMapReduceベースのアプローチと比較すると、Milvusの最適化されたインデックス作成とクエリ実行により、新しいソリューションは<strong>処理速度を2倍以上に向上さ</strong>せ、<strong>3～5倍のコスト削減を</strong>達成した。</p>
<h2 id="Hands-On-Deduplicating-LLM-Datasets-Using-Milvus" class="common-anchor-header">ハンズオン：Milvusを使ったLLMデータセットの重複排除<button data-href="#Hands-On-Deduplicating-LLM-Datasets-Using-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6のMinHash LSHを使用して、スケールで近似的な重複排除を実行してみましょう。</p>
<h3 id="Prerequisite-Generating-MinHash-Signatures" class="common-anchor-header">前提条件MinHashシグネチャの生成</h3><p>Milvusは、<strong>事前に生成された</strong>MinHash署名のインデックス作成と検索を行います。Pythonの<code translate="no">datasketch</code> 、またはカスタム実装のようなツールを使用して、前処理中にこれらを生成する必要があります。一般的な手順は以下のとおりです：</p>
<ol>
<li><p>生文書の読み取り</p></li>
<li><p>各文書をシングル化（トークン化またはチャンク化）する。</p></li>
<li><p>複数のハッシュ関数を適用して、MinHash署名（例えば、サイズ128のuint64配列）を生成する。</p></li>
</ol>
<pre><code translate="no"><span class="hljs-keyword">from</span> datasketch <span class="hljs-keyword">import</span> MinHash

text = <span class="hljs-string">&quot;example text for minhash signature&quot;</span>
tokens = text.lower().split()  <span class="hljs-comment"># Step 1 &amp; 2: preprocess + tokenize/shingle</span>
mh = MinHash(num_perm=<span class="hljs-number">128</span>)     <span class="hljs-comment"># Step 3: initialize MinHash</span>
<span class="hljs-keyword">for</span> token <span class="hljs-keyword">in</span> tokens:
    mh.update(token.encode(<span class="hljs-string">&#x27;utf-8&#x27;</span>))  <span class="hljs-comment"># Add shingles to MinHash</span>
signature = mh.hashvalues  <span class="hljs-comment"># This is your MinHash signature (128-dimensional)</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-1-Create-a-Schema-in-Milvus" class="common-anchor-header">ステップ1: Milvusでスキーマを作成する。</h3><p>MinHash署名とそれに対応する文書IDを格納するMilvusコレクションを作成する必要があります。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> DataType
MILVUS_URI = <span class="hljs-string">&quot;localhost:19530&quot;</span>
COLLECTION_NAME = <span class="hljs-string">&quot;llm_data_dedup_minhash&quot;</span>
MINHASH_DIM = <span class="hljs-number">128</span>
MINHASH_BIT_WIDTH = <span class="hljs-number">64</span> <span class="hljs-comment"># Assuming 64-bit hash values</span>

<span class="hljs-comment"># Load data from NPY file</span>
base = np.load(<span class="hljs-string">&#x27;minhash_vectors.npy&#x27;</span>)
ids = [<span class="hljs-built_in">str</span>(i) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(base.shape[<span class="hljs-number">0</span>])]  <span class="hljs-comment"># Generate string IDs</span>

client = MilvusClient(uri=MILVUS_URI)
<span class="hljs-comment"># Check and drop existing collection if needed</span>
<span class="hljs-keyword">if</span> collection_name <span class="hljs-keyword">in</span> client.list_collections():
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Collection <span class="hljs-subst">{collection_name}</span> exists, dropping it...&quot;</span>)
    client.drop_collection(collection_name)
<span class="hljs-comment"># Create collection schema</span>
schema = MilvusClient.create_schema(
    auto_id=<span class="hljs-literal">False</span>,
    enable_dynamic_field=<span class="hljs-literal">False</span>,
)

schema.add_field(field_name=<span class="hljs-string">&quot;input_id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;minhash&quot;</span>, datatype=DataType.BINARY_VECTOR, dim=MINHASH_DIM * MINHASH_BIT_WIDTH)
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">200</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Create-the-MINHASHLSH-Index-and-Collection" class="common-anchor-header"><strong>ステップ2：MINHASH_LSHインデックスとコレクションの作成</strong></h3><p>これが核となるステップである。メトリックタイプとしてJACCARDを指定し、LSH関連のパラメータを設定する必要がある。</p>
<pre><code translate="no">INDEX_FIELD_NAME = <span class="hljs-string">&quot;minhash_signature&quot;</span>
<span class="hljs-comment"># Metric type, should be JACCARD for MinHash LSH</span>
METRIC_TYPE = <span class="hljs-string">&quot;MHJACCARD&quot;</span>
INDEX_TYPE = <span class="hljs-string">&quot;MINHASH_LSH&quot;</span>
MINHASH_DIM = <span class="hljs-number">128</span>
MINHASH_BIT_WIDTH = <span class="hljs-number">64</span> <span class="hljs-comment"># Assuming 64-bit hash values</span>

index_params = MilvusClient.prepare_index_params()

index_params.add_index(
    field_name=INDEX_FIELD_NAME,
    index_type=INDEX_TYPE,
    metric_type=METRIC_TYPE,
    params={
        <span class="hljs-comment"># LSH-specific parameters might be configured here, e.g.:</span>
        <span class="hljs-comment"># &quot;band&quot;: 32, # Hypothetical parameter: number of bands</span>
        <span class="hljs-comment"># &quot;element_bit_width&quot;: 64 # Bit width of minhash values</span>
    }
)
<span class="hljs-comment"># Create collection</span>
client.create_collection(
    collection_name=collection_name,
    schema=schema,
    index_params=index_params
)
<button class="copy-code-btn"></button></code></pre>
<p>パラメータのチューニングに関する注意事項：MinHash LSHの有効性は、パラメータの選択に大きく依存します。例えば、MinHash署名生成時に使用されるハッシュ関数の数（つまり、<code translate="no">MINHASH_DIM</code> ）は、署名の精度とサイズに影響します。LSHフェーズでは、バンドの数（<code translate="no">num_bands</code> ）とバンドごとの行数によって、類似性閾値の感度範囲と、再現率と精度のバランスが決定される。ユーザはデータセットの特性や重複排除の要件に基づき、実験と微調整を行う必要がある。これはしばしば反復プロセスである。</p>
<h3 id="Step-3-Insert-MinHash-Signatures" class="common-anchor-header"><strong>ステップ3：MinHashシグネチャの挿入</strong></h3><p>ドキュメントのバッチと、それに対応するMinHash署名があるとする。</p>
<pre><code translate="no"><span class="hljs-comment"># Insert data in batches</span>
batch_size = <span class="hljs-number">2000</span>
total_records = base.shape[<span class="hljs-number">0</span>]
num_batches = (total_records + batch_size - <span class="hljs-number">1</span>) // batch_size

<span class="hljs-keyword">for</span> batch_idx <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(num_batches):
    start = batch_idx * batch_size
    end = <span class="hljs-built_in">min</span>((batch_idx + <span class="hljs-number">1</span>) * batch_size, total_records)
    
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserting batch <span class="hljs-subst">{batch_idx + <span class="hljs-number">1</span>}</span>/<span class="hljs-subst">{num_batches}</span> (records <span class="hljs-subst">{start}</span>-<span class="hljs-subst">{end}</span>)&quot;</span>)
    
    <span class="hljs-comment"># Prepare batch data</span>
    batch_data = [{
        <span class="hljs-string">&quot;input_id&quot;</span>: i,
        <span class="hljs-string">&quot;minhash&quot;</span>: base[i].tobytes(),
        <span class="hljs-string">&quot;id&quot;</span>: ids[i]
    } <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(start, end)]
    
    <span class="hljs-comment"># Insert batch</span>
    client.insert(collection_name, batch_data)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Data insertion complete&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Search-for-Near-Duplicates" class="common-anchor-header">ステップ5：重複に近い文書の検索</h3><p>ドキュメントのMinHash署名を使用して、コレクション内の類似ドキュメントを検索します。</p>
<pre><code translate="no"><span class="hljs-comment"># Perform search</span>
search_vectors = [vec.tobytes() <span class="hljs-keyword">for</span> vec <span class="hljs-keyword">in</span> base[:<span class="hljs-number">10</span>]]
results = client.search(
    collection_name, 
    data=search_vectors, 
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: METRIC_TYPE, <span class="hljs-string">&quot;params&quot;</span>: search_params_lsh},
    limit=<span class="hljs-number">1</span>, 
    output_fields=[<span class="hljs-string">&quot;id&quot;</span>])

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;\nSearch results:&quot;</span>)
<span class="hljs-keyword">for</span> i, result <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(results):
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Query <span class="hljs-subst">{i}</span>:&quot;</span>)
    <span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> result:
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  - ID: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;entity&#x27;</span>][<span class="hljs-string">&#x27;id&#x27;</span>]}</span>, Distance: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]}</span>&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Post-Processing-and-Clustering" class="common-anchor-header">ステップ6：後処理とクラスタリング</h3><p>返された結果は、<strong>重複排除候補</strong>です。完全な重複排除グループを形成するには、候補ペアに<strong>Union-Findの</strong>ようなクラスタリング技術を適用します。得られた各グループは重複の集合を表し、代表的な文書を1つ残し、残りをアーカイブまたは削除する。</p>
<h2 id="Conclusion" class="common-anchor-header"><strong>結論</strong><button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.6のMinHash LSHは、AIデータ処理における飛躍的な進歩である。LLMデータ重複排除のソリューションとして始まったMinHash LSHは、今やウェブコンテンツのクリーンアップ、カタログ管理、剽窃検出など、より広範なユースケースへの扉を開いている。</p>
<p>同様のユースケースをお持ちの方は、Milvus Discordでオフィスアワー・ミーティングにお申し込みください。</p>
