---
id: >-
  build-a-bestseller-to-image-pipeline-for-e-commerce-with-nano-banana-2-milvus-qwen-35.md
title: Nano Banana 2 + Milvus + Qwen 3.5でEコマースのためのベストセラーから画像へのパイプラインを構築する
author: Lumina Wang
date: 2026-3-3
cover: assets.zilliz.com/blog-images/20260303-100432.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: >-
  Nano Banana 2, Milvus, e-commerce AI image generation, AI product photography,
  vector search
meta_keywords: >-
  Nano Banana 2, Milvus, e-commerce AI image generation, AI product photography,
  vector search
meta_title: |
  Nano Banana 2 + Milvus: E-Commerce AI Image Generation Tutorial
desc: >-
  ステップバイステップのチュートリアル： Nano Banana 2、Milvusハイブリッド検索、Qwen
  3.5を使用して、1/3のコストでフラットレイからeコマース商品写真を生成。
origin: >-
  https://milvus.io/blog/build-a-bestseller-to-image-pipeline-for-e-commerce-with-nano-banana-2-milvus-qwen-35.md
---
<p>eコマース販売者向けのAIツールを構築しているのであれば、このような要望を何度も耳にしたことがあるだろう：「新製品があります。ベストセラーに載るようなプロモーション画像をください。カメラマンもスタジオも使わず、安く作ってくれ」。</p>
<p>一言で言えば、これが問題なのだ。売り手は、平積みの写真と、すでにコンバージョンしているベストセラーのカタログを持っている。この2つをAIで高速かつ大規模に橋渡ししたいのだ。</p>
<p>Googleが2026年2月26日にNano Banana 2（Gemini 3.1 Flash Image）をリリースしたとき、私たちは同じ日にそれをテストし、既存のmilvusベースの検索パイプラインに統合した。その結果、画像生成の総コストは以前のおよそ3分の1に下がり、スループットは2倍になった。画像単価の引き下げ（Nano Banana Proより約50％安い）もその一因ですが、それ以上に大きな節約は、手直しサイクルを完全になくしたことによるものです。</p>
<p>本記事では、Nano Banana 2がeコマースでうまくいっている点、まだ不十分な点、そしてパイプライン全体のハンズオンチュートリアルを紹介する：<strong>Milvus</strong>ハイブリッド検索による視覚的に類似したベストセラーの検索、<strong>Qwen</strong>3.5によるスタイル分析、そして<strong>Nano Banana 2による</strong>最終生成です。</p>
<h2 id="What’s-New-with-Nano-Banana-2" class="common-anchor-header">Nano Banana 2の新機能<button data-href="#What’s-New-with-Nano-Banana-2" class="anchor-icon" translate="no">
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
    </button></h2><p>ナノ・バナナ2（Gemini 3.1 Flash Image）は2026年2月26日に発売されました。ナノ・バナナ・プロのほとんどの機能がフラッシュ・アーキテクチャに搭載され、より低価格でより高速な生成が可能になりました。主なアップグレードは以下の通り：</p>
<ul>
<li><strong>プロレベルの品質をFlashのスピードで。</strong>Nano Banana 2は、これまでPro専用だった世界クラスの知識、推論、ビジュアルの忠実性を、Flashのレイテンシーとスループットで実現します。</li>
<li><strong>512pxから4K出力。</strong>4つの解像度ティア（512px、1K、2K、4K）をネイティブ・サポート。512pxの階層はNano Banana 2独自の新しいものです。</li>
<li><strong>14種類のアスペクト比。</strong>既存のセット（1:1、2:3、3:2、3:4、4:3、4:5、5:4、9:16、16:9、21:9）に4:1、1:4、8:1、1:8を追加。</li>
<li><strong>最大14枚の参照画像。</strong>1つのワークフローで、最大5つのキャラクタのキャラクタ類似性と最大14のオブジェクトのオブジェクト忠実性を維持。</li>
<li><strong>テキストレンダリングの向上。</strong>1回の生成で翻訳とローカリゼーションをサポートし、複数の言語で読みやすく正確な画像内テキストを生成します。</li>
<li><strong>画像検索の基盤。</strong>Google検索からリアルタイムのウェブデータと画像を取得し、実世界の被写体のより正確な描写を生成します。</li>
<li><strong>~画像1枚あたり～50%低価格。</strong>1K解像度で：<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>0.067versusPro</mn><mi>′</mi><mn>s0</mn></mrow><annotation encoding="application/x-tex">.067対Proの</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7519em;"></span><span class="mord"></span></span></span></span>0<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.067</span><span class="mord"><span class="mord mathnormal">versusPro</span><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.7519em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">′</span></span></span></span></span></span></span></span></span><span class="mord mathnormal">s</span><span class="mord"><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.7519em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight">0</span></span></span></span></span></span></span></span></span></span></span></span>.134。</li>
</ul>
<p><strong>ナノ・バナノの楽しい使用例2：シンプルなGoogleマップのスクリーンショットに基づく位置認識パノラマの生成</strong></p>
<p>Googleマップのスクリーンショットとスタイルプロンプトが与えられると、モデルは地理的なコンテキストを認識し、正しい空間関係を保持したパノラマを生成します。ストックフォトを調達することなく、地域をターゲットにした広告クリエイティブ（パリのカフェの背景や東京の街並み）を制作するのに便利です。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image5.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>


  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>全機能については、<a href="https://blog.google/innovation-and-ai/technology/ai/nano-banana-2/">Googleの発表ブログと</a> <a href="https://ai.google.dev/gemini-api/docs/image-generation">開発者向けドキュメントを</a>参照のこと。</p>
<h2 id="What-Does-This-Nano-Banana-Update-Mean-For-E-Commerce" class="common-anchor-header">ナノ・バナナのアップデートはEコマースに何をもたらすか？<button data-href="#What-Does-This-Nano-Banana-Update-Mean-For-E-Commerce" class="anchor-icon" translate="no">
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
    </button></h2><p>Eコマースは、最も画像を多用する業界のひとつです。商品リスト、マーケットプレイス広告、ソーシャル・クリエイティブ、バナー・キャンペーン、ローカライズされた店頭......あらゆるチャネルで、それぞれ独自の仕様のビジュアル・アセットが絶え間なく要求される。</p>
