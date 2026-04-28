---
id: 2022-08-05-whats-new-in-milvus-2-1.md
title: What's new in Milvus 2.1 - Towards simplicity and speed
author: Xiaofan Luan
date: 2022-08-05T00:00:00.000Z
desc: >-
  Milvus, the open-source vector database, now has performance and usability
  improvements that users have long been anticipating.
cover: assets.zilliz.com/What_s_New_in_2_1_2_a0660df2a5.png
tag: News
canonicalUrl: 'https://milvus.io/blog/2022-08-05-whats-new-in-milvus-2-1.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_2_1_2_a0660df2a5.png" alt="What's new in Milvus 2.1 - Towards simplicity and speed" class="doc-image" id="what's-new-in-milvus-2.1---towards-simplicity-and-speed" />
    <span>What's new in Milvus 2.1 - Towards simplicity and speed</span>
  </span>
</p>
<p>We are very glad to announce the
<a href="https://milvus.io/docs/v2.1.x/release_notes.md">release</a> of Milvus 2.1
is now live after six months of hard work by all of our Milvus community
contributors. This major iteration of the popular vector database
emphasizes <strong>performance</strong> and <strong>usability</strong>, two most important
keywords of our focus. We added support for strings, Kafka message
queue, and embedded Milvus, as well as a number of improvements in
performance, scalability, security, and observability. Milvus 2.1 is an
exciting update that will bridge the “last mile” from the algorithm
engineer’s laptop to production-level vector similarity search
services.</p>
<custom-h1>Performance - More than a 3.2x boost</custom-h1><h2 id="5ms-level-latency" class="common-anchor-header">5ms-level latency<button data-href="#5ms-level-latency" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus already supports approximate nearest neighbor (ANN) search, a
substantial leap from the traditional KNN method. However, problems of
throughput and latency continue to challenge users who need to deal with
billion-scale vector data retrieval scenarios.</p>
<p>In Milvus 2.1, there is a new routing protocol that no longer relies on
message queues in the retrieval link, significantly reducing retrieval
latency for small datasets. Our test results show that Milvus now brings
its latency level down to 5ms, which meets the requirements of critical
online links such as similarity search and recommendation.</p>
<h2 id="Concurrency-control" class="common-anchor-header">Concurrency control<button data-href="#Concurrency-control" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 fine-tunes its concurrency model by introducing a new cost
evaluation model and concurrency scheduler. It now provides concurrency
control, which ensures that there will not be a large number of
concurrent requests competing for CPU and cache resources, nor will the
CPU be under-utilized because there are not enough requests. The new,
intelligent scheduler layer in Milvus 2.1 also merges small-nq queries
that have consistent request parameters, delivering an amazing 3.2x
performance boost in scenarios with small-nq and high query concurrency.</p>
<h2 id="In-memory-replicas" class="common-anchor-header">In-memory replicas<button data-href="#In-memory-replicas" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 brings in-memory replicas that improve scalability and
availability for small datasets. Similar to the read-only replicas in
traditional databases, in-memory replicas can scale horizontally by
adding machines when the read QPS is high. In vector retrieval for small
datasets, a recommendation system often needs to provide QPS that
exceeds the performance limit of a single machine. Now in these
scenarios, the system’s throughput can be significantly improved by
loading multiple replicas in the memory. In the future, we will also
introduce a hedged read mechanism based on in-memory replicas, which
will quickly request other functional copies in case the system needs to
recover from failures and makes full use of memory redundancy to improve
the system’s overall availability.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_New_in_Milvus_2_1_Figure_1_excalidraw_1f7fe3c998.png" alt="In-memory replicas allow query services to be based on separate
copies of the same data." class="doc-image" id="in-memory-replicas-allow-query-services-to-be-based-on-separate-copies-of-the-same-data." />
    <span>In-memory replicas allow query services to be based on separate
copies of the same data.</span>
  </span>
</p>
<h2 id="Faster-data-loading" class="common-anchor-header">Faster data loading<button data-href="#Faster-data-loading" class="anchor-icon" translate="no">
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
    </button></h2><p>The last performance boost comes from data loading. Milvus 2.1 now
compresses <a href="https://milvus.io/docs/v2.1.x/glossary.md#Log-snapshot">binary
logs</a> with
Zstandard (zstd), which significantly reduces data size in the object
and message stores as well as network overhead during data loading. In
addition, goroutine pools are now introduced so that Milvus can load
segments concurrently with memory footprints controlled and minimize the
time required to recover from failures and to load data.</p>
<p>The complete benchmark results of Milvus 2.1 will be released on our
website soon. Stay tuned.</p>
<h2 id="String-and-scalar-index-support" class="common-anchor-header">String and scalar index support<button data-href="#String-and-scalar-index-support" class="anchor-icon" translate="no">
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
    </button></h2><p>With 2.1, Milvus now supports variable-length string (VARCHAR) as a
