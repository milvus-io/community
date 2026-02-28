---
id: ai-agents-vs-workflows-why-80-need-simple-automation.md
title: |
  AI Agents or Workflows? Why You Should Skip Agents for 80% of Automation Tasks
author: Min Yin
date: 2025-08-11T00:00:00.000Z
desc: >-
  The integration of Refly and Milvus offers a pragmatic approach to
  automation—one that values reliability and ease of use over unnecessary
  complexity.
cover: >-
  assets.zilliz.com/AI_Agents_or_Workflows_Why_You_Should_Skip_Agents_for_80_of_Automation_Tasks_9f54386e8a.png
tag: Tutorials
recommend: false
publishToMedium: true
tags: 'Milvus, vector database, vector search'
meta_keywords: 'Milvus, AI Agent, workflow, Refly, vector database'
meta_title: |
  AI Agents or Workflows? Why Skip Agents for 80% of Automation
origin: 'https://milvus.io/blog/ai-agents-vs-workflows-why-80-need-simple-automation.md'
---
<p>AI agents are everywhere right now—from coding copilots to customer service bots—and they can be jaw-droppingly good at complex reasoning. Like many of you, I love them. But after building both agents and automation workflows, I’ve learned a simple truth: <strong>agents aren’t the best solution for every problem.</strong></p>
<p>For example, when I built a multi-agent system with CrewAI for decoding ML, things got messy fast. Research agents ignored web crawlers 70% of the time. Summary agents dropped citations. Coordination fell apart whenever tasks weren’t crystal clear.</p>
<p>And it’s not just in experiments. Many of us are already bouncing between ChatGPT for brainstorming, Claude for coding, and a half-dozen APIs for data processing—quietly thinking: <em>there has to be a better way to make all this work together.</em></p>
<p>Sometimes, the answer is an agent. More often, it’s a <strong>well-designed AI workflow</strong> that stitches your existing tools into something powerful, without the unpredictable complexity.</p>
<h2 id="Building-Smarter-AI-Workflows-with-Refly-and-Milvus" class="common-anchor-header">Building Smarter AI Workflows with Refly and Milvus<button data-href="#Building-Smarter-AI-Workflows-with-Refly-and-Milvus" class="anchor-icon" translate="no">
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
    </button></h2><p>I know some of you are already shaking your heads: “Workflows? Those are rigid. They’re not smart enough for real AI automation.” Fair point—most workflows are rigid, because they’re modeled after old-school assembly lines: step A → step B → step C, no deviation allowed.</p>