<p>EコマースにおけるAI画像生成の主な要件は、以下のとおりです：</p>
<ul>
<li><strong>コストを低く抑える</strong>- 画像1枚あたりのコストは、カタログ規模で機能するものでなければならない。</li>
<li><strong>実績のあるベストセラーのルックに合わせる</strong>- 新しい画像は、すでにコンバージョンしているリストのビジュアルスタイルに合わせる。</li>
<li><strong>侵害を避ける</strong>- 競合他社のクリエイティブをコピーしたり、保護された資産を再利用したりしない。</li>
</ul>
<p>その上で、国境を越えたセラーには以下が必要です：</p>
<ul>
<li><strong>マルチプラットフォームフォーマットのサポート</strong>- マーケットプレイス、広告、店頭で異なるアスペクト比と仕様。</li>
<li><strong>多言語テキストレンダリング</strong>- 複数の言語に対応したクリーンで正確な画像内テキスト。</li>
</ul>
<p>Nano Banana 2は、全ての項目に対応しています。以下のセクションでは、各アップグレードが実際にどのような意味を持つのか、つまり、Eコマースのペインポイントを直接解決する部分、不足する部分、実際のコストへの影響について説明します。</p>
<h3 id="Cut-Output-Generation-Costs-by-Up-to-60" class="common-anchor-header">出力生成コストを最大60%削減</h3><p>1K解像度の場合、Nano Banana 2の<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">1画像</annotation></semantics></math></span></span>あたりのコストは、<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">Proの</span><span class="strut" style="height:0.9463em;vertical-align:-0.1944em;"></span><span class="mord"></span></span></span></span>0.<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="mord mathnormal">067</span></span></span></span><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mi>perimageversusProの</mi><mn>0</mn></mrow><annotation encoding="application/x-tex">.067に対し、</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord"><span class="msupsub"><span class="vlist-t"><span class="vlist-r"><span class="vlist" style="height:0.7519em;"><span style="top:-3.063em;margin-right:0.05em;"><span class="pstrut" style="height:2.7em;"></span><span class="sizing reset-size6 size3 mtight"><span class="mord mtight"><span class="mord mtight"></span></span></span></span></span></span></span></span></span><span class="mord mathnormal">0</span></span></span></span>.134となり、実に50％の削減となります。しかし、画像単価は話の半分に過ぎない。かつてユーザーの予算を奪っていたのは手直しだった。各マーケットプレイスは独自の画像仕様（Amazonでは1:1、Shopifyの店頭では3:4、バナー広告ではウルトラワイド）を強制しており、各バリアントを生産することは、独自の失敗モードを持つ個別の世代パスを意味した。</p>
<p>Nano Banana 2は、これらの余分なパスを1つにまとめました。</p>
<ul>
<li><p><strong>4つのネイティブ解像度</strong></p></li>
<li><p>512ピクセル（0.045ドル）</p></li>
<li><p>1K ($0.067)</p></li>
<li><p>2K ($0.101)</p></li>
<li><p>4K ($0.151).</p></li>
</ul>
<p>512pxの階層は新しく、Nano Banana 2独自のものです。ユーザーは、反復のために低コストの512pxドラフトを生成し、別のアップスケーリングステップなしで2Kまたは4Kで最終アセットを出力できるようになりました。</p>
<ul>
<li><p>合計<strong>14のアスペクト比をサポート</strong>。以下はその例です：</p></li>
<li><p>4:1</p></li>
<li><p>1:4</p></li>
<li><p>8:1</p></li>
<li><p>1:8</p></li>
</ul>
<p>これらの新しいウルトラワイドとウルトラタールの比率は、既存のセットに加わります。一世代のセッションで、次のようなさまざまなフォーマットを作成できます：<strong>アマゾンのメイン画像</strong>（1:1）、<strong>ストアフロントのヒーロー</strong>（3:4）、<strong>バナー広告</strong>（ウルトラワイドまたはその他の比率）。</p>
<p>これらの4つのアスペクト比では、トリミング、パディング、再プロンプトは必要ありません。残りの10種類のアスペクト比はフルセットに含まれており、異なるプラットフォーム間でより柔軟な処理が可能です。</p>
<p>画像1枚あたり～50％の節約だけで、請求額は半分にしかなりません。解像度とアスペクト比にまたがる手直しをなくしたことで、総コストは以前のおよそ3分の1になりました。</p>
<h3 id="Support-Up-to-14-Reference-Images-with-Bestseller-Style" class="common-anchor-header">ベストセラースタイルで最大14枚のリファレンス画像をサポート</h3><p>Nano Banana 2のアップデートの中で、マルチ・リファレンス・ブレンドはMilvusのパイプラインに最も大きな影響を与えました。Nano Banana 2は、1つのリクエストで最大14の参照画像を受け入れ、以下のことを維持します：</p>
<ul>
<li>最大<strong>5</strong>文字までの文字類似性</li>
<li>最大<strong>14個の</strong>オブジェクトの忠実度</li>
</ul>
<p>実際には、Milvusから複数のベストセラー画像を取得し、それらを参照画像として渡すと、生成された画像はそれらのシーン構成、照明、ポージング、小道具の配置を継承しました。これらのパターンを手作業で再構築するための迅速なエンジニアリングは必要なかった。</p>
<p>以前のモデルでは、1つか2つのリファレンスしかサポートしていなかったため、ユーザーは真似するベストセラーを1つ選ぶしかなかった。14のリファレンス・スロットがあれば、複数のトップ・パフォーマンスのリストからの特徴をブレンドし、モデルに複合的なスタイルを合成させることができる。これが、以下のチュートリアルの検索ベースのパイプラインを可能にする能力である。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image15.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Produce-Premium-Commercial-Ready-Visuals-Without-Traditional-Production-Cost-or-Logistics" class="common-anchor-header">従来の制作コストやロジスティックスなしで、プレミアムで商用に適したビジュアルを制作</h3><p>一貫性のある信頼性の高い画像生成のためには、すべての要件を単一のプロンプトにダンプすることは避けてください。より信頼性の高いアプローチは、段階的に作業することです。まず背景を生成し、次にモデルを別々に生成し、最後にそれらを合成します。</p>
<p>ナノ・バナナの3つのモデルすべてで、同じプロンプトを使って背景生成のテストを行いました：東方明珠タワーが見える、窓から見た4:1の超広角の雨の日の上海のスカイラインです。このプロンプトでは、構図、建築のディテール、フォトリアリズムが一度にテストされます。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h4 id="Original-Nano-Banana-vs-Nano-Banana-Pro-vs-Nano-Banana-2" class="common-anchor-header">オリジナルNano Banana vs. Nano Banana Pro vs. Nano Banana 2</h4><ul>
<li><strong>オリジナルのナノバナナ。</strong>自然な雨のテクスチャで、水滴の分布もよく再現されているが、建物のディテールが滑らかになりすぎている。オリエンタルパールタワーはほとんど認識できず、解像度は制作要件に満たない。</li>
<li><strong>ナノ・バナナPro。</strong>映画のような雰囲気：暖かい室内照明が冷たい雨に説得力を与えている。しかし、窓枠が完全に省略され、画像の奥行き感が平坦になった。ヒーローではなく、脇役として使える。</li>
<li><strong>ナノバナナ2。</strong>シーン全体をレンダリング。手前の窓枠が奥行きを生み出している。東方明珠塔のディテールがはっきりした。黄浦江に浮かぶ船。レイヤーを重ねたライティングは、室内の暖かさと外部の曇りを区別した。雨と水垢のテクスチャは写真に近く、4:1の超広角比率は、左の窓の端にわずかな歪みがあるだけで、正しい遠近感を保っていた。</li>
</ul>
<p>商品撮影におけるほとんどの背景生成タスクにおいて、ナノ・バナナ2の出力は後処理なしで使用できることが分かった。</p>
<h3 id="Render-In-Image-Text-Cleanly-Across-Languages" class="common-anchor-header">言語を超えて画像内テキストをきれいにレンダリング</h3><p>値札、宣伝バナー、多言語コピーはEコマース画像では避けられないもので、これまでAI生成の限界点でした。ナノ・バナナ2では、これらの処理が大幅に改善され、多言語にわたる画像内テキストのレンダリングをサポートし、翻訳とローカリゼーションを1つの世代で行うことができます。</p>
<p><strong>標準的なテキストレンダリング。</strong>私たちのテストでは、価格ラベル、短いマーケティングタグライン、バイリンガルの商品説明など、私たちが試したすべてのeコマースフォーマットでテキスト出力にエラーはありませんでした。</p>
<p><strong>手書きの継続。</strong>eコマースでは、値札や名入れカードのような手書きの要素が必要とされることが多いため、既存の手書きスタイルにマッチさせ、それを拡張することができるかどうかをテストしました。3つのモデルの結果</p>
<ul>
<li><strong>オリジナルのナノ・バナナ。</strong>繰り返される連番、誤解された構造。</li>
<li><strong>ナノ・バナナ・プロ。</strong>レイアウトは正しいが、フォントスタイルの再現性が低い。</li>
<li><strong>ナノ・バナナ2。</strong>エラーゼロ。ストロークの太さと字形がソースと見分けがつかないほど忠実に一致。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image12.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>ただし、</strong>Googleのドキュメントによると、Nano Banana 2は「正確なスペルや画像の細かいディテールに苦労することがある」とのこと。私たちがテストした結果は、どのフォーマットでもきれいでしたが、どのような制作ワークフローにも、公開前のテキスト検証ステップを含めるべきです。</p>
<h2 id="Step-by-Step-Tutorial-Build-a-Bestseller-to-Image-Pipeline-with-Milvus-Qwen-35-and-Nano-Banana-2" class="common-anchor-header">ステップバイステップのチュートリアルMilvus、Qwen 3.5、Nano Banana 2を使ったベストセラーから画像へのパイプラインの構築<button data-href="#Step-by-Step-Tutorial-Build-a-Bestseller-to-Image-Pipeline-with-Milvus-Qwen-35-and-Nano-Banana-2" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Before-we-begin-Architecture-and-Model-Setup" class="common-anchor-header">始める前にアーキテクチャとモデルのセットアップ</h3><p>単一プロンプト生成のランダム性を避けるため、プロセスを制御可能な3つの段階に分けます：<strong>Milvus</strong>ハイブリッド検索ですでに機能しているものを取得し、<strong>Qwen 3.5で</strong>それが機能している理由を分析し、<strong>Nano Banana 2で</strong>それらの制約を組み込んだ最終画像を生成します。</p>
<p>各ツールを使ったことがない方のために、各ツールについて簡単に説明します：</p>
<ul>
<li><strong><a href="https://milvus.io/">Milvus</a></strong><a href="https://milvus.io/">:</a>最も広く採用されているオープンソースのベクターデータベース。商品カタログをベクトルとして保存し、ハイブリッド検索（密＋疎＋スカラーフィルタ）を実行して、新商品に最も似たベストセラー画像を見つける。</li>
<li><strong>Qwen 3.5</strong>: 人気のマルチモーダルLLM。検索されたベストセラー画像を取得し、その背後にある視覚的パターン（シーンレイアウト、照明、ポーズ、ムード）を構造化されたスタイルプロンプトに抽出する。</li>
<li><strong>ナノバナナ2</strong>：Googleの画像生成モデル（Gemini 3.1 Flash Image）。新商品のフラットレイ、ベストセラーのリファレンス、Qwen 3.5のスタイルプロンプトの3つを入力。最終的なプロモーション写真を出力。</li>
</ul>
<p>このアーキテクチャの背後にあるロジックは、1つの観察から始まります：あらゆるeコマースカタログで最も価値のあるビジュアル資産は、すでに変換されたベストセラー画像のライブラリです。これらの写真のポーズ、構図、ライティングは、実際の広告費を通して洗練されたものだ。これらのパターンを直接検索することは、プロンプトを書きながらリバースエンジニアリングするよりも桁違いに速く、その検索ステップこそがベクトルデータベースが扱うものなのだ。</p>
<p>これが完全なフローだ。OpenRouter APIを通じてすべてのモデルを呼び出しているため、ローカルGPUは必要なく、モデルの重みをダウンロードする必要もない。</p>
<pre><code translate="no">New product flat-lay
│
│── Embed → Llama Nemotron Embed VL 1B v2
│
│── Search → Milvus hybrid search
│   ├── Dense <span class="hljs-title function_">vectors</span> <span class="hljs-params">(visual similarity)</span>
│   ├── Sparse <span class="hljs-title function_">vectors</span> <span class="hljs-params">(keyword matching)</span>
│   └── Scalar <span class="hljs-title function_">filters</span> <span class="hljs-params">(category + sales volume)</span>
│
│── Analyze → Qwen <span class="hljs-number">3.5</span> extracts style from retrieved bestsellers
│   └── scene, lighting, pose, mood → style prompt
│
└── Generate → Nano Banana <span class="hljs-number">2</span>
    ├── Inputs: <span class="hljs-keyword">new</span> <span class="hljs-title class_">product</span> + bestseller reference + style prompt
    └── Output: promotional photo
