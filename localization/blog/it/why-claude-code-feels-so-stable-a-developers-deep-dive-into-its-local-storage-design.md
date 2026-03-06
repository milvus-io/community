---
id: >-
  why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md
title: >
  Why Claude Code Feels So Stable: A Developer’s Deep Dive into Its Local
  Storage Design
author: Bill Chen
date: 2026-01-30T00:00:00.000Z
cover: assets.zilliz.com/cover_Claudecode_storage_81155960ef.jpeg
tag: Engineering
recommend: false
publishToMedium: true
tags: 'Claude, Claude Code, Vector Database, Retreival Augmented Generation, Milvus'
meta_keywords: 'Claude Code, AI agent, AI coding assistant, Agent memory'
meta_title: |
  How Claude Code Manages Local Storage for AI Agents
desc: >
  Deep dive into Claude Code's storage: JSONL session logs, project isolation,
  layered config, and file snapshots that make AI-assisted coding stable and
  recoverable.
origin: >-
  https://milvus.io/blog/why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md
---
<p>Claude Code has been everywhere lately. Developers are using it to ship features faster, automate workflows, and prototype agents that actually work in real projects. What’s even more surprising is how many non-coders have jumped in too — building tools, wiring up tasks, and getting useful results with almost no setup. It’s rare to see an AI coding tool spread this quickly across so many different skill levels.</p>
<p>What really stands out, though, is how <em>stable</em> it feels. Claude Code remembers what happened across sessions, survives crashes without losing progress, and behaves more like a local development tool than a chat interface. That reliability comes from how it handles local storage.</p>
<p>Instead of treating your coding session as a temporary chat, Claude Code reads and writes real files, stores project state on disk, and records every step of the agent’s work. Sessions can be resumed, inspected, or rolled back without guesswork, and each project stays cleanly isolated — avoiding the cross-contamination issues that many agent tools run into.</p>
<p>In this post, we’ll take a closer look at the storage architecture behind that stability, and why it plays such a big role in making Claude Code feel practical for everyday development.</p>
<h2 id="Challenges-Every-Local-AI-Coding-Assistant-Faces" class="common-anchor-header">Challenges Every Local AI Coding Assistant Faces<button data-href="#Challenges-Every-Local-AI-Coding-Assistant-Faces" class="anchor-icon" translate="no">
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
    </button></h2><p>Before explaining how Claude Code approaches storage, let’s take a look at the common issues that local AI coding tools tend to run into. These come up naturally when an assistant works directly on your filesystem and keeps state over time.</p>
