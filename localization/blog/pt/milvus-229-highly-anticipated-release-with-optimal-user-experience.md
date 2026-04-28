---
id: milvus-229-highly-anticipated-release-with-optimal-user-experience.md
title: |
  Milvus 2.2.9: A Highly Anticipated Release with Optimal User Experience
author: 'Owen Jiao, Fendy Feng'
date: 2023-06-06T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_9_858e54a2d3.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-229-highly-anticipated-release-with-optimal-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_9_858e54a2d3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>We are thrilled to announce the arrival of Milvus 2.2.9, a highly anticipated release that marks a significant milestone for the team and the community. This release offers many exciting features, including long-awaited support for JSON data types, dynamic schema, and partition keys, ensuring an optimized user experience and streamlined development workflow. Additionally, this release incorporates numerous enhancements and bug fixes. Join us in exploring Milvus 2.2.9 and discovering why this release is so exciting.</p>
<h2 id="Optimized-user-experience-with-JSON-support" class="common-anchor-header">Optimized user experience with JSON support<button data-href="#Optimized-user-experience-with-JSON-support" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus has introduced highly anticipated support for the JSON data type, allowing for the seamless storage of JSON data alongside the metadata of vectors within users’ collections. With this enhancement, users can efficiently insert JSON data in bulk and perform advanced querying and filtering based on their JSON fields’ contents. Furthermore, users can leverage expressions and perform operations tailored to their dataset’s JSON fields, construct queries, and apply filters based on the content and structure of their JSON fields, allowing them to extract relevant information and manipulate data better.</p>
<p>In the future, the Milvus team will add indexes for fields within the JSON type, further optimizing the performance of mixed scalar and vector queries. So stay tuned for exciting developments ahead!</p>
<h2 id="Added-flexibility-with-support-for-dynamic-schema" class="common-anchor-header">Added flexibility with support for dynamic schema<button data-href="#Added-flexibility-with-support-for-dynamic-schema" class="anchor-icon" translate="no">
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
    </button></h2><p>With support for JSON data, Milvus 2.2.9 now provides dynamic schema functionality through a simplified software development kit (SDK).</p>
<p>Starting with Milvus 2.2.9, the Milvus SDK includes a high-level API that automatically fills dynamic fields into the hidden JSON field of the collection, allowing users to concentrate solely on their business fields.</p>
<h2 id="Better-data-separation-and-enhanced-search-efficiency-with-Partition-Key" class="common-anchor-header">Better data separation and enhanced search efficiency with Partition Key<button data-href="#Better-data-separation-and-enhanced-search-efficiency-with-Partition-Key" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.9 enhances its partitioning capabilities by introducing the Partition Key feature. It allows user-specific columns as primary keys for partitioning, eliminating the need for additional APIs such as <code translate="no">loadPartition</code> and <code translate="no">releasePartition</code>. This new feature also removes the limit on the number of partitions, leading to more efficient resource utilization.</p>
<h2 id="Support-for-Alibaba-Cloud-OSS" class="common-anchor-header">Support for Alibaba Cloud OSS<button data-href="#Support-for-Alibaba-Cloud-OSS" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.9 now supports Alibaba Cloud Object Storage Service (OSS). Alibaba Cloud users can easily configure the <code translate="no">cloudProvider</code> to Alibaba Cloud and take advantage of seamless integration for efficient storage and retrieval of vector data in the cloud.</p>
<p>In addition to the previously mentioned features, Milvus 2.2.9 offers database support in Role-Based Access Control (RBAC), introduces connection management, and includes multiple enhancements and bug fixes. For more information, refer to <a href="https://milvus.io/docs/release_notes.md">Milvus 2.2.9 Release Notes</a>.</p>
<h2 id="Let’s-keep-in-touch" class="common-anchor-header">Let’s keep in touch!<button data-href="#Let’s-keep-in-touch" class="anchor-icon" translate="no">
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
    </button></h2><p>If you have questions or feedback about Milvus, please don’t hesitate to contact us through <a href="https://twitter.com/milvusio">Twitter</a> or <a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a>. You’re also welcome to join our <a href="https://milvus.io/slack/">Slack channel</a> to chat with our engineers and the community directly or check out our <a href="https://us02web.zoom.us/meeting/register/tZ0pcO6vrzsuEtVAuGTpNdb6lGnsPBzGfQ1T#/registration">Tuesday office hours</a>!</p>
