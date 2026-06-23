---
id: attu-3-0-beta.md
title: >
  Attu 3.0 Beta: Multi-Cluster Management, AI Agent, and a Rebuilt Milvus
  Console
author: Ray Jiang
date: 2026-06-11T00:00:00.000Z
cover: assets.zilliz.com/attu_3_0_beta_md_1_39fd0ca127.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Attu, Milvus, vector database, AI agent, database management'
meta_keywords: >-
  Attu 3.0, Milvus management, Attu AI Agent, multi-cluster Milvus, vector
  database GUI
meta_title: >
  Attu 3.0 Beta: Multi-Cluster Management, AI Agent, and a Rebuilt Milvus
  Console
desc: >
  Attu 3.0 beta rebuilds the Milvus management console with multi-cluster
  management, persistent state, a built-in AI Agent, expert diagnostics, live
  metrics, API debugging, backup and restore, and simplified RBAC workflows.
origin: 'https://milvus.io/blog/attu-3-0-beta.md'
---
<p>Attu 3.0 Beta is now available.</p>
<p><a href="https://github.com/zilliztech/attu"><strong>Attu</strong></a> is the open-source management console for <a href="https://milvus.io"><strong>Milvus</strong></a>. If you have used Milvus locally or in production, you have probably used Attu to inspect collections, browse data, manage schemas, or check what is happening inside a cluster.</p>
<p>Attu 2.x worked well for basic single-cluster management. But as Milvus deployments grew, its limits became more visible. It could only connect to one Milvus instance at a time. Connection state was lost after a container restart. Data browsing was mostly collection-centric. Diagnostics, monitoring, API debugging, backup and restore, and permission management often required separate tools or manual steps.</p>
<p><strong>Attu 3.0 Beta is a full rebuild of the Milvus management experience.</strong></p>
<p>This release adds multi-cluster management, persistent local state, a built-in AI Agent with 50+ Milvus tools, expert diagnostic skills, a redesigned data browser, built-in Prometheus metrics, an API Playground, GUI-based backup and restore, and simplified RBAC workflows.</p>
<p>In short, Attu is no longer just a lightweight viewer for one Milvus instance. It is becoming a practical operations console for developers and teams managing Milvus across local, staging, and production environments.</p>
<h2 id="What-Changed-in-Attu-30-Beta" class="common-anchor-header">What Changed in Attu 3.0 Beta<button data-href="#What-Changed-in-Attu-30-Beta" class="anchor-icon" translate="no">
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
    </button></h2><p>Here is the high-level comparison between Attu 2.x and Attu 3.0 Beta.</p>
<table>
<thead>
<tr><th>Feature</th><th>Attu 2.x</th><th>Attu 3.0 Beta</th></tr>
</thead>
<tbody>
<tr><td>Cluster connections</td><td>Single instance only</td><td>Multiple clusters with one-click switching</td></tr>
<tr><td>State persistence</td><td>Stateless; lost on container restart</td><td>Local database; survives restarts</td></tr>
<tr><td>AI assistance</td><td>None</td><td>Built-in Agent with 50+ Milvus tools</td></tr>
<tr><td>Diagnostics</td><td>Manual investigation</td><td>4 built-in expert-level diagnostic skills</td></tr>
<tr><td>RBAC management</td><td>Separate pages, multi-step flow</td><td>In-context, one-click user creation</td></tr>
<tr><td>Data navigation</td><td>Flat collection list</td><td>Hierarchical tree: database → collection → partition</td></tr>
<tr><td>Monitoring</td><td>External Grafana required</td><td>Built-in Prometheus metrics dashboard</td></tr>
<tr><td>API debugging</td><td>External tools such as curl or Postman</td><td>Built-in REST API Playground</td></tr>
<tr><td>Backup and restore</td><td>CLI only</td><td>GUI with S3, MinIO, GCS, and Azure support</td></tr>
<tr><td>LLM integration</td><td>None</td><td>BYOL: OpenAI, Anthropic, DeepSeek, Gemini, and more</td></tr>
</tbody>
</table>
<h2 id="Manage-Multiple-Milvus-Clusters-From-One-Sidebar" class="common-anchor-header">Manage Multiple Milvus Clusters From One Sidebar<button data-href="#Manage-Multiple-Milvus-Clusters-From-One-Sidebar" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>The biggest day-to-day change is multi-cluster management.</strong> Attu 3.0 can connect to every Milvus instance you run and list them in a single sidebar.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_2_aaf3fddf83.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Image: Attu 3.0 sidebar showing multiple Milvus connections with health indicators</p>
<p>In Attu 2.x, switching from one Milvus cluster to another meant disconnecting, reconnecting, and waiting. If you had separate clusters for development, staging, production, or different business lines, you often ended up with one browser tab per cluster.</p>
<p>Attu 3.0 replaces that flow with a persistent left sidebar. Every Milvus connection is listed in one place, with a live health indicator beside it. A green dot means the cluster is reachable. A red dot means the cluster is down or unavailable.</p>
<p>Switching clusters takes one click. Attu keeps the context for each connection, so you do not need to reconnect every time you move between environments.</p>
<h3 id="Connection-Setup-Is-Less-Fragile" class="common-anchor-header">Connection Setup Is Less Fragile</h3><p>New connections support TLS/SSL encryption, token authentication, and username/password authentication. You can test a connection before saving it, keep connection details locally, and bulk-clear dead connections when old environments are no longer needed.</p>
<p><strong>Each cluster gets its own workspace.</strong> Overview, data browser, user management, metrics, and operations are all scoped to the currently selected cluster. That makes it much harder to confuse staging and production or run an operation in the wrong place.</p>
<p>For anyone managing more than one Milvus instance, this is one of the most important changes in Attu 3.0. It sounds basic, but it removes a large amount of tab switching and reconnect friction from daily Milvus work.</p>
<h2 id="Local-State-Now-Survives-Restarts" class="common-anchor-header">Local State Now Survives Restarts<button data-href="#Local-State-Now-Survives-Restarts" class="anchor-icon" translate="no">
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
    </button></h2><p>Attu 2.x was stateless. If the container restarted, your saved connection information disappeared and you had to rebuild your workspace.</p>
