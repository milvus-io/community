---
id: >-
  hands-on-tutorial-build-rag-power-document-assistant-in-10-minutes-with-dify-and-milvus.md
title: ハンズオンチュートリアル：Difyとmilvusを使って10分でRAGパワー文書アシスタントを構築する
author: Ruben Winastwan
date: 2025-04-28T00:00:00.000Z
desc: >-
  DifyとMilvusを使用したRAG（Retrieval Augmented
  Generation）を使って、AIを搭載したドキュメントアシスタントを作成する方法を、このハンズオン開発者向けチュートリアルで学びましょう。
cover: assets.zilliz.com/build_rag_with_dify_and_milvus_2ab76c6afd.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'RAG, retrieval augmented generation, Dify, Milvus, no-code AI'
meta_title: |
  Build a RAG Document Assistant in 10 Minutes | Dify & Milvus Tutorial
origin: >-
  https://milvus.io/blog/hands-on-tutorial-build-rag-power-document-assistant-in-10-minutes-with-dify-and-milvus.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/build_rag_with_dify_and_milvus_2ab76c6afd.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>技術仕様書、社内Wiki、コード・ドキュメントなど数千ページに及ぶドキュメント・ライブラリ全体を、特定の質問に即座に答えるインテリジェントなAIアシスタントに変えられるとしたらどうだろう？</p>
<p>さらに良いことに、マージの衝突を修正するのにかかる時間よりも短い時間でそれを構築できるとしたら？</p>
<p>それが、正しい方法で実装された場合の<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>（<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval Augmented Generation：検索拡張世代</a>）の約束だ。</p>
<p>ChatGPTや他のLLMは印象的ですが、あなたの会社の特定のドキュメント、コードベース、ナレッジベースについて質問されると、すぐに限界に達します。RAGは、貴社独自のデータを会話に統合することで、このギャップを埋め、貴社の業務に直接関連するAI機能を提供します。</p>
<p>問題は？従来のRAGの実装は次のようなものでした：</p>
<ul>
<li><p>カスタム埋め込み生成パイプラインの作成</p></li>
<li><p>ベクター・データベースの設定とデプロイ</p></li>
<li><p>複雑なプロンプト・テンプレートの設計</p></li>
<li><p>検索ロジックと類似度閾値の構築</p></li>
<li><p>使いやすいインターフェースの作成</p></li>
</ul>
<p>しかし、もし結果に直接ジャンプできるとしたらどうでしょう？</p>
<p>このチュートリアルでは、開発者向けの2つのツールを使って簡単なRAGアプリケーションを構築します：</p>
<ul>
<li><p><a href="https://github.com/langgenius/dify">Dify</a>：最小限のコンフィギュレーションでRAGオーケストレーションを処理するオープンソースのプラットフォーム</p></li>
<li><p><a href="https://milvus.io/docs/overview.md">Milvus</a>：類似検索とAI検索のために作られた、非常に高速なオープンソースのベクトルデータベース。</p></li>
</ul>
<p>この10分間のガイドが終わるころには、機械学習の学位は必要なく、あなたが投げかけたあらゆる文書コレクションに関する詳細な質問に答えることができる、実用的なAIアシスタントを手に入れることができるだろう。</p>
<h2 id="What-Youll-Build" class="common-anchor-header">何を作るか<button data-href="#What-Youll-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>わずか数分のアクティブな作業で、あなたは以下を作成します：</p>
<ul>
<li><p>あらゆるPDFをクエリ可能な知識に変換する文書処理パイプライン</p></li>
<li><p>適切な情報を正確に見つけるベクトル検索システム</p></li>
<li><p>技術的な質問にピンポイントで回答するチャットボット・インターフェース</p></li>
<li><p>既存のツールと統合可能な展開可能なソリューション</p></li>
</ul>
<p>最大の特徴は？カスタムコードではなく、シンプルなユーザーインターフェース（UI）で設定できること。</p>
<h2 id="What-Youll-Need" class="common-anchor-header">必要なもの<button data-href="#What-Youll-Need" class="anchor-icon" translate="no">
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
<li><p>基本的なDockerの知識(<code translate="no">docker-compose up -d</code> レベル)</p></li>
<li><p>OpenAI APIキー</p></li>
<li><p>実験するためのPDFドキュメント（研究論文を使います）</p></li>
</ul>
<p>実際に役立つものを記録的な速さで作る準備はできていますか？さっそく始めましょう！</p>
<h2 id="Building-Your-RAG-Application-with-Milvus-and-Dify" class="common-anchor-header">MilvusとDifyを使ってRAGアプリケーションを作る<button data-href="#Building-Your-RAG-Application-with-Milvus-and-Dify" class="anchor-icon" translate="no">
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
    </button></h2><p>このセクションでは、Difyを使って簡単なRAGアプリを作ります。研究論文には、どのような論文を使っても構いませんが、今回は、Transformerアーキテクチャを紹介した有名な論文、<a href="https://arxiv.org/abs/1706.03762">&quot;Attention is All You Need</a>&quot;を使います。</p>
