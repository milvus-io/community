---
id: optimizing-billion-scale-image-search-milvus-part-2.md
title: 第二世代の画像検索システム
author: Rife Wang
date: 2020-08-11T22:20:27.855Z
desc: Milvusを活用し、実ビジネスのための画像類似検索システムを構築したユーザー事例。
cover: assets.zilliz.com/header_c73631b1e7.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-2'
---
<custom-h1>億規模の画像検索を最適化する旅 (2/2)</custom-h1><p>この記事は、<strong>UPYUNによる「億規模の画像検索を最適化する旅</strong>」の後編です。前編を見逃した方は<a href="https://zilliz.com/blog/optimizing-billion-scale-image-search-milvus-part-1">こちらを</a>ご覧ください。</p>
<h2 id="The-second-generation-search-by-image-system" class="common-anchor-header">第二世代の画像検索システム<button data-href="#The-second-generation-search-by-image-system" class="anchor-icon" translate="no">
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
    </button></h2><p>第二世代の画像検索システムは、技術的にはCNN＋milvusソリューションを採用している。このシステムは特徴ベクトルに基づいており、より優れた技術サポートを提供します。</p>
<h2 id="Feature-extraction" class="common-anchor-header">特徴抽出<button data-href="#Feature-extraction" class="anchor-icon" translate="no">
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
    </button></h2><p>コンピュータビジョンの分野では、人工知能の利用が主流となっている。第2世代画像検索システムの特徴抽出も同様に、CNN（畳み込みニューラルネットワーク）を基盤技術としている。</p>
<p>CNNという言葉を理解するのは難しい。ここでは2つの質問に答えることに焦点を当てる：</p>
<ul>
<li>CNNは何ができるのか？</li>
<li>なぜ画像検索にCNNが使えるのか？</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_meme_649be6dfe8.jpg" alt="1-meme.jpg" class="doc-image" id="1-meme.jpg" />
   </span> <span class="img-wrapper"> <span>1-meme.jpg</span> </span></p>
<p>AI分野には多くの競技があり、画像分類は最も重要な競技の一つである。画像分類の仕事は、写真の内容が猫なのか、犬なのか、リンゴなのか、梨なのか、あるいは他の種類の物体なのかを判断することである。</p>
<p>CNNは何ができるのか？CNNは特徴を抽出し、物体を認識することができる。多次元から特徴を抽出し、画像の特徴が猫や犬の特徴にどれだけ近いかを測定する。最も近いものを識別結果として選択することで、特定の画像の内容が猫なのか犬なのか、あるいはそれ以外のものなのかを示すことができる。</p>
<p>CNNの物体識別機能と画像による検索の関係は？我々が欲しいのは、最終的な識別結果ではなく、多次元から抽出された特徴ベクトルである。似たような内容の2つの画像の特徴ベクトルは近くないといけない。</p>
<h3 id="Which-CNN-model-should-I-use" class="common-anchor-header">どのCNNモデルを使うべきか？</h3><p>答えはVGG16だ。なぜそれを選ぶのか？第一に、VGG16は汎化能力が高い、つまり汎用性が高い。第二に、VGG16によって抽出される特徴ベクトルは512次元である。次元数が少ないと精度に影響が出る。次元数が多すぎる場合、これらの特徴ベクトルの保存と計算のコストが相対的に高くなる。</p>
<p>画像の特徴を抽出するためにCNNを使用することは、主流のソリューションである。モデルにはVGG16を、技術的な実装にはKeras + TensorFlowを使うことができる。以下はKerasの公式サンプルである：</p>
<pre><code translate="no">from keras.applications.vgg16 import VGG16
from keras.preprocessing import image
from keras.applications.vgg16 import preprocess_input
import numpy as np
model = VGG16(weights=’imagenet’, include_top=False)
img_path = ‘elephant.jpg’
img = image.load_img(img_path, target_size=(224, 224))
x = image.img_to_array(img)
x = np.expand_dims(x, axis=0)
x = preprocess_input(x)
features = model.predict(x)
</code></pre>
<p>ここで抽出される特徴は特徴ベクトルである。</p>
<h3 id="1-Normalization" class="common-anchor-header">1.正規化</h3><p>後続の処理を容易にするために、特徴量を正規化することがよくある：</p>
<p>その後に使われるのも、正規化された<code translate="no">norm_feat</code> 。</p>
<h3 id="2-Image-description" class="common-anchor-header">2.画像の記述</h3><p>画像は<code translate="no">keras.preprocessing</code> の<code translate="no">image.load_img</code> メソッドを使って読み込まれる：</p>
<pre><code translate="no">from keras.preprocessing import image
img_path = 'elephant.jpg'
img = image.load_img(img_path, target_size=(224, 224))
</code></pre>
<p>実際には、Kerasから呼び出されるTensorFlowメソッドである。詳細はTensorFlowのドキュメントを参照。最終的な画像オブジェクトは、実際にはPIL Imageインスタンス（TensorFlowが使用するPIL）である。</p>
<h3 id="3-Bytes-conversion" class="common-anchor-header">3.バイト変換</h3><p>現実的には、画像コンテンツはネットワークを通じて送信されることが多い。そのため、パスから画像を読み込むのではなく、バイトデータを直接画像オブジェクト、つまりPIL Imageに変換することを好む：</p>
<pre><code translate="no">import io
from PIL import Image