<p><strong>Attu 3.0 adds a local database that persists cluster configs, agent conversation history, custom skills, LLM configuration, and user preferences.</strong></p>
<p>When running Attu with Docker, mount a volume to keep that state:</p>
<pre><code translate="no" class="language-bash">docker run -d --name attu -p 3000:3000 -v attu-data:/data zilliz/attu:v3.0.0-beta.6
<button class="copy-code-btn"></button></code></pre>
<p>With the volume mounted, restarting the container no longer means starting from zero.</p>
<p>This also matters for the new AI Agent. Conversation history, custom skills, and LLM configuration can persist locally, so Attu becomes a console you can keep using over time rather than a temporary UI that resets after each restart.</p>
<h2 id="Use-the-Built-in-AI-Agent-to-Operate-Milvus-in-Natural-Language" class="common-anchor-header">Use the Built-in AI Agent to Operate Milvus in Natural Language<button data-href="#Use-the-Built-in-AI-Agent-to-Operate-Milvus-in-Natural-Language" class="anchor-icon" translate="no">
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
    </button></h2><p>Attu 3.0 includes a built-in AI Agent for Milvus management. This is not a documentation chatbot. <strong>The agent is connected to 50+ Milvus tools, so it can inspect cluster state and execute real operations through Attu.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_3_92689d4337.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Image: The Attu 3.0 AI Agent can call Milvus tools from natural-language requests</p>
