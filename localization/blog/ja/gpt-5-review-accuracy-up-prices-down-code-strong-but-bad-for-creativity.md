---
id: gpt-5-review-accuracy-up-prices-down-code-strong-but-bad-for-creativity.md
title: GPT-5レビュー：精度は上がり、価格は下がり、コードは強くなった。
author: Lumina Wang
date: 2025-08-08T00:00:00.000Z
cover: assets.zilliz.com/gpt_5_review_7df71f395a.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, OpenAI, gpt-5'
meta_keywords: 'Milvus, gpt-5, openai, chatgpt'
meta_title: |
  GPT-5 Review: Accuracy Up, Prices Down, Code Strong, Bad Creativity
desc: 開発者、特にエージェントやRAGパイプラインを構築している開発者にとって、このリリースはこれまでで最も有用なアップグレードかもしれません。
origin: >-
  https://milvus.io/blog/gpt-5-review-accuracy-up-prices-down-code-strong-but-bad-for-creativity.md
---
<p><strong>数ヶ月にわたる憶測の後、OpenAIはついに</strong> <a href="https://openai.com/gpt-5/"><strong>GPT-5を</strong></a><strong>出荷しました</strong><strong>。</strong>このモデルはGPT-4のような創造的な稲妻ではありませんが、開発者、特にエージェントとRAGパイプラインを構築している開発者にとっては、このリリースは静かに今までで最も有用なアップグレードかもしれません。</p>
<p><strong>ビルダーにとってのTL;DR</strong>GPT-5はアーキテクチャを統一し、マルチモーダルI/Oを強化し、事実上のエラー率を削減し、コンテキストを400kトークンまで拡張し、大規模な利用を手頃なものにします。しかし、創造性と文学的センスは著しく後退している。</p>
<h2 id="What’s-New-Under-the-Hood" class="common-anchor-header">ボンネットの下の新機能<button data-href="#What’s-New-Under-the-Hood" class="anchor-icon" translate="no">
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
<li><p><strong>統一されたコア</strong>- GPTデジタルシリーズとoシリーズ推論モデルを統合し、ロングチェーン推論とマルチモーダルを単一のアーキテクチャで実現。</p></li>
<li><p><strong>フルスペクトラム・マルチモーダル</strong>- テキスト、画像、音声、映像の入出力をすべて同じモデル内で実現。</p></li>
<li><p><strong>大幅な精度向上</strong></p>
<ul>
<li><p><code translate="no">gpt-5-main</code>:GPT-4oと比較して、事実誤認が44%減少。</p></li>
<li><p><code translate="no">gpt-5-thinking</code>o3との比較では、事実誤認が78%減少。</p></li>
</ul></li>
<li><p><strong>ドメインスキルの向上</strong>- コード生成、数学的推論、健康相談、構造化されたライティングに強く、幻覚が大幅に減少。</p></li>
</ul>
<p>GPT-5と並行して、OpenAIは<strong>3つの追加バリアントを</strong>リリースしました：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt_5_family_99a9bee18a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<table>
<thead>
<tr><th><strong>モデル</strong></th><th><strong>説明</strong></th><th><strong>入力 / $ 1Mトークンあたり</strong></th><th><strong>出力 / $ 1Mトークンあたり</strong></th><th><strong>知識の更新</strong></th></tr>
</thead>
<tbody>
<tr><td>gpt-5</td><td>メインモデル、ロングチェーン推論＋フルマルチモーダル</td><td>$1.25</td><td>$10.00</td><td>2024-10-01</td></tr>
<tr><td>gpt-5-チャット</td><td>ChatGPT の会話で使われる gpt-5 と同等のもの</td><td>-</td><td>-</td><td>2024-10-01</td></tr>
<tr><td>gpt-5-mini</td><td>60%安価、プログラミング性能は～90%維持</td><td>$0.25</td><td>$2.00</td><td>2024-05-31</td></tr>
<tr><td>gpt-5-nano</td><td>エッジ/オフライン、32K コンテキスト、レイテンシ &lt;40ms</td><td>$0.05</td><td>$0.40</td><td>2024-05-31</td></tr>
</tbody>
</table>
<p>GPT-5は、コード修復からマルチモーダル推論、医療タスクまで、25のベンチマーク・カテゴリにわたって記録を更新し、一貫した精度の向上を実現しました。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_1_8ebf1bed4b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_2_c43781126f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Why-Developers-Should-Care--Especially-for-RAG--Agents" class="common-anchor-header">開発者が注目すべき理由 - 特にRAGとエージェントについて<button data-href="#Why-Developers-Should-Care--Especially-for-RAG--Agents" class="anchor-icon" translate="no">
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
    </button></h2><p>我々のハンズオン・テストは、このリリースがRAG（Retrieval-Augmented Generation）とエージェント主導のワークフローにとって静かな革命であることを示唆している。</p>
