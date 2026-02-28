---
id: How-we-used-semantic-search-to-make-our-search-10-x-smarter.md
title: Keyword-based search
author: Rahul Yadav
date: 2021-02-05T06:27:15.076Z
desc: >-
  Tokopedia used Milvus to build a 10x smarter search system that has
  dramatically enhanced the user experience.
cover: >-
  assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_1_a7bac91379.jpeg
tag: Scenarios
canonicalUrl: >-
  https://zilliz.com/blog/How-we-used-semantic-search-to-make-our-search-10-x-smarter
---
<custom-h1>How we used semantic search to make our search 10x smarter</custom-h1><p>At Tokopedia, we understand that the value in our product corpus is only unlocked when our buyers can find products that are relevant to them, so we strive to improve the relevance of search results.</p>
<p>To further that effort, we are introducing <strong>similarity search</strong> on Tokopedia. If you go to the search result page on mobile devices, you will find a “…” button that exposes a menu that gives you the option to search for products similar to the product.</p>
<h2 id="Keyword-based-search" class="common-anchor-header">Keyword-based search<button data-href="#Keyword-based-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Tokopedia Search uses <strong>Elasticsearch</strong> for the search and ranking of products. For each search request, we first query Elasticsearch, which ranks products according to the search query. ElasticSearch stores each word as a sequence of numbers representing <a href="https://en.wikipedia.org/wiki/ASCII">ASCII</a> (or UTF) codes for each letter. It builds an <a href="https://en.wikipedia.org/wiki/Inverted_index">inverted-index</a> to quickly find out, which documents contain words from the user query, and then finds the best match among them using various scoring algorithms. These scoring algorithms pay little attention to what the words mean, but rather to how frequently they occur in the document, how close they are to each other, etc. ASCII representation obviously contains enough information to convey the semantics (after all we, humans, can understand it). Unfortunately, there’s no good algorithm for the computer to compare ASCII-encoded words by their meaning.</p>
<h2 id="Vector-representation" class="common-anchor-header">Vector representation<button data-href="#Vector-representation" class="anchor-icon" translate="no">
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
    </button></h2><p>One solution to this would be to come up with an alternative representation, which tells us not only about the letters contained in the word but also something about its meaning. For example, we could encode <em>which other words our word is frequently used together with</em> (represent by the probable context). We’d then assume that similar contexts represent similar things, and try to compare them using mathematical methods. We could even find a way to encode whole sentences by their meaning.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_2_776af567a8.png" alt="Blog_How we used semantic search to make our search 10x smarter_2.png" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_2.png" />
    <span>Blog_How we used semantic search to make our search 10x smarter_2.png</span>
  </span>
</p>
<h2 id="Select-an-embedding-similarity-search-engine" class="common-anchor-header">Select an embedding similarity search engine<button data-href="#Select-an-embedding-similarity-search-engine" class="anchor-icon" translate="no">
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
    </button></h2><p>Now that we have feature vectors, the remaining issue is how to retrieve from the large volume of vectors the ones that are similar to the target vector. When it comes to the embeddings search engine, we tried POC on several engines available on Github some of them are FAISS, Vearch, Milvus.</p>
<p>We prefer Milvus to other engines based on load test results. On the one hand, we have used FAISS before on other teams and hence would like to try something new. Compared to Milvus, FAISS is more of an underlying library, therefore not quite convenient to use. As we learned more about Milvus, we finally decided to adopt Milvus for its two main features:</p>
<ul>
<li><p>Milvus is very easy to use. All you need to do is to pull its Docker image and update the parameters based on your own scenario.</p></li>
<li><p>It supports more indexes and has detailed supporting documentation.</p></li>
</ul>
<p>In a nutshell, Milvus is very friendly to users and the documentation is quite detailed. If you come across any problem, you can usually find solutions in the documentation; otherwise, you can always get support from the Milvus community.</p>
<h2 id="Milvus-cluster-service" class="common-anchor-header">Milvus cluster service<button data-href="#Milvus-cluster-service" class="anchor-icon" translate="no">
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
    </button></h2><p>After deciding to use Milvus as the feature vector search engine, we decided to use Milvus for one of our Ads service use-case where we wanted to match <a href="https://www.tradegecko.com/blog/wholesale-management/what-is-fill-rate-and-why-does-it-matter-for-wholesalers">low fill rate</a> keywords with high fill rate keywords. We configured a standalone node in a development (DEV) environment and started serving, it had been running well for a few days, and giving us improved CTR/CVR metrics. If a standalone node crashed in production, the entire service would become unavailable. Thus, we need to deploy a highly available search service.</p>