<h3 id="50+-Built-in-Tools-Across-Common-Milvus-Workflows" class="common-anchor-header">50+ Built-in Tools Across Common Milvus Workflows</h3><p>The Agent covers everyday operations, diagnostics, permissions, and cluster management. You can ask questions or issue instructions such as:</p>
<table>
<thead>
<tr><th>Scenario</th><th>Example prompts</th></tr>
</thead>
<tbody>
<tr><td>Everyday operations</td><td>“List all my collections.”<br>“Create a collection with id, title, and embedding fields. Use dimension 768 for the embedding field.”<br>“Insert some test data into my_collection.”<br>“Search my_collection for the 10 records most similar to 'artificial intelligence’.”</td></tr>
<tr><td>Ops and diagnostics</td><td>“Is my cluster healthy?”<br>“Why is search so slow?”<br>“Which collections use the most memory?”<br>“Any slow queries recently?”</td></tr>
<tr><td>Permissions</td><td>“Create a read-only user called analyst.”<br>“Grant all privileges to the admin role.”<br>“Check which privileges user zhangsan has.”</td></tr>
<tr><td>Cluster management</td><td>“Show the current Milvus version and config.”<br>“List resource-group usage.”<br>“Compact my_collection for me.”</td></tr>
</tbody>
</table>
<h3 id="Destructive-Actions-Require-Approval" class="common-anchor-header">Destructive Actions Require Approval</h3><p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_4_130d227620.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Image: Destructive or sensitive operations show a confirmation dialog before execution</p>
<p><strong>The agent is designed to be transparent and controllable.</strong> Non-destructive operations, such as listing collections or reading metrics, return results directly.</p>
<p>Destructive or sensitive operations, such as dropping a collection, clearing data, or changing privileges, trigger a confirmation dialog. The dialog lists the exact parameters and waits for approval before the operation runs.</p>
<p>You can also see which tools the agent called, how many tokens it used, and whether any tool call failed. That matters for a database management agent. Users should be able to understand what the agent did, not just see the final answer.</p>
<h2 id="Run-Expert-Diagnostic-Skills-From-the-Console" class="common-anchor-header">Run Expert Diagnostic Skills From the Console<button data-href="#Run-Expert-Diagnostic-Skills-From-the-Console" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>The AI Agent ships with four built-in diagnostic skills.</strong> These are guided workflows for common Milvus troubleshooting scenarios, not generic prompts.</p>
<table>
<thead>
<tr><th>Diagnostic skill</th><th>What it checks</th></tr>
</thead>
<tbody>
<tr><td>Cluster health diagnosis</td><td>Version, node status, per-component health, and key metrics.</td></tr>
<tr><td>Search performance diagnosis</td><td>Index sanity, segment fragmentation, replica balance, and related search-performance signals.</td></tr>
<tr><td>Data write diagnosis</td><td>Slow inserts, lost data checks, flush anomalies, and write-path symptoms.</td></tr>
<tr><td>Configuration audit</td><td>Risky or incorrect settings that may affect stability, performance, or expected behavior.</td></tr>
</tbody>
</table>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_5_306b8464cb.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Image: Attu 3.0 includes built-in diagnostic skills and supports custom skills</p>
<p>You can also create custom skills in natural language. A skill can encode a pre-launch checklist, a data-quality check for a specific collection, or a diagnostic flow your team runs for a known workload.</p>
<p>A custom skill is essentially domain knowledge plus a procedure. Once saved, the agent can reuse it instead of relying on a one-off prompt every time.</p>
<h2 id="Bring-Your-Own-LLM-Provider" class="common-anchor-header">Bring Your Own LLM Provider<button data-href="#Bring-Your-Own-LLM-Provider" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu does not bundle or proxy an LLM service.</strong> You configure your own provider and keep control of the model path.</p>
<p>The supported provider options include OpenAI, Anthropic, DeepSeek, Google Gemini, OpenRouter, and custom OpenAI-compatible endpoints.</p>
<table>
<thead>
<tr><th>Provider</th><th>Example models</th></tr>
</thead>
<tbody>
<tr><td>OpenAI</td><td>GPT-5.5</td></tr>
<tr><td>Anthropic</td><td>Claude Opus 4.8</td></tr>
<tr><td>DeepSeek</td><td>DeepSeek-V4</td></tr>
<tr><td>Google Gemini</td><td>Gemini 3.5</td></tr>
<tr><td>OpenRouter</td><td>Any routed model</td></tr>
<tr><td>Custom endpoint</td><td>Any OpenAI-compatible API</td></tr>
</tbody>
</table>
<p>Your API key is encrypted locally and is not uploaded to an Attu-managed service. That design is important for teams that want AI assistance but still need to control credentials, data flow, and provider choice.</p>
<p>In practice, BYOL makes the agent usable across different environments. One team might use OpenAI. Another might use an Anthropic model. A third might route through an OpenAI-compatible endpoint. Attu does not force a single model provider.</p>
<h2 id="Browse-Milvus-Data-With-a-Database-→-Collection-→-Partition-Tree" class="common-anchor-header">Browse Milvus Data With a Database → Collection → Partition Tree<button data-href="#Browse-Milvus-Data-With-a-Database-→-Collection-→-Partition-Tree" class="anchor-icon" translate="no">
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
    </button></h2><p>Attu 3.0 also redesigns the data browser. Attu 2.x mainly presented a flat collection list. That becomes hard to use once a cluster has multiple databases, dozens of collections, and partitioned data.</p>