<p>But the real issue isn’t the <em>idea</em> of workflows—it’s the <em>execution</em>. We don’t have to settle for brittle, linear pipelines. We can design smarter workflows that adapt to context, flex with creativity, and still deliver predictable results.</p>
<p>In this guide, we’ll build a complete content creation system using Refly and Milvus to show why AI workflows can outperform complex multi-agent architectures, especially if you care about speed, reliability, and maintainability.</p>
<h3 id="The-Tools-We’re-Using" class="common-anchor-header">The Tools We’re Using</h3><p><a href="https://refly.ai/"><strong>Refly</strong></a>: An open-source, AI-native content creation platform built around a “free canvas” concept.</p>
<ul>
<li><p><strong>Core capabilities:</strong> intelligent canvas, knowledge management, multi-threaded dialogue, and professional creation tools.</p></li>
<li><p><strong>Why it’s useful:</strong> Drag-and-drop workflow building lets you chain tools together into cohesive automation sequences, without locking you into rigid, single-path execution.</p></li>
</ul>
<p><a href="https://milvus.io/"><strong>Milvus</strong></a>: An open-source vector database handling the data layer.</p>
<ul>
<li><p><strong>Why it matters:</strong> Content creation is mostly about finding and recombining existing information. Traditional databases handle structured data well, but most creative work involves unstructured formats—documents, images, videos.</p></li>
<li><p><strong>What it adds:</strong> Milvus leverages integrated embedding models to encode unstructured data as vectors, enabling semantic search so your workflows can retrieve relevant context with millisecond latency. Through protocols like MCP, it integrates seamlessly with your AI frameworks, letting you query data in natural language instead of wrestling with database syntax.</p></li>
</ul>
<h3 id="Setting-Up-Your-Environment" class="common-anchor-header">Setting Up Your Environment</h3><p>Let me walk you through setting this workflow up locally.</p>
<p><strong>Quick setup checklist:</strong></p>
<ul>
<li><p>Ubuntu 20.04+ (or similar Linux)</p></li>
<li><p>Docker + Docker Compose</p></li>
<li><p>An API key from any LLM that supports function calling. Here in this guide, I’ll use <a href="https://platform.moonshot.ai/docs/introduction#text-generation-model">Moonshot</a>’s LLM.</p></li>
</ul>
<p><strong>System Requirements</strong></p>
<ul>
<li><p>CPU: 8 cores minimum (16 cores recommended)</p></li>
<li><p>Memory: 16GB minimum (32GB recommended)</p></li>
<li><p>Storage: 100GB SSD minimum (500GB recommended)</p></li>
<li><p>Network: Stable internet connection required</p></li>
</ul>
<p><strong>Software Dependencies</strong></p>
<ul>
<li><p>Operating System: Linux (Ubuntu 20.04+ recommended)</p></li>
<li><p>Containerization: Docker + Docker Compose</p></li>
<li><p>Python: Version 3.11 or higher</p></li>
<li><p>Language Model: Any model supporting function calls (online services or Ollama offline deployment both work)</p></li>
</ul>
<h3 id="Step-1-Deploy-the-Milvus-Vector-Database" class="common-anchor-header">Step 1: Deploy the Milvus Vector Database</h3><p><strong>1.1 Download Milvus</strong></p>
<pre><code translate="no">wget https://github.com/milvus-io/milvus/releases/download/v2.5.12/milvus-standalone-docker-compose.yml -O docker-compose.yml
<button class="copy-code-btn"></button></code></pre>
<p><strong>1.2 Launch Milvus services</strong></p>
<pre><code translate="no">docker-compose up -d
docker-compose ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/1_b93ce78614.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-2-Deploy-the-Refly-Platform" class="common-anchor-header">Step 2: Deploy the Refly Platform</h3><p><strong>2.1 Clone the repository</strong></p>
<p>You can use default values for all environment variables unless you have specific requirements:</p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/refly-ai/refly.git
<button class="copy-code-btn"></button></code></pre>
<pre><code translate="no"><span class="hljs-built_in">cd</span> deploy/docker
<span class="hljs-built_in">cp</span> ../../apps/api/.env.example .<span class="hljs-built_in">env</span> <span class="hljs-comment"># copy the example api env file</span>
docker compose up -d
<button class="copy-code-btn"></button></code></pre>
<p><strong>2.2 Verify service status</strong></p>
<pre><code translate="no">docker ps -a
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/2_cfcde2c570.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-3-Set-Up-MCP-Services" class="common-anchor-header">Step 3: Set Up MCP Services</h3><p><strong>3.1 Download the Milvus MCP server</strong></p>
<pre><code translate="no">git <span class="hljs-built_in">clone</span> https://github.com/zilliztech/mcp-server-milvus.git
<span class="hljs-built_in">cd</span> mcp-server-milvus
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.2 Start the MCP service</strong></p>
<p>This example uses SSE mode. Replace the URI with your available Milvus service endpoint:</p>
<pre><code translate="no">uv run src/mcp_server_milvus/server.py --sse --milvus-uri http://localhost:19530 --port 8000
<button class="copy-code-btn"></button></code></pre>
<p><strong>3.3 Confirm MCP service is running</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/3_b755922c41.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<h3 id="Step-4-Configuration-and-Setup" class="common-anchor-header">Step 4: Configuration and Setup</h3><p>Now that your infrastructure is running, let’s configure everything to work together seamlessly.</p>
<p><strong>4.1 Access the Refly platform</strong></p>
<p>Navigate to your local Refly instance:</p>
<pre><code translate="no"><span class="hljs-attr">http</span>:<span class="hljs-comment">//192.168.7.148:5700</span>
<button class="copy-code-btn"></button></code></pre>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/4_c1e421fece.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.2 Create your account</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/42_4b8af22fe3.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/422_e8cd8439f0.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.3 Configure your language model</strong></p>
<p>For this guide, we’ll use <a href="https://platform.moonshot.ai/docs/introduction#text-generation-model">Moonshot</a>. First, register and obtain your API key.</p>
<p><strong>4.4 Add your model provider</strong></p>
<p>Enter the API key you obtained in the previous step:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/44_b085f9a263.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.5 Configure the LLM model</strong></p>
<p>Make sure to select a model that supports function calling capabilities, as this is essential for the workflow integrations we’ll be building:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/45_a05213d0fa.pngQ" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.6 Integrate Milvus-MCP service</strong></p>
<p>Note that the web version doesn’t support stdio-type connections, so we’ll use the HTTP endpoint we set up earlier:</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/46_027e21e479.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/462_959ee44a78.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>Excellent! With everything configured, let’s see this system in action through some practical examples.</p>
<p><strong>4.7 Example: Efficient Vector Retrieval with MCP-Milvus-Server</strong></p>
<p>This example shows how the <strong>MCP-Milvus-Server</strong> works as middleware between your AI models and Milvus vector database instances. It acts like a translator—accepting natural language requests from your AI model, converting them into the right database queries, and returning the results—so your models can work with vector data without knowing any database syntax.</p>
<p><strong>4.7.1 Create a new canvas</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/471_a684e275ed.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p><strong>4.7.2 Start a conversation</strong></p>
<p>Open the dialogue interface, select your model, input your question, and send.</p>
<p><strong>4.7.3 Review the results</strong></p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/473_7c24a28999.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</p>
<p>What’s happening here is pretty remarkable: we’ve just shown natural language control of a Milvus vector database using <a href="https://milvus.io/blog/talk-to-vector-db-manage-milvus-via-natural-language.md">MCP-Milvus-Server</a> as the integration layer. No complex query syntax—just tell the system what you need in plain English, and it handles the database operations for you.</p>
<p><strong>4.8 Example 2: Building a Refly Deployment Guide with Workflows</strong></p>
<p>This second example shows the real power of workflow orchestration. We’ll create a complete deployment guide by combining multiple AI tools and data sources into a single, coherent process.</p>
<p><strong>4.8.1 Gather your source materials</strong></p>
<p>The power of Refly is its flexibility in handling different input formats. You can import resources in multiple formats, whether they’re documents, images, or structured data.</p>
<p><strong>4.8.2 Create tasks and link resource cards</strong></p>
<p>Now we’ll create our workflow by defining tasks and connecting them to our source materials.</p>
<p><strong>4.8.3 Set up three processing tasks</strong></p>
<p>This is where the workflow approach really shines. Instead of trying to handle everything in one complex process, we break the work into three focused tasks that integrate uploaded materials and refine them systematically.</p>
<ul>
<li><p><strong>Content integration task</strong>: Combines and structures source materials</p></li>
<li><p><strong>Content refinement task</strong>: Improves clarity and flow</p></li>
<li><p><strong>Final draft compilation</strong>: Creates publication-ready output</p></li>
</ul>
<p>The results speak for themselves. What would have taken hours of manual coordination across multiple tools is now handled automatically, with each step building logically on the previous one.</p>
<p><strong>Multi-modal workflow capabilities:</strong></p>
<ul>
<li><p><strong>Image generation and processing</strong>: Integration with high-quality models including flux-schnell, flux-pro, and SDXL</p></li>
<li><p><strong>Video generation and understanding</strong>: Support for various stylized video models, including Seedance, Kling, and Veo</p></li>
<li><p><strong>Audio generation tools</strong>: Music generation through models like Lyria-2 and voice synthesis via models like Chatterbox</p></li>
<li><p><strong>Integrated processing</strong>: All multi-modal outputs can be referenced, analyzed, and reprocessed within the system</p></li>
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
    </button></h2><p>The integration of <strong>Refly</strong> and <strong>Milvus</strong> offers a pragmatic approach to automation—one that values reliability and ease of use over unnecessary complexity. By combining workflow orchestration with multi-modal processing, teams can move from concept to publication faster while retaining full control at every stage.</p>
<p>This isn’t about dismissing AI agents. They’re valuable for tackling genuinely complex, unpredictable problems. But for many automation needs—especially in content creation and data processing—a well-designed workflow can deliver better results with less overhead.</p>
<p>As AI tech evolves, the most effective systems will likely blend both strategies:</p>
<ul>
<li><p><strong>Workflows</strong> where predictability, maintainability, and reproducibility are key.</p></li>
<li><p><strong>Agents</strong> where real reasoning, adaptability, and open-ended problem-solving are required.</p></li>
</ul>
<p>The goal isn’t to build the flashiest AI—it’s to build the most <em>useful</em> one. And often, the most helpful solution is also the most straightforward.</p>
