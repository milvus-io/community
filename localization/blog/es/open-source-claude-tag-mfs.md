---
id: open-source-claude-tag-mfs.md
title: 'Open Tag: una etiqueta Claude de código abierto para Claude Code y Codex'
author: Cheney Zhang
date: 2026-07-02T00:00:00.000Z
cover: assets.zilliz.com/open_source_claude_tag_mfs_md_1_3b8acc2927.png
tag: Engineering
recommend: false
publishToMedium: true
tags: 'AI agents, agent memory, MFS, vector database, Milvus'
meta_keywords: >-
  Claude Tag, open-source Claude Tag, Open Tag, MFS, agent memory, context
  retrieval, Claude Code, Codex, vector search, RAG
meta_title: |
  Open Tag: An Open-Source Claude Tag on MFS
desc: >-
  Un Claude Tag de código abierto y nativo de Slack para Claude Code y Codex,
  construido sobre MFS: una única interfaz con búsqueda y navegación para tu
  código, documentación, tickets y bases de datos.
origin: 'https://milvus.io/blog/open-source-claude-tag-mfs.md'
---
<p>A couple of days ago, Anthropic released <a href="https://www.anthropic.com/news/introducing-claude-tag">Claude Tag</a>: a persistent Claude that lives in Slack.</p>
<p>The pattern is immediately useful. You tag Claude in the channel where the work is happening. It reads the thread, picks up the context, and responds in place, more like a teammate than a separate chat window.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/open_source_claude_tag_mfs_md_2_570330a031.png" alt="Claude posting in a Slack channel" class="doc-image" id="claude-posting-in-a-slack-channel" />
    <span>Claude posting in a Slack channel</span>
  </span>
</p>
<p>However, Claude Tag is currently limited to Claude Enterprise and Team customers. Individual users do not get it. Codex users and many others are also outside the loop.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/open_source_claude_tag_mfs_md_3_2ff8a8ff98.png" alt="Anthropic's announcement, "available today in beta for Claude Enterprise and Team customers"" class="doc-image" id="anthropic's-announcement,-"available-today-in-beta-for-claude-enterprise-and-team-customers"" />
    <span>Anthropic's announcement, "available today in beta for Claude Enterprise and Team customers"</span>
  </span>
</p>
<p>That timing was interesting for us because we had spent the last six months building <a href="https://github.com/zilliztech/mfs"><strong>MFS</strong></a>, short for <strong>Multi-source File-like Search</strong>. MFS is a context harness for agents: it takes scattered context across code, docs, tickets, chat, databases, SaaS tools, and object stores, and exposes it through one searchable, browsable, file-like interface.</p>
<p>So we used MFS to build an open-source version of the Claude Tag pattern.</p>
<p>We call it <a href="https://github.com/zilliztech/mfs/tree/main/examples/open-tag-skill"><strong>Open Tag</strong></a>.</p>
<p>With Open Tag, you can mention @OpenClaude in Slack. If you are using Codex, the same pattern works as @OpenCodex. The bot reads the current thread, pulls in the context you have authorized, asks the backend agent to do the work, and posts the result back to Slack.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/open_source_claude_tag_mfs_md_4_aa7de866f2.png" alt="the OpenTag GitHub README" class="doc-image" id="the-opentag-github-readme" />
    <span>the OpenTag GitHub README</span>
  </span>
</p>
<p>Open Tag is the open-source implementation we built on top of MFS.</p>
<p>In our own test, Open Tag reviewed a live PR in about three minutes. In a small code-search benchmark, the MFS retrieval loop cut token use from 962 tokens to 460 tokens on average, while improving the final correct-file result from 22/24 to 23/24. More on the benchmark below.</p>
<p>The important part is this: Open Tag is not just a Slack bot. The Slack bot is the easy piece. The hard part is memory and tools — giving an agent a reliable way to find, verify, and use context across many systems without dumping everything into the prompt.</p>
<p>That is what MFS provides.</p>
<h2 id="Open-Tag-in-Action" class="common-anchor-header">Open Tag in Action<button data-href="#Open-Tag-in-Action" class="anchor-icon" translate="no">
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
    </button></h2><p>Before getting into the architecture, here is what Open Tag looks like in use.</p>