<p><strong>The new browser uses a hierarchy that matches how Milvus organizes data: database → collection → partition.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_7_3fe672c16d.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Image: The redesigned data browser uses hierarchical navigation for databases, collections, and partitions</p>
<h3 id="Data-Operations-Are-Closer-to-Where-You-Browse" class="common-anchor-header">Data Operations Are Closer to Where You Browse</h3><p>The data browser keeps the operations users already expect and adds more actions directly in the UI:</p>
<ul>
<li>Drag and drop a collection into another database.</li>
<li>Run vector search by typing text directly, when an embedding model is configured.</li>
<li>Inspect similarity scores and narrow results with facets.</li>
<li>Import and export data in CSV, JSON, and Parquet.</li>
<li>View and edit a collection schema visually, including dynamic-field support.</li>
<li>Create, delete, and inspect partitions and partition stats.</li>
<li>Manage the full collection lifecycle: create, load, release, copy, rename, move across databases, and drop.</li>
</ul>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_8_952fd26c44.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Image: Attu 3.0 data browser with vector search and result inspection</p>
<p>Most of these actions are available through right-click menus or operation panels. For common collection work, you no longer need to jump between UI browsing and command-line operations.</p>
<p>Attu 3.0 is also the product line where UI support for new <a href="https://milvus.io/docs/release_notes.md">Milvus 3.0</a> capabilities, such as snapshots and nullable vectors, will continue to appear as those features mature.</p>
<h2 id="Check-Operations-Metrics-Slow-Queries-Topology-and-Backups-in-One-Place" class="common-anchor-header">Check Operations, Metrics, Slow Queries, Topology, and Backups in One Place<button data-href="#Check-Operations-Metrics-Slow-Queries-Topology-and-Backups-in-One-Place" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 puts more operational information into the console.</strong> The Ops and Monitoring area includes cluster overview, live metrics, slow-query analysis, topology, and backup and restore.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_9_4085e60553.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Image: Attu 3.0 Ops and Monitoring page</p>
<p>The goal is not to replace every observability system a production team already uses. Teams can still use Prometheus, Grafana, logs, alerts, and their existing monitoring stack. The goal is to make common Milvus questions answerable from inside Attu.</p>
<table>
<thead>
<tr><th>Area</th><th>What you can do</th></tr>
</thead>
<tbody>
<tr><td>Visual cluster overview</td><td>View Milvus version, deployment mode, node count, database count, collection count, load status, and quota entities at a glance.</td></tr>
<tr><td>Real-time metrics</td><td>Inspect QPS, insert/delete rates, query latency, cache hit rate, and related Prometheus-backed metrics.</td></tr>
<tr><td>Slow-query analysis</td><td>Inspect slow queries by type, duration, collection, timestamp, source, and related troubleshooting context.</td></tr>
<tr><td>Topology view</td><td>Understand the node topology and the connections between components such as RootCoord, DataCoord, IndexCoord, QueryCoord, and Proxy.</td></tr>
<tr><td>Backup and restore</td><td>Create full or incremental backups against S3, MinIO, GCS, or Azure, and download backup metadata as a ZIP or upload one to restore.</td></tr>
</tbody>
</table>
<p>Backup and restore are especially important because they move a workflow that previously depended on CLI usage into the GUI. That is useful for local testing, staging validation, and teams that want a more visible recovery path.</p>
<h2 id="Debug-Milvus-REST-APIs-With-the-Built-in-API-Playground" class="common-anchor-header">Debug Milvus REST APIs With the Built-in API Playground<button data-href="#Debug-Milvus-REST-APIs-With-the-Built-in-API-Playground" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 adds a REST API Playground for Milvus API development and debugging.</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_10_7630afab16.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Image: Attu 3.0 API Playground</p>
<p>The Playground catalogs Milvus REST endpoints by category. Select a database and collection, and Attu fills in the run context automatically. From there, you can send a request in one click and inspect the response in real time.</p>
<p>This is useful when you want to test an API call without setting up curl commands or a Postman collection. It is also useful for learning how a Milvus feature maps to the REST API, because you can move between the UI context and the request body directly.</p>
<p>For application developers, the API Playground is a debugging surface. For new Milvus users, it is a learning surface. For platform teams, it is a quick way to validate operations before turning them into scripts or application code.</p>
<h2 id="Manage-RBAC-Beside-the-Database-or-Collection" class="common-anchor-header">Manage RBAC Beside the Database or Collection<button data-href="#Manage-RBAC-Beside-the-Database-or-Collection" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 changes how permission workflows feel in the UI.</strong> Instead of treating <a href="https://milvus.io/docs/rbac.md">RBAC</a> as a separate admin task, it brings access control closer to the database and collection tabs where users are already working.</p>
<p>The underlying model is still Milvus RBAC: users, roles, <a href="https://milvus.io/docs/grant_privileges.md">privileges</a>, grants, and revokes. Attu 3.0 simplifies the operating path around that model.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/attu_3_0_beta_md_11_8b431e168c.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Image: In-context user and permission management in Attu 3.0</p>
<h3 id="One-Click-User-Creation-for-Common-Scopes" class="common-anchor-header">One-Click User Creation for Common Scopes</h3><p>In Attu 2.x, opening read-only access to a collection usually involved several steps: create the user, create a role, configure privileges, assign the role to the user, and make sure the scope was correct.</p>
<p><strong>In Attu 3.0, you can open a collection, go to the Users tab, click Create User, choose ReadOnly or ReadWrite, and let Attu complete the workflow.</strong> It creates the user, generates a secure password, creates the matching scoped role, and applies the grant.</p>
<p>The same pattern works at the database level. You can also authorize an existing user to the current collection or revoke access in one click.</p>
<p>This keeps permission management close to the resource being protected. You do not have to jump through several admin pages or remember a role naming convention just to give a teammate scoped access.</p>
<h2 id="What-This-Beta-Means-for-Attu-Users" class="common-anchor-header">What This Beta Means for Attu Users<button data-href="#What-This-Beta-Means-for-Attu-Users" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>Attu 3.0 Beta is the biggest update to the Milvus management console since Attu first shipped.</strong> It is not just a visual refresh. It changes the scope of what Attu can handle.</p>
<p>The main upgrade is that Attu now fits the way many Milvus users actually work: multiple clusters, persistent local settings, more data movement, more access control, more troubleshooting, and more need to understand cluster behavior without switching between tools.</p>
<p>The highlights are:</p>
<ul>
<li>Multi-cluster management with health indicators and one-click switching.</li>
<li>Persistent local state for cluster configs, preferences, LLM config, agent history, and custom skills.</li>
<li>A built-in AI Agent with 50+ Milvus tools and confirmation gates for destructive actions.</li>
<li>Four built-in expert diagnostic skills for cluster health, search performance, data writes, and configuration review.</li>
<li>A redesigned data browser with database → collection → partition navigation and richer collection operations.</li>
<li>Built-in Prometheus metrics, slow-query analysis, topology, and backup and restore.</li>
<li>A REST API Playground for debugging and learning Milvus APIs.</li>
<li>RBAC workflows that happen beside the database or collection, not only in a separate admin flow.</li>
</ul>
<p>If you use Attu only for local Milvus development, 3.0 gives you a more capable console. If you manage several Milvus environments, the multi-cluster and persistent-state changes alone are worth trying. If you often debug performance or permission issues, the Agent, diagnostics, metrics, and in-context RBAC workflows should save time immediately.</p>
<h2 id="Get-Started" class="common-anchor-header">Get Started<button data-href="#Get-Started" class="anchor-icon" translate="no">
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
    </button></h2><p>Try Attu 3.0 Beta with Docker:</p>
