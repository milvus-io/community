---
id: >-
  milvus-2-2-12-easier-access-faster-vector-search-speeds-better-user-experience.md
title: >
  Milvus 2.2.12: Easier Access, Faster Vector Search Speeds, and Better User
  Experience 
author: 'Owen Jiao, Fendy Feng'
date: 2023-07-28T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_2_2_12_20230720_143424_7d19280738.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, Vector Search
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/milvus-2-2-12-easier-access-faster-vector-search-speeds-better-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_2_12_20230720_143424_7d19280738.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>We are thrilled to announce the latest release of Milvus 2.2.12. This update includes multiple new features, such as support for RESTful API, <code translate="no">json_contains</code> function, and vector retrieval during ANN searches in response to user feedback. We have also streamlined the user experience, enhanced the vector searching speeds, and resolved many issues. Let’s delve into what we can expect from Milvus 2.2.12.</p>
<h2 id="Support-for-RESTful-API" class="common-anchor-header">Support for RESTful API<button data-href="#Support-for-RESTful-API" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.12 now supports RESTful API, which enables users to access Milvus without installing a client, making client-server operations effortless. Additionally, deploying Milvus has become more convenient because the Milvus SDK and RESTful API share the same port number.</p>
<p><strong>Note</strong>: We still recommend using the SDK to deploy Milvus for advanced operations or if your business is latency sensitive.</p>
<h2 id="Vector-retrieval-during-ANN-searches" class="common-anchor-header">Vector retrieval during ANN searches<button data-href="#Vector-retrieval-during-ANN-searches" class="anchor-icon" translate="no">
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
    </button></h2><p>In earlier versions, Milvus did not allow vector retrieval during approximate nearest neighbor (ANN) searches to prioritize performance and memory usage. As a result, retrieving raw vectors had to be split into two steps: performing the ANN search and then querying the raw vectors based on their IDs. This approach increased development costs and made it harder for users to deploy and adopt Milvus.</p>
<p>With Milvus 2.2.12, users can retrieve raw vectors during ANN searches by setting the vector field as an output field and querying in HNSW-, DiskANN-, or IVF-FLAT-indexed collections. In addition, users can expect a much faster vector retrieval speed.</p>
<h2 id="Support-for-operations-on-JSON-arrays" class="common-anchor-header">Support for operations on JSON arrays<button data-href="#Support-for-operations-on-JSON-arrays" class="anchor-icon" translate="no">
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
    </button></h2><p>We recently added support for JSON in Milvus 2.2.8. Since then, users have sent numerous requests to support additional JSON arrays operations, such as inclusion, exclusion, intersection, union, difference, and more. In Milvus 2.2.12, we’ve prioritized supporting the <code translate="no">json_contains</code> function to enable the inclusion operation. We will continue to add support for other operators in future versions.</p>
<h2 id="Enhancements-and-bug-fixes" class="common-anchor-header">Enhancements and bug fixes<button data-href="#Enhancements-and-bug-fixes" class="anchor-icon" translate="no">
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
    </button></h2><p>In addition to introducing new features, Milvus 2.2.12 has improved its vector search performance with reduced overhead, making it easier to handle extensive topk searches. Moreover, it enhances the write performance in partition-key-enabled and multi-partition situations and optimizes CPU usage for large machines.
This update addresses various issues: excessive disk usage, stuck compaction, infrequent data deletions, and bulk insertion failures. For further information, please refer to the <a href="https://milvus.io/docs/release_notes.md#2212">Milvus 2.2.12 Release Notes</a>.</p>
<h2 id="Lets-keep-in-touch" class="common-anchor-header">Let’s keep in touch!<button data-href="#Lets-keep-in-touch" class="anchor-icon" translate="no">
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
