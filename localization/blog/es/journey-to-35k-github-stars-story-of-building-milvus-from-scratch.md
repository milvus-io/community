---
id: journey-to-35k-github-stars-story-of-building-milvus-from-scratch.md
title: >
  Our Journey to 35K+ GitHub Stars: The Real Story of Building Milvus from
  Scratch
author: Zilliz
date: 2025-06-27T00:00:00.000Z
cover: assets.zilliz.com/Github_star_30_K_2_f329467096.png
tag: Announcements
recommend: true
publishToMedium: true
tags: 'Milvus, vector database, vector search, AI Agents, LLM'
meta_keywords: 'Milvus, vector database, vector search, AI search, Zilliz Cloud'
meta_title: |
  Our Journey to 35K+ GitHub Stars: Building Milvus from Scratch
desc: >-
  Join us in celebrating Milvus, the vector database that hit 35.5K stars on
  GitHub. Discover our story and how we’re making AI solutions easier for
  developers.
origin: >-
  https://milvus.io/blog/journey-to-35k-github-stars-story-of-building-milvus-from-scratch.md
---
<p>For the past few years, we’ve been focused on one thing: building an enterprise-ready vector database for the AI era. The hard part isn’t building <em>a</em> database—it’s building one that’s scalable, easy to use, and actually solves real problems in production.</p>
<p>This June, we reached a new milestone: Milvus hit <a href="https://github.com/milvus-io/milvus">35,000 stars on GitHub</a> (now it has 35.5K+ stars at the time of writing). We’re not going to pretend this is just another number—it means a lot to us.</p>
<p>Each star represents a developer who took the time to look at what we’ve built, found it useful enough to bookmark, and in many cases, decided to use it. Some of you have gone further: filing issues, contributing code, answering questions in our forums, and helping other developers when they get stuck.</p>
<p>We wanted to take a moment to share our story—the real one, with all the messy parts included.</p>
<h2 id="We-Started-Building-Milvus-Because-Nothing-Else-Worked" class="common-anchor-header">We Started Building Milvus Because Nothing Else Worked<button data-href="#We-Started-Building-Milvus-Because-Nothing-Else-Worked" class="anchor-icon" translate="no">
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
    </button></h2><p>Back in 2017, we started with a simple question: As AI applications were starting to emerge and unstructured data was exploding, how do you efficiently store and search the vector embeddings that power semantic understanding?</p>
<p>Traditional databases weren’t built for this. They’re optimized for rows and columns, not high-dimensional vectors. The existing technologies and tools were either impossible or painfully slow for what we needed.</p>
<p>We tried everything available. Hacked together solutions with Elasticsearch. Built custom indexes on top of MySQL. Even experimented with FAISS, but it was designed as a research library, not a production database infrastructure. Nothing provided the complete solution we envisioned for enterprise AI workloads.</p>
<p><strong>So we started building our own.</strong> Not because we thought it would be easy—databases are notoriously hard to get right—but because we could see where AI was heading and knew it needed purpose-built infrastructure to get there.</p>
<p>By 2018, we were deep into developing what would become <a href="https://milvus.io/">Milvus</a>. The term &quot;<strong>vector database</strong>&quot; didn’t even exist yet. We were essentially creating a new category of infrastructure software, which was both exciting and terrifying.</p>
<h2 id="Open-Sourcing-Milvus-Building-in-Public" class="common-anchor-header">Open-Sourcing Milvus: Building in Public<button data-href="#Open-Sourcing-Milvus-Building-in-Public" class="anchor-icon" translate="no">
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
    </button></h2><p>In November 2019, we decided to open-source Milvus version 0.10.</p>