<p>Milvusをベクトルストレージとして使用し、必要なコンテキストをすべて保存する。埋め込みモデルとLLMには、OpenAIのモデルを使う。そのため、まずOpenAIのAPIキーを設定する必要があります。設定方法については<a href="https://platform.openai.com/docs/quickstart"> こちらを</a>参照してください。</p>
<h3 id="Step-1-Starting-Dify-and-Milvus-Containers" class="common-anchor-header">ステップ1：DifyとMilvusコンテナの起動</h3><p>この例では、Docker Composeを使ってDifyをセルフホストします。そのため、始める前にローカルマシンにDockerがインストールされていることを確認してください。インストールされていない場合は、<a href="https://docs.docker.com/desktop/"> Dockerのインストールページを</a>参照してインストールしてください。</p>
<p>Dockerをインストールしたら、以下のコマンドでDifyのソースコードをローカルマシンにクローンする必要がある：</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> &lt;&lt;<span class="hljs-string">https://github.com/langgenius/dify.git&gt;&gt;
</span><button class="copy-code-btn"></button></code></pre>
<p>次に、クローンしたソースコードの<code translate="no">docker</code> ディレクトリに行く。そこで、<code translate="no">.env</code> ファイルを以下のコマンドでコピーする必要がある：</p>
<pre><code translate="no"><span class="hljs-built_in">cd</span> dify/docker
<span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p><code translate="no">.env</code> ファイルには、ベクターデータベースの選択、ベクターデータベースへのアクセスに必要な認証情報、Difyアプリのアドレスなど、Difyアプリの起動に必要な設定が含まれています。</p>
<p>ここではMilvusをベクターデータベースとして使用しますので、<code translate="no">.env</code> ファイル内の変数<code translate="no">VECTOR_STORE</code> の値を<code translate="no">milvus</code> に変更する必要があります。また、デプロイ後にDockerコンテナ間で通信の問題が発生しないように、<code translate="no">MILVUS_URI</code> 変数を<code translate="no">http://host.docker.internal:19530</code> に変更する必要があります。</p>
<pre><code translate="no"><span class="hljs-variable constant_">VECTOR_STORE</span>=milvus
<span class="hljs-variable constant_">MILVUS_URI</span>=<span class="hljs-attr">http</span>:<span class="hljs-comment">//host.docker.internal:19530</span>
<button class="copy-code-btn"></button></code></pre>
<p>これでDockerコンテナを起動する準備ができた。そのために必要なのは、<code translate="no">docker compose up -d</code> コマンドを実行することだけだ。終了後、ターミナルに以下のような出力が表示される：</p>
<pre><code translate="no">docker compose up -d
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/docker_compose_179216f113.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>すべてのコンテナのステータスを確認し、<code translate="no">docker compose ps</code> コマンドで健全に稼働しているかどうかを確認できる。すべてのコンテナが健全であれば、以下のような出力が表示される：</p>
<pre><code translate="no">docker compose ps
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/docker_compose_2_1a084ba137.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>最後に、<a href="http://localhost/install"> </a>http://localhost/install にアクセスすると、Difyのランディングページが表示され、すぐにサインアップしてRAGアプリケーションの構築を開始することができる。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_login_d2bf4d4468.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>サインアップしたら、あとは認証情報を使ってDifyにログインするだけだ。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/difi_login_2_5a8ea9c2d6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Setting-Up-OpenAI-API-Key" class="common-anchor-header">ステップ 2: OpenAI API キーの設定</h3><p>Difyにサインアップした後、最初にしなければならないことは、エンベッディングモデルとLLMを呼び出すために使用するAPIキーを設定することです。OpenAIのモデルを使うので、OpenAIのAPIキーをプロファイルに挿入する必要があります。そのためには、下のスクリーンショットのように、UIの右上にあるプロフィールにカーソルを合わせて、"Settings" に行く：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_settings_8ff08fab97.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>次に、"Model Provider" に行き、OpenAI にカーソルを合わせ、"Setup" をクリックします。すると、OpenAIのAPIキーを入力するポップアップ画面が表示されます。これで、OpenAIのモデルを埋め込みモデルとLLMとして使う準備ができました。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_model_providers_491b313b12.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Inserting-Documents-into-Knowledge-Base" class="common-anchor-header">ステップ 3: ナレッジベースへのドキュメントの挿入</h3><p>それでは、RAGアプリの知識ベースを保存しましょう。知識ベースは、LLMがより正確な応答を生成するのに役立つ、関連するコンテキストとして使用できる内部文書やテキストのコレクションで構成されています。</p>
<p>私たちのユースケースでは、知識ベースは基本的に「注意がすべて」という論文です。しかし、複数の理由から論文をそのまま保存することはできない。第一に、この論文は長すぎるし、LLMに長すぎるコンテキストを与えても、コンテキストが広すぎるので役に立たない。第二に、入力が生テキストの場合、最も関連性の高いコンテキストを取り出すために類似検索を行うことができない。</p>
<p>したがって、論文を知識ベースに格納する前に、少なくとも2つのステップを踏む必要がある。まず、論文をテキストチャンクに分割し、埋め込みモデルを使って各チャンクを埋め込みに変換する。最後に、これらの埋め込みをベクトルデータベースとしてMilvusに格納します。</p>
<p>Difyを使えば、論文のテキストをチャンクに分割し、埋め込みに変換するのは簡単です。論文のPDFファイルをアップロードし、チャンクの長さを設定し、埋め込みモデルをスライダーで選択するだけです。これらのステップをすべて行うには、&quot;Knowledge &quot;に行き、&quot;Create Knowledge &quot;をクリックする。次に、ローカル・コンピューターからPDFファイルをアップロードするよう促されます。したがって、まずArXivから論文をダウンロードし、コンピュータに保存しておくとよいでしょう。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_knowledge_cc21a5c430.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>ファイルをアップロードしたら、チャンクの長さ、インデックス作成方法、使用する埋め込みモデル、検索設定を行う。</p>
<p>チャンク設定」では、チャンクの最大長を任意の数字で設定できる（今回の使用例では100に設定する）。次に、"Index Method "では、"High Quality "を選択する必要がある。"High Quality "を選択すると、関連するコンテキストを見つけるために類似検索を実行できるようになるからだ。埋め込みモデル」は、OpenAIのどの埋め込みモデルを選んでも良いが、この例では、text-embedding-3-smallモデルを使う。最後に、"Retrieval Setting "では、最も関連性の高いコンテキストを見つけるために類似検索を行いたいので、"Vector Search "を選択する必要がある。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Dify_save_837dbc0cf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Save &amp; Process "をクリックし、すべてがうまくいくと、次のスクリーンショットのように緑色のチェックマークが表示されます：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_knowledge_created_d46b96385f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Creating-the-RAG-App" class="common-anchor-header">ステップ4：RAGアプリの作成</h3><p>ここまでで、ナレッジベースの作成とMilvusデータベースへの保存が完了しました。これでRAGアプリを作成する準備ができました。</p>
<p>DifyでRAGアプリを作成するのはとても簡単です。先ほどの "Knowledge "ではなく、"Studio "に移動し、"Create from Blank "をクリックします。次に、アプリのタイプとして "チャットボット "を選択し、アプリの名前を入力欄に入力します。完了したら、"Create" をクリックします。次のページが表示されます：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_create_f5691f193d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Instruction"（指示）フィールドには、"Answer the query from the user concisely"（ユーザーからの問い合わせに簡潔に答える）のようなシステム・プロンプトを書くことができる。次に、"Context "として、"Add "マークをクリックし、先ほど作成したナレッジベースを追加します。こうすることで、RAGアプリはユーザーのクエリに答えるために、この知識ベースから可能性のあるコンテキストを取得します。</p>
<p>さて、知識ベースをRAGアプリに追加したので、最後にやるべきことは、OpenAIからLLMを選択することです。そのためには、下のスクリーンショットにあるように、右上のモデルリストをクリックします：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_llm_c3b79ded37.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>これでRAGアプリケーションを公開する準備ができました！右上の "Publish "をクリックすると、RAGアプリを公開する様々な方法が表示されます：単純にブラウザで実行したり、ウェブサイトに埋め込んだり、API経由でアプリにアクセスしたりできます。この例では、ブラウザでアプリを実行し、&quot;Run App &quot;をクリックします。</p>
<p>これで完了です！これで、あなたはLLMに「Attention is All You Need」論文やナレッジベースに含まれる文書に関連することを何でも質問できるようになります。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag_attention_is_all_you_need_8582d3a69a.png" alt="" class="doc-image" id="" />
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
    </button></h2><p>DifyとMilvusを使い、最小限のコードと設定で動作するRAGアプリケーションを構築することができました。このアプローチにより、ベクターデータベースやLLM統合の深い専門知識を必要とすることなく、複雑なRAGアーキテクチャを開発者が利用できるようになります。 重要なポイント</p>
