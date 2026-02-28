---
id: multimodal-semantic-search-with-images-and-text.md
title: Multimodal Semantic Search with Images and Text
author: Stefan Webb
date: 2025-02-3
desc: >-
  Learn how to build a semantic search app using multimodal AI that understands
  text-image relationships, beyond basic keyword matching.
cover: >-
  assets.zilliz.com/Multimodal_Semantic_Search_with_Images_and_Text_1_3da9b83015.png
tag: Engineering
tags: 'Milvus, Vector Database, Open Source, Semantic Search, Multimodal AI'
recommend: true
canonicalUrl: 'https://milvus.io/blog/multimodal-semantic-search-with-images-and-text.md'
---
<iframe width="100%" height="315" src="https://www.youtube.com/embed/bxE0_QYX_sU?si=PkOHFcZto-rda1Fv" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
<p>As humans, we interpret the world through our senses. We hear sounds, we see images, video, and text, often layered on top of each other. We understand the world through these multiple modalities and the relationship between them. For artificial intelligence to truly match or exceed human capabilities, it must develop this same ability to understand the world through multiple lenses simultaneously.</p>
<p>In this post and accompanying video (above) and <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/multimodal_retrieval_amazon_reviews.ipynb">notebook</a>, we’ll showcase recent breakthroughs in models that can process both text and images together. We’ll demonstrate this by building a semantic search application that goes beyond simple keyword matching - it understands the relationship between what users are asking for and the visual content they’re searching through.</p>
<p>What makes this project particularly exciting is that it’s built entirely with open-source tools: the Milvus vector database, HuggingFace’s machine learning libraries, and a dataset of Amazon customer reviews. It’s remarkable to think that just a decade ago, building something like this would have required significant proprietary resources. Today, these powerful components are freely available and can be combined in innovative ways by anyone with the curiosity to experiment.</p>
<custom-h1>Overview</custom-h1><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/overview_97a124bc9a.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Our multimodal search application is of the type <em>retrieve-and-rerank.</em> If you are familiar with <em>retrieval-augmented-generation</em> (RAG) it is very similar, only that the final output is a list of images that were reranked by a large language-vision model (LLVM). The user’s search query contains both text and image, and the target is a set of images indexed in a vector database. The architecture has three steps - <em>indexing</em>, <em>retrieval</em>, and <em>reranking</em> (akin to “generation”) - which we summarize in turn.</p>
<h2 id="Indexing" class="common-anchor-header">Indexing<button data-href="#Indexing" class="anchor-icon" translate="no">
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
    </button></h2><p>Our search application must have something to search. In our case, we use a small subset of the “Amazon Reviews 2023” dataset, which contains both text and images from Amazon customer reviews across all types of products. You can imagine a semantic search like that that we are building as being a useful addition to an ecommerce website. We use 900 images and discard the text, although observe that this notebook can scale to production-size with the right database and inference deployments.</p>
<p>The first piece of “magic” in our pipeline is the choice of embedding model. We use a recently developed multimodal model called <a href="https://huggingface.co/BAAI/bge-visualized">Visualized BGE</a> that is able to embed text and images jointly, or either separately, into the same space with a single model where points that are close are semantically similar. Other such models have been developed recently, for instance <a href="https://github.com/google-deepmind/magiclens">MagicLens</a>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/indexing_1937241be5.jpg" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>The figure above illustrates: the embedding for [an image of a lion side-on] plus the text “front view of this”, is close to an embedding for [an image of a lion front-on] without text. The same model is used for both text plus image inputs and image-only inputs (as well as text-only inputs). <em>In this way, the model is able to understand the user’s intent in how the query text relates to the query image.</em></p>
<p>We embed our 900 product images without corresponding text and store the embeddings in a vector database using <a href="https://milvus.io/docs">Milvus</a>.</p>
<h2 id="Retrieval" class="common-anchor-header">Retrieval<button data-href="#Retrieval" class="anchor-icon" translate="no">
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
    </button></h2><p>Now that our database is built, we can serve a user query. Imagine a user comes along with the query: “a phone case with this” plus [an image of a Leopard]. That is, they are searching for phone cases with Leopard skin prints.</p>
