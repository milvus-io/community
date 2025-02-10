---
id: i-built-a-deep-research-with-open-source-so-can-you.md
title: 我利用開放原始碼建立了深入的研究，您也可以！
author: Stefan Webb
date: 2025-02-6
desc: 學習如何使用 Milvus、DeepSeek R1 和 LangChain 等開放原始碼工具，建立深度研究風格的代理程式。
cover: >-
  assets.zilliz.com/I_Built_a_Deep_Research_with_Open_Source_and_So_Can_You_7eb2a38078.png
tag: Tutorials
tags: 'Deep Research, open source AI, Milvus, LangChain, DeepSeek R1'
recommend: true
canonicalUrl: 'https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deep_research_blog_image_95225226eb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>事實上，這是一個最小範圍的代理程式，可以推理、計畫、使用工具等，利用維基百科進行研究。不過，對於幾個小時的工作來說，這也不賴...</p>
<p>除非您住在岩石下、洞穴中或偏遠的高山寺院，否則您一定聽說過 OpenAI 於 2025 年 2 月 2 日發佈的<em>Deep Research</em>。這項新產品有望徹底改變我們回答需要綜合大量不同資訊的問題的方式。</p>
<p>您輸入查詢內容，選擇「深度研究」（Deep Research）選項，平台就會自動搜尋網路、對發現的資料進行推理，並將多種來源的資料綜合成一份連貫、有完整引文的報告。相較於標準的聊天機器人，它需要更長的時間才能產生輸出，但結果卻更詳細、更有見地、更細緻。</p>
<h2 id="How-does-it-work" class="common-anchor-header">它是如何運作的？<button data-href="#How-does-it-work" class="anchor-icon" translate="no">
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
    </button></h2><p>但這項技術是如何運作的呢？為什麼 Deep Research 比之前的嘗試（例如 Google 的<em>Deep Research</em>- 商標爭議警示）有顯著的進步呢？後者我們留待未來的文章再討論。至於前者，Deep Research 的背後無疑有許多「秘訣」。我們可以從 OpenAI 發佈的文章中蒐集一些細節，以下是我的總結。</p>
<p><strong>Deep Research 利用了專門用於推理任務的基礎模型的最新進展：</strong></p>
<ul>
<li><p>「...在即將推出的 OpenAI o3 推理模型上進行微調...」</p></li>
<li><p>「......利用推理搜索、解释和分析海量文本......」</p></li>
</ul>
<p><strong>Deep Research 運用了具有規劃、反思和記憶的精密代理工作流程：</strong></p>
<ul>
<li><p>"...learned to plan and execute a multi-step trajectory..."</p></li>
<li><p>「......回溯並對即時資訊做出反應......」</p></li>
<li><p>「......根據需要轉向，對遇到的資訊作出反應......」</p></li>
</ul>
<p><strong>Deep Research 在專屬資料上進行訓練，並使用多種類型的微調，這可能是其效能的關鍵要素：</strong></p>
<ul>
<li><p>「......使用端對端強化學習，在一系列領域的硬瀏覽和推理任務上進行訓練......」</p></li>
<li><p>「...針對網頁瀏覽和資料分析進行了最佳化...」</p></li>
</ul>
<p>代理工作流程的確切設計是個秘密，不過，我們可以根據如何架構代理的既定想法，自己建立一些東西。</p>
<p><strong>在我們開始之前，請注意一點</strong>：我們很容易就會被生成式人工智能的熱潮所淹沒，尤其是當一個看似進步的新產品發表時。然而，正如 OpenAI 所承認的，Deep Research 與 Generative AI 技術一樣，都有其限制。我們應該記得批判性地思考輸出，因為它可能包含錯誤的事實 (「幻覺」)、不正確的格式與引文，而且根據隨機種子的不同，品質也會有顯著的差異。</p>
<h2 id="Can-I-build-my-own" class="common-anchor-header">我可以自己建立一個嗎？<button data-href="#Can-I-build-my-own" class="anchor-icon" translate="no">
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
    </button></h2><p>當然可以！讓我們建立自己的「深度研究」，使用開源工具在本地執行。我們只需具備生成式人工智能的基本知識、常識、幾個空閒時間、一個 GPU，以及開放原始碼的<a href="https://milvus.io/docs">Milvus</a>、<a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">DeepSeek R1</a> 和<a href="https://python.langchain.com/docs/introduction/">LangChain</a>。</p>