<p><strong>1. Project data gets mixed across workspaces.</strong></p>
<p>Most developers switch between multiple repos throughout the day. If an assistant carries over state from one project to another, it becomes harder to understand its behavior and easier for it to make incorrect assumptions. Each project needs its own clean, isolated space for state and history.</p>
<p><strong>2. Crashes can cause data loss.</strong></p>
<p>During a coding session, an assistant produces a steady stream of useful data—file edits, tool calls, intermediate steps. If this data isn’t saved right away, a crash or forced restart can wipe it out. A reliable system writes important state to disk as soon as it’s created so work isn’t lost unexpectedly.</p>
<p><strong>3. It’s not always clear what the agent actually did.</strong></p>
<p>A typical session involves many small actions. Without a clear, ordered record of those actions, it’s difficult to retrace how the assistant arrived at a certain output or locate the step where something went wrong. A full history makes debugging and review a lot more manageable.</p>
<p><strong>4. Undoing mistakes takes too much effort.</strong></p>
<p>Sometimes the assistant makes changes that don’t quite work. If you don’t have a built-in way to roll back those changes, you end up manually hunting for edits across the repo. The system should automatically track what changed so you can undo it cleanly without extra work.</p>
<p><strong>5. Different projects need different settings.</strong></p>
<p>Local environments vary. Some projects require specific permissions, tools, or directory rules; others have custom scripts or workflows. An assistant needs to respect these differences and allow per-project settings while still keeping its core behavior consistent.</p>
<h2 id="The-Storage-Design-Principles-Behind-Claude-Code" class="common-anchor-header">The Storage Design Principles Behind Claude Code<button data-href="#The-Storage-Design-Principles-Behind-Claude-Code" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code’s storage design is built around four straightforward ideas. They may seem simple, but together they address the practical problems that come up when an AI assistant works directly on your machine and across multiple projects.</p>
<h3 id="1-Each-project-gets-its-own-storage" class="common-anchor-header">1. Each project gets its own storage.</h3><p>Claude Code ties all session data to the project directory it belongs to. That means conversations, edits, and logs stay with the project they came from and don’t leak into others. Keeping storage separate makes the assistant’s behavior easier to understand and makes it simple to inspect or delete data for a specific repo.</p>
<h3 id="2-Data-is-saved-to-disk-right-away" class="common-anchor-header">2. Data is saved to disk right away.</h3><p>Instead of holding interaction data in memory, Claude Code writes it to disk as soon as it’s created. Each event—message, tool call, or state update—is appended as a new entry. If the program crashes or is closed unexpectedly, almost everything is still there. This approach keeps sessions durable without adding much complexity.</p>
<h3 id="3-Every-action-has-a-clear-place-in-history" class="common-anchor-header">3. Every action has a clear place in history.</h3><p>Claude Code links each message and tool action to the one before it, forming a complete sequence. This ordered history makes it possible to review how a session unfolded and trace the steps that led to a specific result. For developers, having this kind of trace makes debugging and understanding agent behavior much easier.</p>
<h3 id="4-Code-edits-are-easy-to-roll-back" class="common-anchor-header">4. Code edits are easy to roll back.</h3><p>Before the assistant updates a file, Claude Code saves a snapshot of its previous state. If the change turns out to be wrong, you can restore the earlier version without digging through the repo or guessing what changed. This simple safety net makes AI-driven edits far less risky.</p>
<h2 id="Claude-Code-Local-Storage-Layout" class="common-anchor-header">Claude Code Local Storage Layout<button data-href="#Claude-Code-Local-Storage-Layout" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code stores all of its local data in a single place: your home directory. This keeps the system predictable and makes it easier to inspect, debug, or clean up when needed. The storage layout is built around two main components: a small global config file and a larger data directory where all project-level state lives.</p>
<p><strong>Two core components:</strong></p>
<ul>
<li><p><code translate="no">~/.claude.json</code>Stores global configuration and shortcuts, including project mappings, MCP server settings, and recently used prompts.</p></li>
<li><p><code translate="no">~/.claude/</code>The main data directory, where Claude Code stores conversations, project sessions, permissions, plugins, skills, history, and related runtime data.</p></li>
</ul>
<p>Next, let’s take a closer look at these two core components.</p>
<p><strong>(1) Global configuration:</strong> <code translate="no">~/.claude.json</code></p>
<p>This file acts as an index rather than a data store. It records which projects you’ve worked on, what tools are attached to each project, and which prompts you recently used. Conversation data itself is not stored here.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;projects&quot;</span>: {
    <span class="hljs-string">&quot;/Users/xxx/my-project&quot;</span>: {
      <span class="hljs-string">&quot;mcpServers&quot;</span>: {
        <span class="hljs-string">&quot;jarvis-tasks&quot;</span>: {
          <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;stdio&quot;</span>,
          <span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;python&quot;</span>,
          <span class="hljs-string">&quot;args&quot;</span>: [<span class="hljs-string">&quot;/path/to/run_mcp.py&quot;</span>]
        }
      }
    }
  },
  <span class="hljs-string">&quot;recentPrompts&quot;</span>: [
    <span class="hljs-string">&quot;Fix the bug in auth module&quot;</span>,
    <span class="hljs-string">&quot;Add unit tests&quot;</span>
  ]
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Main data directory:</strong> <code translate="no">~/.claude/</code></p>
<p>The <code translate="no">~/.claude/</code> directory is where most of Claude Code’s local state lives. Its structure reflects a few core design ideas: project isolation, immediate persistence, and safe recovery from mistakes.</p>
<pre><code translate="no">~/.claude/
├── settings.json                    <span class="hljs-comment"># Global settings (permissions, plugins, cleanup intervals)</span>
├── settings.local.json              <span class="hljs-comment"># Local settings (machine-specific, not committed to Git)</span>
├── history.jsonl                    <span class="hljs-comment"># Command history</span>
│
├── projects/                        <span class="hljs-comment"># 📁 Session data (organized by project, core directory)</span>
│   └── -Users-xxx-project/          <span class="hljs-comment"># Path-encoded project directory</span>
│       ├── {session-<span class="hljs-built_in">id</span>}.jsonl       <span class="hljs-comment"># Primary session data (JSONL format)</span>
│       └── agent-{agentId}.jsonl    <span class="hljs-comment"># Sub-agent session data</span>
│
├── session-env/                     <span class="hljs-comment"># Session environment variables</span>
│   └── {session-<span class="hljs-built_in">id</span>}/                <span class="hljs-comment"># Isolated by session ID</span>
│
├── skills/                          <span class="hljs-comment"># 📁 User-level skills (globally available)</span>
│   └── mac-mail/
│       └── SKILL.md
│
├── plugins/                         <span class="hljs-comment"># 📁 Plugin management</span>
│   ├── config.json                  <span class="hljs-comment"># Global plugin configuration</span>
│   ├── installed_plugins.json       <span class="hljs-comment"># List of installed plugins</span>
│   ├── known_marketplaces.json      <span class="hljs-comment"># Marketplace source configuration</span>
│   ├── cache/                       <span class="hljs-comment"># Plugin cache</span>
│   └── marketplaces/
│       └── anthropic-agent-skills/
│           ├── .claude-plugin/
│           │   └── marketplace.json
│           └── skills/
│               ├── pdf/
│               ├── docx/
│               └── frontend-design/
│
├── todos/                           <span class="hljs-comment"># Task list storage</span>
│   └── {session-<span class="hljs-built_in">id</span>}-*.json          <span class="hljs-comment"># Session-linked task files</span>
│
├── file-history/                    <span class="hljs-comment"># File edit history (stored by content hash)</span>
│   └── {content-<span class="hljs-built_in">hash</span>}/              <span class="hljs-comment"># Hash-named backup directory</span>
│
├── shell-snapshots/                 <span class="hljs-comment"># Shell state snapshots</span>
├── plans/                           <span class="hljs-comment"># Plan Mode storage</span>
├── local/                           <span class="hljs-comment"># Local tools / node_modules</span>
│   └── claude                       <span class="hljs-comment"># Claude CLI executable</span>
│   └── node_modules/                <span class="hljs-comment"># Local dependencies</span>
│
├── statsig/                         <span class="hljs-comment"># Feature flag cache</span>
├── telemetry/                       <span class="hljs-comment"># Telemetry data</span>
└── debug/                           <span class="hljs-comment"># Debug logs</span>
<button class="copy-code-btn"></button></code></pre>
<p>This layout is intentionally simple: everything Claude Code generates lives under one directory, organized by project and session. There’s no hidden state scattered around your system, and it’s easy to inspect or clean up when necessary.</p>
<h2 id="How-Claude-Code-Manages-Configuration" class="common-anchor-header">How Claude Code Manages Configuration<button data-href="#How-Claude-Code-Manages-Configuration" class="anchor-icon" translate="no">
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
    </button></h2><p>Claude Code’s configuration system is designed around a simple idea: keep the default behavior consistent across machines, but still let individual environments and projects customize what they need. To make this work, Claude Code uses a three-layer configuration model. When the same setting appears in more than one place, the more specific layer always wins.</p>
