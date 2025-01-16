---
id: conversational-memory-in-langchain.md
title: LangChainにおける会話記憶
author: Yujian Tang
date: 2023-06-06T00:00:00.000Z
cover: assets.zilliz.com/Conversational_Memory_in_Lang_Chain_7c1b4b7ba9.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: 'https://milvus.io/blog/conversational-memory-in-langchain.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_7c1b4b7ba9.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>LangChainは、LLMアプリケーションを構築するための堅牢なフレームワークです。しかし、そのパワーは複雑さを伴います。LangChainはLLMをプロンプトする多くの方法と、会話記憶のような重要な機能を提供します。会話記憶は、LLMがあなたのチャットを記憶するためのコンテキストを提供します。</p>
<p>この投稿では、LangChainとmilvusで会話メモリを使う方法を見ていきます。この記事に従うには、<code translate="no">pip</code> 、4つのライブラリとOpenAI APIキーをインストールする必要があります。必要な4つのライブラリは<code translate="no">pip install langchain milvus pymilvus python-dotenv</code> を実行することでインストールできる。または、この記事の<a href="https://colab.research.google.com/drive/11p-u8nKqrQYePlXR0HiSrUapmKLD0QN9?usp=sharing">CoLab Notebookの</a>最初のブロックを実行する。</p>
<p>この記事では、以下について学びます：</p>
<ul>
<li>LangChainを使った会話記憶</li>
<li>会話コンテキストの設定</li>
<li>LangChainで会話記憶を促す</li>
<li>LangChain会話記憶のまとめ</li>
</ul>
<h2 id="Conversational-Memory-with-LangChain" class="common-anchor-header">LangChainによる会話記憶<button data-href="#Conversational-Memory-with-LangChain" class="anchor-icon" translate="no">
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
    </button></h2><p>デフォルトの状態では、LLMとの対話は単一のプロンプトを通して行われます。コンテキストのためのメモリ、つまり "会話メモリ "を追加することは、一つのプロンプトを通して全てを送信する必要がなくなることを意味します。LangChainはLLMとの会話を保存し、後でその情報を取り出すことができます。</p>
<p>ベクターストアを使った持続的会話記憶のセットアップには、LangChainの6つのモジュールが必要です。まず、<code translate="no">OpenAIEmbeddings</code> と<code translate="no">OpenAI</code> LLMを手に入れなければなりません。ベクトルストア・バックエンドを使うには、<code translate="no">VectorStoreRetrieverMemory</code> とLangChainバージョンの<code translate="no">Milvus</code> も必要です。次に、会話を保存してクエリするために、<code translate="no">ConversationChain</code> と<code translate="no">PromptTemplate</code> が必要です。</p>
<p><code translate="no">os</code> 、<code translate="no">dotenv</code> 、<code translate="no">openai</code> ライブラリは、主に運用目的で使用します。OpenAIのAPIキーをロードして使用するために使用します。最後のセットアップステップは、ローカルの<a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>インスタンスをスピンアップすることである。Milvus Pythonパッケージの<code translate="no">default_server</code> 。</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> langchain.<span class="hljs-property">embeddings</span>.<span class="hljs-property">openai</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAIEmbeddings</span>
<span class="hljs-keyword">from</span> langchain.<span class="hljs-property">llms</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">OpenAI</span>
<span class="hljs-keyword">from</span> langchain.<span class="hljs-property">memory</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">VectorStoreRetrieverMemory</span>
<span class="hljs-keyword">from</span> langchain.<span class="hljs-property">chains</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">ConversationChain</span>
<span class="hljs-keyword">from</span> langchain.<span class="hljs-property">prompts</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">PromptTemplate</span>
<span class="hljs-keyword">from</span> langchain.<span class="hljs-property">vectorstores</span> <span class="hljs-keyword">import</span> <span class="hljs-title class_">Milvus</span>
embeddings = <span class="hljs-title class_">OpenAIEmbeddings</span>()


<span class="hljs-keyword">import</span> os
<span class="hljs-keyword">from</span> dotenv <span class="hljs-keyword">import</span> load_dotenv
<span class="hljs-keyword">import</span> openai
<span class="hljs-title function_">load_dotenv</span>()
openai.<span class="hljs-property">api_key</span> = os.<span class="hljs-title function_">getenv</span>(<span class="hljs-string">&quot;OPENAI_API_KEY&quot;</span>)


