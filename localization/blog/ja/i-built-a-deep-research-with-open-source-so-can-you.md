---
id: i-built-a-deep-research-with-open-source-so-can-you.md
title: I Built a Deep Research with Open Source—and So Can You!
author: Stefan Webb
date: 2025-02-6
desc: >-
  Learn how to create a Deep Research-style agent using open-source tools like
  Milvus, DeepSeek R1, and LangChain.
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
<p>Well actually, a minimally scoped agent that can reason, plan, use tools, etc. to perform research using Wikipedia. Still, not bad for a few hours of work…</p>
<p>Unless you reside under a rock, in a cave, or in a remote mountain monastery, you will have heard about OpenAI’s release of <em>Deep Research</em> on Feb 2, 2025. This new product promises to revolutionize how we answer questions requiring the synthesis of large amounts of diverse information.</p>
<p>You type in your query, select the Deep Research option, and the platform autonomously searches the web, performs reasoning on what it discovers, and synthesizes multiple sources into a coherent, fully-cited report. It takes several orders of magnitude longer to produce its output relative to a standard chatbot, but the result is more detailed, more informed, and more nuanced.</p>
<h2 id="How-does-it-work" class="common-anchor-header">How does it work?<button data-href="#How-does-it-work" class="anchor-icon" translate="no">
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
    </button></h2><p>But how does this technology work, and why is Deep Research a noticeable improvement over previous attempts (like Google’s <em>Deep Research</em> - incoming trademark dispute alert)? We’ll leave the latter for a future post. As for the former, there is no doubt much “secret sauce” underlying Deep Research. We can glean a few details from OpenAI’s release post, which I summarize.</p>
<p><strong>Deep Research exploits recent advances in foundation models specialized for reasoning tasks:</strong></p>
<ul>
<li><p>“…fine-tuned on the upcoming OpenAI o3 reasoning model…”</p></li>
<li><p>“…leverages reasoning to search, interpret, and analyze massive amounts of text…”</p></li>
</ul>
<p><strong>Deep Research makes use of a sophisticated agentic workflow with planning, reflection, and memory:</strong></p>
<ul>
<li><p>“…learned to plan and execute a multi-step trajectory…”</p></li>
<li><p>“…backtracking and reacting to real-time information…”</p></li>
<li><p>“…pivoting as needed in reaction to information it encounters…”</p></li>
</ul>
<p><strong>Deep Research is trained on proprietary data, using several types of fine-tuning, which is likely a key component in its performance:</strong></p>
<ul>
<li><p>“…trained using end-to-end reinforcement learning on hard browsing and reasoning tasks across a range of domains…”</p></li>
<li><p>“…optimized for web browsing and data analysis…”</p></li>
</ul>
<p>The exact design of the agentic workflow is a secret, however, we can build something ourselves based on well-established ideas about how to structure agents.</p>
<p><strong>One note before we begin</strong>: It is easy to be swept away by Generative AI fever, especially when a new product that seems a step-improvement is released. However, Deep Research, as OpenAI acknowledges, has limitations common to Generative AI technology. We should remember to think critically about the output in that it may contain false facts (“hallucinations”), incorrect formatting and citations, and vary significantly in quality based on the random seed.</p>
<h2 id="Can-I-build-my-own" class="common-anchor-header">Can I build my own?<button data-href="#Can-I-build-my-own" class="anchor-icon" translate="no">
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
    </button></h2><p>Why certainly! Let’s build our own “Deep Research”, running locally and with open-source tools. We’ll be armed with just a basic knowledge of Generative AI, common sense, a couple of spare hours, a GPU, and the open-source <a href="https://milvus.io/docs">Milvus</a>, <a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">DeepSeek R1</a>, and <a href="https://python.langchain.com/docs/introduction/">LangChain</a>.</p>
<p>We cannot hope to replicate OpenAI’s performance of course, but our prototype will minimally demonstrate some of the key ideas likely underlying their technology, combining advances in reasoning models with advances in agentic workflows. Importantly, and unlike OpenAI, we will be using only open-source tools, and be able to deploy our system locally - open-source certainly provides us great flexibility!</p>
<p>We will make a few simplifying assumptions to reduce the scope of our project:</p>
<ul>
<li><p>We will use an open-source reasoning mode distilled then <a href="https://zilliz.com/learn/unlock-power-of-vector-quantization-techniques-for-efficient-data-compression-and-retrieval">quantized</a> for 4-bits that can be run locally.</p></li>
<li><p>We will not perform additional fine-tuning on our reasoning model ourselves.</p></li>
<li><p>The only tool our agent has is the ability to download and read a Wikipedia page and perform separate RAG queries (we will not have access to the entire web).</p></li>
<li><p>Our agent will only process text data, not images, PDFs, etc.</p></li>
<li><p>Our agent will not backtrack or consider pivots.</p></li>
<li><p>Our agent will (not yet) control its execution flow based on its output.</p></li>
<li><p>Wikipedia contains the truth, the whole truth and nothing but the truth.</p></li>
</ul>
<p>We will use <a href="https://milvus.io/docs">Milvus</a> for our vector database, <a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">DeepSeek R1</a> as our reasoning model, and <a href="https://python.langchain.com/docs/introduction/">LangChain</a> to implement RAG. Let’s get started!</p>
<custom-h1>A Minimal Agent for Online Research</custom-h1><p>We will use our mental model of how humans conduct research to design the agentic workflow:</p>
<h3 id="DefineRefine-Question" class="common-anchor-header">Define/Refine Question</h3><p>Research starts by defining a question. We take the question to be the user’s query, however, we use our reasoning model to ensure the question is expressed in a way that is specific, clear, and focused. That is, our first step is to rewrite the prompt and extract any subqueries or subquestions. We make effective use of our foundation models specialization for reasoning, and a simple method for JSON structured output.</p>
<p>Here is an example reasoning trace as DeepSeek refines the question “How has the cast changed over time?”:</p>
<pre><code translate="no" class="language-text">&lt;think&gt;