<h3 id="1-Install-and-configure-Open-Tag-locally" class="common-anchor-header">1. Install and configure Open Tag locally</h3><p>Open Tag ships with an open-tag-admin skill. Because it lives under the examples/ directory in the MFS repo, install it with --full-depth:</p>
<p>npx skills add zilliztech/mfs --full-depth --skill open-tag-admin -a claude-code -a codex -g</p>
<p>You call the skill from Claude Code or Codex, and the agent walks you through the local setup: credentials, environment variables, MFS connection, preflight checks, and launch.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/open_source_claude_tag_mfs_md_5_b951eecd54.gif" alt="Agent-guided local install and configuration" class="doc-image" id="agent-guided-local-install-and-configuration" />
    <span>Agent-guided local install and configuration</span>
  </span>
</p>
<p>The setup flow is intentionally agent-driven. You do not need to memorize every command before trying it. You tell the agent what you want to run, and the skill handles the setup path.</p>
<p>For example:</p>
<pre><code translate="no">I want to run an Open Tag bot but I don&#x27;t have any Slack credentials yet.
Walk me through creating the Slack app, turning on Socket Mode, and getting the bot and app tokens.
Tell me which scopes to add and where each token goes.
<button class="copy-code-btn"></button></code></pre>
<p>Or, if you already have credentials:</p>
<pre><code translate="no"><span class="hljs-title class_">Set</span> up an <span class="hljs-title class_">Open</span> <span class="hljs-title class_">Tag</span> bot <span class="hljs-keyword">using</span> the <span class="hljs-title class_">Claude</span> backend, listening <span class="hljs-keyword">in</span> my <span class="hljs-title class_">Slack</span> channel.
<span class="hljs-title class_">The</span> <span class="hljs-title class_">Slack</span> tokens are already <span class="hljs-keyword">in</span> my environment.
<span class="hljs-title class_">Run</span> the preflight checks, then start the bridge once everything looks good.
<button class="copy-code-btn"></button></code></pre>
<h3 id="2-Review-a-real-PR-with-Open-Tag" class="common-anchor-header">2. Review a real PR with Open Tag</h3><p>For a simple demo, I created a Slack bot called OpenClaude, invited it into a Slack channel, and mentioned it in a thread.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/open_source_claude_tag_mfs_md_6_c0308d27f9.png" alt="Adding the OpenClaude app to a Slack workspace." class="doc-image" id="adding-the-openclaude-app-to-a-slack-workspace." />
    <span>Adding the OpenClaude app to a Slack workspace.</span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/open_source_claude_tag_mfs_md_7_d6808c1604.png" alt="Adding the OpenClaude app to a Slack workspace." class="doc-image" id="adding-the-openclaude-app-to-a-slack-workspace." />
    <span>Adding the OpenClaude app to a Slack workspace.</span>
  </span>
</p>
<p>Then I gave Open Tag a real engineering task:</p>
<p><em>Review the latest PR and Issue in my open-source project memsearch and give me a professional opinion.</em></p>
<p>About three minutes later, Open Tag came back with a detailed review and concrete suggestions. From there, I could keep the workflow going and ask it to take the next step, such as merging the PR after review.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/open_source_claude_tag_mfs_md_8_2be671b2b8.gif" alt="Open Tag reviewing a PR and returning suggestions in Slack.
" class="doc-image" id="open-tag-reviewing-a-pr-and-returning-suggestions-in-slack.-" />
    <span>Open Tag reviewing a PR and returning suggestions in Slack.
</span>
  </span>
</p>
<p>This is only a GitHub demo. At configuration time, you can connect other sources as well: repos, docs, tickets, Slack history, databases, object stores, and more. The broader the authorized context, the more useful the Slack agent becomes.</p>
<p>The full example lives in the <a href="https://github.com/zilliztech/mfs/tree/main/examples/open-tag-skill">Open Tag demo</a> in the MFS repo.</p>
<p>One caveat: this is a local demo. The reference example does not yet implement strict sandbox isolation or production-grade permission management. Before deploying a system like this in production, you should understand the runtime, the credentials, the data scopes, and the security boundary.</p>
<h2 id="What-We-Actually-Rebuilt" class="common-anchor-header">What We Actually Rebuilt<button data-href="#What-We-Actually-Rebuilt" class="anchor-icon" translate="no">
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
    </button></h2><p>A Claude Tag-style system has three pieces:</p>
