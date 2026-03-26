---
id: choose-embedding-model-rag-2026.md
title: 2026年のRAGに最適なエンベデッドモデルの選び方：ベンチマークされた10モデル
author: Cheney Zhang
date: 2026-3-26
cover: assets.zilliz.com/embedding_model_cover_ab72ccd651.jpg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, Gemini Embedding 2, Embedding Model, RAG'
meta_keywords: >-
  best embedding model for RAG, embedding model comparison, multimodal embedding
  benchmark, MRL dimension compression, Gemini Embedding 2
meta_title: |
  Best Embedding Model for RAG 2026: 10 Models Compared
desc: >-
  クロスモーダル、クロスリンガル、ロングドキュメント、次元圧縮のタスクについて、10種類の埋め込みモデルをベンチマークしました。あなたのRAGパイプラインにどれが合うか試してみてください。
origin: 'https://milvus.io/blog/choose-embedding-model-rag-2026.md'
---
<p><strong>TL;DR:</strong>我々は、公開されているベンチマークが見逃している4つの本番シナリオ（クロスモーダル検索、クロスリンガル検索、キー情報検索、次元圧縮）において、10種類の<a href="https://zilliz.com/ai-models">埋め込みモデルを</a>テストした。単一のモデルがすべてを制することはない。Gemini Embedding 2が最高のオールラウンダーである。オープンソースのQwen3-VL-2Bは、クロスモーダルなタスクにおいてクローズドソースのAPIに勝る。ストレージを節約するために次元を圧縮する必要がある場合は、Voyage Multimodal 3.5かJina Embeddings v4を使う。</p>
<h2 id="Why-MTEB-Isnt-Enough-for-Choosing-an-Embedding-Model" class="common-anchor-header">エンベッディング・モデルの選択にMTEBだけでは不十分な理由<button data-href="#Why-MTEB-Isnt-Enough-for-Choosing-an-Embedding-Model" class="anchor-icon" translate="no">
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
    </button></h2><p>ほとんどの<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>プロトタイプは、OpenAIのtext-embedding-3-smallから始まります。これは安価で統合しやすく、英語のテキスト検索には十分機能する。しかし、本番のRAGはすぐにそれを使い果たしてしまう。あなたのパイプラインは、画像、PDF、多言語ドキュメントをピックアップし、テキストのみの<a href="https://zilliz.com/ai-models">埋め込みモデルで</a>十分でなくなります。</p>
<p><a href="https://huggingface.co/spaces/mteb/leaderboard">MTEBのリーダーボードは</a>、より良い選択肢があることを教えてくれます。問題は？MTEBは単一言語のテキスト検索しかテストしていません。クロスモーダル検索（画像コレクションに対するテキストクエリ）、クロスリンガル検索（中国語のクエリが英語のドキュメントを見つける）、ロングドキュメントの精度、<a href="https://zilliz.com/learn/what-is-a-vector-database">ベクターデータベースの</a>ストレージを節約するために<a href="https://zilliz.com/glossary/dimension">エンベッディングの次元を</a>切り捨てたときにどれだけの品質を失うか、などはカバーしていません。</p>
<p>では、どの埋め込みモデルを使うべきなのでしょうか？それは、データの種類、言語、ドキュメントの長さ、そして次元圧縮が必要かどうかによります。私たちは、<strong>CCKMと</strong>呼ばれるベンチマークを作成し、2025年から2026年の間にリリースされた10のモデルを、まさにこれらの次元にわたってテストしました。</p>
<h2 id="What-Is-the-CCKM-Benchmark" class="common-anchor-header">CCKMベンチマークとは？<button data-href="#What-Is-the-CCKM-Benchmark" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>CCKM（Cross-modal</strong>, Cross-lingual, Key information, MRL）は、標準的なベンチマークが見逃している4つの機能をテストします：</p>
<table>
<thead>
<tr><th>次元</th><th>テスト内容</th><th>なぜ重要か</th></tr>
</thead>
<tbody>
<tr><td><strong>クロスモーダル検索</strong></td><td>ほぼ同じ注意散漫が存在する場合に、テキストの説明を正しい画像に一致させる</td><td><a href="https://zilliz.com/learn/multimodal-rag">マルチモーダルRAG</a>パイプラインは、同じベクトル空間にテキストと画像を埋め込む必要がある</td></tr>
<tr><td><strong>クロスリンガル検索</strong></td><td>中国語のクエリから正しい英語の文書を検索する。</td><td>生産知識ベースは多言語であることが多い</td></tr>
<tr><td><strong>キー情報検索</strong></td><td>4K-32K文字の文書に埋もれている特定の事実を見つける（針小棒大）</td><td>RAGシステムは契約書や研究論文のような長い文書を処理することが多い</td></tr>
<tr><td><strong>MRL次元圧縮</strong></td><td>エンベッディングを256次元に切り詰めたとき、モデルがどの程度品質を失うかを測定</td><td>次元数が少ない＝ベクトル・データベースのストレージ・コストが低い。</td></tr>
</tbody>
</table>
<p>MTEBはこれらのいずれもカバーしない。MMEBはマルチモーダルを追加するが、ハードネガをスキップするため、微妙な区別を扱えることを証明することなく、モデルは高得点を獲得する。CCKMは、これらのモデルの欠点をカバーするように設計されている。</p>
<h2 id="Which-Embedding-Models-Did-We-Test-Gemini-Embedding-2-Jina-Embeddings-v4-and-More" class="common-anchor-header">どの埋め込みモデルをテストしたか？Gemini Embedding 2、Jina Embeddings v4、その他<button data-href="#Which-Embedding-Models-Did-We-Test-Gemini-Embedding-2-Jina-Embeddings-v4-and-More" class="anchor-icon" translate="no">
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
    </button></h2><p>我々は、APIサービスとオープンソースのオプションの両方をカバーする10個のモデルと、2021年のベースラインとしてCLIP ViT-L-14をテストした。</p>
