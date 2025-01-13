---
id: 2021-12-03-why-to-choose-fastapi-over-flask.md
title: なぜFlaskではなくFastAPIを選ぶのか？
author: Yunmei
date: 2021-12-03T00:00:00.000Z
desc: アプリケーションのシナリオに応じて適切なフレームワークを選択する。
cover: assets.zilliz.com/1_d5de035def.png
tag: Engineering
isPublish: false
---
<p>オープンソースのベクターデータベースであるMilvusをすぐに使い始められるように、もう一つの関連オープンソースプロジェクトである<a href="https://github.com/milvus-io/bootcamp">Milvus Bootcampを</a>GitHubで公開しました。Milvus Bootcampでは、ベンチマークテスト用のスクリプトやデータを提供するだけでなく、Milvusを使って逆画像検索システム、動画解析システム、QAチャットボット、レコメンダーシステムなどのMVP（minimum viable product）を構築するプロジェクトも含まれています。Milvus Bootcampでは、非構造化データだらけの世界でベクトル類似検索の適用方法を学び、実際に体験することができます。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/2_5b60157b4d.png" alt="2.png" class="doc-image" id="2.png" />
   </span> <span class="img-wrapper"> <span>2.png</span> </span></p>
<p>Milvus Bootcampのプロジェクトには、フロントエンドとバックエンドの両方のサービスを提供しています。しかし、最近、採用するウェブフレームワークをFlaskからFastAPIに変更することを決定しました。</p>
<p>本記事では、Milvus Bootcampで採用するWebフレームワークをFlaskからFastAPIに変更した理由を明らかにすることで、Milvus Bootcampで採用するWebフレームワークを変更した動機について説明します。</p>
<h2 id="Web-frameworks-for-Python" class="common-anchor-header">PythonのWebフレームワーク<button data-href="#Web-frameworks-for-Python" class="anchor-icon" translate="no">
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
    </button></h2><p>Webフレームワークとは、パッケージやモジュールの集合体を指します。Webアプリケーションやサービスを書くための、Web開発のためのソフトウェアアーキテクチャの集合であり、プロトコル、ソケット、プロセス/スレッド管理などの低レベルの詳細を処理する手間を省くことができます。ウェブフレームワークを使えば、コードをフレームワークに "プラグイン "するだけで、データキャッシュ、データベースアクセス、データセキュリティの検証などの処理に余計な注意を払う必要がなくなるため、ウェブアプリケーション開発の作業負荷を大幅に軽減することができます。PythonのWebフレームワークとは何かについては、<a href="https://wiki.python.org/moin/WebFrameworks">Webフレームワークを</a>参照してください。</p>
<p>PythonのWebフレームワークには様々な種類があります。Django、Flask、Tornado、FastAPIなどが主流です。</p>
<h3 id="Flask" class="common-anchor-header">Flask</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/3_1abd170939.png" alt="3.png" class="doc-image" id="3.png" />
   </span> <span class="img-wrapper"> <span>3.png</span> </span></p>
