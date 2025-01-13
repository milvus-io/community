---
id: optimizing-billion-scale-image-search-milvus-part-1.md
title: 概要
author: Rife Wang
date: 2020-08-04T20:39:09.882Z
desc: UPYUNとのケーススタディ。Milvusがどのように従来のデータベースソリューションと一線を画し、画像類似検索システムの構築を支援したかをご紹介します。
cover: assets.zilliz.com/header_23bbd76c8b.jpg
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-1'
---
<custom-h1>億規模の画像検索を最適化する旅 (1/2)</custom-h1><p>Yupoo Picture Managerは数千万人のユーザーにサービスを提供し、数百億枚の画像を管理しています。そのユーザーギャラリーが大きくなるにつれ、Yupooは画像を素早く検索できるソリューションの緊急なビジネスニーズを持っています。言い換えれば、ユーザーが画像を入力すると、システムはその元画像とギャラリー内の類似画像を見つける必要があります。画像検索サービスの開発は、この問題に対する効果的なアプローチを提供します。</p>
<p>画像検索サービスは、2つの進化を遂げてきた：</p>
<ol>
<li>2019年初頭に最初の技術検討を開始し、2019年3月と4月に第一世代のシステムを立ち上げた；</li>
<li>2020年初頭からバージョンアップ計画の検討を開始し、2020年4月から第2世代システムへの全面的なバージョンアップを開始した。</li>
</ol>
<p>本稿では、2世代にわたる画像検索システムの技術選定と基本原理について、筆者の実体験に基づき解説する。</p>
<h2 id="Overview" class="common-anchor-header">概要<button data-href="#Overview" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="What-is-an-image" class="common-anchor-header">画像とは何か？</h3><p>画像を扱う前に、画像とは何かを知らなければならない。</p>
<p>答えは、画像とはピクセルの集まりである。</p>
<p>例えば、この画像の赤枠の部分は、事実上ピクセルの集まりである。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_what_is_an_image_021e0280cc.png" alt="1-what-is-an-image.png" class="doc-image" id="1-what-is-an-image.png" />
   </span> <span class="img-wrapper"> <span>1-画像とは何か.png</span> </span></p>
<p>仮に赤枠の部分が画像だとすると、画像内の独立した小さな四角はそれぞれピクセルであり、基本的な情報単位である。すると、画像の大きさは11 x 11 pxとなる。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_what_is_an_image_602a91b4a0.png" alt="2-what-is-an-image.png" class="doc-image" id="2-what-is-an-image.png" />
   </span> <span class="img-wrapper"> <span>2-画像とは何か.png</span> </span></p>
<h3 id="Mathematical-representation-of-images" class="common-anchor-header">画像の数学的表現</h3><p>各画像は行列で表すことができます。画像の各ピクセルは行列の要素に対応します。</p>
<h3 id="Binary-images" class="common-anchor-header">二値画像</h3><p>2値画像のピクセルは黒か白のどちらかであるため、各ピクセルは0か1で表すことができます。例えば、4 * 4の2値画像の行列表現は次のようになります：</p>
<pre><code translate="no">0 1 0 1
1 0 0 0
1 1 1 0
0 0 1 0
</code></pre>
<h3 id="RGB-images" class="common-anchor-header">RGB画像</h3><p>3原色（赤、緑、青）を混ぜて任意の色を作ることができます。RGB画像の場合、各ピクセルは3つのRGBチャンネルの基本情報を持っています。同様に、各チャンネルが8ビットの数値（256レベル）でグレースケールを表現する場合、ピクセルの数学的表現は次のようになります：</p>
<pre><code translate="no">([0 .. 255], [0 .. 255], [0 .. 255])
</code></pre>
<p>4×4のRGB画像を例にとると</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_4_x_4_rgb_image_136cec77ce.png" alt="3-4-x-4-rgb-image.png" class="doc-image" id="3-4-x-4-rgb-image.png" />
   </span> <span class="img-wrapper"> <span>3-4-x-4-rgb-image.png</span> </span></p>
<p>画像処理の本質は、これらのピクセル行列を処理することである。</p>
<h2 id="The-technical-problem-of-search-by-image" class="common-anchor-header">画像による検索の技術的問題<button data-href="#The-technical-problem-of-search-by-image" class="anchor-icon" translate="no">
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
    </button></h2><p>元の画像、つまりまったく同じピクセルを持つ画像を探すのであれば、MD5値を直接比較すればよい。しかし、インターネットにアップロードされた画像は圧縮されていたり、透かしが入っていたりすることが多い。画像にわずかな変更が加えられただけでも、MD5の結果は異なってしまうのです。ピクセルに矛盾がある限り、元の画像を見つけることは不可能です。</p>