<table>
<thead>
<tr><th>モデル</th><th>ソース</th><th>パラメータ</th><th>寸法</th><th>モダリティ</th><th>主要特性</th></tr>
</thead>
<tbody>
<tr><td>ジェミニ エンベディング 2</td><td>グーグル</td><td>非公開</td><td>3072</td><td>テキスト/画像/動画/音声/PDF</td><td>オールモダリティ、最も広いカバレッジ</td></tr>
<tr><td>ジーナ・エンベッディングv4</td><td>ジーナAI</td><td>3.8B</td><td>2048</td><td>テキスト/画像/PDF</td><td>MRL + LoRAアダプタ</td></tr>
<tr><td>Voyage マルチモーダル 3.5</td><td>Voyage AI (MongoDB)</td><td>非公開</td><td>1024</td><td>テキスト/画像/動画</td><td>タスク間のバランス</td></tr>
<tr><td>Qwen3-VL-Embedding-2B</td><td>アリババQwen</td><td>2B</td><td>2048</td><td>テキスト/画像/動画</td><td>オープンソース、軽量マルチモーダル</td></tr>
<tr><td>Jina CLIP v2</td><td>ジーナAI</td><td>~1B</td><td>1024</td><td>テキスト/画像</td><td>近代化されたCLIPアーキテクチャ</td></tr>
<tr><td>コヒア・エンベッドv4</td><td>コヒーレ</td><td>非公開</td><td>固定</td><td>テキスト</td><td>エンタープライズ検索</td></tr>
<tr><td>OpenAIテキスト埋め込み-3-大</td><td>OpenAI</td><td>非公開</td><td>3072</td><td>テキスト</td><td>最も広く使われている</td></tr>
<tr><td><a href="https://zilliz.com/learn/bge-m3-and-splade-two-machine-learning-models-for-generating-sparse-embeddings">BGE-M3</a></td><td>BAAI</td><td>568M</td><td>1024</td><td>テキスト</td><td>オープンソース、100以上の言語</td></tr>
<tr><td>mxbai-embed-large</td><td>ミックスブレッドAI</td><td>335M</td><td>1024</td><td>テキスト</td><td>軽量、英語中心</td></tr>
<tr><td>ノミック埋め込みテキスト</td><td>ノミックAI</td><td>137M</td><td>768</td><td>テキスト</td><td>超軽量</td></tr>
<tr><td>クリップ ViT-L-14</td><td>OpenAI（2021年）</td><td>428M</td><td>768</td><td>テキスト/画像</td><td>ベースライン</td></tr>
</tbody>
</table>
<h2 id="Cross-Modal-Retrieval-Which-Models-Handle-Text-to-Image-Search" class="common-anchor-header">クロスモーダル検索：どのモデルがテキストから画像への検索を扱うか？<button data-href="#Cross-Modal-Retrieval-Which-Models-Handle-Text-to-Image-Search" class="anchor-icon" translate="no">
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
    </button></h2><p>RAGパイプラインがテキストと共に画像を扱う場合、埋め込みモデルは両方のモダリティを同じ<a href="https://zilliz.com/glossary/vector-embeddings">ベクトル</a>空間に配置する必要がある。電子商取引の画像検索、画像とテキストの混合知識ベース、またはテキストクエリが正しい画像を見つける必要があるシステムを考えてみましょう。</p>
<h3 id="Method" class="common-anchor-header">方法</h3><p>COCO val2017から200の画像とテキストのペアを取り出した。各画像について、GPT-4o-miniは詳細な説明を生成した。そして、1つの画像につき3つのハードネガ（1つか2つの詳細によって正しい説明文と異なる説明文）を作成した。このモデルは、200の画像と600のディストラクターの中から正しい一致を見つけなければならない。</p>
<p>データセットからの例：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_9_3965746e33.png" alt="Vintage brown leather suitcases with travel stickers including California and Cuba, placed on a metal luggage rack against a blue sky — used as a test image in the cross-modal retrieval benchmark" class="doc-image" id="vintage-brown-leather-suitcases-with-travel-stickers-including-california-and-cuba,-placed-on-a-metal-luggage-rack-against-a-blue-sky-—-used-as-a-test-image-in-the-cross-modal-retrieval-benchmark" />
   </span> <span class="img-wrapper"> <span>青空を背景に、金属製の荷物棚に置かれた、カリフォルニアやキューバなどの旅行ステッカーが貼られたビンテージの茶色い革製スーツケース - クロスモーダル検索ベンチマークのテスト画像として使用。</span> </span></p>