<ul>
<li><strong>Brain:</strong> the model or coding agent that reasons and plans.</li>
<li><strong>Memory:</strong> the persistent context the agent can recall over time.</li>
<li><strong>Tools:</strong> the external systems the agent can read from or act on.</li>
</ul>
<p>For Open Tag, the brain is not the hard part. You can mount Claude Code or Codex.</p>
<p>The Slack shell is not the hard part either. Listen for app_mention, read the thread, pass the task to the backend, and post the response. That adapter is a few hundred lines of glue code.</p>
<p><strong>The hard part is the combination of memory and tools.</strong></p>
<p>A useful Slack agent cannot rely only on the current thread. Work context is scattered across GitHub PRs, issues, design docs, tickets, Slack history, database rows, object stores, PDFs, and internal notes. The agent needs to reach those systems, find the relevant slice, verify the original source, and then answer or act.</p>
<p>It also cannot solve the problem by loading everything into the prompt. That is slow, expensive, and noisy. It gets worse as the number of sources grows.</p>
<p>So the real engineering problem is:</p>
<p><strong>How do you let an agent search across many isolated systems in real time, retrieve the right context, cite the source, and keep token cost low?</strong></p>
<p><strong>Open Tag uses MFS for that layer.</strong></p>
<p>In this architecture, Open Tag is the Slack-facing adapter. MFS is the memory and tools engine behind it.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/open_source_claude_tag_mfs_md_9_e9b70458c0.png" alt="MFS overview — context sources to connectors to mfs-server to agent-native retrieval and browse" class="doc-image" id="mfs-overview-—-context-sources-to-connectors-to-mfs-server-to-agent-native-retrieval-and-browse" />
    <span>MFS overview — context sources to connectors to mfs-server to agent-native retrieval and browse</span>
  </span>
</p>
<h2 id="MFS-The-Memory-and-Tools-Layer-Behind-Open-Tag" class="common-anchor-header">MFS: The Memory and Tools Layer Behind Open Tag<button data-href="#MFS-The-Memory-and-Tools-Layer-Behind-Open-Tag" class="anchor-icon" translate="no">
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
    </button></h2><p>MFS stands for <strong>Multi-source File-like Search</strong>.</p>
<p>The design is based on two engineering decisions:</p>
<ol>
<li>Expose every source through a stable, file-like URI interface.</li>
<li>Combine search and browse instead of treating them as competing retrieval strategies.</li>
</ol>
<p>The first decision gives the agent one way to reach many systems. The second gives it a low-token way to find and verify context.</p>
<p>Together, they turn scattered enterprise context into something an agent can traverse.</p>
<h2 id="1-One-URI-Interface-Across-Heterogeneous-Sources" class="common-anchor-header">1. One URI Interface Across Heterogeneous Sources<button data-href="#1-One-URI-Interface-Across-Heterogeneous-Sources" class="anchor-icon" translate="no">
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
    </button></h2><p>Agents are good at shell workflows.</p>
<p>tree, ls, cat, grep, and search are compact and predictable. They give the model a small action space with dense information. But those commands assume a filesystem-like structure.</p>
<p>Most useful work context is not in a filesystem. It is in GitHub, Slack, Jira, Linear, Notion, Postgres, S3, Google Drive, Gmail, PDFs, CRM records, and internal docs.</p>
<p>MFS maps those sources into a virtual tree.</p>
<p>A Postgres table becomes a tree you can ls into, where each row is a JSON object you can cat. A GitHub repo, its issues, and its PRs become browsable nodes. A PDF, an S3 bucket, a Notion page, and a Slack thread can all be represented as stable URIs.</p>
<p>From the agent’s point of view, every source becomes navigable with the same atomic operations.</p>
<pre><code translate="no">mfs tree github://acme/backend -L 1      <span class="hljs-comment"># unfold a repo&#x27;s structure</span>
├── src/
├── tests/
└── README.md