Alright, so I need to <span class="hljs-built_in">break</span> down the question <span class="hljs-string">&quot;How has the cast changed over time?&quot;</span> related to the evolution of The Simpsons. Let me think about what aspects are involved here.

First, I know that the cast has changed a lot, but I need to figure out the intermediate questions to approach this. The main question is about changes <span class="hljs-keyword">in</span> the cast over <span class="hljs-keyword">time</span>, so I should consider different areas that contribute to this change.

I guess the first sub-question would be about the original cast members. Who were the main voices and how did they evolve? Then, there might be new cast additions over the years, so another sub-question about that.

Also, some original voice actors have left, so I should include a sub-question about departures. Then, new voice actors joining would be another point.

The show has been popular <span class="hljs-keyword">for</span> a long <span class="hljs-keyword">time</span>, so recurring roles changing might be another aspect. Additionally, the role of the show <span class="hljs-keyword">in</span> society might have influenced casting choices, so a sub-question about that.

Lastly, the overall impact on the cast<span class="hljs-string">&#x27;s careers could be another angle. So, I should list these as sub-questions to cover all aspects.

&lt;/think&gt;
</span><button class="copy-code-btn"></button></code></pre>
<h3 id="Search" class="common-anchor-header">Search</h3><p>Next, we conduct a “literature review” of Wikipedia articles. For now, we read a single article and leave navigating links to a future iteration. We discovered during prototyping that link exploration can become very expensive if each link requires a call to the reasoning model. We parse the article, and store its data in our vector database, Milvus, akin to taking notes.</p>
<p>Here is a code snippet showing how we store our Wikipedia page in Milvus using its LangChain integration:</p>
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
<h3 id="Analyze" class="common-anchor-header">Analyze</h3><p>The agent returns to its questions and answers them based on the relevant information in the document. We will leave a multi-step analysis/reflection workflow for future work, as well as any critical thinking on the credibility and bias of our sources.</p>
<p>Here is a code snippet illustrating constructing a RAG with LangChain and answering our subquestions separately.</p>
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
<h3 id="Synthesize" class="common-anchor-header">Synthesize</h3><p>After the agent has performed its research, it creates a structured outline, or rather, a skeleton, of its findings to summarize in a report. It then completes each section, filling it in with a section title and the corresponding content. We leave a more sophisticated workflow with reflection, reordering, and rewriting for a future iteration. This part of the agent involves planning, tool usage, and memory.</p>
<p>See <a href="https://drive.google.com/file/d/1waKX_NTgiY-47bYE0cI6qD8Cjn3zjrL6/view?usp=sharing">accompanying notebook</a> for the full code and the <a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=drive_link">saved report file</a> for example output.</p>
<h2 id="Results" class="common-anchor-header">Results<button data-href="#Results" class="anchor-icon" translate="no">
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
    </button></h2><p>Our query for testing is <em>“How has The Simpsons changed over time?”</em> and the data source is the Wikipedia article for “The Simpsons”. Here is one section of the <a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=sharing">generated report</a>:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/result_query_424beba224.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Summary-What-we-built-and-what’s-next" class="common-anchor-header">Summary: What we built and what’s next<button data-href="#Summary-What-we-built-and-what’s-next" class="anchor-icon" translate="no">
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
    </button></h2><p>In just a few hours, we have designed a basic agentic workflow that can reason, plan, and retrieve information from Wikipedia to generate a structured research report. While this prototype is far from OpenAI’s Deep Research, it demonstrates the power of open-source tools like Milvus, DeepSeek, and LangChain in building autonomous research agents.</p>
<p>Of course, there’s plenty of room for improvement. Future iterations could:</p>
<ul>
<li><p>Expand beyond Wikipedia to search multiple sources dynamically</p></li>
<li><p>Introduce backtracking and reflection to refine responses</p></li>
<li><p>Optimize execution flow based on the agent’s own reasoning</p></li>
</ul>
<p>Open-source gives us flexibility and control that closed source doesn’t. Whether for academic research, content synthesis, or AI-powered assistance, building our own research agents open up exciting possibilities. Stay tuned for the next post where we explore adding real-time web retrieval, multi-step reasoning, and conditional execution flow!</p>
<h2 id="Resources" class="common-anchor-header">Resources<button data-href="#Resources" class="anchor-icon" translate="no">
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
<li><p>Notebook: <em>“</em><a href="https://colab.research.google.com/drive/1W5tW8SqWXve7ZwbSb9pVdbt5R2wq105O?usp=sharing"><em>Baseline for An Open-Source Deep Research</em></a><em>”</em></p></li>
<li><p>Report: <em>“</em><a href="https://drive.google.com/file/d/15xeEe_EqY-29V2IlAvDy5yGdJdEPSHOh/view?usp=drive_link"><em>The evolution of The Simpsons as a show over time, covering changes in content, humor, character development, animation, and its role in society.</em></a><em>”</em></p></li>
<li><p><a href="https://milvus.io/docs">Milvus vector database documentation</a></p></li>
<li><p><a href="https://huggingface.co/unsloth/DeepSeek-R1-Distill-Llama-8B-unsloth-bnb-4bit">Distilled and quantized DeepSeek R1 model page</a></p></li>
<li><p><a href="https://python.langchain.com/docs/introduction/">️🔗 LangChain</a></p></li>
<li><p><a href="https://help.openai.com/en/articles/10500283-deep-research-faq">Deep Research FAQ | OpenAI Help Center</a></p></li>
</ul>
