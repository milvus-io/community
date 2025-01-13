---
id: conversational-memory-in-langchain.md
title: LangChain 中的对话记忆
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
<p>LangChain 是构建 LLM 应用程序的强大框架。然而，强大的功能也带来了一定的复杂性。LangChain 提供了许多提示 LLM 的方法以及会话记忆等基本功能。会话记忆为 LLM 提供了上下文以记住您的聊天内容。</p>
<p>在本篇文章中，我们将介绍如何在 LangChain 和 Milvus 中使用会话记忆。要继续学习，您需要<code translate="no">pip</code> 安装四个库和一个 OpenAI API 密钥。您可以通过运行<code translate="no">pip install langchain milvus pymilvus python-dotenv</code> 来安装所需的四个库。或执行本文<a href="https://colab.research.google.com/drive/11p-u8nKqrQYePlXR0HiSrUapmKLD0QN9?usp=sharing">CoLab Notebook</a>中的第一个区块。</p>
<p>在本篇文章中，我们将学习以下内容：</p>
<ul>
<li>使用 LangChain 进行对话记忆</li>
<li>设置对话上下文</li>
<li>使用 LangChain 提示对话记忆</li>
<li>LangChain 对话记忆总结</li>
</ul>
<h2 id="Conversational-Memory-with-LangChain" class="common-anchor-header">使用 LangChain 的对话记忆<button data-href="#Conversational-Memory-with-LangChain" class="anchor-icon" translate="no">
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
    </button></h2><p>在默认状态下，您通过单个提示与 LLM 进行交互。增加上下文记忆或 "对话记忆 "意味着您不必再通过一个提示发送所有内容。LangChain 提供了存储与 LLM 对话的功能，以便日后检索这些信息。</p>
<p>要通过向量存储建立持久对话记忆，我们需要从 LangChain 获取六个模块。首先，我们必须获得<code translate="no">OpenAIEmbeddings</code> 和<code translate="no">OpenAI</code> LLM。我们还需要<code translate="no">VectorStoreRetrieverMemory</code> 和 LangChain 版本的<code translate="no">Milvus</code> 来使用向量存储后台。然后，我们需要<code translate="no">ConversationChain</code> 和<code translate="no">PromptTemplate</code> 来保存对话并进行查询。</p>
<p><code translate="no">os</code> 、<code translate="no">dotenv</code> 和<code translate="no">openai</code> 库主要用于操作符。我们使用它们来加载和使用 OpenAI API 密钥。最后一个设置步骤是启动本地<a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>实例。我们通过使用 Milvus Python 软件包中的<code translate="no">default_server</code> 来完成。</p>
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
<h2 id="Setting-Up-Conversation-Context" class="common-anchor-header">设置对话上下文<button data-href="#Setting-Up-Conversation-Context" class="anchor-icon" translate="no">
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
    </button></h2><p>现在，我们已经设置好了所有的先决条件，可以开始创建对话内存了。第一步是使用 LangChain 创建与 Milvus 服务器的连接。接下来，我们使用空字典创建 LangChain Milvus Collections。此外，我们还会传入上文创建的嵌入式数据以及 Milvus Lite 服务器的连接详情。</p>
<p>要将向量数据库用于会话记忆，我们需要将其实例化为检索器。在这种情况下，我们只检索前 1 个结果，设置为<code translate="no">k=1</code> 。最后一个会话内存设置步骤是通过刚才设置的检索器和向量数据库连接，将<code translate="no">VectorStoreRetrieverMemory</code> 对象用作我们的会话内存。</p>
<p>要使用我们的会话内存，它必须有一些上下文。因此，让我们给记忆体一些上下文。在这个例子中，我们提供了五条信息。让我们存储我最喜欢的零食（巧克力）、运动（游泳）、啤酒（吉尼斯）、甜点（芝士蛋糕）和音乐家（泰勒-斯威夫特）。每个条目都将通过<code translate="no">save_context</code> 功能保存到存储器中。</p>
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
<h2 id="Prompting-the-Conversational-Memory-with-LangChain" class="common-anchor-header">使用 LangChain 提示会话内存<button data-href="#Prompting-the-Conversational-Memory-with-LangChain" class="anchor-icon" translate="no">
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
    </button></h2><p>现在我们来看看如何使用会话记忆库。首先，让我们通过 LangChain 连接 OpenAI LLM。我们使用温度 0 来表示我们不希望 LLM 具有创造性。</p>
<p>接下来，我们创建一个模板。我们告诉 LLM，它正在与人类进行友好对话，并插入两个变量。<code translate="no">history</code> 变量提供对话记忆中的上下文。<code translate="no">input</code> 变量提供当前输入。我们使用<code translate="no">PromptTemplate</code> 对象插入这些变量。</p>
<p>我们使用<code translate="no">ConversationChain</code> 对象将提示、LLM 和内存结合起来。现在，我们可以通过给对话一些提示来检查对话记忆。我们首先告诉 LLM，我们的名字叫加里，是口袋妖怪系列中的主要对手（对话记忆中的其他内容都是关于我的事实）。</p>
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
<p>下图显示了 LLM 的预期回复。在这个例子中，它的回答是它的名字叫 "AI"。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_1_2bf386d22a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>现在，让我们来测试一下到目前为止的内存。我们使用之前创建的<code translate="no">ConversationChain</code> 对象，查询我最喜欢的音乐家。</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;who is my favorite musician?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>下图显示了对话链的预期响应。由于我们使用了 "verbose"（详细说明）选项，因此它还显示了相关对话。我们可以看到，正如预期的那样，它返回了我最喜欢的艺术家是泰勒-斯威夫特（Taylor Swift）。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_2_8355206f3e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>接下来，让我们查询我最喜欢的甜点--芝士蛋糕。</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;Whats my favorite dessert?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>当我们查询我最喜欢的甜点时，我们可以看到对话链再次从 Milvus 挑选了正确的信息。它发现我最喜欢的甜点是芝士蛋糕，正如我之前告诉它的那样。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_3_66a5c9690f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>既然我们已经确认可以查询我们之前提供的信息，那么我们再来检查一件事--我们在对话开始时提供的信息。对话开始时，我们告诉人工智能我们的名字叫加里。</p>
<pre><code translate="no">conversation_with_summary.predict(<span class="hljs-built_in">input</span>=<span class="hljs-string">&quot;What&#x27;s my name?&quot;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>我们最后的检查结果是，对话链在向量存储对话记忆中存储了关于我们名字的信息。它返回的结果是，我们说了我们的名字叫加里。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conversational_Memory_in_Lang_Chain_graphics_4_f446f49672.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="LangChain-Conversational-Memory-Summary" class="common-anchor-header">LangChain 对话内存总结<button data-href="#LangChain-Conversational-Memory-Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>在本教程中，我们学习了如何在 LangChain 中使用会话内存。LangChain 提供了像 Milvus 这样的向量存储后端访问，以实现持久的会话内存。我们可以在提示中注入历史记录，并将历史上下文保存在<code translate="no">ConversationChain</code> 对象中，从而使用会话记忆。</p>
<p>在本教程示例中，我们向对话链提供了关于我的五个事实，并假装自己是《口袋妖怪》中的主要对手加里。然后，我们用我们存储的先验知识--我最喜欢的音乐家和甜点--提问对话链。它正确回答了这两个问题，并显示了相关条目。最后，我们向它询问了对话开始时我们的名字，它正确地回答了我们说我们的名字是 "加里"。</p>