<blockquote>
<p><strong>正しい説明</strong>"この画像は、「カリフォルニア」、「キューバ」、「ニューヨーク」を含む様々な旅行ステッカーが貼られたビンテージの茶色の革製スーツケースが、晴れ渡った青空を背景に金属製の荷物棚に置かれている。"</p>
<p><strong>ハード・ネガティブ：</strong>同じ文章だが、"California "が "Florida "に、"blue sky "が "overcast sky "になっている。モデルはこれらを見分けるために、イメージの詳細を実際に理解しなければならない。</p>
</blockquote>
<p><strong>採点：</strong></p>
<ul>
<li>すべての画像とすべてのテキスト（200の正しい説明文＋600の難しい否定文）に対して<a href="https://zilliz.com/glossary/vector-embeddings">埋め込みを</a>生成する。</li>
<li><strong>テキスト対画像（t2i）：</strong>各説明文は200枚の画像を検索し、最も近い一致を探す。一番上の結果が正しければ1点。</li>
<li><strong>画像対テキスト(i2t)：</strong>各画像は、最も近い一致のためにすべての800テキストを検索します。一番上の結果が正しい説明文であり、ハードネガテ ィブでない場合のみ加点。</li>
<li><strong>最終スコア：</strong>hard_avg_R@1 = (t2i accuracy + i2t accuracy) / 2</li>
</ul>
<h3 id="Results" class="common-anchor-header">結果</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_1_6f1fddae56.png" alt="Horizontal bar chart showing Cross-Modal Retrieval Ranking: Qwen3-VL-2B leads at 0.945, followed by Gemini Embed 2 at 0.928, Voyage MM-3.5 at 0.900, Jina CLIP v2 at 0.873, and CLIP ViT-L-14 at 0.768" class="doc-image" id="horizontal-bar-chart-showing-cross-modal-retrieval-ranking:-qwen3-vl-2b-leads-at-0.945,-followed-by-gemini-embed-2-at-0.928,-voyage-mm-3.5-at-0.900,-jina-clip-v2-at-0.873,-and-clip-vit-l-14-at-0.768" />
   <span>クロスモーダル検索ランキングを示す横棒グラフ：Qwen3-VL-2Bが0.945でトップ、Gemini Embed 2が0.928、Voyage MM-3.5が0.900、Jina CLIP v2が0.873、CLIP ViT-L-14が0.768で続く。</span> </span></p>
<p>アリババのQwenチームによるオープンソースの2BパラメータモデルであるQwen3-VL-2Bが、クローズドソースのAPIを抑えて1位となった。</p>
<p><strong>モダリティ・ギャップが</strong>その差の大部分を説明している。埋め込みモデルはテキストと画像を同じベクトル空間にマッピングするが、実際には2つのモダリティは異なる領域に集まる傾向がある。モダリティギャップは、これら2つのクラスター間のL2距離を測定します。ギャップが小さい＝クロスモーダル検索が容易である。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_8_c5067a3434.png" alt="Visualization comparing large modality gap (0.73, text and image embedding clusters far apart) versus small modality gap (0.25, clusters overlapping) — smaller gap makes cross-modal matching easier" class="doc-image" id="visualization-comparing-large-modality-gap-(0.73,-text-and-image-embedding-clusters-far-apart)-versus-small-modality-gap-(0.25,-clusters-overlapping)-—-smaller-gap-makes-cross-modal-matching-easier" />
   </span> <span class="img-wrapper"> <span>大きなモダリティギャップ（0.73、テキストと画像の埋め込みクラスタが離れている）と小さなモダリティギャップ（0.25、クラスタが重なっている）を比較した視覚化 - ギャップが小さいほどクロスモーダルマッチングが容易になる。</span> </span></p>
<table>
<thead>
<tr><th>モデル</th><th>スコア (R@1)</th><th>モダリティギャップ</th><th>パラメータ</th></tr>
</thead>
<tbody>
<tr><td>Qwen3-VL-2B</td><td>0.945</td><td>0.25</td><td>2B（オープンソース）</td></tr>
<tr><td>Geminiエンベッディング2</td><td>0.928</td><td>0.73</td><td>不明（クローズド）</td></tr>
<tr><td>Voyage マルチモーダル 3.5</td><td>0.900</td><td>0.59</td><td>不明（クローズド）</td></tr>
<tr><td>ジーナCLIP v2</td><td>0.873</td><td>0.87</td><td>~1B</td></tr>
<tr><td>CLIP ViT-L-14</td><td>0.768</td><td>0.83</td><td>428M</td></tr>
</tbody>
</table>
<p>Qwenのモダリティギャップは0.25であり、Geminiの0.73のおよそ3分の1である。<a href="https://milvus.io/">Milvusの</a>ような<a href="https://zilliz.com/learn/what-is-a-vector-database">ベクトルデータベースにおいて</a>、モダリティギャップが小さいということは、テキストと画像の埋め込みを同じ<a href="https://milvus.io/docs/manage-collections.md">コレクションに</a>格納し、両方を直接<a href="https://milvus.io/docs/single-vector-search.md">検索</a>できることを意味する。ギャップが大きいと、クロスモーダル<a href="https://zilliz.com/glossary/similarity-search">類似検索の</a>信頼性が低くなり、それを補うために再順位付けのステップが必要になるかもしれません。</p>
<h2 id="Cross-Lingual-Retrieval-Which-Models-Align-Meaning-Across-Languages" class="common-anchor-header">クロスリンガル検索：言語間で意味を整合させるモデルは？<button data-href="#Cross-Lingual-Retrieval-Which-Models-Align-Meaning-Across-Languages" class="anchor-icon" translate="no">
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
    </button></h2><p>多言語の知識ベースは生産現場では一般的です。ユーザーは中国語で質問しますが、答えは英語のドキュメントにあります。埋め込みモデルは、1つの言語内だけでなく、言語間で意味を整合させる必要があります。</p>