mfs <span class="hljs-built_in">ls</span> postgres://prod/public             <span class="hljs-comment"># list tables in a database</span>
tickets/   <span class="hljs-built_in">users</span>/

mfs <span class="hljs-built_in">cat</span> jira://acme/PLAT/issues.jsonl --locator <span class="hljs-string">&#x27;{&quot;id&quot;:&quot;PLAT-491&quot;}&#x27;</span>
<span class="hljs-comment"># read the original ticket text</span>
<button class="copy-code-btn"></button></code></pre>
<p>The agent only needs a few primitives:</p>
<ul>
<li>tree unfolds a source’s structure.</li>
<li>ls lists one level.</li>
<li>cat reads an object.</li>
<li>search runs semantic search.</li>
<li>grep runs exact matching.</li>
</ul>
<p>That interface matters because it avoids connector-specific prompt logic. The agent does not need one mental model for Postgres, another for GitHub, another for Slack, and another for S3. MFS absorbs the source-specific complexity and exposes a common traversal model.</p>
<p>On top of the CLI, MFS packages these capabilities into two agent-facing skills:</p>
<ul>
<li><strong>mfs-ingest</strong> registers data sources, generates config, runs incremental sync, builds indexes, and helps troubleshoot ingest failures.</li>
<li><strong>mfs-find</strong> searches and browses connected sources: first search or grep, then tree, ls, and cat down to the original source text.</li>
</ul>
<p>Install both with one command:</p>
<pre><code translate="no">npx skills add zilliztech/mfs --<span class="hljs-built_in">all</span> -g
<button class="copy-code-btn"></button></code></pre>
<p>After that, any skill-supporting agent can use them, whether you are working in Claude Code or Codex.</p>
<p>You can talk to the agent in plain English:</p>
<p><code translate="no">Ingest this repo, then help me find where the webhook retry logic is.</code></p>
<p>The agent can call the underlying MFS commands on its own.</p>
<h2 id="2-Search-to-Narrow-Browse-to-Verify" class="common-anchor-header">2. Search to Narrow, Browse to Verify<button data-href="#2-Search-to-Narrow-Browse-to-Verify" class="anchor-icon" translate="no">
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
    </button></h2><p>The second design choice is the retrieval loop.</p>
<p>In agent systems, search and browse are often discussed as separate approaches.</p>
<p>The search approach is familiar from RAG and code search: build an index, retrieve semantically relevant candidates, and pass them to the model.</p>
<p>The browse approach is progressive disclosure: give the agent a way to inspect structure and read only what it needs, layer by layer.</p>
<p>MFS combines them because that is how information-seeking usually works.</p>
<p>When you search the web, you do not read the entire internet. You issue a query, scan a candidate list, open one result, and read the relevant section.</p>
<p>A library works the same way. You check the index, go to the right shelf, pull the book, and turn to the page.</p>
<p>The agent needs that same loop:</p>
<ol>
<li><strong>Search</strong> to narrow the candidate space.</li>
<li><strong>Browse</strong> to verify the exact source.</li>
<li><strong>Answer or act</strong> only after reading the relevant evidence.</li>
</ol>
<p>Search alone is not enough. A search hit is a pointer, not proof. If the agent still has to open whole files or documents to verify each hit, token cost rises quickly.</p>
<p>Browse alone is not enough either. Without a narrowing step, the agent wastes turns exploring the wrong parts of the tree.</p>
<p>MFS puts the two together:</p>
<pre><code translate="no">mfs search <span class="hljs-string">&quot;where is webhook retry handled?&quot;</span> --all
mfs <span class="hljs-built_in">cat</span> github://acme/backend/src/webhook/retry.ts
<button class="copy-code-btn"></button></code></pre>
<p>Search narrows. Browse verifies.</p>
<p>In practice, the agent can first use search and grep to find candidate locations, then use tree, ls, and cat to inspect the original object or slice. That lets it keep prompts small while still grounding the final answer in source material.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/open_source_claude_tag_mfs_md_10_ca31cb4b17.png" alt=""Search narrows. Browse verifies." — a results list, then a specific doc page" class="doc-image" id=""search-narrows.-browse-verifies."-—-a-results-list,-then-a-specific-doc-page" />
    <span>"Search narrows. Browse verifies." — a results list, then a specific doc page</span>
  </span>
