---
id: why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md
title: >
 Why Claude Code Feels So Stable: A Developer’s Deep Dive into Its Local Storage Design
author: Bill Chen
date: 2026-01-30
cover: assets.zilliz.com/cover_Claudecode_storage_81155960ef.jpeg
tag: Insights
recommend: false
publishToMedium: true
tags: Claude, Claude Code, Vector Database, Retreival Augmented Generation, Milvus
meta_keywords: Claude Code, AI agent, AI coding assistant, Agent memory
meta_title: >
 How Claude Code Manages Local Storage for AI Agents
desc: >
 Deep dive into Claude Code's storage: JSONL session logs, project isolation, layered config, and file snapshots that make AI-assisted coding stable and recoverable.
origin: https://milvus.io/blog/why-claude-code-feels-so-stable-a-developers-deep-dive-into-its-local-storage-design.md
---

Claude Code has been everywhere lately. Developers are using it to ship features faster, automate workflows, and prototype agents that actually work in real projects. What’s even more surprising is how many non-coders have jumped in too — building tools, wiring up tasks, and getting useful results with almost no setup. It’s rare to see an AI coding tool spread this quickly across so many different skill levels.

What really stands out, though, is how *stable* it feels. Claude Code remembers what happened across sessions, survives crashes without losing progress, and behaves more like a local development tool than a chat interface. That reliability comes from how it handles local storage.

Instead of treating your coding session as a temporary chat, Claude Code reads and writes real files, stores project state on disk, and records every step of the agent’s work. Sessions can be resumed, inspected, or rolled back without guesswork, and each project stays cleanly isolated — avoiding the cross-contamination issues that many agent tools run into.

In this post, we’ll take a closer look at the storage architecture behind that stability, and why it plays such a big role in making Claude Code feel practical for everyday development.

## Challenges Every Local AI Coding Assistant Faces

Before explaining how Claude Code approaches storage, let’s take a look at the common issues that local AI coding tools tend to run into. These come up naturally when an assistant works directly on your filesystem and keeps state over time. 

**1. Project data gets mixed across workspaces.**

Most developers switch between multiple repos throughout the day. If an assistant carries over state from one project to another, it becomes harder to understand its behavior and easier for it to make incorrect assumptions. Each project needs its own clean, isolated space for state and history.

**2. Crashes can cause data loss.**

During a coding session, an assistant produces a steady stream of useful data—file edits, tool calls, intermediate steps. If this data isn’t saved right away, a crash or forced restart can wipe it out. A reliable system writes important state to disk as soon as it’s created so work isn’t lost unexpectedly.

**3. It’s not always clear what the agent actually did.**

A typical session involves many small actions. Without a clear, ordered record of those actions, it’s difficult to retrace how the assistant arrived at a certain output or locate the step where something went wrong. A full history makes debugging and review a lot more manageable.

**4. Undoing mistakes takes too much effort.**

Sometimes the assistant makes changes that don’t quite work. If you don’t have a built-in way to roll back those changes, you end up manually hunting for edits across the repo. The system should automatically track what changed so you can undo it cleanly without extra work.

**5. Different projects need different settings.**

Local environments vary. Some projects require specific permissions, tools, or directory rules; others have custom scripts or workflows. An assistant needs to respect these differences and allow per-project settings while still keeping its core behavior consistent.

## The Storage Design Principles Behind Claude Code

Claude Code’s storage design is built around four straightforward ideas. They may seem simple, but together they address the practical problems that come up when an AI assistant works directly on your machine and across multiple projects.

### 1. Each project gets its own storage.

Claude Code ties all session data to the project directory it belongs to. That means conversations, edits, and logs stay with the project they came from and don’t leak into others. Keeping storage separate makes the assistant’s behavior easier to understand and makes it simple to inspect or delete data for a specific repo.

### 2. Data is saved to disk right away.

Instead of holding interaction data in memory, Claude Code writes it to disk as soon as it’s created. Each event—message, tool call, or state update—is appended as a new entry. If the program crashes or is closed unexpectedly, almost everything is still there. This approach keeps sessions durable without adding much complexity.