<h3 id="The-three-configuration-levels" class="common-anchor-header">The three configuration levels</h3><p>Claude Code loads configuration in the following order, from lowest priority to highest:</p>
<pre><code translate="no">┌─────────────────────────────────────────┐
│    <span class="hljs-title class_">Project</span>-level configuration          │  <span class="hljs-title class_">Highest</span> priority
│    project/.<span class="hljs-property">claude</span>/settings.<span class="hljs-property">json</span>        │  <span class="hljs-title class_">Project</span>-specific, overrides other configs
├─────────────────────────────────────────┤
│    <span class="hljs-title class_">Local</span> configuration                  │  <span class="hljs-title class_">Machine</span>-specific, not version-controlled
│    ~<span class="hljs-regexp">/.claude/</span>settings.<span class="hljs-property">local</span>.<span class="hljs-property">json</span>        │  <span class="hljs-title class_">Overrides</span> <span class="hljs-variable language_">global</span> configuration
├─────────────────────────────────────────┤
│    <span class="hljs-title class_">Global</span> configuration                 │  <span class="hljs-title class_">Lowest</span> priority
│    ~<span class="hljs-regexp">/.claude/</span>settings.<span class="hljs-property">json</span>              │  <span class="hljs-title class_">Base</span> <span class="hljs-keyword">default</span> configuration
└─────────────────────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<p>You can think of this as starting with global defaults, then applying machine-specific adjustments, and finally applying project-specific rules.</p>
<p>Next, we’ll walk through each configuration level in detail.</p>
<p><strong>(1) Global configuration:</strong> <code translate="no">~/.claude/settings.json</code></p>
<p>The global configuration defines the default behavior for Claude Code across all projects. This is where you set baseline permissions, enable plugins, and configure cleanup behavior.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;<span class="hljs-variable">$schema</span>&quot;</span>: <span class="hljs-string">&quot;https://json.schemastore.org/claude-code-settings.json&quot;</span>,
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Read(**)&quot;</span>, <span class="hljs-string">&quot;Bash(npm:*)&quot;</span>],
    <span class="hljs-string">&quot;deny&quot;</span>: [<span class="hljs-string">&quot;Bash(rm -rf:*)&quot;</span>],
    <span class="hljs-string">&quot;ask&quot;</span>: [<span class="hljs-string">&quot;Edit&quot;</span>, <span class="hljs-string">&quot;Write&quot;</span>]
  },
  <span class="hljs-string">&quot;enabledPlugins&quot;</span>: {
    <span class="hljs-string">&quot;document-skills@anthropic-agent-skills&quot;</span>: <span class="hljs-literal">true</span>
  },
  <span class="hljs-string">&quot;cleanupPeriodDays&quot;</span>: 30
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Local configuration:</strong> <code translate="no">~/.claude/settings.local.json</code></p>
<p>The local configuration is specific to a single machine. It is not meant to be shared or checked into version control. This makes it a good place for API keys, local tools, or environment-specific permissions.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Bash(git:*)&quot;</span>, <span class="hljs-string">&quot;Bash(docker:*)&quot;</span>]
  },
  <span class="hljs-string">&quot;env&quot;</span>: {
    <span class="hljs-string">&quot;ANTHROPIC_API_KEY&quot;</span>: <span class="hljs-string">&quot;sk-ant-xxx&quot;</span>
  }
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(3) Project-level configuration:</strong> <code translate="no">project/.claude/settings.json</code></p>
<p>Project-level configuration applies only to a single project and has the highest priority. This is where you define rules that should always apply when working in that repository.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;permissions&quot;</span>: {
    <span class="hljs-string">&quot;allow&quot;</span>: [<span class="hljs-string">&quot;Bash(pytest:*)&quot;</span>]
  }
}
<button class="copy-code-btn"></button></code></pre>
<p>With the configuration layers defined, the next question is <strong>how Claude Code actually resolves configuration and permissions at runtime.</strong></p>
<p><strong>Claude Code</strong> applies configuration in three layers: it starts with global defaults, then applies machine-specific overrides, and finally applies project-specific rules. When the same setting appears in multiple places, the most specific configuration takes priority.</p>
<p>Permissions follow a fixed evaluation order:</p>
<ol>
<li><p><strong>deny</strong> — always blocks</p></li>
<li><p><strong>ask</strong> — requires confirmation</p></li>
<li><p><strong>allow</strong> — runs automatically</p></li>
<li><p><strong>default</strong> — applies only when no rule matches</p></li>
</ol>
<p>This keeps the system safe by default, while still giving projects and individual machines the flexibility they need.</p>
<h2 id="Session-Storage-How-Claude-Code-Persists-Core-Interaction-Data" class="common-anchor-header">Session Storage: How Claude Code Persists Core Interaction Data<button data-href="#Session-Storage-How-Claude-Code-Persists-Core-Interaction-Data" class="anchor-icon" translate="no">
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
    </button></h2><p>In <strong>Claude Code</strong>, sessions are the core unit of data. A session captures the entire interaction between the user and the AI, including the conversation itself, tool calls, file changes, and related context. How sessions are stored has a direct impact on the system’s reliability, debuggability, and overall safety.</p>
