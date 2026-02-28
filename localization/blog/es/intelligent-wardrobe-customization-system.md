---
id: intelligent-wardrobe-customization-system.md
title: >-
  Building an Intelligent Wardrobe Customization System Powered by Milvus Vector
  Database
author: Yiyun Ni
date: 2022-07-08T00:00:00.000Z
desc: >-
  Using similarity search technology to unlock the potential of unstructured
  data, even like wardrobes and its components!
cover: assets.zilliz.com/Frame_1282_edc1fb7d99.png
tag: Engineering
tags: >-
  Data science, Database, Use Cases of Milvus, Artificial Intelligence, Vector
  Management
canonicalUrl: 'https://milvus.io/blog/intelligent-wardrobe-customization-system.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Frame_1282_edc1fb7d99.png" alt="cover image" class="doc-image" id="cover-image" />
    <span>cover image</span>
  </span>
</p>
<p>If you are looking for a wardrobe to fit perfectly into your bedroom or fitting room, I bet most people will think of the made-to-measure ones. However, not everyone’s budget can stretch that far. Then what about those ready-made ones? The problem with this type of wardrobe is that they are very likely to fall short of your expectation as they are not flexible enough to cater to your unique storage needs. Plus, when searching online, it is rather difficult to summarize the particular type of wardrobe you are looking for with keywords. Very likely, the keyword you type in the search box (eg. A wardrobe with a jewellery tray) might be very different from how it is defined in the search engine (eg. A wardrobe with <a href="https://www.ikea.com/us/en/p/komplement-pull-out-tray-with-insert-black-brown-s79249366/">pullout tray with insert</a>).</p>
<p>But thanks to emerging technologies, there is a solution! IKEA, the furniture retail conglomerate, provides a popular design tool <a href="https://www.ikea.com/us/en/rooms/bedroom/how-to/how-to-design-your-perfect-pax-wardrobe-pub8b76dda0">PAX wardrobe</a> that allows users to choose from a number of ready-made wardrobes and customize the color, size, and interior design of the wardrobes. Whether you need hanging space, multiple shelves or internal drawers, this intelligent wardrobe customization system can always cater to your needs.</p>
<p>To find or build your ideal wardrobe using this smart wardrobe design system, you need to:</p>
<ol>
<li>Specify the basic requirements - the shape (normal, L-shaped, or U-shaped), length and depth of the wardrobe.</li>
<li>Specify your storage need and the interior organization of the wardrobe (eg. Hanging space, a pullout pants rack, etc is needed).</li>
<li>Add or remove parts of the wardrobe like drawers or shelves.</li>
</ol>
<p>Then your design is completed. Simple and easy!</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Pax_system_ff4c3fa182.png" alt="pax system" class="doc-image" id="pax-system" />
    <span>pax system</span>
  </span>
</p>
<p>A very critical component that makes such a  wardrobe design system possible is the <a href="https://zilliz.com/learn/what-is-vector-database">vector database</a>. Therefore, this article aims to introduce the workflow and similarity search solutions used to build an intelligent wardrobe customization system powered by vector similarity search.</p>
<p>Jump to:</p>
<ul>
<li><a href="#System-overview">System overview</a></li>
<li><a href="#Data-flow">Data flow</a></li>
<li><a href="#System-demo">System demo</a></li>
</ul>
<h2 id="System-Overview" class="common-anchor-header">System Overview<button data-href="#System-Overview" class="anchor-icon" translate="no">
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
    </button></h2><p>In order to deliver such a smart wardrobe customization tool, we need to first define the business logic and understand item attributes and user journey. Wardrobes along with its components like drawers, trays, racks, are all unstructured data. Therefore, the second step is to leverage AI algorithms and rules, prior knowledge, item description, and more, to convert those unstructured data into a type of data that can be understood by computers - vectors!</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Customization_tool_overview_86d62e1730.png" alt="Customization tool overview" class="doc-image" id="customization-tool-overview" />
    <span>Customization tool overview</span>
  </span>
</p>
<p>With the generated vectors, we need powerful vector databases and search engines to process them.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/tool_architecutre_33fb646954.png" alt="tool architecture" class="doc-image" id="tool-architecture" />
    <span>tool architecture</span>
  </span>
</p>
<p>The customization tool leverages some of the most popular search engines and databases: Elasticsearch, <a href="https://milvus.io/">Milvus</a>, and PostgreSQL.</p>
<h3 id="Why-Milvus" class="common-anchor-header">Why Milvus?</h3><p>A wardrobe component contains highly complex information, such as color, shape, and interior organization, etc. However, the traditional way of keeping wardrobe data in a relational database is far from enough. A popular way is to use embedding techniques to convert wardrobes into vectors. Therefore, we need to look for a new type of database specifically designed for vector storage and similarity search. After probing into several popular solutions, the <a href="https://github.com/milvus-io/milvus">Milvus</a> vector database is selected for its excellent performance, stability, compatibility, and ease-of-use. The chart below is a comparison of several popular vector search solutions.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Solution_comparison_d96b8f1dd5.png" alt="solution comparison" class="doc-image" id="solution-comparison" />
    <span>solution comparison</span>
  </span>