### 3. Every action has a clear place in history.

Claude Code links each message and tool action to the one before it, forming a complete sequence. This ordered history makes it possible to review how a session unfolded and trace the steps that led to a specific result. For developers, having this kind of trace makes debugging and understanding agent behavior much easier.

### 4. Code edits are easy to roll back.

Before the assistant updates a file, Claude Code saves a snapshot of its previous state. If the change turns out to be wrong, you can restore the earlier version without digging through the repo or guessing what changed. This simple safety net makes AI-driven edits far less risky.

## Claude Code Local Storage Layout

Claude Code stores all of its local data in a single place: your home directory. This keeps the system predictable and makes it easier to inspect, debug, or clean up when needed. The storage layout is built around two main components: a small global config file and a larger data directory where all project-level state lives.

**Two core components:**

- `~/.claude.json`Stores global configuration and shortcuts, including project mappings, MCP server settings, and recently used prompts.
    
-   `~/.claude/`The main data directory, where Claude Code stores conversations, project sessions, permissions, plugins, skills, history, and related runtime data.
    

Next, let’s take a closer look at these two core components.

**(1) Global configuration:** `~/.claude.json`

This file acts as an index rather than a data store. It records which projects you’ve worked on, what tools are attached to each project, and which prompts you recently used. Conversation data itself is not stored here.

```
{
  "projects": {
    "/Users/xxx/my-project": {
      "mcpServers": {
        "jarvis-tasks": {
          "type": "stdio",
          "command": "python",
          "args": ["/path/to/run_mcp.py"]
        }
      }
    }
  },
  "recentPrompts": [
    "Fix the bug in auth module",
    "Add unit tests"
  ]
}
```

  

**(2) Main data directory:** `~/.claude/`

The `~/.claude/` directory is where most of Claude Code’s local state lives. Its structure reflects a few core design ideas: project isolation, immediate persistence, and safe recovery from mistakes.

```
~/.claude/
├── settings.json                    # Global settings (permissions, plugins, cleanup intervals)
├── settings.local.json              # Local settings (machine-specific, not committed to Git)
├── history.jsonl                    # Command history
│
├── projects/                        # 📁 Session data (organized by project, core directory)
│   └── -Users-xxx-project/          # Path-encoded project directory
│       ├── {session-id}.jsonl       # Primary session data (JSONL format)
│       └── agent-{agentId}.jsonl    # Sub-agent session data
│
├── session-env/                     # Session environment variables
│   └── {session-id}/                # Isolated by session ID
│
├── skills/                          # 📁 User-level skills (globally available)
│   └── mac-mail/
│       └── SKILL.md
│
├── plugins/                         # 📁 Plugin management
│   ├── config.json                  # Global plugin configuration
│   ├── installed_plugins.json       # List of installed plugins
│   ├── known_marketplaces.json      # Marketplace source configuration
│   ├── cache/                       # Plugin cache
│   └── marketplaces/
│       └── anthropic-agent-skills/
│           ├── .claude-plugin/
│           │   └── marketplace.json
│           └── skills/
│               ├── pdf/
│               ├── docx/
│               └── frontend-design/
│
├── todos/                           # Task list storage
│   └── {session-id}-*.json          # Session-linked task files
│
├── file-history/                    # File edit history (stored by content hash)
│   └── {content-hash}/              # Hash-named backup directory
│
├── shell-snapshots/                 # Shell state snapshots
├── plans/                           # Plan Mode storage
├── local/                           # Local tools / node_modules
│   └── claude                       # Claude CLI executable
│   └── node_modules/                # Local dependencies
│
├── statsig/                         # Feature flag cache
├── telemetry/                       # Telemetry data
└── debug/                           # Debug logs
```

This layout is intentionally simple: everything Claude Code generates lives under one directory, organized by project and session. There’s no hidden state scattered around your system, and it’s easy to inspect or clean up when necessary.

## How Claude Code Manages Configuration

Claude Code’s configuration system is designed around a simple idea: keep the default behavior consistent across machines, but still let individual environments and projects customize what they need. To make this work, Claude Code uses a three-layer configuration model. When the same setting appears in more than one place, the more specific layer always wins.