<h3 id="Method" class="common-anchor-header">方法</h3><p>我々は、3つの難易度レベルにわたって、中国語と英語の166の並列文ペアを構築した：</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_6_75caab66a7.png" alt="Cross-lingual difficulty tiers: Easy tier maps literal translations like 我爱你 to I love you; Medium tier maps paraphrased sentences like 这道菜太咸了 to This dish is too salty with hard negatives; Hard tier maps Chinese idioms like 画蛇添足 to gilding the lily with semantically different hard negatives" class="doc-image" id="cross-lingual-difficulty-tiers:-easy-tier-maps-literal-translations-like-我爱你-to-i-love-you;-medium-tier-maps-paraphrased-sentences-like-这道菜太咸了-to-this-dish-is-too-salty-with-hard-negatives;-hard-tier-maps-chinese-idioms-like-画蛇添足-to-gilding-the-lily-with-semantically-different-hard-negatives" />
   <span>クロスリンガル難易度簡単な階層では「我爱你」のような直訳を、中程度の階層では「这道菜太咸了」のような言い換え文をハードネガティヴで、ハード階層では「画蛇添足」のような中国語の慣用句を意味的に異なるハードネガティヴでマッピングする。</span> </span></p>
<p>また、各言語には152個のハードネガティブディストラクターがある。</p>
<p><strong>スコアリング：</strong></p>
<ul>
<li>すべての中国語テキスト（正解166個＋妨害152個）とすべての英語テキスト（正解166個＋妨害152個）の埋め込みを生成する。</li>
<li><strong>中国語→英語：</strong>各中国語文は318個の英語文から正しい訳を探す。</li>
<li><strong>英語 → 中国語：</strong>逆も同じ。</li>
<li><strong>最終スコア：</strong>hard_avg_R@1 = (zh→en accuracy + en→zh accuracy) / 2</li>
</ul>
<h3 id="Results" class="common-anchor-header">結果</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_2_d1c3500423.png" alt="Horizontal bar chart showing Cross-Lingual Retrieval Ranking: Gemini Embed 2 leads at 0.997, followed by Qwen3-VL-2B at 0.988, Jina v4 at 0.985, Voyage MM-3.5 at 0.982, down to mxbai at 0.120" class="doc-image" id="horizontal-bar-chart-showing-cross-lingual-retrieval-ranking:-gemini-embed-2-leads-at-0.997,-followed-by-qwen3-vl-2b-at-0.988,-jina-v4-at-0.985,-voyage-mm-3.5-at-0.982,-down-to-mxbai-at-0.120" />
   <span>クロスリンガル検索ランキングを示す横棒グラフ：ジェミニ・エンベッド2が0.997でトップ、Qwen3-VL-2Bが0.988、Jina v4が0.985、Voyage MM-3.5が0.982、mxbaiが0.120で続く。</span> </span></p>
<p>Gemini Embedding 2のスコアは0.997で、テストしたモデルの中で最高だった。画蛇添足"→"gilding the lily "のようなペアは、パターンマッチングではなく、言語間の真の<a href="https://zilliz.com/glossary/semantic-search">意味</a>理解を必要とする。</p>
<table>
<thead>
<tr><th>モデル</th><th>スコア (R@1)</th><th>簡単</th><th>中</th><th>難しい（イディオム）</th></tr>
</thead>
<tbody>
<tr><td>ジェミニ埋め込み2</td><td>0.997</td><td>1.000</td><td>1.000</td><td>1.000</td></tr>
<tr><td>Qwen3-VL-2B</td><td>0.988</td><td>1.000</td><td>1.000</td><td>0.969</td></tr>
<tr><td>ジーナ エンベッディング v4</td><td>0.985</td><td>1.000</td><td>1.000</td><td>0.969</td></tr>
<tr><td>ボヤージュ・マルチモーダル 3.5</td><td>0.982</td><td>1.000</td><td>1.000</td><td>0.938</td></tr>
<tr><td>OpenAI 3ラージ</td><td>0.967</td><td>1.000</td><td>1.000</td><td>0.906</td></tr>
<tr><td>コヒーレエンベッドv4</td><td>0.955</td><td>1.000</td><td>0.980</td><td>0.875</td></tr>
<tr><td>BGE-M3 (568M)</td><td>0.940</td><td>1.000</td><td>0.960</td><td>0.844</td></tr>
<tr><td>ノミックエンベッドテキスト (137M)</td><td>0.154</td><td>0.300</td><td>0.120</td><td>0.031</td></tr>
<tr><td>mxbai-embed-large (335M)</td><td>0.120</td><td>0.220</td><td>0.080</td><td>0.031</td></tr>
</tbody>
</table>
<p>nomic-embed-textとmxbai-embed-largeは、どちらも英語に特化した軽量モデルですが、クロスリンガルタスクではほぼゼロスコアです。</p>
<h2 id="Key-Information-Retrieval-Can-Models-Find-a-Needle-in-a-32K-Token-Document" class="common-anchor-header">主要情報検索：モデルは32Kトークンの文書から針を見つけることができるか？<button data-href="#Key-Information-Retrieval-Can-Models-Find-a-Needle-in-a-32K-Token-Document" class="anchor-icon" translate="no">
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
    </button></h2><p>RAGシステムは、法的契約書、研究論文、<a href="https://zilliz.com/learn/introduction-to-unstructured-data">非構造化データを</a>含む内部報告書など、長文の文書を処理することが多い。問題は、埋め込みモデルが、周囲の何千文字ものテキストの中に埋もれている特定の事実を見つけることができるかどうかということである。</p>
