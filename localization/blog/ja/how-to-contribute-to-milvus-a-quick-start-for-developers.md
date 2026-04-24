---
id: how-to-contribute-to-milvus-a-quick-start-for-developers.md
title: 'How to Contribute to Milvus: A Quick Start for Developers'
author: Shaoting Huang
date: 2024-12-01T00:00:00.000Z
cover: assets.zilliz.com/How_to_Contribute_to_Milvus_91e1432163.png
tag: Engineering
tags: >-
  Milvus, contribute to open-source projects, vector databases, Contribute to
  Milvus
recommend: true
canonicalUrl: >-
  https://milvus.io/blog/how-to-contribute-to-milvus-a-quick-start-for-developers.md
---
<p><a href="https://github.com/milvus-io/milvus"><strong>Milvus</strong></a> is an open-source <a href="https://zilliz.com/learn/what-is-vector-database">vector database</a> designed to manage high-dimensional vector data. Whether you’re building intelligent search engines, recommendation systems, or next-gen AI solutions such as retrieval augmented generation (<a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a>), Milvus is a powerful tool at your fingertips.</p>
<p>But what truly drives Milvus forward isn’t just its advanced technology—it’s the vibrant, passionate <a href="https://zilliz.com/community">developer community</a> behind it. As an open-source project, Milvus thrives and evolves thanks to the contributions of developers like you. Every bug fix, feature addition, and performance enhancement from the community makes Milvus faster, more scalable, and more reliable.</p>
<p>Whether you’re passionate about open-source, eager to learn, or want to make a lasting impact in AI, Milvus is the perfect place to contribute. This guide will walk you through the process—from setting up your development environment to submitting your first pull request. We’ll also highlight common challenges you might face and provide solutions to overcome them.</p>
<p>Ready to dive in? Let’s make Milvus even better together!</p>
<h2 id="Setting-Up-Your-Milvus-Development-Environment" class="common-anchor-header">Setting Up Your Milvus Development Environment<button data-href="#Setting-Up-Your-Milvus-Development-Environment" class="anchor-icon" translate="no">
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
    </button></h2><p>First thing first: setting up your development environment. You can either install Milvus on your local machine or use Docker—both methods are straightforward, but you’ll also need to install a few third-party dependencies to get everything running.</p>
<h3 id="Building-Milvus-Locally" class="common-anchor-header">Building Milvus Locally</h3><p>If you like building things from scratch, building Milvus on your local machine is a breeze. Milvus makes it easy by bundling all the dependencies in the <code translate="no">install_deps.sh</code> script. Here’s the quick setup:</p>
<pre><code translate="no"><span class="hljs-comment"># Install third-party dependencies.</span>
$ <span class="hljs-built_in">cd</span> milvus/
$ ./scripts/install_deps.sh

<span class="hljs-comment"># Compile Milvus.</span>
$ make
<button class="copy-code-btn"></button></code></pre>
<h3 id="Building-Milvus-with-Docker" class="common-anchor-header">Building Milvus with Docker</h3><p>If you prefer Docker, there are two ways to go about it: you can either run commands in a pre-built container or spin up a dev container for a more hands-on approach.</p>
<pre><code translate="no"><span class="hljs-comment"># Option 1: Run commands in a pre-built Docker container  </span>
build/builder.sh make  

