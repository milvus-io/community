---
id: milvus-embraces-nats-messaging.md
title: 'Optimizing Data Communication: Milvus Embraces NATS Messaging'
author: Zhen Ye
date: 2023-11-24T00:00:00.000Z
desc: >-
  Introducing the integration of NATS and Milvus, exploring its features, setup
  and migration process, and performance testing results.
cover: assets.zilliz.com/Exploring_NATS_878f48c848.png
tag: Engineering
tags: >-
  Milvus, Vector Database, Open Source, Data science, Artificial Intelligence,
  Vector Management, NATS, Message Queues, RocksMQ
recommend: true
canonicalUrl: >-
  https://zilliz.com/blog/optimizing-data-communication-milvus-embraces-nats-messaging
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Exploring_NATS_878f48c848.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>In the intricate tapestry of data processing, seamless communication is the thread that binds operations together. <a href="https://zilliz.com/what-is-milvus">Milvus</a>, the trailblazing <a href="https://zilliz.com/cloud">open-source vector database</a>, has embarked on a transformative journey with its latest feature: NATS messaging integration. In this comprehensive blog post, we’ll unravel the intricacies of this integration, exploring its core features, setup process, migration benefits, and how it stacks up against its predecessor, RocksMQ.</p>
<h2 id="Understanding-the-role-of-message-queues-in-Milvus" class="common-anchor-header">Understanding the role of message queues in Milvus<button data-href="#Understanding-the-role-of-message-queues-in-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>In Milvus’ cloud-native architecture, the message queue, or Log Broker, holds pivotal importance. It’s the backbone ensuring persistent data streams, synchronization, event notifications, and data integrity during system recoveries. Traditionally, RocksMQ was the most straightforward choice in Milvus Standalone mode, especially when compared with Pulsar and Kafka, but its limitations became evident with extensive data and complex scenarios.</p>
<p>Milvus 2.3 introduces NATS, a single-node MQ implementation, redefining how to manage data streams. Unlike its predecessors, NATS liberates Milvus users from performance constraints, delivering a seamless experience in handling substantial data volumes.</p>
<h2 id="What-is-NATS" class="common-anchor-header">What is NATS?<button data-href="#What-is-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>NATS is a distributed system connectivity technology implemented in Go. It supports various communication modes like Request-Reply and Publish-Subscribe across systems, provides data persistence through JetStream, and offers distributed capabilities through built-in RAFT. You can refer to the <a href="https://nats.io/">NATS official website</a> for a more detailed understanding of NATS.</p>
<p>In Milvus 2.3 Standalone mode, NATS, JetStream, and PubSub provide Milvus with robust MQ capabilities.</p>
<h2 id="Enabling-NATS" class="common-anchor-header">Enabling NATS<button data-href="#Enabling-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus 2.3 offers a new control option, <code translate="no">mq.type</code>, which allows users to specify the type of MQ they want to use. To enable NATS, set <code translate="no">mq.type=natsmq</code>. If you see logs similar to the ones below after you initiate Milvus instances, you have successfully enabled NATS as the message queue.</p>
<pre><code translate="no">[INFO] [dependency/factory.go:83] [<span class="hljs-string">&quot;try to init mq&quot;</span>] [standalone=<span class="hljs-literal">true</span>] [mqType=natsmq]
<button class="copy-code-btn"></button></code></pre>
<h2 id="Configuring-NATS-for-Milvus" class="common-anchor-header">Configuring NATS for Milvus<button data-href="#Configuring-NATS-for-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>NATS customization options include specifying the listening port, JetStream storage directory, maximum payload size, and initialization timeout. Fine-tuning these settings ensures optimal performance and reliability.</p>
<pre><code translate="no">natsmq:
server: <span class="hljs-comment"># server side configuration for natsmq.</span>
port: <span class="hljs-number">4222</span> <span class="hljs-comment"># 4222 by default, Port for nats server listening.</span>
storeDir: /var/lib/milvus/nats <span class="hljs-comment"># /var/lib/milvus/nats by default, directory to use for JetStream storage of nats.</span>
maxFileStore: <span class="hljs-number">17179869184</span> <span class="hljs-comment"># (B) 16GB by default, Maximum size of the &#x27;file&#x27; storage.</span>
maxPayload: <span class="hljs-number">8388608</span> <span class="hljs-comment"># (B) 8MB by default, Maximum number of bytes in a message payload.</span>
maxPending: <span class="hljs-number">67108864</span> <span class="hljs-comment"># (B) 64MB by default, Maximum number of bytes buffered for a connection Applies to client connections.</span>
initializeTimeout: <span class="hljs-number">4000</span> <span class="hljs-comment"># (ms) 4s by default, waiting for initialization of natsmq finished.</span>
monitor:
trace: false <span class="hljs-comment"># false by default, If true enable protocol trace log messages.</span>
debug: false <span class="hljs-comment"># false by default, If true enable debug log messages.</span>
logTime: true <span class="hljs-comment"># true by default, If set to false, log without timestamps.</span>
logFile: /tmp/milvus/logs/nats.log <span class="hljs-comment"># /tmp/milvus/logs/nats.log by default, Log file path relative to .. of milvus binary if use relative path.</span>
logSizeLimit: <span class="hljs-number">536870912</span> <span class="hljs-comment"># (B) 512MB by default, Size in bytes after the log file rolls over to a new one.</span>
retention:
maxAge: <span class="hljs-number">4320</span> <span class="hljs-comment"># (min) 3 days by default, Maximum age of any message in the P-channel.</span>
maxBytes: <span class="hljs-comment"># (B) None by default, How many bytes the single P-channel may contain. Removing oldest messages if the P-channel exceeds this size.</span>
maxMsgs: <span class="hljs-comment"># None by default, How many message the single P-channel may contain. Removing oldest messages if the P-channel exceeds this limit.</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Note:</strong></p>
<ul>
<li><p>You must specify <code translate="no">server.port</code> for NATS server listening. If there is a port conflict, Milvus cannot start. Set <code translate="no">server.port=-1</code> to randomly select a port.</p></li>
<li><p><code translate="no">storeDir</code> specifies the directory for JetStream storage. We recommend storing the directory in a high-performant solid-state drive (SSD) for better read/write throughput of Milvus.</p></li>
<li><p><code translate="no">maxFileStore</code> sets the upper limit of JetStream storage size. Exceeding this limit will prevent further data writing.</p></li>
<li><p><code translate="no">maxPayload</code> limits individual message size. You should keep it above 5MB to avoid any write rejections.</p></li>
<li><p><code translate="no">initializeTimeout</code>controls NATS server startup timeout.</p></li>
<li><p><code translate="no">monitor</code> configures NATS’ independent logs.</p></li>
<li><p><code translate="no">retention</code> controls the retention mechanism of NATS messages.</p></li>
</ul>
<p>For more information, refer to <a href="https://docs.nats.io/running-a-nats-service/configuration">NATS official documentation</a>.</p>
<h2 id="Migrating-from-RocksMQ-to-NATS" class="common-anchor-header">Migrating from RocksMQ to NATS<button data-href="#Migrating-from-RocksMQ-to-NATS" class="anchor-icon" translate="no">
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
    </button></h2><p>Migrating from RocksMQ to NATS is a seamless process involving steps like stopping write operations, flushing data, modifying configurations, and verifying the migration through Milvus logs.</p>
