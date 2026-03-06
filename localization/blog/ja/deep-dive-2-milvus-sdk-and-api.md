---
id: deep-dive-2-milvus-sdk-and-api.md
title: An Introduction to Milvus Python SDK and API
author: Xuan Yang
date: 2022-03-21T00:00:00.000Z
desc: >-
  Learn how SDKs interact with Milvus and why ORM-style API helps you better
  manage Milvus.
cover: assets.zilliz.com/20220322_175856_e8e7bea7dc.png
tag: Engineering
tags: 'Data science, Database, Technology, Artificial Intelligence, Vector Management'
canonicalUrl: 'https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/20220322_175856_e8e7bea7dc.png" alt="Cover image" class="doc-image" id="cover-image" />
    <span>Cover image</span>
  </span>
</p>
<p>By <a href="https://github.com/XuanYang-cn">Xuan Yang</a></p>
<h2 id="Background" class="common-anchor-header">Background<button data-href="#Background" class="anchor-icon" translate="no">
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
    </button></h2><p>The following illustration depicts the interaction between SDKs and Milvus through gRPC. Imagine that Milvus is a black box. Protocol Buffers are used to define the interfaces of the server, and the structure of the information they carry. Therefore, all operations in the black box Milvus is defined by Protocol API.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/SDK_10c9673111.png" alt="Interaction" class="doc-image" id="interaction" />
    <span>Interaction</span>
  </span>
</p>
<h2 id="Milvus-Protocol-API" class="common-anchor-header">Milvus Protocol API<button data-href="#Milvus-Protocol-API" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus Protocol API consists of <code translate="no">milvus.proto</code>, <code translate="no">common.proto</code>, and <code translate="no">schema.proto</code>, which are Protocol Buffers files suffixed with <code translate="no">.proto</code>. To ensure proper operation, SDKs must interact with Milvus with these Protocol Buffers files.</p>
<h3 id="milvusproto" class="common-anchor-header">milvus.proto</h3><p><code translate="no">milvus.proto</code> is the vital component of Milvus Protocol API because it defines the <code translate="no">MilvusService</code>, which further defines all RPC interfaces of Milvus.</p>
<p>The following code sample shows the interface <code translate="no">CreatePartitionRequest</code>. It has two major string-type parameters <code translate="no">collection_name</code> and <code translate="no">partition_name</code>, based on which you can start a partition creation request.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/code_d5f034d58d.png" alt="CreatePartitionRequest" class="doc-image" id="createpartitionrequest" />
    <span>CreatePartitionRequest</span>
  </span>
</p>
<p>Check an example of Protocol in <a href="https://github.com/milvus-io/milvus-proto/blob/44f59db22b27cc55e4168c8e53b6e781c010a713/proto/milvus.proto">PyMilvus GitHub Repository</a> on line 19.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/create_partition_938691f07f.png" alt="Example" class="doc-image" id="example" />
    <span>Example</span>
  </span>
</p>
<p>You can find the definition of <code translate="no">CreatePartitionRequest</code> here.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/20220321_112254_4ec4f35bd3.png" alt="Definition" class="doc-image" id="definition" />
    <span>Definition</span>
  </span>
</p>
<p>Contributors who wish to develop a feature of Milvus or an SDK in a different programming language are welcome to find all interfaces Milvus offers via RPC.</p>
<h3 id="commonproto" class="common-anchor-header">common.proto</h3><p><code translate="no">common.proto</code> defines the common types of information, including <code translate="no">ErrorCode</code>, and <code translate="no">Status</code>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/20220321_112303_eaafc432a8.png" alt="common.proto" class="doc-image" id="common.proto" />
    <span>common.proto</span>
  </span>
</p>
<h3 id="schemaproto" class="common-anchor-header">schema.proto</h3><p><code translate="no">schema.proto</code> defines the schema in the parameters. The following code sample is an example of <code translate="no">CollectionSchema</code>.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/20220321_112313_df4ebe36e7.png" alt="schema.proto" class="doc-image" id="schema.proto" />
    <span>schema.proto</span>
  </span>