<span class="hljs-keyword">from</span> milvus <span class="hljs-keyword">import</span> default_server
default_server.<span class="hljs-title function_">start</span>()
<button class="copy-code-btn"></button></code></pre>
<h2 id="Setting-Up-Conversation-Context" class="common-anchor-header">会話コンテキストのセットアップ<button data-href="#Setting-Up-Conversation-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>これで前提条件がすべて整ったので、会話メモリの作成に進むことができる。最初のステップは、LangChainを使ってMilvusサーバーへの接続を作成することです。次に、空の辞書を使ってLangChain Milvusコレクションを作成します。さらに、上記で作成したエンベッディングとMilvus Liteサーバへの接続情報を渡します。</p>
<p>ベクターデータベースを会話記憶に使うには、ベクターデータベースをリトリーバとしてインスタンス化する必要があります。この場合、上位1つの結果のみを取得し、<code translate="no">k=1</code> 。最後の会話記憶のセットアップステップでは、先ほどセットアップしたレトリーバーとベクトルデータベースの接続を通して、<code translate="no">VectorStoreRetrieverMemory</code> オブジェクトを会話記憶として使用します。</p>
<p>会話メモリを使うには、そのメモリにコンテキストが必要です。そこで、メモリにコンテキストを与えてみましょう。この例では、5つの情報を与える。好きなスナック（チョコレート）、スポーツ（水泳）、ビール（ギネス）、デザート（チーズケーキ）、ミュージシャン（テイラー・スウィフト）。各エントリーは、<code translate="no">save_context</code> 機能を使ってメモリーに保存される。</p>
<pre><code translate="no">vectordb = Milvus.from_documents(
   {},
   embeddings,
   connection_args={<span class="hljs-string">&quot;host&quot;</span>: <span class="hljs-string">&quot;127.0.0.1&quot;</span>, <span class="hljs-string">&quot;port&quot;</span>: default_server.listen_port})
retriever = Milvus.as_retriever(vectordb, search_kwargs=<span class="hljs-built_in">dict</span>(k=<span class="hljs-number">1</span>))
memory = VectorStoreRetrieverMemory(retriever=retriever)
about_me = [
   {<span class="hljs-string">&quot;input&quot;</span>: <span class="hljs-string">&quot;My favorite snack is chocolate&quot;</span>,
    <span class="hljs-string">&quot;output&quot;</span>: <span class="hljs-string">&quot;Nice&quot;</span>},
   {<span class="hljs-string">&quot;input&quot;</span>: <span class="hljs-string">&quot;My favorite sport is swimming&quot;</span>,
    <span class="hljs-string">&quot;output&quot;</span>: <span class="hljs-string">&quot;Cool&quot;</span>},
   {<span class="hljs-string">&quot;input&quot;</span>: <span class="hljs-string">&quot;My favorite beer is Guinness&quot;</span>,
    <span class="hljs-string">&quot;output&quot;</span>: <span class="hljs-string">&quot;Great&quot;</span>},
   {<span class="hljs-string">&quot;input&quot;</span>: <span class="hljs-string">&quot;My favorite dessert is cheesecake&quot;</span>,
    <span class="hljs-string">&quot;output&quot;</span>: <span class="hljs-string">&quot;Good to know&quot;</span>},
   {<span class="hljs-string">&quot;input&quot;</span>: <span class="hljs-string">&quot;My favorite musician is Taylor Swift&quot;</span>,
    <span class="hljs-string">&quot;output&quot;</span>: <span class="hljs-string">&quot;Same&quot;</span>}
]
<span class="hljs-keyword">for</span> example <span class="hljs-keyword">in</span> about_me:
   memory.save_context({<span class="hljs-string">&quot;input&quot;</span>: example[<span class="hljs-string">&quot;input&quot;</span>]}, {<span class="hljs-string">&quot;output&quot;</span>: example[<span class="hljs-string">&quot;output&quot;</span>]})
<button class="copy-code-btn"></button></code></pre>
<h2 id="Prompting-the-Conversational-Memory-with-LangChain" class="common-anchor-header">LangChainで会話メモリをプロンプトする<button data-href="#Prompting-the-Conversational-Memory-with-LangChain" class="anchor-icon" translate="no">
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
    </button></h2><p>会話メモリーの使い方を見てみましょう。まず、LangChainを使ってOpenAI LLMに接続します。LLMに創造性を求めないことを示すために、温度を0にします。</p>