<h3 id="Keep-session-data-separate-for-each-project" class="common-anchor-header">Keep session data separate for each project</h3><p>Once sessions are defined, the next question is how <strong>Claude Code</strong> stores them in a way that keeps data organized and isolated.</p>
<p><strong>Claude Code</strong> isolates session data by project. Each project’s sessions are stored under a directory derived from the project’s file path.</p>
<p>The storage path follows this pattern:</p>
<p><code translate="no">~/.claude/projects/ + path-encoded project directory</code></p>
<p>To create a valid directory name, special characters such as <code translate="no">/</code>, spaces, and <code translate="no">~</code> are replaced with <code translate="no">-</code>.</p>
<p>For example:</p>
<p><code translate="no">/Users/bill/My Project → -Users-bill-My-Project</code></p>
<p>This approach ensures that session data from different projects never mixes and can be managed or removed on a per-project basis.</p>
<h3 id="Why-sessions-are-stored-in-JSONL-format" class="common-anchor-header">Why sessions are stored in JSONL format</h3><p><strong>Claude Code</strong> stores session data using JSONL (JSON Lines) instead of standard JSON.</p>
<p>In a traditional JSON file, all messages are bundled together inside one large structure, which means the entire file has to be read and rewritten whenever it changes. In contrast, JSONL stores each message as its own line in the file. One line equals one message, with no outer wrapper.</p>
<table>
<thead>
<tr><th>Aspect</th><th>Standard JSON</th><th>JSONL (JSON Lines)</th></tr>
</thead>
<tbody>
<tr><td>How data is stored</td><td>One large structure</td><td>One message per line</td></tr>
<tr><td>When data is saved</td><td>Usually at the end</td><td>Immediately, per message</td></tr>
<tr><td>Crash impact</td><td>Whole file may break</td><td>Only last line affected</td></tr>
<tr><td>Writing new data</td><td>Rewrite entire file</td><td>Append one line</td></tr>
<tr><td>Memory usage</td><td>Load everything</td><td>Read line by line</td></tr>
</tbody>
</table>
<p>JSONL works better in several key ways:</p>
<ul>
<li><p><strong>Immediate saving:</strong> Each message is written to disk as soon as it’s generated, instead of waiting for the session to finish.</p></li>
<li><p><strong>Crash-resistant:</strong> If the program crashes, only the last unfinished message may be lost. Everything written before that stays intact.</p></li>
<li><p><strong>Fast appends:</strong> New messages are added to the end of the file without reading or rewriting existing data.</p></li>
<li><p><strong>Low memory usage:</strong> Session files can be read one line at a time, so the entire file doesn’t need to be loaded into memory.</p></li>
</ul>
<p>A simplified JSONL session file looks like this:</p>
<pre><code translate="no">{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:<span class="hljs-string">&quot;Hello&quot;</span>},<span class="hljs-string">&quot;timestamp&quot;</span>:<span class="hljs-string">&quot;2026-01-05T10:00:00Z&quot;</span>}
{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;assistant&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;assistant&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:[{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;text&quot;</span>,<span class="hljs-string">&quot;text&quot;</span>:<span class="hljs-string">&quot;Hi!&quot;</span>}]}}
{<span class="hljs-string">&quot;type&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;message&quot;</span>:{<span class="hljs-string">&quot;role&quot;</span>:<span class="hljs-string">&quot;user&quot;</span>,<span class="hljs-string">&quot;content&quot;</span>:<span class="hljs-string">&quot;Help me fix this bug&quot;</span>}}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Session-message-types" class="common-anchor-header">Session message types</h3><p>A session file records everything that happens during an interaction with Claude Code. To do this clearly, it uses different message types for different kinds of events.</p>
<ul>
<li><p><strong>User messages</strong> represent new input coming into the system. This includes not only what the user types, but also the results returned by tools, such as the output of a shell command. From the AI’s point of view, both are inputs it needs to respond to.</p></li>
<li><p><strong>Assistant messages</strong> capture what Claude does in response. These messages include the AI’s reasoning, the text it generates, and any tools it decides to use. They also record usage details, such as token counts, to provide a complete picture of the interaction.</p></li>
<li><p><strong>File-history snapshots</strong> are safety checkpoints created before Claude modifies any files. By saving the original file state first, Claude Code makes it possible to undo changes if something goes wrong.</p></li>
<li><p><strong>Summaries</strong> provide a concise overview of the session and are linked to the final result. They make it easier to understand what a session was about without replaying every step.</p></li>
</ul>
<p>Together, these message types record not just the conversation, but the full sequence of actions and effects that occur during a session.</p>
<p>To make this more concrete, let’s look at specific examples of user messages and assistant messages.</p>
<p><strong>(1) User messages example:</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
  <span class="hljs-string">&quot;uuid&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;parentUuid&quot;</span>: <span class="hljs-literal">null</span>,
  <span class="hljs-string">&quot;sessionId&quot;</span>: <span class="hljs-string">&quot;e5d52290-e2c1-41d6-8e97-371401502fdf&quot;</span>,
  <span class="hljs-string">&quot;timestamp&quot;</span>: <span class="hljs-string">&quot;2026-01-05T10:00:00.000Z&quot;</span>,
  <span class="hljs-string">&quot;message&quot;</span>: {
    <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;user&quot;</span>,
    <span class="hljs-string">&quot;content&quot;</span>: <span class="hljs-string">&quot;Analyze the architecture of this project&quot;</span>
  },
  <span class="hljs-string">&quot;cwd&quot;</span>: <span class="hljs-string">&quot;/Users/xxx/project&quot;</span>,
  <span class="hljs-string">&quot;gitBranch&quot;</span>: <span class="hljs-string">&quot;main&quot;</span>,
  <span class="hljs-string">&quot;version&quot;</span>: <span class="hljs-string">&quot;2.0.76&quot;</span>
}
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) Assistant messages example:</strong></p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;assistant&quot;</span>,
  <span class="hljs-string">&quot;uuid&quot;</span>: <span class="hljs-string">&quot;e684816e-f476-424d-92e3-1fe404f13212&quot;</span>,
  <span class="hljs-string">&quot;parentUuid&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;message&quot;</span>: {
    <span class="hljs-string">&quot;role&quot;</span>: <span class="hljs-string">&quot;assistant&quot;</span>,
    <span class="hljs-string">&quot;model&quot;</span>: <span class="hljs-string">&quot;claude-opus-4-5-20251101&quot;</span>,
    <span class="hljs-string">&quot;content&quot;</span>: [
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;thinking&quot;</span>,
        <span class="hljs-string">&quot;thinking&quot;</span>: <span class="hljs-string">&quot;The user wants to understand the project architecture, so I need to check the directory structure first...&quot;</span>
      },
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;text&quot;</span>,
        <span class="hljs-string">&quot;text&quot;</span>: <span class="hljs-string">&quot;Let me take a look at the project structure first.&quot;</span>
      },
      {
        <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;tool_use&quot;</span>,
        <span class="hljs-string">&quot;id&quot;</span>: <span class="hljs-string">&quot;toolu_01ABC&quot;</span>,
        <span class="hljs-string">&quot;name&quot;</span>: <span class="hljs-string">&quot;Bash&quot;</span>,
        <span class="hljs-string">&quot;input&quot;</span>: {<span class="hljs-string">&quot;command&quot;</span>: <span class="hljs-string">&quot;ls -la&quot;</span>}
      }
    ],
    <span class="hljs-string">&quot;usage&quot;</span>: {
      <span class="hljs-string">&quot;input_tokens&quot;</span>: <span class="hljs-number">1500</span>,
      <span class="hljs-string">&quot;output_tokens&quot;</span>: <span class="hljs-number">200</span>,
      <span class="hljs-string">&quot;cache_read_input_tokens&quot;</span>: <span class="hljs-number">50000</span>
    }
  }
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="How-Session-Messages-Are-Linked" class="common-anchor-header">How Session Messages Are Linked</h3><p>Claude Code doesn’t store session messages as isolated entries. Instead, it links them together to form a clear chain of events. Each message includes a unique identifier (<code translate="no">uuid</code>) and a reference to the message that came before it (<code translate="no">parentUuid</code>). This makes it possible to see not just what happened, but why it happened.</p>
<p>A session starts with a user message, which begins the chain. Each reply from Claude points back to the message that caused it. Tool calls and their outputs are added the same way, with every step linked to the one before it. When the session ends, a summary is attached to the final message.</p>
<p>Because every step is connected, Claude Code can replay the full sequence of actions and understand how a result was produced, making debugging and analysis much easier.</p>
<h2 id="Making-Code-Changes-Easy-to-Undo-with-File-Snapshots" class="common-anchor-header">Making Code Changes Easy to Undo with File Snapshots<button data-href="#Making-Code-Changes-Easy-to-Undo-with-File-Snapshots" class="anchor-icon" translate="no">
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
    </button></h2><p>AI-generated edits aren’t always correct, and sometimes they go in the completely wrong direction. To make these changes safe to experiment with, Claude Code uses a simple snapshot system that lets you undo edits without digging through diffs or manually cleaning up files.</p>