<p><a href="https://flask.palletsprojects.com/en/2.0.x/">Flaskは</a>Python用に設計された軽量なマイクロフレームワークで、シンプルで使いやすいコアを持ち、独自のWebアプリケーションを開発することができます。また、Flaskのコアは拡張可能です。そのため、Flask は、Web アプリケーション開発中の個人的なニーズを満たすために、様々な機能のオンデマンド拡張をサポートしています。つまり、Flaskの様々なプラグインライブラリを使えば、強力なWebサイトを開発することができるのです。</p>
<p>Flaskには以下のような特徴があります：</p>
<ol>
<li>Flaskはマイクロフレームワークであり、共有機能を提供するために他の特定のツールやサードパーティライブラリのコンポーネントに依存しない。Flaskはデータベースの抽象化レイヤーを持たず、フォームバリデーションも不要です。しかし、Flaskは非常に拡張性が高く、Flask自体の実装と同様の方法でアプリケーションの機能追加をサポートしています。関連する拡張機能には、オブジェクトリレーショナルマッパー、フォームバリデーション、アップロード処理、オープン認証技術、Webフレームワーク用に設計されたいくつかの一般的なツールなどがあります。</li>
<li>Flaskは<a href="https://wsgi.readthedocs.io/">WSGI</a>（Web Server Gateway Interface）をベースにしたWebアプリケーションフレームワークです。WSGIは、Python言語で定義されたWebアプリケーションやフレームワークとWebサーバを接続するシンプルなインターフェースです。</li>
<li>Flaskには<a href="https://www.palletsprojects.com/p/werkzeug">Werkzeugと</a> <a href="https://www.palletsprojects.com/p/jinja">Jinja2という</a>2つのコア関数ライブラリがあります。Werkzeugはリクエスト、レスポンスオブジェクトと実用的な関数を実装したWSGIツールキットで、その上にWebフレームワークを構築することができます。Jinja2は、Python用の人気のあるフル機能のテンプレートエンジンです。Unicodeを完全にサポートし、オプションですが広く採用されている統合サンドボックス実行環境を備えています。</li>
</ol>
<h3 id="FastAPI" class="common-anchor-header">FastAPI</h3><p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/4_05cb0dac4e.png" alt="4.png" class="doc-image" id="4.png" />
   </span> <span class="img-wrapper"> <span>4.png</span> </span></p>
<p><a href="https://fastapi.tiangolo.com/">FastAPI</a>は、Go や NodeJS と同レベルの高いパフォーマンスを持つ、最新の Python Web アプリケーションフレームワークです。FastAPIのコアは<a href="https://www.starlette.io/">Starletteと</a> <a href="https://pydantic-docs.helpmanual.io/">Pydanticに基づいて</a>います。Starletteは、高性能な<a href="https://docs.python.org/3/library/asyncio.html">Asyncio</a>サービスを構築するための軽量な<a href="https://asgi.readthedocs.io/">ASGI</a>(Asynchronous Server Gateway Interface)フレームワークツールキットです。Pydanticは、Pythonの型ヒントに基づいたデータ検証、シリアライズ、ドキュメント化を定義するライブラリです。</p>
<p>FastAPIには次のような特徴がある：</p>
<ol>
<li>FastAPIは、ネットワークプロトコルサービスとPythonアプリケーションを接続する非同期ゲートウェイプロトコルインタフェースであるASGIをベースにしたWebアプリケーションフレームワークです。FastAPI は、HTTP、HTTP2、WebSocket など、さまざまな一般的なプロトコルを処理できます。</li>
<li>FastAPI は Pydantic をベースにしており、インターフェースのデータ型をチェックする機能を提供します。インターフェイスのパラメータを追加で検証したり、パラメータが空かどうかやデータ型が正しいかどうかを検証するために余分なコードを書く必要はありません。FastAPI を使用することで、コードのヒューマン エラーを効果的に回避し、開発効率を向上できます。</li>
<li>FastAPIは、<a href="https://swagger.io/specification/">OpenAPI</a>（旧Swagger）と<a href="https://www.redoc.com/">Redocの</a>2つのフォーマットでドキュメントをサポートします。そのため、ユーザーとして追加のインターフェース・ドキュメントを書くために余分な時間を費やす必要はありません。FastAPIが提供するOpenAPIドキュメントは以下のスクリーンショットの通りです。</li>
</ol>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/5_d91d34cb0f.png" alt="5.png" class="doc-image" id="5.png" />
   </span> <span class="img-wrapper"> <span>5.png</span> </span></p>