<h3 id="Method" class="common-anchor-header">方法</h3><p>我々は、様々な長さ（4Kから32K文字）のウィキペディアの記事を干し草の山とし、1つの捏造された事実（針）を、開始、25％、50％、75％、終了という異なる位置に挿入した。モデルは、クエリー埋め込みに基づいて、どのバージョンの文書に針が含まれているかを決定しなければならない。</p>
<p><strong>例</strong></p>
<ul>
<li><strong>針：</strong>"メリディアン・コーポレーションは2025年第3四半期に8億4,730万ドルの四半期収益を報告した。"</li>
<li><strong>クエリー</strong>"メリディアン・コーポレーションの四半期収益は？"</li>
<li><strong>干し草の山：</strong>光合成に関する32,000文字のウィキペディアの記事で、針はその中のどこかに隠されている。</li>
</ul>
<p><strong>スコアリング</strong></p>
<ul>
<li>クエリ、針のある文書、針のない文書の埋め込みを生成する。</li>
<li>クエリが針を含む文書により類似している場合、ヒットとしてカウントする。</li>
<li>すべてのドキュメントの長さと針の位置の平均精度。</li>
<li><strong>最終的なメトリクス：</strong>overall_accuracyとdegradation_rate（最も短いドキュメントから最も長いドキュメントまで、どれだけ精度が落ちるのか）。</li>
</ul>
<h3 id="Results" class="common-anchor-header">結果</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_5_2bdc89516a.png" alt="Heatmap showing Needle-in-a-Haystack accuracy by document length: Gemini Embed 2 scores 1.000 across all lengths up to 32K; top 7 models score perfectly within their context windows; mxbai and nomic degrade sharply at 4K+" class="doc-image" id="heatmap-showing-needle-in-a-haystack-accuracy-by-document-length:-gemini-embed-2-scores-1.000-across-all-lengths-up-to-32k;-top-7-models-score-perfectly-within-their-context-windows;-mxbai-and-nomic-degrade-sharply-at-4k+" />
   <span>ドキュメントの長さごとのNeedle-in-a-Haystackの精度を示すヒートマップ：Gemini Embedding 2は、32Kまでのすべての長さで1.000のスコア。上位7つのモデルは、それぞれのコンテキストウィンドウ内で完璧なスコア。</span> </span></p>
<p>Gemini Embedding 2は、4K-32Kの全範囲でテストされた唯一のモデルであり、すべての長さで完璧なスコアを記録した。このテストでは、32Kに達するコンテキストウィンドウを持つモデルは他にない。</p>
<table>
<thead>
<tr><th>モデル</th><th>1K</th><th>4K</th><th>8K</th><th>16K</th><th>32K</th><th>全体</th><th>劣化</th></tr>
</thead>
<tbody>
<tr><td>ジェミニエンベディング2</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>1.000</td><td>0%</td></tr>
<tr><td>OpenAI 3ラージ</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>ジーナ エンベッディング v4</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>コヒーレ・エンベッドv4</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>Qwen3-VL-2B</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>ボヤージュ・マルチモーダル 3.5</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>ジーナCLIP v2</td><td>1.000</td><td>1.000</td><td>1.000</td><td>-</td><td>-</td><td>1.000</td><td>0%</td></tr>
<tr><td>BGE-M3 (568M)</td><td>1.000</td><td>1.000</td><td>0.920</td><td>-</td><td>-</td><td>0.973</td><td>8%</td></tr>
<tr><td>mxbai-embed-large (335M)</td><td>0.980</td><td>0.600</td><td>0.400</td><td>-</td><td>-</td><td>0.660</td><td>58%</td></tr>
<tr><td>ノミック埋め込みテキスト (137M)</td><td>1.000</td><td>0.460</td><td>0.440</td><td>-</td><td>-</td><td>0.633</td><td>56%</td></tr>
</tbody>
</table>
<p>"-"は、文書の長さがモデルのコンテキストウィンドウを超えることを意味する。</p>
<p>上位7つのモデルはコンテキストウィンドウ内で完璧なスコアを記録。BGE-M3は8Kでスリップし始める（0.920）。軽量モデル（mxbaiとnomic）はわずか4K文字（およそ1,000トークン）で0.4-0.6まで低下する。mxbaiの場合、この低下は512トークンのコンテキストウィンドウが文書の大部分を切り捨てていることを一部反映している。</p>
<h2 id="MRL-Dimension-Compression-How-Much-Quality-Do-You-Lose-at-256-Dimensions" class="common-anchor-header">MRLのディメンション圧縮：256次元で失われる品質は？<button data-href="#MRL-Dimension-Compression-How-Much-Quality-Do-You-Lose-at-256-Dimensions" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>マトリョーシカ表現学習（MRL</strong>）は、ベクトルの最初のN次元をそれだけで意味のあるものにする学習手法です。3072次元のベクトルを256次元に切り詰めても、その意味的な品質はほとんど失われません。3072 次元から 256 次元への切り捨ては 12 倍のストレージ削減を意味します。</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_10_aef8755877.png" alt="Illustration showing MRL dimension truncation: 3072 dimensions at full quality, 1024 at 95%, 512 at 90%, 256 at 85% — with 12x storage savings at 256 dimensions" class="doc-image" id="illustration-showing-mrl-dimension-truncation:-3072-dimensions-at-full-quality,-1024-at-95%,-512-at-90%,-256-at-85%-—-with-12x-storage-savings-at-256-dimensions" />
   <span>MRLの次元切り捨てを示す図：3072次元で完全品質、1024次元で95%、512次元で90%、256次元で85% - 256次元でストレージを12倍節約</span> </span></p>
