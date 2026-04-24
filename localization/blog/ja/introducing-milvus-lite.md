---
id: introducing-milvus-lite.md
title: 'Introducing Milvus Lite: Start Building a GenAI Application in Seconds'
author: Jiang Chen
date: 2024-05-30T00:00:00.000Z
cover: assets.zilliz.com/introducing_Milvus_Lite_76ed4baf75.jpeg
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  GenAI developers, Retrieval Augmented Generation, RAG
recommend: true
canonicalUrl: 'https://milvus.io/blog/introducing-milvus-lite.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_72e444c8dc.JPG" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>We are excited to introduce <a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a>, a lightweight vector database that runs locally within your Python application. Based on the popular open-source <a href="https://milvus.io/intro">Milvus</a> vector database, Milvus Lite reuses the core components for vector indexing and query parsing while removing elements designed for high scalability in distributed systems. This design makes a compact and efficient solution ideal for environments with limited computing resources, such as laptops, Jupyter Notebooks, and mobile or edge devices.</p>
<p>Milvus Lite integrates with various AI development stacks like LangChain and LlamaIndex, enabling its use as a vector store in Retrieval Augmented Generation (RAG) pipelines without the need for server setup. Simply run <code translate="no">pip install pymilvus</code> (version 2.4.3 or above) to incorporate it into your AI application as a Python library.</p>
<p>Milvus Lite shares the Milvus API, ensuring that your client-side code works for both small-scale local deployments and Milvus servers deployed on Docker or Kubernetes with billions of vectors.</p>
<iframe style="border-radius:12px" src="https://open.spotify.com/embed/episode/5bMcZgPgPVxSuoi1M2vn1p?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
<h2 id="Why-We-Built-Milvus-Lite" class="common-anchor-header">Why We Built Milvus Lite<button data-href="#Why-We-Built-Milvus-Lite" class="anchor-icon" translate="no">
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
    </button></h2><p>Many AI applications require vector similarity search for unstructured data, including text, images, voices, and videos, for applications such as chatbots and shopping assistants. Vector databases are crafted for storing and searching vector embeddings and are a crucial part of the AI development stack, particularly for generative AI use cases like <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">Retrieval Augmented Generation (RAG)</a>.</p>
<p>Despite the availability of numerous vector search solutions, an easy-to-start option that also works for large-scale production deployments was missing. As the creators of Milvus, we designed Milvus Lite to help AI developers build applications faster while ensuring a consistent experience across various deployment options, including Milvus on Kubernetes, Docker, and managed cloud services.</p>
<p>Milvus Lite is a crucial addition to our suite of offerings within the Milvus ecosystem. It provides developers with a versatile tool that supports every stage of their development journey. From prototyping to production environments and from edge computing to large-scale deployments, Milvus is now the only vector database that covers use cases of any size and all stages of development.</p>
<h2 id="How-Milvus-Lite-Works" class="common-anchor-header">How Milvus Lite Works<button data-href="#How-Milvus-Lite-Works" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Lite supports all the basic operations available in Milvus, such as creating collections and inserting, searching, and deleting vectors. It will soon support advanced features like hybrid search. Milvus Lite loads data into memory for efficient searches and persists it as an SQLite file.</p>
<p>Milvus Lite is included in the <a href="https://github.com/milvus-io/pymilvus">Python SDK of Milvus</a> and can be deployed with a simple <code translate="no">pip install pymilvus</code>. The following code snippet demonstrates how to set up a vector database with Milvus Lite by specifying a local file name and then creating a new collection. For those familiar with the Milvus API, the only difference is that the <code translate="no">uri</code> refers to a local file name instead of a network endpoint, e.g., <code translate="no">&quot;milvus_demo.db&quot;</code> instead of <code translate="no">&quot;http://localhost:19530&quot;</code> for a Milvus server. Everything else remains the same. Milvus Lite also supports storing raw text and other labels as metadata, using a dynamic or explicitly defined schema, as shown below.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> MilvusClient

