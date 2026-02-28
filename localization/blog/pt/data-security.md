---
id: data-security.md
title: How Does the Milvus Vector Database Ensure Data Security?
author: Angela Ni
date: 2022-09-05T00:00:00.000Z
desc: Learn about user authentication and encryption in transit in Milvus.
cover: assets.zilliz.com/Security_192e35a790.png
tag: Engineering
tags: 'Vector Database for AI, Artificial Intelligence, Machine Learning'
canonicalUrl: 'https://milvus.io/blog/data-security.md'
---
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Security_192e35a790.png" alt="Cover image" class="doc-image" id="cover-image" />
    <span>Cover image</span>
  </span>
</p>
<p>In full consideration of your data security, user authentication and transport layer security (TLS) connection are now officially available in Milvus 2.1. Without user authentication, anyone can access all data in your vector database with SDK. However, starting from Milvus 2.1, only those with a valid username and password can access the Milvus vector database. In addition, in Milvus 2.1 data security is further protected by TLS, which ensures secure communications in a computer network.</p>
<p>This article aims to analyze how Milvus the vector database ensures data security with user authentication and TLS connection and explain how you can utilize these two features as a user who wants to ensure data security when using the vector database.</p>
<p><strong>Jump to:</strong></p>
<ul>
<li><a href="#What-is-database-security-and-why-is-it-important">What is database security and why is it important?</a></li>
<li><a href="#How-does-the-Milvus-vector-database-ensure-data-security">How does the Milvus vector database ensure data security?</a>
<ul>
<li><a href="#User-authentication">User authentication</a></li>
<li><a href="#TLS-connection">TLS connection</a></li>
</ul></li>
</ul>
<h2 id="What-is-database-security-and-why-is-it-important" class="common-anchor-header">What is database security and why is it important?<button data-href="#What-is-database-security-and-why-is-it-important" class="anchor-icon" translate="no">
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
    </button></h2><p>Database security refers to the measures taken to ensure that all data in the database are safe and kept confidential. Recent data breach and data leak cases at <a href="https://firewalltimes.com/recent-data-breaches/">Twitter, Marriott, and Texas Department of Insurance, etc</a> makes us all the more vigilant to the issue of data security. All these cases constantly remind us that companies and businesses can suffer from severe loss if the data are not well protected and the databases they use are secure.</p>
<h2 id="How-does-the-Milvus-vector-database-ensure-data-security" class="common-anchor-header">How does the Milvus vector database ensure data security?<button data-href="#How-does-the-Milvus-vector-database-ensure-data-security" class="anchor-icon" translate="no">
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
    </button></h2><p>In the current release of 2.1, the Milvus vector database attempts to ensure database security via authentication and encryption. More specifically, on the access level, Milvus supports basic user authentication to control who can access the database. Meanwhile, on the database level, Milvus adopts the transport layer security (TLS) encryption protocol to protect data communication.</p>
<h3 id="User-authentication" class="common-anchor-header">User authentication</h3><p>The basic user authentication feature in Milvus supports accessing the vector database using a username and password for the sake of data security. This means clients can only access the Milvus instance upon providing an authenticated username and password.</p>
<h4 id="The-authentication-workflow-in-the-Milvus-vector-database" class="common-anchor-header">The authentication workflow in the Milvus vector database</h4><p>All gRPC requests are handled by the Milvus proxy, hence authentication is completed by the proxy. The workflow of logging in with the credentials to connect to the Milvus instance is as follows.</p>
<ol>
<li>Create credentials for each Milvus instance and the encrypted passwords are stored in etcd. Milvus uses <a href="https://golang.org/x/crypto/bcrypt">bcrypt</a> for encryption as it implements Provos and Mazières’s <a href="http://www.usenix.org/event/usenix99/provos/provos.pdf">adaptive hashing algorithm</a>.</li>
<li>On the client side, SDK sends ciphertext when connecting to the Milvus service. The base64 ciphertext (<username>:<password>) is attached to the metadata with the key <code translate="no">authorization</code>.</li>
<li>The Milvus proxy intercepts the request and verifies the credentials.</li>
<li>Credentials are cached locally in the proxy.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1280_X1280_021e90e3c8.jpeg" alt="authetication_workflow" class="doc-image" id="authetication_workflow" />
    <span>authetication_workflow</span>
  </span>