<p>Open-sourcing means exposing all your flaws to the world. Every hack, every TODO comment, every design decision you’re not entirely sure about. But we believed that if vector databases were going to become critical infrastructure for AI, they needed to be open and accessible to everyone.</p>
<p>The response was overwhelming. Developers didn’t just use Milvus—they improved it. They found bugs we’d missed, suggested features we hadn’t considered, and asked questions that made us think harder about our design choices.</p>
<p>In 2020, we joined the <a href="https://lfaidata.foundation/">LF AI &amp; Data Foundation</a>. This wasn’t just for credibility—it taught us how to maintain a sustainable open-source project. How to handle governance, backward compatibility, and building software that lasts years, not months.</p>
<p>By 2021, we released Milvus 1.0 and <a href="https://lfaidata.foundation/projects/milvus/">graduated from LF AI &amp; Data Foundation</a>. That same year, we won the <a href="https://big-ann-benchmarks.com/neurips21.html">BigANN global challenge</a> for billion-scale vector search. That win felt good, but more importantly, it validated that we were solving real problems the right way.</p>
<h2 id="The-Hardest-Decision-Starting-Over" class="common-anchor-header">The Hardest Decision: Starting Over<button data-href="#The-Hardest-Decision-Starting-Over" class="anchor-icon" translate="no">
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
    </button></h2><p>Here’s where things get complicated. By 2021, Milvus 1.0 was working well for many use cases, but enterprise customers kept asking for the same things: better cloud-native architecture, easier horizontal scaling, more operational simplicity.</p>
<p>We had a choice: patch our way forward or rebuild from the ground up. We chose to rebuild.</p>
<p>Milvus 2.0 was essentially a complete rewrite. We introduced a fully decoupled storage-compute architecture with dynamic scalability. It took us two years and was honestly one of the most stressful periods in our company’s history. We were throwing away a working system that thousands of people were using to build something unproven.</p>
<p><strong>But when we released Milvus 2.0 in 2022, it transformed Milvus from a powerful vector database into production-ready infrastructure that could scale to enterprise workloads.</strong> That same year, we also completed a <a href="https://zilliz.com/news/vector-database-company-zilliz-series-b-extension">Series B+ funding round</a>—not to burn money, but to double down on product quality and support for global customers. We knew this path would take time, but every step had to be built on a solid foundation.</p>
<h2 id="When-Everything-Accelerated-with-AI" class="common-anchor-header">When Everything Accelerated with AI<button data-href="#When-Everything-Accelerated-with-AI" class="anchor-icon" translate="no">
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
    </button></h2><p>2023 was the year of <a href="https://zilliz.com/learn/Retrieval-Augmented-Generation">RAG</a> (retrieval-augmented generation). Suddenly, semantic search went from an interesting AI technique to essential infrastructure for chatbots, document Q&amp;A systems, and AI agents.</p>
<p>The GitHub stars of Milvus spiked. Support requests multiplied. Developers who had never heard of vector databases were suddenly asking sophisticated questions about indexing strategies and query optimization.</p>
<p>This growth was exciting but also overwhelming. We realized we needed to scale not just our technology, but our entire approach to community support. We hired more developer advocates, completely rewrote our documentation, and started creating educational content for developers new to vector databases.</p>
<p>We also launched <a href="https://zilliz.com/cloud">Zilliz Cloud</a>—our fully managed version of Milvus. Some people asked why we were “commercializing” our open-source project. The honest answer is that maintaining enterprise-grade infrastructure is expensive and complex. Zilliz Cloud allows us to sustain and accelerate Milvus development while keeping the core project completely open source.</p>
<p>Then came 2024. <a href="https://zilliz.com/blog/zilliz-named-a-leader-in-the-forrester-wave-vector-database-report"><strong>Forrester named us a leader</strong></a> <strong>in the vector database category.</strong> Milvus passed 30,000 GitHub stars. <strong>And we realized: the road we’d been paving for seven years had finally become the highway.</strong> As more enterprises adopted vector databases as critical infrastructure, our business growth accelerated rapidly—validating that the foundation we’d built could scale both technically and commercially.</p>
<h2 id="The-Team-Behind-Milvus-Zilliz" class="common-anchor-header">The Team Behind Milvus: Zilliz<button data-href="#The-Team-Behind-Milvus-Zilliz" class="anchor-icon" translate="no">
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
    </button></h2><p>Here’s something interesting: many people know Milvus but not Zilliz. We’re actually fine with that. <a href="https://zilliz.com/"><strong>Zilliz</strong></a> <strong>is the team behind Milvus—we build it, maintain it, and support it.</strong></p>
