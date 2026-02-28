---
id: drag-drop-and-deploy-how-to-build-rag-workflows-with-langflow-and-milvus.md
title: |
  Drag, Drop, and Deploy: How to Build RAG Workflows with Langflow and Milvus
author: Min Yin
date: 2025-10-30T00:00:00.000Z
cover: assets.zilliz.com/drag_drop_deploy_859c4369e8.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database'
meta_keywords: 'Langflow, Milvus, RAG, AI workflow'
meta_title: 'Drag, Drop, and Deploy RAG Workflows with Langflow & Milvus'
desc: >-
  Learn how to build visual RAG workflows using Langflow and Milvus. Drag, drop,
  and deploy context-aware AI apps in minutes—no coding required.
origin: >-
  https://milvus.io/blog/drag-drop-and-deploy-how-to-build-rag-workflows-with-langflow-and-milvus.md
---
<p>Building an AI workflow often feels harder than it should. Between writing glue code, debugging API calls, and managing data pipelines, the process can eat up hours before you even see results. <a href="https://www.langflow.org/"><strong>Langflow</strong></a> and <a href="https://milvus.io/"><strong>Milvus</strong></a> simplify this dramatically — giving you a code-light way to design, test, and deploy retrieval-augmented generation (RAG) workflows in minutes, not days.</p>
<p><strong>Langflow</strong> offers a clean, drag-and-drop interface that feels more like sketching ideas on a whiteboard than coding. You can visually connect language models, data sources, and external tools to define your workflow logic — all without touching a line of boilerplate code.</p>
<p>Paired with <strong>Milvus</strong>, the open-source vector database that gives LLMs long-term memory and contextual understanding, the two form a complete environment for production-grade RAG. Milvus efficiently stores and retrieves embeddings from your enterprise or domain-specific data, allowing LLMs to generate answers that are grounded, accurate, and context-aware.</p>
<p>In this guide, we’ll walk through how to combine Langflow and Milvus to build an advanced RAG workflow — all through a few drags, drops, and clicks.</p>
<h2 id="What-is-Langflow" class="common-anchor-header">What is Langflow?<button data-href="#What-is-Langflow" class="anchor-icon" translate="no">
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
    </button></h2><p>Before going through the RAG demo, let’s learn what Langflow is and what it can do.</p>
