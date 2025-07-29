---
id: build-open-source-alternative-to-cursor-with-code-context.md
title: >
 Building an Open-Source Alternative to Cursor with Code Context
author: Cheney Zhang
date: 2025-07-24
cover: assets.zilliz.com/Chat_GPT_Image_Jul_26_2025_08_26_35_PM_b728fb730c.png
tag: Engineering
recommend: false
publishToMedium: true
tags: vector database, mcp, LLM, claude, gemini
meta_keywords: Cursor, Claude Code, Gemini CLI, Code search, semantic code search
meta_title: > 
 Building an Open-Source Alternative to Cursor with Code Context
desc: Code Context—an open-source, MCP-compatible plugin that brings powerful semantic code search to any AI coding agent, Claude Code and Gemini CLI, IDEs like VSCode, and even environments like Chrome.
origin: https://milvus.io/blog/build-open-source-alternative-to-cursor-with-code-context.md
---



## The AI Coding Boom—And Its Blind Spot

AI coding tools are everywhere—and they’re going viral for good reason. From [Claude Code, Gemini CLI](https://milvus.io/blog/claude-code-vs-gemini-cli-which-ones-the-real-dev-co-pilot.md) to open-source Cursor alternatives, these agents can write functions, explain code dependency, and refactor entire files with a single prompt. Developers are racing to integrate them into their workflows, and in many ways, they’re delivering on the hype.

**But when it comes to _understanding your codebase_, most AI tools hit a wall.**

Ask Claude Code to find “where this project handles user authentication,” and it falls back on `grep -r "auth"`—spitting out 87 loosely related matches across comments, variable names, and filenames, likely missing many functions with authentication logic but not called “auth”. Try Gemini CLI, and it’ll look for keywords like “login” or “password,” missing functions like `verifyCredentials()` entirely. These tools are great at generating code, but when it’s time to navigate, debug, or explore unfamiliar systems, they fall apart. Unless they send the entire codebase to the LLM for context—burning through tokens and time—they struggle to provide meaningful answers.

_That’s the real gap in today’s AI tooling:_ **_code context._** 


## Cursor Nailed It—But Not for Everyone

**Cursor** tackles this head-on. Instead of keyword search, it builds a semantic map of your codebase using syntax trees, vector embeddings, and code-aware search. Ask it “where’s the email validation logic?” and it returns `isValidEmailFormat()` —not because the name matches, but because it understands what that code _does_.

While Cursor is powerful, it may not be suitable for everyone. **_Cursor is closed-source, cloud-hosted, and subscription-based._** That puts it out of reach for teams working with sensitive code, security-conscious organizations, indie developers, students, and anyone who prefers open systems.


## What if You Could Build Your Own Cursor?

Here’s the thing: the core technology behind Cursor isn’t proprietary. It’s built on proven open-source foundations—vector databases like [Milvus](https://milvus.io/), [embedding models](https://zilliz.com/ai-models), syntax parsers with Tree-sitter—all available to anyone willing to connect the dots.

_So, we asked:_ **_What if anyone could build their own Cursor?_** Runs on your infrastructure. No subscription fees. Fully customizable. Complete control over your code and data.

That’s why we built [**Code Context**](https://github.com/zilliztech/code-context)—an open-source, MCP-compatible plugin that brings powerful semantic code search to any AI coding agent, such as Claude Code and Gemini CLI, IDEs like VSCode, and even environments like Google Chrome. It also gives you the power to build your own coding agent like Cursor from scratch, unlocking real-time, intelligent navigation of your codebase.

**_No subscriptions. No black boxes. Just code intelligence—on your terms._**

In the rest of this post, we’ll walk through how Code Context works—and how you can start using it today.


## Code Context: Open-Source Alternative to Cursor's Intelligence

[**Code Context**](https://github.com/zilliztech/code-context) is an open-source, MCP-compatible semantic code search engine. Whether you're building a custom AI coding assistant from scratch or adding semantic awareness to AI coding agents like Claude Code and Gemini CLI, Code Context is the engine that makes it possible.

It runs locally, integrates with your favorite tools and environments, such as VS Code and Chrome browsers, and delivers robust code understanding without relying on cloud-only, closed-source platforms.

**Core capabilities include:**

- **Semantic Code Search via Natural Language:** Find code using plain English. Search for concepts like “user login verification” or “payment processing logic,” and Code Context locates the relevant functions—even if they don’t match the keywords exactly.

- **Multi-Language Support:** Search seamlessly across 15+ programming languages, including JavaScript, Python, Java, and Go, with consistent semantic understanding across them all.

- **AST-Based Code Chunking:** Code is automatically split into logical units, such as functions and classes, using AST parsing, ensuring search results are complete, meaningful, and never cut off mid-function.

- **Live, Incremental Indexing:** Code changes are indexed in real time. As you edit files, the search index stays up to date—no need for manual refreshes or re-indexing.

- **Fully Local, Secure Deployment:** Run everything on your own infrastructure. Code Context supports local models via Ollama and indexing via [Milvus](https://milvus.io/), so your code never leaves your environment.

- **First-Class IDE Integration:** The VSCode extension lets you search and jump to results instantly—right from your editor, with zero context switching.

- **MCP Protocol Support:** Code Context speaks MCP, making it easy to integrate with AI coding assistants and bring semantic search directly into their workflows.

- **Browser Plugin Support:** Search repositories directly from GitHub in your browser—no tabs, no copy-pasting, just instant context wherever you’re working.


### How Code Context Works

![](https://assets.zilliz.com/How_Code_Context_Works_3faaa2fff3.png)

Code Context uses a modular architecture with a core orchestrator and specialized components for embedding, parsing, storage, and retrieval. 


### The Core Module: Code Context Core 

At the heart of Code Context is the **Code Context Core**, which coordinates code parsing, embedding, storage, and semantic retrieval:

- **Text Processing Module** splits and parses code using Tree-sitter for language-aware AST analysis.

- **Embedding Interface** supports pluggable backends—currently OpenAI and VoyageAI—converting code chunks into vector embeddings that capture their semantic meaning and contextual relationships. 

- **The Vector Database Interface** stores these embeddings in a self-hosted [Milvus](https://milvus.io/) instance (by default) or in [Zilliz Cloud](https://zilliz.com/cloud), the managed version of Milvus. 

All of this is synchronized with your file system on a scheduled basis, ensuring the index stays up to date without requiring manual intervention.


### Extension Modules on top of Code Context Core

- **VSCode Extension**: Seamless IDE integration for fast in-editor semantic search and jump-to-definition.

- **Chrome Extension**: Inline semantic code search while browsing GitHub repositories—no need to switch tabs.

- **MCP Server**: Exposes Code Context to any AI coding assistants via the MCP protocol, enabling real-time, context-aware assistance.


## Getting Started with Code Context 

Code Context can be plugged into coding tools you already use or to build a custom AI coding assistant from scratch. In this section, we’ll walk through both scenarios:

- How to integrate Code Context with existing tools 

- How to set up the Core Module for standalone semantic code search when building your own AI coding assistant 


### MCP Integration

Code Context supports **Model Context Protocol (MCP)**, allowing AI coding agents like Claude Code to use it as a semantic backend.

To integrate with Claude Code:

```
claude mcp add code-context -e OPENAI_API_KEY=your-openai-api-key -e MILVUS_ADDRESS=your-zilliz-cloud-public-endpoint -e MILVUS_TOKEN=your-zilliz-cloud-api-key -- npx @zilliz/code-context-mcp@latest
```

![](https://assets.zilliz.com/mcp_code_context_processed_3908097481.gif)

Once configured, Claude Code will automatically call Code Context for semantic code search when needed.

To integrate with other tools or environments, check out our[ GitHub repo](https://github.com/zilliztech/code-context) for more examples and adapters.

![](https://assets.zilliz.com/MCP_Integration_2_683c7ef73d.png)


### Building Your Own AI Coding Assistant with Code Context

To build a custom AI assistant using Code Context, you'll set up the core module for semantic code search in just three steps:

1. Configure your embedding model

2. Connect to your vector database

3. Index your project and start searching

Here’s an example using **OpenAI Embeddings** and [**Zilliz Cloud**](https://zilliz.com/cloud) **vector database** as the vector backend:

```
import { CodeContext, MilvusVectorDatabase, OpenAIEmbedding } from '@zilliz/code-context-core';

// Initialize embedding model
const embedding = new OpenAIEmbedding({
    apiKey: 'your-openai-api-key',
    model: 'text-embedding-3-small'
});

// Initialize Zilliz Cloud vector database
// Sign up for free at https://zilliz.com/cloud
const vectorDatabase = new MilvusVectorDatabase({
    address: 'https://xxx-xxxxxxxxxxxx.serverless.gcp-us-west1.cloud.zilliz.com',
    token: 'xxxxxxx'
});

// Create the Code Context indexer
const context = new CodeContext({ embedding, vectorDatabase });

// Index the codebase
await context.indexCodebase('./your-project');

// Perform semantic code search
const results = await context.semanticSearch('./your-project', 'vector database operations', 5);
results.forEach(result => {
    console.log(`${result.relativePath}:${result.startLine}-${result.endLine}`);
    console.log(`score: ${(result.score * 100).toFixed(2)}%`);
});
```



### VSCode Extension

Code Context is available as a VSCode extension named **"Semantic Code Search"**, which brings intelligent, natural language–driven code search directly into your editor.

![](https://assets.zilliz.com/VS_Code_Extension_e358f36464.png)


Once installed:

- Configure your API key

- Index your project

- Use plain English queries (no exact match needed)

- Jump to results instantly with click-to-navigate

![](https://assets.zilliz.com/mcp_code_context_processed_3908097481.gif)


This makes semantic exploration a native part of your coding workflow—no terminal or browser required.


### Chrome Extension (Coming Soon)

Our upcoming **Chrome extension** brings Code Context to GitHub web pages, allowing you to run semantic code search directly inside any public repository—no context switching or tabs required.

![](https://assets.zilliz.com/chrome_4e67b683d7.gif)

You’ll be able to explore unfamiliar codebases with the same deep search capabilities you have locally. Stay tuned—the extension is in development and launching soon.


## Why Use Code Context?

The basic setup gets you running quickly, but where **Code Context** truly shines is in professional, high-performance development environments. Its advanced features are designed to support serious workflows, from enterprise-scale deployments to custom AI tooling.


### Private Deployment for Enterprise-Grade Security

Code Context supports fully offline deployment using the **Ollama** local embedding model and **Milvus** as a self-hosted vector database. This enables an entirely private code search pipeline: no API calls, no internet transmission, and no data ever leaves your local environment.

This architecture is ideal for industries with strict compliance requirements—such as finance, government, and defense—where code confidentiality is non-negotiable.


### Real-Time Indexing with Intelligent File Sync

Keeping your code index up to date shouldn’t be slow or manual. Code Context includes a **Merkle Tree–based file monitoring system** that detects changes instantly and performs incremental updates in real time.

![](https://assets.zilliz.com/workflow_0fd958fe81.jpeg)

By only re-indexing modified files, it reduces update times for large repositories from minutes to seconds. This ensures the code you just wrote is already searchable, without needing to click “refresh.”

In fast-paced dev environments, that kind of immediacy is critical.


### AST Parsing That Understands Code Like You Do

Traditional code search tools split text by line or character count, often breaking logical units and returning confusing results.

![](https://assets.zilliz.com/AST_Parsing_That_Understands_Code_Like_You_Do_3236afc075.png)

Code Context does better. It utilizes Tree-sitter AST parsing to comprehend the actual code structure. It identifies complete functions, classes, interfaces, and modules, providing clean, semantically complete results.

It supports major programming languages, including JavaScript/TypeScript, Python, Java, C/C++, Go, and Rust, with language-specific strategies for accurate chunking. For unsupported languages, it falls back to rule-based parsing, ensuring graceful handling without crashes or empty results.

These structured code units also feed into metadata for more accurate semantic search.


### Open Source and Extensible by Design

Code Context is fully open source under the MIT license. All core modules are publicly available on GitHub.

We believe open infrastructure is the key to building powerful, trustworthy developer tools—and invite developers to extend it for new models, languages, or use cases.


### Solving the Context Window Problem for AI Assistants

Large language models (LLMs) have a hard limit: their context window. This restricts them from seeing an entire codebase, which reduces the accuracy of completions, fixes, and suggestions.

Code Context helps bridge that gap. Its semantic code search retrieves the _right_ pieces of code, giving your AI assistant focused, relevant context to reason with. It improves the quality of AI-generated output by letting the model “zoom in” on what actually matters.

Popular AI coding tools, such as Claude Code and Gemini CLI, lack native semantic code search—they rely on shallow, keyword-based heuristics. Code Context, when integrated via **MCP**, gives them a brain upgrade.


### Built for Developers, by Developers

Code Context is packaged for modular reuse: each component is available as an independent **npm** package. You can mix, match, and extend as needed for your project.

- Need only a semantic code search? Use`@zilliz/code-context-core`

- Want to plug into an AI agent? Add `@zilliz/code-context-mcp`

- Building your own IDE/browser tool? Fork our VSCode and Chrome extension examples

Some example applications of code context:

- **Context-aware autocomplete plugins** that pull relevant snippets for better LLM completions

- **Intelligent bug detectors** that gather surrounding code to improve fix suggestions

- **Safe code refactoring tools** that find semantically related locations automatically

- **Architecture visualizers** that build diagrams from semantic code relationships

- **Smarter code review assistants** that surface historical implementations during PR reviews


## Welcome to Join Our Community

[**Code Context**](https://github.com/zilliztech/code-context) is more than just a tool—it’s a platform for exploring how **AI and vector databases** can work together to truly understand code. As AI-assisted development becomes the norm, we believe semantic code search will be a foundational capability.

We welcome contributions of all kinds:

- Support for new languages

- New embedding model backends

- Innovative AI-assisted workflows

- Feedback, bug reports, and design ideas

Find us here:

- [Code Context on GitHub](https://github.com/zilliztech/code-context) | [**MCP npm package**](https://www.npmjs.com/package/@zilliz/code-context-mcp) | [**VSCode marketplace**](https://marketplace.visualstudio.com/items?itemName=zilliz.semanticcodesearch)

- [Discord](https://discuss.milvus.io/) | [LinkedIn](https://www.linkedin.com/company/the-milvus-project/) | [X](https://x.com/zilliz_universe) | [YouTube](https://www.youtube.com/@MilvusVectorDatabase/featured)

Together, we can build the infrastructure for the next generation of AI development tools—transparent, powerful, and developer-first.

[![](https://assets.zilliz.com/office_hour_83d4623510.png)](https://meetings.hubspot.com/chloe-williams1/milvus-office-hour)
