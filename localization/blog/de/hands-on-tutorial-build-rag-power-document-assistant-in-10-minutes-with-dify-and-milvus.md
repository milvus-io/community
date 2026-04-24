---
id: >-
  hands-on-tutorial-build-rag-power-document-assistant-in-10-minutes-with-dify-and-milvus.md
title: >
  Hands-on Tutorial: Build a RAG-Powered Document Assistant in 10 Minutes with
  Dify and Milvus
author: Ruben Winastwan
date: 2025-04-28T00:00:00.000Z
desc: >-
  Learn how to create an AI-powered document assistant using Retrieval Augmented
  Generation (RAG) with Dify and Milvus in this quick, hands-on developer
  tutorial.
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
<p>What if you could turn your entire documentation library—thousands of pages of technical specs, internal wikis, and code documentation—into an intelligent AI assistant that instantly answers specific questions?</p>
<p>Even better, what if you could build it in less time than it takes to fix a merge conflict?</p>
<p>That’s the promise of <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval Augmented Generation</a> (RAG) when implemented the right way.</p>
<p>While ChatGPT and other LLMs are impressive, they quickly hit their limits when asked about your company’s specific documentation, codebase, or knowledge base. RAG bridges this gap by integrating your proprietary data into the conversation, providing you with AI capabilities that are directly relevant to your work.</p>
<p>The problem? Traditional RAG implementation looks like this:</p>
<ul>
<li><p>Write custom embedding generation pipelines</p></li>
<li><p>Configure and deploy a vector database</p></li>
<li><p>Engineer complex prompt templates</p></li>
<li><p>Build retrieval logic and similarity thresholds</p></li>
<li><p>Create a usable interface</p></li>
</ul>
<p>But what if you could skip straight to the results?</p>
<p>In this tutorial, we’ll build a simple RAG application using two developer-focused tools:</p>
<ul>
<li><p><a href="https://github.com/langgenius/dify">Dify</a>: An open-source platform that handles the RAG orchestration with minimal configuration</p></li>
<li><p><a href="https://milvus.io/docs/overview.md">Milvus</a>: A blazing-fast open-source vector database purpose-built for similarity search and AI searches</p></li>
</ul>
<p>By the end of this 10-minute guide, you’ll have a working AI assistant that can answer detailed questions about any document collection you throw at it - no machine learning degree required.</p>
<h2 id="What-Youll-Build" class="common-anchor-header">What You’ll Build<button data-href="#What-Youll-Build" class="anchor-icon" translate="no">
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
    </button></h2><p>In just a few minutes of active work, you’ll create:</p>
<ul>
<li><p>A document processing pipeline that converts any PDF into queryable knowledge</p></li>
<li><p>A vector search system that finds exactly the right information</p></li>
<li><p>A chatbot interface that answers technical questions with pinpoint accuracy</p></li>
<li><p>A deployable solution you can integrate with your existing tools</p></li>
</ul>
<p>The best part? Most of it is configured through a simple user interface (UI) instead of custom code.</p>
<h2 id="What-Youll-Need" class="common-anchor-header">What You’ll Need<button data-href="#What-Youll-Need" class="anchor-icon" translate="no">
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
<li><p>Basic Docker knowledge (just <code translate="no">docker-compose up -d</code> level)</p></li>
<li><p>An OpenAI API key</p></li>
<li><p>A PDF document to experiment with (we’ll use a research paper)</p></li>
</ul>
<p>Ready to build something actually useful in record time? Let’s get started!</p>
<h2 id="Building-Your-RAG-Application-with-Milvus-and-Dify" class="common-anchor-header">Building Your RAG Application with Milvus and Dify<button data-href="#Building-Your-RAG-Application-with-Milvus-and-Dify" class="anchor-icon" translate="no">
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
    </button></h2><p>In this section, we will build a simple RAG app with Dify, where we can ask questions about the information contained in a research paper. For the research paper, you can use any paper you want; however, in this case, we will use the famous paper that introduced us to the Transformer architecture, &quot;<a href="https://arxiv.org/abs/1706.03762">Attention is All You Need</a>.&quot;</p>
