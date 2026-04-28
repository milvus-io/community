---
id: introduce-deepsearcher-a-local-open-source-deep-research.md
title: 'Introducing DeepSearcher: A Local Open Source Deep Research'
author: Stefan Webb
date: 2025-02-21T00:00:00.000Z
desc: >-
  In contrast to OpenAI’s Deep Research, this example ran locally, using only
  open-source models and tools like Milvus and LangChain.
cover: >-
  assets.zilliz.com/Introducing_Deep_Searcher_A_Local_Open_Source_Deep_Research_4d00da5b85.png
tag: Announcements
tags: DeepSearcher
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/introduce-deepsearcher-a-local-open-source-deep-research
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deep_researcher_a0170dadd0.gif" alt="DeepSearcher" class="doc-image" id="deepsearcher" />
    <span>DeepSearcher</span>
  </span>
</p>
<p>In the previous post, <a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md"><em>“I Built a Deep Research with Open Source—and So Can You!”</em></a>, we explained some of the principles underlying research agents and constructed a simple prototype that generates detailed reports on a given topic or question. The article and corresponding notebook demonstrated the fundamental concepts of <em>tool use</em>, <em>query decomposition</em>, <em>reasoning</em>, and <em>reflection</em>. The example in our previous post, in contrast to OpenAI’s Deep Research, ran locally, using only open-source models and tools like <a href="https://milvus.io/docs">Milvus</a> and LangChain. (I encourage you to read the <a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md">above article</a> before continuing.)</p>
<p>In the following weeks, there was an explosion of interest in understanding and reproducing OpenAI’s Deep Research. See, for example, <a href="https://www.perplexity.ai/hub/blog/introducing-perplexity-deep-research">Perplexity Deep Research</a> and <a href="https://huggingface.co/blog/open-deep-research">Hugging Face’s Open DeepResearch</a>. These tools differ in architecture and methodology although sharing an objective: iteratively research a topic or question by surfing the web or internal documents and output a detailed, informed, and well-structured report. Importantly, the underlying agent automates reasoning about what action to take at each intermediate step.</p>
<p>In this post, we build upon our previous post and present Zilliz’s <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a> open-source project. Our agent demonstrates additional concepts: <em>query routing, conditional execution flow</em>, and <em>web crawling as a tool</em>. It is presented as a Python library and command-line tool rather than a Jupyter notebook and is more fully-featured than our previous post. For example, it can input multiple source documents and can set the embedding model and vector database used via a configuration file. While still relatively simple, DeepSearcher is a great showcase of agentic RAG and is a further step towards a state-of-the-art AI applications.</p>
<p>Additionally, we explore the need for faster and more efficient inference services. Reasoning models make use of “inference scaling”, that is, extra computation, to improve their output, and that combined with the fact that a single report may require hundreds or thousands of LLM calls results in inference bandwidth being the primary bottleneck. We use the <a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency">DeepSeek-R1 reasoning model on SambaNova’s custom-built hardware</a>, which is twice as fast in output tokens-per-second as the nearest competitor (see figure below).</p>
<p>SambaNova Cloud also provides inference-as-a-service for other open-source models including Llama 3.x, Qwen2.5, and QwQ. The inference service runs on SambaNova’s custom chip called the reconfigurable dataflow unit (RDU), which is specially designed for efficient inference on Generative AI models, lowering cost and increasing inference speed. <a href="https://sambanova.ai/technology/sn40l-rdu-ai-chip">Find out more on their website.</a></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Output_speed_deepseek_r1_d820329f0a.png" alt="Output Speed- DeepSeek R1" class="doc-image" id="output-speed--deepseek-r1" />
    <span>Output Speed- DeepSeek R1</span>
  </span>
</p>
<h2 id="DeepSearcher-Architecture" class="common-anchor-header">DeepSearcher Architecture<button data-href="#DeepSearcher-Architecture" class="anchor-icon" translate="no">
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
    </button></h2><p>The architecture of <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a> follows our previous post by breaking the problem up into four steps - <em>define/refine the question</em>, <em>research</em>, <em>analyze</em>, <em>synthesize</em> - although this time with some overlap. We go through each step, highlighting <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>’s improvements.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/deepsearcher_architecture_088c7066d1.png" alt="DeepSearcher Architecture" class="doc-image" id="deepsearcher-architecture" />
    <span>DeepSearcher Architecture</span>
  </span>
