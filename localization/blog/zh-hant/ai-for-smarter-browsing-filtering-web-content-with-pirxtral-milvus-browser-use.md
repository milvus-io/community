---
id: >-
  ai-for-smarter-browsing-filtering-web-content-with-pixtral-milvus-browser-use.md
title: 人工智慧瀏覽：使用 Pixtral、Milvus 和瀏覽器過濾網頁內容
author: Stephen Batifol
date: 2025-02-25T00:00:00.000Z
desc: 學習如何結合用於圖像分析的 Pixtral、用於儲存的 Milvus 向量資料庫，以及用於網頁導覽的 Browser Use，建立可過濾內容的智慧型助理。
cover: >-
  assets.zilliz.com/Multimodal_Semantic_Search_with_Images_and_Text_1_3da9b83015.png
tag: Engineering
tags: >-
  Vector Database Milvus, AI Content Filtering, Pixtral Image Analysis, Browser
  Use Web Navigation, Intelligent Agent Development
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/ai-for-smarter-browsing-filtering-web-content-with-pixtral-milvus-browser-use.md
---
<iframe width="100%" height="480" src="https://www.youtube.com/embed/4Xf4_Wfjk_Y" title="How to Build a Smart Social Media Agent with Milvus, Pixtral &amp; Browser Use" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>身為 Milvus 的開發者代言人，我花了很多時間在社交網站，聆聽人們對我們的評價，以及我是否也能提供協助。當您尋找「Milvus」時，會有一點世界衝突。它既是向量 DB，也是鳥類的一種，這意味著前一刻我還在深入討論向量相似性演算法的主題，下一刻我就在欣賞黑色鳥類在天空中飛翔的絕美照片。</p>
<p>雖然這兩個主題都很有趣，但把它們混在一起對我來說並不是真的有幫助，如果有一個智慧的方法可以解決這個問題，而不需要我手動檢查呢？</p>
<p>讓我們來打造更聰明的東西 - 透過結合視覺理解與情境感知，我們可以打造一個助理，知道黑鳶的遷徙模式與我們的新文章之間的差異。</p>
<h2 id="The-tech-stack" class="common-anchor-header">技術堆疊<button data-href="#The-tech-stack" class="anchor-icon" translate="no">
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
    </button></h2><p>我們結合了三種不同的技術：</p>
<ul>
<li><strong>Browser-Use:</strong>這個工具可以瀏覽各種網站 (例如 Twitter) 來取得內容。</li>
<li><strong>Pixtral</strong>：視覺語言模型，可分析影像與上下文。在這個範例中，它可以區分關於我們 Vector DB 的技術圖表與令人驚艷的鳥類照片。</li>
<li><strong>Milvus:</strong>一個高效能且開放原始碼的向量資料庫。他是我們儲存相關文章以供日後查詢的地方。</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/the_tech_stack_ad695ccf9e.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Seeing-it-in-action" class="common-anchor-header">觀看它的運作<button data-href="#Seeing-it-in-action" class="anchor-icon" translate="no">
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
    </button></h2><p>讓我們來看看這 2 篇文章：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Langchian_tweet_1_with_Milvus_f2bd988503.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Tweet_2_with_Bird_4b534efced.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>左邊的文章，Pixtral 識別出這是一篇關於 Milvus 的文章，也就是向量資料庫。它提到一些實作細節，但也有一張顯示系統圖的圖片，表示這的確是關於 Vector DB 的。我們可以在下面看到 Pixtral 也有同樣的想法。</p>