# img_bytes: 图片内容 bytes
img = Image.open(io.BytesIO(img_bytes))
img = img.convert('RGB')

img = img.resize((224, 224), Image.NEAREST)
</code></pre>
<p>上記のimgは、image.load_imgメソッドで得られた結果と同じです。注意すべき点が2つあります：</p>
<ul>
<li>RGB変換をしなければならない。</li>
<li>リサイズが必要です（リサイズは<code translate="no">load_img method</code> の2番目のパラメータです）。</li>
</ul>
<h3 id="4-Black-border-processing" class="common-anchor-header">4.黒枠処理</h3><p>スクリーンショットのような画像には、時折黒い縁取りがあることがあります。これらの黒枠は実用的な価値はなく、多くの干渉を引き起こします。このため、黒枠を除去することも一般的に行われています。</p>
<p>黒枠とは本質的に、すべてのピクセルが(0, 0, 0)（RGB画像）であるピクセルの行または列のことです。黒枠を削除するには、これらの行または列を見つけ、それらを削除します。これは実際にはNumPyの3次元行列の乗算である。</p>
<p>水平方向の黒枠を削除する例：</p>
<pre><code translate="no"># -*- coding: utf-8 -*-
import numpy as np
from keras.preprocessing import image
def RemoveBlackEdge(img):
Args:
       img: PIL image instance
Returns:
       PIL image instance
&quot;&quot;&quot;
   width = img.width
   img = image.img_to_array(img)
   img_without_black = img[~np.all(img == np.zeros((1, width, 3), np.uint8), axis=(1, 2))]
   img = image.array_to_img(img_without_black)
return img
</code></pre>
<p>これが、CNNを使って画像の特徴を抽出し、その他の画像処理を実装することについてお話ししたいことの大部分です。次にベクトル検索エンジンを見てみよう。</p>
<h2 id="Vector-search-engine" class="common-anchor-header">ベクトル検索エンジン<button data-href="#Vector-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>画像から特徴ベクトルを抽出する問題は解決した。となると、残る問題は</p>
<ul>
<li>特徴ベクトルをどのように保存するか？</li>
<li>オープンソースのベクトル検索エンジンmilvusは、この2つの問題を解決することができる。これまでのところ、私たちの本番環境ではうまく動作している。</li>
</ul>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_milvus_logo_3a7411f2c8.png" alt="3-milvus-logo.png" class="doc-image" id="3-milvus-logo.png" />
   </span> <span class="img-wrapper"> <span>3-milvus-logo.png</span> </span></p>