<p>Milvus provides both Mishards, a cluster sharding middleware, and Milvus-Helm for configuration. In Tokopedia we use Ansible playbooks for infrastructure setup so we created a playbook for infra orchestration. The diagram below from Milvus’ documentation shows how Mishards works:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_3_4fa0c8a1a1.png" alt="Blog_How we used semantic search to make our search 10x smarter_3.png" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_3.png" />
    <span>Blog_How we used semantic search to make our search 10x smarter_3.png</span>
  </span>
</p>
<p>Mishards cascade a request from upstream down to its sub-modules splitting the upstream request, and then collects and returns the results of the sub-services to upstream. The overall architecture of the Mishards-based cluster solution is shown below:

  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_4_724618be4e.jpeg" alt="Blog_How we used semantic search to make our search 10x smarter_4.jpeg" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_4.jpeg" />
    <span>Blog_How we used semantic search to make our search 10x smarter_4.jpeg</span>
  </span>
</p>
<p>The official documentation provides a clear introduction of Mishards. You can refer to <a href="https://milvus.io/cn/docs/v0.10.2/mishards.md">Mishards</a> if you are interested.</p>
<p>In our keyword-to-keyword service, we deployed one writable node, two read-only nodes, and one Mishards middleware instance in GCP, using Milvus ansible. It has been stable so far. A huge component of what makes it possible to efficiently query the million-, billion-, or even trillion-vector datasets that similarity search engines rely on is <a href="https://milvus.io/docs/v0.10.5/index.md">indexing</a>, a process of organizing data that drastically accelerates big data search.</p>
<h2 id="How-does-vector-indexing-accelerate-similarity-search" class="common-anchor-header">How does vector indexing accelerate similarity search?<button data-href="#How-does-vector-indexing-accelerate-similarity-search" class="anchor-icon" translate="no">
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
    </button></h2><p>Similarity search engines work by comparing input to a database to find objects that are most similar to the input. Indexing is the process of efficiently organizing data, and it plays a major role in making similarity search useful by dramatically accelerating time-consuming queries on large datasets. After a massive vector dataset is indexed, queries can be routed to clusters, or subsets of data, that are most likely to contain vectors similar to an input query. In practice, this means a certain degree of accuracy is sacrificed to speed up queries on really big vector data.</p>
<p>An analogy can be drawn to a dictionary, where words are sorted alphabetically. When looking up a word, it is possible to quickly navigate to a section that only contains words with the same initial — drastically accelerating the search for the input word’s definition.</p>
<h2 id="What-next-you-ask" class="common-anchor-header">What next, you ask?<button data-href="#What-next-you-ask" class="anchor-icon" translate="no">
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
    </button></h2><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Blog_How_we_used_semantic_search_to_make_our_search_10x_smarter_5_035480c8af.jpeg" alt="Blog_How we used semantic search to make our search 10x smarter_5.jpeg" class="doc-image" id="blog_how-we-used-semantic-search-to-make-our-search-10x-smarter_5.jpeg" />
    <span>Blog_How we used semantic search to make our search 10x smarter_5.jpeg</span>
  </span>
</p>
<p>As shown above, there is no solution that fits all, we always want to improve the model’s performance used for getting the embeddings.</p>
<p>Also, from a technical point of view, we want to run multiple learning models at the same time and compare the results from the various experiments. Watch this space for more information on our experiments like image search, video search.</p>
<p><br/></p>
<h2 id="References" class="common-anchor-header">References:<button data-href="#References" class="anchor-icon" translate="no">
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
<li>Mishards Docs：https://milvus.io/docs/v0.10.2/mishards.md</li>
<li>Mishards: https://github.com/milvus-io/milvus/tree/master/shards</li>
<li>Milvus-Helm: https://github.com/milvus-io/milvus-helm/tree/master/charts/milvus</li>
</ul>
<p><br/></p>
<p><em>This blog article is reposted from: https://medium.com/tokopedia-engineering/how-we-used-semantic-search-to-make-our-search-10x-smarter-bd9c7f601821</em></p>
<p>Read other <a href="https://zilliz.com/user-stories">user stories</a> to learn more about making things with Milvus.</p>