client = MilvusClient(<span class="hljs-string">&quot;milvus_demo.db&quot;</span>)
<span class="hljs-comment"># This collection can take input with mandatory fields named &quot;id&quot;, &quot;vector&quot; and</span>
<span class="hljs-comment"># any other fields as &quot;dynamic schema&quot;. You can also define the schema explicitly.</span>
client.create_collection(
    collection_name=<span class="hljs-string">&quot;demo_collection&quot;</span>,
    dimension=<span class="hljs-number">384</span>  <span class="hljs-comment"># Dimension for vectors.</span>
)
<button class="copy-code-btn"></button></code></pre>
<p>For scalability, an AI application developed with Milvus Lite can easily transition to using Milvus deployed on Docker or Kubernetes by simply specifying the <code translate="no">uri</code> with the server endpoint.</p>
<h2 id="Integration-with-AI-Development-Stack" class="common-anchor-header">Integration with AI Development Stack<button data-href="#Integration-with-AI-Development-Stack" class="anchor-icon" translate="no">
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
    </button></h2><p>In addition to introducing Milvus Lite to make vector search easy to start with, Milvus also integrates with many frameworks and providers of the AI development stack, including <a href="https://python.langchain.com/v0.2/docs/integrations/vectorstores/milvus/">LangChain</a>, <a href="https://docs.llamaindex.ai/en/stable/examples/vector_stores/MilvusIndexDemo/">LlamaIndex</a>, <a href="https://haystack.deepset.ai/integrations/milvus-document-store">Haystack</a>, <a href="https://blog.voyageai.com/2024/05/30/semantic-search-with-milvus-lite-and-voyage-ai/">Voyage AI</a>, <a href="https://milvus.io/docs/integrate_with_ragas.md">Ragas</a>, <a href="https://jina.ai/news/implementing-a-chat-history-rag-with-jina-ai-and-milvus-lite/">Jina AI</a>, <a href="https://dspy-docs.vercel.app/docs/deep-dive/retrieval_models_clients/MilvusRM">DSPy</a>, <a href="https://www.bentoml.com/blog/building-a-rag-app-with-bentocloud-and-milvus-lite">BentoML</a>, <a href="https://chiajy.medium.com/70873c7576f1">WhyHow</a>, <a href="https://blog.relari.ai/case-study-using-synthetic-data-to-benchmark-rag-systems-be324904ace1">Relari AI</a>, <a href="https://docs.airbyte.com/integrations/destinations/milvus">Airbyte</a>, <a href="https://milvus.io/docs/integrate_with_hugging-face.md">HuggingFace</a> and <a href="https://memgpt.readme.io/docs/storage#milvus">MemGPT</a>. Thanks to their extensive tooling and services, these integrations simplify the development of AI applications with vector search capability.</p>
<p>And this is just the beginning—many more exciting integrations are coming soon! Stay tuned!</p>
<h2 id="More-Resources-and-Examples" class="common-anchor-header">More Resources and Examples<button data-href="#More-Resources-and-Examples" class="anchor-icon" translate="no">
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
    </button></h2><p>Explore <a href="https://milvus.io/docs/quickstart.md">Milvus quickstart documentation</a> for detailed guides and code examples on using Milvus Lite to build AI applications like Retrieval-Augmented Generation (<a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/build_RAG_with_milvus.ipynb">RAG</a>) and <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/image_search_with_milvus.ipynb">image search</a>.</p>
<p>Milvus Lite is an open-source project, and we welcome your contributions. Check out our <a href="https://github.com/milvus-io/milvus-lite/blob/main/CONTRIBUTING.md">Contributing Guide</a> to get started. You can also report bugs or request features by filing an issue on the <a href="https://github.com/milvus-io/milvus-lite">Milvus Lite GitHub</a> repository.</p>