<h3 id="Method" class="common-anchor-header">方法</h3><p>STS-Bベンチマークから150の文ペアを使用し、それぞれ人間が注釈を付けた類似度スコア（0～5）を設定。各モデルについて、全次元で埋め込みを生成し、1024、512、256に切り捨てた。</p>
<p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_4_44266e5456.png" alt="STS-B data examples showing sentence pairs with human similarity scores: A girl is styling her hair vs A girl is brushing her hair scores 2.5; A group of men play soccer on the beach vs A group of boys are playing soccer on the beach scores 3.6" class="doc-image" id="sts-b-data-examples-showing-sentence-pairs-with-human-similarity-scores:-a-girl-is-styling-her-hair-vs-a-girl-is-brushing-her-hair-scores-2.5;-a-group-of-men-play-soccer-on-the-beach-vs-a-group-of-boys-are-playing-soccer-on-the-beach-scores-3.6" />
   <span>STS-Bデータ例：人間による類似度スコアを持つ文のペア：A girl is styling her hair vs A girl is brushing her hair score 2.5; A group of men play soccer on the beach vs A group of boys are playing soccer on the beach score 3.6</span> </span></p>
<p><strong>得点：</strong></p>
<ul>
<li>各次元レベルで、各文ペアの埋め込み間の<a href="https://zilliz.com/glossary/cosine-similarity">余弦類似</a>度を計算する。</li>
<li><strong>スピアマンのρ</strong>（順位相関）を使って、モデルの類似度ランキングを人間のランキングと比較する。</li>
</ul>
<blockquote>
<p><strong>スピアマンのρとは？</strong>これは2つの順位がどの程度一致するかを測定するものです。もし人間がペアAを最も似ている、Bを2番目、Cを最も似ていないとランク付けし、モデルの余弦類似度がA &gt; B &gt; Cと同じ順序になる場合、ρは1.0に近づきます。ρが1.0は完全な一致を意味する。ρが0は、相関がないことを意味する。</p>
</blockquote>
<p><strong>最終メトリクス:</strong>spearman_rho（高いほどよい）およびmin_viable_dim（品質が全次元の性能の5%以内にとどまる最小次元）。</p>
<h3 id="Results" class="common-anchor-header">結果</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_3_7192725ed6.png" alt="Dot plot showing MRL Full Dimension vs 256 Dimension Quality: Voyage MM-3.5 leads with +0.6% change, Jina v4 +0.5%, while Gemini Embed 2 shows -0.6% at the bottom" class="doc-image" id="dot-plot-showing-mrl-full-dimension-vs-256-dimension-quality:-voyage-mm-3.5-leads-with-+0.6%-change,-jina-v4-+0.5%,-while-gemini-embed-2-shows--0.6%-at-the-bottom" />
   <span>MRL 全次元と 256 次元の品質を比較したドットプロット：Voyage MM-3.5が+0.6%の変化でトップ、Jina v4が+0.5%、Gemini Embed 2が-0.6%で最下位。</span> </span></p>
<p><a href="https://milvus.io/">Milvusや</a>他のベクターデータベースで、ディメンションを切り捨てることでストレージコストを削減しようと考えているのであれば、この結果は重要である。</p>
<table>
<thead>
<tr><th>モデル</th><th>ρ (フル次元)</th><th>ρ（256次元）</th><th>減衰</th></tr>
</thead>
<tbody>
<tr><td>Voyage マルチモーダル 3.5</td><td>0.880</td><td>0.874</td><td>0.7%</td></tr>
<tr><td>ジーナ・エンベッディングv4</td><td>0.833</td><td>0.828</td><td>0.6%</td></tr>
<tr><td>mxbai-embed-large (335M)</td><td>0.815</td><td>0.795</td><td>2.5%</td></tr>
<tr><td>nomic-埋め込みテキスト (137M)</td><td>0.781</td><td>0.774</td><td>0.8%</td></tr>
<tr><td>OpenAI 3-ラージ</td><td>0.767</td><td>0.762</td><td>0.6%</td></tr>
<tr><td>ジェミニ エンベッディング 2</td><td>0.683</td><td>0.689</td><td>-0.8%</td></tr>
</tbody>
</table>
<p>VoyageとJina v4がリードしているのは、どちらもMRLを目的として明示的にトレーニングされたからである。次元圧縮はモデルサイズとはあまり関係がなく、モデルがそのために訓練されたかどうかが重要なのだ。</p>
<p>Geminiのスコアに関する注意：MRLランキングは、モデルが切り捨て後にどれだけ品質を保てるかを反映するものであり、全次元検索がどれだけ優れているかを反映するものではない。Geminiの全文検索は強力である。クロスリンガル検索とキーインフォメーション検索の結果がすでにそれを証明している。ただ、縮小に最適化されていなかっただけなのだ。もしあなたが次元圧縮を必要としないのであれば、この指標はあなたには当てはまらない。</p>
<h2 id="Which-Embedding-Model-Should-You-Use" class="common-anchor-header">どの埋め込みモデルを使うべきか？<button data-href="#Which-Embedding-Model-Should-You-Use" class="anchor-icon" translate="no">
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
    </button></h2><p>単一のモデルがすべてを制することはありません。以下がそのスコアカードです：</p>