</p>
<h2 id="Benchmark-Token-Cost-on-a-2000-File-Codebase" class="common-anchor-header">Benchmark: Token Cost on a 2,000-File Codebase<button data-href="#Benchmark-Token-Cost-on-a-2000-File-Codebase" class="anchor-icon" translate="no">
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
    </button></h2><p>We tested this retrieval pattern on a 2,000-file codebase.</p>
<p>In a 24-task CodeSearchNet-style file-finding benchmark, a native shell-based agent used an average of 962 tokens for retrieval and found the correct target in 22 out of 24 tasks.</p>
<p>With MFS’s search-and-browse loop, average token use dropped to 460 tokens, while the final correct-file result improved to 23 out of 24.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/open_source_claude_tag_mfs_md_11_b71daf8c70.png" alt="24 CodeSearchNet-style file-finding tasks run end to end with Claude Code, scored on whether the agent's final file was correct (a correct-file rate, not retrieval recall). Token counts are fresh input plus output, excluding cache reads; n = 24 per arm." class="doc-image" id="24-codesearchnet-style-file-finding-tasks-run-end-to-end-with-claude-code,-scored-on-whether-the-agent's-final-file-was-correct-(a-correct-file-rate,-not-retrieval-recall).-token-counts-are-fresh-input-plus-output,-excluding-cache-reads;-n-=-24-per-arm." />
    <span>24 CodeSearchNet-style file-finding tasks run end to end with Claude Code, scored on whether the agent's final file was correct (a correct-file rate, not retrieval recall). Token counts are fresh input plus output, excluding cache reads; n = 24 per arm.</span>
  </span>
</p>
<p>Benchmark chart: MFS search plus browse found more correct target files with lower average token cost.</p>
<p>A few details matter:</p>
<ul>
<li>The score is the agent’s final correct file, not pure retrieval recall.</li>
<li>Token counts include fresh input plus output.</li>
<li>Cache reads are excluded.</li>
<li>Each arm ran 24 tasks.</li>
<li>The repo includes harder sets as well, including a tougher code-search task and a document-search task.</li>
</ul>
<p>The takeaway is not that every workload will see the same reduction. The useful result is that the search/browse loop gives the agent a controllable way to retrieve context: broad enough to find candidates, narrow enough to avoid stuffing full files into the prompt.</p>
<p>That is the core MFS pattern.</p>
<p>One interface to reach every source. Search to find candidates. Browse to verify the exact slice.</p>
<h2 id="All-Source-Retrieval-One-Query-Across-Scattered-Systems" class="common-anchor-header">All-Source Retrieval: One Query Across Scattered Systems<button data-href="#All-Source-Retrieval-One-Query-Across-Scattered-Systems" class="anchor-icon" translate="no">
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
    </button></h2><p>Once sources share the same interface, MFS can search across all registered sources with one flag:</p>
<pre><code translate="no" class="language-bash">mfs search <span class="hljs-string">&quot;what do we already have related to hybrid retrieval right now?&quot;</span> --<span class="hljs-built_in">all</span>
<button class="copy-code-btn"></button></code></pre>
<p>That query can return results from code, databases, docs, web pages, tickets, and chat history in the same format.</p>
<p>For example:</p>
<pre><code translate="no">postgres:<span class="hljs-comment">//prod/public/engineering_tickets/rows.jsonl   score=0.88</span>
   <span class="hljs-meta">#482 hybrid retrieval flaky on long queries — dense recall drops near ...</span>
notion:<span class="hljs-comment">//workspace/design/retrieval-rfc.md              score=0.85</span>
   Hybrid search: combine dense + sparse, fuse <span class="hljs-keyword">with</span> weighted RRF ...
