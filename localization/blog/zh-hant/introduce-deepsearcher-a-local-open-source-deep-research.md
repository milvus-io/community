---
id: introduce-deepsearcher-a-local-open-source-deep-research.md
title: 介紹 DeepSearcher：本地開放原始碼深度研究
author: Stefan Webb
date: 2025-02-21T00:00:00.000Z
desc: 相較於 OpenAI 的 Deep Research，這個範例在本地執行，只使用 Milvus 和 LangChain 等開源模型和工具。
cover: >-
  assets.zilliz.com/Introducing_Deep_Searcher_A_Local_Open_Source_Deep_Research_4d00da5b85.png
tag: Announcements
tags: DeepSearcher
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/introduce-deepsearcher-a-local-open-source-deep-research
---
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deep_researcher_a0170dadd0.gif" alt="DeepSearcher" class="doc-image" id="deepsearcher" />
   </span> <span class="img-wrapper"> <span>深度搜尋器</span> </span></p>
<p>在上一篇文章<a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md"><em>「I Built a Deep Research with Open Source-and So Can You!」</em></a>中<a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md"><em>，</em></a>我們闡述了研究代理的一些基本原理，並建構了一個簡單的原型，可針對指定的主題或問題產生詳細的報告。這篇文章和相對應的筆記型電腦展示了<em>工具使用</em>、<em>查詢分解</em>、<em>推理</em>和<em>反省</em>的基本概念。我們上一篇文章中的範例，與 OpenAI 的 Deep Research 相反，是在本地執行，只使用<a href="https://milvus.io/docs">Milvus</a>和 LangChain 等開源模型和工具。(我鼓勵您先閱讀<a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md">上面的文章</a>再繼續)。</p>
<p>在接下來的幾個星期裡，人們對於理解和複製 OpenAI 的深度研究產生了爆炸性的興趣。例如，請參閱<a href="https://www.perplexity.ai/hub/blog/introducing-perplexity-deep-research">Perplexity Deep Research</a>和<a href="https://huggingface.co/blog/open-deep-research">Hugging Face 的 Open DeepResearch</a>。這些工具在架構和方法上有所不同，但目標相同：透過網路或內部文件迭代研究主題或問題，並輸出詳細、有資料且結構良好的報告。重要的是，底層代理程式會自動推理在每個中間步驟中應採取的行動。</p>
<p>在本篇文章中，我們將在上一篇文章的基礎上，介紹 Zilliz 的<a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>開源專案。我們的代理程式展示了其他概念：<em>查詢路由、條件執行流程</em>，以及<em>作為工具的網路爬行</em>。它是以 Python 函式庫和命令列工具的形式呈現，而非 Jupyter 記事本，而且功能比我們之前的文章更齊全。舉例來說，它可以輸入多個來源文件，並可透過設定檔設定所使用的嵌入模型和向量資料庫。雖然 DeepSearcher 仍然相對簡單，但它是代理式 RAG 的絕佳展示，也是邁向最先進 AI 應用程式的一大步。</p>
<p>此外，我們還探討了對更快、更有效率的推理服務的需求。推理模型會利用「推理擴充」（inference scaling），也就是額外的計算，來改善其輸出，再加上單一報告可能需要數百或數千個 LLM 呼叫，導致推理頻寬成為主要瓶頸。我們<a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency">在 SambaNova 的客製化硬體上</a>使用<a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency">DeepSeek-R1 推理模型</a>，其每秒輸出代幣的速度是最接近競爭對手的兩倍 (見下圖)。</p>
<p>SambaNova Cloud 也提供其他開源模型的推論即服務，包括 Llama 3.x、Qwen2.5 和 QwQ。推論服務運行在 SambaNova 的客製晶片上，稱為可重構資料流程單元 (RDU)，專門設計用於 Generative AI 模型的高效推論，可降低成本並提高推論速度。<a href="https://sambanova.ai/technology/sn40l-rdu-ai-chip">請至其網站瞭解更多資訊。</a></p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/Output_speed_deepseek_r1_d820329f0a.png" alt="Output Speed- DeepSeek R1" class="doc-image" id="output-speed--deepseek-r1" />
   </span> <span class="img-wrapper"> <span>輸出速度- DeepSeek R1</span> </span></p>
<h2 id="DeepSearcher-Architecture" class="common-anchor-header">DeepSearcher 架構<button data-href="#DeepSearcher-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p><a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>的架構遵循我們之前的文章，將問題分成四個步驟 -<em>定義/提昇問題</em>、<em>研究</em>、<em>分析</em>、<em>綜合</em>- 不過這次有一些重疊。我們將逐一介紹每個步驟，並強調<a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>的改進之處。</p>
<p>
  
   <span class="img-wrapper"> <img translate="no" src="https://assets.zilliz.com/deepsearcher_architecture_088c7066d1.png" alt="DeepSearcher Architecture" class="doc-image" id="deepsearcher-architecture" />
   </span> <span class="img-wrapper"> <span>DeepSearcher 架構</span> </span></p>
<h3 id="Define-and-Refine-the-Question" class="common-anchor-header">定義和提煉問題</h3><pre><code translate="no" class="language-txt">Break down the original query <span class="hljs-keyword">into</span> <span class="hljs-keyword">new</span> sub queries: [
  <span class="hljs-string">&#x27;How has the cultural impact and societal relevance of The Simpsons evolved from its debut to the present?&#x27;</span>,
  <span class="hljs-string">&#x27;What changes in character development, humor, and storytelling styles have occurred across different seasons of The Simpsons?&#x27;</span>, 
  <span class="hljs-string">&#x27;How has the animation style and production technology of The Simpsons changed over time?&#x27;</span>,
  <span class="hljs-string">&#x27;How have audience demographics, reception, and ratings of The Simpsons shifted throughout its run?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>在 DeepSearcher 的設計中，研究與提煉問題之間的界線非常模糊。初始使用者查詢會被分解為子查詢，這與上一篇文章很相似。請參閱上面由查詢「The Simpsons 隨著時間的推移有什麼變化？」所產生的初始子查詢。不過，接下來的研究步驟會視需要繼續精進問題。</p>
<h3 id="Research-and-Analyze" class="common-anchor-header">研究與分析</h3><p>將查詢分解成子查詢之後，代理的研究部分就開始了。粗略來說，它有四個步驟：<em>路由</em>、<em>搜尋</em>、<em>反思和條件重複</em>。</p>
<h4 id="Routing" class="common-anchor-header">路由</h4><p>我們的資料庫包含來自不同來源的多個資料表或資料集。如果我們能將語意搜尋限制在與手邊的查詢相關的資料來源，就會更有效率。查詢路由器會提示 LLM 決定應該從哪些資料集中擷取資訊。</p>
<p>以下是形成查詢路由提示的方法：</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_vector_db_search_prompt</span>(<span class="hljs-params">
    question: <span class="hljs-built_in">str</span>,
    collection_names: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
    collection_descriptions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
    context: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>] = <span class="hljs-literal">None</span>,
</span>):
    sections = []
    <span class="hljs-comment"># common prompt</span>
    common_prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an advanced AI problem analyst. Use your reasoning ability and historical conversation information, based on all the existing data sets, to get absolutely accurate answers to the following questions, and generate a suitable question for each data set according to the data set description that may be related to the question.

Question: <span class="hljs-subst">{question}</span>
&quot;&quot;&quot;</span>
    sections.append(common_prompt)
    
    <span class="hljs-comment"># data set prompt</span>
    data_set = []
    <span class="hljs-keyword">for</span> i, collection_name <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(collection_names):
        data_set.append(<span class="hljs-string">f&quot;<span class="hljs-subst">{collection_name}</span>: <span class="hljs-subst">{collection_descriptions[i]}</span>&quot;</span>)
    data_set_prompt = <span class="hljs-string">f&quot;&quot;&quot;The following is all the data set information. The format of data set information is data set name: data set description.

Data Sets And Descriptions:
&quot;&quot;&quot;</span>
    sections.append(data_set_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(data_set))
    
    <span class="hljs-comment"># context prompt</span>
    <span class="hljs-keyword">if</span> context:
        context_prompt = <span class="hljs-string">f&quot;&quot;&quot;The following is a condensed version of the historical conversation. This information needs to be combined in this analysis to generate questions that are closer to the answer. You must not generate the same or similar questions for the same data set, nor can you regenerate questions for data sets that have been determined to be unrelated.

Historical Conversation:
&quot;&quot;&quot;</span>
        sections.append(context_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(context))
    
    <span class="hljs-comment"># response prompt</span>
    response_prompt = <span class="hljs-string">f&quot;&quot;&quot;Based on the above, you can only select a few datasets from the following dataset list to generate appropriate related questions for the selected datasets in order to solve the above problems. The output format is json, where the key is the name of the dataset and the value is the corresponding generated question.

Data Sets:
&quot;&quot;&quot;</span>
    sections.append(response_prompt + <span class="hljs-string">&quot;\n&quot;</span>.join(collection_names))
    
    footer = <span class="hljs-string">&quot;&quot;&quot;Respond exclusively in valid JSON format matching exact JSON schema.

Critical Requirements:
- Include ONLY ONE action type
- Never add unsupported keys
- Exclude all non-JSON text, markdown, or explanations
- Maintain strict JSON syntax&quot;&quot;&quot;</span>
    sections.append(footer)
    <span class="hljs-keyword">return</span> <span class="hljs-string">&quot;\n\n&quot;</span>.join(sections)
<button class="copy-code-btn"></button></code></pre>
<p>我們讓 LLM 以 JSON 格式傳回結構化的輸出，以便輕鬆地將其輸出轉換為決定下一步該做什麼。</p>
<h4 id="Search" class="common-anchor-header">搜尋</h4><p>透過上一步選擇各種資料庫集合後，搜尋步驟會使用<a href="https://milvus.io/docs">Milvus</a> 執行相似性搜尋。跟上一篇文章很像，來源資料已事先指定、分塊、嵌入並儲存在向量資料庫中。對 DeepSearcher 而言，本地和線上的資料來源都必須手動指定。我們將線上搜尋留給未來的工作。</p>
<h4 id="Reflection" class="common-anchor-header">反射</h4><p>與之前的文章不同，DeepSearcher 展示了真正形式的代理反思，將先前的輸出作為上下文輸入到一個提示中，以「反思」目前所提出的問題和相關的檢索塊是否包含任何資訊缺口。這可以視為分析步驟。</p>
<p>以下是建立提示的方法：</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_reflect_prompt</span>(<span class="hljs-params">
   question: <span class="hljs-built_in">str</span>,
   mini_questions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
   mini_chuncks: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
</span>):
    mini_chunk_str = <span class="hljs-string">&quot;&quot;</span>
    <span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(mini_chuncks):
        mini_chunk_str += <span class="hljs-string">f&quot;&quot;&quot;&lt;chunk_<span class="hljs-subst">{i}</span>&gt;\n<span class="hljs-subst">{chunk}</span>\n&lt;/chunk_<span class="hljs-subst">{i}</span>&gt;\n&quot;&quot;&quot;</span>
    reflect_prompt = <span class="hljs-string">f&quot;&quot;&quot;Determine whether additional search queries are needed based on the original query, previous sub queries, and all retrieved document chunks. If further research is required, provide a Python list of up to 3 search queries. If no further research is required, return an empty list.

If the original query is to write a report, then you prefer to generate some further queries, instead return an empty list.

    Original Query: <span class="hljs-subst">{question}</span>
    Previous Sub Queries: <span class="hljs-subst">{mini_questions}</span>
    Related Chunks: 
    <span class="hljs-subst">{mini_chunk_str}</span>
    &quot;&quot;&quot;</span>
   
    
    footer = <span class="hljs-string">&quot;&quot;&quot;Respond exclusively in valid List of str format without any other text.&quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> reflect_prompt + footer
<button class="copy-code-btn"></button></code></pre>
<p>我們再一次讓 LLM 傳回結構化的輸出，這次是 Python 可解釋的資料。</p>
<p>以下是回答上述初始子查詢後，經由反思「發現」新子查詢的範例：</p>
<pre><code translate="no">New search queries <span class="hljs-keyword">for</span> <span class="hljs-built_in">next</span> iteration: [
  <span class="hljs-string">&quot;How have changes in The Simpsons&#x27; voice cast and production team influenced the show&#x27;s evolution over different seasons?&quot;</span>,
  <span class="hljs-string">&quot;What role has The Simpsons&#x27; satire and social commentary played in its adaptation to contemporary issues across decades?&quot;</span>,
  <span class="hljs-string">&#x27;How has The Simpsons addressed and incorporated shifts in media consumption, such as streaming services, into its distribution and content strategies?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conditional-Repeat" class="common-anchor-header">條件重複</h4><p>與我們之前的文章不同，DeepSearcher 說明了有條件的執行流程。在反思到目前為止的問題和答案是否完整之後，如果還有其他問題要問，代理程式會重複上述步驟。重要的是，執行流程（一個 while 環路）是 LLM 輸出的函數，而不是硬體編碼。在這種情況下，只有二選一：<em>重複研究</em> <em>或產生報告</em>。在更複雜的代理中，可能會有數個選擇，例如：<em>遵循超連結</em>、<em>擷取大塊資料、儲存於記憶體、反思</em>等。如此一來，這個問題就會隨著代理視為合適的方式持續改進，直到它決定退出迴圈並生成報告為止。在 Simpsons 的範例中，DeepSearcher 會再執行兩輪，以額外的子查詢來填補空隙。</p>
<h3 id="Synthesize" class="common-anchor-header">合成</h3><p>最後，完全分解的問題和擷取的區塊會合成為一份報告，並帶有單一提示。以下是建立提示的程式碼：</p>
<pre><code translate="no" class="language-python"><span class="hljs-keyword">def</span> <span class="hljs-title function_">get_final_answer_prompt</span>(<span class="hljs-params">
   question: <span class="hljs-built_in">str</span>, 
   mini_questions: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
   mini_chuncks: <span class="hljs-type">List</span>[<span class="hljs-built_in">str</span>],
</span>):
    mini_chunk_str = <span class="hljs-string">&quot;&quot;</span>
    <span class="hljs-keyword">for</span> i, chunk <span class="hljs-keyword">in</span> <span class="hljs-built_in">enumerate</span>(mini_chuncks):
        mini_chunk_str += <span class="hljs-string">f&quot;&quot;&quot;&lt;chunk_<span class="hljs-subst">{i}</span>&gt;\n<span class="hljs-subst">{chunk}</span>\n&lt;/chunk_<span class="hljs-subst">{i}</span>&gt;\n&quot;&quot;&quot;</span>
    summary_prompt = <span class="hljs-string">f&quot;&quot;&quot;You are an AI content analysis expert, good at summarizing content. Please summarize a specific and detailed answer or report based on the previous queries and the retrieved document chunks.

    Original Query: <span class="hljs-subst">{question}</span>
    Previous Sub Queries: <span class="hljs-subst">{mini_questions}</span>
    Related Chunks: 
    <span class="hljs-subst">{mini_chunk_str}</span>
    &quot;&quot;&quot;</span>
    <span class="hljs-keyword">return</span> summary_prompt
<button class="copy-code-btn"></button></code></pre>
<p>我們的原型是單獨分析每個問題，然後簡單地串接輸出，與此相比，這種方法的優點是製作的報告中所有部分都是一致的，即不包含重複或矛盾的資訊。一個更複雜的系統可以結合兩者的某些方面，使用條件執行流程來結構化報告、總結、重寫、反思及透視等，我們將此留待未來的工作。</p>
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
    </button></h2><p>以下是以 DeepSeek-R1 通過維基百科上的辛普森一家頁面作為原始資料，查詢「辛普森一家是如何隨著時間改變的？</p>
<pre><code translate="no" class="language-txt"><span class="hljs-title class_">Report</span>: <span class="hljs-title class_">The</span> <span class="hljs-title class_">Evolution</span> <span class="hljs-keyword">of</span> <span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> (<span class="hljs-number">1989</span>–<span class="hljs-title class_">Present</span>)
<span class="hljs-number">1.</span> <span class="hljs-title class_">Cultural</span> <span class="hljs-title class_">Impact</span> and <span class="hljs-title class_">Societal</span> <span class="hljs-title class_">Relevance</span>
<span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> debuted <span class="hljs-keyword">as</span> a subversive critique <span class="hljs-keyword">of</span> <span class="hljs-title class_">American</span> middle-<span class="hljs-keyword">class</span> <span class="hljs-title class_">life</span>, gaining notoriety <span class="hljs-keyword">for</span> its bold satire <span class="hljs-keyword">in</span> the 1990s. <span class="hljs-title class_">Initially</span> a countercultural phenomenon, it challenged norms <span class="hljs-keyword">with</span> episodes tackling religion, politics, and consumerism. <span class="hljs-title class_">Over</span> time, its cultural dominance waned <span class="hljs-keyword">as</span> competitors like <span class="hljs-title class_">South</span> <span class="hljs-title class_">Park</span> and <span class="hljs-title class_">Family</span> <span class="hljs-title class_">Guy</span> pushed boundaries further. <span class="hljs-title class_">By</span> the 2010s, the show transitioned <span class="hljs-keyword">from</span> trendsetter to nostalgic institution, balancing legacy appeal <span class="hljs-keyword">with</span> attempts to address modern issues like climate change and <span class="hljs-variable constant_">LGBTQ</span>+ rights, albeit <span class="hljs-keyword">with</span> less societal resonance.
…
<span class="hljs-title class_">Conclusion</span>
<span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> evolved <span class="hljs-keyword">from</span> a radical satire to a television institution, navigating shifts <span class="hljs-keyword">in</span> technology, politics, and audience expectations. <span class="hljs-title class_">While</span> its golden-age brilliance remains unmatched, its adaptability—through streaming, updated humor, and <span class="hljs-variable language_">global</span> outreach—secures its place <span class="hljs-keyword">as</span> a cultural touchstone. <span class="hljs-title class_">The</span> show’s longevity reflects both nostalgia and a pragmatic embrace <span class="hljs-keyword">of</span> change, even <span class="hljs-keyword">as</span> it grapples <span class="hljs-keyword">with</span> the challenges <span class="hljs-keyword">of</span> relevance <span class="hljs-keyword">in</span> a fragmented media landscape.
<button class="copy-code-btn"></button></code></pre>
<p><a href="https://drive.google.com/file/d/1GE3rvxFFTKqro67ctTkknryUf-ojhduN/view?usp=sharing">在這裡</a>找到<a href="https://drive.google.com/file/d/1GE3rvxFFTKqro67ctTkknryUf-ojhduN/view?usp=sharing">完整的報告</a>，以及<a href="https://drive.google.com/file/d/1EGd16sJDNFnssk9yTd5o9jzbizrY_NS_/view?usp=sharing">DeepSearcher 使用 GPT-4o mini 產生的報告</a>，以供比較。</p>
<h2 id="Discussion" class="common-anchor-header">討論<button data-href="#Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>我們介紹了<a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>，一個執行研究與撰寫報告的代理程式。我們的系統建立在前一篇文章的概念上，並加入了條件執行流程、查詢路由和改良介面等功能。我們從使用小型 4 位元量化推理模型的本機推理，改為使用大型 DeepSeek-R1 模型的線上推理服務，從質上改善了我們的輸出報告。DeepSearcher 可與大多數的推理服務搭配使用，例如 OpenAI、Gemini、DeepSeek 和 Grok 3（即將推出！）。</p>
<p>推理模型，尤其是用在研究代理中的推理模型，都是重推理的，而我們很幸運能使用 SambaNova 在其客製化硬體上運行的 DeepSeek-R1 最快版本。在我們的示範查詢中，我們調用了 65 次 SambaNova 的 DeepSeek-R1 推理服務，輸入約 25k token，輸出 22k token，成本為 0.30 美元。鑑於模型包含 671 億個參數，而且有 3/4 TB 之大，推論的速度讓我們印象深刻。<a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency">在此瞭解更多詳細資訊！</a></p>
<p>我們將在未來的文章中繼續迭代這項工作，檢視更多的代理概念和研究代理的設計空間。與此同時，我們邀請大家試用<a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>，<a href="https://github.com/zilliztech/deep-searcher">在 GitHub 上給予我們星星</a>，並分享您的意見！</p>
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
<li><p><a href="https://github.com/zilliztech/deep-searcher"><strong>Zilliz 的 DeepSearcher</strong></a></p></li>
<li><p>背景閱讀：<a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md"><strong><em>「我用開放原始碼建立了一個深度研究-您也可以！」</em></strong></a></p></li>
<li><p><a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency"><strong>「SambaNova以最高效率推出最快的DeepSeek-R1 671B</strong></a><em>」</em></p></li>
<li><p>DeepSearcher<a href="https://drive.google.com/file/d/1GE3rvxFFTKqro67ctTkknryUf-ojhduN/view?usp=sharing">DeepSeek-R1在辛普森一家的報告</a></p></li>
<li><p>DeepSearcher：<a href="https://drive.google.com/file/d/1EGd16sJDNFnssk9yTd5o9jzbizrY_NS_/view?usp=sharing">有關《辛普森一家》的 GPT-4o 迷你報告</a></p></li>
<li><p><a href="https://milvus.io/docs">Milvus 開源向量資料庫</a></p></li>
</ul>
