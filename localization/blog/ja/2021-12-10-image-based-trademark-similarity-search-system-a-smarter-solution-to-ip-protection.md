---
id: >-
  2021-12-10-image-based-trademark-similarity-search-system-a-smarter-solution-to-ip-protection.md
title: 知的財産保護におけるMilvus：Milvusによる商標類似検索システムの構築
author: Zilliz
date: 2021-12-10T00:00:00.000Z
desc: 知的財産保護業界におけるベクトル類似性検索の適用方法を学ぶ。
cover: assets.zilliz.com/IP_protection_0a33547579.png
tag: Scenarios
---
<p>近年、知的財産権侵害に対する人々の意識がますます高まり、知的財産権保護の問題が脚光を浴びている。特に、多国籍テクノロジー大手のアップル社は、商標権、特許権、意匠権などの<a href="https://en.wikipedia.org/wiki/Apple_Inc._litigation">知的財産権侵害を理由に、様々な企業に対して</a>積極的に訴訟を起こしている。これらの最も悪名高い事例とは別に、アップル社は2009年にも、オーストラリアのスーパーマーケットチェーン、<a href="https://www.smh.com.au/business/apple-bites-over-woolworths-logo-20091005-ghzr.html">ウールワース・リミテッドによる商標権</a>侵害を理由とする<a href="https://www.smh.com.au/business/apple-bites-over-woolworths-logo-20091005-ghzr.html">商標出願を争って</a>いる。  アップル社はは、オーストラリアのブランドのロゴである様式化された「w」が、自社のロゴであるリンゴに似ていると主張した。そのため、アップル社は、ウールワースがこのロゴを使用して販売することを申請した電子機器などの製品群に異議を申し立てた。物語は、ウールワースがロゴを修正し、アップル社が反対を取り下げることで幕を閉じる。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Logo_of_Woolworths_b04ece5b20.png" alt="Logo of Woolworths.png" class="doc-image" id="logo-of-woolworths.png" />
   </span> <span class="img-wrapper"> <span>ウールワースのロゴ.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Logo_of_Apple_Inc_181e5bd5f8.png" alt="Logo of Apple Inc.png" class="doc-image" id="logo-of-apple-inc.png" />
   </span> <span class="img-wrapper"> <span>アップル社のロゴ.png</span> </span></p>
<p>ブランド文化に対する意識がますます高まる中、企業は自社の知的財産（IP）権を害するような脅威には目を光らせている。知的財産権の侵害には以下が含まれる：</p>
<ul>
<li>著作権侵害</li>
<li>特許侵害</li>
<li>商標権侵害</li>
<li>デザイン侵害</li>
<li>サイバースクワッティング</li>
</ul>
<p>前述のアップルとウールワースの紛争は、主に商標権侵害をめぐるものであり、正確には両者の商標イメージの類似をめぐるものである。Woolworthsの二の舞にならないためには、商標出願前および商標出願審査中の両方において、商標の徹底的な類似性調査が重要なステップとなる。最も一般的な方法は、<a href="https://tmsearch.uspto.gov/search/search-information">米国特許商標庁（USPTO）のデータベースで</a>検索することである。あまり魅力的なUIではないにもかかわらず、この検索プロセスは、画像を検索するために単語と商標意匠コード（デザインの特徴を手作業で注釈したラベル）に依存しているため、そのテキストベースの性質によって深い欠陥もある。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/image_8_b2fff6ca11.png" alt="8.png" class="doc-image" id="8.png" />
   </span> <span class="img-wrapper"> <span>8.png</span> </span></p>
<p>そこで本稿では、オープンソースのベクターデータベースである<a href="https://milvus.io">Milvusを用いて</a>、画像ベースの効率的な商標類似検索システムを構築する方法を紹介する。</p>
<h2 id="A-vector-similarity-search-system-for-trademarks" class="common-anchor-header">商標のベクトル類似検索システム<button data-href="#A-vector-similarity-search-system-for-trademarks" class="anchor-icon" translate="no">
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
    </button></h2><p>商標のベクトル類似検索システムを構築するには、以下のステップを踏む必要がある：</p>
<ol>
<li>膨大なロゴのデータセットを用意する。このよう<a href="https://developer.uspto.gov/product/trademark-24-hour-box-and-supplemental">な</a>データセットを使うことができる。）</li>
<li>データセットとデータ駆動型モデルまたはAIアルゴリズムを使って画像特徴抽出モデルをトレーニングする。</li>
<li>ステップ2で学習したモデルやアルゴリズムを使って、ロゴをベクトルに変換する。</li>
<li>ベクトルを保存し、オープンソースのベクトルデータベースMilvusでベクトルの類似性検索を行う。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/trademark_system_e9700df555.png" alt="Nike.png" class="doc-image" id="nike.png" />
   </span> <span class="img-wrapper"> <span>Nike.png</span> </span></p>
