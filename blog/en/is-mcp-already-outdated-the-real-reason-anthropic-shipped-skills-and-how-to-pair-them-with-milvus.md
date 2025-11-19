---
id: is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md
title: >
 Is MCP Already Outdated? The Real Reason Anthropic Shipped Skills—and How to Pair Them with Milvus
author: Min Yin
date: 2025-11-19
cover: assets.zilliz.com/skill_mcp_cover_0b12d0d95d.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: Milvus, vector database
meta_keywords: Claude, Skills, MCP, Milvus, AI workflow
meta_title: Exploring Skills, MCP, and Milvus for Smarter AI Workflows
desc: Learn how Skills works to reduce token consumption, and how Skills and MCP work together with Milvus to enhance AI workflows.
origin: https://milvus.io/blog/is-mcp-already-outdated-the-real-reason-anthropic-shipped-skills-and-how-to-pair-them-with-milvus.md
---

Over the past few weeks, a surprisingly heated argument has erupted across X and Hacker News: _Do we actually need MCP servers anymore?_ Some developers claim MCP is over-engineered, token-hungry, and fundamentally misaligned with how agents should use tools. Others defend MCP as the reliable way to expose real-world capabilities to language models. Depending on which thread you read, MCP is either the future of tool use—or dead on arrival.

