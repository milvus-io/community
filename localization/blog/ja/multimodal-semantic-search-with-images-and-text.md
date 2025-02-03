---
id: multimodal-semantic-search-with-images-and-text.md
title: 画像とテキストによるマルチモーダル意味検索
author: Stefan Webb
date: 2025-02-3
desc: 基本的なキーワードマッチングを超え、テキストと画像の関係を理解するマルチモーダルAIを使用したセマンティック検索アプリの構築方法を学ぶ。
cover: >-
  assets.zilliz.com/Multimodal_Semantic_Search_with_Images_and_Text_180d89d5aa.png
tag: Engineering
tags: 'Milvus, Vector Database, Open Source, Semantic Search, Multimodal AI'
recommend: true
canonicalUrl: 'https://milvus.io/blog/multimodal-semantic-search-with-images-and-text.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Multimodal_Semantic_Search_with_Images_and_Text_180d89d5aa.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>人間として、私たちは感覚を通して世界を解釈する。私たちは音を聞き、画像、映像、テキストを目にし、しばしば互いに重ね合わせる。私たちは、このような複数のモダリティとそれらの関係を通して世界を理解する。人工知能が人間の能力に真に匹敵し、あるいはそれを超えるためには、複数のレンズを通して同時に世界を理解する、これと同じ能力を開発しなければならない。</p>
<p>この投稿とそれに付随するビデオ（近日公開予定）およびノートブックでは、テキストと画像の両方を一緒に処理できるモデルにおける最近のブレークスルーを紹介する。私たちは、単純なキーワードマッチングを超えたセマンティック検索アプリケーションを構築することで、これを実証します - ユーザが求めているものと、彼らが検索しているビジュアルコンテンツとの関係を理解します。</p>
<p>このプロジェクトが特にエキサイティングなのは、Milvusベクトル・データベース、HuggingFaceの機械学習ライブラリ、アマゾンのカスタマー・レビューのデータセットなど、すべてオープンソースのツールで構築されていることだ。ほんの10年前であれば、このようなものを構築するにはかなりの専有リソースが必要だっただろうと考えると、驚くべきことだ。今日、これらの強力なコンポーネントは自由に利用でき、実験する好奇心さえあれば誰でも革新的な方法で組み合わせることができる。</p>
<custom-h1>概要</custom-h1><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/overview_97a124bc9a.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>我々のマルチモーダル検索アプリケーションは、<em>retrieve-and-rerank</em>タイプである。RAG（<em>retrieval-augmented-generation</em>）をご存知であれば、非常によく似ているが、最終的な出力は、大規模言語ビジョンモデル（LLVM）によって再ランク付けされた画像のリストである。ユーザーの検索クエリにはテキストと画像の両方が含まれ、ターゲットはベクトル・データベースにインデックスされた画像セットである。このアーキテクチャには、<em>インデックス作成</em>、<em>検索</em>、<em>再ランク付け</em>（「生成」のようなもの）という3つのステップがある。</p>
<h2 id="Indexing" class="common-anchor-header">インデックス作成<button data-href="#Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>検索アプリケーションは、検索する何かを持っていなければならない。私たちの場合、「Amazon Reviews 2023」データセットの小さなサブセットを使用する。このデータセットには、あらゆる種類の商品に関するAmazonのカスタマーレビューのテキストと画像の両方が含まれている。私たちが構築しているこのようなセマンティック検索は、eコマースサイトの便利な追加機能として想像できるだろう。このノートブックは、適切なデータベースと推論を導入することで、本番サイズまで拡張することができる。</p>
<p>我々のパイプラインの最初の "マジック "は、埋め込みモデルの選択である。私たちは、最近開発された<a href="https://huggingface.co/BAAI/bge-visualized">Visualized BGEと</a>呼ばれるマルチモーダルモデルを使用しています。このモデルは、テキストと画像を一緒に、またはどちらか一方を別々に、同じ空間に埋め込むことができます。このようなモデルは、例えば<a href="https://github.com/google-deepmind/magiclens">MagicLensの</a>ように、最近も開発されている。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/indexing_1937241be5.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>上の図は、[ライオンの横向きの画像]と "この正面図 "というテキストを埋め込んだ場合の埋め込みは、[ライオンの正面向きの画像]とテキストを埋め込まない場合の埋め込みに近いことを示しています。同じモデルを、テキスト＋画像の入力にも、画像のみの入力にも（テキストのみの入力にも）用いる。<em>このようにして、モデルは、クエリテキストがクエリ画像とどのように関連しているかというユーザーの意図を理解することができる。</em></p>
<p>我々は、対応するテキストなしで900の商品画像を埋め込み、<a href="https://milvus.io/docs">milvusを</a>使用してベクトルデータベースに埋め込みを保存する。</p>
<h2 id="Retrieval" class="common-anchor-header">検索<button data-href="#Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>データベースが構築されたので、ユーザークエリを提供することができる。あるユーザーが次のようなクエリを持ってきたとしよう：「というクエリに[Leopardの画像]を加えたとする。つまり、ヒョウ柄のスマホケースを探しているのです。</p>
<p>ユーザーのクエリのテキストは、"ヒョウの皮 "ではなく、"これ "と言っていることに注意してください。私たちの埋め込みモデルは、"this "とそれが指すものを結びつけることができるに違いない。これは、以前のモデルの反復がこのようなオープンエンドの指示を扱うことができなかったことを考えると、印象的な偉業である。<a href="https://arxiv.org/abs/2403.19651">MagicLensの論文では</a>、さらに例を挙げている。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Retrieval_ad64f48e49.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>クエリーテキストと画像を共同で埋め込み、ベクトルデータベースの類似性検索を行い、上位9件を返す。結果をヒョウのクエリー画像とともに上図に示す。上位のヒットはクエリに最も関連するものではないようだ。7番目の結果が最も関連性が高いようで、ヒョウの皮がプリントされた電話カバーである。</p>
<h2 id="Generation" class="common-anchor-header">世代<button data-href="#Generation" class="anchor-icon" translate="no">
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
    </button></h2><p>一番上の結果が最も関連性の高いものではないという点で、検索は失敗したようだ。しかし、再ランク付けのステップでこれを修正することができる。多くのRAGパイプラインにおいて、検索されたアイテムの再ランク付けは重要なステップであることはご存知だろう。我々は<a href="https://huggingface.co/microsoft/Phi-3-vision-128k-instruct">Phi-3 Visionを</a>リランカーモデルとして使用する。</p>