### The three configuration levels

Claude Code loads configuration in the following order, from lowest priority to highest:

```
┌─────────────────────────────────────────┐
│    Project-level configuration          │  Highest priority
│    project/.claude/settings.json        │  Project-specific, overrides other configs
├─────────────────────────────────────────┤
│    Local configuration                  │  Machine-specific, not version-controlled
│    ~/.claude/settings.local.json        │  Overrides global configuration
├─────────────────────────────────────────┤
│    Global configuration                 │  Lowest priority
│    ~/.claude/settings.json              │  Base default configuration
└─────────────────────────────────────────┘
```

You can think of this as starting with global defaults, then applying machine-specific adjustments, and finally applying project-specific rules.

Next, we’ll walk through each configuration level in detail.

**(1) Global configuration:** `~/.claude/settings.json`

The global configuration defines the default behavior for Claude Code across all projects. This is where you set baseline permissions, enable plugins, and configure cleanup behavior.

```
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": ["Read(**)", "Bash(npm:*)"],
    "deny": ["Bash(rm -rf:*)"],
    "ask": ["Edit", "Write"]
  },
  "enabledPlugins": {
    "document-skills@anthropic-agent-skills": true
  },
  "cleanupPeriodDays": 30
}
```

  
**(2) Local configuration:** `~/.claude/settings.local.json`

The local configuration is specific to a single machine. It is not meant to be shared or checked into version control. This makes it a good place for API keys, local tools, or environment-specific permissions.

```
{
  "permissions": {
    "allow": ["Bash(git:*)", "Bash(docker:*)"]
  },
  "env": {
    "ANTHROPIC_API_KEY": "sk-ant-xxx"
  }
}
```

  

**(3) Project-level configuration:** `project/.claude/settings.json`

Project-level configuration applies only to a single project and has the highest priority. This is where you define rules that should always apply when working in that repository.

```
{
  "permissions": {
    "allow": ["Bash(pytest:*)"]
  }
}
```

With the configuration layers defined, the next question is **how Claude Code actually resolves configuration and permissions at runtime.**

**Claude Code** applies configuration in three layers: it starts with global defaults, then applies machine-specific overrides, and finally applies project-specific rules. When the same setting appears in multiple places, the most specific configuration takes priority. 

Permissions follow a fixed evaluation order:

1.  **deny** — always blocks
    
2.  **ask** — requires confirmation
    
3.  **allow** — runs automatically
    
4.  **default** — applies only when no rule matches
    

This keeps the system safe by default, while still giving projects and individual machines the flexibility they need.

## Session Storage: How Claude Code Persists Core Interaction Data

In **Claude Code**, sessions are the core unit of data. A session captures the entire interaction between the user and the AI, including the conversation itself, tool calls, file changes, and related context. How sessions are stored has a direct impact on the system’s reliability, debuggability, and overall safety.

### Keep session data separate for each project

Once sessions are defined, the next question is how **Claude Code** stores them in a way that keeps data organized and isolated.

**Claude Code** isolates session data by project. Each project’s sessions are stored under a directory derived from the project’s file path.

The storage path follows this pattern:

`~/.claude/projects/ + path-encoded project directory`

To create a valid directory name, special characters such as `/`, spaces, and `~` are replaced with `-`.

For example:

`/Users/bill/My Project → -Users-bill-My-Project`

This approach ensures that session data from different projects never mixes and can be managed or removed on a per-project basis.

### Why sessions are stored in JSONL format

**Claude Code** stores session data using JSONL (JSON Lines) instead of standard JSON. 

In a traditional JSON file, all messages are bundled together inside one large structure, which means the entire file has to be read and rewritten whenever it changes. In contrast, JSONL stores each message as its own line in the file. One line equals one message, with no outer wrapper.

  

| Aspect | Standard JSON | JSONL (JSON Lines) |
| --- | --- | --- |
| How data is stored | One large structure | One message per line |
| When data is saved | Usually at the end | Immediately, per message |
| Crash impact | Whole file may break | Only last line affected |
| Writing new data | Rewrite entire file | Append one line |
| Memory usage | Load everything | Read line by line |