<table>
<thead>
<tr><th>モデル</th><th>パラメータ</th><th>クロスモーダル</th><th>クロスリンガル</th><th>主要情報</th><th>MRL ρ</th></tr>
</thead>
<tbody>
<tr><td>ジェミニ埋め込み2</td><td>非公開</td><td>0.928</td><td>0.997</td><td>1.000</td><td>0.668</td></tr>
<tr><td>ボヤージュ・マルチモーダル 3.5</td><td>非公開</td><td>0.900</td><td>0.982</td><td>1.000</td><td>0.880</td></tr>
<tr><td>ジーナ エンベッディング v4</td><td>3.8B</td><td>-</td><td>0.985</td><td>1.000</td><td>0.833</td></tr>
<tr><td>Qwen3-VL-2B</td><td>2B</td><td>0.945</td><td>0.988</td><td>1.000</td><td>0.774</td></tr>
<tr><td>OpenAI 3-大型</td><td>非公開</td><td>-</td><td>0.967</td><td>1.000</td><td>0.760</td></tr>
<tr><td>コヒーレエンベッドv4</td><td>非公開</td><td>-</td><td>0.955</td><td>1.000</td><td>-</td></tr>
<tr><td>ジーナCLIP v2</td><td>~1B</td><td>0.873</td><td>0.934</td><td>1.000</td><td>-</td></tr>
<tr><td>BGE-M3</td><td>568M</td><td>-</td><td>0.940</td><td>0.973</td><td>0.744</td></tr>
<tr><td>mxbai-embed-large</td><td>335M</td><td>-</td><td>0.120</td><td>0.660</td><td>0.815</td></tr>
<tr><td>ノミック埋め込みテキスト</td><td>137M</td><td>-</td><td>0.154</td><td>0.633</td><td>0.780</td></tr>
<tr><td>クリップ ViT-L-14</td><td>428M</td><td>0.768</td><td>0.030</td><td>-</td><td>-</td></tr>
</tbody>
</table>
<p>「モデルはそのモダリティまたは能力をサポートしていない。CLIPは2021年のベースラインである。</p>
<p>以下は顕著な点である：</p>
<ul>
<li><strong>クロスモーダル：</strong>Qwen3-VL-2B（0.945）が1位、Gemini（0.928）が2位、Voyage（0.900）が3位。オープンソースの2Bモデルが、あらゆるクローズドソースのAPIを打ち負かした。決め手は、パラメータ数ではなく、モダリティギャップだった。</li>
<li><strong>クロスリンガル:</strong>Gemini (0.997)がリード - イディオムレベルのアライメントで完璧なスコアを出した唯一のモデル。上位8モデルはすべて0.93をクリア。英語のみの軽量モデルのスコアはゼロに近い。</li>
<li><strong>重要な情報</strong>APIと大規模なオープンソースモデルは、8Kまでは満点。335M以下のモデルは4Kで劣化し始める。32Kを満点で処理するモデルはGeminiのみ。</li>
<li><strong>MRL次元圧縮：</strong>Voyage（0.880）とJina v4（0.833）がリードしており、256次元で1％未満の損失。Gemini(0.668)が最下位。全次元では強いが、切り捨てには最適化されていない。</li>
</ul>
<h3 id="How-to-Pick-A-Decision-Flowchart" class="common-anchor-header">選び方：決定フローチャート</h3><p>
 <span class="img-wrapper">
   <img translate="no" src="https://assets.zilliz.com/choose_embedding_model_rag_2026_7_b2bd48bdcc.png" alt="Embedding model selection flowchart: Start → Need images or video? → Yes: Need to self-host? → Yes: Qwen3-VL-2B, No: Gemini Embedding 2. No images → Need to save storage? → Yes: Jina v4 or Voyage, No: Need multilingual? → Yes: Gemini Embedding 2, No: OpenAI 3-large" class="doc-image" id="embedding-model-selection-flowchart:-start-→-need-images-or-video?-→-yes:-need-to-self-host?-→-yes:-qwen3-vl-2b,-no:-gemini-embedding-2.-no-images-→-need-to-save-storage?-→-yes:-jina-v4-or-voyage,-no:-need-multilingual?-→-yes:-gemini-embedding-2,-no:-openai-3-large" />
   <span>埋め込みモデル選択のフローチャート：開始 → 画像や動画が必要か？→ はい：セルフホストが必要か？→ はい：Qwen3-VL-2B, いいえ: Gemini Embedding 2.画像なし → ストレージを節約する必要があるか？→ はい：Jina v4またはVoyage、いいえ：多言語が必要ですか？→ はい：Gemini Embedding 2、いいえ：OpenAI 3-large</span> </span></p>
<h3 id="The-Best-All-Rounder-Gemini-Embedding-2" class="common-anchor-header">最高のオールラウンダージェミニエンベッディング2</h3><p>バランスを考慮すると、Gemini Embedding 2は、このベンチマークで最も強力な総合モデルである。</p>
<p><strong>強み</strong>クロスリンガル（0.997）およびキー情報検索（32Kまでのすべての長さで1.000）で1位。クロスモーダル（0.928）で2位。5つのモダリティ（テキスト、イメージ、ビデオ、オーディオ、PDF）をカバー。</p>
<p><strong>弱点</strong>MRL圧縮で最下位（ρ = 0.668）。クロスモーダルではオープンソースのQwen3-VL-2Bに負けている。</p>
<p>次元圧縮を必要としないのであれば、Geminiは、クロスリンガル＋ロングドキュメント検索の組み合わせにおいて、真のライバルはいない。しかし、クロスモーダルな精度やストレージの最適化のためには、特化したモデルの方が優れている。</p>
<h2 id="Limitations" class="common-anchor-header">制限事項<button data-href="#Limitations" class="anchor-icon" translate="no">
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
    </button></h2><ul>