<button class="copy-code-btn"></button></code></pre>
<p>Milvusの3つの機能を利用して、検索ステージを機能させている：</p>
<ol>
<li><strong>密＋疎ハイブリッド検索。</strong>画像埋め込みとテキストTF-IDFベクトルを並列クエリとして実行し、RRF（Reciprocal Rank Fusion）リランキングで2つの結果セットをマージする。</li>
<li><strong>スカラーフィールドフィルタリング。</strong>ベクトル比較の前にcategoryやsales_countのようなメタデータフィールドでフィルタリングすることで、関連性の高い、パフォーマンスの高い商品のみを結果に含めます。</li>
<li><strong>マルチフィールドスキーマ。</strong>密なベクトル、疎なベクトル、スカラーメタデータを1つのMilvusコレクションに格納することで、検索ロジック全体を複数のシステムに分散させることなく、1つのクエリに保持します。</li>
</ol>
<h3 id="Data-Preparation" class="common-anchor-header">データ準備</h3><p><strong>過去の製品カタログ</strong></p>
<p>既存の商品写真のimages/フォルダとメタデータを含むproducts.csvファイル。</p>
<pre><code translate="no">images/
├── SKU001.jpg
├── SKU002.jpg
├── ...
└── SKU040.jpg

products.csv fields:
product_id, image_path, category, color, style, season, sales_count, description, price
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image1.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>新しい商品データ</strong></p>
<p>プロモーション画像を生成したい商品について、new_products/フォルダとnew_products.csvという並列構造を準備します。</p>
<pre><code translate="no">new_products/
├── NEW001.jpg    <span class="hljs-comment"># Blue knit cardigan + grey tulle skirt set</span>
├── NEW002.jpg    <span class="hljs-comment"># Light green floral ruffle maxi dress</span>
├── NEW003.jpg    <span class="hljs-comment"># Camel turtleneck knit dress</span>
└── NEW004.jpg    <span class="hljs-comment"># Dark grey ethnic-style cowl neck top dress</span>

new_products.csv fields:
new_id, image_path, category, style, season, prompt_hint
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image11.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-1-Install-Dependencies" class="common-anchor-header">ステップ 1: 依存関係のインストール</h3><pre><code translate="no">!pip install pymilvus openai requests pillow scikit-learn tqdm
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-2-Import-Modules-and-Configurations" class="common-anchor-header">ステップ 2: モジュールと設定のインポート</h3><pre><code translate="no"><span class="hljs-keyword">import</span> os, io, base64, csv, time
<span class="hljs-keyword">import</span> requests <span class="hljs-keyword">as</span> req
<span class="hljs-keyword">import</span> numpy <span class="hljs-keyword">as</span> np
<span class="hljs-keyword">from</span> <span class="hljs-variable constant_">PIL</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">Image</span>
<span class="hljs-keyword">from</span> tqdm.<span class="hljs-property">notebook</span> <span class="hljs-keyword">import</span> tqdm
<span class="hljs-keyword">from</span> sklearn.<span class="hljs-property">feature_extraction</span>.<span class="hljs-property">text</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">TfidfVectorizer</span>
<span class="hljs-keyword">from</span> <span class="hljs-title class_">IPython</span>.<span class="hljs-property">display</span> <span class="hljs-keyword">import</span> display

<span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>
<span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>, <span class="hljs-title class_">DataType</span>, <span class="hljs-title class_">AnnSearchRequest</span>, <span class="hljs-title class_">RRFRanker</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>すべてのモデルとパスを設定します：</strong></p>
<pre><code translate="no"><span class="hljs-comment"># -- Config --</span>
OPENROUTER_API_KEY = os.environ.get(
    <span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>,
    <span class="hljs-string">&quot;&lt;YOUR_OPENROUTER_API_KEY&gt;&quot;</span>,
)

<span class="hljs-comment"># Models (all via OpenRouter, no local download needed)</span>
EMBED_MODEL = <span class="hljs-string">&quot;nvidia/llama-nemotron-embed-vl-1b-v2&quot;</span>  <span class="hljs-comment"># free, image+text → 2048d</span>
EMBED_DIM = <span class="hljs-number">2048</span>
LLM_MODEL = <span class="hljs-string">&quot;qwen/qwen3.5-397b-a17b&quot;</span>                 <span class="hljs-comment"># style analysis</span>
IMAGE_GEN_MODEL = <span class="hljs-string">&quot;google/gemini-3.1-flash-image-preview&quot;</span>  <span class="hljs-comment"># Nano Banana 2</span>

<span class="hljs-comment"># Milvus</span>
MILVUS_URI = <span class="hljs-string">&quot;./milvus_fashion.db&quot;</span>
COLLECTION = <span class="hljs-string">&quot;fashion_products&quot;</span>
TOP_K = <span class="hljs-number">3</span>