web:<span class="hljs-comment">//milvus-tutorials/hybrid-search                    score=0.81</span>
   Hybrid search runs an ANN search <span class="hljs-keyword">and</span> a BM25 search, then reranks ...
<span class="hljs-keyword">file</span>:<span class="hljs-comment">//local/repo/src/milvus.py                         score=0.76</span>
   <span class="hljs-number">423</span>  <span class="hljs-function">def <span class="hljs-title">hybrid_search</span>(<span class="hljs-params">self, query: str, top_k: <span class="hljs-built_in">int</span> = <span class="hljs-number">10</span></span>):
github:<span class="hljs-comment">//your-org/bootcamp/notebooks                    score=0.69</span>
   bootcamp/hybrid_search.ipynb — end-to-end hybrid retrieval walkthrough
</span><button class="copy-code-btn"></button></code></pre>
<p>One command lines up material that used to live in separate systems:</p>
<ul>
<li>feedback in engineering tickets;</li>
<li>design decisions in internal docs;</li>
<li>official tutorials;</li>
<li>implementation code;</li>
<li>example notebooks.</li>
</ul>
<p>Inside an agent workflow, this becomes more than a result list. The agent can open the relevant hits, compare them, synthesize the evidence, and answer from the original sources.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/open_source_claude_tag_mfs_md_12_276e2c0262.gif" alt="All-source search across tickets, docs, tutorials, code, and examples." class="doc-image" id="all-source-search-across-tickets,-docs,-tutorials,-code,-and-examples." />
    <span>All-source search across tickets, docs, tutorials, code, and examples.</span>
  </span>
</p>
<p>MFS currently supports more than 20 mainstream source types:</p>
<table>
<thead>
<tr><th>Source</th><th>Category</th><th>URI prefix</th><th>What gets indexed</th></tr>
</thead>
<tbody>
<tr><td>Local files</td><td>Files</td><td>file://</td><td>Folders, text, code, PDFs, docx, images</td></tr>
<tr><td>Amazon S3</td><td>Object storage</td><td>s3://</td><td>Bucket objects converted to text; compatible with R2, GCS, and MinIO</td></tr>
<tr><td>Google Drive</td><td>Cloud drive</td><td>gdrive://</td><td>Docs, Sheets, PDFs, and Drive files</td></tr>
<tr><td>PostgreSQL</td><td>Database</td><td>postgres://</td><td>Tables and rows as searchable records</td></tr>
<tr><td>MySQL</td><td>Database</td><td>mysql://</td><td>Tables and rows</td></tr>
<tr><td>MongoDB</td><td>Database</td><td>mongo://</td><td>Collections and documents</td></tr>
<tr><td>BigQuery</td><td>Data warehouse</td><td>bigquery://</td><td>Datasets and tables</td></tr>
<tr><td>Snowflake</td><td>Data warehouse</td><td>snowflake://</td><td>Databases and tables</td></tr>
<tr><td>GitHub</td><td>Code / issues</td><td>github://</td><td>Repo files, issues, PRs</td></tr>
<tr><td>Jira</td><td>Issue tracking</td><td>jira://</td><td>Projects, issues, comments</td></tr>
<tr><td>Linear</td><td>Issue tracking</td><td>linear://</td><td>Teams, issues, comments</td></tr>
<tr><td>HubSpot</td><td>CRM</td><td>hubspot://</td><td>Contacts, companies, deals, notes</td></tr>
<tr><td>Zendesk</td><td>Support</td><td>zendesk://</td><td>Tickets and comments</td></tr>
<tr><td>Slack</td><td>Chat</td><td>slack://</td><td>Channels and message history</td></tr>
<tr><td>Discord</td><td>Chat</td><td>discord://</td><td>Servers, channels, threads</td></tr>
<tr><td>Gmail</td><td>Email</td><td>gmail://</td><td>Email threads and messages</td></tr>
<tr><td>Feishu / Lark</td><td>Chat / docs</td><td>feishu://</td><td>Documents and messages</td></tr>
<tr><td>Notion</td><td>Docs</td><td>notion://</td><td>Pages and databases</td></tr>
<tr><td>Web</td><td>Web pages</td><td>web://</td><td>Crawled pages converted to Markdown</td></tr>
</tbody>
</table>
<p>These systems differ in both format and business meaning. A Slack thread, a GitHub PR, a database row, a PDF page, and a Notion doc are not the same type of object.</p>
<p>MFS hides those physical differences. It converts documents to text, images to descriptions, table rows to structured records, and message threads to searchable objects. From the agent’s point of view, they stay one namespace, driven by one set of commands.</p>
<p>That is what makes cross-source search useful. The agent can search, read, and cite across systems without learning a new access pattern for each connector.</p>
<h2 id="The-Base-Layer-Plumbing-MFS-Handles" class="common-anchor-header">The Base-Layer Plumbing MFS Handles<button data-href="#The-Base-Layer-Plumbing-MFS-Handles" class="anchor-icon" translate="no">
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
    </button></h2><p>Search quality is only useful if the underlying sources stay fresh and consistent.</p>