<h3 id="Flask-Vs-FastAPI" class="common-anchor-header">Flask 対 FastAPI</h3><p>以下の表は、いくつかの側面における Flask と FastAPI の違いを示しています。</p>
<table>
<thead>
<tr><th></th><th><strong>FastAPI</strong></th><th><strong>フラスコ</strong></th></tr>
</thead>
<tbody>
<tr><td><strong>インターフェース・ゲートウェイ</strong></td><td>ASGI</td><td>WSGI</td></tr>
<tr><td><strong>非同期フレームワーク</strong></td><td>✅</td><td>❌</td></tr>
<tr><td><strong>パフォーマンス</strong></td><td>より速い</td><td>遅い</td></tr>
<tr><td><strong>インタラクティブdoc</strong></td><td>OpenAPI、Redoc</td><td>なし</td></tr>
<tr><td><strong>データ検証</strong></td><td>✅</td><td>❌</td></tr>
<tr><td><strong>開発コスト</strong></td><td>低い</td><td>高い</td></tr>
<tr><td><strong>使いやすさ</strong></td><td>低い</td><td>高い</td></tr>
<tr><td><strong>柔軟性</strong></td><td>柔軟性が低い</td><td>柔軟性が高い</td></tr>
<tr><td><strong>コミュニティ</strong></td><td>小規模</td><td>より活発</td></tr>
</tbody>
</table>
<h2 id="Why-FastAPI" class="common-anchor-header">なぜFastAPIなのか？<button data-href="#Why-FastAPI" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus BootcampのプロジェクトにどのPython Webアプリケーションフレームワークを選ぶか決める前に、Django、Flask、FastAPI、Tornadoなど、いくつかの主流のフレームワークを調査しました。Milvus Bootcampのプロジェクトは皆さんの参考となるため、軽量で器用な外部フレームワークを採用することを優先しました。このルールに従って、私たちはFlaskとFastAPIに選択肢を絞りました。</p>
<p>この2つのウェブ・フレームワークの比較は、前のセクションでご覧いただけます。以下は、Milvus BootcampのプロジェクトにFlaskではなくFastAPIを選んだ動機の詳細です。いくつかの理由があります：</p>
<h3 id="1-Performance" class="common-anchor-header">1.パフォーマンス</h3><p>Milvus Bootcampのほとんどのプロジェクトは、逆画像検索システム、QAチャットボット、テキスト検索エンジンを中心に構築されており、いずれもリアルタイムデータ処理への要求が高い。したがって、優れたパフォーマンスを持つフレームワークが必要であり、これこそがFastAPIのハイライトです。そこで、システム性能の観点から、FastAPIを採用することにしました。</p>
<h3 id="2-Efficiency" class="common-anchor-header">2.効率性</h3><p>Flaskを利用する場合、入力データが空かどうかをシステムが判断するために、各インターフェースにデータ型検証のコードを記述する必要があります。しかし、FastAPIが自動データ型検証をサポートすることで、システム開発時のコーディングにおける人的ミスを回避し、開発効率を大幅に向上させることができます。ブートキャンプは、一種のトレーニングリソースとして位置づけられています。つまり、使用するコードやコンポーネントは、直感的で高効率でなければなりません。この観点から、システム効率を向上させ、ユーザーエクスペリエンスを高めるために FastAPI を選択しました。</p>
<h3 id="3-Asynchronous-framework" class="common-anchor-header">3.非同期フレームワーク</h3><p>FastAPIは本質的に非同期フレームワークです。元々、逆画像検索、動画解析、QAチャットボット、分子類似検索の4つの<a href="https://zilliz.com/milvus-demos?isZilliz=true">デモを</a>リリースしています。これらのデモでは、データセットをアップロードすると、すぐに「リクエストを受け取りました」というプロンプトが表示される。そして、データがデモ・システムにアップロードされると、「データのアップロードに成功しました」という別のプロンプトが表示される。これは非同期プロセスで、この機能をサポートするフレームワークが必要です。FastAPI自体が非同期フレームワークです。全てのMilvusリソースを整合させるために、Milvus BootcampとMilvusデモの両方に単一の開発ツールとソフトウェアを採用することにしました。その結果、フレームワークをFlaskからFastAPIに変更しました。</p>
<h3 id="4-Automatic-interactive-documents" class="common-anchor-header">4.自動インタラクティブ・ドキュメント</h3><p>従来の方法では、サーバーサイドのコードを書き終えたら、インターフェイスを作成するために余分なドキュメントを書き、APIのテストやデバッグのために<a href="https://www.postman.com/">Postmanの</a>ようなツールを使う必要がありました。では、Milvus Bootcampのプロジェクトで、インターフェイスを作成するための追加のコードを書かずに、ウェブサーバサイドの開発部分だけを素早く始めたい場合はどうすればよいでしょうか？FastAPIが解決します。OpenAPIドキュメントを提供することで、FastAPIはAPIのテストやデバッグ、ユーザーインターフェイスを開発するためのフロントエンドチームとの共同作業の手間を省くことができます。FastAPI を使えば、コーディングに余分な労力をかけることなく、自動的でありながら直感的なインターフェイスで、構築されたアプリケーションを素早く試すことができます。</p>
<h3 id="5-User-friendliness" class="common-anchor-header">5.使いやすさ</h3><p>FastAPI は使いやすく、開発しやすいので、プロジェクト自体の具体的な実装にもっと注意を払うことができます。Webフレームワークの開発に多くの時間を費やすことなく、Milvus Bootcampのプロジェクトの理解に集中することができます。</p>
<h2 id="Recap" class="common-anchor-header">まとめ<button data-href="#Recap" class="anchor-icon" translate="no">
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
    </button></h2><p>FlaskとFlastAPIにはそれぞれ長所と短所があります。新興のWebアプリケーションフレームワークであるFlastAPIは、成熟したツールキットとライブラリであるStarletteとPydanticをコアとして構築されています。FastAPIは高性能な非同期フレームワークです。その器用さ、拡張性、自動データ型検証のサポート、その他多くの強力な機能により、MilvusはFastAPIをMilvus Bootcampプロジェクトのフレームワークとして採用しました。</p>