<p>The idea is straightforward: <strong>before Claude Code modifies a file, it saves a copy of the original content.</strong> If the edit turns out to be a mistake, the system can restore the previous version instantly.</p>
<h3 id="What-is-a-file-history-snapshot" class="common-anchor-header">What is a <em>file-history snapshot</em>?</h3><p>A <em>file-history snapshot</em> is a checkpoint created before files are modified. It records the original content of every file that <strong>Claude</strong> is about to edit. These snapshots serve as the data source for undo and rollback operations.</p>
<p>When a user sends a message that may change files, <strong>Claude Code</strong> creates an empty snapshot for that message. Before editing, the system backs up the original content of each target file into the snapshot, then applies the edits directly to disk. If the user triggers <em>undo</em>, <strong>Claude Code</strong> restores the saved content and overwrites the modified files.</p>
<p>In practice, the lifecycle of an undoable edit looks like this:</p>
<ol>
<li><p><strong>User sends a message</strong>Claude Code creates a new, empty <code translate="no">file-history-snapshot</code> record.</p></li>
<li><p><strong>Claude prepares to modify files</strong>The system identifies which files will be edited and backs up their original content into <code translate="no">trackedFileBackups</code>.</p></li>
<li><p><strong>Claude executes the edit</strong>Edit and write operations are performed, and the modified content is written to disk.</p></li>
<li><p><strong>User triggers undo</strong>The user presses <strong>Esc + Esc</strong>, signaling that the changes should be reverted.</p></li>
<li><p><strong>Original content is restored</strong>Claude Code reads the saved content from <code translate="no">trackedFileBackups</code> and overwrites the current files, completing the undo.</p></li>
</ol>
<h3 id="Why-Undo-Works-Snapshots-Save-the-Old-Version" class="common-anchor-header">Why Undo Works: Snapshots Save the Old Version</h3><p>Undo in Claude Code works because the system saves the <em>original</em> file content before any edit happens.</p>
<p>Instead of trying to reverse changes after the fact, Claude Code takes a simpler approach: it copies the file as it existed <em>before</em> modification and stores that copy in <code translate="no">trackedFileBackups</code>. When the user triggers undo, the system restores this saved version and overwrites the edited file.</p>
<p>The diagram below shows this flow step by step:</p>
<pre><code translate="no">┌─────────────────────────┐
│    before edit,  app.py │
│    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;old&quot;</span>)         │───────→  Backed up into snapshot trackedFileBackups
└─────────────────────────┘

