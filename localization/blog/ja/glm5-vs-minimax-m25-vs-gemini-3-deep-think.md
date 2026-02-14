---
id: glm5-vs-minimax-m25-vs-gemini-3-deep-think.md
title: GLM-5 vs MiniMax M2.5 vs Gemini 3 ディープシンク：AIエージェントスタックに合うモデルは？
author: 'Lumina Wang, Julie Xie'
date: 2026-02-14T00:00:00.000Z
cover: assets.zilliz.com/gemini_vs_minimax_vs_glm5_cover_1bc6d20c39.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Gemini, GLM, Minimax, ChatGPT'
meta_keywords: 'Gemini 3, GLM5, Minimax m2.5, ChatGPT'
meta_title: |
  GLM-5 vs MiniMax M2.5 vs Gemini 3 Deep Think Compared
desc: >-
  コーディング、推論、AIエージェントのためのGLM-5、MiniMax M2.5、Gemini 3 Deep
  Thinkのハンズオン比較。MilvusによるRAGチュートリアルを含みます。
origin: 'https://milvus.io/blog/glm5-vs-minimax-m25-vs-gemini-3-deep-think.md'
---
<p>わずか2日あまりの間に、3つの主要モデルが立て続けに発売された：GLM-5、MiniMax M2.5、そしてGemini 3 Deep Thinkだ。3つとも、<strong>コーディング、深い推論、エージェント的なワークフローという</strong>同じ機能をヘッドラインにしている。3つとも最先端の結果を謳っている。スペックシートに目を凝らせば、ほとんどマッチングゲームをすることができ、3つとも同じ論点を排除することができるだろう。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/comparsion_minimax_vs_glm5_vs_gemini3_d05715d4c2.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>もっと怖いのは、あなたの上司がすでにその発表を見ていることだ。あなたの上司はおそらくすでに発表を見ていて、週が明ける前に3つのモデルを使って9つの社内アプリを作るよう、うずうずしていることだろう。</p>
<p>では、実際にこれらのモデルの違いは何なのか？どのように選択すべきなのか？そして（いつものように）社内ナレッジベースを出荷するために<a href="https://milvus.io/">Milvusと</a>どのように接続するのでしょうか？このページをブックマークしてください。必要なものはすべて揃っています。</p>
<h2 id="GLM-5-MiniMax-M25-and-Gemini-3-Deep-Think-at-a-Glance" class="common-anchor-header">GLM-5、MiniMax M2.5、Gemini 3ディープシンクの概要<button data-href="#GLM-5-MiniMax-M25-and-Gemini-3-Deep-Think-at-a-Glance" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="GLM-5-leads-in-complex-system-engineering-and-long-horizon-agent-tasks" class="common-anchor-header">GLM-5が複雑なシステムエンジニアリングと長期のエージェントタスクでリード</h3><p>2月12日、Zhipuは複雑なシステムエンジニアリングと長時間エージェントワークフローを得意とするGLM-5を正式に発表した。</p>
<p>このモデルは355B-744Bのパラメータ（アクティブ40B）を持ち、28.5Tトークンで学習される。疎な注意メカニズムをSlimeと呼ばれる非同期強化学習フレームワークと統合することで、展開コストを抑えながら、品質を損なうことなく超長時間のコンテキストを処理することを可能にしている。</p>
<p>GLM-5は主要なベンチマークでオープンソースのパックをリードし、SWE-bench Verifiedでは1位（77.8）、Terminal Bench 2.0では1位（56.2）となり、MiniMax 2.5とGemini 3 Deep Thinkを上回った。とはいえ、そのヘッドラインスコアは、クロード・オーパス4.5やGPT-5.2のようなトップクラスのクローズドソースモデルには及ばない。ビジネスシミュレーション評価であるVending Bench 2では、GLM-5の年間利益は4,432ドルで、クローズドソースシステムとほぼ同じ範囲であった。</p>
<p>GLM-5はまた、システムエンジニアリングとロングホライズンエージェントの機能を大幅にアップグレードした。テキストや原材料を.docx、.pdf、.xlsxファイルに直接変換し、製品要求文書、授業計画、試験、スプレッドシート、財務報告書、フローチャート、メニューなどの特定の成果物を生成できるようになった。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_1_aa8211e962.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/benchmark_2_151ec06a6f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Gemini-3-Deep-Think-sets-a-new-bar-for-scientific-reasoning" class="common-anchor-header">ジェミニ3ディープシンク、科学的推論の新たな基準を設定</h3><p>2026年2月13日未明、グーグルはGemini 3 Deep Thinkを正式にリリースした。これは、私が（仮に）地球上で最強の研究・推論モデルと呼ぶメジャーアップグレードである。結局のところ、ジェミニは洗車テストに合格した唯一のモデルだった：<em>「洗車をしたいのだが、洗車場は50メートル先にある。車を洗車</em>したいが、洗車場は50メートル先にある。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/car_wash_test_gemini_859ee40db8.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/car_wash_test_gpt_0ec0dffd4b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Codeforcesで3455Eloを記録し、これは世界8位の競技プログラマーに相当する。2025年国際物理学、化学、数学オリンピックの筆記部門では金メダルに輝いた。コスト効率も画期的だ。ARC-AGI-1はタスクあたりわずか7.17ドルで、14ヶ月前のOpenAIのo3-previewと比べて280倍から420倍のコスト削減を実現している。応用面では、ディープシンクの最大の成果は科学研究である。専門家はすでに、専門的な数学論文の査読や、複雑な結晶成長準備ワークフローの最適化に利用している。</p>
<h3 id="MiniMax-M25-competes-on-cost-and-speed-for-production-workloads" class="common-anchor-header">MiniMax M2.5、生産ワークロードのコストとスピードで競争</h3><p>同日、MiniMaxはM2.5をリリースし、生産ユースケースにおけるコストと効率のチャンピオンに位置づけた。</p>
<p>M2.5は、業界で最も高速に動作するモデルファミリーの1つであり、コーディング、ツール呼び出し、検索、オフィス生産性において、SOTAの新記録を打ち立てた。コストは最大のセールスポイントである。高速版はおよそ100TPSで動作し、入力は<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">100万トークンあたり</annotation><mrow><mn>0.</mn><mi>30</mi><mn>パーミリオントークン、</mn></mrow><annotation encoding="application/x-tex">出力は</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord"></span></span></span></span>0<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.30</span><span class="mord mathnormal">パーミリオントークン</span><span class="mord">、</span></span></span></span>100万トークンあたり<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">2</span></span></span></span>.40<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">パーミリオントークン</span></span></span></span>である。50TPSバージョンは出力コストをさらに半分に削減する。スピードは従来のM2.1より37%向上し、SWEベンチ検証済みタスクを平均22.8分で完了し、クロード・オーパス4.6とほぼ同等です。機能面では、M2.5はGo、Rust、Kotlinを含む10以上の言語でのフルスタック開発をサポートしており、ゼロ・トゥ・ワンのシステム設計から完全なコードレビューまでをカバーする。オフィスワークフローでは、Office Skills機能がWord、PPT、Excelと深く統合されている。金融や法律のドメイン知識と組み合わせることで、直接使用できる調査レポートや財務モデルを生成することができる。</p>
<p>これがハイレベルな概要だ。次に、ハンズオン・テストでの実際のパフォーマンスを見てみよう。</p>
<h2 id="Hands-On-Comparisons" class="common-anchor-header">ハンズオン比較<button data-href="#Hands-On-Comparisons" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="3D-scene-rendering-Gemini-3-Deep-Think-produces-the-most-realistic-results" class="common-anchor-header">3Dシーンレンダリング：Gemini 3 Deep Thinkが最もリアルな結果を生成</h3><p>Gemini 3 Deep Thinkでユーザーがすでにテストしたプロンプトを、GLM-5とMiniMax M2.5で実行し、直接比較してみた。プロンプト：美術館にある古典的な油絵と見分けがつかないような完全な3Dの室内をレンダリングする、完全なThree.jsシーンを1つのHTMLファイルで構築する。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/emily_instgram_0af85c65fb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>ジェミニ3ディープシンク</p>
<iframe width="352" height="625" src="https://www.youtube.com/embed/Lhg-XsIM_CQ" title="gemini3 deep think test: 3D redering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>GLM-5</p>
<iframe width="707" height="561" src="https://www.youtube.com/embed/tTuW7qQBO1Y" title="GLM 5 test: 3D scene rendering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>ミニマックスM2.5</p>
<iframe width="594" height="561" src="https://www.youtube.com/embed/KJMhnXqa4Uc" title="minimax m2.5 test: 3D scene rendering" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p><strong>Gemini 3 Deep Thinkは</strong>、最強の結果をもたらした。プロンプトを正確に解釈し、高品質の3Dシーンを生成した。ライティングが際立っていた。シャドウの方向とフォールオフが自然で、窓から差し込む自然光の空間関係を明確に表現していた。ロウソクの半分溶けたような質感や赤い蝋シールの素材感など、細かいディテールも印象的だった。全体的なビジュアルの忠実度は高かった。</p>
<p><strong>GLM-5では</strong>、オブジェクトのモデリングやテクスチャの作り込みは細かかったが、ライティングシステムに課題が目立った。テーブルの影は、ソフトなトランジションのない硬い真っ黒なブロックとしてレンダリングされた。ワックスシールはテーブルの表面から浮いているように見え、オブジェクトとテーブルトップの接触関係を正しく処理できていませんでした。これらのアーティファクトは、グローバルイルミネーションと空間推論に改善の余地があることを示している。</p>
<p><strong>MiniMax M2.</strong>5は、複雑なシーン記述を効果的に解析することができませんでした。出力されたのは無秩序なパーティクルの動きだけで、正確な視覚的要件を持つ多層的なセマンティック命令を扱う際の、理解と生成の両方における重大な限界を示しています。</p>
<h3 id="SVG-generation-all-three-models-handle-it-differently" class="common-anchor-header">SVG生成：3つのモデルで扱いが異なる</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/simon_twitter_screenshot_fef1c01cbf.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>プロンプト</strong>カリフォルニア・ブラウン・ペリカンが自転車に乗っているSVGを生成せよ。自転車にはスポークと正しい形の自転車フレームがなければならない。ペリカンには特徴的な大きな袋があり、羽毛がはっきりと見えること。ペリカンがはっきりと自転車をこいでいること。画像には、カリフォルニア・ブラウン・ペリカンの繁殖期の羽が写っていること。</p>
<p><strong>ジェミニ3 ディープシンク</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/gemini_3_generated_image_182aaefe26.png" alt="Gemini 3 Deep Think" class="doc-image" id="gemini-3-deep-think" />
   </span> <span class="img-wrapper"> <span>ジェミニ3ディープシンク</span> </span></p>