<pre><code translate="no" class="language-bash">docker run -d --name attu -p 3000:3000 -v attu-data:/data zilliz/attu:v3.0.0-beta.6
<button class="copy-code-btn"></button></code></pre>
<p>Then open:</p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//localhost:3000</span>
<button class="copy-code-btn"></button></code></pre>
<p>Add your Milvus connection from the sidebar and start exploring the new console.</p>
<p>Prefer a desktop app? Download the build for your platform from <a href="https://github.com/zilliztech/attu/releases"><strong>GitHub Releases</strong></a>. Attu 3.0 Beta provides desktop packages for macOS, Linux, and Windows. Recent releases also include a standalone Linux server package for running Attu without Docker or Electron.</p>
<p><strong>Have questions?</strong> Bring your multi-cluster setup, custom agent skills, or diagnostic scenario to the <a href="https://discord.gg/milvus"><strong>Milvus Discord</strong></a>, or book <a href="https://meetings.hubspot.com/chloe-williams1/milvus-meeting?uuid=8d218acf-a841-4869-8330-91daff5e8a02"><strong>Milvus Office Hours</strong></a> to work through it with the community.</p>
<p><strong>Don’t want to operate Milvus infrastructure yourself?</strong> <a href="https://cloud.zilliz.com/signup"><strong>Zilliz Cloud</strong></a> is the fully managed platform from the creators of Milvus. It keeps the Milvus API and adds managed infrastructure for real-time vector search, large-scale discovery, and AI data operations. For teams with data-sovereignty requirements, Zilliz Cloud <strong>BYOC</strong> runs inside your own cloud account so data stays in your VPC while Zilliz handles operations.</p>