<ol>
<li><p>Before initiating the migration, stop all write operations in Milvus.</p></li>
<li><p>Execute the <code translate="no">FlushALL</code> operation in Milvus and wait for its completion. This step ensures that all pending data is flushed and the system is ready for shutdown.</p></li>
<li><p>Modify the Milvus configuration file by setting <code translate="no">mq.type=natsmq</code> and adjusting relevant options under the <code translate="no">natsmq</code> section.</p></li>
<li><p>Start the Milvus 2.3.</p></li>
<li><p>Back up and clean the original data stored in the <code translate="no">rocksmq.path</code> directory. (Optional)</p></li>
</ol>
<h2 id="NATS-vs-RocksMQ-A-Performance-Showdown" class="common-anchor-header">NATS vs. RocksMQ: A Performance Showdown<button data-href="#NATS-vs-RocksMQ-A-Performance-Showdown" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="PubSub-Performance-Testing" class="common-anchor-header">Pub/Sub Performance Testing</h3><ul>
<li><p><strong>Testing Platform:</strong> M1 Pro Chip / Memory: 16GB</p></li>
<li><p><strong>Testing Scenario:</strong> Subscribing and publishing random data packets to a topic repeatedly until the last published result is received.</p></li>
<li><p><strong>Results:</strong></p>
<ul>
<li><p>For smaller data packets (&lt; 64kb), RocksMQ outperforms NATS regarding memory, CPU, and response speed.</p></li>
<li><p>For larger data packets (&gt; 64kb), NATS outshines RocksMQ, offering much faster response times.</p></li>
</ul></li>
</ul>
<table>
<thead>
<tr><th>Test Type</th><th>MQ</th><th>op count</th><th>cost per op</th><th>Memory cost</th><th>CPU Total Time</th><th>Storage cost</th></tr>
</thead>
<tbody>
<tr><td>5MB*100 Pub/Sub</td><td>NATS</td><td>50</td><td>1.650328186 s/op</td><td>4.29 GB</td><td>85.58</td><td>25G</td></tr>
<tr><td>5MB*100 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>2.475595131 s/op</td><td>1.18 GB</td><td>81.42</td><td>19G</td></tr>
<tr><td>1MB*500 Pub/Sub</td><td>NATS</td><td>50</td><td>2.248722593 s/op</td><td>2.60 GB</td><td>96.50</td><td>25G</td></tr>
<tr><td>1MB*500 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>2.554614279 s/op</td><td>614.9 MB</td><td>80.19</td><td>19G</td></tr>
<tr><td>64KB*10000 Pub/Sub</td><td>NATS</td><td>50</td><td>2.133345262 s/op</td><td>3.29 GB</td><td>97.59</td><td>31G</td></tr>
<tr><td>64KB*10000 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>3.253778195 s/op</td><td>331.2 MB</td><td>134.6</td><td>24G</td></tr>
<tr><td>1KB*50000 Pub/Sub</td><td>NATS</td><td>50</td><td>2.629391004 s/op</td><td>635.1 MB</td><td>179.67</td><td>2.6G</td></tr>
<tr><td>1KB*50000 Pub/Sub</td><td>RocksMQ</td><td>50</td><td>0.897638581 s/op</td><td>232.3 MB</td><td>60.42</td><td>521M</td></tr>
</tbody>
</table>
<p>Table 1: Pub/Sub performance testing results</p>
<h3 id="Milvus-Integration-Testing" class="common-anchor-header">Milvus Integration Testing</h3><p><strong>Data size:</strong> 100M</p>
<p><strong>Result:</strong> In extensive testing with a 100 million vectors dataset, NATS showcased lower vector search and query latency.</p>
<table>
<thead>
<tr><th>Metrics</th><th>RocksMQ (ms)</th><th>NATS (ms)</th></tr>
</thead>
<tbody>
<tr><td>Average vector search latency</td><td>23.55</td><td>20.17</td></tr>
<tr><td>Vector search requests per second (RPS)</td><td>2.95</td><td>3.07</td></tr>
<tr><td>Average query latency</td><td>7.2</td><td>6.74</td></tr>
<tr><td>Query requests per second (RPS)</td><td>1.47</td><td>1.54</td></tr>
</tbody>
</table>
<p>Table 2: Milvus integration testing results with 100m dataset</p>
<p><strong>Dataset: &lt;100M</strong></p>
<p><strong>Result:</strong> For datasets smaller than 100M, NATS and RocksMQ show similar performance.</p>
<h2 id="Conclusion-Empowering-Milvus-with-NATS-messaging" class="common-anchor-header">Conclusion: Empowering Milvus with NATS messaging<button data-href="#Conclusion-Empowering-Milvus-with-NATS-messaging" class="anchor-icon" translate="no">
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
    </button></h2><p>The integration of NATS within Milvus marks a significant stride in data processing. Whether delving into real-time analytics, machine learning applications, or any data-intensive venture, NATS empowers your projects with efficiency, reliability, and speed. As the data landscape evolves, having a robust messaging system like NATS within Milvus ensures seamless, reliable, and high-performing data communication.</p>