</p>
<p><code translate="no">milvus.proto</code>, <code translate="no">common.proto</code>, and <code translate="no">schema.proto</code> together constitutes the API of Milvus, representing all operations that can be called via RPC.</p>
<p>If you dig into the source code and observe carefully, you will find that when interfaces like <code translate="no">create_index</code> are called, they actually call multiple RPC interfaces such as <code translate="no">describe_collection</code> and <code translate="no">describe_index</code>. Many of the outward interface of Milvus is a combination of multiple RPC interfaces.</p>
<p>Having understood the behaviors of RPC, you can then develop new features for Milvus through combination. You are more than welcome to use your imagination and creativeness and contribute to Milvus community.</p>
<h2 id="PyMilvus-20" class="common-anchor-header">PyMilvus 2.0<button data-href="#PyMilvus-20" class="anchor-icon" translate="no">
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
    </button></h2><h3 id="Object-relational-mapping-ORM" class="common-anchor-header">Object-relational mapping (ORM)</h3><p>To put it in a nutshell, Object-relational mapping (ORM) refers to that when you operate on a local object, such operations will affect the corresponding object on server. PyMilvus ORM-style API features the following characteristics:</p>
<ol>
<li>It operates directly on objects.</li>
<li>It isolates service logic and data access details.</li>
<li>It hides the complexity of implementation, and you can run the same scripts across different Milvus instances regardless of their deployment approaches or implementation.</li>
</ol>
<h3 id="ORM-style-API" class="common-anchor-header">ORM-style API</h3><p>One of the essence of ORM-style API lies in the control of Milvus connection. For example, you can specify aliases for multiple Milvus servers, and connect to or disconnect from them merely with their aliases. You can even delete the local server address, and control certain objects via specific connection precisely.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/20220321_112320_d5ff08a582.png" alt="Control Connection" class="doc-image" id="control-connection" />
    <span>Control Connection</span>
  </span>
</p>
<p>Another feature of ORM-style API is that, after abstraction, all operations can be performed directly on objects, including collection, partition, and index.</p>
<p>You can abstract a collection object by getting an existing one or creating a new one. You can also assign a Milvus connection to specific objects using connection alias, so that you can operate on these objects locally.</p>
<p>To create a partition object, you can either create it with its parent collection object, or you can do it just like when you create a collection object. These methods can be employed on an index object as well.</p>
<p>In the case that these partition or index objects exist, you can get them through their parent collection object.</p>
<h2 id="About-the-Deep-Dive-Series" class="common-anchor-header">About the Deep Dive Series<button data-href="#About-the-Deep-Dive-Series" class="anchor-icon" translate="no">
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
    </button></h2><p>With the <a href="https://milvus.io/blog/2022-1-25-annoucing-general-availability-of-milvus-2-0.md">official announcement of general availability</a> of Milvus 2.0, we orchestrated this Milvus Deep Dive blog series to provide an in-depth interpretation of the Milvus architecture and source code. Topics covered in this blog series include:</p>
<ul>
<li><a href="https://milvus.io/blog/deep-dive-1-milvus-architecture-overview.md">Milvus architecture overview</a></li>
<li><a href="https://milvus.io/blog/deep-dive-2-milvus-sdk-and-api.md">APIs and Python SDKs</a></li>
<li><a href="https://milvus.io/blog/deep-dive-3-data-processing.md">Data processing</a></li>
<li><a href="https://milvus.io/blog/deep-dive-4-data-insertion-and-data-persistence.md">Data management</a></li>
<li><a href="https://milvus.io/blog/deep-dive-5-real-time-query.md">Real-time query</a></li>
<li><a href="https://milvus.io/blog/deep-dive-7-query-expression.md">Scalar execution engine</a></li>
<li><a href="https://milvus.io/blog/deep-dive-6-oss-qa.md">QA system</a></li>
<li><a href="https://milvus.io/blog/deep-dive-8-knowhere.md">Vector execution engine</a></li>
</ul>