<p>MFS handles the system work underneath retrieval:</p>
<ul>
<li>authentication;</li>
<li>incremental sync;</li>
<li>document parsing and conversion;</li>
<li>chunking;</li>
<li>embedding reuse;</li>
<li>index and metadata consistency;</li>
<li>caching;</li>
<li>deletion cleanup;</li>
<li>recovery from interrupted tasks.</li>
</ul>
<p>Incremental sync is worth calling out.</p>
<p>Every source has a different way to detect change. Databases may use updated_at. Chat systems rely on message cursors. Local folders compare file hashes. SaaS systems expose their own APIs, pagination, and change-tracking behavior.</p>
<p>MFS normalizes those differences. It works out how to sync each connector and reports the result uniformly as added, changed, or deleted.</p>
<p>That same abstraction makes connector development cheaper. If you want to add a new source, you do not rewrite the retrieval pipeline. You describe what the source contains, how to read it, and how to detect changes. MFS handles conversion, sync, embedding, indexing, caching, and search.</p>
<p>This is the unglamorous part of the system, but it is what makes the agent workflow reliable. A Slack bot demo can be written quickly. A memory layer that keeps many sources usable over time needs this plumbing.</p>
<h2 id="Architecture-Elasticity-Local-First-Production-Later" class="common-anchor-header">Architecture Elasticity: Local First, Production Later<button data-href="#Architecture-Elasticity-Local-First-Production-Later" class="anchor-icon" translate="no">
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
    </button></h2><p>MFS uses a client/server architecture. The vector store, metadata store, and cache are decoupled so the same workflow can run locally for a demo and scale out for production.</p>
<p>For a local developer demo, MFS can run in a lightweight mode:</p>
<ul>
<li><a href="https://milvus.io/docs/milvus_lite.md">Milvus Lite</a> for vectors;</li>
<li>SQLite for metadata;</li>
<li>a local ONNX embedding model of about 600 MB;</li>
<li>no cloud API key;</li>
<li>no GPU.</li>
</ul>
<p>That makes it possible to start on a single machine.</p>
<p>For production, the backend components can be swapped out:</p>
<ul>
<li>vectors can point to <a href="https://zilliz.com/cloud">Zilliz Cloud</a>;</li>
<li>metadata can move to PostgreSQL;</li>
<li>the server can run as a containerized service;</li>
<li>deployment can scale through Kubernetes.</li>
</ul>
<p>The agent-facing workflow does not need to change. The same mfs-ingest and mfs-find skills can guide setup, connect sources, and search across them.</p>
<p>For example:</p>
<pre><code translate="no">Use mfs-ingest to <span class="hljs-keyword">add</span> <span class="hljs-keyword">this</span> local repo first. I just want to <span class="hljs-keyword">get</span> a demo running <span class="hljs-keyword">as</span> fast <span class="hljs-keyword">as</span> possible.
Connect Slack <span class="hljs-keyword">and</span> Jira <span class="hljs-keyword">for</span> me. Where should the token go, <span class="hljs-keyword">and</span> which fields should <span class="hljs-keyword">not</span> be stored <span class="hljs-keyword">in</span> plaintext? Walk me through it step <span class="hljs-keyword">by</span> step.
I want to deploy MFS the production way: Zilliz Cloud <span class="hljs-keyword">for</span> the vector store, Postgres <span class="hljs-keyword">for</span> metadata, <span class="hljs-keyword">and</span> Docker Compose <span class="hljs-keyword">for</span> the server.
Check which connectors are already configured, then use mfs-find to search <span class="hljs-keyword">for</span> background <span class="hljs-keyword">on</span> webhook retry.
<button class="copy-code-btn"></button></code></pre>
<p>The user states the goal. The agent uses the skill to choose the path.</p>
<p>That is the point of exposing MFS as agent-native tooling. The agent can help with setup, but it can also use the same interface later to retrieve and verify context during real work.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/open_source_claude_tag_mfs_md_13_615dd8e97c.png" alt="Use MFS directly, build apps on MFS, or build tools with MFS underneath." class="doc-image" id="use-mfs-directly,-build-apps-on-mfs,-or-build-tools-with-mfs-underneath." />
    <span>Use MFS directly, build apps on MFS, or build tools with MFS underneath.</span>
  </span>