<ol>
<li><strong>セットアップのオーバーヘッドが少ない</strong>：Docker Composeを使用することでデプロイを簡素化</li>
<li><strong>ノーコード/ローコード・オーケストレーション</strong>：DifyがRAGパイプラインの大部分を処理</li>
<li><strong>プロダクション対応のベクターデータベース</strong>：Milvusは効率的な埋め込みストレージと検索を提供します。</li>
<li><strong>拡張可能なアーキテクチャ</strong>：ドキュメントの追加やパラメーターの調整が容易 本番環境への導入にあたっては、以下の点を考慮してください：</li>
</ol>
<ul>
<li>アプリケーションの認証設定</li>
<li>Milvusの適切なスケーリング設定(特に大規模なドキュメントコレクション)</li>
<li>DifyとMilvusインスタンスのモニタリングの実装</li>
<li>最適なパフォーマンスを得るための検索パラメータの微調整 DifyとMilvusを組み合わせることで、最新の大規模言語モデル(LLM)を用いて、組織内部の知識を効果的に活用することができるRAGアプリケーションを迅速に開発することができます。 構築をお楽しみください！</li>
</ul>
<h2 id="Additional-Resources" class="common-anchor-header">その他のリソース<button data-href="#Additional-Resources" class="anchor-icon" translate="no">
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
<li><a href="https://docs.dify.ai/">Dify ドキュメント</a></li>
<li><a href="https://milvus.io/docs">Milvusドキュメント</a></li>
<li><a href="https://zilliz.com/learn/vector-database">ベクターデータベースの基礎</a></li>
<li><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG実装パターン</a></li>
</ul>