<p>なお、ベクトル類似検索システムを実運用で構築する場合は、アプリケーションのシナリオに応じて適切なフレームワークを選択する必要があります。</p>
<h2 id="About-the-author" class="common-anchor-header">著者について<button data-href="#About-the-author" class="anchor-icon" translate="no">
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
    </button></h2><p>ZillizデータエンジニアのYunmei Liは、華中科技大学でコンピュータサイエンスの学位を取得。Zillizに入社して以来、オープンソースプロジェクトMilvusのソリューションを模索し、ユーザーがMilvusを実世界のシナリオに適用できるよう支援している。主にNLPとレコメンデーションシステムを研究しており、この2つの分野をさらに深めたいと考えている。一人で過ごす時間と読書が好き。</p>
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
<li><p>Milvusを使ってAIシステムを構築し、チュートリアルを読んでより実践的な経験を積んでください！</p>
<ul>
<li><a href="https://milvus.io/blog/2021-10-10-milvus-helps-analys-vedios.md">それは何ですか？彼女は誰？Milvusは動画をインテリジェントに分析します。</a></li>
<li><a href="https://milvus.io/blog/2021-09-26-onnx.md">ONNXとmilvusを使った画像検索のためのAIモデルの組み合わせ</a></li>
<li><a href="https://milvus.io/blog/dna-sequence-classification-based-on-milvus.md">Milvusに基づくDNA配列分類</a></li>
<li><a href="https://milvus.io/blog/audio-retrieval-based-on-milvus.md">Milvusに基づく音声検索</a></li>
<li><a href="https://milvus.io/blog/building-video-search-system-with-milvus.md">動画検索システム構築の4ステップ</a></li>
<li><a href="https://milvus.io/blog/building-intelligent-chatbot-with-nlp-and-milvus.md">NLPとMilvusによるインテリジェントなQAシステムの構築</a></li>
<li><a href="https://milvus.io/blog/molecular-structure-similarity-with-milvus.md">新薬の発見を加速する</a></li>
</ul></li>
<li><p>オープンソースコミュニティ</p>
<ul>
<li><a href="https://bit.ly/307b7jC">GitHubで</a>Milvusを見つけ、貢献する。</li>
<li><a href="https://bit.ly/3qiyTEk">フォーラムで</a>コミュニティと交流する。</li>
<li><a href="https://bit.ly/3ob7kd8">Twitterで</a>つながる。</li>
</ul></li>
</ul>
