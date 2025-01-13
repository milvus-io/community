---
id: conversational-memory-in-langchain.md
title: LangChain 中的會話記憶
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
<p>LangChain 是建立 LLM 應用程式的強大框架。然而，強大的功能也帶來了相當多的複雜性。LangChain 提供許多提示 LLM 的方式，以及會話記憶體等基本功能。會話記憶提供 LLM 記憶您聊天內容的上下文。</p>
<p>在這篇文章中，我們將探討如何在 LangChain 和 Milvus 中使用會話記憶。若要跟進，您需要<code translate="no">pip</code> 安裝四個函式庫和 OpenAI API 金鑰。您可以透過執行<code translate="no">pip install langchain milvus pymilvus python-dotenv</code> 來安裝所需的四個函式庫。或執行本文<a href="https://colab.research.google.com/drive/11p-u8nKqrQYePlXR0HiSrUapmKLD0QN9?usp=sharing">CoLab Notebook</a>中的第一個區塊。</p>
<p>在這篇文章中，我們將學習到</p>
<ul>
<li>使用 LangChain 進行會話記憶</li>
<li>設定對話情境</li>
<li>使用 LangChain 提示會話記憶體</li>
<li>LangChain 會話記憶總結</li>
</ul>
<h2 id="Conversational-Memory-with-LangChain" class="common-anchor-header">使用 LangChain 的會話記憶體<button data-href="#Conversational-Memory-with-LangChain" class="anchor-icon" translate="no">
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
    </button></h2><p>在預設狀態下，您透過單一提示與 LLM 互動。增加上下文記憶體，或稱為「會話記憶體」，意味著您不再需要透過單一提示傳送所有內容。LangChain 提供儲存您與 LLM 已經進行過的會話的功能，以便日後擷取這些資訊。</p>
<p>要設定向量儲存的持久性會話記憶體，我們需要 LangChain 的六個模組。首先，我們必須取得<code translate="no">OpenAIEmbeddings</code> 和<code translate="no">OpenAI</code> LLM。我們也需要<code translate="no">VectorStoreRetrieverMemory</code> 和 LangChain 版本的<code translate="no">Milvus</code> 來使用向量儲存後端。然後，我們需要<code translate="no">ConversationChain</code> 和<code translate="no">PromptTemplate</code> 來儲存我們的對話並加以查詢。</p>
<p><code translate="no">os</code>,<code translate="no">dotenv</code>, 和<code translate="no">openai</code> 函式庫主要用於操作目的。我們使用它們來載入和使用 OpenAI API 金鑰。最後一個設定步驟是啟動一個本機<a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>實例。我們使用 Milvus Python 套件中的<code translate="no">default_server</code> 來完成。</p>
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
<h2 id="Setting-Up-Conversation-Context" class="common-anchor-header">設定對話情境<button data-href="#Setting-Up-Conversation-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>現在我們已經設定好所有的先決條件，可以開始建立會話記憶體。第一步是使用 LangChain 建立與 Milvus 伺服器的連線。接下來，我們使用一個空字典來建立 LangChain Milvus 套件。此外，我們會傳入上面建立的嵌入式資料，以及 Milvus Lite 伺服器的連線細節。</p>
<p>要將向量資料庫用於會話記憶，我們需要將其實體化為retriever。在這種情況下，我們只擷取前 1 個結果，設定<code translate="no">k=1</code> 。最後一個會話記憶體設定步驟是透過我們剛剛設定的retriever 和向量資料庫連線，使用<code translate="no">VectorStoreRetrieverMemory</code> 物件作為我們的會話記憶體。</p>
<p>要使用我們的會話記憶體，它必須有一些上下文。因此，讓我們賦予記憶體一些上下文。在這個範例中，我們提供五項資訊。讓我們儲存我最喜歡的零食 (巧克力)、運動 (游泳)、啤酒 (健力士)、甜點 (起司蛋糕) 和音樂人 (Taylor Swift)。每個項目都會透過<code translate="no">save_context</code> 功能儲存在記憶體中。</p>
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
<h2 id="Prompting-the-Conversational-Memory-with-LangChain" class="common-anchor-header">使用 LangChain 提示會話記憶體<button data-href="#Prompting-the-Conversational-Memory-with-LangChain" class="anchor-icon" translate="no">
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
    </button></h2><p>是時候看看我們如何使用會話記憶體了。讓我們先透過 LangChain 連接到 OpenAI LLM。我們使用溫度 0 來表示我們不希望我們的 LLM 有創意。</p>
<p>接下來，我們建立一個範本。我們告訴 LLM 它正在與人類進行友好的對話，並插入兩個變數。<code translate="no">history</code> 變數提供對話記憶體中的上下文。<code translate="no">input</code> 變數提供目前的輸入。我們使用<code translate="no">PromptTemplate</code> 物件來插入這些變數。</p>
<p>我們使用<code translate="no">ConversationChain</code> 物件來結合我們的提示、LLM 和記憶體。現在，我們準備給予對話一些提示，以檢查對話的記憶體。我們先告訴 LLM 我們的名字是 Gary，是 Pokemon 系列中的主要對手（會話記憶中的其他內容都是關於我的事實）。</p>
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
<p>下圖顯示 LLM 的預期回應可能是什麼樣子。在這個範例中，它的回應是說它的名字是「AI」。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_1_2bf386d22a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>現在讓我們測試一下目前的記憶體。我們使用之前建立的<code translate="no">ConversationChain</code> 物件，查詢我最喜愛的音樂家。</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;who is my favorite musician?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>下圖顯示了 Conversation Chain 的預期回應。由於我們使用了 verbose 選項，它也顯示了相關的會話。我們可以看到它如預期般返回我最喜愛的音樂家是 Taylor Swift。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_2_8355206f3e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>接下來，讓我們查詢我最喜歡的甜點 - 乳酪蛋糕。</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;Whats my favorite dessert?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>當我們查詢我最喜歡的甜點時，我們可以看到會話鏈再次從 Milvus 挑選出正確的資訊。它發現我最喜歡的甜點是芝士蛋糕，就像我之前告訴它的一樣。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_3_66a5c9690f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>既然我們已經確認可以查詢我們之前提供的資訊，現在讓我們再檢查一件事 - 我們在對話開始時提供的資訊。對話開始時，我們告訴 AI 我們的名字是 Gary。</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;What&#x27;s my name?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>我們最後的檢查結果是，對話鏈將我們的名字儲存在向量儲存的對話記憶體中。它會返回我們說我們的名字是 Gary。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_4_f446f49672.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="LangChain-Conversational-Memory-Summary" class="common-anchor-header">LangChain 會話記憶體摘要<button data-href="#LangChain-Conversational-Memory-Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>在本教程中，我們學習了如何在 LangChain 中使用會話記憶體。LangChain 提供像 Milvus 之類的向量儲存後端來存取持久化會話記憶體。我們可以使用會話記憶體，將歷史注入我們的提示，並將歷史上下文儲存在<code translate="no">ConversationChain</code> 物件中。</p>
<p>在這個範例教學中，我們給了 Conversation Chain 五個關於我的事實，並假扮成 Pokemon 的主要對手 Gary。接著，我們針對我們儲存的先驗知識（我最喜歡的音樂家和甜點）向 Conversation Chain 提出問題。它正確回答了這兩個問題，並顯示出相關條目。最後，我們詢問它關於我們在對話開始時所說的名字，它正確地回覆我們說我們的名字是「Gary」。</p>