<p>画像単位で検索するシステムでは、類似した内容の画像を検索したい。そのためには、2つの基本的な問題を解決する必要がある：</p>
<ul>
<li>画像をコンピュータで処理可能なデータ形式として表現または抽象化すること。</li>
<li>計算のために比較可能なデータであること。</li>
</ul>
<p>具体的には、以下のような特徴が必要である：</p>
<ul>
<li>画像の特徴抽出。</li>
<li>特徴計算（類似度計算）。</li>
</ul>
<h2 id="The-first-generation-search-by-image-system" class="common-anchor-header">第一世代の画像検索システム<button data-href="#The-first-generation-search-by-image-system" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Feature-extraction--image-abstraction" class="common-anchor-header">特徴抽出 - 画像の抽象化</h3><p>第一世代の画像検索システムでは、特徴抽出にPerceptual hashまたはpHashアルゴリズムが用いられている。このアルゴリズムの基本は何か？</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_first_generation_image_search_ffd7088158.png" alt="4-first-generation-image-search.png" class="doc-image" id="4-first-generation-image-search.png" />
   </span> <span class="img-wrapper"> <span>4-第一世代画像検索.png</span> </span></p>
<p>上図に示すように、pHashアルゴリズムはハッシュ値を得るために画像に対して一連の変換を行います。変換処理中、アルゴリズムは画像を連続的に抽象化し、それによって類似画像の結果を互いに近づける。</p>
<h3 id="Feature-calculation--similarity-calculation" class="common-anchor-header">特徴計算-類似度計算</h3><p>2つの画像のpHash値の類似度を計算するには？答えはハミング距離を使うことです。ハミング距離が小さいほど、画像の内容が類似していることになります。</p>
<p>ハミング距離とは？異なるビットの数です。</p>
<p>例えば</p>
<pre><code translate="no">Value 1： 0 1 0 1 0
Value 2： 0 0 0 1 1
</code></pre>
<p>上の2つの値には2つの異なるビットがあるので、両者のハミング距離は2である。</p>
<p>これで類似度計算の原理はわかった。次の問題は、1億スケールの写真から1億スケールのデータのハミング距離をどのように計算するかである。要するに、どうやって類似画像を検索するのか？</p>
<p>プロジェクトの初期段階では、ハミング距離を素早く計算できる満足のいくツール（あるいは計算エンジン）が見つからなかった。そこで私は計画を変更した。</p>
<p>私の考えは、もし2つのpHash値のハミング距離が小さければ、pHash値をカットして、対応する小さな部分が等しくなる可能性が高いということです。</p>
<p>例えばこうだ：</p>
<pre><code translate="no">Value 1： 8 a 0 3 0 3 f 6
Value 2： 8 a 0 3 0 3 d 8
</code></pre>
<p>上の2つの値を8つのセグメントに分割すると、6つのセグメントの値はまったく同じである。ハミング距離が近いので、この2つの画像は類似していると推測できます。</p>
<p>変換後、ハミング距離の計算問題が等価性のマッチングの問題になったことがわかります。各pHash値を8つのセグメントに分割すると、まったく同じ値を持つセグメントが5つ以上ある限り、2つのpHash値は類似していることになる。</p>
<p>したがって、等価マッチングを解くのは非常に簡単である。伝統的なデータベースシステムの古典的なフィルタリングを使うことができる。</p>
<p>もちろん、私は多項式マッチングを使い、ElasticSearchのminimum_should_matchを使ってマッチングの度合いを指定しています（この記事ではESの原理は紹介しませんので、ご自身で勉強してください）。</p>
<p>なぜElasticSearchなのか？第一に、前述の検索機能を備えていること。第二に、画像管理プロジェクト自体がESを利用して全文検索機能を提供しており、既存のリソースを利用できるため非常に経済的である。</p>
<h2 id="Summary-of-the-first-generation-system" class="common-anchor-header">第一世代システムの概要<button data-href="#Summary-of-the-first-generation-system" class="anchor-icon" translate="no">
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
    </button></h2><p>第一世代の画像検索システムでは、以下の特徴を持つpHash + ElasticSearchソリューションを選択している：</p>
<ul>
<li>pHashアルゴリズムは使いやすく、ある程度の圧縮、透かし、ノイズに耐えることができる。</li>
<li>ElasticSearchは、検索に追加コストをかけることなく、プロジェクトの既存のリソースを利用する。</li>
<li>しかし、このシステムの限界は明らかである。pHashアルゴリズムは画像全体の抽象的表現である。元の画像に黒い枠線を加えるなど、画像の完全性をいったん壊してしまうと、元の画像と他の画像との類似性を判断することはほとんど不可能になる。</li>
</ul>
<p>このような制約を打破するために、全く異なる基盤技術を持つ第二世代の画像検索システムが登場したのである。</p>
<p>この記事は、Milvusユーザーであり、UPYUNのソフトウェアエンジニアであるrifewangによって書かれました。この記事が気に入ったら、ぜひご挨拶に来てください！ https://github.com/rifewang</p>