<pre><code translate="no" class="language-Shell">INFO     [src.agent.custom_agent] 🧠 New Memory: <span class="hljs-number">1.</span> The post by LangChainAI discusses the <span class="hljs-string">&#x27;GraphRAG Agent&#x27;</span> which uses Neo4j <span class="hljs-keyword">and</span> Milvus vector search to enhance RAG systems.
<span class="hljs-number">2.</span> Replies include praise <span class="hljs-keyword">for</span> the use of Milvus <span class="hljs-keyword">in</span> intelligent retrieval <span class="hljs-keyword">and</span> vector search.
<span class="hljs-number">3.</span> Specific mention of Milvus <span class="hljs-keyword">as</span> a key component <span class="hljs-keyword">in</span> innovative RAG systems.
<span class="hljs-number">4.</span> No content related to birds <span class="hljs-keyword">or</span> photography was found.
INFO     [src.agent.custom_agent] ⏳ Task Progress:
<span class="hljs-number">1.</span> Navigated to the post URL. <span class="hljs-number">2.</span> Extracted relevant post content. <span class="hljs-number">3.</span> Analyzed the content <span class="hljs-keyword">for</span> relevance to Milvus, the Vector DB.
INFO     [src.agent.custom_agent] 📋 Future Plans:
<span class="hljs-number">1.</span> Summarize the findings <span class="hljs-keyword">and</span> confirm the relevance to Milvus. <span class="hljs-number">2.</span> Complete the task by providing a clear <span class="hljs-keyword">and</span> concise report.
INFO     [src.agent.custom_agent] 🤔 Thought: The task required analyzing the post content <span class="hljs-keyword">for</span> relevance to Milvus, the Vector DB, ignoring <span class="hljs-built_in">any</span> content about birds <span class="hljs-keyword">or</span> photography. The extracted content <span class="hljs-keyword">is</span> entirely relevant to Milvus <span class="hljs-keyword">and</span> its applications <span class="hljs-keyword">in</span> vector search <span class="hljs-keyword">and</span> RAG systems. I will now summarize the findings <span class="hljs-keyword">and</span> complete the task.
INFO     [src.agent.custom_agent] 🎯 Summary: The post <span class="hljs-keyword">and</span> its replies are relevant to Milvus, the Vector DB, focusing on its use <span class="hljs-keyword">in</span> intelligent retrieval <span class="hljs-keyword">and</span> vector search. No content about birds <span class="hljs-keyword">or</span> photography was found.
INFO     [src.agent.custom_agent] 🛠️  Action <span class="hljs-number">1</span>/<span class="hljs-number">1</span>: {<span class="hljs-string">&quot;done&quot;</span>:{<span class="hljs-string">&quot;text&quot;</span>:<span class="hljs-string">&quot;The post by LangChainAI discusses the &#x27;GraphRAG Agent,&#x27; which uses Neo4j and Milvus vector search to enhance RAG systems. Replies highlight the innovative use of Milvus for intelligent retrieval and vector search, with no mention of birds or photography. The content is entirely relevant to Milvus, the Vector DB.&quot;</span>}}
INFO     [src.agent.custom_agent] 🧠 All Memory:
<span class="hljs-number">1.</span> The post by LangChainAI discusses the <span class="hljs-string">&#x27;GraphRAG Agent&#x27;</span> which uses Neo4j <span class="hljs-keyword">and</span> Milvus vector search to enhance RAG systems.
<span class="hljs-number">2.</span> Replies focus on the innovative use of Milvus <span class="hljs-keyword">for</span> intelligent retrieval <span class="hljs-keyword">and</span> vector search alongside other technologies.
<span class="hljs-number">3.</span> No posts <span class="hljs-keyword">or</span> replies are related to birds <span class="hljs-keyword">or</span> photography.
<span class="hljs-number">1.</span> The post by LangChainAI discusses the <span class="hljs-string">&#x27;GraphRAG Agent&#x27;</span> which uses Neo4j <span class="hljs-keyword">and</span> Milvus vector search to enhance RAG systems.
<span class="hljs-number">2.</span> Replies include praise <span class="hljs-keyword">for</span> the use of Milvus <span class="hljs-keyword">in</span> intelligent retrieval <span class="hljs-keyword">and</span> vector search.
<span class="hljs-number">3.</span> Specific mention of Milvus <span class="hljs-keyword">as</span> a key component <span class="hljs-keyword">in</span> innovative RAG systems.
<span class="hljs-number">4.</span> No content related to birds <span class="hljs-keyword">or</span> photography was found.
<button class="copy-code-btn"></button></code></pre>
<p>另一方面，右邊的這張圖卻不是，我們可以看到這張圖雖然很美，但並不是關於向量 DB 的。我們可以看到一隻鳥在天空中飛，因此，Pixtral 會認為這張圖不相干。</p>
<pre><code translate="no" class="language-Shell">INFO     [src.agent.custom_agent] 🧠 New Memory: The post <span class="hljs-keyword">and</span> comments primarily discuss photography <span class="hljs-keyword">and</span> birds. No references to Milvus the Vector Database are found.
INFO     [src.agent.custom_agent] ⏳ Task Progress:
Navigated to the post. Analyzed the content <span class="hljs-keyword">for</span> relevance to Milvus, the Vector DB. No relevant information found.
INFO     [src.agent.custom_agent] 🤔 Thought: The content of the post <span class="hljs-keyword">and</span> comments only discusses birds <span class="hljs-keyword">and</span> photography. Since the task specifies ignoring such topics, there <span class="hljs-keyword">is</span> no relevant information <span class="hljs-keyword">for</span> Milvus, the Vector DB. The task can now be concluded.
INFO     [src.agent.custom_agent] 🎯 Summary: The post does <span class="hljs-keyword">not</span> contain relevant information <span class="hljs-keyword">for</span> Milvus, the Vector DB. I will conclude the task.
INFO     [src.agent.custom_agent] 🛠️  Action <span class="hljs-number">1</span>/<span class="hljs-number">1</span>: {<span class="hljs-string">&quot;done&quot;</span>:{<span class="hljs-string">&quot;text&quot;</span>:<span class="hljs-string">&quot;The post and comments focus on birds and photography. No relevant information related to Milvus, the Vector DB, was found.&quot;</span>}}
INFO     [src.agent.custom_agent] 🧠 All Memory:
The post <span class="hljs-keyword">and</span> comments primarily discuss photography <span class="hljs-keyword">and</span> birds. No references to Milvus the Vector Database are found.
<button class="copy-code-btn"></button></code></pre>
<p>現在我們已經篩選出不想要的文章，我們可以將相關的文章儲存在 Milvus 中。讓我們稍後可以使用向量搜尋或全文搜尋來查詢它們。</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Browser_use_milvus_pixtral_39bf320a9f.gif" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Storing-Data-in-Milvus" class="common-anchor-header">在 Milvus 中儲存資料<button data-href="#Storing-Data-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>在這種情況下，<a href="https://milvus.io/docs/enable-dynamic-field.md#Dynamic-Field">動態欄位</a>是必須的，因為不可能總是尊重 Milvus 期望的模式。使用 Milvus，您只需在建立模式時使用<code translate="no">enable_dynamic_field=True</code> ，僅此而已。以下是展示這個過程的程式碼片段：</p>
<pre><code translate="no" class="language-Python"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

<span class="hljs-comment"># Connect to Milvus</span>
client = MilvusClient(uri=<span class="hljs-string">&quot;http://localhost:19530&quot;</span>)

<span class="hljs-comment"># Create a Schema that handles Dynamic Fields</span>
schema = <span class="hljs-variable language_">self</span>.client.create_schema(enable_dynamic_field=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;id&quot;</span>, datatype=DataType.INT64, is_primary=<span class="hljs-literal">True</span>, auto_id=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;text&quot;</span>, datatype=DataType.VARCHAR, max_length=<span class="hljs-number">65535</span>, enable_analyzer=<span class="hljs-literal">True</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;vector&quot;</span>, datatype=DataType.FLOAT_VECTOR, dim=<span class="hljs-number">384</span>)
schema.add_field(field_name=<span class="hljs-string">&quot;sparse&quot;</span>, datatype=DataType.SPARSE_FLOAT_VECTOR)
<button class="copy-code-btn"></button></code></pre>
<p>然後，我們定義我們想要存取的資料：</p>
<pre><code translate="no" class="language-Python"><span class="hljs-comment"># Prepare data with dynamic fields</span>
data = {
    <span class="hljs-string">&#x27;text&#x27;</span>: content_str,
    <span class="hljs-string">&#x27;vector&#x27;</span>: embedding,
    <span class="hljs-string">&#x27;url&#x27;</span>: url,
    <span class="hljs-string">&#x27;type&#x27;</span>: content_type,
    <span class="hljs-string">&#x27;metadata&#x27;</span>: json.dumps(metadata <span class="hljs-keyword">or</span> {})
}

<span class="hljs-comment"># Insert into Milvus</span>
<span class="hljs-variable language_">self</span>.client.insert(
    collection_name=<span class="hljs-variable language_">self</span>.collection_name,
    data=[data]
)
<button class="copy-code-btn"></button></code></pre>
<p>這個簡單的設定意味著您不需要擔心每個欄位都事先定義好。只需設定模式，允許動態新增，並讓 Milvus 完成繁重的工作。</p>
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
    </button></h2><p>透過結合 Browser Use 的網頁導覽、Pixtral 的視覺理解，以及 Milvus 的有效儲存，我們建立了一個能真正理解上下文的智慧型助理。現在我用它來區分鳥類和向量 DB，但同樣的方法也可以幫助解決你可能面臨的另一個問題。</p>
<p>就我而言，我想要繼續研究能在日常工作中協助我的代理程式，以降低我的認知負荷 😌 。</p>
<h2 id="Wed-Love-to-Hear-What-You-Think" class="common-anchor-header">我們很樂意聽聽您的想法！<button data-href="#Wed-Love-to-Hear-What-You-Think" class="anchor-icon" translate="no">
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
    </button></h2><p>如果您喜歡這篇部落格文章，請考慮：</p>
<ul>
<li>在<a href="https://github.com/milvus-io/milvus">GitHub</a>上給我們一顆星</li>
<li>💬 加入我們的<a href="https://discord.gg/FG6hMJStWu">Milvus Discord 社群</a>來分享您的經驗，或者如果您需要協助建立代理商</li>
<li>🔍 探索我們的<a href="https://github.com/milvus-io/bootcamp">Bootcamp 套件庫</a>，以獲得使用 Milvus 的應用程式範例</li>
</ul>