<ol>
<li><p>API 入力コスト：<strong><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>1.25</mn><mo>パーミリオントークン</mo><mn>＊＊</mn><mo separator="true">；</mo><mi>出力</mi><mi>コスト</mi><mo>：</mo></mrow></semantics></math></span></span></strong>＊<strong><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mo>＊</mo></mrow></semantics></math></span></span></strong>1<strong><span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">.25 パーミリオントークン＊＊；出力コスト：</annotation></semantics></math></span></span></strong>**<strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span> 1</span></span></span></strong> <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.</span><span class="mord mathnormal">25permilliontokens</span><span class="mspace" style="margin-right:0.2222em;"></span><span class="mbin">∗</span></span></span></span></strong><span class="mspace" style="margin-right:0.2222em;"></span> <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8095em;vertical-align:-0.1944em;"></span> ∗</span></span></span></strong> <strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mpunct">;</span><span class="mspace" style="margin-right:0.1667em;"></span><span class="mord mathnormal">outputcost</span><span class="mspace" style="margin-right:0.2778em;"></span></span></span></span></strong>:<strong><span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mspace" style="margin-right:0.2778em;"></span></span><span class="base"><span class="strut" style="height:0.4653em;"></span><span class="mord">∗∗</span></span></span></span></strong>10。</p></li>
<li><p><strong>400kのコンテキストウィンドウ</strong>（o3/4oでは128k）により、複雑なマルチステップエージェントワークフローにおいて、コンテキストを切り刻むことなく状態を維持することができます。</p></li>
<li><p><strong>より少ない幻覚とより良いツールの使用</strong>- マルチステップチェーンツール呼び出しをサポートし、複雑な非標準タスクを処理し、実行の信頼性を向上させます。</p></li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt_tool_call_e6a86fc59c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Not-Without-Flaws" class="common-anchor-header">欠点がないわけではない<button data-href="#Not-Without-Flaws" class="anchor-icon" translate="no">
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
    </button></h2><p>技術的な進歩にもかかわらず、GPT-5はまだ明確な限界を示しています。</p>
<p>OpenAIの基調講演では、<em>52.8 &gt; 69.1 = 30.8という</em>奇妙な計算をするスライドが紹介された。また、我々独自のテストでは、飛行機が上昇する際の「ベルヌーイ効果」という教科書的だが間違った説明をモデルが自信たっぷりに繰り返した<strong>。</strong></p>
<p><strong>STEMのパフォーマンスが研ぎ澄まされる一方で、創造性の深さは低下している。</strong>長年のユーザーの多くが、文学的センスの低下を指摘している。詩はより平坦に感じられ、哲学的な会話はニュアンスを失い、長編の物語はより機械的になる。そのトレードオフは明らかで、技術的な領域では事実の正確さが増し、より強力な推論ができるようになったが、その代償として、かつてはGPTをほとんど人間的なものだと感じさせていた芸術的で探求的なトーンが犠牲になっている。</p>
<p>それでは、実際にGPT-5がハンズオン・テストでどのようなパフォーマンスを発揮するのか見てみよう。</p>
<h2 id="Coding-Tests" class="common-anchor-header">テストのコーディング<button data-href="#Coding-Tests" class="anchor-icon" translate="no">
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
    </button></h2><p>ユーザーが画像をアップロードし、それをマウスで動かせるようにするHTMLスクリプトを書くという簡単な作業から始めた。GPT-5は約9秒間停止し、その後インタラクションをうまく処理するコードを作成した。良いスタートだと感じた。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt52_7b04c9b41b.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>回転する六角形の中にポリゴンとボールの衝突検出を実装することである。GPT-5は最初のバージョンを約13秒で生成した。このコードには期待された機能はすべて含まれていたが、バグがあって実行できなかった。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/image_6_3e6a34572a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>そこでエディターの<strong>バグ修正</strong>オプションを使うと、GPT-5がエラーを修正して六角形がレンダリングされた。しかし、ボールは現れなかった。スポーンロジックが欠落しているか、間違っていたのだ。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/gpt51_6489df9914.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>まとめると、</strong>GPT-5はきれいで構造化された対話型コードを作成し、単純なランタイム・エラーから回復することができる。しかし、複雑なシナリオでは、重要なロジックを省略する危険性があるため、デプロイする前に人間によるレビューと反復が必要である。</p>
