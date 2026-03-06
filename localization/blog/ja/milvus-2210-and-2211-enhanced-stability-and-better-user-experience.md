---
id: milvus-2210-and-2211-enhanced-stability-and-better-user-experience.md
title: >-
  Milvus 2.2.10 & 2.2.11: Minor Updates for Enhanced System Stability and User
  Experience
author: 'Fendy Feng, Owen Jiao'
date: 2023-07-06T00:00:00.000Z
cover: assets.zilliz.com/What_s_New_in_Milvus_2_2_10_and_2_2_11_5018946465.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
desc: introducing new features and improvements of Milvus 2.2.10 and 2.2.11
recommend: true
metaTitle: Milvus 2.2.10 & 2.2.11 Enhanced System Stability and User Experience
canonicalUrl: >-
  https://milvus.io/blog/milvus-2210-and-2211-enhanced-stability-and-better-user-experience.md
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_2_10_and_2_2_11_5018946465.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Greetings, Milvus fans! We’re excited to announce that we have just released Milvus 2.2.10 and 2.2.11, two minor updates primarily focusing on bug fixes and overall performance improvement. You can expect a more stable system and a better user experience with the two updates. Let’s take a quick look at what is new in these two releases.</p>
<h2 id="Milvus-2210" class="common-anchor-header">Milvus 2.2.10<button data-href="#Milvus-2210" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.10 has fixed occasional system crashes, accelerated loading and indexing, reduced memory usage in data nodes, and made many other improvements. Below are some notable changes:</p>
<ul>
<li>Replaced the old CGO payload writer with a new one written in pure Go, reducing memory usage in data nodes.</li>
<li>Added <code translate="no">go-api/v2</code> to the <code translate="no">milvus-proto</code> file to prevent confusion with different <code translate="no">milvus-proto</code> versions.</li>
<li>Upgraded Gin from version 1.9.0 to 1.9.1 to fix a bug in the <code translate="no">Context.FileAttachment</code> function.</li>
<li>Added role-based access control (RBAC) for the FlushAll and Database APIs.</li>
<li>Fixed a random crash caused by the AWS S3 SDK.</li>
<li>Improved the loading and indexing speeds.</li>
</ul>
<p>For more details, see <a href="https://milvus.io/docs/release_notes.md#2210">Milvus 2.2.10 Release Notes</a>.</p>
<h2 id="Milvus-2211" class="common-anchor-header">Milvus 2.2.11<button data-href="#Milvus-2211" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.2.11 has resolved various issues to improve the system’s stability. It has also improved its performance in monitoring, logging, rate limiting, and interception of cross-cluster requests. See below for the highlights of this update.</p>
<ul>
<li>Added an interceptor to the Milvus GRPC server to prevent any issues with Cross-Cluster routing.</li>
<li>Added error codes to the minio chunk manager to make diagnosing and fixing errors easier.</li>
<li>Utilized a singleton coroutine pool to avoid wasting coroutines and maximize the use of resources.</li>
<li>Reduced the disk usage for RocksMq to one-tenth of its original level by enabling zstd compression.</li>
<li>Fixed occasional QueryNode panic during loading.</li>
<li>Rectified the read request throttling issue caused by miscalculating queue length twice.</li>
<li>Fixed issues with GetObject returning null values on MacOS.</li>
<li>Fixed a crash caused by incorrect use of the noexcept modifier.</li>
</ul>
<p>For more details, see <a href="https://milvus.io/docs/release_notes.md#2211">Milvus 2.2.11 Release Notes</a>.</p>
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