</p>
<h3 id="Define-and-Refine-the-Question" class="common-anchor-header">Define and Refine the Question</h3><pre><code translate="no" class="language-txt">Break down the original query <span class="hljs-keyword">into</span> <span class="hljs-keyword">new</span> sub queries: [
  <span class="hljs-string">&#x27;How has the cultural impact and societal relevance of The Simpsons evolved from its debut to the present?&#x27;</span>,
  <span class="hljs-string">&#x27;What changes in character development, humor, and storytelling styles have occurred across different seasons of The Simpsons?&#x27;</span>, 
  <span class="hljs-string">&#x27;How has the animation style and production technology of The Simpsons changed over time?&#x27;</span>,
  <span class="hljs-string">&#x27;How have audience demographics, reception, and ratings of The Simpsons shifted throughout its run?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<p>In the design of DeepSearcher, the boundaries between researching and refining the question are blurred. The initial user query is decomposed into sub-queries, much like the previous post. See above for initial subqueries produced from the query “How has The Simpsons changed over time?”. However, the following research step will continue to refine the question as needed.</p>
<h3 id="Research-and-Analyze" class="common-anchor-header">Research and Analyze</h3><p>Having broken down the query into sub-queries, the research portion of the agent begins. It has, roughly speaking, four steps: <em>routing</em>, <em>search</em>, <em>reflection, and conditional repeat</em>.</p>
<h4 id="Routing" class="common-anchor-header">Routing</h4><p>Our database contains multiple tables or collections from different sources. It would be more efficient if we could restrict our semantic search to only those sources that are relevant to the query at hand. A query router prompts an LLM to decide from which collections information should be retrieved.</p>
<p>Here is the method to form the query routing prompt:</p>
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
<p>We make the LLM return structured output as JSON in order to easily convert its output to a decision on what to do next.</p>
<h4 id="Search" class="common-anchor-header">Search</h4><p>Having selected various database collections via the previous step, the search step performs a similarity search with <a href="https://milvus.io/docs">Milvus</a>. Much like the previous post, the source data has been specified in advance, chunked, embedded, and stored in the vector database. For DeepSearcher, the data sources, both local and online, must be manually specified. We leave online search for future work.</p>
<h4 id="Reflection" class="common-anchor-header">Reflection</h4><p>Unlike the previous post, DeepSearcher illustrates a true form of agentic reflection, inputting the prior outputs as context into a prompt that “reflects” on whether the questions asked so far and the relevant retrieved chunks contain any informational gaps. This can be seen as an analysis step.</p>
<p>Here is the method to create the prompt:</p>
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
<p>Once more, we make the LLM return structured output, this time as Python-interpretable data.</p>
<p>Here is an example of new sub-queries “discovered” by reflection after answering the initial sub-queries above:</p>
<pre><code translate="no">New search queries <span class="hljs-keyword">for</span> <span class="hljs-built_in">next</span> iteration: [
  <span class="hljs-string">&quot;How have changes in The Simpsons&#x27; voice cast and production team influenced the show&#x27;s evolution over different seasons?&quot;</span>,
  <span class="hljs-string">&quot;What role has The Simpsons&#x27; satire and social commentary played in its adaptation to contemporary issues across decades?&quot;</span>,
  <span class="hljs-string">&#x27;How has The Simpsons addressed and incorporated shifts in media consumption, such as streaming services, into its distribution and content strategies?&#x27;</span>]
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conditional-Repeat" class="common-anchor-header">Conditional Repeat</h4><p>Unlike our previous post, DeepSearcher illustrates conditional execution flow. After reflecting on whether the questions and answers so far are complete, if there are additional questions to be asked the agent repeats the above steps. Importantly, the execution flow (a while loop) is a function of the LLM output rather than being hard-coded. In this case there is only a binary choice: <em>repeat research</em> or <em>generate a report</em>. In more complex agents there may be several such as: <em>follow hyperlink</em>, <em>retrieve chunks, store in memory, reflect</em> etc. In this way, the question continues to be refined as the agent sees fit until it decides to exit the loop and generate the report. In our Simpsons example, DeepSearcher performs two more rounds of filling the gaps with extra sub-queries.</p>
<h3 id="Synthesize" class="common-anchor-header">Synthesize</h3><p>Finally, the fully decomposed question and retrieved chunks are synthesized into a report with a single prompt. Here is the code to create the prompt:</p>
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
<p>This approach has the advantage over our prototype, which analyzed each question separately and simply concatenated the output, of producing a report where all sections are consistent with each other, i.e., containing no repeated or contradictory information. A more complex system could combine aspects of both, using a conditional execution flow to structure the report, summarize, rewrite, reflect and pivot, and so on, which we leave for future work.</p>
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
    </button></h2><p>Here is a sample from the report generated by the query “How has The Simpsons changed over time?” with DeepSeek-R1 passing the Wikipedia page on The Simpsons as source material:</p>
<pre><code translate="no" class="language-txt"><span class="hljs-title class_">Report</span>: <span class="hljs-title class_">The</span> <span class="hljs-title class_">Evolution</span> <span class="hljs-keyword">of</span> <span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> (<span class="hljs-number">1989</span>–<span class="hljs-title class_">Present</span>)
<span class="hljs-number">1.</span> <span class="hljs-title class_">Cultural</span> <span class="hljs-title class_">Impact</span> and <span class="hljs-title class_">Societal</span> <span class="hljs-title class_">Relevance</span>
<span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> debuted <span class="hljs-keyword">as</span> a subversive critique <span class="hljs-keyword">of</span> <span class="hljs-title class_">American</span> middle-<span class="hljs-keyword">class</span> <span class="hljs-title class_">life</span>, gaining notoriety <span class="hljs-keyword">for</span> its bold satire <span class="hljs-keyword">in</span> the 1990s. <span class="hljs-title class_">Initially</span> a countercultural phenomenon, it challenged norms <span class="hljs-keyword">with</span> episodes tackling religion, politics, and consumerism. <span class="hljs-title class_">Over</span> time, its cultural dominance waned <span class="hljs-keyword">as</span> competitors like <span class="hljs-title class_">South</span> <span class="hljs-title class_">Park</span> and <span class="hljs-title class_">Family</span> <span class="hljs-title class_">Guy</span> pushed boundaries further. <span class="hljs-title class_">By</span> the 2010s, the show transitioned <span class="hljs-keyword">from</span> trendsetter to nostalgic institution, balancing legacy appeal <span class="hljs-keyword">with</span> attempts to address modern issues like climate change and <span class="hljs-variable constant_">LGBTQ</span>+ rights, albeit <span class="hljs-keyword">with</span> less societal resonance.
…
<span class="hljs-title class_">Conclusion</span>
<span class="hljs-title class_">The</span> <span class="hljs-title class_">Simpsons</span> evolved <span class="hljs-keyword">from</span> a radical satire to a television institution, navigating shifts <span class="hljs-keyword">in</span> technology, politics, and audience expectations. <span class="hljs-title class_">While</span> its golden-age brilliance remains unmatched, its adaptability—through streaming, updated humor, and <span class="hljs-variable language_">global</span> outreach—secures its place <span class="hljs-keyword">as</span> a cultural touchstone. <span class="hljs-title class_">The</span> show’s longevity reflects both nostalgia and a pragmatic embrace <span class="hljs-keyword">of</span> change, even <span class="hljs-keyword">as</span> it grapples <span class="hljs-keyword">with</span> the challenges <span class="hljs-keyword">of</span> relevance <span class="hljs-keyword">in</span> a fragmented media landscape.
<button class="copy-code-btn"></button></code></pre>
<p>Find <a href="https://drive.google.com/file/d/1GE3rvxFFTKqro67ctTkknryUf-ojhduN/view?usp=sharing">the full report here</a>, and <a href="https://drive.google.com/file/d/1EGd16sJDNFnssk9yTd5o9jzbizrY_NS_/view?usp=sharing">a report produced by DeepSearcher with GPT-4o mini</a> for comparison.</p>
<h2 id="Discussion" class="common-anchor-header">Discussion<button data-href="#Discussion" class="anchor-icon" translate="no">
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
    </button></h2><p>We presented <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>, an agent for performing research and writing reports. Our system is built upon the idea in our previous article, adding features like conditional execution flow, query routing, and an improved interface. We switched from local inference with a small 4-bit quantized reasoning model to an online inference service for the massive DeepSeek-R1 model, qualitatively improving our output report. DeepSearcher works with most inference services like OpenAI, Gemini, DeepSeek and Grok 3 (coming soon!).</p>
<p>Reasoning models, especially as used in research agents, are inference-heavy, and we were fortunate to be able to use the fastest offering of DeepSeek-R1 from SambaNova running on their custom hardware. For our demonstration query, we made sixty-five calls to SambaNova’s DeepSeek-R1 inference service, inputting around 25k tokens, outputting 22k tokens, and costing $0.30. We were impressed with the speed of inference given that the model contains 671-billion parameters and is 3/4 of a terabyte large. <a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency">Find out more details here!</a></p>
<p>We will continue to iterate on this work in future posts, examining additional agentic concepts and the design space of research agents. In the meanwhile, we invite everyone to try out <a href="https://github.com/zilliztech/deep-searcher">DeepSearcher</a>, <a href="https://github.com/zilliztech/deep-searcher">star us on GitHub</a>, and share your feedback!</p>
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
<li><p><a href="https://github.com/zilliztech/deep-searcher"><strong>Zilliz’s DeepSearcher</strong></a></p></li>
<li><p>Background reading: <a href="https://milvus.io/blog/i-built-a-deep-research-with-open-source-so-can-you.md"><strong><em>“I Built a Deep Research with Open Source—and So Can You!”</em></strong></a></p></li>
<li><p><em>“</em><a href="https://sambanova.ai/press/fastest-deepseek-r1-671b-with-highest-efficiency"><strong>SambaNova Launches the Fastest DeepSeek-R1 671B with the Highest Efficiency</strong></a><em>”</em></p></li>
<li><p>DeepSearcher: <a href="https://drive.google.com/file/d/1GE3rvxFFTKqro67ctTkknryUf-ojhduN/view?usp=sharing">DeepSeek-R1 report on The Simpsons</a></p></li>
<li><p>DeepSearcher: <a href="https://drive.google.com/file/d/1EGd16sJDNFnssk9yTd5o9jzbizrY_NS_/view?usp=sharing">GPT-4o mini report on The Simpsons</a></p></li>
<li><p><a href="https://milvus.io/docs">Milvus Open-Source Vector Database</a></p></li>
</ul>