<p><strong>GLM-5</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/GLM_5_generated_image_e84302d987.png" alt="GLM-5" class="doc-image" id="glm-5" />
   </span> <span class="img-wrapper"> <span>GLM-5</span> </span></p>
<p><strong>ミニマックスM2.5</strong></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/minimax_m2_5_generated_image_06d50f8fa7.png" alt="MiniMax M2.5" class="doc-image" id="minimax-m2.5" />
   </span> <span class="img-wrapper"> <span>ミニマックスM2.5</span> </span></p>
<p><strong>ジェミニ3ディープシンクは</strong>、全体的に最も完成度の高いSVGを作り出した。ペリカンの乗車姿勢は正確で、重心は自然にシートにあり、足はペダルにのってダイナミックなサイクリングポーズをとっている。羽のテクスチャは詳細でレイヤーになっている。弱点は、ペリカンの特徴である喉袋が大きく描かれすぎていて、全体のプロポーションが若干崩れていること。</p>
<p><strong>GLM-</strong>5は姿勢の問題が目立った。足はペダルの上に正しく置かれているが、全体的に座った姿勢が自然なライディング姿勢から離れており、ボディとシートの関係がずれて見える。とはいえ、スロートポーチのプロポーションはよく、羽の質感も申し分ない。</p>
<p><strong>MiniMax M2.</strong>5はミニマルなスタイルを採用し、背景の要素を完全に省略した。自転車上のペリカンの位置はおおよそ正しいが、ディテールワークが不十分。ハンドルの形は間違っており、羽のテクスチャはほとんど存在せず、首は太すぎ、画像にはあるはずのない白い楕円形のアーチファクトがある。</p>
<h2 id="How-to-Choose-Between-GLM-5-MiniMax-M25-and-Gemin-3-Deep-Think" class="common-anchor-header">GLM-5、MiniMax M2.5、ジェミン3ディープシンクの選び方<button data-href="#How-to-Choose-Between-GLM-5-MiniMax-M25-and-Gemin-3-Deep-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>すべてのテストにおいて、MiniMax M2.5は出力に最も時間がかかり、思考と推論に最も長い時間を要した。GLM-5は安定しており、ジェミニ3ディープシンクとほぼ同等のスピードであった。</p>
<p>以下は、私たちがまとめた簡単な選択ガイドです：</p>
<table>
<thead>
<tr><th>コアユースケース</th><th>推奨モデル</th><th>主な強み</th></tr>
</thead>
<tbody>
<tr><td>科学研究、高度な推論（物理、化学、数学、複雑なアルゴリズム設計）</td><td>ジェミニ3ディープシンク</td><td>アカデミックコンテストで金メダル級のパフォーマンス。トップレベルの科学データ検証Codeforcesでの世界トップクラスの競技プログラミング専門論文の論理的欠陥の特定など、実証済みの研究アプリケーション。(現在はGoogle AI Ultraの契約者と一部の企業ユーザーに限定されており、タスクごとのコストは比較的高い)</td></tr>
<tr><td>オープンソースの導入、企業イントラネットのカスタマイズ、フルスタック開発、オフィススキルの統合</td><td>Zhipu GLM-5</td><td>トップクラスのオープンソースモデル。システムレベルのエンジニアリング能力が高い。管理可能なコストでローカル展開をサポート。</td></tr>
<tr><td>コスト重視のワークロード、多言語プログラミング、クロスプラットフォーム開発（Web/Android/iOS/Windows）、オフィス互換性</td><td>ミニマックスM2.5</td><td>100TPSの場合：<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><annotation encoding="application/x-tex">100</annotation><mrow><mn>万入力トークンあたり0.</mn><mi>30</mi><mn>パーミリオントークン</mn><mo separator="true">、</mo></mrow></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord"></span></span></span></span>100万出力トークンあたり0<span class="katex"><span class="katex-html" aria-hidden="true"><span class="base"><span class="mord">.30</span><span class="mord mathnormal">パーミリオントークン</span><span class="mpunct">、</span></span></span></span>2.40パーミリオントークン。オフィス、コーディング、ツール・コールの各ベンチマークでSOTAを獲得。Multi-SWE-Benchで1位。強力な汎化。Droid/OpenCodeでの合格率はClaude Opus 4.6を上回る。</td></tr>
</tbody>
</table>
<h2 id="RAG-Tutorial-Wire-Up-GLM-5-with-Milvus-for-a-Knowledge-Base" class="common-anchor-header">RAGチュートリアル：GLM-5とmilvusの知識ベースへの配線<button data-href="#RAG-Tutorial-Wire-Up-GLM-5-with-Milvus-for-a-Knowledge-Base" class="anchor-icon" translate="no">
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
    </button></h2><p>GLM-5とMiniMax M2.5はどちらも<a href="https://openrouter.ai/">OpenRouterから</a>入手可能です。サインアップして、<code translate="no">OPENROUTER_API_KEY</code> 。</p>