scalar data type. VARCHAR can be used as the primary key that can be
returned as output, and can also act as attribute filters. <a href="https://milvus.io/docs/v2.1.x/hybridsearch.md">Attribute
filtering</a> is one of the
most popular functions Milvus users need. If you often find yourself
wanting to &quot;find products most similar to a user in a <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mn>200</mn><mo>−</mo></mrow><annotation encoding="application/x-tex">200 -</annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.7278em;vertical-align:-0.0833em;"></span><span class="mord">200</span><span class="mord">−</span></span></span></span>300
price range&quot;, or &quot;find articles that have the keyword ‘vector
database’ and are related to cloud-native topics&quot;, you’ll love Milvus
2.1.</p>
<p>Milvus 2.1 also supports scalar inverted index to improve filtering
speed based on
<a href="https://www.cs.le.ac.uk/people/ond1/XMLcomp/confersWEA06_LOUDS.pdf">succinct</a>
<a href="https://github.com/s-yata/marisa-trie">MARISA-Tries</a> as the data
structure. All the data can now be loaded into memory with a very low
footprint, which allows much quicker comparison, filtering and prefix
matching on strings. Our test results show that the memory requirement
of MARISA-trie is only 10% of that of Python dictionaries to load all
the data into memory and provide query capabilities.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/What_s_new_in_Milvus_Figure_2_excalidraw_a1149aca96.png" alt="Milvus 2.1 combines MARISA-Trie with inverted index to significantly improve filtering speed." class="doc-image" id="milvus-2.1-combines-marisa-trie-with-inverted-index-to-significantly-improve-filtering-speed." />
    <span>Milvus 2.1 combines MARISA-Trie with inverted index to significantly improve filtering speed.</span>
  </span>
</p>
<p>In the future, Milvus will continue focusing on scalar query-related
developments, support more scalar index types and query operators, and
provide disk-based scalar query capabilities, all as part of an ongoing
effort to reduce storage and usage cost of scalar data.</p>
<custom-h1>Usability improvements</custom-h1><h2 id="Kafka-support" class="common-anchor-header">Kafka support<button data-href="#Kafka-support" class="anchor-icon" translate="no">
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
    </button></h2><p>Our community has long been requesting support for <a href="https://kafka.apache.org">Apache
Kafka</a> as the <a href="https://milvus.io/docs/v2.1.x/deploy_pulsar.md">message
storage</a> in Milvus.
Milvus 2.1 now offers you the option to use
<a href="https://pulsar.apache.org">Pulsar</a> or Kafka as the message storage
based on user configurations, thanks to the abstraction and
encapsulation design of Milvus and the Go Kafka SDK contributed by
Confluent.</p>
<h2 id="Production-ready-Java-SDK" class="common-anchor-header">Production-ready Java SDK<button data-href="#Production-ready-Java-SDK" class="anchor-icon" translate="no">
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
    </button></h2><p>With Milvus 2.1, our <a href="https://github.com/milvus-io/milvus-sdk-java">Java
SDK</a> is now officially
released. The Java SDK has the exact same capabilities as the Python
SDK, with even better concurrency performance. In the next step, our
community contributors will gradually improve documentation and use
cases for the Java SDK, and help push Go and RESTful SDKs into the
production-ready stage, too.</p>
<h2 id="Observability-and-maintainability" class="common-anchor-header">Observability and maintainability<button data-href="#Observability-and-maintainability" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.1 adds important monitoring
<a href="https://milvus.io/docs/v2.1.x/metrics_dashboard.md">metrics</a> such as
vector insertion counts, search latency/throughput, node memory
overhead, and CPU overhead. Plus, the new version also significantly
optimizes log keeping by adjusting log levels and reducing useless log
printing.</p>
<h2 id="Embedded-Milvus" class="common-anchor-header">Embedded Milvus<button data-href="#Embedded-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus has greatly simplified the deployment of large-scale massive
vector data retrieval services, but for scientists who want to validate
algorithms on a smaller scale, Docker or K8s is still too unnecessarily
complicated. With the introduction of <a href="https://github.com/milvus-io/embd-milvus">embedded
Milvus</a>, you can now install
Milvus using pip, just like with Pyrocksb and Pysqlite. Embedded Milvus
supports all the functionalities of both the cluster and standalone
versions, allowing you to easily switch from your laptop to a
distributed production environment without changing a single line of
code. Algorithm engineers will have a much better experience when
building a prototype with Milvus.</p>
<custom-h1>Try out-of-the-box vector search now</custom-h1><p>Moreover, Milvus 2.1 also has some great improvements in stability and
scalability, and we look forward to your use and feedbacks.</p>
<h2 id="Whats-next" class="common-anchor-header">What’s next<button data-href="#Whats-next" class="anchor-icon" translate="no">
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
<li>See the detailed <a href="https://milvus.io/docs/v2.1.x/release_notes.md">Release
Notes</a> for all the
changes in Milvus 2.1</li>
<li><a href="https://milvus.io/docs/v2.1.x/install_standalone-docker.md">Install</a>
Milvus 2.1 and try out the new features</li>
<li>Join our <a href="https://slack.milvus.io/">Slack community</a> and discuss the
new features with thousands of Milvus users around the world</li>
<li>Follow us on <a href="https://twitter.com/milvusio">Twitter</a> and
<a href="https://www.linkedin.com/company/the-milvus-project">LinkedIn</a> to
get updates once our blogs on specific new features are out</li>
</ul>
<blockquote>
<p>Edited by <a href="https://github.com/songxianj">Songxian Jiang</a></p>
</blockquote>