JSONL works better in several key ways:

-   **Immediate saving:** Each message is written to disk as soon as it’s generated, instead of waiting for the session to finish.
    
-   **Crash-resistant:** If the program crashes, only the last unfinished message may be lost. Everything written before that stays intact.
    
-   **Fast appends:** New messages are added to the end of the file without reading or rewriting existing data.
    
-   **Low memory usage:** Session files can be read one line at a time, so the entire file doesn’t need to be loaded into memory.
    

  

A simplified JSONL session file looks like this:

```
{"type":"user","message":{"role":"user","content":"Hello"},"timestamp":"2026-01-05T10:00:00Z"}
{"type":"assistant","message":{"role":"assistant","content":[{"type":"text","text":"Hi!"}]}}
{"type":"user","message":{"role":"user","content":"Help me fix this bug"}}
```

  

### Session message types

A session file records everything that happens during an interaction with Claude Code. To do this clearly, it uses different message types for different kinds of events.

-   **User messages** represent new input coming into the system. This includes not only what the user types, but also the results returned by tools, such as the output of a shell command. From the AI’s point of view, both are inputs it needs to respond to.
    
-   **Assistant messages** capture what Claude does in response. These messages include the AI’s reasoning, the text it generates, and any tools it decides to use. They also record usage details, such as token counts, to provide a complete picture of the interaction.
    
-   **File-history snapshots** are safety checkpoints created before Claude modifies any files. By saving the original file state first, Claude Code makes it possible to undo changes if something goes wrong.
    
-   **Summaries** provide a concise overview of the session and are linked to the final result. They make it easier to understand what a session was about without replaying every step.
    

Together, these message types record not just the conversation, but the full sequence of actions and effects that occur during a session.

To make this more concrete, let’s look at specific examples of user messages and assistant messages.

**(1) User messages example:**

```
{
  "type": "user",
  "uuid": "7d90e1c9-e727-4291-8eb9-0e7b844c4348",
  "parentUuid": null,
  "sessionId": "e5d52290-e2c1-41d6-8e97-371401502fdf",
  "timestamp": "2026-01-05T10:00:00.000Z",
  "message": {
    "role": "user",
    "content": "Analyze the architecture of this project"
  },
  "cwd": "/Users/xxx/project",
  "gitBranch": "main",
  "version": "2.0.76"
}
```

**(2) Assistant messages example:**

```
{
  "type": "assistant",
  "uuid": "e684816e-f476-424d-92e3-1fe404f13212",
  "parentUuid": "7d90e1c9-e727-4291-8eb9-0e7b844c4348",
  "message": {
    "role": "assistant",
    "model": "claude-opus-4-5-20251101",
    "content": [
      {
        "type": "thinking",
        "thinking": "The user wants to understand the project architecture, so I need to check the directory structure first..."
      },
      {
        "type": "text",
        "text": "Let me take a look at the project structure first."
      },
      {
        "type": "tool_use",
        "id": "toolu_01ABC",
        "name": "Bash",
        "input": {"command": "ls -la"}
      }
    ],
    "usage": {
      "input_tokens": 1500,
      "output_tokens": 200,
      "cache_read_input_tokens": 50000
    }
  }
}
```

  

### How Session Messages Are Linked

Claude Code doesn’t store session messages as isolated entries. Instead, it links them together to form a clear chain of events. Each message includes a unique identifier (`uuid`) and a reference to the message that came before it (`parentUuid`). This makes it possible to see not just what happened, but why it happened.

A session starts with a user message, which begins the chain. Each reply from Claude points back to the message that caused it. Tool calls and their outputs are added the same way, with every step linked to the one before it. When the session ends, a summary is attached to the final message.

Because every step is connected, Claude Code can replay the full sequence of actions and understand how a result was produced, making debugging and analysis much easier.

  

## Making Code Changes Easy to Undo with File Snapshots

AI-generated edits aren’t always correct, and sometimes they go in the completely wrong direction. To make these changes safe to experiment with, Claude Code uses a simple snapshot system that lets you undo edits without digging through diffs or manually cleaning up files.

