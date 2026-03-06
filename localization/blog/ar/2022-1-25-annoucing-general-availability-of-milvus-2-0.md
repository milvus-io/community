---
id: 2022-1-25-annoucing-general-availability-of-milvus-2-0.md
title: Announcing General Availability of Milvus 2.0
author: Xiaofan Luan
date: 2022-01-25T00:00:00.000Z
desc: An easy way to handle massive high-dimensional data
cover: assets.zilliz.com/Milvus_2_0_GA_4308a0f552.png
tag: News
---
<p>Dear Members and Friends of the Milvus Community:</p>
<p>Today, six months after the first Release Candidate (RC) was made public, we are thrilled to announce that Milvus 2.0 is <a href="https://milvus.io/docs/v2.0.x/release_notes.md#v200">General Available (GA)</a> and production ready! It’s been a long journey, and we thank everyone – community contributors, users, and the LF AI &amp; Data Foundation – along the way who helped us make this happen.</p>
<p>The ability to handle billions of high dimensional data is a big deal for AI systems these days, and for good reasons:</p>
<ol>
<li>Unstructured data occupy dominant volumes compared to traditional structured data.</li>
<li>Data freshness has never been more important. Data scientists are eager for timely data solutions rather than the traditional T+1 compromise.</li>
<li>Cost and performance have become even more critical, and yet there still exists a big gap between current solutions and real world use cases.
Hence, Milvus 2.0. Milvus is a database that helps handle high dimensional data at scale. It is designed for cloud with the ability to run everywhere. If you’ve been following our RC releases, you know we’ve spent great effort on making Milvus more stable and easier to deploy and maintain.</li>
</ol>
<h2 id="Milvus-20-GA-now-offers" class="common-anchor-header">Milvus 2.0 GA now offers<button data-href="#Milvus-20-GA-now-offers" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Entity deletion</strong></p>
<p>As a database, Milvus now supports <a href="https://milvus.io/docs/v2.0.x/delete_data.md">deleting entities by primary key</a> and will support deleting entities by expression later on.</p>
<p><strong>Automatic load balance</strong></p>
<p>Milvus now supports plugin load balance policy to balance the load of each query node and data node. Thanks to the disaggregation of computation and storage, the balance will be done in just a couple of minutes.</p>
<p><strong>Handoff</strong></p>
<p>Once growing segments are sealed through flush, handoff tasks replace growing segments with indexed historical segments to improve search performance.</p>
<p><strong>Data compaction</strong></p>
<p>Data compaction is a background task to merge small segments into large ones and clean logical deleted data.</p>
<p><strong>Support embedded etcd and local data storage</strong></p>
<p>Under Milvus standalone mode, we can remove etcd/MinIO dependency with just a few configurations. Local data storage can also be used as a local cache to avoid loading all data into main memory.</p>
<p><strong>Multi language SDKs</strong></p>
<p>In addition to <a href="https://github.com/milvus-io/pymilvus">PyMilvus</a>, <a href="https://github.com/milvus-io/milvus-sdk-node">Node.js</a>, <a href="https://github.com/milvus-io/milvus-sdk-java">Java</a> and <a href="https://github.com/milvus-io/milvus-sdk-go">Go</a> SDKs are now ready-to-use.</p>
<p><strong>Milvus K8s Operator</strong></p>
<p><a href="https://milvus.io/docs/v2.0.x/install_cluster-milvusoperator.md">Milvus Operator</a> provides an easy solution to deploy and manage a full Milvus service stack, including both Milvus components and its relevant dependencies (e.g. etcd, Pulsar and MinIO), to the target <a href="https://kubernetes.io/">Kubernetes</a> clusters in a scalable and highly available manner.</p>
<p><strong>Tools that help to manage Milvus</strong></p>
<p>We have <a href="https://zilliz.com/">Zilliz</a> to thank for the fantastic contribution of management tools. We now have <a href="https://milvus.io/docs/v2.0.x/attu.md">Attu</a>, which allows us to interact with Milvus via an intuitive GUI, and <a href="https://milvus.io/docs/v2.0.x/cli_overview.md">Milvus_CLI</a>, a command-line tool for managing Milvus.</p>
<p>Thanks to all 212 contributors, the community finished 6718 commits during the last 6 months, and tons of stability and performance issues have been closed. We’ll open our stability and performance benchmark report soon after the 2.0 GA release.</p>
<h2 id="Whats-next" class="common-anchor-header">What’s next?<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Functionality</strong></p>
<p>String type support will be the next killer features for Milvus 2.1. We will also bring in time to live (TTL) mechanism and basic ACL management to better satisfy user needs.</p>
<p><strong>Availability</strong></p>
<p>We are working on refactoring the query coord scheduling mechanism to support multi memory replicas for each segment. With multiple active replicas, Milvus can support faster failover and speculative execution to shorten the downtime to within a couple of seconds.</p>
<p><strong>Performance</strong></p>
<p>Performance benchmark results will soon be offered on our websites. The following releases are anticipated to see an impressive performance improvement. Our target is to halve the search latency under smaller datasets and double the system throughput.</p>
<p><strong>Ease of use</strong></p>
<p>Milvus is designed to run anywhere. We will support Milvus on MacOS (Both M1 and X86) and on ARM servers in the next few small releases. We will also offer embedded PyMilvus so you can simply <code translate="no">pip install</code> Milvus without complex environment setup.</p>
<p><strong>Community governance</strong></p>
<p>We will refine the membership rules and clarify the requirements and responsibilities of contributor roles. A mentorship program is also under development; for anyone who is interested in cloud-native database, vector search, and/or community governance, feel free to contact us.</p>
<p>We’re really excited about the latest Milvus GA release! As always, we are happy to hear your feedback. If you encounter any problems, don’t hesitate to contact us on <a href="https://github.com/milvus-io/milvus">GitHub</a> or via <a href="http://milvusio.slack.com/">Slack</a>.</p>
<p><br/></p>
<p>Best regards,</p>
<p>Xiaofan Luan</p>
<p>Milvus Project Maintainer</p>
<p><br/></p>
<blockquote>
<p><em>Edited by <a href="https://github.com/claireyuw">Claire Yu</a>.</em></p>
</blockquote>