</p>
<p>When the credentials are updated, the system workflow in Milvus is as follows</p>
<ol>
<li>Root coord is in charge of the credentials when insert, query, delete APIs are called.</li>
<li>When you update the credentials because you forget the password for instance, the new password is persisted in etcd. Then all the old credentials in the proxy’s local cache are invalidated.</li>
<li>The authentication interceptor looks for the records from local cache first. If the credentials in the cache is not correct, the RPC call to fetch the most updated record from root coord will be triggered. And the credentials in the local cache are updated accordingly.</li>
</ol>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/update_5af81a4173.jpeg" alt="credential_update_workflow" class="doc-image" id="credential_update_workflow" />
    <span>credential_update_workflow</span>
  </span>
</p>
<h4 id="How-to-manage-user-authentication-in-the-Milvus-vector-database" class="common-anchor-header">How to manage user authentication in the Milvus vector database</h4><p>To enable authentication, you need to first set <code translate="no">common.security.authorizationEnabled</code> to <code translate="no">true</code> when configuring Milvus in the <code translate="no">milvus.yaml</code> file.</p>
<p>Once enabled, a root user will be created for the Milvus instance. This root user can use the initial password of <code translate="no">Milvus</code> to connect to the Milvus vector database.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections
connections.<span class="hljs-title function_">connect</span>(
    alias=<span class="hljs-string">&#x27;default&#x27;</span>,
    host=<span class="hljs-string">&#x27;localhost&#x27;</span>,
    port=<span class="hljs-string">&#x27;19530&#x27;</span>,
    user=<span class="hljs-string">&#x27;root_user&#x27;</span>,
    password=<span class="hljs-string">&#x27;Milvus&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>We highly recommend changing the password of the root user when starting Milvus for the first time.</p>
<p>Then root user can further create more new users for authenticated access by running the following command to create new users.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> utility
utility.<span class="hljs-title function_">create_credential</span>(<span class="hljs-string">&#x27;user&#x27;</span>, <span class="hljs-string">&#x27;password&#x27;</span>, <span class="hljs-keyword">using</span>=<span class="hljs-string">&#x27;default&#x27;</span>) 
<button class="copy-code-btn"></button></code></pre>
<p>There are two things to remember when creating new users:</p>
<ol>
<li><p>As for the new username, it can not exceed 32 characters in length and must start with a letter. Only underscores, letters, or numbers are allowed in the username. For example a username of “2abc!” is not accepted.</p></li>
<li><p>As for the password, its length should be 6-256 characters.</p></li>
</ol>
<p>Once the new credential is set up, the new user can connect to the Milvus instance with the username and password.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections
connections.<span class="hljs-title function_">connect</span>(
    alias=<span class="hljs-string">&#x27;default&#x27;</span>,
    host=<span class="hljs-string">&#x27;localhost&#x27;</span>,
    port=<span class="hljs-string">&#x27;19530&#x27;</span>,
    user=<span class="hljs-string">&#x27;user&#x27;</span>,
    password=<span class="hljs-string">&#x27;password&#x27;</span>,
)
<button class="copy-code-btn"></button></code></pre>
<p>Like all authentication processes, you do not have to worry if you forget the password. The password for an existing user can be reset with the following command.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> utility
utility.<span class="hljs-title function_">reset_password</span>(<span class="hljs-string">&#x27;user&#x27;</span>, <span class="hljs-string">&#x27;new_password&#x27;</span>, <span class="hljs-keyword">using</span>=<span class="hljs-string">&#x27;default&#x27;</span>)
<button class="copy-code-btn"></button></code></pre>
<p>Read the <a href="https://milvus.io/docs/v2.1.x/authenticate.md">Milvus documentation</a> to learn more about user authentication.</p>
<h3 id="TLS-connection" class="common-anchor-header">TLS connection</h3><p>Transport layer security (TLS) is a type of authentication protocol to provide communications security in a computer network. TLS uses certificates to provide authentication services between two or more communicating parties.</p>
<h4 id="How-to-enable-TLS-in-the-Milvus-vector-database" class="common-anchor-header">How to enable TLS in the Milvus vector database</h4><p>To enable TLS in Milvus, you need to first run the following command to perpare two files for generating the certificate: a default OpenSSL configuration file named <code translate="no">openssl.cnf</code> and a file named <code translate="no">gen.sh</code> used to generate relevant certificates.</p>
<pre><code translate="no"><span class="hljs-built_in">mkdir</span> cert &amp;&amp; <span class="hljs-built_in">cd</span> cert
<span class="hljs-built_in">touch</span> openssl.cnf gen.sh
<button class="copy-code-btn"></button></code></pre>
<p>Then you can simply copy and paste the configuration we provide <a href="https://milvus.io/docs/v2.1.x/tls.md#Create-files">here</a> to the two files. Or you can also make modifications based on our configuration to better suit your application.</p>
<p>When the two files are ready, you can run the <code translate="no">gen.sh</code> file to create nine certificate files. Likewise, you can also modify the configurations in the nine certificate files to suit your need.</p>
<pre><code translate="no"><span class="hljs-built_in">chmod</span> +x gen.sh
./gen.sh
<button class="copy-code-btn"></button></code></pre>
<p>There is one final step before you can connect to the Milvus service with TLS. You have to set <code translate="no">tlsEnabled</code> to <code translate="no">true</code> and configure the file paths of <code translate="no">server.pem</code>, <code translate="no">server.key</code>, and <code translate="no">ca.pem</code> for the server in <code translate="no">config/milvus.yaml</code>. The code below is an example.</p>
<pre><code translate="no">tls:
  serverPemPath: configs/cert/server.pem
  serverKeyPath: configs/cert/server.key
  caPemPath: configs/cert/ca.pem

common:
  security:
    tlsEnabled: <span class="hljs-literal">true</span>
<button class="copy-code-btn"></button></code></pre>
<p>Then you are all set and can connect to the Milvus service with TLS as long as you specify the file paths of <code translate="no">client.pem</code>, <code translate="no">client.key</code>, and <code translate="no">ca.pem</code> for the client when using the Milvus connection SDK. The code below is also an example.</p>
<pre><code translate="no"><span class="hljs-keyword">from</span> pymilvus <span class="hljs-keyword">import</span> connections

_HOST = <span class="hljs-string">&#x27;127.0.0.1&#x27;</span>
_PORT = <span class="hljs-string">&#x27;19530&#x27;</span>

<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nCreate connection...&quot;</span>)
connections.connect(host=_HOST, port=_PORT, secure=<span class="hljs-literal">True</span>, client_pem_path=<span class="hljs-string">&quot;cert/client.pem&quot;</span>,
                        client_key_path=<span class="hljs-string">&quot;cert/client.key&quot;</span>,
                        ca_pem_path=<span class="hljs-string">&quot;cert/ca.pem&quot;</span>, server_name=<span class="hljs-string">&quot;localhost&quot;</span>)
<span class="hljs-built_in">print</span>(<span class="hljs-string">f&quot;\nList connections:&quot;</span>)
<span class="hljs-built_in">print</span>(connections.list_connections())
<button class="copy-code-btn"></button></code></pre>
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
    </button></h2><p>With the official release of Milvus 2.1, we have prepared a series of blogs introducing the new features. Read more in this blog series:</p>
<ul>
<li><a href="https://milvus.io/blog/2022-08-08-How-to-use-string-data-to-empower-your-similarity-search-applications.md">How to Use String Data to Empower Your Similarity Search Applications</a></li>
<li><a href="https://milvus.io/blog/embedded-milvus.md">Using Embedded Milvus to Instantly Install and Run Milvus with Python</a></li>
<li><a href="https://milvus.io/blog/in-memory-replicas.md">Increase Your Vector Database Read Throughput with In-Memory Replicas</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database.md">Understanding Consistency Level in the Milvus Vector Database</a></li>
<li><a href="https://milvus.io/blog/understanding-consistency-levels-in-the-milvus-vector-database-2.md">Understanding Consistency Level in the Milvus Vector Database (Part II)</a></li>
<li><a href="https://milvus.io/blog/data-security.md">How Does the Milvus Vector Database Ensure Data Security?</a></li>
</ul>