<p>What we care about most are the unglamorous things that make the difference between a cool demo and production-ready infrastructure: performance optimizations, security patches, documentation that actually helps beginners, and responding thoughtfully to GitHub issues.</p>
<p>We’ve built a 24/7 global support team across the U.S., Europe, and Asia, because developers need help in their time zones, not ours. We have community contributors we call &quot;<a href="https://docs.google.com/forms/d/e/1FAIpQLSfkVTYObayOaND8M1ci9eF_YWvoKDb-xQjLJYZ-LhbCdLAt2Q/viewform">Milvus Ambassadors</a>&quot; who organize events, answer forum questions, and often explain concepts better than we do.</p>
<p>We’ve also welcomed integrations with AWS, GCP, and other cloud providers—even when they offer their own managed versions of Milvus. More deployment options are good for users. Though we’ve noticed that when teams hit complex technical challenges, they often end up reaching out to us directly because we understand the system at the deepest level.</p>
<p>Many people think open source is just a “toolbox,” but it’s actually an &quot;evolutionary process&quot;—a collective effort by countless people who love and believe in it. Only those who truly understand the architecture can provide the “why” behind bug fixes, performance bottleneck analysis, data system integration, and architectural adjustments.</p>
<p><strong>So if you’re using open-source Milvus, or considering vector databases as a core component of your AI system, we encourage you to reach out to us directly for the most professional and timely support.</strong></p>
<h2 id="Real-Impact-in-Production-The-Trust-from-Users" class="common-anchor-header">Real Impact in Production: The Trust from Users<button data-href="#Real-Impact-in-Production-The-Trust-from-Users" class="anchor-icon" translate="no">
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
    </button></h2><p>The use cases for Milvus have grown beyond what we initially imagined. We’re powering AI infrastructure for some of the world’s most demanding enterprises across every industry.</p>
<p>
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/zilliz_customers_e7340d5dd4.png" alt="zilliz customers.png" class="doc-image" id="zilliz-customers.png" />
    <span>zilliz customers.png</span>
  </span>
</p>
<p><a href="https://zilliz.com/customers/bosch"><strong>Bosch</strong></a>, the global automotive technology leader and pioneer in autonomous driving, revolutionized their data analysis with Milvus achieving 80% reduction in data collection costs and $1.4M annual savings while searching billions of driving scenarios in milliseconds for critical edge cases.</p>
<p><a href="https://zilliz.com/customers/read-ai"><strong>Read AI</strong></a>, one of the fastest-growing productivity AI companies serving millions of monthly active users, uses Milvus to achieve sub-20-50ms retrieval latency across billions of records and 5× speedup in agentic search. Their CTO says, “Milvus serves as the central repository and powers our information retrieval among billions of records.”</p>
<p><a href="https://zilliz.com/customers/global-fintech-leader"><strong>A global fintech leader</strong></a>, one of the world’s largest digital payment platforms processing tens of billions of transactions across 200+ countries and 25+ currencies, chose Milvus for 5-10× faster batch ingestion than competitors, completing jobs in under 1 hour that took others 8+ hours.</p>
<p><a href="https://zilliz.com/customers/filevine"><strong>Filevine</strong></a>, the leading legal work platform trusted by thousands of law firms across the United States, manages 3 billion vectors across millions of legal documents, saving attorneys 60-80% of time in document analysis and achieving “true consciousness of data” for legal case management.</p>
<p>We’re also supporting <strong>NVIDIA, OpenAI, Microsoft, Salesforce, Walmart,</strong> and many others in almost every industry. Over 10,000 organizations have made Milvus or Zilliz Cloud their vector database of choice.</p>
<p>These aren’t just technical success stories—they’re examples of how vector databases are quietly becoming critical infrastructure that powers the AI applications people use every day.</p>
<h2 id="Why-We-Built-Zilliz-Cloud-Enterprise-Grade-Vector-Database-as-a-Service" class="common-anchor-header">Why We Built Zilliz Cloud: Enterprise-Grade Vector Database as a Service<button data-href="#Why-We-Built-Zilliz-Cloud-Enterprise-Grade-Vector-Database-as-a-Service" class="anchor-icon" translate="no">
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
    </button></h2><p>Milvus is open-source and free to use. But running Milvus well at enterprise scale requires deep expertise and significant resources. Index selection, memory management, scaling strategies, security configurations—these aren’t trivial decisions. Many teams want the power of Milvus without the operational complexity and with enterprise support, SLA guarantees, etc.</p>