<p>當然，我們不希望能複製 OpenAI 的效能，但我們的原型將最小化地展現他們技術的一些關鍵想法，結合推理模型的進步與代理工作流程的進步。重要的是，與 OpenAI 不同的是，我們只會使用開放原始碼的工具，並且能夠在本地部署我們的系統 - 開放原始碼當然提供了我們極大的彈性！</p>
<p>我們將做一些簡化的假設，以縮小專案的範圍：</p>
<ul>
<li><p>我們將採用可在本機執行的開放原始碼推理模式，經過蒸餾後再<a href="https://zilliz.com/learn/unlock-power-of-vector-quantization-techniques-for-efficient-data-compression-and-retrieval">量化</a>為 4 位元。</p></li>
<li><p>我們不會自行對推理模型進行額外的微調。</p></li>
<li><p>我們的代理程式唯一擁有的工具是下載和閱讀維基百科頁面，並執行單獨的 RAG 查詢 (我們無法存取整個網頁)。</p></li>
<li><p>我們的代理程式只會處理文字資料，不會處理圖片、PDF 等資料。</p></li>
<li><p>我們的代理程式不會回溯或考慮樞軸。</p></li>
<li><p>我們的代理程式將（尚未）根據其輸出來控制其執行流程。</p></li>
<li><p>維基百科包含真相、全部真相，以及除了真相之外的一切。</p></li>
</ul>
<p>我們將使用<a href="https://milvus.io/docs">Milvus</a>作為向量資料庫，<a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">DeepSeek R1</a>作為推理模型，並使用<a href="https://python.langchain.com/docs/introduction/">LangChain</a>來實作 RAG。讓我們開始吧！</p>
<custom-h1>線上研究的最小代理</custom-h1><p>我們將使用人類如何進行研究的心智模型來設計代理工作流程：</p>
<h3 id="DefineRefine-Question" class="common-anchor-header">定義/精確問題</h3><p>研究從定義問題開始。我們將該問題視為使用者的查詢，然而，我們會使用我們的推理模型來確保該問題的表達方式是具體、清楚且重點突出的。也就是說，我們的第一步是重寫提示，並擷取任何子查詢或子問題。我們有效利用我們的基礎模型專精於推理，以及 JSON 結構化輸出的簡單方法。</p>
<p>以下是一個推理軌跡範例，DeepSeek 細化了問題「鑄造工藝隨著時間的推移發生了什麼變化？</p>
<pre><code translate="no" class="language-text">&lt;think&gt;

Alright, so I need to <span class="hljs-built_in">break</span> down the question <span class="hljs-string">&quot;How has the cast changed over time?&quot;</span> related to the evolution of The Simpsons. Let me think about what aspects are involved here.

First, I know that the cast has changed a lot, but I need to figure out the intermediate questions to approach this. The main question is about changes <span class="hljs-keyword">in</span> the cast over <span class="hljs-keyword">time</span>, so I should consider different areas that contribute to this change.

I guess the first sub-question would be about the original cast members. Who were the main voices and how did they evolve? Then, there might be new cast additions over the years, so another sub-question about that.

Also, some original voice actors have left, so I should include a sub-question about departures. Then, new voice actors joining would be another point.

The show has been popular <span class="hljs-keyword">for</span> a long <span class="hljs-keyword">time</span>, so recurring roles changing might be another aspect. Additionally, the role of the show <span class="hljs-keyword">in</span> society might have influenced casting choices, so a sub-question about that.