<p>まず、LLVMにクエリー画像のキャプションを生成するよう依頼する。LLVMは次のように出力する：</p>
<p><em>「この画像はヒョウの顔のクローズアップで、斑点のある毛並みと緑色の目に焦点を当てています。</em></p>
<p>次に、このキャプションと、9つの結果とクエリ画像を含む1つの画像を与え、モデルに結果の再ランク付けを依頼するテキストプロンプトを構築し、答えをリストとして与え、最も一致するものを選択する理由を提供する。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Generation_b016a6c26a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>出力は上の図のように視覚化され、最も関連性の高いアイテムがトップマッチになりました：</p>
<p><em>"最も適切なアイテムはヒョウをテーマにしたもので、同じようなテーマのスマホケースを求めるユーザーのクエリ指示にマッチしています。"</em></p>
<p>我々のLLVMリランカーは、画像とテキストを横断して理解を行い、検索結果の関連性を向上させることができた。<em>興味深い成果として、再ランカーは8つの結果しか与えず、1つ落としていることがある。これはガードレールと構造化出力の必要性を強調している。</em></p>
<h2 id="Summary" class="common-anchor-header">まとめ<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>この投稿とそれに付随するビデオ（近日公開予定）と<a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/multimodal_retrieval_amazon_reviews.ipynb">ノートブックでは</a>、テキストと画像を横断するマルチモーダルな意味検索のためのアプリケーションを構築した。埋め込みモデルは、テキストと画像を同じ空間に一緒に、あるいは別々に埋め込むことができ、基礎モデルは、テキストと画像を入力し、それに対してテキストを生成することができた。<em>重要なのは、埋め込みモデルは、自由形式の指示というユーザーの意図をクエリー画像に関連付けることができ、そうすることで、ユーザーが結果を入力画像にどのように関連付けたいかを指定できたことである。</em></p>
<p>これは、近い将来に起こることのほんの一例に過ぎない。画像、ビデオ、音声、分子、ソーシャルネットワーク、表データ、時系列データなど、その可能性は無限である。</p>
<p>そして、これらのシステムの中核にあるのが、システムの外部「メモリ」を保持するベクトル・データベースである。Milvusはこの目的に最適である。<a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">Milvusは</a>オープンソースで、十分な機能を備えており（<a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">Milvus 2.5の全文検索についてはこちらの記事を</a>参照）、ウェブスケールのトラフィックと100ミリ秒以下のレイテンシで数十億のベクトルまで効率的にスケールする。<a href="https://milvus.io/docs">Milvusのドキュメントで</a>詳細を確認し、私たちの<a href="https://milvus.io/discord">Discord</a>コミュニティに参加し、次回の<a href="https://lu.ma/unstructured-data-meetup">Unstructured Data meetupで</a>お会いできることを楽しみにしています。それではまた！</p>
<h2 id="Resources" class="common-anchor-header">リソース<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p>ノートブック「<a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/multimodal_retrieval_amazon_reviews.ipynb">Amazon ReviewsとLLVM Rerankingによるマルチモーダル検索</a>"</p></li>
<li><p>Youtube AWS Developersビデオ（近日公開予定）</p></li>
<li><p><a href="https://milvus.io/docs">Milvusドキュメント</a></p></li>
<li><p><a href="https://lu.ma/unstructured-data-meetup">非構造化データミートアップ</a></p></li>
<li><p>埋め込みモデル<a href="https://huggingface.co/BAAI/bge-visualized">可視化されたBGEモデルカード</a></p></li>
<li><p>他の埋め込みモデル<a href="https://github.com/google-deepmind/magiclens">MagicLensモデルレポ</a></p></li>
<li><p>LLVM：<a href="https://huggingface.co/microsoft/Phi-3-vision-128k-instruct">Phi-3 Visionモデルカード</a></p></li>
<li><p>論文"<a href="https://arxiv.org/abs/2403.19651">MagicLens：オープンエンド命令による自己教師付き画像検索</a>"</p></li>
<li><p>データセット<a href="https://amazon-reviews-2023.github.io/">アマゾンレビュー2023</a></p></li>
</ul>