<p>以下では、商標のベクトル類似検索システムを構築するための2つの主要ステップ、すなわち画像特徴抽出にAIモデルを使用するステップと、ベクトル類似検索にMilvusを使用するステップについて詳しく見ていきましょう。我々の場合、CNN（畳み込みニューラルネットワーク）であるVGG16を用いて画像特徴を抽出し、埋め込みベクトルに変換している。</p>
<h3 id="Using-VGG16-for-image-feature-extraction" class="common-anchor-header">画像特徴抽出にVGG16を使用</h3><p><a href="https://medium.com/@mygreatlearning/what-is-vgg16-introduction-to-vgg16-f2d63849f615">VGG16は</a>大規模な画像認識のために設計されたCNNである。このモデルは画像認識において迅速かつ正確で、あらゆるサイズの画像に適用できます。以下はVGG16アーキテクチャの2つの図である。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vgg16_layers_9e621f62cc.png" alt="9.png" class="doc-image" id="9.png" />
   </span> <span class="img-wrapper"> <span>9.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/vgg16_architecture_992614e882.png" alt="10.png" class="doc-image" id="10.png" />
   </span> <span class="img-wrapper"> <span>10.png</span> </span></p>
<p>VGG16モデルはその名の通り、16層のCNNである。VGG16とVGG19を含むすべてのVGGモデルは5つのVGGブロックを含み、各VGGブロックには1つ以上の畳み込み層がある。そして各ブロックの最後には、入力画像のサイズを小さくするための最大プーリング層が接続されている。カーネルの数は各畳み込み層内では等しいが、各VGGブロック内では2倍になる。したがって、モデルのカーネル数は最初のブロックの64から、4番目と5番目のブロックの512まで増加する。すべての畳み込みカーネルは<em>33サイズだが、プーリングカーネルはすべて22サイズである</em>。これは入力画像に関するより多くの情報を保存するのに適している。</p>
<p>したがって、VGG16はこの場合、膨大なデータセットの画像認識に適したモデルである。Python、Tensorflow、Kerasを使って、VGG16をベースに画像特徴抽出モデルを学習することができる。</p>
<h3 id="Using-Milvus-for-vector-similarity-search" class="common-anchor-header">Milvusをベクトル類似度検索に使う</h3><p>VGG16モデルを使って画像特徴を抽出し、ロゴ画像を埋め込みベクトルに変換したら、膨大なデータセットから類似ベクトルを検索する必要がある。</p>
<p>Milvusは、高いスケーラビリティと弾力性を特徴とするクラウドネイティブなデータベースです。また、データベースとしてデータの一貫性を保つことができます。このような商標の類似検索システムでは、最新の商標登録のような新しいデータがリアルタイムでシステムにアップロードされます。そして、これらの新しくアップロードされたデータは、即座に検索可能である必要がある。そこで本稿では、オープンソースのベクターデータベースであるMilvusを採用し、ベクター類似検索を行う。</p>
<p>ロゴベクターを挿入する際、商標登録のための商品・サービスの分類システムである<a href="https://en.wikipedia.org/wiki/International_(Nice)_Classification_of_Goods_and_Services">国際（ニース）商品・サービス分類に従って</a>、Milvusにロゴベクターの種類別のコレクションを作成することができます。例えば、洋服ブランドのロゴベクター群をMilvusの「洋服」という名前のコレクションに挿入し、技術ブランドのロゴベクター群を「技術」という名前の別のコレクションに挿入することができます。そうすることで、ベクトル類似検索の効率と速度を大幅に向上させることができます。</p>
<p>Milvusはベクトル類似検索のための複数のインデックスをサポートしているだけでなく、豊富なAPIとDevOpsを促進するためのツールも提供しています。以下の図は、<a href="https://milvus.io/docs/v2.0.x/architecture_overview.md">Milvusのアーキテクチャの</a>説明図です。Milvusの詳細については、Milvusの<a href="https://milvus.io/docs/v2.0.x/overview.md">紹介を</a>ご覧ください。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_architecture_ea45a5ab53.png" alt="11.png" class="doc-image" id="11.png" />
   </span> <span class="img-wrapper"> <span>11.png</span> </span></p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">より多くのリソースをお探しですか？<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
<li><p>Milvusを使用して、他のアプリケーションシナリオ用のベクトル類似性検索システムを構築してください：</p>
<ul>
<li><a href="https://milvus.io/blog/dna-sequence-classification-based-on-milvus.md">Milvusに基づくDNA配列分類</a></li>
<li><a href="https://milvus.io/blog/audio-retrieval-based-on-milvus.md">Milvusに基づく音声検索</a></li>
<li><a href="https://milvus.io/blog/building-video-search-system-with-milvus.md">ビデオ検索システム構築の4ステップ</a></li>
<li><a href="https://milvus.io/blog/building-intelligent-chatbot-with-nlp-and-milvus.md">NLPとMilvusによるインテリジェントQAシステムの構築</a></li>
<li><a href="https://milvus.io/blog/molecular-structure-similarity-with-milvus.md">新薬の発見を加速する</a></li>
</ul></li>
<li><p>オープンソースコミュニティ</p>
<ul>
<li><a href="https://bit.ly/307b7jC">GitHubで</a>Milvusを見つけ、貢献する。</li>
<li><a href="https://bit.ly/3qiyTEk">フォーラムで</a>コミュニティと交流する。</li>
<li><a href="https://bit.ly/3ob7kd8">Twitterで</a>つながる。</li>
</ul></li>
</ul>