<h2 id="Milvus-the-vector-search-engine" class="common-anchor-header">ベクトル検索エンジンMilvus<button data-href="#Milvus-the-vector-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>画像から特徴ベクトルを抽出するだけでは十分ではない。また、これらの特徴ベクトルを動的に管理（追加、削除、更新）し、ベクトルの類似度を計算し、最近傍範囲のベクトルデータを返す必要があります。オープンソースのベクトル検索エンジンMilvusは、これらのタスクを非常にうまくこなします。</p>
<p>この後は、具体的な実践方法と注意点について説明する。</p>
<h3 id="1-Requirements-for-CPU" class="common-anchor-header">1.CPUの要件</h3><p>Milvusを使用するには、CPUがavx2命令セットをサポートしている必要がある。Linuxシステムの場合、以下のコマンドでCPUがサポートしている命令セットを確認する：</p>
<p><code translate="no">cat /proc/cpuinfo | grep flags</code></p>
<p>すると、次のような結果が得られます：</p>
<pre><code translate="no">flags           : fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 clflush dts acpi mmx fxsr sse sse2 ss ht tm pbe syscall nx pdpe1gb         rdtscp lm constant_tsc arch_perfmon pebs bts rep_good nopl xtopology nonstop_tsc cpuid aperfmperf pni pclmulqdq dtes64 monitor ds_cpl vmx smx est tm2     ssse3 sdbg fma cx16 xtpr pdcm pcid dca sse4_1 sse4_2 x2apic movbe popcnt aes xsave avx f16c rdrand lahf_lm abm cpuid_fault epb invpcid_single pti intel_ppin tpr_shadow vnmi flexpriority ept vpid ept_ad fsgsbase tsc_adjust bmi1 avx2 smep bmi2 erms invpcid cqm xsaveopt cqm_llc cqm_occup_llc dtherm ida arat pln pts
</code></pre>
<p>flagsの後に続くのは、あなたのCPUがサポートしている命令セットです。もちろん、これらは私が必要とするものよりもずっと多い。私が知りたいのは、avx2のような特定の命令セットがサポートされているかどうかだけだ。それをフィルタリングするためにgrepを追加するだけだ：</p>
<pre><code translate="no">cat /proc/cpuinfo | grep flags | grep avx2
</code></pre>
<p>結果が返らない場合は、その特定の命令セットがサポートされていないことを意味する。その場合、マシンを変更する必要がある。</p>
<h3 id="2-Capacity-planning" class="common-anchor-header">2.容量計画</h3><p>キャパシティ・プランニングは、システムを設計する際に最初に検討することである。どれだけのデータを保存する必要があるのか？そのデータが必要とするメモリとディスクの容量は？</p>
<p>簡単な計算をしてみよう。ベクトルの各次元はfloat32である。float32型は4バイトを占有する。すると、512次元のベクトルには2KBのストレージが必要です。同じことだ：</p>
<ul>
<li>1000個の512次元ベクトルには2MBのストレージが必要です。</li>
<li>100万個の512次元ベクトルには2GBのストレージが必要です。</li>
<li>1000万個の512次元ベクトルには20GBのストレージが必要です。</li>
<li>1億個の512次元ベクトルは200GBのストレージを必要とする。</li>
<li>10億個の512次元ベクトルは2TBのストレージを必要とする。</li>
</ul>
<p>もしすべてのデータをメモリに保存したいのであれば、システムには少なくとも対応するメモリ容量が必要になる。</p>
<p>公式のサイズ計算ツールを使用することをお勧めします：Milvusサイジングツール。</p>
<p>実際にはメモリはそれほど大きくないかもしれません（メモリが足りなくても問題はありません）。Milvusは自動的にデータをディスクにフラッシュします)。元のベクトルデータに加えて、ログなど他のデータの保存も考慮する必要があります。</p>
<h3 id="3-System-configuration" class="common-anchor-header">3.システム構成</h3><p>システム構成については、Milvusのドキュメントを参照してください：</p>
<ul>
<li>Milvusサーバ構成: https://milvus.io/docs/v0.10.1/milvus_config.md を参照。</li>
</ul>
<h3 id="4-Database-design" class="common-anchor-header">4.データベース設計</h3><p><strong>コレクションとパーティション</strong></p>
<ul>
<li>コレクションはテーブルとも呼ばれる。</li>
<li>パーティションはコレクション内のパーティションを指す。</li>
</ul>
<p>パーティションの基本的な実装はコレクションと同じだが、パーティションはコレクションの下にある。しかし、パーティションを使うことで、データの構成がより柔軟になります。また、コレクション内の特定のパーティションをクエリすることで、よりよいクエリ結果を得ることができます。</p>
<p>コレクションとパーティションの数は？コレクションとパーティションの基本情報はメタデータにあります。Milvusは内部のメタデータ管理にSQLite（Milvus内部統合）またはMySQL（外部接続が必要）を使用します。デフォルトでSQLiteを使用してメタデータを管理する場合、コレクションとパーティションの数が多すぎるとパフォーマンスが著しく低下します。そのため、コレクション数とパーティション数の合計が50,000を超えないようにしてください（Milvus 0.8.0では4,096に制限されています）。それ以上の数を設定する必要がある場合は、外部接続経由でMySQLを使用することをお勧めします。</p>
<p>Milvusのコレクションとパーティションがサポートするデータ構造は非常にシンプルで、<code translate="no">ID + vector</code> 。つまり、テーブルには2つの列しかない：IDとベクトルデータである。</p>
<p><strong>注意：</strong></p>
<ul>
<li>IDは整数でなければならない。</li>
<li>IDはパーティション内ではなく、コレクション内で一意であることを保証する必要がある。</li>
</ul>
<p><strong>条件付きフィルタリング</strong></p>
<p>従来のデータベースを使用する場合、フィールド値をフィルタリング条件として指定することができます。Milvusは全く同じ方法でフィルタリングを行うわけではありませんが、コレクションとパーティションを使って簡単な条件付きフィルタリングを実装することができます。例えば、大量の画像データがあり、そのデータが特定のユーザのものであったとします。その場合、データをユーザーごとにパーティションに分けることができる。したがって、フィルター条件としてユーザーを使うことは、実際にはパーティションを指定することになる。</p>
<p><strong>構造化データとベクトルマッピング</strong></p>
<p>MilvusはID+ベクトルデータ構造しかサポートしていません。しかし、ビジネスシナリオにおいて必要なのは、ビジネス上の意味を持つ構造化データである。つまり、ベクトルを通して構造化データを見つける必要がある。従って、IDを通して構造化データとベクトルのマッピング関係を維持する必要があります。</p>
<pre><code translate="no">structured data ID &lt;--&gt; mapping table &lt;--&gt; Milvus ID
</code></pre>
<p><strong>インデックスの選択</strong></p>
<p>以下の記事を参照されたい：</p>
<ul>
<li>インデックスの種類: https://www.milvus.io/docs/v0.10.1/index.md</li>
<li>インデックスの選択方法: https://medium.com/@milvusio/how-to-choose-an-index-in-milvus-4f3d15259212</li>
</ul>
<h3 id="5-Processing-search-results" class="common-anchor-header">5.検索結果の処理</h3><p>Milvusの検索結果は、ID+距離の集合である：</p>
<ul>
<li>ID：コレクション内のID。</li>
<li>距離：0～1の距離値は類似度を示し、値が小さいほど2つのベクトルは類似している。</li>
</ul>
<p><strong>IDが-1のデータのフィルタリング</strong></p>
<p>コレクションの数が少なすぎる場合、検索結果にIDが-1のデータが含まれることがある。そのようなデータは自分でフィルタリングする必要があります。</p>
<p><strong>ページネーション</strong></p>
<p>ベクトルの検索はまったく異なります。クエリ結果は類似度の降順にソートされ、最も類似した（topK）結果が選択されます（topKはクエリ時にユーザが指定します）。</p>
<p>milvusはページ分割をサポートしていない。ページネーション機能が必要な場合は、自前で実装する必要がある。例えば、各ページに10件の結果があり、3ページ目だけを表示したい場合、topK = 30と指定し、最後の10件だけを返す必要があります。</p>
<p><strong>ビジネスにおける類似度のしきい値</strong></p>
<p>2つの画像のベクトル間の距離は0から1の間です。特定のビジネスシナリオで2つの画像が類似しているかどうかを判断したい場合、この範囲内で閾値を指定する必要があります。距離がしきい値より小さければ2つの画像は似ており、距離がしきい値より大きければ2つの画像はかなり異なっています。閾値は自分のビジネスニーズに合わせて調整する必要がある。</p>
<blockquote>
<p>この記事はMilvusユーザーでUPYUNのソフトウェアエンジニアであるrifewangによって書かれました。この記事が気に入ったら、https://github.com/rifewang。</p>
</blockquote>
