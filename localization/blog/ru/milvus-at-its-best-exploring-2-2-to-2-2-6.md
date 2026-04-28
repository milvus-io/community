---
id: milvus-at-its-best-exploring-2-2-to-2-2-6.md
title: |
  Milvus at Its Best: Exploring v2.2 to v2.2.6
author: Fendy Feng
date: 2023-04-22T00:00:00.000Z
cover: assets.zilliz.com/explore_milvus_latest_versions_48a4138d02.png
tag: News
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management
desc: what is new with Milvus 2.2 to 2.2.6
recommend: true
canonicalUrl: 'https://milvus.io/blog/milvus-at-its-best-exploring-2-2-to-2-2-6.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/exploring_milvus_latest_versions_4fa890533e.png" alt="Milvus at Its Best" class="doc-image" id="milvus-at-its-best" />
    <span>Milvus at Its Best</span>
  </span>
</p>
<p>Welcome back, Milvus followers! We know it’s been a while since we last shared our updates on this cutting-edge open-source vector database. But fear not, because we’re here to catch you up on all the exciting developments that have taken place since last August.</p>
<p>In this blog post, we’ll take you through the latest Milvus releases, spanning from version 2.2 to version 2.2.6. We have much to cover, including new features, improvements, bug fixes, and optimizations. So, fasten your seatbelts, and let’s dive in!</p>
<h2 id="Milvus-v22-a-major-release-with-enhanced-stability-faster-search-speed-and-flexible-scalability" class="common-anchor-header">Milvus v2.2: a major release with enhanced stability, faster search speed, and flexible scalability<button data-href="#Milvus-v22-a-major-release-with-enhanced-stability-faster-search-speed-and-flexible-scalability" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2 is a significant release that introduces seven brand-new features and numerous breakthrough improvements to previous versions. Let’s take a closer look at some of the highlights:</p>
<ul>
<li><strong>Bulk Inserts of Entities from Files</strong>: With this feature, you can upload a batch of entities in one or multiple files directly to Milvus with just a few lines of code, saving you time and effort.</li>
<li><strong>Query Result Pagination</strong>: To avoid massive search and query results returning in a single remote procedure call (RPC), Milvus v2.2 allows you to configure offset and filter results with keywords in searches and queries.</li>
<li><strong>Role-Based Access Control (RBAC)</strong>: Milvus v2.2 now supports RBAC, allowing you to control access to your Milvus instance by managing users, roles, and permissions.</li>
<li><strong>Quotas and Limits</strong>: Quotas and limits is a new mechanism in Milvus v2.2 that protects the database system from out-of-memory (OOM) errors and crashes during sudden traffic surges. With this feature, you can control ingestion, search, and memory usage.</li>
<li><strong>Time to Live (TTL) at a Collection Level</strong>: In previous releases, Milvus only allowed you to configure TTL for your clusters. However, Milvus v2.2 now supports configuring TTL at the collection level. Configuring TTL for a specific collection and entities in that collection will automatically expire after the TTL ends. This configuration provides more fine-grained control over data retention.</li>
<li><strong>Disk-Based Approximate Nearest Neighbor Search (ANNS) Indexes (Beta)</strong>: Milvus v2.2 introduces support for DiskANN, an SSD-resident, and Vamana graph-based ANNS algorithm. This support allows for direct searching on large-scale datasets, which can significantly reduce memory usage, by up to 10 times.</li>
<li><strong>Data Backup (Beta)</strong>: Milvus v2.2 provides <a href="https://github.com/zilliztech/milvus-backup">a brand new tool</a> for backing up and restoring your Milvus data properly, either through a command line or an API server.</li>
</ul>
<p>In addition to the new features mentioned above, Milvus v2.2 includes fixes for five bugs and multiple improvements to enhance Milvus’ stability, observability, and performance. For more details, see <a href="https://milvus.io/docs/release_notes.md#v220">Milvus v2.2 Release Notes</a>.</p>
<h2 id="Milvus-v221--v222-minor-releases-with-issues-fixed" class="common-anchor-header">Milvus v2.2.1 &amp; v2.2.2: minor releases with issues fixed<button data-href="#Milvus-v221--v222-minor-releases-with-issues-fixed" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.1 and v2.2.2 are minor releases focusing on fixing critical issues in older versions and introducing new features. Here are some highlights:</p>
<h3 id="Milvus-v221" class="common-anchor-header">Milvus v2.2.1</h3><ul>
<li>Supports Pulsa tenant and authentication</li>
<li>Supports transport layer security (TLS) in the etcd config source</li>
<li>Improves search performance by over 30%</li>
<li>Optimizes the scheduler and increases the probability of merge tasks</li>
<li>Fixes multiple bugs, including term filtering failures on indexed scalar fields and IndexNode panic upon failures to create an index</li>
</ul>
<h3 id="Milvus-v222" class="common-anchor-header">Milvus v2.2.2</h3><ul>
<li>Fixes the issue that the proxy doesn’t update the cache of shard leaders</li>
<li>Fixes the issue that the loaded info is not cleaned for released collections/partitions</li>
<li>Fixes the issue that the load count is not cleared on time</li>
</ul>
<p>For more details, see <a href="https://milvus.io/docs/release_notes.md#v221">Milvus v2.2.1 Release Notes</a> and <a href="https://milvus.io/docs/release_notes.md#v222">Milvus v2.2.2 Release Notes</a>.</p>
<h2 id="Milvus-v223-more-secure-stable-and-available" class="common-anchor-header">Milvus v2.2.3: more secure, stable, and available<button data-href="#Milvus-v223-more-secure-stable-and-available" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.3 is a release that focuses on enhancing the system’s security, stability, and availability. In addition, it introduces two important features:</p>
<ul>
<li><p><strong>Rolling upgrade</strong>: This feature allows Milvus to respond to incoming requests during the upgrade process, which was impossible in previous releases. Rolling upgrades ensure the system remains available and responsive to user requests even during upgrades.</p></li>
<li><p><strong>Coordinator high availability (HA)</strong>: This feature enables Milvus coordinators to work in an active-standby mode, reducing the risk of single-point failures. Even in unexpected disasters, the recovery time is reduced to at most 30 seconds.</p></li>
</ul>
<p>In addition to these new features, Milvus v2.2.3 includes numerous improvements and bug fixes, including enhanced bulk insert performance, reduced memory usage, optimized monitoring metrics, and improved meta-storage performance. For more details, see <a href="https://milvus.io/docs/release_notes.md#v223">Milvus v2.2.3 Release Notes</a>.</p>
<h2 id="Milvus-v224-faster-more-reliable-and-resource-saving" class="common-anchor-header">Milvus v2.2.4: faster, more reliable and resource saving<button data-href="#Milvus-v224-faster-more-reliable-and-resource-saving" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.4 is a minor update to Milvus v2.2. It introduces four new features and several enhancements, resulting in faster performance, improved reliability, and reduced resource consumption. The highlights of this release include:</p>
<ul>
<li><strong>Resource grouping</strong>: Milvus now supports grouping QueryNodes into other resource groups, allowing for complete isolation of access to physical resources in different groups.</li>
<li><strong>Collection renaming</strong>: The Collection-renaming API allows users to change the name of a collection, providing more flexibility in managing collections and improving usability.</li>
<li><strong>Support for Google Cloud Storage</strong></li>
<li><strong>New option in search and query APIs</strong>: This new feature allows users to skip search on all growing segments, offering better search performance in scenarios where the search is performed concurrently with data insertion.</li>
</ul>
<p>For more information, see <a href="https://milvus.io/docs/release_notes.md#v224">Milvus v2.2.4 Release Notes</a>.</p>
<h2 id="Milvus-v225-NOT-RECOMMENDED" class="common-anchor-header">Milvus v2.2.5: NOT RECOMMENDED<button data-href="#Milvus-v225-NOT-RECOMMENDED" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.5 has several critical issues, and therefore, we do not recommend using this release.  We sincerely apologize for any inconvenience caused by them. However, these issues have been addressed in Milvus v2.2.6.</p>
<h2 id="Milvus-v226-resolves-critical-issues-from-v225" class="common-anchor-header">Milvus v2.2.6: resolves critical issues from v2.2.5<button data-href="#Milvus-v226-resolves-critical-issues-from-v225" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus v2.2.6 has successfully addressed the critical issues discovered in v2.2.5, including problems with recycling dirty binlog data and the DataCoord GC failure. If you currently use v2.2.5, please upgrade it to ensure optimal performance and stability.</p>
<p>Critical issues fixed include:</p>
<ul>
<li>DataCoord GC failure</li>
<li>Override of passed index parameters</li>
<li>System delay caused by RootCoord message backlog</li>
<li>Inaccuracy of metric RootCoordInsertChannelTimeTick</li>
<li>Possible timestamp stop</li>
<li>Occasional coordinator role self-destruction during the restart process</li>
<li>Checkpoints falling behind due to abnormal exit of garbage collection</li>
</ul>
<p>For more details, see <a href="https://milvus.io/docs/release_notes.md#v226">Milvus v2.2.6 Release Notes</a>.</p>
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
    </button></h2><p>In conclusion, the latest Milvus releases from v2.2 to v2.2.6 have delivered many exciting updates and improvements. From new features to bug fixes and optimizations, Milvus continues to meet its commitments to provide cutting-edge solutions and empower applications in various domains. Stay tuned for more exciting updates and innovations from the Milvus community.</p>