<p>次に、テンプレートを作成します。LLMが人間とフレンドリーな会話をしていることを伝え、2つの変数を挿入する。<code translate="no">history</code> 変数は会話の記憶からコンテキストを提供する。<code translate="no">input</code> 変数は現在の入力を提供する。これらの変数を挿入するために、<code translate="no">PromptTemplate</code> オブジェクトを使います。</p>
<p><code translate="no">ConversationChain</code> オブジェクトを使って、プロンプト、LLM、メモリーを結合する。これで、いくつかのプロンプトを与えて、会話の記憶をチェックする準備ができた。まずLLMに、私たちの名前がポケモンシリーズの主なライバルであるゲイリーであることを伝えます（会話メモリ内の他のすべては、私についての事実です）。</p>
<pre><code translate="no">llm = OpenAI(temperature=<span class="hljs-number">0</span>) <span class="hljs-comment"># Can be any valid LLM</span>
_DEFAULT_TEMPLATE = <span class="hljs-string">&quot;&quot;&quot;The following is a friendly conversation between a human and an AI. The AI is talkative and provides lots of specific details from its context. If the AI does not know the answer to a question, it truthfully says it does not know.


Relevant pieces of previous conversation:
{history}


(You do not need to use these pieces of information if not relevant)


Current conversation:
Human: {input}
AI:&quot;&quot;&quot;</span>
PROMPT = PromptTemplate(
   input_variables=[<span class="hljs-string">&quot;history&quot;</span>, <span class="hljs-string">&quot;input&quot;</span>], template=_DEFAULT_TEMPLATE
)
conversation_with_summary = ConversationChain(
   llm=llm,
   prompt=PROMPT,
   memory=memory,
   verbose=<span class="hljs-literal">True</span>
)
conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;Hi, my name is Gary, what&#x27;s up?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>下の画像は、LLMからの予想される反応を示している。この例では、自分の名前は「AI」だと答えている。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_1_2bf386d22a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>では、ここまでの記憶をテストしてみよう。先ほど作成した<code translate="no">ConversationChain</code> オブジェクトを使い、私の好きなミュージシャンを検索します。</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;who is my favorite musician?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>下の画像は、Conversation Chainからの予想される応答である。verboseオプションを使ったので、関連する会話も表示されている。予想通り、私の好きなアーティストがTaylor Swiftであることが返されているのがわかる。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_2_8355206f3e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>次に、私の好きなデザート、チーズケーキを調べてみましょう。</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;Whats my favorite dessert?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>私の好きなデザートを問い合わせると、カンバセーションチェーンは再びmilvusから正しい情報を選んでいることがわかる。私の好きなデザートはチーズケーキです。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_3_66a5c9690f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>さて、先ほどの情報を照会できることを確認したところで、もうひとつ、会話の最初に提供した情報を確認してみよう。私たちはAIに自分の名前をゲイリーと告げて会話を始めた。</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;What&#x27;s my name?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>最終的なチェックでは、会話チェーンが私たちの名前に関するビットをベクターストアの会話メモリーに保存したことを返す。私たちがゲイリーと名乗ったことが返されます。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_4_f446f49672.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="LangChain-Conversational-Memory-Summary" class="common-anchor-header">LangChain会話メモリのまとめ<button data-href="#LangChain-Conversational-Memory-Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>このチュートリアルではLangChainで会話型メモリを使う方法を学びました。LangChainはMilvusのようなベクトルストア・バックエンドにアクセスして、永続的な会話型メモリを提供します。プロンプトに履歴を注入し、<code translate="no">ConversationChain</code> オブジェクトに履歴コンテキストを保存することで、会話メモリを使うことができます。</p>
<p>このチュートリアルの例では、Conversation Chainに私に関する5つの事実を伝え、ポケモンの主なライバルであるゲイリーになりすました。そして、会話チェーンに、保存しておいた先験的知識、つまり好きなミュージシャンとデザートについての質問を投げかけました。会話チェーンはこの2つの質問に正しく答え、関連するエントリーを表示した。最後に、会話の最初に答えた私たちの名前について質問すると、私たちが "ゲイリー "と答えたことを正しく返してくれた。</p>