<li>NVIDIAのNV-Embed-v2とJinaのv5-textはリストにあったが、今回のラウンドには参加しなかった。</li>
<li>我々は、テキストと画像のモダリティに焦点を当てました。ビデオ、オーディオ、PDFの埋め込みは、（いくつかのモデルがサポートを主張しているにもかかわらず）カバーしていません。</li>
<li>コード検索やその他のドメイン固有のシナリオは対象外とした。</li>
<li>サンプル数が比較的少なかったため、モデル間のランキングの厳密な差は統計的ノイズの範囲内かもしれない。</li>
</ul>
<p>この記事の結果は1年以内に古くなるだろう。新しいモデルは常に出荷され、リーダーボードはリリースのたびに入れ替わる。データ型、クエリーパターン、ドキュメントの長さを定義し、新しいモデルが登場したら独自のテストにかけるのです。MTEB、MMTEB、MMEBのような公開ベンチマークは監視する価値がありますが、最終的な判断は常にあなた自身のデータから行うべきです。</p>
<p><a href="https://github.com/zc277584121/mm-embedding-bench">私たちのベンチマークコードはGitHubでオープンソースとして公開されています</a>。</p>
<hr>
<p>エンベッディング・モデルを選んだら、そのベクトルを保存し、大規模に検索する場所が必要です。<a href="https://milvus.io/">Milvusは</a>、世界で最も広く採用されているオープンソースのベクトルデータベースで、<a href="https://github.com/milvus-io/milvus">43K以上のGitHubスターを</a>持ち、まさにこのために構築されています。MRLで切り捨てられた次元、混合されたマルチモーダルコレクション、密なベクトルと疎なベクトルを組み合わせたハイブリッド検索をサポートし、<a href="https://milvus.io/docs/architecture_overview.md">ラップトップから数十億のベクトルまでスケール</a>します。</p>
<ul>
<li><a href="https://milvus.io/docs/quickstart.md">Milvusクイックスタートガイドで</a>始めるか、<code translate="no">pip install pymilvus</code> でインストールしてください。</li>
<li><a href="https://milvusio.slack.com/">Milvus Slack</a>または<a href="https://discord.com/invite/8uyFbECzPX">Milvus Discordに</a>参加して、埋め込みモデル統合、ベクトルインデックス戦略、プロダクションスケーリングについて質問してください。</li>
<li>モデルの選択、コレクションスキーマの設計、パフォーマンスチューニングについてお手伝いいたします<a href="https://milvus.io/office-hours">。</a></li>
<li>インフラストラクチャの作業を省きたい場合は、Milvusのマネージドサービスである<a href="https://cloud.zilliz.com/signup">Zilliz Cloudを</a>ご利用ください。</li>
</ul>
<hr>
<p>エンジニアがプロダクションRAG用のエンベッディングモデルを選択する際に出てくるいくつかの質問：</p>
<p><strong>Q: 今はテキストデータしかなくても、マルチモーダル埋め込みモデルを使うべきでしょうか？</strong></p>
<p>ロードマップによります。今後6～12ヶ月以内にパイプラインに画像、PDF、その他のモダリティが追加される可能性がある場合、Gemini Embedding 2やVoyage Multimodal 3.5のようなマルチモーダルモデルから始めると、後で手痛い移行を避けることができます。当面はテキストのみとお考えであれば、OpenAI 3-largeやCohere Embed v4のようなテキストに特化したモデルの方が、価格性能ともに優れています。</p>
<p><strong>Q: MRL次元圧縮は、ベクターデータベースにおいて実際にどれくらいのストレージを節約するのでしょうか？</strong></p>
<p>3072次元から256次元にすることで、ベクターあたりのストレージを12倍削減できます。float32で1億のベクトルを持つ<a href="https://milvus.io/">Milvus</a>コレクションの場合、およそ1.14TB → 95GBになります。Voyage Multimodal 3.5とJina Embeddings v4は256次元で1%以下の品質低下ですが、他のモデルは大幅に低下します。</p>
<p><strong>Q: Qwen3-VL-2Bは、クロスモーダル検索においてGemini Embedding 2よりも本当に優れていますか？</strong></p>
<p>Q: Qwen3-VL-2Bは、Gemini Embedding 2よりもクロスモーダル検索において優れているのでしょうか？その主な理由は、Qwenの方がモダリティギャップがずっと小さい（0.25対0.73）ことで、これはベクトル空間においてテキストと画像の<a href="https://zilliz.com/glossary/vector-embeddings">埋め込みが</a>より近くに集まっていることを意味する。とはいえ、Geminiは5つのモダリティをカバーしているのに対し、Qwenは3つのモダリティをカバーしているので、音声やPDFの埋め込みが必要な場合は、Geminiが唯一の選択肢となります。</p>
<p><strong>Q: Milvusでこれらの埋め込みモデルを直接使用することはできますか？</strong></p>
<p>はい。<a href="https://milvus.io/docs/insert-update-delete.md">Milvusに挿入して</a>、<a href="https://zilliz.com/glossary/cosine-similarity">余弦類似度</a>、L2距離、内積で検索することができます。<a href="https://milvus.io/docs/install-pymilvus.md">PyMilvusは</a>どの埋め込みモデルでも動作します。モデルのSDKを使ってベクトルを生成し、Milvusに保存して検索します。MRLで切り捨てられたベクトルについては、コレクションを<a href="https://milvus.io/docs/manage-collections.md">作成する</a>際にコレクションの次元をターゲット（例えば256）に設定するだけです。</p>