↓

┌──────────────────────────┐
│   After Claude edits     │
│    <span class="hljs-built_in">print</span>(<span class="hljs-string">&quot;new&quot;</span>)          │───────→  Written to disk (overwrites the original file)
└──────────────────────────┘

↓

┌──────────────────────────┐
│    User triggers undo    │
│    Press   Esc + Esc     │───────→ Restore <span class="hljs-string">&quot;old&quot;</span> content to disk <span class="hljs-keyword">from</span> snapshot
└──────────────────────────┘
<button class="copy-code-btn"></button></code></pre>
<h3 id="What-a-file-History-snapshot-Looks-Like-Internally" class="common-anchor-header">What a <em>file-History snapshot</em> Looks Like Internally</h3><p>The snapshot itself is stored as a structured record. It captures metadata about the user message, the time of the snapshot, and—most importantly—a map of files to their original contents.</p>
<p>The example below shows a single <code translate="no">file-history-snapshot</code> record created before Claude edits any files. Each entry in <code translate="no">trackedFileBackups</code> stores the <em>pre-edit</em> content of a file, which is later used to restore the file during an undo.</p>
<pre><code translate="no">{
  <span class="hljs-string">&quot;type&quot;</span>: <span class="hljs-string">&quot;file-history-snapshot&quot;</span>,
  <span class="hljs-string">&quot;messageId&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
  <span class="hljs-string">&quot;snapshot&quot;</span>: {
    <span class="hljs-string">&quot;messageId&quot;</span>: <span class="hljs-string">&quot;7d90e1c9-e727-4291-8eb9-0e7b844c4348&quot;</span>,
    <span class="hljs-string">&quot;trackedFileBackups&quot;</span>: {
      <span class="hljs-string">&quot;/path/to/file1.py&quot;</span>: <span class="hljs-string">&quot;Original file content\ndef hello():\n    print(&#x27;old&#x27;)&quot;</span>,
      <span class="hljs-string">&quot;/path/to/file2.js&quot;</span>: <span class="hljs-string">&quot;// Original content...&quot;</span>
    },
    <span class="hljs-string">&quot;timestamp&quot;</span>: <span class="hljs-string">&quot;2026-01-05T10:00:00.000Z&quot;</span>
  },
  <span class="hljs-string">&quot;isSnapshotUpdate&quot;</span>: <span class="hljs-literal">false</span>
}
<button class="copy-code-btn"></button></code></pre>
<h3 id="Where-Snapshots-Are-Stored-and-How-Long-They-Are-Kept" class="common-anchor-header">Where Snapshots Are Stored and How Long They Are Kept</h3><ul>
<li><p><strong>Where snapshot metadata is stored</strong>: Snapshot records are bound to a specific session and saved as JSONL files under<code translate="no">~/.claude/projects/-path-to-project/{session-id}.jsonl</code>.</p></li>
<li><p><strong>Where original file contents are backed up</strong>: The pre-edit content of each file is stored separately by content hash under<code translate="no">~/.claude/file-history/{content-hash}/</code>.</p></li>
<li><p><strong>How long snapshots are kept by default</strong>: Snapshot data is retained for 30 days, consistent with the global <code translate="no">cleanupPeriodDays</code> setting.</p></li>
<li><p><strong>How to change the retention period</strong>: The number of retention days can be adjusted via the <code translate="no">cleanupPeriodDays</code> field in <code translate="no">~/.claude/settings.json</code>.</p></li>
</ul>
<h3 id="Related-Commands" class="common-anchor-header">Related Commands</h3><table>
<thead>
<tr><th>Command / Action</th><th>Description</th></tr>
</thead>
<tbody>
<tr><td>Esc + Esc</td><td>Undo the most recent round of file edits (most commonly used)</td></tr>
<tr><td>/rewind</td><td>Revert to a previously specified checkpoint (snapshot)</td></tr>
<tr><td>/diff</td><td>View differences between the current file and the snapshot backup</td></tr>
</tbody>
</table>
<h2 id="Other-Important-Directories" class="common-anchor-header">Other Important Directories<button data-href="#Other-Important-Directories" class="anchor-icon" translate="no">
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
    </button></h2><p><strong>(1) plugins/ — Plugin Management</strong></p>
<p>The <code translate="no">plugins/</code> directory stores add-ons that give Claude Code extra abilities.</p>
<p>This directory stores which <em>plugins</em> are installed, where they came from, and the extra skills those plugins provide. It also keeps local copies of downloaded plugins so they don’t need to be fetched again.</p>
<pre><code translate="no">~/.claude/plugins/
├── config.json
│   Global plugin configuration (e.g., <span class="hljs-built_in">enable</span>/disable rules)
├── installed_plugins.json
│   List of installed plugins (including version and status)
├── known_marketplaces.json
│   Plugin marketplace <span class="hljs-built_in">source</span> configuration (e.g., Anthropic official marketplace)
├── cache/
│   Plugin download cache (avoids repeated downloads)
└── marketplaces/
    Marketplace <span class="hljs-built_in">source</span> storage
    └── anthropic-agent-skills/
        Official plugin marketplace
        ├── .claude-plugin/
        │   └── marketplace.json
        │       Marketplace metadata
        └── skills/
            Skills provided by the marketplace
            ├── pdf/
            │   PDF-related skills
            ├── docx/
            │   Word document processing skills
            └── frontend-design/
                Frontend design skills
<button class="copy-code-btn"></button></code></pre>
<p><strong>(2) skills/ — Where Skills Are Stored and Applied</strong></p>
<p>In Claude Code, a skill is a small, reusable ability that helps Claude perform a specific task, such as working with PDFs, editing documents, or following a coding workflow.</p>
<p>Not all skills are available everywhere. Some apply globally, while others are limited to a single project or provided by a plugin. Claude Code stores skills in different locations to control where each skill can be used.</p>
<p>The hierarchy below shows how skills are layered by scope, from globally available skills to project-specific and plugin-provided ones.</p>
<table>
<thead>
<tr><th>Level</th><th>Storage Location</th><th>Description</th></tr>
</thead>
<tbody>
<tr><td>User</td><td>~/.claude/skills/</td><td>Globally available, accessible by all projects</td></tr>
<tr><td>Project</td><td>project/.claude/skills/</td><td>Available only to the current project, project-specific customization</td></tr>
<tr><td>Plugin</td><td>~/.claude/plugins/marketplaces/*/skills/</td><td>Installed with plugins, dependent on plugin enablement status</td></tr>
</tbody>
</table>
<p><strong>(3) todos/ — Task List Storage</strong></p>
<p>The <code translate="no">todos/</code> directory stores task lists that Claude creates to track work during a conversation, such as steps to complete, items in progress, and completed tasks.</p>
<p>Task lists are saved as JSON files under<code translate="no">~/.claude/todos/{session-id}-*.json</code>.Each filename includes the session ID, which ties the task list to a specific conversation.</p>
<p>The contents of these files come from the <code translate="no">TodoWrite</code> tool and include basic task information such as the task description, current status, priority, and related metadata.</p>
<p><strong>(4) local/ — Local Runtime and Tools</strong></p>
<p>The <code translate="no">local/</code> directory holds the core files Claude Code needs to run on your machine.</p>
<p>This includes the <code translate="no">claude</code> command-line executable and the <code translate="no">node_modules/</code> directory that contains its runtime dependencies. By keeping these components local, Claude Code can run independently, without depending on external services or system-wide installations.</p>
<p><strong>（5）Additional Supporting Directories</strong></p>
<ul>
<li><p><strong>shell-snapshots/:</strong> Stores shell session state snapshots (such as current directory and environment variables), enabling shell operation rollback.</p></li>
<li><p><strong>plans/:</strong> Stores execution plans generated by Plan Mode (e.g., step-by-step breakdowns of multi-step programming tasks).</p></li>
<li><p><strong>statsig/:</strong> Caches feature flag configurations (such as whether new features are enabled) to reduce repeated requests.</p></li>
<li><p><strong>telemetry/:</strong> Stores anonymous telemetry data (such as feature usage frequency) for product optimization.</p></li>
<li><p><strong>debug/:</strong> Stores debug logs (including error stacks and execution traces) to aid troubleshooting.</p></li>
</ul>
<h2 id="Conclusion" class="common-anchor-header">Conclusion<button data-href="#Conclusion" class="anchor-icon" translate="no">
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
    </button></h2><p>After digging through how Claude Code stores and manages everything locally, the picture becomes pretty clear: the tool feels stable because the foundation is solid. Nothing fancy — just thoughtful engineering. Each project has its own space, every action gets written down, and file edits are backed up before anything changes. It’s the kind of design that quietly does its job and lets you focus on yours.</p>
<p>What I like most is that there’s nothing mystical going on here. Claude Code works well because the basics are done right. If you’ve ever tried to build an agent that touches real files, you know how easy it is for things to fall apart — state gets mixed, crashes wipe progress, and undo becomes guesswork. Claude Code avoids all of that with a storage model that’s simple, consistent, and hard to break.</p>
<p>For teams building local or on-prem AI agents, especially in secure environments, this approach shows how strong storage and persistence make AI tools reliable and practical for everyday development.</p>
<p>If you’re designing local or on-prem AI agents and want to discuss storage architecture, session design, or safe rollback in more detail, feel free to join our <a href="https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email">Slack channel</a>.You can also book a 20-minute one-on-one through <a href="https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md">Milvus Office Hours</a> for personalized guidance.</p>