<p>Note that the text of the user’s query said “this” rather than “a Leopard’s skin”. Our embedding model must be able to connect “this” to what it refers to, which is an impressive feat given that the previous iteration of models were not able to handle such open-ended instructions. The <a href="https://arxiv.org/abs/2403.19651">MagicLens paper</a> gives further examples.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Retrieval_ad64f48e49.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>We embed the query text and image jointly and perform a similarity search of our vector database, returning the top nine hits. The results are shown in the figure above, along with the query image of the leopard. It appears that the top hit is not the one that is most relevant to the query. The seventh result appears to be most relevant - it is a phone cover with a leopard skin print.</p>
<h2 id="Generation" class="common-anchor-header">Generation<button data-href="#Generation" class="anchor-icon" translate="no">
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
    </button></h2><p>It appears our search has failed in that the top result is not the most relevant. However, we can fix this with a reranking step. You may be familiar with reranking of retrieved items as being an important step in many RAG pipelines. We use <a href="https://huggingface.co/microsoft/Phi-3-vision-128k-instruct">Phi-3 Vision</a> as the re-ranker model.</p>
<p>We first ask a LLVM to generate a caption of the query image. The LLVM outputs:</p>
<p><em>“The image shows a close-up of a leopard’s face with a focus on its spotted fur and green eyes.”</em></p>
<p>We then feed this caption, a single image with the nine results and query image, and construct a text prompt asking the model to re-rank the results, giving the answer as a list and providing a reason for the choice of the top match.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Generation_b016a6c26a.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>The output is visualized in the figure above - the most relevant item is now the top match - and the reason given is:</p>
<p><em>“The most suitable item is the one with the leopard theme, which matches the user’s query instruction for a phone case with a similar theme.”</em></p>
<p>Our LLVM re-ranker was able to perform understanding across images and text, and improve the relevance of the search results. <em>One interesting artifact is that the re-ranker only gave eight results and has dropped one, which highlights the need for guardrails and structured output.</em></p>
<h2 id="Summary" class="common-anchor-header">Summary<button data-href="#Summary" class="anchor-icon" translate="no">
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
    </button></h2><p>In this post and the accompanying <a href="https://www.youtube.com/watch?v=bxE0_QYX_sU">video</a> and <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/multimodal_retrieval_amazon_reviews.ipynb">notebook</a>, we have constructed an application for multimodal semantic search across text and images. The embedding model was able to embed text and images jointly or separately into the same space, and the foundation model was able to input text and image while generating text in response. <em>Importantly, the embedding model was able to relate the user’s intent of an open-ended instruction to the query image and in that way specify how the user wanted the results to relate to the input image.</em></p>
<p>This is just a taste of what is to come in the near future. We will see many applications of multimodal search, multimodal understanding and reasoning, and so on across diverse modalities: image, video, audio, molecules, social networks, tabular data, time-series, the potential is boundless.</p>
<p>And at the core of these systems is a vector database holding the system’s external “memory”. Milvus is an excellent choice for this purpose. It is open-source, fully featured (see <a href="https://milvus.io/blog/get-started-with-hybrid-semantic-full-text-search-with-milvus-2-5.md">this article on full-text search in Milvus 2.5</a>) and scales efficiently to the billions of vectors with web-scale traffic and sub-100ms latency. Find out more at the <a href="https://milvus.io/docs">Milvus docs</a>, join our <a href="https://milvus.io/discord">Discord</a> community, and hope to see you at our next <a href="https://lu.ma/unstructured-data-meetup">Unstructured Data meetup</a>. Until then!</p>
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
<li><p>Notebook: <a href="https://github.com/milvus-io/bootcamp/blob/master/bootcamp/tutorials/quickstart/multimodal_retrieval_amazon_reviews.ipynb">“Multimodal Search with Amazon Reviews and LLVM Reranking</a>”</p></li>
<li><p><a href="https://www.youtube.com/watch?v=bxE0_QYX_sU">Youtube AWS Developers video</a></p></li>
<li><p><a href="https://milvus.io/docs">Milvus documentation</a></p></li>
<li><p><a href="https://lu.ma/unstructured-data-meetup">Unstructured Data meetup</a></p></li>
<li><p>Embedding model: <a href="https://huggingface.co/BAAI/bge-visualized">Visualized BGE model card</a></p></li>
<li><p>Alt. embedding model: <a href="https://github.com/google-deepmind/magiclens">MagicLens model repo</a></p></li>
<li><p>LLVM: <a href="https://huggingface.co/microsoft/Phi-3-vision-128k-instruct">Phi-3 Vision model card</a></p></li>
<li><p>Paper: “<a href="https://arxiv.org/abs/2403.19651">MagicLens: Self-Supervised Image Retrieval with Open-Ended Instructions</a>”</p></li>
<li><p>Dataset: <a href="https://amazon-reviews-2023.github.io/">Amazon Reviews 2023</a></p></li>
</ul>