</p>
<h3 id="System-workflow" class="common-anchor-header">System workflow</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/System_workflow_250c275ec1.png" alt="System workflow" class="doc-image" id="system-workflow" />
    <span>System workflow</span>
  </span>
</p>
<p>Elasticsearch is used for a coarse filtering by the wardrobe size, color, etc. Then the filtered results go through Milvus the vector database for a similarity search and the results are ranked based on their distance/similarity to the query vector. Finally, the results are consolidated and further refined based on business insights.</p>
<h2 id="Data-flow" class="common-anchor-header">Data flow<button data-href="#Data-flow" class="anchor-icon" translate="no">
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
    </button></h2><p>The wardrobe customization system is very similar to traditional search engines and recommender systems. It contains three parts:</p>
<ul>
<li>Offline data preparation including data definition and generation.</li>
<li>Online services including recall and ranking.</li>
<li>Data post-processing based on business logic.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/data_flow_d0d9fa0fca.png" alt="Data flow" class="doc-image" id="data-flow" />
    <span>Data flow</span>
  </span>
</p>
<h3 id="Offline-data-flow" class="common-anchor-header">Offline data flow</h3><ol>
<li>Define data using business insight.</li>
<li>Use prior knowledge to define how to combine different components and form them into a wardrobe.</li>
<li>Recognize feature labels of the wardrobes and encode the features into Elasticsearch data in <code translate="no">.json</code> file.</li>
<li>Prepare recall data by encoding unstructured data into vectors.</li>
<li>Use Milvus the vector database to rank the recalled results obtained in the previous step.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/offline_data_flow_f91ac9cf4c.png" alt="offline data flow" class="doc-image" id="offline-data-flow" />
    <span>offline data flow</span>
  </span>
</p>
<h3 id="Online-data-flow" class="common-anchor-header">Online data flow</h3><ol>
<li>Receive query request from users and collect user profiles.</li>
<li>Understand user query by identifying their requirements for the wardrobe.</li>
<li>Coarse search using Elasticsearch.</li>
<li>Score and rank the results obtained from coarse search based on the calculation of vector similarity in Milvus.</li>
<li>Post-process and organize the results on the back-end platform to generate the final results.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/online_data_flow_1f2af25cc3.png" alt="online data flow" class="doc-image" id="online-data-flow" />
    <span>online data flow</span>
  </span>
</p>
<h3 id="Data-post-processing" class="common-anchor-header">Data post-processing</h3><p>The business logic varies among each company. You can add a final touch to the results by applying your company’s business logic.</p>
<h2 id="System-demo" class="common-anchor-header">System demo<button data-href="#System-demo" class="anchor-icon" translate="no">
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
    </button></h2><p>Now let’s see how the system we build actually works.</p>
<p>The user interface (UI) displays the possibility of different combinations of wardrobe components.</p>
<p>Each component is labelled by its feature (size, color, etc.) and stored in Elasticsearch (ES). When storing the labels in ES, there are four main data fields to be filled out: ID, tags, storage path, and other support fields. ES and the labelled data are used for granular recall and attribute filtering.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/es_d5b0639610.png" alt="es" class="doc-image" id="es" />
    <span>es</span>
  </span>
</p>
<p>Then different AI algorithms are used to encode a wardrobe into a set of vectors. The vector sets are stored in Milvus for similarity search and ranking. This step returns more refined and accurate results.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Milvus_38dd93a439.jpeg" alt="Milvus" class="doc-image" id="milvus" />
    <span>Milvus</span>
  </span>
</p>
<p>Elasticsearch, Milvus, and other system components altogether form the customization design platform as a whole. During recall, the domain-specific language (DSL) in Elasticsearch and Milvus is as follows.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/dsl_df60097d23.png" alt="dsl" class="doc-image" id="dsl" />
    <span>dsl</span>
  </span>
</p>
<h2 id="Looking-for-more-resources" class="common-anchor-header">Looking for more resources?<button data-href="#Looking-for-more-resources" class="anchor-icon" translate="no">
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
    </button></h2><p>Learn how the Milvus vector database can power more AI applications:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-06-23-How-Short-video-Platform-Likee-Removes-Duplicate-Videos-with-Milvus.md">How Short Video Platform Likee Removes Duplicate Videos with Milvus</a></li>
<li><a href="https://milvus.io/blog/2022-06-20-Zhentu-the-Photo-Fraud-Detector-Based-on-Milvus.md">Zhentu - The Photo Fraud Detector Based on Milvus</a></li>
</ul>
