---
id: milmil-a-milvus-powered-faq-chatbot-that-answers-questions-about-milvus.md
title: Milvus Milvusに関する質問に答えるMilvus搭載FAQチャットボット
author: milvus
date: 2021-07-20T07:21:43.897Z
desc: オープンソースのベクトル検索ツールを使って質問回答サービスを構築。
cover: assets.zilliz.com/milmil_4600f33f1c.jpg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/milmil-a-milvus-powered-faq-chatbot-that-answers-questions-about-milvus
---
<custom-h1>MilMil：Milvusに関する質問に答えるMilvus搭載FAQチャットボット</custom-h1><p>オープンソースコミュニティはこのほど、MilvusユーザーによるMilvusユーザーのためのMilvus FAQチャットボット「MilMil」を開発した。MilMilは<a href="https://milvus.io/">Milvus.ioで</a>24時間365日利用可能で、世界で最も先進的なオープンソースのベクターデータベースであるMilvusに関する一般的な質問に答えてくれる。</p>
<p>この質問回答システムは、Milvusユーザーが遭遇する一般的な問題をより迅速に解決するだけでなく、ユーザーからの投稿に基づいて新たな問題を特定するのに役立ちます。MilMilのデータベースには、このプロジェクトが2019年にオープンソースライセンスで初めてリリースされて以来、ユーザーから寄せられた質問が含まれている。質問は、Milvus 1.x以前とMilvus 2.0用の2つのコレクションに保存されている。</p>
<p>MilMilは現在英語のみで利用可能です。</p>
<h2 id="How-does-MilMil-work" class="common-anchor-header">MilMilはどのように動作しますか？<button data-href="#How-does-MilMil-work" class="anchor-icon" translate="no">
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
    </button></h2><p>MilMilはFAQデータベースのベクトル表現を得るために<em>センテントランスフォーマー/パラフレーズ-mpnet-base-v2</em>モデルに依存し、その後Milvusは意味的に類似した質問を返すベクトル類似検索に使用されます。</p>
<p>まず、自然言語処理（NLP）モデルであるBERTを用いて、FAQデータを意味ベクトルに変換する。次に、埋め込みはMilvusに挿入され、それぞれにユニークなIDが割り当てられる。最後に、質問と回答は、ベクトルIDとともにリレーショナルデータベースであるPostgreSQLに挿入される。</p>
<p>ユーザが質問を投稿すると、システムはそれをBERTを使用して特徴ベクトルに変換する。次に、Milvusを検索して、質問ベクトルと最も類似している5つのベクトルを検索し、それらのIDを取得する。最後に、検索されたベクトルIDに対応する質問と回答がユーザに返される。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/system_process_dca67a80a6.png" alt="system-process.png" class="doc-image" id="system-process.png" />
   </span> <span class="img-wrapper"> <span>システムプロセス.png</span> </span></p>
<p>Milvusブートキャンプの<a href="https://github.com/milvus-io/bootcamp/tree/master/solutions/question_answering_system">質問応答システム</a>プロジェクトを参照して、AIチャットボットを構築するために使用されるコードを調べてください。</p>
<h2 id="Ask-MilMil-about-Milvus" class="common-anchor-header">MilvusについてMilMilに聞く<button data-href="#Ask-MilMil-about-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>MilMilとチャットするには、<a href="https://milvus.io/">Milvus.ioの</a>任意のページに移動し、右下隅にある鳥のアイコンをクリックします。テキスト入力ボックスに質問を入力し、送信ボタンを押してください。MilMilは数ミリ秒であなたに返信します！また、左上のドロップダウンリストを使用すると、milvusの異なるバージョンの技術文書を切り替えることができます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/milvus_chatbot_icon_f3c25708ca.png" alt="milvus-chatbot-icon.png" class="doc-image" id="milvus-chatbot-icon.png" />
   </span> <span class="img-wrapper"> <span>milvus-chatbot-icon.png</span> </span></p>
<p>質問を送信すると、ボットはすぐにクエリの質問と意味的に類似した3つの質問を返します。回答を見る "をクリックすると、質問に対する回答の候補を閲覧することができます。"もっと見る "をクリックすると、検索に関連する他の質問を閲覧することができます。適切な回答が見つからない場合は、「ご意見・ご感想はこちら」をクリックして、メールアドレスとともにご質問ください。Milvusコミュニティからのヘルプがすぐに届きます！</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/chatbot_UI_0f4a7655d4.png" alt="chatbot_UI.png" class="doc-image" id="chatbot_ui.png" />
   </span> <span class="img-wrapper"> <span>チャットボット_UI.png</span> </span></p>
<p>MilMilをお試しいただき、ご意見をお聞かせください。質問、コメント、どんな形のフィードバックでも大歓迎です。</p>
<h2 id="Dont-be-a-stranger" class="common-anchor-header">知らない人にならないために<button data-href="#Dont-be-a-stranger" class="anchor-icon" translate="no">
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
<li><a href="https://github.com/milvus-io/milvus/">GitHubで</a>Milvusを見つける、またはMilvusに貢献する。</li>
<li><a href="https://join.slack.com/t/milvusio/shared_invite/zt-e0u4qu3k-bI2GDNys3ZqX1YCJ9OM~GQ">Slackで</a>コミュニティと交流する。</li>
<li><a href="https://twitter.com/milvusio">Twitterで</a>つながる。</li>
</ul>
