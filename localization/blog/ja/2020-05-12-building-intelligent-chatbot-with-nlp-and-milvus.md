---
id: building-intelligent-chatbot-with-nlp-and-milvus.md
title: 全体的なアーキテクチャ
author: milvus
date: 2020-05-12T22:33:34.726Z
desc: 次世代QAボットの登場
cover: assets.zilliz.com/header_ce3a0e103d.png
tag: Scenarios
canonicalUrl: 'https://zilliz.com/blog/building-intelligent-chatbot-with-nlp-and-milvus'
---
<custom-h1>NLPとmilvusによるインテリジェントQAシステムの構築</custom-h1><p>Milvusプロジェクト：github.com/milvus-io/milvus</p>
<p>質問応答システムは自然言語処理の分野でよく使われる。自然言語の形式で質問に答えるために使用され、幅広い用途がある。代表的なアプリケーションには、インテリジェントな音声対話、オンラインカスタマーサービス、知識獲得、パーソナライズされた感情的なチャットなどがあります。ほとんどの質問応答システムは、生成質問応答システムと検索質問応答システム、シングルラウンド質問応答システムとマルチラウンド質問応答システム、オープン質問応答システム、特定質問応答システムに分類することができます。</p>
<p>本稿では、主に特定の分野向けに設計されたQAシステムを扱う。これは通常、知的接客ロボットと呼ばれるものである。これまで、接客ロボットの構築には、通常、ドメイン知識を一連のルールや知識グラフに変換する必要があった。この構築プロセスは「人間」の知性に大きく依存している。自然言語処理（NLP）にディープラーニングを応用することで、マッチングした質問に対する答えを、文書から直接機械が自動的に見つけ出すことができる。ディープラーニングの言語モデルは、質問と文書を意味ベクトルに変換し、一致する答えを見つける。</p>
<p>この記事では、GoogleのオープンソースのBERTモデルとオープンソースのベクトル検索エンジンであるMilvusを使用して、意味理解に基づくQ&amp;Aボットを迅速に構築する。</p>
<h2 id="Overall-Architecture" class="common-anchor-header">全体的なアーキテクチャ<button data-href="#Overall-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>この記事では、意味的類似性マッチングによる質問応答システムを実装する。一般的な構築プロセスは以下の通りである：</p>
<ol>
<li>特定の分野の回答を持つ多数の質問（標準質問セット）を取得する。</li>
<li>BERTモデルを使用して、これらの質問を特徴ベクトルに変換し、Milvusに格納する。そして、Milvusは、各特徴ベクトルにベクトルIDを同時に割り当てます。</li>
<li>これらの代表的な質問 ID と対応する回答を PostgreSQL に格納します。</li>
</ol>
<p>ユーザが質問をすると</p>
<ol>
<li>BERT モデルは、それを特徴ベクトルに変換する。</li>
<li>Milvus は、類似性検索を実行し、質問に最も類似する ID を取得します。</li>
<li>PostgreSQL は、対応する回答を返す。</li>
</ol>
<p>システム・アーキテクチャ図は以下のとおりである（青い線はインポート処理、黄色い線はクエリ処理を表す）：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/1_system_architecture_milvus_bert_postgresql_63de466754.png" alt="1-system-architecture-milvus-bert-postgresql.png" class="doc-image" id="1-system-architecture-milvus-bert-postgresql.png" />
   </span> <span class="img-wrapper"> <span>1-system-architecture-milvus-bert-postgresql.png</span> </span></p>
<p>次に、オンラインQ&amp;Aシステムを構築する方法を順を追って説明します。</p>
<h2 id="Steps-to-Build-the-QA-System" class="common-anchor-header">Q&amp;Aシステム構築のステップ<button data-href="#Steps-to-Build-the-QA-System" class="anchor-icon" translate="no">
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
    </button></h2><p>始める前に、MilvusとPostgreSQLをインストールする必要があります。具体的なインストール手順については、Milvus公式サイトをご覧ください。</p>