The idea is straightforward: **before Claude Code modifies a file, it saves a copy of the original content.** If the edit turns out to be a mistake, the system can restore the previous version instantly.

### What is a *file-history snapshot*?

A *file-history snapshot* is a checkpoint created before files are modified. It records the original content of every file that **Claude** is about to edit. These snapshots serve as the data source for undo and rollback operations.

When a user sends a message that may change files, **Claude Code** creates an empty snapshot for that message. Before editing, the system backs up the original content of each target file into the snapshot, then applies the edits directly to disk. If the user triggers *undo*, **Claude Code** restores the saved content and overwrites the modified files.

In practice, the lifecycle of an undoable edit looks like this:

1.  **User sends a message**Claude Code creates a new, empty `file-history-snapshot` record.
    
2.  **Claude prepares to modify files**The system identifies which files will be edited and backs up their original content into `trackedFileBackups`.
    
3.  **Claude executes the edit**Edit and write operations are performed, and the modified content is written to disk.
    
4.  **User triggers undo**The user presses **Esc + Esc**, signaling that the changes should be reverted.
    
5.  **Original content is restored**Claude Code reads the saved content from `trackedFileBackups` and overwrites the current files, completing the undo.
    

### Why Undo Works: Snapshots Save the Old Version

Undo in Claude Code works because the system saves the *original* file content before any edit happens.

Instead of trying to reverse changes after the fact, Claude Code takes a simpler approach: it copies the file as it existed *before* modification and stores that copy in `trackedFileBackups`. When the user triggers undo, the system restores this saved version and overwrites the edited file.

The diagram below shows this flow step by step:

```
┌─────────────────────────┐
│    before edit,  app.py │
│    print("old")         │───────→  Backed up into snapshot trackedFileBackups
└─────────────────────────┘

↓

┌──────────────────────────┐
│   After Claude edits     │
│    print("new")          │───────→  Written to disk (overwrites the original file)
└──────────────────────────┘

↓

┌──────────────────────────┐
│    User triggers undo    │
│    Press   Esc + Esc     │───────→ Restore "old" content to disk from snapshot
└──────────────────────────┘
```

  

### What a *file-History snapshot* Looks Like Internally

The snapshot itself is stored as a structured record. It captures metadata about the user message, the time of the snapshot, and—most importantly—a map of files to their original contents.

The example below shows a single `file-history-snapshot` record created before Claude edits any files. Each entry in `trackedFileBackups` stores the *pre-edit* content of a file, which is later used to restore the file during an undo.

```
{
  "type": "file-history-snapshot",
  "messageId": "7d90e1c9-e727-4291-8eb9-0e7b844c4348",
  "snapshot": {
    "messageId": "7d90e1c9-e727-4291-8eb9-0e7b844c4348",
    "trackedFileBackups": {
      "/path/to/file1.py": "Original file content\ndef hello():\n    print('old')",
      "/path/to/file2.js": "// Original content..."
    },
    "timestamp": "2026-01-05T10:00:00.000Z"
  },
  "isSnapshotUpdate": false
}
```

  

### Where Snapshots Are Stored and How Long They Are Kept

-   **Where snapshot metadata is stored**: Snapshot records are bound to a specific session and saved as JSONL files under`~/.claude/projects/-path-to-project/{session-id}.jsonl`.
    
-   **Where original file contents are backed up**: The pre-edit content of each file is stored separately by content hash under`~/.claude/file-history/{content-hash}/`.
    
-   **How long snapshots are kept by default**: Snapshot data is retained for 30 days, consistent with the global `cleanupPeriodDays` setting.
    
-   **How to change the retention period**: The number of retention days can be adjusted via the `cleanupPeriodDays` field in `~/.claude/settings.json`.
    

  

### Related Commands

| Command / Action | Description |
| --- | --- |
| Esc + Esc | Undo the most recent round of file edits (most commonly used) |
| /rewind | Revert to a previously specified checkpoint (snapshot) |
| /diff | View differences between the current file and the snapshot backup |

  