<h2 id="Reasoning-Test" class="common-anchor-header">推論テスト<button data-href="#Reasoning-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>私は、商品の色、価格、位置の手がかりを含む多段階の論理パズルを出題した。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/reasoning_test_7ea15ed25b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>質問</strong> <em>青い商品とその値段は？</em></p>
<p>GPT-5は、明確で論理的な説明とともに、わずか9秒で正解を導き出しました。このテストは、構造化された推論と迅速な推論におけるモデルの強みを補強するものでした。</p>
<h2 id="Writing-Test" class="common-anchor-header">ライティングテスト<button data-href="#Writing-Test" class="anchor-icon" translate="no">
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
    </button></h2><p>私はブログ、ソーシャルメディアへの投稿、その他の文章作成でChatGPTをよく利用します。今回のテストでは、Milvus 2.6の多言語アナライザーに関するブログを元に、GPT-5にLinkedInの投稿を作成してもらいました。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Writing_Test_4fe5fef775.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>アウトプットはよく整理され、元のブログの重要なポイントをすべて突いていたが、あまりにも形式的で予測可能なもので、ソーシャルフィードで興味を喚起するためのものというよりは、企業のプレスリリースのように感じられた。投稿を人間的で魅力的なものにする温かみ、リズム、個性が欠けていた。</p>
<p>その点、添えられたイラストは素晴らしく、明確でブランドらしく、Zillizの技術スタイルに完璧にマッチしていた。視覚的には完璧で、文章はもう少し創造的なエネルギーが必要だ。</p>
<h2 id="Longer-Context-Window--Death-of-RAG-and-VectorDB" class="common-anchor-header">長いコンテキストウィンドウ＝RAGとVectorDBの死？<button data-href="#Longer-Context-Window--Death-of-RAG-and-VectorDB" class="anchor-icon" translate="no">
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
    </button></h2><p>昨年、<a href="https://zilliz.com/blog/will-retrieval-augmented-generation-RAG-be-killed-by-long-context-LLMs">グーグルが<strong>Gemini 1.5 Proを</strong>発表</a>し、その超長い10Mトークンのコンテキストウィンドウを搭載したとき、我々はこのトピックに取り組んだ。当時、一部の人々は、RAGの終焉、さらにはデータベースの完全な終焉を予想した。RAGはまだ生きているだけでなく、繁栄している。実際には、<a href="https://milvus.io/"><strong>Milvusや</strong></a> <a href="https://zilliz.com/cloud"><strong>Zilliz Cloudの</strong></a>ようなベクターデータベースとともに、<em>より</em>高性能で生産的なものになっている。</p>
<p>そして今、GPT-5のコンテキストの長さが拡張され、より高度なツール・コール機能が搭載されたことで、再び疑問が浮かび上がってきた：<em>コンテキストの取り込みにベクターデータベース、あるいは専用のエージェント/RAGパイプラインが必要なのでしょうか？</em></p>
<p><strong>短い答え：絶対にイエスだ。まだ必要です。</strong></p>
<p>長いコンテキストは便利だが、構造化検索の代わりにはならない。マルチエージェントシステムは、長期的なアーキテクチャのトレンドであることに変わりはない。さらに、プライベートな非構造化データを安全に管理するとなると、ベクター・データベースは常に最終的なゲートキーパーとなる。</p>
<h2 id="Conclusion" class="common-anchor-header">結論<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>OpenAIのローンチイベントを見たり、私自身のハンズオン・テストを実施した結果、GPT-5は劇的な飛躍というよりは、過去の長所をうまくアップグレードして洗練されたブレンドのように感じた。それは悪いことではなく、大規模なモデルが遭遇し始めたアーキテクチャとデータ品質の限界の兆候なのだ。</p>
<p>諺にもあるように、<em>厳しい批判は大きな期待から生まれる</em>。GPT-5に対する失望は、OpenAIが自ら設定した非常に高いハードルから来るものだ。そして、より良い精度、より安い価格、統合されたマルチモーダルサポートは、依然として価値ある勝利です。エージェントやRAGパイプラインを構築する開発者にとって、これはこれまでで最も有用なアップグレードかもしれません。</p>
<p>何人かの友人は、GPT-4oの "オンライン記念 "を作ろうと冗談を言っている。私はこの変化は気にならない-GPT-5は温厚でおしゃべりではないかもしれないが、その直接的でナンセンスなスタイルは爽やかでストレートに感じられる。</p>
<p><strong>あなたはどうですか？</strong>私たちの<a href="https://discord.com/invite/8uyFbECzPX">Discordに</a>参加するか、<a href="https://www.linkedin.com/company/the-milvus-project/">LinkedInと</a> <a href="https://x.com/milvusio">Xで</a>会話に参加してください。</p>