<p>We will use Milvus as our vector storage, where we will store all the necessary contexts. For the embedding model and the LLM, we’ll use models from OpenAI. Therefore, we need to set up an OpenAI API key first. You can learn more about setting it up<a href="https://platform.openai.com/docs/quickstart"> here</a>.</p>
<h3 id="Step-1-Starting-Dify-and-Milvus-Containers" class="common-anchor-header">Step 1: Starting Dify and Milvus Containers</h3><p>In this example, we’ll self-host Dify with Docker Compose. Therefore, before we begin, ensure that Docker is installed on your local machine. If you haven’t, install Docker by referring to<a href="https://docs.docker.com/desktop/"> its installation page</a>.</p>
<p>Once we have Docker installed, we need to clone the Dify source code into our local machine with the following command:</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> &lt;&lt;<span class="hljs-string">https://github.com/langgenius/dify.git&gt;&gt;
</span><button class="copy-code-btn"></button></code></pre>
<p>Next, go to the <code translate="no">docker</code> directory inside of the source code that you’ve just cloned. There, you need to copy the <code translate="no">.env</code> file with the following command:</p>
<pre><code translate="no"><span class="hljs-built_in">cd</span> dify/docker
<span class="hljs-built_in">cp</span> .env.example .<span class="hljs-built_in">env</span>
<button class="copy-code-btn"></button></code></pre>
<p>In a nutshell, <code translate="no">.env</code> file contains the configurations needed to set your Dify app up and running, such as the selection of vector databases, the credentials necessary to access your vector database, the address of your Dify app, etc.</p>
<p>Since we’re going to use Milvus as our vector database, then we need to change the value of <code translate="no">VECTOR_STORE</code> variable inside <code translate="no">.env</code> file to <code translate="no">milvus</code>. Also, we need to change the <code translate="no">MILVUS_URI</code> variable to <code translate="no">http://host.docker.internal:19530</code> to ensure that there’s no communication issue between Docker containers later on after deployment.</p>
<pre><code translate="no"><span class="hljs-variable constant_">VECTOR_STORE</span>=milvus
<span class="hljs-variable constant_">MILVUS_URI</span>=<span class="hljs-attr">http</span>:<span class="hljs-comment">//host.docker.internal:19530</span>
<button class="copy-code-btn"></button></code></pre>
<p>Now we are ready to start the Docker containers. To do so, all we need to do is to run the <code translate="no">docker compose up -d</code> command. After it finishes, you’ll see similar output in your terminal as below:</p>
<pre><code translate="no">docker compose up -d
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/docker_compose_179216f113.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>We can check the status of all containers and see if they’re up and running healthily with <code translate="no">docker compose ps</code> command. If they’re all healthy, you’ll see an output as below:</p>
<pre><code translate="no">docker compose ps
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/docker_compose_2_1a084ba137.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>And finally, if we head up to<a href="http://localhost/install"> </a>http://localhost/install, you’ll see a Dify landing page where we can sign up and start building our RAG application in no time.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_login_d2bf4d4468.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Once you’ve signed up, then you can just log into Dify with your credentials.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/difi_login_2_5a8ea9c2d6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Setting-Up-OpenAI-API-Key" class="common-anchor-header">Step 2: Setting Up OpenAI API Key</h3><p>The first thing we need to do after signing up for Dify is to set up our API keys that we’ll use to call the embedding model as well as the LLM. Since we’re going to use models from OpenAI, we need to insert our OpenAI API key into our profile. To do so, go to “Settings” by hovering your cursor over your profile on the top right of the UI, as you can see in the screenshot below:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_settings_8ff08fab97.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Next, go to “Model Provider,” hover your cursor on OpenAI, and then click “Setup.” You’ll then see a pop-up screen where you’re prompted to enter your OpenAI API key. Once we’re done, we’re ready to use models from OpenAI as our embedding model and LLM.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_model_providers_491b313b12.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Inserting-Documents-into-Knowledge-Base" class="common-anchor-header">Step 3: Inserting Documents into Knowledge Base</h3><p>Now let’s store the knowledge base for our RAG app. The knowledge base consists of a collection of internal documents or texts that can be used as relevant contexts to help the LLM generates more accurate responses.</p>
<p>In our use case, our knowledge base is essentially the “Attention is All You Need” paper. However, we can’t store the paper as it is due to multiple reasons. First, the paper is too long, and giving an overly long context to the LLM wouldn’t help as the context is too broad. Second, we can’t perform similarity searches to fetch the most relevant context if our input is raw text.</p>
<p>Therefore, there are at least two steps we need to take before storing our paper into the knowledge base. First, we need to divide the paper into text chunks, and then transform each chunk into an embedding via an embedding model. Finally, we can store these embeddings into Milvus as our vector database.</p>
<p>Dify makes it easy for us to split the texts in the paper into chunks and turn them into embeddings. All we need to do is upload the PDF file of the paper, set the chunk length, and choose the embedding model via a slider. To do all these steps, go to “Knowledge” and then click &quot;Create Knowledge&quot;. Next, you’ll be prompted to upload the PDF file from your local computer. Therefore, it’s better if you download the paper from ArXiv and save it on your computer first.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_knowledge_cc21a5c430.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Once we’ve uploaded the file, we can set the chunk length, indexing method, the embedding model we want to use, and retrieval settings.</p>
<p>In the “Chunk Setting” area, you can choose any number as the maximum chunk length (in our use case, we’ll set it to 100). Next, for “Index Method,” we need to choose the “High Quality” option as it’ll enable us to perform similarity searches to find relevant contexts. For “Embedding Model,” you can choose any embedding model from OpenAI you want, but in this example, we’re going to use the text-embedding-3-small model. Lastly, for “Retrieval Setting,” we need to choose “Vector Search” as we want to perform similarity searches to find the most relevant contexts.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Dify_save_837dbc0cf6.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Now if you click on “Save &amp; Process” and everything goes well, you’ll see a green tick appear as shown in the following screenshot:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_knowledge_created_d46b96385f.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Creating-the-RAG-App" class="common-anchor-header">Step 4: Creating the RAG App</h3><p>Up until this point, we have successfully created a knowledge base and stored it inside our Milvus database. Now we’re ready to create the RAG app.</p>
<p>Creating the RAG app with Dify is very straightforward. We need to go to “Studio” instead of “Knowledge” like before, and then click on “Create from Blank.” Next, choose “Chatbot” as the app type and give your App a name inside the provided field. Once you’re done, click “Create.” Now you’ll see the following page:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_create_f5691f193d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Under the “Instruction” field, we can write a system prompt such as “Answer the query from the user concisely.” Next, as “Context,” we need to click on the “Add” symbol, and then add the knowledge base that we’ve just created. This way, our RAG app will fetch possible contexts from this knowledge base to answer the user’s query.</p>
<p>Now that we’ve added the knowledge base to our RAG app, the last thing we need to do is choose the LLM from OpenAI. To do so, you can click on the model list available in the upper right corner, as you can see in the screenshot below:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dify_llm_c3b79ded37.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>And now we’re ready to publish our RAG application! In the upper right-hand corner, click “Publish,” and there you can find many ways to publish our RAG app: we can simply run it in a browser, embed it on our website, or access the app via API. In this example, we’ll just run our app in a browser, so we can click on &quot;Run App&quot;.</p>
<p>And that’s it! Now you can ask the LLM anything related to the “Attention is All You Need” paper or any documents included in our knowledge base.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag_attention_is_all_you_need_8582d3a69a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h2 id="Conclusion" class="common-anchor-header">Conclusion<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>You’ve now built a working RAG application using Dify and Milvus, with minimal code and configuration. This approach makes the complex RAG architecture accessible to developers without requiring deep expertise in vector databases or LLM integration.
Key takeaways:</p>
<ol>
<li><strong>Low setup overhead</strong>: Using Docker Compose simplifies deployment</li>
<li><strong>No-code/low-code orchestration</strong>: Dify handles most of the RAG pipeline</li>
<li><strong>Production-ready vector database</strong>: Milvus provides efficient embedding storage and retrieval</li>
<li><strong>Extensible architecture</strong>: Easy to add documents or adjust parameters
For production deployment, consider:</li>
</ol>
<ul>
<li>Setting up authentication for your application</li>
<li>Configuring proper scaling for Milvus (especially for larger document collections)</li>
<li>Implementing monitoring for your Dify and Milvus instances</li>
<li>Fine-tuning retrieval parameters for optimal performance
The combination of Dify and Milvus enables the rapid development of RAG applications that can effectively leverage your organization’s internal knowledge with modern large language models (LLMs).
Happy building!</li>
</ul>
<h2 id="Additional-Resources" class="common-anchor-header">Additional Resources<button data-href="#Additional-Resources" class="anchor-icon" translate="no">
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
<li><a href="https://docs.dify.ai/">Dify Documentation</a></li>
<li><a href="https://milvus.io/docs">Milvus Documentation</a></li>
<li><a href="https://zilliz.com/learn/vector-database">Vector Database Fundamentals</a></li>
<li><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG Implementation Patterns</a></li>
</ul>