<p>That’s why we built <a href="https://zilliz.com/cloud">Zilliz Cloud</a>—a fully managed version of Milvus deployed across 25 global regions and 5 major clouds, including AWS, GCP, and Azure, designed specifically for enterprise-scale AI workloads that demand performance, security, and reliability.</p>
<p>Here’s what makes Zilliz Cloud different:</p>
<ul>
<li><p><strong>Massive Scale with High Performance:</strong> Our proprietary AI-powered AutoIndex engine delivers 3-5× faster query speeds than open-source Milvus, with zero index tuning required. The cloud-native architecture supports billions of vectors and tens of thousands of concurrent queries while maintaining sub-second response times.</p></li>
<li><p><a href="https://zilliz.com/trust-center"><strong>Built-in Security &amp; Compliance</strong></a><strong>:</strong> Encryption at rest and in transit, fine-grained RBAC, comprehensive audit logging, SAML/OAuth2.0 integration, and <a href="https://zilliz.com/bring-your-own-cloud">BYOC</a> (bring your own cloud) deployments. We’re compliant with GDPR, HIPAA, and other global standards that enterprises actually need.</p></li>
<li><p><strong>Optimized for Cost-Efficiency:</strong> Tiered hot/cold data storage, elastic scaling that responds to real workloads, and pay-as-you-go pricing can reduce total cost of ownership by 50% or more compared to self-managed deployments.</p></li>
<li><p><strong>Truly Cloud-Agnostic without vendor lock-in:</strong> Deploy on AWS, Azure, GCP, Alibaba Cloud, or Tencent Cloud without vendor lock-in. We ensure global consistency and scalability regardless of where you run.</p></li>
</ul>
<p>These capabilities might not sound flashy, but they solve real, daily problems that enterprise teams face when building AI applications at scale. And most importantly: it’s still Milvus under the hood, so there’s no proprietary lock-in or compatibility issues.</p>
<h2 id="Whats-Next-Vector-Data-Lake" class="common-anchor-header">What’s Next: Vector Data Lake<button data-href="#Whats-Next-Vector-Data-Lake" class="anchor-icon" translate="no">
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
    </button></h2><p>We coined the term &quot;<a href="https://zilliz.com/learn/what-is-vector-database">vector database</a>&quot; and were the first to build one, but we’re not stopping there. We’re now building the next evolution: <strong>Vector Data Lake.</strong></p>