Lastly, the overall impact on the cast<span class="hljs-string">&#x27;s careers could be another angle. So, I should list these as sub-questions to cover all aspects.

&lt;/think&gt;
</span><button class="copy-code-btn"></button></code></pre>
<h3 id="Search" class="common-anchor-header">搜尋</h3><p>接下來，我們進行維基百科文章的「文獻檢閱」。目前，我們只閱讀單篇文章，並將導航連結留待未來迭代。我們在原型開發過程中發現，如果每個連結都需要呼叫推理模型，那麼連結探索就會變得非常昂貴。我們解析文章，並將其資料儲存在向量資料庫 Milvus 中，就像做筆記一樣。</p>
<p>以下是一個程式碼片段，顯示我們如何使用 Milvus 的 LangChain 整合功能，將 Wikipedia 頁面儲存在 Milvus 中：</p>
<pre><code translate="no" class="language-python">wiki_wiki = wikipediaapi.Wikipedia(user_agent=<span class="hljs-string">&#x27;MilvusDeepResearchBot (&lt;insert your email&gt;)&#x27;</span>, language=<span class="hljs-string">&#x27;en&#x27;</span>)
page_py = wiki_wiki.page(page_title)

text_splitter = RecursiveCharacterTextSplitter(chunk_size=<span class="hljs-number">2000</span>, chunk_overlap=<span class="hljs-number">200</span>)
docs = text_splitter.create_documents([page_py.text])

vectorstore = Milvus.from_documents(  <span class="hljs-comment"># or Zilliz.from_documents</span>
    documents=docs,
    embedding=embeddings,
    connection_args={
        <span class="hljs-string">&quot;uri&quot;</span>: <span class="hljs-string">&quot;./milvus_demo.db&quot;</span>,
    },
    drop_old=<span class="hljs-literal">True</span>, 
    index_params={
        <span class="hljs-string">&quot;metric_type&quot;</span>: <span class="hljs-string">&quot;COSINE&quot;</span>,
        <span class="hljs-string">&quot;index_type&quot;</span>: <span class="hljs-string">&quot;FLAT&quot;</span>,  
        <span class="hljs-string">&quot;params&quot;</span>: {},
    },
)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Analyze" class="common-anchor-header">分析</h3><p>代理返回其問題，並根據文件中的相關資訊回答問題。我們會將多步分析/思考的工作流程留待未來的工作，以及對我們資料來源的可信度和偏見的任何批判性思考。</p>
<p>以下是使用 LangChain 建構 RAG 並分別回答子問題的程式碼片段。</p>
<pre><code translate="no" class="language-python"><span class="hljs-comment"># Define the RAG chain for response generation</span>
rag_chain = (
    {<span class="hljs-string">&quot;context&quot;</span>: retriever | format_docs, <span class="hljs-string">&quot;question&quot;</span>: RunnablePassthrough()}
    | prompt
    | llm
    | StrOutputParser()
)

<span class="hljs-comment"># Prompt the RAG for each question</span>
answers = {}
total = <span class="hljs-built_in">len</span>(leaves(breakdown))

pbar = tqdm(total=total)
<span class="hljs-keyword">for</span> k, v <span class="hljs-keyword">in</span> breakdown.items():
    <span class="hljs-keyword">if</span> v == []:
        <span class="hljs-built_in">print</span>(k)
        answers[k] = rag_chain.invoke(k).split(<span class="hljs-string">&#x27;&lt;/think&gt;&#x27;</span>)[-<span class="hljs-number">1</span>].strip()
        pbar.update(<span class="hljs-number">1</span>)
    <span class="hljs-keyword">else</span>:
        <span class="hljs-keyword">for</span> q <span class="hljs-keyword">in</span> v:
            <span class="hljs-built_in">print</span>(q)
            answers[q] = rag_chain.invoke(q).split(<span class="hljs-string">&#x27;&lt;/think&gt;&#x27;</span>)[-<span class="hljs-number">1</span>].strip()
            pbar.update(<span class="hljs-number">1</span>)
<button class="copy-code-btn"></button></code></pre>
<h3 id="Synthesize" class="common-anchor-header">綜合</h3><p>代理程式執行研究之後，會建立一個結構化的大綱，或者說是骨架，將研究結果總結成報告。然後，它會完成每個部分，填入部分標題和相對應的內容。我們將更複雜的工作流程，包括反思、重新排序和重寫，留待未來的迭代。這部分的代理程式涉及規劃、工具使用和記憶體。</p>
<p>完整程式碼請參閱<a href="https://drive.google.com/file/d/1waKX_NTgiY-47bYE0cI6qD8Cjn3zjrL6/view?usp=sharing">隨附的筆記型</a>電腦，輸出範例請參閱<a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=drive_link">儲存的報告檔案</a>。</p>
<h2 id="Results" class="common-anchor-header">結果<button data-href="#Results" class="anchor-icon" translate="no">
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
    </button></h2><p>我們測試的查詢是<em>「The Simpsons 如何隨著時間改變？」</em>，資料來源是 Wikipedia 上 "The Simpsons" 的文章。以下是<a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=sharing">所產生報告</a>的一部分：</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/result_query_424beba224.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Summary-What-we-built-and-what’s-next" class="common-anchor-header">摘要：我們建立了什麼以及下一步要做什麼<button data-href="#Summary-What-we-built-and-what’s-next" class="anchor-icon" translate="no">
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
    </button></h2><p>在短短幾個小時內，我們設計了一個基本的代理工作流程，可以推理、規劃並從維基百科擷取資訊，以產生一份結構化的研究報告。雖然這個原型與 OpenAI 的 Deep Research 相差甚遠，但它展示了 Milvus、DeepSeek 和 LangChain 等開源工具在建立自主研究代理程式方面的威力。</p>
<p>當然，還有很多改進的空間。未來的迭代可以</p>
<ul>
<li><p>擴展到維基百科以外，動態搜尋多個來源</p></li>
<li><p>引進回溯與反思功能，以精緻回應</p></li>
<li><p>根據代理程式本身的推理來優化執行流程</p></li>
</ul>
<p>開放原始碼提供我們封閉原始碼所沒有的彈性與控制力。無論是學術研究、內容綜合或人工智慧驅動的協助，建立我們自己的研究代理程式都能開啟令人興奮的可能性。請密切注意下一篇文章，我們將探討增加即時網路檢索、多步推理和條件執行流程！</p>
<h2 id="Resources" class="common-anchor-header">資源<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p>筆記本：<em>"「</em><a href="https://colab.research.google.com/drive/1W5tW8SqWXve7ZwbSb9pVdbt5R2wq105O?usp=sharing"><em>開放源碼深度研究</em></a><em>的</em><a href="https://colab.research.google.com/drive/1W5tW8SqWXve7ZwbSb9pVdbt5R2wq105O?usp=sharing"><em>基線</em></a></p></li>
<li><p>報告：<a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=drive_link"><em>「《辛普森一家》作為一個節目隨著時間的演變，涵蓋內容、幽默、角色發展、動畫及其在社會中角色的變化</em></a><em>」</em><a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=drive_link"><em>。</em></a></p></li>
<li><p><a href="https://milvus.io/docs">Milvus 向量資料庫文件</a></p></li>
<li><p><a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">經過提煉和量化的 DeepSeek R1 模型頁面</a></p></li>
<li><p><a href="https://python.langchain.com/docs/introduction/">️🔗 LangChain</a></p></li>
<li><p><a href="https://help.openai.com/en/articles/10500283-deep-research-faq">深度研究常見問題集 | OpenAI 幫助中心</a></p></li>
</ul>