![](https://assets.zilliz.com/hackernews_c3236cca2c.png)

The frustration is understandable. MCP gives you robust access to external systems, but it also forces the model to load long schemas, verbose descriptions, and sprawling tool lists. That adds real cost. If you download a meeting transcript and later feed it into another tool, the model may reprocess the same text multiple times, inflating token usage for no obvious benefit. For teams operating at scale, this isn’t an inconvenience—it’s a bill.

But declaring MCP obsolete is premature. Anthropic—the same team that invented MCP—quietly introduced something new: [**Skills**](https://claude.com/blog/skills). Skills are lightweight Markdown/YAML definitions that describe _how_ and _when_ a tool should be used. Instead of dumping full schemas into the context window, the model first reads compact metadata and uses that to plan. In practice, Skills dramatically reduce token overhead and give developers more control over tool orchestration.

So, does this mean Skills will replace MCP? Not quite. Skills streamline planning, but MCP still provides the actual capabilities: reading files, calling APIs, interacting with storage systems, or plugging into external infrastructure like [**Milvus**](https://milvus.io/), an open-source vector database that underpins fast semantic retrieval at scale, making it a critical backend when your Skills need real data access.

This post breaks down what Skills do well, where MCP still matters, and how both fit into Anthropic’s evolving agent architecture. Then we’ll walk through how to build your own Skills that integrate cleanly with Milvus.

## What Are Anthropic Agent Skills and How Do They Work

A long-standing pain point of traditional AI agents is that instructions get washed out as the conversation grows.

Even with the most carefully crafted system prompts, the model’s behavior can gradually drift over the course of the conversation. After several turns, Claude begins to forget or lose focus on the original instructions.

The problem lies in the structure of the system prompt. It is a one-time, static injection that competes for space in the model’s context window, alongside conversation history, documents, and any other inputs. As the context window fills, the model’s attention to the system prompt becomes increasingly diluted, leading to a loss of consistency over time. 

Skills were designed to address this issue. Skills are folders containing instructions, scripts, and resources. Rather than relying on a static system prompt, Skills break down expertise into modular, reusable, and persistent instruction bundles that Claude can discover and load dynamically when needed for a task.

When Claude begins a task, it first performs a lightweight scan of all available Skills by reading only their YAML metadata (just a few dozen tokens). This metadata provides just enough information for Claude to determine if a Skill is relevant to the current task. If so, Claude expands into the full set of instructions (usually under 5k tokens), and additional resources or scripts are loaded only if necessary. 

This progressive disclosure allows Claude to initialize a Skill with just 30–50 tokens, significantly improving efficiency and reducing unnecessary context overhead.

![](https://assets.zilliz.com/how_skills_works_a8563f346c.png)

## How Skills Compares to Prompts, Projects, MCP, and Subagents

Today’s model tooling landscape can feel crowded. Even within Claude's agentic ecosystem alone, there are several distinct components: Skills, prompts, Projects, subagents, and MCP.

Now that we understand what Skills are and how they work through modular instruction bundles and dynamic loading, we need to know how Skills relate to other parts of the Claude ecosystem, especially MCP. Here is a summary:

### 1. Skills

Skills are folders that contain instructions, scripts, and resources. Claude discovers and loads them dynamically using progressive disclosure: first metadata, then full instructions, and finally any required files.

**Best for:**

- Organizational workflows (brand guidelines, compliance procedures)

- Domain expertise (Excel formulas, data analysis)

- Personal preferences (note-taking systems, coding patterns)

- Professional tasks that need to be reused across conversations (OWASP-based code security reviews)

### 2. Prompts

Prompts are the natural-language instructions you give Claude within a conversation. They are temporary and exist only in the current conversation.

**Best for:**

- One-off requests (summarizing an article, formatting a list)

- Conversational refinement (adjusting tone, adding details)

- Immediate context (analyzing specific data, interpreting content)

- Ad-hoc instructions

### 3. Projects

Projects are self-contained workspaces with their own chat histories and knowledge bases. Each project offers a 200K context window. When your project knowledge approaches context limits, Claude transitions seamlessly into RAG mode, allowing up to a 10x expansion in effective capacity.

**Best for:**

- Persistent context (e.g., all conversations related to a product launch)

- Workspace organization (separate contexts for different initiatives)

- Team collaboration (on Team and Enterprise plans)

- Custom instructions (project-specific tone or perspective)

### 4. Subagents

Subagents are specialized AI assistants with their own context windows, custom system prompts, and specific tool permissions. They can work independently and return results to the main agent.

**Best for:**

- Task specialization (code review, test generation, security audits)

- Context management (keep the main conversation focused)

- Parallel processing (multiple subagents working on different aspects simultaneously)

- Tool restriction (e.g., read-only access)

### 5. MCP (Model Context Protocol)

The Model Context Protocol (MCP) is an open standard that connects AI models to external tools and data sources.

**Best for:**

- Accessing external data (Google Drive, Slack, GitHub, databases)

- Using business tools (CRM systems, project management platforms)

- Connecting to development environments (Local files, IDEs, version control)

- Integrating with custom systems (proprietary tools and data sources)

Based on the above, we can see that Skills and MCP address different challenges and work together to complement each other.

| **Dimension**           | **MCP**                                                        | **Skills**                                                              |
| ----------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Core Value**          | Connects to external systems (databases, APIs, SaaS platforms) | Defines behavior specifications (how to process and present data)       |
| **Questions Answered**  | "What can Claude access?"                                      | "What should Claude do?"                                                |
| **Implementation**      | Client-server protocol + JSON Schema                           | Markdown file + YAML metadata                                           |
| **Context Consumption** | Tens of thousands of tokens (multiple server accumulations)    | 30-50 tokens per operation                                              |
| **Use Cases**           | Querying large databases, calling GitHub APIs                  | Defining search strategies, applying filtering rules, output formatting |

Let's take code search as an example.

- **MCP (e.g., claude-context):** Provides the ability to access the Milvus vector database.

- **Skills:** Defines the workflow, such as prioritizing the most recently modified code, sorting results by relevance, and presenting the data in a Markdown table.

MCP provides the capability, while Skills define the process. Together, they form a complementary pair.

## How to Build Custom Skills with Claude-Context and Milvus

[Claude-Context](https://github.com/zilliztech/claude-context) is an MCP plugin that adds semantic code search functionality to Claude Code, turning the entire codebase into Claude’s context.

### Prerequisite

System Requirements:

- **Node.js**: Version >= 20.0.0 and < 24.0.0

- **OpenAI API Key** (for embedding models)

- [**Zilliz Cloud**](https://zilliz.com.cn/) **API Key** (managed Milvus service)

### Step 1: Configure the MCP Service (claude-context)

Run the following command in the terminal:

```
claude mcp add claude-context \
  -e OPENAI_API_KEY=sk-your-openai-api-key \
  -e MILVUS_ADDRESS=https://xxxxxxxxx-cn-hangzhou.cloud.zilliz.com.cn \
  -e MILVUS_TOKEN=your-zilliz-cloud-api-key \
  -e COLLECTION_NAME=medium_articles \
  -- npx @zilliz/claude-context-mcp@latest
```

Check the Configuration:

```
claude mcp list
```

![](https://assets.zilliz.com/Check_the_Configuration_5d2abd5ee8.webp)

The MCP setup is complete. Claude can now access the Milvus vector database.

### Step 2: Create the Skill

Create the Skills directory:

```
mkdir -p ~/.claude/skills/milvus-code-search
cd ~/.claude/skills/milvus-code-search
```

Create the SKILL.md file:

```
---
name: milvus-code-search
description: A semantic code search and architecture analysis skill designed for the Milvus codebase
---

## Instructions
When the user asks questions related to the Milvus codebase, I will:

1. **Code Search** : Use semantic search to locate relevant code snippets across the Milvus repository  
2. **Architecture Analysis** : Analyze Milvus’s module structure, component relationships, and design patterns  
3. **Feature Explanation** : Explain how specific features are implemented and how the corresponding logic works  
4. **Development Guidance** : Provide suggestions, best practices, and improvement ideas for modifying the code  

## Target Repository
- **Core Modules**:  
  - `internal/` — Core internal components  
  - `pkg/` — Public packages and utilities  
  - `client/` — Go client implementation  
  - `cmd/` — Command-line tools  

## Usage Examples

### Architecture Query
User: How does Milvus’s query coordinator work?  
Assistant: *(searching for `querycoordv2`)* Let me walk you through how the query coordinator operates in Milvus…

### Feature Implementation
User: How does Milvus implement vector indexing?  
Assistant: *(searching for `index` code)* The vector indexing logic in Milvus is mainly implemented in the following modules…

### Code Understanding
User: What does this function do? *(points to a specific file)*  
Assistant: *(analyzing the surrounding code)* Based on the context of the Milvus codebase, this function is responsible for…

### Development Guidance
User: How can I add a new vector distance metric to Milvus?  
Assistant: *(searching for `distance` implementations)* Following the existing pattern, you can add a new distance method by…

## Best Practices
1. **Precise Search** : Use specific technical terms and module names  
2. **Contextual Understanding** : Interpret code within Milvus’s overall system architecture  
3. **Actionable Advice** : Provide practical, implementation-ready suggestions  
4. **Performance Awareness** : Consider Milvus’s requirements as a high-performance vector database  

---

*A custom code-search Skill tailored for the open-source Milvus vector database project.*

---
```

### Step 3: Restart Claude to Apply Skills

Run the following command to restart Claude:

```
claude
```

**Note:** After the configuration is complete, you can immediately use the Skills to query the Milvus codebase.

Below is an example of how it works. 

Query: How does Milvus QueryCoord work?

![](https://assets.zilliz.com/code_a95429ddb0.png)

![](https://assets.zilliz.com/code2_d58a942777.png)

![](https://assets.zilliz.com/code3_6c9f835c65.png)

## Conclusion

At its core, Skills act as a mechanism for encapsulating and transferring specialized knowledge. By using Skills, AI can inherit a team's experience and follow industry best practices—whether that’s a checklist for code reviews or documentation standards. When this tacit knowledge is made explicit through Markdown files, the quality of AI-generated outputs can see a significant improvement.

Looking ahead, the ability to leverage Skills effectively could become a key differentiator in how teams and individuals use AI to their advantage. 

As you explore the potential of AI in your organization, Milvus stands as a critical tool for managing and searching large-scale vector data. By pairing Milvus’ powerful vector database with AI tools like Skills, you can improve not only your workflows but also the depth and speed of your data-driven insights.

Have questions or want a deep dive on any feature? Join our[ Discord channel](https://discord.com/invite/8uyFbECzPX) to chat with our engineers and other AI engineers in the community. You can also book a 20-minute one-on-one session to get insights, guidance, and answers to your questions through[ Milvus Office Hours](https://milvus.io/blog/join-milvus-office-hours-to-get-support-from-vectordb-experts.md).