<p>このチュートリアルではZhipuのGLM-5をLLMの例として使います。代わりにMiniMaxを使用するには、モデル名を<code translate="no">minimax/minimax-m2.5</code> に置き換えるだけです。</p>
<h3 id="Dependencies-and-environment-setup" class="common-anchor-header">依存関係と環境設定</h3><p>pymilvus、openai、requests、tqdmをインストールまたは最新版にアップグレードしてください：</p>
<pre><code translate="no">pip install --upgrade pymilvus openai requests tqdm 
<button class="copy-code-btn"></button></code></pre>
<p>このチュートリアルでは、LLMとしてGLM-5、埋め込みモデルとしてOpenAIのtext-embedding-3-smallを使用します。</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> os
os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>] = <span class="hljs-string">&quot;**********&quot;</span> 
<button class="copy-code-btn"></button></code></pre>
<h3 id="Data-preparation" class="common-anchor-header">データの準備</h3><p>Milvus 2.4.xのドキュメントのFAQページを私的知識ベースとして使用します。</p>
<p>zipファイルをダウンロードし、<code translate="no">milvus_docs</code> フォルダにドキュメントを解凍します：</p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus-docs/releases/download/v2<span class="hljs-number">.4</span><span class="hljs-number">.6</span>-preview/milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span>
unzip -q milvus_docs_2<span class="hljs-number">.4</span>.x_en.<span class="hljs-built_in">zip</span> -d milvus_docs
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">milvus_docs/en/faq</code> からすべてのMarkdownファイルを読み込みます。<code translate="no">&quot;# &quot;</code> で各ファイルを分割し、主要なセクションごとに内容を大まかに分けます：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> glob <span class="hljs-keyword">import</span> glob
text_lines = []
<span class="hljs-keyword">for</span> file_path <span class="hljs-keyword">in</span> glob(<span class="hljs-string">&quot;milvus_docs/en/faq/*.md&quot;</span>, recursive=<span class="hljs-literal">True</span>):
    <span class="hljs-keyword">with</span> <span class="hljs-built_in">open</span>(file_path, <span class="hljs-string">&quot;r&quot;</span>) <span class="hljs-keyword">as</span> file:
        file_text = file.read()
    text_lines += file_text.split(<span class="hljs-string">&quot;# &quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="LLM-and-embedding-model-setup" class="common-anchor-header">LLMと埋め込みモデルのセットアップ</h3><p>LLMにはGLM-5を、埋め込みモデルにはtext-embedding-3-smallを使います：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> openai <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>
glm_client = <span class="hljs-title class_">OpenAI</span>(
    api_key=os.<span class="hljs-property">environ</span>[<span class="hljs-string">&quot;OPENROUTER_API_KEY&quot;</span>],
    base_url=<span class="hljs-string">&quot;https://openrouter.ai/api/v1&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>テスト埋め込みを生成し、その次元と最初のいくつかの要素を表示します：</p>
<pre><code translate="no">EMBEDDING_MODEL = <span class="hljs-string">&quot;openai/text-embedding-3-small&quot;</span>  <span class="hljs-comment"># OpenRouter embedding model</span>
resp = glm_client.embeddings.create(
    model=EMBEDDING_MODEL,
    <span class="hljs-built_in">input</span>=[<span class="hljs-string">&quot;This is a test1&quot;</span>, <span class="hljs-string">&quot;This is a test2&quot;</span>],
)
test_embeddings = [d.embedding <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> resp.data]
embedding_dim = <span class="hljs-built_in">len</span>(test_embeddings[<span class="hljs-number">0</span>])
<span class="hljs-built_in">print</span>(embedding_dim)
<span class="hljs-built_in">print</span>(test_embeddings[<span class="hljs-number">0</span>][:<span class="hljs-number">10</span>])
<button class="copy-code-btn"></button></code></pre>
<p>出力</p>
<pre><code translate="no"><span class="hljs-number">1536</span>
[<span class="hljs-meta">0.010637564584612846, -0.017222722992300987, 0.05409347265958786, -0.04377825930714607, -0.017545074224472046, -0.04196695610880852, -0.0011963422875851393, 0.03837504982948303, 0.0008855042979121208, 0.015181170776486397</span>]
<button class="copy-code-btn"></button></code></pre>
<h3 id="Load-data-into-Milvus" class="common-anchor-header">Milvusにデータをロードする</h3><p><strong>コレクションを作成する：</strong></p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> <span class="hljs-title class_">MilvusClient</span>
milvus_client = <span class="hljs-title class_">MilvusClient</span>(uri=<span class="hljs-string">&quot;./milvus_demo.db&quot;</span>)
collection_name = <span class="hljs-string">&quot;my_rag_collection&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>MilvusClientの設定についてのメモ：</p>
<ul>
<li><p>URIをローカルファイル(例:<code translate="no">./milvus.db</code>)に設定するのが最も簡単なオプションです。これは自動的にMilvus Liteを使用し、そのファイルにすべてのデータを保存します。</p></li>
<li><p>大規模なデータの場合は、DockerやKubernetes上に、よりパフォーマンスの高いMilvusサーバをデプロイすることができます。その場合、サーバURI（例：<code translate="no">http://localhost:19530</code> ）を使用してください。</p></li>
<li><p>Zilliz Cloud（Milvusのフルマネージドクラウド版）を利用する場合は、Zilliz CloudコンソールからURIとトークンをPublic EndpointとAPIキーに設定します。</p></li>
</ul>
<p>コレクションが既に存在するか確認し、存在する場合は削除します：</p>
<pre><code translate="no">if milvus_client.has_collection(collection_name):
    milvus_client.drop_collection(collection_name)
<button class="copy-code-btn"></button></code></pre>
<p>指定したパラメータで新しいコレクションを作成します。フィールド定義を提供しない場合、Milvusは自動的にプライマリキーとしてデフォルトの<code translate="no">id</code> フィールドを作成し、ベクトルデータ用に<code translate="no">vector</code> フィールドを作成します。予約 JSON フィールドには、スキーマで定義されていないフィールドと値が格納されます：</p>
<pre><code translate="no">milvus_client.<span class="hljs-title function_">create_collection</span>(
    collection_name=collection_name,
    dimension=embedding_dim,
    metric_type=<span class="hljs-string">&quot;COSINE&quot;</span>,
    consistency_level=<span class="hljs-string">&quot;Strong&quot;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Insert-data" class="common-anchor-header">データの挿入</h3><p>テキスト行を繰り返し、埋め込みデータを生成し、Milvusにデータを挿入します。ここでの<code translate="no">text</code> フィールドはスキーマで定義されていません。Milvusの予約済みJSONフィールドにバックされたダイナミックフィールドとして自動的に追加されます：</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> tqdm <span class="hljs-keyword">import</span> tqdm
data = []
resp = glm_client.embeddings.create(model=EMBEDDING_MODEL, <span class="hljs-built_in">input</span>=text_lines)
doc_embeddings = [d.embedding <span class="hljs-keyword">for</span> d <span class="hljs-keyword">in</span> resp.data]
<span class="hljs-keyword">for</span> i, line <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(tqdm(text_lines, desc=<span class="hljs-string">&quot;Creating embeddings&quot;</span>)):
    data.append({<span class="hljs-string">&quot;id&quot;</span>: i, <span class="hljs-string">&quot;vector&quot;</span>: doc_embeddings[i], <span class="hljs-string">&quot;text&quot;</span>: line})
milvus_client.insert(collection_name=collection_name, data=data)
<button class="copy-code-btn"></button></code></pre>
<p>出力する：</p>
<pre><code translate="no">Creating embeddings: 100%|██████████████████████████| 72/72 [00:00&lt;00:00, 125203.10it/s]
{<span class="hljs-string">&#x27;insert_count&#x27;</span>: 72, <span class="hljs-string">&#x27;ids&#x27;</span>: [0, 1, 2, ..., 71], <span class="hljs-string">&#x27;cost&#x27;</span>: 0}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Build-the-RAG-pipeline" class="common-anchor-header">RAGパイプラインの構築</h3><p><strong>関連ドキュメントを取得する</strong></p>
<p>Milvusに関する一般的な質問をしてみましょう：</p>
<pre><code translate="no">question = <span class="hljs-string">&quot;How is data stored in milvus?&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>コレクションを検索して、最も関連性の高い上位3つの結果を探します：</p>
<pre><code translate="no">resp = glm_client.embeddings.create(model=EMBEDDING_MODEL, <span class="hljs-built_in">input</span>=[question])
question_embedding = resp.data[<span class="hljs-number">0</span>].embedding
search_res = milvus_client.search(
    collection_name=collection_name,
    data=[question_embedding],
    limit=<span class="hljs-number">3</span>,
    search_params={<span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>, <span class="hljs-string">&quot;params&quot;</span>: {}},
    output_fields=[<span class="hljs-string">&quot;text&quot;</span>],
)
<button class="copy-code-btn"></button></code></pre>
<p>結果は距離順にソートされる：</p>
<pre><code translate="no"><span class="hljs-keyword">import</span> json

retrieved_lines_with_distances = [
    (res[<span class="hljs-string">&quot;entity&quot;</span>][<span class="hljs-string">&quot;text&quot;</span>], res[<span class="hljs-string">&quot;distance&quot;</span>]) <span class="hljs-keyword">for</span> res <span class="hljs-keyword">in</span> search_res[<span class="hljs-number">0</span>]
]
<span class="hljs-built_in">print</span>(json.dumps(retrieved_lines_with_distances, indent=<span class="hljs-number">4</span>))

[
    [
        <span class="hljs-string">&quot; Where does Milvus store data?\n\nMilvus deals with two types of data, inserted data and metadata. \n\nInserted data, including vector data, scalar data, and collection-specific schema, are stored in persistent storage as incremental log. Milvus supports multiple object storage backends, including MinIO, AWS S3, Google Cloud Storage (GCS), Azure Blob Storage, Alibaba Cloud OSS, and Tencent Cloud Object Storage (COS).\n\nMetadata are generated within Milvus. Each Milvus module has its own metadata that are stored in etcd.\n\n###&quot;</span>,
        <span class="hljs-number">0.7826977372169495</span>
    ],
    [
        <span class="hljs-string">&quot;How does Milvus handle vector data types and precision?\n\nMilvus supports Binary, Float32, Float16, and BFloat16 vector types.\n\n- Binary vectors: Store binary data as sequences of 0s and 1s, used in image processing and information retrieval.\n- Float32 vectors: Default storage with a precision of about 7 decimal digits. Even Float64 values are stored with Float32 precision, leading to potential precision loss upon retrieval.\n- Float16 and BFloat16 vectors: Offer reduced precision and memory usage. Float16 is suitable for applications with limited bandwidth and storage, while BFloat16 balances range and efficiency, commonly used in deep learning to reduce computational requirements without significantly impacting accuracy.\n\n###&quot;</span>,
        <span class="hljs-number">0.6772387027740479</span>
    ],
    [
        <span class="hljs-string">&quot;How much does Milvus cost?\n\nMilvus is a 100% free open-source project.\n\nPlease adhere to Apache License 2.0 when using Milvus for production or distribution purposes.\n\nZilliz, the company behind Milvus, also offers a fully managed cloud version of the platform for those that don&#x27;t want to build and maintain their own distributed instance. Zilliz Cloud automatically maintains data reliability and allows users to pay only for what they use.\n\n###&quot;</span>,
        <span class="hljs-number">0.6467022895812988</span>
    ]
]
<button class="copy-code-btn"></button></code></pre>
<p><strong>LLMで応答を生成する：</strong></p>
<p>検索された文書をコンテキスト文字列に結合する：</p>
<pre><code translate="no">context = <span class="hljs-string">&quot;\n&quot;</span>.<span class="hljs-keyword">join</span>(
    [<span class="hljs-meta">line_with_distance[0</span>] <span class="hljs-keyword">for</span> line_with_distance <span class="hljs-keyword">in</span> retrieved_lines_with_distances]
)
<button class="copy-code-btn"></button></code></pre>
<p>システムプロンプトとユーザープロンプトを設定する。ユーザープロンプトはmilvusから検索された文書から作成される：</p>
<pre><code translate="no">SYSTEM_PROMPT = <span class="hljs-string">&quot;&quot;&quot;
Human: You are an AI assistant. You can find answers to the questions in the contextual passage snippets provided.
&quot;&quot;&quot;</span>
USER_PROMPT = <span class="hljs-string">f&quot;&quot;&quot;
Use the following pieces of information enclosed in &lt;context&gt; tags to provide an answer to the question enclosed in &lt;question&gt; tags.
&lt;context&gt;
<span class="hljs-subst">{context}</span>
&lt;/context&gt;
&lt;question&gt;
<span class="hljs-subst">{question}</span>
&lt;/question&gt;
&quot;&quot;&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p>GLM-5を呼び出し、最終的な回答を生成する：</p>
<pre><code translate="no">response = glm_client.chat.completions.create(
    model=<span class="hljs-string">&quot;z-ai/glm-5&quot;</span>,
    messages=[
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;system&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: SYSTEM_PROMPT},
        {<span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>, <span class="hljs-string">&quot;content&quot;</span>: USER_PROMPT},
    ],
)
<span class="hljs-built_in">print</span>(response.choices[<span class="hljs-number">0</span>].message.content)
<button class="copy-code-btn"></button></code></pre>
<p>GLM-5は構造化された回答を返す：</p>
<pre><code translate="no">Based <span class="hljs-keyword">on</span> the provided context, Milvus stores data <span class="hljs-keyword">in</span> two main ways, depending <span class="hljs-keyword">on</span> the data type:

<span class="hljs-number">1.</span> Inserted Data
   - What it includes: vector data, scalar data, <span class="hljs-keyword">and</span> collection-specific schema.
   - How it <span class="hljs-keyword">is</span> stored: <span class="hljs-keyword">in</span> persistent storage <span class="hljs-keyword">as</span> an incremental log.
   - Storage Backends: Milvus supports multiple <span class="hljs-built_in">object</span> storage backends, including MinIO, AWS S3, <span class="hljs-function">Google Cloud <span class="hljs-title">Storage</span> (<span class="hljs-params">GCS</span>), Azure Blob Storage, Alibaba Cloud OSS, <span class="hljs-keyword">and</span> Tencent Cloud Object <span class="hljs-title">Storage</span> (<span class="hljs-params">COS</span>).
   - Vector Specifics: vector data can be stored <span class="hljs-keyword">as</span> Binary <span class="hljs-title">vectors</span> (<span class="hljs-params">sequences of <span class="hljs-number">0</span>s <span class="hljs-keyword">and</span> <span class="hljs-number">1</span>s</span>), Float32 <span class="hljs-title">vectors</span> (<span class="hljs-params"><span class="hljs-literal">default</span> storage</span>), <span class="hljs-keyword">or</span> Float16 <span class="hljs-keyword">and</span> BFloat16 <span class="hljs-title">vectors</span> (<span class="hljs-params">offering reduced precision <span class="hljs-keyword">and</span> memory usage</span>).

2. Metadata
   - What it includes: data generated within Milvus modules.
   - How it <span class="hljs-keyword">is</span> stored: <span class="hljs-keyword">in</span> etcd.
</span><button class="copy-code-btn"></button></code></pre>
<h2 id="Conclusion-Pick-the-Model-Then-Build-the-Pipeline" class="common-anchor-header">結論モデルを選び、次にパイプラインを構築する<button data-href="#Conclusion-Pick-the-Model-Then-Build-the-Pipeline" class="anchor-icon" translate="no">
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
    </button></h2><p>3つのモデルはどれも強力だが、得意とするものが異なる。Gemini 3 Deep Thinkは、推論の深さがコストよりも重要な場合に選ぶべきモデルである。GLM-5は、ローカル展開とシステムレベルのエンジニアリングを必要とするチームにとって、最高のオープンソースオプションである。MiniMax M2.5は、本番ワークロード全体のスループットと予算を最適化する場合に適している。</p>
<p>選択するモデルは、方程式の半分に過ぎない。これらのいずれかを有用なアプリケーションにするには、データとともに拡張できる検索レイヤーが必要です。そこでMilvusの出番となる。上記のRAGチュートリアルは、OpenAI互換のモデルで動作するため、GLM-5、MiniMax M2.5、または将来のリリースを入れ替えるには、1行の変更で済みます。</p>
<p>もしあなたがローカルまたはオンプレミスのAIエージェントを設計していて、ストレージアーキテクチャ、セッション設計、または安全なロールバックについてもっと詳しく議論したい場合は、お気軽に<a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slackチャンネルに</a>ご参加ください。</p>
<p>また、Milvus Office Hoursで20分間の個別指導を予約することもできます。AIエージェントの構築についてさらに詳しく知りたい方は、こちらをご覧ください。</p>
<ul>
<li><p><a href="https://milvus.io/blog/how-to-build-productionready-multiagent-systems-with-agno-and-milvus.md">Agnoとmilvusで生産に適したマルチエージェントシステムを構築する方法</a></p></li>
<li><p><a href="https://zilliz.com/learn">RAGパイプラインに適したエンベッディングモデルの選択</a></p></li>
<li><p><a href="https://zilliz.com/learn">MilvusでAIエージェントを構築する方法</a></p></li>
<li><p><a href="https://milvus.io/blog/openclaw-formerly-clawdbot-moltbot-explained-a-complete-guide-to-the-autonomous-ai-agent.md">OpenClawとは？オープンソースAIエージェントの完全ガイド</a></p></li>
<li><p><a href="https://milvus.io/blog/stepbystep-guide-to-setting-up-openclaw-previously-clawdbotmoltbot-with-slack.md">OpenClawチュートリアル：ローカルAIアシスタントのためのSlackへの接続</a></p></li>
<li><p><a href="https://milvus.io/blog/clawdbot-long-running-ai-agents-langgraph-milvus.md">LangGraphとmilvusでClawdbotスタイルのAIエージェントを作る</a></p></li>
</ul>