<p>Langflow is an open-source, Python-based framework that makes it easier to build and experiment with AI applications. It supports key AI capabilities such as agents and the Model Context Protocol (MCP), giving developers and non-developers alike a flexible foundation for creating intelligent systems.</p>
<p>At its core, Langflow provides a visual editor. You can drag, drop, and connect different resources to design complete applications that combine models, tools, and data sources. When you export a workflow, Langflow automatically generates a file named <code translate="no">FLOW_NAME.json</code> on your local machine. This file records all the nodes, edges, and metadata that describe your flow, allowing you to version-control, share, and reproduce projects easily across teams.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Langflow_s_visual_editor_cd553ad4ad.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Behind the scenes, a Python-based runtime engine executes the flow. It orchestrates LLMs, tools, retrieval modules, and routing logic — managing data flow, state, and error handling to ensure smooth execution from start to finish.</p>
<p>Langflow also includes a rich component library with prebuilt adapters for popular LLMs and vector databases — including <a href="https://milvus.io/">Milvus</a>. You can extend this further by creating custom Python components for specialized use cases. For testing and optimization, Langflow offers step-by-step execution, a Playground for rapid testing, and integrations with LangSmith and Langfuse for monitoring, debugging, and replaying workflows end-to-end.</p>
<h2 id="Hands-on-Demo-How-to-Build-a-RAG-Workflow-with-Langflow-and-Milvus" class="common-anchor-header">Hands-on Demo: How to Build a RAG Workflow with Langflow and Milvus<button data-href="#Hands-on-Demo-How-to-Build-a-RAG-Workflow-with-Langflow-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Building on Langflow’s architecture, Milvus can serve as the vector database that manages embeddings and retrieves private enterprise data or domain-specific knowledge.</p>
<p>In this demo, we’ll use Langflow’s Vector Store RAG template to demonstrate how to integrate Milvus and build a vector index from local data, enabling efficient, context-enhanced question answering.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_processing_flow_289a9376c9.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Prerequisites" class="common-anchor-header">Prerequisites：</h3><p>1.Python 3.11 (or Conda)</p>
<p>2.uv</p>
<p>3.Docker &amp; Docker Compose</p>
<p>4.OpenAI key</p>
<h3 id="Step-1-Deploy-Milvus-Vector-Database" class="common-anchor-header">Step 1. Deploy Milvus Vector Database</h3><p>Download the deployment files.</p>
<pre><code translate="no">wget &lt;https://github.com/Milvus-io/Milvus/releases/download/v2.5.12/Milvus-standalone-docker-compose.yml&gt; -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p>Start the Milvus service.</p>
<pre><code translate="no">docker-compose up -d
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no">docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/start_milvus_service_860353ed55.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Create-a-Python-Virtual-Environment" class="common-anchor-header">Step 2. Create a Python Virtual Environment</h3><pre><code translate="no">conda create -n langflow
<span class="hljs-comment"># activate langflow and launch it</span>
conda activate langflow
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-3-Install-the-Latest-Packages" class="common-anchor-header">Step 3. Install the Latest Packages</h3><pre><code translate="no">pip install langflow -U
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-4-Launch-Langflow" class="common-anchor-header">Step 4. Launch Langflow</h3><pre><code translate="no">uv run langflow run
<button class="copy-code-btn"></button></code></pre>
<p>Visit Langflow.</p>
<pre><code translate="no">&lt;<span class="hljs-attr">http</span>:<span class="hljs-comment">//127.0.0.1:7860&gt;</span>
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-5-Configure-the-RAG-Template" class="common-anchor-header">Step 5. Configure the RAG Template</h3><p>Select the Vector Store RAG template in Langflow.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag1_fcb0d1c3c5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/rag2_f750e10a41.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Choose Milvus as your default vector database.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/vdb_milvus_925c6ce846.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>In the left panel, search for “Milvus” and add it to your flow.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/add_milvus1_862d14d0d0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/add_milvus2_4e3d6aacda.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Configure Milvus connection details. Leave other options as the default for now.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/connect1_a27d3e4f43.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/connect2_d8421c1525.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Add your OpenAI API key to the relevant node.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openai_key_7a6596868c.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/openai_key2_4753bfb4d0.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-6-Prepare-Test-Data" class="common-anchor-header">Step 6. Prepare Test Data</h3><p>Note: Use the official FAQ for Milvus 2.6 as the test data.</p>
<pre><code translate="no">https://github.com/milvus-io/milvus-docs/blob/v2.6.x/site/en/faq/product_faq.md
<button class="copy-code-btn"></button></code></pre>
<h3 id="Step-7-Phase-One-Testing" class="common-anchor-header">Step 7. Phase One Testing</h3><p>Upload your dataset and ingest it into Milvus.
Note: Langflow then converts your text into vector representations. You must upload at least two datasets, or the embedding process will fail. This is a known bug in Langflow’s current node implementation.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest_7b804d870a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest2_fc7f1e4d9a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Check the status of your nodes.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/test_48e02d48ca.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-8-Phase-Two-Testing" class="common-anchor-header">Step 8. Phase Two Testing</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/ingest_7b804d870a.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-9-Run-the-Full-RAG-Workflow" class="common-anchor-header">Step 9. Run the Full RAG Workflow</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/full_flow1_5b4f4962f5.webp" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/full_flow2_535c722a3d.webp" alt="" class="doc-image" id="" />
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
    </button></h2><p>Building AI workflows doesn’t have to be complicated. Langflow + Milvus makes it fast, visual, and code-light — a simple way to enhance RAG without heavy engineering effort.</p>
<p>Langflow’s drag-and-drop interface makes it a suitable choice for teaching, workshops, or live demos, where you need to demonstrate how AI systems work in a clear and interactive manner. For teams seeking to integrate intuitive workflow design with enterprise-grade vector retrieval, combining Langflow’s simplicity with Milvus’s high-performance search delivers both flexibility and power.</p>
<p>👉 Start building smarter RAG workflows with <a href="https://milvus.io/">Milvus</a> today.</p>
<p>Have questions or want a deep dive on any feature? Join our<a href="https://discord.com/invite/8uyFbECzPX"> Discord channel</a> or file issues on<a href="https://github.com/milvus-io/milvus"> GitHub</a>. You can also book a 20-minute one-on-one session to get insights, guidance, and answers to your questions through<a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md"> Milvus Office Hours</a>.</p>
