---
id: >-
  2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md
title: 短編動画プラットフォームLikeeがmilvusで重複動画を削除する方法
author: 'Xinyang Guo, Baoyu Han'
date: 2022-06-23T00:00:00.000Z
desc: LikeeがどのようにMilvusを使い、重複する動画を数ミリ秒で識別しているかをご覧ください。
cover: >-
  assets.zilliz.com/How_Short_video_Platform_Likee_Removes_Duplicate_Videos_with_Milvus_07bd75ec82.png
tag: Scenarios
tags: Use Cases of Milvus
canonicalUrl: >-
  https://milvus.io/blog/2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/How_Short_video_Platform_Likee_Removes_Duplicate_Videos_with_Milvus_07bd75ec82.png" alt="Cover image" class="doc-image" id="cover-image" />
   </span> <span class="img-wrapper"> <span>カバー画像</span> </span></p>
<blockquote>
<p>この記事はBIGOのエンジニア、Xinyang GuoとBaoyu Hanが執筆し、<a href="https://www.linkedin.cn/incareer/in/rosie-zhang-694528149">Rosie Zhangが</a>翻訳したものです。</p>
</blockquote>
<p><a href="https://www.bigo.sg/">BIGO Technology</a>（BIGO）は、シンガポールで最も急成長しているテクノロジー企業のひとつだ。人工知能技術を搭載したBIGOの動画ベースの製品とサービスは世界中で絶大な人気を得ており、150カ国以上で4億人以上のユーザーがいる。その中には、<a href="https://www.bigo.tv/bigo_intro/en.html?hk=true">Bigo Live</a>（ライブストリーミング）や<a href="https://likee.video/">Likee</a>（短編動画）が含まれる。</p>
<p>Likeeは、ユーザーが自分の瞬間を共有し、自分自身を表現し、世界とつながることができる世界的な短編動画作成プラットフォームです。ユーザーエクスペリエンスを向上させ、より質の高いコンテンツをユーザーに推薦するために、Likeeは毎日ユーザーによって生成される膨大な量の動画から重複する動画を除外する必要があり、これは簡単な作業ではありません。</p>
<p>このブログでは、BIGOがオープンソースのベクターデータベースである<a href="https://milvus.io">Milvusを</a>使用して、重複動画を効果的に除去する方法を紹介します。</p>
<p><strong>ジャンプ</strong></p>
<ul>
<li><a href="#Overview">概要</a></li>
<li><a href="#Video-deduplication-workflow">動画重複排除ワークフロー</a></li>
<li><a href="#System-architecture">システムアーキテクチャ</a></li>
<li><a href="#Using-Milvus-vector-database-to-power-similarity-search">Milvusを使った類似検索</a></li>
</ul>
<custom-h1>概要</custom-h1><p>Milvus は、超高速ベクトル検索を特徴とするオープンソースのベクトルデータベースです。Milvusを利用することで、Likeeは200ms以内に検索を完了し、高い再現率を実現しています。一方、<a href="https://milvus.io/docs/v2.0.x/scaleout.md#Scale-a-Milvus-Cluster">Milvus を水平方向に拡張する</a>ことで、Likee はベクトルクエリのスループットを向上させ、効率をさらに改善することに成功しました。</p>
<custom-h1>重複除外ワークフロー</custom-h1><p>Likeeはどのように重複動画を識別するのか？クエリ動画がLikeeのシステムに入力されるたびに、15～20フレームにカットされ、各フレームが特徴ベクトルに変換される。次に、ライクでは7億のベクトルからなるデータベースを検索し、上位K個の最も類似したベクトルを見つけます。上位K個のベクトルは、それぞれデータベース内の動画に対応する。ライクでは、最終結果を得るためにさらに詳細な検索を行い、削除する動画を決定する。</p>
<custom-h1>システムアーキテクチャ</custom-h1><p>Milvusを使用したライクの重複排除システムの仕組みについて詳しく見ていきましょう。下図に示すように、Likeeにアップロードされた新しい動画は、リアルタイムでデータストレージシステムであるKafkaに書き込まれ、Kafkaコンシューマーによって消費される。これらの動画の特徴ベクトルは、非構造化データ（動画）を特徴ベクトルに変換するディープラーニングモデルによって抽出される。これらの特徴ベクトルはシステムによってパッケージ化され、類似性監査人に送られる。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Likee_1_6f7ebcd8fc.png" alt="Architechure of Likee's video de-duplication system" class="doc-image" id="architechure-of-likee's-video-de-duplication-system" />
   </span> <span class="img-wrapper"> <span>Likeeの動画重複排除システムの概略図</span> </span></p>
<p>抽出された特徴ベクトルは、Milvusによってインデックス化され、Cephに保存された後、<a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Milvusクエリノードによって読み込まれ</a>、さらに検索される。これらの特徴ベクトルの対応するビデオIDは、実際のニーズに応じてTiDBまたはPikaにも同時に保存される。</p>
<h3 id="Using-Milvus-vector-database-to-power-similarity-search" class="common-anchor-header">Milvusベクトルデータベースを使った類似検索</h3><p>類似ベクトルを検索する場合、何十億もの既存データと、日々生成される大量の新規データが、ベクトル検索エンジンの機能に大きな課題をもたらします。Likeeは徹底的な分析の結果、最終的にベクトル類似検索のために、高い性能と高い再現率を持つ分散型ベクトル検索エンジンMilvusを選択した。</p>
<p>下図に示すように、類似検索の手順は次のようになる：</p>
<ol>
<li><p>まずMilvusは、新しい動画から抽出された複数の特徴ベクトルのそれぞれについて、上位100個の類似ベクトルを呼び出すバッチ検索を行う。各類似ベクトルは対応するビデオIDにバインドされる。</p></li>
<li><p>次に、Milvusは動画IDを比較することで、重複する動画を削除し、残りの動画の特徴ベクトルをTiDBまたはPikaから取得する。</p></li>
<li><p>最後に、Milvusは検索された特徴ベクトルの各セットとクエリ動画の特徴ベクトルとの類似度を計算し、スコア化する。最もスコアの高い動画IDが結果として返される。こうして動画の類似検索が終了する。</p></li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/02_a24d251c8f.png" alt="Procedure of a similarity search" class="doc-image" id="procedure-of-a-similarity-search" />
   </span> <span class="img-wrapper"> <span>類似検索の手順</span> </span></p>
<p>Milvusは、高性能なベクトル検索エンジンとして、ライク社の動画重複排除システムで大きな成果を上げ、BIGOの短編動画ビジネスの成長に大きく貢献した。動画ビジネスにおいて、Milvusが適用できるシナリオは、違法コンテンツのブロックやパーソナライズされた動画推薦など、他にも数多くある。BIGOとMilvusの両社は、今後さらに多くの分野での協力を期待している。</p>