<span class="hljs-comment"># Paths</span>
IMAGE_DIR = <span class="hljs-string">&quot;./images&quot;</span>
NEW_PRODUCT_DIR = <span class="hljs-string">&quot;./new_products&quot;</span>
PRODUCT_CSV = <span class="hljs-string">&quot;./products.csv&quot;</span>
NEW_PRODUCT_CSV = <span class="hljs-string">&quot;./new_products.csv&quot;</span>

<span class="hljs-comment"># OpenRouter client (shared for LLM + image gen)</span>
llm = OpenAI(api_key=OPENROUTER_API_KEY, base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Config loaded. All models via OpenRouter API.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p><strong>ユーティリティ関数</strong></p>
<p>これらのヘルパー関数は、画像のエンコード、APIコール、レスポンスの解析を処理します：</p>
<ul>
<li>image_to_uri()：image_to_uri()：PIL画像をAPI転送用のbase64データURIに変換します。</li>
<li>get_image_embeddings()：OpenRouter Embedding API を使って画像を 2048 次元ベクトルに一括エンコードします。</li>
<li>get_text_embedding()：テキストを同じ 2048 次元ベクトル空間にエンコードします。</li>
<li>sparse_to_dict()：scipyの疎行列の行をMilvusが期待する疎ベクトル用の{index: value}フォーマットに変換します。</li>
<li>extract_images()：Nano Banana 2 APIレスポンスから生成された画像を抽出します。</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># -- Utility functions --</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">image_to_uri</span>(<span class="hljs-params">img, max_size=<span class="hljs-number">1024</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert PIL Image to base64 data URI.&quot;&quot;&quot;</span>
    img = img.copy()
    w, h = img.size
    <span class="hljs-keyword">if</span> <span class="hljs-built_in">max</span>(w, h) &gt; max_size:
        r = max_size / <span class="hljs-built_in">max</span>(w, h)
        img = img.resize((<span class="hljs-built_in">int</span>(w * r), <span class="hljs-built_in">int</span>(h * r)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, <span class="hljs-built_in">format</span>=<span class="hljs-string">&quot;JPEG&quot;</span>, quality=<span class="hljs-number">85</span>)
    <span class="hljs-keyword">return</span> <span class="hljs-string">f&quot;data:image/jpeg;base64,<span class="hljs-subst">{base64.b64encode(buf.getvalue()).decode()}</span>&quot;</span>

<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_image_embeddings</span>(<span class="hljs-params">images, batch_size=<span class="hljs-number">5</span></span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode images via OpenRouter embedding API.&quot;&quot;&quot;</span>
    all_embs = []
    <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> tqdm(<span class="hljs-built_in">range</span>(<span class="hljs-number">0</span>, <span class="hljs-built_in">len</span>(images), batch_size), desc=<span class="hljs-string">&quot;Encoding images&quot;</span>):
        batch = images[i : i + batch_size]
        inputs = [
            {<span class="hljs-string">&quot;content&quot;</span>: [{<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(img, max_size=<span class="hljs-number">512</span>)}}]}
            <span class="hljs-keyword">for</span> img <span class="hljs-keyword">in</span> batch
        ]
        resp = req.post(
            <span class="hljs-string">&quot;https://openrouter.ai/api/v1/embeddings&quot;</span>,
            headers={<span class="hljs-string">&quot;Authorization&quot;</span>: <span class="hljs-string">f&quot;Bearer <span class="hljs-subst">{OPENROUTER_API_KEY}</span>&quot;</span>},
            json={<span class="hljs-string">&quot;model&quot;</span>: EMBED_MODEL, <span class="hljs-string">&quot;input&quot;</span>: inputs},
            timeout=<span class="hljs-number">120</span>,
        )
        data = resp.json()
        <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;data&quot;</span> <span class="hljs-keyword">not</span> <span class="hljs-keyword">in</span> data:
            <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;API error: <span class="hljs-subst">{data}</span>&quot;</span>)
            <span class="hljs-keyword">continue</span>
        <span class="hljs-keyword">for</span> item <span class="hljs-keyword">in</span> <span class="hljs-built_in">sorted</span>(data[<span class="hljs-string">&quot;data&quot;</span>], key=<span class="hljs-keyword">lambda</span> x: x[<span class="hljs-string">&quot;index&quot;</span>]):
            all_embs.append(item[<span class="hljs-string">&quot;embedding&quot;</span>])
        time.sleep(<span class="hljs-number">0.5</span>)  <span class="hljs-comment"># rate limit friendly</span>
    <span class="hljs-keyword">return</span> np.array(all_embs, dtype=np.float32)

<span class="hljs-keyword">def</span> <span class="hljs-title function_">get_text_embedding</span>(<span class="hljs-params">text</span>):
    <span class="hljs-string">&quot;&quot;&quot;Encode text via OpenRouter embedding API.&quot;&quot;&quot;</span>
    resp = req.post(
        <span class="hljs-string">&quot;https://openrouter.ai/api/v1/embeddings&quot;</span>,
        headers={<span class="hljs-string">&quot;Authorization&quot;</span>: <span class="hljs-string">f&quot;Bearer <span class="hljs-subst">{OPENROUTER_API_KEY}</span>&quot;</span>},
        json={<span class="hljs-string">&quot;model&quot;</span>: EMBED_MODEL, <span class="hljs-string">&quot;input&quot;</span>: text},
        timeout=<span class="hljs-number">60</span>,
    )
    <span class="hljs-keyword">return</span> np.array(resp.json()[<span class="hljs-string">&quot;data&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;embedding&quot;</span>], dtype=np.float32)

<span class="hljs-keyword">def</span> <span class="hljs-title function_">sparse_to_dict</span>(<span class="hljs-params">sparse_row</span>):
    <span class="hljs-string">&quot;&quot;&quot;Convert scipy sparse row to Milvus sparse vector format {index: value}.&quot;&quot;&quot;</span>
    coo = sparse_row.tocoo()
    <span class="hljs-keyword">return</span> {<span class="hljs-built_in">int</span>(i): <span class="hljs-built_in">float</span>(v) <span class="hljs-keyword">for</span> i, v <span class="hljs-keyword">in</span> <span class="hljs-built_in">zip</span>(coo.col, coo.data)}

<span class="hljs-keyword">def</span> <span class="hljs-title function_">extract_images</span>(<span class="hljs-params">response</span>):
    <span class="hljs-string">&quot;&quot;&quot;Extract generated images from OpenRouter response.&quot;&quot;&quot;</span>
    images = []
    raw = response.model_dump()
    msg = raw[<span class="hljs-string">&quot;choices&quot;</span>][<span class="hljs-number">0</span>][<span class="hljs-string">&quot;message&quot;</span>]
    <span class="hljs-comment"># Method 1: images field (OpenRouter extension)</span>
    <span class="hljs-keyword">if</span> <span class="hljs-string">&quot;images&quot;</span> <span class="hljs-keyword">in</span> msg <span class="hljs-keyword">and</span> msg[<span class="hljs-string">&quot;images&quot;</span>]:
        <span class="hljs-keyword">for</span> img_data <span class="hljs-keyword">in</span> msg[<span class="hljs-string">&quot;images&quot;</span>]:
            url = img_data[<span class="hljs-string">&quot;image_url&quot;</span>][<span class="hljs-string">&quot;url&quot;</span>]
            b64 = url.split(<span class="hljs-string">&quot;,&quot;</span>, <span class="hljs-number">1</span>)[<span class="hljs-number">1</span>]
            images.append(Image.<span class="hljs-built_in">open</span>(io.BytesIO(base64.b64decode(b64))))
    <span class="hljs-comment"># Method 2: inline base64 in content parts</span>
    <span class="hljs-keyword">if</span> <span class="hljs-keyword">not</span> images <span class="hljs-keyword">and</span> <span class="hljs-built_in">isinstance</span>(msg.get(<span class="hljs-string">&quot;content&quot;</span>), <span class="hljs-built_in">list</span>):
        <span class="hljs-keyword">for</span> part <span class="hljs-keyword">in</span> msg[<span class="hljs-string">&quot;content&quot;</span>]:
            <span class="hljs-keyword">if</span> <span class="hljs-built_in">isinstance</span>(part, <span class="hljs-built_in">dict</span>) <span class="hljs-keyword">and</span> part.get(<span class="hljs-string">&quot;type&quot;</span>) == <span class="hljs-string">&quot;image_url&quot;</span>:
                url = part[<span class="hljs-string">&quot;image_url&quot;</span>][<span class="hljs-string">&quot;url&quot;</span>]
                <span class="hljs-keyword">if</span> url.startswith(<span class="hljs-string">&quot;data:image&quot;</span>):
                    b64 = url.split(<span class="hljs-string">&quot;,&quot;</span>, <span class="hljs-number">1</span>)[<span class="hljs-number">1</span>]
                    images.append(Image.<span class="hljs-built_in">open</span>(io.BytesIO(base64.b64decode(b64))))
    <span class="hljs-keyword">return</span> images

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Utility functions ready.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Load-the-Product-Catalog" class="common-anchor-header">ステップ 3: 製品カタログのロード</h3><p>products.csvを読み込み、対応する商品画像をロードします：</p>
<pre><code translate="no"><span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(PRODUCT_CSV, newline=<span class="hljs-string">&quot;&quot;</span>, encoding=<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">as</span> f:
    products = <span class="hljs-built_in">list</span>(csv.DictReader(f))

product_images = []
<span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> products:
    img = Image.<span class="hljs-built_in">open</span>(os.path.join(IMAGE_DIR, p[<span class="hljs-string">&quot;image_path&quot;</span>])).convert(<span class="hljs-string">&quot;RGB&quot;</span>)
    product_images.append(img)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Loaded <span class="hljs-subst">{<span class="hljs-built_in">len</span>(products)}</span> products.&quot;</span>)
<span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-number">3</span>):
    p = products[i]
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{p[<span class="hljs-string">&#x27;product_id&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;color&#x27;</span>]}</span> | <span class="hljs-subst">{p[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> | sales: <span class="hljs-subst">{p[<span class="hljs-string">&#x27;sales_count&#x27;</span>]}</span>&quot;</span>)
    display(product_images[i].resize((<span class="hljs-number">180</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">180</span> * product_images[i].height / product_images[i].width))))
<button class="copy-code-btn"></button></code></pre>
<p>サンプル出力：<br>

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image13.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Generate-Embeddings" class="common-anchor-header">ステップ4：エンベッディングの生成</h3><p>ハイブリッド検索では、各商品に対して2種類のベクトルが必要です。</p>
<p><strong>4.1 密なベクトル：画像埋め込み</strong></p>
<p>nvidia/llama-nemotron-embed-vl-1b-v2モデルは、各製品画像を2048次元の密なベクトルにエンコードする。このモデルは共有ベクトル空間において画像とテキストの両方の入力をサポートするため、同じ埋め込みが画像間検索とテキスト間検索で機能する。</p>
<pre><code translate="no"><span class="hljs-comment"># Dense embeddings: image → 2048-dim vector via OpenRouter API</span>
dense_vectors = get_image_embeddings(product_images, batch_size=<span class="hljs-number">5</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dense vectors: <span class="hljs-subst">{dense_vectors.shape}</span>  (products x <span class="hljs-subst">{EMBED_DIM}</span>d)&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>出力：</p>
<pre><code translate="no">Dense vectors: (40, 2048)  (products x 2048d)
<button class="copy-code-btn"></button></code></pre>
<p><strong>4.2 疎なベクトル：TF-IDFテキスト埋め込み</strong></p>
<p>商品のテキスト記述は scikit-learn の TF-IDF ベクタライザーを使ってスパースベクトルにエンコードされる。これらは、密なベクトルが見逃す可能性のあるキーワードレベルのマッチングを捉える。</p>
<pre><code translate="no"><span class="hljs-comment"># Sparse embeddings: TF-IDF on product descriptions</span>
descriptions = [p[<span class="hljs-string">&quot;description&quot;</span>] <span class="hljs-keyword">for</span> p <span class="hljs-keyword">in</span> products]
tfidf = TfidfVectorizer(stop_words=<span class="hljs-string">&quot;english&quot;</span>, max_features=<span class="hljs-number">500</span>)
tfidf_matrix = tfidf.fit_transform(descriptions)

sparse_vectors = [sparse_to_dict(tfidf_matrix[i]) <span class="hljs-keyword">for</span> i <span class="hljs-keyword">in</span> <span class="hljs-built_in">range</span>(<span class="hljs-built_in">len</span>(products))]
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sparse vectors: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sparse_vectors)}</span> products, vocab size: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(tfidf.vocabulary_)}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sample sparse vector (SKU001): <span class="hljs-subst">{<span class="hljs-built_in">len</span>(sparse_vectors[<span class="hljs-number">0</span>])}</span> non-zero terms&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>出力：</p>
<pre><code translate="no">Sparse vectors: <span class="hljs-number">40</span> products, vocab size: <span class="hljs-number">179</span>
Sample sparse <span class="hljs-title function_">vector</span> <span class="hljs-params">(SKU001)</span>: <span class="hljs-number">11</span> non-zero terms
<button class="copy-code-btn"></button></code></pre>
<p><strong>なぜ両方のベクトルタイプなのか？</strong>密なベクトルと疎なベクトルは互いに補完し合う。密なベクトルは視覚的な類似性を捉えます：カラーパレット、衣服のシルエット、全体的なスタイル。スパースベクトルは、キーワードのセマンティクス（商品属性を示す「フローラル」、「ミディ」、「シフォン」などの用語）を捉えます。両者を組み合わせることで、どちらか一方のアプローチのみよりも検索品質が大幅に向上する。</p>
<h3 id="Step-5-Create-a-Milvus-Collection-with-Hybrid-Schema" class="common-anchor-header">ステップ5: ハイブリッドスキーマによるMilvusコレクションの作成</h3><p>このステップでは、密なベクトル、疎なベクトル、スカラーメタデータフィールドを一緒に格納する単一のMilvusコレクションを作成します。この統一されたスキーマにより、単一のクエリでハイブリッド検索が可能になります。</p>
<table>
<thead>
<tr><th><strong>フィールド</strong></th><th><strong>タイプ</strong></th><th><strong>目的</strong></th></tr>
</thead>
<tbody>
<tr><td>密ベクトル</td><td>FLOAT_VECTOR (2048d)</td><td>画像埋め込み，COSINE類似度</td></tr>
<tr><td>疎なベクトル</td><td>sparse_float_vector</td><td>TF-IDF 疎なベクトル，内積</td></tr>
<tr><td>カテゴリ</td><td>VARCHAR</td><td>フィルタリング用のカテゴリーラベル</td></tr>
<tr><td>売上数</td><td>INT64</td><td>フィルタリングのための過去の販売数</td></tr>
<tr><td>カラー、スタイル、シーズン</td><td>VARCHAR</td><td>追加のメタデータラベル</td></tr>
<tr><td>価格</td><td>FLOAT</td><td>商品価格</td></tr>
</tbody>
</table>
<pre><code translate="no">milvus_client = MilvusClient(uri=MILVUS_URI)

<span class="hljs-keyword">if</span> milvus_client.has_collection(COLLECTION):
    milvus_client.drop_collection(COLLECTION)

schema = milvus_client.create_schema(auto_id=<span class="hljs-literal">True</span>, enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;id&quot;</span>, DataType.INT64, is_primary=<span class="hljs-literal">True</span>)
schema.add_field(<span class="hljs-string">&quot;product_id&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">20</span>)
schema.add_field(<span class="hljs-string">&quot;category&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;color&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;style&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;season&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">50</span>)
schema.add_field(<span class="hljs-string">&quot;sales_count&quot;</span>, DataType.INT64)
schema.add_field(<span class="hljs-string">&quot;description&quot;</span>, DataType.VARCHAR, max_length=<span class="hljs-number">500</span>)
schema.add_field(<span class="hljs-string">&quot;price&quot;</span>, DataType.FLOAT)
schema.add_field(<span class="hljs-string">&quot;dense_vector&quot;</span>, DataType.FLOAT_VECTOR, dim=EMBED_DIM)
schema.add_field(<span class="hljs-string">&quot;sparse_vector&quot;</span>, DataType.SPARSE_FLOAT_VECTOR)

index_params = milvus_client.prepare_index_params()
index_params.add_index(field_name=<span class="hljs-string">&quot;dense_vector&quot;</span>, index_type=<span class="hljs-string">&quot;FLAT&quot;</span>, metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>)
index_params.add_index(field_name=<span class="hljs-string">&quot;sparse_vector&quot;</span>, index_type=<span class="hljs-string">&quot;SPARSE_INVERTED_INDEX&quot;</span>, metric_type=<span class="hljs-string">&quot;IP&quot;</span>)

milvus_client.create_collection(COLLECTION, schema=schema, index_params=index_params)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Milvus collection &#x27;<span class="hljs-subst">{COLLECTION}</span>&#x27; created with hybrid schema.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>商品データを挿入する：</p>
<pre><code translate="no"><span class="hljs-comment"># Insert all products</span>
rows = []
<span class="hljs-keyword">for</span> i, p <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(products):
    rows.append({
        <span class="hljs-string">&quot;product_id&quot;</span>: p[<span class="hljs-string">&quot;product_id&quot;</span>],
        <span class="hljs-string">&quot;category&quot;</span>: p[<span class="hljs-string">&quot;category&quot;</span>],
        <span class="hljs-string">&quot;color&quot;</span>: p[<span class="hljs-string">&quot;color&quot;</span>],
        <span class="hljs-string">&quot;style&quot;</span>: p[<span class="hljs-string">&quot;style&quot;</span>],
        <span class="hljs-string">&quot;season&quot;</span>: p[<span class="hljs-string">&quot;season&quot;</span>],
        <span class="hljs-string">&quot;sales_count&quot;</span>: <span class="hljs-built_in">int</span>(p[<span class="hljs-string">&quot;sales_count&quot;</span>]),
        <span class="hljs-string">&quot;description&quot;</span>: p[<span class="hljs-string">&quot;description&quot;</span>],
        <span class="hljs-string">&quot;price&quot;</span>: <span class="hljs-built_in">float</span>(p[<span class="hljs-string">&quot;price&quot;</span>]),
        <span class="hljs-string">&quot;dense_vector&quot;</span>: dense_vectors[i].tolist(),
        <span class="hljs-string">&quot;sparse_vector&quot;</span>: sparse_vectors[i],
    })

milvus_client.insert(COLLECTION, rows)
stats = milvus_client.get_collection_stats(COLLECTION)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Inserted <span class="hljs-subst">{stats[<span class="hljs-string">&#x27;row_count&#x27;</span>]}</span> products into Milvus.&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>出力</p>
<pre><code translate="no">Inserted <span class="hljs-number">40</span> products <span class="hljs-keyword">into</span> Milvus.
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-6-Hybrid-Search-to-Find-Similar-Bestsellers" class="common-anchor-header">ステップ6：類似ベストセラーを見つけるハイブリッド検索</h3><p>これが核となる検索ステップである。新しい商品ごとに、パイプラインは3つの処理を同時に実行する：</p>
<ol>
<li><strong>密検索</strong>：視覚的に類似した画像埋め込みを持つ商品を見つける。</li>
<li><strong>スパース検索</strong>：TF-IDFを介してテキストキーワードが一致する商品を見つける。</li>
<li><strong>スカラーフィルタリング</strong>: 同じカテゴリで、sales_count &gt; 1500の商品に結果を制限する。</li>
<li><strong>RRF reranking</strong>: Reciprocal Rank Fusionを使用して、密と疎の結果リストをマージします。</li>
</ol>
<p>新しい商品をロードする：</p>
<pre><code translate="no"><span class="hljs-comment"># Load new products</span>
<span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(NEW_PRODUCT_CSV, newline=<span class="hljs-string">&quot;&quot;</span>, encoding=<span class="hljs-string">&quot;utf-8&quot;</span>) <span class="hljs-keyword">as</span> f:
    new_products = <span class="hljs-built_in">list</span>(csv.DictReader(f))

<span class="hljs-comment"># Pick the first new product for demo</span>
new_prod = new_products[<span class="hljs-number">0</span>]
new_img = Image.<span class="hljs-built_in">open</span>(os.path.join(NEW_PRODUCT_DIR, new_prod[<span class="hljs-string">&quot;image_path&quot;</span>])).convert(<span class="hljs-string">&quot;RGB&quot;</span>)

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;New product: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Category: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | Style: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> | Season: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;season&#x27;</span>]}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Prompt hint: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>&quot;</span>)
display(new_img.resize((<span class="hljs-number">300</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">300</span> * new_img.height / new_img.width))))
<button class="copy-code-btn"></button></code></pre>
<p>出力：  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image4.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>新しい商品をエンコードする：</p>
<pre><code translate="no"><span class="hljs-comment"># Encode new product</span>
<span class="hljs-comment"># Dense: image embedding via API</span>
query_dense = get_image_embeddings([new_img], batch_size=<span class="hljs-number">1</span>)[<span class="hljs-number">0</span>]

<span class="hljs-comment"># Sparse: TF-IDF from text query</span>
query_text = <span class="hljs-string">f&quot;<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;season&#x27;</span>]}</span> <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>&quot;</span>
query_sparse = sparse_to_dict(tfidf.transform([query_text])[<span class="hljs-number">0</span>])

<span class="hljs-comment"># Scalar filter</span>
filter_expr = <span class="hljs-string">f&#x27;category == &quot;<span class="hljs-subst">{new_prod[<span class="hljs-string">&quot;category&quot;</span>]}</span>&quot; and sales_count &gt; 1500&#x27;</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Dense query: <span class="hljs-subst">{query_dense.shape}</span>&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Sparse query: <span class="hljs-subst">{<span class="hljs-built_in">len</span>(query_sparse)}</span> non-zero terms&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Filter: <span class="hljs-subst">{filter_expr}</span>&quot;</span>)

<button class="copy-code-btn"></button></code></pre>
<p>出力：</p>
<pre><code translate="no"><span class="hljs-title class_">Dense</span> <span class="hljs-attr">query</span>: (<span class="hljs-number">2048</span>,)
<span class="hljs-title class_">Sparse</span> <span class="hljs-attr">query</span>: <span class="hljs-number">6</span> non-zero terms
<span class="hljs-title class_">Filter</span>: category == <span class="hljs-string">&quot;midi_dress&quot;</span> and sales_count &gt; <span class="hljs-number">1500</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>ハイブリッド検索の実行</strong></p>
<p>ここでのキーとなるAPIコール</p>
<ul>
<li>AnnSearchRequest は、密なベクトル・フィールドと疎なベクトル・フィールドに対して別々の検索要求を作成する。</li>
<li>expr=filter_expr は各検索リクエスト内でスカラーフィルタリングを適用します。</li>
<li>RRFRanker(k=60) は、Reciprocal Rank Fusion アルゴリズムを使用して、2つのランク付けされた結果リストを融合します。</li>
<li>hybrid_searchは両方のリクエストを実行し、マージされた再ランク付けされた結果を返します。</li>
</ul>
<pre><code translate="no"><span class="hljs-comment"># Hybrid search: dense + sparse + scalar filter + RRF reranking</span>
dense_req = AnnSearchRequest(
    data=[query_dense.tolist()],
    anns_field=<span class="hljs-string">&quot;dense_vector&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>},
    limit=<span class="hljs-number">20</span>,
    expr=filter_expr,
)
sparse_req = AnnSearchRequest(
    data=[query_sparse],
    anns_field=<span class="hljs-string">&quot;sparse_vector&quot;</span>,
    param={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;IP&quot;</span>},
    limit=<span class="hljs-number">20</span>,
    expr=filter_expr,
)

results = milvus_client.hybrid_search(
    collection_name=COLLECTION,
    reqs=[dense_req, sparse_req],
    ranker=RRFRanker(k=<span class="hljs-number">60</span>),
    limit=TOP_K,
    output_fields=[<span class="hljs-string">&quot;product_id&quot;</span>, <span class="hljs-string">&quot;category&quot;</span>, <span class="hljs-string">&quot;color&quot;</span>, <span class="hljs-string">&quot;style&quot;</span>, <span class="hljs-string">&quot;season&quot;</span>,
                   <span class="hljs-string">&quot;sales_count&quot;</span>, <span class="hljs-string">&quot;description&quot;</span>, <span class="hljs-string">&quot;price&quot;</span>],
)

<span class="hljs-comment"># Display retrieved bestsellers</span>
retrieved_products = []
retrieved_images = []
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Top-<span class="hljs-subst">{TOP_K}</span> similar bestsellers:\n&quot;</span>)
<span class="hljs-keyword">for</span> hit <span class="hljs-keyword">in</span> results[<span class="hljs-number">0</span>]:
    entity = hit[<span class="hljs-string">&quot;entity&quot;</span>]
    pid = entity[<span class="hljs-string">&quot;product_id&quot;</span>]
    img = Image.<span class="hljs-built_in">open</span>(os.path.join(IMAGE_DIR, <span class="hljs-string">f&quot;<span class="hljs-subst">{pid}</span>.jpg&quot;</span>)).convert(<span class="hljs-string">&quot;RGB&quot;</span>)
    retrieved_products.append(entity)
    retrieved_images.append(img)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;<span class="hljs-subst">{pid}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;category&#x27;</span>]}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;color&#x27;</span>]}</span> | <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;style&#x27;</span>]}</span> &quot;</span>
          <span class="hljs-string">f&quot;| sales: <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;sales_count&#x27;</span>]}</span> | $<span class="hljs-subst">{entity[<span class="hljs-string">&#x27;price&#x27;</span>]:<span class="hljs-number">.1</span>f}</span> | score: <span class="hljs-subst">{hit[<span class="hljs-string">&#x27;distance&#x27;</span>]:<span class="hljs-number">.4</span>f}</span>&quot;</span>)
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;  <span class="hljs-subst">{entity[<span class="hljs-string">&#x27;description&#x27;</span>]}</span>&quot;</span>)
    display(img.resize((<span class="hljs-number">250</span>, <span class="hljs-built_in">int</span>(<span class="hljs-number">250</span> * img.height / img.width))))
    <span class="hljs-built_in">print</span>()
<button class="copy-code-btn"></button></code></pre>
<p>出力：最も類似したベストセラーのトップ3、融合スコアによるランク付け。  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-7-Analyze-Bestseller-Style-with-Qwen-35" class="common-anchor-header">ステップ 7: Qwen 3.5を使ったベストセラースタイルの分析</h3><p>検索されたベストセラー画像をQwen 3.5に送り込み、シーン構成、照明設定、モデルのポーズ、全体的なムードなど、共通の視覚的DNAを抽出するよう依頼する。その分析から、ナノ・バナナ2に渡す準備ができた一世代のプロンプトが戻ってきます。</p>
<pre><code translate="no">content = [
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(img)}}
    <span class="hljs-keyword">for</span> img in retrieved_images
]
content.<span class="hljs-built_in">append</span>({
    <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>,
    <span class="hljs-string">&quot;text&quot;</span>: (
        <span class="hljs-string">&quot;These are our top-selling fashion product photos.\n\n&quot;</span>
        <span class="hljs-string">&quot;Analyze their common visual style in these dimensions:\n&quot;</span>
        <span class="hljs-string">&quot;1. Scene / background setting\n&quot;</span>
        <span class="hljs-string">&quot;2. Lighting and color tone\n&quot;</span>
        <span class="hljs-string">&quot;3. Model pose and framing\n&quot;</span>
        <span class="hljs-string">&quot;4. Overall mood and aesthetic\n\n&quot;</span>
        <span class="hljs-string">&quot;Then, based on this analysis, write ONE concise image generation prompt &quot;</span>
        <span class="hljs-string">&quot;(under 100 words) that captures this style. The prompt should describe &quot;</span>
        <span class="hljs-string">&quot;a scene for a model wearing a new clothing item. &quot;</span>
        <span class="hljs-string">&quot;Output ONLY the prompt, nothing else.&quot;</span>
    ),
})

response = llm.chat.completions.create(
    model=LLM_MODEL,
    messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: content}],
    max_tokens=<span class="hljs-number">512</span>,
    temperature=<span class="hljs-number">0.7</span>,
)
style_prompt = response.choices[<span class="hljs-number">0</span>].message.content.strip()
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Style prompt from Qwen3.5:\n&quot;</span>)
<span class="hljs-built_in">print</span>(style_prompt)
<button class="copy-code-btn"></button></code></pre>
<p>サンプル出力：</p>
<pre><code translate="no">Style prompt from Qwen3.5:

Professional full-body fashion photograph of a model wearing a stylish new dress.
Bright, soft high-key lighting that illuminates the subject evenly. Clean,
uncluttered background, either stark white or a softly blurred bright outdoor
setting. The model stands in a relaxed, natural pose to showcase the garment&#x27;s
silhouette and drape. Sharp focus, vibrant colors, fresh and elegant commercial aesthetic.
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-8-Generate-the-Promotional-Image-with-Nano-Banana-2" class="common-anchor-header">ステップ8: ナノ・バナナ2によるプロモーション画像の生成</h3><p>ナノ・バナナ2に3つのインプットを渡します：新製品のフラットレイフォト、トップランクのベストセラー画像、そして前のステップで抽出したスタイルプロンプトです。モデルはこれらを合成し、新商品と実績のあるビジュアルスタイルを組み合わせたプロモーション写真を作成します。</p>
<pre><code translate="no">gen_prompt = (
    <span class="hljs-string">f&quot;I have a new clothing product (Image 1: flat-lay photo) and a reference &quot;</span>
    <span class="hljs-string">f&quot;promotional photo from our bestselling catalog (Image 2).\n\n&quot;</span>
    <span class="hljs-string">f&quot;Generate a professional e-commerce promotional photograph of a female model &quot;</span>
    <span class="hljs-string">f&quot;wearing the clothing from Image 1.\n\n&quot;</span>
    <span class="hljs-string">f&quot;Style guidance: <span class="hljs-subst">{style_prompt}</span>\n\n&quot;</span>
    <span class="hljs-string">f&quot;Scene hint: <span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;prompt_hint&#x27;</span>]}</span>\n\n&quot;</span>
    <span class="hljs-string">f&quot;Requirements:\n&quot;</span>
    <span class="hljs-string">f&quot;- Full body shot, photorealistic, high quality\n&quot;</span>
    <span class="hljs-string">f&quot;- The clothing should match Image 1 exactly\n&quot;</span>
    <span class="hljs-string">f&quot;- The photo style and mood should match Image 2&quot;</span>
)

gen_content = [
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(new_img)}},
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;image_url&quot;</span>, <span class="hljs-string">&quot;image_url&quot;</span>: {<span class="hljs-string">&quot;url&quot;</span>: image_to_uri(retrieved_images[<span class="hljs-number">0</span>])}},
    {<span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;text&quot;</span>: gen_prompt},
]

<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Generating promotional photo with Nano Banana 2...&quot;</span>)
gen_response = llm.chat.completions.create(
    model=IMAGE_GEN_MODEL,
    messages=[{<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: gen_content}],
    extra_body={
        <span class="hljs-string">&quot;modalities&quot;</span>: [<span class="hljs-string">&quot;text&quot;</span>, <span class="hljs-string">&quot;image&quot;</span>],
        <span class="hljs-string">&quot;image_config&quot;</span>: {<span class="hljs-string">&quot;aspect_ratio&quot;</span>: <span class="hljs-string">&quot;3:4&quot;</span>, <span class="hljs-string">&quot;image_size&quot;</span>: <span class="hljs-string">&quot;2K&quot;</span>},
    },
)
<span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;Done!&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Nano Banana 2 APIコールの主なパラメータ：</p>
<ul>
<li>モダリティ：modalities: [&quot;text&quot;, &quot;image&quot;]: レスポンスに画像を含めることを宣言する。</li>
<li>image_config.aspect_ratio: 出力のアスペクト比をコントロールします（ポートレート/ファッションショットには3:4が効果的です）。</li>
<li>image_config.image_size: 解像度を設定します。Nano Banana 2は512pxから4Kまでサポートしています。</li>
</ul>
<p>生成された画像を取り出します：</p>
<pre><code translate="no">generated_images = extract_images(gen_response)

text_content = gen_response.choices[<span class="hljs-number">0</span>].message.content
<span class="hljs-keyword">if</span> text_content:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Model response: <span class="hljs-subst">{text_content[:<span class="hljs-number">300</span>]}</span>\n&quot;</span>)

<span class="hljs-keyword">if</span> generated_images:
    <span class="hljs-keyword">for</span> i, img <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(generated_images):
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;--- Generated promo photo <span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span> ---&quot;</span>)
        display(img)
        img.save(<span class="hljs-string">f&quot;promo_<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>_<span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>.png&quot;</span>)
        <span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;Saved: promo_<span class="hljs-subst">{new_prod[<span class="hljs-string">&#x27;new_id&#x27;</span>]}</span>_<span class="hljs-subst">{i+<span class="hljs-number">1</span>}</span>.png&quot;</span>)
<span class="hljs-keyword">else</span>:
    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;No image generated. Raw response:&quot;</span>)
    <span class="hljs-built_in">print</span>(gen_response.model_dump())
<button class="copy-code-btn"></button></code></pre>
<p>出力：  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-9-Side-by-Side-Comparison" class="common-anchor-header">ステップ9：サイドバイサイドの比較</h3><p>ライティングはソフトで均一、モデルのポーズは自然で、ムードはベストセラーの参考文献にマッチしている。</p>
<p>しかし、不十分なのは衣服のブレンドだ。カーディガンは着ているというより、モデルに貼り付けているように見え、ネックラインの白いラベルが透けて見える。シングルパス生成は、このような衣服と体のきめ細かな統合に苦労するので、要約で回避策を説明します。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image10.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-10-Batch-Generation-for-All-New-Products" class="common-anchor-header">ステップ10：すべての新商品のバッチ生成</h3><p>パイプライン全体を1つの関数にまとめ、残りの新製品に対して実行する。バッチコードは簡潔にするためここでは省略する。</p>
<p>バッチ結果では、2つの点が際立っています。<strong>Qwen 3.5から</strong>得られるスタイル プロンプトは、商品ごとに有意義に調整されます。サマードレスとウィンターニットでは、季節、ユースケース、アクセサリーに合わせた純粋に異なるシーン説明が得られます。<strong>ナノ・バナナ</strong>2から得られる画像は、ライティング、テクスチャー、構図において、実際のスタジオ写真に匹敵する。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/blog-images/image3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Conclusion" class="common-anchor-header">まとめ<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>この記事では、ナノ・バナナ2がEコマースの画像生成に何をもたらすかを取り上げ、実際の制作タスクにおいてオリジナルのナノ・バナナおよびProと比較し、Milvus、Qwen 3.5、ナノ・バナナ2を用いてベストセラーから画像へのパイプラインを構築する方法を説明した。</p>
<p>このパイプラインには4つの実用的な利点がある：</p>
<ul>
<li><strong>コントロールされたコスト、予測可能な予算。</strong>エンベッディング・モデル（Llama Nemotron Embed VL 1B v2）は、OpenRouter上で無料。Nano Banana 2は、Proの約半分の画像単価で動作し、ネイティブのマルチフォーマット出力により、効果的な請求書を2倍または3倍にしていた手直しサイクルがなくなります。シーズンごとに何千ものSKUを管理するEコマースチームにとって、この予測可能性は、予算オーバーになることなく、カタログに合わせて画像制作の規模を拡大できることを意味します。</li>
<li><strong>エンド・ツー・エンドの自動化で、掲載までの時間を短縮。</strong>平置きされた商品写真から完成した販促用画像までのフローは、手作業なしで実行されます。新商品は、倉庫の写真から数日ではなく数分で市場に出せる画像に仕上げることができ、これはカタログの回転率が最も高くなる繁忙期に最も重要です。</li>
<li><strong>ローカルGPUが不要で、参入障壁が低い。</strong>すべてのモデルはOpenRouter APIを通じて実行されます。MLインフラを持たず、専任のエンジニアリング人員もいないチームでも、ラップトップからこのパイプラインを実行できる。プロビジョニングも、メンテナンスも、ハードウェアへの先行投資も必要ありません。</li>
<li><strong>より高い検索精度、より強いブランド一貫性。</strong>Milvusは1つのクエリでデンス、スパース、スカラーフィルタリングを組み合わせ、商品マッチングにおいてシングルベクターアプローチを常に凌駕します。つまり、生成された画像は、ブランドの確立されたビジュアル言語、つまり既存のベストセラーがすでに証明した照明、構図、スタイリングをより確実に継承しています。出力された画像は、一般的なAIのストックアートのようではなく、御社の店舗にあるかのように見えます。</li>
</ul>
<p>また、制限もあります：</p>
<ul>
<li><strong>衣服と体のブレンド。</strong>シングルパス生成では、衣服が着用ではなく合成されたように見えることがあります。小さなアクセサリーのような細かいディテールがぼやけることがあります。回避策：段階的に生成します（最初に背景、次にモデルのポーズ、次に合成）。このマルチパスアプローチにより、各ステップの範囲が狭くなり、ブレンド品質が大幅に向上します。</li>
<li><strong>エッジケースのディテール忠実度。</strong>アクセサリー、パターン、テキストの多いレイアウトでは、シャープネスが失われることがあります。回避策：生成プロンプトに明示的な制約を追加します（「服が体に自然にフィットする、ラベルが露出していない、余分な要素がない、製品の詳細がシャープである」）。それでも特定の製品で品質が落ちる場合は、最終的にNano Banana Proに切り替えてください。</li>
</ul>
<p><a href="https://milvus.io/">Milvusは</a>、ハイブリッド検索ステップを駆動するオープンソースのベクターデータベースであり、もしあなたがあちこち調べたり、自分の商品写真を入れ替えたりしてみたいなら、<a href="https://milvus.io/docs"></a><a href="https://milvus.io/docs">、クイックスタートは</a>10分ほどで完了する。<a href="https://discord.gg/milvus"></a><a href="https://discord.gg/milvus">Discordと</a>Slackでかなり活発なコミュニティがあるので、これでどんなものを作るかぜひ見てみたい。また、Nano Banana 2を異なる製品群やより大きなカタログに対して実行することになったら、その結果を共有してください！その結果をぜひお聞かせください。</p>
<h2 id="Keep-Reading" class="common-anchor-header">続きを読む<button data-href="#Keep-Reading" class="anchor-icon" translate="no">
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
<li><a href="https://milvus.io/blog/nano-banana-milvus-turning-hype-into-enterprise-ready-multimodal-rag.md">Nano Banana + Milvus: ハイプをエンタープライズ対応のマルチモーダルRAGに変える</a></li>
<li><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClawとは？オープンソースAIエージェントの完全ガイド</a></li>
<li><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">OpenClawチュートリアル：ローカルAIアシスタントのためのSlackへの接続</a></li>
<li><a href="https://milvus.io/blog/we-extracted-openclaws-memory-system-and-opensourced-it-memsearch.md">OpenClawのメモリシステムを抽出し、オープンソース化した（memsearch）</a></li>
<li><a href="https://milvus.io/blog/adding-persistent-memory-to-claude-code-with-the-lightweight-memsearch-plugin.md">クロード・コードのための永続メモリ： memsearch ccplugin</a></li>
</ul>