<p><strong>Here’s the problem we’re solving: not every vector search needs millisecond latency.</strong> Many enterprises have massive datasets that are queried occasionally, including historical document analysis, batch similarity computations, and long-term trend analysis. For these use cases, a traditional real-time vector database is both overkill and expensive.</p>
<p>Vector Data Lake uses a storage-compute separated architecture specifically optimized for massive-scale, infrequently accessed vectors while keeping costs dramatically lower than real-time systems.</p>
<p><strong>Core capabilities include:</strong></p>
<ul>
<li><p><strong>Unified Data Stack:</strong> Seamlessly connects online and offline data layers with consistent formats and efficient storage, so you can move data between hot and cold tiers without reformatting or complex migrations.</p></li>
<li><p><strong>Compatible Compute Ecosystem:</strong> Works natively with frameworks like Spark and Ray, supporting everything from vector search to traditional ETL and analytics. This means your existing data teams can work with vector data using tools they already know.</p></li>
<li><p><strong>Cost-Optimized Architecture:</strong> Hot data stays on SSD or NVMe for fast access; cold data automatically moves to object storage like S3. Smart indexing and storage strategies keep I/O fast when you need it while making storage costs predictable and affordable.</p></li>
</ul>
<p>This isn’t about replacing vector databases—it’s about giving enterprises the right tool for each workload. Real-time search for user-facing applications, cost-effective vector data lakes for analytics and historical processing.</p>
<p>We still believe in the logic behind Moore’s Law and Jevons Paradox: as the unit cost of computing drops, adoption scales. The same applies to vector infrastructure.</p>
<p>By improving indexes, storage structures, caching, and deployment models—day in, day out—we hope to make AI infrastructure more accessible and affordable for everyone, and to help bring unstructured data into the AI-native future.</p>
<h2 id="A-Big-Thanks-to-You-All" class="common-anchor-header">A Big Thanks to You All!<button data-href="#A-Big-Thanks-to-You-All" class="anchor-icon" translate="no">
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
    </button></h2><p>Those 35K+ stars represent something we’re genuinely proud of: a community of developers who find Milvus useful enough to recommend and contribute to.</p>
<p>But we’re not done. Milvus has bugs to fix, performance improvements to make, and features our community has been asking for. Our roadmap is public, and we genuinely want your input on what to prioritize.</p>
<p>The number itself isn’t what matters—it’s the trust those stars represent. Trust that we’ll keep building in the open, keep listening to feedback, and keep making Milvus better.</p>
<ul>
<li><p><strong>To our contributors:</strong> your PRs, bug reports, and documentation improvements make Milvus better every day. Thank you so much.</p></li>
<li><p><strong>To our users:</strong> thank you for trusting us with your production workloads and for the feedback that keeps us honest.</p></li>
<li><p><strong>To our community:</strong> thank you for answering questions, organizing events, and helping newcomers get started.</p></li>
</ul>
<p>If you’re new to vector databases, we’d love to help you get started. If you’re already using Milvus or Zilliz Cloud, we’d love to <a href="https://zilliz.com/share-your-story">hear about your experience</a>. And if you’re just curious about what we’re building, our community channels are always open.</p>
<p>Let’s keep building the infrastructure that makes AI applications possible—together.</p>
<hr>
<p>Find us here: <a href="https://github.com/milvus-io/milvus">Milvus on GitHub</a> |<a href="https://zilliz.com/"> Zilliz Cloud</a> |<a href="https://discuss.milvus.io/"> Discord</a> | <a href="https://www.linkedin.com/company/the-milvus-project/">LinkedIn</a> | <a href="https://x.com/zilliz_universe">X</a> | <a href="https://www.youtube.com/@MilvusVectorDatabase/featured">YouTube</a></p>
<p><a href="https://meetings.hubspot.com/chloe-williams1/milvus-office-hour?__hstc=175614333.dc4bcf53f6c7d650ea8978dcdb9e7009.1727350436713.1751017913702.1751029841530.667&amp;__hssc=175614333.3.1751029841530&amp;__hsfp=3554976067">
  <span class="img-wrapper">
    <img translate="no" src="https://assets.zilliz.com/office_hour_4fb9130a9b.png" alt="" class="doc-image" id="" />
    <span></span>
  </span>
</a></p>