<h3 id="1-Data-preparation" class="common-anchor-header">1.データの準備</h3><p>本記事の実験データは、https://github.com/chatopera/insuranceqa-corpus-zh。</p>
<p>このデータセットには、保険業界に関する質問と回答のデータ・ペアが含まれている。本稿では、その中から20,000の質問と回答のペアを抽出する。この質問と回答のデータセットを通して、保険業界向けの接客ロボットを素早く構築することができる。</p>
<h3 id="2-Generate-feature-vectors" class="common-anchor-header">2.特徴ベクトルの生成</h3><p>このシステムは、BERTが事前に訓練したモデルを使用します。サービスを開始する前に、以下のリンクからダウンロードしてください： https://storage.googleapis.com/bert_models/2018_10_18/cased_L-24_H-1024_A-16.zip</p>
<p>このモデルを使用して、質問データベースを将来の類似検索用の特徴ベクトルに変換します。BERT サービスの詳細については、https://github.com/hanxiao/bert-as-service を参照してください。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_code_block_e1b2021a91.png" alt="2-code-block.png" class="doc-image" id="2-code-block.png" />
   </span> <span class="img-wrapper"> <span>2-コードブロック.png</span> </span></p>
<h3 id="3-Import-to-Milvus-and-PostgreSQL" class="common-anchor-header">3.MilvusおよびPostgreSQLへのインポート</h3><p>生成された特徴ベクトルを正規化して Milvus にインポートし、Milvus が返す ID と対応する回答を PostgreSQL にインポートする。PostgreSQL のテーブル構造を以下に示す：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_import_milvus_postgresql_bb2a258c61.png" alt="3-import-milvus-postgresql.png" class="doc-image" id="3-import-milvus-postgresql.png" />
   </span> <span class="img-wrapper"> <span>3-import-milvus-postgresql.png</span> </span></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_import_milvus_postgresql_2abc29a4c4.png" alt="4-import-milvus-postgresql.png" class="doc-image" id="4-import-milvus-postgresql.png" />
   </span> <span class="img-wrapper"> <span>4-import-milvus-postgresql.png</span> </span></p>
<h3 id="4-Retrieve-Answers" class="common-anchor-header">4.回答の取得</h3><p>ユーザは質問を入力し、BERTを通して特徴ベクトルを生成した後、milvusライブラリから最も類似した質問を見つけることができる。この記事では、2つの文章間の類似性を表すために余弦距離を使用しています。すべてのベクトルは正規化されているため、2つの特徴ベクトルの余弦距離が1に近いほど、類似度が高くなります。</p>
<p>実際には、システムにはライブラリに完全に一致した質問がない場合があります。その場合、0.9のしきい値を設定することができます。検索された最大の類似性距離がこのしきい値より小さい場合、システムは関連する質問を含まないことをプロンプトします。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_retrieve_answers_6424db1032.png" alt="4-retrieve-answers.png" class="doc-image" id="4-retrieve-answers.png" />
   </span> <span class="img-wrapper"> <span>4-答えを検索.png</span> </span></p>
<h2 id="System-Demonstration" class="common-anchor-header">システムのデモンストレーション<button data-href="#System-Demonstration" class="anchor-icon" translate="no">
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
    </button></h2><p>以下にシステムのインターフェイス例を示します：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_milvus_QA_system_application_e5860cee42.png" alt="5-milvus-QA-system-application.png" class="doc-image" id="5-milvus-qa-system-application.png" />
   </span> <span class="img-wrapper"> <span>5-milvus-QA-system-application.png</span> </span></p>
<p>ダイアログボックスに質問を入力すると、対応する回答が表示されます：</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_milvus_QA_system_application_2_8064237e2a.png" alt="5-milvus-QA-system-application-2.png" class="doc-image" id="5-milvus-qa-system-application-2.png" />
   </span> <span class="img-wrapper"> <span>5-milvus-QA-system-application-2.png</span> </span></p>
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
    </button></h2><p>この記事をお読みになり、ご自身のQ&amp;Aシステムを簡単に構築できることがお分かりいただけたと思います。</p>
<p>BERT モデルを使用すると、テキスト・コーパスを事前に分類および整理する必要がなくなります。同時に、オープンソースのベクトル検索エンジンMilvusの高性能と高いスケーラビリティのおかげで、QAシステムは最大数億のテキストコーパスをサポートすることができます。</p>
<p>MilvusはLinux AI (LF AI) Foundationに正式に参加し、インキュベーションを行っています。Milvusコミュニティに参加し、AI技術の応用を加速させるために私たちと一緒に働くことを歓迎します！</p>
<p>=&gt; オンラインデモはこちら: https://www.milvus.io/scenarios</p>