<span class="hljs-comment"># Option 2: Spin up a dev container  </span>
./scripts/devcontainer.sh up  
docker-compose -f docker-compose-devcontainer.yml ps  
docker <span class="hljs-built_in">exec</span> -ti milvus-builder-<span class="hljs-number">1</span> bash  
make milvus  
<button class="copy-code-btn"></button></code></pre>
<p><strong>Platform Notes:</strong> If you’re on Linux, you’re good to go—compilation issues are pretty rare. However, Mac users, especially with M1 chips, might run into some bumps along the way. Don’t sweat it, though—we have a guide to help you work through the most common issues.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Figure_OS_configuration_52092fb1b7.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><em>Figure: OS configuration</em></p>
<p>For the full setup guide, check out the official <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md">Milvus Development Guide</a>.</p>
<h3 id="Common-Issues-and-How-to-Fix-Them" class="common-anchor-header">Common Issues and How to Fix Them</h3><p>Sometimes, setting up your Milvus development environment doesn’t go as smoothly as planned. Don’t worry—here’s a quick rundown of common issues you might hit and how to fix them fast.</p>
<h4 id="Homebrew-Unexpected-Disconnect-While-Reading-Sideband-Packet" class="common-anchor-header">Homebrew: Unexpected Disconnect While Reading Sideband Packet</h4><p>If you’re using Homebrew and see an error like this:</p>
<pre><code translate="no">==&gt; Tapping homebrew/core
remote: Enumerating objects: 1107077, <span class="hljs-keyword">done</span>.
remote: Counting objects: 100% (228/228), <span class="hljs-keyword">done</span>.
remote: Compressing objects: 100% (157/157), <span class="hljs-keyword">done</span>.
error: 545 bytes of body are still expected.44 MiB | 341.00 KiB/s
fetch-pack: unexpected disconnect <span class="hljs-keyword">while</span> reading sideband packet
fatal: early EOF
fatal: index-pack failed
Failed during: git fetch --force origin refs/heads/master:refs/remotes/origin/master
myuser~ %
<button class="copy-code-btn"></button></code></pre>
<p><strong>Fix:</strong> Increase the <code translate="no">http.postBuffer</code> size:</p>
<pre><code translate="no">git config --<span class="hljs-variable language_">global</span> http.<span class="hljs-property">postBuffer</span> 1M
<button class="copy-code-btn"></button></code></pre>
<p>If you also run into <code translate="no">Brew: command not found</code> after installing Homebrew, you might need to set up your Git user configuration:</p>
<pre><code translate="no">git config --<span class="hljs-variable language_">global</span> user.<span class="hljs-property">email</span> xxxgit config --<span class="hljs-variable language_">global</span> user.<span class="hljs-property">name</span> xxx
<button class="copy-code-btn"></button></code></pre>
<h4 id="Docker-Error-Getting-Credentials" class="common-anchor-header">Docker: Error Getting Credentials</h4><p>When working with Docker, you might see this:</p>
<pre><code translate="no"><span class="hljs-type">error</span> getting credentials - err: exit status <span class="hljs-number">1</span>, out: <span class="hljs-string">``</span>  
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Docker_Error_Getting_Credentials_797f3043fb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Fix:</strong> Open<code translate="no">~/.docker/config.json</code> and remove the <code translate="no">credsStore</code> field.</p>
<h4 id="Python-No-Module-Named-imp" class="common-anchor-header">Python: No Module Named ‘imp’</h4><p>If Python throws this error, it’s because Python 3.12 removed the <code translate="no">imp</code> module, which some older dependencies still use.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Python_No_Module_Named_imp_65eb2c5c66.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Fix:</strong> Downgrade to Python 3.11:</p>
<pre><code translate="no">brew install python@3.11  
<button class="copy-code-btn"></button></code></pre>
<h4 id="Conan-Unrecognized-Arguments-or-Command-Not-Found" class="common-anchor-header">Conan: Unrecognized Arguments or Command Not Found</h4><p><strong>Issue:</strong> If you see <code translate="no">Unrecognized arguments: --install-folder conan</code>, you’re likely using an incompatible Conan version.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/Conan_Unrecognized_Arguments_or_Command_Not_Found_8f2029db72.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Fix:</strong> Downgrade to Conan 1.61:</p>
<pre><code translate="no">pip install conan==1.61  
<button class="copy-code-btn"></button></code></pre>
<p><strong>Issue:</strong> If you see <code translate="no">Conan command not found</code>, it means your Python environment isn’t properly set up.</p>
<p><strong>Fix:</strong> Add Python’s bin directory to your <code translate="no">PATH</code>:</p>
<pre><code translate="no"><span class="hljs-built_in">export</span> PATH=<span class="hljs-string">&quot;/path/to/python/bin:<span class="hljs-variable">$PATH</span>&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<h4 id="LLVM-Use-of-Undeclared-Identifier-kSecFormatOpenSSL" class="common-anchor-header">LLVM: Use of Undeclared Identifier ‘kSecFormatOpenSSL’</h4><p>This error usually means your LLVM dependencies are outdated.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/LLVM_Use_of_Undeclared_Identifier_k_Sec_Format_Open_SSL_f0ca6f0166.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>Fix:</strong> Reinstall LLVM 15 and update your environment variables:</p>
<pre><code translate="no">brew reinstall llvm@<span class="hljs-number">15</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">LDFLAGS</span>=<span class="hljs-string">&quot;-L/opt/homebrew/opt/llvm@15/lib&quot;</span>
<span class="hljs-keyword">export</span> <span class="hljs-variable constant_">CPPFLAGS</span>=<span class="hljs-string">&quot;-I/opt/homebrew/opt/llvm@15/include&quot;</span>
<button class="copy-code-btn"></button></code></pre>
<p><strong>Pro Tips</strong></p>
<ul>
<li><p>Always double-check your tool versions and dependencies.</p></li>
<li><p>If something still doesn’t work, the<a href="https://github.com/milvus-io/milvus/issues"> Milvus GitHub Issues page</a> is a great place to find answers or ask for help.</p></li>
</ul>
<h3 id="Configuring-VS-Code-for-C++-and-Go-Integration" class="common-anchor-header">Configuring VS Code for C++ and Go Integration</h3><p>Getting C++ and Go to work together in VS Code is easier than it sounds. With the right setup, you can streamline your development process for Milvus. Just tweak your <code translate="no">user.settings</code> file with the configuration below:</p>
<pre><code translate="no">{
   <span class="hljs-string">&quot;go.toolsEnvVars&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.testEnvVars&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.buildFlags&quot;</span>: [
       <span class="hljs-string">&quot;-ldflags=-r /Users/zilliz/workspace/milvus/internal/core/output/lib&quot;</span>
   ],
   <span class="hljs-string">&quot;terminal.integrated.env.linux&quot;</span>: {
       <span class="hljs-string">&quot;PKG_CONFIG_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib/pkgconfig:/Users/zilliz/workspace/milvus/internal/core/output/lib64/pkgconfig&quot;</span>,
       <span class="hljs-string">&quot;LD_LIBRARY_PATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>,
       <span class="hljs-string">&quot;RPATH&quot;</span>: <span class="hljs-string">&quot;/Users/zilliz/workspace/milvus/internal/core/output/lib:/Users/zilliz/workspace/milvus/internal/core/output/lib64&quot;</span>
   },
   <span class="hljs-string">&quot;go.useLanguageServer&quot;</span>: <span class="hljs-literal">true</span>,
   <span class="hljs-string">&quot;gopls&quot;</span>: {
       <span class="hljs-string">&quot;formatting.gofumpt&quot;</span>: <span class="hljs-literal">true</span>
   },
   <span class="hljs-string">&quot;go.formatTool&quot;</span>: <span class="hljs-string">&quot;gofumpt&quot;</span>,
   <span class="hljs-string">&quot;go.lintTool&quot;</span>: <span class="hljs-string">&quot;golangci-lint&quot;</span>,
   <span class="hljs-string">&quot;go.testTags&quot;</span>: <span class="hljs-string">&quot;dynamic&quot;</span>,
   <span class="hljs-string">&quot;go.testTimeout&quot;</span>: <span class="hljs-string">&quot;10m&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<p>Here’s what this configuration does:</p>
<ul>
<li><p><strong>Environment Variables:</strong> Sets up paths for <code translate="no">PKG_CONFIG_PATH</code>, <code translate="no">LD_LIBRARY_PATH</code>, and <code translate="no">RPATH</code>, which are critical for locating libraries during builds and tests.</p></li>
<li><p><strong>Go Tools Integration:</strong> Enables Go’s language server (<code translate="no">gopls</code>) and configures tools like <code translate="no">gofumpt</code> for formatting and <code translate="no">golangci-lint</code> for linting.</p></li>
<li><p><strong>Testing Setup:</strong> Adds <code translate="no">testTags</code> and increases the timeout for running tests to 10 minutes.</p></li>
</ul>
<p>Once added, this setup ensures a seamless integration between C++ and Go workflows. It’s perfect for building and testing Milvus without constant environment tweaking.</p>
<p><strong>Pro Tip</strong></p>
<p>After setting this up, run a quick test build to confirm everything works. If something feels off, double-check the paths and VS Code’s Go extension version.</p>
<h2 id="Deploying-Milvus" class="common-anchor-header">Deploying Milvus<button data-href="#Deploying-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus supports <a href="https://milvus.io/docs/install-overview.md">three deployment modes</a>—<strong>Lite, Standalone,</strong> and <strong>Distributed.</strong></p>
<ul>
<li><p><a href="https://milvus.io/blog/introducing-milvus-lite.md"><strong>Milvus Lite</strong></a> is a Python library and an ultra-lightweight version of Milvus. It’s perfect for rapid prototyping in Python or notebook environments and for small-scale local experiments.</p></li>
<li><p><strong>Milvus Standalone</strong> is the single-node deployment option for Milvus, using a client-server model. It is the Milvus equivalent of MySQL, while Milvus Lite is like SQLite.</p></li>
<li><p><strong>Milvus Distributed</strong> is the distributed mode of Milvus, which is ideal for enterprise users building large-scale vector database systems or vector data platforms.</p></li>
</ul>
<p>All these deployments rely on three core components:</p>
<ul>
<li><p><strong>Milvus:</strong> The vector database engine that drives all operations.</p></li>
<li><p><strong>Etcd:</strong> The metadata engine that manages Milvus’s internal metadata.</p></li>
<li><p><strong>MinIO:</strong> The storage engine that ensures data persistence.</p></li>
</ul>
<p>When running in <strong>Distributed</strong> mode, Milvus also incorporates <strong>Pulsar</strong> for distributed message processing using a Pub/Sub mechanism, making it scalable for high-throughput environments.</p>
<h3 id="Milvus-Standalone" class="common-anchor-header">Milvus Standalone</h3><p>The Standalone mode is tailored for single-instance setups, making it perfect for testing and small-scale applications. Here’s how to get started:</p>
<pre><code translate="no"><span class="hljs-comment"># Deploy Milvus Standalone  </span>
<span class="hljs-built_in">sudo</span> docker-compose -f deployments/docker/dev/docker-compose.yml up -d
<span class="hljs-comment"># Start the standalone service  </span>
bash ./scripts/start_standalone.sh
<button class="copy-code-btn"></button></code></pre>
<h3 id="Milvus-Distributed-previously-known-as-Milvus-Cluster" class="common-anchor-header">Milvus Distributed (previously known as Milvus Cluster)</h3><p>For larger datasets and higher traffic, the Distributed mode offers horizontal scalability. It combines multiple Milvus instances into a single cohesive system. Deployment is made easy with the <strong>Milvus Operator</strong>, which runs on Kubernetes and manages the entire Milvus stack for you.</p>
<p>Want step-by-step guidance? Check out the <a href="https://milvus.io/docs/install_cluster-milvusoperator.md">Milvus Installation Guide</a>.</p>
<h2 id="Running-End-to-End-E2E-Tests" class="common-anchor-header">Running End-to-End (E2E) Tests<button data-href="#Running-End-to-End-E2E-Tests" class="anchor-icon" translate="no">
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
    </button></h2><p>Once your Milvus deployment is up and running, testing its functionality is a breeze with E2E tests. These tests cover every part of your setup to ensure everything works as expected. Here’s how to run them:</p>
<pre><code translate="no"><span class="hljs-comment"># Navigate to the test directory  </span>
<span class="hljs-built_in">cd</span> tests/python_client  

<span class="hljs-comment"># Install dependencies  </span>
pip install -r requirements.txt  

<span class="hljs-comment"># Run E2E tests  </span>
pytest --tags=L0 -n auto  
<button class="copy-code-btn"></button></code></pre>
<p>For in-depth instructions and troubleshooting tips, refer to the <a href="https://github.com/milvus-io/milvus/blob/master/DEVELOPMENT.md#e2e-tests">Milvus Development Guide</a>.</p>
<p><strong>Pro Tip</strong></p>
<p>If you’re new to Milvus, start with Milvus Lite or Standalone mode to get a feel for its capabilities before scaling up to Distributed mode for production-level workloads.</p>
<h2 id="Submitting-Your-Code" class="common-anchor-header">Submitting Your Code<button data-href="#Submitting-Your-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Congrats! You’ve cleared all unit and E2E tests (or debugged and recompiled as needed). While the first build can take some time, future ones will be much faster—so no need to worry. With everything passing, you’re ready to submit your changes and contribute to Milvus!</p>
<h3 id="Link-Your-Pull-Request-PR-to-an-Issue" class="common-anchor-header">Link Your Pull Request (PR) to an Issue</h3><p>Every PR to Milvus needs to be tied to a relevant issue. Here’s how to handle this:</p>
<ul>
<li><p><strong>Check for Existing Issues:</strong> Look through the<a href="https://github.com/milvus-io/milvus/issues"> Milvus issue tracker</a> to see if there’s already an issue related to your changes.</p></li>
<li><p><strong>Create a New Issue:</strong> If no relevant issue exists, open a new one and explain the problem you’re solving or the feature you’re adding.</p></li>
</ul>
<h3 id="Submitting-Your-Code" class="common-anchor-header">Submitting Your Code</h3><ol>
<li><p><strong>Fork the Repository:</strong> Start by forking the<a href="https://github.com/milvus-io/milvus"> Milvus repo</a> to your GitHub account.</p></li>
<li><p><strong>Create a Branch:</strong> Clone your fork locally and make a new branch for your changes.</p></li>
<li><p><strong>Commit with Signed-off-by Signature:</strong> Ensure your commits include a <code translate="no">Signed-off-by</code> signature to comply with open-source licensing:</p></li>
</ol>
<pre><code translate="no">git commit -m <span class="hljs-string">&quot;Commit of your change&quot;</span> -s
<button class="copy-code-btn"></button></code></pre>
<p>This step certifies your contribution is in line with the Developer Certificate of Origin (DCO).</p>
<h4 id="Helpful-Resources" class="common-anchor-header"><strong>Helpful Resources</strong></h4><p>For detailed steps and best practices, check out the<a href="https://github.com/milvus-io/milvus/blob/master/CONTRIBUTING.md"> Milvus Contribution Guide</a>.</p>
<h2 id="Opportunities-to-Contribute" class="common-anchor-header">Opportunities to Contribute<button data-href="#Opportunities-to-Contribute" class="anchor-icon" translate="no">
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
    </button></h2><p>Congrats—you’ve got Milvus up and running! You’ve explored its deployment modes, run your tests, and maybe even dug into the code. Now it’s time to level up: contribute to <a href="https://github.com/milvus-io/milvus">Milvus</a> and help shape the future of AI and <a href="https://zilliz.com/learn/introduction-to-unstructured-data">unstructured data</a>.</p>
<p>No matter your skillset, there’s a place for you in the Milvus community! Whether you’re a developer who loves solving complex challenges, a tech writer who loves writing clean documentation or engineering blogs, or a Kubernetes enthusiast looking to improve deployments, there’s a way for you to make an impact.</p>
<p>Take a look at the opportunities below and find your perfect match. Every contribution helps move Milvus forward—and who knows? Your next pull request might just power the next wave of innovation. So, what are you waiting for? Let’s get started! 🚀</p>
<table>
<thead>
<tr><th>Projects</th><th>Suitable for</th><th>Guidelines</th></tr>
</thead>
<tbody>
<tr><td><a href="https://github.com/milvus-io/milvus">milvus</a>, <a href="https://github.com/milvus-io/milvus-sdk-go">milvus-sdk-go</a></td><td>Go developers</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus">milvus</a>, <a href="https://github.com/milvus-io/knowhere">knowhere</a></td><td>CPP developers</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/pymilvus">pymilvus</a>, <a href="https://github.com/milvus-io/milvus-sdk-node">milvus-sdk-node</a>, <a href="https://github.com/milvus-io/milvus-sdk-java">milvus-sdk-java</a></td><td>Developers interested in other languages</td><td><a href="https://github.com/milvus-io/pymilvus/blob/master/CONTRIBUTING.md">Contributing to PyMilvus</a></td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus-helm">milvus-helm</a></td><td>Kubernetes enthusiasts</td><td>/</td></tr>
<tr><td><a href="https://github.com/milvus-io/milvus-docs">Milvus-docs</a>, <a href="https://github.com/milvus-io/community">milvus-io/community/blog</a></td><td>Tech writers</td><td><a href="https://github.com/milvus-io/milvus-docs/blob/v2.0.0/CONTRIBUTING.md">Contributing to milvus docs</a></td></tr>
<tr><td><a href="https://github.com/zilliztech/milvus-insight">milvus-insight</a></td><td>Web developers</td><td>/</td></tr>
</tbody>
</table>
<h2 id="A-Final-Word" class="common-anchor-header">A Final Word<button data-href="#A-Final-Word" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus offers various SDKs—<a href="https://milvus.io/docs/install-pymilvus.md">Python</a> (PyMilvus), <a href="https://milvus.io/docs/install-java.md">Java</a>, <a href="https://milvus.io/docs/install-go.md">Go</a>, and <a href="https://milvus.io/docs/install-node.md">Node.js</a>—that make it simple to start building. Contributing to Milvus isn’t just about code—it’s about joining a vibrant and innovative community.</p>
<p>🚀Welcome to the Milvus developer community, and happy coding! We can’t wait to see what you’ll create.</p>
<h2 id="Further-Reading" class="common-anchor-header">Further Reading<button data-href="#Further-Reading" class="anchor-icon" translate="no">
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
<li><p><a href="https://zilliz.com/community">Join the Milvus Community of AI Developers</a></p></li>
<li><p><a href="https://zilliz.com/learn/what-is-vector-database">What are Vector Databases and How Do They Work?</a></p></li>
<li><p><a href="https://zilliz.com/blog/choose-the-right-milvus-deployment-mode-ai-applications">Milvus Lite vs. Standalone vs. Distributed: Which Mode is Right for You? </a></p></li>
<li><p><a href="https://zilliz.com/learn/milvus-notebooks">Build AI Apps with Milvus: Tutorials &amp; Notebooks</a></p></li>
<li><p><a href="https://zilliz.com/ai-models">Top Performing AI Models for Your GenAI Apps | Zilliz</a></p></li>
<li><p><a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">What is RAG?</a></p></li>
<li><p><a href="https://zilliz.com/learn/generative-ai">Generative AI Resource Hub | Zilliz</a></p></li>
</ul>