## Other Important Directories

  

**(1) plugins/ — Plugin Management**

The `plugins/` directory stores add-ons that give Claude Code extra abilities. 

This directory stores which *plugins* are installed, where they came from, and the extra skills those plugins provide. It also keeps local copies of downloaded plugins so they don’t need to be fetched again.

```
~/.claude/plugins/
├── config.json
│   Global plugin configuration (e.g., enable/disable rules)
├── installed_plugins.json
│   List of installed plugins (including version and status)
├── known_marketplaces.json
│   Plugin marketplace source configuration (e.g., Anthropic official marketplace)
├── cache/
│   Plugin download cache (avoids repeated downloads)
└── marketplaces/
    Marketplace source storage
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
```

  

**(2) skills/ — Where Skills Are Stored and Applied**

In Claude Code, a skill is a small, reusable ability that helps Claude perform a specific task, such as working with PDFs, editing documents, or following a coding workflow.

Not all skills are available everywhere. Some apply globally, while others are limited to a single project or provided by a plugin. Claude Code stores skills in different locations to control where each skill can be used.

The hierarchy below shows how skills are layered by scope, from globally available skills to project-specific and plugin-provided ones.

| Level | Storage Location | Description |
| --- | --- | --- |
| User | ~/.claude/skills/ | Globally available, accessible by all projects |
| Project | project/.claude/skills/ | Available only to the current project, project-specific customization |
| Plugin | ~/.claude/plugins/marketplaces/*/skills/ | Installed with plugins, dependent on plugin enablement status |

  
  

**(3) todos/ — Task List Storage**

The `todos/` directory stores task lists that Claude creates to track work during a conversation, such as steps to complete, items in progress, and completed tasks.

Task lists are saved as JSON files under`~/.claude/todos/{session-id}-*.json`.Each filename includes the session ID, which ties the task list to a specific conversation.

The contents of these files come from the `TodoWrite` tool and include basic task information such as the task description, current status, priority, and related metadata.

**(4) local/ — Local Runtime and Tools**

The `local/` directory holds the core files Claude Code needs to run on your machine.

This includes the `claude` command-line executable and the `node_modules/` directory that contains its runtime dependencies. By keeping these components local, Claude Code can run independently, without depending on external services or system-wide installations.

  

**（5）Additional Supporting Directories**

-   **shell-snapshots/:** Stores shell session state snapshots (such as current directory and environment variables), enabling shell operation rollback.
    
-   **plans/:** Stores execution plans generated by Plan Mode (e.g., step-by-step breakdowns of multi-step programming tasks).
    
-   **statsig/:** Caches feature flag configurations (such as whether new features are enabled) to reduce repeated requests.
    
-   **telemetry/:** Stores anonymous telemetry data (such as feature usage frequency) for product optimization.
    
-   **debug/:** Stores debug logs (including error stacks and execution traces) to aid troubleshooting.
    

## Conclusion

After digging through how Claude Code stores and manages everything locally, the picture becomes pretty clear: the tool feels stable because the foundation is solid. Nothing fancy — just thoughtful engineering. Each project has its own space, every action gets written down, and file edits are backed up before anything changes. It’s the kind of design that quietly does its job and lets you focus on yours.

What I like most is that there’s nothing mystical going on here. Claude Code works well because the basics are done right. If you’ve ever tried to build an agent that touches real files, you know how easy it is for things to fall apart — state gets mixed, crashes wipe progress, and undo becomes guesswork. Claude Code avoids all of that with a storage model that’s simple, consistent, and hard to break.

For teams building local or on-prem AI agents, especially in secure environments, this approach shows how strong storage and persistence make AI tools reliable and practical for everyday development.

If you’re designing local or on-prem AI agents and want to discuss storage architecture, session design, or safe rollback in more detail, feel free to join our [Slack channel](https://milvusio.slack.com/join/shared_invite/zt-3nntzngkz-gYwhrdSE4~76k0VMyBfD1Q#/shared-invite/email).You can also book a 20-minute one-on-one through [Milvus Office Hours](https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md) for personalized guidance.