</p>
<h2 id="Build-Your-Own-Open-Tag-on-MFS" class="common-anchor-header">Build Your Own Open Tag on MFS<button data-href="#Build-Your-Own-Open-Tag-on-MFS" class="anchor-icon" translate="no">
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
    </button></h2><p>Open Tag is only one reference app.</p>
<p>MFS is not just a search tool for a single developer. It is a foundation for building agent applications.</p>
<p>With the CLI and SDK MFS exposes, you can build your own Slack agent, plugin, MCP server, skill, or internal workflow on top of the same memory and tools layer.</p>
<p>The pattern is reusable:</p>
<ol>
<li>Connect the sources the agent needs.</li>
<li>Expose them as stable URI trees.</li>
<li>Use search to find candidate context.</li>
<li>Use browse to verify source material.</li>
<li>Let the agent answer or act from grounded context.</li>
</ol>
<p>Open Tag is the smallest useful demo of that pattern: a Slack interface backed by real cross-source context.</p>
<p>From the outside, it looks like a Slack coworker. Underneath, it is an agent that can search, browse, and act across the systems where work already happens.</p>
<h2 id="Closing-Thoughts" class="common-anchor-header">Closing Thoughts<button data-href="#Closing-Thoughts" class="anchor-icon" translate="no">
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
    </button></h2><p>Over the past few years, as model reasoning improved, more of the industry has moved toward agent harnesses, persistent memory, and skill management.</p>
<p>The names vary, but the underlying problem is the same: how do we make models fit reliably into real production workflows?</p>
<p>That is also the motivation behind <a href="https://zilliz.com/blog/from-vector-database-to-vector-lakebase">Zilliz Vector Lakebase</a>. Semantic data should not fragment into separate islands for real-time retrieval, interactive exploration, and batch analysis. It should sit on a unified lake-native foundation.</p>
<p>MFS is that idea applied to agents.</p>
<p>It gives an agent a way to reach real-world context, organize it, search it cheaply, browse it progressively, and keep it fresh as sources change. Instead of waiting for a human to paste context into the prompt, the agent can find, verify, and use the context it needs.</p>
<p>That is the step from tool to coworker.</p>
<p>Try MFS and Open Tag:</p>
<ul>
<li><a href="https://github.com/zilliztech/mfs">MFS on GitHub</a></li>
<li><a href="https://github.com/zilliztech/mfs/tree/main/examples/open-tag-skill">Open Tag example</a></li>
<li><a href="https://zilliztech.github.io/mfs/">MFS docs</a></li>
<li><a href="https://discord.com/invite/FG6hMJStWu">MFS Discord</a></li>
<li><a href="https://milvus.io/office-hours">Milvus Office Hours</a></li>
</ul>
<p>If you want to use MFS with a managed vector layer in production, you can point it at <a href="https://cloud.zilliz.com/signup">Zilliz Cloud</a>. Work-email signups get free credits. Already have an account? <a href="https://cloud.zilliz.com/login">Sign in</a>.</p>
